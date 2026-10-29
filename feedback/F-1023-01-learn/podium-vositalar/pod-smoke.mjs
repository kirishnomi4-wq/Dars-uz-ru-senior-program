// pod-smoke v2 (28.10, vaqtinchalik) — CodeStrike podium QA stsenariylari (Abdulloh PODIUM-01…04 + qayta qabul ro'yxati).
// Soxta Dars API + LMS join; o'quvchi 1-savolga javob beradi; keyin stsenariy. onFinished yuklari ushlanadi.
// Ishlatish: node .pod-smoke.mjs <dars.jsx> <stsenariy|all>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const file = process.argv[2] || 'src/1-Modull/InternetLesson.jsx';
const WANT = process.argv[3] || 'all';
const PIN = '900001', SID = '6f1c2e9a-1111-4222-8333-944455556666', BASE = 100;
const TMP = mkdtempSync(join(tmpdir(), 'pod-'));
process.on('exit', () => rmSync(TMP, { recursive: true, force: true }));
const row = (pid, q, correct, ms) => ({ player_id: pid, screen_idx: BASE + q, correct, elapsed_ms: ms, picked: 0 });
const pl = (id, nick, sec) => ({ id, nickname: nick, joined_at: `2026-10-28T09:00:${String(sec).padStart(2, '0')}Z` });
const P3 = [pl('p1', 'Ali', 2), pl('me', 'Sinov', 1), pl('p3', 'Vali', 3)];
// «me» — 1 to'g'ri (977 ochko); p1 — 2 to'g'ri tez (2100) → me 2-o'rin; p3 — 0
const FINAL2 = [row('p1', 0, true, 500), row('p1', 1, true, 500), row('me', 0, true, 700), row('p3', 0, false, 900)];
const INTERIM1 = [row('me', 0, true, 700), row('p3', 0, false, 900)]; // oraliq: p1 hali javob bermagan → me 1-o'rin

const SC = {
  normal: { players: P3, rows: () => FINAL2, flow: 'done-then-finish', want: { place: 2, screen: 2 } },
  place4: { players: [pl('p1', 'A', 2), pl('p2', 'B', 3), pl('p4', 'D', 4), pl('me', 'Sinov', 1), pl('p5', 'E', 5)],
    rows: () => [...['p1', 'p2', 'p4'].flatMap((p, i) => [row(p, 0, true, 500 + i * 100), row(p, 1, true, 600)]), row('me', 0, true, 700)], flow: 'done-then-finish', want: { place: null, screen: 4 } },
  delay: { players: P3, rows: (done) => (done ? FINAL2 : INTERIM1), delayAfterDone: 6000, flow: 'finish-right-after-done', want: { place: 2 } },
  fail: { players: P3, rows: (done) => (done ? FINAL2 : INTERIM1), failAfterDone: 3, flow: 'finish-right-after-done', want: { place: 2 } },
  early: { players: P3, rows: () => FINAL2, flow: 'finish-before-done', want: { place: 2 } },
  early_end: { players: P3, rows: () => FINAL2, flow: 'finish-before-end', want: { nopodium: true } },
  tie: { players: [pl('p1', 'Ali', 5), pl('me', 'Sinov', 1), pl('p3', 'Vali', 3)], rows: () => [row('p1', 0, true, 700), row('me', 0, true, 700)], flow: 'done-then-finish', want: { place: 1, screen: 1 } },
  pinjoin: { players: P3, rows: () => FINAL2, pin: true, flow: 'finish-before-done', want: { nopodium: true, nowait: true } },
  reload: { players: P3, rows: () => FINAL2, flow: 'done-reload-finish', want: { place: 2 } },
  shot: { players: P3, rows: () => FINAL2, flow: 'shot', want: { nopodium: true } },
  fallback: { players: P3, rows: () => FINAL2, flow: 'finish-skip', want: { nopodium: true } },
};

let S, C, cur, failLeft = 0;
const srv = createServer((req, res) => {
  const h = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS' };
  if (req.method === 'OPTIONS') { res.writeHead(204, h); return res.end(); }
  let b = ''; req.on('data', (c) => { b += c; });
  req.on('end', () => {
    const j = (o) => { res.writeHead(200, { ...h, 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
    const u = req.url;
    if (/\/lms\/join/.test(u)) return j({ mode: 'student', pin: PIN, playerId: 'me', playerToken: 'pt', nickname: 'Sinov', lastScreen: 0, maxScreen: 0, session_id: SID, attempt: { id: 'att1', status: 'active' }, progress: null });
    if (/\/rpc\/submit_answer/.test(u)) { C.submits++; res.writeHead(204, h); return res.end(); }
    if (/\/rpc\//.test(u)) { res.writeHead(204, h); return res.end(); }
    if (/\/session\//.test(u)) return j({ pin: PIN, lesson_id: null, status: S.status, quiz_state: S.quiz_state, quiz_q: S.quiz_q, updated_at: new Date().toISOString(), mentor_alive: true, cur_screen: total - 1, max_screen: total - 1 }); // mentor oxirgi ekranda (CodeStrike shu yerda)
    if (/\/players\//.test(u)) return j(cur.players);
    if (/\/answers\//.test(u)) {
      const done = S.quiz_state === 'done';
      if (done) C.ansAfterDone++;
      if (done && failLeft > 0) { failLeft--; C.failed++; res.writeHead(500, h); return res.end('{}'); }
      const send = () => j(cur.rows(done).filter((r) => r.player_id !== 'me' || C.submits > 0)); // o'quvchi javobi — u javob bergandan keyin
      if (done && cur.delayAfterDone) return setTimeout(send, cur.delayAfterDone);
      return send();
    }
    return j({});
  });
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const API_URL = `http://127.0.0.1:${srv.address().port}`;

const src = readFileSync(file, 'utf8');
const lessonId = /lessonId:\s*'([^']+)'/.exec(src)[1];
const total = [...((/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src) || [])[1] || '').matchAll(/\{\s*id:\s*'([^']+)'/g)].length;
const bundle = async (token) => (await build({
  stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(resolve(file))};
    window.__payloads = []; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz', liveToken: ${JSON.stringify(token)}, onFinished: (p) => { window.__payloads.push({ at: Date.now(), p: JSON.parse(JSON.stringify(p)) }); } }));`,
  resolveDir: process.cwd(), sourcefile: 'a.jsx', loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [resolve('node_modules')],
  loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' },
  define: { __DARS_API_URL__: JSON.stringify(API_URL) }, charset: 'utf8', write: false, logLevel: 'silent',
})).outputFiles[0].text;
const JS_LMS = await bundle(`x.${Buffer.from(JSON.stringify({ role: 'student' })).toString('base64url')}.y`);
const JS_PIN = await bundle(null);

const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
let bad = 0;
for (const [name, sc] of Object.entries(SC)) {
  if (WANT !== 'all' && WANT !== name) continue;
  cur = sc; S = { quiz_state: 'lobby', quiz_q: -1, status: 'live' }; C = { submits: 0, ansAfterDone: 0, failed: 0 }; failLeft = sc.failAfterDone || 0;
  const prog = { screen: total - 1, answers: {}, earned: [], total, savedAt: Date.now(), startedAt: Date.now() - 120000 };
  const pinSeed = sc.pin ? `localStorage.setItem('liveSession:${lessonId}', ${JSON.stringify(JSON.stringify({ mode: 'student', pin: PIN, playerId: 'me', playerToken: 'pt', nickname: 'Sinov' }))});` : '';
  const html = join(TMP, `${name}.html`);
  writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.clear();
    for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); }
    localStorage.setItem('liveLang','uz'); ${pinSeed} localStorage.setItem('ccProgress:${lessonId}', ${JSON.stringify(JSON.stringify(prog))}); }<\/script><script>${sc.pin ? JS_PIN : JS_LMS}<\/script></body></html>`);
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pg = await ctx.newPage();
  if (process.env.PODLOG) pg.on('console', (m) => { if (m.text().startsWith('[POD]')) console.log('   ', m.text()); });
  const errs = []; pg.on('pageerror', (e) => errs.push(String(e.message).slice(0, 160)));
  const wait = (ms) => pg.waitForTimeout(ms);
  const payloads = () => pg.evaluate(() => window.__payloads);
  const overlay = () => pg.locator('[data-live="podium-wait"]').count();
  const toastNow = () => pg.evaluate(() => { const t = document.querySelector('[data-live="toast"]'); return t && t.style.opacity === '1' ? t.textContent : ''; });
  const waitPayload = async (max = 30000) => { const t0 = Date.now(); while (!(await payloads()).length && Date.now() - t0 < max) await wait(300); return Math.round((Date.now() - t0) / 1000); };
  const finish = async () => {
    const x = pg.locator('.qz-x'); if (await x.count()) { await x.first().evaluate((el) => el.click()); await wait(700); }
    await pg.locator('button', { hasText: /yakunla/i }).first().evaluate((el) => el.click()); await wait(800);
    const d = pg.locator('button', { hasText: /^\s*tamom\s*$/i }).first(); if (await d.count()) await d.evaluate((el) => el.click());
    await wait(900);
  };
  const log = {}; let ok = true; const chk = (c, m) => { if (!c) { ok = false; log.xato = (log.xato ? log.xato + ' · ' : '') + m; } };
  try {
    await pg.goto('file://' + html, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await pg.waitForSelector('.lesson-root', { timeout: 20000 }); await wait(2500);
    await pg.waitForSelector('.cs-cap.cs-clickable', { timeout: 15000 }); await wait(600);
    await pg.locator('.cs-cap.cs-clickable').first().evaluate((el) => el.click());
    await pg.waitForSelector('.qz-arena', { timeout: 8000 });
    S.quiz_state = 'q'; S.quiz_q = 0;
    await pg.waitForSelector('.qz-tile:not([disabled])', { timeout: 10000 }); await wait(300);
    await pg.locator('.qz-tile').nth(1).click({ force: true }); await wait(500);
    S.quiz_state = 'r'; await wait(2600);
    if (sc.flow === 'done-then-finish') {
      S.quiz_state = 'done'; await wait(4000);
      log.ekran = (await pg.locator('.qz-mypl').first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
      await finish(); await wait(1500);
    } else if (sc.flow === 'finish-right-after-done') {
      S.quiz_state = 'done'; await wait(1400); // o'quvchi «yakunlandi»ni ko'rdi, yakuniy jadval hali kelmagan (kechikish / xato)
      await finish();
      log.ushlandi = { oyna: await overlay(), yuk: (await payloads()).length, xabar: await toastNow() };
      chk(log.ushlandi.oyna === 1 && log.ushlandi.yuk === 0, 'yakuniy jadvaldan oldin yuk ketdi yoki oyna yo\'q');
      log.kutildi_s = await waitPayload(); log.xabar_keyin = await toastNow();
    } else if (sc.flow === 'finish-before-done') {
      await finish();
      log.ushlandi = { oyna: await overlay(), yuk: (await payloads()).length, xabar: await toastNow() };
      if (sc.want.nowait) chk(log.ushlandi.oyna === 0 && log.ushlandi.yuk === 1, 'kutish bo\'lmasligi kerak edi');
      else { chk(log.ushlandi.oyna === 1 && log.ushlandi.yuk === 0, 'erta «Tamom» ushlanmadi'); S.quiz_state = 'done'; log.kutildi_s = await waitPayload(); log.xabar_keyin = await toastNow(); }
    } else if (sc.flow === 'finish-before-end') {
      await finish();
      log.ushlandi = { oyna: await overlay(), yuk: (await payloads()).length, xabar: await toastNow() };
      chk(log.ushlandi.oyna === 1 && log.ushlandi.yuk === 0, 'erta «Tamom» ushlanmadi');
      S.status = 'ended'; log.kutildi_s = await waitPayload(); log.xabar_keyin = await toastNow(); // mentor arenani yakunlamay sinfni yopdi
    } else if (sc.flow === 'done-reload-finish') {
      S.quiz_state = 'done'; await wait(5000); // o'rin yozildi, «Tamom» bosilmadi
      log.saqlov = await pg.evaluate((id) => JSON.parse(localStorage.getItem('ccDetails:' + id) || '{}').arenaPodium || null, lessonId);
      FINAL2.unshift(row('p3', 1, true, 300), row('p3', 2, true, 300)); // qayta yuklashdan keyin jadval o'zgardi — o'rin baribir o'zgarmasligi kerak
      await pg.reload({ waitUntil: 'domcontentloaded' }); await pg.waitForSelector('.lesson-root', { timeout: 20000 }); await wait(4000);
      await pg.screenshot({ path: '../pod-reload-oldin.png' }); log.tugmalar = await pg.evaluate(() => [...document.querySelectorAll('button')].map((b) => b.innerText.trim()).filter(Boolean).slice(-8));
      await finish(); await wait(1500); if (!(await payloads()).length) { await finish(); await wait(2500); } // 21-ekrandan avval oxirgi ekranga
      FINAL2.splice(0, 2);
    } else if (sc.flow === 'shot') {
      await finish();
      for (const [w, h] of [[1440, 900], [390, 844]]) { await pg.setViewportSize({ width: w, height: h }); await wait(800); await pg.screenshot({ path: `../pod-oyna-${w}.png` }); }
      S.status = 'ended'; await wait(6000);
    } else if (sc.flow === 'finish-skip') {
      await finish();
      chk((await overlay()) === 1 && (await payloads()).length === 0, 'erta «Tamom» ushlanmadi');
      await wait(30000); log.tugma30s = await pg.locator('[data-live="podium-skip"]').count();
      await wait(17000); log.tugma47s = await pg.locator('[data-live="podium-skip"]').count();
      chk(log.tugma30s === 0 && log.tugma47s === 1, 'zaxira tugma vaqti noto\'g\'ri');
      await pg.locator('[data-live="podium-skip"]').evaluate((el) => el.click()); await wait(1500);
    }
    const pls = await payloads();
    log.yuklar = pls.length; log.oyna_oxirida = await overlay();
    const csd = pls[0] && (pls[0].p.codestrike || pls[0].p.resultDetails?.codestrike);
    log.podium = csd ? (csd.podium ?? 'yo\'q') : 'yuk yo\'q';
    if (process.env.PODLOG) { log.cs = csd; log.saqlov2 = await pg.evaluate((id) => localStorage.getItem('ccDetails:' + id), lessonId); log.ls = await pg.evaluate((id) => localStorage.getItem('liveSession:' + id), lessonId); }
    log.chaqiruv = C;
    chk(pls.length >= 1, 'onFinished kelmadi');
    if (log.ushlandi && log.ushlandi.oyna === 1) chk(!log.ushlandi.xabar, `ushlanganda «yakunlandi» xabari: ${log.ushlandi.xabar}`);
    if ('xabar_keyin' in log) chk(/yakunlandi/i.test(log.xabar_keyin), `yuk ketgach xabar yo'q: «${log.xabar_keyin}»`);
    chk(log.oyna_oxirida === 0, 'oyna yopilmadi');
    if (pls.length > 1) chk(JSON.stringify(pls[0].p) === JSON.stringify(pls[pls.length - 1].p), 'qayta yuk boshqacha');
    if (sc.want.nopodium) chk(csd && csd.podium === undefined, 'podium bo\'lmasligi kerak');
    else {
      chk(csd && csd.podium && csd.podium.game_id === SID && csd.podium.finalized === true, 'podium/game_id yo\'q');
      chk(csd && csd.podium && csd.podium.place === sc.want.place, `place ${csd?.podium?.place} ≠ ${sc.want.place}`);
      if (sc.want.screen) chk(new RegExp(`${sc.want.screen}-o'rin`).test(log.ekran || ''), `ekran «${log.ekran}»`);
    }
    if (sc.failAfterDone) chk(C.failed === sc.failAfterDone, 'xato-javoblar soni');
    chk(!errs.length, 'sahifa xatosi: ' + errs[0]);
  } catch (e) { ok = false; log.xato = String(e.message).split('\n')[0]; log.errs = errs; log.dom = await pg.evaluate(() => ({ arena: document.querySelectorAll('.qz-arena').length, tiles: document.querySelectorAll('.qz-tile').length, txt: (document.querySelector('.qz-arena') || document.body).innerText.slice(0, 200) })).catch(() => null); }
  if (!ok) bad++;
  console.log(`${ok ? '✓' : '✗'} ${name} ${JSON.stringify(log)}`);
  await ctx.close();
}
await browser.close(); srv.close();
console.log(bad ? `${bad} stsenariy yiqildi` : 'hammasi o\'tdi');
process.exit(bad ? 1 : 0);
