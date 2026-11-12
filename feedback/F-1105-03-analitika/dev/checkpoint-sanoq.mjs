#!/usr/bin/env node
// F-1112-01 (12.11.2026) — FAQAT O'QISH: prod Dars bazasida checkpoint yozuvlari yig'ilyaptimi (Shahzoda 2-band, «Чекпоинты»).
// Admin API (Basic) orqali: berilgan vaqtdan keyin boshlangan sessiyalar → har o'quvchi: ekran ochilishlari (screen_views),
// amaliyot urinishlari (practice_attempts), test javoblari, arena qatnashuvi; v2 hodisalar (lr_/ap_/ar_) turi × holati.
// Hech narsa yozmaydi. Ism chiqarilmaydi — faqat sonlar.
//   Ishlatish (foydalanuvchi `!`):
//   cd /home/kali/Desktop/internetLesson/server && node --env-file=.env.deploy.prod ../feedback/F-1105-03-analitika/dev/checkpoint-sanoq.mjs https://dars-api.coddycamp.uz 2026-11-11T10:09:00Z [v2 yoqilgan ISO]
//   3-argument berilsa — shu lahzadan keyin boshlangan sessiyalar alohida: tugaganmi, oxiriga yetgan o'quvchilar (ular uchun lr_ kutiladi).
const BASE = (process.argv[2] || '').replace(/\/+$/, '');
const SINCE = new Date(process.argv[3] || '2026-11-11T10:09:00Z'); // 172 dars yangi versiyada CRM'da — 11.11 15:09 (Toshkent)
const V2 = process.argv[4] ? new Date(process.argv[4]) : null;
if (!/^https?:\/\//.test(BASE) || Number.isNaN(SINCE.getTime())) { console.error('Ishlatish: node … checkpoint-sanoq.mjs <https://…> [ISO vaqt]'); process.exit(2); }
const { ADMIN_USER, ADMIN_PASSWORD } = process.env;
if (!ADMIN_USER || !ADMIN_PASSWORD) { console.error('ADMIN_USER / ADMIN_PASSWORD env-faylda yo\'q'); process.exit(2); }
const H = { authorization: 'Basic ' + Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString('base64') };
const get = async (p) => { const r = await fetch(BASE + p, { headers: H }); if (!r.ok) throw new Error(`${p} → HTTP ${r.status}`); return r.json(); };

const health = await (await fetch(BASE + '/api/v1/health')).json();
console.log(`${BASE} · ${health.version} · migratsiya ${health.checks?.migrations} · v2 ${health.features?.result_schema_v2} · dan: ${SINCE.toISOString()}`);
const list = (await get('/admin/api/sessions?limit=200')).filter((s) => new Date(s.started_at) >= SINCE);
const t = { sessions: list.length, live: 0, solo: 0, students: 0, withViews: 0, views: 0, viewsByStudent: 0, practice: 0, withPractice: 0, answers: 0, arena: 0 };
const lessons = new Set();
const v = { sessions: 0, live: 0, solo: 0, ended: 0, students: 0, finished: 0, reachedEnd: 0, arena: 0, last: null, reasons: [] };
for (const s of list) {
  t[s.mode === 'live' ? 'live' : 'solo']++;
  lessons.add(s.lesson_id);
  const d = await get(`/admin/api/sessions/${s.id}`);
  const afterV2 = V2 && new Date(s.started_at) >= V2;
  if (afterV2) { v.sessions++; v[s.mode === 'live' ? 'live' : 'solo']++; if (s.status === 'ended') v.ended++; if (!v.last || s.started_at > v.last) v.last = s.started_at; }
  for (const p of d.participants || []) {
    if (p.role && p.role !== 'student') continue;
    t.students++;
    t.views += p.screen_views || 0; t.viewsByStudent += p.screen_views_by_student || 0;
    if (p.screen_views) t.withViews++;
    t.practice += p.practice_attempts || 0; if (p.practice_attempts) t.withPractice++;
    t.answers += p.answers || 0;
    if (p.arena_participation) t.arena++;
    if (afterV2) { v.students++; if (p.attempt_status === 'finished') { v.finished++; v.reasons.push(`${s.mode}/${s.status} → ${p.finish_reason || '—'}${p.reached_end ? ' (oxiriga yetgan)' : ''}`); } if (p.reached_end) v.reachedEnd++; if (p.arena_participation) v.arena++; }
  }
}
console.log(`sessiyalar ${t.sessions} (jonli ${t.live}, uyda ${t.solo}) · darslar ${lessons.size} · o'quvchi-urinishlar ${t.students}`);
console.log(`ekran ochilishlari ${t.views} (o'zi o'tgan ${t.viewsByStudent}) — yozilgan o'quvchilar ${t.withViews}/${t.students}`);
console.log(`amaliyot urinishlari ${t.practice} — ${t.withPractice} o'quvchida · test javoblari ${t.answers} · arenaga kirgan ${t.arena}`);
if (list.length === 200) console.log('⚠ ro\'yxat 200 bilan cheklangan — eng yangi 200 sessiya ko\'rildi');
if (V2) console.log(`v2 dan keyin (${V2.toISOString()}): sessiyalar ${v.sessions} (jonli ${v.live}, uyda ${v.solo}, yopilgan ${v.ended}) · o'quvchi-urinishlar ${v.students} · tugagan ${v.finished} · oxiriga yetgan ${v.reachedEnd} (→ lr_ kutiladi) · arena ${v.arena} (→ ap_) · oxirgi boshlangan ${v.last || '—'}`);
if (V2 && v.reasons.length) console.log(`  tugaganlar (sessiya/holat → sabab; lr_ faqat completed · live_ended · auto_7d · version_changed uchun): ${v.reasons.join(' · ')}`);
const v2 = await get('/admin/api/results?schema=2');
const by = {};
for (const e of v2) { const k = `${String(e.event_id).slice(0, 3)} ${e.status}/${e.processing_status || '—'}`; by[k] = (by[k] || 0) + 1; }
console.log('v2 hodisalar:', Object.keys(by).length ? Object.entries(by).map(([k, n]) => `${k}: ${n}`).join(' · ') : 'yo\'q');
