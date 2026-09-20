#!/usr/bin/env node
// ============================================================
//  yuklash-papka — LMS'ga qo'lda yuklash uchun TAYYOR papka yig'adi (F-0921, foydalanuvchi talabi 21.09).
//
//  Nima qiladi: `src/App.jsx` dagi MODULES registri (dars tartibi — yagona haqiqat manbai) bo'yicha
//  har modulning darslarini va uyga-vazifa paketlarini prod manzili bilan yig'adi va
//    yuklash-<sana>/<modul>/NN-<Dars>.jsx        (NN — kursdagi tartib raqami)
//    yuklash-<sana>/<modul>/ROYXAT.md            (tartib · tur · sarlavha · lesson_id · md5)
//    yuklash-<sana>/README.md                    (yuklash yo'riqnomasi + CRM modul-mosligi)
//  shaklida joylaydi. Manba fayllarga TEGMAYDI; `lms/` papkasi ham o'zgarmaydi.
//
//  Ishlatish: node scripts/yuklash-papka.mjs [--out yuklash-2026-09-21] [--moduls 1,2,3,4,4a,4b,4c]
// ============================================================
import { readFileSync, writeFileSync, mkdirSync, rmSync, mkdtempSync, copyFileSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, basename, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const OUT = opt('--out', `yuklash-${new Date().toISOString().slice(0, 10)}`);
const MODS = opt('--moduls', '1,2,3,4,4a,4b,4c').split(',');

// CRM'dagi bo'lim nomi (bizdagi modul → CRM): 2026-09 holati
const CRM = { '1': 'M1 (ildiz)', '2': 'M2 (ildiz)', '3': '4-M', '4': '5-M', '4a': '6-M', '4b': '6-M', '4c': '6-M' };

// ── App.jsx dan tartib ─────────────────────────────────────────────────────
const app = readFileSync('src/App.jsx', 'utf8');
const imports = Object.fromEntries([...app.matchAll(/const (\w+) = L\(\(\) => import\('\.\/([^']+)'\)\)/g)].map((m) => [m[1], 'src/' + m[2]]));
const modules = [...app.matchAll(/\{\s*id: '([^']+)', slug: '[^']*', title: '((?:[^'\\]|\\.)*)'[\s\S]*?lessons: \[([\s\S]*?)\n {4}\],/g)].map(([, id, title, body]) => ({
  id, title: title.replace(/\\'/g, "'"),
  lessons: [...body.matchAll(/\{ key: '([^']+)', n: (\d+),\s*type: '([^']*)',\s*emoji: '[^']*', title: '((?:[^'\\]|\\.)*)'[^}]*?(?:comp: (\w+))?\s*\},/g)]
    .map(([, key, n, type, t, comp]) => ({ key, n: Number(n), type, title: t.replace(/\\'/g, "'"), src: comp && imports[comp] })),
}));

const jobs = [];
for (const m of modules.filter((x) => MODS.includes(x.id))) {
  for (const l of m.lessons) {
    if (!l.src) continue;                                    // Demo Day / rezerv — fayl yo'q
    jobs.push({ mod: m.id, modTitle: m.title, ...l, hw: null });
    const hw = l.src.replace(/\.jsx$/, '.homework.jsx');     // uyga-vazifa paketi (bo'lsa)
    if (existsSync(hw)) jobs[jobs.length - 1].hw = hw;
  }
}
console.log(`Registr: ${jobs.length} dars · uyga-vazifa ${jobs.filter((j) => j.hw).length}`);

// ── Yig'ish (prod manzili) ─────────────────────────────────────────────────
const TMP = mkdtempSync(join(tmpdir(), 'yuklash-'));
const srcs = [...jobs.map((j) => j.src), ...jobs.filter((j) => j.hw).map((j) => j.hw)];
console.log(`Yig'ilmoqda: ${srcs.length} fayl → ${TMP}`);
execFileSync('node', ['scripts/build-lms.mjs', ...srcs], { env: { ...process.env, LMS_OUT_DIR: TMP }, stdio: ['ignore', 'pipe', 'inherit'] });

// build-lms OUT_MAP bo'yicha kichik papkalarga ham yozishi mumkin — fayllarni nom bo'yicha topamiz
const built = new Map();
const walk = (dir) => { for (const n of readdirSync(dir, { withFileTypes: true })) { const p = join(dir, n.name); if (n.isDirectory()) walk(p); else if (n.name.endsWith('.jsx')) built.set(n.name, p); } };
walk(TMP);

// ── Joylash + ro'yxat ──────────────────────────────────────────────────────
rmSync(OUT, { recursive: true, force: true });
const md5 = (p) => createHash('md5').update(readFileSync(p)).digest('hex');
const lessonId = (p) => (/lessonId:\s*['"]([^'"]+)['"]/.exec(readFileSync(p, 'utf8')) || [])[1] || (/HW_ID\s*=\s*['"]([^'"]+)['"]/.exec(readFileSync(p, 'utf8')) || [])[1] || '';
let total = 0;
const rootRows = [];
for (const m of modules.filter((x) => MODS.includes(x.id))) {
  const mine = jobs.filter((j) => j.mod === m.id);
  if (!mine.length) continue;
  const dir = join(OUT, `${m.id}-Modul`);
  mkdirSync(dir, { recursive: true });
  const rows = [`# ${m.id}-Modul — ${m.title}`, '', `CRM'da: **${CRM[m.id] || '?'}** bo'limi · ${mine.length} dars`, '',
    '| № | Tur | Dars | Fayl | lesson_id | md5 |', '|---|---|---|---|---|---|'];
  for (const j of mine) {
    const b = built.get(basename(j.src));
    if (!b) { console.log(`✗ yig'ilmagan: ${j.src}`); continue; }
    const nn = String(j.n).padStart(2, '0');
    const out = join(dir, `${nn}-${basename(j.src)}`);
    copyFileSync(b, out); total++;
    rows.push(`| ${nn} | ${j.type} | ${j.title} | \`${basename(out)}\` | \`${lessonId(out)}\` | \`${md5(out)}\` |`);
    if (j.hw) {
      const hb = built.get(basename(j.hw));
      if (hb) {
        const ho = join(dir, `${nn}-${basename(j.hw, '.jsx')}.jsx`.replace('.homework', '-uyga-vazifa'));
        copyFileSync(hb, ho); total++;
        rows.push(`| ${nn}. | Uyga vazifa | ${j.title} — vazifa | \`${basename(ho)}\` | \`${lessonId(ho)}\` | \`${md5(ho)}\` |`);
      }
    }
  }
  writeFileSync(join(dir, 'ROYXAT.md'), rows.join('\n') + '\n');
  rootRows.push(`| ${m.id}-Modul | ${m.title} | ${CRM[m.id] || '?'} | ${mine.length} |`);
}

writeFileSync(join(OUT, 'README.md'), [
  `# LMS'ga yuklash — ${OUT}`, '',
  `Yig'ilgan: ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC · jami **${total} fayl**.`,
  'Har fayl o\'zi-yetarli (`.jsx`): ichida dars, kompilyator va jonli-qatlam bor, qo\'shimcha modul kerak emas.',
  'Server manzili: **prod** (`dars-api.coddycamp.uz`).', '',
  '| Papka | Modul | CRM bo\'limi | Dars |', '|---|---|---|---|', ...rootRows, '',
  '## Yuklash tartibi', '',
  '1. CRM → Media → material sifatida `.jsx` faylni yuklaysiz.',
  '2. Fayl nomidagi **NN** — kursdagi tartib raqami (dars ketma-ketligi shunga qarab qo\'yiladi).',
  '3. `NN-…-uyga-vazifa.jsx` — o\'sha darsning uyga vazifasi (alohida material).',
  '4. Har modulning `ROYXAT.md` faylida sarlavha, `lesson_id` va `md5` bor — yuklagandan keyin tekshirish uchun.', '',
  '## Muhim', '',
  '- `lesson_id` serverdagi katalog bilan bir xil bo\'lishi shart — u fayl ichida, o\'zgartirilmaydi.',
  '- Dars tugaganda natija avtomat CRM\'ga ketadi; uyga vazifa topshirilganda ham (21.09 dan).',
  '- Bir o\'quvchi bir darsdan bitta natija oladi (takror o\'tish tanga bermaydi).',
].join('\n') + '\n');

rmSync(TMP, { recursive: true, force: true });
console.log(`\nTayyor: ${OUT}/ — ${total} fayl · ${rootRows.length} modul`);
