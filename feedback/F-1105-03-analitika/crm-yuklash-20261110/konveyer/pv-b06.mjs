import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { readFileSync } from 'node:fs';
const url = readFileSync(process.argv[2], 'utf8').trim();
const lessonId = process.argv[3];
const ekranlar = process.argv[4] ? process.argv[4].split(',').map(Number) : [0, 7, 8];
const out = process.argv[5];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const OLCH = () => {
  const H = window.innerHeight, res = [];
  const docScroll = () => { const de = document.scrollingElement || document.documentElement; const oh = e => getComputedStyle(e).overflowY; return de.scrollHeight > H + 1 && !/hidden|clip/.test(oh(document.documentElement)) && !/hidden|clip/.test(oh(document.body)); };
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1 || r.bottom <= H + 1) continue;
    if ([...el.children].some(c => c.getBoundingClientRect().bottom > H + 1)) continue;
    let a = el.parentElement, ok = null;
    while (a && a !== document.body) { const s = getComputedStyle(a); if (/auto|scroll/.test(s.overflowY) && a.scrollHeight > a.clientHeight + 1) { ok = 'skroll'; break; } if (/hidden|clip/.test(s.overflowY) && a.getBoundingClientRect().bottom <= H + 1) { ok = 'kesilgan'; break; } a = a.parentElement; }
    if (!ok && docScroll()) ok = 'hujjat';
    res.push({tag: el.tagName, cls: String(el.className||'').slice(0,40), past: Math.round(r.bottom), ok, matn: (el.textContent||'').trim().slice(0,40)});
  }
  return {H, lz: getComputedStyle(document.documentElement).getPropertyValue('--lz'), n: res.length, yomon: res.filter(x => !x.ok).slice(0,5), hammasi: res.slice(0,4)};
};
for (const i of ekranlar) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(([k, i]) => { try { localStorage.setItem(k, JSON.stringify({screen: i, answers: {}, earned: [], startedAt: Date.now(), total: 20, savedAt: Date.now()})); } catch (e) {} }, ['ccProgress:' + lessonId, i]);
  const pg = await ctx.newPage();
  await pg.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await pg.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => console.log('goto', e.message));
  await pg.waitForTimeout(2500);
  const frames = pg.frames();
  for (const f of frames) { try { const m = await f.evaluate(OLCH); console.log('ekran', i, 'frame', f.url().slice(0, 60), JSON.stringify(m)); } catch (e) { console.log('frame xato', e.message.slice(0, 80)); } }
  if (out) await pg.screenshot({ path: out.replace('.png', '-' + i + '.png') });
  await ctx.close();
}
await b.close();
