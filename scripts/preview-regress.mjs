// ============================================================
//  preview-regress (F-1015) — oddiy rejim regressiyasi: preview o'zgarishidan OLDIN va KEYIN yig'ilgan
//  darslar brauzerda bir xil ochiladimi (smoke-lms), yig'iladimi.
//
//  · BAZA:  dars src/live o'rniga BAZA_LIVE nusxasi bilan yig'iladi (esbuild plagini importni yo'naltiradi —
//           ish papkasidagi src/live ga TEGILMAYDI), o'ramsiz (eski build-lms shakli).
//  · YANGI: haqiqiy scripts/build-lms.mjs (o'ram + yangi src/live).
//  Ikkalasi faqat OUT papkasiga yoziladi; lms/ ga yozish taqiqlangan (skript tekshiradi).
//
//  Ishlatish:
//    OUT=<vaqtinchalik papka> BAZA_LIVE=feedback/F-1015-preview/baza/live CHROME=/usr/bin/google-chrome \
//      node scripts/preview-regress.mjs [dars.jsx …]      (argumentsiz — useLiveSession ishlatadigan hamma dars)
// ============================================================
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { buildBaza } from './preview-baza-build.mjs';

const RED = '\x1b[31m', GRN = '\x1b[32m', DIM = '\x1b[2m', R = '\x1b[0m';
const OUT = process.env.OUT ? resolve(process.env.OUT) : null;
const BAZA_LIVE = resolve(process.env.BAZA_LIVE || 'feedback/F-1015-preview/baza/live');
if (!OUT || OUT === resolve('lms') || OUT.startsWith(resolve('lms') + '/')) { console.log(`${RED}OUT kerak va u lms/ bo'lmasin${R}`); process.exit(2); }

const DIRS = ['1', '2', '3', '4', '4a', '4b', '4c', '5', '6', '7', '8', '9', '10', '11', '12'].map((m) => `src/${m}-Modull`).concat('src/pm');
const all = () => DIRS.flatMap((d) => { try { return readdirSync(d).map((n) => `${d}/${n}`); } catch { return []; } })
  .filter((p) => p.endsWith('.jsx') && statSync(p).isFile() && readFileSync(p, 'utf8').includes('useLiveSession('));
const lessons = process.argv.slice(2).length ? process.argv.slice(2) : all();

// ── BAZA yig'ish ────────────────────────────────────────────────────────────
const bazaDir = join(OUT, 'baza'), yangiDir = join(OUT, 'yangi');
mkdirSync(bazaDir, { recursive: true }); mkdirSync(yangiDir, { recursive: true });
const buildFail = { baza: [], yangi: [] };
for (const f of lessons) {
  try { await buildBaza(f, join(bazaDir, basename(f)), BAZA_LIVE); }
  catch (e) { buildFail.baza.push(`${f} — ${String(e.message).split('\n')[0].slice(0, 100)}`); }
}

// ── YANGI yig'ish (haqiqiy build-lms, faqat OUT ga) ─────────────────────────
const y = spawnSync(process.execPath, ['scripts/build-lms.mjs', ...lessons], { env: { ...process.env, LMS_OUT_DIR: yangiDir }, encoding: 'utf8' });
for (const line of (y.stdout || '').split('\n')) {
  const m = /✗\s*\S*\s*(\S+\.jsx)\s+(.*)$/.exec(line.replace(/\x1b\[[0-9;]*m/g, ''));
  if (m) buildFail.yangi.push(`${lessons.find((l) => basename(l) === m[1]) || m[1]} — ${m[2].slice(0, 100)}`);
}

// ── smoke-lms ikkala papkada ────────────────────────────────────────────────
const smoke = (dir) => {
  const r = spawnSync(process.execPath, ['scripts/smoke-lms.mjs'], { env: { ...process.env, LMS_DIR: dir }, encoding: 'utf8', maxBuffer: 64 << 20 });
  const out = {}; let last = null;
  for (const raw of (r.stdout || '').split('\n')) {
    const line = raw.replace(/\x1b\[[0-9;]*m/g, '');
    const m = /^\s*([✓✗])\s+(\S+\.jsx)\s+(.*)$/.exec(line);
    if (m) { last = m[2]; out[last] = { ok: m[1] === '✓', info: m[3].trim(), why: '' }; continue; }
    if (last && out[last] && !out[last].ok && /^\s{3,}\S/.test(line) && !out[last].why) out[last].why = line.trim().slice(0, 110);
  }
  return out;
};
const sb = smoke(bazaDir), sy = smoke(yangiDir);

// ── Solishtirish ────────────────────────────────────────────────────────────
const names = lessons.map((l) => basename(l));
const rows = [];
let farq = 0;
for (const n of names) {
  const b = sb[n], yy = sy[n];
  const same = b && yy && b.ok === yy.ok && b.info === yy.info;
  if (!same) farq++;
  rows.push({ n, src: lessons.find((l) => basename(l) === n), b, y: yy, same });
}
const okY = rows.filter((r) => r.y?.ok).length;
console.log(`preview-regress: ${names.length} dars`);
console.log(`  yig'ilmadi — baza ${buildFail.baza.length}, yangi ${buildFail.yangi.length}`);
console.log(`  smoke-lms ✓ — baza ${rows.filter((r) => r.b?.ok).length}, yangi ${okY}`);
console.log(`  ${farq ? RED : GRN}baza↔yangi farq: ${farq}${R}`);
for (const k of ['baza', 'yangi']) for (const f of buildFail[k]) console.log(`  ${RED}yig'ilmadi (${k})${R} ${f}`);
for (const r of rows) {
  if (r.same && r.y?.ok) continue;
  console.log(`  ${r.same ? DIM + '=' : RED + '≠'}${R} ${r.src}\n      baza:  ${r.b ? (r.b.ok ? '✓ ' : '✗ ') + r.b.info + (r.b.why ? ' · ' + r.b.why : '') : 'yo\'q'}\n      yangi: ${r.y ? (r.y.ok ? '✓ ' : '✗ ') + r.y.info + (r.y.why ? ' · ' + r.y.why : '') : 'yo\'q'}`);
}
writeFileSync(join(OUT, 'natija.json'), JSON.stringify({ buildFail, rows }, null, 1));
console.log(`${DIM}batafsil: ${join(OUT, 'natija.json')}${R}`);
process.exit(farq || buildFail.yangi.length ? 1 : 0);
