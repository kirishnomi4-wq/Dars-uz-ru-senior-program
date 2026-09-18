#!/usr/bin/env node
// smoke-onfinished-all — HAR darsda HAR ball-savol bilan onFinished payload'ini tekshiradi (Axadulla 2026-09-15: «har bitta
// savolga test qilib ko'rdingizmi?»). Dars «self» rejimida oxirgi ekranga urug'lanadi: barcha scored ekranlarga darsning O'Z
// INLINE_KEYS'idan javob (juft — to'g'ri, toq — noto'g'ri; `-1` amaliy ball-ekran → bajarilgan), 2 yutuq; yakun tugmasi bosiladi;
// payload 9 invariant bo'yicha tekshiriladi (TZ_LESSON_RESULT_DETAILS_RU §4/§9 + JAVOB 2026-09-15 §3):
//   I1 totalQuestions == scored soni            I2 correctAnswers == kutilgan to'g'ri soni
//   I3 questions(kind=test) == MCQ-scored soni  I4 question_id to'plami == MCQ scored ekran id'lari, order 1..n
//   I5 har MCQ: question/options/correct_option(=kalit)/correct_answer bor, attempts ≥ 1, attempts[0].correct == correct,
//      solved == attempts.some(correct), at 'Z' bilan    I6 lang == so'ralgan til    I7 achievements: urug'langan id'lar, earned_at 'Z'
//   I8 arena yo'q (self rejim)                  I9 pageerror 0, eski maydonlar (lessonId/correctAnswers/totalQuestions/answers) joyida
// Chegara (halol): bu PAYLOAD-YIG'ILISHINI sinaydi (progress → finishLesson → buildResultDetails), bosish-yo'lini emas
// (recordAnswer/logAttempt bosish-yo'li: tools/e2e-lms.mjs jonli qadam + 2026-09-10 haqiqiy sinov).
// Ishlatish: CHROME=/usr/bin/google-chrome node scripts/smoke-onfinished-all.mjs [--lang uz|ru|both] [--only <qism>] [--out <papka>] [fayl...]
//   fayl berilmasa — CRM_YUKLASH_ROYXATI.md dagi manba-darslar (uyga vazifasiz).
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync, readFileSync, mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename } from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const LANGS = opt('--lang', 'both') === 'both' ? ['uz', 'ru'] : [opt('--lang', 'uz')];
const ONLY = opt('--only', null);
const SEAL = args.includes('--seal'); // F-0918-07 + 151-qonun 6-band: I10 (qayta bosish = AYNAN o'sha yuk) · I11 («Qaytadan» → mashq → yakun = birinchi o'tish)
const OUT = opt('--out', 'feedback/lms-sinov-2026-09-16');
const argFiles = args.filter((a, i) => !a.startsWith('--') && !['--lang', '--only', '--out'].includes(args[i - 1]));
const files = (argFiles.length ? argFiles : [...new Set([...readFileSync('CRM_YUKLASH_ROYXATI.md', 'utf8').matchAll(/src\/[^\s|`]+\.jsx/g)].map((m) => m[0]))].filter((f) => !/homework/.test(f)))
  .filter((f) => !ONLY || f.includes(ONLY)).sort();

const OPTS = ['A', 'B', 'C', 'D', 'E', 'F'];
const isZ = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(s);

function parseLesson(file) {
  const src = readFileSync(file, 'utf8');
  const lessonId = (/lessonId:\s*'([^']+)'/.exec(src) || [])[1];
  const metaBody = (/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src) || [])[1] || '';
  const screens = [...metaBody.matchAll(/\{\s*id:\s*'([^']+)'([^}]*)\}/g)].map((m) => ({ id: m[1], scored: /scored:\s*true/.test(m[2]) }));
  const keyBody = (/const INLINE_KEYS\s*=\s*\{([^}]*)\}/.exec(src) || [])[1] || '';
  const keys = Object.fromEntries([...keyBody.matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(-?\d+)/g)].map((m) => [m[1], Number(m[2])]));
  const achBody = (/const ACHIEVEMENTS\s*=\s*\{([\s\S]*?)\n\};/.exec(src) || [])[1] || '';
  const achIds = [...achBody.matchAll(/^\s*([A-Za-z0-9_]+):\s*\{/gm)].map((m) => m[1]).slice(0, 2);
  const fin = /onClick=\{onFinish\}[^<]*>\{tr\(\{\s*uz:\s*'([^']*)',\s*ru:\s*'([^']*)'/.exec(src);
  return { file, lessonId, screens, keys, achIds, finishLabel: fin ? { uz: fin[1], ru: fin[2] } : null };
}

function seedFor(L) {
  const answers = {}; const expect = { scored: 0, mcq: 0, correct: 0, mcqCorrect: 0, mcqIds: [], mcqKey: {} };
  let n = 0;
  L.screens.forEach((s, i) => {
    if (!s.scored) return;
    expect.scored++;
    const idx = L.keys[s.id];
    if (!Number.isInteger(idx)) { answers[i] = { correct: true, picked: true, solved: true, _nokey: true }; expect.correct++; return; }
    if (idx === -1) { answers[i] = { correct: true, picked: true, solved: true }; expect.correct++; return; } // yakuniy amaliy ball-ekran
    const ok = n++ % 2 === 0; const picked = ok ? idx : (idx + 1) % OPTS.length;
    answers[i] = { stage: 'module-mikro', screenIdx: i, question: `Savol ${s.id}`, options: OPTS.slice(0, Math.max(4, idx + 1)), correctIndex: idx, correctAnswer: OPTS[idx],
      picked, studentAnswerIndex: picked, studentAnswer: OPTS[picked], correct: ok, firstAttemptCorrect: ok, solved: ok, lastPicked: picked };
    expect.mcq++; if (ok) { expect.correct++; expect.mcqCorrect++; } expect.mcqIds.push(s.id); expect.mcqKey[s.id] = idx;
  });
  return { answers, expect };
}

function check(L, lang, payload, expect, errs) {
  const P = [];
  const q = Array.isArray(payload.questions) ? payload.questions : null;
  const tests = q ? q.filter((x) => x.kind === 'test') : [];
  if (payload.totalQuestions !== expect.scored) P.push(`I1 totalQuestions ${payload.totalQuestions} ≠ scored ${expect.scored}`);
  if (payload.correctAnswers !== expect.correct) P.push(`I2 correctAnswers ${payload.correctAnswers} ≠ kutilgan ${expect.correct}`);
  if (!q) P.push('I3 questions yo\'q');
  else if (tests.length !== expect.mcq) P.push(`I3 questions(test) ${tests.length} ≠ MCQ ${expect.mcq}`);
  if (q) {
    const ids = tests.map((x) => x.question_id);
    if (ids.join(',') !== expect.mcqIds.join(',')) P.push(`I4 id'lar [${ids}] ≠ [${expect.mcqIds}]`);
    if (q.some((x, i) => x.order !== i + 1)) P.push('I4 order 1..n emas');
    const tc = tests.filter((x) => x.correct === true).length;
    if (tc !== expect.mcqCorrect) P.push(`I2b questions correct ${tc} ≠ ${expect.mcqCorrect}`);
    for (const x of tests) {
      const k = expect.mcqKey[x.question_id];
      if (typeof x.question !== 'string' || !x.question) P.push(`I5 ${x.question_id} question yo'q`);
      if (!Array.isArray(x.options) || x.options.length < 2) P.push(`I5 ${x.question_id} options yo'q`);
      if (x.correct_option !== k) P.push(`I5 ${x.question_id} correct_option ${x.correct_option} ≠ kalit ${k}`);
      if (x.correct_answer !== OPTS[k]) P.push(`I5 ${x.question_id} correct_answer`);
      if (!Array.isArray(x.attempts) || !x.attempts.length) { P.push(`I5 ${x.question_id} attempts yo'q`); continue; }
      if (x.attempts[0].correct !== x.correct) P.push(`I5 ${x.question_id} attempts[0].correct ≠ correct`);
      if (x.solved !== x.attempts.some((a) => a.correct)) P.push(`I5 ${x.question_id} solved ≠ urinishlar`);
      if (x.attempts.some((a) => !isZ(a.at))) P.push(`I5 ${x.question_id} at Z emas`);
      if (x.attempts.some((a, i) => a.n !== i + 1 || !Number.isInteger(a.option))) P.push(`I5 ${x.question_id} attempt n/option`);
    }
    if (q.some((x) => x.kind === 'arena')) P.push('I8 self rejimda arena chiqdi');
  }
  if (payload.lang !== lang) P.push(`I6 lang ${payload.lang} ≠ ${lang}`);
  // I12 (19.09, Y1): questions[] dagi HAR yozuv LMS shartnomasi shaklida — question · options ≥ 2 · correct_option · correct_answer
  for (const x of (Array.isArray(payload.questions) ? payload.questions : [])) if (!(x.question && Array.isArray(x.options) && x.options.length >= 2 && Number.isInteger(x.correct_option) && typeof x.correct_answer === 'string')) P.push(`I12 ${x.question_id}: shartnoma maydoni yo'q`);
  const a = Array.isArray(payload.achievements) ? payload.achievements : null;
  if (!a) P.push('I7 achievements yo\'q');
  else {
    const got = new Set(a.map((x) => x.id));
    for (const id of L.achIds) if (!got.has(id.toLowerCase())) P.push(`I7 yutuq ${id} yo'q`);
    if (a.some((x) => !isZ(x.earned_at) || !x.name || !x.title)) P.push('I7 earned_at/name/title');
  }
  for (const k of ['lessonId', 'correctAnswers', 'totalQuestions', 'answers']) if (!(k in payload)) P.push(`I9 eski maydon ${k} yo'q`);
  if (payload.lessonId !== L.lessonId) P.push(`I9 lessonId ${payload.lessonId}`);
  if (errs.length) P.push(`I9 pageerror: ${errs[0]}`);
  return P;
}

const TMP = mkdtempSync(join(tmpdir(), 'onfin-all-'));
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
const results = [];
const t0 = Date.now();

for (const file of files) {
  const L = parseLesson(file);
  if (!L.lessonId || !L.screens.length) { results.push({ file, ok: false, problems: ['manba: lessonId/SCREEN_META topilmadi'] }); console.log(`✗ ${file}: manba topilmadi`); continue; }
  let bundle;
  try {
    const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(resolve(file))};
      window.__payload = null; window.__payloads = []; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: window.__lang || 'uz', onFinished: (p) => { window.__payload = p; window.__payloads.push(JSON.stringify(p)); } }));`,
      resolveDir: process.cwd(), sourcefile: 'e.jsx', loader: 'jsx' }, bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [resolve('node_modules')],
      loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.jpeg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' },
      define: { __DARS_API_URL__: '""' }, charset: 'utf8', write: false, logLevel: 'silent' });
    bundle = res.outputFiles[0].text;
  } catch (e) { results.push({ file, lessonId: L.lessonId, ok: false, problems: [`esbuild: ${String(e.message).slice(0, 160)}`] }); console.log(`✗ ${file}: esbuild`); continue; }
  const { answers, expect } = seedFor(L);
  const total = L.screens.length;
  for (const lang of LANGS) {
    const seed = `window.__lang=${JSON.stringify(lang)};for(const r of ['mentor','learner','student','self'])localStorage.setItem('inetOnboarded_'+r,'1');localStorage.setItem('liveLang',${JSON.stringify(lang)});localStorage.setItem('liveSession:${L.lessonId}','{"mode":"self"}');localStorage.setItem('ccProgress:${L.lessonId}',JSON.stringify({screen:${total - 1},answers:${JSON.stringify(answers)},earned:${JSON.stringify(L.achIds)},startedAt:Date.now()-90000,total:${total},savedAt:Date.now()}));`;
    const page = join(TMP, `${basename(file, '.jsx')}-${lang}.html`);
    writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${seed}<\/script><script>${bundle}<\/script></body></html>`);
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(String(e.message).slice(0, 120)));
    let payload = null, how = '', screenText = '', lastLoc = null; const sealProblems = [];
    try {
      await p.goto('file://' + page, { waitUntil: 'domcontentloaded' });
      await p.waitForSelector('.lesson-root', { timeout: 15000 }); await p.waitForTimeout(900);
      // Yakun tugmasi odatda DOM'da OXIRGI mos tugma (nav «Keyingi/Далее» oldinroq turadi) — shuning uchun .last()
      const tryClick = async (loc, tag) => {
        if (!(await loc.count())) return false;
        await loc.evaluate((el) => el.click()); await p.waitForTimeout(700);
        payload = await p.evaluate(() => window.__payload); how += tag + ' '; if (payload) lastLoc = loc;
        return true;
      };
      const label = L.finishLabel && L.finishLabel[lang];
      if (label) await tryClick(p.locator('button', { hasText: label }).last(), `«${label}»`);
      if (!payload) await tryClick(p.locator('button', { hasText: /yakunla|tugat|tamom|finish|заверш|законч|готово|keyingi dars|следующий урок|bezashni boshlash/i }).last(), 'regex');
      if (!payload) await tryClick(p.locator('button', { hasText: /^\s*(tamom|готово|done)\s*$/i }).last(), 'tamom');
      if (!payload) screenText = await p.evaluate(() => (document.querySelector('.lesson-root')?.innerText || '').slice(0, 160).replace(/\s+/g, ' '));
      if (SEAL && payload && lastLoc) {
        // I10: o'sha tugma 1,3 s dan keyin yana bosiladi — ikkala yuk harfma-harf teng bo'lishi shart
        await p.waitForTimeout(1300);
        if (await lastLoc.count()) { await lastLoc.evaluate((el) => el.click()); await p.waitForTimeout(600); }
        const all = await p.evaluate(() => window.__payloads);
        if (all.length < 2) sealProblems.push(`I10 ikkinchi bosishda onFinished kelmadi (${all.length} ta)`);
        else if (all[0] !== all[1]) { const a = JSON.parse(all[0]), b = JSON.parse(all[1]); sealProblems.push(`I10 qayta bosishda yuk FARQ qildi (durationSec ${a.durationSec}→${b.durationSec})`); }
        // I11: toza sahifa → «Qaytadan» → progressda firstPass muhri, nishonlar o'zgarmagan → oxirgi ekran → yakun = BIRINCHI o'tish
        const p2 = await ctx.newPage(); const errs2 = []; p2.on('pageerror', (e) => errs2.push(String(e.message).slice(0, 120)));
        await p2.goto('file://' + page, { waitUntil: 'domcontentloaded' });
        await p2.waitForSelector('.lesson-root', { timeout: 15000 }); await p2.waitForTimeout(900);
        const again = p2.locator('button', { hasText: /^\s*(↻\s*)?(qaytadan|заново)\s*$/i }).last();
        if (!(await again.count())) sealProblems.push('I11 «Qaytadan» tugmasi topilmadi');
        else {
          const KEYP = 'ccProgress:' + L.lessonId;
          const earnedBefore = await p2.evaluate((k) => (JSON.parse(localStorage.getItem(k) || 'null')?.earned || []), KEYP); // yakun ekranida `graduate` qonuniy qo'shiladi
          await again.evaluate((el) => el.click()); await p2.waitForTimeout(900);
          const prog = await p2.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), KEYP);
          const fpKeys = Object.keys(prog?.firstPass?.answers || {}).sort().join(','), seedKeys = Object.keys(answers).sort().join(',');
          if (!prog?.firstPass) sealProblems.push('I11 «Qaytadan»dan keyin firstPass muhri yo\'q');
          else if (fpKeys !== seedKeys) sealProblems.push(`I11 firstPass javoblari mos emas (${fpKeys} ≠ ${seedKeys})`);
          if (prog && [...(prog.earned || [])].sort().join(',') !== [...earnedBefore].sort().join(',')) sealProblems.push(`I11 «Qaytadan» nishonlarni o'zgartirdi (${(prog.earned || []).join(',')})`);
          if (prog?.firstPass) {
            // seed-skript har yuklanishda progressni qayta yozadi — shuning uchun mashq-holati alohida sahifa-faylga urug'lanadi
            const seed2 = seed.slice(0, seed.indexOf("localStorage.setItem('ccProgress:")) + `localStorage.setItem(${JSON.stringify(KEYP)},${JSON.stringify(JSON.stringify({ ...prog, screen: total - 1 }))});`;
            const page2 = page.replace(/\.html$/, '-mashq.html');
            writeFileSync(page2, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${seed2}<\/script><script>${bundle}<\/script></body></html>`);
            await p2.goto('file://' + page2, { waitUntil: 'domcontentloaded' });
            await p2.waitForSelector('.lesson-root', { timeout: 15000 }); await p2.waitForTimeout(900);
            let pay2 = null;
            const click2 = async (loc) => { if (pay2 || !(await loc.count())) return; await loc.evaluate((el) => el.click()); await p2.waitForTimeout(700); pay2 = await p2.evaluate(() => window.__payload); };
            if (label) await click2(p2.locator('button', { hasText: label }).last());
            await click2(p2.locator('button', { hasText: /yakunla|tugat|tamom|finish|заверш|законч|готово|keyingi dars|следующий урок|bezashni boshlash/i }).last());
            await click2(p2.locator('button', { hasText: /^\s*(tamom|готово|done)\s*$/i }).last());
            if (!pay2) sealProblems.push('I11 mashqdan keyin onFinished kelmadi');
            else {
              if (pay2.correctAnswers !== expect.correct) sealProblems.push(`I11 mashqdan keyin correctAnswers ${pay2.correctAnswers} ≠ birinchi o'tish ${expect.correct}`);
              if (pay2.durationSec !== prog.firstPass.durationSec) sealProblems.push(`I11 durationSec ${pay2.durationSec} ≠ firstPass ${prog.firstPass.durationSec}`);
              if ((pay2.answers || []).length !== Object.keys(answers).length) sealProblems.push(`I11 answers soni ${(pay2.answers || []).length} ≠ ${Object.keys(answers).length}`);
            }
          }
        }
        for (const e of errs2) sealProblems.push('I11 pageerror: ' + e);
      }
    } catch (e) { errs.push('sinov: ' + String(e.message).slice(0, 120)); }
    await ctx.close();
    const problems = payload ? [...check(L, lang, payload, expect, errs), ...sealProblems] : [`onFinished KELMADI (${how || 'tugma yo\'q'}; ekran: ${screenText})`, ...errs.map((e) => 'pageerror: ' + e)];
    const q = payload?.questions || [];
    const row = { file, lessonId: L.lessonId, lang, ok: problems.length === 0, scored: expect.scored, mcq: expect.mcq, totalQuestions: payload?.totalQuestions ?? null, correctAnswers: payload?.correctAnswers ?? null,
      questionsTest: q.filter((x) => x.kind === 'test').length, achievements: payload?.achievements?.length ?? null, finish: how.trim(), problems };
    results.push(row);
    console.log(`${row.ok ? '✓' : '✗'} ${L.lessonId} ${lang} · scored ${row.scored} · q ${row.questionsTest}/${row.mcq} · ${row.correctAnswers}/${row.totalQuestions} · yutuq ${row.achievements}${problems.length ? ' — ' + problems.join(' | ') : ''}`);
  }
}
await browser.close();

mkdirSync(OUT, { recursive: true });
const ok = results.filter((r) => r.ok).length;
writeFileSync(join(OUT, 'onfinished-sweep.json'), JSON.stringify({ at: new Date().toISOString(), langs: LANGS, files: files.length, runs: results.length, ok, results }, null, 1));
const md = [`# onFinished to'liq-sinov — ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`, '',
  `Darslar: ${files.length} · yugurishlar: ${results.length} (${LANGS.join('+')}) · o'tdi: ${ok} · yiqildi: ${results.length - ok}`, '',
  '| Dars (lesson_id) | Til | Ball-ekran | questions(test) | to\'g\'ri / jami | Yutuq | Hukm |', '|---|---|---:|---:|---:|---:|---|',
  ...results.map((r) => `| \`${r.lessonId || basename(r.file)}\` | ${r.lang || '-'} | ${r.scored ?? '-'} | ${r.questionsTest ?? '-'}/${r.mcq ?? '-'} | ${r.correctAnswers ?? '-'}/${r.totalQuestions ?? '-'} | ${r.achievements ?? '-'} | ${r.ok ? '✅' : '❌ ' + r.problems.join('; ').slice(0, 160)} |`)];
writeFileSync(join(OUT, 'onfinished-sweep.md'), md.join('\n') + '\n');
console.log(`\n===== ${ok}/${results.length} o'tdi · ${((Date.now() - t0) / 1000).toFixed(0)} s · ${join(OUT, 'onfinished-sweep.{json,md}')}`);
process.exit(ok === results.length ? 0 : 1);
