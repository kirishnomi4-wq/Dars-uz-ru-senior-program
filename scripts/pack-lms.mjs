// _lmspack — lms/<papka>/_YUKLASH.md ro'yxatini FbDemoApp.jsx tartibidan yasaydi.
import { readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';

const s = readFileSync('src/fb-demo/FbDemoApp.jsx', 'utf8');
const FOLDER = { '4-Modul': '4-M', '5-Modul': '5-M', '6-Modul': '6-M' };
const SRC = { '4-M': 'src/3-Modull (+ src/pm)', '5-M': 'src/4-Modull', '6-M': 'src/4a-Modull · src/4b-Modull · src/4c-Modull' };
const CMD = {
  '4-M': 'node scripts/build-lms.mjs src/3-Modull/<Dars>.jsx',
  '5-M': 'node scripts/build-lms.mjs src/4-Modull/<Dars>.jsx',
  '6-M': 'node scripts/build-lms.mjs src/4c-Modull/<Dars>.jsx',
};

const mods = [...s.matchAll(/label:\s*\{\s*uz:\s*'([^']+)'[\s\S]*?heading:\s*\{\s*uz:\s*'((?:[^'\\]|\\.)*)'[\s\S]*?lessons:\s*\[([\s\S]*?)\n\s{4}\],/g)];
if (!mods.length) { console.error('modul topilmadi'); process.exit(1); }

for (const [, label, heading, body] of mods) {
  const dir = FOLDER[label];
  if (!dir) { console.log('o\'tkazildi: ' + label); continue; }
  const rows = body.split('\n').filter((l) => /key:\s*'/.test(l));
  const out = [];
  let n = 0, missing = 0;
  for (const l of rows) {
    const num = (/n:\s*(\d+)/.exec(l) || [])[1] || '?';
    const type = (/type:\s*'([^']+)'/.exec(l) || [])[1] || '?';
    const comp = (/comp:\s*([A-Za-z0-9_]+)/.exec(l) || [])[1];
    // sarlavha ichida apostrof bo'lsa manbada QO'SH tirnoq ishlatilgan — ikkalasi ham olinadi
    const title = (((/title:\s*\{\s*uz:\s*'((?:[^'\\]|\\.)*)'/.exec(l) || [])[1]
      ?? (/title:\s*\{\s*uz:\s*"((?:[^"\\]|\\.)*)"/.exec(l) || [])[1]) || '')
      .replace(/\\(['"])/g, '$1').replace(/\|/g, '/');
    if (!comp) { out.push(`| ${num} | ${type} | — | *(fayl yo'q — ${title})* | | |`); continue; }
    const file = 'lms/' + dir + '/' + comp + '.jsx';
    if (!existsSync(file)) { out.push(`| ${num} | ${type} | ❌ **YO'Q** | ${comp}.jsx | | |`); missing++; continue; }
    const src = readFileSync(file, 'utf8');
    const id = (/lessonId:\s*['"]([^'"]+)['"]/.exec(src) || [])[1] || '—';
    const kb = Math.round(statSync(file).size / 1024) + ' KB';
    const hc = /hc-root/.test(src.replace(/^\/\/.*$/gm, '')) ? ' ⚙' : '';
    out.push(`| ${num} | ${type} | \`${comp}.jsx\` | ${title} | \`${id}\` | ${kb}${hc} |`);
    n++;
  }
  const md = `# ${dir} — LMS'ga yuklash ro'yxati

> **Bu papka = LMS kursidagi \`${label}\`** — ${heading}
> Manba: ${SRC[dir]} · Tartib: \`src/fb-demo/FbDemoApp.jsx\` (haqiqiy dars tartibi).
> Papkadagi **${n} ta \`.jsx\`** faylning HAMMASI yuklanadi. Boshqa hech narsa kerak emas:
> har fayl o'zi-yetarli (faqat \`import … from "react"\`), ⚙ belgisi — kompilyator ichida.

| # | Tur | Fayl | Dars | lessonId | Hajm |
|---|---|---|---|---|---|
${out.join('\n')}

## Qoidalar

- **Bu papkani QO'LDA to'ldirmang.** Fayllar \`build-lms\` chiqishi:
  \`${CMD[dir]}\`
  Yig'uv shu papkaga yozadi — ildizda (\`lms/\`) nusxa QOLMAYDI, shuning uchun eski faylni
  adashib yuklab yuborish xavfi yo'q.
- **Tahrir manbaga kiritiladi**, keyin dars qayta yig'iladi. Yig'ilgan faylni tahrirlash — behuda.
- Yuklashdan oldin: \`npm run smoke:lms\` — har fayl brauzerda ochilib tekshiriladi.
- \`Rezerv\` va \`Demo\` kunlarida fayl yo'q — ular dars-fayli talab qilmaydi.
`;
  writeFileSync('lms/' + dir + '/_YUKLASH.md', md, 'utf8');
  console.log(dir + ': ' + n + ' dars' + (missing ? ' · ' + missing + ' YETISHMAYDI' : ' · to\'liq'));
}
