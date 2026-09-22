// ============================================================================
//  smoke-arena — ARENA AVTO-O'TISHINI haqiqiy brauzerda isbotlaydi (F-0922-03).
//
//  Nega kerak: arena uchun brauzer-sinovi YO'Q edi. `smoke-rejim` faqat ekran
//  chizilishini ko'radi, `ach-probe` esa topshiriq-ekranlarini. Avto-o'tish esa
//  VAQTGA bog'liq mantiq — ko'z bilan ham, esbuild bilan ham tutilmaydi.
//
//  Qanday ishlaydi: server o'rnida soxta HTTP-server turadi va jonli sessiya
//  holatini (`quiz_state`/`quiz_q`) o'zida saqlaydi — ya'ni mentor brauzeri
//  serverga nima yozsa, sinov shuni KO'RADI. Dars MENTOR rejimida ochiladi,
//  arena ishga tushiriladi va uch narsa o'lchanadi:
//
//    T1  savol vaqti tugadi        → `quiz_control` 'r' (javob ochildi)
//    T2  javob ochilgach ⏸ sanog'i → AUTO_NEXT_MS dan keyin `quiz_control` 'q' q+1
//    T3  ⏸ bosilsa (yopishqoq)     → avto o'tish YO'Q, tugma «▶ Avto» ga aylanadi
//
//  Ishlatish: CHROME=/usr/bin/google-chrome node scripts/smoke-arena.mjs <fayl…>
//  (fayl berilmasa — arenasi bor barcha darslar; sekin, chunki har savol 15 s)
// ============================================================================
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';
import { createServer } from 'node:http';

const R = '\x1b[31m', G = '\x1b[32m', D = '\x1b[2m', B = '\x1b[1m', X = '\x1b[0m';
const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!files.length) { console.error('fayl ko\'rsatilmadi'); process.exit(2); }
const PIN = '900001';
const TMP = mkdtempSync(join(tmpdir(), 'arena-'));
process.on('exit', () => rmSync(TMP, { recursive: true, force: true }));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(130));

// --- soxta server: sessiya holatini O'ZIDA saqlaydi ---
let S = { quiz_state: 'lobby', quiz_q: -1, rev: 0 };
const CALLS = [];
const srv = createServer((req, res) => {
  const h = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS' };
  if (req.method === 'OPTIONS') { res.writeHead(204, h); return res.end(); }
  let b = ''; req.on('data', (c) => { b += c; });
  req.on('end', () => {
    let body = null; try { body = b ? JSON.parse(b) : null; } catch { body = null; }
    const j = (o) => { res.writeHead(200, { ...h, 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
    if (/\/rpc\/quiz_control/.test(req.url)) {
      S = { quiz_state: body?.p_state ?? 'lobby', quiz_q: body?.p_q ?? -1, rev: S.rev + 1 };
      CALLS.push({ at: Date.now(), state: S.quiz_state, q: S.quiz_q });
      res.writeHead(204, h); return res.end();
    }
    if (/\/rpc\//.test(req.url)) { res.writeHead(204, h); return res.end(); }
    if (/\/session\//.test(req.url)) {
      return j({ pin: PIN, status: 'live', quiz_state: S.quiz_state, quiz_q: S.quiz_q, updated_at: new Date(Date.now()).toISOString(), mentor_alive: true });
    }
    // Lobbidagi «boshlash» tugmasi `players.length === 0` bo'lsa O'CHIQ — bitta soxta o'yinchi shart.
    if (/\/players\//.test(req.url)) return j([{ id: 'p1', nickname: 'Sinov', joined_at: new Date().toISOString() }]);
    if (/\/answers\//.test(req.url)) return j([]);
    return j({});
  });
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const API_URL = `http://127.0.0.1:${srv.address().port}`;
process.on('exit', () => srv.close());

const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
let bad = 0;

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const lessonId = (/lessonId:\s*'([^']+)'/.exec(src) || [])[1];
  const meta = (/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src) || [])[1] || '';
  const total = [...meta.matchAll(/\{\s*id:\s*'([^']+)'/g)].length;
  const quizMs = Number((/const QUIZ_MS = (\d+)/.exec(src) || [])[1] || 15000);
  const autoMs = Number((/AUTO_NEXT_MS = (\d+)/.exec(readFileSync('src/live/useAutoNext.js', 'utf8')) || [])[1] || 6000);
  const name = basename(file, '.jsx');
  if (!lessonId || !total) { console.log(`${R}✗${X} ${name} — lessonId/SCREEN_META topilmadi`); bad++; continue; }

  const res = await build({
    stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(resolve(file))};
      createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', onFinished: () => {} }));`,
    resolveDir: process.cwd(), sourcefile: 'a.jsx', loader: 'jsx' },
    bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [resolve('node_modules')],
    loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' },
    define: { __DARS_API_URL__: JSON.stringify(API_URL) }, charset: 'utf8', write: false, logLevel: 'silent',
  });
  const prog = { screen: total - 1, answers: {}, earned: [], total, savedAt: Date.now(), startedAt: Date.now() - 120000 };
  const seed = `localStorage.clear();
    for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); }
    localStorage.setItem('liveLang','uz');
    localStorage.setItem('liveSession:${lessonId}', ${JSON.stringify(JSON.stringify({ mode: 'mentor', pin: PIN, token: 'probe-token' }))});
    localStorage.setItem('ccProgress:${lessonId}', ${JSON.stringify(JSON.stringify(prog))});`;
  const p = join(TMP, `${name}.html`);
  writeFileSync(p, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${seed}<\/script><script>${res.outputFiles[0].text}<\/script></body></html>`);

  S = { quiz_state: 'lobby', quiz_q: -1, rev: 0 }; CALLS.length = 0;
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', (e) => errs.push(String(e.message).slice(0, 120)));
  const fail = (m) => { console.log(`${R}✗${X} ${B}${name}${X} — ${m}`); bad++; };
  try {
    await pg.goto('file://' + p, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await pg.waitForSelector('.lesson-root', { timeout: 20000 });
    // arenani ochish (CODE STRIKE gerbi yakun sahifasida)
    // `.cs-cap` uzluksiz animatsiyada — Playwright «stable» kutib qotib qoladi, shuning uchun force.
    await pg.waitForSelector('.cs-cap.cs-clickable', { timeout: 15000 });
    await pg.waitForTimeout(1200);
    await pg.locator('.cs-cap.cs-clickable').first().click({ timeout: 8000, force: true });
    await pg.waitForSelector('.qz-arena', { timeout: 8000 });
    // lobbidan 1-savolni boshlash
    await pg.waitForTimeout(600);
    await pg.locator('.qz-btn.big').first().click({ timeout: 8000, force: true });
    await pg.waitForFunction(() => !!document.querySelector('.qz-timer'), null, { timeout: 8000 });

    // --- T1: savol vaqti tugadi → javob ochildi ('r') ---
    await pg.waitForFunction(() => !!document.querySelector('.qz-auto'), null, { timeout: quizMs + 8000 });
    const t1 = CALLS.some((c) => c.state === 'r');
    // --- T2: ⏸ sanog'i ko'rinadi va avto o'tish sodir bo'ladi ---
    const yorliq = (await pg.locator('.qz-auto').first().innerText().catch(() => '')) || '';
    // SHOT=<papka> — javob ekranini sanoq bilan suratga oladi (ko'z bilan tekshirish uchun)
    if (process.env.SHOT) { mkdirSync(process.env.SHOT, { recursive: true }); await pg.waitForTimeout(1500); await pg.screenshot({ path: join(process.env.SHOT, `${name}-reveal.png`) }); }
    const sanoqBor = /\d/.test(yorliq);
    const oldin = CALLS.filter((c) => c.state === 'q').length;
    await pg.waitForFunction((n) => true, null, { timeout: 100 }).catch(() => {});
    await new Promise((r) => setTimeout(r, autoMs + 3000));
    const t2 = CALLS.filter((c) => c.state === 'q').length > oldin;
    // --- T3: ⏸ bosildi → yopishqoq, avto o'tish YO'Q ---
    let t3 = false, t3yorliq = '';
    await pg.waitForFunction(() => !!document.querySelector('.qz-timer'), null, { timeout: 10000 }).catch(() => {});
    await pg.waitForFunction(() => !!document.querySelector('.qz-auto'), null, { timeout: quizMs + 8000 }).catch(() => {});
    if (await pg.locator('.qz-auto').first().isVisible().catch(() => false)) {
      await pg.locator('.qz-auto').first().click({ timeout: 5000, force: true });
      t3yorliq = (await pg.locator('.qz-auto').first().innerText().catch(() => '')) || '';
      const oldin3 = CALLS.filter((c) => c.state === 'q').length;
      await new Promise((r) => setTimeout(r, autoMs + 4000));
      t3 = CALLS.filter((c) => c.state === 'q').length === oldin3 && /Avto/i.test(t3yorliq);
    }
    const ok = t1 && sanoqBor && t2 && t3 && !errs.length;
    if (ok) console.log(`${G}✓${X} ${B}${name}${X} ${D}· T1 javob-ochildi · T2 avto-o'tish (${autoMs / 1000}s) · T3 ⏸ yopishqoq${X}`);
    else fail(`T1 ${t1 ? '✓' : '✗'} · sanoq ${sanoqBor ? '✓' : `✗ («${yorliq.trim()}»)`} · T2 avto ${t2 ? '✓' : '✗'} · T3 ⏸ ${t3 ? '✓' : `✗ («${t3yorliq.trim()}»)`}${errs.length ? ` · xato: ${errs[0]}` : ''}`);
  } catch (e) {
    // Yiqilganda TASHXIS: qaysi element yo'q ekanini aytadi — aks holda «timeout» dan
    // sabab topilmaydi va debug skripti soxta-serversiz noto'g'ri yo'lga olib ketadi.
    const dom = await pg.evaluate(() => ({
      arena: document.querySelectorAll('.qz-arena').length,
      cap: document.querySelectorAll('.cs-cap.cs-clickable').length,
      big: [...document.querySelectorAll('.qz-btn.big')].map((b) => `${b.innerText.slice(0, 22)}${b.disabled ? '[o\'chiq]' : ''}`),
      timer: document.querySelectorAll('.qz-timer').length,
      auto: document.querySelectorAll('.qz-auto').length,
    })).catch(() => null);
    if (process.env.SHOT) { mkdirSync(process.env.SHOT, { recursive: true }); await pg.screenshot({ path: join(process.env.SHOT, `${name}-FAIL.png`) }).catch(() => {}); }
    fail(String(e.message).split('\n')[0].slice(0, 110) + ` · DOM: ${JSON.stringify(dom)} · rpc: ${JSON.stringify(CALLS.slice(0, 4))}` + (errs.length ? ` · sahifa-xato: ${errs[0]}` : ''));
  }
  await ctx.close();
}
await browser.close();
console.log(`\n===== ${files.length - bad}/${files.length} dars arena-sinovidan o'tdi`);
process.exit(bad ? 1 : 0);
