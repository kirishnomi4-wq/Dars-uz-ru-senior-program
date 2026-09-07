// Server-progressni dars ildizining holatiga qo'llash (bitta qator bilan ulanadi):
//   useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS });
// Qachon: LMS-token bilan kirilganda server progress qaytaradi (davom, ko'rish, toza boshlash) — har `seq` uchun bir marta.
// Ekran soni o'zgargan bo'lsa (dars yangilangan) javob-indekslar mos kelmaydi → toza boshlanadi (localStorage qoidasi bilan bir xil).
import { useEffect, useRef } from 'react';

export function useServerProgress(live, refs) {
  const seenRef = useRef(null);
  const p = live && live.serverProgress;
  useEffect(() => {
    if (!p || !p.seq || seenRef.current === p.seq) return;
    seenRef.current = p.seq;
    const { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total } = refs || {};
    let answers = p.answers && typeof p.answers === 'object' ? p.answers : {};
    let earned = Array.isArray(p.earned) ? p.earned : [];
    let screen = Number.isInteger(p.screen) ? p.screen : 0;
    if (p.total && total && p.total !== total) { answers = {}; earned = []; screen = 0; }
    if (total) screen = Math.min(Math.max(screen, 0), total - 1);
    if (typeof setAnswers === 'function') setAnswers(answers);
    if (typeof setScreen === 'function') setScreen(screen);
    if (earnedRef && typeof earnedRef === 'object') earnedRef.current = new Set(earned);
    if (typeof setEarned === 'function') setEarned(new Set(earned));
    if (startTimeRef && typeof startTimeRef === 'object') startTimeRef.current = Number.isInteger(p.startedAt) ? p.startedAt : Date.now();
  }, [p]); // eslint-disable-line
}
