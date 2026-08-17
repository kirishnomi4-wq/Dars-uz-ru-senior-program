// K-K-10 saqlov-migratsiya: buzuq/eski saqlov bilan dars ochilganda nima bo'ladi (tozalanadimi, konvertlanadimi, reload)
import { open } from './tc-lib.mjs';
const { b, p, log } = await open();
const TASK = { title: 't', files: [{ name: 'index.html', lang: 'html', starter: '<h1>start</h1>' }, { name: 'style.css', lang: 'css', starter: 'h1{}' }], requirements: [{ tag: 'h1' }] };
await p.evaluate((t) => { window.__TASK = t; }, TASK);
const cases = [
  ['sog\'lom saqlov (string, string)', { codes: { 'index.html': '<h1>saved</h1>', 'style.css': 'h1{color:red}' }, savedAt: 1 }],
  ['aralash: index raqam, css string', { codes: { 'index.html': 123, 'style.css': 'h1{color:red}' }, savedAt: 1 }],
  ['ikkalasi obyekt', { codes: { 'index.html': { a: 1 }, 'style.css': [1, 2] }, savedAt: 1 }],
  ['codes massiv', { codes: ['a', 'b'], savedAt: 1 }],
  ['codes satr', { codes: 'x', savedAt: 1 }],
  ['codes null', { codes: null }],
  ['ildiz massiv', ['<h1>x</h1>']],
  ['ildiz satr (JSON emas)', '__RAW__<h1>x</h1>'],
  ['boshqa fayl-to\'plami (eski task)', { codes: { 'index.html': '<h1>old</h1>' }, savedAt: 1 }],
];
let bad = 0;
for (const [label, saved] of cases) {
  log.length = 0;
  const r = await p.evaluate(async ({ saved }) => {
    localStorage.clear();
    localStorage.setItem('mig', typeof saved === 'string' && saved.startsWith('__RAW__') ? saved.slice(7) : JSON.stringify(saved));
    try { window.unmountHC(); } catch {}
    document.getElementById('root').innerHTML = '';
    window.mountHC({ storageKey: 'mig', task: window.__TASK });
    await new Promise(r => setTimeout(r, 900));   // 400 ms debounce yozuvi o'tsin
    const ta = document.querySelector('.hc-root textarea.hc-code');
    const after = localStorage.getItem('mig');
    // reload: qayta mount
    window.unmountHC(); document.getElementById('root').innerHTML = '';
    window.mountHC({ storageKey: 'mig', task: window.__TASK });
    await new Promise(r => setTimeout(r, 300));
    const ta2 = document.querySelector('.hc-root textarea.hc-code');
    return { mounted: !!ta, code: ta && ta.value, after, remounted: !!ta2, code2: ta2 && ta2.value };
  }, { saved });
  const errs = log.filter(l => /PAGEERROR/.test(l)).slice(0, 1).map(l => l.slice(0, 90));
  const good = r.mounted && r.remounted;
  if (!good) bad++;
  let afterC = 'o\'zgarmagan'; try { const a = JSON.parse(r.after); if (a && a.codes && typeof a.codes === 'object' && !Array.isArray(a.codes) && Object.values(a.codes).every(v => typeof v === 'string')) afterC = 'KONVERT → hammasi string'; else afterC = 'buzuq qoldi'; } catch { afterC = 'buzuq qoldi'; }
  console.log(`${good ? '✓' : '✗'} [${label}] ochildi=${r.mounted ? 'HA' : 'YO\'Q'} kod=${JSON.stringify(r.code)} → saqlov: ${afterC} (${(r.after || '').slice(0, 70)}) → reload=${r.remounted ? 'HA' : 'YO\'Q'} kod=${JSON.stringify(r.code2)}${errs.length ? '  ← ' + errs : ''}`);
}
console.log(bad ? `XATO: ${bad}/${cases.length}` : `HAMMASI OCHILDI ${cases.length}/${cases.length}`);
await b.close();
