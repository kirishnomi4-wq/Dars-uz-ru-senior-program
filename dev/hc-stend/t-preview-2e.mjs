import { open, setCode, shot } from './t-lib.mjs';
let { b, p, errs } = await open();
await p.evaluate(() => { window.unmountHC(); return window.mountHC({ lang: 'uz', task: { title: 't', files: [
  { name: 'index.html', lang: 'html', starter: '<p id="o"></p>' }, { name: 'script.js', lang: 'js', starter: '' } ],
  requirements: [ { id: 'r1', label: 'log 5', check: window.HC.checks.logs(5) } ] } }); });
await p.waitForSelector('.hc-code'); await p.click('.hc-tab:has-text("script.js")'); await p.click('.hc-code');
const cdp = await p.context().newCDPSession(p);
for (const ch of 'let i=0;\nwhile(i<3){') { await p.keyboard.type(ch); await p.waitForTimeout(120); }
console.log('value after typing `{`:', JSON.stringify(await p.$eval('.hc-code', e => e.value)));
await p.waitForTimeout(1200);
console.log('chip', await p.$$eval('.hc-chip', e => e.map(x => x.className)));
for (const ch of '\nconsole.log(5);\n}') { await p.keyboard.type(ch); await p.waitForTimeout(120); }
console.log('value:', JSON.stringify(await p.$eval('.hc-code', e => e.value)));
await p.waitForTimeout(2000);
// endi i++ qo'shamiz
await p.keyboard.press('ArrowUp'); await p.keyboard.press('End'); await p.keyboard.type('\ni++;'); await p.waitForTimeout(150);
console.log('final value:', JSON.stringify(await p.$eval('.hc-code', e => e.value)));
await p.waitForTimeout(6000);
console.log('chip after fix 6s:', await p.$$eval('.hc-chip', e => e.map(x => x.className)));
// pane bar / status
console.log('status:', await p.$eval('.hc-status', e => e.textContent), '| bar:', await p.$eval('.hc-preview-pane .hc-pane-bar', e => e.textContent));
await b.close();
