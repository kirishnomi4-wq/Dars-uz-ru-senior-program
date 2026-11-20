#!/usr/bin/env node
// F-1120-01 codemod — yakuniy (scope:'final') ball-ekrani javobi: haqiqiy variant + haqiqiy vaqt.
//   1) dars ildizi: scrTsRef — joriy ekranga kirgan vaqt (reportScreen effektidan oldin)
//   2) recordAnswer yakuniy qatori: A-ko'rinish (0, true, 0) → haqiqiy picked + vaqt; B-ko'rinish → vaqt; ikkalasiga «Qaytadan» himoyasi
//   3) QuestionScreen jonli onAnswer ma'lumotiga elapsedMs (MCQ — ikkala yozuv aynan bir xil bo'lsin)
// Ishlatish: node codemod-f1120.mjs <fayl.jsx…> [--yoz]   (--yoz siz — faqat hisobot)
import fs from 'node:fs';
const WRITE = process.argv.includes('--yoz');
const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const NOTE = "// F-1120-01: yakuniy ball-ekrani — haqiqiy variant va vaqt (oldin 0/0 ketardi: server birinchisini olib, to'g'ri javob «A, xato, 0 s» bo'lardi)";
const ANC = /^([ \t]*)useEffect\(\(\) => \{ live\.reportScreen\(screen\); \}, \[screen, live\.mode, live\.pin\]\);/;
const A_OLD = "live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0);";
const A_NEW = "live.mode === 'student' && !firstPassRef.current) live.submitAnswer(idx, _m.id, Number.isInteger(data.picked) ? data.picked : 0, true, Number.isFinite(data.elapsedMs) ? data.elapsedMs : Date.now() - scrTsRef.current);";
const B_OLD = "live.mode === 'student') live.submitAnswer(idx, _m.id, data.picked ?? 1, !!data.correct, data.elapsedMs || 0);";
const B_NEW = "live.mode === 'student' && !firstPassRef.current) live.submitAnswer(idx, _m.id, data.picked ?? 1, !!data.correct, Number.isFinite(data.elapsedMs) ? data.elapsedMs : Date.now() - scrTsRef.current);";
const FINAL_RE = /_m\.scope === 'final' && data && data\.(correct|solved) && live\.mode === 'student'\) live\.submitAnswer\(idx, _m\.id, /;
let bad = 0;
for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  const L = raw.split(/\r?\n/);
  const errs = [];
  if (raw.includes('scrTsRef')) errs.push('scrTsRef allaqachon bor');
  // 1) ildiz
  const ai = L.map((l, i) => (ANC.test(l) ? i : -1)).filter((i) => i >= 0);
  if (ai.length !== 1) errs.push(`langar ${ai.length}`);
  // 2) yakuniy qator
  const fi = L.map((l, i) => (FINAL_RE.test(l) ? i : -1)).filter((i) => i >= 0);
  if (fi.length !== 1) errs.push(`yakuniy qator ${fi.length}`);
  let kind = '?';
  if (fi.length === 1) {
    const l = L[fi[0]];
    if (l.split(A_OLD).length === 2) kind = 'A'; else if (l.split(B_OLD).length === 2) kind = 'B'; else errs.push('yakuniy qator shakli notanish');
  }
  // 3) QuestionScreen oneShot onAnswer
  const oi = [];
  L.forEach((l, i) => { if (/^\s*if \(oneShot\) \{\s*$/.test(l)) for (let j = i + 1; j < i + 5; j++) if (/onAnswer\(screen, \{/.test(L[j])) { oi.push(j); break; } });
  if (oi.length > 1) errs.push(`oneShot ${oi.length}`);
  if (oi.length === 1 && (/elapsedMs/.test(L[oi[0]]) || !/ \}\);\s*$/.test(L[oi[0]]) || !/mountTs/.test(raw))) errs.push('oneShot qatori shakli notanish');
  if (!/firstPassRef/.test(raw)) errs.push('firstPassRef yo\'q');
  if (errs.length) { bad++; console.log(`✗ ${f}: ${errs.join('; ')}`); continue; }
  // qo'llash (pastdan yuqoriga — indekslar siljimasin)
  const ops = [];
  ops.push([fi[0], () => { const ind = L[fi[0]].match(/^[ \t]*/)[0]; L[fi[0]] = L[fi[0]].replace(kind === 'A' ? A_OLD : B_OLD, kind === 'A' ? A_NEW : B_NEW); L.splice(fi[0], 0, ind + NOTE); }]);
  ops.push([ai[0], () => { const ind = L[ai[0]].match(/^[ \t]*/)[0]; L.splice(ai[0], 0, `${ind}const scrTsRef = useRef(Date.now()); // F-1120-01: joriy ekranga kirgan vaqt — yakuniy javob vaqti shundan`, `${ind}useEffect(() => { scrTsRef.current = Date.now(); }, [screen]);`); }]);
  if (oi.length === 1) ops.push([oi[0], () => { L[oi[0]] = L[oi[0]].replace(/ \}\);(\s*)$/, ', elapsedMs: Date.now() - mountTs.current });$1'); }]);
  ops.sort((x, y) => y[0] - x[0]).forEach(([, fn]) => fn());
  console.log(`✓ ${f}: ${kind}${oi.length ? ' +mcq' : ''}`);
  if (WRITE) fs.writeFileSync(f, L.join(eol));
}
console.log(`${files.length} fayl · ${bad} rad · ${WRITE ? 'YOZILDI' : 'quruq yurish'}`);
process.exit(bad ? 1 : 0);
