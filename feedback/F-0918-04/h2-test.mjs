import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const URL = 'http://localhost:5173/#/lesson/m1-04', KEY = 'ccProgress:html-02-v16', TOTAL = 19;
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errs = []; page.on('pageerror', e => errs.push(String(e))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
const solo = async () => { const b = await page.$('text=Kodsiz'); if (b) { await b.click(); await page.waitForTimeout(1200); } const t = await page.$("text=O'tkazib yuborish"); if (t) { await t.click(); await page.waitForTimeout(500); } };
const seed = async (o) => { await page.goto('http://localhost:5173/'); await page.evaluate(([k, v]) => { localStorage.clear(); localStorage.setItem(k, JSON.stringify(v)); }, [KEY, { screen: 0, answers: {}, earned: [], total: TOTAL, savedAt: Date.now(), startedAt: Date.now(), ...o }]); await page.goto(URL); await page.reload(); await page.waitForTimeout(1500); await solo(); };
const prog = () => page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), KEY);
const title = () => page.evaluate(() => (document.querySelector('.h-title, .h-ask')?.innerText || '').slice(0, 60));
const out = (k, v) => console.log(k.padEnd(40), JSON.stringify(v));

// A: s5 kashfiyot — 3 bo'lim bosiladi, nishon BERILMASLIGI kerak
await seed({ screen: 5 });
out('A0 ekran', await title());
for (const k of ['header', 'main', 'footer']) { await page.click(`.szone-${k}`); await page.waitForTimeout(500); }
await page.waitForTimeout(800);
let p = await prog();
out('A1 s5 javob yozildi', !!p?.answers?.[5]); out('A1 earned (struktura YO\'Q kutiladi)', p?.earned); out('A1 bayram overlay', !!(await page.$('.acu-overlay')));
await page.screenshot({ path: `${process.env.S}/h2-A.png` });

// B: s5b test — birinchi urinishda to'g'ri → nishon
await seed({ screen: 6 });
out('B0 ekran', await title());
await page.click('button:has-text("<header>")'); await page.waitForTimeout(1200);
p = await prog();
out('B1 earned (struktura BOR kutiladi)', p?.earned); out('B1 bayram overlay', !!(await page.$('.acu-overlay')));
out('B1 bayramdagi tavsif', await page.evaluate(() => (document.querySelector('.acu-overlay')?.innerText || '').replace(/\n+/g, ' | ').slice(0, 120)));
await page.screenshot({ path: `${process.env.S}/h2-B.png` });

// C: s5b test — avval xato, keyin to'g'ri → nishon YO'Q
await seed({ screen: 6 });
await page.click('button:has-text("<footer>")'); await page.waitForTimeout(1200);
await page.click('button:has-text("<header>")'); await page.waitForTimeout(1200);
p = await prog();
out('C1 earned (struktura YO\'Q kutiladi)', p?.earned); out('C1 javob: correct/solved', { correct: p?.answers?.[6]?.correct, solved: p?.answers?.[6]?.solved }); out('C1 bayram overlay', !!(await page.$('.acu-overlay')));

// D: s7 forma — bonus o'z joyida ishlaydi (regress tekshiruvi)
await seed({ screen: 8 });
out('D0 ekran', await title());
const inp = await page.$('form input, input[type="text"]'); await inp.fill('Ali'); await page.keyboard.press('Enter'); await page.waitForTimeout(1200);
p = await prog();
out('D1 earned (forma BOR kutiladi)', p?.earned);

out('KONSOL XATOLARI', errs);
await browser.close();
