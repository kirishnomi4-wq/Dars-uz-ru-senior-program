import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const KEY = 'ccProgress:internet-01-v18', TOTAL = 22, HARNESS = '/feedback/F-0918-04/harness.jsx';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const errs = []; page.on('pageerror', e => errs.push(String(e))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
const out = (k, v) => console.log(k.padEnd(44), JSON.stringify(v));
const solo = async () => { const b = await page.$('text=Kodsiz'); if (b) { await b.click(); await page.waitForTimeout(1200); } const t = await page.$("text=O'tkazib yuborish"); if (t) { await t.click(); await page.waitForTimeout(500); } };
const Q = (scr, picked, ci) => ({ stage: 'module-mikro', screenIdx: scr, question: 'q' + scr, options: ['a', 'b', 'c', 'd'], correctIndex: ci, correctAnswer: 'x', picked, studentAnswerIndex: picked, studentAnswer: 'y', correct: picked === ci, firstAttemptCorrect: picked === ci, solved: true, lastPicked: picked });
const START = Date.now() - 600000;
const seedAndMount = async () => {
  await page.goto('http://localhost:5173/');
  await page.evaluate(([k, v]) => { localStorage.clear(); localStorage.setItem(k, JSON.stringify(v)); }, [KEY, { screen: 21, answers: { 4: Q(4, 1, 1), 6: Q(6, 2, 2) }, earned: ['graduate', 'firstwin'], total: TOTAL, savedAt: Date.now(), startedAt: START }]);
  await page.evaluate(async (h) => { const m = await import(h); m.mount(); }, HARNESS); await page.waitForTimeout(1800); await solo();
};
const finish = async () => { await page.click('button:has-text("Darsni yakunlash")'); await page.waitForTimeout(700); await page.click('button:has-text("Tamom")'); await page.waitForTimeout(900); };
const fins = () => page.evaluate(() => window.__fin.map(p => JSON.stringify(p)));

// S1: bitta ochilishda «Tamom» uch marta: (a) birinchi, (b) 4 soniyadan keyin oyna yopilmasdan, (c) oyna ✕ bilan yopilib qayta ochilgach
await seedAndMount();
await page.click('button:has-text("Darsni yakunlash")'); await page.waitForTimeout(700);
await page.click('button:has-text("Tamom")'); await page.waitForTimeout(900);
out('S1 «Tamom»dan keyin oyna ochiq qoladi', !!(await page.$('.fin-backdrop')));
await page.waitForTimeout(4000);
await page.click('button:has-text("Tamom")'); await page.waitForTimeout(900);
await page.click('.fin-x'); await page.waitForTimeout(500);
await page.waitForTimeout(2000);
await page.click('button:has-text("Darsni yakunlash")'); await page.waitForTimeout(700);
await page.click('button:has-text("Tamom")'); await page.waitForTimeout(900);
let f = await fins();
out('S1 onFinished soni (3 kutiladi)', f.length);
out('S1 uchala yuk HARFMA-HARF teng', f[0] === f[1] && f[1] === f[2]);
const p0 = JSON.parse(f[0]);
out('S1 yuk: durationSec / correct / savollar / nishonlar', [p0.durationSec, p0.correctAnswers, (p0.questions || []).length, (p0.achievements || []).map(a => a.id)]);
out('S1 yuk hajmi (bayt)', f[0].length);

// S2 (nazorat): dars QAYTA ochilsa muhr toza — yangi yuk yig'iladi va u tabiiy ravishda FARQ qiladi
await page.waitForTimeout(1500);
await seedAndMount();
await finish();
const g = await fins();
const p1 = JSON.parse(g[0]);
out('S2 qayta ochilgach yuk eskisidan farq qiladi', g[0] !== f[0]);
out('S2 durationSec: avval → keyin', [p0.durationSec, p1.durationSec]);

out('KONSOL XATOLARI', errs.slice(0, 6));
await browser.close();
