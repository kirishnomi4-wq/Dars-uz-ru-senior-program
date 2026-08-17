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
import { join, basename } from 'node:path';
import { mergeReactImports } from './react-merge.mjs';

const OUT_DIR = 'lms';
const SRC_DIRS = ['src/1-Modull', 'src/2-Modull', 'src/3-Modull'];
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
async function one(entry, sharedSpec) {
  const name = basename(entry);
  const res = await build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    jsx: 'preserve',            // JSX chiqishda SAQLANADI — LMS o'zi kompilyatsiya qiladi
    charset: 'utf8',            // o'zbekcha/ruscha matn \uXXXX ga aylanmasin
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    legalComments: 'inline',
    write: false,               // birlashtirishdan keyin o'zimiz yozamiz
    logLevel: 'silent',
    plugins: sharedSpec ? [{
      name: 'shared-compiler',
      setup(b) {
        // Kompilyatorga ishora qilgan har qanday import → tashqi <spec>
        b.onResolve({ filter: /compilator[\\/]HtmlCompiler/ }, () => ({ path: sharedSpec, external: true }));
      },
    }] : [],
  });

  const banner =
    '// ============================================================\n' +
    '//  AVTO-YIG\'ILGAN FAYL — QO\'LDA TAHRIRLAMANG.\n' +
    `//  Manba:  ${entry.replace(/\\/g, '/')}\n` +
    (sharedSpec
      ? `//  Kompilyator: TASHQI MODUL — ${sharedSpec}\n` +
        `//  Qayta yig'ish:  node scripts/build-lms.mjs --shared ${sharedSpec} ${entry.replace(/\\/g, '/')}\n`
      : `//          ${COMPILER}\n` +
        '//  Qayta yig\'ish:  npm run build:lms\n') +
    '//  Tahrir MANBAGA kiritiladi, keyin shu buyruq qayta yuriladi.\n' +
    '// ============================================================\n';

  const merged = mergeReactImports(res.outputFiles[0].text);
  const outName = sharedSpec ? name.replace(/\.jsx$/, '.shared.jsx') : name;
  const outPath = join(OUT_DIR, outName);
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
const args = rawArgs.filter((a, i) => i !== sharedIdx && i !== sharedIdx + 1);
const targets = args.length ? args.map((a) => a.replace(/\\/g, '/')) : findLessons();

if (!targets.length) { console.log(`${RED}Yig'iladigan dars topilmadi${R}`); process.exit(1); }
mkdirSync(OUT_DIR, { recursive: true });

console.log(`${B}LMS uchun yig'ilmoqda${R} ${DIM}(${targets.length} ta dars → ${OUT_DIR}/${sharedSpec ? ` · SHARED: ${sharedSpec}` : ''})${R}\n`);
let bad = 0;
for (const t of targets) {
  try {
    const r = await one(t, sharedSpec);
    console.log(`  ${GRN}✓${R} ${r.name.padEnd(26)} ${String(r.lines).padStart(5)} qator  ${String(r.kb).padStart(4)} KB  ${DIM}${r.imports} import${R}`);
  } catch (e) {
    bad++;
    console.log(`  ${RED}✗ ${basename(t)}${R}  ${String(e.message).split('\n')[0].slice(0, 90)}`);
  }
}
console.log(bad ? `\n${RED}${bad} ta dars yig'ilmadi${R}` : `\n${GRN}Hammasi yig'ildi${R} ${DIM}— ${OUT_DIR}/ papkasidagi fayllar LMSga tayyor${R}`);
process.exit(bad ? 1 : 0);
