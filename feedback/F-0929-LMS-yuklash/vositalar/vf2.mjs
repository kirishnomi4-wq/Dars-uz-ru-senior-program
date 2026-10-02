import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
const HERE = new URL('.', import.meta.url).pathname; // vositalar papkasi (lms-host.css shu yerda)
const SP = process.env.LMS_OUT || '/tmp/lms-tekshir'; // chiqish: bundle, skrinshot
// ishlatish: node vf2.mjs <src.jsx> <idx> <mode: act|css> <arg>
const [file, idx, mode, arg] = process.argv.slice(2);
const src = readFileSync(file, 'utf8');
const lessonId = (/lessonId\s*:\s*['"]([^'"]+)['"]/.exec(src) || [])[1];
const total = ((/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src) || [])[1] || '').split('\n').filter(l => /\{\s*id\s*:/.test(l)).length;
const html = join(SP, 'vf', basename(file, '.jsx'), 'index.html'); // verify-fixed.mjs yig'ib qo'ygan (LMS CSS bilan)
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
await ctx.route(/^https?:\/\//, r => r.abort());
const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.goto(pathToFileURL(html).href + `?s=${idx}&id=${encodeURIComponent(lessonId)}&total=${total}`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.lesson-root'); await page.waitForTimeout(1200);
if (mode === 'act') {
  for (const a of JSON.parse(arg)) {
    await page.evaluate((a) => {
      const root = document.querySelector('.lesson-root');
      const els = [...root.querySelectorAll(a.sel)].filter(e => !a.re || new RegExp(a.re).test(e.innerText.replace(/\s+/g, ' ')));
      els.forEach(e => e.click());
    }, a);
    await page.waitForTimeout(a.wait || 500);
  }
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => [...document.querySelectorAll('.lesson-root .is-fixed')].map(el => {
    const r = el.getBoundingClientRect(), p = el.parentElement.getBoundingClientRect();
    const sib = [...el.parentElement.children].filter(x => x !== el).map(x => x.getBoundingClientRect());
    return { cls: el.className.slice(0, 40), pos: getComputedStyle(el).position, w: Math.round(r.width), parW: Math.round(p.width),
      overlap: sib.some(b => Math.min(r.bottom, b.bottom) - Math.max(r.top, b.top) > 3 && Math.min(r.right, b.right) - Math.max(r.left, b.left) > 3) }; }));
  const stray = await page.evaluate(() => [...document.querySelectorAll('.lesson-root *')].filter(e => e.classList.contains('fixed')).length);
  console.log(basename(file), 'act →', JSON.stringify(r), 'fixed-sinf qoldig\'i:', stray, errs.length ? 'ERR ' + errs.join('|') : '');
} else {
  const r = await page.evaluate((sel) => {
    let el = document.querySelector('.lesson-root ' + sel); let synth = false; if (!el) { const host = document.querySelector('.lesson-root .screen') || document.querySelector('.lesson-root'); const box = document.createElement('div'); box.className = sel.includes('dbg-line') ? 'dbg-code' : ''; box.style.width = '400px'; el = document.createElement('div'); el.className = sel.replace(/\./g, ' ').trim(); el.textContent = 'sinov qatori'; box.appendChild(el); host.appendChild(box); synth = true; }
    const m = () => { const cs = getComputedStyle(el), r = el.getBoundingClientRect(); return { pos: cs.position, w: Math.round(r.width), bg: cs.backgroundColor }; };
    el.style.transition = "none"; const base = m(); el.classList.add("fixed"); const old = m(); el.classList.remove("fixed"); el.classList.add("is-fixed"); const nw = m(); el.classList.remove("is-fixed");
    return { synth, base, eski_fixed: old, yangi_isfixed: nw, uslub_ulandi: nw.bg !== base.bg };
  }, arg);
  console.log(basename(file), 'css', arg, '→', JSON.stringify(r));
}
await browser.close();
