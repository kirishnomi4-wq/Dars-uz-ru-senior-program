// K-C-04: cssProp/cssValue — qisqa-xossalar (ro'yxatdan tashqari) va @media/@supports/@layer ichidagi qoidalar
import { open, chips } from './tc-lib.mjs';
const { b, p } = await open();
// [label, css-shart {sel,prop,value?}, css-matn, kutilgan]
const cases = [
  ['border-bottom (prop)', { sel: 'a', prop: 'border-bottom' }, 'a{border-bottom:1px solid red}', true],
  ['border-bottom (value)', { sel: 'a', prop: 'border-bottom', value: '1px solid red' }, 'a{border-bottom:1px solid red}', true],
  ['text-decoration', { sel: 'a', prop: 'text-decoration', value: 'none' }, 'a{text-decoration:none}', true],
  ['outline', { sel: 'a', prop: 'outline' }, 'a{outline:2px solid blue}', true],
  ['border-color', { sel: 'a', prop: 'border-color', value: 'red' }, 'a{border-color:red}', true],
  ['border-width', { sel: 'a', prop: 'border-width' }, 'a{border-width:2px}', true],
  ['columns', { sel: 'p', prop: 'columns' }, 'p{columns:2}', true],
  ['animation', { sel: 'p', prop: 'animation' }, 'p{animation:x 1s linear}', true],
  ['grid-area', { sel: 'p', prop: 'grid-area' }, 'p{grid-area:main}', true],
  ['@media ichida font-size (prop)', { sel: 'h1', prop: 'font-size' }, '@media (max-width:600px){h1{font-size:2em}}', true],
  ['@media ichida (value)', { sel: 'h1', prop: 'font-size', value: '2em' }, '@media (max-width:600px){h1{font-size:2em}}', true],
  ['@supports ichida', { sel: 'p', prop: 'display', value: 'grid' }, '@supports (display:grid){p{display:grid}}', true],
  ['@layer ichida', { sel: 'p', prop: 'color', value: 'red' }, '@layer base{p{color:red}}', true],
  ['@media ichida @supports', { sel: 'p', prop: 'gap' }, '@media screen{@supports (gap:1px){p{gap:8px}}}', true],
  ['@keyframes — selektor emas (yiqilmasin)', { sel: 'p', prop: 'color' }, '@keyframes x{from{color:red}to{color:blue}} p{margin:0}', false],
  ['salbiy: xossa yo\'q', { sel: 'a', prop: 'border-bottom' }, 'a{border-top:1px solid red}', false],
  ['salbiy: qiymat boshqa', { sel: 'a', prop: 'text-decoration', value: 'none' }, 'a{text-decoration:underline}', false],
  ['eski ro\'yxat: gap', { sel: '.row', prop: 'gap', value: '8px' }, '.row{gap:8px}', true],
  ['eski ro\'yxat: margin 0 auto', { sel: 'h1', prop: 'margin', value: '0 auto' }, 'h1{margin:0 auto}', true],
];
let bad = 0;
for (const [label, spec, css, expect] of cases) {
  await p.evaluate(({ spec, css }) => { localStorage.clear(); window.mountHC({ lang: 'uz', task: { title: 't', files: [
    { name: 'index.html', lang: 'html', starter: '<h1>x</h1><p>y</p><a href="#">z</a><div class="row"></div>' }, { name: 'style.css', lang: 'css', starter: css } ],
    requirements: [{ id: 'a', label: 'a', css: spec }] } }); }, { spec, css });
  await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(500);
  const c = (await chips(p))[0]; const ok = c.ok;
  if (ok !== expect) bad++;
  console.log(`${ok === expect ? '✓' : '✗ KUTILMAGAN'} [${label}] chip=${ok ? 'yashil' : 'qizil'} (kutilgan ${expect ? 'yashil' : 'qizil'})${ok ? '' : '  ← ' + c.hint}`);
}
console.log(bad ? `XATO: ${bad}/${cases.length}` : `HAMMASI KUTILGANDEK ${cases.length}/${cases.length}`);
await b.close();
