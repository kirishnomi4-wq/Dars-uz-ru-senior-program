#!/usr/bin/env node
// ============================================================
//  codemod-frame-dash — «… bosing ←» BO'SH-HOLAT ramkasini olib tashlaydi (bridge 53-band, F-0925-QA18;
//  foydalanuvchi 2026-09-26: «PM bridge'da qilganimizdek»). Chorlov mentor-gapda va tugmada — kartada emas.
//
//  Ishlatish:  node scripts/codemod-frame-dash.mjs [--write] <fayl...>     (--write bo'lmasa — QURUQ yurish)
//
//  Nima qiladi:
//   1. `: <div className="frame-dash"><p …>{tr({ uz: '…', ru: '…' })}</p></div>}`  (ternary else)  → `: null}`
//   2. `{shart && <div className="frame-dash">…</div>}`                            (shartli)       → olinadi
//   3. `<div className="frame-dash">…</div>` boshqa ko'rinishda qolsa → hisobotda «QO'LDA»
//   4. Faylda `frame-dash` ishlatilmay qolsa — `.frame-dash { … }` CSS qoidasi ham olinadi (o'lik kod qolmasin)
//  Hisobotda har olib tashlangan ramka bilan birga uning ustidagi eng yaqin mentor-gap ko'rsatiladi —
//  chorlov mentor-gapda borligini KO'Z bilan tekshirish uchun (bo'lmasa — mentor-gap to'ldiriladi, qo'lda).
// ============================================================
import { readFileSync, writeFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const files = argv.filter(a => !a.startsWith('--'));
if (!files.length) { console.log('fayl kerak'); process.exit(1); }

const FD = /<div className="frame-dash">\s*<p[^>]*>\{tr\(\{\s*uz:\s*(['"])(.*?)\1\s*,\s*ru:\s*(['"]).*?\3\s*\}\)\}<\/p>\s*<\/div>/;
const TERN = new RegExp(':\\s*' + FD.source + '\\s*(\\)?)\\}', '');        // `: <ramka>}` yoki `: <ramka>)}`
const TERN_TRUE = new RegExp('(\\{![\\w.]+\\s*\\?)\\s*' + FD.source + '\\s*:', ''); // `{!done ? <ramka> : …}`
const COND = new RegExp('\\{[^{}]*?&&\\s*' + FD.source + '\\s*\\}', '');

function mentorAbove(lines, i) {
  for (let k = i; k >= Math.max(0, i - 60); k--) {
    const m = /mentor(?:Text|Gap|Say|)\s*[=:]\s*\{?\s*(?:tr\()?\{?\s*uz:\s*(['"`])(.*?)\1/.exec(lines[k]) || /<Mentor[^>]*>\s*\{tr\(\{\s*uz:\s*(['"`])(.*?)\1/.exec(lines[k]);
    if (m) return `:${k + 1} «${m[2].slice(0, 90)}»`;
  }
  return '(60 satr ichida mentor-gap topilmadi — qo\'lda qarang)';
}

let grand = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const lines = src.split('\n');
  const rep = []; let n = 0;
  for (let i = 0; i < lines.length; i++) {
    let L = lines[i];
    if (!L.includes('frame-dash')) continue;
    if (/^\s*\.frame-dash\s*\{/.test(L)) continue;
    const before = L;
    const m = FD.exec(L);
    if (TERN.test(L)) L = L.replace(TERN, ': null$4}');
    else if (TERN_TRUE.test(L)) L = L.replace(TERN_TRUE, '$1 null :');
    else if (COND.test(L)) L = L.replace(COND, '');
    if (L !== before) {
      n++; lines[i] = L;
      rep.push(`  :${i + 1} olindi «${m ? m[2] : ''}»  · mentor ${mentorAbove(lines, i)}`);
      if (!L.trim()) lines[i] = null;
    } else rep.push(`  :${i + 1} ⚠ QO'LDA — tanish naqsh emas:  ${L.trim().slice(0, 100)}`);
  }
  let out = lines.filter(L => L !== null);
  const stillUsed = out.some(L => /className="[^"]*frame-dash/.test(L));
  if (!stillUsed) {
    const k = out.findIndex(L => /^\s*\.frame-dash\s*\{/.test(L));
    if (k >= 0) { out.splice(k, 1); rep.push(`  CSS .frame-dash olindi (endi ishlatilmaydi)`); n++; }
  }
  grand += n;
  console.log(`\n${f}  → ${n} o'zgarish${WRITE ? ' (YOZILDI)' : ' (quruq)'}`);
  rep.forEach(r => console.log(r));
  if (WRITE && n) writeFileSync(f, out.join('\n'));
}
console.log(`\njami: ${grand} · ${WRITE ? 'yozildi — endi: npm run gates -- <fayl>' : 'quruq yurish (--write bilan yoziladi)'}`);
