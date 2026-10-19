// Tuzatishlarni QUIZ_BANK yozuvlariga qo'llaydi (bir yoki ko'p qatorli yozuv): node qolla.mjs <N...> [--quruq]   (fix-m<N>.json)
import fs from 'fs';
const R = process.env.QR || '/home/kali/Desktop/internetLesson'; const D = new URL('../royxat/', import.meta.url).pathname;
const args = process.argv.slice(2); const quruq = args.includes('--quruq'); const mods = args.filter(a => !a.startsWith('--'));
const bankOl = (lines) => {
  const a = lines.findIndex(l => l.startsWith('const QUIZ_BANK = ['));
  let b = a + 1; while (b < lines.length && lines[b] !== '];') b++;
  const arr = new Function('return ' + lines.slice(a, b + 1).join('\n').replace('const QUIZ_BANK = ', ''))();
  const ql = []; for (let k = a + 1; k < b; k++) if (/^\s*\{ q: /.test(lines[k])) ql.push(k);
  return { a, b, arr, ql };
};
const js = (v) => JSON.stringify(v);
const opt = (o) => (typeof o === 'string' ? js(o) : `{ uz: ${js(o.uz)}, ru: ${js(o.ru)} }`);
let jami = 0; const hisob = [];
for (const N of mods) {
  const fix = JSON.parse(fs.readFileSync(`${D}fix-m${N}.json`, 'utf8'));
  const byFile = {}; for (const f of fix) (byFile[f.file] ||= []).push(f);
  for (const [file, fs_] of Object.entries(byFile)) {
    try {
      const lines = fs.readFileSync(R + '/' + file, 'utf8').split('\n');
      const t = bankOl(lines);
      if (t.ql.length !== t.arr.length) { hisob.push(`❌ ${file}: yozuv boshlari ${t.ql.length} ≠ bank ${t.arr.length}`); continue; }
      const spans = t.ql.map((k, j) => { let e = (j + 1 < t.ql.length ? t.ql[j + 1] : t.b) - 1; while (e > k && /^\s*(\/\/.*)?$/.test(lines[e])) e--; return [k, e]; });
      const tartib = [...fs_].sort((x, y) => y.i - x.i);
      let xato = null;
      for (const f of tartib) {
        if (t.arr[f.i].correct !== f.correct) { xato = `#${f.i} correct mos emas`; break; }
        const [k, e] = spans[f.i]; const ind = lines[k].match(/^\s*/)[0]; const oxirgi = lines[e];
        const vergul = /\}\s*,\s*(\/\/.*)?$/.test(oxirgi) ? ',' : ''; const izoh = (oxirgi.match(/\}\s*,?\s*(\/\/.*)$/) || [])[1];
        lines.splice(k, e - k + 1, `${ind}{ q: { uz: ${js(f.q.uz)}, ru: ${js(f.q.ru)} }, opts: [${f.opts.map(opt).join(', ')}], correct: ${f.correct} }${vergul}${izoh ? ' ' + izoh : ''}`);
      }
      if (xato) { hisob.push(`❌ ${file}: ${xato} — qo'llanmadi`); continue; }
      const t2 = bankOl(lines);
      if (t2.arr.length !== t.arr.length || t2.arr.some((q, i) => q.correct !== t.arr[i].correct)) { hisob.push(`❌ ${file}: qayta o'qishda bank mos emas — qo'llanmadi`); continue; }
      const kut = Object.fromEntries(fs_.map(f => [f.i, f]));
      const mos = t2.arr.every((q, i) => !kut[i] || ((typeof q.q === 'string' ? q.q : q.q.uz) === kut[i].q.uz));
      if (!mos) { hisob.push(`❌ ${file}: yangi matn bankda topilmadi — qo'llanmadi`); continue; }
      if (!quruq) fs.writeFileSync(R + '/' + file, lines.join('\n'));
      jami += fs_.length; hisob.push(`✓ ${file}: ${fs_.length} savol`);
    } catch (e) { hisob.push(`❌ ${file}: ${e.message.split('\n')[0]} — qo'llanmadi`); }
  }
}
console.log(hisob.join('\n')); console.log(`${quruq ? '[quruq] ' : ''}jami ${jami} savol`);
