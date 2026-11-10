// WebSocket-1 v2 · 11-tajriba: panel bitta bosqich — token bilan ochiladi, ro'yxat o'zgarishi kutiladi (15 s).
// ISHLATISH: node ws1v2-panel-bir.mjs <url> <token> <out-png> <out-txt>
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { writeFileSync } from 'fs';
const [url, token, png, txt] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1100, height: 420 } });
const t = () => new Date().toTimeString().slice(0, 8);
const rows = () => p.$$eval('#royxat tr', (trs) => trs.map((tr) => `${tr.className ? '[' + tr.className + '] ' : ''}${[...tr.children].map((td) => td.innerText).join(' | ')}`));
await p.goto(`${url}/admin`);
await p.fill('#token', token);
await p.click('button');
await new Promise((r) => setTimeout(r, 1500));
const before = await rows();
const t0 = t();
// mezon: ro'yxat matni o'zgardimi (yangi qator yoki holat) — 15 s kutiladi
const ok = await p.waitForFunction((old) => document.querySelector('#royxat').innerText !== old, await p.evaluate(() => document.querySelector('#royxat').innerText), { timeout: 15000 }).then(() => true, () => false);
await new Promise((r) => setTimeout(r, 2500));
const after = await rows();
await p.screenshot({ path: png });
writeFileSync(txt, `${t0} panel ochildi · belgi: ${await p.textContent('#holat')}\nOLDIN:\n  ${before.join('\n  ')}\n${t()} 15 s gacha kutildi — ro'yxat ${ok ? "O'ZGARDI" : "O'ZGARMADI"}:\n  ${after.join('\n  ')}\n`);
await b.close();
