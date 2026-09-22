// ============================================================================
//  codemod-auto-next — arena AVTO-O'TISHini barcha darslarga tarqatadi (F-0922-03).
//
//  Nega codemod: arena UI 97 darsda takrorlangan. Qo'lda tahrirlash = 97 xato
//  ehtimoli. Mantiqning O'ZI `src/live/useAutoNext.js` da — bu yerda faqat
//  ULANISH yamog'i, har faylda AYNAN bir xil to'rt joy:
//
//    1) import   — `useAutoNext` umumiy moduldan
//    2) hook     — `const lastQ = …` dan keyin (phase/isMentor/solo/qi qamrovda)
//    3) onClick  — qo'lda o'tish ham hookdan o'tadi (ikki marta o'tish qulfi)
//    4) tugma    — mavjud `.qz-btn.ghost` uslubida, `qz-auto` barqaror sinfi bilan
//
//  Langarlar oldin o'lchangan: to'rttasi ham 97/97 faylda bir xil.
//  `.qz-btn.ghost` ham 97/97 da bor — YANGI CSS KERAK EMAS.
//
//  Ishlatish: node scripts/codemod-auto-next.mjs [--dry] [fayl…]
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const only = args.filter((a) => !a.startsWith('--'));
const SKIP = ['eski', '2-moodull eski', 'node_modules'];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (SKIP.includes(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.jsx')) out.push(p);
  }
  return out;
}

const ANCHOR_CLICK = "onClick={() => lastQ ? ctrl('done', qi) : ctrl('q', qi + 1)}";
const ANCHOR_LASTQ = '  const lastQ = qi >= QUIZ_BANK.length - 1;\n';
const IMPORT_RE = /(import \{)([^}]*)(\} from '\.\.\/live\/index\.js';)/;

const files = (only.length ? only : walk('src')).filter((f) => readFileSync(f, 'utf8').includes(ANCHOR_CLICK));
let ok = 0; const bad = [];

for (const f of files) {
  let s = readFileSync(f, 'utf8');
  const problems = [];
  if (s.includes('useAutoNext')) { bad.push([f, 'allaqachon yamoqlangan']); continue; }
  if ((s.match(new RegExp(ANCHOR_CLICK.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length !== 1) problems.push('onClick langari 1 emas');
  if (s.split(ANCHOR_LASTQ).length - 1 !== 1) problems.push('lastQ langari 1 emas');
  if (!IMPORT_RE.test(s)) problems.push('live-import topilmadi');
  if (problems.length) { bad.push([f, problems.join(' · ')]); continue; }

  // 1) import
  s = s.replace(IMPORT_RE, (m, a, mid, z) => `${a}${mid.replace(/\s*$/, '')}, useAutoNext ${z}`);

  // 2) hook
  s = s.replace(ANCHOR_LASTQ, ANCHOR_LASTQ + `  // Javob ochilgach keyingi savolga avto o'tish (F-0922-03). Soat faqat MENTOR
  // brauzerida; o'quvchilar server orqali ergashadi. Oxirgi savolda avto YO'Q —
  // «G'oliblarni e'lon qilish» mentorning daqiqasi.
  const autoNext = useAutoNext({
    on: phase === 'reveal' && isMentor && !solo && !lastQ,
    onFire: () => ctrl('q', qi + 1),
    qKey: qi,
  });
`);

  // 3) qo'lda o'tish ham hookdan (bir savolga bitta o'tish)
  s = s.replace(ANCHOR_CLICK, "onClick={() => lastQ ? ctrl('done', qi) : autoNext.fireNow()}");

  // 4) ⏸ tugmasi — bir tilli darsda oddiy satr, ikki tilli darsda tr({uz,ru})
  const ikkiTilli = s.includes('tr({');
  const yorliq = ikkiTilli
    ? "{autoNext.auto ? `${tr({ uz: \"To'xtatish\", ru: 'Пауза' })}${autoNext.sec ? ` · ${autoNext.sec}` : ''}` : tr({ uz: '▶ Avto', ru: '▶ Авто' })}"
    : "{autoNext.auto ? `To'xtatish${autoNext.sec ? ` · ${autoNext.sec}` : ''}` : '▶ Avto'}";
  const sarlavha = ikkiTilli
    ? "title={tr({ uz: \"Avto o'tishni to'xtatish — javobni tushuntirish uchun (arena oxirigacha)\", ru: 'Остановить авто-переход — чтобы объяснить ответ (до конца арены)' })}"
    : "title=\"Avto o'tishni to'xtatish — javobni tushuntirish uchun (arena oxirigacha)\"";
  const lines = s.split('\n');
  const i = lines.findIndex((l) => l.includes("lastQ ? ctrl('done', qi) : autoNext.fireNow()"));
  if (i < 0) { bad.push([f, 'tugma qatori topilmadi (4-qadam)']); continue; }
  const ind = ' '.repeat(lines[i].length - lines[i].trimStart().length);
  lines.splice(i + 1, 0, `${ind}{isMentor && !lastQ && <button className="qz-btn ghost qz-auto" onClick={autoNext.auto ? autoNext.pause : autoNext.resume} ${sarlavha}>${yorliq}</button>}`);
  s = lines.join('\n');

  if (!DRY) writeFileSync(f, s);
  ok++;
}

console.log(`${DRY ? '[DRY] ' : ''}yamoqlandi: ${ok} · o'tkazildi: ${bad.length}`);
for (const [f, why] of bad) console.log(`  – ${f}: ${why}`);
process.exit(bad.some(([, w]) => w !== 'allaqachon yamoqlangan') ? 1 : 0);
