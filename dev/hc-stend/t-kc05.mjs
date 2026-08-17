// K-C-05 (+K-K-26, K-K-10 — oq-ekran sinfi): js: satr-spec RegExp maxsus belgida yiqiladi; yaroqsiz task/requirements/files; saqlovda string-bo'lmagan kod
import { open, chips } from './tc-lib.mjs';
const { b, p, log } = await open();
const F = (js) => [{ name: 'index.html', lang: 'html', starter: '<h1>x</h1>' }, { name: 'script.js', lang: 'js', starter: js }];
// [label, props, kutilgan: 'mount' | 'mount+chip:true' | 'mount+chip:false']
const cases = [
  ['js string oddiy "let x" (matn-qidiruv)', { task: { title: 't', files: F('let x = 1'), requirements: [{ js: 'let x' }] } }, true],
  ['js string "a.b" — literal a.b topilsin', { task: { title: 't', files: F('a.b = 1'), requirements: [{ js: 'a.b' }] } }, true],
  ['js string "console.log("  (K-C-05)',    { task: { title: 't', files: F('console.log(1)'), requirements: [{ js: 'console.log(' }] } }, true],
  ['js string "alert("',                    { task: { title: 't', files: F('alert(1)'), requirements: [{ js: 'alert(' }] } }, true],
  ['js string "arr[0]" (regex sifatida)',   { task: { title: 't', files: F('arr[0]'), requirements: [{ js: 'arr[0]' }] } }, true],
  ['js string "a.b" — aXb ga mos kelmasin', { task: { title: 't', files: F('aXb'), requirements: [{ js: 'a.b' }] } }, false],
  ['js string "a+b"',                       { task: { title: 't', files: F('a+b'), requirements: [{ js: 'a+b' }] } }, true],
  ['js string salbiy',                      { task: { title: 't', files: F('foo()'), requirements: [{ js: 'alert(' }] } }, false],
  ['K-K-26 task:null',                      { task: null }, null],
  ['K-K-26 requirements:[null]',            { task: { title: 't', requirements: [null] } }, null],
  ['K-K-26 requirements:{a:1}',             { task: { title: 't', requirements: { a: 1 } } }, null],
  ['K-K-26 requirements:"h1"',              { task: { title: 't', requirements: 'h1' } }, null],
  ['K-K-26 files:[null]',                   { task: { title: 't', files: [null] } }, null],
  ['K-K-26 files:"x"',                      { task: { title: 't', files: 'x' } }, null],
  ['K-K-26 requirements:[{}] (tanilmagan)', { task: { title: 't', requirements: [{}] } }, false],
  ['K-K-26 requirements:[{check:"h1"}] string-check', { task: { title: 't', requirements: [{ check: 'h1' }] } }, false],
];
let bad = 0;
for (const [label, props, expect] of cases) {
  log.length = 0;
  await p.evaluate((props) => { localStorage.clear(); try { window.unmountHC(); } catch {} document.getElementById('root').innerHTML=''; try { window.mountHC(props); } catch (e) { console.log('MOUNT-THROW ' + e.message); } }, props);
  await p.waitForTimeout(700);
  const mounted = await p.$('.hc-root textarea.hc-code').then(Boolean);
  const errs = log.filter(l => /PAGEERROR|MOUNT-THROW|error:/.test(l)).slice(0, 2).map(l => l.slice(0, 110));
  let chip = null;
  if (mounted) { const c = (await chips(p))[0]; chip = c ? c.ok : 'chip-yo\'q'; }
  const okMount = mounted;
  const okChip = expect === null ? true : chip === expect;
  const good = okMount && okChip;
  if (!good) bad++;
  console.log(`${good ? '✓' : '✗ KUTILMAGAN'} [${label}] mount=${mounted ? 'HA' : 'OQ EKRAN'} chip=${chip}${expect !== null ? ' (kutilgan ' + expect + ')' : ''}${errs.length ? '  ← ' + errs.join(' | ') : ''}`);
}
// K-K-10: saqlovda kod qiymati string emas
for (const [label, val] of [['K-K-10 codes raqam', 123], ['K-K-10 codes obyekt', { a: 1 }], ['K-K-10 codes null', null]]) {
  log.length = 0;
  await p.evaluate(({ val }) => { localStorage.clear(); localStorage.setItem('kk10', JSON.stringify({ codes: { 'index.html': val } })); try { window.unmountHC(); } catch {} document.getElementById('root').innerHTML=''; try { window.mountHC({ storageKey: 'kk10', task: { title: 't', requirements: [{ tag: 'h1' }] } }); } catch (e) { console.log('MOUNT-THROW ' + e.message); } }, { val });
  await p.waitForTimeout(700);
  const mounted = await p.$('.hc-root textarea.hc-code').then(Boolean);
  const code = mounted ? await p.$eval('.hc-root textarea.hc-code', t => t.value) : null;
  const errs = log.filter(l => /PAGEERROR|MOUNT-THROW|error:/.test(l)).slice(0, 2).map(l => l.slice(0, 110));
  if (!mounted) bad++;
  console.log(`${mounted ? '✓' : '✗ KUTILMAGAN'} [${label}] mount=${mounted ? 'HA' : 'OQ EKRAN'} kod=${JSON.stringify(code)}${errs.length ? '  ← ' + errs.join(' | ') : ''}`);
}
console.log(bad ? `XATO: ${bad}/${cases.length + 3}` : `HAMMASI KUTILGANDEK ${cases.length + 3}/${cases.length + 3}`);
await b.close();
