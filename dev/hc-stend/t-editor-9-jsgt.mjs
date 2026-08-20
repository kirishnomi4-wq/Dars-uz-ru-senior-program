import { open, setCode, sel } from './t-lib.mjs';
const props = { lang: 'uz', task: { title: 'JS', requirements: [{ tag: 'h1' }], files: [
  { name: 'index.html', lang: 'html', starter: '' }, { name: 'style.css', lang: 'css', starter: '' }, { name: 'script.js', lang: 'js', starter: '' } ] } };
const { b, p } = await open({ props });
await p.click('.hc-tab:has-text("script.js")');
for (const t of ['if (i<len && j>', 'if (a<b) { c>', 'const f = (a) =>', 'x = a < b ? c : d >', 'for (let i=0;i<n;i++) if (m>']) {
  await setCode(p, '');
  await p.keyboard.type(t);
  console.log('JS', JSON.stringify(t), '→', JSON.stringify((await sel(p)).v));
}
await p.click('.hc-tab:has-text("style.css")');
for (const t of ['ul>li{', 'a > b {}', '.x{width:calc(1px+2px)}']) {
  await setCode(p, '');
  await p.keyboard.type(t);
  console.log('CSS', JSON.stringify(t), '→', JSON.stringify((await sel(p)).v));
}
// Enter auto-indent in JS with `{`
await setCode(p, '');
await p.keyboard.type('function f() {');
await p.keyboard.press('Enter');
console.log('JS Enter in {}:', JSON.stringify(await sel(p)));
await p.keyboard.type('return 1;');
await p.keyboard.press('Enter');
console.log('JS Enter after return:', JSON.stringify(await sel(p)));
// Ctrl+/ in JS
await p.keyboard.press('Control+/');
console.log('JS Ctrl+/ empty indented line:', JSON.stringify(await sel(p)));
await b.close();
