#!/usr/bin/env node
// gen-lesson-catalog — src/**/*.jsx dagi LESSON_META'lardan server katalogini yig'adi.
// Natija: server/data/lesson-catalog.json  → serverda `npm run seed:catalog` (lesson_catalog jadvali).
// Nega: backend brauzerdan kelgan lesson_id ga ishonmaydi (LMS §6) — faqat katalogdagi dars ochiladi.
// Qo'lda yozilmaydi — manba darsning o'zi.
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'server', 'data', 'lesson-catalog.json');

// `src/live/` — modul, dars emas; `src/eski/` va `src/2-moodull eski/` — App.jsx'ga ULANMAGAN o'lik nusxalar
// (til-lint/jsx-lint bilan bir xil SKIP_DIRS). Ular katalogga kirsa lesson_id takrorlanadi (2026-09-08: 6 takror).
const SKIP_DIRS = new Set(['live', 'eski', '2-moodull eski']);
function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    if (statSync(p).isDirectory()) return SKIP_DIRS.has(n) ? [] : walk(p);
    return n.endsWith('.jsx') ? [p] : [];
  });
}

// const LESSON_META = { lessonId: 'internet-01-v18', lessonTitle: { uz: '…', ru: '…' } };
const META_RE = /const LESSON_META = \{\s*lessonId:\s*'([^']+)'\s*,\s*lessonTitle:\s*(\{[^}]*\}|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/;
// F-0918-05: satr UCH xil tirnoqda kelishi mumkin. Apostrofli o'zbekcha sarlavha ("…ko'rsatasiz?") qo'sh tirnoqda yoziladi —
// eski `pick` faqat bir tirnoqni o'qigan, 18 darsda title_uz = lesson_id bo'lib LMS'ga dars nomi o'rniga id ketgan.
const unq = (q, v) => v.replace(new RegExp('\\\\' + q, 'g'), q);
const pick = (objText, key) => {
  const m = new RegExp(`${key}:\\s*(?:'((?:[^'\\\\]|\\\\.)*)'|"((?:[^"\\\\]|\\\\.)*)"|\`((?:[^\`\\\\]|\\\\.)*)\`)`).exec(objText);
  if (!m) return null;
  return m[1] != null ? unq("'", m[1]) : m[2] != null ? unq('"', m[2]) : unq('`', m[3]);
};

// const ACHIEVEMENTS = { firstwin: { icon: '🎯', name: 'Bullseye!', desc: { uz: '…', ru: '…' } }, … };
// Blok sof literal (98 darsda tekshirildi) — vm sandbox'da baholanadi; buzilsa dars katalogda bo'sh ro'yxat bilan qoladi (ogohlantirish).
// id kichik harfga keltiriladi (server cheki [a-z0-9_-]{1,32}, LMS'ga va'da qilingan qolip). Natija-detallari uchun (TZ_LESSON_RESULT_DETAILS_RU §4).
function extractAchievements(text, rel, warnings) {
  const m = /const ACHIEVEMENTS\s*=\s*\{/.exec(text);
  if (!m) return [];
  let depth = 0; let end = -1;
  for (let i = m.index + m[0].length - 1; i < text.length; i++) {
    const c = text[i];
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end < 0) { warnings.push(`${rel}: ACHIEVEMENTS bloki yopilmagan`); return []; }
  let obj;
  try { obj = vm.runInNewContext('(' + text.slice(m.index + m[0].length - 1, end + 1) + ')', {}, { timeout: 200 }); }
  catch (e) { warnings.push(`${rel}: ACHIEVEMENTS o'qilmadi — ${e.message}`); return []; }
  const out = []; const seen = new Set();
  for (const [rawId, v] of Object.entries(obj || {})) {
    const id = String(rawId).toLowerCase();
    if (!/^[a-z0-9_-]{1,32}$/.test(id)) { warnings.push(`${rel}: yutuq id qolipga mos emas — ${rawId}`); continue; }
    if (seen.has(id)) { warnings.push(`${rel}: yutuq id kichik harfda takror — ${rawId}`); continue; }
    seen.add(id);
    const desc = v && typeof v === 'object' ? v.desc : null;
    const titleUz = typeof desc === 'string' ? desc : (desc && typeof desc.uz === 'string' ? desc.uz : null);
    const titleRu = desc && typeof desc === 'object' && typeof desc.ru === 'string' ? desc.ru : null;
    out.push({ id, name: String((v && v.name) || rawId).slice(0, 40), title_uz: (titleUz || String((v && v.name) || rawId)).slice(0, 200), title_ru: titleRu ? titleRu.slice(0, 200) : null });
  }
  return out;
}

const rows = [];
const dupes = new Map();
const warnings = [];
for (const file of walk(SRC)) {
  const text = readFileSync(file, 'utf8');
  const m = META_RE.exec(text);
  if (!m) continue;
  const lessonId = m[1];
  const t = m[2];
  const plain = t.startsWith("'") || t.startsWith('"');
  const titleUz = plain ? unq(t[0], t.slice(1, -1)) : pick(t, 'uz');
  const titleRu = plain ? null : pick(t, 'ru');
  const version = (/-(v\d+)$/.exec(lessonId) || [])[1] || null;
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (dupes.has(lessonId)) dupes.set(lessonId, [...dupes.get(lessonId), rel]); else dupes.set(lessonId, [rel]);
  // F-0918-05 darvozasi: sarlavha o'qilmasa JIM o'tmaydi — id sarlavha bo'lib LMS'ga ketmasin
  if (!titleUz) { console.error(`XATO: ${rel} — lessonTitle.uz o'qilmadi (LMS'ga dars nomi o'rniga «${lessonId}» ketadi)`); process.exitCode = 1; }
  rows.push({ lesson_id: lessonId, title_uz: titleUz || lessonId, title_ru: titleRu, version, source: rel, achievements: extractAchievements(text, rel, warnings) });
}
for (const w of warnings) console.error('OGOHLANTIRISH:', w);

const conflicts = [...dupes].filter(([, files]) => files.length > 1);
if (conflicts.length) {
  console.error('BIR lesson_id BIR NECHA faylda (katalogda bitta bo\'lishi kerak) — LMS ikkalasini bitta dars deb oladi, tuzating:');
  for (const [id, files] of conflicts) console.error(`  ${id}: ${files.join(' · ')}`);
  process.exitCode = 1;
}
// bir xil id → birinchi fayl qoladi (odatda manba), qolgani eslatma
const seen = new Set();
const unique = rows.filter((r) => (seen.has(r.lesson_id) ? false : (seen.add(r.lesson_id), true))).sort((a, b) => a.lesson_id.localeCompare(b.lesson_id));

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ generated_at: new Date().toISOString(), count: unique.length, lessons: unique }, null, 2) + '\n');
const achTotal = unique.reduce((n, r) => n + r.achievements.length, 0);
console.log(`katalog: ${unique.length} dars · ${achTotal} yutuq-ta'rifi → ${path.relative(ROOT, OUT)}${conflicts.length ? ` (takror id: ${conflicts.length})` : ''}`);
