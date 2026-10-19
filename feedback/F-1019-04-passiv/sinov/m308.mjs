// F-1019-04 · m3-08 ReactApiGetLesson s3 (fetch tuzilishi) — qaror qadamlari sinovi (DE 213.22)
//   node feedback/F-1019-04-passiv/sinov/m308.mjs <suratlar/m308-uz papkasi (_p.html shots.mjs dan)>
import { chromium } from 'playwright-core';
const OUT = process.argv[2]; const ID = 'react-api-get-05-v18'; const SC = 3;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } }); await ctx.route(/^https?:\/\//, r => r.abort());
await ctx.addInitScript(([id, sc]) => { if (sessionStorage.getItem('t-init')) return; sessionStorage.setItem('t-init', '1'); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: sc, maxReached: sc, answers: {}, earned: [], startedAt: Date.now(), total: 20, savedAt: Date.now() })); }, [ID, SC]);
const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + OUT + '/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
const nav = () => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? b.innerText.trim() + (b.disabled ? ' (yopiq)' : ' (ochiq)') : null; });
const log = (x) => console.log(x);
const qaror = async (togri, xato, nom) => {
  const savol = await p.innerText('.qr-s');
  for (const x of xato) {
    await p.locator('.qr-v button', { hasText: x }).click(); await p.waitForTimeout(250);
    const izoh = await p.innerText('.qr .frame-warn').catch(() => "YO'Q");
    const yopiq = await p.locator('.qr-v button', { hasText: x }).isDisabled();
    log(`  ${nom} «${savol}»: xato «${x}» → «${izoh}» (tugma yopildi: ${yopiq})`);
  }
  await p.locator('.qr-v button', { hasText: togri }).click(); await p.waitForTimeout(600);
  const pasport = await p.$$eval('.split .col:nth-child(2) .mono', a => a.map(x => x.innerText.trim()));
  log(`  ${nom}: to'g'ri «${togri}» ✓ · pasport: ${JSON.stringify(pasport)} · izoh-karta: ${await p.innerText('.sk-info .note-h').catch(() => '-')} · nav=${await nav()}`);
};
log('s3 boshida: nav=' + await nav() + ' · bosiladigan token: ' + await p.$$eval('.fa-tok', a => a.filter(x => getComputedStyle(x).cursor === 'pointer').length) + ' · joriy token: ' + await p.$$eval('.fa-tok.on', a => a.map(x => x.innerText).join(',')));
await qaror("Faqat o'qiydi va olib keladi", ["Yangi o'yin qo'shib qaytadi", "Ro'yxatni serverdan ko'chirib oladi"], '1');
await p.screenshot({ path: OUT + '/t-s3-1.png' });
await qaror('Qaysi serverga borish kerakligini', ["Serverdagi qaysi bo'lim kerakligini", 'Bizning saytimiz qayerda turishini'], '2');
await qaror("Server ichidagi kerakli bo'limni", ['Kompyuteringizdagi papka nomini', "Serverdagi faqat birinchi o'yinni"], '3');
await p.waitForTimeout(500);
log('s3 oxiri: nav=' + await nav() + ' · qaror karta qoldimi: ' + !!(await p.$('.qr')) + ' · 200 OK: ' + (await p.innerText('.lesson-root')).includes('200 OK') + ' · xulosa: ' + !!(await p.$('.frame-success')));
await p.screenshot({ path: OUT + '/t-s3-tugadi.png' });
log('saqlangan javob: ' + await p.evaluate((id) => JSON.stringify((JSON.parse(localStorage.getItem('ccProgress:' + id) || '{}').answers || {})[3] || null), ID));
// keyingi ekranga o'tib, qaytish
await p.locator('.stage-nav button', { hasText: 'Davom etish' }).click(); await p.waitForTimeout(800);
await p.locator('.stage-nav button', { hasText: 'Orqaga' }).click(); await p.waitForTimeout(900);
log('qaytganda: nav=' + await nav() + ' · qaror: ' + !!(await p.$('.qr')) + ' · pasport: ' + JSON.stringify(await p.$$eval('.split .col:nth-child(2) .mono', a => a.map(x => x.innerText.trim()))));
// sahifani qayta yuklash
await p.reload(); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(1200);
log('qayta yuklanganda: ekran=' + await p.evaluate(() => (document.body.innerText.match(/(\d{2}) \/ (\d{2})/) || [])[0]) + ' · nav=' + await nav() + ' · qaror: ' + !!(await p.$('.qr')));
log('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
await b.close();
