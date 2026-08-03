// jsx-lint — DARS FAYLLARIDAGI "JIM" BUZILISHLAR detektori.
//
// Nega kerak: esbuild va `vite build` faqat SINTAKSISNI tekshiradi. Quyidagi xatolar
// sintaktik jihatdan to'g'ri qoladi, lekin darslik BRAUZERDA oq ekran beradi —
// ya'ni ikkala mavjud darvozadan ham o'tib ketadi (F-0802-15 dalili).
//
// 1) CSS-ichida-backtik: dars CSS'i <style>{`…`}</style> template-literalida yashaydi.
//    Izohga `.mt-chip` kabi backtikli yozuv qo'yilsa — satr ERTA yopiladi, qolgani JS
//    sifatida o'qiladi va `ReferenceError: chip is not defined` bo'ladi.
// 2) Bir-qatorli funksiya ichida `//` izoh: `const upd = () => { const z = …; setProperty(…); };`
//    ga `//` qo'shilsa, qatorning QOLGANI kommentga aylanadi (F-0802-14 dalili) —
//    bunisini esbuild tutadi, lekin faqat qavs buzilsa; ba'zan jim o'tadi.
//
// Ishlatish: `npm run lint:jsx` (barcha darslar) yoki `node jsx-lint.mjs <fayl…>`

import { readFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RED = '\x1b[31m', YEL = '\x1b[33m', GRN = '\x1b[32m', B = '\x1b[1m', R = '\x1b[0m';

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.jsx')) out.push(p);
  }
  return out;
}

const args = process.argv.slice(2);
const files = args.length ? args : walk('src');

let errors = 0;
const report = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const hits = [];

  // ---- 1) <style>{`…`}</style> bloki ichida qo'shimcha backtik ----
  const OPEN = '<style>{`', CLOSE = '`}</style>';
  let idx = 0;
  while ((idx = src.indexOf(OPEN, idx)) !== -1) {
    const start = idx + OPEN.length;
    const end = src.indexOf(CLOSE, start);
    if (end === -1) {
      hits.push({ line: src.slice(0, idx).split('\n').length, msg: 'style bloki YOPILMAGAN (`}</style> topilmadi)' });
      break;
    }
    const body = src.slice(start, end);
    if (body.includes('`')) {
      const before = src.slice(0, start).split('\n').length;
      body.split('\n').forEach((ln, k) => {
        if (ln.includes('`')) hits.push({ line: before + k, msg: `CSS ichida backtik — template-literal erta yopiladi: ${ln.trim().slice(0, 70)}` });
      });
    }
    idx = end + CLOSE.length;
  }

  // ---- 2) bir-qatorli funksiya tanasi ichida `//` izoh ----
  // Naqsh: `=> {` … `//` … va O'SHA qatorda keyin `}` yopilishi kutiladi.
  // ⚠️ Qator-ichidagi satr-literallari hisobga olinadi: kod-namunalaridagi "http://…" va
  // qo'shtirnoq ichidagi "=> {" yolg'on-ijobiy bermasin (F-0802-15 kalibrovkasi).
  const scanOutsideStrings = (ln) => {
    const marks = { arrow: -1, cmt: -1, close: -1 };
    let q = null;
    for (let i = 0; i < ln.length; i++) {
      const ch = ln[i];
      if (q) { if (ch === '\\') i++; else if (ch === q) q = null; continue; }
      if (ch === '"' || ch === "'" || ch === '`') { q = ch; continue; }
      if (marks.arrow === -1 && ch === '=' && ln.slice(i, i + 4) === '=> {') { marks.arrow = i; i += 3; continue; }
      if (marks.arrow === -1) continue;
      if (marks.cmt === -1 && ch === '/' && ln[i + 1] === '/' && ln[i - 1] !== ':') marks.cmt = i;
      if (marks.close === -1 && ch === '}') marks.close = i;
    }
    return marks;
  };
  src.split('\n').forEach((ln, k) => {
    const { arrow, cmt, close } = scanOutsideStrings(ln);
    if (arrow === -1 || cmt === -1) return;
    if (close === -1) return;      // ko'p qatorli funksiya — xavf yo'q
    if (close < cmt) return;       // tana izohdan OLDIN yopilgan — xavfsiz
    hits.push({ line: k + 1, msg: `bir-qatorli funksiya ichida // izoh — qatorning qolgani o'chadi: ${ln.trim().slice(0, 70)}` });
  });

  // ---- 3) DARS TUZILMASI (F-0803-06). Qonun hujjatda yozilgani yetmasligi 2026-08-02/03 da
  // to'rt marta isbotlandi (60-qonun 6 faylda, 54-qonun 2 faylda qolib ketgan edi) — shuning
  // uchun tuzilma-qoidalari shu yerda MEXANIK tekshiriladi.
  const metaBlock = /const SCREEN_META = \[([\s\S]*?)\n\];/.exec(src);
  if (metaBlock) {
    const body = metaBlock[1];
    const lineOf = (idx) => src.slice(0, metaBlock.index + idx).split('\n').length;
    // (a) CodeStrike alohida ekran BO'LMAYDI — u har doim YAKUN sahifasida
    const ar = /type: 'arena'/.exec(body);
    if (ar) hits.push({ line: lineOf(ar.index), msg: "SCREEN_META da alohida 'arena' ekrani — CodeStrike YAKUN sahifasi ichida bo'ladi (P0 PmUserStory / PmLesson2 etaloni)" });
    // (b) uy-vazifa IKKI joyda bo'lmaydi: alohida ekran + yakun-kartasi = dublikat
    const hw = /type: 'homework'/.exec(body);
    const hwInSummary = /className="card hw |hw-big-t/.test(src);
    if (hw && hwInSummary) hits.push({ line: lineOf(hw.index), msg: "uy-vazifa IKKI joyda: alohida 'homework' ekrani + YAKUN sahifasidagi karta — bittasi olib tashlanadi (etalon: yakun ichida)" });
    // (c) SCREEN_META va screens[] uzunligi teng (indeks-siljish bug-sinfi)
    const scr = /const screens = \[([^\]]*)\]/.exec(src);
    if (scr) {
      const nMeta = (body.match(/id: '/g) || []).length;
      const nScr = scr[1].split(',').filter(x => x.trim()).length;
      if (nMeta !== nScr) hits.push({ line: src.slice(0, scr.index).split('\n').length, msg: `SCREEN_META (${nMeta}) va screens[] (${nScr}) uzunligi TENG EMAS — ekran-siljishi` });
    }
  }
  // 🔴 (c2) ANIQLANMAGAN `tr()` — bir tilli darsga ikki tilli kod qo'shilsa, esbuild JIM
  // o'tadi, brauzerda esa `tr is not defined` → OQ EKRAN (F-0803-08 dalili: 19 fayl).
  if (/\btr\(/.test(src) && !/\btr\s*=\s*\(|function tr\s*\(/.test(src) && !/import[^\n]*\btr\b/.test(src)) {
    const m = /\btr\(/.exec(src);
    hits.push({ line: src.slice(0, m.index).split('\n').length, msg: 'tr() ishlatilgan, lekin faylda aniqlanmagan/import qilinmagan — brauzerda «tr is not defined» (oq ekran)' });
  }

  // (d) YAKUN TARTIBI (PmLesson2 etaloni, F-0803-08): «Endi siz bilasiz» va uy-vazifa
  // yonma-yon `split` da TURMAYDI — recap to'liq enli, undan keyin kapsula-tugma.
  const hwCard = /<div className="card hw fade-up d4">/.exec(src);
  if (hwCard) {
    const head = src.lastIndexOf('<div className="split">', hwCard.index);
    if (head !== -1 && src.slice(head, hwCard.index).length < 2200)
      hits.push({ line: src.slice(0, hwCard.index).split('\n').length, msg: "YAKUN tartibi: uy-vazifa kartasi recap bilan `split` da yonma-yon — recap to'liq enli, uy-vazifa esa `hw-big` kapsulasi ostida bo'ladi (PmLesson2 etaloni)" });
  }
  // (e) 54-qonun: YAKUN hero'sida h-sub tasalli-qatori bo'lmaydi (sarlavha o'zi yetadi)
  const hsub = /className="body h-sub fade-up d2">\s*\{(?:PASSED|tr\(PASSED)/.exec(src);
  if (hsub) hits.push({ line: src.slice(0, hsub.index).split('\n').length, msg: "54-qonun: YAKUN hero'sidagi h-sub qatori («Yaxshi harakat…» / «Tabriklaymiz…») olib tashlanadi — sarlavha o'zi yetadi" });

  if (hits.length) {
    errors += hits.length;
    report.push({ file, hits });
  }
}

console.log(`${B}\nJSX-LINT — ${files.length} fayl tekshirildi${R}`);
if (!errors) {
  console.log(`${GRN}✓ TOZA — hech qanday topilma yo'q.${R}\n`);
  process.exit(0);
}
console.log(`${RED}🔴 error: ${errors}${R} · fayllar: ${report.length}\n`);
for (const { file, hits } of report) {
  console.log(`${B}${file}${R}  ${RED}🔴${hits.length}${R}`);
  for (const h of hits) console.log(`  ${RED}🔴${R} ${file}:${h.line} → ${h.msg}`);
}
console.log('');
process.exit(1);
