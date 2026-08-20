// 3-blok: klaviatura — Tab, Shift+Tab, Enter, undo/redo, autoclose, Backspace juftlik
import { open, setCode, sel, val } from './t-lib.mjs';
const { b, p, errs } = await open();
const log = (...a) => console.log(...a);
const focused = () => p.evaluate(() => document.activeElement && (document.activeElement.className || document.activeElement.tagName));

// 3a. Tab in editor → 2 spaces, focus stays
await setCode(p, 'abc');
await p.keyboard.press('Tab');
log('3a Tab:', JSON.stringify(await sel(p)), 'focus:', await focused());
// Tab with selection (multi-line) → indent all? (VS Code) — here?
await setCode(p, 'a\nb\nc');
await p.keyboard.press('Control+A');
await p.keyboard.press('Tab');
log('3a Tab with selection:', JSON.stringify(await sel(p)));
// Shift+Tab
await setCode(p, '    abc');
await p.keyboard.press('End');
await p.keyboard.press('Shift+Tab');
log('3a Shift+Tab:', JSON.stringify(await sel(p)));
await p.keyboard.press('Shift+Tab');
log('3a Shift+Tab x2:', JSON.stringify(await sel(p)));
await p.keyboard.press('Shift+Tab');
log('3a Shift+Tab x3 (no indent):', JSON.stringify(await sel(p)), 'focus', await focused());
// Shift+Tab with caret at line start col 1 in indented line
await setCode(p, '  abc');
await p.keyboard.press('Home');
await p.keyboard.press('Shift+Tab');
log('3a Shift+Tab at Home:', JSON.stringify(await sel(p)));
// Shift+Tab with 1 space
await setCode(p, ' abc');
await p.keyboard.press('End');
await p.keyboard.press('Shift+Tab');
log('3a Shift+Tab 1 space:', JSON.stringify(await sel(p)));

// 3b. Enter auto-indent
await setCode(p, '  <p>salom');
await p.keyboard.press('Enter');
log('3b Enter after indented text:', JSON.stringify(await sel(p)));
await setCode(p, '<div>');
await p.keyboard.press('Enter');
log('3b Enter after <div> (no close):', JSON.stringify(await sel(p)));
await setCode(p, '');
await p.keyboard.type('<div>');   // autoclose → <div>|</div>
await p.keyboard.press('Enter');
log('3b Enter between <div>|</div>:', JSON.stringify(await sel(p)));
// Enter with selection → default browser (replace selection with newline)? oneCaret false → not handled
await setCode(p, 'abc def');
await p.$eval('.hc-code', el => el.setSelectionRange(3, 4));
await p.keyboard.press('Enter');
log('3b Enter with selection:', JSON.stringify(await sel(p)));
// Enter mid-line: indent by current line's leading spaces; text after caret carried
await setCode(p, '    abc|def'.replace('|', ''));
await p.$eval('.hc-code', el => el.setSelectionRange(7, 7));
await p.keyboard.press('Enter');
log('3b Enter mid-line:', JSON.stringify(await sel(p)));
// Enter after `<img src="">` (void, but regex opensTag matches, closesNext false) fine
// Enter after `<p>` when next is `</p>` but on same line with text: `<p>|salom</p>`
await setCode(p, '<p>salom</p>');
await p.$eval('.hc-code', el => el.setSelectionRange(3, 3));
await p.keyboard.press('Enter');
log('3b Enter <p>|salom</p>:', JSON.stringify(await sel(p)));

// 3c. Undo/redo — keyboard vs buttons
await setCode(p, '');
await p.keyboard.type('<h1>');           // autoclose
await p.keyboard.type('Salom');
log('3c typed:', JSON.stringify(await val(p)));
await p.keyboard.press('Control+z');
log('3c Ctrl+Z x1:', JSON.stringify(await val(p)));
await p.keyboard.press('Control+z');
log('3c Ctrl+Z x2:', JSON.stringify(await val(p)));
await p.keyboard.press('Control+y');
log('3c Ctrl+Y:', JSON.stringify(await val(p)));
// button undo
await p.click('.hc-ic[title*="Ctrl+Z"]');
await p.waitForTimeout(50);
log('3c ↶ button:', JSON.stringify(await val(p)), 'focus', await focused());
await p.click('.hc-ic[title*="Ctrl+Y"]');
log('3c ↷ button:', JSON.stringify(await val(p)));
// undo then keep typing → history ok?
await p.click('.hc-ic[title*="Ctrl+Z"]');
await p.keyboard.type('X');
log('3c undo then type X:', JSON.stringify(await sel(p)));
await p.keyboard.press('Control+z');
log('3c Ctrl+Z after:', JSON.stringify(await val(p)));
// Tab then Ctrl+Z
await setCode(p, 'q');
await p.keyboard.press('Tab');
await p.keyboard.press('Control+z');
log('3c Tab then Ctrl+Z:', JSON.stringify(await sel(p)));
// Enter (custom) then Ctrl+Z
await setCode(p, '  q');
await p.keyboard.press('Enter');
await p.keyboard.press('Control+z');
log('3c Enter then Ctrl+Z:', JSON.stringify(await sel(p)));
// autoclose then Ctrl+Z: does it undo whole `></h1>` or just `>`?
await setCode(p, '');
await p.keyboard.type('<h1>');
await p.keyboard.press('Control+z');
log('3c autoclose Ctrl+Z:', JSON.stringify(await sel(p)));
// linked rename then Ctrl+Z
await setCode(p, '');
await p.keyboard.type('<h1>Salom</h1>');
await p.$eval('.hc-code', el => el.setSelectionRange(3, 3));
await p.keyboard.press('Backspace');
await p.keyboard.type('2');
log('3c linked rename h1→h2:', JSON.stringify(await sel(p)));
await p.keyboard.press('Control+z');
log('3c Ctrl+Z after rename:', JSON.stringify(await sel(p)));
await p.keyboard.press('Control+z');
log('3c Ctrl+Z x2 after rename:', JSON.stringify(await sel(p)));

// 3d. Ctrl+A
await setCode(p, 'abc\ndef');
await p.keyboard.press('Control+a');
log('3d Ctrl+A:', JSON.stringify(await sel(p)));

// 3e. Autoclose cases
const cases = [
  ['', '<p>', 'basic'],
  ['', '<br>', 'void br'],
  ['', '<img src="a">', 'void img'],
  ['', '<P>', 'uppercase P'],
  ['', '<p class="x">', 'with attr'],
  ['', '<!-- x -->', 'comment'],
  ['', '<a href="a>b">', 'attr contains > (typing)'],
  ['', '<div><p>', 'nested'],
  ['', '2 > 1', 'plain > math'],
  ['', '<p>a<b>', 'p then <b>'],
];
for (const [pre, typed, name] of cases) {
  await setCode(p, pre);
  await p.keyboard.type(typed);
  log('3e', name, JSON.stringify(await sel(p)));
}
// typing closing tag manually when auto pair exists: <p>a</p|</p>
await setCode(p, '');
await p.keyboard.type('<p>abc</p>');
log('3e manual close over pair:', JSON.stringify(await sel(p)));
// manual close when NO pair after (kid deleted the pair)
await setCode(p, '<p>abc');
await p.keyboard.press('End');
await p.keyboard.type('</p>');
log('3e manual close no pair:', JSON.stringify(await sel(p)));
// `>` typed with caret before existing text: `<p|Salom` → put `></p>` between
await setCode(p, '<pSalom');
await p.$eval('.hc-code', el => el.setSelectionRange(2, 2));
await p.keyboard.type('>');
log('3e > before text:', JSON.stringify(await sel(p)));
// `>` typed when tag started on previous line: `<p\n class="a"|` → inner has \n → regex (\s[^<>]*) matches newline? \s includes \n
await setCode(p, '<p\n  class="a"');
await p.keyboard.type('>');
log('3e > multi-line tag:', JSON.stringify(await sel(p)));
// `>` typed at `<h1>|</h1>` again (already pair)? `<h1></h1` caret before final `>` … typedClose path
await setCode(p, '<h1>x</h1');
await p.keyboard.press('End');
await p.keyboard.type('>');
log('3e finishing </h1|>:', JSON.stringify(await sel(p)));
// `>` typed for  <p>|</p> then user types `<b>` inside → nested pair
// quote autopair in html
await setCode(p, '<a href=');
await p.keyboard.type('"');
log('3e quote in tag:', JSON.stringify(await sel(p)));
await p.keyboard.type('x');
await p.keyboard.type('"');
log('3e quote overtype:', JSON.stringify(await sel(p)));
await setCode(p, '<p>u dedi ');
await p.keyboard.type('"');
log('3e quote in text:', JSON.stringify(await sel(p)));
// quote in text but a `<` exists before `>`?  `<p>1 < 2 dedi "` → lt after gt → in-tag heuristics
await setCode(p, '<p>1 < 2 dedi ');
await p.keyboard.type('"');
log('3e quote after `<` in text (1 < 2):', JSON.stringify(await sel(p)));
// Backspace on empty pair `""` in html
await setCode(p, '<a href=""');
await p.$eval('.hc-code', el => el.setSelectionRange(9, 9));
await p.keyboard.press('Backspace');
log('3e Backspace inside "" (html):', JSON.stringify(await sel(p)));
// Backspace <p>|</p> — does it delete pair? (VS Code doesn't) here?
await setCode(p, '');
await p.keyboard.type('<p>');
await p.keyboard.press('Backspace');
log('3e Backspace after autoclose:', JSON.stringify(await sel(p)));
// linked rename: type into `<h1>` to make `<h1x>`? rename to `h1x`… and closing renamed
await setCode(p, '');
await p.keyboard.type('<div><p>x</p></div>');
await p.$eval('.hc-code', el => el.setSelectionRange(4, 4));
await p.keyboard.type('s');   // <divs>
log('3f linked rename div→divs (nested p inside):', JSON.stringify(await sel(p)));
// linked rename when tag name deleted fully then retyped
await setCode(p, '<p>a</p>');
await p.$eval('.hc-code', el => el.setSelectionRange(2, 2));
await p.keyboard.press('Backspace');
log('3f delete name:', JSON.stringify(await sel(p)));
await p.keyboard.type('h1');
log('3f retype h1:', JSON.stringify(await sel(p)));
// linked rename with two same tags: <p>a</p><p>b</p> rename first
await setCode(p, '<p>a</p><p>b</p>');
await p.$eval('.hc-code', el => el.setSelectionRange(2, 2));
await p.keyboard.type('x');
log('3f rename first of two p:', JSON.stringify(await sel(p)));
// paste multi-line via clipboard: caret ok? (execCommand insertText)
await setCode(p, '');
await p.evaluate(() => document.execCommand('insertText', false, '<ul>\n<li>a</li>\n</ul>'));
log('3g paste:', JSON.stringify(await sel(p)));
// Ctrl+/ comment
await setCode(p, '<p>a</p>\n<p>b</p>');
await p.keyboard.press('Control+A');
await p.keyboard.press('Control+/');
log('3h Ctrl+/ all:', JSON.stringify(await sel(p)));
await p.keyboard.press('Control+A');
await p.keyboard.press('Control+/');
log('3h Ctrl+/ toggle back:', JSON.stringify(await sel(p)));
await p.keyboard.press('Control+z');
log('3h Ctrl+Z after toggle:', JSON.stringify(await val(p)));
// Home/End/PageUp — default. Ctrl+Home
// Delete key with pair? no handling.
// Enter when menu closed but caret at `<h1>|</h1>` typed via menu → open+close → 2 lines
await setCode(p, '');
await p.keyboard.type('<h1');
await p.keyboard.press('Enter');
await p.keyboard.press('Enter');
log('3i menu Enter then Enter:', JSON.stringify(await sel(p)));
// Enter twice quickly with menu open? first Enter accepts, second inside pair
// IME / dead keys — skip
// Escape when no menu → nothing (no blur?)
await setCode(p, 'x');
await p.keyboard.press('Escape');
log('3j Esc no menu focus:', await focused());
log('ERRS', errs);
await b.close();
