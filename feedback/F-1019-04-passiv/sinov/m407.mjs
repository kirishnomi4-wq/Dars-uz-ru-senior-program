// F-1019-04 · m4-07 PmLesson12 s4 (uch kirish — bir sahifa) — kirish-qarorlari sinovi (DE 213.22)
//   node feedback/F-1019-04-passiv/sinov/m407.mjs <suratlar/m407-uz papkasi (_p.html shots.mjs dan)>
import { chromium } from 'playwright-core';
const OUT = process.argv[2]; const ID = 'pm-m4d7-v1'; const SC = 4;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } }); await ctx.route(/^https?:\/\//, r => r.abort());
await ctx.addInitScript(([id, sc]) => { if (sessionStorage.getItem('t-init')) return; sessionStorage.setItem('t-init', '1'); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: sc, maxReached: sc, answers: {}, earned: [], startedAt: Date.now(), total: 16, savedAt: Date.now() })); }, [ID, SC]);
const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + OUT + '/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
const nav = () => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? b.innerText.trim() + (b.disabled ? ' (yopiq)' : ' (ochiq)') : null; });
const kbtn = () => p.$$eval('.kbtn', a => a.map(x => (x.disabled ? '-' : '+') + (x.classList.contains('on') ? '*' : '') + x.innerText.trim()).join(' '));
const log = (x) => console.log(x);
const qaror = async (togri, xato, nom) => {
  const savol = await p.innerText('.p12-qr-s');
  for (const x of xato) {
    await p.locator('.p12-qr-v button', { hasText: x }).click(); await p.waitForTimeout(250);
    const izoh = await p.innerText('.p12-qr .jres').catch(() => "YO'Q");
    const yopiq = await p.locator('.p12-qr-v button', { hasText: x }).isDisabled();
    log(`  ${nom} «${savol}»: xato «${x}» → «${izoh}» (tugma yopildi: ${yopiq})`);
  }
  await p.locator('.p12-qr-v button', { hasText: togri }).click(); await p.waitForTimeout(600);
  log(`  ${nom}: to'g'ri «${togri}» ✓ · kirishlar: ${await kbtn()} · freym: «${await p.innerText('.kdock-fr')}» · nav=${await nav()}`);
};
log('s4 boshida: nav=' + await nav() + ' · kirishlar: ' + await kbtn() + ' · idish pulsi: ' + await p.$eval('.kdock', x => getComputedStyle(x).animationName));
await qaror('Butun sinfning sahifalarini', ["Faqat o'z farzandining sahifasini", "Faqat a'lochilarning sahifasini"], 'Sinf rahbari');
await p.screenshot({ path: OUT + '/t-s4-1.png' });
await qaror('Sahifadagi beshala qatorni', ['Faqat ism va sinf qatorlarini', "Hech qaysi qatorni ko'rmaydi"], 'Sinfdosh');
log('2-bosqich: qaror qoldimi: ' + !!(await p.$('.p12-qr')) + ' · topshiriq: «' + await p.innerText('.jtask').catch(() => "YO'Q") + '» · nav=' + await nav());
await p.screenshot({ path: OUT + '/t-s4-2bosqich.png' });
// 2-bosqich (avvalgidek): ochiq qatorni bosish → 🤔, uch yopiladigan qator → tugadi
await p.locator('.jrow', { hasText: 'Ism' }).click(); await p.waitForTimeout(300);
log('  Ism bosildi → «' + await p.innerText('.jres').catch(() => "YO'Q") + '»');
for (const t of ['Baholar', 'Ota-onaning telefoni', 'Kirish paroli']) { await p.locator('.jrow', { hasText: t }).click(); await p.waitForTimeout(300); }
await p.waitForTimeout(600);
log('s4 oxiri: nav=' + await nav() + ' · yopilgan: ' + (await p.$$('.jrow.closed')).length + ' · masked (sinfdosh): ' + (await p.$$('.jrow.masked')).length + ' · yakun: ' + !!(await p.$('.bdone')));
await p.locator('.kbtn', { hasText: 'Siz' }).click(); await p.waitForTimeout(300);
log('  «Siz» ga almashildi → masked: ' + (await p.$$('.jrow.masked')).length + ' · kirishlar: ' + await kbtn());
await p.screenshot({ path: OUT + '/t-s4-tugadi.png' });
log('saqlangan javob: ' + await p.evaluate((id) => JSON.stringify((JSON.parse(localStorage.getItem('ccProgress:' + id) || '{}').answers || {})[4] || null), ID));
await p.locator('.stage-nav button', { hasText: 'Davom etish' }).click(); await p.waitForTimeout(800);
await p.locator('.stage-nav button', { hasText: 'Orqaga' }).click(); await p.waitForTimeout(900);
log('qaytganda: nav=' + await nav() + ' · qaror: ' + !!(await p.$('.p12-qr')) + ' · kirishlar: ' + await kbtn() + ' · yopilgan: ' + (await p.$$('.jrow.closed')).length);
await p.reload(); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(1200);
log('qayta yuklanganda: ekran=' + await p.evaluate(() => (document.body.innerText.match(/(\d{2}) \/ (\d{2})/) || [])[0]) + ' · nav=' + await nav() + ' · qaror: ' + !!(await p.$('.p12-qr')) + ' · kirishlar: ' + await kbtn());
log('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
await b.close();
