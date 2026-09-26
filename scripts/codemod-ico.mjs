#!/usr/bin/env node
// ============================================================
//  codemod-ico — UI-bezak EMOJI qatlamini (`ico:` chip/karta/oqim belgilari) olib tashlaydi.
//  Foydalanuvchi 2026-09-26: «ha albatta emojini kamaytiramiz» (bridge F-0925-QA27/36/46/47 qarorining davomi).
//
//  O'lchov (26.09): etalonlarda `ico:` = 0 (BridgeKimUchun · PmLesson2 · Htmllesson1 · CiCdIntro), emoji ~170–220;
//  5–6-Modul texnik darslarida `ico:` qatlami ustiga qo'shilgan — emoji 300–570. Bu skript aynan shu qatlamni oladi.
//
//  QOLADI: `ic:` (RECAPS — etalonlarda ham bor) · olam-matni (Telegram xabarlari 🍕 🤖 👋) · tizim-UI (🏅 nishon,
//  🏆/🥇 podium, 🔥 streak, ⚡ jonli, 📊 mentor-panel, 📖/🗣️ recap, 📝 uy vazifasi, ✓ ✗ → ←).
//
//  Ishlatish:  node scripts/codemod-ico.mjs [--write] <fayl...>     (--write bo'lmasa — QURUQ yurish)
// ============================================================
import { readFileSync, writeFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const files = argv.filter(a => !a.startsWith('--'));
if (!files.length) { console.log('fayl kerak'); process.exit(1); }

const EMO = '(?:[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}\\u{2B50}\\u{2705}\\u{274C}]\\u{FE0F}?)';
const RULES = [
  // --- render joylari ---
  ['span -ico {x.ico}', new RegExp('<span className="[\\w-]*-ico"[^>]*>\\{(?:\\w+\\.)?(?:ico|sIco|aIco|tIco)\\}<\\/span>\\s?', 'gu'), ''],
  ['span -ico emoji', new RegExp('<span className="[\\w-]*-ico"[^>]*>' + EMO + '<\\/span>\\s?', 'gu'), ''],
  ['span style {x.ico}', /<span style=\{\{[^}]*\}\}>\{\w+\.ico\}<\/span>\s?/gu, ''],
  ['· {x.tIco}', /\{(\w+)\.tIco\}\s/gu, ''],
  ['`${x.ico} `', /\$\{(\w+)\.ico\}\s/gu, ''],
  ['{x.ico} inline', /\{[\w.()]+\.ico\}\s?/gu, ''],
  ['sw-node emoji<br/>', new RegExp('(className="sw-node"[^>]*>)' + EMO + '<br \\/>', 'gu'), '$1'],
  ['note-h emoji', new RegExp('(className="note-h"[^>]*>)' + EMO + ' ', 'gu'), '$1'],
  ['RcFlow item emoji', null, null], // satr-darajasida (pastda)
  // sarlavha-prefiksi: `title: { uz: '🔑 Kalit — …', ru: '🔑 …' }` → emoji olinadi (bridge QA36); `label:` tegilmaydi (Telegram tugmasi — olam)
  ['title/h emoji-prefiks', new RegExp('(\\b(?:title|h|hd|heading)\\s*:\\s*\\{\\s*uz:\\s*[\'"])' + EMO + '(?:' + EMO + ')? ?', 'gu'), '$1'],
  ['title/h ru emoji-prefiks', new RegExp('(\\b(?:title|h|hd|heading)\\s*:\\s*\\{\\s*uz:\\s*(?:[\'"])[^\'"]*[\'"]\\s*,\\s*ru:\\s*[\'"])' + EMO + '(?:' + EMO + ')? ?', 'gu'), '$1'],
  // --- ma'lumot maydonlari ---
  ['ico: field', /\s*\bico:\s*(['"])(?:(?!\1).)*\1,?/gu, ''],
  ['tIco: field', /\s*\btIco:\s*(['"])(?:(?!\1).)*\1,?/gu, ''],
  ['sIco/aIco prop', /\s*[sa]Ico=(['"])(?:(?!\1).)*\1/gu, ''],
];
const RCFLOW = new RegExp("((?:uz|ru):\\s*')" + EMO + ' ', 'gu');
const ICO_CSS = /\.[\w-]*-ico\s*\{[^}]*\}\s*/g;

let grand = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const lines = src.split('\n');
  const cnt = {}; const rep = [];
  const bump = (k, i) => { cnt[k] = (cnt[k] || 0) + 1; if ((cnt[k] || 0) <= 2) rep.push(`  :${i + 1} ${k}`); };
  for (let i = 0; i < lines.length; i++) {
    let L = lines[i];
    if (/^\s*\/\//.test(L) || /^\s*\/\*/.test(L)) continue;
    for (const [name, rx, to] of RULES) {
      if (!rx) continue;
      const b = L; L = L.replace(rx, to); if (L !== b) bump(name, i);
    }
    if (/<RcFlow\b/.test(L)) { const b = L; L = L.replace(RCFLOW, '$1'); if (L !== b) bump('RcFlow item emoji', i); }
    // ma'lumot maydoni olingach `{ id: 'x', label: … }` da ortiqcha bo'shliq yoki `,}` qolmasin
    L = L.replace(/,\s*\}/g, ' }').replace(/\{\s{2,}/g, '{ ');
    lines[i] = L;
  }
  // ishlatilmay qolgan .x-ico CSS qoidalari
  let out = lines.join('\n');
  const usedIco = new Set([...out.matchAll(/className=(?:"|\{`)[^"`]*?\b([\w-]*-ico)\b/g)].map(m => m[1]));
  out = out.replace(ICO_CSS, (m) => { const cls = /\.([\w-]*-ico)/.exec(m)[1]; if (usedIco.has(cls)) return m; cnt['CSS .-ico olindi'] = (cnt['CSS .-ico olindi'] || 0) + 1; return ''; });
  const total = Object.values(cnt).reduce((a, b) => a + b, 0); grand += total;
  const emoBefore = (src.match(new RegExp(EMO, 'gu')) || []).length, emoAfter = (out.match(new RegExp(EMO, 'gu')) || []).length;
  console.log(`\n${f}  → ${total} o'zgarish · emoji ${emoBefore} → ${emoAfter}${WRITE ? ' (YOZILDI)' : ' (quruq)'}`);
  for (const [k, v] of Object.entries(cnt)) console.log(`  ${k}: ${v}`);
  const left = [...out.matchAll(/\b(ico|tIco|sIco|aIco)\b/g)].length;
  if (left) console.log(`  ⚠ qolgan ico-ishoralar: ${left} — grep -n "ico" bilan qarang`);
  if (WRITE && total) writeFileSync(f, out);
}
console.log(`\njami: ${grand} · ${WRITE ? 'yozildi — endi: npm run gates -- <fayl> + lint:dizayn' : 'quruq yurish (--write bilan yoziladi)'}`);
