#!/usr/bin/env node
// B06 oldindan tekshiruv (11.11): CRM «Браузер» tekshiruvining B06 qoidasiga yaqinlashtirilgan —
// «Содержимое выходит за экран, но прокрутки нет» (element pastki cheti > oyna balandligi va uni ko'rsatadigan skroll yo'q).
// Yig'ilgan dars faylini (yakka/*.jsx) headless Chrome'da 1440×900 (uz) va 390×844 (ru) da ochadi, har ekranga
// ccProgress orqali o'tadi (hech narsa bosilmaydi) va chetga chiqqan elementlarni yozadi. Darslarga TEGMAYDI.
// Ishlatish: node b06-tekshir.mjs <yakka/…jsx> [boshqalar…]   (CHROME=/usr/bin/google-chrome)
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';

const ROOT = '/home/kali/Desktop/internetLesson';
const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const TMP = mkdtempSync(join(tmpdir(), 'b06-'));
const SSENARIY = [{nom: '1440-uz', w: 1440, h: 900, lang: 'uz'}, {nom: '390-ru', w: 390, h: 844, lang: 'ru'}];
const files = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: CHROME, headless: true });

const OLCH = () => {
  const H = window.innerHeight, out = [];
  const docScroll = () => {
    const de = document.scrollingElement || document.documentElement;
    const oh = (e) => getComputedStyle(e).overflowY;
    return de.scrollHeight > H + 1 && !/hidden|clip/.test(oh(document.documentElement)) && !/hidden|clip/.test(oh(document.body));
  };
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
    if (cs.position === 'fixed' && el.closest('[aria-hidden="true"]')) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1 || r.bottom <= H + 1) continue;
    if (el.children.length && [...el.children].some(c => c.getBoundingClientRect().bottom > H + 1)) continue; // eng ichki element
    let a = el.parentElement, ok = null;
    while (a && a !== document.body) {
      const s = getComputedStyle(a);
      if (/auto|scroll/.test(s.overflowY) && a.scrollHeight > a.clientHeight + 1) { ok = 'skroll'; break; }
      if (/hidden|clip/.test(s.overflowY) && a.getBoundingClientRect().bottom <= H + 1) { ok = 'kesilgan'; break; }
      a = a.parentElement;
    }
    if (!ok && docScroll()) ok = 'hujjat-skroll';
    if (!ok) out.push({tag: el.tagName, cls: String(el.className || '').slice(0, 40), past: Math.round(r.bottom), matn: (el.textContent || '').trim().slice(0, 50)});
  }
  return {H, out: out.slice(0, 6), n: out.length};
};

for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const lessonId = (/lessonId:\s*['"]([^'"]+)['"]/.exec(src) || [])[1] || '';
  const res = await build({
    stdin: { contents: `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport Lesson from ${JSON.stringify(resolve(f))};\n` +
      `createRoot(document.getElementById('root')).render(React.createElement(Lesson, window.__PROPS));\n`, resolveDir: ROOT, sourcefile: 'b06.jsx', loader: 'jsx' },
    bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [join(ROOT, 'node_modules')], charset: 'utf8', write: false, logLevel: 'silent',
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const js = res.outputFiles[0].text;
  const natija = {fayl: basename(f), lessonId, ssenariy: {}};
  for (const S of SSENARIY) {
    const ctx = await browser.newContext({ viewport: { width: S.w, height: S.h } });
    const yomon = [];
    let total = null;
    for (let i = 0; i < (total || 80); i++) {
      const p = join(TMP, `${basename(f)}-${S.nom}-${i}.html`);
      const seed = `localStorage.setItem('ccProgress:${lessonId}', JSON.stringify({screen:${i},answers:{},earned:[],startedAt:Date.now(),total:${total || 80},savedAt:Date.now()}));`;
      writeFileSync(p, `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0"><div id="root"></div>` +
        `<script>${seed}window.__PROPS=${JSON.stringify({lang: S.lang})};<\/script><script>${js}<\/script></body></html>`);
      const pg = await ctx.newPage();
      await pg.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
      await pg.goto('file://' + p, { waitUntil: 'load' });
      await pg.waitForTimeout(900);
      const m = await pg.evaluate(OLCH);
      // ekranlar soni: ccProgress dars yozgan total
      if (total === null) { try { const pr = await pg.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), 'ccProgress:' + lessonId); if (pr && pr.total) total = pr.total; } catch (e) {} }
      if (m.n) yomon.push({ekran: i, ...m});
      await pg.close();
      if (total === null && i > 3) total = 80;
    }
    natija.ssenariy[S.nom] = {ekranlar: total, yomon};
    await ctx.close();
  }
  const jami = Object.values(natija.ssenariy).reduce((s, x) => s + x.yomon.length, 0);
  console.log(`${jami ? '✗' : '✓'} ${natija.fayl} — ` + Object.entries(natija.ssenariy).map(([k, v]) => `${k}: ${v.yomon.length ? 'ekran ' + v.yomon.map(y => y.ekran).join(',') : 'toza'} (${v.ekranlar})`).join(' · '));
  for (const [k, v] of Object.entries(natija.ssenariy)) for (const y of v.yomon.slice(0, 2)) console.log(`    ${k} #${y.ekran}: ${JSON.stringify(y.out.slice(0, 2))}`);
}
await browser.close();
