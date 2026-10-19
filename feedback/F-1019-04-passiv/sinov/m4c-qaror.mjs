// F-1019-04 · m4c-01 s2 va m4c-03 s6 (DE 213.22): passiv «birma-bir bosing» → qaror qadamlari tekshiruvi.
// Avval shots.mjs _p.html ni yig'adi: suratlar/m4c01-uz, suratlar/m4c03-uz. Ishga tushirish: node feedback/F-1019-04-passiv/sinov/m4c-qaror.mjs
import { chromium } from 'playwright-core';
const SUR = '/home/kali/Desktop/internetLesson/feedback/F-1019-04-passiv/suratlar';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const log = (x) => console.log(x);
const ochish = async (dir, id, screen, extra = {}, w = 1280, h = 860) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, sc, ex]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: sc, maxReached: sc, answers: {}, earned: [], startedAt: Date.now(), total: (id.startsWith('github') ? 23 : 20), savedAt: Date.now() })); for (const [k, v] of Object.entries(ex)) localStorage.setItem(k, v); }, [id, screen, extra]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + SUR + '/' + dir + '/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900); return p;
};
const nav = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? b.innerText.trim() + (b.disabled ? ' (yopiq)' : ' (ochiq)') : null; });
const qaror = async (p, togri, xato, nom) => {
  const savol = await p.innerText('.qr-s');
  await p.locator('.qr-v button', { hasText: xato }).click(); await p.waitForTimeout(250);
  const izoh = await p.innerText('.qr .qr-xato').catch(() => "YO'Q");
  const yopiq = await p.locator('.qr-v button', { hasText: xato }).isDisabled();
  await p.locator('.qr-v button', { hasText: togri }).click(); await p.waitForTimeout(500);
  const keyingi = await p.innerText('.qr-s').catch(() => '(savol yo\'q — tugadi)');
  log(`  ${nom}. «${savol}» xato «${xato}» → «${izoh}» (tugma yopildi: ${yopiq}) → to'g'ri «${togri}» → ${keyingi === savol ? 'QADAM O\'ZGARMADI!' : 'keyingi qadam'}`);
};
const qaytish = async (p, dir, id, screen, sel) => {
  const pr = await p.evaluate((id) => localStorage.getItem('ccProgress:' + id), id);
  const j = JSON.parse(pr || '{}');
  log(`  saqlangan javob [${screen}]: ${JSON.stringify((j.answers || {})[screen])}`);
  const q = await ochish(dir, id, screen, { ['ccProgress:' + id]: JSON.stringify({ ...j, screen, maxReached: Math.max(j.maxReached || 0, screen) }) });
  log(`  qaytganda: nav=${await nav(q)} · savol bor: ${!!(await q.$('.qr'))} · xulosa: ${!!(await q.$('.frame-success'))} · ✓: ${await q.$$eval(sel, a => a.filter(x => x.innerText.includes('✓')).length)}`);
  await q.screenshot({ path: SUR + '/' + dir + '/t-qaytish.png' });
};

// ---- m4c-01 s2 ----
const ID1 = 'cicd-intro-4c-01-v18';
log('m4c-01 (CiCdIntroLesson) s2 «Bitta uchirish — aslida nechta amal?»');
let p = await ochish('m4c01-uz', ID1, 2);
log(`  boshida: nav=${await nav(p)} · bosiladigan nuqta-karta: ${(await p.$$('.cj-items button')).length} · vaqt: ${await p.innerText('.timer-chip .tc-val')}`);
await p.locator('.tempt-btn').click(); await p.waitForTimeout(300);
log(`  vasvasa-tugma → ogohlantirish: ${!!(await p.$('.frame-warn'))}`);
await p.screenshot({ path: SUR + '/m4c01-uz/t-vasvasa.png' });
await qaror(p, "Kerakli paketlarni o'rnatasiz", 'Saytni internetga chiqarasiz', '1');
log(`  1-qadamdan keyin: ogohlantirish yopildi: ${!(await p.$('.frame-warn'))} · vaqt: ${await p.innerText('.timer-chip .tc-val')}`);
await qaror(p, 'Testlarni ishga tushirasiz', "Paketlarni qayta o'rnatasiz", '2');
await p.locator('.qr-v button', { hasText: "Sahifa telefon" }).click(); await p.waitForTimeout(250);
await p.screenshot({ path: SUR + '/m4c01-uz/t-xato.png' });
await qaror(p, 'Kod qoidalarga mos yozilganini', 'Kod qancha tez', '3');
await qaror(p, 'Yuk internet uchun yengil qilinadi', 'Kod zip faylga', '4');
await qaror(p, 'Tayyor sayt foydalanuvchilarga chiqadi', 'Kod qaytadan tekshiriladi', '5');
await p.waitForTimeout(600);
log(`  oxiri: nav=${await nav(p)} · vaqt: ${await p.innerText('.timer-chip .tc-val')} · ✓ karta: ${await p.$$eval('.cj-items .itm-card', a => a.filter(x => x.innerText.includes('✓')).length)}/5 · xulosa: ${!!(await p.$('.frame-success'))} · vasvasa-tugma: ${!!(await p.$('.tempt-btn'))}`);
await p.screenshot({ path: SUR + '/m4c01-uz/t-tugadi.png' });
await qaytish(p, 'm4c01-uz', ID1, 2, '.cj-items .itm-card');
const m1 = await ochish('m4c01-uz', ID1, 2, {}, 390, 844); await m1.screenshot({ path: SUR + '/m4c01-uz/t-390.png', fullPage: true });

// ---- m4c-03 s6 ----
const ID2 = 'github-actions-4c-02-v18';
log('m4c-03 (GithubActionsLesson) s6 «Workflow → Job → Step qanday joylashgan?»');
p = await ochish('m4c03-uz', ID2, 6);
log(`  boshida: nav=${await nav(p)} · bosiladigan daraja-karta: ${(await p.$$('button.vcard')).length} · ta'rif-karta: ${!!(await p.$('.split .frame'))}`);
await qaror(p, 'Bitta fayldagi butun lenta rejasi', 'Faylning ichidagi bitta buyruq', '1');
log(`  1-qadamdan keyin ta'rif: «${(await p.innerText('.split .frame').catch(() => "YO'Q")).replace(/\s+/g, ' ').slice(0, 50)}…»`);
await p.locator('.qr-v button', { hasText: 'Sizning shaxsiy' }).click(); await p.waitForTimeout(250);
await p.screenshot({ path: SUR + '/m4c03-uz/t-xato.png' });
await qaror(p, "O'zining alohida mashinasida", 'Boshqa bir nuqtaning', '2');
log(`  2-qadamdan keyin ta'rif: «${(await p.innerText('.split .frame').catch(() => "YO'Q")).replace(/\s+/g, ' ').slice(0, 50)}…»`);
await qaror(p, 'Yuqoridan pastga navbat bilan', 'Hammasi bir vaqtning', '3');
await p.waitForTimeout(600);
log(`  oxiri: nav=${await nav(p)} · ✓ daraja: ${await p.$$eval('.vcard', a => a.filter(x => x.innerText.includes('✓')).length)}/3 · ta'rif-karta: ${!!(await p.$('.split .frame'))} · xulosa: ${!!(await p.$('.frame-success'))}`);
await p.screenshot({ path: SUR + '/m4c03-uz/t-tugadi.png' });
await qaytish(p, 'm4c03-uz', ID2, 6, '.vcard');
const m2 = await ochish('m4c03-uz', ID2, 6, {}, 390, 844); await m2.screenshot({ path: SUR + '/m4c03-uz/t-390.png', fullPage: true });

log('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
await b.close();
