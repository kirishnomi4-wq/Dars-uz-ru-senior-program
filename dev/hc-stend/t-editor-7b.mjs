import { open } from './t-lib.mjs';
const { b, p } = await open();
await p.click('.hc-title');
const seq = [];
for (let i = 0; i < 12; i++) {
  await p.keyboard.press('Tab');
  seq.push(await p.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return (a.className || a.tagName).toString().slice(0, 18) + '|' + cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor; }));
  if (i === 1) await p.screenshot({ path: 'e7-focusring-undo.png', clip: { x: 30, y: 255, width: 660, height: 45 } });
}
console.log(JSON.stringify(seq, null, 0));
// how to escape textarea with keyboard? test Escape then Tab
await p.click('.hc-code');
await p.keyboard.press('Escape'); await p.keyboard.press('Tab');
console.log('Esc+Tab from textarea →', await p.evaluate(() => document.activeElement.className));
await p.keyboard.press('Control+Tab');
console.log('Ctrl+Tab →', await p.evaluate(() => document.activeElement.className));
await b.close();
