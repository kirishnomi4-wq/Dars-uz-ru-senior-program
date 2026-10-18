// Prod-paketdagi (yuklash-2026-10-04) har darsni brauzerda ochib, haqiqiy onFinished payload'ini yig'adi.
// Repo'ga yozmaydi, tarmoq to'silgan. Natija: <out>/payloads.json
// Ssenariylar: A = oddiy (uz/ru), B = «Qaytadan» bosilgan (retake), C = jonli o'quvchi (arena javoblari bilan).
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = '/home/kali/Desktop/internetLesson';
const [out, listFile] = process.argv.slice(2);
const rows = readFileSync(listFile, 'utf8').trim().split('\n').map((l) => l.split('|')).filter((r) => !/homework/.test(r[2]));
const OPTS = ['A', 'B', 'C', 'D', 'E', 'F'];

function parse(file) {
  const src = readFileSync(file, 'utf8');
  const lessonId = (/lessonId:\s*["']([^"']+)["']/.exec(src) || [])[1];
  const metaBody = (/SCREEN_META\d* = \[([\s\S]*?)\n\];/.exec(src) || [])[1] || '';
  const screens = [...metaBody.matchAll(/\{\s*id:\s*["']([^"']+)["']([^}]*)\}/g)].map((m) => ({ id: m[1], scored: /scored:\s*true/.test(m[2]) }));
  const keyBody = (/INLINE_KEYS\d* = \{([^}]*)\}/.exec(src) || [])[1] || '';
  const keys = Object.fromEntries([...keyBody.matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(-?\d+)/g)].map((m) => [m[1], Number(m[2])]));
  const achBody = (/ACHIEVEMENTS\d* = \{([\s\S]*?)\n\};/.exec(src) || [])[1] || '';
  const achIds = [...achBody.matchAll(/^\s*([A-Za-z0-9_]+):\s*\{/gm)].map((m) => m[1]);
  return { lessonId, screens, keys, achIds };
}

function seed(L, t0) {
  const answers = {}; const attempts = {}; let n = 0;
  L.screens.forEach((s, i) => {
    if (!s.scored) return;
    const idx = L.keys[s.id];
    if (!Number.isInteger(idx) || idx === -1) { answers[i] = { correct: true, picked: true, solved: true }; return; }
    const mode = n++ % 3; // 0 = birinchida to'g'ri · 1 = xato → to'g'ri · 2 = xato, oxirigacha yechmadi
    const wrong = (idx + 1) % 4, wrong2 = (idx + 2) % 4;
    const at = t0 + i * 20000;
    let list;
    if (mode === 0) list = [{ option: idx, answer: OPTS[idx], elapsed_ms: 4200, at }];
    else if (mode === 1) list = [{ option: wrong, answer: OPTS[wrong], elapsed_ms: 5100, at }, { option: wrong2, answer: OPTS[wrong2], elapsed_ms: 6800, at: at + 300 }, { option: idx, answer: OPTS[idx], elapsed_ms: 7400, at: at + 900 }];
    else list = [{ option: wrong, answer: OPTS[wrong], elapsed_ms: 3900, at }];
    const last = list[list.length - 1].option;
    attempts[i] = list;
    answers[i] = { question: `Savol ${s.id}`, options: OPTS.slice(0, 4), correctIndex: idx, correctAnswer: OPTS[idx], picked: list[0].option, lastPicked: last,
      studentAnswer: OPTS[last], correct: mode === 0, solved: last === idx };
  });
  return { answers, attempts };
}

const TMP = mkdtempSync('/tmp/claude-1000/-home-kali-Desktop-internetLesson/2f841897-da42-4686-8d68-caf06b7c15da/scratchpad/run-');
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
const results = [];
const SCEN = [
  { tag: 'A-uz', lang: 'uz', mode: 'self' },
  { tag: 'A-ru', lang: 'ru', mode: 'self' },
  { tag: 'B-retake', lang: 'uz', mode: 'self', retake: true },
  { tag: 'C-live', lang: 'uz', mode: 'student', arena: true },
];
for (const [mod, name, srcFile] of rows) {
  const file = join(ROOT, 'yuklash-2026-10-04', mod, name);
  const L = parse(file);
  const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(file)};
    window.__p = []; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: window.__lang, onFinished: (p) => { window.__p.push(JSON.stringify(p)); } }));`,
    resolveDir: ROOT, sourcefile: 'e.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [resolve(ROOT, 'node_modules')],
    loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' }).catch((e) => ({ err: e }));
  if (res.err) { results.push({ mod, name, srcFile, err: 'esbuild ' + String(res.err.message).slice(0, 100) }); continue; }
  const bundle = res.outputFiles[0].text;
  for (const S of SCEN) {
    const t0 = Date.parse('2026-10-12T05:00:00Z');
    const { answers, attempts } = seed(L, t0);
    const total = L.screens.length;
    const earned = L.achIds.slice(0, 3);
    const earnedAt = Object.fromEntries(earned.map((id, k) => [id, t0 + 60000 * (k + 1)]));
    const arena = S.arena ? { 0: { option: 1, correct: true, elapsed_ms: 3000, at: t0 + 500000 }, 1: { option: 2, correct: false, elapsed_ms: 8000, at: t0 + 520000 } } : {};
    const prog = { screen: total - 1, answers, earned, startedAt: t0, total, savedAt: t0 + 900000 };
    if (S.retake) prog.firstPass = { answers, earned };
    const ls = S.mode === 'self' ? { mode: 'self' } : { mode: 'student', pin: '123456', attemptId: 'att-1' };
    const sc = `window.__lang=${JSON.stringify(S.lang)};for(const r of ['mentor','learner','student','self'])localStorage.setItem('inetOnboarded_'+r,'1');localStorage.setItem('liveLang',${JSON.stringify(S.lang)});`
      + `localStorage.setItem('liveSession:${L.lessonId}',${JSON.stringify(JSON.stringify(ls))});localStorage.setItem('ccProgress:${L.lessonId}',${JSON.stringify(JSON.stringify(prog))});`
      + `localStorage.setItem('ccDetails:${L.lessonId}',${JSON.stringify(JSON.stringify({ v: 1, attempts, earnedAt, arena }))});`;
    const page = join(TMP, `${L.lessonId}-${S.tag}.html`);
    writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${sc}<\/script><script>${bundle}<\/script></body></html>`);
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.route(/^https?:\/\//, (r) => r.abort());
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(String(e.message).slice(0, 120)));
    let payload = null;
    try {
      await p.goto('file://' + page, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('.lesson-root', { timeout: 15000 }); await p.waitForTimeout(900);
      for (const re of [/yakunla|tugat|tamom|finish|заверш|законч|готово|keyingi dars|следующий урок|bezashni boshlash/i, /^\s*(tamom|готово|done)\s*$/i]) {
        if (payload) break;
        const loc = p.locator('button', { hasText: re }).last();
        if (await loc.count()) { await loc.evaluate((el) => el.click()); await p.waitForTimeout(800); }
        const all = await p.evaluate(() => window.__p); if (all.length) payload = JSON.parse(all[0]);
        if (!payload) { const d = p.locator('button', { hasText: /^\s*(tamom|готово|done)\s*$/i }).last(); if (await d.count()) { await d.evaluate((el) => el.click()); await p.waitForTimeout(800); const a2 = await p.evaluate(() => window.__p); if (a2.length) payload = JSON.parse(a2[0]); } }
      }
    } catch (e) { errs.push('harness ' + String(e.message).slice(0, 100)); }
    await ctx.close();
    results.push({ mod, name, srcFile, lessonId: L.lessonId, scen: S.tag, scored: L.screens.filter((s) => s.scored).length, errs, payload });
    process.stdout.write(payload ? '.' : 'x');
  }
}
await browser.close();
writeFileSync(join(out, 'payloads.json'), JSON.stringify(results));
console.log(`\n${results.length} yurish · payload ${results.filter((r) => r.payload).length}`);
