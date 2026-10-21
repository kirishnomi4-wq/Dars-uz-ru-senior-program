// ============================================================
//  lms-farq (F-1019-13, 19.10.2026) — LMS'ga QISMAN deploy mexanizmi: «oxirgi yuklashdan beri qaysi dars o'zgardi?»
//
//  Haqiqat manbai: LMS_REESTR.json — har dars uchun LMS'da turgan yig'maning md5'i, versiyasi (-vN), commit'i.
//  Yig'ma deterministik (dars o'zgarmasa, yig'ilgan fayl baytma-bayt bir xil) — shuning uchun «o'zgardi»
//  git tarixi bilan emas, YIG'ILGAN faylning md5'i bilan aniqlanadi. Umumiy modul (src/live, qolip, compilator)
//  o'zgarsa, hamma dars o'zgaradi — skript buni ochiq aytadi («to'liq reliz»).
//
//  Rejimlar:
//    node scripts/lms-farq.mjs                       — FARQ: nima o'zgargan (hisobot, hech narsa yozilmaydi; katalog qayta yig'iladi)
//    node scripts/lms-farq.mjs paket --out <papka>   — PAKET: faqat o'zgargan darslar, versiya +1, ROYXAT/README/yuklangan.csv,
//                                                      smoke-lms + smoke-preview faqat shu darslarga; HISOBOT.md
//                                                      (--tez: smoke'siz · --majbur: commit qilinmagan o'zgarish bilan ham)
//    node scripts/lms-farq.mjs muhrla <papka>/yuklangan.csv [--kim <nom>] [--server <gitlab-sha>]
//                                                    — MUHRLA: yuklovchi to'ldirgan csv → reestr yangilanadi, LMS_DEPLOY_JURNAL.md ga qator
//  Muhit: LMS_REESTR=<yo'l> (sukut LMS_REESTR.json; sinov uchun nusxa), CHROME (smoke uchun).
//  Oqim: fidbek → tuzatish → commit → farq → paket → yuklovchi Claude (YUKLASH_PROTOKOLI.md) → yuklangan.csv → muhrla.
// ============================================================
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, copyFileSync, rmSync, mkdtempSync } from 'node:fs';
import { join, resolve, basename, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
process.chdir(ROOT);
const RED = '\x1b[31m', GRN = '\x1b[32m', YEL = '\x1b[33m', DIM = '\x1b[2m', B = '\x1b[1m', R = '\x1b[0m';
const args = process.argv.slice(2);
const MODE = ['paket', 'muhrla', 'farq'].includes(args[0]) ? args.shift() : 'farq';
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const flag = (k) => args.includes(k);
const REESTR_P = process.env.LMS_REESTR || join(ROOT, 'LMS_REESTR.json');
const JURNAL_P = process.env.LMS_JURNAL || join(ROOT, 'LMS_DEPLOY_JURNAL.md');
const SANA = new Date().toISOString().slice(0, 10);
const md5 = (p) => createHash('md5').update(readFileSync(p)).digest('hex');
const run = (cmd, a, env = {}) => spawnSync(cmd, a, { encoding: 'utf8', env: { ...process.env, ...env }, maxBuffer: 64 * 1024 * 1024 });
const strip = (s) => (s || '').replace(/\x1b\[[0-9;]*m/g, '');
const git = (...a) => strip(run('git', a).stdout).trim();
const say = (s) => console.log(s);
const die = (s) => { say(`${RED}${B}✗ ${s}${R}`); process.exit(1); };

const reestr = JSON.parse(readFileSync(REESTR_P, 'utf8'));
// commit qilinmagan o'zgarish: kuzatilayotgan fayllar + src/<N>-Modull ichidagi yangi .jsx (boshqa yangi papkalar — darsga aloqasiz)
const kirOzgarish = () => git('status', '--porcelain', 'src', 'scripts', 'server/data').split('\n').filter((l) => l && (!l.startsWith('??') || /^\?\? src\/[^/]*Modull\/.*\.jsx$/.test(l))).join('\n');
const UMUMIY = ['src/live/', 'src/qolip/', 'src/compilator/', 'scripts/build-lms.mjs', 'scripts/yuklash-papka.mjs'];

// ── Darslar registri (App.jsx — tartibning yagona manbai) ───────────────────
function registr() {
  const app = readFileSync('src/App.jsx', 'utf8');
  const imports = Object.fromEntries([...app.matchAll(/const (\w+) = L\(\(\) => import\('\.\/([^']+)'\)\)/g)].map((m) => [m[1], 'src/' + m[2]]));
  const out = [];
  for (const [, id, title, body] of app.matchAll(/\{\s*id: '([^']+)', slug: '[^']*', title: '((?:[^'\\]|\\.)*)'[\s\S]*?lessons: \[([\s\S]*?)\n {4}\],/g)) {
    if (!/^\d+$/.test(id)) continue;
    for (const [, key, comp] of body.matchAll(/\{ key: '([^']+)', n: \d+,[^}]*?comp: (\w+)\s*\},/g)) {
      if (!imports[comp]) continue;
      if (reestr.chetda && reestr.chetda[key]) continue; // ataylab LMS'ga chiqmaydigan darslar
      const src = imports[comp];
      const lid = (/lessonId:\s*['"]([^'"]+)['"]/.exec(readFileSync(src, 'utf8')) || [])[1] || '?';
      out.push({ mod: id, title, key, src, lid });
    }
  }
  return out;
}
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });

// ── Hamma darsni vaqtinchalik papkaga yig'ish va ROYXAT'dan md5 o'qish ──────
function yigish(mods) {
  const tmp = mkdtempSync(join(tmpdir(), 'lms-farq-'));
  const y = run(process.execPath, ['scripts/yuklash-papka.mjs', '--out', tmp, '--moduls', mods.join(','), '--uyga-vazifasiz']);
  if (y.status !== 0) die(`yuklash-papka yiqildi:\n${strip(y.stderr).slice(-800)}`);
  const res = {};
  for (const ro of walk(tmp).filter((f) => f.endsWith('ROYXAT.md'))) {
    const mod = /(\d+)-Modul/.exec(ro)[1];
    for (const m of readFileSync(ro, 'utf8').matchAll(/^\| ☐ \| (\d+) \| ([^|]+) \| \*\*([^*]+)\*\* \| ([^|]+) \| `([^`]+)` \| `([^`]+)` \| `([^`]+)` \|$/gm)) {
      const [, nn, tur, nomUz, nomRu, fayl, lid, h] = m.map((x) => x.trim());
      res[lid] = { mod, nn: +nn, tur, nomUz, nomRu, fayl, path: join(dirname(ro), fayl), md5: h };
    }
  }
  const modNom = Object.fromEntries([...readFileSync(join(tmp, 'README.md'), 'utf8').matchAll(/^\| (\d+)-Modul \| ([^|]+) \|/gm)].map((m) => [m[1], m[2].trim()]));
  return { tmp, res, modNom };
}

// ── Katalog: qayta yig'ib HEAD va reestr bilan solishtirish ─────────────────
function katalog() {
  const g = run(process.execPath, ['scripts/gen-lesson-catalog.mjs']);
  if (g.status !== 0) die('gen-lesson-catalog yiqildi: ' + strip(g.stderr).slice(-300));
  const p = 'server/data/lesson-catalog.json';
  const now = JSON.parse(readFileSync(p, 'utf8'));
  const headTxt = git('show', 'HEAD:' + p);
  const headLessons = (() => { try { return JSON.stringify(JSON.parse(headTxt).lessons); } catch { return ''; } })();
  const headCommitted = headLessons === JSON.stringify(now.lessons);
  if (headCommitted) run('git', ['checkout', '--', p]); // faqat generated_at farq qilsa — ish daraxtini iflos qilmaymiz
  const ids = new Set(now.lessons.map((l) => l.lesson_id));
  const served = JSON.parse(git('show', `${reestr.server.monorepo_commit}:${p}`) || '{"lessons":[]}');
  const sIds = new Map(served.lessons.map((l) => [l.lesson_id, l]));
  const yangi = [...ids].filter((i) => !sIds.has(i));
  const ketgan = [...sIds.keys()].filter((i) => !ids.has(i));
  const ozgargan = now.lessons.filter((l) => sIds.has(l.lesson_id) && JSON.stringify(sIds.get(l.lesson_id)) !== JSON.stringify(l)).map((l) => l.lesson_id);
  const kerak = yangi.length || ketgan.length || ozgargan.length;
  return { ids, kerak, yangi, ketgan, ozgargan, headCommitted, md5: md5(p) };
}

// ── FARQ ───────────────────────────────────────────────────────────────────
function farq(mods) {
  const reg = registr().filter((l) => mods.includes(l.mod));
  say(`${DIM}yig'ilmoqda: ${reg.length} dars (${mods.join(',')})…${R}`);
  const { tmp, res, modNom } = yigish(mods);
  const D = reestr.darslar;
  const o = { ozgargan: [], yangi: [], ketgan: [], idOzgardi: [], bir: 0 };
  for (const l of reg) {
    const b = res[l.lid]; if (!b) { say(`${YEL}! ${l.src} → ${l.lid}: yig'mada yo'q${R}`); continue; }
    const r = D[l.lid];
    if (!r) {
      const eski = Object.entries(D).find(([, v]) => v.src === l.src);
      if (eski) o.idOzgardi.push({ ...l, b, eskiId: eski[0], eski: eski[1] }); else o.yangi.push({ ...l, b });
    } else if (r.md5 !== b.md5) o.ozgargan.push({ ...l, b, r }); else o.bir++;
  }
  for (const [lid, r] of Object.entries(D)) if (mods.includes(String(r.modul)) && !reg.some((l) => l.lid === lid) && !o.idOzgardi.some((x) => x.eskiId === lid)) o.ketgan.push({ lid, r });
  // sabab: dars fayli o'zgarganmi yoki umumiy modul
  const base = reestr.darslar[Object.keys(D)[0]]?.commit || reestr.server.monorepo_commit;
  const diffFiles = new Set(git('diff', '--name-only', base, 'HEAD').split('\n').filter(Boolean));
  const umumiy = [...diffFiles].filter((f) => UMUMIY.some((u) => f.startsWith(u)));
  for (const x of [...o.ozgargan, ...o.idOzgardi]) x.sabab = diffFiles.has(x.src) ? 'dars fayli' : (umumiy.length ? 'umumiy modul' : "git'da sabab topilmadi (yig'ma farq qiladi)");
  const kat = katalog();
  return { reg, tmp, res, modNom, o, umumiy, kat, base };
}
function hisobotFarq(F) {
  const { o, umumiy, kat, base } = F;
  say(`\n${B}LMS FARQ — reestr: ${Object.keys(reestr.darslar).length} dars @ ${base} · yuklangan ${reestr.yangilandi}${R}`);
  say(`  o'zgarmagan ${GRN}${o.bir}${R} · o'zgargan ${o.ozgargan.length ? YEL : GRN}${o.ozgargan.length}${R} · yangi ${o.yangi.length} · id o'zgargan ${o.idOzgardi.length ? RED : GRN}${o.idOzgardi.length}${R} · ketgan ${o.ketgan.length}`);
  if (umumiy.length) say(`  ${YEL}umumiy modul o'zgargan: ${umumiy.join(', ')} — bu TO'LIQ reliz (hamma dars qayta yuklanadi)${R}`);
  for (const x of o.ozgargan) say(`  ${YEL}~${R} ${x.key.padEnd(7)} ${x.lid.padEnd(34)} ${x.r.fayl} → v${x.r.v + 1}  ${DIM}(${x.sabab})${R}`);
  for (const x of o.yangi) say(`  ${GRN}+${R} ${x.key.padEnd(7)} ${x.lid.padEnd(34)} yangi dars`);
  for (const x of o.idOzgardi) say(`  ${RED}#${R} ${x.key.padEnd(7)} ${x.eskiId} → ${x.lid}  ${RED}lesson_id O'ZGARGAN: eski id serverda nofaol bo'ladi, o'quvchi progressi yo'qoladi — ongli qarormi?${R}`);
  for (const x of o.ketgan) say(`  ${RED}−${R} ${x.lid} (${x.r.fayl}) registrda yo'q — CRM'da qoladi, qo'lda arxivlanadi`);
  say(`\n${B}SERVER (dars-api)${R}: reestr ${reestr.server.gitlab_commit} (@${reestr.server.monorepo_commit}, ${reestr.server.katalog_darslar} dars)`);
  if (!kat.kerak) say(`  ${GRN}✓ katalog o'zgarmagan — server sync kerak emas${R}`);
  else say(`  ${YEL}! server sync + deploy KERAK${R}: yangi id ${kat.yangi.length}${kat.yangi.length ? ' (' + kat.yangi.join(', ') + ')' : ''} · ketgan ${kat.ketgan.length} · nom/nishon o'zgargan ${kat.ozgargan.length}${kat.ozgargan.length ? ' (' + kat.ozgargan.slice(0, 8).join(', ') + ')' : ''}`);
  if (!kat.headCommitted) say(`  ${YEL}! server/data/lesson-catalog.json qayta yig'ildi va HEAD'dan farq qiladi — commit qiling${R}`);
  const toza = kirOzgarish();
  if (toza) say(`  ${YEL}! commit qilinmagan o'zgarish bor (${toza.split('\n').length} fayl) — paket faqat commit'dan keyin${R}`);
}

// ── PAKET ──────────────────────────────────────────────────────────────────
function paket() {
  const OUT = opt('--out') ? resolve(opt('--out')) : resolve(`yuklash-${SANA}-prod`);
  if (OUT === ROOT || OUT.startsWith(join(ROOT, 'src')) || OUT.startsWith(join(ROOT, 'lms'))) die('--out taqiqlangan joy');
  const mods = (opt('--moduls') || '2-14').split(',').flatMap((p) => { const m = /^(\d+)-(\d+)$/.exec(p); return m ? Array.from({ length: +m[2] - +m[1] + 1 }, (_, i) => String(+m[1] + i)) : [p]; });
  const kir = kirOzgarish();
  if (kir && !flag('--majbur')) die(`commit qilinmagan o'zgarish bor (${kir.split('\n').length} fayl) — avval commit, yoki --majbur:\n${kir.split('\n').slice(0, 8).join('\n')}`);
  const F = farq(mods); hisobotFarq(F);
  const list = [...F.o.ozgargan, ...F.o.yangi, ...F.o.idOzgardi];
  if (!list.length) { say(`\n${GRN}${B}Yuklaydigan dars yo'q — LMS reestr bilan bir xil.${R}`); rmSync(F.tmp, { recursive: true, force: true }); return; }
  const commit = git('rev-parse', '--short', 'HEAD');
  const lint = run('npm', ['run', '-s', 'lint:jsx']); if (lint.status !== 0) die('lint:jsx toza emas:\n' + strip(lint.stdout).slice(-600));
  const katalogsiz = list.filter((x) => !F.kat.ids.has(x.lid)).map((x) => x.lid); if (katalogsiz.length) die('katalogda yo\'q lesson_id: ' + katalogsiz.join(', '));
  // paket papkasi
  if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
  const yakka = join(OUT, 'yakka'); mkdirSync(yakka, { recursive: true });
  const rows = []; const csv = ['lesson_id,modul,crm_bolim,fayl,md5,versiya,crm_uz,crm_ru,yuklandi,izoh'];
  const perMod = {};
  for (const x of list) {
    const v = x.r ? x.r.v + 1 : (x.eski ? x.eski.v + 1 : 1);
    const nomi = x.b.fayl.replace(/\.jsx$/, '') + `-v${v}.jsx`;
    const d = join(yakka, `${x.mod}-Modul`); mkdirSync(d, { recursive: true });
    copyFileSync(x.b.path, join(d, nomi));
    const crm = reestr.crm_bolim[x.mod] || {}; const old = x.r || x.eski;
    const z = { ...x, v, nomi, crm, old, h: md5(join(d, nomi)) };
    (perMod[x.mod] ||= []).push(z);
    csv.push([x.lid, x.mod, crm.id ?? '', `${x.mod}-Modul/${nomi}`, z.h, v, old?.crm?.uz ?? '', old?.crm?.ru ?? '', '', x.eskiId ? `id o'zgardi: eski ${x.eskiId}` : (x.r ? '' : 'yangi dars')].join(','));
  }
  const serverKerak = F.kat.kerak || list.some((x) => !x.r);
  for (const [mod, zs] of Object.entries(perMod)) {
    zs.sort((a, b) => a.b.nn - b.b.nn);
    const t = [`# ${mod}-Modul — ${F.modNom[mod] || ''}`, '', `CRM'da: **bo'lim id ${zs[0].crm.id ?? '?'}** (${zs[0].crm.nom || ''}) · faqat shu ${zs.length} dars yangilanadi, qolganlari TEGILMAYDI`, '',
      '| ☐ | № | Nom — uz (LMS materiali) | Nom — ru | CRM\'dagi eski fayl → YANGI fayl | lesson_id | md5 (yangi) | CRM material uz / ru |', '|---|---|---|---|---|---|---|---|'];
    for (const z of zs) t.push(`| ☐ | ${String(z.b.nn).padStart(2, '0')} | **${z.b.nomUz}** | ${z.b.nomRu} | \`${z.old?.fayl || '— (yangi qator)'}\` → \`${z.nomi}\` | \`${z.lid}\` | \`${z.h}\` | ${z.old?.crm?.uz || '?'} / ${z.old?.crm?.ru || '?'} |`);
    writeFileSync(join(yakka, `${mod}-Modul`, 'ROYXAT.md'), t.join('\n') + '\n');
  }
  const readme = [`# LMS'ga QISMAN yuklash — ${SANA} · ${list.length} dars · commit ${commit}`, '',
    `Bu paketda FAQAT o'zgargan darslar bor. Oxirgi to'liq holat: reestr ${reestr.yangilandi} (${Object.keys(reestr.darslar).length} dars). Qolgan darslar CRM'da o'zgarmaydi.`, '',
    `## Server (dars-api) — ${serverKerak ? '🔴 AVVAL SHART' : '✓ kerak emas'}`,
    serverKerak ? `Yangi/o'zgargan lesson_id yoki katalog bor. Yuklashdan OLDIN:\n1. \`bash scripts/sync-dars-api.sh main\`\n2. GitLab → Pipelines (main) → deploy job ▶\n3. \`curl -s https://dars-api.coddycamp.uz/api/v1/health\` — version yangi commit, catalog soni ${F.kat.ids.size}\nKeyin \`muhrla\` da \`--server <gitlab-sha>\` beriladi.` : 'Katalog o\'zgarmagan: lesson_id, nom va nishonlar reestrdagi bilan bir xil.', '',
    '## Yuklash tartibi (yuklovchi Claude — YUKLASH_PROTOKOLI.md)',
    ...list.filter((x) => x.eskiId).map((x) => `- ⚠ ${x.key}: lesson_id o'zgargan (${x.eskiId} → ${x.lid}) — server deploy'dan keyin BIRINCHI yuklanadi.`),
    '- Har modul papkasidagi ROYXAT.md: CRM bo\'lim id, qaysi eski faylning o\'rniga qaysi yangi fayl, lesson_id, md5.',
    '- Mavjud qatorda «JSX faylni almashtirish» (uz va ru — bir xil fayl); yangi dars bo\'lsa — yangi qator (tur lesson-runner, uz 1 / ru 2).',
    '- Har yuklashdan keyin faylni qaytarib yuklab olib md5 ni ROYXAT bilan solishtirish; `yuklangan.csv` da yuklandi (sana) va CRM material id\'larini to\'ldirish.',
    `- Tugagach: \`node scripts/lms-farq.mjs muhrla ${basename(OUT)}/yuklangan.csv --kim <seans>${serverKerak ? ' --server <gitlab-sha>' : ''}\``, '',
    '| Modul | Dars | Eski fayl → yangi | Sabab |', '|---|---|---|---|',
    ...list.map((x) => `| ${x.mod} | ${x.key} · ${x.b.nomUz} | ${x.r?.fayl || x.eski?.fayl || '—'} → ${perMod[x.mod].find((z) => z.lid === x.lid).nomi} | ${x.sabab || (x.r ? '' : 'yangi')} |`)];
  writeFileSync(join(OUT, 'README.md'), readme.join('\n') + '\n');
  writeFileSync(join(OUT, 'yuklangan.csv'), csv.join('\n') + '\n');
  // smoke faqat shu darslarga
  const hisobot = [`# Qisman paket hisoboti — ${SANA} · commit ${commit}`, '', `Darslar: ${list.length} (${list.map((x) => x.key).join(', ')}) · server: ${serverKerak ? 'KERAK' : 'kerak emas'} · lint:jsx ✓`];
  if (flag('--tez')) hisobot.push('smoke: --tez bilan o\'tkazildi');
  else {
    const s = run(process.execPath, ['scripts/smoke-lms.mjs'], { LMS_DIR: yakka });
    const fails = strip(s.stdout).split('\n').filter((l) => /^\s+✗/.test(l));
    hisobot.push(`smoke-lms: ${fails.length ? '✗ ' + fails.length : '✓'} ${fails.join(' | ')}`);
    const p = run(process.execPath, ['scripts/smoke-preview.mjs', ...list.map((x) => x.src)]);
    const lines = strip(p.stdout).split('\n').filter((l) => /^[✓✗] /.test(l)); const fp = lines.filter((l) => l.startsWith('✗'));
    hisobot.push(`smoke-preview: ${lines.length - fp.length}/${list.length}${fp.length ? ' ✗ ' + fp.join(' | ') : ''}`);
    writeFileSync(join(OUT, 'smoke-preview.log'), strip(p.stdout));
    if (fails.length || fp.length || lines.length !== list.length) { hisobot.push('**Hukm: YIQILDI ✗**'); writeFileSync(join(OUT, 'HISOBOT.md'), hisobot.join('\n') + '\n'); die('smoke yiqildi — ' + join(OUT, 'HISOBOT.md')); }
  }
  hisobot.push('**Hukm: O\'TDI ✓**'); writeFileSync(join(OUT, 'HISOBOT.md'), hisobot.join('\n') + '\n');
  rmSync(F.tmp, { recursive: true, force: true });
  say(`\n${GRN}${B}PAKET TAYYOR${R}: ${OUT} — ${list.length} dars${serverKerak ? ` · ${RED}server avval${R}` : ''} · yuklovchiga: README.md + YUKLASH_PROTOKOLI.md`);
}

// ── MUHRLA ─────────────────────────────────────────────────────────────────
function muhrla() {
  const csvP = args.find((a) => a.endsWith('.csv')); if (!csvP || !existsSync(csvP)) die('muhrla <papka>/yuklangan.csv');
  const dir = dirname(resolve(csvP)); const kim = opt('--kim', 'claude-yuklovchi'); const srv = opt('--server');
  const commit = git('rev-parse', '--short', 'HEAD');
  const [head, ...lines] = readFileSync(csvP, 'utf8').trim().split('\n'); const H = head.split(',');
  const rows = lines.map((l) => Object.fromEntries(l.split(',').map((v, i) => [H[i], v.trim()])));
  const yuk = rows.filter((r) => r.yuklandi); const qoldi = rows.filter((r) => !r.yuklandi);
  if (!yuk.length) die('csv\'da yuklandi ustuni bo\'sh — hech narsa muhrlanmaydi');
  const xato = [];
  for (const r of yuk) {
    const p = join(dir, 'yakka', r.fayl); if (!existsSync(p)) { xato.push(`${r.lesson_id}: fayl yo'q ${r.fayl}`); continue; }
    if (md5(p) !== r.md5) { xato.push(`${r.lesson_id}: md5 mos emas (paket fayli o'zgargan?)`); continue; }
    const eskiId = /eski (\S+)/.exec(r.izoh || '')?.[1];
    const old = reestr.darslar[r.lesson_id] || (eskiId && reestr.darslar[eskiId]) || {};
    if (eskiId && reestr.darslar[eskiId]) delete reestr.darslar[eskiId];
    const reg = registr().find((l) => l.lid === r.lesson_id) || {};
    reestr.darslar[r.lesson_id] = { ...old, src: reg.src || old.src, modul: +r.modul, key: reg.key || old.key, fayl: basename(r.fayl), v: +r.versiya, md5: r.md5, commit, yuklandi: r.yuklandi, kim,
      crm: { uz: r.crm_uz || old.crm?.uz || null, ru: r.crm_ru || old.crm?.ru || null } };
    if (!reestr.darslar[r.lesson_id].nom_uz) { const b = readFileSync(join(dir, `yakka/${r.modul}-Modul/ROYXAT.md`), 'utf8'); const m = new RegExp(`\\| \\*\\*([^*]+)\\*\\* \\| ([^|]+) \\|[^\\n]*\`${r.lesson_id}\``).exec(b); if (m) { reestr.darslar[r.lesson_id].nom_uz = m[1].trim(); reestr.darslar[r.lesson_id].nom_ru = m[2].trim(); } }
  }
  if (xato.length) die('muhrlanmadi:\n' + xato.join('\n'));
  if (srv) {
    const h = run('curl', ['-s', '--max-time', '15', reestr.server.health]); let j = {}; try { j = JSON.parse(h.stdout); } catch {}
    if (!j.version || !j.version.includes(srv.slice(0, 7))) die(`health versiyasi (${j.version || '?'}) --server ${srv} bilan mos emas — deploy o'tmagan?`);
    reestr.server = { ...reestr.server, gitlab_commit: srv, monorepo_commit: commit, katalog_md5: md5('server/data/lesson-catalog.json'), katalog_darslar: j.checks?.catalog ?? reestr.server.katalog_darslar, deploy_sana: SANA };
  }
  reestr.yangilandi = SANA;
  writeFileSync(REESTR_P, JSON.stringify(reestr, null, 1) + '\n');
  const qator = `| ${SANA} | ${commit} | ${srv ? srv : '—'} | ${yuk.length} | ${yuk.map((r) => `${r.lesson_id} v${r.versiya}`).join(', ')} | ${kim} |${qoldi.length ? ` qolgan ${qoldi.length}: ${qoldi.map((r) => r.lesson_id).join(', ')}` : ''}`;
  if (!existsSync(JURNAL_P)) writeFileSync(JURNAL_P, '# LMS deploy jurnali\n\n| Sana | Commit | Server | Dars | Ro\'yxat | Kim |\n|---|---|---|---|---|---|\n');
  writeFileSync(JURNAL_P, readFileSync(JURNAL_P, 'utf8').trimEnd() + '\n' + qator + '\n');
  say(`${GRN}${B}MUHRLANDI${R}: ${yuk.length} dars → ${basename(REESTR_P)} (${Object.keys(reestr.darslar).length} dars)${srv ? ` · server ${srv}` : ''}${qoldi.length ? ` · ${YEL}csv'da yuklanmagan ${qoldi.length}${R}` : ''}`);
}

if (MODE === 'farq') { const F = farq((opt('--moduls') || '2-14').split(',').flatMap((p) => { const m = /^(\d+)-(\d+)$/.exec(p); return m ? Array.from({ length: +m[2] - +m[1] + 1 }, (_, i) => String(+m[1] + i)) : [p]; })); hisobotFarq(F); rmSync(F.tmp, { recursive: true, force: true }); }
else if (MODE === 'paket') paket();
else muhrla();
