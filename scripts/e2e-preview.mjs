// ============================================================================
//  e2e-preview (F-1015) — LMS «Bilimlar bazasi» preview'i HAQIQIY brauzerda, lokal stekda.
//  Kontrakt: feedback/F-1015-preview/jsx_preview_mode_user_story_acceptance.md AC-01…AC-07 (AC-08/09 — tools/e2e-lms.mjs).
//
//  Talab (uchalasi ishlab turishi kerak — tools/e2e-lms.mjs bilan bir xil):
//    soxta LMS:  cd server && node tools/fake-school-api.mjs                       (port 3999)
//    server:     cd server && RESULT_LIVE_REPEAT=send node --env-file=.env src/index.js   (port 3001)
//    sayt:       DARS_API_URL=http://127.0.0.1:3001 npx vite --port 5300 --strictPort
//  Ishlatish:  CHROME=/usr/bin/google-chrome node scripts/e2e-preview.mjs
//
//  Dars avval build-lms bilan node_modules/.cache/lms-preview ga yig'iladi (LMS yig'ilgan faylni ochadi —
//  prop o'rami ham shu faylda). Preview sahifasi: /preview/ (preview/main.jsx).
// ============================================================================
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { buildBaza } from './preview-baza-build.mjs';

const CHROME = process.env.CHROME || '/usr/bin/google-chrome';
const BASE = process.env.BASE || 'http://localhost:5300';
const API = process.env.API || 'http://127.0.0.1:3001';
const FAKE = process.env.FAKE_API || 'http://127.0.0.1:3999';
const SRC = 'src/1-Modull/InternetLesson.jsx', LID = 'internet-01-v18', LAST = 21;
// Har yugurish — yangi papka: vite node_modules ichidagi faylni kuzatmaydi va keshlaydi, o'sha manzilda qayta yig'ilgan
// fayl ko'rinmay qoladi (eski yig'ma sinalardi — mutatsiya-sinovida ushlandi, F-1015-07).
const OUT = `node_modules/.cache/lms-preview/${Date.now()}`;
const GRN = '\x1b[32m', RED = '\x1b[31m', DIM = '\x1b[2m', R = '\x1b[0m';

const steps = [];
async function step(name, fn) {
  try { const extra = await fn(); steps.push(true); console.log(`${GRN}✓${R} ${name}${extra ? DIM + '  ' + extra + R : ''}`); }
  catch (e) { steps.push(false); console.log(`${RED}✗${R} ${name}\n   ${String(e?.message || e).slice(0, 400)}`); }
}
const mint = (args) => execFileSync(process.execPath, ['--env-file=.env', 'tools/mint-token.mjs', ...args], { cwd: 'server', encoding: 'utf8' }).trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = async () => (await (await fetch(`${FAKE}/_debug/results`, { headers: { authorization: 'Bearer sapi_x' } })).json());

for (const [label, url] of [['api', `${API}/api/v1/health`], ['sayt', BASE + '/'], ['soxta LMS', `${FAKE}/_debug/results`]]) {
  let up = false;
  for (let i = 0; i < 20 && !up; i++) { try { await fetch(url); up = true; } catch { await sleep(1000); } }
  if (!up) { console.error(`${label} javob bermayapti: ${url}`); process.exit(2); }
}

rmSync('node_modules/.cache/lms-preview', { recursive: true, force: true });
// MUTATSIYA: BAZA_LIVE=<o'zgarishsiz src/live nusxasi> — dars o'sha nusxa bilan, o'ramsiz yig'iladi (src/live joyida qoladi)
// Yig'ma LOKAL serverga qaraydi — sukut (prod) bilan yig'ilsa, mutatsiyada eski PIN so'rovlari prod dars-api'ga ketadi (F-1015-14)
process.env.DARS_API_URL = API;
if (process.env.BAZA_LIVE) { await buildBaza(SRC, `${OUT}/InternetLesson.jsx`, process.env.BAZA_LIVE); console.log(`${RED}MUTATSIYA: baza kodi (${process.env.BAZA_LIVE})${R}`); }
else execFileSync(process.execPath, ['scripts/build-lms.mjs', SRC], { env: { ...process.env, LMS_OUT_DIR: OUT, DARS_API_URL: API }, stdio: 'pipe' });
const JSX = `/${OUT}/InternetLesson.jsx`;
if (!process.env.BAZA_LIVE && !readFileSync(`${OUT}/InternetLesson.jsx`, 'utf8').includes('startLessonRun')) { console.error('yig\'mada preview-o\'ram yo\'q'); }
const previewUrl = (extra = '') => `${BASE}/preview/?jsx=${encodeURIComponent(JSX)}&visit_mode=preview&lang=uz${extra}`;

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const errors = [];
// Bitta kontekst = bitta kompyuter brauzeri (umumiy localStorage). Har sahifaning dars-api so'rovlari alohida sanaladi.
async function tab(ctx, label, url) {
  const page = await ctx.newPage();
  page.__api = [];
  page.on('request', (r) => { if (r.url().startsWith(API)) page.__api.push(r.method() + ' ' + r.url().slice(API.length)); });
  page.on('request', (r) => { if (/(dars-api|school-api|lms)\.coddycamp\.uz/.test(r.url())) errors.push(`[${label}] PROD so'rov: ${r.method()} ${r.url().slice(0, 80)}`); }); // F-1015-14
  page.on('pageerror', (e) => errors.push(`[${label}] ${String(e.message).slice(0, 120)}`));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|Download the React|ERR_|preload|Failed to load resource/i.test(m.text())) errors.push(`[${label}] ${m.text().slice(0, 120)}`); });
  page.on('dialog', (d) => d.accept());
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.lesson-root', { timeout: 20000 });
  await page.waitForTimeout(1200);
  return page;
}
const harness = (tok) => `${BASE}/lms-harness.html?lesson=m1-01&lang=uz&delay=300#token=${tok}`;
const badge = (p) => p.evaluate(() => (document.querySelector('.live-badge')?.innerText || '').replace(/\s+/g, ' ').trim());
const counter = (p) => p.evaluate(() => (document.querySelector('.lesson-root')?.innerText.match(/\b(\d\d)\s*\/\s*22\b/) || [])[1] || '');
// Mentor paneli belgilari (jonli darsda faqat mentor ko'radi): PIN-belgi, «Ko'rsatish», «Erkin qilish», «Natijani ochish»
const MENTOR_UI = /Kod:\s*\d|Ko'rsatish|Erkin qilish|Natijani ochish/;
const mentorUi = (p) => p.evaluate((src) => new RegExp(src).test(document.body.innerText || ''), MENTOR_UI.source);
const bothStores = (p) => p.evaluate(() => ({
  local: Object.fromEntries(Object.keys(localStorage).map((k) => [k, localStorage[k]])),
  session: Object.fromEntries(Object.keys(sessionStorage).map((k) => [k, sessionStorage[k]])),
}));
const realStore = (p) => p.evaluate(() => Object.fromEntries(Object.keys(localStorage).map((k) => [k, localStorage[k]]))); // nomli xossa — qatlamdan o'tmaydi

let pin = '', mentorTok = '', ctxT, mentorPage;
const mentorRpcToken = async () => JSON.parse((await realStore(mentorPage))[`liveSession:${LID}`] || '{}').token;

try {
  await step('tayyorgarlik: 861-guruhda eski jonli sessiya yopiladi', async () => {
    const tok = mint(['--role', 'mentor', '--sub', '145', '--gid', '861']);
    const r = await fetch(`${API}/api/v1/lms/join`, { method: 'POST', headers: { authorization: `Bearer ${tok}`, 'content-type': 'application/json' }, body: JSON.stringify({ lesson_id: LID }) });
    const j = await r.json();
    if (!r.ok) throw new Error(`join ${r.status}`);
    await fetch(`${API}/api/v1/live/rpc/end_session`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ p_pin: j.pin, p_token: j.token }) });
  });

  // O'qituvchining kompyuteri: Davomat'dan jonli dars ochilgan (mentor JWT), shu brauzerda keyin preview ochiladi
  ctxT = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  let ali, players0 = 0, session0 = null;
  await step('jonli dars ketmoqda: mentor (Davomat, JWT) + o\'quvchi Ali — nazorat: so\'rov hisoblagichi ishlaydi', async () => {
    mentorTok = mint(['--role', 'mentor', '--sub', '145', '--gid', '861', '--name', 'Test Mentor']);
    mentorPage = await tab(ctxT, 'mentor', harness(mentorTok));
    await mentorPage.waitForFunction(() => /Kod:/.test(document.querySelector('.live-badge')?.innerText || ''), null, { timeout: 15000 });
    pin = (await mentorPage.locator('.live-badge b').first().innerText()).replace(/\D/g, '');
    const ctxA = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    ali = await tab(ctxA, 'ali', harness(mint(['--role', 'student', '--sub', '34174', '--name', 'Ali Valiyev'])));
    await ali.waitForFunction(() => /Ali Valiyev/.test(document.querySelector('.live-badge')?.innerText || ''), null, { timeout: 15000 });
    players0 = (await (await fetch(`${API}/api/v1/live/players/${pin}`)).json()).length;
    session0 = await (await fetch(`${API}/api/v1/live/session/${pin}`)).json();
    if (!mentorPage.__api.length) throw new Error('mentor sahifasida dars-api so\'rovi yo\'q — hisoblagich ishlamayapti');
    return `PIN ${pin} · o'yinchi ${players0} · mentor so'rovlari ${mentorPage.__api.length}`;
  });

  let pv;
  const res0 = (await results()).length;
  await step('AC-05/AC-07: o\'sha brauzerda preview (CRM xato qilib token ham bersa) — jonli xonaga kirmaydi, PIN-oyna yo\'q, dars-api 0', async () => {
    pv = await tab(ctxT, 'preview', previewUrl(`&forceToken=1#token=${mentorTok}`));
    await pv.waitForTimeout(2500); // heartbeat/join bo'lganda ulgurardi
    const b = await badge(pv);
    if (!/Oldindan ko'rish/.test(b)) throw new Error(`belgi: «${b}»`);
    if (await pv.locator('input[placeholder="483 920"]').count()) throw new Error('PIN-oyna chiqdi');
    if (pv.__api.length) throw new Error(`dars-api so'rovlari: ${pv.__api.join(', ')}`);
    const players = (await (await fetch(`${API}/api/v1/live/players/${pin}`)).json()).length;
    const s = await (await fetch(`${API}/api/v1/live/session/${pin}`)).json();
    if (players !== players0) throw new Error(`o'yinchilar ${players0} → ${players}`);
    if (s.status !== 'live' || s.cur_screen !== session0.cur_screen) throw new Error(`sessiya o'zgardi: ${JSON.stringify({ status: s.status, cur: s.cur_screen })}`);
    if (!/Kod:/.test(await badge(mentorPage))) throw new Error('mentor sahifasi jonli holatdan chiqdi');
    return `belgi «${b}» · o'yinchi ${players} · sessiya live, ekran ${s.cur_screen}`;
  });

  // Preview'da tanishtiruv-oynasi (onboarding kaliti ham varaq xotirasida) bosishni to'sadi — bosish DOM orqali.
  // Javob belgisi: varaq xotirasidagi ccProgress.answers — dars yig'masining o'z saqlov adapteri orqali (F-1021-10:
  // Storage.prototype endi tegilmaydi, sahifa localStorage'i preview xotirasini ko'rmaydi; preview/main.jsx ochib beradi).
  const pick = (p) => p.evaluate(() => document.querySelectorAll('button.option')[1].click());
  const answered = (p) => p.evaluate((id) => Object.keys(JSON.parse((window.__ccLessonStorage || localStorage).getItem(`ccProgress:${id}`) || '{}').answers || {}), LID);

  await step('IT-4: preview\'da mentor paneli yo\'q (nazorat: o\'sha brauzerdagi mentor varag\'ida bor)', async () => {
    if (!pv) throw new Error('preview varag\'i ochilmadi');
    if (!(await mentorUi(mentorPage))) throw new Error('nazorat: mentor varag\'ida mentor paneli topilmadi — tekshiruv ishlamayapti');
    if (await mentorUi(pv)) throw new Error(`preview'da mentor paneli chiqdi: «${await badge(pv)}»`);
  });

  await step('AC-03: ikki preview-varaq — birida javob, ikkinchisi o\'zgarmaydi', async () => {
    const a = await tab(ctxT, 'pv-a', previewUrl(`&id=${LID}&seedScreen=4&total=22`));
    const b = await tab(ctxT, 'pv-b', previewUrl(`&id=${LID}&seedScreen=4&total=22`));
    if ((await counter(a)) !== '05' || (await counter(b)) !== '05') throw new Error(`urug' ishlamadi: A ${await counter(a)} · B ${await counter(b)}`);
    await pick(a);
    await a.waitForTimeout(900);
    const ansA = await answered(a), ansB = await answered(b);
    if (!ansA.includes('4')) throw new Error(`A javobi yozilmadi: [${ansA}]`);
    if (ansB.length) throw new Error(`B ga A javobi o'tdi: [${ansB}]`);
    const runA = await a.evaluate(() => window.__previewRunId), runB = await b.evaluate(() => window.__previewRunId);
    if (runA === runB) throw new Error('ikki varaqda bir xil previewRunId');
    if (a.__api.length || b.__api.length) throw new Error('dars-api so\'rovi ketdi');
    await a.close(); await b.close();
    return `A javoblari [${ansA}] · B [${ansB}]`;
  });

  await step('AC-04: F5 — yangi previewRunId, javob va ekran yo\'qoladi (toza boshlanish)', async () => {
    const p = await tab(ctxT, 'pv-f5', previewUrl(`&id=${LID}&seedScreen=4&total=22`));
    const run1 = await p.evaluate(() => window.__previewRunId);
    if ((await counter(p)) !== '05') throw new Error(`urug' ishlamadi: ${await counter(p)}`);
    await pick(p);
    await p.waitForTimeout(900);
    const ans1 = await answered(p);
    if (!ans1.includes('4')) throw new Error(`javob yozilmadi: [${ans1}]`);
    await p.goto(previewUrl(), { waitUntil: 'domcontentloaded' }); // LMS'dagi F5 — o'sha /preview manzili (sinov-urug'isiz)
    await p.waitForSelector('.lesson-root', { timeout: 20000 });
    await p.waitForTimeout(1200);
    const run2 = await p.evaluate(() => window.__previewRunId), ans2 = await answered(p), c2 = await counter(p);
    if (run1 === run2) throw new Error('F5 dan keyin previewRunId o\'sha');
    if (ans2.length || c2 !== '01') throw new Error(`F5 dan keyin eski holat: ekran ${c2}, javoblar [${ans2}]`);
    if (p.__api.length) throw new Error('dars-api so\'rovi ketdi');
    await p.close();
    return `run ${run1.slice(0, 8)} → ${run2.slice(0, 8)} · javoblar [${ans1}] → [${ans2}] · ekran 05 → ${c2}`;
  });

  await step('AC-01/AC-06: preview oxirigacha — «Tamom» ishlaydi, natija YARATILMAYDI (School API, dars-api jim)', async () => {
    const p = await tab(ctxT, 'pv-final', previewUrl(`&id=${LID}&seedScreen=${LAST}&total=22`));
    const clickLast = async (re) => { const l = p.locator('button', { hasText: re }).last(); if (!(await l.count())) return false; await l.evaluate((el) => el.click()); await p.waitForTimeout(800); return true; };
    if ((await counter(p)) !== '22') throw new Error(`oxirgi ekranga urug' ishlamadi: ${await counter(p)}`);
    if (!(await clickLast(/^\s*Tamom\s*$/))) { await clickLast(/yakunla|tugat/i); await clickLast(/^\s*Tamom\s*$/); }
    const calls = await p.evaluate(() => window.__finishedCalls);
    if (!calls) throw new Error(`onFinished chaqirilmadi — oxirgi ekranga yetilmadi (hisoblagich ${await counter(p)})`);
    await sleep(4000); // server navbati bo'lsa ulgursin
    const res1 = (await results()).length;
    if (res1 !== res0) throw new Error(`School API natijalari ${res0} → ${res1}`);
    if (p.__api.length) throw new Error(`dars-api: ${p.__api.join(', ')}`);
    await p.close();
    return `onFinished (LMS no-op) ${calls} marta · natijalar ${res0} → ${res1}`;
  });

  await step('manba: faqat visitMode prop (URL\'da belgi yo\'q) — preview yoqiladi', async () => {
    const p = await tab(ctxT, 'pv-prop', `${BASE}/preview/?jsx=${encodeURIComponent(JSX)}&prop=preview&lang=uz`);
    if (!(await p.locator('[data-live="badge-preview"]').count())) throw new Error(`belgi: «${await badge(p)}»`);
    if (p.__api.length) throw new Error('dars-api so\'rovi ketdi');
    await p.close();
  });

  await step('manba: URL\'dagi visit_mode=preview yolg\'iz (prop yo\'q) — preview YOQILMAYDI (F-1015-13)', async () => {
    const ctxU = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const p = await tab(ctxU, 'pv-url', previewUrl('&urlOnly=1'));
    if (await p.locator('[data-live="badge-preview"]').count()) throw new Error('URL bilan preview yoqildi');
    await ctxU.close();
  });

  await step('manba: window.__CC_VISIT_MODE__ yolg\'iz — preview YOQILMAYDI (IT: bitta source of truth)', async () => {
    const ctxW = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const p = await tab(ctxW, 'pv-window', `${BASE}/preview/?jsx=${encodeURIComponent(JSX)}&global=1&lang=uz`);
    if (await p.locator('[data-live="badge-preview"]').count()) throw new Error('window bilan preview yoqildi');
    await ctxW.close();
  });

  await step('IT-2: preview davomida localStorage VA sessionStorage\'ga hech narsa yozilmaydi (to\'liq surat, oldin = keyin)', async () => {
    const ctxS = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    // Urug' har kontekstda BIR MARTA (belgi localStorage'da — sessionStorage har varaqda alohida), qiymatlar o'zgarmas.
    // sessionStorage har yangi varaqda bir xil urug'lanadi — surat o'sha varaqning o'zida olinadi.
    await ctxS.addInitScript(([id]) => {
      if (!localStorage.getItem('__seededL')) {
        localStorage.setItem(`liveSession:${id}`, JSON.stringify({ mode: 'mentor', pin: '123456', token: 'eski' }));
        localStorage.setItem(`ccProgress:${id}`, JSON.stringify({ screen: 7, maxReached: 7, answers: { 4: { picked: 0 } }, total: 22, savedAt: 1792000000000 }));
        localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('lmsAuth', 'lms-kaliti'); localStorage.setItem('__seededL', '1');
      }
      if (!sessionStorage.getItem('__seededS')) { sessionStorage.setItem('ld-tahrir', 'eski'); sessionStorage.setItem('__seededS', '1'); }
    }, [LID]);
    const p0 = await ctxS.newPage(); await p0.goto(`${BASE}/preview/`); const before = await bothStores(p0); await p0.close();
    const p = await tab(ctxS, 'pv-store', previewUrl(`&id=${LID}&seedScreen=4&total=22&forceToken=1#token=${mentorTok}`));
    await pick(p); await p.waitForTimeout(800);
    await p.goto(previewUrl(`&id=${LID}&seedScreen=${LAST}&total=22`), { waitUntil: 'domcontentloaded' });
    await p.waitForSelector('.lesson-root', { timeout: 20000 }); await p.waitForTimeout(1200);
    const l = p.locator('button', { hasText: /^\s*Tamom\s*$/ }).last();
    if (await l.count()) { await l.evaluate((el) => el.click()); await p.waitForTimeout(800); }
    const after = await bothStores(p);
    const diff = [];
    for (const t of ['local', 'session']) for (const k of new Set([...Object.keys(before[t]), ...Object.keys(after[t])])) if (before[t][k] !== after[t][k]) diff.push(`${t}.${k}: ${String(before[t][k]).slice(0, 60)} → ${String(after[t][k]).slice(0, 60)}`);
    if (diff.length) throw new Error(`saqlov o'zgardi:\n   ${diff.join('\n   ')}`);
    if (p.__api.length) throw new Error('dars-api so\'rovi ketdi');
    await ctxS.close();
    return `local ${Object.keys(before.local).length} kalit, session ${Object.keys(before.session).length} kalit — o'zgarmadi`;
  });

  await step('AC-02: o\'sha kompyuterda o\'quvchi o\'z LMS\'ini ochadi — noldan (solo, 01-ekran), o\'qituvchi javoblari yo\'q', async () => {
    // Mentor varag'i oddiy dars — o'z ccProgress'ini (0-ekran) haqiqiy saqlovga yozadi. Preview izi = urug' ekranlari (4, 21),
    // javob (answers) yoki yakun-muhri (ccSeal/ccDetails — mentor darsni yakunlamagan).
    const real = await realStore(mentorPage);
    const prog = JSON.parse(real[`ccProgress:${LID}`] || '{}');
    const leaked = Object.keys(real).filter((k) => /^ccDetails:|^ccSeal:/.test(k));
    if (prog.screen || prog.maxReached || Object.keys(prog.answers || {}).length) leaked.push(`ccProgress ${JSON.stringify({ screen: prog.screen, max: prog.maxReached, answers: Object.keys(prog.answers || {}) })}`);
    if (leaked.length) throw new Error(`haqiqiy saqlovda preview izi: ${leaked.join(', ')}`);
    const sub = String(900000 + Math.floor(Math.random() * 90000)); // 862-guruh (jonli dars yo'q) → solo
    const ctxS = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const s = await tab(ctxS, 'student', harness(mint(['--role', 'student', '--sub', sub, '--name', 'Toza O\'quvchi'])));
    await s.waitForSelector('[data-live="badge-solo"]', { timeout: 15000 });
    const c = await counter(s);
    if (c !== '01') throw new Error(`o'quvchi ${c}-ekrandan boshladi`);
    await ctxS.close();
    return `belgi «${await badge(mentorPage)}» (mentor joyida) · o'quvchi 01/22 dan`;
  });

  await step('jonli dars oxirida ham butun: mentor heartbeat davom etadi, o\'yinchilar o\'zgarmagan', async () => {
    const s = await (await fetch(`${API}/api/v1/live/session/${pin}`)).json();
    const players = (await (await fetch(`${API}/api/v1/live/players/${pin}`)).json()).length;
    if (s.status !== 'live' || players !== players0) throw new Error(`status ${s.status} · o'yinchi ${players}`);
    await fetch(`${API}/api/v1/live/rpc/end_session`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ p_pin: pin, p_token: await mentorRpcToken() }) });
    return 'sessiya yopildi (tozalash)';
  });

  await step('konsol/sahifa xatolari yo\'q', async () => { if (errors.length) throw new Error(errors.slice(0, 5).join('\n   ')); });
} finally {
  await browser.close();
}
const okN = steps.filter(Boolean).length;
console.log(`\n===== E2E PREVIEW — ${okN}/${steps.length} ${okN === steps.length ? GRN + "O'TDI" : RED + 'YIQILDI'}${R}`);
process.exit(okN === steps.length ? 0 : 1);
