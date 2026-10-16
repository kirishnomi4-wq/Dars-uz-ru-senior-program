// F-1015-325 · «Uyga vazifa» 22px → 999px prototipi: fayl O'ZGARMAYDI — CSS brauzerda ustiga qo'yiladi (oldin/keyin surat, 1280 + 390)
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson', OUT = process.argv[2]; mkdirSync(OUT, { recursive: true });
const FILES = ['src/1-Modull/HtmlPractice.jsx', 'src/1-Modull/CssPractice.jsx', 'src/5-Modull/PmLesson19.jsx'];
const YANGI = `.hw-big { border-radius: 999px !important; } .hw-big-wrap::before { border-radius: 999px !important; } .screen:has(.hw-chips) .hw-big { border-radius: 999px !important; }`;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const rel of FILES) {
  const file = ROOT + '/' + rel, nom = rel.split('/').pop().replace('.jsx', '');
  const src = readFileSync(file, 'utf8');
  const id = /lessonId:\s*['"]([^'"]+)['"]/.exec(src)[1];
  const total = (/SCREEN_META\d* = \[([\s\S]*?)\n\];/.exec(src)[1].match(/\{\s*id:/g) || []).length;
  const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(file)};
    createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: () => {} }));`, resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' },
    bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
  const page = `${OUT}/${nom}.html`;
  writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
  for (const [w, h] of [[1280, 820], [390, 844]]) {
    for (const holat of ['oldin', 'keyin']) {
      const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.route(/^https?:\/\//, r => r.abort());
      await ctx.addInitScript(([id, t]) => { for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: t - 1, maxReached: t - 1, answers: {}, earned: [], startedAt: Date.now(), total: t, savedAt: Date.now() })); }, [id, total]);
      const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
      await p.goto('file://' + page); await p.waitForSelector('.lesson-root'); await p.waitForTimeout(1500);
      await p.evaluate(() => document.querySelector('.acu-overlay')?.click()); await p.waitForTimeout(300);
      if (holat === 'keyin') await p.addStyleTag({ content: YANGI });
      const el = p.locator('.hw-big').first();
      if (!(await el.count())) { console.log(nom, w, holat, 'hw-big YO\'Q', errs.join('|')); await ctx.close(); continue; }
      await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
      const m = await el.evaluate(e => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return { w: Math.round(r.width), h: Math.round(r.height), rad: cs.borderTopLeftRadius }; });
      // matn egri chetga tegmaydimi: matn chegarasi bilan yarim doira orasidagi eng kichik masofa
      const chet = await el.evaluate(e => { const r = e.getBoundingClientRect(); const R = Math.min(parseFloat(getComputedStyle(e).borderTopLeftRadius) || 0, r.height / 2); let min = 999;
        for (const t of e.querySelectorAll('.hw-big-t, .hw-big-s')) { const q = t.getBoundingClientRect(); for (const [x, y] of [[q.left, q.top], [q.left, q.bottom], [q.right, q.top], [q.right, q.bottom]]) { const cx = x < r.left + R ? r.left + R : x > r.right - R ? r.right - R : x; const cy = y < r.top + R ? r.top + R : y > r.bottom - R ? r.bottom - R : y; const d = R - Math.hypot(x - cx, y - cy); const lin = Math.min(x - r.left, r.right - x, y - r.top, r.bottom - y); min = Math.min(min, (x - cx || y - cy) ? d : lin); } } return Math.round(min); });
      const wrap = p.locator('.hw-big-wrap').first();
      await (await wrap.count() ? wrap : el).screenshot({ path: `${OUT}/${nom}-${w}-${holat}.png` });
      console.log(`${nom} ${w}px ${holat}: ${m.w}×${m.h} radius ${m.rad} · matn chetgacha ≥${chet}px · err ${errs.length}`);
      await ctx.close();
    }
  }
}
await b.close();
