import { open, setCode, shot } from './t-lib.mjs';
let { b, p, errs } = await open();
const mount = (mode) => p.evaluate((mode) => { window.unmountHC(); return window.mountHC({ lang: 'uz', task: { title: 't', files: [
  { name: 'index.html', lang: 'html', starter: '<button id="b">Bos</button><p id="o"></p>' },
  { name: 'script.js', lang: 'js', starter: '' } ],
  requirements: [ mode === 'decl' ? { id: 'r1', label: 'log 5', check: { logs: 5 } } : { id: 'r1', label: 'log 5', check: window.HC.checks.logs(5) } ] } }); }, mode);
for (const mode of ['decl', 'fn']) {
  await mount(mode); await p.waitForSelector('.hc-code'); await p.waitForTimeout(300);
  await p.click('.hc-tab:has-text("script.js")'); await setCode(p, 'console.log(5)'); await p.waitForTimeout(1500);
  console.log(mode, 'chip:', await p.$$eval('.hc-chip', e => e.map(x => x.className)), 'iframes:', await p.$$eval('iframe', e => e.length), 'errs', errs.splice(0));
  if (mode === 'fn') {
    await setCode(p, 'console.log(5); while(true){}'); await p.waitForTimeout(1500);
    console.log('  after hang (no run): chip', await p.$$eval('.hc-chip', e => e.map(x => x.className)));
    await setCode(p, 'console.log(5)'); await p.waitForTimeout(6000);
    console.log('  after fix 6s: chip', await p.$$eval('.hc-chip', e => e.map(x => x.className)));
    await setCode(p, 'console.log(7)'); await p.waitForTimeout(3000);
    console.log('  after wrong value 3s: chip', await p.$$eval('.hc-chip', e => e.map(x => x.className)));
  }
}
await b.close();
