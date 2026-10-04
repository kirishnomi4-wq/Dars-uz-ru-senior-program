#!/usr/bin/env node
// ============================================================================
// LINT-QOLIP — QA fidbekidan chiqqan qolip-xatolari darvozasi (F-1003, 2026-10-03).
//
// Nega kerak. 5-Modul QA (03.10) bir xil sinfdagi xatolarni bir necha darsda topdi;
// har biri boshqa modullarda ham bor edi (39, 109, 24 fayl). esbuild/jsx/til ularni
// ko'rmaydi — kod to'g'ri, lekin o'quvchi ko'radigan natija buzuq. Har qoida bitta
// qonun bilan juft (DARS_ETALON 174–178) va tuzatilgan holatga qaytishni to'xtatadi.
//
// QOIDALAR (hammasi error):
//   q1 ekran-markaz   — `.screen` vertikal markazda (justifyContent: 'center') → kontent o'rtaga tushadi (174)
//   q2 bir-qator      — `reflect-input` matn maydoni `<input>` → uzun javob yon tomonga ketadi (175)
//   q3 qulfsiz        — ScreenLivePractice «Bajardim» qadamlarni sanamaydi (176)
//   q4 yakun-halqa    — yakun `hero` ichida ScoreRing → sarlavha 2 qatorda kartaga tushadi (177)
//   q5 halqa-chet     — `.pod-card .ring-wrap` manfiy `top` → halqa kartadan chiqadi (177)
//   q6 ro'yxat-chet   — `.kdreq` oddiy ro'yxat: umumiy `ol{padding:0}` chekinishni yeydi (178)
// QOIDA (warn):
//   q7 son-takror     — «Mustaqil ish · uch …» eyebrow: son sarlavha + doiralarda bor (179)
// F-1004 (6-Modul QA, 2026-10-04) — 6-Modul va yangi modullarda ERROR, 1–5-Modulda WARN (qaror Q4 B: KATTA_TOZALASH):
//   q8  tugma-chap    — ichki harakat tugmasi (`btn`/`btn-soft`) chapda (alignSelf flex-start) → o'ng chekkada bo'lsin (187)
//   q9  ro'yxat-flex  — `.kdreq li` flex: band ichidagi kod-chip alohida ustunga bo'linadi («qayt / di») (178, F-1004-19)
//   q10 tartib-ustun  — DragDropOrder `<Col>` ichida (yonida izoh-karta) → to'liq kenglik, izoh faqat yechimdan keyin (188)
//   q11 banner-shakl  — QAT'IY, hamma modulda error (F-1004-57): CODE STRIKE kapsula 999px · «Uyga vazifa» 22px, o'rtada, min(560px,100%) (192)
//   q12 takror-tasdiq — kompilyatordan keyin «Bajarildi — … sayqallang» / «✓ Belgilandi» chip (190, 179)
//   q19 yashil-fon    — ASOSIY QONUN, hamma modulda error (F-1004-58): xulosa yashili #E3F0E8, .frame-success foni shu token (202)
// F-1004 2-qism (D1–D4, 04.10.2026) — UMUMIY QOLIP (src/qolip). Qolipni import qilgan fayl «qolip-dars»: unda —
//   q13 rang-token    — T.<nom> ruxsat ro'yxatida emas (9 token + shadowBase) yoki palitra qolipRang dan emas (D3, DE-195)
//   q14 tugma-sinf    — <button> klassi qolip/infratuzilma ro'yxatida yo'q (D2, DE-194); darsning chizilgan maket
//                       tugmalari faylda «// qolip-maket: klass1 klass2» izohi bilan e'lon qilinadi
//   q15 ekran-turi    — ScreenN qolip turidan (QKirish·QTushuncha·QKod·QVoqea·QMustaqil·QYakun) yoki
//                       QuestionScreen/DragDropOrder dan yig'ilmagan (D1, DE-193)
//   q16 qolipsiz      — yangi modul darsi qolipni import qilmagan (error); 6-Modulda — «hali o'tmagan» (warn, MD v3 navbati)
//   q17 zoom-yoq      — QKirish/QReja/QTushuncha zoom={Zoomable} siz (DE-200)
//   q18 tugadi-yoq    — xulosasi bor QTushuncha tugadi={…} siz (DE-199; ataylab — tugadi={false})
//   q20 test-qolip    — QuestionScreen <QTest> siz yoki DragDropOrder nusxasi (DE-203)
//   q21 yakun-qolip   — kartochka / yakun nusxasi: Flashcards, .fc-card, hw-big, ach-grid; SummaryScreen <QYakun> siz (DE-204)
//   q22 podium-yorliq — Q_LABELS kalitlari ballik ekranlarni (SCORED_IDX) qoplamaydi: podium nuqtasi yorliqsiz (F-1004-60); 1–4c va PM — warn
//   D4 (emoji) — lint-emoji.mjs «qolip-dars» rejimi.
//
// Ishlatish: node lint-qolip.mjs [fayl|papka …]  (argumentsiz — App.jsx ga ulangan barcha darslar)
// Chiqish kodi: error > 0 bo'lsa 1.
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const C = { red: (s) => `\x1b[31m${s}\x1b[0m`, yel: (s) => `\x1b[33m${s}\x1b[0m`, grn: (s) => `\x1b[32m${s}\x1b[0m`, b: (s) => `\x1b[1m${s}\x1b[0m` };

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    // faqat arxiv PAPKALARI o'tkaziladi — fayl nomida «eski» bo'lishi mumkin (ClaudE-SKIlls!)
    if (e.isDirectory() && (e.name === 'eski' || e.name === '2-moodull eski')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.jsx')) out.push(p);
  }
}
// App.jsx ga ulangan darslar — o'lik nusxalar (PmLesson7, PmLesson28) va boshqa ilovalar (bridge/)
// papka bilan berilganda hisobga olinmaydi; aniq fayl berilsa — har doim tekshiriladi.
const app = fs.readFileSync(path.join(ROOT, 'src/App.jsx'), 'utf8');
const ACTIVE = new Set([...app.matchAll(/import\('\.\/([^']+\.jsx)'\)|from '\.\/([^']+\.jsx)'/g)].map((m) => path.join(ROOT, 'src', m[1] || m[2])));
let files = [];
if (args.length) {
  for (const a of args) {
    const full = path.resolve(ROOT, a);
    if (!fs.existsSync(full)) continue;
    if (fs.statSync(full).isDirectory()) { const w = []; walk(full, w); files.push(...(full.includes(path.join(ROOT, 'src')) ? w.filter((p) => ACTIVE.has(p)) : w)); }
    else files.push(full);
  }
} else {
  files = [...ACTIVE].filter((p) => fs.existsSync(p));
}
files.sort();

const lineOf = (s, i) => s.slice(0, i).split('\n').length;
const findings = [];
const add = (f, s, i, sev, id, msg) => findings.push({ f: path.relative(ROOT, f), line: lineOf(s, i), sev, id, msg });
// Eski darslar — F-1004 qoidalari ogohlantirish (KATTA_TOZALASH F-1004): 1–5-Modul (4a/4b/4c), eski 7-Modul (MD-birinchi
// bilan qayta quriladi — qurilgach shu ro'yxatdan chiqariladi), PM etalonlari (src/pm). Qolgani — 6-Modul va YANGI papkalar — error.
const MOD = /(?:^|[\\/])src[\\/](\d+[a-z]?)-Modull[\\/]/;
const LEGACY_MODS = new Set(['1', '2', '3', '4', '4a', '4b', '4c', '5', '7']);
const sevOf = (f) => { const m = MOD.exec(f); return !m || LEGACY_MODS.has(m[1]) ? 'warn' : 'error'; };

// D2 — infratuzilma tugmalari (nav, ⛶, arena, takrorlash, kartochka, tartib-mashqi, mentor paneli, yakun, nishon)
const INFRA_BTN = /^(q-|btn-white-accent$|btn-ghost$|zoom-btn$|qz-|cs-|rc-|fc-|dd-chip$|mstats-|hw-|ach-|option\b|mnote-chip$|wsx-toggle$|gate-|lg-)/;
const RUXSAT_T = new Set(['bg', 'paper', 'line', 'ink2', 'ink', 'accent', 'accentSoft', 'ok', 'okFon', 'err', 'errFon', 'shadowBase']);
// q11 (192) — dars fayli va src/qolip/qolipCss.js uchun bir xil o'lchov (yakun banneri qolipga ko'chgan, DE-204)
function q11(f, s) {
  { const cap = /\.cs-cap \{[^}]*?border-radius: *([^;]+);/.exec(s);
    if (cap && cap[1].trim() !== '999px') add(f, s, cap.index, 'error', 'q11 banner-shakl', `CODE STRIKE radiusi ${cap[1].trim()} — kapsula bo'lsin: border-radius: 999px (DE-192)`);
    const hwb = /\.hw-big \{[^}]*?border-radius: *([^;]+);/.exec(s);
    if (hwb && hwb[1].trim() !== '22px') add(f, s, hwb.index, 'error', 'q11 banner-shakl', `«Uyga vazifa» radiusi ${hwb[1].trim()} — 22px bo'lsin (DE-192)`);
    const hww = /\.hw-big-wrap \{([^}]*)\}/.exec(s);
    if (hww && !/align-self: *center/.test(hww[1])) add(f, s, hww.index, 'error', 'q11 banner-shakl', "«Uyga vazifa» o'rtada bo'lsin: align-self: center; width: min(560px, 100%) (DE-192)");
    else if (hww && !/width: *min\(560px, *100%\)/.test(hww[1])) add(f, s, hww.index, 'error', 'q11 banner-shakl', "«Uyga vazifa» eni: width: min(560px, 100%) (DE-192)"); }
}
const QOLIP_IMPORT = /from '(?:\.\.\/)+qolip(?:\/index\.jsx)?'/;
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  let m;
  const qolipDars = QOLIP_IMPORT.test(s);
  { const mm = MOD.exec(f);
    if (mm && !LEGACY_MODS.has(mm[1]) && !qolipDars && !/[\\/]src[\\/]qolip[\\/]/.test(f)) {
      if (mm[1] === '6') add(f, s, 0, 'warn', 'q16 qolipsiz', "dars hali umumiy qolipga o'tmagan — MD v3 → qolip (D9 navbati)");
      else add(f, s, 0, 'error', 'q16 qolipsiz', "yangi modul darsi umumiy qolipsiz — src/qolip dan yig'ilsin (D1, DE-193)");
    } }
  if (qolipDars) {
    // q13 (D3)
    const reT = /\bT\.([A-Za-z]\w*)/g;
    const bad = new Map();
    while ((m = reT.exec(s))) if (!RUXSAT_T.has(m[1]) && !bad.has(m[1])) bad.set(m[1], m.index);
    for (const [nom, i] of bad) add(f, s, i, 'error', 'q13 rang-token', `T.${nom} — qolipda yo'q token; 9 token: neytral 5 · modul rangi 2 · holat 2 (D3, DE-195)`);
    const tDef = /const T = \{([^;]*)\};/.exec(s);
    if (!tDef || !/qolipRang\(/.test(tDef[1])) add(f, s, tDef ? tDef.index : 0, 'error', 'q13 rang-token', "palitra qolipRang('tex'|'pm') dan olinsin — o'z hex-palitrasi yo'q (D3)");
    // q14 (D2)
    const maket = new Set(((/\/\/ qolip-maket:([^\n]*)/.exec(s) || [])[1] || '').trim().split(/\s+/).filter(Boolean));
    const reBtn = /<button\b(?:[^>]|=>)*?className=(?:"([a-zA-Z][\w-]*)|\{`([a-zA-Z][\w-]*))/g;
    while ((m = reBtn.exec(s))) {
      const k = m[1] || m[2];
      if (INFRA_BTN.test(k) || maket.has(k)) continue;
      add(f, s, m.index, 'error', 'q14 tugma-sinf', `«${k}» — tugma ikki darajada: QTugma (asosiy / ikkinchi) yoki QChip; maket tugmasi bo'lsa «// qolip-maket: ${k}» (D2, DE-194)`);
    }
    // q20 (DE-203): test ko'rinishi va tartib-mashqi faqat qolipdan — QuestionScreen <QTest> orqali chiziladi, DragDropOrder nusxasi yo'q (QTartib)
    { const qs = s.indexOf('const QuestionScreen = ');
      if (qs >= 0) { const qe = s.indexOf('\n};\n', qs); if (!/<QTest\b/.test(s.slice(qs, qe))) add(f, s, qs, 'error', 'q20 test-qolip', "QuestionScreen o'z variant-tugmalarini chizadi — ko'rinish <QTest>/<QTestJavob> dan (DE-203)"); }
      const dd = /function DragDropOrder\(|<DragDropOrder\b/.exec(s);
      if (dd) add(f, s, dd.index, 'error', 'q20 test-qolip', "DragDropOrder nusxasi — tartib-mashqi qolipdan: <QTartib> (188, DE-203)"); }
    // q21 (DE-204): kartochka va yakun ekrani faqat qolipdan — darsda mexanika/CSS/banner nusxasi yo'q; CODE STRIKE va arena darsda (o'yin qatlami)
    { const n = /function Flashcards\(|const Flashcards = |\.fc-card \{|className=(?:"|\{`)hw-big(?=[\s"`$])|className="ach-grid"/.exec(s);
      if (n) add(f, s, n.index, 'error', 'q21 yakun-qolip', "kartochka/yakun nusxasi darsda — qolipdan: <QKartochka> va <QYakun> (DE-204)");
      const sm = s.indexOf('const SummaryScreen = ');
      if (sm >= 0) { const se = s.indexOf('\n};\n', sm); if (!/<QYakun\b/.test(s.slice(sm, se))) add(f, s, sm, 'error', 'q21 yakun-qolip', "SummaryScreen o'z yakunini chizadi — <QYakun> (DE-204)"); } }
    // q15 (D1)
    const reScr = /^const (Screen\d+) = /gm;
    const starts = [...s.matchAll(reScr)].map(x => ({ nom: x[1], i: x.index }));
    starts.forEach((st, k) => {
      const end = k + 1 < starts.length ? starts[k + 1].i : s.indexOf('\n// =====', st.i + 10) > 0 ? s.indexOf('\n// =====', st.i + 10) : s.length;
      const body = s.slice(st.i, end);
      if (!/<Q(?:Kirish|Reja|Tushuncha|Kod|Voqea|Mustaqil|Yakun)\b|<QuestionScreen\b|<QTartib\b/.test(body))
        add(f, s, st.i, 'error', 'q15 ekran-turi', `${st.nom} qolip turidan yig'ilmagan — QKirish/QReja/QTushuncha/QKod/QVoqea/QMustaqil/QYakun (D1, DE-193)`);
      // q17 (DE-200): vizual ⛶ ichida — QKirish/QReja/QTushuncha zoom={…} siz bo'lmaydi
      for (const mm of body.matchAll(/<Q(Kirish|Reja|Tushuncha)\b[^>]*?(?=\n\s+[a-z]+=|>)/g)) {
        const tag = body.slice(mm.index, body.indexOf('\n', mm.index));
        if (!/\bzoom=\{/.test(tag)) add(f, s, st.i + mm.index, 'error', 'q17 zoom-yoq', `${st.nom}: Q${mm[1]} zoom={Zoomable} siz — vizual kattalashtirilmaydi (DE-200)`);
      }
      // q18 (DE-199): xulosasi bor tushuncha-ekranda tugadi holati — ish tugagach harakat yopiladi, natija fokusga chiqadi
      if (/<QTushuncha\b/.test(body) && /\bxulosa=\{/.test(body) && !/\btugadi=\{/.test(body))
        add(f, s, st.i, 'error', 'q18 tugadi-yoq', `${st.nom}: QTushuncha xulosasi bor, tugadi={…} yo'q — ish tugagach panel yopilmaydi (DE-199); ataylab bo'lsa tugadi={false}`);
    });
  }
  // q1
  // to'g'ridan-to'g'ri ham, shartli ham (`isMentorLive ? 'flex-start' : 'center'`), `safe center` ham — hammasi markaz
  const reCenter = /<div className=\{?["`]screen[^"`]*["`]\}? style=\{\{[^}]*justifyContent:[^,}]*['"](?:safe )?center['"]/g;
  while ((m = reCenter.exec(s))) add(f, s, m.index, 'error', 'q1 ekran-markaz', "ekran vertikal markazda — kontent tepadan boshlanadi (DE-174): justifyContent olinsin");
  const reCenterCss = /\.screen(?::has\([^)]*\))?(?:\.[\w-]+)? \{[^}]*justify-content: *(?:safe )?center/g;
  while ((m = reCenterCss.exec(s))) add(f, s, m.index, 'error', 'q1 ekran-markaz', "CSS'da `.screen` vertikal markazda — kontent tepadan boshlanadi (DE-174)");
  // q2
  const reInput = /<input\b(?:[^>]|=>)*?\/>/gs;
  while ((m = reInput.exec(s))) {
    const t = m[0];
    if (!t.includes('reflect-input')) continue;
    if (/type="number"|inputMode|type=\{/.test(t)) continue;
    add(f, s, m.index, 'error', 'q2 bir-qator', 'matn maydoni <input> — <GrowInput> (1→4 qator) bo\'lsin (DE-175)');
  }
  // q3
  const lp = s.indexOf('function ScreenLivePractice');
  if (lp >= 0) {
    const body = s.slice(lp, s.indexOf('\n}\n', lp));
    const k = body.indexOf('disabled={done} onClick={complete}');
    if (k >= 0) add(f, s, lp + k, 'error', 'q3 qulfsiz', '«Bajardim» qadamlar belgilanmasa ham bosiladi — disabled={done || checked.size < checklist.length} (DE-176)');
  }
  // q4
  const h = s.indexOf('<div className="hero">');
  if (h >= 0) {
    const seg = s.slice(h, h + 6000);
    const end = seg.indexOf('className="bigidea') > 0 ? seg.indexOf('className="bigidea') : seg.indexOf('cs-cta') > 0 ? seg.indexOf('cs-cta') : 2500;
    const r = seg.slice(0, end).indexOf('<ScoreRing');
    if (r >= 0) add(f, s, h + r, 'error', 'q4 yakun-halqa', 'yakun ekranida halqa — «N/M to\'g\'ri» yorlig\'i (score-chip) bo\'lsin (DE-177)');
  }
  // q5
  const reRing = /\.pod-card \.ring-wrap \{[^}]*\btop: *-\d/g;
  while ((m = reRing.exec(s))) add(f, s, m.index, 'error', 'q5 halqa-chet', 'natija halqasi kartadan tashqariga chiqadi (manfiy top) (DE-177)');
  // q6
  if (s.includes('className="kdreq"') && !/ol\.kdreq \{/.test(s)) {
    const k = s.search(/\n\s*\.kdreq \{/);
    add(f, s, k >= 0 ? k + 1 : 0, 'error', 'q6 ro\'yxat-chet', '.kdreq oddiy ro\'yxat — umumiy ol{padding:0} chekinishni yeydi; `.lesson-root ol.kdreq` naqshi (DE-178)');
  }
  // q7
  const reEy = /eyebrow=\{tr\(\{ uz: 'Mustaqil ish · (?:bitta|uch|uchta|ikki|ikkita|to'rt|to'rtta|besh|beshta)\b[^']*'/g;
  while ((m = reEy.exec(s))) add(f, s, m.index, 'warn', 'q7 son-takror', 'son sarlavha va 1/2/3 doiralarda bor — eyebrow «Mustaqil ish» (DE-179)');
  const sv = sevOf(f);
  // q8
  // (?:[^>]|=>) — onClick={() => …} ichidagi «=>» tegni yopmaydi (F-1004: eski [^>]* 6-Modulda 5 tugmani ko'rmagan)
  const reLeft = /<button className="btn(?:-soft)?"(?:[^>]|=>)*?alignSelf: 'flex-start'/g;
  while ((m = reLeft.exec(s))) add(f, s, m.index, sv, 'q8 tugma-chap', "harakat tugmasi chapda — o'ng chekkada bo'lsin: alignSelf 'flex-end' (DE-187)");
  const reSaveLeft = /\.wsp-save \{ *align-self: *flex-start/g;
  while ((m = reSaveLeft.exec(s))) add(f, s, m.index, sv, 'q8 tugma-chap', "«Saqlash» (`.wsp-save`) chapda — align-self: flex-end (DE-187)");
  // q9
  const reKdFlex = /\.kdreq li \{[^}]*\bdisplay: *flex/g;
  while ((m = reKdFlex.exec(s))) add(f, s, m.index, sv, "q9 ro'yxat-flex", "`.kdreq li` flex — kod-chip ustunga bo'linadi; li blok, raqam ::before absolute (DE-178, F-1004-19)");
  // q10
  const reDdCol = /<Col>\s*<DragDropOrder\b/g;
  while ((m = reDdCol.exec(s))) add(f, s, m.index, sv, 'q10 tartib-ustun', "tartib-mashqi ustunda, yonida izoh — to'liq kenglik, izoh faqat yechimdan keyin (DE-188)");
  // q11 (192, F-1004-57 — QAT'IY, hamma modulda error): yakun bannerlari platforma standartida —
  // CODE STRIKE kapsula (.cs-cap 999px) · «Uyga vazifa» 22px, o'rtada, 560px gacha (1–5-Modul va PM'dagi 84 darsning shakli)
  q11(f, s);
  // q22 (F-1004-60): podium nuqtasi yorlig'i — Q_LABELS kalitlari = SCREEN_META dagi ballik ekranlar (ekran soni o'zgarganda kalitlar eskirib qoladi)
  { const q = /const Q_LABELS = \{([\s\S]*?)\n\};/.exec(s); const mt = /const SCREEN_META = \[([\s\S]*?)\n\];/.exec(s);
    if (q && mt) {
      const keys = new Set([...q[1].replace(/\{[^{}]*\}/g, '{}').matchAll(/(\d+)\s*:/g)].map(x => +x[1]));
      const sc = (mt[1].match(/\{[^{}]*\}/g) || []).map((r, i) => (/scored:\s*true/.test(r) ? i : -1)).filter(i => i >= 0);
      const yoq = sc.filter(i => !keys.has(i));
      if (yoq.length) add(f, s, q.index, /[\\/]5-Modull[\\/]/.test(f) ? 'error' : sv, 'q22 podium-yorliq', `ballik ekran ${yoq.join(', ')} uchun Q_LABELS kaliti yo'q — podium nuqtasi yorliqsiz (kalitlar = SCORED_IDX)`); } }
  // q19 (202, F-1004-58 — ASOSIY QONUN, hamma modulda error): yashil xulosa foni — texnik darslardagi AYNAN bitta yashil #E3F0E8
  { const ss = /\bsuccessSoft: *'(#[0-9A-Fa-f]{6})'/.exec(s);
    if (ss && ss[1].toUpperCase() !== '#E3F0E8') add(f, s, ss.index, 'error', 'q19 yashil-fon', `successSoft ${ss[1]} — texnik darslar yashili #E3F0E8 bo'lsin (DE-202)`);
    const fs2 = /\.frame-success \{ *background: *([^;]+);/.exec(s);
    if (fs2 && !/^\$\{T\.(?:successSoft|okFon)\}$/.test(fs2[1].trim())) add(f, s, fs2.index, 'error', 'q19 yashil-fon', `.frame-success foni ${fs2[1].trim()} — \${T.successSoft} (#E3F0E8) bo'lsin (DE-202)`); }
  // q12
  const reAgain = /className="klaunch-sub">\{tr\(\{ uz: 'Bajarildi — xohlasangiz kodni yana sayqallang'|<div className="cmt-fold fade-step"><span className="cmt-done">/g;
  while ((m = reAgain.exec(s))) add(f, s, m.index, sv, 'q12 takror-tasdiq', "kompilyatordan keyin takror tasdiq — natijani kompilyator ko'rsatdi, tashqarida faqat «Davom etish» (DE-190)");
}

{ const qc = path.join(ROOT, 'src/qolip/qolipCss.js'); if (fs.existsSync(qc)) q11(qc, fs.readFileSync(qc, 'utf8')); }
const errs = findings.filter((x) => x.sev === 'error');
const warns = findings.filter((x) => x.sev === 'warn');
console.log(C.b(`\nLINT-QOLIP — ${files.length} fayl`));
for (const x of findings) console.log(`${x.sev === 'error' ? C.red('🔴') : C.yel('🟡')} ${x.f}:${x.line} [${x.id}] ${x.msg}`);
console.log(errs.length ? C.red(C.b(`🔴 error: ${errs.length} · 🟡 warn: ${warns.length}\n`)) : C.grn(C.b(`✓ TOZA — error 0 · warn ${warns.length}\n`)));
process.exit(errs.length ? 1 : 0);
