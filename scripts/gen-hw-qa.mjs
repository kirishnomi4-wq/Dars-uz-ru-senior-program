#!/usr/bin/env node
// ============================================================================
// gen-hw-qa — QA ko'rik-sayti uchun ma'lumotni IKKI manbadan yig'adi:
//   1) uyga-vazifa/<modul>/*.md  → o'quvchi ko'radigan savol matni (uz + ru), savol-turi
//   2) yuklash-<sana>/<modul>/ROYXAT.md → darsning ASL mavzu nomi (uz + ru), CRM tartibi
//
// Nega ikki manba. Paket sarlavhasidagi kod (masalan «M1-06») darslar qayta
// tartiblanganda yangilanmagan — CSS asoslari CRM'da 1-07, VS Code 1-10, HTML
// takrorlash 1-05. Saytda CRM tartibi asos qilinadi, eski kod yon-eslatma bo'lib
// qoladi (QA «bu qaysi dars?» deb chalkashmasin).
//
// Natija: src/hw-qa/data.js — qo'lda tahrirlanmaydi, har safar shu skript yozadi.
// Ishlatish: npm run gen:hwqa
// ============================================================================
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const HW = path.join(ROOT, 'uyga-vazifa');
const OUT = path.join(ROOT, 'src', 'hw-qa', 'data.js');
const FENCE = '`' + '`' + '`'; // markdown kod-chegarasi (satr sifatida — fayl o'zi .js)

// ── yuklash-papkasi: eng yangisi avtomatik tanlanadi ────────────────────────
const yuklashDirs = readdirSync(ROOT)
  .filter((n) => /^yuklash-\d{4}-\d{2}-\d{2}$/.test(n) && statSync(path.join(ROOT, n)).isDirectory())
  .sort();
if (!yuklashDirs.length) {
  console.error("🔴 yuklash-<sana>/ papkasi topilmadi — dars nomlari shu yerdan olinadi.");
  process.exit(1);
}
const YUK = path.join(ROOT, yuklashDirs[yuklashDirs.length - 1]);

// ── 1) ROYXAT.md → darslar reyestri ────────────────────────────────────────
// Satr naqshi: | ☐ | 03 | Kod | **HTML asoslari** | Основы HTML | `03-Htmllesson1.jsx` | `html-01-v17` | md5 |
const QATOR = /^\|\s*☐\s*\|\s*([0-9.]+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*`([^`]+)`\s*\|\s*`([^`]+)`/;

const darslar = [];
for (const d of readdirSync(YUK).sort()) {
  const royxat = path.join(YUK, d, 'ROYXAT.md');
  if (!existsSync(royxat)) continue;
  const txt = readFileSync(royxat, 'utf8');
  const bosh = txt.split('\n')[0].replace(/^#\s*/, '').trim(); // «1-Modul — Men internetdaman»
  const modulKod = d.replace(/-Modul$/, ''); // 1, 2, 3, 4, 4a, 4b, 4c
  const modulNom = bosh.includes('—') ? bosh.split('—').slice(1).join('—').trim() : bosh;
  const crmSatr = txt.split('\n').find((l) => l.startsWith("CRM'da:")) || '';
  const crmBolim = (crmSatr.match(/\*\*(.+?)\*\*/) || [, ''])[1];

  for (const satr of txt.split('\n')) {
    const m = satr.match(QATOR);
    if (!m) continue;
    const fayl = m[5].trim();
    darslar.push({
      modulKod,
      modulNom,
      crmBolim,
      num: m[1].trim(),
      turDars: m[2].trim(), // Kod · PM · Proyekt · Uyga vazifa
      nomUz: m[3].replace(/\*\*/g, '').trim(),
      nomRu: m[4].replace(/\*\*/g, '').trim(),
      lessonId: m[6].trim(),
      comp: fayl.replace(/^\d+-/, '').replace(/\.jsx$/, ''),
    });
  }
}

// ── 2) uyga-vazifa/*.md → paketlar ─────────────────────────────────────────
// Sarlavha: # 🏠 LMS-PAKET — Htmllesson1 (M1-03) · savol-turi: Kompilyator
const H1 = /LMS-PAKET\s*—\s*(.+?)\s*\(([^)]+)\)\s*·\s*savol-turi:\s*(.+)$/;

function paketniOqi(faylYoli, nisbiy) {
  const matn = readFileSync(faylYoli, 'utf8');
  const satrlar = matn.split('\n');

  const h = satrlar[0].match(H1);
  if (!h) return { xato: 'sarlavha naqshga tushmadi', nisbiy };

  // Sarlavhadan keyingi, birinchi «---» gacha bo'lgan «>» eslatmalari (sozlama, namuna-rasm)
  const eslatma = [];
  for (const s of satrlar.slice(1)) {
    if (s.startsWith('---')) break;
    if (s.startsWith('>')) eslatma.push(s.replace(/^>\s?/, '').trim());
  }

  // Bo'limlar: ## `uz` · Savol  →  keyingi kod-blok
  const bolimlar = [];
  for (let i = 0; i < satrlar.length; i++) {
    const b = satrlar[i].match(/^##\s+`(uz|ru)`\s*·\s*(.+?)\s*$/);
    if (!b) continue;
    let j = i + 1;
    while (j < satrlar.length && !satrlar[j].startsWith(FENCE)) j++;
    if (j >= satrlar.length) continue;
    const boshi = j + 1;
    let oxiri = boshi;
    while (oxiri < satrlar.length && !satrlar[oxiri].startsWith(FENCE)) oxiri++;
    bolimlar.push({
      til: b[1],
      yorliq: b[2].trim(),
      matn: satrlar.slice(boshi, oxiri).join('\n').trim(),
    });
  }

  return {
    comp: h[1].trim(),
    eskiKod: h[2].trim(),
    savolTuri: h[3].trim(),
    eslatma,
    bolimlar,
    nisbiy,
  };
}

const paketlar = [];
for (const d of readdirSync(HW).sort()) {
  const dir = path.join(HW, d);
  if (!statSync(dir).isDirectory()) continue;
  for (const f of readdirSync(dir).sort()) {
    if (!f.endsWith('.md')) continue;
    paketlar.push(paketniOqi(path.join(dir, f), `uyga-vazifa/${d}/${f}`));
  }
}

// ── 3) moslash: paket-komponenti → CRM darsi ───────────────────────────────
// Ba'zi paketlarda nom qisqartirilgan: «HtmlTakrorlash» → HtmlTakrorlashLesson,
// «VsCode» → VsCodeLesson. Shuning uchun uch bosqichli qidiruv.
const index = new Map(darslar.map((l) => [l.comp.toLowerCase(), l]));
function darsTop(comp) {
  const c = comp.toLowerCase();
  return index.get(c) || index.get(c + 'lesson') || darslar.find((l) => l.comp.toLowerCase().startsWith(c)) || null;
}

const yigilgan = [];
const muammolar = [];

for (const p of paketlar) {
  if (p.xato) { muammolar.push(`${p.nisbiy}: ${p.xato}`); continue; }
  const dars = darsTop(p.comp);
  if (!dars) { muammolar.push(`${p.nisbiy}: «${p.comp}» ROYXAT.md da topilmadi`); continue; }

  // O'quvchi ko'radigan matn — AI prompt bo'limlari tashlab yuboriladi (QA qarori: ko'rsatilmaydi)
  const oquvchi = (til) => p.bolimlar.filter((b) => b.til === til && !/AI prompt/i.test(b.yorliq))
    .map((b) => ({ yorliq: b.yorliq, matn: b.matn }));

  const uz = oquvchi('uz');
  const ru = oquvchi('ru');
  if (!uz.length) muammolar.push(`${p.nisbiy}: uz matni topilmadi`);
  if (!ru.length) muammolar.push(`${p.nisbiy}: ru matni topilmadi`);

  // Namuna-rasm: paket faylining prefiksi bo'yicha yonidan qidiriladi (m1-03-uyga-vazifa-uz.png)
  const dir = path.dirname(path.join(ROOT, p.nisbiy));
  const prefiks = path.basename(p.nisbiy).split('-').slice(0, 2).join('-');
  const rasm = {};
  for (const til of ['uz', 'ru']) {
    const nom = `${prefiks}-uyga-vazifa-${til}.png`;
    if (existsSync(path.join(dir, nom))) rasm[til] = `${path.dirname(p.nisbiy)}/${nom}`;
  }

  // Sozlama satri (Tip koda / AI Agent) — LMS'da nima belgilanishi; QA uchun kontekst
  const sozlama = p.eslatma.find((e) => e.startsWith('Sozlama:'))?.replace(/^Sozlama:\s*/, '') || '';

  yigilgan.push({
    slug: dars.comp.toLowerCase(),        // barqaror URL kaliti (tartib o'zgarsa ham buzilmaydi)
    modulKod: dars.modulKod,
    modulNom: dars.modulNom,
    crmBolim: dars.crmBolim,
    num: dars.num,
    turDars: dars.turDars,
    nomUz: dars.nomUz,
    nomRu: dars.nomRu,
    lessonId: dars.lessonId,
    savolTuri: p.savolTuri,
    sozlama,
    eskiKod: p.eskiKod,
    // Eski kod CRM tartibiga mos kelmasa — saytda ogohlantirish chipi chiqadi
    kodMos: p.eskiKod.split('-')[1] === dars.num.padStart(2, '0'),
    fayl: p.nisbiy,
    uz,
    ru,
    _rasm: rasm,
  });
}

// ── 4) tartib: modul → CRM raqami ──────────────────────────────────────────
const MODUL_TARTIB = ['1', '2', '3', '4', '4a', '4b', '4c'];
yigilgan.sort((a, b) => {
  const m = MODUL_TARTIB.indexOf(a.modulKod) - MODUL_TARTIB.indexOf(b.modulKod);
  return m !== 0 ? m : parseFloat(a.num) - parseFloat(b.num);
});

// ── 5) data.js yozish ──────────────────────────────────────────────────────
// Rasmlar Vite orqali import qilinadi (dist ichiga xesh bilan tushadi, public/ kerak emas).
const importlar = [];
for (const d of yigilgan) {
  d.rasmVar = {};
  for (const [til, yol] of Object.entries(d._rasm)) {
    const nom = `r${importlar.length}`;
    importlar.push(`import ${nom} from '../../${yol}'`);
    d.rasmVar[til] = nom;
  }
  delete d._rasm;
}

const gavda = yigilgan.map((d) => {
  const rasmVar = d.rasmVar;
  delete d.rasmVar;
  const juft = Object.entries(rasmVar).map(([t, v]) => `${t}: ${v}`).join(', ');
  const json = JSON.stringify(d, null, 2).split('\n').map((l, i) => (i ? '  ' + l : l)).join('\n');
  return json.replace(/\n  \}$/, `,\n    "rasm": ${juft ? `{ ${juft} }` : 'null'}\n  }`);
}).join(',\n  ');

const chiqish = `// ⚠️ AVTO-YARATILGAN FAYL — qo'lda tahrirlanmaydi.
// Manba: uyga-vazifa/<modul>/*.md + ${path.basename(YUK)}/<modul>/ROYXAT.md
// Qayta yig'ish: npm run gen:hwqa
${importlar.join('\n')}

export const YIGILGAN = ${JSON.stringify(new Date().toISOString().slice(0, 10))}
export const MANBA = ${JSON.stringify(path.basename(YUK))}

export const DARSLAR = [
  ${gavda}
]
`;

writeFileSync(OUT, chiqish, 'utf8');

// ── 6) hisobot ─────────────────────────────────────────────────────────────
const turlar = {};
yigilgan.forEach((d) => { turlar[d.savolTuri] = (turlar[d.savolTuri] || 0) + 1; });
const modullar = {};
yigilgan.forEach((d) => { modullar[d.modulKod] = (modullar[d.modulKod] || 0) + 1; });

console.log(`\n  gen-hw-qa — ${yigilgan.length} dars yig'ildi → src/hw-qa/data.js`);
console.log(`  Manba-royxat: ${path.basename(YUK)}`);
console.log(`  Modullar: ${Object.entries(modullar).map(([k, v]) => `${k}=${v}`).join(' · ')}`);
console.log(`  Savol-turlari: ${Object.entries(turlar).map(([k, v]) => `${k}=${v}`).join(' · ')}`);
console.log(`  Namuna-rasm: ${importlar.length} ta fayl`);
const nomos = yigilgan.filter((d) => !d.kodMos);
if (nomos.length) {
  console.log(`\n  ⚠️  Paket kodi CRM tartibiga mos emas (${nomos.length} dars — saytda chip bilan ko'rsatiladi):`);
  nomos.forEach((d) => console.log(`     ${d.eskiKod} → ${d.modulKod}-${d.num}  ${d.nomUz}`));
}
if (muammolar.length) {
  console.log(`\n  🔴 MUAMMOLAR (${muammolar.length}):`);
  muammolar.forEach((m) => console.log(`     ${m}`));
  process.exit(1);
}
console.log('');
