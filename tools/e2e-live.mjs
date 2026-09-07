// ============================================================================
//  e2e-live — HAQIQIY brauzerda jonli-dars oqimi: mentor → o'quvchi → darvoza → erkin qilish → o'zim ko'raman.
//  Yangi dars-api (server/) + src/live/ moduli birga ishlashini isbotlaydi (Supabase'siz).
//
//  Talab (ikkalasi ishlab turishi kerak):
//    server:  cd server && node --env-file=.env src/index.js            (LIVE_MENTOR_CODE=MENTOR-DEV)
//    sayt:    DARS_API_URL=http://127.0.0.1:3001 npx vite --port 5300 --strictPort
//  Ishlatish:
//    node tools/e2e-live.mjs [darsKaliti=m1-01]
//  Sozlash: BASE, API, MENTOR_CODE env'lari.
// ============================================================================
import { chromium } from 'playwright-core';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.BASE || 'http://localhost:5300';
const API = process.env.API || 'http://127.0.0.1:3001';
const MENTOR_CODE = process.env.MENTOR_CODE || 'MENTOR-DEV';
const KEY = process.argv[2] || 'm1-01';
const URL = `${BASE}/#/lesson/${KEY}`;
const GRN = '\x1b[32m', RED = '\x1b[31m', DIM = '\x1b[2m', R = '\x1b[0m';

const steps = [];
const ok = (name, extra = '') => { steps.push({ name, ok: true }); console.log(`${GRN}✓${R} ${name}${extra ? DIM + '  ' + extra + R : ''}`); };
const fail = (name, err) => { steps.push({ name, ok: false }); console.log(`${RED}✗${R} ${name}\n   ${String(err?.message || err).slice(0, 300)}`); };
async function step(name, fn) { try { const extra = await fn(); ok(name, extra || ''); } catch (e) { fail(name, e); throw e; } }

// Server tayyorligini kutish
for (const [label, url] of [['api', `${API}/api/v1/health`], ['sayt', BASE + '/']]) {
  let up = false;
  for (let i = 0; i < 20 && !up; i++) { try { up = (await fetch(url)).ok; } catch { await new Promise((r) => setTimeout(r, 1000)); } }
  if (!up) { console.error(`${label} javob bermayapti: ${url}`); process.exit(2); }
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const errors = [];
async function newRole(label) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  // onboarding-tur (TourGuide) bosishlarni to'smasin
  await ctx.addInitScript(() => { for (const r of ['mentor', 'learner', 'student', 'self']) localStorage.setItem('inetOnboarded_' + r, '1'); });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`[${label}] ${String(e.message).slice(0, 120)}`));
  // «Failed to load resource: 400» — kutilgan domen-xato (masalan «Bu ism band»), brauzer buni ham error deb yozadi
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|Download the React|ERR_|preload|Failed to load resource/i.test(m.text())) errors.push(`[${label}] ${m.text().slice(0, 120)}`); });
  page.on('dialog', (d) => d.accept()); // «O'quvchilarni ozod qilasizmi?» — window.confirm
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.lesson-root', { timeout: 20000 });
  return { ctx, page };
}
const badgeText = (page) => page.locator('.live-badge').first().innerText();
const waitBadge = (page, re, timeout = 12000) => page.waitForFunction((src) => new RegExp(src).test(document.querySelector('.live-badge')?.innerText || ''), re.source, { timeout });

let pin = '';
let mentor, student, viewer;
try {
  await step('darvoza ochiladi (PIN + ism + «o\'zim ko\'raman»)', async () => {
    mentor = await newRole('mentor');
    await mentor.page.waitForSelector('input[placeholder="483 920"]', { timeout: 10000 });
    if (!(await mentor.page.locator('[data-live="self"]').count())) throw new Error('«o\'zim ko\'raman» tugmasi yo\'q');
  });

  await step('mentor kod bilan sessiya ochadi → belgi «Kod: ###»', async () => {
    await mentor.page.click('button[aria-label="Mentor"]');
    await mentor.page.fill('input[type="password"]', MENTOR_CODE);
    await mentor.page.click('text=Kirish →');
    await waitBadge(mentor.page, /Kod:/);
    pin = (await mentor.page.locator('.live-badge b').first().innerText()).replace(/\D/g, '');
    if (!/^\d{6}$/.test(pin)) throw new Error(`PIN o'qilmadi: «${pin}»`);
    return `PIN ${pin}`;
  });

  await step('server: sessiya live, kalit yuklangan (set_quiz_keys)', async () => {
    const s = await (await fetch(`${API}/api/v1/live/session/${pin}`)).json();
    if (s.status !== 'live') throw new Error(`status ${s.status}`);
    return `lesson_id=${s.lesson_id}`;
  });

  await step('o\'quvchi PIN + ism bilan qo\'shiladi → belgi «Mentor: 1 / N»', async () => {
    student = await newRole('student');
    await student.page.fill('input[placeholder="483 920"]', pin);
    await student.page.fill('input[placeholder^="Ismingiz"], input[placeholder^="Ваше имя"]', 'Ali');
    await student.page.click("text=Qo'shilish →");
    await waitBadge(student.page, /Mentor:\s*1\s*\//);
    return await badgeText(student.page);
  });

  await step('band ism → «Bu ism band» xabari (SQL xabari o\'zgarmagan)', async () => {
    const dup = await newRole('dup');
    await dup.page.fill('input[placeholder="483 920"]', pin);
    await dup.page.fill('input[placeholder^="Ismingiz"], input[placeholder^="Ваше имя"]', 'ali');
    await dup.page.click("text=Qo'shilish →");
    await dup.page.waitForSelector('text=Bu ism band', { timeout: 8000 });
    await dup.ctx.close();
  });

  await step('o\'quvchi darvozasi: mentordan oldinga o\'tolmaydi', async () => {
    const btn = student.page.locator('[data-tour="next"]').first();
    await btn.waitFor({ timeout: 8000 });
    const disabled = await btn.isDisabled();
    const label = (await btn.innerText()).trim();
    if (!disabled && !/Mentorni kuting/.test(label)) throw new Error(`tugma ochiq: «${label}»`);
    return label;
  });

  await step('mentor keyingi ekranga o\'tadi → o\'quvchi belgisi «2 / N» (polling)', async () => {
    // 0-ekran (m1-01): «Enter ↵» → variantlar → bittasini tanlash → «Davom etish» ochiladi
    const go = mentor.page.locator('.urlbar-go');
    if (await go.count()) {
      await go.first().click();
      await mentor.page.locator('.hook-option').first().waitFor({ timeout: 15000 });
      await mentor.page.locator('.hook-option').first().click();
    }
    const next = mentor.page.locator('[data-tour="next"]').first();
    await mentor.page.waitForFunction(() => { const b = document.querySelector('[data-tour="next"]'); return b && !b.disabled; }, null, { timeout: 15000 });
    await next.click();
    await waitBadge(student.page, /Mentor:\s*2\s*\//);
    const s = await (await fetch(`${API}/api/v1/live/session/${pin}`)).json();
    if (s.cur_screen !== 1) throw new Error(`server cur_screen=${s.cur_screen}`);
    return await badgeText(student.page);
  });

  await step('mentor «Erkin qilish» → o\'quvchi «Erkin rejim»; server ended', async () => {
    await mentor.page.click('text=Erkin qilish');
    await waitBadge(mentor.page, /erkin qilindi/i);
    await waitBadge(student.page, /Erkin rejim/);
    const s = await (await fetch(`${API}/api/v1/live/session/${pin}`)).json();
    if (s.status !== 'ended') throw new Error(`server status ${s.status}`);
    const players = await (await fetch(`${API}/api/v1/live/players/${pin}`)).json();
    if (players.length !== 1 || players[0].nickname !== 'Ali') throw new Error(`players: ${JSON.stringify(players)}`);
  });

  await step('uyda: «Kodsiz, o\'zim ko\'raman» → dars ochiladi (F-0903-01)', async () => {
    viewer = await newRole('viewer');
    await viewer.page.click('[data-live="self"]');
    await viewer.page.waitForSelector('[data-tour="next"]', { timeout: 8000 });
    if (await viewer.page.locator('input[placeholder="483 920"]').count()) throw new Error('darvoza hali turibdi');
  });

  await step('konsol/sahifa xatolari yo\'q', async () => {
    if (errors.length) throw new Error(errors.join(' | '));
  });
} catch {
  // step() allaqachon yozdi
} finally {
  await browser.close();
}

const bad = steps.filter((s) => !s.ok).length;
console.log(`\n===== E2E LIVE (${KEY}) — ${steps.length - bad}/${steps.length} ${bad ? RED + 'YIQILDI' : GRN + 'O\'TDI'}${R}`);
process.exit(bad ? 1 : 0);
