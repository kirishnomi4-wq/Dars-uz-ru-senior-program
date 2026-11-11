import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { readFileSync } from 'node:fs';
const url = readFileSync(process.argv[2], 'utf8').trim();
const W = +(process.argv[3] || 1440), Hh = +(process.argv[4] || 900), QADAM = +(process.argv[5] || 40);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await b.newContext({ viewport: { width: W, height: Hh } });
const pg = await ctx.newPage();
await pg.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
await pg.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await pg.waitForTimeout(2000);
const OLCH = () => {
  const H = window.innerHeight, res = [];
  const docScroll = () => { const de = document.scrollingElement || document.documentElement; const oh = e => getComputedStyle(e).overflowY; return de.scrollHeight > H + 1 && !/hidden|clip/.test(oh(document.documentElement)) && !/hidden|clip/.test(oh(document.body)); };
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1 || r.bottom <= H + 1) continue;
    if ([...el.children].some(c => c.getBoundingClientRect().bottom > H + 1)) continue;
    let a = el.parentElement, ok = null, zanjir = [];
    while (a && a !== document.body) { const s = getComputedStyle(a); zanjir.push((a.className||a.tagName).toString().slice(0,18)+':'+s.overflowY+':'+Math.round(a.getBoundingClientRect().bottom)); if (/auto|scroll/.test(s.overflowY) && a.scrollHeight > a.clientHeight + 1) { ok = 'skroll'; break; } if (/hidden|clip/.test(s.overflowY) && a.getBoundingClientRect().bottom <= H + 1) { ok = 'kesilgan'; break; } a = a.parentElement; }
    if (!ok && docScroll()) ok = 'hujjat';
    if (!ok) res.push({tag: el.tagName, cls: String(el.className||'').slice(0,30), past: Math.round(r.bottom), matn: (el.textContent||'').trim().slice(0,40), zanjir: zanjir.slice(0,6)});
  }
  const sc = document.querySelector('.stage-content');
  return {ekran: (document.body.innerText.match(/(\d\d) \/ (\d\d)/)||[])[0], yomon: res.slice(0,3), n: res.length, sc: sc && {sh: sc.scrollHeight, ch: sc.clientHeight, b: Math.round(sc.getBoundingClientRect().bottom)}};
};
const bosildi = new Set();
for (let q = 0; q < QADAM; q++) {
  const m = await pg.evaluate(OLCH);
  if (m.n) console.log('QADAM', q, JSON.stringify(m));
  else console.log('qadam', q, m.ekran, 'toza', JSON.stringify(m.sc));
  // harakat: avval «Davom etish»/«Keyingi» faol bo'lsa — uni; aks holda kontentdagi birinchi bosilmagan tugma
  const nav = pg.locator('.stage-nav button:not([disabled])').last();
  let qildi = false;
  if (await nav.count()) { const t = (await nav.innerText()).trim(); const key = 'nav' + m.ekran; if (!bosildi.has(key) || q % 3 === 2) { bosildi.add(key); await nav.click({ timeout: 3000 }).then(() => qildi = true).catch(() => {}); } }
  if (!qildi) {
    const cands = pg.locator('.stage-content button:not([disabled]), .stage-content [role=radio], .stage-content label');
    const n = await cands.count();
    for (let k = 0; k < n; k++) { const c = cands.nth(k); const key = m.ekran + ':' + k; if (bosildi.has(key)) continue; bosildi.add(key); if (await c.isVisible()) { await c.click({ timeout: 3000 }).catch(() => {}); qildi = true; break; } }
  }
  await pg.waitForTimeout(800);
}
await b.close();
