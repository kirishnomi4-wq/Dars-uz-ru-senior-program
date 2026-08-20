// 1-blok: bo'yash qatlami ↔ textarea sinxron
import { open, geom, setCode, val, shot } from './t-lib.mjs';
const { b, p, errs } = await open();
const log = (...a) => console.log(...a);

log('== baseline geom'); log(JSON.stringify(await geom(p)));

// 1a. Uzun satr → gorizontal scroll
await setCode(p, '<h1>' + 'Salom dunyo '.repeat(40) + '</h1>\n<p>qisqa</p>');
await p.$eval('.hc-code', el => { el.scrollLeft = 300; el.dispatchEvent(new Event('scroll')); });
await p.waitForTimeout(100);
let g = await geom(p); log('1a long line scrollLeft ta/hl:', g.ta.scrollLeft, g.hl.scrollLeft, 'sw:', g.ta.sw, g.hl.sw, 'ws', g.ta.ws, g.hl.ws);
await shot(p, 'e1a-longline.png');

// 1b. Tab belgisi
await setCode(p, '<div>\n\t<p>tab</p>\n\t\t<b>ikki tab</b>\n</div>');
g = await geom(p); log('1b tab-size ta/hl:', g.ta.tab, g.hl.tab, 'sw:', g.ta.sw, g.hl.sw);
await shot(p, 'e1b-tab.png');

// 1c. Emoji / kirill / apostrof / < & escape
const uni = "<h1>Salom 😀 мир o'zbek oʻzbek o’zbek</h1>\n<p>1 < 2 && 3 > 2 &amp; &lt;b&gt;</p>\n<p>emoji 👨‍👩‍👧 zwj</p>";
await setCode(p, uni);
g = await geom(p); log('1c uni sw ta/hl:', g.ta.sw, g.hl.sw, 'sh', g.ta.sh, g.hl.sh);
const hlText = await p.$eval('.hc-hl', el => el.textContent);
const taText = await val(p);
log('1c hl textContent === value+\\n ?', hlText === taText + '\n', JSON.stringify(hlText.slice(0, 200)));
await shot(p, 'e1c-unicode.png');

// pixel-level: measure width of each line in hl vs. textarea via a mirror span
const widths = await p.evaluate(() => {
  const ta = document.querySelector('.hc-code'), hl = document.querySelector('.hc-hl');
  const cs = getComputedStyle(ta);
  const mk = (txt, fam) => { const s = document.createElement('span'); s.style.cssText = `position:absolute;visibility:hidden;white-space:pre;font-family:${fam};font-size:${cs.fontSize};font-feature-settings:${cs.fontFeatureSettings};letter-spacing:${cs.letterSpacing}`; s.textContent = txt; document.body.appendChild(s); const w = s.getBoundingClientRect().width; s.remove(); return w; };
  return ta.value.split('\n').map(l => [l.length, mk(l, cs.fontFamily), mk(l, getComputedStyle(hl).fontFamily)]);
});
log('1c line widths (len, ta-font, hl-font):', JSON.stringify(widths));

// 1d. HL_MAX 20000+
const big = '<p>' + 'x'.repeat(20100) + '</p>';
await setCode(p, big);
await p.waitForTimeout(300);
const hlHtml = await p.$eval('.hc-hl', el => el.innerHTML.slice(0, 80));
log('1d >20000 hl innerHTML head:', hlHtml, ' hasTokens:', hlHtml.includes('<i class'));
const noteTxt = await p.$eval('.hc-msg', el => el.textContent);
log('1d msg area:', JSON.stringify(noteTxt));
await shot(p, 'e1d-hlmax.png');
// exactly at boundary
await setCode(p, '<p>' + 'x'.repeat(19990) + '</p>');
log('1d 19997 chars tokens?', await p.$eval('.hc-hl', el => el.innerHTML.includes('<i class')));

// 1e. Oxirgi bo'sh qator: scroll to bottom, compare scrollHeight
await setCode(p, Array.from({ length: 60 }, (_, i) => `<p>qator ${i + 1}</p>`).join('\n') + '\n');
await p.$eval('.hc-code', el => { el.scrollTop = 99999; el.dispatchEvent(new Event('scroll')); });
await p.waitForTimeout(100);
g = await geom(p); log('1e bottom: ta st', g.ta.scrollTop, 'hl st', g.hl.scrollTop, 'gut st', g.gut.scrollTop, 'sh ta/hl/gut', g.ta.sh, g.hl.sh, g.gut.sh, 'gutlines', g.gut.lines);
await shot(p, 'e1e-bottom.png');
// end of file caret: type at end and check curline vs textarea
await p.keyboard.press('Control+End');
await p.keyboard.type('<b>oxiri</b>');
await p.waitForTimeout(150);
g = await geom(p); log('1e after typing at end: st ta/hl/gut', g.ta.scrollTop, g.hl.scrollTop, g.gut.scrollTop);
const cur = await p.$eval('.hc-curline', el => ({ top: el.style.top, op: el.style.opacity }));
log('1e curline', JSON.stringify(cur));
await shot(p, 'e1e-endtype.png');

// 1f. A-/A+ font sync
await p.click('.hc-sb-btn:last-of-type'); await p.click('.hc-sb-btn:last-of-type'); await p.click('.hc-sb-btn:last-of-type');
await p.waitForTimeout(200);
g = await geom(p); log('1f after A+ x3: fs ta/hl', g.ta.fs, g.hl.fs, 'lh', g.ta.lh, g.hl.lh, 'st', g.ta.scrollTop, g.hl.scrollTop, g.gut.scrollTop, 'gut fs', await p.$eval('.hc-gutter', el => getComputedStyle(el).fontSize));
await shot(p, 'e1f-fontplus.png');
// hcFont persisted?
log('1f hcFont ls:', await p.evaluate(() => localStorage.getItem('hcFont')));
// A- to min / A+ to max bounds
for (let i = 0; i < 10; i++) await p.click('.hc-sb-btn:last-of-type');
log('1f max fs', await p.$eval('.hc-sb-fs', el => el.textContent));
for (let i = 0; i < 20; i++) await p.click('.hc-sb-btn:first-of-type');
log('1f min fs', await p.$eval('.hc-sb-fs', el => el.textContent));

// 1g. hl scroll ONLY synced on textarea scroll event? Test keyboard navigation scroll (arrow down beyond view)
await setCode(p, Array.from({ length: 80 }, (_, i) => `<p>q ${i + 1}</p>`).join('\n'));
await p.$eval('.hc-code', el => { el.setSelectionRange(0, 0); el.scrollTop = 0; });
for (let i = 0; i < 40; i++) await p.keyboard.press('ArrowDown');
await p.waitForTimeout(150);
g = await geom(p); log('1g after 40 ArrowDown: st ta/hl/gut', g.ta.scrollTop, g.hl.scrollTop, g.gut.scrollTop);
await shot(p, 'e1g-arrowscroll.png');

// 1h. Wrap check: does textarea wrap? white-space pre → no wrap. Check `wrap` attr
log('1h textarea wrap attr:', await p.$eval('.hc-code', el => el.getAttribute('wrap')), 'ws', g.ta.ws);

// 1i. Placeholder shows when empty & hl empty
await setCode(p, '');
await p.keyboard.press('Backspace');
log('1i empty: hl html', JSON.stringify(await p.$eval('.hc-hl', el => el.innerHTML)), 'placeholder', await p.$eval('.hc-code', el => el.placeholder));
await shot(p, 'e1i-empty.png');

// 1j. CSS/JS highlight sanity via window.HC.highlight
const hlres = await p.evaluate(() => ({
  css: window.HC.highlight('a{color:red}/* c */ .x:hover{--v:1;}', 'css'),
  css2: window.HC.highlight('@media (max-width:600px){ .a{color:red} }', 'css'),
  css3: window.HC.highlight('a::before{content:"a:b;{}"}', 'css'),
  js: window.HC.highlight('const s = "a\\"b"; // c\nlet x = 1.5e3; /* z */ `t${x}`', 'js'),
  js2: window.HC.highlight('const re = /ab+c/g; x = 5', 'js'),
  html: window.HC.highlight('<a href=x title="a>b">t</a><p class=\'q\'>&amp;</p><script>if(a<b){}</script>', 'html'),
  html2: window.HC.highlight('<img src="a.png" alt=\'q\' />\n<!-- c\n --><br/>', 'html'),
  html3: window.HC.highlight('<h1 title="unclosed>Salom</h1>\n<p>keyingi</p>', 'html'),
}));
for (const [k, v] of Object.entries(hlres)) log('1j', k, v);

log('ERRS', errs);
await b.close();
