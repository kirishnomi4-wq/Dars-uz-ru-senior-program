import React, { useState, useEffect, Suspense, lazy } from 'react'

// Solishtiruv-ko'rik: 2 juftlik — etalon (chap) va yangi dars (o'ng)
const PmUserStoryLesson = lazy(() => import('../pm/PmUserStoryLesson.jsx'))
const PmLesson7 = lazy(() => import('../3-Modull/PmLesson7.jsx'))

const PAIRS = [
  {
    label: '1-juftlik',
    note: 'PmLesson7 ↔ PmUserStory (etalon)',
    items: [
      { key: 'lesson7', emoji: '🧩', title: 'PmLesson7', sub: 'src/3-Modull/PmLesson7.jsx', side: 'Solishtiriladigan', comp: PmLesson7 },
      { key: 'userstory', emoji: '📝', title: 'PmUserStoryLesson', sub: 'src/pm/PmUserStoryLesson.jsx', side: 'ETALON (P0)', comp: PmUserStoryLesson },
    ],
  },
]

const ALL = PAIRS.flatMap(p => p.items)

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

export default function SolishtirApp() {
  const key = useRoute()
  const lesson = ALL.find(l => l.key === key)
  useEffect(() => { window.scrollTo(0, 0) }, [key])

  if (lesson) {
    const C = lesson.comp
    const others = ALL.filter(l => l.key !== key)
    return (
      <Suspense fallback={<Loading />}>
        <C lang="uz" />
        {/* Tez almashtirgich — dars ustida suzadi */}
        <div style={{ position: 'fixed', bottom: 14, left: 14, zIndex: 950, display: 'flex', gap: 8, alignItems: 'center', opacity: 0.6, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.6 }}>
          <a href="#/" title="Ro'yxatga qaytish" aria-label="Ro'yxat"
            style={{ width: 40, height: 40, borderRadius: 12, background: '#FFFFFF', color: '#565073', fontSize: 19, lineHeight: '40px', textAlign: 'center', textDecoration: 'none', boxShadow: '0 6px 18px -6px rgba(40,34,82,0.35)' }}>⌂</a>
          {others.map(o => (
            <a key={o.key} href={`#/${o.key}`} title={o.title}
              style={{ height: 40, padding: '0 12px', borderRadius: 12, background: '#FFFFFF', color: '#565073', fontSize: 13, fontWeight: 800, lineHeight: '40px', textDecoration: 'none', boxShadow: '0 6px 18px -6px rgba(40,34,82,0.35)', fontFamily: "'Manrope', system-ui, sans-serif" }}>
              {o.emoji} {o.title}
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
        .sol-wrap { max-width: 900px; margin: 0 auto; padding: clamp(32px,6vw,72px) 20px 80px; }
        .sol-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 720px) { .sol-grid { grid-template-columns: 1fr } }
        .sol-card { display: flex; align-items: center; gap: 14px; background: #fff; border: 1px solid #E7E3F4; border-radius: 16px; padding: 16px 18px; text-decoration: none; box-shadow: 0 8px 24px -14px rgba(40,34,82,0.28); transition: transform 0.16s, box-shadow 0.16s; }
        .sol-card:hover { transform: translateY(-3px); box-shadow: 0 18px 38px -14px rgba(91,61,230,0.35); }
        .sol-emoji { flex-shrink: 0; width: 46px; height: 46px; border-radius: 13px; background: #EBE5FD; display: flex; align-items: center; justify-content: center; font-size: 23px; }
        @media (prefers-reduced-motion: reduce) { .sol-card { transition: none } .sol-card:hover { transform: none } }
      `}</style>
      <div className="sol-wrap">
        <p style={{ margin: '0 0 8px', fontSize: 11.5, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5B3DE6' }}>CoddyCamp · PM-Studia · ichki ko'rik</p>
        <h1 style={{ margin: '0 0 10px', fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 'clamp(28px,4.6vw,42px)', color: '#1B1630' }}>2 dars — yonma-yon solishtirish</h1>
        <p style={{ margin: '0 0 28px', fontSize: 14.5, fontWeight: 500, color: '#565073', maxWidth: 620 }}>
          Bir juftlik. Darsni bosing — to'liq ochiladi; chap pastdagi tugmalar bilan darsdan chiqmasdan juftiga o'tasiz.
        </p>
        {PAIRS.map(p => (
          <div key={p.label} style={{ marginBottom: 26 }}>
            <p style={{ margin: '0 0 10px', fontSize: 12.5, fontWeight: 800, color: '#1B1630' }}>
              {p.label} <span style={{ color: '#9C97B4', fontWeight: 600 }}>· {p.note}</span>
            </p>
            <div className="sol-grid">
              {p.items.map(l => (
                <a key={l.key} className="sol-card" href={`#/${l.key}`}>
                  <span className="sol-emoji">{l.emoji}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9C97B4', marginBottom: 3 }}>{l.side}</span>
                    <span style={{ display: 'block', fontSize: 15.5, fontWeight: 800, color: '#1B1630', marginBottom: 2 }}>{l.title}</span>
                    <span style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#565073', wordBreak: 'break-all' }}>{l.sub}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
