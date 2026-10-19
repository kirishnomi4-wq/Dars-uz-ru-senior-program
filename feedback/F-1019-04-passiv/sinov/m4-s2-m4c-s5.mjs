// F-1019-06 · m4-07 s2 va m4c-03 s5 (DE 213.22): passiv ochish → qaror qadamlari tekshiruvi.
// Avval shots.mjs _p.html ni yig'adi: suratlar/m407s2-uz, suratlar/m4c03s5-uz. Ishga tushirish: node feedback/F-1019-04-passiv/sinov/m4-s2-m4c-s5.mjs
import { chromium } from 'playwright-core';
const SUR = '/home/kali/Desktop/internetLesson/feedback/F-1019-04-passiv/suratlar';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const log = (x) => console.log(x);
const ochish = async (dir, id, total, screen, extra = {}, w = 1280, h = 860) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, sc, tot, ex]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); localStorage.setItem('pmOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: sc, maxReached: sc, answers: {}, earned: [], startedAt: Date.now(), total: tot, savedAt: Date.now() })); for (const [k, v] of Object.entries(ex)) localStorage.setItem(k, v); }, [id, screen, total, extra]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + SUR + '/' + dir + '/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900); return p;
};
const nav = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? b.innerText.trim() + (b.disabled ? ' (yopiq)' : ' (ochiq)') : null; });
const qaror = async (p, k, togri, xato, nom) => {
  const savol = await p.innerText(k.s);
  await p.locator(k.v + ' button', { hasText: xato }).click(); await p.waitForTimeout(250);
  const izoh = await p.innerText(k.x).catch(() => "YO'Q");
  const yopiq = await p.locator(k.v + ' button', { hasText: xato }).isDisabled();
  await p.locator(k.v + ' button', { hasText: togri }).click(); await p.waitForTimeout(500);
  const keyingi = await p.innerText(k.s).catch(() => "(savol yo'q — tugadi)");
  log(`  ${nom}. «${savol}» xato «${xato}» → «${izoh}» (tugma yopildi: ${yopiq}) → to'g'ri «${togri}» → ${keyingi === savol ? "QADAM O'ZGARMADI!" : 'keyingi qadam'}`);
};
const qaytish = async (p, dir, id, total, screen, info) => {
  const pr = await p.evaluate((id) => localStorage.getItem('ccProgress:' + id), id);
  const j = JSON.parse(pr || '{}');
  log(`  saqlangan javob [${screen}]: ${JSON.stringify((j.answers || {})[screen])}`);
  const q = await ochish(dir, id, total, screen, { ['ccProgress:' + id]: JSON.stringify({ ...j, screen, maxReached: Math.max(j.maxReached || 0, screen) }) });
  log(`  qaytganda: nav=${await nav(q)} · ${await info(q)}`);
  await q.screenshot({ path: SUR + '/' + dir + '/t-qaytish.png' });
};

// ---- m4-07 s2 ----
const ID1 = 'pm-m4d7-v1', T1 = 16;
const K1 = { s: '.p12-qr-s', v: '.p12-qr-v', x: '.p12-qr .jres' };
const ochiq1 = (p) => p.$$eval('.dfc', a => a.map(x => (x.classList.contains('open') ? '+' : '-') + x.querySelector('.dfc-h').innerText).join(' '));
log("m4-07 (PmLesson12) s2 «Muhokama · ikki xil ma'lumot»");
let p = await ochish('m407s2-uz', ID1, T1, 2);
log(`  boshida: nav=${await nav(p)} · kartalar: ${await ochiq1(p)} · bosiladigan karta: ${(await p.$$('button.dfc')).length}`);
await qaror(p, K1, "Hech kim zarar ko'rmaydi", "Siz zarar ko'rasiz", '1');
log(`  1-qadamdan keyin: kartalar: ${await ochiq1(p)} · nav=${await nav(p)}`);
await p.locator(K1.v + ' button', { hasText: "Hech kim, bu shunchaki" }).click(); await p.waitForTimeout(250);
await p.screenshot({ path: SUR + '/m407s2-uz/t-xato.png' });
await qaror(p, K1, "Kartaning egasi", "Kodni ko'rib qolgan", '2');
await p.waitForTimeout(500);
log(`  oxiri: nav=${await nav(p)} · kartalar: ${await ochiq1(p)} · savol bor: ${!!(await p.$('.p12-qr'))}`);
await p.screenshot({ path: SUR + '/m407s2-uz/t-tugadi.png' });
await qaytish(p, 'm407s2-uz', ID1, T1, 2, async (q) => `savol bor: ${!!(await q.$('.p12-qr'))} · kartalar: ${await ochiq1(q)}`);
const m1 = await ochish('m407s2-uz', ID1, T1, 2, {}, 390, 844); await m1.screenshot({ path: SUR + '/m407s2-uz/t-390.png', fullPage: true });

// ---- m4c-03 s5 ----
const ID2 = 'github-actions-4c-02-v18', T2 = 23;
const K2 = { s: '.qr-s', v: '.qr-v', x: '.qr .qr-xato' };
const chip = (p) => p.$$eval('.gchip-row .gchip', a => a.map(x => x.innerText.trim()).join(' | '));
const tarif = (p) => p.innerText('.split .sk-info').then(t => '«' + t.replace(/\s+/g, ' ').slice(0, 45) + '…»').catch(() => "YO'Q");
log("m4c-03 (GithubActionsLesson) s5 «Tushuncha · YAML»");
p = await ochish('m4c03s5-uz', ID2, T2, 5);
log(`  boshida: nav=${await nav(p)} · chiplar: ${await chip(p)} · bosiladigan chip: ${(await p.$$('button.gchip')).length} · ta'rif: ${await tarif(p)}`);
await qaror(p, K2, 'Kalitni uning qiymatidan', 'Ikki kalitni', '1');
log(`  1-qadamdan keyin: chiplar: ${await chip(p)} · ta'rif: ${await tarif(p)}`);
await p.locator(K2.v + ' button', { hasText: "Shu qatorni vaqtincha" }).click(); await p.waitForTimeout(250);
await p.screenshot({ path: SUR + '/m4c03s5-uz/t-xato.png' });
await qaror(p, K2, "Ro'yxatning bitta elementini", "Ro'yxatning sarlavhasini", '2');
log(`  2-qadamdan keyin: ta'rif: ${await tarif(p)}`);
await qaror(p, K2, "U test: qatorining ichida", "Bu faqat chiroy", '3');
await p.waitForTimeout(600);
log(`  oxiri: nav=${await nav(p)} · chiplar: ${await chip(p)} · ta'rif: ${await tarif(p)} · xulosa: ${!!(await p.$('.frame-success'))}`);
await p.screenshot({ path: SUR + '/m4c03s5-uz/t-tugadi.png' });
await qaytish(p, 'm4c03s5-uz', ID2, T2, 5, async (q) => `savol bor: ${!!(await q.$('.qr'))} · xulosa: ${!!(await q.$('.frame-success'))} · chiplar: ${await chip(q)} · ta'rif: ${await tarif(q)}`);
const m2 = await ochish('m4c03s5-uz', ID2, T2, 5, {}, 390, 844); await m2.screenshot({ path: SUR + '/m4c03s5-uz/t-390.png', fullPage: true });

log('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
await b.close();
