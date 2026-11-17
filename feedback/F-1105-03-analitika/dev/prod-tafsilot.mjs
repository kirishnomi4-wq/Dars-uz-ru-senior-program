#!/usr/bin/env node
// F-1112-06 (12.11.2026) — FAQAT O'QISH: v2 lesson_result hodisalarida `details` (savol-tafsilot) holati — dars, versiya va
// «kalitli, variant-matnsiz yakuniy amaliyot» (src/live/practiceMeta.js PRACTICE_CHECKED) bo'yicha. Oxirgi 200 sessiya (admin API cheklovi).
//   cd /home/kali/Desktop/internetLesson/server && node --env-file=.env.deploy.prod ../feedback/F-1105-03-analitika/dev/prod-tafsilot.mjs https://dars-api.coddycamp.uz
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const { PRACTICE_CHECKED } = await import(pathToFileURL(resolve(ROOT, 'src/live/practiceMeta.js')).href);
const BASE = (process.argv[2] || '').replace(/\/+$/, '');
const { ADMIN_USER, ADMIN_PASSWORD } = process.env;
if (!/^https?:\/\//.test(BASE) || !ADMIN_USER || !ADMIN_PASSWORD) { console.error('Ishlatish: node --env-file=<env> prod-tafsilot.mjs <https://…>'); process.exit(2); }
const H = { authorization: 'Basic ' + Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString('base64') };
const get = async (p) => { const r = await fetch(BASE + p, { headers: H }); if (!r.ok) throw new Error(`${p} → HTTP ${r.status}`); return r.json(); };
const pool = async (items, n, fn) => { const out = new Array(items.length); let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } })); return out; };
const T_YANGI = Date.parse('2026-11-12T12:45:00Z');
const all = await get('/admin/api/sessions?limit=200');
const det = await pool(all, 4, (s) => get(`/admin/api/sessions/${s.id}`));
// amaliyot urinishlari zichligi: eski (12:45Z gacha boshlangan sessiyalar) va yangi
const dens = { eski: [], yangi: [] };
for (const d of det) for (const p of d.participants || []) if (p.role === 'student') dens[Date.parse(d.session.started_at) >= T_YANGI ? 'yangi' : 'eski'].push(p.practice_attempts || 0);
for (const k of ['eski', 'yangi']) { const a = dens[k], w = a.filter((x) => x > 0); const hist = {}; for (const x of a) hist[x] = (hist[x] || 0) + 1; console.log(`amaliyot urinishlari (${k}): o'quvchi-urinish ${a.length} · amaliyoti bor ${w.length} · jami ${a.reduce((t, x) => t + x, 0)} · eng ko'pi ${Math.max(0, ...a)} · taqsimot ${Object.entries(hist).map(([n, c]) => `${n}:${c}`).join(' ')}`); }
const lrIds = [...new Set(det.flatMap((d) => (d.results || []).filter((e) => e.schema_version === 2 && String(e.event_id).startsWith('lr_')).map((e) => e.event_id)))];
const evs = await pool(lrIds, 4, (id) => get(`/admin/api/results/${encodeURIComponent(id)}`));
const rows = evs.map((ev) => { const p = typeof ev.payload === 'string' ? JSON.parse(ev.payload) : ev.payload; const r = p.result || {};
  const pc = PRACTICE_CHECKED[p.lesson_id] || []; const pr = Array.isArray(p.practice) ? p.practice : [];
  return { lesson: p.lesson_id, v: p.lesson_version, mode: p.mode, st: p.details ? p.details.status : '—', reason: p.details ? p.details.reason : null, avail: p.details ? p.details.available : null,
    answered: r.tests?.answered, total: r.tests?.total_questions, nq: (p.questions || []).length, hasPC: pc.length > 0, pcDone: pr.some((x) => pc.includes(x.screen_id) && x.checked), created: ev.created_at, status: `${ev.status}/${ev.processing_status}` }; });
console.log(`\nlesson_result (v2) yuklari: ${rows.length} · yaratilgan: ${rows.map((r) => r.created).sort()[0]} … ${rows.map((r) => r.created).sort().at(-1)}`);
const g = (f) => { const m = {}; for (const r of rows) { const k = f(r); m[k] = (m[k] || 0) + 1; } return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}: ${n}`).join(' · '); };
console.log(`tafsilot holati: ${g((r) => `${r.st}${r.reason ? ':' + r.reason : ''}`)}`);
console.log(`kesim — [dars PRACTICE_CHECKED'da] × [o'quvchi shu ekranni bajargan] × [tafsilot]:\n   ${g((r) => `${r.hasPC ? 'kalitli-amaliyotli dars' : 'oddiy dars'} / ${r.pcDone ? 'amaliyot bajarilgan' : 'bajarilmagan'} / ${r.st}`).replace(/ · /g, '\n   ')}`);
const by = {}; for (const r of rows) { const k = `${r.lesson}@${r.v}`; (by[k] = by[k] || { n: 0, full: 0, om: 0, hasPC: r.hasPC, pcDone: 0, ex: new Set() }); by[k].n++; by[k][r.st === 'full' ? 'full' : 'om']++; if (r.pcDone) by[k].pcDone++; by[k].ex.add(`${r.answered}/${r.total}→${r.nq}`); }
console.log(`dars@versiya · hodisa · full · omitted · [kalitli amaliyot?] · (answered/total→questions):`);
for (const [k, v] of Object.entries(by).sort((a, b) => b[1].om - a[1].om || b[1].n - a[1].n)) console.log(`   ${k.padEnd(40)} ${String(v.n).padStart(3)} · full ${String(v.full).padStart(3)} · omitted ${String(v.om).padStart(3)} · ${v.hasPC ? 'HA (bajargan ' + v.pcDone + ')' : 'yo\'q'} · ${[...v.ex].slice(0, 5).join(' ')}`);
const odd = rows.filter((r) => (r.st !== 'full') !== (r.hasPC && r.pcDone));
console.log(`\nqoida «omitted ⇔ kalitli amaliyot bajarilgan» ga TO'G'RI kelmaydiganlar: ${odd.length}${odd.length ? '\n   ' + odd.slice(0, 12).map((r) => `${r.lesson}@${r.v} ${r.mode} ${r.st}:${r.reason} answered ${r.answered}/${r.total} q ${r.nq} pc ${r.hasPC}/${r.pcDone} ${r.created}`).join('\n   ') : ''}`);
