import { open, setCode, sel } from './t-lib.mjs';
const { b, p } = await open();
const menu = () => p.evaluate(() => { const m = document.querySelector('.hc-menu'); if (!m) return null; return { items: [...m.querySelectorAll('.hc-menu-k')].map(x => x.textContent) }; });
await setCode(p, '');
await p.keyboard.type('<p');
await p.keyboard.press('Shift+Enter');
await p.waitForTimeout(80);
console.log('2k after Shift+Enter menu:', JSON.stringify(await menu()));
await p.keyboard.press('Enter');
console.log('2k then Enter:', JSON.stringify(await sel(p)));
// Enter on `<p ` (space) → attr menu open → Enter inserts class
await setCode(p, '');
await p.keyboard.type('<p ');
console.log('`<p ` menu', JSON.stringify(await menu()));
await p.keyboard.press('Enter');
console.log('Enter →', JSON.stringify(await sel(p)));
// mAttr across newline: `<p class="a"\n` then type `id`
await setCode(p, '<p class="a"\n');
await p.keyboard.type('i');
console.log('multi-line attr menu', JSON.stringify(await menu()));
// tag menu with `<` then type `>` directly
await setCode(p, '');
await p.keyboard.type('<p>');
console.log('`<p>` typed →', JSON.stringify(await sel(p)), 'menu', JSON.stringify(await menu()));
// menu when typing text quickly: `<p>Salom` then `<a` inside → menu; then Enter → snippet a
await p.keyboard.type('Salom <a');
await p.keyboard.press('Enter');
console.log('inside p <a Enter →', JSON.stringify(await sel(p)));
// snippet within existing indented line via Tab after Esc
await setCode(p, '<div>\n  img');
await p.keyboard.press('Escape');
await p.keyboard.press('Tab');
console.log('Esc+Tab img →', JSON.stringify(await sel(p)));
await setCode(p, '<div>\n  ul');
await p.keyboard.press('Escape');
await p.keyboard.press('Tab');
console.log('Esc+Tab ul →', JSON.stringify(await sel(p)));
await b.close();
