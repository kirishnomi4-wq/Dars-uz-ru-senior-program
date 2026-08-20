import { open, geom, setCode, shot } from './t-lib.mjs';
const { b, p, errs } = await open();
// long lines + many lines → both scrollbars in textarea
await setCode(p, Array.from({ length: 60 }, (_, i) => `<p>qator ${i + 1} ${'uzun matn '.repeat(i % 7 === 0 ? 20 : 1)}</p>`).join('\n'));
let g = await geom(p);
console.log('clientH ta/hl', g.ta.ch, g.hl.ch, 'clientW', g.ta.cw, g.hl.cw, 'sh', g.ta.sh, g.hl.sh, 'sw', g.ta.sw, g.hl.sw);
await p.$eval('.hc-code', el => { el.scrollTop = 99999; el.dispatchEvent(new Event('scroll')); });
await p.waitForTimeout(100);
g = await geom(p);
console.log('bottom: st ta/hl/gut', g.ta.scrollTop, g.hl.scrollTop, g.gut.scrollTop);
await shot(p, 'e1k-scrollbar-bottom.png');
await p.$eval('.hc-code', el => { el.scrollLeft = 99999; el.dispatchEvent(new Event('scroll')); });
await p.waitForTimeout(100);
g = await geom(p);
console.log('right: sl ta/hl', g.ta.scrollLeft, g.hl.scrollLeft);
await shot(p, 'e1k-scrollbar-right.png');
// caret at last line — is it hidden behind the horizontal scrollbar?
await p.keyboard.press('Control+End');
await p.waitForTimeout(100);
const box = await p.$eval('.hc-code', el => { const r = el.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, ch: el.clientHeight, oh: el.offsetHeight, st: el.scrollTop, sh: el.scrollHeight }; });
console.log('box', JSON.stringify(box));
const cur = await p.$eval('.hc-curline', el => el.style.top);
console.log('curline top', cur);
await shot(p, 'e1k-caret-end.png');
console.log('ERRS', errs);
await b.close();
