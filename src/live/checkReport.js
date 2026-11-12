// F-1112-01 (Shahzoda 05.11 §3б/§3в): dars ichidagi tekshiriladigan topshiriq — har tekshirish alohida urinish.
// Umumiy komponentlar (QTartib …) va darslar `reportCheck({ correct, text })` ni chaqiradi; uni joriy dars sessiyasi
// (useLiveSession) ro'yxatdan o'tkazadi va serverga `record_practice` (checked, correct, matn ≤300) bilan yozadi —
// ekran = o'quvchining joriy ekrani, id = SCREEN_META dagi doimiy id. Sessiya yo'q / LMS'siz / mentor / preview — jim (hech narsa qilmaydi).
// Komponentlar dars kontekstidan tashqarida (portal) ham ishlashi uchun modul darajasida: bir sahifada bitta dars.

export const CHECK_TEXT_MAX = 300;
let reporter = null;

/** useLiveSession chaqiradi. Qaytaradi: tozalash funksiyasi (faqat o'zi o'rnatgan bo'lsa o'chiradi). */
export function setCheckReporter(fn) {
  reporter = typeof fn === 'function' ? fn : null;
  return () => { if (reporter === fn) reporter = null; };
}

/** Matnni yozuvga tayyorlash: satr — o'zi; massiv/obyekt (bir necha maydonli javob) — satr qiymatlari « | » bilan;
 *  boshqa tur — null. Bo'shliqlar qisqartiriladi; 300 belgigacha. */
export function checkText(v) {
  let raw = v;
  if (Array.isArray(v)) raw = v.filter((x) => typeof x === 'string' && x.trim()).join(' | ');
  else if (v && typeof v === 'object') raw = Object.values(v).filter((x) => typeof x === 'string' && x.trim()).join(' | ');
  if (typeof raw !== 'string') return null;
  const t = raw.replace(/\s+/g, ' ').trim();
  return t ? t.slice(0, CHECK_TEXT_MAX) : null;
}

/** Tartiblash topshirig'i matni: joylashtirilgan bo'laklar tartibi « → » bilan. Yorliq satr bo'lsa — o'zi, `{ uz, ru }` bo'lsa —
 *  o'zbekcha etalon (uz/ru o'quvchilarning bir xil javobi bir matnga tushsin, F-1109-07 qoidasi), aks holda bo'lak id'si. */
export function checkOrderText(slots, items) {
  const byId = new Map((Array.isArray(items) ? items : []).map((x) => [x && x.id, x]));
  return (Array.isArray(slots) ? slots : []).map((id) => {
    const l = byId.get(id) && byId.get(id).label;
    if (typeof l === 'string') return l;
    if (l && typeof l === 'object' && typeof l.uz === 'string') return l.uz;
    return String(id);
  }).join(' → ');
}

/**
 * Bitta tekshirish = bitta urinish.
 * @param {{ correct: boolean, text?: string|object|null, id?: string, sub?: string, screen?: number }} r
 *   screen — ekran raqami aniq berilsa (masalan ekrandan chiqishda), joriy ekran o'rniga shu ishlatiladi.
 *   id — to'liq topshiriq id'si; berilmasa joriy ekranning SCREEN_META id'si, `sub` bo'lsa unga «:sub» qo'shiladi
 *   (bir ekranda bir nechta maydon — masalan pitch bo'laklari).
 * @returns {boolean} yuborishga uzatildimi (sessiya bor-yo'qligi; tarmoq natijasi emas)
 */
export function reportCheck(r) {
  if (!reporter || !r || typeof r.correct !== 'boolean') return false;
  const sub = typeof r.sub === 'string' || typeof r.sub === 'number' ? String(r.sub).slice(0, 24) : null;
  const screen = Number.isInteger(r.screen) && r.screen >= 0 ? r.screen : null;
  try { reporter({ correct: r.correct, text: checkText(r.text), id: typeof r.id === 'string' && r.id ? r.id.slice(0, 64) : null, sub, screen }); return true; }
  catch { return false; }
}
