#!/usr/bin/env node
// ============================================================================
// LINT-TELL — test javobi «sotilib» qolganini ovlaydi (F-0929-18 · D5, 2026-09-29).
// 6-Modul MD-ko'rigida deyarli har darsda topilgan sinf: to'g'ri javob eng uzun,
// yagona texnik atamali, yagona strelka/qavsli, yoki savol jumlasini aynan takrorlaydi.
// Qonun: DARS_ETALON 8.4 (uzunlik-tell) · tekshiruvchi ov-bandi F-0929-22/6.
//
// Ishlatish:
//   node lint-tell.mjs                       → butun src/**/*.jsx
//   node lint-tell.mjs src/6-Modull/X.jsx    → bitta fayl
// Nima ko'radi: <QuestionScreen … options={[…]} correctIdx={…}> bloklari va
// `const QUIZ_BANK = [ { q, opts, correct } ]`. Faqat `uz:` matn.
// Chiqish kodi: error > 0 bo'lsa 1.
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const LEN_WARN = 1.25, LEN_ERR = 1.45;

function listJsx(p) {
  const st = fs.statSync(p);
  if (st.isFile()) return p.endsWith('.jsx') ? [p] : [];
  return fs.readdirSync(p).flatMap(f => listJsx(path.join(p, f)));
}
const files = (args.length ? args : ['src']).flatMap(listJsx);

// --- yordamchilar -----------------------------------------------------------
function lineOf(src, idx) { return src.slice(0, idx).split('\n').length; }

// `[` dan boshlab mos `]` gacha (satr/shablon ichidagi qavslarni e'tiborsiz qoldiradi)
function sliceBalanced(src, start, open, close) {
  let depth = 0, i = start, q = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (q) { if (c === '\\') { i++; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return src.slice(start, i + 1); }
  }
  return null;
}
// top-level elementlarga bo'lish (massiv ichi)
function splitTop(inner) {
  const out = []; let depth = 0, q = null, cur = '';
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (q) { cur += c; if (c === '\\') { cur += inner[++i] ?? ''; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; cur += c; continue; }
    if ('[{('.includes(c)) depth++;
    if (']})'.includes(c)) depth--;
    if (c === ',' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) out.push(cur);
  return out.map(s => s.trim()).filter(Boolean);
}
const STR = /(["'])((?:\\.|(?!\1)[^\\])*)\1/;
function uzOf(item) {
  const m = item.match(/uz\s*:\s*(["'])((?:\\.|(?!\1)[^\\])*)\1/);
  if (m) return m[2];
  const jsx = item.match(/uz\s*:\s*<>([\s\S]*?)<\/>/);
  if (jsx) return jsx[1].replace(/<[^>]+>/g, '');
  const s = item.match(STR);
  return s ? s[2] : null;
}
function words(s) {
  return (s.toLowerCase().normalize('NFC').match(/[a-zа-яёo'ʻ’`0-9._/-]{4,}/gi) || []).map(w => w.replace(/^[._/-]+|[._/-]+$/g, '')).filter(w => w.length >= 4);
}
const TECH = /[A-Z]{2,}|\/[a-z]+|\.[a-z]{2,}\b|\(\)|[a-z][A-Z]|`/;   // API, /orders, .env, fetch(), camelCase, backtick
const PUNCT = /→|←|—|\(|\)/;

function checkQuestion(rep, file, line, qText, opts, correct, where) {
  if (!opts.length || correct == null || !opts[correct]) return;
  const ok = opts[correct];
  const others = opts.filter((_, i) => i !== correct);
  if (!others.length) return;
  const push = (sev, msg) => rep.push({ sev, file, line, where, msg, ok });
  // 1) uzunlik
  const r = ok.length / Math.max(...others.map(o => o.length));
  if (r >= LEN_ERR) push('error', `to'g'ri javob eng uzun (×${r.toFixed(2)})`);
  else if (r >= LEN_WARN) push('warn', `to'g'ri javob uzunroq (×${r.toFixed(2)})`);
  // 2) yagona texnik atama / belgi
  if (TECH.test(ok) && !others.some(o => TECH.test(o))) push('error', 'texnik atama faqat to\'g\'ri variantda');
  if (PUNCT.test(ok) && !others.some(o => PUNCT.test(o))) push('error', 'strelka/tire/qavs faqat to\'g\'ri variantda');
  // 3) savol aks-sadosi: to'g'rida bor, boshqalarda yo'q, savolda bor
  if (qText) {
    const qw = new Set(words(qText)), ow = new Set(others.flatMap(words));
    const echo = [...new Set(words(ok))].filter(w => qw.has(w) && !ow.has(w));
    if (echo.length >= 2) push('warn', `savol so'zlarini faqat to'g'ri variant takrorlaydi: ${echo.slice(0, 3).join(', ')}`);
  }
}

const report = [];
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  // INLINE_KEYS
  const keys = {};
  const km = src.match(/const INLINE_KEYS\s*=\s*\{([^}]*)\}/);
  if (km) for (const m of km[1].matchAll(/(\w+)\s*:\s*(-?\d+)/g)) keys[m[1]] = +m[2];
  // QuestionScreen bloklari
  const re = /<QuestionScreen\b/g; let m;
  while ((m = re.exec(src))) {
    const end = src.indexOf('/>', m.index); if (end < 0) break;
    const block = src.slice(m.index, end + 2);
    const oi = block.indexOf('options={'); if (oi < 0) continue;
    const arr = sliceBalanced(block, block.indexOf('[', oi), '[', ']'); if (!arr) continue;
    const opts = splitTop(arr.slice(1, -1)).map(uzOf).filter(x => x != null);
    let correct = null;
    const c1 = block.match(/correctIdx=\{\s*(\d+)\s*\}/); const c2 = block.match(/correctIdx=\{\s*INLINE_KEYS\.(\w+)\s*\}/);
    if (c1) correct = +c1[1]; else if (c2 && keys[c2[1]] != null) correct = keys[c2[1]];
    const qm = block.match(/questionText=\{\{\s*uz\s*:\s*(["'])((?:\\.|(?!\1)[^\\])*)\1/);
    checkQuestion(report, file, lineOf(src, m.index), qm ? qm[2] : '', opts, correct, 'QuestionScreen');
  }
  // QUIZ_BANK
  const qb = src.indexOf('const QUIZ_BANK');
  if (qb >= 0) {
    const arr = sliceBalanced(src, src.indexOf('[', qb), '[', ']');
    if (arr) for (const [i, item] of splitTop(arr.slice(1, -1)).entries()) {
      const oi = item.indexOf('opts'); if (oi < 0) continue;
      const oarr = sliceBalanced(item, item.indexOf('[', oi), '[', ']'); if (!oarr) continue;
      const opts = splitTop(oarr.slice(1, -1)).map(uzOf).filter(x => x != null);
      const cm = item.match(/correct\s*:\s*(\d+)/);
      const qm = item.match(/q\s*:\s*\{\s*uz\s*:\s*(["'])((?:\\.|(?!\1)[^\\])*)\1/) || item.match(/q\s*:\s*(["'])((?:\\.|(?!\1)[^\\])*)\1/);
      const line = lineOf(src, qb) + (arr.slice(0, arr.indexOf(item)).split('\n').length - 1);
      checkQuestion(report, file, line, qm ? qm[2] : '', opts, cm ? +cm[1] : null, `QUIZ_BANK #${i + 1}`);
    }
  }
}

const errs = report.filter(r => r.sev === 'error').length, warns = report.length - errs;
for (const r of report) {
  console.log(`${r.sev === 'error' ? '❌' : '⚠️ '} ${r.file}:${r.line} [${r.where}] ${r.msg}\n     ✔ «${r.ok}»`);
}
console.log(`\nlint-tell: ${files.length} fayl · ${errs} error · ${warns} warn`);
process.exit(errs > 0 ? 1 : 0);
