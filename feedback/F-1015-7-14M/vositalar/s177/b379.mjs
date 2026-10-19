// F-1015-379: 14-M (va boshqa) ekran sifati o'lchovi — 390px toshish, chegarali/fonli qutilar soni, bosqich-ko'rsatkichlar (hamma turi)
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
const S = '/tmp/claude-1000/-home-kali-Desktop-internetLesson/748450ec-6330-484f-82b4-09062baf27c7/scratchpad/';
const rows = JSON.parse(readFileSync(S + 'b366-royxat.json', 'utf8'));
const only = process.env.KEYS ? process.env.KEYS.split(',') : null;
const W = +(process.env.W || 390);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const out = [];
for (const r of rows) { if (only && !only.includes(r.key)) continue; for (const sc of r.ekran) {
  const ctx = await b.newContext({ viewport: { width: W, height: W < 500 ? 844 : 860 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.addInitScript(([sc, lid, n]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem(`ccProgress:${lid}`, JSON.stringify({ screen: sc, answers: { 0: { stage: 'hook', picked: 'a' } }, earned: [], total: n, savedAt: Date.now() })); }, [sc, r.lid, r.n]);
  await p.goto(`http://localhost:5300/#/lesson/${r.key}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
  await p.locator('[data-live=self]').first().click({ timeout: 4000 }).catch(() => {});
  await p.waitForTimeout(1300);
  const chip = p.locator('.q-bashorat .q-chip:not([disabled])').first(); if (await chip.count()) { await chip.click().catch(() => {}); await p.waitForTimeout(1200); }
  const res = await p.evaluate((W) => {
    const m = document.body.innerText.match(/(\d{2}) \/ (\d{2})/); const korindi = m ? +m[1] - 1 : -1;
    const scr = document.querySelector('.screen'); if (!scr) return { korindi };
    const vis = (el) => { const s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity < 0.05) return false; const q = el.getBoundingClientRect(); return q.width > 1 && q.height > 1; };
    const visDeep = (el) => { let a = el; while (a && a !== document.body) { if (!vis(a)) return false; a = a.parentElement; } return true; };
    let toshish = []; let quti = 0;
    scr.querySelectorAll('*').forEach(el => {
      if (!visDeep(el)) return; const q = el.getBoundingClientRect(); const s = getComputedStyle(el);
      if (q.right > W + 2 && q.width < W * 3 && !el.closest('.zoomable [data-zoom-asosiy], pre, code, .q-kod')) { const sc2 = el.closest('[style*="overflow"], .ls-oyna'); toshish.push((el.className || el.tagName).toString().slice(0, 40)); }
      const bw = parseFloat(s.borderTopWidth) > 0 && !/rgba\(\d+, \d+, \d+, 0\)|transparent/.test(s.borderTopColor);
      const bg = s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent';
      if ((bw || bg) && q.width > 60 && q.height > 26 && !/^(BUTTON|INPUT|TEXTAREA|SELECT|IMG|SVG|I|CODE)$/i.test(el.tagName) && !el.closest('button')) quti++;
    });
    // bosqich ko'rsatkichlari: n/N matn, raqamli chip qatori (≥3 qardosh tugma/span «1 …»), nuqtalar qatori (≥3 kichik doira), qolip stepper
    const kor = new Set();
    const w = document.createTreeWalker(scr, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const el = n.parentElement; if (!el || !visDeep(el)) continue; for (const mm of n.textContent.matchAll(/(?<![\d/])(\d)\s*\/\s*(\d)(?![\d/])/g)) { if (+mm[2] >= 2 && +mm[2] <= 8 && +mm[1] <= +mm[2]) kor.add('nN:' + (el.className || el.tagName).toString().slice(0, 24)); } }
    scr.querySelectorAll('*').forEach(par => {
      if (!visDeep(par)) return; const ch = [...par.children].filter(visDeep); if (ch.length < 3 || ch.length > 8) return;
      const raq = ch.filter(c => /^\s*(\d|✓)\s*\S/.test(c.textContent || '') && (c.textContent || '').length < 40 && c.getBoundingClientRect().height < 56);
      if (raq.length >= 3 && raq.length === ch.length) kor.add('stepper:' + (par.className || par.tagName).toString().slice(0, 24));
      const dots = ch.filter(c => { const q = c.getBoundingClientRect(); return q.width <= 14 && q.height <= 14 && !c.textContent.trim(); });
      if (dots.length >= 3 && dots.length === ch.length && !par.closest('.q-tel, [class*="tel"], [class*="doira"]')) kor.add('nuqta:' + (par.className || par.tagName).toString().slice(0, 24));
    });
    const nav = document.querySelector('.stage-nav'); if (nav && /\(\d+\s*\/\s*\d+\)/.test(nav.innerText)) kor.add('footer');
    return { korindi, toshish: [...new Set(toshish)].slice(0, 4), toshishN: toshish.length, quti, kor: [...kor] };
  }, W);
  const row = { key: r.key, s: sc, ...res }; out.push(row);
  console.log(JSON.stringify({ k: r.key, s: sc, t: res.toshishN, q: res.quti, kor: (res.kor || []).length, ok: res.korindi === sc }));
  await ctx.close();
} }
writeFileSync(S + (process.env.OUTF || 'b379-natija.json'), JSON.stringify(out)); await b.close(); console.log('TAYYOR');
