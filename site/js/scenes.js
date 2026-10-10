// Woven Tails 3D scenes (three.js r160): woven blanket, page-turning storybook, opening gift box.
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const loader = new THREE.TextureLoader();
const imgCache = new Map();

function loadImage(src) {
  if (!imgCache.has(src)) {
    imgCache.set(src, new Promise((res, rej) => {
      const im = new Image(); if (!src.startsWith("data:")) im.crossOrigin = "anonymous"; im.onload = () => res(im); im.onerror = rej; im.src = src;
    }));
  }
  return imgCache.get(src);
}

function canvasTex(canvas, renderer) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}

function setup(stage, { fov = 32, pos = [0, 0.4, 7.2], target = [0, 0, 0], floorY = -2.2, azimuth = 0.9, floor: hasFloor = true, fitAspect = 1 } = {}) {
  const canvas = document.createElement("canvas");
  stage.prepend(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.set(...pos);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(...target);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.minPolarAngle = 0.55;
  controls.maxPolarAngle = 1.9;
  controls.minAzimuthAngle = -azimuth;
  controls.maxAzimuthAngle = azimuth;
  controls.rotateSpeed = 0.6;
  const baseOffset = camera.position.clone().sub(controls.target);

  scene.add(new THREE.HemisphereLight(0xfff4e2, 0x3d4b3f, 1.25));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(3.5, 6, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 0.5, far: 30 });
  key.shadow.bias = -0.0004;
  key.shadow.radius = 6;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffcf9e, 0.9);
  rim.position.set(-5, 2, -4);
  scene.add(rim);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.16 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = floorY;
  floor.receiveShadow = true;
  if (hasFloor) scene.add(floor);

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);
  const resize = () => {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // On tall screens pull the camera back so the whole object stays in frame.
    const f = Math.max(1, fitAspect / camera.aspect) * (window.__fitScale || 1);
    camera.position.copy(controls.target).add(baseOffset.clone().multiplyScalar(f));
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  const clock = new THREE.Clock();
  let first = true;
  function loop(tick) {
    if (window.__manual) {
      // Offline rendering for video export: the recorder advances time frame by frame.
      const sph = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
      let simT = 0;
      window.__step = (dt) => {
        simT += dt;
        tick(simT, dt);
        const s2 = sph.clone(); s2.theta += 0.32 * Math.sin(simT * 0.45);
        camera.position.setFromSpherical(s2).add(controls.target);
        camera.lookAt(controls.target);
        renderer.render(scene, camera);
      };
      stage.classList.add("ready");
      return;
    }
    renderer.setAnimationLoop(() => {
      if (!visible) { clock.getDelta(); return; }
      const dt = Math.min(clock.getDelta(), 0.05);
      tick(clock.elapsedTime, dt);
      controls.update();
      renderer.render(scene, camera);
      if (first) { first = false; stage.classList.add("ready"); }
    });
  }
  return { renderer, scene, camera, controls, loop, key };
}

/* ---------- woven textures ---------- */

// Turns square artwork into a jacquard-looking 52x37 in blanket face: limited yarn palette + over/under thread shading.
async function wovenFace(src, renderer) {
  const img = await loadImage(src);
  const W = 1560, H = 1110; // 52:37
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d");
  const probe = document.createElement("canvas"); probe.width = probe.height = 8;
  const pg = probe.getContext("2d"); pg.drawImage(img, 0, 0, 8, 8);
  const [r, gg, b] = pg.getImageData(0, 0, 1, 1).data;
  const bg = `rgb(${r},${gg},${b})`;
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const s = H * 0.9;
  g.drawImage(img, (W - s) / 2, (H - s) / 2, s, s);
  // woven border bands on the long edges
  const band = (y) => {
    for (let x = 0; x < W; x += 24) {
      g.fillStyle = (x / 24) % 2 ? "rgba(255,248,236,.55)" : "rgba(0,0,0,.18)";
      g.fillRect(x, y, 24, 10);
    }
  };
  band(14); band(H - 24);
  const d = g.getImageData(0, 0, W, H); const px = d.data;
  const q = (v) => Math.round(v / 36) * 36; // ~8 levels per channel ≈ yarn palette
  for (let y = 0; y < H; y++) {
    const fy = (y % 6) / 6;
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const fx = (x % 6) / 6;
      const warpUp = ((Math.floor(x / 6) + Math.floor(y / 6)) & 1) === 0;
      const prof = warpUp ? Math.sin(Math.PI * fx) : Math.sin(Math.PI * fy);
      const shade = 0.8 + 0.28 * prof;
      px[i] = Math.min(255, q(px[i]) * shade);
      px[i + 1] = Math.min(255, q(px[i + 1]) * shade);
      px[i + 2] = Math.min(255, q(px[i + 2]) * shade);
    }
  }
  g.putImageData(d, 0, 0);
  return { tex: canvasTex(c, renderer), edge: new THREE.Color(bg) };
}

let bumpTex;
function weaveBump() {
  if (bumpTex) return bumpTex;
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d");
  for (let y = 0; y < 64; y += 8) for (let x = 0; x < 64; x += 8) {
    const up = ((x + y) / 8) & 1;
    const grad = up ? g.createLinearGradient(x, 0, x + 8, 0) : g.createLinearGradient(0, y, 0, y + 8);
    grad.addColorStop(0, "#333"); grad.addColorStop(0.5, "#eee"); grad.addColorStop(1, "#333");
    g.fillStyle = grad; g.fillRect(x, y, 8, 8);
  }
  bumpTex = new THREE.CanvasTexture(c);
  bumpTex.wrapS = bumpTex.wrapT = THREE.RepeatWrapping;
  bumpTex.repeat.set(130, 92);
  return bumpTex;
}

/* ---------- blanket ---------- */

export function initBlanket(stage, { art = "golden-pop", base = "tex/" } = {}) {
  const { renderer, scene, loop, key } = setup(stage, { pos: [0.2, 0.5, 9.6], floor: false, fitAspect: 1.15 });
  key.position.set(2.5, 5, 6);
  const BW = 5.2, BH = 3.7, SX = 90, SY = 64;
  const geo = new THREE.PlaneGeometry(BW, BH, SX, SY);
  const base0 = geo.attributes.position.array.slice();
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0, side: THREE.DoubleSide,
    bumpMap: weaveBump(), bumpScale: 1.6, color: 0xffffff });
  const cloth = new THREE.Mesh(geo, mat);
  cloth.castShadow = true;
  const rig = new THREE.Group();
  rig.add(cloth);
  rig.rotation.set(-0.06, -0.22, 0.02);
  scene.add(rig);

  // fringe: short tassels on both 37 in ends, colours from the yarn palette
  const N = 2 * 70;
  const fringe = new THREE.InstancedMesh(new THREE.BoxGeometry(0.018, 0.016, 0.24), new THREE.MeshStandardMaterial({ roughness: 1 }), N);
  fringe.castShadow = true;
  rig.add(fringe);
  const yarn = [0xb9582f, 0xc99a34, 0x1f3127, 0xf4eee3, 0x6c3b2a, 0x2f5a6b];
  for (let i = 0; i < N; i++) fringe.setColorAt(i, new THREE.Color(yarn[i % yarn.length]));
  const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), e4 = new THREE.Euler(), v4 = new THREE.Vector3(), s4 = new THREE.Vector3(1, 1, 1);

  const pos = geo.attributes.position;
  const zAt = (x, y, t) =>
    0.22 * Math.sin(x * 1.25 + t * 1.5) * (0.35 + 0.65 * ((x + BW / 2) / BW)) +
    0.07 * Math.sin(y * 2.2 + t * 1.15 + x * 0.6) -
    0.18 * (x / (BW / 2)) ** 2;

  let t0 = 0;
  loop((t) => {
    const tt = REDUCE ? 0.8 : t;
    t0 = tt;
    for (let i = 0; i < pos.count; i++) {
      const x = base0[i * 3], y = base0[i * 3 + 1];
      pos.setZ(i, zAt(x, y, tt));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    for (let i = 0; i < N; i++) {
      const side = i < N / 2 ? -1 : 1;
      const k = i % (N / 2);
      const y = -BH / 2 + 0.05 + (k / (N / 2 - 1)) * (BH - 0.1);
      const x = side * BW / 2;
      const z = zAt(x, y, tt);
      const dz = zAt(x + side * 0.05, y, tt) - z;
      v4.set(x + side * 0.12, y, z + dz * 2.4);
      e4.set(0, Math.PI / 2 - Math.atan2(dz, 0.05) * side * 0.6, 0.12 * Math.sin(tt * 2 + k));
      q4.setFromEuler(e4);
      fringe.setMatrixAt(i, m4.compose(v4, q4, s4));
    }
    fringe.instanceMatrix.needsUpdate = true;
    rig.position.y = REDUCE ? 0 : Math.sin(tt * 0.8) * 0.06;
  });

  let token = 0;
  async function setArt(name) {
    const my = ++token;
    const { tex } = await wovenFace(`${base}${name}.jpg`, renderer);
    if (my !== token) { tex.dispose(); return; }
    if (mat.map) mat.map.dispose();
    mat.map = tex; mat.needsUpdate = true;
  }
  async function setArtURL(url) {
    const my = ++token;
    const { tex } = await wovenFace(url, renderer);
    if (my !== token) { tex.dispose(); return; }
    if (mat.map) mat.map.dispose();
    mat.map = tex; mat.needsUpdate = true;
  }
  setArt(art);
  return { setArt, setArtURL };
}

/* ---------- storybook ---------- */

function endpaper(renderer, label) {
  const c = document.createElement("canvas"); c.width = c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#1F3127"; g.fillRect(0, 0, 512, 512);
  g.strokeStyle = "rgba(201,154,52,.35)"; g.lineWidth = 2;
  for (let i = -512; i < 512; i += 26) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 512, 512); g.stroke(); }
  if (label) {
    g.fillStyle = "#F4EEE3"; g.textAlign = "center";
    g.font = "italic 600 54px Fraunces, Georgia, serif"; g.fillText(label, 256, 250);
    g.font = "600 22px Nunito, sans-serif"; g.fillText("WOVEN TAILS", 256, 300);
  }
  return canvasTex(c, renderer);
}

export function initBook(stage, { variant = "dog", base = "tex/" } = {}) {
  const { renderer, scene, loop, camera, controls } = setup(stage, { pos: [0, 7.0, 2.3], target: [0, -0.5, 0.05], fov: 32, floorY: -0.62, azimuth: 0.8, fitAspect: 1.1 });
  controls.minPolarAngle = 0.3; controls.maxPolarAngle = 1.2;
  const book = new THREE.Group();
  book.rotation.x = -Math.PI / 2;
  book.position.y = -0.5;
  scene.add(book);

  const S = 2.0;
  const boardMat = new THREE.MeshStandardMaterial({ color: 0x1f3127, roughness: 0.6 });
  const boardGeo = new RoundedBoxGeometry(S + 0.08, S + 0.1, 0.07, 3, 0.02);
  const leftBoard = new THREE.Mesh(boardGeo, boardMat); leftBoard.position.set(-(S + 0.08) / 2, 0, -0.06);
  const rightBoard = new THREE.Mesh(boardGeo, boardMat); rightBoard.position.set((S + 0.08) / 2, 0, -0.06);
  [leftBoard, rightBoard].forEach((b) => { b.castShadow = b.receiveShadow = true; book.add(b); });
  const blockMat = new THREE.MeshStandardMaterial({ color: 0xf6f1e7, roughness: 0.95 });
  const leftBlock = new THREE.Mesh(new THREE.BoxGeometry(S - 0.04, S - 0.04, 0.05), blockMat); leftBlock.position.set(-S / 2, 0, -0.005);
  const rightBlock = leftBlock.clone(); rightBlock.position.x = S / 2;
  [leftBlock, rightBlock].forEach((b) => { b.castShadow = b.receiveShadow = true; book.add(b); });

  let sheets = [], flipped = 0, anims = [];
  const SEG = 28;

  function makeSheet(front, back, i, n) {
    const geo = new THREE.PlaneGeometry(S - 0.04, S - 0.04, SEG, 1);
    geo.translate((S - 0.04) / 2, 0, 0);
    const base = geo.attributes.position.array.slice();
    back.wrapS = THREE.RepeatWrapping; back.repeat.x = -1;
    const fm = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: front, roughness: 0.85, side: THREE.FrontSide }));
    const bm = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: back, roughness: 0.85, side: THREE.BackSide }));
    fm.castShadow = bm.castShadow = true;
    const g = new THREE.Group(); g.add(fm, bm);
    g.userData = { geo, base, p: 0, i, n };
    book.add(g);
    return g;
  }

  function pose(sheet) {
    const { geo, base, p, i, n } = sheet.userData;
    const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
    sheet.rotation.y = -Math.PI * e;
    sheet.position.z = 0.03 + (p < 0.5 ? (n - i) : i) * 0.004 + Math.sin(Math.PI * e) * 0.02;
    const pos = geo.attributes.position, curl = Math.sin(Math.PI * e) * 0.55;
    for (let k = 0; k < pos.count; k++) {
      const x = base[k * 3];
      pos.setZ(k, curl * (x / S) ** 2);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  async function build(v) {
    sheets.forEach((s) => { book.remove(s); s.traverse((o) => { if (o.material) { o.material.map?.dispose(); o.material.dispose(); } }); s.userData.geo.dispose(); });
    sheets = []; flipped = 0; anims = [];
    const names = v === "cat" ? ["00-cover", "08", "10", "12", "13", "23"] : ["00-cover", "01", "11", "12", "16", "23"];
    const texs = await Promise.all(names.map((n) => loader.loadAsync(`${base}${v}-${n}.jpg`)));
    texs.forEach((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); });
    const ep = () => endpaper(renderer);
    const pairs = [[texs[0], ep()], [texs[1], texs[2]], [texs[3], texs[4]], [texs[5], endpaper(renderer, "The end")]];
    pairs.forEach(([f, b], i) => sheets.push(makeSheet(f, b, i, pairs.length)));
    sheets.forEach(pose);
  }

  function flip(dir) {
    if (dir > 0 && flipped < sheets.length) { anims.push({ s: sheets[flipped], to: 1 }); flipped++; }
    else if (dir < 0 && flipped > 0) { flipped--; anims.push({ s: sheets[flipped], to: 0 }); }
  }

  let auto = !REDUCE, wait = 1.6, holdUntil = 0;
  loop((t, dt) => {
    anims = anims.filter((a) => {
      const d = a.to - a.s.userData.p;
      const step = Math.sign(d) * dt / 1.1;
      a.s.userData.p = Math.abs(step) >= Math.abs(d) ? a.to : a.s.userData.p + step;
      pose(a.s);
      return a.s.userData.p !== a.to;
    });
    if (auto && t > holdUntil && sheets.length) {
      wait -= dt;
      if (wait <= 0) {
        if (flipped < sheets.length - 1) { flip(1); wait = 2.6; }
        else { while (flipped > 0) flip(-1); wait = 3.4; }
      }
    }
    book.position.y = -0.5 + (REDUCE ? 0 : Math.sin(t * 0.9) * 0.02);
  });

  build(variant);
  return {
    setVariant: (v) => build(v),
    next: () => { flip(1); holdUntil = performance.now() / 1000 + 8; },
    prev: () => { flip(-1); holdUntil = performance.now() / 1000 + 8; },
    _clockHold: (s) => { holdUntil = s; },
  };
}

/* ---------- gift box ---------- */

function kraft(renderer) {
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = "#b98a5a"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = `rgba(${Math.random() > 0.5 ? "255,240,220" : "70,40,20"},${Math.random() * 0.08})`;
    g.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 18, 1);
  }
  const t = canvasTex(c, renderer); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2);
  return t;
}

export function initGift(stage, { art = "golden-pop", cover = "dog-00-cover", base = "tex/" } = {}) {
  const { renderer, scene, loop } = setup(stage, { pos: [3.2, 3.4, 6.4], target: [0, 0.3, 0], fov: 34, floorY: -0.9, azimuth: 1.1, fitAspect: 0.95 });
  const kr = kraft(renderer);
  const boxMat = new THREE.MeshStandardMaterial({ map: kr, roughness: 0.9 });
  const inner = new THREE.MeshStandardMaterial({ color: 0xf2e8d8, roughness: 1 });
  const box = new THREE.Group(); box.position.y = -0.9; scene.add(box);
  const W = 2.6, D = 2.0, Hh = 1.0, T = 0.05;
  const wall = (w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [boxMat, boxMat, inner, boxMat, boxMat, boxMat]); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; box.add(m); };
  wall(W, T, D, 0, T / 2, 0);
  wall(W, Hh, T, 0, Hh / 2, D / 2); wall(W, Hh, T, 0, Hh / 2, -D / 2);
  wall(T, Hh, D, W / 2, Hh / 2, 0); wall(T, Hh, D, -W / 2, Hh / 2, 0);
  // tissue
  const tissue = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.12, D - 0.12, 30, 24), new THREE.MeshStandardMaterial({ color: 0xf7f1e6, roughness: 1, side: THREE.DoubleSide }));
  tissue.rotation.x = -Math.PI / 2; tissue.position.y = 0.12;
  const tp = tissue.geometry.attributes.position;
  for (let i = 0; i < tp.count; i++) {
    const ex = Math.max(0, Math.abs(tp.getX(i)) - (W / 2 - 0.35)), ey = Math.max(0, Math.abs(tp.getY(i)) - (D / 2 - 0.35));
    tp.setZ(i, (Math.sin(tp.getX(i) * 6) * Math.cos(tp.getY(i) * 5)) * 0.025 + (ex + ey) * 1.6);
  }
  tissue.geometry.computeVertexNormals(); box.add(tissue);

  // lid with ribbon
  const lid = new THREE.Group();
  const lidBox = new THREE.Mesh(new THREE.BoxGeometry(W + 0.12, 0.32, D + 0.12), boxMat); lidBox.castShadow = true; lid.add(lidBox);
  const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xb9582f, roughness: 0.45 });
  const r1 = new THREE.Mesh(new THREE.BoxGeometry(W + 0.14, 0.34, 0.24), ribbonMat); lid.add(r1);
  const r2 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.34, D + 0.14), ribbonMat); lid.add(r2);
  const bow = new THREE.Mesh(new THREE.TorusKnotGeometry(0.17, 0.06, 80, 10, 2, 3), ribbonMat); bow.position.y = 0.3; bow.castShadow = true; lid.add(bow);
  box.add(lid);
  const lidClosed = new THREE.Vector3(0, Hh + 0.12, 0);

  // folded blanket (woven face on top) and closed book
  const blanketMats = [new THREE.MeshStandardMaterial({ roughness: 0.95, bumpMap: weaveBump(), bumpScale: 1.2 })];
  const fold = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.42, 1.3, 4, 0.12), blanketMats[0]);
  fold.castShadow = fold.receiveShadow = true;
  const bookG = new THREE.Group();
  const coverT = loader.load(`${base}${cover}.jpg`); coverT.colorSpace = THREE.SRGBColorSpace;
  const bookMesh = new THREE.Mesh(new RoundedBoxGeometry(1.05, 1.05, 0.12, 3, 0.02),
    [new THREE.MeshStandardMaterial({ color: 0xf6f1e7 }), new THREE.MeshStandardMaterial({ color: 0x1f3127 }),
     new THREE.MeshStandardMaterial({ color: 0xf6f1e7 }), new THREE.MeshStandardMaterial({ color: 0xf6f1e7 }),
     new THREE.MeshStandardMaterial({ map: coverT, roughness: 0.5 }), new THREE.MeshStandardMaterial({ color: 0x1f3127 })]);
  bookMesh.castShadow = true; bookG.add(bookMesh);
  box.add(fold, bookG);

  wovenFace(`${base}${art}.jpg`, renderer).then(({ tex, edge }) => {
    // crop the woven face to the folded panel's proportions
    tex.repeat.set(0.6, 0.6 * (1.3 / 1.5) * (52 / 37)); tex.offset.set(0.2, (1 - 0.6 * (1.3 / 1.5) * (52 / 37)) / 2);
    blanketMats[0].map = tex; blanketMats[0].color = new THREE.Color(0xffffff); blanketMats[0].needsUpdate = true;
  });

  const smooth = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const CYCLE = 9;
  loop((t) => {
    const c = REDUCE ? 4.5 : t % CYCLE;
    const open = smooth(0.8, 2.2, c) * (1 - smooth(7.4, 8.6, c));
    const rise = smooth(2.0, 3.6, c) * (1 - smooth(6.8, 8.0, c));
    lid.position.set(lidClosed.x - open * 2.3, lidClosed.y + Math.sin(open * Math.PI) * 0.9 + open * -0.95, lidClosed.z - open * 0.6);
    lid.rotation.set(-open * 0.35, 0, open * 0.55);
    fold.position.set(-0.55 - rise * 0.15, 0.36 + rise * 1.3, 0.1 + rise * 0.4);
    fold.rotation.set(rise * 0.55, rise * 0.25, 0);
    bookG.position.set(0.72 + rise * 0.5, 0.24 + rise * 1.35, rise * 0.2);
    bookG.rotation.set(-1.45 + rise * 1.2, -0.2 + rise * -0.25, 0.04);
    bow.rotation.y = t * 0.6;
  });
}
