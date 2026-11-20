// F-1120-01 sinovi: jonli dars, yakuniy test — o'quvchilar TO'G'RI variantni bosadi, bazada picked/correct/elapsed tekshiriladi.
// node e2e-f1120.mjs <darsKaliti> <file.jsx> <screenId> <kutilganPicked> [type:<matn>]  (5-arg yo'q — MCQ: kutilganPicked variantini bosadi)
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const [KEY, FILE, SID, KEYIDX, ACTION = 'mcq'] = process.argv.slice(2);
const BASE = 'http://localhost:5311', API = 'http://127.0.0.1:3011';
const src = readFileSync(FILE, 'utf8');
const meta = src.slice(src.indexOf('const SCREEN_META'), src.indexOf('const TOTAL_SCREENS'));
const ids = [...meta.matchAll(/\{\s*id:\s*'([^']+)'/g)].map((m) => m[1]);
const IDX = ids.indexOf(SID), TOTAL = ids.length;
const LESSON_ID = /lessonId:\s*'([^']+)'/.exec(src)[1];
console.log({ KEY, LESSON_ID, SID, IDX, TOTAL });

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const errors = [];
async function role(label, screen) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(([lid, scr, tot]) => {
    for (const r of ['mentor', 'learner', 'student', 'self']) { localStorage.setItem('inetOnboarded_' + r, '1'); localStorage.setItem('hcOnboarded_' + r, '1'); }
    if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: scr, maxReached: scr, answers: {}, earned: [], missed: [], firstPass: null, startedAt: Date.now(), total: tot, savedAt: Date.now() })); }
  }, [LESSON_ID, screen, TOTAL]);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`[${label}] ${String(e.message).slice(0, 160)}`));
  page.on('dialog', (d) => d.accept());
  await page.goto(`${BASE}/#/lesson/${KEY}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.lesson-root', { timeout: 30000 });
  return page;
}

const mentor = await role('mentor', IDX);
await mentor.click('button[aria-label="Mentor"]');
await mentor.fill('input[type="password"]', 'MENTOR-DEV');
await mentor.click('text=Kirish →');
await mentor.waitForFunction(() => /Kod:/.test(document.querySelector('.live-badge')?.innerText || ''), null, { timeout: 15000 });
const pin = (await mentor.locator('.live-badge b').first().innerText()).replace(/\D/g, '');
await new Promise((r) => setTimeout(r, 2500));
const sess = await (await fetch(`${API}/api/v1/live/session/${pin}`)).json();
console.log('PIN', pin, 'cur_screen', sess.cur_screen);

const names = ['Ali', 'Vali', 'Gani'];
const students = [];
for (const n of names) {
  const p = await role(n, IDX);
  await p.fill('input[placeholder="483 920"]', pin);
  await p.fill('input[placeholder^="Ismingiz"], input[placeholder^="Ваше имя"]', n);
  await p.click("text=Qo'shilish →");
  await p.waitForFunction(() => /Mentor:/.test(document.querySelector('.live-badge')?.innerText || ''), null, { timeout: 15000 });
  students.push(p);
}
// har o'quvchi to'g'ri variantni bosadi (har xil kechikish bilan — vaqt 0 bo'lmasligi ko'rinsin)
for (const [i, p] of students.entries()) {
  await new Promise((r) => setTimeout(r, 1200 + i * 700));
  if (ACTION.startsWith('type:')) { await p.locator('.stage input[type="text"], .stage textarea, .stage input:not([type])').first().fill(ACTION.slice(5)); continue; }
  const opts = p.locator('.option, .q-test-v');
  const cnt = await opts.count();
  if (!cnt) throw new Error(`${names[i]}: variant topilmadi`);
  await opts.nth(Number(KEYIDX)).click();
}
await new Promise((r) => setTimeout(r, 4000));
const DB = readFileSync('/home/kali/Desktop/internetLesson/server/.env', 'utf8').match(/^DATABASE_URL=(.*)$/m)[1].replace(':5433/', ':5432/');
const out = execFileSync('psql', [DB, '-At', '-F', ' | ', '-c',
  `select lp.nickname, a.question_id, a.picked, a.correct, a.elapsed_ms from live_answers a join live_players lp on lp.id=a.player_id where a.pin='${pin}' and a.screen_idx < 100 order by lp.nickname`], { encoding: 'utf8' });
console.log('live_answers:\n' + out);
const rows = out.trim().split('\n').filter(Boolean).map((l) => l.split(' | '));
const bad = rows.filter(([, , picked, correct, el]) => picked !== String(KEYIDX) || correct !== 't' || !(Number(el) > 0));
console.log(rows.length === names.length && !bad.length ? `NATIJA: TOZA (${rows.length}/${names.length} to'g'ri, vaqt > 0)` : `NATIJA: XATO — ${rows.length} qator, nosoz ${bad.length}`);
if (errors.length) console.log('sahifa xatolari:', errors);
await browser.close();
