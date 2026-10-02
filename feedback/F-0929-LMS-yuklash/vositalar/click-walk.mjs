// click-walk — LMS paketidagi .jsx ni brauzerda ekranma-ekran ochib, bosiladigan narsalarni bosadi,
// ish-vaqti xatolarini (pageerror + ErrorBoundary) yig'adi. Faqat o'qiydi, repo'ga yozmaydi.
//   node click-walk.mjs <out.json> <fayl...>
import * as esbuild from 'esbuild';
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = '/home/kali/Desktop/internetLesson';
const SCR = (process.env.LMS_OUT || '/tmp/lms-tekshir') + '/cw';
const [outFile, ...files] = process.argv.slice(2);
const CLICKS = Number(process.env.CLICKS || 6);
const PAR = Number(process.env.PAR || 5);
const LANG = process.env.LANG_ || 'uz';
mkdirSync(SCR, { recursive: true });

function meta(file) {
  const src = readFileSync(file, 'utf8');
  const lessonId = (/lessonId\s*:\s*['"]([^'"]+)['"]/.exec(src) || [])[1] || '';
  const sm = /SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src);
  const rows = sm ? [...sm[1].matchAll(/\{\s*id\s*:\s*['"]([^'"]+)['"]([^}]*)\}/g)].map(m => ({ id: m[1], type: (/type\s*:\s*['"]([^'"]+)/.exec(m[2]) || [])[1] || '' })) : [];
  return { lessonId, rows };
}

async function bundle(file, tag) {
  const dir = join(SCR, tag); mkdirSync(dir, { recursive: true });
  const entry = join(dir, 'entry.jsx');
  writeFileSync(entry, `import React from 'react';
import { createRoot } from 'react-dom/client';
import Lesson from ${JSON.stringify(resolve(file))};
class EB extends React.Component { constructor(p){super(p);this.state={e:null};} static getDerivedStateFromError(e){return {e};}
  componentDidCatch(e){ window.__ebErr = String(e && e.message || e); }
  render(){ return this.state.e ? React.createElement('div',{id:'eb-err'},'Darsda xatolik yuz berdi: '+String(this.state.e.message||this.state.e)) : this.props.children; } }
const q = new URLSearchParams(location.search);
const lang = q.get('lang') || 'uz', s = Number(q.get('s') || 0), id = q.get('id') || '', total = Number(q.get('total') || 0);
try { localStorage.clear(); localStorage.setItem('liveSession:' + id, '{"mode":"self"}');
  if (total) localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: s, answers: {}, earned: [], startedAt: Date.now(), total, savedAt: Date.now() }));
  localStorage.setItem('cc_lang', lang); } catch {}
createRoot(document.getElementById('root')).render(React.createElement(EB, null, React.createElement(Lesson, { lang })));
`);
  await esbuild.build({
    entryPoints: [entry], bundle: true, outfile: join(dir, 'bundle.js'), format: 'iife', platform: 'browser', target: 'es2020',
    jsx: 'automatic', logLevel: 'silent', charset: 'utf8',
    loader: { '.jsx': 'jsx', '.js': 'jsx', '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.gif': 'dataurl', '.webp': 'dataurl', '.mp3': 'dataurl' },
    define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env.MODE': '"production"', 'import.meta.env.DEV': 'false', 'import.meta.env.PROD': 'true', '__DARS_API_URL__': '""' },
    absWorkingDir: ROOT, nodePaths: [join(ROOT, 'node_modules')],
  });
  const html = join(dir, 'index.html');
  writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script src="bundle.js"></script></body></html>`);
  return html;
}

async function clickables(page) {
  return page.evaluate(() => {
    const root = document.querySelector('.lesson-root') || document.body;
    const bad = (el) => el.closest('nav,.nav,.stage-nav,.ach-counter,.zoom-btn,.live-badge,footer') || /orqaga|keyingi|назад|далее|boshlaymiz|yakunla|qaytadan|заново/i.test(el.innerText || '');
    const els = [...root.querySelectorAll('button:not([disabled]),[role=button]')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 12 && r.height > 12 && getComputedStyle(el).visibility !== 'hidden' && !bad(el); });
    document.querySelectorAll('[data-cw]').forEach(e => e.removeAttribute('data-cw'));
    els.forEach((el, i) => el.setAttribute('data-cw', String(i)));
    return els.map(e => (e.innerText || e.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 30));
  });
}

async function walk(browser, file) {
  const tag = basename(file, '.jsx') + '-' + Math.random().toString(36).slice(2, 7);
  const { lessonId, rows } = meta(file);
  const out = { file, lessonId, screens: rows.length, errors: [] };
  let html;
  try { html = await bundle(file, tag); } catch (e) { out.errors.push({ s: -1, kind: 'build', msg: String(e.message).slice(0, 200) }); return out; }
  const total = rows.length;
  const idxs = total ? [...Array(total).keys()] : [0];
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.route(/^https?:\/\//, r => r.abort()); // tarmoqqa chiqmaymiz
  const page = await ctx.newPage();
  let cur = null; const seen = new Set();
  page.on('pageerror', e => { if (cur) cur.push('pageerror: ' + String(e.message).split('\n')[0].slice(0, 160)); });
  for (const s of idxs) {
    const errs = []; cur = errs; const trail = [];
    const url = pathToFileURL(html).href + `?lang=${LANG}&s=${s}&id=${encodeURIComponent(lessonId)}&total=${total}`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForSelector('.lesson-root, #eb-err', { timeout: 12000 }).catch(() => errs.push('lesson-root chizilmadi'));
      await page.waitForTimeout(700);
      for (let c = 0; c < CLICKS; c++) {
        if (await page.$('#eb-err')) break;
        const labels = await clickables(page); if (!labels.length) break;
        const i = c % labels.length;
        trail.push(labels[i] || `#${i}`);
        try { await page.click(`[data-cw="${i}"]`, { timeout: 1200 }); } catch { continue; }
        await page.waitForTimeout(350);
      }
      await page.waitForTimeout(300);
      const eb = await page.evaluate(() => window.__ebErr || null);
      if (eb) errs.push('ErrorBoundary: ' + eb);
    } catch (e) { errs.push('walk: ' + String(e.message).split('\n')[0].slice(0, 120)); }
    const uniq = [...new Set(errs)].filter(m => !seen.has(m + s));
    if (uniq.length) out.errors.push({ s, id: rows[s]?.id, type: rows[s]?.type, msgs: uniq, trail });
  }
  cur = null;
  await ctx.close();
  return out;
}

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const results = []; let k = 0;
async function worker() { while (k < files.length) { const f = files[k++]; const r = await walk(browser, f); results.push(r); process.stdout.write(`${r.errors.length ? 'XATO' : ' ok '}  ${basename(f)}  (${r.screens} ekran)${r.errors.length ? '  → ' + r.errors.map(e => 's' + e.s + ':' + (e.msgs || [e.msg]).join(' | ')).join(' ;; ').slice(0, 300) : ''}\n`); } }
await Promise.all([...Array(PAR)].map(worker));
await browser.close();
writeFileSync(outFile, JSON.stringify(results.sort((a, b) => a.file.localeCompare(b.file)), null, 1));
console.log(`\nJAMI ${results.length} fayl · xatoli ${results.filter(r => r.errors.length).length}`);
