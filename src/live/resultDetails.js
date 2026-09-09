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
import { getLiveLang } from './i18n.js';

const LIM = { questions: 200, attempts: 10, options: 6, text: 300, achievements: 20, name: 40, title: 200, elapsed: 3_600_000 };
const cut = (v, n) => (typeof v === 'string' ? v.slice(0, n) : undefined);
const iso = (t) => new Date(t || Date.now()).toISOString().replace(/\.\d{3}Z$/, 'Z');
const optText = (o, lang) => (o && typeof o === 'object' ? String(o[lang] ?? o.uz ?? '') : String(o ?? ''));

/** @type {Map<string, Map<number, Array<{option:number, answer?:string, elapsed_ms:number, at:number}>>>} */
const attemptsByLesson = new Map();
/** @type {Map<string, Map<string, number>>} */
const earnedAtByLesson = new Map();

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
}
function persist(lessonId) {
  const st = store(); if (!st) return;
  const attempts = {};
  for (const [k, v] of attemptsByLesson.get(lessonId) || []) attempts[k] = v;
  const earnedAt = Object.fromEntries(earnedAtByLesson.get(lessonId) || []);
  try { st.setItem(KEY(lessonId), JSON.stringify({ v: 1, attempts, earnedAt })); } catch { /* kvota / private — jim */ }
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
  attemptsByLesson.delete(lessonId); earnedAtByLesson.delete(lessonId); loaded.delete(lessonId);
  try { store()?.removeItem(KEY(lessonId)); } catch { /* jim */ }
}

/** Test uchun: hozirgi holatni ko'rish. */
export const _detailsState = () => ({ attemptsByLesson, earnedAtByLesson });
/** Test uchun: «sahifa yangilandi» — xotira unutiladi, saqlov qoladi. */
export const _forgetMemory = (lessonId) => { attemptsByLesson.delete(lessonId); earnedAtByLesson.delete(lessonId); loaded.delete(lessonId); };

/**
 * onFinished payload'iga qo'shiladigan obyekt.
 * @param {{ lessonId: string, screenMeta: Array<{id?:string, scored?:boolean}>, answers: Record<number, any>|any[],
 *           earned?: Set<string>|string[], achievements?: Record<string, {name?:string, desc?:any}>, lang?: 'uz'|'ru', now?: number }} p
 * @returns {{ lang: 'uz'|'ru', questions: object[], achievements: object[] }}
 */
export function buildResultDetails({ lessonId, screenMeta, answers, earned, achievements, lang: langIn, now } = {}) {
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
    questions.push(q);
  });

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
  return { lang, questions, achievements: list.slice(0, LIM.achievements) };
}
