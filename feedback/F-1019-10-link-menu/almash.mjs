// F-1019-10: dasturlash/internet ma'nosidagi «havola» → «link», «menyu» → «menu» (faqat o'zbekcha matn qatorlari; kod nomlari, className, CSS, kod-namunalar tegilmaydi)
// node almash.mjs [--yoz] [fayl...]   — sukut: hamma src/**/*.jsx, faqat hisobot (royxat.tsv)
import fs from 'node:fs'; import path from 'node:path';
import { parse } from '@babel/parser'; import _traverse from '@babel/traverse';
const traverse = _traverse.default || _traverse;
const R = '/home/kali/Desktop/internetLesson', OUT = R + '/feedback/F-1019-10-link-menu';
const args = process.argv.slice(2); const YOZ = args.includes('--yoz'); const SKIP_F = new Set((process.env.SKIPF || '').split(',').filter(Boolean));
const walk = (d) => fs.readdirSync(d).flatMap(n => { const p = path.join(d, n); if (fs.statSync(p).isDirectory()) return ['eski', '2-moodull eski', 'taqdimot', 'live'].includes(n) ? [] : walk(p); return n.endsWith('.jsx') ? [p] : []; });
const files = args.filter(a => !a.startsWith('--')).map(f => path.resolve(f)); const FL = files.length ? files : walk(R + '/src');
const RE = /(?<![A-Za-z0-9_\-.#$'ʻ])([Hh])avola([a-z'ʻ]*)|(?<![A-Za-z0-9_\-.#$'ʻ])([Mm])enyu(?![-_])([a-z'ʻ]*)/g;
const OVQAT = /ovqat|taom|lavash|kafe|restoran|oshxona|burger|pizza|choyxona|somsa|shashlik|ichimlik|kofe|qahva|nonvoy|taomnoma|fast.?food|pishiriq|(?<![a-z])tort(?![a-z])|(?<![a-z'])osh(?![a-z])|pitsa|pizza|AvtoPizza/i;
// qo'lda ko'rilgan (19.10): sayt menyusi (ovqat so'zi bor, lekin menyu — sahifa navigatsiyasi) · matn ichida CSS · haqiqiy kod
const OQ = new Set(['src/1-Modull/DeployLesson.jsx:1137', 'src/1-Modull/DeployLesson.jsx:1695', 'src/3-Modull/PmLesson10.jsx:847', 'src/3-Modull/PmLesson10.jsx:1309', 'src/3-Modull/ReactBuildSiteLesson.jsx:1325', 'src/3-Modull/ReactBuildSiteLesson.jsx:1340', 'src/1-Modull/CssLesson2.jsx:2469']);
const QORA = new Set(['src/6-Modull/MobileAppPracticeLesson.jsx:168']);
const KOD = /<\/?[a-z][\w-]*[\s>/]|class=|className|\{[^}]*:[^}]*;|=>|\.\w+\s*\{|href=|#[a-z]/i;
// havola + qo'shimcha → link + qo'shimcha (o'zbek imlosi: link undosh bilan tugaydi)
const linkSuf = (s) => {
  if (/^si/.test(s)) return 'i' + s.slice(2);            // havolasi(ni,ga,da) → linki(ni,ga,da)
  if (/^ng/.test(s)) return 'i' + s;                     // havolangiz → linkingiz
  if (/^m(?![a-z])|^miz|^m[a-z]/.test(s) && !/^ma/.test(s)) return 'i' + s; // havolam → linkim
  if (/^ga/.test(s)) return 'ka' + s.slice(2);           // havolaga → linkka
  return s;                                             // lar, ni, da, dan, ning, dagi, li, …
};
const almash = (t) => t.replace(RE, (m, H, hs, M, ms) => H !== undefined ? (H === 'H' ? 'L' : 'l') + 'ink' + linkSuf(hs || '') : (M === 'M' ? 'M' : 'm') + 'enu' + (ms || ''));
const rows = []; let jami = 0, yozildi = 0;
for (const f of FL) {
  if (SKIP_F.has(path.relative(R, f))) continue;
  const src = fs.readFileSync(f, 'utf8'); if (!/[Hh]avola|[Mm]enyu/.test(src)) continue;
  let ast; try { ast = parse(src, { sourceType: 'module', plugins: ['jsx'], errorRecovery: true }); } catch (e) { rows.push([path.relative(R, f), 0, 'PARSE', e.message, '', '']); continue; }
  const ed = [];
  const tekshir = (node, kind, raw, start, p) => {
    RE.lastIndex = 0; if (!RE.test(raw)) return; RE.lastIndex = 0;
    let holat = 'ALMASH';
    const ota = p.parentPath && p.parentPath.node;
    if (kind === 'str' && ota) {
      if (ota.type === 'ObjectProperty' && ota.key === node) holat = 'KOD:kalit';
      else if (ota.type === 'JSXAttribute' && /^(className|id|key|htmlFor|href|src|data-|style|name|type)/.test(ota.name.name || '')) holat = 'KOD:attr';
      else if ((ota.type === 'BinaryExpression' && /^(===|!==|==|!=)$/.test(ota.operator)) || ota.type === 'SwitchCase' || ota.type === 'ImportDeclaration' || ota.type === 'MemberExpression') holat = 'KOD:taqqos';
      else if (ota.type === 'ObjectProperty' && ota.value === node && /^(uz|ru)$/.test(ota.key.name || ota.key.value || '')) holat = 'ALMASH';
      else if (/^[a-z0-9_'-]+$/.test(raw)) holat = 'QOLDA:id';
    }
    if (holat === 'ALMASH' && /<style|@media|\{\s*[a-z-]+\s*:/.test(raw)) holat = 'KOD:css';
    const line = src.slice(0, start).split('\n').length; const fl = path.relative(R, f) + ':' + line;
    if (holat === 'ALMASH' && /[Mm]enyu/.test(raw) && OVQAT.test(raw)) holat = 'QOLDA:ovqat';
    if (QORA.has(fl)) holat = 'KOD:qora';
    else if (OQ.has(fl) && /^(QOLDA|KOD:css)/.test(holat)) holat = 'ALMASH';
    const yangi = almash(raw);
    jami++; rows.push([path.relative(R, f), line, holat, raw.replace(/\s+/g, ' ').slice(0, 160), yangi.replace(/\s+/g, ' ').slice(0, 160)]);
    if (holat === 'ALMASH') ed.push([start, start + raw.length, yangi]);
  };
  traverse(ast, {
    StringLiteral(p) { const n = p.node; const raw = src.slice(n.start + 1, n.end - 1); tekshir(n, 'str', raw, n.start + 1, p); },
    TemplateElement(p) { const n = p.node; tekshir(n, 'tpl', src.slice(n.start, n.end), n.start, p); },
    JSXText(p) { const n = p.node; tekshir(n, 'jsx', src.slice(n.start, n.end), n.start, p); },
  });
  if (YOZ && ed.length) {
    let s = src; for (const [a, b, y] of ed.sort((x, z) => z[0] - x[0])) s = s.slice(0, a) + y + s.slice(b);
    fs.writeFileSync(f, s); yozildi += ed.length;
  }
}
fs.writeFileSync(OUT + '/royxat.tsv', ['fayl\tqator\tholat\toldin\tkeyin', ...rows.map(r => r.join('\t'))].join('\n'));
const c = {}; for (const r of rows) c[r[2]] = (c[r[2]] || 0) + 1;
console.log(`topildi ${jami} matn-tugun · ${JSON.stringify(c)} · fayl ${new Set(rows.map(r => r[0])).size}${YOZ ? ` · YOZILDI ${yozildi}` : ' (faqat hisobot)'}`);
