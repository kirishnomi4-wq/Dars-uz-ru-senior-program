import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'

// 12-Modul QA-demosi (07.10.2026, F-1006-389): alohida Vercel loyihasi — QA ko'rib fidbek beradi. Kod papkasi src/10-Modull (LMS'da «12-Modul»).
// LMS'ga yuklanmaydi (28.09 qarori: LMS'ga faqat integratsiyalashgan 1–4-Modul). Naqsh — src/m9-demo (11-Modul QA sayti). Tartib App.jsx (m10) bilan bir xil; generator — ru sarlavha darsning LESSON_META sidan.
const PmLandingLesson = lazy(() => import('../10-Modull/PmLandingLesson.jsx'))
const WebSocketBasicsLesson = lazy(() => import('../10-Modull/WebSocketBasicsLesson.jsx'))
const PmRealtimeSpecLesson = lazy(() => import('../10-Modull/PmRealtimeSpecLesson.jsx'))
const LiveNotifyDayLesson = lazy(() => import('../10-Modull/LiveNotifyDayLesson.jsx'))
const BreakAndFixLesson = lazy(() => import('../10-Modull/BreakAndFixLesson.jsx'))
const PmChannelsLesson = lazy(() => import('../10-Modull/PmChannelsLesson.jsx'))
const PmFiftyUsersLesson = lazy(() => import('../10-Modull/PmFiftyUsersLesson.jsx'))
const PmDropOffLesson = lazy(() => import('../10-Modull/PmDropOffLesson.jsx'))
const RetentionDayLesson = lazy(() => import('../10-Modull/RetentionDayLesson.jsx'))
const PmUsersCheckLesson = lazy(() => import('../10-Modull/PmUsersCheckLesson.jsx'))
const PmPitchReviewLesson = lazy(() => import('../10-Modull/PmPitchReviewLesson.jsx'))
const PmGrowthPitchLesson = lazy(() => import('../10-Modull/PmGrowthPitchLesson.jsx'))

const L = (key, n, type, emoji, uz, ru, suz, sru, comp) => ({ key, n, type, emoji, title: { uz, ru }, sub: { uz: suz, ru: sru }, comp })
const MODULES = [
  {
    id: 'm12',
    label: { uz: '12-Modul', ru: '12-Модуль' },
    heading: { uz: "12-Modul — Real vaqt va ishga tushirish", ru: '12-Модуль — Реальное время и запуск' },
    lead: { uz: "Mahsulot jonlanadi: ekran o'zi yangilanadi, eslatma keladi — va uni 50 haqiqiy foydalanuvchi ishlatadi.", ru: 'Продукт оживает: экран обновляется сам, приходит напоминание — и им пользуются 50 настоящих пользователей.' },
    lessons: [
      L("m10-01", 1, "PM", "📰", "Mahsulotingizni bir sahifada qanday tanishtirasiz?", "Как представить продукт на одной странице?", "lending: sarlavha, foyda va bitta tugma", "лендинг: заголовок, польза и одна кнопка", PmLandingLesson),
      L("m10-02", 2, "Kod", "🔌", "WebSocket: ekran o'zi yangilanadigan ulanish", "WebSocket: соединение, при котором экран обновляется сам", "doimiy ulanish, hodisalar va real vaqt oqimi sxemasi", "постоянное соединение, события и схема потока в реальном времени", WebSocketBasicsLesson),
      L("m10-03", 3, "PM", "📝", "Ekran o'zi yangilanishi uchun nimani yozasiz?", "Что написать, чтобы экран обновлялся сам?", "real vaqt talabi: hodisalar, ulanish holatlari, chekka holatlar", "требование к реальному времени: события, состояния соединения, крайние случаи", PmRealtimeSpecLesson),
      L("m10-04", 4, "Proyekt", "🔔", "Loyiha kuni: jonli xabar va eslatma", "День проекта: живое сообщение и напоминание", "hozir ko'ryapti, jonli xabar; mobil trekda — telefonga eslatma", "«Сейчас смотрят», живое сообщение; в мобильном треке — напоминание на телефон", LiveNotifyDayLesson),
      L("m10-05", 5, "Kod", "🧯", "Ulanish uzilsa: buzamiz va tuzatamiz", "Если соединение оборвётся: ломаем и чиним", "uzilish, takror hodisa, qayta ulanish — uchta muammo", "обрыв, повторное событие, переподключение — три проблемы", BreakAndFixLesson),
      L("m10-06", 6, "PM", "📣", "Birinchi foydalanuvchilar sizni qayerdan topadi?", "Где вас найдут первые пользователи?", "kanallar va birinchi post", "каналы и первый пост", PmChannelsLesson),
      L("m10-07", 7, "PM", "🚀", "50 foydalanuvchiga qanday yetasiz?", "Как дойти до 50 пользователей?", "yig'ish rejasi va ishga tushirish", "план набора и запуск", PmFiftyUsersLesson),
      L("m10-08", 8, "PM", "🔎", "Foydalanuvchilar qaysi qadamda to'xtab qolyapti?", "На каком шаге пользователи останавливаются?", "qadamlar bo'yicha sanoq, gipoteza va shu darsda tuzatish", "подсчёт по шагам, гипотеза и исправление на этом уроке", PmDropOffLesson),
      L("m10-09", 9, "Proyekt", "🔁", "Loyiha kuni: foydalanuvchini qaytaradigan eslatma", "День проекта: напоминание, которое возвращает пользователя", "hodisadan eslatmagacha — talabni siz yozasiz", "от события до напоминания — требование пишете вы", RetentionDayLesson),
      L("m10-10", 10, "PM", "📊", "50 foydalanuvchiga yetdingizmi?", "Дошли до 50 пользователей?", "Mentor tekshiruvi: metrika hisoboti va zaxira reja", "проверка Ментора: отчёт по метрикам и запасной план", PmUsersCheckLesson),
      L("m10-11", 11, "PM", "🤝", "Raqamlaringiz pitchni qanday o'zgartiradi?", "Как ваши цифры меняют питч?", "Mentor bilan yakkama-yakka: tuzatilgan pitch", "встреча один на один с Ментором: исправленный питч", PmPitchReviewLesson),
      L("m10-12", 12, "PM", "🎤", "Raqamlaringiz zalni ishontiradimi?", "Убедят ли ваши цифры зал?", "metrikali pitch: o'sish grafigi — dalil", "питч с метриками: график роста — довод", PmGrowthPitchLesson),
      L("m10-13", 13, "Rezerv", "📅", "Zaxira dars", "Резервный урок", "taymer bilan to'liq repetitsiya", "полная репетиция с таймером"),
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
  h1: { uz: '12-Modul darslari', ru: 'Уроки 12-го модуля' },
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

export default function M10DemoApp() {
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
