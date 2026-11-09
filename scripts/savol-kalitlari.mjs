#!/usr/bin/env node
// ============================================================================
//  savol-kalitlari (F-1105-03 S9, 09.11.2026) — «eski id → doimiy kalit» jadvali (Shahzoda 04 §1.2).
//
//  question_key = <dars kodi, -vN siz>:<question_id>   (masalan css-01:s4, css-01:quiz-3) — uz va ru uchun BITTA.
//  revision     = savol + variantlar matnining (uz + ru) sha256 xeshi, 12 hex. Matn tahrirlansa — o'zgaradi, kalit — yo'q.
//  Manbalar: LMS_REESTR.json (dars, versiya) · SAVOL_MATNLARI.json (test savollari — savol-matnlari.mjs, haqiqiy brauzer)
//            · codestrike-savollar/ (arena quiz-N — QUIZ_BANK, `--tekshir` bilan darsga mosligi tasdiqlanadi).
//  Natija (LMS_REESTR.json yonida): SAVOL_KALITLARI.json + SAVOL_KALITLARI.csv + QUIZ_LEARN.csv (S12: quiz-N → Learn tartibi);
//          `--sql <fayl>` — question_keys upsert.
//  Relizda (L5) qayta yurgiziladi: savol-matnlari.mjs → savol-kalitlari.mjs → admin PUT /admin/api/question-keys.
//
//  Ishlatish: node scripts/savol-kalitlari.mjs [--matn SAVOL_MATNLARI.json] [--yoz] [--sql <fayl>]
//             node --env-file=server/.env.deploy.staging scripts/savol-kalitlari.mjs --yukla https://staging-dars-api.coddycamp.uz
//               (ADMIN_USER/ADMIN_PASSWORD env'dan; 500 tadan PUT /admin/api/question-keys; prod — faqat foydalanuvchi buyrug'i bilan)
//    --yoz bo'lmasa — quruq yurish (hisobot).
// ============================================================================
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(ROOT);
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const YOZ = args.includes('--yoz');
const MATN = opt('--matn', 'SAVOL_MATNLARI.json');
const SQL = opt('--sql', null);
const YUKLA = opt('--yukla', null);

export const lessonKeyOf = (lessonId) => String(lessonId).replace(/-v\d+$/, '');
export const questionKeyOf = (lessonId, questionId) => `${lessonKeyOf(lessonId)}:${questionId}`;
const norm = (s) => String(s ?? '').replace(/`/g, '').replace(/\s+/g, ' ').trim(); // codestrike-savollar backtiklarni olib tashlaydi — bir xil asos
export function revisionOf(uz, ru) {
  const body = JSON.stringify([uz ? [norm(uz.question), (uz.options || []).map(norm)] : null, ru ? [norm(ru.question), (ru.options || []).map(norm)] : null]);
  return createHash('sha256').update(body).digest('hex').slice(0, 12);
}

const reestr = JSON.parse(readFileSync('LMS_REESTR.json', 'utf8')).darslar;
const matn = existsSync(MATN) ? JSON.parse(readFileSync(MATN, 'utf8')) : { lessons: {} };
const arena = new Map();
for (const dir of readdirSync('codestrike-savollar', { withFileTypes: true }).filter((d) => d.isDirectory() && /-Modul$/.test(d.name))) {
  for (const f of readdirSync(join('codestrike-savollar', dir.name)).filter((x) => x.endsWith('.json'))) {
    const j = JSON.parse(readFileSync(join('codestrike-savollar', dir.name, f), 'utf8'));
    arena.set(j.lessonId, j);
  }
}

const rows = [];
const report = { lessons: 0, test: 0, test_one_lang: 0, test_missing: 0, arena: 0, no_matn: [] };
for (const [lessonId, d] of Object.entries(reestr).sort((a, b) => a[1].modul - b[1].modul || a[1].tartib - b[1].tartib)) {
  report.lessons++;
  const version = `v${d.v}`;
  const base = { lesson_id: lessonId, lesson_key: lessonKeyOf(lessonId), lesson_version: version, crm_modul: d.modul, crm_tartib: d.tartib };
  const m = matn.lessons[lessonId];
  if (!m) report.no_matn.push(lessonId);
  const tests = Object.entries(m?.screens || {}).sort((a, b) => a[1].screen_idx - b[1].screen_idx);
  tests.forEach(([qid, s], i) => {
    if (!(s.uz && s.ru)) report.test_one_lang++;
    rows.push({ ...base, question_id: qid, question_key: questionKeyOf(lessonId, qid), revision: revisionOf(s.uz, s.ru), kind: 'test', order_no: i + 1,
      correct_idx: s.key, text_uz: s.uz?.question ?? null, text_ru: s.ru?.question ?? null, options_uz: s.uz?.options ?? null, options_ru: s.ru?.options ?? null });
    report.test++;
  });
  report.test_missing += (m?.missing || []).filter((x) => !x.uz && !x.ru).length;
  const a = arena.get(lessonId);
  for (const q of a?.savollar || []) {
    const qid = `quiz-${q.n - 1}`;
    const uz = { question: q.uz.savol, options: q.uz.variantlar }, ru = q.ru ? { question: q.ru.savol, options: q.ru.variantlar } : null;
    rows.push({ ...base, question_id: qid, question_key: questionKeyOf(lessonId, qid), revision: revisionOf(uz, ru), kind: 'arena', order_no: q.n,
      correct_idx: q.togri, text_uz: uz.question, text_ru: ru?.question ?? null, options_uz: uz.options, options_ru: ru?.options ?? null });
    report.arena++;
  }
}

const dupe = rows.length - new Set(rows.map((r) => `${r.lesson_id}|${r.question_id}`)).size;
console.log(`darslar ${report.lessons} · test savollar ${report.test} (bir tilda ${report.test_one_lang}) · topilmagan test ${report.test_missing} · arena ${report.arena} · takror ${dupe}`);
if (report.no_matn.length) console.log(`SAVOL_MATNLARI da yo'q: ${report.no_matn.length} dars (${report.no_matn.slice(0, 8).join(', ')}${report.no_matn.length > 8 ? '…' : ''})`);
if (dupe) { console.error('XATO: takror kalit'); process.exit(1); }
if (!YOZ && !SQL && !YUKLA) { console.log('Quruq yurish — yozish uchun: --yoz'); process.exit(0); }

if (YOZ) {
  writeFileSync('SAVOL_KALITLARI.json', JSON.stringify({ at: new Date().toISOString(), qoida: { question_key: '<dars kodi -vN siz>:<question_id>', revision: 'sha256(uz+ru savol va variantlar)[:12]' }, manba: { matn: MATN, matn_at: matn.at || null }, hisobot: report, rows }, null, 1) + '\n');
  const csvCell = (v) => { const s = v == null ? '' : Array.isArray(v) ? v.join(' | ') : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const cols = ['lesson_id', 'lesson_key', 'lesson_version', 'crm_modul', 'crm_tartib', 'question_id', 'question_key', 'revision', 'kind', 'order_no', 'correct_idx', 'text_uz', 'text_ru', 'options_uz', 'options_ru'];
  writeFileSync('SAVOL_KALITLARI.csv', '﻿' + [cols.join(','), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(','))].join('\n') + '\n');
  console.log(`yozildi: SAVOL_KALITLARI.json, SAVOL_KALITLARI.csv (${rows.length} qator)`);
  // S12: arena quiz-N → Learn (CRM tartib raqami: uz 1–12, ru 13–24 — codestrike-savollar bilan bir xil qoida, 28.10)
  const learnCsv = 'feedback/F-1105-03-analitika/16a-REESTR-DARS-CLASS-LEARN.csv';
  const learn = new Map();
  if (existsSync(learnCsv)) {
    const [hdr, ...lines] = readFileSync(learnCsv, 'utf8').replace(/^\ufeff/, '').trim().split('\n');
    const h = hdr.split(',');
    for (const ln of lines) { const c = ln.split(','); learn.set(c[h.indexOf('lesson_id')], { class_id: c[h.indexOf('class_id')], learn_id: c[h.indexOf('learn_id')] }); }
  }
  const qcols = ['lesson_id', 'lesson_key', 'lesson_version', 'class_id', 'learn_id', 'question_id', 'question_key', 'revision', 'lang', 'learn_order', 'text', 'options', 'correct_idx'];
  const qrows = [];
  for (const r of rows.filter((x) => x.kind === 'arena')) {
    const L = learn.get(r.lesson_id) || {};
    for (const lang of ['uz', 'ru']) {
      if (!r[`text_${lang}`]) continue;
      qrows.push({ lesson_id: r.lesson_id, lesson_key: r.lesson_key, lesson_version: r.lesson_version, class_id: L.class_id ?? '', learn_id: L.learn_id ?? '', question_id: r.question_id,
        question_key: r.question_key, revision: r.revision, lang, learn_order: lang === 'uz' ? r.order_no : r.order_no + 12, text: r[`text_${lang}`], options: r[`options_${lang}`], correct_idx: r.correct_idx });
    }
  }
  writeFileSync('QUIZ_LEARN.csv', '\ufeff' + [qcols.join(','), ...qrows.map((r) => qcols.map((c) => csvCell(r[c])).join(','))].join('\n') + '\n');
  // L3 (F-1109-01 B): amaliyot ekranlari xaritasi — src/live/practiceMeta.js (markaziy) + AMALIYOT_ROYXATI.csv (Shahzodaga 2 ro'yxat)
  //   tekshiruvsiz — INLINE_KEYS da -1 («Bajardim», correct null) · tekshiriladigan — kalitli, lekin variant-matnsiz yakuniy ekran
  //   (savol-matnlari brauzerda matn ololmagan: dars recordAttempt chaqirmaydi, faqat submitAnswer bilan ball yozadi).
  const checked = {}; const prow = [];
  for (const [lessonId, d] of Object.entries(reestr)) {
    const src = readFileSync(d.src, 'utf8');
    const kb = (/const INLINE_KEYS\s*=\s*\{([^}]*)\}/.exec(src) || [])[1] || '';
    for (const m of kb.matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(-?\d+)/g)) if (Number(m[2]) === -1) prow.push({ lesson_id: lessonId, crm_modul: d.modul, crm_tartib: d.tartib, screen_id: m[1], tur: 'tekshiruvsiz' });
    for (const x of matn.lessons[lessonId]?.missing || []) { (checked[lessonId] ||= []).push(x.id); prow.push({ lesson_id: lessonId, crm_modul: d.modul, crm_tartib: d.tartib, screen_id: x.id, tur: 'tekshiriladigan' }); }
  }
  writeFileSync('src/live/practiceMeta.js', `// AVTOMATIK — scripts/savol-kalitlari.mjs --yoz (${new Date().toISOString().slice(0, 10)}). Qo'lda tahrirlanmaydi.\n` +
    `// L3: tekshiriladigan yakuniy amaliyot ekranlari (kalitli, variant-matnsiz) — useLiveSession.submitAnswer record_practice(checked=true) yuboradi.\n` +
    `// Tekshiruvsiz («Bajardim») ekranlar bu yerda emas — ular INLINE_KEYS dagi -1 dan aniqlanadi.\n` +
    `export const PRACTICE_CHECKED = ${JSON.stringify(checked, null, 1)};\n`);
  const pc = ['lesson_id', 'crm_modul', 'crm_tartib', 'screen_id', 'tur'];
  writeFileSync('AMALIYOT_ROYXATI.csv', '\ufeff' + [pc.join(','), ...prow.map((r) => pc.map((c) => csvCell(r[c])).join(','))].join('\n') + '\n');
  console.log(`yozildi: src/live/practiceMeta.js (${Object.keys(checked).length} dars) · AMALIYOT_ROYXATI.csv (${prow.length}: tekshiruvsiz ${prow.filter((r) => r.tur === 'tekshiruvsiz').length}, tekshiriladigan ${prow.filter((r) => r.tur !== 'tekshiruvsiz').length})`);
  console.log(`yozildi: QUIZ_LEARN.csv (${qrows.length} qator · Learn id topilmagan dars: ${new Set(qrows.filter((r) => !r.learn_id).map((r) => r.lesson_id)).size})`);
}
if (SQL) {
  const lit = (v) => (v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
  const body = rows.map((r) => `(${lit(r.lesson_key)}, ${lit(r.lesson_version)}, ${lit(r.question_id)}, ${lit(r.question_key)}, ${lit(r.revision)}, ${lit(r.kind)}, ${r.order_no ?? 'null'}, ${lit(r.text_uz)}, ${lit(r.text_ru)})`);
  writeFileSync(SQL, `-- savol-kalitlari.mjs ${new Date().toISOString()} · ${rows.length} qator\ninsert into question_keys (lesson_key, lesson_version, question_id, question_key, revision, kind, order_no, text_uz, text_ru) values\n${body.join(',\n')}\non conflict (lesson_key, lesson_version, question_id) do update set question_key = excluded.question_key, revision = excluded.revision, kind = excluded.kind, order_no = excluded.order_no, text_uz = excluded.text_uz, text_ru = excluded.text_ru, updated_at = now();\n`);
  console.log(`yozildi: ${SQL}`);
}
if (YUKLA) {
  const { ADMIN_USER: u, ADMIN_PASSWORD: pw } = process.env;
  if (!u || !pw) { console.error('ADMIN_USER/ADMIN_PASSWORD env yo\'q (--env-file)'); process.exit(2); }
  const auth = 'Basic ' + Buffer.from(`${u}:${pw}`).toString('base64');
  const cut = (v) => (v == null ? null : String(v).slice(0, 600));
  let n = 0;
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500).map((r) => ({ lesson_key: r.lesson_key, lesson_version: r.lesson_version, question_id: r.question_id, question_key: r.question_key, revision: r.revision, kind: r.kind, order_no: r.order_no ?? null, text_uz: cut(r.text_uz), text_ru: cut(r.text_ru) }));
    const res = await fetch(`${YUKLA.replace(/\/$/, '')}/admin/api/question-keys`, { method: 'PUT', headers: { 'content-type': 'application/json', authorization: auth }, body: JSON.stringify({ rows: batch }) });
    const body = await res.json().catch(() => null);
    if (!res.ok) { console.error(`XATO ${res.status}: ${JSON.stringify(body).slice(0, 300)}`); process.exit(1); }
    n += body.upserted;
  }
  console.log(`yuklandi: ${n} qator → ${YUKLA}`);
}
