// 16a reestr: lesson_id + lesson_version → CRM class_id → Learn id (+ material id uz/ru)
import fs from 'node:fs';
const R = '/home/kali/Desktop/internetLesson';
const reestr = JSON.parse(fs.readFileSync(`${R}/LMS_REESTR.json`, 'utf8')).darslar;
const csv = (p) => {
  const rows = []; let row = [], cell = '', q = false; const s = fs.readFileSync(p, 'utf8');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === '"' && s[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [h, ...body] = rows; return body.filter((r) => r.length > 1).map((r) => Object.fromEntries(h.map((k, i) => [k, r[i] ?? ''])));
};
const cl = csv(`${R}/feedback/F-1023-01-learn/ommaviy-yuklash/CLASS-LEARN.csv`).filter((r) => r.lid && r.tur === 'Class' && r.holat === 'Active');
const learn = new Map(csv(`${R}/feedback/F-1023-01-learn/ommaviy-yuklash/LEARN-OCHILDI.csv`).map((r) => [r.class_id, r.learn_id]));
const byLid = new Map(cl.map((r) => [r.lid, r]));
const out = [], miss = [];
for (const [lid, d] of Object.entries(reestr)) {
  const c = byLid.get(lid);
  if (!c) { miss.push(`class yo'q: ${lid}`); continue; }
  const learnId = learn.get(c.class_id);
  if (!learnId) miss.push(`learn yo'q: ${lid} class ${c.class_id}`);
  out.push({ modul: d.modul, crm_bolim: c.bolim, class_id: c.class_id, class_tartib: c.tartib, lesson_id: lid, lesson_version: `v${d.v}`, material_uz: d.crm?.uz ?? '', material_ru: d.crm?.ru ?? '', learn_id: learnId ?? '', nom_uz: d.nom_uz });
}
out.sort((a, b) => a.modul - b.modul || Number(a.class_tartib) - Number(b.class_tartib));
const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const head = Object.keys(out[0]);
fs.writeFileSync(`${R}/feedback/F-1105-03-analitika/16a-REESTR-DARS-CLASS-LEARN.csv`, [head.join(','), ...out.map((r) => head.map((k) => esc(r[k])).join(','))].join('\n') + '\n');
const dupClass = out.length - new Set(out.map((r) => r.class_id)).size, dupLearn = out.length - new Set(out.map((r) => r.learn_id)).size;
console.log(JSON.stringify({ reestr: Object.keys(reestr).length, class_active: cl.length, learn_rows: learn.size, out: out.length, miss, dupClass, dupLearn, versiyalar: out.reduce((m, r) => (m[r.lesson_version] = (m[r.lesson_version] || 0) + 1, m), {}) }, null, 1));
