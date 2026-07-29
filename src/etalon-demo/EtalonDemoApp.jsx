import React, { useState, useEffect, Suspense, lazy } from 'react'

// ETALON TEST-KATALOGI — ikki turdagi PM etalon darsni testerlarga ko'rsatish uchun.
// 1-TUR (texnikaga yaqin): PmLesson2 «Struktura» · 2-TUR (sof PM): PmUserStoryLesson (P0).
const PmLesson2 = lazy(() => import('../1-Modull/PmLesson2.jsx'))
const PmUserStoryLesson = lazy(() => import('../pm/PmUserStoryLesson.jsx'))

const LESSONS = [
  { key: 'struktura', tur: '1-TUR · texnikaga yaqin PM', emoji: '🗺️', title: 'Struktura — mahsulot qarori', sub: "bo'limlar tartibi kimga qarab tuziladi · 17 ekran · koding: HTML-struktura", comp: PmLesson2 },
  { key: 'userstory', tur: '2-TUR · sof PM (P0)', emoji: '📝', title: 'User Story: kim va nima uchun?', sub: "o'quvchi 3 hikoya yozadi · 17 ekran · koding: hikoya-kartasi", comp: PmUserStoryLesson },
]

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

export default function EtalonDemoApp() {
  const key = useRoute()
  const lesson = LESSONS.find(l => l.key === key)
  useEffect(() => { window.scrollTo(0, 0) }, [key])

  if (lesson) {
    const C = lesson.comp
    return (
      <Suspense fallback={<Loading />}>
        <C lang="uz" />
        <a href="#/" title="Ro'yxatga qaytish" aria-label="Ro'yxat"
          style={{ position: 'fixed', bottom: 14, left: 14, zIndex: 950, width: 40, height: 40, borderRadius: 12, background: '#FFFFFF', color: '#565073', fontSize: 19, lineHeight: '40px', textAlign: 'center', textDecoration: 'none', boxShadow: '0 6px 18px -6px rgba(40,34,82,0.35)', opacity: 0.55, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>⌂</a>
      </Suspense>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#F2F0FA', fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,600&family=Manrope:wght@500;600;700;800&display=swap');
        .et-wrap { max-width: 720px; margin: 0 auto; padding: clamp(32px,6vw,72px) 20px 80px; }
        .et-card { display: flex; align-items: center; gap: 16px; background: #fff; border: 1px solid #E7E3F4; border-radius: 18px; padding: 20px 22px; text-decoration: none; box-shadow: 0 8px 24px -14px rgba(40,34,82,0.28); transition: transform 0.16s, box-shadow 0.16s; margin-bottom: 14px; }
        .et-card:hover { transform: translateY(-3px); box-shadow: 0 18px 38px -14px rgba(91,61,230,0.35); }
        .et-emoji { flex-shrink: 0; width: 54px; height: 54px; border-radius: 15px; background: #EBE5FD; display: flex; align-items: center; justify-content: center; font-size: 27px; }
        @media (prefers-reduced-motion: reduce) { .et-card { transition: none } .et-card:hover { transform: none } }
      `}</style>
      <div className="et-wrap">
        <p style={{ margin: '0 0 8px', fontSize: 11.5, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5B3DE6' }}>CoddyCamp · PM-Studia · test-ko'rik</p>
        <h1 style={{ margin: '0 0 10px', fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 'clamp(28px,4.6vw,42px)', color: '#1B1630' }}>Ikki turdagi etalon dars</h1>
        <p style={{ margin: '0 0 28px', fontSize: 14.5, fontWeight: 500, color: '#565073', maxWidth: 560 }}>
          Darsni bosing — to'liq ochiladi. Chap pastdagi ⌂ bilan ro'yxatga qaytasiz. Jonli rejimni sinash uchun mentor kodi kerak bo'ladi; oddiy ko'rik uchun «O'zim o'rganaman»ni tanlang.
        </p>
        {LESSONS.map(l => (
          <a key={l.key} className="et-card" href={`#/${l.key}`}>
            <span className="et-emoji">{l.emoji}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9C97B4', marginBottom: 4 }}>{l.tur}</span>
              <span style={{ display: 'block', fontSize: 17, fontWeight: 800, color: '#1B1630', marginBottom: 3 }}>{l.title}</span>
              <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#565073' }}>{l.sub}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
