// ============================================================
//  build-shared-module — kompilyatorni LMSga yuklanadigan TASHQI MODULGA yig'adi.
//
//  src/compilator/HtmlCompiler.jsx  →  lms/html-compiler.jsx
//
//  Chiqish-shartnoma (TZ v2 9-bo'lim + guide §2, biz va'da qilganmiz):
//    · sof standart ESM, ICHIDA JSX YO'Q (klassik React.createElement'ga aylantiriladi)
//    · import — FAQAT `react` (react/jsx-runtime ham YO'Q — LMS resolverida
//      tashqi modul ichidan yechilishi tasdiqlanmagan, S-1 savoli ochiq)
//    · eksportlar: default (kompilyator) · checks · HC_NASHR (yig'ilgan sana)
//
//  Kengaytma `.jsx` — LMS yuklash oynasi faqat shu turni qabul qiladi;
//  mazmun sof JavaScript (xuddi sinov-modul kabi).
//
//  Ishlatish:  node scripts/build-shared-module.mjs
// ============================================================
import { build } from 'esbuild';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { mergeReactImports } from './react-merge.mjs';

const SRC = 'src/compilator/HtmlCompiler.jsx';
const OUT = join('lms', 'html-compiler.jsx');
const RED = '\x1b[31m', GRN = '\x1b[32m', DIM = '\x1b[2m', B = '\x1b[1m', R = '\x1b[0m';

// JSX klassik rejimda `React.createElement` ga aylanadi; manbada `React`
// identifikatori yo'q — uni inject-shim beradi (esbuild'ning rasmiy usuli).
const shim = join('scripts', '.react-shim.tmp.mjs');
writeFileSync(shim, "import React from 'react';\nexport { React };\n", 'utf8');

const nashr = new Date().toISOString().slice(0, 10);

let res;
try {
  res = await build({
    entryPoints: [SRC],
    bundle: true,
    format: 'esm',
    jsx: 'transform',                 // JSX → React.createElement (jsx-runtime YO'Q)
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    inject: [shim],
    external: ['react'],
    charset: 'utf8',                  // o'zbekcha/ruscha matn \uXXXX ga aylanmasin
    legalComments: 'inline',
    write: false,
    logLevel: 'silent',
    footer: { js: `\nexport const HC_NASHR = '${nashr}';\n` },
  });
} finally {
  const { rmSync } = await import('node:fs');
  try { rmSync(shim); } catch { /* qolsa ham zarar yo'q */ }
}

const banner =
  '// ============================================================\n' +
  '//  UMUMIY MODUL — LMS TASHQI-MODUL (avto-yig\'ilgan, QO\'LDA TAHRIRLAMANG)\n' +
  `//  Manba:   ${SRC}\n` +
  `//  Nashr:   ${nashr}\n` +
  '//  Mazmun:  sof ESM, JSX YO\'Q, faqat `react` import qilinadi.\n' +
  '//  Eksport: default (kompilyator) · checks · HC_NASHR\n' +
  '//  Qayta yig\'ish:  node scripts/build-shared-module.mjs\n' +
  '// ============================================================\n';

const merged = mergeReactImports(res.outputFiles[0].text);
const out = banner + merged;

// ── Chiqish-shartnoma DARVOZALARI — sinsa fayl yozilmaydi ──────────────────
const fails = [];
// 1) Importlar: faqat `react`
const imports = [...out.matchAll(/^import\s+.*?from\s+["']([^"']+)["'];?\s*$/gm)].map((m) => m[1]);
if (!(imports.length === 1 && imports[0] === 'react')) fails.push(`importlar: ${JSON.stringify(imports)} — faqat ["react"] bo'lishi kerak`);
// 2) JSX qolmagan (jsx-runtime chaqiruvi ham)
if (/from\s+["']react\/jsx-runtime["']/.test(out)) fails.push('react/jsx-runtime importi qolgan');
// 3) NUL bayt yo'q (manbada 2 ta xom NUL bor — esbuild escape qilishi shart)
if (out.includes('\0')) fails.push('chiqishda xom NUL bayt bor');
// 4) Eksportlar joyida (esbuild `export { X as default }` shaklida chiqaradi)
if (!/export\s+default|as\s+default/.test(out)) fails.push("eksport yo'q: default");
for (const e of ['checks', 'HC_NASHR']) {
  if (!out.includes(e)) fails.push(`eksport yo'q: ${e}`);
}

if (fails.length) {
  console.log(`${RED}${B}MODUL YIG'ILMADI — shartnoma buzildi:${R}`);
  fails.forEach((f) => console.log(`  ${RED}✗ ${f}${R}`));
  process.exit(1);
}

mkdirSync('lms', { recursive: true });
writeFileSync(OUT, out, 'utf8');
const kb = (Buffer.byteLength(out) / 1024).toFixed(0);
console.log(`${GRN}✓${R} ${B}${OUT}${R}  ${kb} KB · ${out.split('\n').length} qator ${DIM}· import: faqat react · JSX yo'q · nashr ${nashr}${R}`);
console.log(`${DIM}Keyingi qadam: LMS «Umumiy modullar»ga yuklash yoki scripts/smoke-shared.mjs bilan lokal sinov.${R}`);
