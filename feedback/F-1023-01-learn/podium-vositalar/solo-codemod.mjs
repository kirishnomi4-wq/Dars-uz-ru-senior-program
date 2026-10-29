// solo-codemod (29.10, F-1029-01) — CodeStrike FAQAT ustozga ulangan jonli darsda.
// Har darsning yakun ekranida: uyda (solo) / ko'rishda (review) / sinf tugagan-mentor uzilgan (studentSolo) → tugma yopiq + yozuv.
// Arena ichidagi QUTQARUV: «Mashq rejimida davom etish» o'rniga «CodeStrike to'xtadi» + Yopish.
// Namuna — InternetLesson (qo'lda). Har o'zgarish faylda AYNAN 1 marta topilishi shart, aks holda fayl tegilmaydi.
// Ishlatish (worktree ildizidan): node solo-codemod.mjs          — quruq (hech narsa yozmaydi)
//                                  node solo-codemod.mjs --yoz    — yozadi
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const YOZ = process.argv.includes('--yoz');
const LOCK_UZ = "CodeStrike sinfda, ustoz bilan o'ynaladi";
const LOCK_RU = 'CodeStrike — в классе, с ментором';
const files = execSync("grep -rl 'const studentSolo = ' src").toString().trim().split('\n').sort();

const count = (s, sub) => s.split(sub).length - 1;
const res = { yozildi: [], otkazildi: [], xato: [] };
for (const f of files) {
  let s = readFileSync(f, 'utf8');
  if (s.includes('csLocked')) { res.otkazildi.push(f); continue; } // namuna yoki oldin qo'yilgan
  const err = [];
  // a) jonli-sessiya o'zgaruvchisi nomi (_live / live)
  const v = /const isStudentL = (?:!!\()?(\w+) && \1\.mode === 'student'/.exec(s);
  if (!v) err.push('isStudentL');
  const V = v && v[1];
  // b) csLocked — studentWait qatoridan keyin
  const wl = s.match(/^([ \t]*)const studentWait = [^\n]*\n/gm) || [];
  if (wl.length !== 1) err.push(`studentWait×${wl.length}`);
  // c–e) yakun ekranidagi CsWordmark
  const D = 'disabled={studentWait}', O = 'onClick={studentWait ? undefined : openArena}', H = 'hint={studentWait ? ';
  if (count(s, D) !== 1) err.push(`disabled×${count(s, D)}`);
  if (count(s, O) !== 1) err.push(`onClick×${count(s, O)}`);
  if (count(s, H) !== 1) err.push(`hint×${count(s, H)}`);
  // f) arena ichidagi QUTQARUV bloki
  const EN = /(\{classEnded && isStudent && !solo && phase !== 'done' && \(\n)([ \t]*)<div className="qz-endnote fade-step">\n[\s\S]*?\n[ \t]*<\/div>\n/g;
  const en = s.match(EN) || [];
  if (en.length !== 1) err.push(`endnote×${en.length}`);
  else if (!/startPractice/.test(en[0]) || /<div[^>]*>[\s\S]*<div/.test(en[0].replace(/^[\s\S]*?qz-endnote[^>]*>/, ''))) err.push('endnote-ichi');
  if (err.length) { res.xato.push(`${f}: ${err.join(', ')}`); continue; }

  const raw = s.slice(s.indexOf(H) + H.length).startsWith('{ uz:'); // hint xom obyekt (CsWordmark o'zi tr qiladi) yoki tr(...)
  const lock = raw ? `{ uz: "${LOCK_UZ}", ru: '${LOCK_RU}' }` : `tr({ uz: "${LOCK_UZ}", ru: '${LOCK_RU}' })`;
  s = s.replace(/^([ \t]*)(const studentWait = [^\n]*\n)/m, (m, ind, line) => `${ind}${line}${ind}const csLocked = !!(${V} && (${V}.mode === 'solo' || ${V}.mode === 'review' || studentSolo)); // F-1029-01: CodeStrike faqat ustozga ulangan jonli darsda — uyda/ko'rishda/sinf tugaganda yopiq, LMS Learn ochadi\n`);
  s = s.replace(D, 'disabled={studentWait || csLocked}');
  s = s.replace(O, 'onClick={(studentWait || csLocked) ? undefined : openArena}');
  s = s.replace(H, `hint={csLocked ? ${lock} : studentWait ? `);
  s = s.replace(EN, (m, head, ind) => `${head}${ind}<div className="qz-endnote fade-step">\n`
    + `${ind}  <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — CodeStrike to'xtadi.", ru: '⚠️ Живой урок завершён — CodeStrike остановлен.' })}</span>\n`
    + `${ind}  <button className="qz-btn" onClick={closeArena}>{tr({ uz: 'Yopish', ru: 'Закрыть' })}</button>\n`
    + `${ind}</div>\n`);
  // QUTQARUV izohi (bo'lsa) — mashq endi yo'q
  s = s.replace(/\{\/\* QUTQARUV:[^*]*?mashq[\s\S]*?\*\/\}/, (m) => {
    const ind = (/\n([ \t]*)\S[^\n]*\*\/\}$/.exec(m) || [, '      '])[1];
    return `{/* QUTQARUV: jonli dars tugadi/mentor chiqib ketdi — o'quvchi osilib qolmaydi, arenani yopadi.\n${ind}F-1029-01: ustozsiz CodeStrike davom etmaydi (mashq yo'q) — berilgan javoblar qoladi */}`;
  });
  if (!s.includes('const closeArena = ')) { res.xato.push(`${f}: closeArena yo'q`); continue; }
  if (YOZ) writeFileSync(f, s);
  res.yozildi.push(f);
}
console.log(`${YOZ ? 'YOZILDI' : 'QURUQ'}: ${res.yozildi.length} · o'tkazildi (csLocked bor): ${res.otkazildi.length} · xato: ${res.xato.length} / ${files.length}`);
if (res.otkazildi.length) console.log("o'tkazildi:", res.otkazildi.join(' '));
for (const x of res.xato) console.log('✗', x);
