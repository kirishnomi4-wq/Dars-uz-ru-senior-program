#!/usr/bin/env node
// codemod-6band-proto — PROTOTIP (KATTA §41, A to'lqin): 151-qonun 6-bandi + umumiy `missed` infratuzilmasi + onFinished yukini muhrlash.
// src/ GA YOZMAYDI: natijani faqat --out <papka> ga NUSXA qilib yozadi va har nusxani esbuild bilan sintaksis-tekshiradi.
//   node feedback/F-0918-04/codemod-6band-proto.mjs --out <skretchpad-papka>
// Uslub: scripts/codemod-record-attempt.mjs / codemod-result-details.mjs (regex, quruq-yurish, FAIL ro'yxati).
// Nomlar to'qnashmasligi uchun ildiz holati `fpPractice` (14 darsda `practice` band), kontekst maydoni pilotdagidek `practice`.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { transformSync } from 'esbuild';
const out = process.argv[process.argv.indexOf('--out') + 1];
if (!out || out.startsWith('src')) { console.error('--out <papka> kerak (src emas)'); process.exit(2); }
const rows = JSON.parse(readFileSync('feedback/F-0918-04/codemod-olchov.json', 'utf8')).rows;
const targets = rows.filter((r) => r.group === 'G1-mexanik' || r.group === 'G2-parametrli').map((r) => r.file);
const one = (s, re, rep, name, errs) => { const m = s.match(new RegExp(re.source, re.flags.replace('g', '') + 'g')) || []; if (m.length !== 1) { errs.push(`${name}: ${m.length} ta`); return s; } return s.replace(re, rep); };
let ok = 0, fail = 0, syn = 0; const stat = { ins: 0 };
for (const f of targets) {
  let s = readFileSync(f, 'utf8'); const before = s.split('\n').length; const errs = [];
  // T1 import: sealPayload (src/live ga qo'shiladigan yangi eksport)
  s = one(s, /^(import \{[^}]*?)( ?)\} from '((?:\.\.\/)+live\/index\.js)';/m, "$1, sealPayload } from '$3';", 'T1 live-import', errs);
  if (!/\buseMemo\b/.test((s.match(/^import [^\n]* from 'react';/m) || [''])[0])) s = one(s, /^(import (?:React, )?\{[^}]*?)( ?)\} from 'react';/m, "$1, useMemo } from 'react';", 'T1b useMemo', errs);
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
  s = one(s, /(if \(_m && (?:_m\.scored && )?ACH_TRIGGERS\[_m\.id\] && data && data\.correct)(\) earn\(ACH_TRIGGERS\[_m\.id\]\);)/, '$1 && !missedRef.current.has(_m.id)$2', 'T12b recordAnswer', errs);
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
      s = s.slice(0, fm.index + fm[0].length) + body + "if (typeof onFinished === 'function') onFinished(sealPayload(LESSON_META.lessonId, payload)); // yuk birinchi «Yakunlash»da muhrlanadi (LMS idempotency_key)" + s.slice(end + "if (typeof onFinished === 'function') onFinished(payload);".length);
    }
  }
  // T11 Provider
  s = one(s, /^(\s*)<AchCtx\.Provider value=\{earned\}>\n/m, '$1<AchCtx.Provider value={earned}>\n$1<AchMissCtx.Provider value={achMissVal}>\n', 'T11 Provider ochilishi', errs);
  s = one(s, /^(\s*)<\/AchCtx\.Provider>\n/m, '$1</AchMissCtx.Provider>\n$1</AchCtx.Provider>\n', 'T11 Provider yopilishi', errs);
  let synErr = '';
  try { transformSync(s, { loader: 'jsx', jsx: 'automatic' }); } catch (e) { synErr = String(e.message).split('\n')[0]; syn++; }
  if (errs.length || synErr) { fail++; console.log(`FAIL ${f}: ${[...errs, synErr && 'esbuild: ' + synErr].filter(Boolean).join(' · ')}`); }
  else { ok++; stat.ins += s.split('\n').length - before; const p = join(out, f); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, s); }
}
console.log(`PROTOTIP (nusxaga): mos ${ok} · xato ${fail} (shundan esbuild ${syn}) · jami ${targets.length} · qo'shilgan qator ≈ ${stat.ins} (o'rtacha ${(stat.ins / Math.max(ok, 1)).toFixed(1)}/dars)`);
