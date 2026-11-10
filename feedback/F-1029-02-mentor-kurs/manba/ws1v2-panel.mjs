// WebSocket-1 v2: brauzerdagi HAQIQIY panel (/admin) — headless Chrome. drive-ws1v2.sh 10-qadamida chaqiriladi.
// ISHLATISH: node ws1v2-panel.mjs <url> <token> <out-papka>   (server «buyurtma 6000» senariysida, 0-soniyada ochilgan)
// Har bosqichda: surat (png) + holat belgisi matni + ro'yxat qatorlari (txt).
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { writeFileSync } from 'fs';
const [url, token, out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1100, height: 520 } });
const log = [];
const t = () => new Date().toTimeString().slice(0, 8);
const snap = async (name, note) => {
  const holat = await p.textContent('#holat');
  const rows = await p.$$eval('#royxat tr', (trs) => trs.map((tr) => `${tr.className ? '[' + tr.className + '] ' : ''}${[...tr.children].map((td) => td.innerText.replace(/\n/g, ' / ')).join(' | ')}`));
  log.push(`${t()} ${name} — ${note}\n  belgi: ${holat}\n  ${rows.join('\n  ')}`);
  await p.screenshot({ path: `${out}/${name}.png` });
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await p.goto(`${url}/admin`);
await p.fill('#token', token);
await p.click('button');
await sleep(1500);
await snap('10a-panel-ulangan', 'token kiritildi, Kirish bosildi');
await p.waitForFunction(() => document.querySelector('#royxat tr.yangi'), null, { timeout: 15000 }).catch(() => {});
await snap('10b-yangi-buyurtma', 'bot buyurtma oldi — sahifa yangilanmadi');
await sleep(2500);
await snap('10c-holat-ozgardi', 'admin tasdiqladi');
// noto'g'ri token — ikkinchi oyna (server ishlab turibdi)
const p2 = await b.newPage({ viewport: { width: 1100, height: 520 } });
await p2.goto(`${url}/admin`);
await p2.fill('#token', 'notogri');
await p2.click('button');
await sleep(1500);
log.push(`${t()} 10e-notogri-token — ikkinchi oyna, token «notogri»\n  belgi: ${await p2.textContent('#holat')}\n  ${await p2.textContent('#royxat')}`);
await p2.screenshot({ path: `${out}/10e-notogri-token.png` });
await p2.close();
// bash serverni to'xtatadi (.kill fayli — signal), keyin «Ulanmoqda…»
writeFileSync(`${out}/.kill`, '');
await sleep(4000);
await snap('10d-server-ochdi', "server to'xtatildi");
writeFileSync(`${out}/10-panel.txt`, log.join('\n') + '\n');
await b.close();
