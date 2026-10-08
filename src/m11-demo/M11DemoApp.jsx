import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'

// 13-Modul QA-demosi (08.10.2026): alohida Vercel loyihasi — QA ko'rib fidbek beradi. Kod papkasi src/11-Modull (LMS'da «13-Modul»).
// LMS'ga yuklanmaydi (28.09 qarori). Naqsh — src/m10-demo (12-Modul QA sayti); katalog — dastur v9 jadvali ko'rinishida
// (№ · Tip · Mavzu · Mazmun · Natija), emojisiz (foydalanuvchi talabi, 08.10). Mazmun va Natija — dastur v9 dan (feedback/F-1007-13modul/00-MANBA.md 1-bo'lim).
const PmUnitEconomicsLesson = lazy(() => import('../11-Modull/PmUnitEconomicsLesson.jsx'))
const PmMonetizationLesson = lazy(() => import('../11-Modull/PmMonetizationLesson.jsx'))
const PaymentWebhookLesson = lazy(() => import('../11-Modull/PaymentWebhookLesson.jsx'))
const PmPricingLesson = lazy(() => import('../11-Modull/PmPricingLesson.jsx'))
const PaymentDayLesson = lazy(() => import('../11-Modull/PaymentDayLesson.jsx'))
const PmMoneyTalkLesson = lazy(() => import('../11-Modull/PmMoneyTalkLesson.jsx'))
const PmTermsLesson = lazy(() => import('../11-Modull/PmTermsLesson.jsx'))
const WinBackDayLesson = lazy(() => import('../11-Modull/WinBackDayLesson.jsx'))
const PmPayCheckLesson = lazy(() => import('../11-Modull/PmPayCheckLesson.jsx'))
const ReferralDayLesson = lazy(() => import('../11-Modull/ReferralDayLesson.jsx'))
const PmReflectionLesson = lazy(() => import('../11-Modull/PmReflectionLesson.jsx'))
const StabilizeDayLesson = lazy(() => import('../11-Modull/StabilizeDayLesson.jsx'))

// tip — dastur v9 dagi tip (TEX · PM · PM+PRAKT · AI-PRAKT · REZERV)
const L = (key, n, tip, uz, ru, mz, nt, comp) => ({ key, n, tip, title: { uz, ru }, mazmun: mz, natija: nt, comp })
const LESSONS = [
  L('m11-01', 1, 'PM', "Bitta foydalanuvchi sizga qanchaga tushadi?", 'Во сколько вам обходится один пользователь?',
    { uz: "Jalb qilish narxi va foydalanuvchi keltiradigan pul — real misollar bilan; o'z mahsuloti uchun hisob", ru: 'Стоимость привлечения и доход с пользователя — на реальных примерах; расчёт для своего продукта' },
    { uz: "Mahsulotining ikki soni: jalb qilish narxi va keltiradigan pul", ru: 'Два числа своего продукта: стоимость привлечения и доход с пользователя' }, PmUnitEconomicsLesson),
  L('m11-02', 2, 'PM', "Mahsulotingiz qanday pul topadi?", 'Как ваш продукт зарабатывает?',
    { uz: "Besh model: bepul asos, pullik obuna, reklama, B2B, tranzaksiya", ru: 'Пять моделей: бесплатная основа, платная подписка, реклама, B2B, транзакции' },
    { uz: "Asoslangan model tanlovi", ru: 'Обоснованный выбор модели' }, PmMonetizationLesson),
  L('m11-03', 3, 'TEX', "Webhook: to'lov Backend'ga qanday yetib keladi", 'Вебхук: как платёж доходит до Backend',
    { uz: "To'lov real qanday o'tadi: webhook, imzo, takror xabar, rad etilgan to'lov — test rejimda", ru: 'Как реально проходит платёж: вебхук, подпись, повторное сообщение, отклонённый платёж — в тестовом режиме' },
    { uz: "To'lov oqimi sxemasi + webhook tekshiruvi", ru: 'Схема потока оплаты + проверка вебхука' }, PaymentWebhookLesson),
  L('m11-04', 4, 'PM+PRAKT', "Narxni qanday belgilaysiz?", 'Как назначить цену?',
    { uz: "Xarajat, raqobat, qiymat → narx; shu darsda to'lov taklifi ekrani ilovada ishlaydi", ru: 'Затраты, конкуренты, ценность → цена; на этом уроке экран оплаты работает в приложении' },
    { uz: "Asoslangan narxli to'lov taklifi ekrani ishlaydi", ru: 'Работает экран оплаты с обоснованной ценой' }, PmPricingLesson),
  L('m11-05', 5, 'AI-PRAKT', "Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz", 'День проекта: подключаем оплату и ломаем её',
    { uz: "Test rejimda to'lov oqimi to'liq; to'rt usulda buzamiz, topilganini tuzatamiz", ru: 'Полный поток оплаты в тестовом режиме; ломаем четырьмя способами, найденное чиним' },
    { uz: "To'lov oqimi buzilishlarga chidaydi", ru: 'Поток оплаты выдерживает сбои' }, PaymentDayLesson),
  L('m11-06', 6, 'PM', "Pul haqida qanday gaplashasiz?", 'Как говорить о деньгах?',
    { uz: "To'lashni qanday taklif qilish; suhbat savollari, Mentor bilan rol o'yini", ru: 'Как предложить оплату; вопросы разговора, ролевая игра с Ментором' },
    { uz: "Narx bo'yicha uchta real suhbat", ru: 'Три реальных разговора о цене' }, PmMoneyTalkLesson),
  L('m11-07', 7, 'PM+PRAKT', "Foydalanuvchiga shartlarni qanday ochiq aytasiz?", 'Как честно сказать пользователю об условиях?',
    { uz: "Oferta va maxfiylik siyosati — hujjatlar saytda e'lon qilinadi", ru: 'Оферта и политика конфиденциальности — документы публикуются на сайте' },
    { uz: "Oferta va siyosat saytda", ru: 'Оферта и политика на сайте' }, PmTermsLesson),
  L('m11-08', 8, 'AI-PRAKT', "Loyiha kuni: ketayotgan foydalanuvchini qaytarish", 'День проекта: вернуть уходящего пользователя',
    { uz: "Nega ketishadi va qanday qaytarish: Telegram orqali eslatma", ru: 'Почему уходят и как вернуть: напоминание через Telegram' },
    { uz: "Bitta qaytarish mexanikasi qo'shilgan", ru: 'Добавлена одна механика возврата' }, WinBackDayLesson),
  L('m11-09', 9, 'PM', "Kim haqiqatan to'lashga tayyor?", 'Кто действительно готов платить?',
    { uz: "Mentor tekshiruvi: kamida uch kishi to'lashga tayyorligini yozma tasdiqlaydi", ru: 'Проверка Ментора: минимум три человека письменно подтверждают готовность платить' },
    { uz: "Uchta yozma tasdiq + yozuvlar", ru: 'Три письменных подтверждения + записи' }, PmPayCheckLesson),
  L('m11-10', 10, 'AI-PRAKT', "Loyiha kuni: taklif havolasi va mukofot", 'День проекта: ссылка-приглашение и награда',
    { uz: "Unikal havola, taklif sanog'i va mukofot — tarqalish kod sifatida", ru: 'Уникальная ссылка, подсчёт приглашений и награда — распространение как код' },
    { uz: "Taklif yo'li ishga tushgan + natija", ru: 'Путь приглашения запущен + результат' }, ReferralDayLesson),
  L('m11-11', 11, 'PM', "Mahsulotingiz hozir qayerda?", 'Где сейчас ваш продукт?',
    { uz: "Mahsulot va roadmap solishtiriladi; shaxsiy PM-hisobot", ru: 'Продукт сравнивается с roadmap; личный PM-отчёт' },
    { uz: "Yozma shaxsiy hisobot", ru: 'Письменный личный отчёт' }, PmReflectionLesson),
  L('m11-12', 12, 'AI-PRAKT', "Loyiha kuni: barqarorlashtirish", 'День проекта: стабилизация',
    { uz: "Asosiy yo'llarni tekshiramiz, topilganini tuzatamiz va qayta tekshiramiz", ru: 'Проверяем основные пути, найденное чиним и проверяем снова' },
    { uz: "Mahsulot barqaror", ru: 'Продукт стабилен' }, StabilizeDayLesson),
  L('m11-13', 13, 'REZERV', "Zaxira dars", 'Резервный урок',
    { uz: "Yetib olish va sayqallash", ru: 'Догнать и доработать' }, { uz: '—', ru: '—' }),
]

const TIP_RANG = { TEX: '#0F6B4F', PM: '#6B3FD8', 'PM+PRAKT': '#2F5FA8', 'AI-PRAKT': '#B4561A', REZERV: '#7A7872' }
const TIP_SANOQ = [['TEX', { uz: 'TEX dars', ru: 'TEX урок' }], ['AI-PRAKT', { uz: 'AI-PRAKTIKA', ru: 'AI-ПРАКТИКА' }], ['PM+PRAKT', { uz: 'PM+PRAKT', ru: 'PM+PRAKT' }], ['PM', { uz: 'PM', ru: 'PM' }], ['REZERV', { uz: 'Rezerv', ru: 'Резерв' }]]

const UI = {
  eyebrow: { uz: 'CoddyCamp · Senior 2026', ru: 'CoddyCamp · Senior 2026' },
  h1: { uz: '13-modul · O\'SISH VA MONETIZATSIYA', ru: '13-модуль · РОСТ И МОНЕТИЗАЦИЯ' },
  bosqich: { uz: '2-BOSQICH', ru: '2-Й ЭТАП' },
  maqsad: { uz: "Maqsad: jalb qilish narxi va keltiradigan pul, to'lov tizimi va o'sish mexanikalari; to'lashga tayyorlikning birinchi tasdig'i. Texnik cho'qqi: webhook + taklif havolasi.", ru: 'Цель: стоимость привлечения и доход с пользователя, платёжная система и механики роста; первое подтверждение готовности платить. Технический пик: вебхук + ссылка-приглашение.' },
  javob: { uz: 'JAVOB · 13-MODUL', ru: 'ИТОГ · 13-МОДУЛЬ' },
  jami: { uz: 'Jami', ru: 'Всего' },
  dars: { uz: 'dars', ru: 'уроков' },
  davom: { uz: 'Davomiylik', ru: 'Длительность' },
  davomQ: { uz: '≈4,5 hafta', ru: '≈4,5 недели' },
  jadval: { uz: "O'qish jadvalida", ru: 'В учебном плане' },
  jadvalQ: { uz: '14,5 — 15,5-oy', ru: '14,5 — 15,5 мес.' },
  tartib: { uz: 'Tartib', ru: 'Порядок' },
  tartibQ: { uz: '12-moduldan keyin', ru: 'после 12-го модуля' },
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

export default function M11DemoApp() {
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
