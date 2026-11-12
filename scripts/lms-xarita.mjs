#!/usr/bin/env node
// ============================================================================
//  lms-xarita (F-1112-01, 12.11.2026) — Shahzoda 05.11 §5.1/§5.2/§3б: analitika view'lari uchun ikki jadval.
//   1) lesson_lms_map — dars × til → LMS qatori (student_questions.id, reestr `crm.uz/ru`), Class va Learn testi (QUIZ_LEARN.csv),
//      joriy versiya va LMS'ga yuklangan kun (reestr `v`, `yuklandi`). → PUT /admin/api/lesson-map
//   2) question_keys, kind = 'practice' — amaliyot ekranlari (AMALIYOT_ROYXATI.csv), v_skipped shu ro'yxatdan javobsizlarni topadi.
//      Test/arena kalitlari bu skriptda EMAS (savol-kalitlari.mjs). → PUT /admin/api/question-keys
//  Manbalar o'qiladi, hech biri yozilmaydi. Relizdan keyin (muhr + savol-kalitlari) qayta yurgiziladi.
//
//  Ishlatish: node scripts/lms-xarita.mjs                      — quruq yurish (hisobot)
//             node scripts/lms-xarita.mjs --json <fayl>        — yuboriladigan qatorlar faylga
//             node --env-file=server/.env.deploy.staging scripts/lms-xarita.mjs --yukla https://staging-dars-api.coddycamp.uz
//               (ADMIN_USER/ADMIN_PASSWORD env'dan; prod — faqat foydalanuvchi buyrug'i bilan, `!` orqali)
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(ROOT);
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const YUKLA = opt('--yukla', null);
const JSON_OUT = opt('--json', null);

const lessonKeyOf = (lessonId) => String(lessonId).replace(/-v\d+$/, '');
function readCsv(file) {
  const text = readFileSync(file, 'utf8').replace(/^﻿/, '');
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; continue; }
    if (ch === '"') q = true; else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.length > 1 || r[0]);
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

const fail = [];
const reestr = JSON.parse(readFileSync('LMS_REESTR.json', 'utf8')).darslar;
const learn = new Map();
for (const r of readCsv('QUIZ_LEARN.csv')) {
  const prev = learn.get(r.lesson_id);
  const cur = { class_id: Number(r.class_id) || null, learn_id: Number(r.learn_id) || null };
  if (prev && (prev.class_id !== cur.class_id || prev.learn_id !== cur.learn_id)) fail.push(`${r.lesson_id}: QUIZ_LEARN'da ikki xil Class/Learn`);
  if (!prev) learn.set(r.lesson_id, cur);
}

const mapRows = [];
const keyOwner = new Map();
for (const [lessonId, d] of Object.entries(reestr)) {
  const key = lessonKeyOf(lessonId);
  if (keyOwner.has(key)) fail.push(`lesson_key takror: ${key} (${keyOwner.get(key)}, ${lessonId})`);
  keyOwner.set(key, lessonId);
  const l = learn.get(lessonId) || { class_id: null, learn_id: null };
  if (!l.learn_id) fail.push(`${lessonId}: Learn id yo'q (QUIZ_LEARN.csv)`);
  for (const lang of ['uz', 'ru']) {
    const id = Number(d.crm && d.crm[lang]);
    if (!Number.isInteger(id) || id < 1) { fail.push(`${lessonId}: crm.${lang} yo'q`); continue; }
    mapRows.push({ lesson_key: key, lang, lms_question_id: id, class_id: l.class_id, learn_id: l.learn_id,
      lesson_version: d.v ? `v${d.v}` : null, uploaded_on: /^\d{4}-\d{2}-\d{2}$/.test(d.yuklandi || '') ? d.yuklandi : null });
  }
}

const practiceRows = [];
for (const r of readCsv('AMALIYOT_ROYXATI.csv')) {
  const d = reestr[r.lesson_id];
  if (!d) { fail.push(`amaliyot: ${r.lesson_id} reestrda yo'q`); continue; }
  const key = lessonKeyOf(r.lesson_id);
  const qid = String(r.screen_id || '').slice(0, 64);
  if (!qid) { fail.push(`amaliyot: ${r.lesson_id} screen_id bo'sh`); continue; }
  practiceRows.push({ lesson_key: key, lesson_version: `v${d.v}`, question_id: qid, question_key: `${key}:${qid}`,
    revision: createHash('sha256').update(`practice:${key}:${qid}:${r.tur}`).digest('hex').slice(0, 12), kind: 'practice', order_no: null });
}

const ids = new Set(mapRows.map((r) => r.lms_question_id));
if (ids.size !== mapRows.length) fail.push(`lms_question_id takror: ${mapRows.length - ids.size}`);
console.log(`dars → LMS: ${mapRows.length} qator (${Object.keys(reestr).length} dars × 2 til) · Learn id bor: ${mapRows.filter((r) => r.learn_id).length}`);
console.log(`amaliyot kalitlari: ${practiceRows.length} (tekshiruvsiz + tekshiriladigan)`);
if (fail.length) { console.error(`✗ ${fail.length} muammo:\n  ${fail.slice(0, 20).join('\n  ')}`); process.exit(1); }
if (JSON_OUT) { writeFileSync(JSON_OUT, JSON.stringify({ lesson_map: mapRows, practice_keys: practiceRows }, null, 1)); console.log(`yozildi: ${JSON_OUT}`); }

if (YUKLA) {
  const { ADMIN_USER: u, ADMIN_PASSWORD: pw } = process.env;
  if (!u || !pw) { console.error('ADMIN_USER/ADMIN_PASSWORD env yo\'q (--env-file)'); process.exit(2); }
  const auth = 'Basic ' + Buffer.from(`${u}:${pw}`).toString('base64');
  const put = async (path, rows, size) => {
    let n = 0;
    for (let i = 0; i < rows.length; i += size) {
      const res = await fetch(`${YUKLA.replace(/\/$/, '')}${path}`, { method: 'PUT', headers: { 'content-type': 'application/json', authorization: auth }, body: JSON.stringify({ rows: rows.slice(i, i + size) }) });
      if (!res.ok) { console.error(`✗ ${path} HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`); process.exit(1); }
      n += (await res.json()).upserted;
    }
    return n;
  };
  console.log(`yuklandi: lesson-map ${await put('/admin/api/lesson-map', mapRows, 1000)} · amaliyot kalitlari ${await put('/admin/api/question-keys', practiceRows, 500)} → ${YUKLA}`);
}
