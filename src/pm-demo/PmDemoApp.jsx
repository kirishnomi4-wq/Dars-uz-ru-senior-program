import React, { useState, useEffect, Suspense, lazy } from 'react'

// PM-demo: faqat src/pm dagi 3 etalon dars — alohida Vercel-ko'rik uchun mini-katalog
const PmUserStoryLesson = lazy(() => import('../pm/PmUserStoryLesson.jsx'))
const PmJtbdLesson = lazy(() => import('../pm/PmJtbdLesson.jsx'))
const PmMetricsLesson = lazy(() => import('../pm/PmMetricsLesson.jsx'))

const LESSONS = [
  { key: 'user-story', emoji: '📝', title: 'User Story: kim va nima uchun?', sub: '«Men [kim] sifatida…» — retsept, ustaxona, jonli kompilyator', tag: '3-modul · 2-dars', comp: PmUserStoryLesson },
  { key: 'jtbd', emoji: '🔨', title: 'Jobs-to-be-Done', sub: 'Odam drel emas — teshik sotib oladi. Yollash doskasi, JTBD-kartalar', tag: '7-modul · 2-dars', comp: PmJtbdLesson },
  { key: 'metrika', emoji: '📈', title: 'Metrika nima', sub: 'DAU, retention, churn, North Star — jonli pult', tag: '8-modul · 1-dars', comp: PmMetricsLesson },
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

export default function PmDemoApp() {
  const key = useRoute()
  const lesson = LESSONS.find(l => l.key === key)
  useEffect(() => { window.scrollTo(0, 0) }, [key])

  if (lesson) {
    const C = lesson.comp
    return (
      <Suspense fallback={<Loading />}>
        <C lang="uz" />
        <a href="#/" title="Darslar ro'yxatiga qaytish" aria-label="Bosh sahifa"
          style={{ position: 'fixed', bottom: 14, left: 14, zIndex: 950, width: 40, height: 40, borderRadius: 12, border: 'none', background: '#FFFFFF', color: '#565073', fontSize: 19, lineHeight: '40px', textAlign: 'center', textDecoration: 'none', cursor: 'pointer', boxShadow: '0 6px 18px -6px rgba(40,34,82,0.35)', opacity: 0.55, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>⌂</a>
      </Suspense>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#F2F0FA', fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,600&family=Manrope:wght@500;600;700;800&display=swap');
        .pmd-wrap { max-width: 760px; margin: 0 auto; padding: clamp(32px,6vw,72px) 20px 80px; }
        .pmd-card { display: flex; align-items: center; gap: 16px; width: 100%; text-align: left; background: #fff; border: 1px solid #E7E3F4; border-radius: 16px; padding: 18px 20px; cursor: pointer; text-decoration: none; box-shadow: 0 8px 24px -14px rgba(40,34,82,0.28); transition: transform 0.16s, box-shadow 0.16s; }
        .pmd-card:hover { transform: translateY(-3px); box-shadow: 0 18px 38px -14px rgba(91,61,230,0.35); }
        .pmd-card:hover .pmd-arrow { color: #5B3DE6; transform: translateX(4px); }
        .pmd-emoji { flex-shrink: 0; width: 52px; height: 52px; border-radius: 14px; background: #EBE5FD; display: flex; align-items: center; justify-content: center; font-size: 26px; }
        .pmd-arrow { flex-shrink: 0; color: #9C97B4; font-size: 20px; transition: color 0.15s, transform 0.15s; }
        @media (prefers-reduced-motion: reduce) { .pmd-card, .pmd-arrow { transition: none } .pmd-card:hover { transform: none } }
      `}</style>
      <div className="pmd-wrap">
        <p style={{ margin: '0 0 8px', fontSize: 11.5, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5B3DE6' }}>CoddyCamp · Senior 2026 · PM-Studia</p>
        <h1 style={{ margin: '0 0 10px', fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 'clamp(28px,4.6vw,42px)', color: '#1B1630' }}>PM darslar — jonli ko'rik</h1>
        <p style={{ margin: '0 0 26px', fontSize: 14.5, fontWeight: 500, color: '#565073', maxWidth: 560 }}>
          Mahsulot-menejment yo'nalishining 3 ta namunaviy interaktiv darsi. Darsni bosing — to'liq ochiladi; ⌂ tugmasi bilan ro'yxatga qaytasiz.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {LESSONS.map(l => (
            <a key={l.key} className="pmd-card" href={`#/${l.key}`}>
              <span className="pmd-emoji">{l.emoji}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9C97B4', marginBottom: 3 }}>{l.tag}</span>
                <span style={{ display: 'block', fontSize: 16.5, fontWeight: 800, color: '#1B1630', marginBottom: 3 }}>{l.title}</span>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#565073' }}>{l.sub}</span>
              </span>
              <span className="pmd-arrow">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
