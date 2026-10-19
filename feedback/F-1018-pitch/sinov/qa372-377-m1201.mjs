// F-1019-03 · m12-01 QA F-1015-372…377 tekshiruvi: qaror qadamlari, bitta karta, bosqich bitta joyda, ma'nosiz matn. node feedback/F-1018-pitch/sinov/qa372-377-m1201.mjs <suratlar/m1201-qa>
import { chromium } from 'playwright-core';
const OUT = process.argv[2]; const ID = 'pm-m12d1-v2';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const ochish = async (screen, extra = {}, w = 1280, h = 860) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, sc, ex]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: sc, maxReached: sc, answers: {}, earned: [], startedAt: Date.now(), total: 10, savedAt: Date.now() })); for (const [k, v] of Object.entries(ex)) localStorage.setItem(k, v); }, [ID, screen, extra]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + OUT + '/uz/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900); return p;
};
const nav = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? b.innerText.trim() + (b.disabled ? ' (yopiq)' : '') : null; });
const log = (x) => console.log(x);
const bashorat = async (p) => { const v = await p.$$('.q-bashorat button'); if (v.length) { await v[0].click(); await p.waitForTimeout(700); } };
// Qaror: avval xato variant (sabab chiqadimi), keyin to'g'ri
const qaror = async (p, togriMatn, xatoMatn, nom) => {
  await p.locator('.ip-qr-v button', { hasText: xatoMatn }).click(); await p.waitForTimeout(250);
  const izoh = await p.innerText('.ip-qr .q-xato').catch(() => "YO'Q");
  const yopiq = await p.locator('.ip-qr-v button', { hasText: xatoMatn }).isDisabled();
  await p.locator('.ip-qr-v button', { hasText: togriMatn }).click(); await p.waitForTimeout(700);
  log(`  ${nom}: xato → «${izoh.slice(0, 60)}» (tugma yopildi: ${yopiq}) → to'g'ri ✓`);
};
// s1 Reja — chegarali qutilar soni
let p = await ochish(1); await p.waitForTimeout(4500);
log('s1: chap kartadagi chegarali bo\'lak qatori: ' + await p.$$eval('.ip-skelet-b', a => a.filter(x => parseFloat(getComputedStyle(x).borderTopWidth) > 0).length) + ' / ' + (await p.$$('.ip-skelet-b')).length + ' · karta chegarasi: ' + await p.$eval('.ip-reja', x => getComputedStyle(x).borderTopWidth));
await p.screenshot({ path: OUT + '/uz/t-s1.png' });
// s2 olti bo'lak — 3 qaror
p = await ochish(2); await bashorat(p);
log('s2 boshida: nav=' + await nav(p) + ' · telefon: ' + !!(await p.$('.ip-tel')) + ' · stepper chip: ' + !!(await p.$('.ip-qadamlar')) + ' · savol: ' + await p.innerText('.ip-qr-s'));
await p.screenshot({ path: OUT + '/uz/t-s2-boshi.png' });
await qaror(p, 'Yana qancha odamga kerak', 'Mahsulot nima qiladi', '1');
await qaror(p, 'Bozor va Jamoa', 'Dizayn va Logotip', '2');
await p.screenshot({ path: OUT + '/uz/t-s2-orta.png' });
await qaror(p, 'Savol-javob boshlanadi', 'Pitch qaytadan aytiladi', '3');
await p.waitForTimeout(1300);
log('s2 oxiri: nav=' + await nav(p) + ' · chegarali bo\'lak: ' + await p.$$eval('.ip-bolak', a => a.filter(x => getComputedStyle(x).borderTopColor !== 'rgba(0, 0, 0, 0)' && parseFloat(getComputedStyle(x).borderTopWidth) > 0 && getComputedStyle(x).borderTopStyle !== 'none' && getComputedStyle(x).borderTopColor.indexOf(', 0)') < 0).length));
await p.screenshot({ path: OUT + '/uz/t-s2-tugadi.png' });
// s3 uch yangi bo'lak
p = await ochish(3); await bashorat(p);
log('s3 boshida: nav=' + await nav(p) + ' · tepadagi strip: ' + !!(await p.$('.ip-uch-strip')) + ' · chiplar: ' + JSON.stringify(await p.$$eval('.ip-fk-chip', a => a.map(x => (x.tagName === 'BUTTON' ? (x.disabled ? '-' : '+') : '·') + x.innerText.trim()))) + ' · bo\'sh uya: ' + !!(await p.$('.ip-bz-bosh')));
await p.screenshot({ path: OUT + '/uz/t-s3-boshi.png' });
await qaror(p, 'Ha — manbasi bor', "son juda kichik", 'Bozor 1');
log('  qatorlar: ' + (await p.$$('.ip-bz-q')).length);
await qaror(p, 'Alohida yoziladi', "60 ga qo'shiladi", 'Bozor 2');
await qaror(p, 'Hali tekshirilmagan', 'Taxminan 1000', 'Bozor 3');
await p.waitForTimeout(1300);
log('  Bozor tugadi: nav=' + await nav(p) + ' · qatorlar: ' + (await p.$$('.ip-bz-q')).length + ' · chiplar: ' + JSON.stringify(await p.$$eval('.ip-fk-chip', a => a.map(x => (x.tagName === 'BUTTON' ? (x.disabled ? '-' : '+') : '·') + x.innerText.trim()))));
await p.screenshot({ path: OUT + '/uz/t-s3-bozor.png' });
await p.locator('.stage-nav button', { hasText: "Keyingi bo'lak" }).click(); await p.waitForTimeout(800); await bashorat(p);
await qaror(p, "G'oya, mahsulot va kod", 'Faqat dizaynni', 'Jamoa 1');
await qaror(p, "Dastur, a'zo emas", 'Ikkinchi dasturchi', 'Jamoa 2');
await qaror(p, "Sinab ko'rganlar", 'Investorlar', 'Jamoa 3');
await p.waitForTimeout(1300);
await p.locator('.stage-nav button', { hasText: "Keyingi bo'lak" }).click(); await p.waitForTimeout(800); await bashorat(p);
await qaror(p, 'Bajarildi — yangisi kerak', "100 ga ko'paytiriladi", 'Keyingi 1');
await qaror(p, '3 tashkilotchi bilan sinash', 'Yangi ilova boshlash', 'Keyingi 2');
await qaror(p, 'Maydon egalari bilan tanishuv', 'Investitsiya summasini', 'Keyingi 3');
await p.waitForTimeout(3200);
log('s3 oxiri: nav=' + await nav(p) + ' · chiplar: ' + JSON.stringify(await p.$$eval('.ip-fk-chip', a => a.map(x => (x.tagName === 'BUTTON' ? (x.disabled ? '-' : '+') : '·') + x.innerText.trim()))));
await p.screenshot({ path: OUT + '/uz/t-s3-tugadi.png' });
await p.locator('.ip-fk-chip.bos', { hasText: 'Bozor' }).click(); await p.waitForTimeout(800);
log('  Bozor chipi bosildi → xulosa: ' + !!(await p.$('.q-xulosa')));
// s5 qoralama — «mmm»
p = await ochish(5);
log('s5: nav=' + await nav(p));
await p.fill('textarea.ip-inp', 'mmm'); await p.locator('.ip-karta button', { hasText: 'Saqlash' }).click(); await p.waitForTimeout(500);
log('  «mmm» → xato: ' + await p.innerText('.ip-karta .q-xato').catch(() => "YO'Q") + ' · nishon: ' + !!(await p.$('.acu-overlay')) + ' · saqlandi: ' + await p.evaluate(() => !!(JSON.parse(localStorage.getItem('pm-m12d1-pitch') || '{}').bolaklar || {}).muammo));
await p.fill('textarea.ip-inp', "O'yinchilar jamoaga odam yig'ishda qiynaladi."); await p.locator('.ip-karta button', { hasText: 'Saqlash' }).click(); await p.waitForTimeout(900);
log("  to'g'ri gap → saqlandi: " + await p.evaluate(() => !!(JSON.parse(localStorage.getItem('pm-m12d1-pitch') || '{}').bolaklar || {}).muammo) + ' · nav=' + await nav(p));
await p.screenshot({ path: OUT + '/uz/t-s5.png' });
const pm = await ochish(3, {}, 390, 844); await bashorat(pm); await pm.screenshot({ path: OUT + '/uz/t-s3-390.png', fullPage: true });
log('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
await b.close();
