// Fayl bo'yicha: kod-kontekstdagi o'zbekcha nomzodlar + har biriga bitta manba-qator. node fayl-hisobot.mjs <jsx>…
import { readFileSync } from 'node:fs';
import { codeSpots, isBad } from './kodnom.mjs';
const repo = new Set(readFileSync(new URL('./repo-nomlar.txt', import.meta.url), 'utf8').split('\n'));
for (const f of process.argv.slice(2)) {
  const src = readFileSync(f, 'utf8'); const lines = src.split('\n'); const by = {};
  for (const s of codeSpots(src)) { if (!isBad(s.name)) continue; const ln = src.slice(0, s.abs).split('\n').length; const o = (by[s.name] ||= { n: 0, ctx: new Set(), ln: [] }); o.n++; o.ctx.add(s.ctx); if (o.ln.length < 3 && !o.ln.includes(ln)) o.ln.push(ln); }
  console.log('### ' + f + '  (' + Object.keys(by).length + ' nom)');
  for (const [k, o] of Object.entries(by)) { const l = lines[o.ln[0] - 1]; const i = Math.max(0, l.indexOf(k) - 50); console.log(`  ${k}${repo.has(k) ? '*' : ''} ×${o.n} [${[...o.ctx]}] L${o.ln.join(',')}: ${l.slice(i, i + 120).trim()}`); }
}
