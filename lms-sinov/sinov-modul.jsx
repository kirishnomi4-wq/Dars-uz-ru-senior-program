// ============================================================
//  SINOV MODULI — LMS tashqi-modul yuklashini tekshirish uchun.
//  TZ: LMS_TASHQI_MODUL_TZ.md, 10-bo'lim («Sinov-vektor»).
//
//  Bu HAQIQIY kompilyator EMAS. Atayin kichik — vazifasi bitta savolga javob
//  berish: «LMS manzil orqali modulni yuklay oladimi va React BITTA nusxada
//  qoladimi?»
//
//  🔴 JSX YO'Q — sof ESM, faqat createElement. LMS bu faylni kompilyatsiya
//     qilmaydi, brauzer uni to'g'ridan-to'g'ri yuklaydi.
//  🔴 `react` dan boshqa hech narsa import qilinmaydi (TZ 9-bo'lim).
//
//  Nima uchun useState: agar LMS modulga O'Z React nusxasini bersa (ikki
//  nusxa), hook chaqiruvi darhol «Invalid hook call» beradi. Ya'ni T-2
//  sharti tugmani BIR marta bosishda ma'lum bo'ladi.
// ============================================================
import { createElement as h, useState } from 'react';

export const SINOV_VERSIYA = '1.0.0';

// `checks` — haqiqiy kompilyatordagi eksport shaklini takrorlaydi.
export const checks = {
  nomi: 'sinov-checks',
  bor: (matn, bolak) => String(matn || '').includes(bolak),
  soni: (matn, bolak) => String(matn || '').split(bolak).length - 1,
};

const S = {
  root: { fontFamily: 'system-ui, sans-serif', padding: '22px', border: '2px solid #FF4F28', borderRadius: '14px', maxWidth: '560px', background: '#FFF8F6' },
  badge: { display: 'inline-block', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: '#FF4F28', marginBottom: '10px' },
  title: { margin: '0 0 4px', fontSize: '20px', fontWeight: 800, color: '#1B1630' },
  sub: { margin: '0 0 14px', fontSize: '13px', color: '#565073' },
  btn: { fontFamily: 'inherit', fontSize: '15px', fontWeight: 700, padding: '10px 18px', borderRadius: '10px', border: 'none', background: '#FF4F28', color: '#fff', cursor: 'pointer' },
  ok: { margin: '14px 0 0', fontSize: '14px', fontWeight: 700, color: '#12A968' },
  wait: { margin: '14px 0 0', fontSize: '14px', color: '#9C97B4' },
  chk: { margin: '10px 0 0', fontSize: '12px', color: '#565073' },
};

export default function SinovModul() {
  const [hisob, setHisob] = useState(0);

  return h('div', { style: S.root },
    h('div', { style: S.badge }, 'TASHQI MODUL YUKLANDI'),
    h('p', { style: S.title }, 'Sinov moduli ishlayapti'),
    h('p', { style: S.sub }, 'Versiya ' + SINOV_VERSIYA + ' · checks: ' + Object.keys(checks).join(', ')),
    h('button', { style: S.btn, onClick: () => setHisob((x) => x + 1) }, 'Bosing — hisob: ' + hisob),
    h('p', { style: hisob > 0 ? S.ok : S.wait },
      hisob > 0
        ? '✅ React BITTA nusxada — hook ishladi (hisob ' + hisob + ')'
        : '⏳ Tugmani bosing: hisob o‘zgarsa, React bitta nusxada.'),
    h('p', { style: S.chk },
      'checks.bor("<h1>Salom</h1>", "<h1>") → ' + String(checks.bor('<h1>Salom</h1>', '<h1>'))),
  );
}
