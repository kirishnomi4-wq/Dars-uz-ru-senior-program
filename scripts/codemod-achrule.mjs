#!/usr/bin/env node
// codemod-achrule — 151-qonun «🏅 Birinchi urinishda…» qatori (`AchRule` komponenti + `.ach-rule` CSS) ni darsga o'rnatadi.
// Faqat qator ULANADIGAN darsga ishlatiladi (o'lik kod qolmasin). Etalon: src/1-Modull/InternetLesson.jsx.
// Ishlatish:  node scripts/codemod-achrule.mjs [--write] [--refresh] <fayl...>     (--write bo'lmasa — QURUQ yurish)
//   --refresh — komponent allaqachon bo'lsa, uni kanonik matn bilan almashtiradi (pilotni moslash uchun).
// Matn — MATN_KORPUS §183 (hamma darsda aynan bir xil, uz + ru). `once` — qayta urinishi yo'q ekran (uchinchi matn).
// Rang: palitradagi ENG XIRA, lekin o'qiladigan rang (fonga kontrast ≥ 4.5:1): ink3 → ink3Deep → ink2.
// `tr()` yo'q darsda (faqat o'zbekcha darslar) — o'zbekcha satr.
import { readFileSync, writeFileSync } from 'node:fs';
import { transformSync } from 'esbuild';

const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const REFRESH = argv.includes('--refresh');
const files = argv.filter((a) => !a.startsWith('--'));
if (!files.length) { console.error('fayl kerak'); process.exit(2); }

const TXT = {
  RULE: { uz: "🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: '🏅 Справитесь с первой попытки — значок ваш.' },
  LOST: { uz: "Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.", ru: 'Значок давался за первую попытку — теперь спокойно найдите верный ответ.' },
  ONCE: { uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок давался за первую попытку.' },
};
const q = (s) => (s.includes("'") ? JSON.stringify(s) : `'${s}'`);
const say = (hasTr, t) => (hasTr ? `tr({ uz: ${q(t.uz)}, ru: ${q(t.ru)} })` : q(t.uz));

const component = (hasTr) => `// 🏅 151-qonun: amaliy topshiriq nishoni faqat BIRINCHI urinishga beriladi. Shart OLDINDAN aytiladi; birinchi urinish
// xato bo'lsa — jazosiz qisqa xabar (\`once\` — qayta urinishi yo'q ekran). Mentor ekranida, «Qaytadan» mashq-o'tishida va
// nishon olingach ko'rinmaydi. Matn — MATN_KORPUS §183 (hamma darsda aynan bir xil).
const AchRule = ({ screen, once }) => {
  const earned = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const gate = useContext(LiveGateCtx) || {};
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || (gate.live && gate.live.mode === 'mentor') || (earned && earned.has(ach))) return null;
  const lost = am.missed.has(sid);
  return <p className={\`ach-rule \${lost ? 'lost' : ''}\`}>{lost
    ? (once ? ${say(hasTr, TXT.ONCE)} : ${say(hasTr, TXT.LOST)})
    : ${say(hasTr, TXT.RULE)}}</p>;
};
`;

// WCAG nisbiy yorug'lik va kontrast
const lum = (h) => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map((c) => c + c).join('');
  const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = [0, 2, 4].map((i) => f(parseInt(h.slice(i, i + 2), 16) / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

function pickColor(s) {
  const m = /const T = \{([\s\S]*?)\n\};/.exec(s);
  if (!m) return { err: 'palitra `const T` topilmadi' };
  const pal = Object.fromEntries([...m[1].matchAll(/(\w+):\s*'(#[0-9A-Fa-f]{3,6})'/g)].map((x) => [x[1], x[2]]));
  if (!pal.bg) return { err: 'palitrada `bg` yo\'q' };
  for (const k of ['ink3', 'ink3Deep', 'ink2']) if (pal[k] && contrast(pal[k], pal.bg) >= 4.5) return { key: k, ratio: contrast(pal[k], pal.bg).toFixed(2) };
  return { err: 'palitrada 4.5:1 dan yuqori xira rang yo\'q' };
}

// CSS qo'shiladigan joy: yagona `<style>{\`` shablonining yopilishidan oldin, yoki `<style>{NOM}</style>` bo'lsa — `const NOM = \`` oxiri
function cssAnchor(s) {
  const opens = [...s.matchAll(/<style>\{`/g)].map((m) => m.index);
  if (opens.length === 1) {
    const end = s.indexOf('`}</style>', opens[0]);
    if (end < 0) return { err: '`}</style> topilmadi' };
    return { at: s.lastIndexOf('\n', end) + 1 };
  }
  if (opens.length > 1) return { err: `<style> shabloni ${opens.length} ta — qo'lda` };
  const nm = /<style>\{([A-Z_][A-Z0-9_]*)\}<\/style>/.exec(s);
  if (!nm) return { err: '<style> topilmadi' };
  const st = s.search(new RegExp(`^const ${nm[1]} = \``, 'm'));
  if (st < 0) return { err: `const ${nm[1]} topilmadi` };
  const close = /^\s*`;?\s*$/m.exec(s.slice(st + 1));
  if (!close) return { err: `${nm[1]} yopilishi topilmadi` };
  return { at: st + 1 + close.index };
}

let ok = 0, skip = 0, fail = 0;
for (const f of files) {
  let s = readFileSync(f, 'utf8'); const errs = [];
  const hasTr = /\bconst tr = |\bfunction tr\(/.test(s);
  const has = /^const AchRule = /m.test(s);
  if (has && !REFRESH) { skip++; console.log(`SKIP ${f}: AchRule allaqachon bor`); continue; }
  for (const need of ['const AchCtx = createContext', 'const AchMissCtx = createContext', 'LiveGateCtx', 'const SCREEN_META', 'useContext'])
    if (!s.includes(need)) errs.push(`${need} yo'q`);
  const col = pickColor(s); if (col.err) errs.push(col.err);
  if (has) {
    // --refresh: eski izoh-blok + komponent kanonik bilan almashtiriladi; CSS rangi yangilanadi
    const st = s.search(/^\/\/ 🏅 151-qonun: amaliy topshiriq nishoni faqat BIRINCHI urinishga beriladi\./m);
    const cs = s.search(/^const AchRule = /m);
    const from = st >= 0 && st < cs ? st : cs;
    const end = s.indexOf('\n};\n', cs);
    if (end < 0) errs.push('AchRule oxiri topilmadi'); else s = s.slice(0, from) + component(hasTr) + s.slice(end + 4);
    if (!col.err) s = s.replace(/(\.ach-rule \{[^}\n]*color: \$\{T\.)\w+(\};)/, `$1${col.key}$2`);
  } else {
    const trig = /^const ACH_TRIGGERS = \{[^\n]*\n/m.exec(s);
    if (!trig) errs.push('ACH_TRIGGERS (bir qatorli) topilmadi');
    const css = cssAnchor(s); if (css.err) errs.push(css.err);
    if (!errs.length) {
      const indent = (/^([ \t]*)\S/m.exec(s.slice(s.lastIndexOf('\n', css.at - 2) + 1)) || ['', '        '])[1] || '        ';
      const cssLines = `${indent}.ach-rule { margin: 8px 0 0; text-align: center; font-size: 13px; line-height: 1.4; color: \${T.${col.key}}; }\n${indent}.ach-rule.lost { font-style: italic; }\n`;
      s = s.slice(0, css.at) + cssLines + s.slice(css.at); // avval CSS (keyinroq joy) — yuqoridagi indeks surilmaydi
      const t2 = /^const ACH_TRIGGERS = \{[^\n]*\n/m.exec(s);
      s = s.slice(0, t2.index + t2[0].length) + '\n' + component(hasTr) + s.slice(t2.index + t2[0].length);
    }
  }
  let syn = '';
  if (!errs.length) { try { transformSync(s, { loader: 'jsx', jsx: 'automatic' }); } catch (e) { syn = String(e.message).split('\n')[0]; } }
  if (errs.length || syn) { fail++; console.log(`FAIL ${f}: ${[...errs, syn && 'esbuild: ' + syn].filter(Boolean).join(' · ')}`); continue; }
  ok++;
  if (WRITE) writeFileSync(f, s);
  console.log(`${WRITE ? 'YOZILDI' : 'quruq  '} ${f}  (rang ${col.key} ${col.ratio}:1 · ${hasTr ? 'uz+ru' : 'faqat uz'}${has ? ' · refresh' : ''})`);
}
console.log(`\n${WRITE ? 'YOZISH' : 'QURUQ YURISH'}: mos ${ok} · o'tkazildi ${skip} · xato ${fail} · jami ${files.length}`);
process.exit(fail ? 1 : 0);
