import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'

// 11-Modul QA-demosi (07.10.2026): alohida Vercel loyihasi — QA ko'rib fidbek beradi. Kod papkasi src/9-Modull (LMS'da «11-Modul»).
// LMS'ga yuklanmaydi (28.09 qarori: LMS'ga faqat integratsiyalashgan 1–4-Modul). Naqsh — src/m8-demo (10-Modul QA sayti). Tartib App.jsx (m9) bilan bir xil; generator — ru sarlavha darsning LESSON_META sidan.
const PmTenIdeasLesson = lazy(() => import('../9-Modull/PmTenIdeasLesson.jsx'))
const PmIdeaRiceLesson = lazy(() => import('../9-Modull/PmIdeaRiceLesson.jsx'))
const PmInterviewsOneLesson = lazy(() => import('../9-Modull/PmInterviewsOneLesson.jsx'))
const PmFinalIdeaLesson = lazy(() => import('../9-Modull/PmFinalIdeaLesson.jsx'))
const PmPrdLesson = lazy(() => import('../9-Modull/PmPrdLesson.jsx'))
const PmRoadmapLesson = lazy(() => import('../9-Modull/PmRoadmapLesson.jsx'))
const LivePrototypeLesson = lazy(() => import('../9-Modull/LivePrototypeLesson.jsx'))
const PlatformChoiceLesson = lazy(() => import('../9-Modull/PlatformChoiceLesson.jsx'))
const ExpoPrototypeLesson = lazy(() => import('../9-Modull/ExpoPrototypeLesson.jsx'))
const FoundationDayLesson = lazy(() => import('../9-Modull/FoundationDayLesson.jsx'))
const FeatureOneLesson = lazy(() => import('../9-Modull/FeatureOneLesson.jsx'))
const FeatureTwoLesson = lazy(() => import('../9-Modull/FeatureTwoLesson.jsx'))
const PmAudienceTestLesson = lazy(() => import('../9-Modull/PmAudienceTestLesson.jsx'))
const FeatureThreeLesson = lazy(() => import('../9-Modull/FeatureThreeLesson.jsx'))
const PmOneOnOneLesson = lazy(() => import('../9-Modull/PmOneOnOneLesson.jsx'))
const PmPrototypePitchLesson = lazy(() => import('../9-Modull/PmPrototypePitchLesson.jsx'))

const L = (key, n, type, emoji, uz, ru, suz, sru, comp) => ({ key, n, type, emoji, title: { uz, ru }, sub: { uz: suz, ru: sru }, comp })
const MODULES = [
  {
    id: 'm11',
    label: { uz: '11-Modul', ru: '11-Модуль' },
    heading: { uz: "11-Modul — Final loyiha: g'oya va rivojlantirish", ru: '11-Модуль — Финальный проект: идея и разработка' },
    lead: { uz: "Bitiruvgacha olib boriladigan final mahsulot: g'oya, intervyu, PRD, prototip va birinchi funksiyalar — web yoki mobil.", ru: 'Финальный продукт, который вы доведёте до выпуска: идея, интервью, PRD, прототип и первые функции — веб или мобильное приложение.' },
    lessons: [
      L("m9-01", 1, "PM", "💡", "Oltita g'oyani qayerdan topasiz?", "Где найти шесть идей?", "muammo, kim uchun va yechim — 6 yozma g'oya", "проблема, для кого и решение — 6 письменных идей", PmTenIdeasLesson),
      L("m9-02", 2, "PM", "⚖️", "Oltita g'oyadan qaysi uchtasi qoladi?", "Какие три из шести идей останутся?", "saralash va RICE bahosi", "отбор и оценка RICE", PmIdeaRiceLesson),
      L("m9-03", 3, "PM", "🎙️", "Ikki g'oyadan qaysi biri odamlarga kerak?", "Какая из двух идей нужна людям?", "10 intervyu, 1-qism: ikki g'oya, bir xil savollar", "10 интервью, часть 1: две идеи, одинаковые вопросы", PmInterviewsOneLesson),
      L("m9-04", 4, "PM", "🧩", "O'n intervyudan keyin qaysi g'oya qoladi?", "Какая идея останется после десяти интервью?", "takrorlangan javoblar va final g'oya", "повторяющиеся ответы и финальная идея", PmFinalIdeaLesson),
      L("m9-05", 5, "PM", "📄", "G'oyangiz bir sahifaga sig'adimi?", "Поместится ли ваша идея на одну страницу?", "Mentor tekshiruvi va to'liq PRD", "проверка Ментора и полный PRD", PmPrdLesson),
      L("m9-06", 6, "PM", "🗺️", "Bitiruvgacha nimani qachon qurasiz?", "Что и когда вы построите до выпуска?", "RICE bo'yicha roadmap", "roadmap по RICE", PmRoadmapLesson),
      L("m9-07", 7, "Kod", "✏️", "Jonli prototip: qog'ozdan bosiladigan ekrangacha", "Живой прототип: от бумаги до кликабельного экрана", "wireframe → talab → bosiladigan prototip", "wireframe → требование → кликабельный прототип", LivePrototypeLesson),
      L("m9-08", 8, "Kod", "🏛️", "Arxitektura va platforma: web yoki mobil ilova", "Архитектура и платформа: веб или мобильное приложение", "qismlar, real vaqt nuqtalari, stek — asoslangan tanlov", "части, точки реального времени, стек — обоснованный выбор", PlatformChoiceLesson),
      L("m9-09", 9, "Kod", "📱", "React Native va Expo: prototip telefonda", "React Native и Expo: прототип на телефоне", "Expo, navigatsiya; web-trek — adaptiv sayt va PWA", "Expo, навигация; веб-трек — адаптивный сайт и PWA", ExpoPrototypeLesson),
      L("m9-10", 10, "Proyekt", "🧱", "Loyiha kuni: poydevor — Database, kirish, deploy", "День проекта: фундамент — Database, вход, деплой", "tanlangan stekda: ilova Backend'ga ulanadi", "на выбранном стеке: приложение подключается к Backend", FoundationDayLesson),
      L("m9-11", 11, "Proyekt", "🔧", "Loyiha kuni: 1-asosiy funksiya", "День проекта: 1-я основная функция", "roadmap'dagi birinchi funksiya — talabni siz yozasiz", "первая функция из roadmap — требование пишете вы", FeatureOneLesson),
      L("m9-12", 12, "Proyekt", "🔧", "Loyiha kuni: 2-asosiy funksiya", "День проекта: 2-я основная функция", "roadmap'dagi ikkinchi funksiya", "вторая функция из roadmap", FeatureTwoLesson),
      L("m9-13", 13, "PM", "👀", "Uch foydalanuvchidan keyin nimani tuzatasiz?", "Что вы исправите после трёх пользователей?", "auditoriya bilan sinov va shu darsda tuzatish", "тест с аудиторией и исправление на этом же уроке", PmAudienceTestLesson),
      L("m9-14", 14, "Proyekt", "🔧", "Loyiha kuni: 3-asosiy funksiya", "День проекта: 3-я основная функция", "roadmap'dagi uchinchi funksiya", "третья функция из roadmap", FeatureThreeLesson),
      L("m9-15", 15, "PM", "🤝", "Roadmap bo'yicha qayerdasiz?", "Где вы сейчас по roadmap?", "Mentor bilan yakkama-yakka: risklar va tuzatilgan reja", "встреча один на один с Ментором: риски и исправленный план", PmOneOnOneLesson),
      L("m9-16", 16, "PM", "🎤", "G'oyangiz va ilovangiz guruhni ishontiradimi?", "Убедят ли группу ваша идея и приложение?", "muammo → yechim → jonli demo", "проблема → решение → живое демо", PmPrototypePitchLesson),
      L("m9-17", 17, "Demo", "🎤", "Demo Day 7", "Demo Day 7", "final g'oya", "финальная идея"),
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
  h1: { uz: '11-Modul darslari', ru: 'Уроки 11-го модуля' },
  lead: { uz: "Darsni bosing — to'liq ochiladi.", ru: 'Нажмите на урок — он откроется полностью.' },
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

export default function M9DemoApp() {
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
