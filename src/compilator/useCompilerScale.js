// ============================================================
//  useCompilerScale — kod oynasi (HtmlCompiler) uchun MASSHTAB
//  F-0824-08 · 2026-08-24
// ============================================================
//  MUAMMO. Kompilyator to'liq-ekran qobiqda, dars daraxtining ICHIDA ochiladi.
//  Qobiq `.lesson-root` ichida bo'lgani uchun ikki narsa noto'g'ri edi:
//
//   1) QO'SH ZOOM (baland ekran). `.lesson-root` ga `zoom: var(--lz,1)` qo'yilgan,
//      `.hc-root` ga ham. Ikkovi ko'payib, kompilyator lz x lz masshtabda chizilardi.
//      Naqsh bor edi — `zoom: calc(1 / var(--lz,1))` — lekin 30 qobiqdan atigi 6 tasida.
//
//   2) QIRQILISH (past ekran). Kompilyator geometriyasi qat'iy: `.hc-split` 62dvh,
//      qolgan qismlar piksel bilan ~360px va qisqarmaydi. Sig'ishi uchun ~1000 CSS px
//      kerak. Dars formulasi esa `Math.max(1, ...)` tufayli 1 dan PASTGA tushmaydi —
//      ya'ni noutbuk o'sha maydonni hech qachon ololmaydi va `.hc-root`
//      (justify-content:center + overflow:hidden) sarlavhani ham, "Davom etish" ni ham
//      ikki tomondan qirqib tashlardi.
//
//  YECHIM. Kompilyator tashqaridan ATIGI ikki narsani o'qiydi: `var(--lz,1)` va
//  ota-elementlarning zoom ko'paytmasi. Ikkalasi ham darsning qo'lida, demak
//  `HtmlCompiler.jsx` ga TEGMASDAN to'g'ri masshtab berish mumkin.
//
//  Hisob (H — oyna balandligi, L — darsning global --lz, doim >= 1):
//    yakuniy masshtab = L x Z x V,  balandlik = 100dvh / V  (ekranda H x L x Z)
//    ekranni aynan to'ldirishi uchun  L x Z = 1   ->   Z = 1/L
//    kompilyatorga ~1000 CSS px kerak:  H / V >= 1000  ->  V <= H/1000
//
//  Baland ekranda (H >= need) V = L olinadi — natija bugungi 6 tuzatilgan darsdagi
//  `calc(1 / var(--lz,1))` naqshi bilan PIKSEL-PIKSEL bir xil, ya'ni ular buzilmaydi.
//
//  🔴 Z ataylab RAQAM (calc/var EMAS). Agar `zoom: calc(1 / var(--lz,1))` yozilsa,
//  o'sha elementga qo'yilgan YANGI `--lz` ni o'qiydi va o'zini bekor qiladi.
//
//  🔴 `need` (1000) hozircha KODDAN hisoblangan, brauzerda o'lchanmagan. O'lchov:
//     const r = document.querySelector('.hc-root');
//     r.scrollHeight - r.clientHeight        // 0 dan katta bo'lsa — need ko'tariladi
//
//  Ishlatish (dars faylida, ScreenCoding ichida):
//     const hcScale = useCompilerScale();
//     ...
//     <div style={{ position:'fixed', inset:0, zIndex:2000, background:T.bg, ...hcScale }}>
//       <HtmlCompiler ... />
//     </div>
// ============================================================
import { useState, useEffect } from 'react';

// Kompilyator sig'ishi uchun kerak bo'ladigan ish-balandligi (CSS px).
export const HC_NEED = 1000;

const r3 = (n) => Math.round(n * 1000) / 1000;

// Darsning global --lz formulasi bilan AYNAN bir xil (dars fayllarida takrorlanadi).
// Bu yerda qayta hisoblanadi, chunki getComputedStyle o'zgaruvchini birinchi
// bo'yashdan oldin bermasligi mumkin.
const lessonLz = (W, H) => Math.min(1.5, Math.max(1, Math.min(W / 1920, H / 1000)));

const calc = (need) => {
  const W = window.innerWidth, H = window.innerHeight;
  const L = lessonLz(W, H);
  const V = H >= need ? L : Math.max(0.62, H / need);
  return { zoom: String(r3(1 / L)), '--lz': String(r3(V)) };
};

export function useCompilerScale(need = HC_NEED) {
  // Boshlang'ich qiymat DARROV hisoblanadi — aks holda birinchi kadrda qobiq
  // eski (qo'sh-zoomli) holatda chaqnab ketadi. SSR'da window yo'q — null qoladi.
  const [st, setSt] = useState(() => (typeof window === 'undefined' ? null : calc(need)));
  useEffect(() => {
    const upd = () => setSt(calc(need));
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, [need]);
  return st || {};
}
