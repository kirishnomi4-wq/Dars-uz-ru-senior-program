// F-1015-385 · yig'iq prompt oynasi ruscha: har darsning har ekranida «Ko'rish» bo'lsa — ochib, o'zbekcha qoldiq va [object Object] tekshiriladi. Chaqirish: node …/f385-ru.mjs <chiqish> <fayl...>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson';
const [,, OUT, ...FILES] = process.argv; mkdirSync(OUT, { recursive: true });
const UZ = /\b(va|uchun|bilan|qiling|yozing|bosing|sahifa\w*|bo'lim\w*|kerak|emas|qo'sh|yoz|qaytar|bo'lsin|ko'rsatsin)\b/i;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
let jami = 0, yomon = 0;
for (const f of FILES) {
  const FILE = ROOT + '/' + f; const nom = f.split('/').pop().replace('.jsx', ''); const ID = readFileSync(FILE, 'utf8').match(/lessonId:\s*['"]([^'"]+)['"]/)[1];
  const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)}; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'ru' }));`, resolveDir: ROOT, loader: 'jsx' },
    bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
  const page = `${OUT}/${nom}.html`; writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
  let JAMI = 0;
  { const ctx = await b.newContext(); await ctx.route(/^https?:\/\//, (r) => r.abort()); await ctx.addInitScript((id) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, ID);
    const p = await ctx.newPage(); await p.goto('file://' + page); await p.waitForTimeout(1100); JAMI = +((await p.evaluate(() => (document.body.innerText.match(/\b\d\d\s*\/\s*(\d\d)\b/) || [])[1])) || 0); await ctx.close(); }
  for (let i = 1; i < JAMI; i++) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 820 } }); await ctx.route(/^https?:\/\//, (r) => r.abort());
    await ctx.addInitScript(([id, i, t]) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: i, maxReached: i, answers: {}, earned: [], startedAt: Date.now(), total: t, savedAt: Date.now() })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, [ID, i, JAMI]);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + page); await p.waitForTimeout(1000);
    const kk = await p.$$('.pk-kor');
    for (let k = 0; k < kk.length; k++) {
      await p.locator('.pk-kor').nth(k).click(); await p.waitForTimeout(350);
      const t = await p.innerText('.am-tt-oyna');
      const q = t.split('\n').filter(l => UZ.test(l)); jami++;
      const bad = q.length || t.includes('[object Object]') || errs.length; if (bad) yomon++;
      console.log(bad ? '❌' : '✅', nom, 'ekran', i + 1, 'prompt', k + 1, bad ? (q.slice(0, 2).join(' ‖ ') + (errs[0] || '')) : t.split('\n')[2]?.slice(0, 60));
      await p.keyboard.press('Escape'); await p.waitForTimeout(250);
    }
    await ctx.close();
  }
}
await b.close(); console.log(`${jami - yomon}/${jami}`);
