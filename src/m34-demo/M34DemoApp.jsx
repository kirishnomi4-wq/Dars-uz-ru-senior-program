import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'

// 3+4-Modul demo: ikkala modulning BARCHA darslari — alohida Vercel-ko'rik katalogi.
// Tartib va kalitlar App.jsx bilan bir xil (2026-08-14 holati). Katalog UZ.
const ReactIntroLesson = lazy(() => import('../3-Modull/ReactIntroLesson.jsx'))
const PmUserStoryLesson = lazy(() => import('../pm/PmUserStoryLesson.jsx'))
const ReactFirstComponentLesson = lazy(() => import('../3-Modull/ReactFirstComponentLesson.jsx'))
const ReactStateEffectLesson = lazy(() => import('../3-Modull/ReactStateEffectLesson.jsx'))
const PmLesson8 = lazy(() => import('../3-Modull/PmLesson8.jsx'))
const ReactPropsReuseLesson = lazy(() => import('../3-Modull/ReactPropsReuseLesson.jsx'))
const ReactCrudPracticeLesson = lazy(() => import('../3-Modull/ReactCrudPracticeLesson.jsx'))
const ReactApiGetLesson = lazy(() => import('../3-Modull/ReactApiGetLesson.jsx'))
const ReactApiPostLesson = lazy(() => import('../3-Modull/ReactApiPostLesson.jsx'))
const PmLesson9 = lazy(() => import('../3-Modull/PmLesson9.jsx'))
const ReactRouterPracticeLesson = lazy(() => import('../3-Modull/ReactRouterPracticeLesson.jsx'))
const ReactProjectDayLesson = lazy(() => import('../3-Modull/ReactProjectDayLesson.jsx'))
const ReactBuildSiteLesson = lazy(() => import('../3-Modull/ReactBuildSiteLesson.jsx'))
const PmLesson10 = lazy(() => import('../3-Modull/PmLesson10.jsx'))

const DataIntroLesson = lazy(() => import('../4-Modull/DataIntroLesson.jsx'))
const PmLesson11 = lazy(() => import('../4-Modull/PmLesson11.jsx'))
const DbSqlNosqlLesson = lazy(() => import('../4-Modull/DbSqlNosqlLesson.jsx'))
const NodeServerLesson = lazy(() => import('../4-Modull/NodeServerLesson.jsx'))
const RoutingLesson = lazy(() => import('../4-Modull/RoutingLesson.jsx'))
const PostgresCrudLesson = lazy(() => import('../4-Modull/PostgresCrudLesson.jsx'))
const PmLesson12 = lazy(() => import('../4-Modull/PmLesson12.jsx'))
const BackendCrudPracticeLesson = lazy(() => import('../4-Modull/BackendCrudPracticeLesson.jsx'))
const ApiPostmanLesson = lazy(() => import('../4-Modull/ApiPostmanLesson.jsx'))
const FullstackConnectPracticeLesson = lazy(() => import('../4-Modull/FullstackConnectPracticeLesson.jsx'))
const AuthEnvLesson = lazy(() => import('../4-Modull/AuthEnvLesson.jsx'))
const PmLesson13 = lazy(() => import('../4-Modull/PmLesson13.jsx'))
const FullstackProjectDayLesson = lazy(() => import('../4-Modull/FullstackProjectDayLesson.jsx'))
const FullstackFeedbackLesson = lazy(() => import('../4-Modull/FullstackFeedbackLesson.jsx'))
const PmLesson14 = lazy(() => import('../4-Modull/PmLesson14.jsx'))

const MODULES = [
  {
    id: 'm3',
    label: '3-Modul',
    heading: '3-Modul — Frontend (React)',
    lead: "Komponentdan to'liq ishlaydigan React-loyihagacha — dastur tartibida.",
    lessons: [
      { key: 'm3-01', n: 1,  type: 'Kod',     emoji: '⚛️', title: 'React nima va nima uchun?',      sub: 'komponent, Virtual DOM, React Native', comp: ReactIntroLesson },
      { key: 'm3-02', n: 2,  type: 'PM',      emoji: '📝', title: 'User Story: kim va nima uchun?', sub: '"Men [kim] sifatida..." — JTBD', comp: PmUserStoryLesson },
      { key: 'm3-03', n: 3,  type: 'Kod',     emoji: '🧱', title: 'Birinchi komponent',             sub: 'Vite, JSX, props, loyiha strukturasi', comp: ReactFirstComponentLesson },
      { key: 'm3-04', n: 4,  type: 'Kod',     emoji: '💗', title: 'State va Effect',                sub: 'useState + useEffect, lifecycle', comp: ReactStateEffectLesson },
      { key: 'm3-05', n: 5,  type: 'PM',      emoji: '⚖️', title: 'Qaysi ishni birinchi qilasiz?', sub: "Nechta odam so'raydi va qancha vaqt oladi", comp: PmLesson8 },
      { key: 'm3-06', n: 6,  type: 'Kod',     emoji: '🏭', title: 'Props va qayta ishlatish',       sub: "ma'lumotni komponentlar orasida uzatish", comp: ReactPropsReuseLesson },
      { key: 'm3-07', n: 7,  type: 'Proyekt', emoji: '🐠', title: "Praktika: AI bilan to'liq CRUD", sub: 'Create / Read / Update / Delete', comp: ReactCrudPracticeLesson },
      { key: 'm3-08', n: 8,  type: 'Kod',     emoji: '🛎️', title: 'API bilan ishlash — GET',        sub: 'fetch / axios, JSON, loading', comp: ReactApiGetLesson },
      { key: 'm3-09', n: 9,  type: 'Kod',     emoji: '📦', title: 'API — POST / PUT / DELETE',      sub: "serverga ma'lumot yuborish", comp: ReactApiPostLesson },
      { key: 'm3-10', n: 10, type: 'PM',      emoji: '✅', title: 'Qachon «tayyor» deb ayta olamiz?', sub: 'ishni qabul qilish shartlari', comp: PmLesson9 },
      { key: 'm3-11', n: 11, type: 'Proyekt', emoji: '🌀', title: 'Praktika: React Router',         sub: "ko'p sahifali ilova, navigatsiya", comp: ReactRouterPracticeLesson },
      { key: 'm3-12', n: 12, type: 'Proyekt', emoji: '🚗', title: 'Loyiha kuni — AvtoIjara',        sub: 'React + API + CRUD + routing', comp: ReactProjectDayLesson },
      { key: 'm3-13', n: 13, type: 'Proyekt', emoji: '🏗️', title: "Final loyihani bo'laklash va qurish", sub: 'komponent sxemasi + ishlaydigan loyiha', comp: ReactBuildSiteLesson },
      { key: 'm3-14', n: 14, type: 'PM',      emoji: '🎤', title: "Ishlayotgan saytingizni qanday ko'rsatasiz?", sub: "uch kadrlik ko'rsatuv", comp: PmLesson10 },
      { key: 'm3-15', n: 15, type: 'Rezerv',  emoji: '📅', title: 'Zaxira dars',                    sub: 'yetib olish / sayqallash' },
      { key: 'm3-16', n: 16, type: 'Demo',    emoji: '🎤', title: 'Demo Day',                       sub: 'guruh + mehmonlar oldida himoya' },
    ],
  },
  {
    id: 'm4',
    label: '4-Modul',
    heading: "4-Modul — Ma'lumot va bog'lanishlar (Node.js + PostgreSQL)",
    lead: "Ma'lumot sxemasidan to'liq fullstack loyihagacha — dastur tartibida.",
    lessons: [
      { key: 'm4-01', n: 1,  type: 'Kod',     emoji: '🔌', title: "Ma'lumot nima",                sub: "JSON, jadval, bog'lanish, PK/FK", comp: DataIntroLesson },
      { key: 'm4-02', n: 2,  type: 'PM',      emoji: '📊', title: "Ma'lumot ham mahsulot qarori",   sub: "nimani saqlaymiz va nega — bo'lim shundan quriladi", comp: PmLesson11 },
      { key: 'm4-03', n: 3,  type: 'Kod',     emoji: '📦', title: 'SQL vs NoSQL — PostgreSQL',     sub: 'qachon qaysi biri kerak', comp: DbSqlNosqlLesson },
      { key: 'm4-04', n: 4,  type: 'Kod',     emoji: '🏪', title: 'Node.js — birinchi server',     sub: 'npm, Express, birinchi endpoint', comp: NodeServerLesson },
      { key: 'm4-05', n: 5,  type: 'Kod',     emoji: '📮', title: 'Routing — Express / Nest',      sub: 'method + path, 404, /:id', comp: RoutingLesson },
      { key: 'm4-06', n: 6,  type: 'Kod',     emoji: '🐘', title: "PostgreSQL so'rovlari",        sub: 'SELECT, INSERT, UPDATE, DELETE', comp: PostgresCrudLesson },
      { key: 'm4-07', n: 7,  type: 'PM',      emoji: '🔐', title: 'Xavfsizlik — foydalanuvchi ishonchi', sub: 'nima ochiq, nima yopiq — ishonch mahsulot qiymati', comp: PmLesson12 },
      { key: 'm4-08', n: 8,  type: 'Proyekt', emoji: '🚗', title: 'Praktika: Backend CRUD',        sub: 'AvtoIjara — Express + PostgreSQL', comp: BackendCrudPracticeLesson },
      { key: 'm4-09', n: 9,  type: 'Kod',     emoji: '📡', title: 'API nima + Postman',            sub: "so'rov va javob, status kodlari", comp: ApiPostmanLesson },
      { key: 'm4-10', n: 10, type: 'Proyekt', emoji: '🌉', title: 'Praktika: React + Node ulash',  sub: 'fetch, CORS — front ↔ back', comp: FullstackConnectPracticeLesson },
      { key: 'm4-11', n: 11, type: 'Kod',     emoji: '🔑', title: 'Autentifikatsiya va .env',      sub: 'JWT token, login, himoyalangan route', comp: AuthEnvLesson },
      { key: 'm4-12', n: 12, type: 'PM',      emoji: '🗂️', title: 'Sxema — PRD artefakti',         sub: 'baza sxemasi mahsulot hujjatining qismi', comp: PmLesson13 },
      { key: 'm4-13', n: 13, type: 'Proyekt', emoji: '🅿️', title: 'Fullstack loyiha kuni',         sub: 'AvtoStoyanka — baza + server + panel', comp: FullstackProjectDayLesson },
      { key: 'm4-14', n: 14, type: 'Proyekt', emoji: '💬', title: "Fikr bo'yicha yaxshilash",     sub: 'sinfdoshlar fikridan 3 muammo topib tuzatildi', comp: FullstackFeedbackLesson },
      { key: 'm4-15', n: 15, type: 'PM',      emoji: '🎤', title: 'Fullstack arxitektura pitchi',  sub: "texnik qarorni stakeholder'ga tushuntirish", comp: PmLesson14 },
      { key: 'm4-16', n: 16, type: 'Rezerv',  emoji: '📅', title: 'Zaxira dars',                   sub: 'yetib olish / sayqallash' },
      { key: 'm4-17', n: 17, type: 'Demo',    emoji: '🎤', title: 'Demo Day',                      sub: 'jonli fullstack demo' },
    ],
  },
]

const ALL_LESSONS = MODULES.flatMap(m => m.lessons)

const CHIP_COLORS = {
  Kod: { bg: '#FFE9E2', c: '#D33B12' },
  PM: { bg: '#EBE5FD', c: '#5B3DE6' },
  Proyekt: { bg: '#E4F5EC', c: '#0F8A56' },
  Demo: { bg: '#FFF3D6', c: '#A16A00' },
  Rezerv: { bg: '#EFEEEA', c: '#6E6C66' },
}

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

// `only` berilsa faqat o'sha modul(lar) ko'rsatiladi (m3-demo shundan foydalanadi).
export default function M34DemoApp({ only }) {
  const MODS = only ? MODULES.filter(m => only.includes(m.id) || only.includes(m.id.replace(/^m/, ''))) : MODULES;
  const key = useRoute()
  const lesson = useMemo(() => ALL_LESSONS.find(l => l.key === key && l.comp), [key])
  // UZ-RU: global dars tili — localStorage'da saqlanadi (asosiy App.jsx bilan bir xil kalit), har darsga lang prop bo'lib uzatiladi
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
        <a href="#/" title="Darslar ro'yxatiga qaytish" aria-label="Darslar ro'yxatiga qaytish"
          style={{ position: 'fixed', bottom: 14, left: 14, zIndex: 950, width: 40, height: 40, borderRadius: 12, border: 'none', background: '#FFFFFF', color: '#5A5A60', fontSize: 19, lineHeight: '40px', textAlign: 'center', textDecoration: 'none', cursor: 'pointer', boxShadow: '0 6px 18px -6px rgba(58,53,48,0.35)', opacity: 0.55, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>⌂</a>
        {/* UZ-RU: dars ichida til almashtirgich — ⌂ yonida, progress saqlanadi (komponent remount bo'lmaydi) */}
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
        .m1-arrow { flex-shrink: 0; color: #A7A6A2; font-size: 17px; transition: color 0.15s, transform 0.15s; }
        .m1-mod { margin-top: 36px; scroll-margin-top: 16px; }
        .m1-mod-h { margin: 0 0 6px; font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: clamp(21px,3.2vw,27px); color: #0E0E10; }
        .m1-mod-lead { margin: 0 0 16px; font-size: 13.5px; font-weight: 500; color: #5A5A60; max-width: 560px; }
        .m1-tabs { display: flex; gap: 8px; margin: 0 0 8px; flex-wrap: wrap; }
        .m1-tab { text-decoration: none; cursor: pointer; font-family: 'Manrope', system-ui, sans-serif; font-weight: 800; font-size: 12.5px; padding: 8px 15px; border-radius: 99px; background: #fff; color: #5A5A60; box-shadow: 0 4px 12px -8px rgba(58,53,48,0.3); transition: background 0.15s, color 0.15s; }
        .m1-tab:hover { background: #0E0E10; color: #fff; }
        .m1-tab.on { background: #0E0E10; color: #fff; }
        @media (prefers-reduced-motion: reduce) { .m1-card, .m1-arrow { transition: none } .m1-card:hover { transform: none } }
        @media (max-width: 620px) { .m1-card { gap: 10px; padding: 12px } .m1-chip { display: none } }
      `}</style>
      <div className="m1-wrap">
        <p style={{ margin: '0 0 6px', fontSize: 11.5, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF4F28' }}>CoddyCamp · Senior 2026</p>
        <h1 style={{ margin: '0 0 8px', fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 'clamp(26px,4.4vw,38px)', color: '#0E0E10' }}>3 va 4-Modul — barcha darslar</h1>
        <p style={{ margin: '0 0 22px', fontSize: 14, fontWeight: 500, color: '#5A5A60', maxWidth: 560 }}>Darsni bosing — to'liq ochiladi.</p>
        <div className="m1-tabs">
          {MODS.length > 1 && MODS.map(m => <a key={m.id} className="m1-tab" href={`#${m.id}`}>{m.label}</a>)}
          <span style={{ width: 1, height: 22, background: '#E2DED4', flexShrink: 0, alignSelf: 'center', margin: '0 4px' }} />
          {['uz', 'ru'].map(l => (
            <button key={l} className={`m1-tab${lang === l ? ' on' : ''}`} title={l === 'uz' ? "Dars tili: o'zbekcha" : 'Язык уроков: русский'} onClick={() => pickLang(l)}>{l.toUpperCase()}</button>
          ))}
        </div>
        {MODS.map(m => (
          <div key={m.id} id={m.id} className="m1-mod">
            <h2 className="m1-mod-h">{m.heading}</h2>
            <p className="m1-mod-lead">{m.lead}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {m.lessons.map(l => {
                const chip = CHIP_COLORS[l.type] || CHIP_COLORS.Rezerv
                const inner = (
                  <>
                    <span className="m1-num">{l.n}</span>
                    <span style={{ flexShrink: 0, fontSize: 19 }}>{l.emoji}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontWeight: 800, fontSize: 14.5, color: '#0E0E10' }}>{l.title}</span>
                      <span style={{ display: 'block', fontWeight: 500, fontSize: 12.5, color: '#5A5A60', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.sub}</span>
                    </span>
                    <span className="m1-chip" style={{ background: chip.bg, color: chip.c }}>{l.type}</span>
                    {l.comp && <span className="m1-arrow">→</span>}
                  </>
                )
                return l.comp
                  ? <a key={l.key} className="m1-card" href={`#${l.key}`}>{inner}</a>
                  : <div key={l.key} className="m1-card soon">{inner}</div>
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
