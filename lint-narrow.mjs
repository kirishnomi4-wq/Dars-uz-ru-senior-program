#!/usr/bin/env node
// ============================================================================
// lint-narrow — 171-qonun (F-1002-94): `narrow` (680 px tor ustun) FAQAT test (QuestionScreen)
// va natija (ScreenPodium) ekranlarida. Tushuncha/hayotiy/amaliyot ekrani kurs layoutida qoladi —
// bitta ekran tor bo'lsa dars boshqalaridan farq qiladi (foydalanuvchi: «layout o'zgarmasin, qat'iy»).
// O'lchov 02.10: kursda 119 fayl `narrow` ishlatadi — test+podiumdan tashqari 5-Modulda 2 (tuzatildi),
// 1–2-Modulda 8 (PmLesson3 ×5, PracticeLesson4, HtmlTakrorlash ×2 — KATTA_TOZALASH F-1002-94).
// Qamrov: src/5-Modull va 7+ modullar — error; 1–4-Modul va 6-Modul — warn.
// Ishlatish: node lint-narrow.mjs [fayl|papka …]   (argumentsiz — butun src/)
// ============================================================================
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RED = '\x1b[31m', YEL = '\x1b[33m', GRN = '\x1b[32m', DIM = '\x1b[2m', B = '\x1b[1m', R = '\x1b[0m';
const STRICT = /src[\\/](5-Modull|[7-9]-Modull|1[0-9]-Modull)[\\/]|PmMetricsLesson\.jsx$/;
const ALLOWED = /^(QuestionScreen|ScreenPodium|Podium|ScreenResult|ResultScreen)/; // test + natija

const walk = (p, out = []) => { const st = statSync(p); if (st.isDirectory()) { for (const n of readdirSync(p)) walk(join(p, n), out); } else if (p.endsWith('.jsx')) out.push(p); return out; };
const args = process.argv.slice(2);
const files = (args.length ? args : ['src']).flatMap(a => walk(a));

const report = [];
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  // komponent e'lonlari: `const Xxx = (` / `function Xxx(` — qator boshida
  const decls = [...src.matchAll(/^(?:const|function)\s+([A-Za-z0-9_]+)/gm)].map(m => ({ i: m.index, name: m[1] }));
  const compAt = (i) => { let c = null; for (const d of decls) { if (d.i > i) break; c = d.name; } return c; };
  const TAG = /<Stage\b([^>]*?)>/g;
  let m;
  while ((m = TAG.exec(src))) {
    const attrs = m[1];
    if (!/\snarrow(?=[\s=>/]|$)/.test(attrs)) continue;
    const comp = compAt(m.index) || '?';
    if (ALLOWED.test(comp)) continue;
    const line = src.slice(0, m.index).split('\n').length;
    const eyebrow = (attrs.match(/eyebrow=\{[^}]*uz:\s*['"]([^'"]*)['"]/) || [])[1] || '';
    report.push({ file, line, comp, eyebrow, strict: STRICT.test(file) });
  }
}
const err = report.filter(r => r.strict), warn = report.filter(r => !r.strict);
for (const r of report) console.log(`  ${r.strict ? RED + '🔴' : YEL + '🟡'} ${r.file}:${r.line}${R} ${DIM}${r.comp}${r.eyebrow ? ' · «' + r.eyebrow + '»' : ''}${R} — tushuncha-ekranda \`narrow\` (171-qonun: faqat test/podium)`);
console.log(`${B}\nlint-narrow: ${files.length} fayl · ${RED}${err.length} error${R}${B} · ${YEL}${warn.length} warn${R}${B} · \`narrow\` faqat QuestionScreen/ScreenPodium (171-qonun)${R}`);
if (!report.length) console.log(`${GRN}  toza.${R}`);
process.exit(err.length ? 1 : 0);
