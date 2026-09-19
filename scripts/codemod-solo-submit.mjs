#!/usr/bin/env node
// codemod-solo-submit — Q1 (19.09): UYDA (solo) o'tilgan darsda maxsus test-ekran javobi ham serverga yuborilsin.
// Muammo (brauzerda isbotlangan: scripts/ach-probe.mjs --solo): maxsus yakuniy test (tartiblash, yozma kod, juftlash …)
// javobni faqat `live.mode === 'student'` da yuborardi; rasmiy solo natija `live_answers` dan yig'iladi → bu savol doim
// «javobsiz», maksimal (N-1)/N. Tuzatish — ildiz `recordAnswer` ga bitta blok:
//   solo · mashq emas («Qaytadan» — 151-qonun 6-band) · ball-ekran · yakunlandi (`solved` yoki `correct`) · shu ekran uchun birinchi marta
//   → `live.submitAnswer(idx, id, picked)`; `picked` kalitdan tanlanadi — server `data.correct` (birinchi urinish) ni oladi:
//   kalit -1 (ishtirok) → 0 · to'g'ri → kalit · xato → kalitdan boshqa son. Server `on conflict do nothing` — MCQ (o'zi
//   `recordAttempt` bilan yozadi) uchun takror e'tiborsiz; jonli rejim o'zgarmaydi.
// Ishlatish: node scripts/codemod-solo-submit.mjs [--write] <fayl…>     (--write bo'lmasa — QURUQ)
import { readFileSync, writeFileSync } from 'node:fs';
import { transformSync } from 'esbuild';

const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const files = argv.filter((a) => !a.startsWith('--'));
if (!files.length) { console.error('fayl kerak'); process.exit(2); }

const REF = "  const soloSentRef = useRef(new Set()); // Q1 (19.09): solo'da maxsus test javobi serverga BIR marta\n";
const BLOCK = (ind) => `${ind}// Q1 (19.09): UYDA (solo) maxsus test javobi ham serverga — rasmiy natijada sanalsin (oldin faqat jonli darsda
${ind}// yuborilardi → «javobsiz»). \`picked\` kalitdan: server \`data.correct\` (birinchi urinish) ni oladi. MCQ o'zi \`recordAttempt\`
${ind}// bilan yozadi — takrori serverda e'tiborsiz (on conflict do nothing). «Qaytadan» mashqida yuborilmaydi (151-qonun 6-band).
${ind}if (_m && _m.scored && live.mode === 'solo' && !firstPassRef.current && data && (data.solved === true || data.correct === true) && !soloSentRef.current.has(idx)) {
${ind}  const key = INLINE_KEYS[_m.id];
${ind}  if (Number.isInteger(key)) { soloSentRef.current.add(idx); live.submitAnswer(idx, _m.id, key < 0 ? 0 : (data.correct ? key : (key === 0 ? 1 : 0)), !!data.correct, data.elapsedMs || 0); }
${ind}}
`;

let ok = 0, skip = 0, fail = 0;
for (const f of files) {
  let s = readFileSync(f, 'utf8'); const errs = [];
  if (s.includes('soloSentRef')) { skip++; console.log(`SKIP ${f}: allaqachon bor`); continue; }
  if (!/scored:\s*true/.test(s)) { skip++; console.log(`SKIP ${f}: ball-ekran yo'q`); continue; }
  for (const need of ['const INLINE_KEYS', 'const live = useLiveSession(', 'firstPassRef', 'useRef']) if (!s.includes(need)) errs.push(`${need} yo'q`);
  const fp = /^(\s*)const firstPassRef = useRef\([^\n]*\n/m.exec(s);
  if (!fp) errs.push('firstPassRef qatori topilmadi');
  const ra = /const recordAnswer = \(idx, data\) => \{\n/.exec(s);
  if (!ra) errs.push('recordAnswer topilmadi');
  let at = -1, ind = '    ';
  if (ra) {
    const seg = s.slice(ra.index, ra.index + 2500); // recordAnswer tanasi (uzun izohli darslar ham)
    const m = /\n(\s*)const _m = SCREEN_META\[idx\];\n/.exec(seg);
    if (!m) errs.push('recordAnswer ichida `const _m = SCREEN_META[idx];` yo\'q'); else { at = ra.index + m.index + m[0].length; ind = m[1]; }
  }
  if (!errs.length) {
    s = s.slice(0, at) + BLOCK(ind) + s.slice(at); // avval pastki joy — yuqoridagi indeks surilmaydi
    const fp2 = /^(\s*)const firstPassRef = useRef\([^\n]*\n/m.exec(s);
    s = s.slice(0, fp2.index + fp2[0].length) + REF + s.slice(fp2.index + fp2[0].length);
  }
  let syn = '';
  if (!errs.length) { try { transformSync(s, { loader: 'jsx', jsx: 'automatic' }); } catch (e) { syn = String(e.message).split('\n')[0]; } }
  if (errs.length || syn) { fail++; console.log(`FAIL ${f}: ${[...errs, syn && 'esbuild: ' + syn].filter(Boolean).join(' · ')}`); continue; }
  ok++; if (WRITE) writeFileSync(f, s);
  console.log(`${WRITE ? 'YOZILDI' : 'quruq  '} ${f}`);
}
console.log(`\n${WRITE ? 'YOZISH' : 'QURUQ YURISH'}: mos ${ok} · o'tkazildi ${skip} · xato ${fail} · jami ${files.length}`);
process.exit(fail ? 1 : 0);
