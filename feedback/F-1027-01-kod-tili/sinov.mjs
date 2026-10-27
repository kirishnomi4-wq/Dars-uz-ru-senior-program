// node sinov.mjs <fayl> '<yangi yechim (starter ichidagi "return [];" o'rniga)>' '<eski to'liq kod>'
import { readFileSync } from 'node:fs';
const [f, solBody, oldCode] = process.argv.slice(2);
const s = readFileSync(f, 'utf8');
const g = (n) => { const m = s.match(new RegExp('^const ' + n + ' = (`[^`]*`|\'[^\']*\'|"[^"]*");$', 'm')); return m ? eval(m[1]) : undefined; };
const DATA = g('KOD_DATA'), FN = g('KOD_FN');
const ex = [...s.matchAll(/C\.evalEquals\((`[^`]*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'), '((?:\\.|[^'\\])*)'/g)].map(m => {
  let e = m[1]; if (e[0] === '`') e = e.slice(1, -1).split('${KOD_DATA}').join(DATA).split('${KOD_FN}').join(FN); else e = eval(e);
  return [e, m[2].replace(/\\'/g, "'")]; });
const i0 = s.indexOf('const KOD_STARTER = '); const stTxt = s.slice(i0 + 20, s.indexOf('` };', i0) + 3) || s.slice(i0 + 20, s.indexOf('`,\n};', i0) + 4);
const st = eval('(' + stTxt + ')');
const cut = (c) => c.replace(/\nconsole\.log[\s\S]*$/, '');
const sol = cut(st.uz).replace(/return \[\];/, solBody);
const run = (c) => ex.map(([e, w]) => { try { return String(new Function(c + ';return ' + e)()) === w ? '✓' : '✗'; } catch (x) { return 'E'; } }).join('');
console.log('yangi', run(sol), '· eski', run(oldCode), '· starter', run(cut(st.uz)), '·', ex.length, 'tekshiruv');
