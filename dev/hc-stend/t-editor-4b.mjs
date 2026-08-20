import { open, setCode, sel, val } from './t-lib.mjs';
const { b, p } = await open();
const log = (...a) => console.log(...a);
const note = () => p.$eval('.hc-msg', el => el.textContent);
const render = (html) => p.evaluate((h) => { const d = new DOMParser().parseFromString(h, 'text/html'); return d.body.innerText; }, html);
const src = '<p>Salom <b>dunyo</b>. Keyingi gap <a href="#">link</a>!</p>';
const out = await p.evaluate((s) => window.HC.formatHtml(s), src);
log('src render:', JSON.stringify(await render(src)));
log('fmt render:', JSON.stringify(await render(out)));
// wait for note expiry between
for (const [name, code] of [['unclosed', '<div><p>a'], ['pre', '<div><pre>a</pre></div>'], ['empty', ''], ['lone<', '<p>1 < 2</p>'], ['inline', src]]) {
  await setCode(p, code);
  await p.waitForTimeout(2600);
  await p.click('.hc-ic.wide');
  await p.waitForTimeout(120);
  log(name, '→ note:', JSON.stringify(await note()), 'val:', JSON.stringify(await val(p)));
}
// preview shows change? set inline, format, wait, read iframe text
await setCode(p, src);
await p.waitForTimeout(2600);
await p.click('.hc-ic.wide');
await p.waitForTimeout(600);
const fr = p.frames().find(f => f !== p.mainFrame());
log('preview after fmt:', JSON.stringify(await fr.evaluate(() => document.body.innerText)));
await p.screenshot({ path: 'e4-inline-format.png' });
await b.close();
