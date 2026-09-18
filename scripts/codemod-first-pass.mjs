#!/usr/bin/env node
// codemod-first-pass — KATTA §41 A to'lqin: 151-qonun 6-bandi («birinchi o'tish — hisob, Qaytadan — mashq») + umumiy
// `missed` infratuzilmasi + onFinished yukini muhrlash (F-0918-07, `sealPayload`). Etalon: src/1-Modull/InternetLesson.jsx.
// Manba: feedback/F-0918-04/codemod-6band-proto.mjs (91 nusxada sinalgan) + himoyalar: takror yurishda SKIP, `saved` borligi,
// React import'ida hamma kerakli hook borligi (esbuild yo'q import'ni TUTMAYDI — brauzerda oq ekran bo'lardi).
// Ishlatish:  node scripts/codemod-first-pass.mjs [--write] [--group G1|G2] [fayl...]     (--write bo'lmasa — QURUQ yurish)
import { readFileSync, writeFileSync } from 'node:fs';
import { transformSync } from 'esbuild';
const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const gi = argv.indexOf('--group'); const GROUP = gi >= 0 ? argv[gi + 1] : null;
const files = argv.filter((a, i) => !a.startsWith('--') && !(gi >= 0 && i === gi + 1));
const rows = JSON.parse(readFileSync('feedback/F-0918-04/codemod-olchov.json', 'utf8')).rows;
const GNAME = { G1: 'G1-mexanik', G2: 'G2-parametrli' };
const targets = files.length ? files : rows.filter((r) => r.group === GNAME[GROUP]).map((r) => r.file);
if (!targets.length) { console.error('fayl yoki --group G1|G2 kerak'); process.exit(2); }
const one = (s, re, rep, name, errs) => { const m = s.match(new RegExp(re.source, re.flags.replace('g', '') + 'g')) || []; if (m.length !== 1) { errs.push(`${name}: ${m.length} ta`); return s; } return s.replace(re, rep); };
const HOOKS = ['useState', 'useEffect', 'useRef', 'useCallback', 'useMemo', 'useContext', 'createContext'];
let ok = 0, fail = 0, skip = 0; const stat = { ins: 0 };
for (const f of targets) {
  let s = readFileSync(f, 'utf8'); const before = s.split('\n').length; const errs = [];
  if (/\bfirstPassRef\b/.test(s)) { skip++; console.log(`SKIP ${f}: 6-band allaqachon bor`); continue; }
  if (!/\bconst saved = /.test(s)) errs.push('`saved` (progress-tiklash) topilmadi');
  // T1 import: sealPayload (src/live ga qo'shiladigan yangi eksport)
  s = one(s, /^(import \{[^}]*?)( ?)\} from '((?:\.\.\/)+live\/index\.js)';/m, "$1, sealPayload } from '$3';", 'T1 live-import', errs);
  // T2 kontekst
  s = one(s, /^(const AchCtx = createContext\(null\);[^\n]*\n)/m, "$1const AchMissCtx = createContext(null); // 🏅 151-qonun: { missed:Set<ekran id>, miss(idx), practice } — birinchi urinish + «Qaytadan» mashq-o'tishi\n", 'T2 AchCtx', errs);
  // T3–T5 QuestionScreen
  s = one(s, /(const QuestionScreen = \(\{[^\n]*?\}\) => \{\n)/, "$1  const _am = useContext(AchMissCtx);\n  const fpPractice = !!(_am && _am.practice); // 151-qonun 6-band: «Qaytadan» mashq-o'tishi — hech qayerga yozilmaydi\n", 'T3 QuestionScreen boshi', errs);
  s = one(s, /^(\s*)(live\.submitAnswer\(screen, SCREEN_META\[screen\]\?\.id \|\| [^,]+, i, isCorrect, Date\.now\(\) - mountTs\.current\);)/m, '$1if (!fpPractice) $2', 'T4 submitAnswer', errs);
  s = one(s, /if \(live && live\.recordAttempt\) live\.recordAttempt\(/, 'if (live && live.recordAttempt && !fpPractice) live.recordAttempt(', 'T5 recordAttempt', errs);
  // T6 ildiz holati
  s = one(s, /^(\s*)(const earnedRef = useRef\(new Set\()/m, "$1const firstPassRef = useRef(saved?.firstPass || null); // 151-qonun 6-band: { answers, durationSec } | null — «Qaytadan»da muhrlanadi\n$1const [fpPractice, setFpPractice] = useState(!!saved?.firstPass);\n$1$2", 'T6 earnedRef', errs);
  // T7 earn muzlashi + T12 missed infratuzilmasi (earn blokidan keyin)
  s = one(s, /(const earn = useCallback\(\(id\) => \{\n)(\s*)(if \(!ACHIEVEMENTS\[id\] \|\| earnedRef\.current\.has\(id\)\) return;)/, "$1$2if (firstPassRef.current) return; // 151-qonun: mashq-o'tishida nishonlar MUZLAGAN\n$2$3", 'T7 earn', errs);
  s = one(s, /(const earn = useCallback\(\(id\) => \{\n[\s\S]*?\n(\s*)\}, \[\]\);\n)/, "$1$2const missedRef = useRef(new Set(saved?.missed || []));\n$2const [missed, setMissed] = useState(() => new Set(saved?.missed || []));\n$2const missTry = useCallback((idx) => {\n$2  const sid = SCREEN_META[idx] && SCREEN_META[idx].id;\n$2  const ach = ACH_TRIGGERS[sid];\n$2  if (!ach || missedRef.current.has(sid) || earnedRef.current.has(ach)) return;\n$2  missedRef.current.add(sid);\n$2  setMissed(new Set(missedRef.current));\n$2}, []);\n$2const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice }), [missed, missTry, fpPractice]);\n", 'T12 missed', errs);
  // T12b: ikki shakl — bir qatorli shart (ko'pchilik) yoki ichki `if (ACH_TRIGGERS[_m.id]) earn(…)` (FullstackFeedbackLesson)
  if (/if \(ACH_TRIGGERS\[_m\.id\]\) earn\(ACH_TRIGGERS\[_m\.id\]\);/.test(s)) s = one(s, /if \(ACH_TRIGGERS\[_m\.id\]\) earn\(ACH_TRIGGERS\[_m\.id\]\);/, 'if (ACH_TRIGGERS[_m.id] && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]);', 'T12b recordAnswer (ichki)', errs);
  else s = one(s, /(if \(_m && (?:_m\.scored && )?ACH_TRIGGERS\[_m\.id\] && data && data\.correct)(\) earn\(ACH_TRIGGERS\[_m\.id\]\);)/, '$1 && !missedRef.current.has(_m.id)$2', 'T12b recordAnswer', errs);
  // T8 reset
  s = one(s, /(const reset = \(\) => \{ )(progClear\(LESSON_META\.lessonId\);)/, "$1if (!firstPassRef.current) { firstPassRef.current = { answers, durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000) }; setFpPractice(true); } $2", 'T8 reset', errs);
  // T9 progress
  s = one(s, /(progWrite\(LESSON_META\.lessonId, \{ screen, answers, earned: \[\.\.\.earnedRef\.current\], )(startedAt:[^}]*\}\);\s*\n\s*\}, \[screen, answers, earned)(\]\);)/, '$1missed: [...missedRef.current], firstPass: firstPassRef.current, $2, missed, fpPractice$3', 'T9 progWrite', errs);
  // T10 finishLesson (faqat tana ichida)
  const fm = /const finishLesson = \(\) => \{\n/.exec(s);
  if (!fm) errs.push('T10 finishLesson yo\'q'); else {
    const end = s.indexOf("if (typeof onFinished === 'function') onFinished(payload);", fm.index);
    if (end < 0) errs.push('T10 onFinished qatori'); else {
      let body = s.slice(fm.index + fm[0].length, end);
      const n1 = (body.match(/\banswers\[i\]/g) || []).length;
      body = body.replace(/\banswers\[i\]/g, 'ans[i]').replace('screenMeta: SCREEN_META, answers, earned', 'screenMeta: SCREEN_META, answers: ans, earned')
        .replace('durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000)', 'durationSec: fp ? fp.durationSec : Math.floor((Date.now() - startTimeRef.current) / 1000)');
      const ind = (body.match(/^(\s*)const scoredMeta/m) || [, '    '])[1];
      body = body.replace(/^(\s*)const scoredMeta/m, `${ind}const fp = firstPassRef.current; // 151-qonun 6-band: «Qaytadan» bosilgan bo'lsa — BIRINCHI o'tish natijasi ketadi\n${ind}const ans = fp ? fp.answers : answers;\n$1const scoredMeta`);
      if (n1 < 2 || !body.includes('const ans = fp')) errs.push('T10 tana');
      s = s.slice(0, fm.index + fm[0].length) + body + "if (typeof onFinished === 'function') onFinished(sealPayload(LESSON_META.lessonId, payload));" + s.slice(end + "if (typeof onFinished === 'function') onFinished(payload);".length);
    }
  }
  // T11 Provider
  s = one(s, /^(\s*)<AchCtx\.Provider value=\{earned\}>\n/m, '$1<AchCtx.Provider value={earned}>\n$1<AchMissCtx.Provider value={achMissVal}>\n', 'T11 Provider ochilishi', errs);
  s = one(s, /^(\s*)<\/AchCtx\.Provider>\n/m, '$1</AchMissCtx.Provider>\n$1</AchCtx.Provider>\n', 'T11 Provider yopilishi', errs);
  // React import'i: ishlatilgan har hook import qilingan bo'lishi SHART (yo'g'i qo'shiladi)
  const rim = /^import (React, )?\{([^}]*)\} from 'react';/m.exec(s);
  if (!rim) errs.push("react import'i topilmadi"); else {
    const have = rim[2].split(',').map((x) => x.trim()).filter(Boolean);
    const need = HOOKS.filter((h) => new RegExp('\\b' + h + '\\(').test(s) && !have.includes(h));
    if (need.length) s = s.replace(rim[0], `import ${rim[1] || ''}{ ${[...have, ...need].join(', ')} } from 'react';`);
  }
  let synErr = '';
  try { transformSync(s, { loader: 'jsx', jsx: 'automatic' }); } catch (e) { synErr = String(e.message).split('\n')[0]; }
  if (errs.length || synErr) { fail++; console.log(`FAIL ${f}: ${[...errs, synErr && 'esbuild: ' + synErr].filter(Boolean).join(' · ')}`); continue; }
  ok++; stat.ins += s.split('\n').length - before;
  if (WRITE) writeFileSync(f, s);
  console.log(`${WRITE ? 'YOZILDI' : 'quruq '} ${f}  (+${s.split('\n').length - before} qator)`);
}
console.log(`\n${WRITE ? 'YOZISH' : 'QURUQ YURISH'}: mos ${ok} · o'tkazildi ${skip} · xato ${fail} · jami ${targets.length} · qo'shilgan qator ≈ ${stat.ins}`);
process.exit(fail ? 1 : 0);
