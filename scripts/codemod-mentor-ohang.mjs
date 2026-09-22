// ============================================================================
//  codemod-mentor-ohang — mentor statistikasi paneli: IDORAVIY shakl → BUYRUQ.
//  (F-0922-04 · foydalanuvchi qarori 2026-09-22 · KORPUS 72)
//
//  MUAMMO: «…qisqa takrorlash TAVSIYA ETILADI» — idoraviy shakl. Bitta gap 45
//  darsda takrorlangan (o'zbekcha 108 hodisa), ruschasi esa fayllar bo'ylab
//  20 xil shaklga bo'linib ketgan («Рекомендуем…», «Рекомендуется…», «Стоит…»).
//
//  NEGA REGEX EMAS, JADVAL: «рекоменд» va «стоит» dars MAZMUNIDA ham uchraydi —
//  Netflix tavsiyalari, ekspert byurosi tavsiyalari, «Стоит на месте klaviaturы»,
//  «соСТОИТ SKILL». Regex ularni ham almashtirib yuborardi. Shuning uchun har
//  satr AYNAN yoziladi va almashtirish soni o'lchanadi.
//
//  Ishlatish: node scripts/codemod-mentor-ohang.mjs [--dry]
// ============================================================================
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DRY = process.argv.includes('--dry');
const SKIP = ['eski', '2-moodull eski', 'node_modules'];

// AYNAN satrlar. Chap tomon — hozirgi matn, o'ng tomon — buyruq shakli.
const MAP = [
  // --- o'zbekcha (108) ---
  ['Davom etishdan oldin qisqa takrorlash tavsiya etiladi.', 'Davom etishdan oldin qisqa takrorlab oling.'],
  ['Qayta tushuntirish tavsiya etiladi.', 'Qayta tushuntiring.'],
  // --- ruscha: «Рекомендуем / Рекомендуется» ---
  ['Перед продолжением рекомендуем короткое повторение.', 'Перед продолжением коротко повторите.'],
  ['Перед продолжением рекомендуется короткое повторение.', 'Перед продолжением коротко повторите.'],
  ['Перед тем как идти дальше, рекомендуем короткое повторение.', 'Перед тем как идти дальше, коротко повторите.'],
  ['Перед тем как идти дальше, рекомендуем коротко повторить.', 'Перед тем как идти дальше, коротко повторите.'],
  ['Перед тем как продолжить, рекомендуем короткое повторение.', 'Перед тем как продолжить, коротко повторите.'],
  ['Рекомендуем объяснить ещё раз.', 'Объясните ещё раз.'],
  ['Рекомендуется объяснить ещё раз.', 'Объясните ещё раз.'],
  ['Рекомендуем объяснить их ещё раз.', 'Объясните их ещё раз.'],
  ['Рекомендуется объяснить их ещё раз.', 'Объясните их ещё раз.'],
  ['Рекомендуем объяснить её ещё раз.', 'Объясните её ещё раз.'],
  ['Рекомендуется объяснить её ещё раз.', 'Объясните её ещё раз.'],
  ['Рекомендуем объяснить заново.', 'Объясните заново.'],
  ['Рекомендуется объяснить заново.', 'Объясните заново.'],
  ['Рекомендуем разобрать её ещё раз.', 'Разберите её ещё раз.'],
  // --- ruscha: «Стоит…» (yumshoq, lekin baribir bilvosita) ---
  ['Перед продолжением стоит коротко повторить.', 'Перед продолжением коротко повторите.'],
  ['Перед тем как идти дальше, стоит коротко повторить.', 'Перед тем как идти дальше, коротко повторите.'],
  ['Прежде чем идти дальше, стоит коротко повторить.', 'Прежде чем идти дальше, коротко повторите.'],
  ['Стоит объяснить заново.', 'Объясните заново.'],
  ['Стоит объяснить ещё раз.', 'Объясните ещё раз.'],
  ['Стоит объяснить её ещё раз.', 'Объясните её ещё раз.'],
];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (SKIP.includes(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.jsx')) out.push(p);
  }
  return out;
}

const tally = new Map(MAP.map(([a]) => [a, 0]));
let files = 0;
for (const f of walk('src')) {
  let s = readFileSync(f, 'utf8');
  const before = s;
  for (const [a, b] of MAP) {
    if (!s.includes(a)) continue;
    const n = s.split(a).length - 1;
    tally.set(a, tally.get(a) + n);
    s = s.split(a).join(b);
  }
  if (s !== before) { files++; if (!DRY) writeFileSync(f, s); }
}
let jami = 0;
console.log(`${DRY ? '[DRY] ' : ''}fayl: ${files}`);
for (const [a, n] of tally) { if (n) { jami += n; console.log(`  ${String(n).padStart(4)}×  ${a.slice(0, 66)}`); } }
console.log(`jami almashtirildi: ${jami}`);
