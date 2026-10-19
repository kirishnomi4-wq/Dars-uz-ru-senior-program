// ============================================================
//  build-lms — LMS uchun O'ZI-YETARLI dars fayllarini yig'adi.
//
//  MUAMMO: LMS bitta darsga bitta fayl qabul qiladi. Darslar esa umumiy
//  `src/compilator/HtmlCompiler.jsx` modulini import qiladi (bitta manba —
//  bir yaxshilanish hamma darsga tegadi). Ikkovi bir-biriga qarshi.
//
//  YECHIM: manba bo'linganicha qoladi, LMSga esa YIG'ILGAN nusxa ketadi.
//    src/2-Modull/JsVarsLesson.jsx  ─┐
//    src/compilator/HtmlCompiler.jsx ┴→ lms/JsVarsLesson.jsx  (bitta fayl)
//
//  Nega qo'lda ko'chirib bo'lmaydi: ikkala faylda `__lang`, `tr`, `codesRead`,
//  `codesWrite` nomlari bor. Qo'lda qo'shsangiz —
//  «Identifier '__lang' has already been declared» → oq ekran.
//  esbuild ularni avtomatik ajratadi (`__lang` va `__lang2`).
//
//  JSX SAQLANADI (`jsx: 'preserve'`): chiqish fayli darslar bugun LMSga
//  ketayotgan shaklda qoladi — `.jsx`, ichida `<div className=…>`, tepasida
//  faqat `import … from "react"`. LMS tomonda hech narsa o'zgarmaydi.
//
//  Ishlatish:
//    npm run build:lms                      — kompilyatorni ishlatadigan hamma dars
//    node scripts/build-lms.mjs src/2-Modull/JsVarsLesson.jsx   — bitta dars
//
//  SHARED rejimi (LMS tashqi-modul yo'li, F-0813):
//    node scripts/build-lms.mjs --shared <spec> src/2-Modull/JsVarsLesson.jsx
//    <spec> — LMSdagi modul ko'rsatkichi: yuklangan fayl MANZILI (https://…)
//    yoki nom (@shared/html-compiler). Kompilyator bundle'ga KIRMAYDI —
//    import satri <spec> bilan qoladi, chiqish: lms/<Name>.shared.jsx (~330 KB).
// ============================================================
import { build } from 'esbuild';
import { readFileSync, writeFileSync, readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, basename, resolve, dirname } from 'node:path';
import { mergeReactImports } from './react-merge.mjs';
import { createHash } from 'node:crypto';

const OUT_DIR = process.env.LMS_OUT_DIR || 'lms'; // LMS_OUT_DIR — mashq/sinov uchun boshqa papka (lms/ ga tegmasdan)
// ── Modul → LMS papkasi (2026-08-25) ────────────────────────────────────────
//  Foydalanuvchi CRM'ga papka-papka yuklaydi, shuning uchun chiqish MODUL bo'yicha
//  ajratiladi. MUHIM: chiqish MANZILI bitta — ildizda ham, papkada ham nusxa
//  turmasin, aks holda qayta yig'ilganda eskisi papkada qolib, YANGISI ildizga
//  tushadi va eski fayl yuklanib ketadi.
//  Papka nomi = LMS kursidagi modul raqami (foydalanuvchi qarori, 2026-08-25):
//  lokal src/3-Modull → 4-M · src/4-Modull → 5-M · src/4a+4b+4c → 6-M.
const OUT_MAP = [
  ['src/3-Modull', '4-M'],           // LMS kursidagi 4-Modul (Frontend: React)
  ['src/pm/PmUserStoryLesson.jsx', '4-M'],   // 4-Modul 2-dars (eski PmLesson7 o'rnida)
  ['src/pm/PmUserStoryLesson.homework.jsx', '4-M'], // uning uy-vazifasi ham 4-M (2026-09-08)
  ['src/4-Modull', '5-M'],           // LMS kursidagi 5-Modul (Backend: Node + PostgreSQL)
  ['src/4a-Modull', '6-M'],          // LMS kursidagi 6-Modul (Nest + test + CI/CD)
  ['src/4b-Modull', '6-M'],
  ['src/4c-Modull', '6-M'],
  // F-1017-226: LMS 7–14 (ildizga tushib 1–2-M bilan aralashmasin)
  ['src/5-Modull', '7-M'], ['src/pm/PmMetricsLesson.jsx', '7-M'], // m5-14 PM darsi
  ['src/6-Modull', '8-M'], ['src/7-Modull', '9-M'], ['src/8-Modull', '10-M'], ['src/9-Modull', '11-M'],
  ['src/10-Modull', '12-M'], ['src/11-Modull', '13-M'], ['src/12-Modull', '14-M'],
  ['src/pm/PmJtbdLesson.jsx', '4-M'], // m3-17 (hozircha --skip)
];
const outDirFor = (entry) => {
  const e = entry.replace(/\\/g, '/');
  const hit = OUT_MAP.find(([pref]) => e === pref || e.startsWith(pref + '/'));
  return hit ? join(OUT_DIR, hit[1]) : OUT_DIR;
};
const SRC_DIRS = ['src/1-Modull', 'src/2-Modull', 'src/3-Modull', 'src/4-Modull', 'src/4a-Modull', 'src/4b-Modull', 'src/4c-Modull',
  'src/5-Modull', 'src/6-Modull', 'src/7-Modull', 'src/8-Modull', 'src/9-Modull', 'src/10-Modull', 'src/11-Modull', 'src/12-Modull']; // F-1017-226
const COMPILER = 'src/compilator/HtmlCompiler.jsx';

const RED = '\x1b[31m', GRN = '\x1b[32m', DIM = '\x1b[2m', B = '\x1b[1m', R = '\x1b[0m';

// ── Kompilyatorni import qiladigan darslarni topamiz ────────────────────────
function findLessons() {
  const out = [];
  for (const dir of SRC_DIRS) {
    let names;
    try { names = readdirSync(dir); } catch { continue; }
    for (const n of names) {
      const p = join(dir, n);
      if (!n.endsWith('.jsx') || !statSync(p).isFile()) continue;
      if (/from\s+['"][^'"]*compilator\/HtmlCompiler/.test(readFileSync(p, 'utf8'))) out.push(p);
    }
  }
  return out;
}

// ── Bitta darsni yig'ish ────────────────────────────────────────────────────
// sharedSpec berilsa — kompilyator bundle'ga KIRMAYDI: importi <spec> bo'lib qoladi.
// F-1015 (LMS preview): dars proplari (visitMode, previewRunId) umumiy modulga yetib borishi uchun
// default eksport kichik o'ram bilan yig'iladi — dars manbasi o'zgarmaydi. visitMode bo'lmasa o'ram
// hech narsa qilmaydi: proplar darsga o'z holicha uzatiladi.
const PREVIEW_MODULE = resolve('src/live/previewMode.js');
const entryWrapper = (abs) =>
  `import { createElement as __ccEl } from 'react';\n` +
  `import __CcLesson from ${JSON.stringify(abs)};\n` +
  `import { notePreviewProps as __ccNotePreview } from ${JSON.stringify(PREVIEW_MODULE)};\n` +
  `export * from ${JSON.stringify(abs)};\n` +
  `export default function CcLessonEntry(props) { __ccNotePreview(props); return __ccEl(__CcLesson, props); }\n`;

// --as (F-1015, reliz): dars boshqa joydagi NUSXADAN yig'iladi (masalan arxiv/…/CssPractice.jsx), lekin xuddi `asPath`
// joyida turgandek: nisbiy importlar (../live, ../compilator) o'sha papkadan, chiqish nomi va OUT_MAP — `asPath` bo'yicha.
// Manba fayl o'zgarmaydi; bannerda haqiqiy manba va md5 yoziladi.
async function one(entry, sharedSpec, asPath = null) {
  const name = basename(asPath || entry);
  const abs = resolve(entry);
  const asDir = asPath ? dirname(resolve(asPath)) : null;
  const md5 = asPath ? createHash('md5').update(readFileSync(abs)).digest('hex') : null;
  const asPlugin = asPath ? [{
    name: 'as-path',
    setup(b) {
      const re = new RegExp('^' + abs.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$');
      b.onLoad({ filter: re }, () => ({ contents: readFileSync(abs, 'utf8'), loader: 'jsx', resolveDir: asDir }));
    },
  }] : [];
  const res = await build({
    // sourcefile darsning o'z nomi bo'lmasin — aks holda esbuild importni o'ramning o'ziga ulaydi (cheksiz chizish)
    stdin: { contents: entryWrapper(abs), loader: 'js', resolveDir: dirname(abs), sourcefile: `lms-entry:${name}` },
    bundle: true,
    format: 'esm',
    jsx: 'preserve',            // JSX chiqishda SAQLANADI — LMS o'zi kompilyatsiya qiladi
    charset: 'utf8',            // o'zbekcha/ruscha matn \uXXXX ga aylanmasin
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    // Jonli-dars API manzili (src/live/liveClient.js). Bo'sh → prod. Staging uchun:
    //   DARS_API_URL=https://staging-dars-api.coddycamp.uz node scripts/build-lms.mjs <fayl>   (bo'sh → prod dars-api.coddycamp.uz)
    define: { __DARS_API_URL__: JSON.stringify(process.env.DARS_API_URL || '') },
    legalComments: 'inline',
    write: false,               // birlashtirishdan keyin o'zimiz yozamiz
    logLevel: 'silent',
    plugins: [...asPlugin, ...(sharedSpec ? [{
      name: 'shared-compiler',
      setup(b) {
        // Kompilyatorga ishora qilgan har qanday import → tashqi <spec>
        b.onResolve({ filter: /compilator[\\/]HtmlCompiler/ }, () => ({ path: sharedSpec, external: true }));
      },
    }] : [])],
  });

  const usesCompiler = /from\s+['"][^'"]*compilator\/HtmlCompiler/.test(readFileSync(entry, 'utf8'));
  const banner =
    '// ============================================================\n' +
    '//  AVTO-YIG\'ILGAN FAYL — QO\'LDA TAHRIRLAMANG.\n' +
    `//  Manba:  ${entry.replace(/\\/g, '/')}${asPath ? ` (md5 ${md5}) — ${asPath} o'rnida (--as)` : ''}\n` +
    (sharedSpec
      ? `//  Kompilyator: TASHQI MODUL — ${sharedSpec}\n` +
        `//  Qayta yig'ish:  node scripts/build-lms.mjs --shared ${sharedSpec} ${entry.replace(/\\/g, '/')}${asPath ? ` --as ${asPath}` : ''}\n`
      : (usesCompiler ? `//          ${COMPILER}\n` : `//  Kompilyator: yo'q (dars uni import qilmaydi)\n`) +
        `//  Qayta yig'ish:  node scripts/build-lms.mjs ${entry.replace(/\\/g, '/')}${asPath ? ` --as ${asPath}` : ''}\n`) +
    '//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.\n' +
    '// ============================================================\n';

  const merged = mergeReactImports(res.outputFiles[0].text);
  const outName = sharedSpec ? name.replace(/\.jsx$/, '.shared.jsx') : name;
  const dir = outDirFor(asPath || entry);
  mkdirSync(dir, { recursive: true });
  const outPath = join(dir, outName);
  writeFileSync(outPath, banner + merged, 'utf8');

  const kb = (Buffer.byteLength(banner + merged) / 1024).toFixed(0);
  const imports = (merged.match(/^import\s/gm) || []).length;
  return { name: outName, outPath, kb, imports, lines: merged.split('\n').length };
}

// ── Yugurish ────────────────────────────────────────────────────────────────
const rawArgs = process.argv.slice(2);
const sharedIdx = rawArgs.indexOf('--shared');
const sharedSpec = sharedIdx !== -1 ? rawArgs[sharedIdx + 1] : null;
if (sharedIdx !== -1 && !sharedSpec) { console.log(`${RED}--shared dan keyin modul manzili/nomi kerak${R}`); process.exit(1); }
// (bug tuzatildi 2026-08-17: `--shared`siz rejimda `i !== sharedIdx + 1` = `i !== 0` birinchi nishonni yeb qo'yardi → hamma dars yig'ilardi)
const args = sharedIdx === -1 ? rawArgs : rawArgs.filter((a, i) => i !== sharedIdx && i !== sharedIdx + 1);
// `<fayl> --as <src-yo'l>` juftligi: oldingi fayl shu yo'l o'rnida yig'iladi
const AS = new Map();
const plain = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--as') { if (!plain.length || !args[i + 1]) { console.log(`${RED}--as <fayl> dan keyin keladi va yo'l kerak${R}`); process.exit(1); } AS.set(plain[plain.length - 1], args[i + 1].replace(/\\/g, '/')); i++; continue; }
  plain.push(args[i].replace(/\\/g, '/'));
}
const targets = plain.length ? plain : findLessons();

if (!targets.length) { console.log(`${RED}Yig'iladigan dars topilmadi${R}`); process.exit(1); }
mkdirSync(OUT_DIR, { recursive: true });

console.log(`${B}LMS uchun yig'ilmoqda${R} ${DIM}(${targets.length} ta dars → ${OUT_DIR}/${sharedSpec ? ` · SHARED: ${sharedSpec}` : ''})${R}\n`);
let bad = 0;
for (const t of targets) {
  try {
    const r = await one(t, sharedSpec, AS.get(t) || null);
    console.log(`  ${GRN}✓${R} ${r.name.padEnd(26)} ${String(r.lines).padStart(5)} qator  ${String(r.kb).padStart(4)} KB  ${DIM}${r.imports} import${R}`);
  } catch (e) {
    bad++;
    console.log(`  ${RED}✗ ${basename(t)}${R}  ${String(e.message).split('\n')[0].slice(0, 90)}`);
  }
}
console.log(bad ? `\n${RED}${bad} ta dars yig'ilmadi${R}` : `\n${GRN}Hammasi yig'ildi${R} ${DIM}— ${OUT_DIR}/ papkasidagi fayllar LMSga tayyor${R}`);
process.exit(bad ? 1 : 0);
