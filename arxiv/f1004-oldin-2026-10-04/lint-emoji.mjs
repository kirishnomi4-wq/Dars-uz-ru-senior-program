#!/usr/bin/env node
// ============================================================================
// LINT-EMOJI — 161-QONUN darvozasi: emoji belgi, ma'no emas (F-0929-18 · D1/D5, 2026-09-29).
// 165-qonun istisnosi (F-1002-70): `const KEYS_SCENE` — keys-sahna, emoji TURLARI sanaladi (≤4).
// Sanaydi: har blok (ekran-komponenti yoki global massiv) ichidagi `uz:` matndagi emojilar.
//   • blokda > LIMIT (4) emoji → error
//   • bir blokda bir xil emoji ≥ 2 → warn (161/2 — takror)
//   • test matnida (QuestionScreen options/explain/questionText, QUIZ_BANK) emoji → error (161/3)
// Tugma-belgilar emoji hisoblanmaydi (WHITELIST). `ru:` matn, CSS, izohlar sanalmaydi.
//
// Ishlatish:  node lint-emoji.mjs [src/... | fayl]      Chiqish kodi: error > 0 → 1
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';

const LIMIT = 4;
const WHITELIST = new Set(['▶', '▸', '◂', '◀', '✓', '✔', '✕', '✗', '×', '↻', '↺', '←', '→', '↑', '↓', '⏹', '✎', '•', '·', '—', '–', '↩', '⬆', '⬇', '➜']);
const EMOJI = /\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*/gu;

const args = process.argv.slice(2);
function listJsx(p) {
  const st = fs.statSync(p);
  if (st.isFile()) return p.endsWith('.jsx') ? [p] : [];
  return fs.readdirSync(p).flatMap(f => listJsx(path.join(p, f)));
}
const files = (args.length ? args : ['src']).flatMap(listJsx);

// `ru:` qiymatlari, CSS bloklari va izohlarni o'chirib, faqat uz-matn qoldiradi (taxminiy, blok darajasida yetarli)
function uzOnly(s) {
  return s
    .replace(/<style>\{`[\s\S]*?`\}<\/style>/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/ru\s*:\s*<>[\s\S]*?<\/>/g, '')
    .replace(/ru\s*:\s*(["'`])(?:\\.|(?!\1)[^\\])*\1/g, '');
}
function emojis(s) { return (s.match(EMOJI) || []).map(e => e.replace(/️/g, '')).filter(e => !WHITELIST.has(e)); }

const report = [];
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  // bloklar: `// ===== …` yoki ustun-0 `const X = ` qatorlari orasidagi qismlar
  const idx = [...src.matchAll(/^(\/\/ =====.*|const [A-Za-z_0-9]+\s*=.*)$/gm)].map(m => ({ at: m.index, name: m[1].slice(0, 60).trim() }));
  const blocks = idx.map((b, i) => ({ ...b, text: src.slice(b.at, i + 1 < idx.length ? idx[i + 1].at : src.length) }));
  // O'yin qatlami / umumiy shablon (161/6 istisno, KATTA F-0929-21): arena, podium, bayram, nishon, recap-oyna karkasi
  const EXEMPT = /quizScore|Podium|Arena|CodeStrike|AchCelebrate|ACHIEVEMENT|Badge|RecapOverlay|LiveGate|MentorTestStats|MentorPractice|Flashcards\b|const Col\b|const Stage\b|const Nav/i;
  const evalBlock = (name, text, at) => {
    const em = emojis(uzOnly(text));
    if (!em.length) return;
    const line = src.slice(0, at).split('\n').length;
    if (em.length > LIMIT) report.push({ sev: 'error', file, line, msg: `${em.length} emoji (limit ${LIMIT}) — ${name}`, em });
    const counts = {}; for (const e of em) counts[e] = (counts[e] || 0) + 1;
    const dup = Object.entries(counts).filter(([, n]) => n >= 2).map(([e, n]) => `${e}×${n}`);
    if (dup.length) report.push({ sev: 'warn', file, line, msg: `takror emoji: ${dup.join(' ')} — ${name}`, em: [] });
  };
  for (const b of blocks) {
    if (EXEMPT.test(b.name)) continue;
    // 165-qonun (F-1002-70, 02.10): keys-sahna — emoji illustratsiya, matn emas. Bir xil uy/universitet takrorlanadi
    // (sahna elementlari), shuning uchun TURLAR sanaladi: ≤ LIMIT tur. Matn-kartaga emoji qaytmaydi (161/3 o'z joyida).
    if (/^const KEYS_SCENE\b/.test(b.name)) {
      const types = [...new Set(emojis(uzOnly(b.text)))];
      if (types.length > LIMIT) report.push({ sev: 'error', file, line: src.slice(0, b.at).split('\n').length, msg: `keys-sahnada ${types.length} tur emoji (limit ${LIMIT})`, em: types });
      continue;
    }
    // RECAPS — har oyna alohida ko'rsatiladi: top-level `N: {…}` yozuvlari bo'yicha sanaladi
    if (/^const RECAPS\b/.test(b.name)) {
      // faqat RECAPS obyektining o'zi (mos `}` gacha) — undan keyingi shablon-kod (RecapOverlay) sanalmaydi
      // JSX matnidagi apostrof (ko'p, ma'lumot) qavs-sanashni buzadi — shuning uchun obyekt oxiri ustun-0 `};` bilan topiladi
      const o = b.text.indexOf('{'), eIdx = b.text.indexOf('\n};', o);
      const obj = b.text.slice(o, eIdx > 0 ? eIdx + 2 : undefined);
      const ents = [...obj.matchAll(/^\s{2}(\d+)\s*:\s*\{/gm)];
      ents.forEach((m, i) => {
        const endI = i + 1 < ents.length ? ents[i + 1].index : obj.length;
        evalBlock(`RECAPS[${m[1]}]`, obj.slice(m.index, endI), b.at + o + m.index);
      });
      continue;
    }
    // Kartochkalar (161/3): har qanday emoji — error
    if (/FLASHCARDS?\b/.test(b.name)) {
      const em = emojis(uzOnly(b.text));
      if (em.length) report.push({ sev: 'error', file, line: src.slice(0, b.at).split('\n').length, msg: `kartochkalarda emoji: ${[...new Set(em)].join(' ')}`, em: [] });
      continue;
    }
    evalBlock(b.name, b.text, b.at);
  }
  // test matnida emoji
  for (const m of src.matchAll(/<QuestionScreen\b[\s\S]*?\/>/g)) {
    const em = emojis(uzOnly(m[0]));
    if (em.length) report.push({ sev: 'error', file, line: src.slice(0, m.index).split('\n').length, msg: `test matnida emoji: ${em.join(' ')}`, em: [] });
  }
  const qb = src.indexOf('const QUIZ_BANK');
  if (qb >= 0) {
    const end = src.indexOf('\n];', qb);
    const em = emojis(uzOnly(src.slice(qb, end > 0 ? end : undefined)));
    if (em.length) report.push({ sev: 'error', file, line: src.slice(0, qb).split('\n').length, msg: `QUIZ_BANK ichida emoji: ${[...new Set(em)].join(' ')}`, em: [] });
  }
}

const errs = report.filter(r => r.sev === 'error').length;
for (const r of report) console.log(`${r.sev === 'error' ? '❌' : '⚠️ '} ${r.file}:${r.line} ${r.msg}${r.em.length ? '  ' + r.em.join('') : ''}`);
console.log(`\nlint-emoji: ${files.length} fayl · ${errs} error · ${report.length - errs} warn · limit ${LIMIT}/blok`);
process.exit(errs > 0 ? 1 : 0);
