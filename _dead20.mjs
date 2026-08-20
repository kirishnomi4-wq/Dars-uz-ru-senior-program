// _dead20.mjs — o'lik CSS ikki tomonlama sanoq
import { readFileSync } from 'node:fs';
const NL = String.fromCharCode(10);
const f = process.argv[2];
const src = readFileSync(f, 'utf8');
// CSS shablon-satrlari
const cssParts = [];
for (const m of src.matchAll(/const CSS_[A-Z]+ = `([^`]*)`/g)) cssParts.push(m[1]);
const styleTag = src.match(/<style>\{`([\s\S]*?)`\}<\/style>/);
if (styleTag) cssParts.push(styleTag[1]);
const css = cssParts.join(NL);
const jsx = src.split('const CSS_BASE')[0] + (src.split('`;').pop() || '');
// CSS'dagi sinf nomlari
const defined = new Set();
for (const m of css.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g)) defined.add(m[1]);
// JSX'dagi sinf nomlari (className, turnCls, waveCls, satr-birikmalar)
const used = new Set();
for (const m of src.matchAll(/className=\{?["'`]([^"'`]*)["'`]/g)) m[1].split(/[\s${}]+/).forEach(c => c && used.add(c));
for (const m of src.matchAll(/["'`]([a-z][a-zA-Z0-9_-]*(?: [a-z][a-zA-Z0-9_-]*)*)["'`]/g)) m[1].split(/\s+/).forEach(c => used.add(c));
for (const m of src.matchAll(/classList\.[a-z]+\(['"]([^'"]+)/g)) used.add(m[1]);
const skip = /^(lesson-root|screen|stage|body|html|card|option)$/;
const olik = [...defined].filter(c => !used.has(c)).sort();
const yoq = [...used].filter(c => defined.size && !defined.has(c) && /^[a-z][a-z0-9-]*$/.test(c) && c.includes('-')).sort();
console.log('CSS sinflar:', defined.size, '· JSX sinflar:', used.size);
console.log('O\'LIK (CSS bor, JSX yo\'q):', olik.length, NL + '  ' + olik.join(' '));
console.log('YETIM (JSX bor, CSS yo\'q):', yoq.length, NL + '  ' + yoq.join(' '));
