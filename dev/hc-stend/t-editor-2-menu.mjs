// 2-blok: taklif-menyu
import { open, setCode, sel, shot } from './t-lib.mjs';
const { b, p, errs } = await open();
const log = (...a) => console.log(...a);
const menu = () => p.evaluate(() => { const m = document.querySelector('.hc-menu'); if (!m) return null; const rows = [...m.querySelectorAll('.hc-menu-row')]; const r = m.getBoundingClientRect(); const box = document.querySelector('.hc-code-box').getBoundingClientRect(); return { n: rows.length, on: rows.findIndex(x => x.classList.contains('on')), first: rows[0]?.textContent, items: rows.map(x => x.querySelector('.hc-menu-k').textContent), up: m.classList.contains('up'), rect: { l: r.left - box.left, t: r.top - box.top, b: r.bottom - box.top, r: r.right - box.left, w: r.width, h: r.height }, boxH: box.height, boxW: box.width, tip: m.querySelector('.hc-menu-tip')?.textContent }; });

// 2a. `<` opens
await setCode(p, '');
await p.keyboard.type('<');
await p.waitForTimeout(100);
let m = await menu(); log('2a `<` menu:', m && { n: m.n, on: m.on, first: m.first, rect: m.rect, tip: m.tip });
await shot(p, 'e2a-menu-lt.png');
// filter
await p.keyboard.type('h');
await p.waitForTimeout(80);
m = await menu(); log('2a `<h` items:', m && m.items);
await p.keyboard.type('1');
m = await menu(); log('2a `<h1` items:', m && m.items);
// Enter selects
await p.keyboard.press('Enter');
await p.waitForTimeout(80);
log('2a after Enter:', JSON.stringify(await sel(p)), 'menu?', !!(await menu()));
// Does Enter add newline (double action)? value should be exactly <h1></h1>
// 2b. bare word `h` on its own line
await setCode(p, '');
await p.keyboard.type('h');
await p.waitForTimeout(80);
m = await menu(); log('2b bare `h` menu:', m && m.items);
await p.keyboard.type('2');
m = await menu(); log('2b bare `h2`:', m && m.items);
await p.keyboard.press('Escape');
await p.waitForTimeout(50);
log('2b after Esc menu?', !!(await menu()));
await p.keyboard.type('x'); await p.keyboard.press('Backspace');
await p.waitForTimeout(80);
log('2b after edit menu back?', !!(await menu()));
// Esc then Tab → snippet? h2 not in SNIPPETS; Tab should insert 2 spaces
await p.keyboard.press('Escape');
await p.keyboard.press('Tab');
log('2b Esc+Tab on h2:', JSON.stringify(await sel(p)));
// 2c. ul snippet via bare word + Enter
await setCode(p, '');
await p.keyboard.type('  ul');
await p.waitForTimeout(80);
m = await menu(); log('2c `ul` items', m && m.items, 'idx', m && m.on);
await p.keyboard.press('Enter');
await p.waitForTimeout(80);
log('2c after Enter ul:', JSON.stringify(await sel(p)));
// 2d. a snippet
await setCode(p, '');
await p.keyboard.type('<a');
await p.waitForTimeout(80);
m = await menu(); log('2d `<a` items', m && m.items);
await p.keyboard.press('Enter');
log('2d after Enter <a:', JSON.stringify(await sel(p)));
// now attr menu: after `<a href="" ` type space
await setCode(p, '<a href="x"|</a>'.replace('|', ''));
await p.$eval('.hc-code', el => el.setSelectionRange(11, 11));
await p.keyboard.type(' ');
await p.waitForTimeout(80);
m = await menu(); log('2d attr menu after space:', m && m.items);
await p.keyboard.type('c');
m = await menu(); log('2d attr `c`:', m && m.items);
await p.keyboard.press('Enter');
log('2d after attr Enter:', JSON.stringify(await sel(p)));
// attr menu on img
await setCode(p, '<img');
await p.keyboard.type(' ');
m = await menu(); log('2d img attr:', m && m.items);
await p.keyboard.press('Escape');
// 2e. ArrowDown/Up + mouse click
await setCode(p, '');
await p.keyboard.type('<');
await p.keyboard.press('ArrowDown'); await p.keyboard.press('ArrowDown');
m = await menu(); log('2e after 2x Down idx', m && m.on);
await p.keyboard.press('ArrowUp'); await p.keyboard.press('ArrowUp'); await p.keyboard.press('ArrowUp');
m = await menu(); log('2e after 3x Up idx (wrap?)', m && m.on);
// keyup after arrow: does idx reset? (refreshMenu on keyup)
await p.waitForTimeout(100);
m = await menu(); log('2e idx after keyup settle', m && m.on);
// mouse click on 4th
await p.click('.hc-menu-row:nth-child(4)');
await p.waitForTimeout(80);
log('2e after click 4th:', JSON.stringify(await sel(p)));
// 2f. Menu near bottom of editor: fill many lines, type `<` on last visible line
await setCode(p, Array.from({ length: 30 }, (_, i) => `<p>${i + 1}</p>`).join('\n') + '\n');
await p.keyboard.press('Control+End');
await p.keyboard.type('<');
await p.waitForTimeout(100);
m = await menu(); log('2f bottom menu:', m && { up: m.up, rect: m.rect, boxH: m.boxH });
await shot(p, 'e2f-menu-bottom.png');
await p.keyboard.press('Escape');
// menu at far right (long line)
await setCode(p, '<p>' + 'a'.repeat(120));
await p.keyboard.type('<');
await p.waitForTimeout(100);
m = await menu(); log('2f right menu:', m && { rect: m.rect, boxW: m.boxW });
await shot(p, 'e2f-menu-right.png');
await p.keyboard.press('Escape');
// 2g. Enter with menu open — check no extra newline; also Enter in `<p>` text context (bare word inside <p>)
await setCode(p, '<p>');
await p.keyboard.press('End');
await p.keyboard.type('Bugun ol');
await p.waitForTimeout(80);
m = await menu(); log('2g inside <p> "Bugun ol" menu?', !!m);
await setCode(p, '<p>\n');
await p.keyboard.type('ol');
await p.waitForTimeout(80);
m = await menu(); log('2g inside <p> newline "ol" menu?', !!m && m.items);
// inside <div> (not text tag)
await setCode(p, '<div>\n  ');
await p.keyboard.type('p');
m = await menu(); log('2g inside <div> "p" menu?', !!m && m.items);
// bare word inside <li> (text tag) — a bola writing list items text
await setCode(p, '<ul>\n  <li>');
await p.keyboard.type('a');
m = await menu(); log('2g <li>a menu?', !!m);
// 2h. `</` should NOT open
await setCode(p, '<p>x');
await p.keyboard.type('</');
m = await menu(); log('2h `</` menu?', !!m);
await p.keyboard.type('p');
m = await menu(); log('2h `</p` menu?', !!m);
// 2i. `<` in the middle of text with word after — `<h` before existing text
await setCode(p, 'salom dunyo');
await p.$eval('.hc-code', el => el.setSelectionRange(0, 0));
await p.keyboard.type('<h');
m = await menu(); log('2i `<h` before text menu?', !!m && m.items);
await p.keyboard.press('Enter');
log('2i result', JSON.stringify(await sel(p)));
// 2j. Menu after selecting text with mouse (selection non-collapsed) → menu closes?
// 2k. Shift+Enter with menu open
await setCode(p, '');
await p.keyboard.type('<p');
await p.keyboard.press('Shift+Enter');
log('2k Shift+Enter:', JSON.stringify(await sel(p)), 'menu?', !!(await menu()));
// 2l. Tab with menu open selects
await setCode(p, '');
await p.keyboard.type('<im');
await p.keyboard.press('Tab');
log('2l Tab on <im:', JSON.stringify(await sel(p)));
// 2m. Menu in CSS/JS file? (need files task) later
// 2n. typing uppercase `<H1`
await setCode(p, '');
await p.keyboard.type('<H');
m = await menu(); log('2n `<H` items', m && m.items);
await p.keyboard.press('Enter');
log('2n result', JSON.stringify(await sel(p)));
// 2o. bare word with trailing text on line → no menu
await setCode(p, 'h1 salom');
await p.$eval('.hc-code', el => el.setSelectionRange(2, 2));
await p.keyboard.press('ArrowLeft'); await p.keyboard.press('ArrowRight');
m = await menu(); log('2o `h1| salom` menu?', !!m);
// 2p. Click into editor at a bare word position (onSelect) → menu appears without typing?
await setCode(p, 'p\n<b>x</b>');
await p.$eval('.hc-code', el => el.setSelectionRange(1, 1));
await p.keyboard.press('End');
m = await menu(); log('2p caret moved to end of bare `p` — menu?', !!m);
// 2q. lots of items scroll: `<` gives 19 items, ArrowUp from 0 wraps to last → visible?
await setCode(p, '');
await p.keyboard.type('<');
await p.keyboard.press('ArrowUp');
const vis = await p.evaluate(() => { const box = document.querySelector('.hc-menu-list'); const row = box.querySelector('.on'); const rb = row.getBoundingClientRect(), bb = box.getBoundingClientRect(); return { rowTop: rb.top - bb.top, rowBot: rb.bottom - bb.top, boxH: bb.height, st: box.scrollTop }; });
log('2q ArrowUp wrap → last row visible?', JSON.stringify(vis));
await shot(p, 'e2q-menu-last.png');
// 2r. blur closes menu; click on preview iframe
await p.mouse.click(1000, 500);
await p.waitForTimeout(80);
log('2r after click outside menu?', !!(await menu()));
// 2s: menu items count for `<` : 19 all? and does list overflow (max-height 248) show scrollbar
log('ERRS', errs);
await b.close();
