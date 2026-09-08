// Natija-detallari — `onFinished` payload'iga LMS uchun TZ_LESSON_RESULT_DETAILS_RU §4 shaklidagi obyekt:
//   { lang, questions[], achievements[] }  (Axadulla 2026-09-08: School API kontrakti kengaymaydi, detallar onFinished orqali).
// Manbalar (darsga tegmasdan yig'iladi):
//   · answers[i] — darsning o'z javob-obyekti (question, options, correctIndex, correctAnswer, picked, studentAnswer, correct, solved)
//   · urinishlar tarixi — useLiveSession.recordAttempt har bosishda shu modulga ham yozadi (server yo'q bo'lsa ham)
//   · yutuq-vaqtlari — progressSync har saqlovda `earned` ro'yxatini ko'radi, birinchi ko'ringan vaqt yoziladi
// Server (result-builder.js) bilan bir xil chegaralar: 200 savol · 10 urinish · 6 variant · 300 belgi · 20 yutuq · nom 40 · ta'rif 200.
import { getLiveLang } from './i18n.js';

const LIM = { questions: 200, attempts: 10, options: 6, text: 300, achievements: 20, name: 40, title: 200, elapsed: 3_600_000 };
const cut = (v, n) => (typeof v === 'string' ? v.slice(0, n) : undefined);
const iso = (t) => new Date(t || Date.now()).toISOString().replace(/\.\d{3}Z$/, 'Z');
const optText = (o, lang) => (o && typeof o === 'object' ? String(o[lang] ?? o.uz ?? '') : String(o ?? ''));

/** @type {Map<string, Map<number, Array<{option:number, answer?:string, elapsed_ms:number, at:number}>>>} */
const attemptsByLesson = new Map();
/** @type {Map<string, Map<string, number>>} */
const earnedAtByLesson = new Map();

/** recordAttempt'dan: har bosish (rejimdan qat'i nazar). */
export function logAttempt(lessonId, screenIdx, { picked, texts, elapsedMs } = {}) {
  if (!lessonId || !Number.isInteger(screenIdx)) return;
  if (!attemptsByLesson.has(lessonId)) attemptsByLesson.set(lessonId, new Map());
  const m = attemptsByLesson.get(lessonId);
  if (!m.has(screenIdx)) m.set(screenIdx, []);
  const list = m.get(screenIdx);
  if (list.length >= LIM.attempts) return;
  list.push({ option: Number.isInteger(picked) ? picked : -1, answer: cut(texts && texts.picked, LIM.text), elapsed_ms: Math.max(0, Math.min(LIM.elapsed, Math.round(elapsedMs || 0))), at: Date.now() });
}

/** progressSync'dan: earned ro'yxati — har id birinchi ko'ringan vaqt (tiklangan saqlovdagilar ham «hozir» bo'ladi — ma'lum soddalik). */
export function noteEarned(lessonId, ids) {
  if (!lessonId || !Array.isArray(ids)) return;
  if (!earnedAtByLesson.has(lessonId)) earnedAtByLesson.set(lessonId, new Map());
  const m = earnedAtByLesson.get(lessonId);
  const now = Date.now();
  for (const raw of ids) { const id = String(raw); if (!m.has(id)) m.set(id, now); }
}

/** Qaytadan boshlashda (restart) tarix tozalanadi. */
export function resetResultDetails(lessonId) { attemptsByLesson.delete(lessonId); earnedAtByLesson.delete(lessonId); }

/** Test uchun: hozirgi holatni ko'rish. */
export const _detailsState = () => ({ attemptsByLesson, earnedAtByLesson });

/**
 * onFinished payload'iga qo'shiladigan obyekt.
 * @param {{ lessonId: string, screenMeta: Array<{id?:string, scored?:boolean}>, answers: Record<number, any>|any[],
 *           earned?: Set<string>|string[], achievements?: Record<string, {name?:string, desc?:any}>, lang?: 'uz'|'ru', now?: number }} p
 * @returns {{ lang: 'uz'|'ru', questions: object[], achievements: object[] }}
 */
export function buildResultDetails({ lessonId, screenMeta, answers, earned, achievements, lang: langIn, now } = {}) {
  const lang = langIn === 'ru' || langIn === 'uz' ? langIn : getLiveLang();
  const finish = now || Date.now();
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
    const attempts = (raw.length ? raw : [{ option: a.picked, answer: cut(a.studentAnswer, LIM.text), elapsed_ms: 0, at: Number.isInteger(a.at) ? a.at : finish }])
      .map((t, n) => {
        const o = { n: n + 1, option: t.option, correct: correctIdx !== null ? t.option === correctIdx : (n === 0 ? a.correct === true : false), elapsed_ms: t.elapsed_ms, at: iso(t.at) };
        const ans = t.answer ?? (options && t.option >= 0 ? options[t.option] : undefined);
        if (typeof ans === 'string') o.answer = ans.slice(0, LIM.text);
        return o;
      });
    const correct = a.correct === true;
    // Invariant (server bilan bir xil): birinchi urinish = ball. Darsning `correct` maydoni asos, tarix unga moslanadi.
    if (attempts[0]) attempts[0].correct = correct;
    const q = {
      question_id: (meta.id && String(meta.id)) || `s${i}`,
      kind: 'test',
      order: questions.length + 1,
      correct,
      solved: a.solved === true || correct || attempts.some((t) => t.correct),
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
