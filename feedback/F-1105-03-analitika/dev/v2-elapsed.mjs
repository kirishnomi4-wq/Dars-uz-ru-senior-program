#!/usr/bin/env node
// F-1112-04 (12.11.2026) — FAQAT O'QISH: v2 lesson_result hodisalarida elapsed_sec yukdagi satrlar ayirmasiga (occurred_at − opened_at,
// soniyada) tengmi; holat (applied / manual_review) bilan yonma-yon. School API 422: «Elapsed time must use the logical end rounded to seconds».
//   cd /home/kali/Desktop/internetLesson/server && node --env-file=.env.deploy.prod ../feedback/F-1105-03-analitika/dev/v2-elapsed.mjs https://dars-api.coddycamp.uz
const BASE = (process.argv[2] || '').replace(/\/+$/, '');
const { ADMIN_USER, ADMIN_PASSWORD } = process.env;
if (!/^https?:\/\//.test(BASE) || !ADMIN_USER || !ADMIN_PASSWORD) { console.error('Ishlatish: node --env-file=<env> v2-elapsed.mjs <https://…>'); process.exit(2); }
const H = { authorization: 'Basic ' + Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString('base64') };
const get = async (p) => { const r = await fetch(BASE + p, { headers: H }); if (!r.ok) throw new Error(`${p} → HTTP ${r.status}`); return r.json(); };
const list = (await get('/admin/api/results?schema=2&event_type=lesson_result'));
const tally = {};
for (const e of list) {
  const ev = await get(`/admin/api/results/${encodeURIComponent(e.event_id)}`);
  const p = typeof ev.payload === 'string' ? JSON.parse(ev.payload) : ev.payload;
  const r = (p && p.result) || {};
  const satr = r.opened_at && p.occurred_at ? (Date.parse(p.occurred_at) - Date.parse(r.opened_at)) / 1000 : null;
  const mos = satr === null ? (r.elapsed_sec === null ? 'null' : '?') : (satr === r.elapsed_sec ? 'teng' : `farq ${r.elapsed_sec - satr}`);
  const holat = `${ev.status}/${ev.processing_status || '—'}`;
  tally[`${holat} · ${mos.startsWith('farq') ? 'farq' : mos}`] = (tally[`${holat} · ${mos.startsWith('farq') ? 'farq' : mos}`] || 0) + 1;
  console.log(`${e.event_id.slice(0, 15)}… ${holat.padEnd(22)} trigger ${String(r.trigger).padEnd(14)} elapsed ${r.elapsed_sec} · satrlar ${satr} → ${mos}`);
}
console.log('\njami:', Object.entries(tally).map(([k, n]) => `${k}: ${n}`).join(' · '));
