#!/usr/bin/env node
// ============================================================================
//  v2-kuzatuv (F-1105-03, 10.11.2026) — yangi natija oqimi (lr_ / ap_ / ar_) yoqilgandan keyin FAQAT O'QIB kuzatish.
//  Admin API (Basic) orqali: bayroq, navbat, v2 hodisalar turi × yetkazish × qo'llash holati, muammoli hodisalar, v1 hali oqyaptimi.
//  Hech narsa yozmaydi / qayta yubormaydi.
//
//  Ishlatish:
//    staging: node --env-file=.env.deploy.staging tools/v2-kuzatuv.mjs https://staging-dars-api.coddycamp.uz
//    prod:    node --env-file=.env.deploy.prod    tools/v2-kuzatuv.mjs https://dars-api.coddycamp.uz      (foydalanuvchi `!` bilan)
//  Env: ADMIN_USER, ADMIN_PASSWORD.  Chiqish kodi: 0 — muammo yo'q, 1 — e'tibor kerak, 2 — ulanib bo'lmadi.
// ============================================================================
const BASE = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https?:\/\//.test(BASE)) { console.error('Ishlatish: node --env-file=<env> tools/v2-kuzatuv.mjs <https://…>'); process.exit(2); }
const { ADMIN_USER, ADMIN_PASSWORD } = process.env;
if (!ADMIN_USER || !ADMIN_PASSWORD) { console.error('ADMIN_USER / ADMIN_PASSWORD env-faylda yo\'q'); process.exit(2); }
const auth = { authorization: 'Basic ' + Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString('base64') };
const G = '\x1b[32m', Y = '\x1b[33m', RD = '\x1b[31m', D = '\x1b[2m', B = '\x1b[1m', R = '\x1b[0m';
async function get(path, admin = true) {
  const r = await fetch(BASE + path, { headers: admin ? auth : {} });
  if (!r.ok) throw new Error(`${path} → HTTP ${r.status}`);
  return r.json();
}
let attention = 0;
const warn = (s) => { attention++; console.log(`${Y}⚠ ${s}${R}`); };
try {
  const h = await get('/api/v1/health', false);
  const flag = h.features?.result_schema_v2 || '?';
  console.log(`${B}${BASE}${R} · versiya ${h.version} · migratsiyalar ${h.checks?.migrations} · v2 bayroq: ${flag === 'on' ? G : Y}${flag}${R}`);

  const o = await get('/admin/api/overview');
  const q = o.queue || {}, p = o.v2_processing || {};
  console.log(`navbat: delivered ${q.delivered || 0} · pending ${q.pending || 0} · retry_wait ${q.retry_wait || 0} · manual_review ${q.manual_review || 0} · skipped ${q.skipped || 0}`);
  console.log(`v2 qo'llash: queued ${p.queued || 0} · applied ${p.applied || 0} · failed ${p.failed || 0} · review ${p.review || 0}`);
  console.log(`faol: jonli ${o.active_sessions?.live ?? '?'} · solo ${o.active_sessions?.solo ?? '?'} · onlayn ${o.active_sessions?.players_online ?? '?'}`);

  const v2 = await get('/admin/api/results?schema=2');
  const v1 = await get('/admin/api/results?schema=1');
  const tbl = {};
  for (const e of v2) { const k = `${e.event_type}|${e.status}|${e.processing_status || '—'}`; tbl[k] = (tbl[k] || 0) + 1; }
  console.log(`\n${B}v2 hodisalar (oxirgi ${v2.length})${R}`);
  if (!v2.length) console.log(`${D}  hali yo'q${flag === 'on' ? ' — bayroq yoqilgandan keyin dars yakunlanishi kerak' : ''}${R}`);
  for (const [k, n] of Object.entries(tbl).sort()) { const [t, s, pr] = k.split('|'); console.log(`  ${t.padEnd(20)} ${s.padEnd(14)} ${pr.padEnd(8)} ${n}`); }
  const now = Date.now();
  const bad = v2.filter((e) => e.status === 'manual_review' || e.processing_status === 'failed' || e.processing_status === 'review');
  const stuck = v2.filter((e) => e.status === 'delivered' && e.processing_status === 'queued' && now - new Date(e.delivered_at || e.updated_at).getTime() > 60 * 60 * 1000);
  const retry = v2.filter((e) => e.status === 'retry_wait' || e.status === 'pending');
  if (bad.length) { warn(`${bad.length} ta v2 hodisa muammoli (manual_review / failed / review):`); for (const e of bad.slice(0, 10)) console.log(`    ${e.event_id} · ${e.status}/${e.processing_status || '—'} · HTTP ${e.last_http_status ?? '—'} · ${String(e.last_error || '').slice(0, 140)}`); }
  if (stuck.length) warn(`${stuck.length} ta v2 hodisa 1 soatdan ko'p «queued» (School API qo'llamayapti?): ${stuck.slice(0, 5).map((e) => e.event_id).join(', ')}`);
  if (retry.length) console.log(`${D}  yuborilmoqda/qayta urinish: ${retry.length} (${retry.slice(0, 3).map((e) => `${e.event_id} HTTP ${e.last_http_status ?? '—'}`).join(', ')})${R}`);

  const last1 = v1[0]?.updated_at ? new Date(v1[0].updated_at) : null;
  console.log(`\n${B}v1 oqimi${R}: oxirgi hodisa ${last1 ? last1.toISOString() : 'yo\'q'} · oxirgi 100 dan manual_review ${v1.filter((e) => e.status === 'manual_review').length}`);
  if (q.manual_review && (o.attention || []).length) console.log(`${D}  e'tibor ro'yxatida ${o.attention.length} ta (admin sahifasi)${R}`);
  console.log(attention ? `\n${Y}${B}E'tibor kerak: ${attention}${R}` : `\n${G}${B}Muammo yo'q.${R}`);
  process.exit(attention ? 1 : 0);
} catch (e) {
  console.error(`${RD}✗ ${e.message}${R}`);
  process.exit(2);
}
