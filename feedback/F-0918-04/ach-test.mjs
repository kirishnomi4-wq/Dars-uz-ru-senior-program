import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const URL = 'http://localhost:5173/#/lesson/m1-01', KEY = 'ccProgress:internet-01-v18', TOTAL = 22;
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errs = []; page.on('pageerror', e => errs.push(String(e))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
const seed = async (o) => { await page.goto('http://localhost:5173/'); await page.evaluate(([k, v]) => { localStorage.clear(); localStorage.setItem(k, JSON.stringify(v)); }, [KEY, { screen: 0, answers: {}, earned: [], total: TOTAL, savedAt: Date.now(), startedAt: Date.now(), ...o }]); await page.goto(URL); await page.reload(); await page.waitForTimeout(1500); await solo(); };
const solo = async () => { const b = await page.$('text=Kodsiz'); if (b) { await b.click(); await page.waitForTimeout(1200); } const t = await page.$('text=O\'tkazib yuborish'); if (t) { await t.click(); await page.waitForTimeout(500); } };
const prog = () => page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), KEY);
const rule = async () => { const el = await page.$('.ach-rule'); return el ? { cls: await el.getAttribute('class'), t: (await el.innerText()).slice(0, 60) } : null; };
const out = (k, v) => console.log(k.padEnd(34), JSON.stringify(v));
const shot = (n) => page.screenshot({ path: `${process.env.S}/ach-${n}.png` });

// ── A: s13b — xato server, keyin to'g'ri
await seed({ screen: 15 });
out('A0 gate/ekran', await page.evaluate(() => ({ title: document.querySelector('.h-title')?.innerText?.slice(0, 50), nodes: document.querySelectorAll('.net-node').length })));
out('A1 qoida (boshida)', await rule());
await shot('A1');
await page.click('.net-node.dns'); await page.waitForTimeout(900);
const ip = await page.evaluate(() => document.querySelector('.net-hud-ip')?.innerText);
const srv = await page.evaluate(() => [...document.querySelectorAll('.net-node.server')].map((b, i) => ({ i, ip: b.querySelector('.net-ip')?.innerText })));
const wrongI = srv.find(s => s.ip !== ip).i, rightI = srv.find(s => s.ip === ip).i;
await (await page.$$('.net-node.server'))[wrongI].click(); await page.waitForTimeout(1300);
out('A2 xato serverdan keyin', await rule());
out('A2 progress.missed', (await prog())?.missed);
await shot('A2');
await page.reload(); await page.waitForTimeout(1500); await solo();
out('A3 F5 dan keyin', await rule());
await page.click('.net-node.dns'); await page.waitForTimeout(900);
const srv2 = await page.evaluate(() => { const ip = document.querySelector('.net-hud-ip')?.innerText; return [...document.querySelectorAll('.net-node.server')].findIndex(b => b.querySelector('.net-ip')?.innerText === ip); });
await (await page.$$('.net-node.server'))[srv2].click(); await page.waitForTimeout(1000);
await page.click('.net-node.screen'); await page.waitForTimeout(1500);
const pA = await prog();
out('A4 yutgach: earned', pA?.earned); out('A4 yutgach: missed', pA?.missed); out('A4 javob yozildi', !!pA?.answers?.[15]);
out('A4 bayram overlay', !!(await page.$('.acu-overlay'))); out('A4 qoida', await rule());

// ── B: s13c — birinchi urinishda to'g'ri
await seed({ screen: 16 });
out('B0 qoida (boshida)', await rule());
const tapChip = async (txt) => { const h = await page.$(`.dd-pool .dd-chip:has-text("${txt}")`); await h.click(); await page.waitForTimeout(250); };
for (const t of ['Brauzer', 'DNS', 'Server', 'Ekran']) await tapChip(t);
await page.waitForTimeout(800);
const pB = await prog();
out('B1 earned', pB?.earned); out('B1 missed', pB?.missed); out('B1 bayram overlay', !!(await page.$('.acu-overlay'))); out('B1 qoida (nishondan keyin)', await rule());
await shot('B1');

// ── C: s13c — xato tartib, keyin tuzatish
await seed({ screen: 16 });
for (const t of ['DNS', 'Brauzer', 'Server', 'Ekran']) await tapChip(t);
await page.waitForTimeout(600);
out('C1 xato tartibdan keyin', await rule()); out('C1 missed', (await prog())?.missed);
await shot('C1');
const slots = await page.$$('.dd-slot .dd-chip.in'); await slots[0].click(); await page.waitForTimeout(250); await (await page.$$('.dd-slot .dd-chip.in'))[0].click(); await page.waitForTimeout(250);
for (const t of ['Brauzer', 'DNS']) await tapChip(t);
await page.waitForTimeout(900);
const pC = await prog();
out('C2 tuzatgach: solved', !!(await page.$('.dd-done'))); out('C2 earned', pC?.earned); out('C2 missed', pC?.missed); out('C2 bayram overlay', !!(await page.$('.acu-overlay')));

// ── D: yakun ekranidagi «Qaytadan» = MASHQ o'tishi: nishonlar muzlaydi, birinchi o'tish muhrlanadi
const Q = (scr, picked, correctIndex) => ({ stage: 'module-mikro', screenIdx: scr, question: 'q' + scr, options: ['a', 'b', 'c', 'd'], correctIndex, correctAnswer: 'x', picked, studentAnswerIndex: picked, studentAnswer: 'y', correct: picked === correctIndex, firstAttemptCorrect: picked === correctIndex, solved: true, lastPicked: picked });
const firstAnswers = { 4: Q(4, 0, 1), 6: Q(6, 2, 2) }; // birinchi o'tish: s4 XATO (firstwin olinmagan), s5b to'g'ri
const HARNESS = '/feedback/F-0918-04/harness.jsx';
const remount = async () => { await page.goto('http://localhost:5173/'); await page.evaluate(async (h) => { const m = await import(h); m.mount(); }, HARNESS); await page.waitForTimeout(1800); await solo(); };
const patchProg = (o) => page.evaluate(([k, o]) => { const p = JSON.parse(localStorage.getItem(k)); Object.assign(p, o); localStorage.setItem(k, JSON.stringify(p)); }, [KEY, o]);
await page.goto('http://localhost:5173/');
await page.evaluate(([k, v]) => { localStorage.clear(); localStorage.setItem(k, JSON.stringify(v)); }, [KEY, { screen: 21, answers: firstAnswers, earned: ['graduate'], missed: ['s13c'], total: TOTAL, savedAt: Date.now(), startedAt: Date.now() - 600000 }]);
await remount();
const btn = await page.$('button:has-text("Qaytadan")'); out('D0 Qaytadan tugmasi', !!btn);
await btn.click(); await page.waitForTimeout(1200);
let pD = await prog();
out('D1 screen / earned / missed', [pD?.screen, pD?.earned, pD?.missed]);
out('D1 firstPass muhrlandi (javob kalitlari)', Object.keys(pD?.firstPass?.answers || {}));
out('D1 firstPass.durationSec', pD?.firstPass?.durationSec);

// ── E: mashq-o'tishida TEST nishoni ham berilmaydi (s4 → firstwin), qoida-qatori ko'rinmaydi
await patchProg({ screen: 4 }); await remount();
const opt = await page.$('button:has-text("Brauzer")'); out('E0 s4 varianti topildi', !!opt);
await opt.click(); await page.waitForTimeout(1200);
pD = await prog();
out('E1 mashqda togri javob: answers[4].correct', pD?.answers?.[4]?.correct);
out('E1 earned (ozgarmasligi kerak)', pD?.earned);
out('E1 bayram overlay', !!(await page.$('.acu-overlay')));
await patchProg({ screen: 16 }); await remount();
out('E2 mashqda s13c qoida-qatori', await rule());

// ── F: mashqdan keyin «Darsni yakunlash» → onFinished BIRINCHI o'tishni yuboradi
await patchProg({ screen: 21 }); await remount();
await page.click('button:has-text("Darsni yakunlash")'); await page.waitForTimeout(900);
await shot('F0');
const finBtns = await page.evaluate(() => [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(Boolean).slice(-6));
out('F0 tugmalar (modal)', finBtns);
await page.click('button:has-text("Tamom")'); await page.waitForTimeout(1200);
const fin = await page.evaluate(() => window.__fin.map(p => ({ correctAnswers: p.correctAnswers, totalQuestions: p.totalQuestions, durationSec: p.durationSec, picked4: (p.answers.find(a => a.screenIdx === 4) || {}).picked, correct4: (p.answers.find(a => a.screenIdx === 4) || {}).correct, ach: (p.achievements || []).map(a => a.id) })));
out('F1 onFinished soni', fin.length);
out('F1 payload', fin[0]);
out('XATOLAR (console/pageerror)', errs.slice(0, 6));
await browser.close();
