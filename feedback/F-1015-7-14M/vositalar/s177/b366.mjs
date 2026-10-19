// F-1015-366: bitta ekranda nechta bosqich-ko'rsatkich (karta/yorliq «n/N», qolip stepperi, pastki tugma «(n/N)»)
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
const S = '/tmp/claude-1000/-home-kali-Desktop-internetLesson/748450ec-6330-484f-82b4-09062baf27c7/scratchpad/';
const rows = JSON.parse(readFileSync(S + 'b366-royxat.json', 'utf8'));
const only = process.env.KEYS ? process.env.KEYS.split(',') : null;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const out = [];
for (const r of rows) { if (only && !only.includes(r.key)) continue; for (const sc of r.ekran) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 860 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.addInitScript(([sc, lid, n]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem(`ccProgress:${lid}`, JSON.stringify({ screen: sc, answers: { 0: { stage: 'hook', picked: 'a' } }, earned: [], total: n, savedAt: Date.now() })); }, [sc, r.lid, r.n]);
  await p.goto(`http://localhost:5300/#/lesson/${r.key}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
  await p.locator('[data-live=self]').first().click({ timeout: 4000 }).catch(() => {});
  await p.waitForTimeout(1300);
  const res = await p.evaluate(() => {
    const m = document.body.innerText.match(/(\d{2}) \/ (\d{2})/); const korindi = m ? +m[1] - 1 : -1;
    const vis = (el) => { let a = el; while (a && a !== document.body) { const s = getComputedStyle(a); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.05) return false; a = a.parentElement; } const q = el.getBoundingClientRect(); return q.width > 0 && q.height > 0; };
    const nav = document.querySelector('.stage-nav'); const navT = nav ? nav.innerText : '';
    const footer = /\(\d+\s*\/\s*\d+\)/.test(navT);
    const scr = document.querySelector('.screen'); const tanalar = new Set();
    if (scr) { const w = document.createTreeWalker(scr, NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) { const el = n.parentElement; if (!el || !vis(el)) continue;
        for (const mm of n.textContent.matchAll(/(?<![\d/])(\d)\s*\/\s*(\d)(?![\d/])/g)) { const a = +mm[1], bb = +mm[2]; if (bb >= 2 && bb <= 6 && a <= bb) tanalar.add((el.className || el.tagName).toString().slice(0, 30) + '«' + mm[0] + '»'); } } }
    const stepper = [...document.querySelectorAll('.screen .q-qadamlar')].some(vis);
    return { korindi, footer, stepper, tana: [...tanalar], jami: tanalar.size + (stepper ? 1 : 0) + (footer ? 1 : 0) };
  });
  const row = { key: r.key, s: sc, ...res }; if (res.korindi !== sc) row.holat = 'TIKLANMADI'; else row.holat = res.jami >= 2 ? 'TAKROR' : 'toza';
  out.push(row); if (row.holat !== 'toza') console.log(JSON.stringify(row));
  await ctx.close();
} }
writeFileSync(S + (process.env.OUTF || 'b366-natija.json'), JSON.stringify(out));
const c = {}; out.forEach(o => { c[o.holat] = (c[o.holat] || 0) + 1; }); console.log('XULOSA', JSON.stringify(c));
await b.close();
