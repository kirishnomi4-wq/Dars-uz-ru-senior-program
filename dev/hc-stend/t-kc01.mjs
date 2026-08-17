import { open, setCode } from './t-lib.mjs';
const cases = [
  ['color', '#ff0000', 'h1{color:#ff0000}'], ['color', '#fff', 'h1{color:#FFFFFF}'], ['color', 'white', 'h1{color:#fff}'],
  ['margin', '0', 'h1{margin:0}'], ['margin', '10px 20px', 'h1{margin:10px 20px}'], ['margin', '0 auto', 'h1{margin: 0 auto}'],
  ['border', '1px solid red', 'h1{border:1px solid red}'], ['flex', '1', 'h1{flex:1}'], ['transition', 'all .3s', 'h1{transition:all .3s}'],
  ['z-index', 2, 'h1{z-index:2}'], ['display', 'flex', 'h1{display:flex}'], ['text-align', 'center', 'h1{text-align:center}'],
  ['flex-direction', 'column', 'h1{flex-direction:column}'], ['background', '#eee', 'h1{background:#eee}'],
  ['color', 'red', 'p{color:blue}'] /* salbiy: mos kelmasligi kerak */,
];
const { b, p } = await open({ props: { lang: 'uz', task: { title: 't', files: [
  { name: 'index.html', lang: 'html', starter: '<h1>x</h1><p>y</p>' }, { name: 'style.css', lang: 'css', starter: '' } ],
  requirements: cases.map(([prop, val], i) => ({ id: 'c' + i, label: `${prop}:${val}`, css: { sel: (i === cases.length - 1 ? 'p' : 'h1'), prop, value: val } })) } } });
await p.click('.hc-tab:has-text("style.css")');
await setCode(p, cases.map(c => c[2]).join('\n')); await p.waitForTimeout(1200);
const chips = await p.$$eval('.hc-chip', e => e.map(x => x.className.includes('ok')));
cases.forEach((c, i) => console.log(chips[i] ? 'OK ' : 'RED', c[0], JSON.stringify(c[1]), '←', c[2]));
console.log('yashil:', chips.filter(Boolean).length, '/', cases.length, '(kutilgan 14/15 — oxirgisi salbiy)');
await b.close();
