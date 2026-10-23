// LMS yuklash to'plami: modul bo'yicha paket.json bo'lagi + rasmlar (nomi takrorlanmasin: uz__/ru__ old qo'shimcha).
// Ishlatish: node vositalar/lms-toplam.mjs <chiqish-papka>  → <papka>/m<N>/{paket.json, uz__*.png, ru__*.png}
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.argv[2]; const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'lms/paket.json'), 'utf8')).vazifalar;
const nom = r => r.startsWith('rasm/ru/') ? 'ru__' + path.basename(r) : 'uz__' + path.basename(r);
const mod = {};
for (const v of Object.values(P)) {
  const m = v.id.split('-')[0]; (mod[m] ||= { vazifalar: {}, rasm: new Set() });
  const c = JSON.parse(JSON.stringify(v));
  for (const til of ['uz', 'ru']) {
    if (c[til].rasm) { mod[m].rasm.add(c[til].rasm); c[til].rasm = nom(c[til].rasm); }
    for (const q of c[til].savollar || []) if (q.rasm) { mod[m].rasm.add(q.rasm); q.rasm = nom(q.rasm); }
  }
  mod[m].vazifalar[v.id] = c;
}
for (const [m, d] of Object.entries(mod)) {
  const dir = path.join(OUT, 'm' + m); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'paket.json'), JSON.stringify({ vazifalar: d.vazifalar }));
  for (const r of d.rasm) fs.copyFileSync(path.join(ROOT, r), path.join(dir, nom(r)));
  const kb = fs.readdirSync(dir).reduce((s, f) => s + fs.statSync(path.join(dir, f)).size, 0) / 1024;
  console.log(`m${m}: ${Object.keys(d.vazifalar).length} vazifa · ${d.rasm.size} rasm · ${Math.round(kb)} KB`);
}
