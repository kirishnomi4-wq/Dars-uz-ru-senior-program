#!/usr/bin/env node
// Kompilyator maslahat-ro'yxatlarini XARITADAN yasaydi (F-1001-91, Q3: ro'yxat qo'lda yozilmaydi).
//   node scripts/gen-teg-royxat.mjs           → src/compilator/HtmlCompiler.jsx ichidagi blokni yangilaydi
//   node scripts/gen-teg-royxat.mjs --check   → blok xarita bilan bir xilmi (darvoza), 0/1
import { readFileSync, writeFileSync } from 'node:fs';
const MAP = 'src/compilator/teg-xaritasi.json', SRC = 'src/compilator/HtmlCompiler.jsx';
const B = '// ⟨TEG-ROYXAT boshi⟩', E = '// ⟨TEG-ROYXAT oxiri⟩';
const X = JSON.parse(readFileSync(MAP, 'utf8'));
const j = (v) => JSON.stringify(v);
const tag = (t) => `  { t: ${j(t.t)}, dars: ${j(t.dars)}${t.void ? ', void: true' : ''}${t.matn ? ', matn: true' : ''}, d: ${j(t.d)} },`;
const attrs = {};
for (const a of X.html.atributlar) (attrs[a.tag] ||= []).push(`{ a: ${j(a.a)}, dars: ${j(a.dars)}, d: ${j(a.d)}${a.qiymatlar ? ', v: ' + j(a.qiymatlar) : ''} }`);
const lines = [
  B,
  `//  AVTO-YIG'ILGAN — QO'LDA TAHRIRLAMANG. Manba: ${MAP} (odam o'qiydigani: feedback/F-0929-LMS-yuklash/TEG_XARITASI.md)`,
  `//  Qayta yig'ish: node scripts/gen-teg-royxat.mjs · Darvoza: node scripts/lint-teg-royxat.mjs`,
  `//  Har teg \`dars\` bilan: \`stage\` berilgan darsda faqat o'sha darsgacha o'tilganlari chiqadi (Q2).`,
  `const TEG_TARTIB = ${j(X.tartib)};`,
  `const BOSQICH = ${j(X.bosqich)};`,
  `const TAG_MENU_ALL = [`, ...X.html.teglar.map(tag), `];`,
  `const ATTR_MENU_ALL = {`, ...Object.entries(attrs).map(([k, v]) => `  ${j(k)}: [${v.join(', ')}],`), `};`,
  `const CSS_MENU_ALL = [`, ...X.css.xossalar.map((c) => `  { p: ${j(c.p)}, dars: ${j(c.dars)}, d: ${j(c.d)}, v: ${j(c.qiymatlar)} },`), `];`,
  `const JS_MENU_ALL = {`,
  `  kw: [${X.js.kalit_sozlar.map((k) => `{ k: ${j(k.k)}, dars: ${j(k.dars)}, d: ${j(k.d)} }`).join(', ')}],`,
  `  api: [${X.js.api.map((k) => `{ k: ${j(k.k)}, dars: ${j(k.dars)}, d: ${j(k.d)}${k.qolip ? ', q: ' + j(k.qolip) : ''} }`).join(', ')}],`,
  `  snip: [${X.js.qisqartmalar.map((q) => `{ q: ${j(q.q)}, dars: ${j(q.dars)}, body: ${j(q.natija)} }`).join(', ')}],`,
  `};`,
  E,
];
const block = lines.join('\n');
const src = readFileSync(SRC, 'utf8');
const a = src.indexOf(B), b = src.indexOf(E);
if (a === -1 || b === -1) { console.error(`${SRC}: ⟨TEG-ROYXAT⟩ belgilari topilmadi`); process.exit(2); }
const cur = src.slice(a, b + E.length);
if (process.argv.includes('--check')) {
  if (cur === block) { console.log('✅ teg-ro\'yxat bloki xarita bilan bir xil'); process.exit(0); }
  console.log('❌ teg-ro\'yxat bloki xaritadan ORQADA — node scripts/gen-teg-royxat.mjs'); process.exit(1);
}
if (cur === block) { console.log('o\'zgarish yo\'q'); process.exit(0); }
writeFileSync(SRC, src.slice(0, a) + block + src.slice(b + E.length));
console.log(`✅ ${SRC}: blok yangilandi (teg ${X.html.teglar.length} · atribut ${X.html.atributlar.length} · css ${X.css.xossalar.length} · js ${X.js.kalit_sozlar.length + X.js.api.length})`);
