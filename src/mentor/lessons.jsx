// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/m1-demo/M1DemoApp.jsx  +  src/fb-demo/FbDemoApp.jsx
//  Qayta yig'ish:  npm run gen:mentor
//
//  O'quv rejasi raqamlashi: 1-Modul = Foundation (bizniki emas), shuning uchun
//  darslarimiz 2-Moduldan boshlanadi:
//    2 HTML/CSS · 3 JavaScript · 4 React · 5 Express+PostgreSQL · 6 NestJS+Test+CI/CD
// ============================================================
import { lazy } from 'react'

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

export const MODULES = [
  {
    id: 'm2',
    label: { uz: '2-Modul', ru: '2-Модуль' },
    heading: { uz: '2-Modul — HTML va CSS', ru: '2-Модуль — HTML и CSS' },
    lead: { uz: 'Internetdan tirik saytgacha: HTML, CSS, VS Code, Git va deploy.', ru: 'От интернета до живого сайта: HTML, CSS, VS Code, Git и деплой.' },
    lessons: [
      { key: 'm1-01', n: 1, type: 'Kod', emoji: '🌐', title: { uz: 'Internet qanday ishlaydi', ru: 'Как работает интернет' }, sub: { uz: "brauzer, server, domen, DNS — so'rov yo'li", ru: 'браузер, сервер, домен, DNS — путь запроса' }, comp: InternetLesson, lessonId: 'internet-01-v18' },
      { key: 'm1-02', n: 2, type: 'PM', emoji: '🎯', title: { uz: 'Kim mening foydalanuvchim?', ru: 'Кто мой пользователь?' }, sub: { uz: 'auditoriya va saytning maqsadi', ru: 'аудитория и цель сайта' }, comp: PmLesson1, lessonId: 'pm-m1d2-v1' },
      { key: 'm1-03', n: 3, type: 'Kod', emoji: '📄', title: { uz: "HTML qo'lda — 1", ru: 'HTML руками — 1' }, sub: { uz: "teg, sarlavha, ro'yxat, havola", ru: 'тег, заголовок, список, ссылка' }, comp: Htmllesson1, lessonId: 'html-01-v17' },
      { key: 'm1-04', n: 4, type: 'Kod', emoji: '🖼️', title: { uz: "HTML qo'lda — 2", ru: 'HTML руками — 2' }, sub: { uz: 'rasm, forma, struktura, DevTools', ru: 'картинка, форма, структура, DevTools' }, comp: Htmllesson2, lessonId: 'html-02-v16' },
      { key: 'm1-14', n: 5, type: 'Kod', emoji: '🛠️', title: { uz: 'Takrorlash: HTML ustaxonasi', ru: 'Повторение: мастерская HTML' }, sub: { uz: 'birinchi mijozlar — 5 buyurtma, debug, imtihon', ru: 'первые клиенты — 5 заказов, отладка, экзамен' }, comp: HtmlTakrorlashLesson, lessonId: 'html-takrorlash-01-05-v2' },
      { key: 'm1-05', n: 6, type: 'PM', emoji: '🗺️', title: { uz: 'Struktura — mahsulot qarori', ru: 'Структура — продуктовое решение' }, sub: { uz: "bo'limlar tartibi kimga qarab tuziladi", ru: 'порядок разделов зависит от того, для кого сайт' }, comp: PmLesson2, lessonId: 'pm-m1d6-v1' },
      { key: 'm1-06', n: 7, type: 'Kod', emoji: '🎨', title: { uz: "CSS qo'lda — 1", ru: 'CSS руками — 1' }, sub: { uz: "rang, shrift, bo'shliqlar", ru: 'цвет, шрифт, отступы' }, comp: CssLesson1, lessonId: 'css-01-v17' },
      { key: 'm1-07', n: 8, type: 'Kod', emoji: '📐', title: { uz: "CSS qo'lda — 2", ru: 'CSS руками — 2' }, sub: { uz: 'layout, flexbox, DevTools', ru: 'раскладка, flexbox, DevTools' }, comp: CssLesson2, lessonId: 'css-02-v18' },
      { key: 'm1-08', n: 9, type: 'Proyekt', emoji: '🧱', title: { uz: 'Praktika: portfolio strukturasi', ru: 'Практика: структура портфолио' }, sub: { uz: "saytni bo'laklaymiz, HTML skelet", ru: 'делим сайт на части, HTML-скелет' }, comp: HtmlPractice, lessonId: 'html-practice-portfolio-v2' },
      { key: 'm1-15', n: 10, type: 'Kod', emoji: '💻', title: { uz: 'VS Code — professional start', ru: 'VS Code — профессиональный старт' }, sub: { uz: "o'rnatish, Emmet, Live Server, jonli card", ru: 'установка, Emmet, Live Server, живая карточка' }, comp: VsCodeLesson, lessonId: 'vscode-start-01-v1' },
      { key: 'm1-10', n: 11, type: 'Proyekt', emoji: '💅', title: { uz: 'Praktika: bezash va yakunlash', ru: 'Практика: оформление и финал' }, sub: { uz: 'CSS + kontent + AI bilan tugma', ru: 'CSS + контент + кнопка с помощью AI' }, comp: CssPractice, lessonId: 'css-practice-portfolio-v3' },
      { key: 'm1-09', n: 12, type: 'Kod', emoji: '🔀', title: { uz: 'Git va GitHub', ru: 'Git и GitHub' }, sub: { uz: 'commit, push — kod uchun vaqt mashinasi', ru: 'commit, push — машина времени для кода' }, comp: GitLesson, lessonId: 'git-github-v19' },
      { key: 'm1-11', n: 13, type: 'Kod', emoji: '🚀', title: { uz: 'Netlify va deploy', ru: 'Netlify и деплой' }, sub: { uz: 'hosting, maktab poddomeni', ru: 'хостинг, школьный поддомен' }, comp: DeployLesson, lessonId: 'netlify-deploy-v19' },
      { key: 'm1-12', n: 14, type: 'PM', emoji: '🎤', title: { uz: "Storytelling: mahsulotni so'zlab berish", ru: 'Сторителлинг: рассказать о продукте' }, sub: { uz: '2 daqiqalik taqdimot: muammo → yechim → demo', ru: 'презентация на 2 минуты: проблема → решение → демо' }, comp: PmLesson3, lessonId: 'pm-pitch-03-v19' },
      { key: 'm1-13', n: 15, type: 'Demo', emoji: '🎤', title: { uz: 'Demo Day 1', ru: 'Demo Day 1' }, sub: { uz: 'ota-onalar oldida ochiq himoya', ru: 'открытая защита перед родителями' } },
    ],
  },
  {
    id: 'm3',
    label: { uz: '3-Modul', ru: '3-Модуль' },
    heading: { uz: '3-Modul — JavaScript', ru: '3-Модуль — JavaScript' },
    lead: { uz: "Algoritmdan interaktiv loyihagacha: o'zgaruvchi, shart, sikl, funksiya.", ru: 'От алгоритма до интерактивного проекта: переменная, условие, цикл, функция.' },
    lessons: [
      { key: 'm2-01', n: 1, type: 'Kod', emoji: '🧠', title: { uz: 'Sistema va Algoritm', ru: 'Система и алгоритм' }, sub: { uz: "komponent, bog'lanish, ketma-ketlik", ru: 'компонент, связь, последовательность' }, comp: JsIntroLesson, lessonId: 'js-intro-01-v18' },
      { key: 'm2-02', n: 2, type: 'PM', emoji: '💊', title: { uz: 'Muammodan yechimga', ru: 'От проблемы к решению' }, sub: { uz: "har imkoniyat qaysi qiyinchilikni yo'qotadi?", ru: 'какую трудность убирает каждая возможность?' }, comp: PmLesson4, lessonId: 'pm-m2d2-v1' },
      { key: 'm2-03', n: 3, type: 'Kod', emoji: '📦', title: { uz: "JS — O'zgaruvchilar", ru: 'JS — Переменные' }, sub: { uz: "let / const / var, ma'lumot turlari", ru: 'let / const / var, типы данных' }, comp: JsVarsLesson, lessonId: 'js-vars-01-v18' },
      { key: 'm2-04', n: 4, type: 'Kod', emoji: '🔀', title: { uz: 'JS — if / else', ru: 'JS — if / else' }, sub: { uz: 'shart, taqqoslash operatorlari', ru: 'условие, операторы сравнения' }, comp: JsConditionsLesson, lessonId: 'js-cond-01-v18' },
      { key: 'm2-05', n: 5, type: 'Kod', emoji: '🔁', title: { uz: 'JS — Sikllar', ru: 'JS — Циклы' }, sub: { uz: 'for, while, massivni aylanish', ru: 'for, while, обход массива' }, comp: JsLoopsLesson, lessonId: 'js-loops-01-v18' },
      { key: 'm2-06', n: 6, type: 'Kod', emoji: '🧩', title: { uz: 'JS — Funksiyalar, Array + Object', ru: 'JS — Функции, Array + Object' }, sub: { uz: 'parametr, return, xotira (Stack/Heap)', ru: 'параметр, return, память (Stack/Heap)' }, comp: JsFunctionsLesson, lessonId: 'js-functions-01-v18' },
      { key: 'm2-07', n: 7, type: 'PM', emoji: '🪜', title: { uz: 'Dekompozitsiya — PM quroli', ru: 'Декомпозиция — инструмент PM' }, sub: { uz: "katta rejani bo'laklab, MVP va backlog qilish", ru: 'разбить большой план на части: MVP и бэклог' }, comp: PmLesson5, lessonId: 'pm-m2d7-v1' },
      { key: 'm2-08', n: 8, type: 'Proyekt', emoji: '⚡', title: { uz: 'Loyiha kuni: saytga jon', ru: 'День проекта: оживляем сайт' }, sub: { uz: 'HTML/CSS saytga interaktivlik', ru: 'интерактивность для HTML/CSS-сайта' }, comp: PracticeLesson1, lessonId: 'practice-01-jonlantirish-v18' },
      { key: 'm2-09', n: 9, type: 'Proyekt', emoji: '🤖', title: { uz: 'Loyiha kuni: AI bilan tez sayt', ru: 'День проекта: быстрый сайт с AI' }, sub: { uz: 'prompt orqali sifatli loyiha', ru: 'качественный проект через промпт' }, comp: PracticeLesson2, lessonId: 'practice-02-ai-promo-v18' },
      { key: 'm2-10', n: 10, type: 'Kod', emoji: '🍽️', title: { uz: "PERN Stack — umumiy ko'rinish", ru: 'PERN Stack — общий обзор' }, sub: { uz: 'PostgreSQL + Express + React + Node', ru: 'PostgreSQL + Express + React + Node' }, comp: PeanStackLesson, lessonId: 'pean-stack-01-v18' },
      { key: 'm2-11', n: 11, type: 'Proyekt', emoji: '🛠️', title: { uz: 'Dekompozitsiya va ishlab chiqish — 1', ru: 'Декомпозиция и разработка — 1' }, sub: { uz: "AI'ni ochishdan oldin bo'laklaymiz", ru: 'делим на части ещё до запуска AI' }, comp: PracticeLesson3, lessonId: 'practice-03-decompose-v18' },
      { key: 'm2-12', n: 12, type: 'Proyekt', emoji: '🚀', title: { uz: 'Ishlab chiqish — 2: MVP tayyor', ru: 'Разработка — 2: MVP готов' }, sub: { uz: "feature'larni yakunlash, deploy", ru: 'доводим возможности до конца, деплой' }, comp: PracticeLesson4, lessonId: 'practice-04-mvp-deploy-v18' },
      { key: 'm2-13', n: 13, type: 'PM', emoji: '🎤', title: { uz: 'Sistemani qanday pitch qilish', ru: 'Как питчить систему' }, sub: { uz: "arxitekturani texnik bo'lmagan odamga", ru: 'архитектура для нетехнического человека' }, comp: PmLesson6, lessonId: 'pm-m2d13-v1' },
      { key: 'm2-14', n: 14, type: 'Rezerv', emoji: '📅', title: { uz: 'Zaxira dars', ru: 'Резервный урок' }, sub: { uz: 'yetib olish / sayqallash', ru: 'догнать / отшлифовать' } },
      { key: 'm2-15', n: 15, type: 'Demo', emoji: '🎤', title: { uz: 'Demo Day', ru: 'Demo Day' }, sub: { uz: 'guruh oldida ichki himoya', ru: 'внутренняя защита перед группой' } },
    ],
  },
  {
    id: 'm4',
    label: { uz: '4-Modul', ru: '4-Модуль' },
    heading: { uz: '4-Modul — Frontend: React', ru: '4-Модуль — Frontend: React' },
    lead: { uz: "Komponentdan to'liq ishlaydigan React-loyihagacha — dastur tartibida.", ru: 'От компонента до полноценного React-проекта — в порядке программы.' },
    lessons: [
      { key: 'fe-01', n: 1,  type: 'Kod',     emoji: '⚛️', title: { uz: 'React nima va nima uchun?', ru: 'Что такое React и зачем он нужен?' }, sub: { uz: 'komponent, Virtual DOM, React Native', ru: 'компонент, Virtual DOM, React Native' }, comp: ReactIntroLesson, lessonId: 'react-intro-01-v18' },
      { key: 'fe-02', n: 2,  type: 'PM',      emoji: '📝', title: { uz: 'User Story: kim va nima uchun?', ru: 'User Story: кто и зачем?' }, sub: { uz: '"Men [kim] sifatida..." — JTBD', ru: '«Я как [кто]...» — JTBD' }, comp: PmUserStoryLesson, lessonId: 'pm-m3d2-v3' },
      { key: 'fe-03', n: 3,  type: 'Kod',     emoji: '🧱', title: { uz: 'Birinchi komponent', ru: 'Первый компонент' }, sub: { uz: 'Vite, JSX, props, loyiha strukturasi', ru: 'Vite, JSX, props, структура проекта' }, comp: ReactFirstComponentLesson, lessonId: 'react-first-component-02-v18' },
      { key: 'fe-04', n: 4,  type: 'Kod',     emoji: '💗', title: { uz: 'State va Effect', ru: 'State и Effect' }, sub: { uz: 'useState + useEffect, lifecycle', ru: 'useState + useEffect, жизненный цикл' }, comp: ReactStateEffectLesson, lessonId: 'react-state-effect-03-v18' },
      { key: 'fe-05', n: 5,  type: 'PM',      emoji: '⚖️', title: { uz: 'Qaysi ishni birinchi qilasiz?', ru: 'Какую задачу сделаете первой?' }, sub: { uz: "Nechta odam so'raydi va qancha vaqt oladi", ru: 'Сколько людей просят и сколько времени займёт' }, comp: PmLesson8, lessonId: 'pm-m3d5-v1' },
      { key: 'fe-06', n: 6,  type: 'Kod',     emoji: '🏭', title: { uz: 'Props va qayta ishlatish', ru: 'Props и переиспользование' }, sub: { uz: "ma'lumotni komponentlar orasida uzatish", ru: 'передача данных между компонентами' }, comp: ReactPropsReuseLesson, lessonId: 'react-props-reuse-04-v18' },
      { key: 'fe-07', n: 7,  type: 'Proyekt', emoji: '🐠', title: { uz: "Praktika: AI bilan to'liq CRUD", ru: 'Практика: полный CRUD с ИИ' }, sub: { uz: 'Create / Read / Update / Delete', ru: 'Create / Read / Update / Delete' }, comp: ReactCrudPracticeLesson, lessonId: 'react-crud-practice-p1-v18' },
      { key: 'fe-08', n: 8,  type: 'Kod',     emoji: '🛎️', title: { uz: 'API bilan ishlash — GET', ru: 'Работа с API — GET' }, sub: { uz: 'fetch / axios, JSON, loading', ru: 'fetch / axios, JSON, загрузка' }, comp: ReactApiGetLesson, lessonId: 'react-api-get-05-v18' },
      { key: 'fe-09', n: 9,  type: 'Kod',     emoji: '📦', title: { uz: 'API — POST / PUT / DELETE', ru: 'API — POST / PUT / DELETE' }, sub: { uz: "serverga ma'lumot yuborish", ru: 'отправка данных на сервер' }, comp: ReactApiPostLesson, lessonId: 'react-api-post-06-v18' },
      { key: 'fe-10', n: 10, type: 'PM',      emoji: '✅', title: { uz: 'Qachon «tayyor» deb ayta olamiz?', ru: 'Когда можно сказать «готово»?' }, sub: { uz: 'ishni qabul qilish shartlari', ru: 'критерии приёмки работы' }, comp: PmLesson9, lessonId: 'pm-m3d10-v1' },
      { key: 'fe-11', n: 11, type: 'Proyekt', emoji: '🌀', title: { uz: 'Praktika: React Router', ru: 'Практика: React Router' }, sub: { uz: "ko'p sahifali ilova, navigatsiya", ru: 'многостраничное приложение, навигация' }, comp: ReactRouterPracticeLesson, lessonId: 'react-router-practice-p2-v18' },
      { key: 'fe-12', n: 12, type: 'Proyekt', emoji: '🚗', title: { uz: 'Loyiha kuni — AvtoIjara', ru: 'Проектный день — AvtoIjara' }, sub: { uz: 'React + API + CRUD + routing', ru: 'React + API + CRUD + роутинг' }, comp: ReactProjectDayLesson, lessonId: 'react-project-day-p3-v18' },
      { key: 'fe-13', n: 13, type: 'Proyekt', emoji: '🏗️', title: { uz: "Final loyihani bo'laklash va qurish", ru: 'Разбить и собрать финальный проект' }, sub: { uz: 'komponent sxemasi + ishlaydigan loyiha', ru: 'схема компонентов + работающий проект' }, comp: ReactBuildSiteLesson, lessonId: 'react-build-site-final-p4-v18' },
      { key: 'fe-14', n: 14, type: 'PM',      emoji: '🎤', title: { uz: "Ishlayotgan saytingizni qanday ko'rsatasiz?", ru: 'Как показать свой работающий сайт?' }, sub: { uz: "uch kadrlik ko'rsatuv", ru: 'показ в три кадра' }, comp: PmLesson10, lessonId: 'pm-m3d14-v1' },
      { key: 'fe-15', n: 15, type: 'Rezerv',  emoji: '📅', title: { uz: 'Zaxira dars', ru: 'Резервный урок' }, sub: { uz: 'yetib olish / sayqallash', ru: 'догнать / отшлифовать' } },
      { key: 'fe-16', n: 16, type: 'Demo',    emoji: '🎤', title: { uz: 'Demo Day', ru: 'Demo Day' }, sub: { uz: 'guruh + mehmonlar oldida himoya', ru: 'защита перед группой и гостями' } },
    ],
  },
  {
    id: 'm5',
    label: { uz: '5-Modul', ru: '5-Модуль' },
    heading: { uz: '5-Modul — Backend: Node-Express + PostgreSQL', ru: '5-Модуль — Backend: Node-Express + PostgreSQL' },
    lead: { uz: "Ma'lumot sxemasidan to'liq fullstack loyihagacha — dastur tartibida.", ru: 'От схемы данных до полного fullstack-проекта — в порядке программы.' },
    lessons: [
      { key: 'be-01', n: 1,  type: 'Kod',     emoji: '🔌', title: { uz: "Ma'lumot nima", ru: 'Что такое данные' }, sub: { uz: "JSON, jadval, bog'lanish, PK/FK", ru: 'JSON, таблица, связи, PK/FK' }, comp: DataIntroLesson, lessonId: 'data-intro-04-01-v18' },
      { key: 'be-02', n: 2,  type: 'PM',      emoji: '📊', title: { uz: "Ma'lumot ham mahsulot qarori", ru: 'Данные — тоже продуктовое решение' }, sub: { uz: "nimani saqlaymiz va nega — bo'lim shundan quriladi", ru: 'что храним и зачем — раздел строится из этого' }, comp: PmLesson11, lessonId: 'pm-m4d2-v1' },
      { key: 'be-03', n: 3,  type: 'Kod',     emoji: '📦', title: { uz: 'SQL vs NoSQL — PostgreSQL', ru: 'SQL vs NoSQL — PostgreSQL' }, sub: { uz: 'qachon qaysi biri kerak', ru: 'когда что нужно' }, comp: DbSqlNosqlLesson, lessonId: 'db-sql-nosql-04-02-v18' },
      { key: 'be-04', n: 4,  type: 'Kod',     emoji: '🏪', title: { uz: 'Node.js — birinchi server', ru: 'Node.js — первый сервер' }, sub: { uz: 'npm, Express, birinchi endpoint', ru: 'npm, Express, первый endpoint' }, comp: NodeServerLesson, lessonId: 'node-server-04-03-v18' },
      { key: 'be-05', n: 5,  type: 'Kod',     emoji: '📮', title: { uz: 'Routing — Express / Nest', ru: 'Роутинг — Express / Nest' }, sub: { uz: 'method + path, 404, /:id', ru: 'метод + путь, 404, /:id' }, comp: RoutingLesson, lessonId: 'nest-routing-04-04-v18' },
      { key: 'be-06', n: 6,  type: 'Kod',     emoji: '🐘', title: { uz: "PostgreSQL so'rovlari", ru: 'Запросы PostgreSQL' }, sub: { uz: 'SELECT, INSERT, UPDATE, DELETE', ru: 'SELECT, INSERT, UPDATE, DELETE' }, comp: PostgresCrudLesson, lessonId: 'pg-crud-04-05-v18' },
      { key: 'be-07', n: 7,  type: 'PM',      emoji: '🔐', title: { uz: 'Xavfsizlik — foydalanuvchi ishonchi', ru: 'Безопасность — доверие пользователя' }, sub: { uz: 'nima ochiq, nima yopiq — ishonch mahsulot qiymati', ru: 'что открыто, что закрыто — доверие как ценность продукта' }, comp: PmLesson12, lessonId: 'pm-m4d7-v1' },
      { key: 'be-08', n: 8,  type: 'Proyekt', emoji: '🚗', title: { uz: 'Praktika: Backend CRUD', ru: 'Практика: Backend CRUD' }, sub: { uz: 'AvtoIjara — Express + PostgreSQL', ru: 'AvtoIjara — Express + PostgreSQL' }, comp: BackendCrudPracticeLesson, lessonId: 'backend-crud-practice-p1-v18' },
      { key: 'be-09', n: 9,  type: 'Kod',     emoji: '📡', title: { uz: 'API nima + Postman', ru: 'Что такое API + Postman' }, sub: { uz: "so'rov va javob, status kodlari", ru: 'запрос и ответ, коды статусов' }, comp: ApiPostmanLesson, lessonId: 'api-postman-04-06-v18' },
      { key: 'be-10', n: 10, type: 'Proyekt', emoji: '🌉', title: { uz: 'Praktika: React + Node ulash', ru: 'Практика: связать React + Node' }, sub: { uz: 'fetch, CORS — front ↔ back', ru: 'fetch, CORS — фронт ↔ бэк' }, comp: FullstackConnectPracticeLesson, lessonId: 'fullstack-connect-practice-p2-v18' },
      { key: 'be-11', n: 11, type: 'Kod',     emoji: '🔑', title: { uz: 'Autentifikatsiya va .env', ru: 'Аутентификация и .env' }, sub: { uz: 'JWT token, login, himoyalangan route', ru: 'JWT-токен, логин, защищённый маршрут' }, comp: AuthEnvLesson, lessonId: 'auth-env-04-07-v18' },
      { key: 'be-12', n: 12, type: 'PM',      emoji: '🗂️', title: { uz: 'Ilova nimani yozib qoladi?', ru: 'Что приложение записывает?' }, sub: { uz: "e'londan sxemagacha — uch ustun", ru: 'от объявления до схемы — три колонки' }, comp: PmLesson13, lessonId: 'pm-m4d12-v1' },
      { key: 'be-13', n: 13, type: 'Proyekt', emoji: '🅿️', title: { uz: 'Fullstack loyiha kuni', ru: 'Fullstack проектный день' }, sub: { uz: 'AvtoStoyanka — baza + server + panel', ru: 'AvtoStoyanka — база + сервер + панель' }, comp: FullstackProjectDayLesson, lessonId: 'fullstack-projectday-p3-v18' },
      { key: 'be-14', n: 14, type: 'Proyekt', emoji: '💬', title: { uz: "Fikr bo'yicha yaxshilash", ru: 'Доработка по отзывам' }, sub: { uz: 'sinfdoshlar fikridan 3 muammo topib tuzatildi', ru: 'по отзывам одноклассников найдены и исправлены 3 проблемы' }, comp: FullstackFeedbackLesson, lessonId: 'fullstack-feedback-p4-v18' },
      { key: 'be-15', n: 15, type: 'PM',      emoji: '🎤', title: { uz: "\"Qanday ishlaydi?\" deb so'rashsa", ru: 'Если спросят: «Как это работает?»' }, sub: { uz: 'uch qavat — uch oddiy gap', ru: 'три слоя — три простых предложения' }, comp: PmLesson14, lessonId: 'pm-m4d15-v1' },
      { key: 'be-16', n: 16, type: 'Rezerv',  emoji: '📅', title: { uz: 'Zaxira dars', ru: 'Резервный урок' }, sub: { uz: 'yetib olish / sayqallash', ru: 'догнать / отшлифовать' } },
      { key: 'be-17', n: 17, type: 'Demo',    emoji: '🎤', title: { uz: 'Demo Day', ru: 'Demo Day' }, sub: { uz: 'jonli fullstack demo', ru: 'живое fullstack-демо' } },
    ],
  },
  {
    id: 'm6',
    label: { uz: '6-Modul', ru: '6-Модуль' },
    heading: { uz: '6-Modul — Backend: NestJS + Testlash + CI/CD Deploy', ru: '6-Модуль — Backend: NestJS + Тестирование + CI/CD Deploy' },
    lead: { uz: "Arxitekturadan avtomatik chiqarishgacha — dastur tartibida.", ru: 'От архитектуры до автоматического выпуска — в порядке программы.' },
    lessons: [
      { key: 'nb-01', n: 1,  type: 'Kod',     emoji: '🪺', title: { uz: 'NestJS va arxitektura', ru: 'NestJS и архитектура' }, sub: { uz: 'MVC, module, controller, service', ru: 'MVC, module, controller, service' }, comp: NestArchAliveLesson, lessonId: 'nest-arch-alive-4a-01-v18' },
      { key: 'nb-02', n: 2,  type: 'PM',      emoji: '📈', title: { uz: 'Hamma birdan kirsa, sayt chidaydimi?', ru: 'Выдержит ли сайт, если все зайдут разом?' }, sub: { uz: "yuk — birdan kelgan og'irlik", ru: 'нагрузка — тяжесть, пришедшая разом' }, comp: PmLesson15, lessonId: 'pm-m4a2-v1' },
      { key: 'nb-03', n: 3,  type: 'Kod',     emoji: '📋', title: { uz: 'Boilerplate: Nest + PostgreSQL', ru: 'Boilerplate: Nest + PostgreSQL' }, sub: { uz: 'Entity, DTO, Repository — CRUD', ru: 'Entity, DTO, Repository — CRUD' }, comp: NestArchResourceLesson, lessonId: 'nest-arch-resource-4a-02-v18' },
      { key: 'nb-04', n: 4,  type: 'Proyekt', emoji: '📚', title: { uz: 'Praktika: yangi modul', ru: 'Практика: новый модуль' }, sub: { uz: "KitobShop — o'z controller + service", ru: 'KitobShop — свой controller + service' }, comp: NestArchPracticeLesson, lessonId: 'nest-arch-practice-4a-03-v18' },
      { key: 'nb-05', n: 5,  type: 'Kod',     emoji: '🧪', title: { uz: 'Unit-test: Jest', ru: 'Unit-тест: Jest' }, sub: { uz: 'describe / it / expect — birinchi test', ru: 'describe / it / expect — первый тест' }, comp: JestUnitTestLesson, lessonId: 'jest-unit-04b-01-v18' },
      { key: 'nb-06', n: 6,  type: 'PM',      emoji: '🛡️', title: { uz: 'Bitta xato — nechta odam ketadi?', ru: 'Одна ошибка — сколько людей уйдёт?' }, sub: { uz: 'nosozlik qayerda tutilsa — shuncha arzon', ru: 'где поймана поломка — настолько она дешевле' }, comp: PmLesson16, lessonId: 'pm-m4b2-v1' },
      { key: 'nb-07', n: 7,  type: 'Kod',     emoji: '🌶️', title: { uz: 'Edge case va error path', ru: 'Edge case и error path' }, sub: { uz: 'happy path vs xato, toThrow', ru: 'happy path против ошибки, toThrow' }, comp: EdgeCasesTestLesson, lessonId: 'edge-cases-04b-02-v18' },
      { key: 'nb-08', n: 8,  type: 'Kod',     emoji: '🛫', title: { uz: 'CI/CD nima va nega kerak', ru: 'Что такое CI/CD и зачем он нужен' }, sub: { uz: 'Continuous Integration / Deployment', ru: 'Continuous Integration / Deployment' }, comp: CiCdIntroLesson, lessonId: 'cicd-intro-4c-01-v18' },
      { key: 'nb-09', n: 9,  type: 'PM',      emoji: '⚡', title: { uz: "Hammasini birdan chiqaraymi — yoki har hafta bo'lak?", ru: 'Выпустить всё разом — или по кусочку каждую неделю?' }, sub: { uz: "kim tez-tez chiqarsa, o'sha oldin biladi", ru: 'кто выпускает чаще, тот узнаёт раньше' }, comp: PmLesson17, lessonId: 'pm-m4c2-v1' },
      { key: 'nb-10', n: 10, type: 'Kod',     emoji: '🗺️', title: { uz: 'GitHub Actions — asoslar', ru: 'GitHub Actions — основы' }, sub: { uz: 'avtomatik ish oqimi: qadamlar va sozlash fayli', ru: 'автоматический поток работ: шаги и файл настройки' }, comp: GithubActionsLesson, lessonId: 'github-actions-4c-02-v18' },
      { key: 'nb-11', n: 11, type: 'Proyekt', emoji: '🧳', title: { uz: "Loyiha kuni: to'liq lenta", ru: 'Проектный день: полный конвейер' }, sub: { uz: 'backend + frontend — real loyiha', ru: 'backend + frontend — реальный проект' }, comp: FullPipelineProjectLesson, lessonId: 'cicd-full-pipeline-4c-03-v18' },
      { key: 'nb-12', n: 12, type: 'Proyekt', emoji: '🧑‍🔧', title: { uz: 'Loyiha kuni: promptlar bilan', ru: 'Проектный день: с промптами' }, sub: { uz: 'AI bilan lentani boshqarish', ru: 'управление конвейером с ИИ' }, comp: AiPipelineProjectLesson, lessonId: 'cicd-ai-pipeline-4c-05-v18' },
      { key: 'nb-13', n: 13, type: 'PM',      emoji: '📟', title: { uz: 'Saytingiz hozir ochilyaptimi?', ru: 'Ваш сайт сейчас открывается?' }, sub: { uz: "chiqqandan keyin saytni kim o'lchaydi", ru: 'кто измеряет сайт после выпуска' }, comp: PmLesson18, lessonId: 'pm-m4c6-v1' },
      { key: 'nb-14', n: 14, type: 'Proyekt', emoji: '⚙️', title: { uz: 'Loyiha kuni: hammasi birga', ru: 'Проектный день: всё вместе' }, sub: { uz: 'test + lint + deploy + monitoring', ru: 'тест + lint + deploy + мониторинг' }, comp: FullProPipelineLesson, lessonId: 'full-pro-pipeline-4c-04-v18' },
      { key: 'nb-15', n: 15, type: 'Rezerv',  emoji: '📅', title: { uz: 'Zaxira dars', ru: 'Резервный урок' }, sub: { uz: 'yetib olish / sayqallash', ru: 'догнать / отшлифовать' } },
    ],
  },]

export const ALL_LESSONS = MODULES.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })))
