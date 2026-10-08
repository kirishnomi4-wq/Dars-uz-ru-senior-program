import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'

// 7-Modul (LMS v9 raqami; kod src/5-Modull) QA-demosi (2026-09-28; 08.10 dan sayt coddycamp-7modul): alohida Vercel loyihasi — QA ko'rib fidbek beradi.
// LMS'ga yuklanmaydi (foydalanuvchi qarori 28.09: LMS'ga faqat integratsiyalashgan 1–4-Modul).
// Tartib va komponentlar App.jsx (m5) bilan bir xil; katalog UZ-RU (cc_lang), har darsga lang prop uzatiladi.
const BotIntroLesson = lazy(() => import('../5-Modull/BotIntroLesson.jsx'))
const PmLesson19 = lazy(() => import('../5-Modull/PmLesson19.jsx'))
const BotApiButtonsLesson = lazy(() => import('../5-Modull/BotApiButtonsLesson.jsx'))
const BotStatefulMemoryLesson = lazy(() => import('../5-Modull/BotStatefulMemoryLesson.jsx'))
const BotAiProjectLesson = lazy(() => import('../5-Modull/BotAiProjectLesson.jsx'))
const BotAiBrainLesson = lazy(() => import('../5-Modull/BotAiBrainLesson.jsx'))
const BotFullProjectLesson = lazy(() => import('../5-Modull/BotFullProjectLesson.jsx'))
const PmLesson20 = lazy(() => import('../5-Modull/PmLesson20.jsx'))
const BotFeedbackIterationLesson = lazy(() => import('../5-Modull/BotFeedbackIterationLesson.jsx'))
const BotAiAgentLesson = lazy(() => import('../5-Modull/BotAiAgentLesson.jsx'))
const PmMetricsLesson = lazy(() => import('../pm/PmMetricsLesson.jsx')) // F-0928-06: v9 7-Modul #11
const PmLesson21 = lazy(() => import('../5-Modull/PmLesson21.jsx'))

// Katalog matnlari: har maydon {uz, ru}. Sarlavhalar App.jsx (UZ) bilan bir xil.
const MODULES = [
  {
    id: 'm5',
    label: { uz: '7-Modul', ru: '7-Модуль' },
    heading: { uz: '7-Modul — Botlar va avtomatlashtirish', ru: '7-Модуль — Боты и автоматизация' },
    lead: { uz: "Real odamlar bilan birinchi jonli mahsulot tajribasi — dastur tartibida.", ru: 'Первый живой продукт с реальными людьми — в порядке программы.' },
    lessons: [
      { key: 'm5-01', n: 1, type: 'Kod', emoji: '🤖', title: { uz: "Bot nima", ru: "Что такое бот" }, sub: { uz: "hodisaga javob beradigan mantiq: signal keladi, bot amal qiladi", ru: "логика, отвечающая на событие: пришёл сигнал — бот действует" }, comp: BotIntroLesson },
      { key: 'm5-02', n: 2, type: 'PM', emoji: '🧲', title: { uz: "Botingizni birinchi kim ochadi?", ru: "Кто первым откроет вашего бота?" }, sub: { uz: "yigirmata odam qayerdan keladi", ru: "откуда придут двадцать человек" }, comp: PmLesson19 },
      { key: 'm5-03', n: 3, type: 'Kod', emoji: '🎛️', title: { uz: "Telegram Bot API + tugmalar", ru: "Telegram Bot API + кнопки" }, sub: { uz: "BotFather, token, /start, inline", ru: "BotFather, токен, /start, inline" }, comp: BotApiButtonsLesson },
      { key: 'm5-04', n: 4, type: 'Kod', emoji: '🧠', title: { uz: "Bot eslab qoladi — holat va PostgreSQL", ru: "Бот запоминает — состояние и PostgreSQL" }, sub: { uz: "bot eslab qoladi, ma'lumot saqlaydi", ru: "бот запоминает и хранит данные" }, comp: BotStatefulMemoryLesson },
      { key: 'm5-05', n: 5, type: 'Proyekt', emoji: '🪄', title: { uz: "Loyiha kuni: AI bilan bot", ru: "Проектный день: бот с ИИ" }, sub: { uz: "promptlar bilan istalgan Telegram bot", ru: "любой Telegram-бот с помощью промптов" }, comp: BotAiProjectLesson },
      { key: 'm5-06', n: 6, type: 'Proyekt', emoji: '💡', title: { uz: "Bot ichida AI", ru: "ИИ внутри бота" }, sub: { uz: "AI API'ni ulash, xulq sozlash", ru: "подключить AI API, настроить поведение" }, comp: BotAiBrainLesson },
      { key: 'm5-07', n: 7, type: 'Proyekt', emoji: '📦', title: { uz: "Loyiha kuni: bot + DB + AI", ru: "Проектный день: бот + БД + ИИ" }, sub: { uz: "to'liq ishlaydigan bot + hosting", ru: "полностью рабочий бот + хостинг" }, comp: BotFullProjectLesson },
      { key: 'm5-08', n: 8, type: 'PM', emoji: '🎙️', title: { uz: 'Botingizni ishlatgan odamdan nimani so\'raysiz?', ru: 'О чём спросить человека, который пользовался вашим ботом?' }, sub: { uz: "bo'lib o'tgan ishini so'rash va eshitganini yozib olish", ru: "спросить о том, что было, и записать услышанное" }, comp: PmLesson20 },
      { key: 'm5-09', n: 9, type: 'Proyekt', emoji: '🔁', title: { uz: "Foydalanuvchi fikri va iteratsiya", ru: "Отзывы пользователей и итерация" }, sub: { uz: "foydalanuvchi nima dedi va nimani tuzatamiz", ru: "что сказал пользователь и что исправим" }, comp: BotFeedbackIterationLesson },
      { key: 'm5-10', n: 10, type: 'Proyekt', emoji: '🦾', title: { uz: "AI-agent yaratish", ru: "Создание ИИ-агента" }, sub: { uz: "idrok, qaror va amal sikli", ru: "цикл: восприятие, решение, действие" }, comp: BotAiAgentLesson },
      { key: 'm5-14', n: 11, type: 'PM', emoji: '⭐', title: { uz: 'Botingiz yaxshi ishlayotganini qaysi raqam aytadi?', ru: 'Какая цифра скажет, что ваш бот работает хорошо?' }, sub: { uz: "bitta bosh raqam va unga yordam beradigan uch raqam", ru: "одно главное число и три помогающих ему" }, comp: PmMetricsLesson },
      { key: 'm5-11', n: 12, type: 'PM', emoji: '📈', title: { uz: 'Kecha kelgan odam bugun ham keldimi?', ru: 'Тот, кто пришёл вчера, пришёл ли сегодня?' }, sub: { uz: "kelganlar va qaytganlar — ikki xil son", ru: "пришедшие и вернувшиеся — два разных числа" }, comp: PmLesson21 },
      { key: 'm5-12', n: 13, type: 'Rezerv', emoji: '📅', title: { uz: "Zaxira dars", ru: "Резервный урок" }, sub: { uz: "yetib olish / sayqallash", ru: "догнать / отшлифовать" } },
      { key: 'm5-13', n: 14, type: 'Demo', emoji: '🎤', title: { uz: "Demo Day", ru: "Demo Day" }, sub: { uz: "jonli bot + 20 foydalanuvchi + metrika", ru: "живой бот + 20 пользователей + метрика" } },
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
  h1: { uz: '7-Modul darslari', ru: 'Уроки 7-го модуля' },
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

export default function M5DemoApp() {
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
        <a href="#/" title={UI.back[lang]} aria-label={UI.back[lang]}
          style={{ position: 'fixed', bottom: 14, left: 14, zIndex: 950, width: 40, height: 40, borderRadius: 12, border: 'none', background: '#FFFFFF', color: '#5A5A60', fontSize: 19, lineHeight: '40px', textAlign: 'center', textDecoration: 'none', cursor: 'pointer', boxShadow: '0 6px 18px -6px rgba(58,53,48,0.35)', opacity: 0.55, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>⌂</a>
        {/* UZ-RU: dars ichida til almashtirgich — ⌂ yonida, progress saqlanadi (komponent remount bo'lmaydi) */}
        <div style={{ position: 'fixed', bottom: 14, left: 62, zIndex: 950, display: 'flex', borderRadius: 12, background: '#FFFFFF', boxShadow: '0 6px 18px -6px rgba(58,53,48,0.35)', overflow: 'hidden', opacity: 0.55, transition: 'opacity 0.2s' }}
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
