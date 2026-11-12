#!/usr/bin/env node
// F-1112-04 (12.11.2026): School API «Elapsed time must use the logical end…» bilan rad etgan v2 lesson_result hodisalarini
// TUZATILGAN server (8a7d42f+) bilan qayta yig'ish. Sukut — QURUQ (dry): yangi yukda elapsed_sec = occurred_at − opened_at ekanini ko'rsatadi.
// `--real` — haqiqiy qayta yig'ish (o'sha event_id, processed_at saqlanadi, revisions'ga yoziladi; School API'ga qayta yuboriladi).
//   cd /home/kali/Desktop/internetLesson/server && node --env-file=.env.deploy.prod ../feedback/F-1105-03-analitika/dev/v2-elapsed-rebuild.mjs https://dars-api.coddycamp.uz [--real]
const BASE = (process.argv[2] || '').replace(/\/+$/, '');
const REAL = process.argv.includes('--real');
const { ADMIN_USER, ADMIN_PASSWORD } = process.env;
if (!/^https?:\/\//.test(BASE) || !ADMIN_USER || !ADMIN_PASSWORD) { console.error('Ishlatish: node --env-file=<env> v2-elapsed-rebuild.mjs <https://…> [--real]'); process.exit(2); }
const H = { authorization: 'Basic ' + Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString('base64'), 'content-type': 'application/json' };
const get = async (p) => { const r = await fetch(BASE + p, { headers: H }); if (!r.ok) throw new Error(`${p} → HTTP ${r.status}`); return r.json(); };
const health = await (await fetch(BASE + '/api/v1/health')).json();
console.log(`${BASE} · ${health.version} · migratsiya ${health.checks?.migrations} · v2 ${health.features?.result_schema_v2}`);
if (['ab1bfa3', '74e5ab5', 'a336b17'].some((v) => String(health.version).includes(v))) {
  console.error('⚠ server hali tuzatilgan versiyada emas (8a7d42f yoki keyingisi kerak) — to\'xtadi'); process.exit(1);
}
const list = await get('/admin/api/results?schema=2&event_type=lesson_result&status=manual_review');
const ids = [];
for (const e of list) {
  const ev = await get(`/admin/api/results/${encodeURIComponent(e.event_id)}`);
  if (/Elapsed time must use the logical end/i.test(String(ev.last_error || ''))) ids.push(e.event_id);
}
console.log(`rad etilgan (Elapsed time…): ${ids.length}`);
if (!ids.length) process.exit(0);
const r = await fetch(`${BASE}/admin/api/results/rebuild`, { method: 'POST', headers: H, body: JSON.stringify({ event_ids: ids, dry: !REAL, include_payload: !REAL }) });
const j = await r.json();
if (!r.ok) { console.error(`rebuild HTTP ${r.status}: ${JSON.stringify(j).slice(0, 300)}`); process.exit(1); }
for (const x of j.results || []) {
  const p = x.payload; const res = p && p.result;
  const satr = res && res.opened_at && p.occurred_at ? (Date.parse(p.occurred_at) - Date.parse(res.opened_at)) / 1000 : null;
  console.log(`${x.event_id.slice(0, 15)}… ${x.action || ''}${x.error ? ' xato ' + x.error : ''}${res ? ` · elapsed ${res.elapsed_sec} · satrlar ${satr} → ${satr === res.elapsed_sec ? 'teng ✓' : 'FARQ ✗'}` : ''}`);
}
console.log(REAL ? 'HAQIQIY: qayta yig\'ildi, ishchi yuboradi (v2-kuzatuv bilan tekshiring)' : 'QURUQ: hech narsa yuborilmadi. Hammasi «teng ✓» bo\'lsa — `--real` bilan qayta yurgizing.');
