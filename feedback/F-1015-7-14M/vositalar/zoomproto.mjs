// F-1015-125/126/127: ⛶ joylashuvi prototipi — kodga TEGMAYDI, sahifaga vaqtincha qo'llab suratga oladi (oldin + keyin).
// node zoomproto.mjs <outdir> "<kalit>:<lid>:<jami>:<ekran>,..."
// Prototip: ⛶ qatori (206, padding-top 36) olinadi; ⛶ asosiy vizual (eng tashqi chizilgan elementlar birlashmasi) burchagiga:
// o'ng tomonda ≥ 44px joy bo'lsa — tashqarida, tepa chizig'ida; bo'lmasa — burchak ichida (8px).
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [,, OUT, LIST] = process.argv;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const PROTO = () => {
  const vis = (e) => { const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05; };
  const painted = (e) => { if (/^(IMG|CANVAS|VIDEO|svg)$/.test(e.tagName)) return true; const cs = getComputedStyle(e);
    return !/rgba\([^)]*,\s*0\)|transparent/.test(cs.backgroundColor) || parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0 || (cs.boxShadow && cs.boxShadow !== 'none') || [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); };
  const st = document.createElement('style');
  st.textContent = '.zoomable:not(.z-empty):not(.zoom-on) { padding-top: 0 !important; } .zoomable.z-float > .zoom-btn { visibility: visible !important; }';
  document.head.appendChild(st);
  const natija = [];
  for (const z of document.querySelectorAll('.stage-content .zoomable:not(.z-empty):not(.zoom-on)')) {
    const btn = z.querySelector(':scope > .zoom-btn'); if (!btn || !vis(z)) continue;
    const zr = z.getBoundingClientRect();
    const tashqi = [...z.querySelectorAll('*')].filter(e => !e.closest('.zoom-btn') && vis(e) && painted(e) && !(e.closest('svg') && e.tagName !== 'svg'))
      .filter((e, _, arr) => !arr.some(o => o !== e && o.contains(e)));
    if (!tashqi.length) continue;
    // asosiy vizual: eng katta chizilgan element + maydoni undan ≥ 50% bo'lganlar (ikki telefon kabi); tooltip/tugma kabi kichiklar hisobga kirmaydi
    const yuza = (e) => { const r = e.getBoundingClientRect(); return r.width * r.height; };
    const maks = Math.max(...tashqi.map(yuza)); const asosiy = tashqi.filter(e => yuza(e) >= maks * 0.5);
    let L = 1e9, T = 1e9, R = -1e9; for (const e of asosiy) { const r = e.getBoundingClientRect(); L = Math.min(L, r.left); T = Math.min(T, r.top); R = Math.max(R, r.right); }
    const joy = zr.right - R >= 44;
    btn.style.top = (T - zr.top + (joy ? 0 : 8)) + 'px';
    btn.style.right = 'auto';
    btn.style.left = (joy ? R - zr.left + 8 : R - zr.left - 38) + 'px';
    natija.push(joy ? 'tashqarida' : 'ichida');
  }
  return natija;
};
for (const it of LIST.split(',')) {
  const [KEY, LID, TOT, S] = it.split(':');
  const ctx = await b.newContext({ viewport: { width: 1280, height: 790 }, deviceScaleFactor: 1, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.addInitScript(([lid, sc, tt]) => { try { localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: +sc, answers: {}, earned: [], total: +tt, savedAt: Date.now() })); } catch {} }, [LID, S, TOT]);
  await p.goto(`http://localhost:5300/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root', { timeout: 20000 });
  const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 2000 }).catch(() => {});
  await p.waitForTimeout(2200);
  await p.screenshot({ path: `${OUT}/${KEY}-s${S}-oldin.jpg`, type: 'jpeg', quality: 72 });
  const n = await p.evaluate(PROTO); await p.waitForTimeout(300);
  await p.screenshot({ path: `${OUT}/${KEY}-s${S}-keyin.jpg`, type: 'jpeg', quality: 72 });
  console.log(KEY, S, n.join(' ')); await ctx.close();
}
await b.close();
