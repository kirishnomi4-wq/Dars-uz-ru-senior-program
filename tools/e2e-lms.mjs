// ============================================================================
//  e2e-lms — LMS-ko'prik oqimi HAQIQIY brauzerda: liveToken → PIN'siz kirish (mentor, o'quvchilar),
//  ism JWT'dan, F5/yangi qurilma/yangi jti → o'sha o'yinchi, guruhda dars yo'q → darvoza + izoh, Erkin qilish.
//
//  Talab (uchalasi ishlab turishi kerak):
//    soxta LMS:  cd server && node tools/fake-school-api.mjs                (port 3999)
//    server:     cd server && node --env-file=.env src/index.js             (.env: CODDYCAMP_SCHOOL_API_URL=http://127.0.0.1:3999)
//    sayt:       DARS_API_URL=http://127.0.0.1:3001 npx vite --port 5300 --strictPort
//  Ishlatish:  node tools/e2e-lms.mjs [darsKaliti=m1-01]
// ============================================================================
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.BASE || 'http://localhost:5300';
const API = process.env.API || 'http://127.0.0.1:3001';
const KEY = process.argv[2] || 'm1-01';
const GRN = '\x1b[32m', RED = '\x1b[31m', DIM = '\x1b[2m', R = '\x1b[0m';

const steps = [];
const ok = (name, extra = '') => { steps.push({ name, ok: true }); console.log(`${GRN}✓${R} ${name}${extra ? DIM + '  ' + extra + R : ''}`); };
const fail = (name, err) => { steps.push({ name, ok: false }); console.log(`${RED}✗${R} ${name}\n   ${String(err?.message || err).slice(0, 400)}`); };
async function step(name, fn) { try { const extra = await fn(); ok(name, extra || ''); } catch (e) { fail(name, e); throw e; } }

// Token — server/tools/mint-token.mjs (server/.env secret'i bilan)
function mint(args) {
  return execFileSync(process.execPath, ['--env-file=.env', 'tools/mint-token.mjs', ...args], { cwd: 'server', encoding: 'utf8' }).trim();
}

for (const [label, url] of [['api', `${API}/api/v1/health`], ['sayt', BASE + '/']]) {
  let up = false;
  for (let i = 0; i < 20 && !up; i++) { try { up = (await fetch(url)).ok; } catch { await new Promise((r) => setTimeout(r, 1000)); } }
  if (!up) { console.error(`${label} javob bermayapti: ${url}`); process.exit(2); }
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const errors = [];
async function open(label, token, { lang = 'uz', delay = 500 } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(() => { for (const r of ['mentor', 'learner', 'student', 'self']) localStorage.setItem('inetOnboarded_' + r, '1'); });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`[${label}] ${String(e.message).slice(0, 120)}`));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|Download the React|ERR_|preload|Failed to load resource/i.test(m.text())) errors.push(`[${label}] ${m.text().slice(0, 120)}`); });
  page.on('dialog', (d) => d.accept());
  const url = `${BASE}/lms-harness.html?lesson=${KEY}&lang=${lang}&delay=${delay}${token ? `#token=${token}` : ''}`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.lesson-root', { timeout: 20000 });
  return { ctx, page, url };
}
const badgeText = (page) => page.locator('.live-badge').first().innerText();
const waitBadge = (page, re, timeout = 15000) => page.waitForFunction(([src, flags]) => new RegExp(src, flags).test(document.querySelector('.live-badge')?.innerText || ''), [re.source, re.flags], { timeout });

let pin = '';
let mentor, ali, vali;
try {
  await step('tozalash: 861-guruhda oldingi yugurishdan qolgan jonli sessiya bo\'lsa yopiladi', async () => {
    const tok = mint(['--role', 'mentor', '--sub', '145', '--gid', '861']);
    const r = await fetch(`${API}/api/v1/lms/join`, { method: 'POST', headers: { authorization: `Bearer ${tok}`, 'content-type': 'application/json' }, body: JSON.stringify({ lesson_id: 'internet-01-v18' }) });
    const j = await r.json();
    if (r.ok && j.resumed) {
      await fetch(`${API}/api/v1/live/rpc/end_session`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ p_pin: j.pin, p_token: j.token }) });
      return `eski ${j.pin} yopildi`;
    }
    if (r.ok) {
      await fetch(`${API}/api/v1/live/rpc/end_session`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ p_pin: j.pin, p_token: j.token }) });
      return 'toza edi';
    }
    throw new Error(`join ${r.status}: ${JSON.stringify(j)}`);
  });

  await step('mentor: liveToken → PIN\'siz sessiya (belgi «Kod: ###»), PIN/kod yozilmadi', async () => {
    mentor = await open('mentor', mint(['--role', 'mentor', '--sub', '145', '--gid', '861', '--name', 'Test Mentor']));
    // kutish-kartasi ('lms-joining') juda qisqa ko'rinishi mumkin — u majburiy emas, belgi majburiy
    await waitBadge(mentor.page, /Kod:/);
    pin = (await mentor.page.locator('.live-badge b').first().innerText()).replace(/\D/g, '');
    if (!/^\d{6}$/.test(pin)) throw new Error(`PIN o'qilmadi: «${pin}»`);
    return `PIN ${pin}`;
  });

  await step('server: lms_sessions live, gid=861, kalit yuklangan', async () => {
    const s = await (await fetch(`${API}/api/v1/live/session/${pin}`)).json();
    if (s.status !== 'live') throw new Error(`status ${s.status}`);
    return `lesson_id=${s.lesson_id}`;
  });

  await step('o\'quvchi Ali (sub 34174, guruh 861): token → avto-kirish, ism JWT\'dan, PIN yozilmadi', async () => {
    ali = await open('ali', mint(['--role', 'student', '--sub', '34174', '--name', 'Ali Valiyev', '--crm', '17226']));
    await waitBadge(ali.page, /Mentor:\s*1\s*\/.*Ali Valiyev/s);
    return (await badgeText(ali.page)).replace(/\s+/g, ' ');
  });

  await step('o\'quvchi Vali (sub 34175): token → kirdi; serverda 2 o\'yinchi', async () => {
    vali = await open('vali', mint(['--role', 'student', '--sub', '34175', '--name', 'Vali Aliyev']));
    await waitBadge(vali.page, /Vali Aliyev/);
    const players = await (await fetch(`${API}/api/v1/live/players/${pin}`)).json();
    if (players.length !== 2) throw new Error(`players=${players.length}`);
    return players.map((p) => p.nickname).join(', ');
  });

  await step('Ali F5 (o\'sha token) → o\'sha o\'yinchi, dublikat yo\'q', async () => {
    await ali.page.reload({ waitUntil: 'domcontentloaded' });
    await ali.page.waitForSelector('.lesson-root', { timeout: 20000 });
    await waitBadge(ali.page, /Ali Valiyev/);
    const players = await (await fetch(`${API}/api/v1/live/players/${pin}`)).json();
    if (players.length !== 2) throw new Error(`players=${players.length}`);
  });

  await step('Ali boshqa qurilmadan (localStorage bo\'sh) YANGI jti bilan → o\'sha o\'yinchi (F5-qoidasi §5.4)', async () => {
    const dev2 = await open('ali-dev2', mint(['--role', 'student', '--sub', '34174', '--name', 'Ali Valiyev']));
    await waitBadge(dev2.page, /Ali Valiyev/);
    const players = await (await fetch(`${API}/api/v1/live/players/${pin}`)).json();
    if (players.length !== 2) throw new Error(`players=${players.length} (dublikat!)`);
    await dev2.ctx.close();
  });

  // ---- SOLO → KO'RISH → QAYTADAN (3-bosqich). Sobir 862-guruhda, u yerda jonli dars yo'q.
  // Har yugurishda TOZA tarixli o'quvchi (tanga-qoidasi: bir o'quvchi — bir dars — bitta hodisa; eski Sobir allaqachon olgan bo'lardi)
  const SOBIR = String(900000 + Math.floor(Math.random() * 90000));
  const sobirToken = mint(['--role', 'student', '--sub', SOBIR, '--name', 'Sobir Karimov']);
  let sobir, soloJoin;
  await step('Sobir (guruh 862, dars yo\'q) → SOLO: «Mustaqil rejim» belgisi, dars ochiq, PIN so\'ralmadi', async () => {
    // oldingi yugurishdan qolgan holatni tozalash: faol/tugagan urinish bo'lsa restart bilan yangi solo
    await fetch(`${API}/api/v1/lms/restart`, { method: 'POST', headers: { authorization: `Bearer ${sobirToken}`, 'content-type': 'application/json' }, body: JSON.stringify({ lesson_id: 'internet-01-v18' }) }).catch(() => {});
    sobir = await open('sobir', sobirToken);
    await sobir.page.waitForSelector('[data-live="badge-solo"]', { timeout: 15000 });
    if (await sobir.page.locator('input[placeholder="483 920"]').count()) throw new Error('darvoza hali turibdi');
    const r = await fetch(`${API}/api/v1/lms/join`, { method: 'POST', headers: { authorization: `Bearer ${sobirToken}`, 'content-type': 'application/json' }, body: JSON.stringify({ lesson_id: 'internet-01-v18' }) });
    soloJoin = await r.json();
    if (soloJoin.mode !== 'solo') throw new Error(`server: ${JSON.stringify(soloJoin).slice(0, 200)}`);
    return `attempt ${soloJoin.attempt.id.slice(0, 8)} · ${await badgeText(sobir.page)}`;
  });

  await step('Sobir 0-ekranda javob beradi → server-progress 2 s ichida yoziladi (screen/answers)', async () => {
    const go = sobir.page.locator('.urlbar-go');
    await go.first().click({ force: true }); // tap-hint animatsiyasi tinmaydi — force
    await sobir.page.locator('.hook-option').first().waitFor({ timeout: 15000 });
    await sobir.page.locator('.hook-option').first().click({ force: true });
    await sobir.page.waitForFunction(() => { const b = document.querySelector('[data-tour="next"]'); return b && !b.disabled; }, null, { timeout: 15000 });
    await sobir.page.locator('[data-tour="next"]').first().click();
    let prog;
    for (let i = 0; i < 12; i++) {
      const r = await fetch(`${API}/api/v1/me/progress?lesson_id=internet-01-v18`, { headers: { authorization: `Bearer ${sobirToken}` } });
      prog = (await r.json()).progress;
      if (prog && prog.screen >= 1) break;
      await new Promise((res) => setTimeout(res, 500));
    }
    if (!prog || prog.screen < 1) throw new Error(`progress yetib kelmadi: ${JSON.stringify(prog)}`);
    if (!prog.answers || !Object.keys(prog.answers).length) throw new Error('answers bo\'sh');
    return `screen=${prog.screen} answers=${Object.keys(prog.answers).join(',')}`;
  });

  await step('Sobir 4-ekranda (test s4) variantni bosadi → record_attempt: ball-qatori + urinish (solo\'da submit_answer YO\'Q)', async () => {
    // Oldingi ekranlar interaktiv — serverdan to'g'ridan-to'g'ri 4-ekranga o'tkazamiz; yangi qurilma server-progress'dan 4-ekranni tiklaydi
    const put = await fetch(`${API}/api/v1/me/progress`, { method: 'PUT', headers: { authorization: `Bearer ${sobirToken}`, 'content-type': 'application/json' },
      body: JSON.stringify({ lesson_id: 'internet-01-v18', attempt_id: soloJoin.attempt.id, screen: 4, total: 22, answers: { 0: { picked: 1 } }, earned: [], client_ts: Date.now() + 1000 }) });
    if (!put.ok) throw new Error(`progress PUT ${put.status}`);
    const dev = await open('sobir-quiz', mint(['--role', 'student', '--sub', SOBIR, '--name', 'Sobir Karimov']));
    await dev.page.waitForSelector('[data-live="badge-solo"]', { timeout: 15000 });
    const opts = dev.page.locator('button.option:not([disabled])');
    await opts.first().waitFor({ timeout: 15000 });
    await opts.nth(1).click({ force: true });
    let rows = [];
    for (let i = 0; i < 16; i++) {
      const r = await fetch(`${API}/api/v1/live/answers/${soloJoin.pin}?screen=4`);
      rows = await r.json();
      if (Array.isArray(rows) && rows.length) break;
      await new Promise((res) => setTimeout(res, 500));
    }
    if (!Array.isArray(rows) || !rows.length) throw new Error('4-ekran javobi serverga yetmadi (record_attempt chaqirilmadi)');
    await dev.ctx.close();
    return `live_answers screen=4 picked=${rows[0].picked} correct=${rows[0].correct}`;
  });

  await step('Sobir boshqa qurilmadan (localStorage bo\'sh, yangi jti) → o\'sha ekrandan davom (server-progress)', async () => {
    const dev2 = await open('sobir-dev2', mint(['--role', 'student', '--sub', SOBIR, '--name', 'Sobir Karimov']));
    await dev2.page.waitForSelector('[data-live="badge-solo"]', { timeout: 15000 });
    await dev2.page.waitForFunction(() => !document.querySelector('.urlbar-go'), null, { timeout: 10000 }); // 0-ekran emas — davom etgan
    await dev2.ctx.close();
  });

  await step('oxirgi ekranga yetdi (API orqali) → urinish yakunlandi; qayta ochsa KO\'RISH rejimi + «Qaytadan boshlash»', async () => {
    const r = await fetch(`${API}/api/v1/me/progress`, { method: 'PUT', headers: { authorization: `Bearer ${sobirToken}`, 'content-type': 'application/json' },
      body: JSON.stringify({ lesson_id: 'internet-01-v18', attempt_id: soloJoin.attempt.id, screen: 21, total: 22, answers: { 0: { picked: 1 } }, earned: ['graduate'], client_ts: Date.now() + 5000 }) });
    const j = await r.json();
    if (j.status !== 'finished') throw new Error(`status ${JSON.stringify(j)}`);
    await sobir.ctx.close();
    sobir = await open('sobir-review', mint(['--role', 'student', '--sub', SOBIR, '--name', 'Sobir Karimov']));
    await sobir.page.waitForSelector('[data-live="badge-review"]', { timeout: 15000 });
    if (!(await sobir.page.locator('[data-live="restart"]').count())) throw new Error('restart tugmasi yo\'q');
    return await badgeText(sobir.page);
  });

  await step('«Qaytadan boshlash» → yangi solo urinish, 0-ekran, «Mustaqil rejim»', async () => {
    // Nima to'sayotganini yozib qo'yamiz (diagnostika), keyin majburiy klik (fixed-belgi ustida animatsiya/qatlam bo'lishi mumkin)
    const blocker = await sobir.page.evaluate(() => { const b = document.querySelector('[data-live="restart"]'); const r = b.getBoundingClientRect(); const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return el === b || b.contains(el) ? 'ozi' : `${el?.tagName}.${el?.className}`; });
    await sobir.page.locator('[data-live="restart"]').click({ force: true });
    await sobir.page.waitForSelector('[data-live="badge-solo"]', { timeout: 15000 });
    await sobir.page.waitForSelector('.urlbar-go', { timeout: 10000 }); // 0-ekran — toza boshlandi
    const r = await fetch(`${API}/api/v1/me/progress?lesson_id=internet-01-v18`, { headers: { authorization: `Bearer ${sobirToken}` } });
    const j = await r.json();
    if (j.attempt.id === soloJoin.attempt.id || j.attempt.status !== 'active') throw new Error(`urinish: ${JSON.stringify(j.attempt)}`);
    await sobir.ctx.close();
    return `to'siq: ${blocker}`;
  });

  await step('yaroqsiz token → darvoza + «avtomatik kirish bo\'lmadi»', async () => {
    const bad = await open('bad', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InYxIn0.eyJzdWIiOiIxIn0.xxxx');
    await bad.page.waitForSelector('[data-live="lms-note"]', { timeout: 10000 });
    const note = await bad.page.locator('[data-live="lms-note"]').innerText();
    if (!/avtomatik kirish/i.test(note)) throw new Error(`izoh: ${note}`);
    await bad.ctx.close();
  });

  await step('mentor keyingi ekran → Ali «2 / N»; mentor «Erkin qilish» → Ali «Erkin rejim»', async () => {
    const go = mentor.page.locator('.urlbar-go');
    if (await go.count()) { await go.first().click({ force: true }); await mentor.page.locator('.hook-option').first().waitFor({ timeout: 15000 }); await mentor.page.locator('.hook-option').first().click({ force: true }); }
    await mentor.page.waitForFunction(() => { const b = document.querySelector('[data-tour="next"]'); return b && !b.disabled; }, null, { timeout: 15000 });
    await mentor.page.locator('[data-tour="next"]').first().click();
    await waitBadge(ali.page, /Mentor:\s*2\s*\//);
    await mentor.page.click('text=Erkin qilish');
    await waitBadge(ali.page, /Erkin rejim/);
    const s = await (await fetch(`${API}/api/v1/live/session/${pin}`)).json();
    if (s.status !== 'ended') throw new Error(`server status ${s.status}`);
  });

  await step('NATIJA: jonli sessiya → School API (soxta) 201 — Ali/Vali, group 861; solo → Sobir (rank null)', async () => {
    const FAKE = process.env.FAKE_API || 'http://127.0.0.1:3999';
    let live, solo;
    for (let i = 0; i < 20; i++) {
      const list = await (await fetch(`${FAKE}/_debug/results`, { headers: { authorization: 'Bearer sapi_x' } })).json();
      live = list.find((r) => r.payload.mode === 'live' && r.event_id.startsWith(`sess_${pin}_`));
      solo = list.find((r) => r.payload.mode === 'solo' && r.event_id.startsWith(`solo_${SOBIR}_`));
      if (live && solo) break;
      await new Promise((res) => setTimeout(res, 1000));
    }
    if (!live) throw new Error('jonli natija School API\'ga yetib bormadi');
    const ids = live.payload.students.map((s) => s.student_id).sort();
    if (ids.join(',') !== '34174,34175') throw new Error(`o'quvchilar: ${ids}`);
    if (live.payload.group_id !== 861 || live.payload.teacher_id !== 145) throw new Error('group/teacher noto\'g\'ri');
    if (!solo) throw new Error('solo natija yetib bormadi');
    if (solo.payload.students[0].rank !== null || 'group_id' in solo.payload) throw new Error('solo shakli noto\'g\'ri');
    return `live ${live.event_id} (${ids.length} o'quvchi) · solo ${solo.event_id}`;
  });

  await step('konsol/sahifa xatolari yo\'q', async () => { if (errors.length) throw new Error(errors.join(' | ')); });
} catch {
  // step() yozdi
} finally {
  await browser.close();
}

const bad = steps.filter((s) => !s.ok).length;
console.log(`\n===== E2E LMS (${KEY}) — ${steps.length - bad}/${steps.length} ${bad ? RED + 'YIQILDI' : GRN + "O'TDI"}${R}`);
process.exit(bad ? 1 : 0);
