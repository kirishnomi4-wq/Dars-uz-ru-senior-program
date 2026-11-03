import fs from 'node:fs';
export function mdt(file) {
  const src = fs.readFileSync(file, 'utf8');
  let m = src.match(/const MDT = (\{[\s\S]*?\n\});/);
  if (m) return eval('(' + m[1] + ')');
  const i = src.indexOf('JSON.parse(`{"1":{"type"'); if (i < 0) return null;
  const j = src.indexOf('`)', i); const lit = src.slice(i + 11, j + 1); // `...`
  return JSON.parse(eval(lit));
}
export const voices = (M) => Object.values(M).flatMap((s) => (s.seg || []).map((x) => x[2] || '')).join('\n');
