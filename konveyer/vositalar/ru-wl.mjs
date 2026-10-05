// RU ish-ro'yxati: `{ uz: A, ru: B }` juftliklaridan uz'i HEAD'dagidan farq qiladiganlarini chiqaradi.
//   node ru-wl.mjs <fayl.jsx> <chiqish.json> [--base=<baseline.jsx>]   (baseline yo'q bo'lsa: git show HEAD:<fayl>)
//   node ru-wl.mjs --apply <wl.json> <tr.json>                           (ru qiymatlarini joyiga qo'yadi)
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { scan, M } from '/home/kali/Desktop/internetLesson/tools/ru-gate.mjs';

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}]/gu;
const stripEmoji = (s) => s.replace(EMOJI, '').replace(/\s+/g, ' ').replace(/(['"`>]) /g, '$1').replace(/ (['"`<])/g, '$1').trim();

function valueEnd(sc, i) {
  const { src, strings, elems, pairs } = sc;
  const c = src[i];
  if (c === '"' || c === "'" || c === '`') {
    const s = strings.find((x) => x.start === i);
    return s ? { end: s.end + 1, kind: c === '`' ? 'tpl' : 'str' } : null;
  }
  if (c === '<') { const e = elems.get(i); return e ? { end: e, kind: 'jsx' } : null; }
  if (c === '(') {
    const close = pairs.get(i); if (close == null) return null;
    let j = i + 1; while (/\s/.test(src[j])) j++;
    return { end: close + 1, kind: src[j] === '<' ? 'jsx' : 'expr' };
  }
  if (c === '[') { const close = pairs.get(i); return close == null ? null : { end: close + 1, kind: 'arr' }; }
  return null;
}

export function pairsOf(src) {
  const sc = scan(src);
  const out = [];
  const re = /\buz\s*:\s*/g;
  let m;
  while ((m = re.exec(src))) {
    if (sc.mode[m.index] !== M.CODE) continue;
    const prev = src.slice(Math.max(0, m.index - 3), m.index);
    if (/[.\w$]$/.test(prev)) continue;
    const uS = m.index + m[0].length;
    const uv = valueEnd(sc, uS); if (!uv) continue;
    const rest = src.slice(uv.end);
    const rm = /^\s*,\s*ru\s*:\s*/.exec(rest); if (!rm) continue;
    const rS = uv.end + rm[0].length;
    const rv = valueEnd(sc, rS); if (!rv) continue;
    out.push({ uzStart: uS, uzEnd: uv.end, uz: src.slice(uS, uv.end), kind: uv.kind, ruStart: rS, ruEnd: rv.end, ru: src.slice(rS, rv.end), ruKind: rv.kind,
      line: src.slice(0, m.index).split('\n').length });
    re.lastIndex = rv.end;
  }
  return out;
}

const args = process.argv.slice(2);
if (args[0] === '--apply') {
  const wl = JSON.parse(readFileSync(args[1], 'utf8'));
  const tr = JSON.parse(readFileSync(args[2], 'utf8'));
  let src = readFileSync(wl.file, 'utf8');
  const items = [...wl.items].sort((a, b) => b._ruStart - a._ruStart);
  let put = 0, miss = [], bad = [];
  for (const it of items) {
    if (!(it.id in tr)) { miss.push(it.id); continue; }
    if (src.slice(it._ruStart, it._ruEnd) !== it._ru) { bad.push(it.id + ' (joy o\'zgargan)'); continue; }
    let v = tr[it.id];
    if (it.kind === 'str' || it.kind === 'tpl') {
      if (typeof v !== 'string') { bad.push(it.id + ' (satr emas)'); continue; }
      if (it.kind === 'tpl' && /\$\{/.test(it.uz)) v = '`' + v.replace(/^`|`$/g, '') + '`';
      else v = JSON.stringify(v);
    }
    src = src.slice(0, it._ruStart) + v + src.slice(it._ruEnd);
    put++;
  }
  writeFileSync(wl.file, src);
  console.log(`qo'yildi: ${put} · tarjimasiz: ${miss.length}${miss.length ? ' → ' + miss.join(', ') : ''} · XATO: ${bad.length}${bad.length ? ' → ' + bad.join(', ') : ''}`);
  process.exit(miss.length || bad.length ? 1 : 0);
} else {
  const [file, outPath] = args;
  const baseArg = args.find((a) => a.startsWith('--base='));
  const cur = readFileSync(file, 'utf8');
  const base = baseArg ? readFileSync(baseArg.slice(7), 'utf8') : execSync(`git show HEAD:${file}`, { encoding: 'utf8', maxBuffer: 64e6 });
  const bp = pairsOf(base);
  const baseUz = new Map(); for (const p of bp) { if (!baseUz.has(p.uz)) baseUz.set(p.uz, new Set()); baseUz.get(p.uz).add(p.ru); }
  const baseRu = new Set(bp.map((p) => p.ru));
  const baseStripped = new Map(); for (const p of bp) baseStripped.set(stripEmoji(p.uz), p);
  const items = [];
  let same = 0, n = 0;
  for (const p of pairsOf(cur)) {
    if (baseUz.has(p.uz) && baseUz.get(p.uz).has(p.ru)) { same++; continue; }
    if (p.kind === 'arr' || p.kind === 'expr') { items.push({ id: 'X' + (++n), line: p.line, kind: p.kind, uz: p.uz, ru_old: p.ru, manual: true, _ruStart: p.ruStart, _ruEnd: p.ruEnd, _ru: p.ru }); continue; }
    const emojiOnly = !baseUz.has(p.uz) && baseStripped.has(stripEmoji(p.uz)) && !EMOJI.test(p.uz);
    items.push({ id: 'R' + (++n), line: p.line, kind: p.kind, uz: p.uz, ru_old: p.ru, emojiOnly, ruByBuilder: !baseRu.has(p.ru),
      _ruStart: p.ruStart, _ruEnd: p.ruEnd, _ru: p.ru });
  }
  writeFileSync(outPath, JSON.stringify({ file, items }, null, 1));
  console.log(`${file}: juftlik ${same + items.length} · o'zgarmagan ${same} · ish-ro'yxati ${items.length} (emojiOnly ${items.filter((i) => i.emojiOnly).length}, quruvchi ru yozgan ${items.filter((i) => i.ruByBuilder).length}, qo'lda ${items.filter((i) => i.manual).length})`);
}
