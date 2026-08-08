import React, { useState, useEffect, Suspense, lazy } from 'react'

// Eski-ko'rik: 2-Modul JS o'zagining ESKI nusxasi (v16, notebookdan) ↔ HOZIRGI holati.
// Eski fayllar `src/2-moodull eski/` da tegilmagan turadi; bu yerdagilar — ko'rik-nusxa.

const E_Intro = lazy(() => import('./lessons/JsIntroLesson.jsx'))
const E_Vars = lazy(() => import('./lessons/JsVarsLesson.jsx'))
const E_Cond = lazy(() => import('./lessons/JsConditionsLesson.jsx'))
const E_Loops = lazy(() => import('./lessons/JsLoopsLesson.jsx'))
const E_Func = lazy(() => import('./lessons/JsFunctionsLesson.jsx'))

const H_Intro = lazy(() => import('../2-Modull/JsIntroLesson.jsx'))
const H_Vars = lazy(() => import('../2-Modull/JsVarsLesson.jsx'))
const H_Cond = lazy(() => import('../2-Modull/JsConditionsLesson.jsx'))
const H_Loops = lazy(() => import('../2-Modull/JsLoopsLesson.jsx'))
const H_Func = lazy(() => import('../2-Modull/JsFunctionsLesson.jsx'))

const PAIRS = [
  {
    id: 'intro', emoji: '🧠', dars: '07-dars', title: 'JsIntro', note: 'Sistema va algoritm',
    eski: { comp: E_Intro, satr: 1371, olam: 'BAJARBOT — nonushta' },
    yangi: { comp: H_Intro, satr: 3571, olam: 'BAJARBOT — lavash 🌯' },
  },
  {
    id: 'vars', emoji: '📦', dars: '08-dars', title: 'JsVars', note: "O'zgaruvchilar",
    eski: { comp: E_Vars, satr: 1204, olam: 'shaxsiy: ism, ball, yosh' },
    yangi: { comp: H_Vars, satr: 4523, olam: 'shaxsiy + praktika-kompilyator' },
  },
  {
    id: 'cond', emoji: '🔀', dars: '09-dars', title: 'JsConditions', note: 'if / else',
    eski: { comp: E_Cond, satr: 1210, olam: 'metro turniketi' },
    yangi: { comp: H_Cond, satr: 4507, olam: 'metro + praktika-kompilyator' },
  },
  {
    id: 'loops', emoji: '🔁', dars: '10-dars', title: 'JsLoops', note: 'for / while',
    eski: { comp: E_Loops, satr: 1386, olam: "30 do'stga xabar" },
    yangi: { comp: H_Loops, satr: 4683, olam: 'xabar + 2 praktika-kompilyator' },
  },
  {
    id: 'func', emoji: '⚙️', dars: '11-dars', title: 'JsFunctions', note: 'funksiya, parametr, return',
    eski: { comp: E_Func, satr: 1345, olam: 'mashina metaforasi' },
    yangi: { comp: H_Func, satr: 4785, olam: "🎮 o'yin olami (zarar/krit)" },
  },
]

const ALL = PAIRS.flatMap(p => [
  { key: `eski-${p.id}`, pair: p, tur: 'eski' },
  { key: `yangi-${p.id}`, pair: p, tur: 'yangi' },
])

const useRoute = () => {
  const read = () => decodeURIComponent(window.location.hash.replace(/^#\/?/, ''))
  const [key, setKey] = useState(read)
  useEffect(() => {
    const on = () => setKey(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return key
}

const Loading = () => (
  <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F2F0FA', fontFamily: "'Manrope', system-ui, sans-serif", color: '#565073', fontWeight: 700 }}>
    Dars yuklanmoqda…
  </div>
)

export default function EskiApp() {
  const key = useRoute()
  const view = ALL.find(l => l.key === key)
  useEffect(() => { window.scrollTo(0, 0) }, [key])

  if (view) {
    const { pair, tur } = view
    const C = pair[tur].comp
    const juft = tur === 'eski' ? 'yangi' : 'eski'
    const eskiP = tur === 'eski'
    return (
      <Suspense fallback={<Loading />}>
        {/* Qaysi nusxa ochilgani — doim ko'rinib turadi */}
        <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 960, padding: '7px 13px', borderRadius: 11, fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: '0.04em', color: '#fff', background: eskiP ? '#B4541E' : '#2E7D4F', boxShadow: '0 6px 18px -6px rgba(40,34,82,0.45)', pointerEvents: 'none' }}>
          {eskiP ? '🕰 ESKI (v16)' : '🆕 HOZIRGI'} · {pair.title}
        </div>
        <C lang="uz" />
        {/* Tez almashtirgich — dars ustida suzadi */}
        <div style={{ position: 'fixed', bottom: 14, left: 14, zIndex: 950, display: 'flex', gap: 8, alignItems: 'center', opacity: 0.62, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.62 }}>
          <a href="#/" title="Ro'yxatga qaytish" aria-label="Ro'yxat"
            style={{ width: 40, height: 40, borderRadius: 12, background: '#FFFFFF', color: '#565073', fontSize: 19, lineHeight: '40px', textAlign: 'center', textDecoration: 'none', boxShadow: '0 6px 18px -6px rgba(40,34,82,0.35)' }}>⌂</a>
          <a href={`#/${juft}-${pair.id}`} title={`${pair.title} — ${juft}`}
            style={{ height: 40, padding: '0 14px', borderRadius: 12, background: eskiP ? '#2E7D4F' : '#B4541E', color: '#fff', fontSize: 13, fontWeight: 800, lineHeight: '40px', textDecoration: 'none', boxShadow: '0 6px 18px -6px rgba(40,34,82,0.35)', fontFamily: "'Manrope', system-ui, sans-serif" }}>
            ⇄ {eskiP ? 'hozirgisini ko’r' : 'eskisini ko’r'}
          </a>
          {PAIRS.filter(p => p.id !== pair.id).map(p => (
            <a key={p.id} href={`#/${tur}-${p.id}`} title={p.title}
              style={{ height: 40, padding: '0 11px', borderRadius: 12, background: '#FFFFFF', color: '#565073', fontSize: 12.5, fontWeight: 800, lineHeight: '40px', textDecoration: 'none', boxShadow: '0 6px 18px -6px rgba(40,34,82,0.35)', fontFamily: "'Manrope', system-ui, sans-serif" }}>
              {p.emoji} {p.title}
            </a>
          ))}
        </div>
      </Suspense>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#F2F0FA', fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,600&family=Manrope:wght@500;600;700;800&display=swap');
        .ek-wrap { max-width: 1000px; margin: 0 auto; padding: clamp(32px,6vw,68px) 20px 80px; }
        .ek-row { display: grid; grid-template-columns: 190px 1fr 1fr; gap: 12px; align-items: stretch; margin-bottom: 12px; }
        @media (max-width: 820px) { .ek-row { grid-template-columns: 1fr } }
        .ek-meta { display: flex; flex-direction: column; justify-content: center; padding: 14px 4px; }
        .ek-card { display: block; background: #fff; border: 1px solid #E7E3F4; border-radius: 16px; padding: 15px 17px; text-decoration: none; box-shadow: 0 8px 24px -14px rgba(40,34,82,0.28); transition: transform 0.16s, box-shadow 0.16s; border-left: 4px solid transparent; }
        .ek-card:hover { transform: translateY(-3px); box-shadow: 0 18px 38px -14px rgba(91,61,230,0.35); }
        .ek-eski { border-left-color: #B4541E; }
        .ek-yangi { border-left-color: #2E7D4F; }
        .ek-tag { display: block; font-size: 10.5px; font-weight: 800; letter-spacing: 0.09em; text-transform: uppercase; margin-bottom: 5px; }
        @media (prefers-reduced-motion: reduce) { .ek-card { transition: none } .ek-card:hover { transform: none } }
      `}</style>
      <div className="ek-wrap">
        <p style={{ margin: '0 0 8px', fontSize: 11.5, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5B3DE6' }}>CoddyCamp · 2-Modul JS o'zagi · ichki ko'rik</p>
        <h1 style={{ margin: '0 0 10px', fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 'clamp(27px,4.4vw,40px)', color: '#1B1630' }}>Eski (v16) ↔ Hozirgi — 5 dars</h1>
        <p style={{ margin: '0 0 26px', fontSize: 14.5, fontWeight: 500, color: '#565073', maxWidth: 660 }}>
          Har qatorda bitta dars: chapda notebookdagi eski nusxa, o'ngda hozirgi holat. Bosing — to'liq ochiladi.
          Dars ichida chap pastdagi <b>⇄</b> tugmasi ikkovini almashtiradi, o'ng yuqorida qaysi nusxa ochilgani yozib turadi.
        </p>
        {PAIRS.map(p => (
          <div key={p.id} className="ek-row">
            <div className="ek-meta">
              <p style={{ margin: '0 0 2px', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#9C97B4' }}>{p.dars}</p>
              <p style={{ margin: '0 0 2px', fontSize: 17, fontWeight: 800, color: '#1B1630' }}>{p.emoji} {p.title}</p>
              <p style={{ margin: 0, fontSize: 12.5, fontWeight: 500, color: '#565073' }}>{p.note}</p>
            </div>
            <a className="ek-card ek-eski" href={`#/eski-${p.id}`}>
              <span className="ek-tag" style={{ color: '#B4541E' }}>🕰 Eski · v16</span>
              <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#1B1630', marginBottom: 3 }}>{p.eski.olam}</span>
              <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9C97B4' }}>{p.eski.satr} satr</span>
            </a>
            <a className="ek-card ek-yangi" href={`#/yangi-${p.id}`}>
              <span className="ek-tag" style={{ color: '#2E7D4F' }}>🆕 Hozirgi</span>
              <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#1B1630', marginBottom: 3 }}>{p.yangi.olam}</span>
              <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#9C97B4' }}>{p.yangi.satr} satr</span>
            </a>
          </div>
        ))}
        <p style={{ margin: '22px 0 0', fontSize: 12.5, fontWeight: 500, color: '#9C97B4', maxWidth: 660, lineHeight: 1.6 }}>
          Eski asl nusxalar <span style={{ fontFamily: 'monospace' }}>src/2-moodull eski/</span> da tegilmagan turadi —
          bu yerdagilar faqat ko'rik uchun ko'chirma.
        </p>
      </div>
    </div>
  )
}
