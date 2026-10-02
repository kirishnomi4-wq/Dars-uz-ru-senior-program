import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import InternetLesson from '../1-Modull/InternetLesson.jsx'

// «Internet qanday ishlaydi» (m1-01) QA-sayti (2026-09-30): bitta dars, katalogsiz — QA mustaqil ko'radi.
// LMS'ga yuklanmaydi. Dars tili cc_lang kalitida (asosiy App.jsx bilan bir xil), darsga lang prop bo'lib uzatiladi.
const LANG_TITLE = { uz: "Dars tili: o'zbekcha", ru: 'Язык урока: русский' }

function InternetDemoApp() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('cc_lang') === 'ru' ? 'ru' : 'uz' } catch { return 'uz' }
  })
  const pickLang = (l) => { setLang(l); try { localStorage.setItem('cc_lang', l) } catch {} }
  useEffect(() => { try { document.documentElement.lang = lang } catch {} }, [lang])

  return (
    <>
      <InternetLesson lang={lang} />
      {/* UZ-RU almashtirgich — pastki chap burchak, progress saqlanadi (dars remount bo'lmaydi).
          1180px dan tor ekranda darsning «Orqaga» tugmasi chapga suriladi (o'lchov: 768px da left 60) —
          almashtirgich pastki panel (.stage-nav, ~71px) ustiga ko'tariladi. */}
      <style>{'@media (max-width: 1180px) { .inet-lang { bottom: 84px !important } }'}</style>
      <div className="inet-lang" style={{ position: 'fixed', bottom: 14, left: 14, zIndex: 950, display: 'flex', borderRadius: 12, background: '#FFFFFF', boxShadow: '0 6px 18px -6px rgba(58,53,48,0.35)', overflow: 'hidden', opacity: 0.55, transition: 'opacity 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>
        {['uz', 'ru'].map(l => (
          <button key={l} title={LANG_TITLE[l]} onClick={() => pickLang(l)}
            style={{ width: 34, height: 40, border: 'none', cursor: 'pointer', fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 800, fontSize: 11.5, background: lang === l ? '#0E0E10' : 'transparent', color: lang === l ? '#fff' : '#5A5A60', transition: 'background 0.15s, color 0.15s' }}>{l.toUpperCase()}</button>
        ))}
      </div>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <InternetDemoApp />
  </React.StrictMode>,
)
