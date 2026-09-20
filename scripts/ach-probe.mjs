#!/usr/bin/env node
// ach-probe — 151-qonun ekran-probi: har ulangan topshiriq-ekranni HAQIQIY brauzerda (boshsiz Chrome) yuritib isbotlaydi.
// Dars esbuild bilan yig'iladi va file:// sahifada ochiladi (dev-server shart emas). Progress (`ccProgress`) urug'lanadi,
// F5 (reload) dan keyin urug' QAYTA yozilmaydi (sessionStorage bayrog'i) — shuning uchun F5-saqlov haqiqiy sinaladi.
//
// Holatlar (spetsifikatsiyada `wrong`/`right` bo'lsa — hammasi; bo'lmasa faqat S0/S4/S5 = smoke):
//   S0 boshida qator bor, «lost» emas, matn §183 bilan harfma-harf        S4 «Qaytadan» mashqida (firstPass) qator yo'q
//   S5 nishon olingan bo'lsa qator yo'q                                    S2 toza → to'g'ri → nishon BERILDI (+ qator yo'qoldi)
//   S1a xato → progress.missed da sid, «lost» matn → to'g'ri → javob yozildi, nishon BERILMADI, bayram yo'q
//   S1b xato → F5 → «lost» va missed turibdi → to'g'ri → nishon BERILMADI  S3 sirpanish (`slip`) → missed BO'SH, «lost» yo'q
// Mentor rejimi (qator yo'q) — statik: AchRule kodi hamma darsda bir xil (scripts/codemod-achrule.mjs).
// `"test": true` — ball beradigan test-ekran (T9): qator KUTILMAYDI (S0/S4/S5 — yo'qligi tekshiriladi); S2 da javob
//   `correct: true`, S1a/S1b da `correct: false` (birinchi TO'LIQ urinish — ball); nishon bo'lsa — S2 da bor, S1 da yo'q.
//
// Spetsifikatsiya (JSON massiv, bir yoki bir nechta fayl):
//   { "file": "src/…/X.jsx", "sid": "s13c", "once": false, "note": "…",
//     "wrong": [amal…], "right": [amal…], "rightAfterWrong": [amal…] (ixtiyoriy), "slip": [amal…] (ixtiyoriy) }
//   amal: {"click": "<playwright selektor>", "nth": 0, "js": true} · {"fill": "<sel>", "value": "…"} · {"press": "Enter"}
//         {"wait": 500} · {"expect": "<sel>"} (ko'rinishini kutadi) · {"eval": "<JS — sahifada>"}
// `--solo` (19.09, Q1): dars UYDA (solo, LMS-urinish) rejimida ochiladi; server o'rnida soxta HTTP-server har so'rovni yozadi.
//   Faqat `"test": true` spetsifikatsiyalar: SOLO-togri — to'g'ri yo'ldan keyin shu ekran uchun serverga javob ketdimi
//   (`submit_answer` p_picked 0 yoki `record_attempt`); SOLO-xato — xato birinchi urinish serverga «xato» bo'lib ketdimi.
// Ishlatish: CHROME=/usr/bin/google-chrome node scripts/ach-probe.mjs [--smoke|--solo] [--lang uz|ru] [--out natija.json] [--shots <papka>] spec.json…
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';
import { createServer } from 'node:http';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const SMOKE = args.includes('--smoke');
const SOLO = args.includes('--solo');
const LANG = opt('--lang', 'uz');
const OUT = opt('--out', null);
const SHOTS = opt('--shots', null);
const specFiles = args.filter((a, i) => !a.startsWith('--') && !['--lang', '--out', '--shots'].includes(args[i - 1]));
if (!specFiles.length) { console.error('spec.json kerak'); process.exit(2); }
const specs = specFiles.flatMap((p) => JSON.parse(readFileSync(p, 'utf8')));

const TXT = {
  uz: { RULE: "🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", LOST: "Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.", ONCE: 'Nishon birinchi urinish uchun edi.' },
  ru: { RULE: '🏅 Справитесь с первой попытки — значок ваш.', LOST: 'Значок давался за первую попытку — теперь спокойно найдите верный ответ.', ONCE: 'Значок давался за первую попытку.' },
}[LANG];

const TMP = mkdtempSync(join(tmpdir(), 'achprobe-'));
// Chiqishda (to'xtatilsa ham) papka o'chadi — /tmp tmpfs; 19.09 da 143 ta qolib ketgan papka (7.5G) uni to'ldirgan (ENOSPC)
process.on('exit', () => rmSync(TMP, { recursive: true, force: true }));
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(130));
// Soxta server (faqat --solo): har so'rov yoziladi; POST /rpc/<fn> → 204; GET → 404/[] (sessiya yo'q, ro'yxat bo'sh)
const REQS = []; let API_URL = '';
if (SOLO) {
  const srv = createServer((req, res) => {
    const h = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS' };
    if (req.method === 'OPTIONS') { res.writeHead(204, h); return res.end(); }
    let b = ''; req.on('data', (c) => { b += c; });
    req.on('end', () => {
      let body = null; try { body = b ? JSON.parse(b) : null; } catch { body = b; }
      REQS.push({ at: Date.now(), method: req.method, path: req.url, fn: (/\/rpc\/([\w-]+)/.exec(req.url) || [])[1] || null, body });
      if (req.method === 'POST' && /\/rpc\//.test(req.url)) { res.writeHead(204, h); return res.end(); }
      if (req.method === 'GET' && /\/session\//.test(req.url)) { res.writeHead(404, h); return res.end(); }
      res.writeHead(200, { ...h, 'Content-Type': 'application/json' }); res.end(req.method === 'GET' ? '[]' : '{}');
    });
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r)); API_URL = `http://127.0.0.1:${srv.address().port}`;
  process.on('exit', () => srv.close());
}
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const bundles = new Map();
function lessonInfo(file) {
  const src = readFileSync(file, 'utf8');
  const lessonId = (/lessonId:\s*'([^']+)'/.exec(src) || [])[1];
  const meta = (/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src) || [])[1] || '';
  const ids = [...meta.matchAll(/\{\s*id:\s*'([^']+)'/g)].map((m) => m[1]);
  const trig = Object.fromEntries([...((/const ACH_TRIGGERS = \{([^}]*)\}/.exec(src) || [])[1] || '').matchAll(/(\w+):\s*'(\w+)'/g)].map((m) => [m[1], m[2]]));
  const keys = Object.fromEntries([...((/const INLINE_KEYS = \{([^}]*)\}/.exec(src) || [])[1] || '').matchAll(/(\w+):\s*(-?\d+)/g)].map((m) => [m[1], Number(m[2])]));
  return { lessonId, ids, trig, keys };
}
async function bundle(file) {
  if (bundles.has(file)) return bundles.get(file);
  const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(resolve(file))};
    createRoot(document.getElementById('root')).render(React.createElement(L, { lang: window.__lang || 'uz', onFinished: () => {} }));`,
  resolveDir: process.cwd(), sourcefile: 'p.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [resolve('node_modules')],
  loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' },
  define: { __DARS_API_URL__: SOLO ? JSON.stringify(API_URL) : '""' }, charset: 'utf8', write: false, logLevel: 'silent' });
  const text = res.outputFiles[0].text; bundles.set(file, text); return text;
}
function page(file, L, idx, extra, tag) {
  const prog = { screen: idx, answers: {}, earned: [], total: L.ids.length, savedAt: Date.now(), startedAt: Date.now() - 120000, ...(CUR_SEED || {}), ...extra }; // `seed` — boshqa ekranlar javobi (agregat nishon)
  const seed = `window.__lang=${JSON.stringify(LANG)};if(!sessionStorage.getItem('__seeded')){localStorage.clear();for(const r of ['mentor','learner','student','self']){localStorage.setItem('inetOnboarded_'+r,'1');localStorage.setItem('hcOnboarded_'+r,'1');}localStorage.setItem('liveLang',${JSON.stringify(LANG)});localStorage.setItem('liveSession:${L.lessonId}',${JSON.stringify(SOLO ? '{"mode":"solo","pin":"900001","playerId":"probe-p","playerToken":"probe-t","attemptId":"probe-a"}' : '{"mode":"self"}')});localStorage.setItem('ccProgress:${L.lessonId}',${JSON.stringify(JSON.stringify(prog))});sessionStorage.setItem('__seeded','1');}`;
  const p = join(TMP, `${basename(file, '.jsx')}-${idx}-${tag}.html`);
  writeFileSync(p, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${seed}<\/script><script>${bundles.get(file)}<\/script></body></html>`);
  return 'file://' + p;
}

let CUR_SEED = null;
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
const results = [];
for (const sp of specs) {
  const L = lessonInfo(sp.file); const idx = L.ids.indexOf(sp.sid); const ach = sp.ach || L.trig[sp.sid]; // `ach` — ACH_TRIGGERS dan tashqari nishon (ACH_EXTRA, to'g'ridan-to'g'ri earn)
  CUR_SEED = sp.seed || null;
  // `bonus: true` — 152-qonun bonusi: shart-qatori YO'Q, xato urinish sanalmaydi, nishon xatodan keyin ham beriladi
  const BONUS = !!sp.bonus;
  const TEST = !!sp.test || sp.rule === false || BONUS; // `rule: false` — qator kutilmaydi (tashqi nishon)
  const NOMISS = sp.missed === false || BONUS; // `missed: false` — nishon missTry orqali emas (masalan birinchi tanlov muhri)
  const row = { file: sp.file, sid: sp.sid, ach, test: TEST, checks: {}, problems: [] };
  const fail = (k, msg) => { row.checks[k] = false; row.problems.push(`${k}: ${msg}`); };
  const pass = (k) => { if (row.checks[k] !== false) row.checks[k] = true; };
  if (idx < 0 || (!ach && !TEST)) { row.problems.push(`ekran topilmadi (idx ${idx}) yoki ACH_TRIGGERS da yo'q (${ach})`); results.push(row); console.log(`✗ ${basename(sp.file)} ${sp.sid}: ${row.problems[0]}`); continue; }
  try { await bundle(sp.file); } catch (e) { row.problems.push('esbuild: ' + String(e.message).slice(0, 140)); results.push(row); console.log(`✗ ${basename(sp.file)} ${sp.sid}: esbuild`); continue; }

  const open = async (extra, tag) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } }); const pg = await ctx.newPage();
    const errs = []; pg.on('pageerror', (e) => errs.push(String(e.message).slice(0, 140)));
    await pg.goto(page(sp.file, L, idx, extra, tag), { waitUntil: 'domcontentloaded' });
    await pg.waitForSelector('.lesson-root', { timeout: 15000 }); await pg.waitForTimeout(900);
    return { ctx, pg, errs };
  };
  const prog = (pg) => pg.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), 'ccProgress:' + L.lessonId);
  const rule = (pg) => pg.evaluate(() => { const els = [...document.querySelectorAll('.ach-rule')].filter((e) => e.offsetParent !== null); const e = els[0]; return e ? { n: els.length, lost: e.classList.contains('lost'), text: e.innerText.trim() } : null; });
  const run = async (pg, acts, label) => {
    for (const [i, a] of (acts || []).entries()) {
      const where = `${label}[${i}]`;
      try {
        if (a.click) { const loc = pg.locator(a.click).nth(a.nth || 0); if (a.js) await loc.evaluate((el) => el.click(), null, { timeout: 5000 }); else await loc.click({ timeout: 5000 }); }
        else if (a.fill) await pg.locator(a.fill).nth(a.nth || 0).fill(a.value ?? '', { timeout: 5000 });
        else if (a.press) await pg.keyboard.press(a.press);
        else if (a.wait) await pg.waitForTimeout(a.wait);
        else if (a.expect) await pg.locator(a.expect).first().waitFor({ state: 'visible', timeout: 5000 });
        else if (a.eval) await pg.evaluate(a.eval);
        await pg.waitForTimeout(a.after ?? 280);
      } catch (e) { throw new Error(`${where} ${JSON.stringify(a).slice(0, 90)} — ${String(e.message).split('\n')[0].slice(0, 120)}`); }
    }
    await pg.waitForTimeout(700);
  };
  const LOSTTXT = sp.once ? TXT.ONCE : TXT.LOST;
  const scen = async (name, fn) => { let o; try { o = await open(...fn.seed); await fn.body(o); if (o.errs.length) fail(name, 'pageerror: ' + o.errs[0]); } catch (e) { fail(name, String(e.message).slice(0, 200)); } finally { if (o) await o.ctx.close(); } };

  if (SOLO) {
    if (!sp.test) { row.problems.push('solo: faqat "test": true spetsifikatsiya'); results.push(row); console.log(`– ${basename(sp.file, '.jsx')} ${sp.sid}: test emas — o'tkazildi`); continue; }
    const sent = (from) => REQS.filter((r) => r.at >= from && (r.fn === 'submit_answer' || r.fn === 'record_attempt') && r.body && r.body.p_screen === idx);
    const KEY = L.keys[sp.sid]; // server kabi baholash: kalit < 0 → doim to'g'ri; aks holda picked === kalit
    const srvOk = (x) => (Number.isInteger(KEY) ? (KEY < 0 || x.body.p_picked === KEY) : null);
    await scen('SOLO-togri', { seed: [{}, 'solo2'], body: async ({ pg }) => {
      const t0 = Date.now(); await run(pg, sp.right, 'right'); await pg.waitForTimeout(1500);
      const s = sent(t0); row.solo_togri = s.map((x) => `${x.fn}:${JSON.stringify({ picked: x.body.p_picked, correct: x.body.p_correct })}`);
      if (!s.length) return fail('SOLO-togri', 'serverga shu ekran javobi UMUMAN KETMADI (rasmiy solo natijada «javobsiz»)');
      if (srvOk(s[0]) === false) fail('SOLO-togri', `birinchi yozuv server uchun «xato» (${s[0].fn} picked ${s[0].body.p_picked}, kalit ${KEY})`);
      pass('SOLO-togri'); } });
    await scen('SOLO-xato', { seed: [{}, 'solo1'], body: async ({ pg }) => {
      const t0 = Date.now(); await run(pg, sp.wrong, 'wrong'); await run(pg, sp.rightAfterWrong || sp.right, 'rightAfterWrong'); await pg.waitForTimeout(1500);
      const s = sent(t0); row.solo_xato = s.map((x) => `${x.fn}:${JSON.stringify({ picked: x.body.p_picked, correct: x.body.p_correct })}`);
      if (!s.length) return fail('SOLO-xato', 'serverga shu ekran javobi UMUMAN KETMADI');
      if (srvOk(s[0]) === true && KEY >= 0) fail('SOLO-xato', `birinchi urinish xato edi, serverga «to'g'ri» ketdi (${s[0].fn} picked ${s[0].body.p_picked}, kalit ${KEY})`);
      pass('SOLO-xato'); } });
    row.ok = row.problems.length === 0; row.full = true; results.push(row);
    console.log(`${row.ok ? '✓' : '✗'} ${basename(sp.file, '.jsx')} ${sp.sid} [solo] · to'g'ri→ ${JSON.stringify(row.solo_togri || [])} · xato→ ${JSON.stringify(row.solo_xato || [])}${row.problems.length ? '\n    ' + row.problems.join('\n    ') : ''}`);
    continue;
  }
  await scen('S0-boshida', { seed: [{}, 's0'], body: async ({ pg }) => {
    const r = await rule(pg); const p = await prog(pg);
    if (p?.screen !== idx) return fail('S0-boshida', `dars ${idx}-ekranda ochilmadi (screen ${p?.screen})`);
    if (TEST) { if (r) fail('S0-boshida', 'test-ekranda qator ko\'rindi'); if (SHOTS) { await pg.waitForTimeout(1600); await pg.screenshot({ path: join(SHOTS, `${basename(sp.file, '.jsx')}-${sp.sid}.png`) }); } return pass('S0-boshida'); }
    if (!r) return fail('S0-boshida', 'qator yo\'q');
    if (r.n !== 1) fail('S0-boshida', `qator ${r.n} marta ko'rindi`);
    if (r.lost) fail('S0-boshida', 'boshida «lost» holatda');
    if (r.text !== TXT.RULE) fail('S0-boshida', `matn farq: «${r.text}»`);
    if (SHOTS) { await pg.waitForTimeout(1600); await pg.screenshot({ path: join(SHOTS, `${basename(sp.file, '.jsx')}-${sp.sid}.png`) }); } // kirish animatsiyasi tugasin
    pass('S0-boshida'); } });
  await scen('S4-mashq', { seed: [{ firstPass: { answers: {}, durationSec: 1 } }, 's4'], body: async ({ pg }) => { if (await rule(pg)) return fail('S4-mashq', 'mashq-o\'tishida qator ko\'rindi'); pass('S4-mashq'); } });
  if (ach) await scen('S5-olingan', { seed: [{ earned: [ach] }, 's5'], body: async ({ pg }) => { if (await rule(pg)) return fail('S5-olingan', 'nishon olingan, qator hali ko\'rinyapti'); pass('S5-olingan'); } });

  if (!SMOKE && sp.wrong && sp.right) {
    await scen('S2-togri', { seed: [{}, 's2'], body: async ({ pg }) => {
      await run(pg, sp.right, 'right'); const p = await prog(pg);
      if (!p?.answers?.[idx]) return fail('S2-togri', 'to\'g\'ri yo\'ldan keyin javob yozilmadi (right-amallar ekranni yakunlamadi)');
      if (sp.test && p.answers[idx].correct !== true) return fail('S2-togri', `birinchi urinishda to'g'ri — ball correct ${p.answers[idx].correct}`);
      if (ach && !(p.earned || []).includes(ach)) return fail('S2-togri', `nishon berilmadi (earned ${JSON.stringify(p.earned)}, correct ${p.answers[idx].correct})`);
      if (!NOMISS && (p.missed || []).length) fail('S2-togri', `to'g'ri yo'lda missed yozildi ${JSON.stringify(p.missed)}`);
      if (!TEST && await rule(pg)) fail('S2-togri', 'nishon olingach qator yo\'qolmadi');
      pass('S2-togri'); } });
    await scen('S1a-xato-togri', { seed: [{}, 's1a'], body: async ({ pg }) => {
      await run(pg, sp.wrong, 'wrong'); let p = await prog(pg); const r = await rule(pg);
      if (!NOMISS && !(p?.missed || []).includes(sp.sid)) return fail('S1a-xato-togri', `xatodan keyin missed da ${sp.sid} yo'q (${JSON.stringify(p?.missed)})`);
      if (TEST) { if (r) fail('S1a-xato-togri', 'test-ekranda qator ko\'rindi'); }
      else if (!r || !r.lost) fail('S1a-xato-togri', `xatodan keyin «lost» qator yo'q (${JSON.stringify(r)})`);
      else if (r.text !== LOSTTXT) fail('S1a-xato-togri', `lost matn farq: «${r.text}»`);
      await run(pg, sp.rightAfterWrong || sp.right, 'rightAfterWrong'); p = await prog(pg);
      if (!p?.answers?.[idx]) return fail('S1a-xato-togri', 'xatodan keyin to\'g\'ri yo\'l ekranni yakunlamadi (javob yozilmadi)');
      if (sp.test && p.answers[idx].correct !== false) return fail('S1a-xato-togri', `XATODAN KEYIN BALL TO'G'RI (correct ${p.answers[idx].correct})`);
      if (BONUS) { // bonus: aksincha — xato bosilgan bo'lsa ham nishon beriladi va urinish sanalmaydi
        if (ach && !(p.earned || []).includes(ach)) return fail('S1a-xato-togri', 'BONUS: xatodan keyin nishon berilmadi');
        if ((p.missed || []).includes(sp.sid)) return fail('S1a-xato-togri', 'BONUS: xato urinish sanaldi (missed)');
        return pass('S1a-xato-togri');
      }
      if (ach && (p.earned || []).includes(ach)) return fail('S1a-xato-togri', 'XATODAN KEYIN NISHON BERILDI');
      if (await pg.$('.acu-overlay')) fail('S1a-xato-togri', 'bayram ko\'rindi');
      pass('S1a-xato-togri'); } });
    await scen('S1b-F5', { seed: [{}, 's1b'], body: async ({ pg }) => {
      // 20.09: og'ir yurishda (160 holat) progress-yozuvi ulgurmay F5 bo'lib, «missed yo'qoldi» beqaror yiqilishi chiqdi —
      // qayta yuklashdan oldin qo'shimcha kutish (alohida yurishda 3/3 o'tardi)
      await run(pg, sp.wrong, 'wrong'); await pg.waitForTimeout(500); await pg.reload({ waitUntil: 'domcontentloaded' }); await pg.waitForSelector('.lesson-root', { timeout: 15000 }); await pg.waitForTimeout(900);
      let p = await prog(pg); const r = await rule(pg);
      if (p?.screen !== idx) return fail('S1b-F5', `F5 dan keyin boshqa ekran (${p?.screen})`);
      if (!NOMISS && !(p?.missed || []).includes(sp.sid)) return fail('S1b-F5', 'F5 dan keyin missed yo\'qoldi');
      if (!TEST && (!r || !r.lost)) fail('S1b-F5', `F5 dan keyin «lost» qator yo'q (${JSON.stringify(r)})`);
      await run(pg, sp.rightAfterF5 || sp.right, 'right(F5)'); p = await prog(pg); // `rightAfterF5` — F5 dan keyin ekran oraliq holatdan tiklansa
      if (!p?.answers?.[idx]) return fail('S1b-F5', 'F5 dan keyin to\'g\'ri yo\'l ekranni yakunlamadi');
      if (sp.test && p.answers[idx].correct !== false) return fail('S1b-F5', `F5 DAN KEYIN BALL TO'G'RI (correct ${p.answers[idx].correct})`);
      if (BONUS) { // bonus: F5 dan keyin ham nishon beriladi
        if (ach && !(p.earned || []).includes(ach)) return fail('S1b-F5', 'BONUS: F5 dan keyin nishon berilmadi');
        return pass('S1b-F5');
      }
      if (ach && (p.earned || []).includes(ach)) return fail('S1b-F5', 'F5 DAN KEYIN NISHON BERILDI');
      pass('S1b-F5'); } });
    if (sp.slip) await scen('S3-sirpanish', { seed: [{}, 's3'], body: async ({ pg }) => {
      await run(pg, sp.slip, 'slip'); const p = await prog(pg); const r = await rule(pg);
      if ((p?.missed || []).length) return fail('S3-sirpanish', `sirpanish urinish sanaldi (missed ${JSON.stringify(p.missed)})`);
      if (r && r.lost) fail('S3-sirpanish', 'sirpanishdan keyin «lost»');
      pass('S3-sirpanish'); } });
  }
  row.ok = row.problems.length === 0;
  row.full = !SMOKE && !!(sp.wrong && sp.right);
  results.push(row);
  console.log(`${row.ok ? '✓' : '✗'} ${basename(sp.file, '.jsx')} ${sp.sid} (${ach})${row.full ? '' : ' [faqat smoke]'} · ${Object.entries(row.checks).map(([k, v]) => (v ? '' : '✗') + k).join(' ')}${row.problems.length ? '\n    ' + row.problems.join('\n    ') : ''}`);
}
await browser.close();
const ok = results.filter((r) => r.ok).length;
console.log(`\n===== ${ok}/${results.length} o'tdi · to'liq prob: ${results.filter((r) => r.full && r.ok).length} · faqat smoke: ${results.filter((r) => !r.full).length}`);
if (OUT) writeFileSync(OUT, JSON.stringify({ at: new Date().toISOString(), lang: LANG, smoke: SMOKE, results }, null, 1));
process.exit(ok === results.length ? 0 : 1);
