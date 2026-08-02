import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'

// 1+2-Modul demo: ikkala modulning BARCHA darslari — bitta Vercel-ko'rik katalogi.
// Tartib va kalitlar App.jsx bilan bir xil (m1-14 Takrorlash 5-o'rin, m1-15 VS Code 10-o'rin).
// Katalog matni ham UZ-RU: til-tugmasi darsga ham, ro'yxatga ham bir vaqtda ta'sir qiladi.
const InternetLesson = lazy(() => import('../1-Modull/InternetLesson.jsx'))
const PmLesson1 = lazy(() => import('../1-Modull/PmLesson1.jsx'))
const Htmllesson1 = lazy(() => import('../1-Modull/Htmllesson1.jsx'))
const Htmllesson2 = lazy(() => import('../1-Modull/Htmllesson2.jsx'))
const HtmlTakrorlashLesson = lazy(() => import('../1-Modull/HtmlTakrorlashLesson.jsx'))
const PmLesson2 = lazy(() => import('../1-Modull/PmLesson2.jsx'))
const CssLesson1 = lazy(() => import('../1-Modull/CssLesson1.jsx'))
const CssLesson2 = lazy(() => import('../1-Modull/CssLesson2.jsx'))
const HtmlPractice = lazy(() => import('../1-Modull/HtmlPractice.jsx'))
const VsCodeLesson = lazy(() => import('../1-Modull/VsCodeLesson.jsx'))
const GitLesson = lazy(() => import('../1-Modull/GitLesson.jsx'))
const CssPractice = lazy(() => import('../1-Modull/CssPractice.jsx'))
const DeployLesson = lazy(() => import('../1-Modull/DeployLesson.jsx'))
const PmLesson3 = lazy(() => import('../1-Modull/PmLesson3.jsx'))

const JsIntroLesson = lazy(() => import('../2-Modull/JsIntroLesson.jsx'))
const PmLesson4 = lazy(() => import('../2-Modull/PmLesson4.jsx'))
const JsVarsLesson = lazy(() => import('../2-Modull/JsVarsLesson.jsx'))
const JsConditionsLesson = lazy(() => import('../2-Modull/JsConditionsLesson.jsx'))
const JsLoopsLesson = lazy(() => import('../2-Modull/JsLoopsLesson.jsx'))
const JsFunctionsLesson = lazy(() => import('../2-Modull/JsFunctionsLesson.jsx'))
const PmLesson5 = lazy(() => import('../2-Modull/PmLesson5.jsx'))
const PracticeLesson1 = lazy(() => import('../2-Modull/PracticeLesson1.jsx'))
const PracticeLesson2 = lazy(() => import('../2-Modull/PracticeLesson2.jsx'))
const PeanStackLesson = lazy(() => import('../2-Modull/PeanStackLesson.jsx'))
const PracticeLesson3 = lazy(() => import('../2-Modull/PracticeLesson3.jsx'))
const PracticeLesson4 = lazy(() => import('../2-Modull/PracticeLesson4.jsx'))
const PmLesson6 = lazy(() => import('../2-Modull/PmLesson6.jsx'))

const MODULES = [
  {
    id: 'm1',
    label: { uz: '1-Modul', ru: 'Модуль 1' },
    heading: { uz: '1-Modul — barcha darslar', ru: 'Модуль 1 — все уроки' },
    lead: {
      uz: "Internet asoslaridan birinchi jonli saytgacha — 15 dars, dastur tartibida.",
      ru: 'От основ интернета до первого живого сайта — 15 уроков в порядке программы.',
    },
    lessons: [
      { key: 'm1-01', n: 1, type: 'Kod', emoji: '🌐', title: { uz: 'Internet qanday ishlaydi', ru: 'Как работает интернет' }, sub: { uz: "brauzer, server, domen, DNS — so'rov yo'li", ru: 'браузер, сервер, домен, DNS — путь запроса' }, comp: InternetLesson },
      { key: 'm1-02', n: 2, type: 'PM', emoji: '🎯', title: { uz: 'Kim mening foydalanuvchim?', ru: 'Кто мой пользователь?' }, sub: { uz: 'auditoriya va saytning maqsadi', ru: 'аудитория и цель сайта' }, comp: PmLesson1 },
      { key: 'm1-03', n: 3, type: 'Kod', emoji: '📄', title: { uz: "HTML qo'lda — 1", ru: 'HTML руками — 1' }, sub: { uz: "teg, sarlavha, ro'yxat, havola", ru: 'тег, заголовок, список, ссылка' }, comp: Htmllesson1 },
      { key: 'm1-04', n: 4, type: 'Kod', emoji: '🖼️', title: { uz: "HTML qo'lda — 2", ru: 'HTML руками — 2' }, sub: { uz: 'rasm, forma, struktura, DevTools', ru: 'картинка, форма, структура, DevTools' }, comp: Htmllesson2 },
      { key: 'm1-14', n: 5, type: 'Kod', emoji: '🛠️', title: { uz: 'Takrorlash: HTML ustaxonasi', ru: 'Повторение: мастерская HTML' }, sub: { uz: 'birinchi mijozlar — 5 buyurtma, debug, imtihon', ru: 'первые клиенты — 5 заказов, отладка, экзамен' }, comp: HtmlTakrorlashLesson },
      { key: 'm1-05', n: 6, type: 'PM', emoji: '🗺️', title: { uz: 'Struktura — mahsulot qarori', ru: 'Структура — продуктовое решение' }, sub: { uz: "bo'limlar tartibi kimga qarab tuziladi", ru: 'порядок разделов зависит от того, для кого сайт' }, comp: PmLesson2 },
      { key: 'm1-06', n: 7, type: 'Kod', emoji: '🎨', title: { uz: "CSS qo'lda — 1", ru: 'CSS руками — 1' }, sub: { uz: "rang, shrift, bo'shliqlar", ru: 'цвет, шрифт, отступы' }, comp: CssLesson1 },
      { key: 'm1-07', n: 8, type: 'Kod', emoji: '📐', title: { uz: "CSS qo'lda — 2", ru: 'CSS руками — 2' }, sub: { uz: 'layout, flexbox, DevTools', ru: 'раскладка, flexbox, DevTools' }, comp: CssLesson2 },
      { key: 'm1-08', n: 9, type: 'Proyekt', emoji: '🧱', title: { uz: 'Praktika: portfolio strukturasi', ru: 'Практика: структура портфолио' }, sub: { uz: "saytni bo'laklaymiz, HTML skelet", ru: 'делим сайт на части, HTML-скелет' }, comp: HtmlPractice },
      { key: 'm1-15', n: 10, type: 'Kod', emoji: '💻', title: { uz: 'VS Code — professional start', ru: 'VS Code — профессиональный старт' }, sub: { uz: "o'rnatish, Emmet, Live Server, jonli card", ru: 'установка, Emmet, Live Server, живая карточка' }, comp: VsCodeLesson },
      { key: 'm1-10', n: 11, type: 'Proyekt', emoji: '💅', title: { uz: 'Praktika: bezash va yakunlash', ru: 'Практика: оформление и финал' }, sub: { uz: 'CSS + kontent + AI bilan tugma', ru: 'CSS + контент + кнопка с помощью AI' }, comp: CssPractice },
      { key: 'm1-09', n: 12, type: 'Kod', emoji: '🔀', title: { uz: 'Git va GitHub', ru: 'Git и GitHub' }, sub: { uz: 'commit, push — kod uchun vaqt mashinasi', ru: 'commit, push — машина времени для кода' }, comp: GitLesson },
      { key: 'm1-11', n: 13, type: 'Kod', emoji: '🚀', title: { uz: 'Netlify va deploy', ru: 'Netlify и деплой' }, sub: { uz: 'hosting, maktab poddomeni', ru: 'хостинг, школьный поддомен' }, comp: DeployLesson },
      { key: 'm1-12', n: 14, type: 'PM', emoji: '🎤', title: { uz: "Storytelling: mahsulotni so'zlab berish", ru: 'Сторителлинг: рассказать о продукте' }, sub: { uz: '2 daqiqalik taqdimot: muammo → yechim → demo', ru: 'презентация на 2 минуты: проблема → решение → демо' }, comp: PmLesson3 },
      { key: 'm1-13', n: 15, type: 'Demo', emoji: '🎤', title: { uz: 'Demo Day 1', ru: 'Demo Day 1' }, sub: { uz: 'ota-onalar oldida ochiq himoya', ru: 'открытая защита перед родителями' } },
    ],
  },
  {
    id: 'm2',
    label: { uz: '2-Modul', ru: 'Модуль 2' },
    heading: { uz: '2-Modul — barcha darslar', ru: 'Модуль 2 — все уроки' },
    lead: {
      uz: "JavaScript asoslaridan ishlaydigan MVP'gacha — 15 dars, dastur tartibida.",
      ru: 'От основ JavaScript до работающего MVP — 15 уроков в порядке программы.',
    },
    lessons: [
      { key: 'm2-01', n: 1, type: 'Kod', emoji: '🧠', title: { uz: 'Sistema va Algoritm', ru: 'Система и алгоритм' }, sub: { uz: "komponent, bog'lanish, ketma-ketlik", ru: 'компонент, связь, последовательность' }, comp: JsIntroLesson },
      { key: 'm2-02', n: 2, type: 'PM', emoji: '💊', title: { uz: 'Muammodan yechimga', ru: 'От проблемы к решению' }, sub: { uz: "har imkoniyat qaysi qiyinchilikni yo'qotadi?", ru: 'какую трудность убирает каждая возможность?' }, comp: PmLesson4 },
      { key: 'm2-03', n: 3, type: 'Kod', emoji: '📦', title: { uz: "JS — O'zgaruvchilar", ru: 'JS — Переменные' }, sub: { uz: "let / const / var, ma'lumot turlari", ru: 'let / const / var, типы данных' }, comp: JsVarsLesson },
      { key: 'm2-04', n: 4, type: 'Kod', emoji: '🔀', title: { uz: 'JS — if / else', ru: 'JS — if / else' }, sub: { uz: 'shart, taqqoslash operatorlari', ru: 'условие, операторы сравнения' }, comp: JsConditionsLesson },
      { key: 'm2-05', n: 5, type: 'Kod', emoji: '🔁', title: { uz: 'JS — Sikllar', ru: 'JS — Циклы' }, sub: { uz: 'for, while, massivni aylanish', ru: 'for, while, обход массива' }, comp: JsLoopsLesson },
      { key: 'm2-06', n: 6, type: 'Kod', emoji: '🧩', title: { uz: 'JS — Funksiyalar, Array + Object', ru: 'JS — Функции, Array + Object' }, sub: { uz: 'parametr, return, xotira (Stack/Heap)', ru: 'параметр, return, память (Stack/Heap)' }, comp: JsFunctionsLesson },
      { key: 'm2-07', n: 7, type: 'PM', emoji: '🪜', title: { uz: 'Dekompozitsiya — PM quroli', ru: 'Декомпозиция — инструмент PM' }, sub: { uz: "katta rejani bo'laklab, MVP va backlog qilish", ru: 'разбить большой план на части: MVP и бэклог' }, comp: PmLesson5 },
      { key: 'm2-08', n: 8, type: 'Proyekt', emoji: '⚡', title: { uz: 'Loyiha kuni: saytga jon', ru: 'День проекта: оживляем сайт' }, sub: { uz: 'HTML/CSS saytga interaktivlik', ru: 'интерактивность для HTML/CSS-сайта' }, comp: PracticeLesson1 },
      { key: 'm2-09', n: 9, type: 'Proyekt', emoji: '🤖', title: { uz: 'Loyiha kuni: AI bilan tez sayt', ru: 'День проекта: быстрый сайт с AI' }, sub: { uz: 'prompt orqali sifatli loyiha', ru: 'качественный проект через промпт' }, comp: PracticeLesson2 },
      { key: 'm2-10', n: 10, type: 'Kod', emoji: '🍽️', title: { uz: "PERN Stack — umumiy ko'rinish", ru: 'PERN Stack — общий обзор' }, sub: { uz: 'PostgreSQL + Express + React + Node', ru: 'PostgreSQL + Express + React + Node' }, comp: PeanStackLesson },
      { key: 'm2-11', n: 11, type: 'Proyekt', emoji: '🛠️', title: { uz: 'Dekompozitsiya va ishlab chiqish — 1', ru: 'Декомпозиция и разработка — 1' }, sub: { uz: "AI'ni ochishdan oldin bo'laklaymiz", ru: 'делим на части ещё до запуска AI' }, comp: PracticeLesson3 },
      { key: 'm2-12', n: 12, type: 'Proyekt', emoji: '🚀', title: { uz: 'Ishlab chiqish — 2: MVP tayyor', ru: 'Разработка — 2: MVP готов' }, sub: { uz: "feature'larni yakunlash, deploy", ru: 'доводим возможности до конца, деплой' }, comp: PracticeLesson4 },
      { key: 'm2-13', n: 13, type: 'PM', emoji: '🎤', title: { uz: 'Sistemani qanday pitch qilish', ru: 'Как питчить систему' }, sub: { uz: "arxitekturani texnik bo'lmagan odamga", ru: 'архитектура для нетехнического человека' }, comp: PmLesson6 },
      { key: 'm2-14', n: 14, type: 'Rezerv', emoji: '📅', title: { uz: 'Zaxira dars', ru: 'Резервный урок' }, sub: { uz: 'yetib olish / sayqallash', ru: 'догнать / отшлифовать' } },
      { key: 'm2-15', n: 15, type: 'Demo', emoji: '🎤', title: { uz: 'Demo Day', ru: 'Demo Day' }, sub: { uz: 'guruh oldida ichki himoya', ru: 'внутренняя защита перед группой' } },
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
  hint: { uz: "Darsni bosing — to'liq ochiladi. Til tugmasi darsga ham, ro'yxatga ham ta'sir qiladi.", ru: 'Нажмите на урок — он откроется полностью. Кнопка языка меняет и урок, и список.' },
  loading: { uz: 'Dars yuklanmoqda…', ru: 'Урок загружается…' },
  soon: { uz: 'jonli dars', ru: 'живой урок' },
  home: { uz: "Darslar ro'yxatiga qaytish", ru: 'Вернуться к списку уроков' },
  langLesson: { uz: "Dars tili: o'zbekcha", ru: 'Язык урока: русский' },
  langList: { uz: "Darslar tili: o'zbekcha", ru: 'Язык уроков: русский' },
  h1: { uz: '1 va 2-Modul — barcha darslar', ru: 'Модули 1 и 2 — все уроки' },
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

export default function M1DemoApp() {
  const key = useRoute()
  const lesson = useMemo(() => ALL_LESSONS.find(l => l.key === key && l.comp), [key])
  // UZ-RU: global dars tili — localStorage'da saqlanadi (asosiy App.jsx bilan bir xil kalit)
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('cc_lang') === 'ru' ? 'ru' : 'uz' } catch { return 'uz' }
  })
  const pickLang = (l) => { setLang(l); try { localStorage.setItem('cc_lang', l) } catch {} }
  useEffect(() => { window.scrollTo(0, 0) }, [key])

  if (lesson) {
    const C = lesson.comp
    return (
      <Suspense fallback={<Loading lang={lang} />}>
        <C lang={lang} />
        <a href="#/" title={UI.home[lang]} aria-label={UI.home[lang]}
          style={{ position: 'fixed', bottom: 14, left: 14, zIndex: 950, width: 40, height: 40, borderRadius: 12, border: 'none', background: '#FFFFFF', color: '#5A5A60', fontSize: 19, lineHeight: '40px', textAlign: 'center', textDecoration: 'none', cursor: 'pointer', boxShadow: '0 6px 18px -6px rgba(58,53,48,0.35)', opacity: 0.55, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>⌂</a>
        <div style={{ position: 'fixed', bottom: 14, left: 62, zIndex: 950, display: 'flex', borderRadius: 12, background: '#FFFFFF', boxShadow: '0 6px 18px -6px rgba(58,53,48,0.35)', overflow: 'hidden', opacity: 0.55, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>
          {['uz', 'ru'].map(l => (
            <button key={l} title={UI.langLesson[l]} onClick={() => pickLang(l)}
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
        .m1-lang { display: flex; border-radius: 10px; background: #fff; overflow: hidden; box-shadow: 0 4px 12px -8px rgba(58,53,48,0.3); }
        .m1-mod { margin-top: 36px; scroll-margin-top: 16px; }
        .m1-mod-h { margin: 0 0 6px; font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: clamp(21px,3.2vw,27px); color: #0E0E10; }
        .m1-mod-lead { margin: 0 0 16px; font-size: 13.5px; font-weight: 500; color: #5A5A60; max-width: 560px; }
        .m1-tabs { display: flex; gap: 8px; margin: 0 0 8px; flex-wrap: wrap; }
        .m1-tab { text-decoration: none; cursor: pointer; font-family: 'Manrope', system-ui, sans-serif; font-weight: 800; font-size: 12.5px; padding: 8px 15px; border-radius: 99px; background: #fff; color: #5A5A60; box-shadow: 0 4px 12px -8px rgba(58,53,48,0.3); transition: background 0.15s, color 0.15s; }
        .m1-tab:hover { background: #0E0E10; color: #fff; }
        @media (prefers-reduced-motion: reduce) { .m1-card, .m1-arrow { transition: none } .m1-card:hover { transform: none } }
        @media (max-width: 620px) { .m1-card { gap: 10px; padding: 12px } .m1-chip { display: none } }
      `}</style>
      <div className="m1-wrap">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 11.5, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF4F28' }}>CoddyCamp · Senior 2026</p>
            <h1 style={{ margin: '0 0 8px', fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 'clamp(26px,4.4vw,38px)', color: '#0E0E10' }}>{UI.h1[lang]}</h1>
            <p style={{ margin: '0 0 22px', fontSize: 14, fontWeight: 500, color: '#5A5A60', maxWidth: 560 }}>{UI.hint[lang]}</p>
          </div>
          <div className="m1-lang">
            {['uz', 'ru'].map(l => (
              <button key={l} onClick={() => pickLang(l)} title={UI.langList[l]}
                style={{ width: 40, height: 34, border: 'none', cursor: 'pointer', fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 800, fontSize: 12, background: lang === l ? '#0E0E10' : 'transparent', color: lang === l ? '#fff' : '#5A5A60' }}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
        <div className="m1-tabs">
          {MODULES.map(m => <a key={m.id} className="m1-tab" href={`#${m.id}`}>{m.label[lang]}</a>)}
        </div>
        {MODULES.map(m => (
          <section key={m.id} id={m.id} className="m1-mod">
            <h2 className="m1-mod-h">{m.heading[lang]}</h2>
            <p className="m1-mod-lead">{m.lead[lang]}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {m.lessons.map(l => {
                const cc = CHIP_COLORS[l.type] || CHIP_COLORS.Kod
                const inner = (
                  <>
                    <span className="m1-num">{l.n}</span>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{l.emoji}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 15, fontWeight: 800, color: '#0E0E10', marginBottom: 2 }}>{l.title[lang]}</span>
                      <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#5A5A60' }}>{l.sub[lang]}</span>
                    </span>
                    <span className="m1-chip" style={{ background: cc.bg, color: cc.c }}>{(CHIP_LABEL[l.type] || CHIP_LABEL.Kod)[lang]}</span>
                    {l.comp ? <span className="m1-arrow">→</span> : <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, color: '#A7A6A2' }}>{UI.soon[lang]}</span>}
                  </>
                )
                return l.comp
                  ? <a key={l.key} className="m1-card" href={`#/${l.key}`}>{inner}</a>
                  : <div key={l.key} className="m1-card soon">{inner}</div>
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
