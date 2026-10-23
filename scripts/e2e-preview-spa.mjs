// ============================================================================
//  e2e-preview-spa (F-1021-08/09) — LMS QA topgan ikki defekt HAQIQIY brauzerda: sahifa qayta yuklanmaydi (SPA),
//  eski dars unmount, o'sha yig'ilgan JSX yangi proplar bilan mount (preview/main.jsx → window.__ccLaunch).
//  Server kerak emas: yig'ma ishlamaydigan manzilga qaraydi — jonli rejimda so'rov URINISHI sanaladi, preview'da 0 bo'lishi shart.
//
//  Talab:      npx vite --port 5300 --strictPort
//  Ishlatish:  CHROME=/usr/bin/google-chrome node scripts/e2e-preview-spa.mjs
//  Mutatsiya:  PREBUILT=<eski koddan yig'ilgan papka> — eski mantiqda Defekt 1 va 2 qadamlari yiqilishi kerak
// ============================================================================
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { rmSync, cpSync } from 'node:fs';

const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const BASE = process.env.BASE || 'http://localhost:5300';
const API = 'http://127.0.0.1:9'; // hech kim tinglamaydi — so'rov urinishi ko'rinadi, javob yo'q
const SRC = 'src/1-Modull/InternetLesson.jsx', LID = 'internet-01-v18';
const OUT = `node_modules/.cache/lms-spa/${Date.now()}`;
const GRN = '\x1b[32m', RED = '\x1b[31m', DIM = '\x1b[2m', R = '\x1b[0m';
const steps = [];
async function step(name, fn) {
  try { const extra = await fn(); steps.push(true); console.log(`${GRN}✓${R} ${name}${extra ? DIM + '  ' + extra + R : ''}`); }
  catch (e) { steps.push(false); console.log(`${RED}✗${R} ${name}\n   ${String(e?.message || e).slice(0, 400)}`); }
}

rmSync('node_modules/.cache/lms-spa', { recursive: true, force: true });
// PREBUILT=<tayyor yig'ma papka> — o'sha yig'ma sinaladi (mutatsiya: eski kod alohida git worktree'da yig'iladi)
if (process.env.PREBUILT) { cpSync(process.env.PREBUILT, OUT, { recursive: true }); console.log(`${RED}TAYYOR YIG'MA: ${process.env.PREBUILT}${R}`); }
else execFileSync(process.execPath, ['scripts/build-lms.mjs', SRC], { env: { ...process.env, LMS_OUT_DIR: OUT, DARS_API_URL: API }, stdio: 'pipe' });
const JSX = `/${OUT}/InternetLesson.jsx`;

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const api = [], errors = [];
page.on('request', (r) => { if (r.url().startsWith(API)) api.push(r.method() + ' ' + r.url().slice(API.length)); });
page.on('request', (r) => { if (/(dars-api|school-api|lms)\.coddycamp\.uz/.test(r.url())) errors.push(`PROD so'rov: ${r.url().slice(0, 80)}`); });
page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 160)));
page.on('dialog', (d) => d.accept());

const counter = () => page.evaluate(() => (document.querySelector('.lesson-root')?.innerText.match(/\b(\d\d)\s*\/\s*22\b/) || [])[1] || '');
const previewBadge = () => page.locator('[data-live="badge-preview"]').count();
const answered = () => page.evaluate((id) => Object.keys(JSON.parse(localStorage.getItem(`ccProgress:${id}`) || '{}').answers || {}), LID);
const realProg = () => page.evaluate((id) => localStorage[`ccProgress:${id}`] ?? null, LID); // nomli xossa — qatlamdan o'tmaydi
const runId = (s) => `spa-${s}-${Math.random().toString(36).slice(2)}-0000000000`;
async function launch(props) {
  await page.evaluate((p) => window.__ccLaunch(p), props);
  await page.waitForSelector('.lesson-root', { timeout: 20000 });
  await page.waitForTimeout(1500);
}

try {
  let realBefore = null;
  await step('tayyorgarlik: preview A (ru) — 02/22, javob bor', async () => {
    await page.goto(`${BASE}/preview/?jsx=${encodeURIComponent(JSX)}&visit_mode=preview&lang=ru&id=${LID}&seedScreen=1&total=22`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.lesson-root', { timeout: 20000 });
    await page.waitForTimeout(1500);
    realBefore = await realProg();
    await page.evaluate(() => document.querySelectorAll('button.option')[1]?.click());
    await page.waitForTimeout(900);
    const c = await counter(), a = await answered();
    if (c !== '02') throw new Error(`ekran ${c}`);
    if (!(await previewBadge())) throw new Error('preview belgisi yo\'q');
    return `ekran ${c} · javoblar [${a}]`;
  });

  await step('Defekt 1 (AC-1/AC-2): SPA → preview B (uz, yangi previewRunId) — 01/22, A javoblari yo\'q', async () => {
    await launch({ lang: 'uz', visitMode: 'preview', previewRunId: runId('b'), liveToken: null });
    const c = await counter(), a = await answered();
    if (c !== '01' || a.length) throw new Error(`yangi preview eski holatdan: ekran ${c}, javoblar [${a}]`);
    if (!(await previewBadge())) throw new Error('preview belgisi yo\'q');
    if (api.length) throw new Error(`preview'da so'rov: ${api.join(', ')}`);
    return `ekran ${c} · javoblar [${a}]`;
  });

  await step('Defekt 2 (AC-3): SPA → mentor (preview proplarisiz, token bilan) — preview belgisi YO\'Q, jonli yo\'l ishlaydi', async () => {
    const before = api.length;
    const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
    const tok = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ role: 'mentor', sub: '1', exp: 4102444800 })}.sig`; // sintetik — server yo'q
    await launch({ lang: 'uz', liveToken: tok });
    await page.waitForTimeout(1500);
    if (await previewBadge()) throw new Error('mentor ishga tushirishida «Oldindan ko\'rish» belgisi qoldi');
    const tries = api.slice(before);
    if (!tries.length) throw new Error('jonli so\'rov urinishi yo\'q — dars preview\'dagidek jim');
    return `so'rov urinishlari: ${tries.slice(0, 3).join(', ')}`;
  });

  await step('AC-5: SPA → yana preview C — 01/22, so\'rov 0, haqiqiy ccProgress preview\'da o\'zgarmaydi', async () => {
    await page.waitForTimeout(500);
    const real0 = await realProg();
    const before = api.length;
    await launch({ lang: 'uz', visitMode: 'preview', previewRunId: runId('c'), liveToken: null });
    await page.evaluate(() => document.querySelectorAll('button.option')[1]?.click());
    await page.waitForTimeout(2500);
    const c = await counter(), real1 = await realProg();
    if (!(await previewBadge())) throw new Error('preview belgisi yo\'q');
    const tries = api.slice(before);
    if (tries.length) throw new Error(`preview C'da so'rov: ${tries.join(', ')}`);
    if (real0 !== real1) throw new Error(`haqiqiy ccProgress o'zgardi: ${String(real0).slice(0, 60)} → ${String(real1).slice(0, 60)}`);
    return `ekran ${c} · haqiqiy ccProgress o'zgarmadi (preview A oldidan: ${realBefore === null ? 'yo\'q' : 'bor'})`;
  });
} finally {
  if (errors.length) { steps.push(false); console.log(`${RED}✗ sahifa xatolari:${R}\n   ${errors.slice(0, 6).join('\n   ')}`); }
  await browser.close();
  rmSync('node_modules/.cache/lms-spa', { recursive: true, force: true });
}
const ok = steps.filter(Boolean).length;
console.log(`\n${ok === steps.length ? GRN : RED}${ok}/${steps.length}${R}`);
process.exit(ok === steps.length ? 0 : 1);
