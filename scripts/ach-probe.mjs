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
//
// Spetsifikatsiya (JSON massiv, bir yoki bir nechta fayl):
//   { "file": "src/…/X.jsx", "sid": "s13c", "once": false, "note": "…",
//     "wrong": [amal…], "right": [amal…], "rightAfterWrong": [amal…] (ixtiyoriy), "slip": [amal…] (ixtiyoriy) }
//   amal: {"click": "<playwright selektor>", "nth": 0, "js": true} · {"fill": "<sel>", "value": "…"} · {"press": "Enter"}
//         {"wait": 500} · {"expect": "<sel>"} (ko'rinishini kutadi) · {"eval": "<JS — sahifada>"}
// Ishlatish: CHROME=/usr/bin/google-chrome node scripts/ach-probe.mjs [--smoke] [--lang uz|ru] [--out natija.json] [--shots <papka>] spec.json…
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const SMOKE = args.includes('--smoke');
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
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const bundles = new Map();
function lessonInfo(file) {
  const src = readFileSync(file, 'utf8');
  const lessonId = (/lessonId:\s*'([^']+)'/.exec(src) || [])[1];
  const meta = (/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src) || [])[1] || '';
  const ids = [...meta.matchAll(/\{\s*id:\s*'([^']+)'/g)].map((m) => m[1]);
  const trig = Object.fromEntries([...((/const ACH_TRIGGERS = \{([^}]*)\}/.exec(src) || [])[1] || '').matchAll(/(\w+):\s*'(\w+)'/g)].map((m) => [m[1], m[2]]));
  return { lessonId, ids, trig };
}
async function bundle(file) {
  if (bundles.has(file)) return bundles.get(file);
  const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(resolve(file))};
    createRoot(document.getElementById('root')).render(React.createElement(L, { lang: window.__lang || 'uz', onFinished: () => {} }));`,
  resolveDir: process.cwd(), sourcefile: 'p.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [resolve('node_modules')],
  loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' },
  define: { __DARS_API_URL__: '""' }, charset: 'utf8', write: false, logLevel: 'silent' });
  const text = res.outputFiles[0].text; bundles.set(file, text); return text;
}
function page(file, L, idx, extra, tag) {
  const prog = { screen: idx, answers: {}, earned: [], total: L.ids.length, savedAt: Date.now(), startedAt: Date.now() - 120000, ...extra };
  const seed = `window.__lang=${JSON.stringify(LANG)};if(!sessionStorage.getItem('__seeded')){localStorage.clear();for(const r of ['mentor','learner','student','self'])localStorage.setItem('inetOnboarded_'+r,'1');localStorage.setItem('liveLang',${JSON.stringify(LANG)});localStorage.setItem('liveSession:${L.lessonId}','{"mode":"self"}');localStorage.setItem('ccProgress:${L.lessonId}',${JSON.stringify(JSON.stringify(prog))});sessionStorage.setItem('__seeded','1');}`;
  const p = join(TMP, `${basename(file, '.jsx')}-${idx}-${tag}.html`);
  writeFileSync(p, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${seed}<\/script><script>${bundles.get(file)}<\/script></body></html>`);
  return 'file://' + p;
}

const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
const results = [];
for (const sp of specs) {
  const L = lessonInfo(sp.file); const idx = L.ids.indexOf(sp.sid); const ach = L.trig[sp.sid];
  const row = { file: sp.file, sid: sp.sid, ach, checks: {}, problems: [] };
  const fail = (k, msg) => { row.checks[k] = false; row.problems.push(`${k}: ${msg}`); };
  const pass = (k) => { if (row.checks[k] !== false) row.checks[k] = true; };
  if (idx < 0 || !ach) { row.problems.push(`ekran topilmadi (idx ${idx}) yoki ACH_TRIGGERS da yo'q (${ach})`); results.push(row); console.log(`✗ ${basename(sp.file)} ${sp.sid}: ${row.problems[0]}`); continue; }
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

  await scen('S0-boshida', { seed: [{}, 's0'], body: async ({ pg }) => {
    const r = await rule(pg); const p = await prog(pg);
    if (p?.screen !== idx) return fail('S0-boshida', `dars ${idx}-ekranda ochilmadi (screen ${p?.screen})`);
    if (!r) return fail('S0-boshida', 'qator yo\'q');
    if (r.n !== 1) fail('S0-boshida', `qator ${r.n} marta ko'rindi`);
    if (r.lost) fail('S0-boshida', 'boshida «lost» holatda');
    if (r.text !== TXT.RULE) fail('S0-boshida', `matn farq: «${r.text}»`);
    if (SHOTS) await pg.screenshot({ path: join(SHOTS, `${basename(sp.file, '.jsx')}-${sp.sid}.png`) });
    pass('S0-boshida'); } });
  await scen('S4-mashq', { seed: [{ firstPass: { answers: {}, durationSec: 1 } }, 's4'], body: async ({ pg }) => { if (await rule(pg)) return fail('S4-mashq', 'mashq-o\'tishida qator ko\'rindi'); pass('S4-mashq'); } });
  await scen('S5-olingan', { seed: [{ earned: [ach] }, 's5'], body: async ({ pg }) => { if (await rule(pg)) return fail('S5-olingan', 'nishon olingan, qator hali ko\'rinyapti'); pass('S5-olingan'); } });

  if (!SMOKE && sp.wrong && sp.right) {
    await scen('S2-togri', { seed: [{}, 's2'], body: async ({ pg }) => {
      await run(pg, sp.right, 'right'); const p = await prog(pg);
      if (!p?.answers?.[idx]) return fail('S2-togri', 'to\'g\'ri yo\'ldan keyin javob yozilmadi (right-amallar ekranni yakunlamadi)');
      if (!(p.earned || []).includes(ach)) return fail('S2-togri', `nishon berilmadi (earned ${JSON.stringify(p.earned)}, correct ${p.answers[idx].correct})`);
      if ((p.missed || []).length) fail('S2-togri', `to'g'ri yo'lda missed yozildi ${JSON.stringify(p.missed)}`);
      if (await rule(pg)) fail('S2-togri', 'nishon olingach qator yo\'qolmadi');
      pass('S2-togri'); } });
    await scen('S1a-xato-togri', { seed: [{}, 's1a'], body: async ({ pg }) => {
      await run(pg, sp.wrong, 'wrong'); let p = await prog(pg); const r = await rule(pg);
      if (!(p?.missed || []).includes(sp.sid)) return fail('S1a-xato-togri', `xatodan keyin missed da ${sp.sid} yo'q (${JSON.stringify(p?.missed)})`);
      if (!r || !r.lost) fail('S1a-xato-togri', `xatodan keyin «lost» qator yo'q (${JSON.stringify(r)})`);
      else if (r.text !== LOSTTXT) fail('S1a-xato-togri', `lost matn farq: «${r.text}»`);
      await run(pg, sp.rightAfterWrong || sp.right, 'rightAfterWrong'); p = await prog(pg);
      if (!p?.answers?.[idx]) return fail('S1a-xato-togri', 'xatodan keyin to\'g\'ri yo\'l ekranni yakunlamadi (javob yozilmadi)');
      if ((p.earned || []).includes(ach)) return fail('S1a-xato-togri', 'XATODAN KEYIN NISHON BERILDI');
      if (await pg.$('.acu-overlay')) fail('S1a-xato-togri', 'bayram ko\'rindi');
      pass('S1a-xato-togri'); } });
    await scen('S1b-F5', { seed: [{}, 's1b'], body: async ({ pg }) => {
      await run(pg, sp.wrong, 'wrong'); await pg.reload({ waitUntil: 'domcontentloaded' }); await pg.waitForSelector('.lesson-root', { timeout: 15000 }); await pg.waitForTimeout(900);
      let p = await prog(pg); const r = await rule(pg);
      if (p?.screen !== idx) return fail('S1b-F5', `F5 dan keyin boshqa ekran (${p?.screen})`);
      if (!(p?.missed || []).includes(sp.sid)) return fail('S1b-F5', 'F5 dan keyin missed yo\'qoldi');
      if (!r || !r.lost) fail('S1b-F5', `F5 dan keyin «lost» qator yo'q (${JSON.stringify(r)})`);
      await run(pg, sp.right, 'right(F5)'); p = await prog(pg);
      if (!p?.answers?.[idx]) return fail('S1b-F5', 'F5 dan keyin to\'g\'ri yo\'l ekranni yakunlamadi');
      if ((p.earned || []).includes(ach)) return fail('S1b-F5', 'F5 DAN KEYIN NISHON BERILDI');
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
