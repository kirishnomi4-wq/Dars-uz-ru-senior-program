// F-1019-04 · m1-05 (PmLesson2) s3 «Real saytlar» va s5 «Bo'lim vazifasi» — qaror qadamlari (DE 213.22) sinovi.
// Avval: SHOT_LANG=uz node konveyer/vositalar/shots.mjs src/1-Modull/PmLesson2.jsx <SUR>/m1-05-uz 3,5  (_p.html yig'iladi)
// node feedback/F-1019-04-passiv/sinov/m1-05.mjs <SUR>  (SUR = feedback/F-1019-04-passiv/suratlar, absolyut)
import { chromium } from 'playwright-core';
const SUR = process.argv[2]; const PAGE = SUR + '/m1-05-uz/_p.html'; const OUT = SUR + '/m1-05-sinov'; const ID = 'pm-m1d6-v1';
import { mkdirSync } from 'node:fs'; mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const log = (x) => console.log(x);
const ochish = async (screen, w = 1280, h = 860) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, sc]) => { if (sessionStorage.getItem('_ok')) return; sessionStorage.setItem('_ok', '1'); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); localStorage.setItem('pmOnboarded_'+r,'1'); } localStorage.setItem('liveSession:'+id, JSON.stringify({mode:'self'})); localStorage.setItem('ccProgress:'+id, JSON.stringify({ screen: sc, maxReached: sc, answers: {}, earned: [], startedAt: Date.now(), total: 17, savedAt: Date.now() })); }, [ID, screen]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + PAGE); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(1200); return p;
};
const nav = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? b.innerText.trim() + (b.disabled ? ' (yopiq)' : ' (ochiq)') : null; });
const qaror = async (p, togri, xato, nom) => {
  const savol = await p.innerText('.qr .qr-s');
  await p.locator('.qr-v button', { hasText: xato }).click(); await p.waitForTimeout(250);
  const izoh = await p.innerText('.qr .qr-x').catch(() => "YO'Q");
  const yopiq = await p.locator('.qr-v button', { hasText: xato }).isDisabled();
  const kartada = await p.evaluate(() => !!document.querySelector('.sk-info.qr .qr-x'));
  await p.locator('.qr-v button', { hasText: togri }).click(); await p.waitForTimeout(600);
  const ochildi = await p.evaluate(() => { const c = [...document.querySelectorAll('.col')][1]; const k = c && c.querySelector('.sk-info'); return k ? k.innerText.split('\n')[0] : '-'; });
  log(`  ${nom}: «${savol}» · xato «${xato}» → «${izoh}» (tugma yopildi: ${yopiq}, karta ichida: ${kartada}) → to'g'ri «${togri}» → o'ngda: ${ochildi}`);
};
const qaytish = async (p, nom) => {
  await p.locator('.stage-nav button', { hasText: 'Davom etish' }).click(); await p.waitForTimeout(900);
  await p.locator('.stage-nav button', { hasText: 'Orqaga' }).click(); await p.waitForTimeout(900);
  log(`  qaytganda (${nom}): nav=${await nav(p)} · savol kartasi: ${!!(await p.$('.qr'))} · ✓ soni: ${await p.$$eval('.col:first-child button svg', a => a.length).catch(() => '?')}`);
  await p.reload(); await p.waitForTimeout(1500);
  log(`  qayta yuklanganda: ekran=${await p.innerText('.chrome-left')} · nav=${await nav(p)} · savol kartasi: ${!!(await p.$('.qr'))}`);
};
// s3 — uch sayt
let p = await ochish(3);
log('s3 boshida: nav=' + await nav(p) + ' · yoqilgan sayt tugmalari: ' + await p.$$eval('.col:first-child > div > button', a => a.filter(x => !x.disabled).length));
await qaror(p, 'Sayt nima taklif qilishi', "E'lon berish tugmasi", '1 OLX');
await p.screenshot({ path: OUT + '/s3-1.png' });
await qaror(p, 'Eng oxirida', 'Eng tepada', '2 Yangiliklar');
await p.locator('.qr-v button', { hasText: "Kanallar ro'yxati" }).click(); await p.waitForTimeout(300);
await p.screenshot({ path: OUT + '/s3-3-xato.png' });
await qaror(p, 'Tavsiya etilgan video', "Ko'rishni boshlash tugmasi", '3 Video');
log('s3 oxiri: nav=' + await nav(p) + ' · xulosa: ' + !!(await p.$('.frame-success')));
await p.locator('.col:first-child > div > button', { hasText: 'OLX' }).click(); await p.waitForTimeout(500);
log('  OLX qayta bosildi → o\'ngda: ' + await p.evaluate(() => [...document.querySelectorAll('.col')][1].querySelector('.sk-info').innerText.split('\n')[0]));
await p.screenshot({ path: OUT + '/s3-tugadi.png' });
await qaytish(p, 's3');
// s5 — besh bo'lim
p = await ochish(5);
log('s5 boshida: nav=' + await nav(p));
await qaror(p, 'Sayt nima taklif qilishini aytadi', 'Saytni chiroyli qilib bezaydi', '1 Birinchi blok');
await qaror(p, 'Tanish qiyinchilikni eslatadi', 'Saytning kamchiliklarini aytadi', '2 Muammo');
await qaror(p, 'Qiyinchilik qanday yengilishini aytadi', 'Saytning ichki kodini', '3 Qanday ishlaydi');
await p.locator('.qr-v button', { hasText: "Sayt eng yaxshi" }).click(); await p.waitForTimeout(300);
await p.screenshot({ path: OUT + '/s5-4-xato.png' });
await qaror(p, "Boshqalar foydalanganini", "Ro'yxatdan o'tish", '4 Isbot');
await qaror(p, 'Aniq keyingi qadamni beradi', 'Sahifa boshiga qaytaradi', '5 Harakat tugmasi');
log('s5 oxiri: nav=' + await nav(p));
await p.screenshot({ path: OUT + '/s5-tugadi.png' });
await qaytish(p, 's5');
// mobil 390
const pm = await ochish(3, 390, 844); await pm.screenshot({ path: OUT + '/s3-390.png', fullPage: true });
const pm5 = await ochish(5, 390, 844); await pm5.screenshot({ path: OUT + '/s5-390.png', fullPage: true });
log('pageerror: ' + errs.length + (errs.length ? ' ' + errs.join(' | ') : ''));
await b.close();
