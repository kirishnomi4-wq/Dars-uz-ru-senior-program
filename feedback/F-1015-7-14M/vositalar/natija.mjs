import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import fs from 'fs';
const [,, OUT, LIST] = process.argv;
const keys = fs.readFileSync(LIST, 'utf8').trim().split('\n').map(l => l.split(' '));
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const res = [];
async function one([KEY, COMP]) {
  let ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); let p = await ctx.newPage();
  await p.addInitScript(() => localStorage.setItem('cc_lang', 'uz'));
  await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 });
  await p.waitForTimeout(1200);
  const info = await p.evaluate(() => { const k = Object.keys(localStorage).find(x => x.startsWith('ccProgress:')); let t = 0; try { t = JSON.parse(localStorage.getItem(k)).total; } catch {} return { lid: k && k.slice(11), tot: t }; });
  await ctx.close();
  for (const d of [3, 4, 2, 5]) {
    const s = info.tot - d;
    ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); p = await ctx.newPage();
    await p.addInitScript(([lid, sc, tt]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: sc, answers: {}, earned: [], total: tt, savedAt: Date.now() })); }, [info.lid, s, info.tot]);
    await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 });
    const kir = p.getByText(/Kodsiz/); if (await kir.count()) { await kir.first().click({ timeout: 2000 }).catch(() => {}); }
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => {
      const rw = document.querySelector('.ring-wrap'); if (!rw) return null;
      const cs = getComputedStyle(rw);
      const card = rw.closest('.pod-card');
      const h = document.querySelector('h1,h2');
      const nish = !!(card && /NISHON|Nishon/i.test(card.innerText));
      const izoh = [...document.querySelectorAll('div,p')].find(e => /mustaqil rejim|shaxsiy natijangiz|Jonli darsda/.test(e.innerText) && e.children.length < 4);
      return { title: h ? h.innerText.trim() : '', halo: cs.boxShadow !== 'none', card: !!card, nish, izoh: izoh ? izoh.innerText.trim().slice(0, 60) : '' };
    });
    if (r) { await p.screenshot({ path: `${OUT}/${KEY}.jpg`, type: 'jpeg', quality: 60 }); await ctx.close(); return { KEY, COMP, s, tot: info.tot, ...r }; }
    await ctx.close();
  }
  return { KEY, COMP, topilmadi: true };
}
const q = keys.slice(); const W = 4;
await Promise.all(Array.from({ length: W }, async () => { while (q.length) { const k = q.shift(); try { const r = await one(k); res.push(r); console.log(JSON.stringify(r)); } catch (e) { console.log(JSON.stringify({ KEY: k[0], xato: e.message.slice(0, 80) })); } } }));
fs.writeFileSync(`${OUT}/natija.json`, JSON.stringify(res, null, 1));
await b.close();
