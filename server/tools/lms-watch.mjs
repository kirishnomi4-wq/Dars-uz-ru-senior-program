#!/usr/bin/env node
// lms-watch — LMS sinov-kuzatuvchisi (§13 sinovi uchun dalil-oqimi).
// admin/api/sessions ni har N soniyada so'raydi; yangi sessiya, ishtirokchi, javob/urinish/yutuq,
// ekran, holat (end_reason), natija-hodisa (School API status/HTTP) O'ZGARGANDA bir qator chiqaradi.
//
// Ishlatish (server/ ichidan):
//   node --env-file=.env.deploy.staging tools/lms-watch.mjs https://staging-dars-api.coddycamp.uz
//   qo'shimcha: --interval 5 (soniya) · --limit 30 · --once (bir marta, chiqadi) · --out fayl.log (har satr faylga ham)
// Ism chiqmaydi (faqat ID'lar), token hech qachon chiqmaydi. Ctrl+C — to'xtatish.

import { appendFileSync } from 'node:fs';

const args = process.argv.slice(2);
const BASE = (args.find((a) => /^https?:\/\//.test(a)) || 'https://staging-dars-api.coddycamp.uz').replace(/\/$/, '');
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const INTERVAL = Math.max(2, Number(opt('--interval', 5))) * 1000;
const LIMIT = Math.min(200, Number(opt('--limit', 30)) || 30);
const ONCE = args.includes('--once');
const OUT = opt('--out', null);
const ENV = process.env;
if (!ENV.ADMIN_USER || !ENV.ADMIN_PASSWORD) {
  console.error("ADMIN_USER/ADMIN_PASSWORD yo'q — `node --env-file=.env.deploy.staging tools/lms-watch.mjs <url>` bilan yurgizing");
  process.exit(2);
}
const AUTH = { authorization: 'Basic ' + Buffer.from(`${ENV.ADMIN_USER}:${ENV.ADMIN_PASSWORD}`).toString('base64') };

const TZ = 'Asia/Tashkent';
const hhmmss = () => new Date().toLocaleTimeString('en-GB', { timeZone: TZ, hour12: false });
function out(line) {
  const s = `${hhmmss()}  ${line}`;
  console.log(s);
  if (OUT) appendFileSync(OUT, s + '\n');
}

async function get(path) {
  const r = await fetch(BASE + path, { headers: AUTH, signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(`${path} → HTTP ${r.status}`);
  return r.json();
}

const short = (id) => String(id).slice(0, 8);
const label = (s) => `${s.mode} ${s.lesson_id} · gid ${s.gid ?? '-'} · mentor ${s.teacher_id ?? '-'} · kod ${s.pin} [${short(s.id)}]`;

const seen = new Map();   // session id → ro'yxat-snapshot
const parts = new Map();  // session id → Map(role:subject → ishtirokchi-snapshot)
const results = new Map(); // session id → Map(event_id → natija-snapshot)
let queue = null;
let first = true;

async function detail(s, quiet) {
  const d = await get(`/admin/api/sessions/${s.id}`);
  const prevP = parts.get(s.id);
  const curP = new Map();
  for (const p of d.participants || []) {
    const key = `${p.role}:${p.subject_id}`;
    const snap = { answers: p.answers, correct: p.correct, attempts: p.attempts, ach: p.achievements, end: p.reached_end, status: p.attempt_status, reason: p.finish_reason };
    curP.set(key, snap);
    const old = prevP?.get(key);
    if (!old) {
      if (!quiet) out(`  ↳ [${short(s.id)}] qo'shildi ${p.role} ${p.subject_id}${p.crm_id ? ` (crm ${p.crm_id})` : ''}`);
      continue;
    }
    const ch = [];
    if (old.answers !== snap.answers || old.correct !== snap.correct) ch.push(`javob ${snap.answers} (to'g'ri ${snap.correct})`);
    if (old.attempts !== snap.attempts) ch.push(`urinish ${snap.attempts}`);
    if (old.ach !== snap.ach) ch.push(`yutuq ${snap.ach}`);
    if (old.end !== snap.end && snap.end) ch.push('oxiriga yetdi ✓');
    if (old.status !== snap.status || old.reason !== snap.reason) ch.push(`attempt ${snap.status ?? '-'}${snap.reason ? '/' + snap.reason : ''}`);
    if (ch.length) out(`  ↳ [${short(s.id)}] ${p.role} ${p.subject_id}: ${ch.join(' · ')}`);
  }
  for (const key of prevP?.keys() || []) if (!curP.has(key)) out(`  ↳ [${short(s.id)}] chiqdi ${key}`);
  parts.set(s.id, curP);

  const prevR = results.get(s.id) || new Map();
  const curR = new Map();
  for (const e of d.results || []) {
    const snap = { status: e.status, http: e.last_http_status, students: e.students_count, err: e.last_error, tries: e.send_attempts };
    curR.set(e.event_id, snap);
    const old = prevR.get(e.event_id);
    const changed = !old || old.status !== snap.status || old.http !== snap.http || old.err !== snap.err || old.tries !== snap.tries;
    if (changed && !(quiet && !old)) {
      out(`  ↳ [${short(s.id)}] natija ${e.event_id}: ${snap.status} · HTTP ${snap.http ?? '-'} · o'quvchi ${snap.students ?? '-'} · urinish ${snap.tries ?? 0}${snap.err ? ` · xato: ${snap.err}` : ''}`);
    }
  }
  results.set(s.id, curR);
  if (!quiet && d.pin_players !== undefined) {
    const prev = seen.get(s.id);
    if (prev && prev.players !== d.pin_players) out(`  ↳ [${short(s.id)}] live_players ${d.pin_players}`);
  }
}

async function tick() {
  const list = await get(`/admin/api/sessions?limit=${LIMIT}`);
  for (const s of [...list].reverse()) { // eskidan yangiga
    const snap = { status: s.status, reason: s.end_reason, students: s.students, players: s.players, answers: s.answers, screen: s.cur_screen, live: s.live_status, result: s.result_status };
    const old = seen.get(s.id);
    let needDetail = false;
    if (!old) {
      if (first) {
        out(`MAVJUD ${s.status}${s.end_reason ? ` (${s.end_reason})` : ''} ${label(s)} · o'quvchi ${s.students} · javob ${s.answers} · ekran ${s.cur_screen}/${s.max_screen} · natija ${s.result_status ?? '-'}`);
      } else {
        out(`YANGI ${label(s)}`);
        needDetail = true;
      }
    } else {
      const ch = [];
      if (old.students !== snap.students) { ch.push(`o'quvchi ${snap.students}`); needDetail = true; }
      if (old.players !== snap.players) ch.push(`player ${snap.players}`);
      if (old.answers !== snap.answers) { ch.push(`javob ${snap.answers}`); needDetail = true; }
      if (old.screen !== snap.screen) ch.push(`ekran ${snap.screen}/${s.max_screen}`);
      if (old.status !== snap.status || old.reason !== snap.reason) { ch.push(`holat ${snap.status}${snap.reason ? ` (${snap.reason})` : ''}`); needDetail = true; }
      if (old.live !== snap.live) ch.push(`live ${snap.live}`);
      if (old.result !== snap.result) { ch.push(`natija ${snap.result ?? '-'}`); needDetail = true; }
      if (ch.length) out(`[${short(s.id)}] ${ch.join(' · ')}`);
    }
    seen.set(s.id, snap);
    if (needDetail) await detail(s, false);
    else if (first && s.status === 'live') await detail(s, true); // boshlang'ich holatni jim o'qib olamiz
  }
  const ov = await get('/admin/api/overview');
  const q = ov.queue || {};
  const qs = Object.entries(q).map(([k, v]) => `${k} ${v}`).join(', ') || "bo'sh";
  const qkey = JSON.stringify(q);
  if (queue === null) out(`NAVBAT ${qs} · faol live ${ov.active_sessions?.live} solo ${ov.active_sessions?.solo} · onlayn ${ov.active_sessions?.players_online}`);
  else if (qkey !== queue) out(`NAVBAT ${qs} · onlayn ${ov.active_sessions?.players_online}`);
  queue = qkey;
  first = false;
}

out(`kuzatuv boshlandi → ${BASE} (har ${INTERVAL / 1000} s, oxirgi ${LIMIT} sessiya)${OUT ? ` · jurnal: ${OUT}` : ''}`);
for (;;) {
  try { await tick(); } catch (e) { out(`XATO ${e.message}`); }
  if (ONCE) break;
  await new Promise((r) => setTimeout(r, INTERVAL));
}
