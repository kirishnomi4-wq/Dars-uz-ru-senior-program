// Tuzatish ro'yxatini tekshiradi: node tekshir.mjs <N>   (m<N>.json — asl, fix-m<N>.json — tuzatishlar)
import fs from 'fs';
const N = process.argv[2]; const D = new URL('../royxat/', import.meta.url).pathname;
const asl = JSON.parse(fs.readFileSync(`${D}m${N}.json`, 'utf8'));
let fix; try { fix = JSON.parse(fs.readFileSync(`${D}fix-m${N}.json`, 'utf8')); } catch (e) { console.log('❌ fix-m' + N + '.json o\'qilmadi: ' + e.message); process.exit(1); }
const byKey = Object.fromEntries(asl.map(l => [l.file, l]));
const len = (v) => (typeof v === 'string' ? v.length : (v && typeof v.uz === 'string' ? v.uz.length : -1));
const errs = []; const seen = new Set(); let oshganQoldi = 0;
for (const f of fix) {
  const id = `${f.file}#${f.i}`; const L = byKey[f.file]; const o = L && L.qs[f.i];
  if (!o) { errs.push(`${id}: asl savol topilmadi`); continue; }
  if (seen.has(id)) errs.push(`${id}: takror yozuv`); seen.add(id);
  if (!Array.isArray(f.sabab) || !f.sabab.length) errs.push(`${id}: sabab yo'q`);
  if (f.correct !== o.correct) errs.push(`${id}: correct o'zgardi (${o.correct} → ${f.correct}) — o'rin saqlanadi, variantlarni almashtiring`);
  if (!f.q || typeof f.q.uz !== 'string' || typeof f.q.ru !== 'string') errs.push(`${id}: q {uz, ru} emas`);
  if (!Array.isArray(f.opts) || f.opts.length !== 4) { errs.push(`${id}: 4 variant emas`); continue; }
  const strAsl = typeof o.opts[0] === 'string';
  f.opts.forEach((x, k) => { if (strAsl ? typeof x !== 'string' : !(x && typeof x.uz === 'string' && typeof x.ru === 'string')) errs.push(`${id}: variant ${k} shakli asldagidek emas (${strAsl ? 'satr' : '{uz, ru}'})`); });
  const Q = len(f.q), Ls = f.opts.map(len), T = Q + Ls.reduce((a, b) => a + b, 0);
  if (Q > 60) errs.push(`${id}: savol ${Q} > 60`);
  if (Math.max(...Ls) > 30) errs.push(`${id}: variant ${Math.max(...Ls)} > 30`);
  if (T > 140) errs.push(`${id}: jami ${T} > 140`);
  const s = [...Ls].sort((a, b) => b - a);
  if (Ls[f.correct] === s[0] && s[0] > 1.3 * s[1]) errs.push(`${id}: to'g'ri javob boshqalardan ancha uzun (${Ls[f.correct]} vs ${s[1]})`);
  const u = f.opts.map(x => (typeof x === 'string' ? x : x.uz).trim().toLowerCase()); if (new Set(u).size < 4) errs.push(`${id}: takror variant`);
  if (/[Ѐ-ӿ]/.test(f.q.uz) || f.opts.some(x => typeof x !== 'string' && /[Ѐ-ӿ]/.test(x.uz))) errs.push(`${id}: uz matnda kirill harf`);
}
for (const L of asl) L.qs.forEach(o => { if (o.olchov.oshdi && !seen.has(`${L.file}#${o.i}`)) oshganQoldi++; });
console.log(`yozuv ${fix.length} · xato ${errs.length} · me'yordan oshib, tuzatilmagan qolgan ${oshganQoldi}`);
errs.slice(0, 60).forEach(e => console.log('  ' + e));
process.exit(errs.length || oshganQoldi ? 1 : 0);
