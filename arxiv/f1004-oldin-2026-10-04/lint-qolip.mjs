#!/usr/bin/env node
// ============================================================================
// LINT-QOLIP — QA fidbekidan chiqqan qolip-xatolari darvozasi (F-1003, 2026-10-03).
//
// Nega kerak. 5-Modul QA (03.10) bir xil sinfdagi xatolarni bir necha darsda topdi;
// har biri boshqa modullarda ham bor edi (39, 109, 24 fayl). esbuild/jsx/til ularni
// ko'rmaydi — kod to'g'ri, lekin o'quvchi ko'radigan natija buzuq. Har qoida bitta
// qonun bilan juft (DARS_ETALON 174–178) va tuzatilgan holatga qaytishni to'xtatadi.
//
// QOIDALAR (hammasi error):
//   q1 ekran-markaz   — `.screen` vertikal markazda (justifyContent: 'center') → kontent o'rtaga tushadi (174)
//   q2 bir-qator      — `reflect-input` matn maydoni `<input>` → uzun javob yon tomonga ketadi (175)
//   q3 qulfsiz        — ScreenLivePractice «Bajardim» qadamlarni sanamaydi (176)
//   q4 yakun-halqa    — yakun `hero` ichida ScoreRing → sarlavha 2 qatorda kartaga tushadi (177)
//   q5 halqa-chet     — `.pod-card .ring-wrap` manfiy `top` → halqa kartadan chiqadi (177)
//   q6 ro'yxat-chet   — `.kdreq` oddiy ro'yxat: umumiy `ol{padding:0}` chekinishni yeydi (178)
// QOIDA (warn):
//   q7 son-takror     — «Mustaqil ish · uch …» eyebrow: son sarlavha + doiralarda bor (179)
//
// Ishlatish: node lint-qolip.mjs [fayl|papka …]  (argumentsiz — App.jsx ga ulangan barcha darslar)
// Chiqish kodi: error > 0 bo'lsa 1.
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const C = { red: (s) => `\x1b[31m${s}\x1b[0m`, yel: (s) => `\x1b[33m${s}\x1b[0m`, grn: (s) => `\x1b[32m${s}\x1b[0m`, b: (s) => `\x1b[1m${s}\x1b[0m` };

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    // faqat arxiv PAPKALARI o'tkaziladi — fayl nomida «eski» bo'lishi mumkin (ClaudE-SKIlls!)
    if (e.isDirectory() && (e.name === 'eski' || e.name === '2-moodull eski')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.jsx')) out.push(p);
  }
}
// App.jsx ga ulangan darslar — o'lik nusxalar (PmLesson7, PmLesson28) va boshqa ilovalar (bridge/)
// papka bilan berilganda hisobga olinmaydi; aniq fayl berilsa — har doim tekshiriladi.
const app = fs.readFileSync(path.join(ROOT, 'src/App.jsx'), 'utf8');
const ACTIVE = new Set([...app.matchAll(/import\('\.\/([^']+\.jsx)'\)|from '\.\/([^']+\.jsx)'/g)].map((m) => path.join(ROOT, 'src', m[1] || m[2])));
let files = [];
if (args.length) {
  for (const a of args) {
    const full = path.resolve(ROOT, a);
    if (!fs.existsSync(full)) continue;
    if (fs.statSync(full).isDirectory()) { const w = []; walk(full, w); files.push(...(full.includes(path.join(ROOT, 'src')) ? w.filter((p) => ACTIVE.has(p)) : w)); }
    else files.push(full);
  }
} else {
  files = [...ACTIVE].filter((p) => fs.existsSync(p));
}
files.sort();

const lineOf = (s, i) => s.slice(0, i).split('\n').length;
const findings = [];
const add = (f, s, i, sev, id, msg) => findings.push({ f: path.relative(ROOT, f), line: lineOf(s, i), sev, id, msg });

for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  let m;
  // q1
  // to'g'ridan-to'g'ri ham, shartli ham (`isMentorLive ? 'flex-start' : 'center'`), `safe center` ham — hammasi markaz
  const reCenter = /<div className=\{?["`]screen[^"`]*["`]\}? style=\{\{[^}]*justifyContent:[^,}]*['"](?:safe )?center['"]/g;
  while ((m = reCenter.exec(s))) add(f, s, m.index, 'error', 'q1 ekran-markaz', "ekran vertikal markazda — kontent tepadan boshlanadi (DE-174): justifyContent olinsin");
  const reCenterCss = /\.screen(?::has\([^)]*\))?(?:\.[\w-]+)? \{[^}]*justify-content: *(?:safe )?center/g;
  while ((m = reCenterCss.exec(s))) add(f, s, m.index, 'error', 'q1 ekran-markaz', "CSS'da `.screen` vertikal markazda — kontent tepadan boshlanadi (DE-174)");
  // q2
  const reInput = /<input\b(?:[^>]|=>)*?\/>/gs;
  while ((m = reInput.exec(s))) {
    const t = m[0];
    if (!t.includes('reflect-input')) continue;
    if (/type="number"|inputMode|type=\{/.test(t)) continue;
    add(f, s, m.index, 'error', 'q2 bir-qator', 'matn maydoni <input> — <GrowInput> (1→4 qator) bo\'lsin (DE-175)');
  }
  // q3
  const lp = s.indexOf('function ScreenLivePractice');
  if (lp >= 0) {
    const body = s.slice(lp, s.indexOf('\n}\n', lp));
    const k = body.indexOf('disabled={done} onClick={complete}');
    if (k >= 0) add(f, s, lp + k, 'error', 'q3 qulfsiz', '«Bajardim» qadamlar belgilanmasa ham bosiladi — disabled={done || checked.size < checklist.length} (DE-176)');
  }
  // q4
  const h = s.indexOf('<div className="hero">');
  if (h >= 0) {
    const seg = s.slice(h, h + 6000);
    const end = seg.indexOf('className="bigidea') > 0 ? seg.indexOf('className="bigidea') : seg.indexOf('cs-cta') > 0 ? seg.indexOf('cs-cta') : 2500;
    const r = seg.slice(0, end).indexOf('<ScoreRing');
    if (r >= 0) add(f, s, h + r, 'error', 'q4 yakun-halqa', 'yakun ekranida halqa — «N/M to\'g\'ri» yorlig\'i (score-chip) bo\'lsin (DE-177)');
  }
  // q5
  const reRing = /\.pod-card \.ring-wrap \{[^}]*\btop: *-\d/g;
  while ((m = reRing.exec(s))) add(f, s, m.index, 'error', 'q5 halqa-chet', 'natija halqasi kartadan tashqariga chiqadi (manfiy top) (DE-177)');
  // q6
  if (s.includes('className="kdreq"') && !/ol\.kdreq \{/.test(s)) {
    const k = s.search(/\n\s*\.kdreq \{/);
    add(f, s, k >= 0 ? k + 1 : 0, 'error', 'q6 ro\'yxat-chet', '.kdreq oddiy ro\'yxat — umumiy ol{padding:0} chekinishni yeydi; `.lesson-root ol.kdreq` naqshi (DE-178)');
  }
  // q7
  const reEy = /eyebrow=\{tr\(\{ uz: 'Mustaqil ish · (?:bitta|uch|uchta|ikki|ikkita|to'rt|to'rtta|besh|beshta)\b[^']*'/g;
  while ((m = reEy.exec(s))) add(f, s, m.index, 'warn', 'q7 son-takror', 'son sarlavha va 1/2/3 doiralarda bor — eyebrow «Mustaqil ish» (DE-179)');
}

const errs = findings.filter((x) => x.sev === 'error');
const warns = findings.filter((x) => x.sev === 'warn');
console.log(C.b(`\nLINT-QOLIP — ${files.length} fayl`));
for (const x of findings) console.log(`${x.sev === 'error' ? C.red('🔴') : C.yel('🟡')} ${x.f}:${x.line} [${x.id}] ${x.msg}`);
console.log(errs.length ? C.red(C.b(`🔴 error: ${errs.length} · 🟡 warn: ${warns.length}\n`)) : C.grn(C.b(`✓ TOZA — error 0 · warn ${warns.length}\n`)));
process.exit(errs.length ? 1 : 0);
