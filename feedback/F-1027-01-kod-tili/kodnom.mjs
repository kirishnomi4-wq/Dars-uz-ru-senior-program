// F-1027-01 «kodnom» — o'quvchiga ko'rinadigan kodda o'zbekcha nomlar: topish va almashtirish.
//   node feedback/F-1027-01-kod-tili/kodnom.mjs scan  [fayl.jsx …] [--json]   → nomzodlar + manba-qator
//   node feedback/F-1027-01-kod-tili/kodnom.mjs decl                            → e'lon/sxema nomlari (lug'at uchun)
//   node feedback/F-1027-01-kod-tili/kodnom.mjs apply --map lugat.json fayl.jsx … [--dry]
// Usul: esbuild (JSX→JS) + manba-xarita → har satr-literalning ASL fayldagi joyi.
// Kontekstlar: (a) satrdagi kod-qator; (b) satr ichidagi `inline kod`; (c) mono/code/kod klassli JSX element, <code>/<pre>.
// Tegilmaydi: kod ichidagi satr/izoh/JSX-matn, template ichidagi ochiq ${…} (dars o'zgaruvchisi), <style>, HW_V2 (paketdan).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
const { transformSync } = createRequire(process.cwd() + '/package.json')('esbuild');
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function decodeMap(m) {
  const lines = []; let sL = 0, sC = 0, sI = 0;
  for (const line of m.split(';')) { const segs = []; let gC = 0;
    for (const seg of line.split(',')) { if (!seg) continue; const v = []; let sh = 0, val = 0;
      for (const ch of seg) { let d = B64.indexOf(ch); const cont = d & 32; d &= 31; val += d << sh; if (cont) sh += 5; else { v.push(val & 1 ? -(val >> 1) : val >> 1); val = 0; sh = 0; } }
      gC += v[0]; if (v.length >= 4) { sI += v[1]; sL += v[2]; sC += v[3]; segs.push([gC, sL, sC]); } }
    lines.push(segs); }
  return lines;
}
const dict = new Set(readFileSync('/usr/share/dict/american-english', 'utf8').split('\n').map(w => w.toLowerCase().replace(/'s$/, '')));
const TECH = new Set(readFileSync(new URL('./tech-sozlar.txt', import.meta.url), 'utf8').split(/\s+/).filter(Boolean));
const words = (id) => id.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2').replace(/[_$-]+/g, ' ').toLowerCase().split(/\s+/).filter(Boolean);
const okW = (w) => w.length < 3 || /\d/.test(w) || dict.has(w) || dict.has(w.replace(/e?s$/, '')) || dict.has(w.replace(/(ed|ing|er|ly)$/, '')) || dict.has(w.replace(/(ed|ing|er)$/, 'e')) || dict.has(w.replace(/ies$/, 'y')) || TECH.has(w);
export const isBad = (id) => words(id).some(w => !okW(w));
const JSLIKE = /\bfunction\b|=>|\b(?:const|let|var)\s+[A-Za-z_$]|console\.log|\breturn\s|\bdef\s+\w|\bimport\s+\w|\bexport\s+(?:default|const|function)|\.addEventListener|document\.|\b(?:SELECT|INSERT INTO|UPDATE|DELETE FROM|CREATE TABLE|ALTER TABLE)\b|\bprocess\.env\.|^\s*[A-Z][A-Z0-9_]+=\S/m;
const HTMLLIKE = /<[a-z][\w-]*\b[^>]*\b(?:class|id)\s*=\s*["']/;
const KW = new Set('const let var function return if else for while switch case new await async import export from class extends typeof of in as default try catch throw SELECT FROM WHERE INSERT INTO UPDATE SET VALUES DELETE CREATE TABLE ALTER JOIN ON AND OR NOT NULL ORDER BY GROUP LIMIT DESC ASC COUNT DISTINCT RETURNING AS IS def print'.split(' '));
const proseLine = (l) => { // backtick/qo'shtirnoqdan tashqarida ketma-ket o'zbekcha so'zlar juftligi ≥ 2 → nasr
  const t = l.replace(/`[^`]*`/g, ' # ').replace(/(^|[^A-Za-z])(["'])(?:(?!\2).)*\2/g, '$1 # ');
  let pairs = 0; const toks = t.split(/(\s+)/);
  for (let k = 0; k + 2 < toks.length; k += 2) { const a = toks[k], b = toks[k + 2]; if (/^[A-Za-z\u02BB\u2019']{2,}[,.:;!?—]?$/.test(a) && /^[A-Za-z\u02BB\u2019']{2,}[,.:;!?—]?$/.test(b) && toks[k + 1] === ' ') { const A = a.replace(/[,.:;!?—]$/, ''), B = b.replace(/[,.:;!?—]$/, ''); if (!KW.has(A) && !KW.has(B) && (isBad(A) || /['\u2019\u02BB]/.test(A)) && (isBad(B) || /['\u2019\u02BB]/.test(B))) pairs++; } }
  return pairs >= 2;
};
const isCodeLine = (l) => /[;{}=]|\w\(|^\s*<\/?\w|\b(?:SELECT|FROM|WHERE|INSERT|UPDATE|SET|VALUES|JOIN|ORDER BY)\b/.test(l) && !proseLine(l);
function codeTokens(line, inTpl) {
  const out = []; let i = 0; const n = line.length;
  while (i < n) { const c = line[i];
    if (inTpl && c === '$' && line[i + 1] === '{' && line[i - 1] !== '\\') { let d = 1, j = i + 2; while (j < n && d) { if (line[j] === '{') d++; else if (line[j] === '}') d--; j++; } i = j; continue; }
    if (c === '/' && line[i + 1] === '/') break;
    if (c === '-' && line[i + 1] === '-' && /\b(?:SELECT|FROM|WHERE|INSERT|UPDATE|CREATE|ALTER)\b/i.test(line)) break;
    if (c === '/' && line[i + 1] === '*') { const e = line.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
    if (c === '"' || c === "'" || c === '`') { let j = i + 1; while (j < n && line[j] !== c) { if (line[j] === '\\') j++; j++; } i = j + 1; continue; }
    if (c === '>') { const e = line.indexOf('<', i + 1); const seg = e < 0 ? '' : line.slice(i + 1, e); if (e > 0 && !/[{};=()]/.test(seg)) { i = e; continue; } i++; continue; }
    if (/[A-Za-z_$]/.test(c)) { const s = i; while (i < n && /[\w$]/.test(line[i])) i++; out.push([s, i]); continue; }
    i++; }
  return out;
}
const classAttrSpans = (line) => { const out = []; for (const m of line.matchAll(/\b(?:class|className|id)\s*=\s*(\\?["'])([\w -]+)\1/g)) { let p = m.index + m[0].indexOf(m[2]); for (const w of m[2].split(/(\s+)/)) { if (w.trim()) out.push([p, p + w.length]); p += w.length; } } return out; };
function sourceStrings(src) {
  const r = transformSync(src, { loader: 'jsx', jsx: 'transform', legalComments: 'none', sourcemap: 'external', sourcefile: 'x.jsx' });
  const js = r.code; const map = decodeMap(JSON.parse(r.map).mappings);
  const lineStart = [0]; for (let k = 0; k < src.length; k++) if (src[k] === '\n') lineStart.push(k + 1);
  const res = []; let gl = 0, gc = 0, i = 0; const n = js.length; let prev = '';
  const posOf = () => { for (const s of (map[gl] || [])) if (s[0] === gc) return lineStart[s[1]] + s[2]; return -1; };
  const adv = (to) => { while (i < to) { if (js[i] === '\n') { gl++; gc = 0; } else gc++; i++; } };
  while (i < n) { const c = js[i];
    if (c === '/' && js[i + 1] === '*') { const e = js.indexOf('*/', i + 2); adv(e < 0 ? n : e + 2); continue; }
    if (c === '/' && js[i + 1] === '/') { const e = js.indexOf('\n', i); adv(e < 0 ? n : e); continue; }
    if (c === '`' || c === '"' || c === "'") {
      const sp = posOf(); const before = js.slice(Math.max(0, i - 40), i);
      if (sp >= 0 && (src[sp] === '`' || src[sp] === '"' || src[sp] === "'")) {
        const q = src[sp]; let j = sp + 1, depth = 0;
        while (j < src.length) { const ch = src[j]; if (ch === '\\') { j += 2; continue; } if (q === '`' && ch === '$' && src[j + 1] === '{') { depth++; j += 2; continue; } if (depth && ch === '}') { depth--; j++; continue; } if (!depth && ch === q) break; if (q !== '`' && ch === '\n') break; j++; }
        res.push({ s: sp + 1, e: j, q, style: /createElement\("style",\s*null,\s*$/.test(before) || /<style>\{\s*$/.test(src.slice(Math.max(0, sp - 20), sp)) });
      }
      let j = i + 1, d = 0; while (j < n) { const ch = js[j]; if (ch === '\\') { j += 2; continue; } if (c === '`' && ch === '$' && js[j + 1] === '{') { d++; j += 2; continue; } if (d && ch === '}') { d--; j++; continue; } if (!d && ch === c) break; j++; }
      adv(j + 1); prev = 's'; continue; }
    if (c === '/' && /[(,=:[!&|?{};+\-*%<>~^]|^$|return$/.test(prev)) { let j = i + 1, cls = false; while (j < n) { const ch = js[j]; if (ch === '\\') { j += 2; continue; } if (ch === '[') cls = true; else if (ch === ']') cls = false; else if (ch === '/' && !cls) break; else if (ch === '\n') break; j++; } j++; while (/[a-z]/.test(js[j] || '')) j++; adv(j); prev = 'r'; continue; }
    if (/\s/.test(c)) { adv(i + 1); continue; }
    if (/[A-Za-z0-9_$]/.test(c)) { let j = i; while (j < n && /[\w$]/.test(js[j])) j++; prev = js.slice(i, j); adv(j); continue; }
    prev = c; adv(i + 1); }
  const seen = new Set(); return res.filter(x => { const k = x.s + ':' + x.e; if (seen.has(k)) return false; seen.add(k); return true; });
}
const CODECLS = /className="[^"]*\b(?:mono|code|kod|codebox|code-box|ai-code|vsc-code|editor-code|dbg-code|codepill|qcode)\b[^"]*"/;
export function codeSpots(src, filter) {
  const spots = [];
  const lineAt = (abs) => { const a = src.lastIndexOf('\n', abs - 1) + 1; const b = src.indexOf('\n', abs); return src.slice(a, b < 0 ? src.length : b); };
  const simpleTok = (txt, off, inTpl) => {
    let mask = txt; if (inTpl) mask = txt.replace(/(^|[^\\])\$\{[^}]*\}/g, (m0, p1) => p1 + ' '.repeat(m0.length - p1.length));
    { let out = '', q = null; for (let k = 0; k < mask.length; k++) { const ch = mask[k]; const isQ = (ch === '"' || ch === "'") && !(/[A-Za-z]/.test(mask[k - 1] || '') && /[A-Za-z]/.test(mask[k + 1] || '')); if (q) { out += ' '; if (ch === q && isQ) q = null; } else if (isQ) { q = ch; out += ' '; } else out += ch; } mask = out; }
    for (const m of mask.matchAll(/[A-Za-z_$][\w$]*/g)) { const a = m.index; if (a > 0 && /['’ʻ]/.test(txt[a - 1]) && /[A-Za-z]/.test(txt[a - 2] || '')) continue; spots.push({ abs: off + a, end: off + a + m[0].length, name: m[0], line: txt, ctx: 'inline' }); }
  };
  for (const m of src.matchAll(/<(\w+)((?:\s+[\w-]+(?:=(?:"[^"]*"|\{[^{}]*\}))?)*)\s*>([^<>{}]+)</g)) {
    const tag = m[1], attrs = m[2] || '';
    if (!(/^(?:code|pre|kbd)$/.test(tag) || CODECLS.test(attrs))) continue;
    simpleTok(m[3], m.index + m[0].length - 1 - m[3].length, false);
  }
  for (const L of sourceStrings(src)) {
    if (L.style || L.e - L.s > 8000) continue;
    if (/^\s*(?:export\s+)?const HW_V2\b/.test(lineAt(L.s))) continue;
    const body = src.slice(L.s, L.e); const inTpl = L.q === '`';
    const re = inTpl ? /\\`([^`\\]{1,200})\\`/g : /`([^`]{1,200})`/g;
    for (const m of body.matchAll(re)) simpleTok(m[1], L.s + m.index + m[0].indexOf(m[1]), inTpl);
    const js = JSLIKE.test(body), html = HTMLLIKE.test(body);
    let off = L.s;
    for (const line of body.split('\n')) {
      const spans = [];
      if (js && isCodeLine(line)) spans.push(...codeTokens(line, inTpl), ...classAttrSpans(line));
      else if (html) spans.push(...classAttrSpans(line));
      else if (!js && !html && filter) for (const [a, b] of codeTokens(line, inTpl)) { const nm = line.slice(a, b); if (filter.has(nm) && (/^\s*[(.]/.test(line.slice(b)) || line[a - 1] === '.')) spans.push([a, b]); }
      for (const [a, b] of spans) spots.push({ abs: off + a, end: off + b, name: line.slice(a, b), line, ctx: 'code' });
      off += line.length + 1; }
  }
  const seen = new Set(); return spots.filter(x => { if (seen.has(x.abs)) return false; seen.add(x.abs); return true; });
}
export const lessonFiles = () => { const app = readFileSync('src/App.jsx', 'utf8'); const imp = {}; for (const m of app.matchAll(/const (\w+) = L\(\(\) => import\('([^']+)'\)\)/g)) imp[m[1]] = resolve('src', m[2]); return [...new Set([...app.matchAll(/comp: (\w+)/g)].map(m => imp[m[1]]).filter(f => f && existsSync(f)))].map(f => f.replace(process.cwd() + '/', '')); };
const lineNo = (src, abs) => src.slice(0, abs).split('\n').length;
const [mode, ...rest] = process.argv[1] && process.argv[1].endsWith("kodnom.mjs") ? process.argv.slice(2) : [];
if (mode === 'scan') {
  let files = rest.filter(a => a.endsWith('.jsx')); if (!files.length) files = lessonFiles();
  const all = {}; let nf = 0;
  for (const f of files) { const src = readFileSync(f, 'utf8'); const hits = {};
    for (const sp of codeSpots(src)) if (isBad(sp.name)) (hits[sp.name] ||= []).push(lineNo(src, sp.abs));
    if (Object.keys(hits).length) { nf++; all[f] = hits; } }
  if (rest.includes('--json')) console.log(JSON.stringify(all, null, 1));
  else { for (const [f, h] of Object.entries(all)) console.log(f + ' · ' + Object.entries(h).map(([k, v]) => k + ':' + [...new Set(v)].join(',')).join(' ')); console.log('\nJAMI ' + files.length + ' dars · ' + nf + ' darsda nomzod'); }
} else if (mode === 'decl') {
  const agg = {};
  const put = (nm, kind, f, ln, line) => { if (!nm || !isBad(nm)) return; const o = (agg[nm] ||= { kinds: new Set(), files: new Set(), ex: [] }); o.kinds.add(kind); o.files.add(f.replace(/^src\//, '')); if (o.ex.length < 2) o.ex.push(f.replace(/^src\//, '') + ':' + ln + '  ' + line.trim().slice(0, 140)); };
  for (const f of lessonFiles()) { const src = readFileSync(f, 'utf8');
    for (const sp of codeSpots(src)) { if (sp.ctx === 'inline') continue; const L = sp.line; const k = sp.abs - (src.lastIndexOf('\n', sp.abs - 1) + 1);
      const ls = src.slice(src.lastIndexOf('\n', sp.abs - 1) + 1); const pre = ls.slice(0, k), rst = ls.slice(k + sp.name.length).split('\n')[0]; const nm = sp.name;
      let kind = null;
      if (/\b(?:function|const|let|var|class)\s+$/.test(pre)) kind = 'decl';
      else if (/(?:FROM|INTO|UPDATE|TABLE|JOIN|REFERENCES)\s+$/i.test(pre)) kind = 'table';
      else if (/^[A-Z][A-Z0-9_]+$/.test(nm) && (/^\s*=/.test(rst) || /process\.env\.$/.test(pre))) kind = 'env';
      else if (/(?:class|className|id)\s*=\s*\\?["'][\w -]*$/.test(pre)) kind = 'classid';
      else if (/^\s*$/.test(pre.replace(/^.*[`"']/, '')) && /^\s+(?:SERIAL|INT|INTEGER|TEXT|VARCHAR|BOOLEAN|TIMESTAMP|TIMESTAMPTZ|DATE|NUMERIC|BIGINT|UUID|JSONB)\b/i.test(rst)) kind = 'column';
      else if (/\b(?:SELECT|WHERE|SET|AND|OR|ORDER BY|GROUP BY|ON|RETURNING)\b[^;]*$/i.test(pre) && /^[\s,=<>!)]|^$/.test(rst)) kind = 'column';
      else if (/^\s*:/.test(rst) && !/\?\s*$/.test(pre)) kind = 'key';
      else if (/\.\s*$/.test(pre)) kind = 'prop';
      else if (/[(,]\s*$/.test(pre) && /^\s*[,)=]/.test(rst) && /=>|function/.test(L)) kind = 'param';
      else if (/^\s*\(/.test(rst)) kind = 'call';
      else if (/<\/?\s*$/.test(pre)) kind = 'jsx';
      if (kind) put(nm, kind, f, lineNo(src, sp.abs), ls.split('\n')[0]);
    } }
  const arr = Object.entries(agg).sort((a, b) => b[1].files.size - a[1].files.size);
  for (const [k, o] of arr) console.log(k + '\t' + [...o.kinds].join(',') + '\t' + o.files.size + '\t' + o.ex.join('  ||  '));
  console.error('JAMI ' + arr.length + ' nom');
} else if (mode === 'apply') {
  const mi = rest.indexOf('--map'); const map = JSON.parse(readFileSync(rest[mi + 1], 'utf8')); const dry = rest.includes('--dry');
  const files = rest.filter((a, k) => a.endsWith('.jsx') && k !== mi + 1);
  for (const f of files) { let src = readFileSync(f, 'utf8'); const keys = new Set(Object.keys(map));
    const spots = codeSpots(src, keys).filter(s => keys.has(s.name)).sort((a, b) => b.abs - a.abs);
    for (const s of spots) src = src.slice(0, s.abs) + map[s.name] + src.slice(s.end);
    const by = {}; for (const s of spots) by[s.name] = (by[s.name] || 0) + 1;
    console.log((dry ? '[dry] ' : '') + f + ': ' + spots.length + ' joy · ' + Object.entries(by).map(([k, v]) => k + '→' + map[k] + '×' + v).join(' '));
    if (!dry) writeFileSync(f, src); }
} else console.log('scan | decl | apply');
