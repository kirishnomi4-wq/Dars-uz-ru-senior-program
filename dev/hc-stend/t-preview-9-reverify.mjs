import { open, setCode, shot } from './t-lib.mjs';
let { b, p, errs, ctx } = await open();
const popups = []; ctx.on('page', async pg => { await pg.waitForLoadState().catch(()=>{}); popups.push(pg.url()); });
const child = () => p.frames().find(f => f.parentFrame() === p.mainFrame());
await setCode(p, '<nav><a id=a href="#bolim2">2-bo\'lim</a></nav>' + '<p>...</p>'.repeat(60) + '<h2 id="bolim2">2-bo\'lim</h2>'); await p.waitForTimeout(800);
await child().click('#a'); await p.waitForTimeout(1500); console.log('R1 anchor → yangi tab:', popups, '| frame scrollY:', await child().evaluate(() => scrollY));
await shot(p, 'shot-anchor.png');
// </script> qayta
await p.evaluate(() => { window.unmountHC(); window.mountHC({ lang: 'uz', task: { title: 't', files: [ { name: 'index.html', lang: 'html', starter: '<p id=o>x</p>' }, { name: 'app.js', lang: 'js', starter: '' } ], requirements: [] } }); }); await p.waitForSelector('.hc-code'); await p.click('.hc-tab:has-text("app.js")');
await setCode(p, 'document.getElementById("o").innerHTML = "<b>qalin</b>"; console.log("</script>")'); await p.click('.hc-mini'); await p.waitForTimeout(900);
console.log('R2 </script>:', await p.$$eval('.hc-console-line', e => e.map(x => x.textContent)), '| frame:', JSON.stringify(await child().evaluate(() => document.body.innerText)));
await shot(p, 'shot-script-inject.png');
// 200 cap qayta + auto-scroll
await setCode(p, 'for(let i=1;i<=500;i++)console.log("qator",i)'); await p.click('.hc-mini'); await p.waitForTimeout(1200);
console.log('R3 500 log:', await p.$eval('.hc-console-body', e => ({ n: e.querySelectorAll('.hc-console-line').length, last: e.lastElementChild.textContent, scrollTop: e.scrollTop })));
// Error obyekt qayta
await setCode(p, 'try { JSON.parse("{bad") } catch(e) { console.error(e); console.log("xato:", e) }'); await p.click('.hc-mini'); await p.waitForTimeout(700);
console.log('R4 Error obj:', await p.$$eval('.hc-console-line', e => e.map(x => x.textContent)));
await b.close();
