import { open, setCode, sel, val, shot } from './t-lib.mjs';
const { b, p, errs } = await open();
const log = (...a) => console.log(...a);
// 8a Davom etish activation + payload
log('8a next disabled initially:', await p.$eval('.hc-next', e => e.disabled), 'title', await p.$eval('.hc-next', e => e.title));
await setCode(p, '<h1>Salom</h1>\n<p>Matn</p>\n<img src="a.png" alt="rasm">');
await p.waitForTimeout(1000);
log('8a next after all:', await p.$eval('.hc-next', e => e.disabled), 'status', await p.$eval('.hc-status', e => e.textContent));
await p.click('.hc-next');
log('8a events:', await p.evaluate(() => window.__events));
await p.click('.hc-ghost:has-text("Orqaga")');
log('8a events after back:', await p.evaluate(() => window.__events));
// syntax blocked
await setCode(p, '<h1>Salom</h1>\n<p>Matn</p>\n<img src="a.png" alt="rasm">\n<div>');
await p.click('.hc-title'); // blur → tailTyping false
await p.waitForTimeout(1200);
log('8a syntax blocked: disabled', await p.$eval('.hc-next', e => e.disabled), 'title', await p.$eval('.hc-next', e => e.title), 'msg', await p.$eval('.hc-msg', e => e.textContent), 'status', await p.$eval('.hc-status', e => e.textContent));
// 8b menu x with emoji/cyrillic/tab before caret
for (const pre of ['<p>😀😀😀😀😀😀 ', '<p>Привет мир ', '\t\t\t\t', '<p>abcdefghijkl ']) {
  await setCode(p, pre);
  await p.keyboard.type('<');
  await p.waitForTimeout(80);
  const r = await p.evaluate(() => {
    const m = document.querySelector('.hc-menu'); const ta = document.querySelector('.hc-code'); const box = document.querySelector('.hc-code-box').getBoundingClientRect();
    // measure real caret x with mirror span
    const cs = getComputedStyle(ta); const s = document.createElement('span'); s.style.cssText = `position:absolute;visibility:hidden;white-space:pre;font-family:${cs.fontFamily};font-size:${cs.fontSize};tab-size:2;font-feature-settings:${cs.fontFeatureSettings}`; s.textContent = ta.value.slice(0, ta.selectionStart); document.body.appendChild(s); const w = s.getBoundingClientRect().width; s.remove();
    return { menuX: m ? Math.round(m.getBoundingClientRect().left - box.left) : null, caretX: Math.round(12 + w) };
  });
  log('8b menu x vs caret x', JSON.stringify(pre), JSON.stringify(r));
  await p.keyboard.press('Escape');
}
await shot(p, 'e8b-menu-x.png');
// 8c perf: 15k doc typing latency
await setCode(p, Array.from({ length: 400 }, (_, i) => `<p class="c${i}">qator ${i} matn</p>`).join('\n'));
await p.keyboard.press('Control+End');
const t0 = Date.now();
for (let i = 0; i < 20; i++) await p.keyboard.type('a');
const dt = (Date.now() - t0) / 20;
log('8c ms/keystroke @', (await val(p)).length, 'chars:', dt.toFixed(1));
const long = await p.evaluate(() => { const t = performance.now(); window.HC.highlight(document.querySelector('.hc-code').value, 'html'); return (performance.now() - t).toFixed(2); });
log('8c highlight() ms:', long);
// 8d: HL_MAX crossing during typing — no message
await setCode(p, '<p>' + 'y'.repeat(19995));
log('8d 19998 tokens?', await p.$eval('.hc-hl', e => e.innerHTML.includes('<i')));
await p.keyboard.press('Control+End'); await p.keyboard.type('zzz');
log('8d 20001 tokens?', await p.$eval('.hc-hl', e => e.innerHTML.includes('<i')), 'msg', JSON.stringify(await p.$eval('.hc-msg', e => e.textContent)));
// 8e: menu when caret in the middle of typed tag with text after: `<h|>` (existing >): typing h inside `<>`?
await p.keyboard.press('Escape'); await setCode(p, '<>');
await p.$eval('.hc-code', el => el.setSelectionRange(1, 1));
await p.keyboard.type('h');
log('8e `<h|>` menu?', !!(await p.$('.hc-menu')));
await p.keyboard.press('Enter');
log('8e Enter →', JSON.stringify(await sel(p))); await p.keyboard.press('Escape');
// 8f: Enter accepting menu when caret has text right after: `<h1|abc`
await setCode(p, '<h1abc');
await p.$eval('.hc-code', el => el.setSelectionRange(3, 3));
await p.keyboard.press('ArrowLeft'); await p.keyboard.press('ArrowRight');
log('8f `<h1|abc` menu?', !!(await p.$('.hc-menu'))); await p.keyboard.press('Escape');
// 8g: Ctrl+/ on HTML with menu open? skip. Ctrl+/ on empty line
await setCode(p, '');
await p.keyboard.press('Control+/');
log('8g Ctrl+/ empty:', JSON.stringify(await sel(p)));
// 8h: Krasivo when active is css → button hidden ✓; test 'Zanovo' when reset armed and Esc? no
// 8i: A+ changes -> menu open position recalculated? charW reset ✓
// 8j: gutter width with 100+ lines: does gutter grow and does textarea shift → hl still aligned (both in same box) ✓ by structure
await setCode(p, Array.from({ length: 120 }, (_, i) => `<p>${i}</p>`).join('\n'));
log('8j gutter w:', await p.$eval('.hc-gutter', e => e.getBoundingClientRect().width));
// 8k: paste text with \r\n (Windows clipboard) → line count/gutter?
await setCode(p, '');
await p.evaluate(() => document.execCommand('insertText', false, 'a\r\nb\r\nc'));
log('8k CRLF value:', JSON.stringify(await val(p)), 'gutter lines', await p.$eval('.hc-gutter', e => e.textContent.split('\n').length));
// 8l: word wrap? long line and reading: user must scroll horizontally — noted.
// 8m: double-click selects word; then typing `"` in html text — oneCaret false → default. fine
// 8n: keyboard Ctrl+Z when nothing typed → what happens? (React controlled) value stays
log('ERRS', errs);
await b.close();
