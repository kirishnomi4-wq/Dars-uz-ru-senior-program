// F-1015-160: o'chiq tugmali ekranlarni qayta ochib — har tugmaning klassi, ota-klasslari (maket ichidami), surati (qizil ramka)
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import fs from 'fs';
const [,, IN, OUT, DIR] = process.argv;
fs.mkdirSync(DIR, { recursive: true });
const rows = fs.readFileSync(IN, 'utf8').trim().split('\n').map(l => JSON.parse(l)).filter(x => x.dis && x.dis.length);
const lids = {};
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const out = fs.createWriteStream(OUT);
async function lid(KEY) {
  if (lids[KEY]) return lids[KEY];
  const ctx = await b.newContext(); const p = await ctx.newPage();
  await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  const r = await p.evaluate(() => Object.keys(localStorage).find(x => x.startsWith('ccProgress:')).slice(11)); await ctx.close(); return (lids[KEY] = r);
}
const q = rows.slice();
await Promise.all(Array.from({ length: 5 }, async () => { while (q.length) {
  const x = q.shift(); const L = await lid(x.k);
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.addInitScript(([lid, sc, tt]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: sc, answers: {}, earned: [], total: tt, savedAt: Date.now() })); }, [L, x.s, x.tot]);
  try {
    await p.goto(`http://localhost:5300/#/lesson/${x.k}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
    const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
    await p.waitForTimeout(1300);
    const d = await p.evaluate(() => {
      const root = document.querySelector('.stage-content') || document.querySelector('.lesson-root');
      const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 4 && r.height > 4 && cs.visibility !== 'hidden' && +cs.opacity > 0.05; };
      const navEl = [...document.querySelectorAll('nav, .nav, .stage-nav, footer, [class*="nav-bar"], [class*="stage-foot"]')];
      const inNav = (e) => navEl.some(n => n.contains(e)) || e.getBoundingClientRect().top > innerHeight - 100;
      const els = [...root.querySelectorAll('button:disabled, [aria-disabled="true"]')].filter(e => vis(e) && !inNav(e) && !e.closest('.mentor, .q-arena, .arena, [class*="mstats"], [class*="mentor-"]') && (e.innerText || '').trim());
      return els.map(e => {
        const anc = []; let n = e.parentElement; for (let i = 0; n && i < 8; i++, n = n.parentElement) if (n.className && typeof n.className === 'string') anc.push(n.className.split(' ')[0]);
        const maket = !!e.closest('[class*="tel"], [class*="phone"], [class*="maket"], [class*="mock"], [class*="ekran-"], [class*="brw"], [class*="browser"], [class*="app-"], [class*="ilova"]');
        const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
        e.style.outline = '3px solid red'; e.style.outlineOffset = '2px';
        return { t: (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 50), cls: e.className, anc: anc.join(' < '), maket, op: cs.opacity, cur: cs.cursor, r: [Math.round(r.left), Math.round(r.top)] };
      });
    });
    const f = `${DIR}/${x.k}-s${x.s}.jpg`; await p.screenshot({ path: f, type: 'jpeg', quality: 60 });
    out.write(JSON.stringify({ k: x.k, s: x.s, eb: x.eb, d }) + '\n');
  } catch (e) { out.write(JSON.stringify({ k: x.k, s: x.s, xato: String(e.message).slice(0, 80) }) + '\n'); } finally { await ctx.close(); }
} }));
out.end(); await b.close();
