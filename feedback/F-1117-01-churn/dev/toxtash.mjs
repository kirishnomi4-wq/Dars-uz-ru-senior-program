// F-1117-01: jonli darsda oxiriga yetmaganlar — butun sinf to'xtaganmi (sessiya yakuni) yoki o'quvchi yakka chiqib ketganmi; qaysi ekranda.
//   node feedback/F-1117-01-churn/dev/toxtash.mjs <papka> lesson_key …
import { readFileSync } from 'node:fs';
const [DIR, ...keys] = process.argv.slice(2);
const res = JSON.parse(readFileSync(`${DIR}/v_lesson_results.json`, 'utf8'));
const ses = new Map(JSON.parse(readFileSync(`${DIR}/v_sessions.json`, 'utf8')).map((s) => [s.session_id, s]));
const med = (a) => { const s = a.filter(Number.isFinite).sort((x, y) => x - y); return s.length ? s[s.length >> 1] : null; };
for (const lk of keys) {
  const live = res.filter((r) => r.lesson_key === lk && r.mode === 'live');
  const bySes = new Map(); for (const r of live) (bySes.get(r.session_id) || bySes.set(r.session_id, []).get(r.session_id)).push(r);
  let sAll = 0, sNone = 0, sSome = 0, sFull = 0; const noneStop = [], soloStop = [], dur = []; let indiv = 0, indivN = 0, wholeN = 0;
  const total = med(live.map((r) => r.screens_total));
  for (const [sid, rs] of bySes) {
    if (rs.length < 3) continue; sAll++;
    const ended = rs.filter((r) => r.reached_end).length;
    const s = ses.get(sid); if (s?.finished_at) dur.push(Math.round((Date.parse(s.finished_at) - Date.parse(s.started_at)) / 60e3));
    if (ended === 0) { sNone++; wholeN += rs.length; noneStop.push(Math.max(...rs.map((r) => r.screens_reached || 0))); }
    else { if (ended === rs.length) sFull++; else sSome++; for (const r of rs) if (!r.reached_end) { indiv++; soloStop.push(r.screens_reached || 0); } indivN += rs.length; }
  }
  const hist = (a) => { const m = {}; for (const v of a) m[v] = (m[v] || 0) + 1; return Object.entries(m).sort((x, y) => y[1] - x[1]).slice(0, 6).map(([k, n]) => `${k}-ekran:${n}`).join(' '); };
  console.log(`\n${lk} — jonli sessiyalar (3+ o'quvchi): ${sAll} · ekranlar ${total}`);
  console.log(`  hech kim oxiriga yetmagan sessiya: ${sNone} (${Math.round(100 * sNone / sAll)}%, ${wholeN} o'quvchi) · to'xtagan joy (eng uzog'i): ${hist(noneStop)}`);
  console.log(`  hamma yetgan: ${sFull} · ba'zilari yetgan: ${sSome} → ularda yakka to'xtaganlar ${indiv}/${indivN} (${Math.round(100 * indiv / (indivN || 1))}%) · qayerda: ${hist(soloStop)}`);
  console.log(`  sessiya davomiyligi mediana: ${med(dur)} daq`);
}
