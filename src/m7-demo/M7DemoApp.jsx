import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'

// 9-Modul QA-demosi (05.10.2026): alohida Vercel loyihasi — QA ko'rib fidbek beradi. Kod papkasi src/7-Modull (LMS'da «9-Modul»).
// LMS'ga yuklanmaydi (28.09 qarori: LMS'ga faqat integratsiyalashgan 1–4-Modul). Naqsh — src/m6-demo (8-Modul QA sayti). Tartib App.jsx (m7) bilan bir xil.
const PmProductProblemLesson = lazy(() => import('../7-Modull/PmProductProblemLesson.jsx'))
const PmFiveInterviewsLesson = lazy(() => import('../7-Modull/PmFiveInterviewsLesson.jsx'))
const PmInterviewMvpLesson = lazy(() => import('../7-Modull/PmInterviewMvpLesson.jsx'))
const MvpArchitectureLesson = lazy(() => import('../7-Modull/MvpArchitectureLesson.jsx'))
const AnimationLesson = lazy(() => import('../7-Modull/AnimationLesson.jsx'))
const PmAnalyticsDayOneLesson = lazy(() => import('../7-Modull/PmAnalyticsDayOneLesson.jsx'))
const MvpFirstScreenLesson = lazy(() => import('../7-Modull/MvpFirstScreenLesson.jsx'))
const PmDesignMotionLesson = lazy(() => import('../7-Modull/PmDesignMotionLesson.jsx'))
const MvpCompleteLesson = lazy(() => import('../7-Modull/MvpCompleteLesson.jsx'))
const PmUsabilityTestLesson = lazy(() => import('../7-Modull/PmUsabilityTestLesson.jsx'))
const MvpIterationLesson = lazy(() => import('../7-Modull/MvpIterationLesson.jsx'))
const PmUserStoryPitchLesson = lazy(() => import('../7-Modull/PmUserStoryPitchLesson.jsx'))

const L = (key, n, type, emoji, uz, ru, suz, sru, comp) => ({ key, n, type, emoji, title: { uz, ru }, sub: { uz: suz, ru: sru }, comp })
const MODULES = [
  {
    id: 'm9',
    label: { uz: '9-Modul', ru: '9-Модуль' },
    heading: { uz: '9-Modul — Loyiham kim uchun va nima uchun', ru: '9-Модуль — Для кого и зачем мой проект' },
    lead: { uz: "Real odamning real muammosi uchun birinchi mini-MVP — jonli va animatsiyali.", ru: 'Первый мини-MVP для реальной проблемы реального человека — живой и анимированный.' },
    lessons: [
      L('m7-01', 1, 'PM', '🎯', 'Loyihangiz kimga kerak?', 'Кому нужен ваш проект?', 'mahsulot va loyiha farqi, atrofdan 10 muammo', 'продукт и проект, 10 проблем вокруг', PmProductProblemLesson),
      L('m7-02', 2, 'PM', '🎙️', 'Besh odamdan nimani bilib olasiz?', 'Что вы узнаете от пяти человек?', "intervyu: bo'lib o'tgan ishni so'rash, 5 yozuv", 'интервью: спрашивать о прошлом, 5 записей', PmFiveInterviewsLesson),
      L('m7-03', 3, 'PM', '✂️', 'Besh suhbatdan qaysi muammo chiqdi?', 'Какая проблема вышла из пяти разговоров?', 'sanoq, bitta muammo, qilamiz / keyin / qilmaymiz', 'подсчёт, одна проблема, делаем / позже / не делаем', PmInterviewMvpLesson),
      L('m7-04', 4, 'Kod', '🏛️', 'Mini-MVP arxitekturasi', 'Архитектура мини-MVP', "qismlar, ma'lumot, kirish, deploy — chizma", 'части, данные, вход, деплой — схема', MvpArchitectureLesson),
      L('m7-05', 5, 'Kod', '✨', 'Animatsiya: interfeys javob beradi', 'Анимация: интерфейс отвечает', 'transition, transform, Motion', 'transition, transform, Motion', AnimationLesson),
      L('m7-06', 6, 'PM', '📊', "Birinchi odam kirganda nimani ko'rasiz?", 'Что вы увидите, когда придёт первый человек?', "nimani o'lchaymiz — va analitikani ulaymiz", 'что измеряем — и подключаем аналитику', PmAnalyticsDayOneLesson),
      L('m7-07', 7, 'Proyekt', '🚧', 'Loyiha kuni: MVP — birinchi ekran', 'День проекта: MVP — первый экран', 'talabni siz yozasiz, agent quradi', 'требование пишете вы, агент строит', MvpFirstScreenLesson),
      L('m7-08', 8, 'PM', '🎨', 'Yaxshi interfeysdan nimani olasiz?', 'Что взять из хорошего интерфейса?', 'bitta usul va animatsiyalar', 'один приём и анимации', PmDesignMotionLesson),
      L('m7-09', 9, 'Proyekt', '🏁', 'Loyiha kuni: MVP tayyor', 'День проекта: MVP готов', 'qolgan funksiyalar, ishlaydigan MVP', 'остальные функции, работающий MVP', MvpCompleteLesson),
      L('m7-10', 10, 'PM', '👀', "Odam ilovangizda qayerda to'xtab qoladi?", 'Где человек застревает в вашем приложении?', 'sinov: tushuntirmang, kuzating', 'тест: не объясняйте, наблюдайте', PmUsabilityTestLesson),
      L('m7-11', 11, 'Proyekt', '🔁', 'Loyiha kuni: sinovdan keyingi tuzatish', 'День проекта: исправление после теста', 'eng muhim bitta muammo tuzatiladi', 'исправляется одна самая важная проблема', MvpIterationLesson),
      L('m7-12', 12, 'PM', '🎤', 'Pitchingizda kimning hikoyasi bor?', 'Чья история в вашем питче?', 'muammo, yechim va real foydalanuvchi', 'проблема, решение и реальный пользователь', PmUserStoryPitchLesson),
      L('m7-13', 13, 'Rezerv', '📅', 'Zaxira dars', 'Резервный урок', 'yetib olish / sayqallash', 'догнать / отшлифовать'),
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
const CHIP_LABEL = {
  Kod: { uz: 'Kod', ru: 'Код' },
  PM: { uz: 'PM', ru: 'PM' },
  Proyekt: { uz: 'Proyekt', ru: 'Проект' },
  Demo: { uz: 'Demo', ru: 'Демо' },
  Rezerv: { uz: 'Rezerv', ru: 'Резерв' },
}
const UI = {
  eyebrow: { uz: 'CoddyCamp · Senior 2026', ru: 'CoddyCamp · Senior 2026' },
  h1: { uz: '9-Modul darslari', ru: 'Уроки 9-го модуля' },
  lead: { uz: "Darsni bosing — to'liq ochiladi. Ruscha matn hali tekshirilmagan.", ru: 'Нажмите на урок — он откроется полностью. Русский текст ещё черновой и проверяется.' },
  loading: { uz: 'Dars yuklanmoqda…', ru: 'Урок загружается…' },
  back: { uz: "Darslar ro'yxatiga qaytish", ru: 'Вернуться к списку уроков' },
  langTitle: { uz: "Dars tili: o'zbekcha", ru: 'Язык уроков: русский' },
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

const Loading = ({ lang }) => (
  <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F6F4EF', fontFamily: "'Manrope', system-ui, sans-serif", color: '#5A5A60', fontWeight: 700 }}>
    {UI.loading[lang]}
  </div>
)

export default function M7DemoApp() {
  const key = useRoute()
  const lesson = useMemo(() => ALL_LESSONS.find(l => l.key === key && l.comp), [key])
  // UZ-RU: global dars tili — localStorage'da saqlanadi (asosiy App.jsx bilan bir xil kalit), har darsga lang prop bo'lib uzatiladi
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('cc_lang') === 'ru' ? 'ru' : 'uz' } catch { return 'uz' }
  })
  const pickLang = (l) => { setLang(l); try { localStorage.setItem('cc_lang', l) } catch {} }
  const t = (o) => (o && o[lang]) ?? (o && o.uz) ?? ''
  useEffect(() => { window.scrollTo(0, 0) }, [key])
  useEffect(() => { try { document.documentElement.lang = lang } catch {} }, [lang])

  if (lesson) {
    const C = lesson.comp
    return (
      <Suspense fallback={<Loading lang={lang} />}>
        <C lang={lang} />
        {/* F-1004-09: telefonda qobiq-tugmalar darsning pastki paneli («Orqaga») ustiga tushardi — panel ustiga ko'tariladi */}
        <style>{'@media (max-width: 720px) { .qa-shell { bottom: calc(80px + env(safe-area-inset-bottom, 0px)) !important; } }'}</style>
        <a className="qa-shell" href="#/" title={UI.back[lang]} aria-label={UI.back[lang]}
          style={{ position: 'fixed', bottom: 14, left: 14, zIndex: 950, width: 40, height: 40, borderRadius: 12, border: 'none', background: '#FFFFFF', color: '#5A5A60', fontSize: 19, lineHeight: '40px', textAlign: 'center', textDecoration: 'none', cursor: 'pointer', boxShadow: '0 6px 18px -6px rgba(58,53,48,0.35)', opacity: 0.55, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>⌂</a>
        {/* UZ-RU: dars ichida til almashtirgich — ⌂ yonida, progress saqlanadi (komponent remount bo'lmaydi) */}
        <div className="qa-shell" style={{ position: 'fixed', bottom: 14, left: 62, zIndex: 950, display: 'flex', borderRadius: 12, background: '#FFFFFF', boxShadow: '0 6px 18px -6px rgba(58,53,48,0.35)', overflow: 'hidden', opacity: 0.55, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>
          {['uz', 'ru'].map(l => (
            <button key={l} title={UI.langTitle[l]} onClick={() => pickLang(l)}
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
        .m1-tab { text-decoration: none; cursor: pointer; font-family: 'Manrope', system-ui, sans-serif; font-weight: 800; font-size: 12.5px; padding: 8px 15px; border-radius: 99px; background: #fff; color: #5A5A60; box-shadow: 0 4px 12px -8px rgba(58,53,48,0.3); transition: background 0.15s, color 0.15s; border: none; }
        .m1-tab:hover { background: #0E0E10; color: #fff; }
        .m1-tab.on { background: #0E0E10; color: #fff; }
        @media (prefers-reduced-motion: reduce) { .m1-card, .m1-arrow { transition: none } .m1-card:hover { transform: none } }
        @media (max-width: 620px) { .m1-card { gap: 10px; padding: 12px } .m1-chip { display: none } }
      `}</style>
      <div className="m1-wrap">
        <p style={{ margin: '0 0 6px', fontSize: 11.5, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF4F28' }}>{t(UI.eyebrow)}</p>
        <h1 style={{ margin: '0 0 8px', fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 'clamp(26px,4.4vw,38px)', color: '#0E0E10' }}>{t(UI.h1)}</h1>
        <p style={{ margin: '0 0 22px', fontSize: 14, fontWeight: 500, color: '#5A5A60', maxWidth: 560 }}>{t(UI.lead)}</p>
        <div className="m1-tabs">
          {MODULES.map(m => <a key={m.id} className="m1-tab" href={`#${m.id}`}>{t(m.label)}</a>)}
          <span style={{ width: 1, height: 22, background: '#E2DED4', flexShrink: 0, alignSelf: 'center', margin: '0 4px' }} />
          {['uz', 'ru'].map(l => (
            <button key={l} className={`m1-tab${lang === l ? ' on' : ''}`} title={UI.langTitle[l]} onClick={() => pickLang(l)}>{l.toUpperCase()}</button>
          ))}
        </div>
        {MODULES.map(m => (
          <div key={m.id} id={m.id} className="m1-mod">
            <h2 className="m1-mod-h">{t(m.heading)}</h2>
            <p className="m1-mod-lead">{t(m.lead)}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {m.lessons.map(l => {
                const chip = CHIP_COLORS[l.type] || CHIP_COLORS.Rezerv
                const inner = (
                  <>
                    <span className="m1-num">{l.n}</span>
                    <span style={{ flexShrink: 0, fontSize: 19 }}>{l.emoji}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontWeight: 800, fontSize: 14.5, color: '#0E0E10' }}>{t(l.title)}</span>
                      <span style={{ display: 'block', fontWeight: 500, fontSize: 12.5, color: '#5A5A60', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t(l.sub)}</span>
                    </span>
                    <span className="m1-chip" style={{ background: chip.bg, color: chip.c }}>{t(CHIP_LABEL[l.type] || CHIP_LABEL.Rezerv)}</span>
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
