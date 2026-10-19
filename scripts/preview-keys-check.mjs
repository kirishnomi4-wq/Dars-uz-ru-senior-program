// preview-keys-check (F-1015) — darslardagi brauzer-saqlov kalitlari preview-himoyasida (src/live/previewMode.js) bormi.
// Preview'da faqat OWN_KEY_PREFIXES ga mos kalitlar varaq xotirasiga ketadi. Yangi dars yangi prefiks bilan
// yozsa va ro'yxatga qo'shilmasa — o'qituvchining preview-javoblari haqiqiy saqlovda qolib ketadi.
//
// Ishlatish:  node scripts/preview-keys-check.mjs        (chiqish 1 = qoplanmagan kalit bor) — butun src/
//             node scripts/preview-keys-check.mjs <fayl|papka…>   — faqat o'sha (gates 13-darvoza, F-1017-226)
// Manba: (1) Storage.getItem/setItem/removeItem ning matnli kaliti, (2) kalit-konstantalar
// (nomi …KEY / …KALIT / SAQLOV / …Key bilan tugaydi) — yordamchi funksiyalar (lsGet(k) …) shular orqali chaqiriladi.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { isOwnKey, PASS_KEYS } from '../src/live/previewMode.js';

// Saqlov kaliti EMAS (nomi «KEY» bilan tugasa ham) — sabab bilan
const NOT_STORAGE = new Map([
  ['src/bridge/liveClientSupabase.js', 'Supabase ochiq kaliti (API), saqlov emas'],
]);

const RED = '\x1b[31m', GRN = '\x1b[32m', DIM = '\x1b[2m', R = '\x1b[0m';
const files = [];
const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) walk(p); else if (/\.(jsx?|mjs)$/.test(n) && !/\.test\./.test(n)) files.push(p); } };
const targets = process.argv.slice(2).filter((a) => !a.startsWith('-'));
if (targets.length) for (const t of targets) { if (statSync(t).isDirectory()) walk(t); else files.push(t); } else walk('src');

const bad = [], unknown = [];
let seen = 0;
const check = (file, key, how) => {
  seen++;
  if (key === '') { unknown.push(`${file} — ${how}`); return; }
  if (!isOwnKey(key) && !PASS_KEYS.includes(key)) bad.push(`${file} — «${key}» (${how})`);
};

for (const f of files) {
  if (NOT_STORAGE.has(f)) continue;
  const s = readFileSync(f, 'utf8');
  for (const m of s.matchAll(/(?:local|session)Storage\.(?:get|set|remove)Item\(\s*(['"`])([^'"`$]*)/g)) check(f, m[2], 'to\'g\'ridan-to\'g\'ri');
  for (const m of s.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*(?:KEY|KALIT|SAQLOV|Key)[\w$]*)\s*=\s*(?:\([^)]*\)\s*=>\s*|[\w$]+\s*=>\s*)?(['"`])([^'"`$]*)/g)) check(f, m[3], m[1]);
}

console.log(`preview-keys-check: ${files.length} fayl, ${seen} kalit ko'rildi`);
if (unknown.length) { console.log(`${DIM}Prefikssiz (\${…} bilan boshlanadi) — qo'lda ko'ring:${R}`); for (const u of unknown) console.log(`  ${DIM}${u}${R}`); }
if (bad.length) {
  console.log(`${RED}✗ ${bad.length} ta kalit preview-himoyasida YO'Q${R} — src/live/previewMode.js OWN_KEY_PREFIXES ga qo'shing:`);
  for (const b of bad) console.log(`  ${b}`);
  process.exit(1);
}
console.log(`${GRN}✓ hamma kalit qoplangan${R}`);
