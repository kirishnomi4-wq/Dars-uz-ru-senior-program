// LMS-simulyator (faqat dev): darsni LMS kabi mount qiladi — lang, onFinished va KECHIKIB keladigan liveToken.
// URL: /lms-harness.html?lesson=m1-01&lang=uz&delay=600#token=<JWT>
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

// Harness'da bor darslar (kalit = saytdagi #/lesson/<kalit>). Kerak bo'lganda qo'shiladi.
const LESSONS = {
  'm1-01': () => import('../1-Modull/InternetLesson.jsx'),
};

function Harness() {
  const q = new URLSearchParams(location.search);
  const key = q.get('lesson') || 'm1-01';
  const lang = q.get('lang') === 'ru' ? 'ru' : 'uz';
  const delay = Math.max(0, Number(q.get('delay') || 600));
  const token = new URLSearchParams(location.hash.replace(/^#/, '')).get('token') || null;

  const [Comp, setComp] = useState(null);
  const [liveToken, setLiveToken] = useState(null);
  const [finished, setFinished] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const load = LESSONS[key];
    if (!load) { setLoadError(`harness'da bunday dars yo'q: ${key}`); return; }
    load().then((m) => setComp(() => m.default)).catch((e) => setLoadError(String(e?.message || e)));
  }, [key]);

  // LMS xatti-harakati: token birinchi render'da null, keyin async keladi (LMS v1.2 §4.2)
  useEffect(() => {
    if (!token) return undefined;
    const t = setTimeout(() => setLiveToken(token), delay);
    return () => clearTimeout(t);
  }, [token, delay]);

  const badge = { position: 'fixed', bottom: 6, left: 6, zIndex: 99999, font: '12px/1.4 monospace', background: '#222', color: '#fff', padding: '4px 8px', borderRadius: 6, opacity: 0.85 };
  if (loadError) return <div style={{ padding: 20, fontFamily: 'monospace', color: '#b00' }}>{loadError}</div>;
  if (!Comp) return <div style={{ padding: 20, fontFamily: 'monospace' }}>yuklanmoqda…</div>;
  return (
    <>
      <div data-harness style={badge}>
        LMS-simulyator · {key} · {lang} · token: {token ? (liveToken ? 'berildi' : 'kutilmoqda') : "yo'q"}{finished ? ' · onFinished ✓' : ''}
      </div>
      <Comp lang={lang} liveToken={liveToken} onFinished={() => setFinished(true)} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<Harness />);
