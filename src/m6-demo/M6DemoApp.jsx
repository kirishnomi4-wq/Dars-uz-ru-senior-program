import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'

// 8-Modul QA-demosi (2026-09-29): alohida Vercel loyihasi — QA ko'rib fidbek beradi. Kod papkasi src/6-Modull (LMS'da «8-Modul»).
// LMS'ga yuklanmaydi (28.09 qarori: LMS'ga faqat integratsiyalashgan 1–4-Modul).
// Faqat MD v2 ga keltirilgan darslar ochiq (comp bor); qolganlari «soon» kartasi. Tartib App.jsx (m6) bilan bir xil.
const SystemArchitectureLesson = lazy(() => import('../6-Modull/SystemArchitectureLesson.jsx'))
const ArchPatternsLesson = lazy(() => import('../6-Modull/ArchPatternsLesson.jsx'))
const PipelineProjectLesson = lazy(() => import('../6-Modull/PipelineProjectLesson.jsx'))
const FullSystemProjectLesson = lazy(() => import('../6-Modull/FullSystemProjectLesson.jsx'))
const AgentArchitectureLesson = lazy(() => import('../6-Modull/AgentArchitectureLesson.jsx'))
const ClaudeSkillsLesson = lazy(() => import('../6-Modull/ClaudeSkillsLesson.jsx'))
const WriteSkillLesson = lazy(() => import('../6-Modull/WriteSkillLesson.jsx'))
const ReactNativeBasicsLesson = lazy(() => import('../6-Modull/ReactNativeBasicsLesson.jsx'))
const ReactNativeAppLesson = lazy(() => import('../6-Modull/ReactNativeAppLesson.jsx'))
const MobileAppPracticeLesson = lazy(() => import('../6-Modull/MobileAppPracticeLesson.jsx'))
const PmLesson22 = lazy(() => import('../6-Modull/PmLesson22.jsx'))
const PmLesson23 = lazy(() => import('../6-Modull/PmLesson23.jsx'))
const PmLesson24 = lazy(() => import('../6-Modull/PmLesson24.jsx'))
const PmLesson25 = lazy(() => import('../6-Modull/PmLesson25.jsx'))

const L = (key, n, type, emoji, uz, ru, suz, sru, comp) => ({ key, n, type, emoji, title: { uz, ru }, sub: { uz: suz, ru: sru }, comp })
const MODULES = [
  {
    id: 'm8',
    label: { uz: '8-Modul', ru: '8-Модуль' },
    heading: { uz: '8-Modul — Tizim, AI-agent va mobil ilova', ru: '8-Модуль — Система, ИИ-агент и мобильное приложение' },
    lead: { uz: "Qismlarni bitta ishlaydigan tizimga yig'ish — dastur tartibida.", ru: 'Собрать части в одну работающую систему — в порядке программы.' },
    lessons: [
      L('m6-01', 1, 'Kod', '🧭', 'Komponentlardan tizim', 'Система из компонентов', 'front + back + baza + AI + bot', 'фронт + бэк + база + ИИ + бот', SystemArchitectureLesson),
      L('m6-02', 2, 'PM', '📄', 'Bitta gapni uch kishi bir xil tushunadimi?', 'Поймут ли одну фразу трое одинаково?', "kod yozishdan oldin — bitta varaq, to'rt katak", 'до кода — один лист, четыре клетки', PmLesson22),
      L('m6-03', 3, 'Kod', '🏛️', 'Arxitektura patternlari', 'Паттерны архитектуры', 'MVC, mikroservis — sodda tilda', 'MVC, микросервисы — простым языком', ArchPatternsLesson),
      L('m6-04', 4, 'Kod', '🦾', 'AI-agent nima', 'Что такое AI-агент', 'agent vs oddiy AI — qaror sikli', 'агент и обычный ИИ — цикл решений', AgentArchitectureLesson),
      L('m6-05', 5, 'Kod', '✨', 'Claude Skills — nima', 'Claude Skills', "Skills AI xulqini qanday o'zgartiradi", 'как Skills меняют поведение ИИ', ClaudeSkillsLesson),
      L('m6-06', 6, 'PM', '⚖️', "Ilova o'zi qaror qilsa, kimga tegadi?", 'Если приложение решает само, кого это касается?', 'chegara — mahsulot qarori', 'граница — продуктовое решение', PmLesson23),
      L('m6-07', 7, 'Kod', '🛠️', "O'z Skill'ingizni yozing", 'Создаём свой Skill', 'struktura, test, kontekst', 'структура, тест, контекст', WriteSkillLesson),
      L('m6-08', 8, 'Proyekt', '🔗', "Praktika: to'liq pipeline", 'Практика: полный pipeline', 'React + Node + PG + Telegram + AI', 'React + Node + PG + Telegram + AI', PipelineProjectLesson),
      L('m6-09', 9, 'Kod', '📱', 'React Native — asoslar', 'React Native — основы', 'RN nima, Expo setup', 'что такое RN, настройка Expo', ReactNativeBasicsLesson),
      L('m6-10', 10, 'Kod', '🧳', 'RN: komponent, navigatsiya, API', 'RN: компоненты, навигация, API', 'View, Text, Stack Navigator, fetch', 'View, Text, Stack Navigator, fetch', ReactNativeAppLesson),
      L('m6-11', 11, 'Proyekt', '📲', 'Praktika: mobil ilova', 'Практика: мобильное приложение', 'eski loyihaning mobil versiyasi', 'мобильная версия прошлого проекта', MobileAppPracticeLesson),
      L('m6-12', 12, 'PM', '🗺️', 'Bugun qaysi ish boshlanadi?', 'Какую задачу начинаем сегодня?', 'uch ufq: hozir, uch oydan keyin, olti oydan keyin', 'три горизонта: сейчас, через три и через шесть месяцев', PmLesson24),
      L('m6-13', 13, 'Proyekt', '🏗️', "Loyiha kuni: to'liq tizim", 'Проектный день: полная система', 'end-to-end ishlaydigan tizim', 'система, работающая от начала до конца', FullSystemProjectLesson),
      L('m6-14', 14, 'PM', '🎤', 'Raqamingiz nimani isbotlaydi?', 'Что доказывает ваше число?', 'bitta raqam — bitta slayd', 'одно число — один слайд', PmLesson25),
      L('m6-15', 15, 'Rezerv', '📅', 'Zaxira dars', 'Резервный урок', 'yetib olish / sayqallash', 'догнать / отшлифовать'),
      L('m6-16', 16, 'Demo', '🎤', 'Demo Day 3', 'Demo Day 3', "IT-hamjamiyat oldida 3 daqiqalik pitch", '3-минутный питч перед IT-сообществом'),
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
  h1: { uz: '8-Modul darslari', ru: 'Уроки 8-го модуля' },
  lead: { uz: "Darsni bosing — to'liq ochiladi. Barcha darslar yangi matnga keltirilgan.", ru: 'Нажмите на урок — он откроется полностью. Все уроки обновлены. Русский текст ещё проверяется.' },
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

export default function M6DemoApp() {
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
