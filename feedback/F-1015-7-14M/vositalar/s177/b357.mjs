// F-1015-357: hikoya ekranida bir xil «n/m» hisoblagich ikki marta (nav tugmasidan tashqari) — har kadrda
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { readFileSync } from 'node:fs';
const S = '/tmp/claude-1000/-home-kali-Desktop-internetLesson/748450ec-6330-484f-82b4-09062baf27c7/scratchpad/';
const rows = JSON.parse(readFileSync(S + 'b357-royxat.json', 'utf8'));
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const r of rows) for (const sc of r.ekran) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.addInitScript(([sc, lid, n]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem(`ccProgress:${lid}`, JSON.stringify({ screen: sc, answers: { 0: { stage: 'hook', picked: 'a' } }, earned: [], total: n, savedAt: Date.now() })); }, [sc, r.lid, r.n]);
  await p.goto(`http://localhost:5300/#/lesson/${r.key}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
  const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
  await p.waitForTimeout(1500);
  const korindi = await p.evaluate(() => { const m = document.body.innerText.match(/(\d{2}) \/ (\d{2})/); return m ? +m[1] - 1 : -1; });
  const res = await p.evaluate(() => {
    const scr = document.querySelector('.screen'); if (!scr) return null;
    const out = {};
    const walk = document.createTreeWalker(scr, NodeFilter.SHOW_TEXT);
    let n; while ((n = walk.nextNode())) {
      const el = n.parentElement; if (!el || el.closest('nav, .nav, .lp-nav, footer, .stage-nav')) continue;
      const st = getComputedStyle(el); if (st.display === 'none' || st.visibility === 'hidden') continue;
      for (const m of n.textContent.matchAll(/(?<!\d)(\d)\s*\/\s*(\d)(?!\d)/g)) { const k = m[1] + '/' + m[2]; (out[k] = out[k] || []).push((el.className || el.tagName).toString().slice(0, 40)); }
    }
    return out;
  });
  const dup = res ? Object.entries(res).filter(([k, v]) => v.length > 1) : [];
  console.log(r.key, sc, korindi === sc ? '' : 'TIKLANMADI(' + korindi + ')', dup.length ? 'TAKROR ' + JSON.stringify(dup) : (res ? 'toza ' + Object.keys(res).join(',') : 'ekran-yoq'));
  await ctx.close();
}
await b.close();
