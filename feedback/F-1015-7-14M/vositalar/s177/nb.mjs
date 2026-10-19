// Ichki chegara skaneri (F-1015-333): natija ichida chegarali element → chegarali ota-bobosi bor bo'lsa, ro'yxatga
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const { KEY, LID } = process.env; const N = +process.env.N; const sc = +process.env.EKRAN; const ANS = JSON.parse(process.env.ANSWERS || '{}');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
await p.addInitScript(([sc, LID, N, ANS]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem(`ccProgress:${LID}`, JSON.stringify({ screen: sc, answers: ANS, earned: [], total: N, savedAt: Date.now() })); }, [sc, LID, N, ANS]);
await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 15000 }).catch(() => {});
const kir = p.locator('[data-live=self]'); if (await kir.count()) await kir.first().click({ timeout: 1500 }).catch(() => {});
await p.waitForTimeout(2500);
const out = await p.evaluate(() => {
  const root = document.querySelector('.screen') || document.body;
  const bordered = (el) => { const s = getComputedStyle(el); const w = parseFloat(s.borderTopWidth) || parseFloat(s.borderLeftWidth) || 0; return w > 0 && s.borderTopStyle !== 'none' && !/rgba\(\d+, \d+, \d+, 0\)|transparent/.test(s.borderTopColor) && s.display !== 'none'; };
  const cls = (el) => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '');
  const res = {};
  root.querySelectorAll('*').forEach(el => {
    if (!bordered(el)) return; if (/^(BUTTON|INPUT|SELECT|TEXTAREA|SVG|PATH|I|HR)$/.test(el.tagName)) return;
    const r = el.getBoundingClientRect(); if (r.width < 24 || r.height < 14) return;
    let a = el.parentElement, chain = []; while (a && a !== root) { if (bordered(a)) chain.push(cls(a)); a = a.parentElement; }
    if (!chain.length) return;
    const k = cls(el) + '  ←  ' + chain.join(' ← '); res[k] = (res[k] || 0) + 1;
  });
  return res;
});
console.log(JSON.stringify(out)); await b.close();
