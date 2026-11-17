import { readFileSync } from 'node:fs';
const D = process.argv[2];
const L = (v) => JSON.parse(readFileSync(`${D}/${v}.json`, 'utf8'));
const res = L('v_lesson_results'), ses = L('v_sessions'), wr = L('v_wrong_answers_top');
const reestr = JSON.parse(readFileSync('LMS_REESTR.json', 'utf8')).darslar;
const info = new Map(Object.entries(reestr).map(([id, d]) => [id.replace(/-v[0-9]+$/, ''), d]));
const t = Date.parse, DAY = 864e5; const end = Math.max(...ses.map((s) => t(s.started_at)));
const gl = new Map();
for (const r of res) { if (r.mode !== 'live' || !r.group_id || !info.has(r.lesson_key)) continue; const k = r.group_id + '|' + r.lesson_key; const x = gl.get(k) || { g: r.group_id, lk: r.lesson_key, at: t(r.opened_at), st: new Set() }; x.at = Math.min(x.at, t(r.opened_at)); x.st.add(r.student_id); gl.set(k, x); }
const groups = new Map(); for (const x of gl.values()) (groups.get(x.g) || groups.set(x.g, []).get(x.g)).push(x);
for (const a of groups.values()) a.sort((p, q) => p.at - q.at);
const st = new Map(); for (const x of gl.values()) for (const s of x.st) (st.get(s) || st.set(s, []).get(s)).push(x);
// guruh bilan birga boshlaganlar vs keyin qo'shilganlar; faqat 1-darsi 21+ kun oldin bo'lganlar, guruhi hali dars o'tyapti
const agg = { birga: { n: 0, stay: 0, gone: 0 }, keyin: { n: 0, stay: 0, gone: 0 } };
for (const [s, a] of st) {
  a.sort((p, q) => p.at - q.at); const g = groups.get(a[0].g);
  if (end - a[0].at < 21 * DAY || end - g[g.length - 1].at >= 14 * DAY) continue;
  const k = a[0] === g[0] || a[0].at - g[0].at < 3 * DAY ? 'birga' : 'keyin';
  const x = agg[k]; x.n++;
  const last = a[a.length - 1];
  if (a.length <= 2 && end - last.at >= 14 * DAY) x.gone++; else if (a.length >= 3) x.stay++;
}
console.log('1-darsi 21+ kun oldin, guruhi davom etyapti:', JSON.stringify(agg));
// 100% xato savollar — versiya bo'yicha
for (const w of wr.filter((w) => Number(w.wrong_pct) >= 95 || (w.lesson_key === 'pm-m1d2' && w.question_id === 's5b'))) console.log(w.lesson_key, w.lesson_version, w.question_id, w.kind, 'o\'quvchi', w.students, 'xato', w.wrong_students, w.wrong_pct + '%', 'eng ko\'p tanlangan xato:', w.top_wrong_option);
