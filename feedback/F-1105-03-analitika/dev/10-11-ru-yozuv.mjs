// RU o'quvchi haqiqiy brauzerda test variantini bosadi → bazadagi answer_attempts.texts UZ-etalonmi
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { execFileSync } from 'node:child_process';
import { build } from '/home/kali/Desktop/internetLesson/node_modules/esbuild/lib/main.js';
import { writeFileSync, readFileSync } from 'node:fs';
const totalOf = (f) => { const b = (/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(readFileSync('/home/kali/Desktop/internetLesson/' + f, 'utf8')) || [])[1] || ''; return [...b.matchAll(/\{\s*id:\s*'[^']+'/g)].length; };
const SRC = { 'm1-06': 'src/1-Modull/CssLesson1.jsx', 'm4-06': 'src/4-Modull/PostgresCrudLesson.jsx', 'm2-03': 'src/2-Modull/JsVarsLesson.jsx', 'm1-01': 'src/1-Modull/InternetLesson.jsx' };
async function pageFor(key, tok) {
  const res = await build({ stdin: { contents: "import React from 'react'; import { createRoot } from 'react-dom/client'; import L from " + JSON.stringify('/home/kali/Desktop/internetLesson/' + SRC[key]) + "; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'ru', liveToken: " + JSON.stringify(tok) + ", onFinished: () => {} }));", resolveDir: '/home/kali/Desktop/internetLesson', sourcefile: 'e.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', nodePaths: ['/home/kali/Desktop/internetLesson/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, define: { __DARS_API_URL__: JSON.stringify(API) }, charset: 'utf8', write: false, logLevel: 'silent' });
  const f = '/tmp/claude-1000/-home-kali-Desktop-internetLesson/85fa0ead-ac46-4b82-add2-427bd1037d2b/scratchpad/ru-' + key + '.html';
  writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>' + res.outputFiles[0].text.replace(/<\/script/g, '<\\/script') + '<\/script></body></html>');
  return 'file://' + f;
}
const API = 'http://127.0.0.1:3001', BASE = 'http://localhost:5300';
const CASES = [['m4-06', 'pg-crud-04-05-v18', 6, 's5b', 'Полностью удаляет'], ['m2-03', 'js-vars-01-v18', 4, 's4', 'Коробка'], ['m4-06', 'pg-crud-04-05-v18', 13, 's12', 'Запущу сразу']];
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--disable-web-security'] });
let bad = 0;
for (const [key, lid, idx, qid, opt] of CASES) {
  const sub = String(900000 + Math.floor(Math.random() * 90000));
  const tok = execFileSync(process.execPath, ['--env-file=.env', 'tools/mint-token.mjs', '--role', 'student', '--sub', sub, '--name', 'Ru Sinov'], { cwd: 'server', encoding: 'utf8' }).trim();
  const j = await (await fetch(`${API}/api/v1/lms/join`, { method: 'POST', headers: { authorization: `Bearer ${tok}`, 'content-type': 'application/json' }, body: JSON.stringify({ lesson_id: lid }) })).json();
  await fetch(`${API}/api/v1/me/progress`, { method: 'PUT', headers: { authorization: `Bearer ${tok}`, 'content-type': 'application/json' }, body: JSON.stringify({ lesson_id: lid, attempt_id: j.attempt.id, screen: idx, total: totalOf(SRC[key]), answers: {}, client_ts: Date.now() }) });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  await ctx.addInitScript(() => { for (const r of ['mentor', 'learner', 'student', 'self']) localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('liveLang', 'ru'); localStorage.setItem('cc_lang', 'ru'); });
  const p = await ctx.newPage();
  await p.goto(await pageFor(key, tok), { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.lesson-root', { timeout: 90000 }); await p.waitForTimeout(2500);
  const clicked = await p.evaluate((o) => { const b = [...document.querySelectorAll('.lesson-root button')].find((x) => (x.innerText || '').includes(o)); if (!b) return 'TOPILMADI: ' + [...document.querySelectorAll('.lesson-root button')].map((x) => x.innerText.trim().slice(0, 20)).join(' | ').slice(0, 200); b.click(); return b.innerText.trim().slice(0, 60); }, opt);
  await p.waitForTimeout(2500); await ctx.close();
  const q = `select t.texts from answer_attempts t join live_players lp on lp.pin = t.pin and lp.id = t.player_id where t.pin = '${j.pin}' and t.player_id = ${j.playerId} order by t.id desc limit 1`;
  let row = '';
  try { row = execFileSync('psql', ['postgres://dars:dars@127.0.0.1:5432/dars_test', '-Atc', `select texts::text from answer_attempts where pin = '${j.pin}' and player_id = '${j.playerId}' order by answered_at desc limit 1`], { encoding: 'utf8' }).trim(); } catch (e) { row = 'psql xato: ' + String(e.message).slice(0, 120); }
  const cyr = /[а-яё]/i.test(row);
  console.log(`${cyr || !row ? '✗' : '✓'} ${lid} ${qid} · bosildi «${clicked}» · bazada: ${row.slice(0, 260)}`);
  if (cyr || !row) bad++;
}
await browser.close();
console.log(bad ? `NATIJA ✗ ${bad}` : 'NATIJA ✓'); process.exit(bad ? 1 : 0);
