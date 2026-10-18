import { readFileSync } from 'node:fs';
const t = readFileSync('/home/kali/Desktop/internetLesson/src/2-Modull/PmLesson6.jsx', 'utf8');
const get = (n) => { const m = t.match(new RegExp('const ' + n + " = '(.*)';")); return m[1]; };
const helper = t.match(/const KOD_HELPER = `([\s\S]*?)`;/)[1];
const starter = t.match(/const KOD_STARTER = KOD_HELPER \+ `([\s\S]*?)`;/)[1];
const yechim = starter
  .replace('"",   // peshtaxta', '"Bugungi menyu va narxlar",   // peshtaxta')
  .replace('"",   // oshpaz', '"Buyurtmani o\'zi qabul qiladi",   // oshpaz')
  .replace('""    // javon', '"Narxlarni eslab qoladi"    // javon')
  .replace('return nomlar[i] + ": " + "";', 'return nomlar[i] + ": " + javoblar[i];')
  .replace('// chiqar(...) ni shu yerda chaqiring', 'chiqar(oddiyGap(i));');
for (const [nom, kod] of [['starter (bo\'sh)', starter], ['yechim', yechim]]) {
  const src = helper + kod + `\n;[${get('KOD_EVAL_C1')}, ${get('KOD_EVAL_C2')}, ${get('KOD_EVAL_C3')}]`;
  console.log(nom, '→ c1,c2,c3 =', JSON.stringify((0, eval)(src)));
}
