// F-1107-02 qidiruv: recordAttempt'ga xom `options` uzatadigan 58 faylda har savolning options={...} turini aniqlaydi. Faqat o'qiydi.
import fs from 'node:fs';
const files = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n');
const grab = (s, i) => { // i = '[' yoki '{' indeksi; mos yopilgunga qadar
  const open = s[i], close = open === '[' ? ']' : '}'; let d = 0, q = null;
  for (let j = i; j < s.length; j++) { const c = s[j];
    if (q) { if (c === '\\') { j++; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === open) d++; else if (c === close && --d === 0) return s.slice(i, j + 1); }
  return s.slice(i, i + 300);
};
const rows = [];
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8'); let ok = 0, obj = 0, jsx = 0, varr = 0; const samples = [];
  for (const m of s.matchAll(/\boptions=\{/g)) {
    const inner = grab(s, m.index + 'options='.length).slice(1, -1).trim();
    if (inner.startsWith('[')) {
      if (/\{\s*uz\s*:/.test(inner)) { obj++; }
      else if (/<[A-Za-z>]/.test(inner)) { jsx++; }
      else ok++;
    } else { varr++; if (samples.length < 3) samples.push(inner.slice(0, 40)); }
  }
  rows.push({ f, ok, obj, jsx, varr, samples });
}
const bad = rows.filter((r) => r.obj || r.jsx), unk = rows.filter((r) => !r.obj && !r.jsx && r.varr);
console.log(`fayl ${rows.length} · xato (obyekt/JSX) ${bad.length} · faqat o'zgaruvchi (aniqlanmadi) ${unk.length} · toza ${rows.length - bad.length - unk.length}`);
for (const r of bad) console.log(`XATO  ${r.f}  obyekt=${r.obj} jsx=${r.jsx} matn=${r.ok} o'zg=${r.varr}`);
for (const r of unk) console.log(`?     ${r.f}  o'zg=${r.varr} ${JSON.stringify(r.samples)}`);
for (const r of rows.filter((r) => !r.obj && !r.jsx && !r.varr)) console.log(`toza  ${r.f}  matn=${r.ok}`);
