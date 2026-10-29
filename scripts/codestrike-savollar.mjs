// ============================================================================
//  codestrike-savollar (F-1023-01, 26.10.2026) — har darsning CodeStrike savollarini alohida JSON faylga oladi.
//
//  Nega: Learn darsiga CodeStrike'dagi AYNAN o'sha 12 savol yuklanadi. Savollar qo'lda ko'chirilmaydi —
//  dars faylidagi `const QUIZ_BANK = [...]` dan skript bilan olinadi, shuning uchun farq qilolmaydi.
//
//  Doira: LMS_REESTR.json dagi darslar (CRM'dagi 172 ta). QUIZ_BANK'i yo'q dars ro'yxatda «yo'q» bo'lib qoladi.
//  Natija: codestrike-savollar/<M>-Modul/<NN>-<Dars>.json  (NN — CRM'dagi tartib)
//          codestrike-savollar/lms/<M>-Modul/<NN>-<Dars>-{uz,ru}.json  (LMS Learn'ga yuklanadigan shakl — uz va ru alohida)
//          codestrike-savollar/ROYXAT.md                    (hamma darslar jadvali)
//  JSON: { lessonId, key, modul, tartib, nom, src, barmoq_izi, savollar: [{ n, togri, uz: {savol, variantlar}, ru: {…} }] }
//  Matndagi teskari qo'shtirnoq (`kod`) olib tashlanadi — LMS uni ko'rsatmaydi.
//  barmoq_izi — QUIZ_BANK mazmunining md5'i (formatlashga bog'liq emas). Dars o'zgarsa, iz o'zgaradi.
//
//  LMS shakli (Learn JSON importi, 26.10 namunasi): har savol `selected-file` (bitta to'g'ri javob) —
//    { type, lang, question, order_number, options: [{ value, hint }], answer_index }
//  order_number: uz 1–12, ru 13–24 (CRM'da bitta dars ichida tillar uchun umumiy, takrorlanmaydi — 28.10).
//  Variant «0» → «0 (nol)» / «0 (ноль)» — CRM uni bo'sh deb rad etadi (28.10).
//  hint: CodeStrike'da izoh yo'q — to'g'ri variantga «To'g'ri!» / «Верно!», qolganlariga «Noto'g'ri» / «Неверно».
//
//  Ishlatish: node scripts/codestrike-savollar.mjs            — quruq yurish (hisobot, hech narsa yozilmaydi)
//             node scripts/codestrike-savollar.mjs --yoz      — fayllarni yozish (papka qayta yoziladi)
//             node scripts/codestrike-savollar.mjs --tekshir  — yozilgan JSON'lar darslardagi QUIZ_BANK bilan bir xilmi
//  Darslarga (src/) TEGMAYDI.
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { resolve, dirname, basename, join } from 'node:path';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
process.chdir(ROOT);
const YOZ = process.argv.includes('--yoz');
const TEKSHIR = process.argv.includes('--tekshir');
const OUT = 'codestrike-savollar';
const RED = '\x1b[31m', GRN = '\x1b[32m', DIM = '\x1b[2m', R = '\x1b[0m';

const reestr = JSON.parse(readFileSync('LMS_REESTR.json', 'utf8')).darslar;
const md5 = (s) => createHash('md5').update(s).digest('hex');

// Dars faylidan QUIZ_BANK massivini oladi (satr boshidagi «const QUIZ_BANK = [» dan satr boshidagi «];» gacha)
function bankOf(src) {
  const s = readFileSync(src, 'utf8');
  const a = s.search(/^const QUIZ_BANK = \[/m);
  if (a < 0) return null;
  const b = s.indexOf('\n];', a);
  if (b < 0) throw new Error('QUIZ_BANK oxiri topilmadi');
  const lit = s.slice(s.indexOf('[', a), b + 2);
  return vm.runInNewContext('(' + lit + ')', Object.create(null), { timeout: 1000 });
}

// Matn ikki xil yoziladi: { uz, ru } yoki bitta satr (ikkala tilda bir xil — odatda kod, masalan "`order.spec.ts`")
const til = (v, t) => (typeof v === 'string' ? v : v?.[t]);

// Savol shakli: 12 ta, har birida uz/ru matn, 4 variant (uz/ru), to'g'ri javob indeksi chegarada
function nuqsonlar(bank) {
  const x = [];
  if (bank.length !== 12) x.push(`savol soni ${bank.length} (12 emas)`);
  bank.forEach((q, i) => {
    const n = i + 1;
    for (const t of ['uz', 'ru']) if (typeof til(q.q, t) !== 'string' || !til(q.q, t).trim()) x.push(`${n}-savol: ${t} matni yo'q`);
    if (!Array.isArray(q.opts) || q.opts.length !== 4) x.push(`${n}-savol: variant soni ${q.opts?.length}`);
    (q.opts || []).forEach((o, j) => { for (const t of ['uz', 'ru']) if (typeof til(o, t) !== 'string' || !til(o, t).trim()) x.push(`${n}-savol ${j + 1}-variant: ${t} yo'q`); });
    if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct >= (q.opts || []).length) x.push(`${n}-savol: to'g'ri javob ${q.correct}`);
    for (const t of ['uz', 'ru']) { const v = (q.opts || []).map(o => String(til(o, t)).replace(/`/g, '')); if (new Set(v).size !== v.length) x.push(`${n}-savol: ${t} variantlari takrorlanadi`); }
  });
  return x;
}

// Teskari qo'shtirnoq (`kod`) olib tashlanadi: darsda u kod-shriftga aylanadi, LMS testi esa uni oddiy belgi qilib ko'rsatadi (26.10, foydalanuvchi)
const toza = (s) => s.replace(/`/g, '');
const savollar = (bank) => bank.map((q, i) => ({
  n: i + 1,
  togri: q.correct,
  uz: { savol: toza(til(q.q, 'uz')), variantlar: q.opts.map(o => toza(til(o, 'uz'))) },
  ru: { savol: toza(til(q.q, 'ru')), variantlar: q.opts.map(o => toza(til(o, 'ru'))) },
}));
const izOf = (bank) => md5(JSON.stringify(savollar(bank)));
const HINT = { uz: ["To'g'ri!", "Noto'g'ri"], ru: ['Верно!', 'Неверно'] };
// order_number bitta Learn ichida ikki til uchun UMUMIY va takrorlanmas (CRM bulk-uploader: «order_number=1 lesson_id=… da allaqachon
// mavjud», 28.10): uz 1–12, ru undan keyin davom etadi (13–24).
// CRM bulk-uploader faqat «0» dan iborat variantni bo'sh deb rad etadi («4-variant value bo'sh bo'lmasligi kerak», 28.10):
// «0» → «0 (nol)» / «0 (ноль)». Faqat LMS faylida; darsdagi CodeStrike va barmoq izi o'zgarmaydi.
const NOL = { uz: '0 (nol)', ru: '0 (ноль)' };
const lmsValue = (value, t) => (value.trim() === '0' ? NOL[t] : value);
const lmsOf = (sav, t) => sav.map(q => ({
  type: 'selected-file',
  lang: t,
  question: q[t].savol,
  order_number: t === 'ru' ? sav.length + q.n : q.n,
  options: q[t].variantlar.map((value, j) => ({ value: lmsValue(value, t), hint: HINT[t][j === q.togri ? 0 : 1] })),
  answer_index: q.togri,
}));
const lmsFayl = (fayl, t) => join(OUT, 'lms', fayl.slice(OUT.length + 1).replace(/\.json$/, `-${t}.json`));
const faylOf = (d) => join(OUT, `${d.modul}-Modul`, `${String(d.tartib).padStart(2, '0')}-${basename(d.src, '.jsx')}.json`);

const qatorlar = Object.entries(reestr)
  .map(([lessonId, d]) => ({ lessonId, ...d }))
  .sort((a, b) => a.modul - b.modul || a.tartib - b.tartib);

let bor = 0, yoq = 0, xato = 0;
const jadval = [], yozilsin = [];
for (const d of qatorlar) {
  let bank;
  try { bank = bankOf(d.src); } catch (e) { xato++; console.log(`${RED}✗${R} ${d.src}: ${e.message}`); jadval.push({ d, holat: `✗ ${e.message}` }); continue; }
  if (!bank) { yoq++; jadval.push({ d, holat: "CodeStrike yo'q" }); continue; }
  const x = nuqsonlar(bank);
  if (x.length) { xato++; console.log(`${RED}✗${R} ${d.src}: ${x.join(' · ')}`); jadval.push({ d, holat: `✗ ${x[0]}` }); continue; }
  bor++;
  const iz = izOf(bank);
  jadval.push({ d, holat: '✓', iz, fayl: faylOf(d) });
  yozilsin.push({ fayl: faylOf(d), json: { lessonId: d.lessonId, key: d.key, modul: d.modul, tartib: d.tartib, nom: { uz: d.nom_uz, ru: d.nom_ru }, src: d.src, barmoq_izi: iz, savollar: savollar(bank) } });
}

if (TEKSHIR) {
  // Yozilgan JSON ↔ darsdagi QUIZ_BANK: savol, variantlar tartibi, to'g'ri javob — hammasi aynan bir xil bo'lishi shart
  let ok = 0, farq = 0;
  for (const { fayl, json } of yozilsin) {
    if (!existsSync(fayl)) { farq++; console.log(`${RED}✗${R} ${fayl}: fayl yo'q`); continue; }
    const f = JSON.parse(readFileSync(fayl, 'utf8'));
    const ayni = JSON.stringify(f.savollar) === JSON.stringify(json.savollar) && f.barmoq_izi === json.barmoq_izi;
    const lmsAyni = ['uz', 'ru'].every(t => existsSync(lmsFayl(fayl, t)) && readFileSync(lmsFayl(fayl, t), 'utf8') === JSON.stringify(lmsOf(json.savollar, t), null, 2) + '\n');
    if (ayni && lmsAyni) ok++; else { farq++; console.log(`${RED}✗${R} ${fayl}: darsdagi savollar bilan farq qiladi${ayni ? ' (lms/ fayli)' : ''} (dars o'zgargan — qayta --yoz)`); }
  }
  console.log(`\nTekshiruv: ${GRN}${ok} bir xil${R} · ${farq ? RED : DIM}${farq} farq${R} · CodeStrike'siz ${yoq} · xato ${xato}`);
  process.exit(farq || xato ? 1 : 0);
}

console.log(`\nCRM darslari: ${qatorlar.length} · CodeStrike bor: ${GRN}${bor}${R} · yo'q: ${yoq} · xato: ${xato ? RED : DIM}${xato}${R}`);
if (!YOZ) { console.log(`${DIM}Quruq yurish — yozish uchun: --yoz${R}`); process.exit(xato ? 1 : 0); }

rmSync(OUT, { recursive: true, force: true });
for (const { fayl, json } of yozilsin) {
  mkdirSync(dirname(fayl), { recursive: true });
  writeFileSync(fayl, JSON.stringify(json, null, 2) + '\n');
  for (const t of ['uz', 'ru']) {
    mkdirSync(dirname(lmsFayl(fayl, t)), { recursive: true });
    writeFileSync(lmsFayl(fayl, t), JSON.stringify(lmsOf(json.savollar, t), null, 2) + '\n');
  }
}
const md = [
  '# CodeStrike savollari — darsma-dars (Learn uchun)',
  '',
  `AVTO: \`node scripts/codestrike-savollar.mjs --yoz\` (${new Date().toISOString().slice(0, 10)}). Qo'lda tahrirlanmaydi.`,
  'Savollar dars faylidagi `QUIZ_BANK` dan olingan — Learn\'dagi savollar CodeStrike bilan aynan bir xil.',
  'Bir xilligini tekshirish: `node scripts/codestrike-savollar.mjs --tekshir`.',
  '',
  `CRM darslari: ${qatorlar.length} · CodeStrike bor: ${bor} · yo'q: ${yoq} · xato: ${xato}`,
  '',
  '| Modul | Tartib | Dars | Kalit | Holat | Fayl | Barmoq izi |',
  '|---|---|---|---|---|---|---|',
  ...jadval.map(({ d, holat, iz, fayl }) => `| ${d.modul} | ${d.tartib} | ${d.nom_uz.replace(/\|/g, '\\|')} | ${d.key} | ${holat} | ${fayl ? '`' + fayl.slice(OUT.length + 1) + '`' : '—'} | ${iz ? iz.slice(0, 8) : '—'} |`),
  '',
];
writeFileSync(join(OUT, 'ROYXAT.md'), md.join('\n'));
console.log(`${GRN}Yozildi:${R} ${yozilsin.length} JSON + ${yozilsin.length * 2} LMS JSON (lms/, uz + ru) + ${OUT}/ROYXAT.md`);
