// Bitta darsning HAR ekranini skrinshotga oladi (TMI ko'zdan kechirish uchun).
// Naqsh: _clip-audit.mjs — ccProgress'ga ekran raqami yoziladi va sahifa qayta yuklanadi.
import { chromium } from 'playwright-core';
import { mkdirSync, readFileSync } from 'node:fs';
const LESSON_IDS = readFileSync('_lessonids.txt', 'utf8').split('\n').map(s => s.trim()).filter(Boolean);

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://localhost:5173';
const KEY = process.argv[2] || 'm2-10';
const OUT = process.argv[3];
const VW = 1280, VH = 773;

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
await ctx.addInitScript((ids) => {
  try { ids.forEach(id => localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' }))); } catch {}
}, LESSON_IDS);
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', e => errs.push(String(e.message).slice(0, 80)));

await page.goto(`${BASE}/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
await page.waitForSelector('.lesson-root', { timeout: 15000 });
await page.waitForTimeout(600);

let info = await page.evaluate(() => {
  let total = 0;
  const all = [...(document.querySelector('.lesson-root')?.innerText || '').matchAll(/(\d+)\s*\/\s*(\d+)/g)];
  if (all.length) total = Math.max(...all.map(x => +x[2]));
  let lid = null;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('ccProgress:')) { lid = k.slice(11); break; }
  }
  return { total, lid };
});
if (!info.lid) {
  await page.getByRole('button', { name: /Davom etish|Boshlaymiz/ }).first().click({ timeout: 2000 }).catch(() => {});
  await page.waitForTimeout(500);
  info = await page.evaluate(() => {
    let total = 0;
    const all = [...(document.querySelector('.lesson-root')?.innerText || '').matchAll(/(\d+)\s*\/\s*(\d+)/g)];
    if (all.length) total = Math.max(...all.map(x => +x[2]));
    let lid = null;
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ccProgress:')) { lid = k.slice(11); break; } }
    return { total, lid };
  });
}
const total = info.total || 1;
console.log('lessonId=' + info.lid + ' ekranlar=' + total);

for (let s = 0; s < total; s++) {
  await page.evaluate(([id, sc, tt]) => {
    localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: sc, answers: {}, earned: [], startedAt: Date.now(), total: tt, savedAt: Date.now() }));
  }, [info.lid, s, total]);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.lesson-root', { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(700);
  const txtLen = await page.evaluate(() => (document.querySelector('.screen')?.innerText || '').replace(/\s+/g, ' ').trim().length);
  await page.screenshot({ path: `${OUT}/s${String(s).padStart(2, '0')}.png` });
  console.log('  s' + String(s).padStart(2, '0') + '  ekran-matni: ' + txtLen + ' belgi');
}
if (errs.length) console.log('SAHIFA XATOLARI: ' + [...new Set(errs)].join(' | '));
await browser.close();
