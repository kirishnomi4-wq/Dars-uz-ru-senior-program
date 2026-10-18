// F-1015-124 prototip: kesiksiz telefon ramkasini m7-08 (dm-tel) uslubiga — 7px chekka, 30px burchak, ekran ichida pill-kesik (56×16) va
// ekran tepasida 22px joy. Kodga TEGMAYDI — sahifaga vaqtincha. node telproto.mjs <outdir> "<kalit>:<lid>:<jami>:<ekran>,..."
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [,, OUT, LIST] = process.argv;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const PROTO = () => {
  const lum = (c) => { const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/.exec(c); return m ? (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) / 255 : 1; };
  let n = 0;
  for (const e of document.querySelectorAll('.stage-content *')) {
    const r = e.getBoundingClientRect(); if (r.width < 110 || r.width > 340) continue; const k = r.height / r.width; if (k < 1.55 || k > 2.4) continue;
    const cs = getComputedStyle(e); if (parseFloat(cs.borderTopLeftRadius) < 16 || lum(cs.backgroundColor) > 0.25) continue;
    if (e.parentElement.closest('[data-tp]')) continue; e.setAttribute('data-tp', '1');
    const ekr = [...e.children].sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0]; if (!ekr) continue;
    e.style.padding = '7px'; e.style.borderRadius = '30px';
    ekr.style.borderRadius = '24px'; ekr.style.position = 'relative'; ekr.style.paddingTop = (parseFloat(getComputedStyle(ekr).paddingTop) + 22) + 'px';
    const pill = document.createElement('span'); pill.style.cssText = 'position:absolute;top:7px;left:50%;transform:translateX(-50%);width:56px;height:16px;border-radius:10px;background:' + cs.backgroundColor + ';z-index:2';
    ekr.prepend(pill); n++;
  }
  return n;
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
  console.log(KEY, S, n); await ctx.close();
}
await b.close();
