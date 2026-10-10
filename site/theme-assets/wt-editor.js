/* Woven Tails blanket designer (no server, no AI cost).
   Layers: pet cut-outs (up to 4) + text (up to 3). Drag, resize, rotate, flip, reorder, curved text.
   Mount: <div data-wt-editor data-addon="VARIANT_ID" data-handle="..."></div> inside the product form.
   Needs window.wtStylize (wt-stylize.js). Emits 'wt:design' (dataURL) for the 3D blanket. */
(function () {
  if (window.WTEditor) return;
  const DW = 2600, DH = 1850;                       // design space = 52 x 37 in at 50 units/in
  const SAFE = { x: 130, y: 110, w: DW - 260, h: DH - 220 };
  const MAX_PHOTOS = 4, MAX_TEXT = 3, MAX_CHARS = 40, MIN_TEXT = 80;
  const FONTS = {
    classic: { label: 'Classic', css: '600 {s}px Fraunces, Georgia, serif', upper: false },
    script: { label: 'Script', css: '400 {s}px "Great Vibes", "Snell Roundhand", cursive', upper: false },
    bold: { label: 'BOLD', css: '800 {s}px Nunito, "Segoe UI", sans-serif', upper: true, track: 0.08 },
    hand: { label: 'Handwritten', css: '700 {s}px Caveat, "Comic Sans MS", cursive', upper: false },
  };
  const POP_COLORS = [['Terracotta', '#C8673E'], ['Sage', '#8FA98B'], ['Navy', '#2E3F5C'], ['Mustard', '#D9A43B'], ['Blush', '#E8B4A8']];
  const TEXT_COLORS = {
    pop: ['#FBF8F2', '#1F3127', '#F6D58E'],
    christmas: ['#FBF8F2', '#F2C14E', '#1F5130'],
    royal: ['#E9C46A', '#F4E6C8', '#FBF8F2'],
    memorial: ['#5B4A3A', '#8A6E4B', '#2F4A3A'],
  };
  const STYLE_FROM = [[/royal/i, 'royal'], [/christmas|scarf/i, 'christmas'], [/memorial/i, 'memorial'], [/pop/i, 'pop']];
  const EMOJI = /\p{Extended_Pictographic}|️|‍/gu;
  const uid = () => Math.random().toString(36).slice(2, 9);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rad = (d) => d * Math.PI / 180;

  // ---------- backgrounds ----------
  function seeded(n) { let s = n; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
  function drawBackground(g, st) {
    const { style, popColor } = st;
    if (style === 'pop') { g.fillStyle = POP_COLORS[popColor][1]; g.fillRect(0, 0, DW, DH); return; }
    if (style === 'christmas') {
      g.fillStyle = '#A8242C'; g.fillRect(0, 0, DW, DH);
      const r = seeded(7); g.fillStyle = 'rgba(255,255,255,.75)';
      for (let i = 0; i < 160; i++) { const x = r() * DW, y = r() * DH, s = 4 + r() * 9; flake(g, x, y, s); }
      holly(g, 150, 150, 1); holly(g, DW - 150, 150, -1); holly(g, 150, DH - 150, 1, true); holly(g, DW - 150, DH - 150, -1, true);
      return;
    }
    if (style === 'royal') {
      const gr = g.createRadialGradient(DW / 2, DH / 2, 200, DW / 2, DH / 2, DW * 0.7);
      gr.addColorStop(0, '#6B4429'); gr.addColorStop(1, '#22140B'); g.fillStyle = gr; g.fillRect(0, 0, DW, DH);
      g.strokeStyle = 'rgba(233,196,106,.08)'; g.lineWidth = 3;               // faint damask diamonds
      for (let x = -DH; x < DW; x += 90) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + DH, DH); g.stroke(); g.beginPath(); g.moveTo(x + DH, 0); g.lineTo(x, DH); g.stroke(); }
      return;
    }
    // memorial
    const gr = g.createRadialGradient(DW / 2, DH * 0.45, 300, DW / 2, DH / 2, DW * 0.75);
    gr.addColorStop(0, '#FBF6EC'); gr.addColorStop(1, '#E7DCC8'); g.fillStyle = gr; g.fillRect(0, 0, DW, DH);
    const r = seeded(11);
    for (let i = 0; i < 70; i++) { const x = r() * DW, y = r() * DH * 0.9; star(g, x, y, 6 + r() * 14, `rgba(201,170,110,${0.35 + r() * 0.4})`); }
  }
  function drawForeground(g, st) {                   // frame on top of pets (Royal only)
    if (st.style !== 'royal') return;
    g.save(); g.strokeStyle = '#D4A84B'; g.lineWidth = 22;
    g.beginPath(); g.ellipse(DW / 2, DH / 2, DW * 0.43, DH * 0.44, 0, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = 'rgba(244,230,200,.7)'; g.lineWidth = 5;
    g.beginPath(); g.ellipse(DW / 2, DH / 2, DW * 0.43 - 30, DH * 0.44 - 30, 0, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#D4A84B';
    for (const [x, y] of [[DW / 2, DH / 2 - DH * 0.44], [DW / 2, DH / 2 + DH * 0.44]]) {
      g.beginPath(); g.moveTo(x - 70, y); g.quadraticCurveTo(x, y - 60, x + 70, y); g.quadraticCurveTo(x, y + 60, x - 70, y); g.fill();
    }
    g.restore();
  }
  function flake(g, x, y, s) { g.save(); g.translate(x, y); g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = Math.max(2, s / 4);
    for (let k = 0; k < 3; k++) { g.rotate(Math.PI / 3); g.beginPath(); g.moveTo(-s, 0); g.lineTo(s, 0); g.stroke(); } g.restore(); }
  function star(g, x, y, s, c) { g.save(); g.translate(x, y); g.fillStyle = c; g.beginPath();
    for (let k = 0; k < 10; k++) { const r = k % 2 ? s * 0.42 : s; const a = -Math.PI / 2 + k * Math.PI / 5; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    g.closePath(); g.fill(); g.restore(); }
  function holly(g, x, y, dir, down) {
    g.save(); g.translate(x, y); g.scale(dir, down ? -1 : 1);
    g.fillStyle = '#1F5130';
    for (const a of [-0.5, 0.35]) { g.save(); g.rotate(a); g.beginPath(); g.ellipse(70, 0, 80, 30, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
    g.fillStyle = '#E23B3B'; for (const [bx, by] of [[0, 0], [24, 18], [-6, 26]]) { g.beginPath(); g.arc(bx, by, 16, 0, Math.PI * 2); g.fill(); }
    g.restore();
  }

  // ---------- photo tone per style (cheap, no re-cut) ----------
  function toneCanvas(src, style) {
    if (style === 'pop' || style === 'christmas') return src;
    const c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
    const g = c.getContext('2d'); g.drawImage(src, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height), p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      const l = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2];
      if (style === 'royal') { const t = l / 255; p[i] = 44 + 204 * t; p[i + 1] = 27 + 199 * t; p[i + 2] = 17 + 159 * t; }
      else { p[i] = Math.min(255, (p[i] * 0.6 + l * 0.4) * 1.06 + 8); p[i + 1] = Math.min(255, (p[i + 1] * 0.6 + l * 0.4) * 1.05 + 8); p[i + 2] = Math.min(255, (p[i + 2] * 0.6 + l * 0.4) * 1.0 + 6); }
    }
    g.putImageData(d, 0, 0); return c;
  }

  // ---------- text drawing (straight or arc) ----------
  function textFont(L, size) { return FONTS[L.font].css.replace('{s}', Math.round(size || L.size)); }
  function textValue(L) { const t = L.text || ''; return FONTS[L.font].upper ? t.toUpperCase() : t; }
  function measureText(g, L) {
    g.font = textFont(L); const lines = textValue(L).split('\n');
    const track = (FONTS[L.font].track || 0) * L.size;
    const w = Math.max(...lines.map((s) => g.measureText(s).width + track * Math.max(0, s.length - 1)), L.size * 0.6);
    return { w, h: L.size * 1.15 * lines.length, lines, track };
  }
  function drawText(g, L) {
    const m = measureText(g, L);
    g.save(); g.translate(L.x, L.y); g.rotate(rad(L.rot)); g.font = textFont(L); g.fillStyle = L.color;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    if (Math.abs(L.curve) < 2 || m.lines.length > 1) {
      m.lines.forEach((s, i) => {
        const y = (i - (m.lines.length - 1) / 2) * L.size * 1.15;
        if (m.track) { let x = -m.w / 2; for (const ch of s) { const cw = g.measureText(ch).width; g.fillText(ch, x + cw / 2, y); x += cw + m.track; } }
        else g.fillText(s, 0, y);
      });
    } else {
      // arc: curve -100..-1 = rainbow (bows up), 1..100 = smile (bows down); up to 300 degrees
      const str = m.lines[0], { total, R, sag } = arcGeom(m, L), up = L.curve < 0;
      let phi = -total / 2;
      for (const ch of str) {
        const cw = g.measureText(ch).width + m.track, mid = phi + (cw / R) / 2;
        const x = R * Math.sin(mid), y = ((R - R * Math.cos(mid)) - sag / 2) * (up ? 1 : -1);
        g.save(); g.translate(x, y); g.rotate(up ? mid : -mid); g.fillText(ch, 0, 0); g.restore();
        phi += cw / R;
      }
    }
    g.restore();
    return m;
  }

  function arcGeom(m, L) {
    const total = Math.min(rad(Math.abs(L.curve) * 3), rad(300)), R = m.w / Math.max(total, 0.01), half = total / 2;
    return { total, R, sag: R - R * Math.cos(half), span: half > Math.PI / 2 ? 2 * R : 2 * R * Math.sin(half) };
  }
  // ---------- geometry ----------
  function layerBox(g, L) {
    if (L.type === 'photo') return { w: L.w, h: L.w * L.img.height / L.img.width };
    const m = measureText(g, L);
    if (Math.abs(L.curve) >= 2 && m.lines.length === 1) { const a = arcGeom(m, L); return { w: Math.min(m.w, a.span) + L.size * 1.0, h: a.sag + L.size * 1.4 }; }
    return { w: m.w + L.size * 0.3, h: m.h + L.size * 0.2 };
  }
  function toLocal(L, px, py) { const dx = px - L.x, dy = py - L.y, c = Math.cos(-rad(L.rot)), s = Math.sin(-rad(L.rot)); return [dx * c - dy * s, dx * s + dy * c]; }
  function corners(L, b) { const c = Math.cos(rad(L.rot)), s = Math.sin(rad(L.rot));
    return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [L.x + (u * b.w / 2) * c - (v * b.h / 2) * s, L.y + (u * b.w / 2) * s + (v * b.h / 2) * c]); }

  // ---------- image intake ----------
  async function decode(file) {
    try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) {}
    const url = URL.createObjectURL(file);
    try { const im = new Image(); im.src = url; await im.decode(); return im; } catch (e) {}
    if (/heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name)) {
      if (!window.heic2any) await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
      const blob = await window.heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
      return createImageBitmap(Array.isArray(blob) ? blob[0] : blob);
    }
    throw new Error('unsupported');
  }
  function squarePad(img) {
    const w = img.width, h = img.height, s = Math.max(w, h), k = Math.min(1, 1600 / s);
    const c = document.createElement('canvas'); c.width = c.height = Math.round(s * k);
    const g = c.getContext('2d'); g.fillStyle = '#9a9a9a'; g.fillRect(0, 0, c.width, c.height);
    g.drawImage(img, (s - w) / 2 * k, (s - h) / 2 * k, w * k, h * k); return c;
  }
  function trim(c) {
    const g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height).data;
    let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 <= x0) return c;
    const p = 6; x0 = Math.max(0, x0 - p); y0 = Math.max(0, y0 - p); x1 = Math.min(c.width - 1, x1 + p); y1 = Math.min(c.height - 1, y1 + p);
    const o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1;
    o.getContext('2d').drawImage(c, x0, y0, o.width, o.height, 0, 0, o.width, o.height); return o;
  }
  async function shrinkFile(file, img) {                 // keep originals under Shopify's 20 MB, as JPEG
    if (file.size < 15e6 && /jpe?g|png|webp/i.test(file.type)) return file;
    const s = Math.min(1, 4000 / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.9));
    return new File([blob], (file.name || 'photo').replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
  }

  // ---------- layouts ----------
  function layoutArea(st) {
    if (st.style === 'royal') return { x: DW * 0.24, y: DH * 0.17, w: DW * 0.52, h: DH * 0.56 };
    const texts = st.layers.filter((L) => L.type === 'text');
    const topRes = texts.some((L) => L.y < DH * 0.3) ? 230 : 30, botRes = texts.some((L) => L.y > DH * 0.7) ? 250 : 30;
    return { x: SAFE.x, y: SAFE.y + topRes, w: SAFE.w, h: SAFE.h - topRes - botRes };
  }
  function layout(photos, mode, area) {
    const n = photos.length; if (!n) return;
    const rows = mode === 'grid' && n === 4 ? [[0, 1], [2, 3]] : mode === 'grid' && n === 3 ? [[0, 1], [2]] : [photos.map((_, i) => i)];
    const rowH = area.h / rows.length;
    rows.forEach((row, ri) => {
      const colW = area.w / row.length;
      row.forEach((pi, ci) => {
        const L = photos[pi], ar = L.img.height / L.img.width;
        L.w = Math.min(colW * 0.94, (rowH * 0.96) / ar); L.rot = 0;
        L.x = area.x + colW * (ci + 0.5); L.y = area.y + rowH * (ri + 0.5);
      });
    });
  }

  // ---------- styles ----------
  const CSS = `
  .wte{display:grid;gap:12px}
  .wte__stage{position:relative;border-radius:14px;overflow:hidden;box-shadow:0 18px 40px -22px rgba(31,49,39,.6);background:#eee}
  .wte__canvas{display:block;width:100%;touch-action:none;cursor:grab;outline:none}
  .wte__canvas:focus-visible{outline:3px solid #B9582F;outline-offset:2px}
  .wte__empty{position:absolute;inset:0;display:grid;place-content:center;gap:4px;text-align:center;color:#fff;text-shadow:0 1px 8px rgba(0,0,0,.4);pointer-events:none;font-size:15px}
  .wte__empty strong{font:600 22px Fraunces,Georgia,serif}
  .wte__empty[hidden],.wte__busy[hidden],.wte__panel[hidden]{display:none}
  .wte__busy{position:absolute;inset:0;display:grid;place-items:center;background:rgba(246,240,230,.72);font-weight:700}
  .wte__busy span::before{content:"";display:inline-block;width:14px;height:14px;margin-right:8px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:wtespin .8s linear infinite;vertical-align:-2px}
  @keyframes wtespin{to{transform:rotate(360deg)}}
  .wte__bar,.wte__row,.wte__style{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
  .wte__bar .wte__btn{flex:1 1 auto;justify-content:center}
  @media (max-width:520px){.wte__sep{display:none}.wte__bar .wte__btn--primary{flex-basis:100%}.wte__panel{padding:12px}.wte__btn,.wte__chip{min-height:44px}.wte__sw{width:40px;height:40px}}
  .wte__sep{width:1px;height:26px;background:rgba(31,49,39,.18)}
  .wte__btn,.wte__chip{font:700 14px Nunito,system-ui,sans-serif;min-height:40px;padding:6px 14px;border-radius:999px;border:1px solid rgba(31,49,39,.28);background:#FBF8F2;color:#1F3127;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
  .wte__btn:hover,.wte__chip:hover{border-color:#B9582F}
  .wte__btn--primary{background:#1F3127;color:#F4EEE3;border-color:#1F3127}
  .wte__btn--danger{color:#A8242C}
  .wte__chip.is-on{background:#1F3127;color:#F4EEE3;border-color:#1F3127}
  .wte__f-classic{font-family:Fraunces,Georgia,serif}.wte__f-script{font-family:"Great Vibes",cursive;font-weight:400;font-size:19px}.wte__f-bold{letter-spacing:.1em}.wte__f-hand{font-family:Caveat,cursive;font-size:18px}
  .wte__sw{width:34px;height:34px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px rgba(31,49,39,.3);background:var(--c);cursor:pointer;padding:0}
  .wte__sw.is-on{box-shadow:0 0 0 3px #B9582F}
  .wte__lbl{font:500 12px/1.3 "DM Mono",ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#56645A;display:grid;gap:6px}
  .wte__check{display:flex;gap:8px;align-items:center;font-weight:700}
  .wte__panel{display:grid;gap:10px;padding:14px;border:1px solid rgba(31,49,39,.16);border-radius:14px;background:#FBF8F2}
  .wte__panel label{display:grid;gap:4px;font-size:14px;font-weight:700}
  .wte__panel input[type=range]{width:100%;accent-color:#1F3127}
  .wte__panel textarea{font:600 16px Nunito,system-ui,sans-serif;padding:10px 12px;border:1px solid rgba(31,49,39,.3);border-radius:10px;background:#fff;color:#1F3127;resize:vertical;text-transform:none;letter-spacing:0}
  .wte__warn{margin:0;padding:0;list-style:none;display:grid;gap:6px}
  .wte__warn li{font-size:14px;line-height:1.4;padding:8px 12px;border-radius:10px;background:#FBEFD9;color:#6B4A12}
  .wte__fine{margin:0;font-size:13px;color:#56645A}
  .wte-viewer{display:grid;gap:12px;min-width:0}
  .wte-viewer.is-desktop{position:sticky;top:96px;align-self:start}
  @media (min-width:900px){.hero:has(.wte-viewer.is-desktop){grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);align-items:start}}
  .wte-tabs{display:none;gap:6px;padding:4px;border-radius:999px;background:rgba(31,49,39,.08);justify-self:start}
  .wte-viewer.is-desktop .wte-tabs{display:inline-flex}
  .wte-tabs button{font:700 14px Nunito,system-ui,sans-serif;border:0;background:transparent;color:#1F3127;padding:9px 18px;border-radius:999px;cursor:pointer;min-height:40px}
  .wte-tabs button[aria-selected=true]{background:#1F3127;color:#F4EEE3}
  .wte-viewer .wte__stage{border-radius:22px}
  .wte-viewer .stage[hidden],.wte-viewer .wte__stage[hidden]{display:none}
  .wte-viewer.is-desktop .wte__empty strong{font-size:30px}
  .wte__hint{margin:0;font-size:13px;color:#56645A}
  `;
  function injectCSS() { if (document.getElementById('wte-css')) return; const s = document.createElement('style'); s.id = 'wte-css'; s.textContent = CSS; document.head.appendChild(s);
    if (!document.getElementById('wte-fonts')) { const l = document.createElement('link'); l.id = 'wte-fonts'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Fraunces:opsz,wght@9..144,600&family=Great+Vibes&family=Nunito:wght@700;800&display=swap'; document.head.appendChild(l); } }

  // ---------- editor ----------
  function mount(root) {
    injectCSS();
    const form = root.closest('form');
    const addonId = root.dataset.addon;
    const key = 'wt-design-' + (root.dataset.handle || 'blanket');
    const st = { style: 'pop', popColor: 0, layers: [], sel: null, banner: false, mode: 'row', manual: false };
    const relayout = (force) => { if (force || !st.manual) layout(st.layers.filter((L) => L.type === 'photo'), st.mode, layoutArea(st)); };
    const files = new Map();                              // photo layer id -> original File
    let history = [], future = [], busy = 0, guides = { v: false, h: false };

    root.innerHTML = `
      <div class="wte">
        <div class="wte__stage"><canvas class="wte__canvas" tabindex="0" aria-label="Blanket design canvas. Drag to move, use the controls below to edit."></canvas>
          <div class="wte__empty"><strong>Design your blanket</strong><span>Add your pet's photo to start. Up to 4 pets.</span></div>
          <div class="wte__busy" hidden><span></span></div></div>
        <div class="wte__bar">
          <label class="wte__btn wte__btn--primary"><input type="file" accept="image/*,.heic,.heif" multiple hidden data-add-photo>+ Pet photo</label>
          <button type="button" class="wte__btn" data-add-text>+ Text</button>
          <span class="wte__sep"></span>
          <button type="button" class="wte__btn" data-layout="row" title="Arrange pets in a row">Row</button>
          <button type="button" class="wte__btn" data-layout="grid" title="Arrange pets in a grid">Grid</button>
          <span class="wte__sep"></span>
          <button type="button" class="wte__btn" data-undo aria-label="Undo">↶</button>
          <button type="button" class="wte__btn" data-redo aria-label="Redo">↷</button>
        </div>
        <div class="wte__style"></div>
        <div class="wte__panel" hidden></div>
        <ul class="wte__warn" aria-live="polite"></ul>
        <p class="wte__fine">Drag to move · corner handle resizes · top handle rotates · pinch on phones. We polish your pet's art and email a proof before weaving.</p>
      </div>`;
    const cv = root.querySelector('canvas'), g = cv.getContext('2d');
    const $ = (s) => root.querySelector(s);
    const busyEl = $('.wte__busy'), emptyEl = $('.wte__empty');

    // ----- persistence & history -----
    const snapshot = () => JSON.stringify({ style: st.style, popColor: st.popColor, banner: st.banner,
      layers: st.layers.map((L) => L.type === 'photo' ? { ...L, img: undefined, tone: undefined, raw: undefined } : { ...L }) });
    const imgs = new Map();                               // id -> {img(raw cut), tone:{style:canvas}}
    function restore(json) {
      const o = JSON.parse(json); st.style = o.style; st.popColor = o.popColor; st.banner = o.banner;
      st.layers = o.layers.filter((L) => L.type === 'text' || imgs.has(L.id)).map((L) => L.type === 'photo' ? { ...L, img: imgs.get(L.id).raw } : L);
      if (st.sel && !st.layers.find((L) => L.id === st.sel)) st.sel = null;
    }
    function commit() { history.push(snapshot()); if (history.length > 60) history.shift(); future = []; save(); }
    function save() {
      try {
        const photos = {};
        for (const L of st.layers) if (L.type === 'photo') photos[L.id] = imgs.get(L.id).raw.toDataURL('image/png');
        localStorage.setItem(key, JSON.stringify({ design: snapshot(), photos, t: Date.now() }));
      } catch (e) { /* storage full or blocked: design still works, just not restored after refresh */ }
    }
    async function load() {
      let o; try { o = JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { o = null; }
      if (!o || Date.now() - o.t > 7 * 864e5) return;
      for (const [id, url] of Object.entries(o.photos || {})) {
        const im = new Image(); im.src = url; try { await im.decode(); } catch (e) { continue; }
        const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; c.getContext('2d').drawImage(im, 0, 0);
        imgs.set(id, { raw: c, tone: {} });
      }
      restore(o.design);
      history = [snapshot()];
      syncStyleFromPage(false);
      render(); panel(); styleBar(); warnings();
      if (st.layers.some((L) => L.type === 'photo')) note('Restored your last design. Re-add photos if you want us to get the original files too.');
    }

    // ----- rendering -----
    function fit() {
      if (!cv.parentElement.clientWidth) return;
      const w = cv.parentElement.clientWidth, dpr = Math.min(2, devicePixelRatio || 1);
      cv.style.width = w + 'px'; cv.style.height = (w * DH / DW) + 'px';
      cv.width = Math.round(w * dpr); cv.height = Math.round(w * DH / DW * dpr);
      render();
    }
    const scale = () => cv.width / DW;
    function photoCanvas(L) { const rec = imgs.get(L.id); return rec.tone[st.style] || (rec.tone[st.style] = toneCanvas(rec.raw, st.style)); }
    function paint(ctx, forExport) {
      drawBackground(ctx, st);
      for (const L of st.layers) {
        if (L.type === 'photo') {
          const b = layerBox(ctx, L); ctx.save(); ctx.translate(L.x, L.y); ctx.rotate(rad(L.rot)); if (L.flip) ctx.scale(-1, 1);
          ctx.shadowColor = 'rgba(0,0,0,.28)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
          ctx.drawImage(photoCanvas(L), -b.w / 2, -b.h / 2, b.w, b.h); ctx.restore();
        } else drawText(ctx, L);
      }
      drawForeground(ctx, st);
      if (forExport) return;
      ctx.save(); ctx.setLineDash([8 / scale(), 6 / scale()]); ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1.5 / scale();
      ctx.strokeRect(SAFE.x, SAFE.y, SAFE.w, SAFE.h); ctx.restore();
      ctx.save(); ctx.strokeStyle = '#4FB0FF'; ctx.lineWidth = 1.5 / scale();
      if (guides.v) { ctx.beginPath(); ctx.moveTo(DW / 2, 0); ctx.lineTo(DW / 2, DH); ctx.stroke(); }
      if (guides.h) { ctx.beginPath(); ctx.moveTo(0, DH / 2); ctx.lineTo(DW, DH / 2); ctx.stroke(); }
      const L = selected();
      if (L) {
        const b = layerBox(ctx, L), cs = corners(L, b);
        const px = 1 / scale();
        ctx.strokeStyle = '#4FB0FF'; ctx.lineWidth = 2 * px; ctx.beginPath(); cs.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.stroke();
        const [hx, hy] = handlePos(L, b, 'scale'), [rx, ry] = handlePos(L, b, 'rotate'), [tx, ty] = handlePos(L, b, 'top');
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(rx, ry); ctx.stroke();
        for (const [x, y] of [[hx, hy], [rx, ry]]) { ctx.beginPath(); ctx.arc(x, y, 11 * px, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke(); }
        ctx.fillStyle = '#4FB0FF'; ctx.font = `${13 * px}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('↻', rx, ry); ctx.fillText('⤡', hx, hy);
      }
      ctx.restore();
    }
    function render() {
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height);
      g.setTransform(scale(), 0, 0, scale(), 0, 0); paint(g, false);
      emptyEl.hidden = st.layers.length > 0;
      emit3D();
    }
    let t3d;
    const FRINGE = { pop: () => [POP_COLORS[st.popColor][1], '#FBF8F2', '#1F3127'], christmas: () => ['#A8242C', '#FBF8F2', '#1F5130'], royal: () => ['#D4A84B', '#4A2E1B', '#F4E6C8'], memorial: () => ['#E7DCC8', '#C9AA6E', '#FBF6EC'] };
    function emit3D() {
      clearTimeout(t3d);
      t3d = setTimeout(() => {
        document.dispatchEvent(new CustomEvent('wt:theme', { detail: { fringe: FRINGE[st.style]() } }));
        if (!st.layers.length && !st.touched) return;
        const c = document.createElement('canvas'); c.width = 1040; c.height = 740;
        const x = c.getContext('2d'); x.scale(c.width / DW, c.height / DH); paint(x, true);
        document.dispatchEvent(new CustomEvent('wt:design', { detail: c.toDataURL('image/jpeg', 0.85) }));
      }, 500);
    }
    function exportBlob() {
      const c = document.createElement('canvas'); c.width = DW; c.height = DH;
      paint(c.getContext('2d'), true);
      return new Promise((r) => c.toBlob(r, 'image/jpeg', 0.92));
    }

    // ----- selection & handles -----
    const selected = () => st.layers.find((L) => L.id === st.sel) || null;
    function handlePos(L, b, which) {
      const c = Math.cos(rad(L.rot)), s = Math.sin(rad(L.rot));
      const p = which === 'scale' ? [b.w / 2, b.h / 2] : which === 'rotate' ? [0, -b.h / 2 - 34 / scale()] : [0, -b.h / 2];
      return [L.x + p[0] * c - p[1] * s, L.y + p[0] * s + p[1] * c];
    }
    function hit(px, py) {
      const L = selected();
      if (L) {
        const b = layerBox(g, L), tol = 24 / scale();
        for (const w of ['scale', 'rotate']) { const [x, y] = handlePos(L, b, w); if (Math.hypot(px - x, py - y) < tol) return { L, mode: w }; }
      }
      for (let i = st.layers.length - 1; i >= 0; i--) {
        const M = st.layers[i], b = layerBox(g, M), [lx, ly] = toLocal(M, px, py);
        if (Math.abs(lx) <= b.w / 2 && Math.abs(ly) <= b.h / 2) return { L: M, mode: 'move' };
      }
      return null;
    }
    const toDesign = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * DW, (e.clientY - r.top) / r.height * DH]; };

    // ----- pointer interaction (mouse, touch, pen; pinch with two fingers) -----
    const pts = new Map(); let drag = null;
    cv.addEventListener('pointerdown', (e) => {
      cv.setPointerCapture(e.pointerId); pts.set(e.pointerId, toDesign(e));
      if (pts.size === 2 && selected()) { const [a, b] = [...pts.values()], L = selected();
        drag = { mode: 'pinch', L, d0: Math.hypot(a[0] - b[0], a[1] - b[1]), a0: Math.atan2(b[1] - a[1], b[0] - a[0]), w0: L.w, size0: L.size, rot0: L.rot }; return; }
      const [px, py] = pts.get(e.pointerId), h = hit(px, py);
      if (!h) { st.sel = null; drag = null; render(); panel(); return; }
      st.sel = h.L.id; const L = h.L, b = layerBox(g, L);
      drag = { mode: h.mode, L, px, py, x0: L.x, y0: L.y, w0: L.w, size0: L.size, rot0: L.rot, r0: Math.hypot(px - L.x, py - L.y), diag0: Math.hypot(b.w / 2, b.h / 2), a0: Math.atan2(py - L.y, px - L.x) };
      // bring tapped layer's panel up
      render(); panel(); e.preventDefault();
    });
    cv.addEventListener('pointermove', (e) => {
      if (!pts.has(e.pointerId) || !drag) return;
      pts.set(e.pointerId, toDesign(e)); const [px, py] = pts.get(e.pointerId), L = drag.L;
      if (drag.mode === 'pinch' && pts.size === 2) {
        const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), an = Math.atan2(b[1] - a[1], b[0] - a[0]);
        const k = d / drag.d0; if (L.type === 'photo') L.w = clamp(drag.w0 * k, 120, DW * 1.2); else L.size = clamp(drag.size0 * k, 30, 600);
        L.rot = snapAngle(drag.rot0 + (an - drag.a0) * 180 / Math.PI);
      } else if (drag.mode === 'move') {
        let nx = drag.x0 + px - drag.px, ny = drag.y0 + py - drag.py;
        guides.v = Math.abs(nx - DW / 2) < 22; guides.h = Math.abs(ny - DH / 2) < 22;
        if (guides.v) nx = DW / 2; if (guides.h) ny = DH / 2;
        L.x = clamp(nx, -200, DW + 200); L.y = clamp(ny, -200, DH + 200);
      } else if (drag.mode === 'scale') {
        const k = Math.hypot(px - L.x, py - L.y) / drag.diag0;
        if (L.type === 'photo') L.w = clamp(drag.w0 * k, 120, DW * 1.2); else L.size = clamp(drag.size0 * k, 30, 600);
      } else if (drag.mode === 'rotate') {
        L.rot = snapAngle(drag.rot0 + (Math.atan2(py - L.y, px - L.x) - drag.a0) * 180 / Math.PI);
      }
      render(); syncPanel();
    });
    const end = (e) => { if (pts.delete(e.pointerId) && drag) { if (!pts.size) { if (drag.L && drag.L.type === 'photo' && (drag.L.x !== drag.x0 || drag.L.y !== drag.y0 || drag.L.w !== drag.w0 || drag.L.rot !== drag.rot0)) st.manual = true; drag = null; guides = { v: false, h: false }; commit(); render(); warnings(); } } };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    cv.addEventListener('dblclick', () => { const L = selected(); if (L && L.type === 'text') { const i = $('.wte__panel textarea'); if (i) i.focus(); } });
    cv.addEventListener('keydown', (e) => {
      const L = selected(); if (!L) return; const step = e.shiftKey ? 50 : 10;
      if (e.key === 'ArrowLeft') L.x -= step; else if (e.key === 'ArrowRight') L.x += step; else if (e.key === 'ArrowUp') L.y -= step; else if (e.key === 'ArrowDown') L.y += step;
      else if (e.key === 'Delete' || e.key === 'Backspace') { remove(L); return; } else return;
      e.preventDefault(); render(); commit();
    });
    function snapAngle(a) { a = ((a % 360) + 540) % 360 - 180; for (const s of [-180, -90, -45, 0, 45, 90, 180]) if (Math.abs(a - s) < 4) return s; return Math.round(a); }

    // ----- adding content -----
    async function addPhotos(list) {
      const room = MAX_PHOTOS - st.layers.filter((L) => L.type === 'photo').length;
      const arr = [...list].slice(0, Math.max(0, room));
      if (list.length > room) note(`Up to ${MAX_PHOTOS} pets per blanket. Added the first ${room}.`);
      for (const file of arr) {
        setBusy(+1, 'Cutting out your pet…');
        try {
          const img = await decode(file);
          if (Math.min(img.width, img.height) < 600) note('That photo is quite small, so the woven portrait may look soft. A larger photo works best.');
          const sq = squarePad(img);
          if (!window.wtStylize) await waitFor(() => window.wtStylize, 15000);
          const cut = await window.wtStylize(sq, 'pop', { zoom: 1, ox: 0, oy: 0 }, { transparent: true });
          if (cut.wtNoPet) note("We couldn't find a pet in one photo, so we used the whole picture. Try a photo where your pet fills more of the frame.");
          const raw = trim(cut), id = uid();
          imgs.set(id, { raw, tone: {} });
          files.set(id, await shrinkFile(file, img));
          st.layers.push({ id, type: 'photo', x: DW / 2, y: DH / 2, w: 900, rot: 0, flip: false, img: raw, name: file.name });
          st.manual = false; relayout(true);
          st.sel = id; if (view !== 'design') setView('design');
        } catch (err) {
          console.warn(err); note("We couldn't open that photo. Please try a JPG or PNG.");
        } finally { setBusy(-1); }
        commit(); render(); panel(); warnings();
      }
    }
    function addText(text, opts) {
      if (st.layers.filter((L) => L.type === 'text').length >= MAX_TEXT) { note(`Up to ${MAX_TEXT} text boxes.`); return; }
      const colors = TEXT_COLORS[st.style];
      const L = Object.assign({ id: uid(), type: 'text', text: text || "Your pet's name", font: 'classic', color: colors[0], size: 150, rot: 0, curve: 0, x: DW / 2, y: SAFE.y + SAFE.h - 120 }, opts || {});
      st.layers.push(L); st.sel = L.id; if (view !== 'design') setView('design'); relayout(); commit(); render(); panel(); warnings();
      setTimeout(() => { const i = $('.wte__panel textarea'); if (i && !text) { i.focus(); i.select(); } }, 30);
    }
    function remove(L) {
      st.layers = st.layers.filter((M) => M !== L); files.delete(L.id); st.sel = null;
      commit(); render(); panel(); warnings();
    }
    function setBusy(d, msg) { busy += d; busyEl.hidden = busy <= 0; if (msg) busyEl.querySelector('span').textContent = msg; }
    function waitFor(fn, ms) { return new Promise((res, rej) => { const t0 = Date.now(); (function poll() { if (fn()) return res(); if (Date.now() - t0 > ms) return rej(new Error('timeout')); setTimeout(poll, 100); })(); }); }

    // ----- style bar (follows the page's Art style option) -----
    function styleBar() {
      const el = $('.wte__style'); let h = '';
      if (st.style === 'pop') h = '<span class="wte__lbl">Background</span>' + POP_COLORS.map(([n, c], i) => `<button type="button" class="wte__sw${i === st.popColor ? ' is-on' : ''}" style="--c:${c}" data-pop="${i}" aria-label="${n}" title="${n}"></button>`).join('');
      if (st.style === 'christmas') h = `<label class="wte__check"><input type="checkbox" data-banner ${st.banner ? 'checked' : ''}> Add "Merry Christmas"</label>`;
      if (st.style === 'memorial') h = '<span class="wte__lbl">Soft cream with stars · gentle tones</span>';
      if (st.style === 'royal') h = '<span class="wte__lbl">Velvet with a gold frame · keep pets inside the oval</span>';
      el.innerHTML = h;
    }
    function setStyle(style, fromPage) {
      if (!style || style === st.style) return;
      st.touched = true;
      const prev = st.style; st.style = style;
      // recolor text that still uses the previous style's default colors
      for (const L of st.layers) if (L.type === 'text' && TEXT_COLORS[prev].includes(L.color)) L.color = TEXT_COLORS[style][Math.max(0, TEXT_COLORS[prev].indexOf(L.color)) % TEXT_COLORS[style].length];
      if (prev === 'christmas' && style !== 'christmas') { st.layers = st.layers.filter((L) => !L.banner); st.banner = false; }
      if (style === 'memorial' && !st.layers.some((L) => L.type === 'text')) st.layers.push({ id: uid(), type: 'text', text: 'Forever in our hearts', font: 'script', color: TEXT_COLORS.memorial[0], size: 170, rot: 0, curve: 0, x: DW / 2, y: SAFE.y + SAFE.h - 120 });
      if (st.sel && !st.layers.find((L) => L.id === st.sel)) st.sel = null;
      relayout(prev === 'royal' || style === 'royal');
      styleBar(); commit(); render(); panel(); warnings();
    }
    function syncStyleFromPage(apply = true) {
      const r = document.querySelector('.wt-opt:checked');
      if (!r) return; for (const [re, s] of STYLE_FROM) if (re.test(r.value)) { if (apply) setStyle(s, true); else { st.style = s; styleBar(); } return; }
    }
    document.addEventListener('change', (e) => { if (e.target.classList && e.target.classList.contains('wt-opt')) syncStyleFromPage(); });

    // ----- selected-layer panel -----
    function panel() {
      const L = selected(), el = $('.wte__panel');
      if (!L) { el.hidden = true; el.innerHTML = ''; return; }
      el.hidden = false;
      const common = `
        <label>Size <input type="range" data-k="size" min="${L.type === 'photo' ? 200 : 40}" max="${L.type === 'photo' ? 2600 : 500}" step="1"></label>
        <label>Rotate <input type="range" data-k="rot" min="-180" max="180" step="1"></label>
        <div class="wte__row">
          ${L.type === 'photo' ? '<button type="button" class="wte__btn" data-act="flip">Flip</button>' : ''}
          <button type="button" class="wte__btn" data-act="front">Bring forward</button>
          <button type="button" class="wte__btn" data-act="back">Send back</button>
          <button type="button" class="wte__btn" data-act="center">Center</button>
          <button type="button" class="wte__btn wte__btn--danger" data-act="del">Delete</button>
        </div>`;
      if (L.type === 'photo') el.innerHTML = `<p class="wte__lbl">Pet photo</p>${common}`;
      else el.innerHTML = `
        <label class="wte__lbl">Text <textarea rows="2" maxlength="${MAX_CHARS + 4}" data-k="text"></textarea></label>
        <div class="wte__row">${Object.entries(FONTS).map(([k, f]) => `<button type="button" class="wte__chip wte__f-${k}${L.font === k ? ' is-on' : ''}" data-font="${k}">${f.label}</button>`).join('')}</div>
        <div class="wte__row">${TEXT_COLORS[st.style].concat(['#1F3127', '#FFFFFF']).filter((v, i, a) => a.indexOf(v) === i).map((c) => `<button type="button" class="wte__sw${L.color === c ? ' is-on' : ''}" style="--c:${c}" data-color="${c}" aria-label="Color ${c}"></button>`).join('')}</div>
        <label>Curve <input type="range" data-k="curve" min="-100" max="100" step="1"></label>
        ${common}`;
      syncPanel();
    }
    function syncPanel() {
      const L = selected(); if (!L) return; const el = $('.wte__panel');
      const set = (k, v) => { const i = el.querySelector(`[data-k="${k}"]`); if (i && document.activeElement !== i) i.value = v; };
      set('size', Math.round(L.type === 'photo' ? L.w : L.size)); set('rot', Math.round(L.rot)); set('curve', L.curve || 0); set('text', L.text || '');
    }
    root.addEventListener('input', (e) => {
      const L = selected(), k = e.target.dataset.k; if (!L || !k) return;
      if (k === 'text') {
        let v = e.target.value.replace(EMOJI, ''); const lines = v.split('\n').slice(0, 2); v = lines.join('\n');
        if (v.length > MAX_CHARS) v = v.slice(0, MAX_CHARS);
        if (v !== e.target.value) { e.target.value = v; note('Emoji and very long text can\'t be woven, so we kept letters, numbers and simple symbols (max 40 characters, 2 lines).'); }
        L.text = v;
      } else if (k === 'size') { if (L.type === 'photo') L.w = +e.target.value; else L.size = +e.target.value; }
      else if (k === 'rot') L.rot = +e.target.value; else if (k === 'curve') L.curve = +e.target.value;
      render();
    });
    root.addEventListener('change', (e) => { if (e.target.dataset.k) { commit(); warnings(); } });
    root.addEventListener('click', (e) => {
      const t = e.target.closest('button, input[type=checkbox]'); if (!t) return;
      const L = selected();
      if (t.dataset.addText !== undefined) return addText();
      if (t.dataset.layout) { st.mode = t.dataset.layout; st.manual = false; relayout(true); commit(); render(); warnings(); return; }
      if (t.dataset.undo !== undefined) { if (history.length > 1) { future.push(history.pop()); restore(history[history.length - 1]); styleBar(); render(); panel(); warnings(); save(); } return; }
      if (t.dataset.redo !== undefined) { const s = future.pop(); if (s) { history.push(s); restore(s); styleBar(); render(); panel(); warnings(); save(); } return; }
      if (t.dataset.pop) { st.popColor = +t.dataset.pop; st.touched = true; styleBar(); commit(); render(); warnings(); return; }
      if (t.dataset.banner !== undefined) {
        st.banner = t.checked;
        if (st.banner) { st.layers.push({ id: uid(), type: 'text', text: 'Merry Christmas', font: 'script', color: TEXT_COLORS.christmas[0], size: 190, rot: 0, curve: 0, x: DW / 2, y: SAFE.y + 110, banner: true }); }
        else st.layers = st.layers.filter((M) => !M.banner);
        relayout(); commit(); render(); panel(); warnings();
        return;
      }
      if (!L) return;
      if (t.dataset.font) { L.font = t.dataset.font; panel(); }
      else if (t.dataset.color) { L.color = t.dataset.color; panel(); }
      else if (t.dataset.act === 'flip') L.flip = !L.flip;
      else if (t.dataset.act === 'front') { const i = st.layers.indexOf(L); if (i < st.layers.length - 1) { st.layers.splice(i, 1); st.layers.splice(i + 1, 0, L); } }
      else if (t.dataset.act === 'back') { const i = st.layers.indexOf(L); if (i > 0) { st.layers.splice(i, 1); st.layers.splice(i - 1, 0, L); } }
      else if (t.dataset.act === 'center') { L.x = DW / 2; }
      else if (t.dataset.act === 'del') return remove(L);
      commit(); render(); warnings();
    });
    $('[data-add-photo]').addEventListener('change', (e) => { if (window.wtWarmup) window.wtWarmup(); addPhotos(e.target.files); e.target.value = ''; });
    $('[data-add-photo]').closest('label').addEventListener('click', () => window.wtWarmup && window.wtWarmup());

    // ----- checks (edge cases) -----
    let notes = [];
    function note(msg) { notes.push(msg); warnings(); setTimeout(() => { notes = notes.filter((m) => m !== msg); warnings(); }, 9000); }
    function lum(hex) { const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
    function bgHex() { return st.style === 'pop' ? POP_COLORS[st.popColor][1] : st.style === 'christmas' ? '#A8242C' : st.style === 'royal' ? '#4A2E1B' : '#F1E9DA'; }
    function warnings() {
      const out = [...notes];
      const photos = st.layers.filter((L) => L.type === 'photo');
      for (const L of st.layers) {
        const b = layerBox(g, L), cs = corners(L, b), name = L.type === 'photo' ? 'A pet' : `"${(L.text || '').slice(0, 18)}"`;
        if (cs.some(([x, y]) => x < SAFE.x || y < SAFE.y || x > SAFE.x + SAFE.w || y > SAFE.y + SAFE.h)) out.push(`${name} goes past the dashed line, so the edge may be hidden by the hem or fringe.`);
        if (L.type === 'text') {
          if (!L.text || !L.text.trim()) out.push('One text box is empty. Type something or delete it.');
          else if (L.size < MIN_TEXT) out.push(`${name} is too small to weave clearly. Make it bigger (at least about 1 inch tall).`);
          const a = lum(L.color), bb = lum(bgHex()), cr = (Math.max(a, bb) + 0.05) / (Math.min(a, bb) + 0.05);
          if (cr < 2.2) out.push(`${name} is hard to see on this background. Try another color.`);
          if (L.font === 'script' && L.size < 120) out.push(`Script letters weave best large. Make ${name} bigger or choose Classic.`);
        }
      }
      if (photos.length >= 3) out.push(`Collage of ${photos.length} pets: a $10 collage upgrade is added at checkout.`);
      $('.wte__warn').innerHTML = [...new Set(out)].map((m) => `<li>${m.replace(/</g, '&lt;')}</li>`).join('');
      root.dispatchEvent(new CustomEvent('wt:count', { bubbles: true, detail: photos.length }));
    }

    // ----- checkout: design file + originals + layout data, then collage add-on, then checkout -----
    if (form) form.addEventListener('submit', async (e) => {
      if (!st.layers.length) return;                    // no design: normal submit (photo by email)
      e.preventDefault();
      const btn = form.querySelector('[type=submit]'); const label = btn && btn.innerHTML;
      if (btn) { btn.disabled = true; btn.textContent = 'Saving your design…'; }
      try {
        const fd = new FormData(form); fd.delete('return_to'); fd.delete('properties[Pet photo]');
        const blob = await exportBlob();
        fd.append('properties[Design]', new File([blob], 'woven-tails-design.jpg', { type: 'image/jpeg' }));
        let n = 0; for (const L of st.layers) if (L.type === 'photo' && files.get(L.id)) fd.append(`properties[Pet photo ${++n}]`, files.get(L.id));
        const pets = st.layers.filter((L) => L.type === 'photo').length;
        fd.append('properties[Pets in design]', String(pets));
        const texts = st.layers.filter((L) => L.type === 'text').map((L) => `${L.text} (${FONTS[L.font].label})`).join(' | ');
        if (texts) fd.append('properties[Text on blanket]', texts);
        fd.append('properties[_Design data]', snapshot().slice(0, 4500));
        let r = await fetch('/cart/add.js', { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error((await r.json().catch(() => ({}))).description || 'Could not add to cart');
        if (pets >= 3 && addonId) {
          r = await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ items: [{ id: +addonId, quantity: 1, properties: { For: `${pets}-pet collage` } }] }) });
        }
        try { localStorage.removeItem(key); } catch (x) {}
        location.href = '/checkout';
      } catch (err) {
        console.error(err);
        if (btn) { btn.disabled = false; btn.innerHTML = label; }
        note('Something went wrong saving your design: ' + err.message + '. Please try again, or email hello@woventails.com.');
      }
    });


    // ----- desktop: preview on the left (sticky) with Design / 3D tabs, controls on the right -----
    let view = '3d', setView = () => {};
    (function desktopLayout() {
      const hero = root.closest('.hero'), stage3d = hero && hero.querySelector(':scope > .stage, :scope > .wte-viewer > .stage');
      if (!stage3d) return;
      let viewer = hero.querySelector('.wte-viewer');
      if (!viewer) {
        viewer = document.createElement('div'); viewer.className = 'wte-viewer';
        viewer.innerHTML = '<div class="wte-tabs" role="tablist" aria-label="Preview"><button type="button" role="tab" data-view="design" aria-selected="false">Your design</button><button type="button" role="tab" data-view="3d" aria-selected="true">3D blanket</button></div><p class="wte__hint"></p>';
        stage3d.parentNode.insertBefore(viewer, stage3d); viewer.insertBefore(stage3d, viewer.querySelector('.wte__hint'));
      }
      const edStage = root.querySelector('.wte__stage'), hint = viewer.querySelector('.wte__hint');
      const mq = matchMedia('(min-width: 900px)');
      setView = (v) => {
        view = v;
        viewer.querySelectorAll('[data-view]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.view === v)));
        if (!mq.matches) return;
        edStage.hidden = v !== 'design'; stage3d.hidden = v !== '3d';
        hint.textContent = v === 'design' ? 'Drag to move · corner handle resizes · top handle rotates · edit with the controls on the right' : 'Drag to turn · this is how your design looks woven';
        if (v === '3d') requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
        fit();
      };
      viewer.addEventListener('click', (e) => { const b = e.target.closest('[data-view]'); if (b) setView(b.dataset.view); });
      const apply = () => {
        if (mq.matches) { viewer.classList.add('is-desktop'); viewer.insertBefore(edStage, stage3d); root.querySelector('.wte__fine').hidden = true; setView(view); }
        else { viewer.classList.remove('is-desktop'); root.querySelector('.wte').prepend(edStage); edStage.hidden = false; stage3d.hidden = false; root.querySelector('.wte__fine').hidden = false; hint.textContent = ''; fit(); }
      };
      (mq.addEventListener ? mq.addEventListener('change', apply) : mq.addListener(apply)); apply();
    })();
    new ResizeObserver(() => fit()).observe(cv.parentElement);
    if (document.fonts) Promise.all(Object.values(FONTS).map((f) => document.fonts.load(f.css.replace('{s}', '40')).catch(() => {}))).then(() => render());
    if (document.fonts) document.fonts.addEventListener('loadingdone', () => render());
    syncStyleFromPage(false); styleBar(); history = [snapshot()]; fit(); warnings(); load();
    return { st };
  }

  window.WTEditor = { mount };
  const boot = () => document.querySelectorAll('[data-wt-editor]:not([data-mounted])').forEach((el) => { el.dataset.mounted = '1'; mount(el); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
