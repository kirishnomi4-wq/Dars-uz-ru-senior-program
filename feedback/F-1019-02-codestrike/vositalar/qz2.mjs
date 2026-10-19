import fs from 'fs';
const R = '/home/kali/Desktop/internetLesson';
const list = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = []; const fail = [];
for (const o of list) {
  if (!o.file || !o.n) continue;
  const s = fs.readFileSync(R + '/' + o.file, 'utf8');
  const a = s.indexOf('const QUIZ_BANK = ['); const b = s.indexOf('\n];', a);
  const lineNo = s.slice(0, a).split('\n').length;
  const src = s.slice(a + 'const QUIZ_BANK = '.length, b + 2);
  let arr;
  try { arr = new Function('return ' + src)(); } catch (e) { fail.push([o.key, o.file, e.message]); continue; }
  arr.forEach((q, i) => {
    const t = (v) => (typeof v === 'string' ? v : v && v.uz != null ? (typeof v.uz === 'string' ? v.uz : '[JSX]') : String(v));
    out.push({ m: o.m, key: o.key, file: o.file, line: lineNo + 1 + i, i, q: t(q.q), opts: (q.opts || []).map(t), c: q.correct, ru: q.q && q.q.ru ? q.q.ru : null });
  });
}
fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
console.log('savol', out.length, 'xato', fail.length); fail.slice(0, 10).forEach(f => console.log('  ', f.join(' | ')));
