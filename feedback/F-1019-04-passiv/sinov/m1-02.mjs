// F-1019-04 · m1-02 (PmLesson1) s2 va s8 — passiv «birma-bir bosing» → qaror qadamlari (DE 213.22) sinovi.
// node feedback/F-1019-04-passiv/sinov/m1-02.mjs <suratlar/m1-02-uz papkasi (shots.mjs _p.html)>
import { chromium } from 'playwright-core';
const OUT = process.argv[2]; const ID = 'pm-m1d2-v1'; const TOTAL = 18;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = []; const log = (x) => console.log(x);
const ochish = async (screen, answers = {}, w = 1280, h = 860) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, sc, ans, n]) => { for (const r of ['mentor', 'learner', 'student', 'self']) { localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('hcOnboarded_' + r, '1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: sc, maxReached: sc, answers: ans, earned: [], startedAt: Date.now(), total: n, savedAt: Date.now() })); }, [ID, screen, answers, TOTAL]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + OUT + '/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900); return p;
};
const nav = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? b.innerText.trim() + (b.disabled ? ' (yopiq)' : ' (ochiq)') : null; });
let xatolar = 0;
const qaror = async (p, togri, xato, nom) => {
  const savol = await p.innerText('.qr-s').catch(() => "YO'Q");
  await p.locator('.qr-v button', { hasText: xato }).click(); await p.waitForTimeout(300);
  const izoh = await p.innerText('.qr .qr-xato').catch(() => "YO'Q");
  const yopiq = await p.locator('.qr-v button', { hasText: xato }).isDisabled();
  if (izoh === "YO'Q" || !yopiq) xatolar++;
  await p.locator('.qr-v button', { hasText: togri }).click(); await p.waitForTimeout(600);
  log(`  ${nom}: «${savol}» · xato «${xato}» → sabab «${izoh}» (tugma yopildi: ${yopiq}) → to'g'ri «${togri}» ✓ · nav=${await nav(p)}`);
};
// ---- s2 «Har sayt — o'z odamlari»
let p = await ochish(2);
log('s2 boshida: nav=' + await nav(p) + ' · qator: ' + (await p.$$('.qr-row')).length + ' · savol bor: ' + !!(await p.$('.qr')));
await qaror(p, "Bo'sh vaqtida qiziq video", "Faqat dars o'rganmoqchi", 'YouTube');
log('  YouTube kartasida «nega»: ' + await p.innerText('.qr-row-nega').catch(() => "YO'Q"));
await p.screenshot({ path: OUT + '/t-s2-orta.png' });
await qaror(p, 'Yaqinlari bilan yozishadiganlar', 'Saytni yasagan dasturchilar', 'Telegram');
await qaror(p, "Shaharda tez yetib bormoqchi", 'Hamma uchun', 'Yandex Go');
await p.waitForTimeout(500);
const s2nav = await nav(p);
log('s2 oxiri: nav=' + s2nav + ' · savol qoldimi: ' + !!(await p.$('.qr')) + ' · xulosa: ' + !!(await p.$('.frame-success')) + ' · saqlandi: ' + await p.evaluate((id) => !!(JSON.parse(localStorage.getItem('ccProgress:' + id) || '{}').answers || {})[2], ID));
await p.locator('.qr-row', { hasText: 'Telegram' }).click(); await p.waitForTimeout(400);
log('  tugagach Telegram bosildi → oldindan ko\'rish: ' + await p.innerText('.bp-url, .preview-url, [class*=url]').catch(() => '?'));
await p.screenshot({ path: OUT + '/t-s2-tugadi.png' });
p = await ochish(2, { 2: { correct: true, picked: true } });
log('s2 qaytish (saqlangan): nav=' + await nav(p) + ' · savol: ' + !!(await p.$('.qr')) + ' · xulosa: ' + !!(await p.$('.frame-success')));
// ---- s8 «Har xil odam — har xil ehtiyoj»
p = await ochish(8);
log('s8 boshida: nav=' + await nav(p) + ' · joriy odam: ' + await p.innerText('.qr-row.on').catch(() => "YO'Q"));
await qaror(p, 'Oldindan buyurtma berish', 'Menyu va narxlar', "O'quvchi");
log('  saytda belgilangan qator: ' + await p.innerText('.eye-row.hot').catch(() => "YO'Q") + ' · yorliq: ' + await p.innerText('.qr-split .col:last-child .flow-label'));
await p.screenshot({ path: OUT + '/t-s8-orta.png' });
await qaror(p, "Bugungi buyurtmalar", 'Oxirgi buyurtmani', 'Sotuvchi');
await qaror(p, 'Oxirgi buyurtmani', 'Bugungi buyurtmalar', 'Doimiy xaridor');
await p.waitForTimeout(500);
log('s8 oxiri: nav=' + await nav(p) + ' · savol: ' + !!(await p.$('.qr')) + ' · belgilangan qatorlar: ' + (await p.$$('.eye-row.got, .eye-row.hot')).length + ' · xulosa: ' + !!(await p.$('.frame-soft')));
await p.screenshot({ path: OUT + '/t-s8-tugadi.png' });
p = await ochish(8, { 8: { correct: true, picked: true } });
log('s8 qaytish (saqlangan): nav=' + await nav(p) + ' · savol: ' + !!(await p.$('.qr')) + ' · belgilangan qatorlar: ' + (await p.$$('.eye-row.got, .eye-row.hot')).length);
// ---- 390 px
const m2 = await ochish(2, {}, 390, 844); await m2.screenshot({ path: OUT + '/t-s2-390.png', fullPage: true });
const m8 = await ochish(8, {}, 390, 844); await m8.screenshot({ path: OUT + '/t-s8-390.png', fullPage: true });
log('qaror xatolari (sabab yo\'q / tugma yopilmadi): ' + xatolar);
log('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
await b.close();
