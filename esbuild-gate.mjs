#!/usr/bin/env node
// ============================================================================
// ESBUILD-GATE — sintaksis darvozasi (F-0820-180, KATTA_TOZALASH 18-band)
//
// Nega alohida skript kerak. Bu darvoza shu paytgacha `npm run` da UMUMAN YO'Q edi:
// u qo'lda, har seansda qayta yozilgan `npx esbuild …` buyrug'i sifatida yashagan.
// Oqibati 2026-08-20 da ko'rindi — to'liq-repo tekshiruvi 23 ta «qizil» berdi va
// ularning HECH BIRI haqiqiy nuqson emas edi: buyruqqa `.png` loader'i qo'shilmagan,
// `mentor.png` import qiladigan 23 fayl esa shundan yiqilgan. `vite build` ularni
// muammosiz quradi. Noto'g'ri sozlangan darvoza — YOLG'ON QIZIL beradi; bu yolg'on
// yashildan kam zarar emas: auditor vaqtini oladi va haqiqiy signalni ko'madi.
//
// Ishlatish:
//   node esbuild-gate.mjs                 → src/**/*.jsx
//   node esbuild-gate.mjs src/4-Modull    → papka
//   node esbuild-gate.mjs <fayl…>         → aniq fayllar
// Chiqish kodi: xato bor=1, yo'q=0.
// ============================================================================
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const RED = '\x1b[31m', GRN = '\x1b[32m', DIM = '\x1b[2m', B = '\x1b[1m', R = '\x1b[0m';

// ARXIV — QAMROVDAN TASHQARI (F-0820-197, foydalanuvchi qarori 2026-08-20).
// Bu papkalar `App.jsx` ga ULANMAGAN: hech qachon qurilmaydi, hech kim ko'rmaydi.
// Ularda 5 ta buzuq import bor (`../../assets/…` — papka `src/` dan bir qavat pastda,
// ya'ni yo'l repo ildiziga chiqib ketadi). Bu o'lik kod: uni «davolash» ham,
// darvozani u tufayli qizil qoldirish ham noto'g'ri — darvoza JONLI kodni qo'riqlaydi.
// Arxivning taqdiri (o'chirish yoki saqlash) — foydalanuvchi qarori, KATTA_TOZALASH 19-band.
const SKIP_DIRS = ['2-moodull eski', 'eski'];
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e.startsWith('.') || SKIP_DIRS.includes(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.jsx')) out.push(p);
  }
  return out;
}
function expand(list) {
  const out = [];
  for (const a of list) {
    let st;
    try { st = statSync(a); }
    catch { console.error(`${RED}✗ topilmadi: ${a}${R}`); process.exitCode = 2; continue; }
    if (st.isDirectory()) walk(a, out); else out.push(a);
  }
  return out;
}

const args = process.argv.slice(2);
const files = args.length ? expand(args) : walk('src');

// LOADER'LAR — darvozaning eng muhim qismi. Dars fayllari rasm/shrift import qiladi;
// loader berilmasa esbuild yiqiladi va nuqson YO'Q joyda «xato» ko'rsatadi.
const LOADERS = [
  '--loader:.jsx=jsx', '--loader:.js=jsx',
  '--loader:.png=dataurl', '--loader:.jpg=dataurl', '--loader:.jpeg=dataurl',
  '--loader:.svg=dataurl', '--loader:.webp=dataurl', '--loader:.gif=dataurl',
  '--loader:.woff=dataurl', '--loader:.woff2=dataurl',
];

let bad = 0;
console.log(`${B}\nESBUILD-GATE — ${files.length} fayl${R}`);
for (const f of files) {
  try {
    // ⚠️ WINDOWS + BO'SHLIQLI YO'L (F-0820-193). `npx` bu yerda `npx.cmd`, uni ishga
    // tushirish uchun `shell: true` kerak — lekin shell rejimida argumentlar QAYTA
    // bo'linadi va `src/2-moodull eski/…` kabi yo'l ikkiga yorilib ketadi
    // («src/2-moodull» va «eski/…» — ikkalasi ham topilmaydi). Shuning uchun shell
    // rejimida fayl yo'li qo'shtirnoqqa olinadi.
    const win = process.platform === 'win32';
    const arg = win ? `"${f}"` : f;
    execFileSync('npx', ['esbuild', arg, ...LOADERS, '--bundle', '--external:react', '--external:react-dom', '--outfile=' + (win ? 'NUL' : '/dev/null')],
      { stdio: 'pipe', shell: win });
  } catch (e) {
    bad++;
    const msg = String(e.stderr || e.stdout || e.message).split('\n').filter(Boolean).slice(0, 3).join('\n   ');
    console.log(`${RED}🔴 ${f}${R}\n   ${DIM}${msg}${R}`);
  }
}
console.log(bad ? `\n${RED}${B}🔴 ${bad} fayl qurilmadi${R}\n` : `${GRN}✓ TOZA — hammasi qurildi.${R}\n`);
process.exit(bad ? 1 : 0);
