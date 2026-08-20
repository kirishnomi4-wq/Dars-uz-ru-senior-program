import { open, mount, unmount, setCode, val, chips, state, rerender } from './t-contract-lib.mjs';
const { b, p, take } = await open();
await p.evaluate(() => { const C = window.HC.checks; window.__T = { title:{uz:'UZ',ru:'RU'}, previewCss:'body{background:red}', files:[{name:'index.html',lang:'html',starter:''}], requirements:[{id:'h',label:{uz:'h1 uz',ru:'h1 ru'},check:C.has('h1')},{id:'p',label:'p',hint:{uz:'P-UZ',ru:'P-RU'},check:(x)=>x.$('p')?true:false}] }; });
await mount(p, "({ lang:'uz', task: window.__T })");
console.log('uz:', JSON.stringify(await chips(p)));
await rerender(p, "({ lang:'ru', task: window.__T })"); await p.waitForTimeout(200);
console.log('ru rerender (task barqaror, kod o\'zgarmagan) → chips:', JSON.stringify(await chips(p)), 'title=', (await state(p)).title, 'status=', (await state(p)).status);
await setCode(p, '<i>x</i>'); await p.waitForTimeout(400);
console.log('ru + kod o\'zgardi → chips:', JSON.stringify(await chips(p)));
// previewCss runtime o'zgarishi
const bg1 = await p.$eval('iframe.hc-frame', f => f.getAttribute('srcdoc').includes('background:red'));
await p.evaluate(() => { window.__T2 = { ...window.__T, previewCss: 'body{background:blue}' }; });
await rerender(p, "({ lang:'ru', task: window.__T2 })"); await p.waitForTimeout(600);
const bg2 = await p.$eval('iframe.hc-frame', f => f.getAttribute('srcdoc').includes('background:blue'));
console.log('previewCss red→blue rerender: oldin red=', bg1, 'keyin blue=', bg2);
await setCode(p, '<i>y</i>'); await p.waitForTimeout(600);
console.log('   kod o\'zgargach blue=', await p.$eval('iframe.hc-frame', f => f.getAttribute('srcdoc').includes('background:blue')));
// files runtime almashsa: index.html → app.js (task almashdi, unmount yo'q)
await p.evaluate(() => { window.__T3 = { title:'T3', files:[{name:'app.js',lang:'js',starter:'// js'}], requirements:[] }; });
await rerender(p, "({ lang:'ru', task: window.__T3 })"); await p.waitForTimeout(300);
const s = await state(p); console.log('files almashdi (unmount yo\'q): tabs=', s.tabs, 'active tab soni=', await p.$$eval('.hc-tab.active', e => e.length), 'kod=', JSON.stringify(await val(p)), 'console=', s.console, 'sb-file=', await p.$eval('.hc-sb-file', e => e.textContent));
await setCode(p, 'console.log(9)'); await p.waitForTimeout(600);
console.log('   yozildi → sb-file=', await p.$eval('.hc-sb-file', e => e.textContent), 'preview srcdoc ichida console.log(9)=', await p.$eval('iframe.hc-frame', f => f.getAttribute('srcdoc').includes('console.log(9)')), take());
await b.close();
