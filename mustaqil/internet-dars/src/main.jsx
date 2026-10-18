import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import InternetLesson from './InternetLesson.jsx'

// MUSTAQIL NUSXA (2026-10-14): «Internet qanday ishlaydi» — bitta dars, tizimga daxilsiz.
// Parol / PIN / mentor kirishi yo'q (live rejim o'chiq — src/live/liveClient.js), server yo'q.
// Asosiy loyiha (src/, LMS, App.jsx) bilan hech qanday bog'liqlik yo'q — bu yerga qilingan ish u yerga o'tmaydi.
const LANG_TITLE = { uz: "Dars tili: o'zbekcha", ru: 'Язык урока: русский' }
const DOC_TITLE = { uz: 'Internet qanday ishlaydi', ru: 'Как устроен интернет' }

function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('dars_lang') === 'ru' ? 'ru' : 'uz' } catch { return 'uz' }
  })
  const pickLang = (l) => { setLang(l); try { localStorage.setItem('dars_lang', l) } catch {} }
  useEffect(() => {
    try { document.documentElement.lang = lang; document.title = DOC_TITLE[lang] } catch {}
  }, [lang])

  return (
    <>
      <InternetLesson lang={lang} />
      {/* UZ / RU almashtirgich (14.10, E varianti): 1200px dan keng ekranda — o'ng tepa burchak (dars maydonidan tashqarida);
          torroq ekranda — tepa markaz (y 1..25 — 360px da nishon y 27 dan boshlanadi): sarlavha, nishon va pastki panelga tegmaydi (22 ekran × 2 til o'lchandi).
          Telefonda kompilyator ochiq paytda yashirinadi (uning sarlavhasini yopardi). Til almashganda dars qayta yuklanmaydi. */}
      <style>{'.dars-lang { top: 1px; left: 50%; transform: translateX(-50%) } .dars-lang button { height: 20px } .dars-lang { padding: 1px !important } @media (min-width: 1200px) { .dars-lang { top: 8px; left: auto; right: 12px; transform: none } .dars-lang button { height: 26px } .dars-lang { padding: 2px !important } } @media (max-width: 1199px) { body:has(.dars-compiler) .dars-lang { display: none !important } }'}</style>
      <div className="dars-lang" role="group" aria-label="Til / Язык" style={{ position: 'fixed', zIndex: 9998, display: 'flex', gap: 2, padding: 2, borderRadius: 99, background: '#FFFFFF', border: '1px solid rgba(14,14,16,0.14)', boxShadow: '0 2px 10px rgba(58,53,48,0.16)' }}>
        {['uz', 'ru'].map(l => (
          <button key={l} title={LANG_TITLE[l]} aria-pressed={lang === l} onClick={() => pickLang(l)}
            style={{ minWidth: 40, border: 'none', borderRadius: 99, cursor: 'pointer', fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: '0.05em', background: lang === l ? '#0E0E10' : 'transparent', color: lang === l ? '#fff' : '#5A5A60', transition: 'background 0.15s, color 0.15s' }}>{l.toUpperCase()}</button>
        ))}
      </div>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
