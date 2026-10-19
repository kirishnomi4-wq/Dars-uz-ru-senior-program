// F-1019-06 · m12-08 PmFinalPitch s3 «Tuzatish va taymer»: 3 tugma → 3 qaror (DE 213.22).
// node feedback/F-1019-04-passiv/sinov/m1208.mjs  (avval shots.mjs bilan suratlar/m1208-uz va m1208-ru/_p.html yig'iladi)
import { chromium } from 'playwright-core';
const S = '/home/kali/Desktop/internetLesson/feedback/F-1019-04-passiv/suratlar';
const ID = 'pm-m12d8-v2'; const EKRAN = 3; const TOTAL = 11;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const log = (x) => console.log(x);
const ochish = async (lang, w = 1280, h = 860) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, sc, tot]) => { if (sessionStorage.getItem('_bir')) return; sessionStorage.setItem('_bir', '1'); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: sc, maxReached: sc, answers: {}, earned: [], startedAt: Date.now(), total: tot, savedAt: Date.now() })); }, [ID, EKRAN, TOTAL]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(lang + ': ' + e.message));
  await p.goto('file://' + S + '/m1208-' + lang + '/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900); return p;
};
const nav = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? b.innerText.trim() + (b.disabled ? ' (yopiq)' : ' (ochiq)') : null; });
const qaror = async (p, togri, xato, nom) => {
  const savol = await p.innerText('.fp-qr-s');
  await p.locator('.fp-qr-v button', { hasText: xato }).click(); await p.waitForTimeout(250);
  const izoh = await p.innerText('.fp-qr .q-xato').catch(() => "YO'Q");
  const yopiq = await p.locator('.fp-qr-v button', { hasText: xato }).isDisabled();
  await p.locator('.fp-qr-v button', { hasText: togri }).click(); await p.waitForTimeout(800);
  log(`  ${nom}: «${savol}» · xato «${xato}» → sabab «${izoh}» (${izoh.length} belgi; tugma yopildi: ${yopiq}) → to'g'ri «${togri}» ✓`);
};
for (const [lang, w, h] of [['uz', 1280, 860], ['uz', 390, 844], ['ru', 1280, 860]]) {
  const t = lang === 'uz';
  const k = lang + (w < 500 ? '-390' : '');
  log(`== ${k}`);
  const p = await ochish(lang, w, h);
  log('  boshida: nav=' + await nav(p) + ' · stepper (fp-qadamlar): ' + !!(await p.$('.fp-qadamlar')));
  await p.locator('.q-bashorat button').first().click(); await p.waitForTimeout(700);
  log('  bashoratdan keyin: nav=' + await nav(p) + ' · savol: ' + await p.innerText('.fp-qr-s') + ' · variantlar: ' + JSON.stringify(await p.$$eval('.fp-qr-v button', a => a.map(x => x.innerText.trim()))));
  await p.screenshot({ path: `${S}/m1208-sinov/${k}-0-boshi.png`, fullPage: true });
  await qaror(p, t ? "Baholash varag'idagi" : 'С замечаний из листа', t ? 'boshidan qayta' : 'пишет питч заново', '1 · Varaq');
  log('    sahna: ✗ belgili bo\'lak ' + (await p.$$('.fp-bo.xato')).length + ' · hakam pufagi ' + (await p.$$('.fp-pufak.hakam')).length + ' · nav=' + await nav(p));
  await p.screenshot({ path: `${S}/m1208-sinov/${k}-1-varaq.png`, fullPage: true });
  await qaror(p, t ? "Eski gap o'rniga" : 'Вместо старой фразы', t ? 'Butun pitch' : 'Весь питч', '2 · Tuzatishlar');
  const iz = await p.$eval('.fp-sahna .fp-sahna-iz', x => x.innerText).catch(() => "YO'Q");
  log('    sahna: qo\'llandi ' + (await p.$$('.fp-bo.qollandi')).length + ' · izoh sahna ichida: «' + iz + '» · harakatdagi QIzoh: ' + (await p.$$('.fp-harakat .q-izoh')).length + ' · nav=' + await nav(p));
  await p.screenshot({ path: `${S}/m1208-sinov/${k}-2-tuzatish.png`, fullPage: true });
  await qaror(p, t ? 'Taymer bilan aytganda' : 'Узнаем, рассказав', t ? 'Ha, reja' : 'Да, план', '3 · Taymer');
  log('    taymer yurmoqda: savol qoldimi ' + !!(await p.$('.fp-qr')) + ' · nav=' + await nav(p));
  await p.waitForTimeout(7500);
  log('  tugadi: nav=' + await nav(p) + ' · xulosa: ' + !!(await p.$('.q-xulosa')) + ' · taymer: ' + await p.innerText('.fp-tm-chet b').catch(() => '-'));
  await p.screenshot({ path: `${S}/m1208-sinov/${k}-3-tugadi.png`, fullPage: true });
  await p.locator('.stage-nav button').last().click(); await p.waitForTimeout(900);
  await p.locator('.stage-nav button').first().click(); await p.waitForTimeout(1500);
  log('  qaytganda: eyebrow=' + await p.innerText('.stage-eyebrow, .eyebrow').catch(() => '?') + ' · nav=' + await nav(p) + ' · savol: ' + !!(await p.$('.fp-qr')) + ' · xulosa: ' + !!(await p.$('.q-xulosa')) + ' · bashorat: ' + !!(await p.$('.q-bashorat')));
  await p.screenshot({ path: `${S}/m1208-sinov/${k}-4-qaytdi.png`, fullPage: true });
  await p.context().close();
}
log('pageerror: ' + errs.length + (errs.length ? ' ' + errs.join(' | ') : ''));
await b.close();
