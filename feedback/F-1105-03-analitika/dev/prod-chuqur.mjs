#!/usr/bin/env node
// F-1112-01 (12.11.2026) — FAQAT O'QISH (foydalanuvchi ruxsati 12.11 19:1x): prod Dars bazasini admin API orqali chuqur tekshirish.
// Hech narsa yozmaydi / qayta yubormaydi (faqat GET). Ism chiqarilmaydi — faqat sonlar va hodisa/dars id'lari.
//  1) sessiyalar va urinishlar: yangi dars versiyalari (12.11 12:45Z dan) kelyaptimi — lesson_version, ekran ochilishlari, amaliyot urinishlari
//  2) v2 hodisalar (lr_/ap_/ar_): holat, elapsed tengligi, practice[] (har tekshirish, «ekran:maydon» id'lar), details holati, til
//  3) lesson-map (344) va savol kalitlari (har dars, joriy versiya) — lokal reestr/kalitlar bilan to'liq solishtiruv
//   cd /home/kali/Desktop/internetLesson/server && node --env-file=.env.deploy.prod ../feedback/F-1105-03-analitika/dev/prod-chuqur.mjs https://dars-api.coddycamp.uz [--json <fayl>]
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const BASE = (process.argv[2] || '').replace(/\/+$/, '');
const JSON_OUT = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;
const { ADMIN_USER, ADMIN_PASSWORD } = process.env;
if (!/^https?:\/\//.test(BASE) || !ADMIN_USER || !ADMIN_PASSWORD) { console.error('Ishlatish: node --env-file=<env> prod-chuqur.mjs <https://…> [--json <fayl>]'); process.exit(2); }
const H = { authorization: 'Basic ' + Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString('base64') };
const get = async (p) => { const r = await fetch(BASE + p, { headers: H }); if (!r.ok) throw new Error(`${p} → HTTP ${r.status}`); return r.json(); };
const pool = async (items, n, fn) => { const out = new Array(items.length); let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } })); return out; };
const cnt = (arr, f) => { const m = {}; for (const x of arr) { const k = String(f(x)); m[k] = (m[k] || 0) + 1; } return m; };
const fmt = (m) => Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${v}`).join(' · ') || '—';
const T = { v6: Date.parse('2026-11-11T10:09:00Z'), v2: Date.parse('2026-11-12T07:44:14Z'), srv: Date.parse('2026-11-12T10:50:00Z'), yangi: Date.parse('2026-11-12T12:45:00Z') };
const vnum = (v) => (/^v(\d+)$/.exec(String(v || '')) ? Number(RegExp.$1) : null);
const report = {};

// ---- 0) holat
const health = await (await fetch(BASE + '/api/v1/health')).json();
const ov = await get('/admin/api/overview');
console.log(`== 0) ${BASE} · ${health.version} · migratsiya ${health.checks?.migrations} · katalog ${health.checks?.catalog} · v2 ${health.features?.result_schema_v2} · ${ov.now}`);
console.log(`   navbat: ${fmt(ov.queue)} · v2 qo'llash: ${fmt(ov.v2_processing)} · faol: jonli ${ov.active_sessions.live}, solo ${ov.active_sessions.solo}, onlayn ${ov.active_sessions.players_online}`);
const att = ov.attention || [];
const attNew = att.filter((e) => Date.parse(e.updated_at) >= T.srv);
console.log(`   e'tibor ro'yxati: ${att.length} (server deploy'dan keyin yangilangan: ${attNew.length})${attNew.length ? ' → ' + attNew.map((e) => `${e.event_id.slice(0, 12)}… ${e.status}/${e.processing_status || '—'} ${e.last_http_status || ''} ${String(e.last_error || '').slice(0, 70)}`).join(' | ') : ''}`);
report.health = health; report.queue = ov.queue; report.v2_processing = ov.v2_processing;

// ---- 1) reestr (lokal) — versiyalar
const reestr = JSON.parse(readFileSync(resolve(ROOT, 'LMS_REESTR.json'), 'utf8')).darslar;
const curV = Object.fromEntries(Object.entries(reestr).map(([id, d]) => [id, d.v]));

// ---- 2) sessiyalar
const all = await get('/admin/api/sessions?limit=200');
const oldest = all.length ? all[all.length - 1].started_at : null;
const since = all.filter((s) => Date.parse(s.started_at) >= T.yangi);
console.log(`\n== 1) sessiyalar: oxirgi ${all.length} ta (eng eskisi ${oldest}) · yangi darslar yuklangandan keyin (≥ 12:45Z) boshlangan: ${since.length} (jonli ${since.filter((s) => s.mode === 'live').length}, uyda ${since.filter((s) => s.mode !== 'live').length})`);
const details = await pool(since, 4, (s) => get(`/admin/api/sessions/${s.id}`));
const parts = [];
for (const d of details) for (const p of d.participants || []) if (p.role === 'student') parts.push({ ...p, lesson_id: d.session.lesson_id, mode: d.session.mode, s_started: d.session.started_at, s_status: d.session.status, session_version: d.session.lesson_version });
const isNew = (p) => { const v = vnum(p.lesson_version); return v !== null && curV[p.lesson_id] !== undefined && v >= curV[p.lesson_id]; };
const pNew = parts.filter(isNew), pOld = parts.filter((p) => !isNew(p));
console.log(`   o'quvchi-urinishlar: ${parts.length} · YANGI versiyada (reestrdagi joriy v): ${pNew.length} · eski/noma'lum versiyada: ${pOld.length}`);
console.log(`   versiya manbai: ${fmt(cnt(parts, (p) => p.version_source))} · eski versiyadagilar: ${fmt(cnt(pOld, (p) => `${p.lesson_version || 'null'}/${p.mode}`))}`);
const lessonsNew = new Set(pNew.map((p) => p.lesson_id));
console.log(`   yangi versiya kelgan darslar: ${lessonsNew.size} — ${[...lessonsNew].slice(0, 40).map((l) => `${l}@v${curV[l]}`).join(', ')}${lessonsNew.size > 40 ? ' …' : ''}`);
const sum = (arr, k) => arr.reduce((t, p) => t + (p[k] || 0), 0);
const line = (name, arr) => console.log(`   ${name}: ${arr.length} urinish · ekran ochilishi ${sum(arr, 'screen_views')} (yozilgan ${arr.filter((p) => p.screen_views > 0).length}/${arr.length}) · amaliyot urinishi ${sum(arr, 'practice_attempts')} (${arr.filter((p) => p.practice_attempts > 0).length} o'quvchida, eng ko'pi ${Math.max(0, ...arr.map((p) => p.practice_attempts || 0))}) · test javobi ${sum(arr, 'answers')} · arena ${arr.filter((p) => p.arena_participation).length} · tugagan ${arr.filter((p) => p.attempt_status === 'finished').length} (${fmt(cnt(arr.filter((p) => p.attempt_status === 'finished'), (p) => p.finish_reason))}) · oxiriga yetgan ${arr.filter((p) => p.reached_end).length}`);
line('YANGI versiya', pNew); line('eski versiya ', pOld);
// amaliyot urinishlari zichligi — amaliyoti bor urinishlar bo'yicha o'rtacha (yangi vs eski)
const avg = (arr) => { const a = arr.filter((p) => p.practice_attempts > 0); return a.length ? (sum(a, 'practice_attempts') / a.length).toFixed(2) : '—'; };
console.log(`   amaliyot urinishi (amaliyoti bor o'quvchiga o'rtacha): yangi ${avg(pNew)} · eski ${avg(pOld)}`);
report.sessions = { since: since.length, parts: parts.length, new: pNew.length, old: pOld.length, lessons_new: [...lessonsNew] };

// ---- 3) shu sessiyalarning hodisalari + lr_ yuklari
const evs = details.flatMap((d) => (d.results || []).map((e) => ({ ...e, lesson_id: d.session.lesson_id })));
const evV2 = evs.filter((e) => e.schema_version === 2), evV1 = evs.filter((e) => e.schema_version !== 2);
console.log(`\n== 2) shu sessiyalar hodisalari: v2 ${evV2.length} (${fmt(cnt(evV2, (e) => `${String(e.event_id).slice(0, 3)} ${e.status}/${e.processing_status || '—'}`))}) · v1 ${evV1.length} (${fmt(cnt(evV1, (e) => e.status))})`);
const lrIds = evV2.filter((e) => String(e.event_id).startsWith('lr_')).map((e) => e.event_id);
const lrs = await pool(lrIds, 4, (id) => get(`/admin/api/results/${encodeURIComponent(id)}`));
const an = [];
for (const ev of lrs) {
  const p = typeof ev.payload === 'string' ? JSON.parse(ev.payload) : ev.payload; const r = p.result || {};
  const satr = r.opened_at && p.occurred_at ? (Date.parse(p.occurred_at) - Date.parse(r.opened_at)) / 1000 : null;
  const pr = Array.isArray(p.practice) ? p.practice : [];
  an.push({ id: ev.event_id, lesson: p.lesson_id, v: p.lesson_version, vs: p.version_source, mode: p.mode, status: ev.status, proc: ev.processing_status, http: ev.last_http_status,
    elapsedOk: satr === null ? r.elapsed_sec === null : satr === r.elapsed_sec, elapsed: r.elapsed_sec, trigger: r.trigger, completed: r.completed, participated: r.participated,
    tests: r.tests, screens: r.screens, lang: p.lang ?? null, details: p.details ? `${p.details.status}${p.details.reason ? ':' + p.details.reason : ''}` : 'yo\'q', nq: (p.questions || []).length,
    practice: pr, prChecked: pr.filter((x) => x.checked).length, prSub: pr.filter((x) => String(x.screen_id).includes(':')).length, ach: (p.achievements || []).length, badges: r.badges || [] });
}
const anNew = an.filter((x) => { const v = vnum(x.v); return v !== null && curV[x.lesson] !== undefined && v >= curV[x.lesson]; });
console.log(`   lr_ yuklari o'qildi: ${an.length} · yangi versiya: ${anNew.length} · elapsed tengligi: ${an.filter((x) => x.elapsedOk).length}/${an.length} · holat: ${fmt(cnt(an, (x) => `${x.status}/${x.proc || '—'}`))}`);
console.log(`   trigger: ${fmt(cnt(an, (x) => x.trigger))} · completed: ${an.filter((x) => x.completed).length} · til (yukda): ${fmt(cnt(an, (x) => x.lang))} · tafsilot: ${fmt(cnt(an, (x) => x.details))}`);
console.log(`   yangi versiya lr_: tafsilot ${fmt(cnt(anNew, (x) => x.details))} · practice[] bor ${anNew.filter((x) => x.practice.length).length}/${anNew.length} · tekshiriladigan (checked) yozuvli ${anNew.filter((x) => x.prChecked).length} · «ekran:maydon» id'li ${anNew.filter((x) => x.prSub).length}`);
for (const x of anNew.filter((y) => y.practice.length).slice(0, 14)) console.log(`     ${x.id.slice(0, 12)}… ${x.lesson}@${x.v} ${x.mode} · testlar ${x.tests?.correct_answers}/${x.tests?.answered}/${x.tests?.total_questions} · practice: ${x.practice.map((q) => `${q.screen_id}${q.checked ? (q.correct ? '✓' : '✗') : '·'}`).join(' ')}`);
const bad = an.filter((x) => !x.elapsedOk || x.status !== 'delivered' || (x.proc && x.proc !== 'applied' && x.proc !== 'queued'));
if (bad.length) console.log(`   ⚠ muammoli lr_: ${bad.map((x) => `${x.id} ${x.status}/${x.proc} elapsedOk=${x.elapsedOk} http=${x.http}`).join(' | ')}`);
report.lr = { n: an.length, new: anNew.length, elapsed_ok: an.filter((x) => x.elapsedOk).length, details: cnt(an, (x) => x.details), details_new: cnt(anNew, (x) => x.details) };

// ---- 4) butun navbat bo'yicha v2 (oxirgi 100 tadan) + elapsed (lesson_result oxirgi 100)
const lists = {};
for (const t of ['lesson_result', 'arena_participation', 'arena_result']) lists[t] = await get(`/admin/api/results?schema=2&event_type=${t}`);
console.log(`\n== 3) v2 navbati (har turdan oxirgi 100): ${Object.entries(lists).map(([t, l]) => `${t} ${l.length} (${fmt(cnt(l, (e) => `${e.status}/${e.processing_status || '—'}`))})`).join(' · ')}`);
const mr = await get('/admin/api/results?schema=2&status=manual_review');
const fl = await get('/admin/api/results?schema=2&processing=failed');
const rv = await get('/admin/api/results?schema=2&processing=review');
console.log(`   v2 muammoli: manual_review ${mr.length} · failed ${fl.length} · review ${rv.length}${mr.length ? ' → ' + mr.slice(0, 5).map((e) => `${e.event_id} ${e.last_http_status} ${String(e.last_error || '').slice(0, 60)}`).join(' | ') : ''}`);
const lr100 = await pool(lists.lesson_result.map((e) => e.event_id), 4, (id) => get(`/admin/api/results/${encodeURIComponent(id)}`));
let eq = 0, neq = [];
for (const ev of lr100) { const p = typeof ev.payload === 'string' ? JSON.parse(ev.payload) : ev.payload; const r = p.result || {}; const s = r.opened_at && p.occurred_at ? (Date.parse(p.occurred_at) - Date.parse(r.opened_at)) / 1000 : null; if (s === null ? r.elapsed_sec === null : s === r.elapsed_sec) eq++; else neq.push(`${ev.event_id} elapsed ${r.elapsed_sec} ≠ ${s} (${ev.status}/${ev.processing_status}, yaratilgan ${ev.created_at})`); }
console.log(`   lesson_result oxirgi ${lr100.length}: elapsed = occurred − opened: ${eq}/${lr100.length}${neq.length ? '\n     farqli: ' + neq.slice(0, 8).join('\n             ') : ''}`);
const rebuilt = ['lr_ac38e46d-8c87-4aaf-bd02-6c2070a06da7', 'lr_6be34136-c1e3-4734-8977-ef93443e6c60', 'lr_98e3280e-b0f2-419f-b96f-3ea804cd112e', 'lr_f0ddda9f-711f-44f0-8cbb-227d9e23647d'];
const rb = await pool(rebuilt, 4, (id) => get(`/admin/api/results/${id}`).catch((e) => ({ event_id: id, status: 'xato ' + e.message })));
console.log(`   F-1112-04 qayta yig'ilgan 4 hodisa: ${rb.map((e) => `${e.event_id.slice(0, 11)}… ${e.status}/${e.processing_status || '—'} http ${e.last_http_status ?? '—'}`).join(' · ')}`);
report.v2 = { manual_review: mr.length, failed: fl.length, review: rv.length, elapsed_eq: eq, elapsed_n: lr100.length, rebuilt: rb.map((e) => `${e.status}/${e.processing_status}`) };

// ---- 5) lesson-map — lokal reestr + QUIZ_LEARN bilan to'liq solishtiruv
const csv = (file) => { const [h, ...rows] = readFileSync(resolve(ROOT, file), 'utf8').replace(/^﻿/, '').split('\n').filter(Boolean); const H2 = h.split(','); return rows.map((l) => { const c = l.split(','); return Object.fromEntries(H2.slice(0, 6).map((k, i) => [k, c[i]])); }); };
const learn = new Map(); for (const r of csv('QUIZ_LEARN.csv')) if (!learn.has(r.lesson_id)) learn.set(r.lesson_id, { class_id: r.class_id, learn_id: r.learn_id });
const lm = await get('/admin/api/lesson-map');
const lmBy = new Map(lm.map((r) => [`${r.lesson_key}|${r.lang}`, r]));
let lmOk = 0; const lmBad = [];
for (const [id, d] of Object.entries(reestr)) for (const lang of ['uz', 'ru']) {
  const key = id.replace(/-v\d+$/, ''); const r = lmBy.get(`${key}|${lang}`); const l = learn.get(id) || {};
  const ok = r && String(r.lms_question_id) === String(d.crm[lang]) && r.lesson_version === `v${d.v}` && String(r.learn_id) === String(l.learn_id) && String(r.class_id) === String(l.class_id) && r.uploaded_on === d.yuklandi;
  if (ok) lmOk++; else lmBad.push(`${key}|${lang}: ${r ? `${r.lms_question_id} ${r.lesson_version} learn ${r.learn_id} ${r.uploaded_on}` : 'yo\'q'} (kutilgan ${d.crm[lang]} v${d.v} learn ${l.learn_id} ${d.yuklandi})`);
}
console.log(`\n== 4) lesson-map: prod'da ${lm.length} qator · lokal reestr bilan mos: ${lmOk}/${Object.keys(reestr).length * 2}${lmBad.length ? '\n     farq: ' + lmBad.slice(0, 8).join('\n           ') : ''} · versiyalar: ${fmt(cnt(lm, (r) => r.lesson_version))} · yuklangan kun: ${fmt(cnt(lm, (r) => r.uploaded_on))}`);
report.lesson_map = { n: lm.length, ok: lmOk, bad: lmBad };

// ---- 6) savol kalitlari — har dars, joriy versiya: lokal SAVOL_KALITLARI (test+arena) va AMALIYOT_ROYXATI (practice) bilan
const sk = JSON.parse(readFileSync(resolve(ROOT, 'SAVOL_KALITLARI.json'), 'utf8'));
const skRows = Array.isArray(sk) ? sk : (sk.rows || sk.kalitlar || Object.values(sk).find(Array.isArray) || []);
const want = new Map(); // lesson_key → Map(question_id → {kind, revision})
for (const r of skRows) { const k = r.lesson_key; if (!want.has(k)) want.set(k, new Map()); want.get(k).set(r.question_id, { kind: r.kind, revision: r.revision, v: r.lesson_version }); }
const am = readFileSync(resolve(ROOT, 'AMALIYOT_ROYXATI.csv'), 'utf8').replace(/^﻿/, '').split('\n').filter(Boolean).slice(1).map((l) => l.split(','));
const wantPr = new Map(); for (const c of am) { const k = c[0].replace(/-v\d+$/, ''); if (!wantPr.has(k)) wantPr.set(k, new Set()); wantPr.get(k).add(c[3]); }
const keys = Object.entries(reestr).map(([id, d]) => ({ id, key: id.replace(/-v\d+$/, ''), v: `v${d.v}` }));
const qk = await pool(keys, 4, (k) => get(`/admin/api/question-keys?lesson_key=${encodeURIComponent(k.key)}&lesson_version=${k.v}`));
let qOk = 0; const qBad = []; let tot = { test: 0, arena: 0, practice: 0 };
keys.forEach((k, i) => {
  const rows = qk[i]; const w = want.get(k.key) || new Map(); const wp = wantPr.get(k.key) || new Set();
  const got = new Map(rows.map((r) => [r.question_id, r]));
  for (const r of rows) tot[r.kind] = (tot[r.kind] || 0) + 1;
  const miss = [...w.keys()].filter((q) => !got.has(q) || got.get(q).kind !== w.get(q).kind || got.get(q).revision !== w.get(q).revision);
  const missPr = [...wp].filter((q) => !got.has(q) || got.get(q).kind !== 'practice');
  const extra = rows.filter((r) => !w.has(r.question_id) && !wp.has(r.question_id)).map((r) => r.question_id);
  const verOk = [...w.values()].every((x) => x.v === k.v);
  if (!miss.length && !missPr.length && !extra.length && verOk && rows.length === w.size + wp.size) qOk++; else qBad.push(`${k.key}@${k.v}: prod ${rows.length}, lokal ${w.size}+${wp.size}${miss.length ? ' · yo\'q/farq ' + miss.slice(0, 4).join(',') : ''}${missPr.length ? ' · amaliyot yo\'q ' + missPr.slice(0, 4).join(',') : ''}${extra.length ? ' · ortiqcha ' + extra.slice(0, 4).join(',') : ''}${verOk ? '' : ' · lokal versiya boshqa'}`);
});
console.log(`\n== 5) savol kalitlari (joriy versiya, 172 dars): prod = lokal: ${qOk}/${keys.length} · prod'da jami: test ${tot.test}, arena ${tot.arena}, amaliyot ${tot.practice}${qBad.length ? '\n     farq: ' + qBad.slice(0, 10).join('\n           ') : ''}`);
report.question_keys = { ok: qOk, n: keys.length, bad: qBad, tot };

if (JSON_OUT) { report.lr_rows = an.map(({ practice, ...x }) => ({ ...x, practice: practice.map((q) => `${q.screen_id}${q.checked ? (q.correct ? '+' : '-') : ''}`) })); report.parts = parts.map(({ subject_id, crm_id, attempt_id, ...p }) => p); writeFileSync(JSON_OUT, JSON.stringify(report, null, 1)); console.log(`\nyozildi: ${JSON_OUT}`); }
