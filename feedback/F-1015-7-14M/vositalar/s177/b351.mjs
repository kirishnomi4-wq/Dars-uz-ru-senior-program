// F-1015-351 skaneri: tushuncha-ekran taxminsiz ochiladi — bashorat kartasi bor va javobsiz bo'lsa, undan tashqaridagi sahna ko'rinadimi? (213.7)
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
const S = '/tmp/claude-1000/-home-kali-Desktop-internetLesson/748450ec-6330-484f-82b4-09062baf27c7/scratchpad/';
const rows = JSON.parse(readFileSync(S + (process.env.ROY || 'b351-royxat.json'), 'utf8'));
const only = process.env.KEYS ? process.env.KEYS.split(',') : null;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const out = [];
for (const r of rows) {
  if (only && !only.includes(r.key)) continue;
  for (const sc of r.ekran) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
    const err = []; p.on('pageerror', e => err.push(e.message));
    await p.addInitScript(([sc, lid, n]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem(`ccProgress:${lid}`, JSON.stringify({ screen: sc, answers: { 0: { stage: 'hook', screenIdx: 0, picked: 'a', correct: false } }, earned: [], total: n, savedAt: Date.now() })); }, [sc, r.lid, r.n]);
    await p.goto(`http://localhost:5300/#/lesson/${r.key}`, { waitUntil: 'domcontentloaded' });
    await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
    const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
    await p.waitForTimeout(1600);
    const korindi = await p.evaluate(() => { const m = document.body.innerText.match(/(\d{2}) \/ (\d{2})/); return m ? +m[1] - 1 : -1; });
    const res = await p.evaluate(() => {
      const vis = (el) => { const s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.05) return false; const q = el.getBoundingClientRect(); return q.width > 2 && q.height > 2; };
      const visDeep = (el) => { let a = el; while (a && a !== document.body) { if (!vis(a)) return false; a = a.parentElement; } return true; };
      const scr = document.querySelector('.q-tushuncha') || document.querySelector('.screen');
      if (!scr) return { holat: 'ekran-yoq' };
      const bash = [...scr.querySelectorAll('.q-bashorat')].find(visDeep);
      if (!bash) return { holat: 'bashorat-yoq' };
      if (bash.querySelector('.q-chip.on') || [...bash.querySelectorAll('.q-chip')].every(c => c.disabled)) return { holat: 'javobli' };
      let maxA = 0, sel = '';
      scr.querySelectorAll('*').forEach(el => {
        if (bash.contains(el) || el.contains(bash)) return;
        if (el.closest('.q-bosh, .mentor, .q-sarlavha, h1, h2, .q-izoh')) return;
        if (!/^(DIV|SPAN|BUTTON|SVG|IMG|TABLE|CANVAS|P|UL|OL|SECTION|svg)$/i.test(el.tagName)) return;
        if (!visDeep(el)) return;
        const cs = getComputedStyle(el);
        const ozi = /^(IMG|SVG|CANVAS|svg)$/i.test(el.tagName) || [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) || (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || parseFloat(cs.borderTopWidth) > 0;
        if (!ozi) return;
        const q = el.getBoundingClientRect(); const a = q.width * q.height;
        if (q.top > window.innerHeight + 600) return;
        if (a > maxA) { maxA = a; sel = el.tagName.toLowerCase() + '.' + (typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 3).join('.') : ''); }
      });
      return { holat: maxA > 6000 ? 'OCHIQ' : 'toza', maxA: Math.round(maxA), sel };
    });
    const row = { key: r.key, s: sc, korindi, ...res, err: err.slice(0, 1) }; if (korindi !== sc) row.holat = 'TIKLANMADI';
    out.push(row); console.log(JSON.stringify(row));
    await ctx.close();
  }
}
writeFileSync(S + (process.env.OUTF || 'b351-natija.json'), JSON.stringify(out));
await b.close(); console.log('TAYYOR');
