// {uz,ru} obyektini tr() siz chizish — React'ni yiqitadigan sinf (F-0912-13)
import { readFileSync, readdirSync } from 'node:fs';
const files = [];
const walk = (d) => { for (const e of readdirSync(d, { withFileTypes: true })) { if (e.isDirectory()) { if (/eski/i.test(e.name)) continue; walk(d + '/' + e.name); continue; } if (e.name.endsWith('.jsx')) files.push(d + '/' + e.name); } };
walk('src');
let total = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  // 1) shu faylda QAYSI maydon nomlari {uz: ...} obyekti sifatida e'lon qilingan
  const objFields = new Set(), strFields = new Set();
  for (const m of src.matchAll(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*\{\s*uz:/g)) objFields.add(m[1]);
  for (const m of src.matchAll(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*['"`]/g)) strFields.add(m[1]);
  if (!objFields.size) continue;
  // 2) JSX ichida {X.maydon} — tr() siz
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/\{\s*([A-Za-z_][A-Za-z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\}/g)) {
      const [hit, obj, fld] = m;
      if (!objFields.has(fld)) continue;
      const before = line.slice(Math.max(0, m.index - 24), m.index);
      if (m.index > 0 && line[m.index - 1] === '$') continue;   // ${...} — shablon-satr (CSS), JSX emas
      if (/tr\($/.test(before)) continue;                      // tr(...) ichida
      if (/[A-Za-z0-9_]=\s*$/.test(before)) continue;          // prop-o'rni: komponent o'zi tr() qilishi mumkin
      const shaky = strFields.has(fld) ? '  (⚠ bu nom satr sifatida ham ishlatilgan)' : '';
      console.log(`${f}:${i + 1}  ${hit}${shaky}`);
      total++;
    }
  });
}
console.log('\nJAMI:', total);
