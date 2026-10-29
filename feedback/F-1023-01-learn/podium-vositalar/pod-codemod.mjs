// pod-codemod (28.10) — CodeStrike podium v2 (Abdulloh QA PODIUM-01…04) darsga: 4 o'zgarish, har biri AYNAN bir marta.
//   1) live/index.js importiga arenaOrder   2) arena jadvali .sort(arenaOrder(players))
//   3) useLiveSession(..., { liveToken, arena: {...} })   4) finishLesson boshida holdFinish
// + v1 podium effekti (faqat InternetLesson'da bo'lgan) olib tashlanadi. Ishlatish: node pod-codemod.mjs <fayl...> [--yoz]
import { readFileSync, writeFileSync } from 'node:fs';
const YOZ = process.argv.includes('--yoz');
const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));
let bad = 0;
for (const f of files) {
  let s = readFileSync(f, 'utf8');
  const errs = [];
  const one = (re, to, nom) => {
    const m = s.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')) || [];
    if (m.length !== 1) { errs.push(`${nom}: ${m.length} ta`); return; }
    s = s.replace(re, to);
  };
  // v1 effekti (InternetLesson)
  s = s.replace(/\n  \/\/ Podium \(28\.10\): mentor testni yakunlagach[^\n]*\n  useEffect\(\(\) => \{ if \(phase === 'done' && isStudent[^\n]*\n/, '\n');
  one(/^(import \{ )([^\n]*\} from '(?:\.\.\/)+live\/index\.js';)$/m, '$1arenaOrder, $2', 'import');
  one(/(  const board = players\.map\(p => \{ const s = quizScore\(qRows\.filter\(r => r\.player_id === p\.id\)\); return \{ id: p\.id, nickname: p\.nickname, \.\.\.s \}; \}\))\.sort\(\(a, b\) => b\.pts - a\.pts \|\| b\.ok - a\.ok\);/,
    "$1.sort(arenaOrder(players)); // teng ochkoda — oldin qo'shilgan yuqorida; LMS podiumi bilan bitta qoida (28.10)", 'board');
  one(/useLiveSession\(LESSON_META\.lessonId, answerKey, \{ liveToken \}\)/,
    'useLiveSession(LESSON_META.lessonId, answerKey, { liveToken, arena: { total: QUIZ_BANK.length, quizMs: QUIZ_MS, baseIdx: QUIZ_BASE_IDX } })', 'useLiveSession');
  one(/^(  const finishLesson = \(\) => \{\n)/m,
    "$1    if (typeof live.holdFinish === 'function' && live.holdFinish(finishLesson)) return; // CodeStrike podium: yakuniy o'rin kelguncha yuk ushlab turiladi (28.10)\n", 'finishLesson');
  if (/live\.arenaPodium/.test(s)) errs.push('v1 arenaPodium qoldi');
  if (errs.length) { bad++; console.log(`✗ ${f} — ${errs.join(' · ')}`); continue; }
  if (YOZ) writeFileSync(f, s);
  console.log(`✓ ${f}`);
}
console.log(`${files.length - bad}/${files.length} ${YOZ ? 'yozildi' : '(quruq)'}`);
process.exit(bad ? 1 : 0);
