#!/usr/bin/env node
// RU-TM — tarjima-xotira: tarjima qilingan darslardan (base→translated) qator-blok
// juftliklarini yig'adi va yangi faylda AYNAN mos UZ bloklarini tarjimasi bilan almashtiradi.
// Juftlik FAQAT UZ-shohi o'zgarmagan bo'lsa qabul qilinadi (normalize(yangi) === eski) —
// aks holda donor darsning kod/CSS/kontent o'zgarishi ham ko'chib qolardi.
//   node ru-tm.mjs <target.jsx> <out.jsx> <base1> <tr1> [<base2> <tr2> ...]
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { normalize } from 'file:///C:/Users/ADMIN/internetLesson/tools/ru-gate.mjs';

const [target, out, ...pairs] = process.argv.slice(2);
const rd = (p) => readFileSync(p, 'utf8').split(/\r?\n/);
const NL = String.fromCharCode(10);
const flat = (s) => s.replace(/<\/?>/g, '').replace(/[{}'"`]/g, '').replace(/\s+/g, ' ').trim();
const uzSafe = (old, neu) => {
  try { return flat(normalize(neu.join(NL)).src) === flat(old.join(NL)); } catch { return false; }
};

const memory = new Map();
let seen = 0, kept = 0;
for (let i = 0; i < pairs.length; i += 2) {
  let diff = '';
  try { execFileSync('git', ['diff', '--no-index', '-U0', '--no-color', pairs[i], pairs[i + 1]], { encoding: 'utf8' }); }
  catch (e) { diff = e.stdout || ''; }
  let old = [], neu = [], inHunk = false;
  const flush = () => {
    if (inHunk && old.length && neu.length) {
      seen++;
      const k = JSON.stringify(old);
      if (!memory.has(k) && uzSafe(old, neu)) { memory.set(k, neu); kept++; }
      // hunk ichida qator-ma-qator moslash: har nomzod juftlik alohida uzSafe dan o'tadi,
      // shuning uchun noto'g'ri tekislanish (donor kodini olib kelish) o'z-o'zidan tushib qoladi
      const used = new Set();
      for (let a = 0; a < old.length; a++) {
        const k1 = JSON.stringify([old[a]]);
        if (memory.has(k1)) continue;
        for (let b = 0; b < neu.length; b++) {
          if (used.has(b) || old[a] === neu[b]) continue;
          if (uzSafe([old[a]], [neu[b]])) { memory.set(k1, [neu[b]]); used.add(b); break; }
        }
      }
    }
    old = []; neu = [];
  };
  for (const l of diff.split(/\r?\n/)) {
    if (l.startsWith('@@')) { flush(); inHunk = true; continue; }
    if (!inHunk) continue;
    if (l.startsWith('-') && !l.startsWith('---')) old.push(l.slice(1));
    else if (l.startsWith('+') && !l.startsWith('+++')) neu.push(l.slice(1));
    else if (l.startsWith('diff ') || l.startsWith('index ')) { flush(); inHunk = false; }
  }
  flush();
}

const byFirst = new Map();
for (const [k, neu] of memory) {
  const old = JSON.parse(k);
  if (!byFirst.has(old[0])) byFirst.set(old[0], []);
  byFirst.get(old[0]).push({ old, neu });
}
for (const arr of byFirst.values()) arr.sort((a, b) => b.old.length - a.old.length);

const src = rd(target);
const res = [];
let hits = 0, hitLines = 0;
for (let i = 0; i < src.length;) {
  const cand = byFirst.get(src[i]);
  let done = false;
  if (cand) for (const { old, neu } of cand) {
    if (old.every((l, j) => src[i + j] === l)) { res.push(...neu); i += old.length; hits++; hitLines += old.length; done = true; break; }
  }
  if (!done) { res.push(src[i]); i++; }
}
writeFileSync(out, res.join('\r\n'));
console.error(`TM: ${kept}/${seen} juftlik qabul · ${hits} moslik · ${hitLines}/${src.length} qator almashtirildi`);
