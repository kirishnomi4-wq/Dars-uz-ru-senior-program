// F-1019-06 · m10-12 PmGrowthPitch s8 «Jonli demo»: 3 tugma → 3 qaror (DE 213.22).
// node feedback/F-1019-04-passiv/sinov/m1012.mjs  (avval shots.mjs bilan suratlar/m1012-uz va m1012-ru/_p.html yig'iladi)
import { chromium } from 'playwright-core';
const S = '/home/kali/Desktop/internetLesson/feedback/F-1019-04-passiv/suratlar';
const ID = 'pm-m10d12-v2'; const EKRAN = 4; const TOTAL = 11;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const log = (x) => console.log(x);
const ochish = async (lang, w = 1280, h = 860) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, sc, tot]) => { if (sessionStorage.getItem('_bir')) return; sessionStorage.setItem('_bir', '1'); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: sc, maxReached: sc, answers: {}, earned: [], startedAt: Date.now(), total: tot, savedAt: Date.now() })); }, [ID, EKRAN, TOTAL]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(lang + ': ' + e.message));
  await p.goto('file://' + S + '/m1012-' + lang + '/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900); return p;
};
const nav = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? b.innerText.trim() + (b.disabled ? ' (yopiq)' : ' (ochiq)') : null; });
const holat = (p) => p.evaluate(() => {
  const t = (s) => [...document.querySelectorAll(s)].map(x => x.innerText.replace(/\s+/g, ' ').trim());
  return 'zal=' + JSON.stringify(t('.gp-zal .gp-puf')) + ' · telefonlar=' + document.querySelectorAll('.gp-demo .gp-tel').length + ' · Database=' + (t('.gp-db')[0] || '-') + ' · zaxira=' + JSON.stringify(t('.gp-zaxira-k')) + ' · izohlar(vizual ichida)=' + document.querySelectorAll('.q-kir .gp-izohlar .q-izoh, .q-kir .gp-izohlar .gp-kulrang').length;
});
const qaror = async (p, togri, xato, nom, kut) => {
  const savol = await p.innerText('.gp-qr-s');
  await p.locator('.gp-qr-v button', { hasText: xato }).click(); await p.waitForTimeout(250);
  const izoh = await p.innerText('.gp-qr .q-xato').catch(() => "YO'Q");
  const yopiq = await p.locator('.gp-qr-v button', { hasText: xato }).isDisabled();
  await p.locator('.gp-qr-v button', { hasText: togri }).click(); await p.waitForTimeout(200);
  const animYopiq = await p.$$eval('.gp-qr-v button', a => a.every(x => x.disabled)).catch(() => 'savol yo\'q');
  await p.waitForTimeout(kut);
  log(`  ${nom}: «${savol}» · xato «${xato}» → sabab «${izoh}» (${izoh.length} belgi; tugma yopildi: ${yopiq}) → to'g'ri «${togri}» ✓ (animatsiya paytida variantlar yopiq: ${animYopiq})`);
};
for (const [lang, w, h] of [['uz', 1280, 860], ['uz', 390, 844], ['ru', 1280, 860]]) {
  const t = lang === 'uz';
  const k = lang + (w < 500 ? '-390' : '');
  log(`== ${k}`);
  const p = await ochish(lang, w, h);
  log('  boshida: nav=' + await nav(p) + ' · stepper (gp-tq): ' + !!(await p.$('.gp-tq')));
  await p.locator('.q-bashorat button').first().click(); await p.waitForTimeout(700);
  log('  bashoratdan keyin: nav=' + await nav(p) + ' · stepper (gp-tq): ' + !!(await p.$('.gp-tq')) + ' · variantlar: ' + JSON.stringify(await p.$$eval('.gp-qr-v button', a => a.map(x => x.innerText.trim()))));
  log('    ' + await holat(p));
  await p.screenshot({ path: `${S}/m1012-sinov/${k}-0-boshi.png`, fullPage: true });
  await qaror(p, t ? 'Bosilgan tugma' : 'Нажатую кнопку', t ? 'Boshqa telefonlar' : 'другие телефоны', '1 · Bitta telefon', 1500);
  log('    ' + await holat(p) + ' · nav=' + await nav(p));
  await p.screenshot({ path: `${S}/m1012-sinov/${k}-1-bitta.png`, fullPage: true });
  await qaror(p, t ? 'Ikkinchi qurilma' : 'второе устройство', t ? 'Sahifa pastga' : 'Страницу обновляют', '2 · Ikkinchi qurilma', 3000);
  log('    ' + await holat(p) + ' · nav=' + await nav(p));
  await p.screenshot({ path: `${S}/m1012-sinov/${k}-2-ikki.png`, fullPage: true });
  await qaror(p, t ? 'Video yoki sherik' : 'Видео или телефон', t ? 'kutib turiladi' : 'Ждут, пока', '3 · Zaxira', 2600);
  log('  tugadi: nav=' + await nav(p) + ' · xulosa: ' + !!(await p.$('.q-xulosa')) + ' · savol: ' + !!(await p.$('.gp-qr')) + ' · ' + await holat(p));
  await p.screenshot({ path: `${S}/m1012-sinov/${k}-3-tugadi.png`, fullPage: true });
  await p.locator('.stage-nav button').last().click(); await p.waitForTimeout(900);
  await p.locator('.stage-nav button').first().click(); await p.waitForTimeout(1500);
  log('  qaytganda: eyebrow=' + await p.innerText('.stage-eyebrow, .eyebrow').catch(() => '?') + ' · nav=' + await nav(p) + ' · savol: ' + !!(await p.$('.gp-qr')) + ' · xulosa: ' + !!(await p.$('.q-xulosa')) + ' · bashorat: ' + !!(await p.$('.q-bashorat')));
  await p.screenshot({ path: `${S}/m1012-sinov/${k}-4-qaytdi.png`, fullPage: true });
  await p.context().close();
}
log('pageerror: ' + errs.length + (errs.length ? ' ' + errs.join(' | ') : ''));
await b.close();
