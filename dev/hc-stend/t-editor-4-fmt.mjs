import { open, setCode, sel, val } from './t-lib.mjs';
const { b, p, errs } = await open();
const log = (...a) => console.log(...a);
const F = (s) => p.evaluate((s) => window.HC.formatHtml(s), s);
const cases = {
  basic: '<div><h1>Salom</h1><p>matn</p></div>',
  nested_ul: '<ul><li>a</li><li>b</li></ul>',
  pre: '<div><pre>  x\n y</pre></div>',
  textarea: '<textarea>  a</textarea>',
  inline: '<p>Salom <b>dunyo</b> va <a href="#">link</a>!</p>',
  inline2: '<p>Salom <b>dunyo</b>. Keyingi gap.</p>',
  comment: '<!-- izoh --><div><p>a</p></div>',
  attr_gt: '<a href="x" title="a > b">t</a>',
  attr_lt: '<a title="a < b">t</a>',
  unclosed: '<div><p>a',
  broken: '<div><p>a</div>',
  doctype: '<!DOCTYPE html><html><head><title>t</title></head><body><p>a</p></body></html>',
  selfclose: '<img src="a" /><br/><input type="text">',
  already: '<div>\n  <p>a</p>\n</div>',
  spaces_matter: '<p>a</p> <p>b</p>',
  text_ws: '<p>a   b\n c</p>',
  script: '<script>if(a<b){x=1}</script>',
  style: '<style>p{color:red}</style>',
  entity: '<p>&lt;div&gt; &amp;</p>',
  emptyp: '<p></p><div></div>',
  long: '<p>' + 'a'.repeat(120) + '</p>',
  uppercase: '<DIV><P>a</P></DIV>',
  mixedcase: '<div><P>a</p></DIV>',
  extraclose: '<p>a</p></p>',
  lone_lt: '<p>1 < 2</p>',
  ul_inline_text: '<ul><li>a<b>x</b></li></ul>',
  span_line: '<div><span>a</span><span>b</span></div>',
  button_only: '<button>Bos</button>',
  cyr: '<h1>Привет</h1><p>o\'zbek</p>',
  br_in_p: '<p>a<br>b</p>',
};
for (const [k, s] of Object.entries(cases)) {
  const r = await F(s);
  log('4:', k, '→', r === null ? 'NULL' : JSON.stringify(r));
}
// UI: note message on null / already; undo after format; caret/scroll
await setCode(p, '<div><p>a</p></div>');
await p.click('.hc-ic.wide');
await p.waitForTimeout(100);
log('4u after Krasivo:', JSON.stringify(await sel(p)), 'note', JSON.stringify(await p.$eval('.hc-msg', el => el.textContent)));
await p.keyboard.press('Control+z');
log('4u Ctrl+Z after Krasivo:', JSON.stringify(await sel(p)));
await p.click('.hc-ic.wide'); await p.click('.hc-ic.wide');
await p.waitForTimeout(100);
log('4u note on already:', JSON.stringify(await p.$eval('.hc-msg', el => el.textContent)));
await setCode(p, '<div><p>a');
await p.click('.hc-ic.wide');
await p.waitForTimeout(100);
log('4u note on unclosed:', JSON.stringify(await p.$eval('.hc-msg', el => el.textContent)));
await setCode(p, '<div><pre>a</pre></div>');
await p.click('.hc-ic.wide');
await p.waitForTimeout(100);
log('4u note on pre:', JSON.stringify(await p.$eval('.hc-msg', el => el.textContent)));
await setCode(p, '<p>Salom <b>dunyo</b> va boshqa</p>');
await p.click('.hc-ic.wide');
await p.waitForTimeout(100);
log('4u inline note:', JSON.stringify(await p.$eval('.hc-msg', el => el.textContent)), JSON.stringify(await val(p)));
// note disappears in 2.4s; also, does note override syntax error display?
// scroll: long doc, scroll to bottom, Krasivo → where?
await setCode(p, Array.from({ length: 50 }, (_, i) => `<div><p>q${i}</p></div>`).join(''));
await p.click('.hc-ic.wide');
await p.waitForTimeout(150);
const g = await p.$eval('.hc-code', el => ({ st: el.scrollTop, s: el.selectionStart, lines: el.value.split('\n').length }));
log('4u after format long: ', JSON.stringify(g), 'focus', await p.evaluate(() => document.activeElement.className));
// caret preservation: caret at line 5, format → caret 0?
await setCode(p, '<div><p>a</p><p>b</p></div>');
await p.$eval('.hc-code', el => el.setSelectionRange(14, 14));
await p.click('.hc-ic.wide');
await p.waitForTimeout(100);
log('4u caret after fmt:', JSON.stringify(await sel(p)));
// Krasivo button hidden in css tab — later. Krasivo with empty code
await setCode(p, '');
await p.click('.hc-ic.wide');
await p.waitForTimeout(100);
log('4u empty note:', JSON.stringify(await p.$eval('.hc-msg', el => el.textContent)));
log('ERRS', errs);
await b.close();
