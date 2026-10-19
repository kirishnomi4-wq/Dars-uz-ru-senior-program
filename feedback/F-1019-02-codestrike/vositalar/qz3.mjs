import fs from 'fs';
const R = '/home/kali/Desktop/internetLesson';
const list = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const OUT = process.argv[3];
const byM = {};
for (const o of list) {
  if (!o.file || !o.n) continue;
  const s = fs.readFileSync(R + '/' + o.file, 'utf8');
  const a = s.indexOf('const QUIZ_BANK = ['); const b = s.indexOf('\n];', a);
  const arr = new Function('return ' + s.slice(a + 'const QUIZ_BANK = '.length, b + 2))();
  const len = (v) => (typeof v === 'string' ? v.length : (v && v.uz ? v.uz.length : 0));
  const qs = arr.map((q, i) => {
    const Q = len(q.q), O = Math.max(...q.opts.map(len)), T = Q + q.opts.map(len).reduce((x, y) => x + y, 0);
    const L = q.opts.map(len); const sorted = [...L].sort((x, y) => y - x);
    return { i, q: q.q, opts: q.opts, correct: q.correct, olchov: { savol: Q, maxVariant: O, jami: T, oshdi: Q > 60 || O > 30 || T > 140, togriEngUzun: L[q.correct] === sorted[0] && sorted[0] > 1.3 * sorted[1] } };
  });
  (byM[o.m] ||= []).push({ key: o.key, file: o.file, qs });
}
for (const [m, ls] of Object.entries(byM)) fs.writeFileSync(`${OUT}/m${m}.json`, JSON.stringify(ls, null, 1));
console.log(Object.entries(byM).map(([m, l]) => `LMS ${m}: ${l.length} dars, ${l.reduce((x, y) => x + y.qs.length, 0)} savol, oshgan ${l.reduce((x, y) => x + y.qs.filter(q => q.olchov.oshdi).length, 0)}`).join('\n'));
