// E holati: mashq-o'tishida (firstPass muhrlangan) test savoliga TO'G'RI javob → nishon BERILMAYDI, bayram yo'q.
// Nazorat: xuddi shu savol oddiy o'tishda (firstPass yo'q) → nishon BERILADI (sinov haqiqatan ham farqni ko'radi).
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const CASES = [
  { name: 'GitLesson', url: '#/lesson/m1-09', key: 'ccProgress:git-github-v19', total: 18, scr: 4, keyIdx: 1, ach: 'quizace' },
  { name: 'AgentArchitecture', url: '#/lesson/m6-04', key: 'ccProgress:agent-arch-06-04-v18', total: 20, scr: 4, keyIdx: 1, ach: 'theAgent' },
];
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const out = (k, v) => console.log(k.padEnd(52), JSON.stringify(v));
for (const C of CASES) for (const practice of [false, true]) {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)); });
  await page.goto('http://localhost:5173/');
  const prog = { screen: C.scr, answers: {}, earned: [], total: C.total, savedAt: Date.now(), startedAt: Date.now() - 60000, ...(practice ? { firstPass: { answers: { [C.scr]: { correct: false, picked: 0, solved: true } }, durationSec: 321 } } : {}) };
  await page.evaluate(([k, v]) => { localStorage.clear(); for (const r of ['mentor', 'learner', 'student', 'self']) localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem(k, JSON.stringify(v)); }, [C.key, prog]);
  await page.goto('http://localhost:5173/' + C.url); await page.reload(); await page.waitForTimeout(1600);
  const b = await page.$('text=Kodsiz'); if (b) { await b.click(); await page.waitForTimeout(1200); }
  const t = await page.$("text=O'tkazib yuborish"); if (t) { await t.click(); await page.waitForTimeout(500); }
  const opts = await page.$$('.lesson-root button.opt, .lesson-root .options button, .lesson-root button[class*="opt"]');
  let clicked = false;
  if (opts.length > C.keyIdx) { await opts[C.keyIdx].click(); clicked = true; await page.waitForTimeout(1300); }
  const p = await page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), C.key);
  out(`${C.name} · ${practice ? 'MASHQ' : 'oddiy'} · variant bosildi (${opts.length} ta)`, clicked);
  out(`${C.name} · ${practice ? 'MASHQ' : 'oddiy'} · javob correct`, p?.answers?.[C.scr]?.correct);
  out(`${C.name} · ${practice ? 'MASHQ → nishon YO\'Q kutiladi' : 'oddiy → nishon BOR kutiladi'}`, { earned: p?.earned, bayram: !!(await page.$('.acu-overlay')) });
  if (errs.length) out(`${C.name} XATOLAR`, errs.slice(0, 4));
  await page.close();
}
await browser.close();
