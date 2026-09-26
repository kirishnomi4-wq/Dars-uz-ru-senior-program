#!/usr/bin/env node
// ============================================================
//  codemod-dark-btn — QORA TUGMA → accent (F-0819-56 qarori; 1–4c da hal qilingan naqshning o'zi,
//  foydalanuvchi 2026-09-26: «qora tugma bo'lmaydi»). Namuna: src/4c-Modull/CiCdIntroLesson.jsx (dark-lint TOZA).
//
//  Ishlatish:  node scripts/codemod-dark-btn.mjs [--write] <fayl...>     (--write bo'lmasa — QURUQ yurish)
//
//  Nima qiladi (CSS shablon-satri, faqat shu klass-qoidalarining o'z satrida):
//   .btn · .lp-done-btn · .rc-btn · .rn-cta · .codepill :
//        background: ${T.ink}  → ${T.accent}      color: ${T.bg} → #fff
//   .mstats-reveal :  background: ${T.ink}; color: #fff; border: none  → background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}
//  Qolgan qoidalar (hover, disabled) tegilmaydi — tekshiruv: `npm run lint:dark -- <fayl>` 0 bo'lishi shart.
// ============================================================
import { readFileSync, writeFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const files = argv.filter(a => !a.startsWith('--'));
if (!files.length) { console.log('fayl kerak'); process.exit(1); }

const ACCENT = ['btn', 'lp-done-btn', 'rc-btn', 'rn-cta', 'codepill'];
let grand = 0;
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n');
  const rep = []; let n = 0;
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    // hover: fon accent bo'lganda yozuv oq bo'lishi shart (4c naqshi) — aks holda accent ustida accent yozuv
    if (/^\s*\.mstats-reveal(:hover|\.ready)\s*\{/.test(L) && !/color:/.test(L)) {
      lines[i] = L.replace('{', '{ color: #fff;'); n++; rep.push(`  :${i + 1} ${L.trim().split(' ')[0]}  + color: #fff`); continue;
    }
    const m = /^\s*\.([\w-]+)\s*\{/.exec(L);
    if (!m) continue;
    let out = L;
    if (ACCENT.includes(m[1])) {
      out = out.replace(/background:\s*\$\{T\.ink\}\s*;/, 'background: ${T.accent};').replace(/color:\s*\$\{T\.bg\}\s*;/, 'color: #fff;');
    } else if (m[1] === 'mstats-reveal') {
      out = out.replace(/background:\s*\$\{T\.ink\}\s*;\s*color:\s*#fff\s*;\s*border:\s*none\s*;/, 'background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent};');
    }
    if (out !== L) { lines[i] = out; n++; rep.push(`  :${i + 1} .${m[1]}  → accent`); }
  }
  grand += n;
  console.log(`\n${f}  → ${n} o'zgarish${WRITE ? ' (YOZILDI)' : ' (quruq)'}`);
  rep.forEach(r => console.log(r));
  if (WRITE && n) writeFileSync(f, lines.join('\n'));
}
console.log(`\njami: ${grand} · ${WRITE ? 'yozildi — endi: npm run lint:dark -- <fayl>' : 'quruq yurish (--write bilan yoziladi)'}`);
