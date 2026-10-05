// qurish-kartasi — QOIDALAR.md dan skript ko'rmaydigan («karta») qoidalarni bitta sahifaga yig'adi (mexanizm 3-bosqich, 04.10).
// Karta qo'lda tahrirlanmaydi: qoida o'zgarsa — QOIDALAR.md tuzatiladi va shu skript qayta yurgiziladi.
//   node scripts/qurish-kartasi.mjs            → konveyer/QURISH_KARTASI.md
//   node scripts/qurish-kartasi.mjs --check    → karta reestrdan eskirgan bo'lsa chiqish kodi 1 (modul:yopish shuni tekshiradi)
import fs from 'node:fs';

const SRC = 'QOIDALAR.md';
const OUT = 'konveyer/QURISH_KARTASI.md';
const GURUH = [
  ['T', 'Til', 'MD yozuvchi · metodist'],
  ['P', 'Tuzilma va pedagogika', 'MD yozuvchi · quruvchi'],
  ['S', 'Savol, test, izoh, nishon', 'MD yozuvchi · jonli'],
  ['PM', 'PM darslari', 'MD yozuvchi (PM)'],
  ['U', "Ko'rinish, joylashuv, telefon", 'quruvchi · vizual'],
  ['K', 'Kod-konvensiya', 'quruvchi'],
  ['J', 'Jonli ball, mentor ekrani', 'jonli'],
  ['R', 'Rus tili', 'RU tarjimon'],
  ['JR', 'Jarayon', 'asosiy seans'],
];
const rows = fs.readFileSync(SRC, 'utf8').split('\n')
  .filter((l) => /^\| [A-Z]+-\d+ \|/.test(l))
  .map((l) => l.split('|').map((c) => c.trim()))
  .map((c) => ({ id: c[1], qoida: c[2], qamrov: c[3], tekshiruv: c[4], manba: c[5] }))
  .filter((r) => /karta/i.test(r.tekshiruv))
  .filter((r) => r.id.split('-')[0] !== 'Z');   // Z — ziddiyatlar jadvali (boshqa ustunlar); qarori qoidalarning o'zida
const by = new Map();
for (const r of rows) { const g = r.id.split('-')[0]; if (!by.has(g)) by.set(g, []); by.get(g).push(r); }
const L = [
  '# Qurish kartasi — skript ko\'rmaydigan qoidalar (bir sahifa)',
  '',
  `> Avtomatik yig'ilgan: \`node scripts/qurish-kartasi.mjs\` · manba \`${SRC}\` («Tekshiruv» ustunida «karta») · ${rows.length} qoida.`,
  '> Qo\'lda tahrirlamang — qoida o\'zgarsa reestr tuzatiladi va karta qayta yig\'iladi. Skript tekshiradiganlari bu yerda yo\'q: ular `npm run gates` da.',
  '> Ishlatish: MD yozishdan oldin (T · P · S · PM) va kod qurishdan oldin (U · K · J · R) — o\'z guruhingizni o\'qing; GATE M va sadoqat-tekshiruvida shu karta bo\'yicha belgilanadi.',
  '',
];
const known = new Set(GURUH.map((g) => g[0]));
for (const [g, nom, kim] of [...GURUH, ...[...by.keys()].filter((g) => !known.has(g)).map((g) => [g, `${g} (guruh nomi yo'q — GURUH ga qo'shing)`, '—'])]) {
  const list = by.get(g); if (!list || !list.length) continue;
  L.push(`## ${g} · ${nom} — ${list.length} (${kim})`, '');
  for (const r of list) L.push(`- [ ] **${r.id}** ${r.qoida}${r.qamrov && !/^hamma/.test(r.qamrov) ? ` _(${r.qamrov})_` : ''}`);
  L.push('');
}
const text = L.join('\n');
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur !== text) { console.log(`✗ ${OUT} reestrdan eskirgan — node scripts/qurish-kartasi.mjs`); process.exit(1); }
  console.log(`✓ ${OUT} reestr bilan bir xil (${rows.length} qoida)`); process.exit(0);
}
fs.writeFileSync(OUT, text);
console.log(`${OUT}: ${rows.length} qoida, ${by.size} guruh`);
