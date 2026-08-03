// _smoke.mjs — HAR DARSNI BRAUZERDA OCHIB, ishga-tushish xatosini tekshiradi.
// esbuild/vite faqat sintaksisni ko'radi; `tr is not defined` kabi xatolar faqat shu yerda chiqadi.
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';

const NL = String.fromCharCode(10);
const app = readFileSync('src/App.jsx', 'utf8');
const KEYS = [...app.matchAll(/key: '([a-z0-9-]+)'/g)].map(m => m[1]);
const IDS = readFileSync('_lessonids.txt', 'utf8').split(NL).map(s => s.trim()).filter(Boolean);

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });

async function one(key) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 773 } });
  await ctx.addInitScript((ids) => ids.forEach(x => localStorage.setItem('liveSession:' + x, '{"mode":"self"}')), IDS);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 70)));
  page.on('console', m => { if (m.type() === 'error') { const t = m.text(); if (!/favicon|Download the React|Failed to load resource|net::ERR|preload/i.test(t)) errs.push(t.slice(0, 70)); } });
  let ok = false;
  try {
    await page.goto('http://localhost:5300/#/lesson/' + key, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForSelector('.lesson-root', { timeout: 20000 });
    await page.waitForTimeout(500);
    ok = await page.evaluate(() => (document.querySelector('.lesson-root')?.innerText || '').trim().length > 20);
  } catch (e) { errs.push('YUKLANMADI: ' + String(e.message).slice(0, 40)); }
  await ctx.close();
  return { key, ok, errs: [...new Set(errs)] };
}

const bad = [];
for (let i = 0; i < KEYS.length; i += 6) {
  const r = await Promise.all(KEYS.slice(i, i + 6).map(one));
  for (const x of r) if (!x.ok || x.errs.length) bad.push(x);
  process.stdout.write(`[${Math.min(i + 6, KEYS.length)}/${KEYS.length}] nuqsonli: ${bad.length}${NL}`);
}
await browser.close();

console.log(NL + '===== SMOKE NATIJA =====');
console.log(`tekshirildi: ${KEYS.length} · nuqsonli: ${bad.length}`);
for (const x of bad) console.log(`  🔴 ${x.key}${x.ok ? '' : ' (bo\'sh ekran)'} ${x.errs.join(' | ')}`);
process.exit(bad.length ? 1 : 0);
