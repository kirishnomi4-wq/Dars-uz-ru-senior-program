import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'

// 1-Modul demo: faqat 1-Modul darslari — alohida Vercel-ko'rik uchun katalog.
// Tartib va kalitlar App.jsx bilan bir xil (m1-14 Takrorlash 5-o'rin, m1-15 VS Code 10-o'rin).
const InternetLesson = lazy(() => import('../1-Modull/InternetLesson.jsx'))
const PmAudienceLesson = lazy(() => import('../1-Modull/PmAudienceLesson.jsx'))
const Htmllesson1 = lazy(() => import('../1-Modull/Htmllesson1.jsx'))
const Htmllesson2 = lazy(() => import('../1-Modull/Htmllesson2.jsx'))
const HtmlTakrorlashLesson = lazy(() => import('../1-Modull/HtmlTakrorlashLesson.jsx'))
const PmStructureLesson = lazy(() => import('../1-Modull/PmStructureLesson.jsx'))
const CssLesson1 = lazy(() => import('../1-Modull/CssLesson1.jsx'))
const CssLesson2 = lazy(() => import('../1-Modull/CssLesson2.jsx'))
const HtmlPractice = lazy(() => import('../1-Modull/HtmlPractice.jsx'))
const VsCodeLesson = lazy(() => import('../1-Modull/VsCodeLesson.jsx'))
const GitLesson = lazy(() => import('../1-Modull/GitLesson.jsx'))
const CssPractice = lazy(() => import('../1-Modull/CssPractice.jsx'))
const DeployLesson = lazy(() => import('../1-Modull/DeployLesson.jsx'))
const PmPitchLesson = lazy(() => import('../1-Modull/PmPitchLesson.jsx'))

const LESSONS = [
  { key: 'm1-01', n: 1,  type: 'Kod',     emoji: '🌐', title: "Internet qanday ishlaydi",        sub: "brauzer, server, domen, DNS — so'rov yo'li", comp: InternetLesson },
  { key: 'm1-02', n: 2,  type: 'PM',      emoji: '🎯', title: "Kim mening foydalanuvchim?",      sub: "auditoriya va saytning maqsadi", comp: PmAudienceLesson },
  { key: 'm1-03', n: 3,  type: 'Kod',     emoji: '📄', title: "HTML qo'lda — 1",                 sub: "teg, sarlavha, ro'yxat, havola", comp: Htmllesson1 },
  { key: 'm1-04', n: 4,  type: 'Kod',     emoji: '🖼️', title: "HTML qo'lda — 2",                 sub: "rasm, forma, struktura, DevTools", comp: Htmllesson2 },
  { key: 'm1-14', n: 5,  type: 'Kod',     emoji: '🛠️', title: "Takrorlash: HTML ustaxonasi",     sub: "birinchi mijozlar — 5 buyurtma, debug, imtihon", comp: HtmlTakrorlashLesson, isNew: true },
  { key: 'm1-05', n: 6,  type: 'PM',      emoji: '🗺️', title: "Struktura = mahsulot qarori",     sub: "bo'limlar tartibi kimga qarab tuziladi", comp: PmStructureLesson },
  { key: 'm1-06', n: 7,  type: 'Kod',     emoji: '🎨', title: "CSS qo'lda — 1",                  sub: "rang, shrift, bo'shliqlar", comp: CssLesson1 },
  { key: 'm1-07', n: 8,  type: 'Kod',     emoji: '📐', title: "CSS qo'lda — 2",                  sub: "layout, flexbox, DevTools", comp: CssLesson2 },
  { key: 'm1-08', n: 9,  type: 'Proyekt', emoji: '🧱', title: "Praktika: portfolio strukturasi", sub: "saytni bo'laklaymiz, HTML skelet", comp: HtmlPractice },
  { key: 'm1-15', n: 10, type: 'Kod',     emoji: '💻', title: "VS Code — professional start",    sub: "o'rnatish, Emmet, Live Server, jonli card", comp: VsCodeLesson, isNew: true },
  { key: 'm1-10', n: 11, type: 'Proyekt', emoji: '💅', title: "Praktika: bezash va yakunlash",   sub: "CSS + kontent + AI bilan tugma", comp: CssPractice },
  { key: 'm1-09', n: 12, type: 'Kod',     emoji: '🔀', title: "Git va GitHub",                   sub: "commit, push — kod uchun vaqt mashinasi", comp: GitLesson },
  { key: 'm1-11', n: 13, type: 'Kod',     emoji: '🚀', title: "Netlify va deploy",               sub: "hosting, maktab poddomeni", comp: DeployLesson },
  { key: 'm1-12', n: 14, type: 'PM',      emoji: '🎤', title: "Storytelling: mahsulotni so'zlab berish", sub: "2 daqiqalik pitch: muammo → yechim → demo", comp: PmPitchLesson },
  { key: 'm1-13', n: 15, type: 'Demo',    emoji: '🎤', title: "Demo Day 1",                      sub: "ota-onalar oldida ochiq himoya" },
]

const CHIP_COLORS = { Kod: { bg: '#FFE9E2', c: '#D33B12' }, PM: { bg: '#EBE5FD', c: '#5B3DE6' }, Proyekt: { bg: '#E4F5EC', c: '#0F8A56' }, Demo: { bg: '#FFF3D6', c: '#A16A00' } }

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
  <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F6F4EF', fontFamily: "'Manrope', system-ui, sans-serif", color: '#5A5A60', fontWeight: 700 }}>
    Dars yuklanmoqda…
  </div>
)

export default function M1DemoApp() {
  const key = useRoute()
  const lesson = useMemo(() => LESSONS.find(l => l.key === key && l.comp), [key])
  // UZ-RU: global dars tili — localStorage'da saqlanadi (asosiy App.jsx bilan bir xil kalit)
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('cc_lang') === 'ru' ? 'ru' : 'uz' } catch { return 'uz' }
  })
  const pickLang = (l) => { setLang(l); try { localStorage.setItem('cc_lang', l) } catch {} }
  useEffect(() => { window.scrollTo(0, 0) }, [key])

  if (lesson) {
    const C = lesson.comp
    return (
      <Suspense fallback={<Loading />}>
        <C lang={lang} />
        <a href="#/" title="Darslar ro'yxatiga qaytish" aria-label="Bosh sahifa"
          style={{ position: 'fixed', bottom: 14, left: 14, zIndex: 950, width: 40, height: 40, borderRadius: 12, border: 'none', background: '#FFFFFF', color: '#5A5A60', fontSize: 19, lineHeight: '40px', textAlign: 'center', textDecoration: 'none', cursor: 'pointer', boxShadow: '0 6px 18px -6px rgba(58,53,48,0.35)', opacity: 0.55, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>⌂</a>
        <div style={{ position: 'fixed', bottom: 14, left: 62, zIndex: 950, display: 'flex', borderRadius: 12, background: '#FFFFFF', boxShadow: '0 6px 18px -6px rgba(58,53,48,0.35)', overflow: 'hidden', opacity: 0.55, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>
          {['uz', 'ru'].map(l => (
            <button key={l} title={l === 'uz' ? "Dars tili: o'zbekcha" : 'Язык урока: русский'} onClick={() => pickLang(l)}
              style={{ width: 34, height: 40, border: 'none', cursor: 'pointer', fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 800, fontSize: 11.5, background: lang === l ? '#0E0E10' : 'transparent', color: lang === l ? '#fff' : '#5A5A60', transition: 'background 0.15s, color 0.15s' }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </Suspense>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#F6F4EF', fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,600&family=Manrope:wght@500;600;700;800&display=swap');
        .m1-wrap { max-width: 780px; margin: 0 auto; padding: clamp(28px,5vw,56px) 20px 80px; }
        .m1-card { display: flex; align-items: center; gap: 14px; width: 100%; text-align: left; background: #fff; border: none; border-radius: 14px; padding: 13px 16px; cursor: pointer; text-decoration: none; box-shadow: 0 5px 18px -12px rgba(58,53,48,0.22); transition: transform 0.16s, box-shadow 0.16s; position: relative; }
        .m1-card:hover { transform: translateY(-2px); box-shadow: 0 14px 30px -12px rgba(255,79,40,0.3); }
        .m1-card:hover .m1-arrow { color: #FF4F28; transform: translateX(4px); }
        .m1-card.soon { background: #FBFAF7; box-shadow: none; border: 1px dashed #E2DED4; cursor: default; }
        .m1-card.soon:hover { transform: none; box-shadow: none; }
        .m1-num { flex-shrink: 0; width: 28px; height: 28px; border-radius: 8px; background: #F6F4EF; color: #5A5A60; font-weight: 800; font-size: 12.5px; display: flex; align-items: center; justify-content: center; }
        .m1-chip { flex-shrink: 0; font-size: 10.5px; font-weight: 800; padding: 3px 9px; border-radius: 99px; letter-spacing: 0.02em; }
        .m1-new { position: absolute; top: -7px; right: 12px; font-size: 9.5px; font-weight: 800; letter-spacing: 0.06em; padding: 2px 8px; border-radius: 99px; background: #FF4F28; color: #fff; box-shadow: 0 4px 10px -4px rgba(255,79,40,0.6); }
        .m1-arrow { flex-shrink: 0; color: #A7A6A2; font-size: 17px; transition: color 0.15s, transform 0.15s; }
        .m1-lang { display: flex; border-radius: 10px; background: #fff; overflow: hidden; box-shadow: 0 4px 12px -8px rgba(58,53,48,0.3); }
        @media (prefers-reduced-motion: reduce) { .m1-card, .m1-arrow { transition: none } .m1-card:hover { transform: none } }
        @media (max-width: 620px) { .m1-card { gap: 10px; padding: 12px } .m1-chip { display: none } }
      `}</style>
      <div className="m1-wrap">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 11.5, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF4F28' }}>CoddyCamp · Senior 2026</p>
            <h1 style={{ margin: '0 0 8px', fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 'clamp(26px,4.4vw,38px)', color: '#0E0E10' }}>1-Modul — barcha darslar</h1>
            <p style={{ margin: '0 0 22px', fontSize: 14, fontWeight: 500, color: '#5A5A60', maxWidth: 560 }}>
              Internet asoslaridan birinchi jonli saytgacha — 15 dars, dastur tartibida. Darsni bosing — to'liq ochiladi.
            </p>
          </div>
          <div className="m1-lang">
            {['uz', 'ru'].map(l => (
              <button key={l} onClick={() => pickLang(l)} title={l === 'uz' ? "Dars tili: o'zbekcha" : 'Язык уроков: русский'}
                style={{ width: 40, height: 34, border: 'none', cursor: 'pointer', fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 800, fontSize: 12, background: lang === l ? '#0E0E10' : 'transparent', color: lang === l ? '#fff' : '#5A5A60' }}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LESSONS.map(l => {
            const cc = CHIP_COLORS[l.type] || CHIP_COLORS.Kod
            const inner = (
              <>
                <span className="m1-num">{l.n}</span>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{l.emoji}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 15, fontWeight: 800, color: '#0E0E10', marginBottom: 2 }}>{l.title}</span>
                  <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#5A5A60' }}>{l.sub}</span>
                </span>
                <span className="m1-chip" style={{ background: cc.bg, color: cc.c }}>{l.type}</span>
                {l.comp ? <span className="m1-arrow">→</span> : <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, color: '#A7A6A2' }}>{l.key === 'm1-15' ? 'tayyorlanmoqda…' : 'jonli dars'}</span>}
                {l.isNew && <span className="m1-new">YANGI</span>}
              </>
            )
            return l.comp
              ? <a key={l.key} className="m1-card" href={`#/${l.key}`}>{inner}</a>
              : <div key={l.key} className="m1-card soon">{inner}</div>
          })}
        </div>
      </div>
    </div>
  )
}
