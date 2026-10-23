// Uyga vazifa rasmlari: rasm-manba/*.html → rasm/*.png (Chrome, 2x). Ishlatish: node vositalar/rasm.mjs [nom ...]
// Maxsus: 2-1-q5 — haqiqiy Chrome'da xato domen (coddycmp.uz) oynasi.
import { chromium } from '../../node_modules/playwright-core/index.mjs';
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// TIL=ru — rasm-manba/ru/*.html → rasm/ru/*.png (faqat matnli rasmlar; 2-1-q5 va assets tilga bog'liq emas)
const RU = process.env.TIL === 'ru';
const MANBA = path.join(ROOT, 'rasm-manba', RU ? 'ru' : ''), CHIQ = path.join(ROOT, 'rasm', RU ? 'ru' : '');
fs.mkdirSync(CHIQ, { recursive: true });
const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const tanlov = process.argv.slice(2);
const b = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const ctx = await b.newContext({ deviceScaleFactor: 2, viewport: { width: 1100, height: 900 } });
const p = await ctx.newPage();
const fayllar = fs.readdirSync(MANBA).filter(f => f.endsWith('.html') && !f.startsWith('_')).filter(f => !tanlov.length || tanlov.includes(f.replace('.html', '')));
for (const f of fayllar) {
  await p.goto('file://' + path.join(MANBA, f));
  await p.waitForLoadState('networkidle').catch(() => {});
  await p.evaluate(() => document.fonts.ready);
  const el = await p.$('#rasm');
  const out = f.startsWith('assets-') ? path.join(CHIQ, 'assets', f.replace('assets-','').replace('.html','.png')) : path.join(CHIQ, f.replace('.html', '.png'));
  await el.screenshot({ path: out });
  console.log('✓', path.basename(out));
}
if (!RU && (!tanlov.length || tanlov.includes('2-1-q5'))) {
  const p2 = await ctx.newPage();
  await p2.setViewportSize({ width: 820, height: 520 });
  await p2.goto('http://coddycmp.uz').catch(e => console.log('  (kutilgan xato):', e.message.split('\n')[0]));
  await p2.waitForTimeout(1200);
  await p2.screenshot({ path: path.join(CHIQ, '2-1-q5.png'), clip: { x: 0, y: 40, width: 820, height: 250 } });
  console.log('✓ 2-1-q5.png (Chrome xato sahifasi, haqiqiy)');
}
await b.close();
