#!/usr/bin/env node
// codemod-result-details — jonli-modulli darslarning onFinished payload'iga TZ §4 detallarini qo'shadi (Axadulla 2026-09-08).
//   node scripts/codemod-result-details.mjs            — quruq yugurish (hisobot)
//   node scripts/codemod-result-details.mjs --write    — yozish
// Har darsda: (1) '../live/index.js' importiga buildResultDetails, (2) payload'dagi
//   answers: SCREEN_META.map((s|_|_s, i) => answers[i]).filter(Boolean)
// satridan keyin  ...buildResultDetails({ lessonId, screenMeta, answers, earned, achievements })  — earned (Set) va ACHIEVEMENTS darsning o'zida.
// Shart: `const live = useLiveSession(`, `const [earned, setEarned]`, `const ACHIEVEMENTS`, aynan BITTA answers-satri. Aks holda o'tkaziladi (hisobotda).
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
const WRITE = process.argv.includes('--write');
const SKIP = new Set(['live', 'eski', '2-moodull eski', 'hw-demo', 'm1-demo', 'fb-demo', 'mentor', 'lms-harness', 'compilator']);
const walk = (d) => readdirSync(d).flatMap((n) => { const p = path.join(d, n); if (statSync(p).isDirectory()) return SKIP.has(n) ? [] : walk(p); return n.endsWith('.jsx') && !n.includes('.homework.') ? [p] : []; });
const ANS_RE = /answers: SCREEN_META\.map\(\((?:s|_|_s), i\) => answers\[i\]\)\.filter\(Boolean\)/g;
const CALL = "...buildResultDetails({ lessonId: LESSON_META.lessonId, screenMeta: SCREEN_META, answers, earned, achievements: ACHIEVEMENTS })";
const out = { done: [], already: [], skipped: [] };
for (const f of walk('src')) {
  let s = readFileSync(f, 'utf8');
  if (!s.includes('const live = useLiveSession(')) continue;
  if (s.includes('buildResultDetails(')) { out.already.push(f); continue; }
  const why = [];
  if (!/const \[earned, setEarned\]/.test(s)) why.push('earned state yo\'q');
  if (!/const ACHIEVEMENTS\s*=/.test(s)) why.push('ACHIEVEMENTS yo\'q');
  const m = s.match(ANS_RE) || [];
  if (m.length !== 1) why.push(`answers-satri ${m.length} ta`);
  const imp = s.match(/^import \{([^}]*)\} from '(\.\.\/)+live\/index\.js';/m);
  if (!imp) why.push('live/index import yo\'q');
  if (why.length) { out.skipped.push([f, why.join(', ')]); continue; }
  s = s.replace(imp[0], imp[0].replace(/\} from/, ', buildResultDetails } from'));
  s = s.replace(ANS_RE, (x) => `${x},\n      ${CALL}`);
  if (WRITE) writeFileSync(f, s, 'utf8');
  out.done.push(f);
}
console.log(`${WRITE ? 'YOZILDI' : 'quruq'}: ${out.done.length} dars · allaqachon: ${out.already.length} · o'tkazildi: ${out.skipped.length}`);
for (const [f, w] of out.skipped) console.log(`  o'tkazildi ${f}: ${w}`);
