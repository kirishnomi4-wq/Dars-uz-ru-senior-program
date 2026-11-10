// Bitta ekranning ANIQ segmentini suratga oladi (03.11, F-1103-09): ovoz o'chirilganda segmentlar ~0,4 s da o'tadi,
// shuning uchun DOM har 60 ms da tekshiriladi va kerakli segment yonishi bilan surat olinadi.
// ISHLATISH (dev :5333): node dev/surat-segment-tez.mjs <base> <dars> <s 0-asosli> <segment 0-asosli> <out.png> [WxH]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [base, dars, s, segWant, out, size = '1920x1080'] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage({ viewport: { width: W, height: H } });
await p.goto(`${base}/mentor-kurs.html?dars=${dars}&s=${s}`, { waitUntil: 'load' });
await p.waitForSelector('.mk-stage');
await p.waitForTimeout(250);
const mute = await p.$('.mk-audio button'); if (mute) await mute.click();
let got = false;
for (let t = 0; t < 400; t++) {
  const on = await p.evaluate(() => [...document.querySelectorAll('.mk-dots i')].findIndex((x) => x.classList.contains('on')));
  if (on === Number(segWant)) { await p.waitForTimeout(120); await p.screenshot({ path: out }); got = true; break; }
  if (on > Number(segWant)) break;
  await p.waitForTimeout(60);
}
console.log(got ? `OK ${out}` : `TOPILMADI: segment ${segWant} o'tib ketdi yoki yo'q`);
await b.close();
