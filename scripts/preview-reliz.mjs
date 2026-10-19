// ============================================================
//  preview-reliz (F-1015) — YAKSHANBA RELIZI: LMS 2–6-Modul darslarini BITTA buyruq bilan yig'adi va tekshiradi.
//  Darslar (praktikalar ham) — o'sha paytdagi src'dan; uyga vazifalar yig'ilmaydi (IT scope'ida emas).
//
//  Ishlatish:
//    node scripts/preview-reliz.mjs --out <papka> --api staging|prod [--tez]
//      --out   chiqish papkasi (yuklash-papka uni TOZALAB yozadi; lms/, repo ildizi, src/ — taqiqlangan)
//      --api   staging → https://staging-dars-api.coddycamp.uz · prod → sukut (dars-api.coddycamp.uz)
//      --moduls  LMS modul id'lari: `2-6` (sukut) · `7-14` · `2-14` · `2,3,9`. 2–6 → IT-ROYXAT-70 bilan solishtiriladi;
//                hamma modul → lessonId takrorsiz + server/data/lesson-catalog.json da bor (F-1017-226: 7–14 uchun LMS ro'yxati hali yo'q).
//      --suffix v3  fayl nomiga qo'shimcha (yuklash-papka --suffix) — CRM ro'yxatida eski/yangi ajralsin (F-1019-10)
//      --tez   preview-sinovi tanlanma bilan (har moduldan 1 dars + 1 shared); sukut — hamma darslar
//      --shared  tashqi-modulli (.shared) variantlarni ham yig'ish/sinash. SUKUTDA YO'Q (F-1017-226, DE 221-qonun):
//                kompilyator doim dars ichida; LMS artefakt URL'i almashtirishda o'zgaradi, eski 404 — shared yo'li yopilgan.
//                Shared fayllar arxivda: arxiv/lms-shared-2026-10-18/ (lms/html-compiler.jsx ham).
//    CHROME=/usr/bin/google-chrome (sukut shu).
//
//  Qadamlar: 1) ro'yxat (App.jsx registri, 2–6, --skip m2-16,m3-17) → LMS'dagi 70 bilan solishtirish (lesson_id)
//            2) unit-testlar + preview-keys-check  3) yakka yig'ish (yuklash-papka --uyga-vazifasiz)
//            4) shared yig'ish (lms/ da .shared varianti bor darslar)  5) statik tekshiruv (o'ram, API, window, supabase)
//            6) smoke-lms (yakka)  7) smoke-shared  8) smoke-preview (yakka + shared; yopiq lokal port — prod'ga so'rov yo'q)
//  Natija: <out>/HISOBOT.md; chiqish kodi 1 = biror qadam yiqildi. lms/ ga YOZILMAYDI.
// ============================================================
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve, basename, relative } from 'node:path';

const RED = '\x1b[31m', GRN = '\x1b[32m', DIM = '\x1b[2m', B = '\x1b[1m', R = '\x1b[0m';
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const OUT = opt('--out') ? resolve(opt('--out')) : null;
const API = opt('--api');
const TEZ = args.includes('--tez');
const MODS = (opt('--moduls') || '2-6').split(',').flatMap((p) => { const m = /^(\d+)-(\d+)$/.exec(p.trim()); return m ? Array.from({ length: +m[2] - +m[1] + 1 }, (_, i) => String(+m[1] + i)) : [p.trim()]; });
const SUFFIX = opt('--suffix'); // F-1019-10: fayl nomiga qo'shimcha (`01-InternetLesson-v3.jsx`) — CRM'da eski/yangi ajralsin
const SHARED = args.includes('--shared'); // F-1017-226 / DE 221: sukutda shared qadamlar o'tkaziladi
const SPEC = 'https://go.coddycamp.uz/uploads/course_artifacts/81a985c6a19b3e7f7d39be9fda07af4e.jsx'; // LMS'dagi kompilyator-modul
const API_URL = API === 'staging' ? 'https://staging-dars-api.coddycamp.uz' : API === 'prod' ? '' : null;
const ROOT = resolve('.');
if (!OUT || API_URL === null) { console.log(`${RED}Kerak: --out <papka> --api staging|prod${R}`); process.exit(2); }
for (const bad of ['lms', 'src', '.', 'scripts', 'server']) {
  const p = resolve(bad);
  if (OUT === p || OUT.startsWith(resolve('lms') + '/') || OUT.startsWith(resolve('src') + '/')) { console.log(`${RED}--out ${OUT} taqiqlangan (lms/, src/, repo ildizi)${R}`); process.exit(2); }
}
process.env.CHROME = process.env.CHROME || '/usr/bin/google-chrome';

const steps = [];
const report = [];
const skip = (name, why) => { console.log(`${DIM}— ${name}  ${why}${R}`); report.push(`| — | ${name} | ${why} |`); };
const step = (name, ok, detail = '') => {
  steps.push({ name, ok });
  console.log(`${ok ? GRN + '✓' : RED + '✗'}${R} ${name}${detail ? DIM + '  ' + detail.split('\n')[0].slice(0, 160) + R : ''}`);
  report.push(`| ${ok ? '✓' : '✗'} | ${name} | ${detail.replace(/\n/g, '<br>').replace(/\|/g, '/')} |`);
};
const run = (cmd, a, env = {}) => spawnSync(cmd, a, { env: { ...process.env, ...env }, encoding: 'utf8', maxBuffer: 256 << 20 });
const strip = (s) => String(s || '').replace(/\x1b\[[0-9;]*m/g, '');
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);
// F-1017-226: `lms/` 21.09 cutover-mashqi yig'malari, prod ko'zgusi EMAS (prod = oxirgi `yuklash-<sana>/` paketi, 04.10) —
// shuning uchun «lms/ o'zgargan» faqat SHU YURISH lms/ ga yozgan-yozmaganini bildiradi: oldin/keyin holati solishtiriladi.
const lmsStatus = () => strip(run('git', ['status', '--short', 'lms']).stdout).trim();
const lmsBefore = lmsStatus();

// ── 1. Ro'yxat ──────────────────────────────────────────────────────────────
const app = readFileSync('src/App.jsx', 'utf8');
const imports = Object.fromEntries([...app.matchAll(/const (\w+) = L\(\(\) => import\('\.\/([^']+)'\)\)/g)].map((m) => [m[1], 'src/' + m[2]]));
const SKIP = ['m2-16', 'm3-17'];
const lessons = [];
const skipHit = new Set();
for (const [, id, body] of app.matchAll(/\{\s*id: '([^']+)', slug: '[^']*', title: '(?:[^'\\]|\\.)*'[\s\S]*?lessons: \[([\s\S]*?)\n {4}\],/g)) {
  if (!MODS.includes(id)) continue;
  for (const [, key, comp] of body.matchAll(/\{ key: '([^']+)', n: \d+,[^}]*?comp: (\w+)\s*\},/g)) {
    if (SKIP.includes(key)) { skipHit.add(key); continue; }
    if (!imports[comp]) continue;
    const src = imports[comp];
    const lid = (/lessonId:\s*['"]([^'"]+)['"]/.exec(readFileSync(src, 'utf8')) || [])[1] || '?';
    lessons.push({ mod: id, key, src, name: basename(src, '.jsx'), lid });
  }
}
const expected = [...readFileSync('feedback/F-1015-preview/IT-ROYXAT-70.md', 'utf8').matchAll(/^\| \d+ \| \d \|.*\| `([^`]+)` \|$/gm)].map((m) => m[1]);
// 2–6: IT-ROYXAT-70 (LMS'da turgan 70 dars) bilan solishtirish — faqat shu modullar tanlangan bo'lsa
const L26 = ['2', '3', '4', '5', '6'];
const l26 = lessons.filter((l) => L26.includes(l.mod));
const have = new Set(l26.map((l) => l.lid));
const yangiId = l26.filter((l) => !expected.includes(l.lid)).map((l) => `${l.src} → ${l.lid}`);
const yoq = L26.every((m) => MODS.includes(m)) ? expected.filter((id) => !have.has(id)) : [];
// Hamma modul: lessonId takrorsiz + lokal katalogda bor (server shu JSON'dan seed qilinadi — F-1017-226: 20.09 katalogida 88 id yo'q edi)
const catFile = 'server/data/lesson-catalog.json';
const catJson = existsSync(catFile) ? JSON.parse(readFileSync(catFile, 'utf8')) : { generated_at: '?', lessons: [] };
const catalog = new Set(catJson.lessons.map((l) => l.lesson_id));
const katalogsiz = lessons.filter((l) => !catalog.has(l.lid)).map((l) => `${l.src} → ${l.lid}`);
const takror = [...lessons.reduce((m, l) => m.set(l.lid, (m.get(l.lid) || 0) + 1), new Map())].filter(([, n]) => n > 1).map(([id]) => id);
const perMod = MODS.map((m) => `${m}:${lessons.filter((l) => l.mod === m).length}`).join(' ');
step(`ro'yxat: ${lessons.length} dars (${perMod})${l26.length ? ` · 2–6 kutilgan ${expected.length}` : ''} · katalog ${catJson.generated_at.slice(0, 10)}`,
  !yangiId.length && !yoq.length && !katalogsiz.length && !takror.length && (!L26.every((m) => MODS.includes(m)) || l26.length === expected.length),
  [yangiId.length ? `LMS'dagi 2–6 ro'yxatida YO'Q lesson_id: ${yangiId.join(', ')}` : '',
    yoq.length ? `2–6 ro'yxatidan TUSHGAN: ${yoq.join(', ')}` : '',
    katalogsiz.length ? `lokal katalogda YO'Q (serverda seed bo'lmasa join 404): ${katalogsiz.join(', ')}` : '',
    takror.length ? `TAKROR lessonId: ${takror.join(', ')}` : ''].filter(Boolean).join('\n'));

// ── 2. Unit + kalitlar ──────────────────────────────────────────────────────
{
  const u = run(process.execPath, ['--test', 'src/live/previewMode.test.mjs', 'src/live/resultDetails.test.mjs']);
  const pass = (/ℹ pass (\d+)/.exec(strip(u.stdout)) || [])[1], fail = (/ℹ fail (\d+)/.exec(strip(u.stdout)) || [])[1];
  step('unit-testlar (previewMode + resultDetails)', u.status === 0, `pass ${pass} · fail ${fail}`);
  const k = run(process.execPath, ['scripts/preview-keys-check.mjs']);
  step('preview-keys-check (yangi xotira-kalitlari himoyada)', k.status === 0, strip(k.stdout).trim().split('\n').slice(-3).join(' · '));
}

// ── 3–4. Yig'ish ────────────────────────────────────────────────────────────
const env = { DARS_API_URL: API_URL };
const yakkaDir = join(OUT, 'yakka'), sharedDir = join(OUT, 'shared');
{
  const y = run(process.execPath, ['scripts/yuklash-papka.mjs', '--out', yakkaDir, '--moduls', MODS.join(','), ...(skipHit.size ? ['--skip', [...skipHit].join(',')] : []), ...(SUFFIX ? ['--suffix', SUFFIX] : []), '--uyga-vazifasiz'], env);
  const files = existsSync(yakkaDir) ? walk(yakkaDir).filter((f) => f.endsWith('.jsx')) : [];
  step(`yakka yig'ish (yuklash-papka): ${files.length} fayl`, y.status === 0 && files.length === lessons.length, strip(y.stderr).trim().slice(0, 300));
}
const lmsShared = new Set((existsSync('lms') ? walk('lms') : []).filter((f) => f.endsWith('.shared.jsx')).map((f) => basename(f, '.shared.jsx')));
const sharedSrc = SHARED ? lessons.filter((l) => lmsShared.has(l.name)).map((l) => l.src) : [];
if (!SHARED) skip("shared yig'ish", "o'tkazildi — kompilyator dars ichida (DE 221), --shared bilan yoqiladi");
else {
  const s = run(process.execPath, ['scripts/build-lms.mjs', '--shared', SPEC, ...sharedSrc], { ...env, LMS_OUT_DIR: sharedDir });
  const files = existsSync(sharedDir) ? walk(sharedDir).filter((f) => f.endsWith('.shared.jsx')) : [];
  step(`shared yig'ish: ${files.length}/${sharedSrc.length}`, s.status === 0 && files.length === sharedSrc.length, strip(s.stdout).split('\n').filter((l) => /✗/.test(l)).join('\n'));
}

// ── 5. Statik tekshiruv ─────────────────────────────────────────────────────
{
  const all = [...(existsSync(yakkaDir) ? walk(yakkaDir) : []), ...(existsSync(sharedDir) ? walk(sharedDir) : [])].filter((f) => f.endsWith('.jsx'));
  const bad = [];
  for (const f of all) {
    const t = readFileSync(f, 'utf8'), n = relative(OUT, f);
    if (!t.includes('notePreviewProps')) bad.push(`${n}: o'ram yo'q`);
    if (t.includes('__CC_VISIT_MODE__')) bad.push(`${n}: window-belgi`);
    if (/supabase/i.test(t)) bad.push(`${n}: supabase`);
    if (API === 'staging' && !t.includes(`"${API_URL}"`)) bad.push(`${n}: staging manzili yo'q`);
    if (API === 'prod' && t.includes('staging-dars-api')) bad.push(`${n}: staging manzili qolgan`);
  }
  step(`statik: ${all.length} fayl — o'ram, window-belgi yo'q, API=${API}, supabase yo'q`, all.length > 0 && !bad.length, bad.slice(0, 10).join('\n'));
}

// ── 6–7. smoke-lms / smoke-shared ───────────────────────────────────────────
{
  const s = run(process.execPath, ['scripts/smoke-lms.mjs'], { LMS_DIR: yakkaDir });
  const out = strip(s.stdout);
  const fails = out.split('\n').filter((l) => /^\s+✗/.test(l));
  step(`smoke-lms yakka: ✗ ${fails.length}`, s.status === 0 && !fails.length, fails.slice(0, 10).map((l) => l.trim()).join('\n'));
}
if (!SHARED) skip('smoke-shared', "o'tkazildi (DE 221)");
else {
  const fails = [];
  const files = existsSync(sharedDir) ? walk(sharedDir).filter((f) => f.endsWith('.shared.jsx')) : [];
  for (const f of files) { const r = run(process.execPath, ['scripts/smoke-shared.mjs', f, SPEC]); if (r.status !== 0) fails.push(basename(f)); }
  step(`smoke-shared: ✓ ${files.length - fails.length} · ✗ ${fails.length}`, files.length > 0 && !fails.length, fails.join(', '));
}

// ── 8. Preview (smoke-preview: o'zi yopiq lokal portga yig'adi) ─────────────
{
  const per = {};
  for (const l of lessons) (per[l.mod] ||= []).push(l.src);
  const yakka = TEZ ? Object.values(per).map((a) => a[0]) : lessons.map((l) => l.src);
  const shared = TEZ ? sharedSrc.slice(0, 1) : sharedSrc;
  const parse = (o) => strip(o).split('\n').filter((l) => /^[✓✗] /.test(l));
  const ra = run(process.execPath, ['scripts/smoke-preview.mjs', ...yakka]); const a = parse(ra.stdout);
  writeFileSync(join(OUT, 'smoke-preview-yakka.log'), strip(ra.stdout) + '\n--- stderr ---\n' + strip(ra.stderr)); // F-1017-226: to'liq log
  const b = shared.length ? parse(run(process.execPath, ['scripts/smoke-preview.mjs', ...shared], { SHARED_SPEC: SPEC }).stdout) : [];
  const fa = a.filter((l) => l.startsWith('✗')), fb = b.filter((l) => l.startsWith('✗'));
  // F-1017-226: 2-yurishda 35/70 qaytdi, detail bo'sh edi — uzilish sababi ko'rinmadi; endi satr soni mos kelmasa status + stderr yoziladi
  const toliqEmas = a.length !== yakka.length ? `chiqish to'liq emas: ${a.length}/${yakka.length} satr · status ${ra.status} · signal ${ra.signal || '-'} · stderr: ${strip(ra.stderr).trim().split('\n').slice(-3).join(' · ').slice(0, 400)}` : '';
  step(`smoke-preview yakka: ${a.length - fa.length}/${yakka.length}${TEZ ? ' (tanlanma)' : ''}`, a.length === yakka.length && !fa.length, [fa.join('\n'), toliqEmas].filter(Boolean).join('\n'));
  if (!SHARED) skip('smoke-preview shared', "o'tkazildi (DE 221)");
  else step(`smoke-preview shared: ${b.length - fb.length}/${shared.length}${TEZ ? ' (tanlanma)' : ''}`, b.length === shared.length && !fb.length, fb.join('\n'));
}

// ── Hisobot ─────────────────────────────────────────────────────────────────
const okAll = steps.every((s) => s.ok);
const lmsChanged = lmsStatus() !== lmsBefore; // yurish davomida lms/ ga yozilgan bo'lsa
writeFileSync(join(OUT, 'HISOBOT.md'), [
  `# Reliz hisoboti — ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`, '',
  `API: **${API}** · modullar: **${MODS.join(',')}** · darslar: **${lessons.length}** · shared: ${SHARED ? sharedSrc.length : "yo'q (DE 221)"} · preview-sinov: ${TEZ ? 'tanlanma' : "to'liq"} · lms/ ga yurishda yozildi: ${lmsChanged ? 'HA ⚠' : "yo'q"}`, '',
  '| | Qadam | Tafsilot |', '|---|---|---|', ...report, '',
  `**Hukm: ${okAll ? "O'TDI ✓" : 'YIQILDI ✗'}**`, '',
  '## Darslar', '', '| Modul | key | src | lesson_id |', '|---|---|---|---|',
  ...lessons.map((l) => `| ${l.mod} | ${l.key} | \`${l.src}\` | \`${l.lid}\` |`), '',
].join('\n'));
console.log(`\n${B}${okAll ? GRN + "RELIZ-YIG'MA O'TDI" : RED + "RELIZ-YIG'MA YIQILDI"}${R}  ${DIM}${join(OUT, 'HISOBOT.md')}${lmsChanged ? ' · ⚠ lms/ o\'zgargan!' : ''}${R}`);
process.exit(okAll ? 0 : 1);
