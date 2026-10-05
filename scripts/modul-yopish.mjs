// modul-yopish — modulni yopishdan oldingi bitta buyruq (konveyer 9-bosqich, mexanizm 5-bosqich, 04.10).
// Har dars: gates (12 darvoza) · lint:dizayn · ru-walk (ru, xato/o'zbekcha qoldiq) · sarlavha bitta qator (uz+ru, brauzerda).
// Modul: lint:jsx · layout (A–G, 1280×773 + 1366×768; dev server kerak) · YAKUNIY MD ekran soni · qurish kartasi reestr bilan bir xil.
//
//   npm run modul:yopish -- src/6-Modull                      (papkadagi App.jsx ga ulangan darslar)
//   npm run modul:yopish -- src/5-Modull src/pm/PmMetricsLesson.jsx --yakuniy feedback/F-0928-QA-5modul/YAKUNIY
//   --tez        layout va sarlavhani o'tkazib yuboradi (tez oraliq tekshiruv; YOPISH uchun emas)
//   --qabul E,G  layout'da foydalanuvchi QABUL QILGAN detektor turlari (A qirqilish · B ustma-ust · C qutidan chiqqan · D boshqaruv matn ustida ·
//                E pastki chiziq · F pastga tushgan · G chetga yopishgan) — soni hisobotda qoladi, yiqitmaydi. Qaror manbasini jurnalga yozing.
// Brauzer sinovi yiqilsa (TimeoutError — Chrome band) bir marta qayta yuriladi; ikkinchi marta ham yiqilsa — «SINOV YIQILDI» (nuqson emas, qayta yurgizing).
//   LESSON_URL   layout uchun dev server (sukut http://localhost:5173)
// Chiqish kodi: birorta tekshiruv yiqilsa — 1. Natija jadvali + `<scratchpad yoki /tmp>/modul-yopish-<sana>.log`.
import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1]; };
const TEZ = args.includes('--tez');
const YAK = opt('--yakuniy');
const QABUL = new Set((opt('--qabul') || '').split(',').map((x) => x.trim().toUpperCase()).filter(Boolean));
const inputs = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--yakuniy' && args[i - 1] !== '--qabul');
if (!inputs.length) { console.log('Ishlatish: npm run modul:yopish -- src/<N>-Modull [qo\'shimcha fayl…] [--yakuniy <papka>] [--tez]'); process.exit(2); }
const ROOT = process.cwd();
const app = fs.readFileSync('src/App.jsx', 'utf8');
const imp = new Map([...app.matchAll(/const (\w+) = L\(\(\) => import\('\.\/([^']+\.jsx)'\)\)/g)].map((m) => [m[1], 'src/' + m[2]]));
for (const m of app.matchAll(/import (\w+) from '\.\/([^']+\.jsx)'/g)) imp.set(m[1], 'src/' + m[2]);
const keyOf = new Map();
for (const m of app.matchAll(/\{ key: '([\w-]+)'[^}]*?comp: (\w+)/g)) { const f = imp.get(m[2]); if (f) keyOf.set(path.normalize(f), m[1]); }
let files = [];
for (const a of inputs) {
  if (fs.statSync(a).isDirectory()) files.push(...fs.readdirSync(a).filter((f) => f.endsWith('.jsx')).map((f) => path.normalize(path.join(a, f))).filter((f) => keyOf.has(f)));
  else files.push(path.normalize(a));
}
files = [...new Set(files)];
const sh = (cmd) => { const r = spawnSync('bash', ['-c', cmd], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); return { code: r.status, out: (r.stdout || '') + (r.stderr || '') }; };
const clean = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
const rows = []; let bad = 0;
const log = [];
console.log(`MODUL-YOPISH — ${files.length} dars${TEZ ? ' (--tez: layout va sarlavha o\'tkazildi)' : ''}\n`);
for (const f of files) {
  const g = clean(sh(`npm run -s gates -- ${f}`).out); const gm = /(\d+)\/(\d+) darvoza (toza|yiqildi[^\n]*)/.exec(g);
  const gOk = gm && /toza/.test(gm[3]);
  const dz = sh(`node lint-dizayn.mjs ${f}`); const dzOk = dz.code === 0; log.push(clean(dz.out));
  const rwRun = () => clean(sh(`timeout 900 env CHROME_PATH=\${CHROME_PATH:-/usr/bin/google-chrome} node tools/ru-walk.mjs ${f} --langs=ru`).out);
  let rw = rwRun(); if (!/✓ TOZA/.test(rw) && /TimeoutError|Timeout \d+ms/.test(rw)) rw = rwRun();
  const rwOk = /✓ TOZA/.test(rw); const rwYiq = !rwOk && /TimeoutError|Timeout \d+ms/.test(rw);
  let sq = '—', sqOk = true;
  if (!TEZ) {
    const sqRun = () => sh(`timeout 900 env CHROME=\${CHROME:-/usr/bin/google-chrome} node scripts/sarlavha-qator.mjs ${f}`);
    let r = sqRun(); const natija = (x) => /ta 2 qatorli sarlavha/.test(x.out);
    if (r.code !== 0 && !natija(r)) r = sqRun(); // brauzer yiqildi (natija qatori yo'q) — bir marta qayta
    sqOk = r.code === 0; sq = sqOk ? 'bitta qator' : natija(r) ? '2+ QATOR' : 'SARLAVHA SINOVI YIQILDI'; log.push(clean(r.out));
  }
  const ok = gOk && dzOk && rwOk && sqOk; if (!ok) bad++;
  rows.push([path.basename(f, '.jsx'), keyOf.get(f) || '—', gm ? `${gm[1]}/${gm[2]}${gOk ? '' : ' ' + gm[3].replace('yiqildi: ', '')}` : 'gates ?', dzOk ? 'dizayn toza' : 'DIZAYN', rwOk ? 'ru toza' : rwYiq ? 'RU SINOVI YIQILDI' : 'RU XATO', sq, ok ? '✓' : '✗']);
  log.push(g, rw);
  console.log(`${ok ? '✓' : '✗'} ${rows.at(-1).join(' · ')}`);
}
const modul = [];
{ const r = sh('npm run -s lint:jsx'); const ok = r.code === 0; modul.push(['lint:jsx', ok ? 'toza' : 'TOPILMA', ok]); log.push(clean(r.out)); }
if (!TEZ) {
  const keys = files.map((f) => keyOf.get(f)).filter(Boolean);
  const url = process.env.LESSON_URL || 'http://localhost:5173';
  const up = sh(`curl -s -o /dev/null -w '%{http_code}' ${url}`).out.trim() === '200';
  const appOk = up && sh(`curl -s -o /dev/null -w '%{http_code}' ${url}/src/App.jsx`).out.trim() === '200'; // index.html 200 bo'lsa ham App.jsx import'i buzilgan bo'lishi mumkin
  if (!up) { modul.push(['layout', `dev server yo'q (${url}) — npx vite --port 5173`, false]); }
  else if (!appOk) { modul.push(['layout', `dev server App.jsx ni yig'a olmadi (import xatosi — vite logi) — layout o'lchanmadi`, false]); }
  else {
    const lj = path.join(process.env.S || '/tmp', `modul-yopish-layout-${process.pid}.json`);
    // Har dars alohida, 10 daqiqalik chegara bilan (05.10: bitta umumiy yurish 4 soat osildi — bitta dars butun modulni to'xtatdi)
    const parts = []; for (const k of keys) { const kj = lj.replace(/\.json$/, `-${k}.json`); const rr = sh(`timeout 600 env LESSON_URL=${url} node layout-lint.mjs --keys ${k} --vp 1280x773,1366x768 --out ${kj}`); log.push(clean(rr.out));
      try { parts.push(...JSON.parse(fs.readFileSync(kj, 'utf8'))); } catch { parts.push({ key: k, mode: 'self', screens: 0, total: 0, errs: [`vaqt chegarasi yoki yiqilish (exit ${rr.code})`], findings: [] }); } }
    fs.writeFileSync(lj, JSON.stringify(parts)); const r = { code: 0 };
    let R = []; try { R = JSON.parse(fs.readFileSync(lj, 'utf8')); } catch { /* chiqish fayli yo'q — layout-lint yiqilgan */ }
    const n = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 }; let navX = 0;
    for (const x of R) {
      if ((x.errs || []).length || x.screens <= 1) navX++;
      for (const m of x.findings || []) {
        n.A += (m.clip || []).length; n.B += (m.overlap || []).length; n.C += (m.hover || []).filter((h) => !h.onPurpose).length; n.D += (m.cover || []).length;
        n.E += (m.below || []).filter((b) => !b.last && !b.panel).length; n.F += (m.low || []).length; n.G += (m.edge || []).length;
      }
    }
    const qoldi = Object.entries(n).filter(([k, v]) => v && !QABUL.has(k));
    const qab = Object.entries(n).filter(([k, v]) => v && QABUL.has(k)).map(([k, v]) => `${k} ${v}`);
    const ok = R.length > 0 && !navX && !qoldi.length;
    modul.push(['layout', `${Object.entries(n).map(([k, v]) => `${k} ${v}`).join(' · ')}${qab.length ? ` · qabul qilingan: ${qab.join(', ')}` : ''}${navX ? ` · ochilmadi: ${navX}` : ''}${R.length ? '' : ' · natija yo\'q'} (batafsil — log)`, ok]);
  }
}
if (YAK) {
  const yb = []; let yok = true;
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8'); const mt = /const SCREEN_META = \[([\s\S]*?)\n\];/.exec(src); const n = mt ? (mt[1].match(/\{\s*id:/g) || []).length : 0;
    const base = path.basename(f, '.jsx').replace(/Lesson$/, '');
    const md = fs.readdirSync(YAK).find((x) => x.endsWith('.md') && x.replace(/^\d+-/, '').replace(/\.md$/, '') === base);
    if (!md) { yb.push(`${base}: MD yo'q`); yok = false; continue; }
    const k = (fs.readFileSync(path.join(YAK, md), 'utf8').match(/^## \d+ ·/gm) || []).length;
    if (k !== n) { yb.push(`${md}: ${k}/${n}`); yok = false; }
  }
  modul.push(['YAKUNIY MD', yok ? `ekran soni ${files.length}/${files.length} mos` : yb.join(' · '), yok]);
}
{ const r = sh('node scripts/qurish-kartasi.mjs --check'); modul.push(['qurish kartasi', clean(r.out).trim(), r.code === 0]); }
console.log('\nMODUL:');
for (const [n, t, ok] of modul) { console.log(`${ok ? '✓' : '✗'} ${n}: ${t}`); if (!ok) bad++; }
const dir = process.env.S || '/tmp';
const lp = path.join(dir, `modul-yopish-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.log`);
fs.writeFileSync(lp, log.join('\n\n'));
console.log(`\n${bad ? `✗ YOPILMAYDI — ${bad} tekshiruv yiqildi` : '✓ MODUL YOPISHGA TAYYOR'} · log: ${lp}`);
process.exit(bad ? 1 : 0);
