#!/usr/bin/env node
// gen-lesson-catalog — src/**/*.jsx dagi LESSON_META'lardan server katalogini yig'adi.
// Natija: server/data/lesson-catalog.json  → serverda `npm run seed:catalog` (lesson_catalog jadvali).
// Nega: backend brauzerdan kelgan lesson_id ga ishonmaydi (LMS §6) — faqat katalogdagi dars ochiladi.
// Qo'lda yozilmaydi — manba darsning o'zi.
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'server', 'data', 'lesson-catalog.json');

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    if (statSync(p).isDirectory()) return n === 'live' ? [] : walk(p);
    return n.endsWith('.jsx') ? [p] : [];
  });
}

// const LESSON_META = { lessonId: 'internet-01-v18', lessonTitle: { uz: '…', ru: '…' } };
const META_RE = /const LESSON_META = \{\s*lessonId:\s*'([^']+)'\s*,\s*lessonTitle:\s*(\{[^}]*\}|'[^']*')/;
const pick = (objText, key) => (new RegExp(`${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`).exec(objText) || [])[1]?.replace(/\\'/g, "'") ?? null;

const rows = [];
const dupes = new Map();
for (const file of walk(SRC)) {
  const text = readFileSync(file, 'utf8');
  const m = META_RE.exec(text);
  if (!m) continue;
  const lessonId = m[1];
  const t = m[2];
  const titleUz = t.startsWith("'") ? t.slice(1, -1).replace(/\\'/g, "'") : pick(t, 'uz');
  const titleRu = t.startsWith("'") ? null : pick(t, 'ru');
  const version = (/-(v\d+)$/.exec(lessonId) || [])[1] || null;
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (dupes.has(lessonId)) dupes.set(lessonId, [...dupes.get(lessonId), rel]); else dupes.set(lessonId, [rel]);
  rows.push({ lesson_id: lessonId, title_uz: titleUz || lessonId, title_ru: titleRu, version, source: rel });
}

const conflicts = [...dupes].filter(([, files]) => files.length > 1);
if (conflicts.length) {
  console.error('BIR lesson_id BIR NECHA faylda (katalogda bitta bo\'lishi kerak):');
  for (const [id, files] of conflicts) console.error(`  ${id}: ${files.join(' · ')}`);
}
// bir xil id → birinchi fayl qoladi (odatda manba), qolgani eslatma
const seen = new Set();
const unique = rows.filter((r) => (seen.has(r.lesson_id) ? false : (seen.add(r.lesson_id), true))).sort((a, b) => a.lesson_id.localeCompare(b.lesson_id));

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ generated_at: new Date().toISOString(), count: unique.length, lessons: unique }, null, 2) + '\n');
console.log(`katalog: ${unique.length} dars → ${path.relative(ROOT, OUT)}${conflicts.length ? ` (takror id: ${conflicts.length})` : ''}`);
