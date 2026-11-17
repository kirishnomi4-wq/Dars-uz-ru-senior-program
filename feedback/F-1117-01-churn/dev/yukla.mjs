#!/usr/bin/env node
// F-1117-01 (17.11.2026) — FAQAT O'QISH: analitika view'larini admin API orqali yuklab oladi (GET /admin/api/analytics/:view).
// Vaqt oynasi 7 kundan boshlanadi; limitdan ko'p qator chiqsa oyna ikkiga bo'linadi. Ism yo'q (view'larda ism ustuni yo'q).
//   cd server && node --env-file=.env.deploy.prod ../feedback/F-1117-01-churn/dev/yukla.mjs https://dars-api.coddycamp.uz <papka> [--from 2026-09-01] [--views v_question_attempts,…]
import { mkdirSync, writeFileSync } from 'node:fs';
const BASE = (process.argv[2] || '').replace(/\/+$/, '');
const OUT = process.argv[3];
const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const FROM = Date.parse(arg('--from', '2026-09-01T00:00:00Z'));
const { ADMIN_USER, ADMIN_PASSWORD } = process.env;
if (!/^https?:\/\//.test(BASE) || !OUT || !ADMIN_USER || !ADMIN_PASSWORD) { console.error('Ishlatish: node --env-file=<env> yukla.mjs <https://…> <papka> [--from ISO]'); process.exit(2); }
const H = { authorization: 'Basic ' + Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString('base64') };
const get = async (p) => { const r = await fetch(BASE + p, { headers: H }); if (!r.ok) throw new Error(`${p} → HTTP ${r.status} ${(await r.text()).slice(0, 200)}`); return r.json(); };
const LIMIT = 10000;
mkdirSync(OUT, { recursive: true });

async function windowed(view, from, to) {
  const j = await get(`/admin/api/analytics/${view}?from=${new Date(from).toISOString()}&to=${new Date(to).toISOString()}&limit=${LIMIT}`);
  if (!j.truncated) return j.rows;
  if (to - from > 3600e3) { const mid = from + Math.floor((to - from) / 2); return [...await windowed(view, from, mid), ...await windowed(view, mid, to)]; }
  const rows = [...j.rows]; // 1 soatda 10000 dan ko'p — offset bilan
  for (let off = LIMIT; ; off += LIMIT) { const k = await get(`/admin/api/analytics/${view}?from=${new Date(from).toISOString()}&to=${new Date(to).toISOString()}&limit=${LIMIT}&offset=${off}`); rows.push(...k.rows); if (!k.truncated) break; }
  return rows;
}
async function timeless(view) {
  const rows = [];
  for (let off = 0; ; off += LIMIT) { const k = await get(`/admin/api/analytics/${view}?limit=${LIMIT}&offset=${off}`); rows.push(...k.rows); if (!k.truncated) break; }
  return rows;
}
const now = Date.now() + 60e3;
const meta = { base: BASE, from: new Date(FROM).toISOString(), to: new Date(now).toISOString(), views: {} };
const ONLY = arg('--views', null)?.split(',');
const ALL = [['v_sessions', 't', FROM], ['v_lesson_results', 't', FROM], ['v_screen_views', 't', Date.parse('2026-11-01T00:00:00Z')], ['v_wrong_answers_top', '-'], ['v_lessons', '-'], ['v_question_attempts', 't', FROM]];
for (const [view, kind, from] of ALL.filter(([v]) => (ONLY ? ONLY.includes(v) : v !== 'v_question_attempts'))) {
  const t0 = Date.now(); let rows = [];
  if (kind === 't') { for (let a = from; a < now; a += 7 * 86400e3) rows.push(...await windowed(view, a, Math.min(now, a + 7 * 86400e3))); }
  else rows = await timeless(view);
  writeFileSync(`${OUT}/${view}.json`, JSON.stringify(rows));
  meta.views[view] = rows.length;
  console.log(`${view}: ${rows.length} qator (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
}
if (!ONLY) writeFileSync(`${OUT}/_meta.json`, JSON.stringify(meta, null, 2));
