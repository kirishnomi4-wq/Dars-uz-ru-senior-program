import { readFileSync, readdirSync } from 'node:fs';
const WL = new Set(['▶','▸','◂','◀','✓','✔','✕','✗','×','↻','↺','←','→','↑','↓','↔','⏹','✎','•','·','—','–','↩','⬆','⬇','➜','⛶']);
const EMO = /\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*/gu;
let all = 0, allOld = 0;
for (let d = 5; d <= 12; d++) {
  let n = 0, files = 0;
  for (const f of readdirSync(`src/${d}-Modull`).filter(x => x.endsWith('.jsx'))) {
    files++;
    let t = readFileSync(`src/${d}-Modull/${f}`, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    for (const m of t.matchAll(/uz:\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)/g)) n += (m[1].match(EMO) || []).map(x => x.replace(/️/g, '')).filter(x => !WL.has(x)).length;
  }
  all += n; console.log(`${d + 2}-M: ${n} (${files} dars, darsga ${(n / files).toFixed(1)})`);
}
console.log('jami', all);
