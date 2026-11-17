// F-1117-01: darsdan darsga o'tish — guruh ichida ketma-ket darslar: oldingi darsdagilarning necha foizi shu darsda, shu darsdagilarning necha foizi keyingisida.
//   node feedback/F-1117-01-churn/dev/otish.mjs <papka> [modul…]
import { readFileSync } from 'node:fs';
const [DIR, ...mods] = process.argv.slice(2);
const res = JSON.parse(readFileSync(`${DIR}/v_lesson_results.json`, 'utf8'));
const reestr = JSON.parse(readFileSync('LMS_REESTR.json', 'utf8')).darslar;
const info = new Map(Object.entries(reestr).map(([id, d]) => [id.replace(/-v[0-9]+$/, ''), d]));
const t = Date.parse;
const gl = new Map();
for (const r of res) { if (r.mode !== 'live' || !r.group_id || !info.has(r.lesson_key)) continue; const k = r.group_id + '|' + r.lesson_key; const x = gl.get(k) || { g: r.group_id, lk: r.lesson_key, at: t(r.opened_at), st: new Set(), end: 0, n: 0 }; x.at = Math.min(x.at, t(r.opened_at)); if (!x.st.has(r.student_id)) { x.st.add(r.student_id); x.n++; if (r.reached_end) x.end++; } gl.set(k, x); }
const groups = new Map(); for (const x of gl.values()) (groups.get(x.g) || groups.set(x.g, []).get(x.g)).push(x);
const agg = new Map();
for (const a of groups.values()) {
  a.sort((p, q) => p.at - q.at);
  for (let i = 0; i < a.length; i++) {
    const x = agg.get(a[i].lk) || { inP: 0, inC: 0, outC: 0, outN: 0, groups: 0, students: 0 }; x.groups++; x.students += a[i].st.size;
    if (i > 0) { const p = a[i - 1]; x.inP += p.st.size; x.inC += [...p.st].filter((s) => a[i].st.has(s)).length; }
    if (i < a.length - 1) { const n = a[i + 1]; x.outN += a[i].st.size; x.outC += [...a[i].st].filter((s) => n.st.has(s)).length; }
    agg.set(a[i].lk, x);
  }
}
const pct = (a, b) => (b ? (100 * a / b).toFixed(1) : '—');
const rows = [...agg].map(([lk, x]) => ({ lk, d: info.get(lk), ...x })).filter((r) => !mods.length || mods.includes(String(r.d.modul))).sort((a, b) => a.d.modul - b.d.modul || a.d.tartib - b.d.tartib);
console.log('dars | guruh | o\'quvchi | oldingi darsdagilardan shu darsga kelgan | shu darsdagilardan keyingisiga kelgan');
for (const r of rows) console.log(`${r.d.modul}-M ${r.d.key} «${r.d.nom_uz}» | ${r.groups} | ${r.students} | ${pct(r.inC, r.inP)}% (${r.inC}/${r.inP}) | ${pct(r.outC, r.outN)}% (${r.outC}/${r.outN})`);
