// F-1117-01: savol bo'yicha variant tanlovi (birinchi urinish, har o'quvchi bir marta) — joriy versiya va eski alohida.
//   node feedback/F-1117-01-churn/dev/variantlar.mjs <papka> lesson_key:q1,q2 …
import { readFileSync } from 'node:fs';
const [DIR, ...specs] = process.argv.slice(2);
const rows = JSON.parse(readFileSync(`${DIR}/v_question_attempts.json`, 'utf8'));
const reestr = JSON.parse(readFileSync('LMS_REESTR.json', 'utf8')).darslar;
const curV = Object.fromEntries(Object.entries(reestr).map(([id, d]) => [id.replace(/-v[0-9]+$/, ''), `v${d.v}`]));
for (const spec of specs) {
  const [lk, qs] = spec.split(':');
  for (const q of qs.split(',')) {
    const first = new Map();
    for (const r of rows) if (r.lesson_key === lk && r.question_id === q && r.kind === 'test') { const k = r.attempt_id; const p = first.get(k); if (!p || Number(r.attempt_no) < Number(p.attempt_no)) first.set(k, r); }
    const g = { joriy: [], eski: [] };
    for (const r of first.values()) (r.lesson_version === curV[lk] ? g.joriy : g.eski).push(r);
    const fmt = (a) => { if (!a.length) return '—'; const c = {}; let ok = 0; for (const r of a) { c[r.picked] = (c[r.picked] || 0) + 1; if (r.correct) ok++; } return `n=${a.length} to'g'ri ${Math.round(100 * ok / a.length)}% · ` + Object.entries(c).sort().map(([p, n]) => `[${p}] ${Math.round(100 * n / a.length)}%`).join(' '); };
    const live = [...first.values()].filter((r) => r.mode === 'live').length;
    console.log(`${lk} ${q} (${curV[lk]}) · joriy: ${fmt(g.joriy)} || eski: ${fmt(g.eski)} || jonli ${live}/${first.size}`);
  }
}
