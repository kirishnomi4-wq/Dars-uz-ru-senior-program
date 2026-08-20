import { open, setCode, sel } from './t-lib.mjs';
const { b, p } = await open();
for (const [pre, w] of [['<div>\n  ', 'Bu'], ['', 'Bu'], ['<section>\n', 'a'], ['<div>\n', 'Ol']]) {
  await setCode(p, pre); await p.keyboard.type(w); await p.waitForTimeout(60);
  const m = !!(await p.$('.hc-menu'));
  await p.keyboard.press('Enter');
  console.log(JSON.stringify(pre + w), 'menu', m, '→ Enter →', JSON.stringify((await sel(p)).v));
}
// attr menu closes when typing quote
await setCode(p, ''); await p.keyboard.type('<p cl');
console.log('`<p cl` menu', !!(await p.$('.hc-menu')));
await p.keyboard.type('ass="');
console.log('`<p class="` menu', !!(await p.$('.hc-menu')), JSON.stringify((await sel(p)).v));
await b.close();
