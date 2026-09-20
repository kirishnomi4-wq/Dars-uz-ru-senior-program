#!/usr/bin/env node
// ============================================================
//  smoke-homework — UYGA-VAZIFA paketlarida `onFinished` zanjirini haqiqiy brauzerda isbotlaydi (F-0921-01).
//
//  Nega kerak (foydalanuvchi 21.09): «uyga vazifa topshirilganda onFinished avtomat ketsin — LMS'da ptichka
//  yonib, o'quvchi keyingi darsga o'tsin». Darslar uchun `smoke-onfinished-all` bor edi; uyga-vazifa paketlari
//  (18 fayl) bu tomondan hech qachon tekshirilmagan.
//
//  Ikki holat (har fayl, uz va ru):
//    A «TOPSHIRILGAN» — saqlovda `finished: true` va muhrlangan yuk bor (o'quvchi ilgari topshirgan, endi qayta
//      ochdi): paket ochilishining O'ZIDA `onFinished` AYNAN o'sha yukni yuborishi kerak (LMS ptichkasi yo'qolmasin).
//    B «TOZA» — hech narsa bajarilmagan: `onFinished` KETMASLIGI kerak (bo'sh vazifa topshirilib qolmasin).
//
//  Ishlatish: CHROME=/usr/bin/google-chrome node scripts/smoke-homework.mjs [--lang uz|ru|both] [fayl…]
// ============================================================
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdtempSync, rmSync, readFileSync, globSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const LANGS = opt('--lang', 'both') === 'both' ? ['uz', 'ru'] : [opt('--lang', 'uz')];
const files = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--lang');
const TARGETS = files.length ? files : globSync('src/*/*.homework.jsx').sort();

const RED = '\x1b[31m', GRN = '\x1b[32m', DIM = '\x1b[2m', R = '\x1b[0m';
const TMP = mkdtempSync(join(tmpdir(), 'hw-smoke-'));
process.on('exit', () => rmSync(TMP, { recursive: true, force: true }));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(130));

const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
const rows = [];

for (const file of TARGETS) {
  const src = readFileSync(file, 'utf8');
  const hwId = (/HW_ID\s*=\s*['"]([^'"]+)['"]/.exec(src) || [])[1];
  const hwVer = Number((/HW_VER\s*=\s*(\d+)/.exec(src) || [])[1] || 1);
  const autoFire = /if \(!finished && doneCount >= HW_PASS_MIN\) finish\(\)/.test(src);
  const resend = /if \(finished && typeof onFinished === 'function'\)/.test(src);
  let bundle;
  try {
    const res = await build({
      stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import H from ${JSON.stringify(resolve(file))};
        window.__payloads = []; createRoot(document.getElementById('root')).render(React.createElement(H, { lang: window.__lang || 'uz', onFinished: (p) => { window.__payloads.push(JSON.stringify(p)); } }));`,
        resolveDir: process.cwd(), sourcefile: 'hw.jsx', loader: 'jsx' },
      bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [resolve('node_modules')],
      loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' },
      charset: 'utf8', write: false, logLevel: 'silent',
    });
    bundle = res.outputFiles[0].text;
  } catch (e) {
    rows.push({ file, lang: '—', ok: false, problems: [`esbuild: ${String(e.message).split('\n')[0].slice(0, 140)}`] });
    console.log(`${RED}✗${R} ${basename(file)}: esbuild`); continue;
  }

  const SEALED = { lessonId: hwId, kind: 'homework', done: true, stages: '4/4', place: 'sinov', durationSec: 123 };
  for (const lang of LANGS) {
    const problems = [];
    if (!hwId) problems.push('HW_ID topilmadi');
    if (!autoFire) problems.push('AVTOMAT topshirish ulanmagan (bosqichlar tugaganda finish())');
    if (!resend) problems.push('qayta ochilganda qayta yuborish ulanmagan');

    const run = async (tag, seed) => {
      const page = join(TMP, `${basename(file, '.jsx')}-${lang}-${tag}.html`);
      writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>window.__lang=${JSON.stringify(lang)};localStorage.clear();${seed}<\/script><script>${bundle}<\/script></body></html>`);
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const p = await ctx.newPage();
      const errs = [];
      p.on('pageerror', (e) => errs.push(String(e.message).slice(0, 120)));
      let got = [];
      try {
        await p.goto('file://' + page, { waitUntil: 'domcontentloaded' });
        await p.waitForSelector('.hw-root', { timeout: 15000 });
        await p.waitForTimeout(800);
        got = await p.evaluate(() => window.__payloads);
      } catch (e) { problems.push(`${tag}: ${String(e.message).split('\n')[0].slice(0, 110)}`); }
      if (errs.length) problems.push(`${tag} sahifa xatosi: ${errs[0]}`);
      await ctx.close();
      return got;
    };

    // A — ilgari topshirilgan: ochilishning o'zida muhrlangan yuk qayta ketadi
    const seedA = `localStorage.setItem('ccHomework:${hwId}', JSON.stringify({ v: ${hwVer}, stage: 9, data: {}, finished: true, startedAt: Date.now() - 600000, savedAt: Date.now() }));`
      + `localStorage.setItem('ccHwSeal:${hwId}', ${JSON.stringify(JSON.stringify(SEALED))});`;
    const a = await run('topshirilgan', seedA);
    if (!a.length) problems.push('QAYTA OCHILDI, lekin onFinished KELMADI (LMS ptichkasi tiklanmaydi)');
    else if (a[0] !== JSON.stringify(SEALED)) problems.push(`qayta yuborilgan yuk FARQ qildi: ${a[0].slice(0, 90)}`);
    else if (a.length > 1) problems.push(`bitta ochilishda ${a.length} marta yuborildi`);

    // B — toza: hech narsa yuborilmasligi kerak
    const b = await run('toza', '');
    if (b.length) problems.push(`TOZA holatda ham yuborildi (${b.length} ta) — bo'sh vazifa topshirilib qoladi`);

    const ok = problems.length === 0;
    rows.push({ file, lang, ok, problems });
    console.log(`${ok ? GRN + '✓' : RED + '✗'}${R} ${basename(file, '.jsx')} ${lang}${ok ? ` ${DIM}· qayta yuborish ✓ · toza holatda jim ✓${R}` : ` — ${problems.join(' · ')}`}`);
  }
}

await browser.close();
const bad = rows.filter((r) => !r.ok).length;
console.log(`\n===== ${rows.length - bad}/${rows.length} o'tdi`);
process.exit(bad ? 1 : 0);
