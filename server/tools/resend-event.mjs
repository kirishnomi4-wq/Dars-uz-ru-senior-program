#!/usr/bin/env node
// resend-event — qo'shma sinov (JAVOB 2026-09-15 §5-4 / SINOV §5.3-18) uchun: yuborilgan natija-hodisani School API'ga
// QAYTA yuboradi — (a) AYNAN o'sha payload → 200 `duplicate: true` kutiladi; (b) `--mutate` bilan bitta maydon o'zgartirilib
// (students[0].duration_sec + 1) → 409 kutiladi. Payload admin API'dan olinadi (worker ham o'sha JSONB'dan yuboradi — kalit tartibi
// bir xil). HECH NARSA saqlamaydi; token/parol chiqarilmaydi. Faqat sinov kunida, Axadulla bilan kelishib yurgiziladi.
//
// Ishlatish (server/ ichidan):
//   node --env-file=.env.deploy.staging tools/resend-event.mjs https://staging-dars-api.coddycamp.uz <event_id> [--mutate] [--dry]
//   Lokal (soxta School API bilan): node --env-file=.env tools/resend-event.mjs http://127.0.0.1:3001 <event_id> --mutate
const args = process.argv.slice(2);
const BASE = (args.find((a) => /^https?:\/\//.test(a)) || '').replace(/\/$/, '');
const EVENT = args.find((a) => !a.startsWith('--') && !/^https?:\/\//.test(a));
const MUTATE = args.includes('--mutate');
const DRY = args.includes('--dry');
const E = process.env;
if (!BASE || !EVENT) { console.error('Ishlatish: resend-event.mjs <api-url> <event_id> [--mutate] [--dry]'); process.exit(2); }
for (const k of ['ADMIN_USER', 'ADMIN_PASSWORD', 'CODDYCAMP_SCHOOL_API_URL', 'CODDYCAMP_RESULTS_API_TOKEN']) {
  if (!E[k]) { console.error(`${k} yo'q — --env-file bilan yurgizing`); process.exit(2); }
}

const admin = await fetch(`${BASE}/admin/api/results/${encodeURIComponent(EVENT)}`, { headers: { authorization: 'Basic ' + Buffer.from(`${E.ADMIN_USER}:${E.ADMIN_PASSWORD}`).toString('base64') } });
if (!admin.ok) { console.error(`admin GET → HTTP ${admin.status}`); process.exit(1); }
const row = await admin.json();
const payload = row.payload || row.event?.payload || row.data?.payload;
if (!payload || payload.event_id !== EVENT) { console.error('admin javobida payload topilmadi'); process.exit(1); }
console.log(`hodisa: ${EVENT} · mode ${payload.mode} · o'quvchi ${payload.students?.length} · status ${row.status || row.event?.status || '?'} · so'nggi HTTP ${row.last_http_status ?? row.event?.last_http_status ?? '?'}`);

if (MUTATE) {
  const s = payload.students?.[0];
  if (!s) { console.error('students[0] yo\'q'); process.exit(1); }
  s.duration_sec = (Number(s.duration_sec) || 0) + 1;
  console.log(`mutatsiya: students[0].duration_sec → ${s.duration_sec} (409 kutiladi)`);
} else console.log('aynan o\'sha payload (200 duplicate: true kutiladi)');

if (DRY) { console.log(JSON.stringify(payload, null, 1).slice(0, 1500)); process.exit(0); }

const r = await fetch(`${E.CODDYCAMP_SCHOOL_API_URL.replace(/\/$/, '')}/api/v1/integrations/dars-platform/lesson-results`, {
  method: 'POST', headers: { authorization: `Bearer ${E.CODDYCAMP_RESULTS_API_TOKEN}`, 'content-type': 'application/json', accept: 'application/json' },
  body: JSON.stringify(payload),
});
let body = null; try { body = await r.json(); } catch { /* tanasiz */ }
const want = MUTATE ? 409 : 200;
console.log(`School API → HTTP ${r.status} (kutilgan ${want}) ${r.status === want ? '✓' : '✗'} · x-request-id ${r.headers.get('x-request-id') || '-'}`);
console.log(JSON.stringify(body, null, 1).slice(0, 800));
process.exit(r.status === want ? 0 : 1);
