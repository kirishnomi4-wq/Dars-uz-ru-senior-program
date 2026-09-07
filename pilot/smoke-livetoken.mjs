// PILOT smoke — pilot/InternetLesson.liveToken.jsx ni haqiqiy brauzerda 3 holatda ochadi:
//   A) liveToken yo'q            → «kelmadi» belgisi, dars oddiy ishlaydi
//   B) to'g'ri shakldagi JWT     → «keldi ✅» + role/sub/name/kid
//   C) buzuq token               → «format xato», oq ekran yo'q
//   D) prop null → keyin keladi  → belgi yangilanadi (useEffect reaksiyasi)
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHmac } from 'node:crypto';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ROOT = process.cwd();
const TARGET = ROOT + '/pilot/InternetLesson.liveToken.jsx';
const TMP = mkdtempSync(join(tmpdir(), 'lt-smoke-'));

// Sinov-JWT — SINOV kaliti bilan (real secret EMAS); imzo baribir tekshirilmaydi.
const b64u = (s) => Buffer.from(s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const now = Math.floor(Date.now() / 1000);
const mk = (claims, header = { alg: 'HS256', typ: 'JWT', kid: 'v1' }) => {
  const h = b64u(JSON.stringify(header)), p = b64u(JSON.stringify(claims));
  const sig = createHmac('sha256', 'sinov-kalit').update(h + '.' + p).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${h}.${p}.${sig}`;
};
const STUDENT = mk({ sub: '34174', role: 'student', name: 'Sinov O‘quvchi', crm_id: 17226, iss: 'coddycamp-lms', aud: 'dars-platform', iat: now, nbf: now, exp: now + 43200, jti: 'e3f1c2d4-0000-4000-8000-000000000001' });
const MENTOR = mk({ sub: '145', role: 'mentor', name: 'Sinov Mentor', gid: 861, iss: 'coddycamp-lms', aud: 'dars-platform', iat: now, nbf: now, exp: now + 43200, jti: 'e3f1c2d4-0000-4000-8000-000000000002' });

const res = await build({
  stdin: {
    contents: `
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Lesson from ${JSON.stringify(TARGET)};
function Host() {
  const [tok, setTok] = useState(window.__INIT_TOKEN ?? null);
  useEffect(() => { window.__setTok = setTok; }, []);
  return React.createElement(Lesson, { lang: 'uz', liveToken: tok });
}
createRoot(document.getElementById('root')).render(React.createElement(Host));
`,
    resolveDir: ROOT, sourcefile: 'entry.jsx', loader: 'jsx',
  },
  bundle: true, format: 'iife', jsx: 'automatic', charset: 'utf8', write: false, logLevel: 'silent',
});
const page = (initTok) => `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div>
<script>localStorage.setItem('liveSession:internet-01-v18','{"mode":"self"}');window.__INIT_TOKEN=${JSON.stringify(initTok)};<\/script>
<script>${res.outputFiles[0].text}<\/script></body></html>`;

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const run = async (label, initTok, after) => {
  const f = join(TMP, label + '.html'); writeFileSync(f, page(initTok), 'utf8');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const pg = await ctx.newPage(); const errs = [];
  pg.on('pageerror', (e) => errs.push('PAGEERROR: ' + String(e.message).slice(0, 120)));
  pg.on('console', (m) => { if (m.type() === 'error' && !/favicon|Download the React|net::ERR/i.test(m.text())) errs.push('CONSOLE: ' + m.text().slice(0, 120)); });
  await pg.goto('file:///' + f.replace(/\\/g, '/'), { waitUntil: 'domcontentloaded' });
  await pg.waitForSelector('.lesson-root', { timeout: 15000 });
  if (after) { await after(pg); }
  await pg.waitForTimeout(500);
  const badge = await pg.evaluate(() => { const els = [...document.querySelectorAll('.lesson-root > div')]; const b = els.find(e => /LMS-token/.test(e.innerText)); return b ? b.innerText.replace(/\n/g, ' | ') : '(belgi yo‘q)'; });
  const rootText = await pg.evaluate(() => (document.querySelector('.lesson-root')?.innerText || '').length);
  // Token DOM'dan tashqarida hech qayerga chiqmaganini tekshirish: sahifa HTML'ida to'liq token satri yo'q
  const leaked = await pg.evaluate((t) => t ? document.documentElement.outerHTML.includes(t) : false, initTok || '');
  const shot = join(TMP, label + '.png'); await pg.screenshot({ path: shot });
  console.log(`\n[${label}] root=${rootText} belgi: ${badge}\n   xatolar: ${errs.length ? errs.join('; ') : 'yo‘q'} · token DOM'ga sizdi: ${leaked} · rasm: ${shot}`);
  await ctx.close();
};
await run('A-tokensiz', null);
await run('B-student', STUDENT);
await run('B2-mentor', MENTOR);
await run('C-buzuq', 'abc.def');
await run('D-keyin-keladi', null, async (pg) => { await pg.evaluate((t) => window.__setTok(t), STUDENT); await pg.waitForTimeout(300); });
await browser.close();
