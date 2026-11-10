// F-1109-07 (10.11.2026): analitika yozuvi doim UZ-etalon (RU_I18N_SPEC), til — `lang`. 51 darsda RU rejimda yuk ruscha yoki
// aralash ketardi — markaziy tuzatish: serverga yoziladigan urinish matni (recordAttempt) shu yerda o'zbekchaga keltiriladi.
// Xarita — avtomatik `questionTextUz.js` (darsning UZ rejimdagi o'z yuki). 172 dars fayliga tegilmaydi.
// Variantlar dars tartibida (aralashtirilmaydi — 51 darsda tekshirilgan) → tanlangan / to'g'ri javob RAQAM bo'yicha olinadi.
import { QT_UZ } from './questionTextUz.js';

const txt = (v, lang) => {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (v && typeof v === 'object' && !Array.isArray(v) && (typeof v.uz === 'string' || typeof v.ru === 'string')) return lang === 'ru' ? (v.ru ?? v.uz) : (v.uz ?? v.ru);
  return undefined;
};

/** texts: { question, options, picked, correct, lang } · picked: variant raqami. RU bo'lmasa yoki xaritada yo'q — o'zgarmaydi. */
export function uzEtalon(lessonId, questionId, texts, picked) {
  if (!texts || typeof texts !== 'object' || texts.lang !== 'ru') return texts;
  const e = QT_UZ[lessonId] && QT_UZ[lessonId][questionId];
  if (!e) return texts;
  const [q, opts] = e;
  const ro = Array.isArray(texts.options) ? texts.options.map((o) => txt(o, 'ru')) : null;
  if (!ro || !Array.isArray(opts) || opts.length !== ro.length) return { ...texts, question: q }; // variantlar soni mos emas — faqat savol
  const at = (v) => { const s = txt(v, 'ru'); return s === undefined ? -1 : ro.indexOf(s); };
  const pi = Number.isInteger(picked) && picked >= 0 && picked < opts.length && (texts.picked === undefined || ro[picked] === txt(texts.picked, 'ru')) ? picked : at(texts.picked);
  const ci = at(texts.correct);
  const out = { ...texts, question: q, options: opts.slice() };
  if (pi >= 0) out.picked = opts[pi]; else if (texts.picked !== undefined) delete out.picked; // tanib bo'lmadi — noto'g'ri tildagi matn yozilmaydi
  if (ci >= 0) out.correct = opts[ci]; else if (texts.correct !== undefined) delete out.correct;
  return out;
}
