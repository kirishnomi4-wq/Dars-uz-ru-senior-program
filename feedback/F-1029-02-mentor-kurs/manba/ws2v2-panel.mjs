// WebSocket-2 v2 (F-1104-23): brauzerdagi HAQIQIY panel (/admin) kuzatuvchisi — headless Chrome. drive-ws2v2.sh boshqaradi.
// ISHLATISH: node ws2v2-panel.mjs <url> <token> <out-papka> <nom> <soniya>
// Bash bilan aloqa — fayllar (out-papkada): .snap-<izoh> → surat <nom>-<n>.png + holat satri · .offline / .online → brauzer
// tarmog'i (DevTools «Offline» bilan bir xil CDP buyrug'i) · .end → tugash. Panel ulangach .ready yoziladi.
// Logga: WebSocket ochildi/yopildi, kelgan order-changed kadri, har GET /admin/orders, belgi o'zgarishi.
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { writeFileSync, existsSync, readdirSync, unlinkSync, appendFileSync } from 'fs';
const [url, token, out, nom, sek] = process.argv.slice(2);
const LOG = `${out}/${nom}-panel.txt`;
writeFileSync(LOG, '');
const t = () => { const d = new Date(); return d.toTimeString().slice(0, 8) + '.' + String(d.getMilliseconds()).padStart(3, '0'); };
const log = (s) => appendFileSync(LOG, `${t()} ${s}\n`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: 1100, height: 430 } });
const p = await ctx.newPage();
let get = 0;
p.on('websocket', (ws) => {
  log('brauzer: WebSocket ochildi');
  ws.on('close', () => log('brauzer: WebSocket yopildi'));
  ws.on('framereceived', (f) => { const s = String(f.payload); if (s.includes('order-changed')) log(`brauzer: kadr keldi ${s}`); });
});
p.on('request', (r) => { if (r.url().includes('/admin/orders')) log(`brauzer: GET /admin/orders (${++get})`); });
const qator = async () => p.$$eval('#royxat tr', (trs) => trs.map((tr) => (tr.children.length > 1 ? '#' + tr.children[0].innerText : tr.innerText) + (tr.className === 'yangi' ? ' [sariq]' : '')).join(', '));
const holat = async () => `belgi «${await p.textContent('#holat')}» · ro'yxat: ${await qator()}`;
await p.goto(`${url}/admin`);
await p.fill('#token', token);
await p.click('button');
await p.waitForFunction(() => document.querySelector('#holat').textContent === 'Ulangan', null, { timeout: 10000 }).catch(() => {});
await sleep(600);
log(`panel ochildi — ${await holat()}`);
writeFileSync(`${out}/.ready`, '');
let oldi = await p.textContent('#holat');
let n = 0;
const end = Date.now() + Number(sek) * 1000;
while (Date.now() < end && !existsSync(`${out}/.end`)) {
  const h = await p.textContent('#holat').catch(() => oldi);
  if (h !== oldi) { log(`belgi: «${oldi}» → «${h}»`); oldi = h; }
  for (const f of readdirSync(out).filter((x) => x.startsWith('.snap-') || x === '.offline' || x === '.online').sort()) {
    unlinkSync(`${out}/${f}`);
    if (f === '.offline') { await ctx.setOffline(true); log('— brauzer: Offline yoqildi (DevTools → Network → Offline)'); }
    else if (f === '.online') { await ctx.setOffline(false); log('— brauzer: Offline o\'chirildi'); }
    else {
      n++; await p.screenshot({ path: `${out}/${nom}-${n}.png` }); log(`SURAT ${nom}-${n} (${f.slice(6).replace(/^\d+-/, '')}) — ${await holat()}`);
      // to'liq qatorlar (dars ekranidagi panel maketi uchun): [yangi] id | mijoz | telefon | mahsulotlar | jami | holat | vaqt
      const rows = await p.$$eval('#royxat tr', (trs) => trs.map((tr) => (tr.className === 'yangi' ? '[yangi] ' : '') + [...tr.children].map((td) => td.innerText.replace(/\n/g, ' / ')).join(' | ')));
      for (const r of rows) appendFileSync(LOG, `    ${r}\n`);
    }
  }
  await sleep(150);
}
log(`tugadi — ${await holat()} · jami GET: ${get}`);
await b.close();
