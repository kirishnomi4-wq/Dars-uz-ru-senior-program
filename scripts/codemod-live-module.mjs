#!/usr/bin/env node
// ============================================================================
// codemod-live-module — darsdagi INLINE jonli-blokni `src/live/` moduliga almashtiradi (v2, 2026-09-03).
//
// Nima qiladi (har fayl uchun):
//   1. Blok chegarasi: `const LIVE_SUPABASE_URL = ` qatoridan (yuqoridagi tutash izoh bilan) `function LiveBadge(`
//      yopilishigacha. Bu oraliqda FAQAT jonli-deklaratsiyalar o'chiriladi (nomlar ro'yxati LIVE_DECLS);
//      dars-yordamchilar (pracRead, codeKeyOf, PRACTICE_DONE_BASE, AchCtx …) JOYIDA QOLADI.
//   2. Boshiga bitta `import { … } from '<nisbiy>/live/index.js'` — faylning qolgan qismida ishlatilgan nomlar.
//   3. `__lang = lang;` bo'lsa keyin `setLiveLang(lang);` (RU-i18n'siz darslarda tashlab ketiladi — default uz).
//   4. `export default function X({ … })` → `liveToken` prop qo'shiladi.
//   5. `const live = useLiveSession(A, B);` → `useLiveSession(A, B, { liveToken });` + keyingi qatorda
//      `useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS });`
//      (bu 6 nom faylda BOR bo'lishi tekshiriladi; bo'lmasa fayl FAIL — qo'lda).
//   6. Tekshiruv: o'chirilgan biror nom faylda qolib importda bo'lmasa — FAIL, yozilmaydi. Supabase qoldig'i — FAIL.
//
// Ishlatish:
//   node scripts/codemod-live-module.mjs <fayl…>            → dry-run (hisobot, yozmaydi)
//   node scripts/codemod-live-module.mjs --write <fayl…>    → yozadi
//   node scripts/codemod-live-module.mjs --all [--write]    → src/ dagi barcha inline-blokli darslar
// Keyin har fayl uchun: npm run gates -- <fayl>   (dark/til topilmalari asl fayl bilan solishtiriladi)
// ============================================================================
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const ALL = args.includes('--all');
const files = args.filter((a) => !a.startsWith('--'));

const ROOT = process.cwd();
const LIVE_INDEX = path.join(ROOT, 'src', 'live', 'index.js');

// Modul eksport qiladigan nomlar (src/live/index.js bilan sinxron)
const EXPORTS = new Set([
  'setLiveLang', 'getLiveLang', 'liveTr',
  'LIVE_API_URL', 'LIVE_ENABLED', 'LIVE_POLL_MS', 'LIVE_POLL_MAX_MS', 'LIVE_HEARTBEAT_MS', 'LIVE_STALE_MS',
  'liveRpc', 'liveGet', 'livePlayers', 'liveAnswers', 'liveQuizAnswers',
  'liveRead', 'liveStore', 'liveClear', 'fmtPin', 'progRead', 'progWrite', 'progClear', 'nickRead', 'nickStore',
  'lmsJoin', 'lmsMe', 'lmsRestart',
  'useLiveSession', 'useServerProgress', 'LiveGateCtx', 'useLiveLock', 'LiveGate', 'LiveBadge', 'LiveBigCode', 'LT',
]);
// Har doim kerak (dars ildizi ishlatadi)
const ALWAYS = ['useLiveSession', 'useServerProgress', 'LiveGateCtx', 'LiveGate', 'LiveBadge'];

// Blok ichida O'CHIRILADIGAN deklaratsiyalar (nom → moduldan keladi yoki kerak emas)
const LIVE_DECLS = new Set([
  'LIVE_SUPABASE_URL', 'LIVE_SUPABASE_KEY', 'LIVE_ENABLED', 'LIVE_POLL_MS', 'LIVE_POLL_MAX_MS', 'LIVE_HEARTBEAT_MS', 'LIVE_STALE_MS',
  'LT', '_liveHdr', 'liveRpc', 'liveGet', '_lsKey', 'liveRead', 'liveStore', 'liveClear', 'fmtPin',
  'PROG_TTL_MS', '_progKey', 'progRead', 'progWrite', 'progClear',
  'LIVE_NICK_KEY', 'nickRead', 'nickStore', 'liveList', 'livePlayers', 'liveAnswers', 'liveQuizAnswers',
  'LiveGateCtx', 'useLiveLock', 'useLiveSession',
  '_liveBtnPri', '_liveBadgeS', '_liveDot', 'LiveBigCode', 'LiveGate', 'LiveBadge',
]);

const ROOT_STATE_NAMES = ['setScreen', 'setAnswers', 'setEarned', 'earnedRef', 'startTimeRef', 'TOTAL_SCREENS'];

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    if (statSync(p).isDirectory()) return (n === 'live' || n === 'lms-harness') ? [] : walk(p);
    return n.endsWith('.jsx') ? [p] : [];
  });
}

const targets = ALL
  ? walk(path.join(ROOT, 'src')).filter((f) => /^const LIVE_SUPABASE_URL = /m.test(readFileSync(f, 'utf8')))
  : files.map((f) => path.resolve(ROOT, f));
if (!targets.length) { console.error('fayl berilmadi'); process.exit(2); }

const DECL_RE = /^(?:const|let|var|function|async function)\s+([A-Za-z_$][\w$]*)/;
const usedIn = (text, name) => new RegExp(`(?<![\\w$.])${name}(?![\\w$])`).test(text);

/** Qavs balansi bo'yicha deklaratsiya oxiri (start qatoridan). Bir qatorli bo'lsa o'zi. */
function declEnd(lines, start) {
  let depth = 0, seen = false;
  for (let i = start; i < lines.length; i++) {
    const l = lines[i];
    for (const ch of l) { if (ch === '{' || ch === '(') { depth++; seen = true; } else if (ch === '}' || ch === ')') depth--; }
    if (i === start && !seen) return i;               // `const X = 5;`
    if (seen && depth <= 0) return i;
    if (i - start > 400) break;                       // himoya
  }
  return -1;
}

const report = [];
for (const file of targets) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const raw = readFileSync(file, 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  const lines = raw.split(/\r?\n/);

  const startIdx = lines.findIndex((l) => l.startsWith('const LIVE_SUPABASE_URL = '));
  if (startIdx < 0) { report.push({ rel, status: 'SKIP', why: "inline-blok yo'q (allaqachon modul?)" }); continue; }
  let from = startIdx;
  while (from > 0 && lines[from - 1].startsWith('//')) from--;
  const badgeIdx = lines.findIndex((l, i) => i > startIdx && l.startsWith('function LiveBadge('));
  if (badgeIdx < 0) { report.push({ rel, status: 'FAIL', why: 'function LiveBadge( topilmadi' }); continue; }
  const endIdx = declEnd(lines, badgeIdx);
  if (endIdx < 0) { report.push({ rel, status: 'FAIL', why: 'LiveBadge yopilishi topilmadi' }); continue; }

  // Jonli-deklaratsiyalar (va ularning oldidagi tutash izohlar) o'chadi, qolgani qoladi.
  // Butun fayl bo'ylab, lekin faqat TOP-LEVEL va faqat LIVE_DECLS nomlari: ba'zi darslarda LiveGateCtx kabi
  // deklaratsiya blokdan OLDIN turadi (PmLesson19) — qolib ketsa import bilan ikkilanadi.
  const remove = new Array(lines.length).fill(false);
  for (let i = 0; i < lines.length; i++) {
    const m = DECL_RE.exec(lines[i]);
    if (!m || !LIVE_DECLS.has(m[1])) continue;
    const e = declEnd(lines, i);
    if (e < 0) { report.push({ rel, status: 'FAIL', why: `deklaratsiya oxiri topilmadi: ${m[1]}` }); break; }
    for (let k = i; k <= e; k++) remove[k] = true;
    // oldidagi tutash izoh qatorlari (bo'sh qatorgacha) — faqat bevosita tegishli bo'lsa
    let c = i - 1;
    while (c >= from && lines[c].startsWith('//')) { remove[c] = true; c--; }
    i = e;
  }
  if (report.at(-1)?.rel === rel && report.at(-1)?.status === 'FAIL') continue;
  // bosh izoh-blok (JONLI DARS … LIVE_SUPABASE_URL izohlari)
  for (let i = from; i < startIdx; i++) remove[i] = true;

  const removedText = lines.filter((_, i) => remove[i]).join('\n');
  const kept = lines.filter((_, i) => !remove[i]);
  const keptText = kept.join('\n');

  // O'chirilgan nomlardan faylda qolganlari → importga; modulda bo'lmasa FAIL
  const removedNames = new Set();
  for (const m of removedText.matchAll(/^(?:const|let|var|function|async function)\s+([A-Za-z_$][\w$]*)/gm)) removedNames.add(m[1]);
  const need = new Set(ALWAYS);
  const orphan = [];
  for (const name of removedNames) {
    if (!usedIn(keptText, name)) continue;
    if (EXPORTS.has(name)) need.add(name); else orphan.push(name);
  }
  if (orphan.length) { report.push({ rel, status: 'FAIL', why: `o'chirilgan, lekin faylda ishlatilgan va modulda yo'q: ${orphan.join(', ')}` }); continue; }

  // Ildiz-holat nomlari (useServerProgress uchun)
  const missing = ROOT_STATE_NAMES.filter((n) => !usedIn(keptText, n));
  if (missing.length) { report.push({ rel, status: 'FAIL', why: `ildizda yo'q: ${missing.join(', ')} (useServerProgress ulanmaydi)` }); continue; }

  // export default + useLiveSession chaqiruvi
  const exportIdx = kept.findIndex((l) => /^export default function \w+\(\{[^}]*\}\)/.test(l));
  if (exportIdx < 0) { report.push({ rel, status: 'FAIL', why: 'export default function X({…}) topilmadi' }); continue; }
  const hookIdx = kept.findIndex((l) => /^\s*const live = useLiveSession\(/.test(l));
  if (hookIdx < 0) { report.push({ rel, status: 'FAIL', why: 'const live = useLiveSession( topilmadi' }); continue; }
  const hookM = /^(\s*)const live = useLiveSession\((.*)\);(.*)$/.exec(kept[hookIdx]);
  if (!hookM) { report.push({ rel, status: 'FAIL', why: 'useLiveSession qatori kutilgan shaklda emas' }); continue; }

  const out = [...kept];
  if (!/liveToken/.test(out[exportIdx])) out[exportIdx] = out[exportIdx].replace(/\s*\}\)/, ', liveToken })');
  const [, ind, hookArgs, tail] = hookM;
  const hookArgsNew = /\{\s*liveToken/.test(hookArgs) ? hookArgs : `${hookArgs}, { liveToken }`;
  out[hookIdx] = `${ind}const live = useLiveSession(${hookArgsNew});${tail || " // liveToken — LMS'dan (avval null, keyin keladi)"}`;
  // useServerProgress — hook'dan KEYIN va ildiz-holat deklaratsiyalarining OXIRGISIDAN keyin (TDZ: ba'zi darslarda
  // earnedRef/setEarned useLiveSession'dan pastda e'lon qilinadi — HtmlPractice, PracticeLesson3/4).
  const declRes = [/^\s*const \[screen, setScreen\]/, /^\s*const \[answers, setAnswers\]/, /^\s*const startTimeRef\b/, /^\s*const earnedRef\b/, /^\s*const \[earned, setEarned\]/];
  let insertAfter = hookIdx;
  for (const re of declRes) {
    const i = out.findIndex((l, k) => k > exportIdx && re.test(l));
    if (i < 0) { report.push({ rel, status: 'FAIL', why: `ildiz deklaratsiyasi topilmadi: ${re}` }); insertAfter = -1; break; }
    const e = declEnd(out, i);
    insertAfter = Math.max(insertAfter, e < 0 ? i : e);
  }
  if (insertAfter < 0) continue;
  out.splice(insertAfter + 1, 0,
    `${ind}useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS }); // server-progress: davom / ko'rish / toza boshlash`,
  );

  // setLiveLang — __lang qatoridan keyin (bo'lsa)
  const langIdx = out.findIndex((l) => /^\s*__lang = lang;/.test(l));
  let langNote = '';
  if (langIdx >= 0) {
    need.add('setLiveLang');
    const indent = (out[langIdx].match(/^\s*/) || [''])[0];
    out.splice(langIdx + 1, 0, `${indent}setLiveLang(lang); // jonli-modul tarjimoni ham shu tilda`);
  } else {
    langNote = " (RU-i18n yo'q: setLiveLang qo'yilmadi, modul uz'da)";
  }

  // import qatori — eski blok boshlangan joyga
  let importPath = path.relative(path.dirname(file), LIVE_INDEX).replace(/\\/g, '/');
  if (!importPath.startsWith('.')) importPath = './' + importPath;
  const importLine =
    "// Jonli dars (live) — umumiy modul: src/live/ (hook + darvoza + belgi + mijoz + server-progress). Inline nusxa 2026-09-03 da ko'chirildi." +
    `\nimport { ${[...need].join(', ')} } from '${importPath}';`;
  out.splice(from, 0, importLine);

  const text = out.join(eol);
  if (/LIVE_SUPABASE|supabase\.co|sb_publishable/.test(text)) { report.push({ rel, status: 'FAIL', why: "Supabase qoldig'i qoldi" }); continue; }

  if (WRITE) writeFileSync(file, text);
  const removedCount = remove.filter(Boolean).length;
  report.push({ rel, status: WRITE ? 'YOZILDI' : 'TAYYOR', removed: removedCount, imports: need.size, why: langNote.trim() });
}

let fail = 0;
for (const r of report) {
  if (r.status === 'FAIL') fail++;
  console.log(`${r.status.padEnd(7)} ${r.rel}${r.removed ? `  (−${r.removed} qator, ${r.imports} import)` : ''}${r.why ? `  — ${r.why}` : ''}`);
}
const okN = report.filter((r) => r.status === 'YOZILDI' || r.status === 'TAYYOR').length;
console.log(`\njami ${report.length} · muvaffaqiyat ${okN} · o'tkazildi ${report.filter((r) => r.status === 'SKIP').length} · xato ${fail}${WRITE ? '' : '   (dry-run — yozilmadi; --write bilan yozing)'}`);
process.exit(fail ? 1 : 0);
