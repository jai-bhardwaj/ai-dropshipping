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


  // ---- background removal: U2-Net (u2netp, Apache-2.0) via onnxruntime-web, all in the browser ----
  const ORT_URL = window.WT_ORT_URL || 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/ort.wasm.min.js';
  const MODEL_URL = window.WT_MODEL_URL || 'https://woventails.com/models/u2netp.onnx';
  let sessionP = null;
  function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  }
  function session() {
    if (!sessionP) sessionP = (async () => {
      if (!window.ort) await loadScript(ORT_URL);
      ort.env.wasm.numThreads = 1;
      ort.env.wasm.wasmPaths = ORT_URL.replace(/[^/]+$/, '');
      return ort.InferenceSession.create(MODEL_URL, { executionProviders: ['wasm'] });
    })();
    sessionP.catch(() => { sessionP = null; });
    return sessionP;
  }
  window.wtWarmup = () => session().catch(() => {});
  const maskCache = {};

  async function segment(img) {
    const M = 320, c = document.createElement('canvas'); c.width = c.height = M;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0, M, M);
    const d = x.getImageData(0, 0, M, M).data;
    let mx = 1; for (let i = 0; i < d.length; i += 4) mx = Math.max(mx, d[i], d[i + 1], d[i + 2]);
    const mean = [0.485, 0.456, 0.406], std = [0.229, 0.224, 0.225], N = M * M, t = new Float32Array(3 * N);
    for (let i = 0; i < N; i++) for (let k = 0; k < 3; k++) t[k * N + i] = (d[i * 4 + k] / mx - mean[k]) / std[k];
    const sess = await session();
    const out = await sess.run({ [sess.inputNames[0]]: new ort.Tensor('float32', t, [1, 3, M, M]) });
    const m = out[sess.outputNames[0]].data;
    let lo = Infinity, hi = -Infinity; for (let i = 0; i < N; i++) { lo = Math.min(lo, m[i]); hi = Math.max(hi, m[i]); }
    const g = new ImageData(M, M);
    for (let i = 0; i < N; i++) { const v = 255 * (m[i] - lo) / Math.max(1e-6, hi - lo); g.data[i * 4] = g.data[i * 4 + 1] = g.data[i * 4 + 2] = v; g.data[i * 4 + 3] = 255; }
    const gc = document.createElement('canvas'); gc.width = gc.height = M; gc.getContext('2d').putImageData(g, 0, 0);
    const up = document.createElement('canvas'); up.width = up.height = S;
    const ux = up.getContext('2d'); ux.imageSmoothingQuality = 'high'; ux.drawImage(gc, 0, 0, S, S);
    const u = ux.getImageData(0, 0, S, S).data, mask = new Float32Array(S * S);
    for (let i = 0; i < S * S; i++) mask[i] = Math.min(1, Math.max(0, (u[i * 4] / 255 - 0.3) / 0.4));
    return mask;
  }

  window.wtStylize = async function (image, style, view) {
    const src = cover(image, view), d = src.data, N = S * S;
    let mask = null;
    const key = JSON.stringify(view || {});
    if (maskCache.img === image && maskCache.key === key) mask = maskCache.mask;
    else try {
      const sc = document.createElement('canvas'); sc.width = sc.height = S; sc.getContext('2d').putImageData(src, 0, 0);
      mask = await segment(sc); Object.assign(maskCache, { img: image, key, mask });
    } catch (e) { console.warn('cutout unavailable, using soft frame', e); }
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
      const keep = mask ? 1 : (e < 0.55 ? 1 : e > 0.95 ? 0.15 : 1 - 0.85 * (e - 0.55) / 0.4);
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

    const bg = style === 'royal' ? [58, 36, 22] : style === 'christmas' ? [244, 238, 227] : [200, 103, 62];
    const rim = style === 'royal' ? [233, 196, 106] : [251, 248, 242];
    let alpha = mask;
    if (!alpha) { // fallback: soft oval
      alpha = new Float32Array(N);
      for (let i = 0; i < N; i++) { const px = i % S, py = (i / S) | 0, e = Math.hypot((px - S / 2) / (S * 0.41), (py - S * 0.52) / (S * 0.48)); alpha[i] = e < 0.84 ? 1 : e > 1.02 ? 0 : 1 - (e - 0.84) / 0.18; }
    }
    // sticker outline: grow the mask by ~9px, plus a soft shadow
    const grown = gauss(alpha, S, S, 4), shadow = gauss(alpha, S, S, 7);
    for (let i = 0; i < N; i++) {
      const a = alpha[i], ring = mask ? Math.min(1, Math.max(0, (grown[i] - 0.04) / 0.12)) : 0;
      const sh = mask ? Math.min(0.35, shadow[(Math.min(S - 1, ((i / S) | 0) + 0) * S) + (i % S)] * 0.35) : 0;
      // background with shadow
      let r = bg[0] * (1 - sh), g = bg[1] * (1 - sh), b = bg[2] * (1 - sh);
      // rim
      r = r * (1 - ring) + rim[0] * ring; g = g * (1 - ring) + rim[1] * ring; b = b * (1 - ring) + rim[2] * ring;
      // pet
      o[i * 4] = o[i * 4] * a + r * (1 - a); o[i * 4 + 1] = o[i * 4 + 1] * a + g * (1 - a); o[i * 4 + 2] = o[i * 4 + 2] * a + b * (1 - a);
    }

    const c = document.createElement('canvas'); c.width = c.height = S;
    const x = c.getContext('2d');
    x.putImageData(out, 0, 0);
    if (style === 'royal') {
      x.strokeStyle = '#C99A34'; x.lineWidth = 14; x.strokeRect(7, 7, S - 14, S - 14);
      x.strokeStyle = 'rgba(255,230,170,.7)'; x.lineWidth = 2; x.strokeRect(24, 24, S - 48, S - 48);
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
