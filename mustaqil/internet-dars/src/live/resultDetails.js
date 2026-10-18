// Natija-detallari — `onFinished` payload'iga LMS uchun TZ_LESSON_RESULT_DETAILS_RU §4 shaklidagi obyekt:
//   { lang, questions[], achievements[] }  (Axadulla 2026-09-08: School API kontrakti kengaymaydi, detallar onFinished orqali).
// Manbalar (darsga tegmasdan yig'iladi):
//   · answers[i] — darsning o'z javob-obyekti (question, options, correctIndex, correctAnswer, picked, studentAnswer, correct, solved)
//   · urinishlar tarixi — useLiveSession.recordAttempt har bosishda shu modulga ham yozadi (server yo'q bo'lsa ham)
//   · yutuq-vaqtlari — progressSync har saqlovda `earned` ro'yxatini ko'radi, birinchi ko'ringan vaqt yoziladi
// Server (result-builder.js) bilan bir xil chegaralar: 200 savol · 10 urinish · 6 variant · 300 belgi · 20 yutuq · nom 40 · ta'rif 200.
//
// 2026-09-09 (pilot JSON-namunasi, Axadulla):
//   F-0909-02 — tarix faqat JS-xotirada edi: sahifa yangilansa yo'qolar, tugashda zaxira-yo'l `elapsed_ms: 0`, `at` = tugash vaqti,
//               yutuqlarning `earned_at` bir xil bo'lib qolardi. Endi tarix `localStorage` (`ccDetails:<darsId>`) ga ham yoziladi va
//               yuklanganda tiklanadi; «qaytadan boshlash» tozalaydi. Chegara: boshqa qurilmadan davom etilsa tarix yo'q (zaxira-yo'l).
//   F-0909-03 — jonli darsda dars `solved: true` ni «savol yopildi» ma'nosida yozadi; LMS uchun `solved` = «oxirida to'g'riga yetdi».
//               Endi `solved` darsning bayrog'idan emas, urinishlardan hisoblanadi (server result-builder.js bilan bir xil qoida:
//               `solved === attempts.some(correct)`); jonli darsdagi xato javob → `solved: false`.
// 2026-09-10 — ARENA (CodeStrike) ham ketadi: jonli darsda o'quvchining arena javoblari (useLiveSession.submitAnswer → logArena)
//   testlardan KEYIN `kind: "arena"` bilan chiqadi (server result-builder.js tartibi bilan bir xil: s4 < s5b < … < quiz-0 < quiz-1).
//   Ballga kirmaydi (totalQuestions/correctAnswers faqat testlar). Bir savolga bitta javob (jonli qoida), takrori e'tiborsiz.
//   Mustaqil rejimda arena mashq — yozilmaydi (submitAnswer chaqirilmaydi). Matnlar `arenaBank` (darsning QUIZ_BANK) berilsa qo'shiladi.
import { getLiveLang } from './i18n.js';

const LIM = { questions: 200, attempts: 10, options: 6, text: 300, achievements: 20, name: 40, title: 200, elapsed: 3_600_000 };
const cut = (v, n) => (typeof v === 'string' ? v.slice(0, n) : undefined);
const iso = (t) => new Date(t || Date.now()).toISOString().replace(/\.\d{3}Z$/, 'Z');
const optText = (o, lang) => (o && typeof o === 'object' ? String(o[lang] ?? o.uz ?? '') : String(o ?? ''));

/** @type {Map<string, Map<number, Array<{option:number, answer?:string, elapsed_ms:number, at:number}>>>} */
const attemptsByLesson = new Map();
/** @type {Map<string, Map<string, number>>} */
const earnedAtByLesson = new Map();
/** Arena (jonli): dars-ID → (savol-raqami → bitta javob) */
/** @type {Map<string, Map<number, {option:number, correct:boolean, elapsed_ms:number, at:number}>>} */
const arenaByLesson = new Map();
const ARENA_Q = /^quiz-(\d+)$/;

// ---- Saqlov (F-0909-02): xotira + localStorage. Hammasi jim yiqiladi (private rejim, iframe, kvota).
const KEY = (lessonId) => `ccDetails:${lessonId}`;
const store = () => { try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch { return null; } };
const loaded = new Set(); // dars-ID: saqlovdan bir marta o'qildi
function load(lessonId) {
  if (loaded.has(lessonId)) return;
  loaded.add(lessonId);
  const st = store(); if (!st) return;
  let o = null;
  try { o = JSON.parse(st.getItem(KEY(lessonId)) || 'null'); } catch { return; }
  if (!o || typeof o !== 'object') return;
  const am = attemptsByLesson.get(lessonId) || new Map();
  for (const [k, list] of Object.entries(o.attempts || {})) {
    const idx = Number(k);
    if (!Number.isInteger(idx) || !Array.isArray(list) || am.has(idx)) continue;
    am.set(idx, list.filter((t) => t && typeof t === 'object' && Number.isFinite(t.at)).slice(0, LIM.attempts));
  }
  attemptsByLesson.set(lessonId, am);
  const em = earnedAtByLesson.get(lessonId) || new Map();
  for (const [id, t] of Object.entries(o.earnedAt || {})) if (Number.isFinite(t) && !em.has(id)) em.set(id, t);
  earnedAtByLesson.set(lessonId, em);
  const ar = arenaByLesson.get(lessonId) || new Map();
  for (const [k, e] of Object.entries(o.arena || {})) {
    const qi = Number(k);
    if (!Number.isInteger(qi) || ar.has(qi) || !e || typeof e !== 'object' || !Number.isFinite(e.at)) continue;
    ar.set(qi, { option: Number.isInteger(e.option) ? e.option : -1, correct: e.correct === true, elapsed_ms: Number.isFinite(e.elapsed_ms) ? e.elapsed_ms : 0, at: e.at });
  }
  arenaByLesson.set(lessonId, ar);
}
function persist(lessonId) {
  const st = store(); if (!st) return;
  const attempts = {};
  for (const [k, v] of attemptsByLesson.get(lessonId) || []) attempts[k] = v;
  const earnedAt = Object.fromEntries(earnedAtByLesson.get(lessonId) || []);
  const arena = {};
  for (const [k, v] of arenaByLesson.get(lessonId) || []) arena[k] = v;
  try { st.setItem(KEY(lessonId), JSON.stringify({ v: 1, attempts, earnedAt, arena })); } catch { /* kvota / private — jim */ }
}

/** recordAttempt'dan: har bosish (rejimdan qat'i nazar). */
export function logAttempt(lessonId, screenIdx, { picked, texts, elapsedMs } = {}) {
  if (!lessonId || !Number.isInteger(screenIdx)) return;
  load(lessonId);
  if (!attemptsByLesson.has(lessonId)) attemptsByLesson.set(lessonId, new Map());
  const m = attemptsByLesson.get(lessonId);
  if (!m.has(screenIdx)) m.set(screenIdx, []);
  const list = m.get(screenIdx);
  if (list.length >= LIM.attempts) return;
  list.push({ option: Number.isInteger(picked) ? picked : -1, answer: cut(texts && texts.picked, LIM.text), elapsed_ms: Math.max(0, Math.min(LIM.elapsed, Math.round(elapsedMs || 0))), at: Date.now() });
  persist(lessonId);
}

/**
 * submitAnswer'dan (faqat jonli o'quvchi): arena savoliga javob — bitta, birinchisi qoladi (jonli qoida: bir urinish).
 * questionId `quiz-N` bo'lmasa — hech narsa. Mustaqil rejimda chaqirilmaydi (arena mashq).
 */
export function logArena(lessonId, questionId, { picked, correct, elapsedMs } = {}) {
  const m = ARENA_Q.exec(String(questionId || ''));
  if (!lessonId || !m) return false;
  const qi = Number(m[1]);
  load(lessonId);
  if (!arenaByLesson.has(lessonId)) arenaByLesson.set(lessonId, new Map());
  const ar = arenaByLesson.get(lessonId);
  if (ar.has(qi) || ar.size >= LIM.questions) return false;
  ar.set(qi, { option: Number.isInteger(picked) ? picked : -1, correct: correct === true, elapsed_ms: Math.max(0, Math.min(LIM.elapsed, Math.round(elapsedMs || 0))), at: Date.now() });
  persist(lessonId);
  return true;
}

/** progressSync'dan: earned ro'yxati — har id birinchi ko'ringan vaqt. Saqlov tufayli sahifa yangilanganda ham birinchi vaqt qoladi (F-0909-02). */
export function noteEarned(lessonId, ids) {
  if (!lessonId || !Array.isArray(ids)) return;
  load(lessonId);
  if (!earnedAtByLesson.has(lessonId)) earnedAtByLesson.set(lessonId, new Map());
  const m = earnedAtByLesson.get(lessonId);
  const now = Date.now();
  let changed = false;
  for (const raw of ids) { const id = String(raw); if (!m.has(id)) { m.set(id, now); changed = true; } }
  if (changed) persist(lessonId);
}

/** Qaytadan boshlashda (restart) tarix tozalanadi — xotira ham, saqlov ham. */
export function resetResultDetails(lessonId) {
  clearedProgress.delete(lessonId); // F-0924-20
  attemptsByLesson.delete(lessonId); earnedAtByLesson.delete(lessonId); arenaByLesson.delete(lessonId); loaded.delete(lessonId);
  sealedByLesson.delete(lessonId); // yangi urinish — yangi yuk (F-0918-07)
  try { store()?.removeItem(KEY(lessonId)); } catch { /* jim */ }
  try { store()?.removeItem(SEAL_KEY(lessonId)); } catch { /* jim */ } // muhr-saqlovi ham (F-0920-01)
}

// ── onFinished yukini MUHRLASH (F-0918-07) ─────────────────────────────────────────────────────────────────
// Nega: LMS `question_try` so'roviga `idempotency_key` qo'yadi (18.09 dan) — bir kalit ostida yuk o'zgarsa
// 409 `submission_key_mismatch` qaytadi va o'quvchi «Natijani saqlab bo'lmadi» yozuvini ko'radi. Dars esa yukni har
// «Darsni yakunlash» bosilganda qaytadan yig'ardi (`durationSec` o'sadi, detallardagi vaqtlar o'zgaradi).
// Qoida: shu dars ochilishi ichida birinchi yuk muhrlanadi, keyingi bosishlar AYNAN o'sha mazmunni qaytaradi.
// Muhr `localStorage` da ham turadi (F-0920-01): F5 yoki «Qaytadan boshlash» dan keyin ham AYNAN o'sha mazmun ketsin.
// 20.09 dalili (HAR, staging): bitta kalit ostida 30 ta yuborish — har birida `durationSec` boshqa (473, 475, 476 …),
// hammasi 409. LMS yangi kalit bergan bitta yuborish esa 200 qaytardi. Ya'ni qoida: KALIT BIR XIL BO'LSA — MAZMUN HAM.
// Muhr urinishga bog'lanadi: `liveSession:<darsId>` dagi `attemptId`/`pin` o'zgarsa (yangi urinish) — yangi yuk.
const sealedByLesson = new Map(); // dars-ID → { key, json }
const SEAL_KEY = (lessonId) => `ccSeal:${lessonId}`;
const attemptMark = (lessonId) => {
  try { const ls = JSON.parse(store()?.getItem(`liveSession:${lessonId}`) || 'null'); return String((ls && (ls.attemptId || ls.pin)) || ''); } catch { return ''; }
};
const sealKey = (lessonId, p) => `${(p && p.livePin) ?? ''}|${(p && p.liveMode) ?? ''}|${attemptMark(lessonId)}`; // boshqa sessiya/urinish — boshqa yuk

/**
 * Birinchi chaqiruvdagi yukni muhrlaydi; keyingi chaqiruvlarda o'sha mazmunning yangi nusxasini qaytaradi.
 * Nusxa — qabul qiluvchi (LMS) obyektni o'zgartirsa ham muhr buzilmasligi uchun. Yuk JSON bo'lib ketadi, shuning
 * uchun JSON-nusxa simdagi ko'rinishni o'zgartirmaydi. Nusxalab bo'lmasa (kutilmagan) — yuk o'zgarishsiz qaytadi.
 */
// ── Hajm-shifti (F-0924-20) ────────────────────────────────────────────────────────────────────────────────────────
// CRM `question_try.answer` ustunining chegarasi NOMA'LUM (Axadulladan so'ralgan, 24.09). Hozirgi real yuk ~6,5 KB (18.09).
// Shift MySQL TEXT (64 KB) dan xavfsiz pastda. Oshsa, tartib bilan: `answers[]` (eski shakl, `questions[]` bilan takror) →
// urinishlar 3 tagacha → matnlar 120 belgi → savollar oxiridan. Har qadam `truncated:true` + `truncatedFields` bilan
// yoziladi — analitika nima qisqarganini biladi, o'quvchi esa hajm sabab qizil xato ko'rmaydi.
export const CAP_BYTES = 48_000;
const byteLen = (s) => { try { return new TextEncoder().encode(s).length; } catch { return s.length; } };
export function capPayload(payload, cap = CAP_BYTES) {
  if (!payload || typeof payload !== 'object') return payload;
  if (byteLen(JSON.stringify(payload)) <= cap) return payload;
  const p = JSON.parse(JSON.stringify(payload)); const dropped = [];
  const step = (name, fn) => { if (byteLen(JSON.stringify(p)) <= cap) return; fn(); dropped.push(name); };
  step('answers', () => { delete p.answers; });
  step('attempts', () => { for (const q of p.questions || []) if (Array.isArray(q.attempts) && q.attempts.length > 3) q.attempts = q.attempts.slice(0, 3); });
  step('text', () => {
    const c = (s) => (typeof s === 'string' && s.length > 120 ? s.slice(0, 120) : s);
    for (const q of p.questions || []) { q.question = c(q.question); if (q.options) q.options = q.options.map(c); q.correct_answer = c(q.correct_answer); for (const a of q.attempts || []) a.answer = c(a.answer); }
  });
  step('questions', () => { while ((p.questions || []).length > 1 && byteLen(JSON.stringify(p)) > cap) p.questions.pop(); });
  p.truncated = true; p.truncatedFields = dropped;
  return p;
}

export function sealPayload(lessonId, payload) {
  if (!lessonId || !payload || typeof payload !== 'object') return payload;
  try {
    const key = sealKey(lessonId, payload);
    let held = sealedByLesson.get(lessonId);
    if (!held) { // F5 dan keyin xotira bo'sh — saqlovdan tiklaymiz
      try { held = JSON.parse(store()?.getItem(SEAL_KEY(lessonId)) || 'null'); } catch { held = null; }
      if (held && held.key && held.json) sealedByLesson.set(lessonId, held); else held = null;
    }
    if (held && held.key === key) return JSON.parse(held.json);
    const rec = { key, json: JSON.stringify(capPayload(payload)) }; // F-0924-20: hajm-shifti muhrdan OLDIN — muhr qisqartirilgan mazmunni oladi
    sealedByLesson.set(lessonId, rec);
    try { store()?.setItem(SEAL_KEY(lessonId), JSON.stringify(rec)); } catch { /* jim */ }
    return JSON.parse(rec.json);
  } catch { return payload; }
}
/** Dars ochilganda (har mount) XOTIRADAGI muhr tozalanadi; saqlov qoladi — o'sha urinish qayta yuklansa yuk o'zgarmaydi. */
export function unsealPayload(lessonId) { sealedByLesson.delete(lessonId); }

/** Test uchun: hozirgi holatni ko'rish. */
export const _detailsState = () => ({ attemptsByLesson, earnedAtByLesson, arenaByLesson });
/** Test uchun: «sahifa yangilandi» — xotira unutiladi, saqlov qoladi. */
export const _forgetMemory = (lessonId) => { attemptsByLesson.delete(lessonId); earnedAtByLesson.delete(lessonId); arenaByLesson.delete(lessonId); loaded.delete(lessonId); };

/**
 * onFinished payload'iga qo'shiladigan obyekt.
 * @param {{ lessonId: string, screenMeta: Array<{id?:string, scored?:boolean}>, answers: Record<number, any>|any[],
 *           earned?: Set<string>|string[], achievements?: Record<string, {name?:string, desc?:any}>, lang?: 'uz'|'ru', now?: number,
 *           arenaBank?: Array<{q?:any, question?:any, opts?:any[], options?:any[], correct?:number}> }} p
 *   arenaBank — darsning QUIZ_BANK'i (matnlar uchun, ixtiyoriy); berilmasa arena savollari matnsiz (id + variant raqami) ketadi.
 * @returns {{ lang: 'uz'|'ru', questions: object[], achievements: object[] }}
 */
export function buildResultDetails({ lessonId, screenMeta, answers, earned, achievements, lang: langIn, now, arenaBank, firstPass, lastAnswers, startedAt: startedIn, totalScreens: totalIn } = {}) {
  const lang = langIn === 'ru' || langIn === 'uz' ? langIn : getLiveLang();
  const finish = now || Date.now();
  load(lessonId);
  const log = attemptsByLesson.get(lessonId) || new Map();
  const questions = [];
  (screenMeta || []).forEach((meta, i) => {
    if (!meta || !meta.scored) return;
    const a = answers && answers[i];
    if (!a || typeof a !== 'object' || !Number.isInteger(a.picked)) return; // javob berilmagan (yoki faqat mentor ochgan)
    if (questions.length >= LIM.questions) return;
    const correctIdx = Number.isInteger(a.correctIndex) ? a.correctIndex : (Number.isInteger(a.correctIdx) ? a.correctIdx : null);
    const raw = (log.get(i) || []).slice().sort((x, y) => x.at - y.at).slice(0, LIM.attempts);
    const options = Array.isArray(a.options) ? a.options.slice(0, LIM.options).map((o) => optText(o, lang).slice(0, LIM.text)) : undefined;
    const correct = a.correct === true;                                   // ball: birinchi urinish (dars qotirib qo'yadi)
    const last = Number.isInteger(a.lastPicked) ? a.lastPicked : a.picked; // oxirgi tanlov
    const eventually = correctIdx !== null ? last === correctIdx : a.solved === true; // oxirida to'g'riga yetganmi (dars-dalili)
    const baseAt = Number.isInteger(a.at) ? a.at : finish;
    // Tarix yo'q (boshqa qurilma / eski saqlov): dars-obyektidan tiklanadi. Birinchi xato + oxirida to'g'ri bo'lsa —
    // birinchi urinish varianti noma'lum (-1), ikkinchisi oxirgi tanlov; aks holda bitta urinish.
    const fallback = correct || !eventually
      ? [{ option: last, answer: cut(a.studentAnswer, LIM.text), elapsed_ms: 0, at: baseAt }]
      : [{ option: -1, elapsed_ms: 0, at: baseAt, correct: false }, { option: last, answer: cut(a.studentAnswer, LIM.text), elapsed_ms: 0, at: baseAt, correct: true }];
    const attempts = (raw.length ? raw : fallback)
      .map((t, n) => {
        const o = { n: n + 1, option: t.option, correct: typeof t.correct === 'boolean' ? t.correct : (correctIdx !== null ? t.option === correctIdx : false), elapsed_ms: t.elapsed_ms, at: iso(t.at) };
        const ans = t.answer ?? (options && t.option >= 0 ? options[t.option] : undefined);
        if (typeof ans === 'string') o.answer = ans.slice(0, LIM.text);
        return o;
      });
    // Invariant (server bilan bir xil): birinchi urinish = ball. Darsning `correct` maydoni asos, tarix unga moslanadi.
    if (attempts[0]) attempts[0].correct = correct;
    // Variant-indekssiz savol (correctIdx yo'q): dars «yechildi» desa, oxirgi urinish yechgan hisoblanadi.
    if (correctIdx === null && eventually && !attempts.some((t) => t.correct)) attempts[attempts.length - 1].correct = true;
    const q = {
      question_id: (meta.id && String(meta.id)) || `s${i}`,
      kind: 'test',
      order: questions.length + 1,
      correct,
      solved: attempts.some((t) => t.correct), // F-0909-03: dars bayrog'i emas, urinish-dalili (server result-builder.js:356 bilan bir xil)
      attempts,
    };
    const qt = cut(typeof a.question === 'string' ? a.question : optText(a.question, lang), LIM.text);
    if (qt) q.question = qt;
    if (options) q.options = options;
    if (correctIdx !== null && correctIdx >= 0 && correctIdx <= 5) q.correct_option = correctIdx;
    const ca = cut(typeof a.correctAnswer === 'string' ? a.correctAnswer : (options && correctIdx !== null ? options[correctIdx] : undefined), LIM.text);
    if (ca) q.correct_answer = ca;
    // LMS shartnomasi (TZ_LESSON_RESULT_DETAILS_RU, QuestionResult.required): question · options (≥2) · correct_option ·
    // correct_answer MAJBURIY. Variantsiz maxsus test-ekran (tartiblash, yozma kod) ko'p variantli savol EMAS — detallarga
    // KIRMAYDI, ball `correctAnswers`/`totalQuestions` orqali ketadi (B to'lqin tekshiruvi Y1, 19.09: T9 dan keyin `picked`
    // 0/1 bo'lib variantsiz yozuv chiqa boshlagan; Bot-darslar s15 da undan oldin ham chiqardi). `QuestionScreen` (427 chaqiruv)
    // doim savol + variantlarni + `correctIndex` ni beradi (304 `onAnswer` chaqiruvi). Maxsus ekranda `correctIndex` yo'q —
    // ba'zilarida `options` (bo'lak yorliqlari) bor (Y1b, 2-tekshiruv 19.09: FullSystemProject · MobileAppPractice ·
    // SystemArchitecture s15) — `correct_option` majburiy bo'lgani uchun ajratuvchi `correctIndex`.
    if (correctIdx === null) return;
    questions.push(q);
  });

  // ARENA (2026-09-10): testlardan keyin, savol-raqami bo'yicha; bitta urinish; ballga kirmaydi
  const arena = [...(arenaByLesson.get(lessonId) || new Map()).entries()].sort((x, y) => x[0] - y[0]);
  for (const [qi, e] of arena) {
    if (questions.length >= LIM.questions) break;
    const bank = Array.isArray(arenaBank) ? arenaBank[qi] : null;
    const rawOpts = bank && (Array.isArray(bank.opts) ? bank.opts : (Array.isArray(bank.options) ? bank.options : null));
    const options = rawOpts ? rawOpts.slice(0, LIM.options).map((o) => optText(o, lang).slice(0, LIM.text)) : undefined;
    const correctIdx = bank && Number.isInteger(bank.correct) ? bank.correct : null;
    const attempt = { n: 1, option: e.option, correct: e.correct, elapsed_ms: e.elapsed_ms, at: iso(e.at) };
    if (options && e.option >= 0 && e.option < options.length) attempt.answer = options[e.option];
    const q = { question_id: `quiz-${qi}`, kind: 'arena', order: questions.length + 1, correct: e.correct, solved: e.correct, attempts: [attempt] };
    const qt = bank ? cut(typeof (bank.q ?? bank.question) === 'string' ? (bank.q ?? bank.question) : optText(bank.q ?? bank.question, lang), LIM.text) : undefined;
    if (qt) q.question = qt;
    if (options) q.options = options;
    if (correctIdx !== null && correctIdx >= 0 && correctIdx <= 5) q.correct_option = correctIdx;
    if (options && correctIdx !== null && options[correctIdx]) q.correct_answer = options[correctIdx];
    questions.push(q);
  }

  const at = earnedAtByLesson.get(lessonId) || new Map();
  const seen = new Set();
  const list = [];
  for (const raw of (earned instanceof Set ? [...earned] : (Array.isArray(earned) ? earned : []))) {
    const id = String(raw).toLowerCase();
    if (!/^[a-z0-9_-]{1,32}$/.test(id) || seen.has(id)) continue;
    seen.add(id);
    const def = (achievements && (achievements[raw] || achievements[id])) || null;
    const desc = def && def.desc;
    const title = typeof desc === 'string' ? desc : (desc && (desc[lang] || desc.uz)) || (def && def.name) || id;
    list.push({ id, name: String((def && def.name) || id).slice(0, LIM.name), title: String(title).slice(0, LIM.title), earned_at: iso(at.get(String(raw)) ?? at.get(id) ?? finish) });
  }
  list.sort((x, y) => (x.earned_at < y.earned_at ? -1 : x.earned_at > y.earned_at ? 1 : 0));
  // ── v2 maydonlar (F-0924-20): «Qaytadan», xato ro'yxati, ekranlar soni, vaqtlar ────────────────────────────────
  // Manba: dars `finishLesson` boshida `progClear` chaqiradi — u tozalashdan OLDIN oxirgi ccProgress'ni shu modulga beradi
  // (noteProgressCleared). Dars istasa `firstPass`/`lastAnswers`/`startedAt`/`totalScreens` ni o'zi ham uzatadi (ustun).
  const prog = clearedProgress.get(lessonId) || null;
  const fp = firstPass !== undefined ? firstPass : (prog ? (prog.firstPass ?? null) : undefined); // undefined = bilib bo'lmadi
  const started = Number.isFinite(startedIn) ? startedIn : (prog && Number.isFinite(prog.startedAt) ? prog.startedAt : null);
  const totalScreens = Number.isInteger(totalIn) ? totalIn : ((screenMeta || []).length || (prog && Number.isInteger(prog.total) ? prog.total : 0));
  const missed = questions.filter((q) => q.kind === 'test' && q.correct !== true).map((q) => q.question_id); // birinchi urinishda xato
  let retake = null; // null = saqlov yo'q, bilib bo'lmadi
  if (fp !== undefined) {
    if (fp && typeof fp === 'object') {
      const la = lastAnswers || (prog && prog.answers) || null; // «Qaytadan»dan keyingi (oxirgi) o'tish — asosiy raqamlar BIRINCHI o'tishdan (151-qonun)
      retake = { pressed: true, lastPass: passStats(screenMeta, la, started, finish) };
    } else retake = { pressed: false };
  }
  const out = { detailsVersion: 2, lang, questions, achievements: list.slice(0, LIM.achievements), missed, totalScreens, finishedAt: iso(finish), truncated: false, retake };
  if (started) out.startedAt = iso(started); // «Qaytadan» bo'lsa — oxirgi o'tish boshlanishi (birinchi o'tish boshi saqlanmaydi)
  return out;
}

/** Bitta o'tish bo'yicha qisqa ball: scored ekranlar → to'g'ri (birinchi urinish) soni, foiz, davomiylik. */
function passStats(screenMeta, answers, startedAt, finish) {
  const scored = []; (screenMeta || []).forEach((m, i) => { if (m && m.scored) scored.push(i); });
  const total = scored.length;
  const correct = answers && typeof answers === 'object' ? scored.filter((i) => answers[i] && answers[i].correct === true).length : null;
  const o = { totalQuestions: total, correctAnswers: correct, scorePercent: correct === null || !total ? null : Math.round((correct / total) * 100) };
  if (Number.isFinite(startedAt)) o.durationSec = Math.max(0, Math.floor((finish - startedAt) / 1000));
  return o;
}

// ── Yakun-konteksti (F-0924-20) ────────────────────────────────────────────────────────────────────────────────────
// Dars `finishLesson` boshida `progClear` chaqiradi (saqlov tozalanadi), payload undan KEYIN yig'iladi. Shuning uchun
// `progClear` (liveClient.js) tozalashdan oldin oxirgi holatni shu yerga beradi. 104 dars bir xil tartibda — darslarga tegilmaydi.
const clearedProgress = new Map(); // dars-ID → oxirgi ccProgress obyekti
export function noteProgressCleared(lessonId, prog) {
  if (!lessonId) return;
  if (prog && typeof prog === 'object') clearedProgress.set(lessonId, prog); // bo'sh saqlov (ikkinchi bosish) — oldingisi qoladi
}
