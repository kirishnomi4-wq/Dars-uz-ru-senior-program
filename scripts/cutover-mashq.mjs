#!/usr/bin/env node
// ============================================================================
//  cutover-mashq — CRM_YUKLASH_ROYXATI.md dagi 90 LMS-faylni BOSHIDAN yig'adi va tekshiradi.
//  Cutover kunidagi ish shu: manzil kelgach `--url <manzil> --out lms` bilan yuriladi; ungacha
//  mashq-rejimida (boshqa papkaga) — yig'ish-xatolari cutover kuni emas, bugun chiqsin.
//
//    node scripts/cutover-mashq.mjs                       # mashq: out = <tmp>/lms-mashq, url = placeholder
//    node scripts/cutover-mashq.mjs --smoke               # + har faylni brauzerda ochish (Chrome, ~10 daqiqa)
//    node scripts/cutover-mashq.mjs --url https://staging-dars-api.coddycamp.uz --out lms --smoke   # cutover kuni
//    --only <qism>  faqat nomida shu qism bor fayllar · --shared-spec <url>  tashqi kompilyator-modul manzili
//
//  Tekshiruvlar (har fayl):  manba bor · manbadagi lessonId = ro'yxatdagi · id server-katalogida (aks holda LMS'da join 404) ·
//  yig'ildi · chiqish yo'li ro'yxatdagidek · tarkibida API-manzil bor, Supabase yo'q · (smoke) brauzerda ochiladi, kompilyator qatlami ochiladi.
// ============================================================================
import { readFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const flag = (n) => argv.includes(`--${n}`);
const OUT = opt('out', join(process.env.SCRATCH || tmpdir(), 'lms-mashq'));
const URL = opt('url', 'https://staging-dars-api.coddycamp.uz'); // mashqda placeholder — cutover kuni haqiqiy manzil
const ONLY = opt('only', null);
const SMOKE = flag('smoke');
const LIST = 'CRM_YUKLASH_ROYXATI.md';
const CATALOG = 'server/data/lesson-catalog.json';
const C = { g: '\x1b[32m', r: '\x1b[31m', y: '\x1b[33m', d: '\x1b[2m', b: '\x1b[1m', x: '\x1b[0m' };

// ---- 1) ro'yxat
const rows = [];
for (const line of readFileSync(LIST, 'utf8').split('\n')) {
  const m = /^\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*(.*?)\s*\|\s*`([^`]+)`\s*\|\s*(shared|yakka)\s*\|/.exec(line);
  if (m) rows.push({ out: m[1], id: m[2], title: m[3], src: m[4], tur: m[5] });
}
const targets = ONLY ? rows.filter((r) => r.out.includes(ONLY)) : rows;
if (!targets.length) { console.error('ro\'yxat bo\'sh'); process.exit(2); }

// tashqi modul spec — mavjud .shared.jsx sarlavhasidan (yoki --shared-spec)
// (mavjud lms/**.shared.jsx sarlavhasidan; joylashuvi ildiz yoki modul-papka bo'lishi mumkin)
const specFromExisting = rows.filter((r) => r.tur === 'shared')
  .map((r) => [join('lms', r.out), join('lms', r.out.split('/').pop())].find((p) => existsSync(p)))
  .filter(Boolean)
  .map((p) => (/TASHQI MODUL — (\S+)/.exec(readFileSync(p, 'utf8')) || [])[1])
  .find(Boolean) || null;
const SHARED_SPEC = opt('shared-spec', specFromExisting || '@shared/html-compiler');
if (!opt('shared-spec', null) && !specFromExisting) console.log(`${C.y}⚠ tashqi modul manzili topilmadi — @shared/html-compiler ishlatiladi (--shared-spec bilan bering)${C.x}`);

const catalog = new Set(JSON.parse(readFileSync(CATALOG, 'utf8')).lessons.map((l) => l.lesson_id));
console.log(`${C.b}Cutover-mashqi${C.x} ${C.d}${targets.length}/${rows.length} fayl · out=${OUT} · url=${URL} · shared=${SHARED_SPEC}${C.x}\n`);

// ---- 2) manba-tekshiruv (yig'ishdan oldin)
const problems = new Map(); // out → [xato]
const bad = (r, msg) => { if (!problems.has(r.out)) problems.set(r.out, []); problems.get(r.out).push(msg); };
for (const r of targets) {
  if (!existsSync(r.src)) { bad(r, `manba yo'q: ${r.src}`); continue; }
  const srcId = (/lessonId:\s*'([^']+)'/.exec(readFileSync(r.src, 'utf8')) || [])[1];
  if (srcId !== r.id) bad(r, `manbadagi lessonId ${srcId} ≠ ro'yxatdagi ${r.id}`);
  if (!catalog.has(r.id)) bad(r, `${r.id} server-katalogida YO'Q (LMS'da join 404) — gen-lesson-catalog`);
}

// ---- 3) yig'ish: yakka bir yo'la, shared bir yo'la (build-lms.mjs, LMS_OUT_DIR)
mkdirSync(OUT, { recursive: true });
const env = { ...process.env, LMS_OUT_DIR: OUT, DARS_API_URL: URL };
function runBuild(list, shared) {
  const srcs = [...new Set(list.map((r) => r.src))];
  if (!srcs.length) return '';
  const args = ['scripts/build-lms.mjs', ...(shared ? ['--shared', SHARED_SPEC] : []), ...srcs];
  const res = spawnSync(process.execPath, args, { env, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return (res.stdout || '') + (res.stderr || '');
}
const buildable = targets.filter((r) => !problems.has(r.out) || !problems.get(r.out).some((m) => m.startsWith('manba yo')));
const t0 = Date.now();
const logYakka = runBuild(buildable.filter((r) => r.tur === 'yakka'), false);
const logShared = runBuild(buildable.filter((r) => r.tur === 'shared'), true);
const buildLog = logYakka + logShared;
const buildSec = Math.round((Date.now() - t0) / 1000);

// ---- 4) chiqish-tekshiruv
const stats = [];
for (const r of targets) {
  const p = join(OUT, r.out);
  if (!existsSync(p)) { bad(r, `yig'ilmadi (${p} yo'q)`); const line = buildLog.split('\n').find((l) => l.includes('✗') && l.includes(r.out.split('/').pop().replace('.shared', ''))); if (line) bad(r, line.replace(/\x1b\[[0-9;]*m/g, '').trim()); continue; }
  const text = readFileSync(p, 'utf8');
  const kb = Math.round(statSync(p).size / 1024);
  const outId = (/lessonId:\s*["']([^"']+)["']/.exec(text) || [])[1];
  if (outId !== r.id) bad(r, `yig'madagi lessonId ${outId} ≠ ${r.id}`);
  if (!text.includes(URL)) bad(r, `API-manzil (${URL}) yig'mada yo'q — define ishlamadi`);
  if (/supabase/i.test(text)) bad(r, 'Supabase qoldig\'i bor');
  if (!text.includes(`Manba:  ${r.src}`)) bad(r, 'sarlavhadagi manba boshqa');
  if (r.tur === 'shared' && !text.includes(SHARED_SPEC)) bad(r, 'shared: tashqi modul importi yo\'q');
  if (r.tur === 'yakka' && /from\s+["'][^"']*compilator\/HtmlCompiler/.test(text)) bad(r, 'yakka: kompilyator bundle\'ga kirmagan');
  stats.push({ out: r.out, kb });
}

// ---- 5) smoke (ixtiyoriy): yakka → smoke-lms (LMS_DIR), shared → smoke-shared har fayl
const smokeErr = new Map();
if (SMOKE) {
  const senv = { ...process.env, LMS_DIR: OUT, CHROME: process.env.CHROME || '/usr/bin/google-chrome' };
  const yakka = targets.filter((r) => r.tur === 'yakka' && existsSync(join(OUT, r.out)));
  console.log(`${C.d}smoke: ${yakka.length} yakka (smoke-lms) …${C.x}`);
  for (const r of yakka) {
    const res = spawnSync(process.execPath, ['scripts/smoke-lms.mjs', join(OUT, r.out)], { env: senv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const out = (res.stdout || '').replace(/\x1b\[[0-9;]*m/g, '');
    if (res.status !== 0) smokeErr.set(r.out, out.split('\n').filter((l) => /✗|PAGEERROR|CONSOLE|YUKLANMADI|OCHILMADI/.test(l)).map((l) => l.trim()).slice(0, 4).join(' | ') || `exit ${res.status}`);
    process.stdout.write(res.status === 0 ? `${C.g}.${C.x}` : `${C.r}✗${C.x}`);
  }
  const shared = targets.filter((r) => r.tur === 'shared' && existsSync(join(OUT, r.out)));
  console.log(`\n${C.d}smoke: ${shared.length} shared (smoke-shared) …${C.x}`);
  for (const r of shared) {
    const res = spawnSync(process.execPath, ['scripts/smoke-shared.mjs', join(OUT, r.out)], { env: senv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const out = (res.stdout || '').replace(/\x1b\[[0-9;]*m/g, '');
    if (res.status !== 0) smokeErr.set(r.out, out.split('\n').filter((l) => /✗|XATO|PAGEERROR|CONSOLE|YUKLANMADI|OCHILMADI/.test(l)).map((l) => l.trim()).slice(0, 4).join(' | ') || `exit ${res.status}`);
    process.stdout.write(res.status === 0 ? `${C.g}.${C.x}` : `${C.r}✗${C.x}`);
  }
  console.log();
}

// ---- 6) yakun
const failed = new Set([...problems.keys(), ...smokeErr.keys()]);
const okN = targets.length - failed.size;
const totalKb = stats.reduce((n, s) => n + s.kb, 0);
console.log(`\n${C.b}Yakun:${C.x} ${C.g}${okN} ✓${C.x} · ${failed.size ? C.r : ''}${failed.size} ✗${C.x} · yig'ish ${buildSec} s · jami ${Math.round(totalKb / 1024 * 10) / 10} MB · katta: ${stats.sort((a, b) => b.kb - a.kb).slice(0, 3).map((s) => `${s.out} ${s.kb} KB`).join(', ')}`);
for (const f of failed) {
  console.log(` ${C.r}✗${C.x} ${f}`);
  for (const m of problems.get(f) || []) console.log(`     ${m}`);
  if (smokeErr.has(f)) console.log(`     smoke: ${smokeErr.get(f)}`);
}
if (!failed.size) console.log(`${C.g}Hammasi tayyor${C.x} — ${OUT}/ ${OUT === 'lms' ? 'CRM\'ga yuklanadi (CRM_YUKLASH_ROYXATI.md tartibida)' : '(mashq-papka, lms/ tegilmadi)'}`);
process.exit(failed.size ? 1 : 0);
