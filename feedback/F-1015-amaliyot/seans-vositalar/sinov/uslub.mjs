import { chromium } from 'playwright-core';
const page = process.argv[2];
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const u of ['minimal', 'yorqin', 'qorongi', 'gradient']) for (const scr of [3, 4]) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } });
  await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([u, s]) => { localStorage.clear(); localStorage.setItem('liveSession:css-practice-portfolio-v3', '{"mode":"self"}'); localStorage.setItem('ccDemoDay', JSON.stringify({ uslub: u })); localStorage.setItem('ccProgress:css-practice-portfolio-v3', JSON.stringify({ screen: s, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() })); }, [u, scr]);
  const p = await ctx.newPage(); await p.goto('file://' + page); await p.waitForSelector('.ds'); await p.waitForTimeout(600);
  const res = await p.evaluate(() => {
    const L = (c) => { const m = c.match(/[\d.]+/g).map(Number); const [r, g, bb] = m.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return { l: 0.2126 * r + 0.7152 * g + 0.0722 * bb, a: m.length > 3 ? m[3] : 1 }; };
    const bgOf = (el) => { let e = el; while (e) { const cs = getComputedStyle(e); const c = cs.backgroundColor; const img = cs.backgroundImage; if (img && img.includes('gradient')) return getComputedStyle(e).getPropertyValue('--probe') || (e.closest('.ds-yorqin') ? 'rgb(253,230,138)' : e.closest('.ds-qorongi') ? 'rgb(19,78,74)' : e.closest('.ds-minimal') ? 'rgb(255,241,236)' : 'rgb(237,233,254)'); if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c) && L(c).a > 0.5) return c; e = e.parentElement; } return 'rgb(255,255,255)'; };
    return [...document.querySelectorAll('.ds .ds-logo, .ds .ds-nav, .ds .ds-cta, .ds .ds-tag, .ds .ds-h1, .ds .ds-p, .ds .ds-tugma, .ds .ds-tugma2, .ds .ds-h2, .ds .ds-ft, .ds .ds-ill-h, .ds .ds-row-t, .ds .ds-row-v')].map(el => { const f = L(getComputedStyle(el).color).l, g = L(bgOf(el)).l; return { s: el.className, k: Math.round(((Math.max(f, g) + .05) / (Math.min(f, g) + .05)) * 100) / 100 }; }).filter(x => x.k < 4.5);
  });
  console.log(u, scr === 3 ? 'uslub' : 'rang', res.length ? '❌ ' + JSON.stringify(res) : '✅');
  await ctx.close();
}
await b.close();
