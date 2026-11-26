// Ovozi yo'q xato izohi: variant bosilganda /tts/*.mp3 javobi va UI holati (qotadimi, Davom ochiladimi)
// node yoq-mp3.mjs <base> <dars> <s 0-based> <xato variant> <to'g'ri variant> [uz|ru]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [base, dars, s, bad, good, lang = 'uz'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
await p.addInitScript(() => { const pl = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { this.playbackRate = 16; return pl.call(this); }; });
const tts = []; const errs = [];
p.on('response', (r) => { if (/\/tts\//.test(r.url())) tts.push(r.status()); });
p.on('pageerror', (e) => errs.push(String(e).slice(0, 120)));
await p.goto(`${base}/mentor-kurs.html?dars=${dars}&s=${s}&lang=${lang}`, { waitUntil: 'load' });
await p.waitForSelector('.mk-stage');
for (let i = 0; i < 60; i++) { await p.waitForTimeout(500); if (!(await p.$('text=ustoz gapiryapti')) && !(await p.$('text=учитель говорит'))) break; }
const before = tts.length;
const o = await p.$$('.mk-opt');
await o[+bad].click();
await p.waitForTimeout(4000);
const afterBad = tts.slice(before);
const busy = !!((await p.$('text=ustoz gapiryapti')) || (await p.$('text=учитель говорит')));
await o[+good].click();
await p.waitForTimeout(6000);
const nb = await p.$('.mk-nav .mk-btn:last-child');
const davom = nb ? !(await nb.isDisabled()) : null;
console.log(JSON.stringify({ dars, s: +s + 1, xatoBosilganda_tts: afterBad, gapiryaptiQoldi: busy, togridanKeyinDavom: davom, errs }));
await b.close();
