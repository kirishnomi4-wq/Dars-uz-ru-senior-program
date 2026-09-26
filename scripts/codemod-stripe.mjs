#!/usr/bin/env node
// ============================================================
//  codemod-stripe — bridge-tozalik D1/D2: dekorativ CHAP RANG-CHIZIQ va KESIK CHIZIQni olib tashlaydi
//  (PILOT_DIZAYN_NAQSH 46/51-band, F-0925-QA08/QA18 — bridge'da 7 darsga qo'llangan naqshning o'zi;
//  namuna: src/bridge/lessons/BridgeKimUchun.jsx — `.frame-soft`, `.mstats-verdict.*` faqat fon + radius).
//
//  Nega codemod: 25 darsda bir xil shablon-CSS (`.frame-*`, `.mstats-verdict.*`, `.mnote`, `.xul` …).
//  Agent bilan 25 fayl = 25 × 30M kontekst; bu skript — 0.
//
//  Ishlatish:  node scripts/codemod-stripe.mjs [--write] <fayl...>     (--write bo'lmasa — QURUQ yurish, hisobot)
//
//  Nima qiladi (CSS shablon-satri ichida, satr-ma-satr):
//   1. `border-left: 3–6px solid …;`            → olinadi (fon + radius qoladi — bridge etaloni)
//   2. `border-left-color: …;`                   → olinadi (holat rangi endi chiziqda emas)
//   3. `box-shadow: inset 2–6px 0 0 …`           → inset qismi olinadi; qolgan soya qoladi; yolg'iz bo'lsa butun box-shadow olinadi
//   4. `borderLeft: '3–6px solid …',`             → inline style'da olinadi
//   5. `.x::before { … height: 3–6px … repeating-linear-gradient … }` bir satrli bezak-qoida → butun qoida olinadi
//   6. ko'p satrli `repeating-linear-gradient` → TEGILMAYDI, hisobotda «qo'lda» (kontekst kerak)
//  `border: none; border-left: …` bo'lsa — `border: none` qoladi (element fon bilan ajraladi).
// ============================================================
import { readFileSync, writeFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const files = argv.filter(a => !a.startsWith('--'));
if (!files.length) { console.log('fayl kerak'); process.exit(1); }

const RX = [
  ['border-left', /\s*border-left:\s*[3-6]px\s+solid\s+[^;]+;/g, ''],
  ['border-left-color', /\s*border-left-color:\s*[^;]+;/g, ''],
  ['inset(yolg`iz)', /\s*box-shadow:\s*inset\s+[2-6]px\s+0\s+0\s+[^,;]+;/g, ''],
  ['inset(birinchi)', /(box-shadow:\s*)inset\s+[2-6]px\s+0\s+0\s+[^,;]+,\s*/g, '$1'],
  ['inset(keyingi)', /,\s*inset\s+[2-6]px\s+0\s+0\s+[^,;]+(?=;)/g, ''],
  // backtik-shablon ichida `${a === 'x' ? b : c}` kabi qo'shtirnoq bo'lishi mumkin — shablon butunligicha olinadi
  // (26.09: `[^'"`]*` naqshi PipelineProject 850-satrni yarim kesib qo'ygan edi — esbuild tutdi)
  ['borderLeft(inline)', /\s*borderLeft:\s*(?:`[3-6]px\s+solid(?:[^`\\]|\\.)*`|'[3-6]px\s+solid[^']*'|"[3-6]px\s+solid[^"]*"),?/g, ''],
];
// qoida tanasida `${T.line}` kabi tokenlar bor — `[^}]*` ularda sinadi, shuning uchun token alohida ruxsat etiladi
const KESIK_RULE = /^(\s*)([.#][\w.:()>+~\s-]*::?(before|after)[^{]*)\{(?:[^{}]|\$\{[^}]*\})*height:\s*[3-6]px(?:[^{}]|\$\{[^}]*\})*repeating-linear-gradient(?:[^{}]|\$\{[^}]*\})*\}\s*$/;

let grand = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const lines = src.split('\n');
  const rep = []; let n = 0;
  for (let i = 0; i < lines.length; i++) {
    let L = lines[i];
    if (KESIK_RULE.test(L)) { rep.push(`  :${i + 1} kesik-qoida olindi  ${L.trim().slice(0, 90)}`); lines[i] = ''; n++; continue; }
    for (const [name, rx, to] of RX) {
      const before = L;
      L = L.replace(rx, to);
      if (L !== before) { rep.push(`  :${i + 1} ${name}  ${before.trim().slice(0, 100)}`); n++; }
    }
    if (/repeating-linear-gradient/.test(L)) rep.push(`  :${i + 1} ⚠ QO'LDA — ko'p satrli kesik:  ${L.trim().slice(0, 90)}`);
    lines[i] = L;
  }
  // bo'shab qolgan kesik-qoida satrini olib tashlash
  const out = lines.filter((L, i) => !(L === '' && src.split('\n')[i] !== ''));
  grand += n;
  console.log(`\n${f}  → ${n} o'zgarish${WRITE ? ' (YOZILDI)' : ' (quruq)'}`);
  rep.forEach(r => console.log(r));
  if (WRITE && n) writeFileSync(f, out.join('\n'));
}
console.log(`\njami: ${grand} o'zgarish · ${WRITE ? 'yozildi — endi: npm run gates -- <fayl> + node lint-dizayn.mjs' : 'quruq yurish (--write bilan yoziladi)'}`);
