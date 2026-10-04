#!/usr/bin/env node
// ============================================================================
// GATES — beshala darvozani BITTA buyruqda yurgizadi (F-0820-193).
//
// Nega alohida runner kerak. `package.json` da zanjir `&&` bilan yozilgan edi:
//     "gates": "node esbuild-gate.mjs && node jsx-lint.mjs && …"
// `npm run gates -- <fayl>` chaqirilganda npm argumentni butun satrning OXIRIGA
// qo'shadi — ya'ni u faqat ZANJIRDAGI OXIRGI vositaga tushadi, qolgan to'rttasi esa
// butun `src/` ni skanlaydi. Natija: «bitta faylni tekshirdim» deb o'ylaysan, aslida
// to'rttasi butun reponi ko'radi va begona topilmalar hisobotga aralashadi.
// Shuning uchun argument runner darajasida ushlanadi va BESHALASIGA uzatiladi.
//
// Ishlatish:
//   npm run gates                 → butun `src/`
//   npm run gates -- <fayl|papka> → faqat o'sha
//   node gates.mjs <fayl…>        → to'g'ridan-to'g'ri
// Chiqish kodi: birorta darvoza yiqilsa 1.
// ============================================================================
import { spawnSync } from 'node:child_process';

const RED = '\x1b[31m', GRN = '\x1b[32m', DIM = '\x1b[2m', B = '\x1b[1m', R = '\x1b[0m';

// Tartib MUHIM: avval sintaksis (esbuild), keyin ma'no (jsx), keyin ko'rinish (dark),
// keyin til, oxirida hujjat-gigiena. Sintaksis siniq bo'lsa qolganini ko'rish behuda.
const TOOLS = [
  { id: 'esbuild', file: 'esbuild-gate.mjs' },
  // F-0927 (foydalanuvchi S4): e'lon qilinmagan o'zgaruvchi = bosilgandan keyin OQ EKRAN (JsVars s5 prod bug'i) —
  // esbuild ham, jsx ham buni ko'rmaydi. oxlint no-undef, konfig: oxlint-undef.json
  { id: 'undef', bin: 'node_modules/.bin/oxlint', pre: ['-c', 'oxlint-undef.json', '-A', 'all', '-D', 'no-undef'], dflt: ['src'] },
  { id: 'jsx', file: 'jsx-lint.mjs' },
  { id: 'keys', file: 'scripts/lint-keys.mjs' }, // F-0916-03: INLINE_KEYS s-kalitlari == scored ekranlar (server total_questions shu kalitdan)
  { id: 'dark', file: 'dark-lint.mjs' },
  { id: 'til', file: 'til-lint.mjs' },
  { id: 'tell', file: 'lint-tell.mjs' },   // F-0929-18 D5: test javobi sotilmasin (8.4)
  { id: 'emoji', file: 'lint-emoji.mjs' }, // 161-qonun: emoji belgi, ma'no emas
  { id: 'olchov', file: 'lint-olchov.mjs' }, // 162-qonun (F-1002-61/62/63): hook ≤2 gap/≤120 · xato-izoh ≤60 · xulosa ≤2 gap/≤110 (5-Modul+ error, eski warn)
  { id: 'narrow', file: 'lint-narrow.mjs' }, // 171-qonun (F-1002-94): `narrow` faqat test/podium — tushuncha-ekran kurs layoutida
  { id: 'qolip', file: 'lint-qolip.mjs' },   // 174–179-qonun (F-1003): ekran-markaz · bir-qator maydon · qulfsiz «Bajardim» · yakun-halqa · ro'yxat-chet
  { id: 'prompt', file: 'prompt-lint.mjs' },
];

const args = process.argv.slice(2);
// `prompt-lint` MD hujjatlarini ko'radi, `.jsx` argumenti unga ma'nosiz — o'z skopida qoladi.
const isJsxArg = (a) => a.endsWith('.jsx') || a.startsWith('src');

const results = [];
for (const t of TOOLS) {
  const pass = t.id === 'prompt' ? args.filter(a => !isJsxArg(a)) : args;
  const r = t.bin
    ? spawnSync(t.bin, [...t.pre, ...(pass.length ? pass : t.dflt)], { stdio: 'inherit' })
    : spawnSync(process.execPath, [t.file, ...pass], { stdio: 'inherit' });
  results.push({ id: t.id, code: r.status ?? 1 });
}

const bad = results.filter(r => r.code !== 0);
console.log(`${B}\n══ GATES — ${args.length ? args.join(' ') : 'butun src/'} ══${R}`);
for (const r of results) console.log(`  ${r.code === 0 ? GRN + '✓' : RED + '🔴'} ${r.id}${R}`);
console.log(bad.length
  ? `${RED}${B}\n${bad.length}/${TOOLS.length} darvoza yiqildi: ${bad.map(b => b.id).join(', ')}${R}\n`
  : `${GRN}${B}\n${TOOLS.length}/${TOOLS.length} darvoza toza.${R}\n`);
process.exit(bad.length ? 1 : 0);
