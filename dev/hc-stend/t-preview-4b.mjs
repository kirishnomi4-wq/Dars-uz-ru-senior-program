import { open, setCode, shot } from './t-lib.mjs';
let { b, p, errs, ctx } = await open();
const popups = []; ctx.on('page', async pg => { popups.push('popup'); try { await pg.waitForLoadState().catch(()=>{}); popups[popups.length-1] = 'popup:' + pg.url(); } catch {} });
const getFrame = (p) => p.frames().find(f => f.url().startsWith('about:srcdoc') && f.parentFrame() === p.mainFrame());
await setCode(p, '<a id=a href="#pastki">Pastga</a>' + '<p>x</p>'.repeat(100) + '<h2 id="pastki">Pastki</h2>'); await p.waitForTimeout(800);
await getFrame(p).click('#a'); await p.waitForTimeout(1200);
console.log('anchor #: popups', popups, '| frame url', getFrame(p) && getFrame(p).url(), 'scrollY', await getFrame(p).evaluate(() => scrollY));
popups.length = 0;
await setCode(p, '<a id=a href="page2.html">2-sahifa</a>'); await p.waitForTimeout(800); await getFrame(p).click('#a'); await p.waitForTimeout(1200);
console.log('relative link: popups', popups);
popups.length = 0;
await setCode(p, '<a id=a href="https://example.com" target="_self">self</a>'); await p.waitForTimeout(800); await getFrame(p).click('#a'); await p.waitForTimeout(1500);
console.log('_self ext link: popups', popups, 'frames', p.frames().map(f=>f.url()));
// RU til: IMG_FALLBACK va console-empty
await p.evaluate(() => { window.unmountHC(); window.mountHC({ lang: 'ru' }); }); await p.waitForSelector('.hc-code'); 
await setCode(p, '<img src="x.png" alt="Яблоко">'); await p.waitForTimeout(1000);
console.log('RU fallback:', await getFrame(p).evaluate(() => document.querySelector('.hc-imgfb').innerText.replace(/\n/g,' / ')), '| html lang=', await getFrame(p).evaluate(() => document.documentElement.lang));
await b.close();
