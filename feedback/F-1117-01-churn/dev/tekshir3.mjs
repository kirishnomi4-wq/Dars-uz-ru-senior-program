import { readFileSync } from 'node:fs';
const D = process.argv[2];
const L = (v) => JSON.parse(readFileSync(`${D}/${v}.json`, 'utf8'));
const res = L('v_lesson_results'), ses = L('v_sessions');
const reestr = JSON.parse(readFileSync('LMS_REESTR.json', 'utf8')).darslar;
const info = new Map(Object.entries(reestr).map(([id, d]) => [id.replace(/-v[0-9]+$/, ''), d]));
const nm = (lk) => { const d = info.get(lk); return d ? `${d.modul}-M ${d.key} «${d.nom_uz}»` : lk; };
const t = Date.parse, DAY = 864e5;
const end = Math.max(...ses.map((s) => t(s.started_at)));
const gl = new Map();
for (const r of res) { if (r.mode !== 'live' || !r.group_id || !info.has(r.lesson_key)) continue; const k = r.group_id + '|' + r.lesson_key; const x = gl.get(k) || { g: r.group_id, lk: r.lesson_key, at: t(r.opened_at), st: new Set(), rows: [] }; x.at = Math.min(x.at, t(r.opened_at)); x.st.add(r.student_id); x.rows.push(r); gl.set(k, x); }
const groups = new Map(); for (const x of gl.values()) (groups.get(x.g) || groups.set(x.g, []).get(x.g)).push(x);
for (const a of groups.values()) a.sort((p, q) => p.at - q.at);
const st = new Map(); for (const x of gl.values()) for (const s of x.st) (st.get(s) || st.set(s, []).get(s)).push(x);
const solo = new Map(); for (const r of res) if (r.mode !== 'live') (solo.get(r.student_id) || solo.set(r.student_id, []).get(r.student_id)).push(r);
const cats = {}; const first = {}, second = {}; const firstDetail = []; const months = {};
for (const [s, a] of st) {
  a.sort((p, q) => p.at - q.at);
  const last = a[a.length - 1];
  if (end - last.at < 14 * DAY || a.length > 2) continue;
  const g = groups.get(last.g); const idxFirst = g.indexOf(a[0]);
  const laterG = g.filter((x) => x.at > last.at + 3600e3).length;
  const groupDead = end - g[g.length - 1].at >= 14 * DAY;
  const joinedMid = idxFirst > 0; // guruhning birinchi darsi emas — o'rtadan qo'shilgan
  const cat = groupDead ? 'guruh ham to\'xtagan' : laterG >= 1 ? (joinedMid ? 'guruh davom etyapti · o\'rtadan qo\'shilgan' : 'guruh davom etyapti · guruh bilan boshlagan') : 'boshqa';
  cats[cat] = (cats[cat] || 0) + 1;
  if (!groupDead && laterG >= 1) {
    first[a[0].lk] = (first[a[0].lk] || 0) + 1; if (a[1]) second[a[1].lk] = (second[a[1].lk] || 0) + 1;
    const m = new Date(a[0].at).toISOString().slice(0, 7); months[m] = (months[m] || 0) + 1;
    const r0 = a[0].rows.find((r) => r.student_id === s);
    firstDetail.push({ n: a.length, lk: a[0].lk, joinedMid, gsize: a[0].st.size, laterG, tests: `${r0.tests_correct}/${r0.tests_answered}`, end: r0.reached_end, solo: (solo.get(s) || []).length, groupLessonsBefore: idxFirst });
  }
}
console.log('1–2 dars o\'tib 14+ kun kelmaganlar — holati:', cats);
console.log('\nguruhi davom etayotganlar: 1-darsi:', Object.entries(first).sort((a, b) => b[1] - a[1]).map(([k, c]) => `${nm(k)} ${c}`).join(' · '));
console.log('\n2-darsi:', Object.entries(second).sort((a, b) => b[1] - a[1]).map(([k, c]) => `${nm(k)} ${c}`).join(' · '));
console.log('\noy (1-darsi):', months);
const mid = firstDetail.filter((x) => x.joinedMid);
console.log(`\no'rtadan qo'shilgan: ${mid.length}/${firstDetail.length} · guruh undan oldin o'rtacha ${ (mid.reduce((s, x) => s + x.groupLessonsBefore, 0) / (mid.length || 1)).toFixed(1)} dars o'tgan · uyda dars ochgan: ${firstDetail.filter((x) => x.solo > 0).length}`);
console.log('test natijasi 1-darsda (to\'g\'ri/javob):', firstDetail.map((x) => x.tests).join(' '));
// taqqoslash: o'rtadan qo'shilib QOLGAN o'quvchilar soni (3+ dars)
let midStay = 0, midAll = 0;
for (const [s, a] of st) { const g = groups.get(a[0].g); if (g.indexOf(a[0]) > 0 && g[0].at < a[0].at - 7 * DAY) { midAll++; if (a.length >= 3) midStay++; } }
console.log(`\nguruhga keyinroq (guruh boshlanganidan 7+ kun keyin) qo'shilgan o'quvchilar: ${midAll} · ulardan 3+ dars qolgan: ${midStay}`);
