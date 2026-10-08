import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'

// 14-Modul QA-demosi (08.10.2026): alohida Vercel loyihasi — QA ko'rib fidbek beradi. Kod papkasi src/12-Modull (LMS'da «14-Modul»).
// LMS'ga yuklanmaydi (28.09 qarori). Naqsh — src/m11-demo (13-Modul QA sayti); katalog — dastur v9 jadvali ko'rinishida
// (№ · Tip · Mavzu · Mazmun · Natija), emojisiz. Mazmun va Natija — dastur v9 dan (feedback/F-1008-14modul/00-SEANS_PROMPT.md 2-bo'lim), kurs atamalarida.
const PmInvestorPitchLesson = lazy(() => import('../12-Modull/PmInvestorPitchLesson.jsx'))
const PmStoryPitchLesson = lazy(() => import('../12-Modull/PmStoryPitchLesson.jsx'))
const ProductSpeedLesson = lazy(() => import('../12-Modull/ProductSpeedLesson.jsx'))
const PolishDayLesson = lazy(() => import('../12-Modull/PolishDayLesson.jsx'))
const PmPitchTrainingLesson = lazy(() => import('../12-Modull/PmPitchTrainingLesson.jsx'))
const DemoPrepLesson = lazy(() => import('../12-Modull/DemoPrepLesson.jsx'))
const PmDemoTestLesson = lazy(() => import('../12-Modull/PmDemoTestLesson.jsx'))
const PmFinalPitchLesson = lazy(() => import('../12-Modull/PmFinalPitchLesson.jsx'))
const VideoPortfolioLesson = lazy(() => import('../12-Modull/VideoPortfolioLesson.jsx'))
const PmFreelanceLesson = lazy(() => import('../12-Modull/PmFreelanceLesson.jsx'))
const PmProgramsLesson = lazy(() => import('../12-Modull/PmProgramsLesson.jsx'))
const PmNextStepsLesson = lazy(() => import('../12-Modull/PmNextStepsLesson.jsx'))
const PmDressRehearsalLesson = lazy(() => import('../12-Modull/PmDressRehearsalLesson.jsx'))

// tip — dastur v9 dagi tip (TEX · PM · PM+PRAKT · AI-PRAKT · REZERV · DEMO · MAROSIM)
const L = (key, n, tip, uz, ru, mz, nt, comp) => ({ key, n, tip, title: { uz, ru }, mazmun: mz, natija: nt, comp })
const LESSONS = [
  L('m12-01', 1, 'PM', "Investorga pitchni qanday tuzasiz?", 'Как построить питч для инвестора?',
    { uz: "Olti bo'lak: Muammo, Bozor, Yechim, Raqamlar, Jamoa, Keyingi qadam; Airbnb taqdimoti misolida", ru: 'Шесть частей: Проблема, Рынок, Решение, Цифры, Команда, Следующий шаг; на примере презентации Airbnb' },
    { uz: "Pitchning birinchi qoralamasi", ru: 'Первый черновик питча' }, PmInvestorPitchLesson),
  L('m12-02', 2, 'PM', "Mahsulotingiz hikoyasini qanday aytasiz?", 'Как рассказать историю вашего продукта?',
    { uz: "5 daqiqalik pitch — hikoya, funksiyalar ro'yxati emas", ru: '5-минутный питч — история, а не список функций' },
    { uz: "O'zini videoga yozadi", ru: 'Записывает себя на видео' }, PmStoryPitchLesson),
  L('m12-03', 3, 'TEX', "Mahsulot tezligi: o'lchaymiz va tezlashtiramiz", 'Скорость продукта: измеряем и ускоряем',
    { uz: "Lighthouse, rasmlar (keyin yuklash) va yuklanadigan kod hajmi — tanish saytlarning haqiqiy o'lchovi bilan", ru: 'Lighthouse, картинки (отложенная загрузка) и объём загружаемого кода — на реальных замерах известных сайтов' },
    { uz: "Oldin va keyin o'lchov", ru: 'Замер до и после' }, ProductSpeedLesson),
  L('m12-04', 4, 'AI-PRAKT', "Loyiha kuni: demo uchun sayqal", 'День проекта: шлифовка для демо',
    { uz: "Demo yo'lidagi uch joy: bosish, yuklanish, muvaffaqiyat", ru: 'Три места на пути демо: нажатие, загрузка, успех' },
    { uz: "Demo yo'li sayqallangan", ru: 'Путь демо отшлифован' }, PolishDayLesson),
  L('m12-05', 5, 'PM', "Guruh pitchingizda nimani tuzatishni aytadi?", 'Что группа советует исправить в вашем питче?',
    { uz: "Guruh oldida pitch — baholash varag'i va qattiq, lekin hurmatli fidbek", ru: 'Питч перед группой — лист оценки и жёсткий, но уважительный фидбек' },
    { uz: "Tuzatishlar ro'yxati", ru: 'Список исправлений' }, PmPitchTrainingLesson),
  L('m12-06', 6, 'TEX', "Demoga tayyorgarlik: risklar va B reja", 'Подготовка к демо: риски и план Б',
    { uz: "Demo ssenariysi, texnik risklar, B reja; yangi funksiya to'xtatiladi", ru: 'Сценарий демо, технические риски, план Б; новые функции замораживаются' },
    { uz: "Demo o'tishi repetitsiya qilingan", ru: 'Прогон демо отрепетирован' }, DemoPrepLesson),
  L('m12-07', 7, 'PM+PRAKT', "Investor ko'zi bilan: demo buzilmaydimi?", 'Глазами инвестора: не сломается ли демо?',
    { uz: "Demo tekshiruvi: tarmoq uzilishi, bo'sh ma'lumot, ikki marta bosish — buzamiz, agent tuzatadi", ru: 'Проверка демо: обрыв сети, пустые данные, двойной клик — ломаем, агент чинит' },
    { uz: "Uch demo o'tishi xatosiz + B reja ishlaydi", ru: 'Три прогона без ошибок + план Б работает' }, PmDemoTestLesson),
  L('m12-08', 8, 'PM', "Final pitchingiz 5 daqiqaga tayyormi?", 'Готов ли ваш финальный питч на 5 минут?',
    { uz: "Tuzatishlar va taymer bilan final repetitsiya, savol-javob", ru: 'Финальная репетиция с исправлениями и таймером, вопросы-ответы' },
    { uz: "Final pitch tayyor", ru: 'Финальный питч готов' }, PmFinalPitchLesson),
  L('m12-09', 9, 'TEX', "Video-portfolio: 3 daqiqada o'zingiz va mahsulot", 'Видео-портфолио: вы и продукт за 3 минуты',
    { uz: "O'zingiz va mahsulotingiz haqida 3 daqiqalik video — frilans va stajirovka uchun", ru: '3-минутное видео о себе и продукте — для фриланса и стажировки' },
    { uz: "Tayyor video-portfolio", ru: 'Готовое видео-портфолио' }, VideoPortfolioLesson),
  L('m12-10', 10, 'PM', "Birinchi buyurtmani qayerdan topasiz?", 'Где найти первый заказ?',
    { uz: "Birinchi buyurtma (tanish doira) va kompaniyaga xat", ru: 'Первый заказ (знакомый круг) и письмо в компанию' },
    { uz: "Buyurtma rejasi + ikki xat qoralamasi", ru: 'План заказа + два черновика письма' }, PmFreelanceLesson),
  L('m12-11', 11, 'PM', "Qaysi xalqaro dasturga ariza berasiz?", 'В какую международную программу подадите заявку?',
    { uz: "Diamond Challenge, Y Combinator: shartlar va ariza", ru: 'Diamond Challenge, Y Combinator: условия и заявка' },
    { uz: "Bitta dastur + boshlangan ariza", ru: 'Одна программа + начатая заявка' }, PmProgramsLesson),
  L('m12-12', 12, 'PM', "Keyingi olti oyda nima qilasiz?", 'Что вы будете делать следующие полгода?',
    { uz: "Mentor bilan yakkama-yakka: keyingi olti oyga shaxsiy reja", ru: 'Один на один с Ментором: личный план на полгода' },
    { uz: "Yozma reja", ru: 'Письменный план' }, PmNextStepsLesson),
  L('m12-13', 13, 'PM', "Demo Day'ga tayyormisiz?", 'Готовы ли вы к Demo Day?',
    { uz: "Hakamlar oldidan to'liq repetitsiya", ru: 'Полная репетиция перед судьями' },
    { uz: '—', ru: '—' }, PmDressRehearsalLesson),
  L('m12-14', 14, 'REZERV', "Zaxira dars: zalni tayyorlash", 'Резервный урок: подготовка зала',
    { uz: "Tashkiliy dars", ru: 'Организационный урок' }, { uz: '—', ru: '—' }),
  L('m12-15', 15, 'PM', "Bitiruvchilar bilan uchrashuv", 'Встреча выпускников',
    { uz: "Tadbir — tashkilotchi bilan", ru: 'Мероприятие — с организатором' }, { uz: '—', ru: '—' }),
  L('m12-16', 16, 'DEMO', "Demo Day 8 — bitiruv himoyasi", 'Demo Day 8 — защита выпускников',
    { uz: "Hakamlar: 5–7 investor va tadbirkor", ru: 'Судьи: 5–7 инвесторов и предпринимателей' },
    { uz: "5 daqiqa pitch va savol-javob", ru: '5 минут питч и вопросы-ответы' }),
  L('m12-17', 17, 'MAROSIM', "Bitiruv marosimi", 'Выпускной',
    { uz: "Sertifikatlar, video-portfolio, g'oliblar", ru: 'Сертификаты, видео-портфолио, победители' }, { uz: '—', ru: '—' }),
]

const TIP_RANG = { TEX: '#0F6B4F', PM: '#6B3FD8', 'PM+PRAKT': '#2F5FA8', 'AI-PRAKT': '#B4561A', REZERV: '#7A7872', DEMO: '#B23A48', MAROSIM: '#8A6D1D' }
const TIP_SANOQ = [['TEX', { uz: 'TEX dars', ru: 'TEX урок' }], ['AI-PRAKT', { uz: 'AI-PRAKTIKA', ru: 'AI-ПРАКТИКА' }], ['PM+PRAKT', { uz: 'PM+PRAKT', ru: 'PM+PRAKT' }], ['PM', { uz: 'PM', ru: 'PM' }], ['REZERV', { uz: 'Rezerv', ru: 'Резерв' }], ['DEMO', { uz: 'DEMO DAY', ru: 'DEMO DAY' }], ['MAROSIM', { uz: 'MAROSIM', ru: 'ВЫПУСКНОЙ' }]]

const UI = {
  eyebrow: { uz: 'CoddyCamp · Senior 2026', ru: 'CoddyCamp · Senior 2026' },
  h1: { uz: '14-modul · BITIRUVCHI VA MAHSULOT TEZLIGI', ru: '14-модуль · ВЫПУСКНИК И СКОРОСТЬ ПРОДУКТА' },
  bosqich: { uz: '2-BOSQICH', ru: '2-Й ЭТАП' },
  maqsad: { uz: "Maqsad: hakamlar (investor va tadbirkorlar) oldida final himoya — pitch va jonli demo; mahsulot tez va silliq ishlaydi; keyingi olti oy rejasi. Texnik cho'qqi: tezlik o'lchovi + demo tekshiruvi.", ru: 'Цель: финальная защита перед судьями (инвесторы и предприниматели) — питч и живое демо; продукт работает быстро и гладко; план на следующие полгода. Технический пик: замер скорости + проверка демо.' },
  javob: { uz: 'JAVOB · 14-MODUL', ru: 'ИТОГ · 14-МОДУЛЬ' },
  jami: { uz: 'Jami', ru: 'Всего' },
  dars: { uz: 'dars', ru: 'уроков' },
  davom: { uz: 'Davomiylik', ru: 'Длительность' },
  davomQ: { uz: '≈4,5 hafta', ru: '≈4,5 недели' },
  jadval: { uz: "O'qish jadvalida", ru: 'В учебном плане' },
  jadvalQ: { uz: '15,5 — 16,5-oy', ru: '15,5 — 16,5 мес.' },
  tartib: { uz: 'Tartib', ru: 'Порядок' },
  tartibQ: { uz: '13-moduldan keyin', ru: 'после 13-го модуля' },
  ust: [{ uz: '№', ru: '№' }, { uz: 'Tip', ru: 'Тип' }, { uz: 'Mavzu', ru: 'Тема' }, { uz: 'Mazmun', ru: 'Содержание' }, { uz: 'Natija', ru: 'Результат' }],
  ochish: { uz: 'Darsni ochish uchun mavzuni bosing.', ru: 'Нажмите на тему, чтобы открыть урок.' },
  loading: { uz: 'Dars yuklanmoqda…', ru: 'Урок загружается…' },
  back: { uz: "Darslar ro'yxatiga qaytish", ru: 'Вернуться к списку уроков' },
  orqaga: { uz: "Ro'yxat", ru: 'Список' },
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
  <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F6F3', fontFamily: "'Manrope', system-ui, sans-serif", color: '#5A5A60', fontWeight: 700 }}>
    {UI.loading[lang]}
  </div>
)

export default function M12DemoApp() {
  const key = useRoute()
  const lesson = useMemo(() => LESSONS.find(l => l.key === key && l.comp), [key])
  // UZ-RU: global dars tili — localStorage'da saqlanadi (asosiy App.jsx bilan bir xil kalit)
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('cc_lang') === 'ru' ? 'ru' : 'uz' } catch { return 'uz' }
  })
  const pickLang = (l) => { setLang(l); try { localStorage.setItem('cc_lang', l) } catch {} }
  const t = (o) => (o && o[lang]) ?? (o && o.uz) ?? ''
  useEffect(() => { window.scrollTo(0, 0) }, [key])
  useEffect(() => { try { document.documentElement.lang = lang } catch {} }, [lang])
  const sanoq = useMemo(() => Object.fromEntries(TIP_SANOQ.map(([k]) => [k, LESSONS.filter(l => l.tip === k).length])), [])

  if (lesson) {
    const C = lesson.comp
    return (
      <Suspense fallback={<Loading lang={lang} />}>
        <C lang={lang} />
        {/* Telefonda qobiq-tugmalar darsning pastki paneli ustiga ko'tariladi (12-Modul QA sayti F-1004-09 naqshi) */}
        <style>{'@media (max-width: 720px) { .qa-shell { bottom: calc(80px + env(safe-area-inset-bottom, 0px)) !important; } }'}</style>
        <div className="qa-shell" style={{ position: 'fixed', bottom: 14, left: 14, zIndex: 950, display: 'flex', borderRadius: 10, background: '#FFFFFF', boxShadow: '0 6px 18px -6px rgba(27,34,53,0.35)', overflow: 'hidden', opacity: 0.6, transition: 'opacity .15s', fontFamily: "'Manrope', system-ui, sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.6 }}>
          <a href="#/" title={UI.back[lang]} aria-label={UI.back[lang]}
            style={{ padding: '0 12px', height: 38, lineHeight: '38px', fontWeight: 800, fontSize: 11.5, color: '#1B2235', textDecoration: 'none', borderRight: '1px solid #E6E3DC', letterSpacing: '0.02em' }}>{UI.orqaga[lang]}</a>
          {['uz', 'ru'].map(l => (
            <button key={l} title={UI.langTitle[l]} onClick={() => pickLang(l)}
              style={{ width: 36, height: 38, border: 'none', cursor: 'pointer', fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 800, fontSize: 11.5, background: lang === l ? '#1B2235' : 'transparent', color: lang === l ? '#fff' : '#5A5A60' }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </Suspense>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#F7F6F3', fontFamily: "'Manrope', system-ui, sans-serif", color: '#1B2235' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap');
        .q13-wrap { max-width: 1060px; margin: 0 auto; padding: clamp(28px,5vw,52px) 20px 80px; }
        .q13-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 26px; }
        .q13-eyebrow { margin: 0; font-size: 11.5px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #6E6C66; }
        .q13-lang { display: flex; border: 1px solid #D9D5CC; border-radius: 8px; overflow: hidden; background: #fff; }
        .q13-lang button { border: none; background: transparent; padding: 7px 13px; font-family: inherit; font-weight: 800; font-size: 12px; color: #5A5A60; cursor: pointer; }
        .q13-lang button.on { background: #1B2235; color: #fff; }
        .q13-head { display: flex; align-items: baseline; justify-content: space-between; gap: 14px; flex-wrap: wrap; border-left: 5px solid #1B2235; padding-left: 14px; margin-bottom: 10px; }
        .q13-h1 { margin: 0; font-size: clamp(20px,2.8vw,26px); font-weight: 800; letter-spacing: 0.005em; }
        .q13-bosqich { font-size: 11.5px; font-weight: 800; letter-spacing: 0.14em; color: #6E6C66; }
        .q13-maqsad { margin: 0 0 18px; font-size: 14px; font-style: italic; line-height: 1.55; color: #5A5A60; max-width: 860px; }
        .q13-javob { border: 2px solid #3D9A6A; border-radius: 10px; background: #EEF8F1; padding: 14px 18px; margin-bottom: 20px; }
        .q13-javob-y { margin: 0 0 8px; font-size: 11.5px; font-weight: 800; letter-spacing: 0.12em; color: #1E6B45; }
        .q13-javob-q { display: flex; flex-wrap: wrap; gap: 6px 22px; font-size: 13.5px; color: #3A4A40; }
        .q13-javob-q b { color: #1E6B45; font-size: 16px; font-weight: 800; }
        .q13-jad { width: 100%; border-collapse: collapse; background: #fff; font-size: 13.5px; line-height: 1.45; }
        .q13-jad th { background: #1B2235; color: #fff; text-align: left; font-weight: 800; font-size: 12.5px; padding: 10px 12px; letter-spacing: 0.02em; }
        .q13-jad td { border: 1px solid #E6E3DC; padding: 10px 12px; vertical-align: top; }
        .q13-jad tr:nth-child(even) td { background: #FBFAF8; }
        .q13-n { width: 34px; color: #5A5A60; font-weight: 700; }
        .q13-tip { width: 92px; font-size: 11px; font-weight: 800; letter-spacing: 0.04em; }
        .q13-mavzu a { color: #1B2235; font-weight: 800; text-decoration: none; border-bottom: 1px solid #C9C4B8; transition: color .15s, border-color .15s; }
        .q13-mavzu a:hover { color: #2F5FA8; border-color: #2F5FA8; }
        .q13-zaxira td { color: #8A8780; }
        .q13-izoh { margin: 12px 0 0; font-size: 12.5px; color: #6E6C66; }
        @media (prefers-reduced-motion: reduce) { .q13-mavzu a { transition: none } }
        @media (max-width: 720px) {
          .q13-jad thead { display: none; }
          .q13-jad, .q13-jad tbody, .q13-jad tr, .q13-jad td { display: block; width: 100%; box-sizing: border-box; }
          .q13-jad tr { border: 1px solid #E6E3DC; border-radius: 10px; margin-bottom: 10px; overflow: hidden; background: #fff; }
          .q13-jad td { border: none; padding: 6px 14px; }
          .q13-jad tr td:first-child { padding-top: 12px; }
          .q13-jad tr td:last-child { padding-bottom: 12px; }
          .q13-jad tr:nth-child(even) td { background: #fff; }
          .q13-jad td.q13-n, .q13-jad td.q13-tip { width: auto; display: inline-block; padding-right: 0; padding-top: 12px; line-height: 20px; vertical-align: middle; }
          .q13-jad td.q13-n::after { content: '·'; margin-left: 8px; color: #B5B1A8; }
          .q13-jad td[data-y]::before { content: attr(data-y); display: block; font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #8A8780; margin-bottom: 2px; }
        }
      `}</style>
      <div className="q13-wrap">
        <div className="q13-top">
          <p className="q13-eyebrow">{t(UI.eyebrow)}</p>
          <div className="q13-lang" role="group" aria-label="UZ / RU">
            {['uz', 'ru'].map(l => (
              <button key={l} className={lang === l ? 'on' : ''} title={UI.langTitle[l]} onClick={() => pickLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
        <div className="q13-head">
          <h1 className="q13-h1">{t(UI.h1)}</h1>
          <span className="q13-bosqich">{t(UI.bosqich)}</span>
        </div>
        <p className="q13-maqsad">{t(UI.maqsad)}</p>
        <div className="q13-javob">
          <p className="q13-javob-y">{t(UI.javob)}</p>
          <div className="q13-javob-q">
            {TIP_SANOQ.map(([k, nom]) => <span key={k}>{t(nom)}: <b>{sanoq[k]}</b></span>)}
            <span>{t(UI.jami)}: <b>{LESSONS.length} {t(UI.dars)}</b></span>
            <span>{t(UI.davom)}: <b>{t(UI.davomQ)}</b></span>
            <span>{t(UI.jadval)}: <b>{t(UI.jadvalQ)}</b></span>
            <span>{t(UI.tartib)}: <b>{t(UI.tartibQ)}</b></span>
          </div>
        </div>
        <table className="q13-jad">
          <thead><tr>{UI.ust.map((u, i) => <th key={i}>{t(u)}</th>)}</tr></thead>
          <tbody>
            {LESSONS.map(l => (
              <tr key={l.key} className={l.comp ? '' : 'q13-zaxira'}>
                <td className="q13-n">{l.n}</td>
                <td className="q13-tip" style={{ color: TIP_RANG[l.tip] }}>{l.tip}</td>
                <td className="q13-mavzu" data-y={t(UI.ust[2])}>{l.comp ? <a href={`#${l.key}`}>{t(l.title)}</a> : t(l.title)}</td>
                <td data-y={t(UI.ust[3])}>{t(l.mazmun)}</td>
                <td data-y={t(UI.ust[4])}>{t(l.natija)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="q13-izoh">{t(UI.ochish)}</p>
      </div>
    </div>
  )
}
