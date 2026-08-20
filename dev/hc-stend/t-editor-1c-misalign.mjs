import { open, geom, setCode, shot } from './t-lib.mjs';
const { b, p } = await open();
await setCode(p, Array.from({ length: 40 }, (_, i) => `<p>qator ${i + 1}${i === 0 ? ' ' + 'juda uzun matn '.repeat(20) : ''}</p>`).join('\n'));
await p.click('.hc-code');
const r = await p.$eval('.hc-code', el => el.getBoundingClientRect());
await p.mouse.move(r.x + 200, r.y + 200);
for (let i = 0; i < 12; i++) { await p.mouse.wheel(0, 200); await p.waitForTimeout(30); }
await p.waitForTimeout(300);
const g = await geom(p);
console.log('after wheel: st ta/hl/gut', g.ta.scrollTop, g.hl.scrollTop, g.gut.scrollTop, 'ch ta/hl', g.ta.ch, g.hl.ch, 'sh', g.ta.sh, g.hl.sh);
await p.$eval('.hc-code', el => { el.style.color = 'rgba(255,255,255,.75)'; });
const w = await p.$eval('.hc-editor-wrap', el => el.getBoundingClientRect());
await p.screenshot({ path: 'e1k-misalign-crop.png', clip: { x: w.x, y: w.bottom - 140, width: 420, height: 140 } });
await b.close();
