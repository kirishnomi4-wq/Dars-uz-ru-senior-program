#!/usr/bin/env node
// ============================================================================
// RU-GATE — UZ-regressiya darvozasi (RU_I18N_SPEC 1–6 bo'limlar asosida)
//
//   node tools/ru-gate.mjs <baseline.jsx> <translated.jsx> [--unwrap=ou,ouz,uzOf] [--out=<dir>]
//
// Isbotlaydigan tasdiq:  esbuild(normalize(translated)) === esbuild(normalize(baseline))
// ya'ni tarjima UZ matnni ham, mantiqni ham bitta belgiga o'zgartirmagan.
//
// normalize — JSX-xabardor skaner (to'liq parser emas, lekin satr/shablon/izoh/regex/JSX
// rejimlarini farqlaydi va qavs-balansini shu rejimlar asosida hisoblaydi):
//   • tr(EXPR)                         → EXPR               (ichma-ich ham)
//   • { uz: A, ru: B } / { uz: A }     → A                  (ikkala tomonga ham)
//   • {<>…</>} / {(<>…</>)} / {<React.Fragment>…</React.Fragment>}  (JSX bola-o'rnida) → …
//   • {'Matn'} (JSX bola-o'rnida, xavfsiz belgilar)         → Matn
//   • .map(tr)                         → (o'chiriladi)
//   • let __lang / const tr = … / __lang = lang; / lang={__lang}  → olib tashlanadi / "uz"
// Keyin ikkalasi esbuild (jsx → js, minifySyntax, izohsiz) orqali kanonik matnga aylanadi
// va QATOR-diff qilinadi. minifyIdentifiers ATAYIN o'chiq: u lokal o'zgaruvchi nomi
// o'zgarganini yashirgan bo'lardi (bu ham regressiya).
//
// Ikkinchi funksiya — RU-QOLDIQ skaneri: translated faylda `ru:` maydonidan tashqarida
// qolgan, o'quvchiga ko'rinadigan o'zbekcha matn-nomzodlarini qator raqami bilan chiqaradi
// (ogohlantirish — exit-kodga ta'sir qilmaydi).
//
// Chiqish kodi: 0 = TENG · 1 = FARQ · 2 = fayl/argument xatosi
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, basename, join } from 'node:path';
import * as esbuild from 'esbuild';

const RED = '\x1b[31m', GRN = '\x1b[32m', YEL = '\x1b[33m', DIM = '\x1b[2m', B = '\x1b[1m', R = '\x1b[0m';

// ----------------------------------------------------------------------------
// 1. SKANER — rejim-xaritasi
// ----------------------------------------------------------------------------
export const M = { CODE: 0, STR: 1, TPL: 2, CMT: 3, RX: 4, TAG: 5, TEXT: 6, ATTRSTR: 7 };

const KW_BEFORE_EXPR = new Set(['return', 'typeof', 'case', 'do', 'else', 'in', 'instanceof', 'new', 'throw', 'void', 'yield', 'await', 'delete', 'of', 'default']);
const isIdStart = (c) => /[A-Za-z_$\u00AA-\uFFFF]/.test(c);
const isIdPart = (c) => /[A-Za-z0-9_$\u00AA-\uFFFF]/.test(c);
const isWs = (c) => c === ' ' || c === '\t' || c === '\n' || c === '\r';

/**
 * Manbani skanerlab har belgi uchun rejim, qavs-juftliklar, JSX-konteynerlar,
 * JSX-matn hududlari, satr-literallar va JSX-element chegaralarini qaytaradi.
 */
export function scan(src) {
  const n = src.length;
  const mode = new Uint8Array(n);
  const pairs = new Map();         // ochuvchi indeks → yopuvchi indeks  ( ( [ { va JSX-konteyner { )
  const containers = [];           // { open, close, kind: 'child'|'attr' }
  const texts = [];                // { start, end } JSX matn hududlari (end — exclusive)
  const strings = [];              // { start, end, quote, mode } — end = yopuvchi qo'shtirnoq indeksi
  const elems = new Map();         // JSX element '<' indeksi → elementdan keyingi indeks
  const objects = [];              // CODE-rejimdagi { … } juftliklari (keyin ob'ekt-literal sifatida tekshiriladi)

  let i = 0;
  let lastType = 'start';          // 'start' | 'ident' | 'kw' | 'num' | 'punct' | 'close' | 'str' | 'jsx'
  let lastPunct = '';

  const fill = (a, b, m) => { for (let k = a; k < b && k < n; k++) mode[k] = m; };

  function jsxAllowed() {
    if (lastType === 'start' || lastType === 'kw') return true;
    if (lastType === 'punct') return lastPunct !== ')' && lastPunct !== ']';
    return false;
  }
  function regexAllowed() {
    if (lastType === 'start' || lastType === 'kw') return true;
    if (lastType === 'punct') return lastPunct !== ')' && lastPunct !== ']';
    return false;
  }

  function skipString(q) { // i — ochuvchi qo'shtirnoqda
    const start = i; i++;
    while (i < n) {
      const c = src[i];
      if (c === '\\') { i += 2; continue; }
      if (c === q) break;
      if (c === '\n') break; // buzuq satr — xavfsiz to'xtash
      i++;
    }
    fill(start, i + 1, M.STR);
    strings.push({ start, end: i, quote: q, mode: M.STR });
    i++;
  }

  function skipTemplate() { // i — ochuvchi ` da
    mode[i] = M.TPL; i++;
    while (i < n) {
      const c = src[i];
      if (c === '\\') { mode[i] = M.TPL; if (i + 1 < n) mode[i + 1] = M.TPL; i += 2; continue; }
      if (c === '`') { mode[i] = M.TPL; i++; return; }
      if (c === '$' && src[i + 1] === '{') {
        mode[i] = M.TPL; const open = i + 1; mode[open] = M.CODE;
        i = open + 1;
        const close = scanCode('}');
        pairs.set(open, close);
        if (close < n) { mode[close] = M.CODE; i = close + 1; }
        continue;
      }
      mode[i] = M.TPL; i++;
    }
  }

  function skipLineComment() { const s = i; while (i < n && src[i] !== '\n') i++; fill(s, i, M.CMT); }
  function skipBlockComment() { const s = i; i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++; i += 2; fill(s, i, M.CMT); }
  function skipRegex() {
    const s = i; i++; let inClass = false;
    while (i < n) {
      const c = src[i];
      if (c === '\\') { i += 2; continue; }
      if (c === '\n') break;
      if (inClass) { if (c === ']') inClass = false; }
      else if (c === '[') inClass = true;
      else if (c === '/') break;
      i++;
    }
    i++; while (i < n && /[a-z]/.test(src[i])) i++;
    fill(s, i, M.RX);
  }

  /** JSX element: i — '<' da. Element tugagandan keyingi indeksni qaytaradi. */
  function scanJsxElement() {
    const start = i;
    mode[i] = M.TAG; i++;
    if (src[i] === '>') { // <> fragment
      mode[i] = M.TAG; i++;
      scanJsxChildren();
      elems.set(start, i);
      return i;
    }
    // teg nomi
    while (i < n && !isWs(src[i]) && src[i] !== '/' && src[i] !== '>' && src[i] !== '{') { mode[i] = M.TAG; i++; }
    // atributlar
    while (i < n) {
      const c = src[i];
      if (isWs(c)) { mode[i] = M.TAG; i++; continue; }
      if (c === '/' && src[i + 1] === '>') { mode[i] = M.TAG; mode[i + 1] = M.TAG; i += 2; elems.set(start, i); return i; }
      if (c === '>') { mode[i] = M.TAG; i++; scanJsxChildren(); elems.set(start, i); return i; }
      if (c === '{') { // {...spread} yoki qiymat-konteyner
        const open = i; mode[i] = M.CODE; i++;
        const close = scanCode('}');
        pairs.set(open, close); containers.push({ open, close, kind: 'attr' });
        if (close < n) { mode[close] = M.CODE; i = close + 1; }
        continue;
      }
      if (c === '"' || c === "'") { // attr satri (escape yo'q)
        const s = i; i++; while (i < n && src[i] !== c) i++;
        fill(s, i + 1, M.ATTRSTR); strings.push({ start: s, end: i, quote: c, mode: M.ATTRSTR }); i++;
        continue;
      }
      if (c === '<') { scanJsxElement(); continue; } // attr qiymati JSX (kam uchraydi)
      if (c === '/' && src[i + 1] === '*') { skipBlockComment(); continue; }
      mode[i] = M.TAG; i++; // nom, =, -, : va boshqalar
    }
    elems.set(start, i);
    return i;
  }

  /** JSX bolalar: ochuvchi tegdan keyin. Yopuvchi teg o'tilganidan keyin qaytadi. */
  function scanJsxChildren() {
    let ts = i;
    const flushText = (to) => { if (to > ts) { fill(ts, to, M.TEXT); if (src.slice(ts, to).trim()) texts.push({ start: ts, end: to }); } };
    while (i < n) {
      const c = src[i];
      if (c === '<') {
        flushText(i);
        if (src[i + 1] === '/') { // yopuvchi teg
          const s = i; while (i < n && src[i] !== '>') i++; i++; fill(s, i, M.TAG); return;
        }
        scanJsxElement(); ts = i; continue;
      }
      if (c === '{') {
        flushText(i);
        const open = i; mode[i] = M.CODE; i++;
        const close = scanCode('}');
        pairs.set(open, close); containers.push({ open, close, kind: 'child' });
        if (close < n) { mode[close] = M.CODE; i = close + 1; }
        ts = i; continue;
      }
      i++;
    }
    flushText(i);
  }

  /**
   * Kod rejimi: `closer` belgisi (0-chuqurlikda) topilguncha skanerlaydi;
   * closer indeksini qaytaradi (iste'mol qilmaydi). closer=null → EOF gacha.
   */
  function scanCode(closer) {
    lastType = 'punct'; lastPunct = closer === '}' ? '{' : closer === ')' ? '(' : closer === ']' ? '[' : '';
    if (closer === null) lastType = 'start';
    while (i < n) {
      const c = src[i];
      if (isWs(c)) { i++; continue; }
      if (c === '/' && src[i + 1] === '/') { skipLineComment(); continue; }
      if (c === '/' && src[i + 1] === '*') { skipBlockComment(); continue; }
      if (c === '"' || c === "'") { skipString(c); lastType = 'str'; continue; }
      if (c === '`') { skipTemplate(); lastType = 'str'; continue; }
      if (c === '/') { if (regexAllowed()) { skipRegex(); lastType = 'str'; } else { i++; lastType = 'punct'; lastPunct = '/'; } continue; }
      if (c === '<' && jsxAllowed() && (src[i + 1] === '>' || isIdStart(src[i + 1] || ''))) { scanJsxElement(); lastType = 'jsx'; continue; }
      if (c === '(' || c === '[' || c === '{') {
        const open = i; i++;
        const close = scanCode(c === '(' ? ')' : c === '[' ? ']' : '}');
        pairs.set(open, close);
        if (c === '{') objects.push({ open, close });
        if (close < n) i = close + 1;
        lastType = (c === '{') ? 'punct' : 'close'; lastPunct = c === '(' ? ')' : c === '[' ? ']' : '}';
        // `{ … }` dan keyin regex/JSX mumkin (blok oxiri); ( ) va [ ] dan keyin — yo'q
        continue;
      }
      if (c === ')' || c === ']' || c === '}') {
        if (c === closer) return i;
        i++; lastType = 'close'; lastPunct = c; continue; // balanssiz — davom
      }
      if (isIdStart(c)) {
        const s = i; while (i < n && isIdPart(src[i])) i++;
        const w = src.slice(s, i);
        lastType = KW_BEFORE_EXPR.has(w) ? 'kw' : 'ident'; continue;
      }
      if (/[0-9]/.test(c)) { while (i < n && /[0-9a-zA-Z_.]/.test(src[i])) i++; lastType = 'num'; continue; }
      // punktuatsiya (=> ni bitta token deb olamiz)
      if (c === '=' && src[i + 1] === '>') { i += 2; lastType = 'punct'; lastPunct = '=>'; continue; }
      i++; lastType = 'punct'; lastPunct = c;
    }
    return n;
  }

  scanCode(null);
  return { src, mode, pairs, containers, texts, strings, elems, objects };
}

// ----------------------------------------------------------------------------
// 2. NORMALIZE
// ----------------------------------------------------------------------------
const lineOf = (src, idx) => { let l = 1; for (let k = 0; k < idx; k++) if (src.charCodeAt(k) === 10) l++; return l; };

/** 0-chuqurlikdagi (qavslar, JSX elementlar va satrlar tashqarisidagi) CODE-belgilar bo'yicha iteratsiya */
function* topLevel(S, from, to) {
  let k = from;
  while (k < to) {
    if (S.mode[k] === M.CODE) {
      const c = S.src[k];
      if ((c === '(' || c === '[' || c === '{') && S.pairs.has(k)) { k = S.pairs.get(k) + 1; continue; }
    } else if (S.mode[k] === M.TAG && S.src[k] === '<' && S.elems.has(k)) { k = S.elems.get(k); continue; }
    yield k; k++;
  }
}

/** ifodaning 0-chuqurligida operator bormi (qavsga olish kerakmi) */
function needsParens(S, from, to) {
  const txt = S.src.slice(from, to).trim();
  if (/^[\w$.]+$/.test(txt)) return false;
  for (const k of topLevel(S, from, to)) {
    if (S.mode[k] !== M.CODE) continue;
    if ('?:+-*/%|&=<>!,'.includes(S.src[k])) return true;
  }
  return false;
}

/** `{ uz: A [, ru: B] }` ob'ekt-literalini tahlil qiladi; mos kelmasa null */
function parseUzObject(S, open, close) {
  const src = S.src;
  // bo'laklarga ajratish (0-chuqurlikdagi vergullar)
  const parts = []; let s = open + 1;
  for (const k of topLevel(S, open + 1, close)) if (S.mode[k] === M.CODE && src[k] === ',') { parts.push([s, k]); s = k + 1; }
  parts.push([s, close]);
  const fields = {};
  for (const [a, b] of parts) {
    const seg = src.slice(a, b);
    if (!seg.trim()) continue; // bo'sh (trailing vergul)
    const m = /^\s*(['"]?)(uz|ru)\1\s*:/.exec(seg);
    if (!m) return null;
    if (fields[m[2]]) return null;
    const vs = a + m[0].length;
    // qiymat chegaralari (trim)
    let va = vs, vb = b; while (va < vb && isWs(src[va])) va++; while (vb > va && isWs(src[vb - 1])) vb--;
    if (va === vb) return null;
    fields[m[2]] = [va, vb];
  }
  if (!fields.uz) return null;
  return fields;
}

/** Bir o'tishda barcha ICHKI (boshqa nomzodni o'z ichiga olmagan) almashtirishlarni qo'llaydi */
function passA(src, unwrapFns) {
  const S = scan(src);
  const cands = []; // { start, end, repl }
  const fnAlt = unwrapFns.map(f => f.replace(/\$/g, '\\$')).join('|');
  const reCall = new RegExp(`(?<![\\w$.])(?:${fnAlt})\\s*\\(`, 'g');
  let m;
  while ((m = reCall.exec(src))) {
    const at = m.index;
    if (S.mode[at] !== M.CODE) continue;
    const p = at + m[0].length - 1;
    const close = S.pairs.get(p); if (close === undefined) continue;
    // .map(tr) kabi — argument yo'q
    let a = p + 1, b = close; while (a < b && isWs(src[a])) a++; while (b > a && isWs(src[b - 1])) b--;
    if (a === b) continue;
    // bitta argument bo'lishi kerak (0-chuqurlikda vergul yo'q)
    let comma = false; for (const k of topLevel(S, a, b)) if (S.mode[k] === M.CODE && src[k] === ',') { comma = true; break; }
    if (comma) continue;
    const inner = src.slice(a, b);
    cands.push({ start: at, end: close + 1, repl: needsParens(S, a, b) ? `(${inner})` : inner, kind: 'call' });
  }
  for (const { open, close } of S.objects) {
    if (close >= src.length) continue;
    const head = src.slice(open + 1, open + 12);
    if (!/^\s*(['"]?)(uz|ru)\1\s*:/.test(head)) continue;
    const f = parseUzObject(S, open, close); if (!f) continue;
    const [va, vb] = f.uz;
    const inner = src.slice(va, vb);
    cands.push({ start: open, end: close + 1, repl: needsParens(S, va, vb) ? `(${inner})` : inner, kind: 'obj' });
  }
  // `.map(tr)` → ''
  const reMap = new RegExp(`\\.map\\(\\s*(?:${fnAlt})\\s*\\)`, 'g');
  while ((m = reMap.exec(src))) if (S.mode[m.index] === M.CODE) cands.push({ start: m.index, end: m.index + m[0].length, repl: '', kind: 'map' });

  if (!cands.length) return { src, changed: 0 };
  cands.sort((x, y) => x.start - y.start || y.end - x.end);
  // faqat ichki nomzodlar (boshqa nomzod boshlanishini o'z ichiga olmaganlar)
  const inner = [];
  for (let k = 0; k < cands.length; k++) {
    const c = cands[k]; let hasInner = false;
    for (let j = k + 1; j < cands.length && cands[j].start < c.end; j++) { hasInner = true; break; }
    if (!hasInner) inner.push(c);
  }
  // bir-biriga kirmaydigan, oxiridan boshiga qarab qo'llash
  let out = src;
  let lastStart = Infinity;
  for (let k = inner.length - 1; k >= 0; k--) {
    const c = inner[k];
    if (c.end > lastStart) continue;
    out = out.slice(0, c.start) + c.repl + out.slice(c.end);
    lastStart = c.start;
  }
  return { src: out, changed: inner.length };
}

/** JSX bola-konteynerlarini kanonlashtirish: {<>…</>} → …, {'Matn'} → Matn */
const unescapeStr = (s) => s.replace(/\\(['"\\])/g, '$1');
function passB(src) {
  const S = scan(src);
  const cands = [];
  for (const c of S.containers) {
    if (c.kind !== 'child' || c.close >= src.length) continue;
    let a = c.open + 1, b = c.close;
    while (a < b && isWs(src[a])) a++; while (b > a && isWs(src[b - 1])) b--;
    // qavs o'rami
    while (src[a] === '(' && S.pairs.get(a) === b - 1) { a++; b--; while (a < b && isWs(src[a])) a++; while (b > a && isWs(src[b - 1])) b--; }
    if (a >= b) continue;
    const body = src.slice(a, b);
    // fragment
    if (src[a] === '<' && S.elems.get(a) === b) {
      let inner = null;
      if (body.startsWith('<>') && body.endsWith('</>')) inner = body.slice(2, -3);
      else { const mm = /^<React\.Fragment\s*>([\s\S]*)<\/React\.Fragment\s*>$/.exec(body); if (mm) inner = mm[1]; }
      if (inner !== null) { cands.push({ start: c.open, end: c.close + 1, repl: inner }); continue; }
    }
    // satr-literal
    if ((src[a] === "'" || src[a] === '"') && src[b - 1] === src[a] && b - a >= 2) {
      const raw = body.slice(1, -1);
      if (/[{}<>&\n\r]/.test(raw)) continue;
      if (/\\(?!['"\\])/.test(raw)) continue;     // boshqa escape'lar — tegmaymiz
      const txt = unescapeStr(raw);
      if (!txt.trim()) continue;                  // faqat bo'shliq — JSX kesib tashlaydi
      // ichki satr-qo'shtirnoq bo'lishi ham mumkin (qo'shilgan matn to'g'ri tekshiriladi)
      const q = src[a]; const otherQ = q === "'" ? '"' : "'";
      if (raw.includes(otherQ) && !raw.includes('\\' + otherQ) && false) continue;
      cands.push({ start: c.open, end: c.close + 1, repl: txt });
    }
  }
  if (!cands.length) return { src, changed: 0 };
  cands.sort((x, y) => x.start - y.start);
  const inner = [];
  for (let k = 0; k < cands.length; k++) {
    const c = cands[k]; let hasInner = false;
    for (let j = k + 1; j < cands.length && cands[j].start < c.end; j++) { hasInner = true; break; }
    if (!hasInner) inner.push(c);
  }
  let out = src, lastStart = Infinity;
  for (let k = inner.length - 1; k >= 0; k--) { const c = inner[k]; if (c.end > lastStart) continue; out = out.slice(0, c.start) + c.repl + out.slice(c.end); lastStart = c.start; }
  return { src: out, changed: inner.length };
}

function passC(src, unwrapFns) {
  let s = src;
  s = s.replace(/^[ \t]*let __lang = ['"]uz['"];[^\n]*\n/m, '');
  s = s.replace(/^[ \t]*const tr = \(node\) => \{[\s\S]*?\n\};[^\n]*\n/m, '');
  s = s.replace(/^[ \t]*const tr = \(node\) =>[^\n]*\n/m, '');
  s = s.replace(/^[ \t]*__lang = lang;[^\n]*\n/mg, '');
  s = s.replace(/lang=\{__lang\}/g, 'lang="uz"');
  for (const f of unwrapFns) if (f !== 'tr') s = s.replace(new RegExp(`^[ \\t]*const ${f.replace(/\$/g, '\\$')} = [^\\n]*\\n`, 'm'), '');
  return s;
}

/** Izohlarni tashlash (esbuild ba'zi joylarda — masalan massiv ichida — izohni saqlab qoladi) */
function stripComments(src) {
  const S = scan(src); let out = ''; let k = 0;
  while (k < src.length) {
    if (S.mode[k] === M.CMT) { const s = k; while (k < src.length && S.mode[k] === M.CMT) k++; out += src.slice(s, k).replace(/[^\n]/g, ''); continue; }
    out += src[k]; k++;
  }
  return out;
}

export function normalize(src, { unwrapFns = ['tr'], maxPasses = 12 } = {}) {
  let s = src, stats = { a: 0, b: 0, passes: 0 };
  for (let p = 0; p < maxPasses; p++) { const r = passA(s, unwrapFns); s = r.src; stats.a += r.changed; stats.passes++; if (!r.changed) break; }
  for (let p = 0; p < maxPasses; p++) { const r = passB(s); s = r.src; stats.b += r.changed; if (!r.changed) break; }
  // B dan keyin yangi {uz:…} ochilib qolishi mumkin emas, lekin A ni bir marta qayta yuritamiz (ehtiyot)
  { const r = passA(s, unwrapFns); s = r.src; stats.a += r.changed; }
  s = passC(s, unwrapFns);
  s = stripComments(s);
  return { src: s, stats };
}

// ----------------------------------------------------------------------------
// 3. ESBUILD kanonik + sourcemap + qator-diff
// ----------------------------------------------------------------------------
async function canon(src, name) {
  const r = await esbuild.transform(src, {
    loader: 'jsx', jsx: 'automatic', format: 'esm', target: 'esnext',
    minifySyntax: true, minifyWhitespace: false, minifyIdentifiers: false,
    legalComments: 'none', sourcemap: 'external', sourcefile: name, charset: 'utf8',
  });
  return { code: r.code, map: JSON.parse(r.map) };
}

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
/** har chiqish-qatori uchun manba-qator (1-asosli) — segmentning birinchi mapping'i */
function lineMapFromSourcemap(map) {
  const out = []; let srcLine = 0;
  for (const group of map.mappings.split(';')) {
    let first = null;
    if (group) for (const seg of group.split(',')) {
      // VLQ decode (deltalar BARCHA segmentlar bo'ylab yig'iladi)
      const vals = []; let shift = 0, val = 0;
      for (const ch of seg) { const d = B64.indexOf(ch); val += (d & 31) << shift; if (d & 32) shift += 5; else { vals.push((val & 1) ? -(val >> 1) : (val >> 1)); shift = 0; val = 0; } }
      if (vals.length >= 3) { srcLine += vals[2]; if (first === null) first = srcLine + 1; }
    }
    out.push(first);
  }
  return out;
}

/** Myers diff (qatorlar) → o'zgarish-bloklari */
function lineDiff(a, b) {
  let p = 0; while (p < a.length && p < b.length && a[p] === b[p]) p++;
  let s = 0; while (s < a.length - p && s < b.length - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;
  const A = a.slice(p, a.length - s), Bm = b.slice(p, b.length - s);
  const N = A.length, Mx = Bm.length, max = N + Mx;
  if (max === 0) return [];
  if (N * Mx > 25e6) return [{ aStart: p, aEnd: a.length - s, bStart: p, bEnd: b.length - s, huge: true }];
  const v = new Map(); v.set(1, 0); const trace = [];
  let done = false;
  for (let d = 0; d <= max && !done; d++) {
    trace.push(new Map(v));
    for (let k = -d; k <= d; k += 2) {
      let x = (k === -d || (k !== d && (v.get(k - 1) ?? -1) < (v.get(k + 1) ?? -1))) ? (v.get(k + 1) ?? 0) : (v.get(k - 1) ?? 0) + 1;
      let y = x - k;
      while (x < N && y < Mx && A[x] === Bm[y]) { x++; y++; }
      v.set(k, x);
      if (x >= N && y >= Mx) { done = true; break; }
    }
  }
  // backtrack
  let x = N, y = Mx; const ops = [];
  for (let d = trace.length - 1; d >= 0; d--) {
    const vv = trace[d]; const k = x - y;
    const prevK = (k === -d || (k !== d && (vv.get(k - 1) ?? -1) < (vv.get(k + 1) ?? -1))) ? k + 1 : k - 1;
    const prevX = vv.get(prevK) ?? 0, prevY = prevX - prevK;
    while (x > prevX && y > prevY) { x--; y--; }
    if (d > 0) { if (x === prevX) ops.push(['+', y - 1]); else ops.push(['-', x - 1]); }
    x = prevX; y = prevY;
  }
  ops.reverse();
  // bloklarga yig'ish
  const hunks = []; let cur = null;
  let ai = 0, bi = 0;
  for (const [op, idx] of ops) {
    if (op === '-') { while (ai < idx) { ai++; bi++; cur = null; } if (!cur) { cur = { aStart: p + ai, aEnd: p + ai, bStart: p + bi, bEnd: p + bi }; hunks.push(cur); } cur.aEnd = p + ai + 1; ai++; }
    else { while (bi < idx) { ai++; bi++; cur = null; } if (!cur) { cur = { aStart: p + ai, aEnd: p + ai, bStart: p + bi, bEnd: p + bi }; hunks.push(cur); } cur.bEnd = p + bi + 1; bi++; }
  }
  return hunks;
}

function firstDiffIdx(a, b) { let k = 0; while (k < a.length && k < b.length && a[k] === b[k]) k++; return k; }
function clip(s, at, w = 120) { const a = Math.max(0, at - w), b = Math.min(s.length, at + w); return (a > 0 ? '…' : '') + s.slice(a, at) + `${RED}▮${R}` + s.slice(at, b) + (b < s.length ? '…' : ''); }

// ----------------------------------------------------------------------------
// 4. RU-QOLDIQ skaneri
// ----------------------------------------------------------------------------
export const UZ_COMMON = new Set(('va yoki uchun bilan emas qanday nima nimani nega qachon qayerda keyingi davom tekshirish tekshiring javob javobni javoblar savol savollar ' +
  "to'g'ri noto'g'ri dars darsni ekran ekranda bu shu ham endi mana siz sizning sizga biz bizning bir ikki uch to'rt besh har hamma barcha agar lekin chunki kerak mumkin " +
  "bo'ladi bo'lsa bo'lgan qiling bosing tanlang yozing oching ko'ring eting qilish boshlash boshlaymiz yakun natija ball ballar yana hali faqat juda katta kichik yangi eski " +
  "ishlaydi ishlamaydi qilamiz qildingiz qildim deb degan edi emasmi haqida orqali ichida tashqarida yuqorida pastda avval keyin hozir bugun kecha ertaga odam odamlar o'quvchi " +
  "sinf sinfdosh mentorga topshiriq vazifa uy tayyor tayyormisiz davom etish tekshirilmoqda yuklanmoqda kutilmoqda xato xatolar muammo yechim misol masalan ya'ni " +
  "so'z gap matn sahifa sayt tugma ro'yxat kadr yozuv ism ismingiz kod kodni kiriting qaytadan urinish topdingiz adashdingiz").split(/\s+/));
export const UZ_APOS = /[oOgG](?:'|ʻ|‘|’|`)/;
const latinWords = (t) => (t.match(/[A-Za-z\u02BB'‘’`][A-Za-z\u02BB'‘’`-]*/g) || []).filter(w => /[A-Za-z]{2,}/.test(w));
export function uzSignal(text) {
  const words = latinWords(text);
  if (words.length < 2 && !UZ_APOS.test(text)) return null;
  const hits = [];
  for (const w of words) { const lw = w.toLowerCase().replace(/[ʻ‘’`]/g, "'"); if (UZ_APOS.test(w) || UZ_COMMON.has(lw)) hits.push(w); }
  if (!hits.length) return null;
  if (words.length < 2 && !UZ_APOS.test(text)) return null;
  return hits;
}
const EXCLUDE_KEYS = new Set(['className', 'class', 'id', 'key', 'lessonId', 'storageKey', 'href', 'src', 'type', 'scope', 'template', 'kind', 'shot', 'k', 'mode', 'status', 'role', 'rel', 'target', 'style', 'color', 'background', 'fontFamily', 'font', 'ic', 'ico', 'icon', 'emoji', 'path', 'route', 'tag', 'cls', 'variant', 'size', 'name_key', 'data-id']);
const EXCLUDE_CALLS = /(?:console\.\w+|useAudio|new Error|Error|localStorage\.\w+|sessionStorage\.\w+|\.includes|\.test|\.startsWith|\.endsWith|\.indexOf|\.match|\.replace|\.split|new RegExp|RegExp|require|import|fetch|getItem|setItem|removeItem|querySelector|querySelectorAll|getElementById|addEventListener|removeEventListener|setProperty|liveRpc|liveList|earn|track|createContext)\s*$/;

export function residueScan(src) {
  const S = scan(src);
  // xavfsiz hududlar: `ru` kaliti bor ob'ekt-literallar
  const safe = [];
  for (const { open, close } of S.objects) {
    if (close >= src.length) continue;
    let hasRu = false;
    let segStart = open + 1;
    const check = (a, b) => { if (/^\s*(['"]?)ru\1\s*:/.test(src.slice(a, b))) hasRu = true; };
    for (const k of topLevel(S, open + 1, close)) if (S.mode[k] === M.CODE && src[k] === ',') { check(segStart, k); segStart = k + 1; }
    check(segStart, close);
    if (hasRu) safe.push([open, close]);
  }
  // ichki hujjat-ob'ektlar (ko'rinmaydi): SCREEN_INTENTS, *_INTENTS
  for (const mm of src.matchAll(/\b\w*INTENTS\s*=\s*\{/g)) { const open = mm.index + mm[0].length - 1; const close = S.pairs.get(open); if (close !== undefined) safe.push([open, close]); }
  safe.sort((x, y) => x[0] - y[0]);
  const inSafe = (idx) => { for (const [a, b] of safe) { if (a > idx) break; if (idx > a && idx < b) return true; } return false; };
  // qavs-ota xaritasi: satr uchun eng yaqin ochiq `(`
  const parenOpenBefore = (idx) => { let depth = 0; for (let k = idx - 1; k >= 0; k--) { if (S.mode[k] !== M.CODE) continue; const c = src[k]; if (c === ')' || c === ']' || c === '}') depth++; else if (c === '(' || c === '[' || c === '{') { if (depth === 0) return c === '(' ? k : -1; depth--; } } return -1; };
  const prevCode = (idx, len = 60) => { let out = ''; for (let k = idx - 1; k >= 0 && out.length < len; k--) { if (S.mode[k] === M.CODE || S.mode[k] === M.TAG) out = src[k] + out; } return out; };
  const nextCode = (idx, len = 6) => { let out = ''; for (let k = idx; k < src.length && out.length < len; k++) { if (S.mode[k] === M.CODE || S.mode[k] === M.TAG) out += src[k]; } return out; };

  const found = [];
  for (const t of S.texts) {
    if (inSafe(t.start)) continue;
    const txt = src.slice(t.start, t.end).replace(/\s+/g, ' ').trim();
    const hits = uzSignal(txt); if (!hits) continue;
    found.push({ line: lineOf(src, t.start), kind: 'jsx-matn', key: '', text: txt, hits });
  }
  for (const s of S.strings) {
    if (inSafe(s.start)) continue;
    const raw = src.slice(s.start + 1, s.end);
    if (raw.length < 3 || /^(https?:|#|\/|\.|mailto:)/.test(raw)) continue;
    const before = prevCode(s.start);
    const km = /([\w$-]+)\s*[:=]\s*$/.exec(before);
    const key = km ? km[1] : '';
    if (key && EXCLUDE_KEYS.has(key)) continue;
    if (/(===|!==|==|!=)\s*$/.test(before)) continue;
    const after = nextCode(s.end + 1);
    if (/^\s*(===|!==|==|!=|:)/.test(after) && !/^\s*:\s*[<'"`]/.test(after)) continue; // ob'ekt-kalit yoki taqqoslash
    const po = parenOpenBefore(s.start);
    if (po >= 0 && EXCLUDE_CALLS.test(prevCode(po, 40))) continue;
    if (/case\s*$/.test(before)) continue;
    const hits = uzSignal(raw); if (!hits) continue;
    found.push({ line: lineOf(src, s.start), kind: s.mode === M.ATTRSTR ? 'attr' : 'satr', key, text: raw, hits });
  }
  found.sort((x, y) => x.line - y.line);
  return found;
}

// ----------------------------------------------------------------------------
// 5. CLI
// ----------------------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const files = args.filter(a => !a.startsWith('--'));
  const opt = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }));
  if (files.length !== 2) { console.error('Ishlatish: node tools/ru-gate.mjs <baseline.jsx> <translated.jsx> [--unwrap=ou,ouz,uzOf] [--out=<papka>] [--quiet]'); process.exit(2); }
  const [bPath, tPath] = files.map(f => resolve(f));
  for (const f of [bPath, tPath]) if (!existsSync(f)) { console.error(`${RED}Fayl topilmadi:${R} ${f}`); process.exit(2); }
  const unwrapFns = ['tr', ...String(opt.unwrap || '').split(',').map(s => s.trim()).filter(Boolean)];
  const outDir = opt.out ? resolve(String(opt.out)) : null;

  const bSrc = readFileSync(bPath, 'utf8'), tSrc = readFileSync(tPath, 'utf8');
  const ruCount = (tSrc.match(/(?<![\w$])ru\s*:/g) || []).length;
  const bRuCount = (bSrc.match(/(?<![\w$])ru\s*:/g) || []).length;

  console.log(`${B}RU-GATE${R} · baseline: ${DIM}${bPath}${R}\n         translated: ${DIM}${tPath}${R}`);
  console.log(`         ru: maydonlar — baseline ${bRuCount} · translated ${B}${ruCount}${R} · unwrap: ${unwrapFns.join(', ')}`);

  const nb = normalize(bSrc, { unwrapFns }), nt = normalize(tSrc, { unwrapFns });
  console.log(`${DIM}normalize: baseline A=${nb.stats.a} B=${nb.stats.b} · translated A=${nt.stats.a} B=${nt.stats.b}${R}`);
  if (outDir) {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, basename(bPath, '.jsx') + '.base.norm.jsx'), nb.src);
    writeFileSync(join(outDir, basename(tPath, '.jsx') + '.tr.norm.jsx'), nt.src);
  }

  let cb, ct;
  try { cb = await canon(nb.src, 'baseline.jsx'); } catch (e) { console.log(`${RED}🔴 baseline normalize-natijasi esbuild'dan o'tmadi:${R} ${e.message.split('\n')[0]}`); dumpEsbuildError(e, nb.src, 'baseline'); process.exit(1); }
  try { ct = await canon(nt.src, 'translated.jsx'); } catch (e) { console.log(`${RED}🔴 translated normalize-natijasi esbuild'dan o'tmadi:${R} ${e.message.split('\n')[0]}`); dumpEsbuildError(e, nt.src, 'translated'); process.exit(1); }
  if (outDir) { writeFileSync(join(outDir, 'baseline.canon.js'), cb.code); writeFileSync(join(outDir, 'translated.canon.js'), ct.code); }

  let exitCode = 0;
  if (cb.code === ct.code) {
    console.log(`\n${GRN}${B}✓ UZ-REGRESSIYA TENG${R} — kanonik chiqish ${cb.code.length} belgi, bayt-aynan.`);
  } else {
    exitCode = 1;
    const aL = cb.code.split('\n'), bL = ct.code.split('\n');
    const aMap = lineMapFromSourcemap(cb.map), bMap = lineMapFromSourcemap(ct.map);
    const hunks = lineDiff(aL, bL);
    console.log(`\n${RED}${B}🔴 FARQ${R} — kanonik qatorlar: baseline ${aL.length} · translated ${bL.length} · farq-bloklari: ${B}${hunks.length}${R}`);
    const LIM = Number(opt.limit || 25);
    hunks.slice(0, LIM).forEach((h, i) => {
      const aLines = aL.slice(h.aStart, h.aEnd), bLines = bL.slice(h.bStart, h.bEnd);
      const aSrc = aMap[h.aStart] ?? aMap[Math.max(0, h.aStart - 1)], bSrc = bMap[h.bStart] ?? bMap[Math.max(0, h.bStart - 1)];
      console.log(`\n${YEL}— blok ${i + 1}${R}  baseline canon L${h.aStart + 1}${aSrc ? ` (norm-manba ~L${aSrc})` : ''} · translated canon L${h.bStart + 1}${bSrc ? ` (norm-manba ~L${bSrc})` : ''}`);
      if (h.huge) { console.log(`  ${DIM}(juda katta blok — diff hisoblanmadi)${R}`); return; }
      const a0 = aLines.join('\n'), b0 = bLines.join('\n');
      const at = firstDiffIdx(a0, b0);
      if (aLines.length) console.log(`  ${RED}- baseline  :${R} ${clip(a0, at).replace(/\n/g, '⏎')}`);
      else console.log(`  ${RED}- baseline  :${R} ${DIM}(yo'q)${R}`);
      if (bLines.length) console.log(`  ${GRN}+ translated:${R} ${clip(b0, at).replace(/\n/g, '⏎')}`);
      else console.log(`  ${GRN}+ translated:${R} ${DIM}(yo'q)${R}`);
    });
    if (hunks.length > LIM) console.log(`\n${DIM}… yana ${hunks.length - LIM} blok (--limit=N bilan ko'paytiring)${R}`);
    if (!outDir) console.log(`${DIM}Kanonik va normalize-fayllarni ko'rish uchun: --out=<papka>${R}`);
  }

  // Qoldiq-skaner
  const res = residueScan(tSrc);
  if (!opt.quiet) {
    console.log(`\n${YEL}⚠ qoldiq-nomzod (${res.length} ta)${R} — \`ru:\` maydonidan tashqarida qolgan o'zbekcha matn (ogohlantirish; tarjimon qo'lda ko'radi):`);
    const RL = Number(opt['residue-limit'] || 80);
    for (const f of res.slice(0, RL)) console.log(`  L${String(f.line).padStart(5)} ${DIM}${f.kind}${f.key ? ' ' + f.key + '=' : ''}${R} ${f.text.length > 110 ? f.text.slice(0, 110) + '…' : f.text}  ${DIM}[${[...new Set(f.hits)].slice(0, 4).join(', ')}]${R}`);
    if (res.length > RL) console.log(`  ${DIM}… yana ${res.length - RL} ta${R}`);
  }
  console.log(`\n${B}XULOSA:${R} ${exitCode ? RED + '🔴 FARQ' : GRN + '✓ TENG'}${R} · ru: ${ruCount} · qoldiq-nomzod ${res.length}`);
  process.exit(exitCode);
}

function dumpEsbuildError(e, src, label) {
  const err = e.errors?.[0]; if (!err?.location) return;
  const { line, column } = err.location; const lines = src.split('\n');
  console.log(`  ${label} norm L${line}:${column} → ${DIM}${(lines[line - 1] || '').slice(Math.max(0, column - 100), column + 100)}${R}`);
  console.log(`  ${DIM}(normalize-natijasini --out=<papka> bilan saqlab ko'ring)${R}`);
}

if (process.argv[1] && /ru-gate\.mjs$/.test(process.argv[1].replace(/\\/g, '/'))) main().catch(e => { console.error(e); process.exit(2); });
