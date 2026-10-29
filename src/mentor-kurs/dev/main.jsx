// Dev-harness (faqat lokal): darsni platformadagi kabi mount qiladi — { studentName, lang, onFinished }.
// URL: /mentor-kurs.html?dars=nest-01&s=5  (s — darsni N-ekranda ochish, faqat dev)
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const DARSLAR = {
  'nest-01': () => import('../NestArchMentorLesson.jsx'),
};

function Harness() {
  const q = new URLSearchParams(location.search);
  const key = q.get('dars') || 'nest-01';
  const startAt = q.get('s') != null ? Number(q.get('s')) : undefined;
  const [Comp, setComp] = useState(null);
  const [err, setErr] = useState('');
  const [payload, setPayload] = useState(null);
  useEffect(() => {
    const load = DARSLAR[key];
    if (!load) { setErr(`dars yo'q: ${key}`); return; }
    load().then((m) => setComp(() => m.default)).catch((e) => setErr(String(e && e.message || e)));
  }, [key]);
  if (err) return <pre style={{ padding: 20, color: '#b00' }}>{err}</pre>;
  if (!Comp) return <div style={{ padding: 20, fontFamily: 'monospace' }}>yuklanmoqda…</div>;
  return (
    <>
      <Comp studentName="Mentor" lang="uz" startAt={startAt} onFinished={(p) => { window.__onFinished = p; setPayload(p); }} />
      {payload && <pre style={{ position: 'fixed', bottom: 8, left: 8, zIndex: 9999, maxWidth: 420, maxHeight: 180, overflow: 'auto', background: '#111', color: '#9f9', font: '11px/1.4 monospace', padding: 8, borderRadius: 6 }}>onFinished ✓ {JSON.stringify(payload, null, 1)}</pre>}
    </>
  );
}
createRoot(document.getElementById('root')).render(<Harness />);
