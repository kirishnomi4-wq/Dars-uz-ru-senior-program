import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'

// «Frontend-Backend darslari» demo (2026-08-21): alohida Vercel loyihasi.
// 4-Modul = lokal 3-Modull (React) darslari · 5-Modul = lokal 4-Modull (Node/Express + PostgreSQL) darslari.
// Tartib va komponentlar App.jsx bilan bir xil; katalog UZ-RU (cc_lang), har darsga lang prop uzatiladi.
// PM darslar (PmLesson11-14) 2026-08-21 da UZ-RU qilindi: ru-gate (UZ-regressiya) + ru-walk (32 yuklash)
// darvozalaridan o'tgan; endi barcha 30 dars ikkala tilda ochiladi.
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

const NestArchAliveLesson = lazy(() => import('../4a-Modull/NestArchAliveLesson.jsx'))
const PmLesson15 = lazy(() => import('../4a-Modull/PmLesson15.jsx'))
const NestArchResourceLesson = lazy(() => import('../4a-Modull/NestArchResourceLesson.jsx'))
const NestArchPracticeLesson = lazy(() => import('../4a-Modull/NestArchPracticeLesson.jsx'))
const JestUnitTestLesson = lazy(() => import('../4b-Modull/JestUnitTestLesson.jsx'))
const PmLesson16 = lazy(() => import('../4b-Modull/PmLesson16.jsx'))
const EdgeCasesTestLesson = lazy(() => import('../4b-Modull/EdgeCasesTestLesson.jsx'))
const CiCdIntroLesson = lazy(() => import('../4c-Modull/CiCdIntroLesson.jsx'))
const PmLesson17 = lazy(() => import('../4c-Modull/PmLesson17.jsx'))
const GithubActionsLesson = lazy(() => import('../4c-Modull/GithubActionsLesson.jsx'))
const FullPipelineProjectLesson = lazy(() => import('../4c-Modull/FullPipelineProjectLesson.jsx'))
const AiPipelineProjectLesson = lazy(() => import('../4c-Modull/AiPipelineProjectLesson.jsx'))
const PmLesson18 = lazy(() => import('../4c-Modull/PmLesson18.jsx'))
const FullProPipelineLesson = lazy(() => import('../4c-Modull/FullProPipelineLesson.jsx'))

// Katalog matnlari: har maydon {uz, ru}. Sarlavhalar App.jsx (UZ) bilan bir xil.
const MODULES = [
  {
    id: 'fe',
    label: { uz: '4-Modul', ru: '4-Модуль' },
    heading: { uz: '4-Modul — Frontend: React', ru: '4-Модуль — Frontend: React' },
    lead: { uz: "Komponentdan to'liq ishlaydigan React-loyihagacha — dastur tartibida.", ru: 'От компонента до полноценного React-проекта — в порядке программы.' },
    lessons: [
      { key: 'fe-01', n: 1,  type: 'Kod',     emoji: '⚛️', title: { uz: 'React nima va nima uchun?', ru: 'Что такое React и зачем он нужен?' }, sub: { uz: 'komponent, Virtual DOM, React Native', ru: 'компонент, Virtual DOM, React Native' }, comp: ReactIntroLesson },
      { key: 'fe-02', n: 2,  type: 'PM',      emoji: '📝', title: { uz: 'User Story: kim va nima uchun?', ru: 'User Story: кто и зачем?' }, sub: { uz: '"Men [kim] sifatida..." — JTBD', ru: '«Я как [кто]...» — JTBD' }, comp: PmUserStoryLesson },
      { key: 'fe-03', n: 3,  type: 'Kod',     emoji: '🧱', title: { uz: 'Birinchi komponent', ru: 'Первый компонент' }, sub: { uz: 'Vite, JSX, props, loyiha strukturasi', ru: 'Vite, JSX, props, структура проекта' }, comp: ReactFirstComponentLesson },
      { key: 'fe-04', n: 4,  type: 'Kod',     emoji: '💗', title: { uz: 'State va Effect', ru: 'State и Effect' }, sub: { uz: 'useState + useEffect, lifecycle', ru: 'useState + useEffect, жизненный цикл' }, comp: ReactStateEffectLesson },
      { key: 'fe-05', n: 5,  type: 'PM',      emoji: '⚖️', title: { uz: 'Qaysi ishni birinchi qilasiz?', ru: 'Какую задачу сделаете первой?' }, sub: { uz: "Nechta odam so'raydi va qancha vaqt oladi", ru: 'Сколько людей просят и сколько времени займёт' }, comp: PmLesson8 },
      { key: 'fe-06', n: 6,  type: 'Kod',     emoji: '🏭', title: { uz: 'Props va qayta ishlatish', ru: 'Props и переиспользование' }, sub: { uz: "ma'lumotni komponentlar orasida uzatish", ru: 'передача данных между компонентами' }, comp: ReactPropsReuseLesson },
      { key: 'fe-07', n: 7,  type: 'Proyekt', emoji: '🐠', title: { uz: "Praktika: AI bilan to'liq CRUD", ru: 'Практика: полный CRUD с ИИ' }, sub: { uz: 'Create / Read / Update / Delete', ru: 'Create / Read / Update / Delete' }, comp: ReactCrudPracticeLesson },
      { key: 'fe-08', n: 8,  type: 'Kod',     emoji: '🛎️', title: { uz: 'API bilan ishlash — GET', ru: 'Работа с API — GET' }, sub: { uz: 'fetch / axios, JSON, loading', ru: 'fetch / axios, JSON, загрузка' }, comp: ReactApiGetLesson },
      { key: 'fe-09', n: 9,  type: 'Kod',     emoji: '📦', title: { uz: 'API — POST / PUT / DELETE', ru: 'API — POST / PUT / DELETE' }, sub: { uz: "serverga ma'lumot yuborish", ru: 'отправка данных на сервер' }, comp: ReactApiPostLesson },
      { key: 'fe-10', n: 10, type: 'PM',      emoji: '✅', title: { uz: 'Qachon «tayyor» deb ayta olamiz?', ru: 'Когда можно сказать «готово»?' }, sub: { uz: 'ishni qabul qilish shartlari', ru: 'критерии приёмки работы' }, comp: PmLesson9 },
      { key: 'fe-11', n: 11, type: 'Proyekt', emoji: '🌀', title: { uz: 'Praktika: React Router', ru: 'Практика: React Router' }, sub: { uz: "ko'p sahifali ilova, navigatsiya", ru: 'многостраничное приложение, навигация' }, comp: ReactRouterPracticeLesson },
      { key: 'fe-12', n: 12, type: 'Proyekt', emoji: '🚗', title: { uz: 'Loyiha kuni — AvtoIjara', ru: 'Проектный день — AvtoIjara' }, sub: { uz: 'React + API + CRUD + routing', ru: 'React + API + CRUD + роутинг' }, comp: ReactProjectDayLesson },
      { key: 'fe-13', n: 13, type: 'Proyekt', emoji: '🏗️', title: { uz: "Final loyihani bo'laklash va qurish", ru: 'Разбить и собрать финальный проект' }, sub: { uz: 'komponent sxemasi + ishlaydigan loyiha', ru: 'схема компонентов + работающий проект' }, comp: ReactBuildSiteLesson },
      { key: 'fe-14', n: 14, type: 'PM',      emoji: '🎤', title: { uz: "Ishlayotgan saytingizni qanday ko'rsatasiz?", ru: 'Как показать свой работающий сайт?' }, sub: { uz: "uch kadrlik ko'rsatuv", ru: 'показ в три кадра' }, comp: PmLesson10 },
      { key: 'fe-15', n: 15, type: 'Rezerv',  emoji: '📅', title: { uz: 'Zaxira dars', ru: 'Резервный урок' }, sub: { uz: 'yetib olish / sayqallash', ru: 'догнать / отшлифовать' } },
      { key: 'fe-16', n: 16, type: 'Demo',    emoji: '🎤', title: { uz: 'Demo Day', ru: 'Demo Day' }, sub: { uz: 'guruh + mehmonlar oldida himoya', ru: 'защита перед группой и гостями' } },
    ],
  },
  {
    id: 'be',
    label: { uz: '5-Modul', ru: '5-Модуль' },
    heading: { uz: '5-Modul — Backend: Node-Express + PostgreSQL', ru: '5-Модуль — Backend: Node-Express + PostgreSQL' },
    lead: { uz: "Ma'lumot sxemasidan to'liq fullstack loyihagacha — dastur tartibida.", ru: 'От схемы данных до полного fullstack-проекта — в порядке программы.' },
    lessons: [
      { key: 'be-01', n: 1,  type: 'Kod',     emoji: '🔌', title: { uz: "Ma'lumot nima", ru: 'Что такое данные' }, sub: { uz: "JSON, jadval, bog'lanish, PK/FK", ru: 'JSON, таблица, связи, PK/FK' }, comp: DataIntroLesson },
      { key: 'be-02', n: 2,  type: 'PM',      emoji: '📊', title: { uz: "Ma'lumot ham mahsulot qarori", ru: 'Данные — тоже продуктовое решение' }, sub: { uz: "nimani saqlaymiz va nega — bo'lim shundan quriladi", ru: 'что храним и зачем — раздел строится из этого' }, comp: PmLesson11 },
      { key: 'be-03', n: 3,  type: 'Kod',     emoji: '📦', title: { uz: 'SQL vs NoSQL — PostgreSQL', ru: 'SQL vs NoSQL — PostgreSQL' }, sub: { uz: 'qachon qaysi biri kerak', ru: 'когда что нужно' }, comp: DbSqlNosqlLesson },
      { key: 'be-04', n: 4,  type: 'Kod',     emoji: '🏪', title: { uz: 'Node.js — birinchi server', ru: 'Node.js — первый сервер' }, sub: { uz: 'npm, Express, birinchi endpoint', ru: 'npm, Express, первый endpoint' }, comp: NodeServerLesson },
      { key: 'be-05', n: 5,  type: 'Kod',     emoji: '📮', title: { uz: 'Routing — Express / Nest', ru: 'Роутинг — Express / Nest' }, sub: { uz: 'method + path, 404, /:id', ru: 'метод + путь, 404, /:id' }, comp: RoutingLesson },
      { key: 'be-06', n: 6,  type: 'Kod',     emoji: '🐘', title: { uz: "PostgreSQL so'rovlari", ru: 'Запросы PostgreSQL' }, sub: { uz: 'SELECT, INSERT, UPDATE, DELETE', ru: 'SELECT, INSERT, UPDATE, DELETE' }, comp: PostgresCrudLesson },
      { key: 'be-07', n: 7,  type: 'PM',      emoji: '🔐', title: { uz: 'Xavfsizlik — foydalanuvchi ishonchi', ru: 'Безопасность — доверие пользователя' }, sub: { uz: 'nima ochiq, nima yopiq — ishonch mahsulot qiymati', ru: 'что открыто, что закрыто — доверие как ценность продукта' }, comp: PmLesson12 },
      { key: 'be-08', n: 8,  type: 'Proyekt', emoji: '🚗', title: { uz: 'Praktika: Backend CRUD', ru: 'Практика: Backend CRUD' }, sub: { uz: 'AvtoIjara — Express + PostgreSQL', ru: 'AvtoIjara — Express + PostgreSQL' }, comp: BackendCrudPracticeLesson },
      { key: 'be-09', n: 9,  type: 'Kod',     emoji: '📡', title: { uz: 'API nima + Postman', ru: 'Что такое API + Postman' }, sub: { uz: "so'rov va javob, status kodlari", ru: 'запрос и ответ, коды статусов' }, comp: ApiPostmanLesson },
      { key: 'be-10', n: 10, type: 'Proyekt', emoji: '🌉', title: { uz: 'Praktika: React + Node ulash', ru: 'Практика: связать React + Node' }, sub: { uz: 'fetch, CORS — front ↔ back', ru: 'fetch, CORS — фронт ↔ бэк' }, comp: FullstackConnectPracticeLesson },
      { key: 'be-11', n: 11, type: 'Kod',     emoji: '🔑', title: { uz: 'Autentifikatsiya va .env', ru: 'Аутентификация и .env' }, sub: { uz: 'JWT token, login, himoyalangan route', ru: 'JWT-токен, логин, защищённый маршрут' }, comp: AuthEnvLesson },
      { key: 'be-12', n: 12, type: 'PM',      emoji: '🗂️', title: { uz: 'Ilova nimani yozib qoladi?', ru: 'Что приложение записывает?' }, sub: { uz: "e'londan sxemagacha — uch ustun", ru: 'от объявления до схемы — три колонки' }, comp: PmLesson13 },
      { key: 'be-13', n: 13, type: 'Proyekt', emoji: '🅿️', title: { uz: 'Fullstack loyiha kuni', ru: 'Fullstack проектный день' }, sub: { uz: 'AvtoStoyanka — baza + server + panel', ru: 'AvtoStoyanka — база + сервер + панель' }, comp: FullstackProjectDayLesson },
      { key: 'be-14', n: 14, type: 'Proyekt', emoji: '💬', title: { uz: "Fikr bo'yicha yaxshilash", ru: 'Доработка по отзывам' }, sub: { uz: 'sinfdoshlar fikridan 3 muammo topib tuzatildi', ru: 'по отзывам одноклассников найдены и исправлены 3 проблемы' }, comp: FullstackFeedbackLesson },
      { key: 'be-15', n: 15, type: 'PM',      emoji: '🎤', title: { uz: "\"Qanday ishlaydi?\" deb so'rashsa", ru: 'Если спросят: «Как это работает?»' }, sub: { uz: 'uch qavat — uch oddiy gap', ru: 'три слоя — три простых предложения' }, comp: PmLesson14 },
      { key: 'be-16', n: 16, type: 'Rezerv',  emoji: '📅', title: { uz: 'Zaxira dars', ru: 'Резервный урок' }, sub: { uz: 'yetib olish / sayqallash', ru: 'догнать / отшлифовать' } },
      { key: 'be-17', n: 17, type: 'Demo',    emoji: '🎤', title: { uz: 'Demo Day', ru: 'Demo Day' }, sub: { uz: 'jonli fullstack demo', ru: 'живое fullstack-демо' } },
    ],
  },
  {
    id: 'nest',
    label: { uz: '6-Modul', ru: '6-Модуль' },
    heading: { uz: '6-Modul — Backend: NestJS + Testlash + CI/CD Deploy', ru: '6-Модуль — Backend: NestJS + Тестирование + CI/CD Deploy' },
    lead: { uz: "Arxitekturadan avtomatik chiqarishgacha — dastur tartibida.", ru: 'От архитектуры до автоматического выпуска — в порядке программы.' },
    lessons: [
      { key: 'nb-01', n: 1,  type: 'Kod',     emoji: '🪺', title: { uz: 'NestJS va arxitektura', ru: 'NestJS и архитектура' }, sub: { uz: 'MVC, module, controller, service', ru: 'MVC, module, controller, service' }, comp: NestArchAliveLesson },
      { key: 'nb-02', n: 2,  type: 'PM',      emoji: '📈', title: { uz: 'Hamma birdan kirsa, sayt chidaydimi?', ru: 'Выдержит ли сайт, если все зайдут разом?' }, sub: { uz: "yuk — birdan kelgan og'irlik", ru: 'нагрузка — тяжесть, пришедшая разом' }, comp: PmLesson15 },
      { key: 'nb-03', n: 3,  type: 'Kod',     emoji: '📋', title: { uz: 'Boilerplate: Nest + PostgreSQL', ru: 'Boilerplate: Nest + PostgreSQL' }, sub: { uz: 'Entity, DTO, Repository — CRUD', ru: 'Entity, DTO, Repository — CRUD' }, comp: NestArchResourceLesson },
      { key: 'nb-04', n: 4,  type: 'Proyekt', emoji: '📚', title: { uz: 'Praktika: yangi modul', ru: 'Практика: новый модуль' }, sub: { uz: "KitobShop — o'z controller + service", ru: 'KitobShop — свой controller + service' }, comp: NestArchPracticeLesson },
      { key: 'nb-05', n: 5,  type: 'Kod',     emoji: '🧪', title: { uz: 'Unit-test: Jest', ru: 'Unit-тест: Jest' }, sub: { uz: 'describe / it / expect — birinchi test', ru: 'describe / it / expect — первый тест' }, comp: JestUnitTestLesson },
      { key: 'nb-06', n: 6,  type: 'PM',      emoji: '🛡️', title: { uz: 'Bitta xato — nechta odam ketadi?', ru: 'Одна ошибка — сколько людей уйдёт?' }, sub: { uz: 'nosozlik qayerda tutilsa — shuncha arzon', ru: 'где поймана поломка — настолько она дешевле' }, comp: PmLesson16 },
      { key: 'nb-07', n: 7,  type: 'Kod',     emoji: '🌶️', title: { uz: 'Edge case va error path', ru: 'Edge case и error path' }, sub: { uz: 'happy path vs xato, toThrow', ru: 'happy path против ошибки, toThrow' }, comp: EdgeCasesTestLesson },
      { key: 'nb-08', n: 8,  type: 'Kod',     emoji: '🛫', title: { uz: 'CI/CD nima va nega kerak', ru: 'Что такое CI/CD и зачем он нужен' }, sub: { uz: 'Continuous Integration / Deployment', ru: 'Continuous Integration / Deployment' }, comp: CiCdIntroLesson },
      { key: 'nb-09', n: 9,  type: 'PM',      emoji: '⚡', title: { uz: "Hammasini birdan chiqaraymi — yoki har hafta bo'lak?", ru: 'Выпустить всё разом — или по кусочку каждую неделю?' }, sub: { uz: "kim tez-tez chiqarsa, o'sha oldin biladi", ru: 'кто выпускает чаще, тот узнаёт раньше' }, comp: PmLesson17 },
      { key: 'nb-10', n: 10, type: 'Kod',     emoji: '🗺️', title: { uz: 'GitHub Actions — asoslar', ru: 'GitHub Actions — основы' }, sub: { uz: 'avtomatik ish oqimi: qadamlar va sozlash fayli', ru: 'автоматический поток работ: шаги и файл настройки' }, comp: GithubActionsLesson },
      { key: 'nb-11', n: 11, type: 'Proyekt', emoji: '🧳', title: { uz: "Loyiha kuni: to'liq lenta", ru: 'Проектный день: полный конвейер' }, sub: { uz: 'backend + frontend — real loyiha', ru: 'backend + frontend — реальный проект' }, comp: FullPipelineProjectLesson },
      { key: 'nb-12', n: 12, type: 'Proyekt', emoji: '🧑‍🔧', title: { uz: 'Loyiha kuni: promptlar bilan', ru: 'Проектный день: с промптами' }, sub: { uz: 'AI bilan lentani boshqarish', ru: 'управление конвейером с ИИ' }, comp: AiPipelineProjectLesson },
      { key: 'nb-13', n: 13, type: 'PM',      emoji: '📟', title: { uz: 'Saytingiz hozir ochilyaptimi?', ru: 'Ваш сайт сейчас открывается?' }, sub: { uz: "chiqqandan keyin saytni kim o'lchaydi", ru: 'кто измеряет сайт после выпуска' }, comp: PmLesson18 },
      { key: 'nb-14', n: 14, type: 'Proyekt', emoji: '⚙️', title: { uz: 'Loyiha kuni: hammasi birga', ru: 'Проектный день: всё вместе' }, sub: { uz: 'test + lint + deploy + monitoring', ru: 'тест + lint + deploy + мониторинг' }, comp: FullProPipelineLesson },
      { key: 'nb-15', n: 15, type: 'Rezerv',  emoji: '📅', title: { uz: 'Zaxira dars', ru: 'Резервный урок' }, sub: { uz: 'yetib olish / sayqallash', ru: 'догнать / отшлифовать' } },
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
  h1: { uz: 'Frontend va Backend darslari', ru: 'Уроки Frontend и Backend' },
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

export default function FbDemoApp() {
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
