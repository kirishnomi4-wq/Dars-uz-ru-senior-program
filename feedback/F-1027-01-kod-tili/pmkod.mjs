// F-1027-01: PM kompilyator-mashqlari uchun umumiy nom-almashtirish.
// node pmkod.mjs <config.json>  — config: { file, ids:{eski:yangi}, vals:{"eski":"yangi"}, fn:[eski,yangi], dataKeys:{eski:yangi}, dataVals:{eski:yangi}, inline:{eski:yangi}, starterStart, starterEnd }
import { readFileSync, writeFileSync } from 'node:fs';
const cfg = JSON.parse(readFileSync(process.argv[2], 'utf8'));
let s = readFileSync(cfg.file, 'utf8');
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// 1) Starter: satr-literallar tashqarisida identifikatorlar, ichida faqat to'liq qiymatlar
const a = s.indexOf(cfg.starterStart), b = s.indexOf(cfg.starterEnd, a);
if (a < 0 || b < 0) throw new Error('starter chegarasi topilmadi');
let st = s.slice(a, b);
const outside = (txt) => { // izoh (//...) va "..." satrlardan tashqari bo'laklarni almashtirish
  return txt.replace(/("(?:\\.|[^"\\\n])*")|(\/\/[^\n]*)|([^"/]+|\/)/g, (m, str, cmt, code) => {
    if (str) return cfg.vals && Object.prototype.hasOwnProperty.call(cfg.vals, str.slice(1, -1)) ? '"' + cfg.vals[str.slice(1, -1)] + '"' : str;
    if (cmt) { let c = cmt; for (const [o, n] of Object.entries(cfg.cmt || {})) c = c.split(o).join(n); return c; }
    let c = code; for (const [o, n] of Object.entries(cfg.ids)) c = c.replace(new RegExp('(?<![\\w$])' + esc(o) + '(?![\\w$])', 'g'), n); return c;
  });
};
st = outside(st);
for (const [o, n] of Object.entries(cfg.after || {})) { if (!st.includes(o)) throw new Error('after topilmadi: ' + o); st = st.split(o).join(n); }
s = s.slice(0, a) + st + s.slice(b);
// 2) KOD_DATA: ikkala kalit
if (cfg.dataKeys) {
  const m = s.match(/^const KOD_DATA = (`[^`]*`|'[^']*'|"[^"]*");$/m); if (!m) throw new Error('KOD_DATA yo\'q');
  const arr = eval('(' + eval(m[1]) + ')');
  const two = arr.map(o => { const r = {}; for (const [k, v] of Object.entries(o)) { const nk = cfg.dataKeys[k] || k; r[nk] = (cfg.dataVals && typeof v === 'string' && cfg.dataVals[v]) ? cfg.dataVals[v] : v; } return cfg.keyBased ? r : { ...r, ...o }; });
  const js = JSON.stringify(two).replace(/"(\w+)":/g, '$1:');
  s = s.replace(m[0], "// F-1027-01: eski saqlangan kod ham o'tadi — ma'lumotda eski va yangi kalitlar birga.\nconst KOD_DATA = `" + js.replace(/`/g, '\\`') + "`;");
}
// 3) tekshiruvlar: fn
if (cfg.fn) {
  const [o, n] = cfg.fn;
  if (!/^const KOD_FN = /m.test(s)) s = s.replace(/^(\/\/ F-1027-01: eski saqlangan kod ham o'tadi[^\n]*\n)?const KOD_DATA = /m, (mm) => mm + '__KODFN__');
  const back = cfg.dataKeys ? Object.fromEntries(Object.entries(cfg.dataKeys).map(([k, v]) => [v, k])) : {};
  const backV = cfg.dataVals ? Object.fromEntries(Object.entries(cfg.dataVals).map(([k, v]) => [v, k])) : {};
  const fnExpr = cfg.keyBased ? `(function(x){if(typeof ${n}==='function')return ${n}(x);var B=${JSON.stringify(back).replace(/"/g, "'")},V=${JSON.stringify(backV).replace(/"/g, "'")},m=${JSON.stringify(cfg.outMap || {}).replace(/"/g, "'")};var c=function(o){if(!o||typeof o!=='object'||Array.isArray(o))return o;var r={};for(var k in o){var v=o[k];r[B[k]||k]=(typeof v==='string'&&V[v])?V[v]:v;}return r;};var r=${o}(Array.isArray(x)?x.map(c):c(x));return Array.isArray(r)?r.map(function(k){return m[k]||k;}):r;})` : cfg.outMap ? `(function(x){var f=typeof ${n}==='function'?${n}:${o};var m=${JSON.stringify(cfg.outMap).replace(/"/g, "'")};var r=f(x);return Array.isArray(r)?r.map(function(k){return m[k]||k;}):r;})` : `(typeof ${n}==='function'?${n}:${o})`;
  s = s.replace('__KODFN__', '').replace(/^const KOD_DATA = .*$/m, (mm) => mm + '\nconst KOD_FN = ' + JSON.stringify(fnExpr) + ';');
  const before = (s.match(new RegExp('(?<![\\w$])' + o + '\\(\\$\\{KOD_DATA', 'g')) || []).length + (s.match(new RegExp('(?<![\\w$])' + o + '\\(\\[', 'g')) || []).length;
  s = s.replace(/C\.evalEquals\(`[^`]*`/g, (ex) => ex.replace(new RegExp('(?<![\\w$\'"])' + esc(o) + '\\(', 'g'), '${KOD_FN}('));
  console.log('tekshiruvda fn:', before);
}
// 4) inline kod (mono/qcode/b ichidagi, `...` ichidagi)
for (const [o, n] of Object.entries(cfg.inline || {})) {
  const re = new RegExp('(<(?:span|code|b)[^>]*className="[^"]*(?:mono|qcode)[^"]*"[^>]*>[^<]*?)(?<![\\w$])' + esc(o) + '(?![\\w$])', 'g');
  let prev; do { prev = s; s = s.replace(re, '$1' + n); } while (s !== prev);
}
for (const [o, n] of Object.entries(cfg.plain || {})) { const c = s.split(o).length - 1; s = s.split(o).join(n); console.log('plain', o.slice(0, 40), '×' + c); }
writeFileSync(cfg.file, s); console.log('ok', cfg.file);
