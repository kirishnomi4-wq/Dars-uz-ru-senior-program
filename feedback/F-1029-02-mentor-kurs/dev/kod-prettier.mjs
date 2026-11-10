// F-1103-04 (03.11): dars bo'laklaridagi O'Z demo-kodimizni Prettier (80 belgi) bilan formatlaydi — kod o'ralmasin, qator kesilmasin.
// Faqat `js(...)` / `ts(...)` bloklari, 80 belgidan uzun qatori borlari. O'TKAZIB YUBORILADI (ro'yxatga): reponing haqiqiy satr raqamlari
// (`NAME.forEach((l, i) => { l.n`), qator indeksiga tayanadigan joylar (`NAME.slice(`, `NAME[`, `NAME.map(`), Prettier tushunmagan parcha.
// Belgilar (id, at, keep…) eski qatordan shu qatordan chiqqan HAMMA yangi qatorlarga o'tadi (bayonot bo'linsa — butunlay yoritiladi).
// ISHLATISH: PRETTIER=<.../node_modules/prettier/index.mjs> node dev/kod-prettier.mjs [--yoz] <bo'lak.jsx> …   (--yozsiz — faqat hisobot)
import fs from 'node:fs';
const prettier = await import(process.env.PRETTIER);
const args = process.argv.slice(2);
const WRITE = args.includes('--yoz');
const files = args.filter((a) => a !== '--yoz');

function findEnd(s, i) { // String.raw`…` (+ '…' + String.raw`…`)* zanjiri oxiri
  let j = i;
  for (;;) {
    if (!s.startsWith('String.raw`', j)) return -1;
    j += 'String.raw`'.length;
    const k = s.indexOf('`', j); if (k < 0) return -1;
    j = k + 1;
    const m = /^\s*\+\s*'((?:[^'\\]|\\.)*)'\s*\+\s*/.exec(s.slice(j));
    if (m) { j += m[0].length; continue; }
    return j;
  }
}
function balanced(s, i) { // { … } muvozanatli
  if (s[i] !== '{') return -1; let d = 0;
  for (let j = i; j < s.length; j++) { if (s[j] === '{') d++; else if (s[j] === '}') { d--; if (!d) return j + 1; } else if (s[j] === "'" || s[j] === '"') { const q = s[j]; j++; while (j < s.length && s[j] !== q) { if (s[j] === '\\') j++; j++; } } }
  return -1;
}
const norm = (c) => (c === '"' || c === '`' ? "'" : c);
function mapLines(oldCode, newCode) {
  const seq = (code) => { const out = []; code.split('\n').forEach((l, li) => { for (const ch of l) if (!/\s/.test(ch)) out.push([norm(ch), li]); }); return out; };
  const A = seq(oldCode), B = seq(newCode);
  const firstOld = new Map(); let a = 0;
  for (let b = 0; b < B.length; b++) {
    const [ch, nl] = B[b];
    if (a < A.length && A[a][0] === ch) { if (!firstOld.has(nl)) firstOld.set(nl, A[a][1]); a++; continue; }
    if (',;()'.includes(ch)) { if (!firstOld.has(nl) && a < A.length) firstOld.set(nl, A[Math.min(a, A.length - 1)][1]); continue; }
    while (a < A.length && ',;()'.includes(A[a][0]) && A[a][0] !== ch) a++;
    if (a < A.length && A[a][0] === ch) { if (!firstOld.has(nl)) firstOld.set(nl, A[a][1]); a++; continue; }
    if (!firstOld.has(nl) && a < A.length) firstOld.set(nl, A[a][1]); a++;
  }
  return firstOld; // yangi qator (0-asosli) → eski qator (0-asosli); bo'sh qatorlar yo'q
}
const enc = (code) => code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
const objSrc = (o) => '{ ' + Object.entries(o).map(([k, v]) => `${k}: { ${Object.entries(v).map(([kk, vv]) => `${kk}: ${typeof vv === 'string' ? `'${vv}'` : JSON.stringify(vv)}`).join(', ')} }`).join(', ') + ' }';

import path from 'node:path';
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  // indeks tekshiruvi butun dars bo'yicha (blok boshqa bo'lakda kesilishi mumkin — BAZA_JS.slice 15-ekranda)
  const all = fs.readdirSync(path.dirname(f)).filter((x) => x.endsWith('.jsx')).map((x) => fs.readFileSync(path.join(path.dirname(f), x), 'utf8')).join('\n');
  const re = /const (\w+) = (js|ts)\(String\.raw`/g; let m; const edits = [];
  while ((m = re.exec(s))) {
    const name = m[1], kind = m[2];
    const exprStart = m.index + m[0].length - 'String.raw`'.length;
    const exprEnd = findEnd(s, exprStart); if (exprEnd < 0) { console.log(`${f} ${name}: ifoda oxiri topilmadi`); continue; }
    const expr = s.slice(exprStart, exprEnd);
    let rest = s.slice(exprEnd); let idsSrc = null, idsEnd = exprEnd;
    const cm = /^\s*,\s*/.exec(rest);
    if (cm && rest[cm[0].length] === '{') { const b = balanced(s, exprEnd + cm[0].length); idsSrc = s.slice(exprEnd + cm[0].length, b); idsEnd = b; }
    const code = new Function('return ' + expr)();
    const body = code.replace(/^\n/, '');
    const long = body.split('\n').filter((l) => l.length > 80).length;
    if (!long) continue;
    const esc = name.replace(/\$/g, '\\$');
    if (!(process.env.FORCE || '').split(',').includes(name) && (new RegExp(`${esc}\\.forEach\\(\\(l, i\\) => \\{ l\\.n|${esc}\\.(slice|map|filter)\\(|${esc}\\[`).test(all) || /REPO|ENTITY|SVC/.test(name))) { console.log(`${f} ${name}: O'TKAZILDI (indeks/repo) — ${long} uzun qator`); continue; }
    let out;
    try { out = (await prettier.format(body, { parser: kind === 'ts' ? 'typescript' : 'babel', singleQuote: true, printWidth: 80 })).replace(/\n$/, ''); }
    catch (e) { console.log(`${f} ${name}: Prettier tushunmadi — ${String(e.message).split('\n')[0]}`); continue; }
    const ids = idsSrc ? new Function('return ' + idsSrc)() : {};
    const map = mapLines(body, out);
    const nIds = {};
    out.split('\n').forEach((l, ni) => { if (!l.trim()) return; const o = map.get(ni); if (o != null && ids[o + 1]) nIds[ni + 1] = ids[o + 1]; });
    const still = out.split('\n').filter((l) => l.length > 80).length;
    console.log(`${f} ${name}: ${body.split('\n').length} → ${out.split('\n').length} qator · uzun ${long} → ${still} · belgi ${Object.keys(ids).length} → ${Object.keys(nIds).length}`);
    const repl = `${kind}(\`\n${enc(out)}\`${idsSrc ? ', ' + objSrc(nIds) : ''}`;
    edits.push([exprStart - (kind.length + 1), idsEnd, repl]);
  }
  if (WRITE && edits.length) {
    for (const [a, b, r] of edits.sort((x, y) => y[0] - x[0])) s = s.slice(0, a) + r + s.slice(b);
    fs.writeFileSync(f, s);
  }
}
