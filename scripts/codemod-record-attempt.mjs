#!/usr/bin/env node
// codemod-record-attempt — har darsning test-komponentida (QuestionScreen.pick) HAR bosishni serverga yozish:
//   if (oneShot) { … live.submitAnswer(…) } else { … }
//   + if (live && live.recordAttempt) live.recordAttempt(screen, id, i, elapsed, { question, options, picked, correct, lang });
// Ball o'zgarmaydi (submitAnswer qoladi). Modulsiz (inline) eski darsda recordAttempt yo'q → guard o'tkazib yuboradi.
// Ishlatish: node scripts/codemod-record-attempt.mjs [--write] [--all | fayl…]
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const args = process.argv.slice(2);
const write = args.includes('--write');
let files = args.filter((a) => !a.startsWith('--'));
if (args.includes('--all') || !files.length) {
  files = [];
  const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); const st = statSync(p); if (st.isDirectory()) { if (!/demo|eski|solishtir|hw-demo|lms-harness|mentor|live|compilator|assets/.test(n)) walk(p); } else if (/\.jsx$/.test(n) && !/\.homework\.jsx$/.test(n)) files.push(p); } };
  walk('src');
}
const MARK = 'live.recordAttempt(';
let ok = 0, skip = 0, fail = 0, done = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  if (!/\boneShot\b/.test(src)) { skip++; continue; }
  if (src.includes(MARK)) { done++; continue; }
  const m = /^([ \t]*)if \(oneShot\) \{\n[\s\S]*?\n\1\} else \{\n[\s\S]*?\n\1\}\n/m.exec(src);
  if (!m) { fail++; console.log(`FAIL ${f}: oneShot if/else topilmadi`); continue; }
  const ind = m[1];
  const block = m[0];
  // Ifodalar darsning o'z onAnswer(...) chaqiruvidan olinadi (har dars variant matnini o'zicha nomlaydi: ouz/ou/optTexts/options)
  const q = /question:\s*([^,]+?),\s*options(?::\s*([^,]+?))?,\s*correctIndex:/.exec(block);
  const ca = /correctAnswer:\s*([^,]+?),\s*picked:/.exec(block);
  const sa = /studentAnswer:\s*([^,]+?),\s*correct:/.exec(block);
  const need = ['mountTs', 'SCREEN_META'];
  const missing = need.filter((n) => !src.includes(n));
  if (!q || !ca || !sa || missing.length) { fail++; console.log(`FAIL ${f}: onAnswer ifodalari topilmadi (${!q ? 'question/options ' : ''}${!ca ? 'correctAnswer ' : ''}${!sa ? 'studentAnswer ' : ''}${missing.join(',')})`); continue; }
  const qExpr = q[1].trim(), oExpr = (q[2] || 'options').trim(), cExpr = ca[1].trim(), sExpr = sa[1].trim();
  const hasLang = /\b__lang\b/.test(src);
  const lang = hasLang ? "(typeof __lang !== 'undefined' && __lang === 'ru') ? 'ru' : 'uz'" : "'uz'";
  const line = `${ind}// Har urinish tarixga (LMS analitika, 0005): ball emas, yozuv; modulsiz eski darsda recordAttempt yo'q\n` +
    `${ind}if (live && live.recordAttempt) live.recordAttempt(screen, SCREEN_META[screen]?.id || \`s\${screen}\`, i, Date.now() - mountTs.current, { question: ${qExpr}, options: ${oExpr}, picked: ${sExpr}, correct: ${cExpr}, lang: ${lang} });\n`;
  const out = src.slice(0, m.index) + block + line + src.slice(m.index + block.length);
  if (write) writeFileSync(f, out);
  ok++;
}
console.log(`${write ? 'YOZILDI' : 'QURUQ-YURISH'}: mos ${ok} · allaqachon ${done} · oneShot yo'q ${skip} · xato ${fail} · jami ${files.length}`);
process.exit(fail ? 1 : 0);
