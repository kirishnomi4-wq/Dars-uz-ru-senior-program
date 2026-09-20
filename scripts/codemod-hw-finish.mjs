#!/usr/bin/env node
// codemod-hw-finish — F-0921-01 (foydalanuvchi 21.09): uyga-vazifa topshirilganda `onFinished` ISHONCHLI ketsin.
//
// Muammo: `onFinished` faqat yakun-ekranidagi «Vazifani topshirish» tugmasi bosilganda ketadi. O'quvchi tugmani
// bosmasa (yoki sahifa yopilsa) — LMS ptichkani olmaydi va keyingi dars ochilmaydi. Qayta ochilganda esa hech narsa
// yuborilmaydi. Ustiga: LMS `idempotency_key` bilan ishlaydi — takror yuborishda mazmun o'zgarsa 409 beradi (F-0920-01).
//
// Tuzatish (har paketga uch qism):
//   1) yuk MUHRLANADI — `ccHwSeal:<HW_ID>` (localStorage); takror yuborishda aynan o'sha mazmun
//   2) bosqichlar bajarilganda topshirish AVTOMAT ketadi (tugma baribir qoladi — u endi «✓ Topshirildi» ko'rsatadi)
//   3) vazifa qayta ochilsa va allaqachon topshirilgan bo'lsa — muhrlangan yuk BIR MARTA qayta yuboriladi
//
// Ishlatish: node scripts/codemod-hw-finish.mjs [--write] [fayl…]   (fayl berilmasa — src/*/*.homework.jsx)
import { readFileSync, writeFileSync, globSync } from 'node:fs';
import { transformSync } from 'esbuild';

const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const files = argv.filter((a) => !a.startsWith('--'));
const TARGETS = files.length ? files : globSync('src/*/*.homework.jsx').sort();

const HELPERS = (s) => s.replace(
  /(const hwWrite = \(o\) => \{[^\n]*\n)/,
  `$1// F-0921-01: topshirilgan yuk muhri — takror yuborishda AYNAN o'sha mazmun (LMS idempotency_key)
const HW_SEAL_KEY = \`ccHwSeal:\${HW_ID}\`;
const hwSealRead = () => { try { return JSON.parse(localStorage.getItem(HW_SEAL_KEY) || 'null'); } catch { return null; } };
const hwSealWrite = (p) => { try { localStorage.setItem(HW_SEAL_KEY, JSON.stringify(p)); } catch { /* jim */ } };
`);

const FINISH = /( {2}const finish = \(\) => \{\n {4}if \(finished\) return;\n {4}setFinished\(true\);\n {4}const passed = doneCount >= HW_PASS_MIN;\n)((?:(?! {4}if \(typeof onFinished).*\n)*?)( {4}if \(typeof onFinished === 'function'\) onFinished\(\{\n)((?:(?! {4}\}\);).*\n)*?)( {4}\}\);\n {2}\};\n)/;

let ok = 0, skip = 0, fail = 0;
for (const f of TARGETS) {
  let s = readFileSync(f, 'utf8');
  if (s.includes('hwSealWrite')) { skip++; console.log(`SKIP ${f}: allaqachon bor`); continue; }
  const m = FINISH.exec(s);
  if (!m) { fail++; console.log(`FAIL ${f}: finish qolipi topilmadi`); continue; }
  if (!/const hwWrite = \(o\) => \{/.test(s)) { fail++; console.log(`FAIL ${f}: hwWrite topilmadi`); continue; }
  const [full, head, pre, , obj, tail] = m;
  const yangi = `${head}${pre}    // F-0921-01: yuk muhrlanadi — takror yuborish (qayta ochilish, ikkinchi bosish) AYNAN o'sha mazmunni yuboradi
    const payload = hwSealRead() || {
${obj}    };
    hwSealWrite(payload);
    if (typeof onFinished === 'function') onFinished(payload);
  };

  // F-0921-01: hamma bosqich bajarilganda topshirish AVTOMAT ketadi — o'quvchi tugmani bosmasa ham LMS ptichkani
  // oladi va keyingi darsga o'ta oladi (tugma qoladi: bosilgach «✓ Topshirildi» ko'rinadi).
  useEffect(() => { if (!finished && doneCount >= HW_PASS_MIN) finish(); }, [doneCount, finished]); // eslint-disable-line
  // Topshirilgandan keyin vazifa qayta ochilsa — muhrlangan yuk BIR MARTA qayta yuboriladi (LMS birinchisini
  // olmagan bo'lsa ham ptichka yonadi; mazmun aynan o'sha — takror xavfsiz).
  useEffect(() => { if (finished && typeof onFinished === 'function') { const sealed = hwSealRead(); if (sealed) onFinished(sealed); } }, []); // eslint-disable-line
`;
  s = HELPERS(s.replace(full, yangi));
  let syn = '';
  try { transformSync(s, { loader: 'jsx', jsx: 'automatic' }); } catch (e) { syn = String(e.message).split('\n')[0]; }
  if (syn) { fail++; console.log(`FAIL ${f}: esbuild ${syn}`); continue; }
  ok++; if (WRITE) writeFileSync(f, s);
  console.log(`${WRITE ? 'YOZILDI' : 'quruq  '} ${f}`);
}
console.log(`\n${WRITE ? 'YOZISH' : 'QURUQ YURISH'}: mos ${ok} · o'tkazildi ${skip} · xato ${fail} · jami ${TARGETS.length}`);
process.exit(fail ? 1 : 0);
