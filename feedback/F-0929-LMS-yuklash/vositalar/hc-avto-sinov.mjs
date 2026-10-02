// Kompilyator avto-to'ldirish sinovi (F-1001-91) — FAQAT O'QIYDI, manbaga tegmaydi. 46 holat.
// Yurgizish: node feedback/F-0929-LMS-yuklash/vositalar/hc-avto-sinov.mjs  → natija.json + jadval.
// HtmlCompiler'ni yolg'iz sahifada ochadi, har holatda bo'sh muharrirga yozadi,
// taklif-ro'yxati (.hc-menu) va yakuniy matnni yozib oladi.
import * as esbuild from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '/home/kali/Desktop/internetLesson';
const DIR = (process.env.LMS_OUT || '/tmp/lms-tekshir') + '/hc-sinov/'; // chiqish shu yerda (repo emas)
// HC_SRC: kompilyator moduli — sukut manba; paket faylining nusxasi (`export { HtmlCompiler_default as __HC }` qo'shilgan) berilsa, o'sha fayl ICHIDAGI kompilyator sinaladi (01.10, har dars uchun)
const HC_SRC = process.env.HC_SRC || ROOT + '/src/compilator/HtmlCompiler.jsx';
mkdirSync(join(DIR, 'build'), { recursive: true });
writeFileSync(join(DIR, 'build', 'entry.jsx'), `import React from 'react';
import { createRoot } from 'react-dom/client';
import * as HCM from ${JSON.stringify(HC_SRC)}; const HtmlCompiler = HCM.__HC || HCM.default;
const q = new URLSearchParams(location.search);
const two = q.get('css') === '1';
const js = q.get('js') === '1';
const stage = q.get('stage') || undefined;
const task = { title: 'sinov', brief: 'sinov', requirements: [],
  files: two ? [{ name: 'index.html', lang: 'html', starter: '' }, { name: 'style.css', lang: 'css', starter: '' }] : js ? [{ name: 'index.html', lang: 'html', starter: '' }, { name: 'script.js', lang: 'js', starter: '' }] : [{ name: 'index.html', lang: 'html', starter: '' }] };
try { localStorage.clear(); } catch {}
createRoot(document.getElementById('root')).render(React.createElement(HtmlCompiler, { lang: 'uz', task, stage }));
`);
await esbuild.build({
  entryPoints: [join(DIR, 'build', 'entry.jsx')], bundle: true, outfile: join(DIR, 'build', 'bundle.js'), format: 'iife',
  platform: 'browser', target: 'es2020', jsx: 'automatic', logLevel: 'silent', charset: 'utf8',
  define: { 'process.env.NODE_ENV': '"production"', '__DARS_API_URL__': '""' },
  absWorkingDir: ROOT, nodePaths: [join(ROOT, 'node_modules')],
});
writeFileSync(join(DIR, 'build', 'index.html'), '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script src="bundle.js"></script></body></html>');

// [nom, oldindan matn (setValue emas — yoziladi), yoziladigan ketma-ketlik, oxirida bosiladigan tugma]
// Ketma-ketlik: oddiy matn → keyboard.type; {Tab} {Enter} {Esc} — alohida tugma.
import { readFileSync } from 'node:fs';
const MAP = JSON.parse(readFileSync(ROOT + '/src/compilator/teg-xaritasi.json', 'utf8'));
const CASES = [
  ['1  < belgisi', '', '<'],
  ['2  <h', '', '<h'],
  ['3  <f (form/footer?)', '', '<f'],
  ['4  <fo', '', '<fo'],
  ['5  <form', '', '<form'],
  ['6  <in (input)', '', '<in'],
  ['7  <la (label)', '', '<la'],
  ['8  <ma (main)', '', '<ma'],
  ['9  <te (textarea)', '', '<te'],
  ['10 <se (section/select)', '', '<se'],
  ['11 <op (option)', '', '<op'],
  ['12 <bu (button)', '', '<bu'],
  ['13 <h4', '', '<h4'],
  ['14 <ti (title)', '', '<ti'],
  ['15 <sc (script)', '', '<sc'],
  ['16 <st (style/strong)', '', '<st'],
  ['17 <li (li/link)', '', '<li'],
  ['18 <ta (table)', '', '<ta'],
  ['19 <H (katta harf)', '', '<H'],
  ['20 yolg\'iz so\'z: h1', '', 'h1'],
  ['21 yolg\'iz so\'z h1 + Tab', '', 'h1{Tab}'],
  ['22 yolg\'iz so\'z form + Tab', '', 'form{Tab}'],
  ['23 yolg\'iz so\'z input + Tab', '', 'input{Tab}'],
  ['24 <div> dan keyin (juft qatorda) h1', '', '<div>h1'],
  ['25 <div> dan keyin h1 + Tab', '', '<div>h1{Tab}'],
  ['26 <form> ichida (juft qatorda) input', '', '<form>input'],
  ['27 <div>+Enter, keyin h1 + Tab', '', '<div>{Enter}h1{Tab}'],
  ['28 <p> ichida <a', '', '<p><a'],
  ['29 <form + bo\'shliq (atribut)', '', '<form '],
  ['30 <input + bo\'shliq', '', '<input '],
  ['31 <label + bo\'shliq', '', '<label '],
  ['32 <button + bo\'shliq', '', '<button '],
  ['33 <a + bo\'shliq', '', '<a '],
  ['34 Emmet ! + Tab', '', '!{Tab}'],
  ['35 Emmet ul>li*3 + Tab', '', 'ul>li*3{Tab}'],
  ['36 Emmet div.card + Tab', '', 'div.card{Tab}'],
  ['37 <h1> yozilganda avto-yopish', '', '<h1>'],
  ['38 <input> (void)', '', '<input>'],
  ['39 Esc, keyin yana harf', '', '<h{Esc}'],
  ['40 Esc, keyin harf qo\'shildi', '', '<h{Esc}e'],
  ['41 tanlash: <h + Enter', '', '<h{Enter}'],
  ['42 tanlash: <a + Enter', '', '<a{Enter}'],
  ['43 tanlash: <img + Enter', '', '<im{Enter}'],
];
const CSS_CASES = [
  ['44 CSS: co', 'co'],
  ['45 CSS: h1 { co', 'h1 {{Enter}co'],
  ['46 CSS: dis', 'h1 {{Enter}dis'],
];

// ── F-1001-91: XARITADAN avto-holatlar + Q4/Q5/Q6 + regressiya ──
const T = MAP.html.teglar;
const AUTO = [];
for (const t of T) {
  AUTO.push([`X <${t.t.slice(0, 2)} → ro'yxatda ${t.t}`, null, '<' + t.t.slice(0, 2), { itemsHas: '<' + t.t + '>' }]);
  AUTO.push([`X ${t.t}+Tab`, null, t.t + '{Tab}', { value: ['ul','ol','a','img'].includes(t.t) ? null : (t.void ? `<${t.t}>` : `<${t.t}></${t.t}>`) }]);
}
// stage-filtr: HTML-1 da form/main/header yo'q, h6 bor; HTML-2 da bor
AUTO.push(['S m1-03 <fo → bo\'sh', 'm1-03', '<fo', { noItems: true }]);
AUTO.push(['S m1-03 <h6 → bor', 'm1-03', '<h6', { itemsHas: '<h6>' }]);
AUTO.push(['S m1-03 <s → faqat strong', 'm1-03', '<s', { items: ['<strong>'] }]);
AUTO.push(['S m1-03 <he → head (header yo\'q)', 'm1-03', '<he', { items: ['<head>'] }]);
AUTO.push(['S m1-04 <fo → form, footer', 'm1-04', '<fo', { items: ['<footer>', '<form>'] }]);
AUTO.push(['S m1-04 <in → input', 'm1-04', '<in', { items: ['<input>'] }]);
AUTO.push(['S m1-04 <input type=" → qiymatlar', 'm1-04', '<input type="', { itemsHas: '"text"' }]);
AUTO.push(['S m1-04 <input type="e → email', 'm1-04', '<input type="e{Enter}', { value: '<input type="email"' }]);
AUTO.push(['S m1-04 <na → nav yo\'q', 'm1-04', '<na', { noItems: true }]);
AUTO.push(['S m1-08 <na → nav', 'm1-08', '<na', { items: ['<nav>'] }]);
AUTO.push(['S m1-02 (PM, HTML\'gacha) <h → bo\'sh', 'm1-02', '<h', { noItems: true }]);
AUTO.push(['S m1-03 form+Tab → baribir yoyiladi (Q2)', 'm1-03', 'form{Tab}', { value: '<form></form>' }]);
// Q4: Enter/Tab
AUTO.push(['Q4 <div>h1 → ro\'yxat (bare)', null, '<div>h1', { itemsHas: '<h1>' }]);
AUTO.push(['Q4 <div>h1+Tab → <div><h1></h1></div>', null, '<div>h1{Tab}', { value: '<div><h1></h1></div>' }]);
AUTO.push(['Q4 <div>h1+Enter → teg TUSHMAYDI, yangi qator', null, '<div>h1{Enter}', { value: '<div>h1\n</div>' }]);
AUTO.push(['Q4 h1+Enter (bare) → yangi qator', null, 'h1{Enter}', { value: 'h1\n' }]);
AUTO.push(['Q4 <h1+Enter (lt) → tanlaydi', null, '<h{Enter}', { value: '<h1></h1>' }]);
AUTO.push(['Q4 <p>ol → jim (matn tegi)', null, '<p>ol', { noItems: true, value: '<p>ol</p>' }]);
AUTO.push(['Q4 <li>ul → jim', null, '<li>ul', { noItems: true }]);
AUTO.push(['Q4 he → head birinchi, header ikkinchi', null, 'he', { items: ['<head>', '<header>'] }]);
AUTO.push(['Q4 header → aynan header birinchi', null, 'header', { items: ['<header>'] }]);
// Q5: Emmet — faqat m1-15 dan; `.` CSS-1 dan
AUTO.push(['Q5 m1-04 ul>li*3+Tab → ishlamaydi', 'm1-04', 'ul>li*3{Tab}', { value: 'ul>li*3  ' }]);
AUTO.push(['Q5 m1-15 ul>li*3+Tab', 'm1-15', 'ul>li*3{Tab}', { value: '<ul>\n  <li></li>\n  <li></li>\n  <li></li>\n</ul>' }]);
AUTO.push(['Q5 stage yo\'q ul>li*3+Tab', null, 'ul>li*3{Tab}', { value: '<ul>\n  <li></li>\n  <li></li>\n  <li></li>\n</ul>' }]);
AUTO.push(['Q5 !+Tab', null, '!{Tab}', { valueStarts: '<!DOCTYPE html>' }]);
AUTO.push(['Q5 Salom!+Tab → qobiq TUSHMAYDI', null, 'Salom!{Tab}', { value: 'Salom!  ' }]);
AUTO.push(['Q5 div.card+Tab', null, 'div.card{Tab}', { value: '<div class="card"></div>' }]);
AUTO.push(['Q5 m1-04 div.card+Tab → class TUSHMAYDI (F-1001-90)', 'm1-04', 'div.card{Tab}', { value: 'div.card  ' }]);
AUTO.push(['Q5 m1-06 div.card+Tab → hali yo\'q (Emmet m1-15 dan)', 'm1-06', 'div.card{Tab}', { value: 'div.card  ' }]);
AUTO.push(['Q5 m1-15 div.card+Tab → bo\'ladi', 'm1-15', 'div.card{Tab}', { value: '<div class="card"></div>' }]);
AUTO.push(['Q5 section#about+Tab', null, 'section#about{Tab}', { value: '<section id="about"></section>' }]);
AUTO.push(['Q5 form>input*2+Tab', null, 'form>input*2{Tab}', { value: '<form>\n  <input>\n  <input>\n</form>' }]);
AUTO.push(['Q5 noma\'lum teg zzz>li+Tab → ishlamaydi', null, 'zzz>li{Tab}', { value: 'zzz>li  ' }]);
AUTO.push(['Q5 <p> ichida ul>li+Tab → jim (matn)', null, '<p>ul>li{Tab}', { value: '<p>ul>li  </p>' }]);
// Regressiya (F-0809, F-0813)
AUTO.push(['R <h1> avto-yopish', null, '<h1>', { value: '<h1></h1>' }]);
AUTO.push(['R <input> void juftsiz', null, '<input>', { value: '<input>' }]);
AUTO.push(['R <a + bo\'shliq → href', null, '<a ', { itemsHas: 'href' }]);
AUTO.push(['R <a hr+Enter → href=""', null, '<a hr{Enter}', { value: '<a href=""' }]);
AUTO.push(['R " juftlanadi', null, '<a href=', { value: '<a href=' }]);
AUTO.push(['R Esc → yopiladi, Tab chekinadi', null, '<h{Esc}{Tab}', { value: '<h  ' }]);
AUTO.push(['R Esc + tahrir → qaytadi', null, '<h{Esc}e', { itemsHas: '<head>' }]);
AUTO.push(['R Enter chekinish saqlaydi', null, '  p{Enter}', { value: '  p\n  ' }]);
AUTO.push(['R Shift+Enter ro\'yxat ochiq → yangi qator', null, '<h{ShiftEnter}', { value: '<h\n' }]);
AUTO.push(['R Ctrl+/ izoh', null, 'salom{Ctrl/}', { value: '<!-- salom -->' }]);
AUTO.push(['R tanlash: <im+Enter → img snippet', null, '<im{Enter}', { value: '<img src="" alt="">' }]);
AUTO.push(['R tanlash: <a+Enter → a snippet', null, '<a{Enter}', { value: '<a href=""></a>' }]);
AUTO.push(['R ul+Tab → snippet', null, 'ul{Tab}', { value: '<ul>\n  <li></li>\n  <li></li>\n</ul>' }]);
AUTO.push(['R <fo Esc rm Tab Enter in Tab → form ichida input', 'm1-04', '<fo{Esc}rm{Tab}{Enter}in{Tab}', { value: '<form>\n  <input>\n</form>' }]);
AUTO.push(['R <form> Enter → ichkariga', null, '<form>{Enter}', { value: '<form>\n  \n</form>' }]);
AUTO.push(['R <in+Enter → <input> juftsiz', null, '<in{Enter}', { value: '<input>' }]);
AUTO.push(['R <div>ul>li+Tab (bir qatorda) → Emmet', null, '<div>ul>li{Tab}', { value: '<div><ul>\n  <li></li>\n</ul></div>' }]);
AUTO.push(['R ro\'yxat 8+ band suriladi (< → 20+)', null, '<', { itemsMin: 20 }]);

// ── 2b CSS (fayl: style.css) ──
const CSS = 'style.css', JSF = 'script.js';
AUTO.push(['C co → color', null, 'h1 {{Enter}co', { itemsHas: 'color:' }, CSS]);
AUTO.push(['C co+Tab → "color: " + qiymat ro\'yxati', null, 'h1 {{Enter}co{Tab}', { value: 'h1 {\n  color: \n}', itemsHas: 'red' }, CSS]);
AUTO.push(['C color: r + Enter → red', null, 'h1 {{Enter}co{Tab}r{Enter}', { value: 'h1 {\n  color: red\n}' }, CSS]);
AUTO.push(['C selektorda jim (h)', null, 'h', { noItems: true }, CSS]);
AUTO.push(['C selektorda jim (.card)', null, '.card', { noItems: true }, CSS]);
AUTO.push(['C blokdan tashqarida jim', null, 'h1 {{End}co', { noItems: true, value: 'h1 {}co' }, CSS]);
AUTO.push(['C stage m1-03 → CSS maslahat yo\'q', 'm1-03', 'h1 {{Enter}co', { noItems: true }, CSS]);
AUTO.push(['C stage m1-06 di → display hali yo\'q', 'm1-06', 'h1 {{Enter}di', { noItems: true }, CSS]);
AUTO.push(['C stage m1-07 di → display', 'm1-07', 'h1 {{Enter}di', { itemsHas: 'display:' }, CSS]);
AUTO.push(['C display: → flex block none', null, 'h1 {{Enter}display: ', { items: ['flex', 'block', 'none'] }, CSS]);
AUTO.push(['C ; dan keyin yangi xossa', null, 'h1 {{Enter}color: red;{Enter}pa', { itemsHas: 'padding:' }, CSS]);
AUTO.push(['C Esc → jim', null, 'h1 {{Enter}co{Esc}', { noItems: true }, CSS]);
AUTO.push(['C aniq so\'z birinchi (background)', null, 'h1 {{Enter}background', { items: ['background:', 'background-color:'] }, CSS]);
AUTO.push(['C { juftlik regressiya', null, 'h1 {', { value: 'h1 {}' }, CSS]);
// ── 2c JS (fayl: script.js) — faqat Tab ──
AUTO.push(['J le → let', null, 'le', { itemsHas: 'let' }, JSF]);
AUTO.push(['J l (1 harf) → jim', null, 'l', { noItems: true }, JSF]);
AUTO.push(['J salom (o\'z so\'zi) → jim', null, 'salom', { noItems: true }, JSF]);
AUTO.push(['J le+Tab → "let "', null, 'le{Tab}', { value: 'let ' }, JSF]);
AUTO.push(['J le+Enter → tanlamaydi, yangi qator', null, 'le{Enter}', { value: 'le\n' }, JSF]);
AUTO.push(['J satr ichida jim', null, '"le', { noItems: true }, JSF]);
AUTO.push(['J izoh ichida jim', null, '// le', { noItems: true }, JSF]);
AUTO.push(['J log+Tab → console.log();', null, 'log{Tab}', { value: 'console.log();' }, JSF]);
AUTO.push(['J con → console.log', null, 'con', { itemsHas: 'console.log' }, JSF]);
AUTO.push(['J for+Tab → sikl qolipi', null, 'for{Tab}', { valueStarts: 'for (let i = 0' }, JSF]);
AUTO.push(['J stage m2-02 fo → for hali yo\'q', 'm2-02', 'fo', { noItems: true }, JSF]);
AUTO.push(['J stage m2-02 if → hali yo\'q', 'm2-02', 'if', { noItems: true }, JSF]);
AUTO.push(['J stage m2-04 if → bor', 'm2-04', 'if', { itemsHas: 'if' }, JSF]);
AUTO.push(['J arr.le → .length', null, 'arr.le', { itemsHas: '.length' }, JSF]);
AUTO.push(['J arr.le+Tab → arr.length', null, 'arr.le{Tab}', { value: 'arr.length' }, JSF]);
AUTO.push(['J fn+Tab → function', null, 'fn{Tab}', { valueStarts: 'function nom()' }, JSF]);
AUTO.push(['J pro+Tab → prompt("")', null, 'pro{Tab}', { value: 'prompt("")' }, JSF]);
AUTO.push(['J stage m1-04 (HTML darsi) le → jim', 'm1-04', 'le', { noItems: true }, JSF]);
AUTO.push(['J { juftlik regressiya', null, '{', { value: '{}' }, JSF]);
AUTO.push(['J Ctrl+/ regressiya', null, 'salom{Ctrl/}', { value: '// salom' }, JSF]);
AUTO.push(['J HTML faylida js so\'z yo\'q', null, 'le', { noItems: true }]);

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const errs = []; page.on('pageerror', (e) => errs.push(e.message));
const url = 'file://' + join(DIR, 'build', 'index.html');

async function run(seq) {
  const parts = seq.split(/(\{Tab\}|\{Enter\}|\{Esc\}|\{ShiftEnter\}|\{Ctrl\/\}|\{End\})/).filter(Boolean);
  for (const p of parts) {
    if (p === '{Tab}') await page.keyboard.press('Tab');
    else if (p === '{Enter}') await page.keyboard.press('Enter');
    else if (p === '{Esc}') await page.keyboard.press('Escape');
    else if (p === '{ShiftEnter}') await page.keyboard.press('Shift+Enter');
    else if (p === '{Ctrl/}') await page.keyboard.press('Control+/');
    else if (p === '{End}') await page.keyboard.press('End');
    else await page.keyboard.type(p, { delay: 25 });
  }
  await page.waitForTimeout(150);
}
async function snap() {
  return page.evaluate(() => {
    const m = document.querySelector('.hc-menu');
    const items = m ? [...m.querySelectorAll('.hc-menu-k')].map((x) => x.textContent) : null;
    const ta = document.querySelector('textarea.hc-code');
    return { items, value: ta ? ta.value : '(textarea yo\'q)' };
  });
}
const out = [];
for (const [name, , seq] of CASES) {
  await page.goto(url); await page.waitForSelector('textarea.hc-code', { timeout: 8000 });
  await page.click('textarea.hc-code');
  await run(seq);
  const r = await snap();
  out.push({ name, seq, ...r });
}
let pass = 0, fail = 0;
for (const [name, stage, seq, exp, file] of AUTO) {
  const qs = [stage ? 'stage=' + stage : '', file === 'style.css' ? 'css=1' : file === 'script.js' ? 'js=1' : ''].filter(Boolean).join('&');
  await page.goto(url + (qs ? '?' + qs : '')); await page.waitForSelector('textarea.hc-code', { timeout: 8000 });
  if (file) { try { await page.getByText(file, { exact: true }).first().click({ timeout: 2000 }); } catch (e) { fail++; console.log('❌ ' + name + ' — fayl yorlig\'i topilmadi: ' + file); continue; } }
  await page.click('textarea.hc-code');
  await run(seq);
  const r = await snap();
  const items = r.items || [];
  const probs = [];
  if (exp.noItems && r.items) probs.push('ro\'yxat chiqdi: ' + items.join(' '));
  if (exp.items && JSON.stringify(items) !== JSON.stringify(exp.items)) probs.push('ro\'yxat ' + JSON.stringify(items) + ' ≠ ' + JSON.stringify(exp.items));
  if (exp.itemsHas && !items.includes(exp.itemsHas)) probs.push('ro\'yxatda yo\'q: ' + exp.itemsHas + ' (' + items.join(' ') + ')');
  if (exp.itemsMin && items.length < exp.itemsMin) probs.push('band ' + items.length + ' < ' + exp.itemsMin);
  if (exp.value != null && r.value !== exp.value) probs.push('matn ' + JSON.stringify(r.value) + ' ≠ ' + JSON.stringify(exp.value));
  if (exp.valueStarts && !r.value.startsWith(exp.valueStarts)) probs.push('matn boshi ' + JSON.stringify(r.value.slice(0, 30)));
  if (probs.length) { fail++; console.log('❌ ' + name + ' — ' + probs.join(' · ')); } else pass++;
}
console.log(`\nAVTO-HOLATLAR: ${pass} ✓ · ${fail} ❌ (jami ${AUTO.length})`);
for (const [name, seq] of CSS_CASES) {
  await page.goto(url + '?css=1'); await page.waitForSelector('textarea.hc-code', { timeout: 8000 });
  // style.css yorlig'iga o'tish
  const tab = page.getByText('style.css', { exact: true }).first();
  try { await tab.click({ timeout: 2000 }); } catch (e) { out.push({ name, seq, items: null, value: 'style.css yorlig\'i topilmadi: ' + e.message.split('\n')[0] }); continue; }
  await page.click('textarea.hc-code');
  await run(seq);
  const r = await snap();
  out.push({ name, seq, ...r });
}
await browser.close();
writeFileSync(join(DIR, 'natija.json'), JSON.stringify({ out, errs }, null, 1));
for (const o of out) {
  const menu = o.items === null ? '— ro\'yxat YO\'Q' : (o.items.length ? o.items.join(' ') : '(bo\'sh)');
  console.log(`${o.name.padEnd(36)} | ${menu.padEnd(46)} | ${JSON.stringify(o.value)}`);
}
console.log('pageerror:', errs.length ? errs : 0);
if (fail || errs.length) process.exit(1);
