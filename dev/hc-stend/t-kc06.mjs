// K-C-06 (+K-P-25/K-K-24): o'quvchi CSS'idagi @import — tarmoq so'rovi qayerdan, necha marta; modul Google Fonts; oflayn holat
import { open, chips } from './tc-lib.mjs';
const { b, p, log } = await open();
const reqs = [];
p.on('request', r => { const u = r.url(); if (/tc-imp|fonts\.g|example\.invalid|127\.0\.0\.1:4517\/(a|b)\.css/.test(u)) reqs.push({ u: u.replace('http://127.0.0.1:4517', ''), top: r.frame() === p.mainFrame(), type: r.resourceType() }); });
const CSS = '@import url("http://127.0.0.1:4517/tc-imp-a.css");\nh1{margin:0}';
const TASK = (css) => ({ title: 't', files: [{ name: 'index.html', lang: 'html', starter: '<h1>salom</h1>' }, { name: 'style.css', lang: 'css', starter: css }], requirements: [{ css: { sel: 'h1', prop: 'margin' } }] });
const mountT = async (task, key) => { await p.evaluate(({ task, key }) => { localStorage.clear(); try { window.unmountHC(); } catch {} document.getElementById('root').innerHTML = ''; window.mountHC({ task, storageKey: key }); }, { task, key }); await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(600); };
const summary = () => { const top = reqs.filter(r => r.top && /tc-imp/.test(r.u)).length, fr = reqs.filter(r => !r.top && /tc-imp/.test(r.u)).length, gf = reqs.filter(r => /fonts\.g/.test(r.u)).length; return `@import: top-level=${top} iframe=${fr} · googleFonts=${gf}`; };

// [A] mount + 5 ta probel: @import so'rovlari qayerdan?
reqs.length = 0;
await mountT(TASK(CSS), 'kc06');
console.log('[A mount] ' + summary());
await p.click('.hc-panetabs button:nth-child(2)').catch(() => {});
await p.$$eval('.hc-tab', els => { const t = els.find(e => /style\.css/.test(e.textContent)); if (t) t.click(); });
await p.click('.hc-code'); await p.keyboard.press('End');
for (let i = 0; i < 5; i++) { await p.keyboard.type(' '); await p.waitForTimeout(250); }
await p.waitForTimeout(800);
console.log('[A +5 probel] ' + summary() + '  → chip=' + JSON.stringify((await chips(p))[0]?.ok));

// [B] Google Fonts: 3 marta mount
reqs.length = 0;
for (let i = 0; i < 3; i++) await mountT(TASK('h1{margin:0}'), 'kc06b');
console.log('[B 3× mount] googleFonts so\'rovlari=' + reqs.filter(r => /fonts\.g/.test(r.u)).length + ' (' + reqs.filter(r => /fonts\.g/.test(r.u)).map(r => (r.top ? 'top' : 'iframe')).join(',') + ')');

// [C] OFLAYN: hamma tashqi so'rov abort → preview va chip tirikmi?
await p.route(/tc-imp|fonts\.g|example\.invalid/, r => r.abort('internetdisconnected'));
reqs.length = 0; log.length = 0;
await mountT(TASK('@import url("http://127.0.0.1:4517/tc-imp-a.css");\n@import url("https://example.invalid/x.css");\nh1{margin:0;color:red}'), 'kc06c');
await p.waitForTimeout(1500);
const previewOk = await p.evaluate(() => { const f = document.querySelector('.hc-root iframe'); try { const h = f && f.contentDocument && f.contentDocument.querySelector('h1'); return h ? { text: h.textContent, color: getComputedStyle(h).color } : 'h1-yo\'q'; } catch (e) { return 'cross-origin: ' + e.message; } });
console.log('[C oflayn] ' + summary() + ' → preview h1=' + JSON.stringify(previewOk) + ' chip=' + JSON.stringify((await chips(p))[0]?.ok) + ' hung-banner=' + (await p.$('.hc-hung') ? 'BOR' : 'yo\'q') + (log.filter(l => /PAGEERROR/.test(l)).length ? '  ← ' + log.filter(l => /PAGEERROR/.test(l))[0].slice(0, 80) : ''));
await b.close();
