// hc-dars-ekran — paketdagi HAR BIR kompilyatorli darsni LMS CSS bilan ochib, HAQIQIY kompilyator
// ekranini topadi (ekranlarni aylanib), darsning o'z `stage`iga qarab kutilgan natija bilan yozib sinaydi
// va skrinshot oladi (01.10, F-1001-91 — «har bir darsni ko'rib chiq»).
//   node hc-dars-ekran.mjs <paket-papka> [chiqish-papka]      (LANG_=ru → ruscha)
// Faqat o'qiydi: paket fayliga ham, manbaga ham tegmaydi. Chiqish: <chiqish>/<nom>.png + natija.json + jadval.
import * as esbuild from 'esbuild';
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/kali/Desktop/internetLesson';
const HERE = new URL('.', import.meta.url).pathname;
const [pk, outArg] = process.argv.slice(2);
const OUT = outArg || '/tmp/lms-tekshir/dars-hc';
const LANG = process.env.LANG_ || 'uz';
mkdirSync(OUT, { recursive: true });

// ── xarita + stage mantiqi (HtmlCompiler.jsx dagi tegRank/tegOchiq nusxasi) ──
const MAP = JSON.parse(readFileSync(ROOT + '/src/compilator/teg-xaritasi.json', 'utf8'));
const TARTIB = MAP.tartib, B = MAP.bosqich;
const rank = (k) => { if (!k) return Infinity; const i = TARTIB.indexOf(k); if (i !== -1) return i; const m = /^(m\d[abc]?)-/.exec(k); const w = m ? TARTIB.indexOf(m[1] + '-*') : -1; return w === -1 ? Infinity : w; };
const ochiq = (stage, dars) => !stage || rank(dars) <= rank(stage);
const tagsFor = (stage, pref) => MAP.html.teglar.filter((t) => ochiq(stage, t.dars) && t.t.startsWith(pref)).map((t) => '<' + t.t + '>');
const attrsFor = (stage, tag) => MAP.html.atributlar.filter((a) => a.tag === tag && ochiq(stage, a.dars)).map((a) => a.a);

// Holatlar: [nom, ketma-ketlik, kutilgan(stage) → {items|itemsHas|noItems|value|valueStarts}, fayl?]
const CASES = [
  ['<h → h1…h6', '<h', (st) => { const it = tagsFor(st, 'h'); return it.length ? { itemsSet: it } : { noItems: true }; }],
  ['<fo → form/footer', '<fo', (st) => { const it = tagsFor(st, 'fo'); return it.length ? { itemsSet: it } : { noItems: true }; }],
  ['<in → input', '<in', (st) => { const it = tagsFor(st, 'in'); return it.length ? { itemsSet: it } : { noItems: true }; }],
  ['<ma → main', '<ma', (st) => { const it = tagsFor(st, 'ma'); return it.length ? { itemsSet: it } : { noItems: true }; }],
  ['<la → label', '<la', (st) => { const it = tagsFor(st, 'la'); return it.length ? { itemsSet: it } : { noItems: true }; }],
  ['<bu → button', '<bu', (st) => { const it = tagsFor(st, 'bu'); return it.length ? { itemsSet: it } : { noItems: true }; }],
  ['<h6 aniq', '<h6', (st) => (ochiq(st, 'm1-03') ? { itemsHas: '<h6>' } : { noItems: true })],
  ['<h + Enter → <h1></h1>', '<h{Enter}', (st) => (ochiq(st, 'm1-03') ? { value: '<h1></h1>' } : { value: '<h\n' })],
  ['form + Tab → yoyiladi (Q2)', 'form{Tab}', () => ({ value: '<form></form>' })],
  ['<div> Enter h1 Tab', '<div>{Enter}h1{Tab}', () => ({ value: '<div>\n  <h1></h1>\n</div>' })],
  ['<div>in → ichida ro\'yxat', '<div>in', (st) => (tagsFor(st, 'in').length ? { itemsHas: '<input>' } : { noItems: true })],
  ['<a + bo\'shliq → href', '<a ', (st) => (attrsFor(st, 'a').includes('href') ? { itemsHas: 'href' } : { noItems: true })],
  ['<input type=" → qiymatlar', '<input type="', (st) => (attrsFor(st, 'input').includes('type') ? { itemsHas: '"text"' } : { noItems: true })],
  ['ul>li*3 + Tab (Emmet)', 'ul>li*3{Tab}', (st) => (ochiq(st, B.emmet) ? { value: '<ul>\n  <li></li>\n  <li></li>\n  <li></li>\n</ul>' } : { value: 'ul>li*3  ' })],
  ['! + Tab (qobiq)', '!{Tab}', (st) => (ochiq(st, B.emmet) ? { valueStarts: '<!DOCTYPE html>' } : { value: '!  ' })],
  ['Esc → yopiladi', '<h{Esc}', () => ({ noItems: true })],
  ['<H katta harf', '<H', (st) => (ochiq(st, 'm1-03') ? { itemsHas: '<h1>' } : { noItems: true })],
  ['CSS: h1 { co', 'h1 {{Enter}co', (st) => (ochiq(st, B.css_maslahat) ? { itemsHas: 'color:' } : { noItems: true }), 'style.css'],
  ['CSS: color: → qiymat', 'h1 {{Enter}color: ', (st) => (ochiq(st, B.css_maslahat) ? { itemsHas: 'red' } : { noItems: true }), 'style.css'],
  ['JS: log + Tab', 'log{Tab}', (st) => (ochiq(st, B.js_maslahat) ? { value: 'console.log();' } : { value: 'log  ' }), 'script.js'],
  ['JS: le → let', 'le', (st) => (ochiq(st, B.js_maslahat) ? { itemsHas: 'let' } : { noItems: true }), 'script.js'],
  ['JS: con → console.log', 'con', (st) => (ochiq(st, B.js_maslahat) ? { itemsHas: 'console.log' } : { noItems: true }), 'script.js'],
  ['JS: for + Tab → sikl', 'for{Tab}', (st) => (ochiq(st, 'm2-05') ? { valueStarts: 'for (let i = 0' } : { value: 'for  ' }), 'script.js'],
  ['JS: if → bor/yo\'q', 'if', (st) => (ochiq(st, 'm2-04') ? { itemsHas: 'if' } : { noItems: true }), 'script.js'],
  ['JS: le + Enter → tanlamaydi', 'le{Enter}', () => ({ value: 'le\n' }), 'script.js'],
  ['JS: o\'z so\'zi salom → jim', 'salom', () => ({ noItems: true }), 'script.js'],
  ['JS: izoh ichida jim', '// le', () => ({ noItems: true }), 'script.js'],
  ['JS: satr ichida jim', '"le', () => ({ noItems: true }), 'script.js'],
  ['JS: arr.le → .length', 'arr.le', (st) => (ochiq(st, B.js_maslahat) ? { itemsHas: '.length' } : { noItems: true }), 'script.js'],
  ['JS: { juftlik', '{', () => ({ value: '{}' }), 'script.js'],
];

const files = [];
for (const m of readdirSync(pk)) { const d = join(pk, m); if (!statSync(d).isDirectory()) continue; for (const f of readdirSync(d)) if (f.endsWith('.jsx') && readFileSync(join(d, f), 'utf8').includes('HtmlCompiler_default')) files.push(join(d, f)); }
files.sort();
const ONLY = process.env.ONLY; // ONLY=Htmllesson1,PmLesson1 — faqat shu fayllar (sinash uchun)
const picked = ONLY ? files.filter((f) => ONLY.split(',').some((k) => f.includes(k))) : files;
console.log('kompilyatorli fayllar:', files.length, ONLY ? `(tanlangan ${picked.length})` : '');

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const results = [];
for (const file of picked) {
  const t0 = Date.now();
  const src = readFileSync(file, 'utf8');
  const name = basename(file, '.jsx');
  const lessonId = (/lessonId\s*:\s*['"]([^'"]+)['"]/.exec(src) || [])[1] || '';
  const stage = (/<HtmlCompiler_default[^>]*stage=\s*"([^"]+)"/.exec(src) || /stage="(m\d[abc]?-\d\d)"/.exec(src) || [])[1] || null;
  const metaBody = (/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src) || [])[1] || '';
  const meta = [...metaBody.matchAll(/\{\s*id:\s*["']([^"']+)["'][^}]*type:\s*["']([^"']+)["']/g)].map((m) => ({ id: m[1], type: m[2] }));
  const total = meta.length;
  const kodingKey = (/KODING_KEY\s*=\s*['"]([^'"]+)['"]/.exec(src) || [])[1] || '';
  const dir = join(OUT, 'build', name); mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'entry.jsx'), `import React from 'react';
import { createRoot } from 'react-dom/client';
import Lesson from ${JSON.stringify(resolve(file))};
const q = new URLSearchParams(location.search);
const s = Number(q.get('s') || 0), id = q.get('id') || '', total = Number(q.get('total') || 0);
try { localStorage.clear(); localStorage.setItem('liveSession:' + id, '{"mode":"self"}');
  localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: s, answers: {}, earned: [], startedAt: Date.now(), total, savedAt: Date.now() }));
  if (q.get('prac') === '1') localStorage.setItem('ccPractice:' + id, JSON.stringify({ kind: 's' + s, screen: s }));
  if (q.get('prac') === '1' && ${JSON.stringify(kodingKey)}) localStorage.setItem(${JSON.stringify(kodingKey)}, JSON.stringify({ open: true }));
  localStorage.setItem('hcOnboarded_learner', '1'); localStorage.setItem('hcOnboarded_mentor', '1'); } catch {}
createRoot(document.getElementById('root')).render(React.createElement(Lesson, { lang: q.get('lang') || 'uz' }));
`);
  await esbuild.build({
    entryPoints: [join(dir, 'entry.jsx')], bundle: true, outfile: join(dir, 'bundle.js'), format: 'iife', platform: 'browser', target: 'es2020',
    jsx: 'automatic', logLevel: 'silent', charset: 'utf8',
    loader: { '.jsx': 'jsx', '.js': 'jsx', '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.gif': 'dataurl', '.webp': 'dataurl', '.mp3': 'dataurl' },
    define: { 'process.env.NODE_ENV': '"production"', '__DARS_API_URL__': '""' },
    absWorkingDir: ROOT, nodePaths: [join(ROOT, 'node_modules')],
  });
  copyFileSync(join(HERE, 'lms-host.css'), join(dir, 'host.css'));
  writeFileSync(join(dir, 'lms.html'), `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="host.css"></head><body><div id="root"></div><script src="bundle.js"></script></body></html>`);
  const base = pathToFileURL(join(dir, 'lms.html')).href + `?lang=${LANG}&id=${encodeURIComponent(lessonId)}&total=${total}`;
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 1 });
  await ctx.route(/^https?:\/\//, (r) => r.abort());
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));

  // 1) kompilyator ekranini topish: koding/practice turidagi ekranlar avval, keyin qolganlari
  const order = [...meta.keys()].sort((a, b) => (['koding', 'practice'].includes(meta[b].type) ? 1 : 0) - (['koding', 'practice'].includes(meta[a].type) ? 1 : 0));
  let found = null, fallback = null;
  const tabsOf = () => page.evaluate(() => [...document.querySelectorAll('.hc-tab')].map((b) => b.textContent.trim()));
  const tryOpen = async () => { try { await page.waitForSelector('textarea.hc-code', { timeout: 1500, state: 'visible' }); return true; } catch { return false; } };
  for (const s of order) {
    for (const prac of ['0', '1']) {
      await page.goto(`${base}&s=${s}&prac=${prac}`, { waitUntil: 'domcontentloaded' });
      try { await page.waitForSelector('.lesson-root', { timeout: 10000 }); } catch { continue; }
      let ok = await tryOpen(), clicked = null;
      if (!ok && ['koding', 'practice'].includes(meta[s].type)) {
        // zaxira: «kod/ochish/boshlash» tugmasini bosib ko'rish (PM koding ekranlari)
        const btns = await page.evaluate(() => [...document.querySelectorAll('button')].map((b, i) => [i, b.textContent.trim()]).filter(([, t]) => /kod|code|och|boshla|yoz|код|откр|нач/i.test(t) && t.length < 60));
        for (const [i, t] of btns.slice(0, 4)) {
          try { await page.locator('button').nth(i).click({ timeout: 1500 }); } catch { continue; }
          if (await tryOpen()) { ok = true; clicked = t; break; }
        }
      }
      if (!ok) continue;
      const tabs = await tabsOf();
      const cand = { s, prac, id: meta[s].id, type: meta[s].type, tabs, clicked };
      if (tabs.length === 0 || tabs.some((t) => t.includes('index.html'))) { found = cand; break; }
      if (!fallback) fallback = cand;
    }
    if (found) break;
  }
  if (!found) found = fallback;
  const row = { file, name, lessonId, stage, total, found, cases: [], errs };
  if (!found) { row.note = 'kompilyator ekrani TOPILMADI'; results.push(row); console.log(`❌ ${name}: kompilyator ekrani topilmadi`); await ctx.close(); continue; }

  // 2) holatlar — har holat uchun sahifa qayta ochiladi (toza muharrir)
  const tabs = found.tabs; row.tabs = tabs;
  const htmlOk = tabs.length === 0 || tabs.some((t) => t.includes('index.html'));
  let pass = 0, fail = 0, skip = 0, shotDone = false;
  for (const [cname, seq, expFn, fileTab] of CASES) {
    const ext = fileTab ? fileTab.slice(fileTab.lastIndexOf('.')) : null;
    if (fileTab && !tabs.some((t) => t.endsWith(ext))) { skip++; row.cases.push({ name: cname, skip: 'fayl yorlig\'i yo\'q' }); continue; }
    if (!fileTab && !htmlOk) { skip++; row.cases.push({ name: cname, skip: 'index.html yorlig\'i yo\'q' }); continue; }
    await page.goto(`${base}&s=${found.s}&prac=${found.prac}`, { waitUntil: 'domcontentloaded' });
    try { await page.waitForSelector('.lesson-root', { timeout: 10000 }); } catch {}
    if (found.clicked) { try { await page.locator('button', { hasText: found.clicked }).first().click({ timeout: 2000 }); } catch {} }
    try { await page.waitForSelector('textarea.hc-code', { timeout: 10000, state: 'visible' }); } catch { fail++; row.cases.push({ name: cname, probs: ['textarea qayta topilmadi'] }); continue; }
    if (fileTab) { try { await page.locator('.hc-tab', { hasText: tabs.find((t) => t.endsWith(ext)) }).first().click({ timeout: 2000 }); } catch {} }
    else if (tabs.some((t) => t.includes('index.html'))) { try { await page.locator('.hc-tab', { hasText: 'index.html' }).first().click({ timeout: 2000 }); } catch {} }
    const ta = page.locator('textarea.hc-code').first();
    await ta.click();
    await page.keyboard.press('Control+a'); await page.keyboard.press('Backspace');
    await page.waitForTimeout(120);
    const parts = seq.split(/(\{Tab\}|\{Enter\}|\{Esc\})/).filter(Boolean);
    for (const p of parts) {
      if (p === '{Tab}') await page.keyboard.press('Tab');
      else if (p === '{Enter}') await page.keyboard.press('Enter');
      else if (p === '{Esc}') await page.keyboard.press('Escape');
      else await page.keyboard.type(p, { delay: 25 });
    }
    await page.waitForTimeout(200);
    const r = await page.evaluate(() => {
      const m = document.querySelector('.hc-menu');
      const items = m ? [...m.querySelectorAll('.hc-menu-k')].map((x) => x.textContent) : null;
      const ta = document.querySelector('textarea.hc-code');
      return { items, value: ta ? ta.value : null };
    });
    const exp = expFn(stage);
    const items = r.items || [];
    const probs = [];
    if (exp.noItems && r.items) probs.push('ro\'yxat chiqdi: ' + items.join(' '));
    if (exp.itemsSet && JSON.stringify([...items].sort()) !== JSON.stringify([...exp.itemsSet].sort())) probs.push('ro\'yxat ' + JSON.stringify(items) + ' ≠ ' + JSON.stringify(exp.itemsSet));
    if (exp.itemsHas && !items.includes(exp.itemsHas)) probs.push('ro\'yxatda yo\'q: ' + exp.itemsHas + ' (' + items.join(' ') + ')');
    if (exp.value != null && r.value !== exp.value) probs.push('matn ' + JSON.stringify(r.value) + ' ≠ ' + JSON.stringify(exp.value));
    if (exp.valueStarts && !(r.value || '').startsWith(exp.valueStarts)) probs.push('matn boshi ' + JSON.stringify((r.value || '').slice(0, 30)));
    // skrinshot: birinchi ro'yxat chiqqan holat (HTML darsida `<h`, JS darsida `le`)
    if (!shotDone && r.items && r.items.length) { await page.screenshot({ path: join(OUT, `${name}-${LANG}.png`) }); shotDone = true; }
    if (probs.length) { fail++; row.cases.push({ name: cname, seq, probs, items, value: r.value }); } else { pass++; row.cases.push({ name: cname, ok: true }); }
  }
  row.pass = pass; row.fail = fail; row.skip = skip;
  const sec = Math.round((Date.now() - t0) / 1000);
  console.log(`${fail ? '❌' : '✅'} ${name.padEnd(32)} stage=${String(stage).padEnd(6)} ekran ${found.id}(${found.type}${found.prac === '1' ? ',prac' : ''}${found.clicked ? ',tugma «' + found.clicked + '»' : ''}) yorliqlar [${tabs.join(' ')}] — ${pass} ✓ ${fail} ❌ ${skip} o'tkazildi · ${sec}s${errs.length ? ' · pageerror ' + errs.length : ''}`);
  for (const c of row.cases) if (c.probs) console.log('     ✗ ' + c.name + ' — ' + c.probs.join(' · '));
  results.push(row);
  await ctx.close();
}
await browser.close();
writeFileSync(join(OUT, `natija-${LANG}.json`), JSON.stringify(results, null, 1));
const bad = results.filter((r) => !r.found || r.fail);
console.log(`\nJAMI: ${results.length} dars · ${results.length - bad.length} ✅ · ${bad.length} ❌`);
process.exit(bad.length ? 1 : 0);
