#!/usr/bin/env node
// ============================================================
//  lint-dizayn — bridge-tozalik qoidalarining GREP-lanadigan qismi (PILOT_DIZAYN_NAQSH 8-bo'lim, 2026-09-26).
//  Agentga emas, skriptga: bir xil tekshiruvni 25 faylda agent qilsa — har fayl 30–60M kontekst (memory
//  `subagent-token-sarfi`); grep — 0.
//
//  Ishlatish:  node lint-dizayn.mjs <fayl...>        npm run lint:dizayn -- src/5-Modull/*.jsx
//  Chiqish kodi 1 — 🔴 error bo'lsa.  🟡 warn — ko'z bilan qaraladigan joy (file:line), ⚪ info — o'lchov.
//
//  Qoidalar (band raqami — PILOT_DIZAYN_NAQSH.md 8-bo'lim):
//   D1 🔴 51-band  chap rang-chiziq: border-left: 3–6px solid · border-left-color · box-shadow inset 2–6px 0 0
//   D2 🔴 46-band  kesik (siniq) bezak-chiziq: repeating-linear-gradient
//   D3 🟡 47-band  karta/slayd tepasidagi rang-chiziq: ::before/::after + height 3–6px + gradient/rang
//   D4 🟡 48/52/54 qisqa savol-yorliq maydon tepasida (≤40 belgi, «?» bilan) + 3 qator ichida <input|<textarea
//   D5 🟡 53-band  karta ichida «bosing» (mentor-gap/tugma/aria dan tashqarida)
//   D6 🟡 56-band  yorliq-qatorli yo'riq: «👆», «Avval … tanlang, so'ng …» (yo'riq mentor-gapda bo'lishi kerak)
//   D7 ⚪          emoji soni (JSX matnida; izoh-satrlari chiqarib tashlangan) — faqat o'lchov, chegara yo'q
// ============================================================
import { readFileSync } from 'node:fs';

const files = process.argv.slice(2);
if (!files.length) { console.log('fayl kerak: node lint-dizayn.mjs <fayl...>'); process.exit(1); }

const R = {
  stripe: /border-left:\s*[3-6]px\s+solid|border-left-color\s*:|box-shadow:\s*inset\s+[2-6]px\s+0\s+0|borderLeft:\s*['"`][3-6]px/,
  kesik: /repeating-linear-gradient/,
  topline: /::(before|after)\s*\{[^}]*height:\s*[3-6]px[^}]*(gradient|background:\s*(\$\{|#|rgb))/,
  label: /<(label|p|span|div)[^>]*>\s*([^<{]{2,40}\?)\s*<\/(label|p|span|div)>/,
  input: /<(input|textarea)\b/,
  bosing: /\bbosing\b/i,
  bosingOk: /mentor|Mentor|MENTOR|<button|btn|aria-|title=|nav-|\/\/|hint/,
  yoriq: /👆|Avval [^<]{3,40}tanlang, so'ng|so‘ng maydonni bosing/,
  emoji: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,
};

let totalErr = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const lines = src.split('\n');
  const out = []; let err = 0, warn = 0;
  const hit = (lvl, code, i, msg) => { out.push(`  ${lvl} ${code} :${i + 1}  ${msg}`); if (lvl === '🔴') err++; else if (lvl === '🟡') warn++; };
  let emoji = 0;
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    // 04.10 (modul:yopish): CSS uchburchak (strelka uchi) — border'lardan biri `transparent` — chiziq emas
    if (R.stripe.test(L) && !/border-(?:left|right|top|bottom):\s*\d+px\s+solid\s+transparent/.test(L)) hit('🔴', 'D1 stripe  ', i, L.trim().slice(0, 110));
    // `kesik-ok` izohi — chiziq ma'no tashiydi (daftar qatori, elak to'ri), bezak emas; sabab izohda yoziladi
    if (R.kesik.test(L) && !/kesik-ok/.test(L)) hit('🔴', 'D2 kesik   ', i, L.trim().slice(0, 110));
    if (R.topline.test(L)) hit('🟡', 'D3 tepa-chiziq', i, L.trim().slice(0, 110));
    const lm = R.label.exec(L);
    if (lm && (R.input.test(lines[i + 1] || '') || R.input.test(lines[i + 2] || '') || R.input.test(lines[i + 3] || '')))
      hit('🟡', 'D4 savol-tepada', i, `«${lm[2].trim()}» → placeholder ichiga (48/52/54)`);
    if (R.bosing.test(L) && !R.bosingOk.test(L) && /<|'|"/.test(L)) hit('🟡', 'D5 bosing  ', i, L.trim().slice(0, 110));
    if (R.yoriq.test(L) && !/\/\//.test(L)) hit('🟡', 'D6 yoriq   ', i, L.trim().slice(0, 110));
    if (!/^\s*\/\//.test(L)) emoji += (L.match(R.emoji) || []).length;
  }
  totalErr += err;
  console.log(`\n${f}  🔴 ${err} · 🟡 ${warn} · ⚪ emoji ${emoji}`);
  for (const l of out) console.log(l);
}
console.log(`\n${totalErr ? '🔴 dizayn-lint: ' + totalErr + ' error' : '✅ dizayn-lint: 0 error'}`);
process.exit(totalErr ? 1 : 0);
