// ============================================================================
//  shot-mentor-panel — MENTOR statistikasi panelini suratga oladi (F-0922-04).
//
//  Nega alohida skript: bu panel faqat MENTOR rejimida, test ekranida, javoblar
//  kelgandan va «Natijani ochish» bosilgandan KEYIN chiqadi. `shot-screen` uni
//  ololmaydi (u `self` rejimda ochadi), `smoke-rejim` esa faqat yiqilmasligini
//  ko'radi. Ohang tuzatilgan matn (KORPUS §190) aynan shu panelda turadi va u
//  proyektorda ko'rinadi — shuning uchun ko'z bilan tekshirilishi kerak.
//
//  Soxta server kerakli javoblarni qaytaradi: `--wrong <n>` — nechtasi xato
//  (foizni pasaytirib «need» darajasini chiqarish uchun).
//
//  Ishlatish: CHROME=… node scripts/shot-mentor-panel.mjs <fayl> <ekran> [--lang ru] [--wrong 4]
// ============================================================================
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';
import { createServer } from 'node:http';

const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 && a[i + 1] ? a[i + 1] : d; };
const file = a[0];
const screen = Number(a[1] ?? 3);
const LANG = opt('--lang', 'uz');
const WRONG = Number(opt('--wrong', '4'));
const PIN = '900001';

const src = readFileSync(file, 'utf8');
const lessonId = (/lessonId:\s*'([^']+)'/.exec(src) || [])[1];
const meta = (/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src) || [])[1] || '';
const total = [...meta.matchAll(/\{\s*id:\s*'([^']+)'/g)].length;

// Panel foizni `picked` ni darsning O'Z kalitiga solishtirib hisoblaydi — `correct` maydoniga
// emas. Shuning uchun kalit manbadan o'qiladi, xato javob esa undan FARQLI qilib beriladi
// (birinchi urinishda teskari qo'yilib, 20% o'rniga 80% chiqqandi).
const sid = ([...meta.matchAll(/\{\s*id:\s*'([^']+)'/g)][screen] || [])[1] || `s${screen}`;
const keys = Object.fromEntries([...((/const INLINE_KEYS = \{([^}]*)\}/.exec(src) || [])[1] || '').matchAll(/(\w+):\s*(-?\d+)/g)].map((m) => [m[1], Number(m[2])]));
const KEY = keys[sid] ?? 0;
const players = Array.from({ length: 5 }, (_, i) => ({ id: `p${i}`, nickname: `O'quvchi ${i + 1}`, joined_at: new Date().toISOString() }));
const answers = players.map((p, i) => ({ player_id: p.id, screen_idx: screen, picked: i < WRONG ? (KEY === 0 ? 1 : 0) : KEY, correct: i >= WRONG, elapsed_ms: 3000 + i * 400 }));

const srv = createServer((req, res) => {
  const h = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS' };
  if (req.method === 'OPTIONS') { res.writeHead(204, h); return res.end(); }
  let b = ''; req.on('data', (c) => { b += c; });
  req.on('end', () => {
    const j = (o) => { res.writeHead(200, { ...h, 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
    if (/\/rpc\//.test(req.url)) { res.writeHead(204, h); return res.end(); }
    if (/\/session\//.test(req.url)) return j({ pin: PIN, status: 'live', quiz_state: 'off', quiz_q: -1, updated_at: new Date().toISOString(), mentor_alive: true });
    if (/\/players\//.test(req.url)) return j(players);
    if (/\/answers\//.test(req.url)) return j(answers);
    return j({});
  });
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const API_URL = `http://127.0.0.1:${srv.address().port}`;

const res = await build({
  stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(resolve(file))};
    createRoot(document.getElementById('root')).render(React.createElement(L, { lang: ${JSON.stringify(LANG)}, onFinished: () => {} }));`,
  resolveDir: process.cwd(), sourcefile: 'm.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [resolve('node_modules')],
  loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' },
  define: { __DARS_API_URL__: JSON.stringify(API_URL) }, charset: 'utf8', write: false, logLevel: 'silent',
});

const TMP = mkdtempSync(join(tmpdir(), 'mpanel-'));
const prog = { screen, answers: {}, earned: [], total, savedAt: Date.now(), startedAt: Date.now() - 60000 };
const seed = `localStorage.clear();
  for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); }
  localStorage.setItem('liveLang', ${JSON.stringify(LANG)});
  localStorage.setItem('liveSession:${lessonId}', ${JSON.stringify(JSON.stringify({ mode: 'mentor', pin: PIN, token: 't' }))});
  localStorage.setItem('ccProgress:${lessonId}', ${JSON.stringify(JSON.stringify(prog))});`;
const p = join(TMP, 'p.html');
writeFileSync(p, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${seed}<\/script><script>${res.outputFiles[0].text}<\/script></body></html>`);

const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
const pg = await (await browser.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
const errs = [];
pg.on('pageerror', (e) => errs.push(String(e.message).slice(0, 110)));
await pg.goto('file://' + p, { waitUntil: 'domcontentloaded', timeout: 25000 });
await pg.waitForSelector('.lesson-root', { timeout: 20000 });
await pg.waitForTimeout(2600);
const rev = pg.locator('.mstats-reveal').first();
if (await rev.isVisible().catch(() => false)) { await rev.click({ force: true }); await pg.waitForTimeout(1800); }
// Hukm-matni sahifa ostida qoladi — surat olishdan oldin ko'rinishga suriladi (aks holda
// skrinshot pastki qismni ko'rsatmaydi va «ko'z bilan ko'rdim» degan gap quruq bo'ladi).
await pg.locator('.mstats-verdict-t, .mstats-warn').first().scrollIntoViewIfNeeded().catch(() => {});
await pg.waitForTimeout(700);
const shot = join(TMP, `${basename(file, '.jsx')}-s${screen}-${LANG}.png`);
await pg.screenshot({ path: shot });
const bor = await pg.evaluate(() => ({
  verdict: (document.querySelector('.mstats-verdict-t') || {}).textContent || '',
  warn: (document.querySelector('.mstats-warn') || {}).textContent || '',
}));
console.log('panel:', JSON.stringify(bor), '· xato:', errs.length ? errs[0] : "yo'q");
console.log(shot);
await browser.close(); srv.close();
