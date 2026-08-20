#!/usr/bin/env node
// ============================================================================
// TIL-LINT — dars-matn so'z-nazoratchisi (foydalanuvchi feedbacklari distillati)
// Ishlatish:
//   node til-lint.mjs                      → butun src/**/*.jsx
//   node til-lint.mjs src/pm/PmXLesson.jsx → bitta fayl
//   node til-lint.mjs --report hisobot.md  → to'liq MD-hisobot faylga
// Qoidalar: til-lint-rules.json (MATN_ETALONI lug'ati bilan juft yuritiladi).
// Skip qilinadi: // izoh-qatorlar, /* */ bloklar, <style>…</style> CSS-bloklar.
// Chiqish kodi: error > 0 bo'lsa 1 (pipeline-darvoza uchun), aks holda 0.
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
let reportPath = null;
const paths = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--report') { reportPath = args[++i]; }
  else paths.push(args[i]);
}

const ROOT = process.cwd();
const rulesFile = path.join(ROOT, 'til-lint-rules.json');
const { rules } = JSON.parse(fs.readFileSync(rulesFile, 'utf8'));
const compiled = rules.map(r => ({
  ...r,
  re: new RegExp(r.pattern, (r.flags || '') + 'u'),
  // Istisno qoidaning O'Z bayroqlari bilan yig'iladi. Avval faqat 'u' edi — ya'ni
  // istisno katta-kichik harfni ajratardi: `skeleton` istisnosi `Skeleton` ni
  // ushlamasdi va qoida baribir yonardi (F-0820-62, m3-08).
  exceptRe: r.except ? new RegExp(r.except, (r.flags || '') + 'u') : null,
}));

// --- fayllarni yig'ish ---
function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.jsx')) out.push(p);
  }
}
let files = [];
if (paths.length) {
  for (const p of paths) {
    const full = path.resolve(ROOT, p);
    if (fs.statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
} else {
  walk(path.join(ROOT, 'src'), files);
}
files.sort();

// --- bitta faylni tekshirish ---
function lintFile(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const base = path.basename(file, '.jsx');
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split('\n');
  const findings = [];
  let inBlockComment = false;
  let inStyle = false;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].replace(/\r$/, ''); // CRLF: \r regex $-ni buzadi
    const t = raw.trim();
    // --- ko'p qatorli izoh-blok holati (/* ... */ va {/* ... */}) ---
    let s = raw;
    if (inBlockComment) {
      const end = s.indexOf('*/');
      if (end === -1) continue;            // hali izoh ichidamiz
      s = s.slice(end + 2); inBlockComment = false;
    }
    // shu qatordagi yopiq izoh-juftlarni olib tashlash
    s = s.replace(/\{?\/\*[\s\S]*?\*\/\}?/g, '');
    // ochilib qolgan /* — qator qolgani izoh
    const openIdx = s.indexOf('/*');
    if (openIdx !== -1) { s = s.slice(0, openIdx); inBlockComment = true; }
    const st = s.trim();
    if (!st || st.startsWith('//') || st.startsWith('*')) continue; // izoh-qator
    // qator-oxiri « // izoh» (ikki tomonida bo'shliq — URL http:// ga tegmaydi)
    s = s.replace(/\s\/\/\s.*$/, '');
    // --- <style> CSS-bloki ---
    if (inStyle) { if (st.includes('</style>')) inStyle = false; continue; }
    if (st.includes('<style')) { if (!st.includes('</style>')) inStyle = true; continue; }
    // --- qoidalar (tozalangan `s` ustida) ---
    for (const r of compiled) {
      if (r.allowFiles && r.allowFiles.some(a => base.includes(a))) continue;
      if (r.exceptRe && r.exceptRe.test(s)) continue;
      const m = s.match(r.re);
      if (m) {
        findings.push({
          line: i + 1, rule: r.id, severity: r.severity,
          match: m[0], suggest: r.suggest, law: r.law,
          excerpt: t.length > 110 ? t.slice(0, 110) + '…' : t,
        });
      }
    }
  }
  return { rel, base, findings };
}

// --- yugurtirish ---
const results = files.map(lintFile).filter(r => r.findings.length > 0);
const totalErr = results.reduce((s, r) => s + r.findings.filter(f => f.severity === 'error').length, 0);
const totalWarn = results.reduce((s, r) => s + r.findings.filter(f => f.severity === 'warn').length, 0);

// --- konsol-xulosa ---
const C = { red: s => `\x1b[31m${s}\x1b[0m`, yel: s => `\x1b[33m${s}\x1b[0m`, grn: s => `\x1b[32m${s}\x1b[0m`, dim: s => `\x1b[2m${s}\x1b[0m`, b: s => `\x1b[1m${s}\x1b[0m` };
console.log(C.b(`\nTIL-LINT — ${files.length} fayl tekshirildi · qoidalar: ${rules.length}`));
if (!results.length) {
  console.log(C.grn('✓ TOZA — hech qanday topilma yo\'q.\n'));
} else {
  console.log(`${C.red('🔴 error: ' + totalErr)} · ${C.yel('🟡 warn: ' + totalWarn)} · fayllar: ${results.length}\n`);
  for (const r of results) {
    const errs = r.findings.filter(f => f.severity === 'error').length;
    const warns = r.findings.length - errs;
    console.log(C.b(`${r.rel}`) + `  ${errs ? C.red('🔴' + errs) : ''} ${warns ? C.yel('🟡' + warns) : ''}`);
    // qoida bo'yicha guruhlab, har qoidadan maks 4 misol
    const byRule = {};
    for (const f of r.findings) (byRule[f.rule] ||= []).push(f);
    for (const [rule, fs2] of Object.entries(byRule)) {
      const sev = fs2[0].severity === 'error' ? C.red('🔴') : C.yel('🟡');
      const linesList = fs2.slice(0, 4).map(f => f.line).join(',') + (fs2.length > 4 ? ` +${fs2.length - 4}` : '');
      console.log(`  ${sev} ${rule} (${fs2.length}x, qator ${linesList}) → ${fs2[0].suggest}`);
    }
  }
  console.log('');
}

// --- to'liq MD-hisobot ---
if (reportPath) {
  let md = `# TIL-LINT HISOBOT\n\nFayllar: ${files.length} · 🔴 error: ${totalErr} · 🟡 warn: ${totalWarn}\n\n`;
  for (const r of results) {
    md += `## ${r.rel}\n\n| Qator | Holat | Qoida | Topilma | Tavsiya | Qonun |\n|---|---|---|---|---|---|\n`;
    for (const f of r.findings) {
      md += `| ${f.line} | ${f.severity === 'error' ? '🔴' : '🟡'} | ${f.rule} | \`${f.match.replace(/\|/g, '\\|')}\` | ${f.suggest.replace(/\|/g, '\\|')} | ${f.law.replace(/\|/g, '\\|')} |\n`;
    }
    md += '\n';
  }
  fs.writeFileSync(path.resolve(ROOT, reportPath), md, 'utf8');
  console.log(C.dim(`To'liq hisobot: ${reportPath}`));
}

process.exit(totalErr > 0 ? 1 : 0);
