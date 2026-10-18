// ============================================================================
// useAutoNext — ARENA: javob ochilgandan keyin keyingi savolga AVTO o'tish.
// (F-0922-03, foydalanuvchi so'rovi 2026-09-22)
//
// MUAMMO: arenada savol vaqti (QUIZ_MS = 15 s) va vaqt tugaganda javobni ochish
// allaqachon avto ishlaydi. Qo'lda qolgan YAGONA o'tish — «javob ochildi →
// keyingi savol»: mentor har savolda tugma bosib turishi kerak edi.
//
// NEGA UMUMIY MODULDA: arena UI 97 darsda takrorlangan, mantiq esa bitta.
// Kutish vaqtini keyin o'zgartirish 97 faylda emas, SHU yerda bo'ladi.
//
// SOAT FAQAT MENTOR BRAUZERIDA YURADI. Sabab: `quiz_state` ni serverga mentor
// yozadi, o'quvchilar esa poll orqali ergashadi — bu mavjud naqsh (savol vaqti
// tugaganda ham aynan shunday: mentor `ctrl('r')` ni yuboradi). Agar har o'quvchi
// o'zi hisoblasa, ular bir-biridan uzilib ketardi.
//
// TICK SANALMAYDI — deadline timestamp bilan solishtiriladi. Fon oynada brauzer
// `setInterval`ni sekinlashtiradi; timestamp esa oyna qaytganda o'zini tuzatadi.
// (Arenadagi savol-taymeri ham aynan shu naqshda ishlaydi — `deadlineRef`.)
//
// IKKI MARTA O'TIB KETISHDAN QULF: mentor tugmani taymer bilan bir vaqtda bossa,
// `ctrl('q', qi + 1)` ikki marta ketib BITTA SAVOL TASHLAB KETILARDI. Shuning
// uchun qo'lda o'tish ham shu hookdan (`fireNow`) o'tadi va `firedRef` bir
// savolga faqat bitta o'tishga ruxsat beradi.
// ============================================================================
import { useEffect, useRef, useState } from 'react';

// Javob ochilgandan keyin keyingi savolgacha kutish (foydalanuvchi qarori 2026-09-22).
// 6 s — minimal halol raqam: o'quvchilar serverni 1200 ms'da bir so'raydi va arena
// kodida ustiga 700 ms kechikish-kompensatsiyasi bor; 2 s bo'lsa ba'zi o'quvchi javob
// ekranini 1 s'dan kam ko'rardi va nima xato qilganini tushunmay qolardi.
export const AUTO_NEXT_MS = 6000;

export function useAutoNext({ on, onFire, qKey }) {
  const [sec, setSec] = useState(null);    // ekrandagi sanoq; null = sanoq yurmaydi
  const [auto, setAuto] = useState(true);  // YOPISHQOQ: bir marta to'xtatilsa, arena oxirigacha o'chiq
  const firedRef = useRef(false);
  const fireRef = useRef(onFire);
  fireRef.current = onFire;

  // Yangi savol — o'tish qulfi ochiladi.
  useEffect(() => { firedRef.current = false; }, [qKey]);

  useEffect(() => {
    if (!on || !auto) { setSec(null); return undefined; }
    const deadline = Date.now() + AUTO_NEXT_MS;
    setSec(Math.ceil(AUTO_NEXT_MS / 1000));
    const iv = setInterval(() => {
      const rem = deadline - Date.now();
      if (rem > 0) { setSec(Math.ceil(rem / 1000)); return; }
      clearInterval(iv);
      setSec(null);
      if (!firedRef.current) { firedRef.current = true; fireRef.current(); }
    }, 200);
    return () => clearInterval(iv);
  }, [on, auto, qKey]);

  // Qo'lda o'tish — AYNAN BIR MARTA (yuqoridagi qulf izohiga qara).
  const fireNow = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    setSec(null);
    fireRef.current();
  };

  // Bir kadrlik teshikni yopamiz: React effektni CHIZILGANDAN KEYIN yurgizadi, ya'ni
  // sanoq birinchi kadrda `null` bo'lib, tugma bir lahza raqamsiz turardi (F-0922-03,
  // arena-sinovida CssLesson1 da tutilgan). Ko'rsatiladigan qiymat shu yerda hisoblanadi.
  const shown = on && auto ? (sec ?? Math.ceil(AUTO_NEXT_MS / 1000)) : null;

  return {
    sec: shown,
    auto,
    fireNow,
    pause: () => setAuto(false),
    resume: () => setAuto(true),
  };
}
