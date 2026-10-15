// LMS /preview simulyatori (faqat dev, F-1015). Kontrakt §2.2: LMS preview'da mentor JWT so'ramaydi —
// liveToken doim null, previewRunId har sahifa ochilishida (va F5 da) yangi, re-render'da o'zgarmaydi.
//
// URL parametrlari:
//   jsx=<yig'ilgan dars manzili>   — build-lms chiqishi (o'ram bilan: prop shu yerdan umumiy modulga yetadi)
//   visit_mode=preview             — LMS beradigan belgi (yo'q bo'lsa — oddiy LMS kabi, #token bilan)
//   lang=uz|ru
//   prop=preview                   — SINOV: URL'da visit_mode YO'Q, lekin prop beriladi (yagona manba yolg'iz)
//   urlOnly=1                      — SINOV: URL'da visit_mode BOR, prop BERILMAYDI — preview YOQILMASLIGI kerak (F-1015-13)
//   global=1                       — SINOV: window.__CC_VISIT_MODE__ qo'yiladi — preview YOQILMASLIGI kerak (F-1015-09)
//   forceToken=1                   — preview'da ham #token beriladi (CRM xato qilsa: preview ustun bo'lishi kerak)
//   id=<lessonId>&seedScreen=N&total=T — SINOV: dars yuklangach ccProgress ekrani N qilib yoziladi (T = darsning ekranlar soni)
//                                     (preview'da bu varaq xotirasiga tushadi — haqiqiy saqlovga emas)
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const q = new URLSearchParams(location.search);
// LMS URL'ni o'qib prop qilib uzatadi — preview faqat prop orqali darsga yetadi
const PREVIEW = (q.get('visit_mode') === 'preview' && q.get('urlOnly') !== '1') || q.get('prop') === 'preview';
const RUN_ID = crypto.randomUUID(); // modul darajasida — sahifa umrida bitta, F5 da yangi
const token = new URLSearchParams(location.hash.replace(/^#/, '')).get('token') || null;
if (q.get('global') === '1') window.__CC_VISIT_MODE__ = 'preview';
window.__previewRunId = RUN_ID;
window.__finishedCalls = 0;

function Page() {
  const [Comp, setComp] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    const jsx = q.get('jsx');
    if (!jsx) { setErr('jsx parametri kerak'); return; }
    import(/* @vite-ignore */ jsx).then((m) => {
      const id = q.get('id'), seed = Number(q.get('seedScreen'));
      if (id && Number.isInteger(seed)) {
        // Yagona manba — prop: xotira-qatlami o'ram chizilganda o'rnatiladi. Urug' qatlamga tushishi uchun o'ram bir marta
        // ODDIY funksiya sifatida chaqiriladi (u hook ishlatmaydi — faqat notePreviewProps). Faqat sinov yo'li.
        // O'ramsiz (eski/baza) yig'mada default — darsning o'zi: uni funksiya sifatida chaqirib bo'lmaydi (hook'lar)
        if (PREVIEW && m.default.name === 'CcLessonEntry') m.default({ visitMode: 'preview', previewRunId: RUN_ID });
        try { localStorage.setItem(`ccProgress:${id}`, JSON.stringify({ screen: seed, maxReached: seed, answers: {}, earned: [], startedAt: Date.now(), total: Number(q.get('total')), savedAt: Date.now() })); } catch { /* yopiq */ }
      }
      setComp(() => m.default);
    }).catch((e) => setErr(String(e?.message || e)));
  }, []);

  const lang = q.get('lang') === 'ru' ? 'ru' : 'uz';
  const props = PREVIEW
    ? { lang, visitMode: 'preview', previewRunId: RUN_ID, liveToken: q.get('forceToken') === '1' ? token : null, onFinished: () => { window.__finishedCalls++; } }
    : { lang, liveToken: token, onFinished: (p) => { window.__finishedCalls++; window.__onFinished = p; } };
  const badge = { position: 'fixed', bottom: 6, left: 6, zIndex: 99999, font: '12px/1.4 monospace', background: '#222', color: '#fff', padding: '4px 8px', borderRadius: 6, opacity: 0.85 };
  if (err) return <div style={{ padding: 20, fontFamily: 'monospace', color: '#b00' }}>{err}</div>;
  if (!Comp) return <div style={{ padding: 20, fontFamily: 'monospace' }}>yuklanmoqda…</div>;
  return (
    <>
      <div data-harness style={badge}>LMS {PREVIEW ? `preview · run ${RUN_ID.slice(0, 8)}` : 'oddiy'} · token: {props.liveToken ? 'berildi' : "yo'q"}</div>
      <Comp {...props} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<Page />);
