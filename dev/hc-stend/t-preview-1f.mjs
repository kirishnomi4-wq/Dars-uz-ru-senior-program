import { open, setCode, shot } from './t-lib.mjs';
const { b, p, errs } = await open();
const cdp = await p.context().newCDPSession(p);
const nav = async () => { const h = await cdp.send('Page.getNavigationHistory'); return { idx: h.currentIndex, n: h.entries.length, urls: h.entries.map(e => e.url.slice(0, 40)) }; };
console.log('start', await nav());
for (let i = 0; i < 3; i++) { await setCode(p, '<h1>Salom ' + i + '</h1>'); await p.waitForTimeout(700); }
console.log('after 3 edits', await nav());
// Har bir keystroke alohida: 10 harf sekin yozamiz (300ms debounce'dan sekin)
await p.click('.hc-code'); await p.keyboard.press('End');
for (const ch of ' qo`shimcha') { await p.keyboard.type(ch); await p.waitForTimeout(450); }
console.log('after 11 slow keys', await nav());
// Top-level back tugmasi (Chrome) — history.back() top oynada
await p.evaluate(() => history.back()); await p.waitForTimeout(1000);
console.log('after history.back() top:', await nav(), 'url', p.url(), 'root', await p.$('.hc-root') ? 'alive' : 'gone', 'frame', p.frames().map(f=>f.url()));
const fr = p.frames().find(f => f.url() === 'about:srcdoc'); console.log('frame text:', fr ? await fr.evaluate(() => document.body.innerText) : null, '| editor:', await p.$eval('.hc-code', e => e.value));
await b.close();
