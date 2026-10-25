// Export a 3D scene from site/render.html as 30 fps JPEG frames (deterministic, frame by frame).
// Usage: (cd site && python3 -m http.server 8765) then: node scripts/record_3d.mjs <blanket|book|bookcat|gift> <seconds> <outdir>
// Encode: ffmpeg -framerate 30 -i <outdir>/f%04d.jpg -c:v libx264 -crf 18 -pix_fmt yuv420p assets/clips/3d-<mode>.mp4
import { chromium } from 'playwright';
import fs from 'fs';
const [mode, secs, out] = [process.argv[2], +process.argv[3], process.argv[4]];
const FPS = 30, N = secs * FPS;
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const p = await (await browser.newContext({ viewport:{width:720,height:1280} })).newPage();
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto(`http://localhost:8765/render.html?manual=1#${mode}`, { waitUntil:'networkidle' });
await p.waitForTimeout(2500);
if (mode === 'blanket') await p.evaluate(() => window.__setArt('golden-pop'));
for (let i = 0; i < N; i++) {
  if (mode === 'blanket' && i > 0 && i % 66 === 0) {
    const k = (i / 66) % 6;
    await p.evaluate((k) => window.__setArt(window.__arts[k]), k);
  }
  await p.evaluate(() => window.__step(1 / 30));
  await p.screenshot({ path: `${out}/f${String(i).padStart(4,'0')}.jpg`, type: 'jpeg', quality: 92 });
}
await browser.close();
console.log('frames', N);
