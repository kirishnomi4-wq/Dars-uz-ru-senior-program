// K-C-06 batafsil: iframe ichidagi @import so'rovi bormi; oflayn (abort) va SEKIN (4 s) tarmoqda preview/tekshiruv holati
import { open, chips } from './tc-lib.mjs';
const { b, p, log } = await open();
const reqs = [];
p.on('request', r => { const u = r.url(); if (/tc-imp|example\.invalid/.test(u)) reqs.push((r.frame() === p.mainFrame() ? 'TOP' : 'iframe') + ':' + u.replace('http://127.0.0.1:4517', '')); });
const TASK = (css) => ({ title: 't', files: [{ name: 'index.html', lang: 'html', starter: '<h1>salom</h1>' }, { name: 'style.css', lang: 'css', starter: css }], requirements: [{ css: { sel: 'h1', prop: 'margin' } }] });
const mountT = async (task, key) => { await p.evaluate(({ task, key }) => { localStorage.clear(); try { window.unmountHC(); } catch {} document.getElementById('root').innerHTML = ''; window.mountHC({ task, storageKey: key }); }, { task, key }); await p.waitForSelector('.hc-root textarea.hc-code'); };
const previewH1 = async () => { for (const f of p.frames()) { if (f === p.mainFrame()) continue; try { const t = await f.evaluate(() => { const h = document.querySelector('h1'); return h ? h.textContent + '|' + getComputedStyle(h).color : null; }); if (t) return t; } catch {} } return null; };

reqs.length = 0;
await mountT(TASK('@import url("http://127.0.0.1:4517/tc-imp-a.css");\nh1{margin:0}'), 'a'); await p.waitForTimeout(1200);
console.log('[A] so\'rovlar: ' + JSON.stringify(reqs) + ' · preview h1=' + JSON.stringify(await previewH1()));

// oflayn: abort
await p.route(/tc-imp|example\.invalid/, r => r.abort('internetdisconnected'));
reqs.length = 0; log.length = 0;
await mountT(TASK('@import url("http://127.0.0.1:4517/tc-imp-a.css");\n@import url("https://example.invalid/x.css");\nh1{margin:0;color:red}'), 'b'); await p.waitForTimeout(1500);
console.log('[B oflayn/abort] so\'rovlar=' + reqs.length + ' · preview h1=' + JSON.stringify(await previewH1()) + ' · chip=' + (await chips(p))[0]?.ok + ' · hung=' + (await p.$('.hc-hung') ? 'BOR' : 'yo\'q') + ' · pageerr=' + log.filter(l => /PAGEERROR/.test(l)).length);
await p.unroute(/tc-imp|example\.invalid/);

// SEKIN: 4 s kechikish
await p.route(/tc-imp/, async r => { await new Promise(res => setTimeout(res, 4000)); r.fulfill({ status: 200, contentType: 'text/css', body: 'h1{color:rgb(1,2,3)}' }); });
reqs.length = 0;
const t0 = Date.now();
await mountT(TASK('@import url("http://127.0.0.1:4517/tc-imp-a.css");\nh1{margin:0;color:red}'), 'c');
const samples = [];
for (const ms of [300, 1200, 2500, 4800, 6500]) { await p.waitForTimeout(ms - (Date.now() - t0) > 0 ? ms - (Date.now() - t0) : 0); samples.push(`${ms}ms: h1=${JSON.stringify(await previewH1())} chip=${(await chips(p))[0]?.ok} hung=${(await p.$('.hc-hung')) ? 'BOR' : '-'}`); }
console.log('[C sekin 4s]\n  ' + samples.join('\n  ') + '\n  so\'rovlar=' + JSON.stringify(reqs));
await b.close();
