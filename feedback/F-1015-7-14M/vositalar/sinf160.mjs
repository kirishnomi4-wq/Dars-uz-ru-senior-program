// F-1015-159/160 sinf o'lchovi: har darsning har ekrani (boshlang'ich holat)
//  160 — dars maydonidagi ko'rinadigan, lekin bosib bo'lmaydigan (disabled) tugmalar (pastki nav tashqari)
//  159 — yonma-yon ikki ustunning birinchi «karta»si tepasi farqi > 16px (bir ustunda tepada yorliq bor)
// Ishlatish: node sinf160.mjs out.jsonl kalitlar.txt [W=4]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import fs from 'fs';
const [,, OUT, LIST, W = '4', FILTR] = process.argv;
const faqat = FILTR ? new Set(fs.readFileSync(FILTR, 'utf8').trim().split('\n')) : null; // «kalit s» juftlari — faqat shu ekranlar
let keys = fs.readFileSync(LIST, 'utf8').trim().split('\n').map(l => l.split(' ')[0]);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const out = fs.createWriteStream(OUT);
async function info(KEY) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 } }); const p = await ctx.newPage();
  await p.addInitScript(() => localStorage.setItem('cc_lang', 'uz'));
  await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 }); await p.waitForTimeout(1000);
  const r = await p.evaluate(() => { const k = Object.keys(localStorage).find(x => x.startsWith('ccProgress:')); let t = 0; try { t = JSON.parse(localStorage.getItem(k)).total; } catch {} return { lid: k && k.slice(11), tot: t }; });
  await ctx.close(); return r;
}
async function ekran(KEY, lid, s, tot) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.addInitScript(([lid, sc, tt]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: sc, answers: {}, earned: [], total: tt, savedAt: Date.now() })); }, [lid, s, tot]);
  try {
    await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 });
    const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
    await p.waitForTimeout(1300);
    return await p.evaluate(() => {
      const root = document.querySelector('.stage-content') || document.querySelector('.lesson-root');
      const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 4 && r.height > 4 && cs.visibility !== 'hidden' && +cs.opacity > 0.05; };
      const navEl = [...document.querySelectorAll('nav, .nav, .stage-nav, footer, [class*="nav-bar"], [class*="stage-foot"]')];
      const inNav = (e) => navEl.some(n => n.contains(e)) || e.getBoundingClientRect().top > innerHeight - 100;
      const dis = [...root.querySelectorAll('button:disabled, [aria-disabled="true"]')].filter(e => vis(e) && !inNav(e) && !e.closest('.mentor, .q-arena, .arena, [class*="mstats"], [class*="mentor-"]'))
        .map(e => (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 60)).filter(t => t);
      // 159: yonma-yon ustunlar
      const boxed = (e) => { const cs = getComputedStyle(e); return (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || cs.boxShadow !== 'none' || parseFloat(cs.borderTopWidth) > 0; };
      const firstBox = (col) => { const w = document.createTreeWalker(col, NodeFilter.SHOW_ELEMENT); let n = col; while (n) { if (n !== col && vis(n) && boxed(n) && n.getBoundingClientRect().height > 60) return n; n = w.nextNode(); } return null; };
      const siljish = [];
      for (const c of root.querySelectorAll('*')) {
        const kids = [...c.children].filter(vis); if (kids.length !== 2) continue;
        const [a, d] = kids.map(k => k.getBoundingClientRect());
        if (Math.abs(a.top - d.top) > 4 || d.left < a.right - 2 || a.width < 200 || d.width < 200) continue;
        const fa = firstBox(kids[0]), fd = firstBox(kids[1]); if (!fa || !fd) continue;
        const ta = fa.getBoundingClientRect().top, td = fd.getBoundingClientRect().top;
        const diff = Math.round(ta - td);
        if (Math.abs(diff) > 16 && Math.abs(diff) < 120) siljish.push({ diff, chap: (kids[0].innerText || '').trim().split('\n')[0].slice(0, 40), ong: (kids[1].innerText || '').trim().split('\n')[0].slice(0, 40) });
      }
      const eb = (document.querySelector('.eyebrow, [class*="eyebrow"]') || {}).innerText || '';
      return { eb: eb.trim().slice(0, 50), dis, siljish };
    });
  } catch (e) { return { xato: String(e.message).slice(0, 80) }; } finally { await ctx.close(); }
}
const q = keys.slice();
await Promise.all(Array.from({ length: +W }, async () => {
  while (q.length) {
    const KEY = q.shift(); const { lid, tot } = await info(KEY);
    for (let s = 0; s < tot; s++) { if (faqat && !faqat.has(KEY + ' ' + s)) continue; const r = await ekran(KEY, lid, s, tot); out.write(JSON.stringify({ k: KEY, s, tot, ...r }) + '\n'); }
    console.log(KEY, tot);
  }
}));
out.end(); await b.close();
