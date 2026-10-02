#!/usr/bin/env node
// DARVOZA (F-1001-91, Q3): kompilyator maslahat-ro'yxati XARITA bilan bir xilmi va to'liqmi.
//   node scripts/lint-teg-royxat.mjs      → 0 topilma = o'tdi (exit 0), aks holda exit 1
//  1) HtmlCompiler.jsx ichidagi avto-blok xaritadan orqada emas (gen --check)
//  2) har teg/atribut/xossa/so'zda uz+ru izoh bor, `dars` tartibda bor
//  3) 1–4c kompilyator topshiriqlari (TASK_*/KOD_TASK, HW dan tashqari) so'ragan teglar xaritada o'sha darsgacha
//  4) 1-Modulning har kompilyatorli darsi `stage` beradi (o'tilmagan teg ko'rinmasin — F-1001-90 sinfi)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const X = JSON.parse(readFileSync('src/compilator/teg-xaritasi.json', 'utf8'));
const errs = [];
// 1
try { execFileSync('node', ['scripts/gen-teg-royxat.mjs', '--check'], { stdio: 'pipe' }); } catch { errs.push('1) HtmlCompiler.jsx teg-ro\'yxat bloki xaritadan ORQADA — node scripts/gen-teg-royxat.mjs'); }
// 2
const rank = (k) => { if (!k) return Infinity; const i = X.tartib.indexOf(k); if (i !== -1) return i; const m = /^(m\d[abc]?)-/.exec(k); const w = m ? X.tartib.indexOf(m[1] + '-*') : -1; return w === -1 ? Infinity : w; };
const chk = (what, e, name) => {
  if (!e.d || !e.d.uz || !e.d.ru) errs.push(`2) ${what} \`${name}\`: uz/ru izoh yo'q`);
  if (rank(e.dars) === Infinity) errs.push(`2) ${what} \`${name}\`: dars \`${e.dars}\` tartibda yo'q`);
};
for (const t of X.html.teglar) chk('teg', t, t.t);
for (const a of X.html.atributlar) chk('atribut', a, a.tag + ' ' + a.a);
for (const c of X.css.xossalar) chk('css', c, c.p);
for (const k of [...X.js.kalit_sozlar, ...X.js.api]) chk('js', k, k.k);
// 3 + 4
const taught = Object.fromEntries(X.html.teglar.map((t) => [t.t, t.dars]));
const known = new Set([...Object.keys(taught), ...X.html.orgatilmaydi.map((x) => x.split(' ')[0])]);
const app = readFileSync('src/App.jsx', 'utf8');
const imp = Object.fromEntries([...app.matchAll(/const (\w+) = L\(\(\) => import\('\.\/([^']+)'\)\)/g)].map((m) => [m[1], m[2]]));
const rows = [...app.matchAll(/\{ key: '(m(?:1|2|3|4|4a|4b|4c)-\d+)', n: \d+,[^\n]*?comp: (\w+)/g)].map((m) => [m[1], m[2]]);
let tasks = 0;
for (const [k, comp] of rows) {
  const f = imp[comp]; if (!f || !existsSync('src/' + f)) continue;
  const s = readFileSync('src/' + f, 'utf8');
  if (!s.includes('compilator/HtmlCompiler')) continue;
  if (k.startsWith('m1-')) {
    const calls = (s.match(/<HtmlCompiler\b/g) || []).length, withStage = (s.match(/<HtmlCompiler stage="m1-\d+"/g) || []).length;
    if (calls !== withStage) errs.push(`4) ${f}: ${calls} ta <HtmlCompiler>, stage bor ${withStage} ta`);
  }
  for (const m of s.matchAll(/const (TASK_\w+|KOD_TASK)\s*=\s*\{([\s\S]*?)\n\};/g)) {
    if (m[1] === 'TASK_HW') continue;
    tasks++;
    const need = new Set();
    for (const t of m[2].matchAll(/C\.(?:has|text|attr|attrs|nested|count)\('([a-z0-9]+)(?:\s+([a-z0-9]+))?/g)) { need.add(t[1]); if (t[2]) need.add(t[2]); }
    for (const t of m[2].matchAll(/label: \{ uz: ['"][^'"]*<([a-z0-9]+)>/g)) need.add(t[1]);
    for (const t of need) {
      if (!known.has(t)) continue;                    // teg emas (selektor/sinf) yoki HTML emas
      if (!taught[t]) errs.push(`3) ${k} ${m[1]}: \`${t}\` so'raladi, xaritada «o'rgatilmaydi»`);
      else if (rank(taught[t]) > rank(k)) errs.push(`3) ${k} ${m[1]}: \`${t}\` so'raladi, lekin faqat ${taught[t]} da o'rgatiladi`);
    }
  }
}
if (errs.length) { console.log('❌ lint-teg-royxat: ' + errs.length + ' topilma'); for (const e of errs) console.log('  ' + e); process.exit(1); }
console.log(`✅ lint-teg-royxat: blok=xarita · izohlar to'liq (teg ${X.html.teglar.length}, atribut ${X.html.atributlar.length}, css ${X.css.xossalar.length}, js ${X.js.kalit_sozlar.length + X.js.api.length}) · ${tasks} topshiriq xaritaga mos · 1-Modul stage to'liq`);
