// PmLesson25 s8 — ikki akkordeon holati x 4 o'lcham
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const BS = String.fromCharCode(92);
const fwd = (p) => p.split(BS).join('/');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const target = process.env.TARGET || 'src/6-Modull/PmLesson25.jsx';
const src = readFileSync(target, 'utf8');
const lessonId = (/lessonId:\s*['"]([^'"]+)['"]/.exec(src) || [])[1];
const metaBlock = /const SCREEN_META = \[([\s\S]*?)\n\];/.exec(src);
const total = (metaBlock[1].match(/\{\s*id:/g) || []).length;
const TMP = mkdtempSync(join(tmpdir(), 'm25s8-'));
const entry = ["import React from 'react';","import { createRoot } from 'react-dom/client';",'import Lesson from ' + JSON.stringify(fwd(resolve(target))) + ';',"createRoot(document.getElementById('root')).render(React.createElement(Lesson, { lang: 'uz' }));"].join('\n');
const res = await build({ stdin: { contents: entry, resolveDir: process.cwd(), sourcefile: 'e.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', charset: 'utf8', write: false, logLevel: 'silent' });
// kirish-artefakt m6-12: uzun «hozir» ishi (eng og'ir holat)
const IN = JSON.stringify({ ufqlar: [{ ufq: 'hozir', ish: "sartaroshxona mijozlariga navbat eslatmasini yuborish" }], savedAt: Date.now() });
const click1 = async (pg, sel) => { const e = await pg.$(sel); if (e) { await e.click({ timeout: 1500 }).catch(() => {}); await pg.waitForTimeout(220); } };
const typeSave = async (pg, txt) => { await pg.fill('.reflect-input', txt).catch(() => {}); await pg.waitForTimeout(120); await click1(pg, '.wsp-save'); };
const T3 = ['41 odam tizimni ochdi', "41 odam navbat eslatmasini oldi", "tizim odamlarga eslatmani o'zi yetkazdi"];
const openY = async (pg) => click1(pg, '.wsx:not(.star) .wsx-toggle');
const openS = async (pg) => click1(pg, '.wsx.star .wsx-toggle');
const fill3 = async (pg) => { for (const t of T3) await typeSave(pg, t); await pg.waitForTimeout(900); const ov = await pg.$('.acu-overlay'); if (ov) { await ov.click({ timeout: 1500 }).catch(() => {}); await pg.waitForTimeout(700); } };
const CASES = [
  { nom: "bo'sh · ikkalasi yopiq", fn: async () => {} },
  { nom: "bo'sh · faqat Yordam", fn: async (pg) => { await openY(pg); } },
  { nom: "bo'sh · faqat Star",   fn: async (pg) => { await openS(pg); } },
  { nom: "bo'sh · ikkalasi",     fn: async (pg) => { await openY(pg); await openS(pg); } },
  { nom: '3 qator · ikkalasi yopiq', fn: async (pg) => { await fill3(pg); } },
  { nom: '3 qator · faqat Yordam',   fn: async (pg) => { await fill3(pg); await openY(pg); } },
  { nom: '3 qator · faqat Star',     fn: async (pg) => { await fill3(pg); await openS(pg); } },
  { nom: '3 qator · ikkalasi',       fn: async (pg) => { await fill3(pg); await openY(pg); await openS(pg); } },
  { nom: '2 qator · ikkalasi + uzun kiritish', fn: async (pg) => { await typeSave(pg, T3[0]); await typeSave(pg, T3[1]); await openY(pg); await openS(pg); await pg.fill('.reflect-input', "tizim odamlarga navbat eslatmasini o'zi yetkazganini ko'rsatadi").catch(() => {}); await pg.waitForTimeout(350); } },
];
const VIEWPORTS = [[1280, 800], [1366, 768], [1440, 900], [2560, 1440]];
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const bad = [];
for (const [w, h] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  for (const c of CASES) {
    const pg = await ctx.newPage();
    const seed = "localStorage.clear();localStorage.setItem('liveSession:" + lessonId + "','{\"mode\":\"self\"}');"
      + "localStorage.setItem('pm-m6d12-yol', " + JSON.stringify(IN) + ");"
      + "localStorage.setItem('ccProgress:" + lessonId + "', JSON.stringify({ screen: 8, answers: {}, earned: [], startedAt: Date.now(), total: " + total + ", savedAt: Date.now() }));";
    const page = join(TMP, 'p' + w + '_' + c.nom.replace(/[^a-z0-9]/gi, '') + '.html');
    writeFileSync(page, '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>' + seed + '<\/script><script>' + res.outputFiles[0].text + '<\/script></body></html>', 'utf8');
    await pg.goto('file:///' + fwd(page), { waitUntil: 'domcontentloaded', timeout: 25000 });
    await pg.waitForSelector('.lesson-root', { timeout: 15000 });
    await pg.waitForTimeout(650);
    await c.fn(pg);
    await pg.waitForTimeout(600);
    const m = await pg.evaluate(() => {
      const sc = document.querySelector('.stage-content'); const out = { sc: sc ? sc.scrollHeight - sc.clientHeight : -1, sh: document.documentElement.scrollHeight, ih: window.innerHeight, bh: document.body.scrollHeight, inner: [], openN: document.querySelectorAll('.wsx.open').length, bodyN: document.querySelectorAll('.wsx-body').length };
      document.querySelectorAll('*').forEach(el => { const d = el.scrollHeight - el.clientHeight; if (d > 0 && el.clientHeight > 0) out.inner.push(String(el.className || el.tagName).slice(0, 40) + '=+' + d); });
      return out;
    });
    const inner = m.inner.reduce((a, x) => Math.max(a, +x.split('=+')[1]), 0);
    const over = Math.max(0, Math.max(m.sh, m.bh) - m.ih, inner);
    const line = w + 'x' + h + ' [' + c.nom + '] SC=+' + Math.max(0, m.sc) + ' skroll=+' + over + ' ochiq=' + m.openN + '/' + m.bodyN + ' doc=' + m.sh + '/' + m.ih + (m.inner.length ? ' ichki=[' + m.inner.join(', ') + ']' : '');
    console.log((m.sc > 0 ? 'SKROLL ' : '  ok   ') + line);
    if (m.sc > 0) bad.push(line);
    await pg.close();
  }
  await ctx.close();
}
await browser.close();
console.log(bad.length ? 'JAMI: ' + bad.length : 'SKROLL 0 — toza');
