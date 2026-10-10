/* Woven Tails: free in-browser "illustration" preview (no AI, no server).
   Cel-shading + fine ink lines (difference of Gaussians), edge-preserving smoothing.
   wtStylize(image, style, view) -> canvas. style: 'pop' | 'christmas' | 'royal'; view: {zoom, ox, oy} */
(function () {
  const S = 640;

  function cover(img, view) {
    view = view || { zoom: 1, ox: 0, oy: 0 };
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const x = c.getContext('2d');
    const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
    const s = Math.min(w, h) / Math.max(1, view.zoom || 1);
    const sx = Math.min(w - s, Math.max(0, (w - s) / 2 + (view.ox || 0)));
    const sy = Math.min(h - s, Math.max(0, (h - s) / 2 - s * 0.06 + (view.oy || 0)));
    x.imageSmoothingQuality = 'high';
    x.drawImage(img, sx, sy, s, s, 0, 0, S, S);
    return x.getImageData(0, 0, S, S);
  }

  // single-channel box blur (separable), used 3x for a near-Gaussian
  function boxBlur(src, w, h, r) {
    if (r < 1) return src.slice();
    const tmp = new Float32Array(w * h), out = new Float32Array(w * h), n = 2 * r + 1;
    for (let y = 0; y < h; y++) {
      let a = 0; const row = y * w;
      for (let k = -r; k <= r; k++) a += src[row + Math.min(w - 1, Math.max(0, k))];
      for (let x = 0; x < w; x++) { tmp[row + x] = a / n; a += src[row + Math.min(w - 1, x + r + 1)] - src[row + Math.max(0, x - r)]; }
    }
    for (let x = 0; x < w; x++) {
      let a = 0;
      for (let k = -r; k <= r; k++) a += tmp[Math.min(h - 1, Math.max(0, k)) * w + x];
      for (let y = 0; y < h; y++) { out[y * w + x] = a / n; a += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x]; }
    }
    return out;
  }
  const gauss = (c, w, h, r) => boxBlur(boxBlur(boxBlur(c, w, h, r), w, h, r), w, h, r);

  // edge-preserving smoothing on Y/Cb/Cr: bilateral on a 5x5 window, 2 passes
  function bilateral(Y, Cb, Cr, w, h, sc) {
    const inv = -1 / (2 * sc * sc);
    for (let pass = 0; pass < 2; pass++) {
      const nY = new Float32Array(w * h), nB = new Float32Array(w * h), nR = new Float32Array(w * h);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const i = y * w + x, y0 = Y[i];
        let sw = 0, sy = 0, sb = 0, sr = 0;
        for (let dy = -2; dy <= 2; dy++) {
          const yy = Math.min(h - 1, Math.max(0, y + dy));
          for (let dx = -2; dx <= 2; dx++) {
            const j = yy * w + Math.min(w - 1, Math.max(0, x + dx));
            const d = Y[j] - y0, wt = Math.exp(d * d * inv - (dx * dx + dy * dy) * 0.18);
            sw += wt; sy += Y[j] * wt; sb += Cb[j] * wt; sr += Cr[j] * wt;
          }
        }
        nY[i] = sy / sw; nB[i] = sb / sw; nR[i] = sr / sw;
      }
      Y = nY; Cb = nB; Cr = nR;
    }
    return [Y, Cb, Cr];
  }

  window.wtStylize = function (image, style, view) {
    const src = cover(image, view), d = src.data, N = S * S;
    let Y = new Float32Array(N), Cb = new Float32Array(N), Cr = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
      Y[i] = 0.299 * r + 0.587 * g + 0.114 * b; Cb[i] = -0.1687 * r - 0.3313 * g + 0.5 * b; Cr[i] = 0.5 * r - 0.4187 * g - 0.0813 * b;
    }
    // ink lines from the original luminance (detail kept): XDoG-style soft threshold
    const g1 = gauss(Y, S, S, 1), g2 = gauss(Y, S, S, 2);
    const line = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const dog = g1[i] - 0.985 * g2[i];
      line[i] = dog > -1.5 ? 1 : Math.max(0, 1 + Math.tanh((dog + 1.5) * 0.35)); // 1 = paper, 0 = ink
    }

    [Y, Cb, Cr] = bilateral(Y, Cb, Cr, S, S, 18);

    // auto levels on luminance
    const hist = new Uint32Array(256); for (let i = 0; i < N; i++) hist[Math.max(0, Math.min(255, Y[i] | 0))]++;
    let acc = 0, lo = 0, hi = 255; for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc > N * 0.02) { lo = v; break; } }
    acc = 0; for (let v = 255; v >= 0; v--) { acc += hist[v]; if (acc > N * 0.02) { hi = v; break; } }

    const bands = style === 'royal' ? 5 : 6, soft = 0.18;
    const chroma = style === 'royal' ? 0 : 1.75;
    const out = new ImageData(S, S), o = out.data;
    const royalLo = [44, 27, 17], royalHi = [248, 226, 176];
    for (let i = 0; i < N; i++) {
      let t = Math.min(1, Math.max(0, (Y[i] - lo) / Math.max(1, hi - lo)));
      // soft quantization (cel steps with smooth edges)
      const q = t * bands, f = Math.floor(q), fr = q - f;
      const step = fr < 0.5 - soft ? 0 : fr > 0.5 + soft ? 1 : (fr - (0.5 - soft)) / (2 * soft);
      t = Math.min(1, (f + step) / bands) * 0.9 + 0.07;
      const px = i % S, py = (i / S) | 0;
      const e = Math.hypot((px - S / 2) / (S * 0.41), (py - S * 0.52) / (S * 0.48));
      const keep = e < 0.55 ? 1 : e > 0.95 ? 0.15 : 1 - 0.85 * (e - 0.55) / 0.4;
      const ink = 1 - (1 - line[i]) * keep;
      let r, g, b;
      if (style === 'royal') {
        r = royalLo[0] + (royalHi[0] - royalLo[0]) * t; g = royalLo[1] + (royalHi[1] - royalLo[1]) * t; b = royalLo[2] + (royalHi[2] - royalLo[2]) * t;
      } else {
        const yy = t * 255, cb = Cb[i] * chroma, cr = Cr[i] * chroma;
        r = yy + 1.402 * cr; g = yy - 0.3441 * cb - 0.7141 * cr; b = yy + 1.772 * cb;
      }
      const inkC = style === 'royal' ? [36, 22, 14] : [22, 28, 24];
      o[i * 4] = r * ink + inkC[0] * (1 - ink);
      o[i * 4 + 1] = g * ink + inkC[1] * (1 - ink);
      o[i * 4 + 2] = b * ink + inkC[2] * (1 - ink);
      o[i * 4 + 3] = 255;
    }

    // portrait background: fade the room into a solid brand color around the subject
    const bg = style === 'royal' ? [58, 36, 22] : style === 'christmas' ? [244, 238, 227] : [200, 103, 62];
    const rx = S * 0.41, ry = S * 0.48, cx = S / 2, cy = S * 0.52;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const e = Math.hypot((x - cx) / rx, (y - cy) / ry);
      const a = e < 0.84 ? 1 : e > 1.02 ? 0 : 1 - (e - 0.84) / 0.18;
      if (a < 1) { const i = (y * S + x) * 4; o[i] = o[i] * a + bg[0] * (1 - a); o[i + 1] = o[i + 1] * a + bg[1] * (1 - a); o[i + 2] = o[i + 2] * a + bg[2] * (1 - a); }
    }

    const c = document.createElement('canvas'); c.width = c.height = S;
    const x = c.getContext('2d');
    x.putImageData(out, 0, 0);
    if (style === 'royal') {
      x.strokeStyle = '#C99A34'; x.lineWidth = 12; x.beginPath(); x.ellipse(S / 2, S / 2, S * 0.44, S * 0.47, 0, 0, Math.PI * 2); x.stroke();
      x.strokeStyle = 'rgba(255,230,170,.6)'; x.lineWidth = 2; x.beginPath(); x.ellipse(S / 2, S / 2, S * 0.415, S * 0.445, 0, 0, Math.PI * 2); x.stroke();
    } else if (style === 'christmas') {
      const band = S * 0.07;
      x.fillStyle = '#B3262E';
      x.fillRect(0, 0, S, band); x.fillRect(0, S - band, S, band); x.fillRect(0, 0, band, S); x.fillRect(S - band, 0, band, S);
      x.strokeStyle = '#2F5D3A'; x.lineWidth = 6; x.strokeRect(band + 3, band + 3, S - 2 * band - 6, S - 2 * band - 6);
      x.fillStyle = 'rgba(255,255,255,.9)';
      for (let t = 0; t < 52; t++) {
        const side = t % 4, p = ((t * 97) % 100) / 100 * S, q = band * (0.25 + ((t * 37) % 50) / 100);
        const [px, py] = side === 0 ? [p, q] : side === 1 ? [p, S - q] : side === 2 ? [q, p] : [S - q, p];
        x.beginPath(); x.arc(px, py, 2 + (t % 3), 0, Math.PI * 2); x.fill();
      }
    } else {
      x.strokeStyle = '#1F3127'; x.lineWidth = 14; x.strokeRect(7, 7, S - 14, S - 14);
    }
    return c;
  };
})();
