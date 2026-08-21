#!/usr/bin/env node
// ============================================================================
// PROMPT-LINT — hujjat-gigiena darvozasi (PIPELINE.md 9-qoida, F-0724-01)
// Nima tutadi: BITTA so'z ichida lotin+kirill aralashgan homoglif-so'zlar
//   («ko'rinishда», «ekranга» — ko'zga bilinmaydi, mashina uchun boshqa belgi).
// Nima TEGMAYDI: sof-kirill so'zlar (ru: namunalar, rus-misollar) — ular ataylab.
// Ishlatish:
//   node prompt-lint.mjs             → skan (default skop: rol/qonun/jarayon MD'lar)
//   node prompt-lint.mjs --fix       → topilganlarni o'zbek-lotinga tuzatib YOZADI
//   node prompt-lint.mjs <fayl...>   → faqat berilgan fayllar
// Chiqish kodi: topilma bor=1 (darvoza), yo'q=0.
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';

const MAP = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'j','з':'z','и':'i',
  'й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t',
  'у':'u','ф':'f','х':'x','ц':'s','ч':'ch','ш':'sh','щ':'sh','ъ':"'",'ы':'i','ь':'',
  'э':'e','ю':'yu','я':'ya','ў':"o'",'қ':'q','ғ':"g'",'ҳ':'h',
};
for (const [k, v] of Object.entries({ ...MAP }))
  MAP[k.toUpperCase()] = v ? v[0].toUpperCase() + v.slice(1) : '';

const DEFAULT_SCOPE = [
  '.claude/agents',
  'CLAUDE.md', 'PIPELINE.md', 'PM_PIPELINE.md', 'OQUVCHI_DARVOZA.md',
  'DARS_ETALON.md', 'PM_DARS_ETALON.md', 'MATN_ETALONI.md',
  'PM_Prompt_v8.md', 'RU_I18N_SPEC.md',
  // QAMROV-TESHIGI YOPILDI (F-0820-170, 2026-08-20). Bu to'rttasi ro'yxatda YO'Q edi,
  // shuning uchun `KATTA_TOZALASH.md:61` dagi kirill «ади» darvozadan jim o'tib ketdi.
  // MATN_KORPUS va AUDIT_PROMPT — QONUN hujjatlari (matn yozishdan oldin o'qiladi),
  // KATTA_TOZALASH va MODUL_TUR — HOLAT hujjatlari: ikkalasi ham prompt sifatida o'qiladi.
  'MATN_KORPUS.md', 'AUDIT_PROMPT.md', 'KATTA_TOZALASH.md', 'MODUL_TUR.md',
  // ⚠️ `PIPELINE_STATE.md` va `PM_PIPELINE_STATE.md` ATAYLAB KIRITILMADI: ularda 8 ta
  // eski topilma bor va ikkala seans ham o'sha fayllarga yozadi — tuzatish to'qnashuv
  // xavfini tug'diradi. Parallel seans tugagach qo'shiladi (o'lchov: 2026-08-20).
];

const args = process.argv.slice(2);
const FIX = args.includes('--fix');
const given = args.filter(a => a !== '--fix');

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') && e.name !== '.claude') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.md')) out.push(p);
  }
}
let files = [];
for (const s of (given.length ? given : DEFAULT_SCOPE)) {
  const full = path.resolve(process.cwd(), s);
  if (!fs.existsSync(full)) continue;
  if (fs.statSync(full).isDirectory()) walk(full, files);
  else files.push(full);
}

const TOKEN = /[\p{L}\p{M}’‘ʻ'’‘ʻ-]+/gu;
const hasLat = (w) => /[A-Za-z]/.test(w);
const hasCyr = (w) => /[Ѐ-ӿ]/.test(w);
const fixWord = (w) => w.replace(/[Ѐ-ӿ]/g, (c) => MAP[c] ?? c);
// «PM-уроков» kabi defis-birikma (bir bo'lak sof-lotin, boshqasi sof-kirill) — QONUNIY
// (ruscha hujjatda brend/qisqartma). Xato — faqat BITTA defissiz bo'lak ichidagi aralashuv.
const isMixed = (w) => w.split('-').some(part => hasLat(part) && hasCyr(part));
// Jurnal-misol istisnosi: satrda «xatoWord → tuzatilgan» qayd bo'lsa (masalan
// MATN_ETALONI 8-bo'lim tarix-yozuvlari «holatда»→«holatda») — bu hujjatlangan misol, xato emas.
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isDocumentedExample = (line, w) => new RegExp(esc(w) + `[\`»"']*\\s*→`).test(line);

let total = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const lines = src.split('\n');
  const hits = [];
  lines.forEach((line, i) => {
    for (const m of line.matchAll(TOKEN)) {
      const w = m[0];
      if (isMixed(w) && !isDocumentedExample(line, w)) hits.push({ line: i + 1, w, fixed: fixWord(w) });
    }
  });
  if (!hits.length) continue;
  total += hits.length;
  const rel = path.relative(process.cwd(), f);
  for (const h of hits) console.log(`${rel}:${h.line}: «${h.w}» → «${h.fixed}»`);
  if (FIX) {
    let out = src;
    for (const h of hits) out = out.split(h.w).join(h.fixed);
    fs.writeFileSync(f, out);
    console.log(`  ✔ ${rel} tuzatildi (${hits.length})`);
  }
}
console.log(total === 0 ? '✅ prompt-lint: aralash-yozuv so\'z topilmadi.' : `${FIX ? '🔧' : '⚠️'} jami: ${total} ta aralash-yozuv so'z${FIX ? ' tuzatildi' : ''} (${files.length} fayl skan qilindi).`);
process.exit(total > 0 && !FIX ? 1 : 0);
