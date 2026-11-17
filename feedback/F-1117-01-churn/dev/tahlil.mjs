#!/usr/bin/env node
// F-1117-01 (17.11.2026) — AI Startup kursi: o'quvchilar qaysi darsdan keyin ketadi va qaysi darslar sifat-signali yomon.
// Kirish: yukla.mjs yuklagan view'lar (papka) + LMS_REESTR.json (kurs tartibi). Hech narsa yozmaydi (faqat --json faylga).
//   node feedback/F-1117-01-churn/dev/tahlil.mjs <papka> [--json natija.json] [--k 3] [--kun 10]
// «Ketdi» qoidasi: o'quvchi oxirgi marta L darsida (jonli) bo'lgan, shundan keyin uning guruhi kamida K ta yangi dars o'tgan
// va oxirgisi L dan kamida KUN kun keyin — o'quvchi esa birorta jonli darsga kelmagan. Guruh hali K dars o'tmagan bo'lsa — «noaniq».
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const DIR = process.argv[2];
const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const K = Number(arg('--k', 3));
const KUN = Number(arg('--kun', 10));
const JSON_OUT = arg('--json', null);
if (!DIR) { console.error('Ishlatish: node tahlil.mjs <papka> [--json fayl] [--k 3] [--kun 10]'); process.exit(2); }
const load = (v) => JSON.parse(readFileSync(`${DIR}/${v}.json`, 'utf8'));
const sessions = load('v_sessions');
const results = load('v_lesson_results');
const views = load('v_screen_views');
const wrong = load('v_wrong_answers_top');
const DAY = 86400e3;
const t = (x) => Date.parse(x);
const pct = (a, b) => (b ? Math.round((1000 * a) / b) / 10 : null);
const med = (arr) => { const a = arr.filter((x) => x !== null && Number.isFinite(x)).sort((x, y) => x - y); if (!a.length) return null; const m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
const out = { params: { K, KUN }, generated_at: new Date().toISOString() };

// ---- kurs tartibi (LMS_REESTR: modul, tartib)
const reestr = JSON.parse(readFileSync(resolve(ROOT, 'LMS_REESTR.json'), 'utf8')).darslar;
const course = Object.entries(reestr).map(([id, d]) => ({ id, lk: id.replace(/-v[0-9]+$/, ''), modul: d.modul, tartib: d.tartib, key: d.key, tur: d.tur, nom: d.nom_uz, src: d.src }))
  .sort((a, b) => a.modul - b.modul || a.tartib - b.tartib);
course.forEach((c, i) => { c.pos = i + 1; c.mpos = course.filter((x) => x.modul === c.modul && x.tartib <= c.tartib).length; });
const byLk = new Map(course.map((c) => [c.lk, c]));
const label = (lk) => { const c = byLk.get(lk); return c ? `${c.modul}-M ${String(c.mpos).padStart(2, '0')} «${c.nom}» (${c.tur})` : lk; };

// ---- ma'lumot oralig'i
const allT = sessions.map((s) => t(s.started_at)).filter(Number.isFinite);
const dataStart = Math.min(...allT), dataEnd = Math.max(...allT);
out.data = { sessions: sessions.length, attempts: results.length, screen_views: views.length, from: new Date(dataStart).toISOString(), to: new Date(dataEnd).toISOString() };

// ---- jonli guruh-darslar: guruh × dars (bir darsning bir necha sessiyasi birlashtiriladi), kelgan o'quvchilar
const sesById = new Map(sessions.map((s) => [s.session_id, s]));
const unmapped = new Map();
const gl = new Map(); // `${g}|${lk}` → { g, lk, at, students:Set }
for (const r of results) {
  if (r.mode !== 'live' || !r.group_id) continue;
  if (!byLk.has(r.lesson_key)) { unmapped.set(r.lesson_key, (unmapped.get(r.lesson_key) || 0) + 1); continue; }
  const s = sesById.get(r.session_id);
  const at = t(s?.started_at || r.opened_at);
  const k = `${r.group_id}|${r.lesson_key}`;
  let x = gl.get(k);
  if (!x) gl.set(k, (x = { g: r.group_id, lk: r.lesson_key, at, students: new Set(), teacher: r.teacher_id }));
  x.at = Math.min(x.at, at);
  x.students.add(String(r.student_id));
}
out.unmapped_live_attempts = Object.fromEntries(unmapped);
const groups = new Map(); // g → [gl…] vaqt bo'yicha
for (const x of gl.values()) { if (!groups.has(x.g)) groups.set(x.g, []); groups.get(x.g).push(x); }
for (const arr of groups.values()) arr.sort((a, b) => a.at - b.at);

// ---- o'quvchi yo'li (jonli)
const stud = new Map(); // id → [{g, lk, at}]
for (const x of gl.values()) for (const s of x.students) { if (!stud.has(s)) stud.set(s, []); stud.get(s).push({ g: x.g, lk: x.lk, at: x.at }); }
for (const arr of stud.values()) arr.sort((a, b) => a.at - b.at);
// solo faollik (uyda) — «ketdi» deyilgan o'quvchi keyin uyda dars ochganmi (ma'lumot uchun)
const soloAfter = new Map();
for (const r of results) if (r.mode !== 'live') { const s = String(r.student_id); soloAfter.set(s, Math.max(soloAfter.get(s) || 0, t(r.opened_at))); }

function fate(sid) {
  const j = stud.get(sid); const last = j[j.length - 1];
  const later = (groups.get(last.g) || []).filter((x) => x.at > last.at + 3600e3 && !x.students.has(sid));
  if (later.length >= K && later[later.length - 1].at - last.at >= KUN * DAY) return { state: 'ketdi', last, gap_lessons: later.length };
  return { state: 'noaniq', last, gap_lessons: later.length };
}
const fates = new Map([...stud.keys()].map((s) => [s, fate(s)]));
const cnt = { ketdi: 0, noaniq: 0 };
for (const f of fates.values()) cnt[f.state]++;
out.students = { live_students: stud.size, ketdi: cnt.ketdi, noaniq: cnt.noaniq, groups: groups.size, group_lessons: gl.size };

// ---- har dars: kelganlar, shu darsdan keyin ketganlar (hal bo'lganlar ichida)
const perLesson = new Map(course.map((c) => [c.lk, { lk: c.lk, attended: 0, decided: 0, left: 0, left_solo_later: 0 }]));
for (const [sid, j] of stud) {
  const f = fates.get(sid);
  for (let i = 0; i < j.length; i++) {
    const p = perLesson.get(j[i].lk); p.attended++;
    const isLast = i === j.length - 1;
    if (!isLast) { p.decided++; continue; } // keyin yana kelgan — qoldi
    if (f.state === 'ketdi') { p.decided++; p.left++; if ((soloAfter.get(sid) || 0) > j[i].at + DAY) p.left_solo_later++; }
  }
}
const lessonRows = [...perLesson.values()].filter((p) => p.attended > 0).map((p) => ({ ...p, label: label(p.lk), pos: byLk.get(p.lk).pos, leave_pct: pct(p.left, p.decided) }));
out.per_lesson_leave = lessonRows.sort((a, b) => a.pos - b.pos);

// ---- YANGI o'quvchilar: birinchi jonli darsi ma'lumot boshidan ≥ 14 kun keyin (oldin bor bo'lgan o'quvchilar emas)
const NEW_AFTER = dataStart + 14 * DAY;
const newcomers = [...stud.entries()].filter(([, j]) => j[0].at >= NEW_AFTER);
const funnel = []; // n-darsdan keyin ketganlar
const byNth = new Map(); // n → Map(lk → {n, left})
for (const [sid, j] of newcomers) {
  const f = fates.get(sid);
  for (let n = 1; n <= j.length; n++) {
    funnel[n] ??= { n, reached: 0, decided: 0, left: 0 };
    funnel[n].reached++;
    const isLast = n === j.length;
    if (!isLast) funnel[n].decided++;
    else if (f.state === 'ketdi') { funnel[n].decided++; funnel[n].left++; }
    if (n <= 3) {
      if (!byNth.has(n)) byNth.set(n, new Map());
      const m = byNth.get(n); const lk = j[n - 1].lk; const x = m.get(lk) || { lk, label: label(lk), n: 0, decided: 0, left: 0 };
      x.n++; if (!isLast) x.decided++; else if (f.state === 'ketdi') { x.decided++; x.left++; }
      m.set(lk, x);
    }
  }
}
out.newcomers = { count: newcomers.length, since: new Date(NEW_AFTER).toISOString(), funnel: funnel.filter(Boolean).slice(0, 15).map((x) => ({ ...x, leave_pct: pct(x.left, x.decided) })),
  first_lessons: Object.fromEntries([...byNth].map(([n, m]) => [n, [...m.values()].sort((a, b) => b.n - a.n).slice(0, 12).map((x) => ({ ...x, leave_pct: pct(x.left, x.decided) }))])) };
// yangi o'quvchi guruhga kursning qaysi joyida qo'shiladi
out.newcomers.join_modul = Object.entries(newcomers.reduce((m, [, j]) => { const c = byLk.get(j[0].lk); m[c.modul] = (m[c.modul] || 0) + 1; return m; }, {})).map(([modul, n]) => ({ modul: Number(modul), n }));

// ---- sifat signallari (har dars): jonli testlar, arena, uyda oxirigacha yetish, jonli dars davomiyligi
const q = new Map(course.map((c) => [c.lk, { live: 0, ta: 0, tc: 0, arena: 0, solo: 0, soloEnd: 0, soloFrac: [], dur: [] }]));
for (const r of results) {
  const x = q.get(r.lesson_key); if (!x) continue;
  if (r.mode === 'live') { x.live++; x.ta += r.tests_answered || 0; x.tc += r.tests_correct || 0; if (r.arena_participated) x.arena++; }
  else { x.solo++; if (r.reached_end) x.soloEnd++; if (r.screens_total) x.soloFrac.push((r.screens_reached || 0) / r.screens_total); }
}
for (const s of sessions) {
  const x = q.get(s.lesson_key); if (!x || s.mode !== 'live' || !s.finished_at || (s.students_lms || 0) < 3) continue;
  const m = (t(s.finished_at) - t(s.started_at)) / 60e3; if (m >= 5 && m <= 300) x.dur.push(m);
}
out.quality = course.map((c) => { const x = q.get(c.lk); return { lk: c.lk, pos: c.pos, label: label(c.lk), live_attempts: x.live, test_correct_pct: pct(x.tc, x.ta), tests_per_student: x.live ? Math.round((10 * x.ta) / x.live) / 10 : null,
  arena_pct: pct(x.arena, x.live), solo_attempts: x.solo, solo_end_pct: pct(x.soloEnd, x.solo), solo_median_progress_pct: x.soloFrac.length ? Math.round(100 * med(x.soloFrac)) : null, live_minutes_median: x.dur.length ? Math.round(med(x.dur)) : null, live_sessions_timed: x.dur.length }; });

// ---- ekranlar (12.11 dan): uyda oxiriga yetmagan urinishning oxirgi ekrani; jonli darsda har ekranda o'tgan vaqt (mediana)
const resById = new Map(results.map((r) => [r.attempt_id, r]));
const lastScreen = new Map(); // attempt → max idx
const liveSec = new Map(); // lk → Map(idx → [sek])
for (const v of views) {
  const prev = lastScreen.get(v.attempt_id); if (prev === undefined || v.screen_idx > prev) lastScreen.set(v.attempt_id, v.screen_idx);
  if (v.mode === 'live' && v.active_sec_est !== null) { if (!liveSec.has(v.lesson_key)) liveSec.set(v.lesson_key, new Map()); const m = liveSec.get(v.lesson_key); if (!m.has(v.screen_idx)) m.set(v.screen_idx, { id: v.screen_id, s: [] }); m.get(v.screen_idx).s.push(v.active_sec_est); }
}
const drop = new Map(); // lk → { attempts, notEnd, at: Map(idx→n) }
for (const [aid, idx] of lastScreen) {
  const r = resById.get(aid); if (!r || r.mode === 'live') continue;
  if (!drop.has(r.lesson_key)) drop.set(r.lesson_key, { attempts: 0, notEnd: 0, at: new Map() });
  const d = drop.get(r.lesson_key); d.attempts++;
  if (!r.reached_end) { d.notEnd++; d.at.set(idx, (d.at.get(idx) || 0) + 1); }
}
out.solo_dropoff = [...drop].map(([lk, d]) => ({ lk, label: label(lk), attempts: d.attempts, not_end: d.notEnd, top_exit_screens: [...d.at].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([idx, n]) => ({ idx, n })) }))
  .sort((a, b) => (byLk.get(a.lk)?.pos ?? 999) - (byLk.get(b.lk)?.pos ?? 999));
out.live_screen_time = [...liveSec].map(([lk, m]) => ({ lk, label: label(lk), screens: [...m].sort((a, b) => a[0] - b[0]).map(([idx, x]) => ({ idx, id: x.id, n: x.s.length, med_sec: med(x.s) })) }))
  .sort((a, b) => (byLk.get(a.lk)?.pos ?? 999) - (byLk.get(b.lk)?.pos ?? 999));
out.wrong_top = wrong.filter((w) => byLk.has(w.lesson_key)).sort((a, b) => b.wrong_pct - a.wrong_pct).map((w) => ({ lk: w.lesson_key, label: label(w.lesson_key), q: w.question_id, kind: w.kind, students: w.students, wrong_pct: Number(w.wrong_pct) }));

// ---- chop etish
const P = (s = '') => console.log(s);
P(`# F-1117-01 churn tahlili — ma'lumot ${out.data.from.slice(0, 10)} → ${out.data.to.slice(0, 10)}`);
P(`sessiyalar ${out.data.sessions} · urinishlar ${out.data.attempts} · ekran ochilishlari ${out.data.screen_views}`);
P(`jonli o'quvchilar ${out.students.live_students} · guruhlar ${out.students.groups} · guruh-darslar ${out.students.group_lessons} · ketdi ${cnt.ketdi} · noaniq ${cnt.noaniq} (qoida: guruh ${K}+ dars, ${KUN}+ kun davom etgan, o'quvchi kelmagan)`);
if (unmapped.size) P(`kursda yo'q (reestrda emas) jonli urinishlar: ${[...unmapped].map(([k, n]) => `${k} ${n}`).join(', ')}`);
P(`\n## Yangi o'quvchilar (birinchi jonli darsi ${out.newcomers.since.slice(0, 10)} dan keyin): ${out.newcomers.count}`);
P(`qo'shilgan modul: ${out.newcomers.join_modul.map((x) => `${x.modul}-M ${x.n}`).join(' · ')}`);
P('n-dars | yetgan | hal bo\'lgan | ketgan | ketish %');
for (const f of out.newcomers.funnel) P(`${String(f.n).padStart(2)} | ${f.reached} | ${f.decided} | ${f.left} | ${f.leave_pct ?? '—'}`);
for (const [n, arr] of Object.entries(out.newcomers.first_lessons)) { P(`\n${n}-darsi qaysi dars bo'lgan (top):`); for (const x of arr) P(`  ${x.label}: ${x.n} o'quvchi · hal ${x.decided} · ketdi ${x.left} (${x.leave_pct ?? '—'}%)`); }
P('\n## Har dars: shu darsdan keyin ketganlar (kurs tartibida; hal bo\'lgan ≥ 10)');
for (const p of out.per_lesson_leave.filter((x) => x.decided >= 10)) P(`${String(p.pos).padStart(3)} ${p.label}: kelgan ${p.attended} · hal ${p.decided} · ketdi ${p.left} (${p.leave_pct}%)${p.left_solo_later ? ` · ulardan keyin uyda ochgan ${p.left_solo_later}` : ''}`);
P('\n## Eng ko\'p ketilgan darslar (hal bo\'lgan ≥ 15, ketish % bo\'yicha)');
for (const p of [...out.per_lesson_leave].filter((x) => x.decided >= 15).sort((a, b) => b.leave_pct - a.leave_pct).slice(0, 15)) P(`${p.leave_pct}% — ${p.label} (ketdi ${p.left}/${p.decided})`);
P('\n## Sifat signallari — kursning birinchi 16 darsi');
for (const x of out.quality.slice(0, 16)) P(`${String(x.pos).padStart(3)} ${x.label}: jonli ${x.live_attempts} · test to'g'ri ${x.test_correct_pct ?? '—'}% (${x.tests_per_student ?? '—'}/o'q) · arena ${x.arena_pct ?? '—'}% · dars ${x.live_minutes_median ?? '—'} daq (${x.live_sessions_timed}) · uyda ${x.solo_attempts}, oxirigacha ${x.solo_end_pct ?? '—'}%, mediana ${x.solo_median_progress_pct ?? '—'}%`);
P('\n## Uyda chiqib ketish ekranlari (12.11 dan, birinchi 16 dars)');
for (const d of out.solo_dropoff.filter((x) => (byLk.get(x.lk)?.pos ?? 999) <= 16)) P(`${d.label}: ${d.attempts} urinish, oxiriga yetmagan ${d.not_end} → ${d.top_exit_screens.map((s) => `ekran ${s.idx}: ${s.n}`).join(', ') || '—'}`);
P('\n## Ko\'p xato qilingan savollar (≥5 o\'quvchi xato, top 15)');
for (const w of out.wrong_top.slice(0, 15)) P(`${w.wrong_pct}% — ${w.label} · ${w.q} (${w.kind}, ${w.students} o'quvchi)`);
if (JSON_OUT) { writeFileSync(JSON_OUT, JSON.stringify(out, null, 2)); P(`\njson → ${JSON_OUT}`); }
