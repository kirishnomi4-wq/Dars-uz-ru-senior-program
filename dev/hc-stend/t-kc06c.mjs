// K-C-06 tuzatishdan keyin: @import kesiladi, qolgan CSS to'liq ishlaydi (checker + preview); fonts <link> bir marta; 2 instansiya
import { open, chips } from './tc-lib.mjs';
const { b, p, log } = await open();
const reqs = [];
p.on('request', r => { const u = r.url(); if (/tc-imp|fonts\.g|example\.invalid/.test(u)) reqs.push((r.frame() === p.mainFrame() ? 'TOP' : 'iframe') + ':' + u.replace('http://127.0.0.1:4517', '').slice(0, 60)); });
const TASK = (css, reqs) => ({ title: 't', files: [{ name: 'index.html', lang: 'html', starter: '<h1>salom</h1><p>x</p>' }, { name: 'style.css', lang: 'css', starter: css }], requirements: reqs });
const mountT = async (task, key) => { await p.evaluate(({ task, key }) => { localStorage.clear(); try { window.unmountHC(); } catch {} document.getElementById('root').innerHTML = ''; window.mountHC({ task, storageKey: key }); }, { task, key }); await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(700); };
const previewH1 = async () => { for (const f of p.frames()) { if (f === p.mainFrame()) continue; try { const t = await f.evaluate(() => { const h = document.querySelector('h1'), q = document.querySelector('p'); return h ? getComputedStyle(h).color + '/' + getComputedStyle(h).marginTop + ' p:' + getComputedStyle(q).fontSize : null; }); if (t) return t; } catch {} } return null; };
let bad = 0; const ok = (c, m) => { if (!c) bad++; console.log((c ? '✓ ' : '✗ ') + m); };

// [1] @import BOR + qolgan qoidalar: checker (3 chip) + preview
reqs.length = 0;
await mountT(TASK('@import url("http://127.0.0.1:4517/tc-imp-a.css");\n@import "https://example.invalid/x.css" screen;\nh1{color:red;margin:0}\np{font-size:30px}',
  [{ css: { sel: 'h1', prop: 'color', value: 'red' } }, { css: { sel: 'h1', prop: 'margin', value: '0' } }, { css: { sel: 'p', prop: 'font-size', value: '30px' } }]), 'k1');
const c1 = await chips(p); const pv = await previewH1();
ok(c1.every(c => c.ok) && c1.length === 3, `[1 @import + qolgan CSS] chiplar=${c1.map(c => c.ok).join(',')} (kutilgan 3× true) · preview h1=${pv} (kutilgan red/0px, p 30px)`);
ok(/rgb\(255, 0, 0\)\/0px p:30px/.test(pv || ''), '[1b preview] qolgan CSS to\'liq qo\'llandi');
// 5 probel
await p.$$eval('.hc-tab', els => { const t = els.find(e => /style\.css/.test(e.textContent)); if (t) t.click(); });
await p.click('.hc-code'); await p.keyboard.press('End');
for (let i = 0; i < 5; i++) { await p.keyboard.type(' '); await p.waitForTimeout(250); }
await p.waitForTimeout(800);
const imp = reqs.filter(r => /tc-imp|example/.test(r));
ok(imp.length === 0, `[1c tarmoq] @import so'rovlari (mount + 5 probel) = ${imp.length} (kutilgan 0) ${JSON.stringify(imp)} · chip=${(await chips(p)).map(c => c.ok).join(',')}`);

// [2] fonts: link bir marta, 3× mount + so'rovlar
const gf0 = reqs.filter(r => /fonts\.g/.test(r)).length;
for (let i = 0; i < 3; i++) await mountT(TASK('h1{margin:0}', [{ css: { sel: 'h1', prop: 'margin' } }]), 'k2');
const links = await p.$$eval('link#hc-fonts', l => l.length);
const styleImports = await p.$$eval('.hc-root style', els => els.filter(e => /@import/.test(e.textContent)).length);
ok(links === 1 && styleImports === 0, `[2 fonts] link#hc-fonts=${links} (kutilgan 1) · <style> ichida @import=${styleImports} (kutilgan 0) · fonts so'rovlari: birinchi sahifa-yuklashda ${gf0}, keyingi 3× mount'da ${reqs.filter(r => /fonts\.g/.test(r)).length - gf0}`);

// [3] oflayn: fonts + import abort → UI va preview tirik
await p.route(/tc-imp|fonts\.g|example\.invalid/, r => r.abort('internetdisconnected'));
log.length = 0;
await p.evaluate(() => { const l = document.getElementById('hc-fonts'); l && l.remove(); });
await mountT(TASK('@import url("http://127.0.0.1:4517/tc-imp-a.css");\nh1{color:red}', [{ css: { sel: 'h1', prop: 'color', value: 'red' } }]), 'k3');
await p.waitForTimeout(1200);
ok((await chips(p))[0]?.ok === true && /rgb\(255, 0, 0\)/.test((await previewH1()) || '') && !(await p.$('.hc-hung')) && log.filter(l => /PAGEERROR/.test(l)).length === 0,
  `[3 oflayn] chip=${(await chips(p))[0]?.ok} preview=${await previewH1()} hung=${(await p.$('.hc-hung')) ? 'BOR' : 'yo\'q'} pageerr=${log.filter(l => /PAGEERROR/.test(l)).length} · UI font=${await p.$eval('.hc-root', e => getComputedStyle(e).fontFamily.slice(0, 40))}`);
console.log(bad ? `XATO: ${bad}` : 'HAMMASI KUTILGANDEK 5/5');
await b.close();
