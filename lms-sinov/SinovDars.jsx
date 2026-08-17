// ============================================================
//  SINOV DARSI — LMSga yuklanadigan fayl (TZ 10-bo'lim, 2-band).
//  Haqiqiy dars EMAS: birgina savolga javob beradi —
//  «tashqi modul manzil orqali yuklandimi va React bitta nusxadami?»
//
//  🔴 QANDAY ISHLATILADI
//  1) `sinov-modul.jsx` LMSga yuklanadi (course_artifacts).
//     Kengaytma `.jsx` — LMS yuklash oynasi faqat shu turni qabul qiladi.
//     Fayl ichida JSX YO'Q, u sof ESM; kengaytma shunchaki yorliq.
//  2) Yuklangach chiqqan MANZIL quyidagi import qatoriga yoziladi.
//  3) Shu fayl sinov darsi sifatida yuklanadi va ochiladi.
//
//  Kutilgan natija — pastdagi «KUTILGAN NATIJA» bo'limida.
// ============================================================
import React, { useState, useEffect } from 'react';

// Modul LMSga yuklangan va shu manzilda turibdi (2026-08-12, tekshirilgan).
import SinovModul, { checks, SINOV_VERSIYA } from 'https://go.coddycamp.uz/uploads/course_artifacts/2270fa1dcbebe770b3b8158dc8ff3265.jsx';

const LESSON_META = { lessonId: 'lms-sinov-01', lessonTitle: { uz: 'LMS tashqi-modul sinovi' } };

const T = { bg: '#F7F6F3', ink: '#1B1630', ink2: '#565073', ok: '#12A968', err: '#E5484D', line: '#E7E3F4' };

export default function SinovDars() {
  const [holat, setHolat] = useState([]);

  useEffect(() => {
    const n = [];
    // T-1: modul yuklandimi (import muvaffaqiyatli bo'lsa, bu kod umuman ishga tushadi)
    n.push({ id: 'T-1', nom: 'Modul yuklandi', ok: typeof SinovModul === 'function' });
    // Eksportlar joyidami
    n.push({ id: 'T-1b', nom: 'checks eksporti keldi', ok: !!checks && typeof checks.bor === 'function' });
    n.push({ id: 'T-1c', nom: 'Versiya o‘qildi: ' + String(SINOV_VERSIYA), ok: !!SINOV_VERSIYA });
    // React nusxasi: modul va dars bir xil React'ni ko'rayaptimi
    n.push({ id: 'T-2a', nom: 'Darsda React bor', ok: !!React && !!React.version });
    setHolat(n);
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: T.bg, minHeight: '100vh', padding: '32px' }}>
      <h1 style={{ fontSize: '22px', color: T.ink, margin: '0 0 6px' }}>LMS tashqi-modul sinovi</h1>
      <p style={{ fontSize: '13px', color: T.ink2, margin: '0 0 22px' }}>
        React versiyasi: <b>{React.version}</b> · dars: <b>{LESSON_META.lessonId}</b>
      </p>

      <div style={{ background: '#fff', border: `1px solid ${T.line}`, borderRadius: '12px', padding: '16px', maxWidth: '560px', marginBottom: '22px' }}>
        {holat.map((x) => (
          <p key={x.id} style={{ margin: '0 0 8px', fontSize: '14px', color: x.ok ? T.ok : T.err }}>
            {x.ok ? '✅' : '🔴'} <b>{x.id}</b> — {x.nom}
          </p>
        ))}
      </div>

      {/* T-2: tugma bosilganda hisob o'zgarsa — React bitta nusxada */}
      <SinovModul />

      <p style={{ fontSize: '12px', color: T.ink2, marginTop: '22px', maxWidth: '560px', lineHeight: 1.6 }}>
        <b>Kutilgan natija:</b> tepadagi to‘rt qator ham ✅ bo‘ladi; pastdagi qizil ramkali quti
        ko‘rinadi; «Bosing» tugmasi bosilganda hisob 0 → 1 → 2 ga o‘sadi va yashil qator chiqadi.
        Konsolda xato bo‘lmaydi. Agar «Invalid hook call» chiqsa — React ikki nusxada.
      </p>
    </div>
  );
}
