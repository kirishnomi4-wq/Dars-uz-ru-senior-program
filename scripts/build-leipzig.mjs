#!/usr/bin/env node
// ============================================================
// build-leipzig.mjs — Leipzig chastotali ro'yxatdan TOP-5000 so'z
//
// Manba: leksika/sources/leipzig/<korpus>/<korpus>-words.txt
//        (format: id \t so'z \t chastota)
// Natija: leksika/sources/leipzig-top5000.json   — ["va","bilan",...]
//         leksika/sources/leipzig-top5000.tsv    — so'z \t chastota (ko'rish uchun)
//         leksika/sources/leipzig-cyrillic.json  — tashlangan kirillcha so'zlar
//
// Ishlatish:
//   node scripts/build-leipzig.mjs                       # default korpus
//   node scripts/build-leipzig.mjs uzb_wikipedia_2021_100K [yana_korpus ...]
//   node scripts/build-leipzig.mjs --top=8000 ...
// ============================================================

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'leksika', 'sources');
const LEIPZIG = path.join(SRC, 'leipzig');

const args = process.argv.slice(2);
const TOP = Number((args.find(a => a.startsWith('--top=')) || '--top=5000').slice(6));
const corpora = args.filter(a => !a.startsWith('--'));
if (!corpora.length) corpora.push('uzb_wikipedia_2021_100K');

// ---- Normalizatsiya: apostrof variantlari (oʻ, o', o`, o', o') → ' ; kichik harf
const norm = (s) => s
  .replace(/[ʻʼ‘’‛`´]/g, "'")
  .toLowerCase();

// Faqat lotin-o'zbek: a-z va tutuq belgisi. Harf bilan boshlanadi va tugaydi,
// apostrof ketma-ket kelmaydi. (sh, ch, ng, oʻ, gʻ shu qoidaga sig'adi.)
const LATIN_UZ = /^[a-z]+(?:'[a-z]+)*$/;
const CYRILLIC = /[Ѐ-ӿ]/;

const freq = new Map();      // so'z → yig'ma chastota
const cyr = new Map();       // kirillcha so'zlar (tashlanadi, alohida saqlanadi)
let rows = 0, dropped = 0;

for (const c of corpora) {
  const file = path.join(LEIPZIG, c, `${c}-words.txt`);
  if (!fs.existsSync(file)) { console.error(`❌ Topilmadi: ${path.relative(ROOT, file)}`); process.exit(1); }
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  for (const line of lines) {
    if (!line) continue;
    const parts = line.split('\t');
    if (parts.length < 3) continue;
    rows++;
    const raw = parts[1].trim();
    const n = Number(parts[2]);
    if (!raw || !Number.isFinite(n)) continue;
    if (CYRILLIC.test(raw)) { cyr.set(raw.toLowerCase(), (cyr.get(raw.toLowerCase()) || 0) + n); continue; }
    const w = norm(raw);
    if (!LATIN_UZ.test(w)) { dropped++; continue; }   // raqam, belgi, aralash → tashla
    freq.set(w, (freq.get(w) || 0) + n);              // Bu + bu → bitta yozuv
  }
  console.log(`📥 ${c}: ${lines.length} qator`);
}

const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
const top = sorted.slice(0, TOP);

fs.mkdirSync(SRC, { recursive: true });
fs.writeFileSync(path.join(SRC, 'leipzig-top5000.json'), JSON.stringify(top.map(([w]) => w), null, 0) + '\n');
fs.writeFileSync(path.join(SRC, 'leipzig-top5000.tsv'), top.map(([w, n]) => `${w}\t${n}`).join('\n') + '\n');
fs.writeFileSync(path.join(SRC, 'leipzig-cyrillic.json'),
  JSON.stringify([...cyr.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w), null, 0) + '\n');

console.log(`\n— Manba qatorlari: ${rows}`);
console.log(`— Lotin so'z (unikal, normalizatsiyadan keyin): ${freq.size}`);
console.log(`— Tashlangan (raqam/belgi/aralash): ${dropped}`);
console.log(`— Kirillcha (alohida faylga): ${cyr.size}`);
console.log(`— TOP-${TOP} → leksika/sources/leipzig-top5000.json`);
console.log(`\nBirinchi 50:\n${top.slice(0, 50).map(([w]) => w).join(', ')}`);
