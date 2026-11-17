import { readFileSync } from 'node:fs';
const D = process.argv[2];
const L = (v) => JSON.parse(readFileSync(`${D}/${v}.json`, 'utf8'));
const res = L('v_lesson_results'), ses = L('v_sessions');
const reestr = JSON.parse(readFileSync('LMS_REESTR.json', 'utf8')).darslar;
const pos = new Map(Object.entries(reestr).map(([id, d]) => [id.replace(/-v[0-9]+$/, ''), d.modul * 100 + d.tartib]));
const t = Date.parse, DAY = 864e5;
const end = Math.max(...ses.map((s) => t(s.started_at)));
// guruh × dars → o'quvchilar (jonli)
const gl = new Map();
for (const r of res) { if (r.mode !== 'live' || !r.group_id || !pos.has(r.lesson_key)) continue; const k = r.group_id + '|' + r.lesson_key; const x = gl.get(k) || { g: r.group_id, lk: r.lesson_key, at: t(r.opened_at), st: new Set() }; x.at = Math.min(x.at, t(r.opened_at)); x.st.add(r.student_id); gl.set(k, x); }
const groups = new Map(); for (const x of gl.values()) { (groups.get(x.g) || groups.set(x.g, []).get(x.g)).push(x); }
for (const a of groups.values()) a.sort((p, q) => p.at - q.at);
// 1) guruh ichida n-dars → kelganlar soni (guruh 1-darsi 2-M 01 yoki 3-M 01 bilan boshlangan guruhlar)
for (const start of ['internet-01', 'js-intro-01', 'react-intro-01', 'data-intro-04-01']) {
  const gs = [...groups.values()].filter((a) => a[0].lk === start && a.length >= 3);
  const row = [];
  for (let n = 0; n < 10; n++) { const v = gs.filter((a) => a[n]).map((a) => a[n].st.size); if (!v.length) break; row.push(`${n + 1}:${(v.reduce((s, x) => s + x, 0) / v.length).toFixed(1)}(${v.length})`); }
  // 1-darsda bo'lganlardan nechtasi 3-darsda / oxirgi darsda bor
  let a1 = 0, in3 = 0; for (const a of gs) { if (!a[2]) continue; for (const s of a[0].st) { a1++; if (a.slice(2).some((x) => x.st.has(s))) in3++; } }
  console.log(`guruh ${start} bilan boshlangan: ${gs.length} ta · o'rtacha kelganlar n-darsda: ${row.join(' ')} · 1-darsdagilardan 3+ darsda ham bo'lgan: ${in3}/${a1}`);
}
// 2) 14+ kundan beri jonli darsga kelmagan o'quvchilar (guruhidan qat'i nazar) — oxirgi darsi va nechta dars o'tgani
const st = new Map(); for (const x of gl.values()) for (const s of x.st) { (st.get(s) || st.set(s, []).get(s)).push(x); }
let inact = 0; const byN = {}; const byLast = {};
for (const [s, a] of st) { a.sort((p, q) => p.at - q.at); const last = a[a.length - 1]; if (end - last.at < 14 * DAY) continue; inact++; const n = Math.min(a.length, 10); byN[n] = (byN[n] || 0) + 1; byLast[last.lk] = (byLast[last.lk] || 0) + 1; }
console.log(`\n14+ kun kelmagan: ${inact}/${st.size} · nechta dars o'tib to'xtagan: ${Object.entries(byN).map(([n, c]) => `${n}${n == 10 ? '+' : ''}:${c}`).join(' ')}`);
console.log('oxirgi darsi (top 12):', Object.entries(byLast).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, c]) => `${k} ${c}`).join(' · '));
// 3) guruhlar: oxirgi darsi qachon (o'lik guruhlar)
const dead = [...groups.values()].filter((a) => end - a[a.length - 1].at >= 14 * DAY);
console.log(`\n14+ kun dars o'tmagan guruhlar: ${dead.length}/${groups.size} — ularning o'quvchilari: ${dead.reduce((n, a) => n + new Set(a.flatMap((x) => [...x.st])).size, 0)}`);
console.log('o\'lik guruhlarning oxirgi darsi:', dead.map((a) => `${a[a.length - 1].lk}(${a.length} dars, ${new Date(a[a.length - 1].at).toISOString().slice(5, 10)})`).join(' · '));
