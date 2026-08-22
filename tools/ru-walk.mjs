#!/usr/bin/env node
// ============================================================================
// RU-WALK — darsni haqiqiy brauzerda ikkala tilda ekranma-ekran ochadi.
//
//   node tools/ru-walk.mjs <lesson.jsx> [--shots] [--langs=uz,ru] [--screens=0-5] [--wait=700] [--keep]
//
// Tekshiradi:  (a) har ekran × har til: pageerror / console.error yo'q, .lesson-root chizildi,
//                  ccProgress orqali so'ralgan ekran haqiqatan ochildi;
//              (b) RU rejimda ko'rinadigan o'zbekcha qoldiq (apostrofli so'zlar + tez-tez
//                  uchraydigan UZ so'zlar; lotin atamalar istisno);
//              (c) UZ rejimda kirill qoldig'i (ma'lumot uchun).
// Dev-server ISHLATILMAYDI: dars esbuild bilan React bilan birga bitta IIFE ga yig'iladi
// va scratchpad'dagi index.html `file://` orqali ochiladi. Ekran-tanlov — dars o'zi o'qiydigan
// localStorage kalitlari (`liveSession:<id>` = self, `ccProgress:<id>` = {screen,total,…}).
// Ekranlar o'zaro bog'liq bo'lsa (oldingi javob kerak) — faqat ochilishi va xatosizligi tekshiriladi.
//
// Chiqish kodi: 0 = toza · 1 = xato (crash/bo'sh ekran/yuklanmadi) · 2 = faqat qoldiq · 3 = argument
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { resolve, basename, join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';
import { chromium } from 'playwright-core';
import { UZ_COMMON, UZ_APOS } from './ru-gate.mjs';

const RED = '\x1b[31m', GRN = '\x1b[32m', YEL = '\x1b[33m', DIM = '\x1b[2m', B = '\x1b[1m', R = '\x1b[0m';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SCRATCH = process.env.CLAUDE_SCRATCHPAD || 'C:/Users/ADMIN/AppData/Local/Temp/claude/C--Users-ADMIN-internetLesson/f6d85fef-7d77-4277-bd6e-f299f2bb9664/scratchpad';

// Lotin atamalar — RU rejimda ham lotincha qoladi, qoldiq emas
const LATIN_TERMS = new Set(('product user story json express postgresql postgres react node nodejs html css js jsx vs code vscode git github vercel api url http https ' +
  'mentor codestrike coddycamp telegram bot jwt sql nosql mongodb supabase localstorage usestate useeffect props state npm npx vite pm mvp okr kpi jtbd ' +
  'avtoijara maydoncha bandqilish figma notion trello jira slack zoom google chrome ok id pin demo day sprint backlog roadmap persona funnel pitch ' +
  'frontend backend fullstack rest crud get post put delete fetch async await const let var function return import export default true false null').split(/\s+/));

function arg(opts, k, d) { return opts[k] === undefined ? d : opts[k]; }

function parseMeta(src) {
  const idM = /lessonId\s*:\s*['"]([^'"]+)['"]/.exec(src);
  const lessonId = idM ? idM[1] : null;
  let total = null;
  const sm = /const\s+SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src);
  if (sm) total = (sm[1].match(/\{\s*id\s*:/g) || []).length;
  if (!total) { const sc = /const\s+screens\s*=\s*\[([^\]]*)\]/.exec(src); if (sc) total = sc[1].split(',').map(s => s.trim()).filter(Boolean).length; }
  const nameM = /export\s+default\s+function\s+(\w+)/.exec(src);
  return { lessonId, total, name: nameM ? nameM[1] : 'Lesson' };
}

async function bundle(lessonPath, outDir) {
  const entry = join(outDir, 'entry.jsx');
  const lessonUrl = lessonPath.replace(/\\/g, '/');
  writeFileSync(entry, `import React from 'react';
import { createRoot } from 'react-dom/client';
import Lesson from ${JSON.stringify(lessonUrl)};
const q = new URLSearchParams(location.search);
const lang = q.get('lang') || 'uz';
const s = Number(q.get('s') || 0);
const id = q.get('id') || '';
const total = Number(q.get('total') || 0);
try {
  localStorage.setItem('liveSession:' + id, '{"mode":"self"}');
  localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: s, answers: {}, earned: [], startedAt: Date.now(), total, savedAt: Date.now() }));
  localStorage.setItem('cc_lang', lang);
} catch {}
window.__RUWALK = { lang, s, id };
createRoot(document.getElementById('root')).render(React.createElement(Lesson, { lang }));
`);
  const outfile = join(outDir, 'bundle.js');
  await esbuild.build({
    entryPoints: [entry], bundle: true, outfile, format: 'iife', platform: 'browser', target: 'es2020',
    jsx: 'automatic', logLevel: 'silent', charset: 'utf8',
    loader: { '.jsx': 'jsx', '.js': 'jsx', '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.gif': 'dataurl', '.webp': 'dataurl', '.mp3': 'dataurl', '.woff': 'dataurl', '.woff2': 'dataurl' },
    define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.MODE': '"production"', 'import.meta.env.DEV': 'false', 'import.meta.env.PROD': 'true' },
    absWorkingDir: ROOT, nodePaths: [join(ROOT, 'node_modules')],
  });
  const css = existsSync(join(outDir, 'bundle.css')) ? '<link rel="stylesheet" href="bundle.css">' : '';
  const html = join(outDir, 'index.html');
  writeFileSync(html, `<!doctype html><html lang="uz"><head><meta charset="utf-8"><title>ru-walk</title>${css}</head><body><div id="root"></div><script src="bundle.js"></script></body></html>`);
  return html;
}

const tokenize = (t) => (t.match(/[A-Za-z\u0400-\u04FF\u02BB'‘’`][A-Za-z0-9\u0400-\u04FF\u02BB'‘’`-]*/g) || []);
function uzResidue(text) {
  const hits = new Map();
  for (const w of tokenize(text)) {
    if (!/[A-Za-z]/.test(w)) continue;
    const lw = w.toLowerCase().replace(/[ʻ‘’`]/g, "'").replace(/^'+|'+$/g, '');
    if (LATIN_TERMS.has(lw.replace(/'/g, ''))) continue;
    if (UZ_APOS.test(w) || UZ_COMMON.has(lw)) hits.set(lw, (hits.get(lw) || 0) + 1);
  }
  return [...hits.keys()];
}
function ruResidue(text) { // UZ rejimda kirill so'zlar (ma'lumot)
  return [...new Set((text.match(/[\u0400-\u04FF]{2,}[\u0400-\u04FF-]*/g) || []).map(w => w.toLowerCase()))];
}

async function main() {
  const argv = process.argv.slice(2);
  const files = argv.filter(a => !a.startsWith('--'));
  const opts = Object.fromEntries(argv.filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
  if (files.length !== 1) { console.error('Ishlatish: node tools/ru-walk.mjs <lesson.jsx> [--shots] [--langs=uz,ru] [--screens=0-5] [--wait=700] [--keep]'); process.exit(3); }
  const lessonPath = resolve(files[0]);
  if (!existsSync(lessonPath)) { console.error(`${RED}Fayl topilmadi:${R} ${lessonPath}`); process.exit(3); }
  if (!existsSync(CHROME)) { console.error(`${RED}Chrome topilmadi:${R} ${CHROME} (CHROME_PATH bilan ko'rsating)`); process.exit(3); }

  const src = readFileSync(lessonPath, 'utf8');
  const meta = parseMeta(src);
  if (!meta.lessonId || !meta.total) { console.error(`${RED}LESSON_META.lessonId yoki SCREEN_META topilmadi${R} (lessonId=${meta.lessonId}, total=${meta.total})`); process.exit(3); }
  const langs = String(arg(opts, 'langs', 'uz,ru')).split(',').map(s => s.trim()).filter(Boolean);
  let screens = [...Array(meta.total).keys()];
  if (opts.screens) { const [a, b] = String(opts.screens).split('-').map(Number); screens = screens.filter(i => i >= a && i <= (Number.isFinite(b) ? b : a)); }
  const waitMs = Number(arg(opts, 'wait', 700));
  const name = basename(lessonPath, '.jsx');
  const outDir = join(SCRATCH, 'ru-walk', name);
  mkdirSync(outDir, { recursive: true });

  console.log(`${B}RU-WALK${R} · ${DIM}${lessonPath}${R}\n  lessonId=${B}${meta.lessonId}${R} · ekranlar=${B}${meta.total}${R} · tillar=${langs.join('/')} · chiqish: ${DIM}${outDir}${R}`);
  const t0 = Date.now();
  let html;
  try { html = await bundle(lessonPath, outDir); }
  catch (e) { console.error(`${RED}🔴 esbuild bundle xatosi:${R}\n` + (e.errors || []).map(x => `  ${x.location?.file}:${x.location?.line}:${x.location?.column} ${x.text}`).join('\n') || e.message); process.exit(1); }
  console.log(`${DIM}  bundle tayyor (${((Date.now() - t0) / 1000).toFixed(1)}s)${R}`);

  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const results = {}; // results[lang][screen] = { ok, errs, chars, uzRes, ruRes, progressScreen, cyr }
  for (const lang of langs) {
    results[lang] = {};
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: lang === 'ru' ? 'ru-RU' : 'uz-UZ' });
    const page = await ctx.newPage();
    let errs = [];
    page.on('pageerror', e => errs.push('pageerror: ' + String(e.message).slice(0, 140)));
    page.on('console', m => { if (m.type() === 'error') { const t = m.text(); if (!/favicon|Download the React|Failed to load resource|net::ERR|preload|ERR_FILE_NOT_FOUND/i.test(t)) errs.push('console: ' + t.slice(0, 140)); } });
    for (const s of screens) {
      errs = [];
      const url = pathToFileURL(html).href + `?lang=${lang}&s=${s}&id=${encodeURIComponent(meta.lessonId)}&total=${meta.total}`;
      const r = { ok: false, errs: [], chars: 0, uzRes: [], ruRes: [], progressScreen: null, cyr: 0 };
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 20000 });
        await page.waitForSelector('.lesson-root', { timeout: 15000 });
        await page.waitForTimeout(waitMs);
        const info = await page.evaluate((id) => {
          const root = document.querySelector('.lesson-root') || document.body;
          const text = root.innerText || '';
          let ps = null; try { ps = JSON.parse(localStorage.getItem('ccProgress:' + id) || 'null')?.screen ?? null; } catch {}
          return { text, ps };
        }, meta.lessonId);
        r.chars = info.text.trim().length; r.progressScreen = info.ps;
        r.ok = r.chars > 20;
        r.cyr = (info.text.match(/[\u0400-\u04FF]/g) || []).length;
        if (lang === 'ru') r.uzRes = uzResidue(info.text); else r.ruRes = ruResidue(info.text);
        if (opts.shots) await page.screenshot({ path: join(outDir, `${lang}-s${String(s).padStart(2, '0')}.png`), fullPage: true });
      } catch (e) { errs.push('YUKLANMADI: ' + String(e.message).split('\n')[0].slice(0, 120)); }
      r.errs = [...new Set(errs)];
      results[lang][s] = r;
      process.stdout.write(`\r  ${lang} s${s} ${r.ok ? 'ok' : 'XATO'}${r.errs.length ? ' ⚠' : ''}    `);
    }
    await ctx.close();
  }
  await browser.close();
  if (!opts.keep) { try { rmSync(join(outDir, 'entry.jsx')); } catch {} }
  process.stdout.write('\r' + ' '.repeat(40) + '\r');

  // ---- jadval
  let nErr = 0, nRes = 0, nMismatch = 0;
  const cell = (lang, s) => {
    const r = results[lang]?.[s]; if (!r) return DIM + '—' + R;
    if (!r.ok || r.errs.length) { nErr++; return `${RED}XATO${R} ${r.errs[0] ? DIM + r.errs[0].slice(0, 60) + R : (r.ok ? '' : DIM + 'bo\'sh ekran' + R)}`; }
    let out = `${GRN}ok${R} ${DIM}${r.chars}b${R}`;
    if (r.progressScreen !== null && r.progressScreen !== s) { nMismatch++; out += ` ${YEL}ekran≠(${r.progressScreen})${R}`; }
    if (lang === 'ru') {
      if (r.cyr === 0) { nRes++; out += ` ${RED}kirill yo'q${R}`; }
      if (r.uzRes.length) { nRes++; out += ` ${YEL}qoldiq:${R} ${r.uzRes.slice(0, 8).join(', ')}${r.uzRes.length > 8 ? ` +${r.uzRes.length - 8}` : ''}`; }
    } else if (r.ruRes.length) out += ` ${DIM}kirill: ${r.ruRes.slice(0, 5).join(', ')}${R}`;
    return out;
  };
  console.log(`\n${B}ekran${R}  ${langs.map(l => B + l.padEnd(44) + R).join('')}`);
  for (const s of screens) {
    const cells = langs.map(l => cell(l, s));
    if (langs.length === 1) console.log(`s${String(s).padEnd(5)} ${cells[0]}`);
    else { console.log(`s${String(s).padEnd(5)} ${cells[0]}`); for (let k = 1; k < cells.length; k++) console.log(`       ${DIM}${langs[k]}:${R} ${cells[k]}`); }
  }
  // to'liq xato-ro'yxati
  const allErrs = [];
  for (const l of langs) for (const s of screens) for (const e of results[l][s].errs) allErrs.push(`${l} s${s}: ${e}`);
  if (allErrs.length) { console.log(`\n${RED}${B}XATOLAR (${allErrs.length})${R}`); for (const e of [...new Set(allErrs)]) console.log('  ' + e); }
  const ruAll = new Map();
  if (results.ru) for (const s of screens) for (const w of results.ru[s].uzRes) ruAll.set(w, [...(ruAll.get(w) || []), 's' + s]);
  if (ruAll.size) { console.log(`\n${YEL}${B}RU-QOLDIQ SO'ZLAR (${ruAll.size})${R}`); for (const [w, ss] of [...ruAll].sort((a, b) => b[1].length - a[1].length).slice(0, 40)) console.log(`  ${w.padEnd(18)} ${DIM}${ss.join(' ')}${R}`); }

  const total = screens.length * langs.length;
  const verdict = nErr ? `${RED}🔴 XATO (${nErr}/${total} ekran)` : ruAll.size || nRes ? `${YEL}⚠ QOLDIQ (${ruAll.size} so'z)` : `${GRN}✓ TOZA`;
  console.log(`\n${B}XULOSA:${R} ${verdict}${R} · ${total} yuklash (${screens.length} ekran × ${langs.length} til) · ${((Date.now() - t0) / 1000).toFixed(1)}s${nMismatch ? ` · ${YEL}ekran-nomuvofiqlik ${nMismatch}${R}` : ''}${opts.shots ? ` · screenshotlar: ${outDir}` : ''}`);
  process.exit(nErr ? 1 : (ruAll.size || nRes) ? 2 : 0);
}

main().catch(e => { console.error(e); process.exit(3); });
