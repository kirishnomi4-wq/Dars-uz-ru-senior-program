// F-1027-01 sinf-supurish: o'quvchiga ko'rinadigan kod-satrlaridagi inglizcha bo'lmagan nomlar (DARS_ETALON 11.12 · PM 112).
// Ishlatish (loyiha ildizidan): node feedback/F-1027-01-kod-tili/kod-nom-supur.mjs
// Usul: esbuild (JSX→JS, izohlarsiz) → tokenizer → faqat satr-literallar ichidagi kod; nom inglizcha lug'atda (/usr/share/dict) yo'q bo'lsa — nomzod.
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module'; const { transformSync } = createRequire(process.cwd() + '/package.json')('esbuild');
const app = readFileSync('src/App.jsx', 'utf8');
const imp = {}; for (const m of app.matchAll(/const (\w+) = L\(\(\) => import\('([^']+)'\)\)/g)) imp[m[1]] = resolve('src', m[2]);
const comps = [...new Set([...app.matchAll(/comp: (\w+)/g)].map(m => m[1]))];
const dict = new Set(readFileSync('/usr/share/dict/american-english', 'utf8').split('\n').map(w => w.toLowerCase().replace(/'s$/, '')));
const TECH = new Set(('req res btn el idx http https api json dom ctx config todo todos app url img nav src msg id db env auth jwt prisma nest js ts css html obj arr str num val vals len fn cb err args param params init utils util async eslint vite npm repo dev prod tmp temp px rem div li ul ol tbody thead tr td th href rel alt bg fg sm md lg xl vw vh onclick onchange onsubmit addeventlistener queryselector getelementbyid innerhtml textcontent classlist localstorage setitem getitem useeffect usestate usecontext useref usememo props jsx tsx ok uuid crud sql postgres pg orm dto ws socket io uz ru telegraf webhook stripe expo gemini openai gpt ai bot cron uid pid ip dns tcp udp uri ux ui cta kpi mvp pm qa ci cd yml yaml docker spec mock jest vitest eq min max avg calc fetch axios setstate onpress stylesheet bcrypt cors dotenv mongoose express nodemon readline payload okr rice nps ltv cac arpu mrr cta seo ctr kpis signup login logout navbar footer header hero btns'.split(' ')));
const words = (id) => id.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_$-]+/g, ' ').toLowerCase().split(/\s+/).filter(Boolean);
const isBad = (id) => words(id).some(w => w.length >= 3 && !/\d/.test(w) && !dict.has(w) && !dict.has(w.replace(/e?s$/, '')) && !dict.has(w.replace(/(ed|ing|er)$/, '')) && !dict.has(w.replace(/(ed|ing|er)$/, 'e')) && !TECH.has(w));
// tokenizer: satr-literallar (", ', `) ni ajratadi; ${} ichida rekursiya; regex-literal evristikasi
function strings(js) {
  const out = []; let i = 0; const n = js.length; let prev = '';
  const readTpl = () => { // i on backtick
    let buf = ''; i++;
    while (i < n && js[i] !== '`') {
      if (js[i] === '\\') { buf += js[i + 1] === 'n' ? '\n' : js[i + 1]; i += 2; continue; }
      if (js[i] === '$' && js[i + 1] === '{') { i += 2; let d = 1; const st = i; while (i < n && d) { const ch = js[i]; if (ch === '{') d++; else if (ch === '}') d--; else if (ch === '`') { readTpl(); continue; } else if (ch === '"' || ch === "'") { readQ(); continue; } i++; } buf += '${…}'; continue; }
      buf += js[i++];
    }
    i++; out.push(buf);
  };
  const readQ = () => { const q = js[i++]; let buf = ''; while (i < n && js[i] !== q) { if (js[i] === '\\') { buf += js[i + 1] === 'n' ? '\n' : js[i + 1]; i += 2; continue; } buf += js[i++]; } i++; out.push(buf); };
  while (i < n) {
    const c = js[i];
    if (c === '/' && js[i + 1] === '*') { const e = js.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
    if (c === '/' && js[i + 1] === '/') { const e = js.indexOf('\n', i); i = e < 0 ? n : e; continue; }
    if (c === '`') { readTpl(); prev = 's'; continue; }
    if (c === '"' || c === "'") { readQ(); prev = 's'; continue; }
    if (c === '/' && /[(,=:[!&|?{};+\-*%<>~^]|^$|return$/.test(prev)) { i++; let cls = false; while (i < n) { const ch = js[i]; if (ch === '\\') { i += 2; continue; } if (ch === '[') cls = true; else if (ch === ']') cls = false; else if (ch === '/' && !cls) break; else if (ch === '\n') break; i++; } i++; while (/[a-z]/.test(js[i] || '')) i++; prev = 'r'; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (/[A-Za-z0-9_$]/.test(c)) { const st = i; while (i < n && /[A-Za-z0-9_$]/.test(js[i])) i++; prev = js.slice(st, i); continue; }
    prev = c; i++;
  }
  return out;
}
const CODE = /\bfunction\s+[\w$]+\s*\(|\b(?:const|let|var)\s+[\w$]+\s*=|\bclass\s*=\s*["']|\bid\s*=\s*["']|\bdef\s+\w+\(/;
const res = [];
for (const c of comps) {
  const f = imp[c]; if (!f || !existsSync(f)) continue;
  let js; try { js = transformSync(readFileSync(f, 'utf8'), { loader: 'jsx', jsx: 'transform', legalComments: 'none', minifyWhitespace: false }).code; } catch (e) { console.error('ESBUILD', f, e.message.slice(0, 80)); continue; }
  const ids = new Map();
  const add = (x, kind, sample) => { x = (x || '').trim(); if (x && /^[A-Za-z_$][\w$-]*$/.test(x) && isBad(x) && !ids.has(x)) ids.set(x, kind); };
  for (const t of strings(js).filter(t => CODE.test(t))) {
    for (const m of t.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/g)) { add(m[1], 'fn'); m[2].split(',').forEach(p => add(p.replace(/=.*/, ''), 'param')); }
    for (const m of t.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/g)) add(m[1], 'var');
    for (const m of t.matchAll(/\b(?:class|id)\s*=\s*["']([\w -]+)["']/g)) m[1].split(/\s+/).forEach(x => add(x, 'class/id'));
  }
  if (ids.size) res.push({ f: f.replace(process.cwd() + '/', ''), ids: [...ids.entries()] });
}
res.sort((a, b) => b.ids.length - a.ids.length);
for (const o of res) console.log(String(o.ids.length).padStart(3), o.f, '·', o.ids.map(([x, k]) => `${x}(${k})`).join(' '));
console.log(`\nJAMI: ${comps.length} dars ko'rildi · ${res.length} darsda o'quvchiga ko'rinadigan kodda inglizcha bo'lmagan nom`);
