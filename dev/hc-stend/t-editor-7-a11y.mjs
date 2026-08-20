import { open, setCode, sel } from './t-lib.mjs';
const { b, p, errs } = await open();
const log = (...a) => console.log(...a);
// 7a status bar cyrillic / emoji / tab
await setCode(p, '<p>Привет</p>');
await p.keyboard.press('End');
log('7a cyr end col:', await p.$eval('.hc-sb-pos', e => e.textContent), 'len', (await sel(p)).s);
await setCode(p, '<p>😀 a</p>');
await p.$eval('.hc-code', el => el.setSelectionRange(5, 5)); // after emoji
await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowLeft');
log('7a after emoji (visual col 5):', await p.$eval('.hc-sb-pos', e => e.textContent), 'sel', (await sel(p)).s);
await setCode(p, '\tx');
await p.keyboard.press('End');
log('7a tab char col:', await p.$eval('.hc-sb-pos', e => e.textContent));
// status after mouse click on gutter? gutter pointer-events none.
// 7b status update on mouse click position
await setCode(p, 'abc\ndef\nghi');
await p.$eval('.hc-code', el => el.setSelectionRange(5, 5));
await p.mouse.click(300, 400); // click somewhere in editor → sets caret at end of nearest line
await p.waitForTimeout(80);
log('7b after mouse click:', await p.$eval('.hc-sb-pos', e => e.textContent), JSON.stringify(await sel(p)));
// 7c a11y attributes
const attrs = await p.evaluate(() => [...document.querySelectorAll('.hc-root button')].map(b => ({ cls: b.className.split(' ')[0], txt: b.textContent.trim().slice(0, 14), type: b.getAttribute('type'), aria: b.getAttribute('aria-label'), title: !!b.getAttribute('title') })));
log('7c buttons:', JSON.stringify(attrs));
log('7c textarea aria-label:', await p.$eval('.hc-code', e => e.getAttribute('aria-label')), 'label?', await p.evaluate(() => !!document.querySelector('label[for]')));
log('7c iframe title:', await p.$eval('.hc-frame', e => e.title));
// focus ring: Tab through elements from body start; check outline on focused
await p.evaluate(() => document.body.focus());
const seq = [];
for (let i = 0; i < 12; i++) {
  await p.keyboard.press('Tab');
  seq.push(await p.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return (a.className || a.tagName).toString().slice(0, 20) + '|' + cs.outlineStyle + ' ' + cs.outlineWidth; }));
}
log('7c tab order + outline:', JSON.stringify(seq));
// Does Tab from textarea escape? (Already: no) — Esc from textarea → blur? no
// menu role/aria
await p.click('.hc-code'); await p.keyboard.press('Control+End'); await p.keyboard.type('\n<');
log('7c menu aria:', await p.evaluate(() => { const m = document.querySelector('.hc-menu'); return { role: m.getAttribute('role'), rowRole: m.querySelector('.hc-menu-row').getAttribute('role'), taActiveDesc: document.querySelector('.hc-code').getAttribute('aria-activedescendant'), taExpanded: document.querySelector('.hc-code').getAttribute('aria-expanded'), taRole: document.querySelector('.hc-code').getAttribute('role') }; }));
// Menu row focusable buttons: Tab key while menu open selects (handled). ok
// 7d: hint chips titles; error button title ✓
// 7e: prefers-reduced-motion? skip
// 7f: `hc-code` spellcheck false ✓; autocomplete? 
log('7f textarea attrs:', await p.$eval('.hc-code', e => ({ sc: e.spellcheck, ac: e.getAttribute('autocomplete'), acap: e.getAttribute('autocapitalize'), acor: e.getAttribute('autocorrect'), wrap: e.wrap })));
// 7g: keyboard Esc from menu then Esc again? nothing. Esc when reset armed? no.
// 7h: focus after clicking Krasivo — focus goes textarea ✓ (prettify focuses). After A+ (mousedown prevented) focus stays.
await p.click('.hc-code');
await p.click('.hc-sb-btn:last-of-type');
log('7h focus after A+:', await p.evaluate(() => document.activeElement.className));
// 7i: undo button when textarea not focused: focus + undo → OK. But when nothing typed yet, execCommand undo could undo... nothing.
// 7j: keyboard shortcuts hints: title on ↶ ✓
log('ERRS', errs);
await b.close();
