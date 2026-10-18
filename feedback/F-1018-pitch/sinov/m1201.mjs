// F-1018-11 · m12-01 ScreenUch (3 qism ketma-ket) + ScreenSherik (2 daq → olti savol belgisi) tekshiruvi. Chaqirish: node feedback/F-1018-pitch/sinov/m1201.mjs <shots-papka>
import { chromium } from 'playwright-core';
const OUT = process.argv[2]; const ID = 'pm-m12d1-v2';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errs = [];
const PITCH = { bolaklar: { muammo: "O'yinchilar jamoa yig'olmaydi.", bozor: 'Guruhda 60 kishi.', yechim: "Ilova o'yinni e'lon qiladi.", raqamlar: '51 foydalanuvchi.', jamoa: "Men — g'oya va kod.", keyingi: "Sizdan bitta so'rov: tanishtiring." }, savedAt: Date.now() };
const ochish = async (prog, pitch, w = 1280, h = 820) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.route(/^https?:\/\//, r => r.abort());
  await ctx.addInitScript(([id, pr, pt]) => {
    for (const r of ['mentor', 'learner', 'student', 'self']) { localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('hcOnboarded_' + r, '1'); }
    localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' }));
    localStorage.setItem('ccProgress:' + id, pr);
    if (pt) localStorage.setItem('pm-m12d1-pitch', pt);
  }, [ID, JSON.stringify(prog), pitch ? JSON.stringify(pitch) : null]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + OUT + '/m1201-uz/_p.html'); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(900);
  return p;
};
const nav = (p) => p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b ? { t: b.innerText.trim(), d: b.disabled } : null; });
const log = (x) => console.log(x);
const pr = (screen) => ({ screen, maxReached: screen, answers: {}, earned: [], startedAt: Date.now(), total: 10, savedAt: Date.now() });
const tanlaBashorat = async (p) => { const v = await p.$$('.q-bashorat button'); if (v.length) { await v[0].click(); await p.waitForTimeout(700); } };
const bosQadam = async (p, max = 3) => { for (let i = 0; i < max; i++) { const c = await p.$('.ip-joriy, .ip-son.cur'); if (!c) break; await c.click(); await p.waitForTimeout(3200); } };
// 1) ScreenUch
let p = await ochish(pr(3), null);
log('uch boshida: ' + JSON.stringify(await nav(p)) + ' · chiplar: ' + (await p.$$eval('.ip-uch-strip .q-chip', a => a.map(x => (x.disabled ? '-' : '+') + x.innerText.replace(/\n/g, ' ')).join(' | '))));
for (const nom of ['Bozor', 'Jamoa', 'Keyingi']) {
  await tanlaBashorat(p); await bosQadam(p);
  await p.waitForTimeout(1500);
  const kt = await p.evaluate(() => { const b = [...document.querySelectorAll('.stage-nav button')].pop(); return b && /Keyingi bo/.test(b.innerText) && !b.disabled; }) ? await p.$('.stage-nav button >> nth=-1') : null;
  log(`  ${nom} tugadi: nav=${JSON.stringify(await nav(p))} · keyingi tugma: ${kt ? (await kt.innerText()) : "yo'q"}`);
  await p.screenshot({ path: `${OUT}/m1201-uz/t-uch-${nom}.png` });
  if (kt) { await kt.click(); await p.waitForTimeout(900); }
}
const prog = await p.evaluate((id) => JSON.parse(localStorage.getItem('ccProgress:' + id) || '{}'), ID);
log('uch saqlandi: answers[3] qismlar=' + JSON.stringify(Object.keys((prog.answers[3] || {}).qismlar || {})));
const p1 = await ochish({ ...prog, screen: 3 }, null);
log('uch qayta ochildi: ' + JSON.stringify(await nav(p1)) + ' · chip ok: ' + (await p1.$$('.ip-uch-strip .q-chip.ok')).length);
await p1.click('.ip-uch-strip .q-chip >> nth=0'); await p1.waitForTimeout(800);
log('  Bozor chipi bosildi → xulosa bor: ' + !!(await p1.$('.q-xulosa')));
// 2) ScreenSherik — qoralama yo'q
p = await ochish(pr(6), null);
log("sherik qoralama yo'q: " + JSON.stringify(await nav(p)) + ' · qaytish: ' + !!(await p.$('text=Qoralamaga qaytish')));
// 3) ScreenSherik — qoralama bor
p = await ochish(pr(6), PITCH);
log('sherik boshida: ' + JSON.stringify(await nav(p)) + ' · qatorlar: ' + (await p.$$('.ip-sh-q')).length + ' · chip yopiq: ' + (await p.$eval('.ip-sh-q button', x => x.disabled)));
await p.screenshot({ path: OUT + '/m1201-uz/t-sherik-boshi.png' });
await p.click('text=2 daqiqani boshlash'); await p.waitForTimeout(1300);
log('taymer: ' + (await p.innerText('.ip-sh-tmr')).replace(/\n/g, ' '));
await p.click("text=To'xtatish"); await p.waitForTimeout(400);
log("to'xtagach: " + JSON.stringify(await nav(p)));
const q = await p.$$('.ip-sh-q');
for (let i = 0; i < q.length; i++) { await (await q[i].$(i === 4 ? "text=Javob yo'q" : 'text=Javob bor')).click(); await p.waitForTimeout(120); }
await p.waitForTimeout(700);
log('belgilangach: ' + JSON.stringify(await nav(p)) + ' · xulosa: ' + (await p.innerText('.ip-sh-on .q-xulosa').catch(() => "YO'Q")) + ' · nishon toast: ' + !!(await p.$('.acu-overlay')));
if (await p.$('.acu-overlay')) { await p.click('.acu-overlay'); await p.waitForTimeout(400); }
await p.screenshot({ path: OUT + '/m1201-uz/t-sherik-tugadi.png' });
const prog2 = await p.evaluate((id) => JSON.parse(localStorage.getItem('ccProgress:' + id) || '{}'), ID);
const art = await p.evaluate(() => JSON.parse(localStorage.getItem('pm-m12d1-pitch') || '{}'));
log('saqlandi: earned=' + JSON.stringify(prog2.earned) + ' · answers[6].yoqSoni=' + (prog2.answers[6] || {}).yoqSoni + ' · artefakt sherik=' + JSON.stringify(art.sherik && art.sherik.belgi) + ' · bolaklar saqlandi: ' + !!(art.bolaklar && art.bolaklar.muammo));
const p2 = await ochish({ ...prog2, screen: 6 }, art);
log('sherik qayta ochildi: ' + JSON.stringify(await nav(p2)) + ' · bor/yoq: ' + (await p2.$$('.ip-sh-q.bor')).length + '/' + (await p2.$$('.ip-sh-q.yoq')).length);
const pm = await ochish(pr(6), PITCH, 390, 844);
await pm.screenshot({ path: OUT + '/m1201-uz/t-sherik-390.png', fullPage: true });
log('pageerror: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
await b.close();
