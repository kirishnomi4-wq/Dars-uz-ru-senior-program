import React, { useState, useEffect, lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'

// Kompilyator QA-sayti (F-1001-91, 2026-10-01): 5 dars — maslahat ro'yxati, Emmet, CSS/JS maslahati
// ko'z bilan tekshiriladi. LMS'ga yuklanmaydi, katalog yo'q. Dars fayllariga tegilmagan.
const LESSONS = [
  { key: 'html1', title: 'HTML-1 (m1-03)', sub: "praktikada `<s` → faqat strong; `h6`; Emmet hali yo'q", comp: lazy(() => import('../1-Modull/Htmllesson1.jsx')) },
  { key: 'html2', title: 'HTML-2 (m1-04)', sub: "`<fo` → form, footer; `<input type=\"` qiymatlar; `form`+Tab", comp: lazy(() => import('../1-Modull/Htmllesson2.jsx')) },
  { key: 'css1', title: 'CSS-1 (m1-06)', sub: "style.css: `{ }` ichida `co` → color, `:` dan keyin qiymatlar", comp: lazy(() => import('../1-Modull/CssLesson1.jsx')) },
  { key: 'vscode', title: 'VS Code (m1-15)', sub: "`!`+Tab, `ul>li*3`+Tab, `div.card`+Tab", comp: lazy(() => import('../1-Modull/VsCodeLesson.jsx')) },
  { key: 'jsvars', title: "JS o'zgaruvchilar (m2-02)", sub: "script.js: `le`+Tab → let, `log`+Tab → console.log(); faqat Tab tanlaydi", comp: lazy(() => import('../2-Modull/JsVarsLesson.jsx')) },
]
const LANG_TITLE = { uz: "Dars tili: o'zbekcha", ru: 'Язык урока: русский' }

function DemoApp() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('cc_lang') === 'ru' ? 'ru' : 'uz' } catch { return 'uz' } })
  const [key, setKey] = useState(() => { try { return (location.hash || '').slice(1) || '' } catch { return '' } })
  const pickLang = (l) => { setLang(l); try { localStorage.setItem('cc_lang', l) } catch {} }
  useEffect(() => { try { document.documentElement.lang = lang } catch {} }, [lang])
  useEffect(() => { try { if ((location.hash || '').slice(1) !== key) location.hash = key } catch {} }, [key])
  useEffect(() => { const h = () => setKey((location.hash || '').slice(1)); window.addEventListener('hashchange', h); return () => window.removeEventListener('hashchange', h) }, [])
  const cur = LESSONS.find((l) => l.key === key)
  if (!cur) return (
    <div style={{ fontFamily: "'Manrope', system-ui, sans-serif", maxWidth: 720, margin: '40px auto', padding: '0 16px', color: '#1B1630' }}>
      <h1 style={{ fontSize: 26, margin: '0 0 6px' }}>Kompilyator QA</h1>
      <p style={{ color: '#5A5A60', margin: '0 0 22px' }}>Maslahat ro'yxati (teg, atribut, CSS, JS), Emmet va Tab tugmasi. Darsni oching, praktika ekranigacha boring va kompilyatorda yozib ko'ring.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {LESSONS.map((l) => (
          <button key={l.key} onClick={() => setKey(l.key)} style={{ textAlign: 'left', border: '1px solid #E4E2EC', background: '#fff', borderRadius: 14, padding: '14px 16px', cursor: 'pointer', fontFamily: 'inherit' }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{l.title}</div>
            <div style={{ color: '#5A5A60', fontSize: 13.5, marginTop: 3 }}>{l.sub}</div>
          </button>
        ))}
      </div>
    </div>
  )
  const Lesson = cur.comp
  return (
    <>
      <Suspense fallback={<div style={{ padding: 40, fontFamily: 'system-ui' }}>Yuklanmoqda…</div>}><Lesson lang={lang} /></Suspense>
      <style>{'@media (max-width: 1180px) { .inet-lang { bottom: 84px !important } }'}</style>
      <div className="inet-lang" style={{ position: 'fixed', bottom: 14, left: 14, zIndex: 950, display: 'flex', borderRadius: 12, background: '#FFFFFF', boxShadow: '0 6px 18px -6px rgba(58,53,48,0.35)', overflow: 'hidden', opacity: 0.55, transition: 'opacity 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>
        <button title="Darslar ro'yxati" onClick={() => setKey('')} style={{ width: 40, height: 40, border: 'none', cursor: 'pointer', background: 'transparent', color: '#5A5A60', fontSize: 16 }}>☰</button>
        {['uz', 'ru'].map(l => (
          <button key={l} title={LANG_TITLE[l]} onClick={() => pickLang(l)}
            style={{ width: 34, height: 40, border: 'none', cursor: 'pointer', fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 800, fontSize: 11.5, background: lang === l ? '#0E0E10' : 'transparent', color: lang === l ? '#fff' : '#5A5A60', transition: 'background 0.15s, color 0.15s' }}>{l.toUpperCase()}</button>
        ))}
      </div>
    </>
  )
}
ReactDOM.createRoot(document.getElementById('root')).render(<DemoApp />)
