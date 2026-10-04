#!/usr/bin/env node
// ============================================================================
// LINT-OLCHOV — matn-o'lchov darvozasi (F-1002-61/62/63, 2026-10-02; QOIDALAR T-067 · S-048 · T-068).
// O'quvchi ko'radigan uch sinf matnning uzunligini o'lchaydi (uz; ru ≈ +25%):
//   • hook javobi («Aynan!» / «Qiziq fikr!» bilan boshlanadigan tasdiq-matn)   → ≤2 gap, ≤120 belgi
//   • xato-izoh (`frame-warn` ichidagi tr-matn)                                  → ≤60 belgi
//   • yashil xulosa (`frame-success` ichidagi tr-matn)                           → ≤2 gap, ≤110 belgi
//   • sarlavha (`title h-title`, F-1002-75 · DE-164)                              → bitta qator: uz ≤55, ru ≤60 (yakuniy hukm — scripts/sarlavha-qator.mjs, brauzer)
//   • sarlavha↔Mentor takrori (F-1004-31, DE-193): sarlavhaning mazmunli so'zlari (≥4 harf, ≥3 ta) ≥50% i
//     keyingi Mentor gapida bo'lsa — topilma. Qamrov: 6-Modul va yangi modullar error, qolgani warn.
// Hisob: teglar, {ifoda} va backtik olib tashlanadi; hook ochuvchi so'zi («Aynan!») gap sanalmaydi.
// Ikki sinov (mexanizm 2-bosqich): 02.10 dan oldingi 5-Modul (git a171852) — 79 topilma; tuzatilgan — 0.
//
// Ishlatish:  node lint-olchov.mjs [src/... | fayl]      Chiqish kodi: error > 0 → 1
//   Qamrov: src/5-Modull va 7+ modullar — error; 1–4-Modul va 6-Modul (fidbek davrigacha) — faqat warn
//   (eski darslar KATTA_TOZALASH navbatida, bu darvoza ularni to'xtatmaydi).
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';

const LIMITS = { hook: { len: 120, sents: 2 }, warn: { len: 60, sents: 99 }, succ: { len: 110, sents: 2 }, title: { len: 55, sents: 99, ru: 60 } };
const RU_K = 1.25;
// 6-Modul hozircha warn: o'z fidbek davrida (keyingi) qat'iy bo'ladi — 02.10 holatida 14 darsda ~160 topilma, boshqa seansni to'xtatmaslik uchun.
const STRICT = /src[\\/](5-Modull|[7-9]-Modull|1[0-9]-Modull)[\\/]|PmMetricsLesson\.jsx$/;
// takror (F-1004-31) — 6-Modul ham qat'iy (fidbek davri qarori 04.10)
const STRICT_TAKROR = /src[\\/](6-Modull|[89]-Modull|1[0-9]-Modull)[\\/]/;
const STOP = new Set('bilan uchun keyin oldin emas yoki lekin agar endi qanday qaysi nima hamma bitta'.split(' '));
const cwords = (t) => new Set((strip(t).toLowerCase().match(/[a-zʻ'’]+/g) || []).filter(w => w.length >= 4 && !STOP.has(w)));

const args = process.argv.slice(2);
function listJsx(p) {
  const st = fs.statSync(p);
  if (st.isFile()) return p.endsWith('.jsx') ? [p] : [];
  return fs.readdirSync(p).flatMap(f => listJsx(path.join(p, f)));
}
const files = (args.length ? args : ['src']).flatMap(listJsx);

// tr({ uz: <qiymat>, ru: <qiymat> }) — qiymat: '…' | "…" | `…` | <>…</>
const VAL = `'(?:[^'\\\\]|\\\\.)*'|"(?:[^"\\\\]|\\\\.)*"|\`[^\`]*\`|<>[\\s\\S]*?<\\/>`;
const TR = new RegExp(`tr\\(\\{\\s*uz:\\s*(${VAL})\\s*,\\s*ru:\\s*(${VAL})\\s*\\}\\)`, 'g');
const strip = (t) => t.replace(/^['"`]|['"`]$/g, '').replace(/<\/?>/g, '').replace(/<[^>]+>/g, '').replace(/\{[^}]*\}/g, '').replace(/`/g, '').replace(/\s+/g, ' ').trim();
const sents = (t) => t.replace(/^(Aynan!|Qiziq fikr!|Именно!|Интересная мысль!)\s*/, '').split(/(?<=[.!?…])\s+/).filter(Boolean).length;
const lineOf = (s, i) => s.slice(0, i).split('\n').length;

const report = [];
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const strict = STRICT.test(file);
  const seen = new Set();
  const check = (kind, m) => {
    if (seen.has(m.index)) return; seen.add(m.index);
    const L = LIMITS[kind];
    for (const [lang, raw, k] of [['uz', m[1], 1], ['ru', m[2], RU_K]]) {
      const t = strip(raw); const n = sents(t); const lim = lang === 'ru' && L.ru ? L.ru : Math.round(L.len * k);
      if (t.length > lim || n > L.sents) report.push({ file, line: lineOf(src, m.index), kind, lang, len: t.length, lim, n, strict, t });
    }
  };
  // 1) frame-warn / frame-success: sinfdan keyingi birinchi tr(…)
  for (const kind of ['warn', 'succ']) {
    const cls = kind === 'warn' ? /className="frame-warn/g : /className="frame-success/g;
    let c; while ((c = cls.exec(src))) {
      TR.lastIndex = c.index; const m = TR.exec(src);
      if (!m || m.index - c.index > 400) continue;           // tr(o'zgaruvchi) bo'lsa — ma'lumotdagi matn, bu yerda o'lchanmaydi
      check(kind, m);
    }
  }
  // 1b) qolip xulosasi (D1, F-1004 2-qism): QTushuncha xulosa={… tr({ uz, ru })} — yashil xulosa bilan bir o'lchov
  { const XR = /\bxulosa=\{[^{}]*?tr\(/g; let x;
    while ((x = XR.exec(src))) { TR.lastIndex = x.index; const m = TR.exec(src); if (m && m.index - x.index < 200) check('succ', m); } }
  // 2) sarlavha (164-qonun, F-1002-75): bitta qator — uz ≤55, ru ≤60 belgi (oldindan tekshiruv)
  { const TT = /className="title h-title[^"]*"[^>]*>\{(?:isLive \? )?/g; let t;
    while ((t = TT.exec(src))) { TR.lastIndex = TT.lastIndex; const m = TR.exec(src); if (m && m.index === TT.lastIndex) check('title', m); } } // tr( aynan sarlavha ichida — tr(o'zgaruvchi) bo'lsa keyingi blok ushlanmaydi
  // 2b) sarlavha↔Mentor takrori (F-1004-31): sarlavhadan keyingi birinchi <Mentor> (1500 belgigacha)
  { const TT = /className="title h-title[^"]*"[^>]*>\{(?:isLive \? )?/g; let t;
    while ((t = TT.exec(src))) {
      TR.lastIndex = TT.lastIndex; const m = TR.exec(src); if (!m || m.index !== TT.lastIndex) continue;
      const k = src.indexOf('<Mentor>{tr({', m.index + m[0].length); if (k < 0 || k - m.index > 1500) continue;
      TR.lastIndex = k + 9; const mm = TR.exec(src); if (!mm || mm.index !== k + 9) continue;
      const tw = cwords(m[1]), mw = cwords(mm[1]); if (tw.size < 3) continue;
      const ov = [...tw].filter(w => mw.has(w)).length / tw.size;
      if (ov >= 0.5) report.push({ file, line: lineOf(src, m.index), kind: 'takror', lang: 'uz', len: Math.round(ov * 100), lim: 50, n: 0, strict: STRICT_TAKROR.test(file), t: strip(m[1]) + '  ⇄  ' + strip(mm[1]) });
    } }
  // 3) hook javobi: qiymat «Aynan!» / «Qiziq fikr!» bilan boshlanadi (hook-ack sinfi yoki HOOK_ACK/ack: ma'lumoti)
  const HOOK = new RegExp(`uz:\\s*(${VAL})\\s*,\\s*ru:\\s*(${VAL})`, 'g');
  let h; while ((h = HOOK.exec(src))) {
    if (!/^(<>\s*)?(<b>)?(Aynan!|Qiziq fikr!)/.test(h[1].replace(/^['"`]/, ''))) continue;
    check('hook', h);
  }
}

const err = report.filter(r => r.strict), warn = report.filter(r => !r.strict);
const B = '\x1b[1m', R = '\x1b[0m', RED = '\x1b[31m', YEL = '\x1b[33m', GRN = '\x1b[32m';
const NAME = { hook: 'hook javobi', warn: 'xato-izoh', succ: 'yashil xulosa', title: 'sarlavha', takror: 'sarlavha≈Mentor %' };
for (const r of report) {
  const tag = r.strict ? `${RED}🔴` : `${YEL}🟡`;
  console.log(`${tag} ${r.file}:${r.line}${R} [${NAME[r.kind]} · ${r.lang}] ${r.len}>${r.lim} belgi${r.kind !== 'takror' && r.n > LIMITS[r.kind].sents ? `, ${r.n} gap` : ''} — ${r.t.slice(0, 90)}${r.t.length > 90 ? '…' : ''}`);
}
console.log(`${B}\nlint-olchov: ${files.length} fayl · ${RED}${err.length} error${R}${B} · ${YEL}${warn.length} warn${R}${B} · sarlavha ≤55 (ru ≤60) · hook ≤2 gap/≤120 · xato-izoh ≤60 · xulosa ≤2 gap/≤110 (ru ×1.25)${R}`);
if (!report.length) console.log(`${GRN}✓ TOZA${R}`);
process.exit(err.length ? 1 : 0);
