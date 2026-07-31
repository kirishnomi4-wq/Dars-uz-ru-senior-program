import { useState, useEffect, useMemo, lazy, Suspense } from 'react'

// ============================================================================
// TEXNIK DARSLAR DEMO — 1–6 modul (4a/4b/4c bilan), faqat Kod + Proyekt darslari.
// QA-ko'rik uchun alohida Vercel loyihasi. Tartib va kalitlar App.jsx bilan 1:1.
// UZ-RU: global til tanlagich (localStorage cc_lang) — har darsga lang prop uzatiladi.
// ============================================================================

const L = (p) => lazy(p)

// ---- 1-Modul
const InternetLesson = L(() => import('../1-Modull/InternetLesson.jsx'))
const Htmllesson1 = L(() => import('../1-Modull/Htmllesson1.jsx'))
const Htmllesson2 = L(() => import('../1-Modull/Htmllesson2.jsx'))
const HtmlTakrorlashLesson = L(() => import('../1-Modull/HtmlTakrorlashLesson.jsx'))
const VsCodeLesson = L(() => import('../1-Modull/VsCodeLesson.jsx'))
const CssLesson1 = L(() => import('../1-Modull/CssLesson1.jsx'))
const CssLesson2 = L(() => import('../1-Modull/CssLesson2.jsx'))
const HtmlPractice = L(() => import('../1-Modull/HtmlPractice.jsx'))
const GitLesson = L(() => import('../1-Modull/GitLesson.jsx'))
const CssPractice = L(() => import('../1-Modull/CssPractice.jsx'))
const DeployLesson = L(() => import('../1-Modull/DeployLesson.jsx'))

// ---- 2-Modul
const JsIntroLesson = L(() => import('../2-Modull/JsIntroLesson.jsx'))
const JsVarsLesson = L(() => import('../2-Modull/JsVarsLesson.jsx'))
const JsConditionsLesson = L(() => import('../2-Modull/JsConditionsLesson.jsx'))
const JsLoopsLesson = L(() => import('../2-Modull/JsLoopsLesson.jsx'))
const JsFunctionsLesson = L(() => import('../2-Modull/JsFunctionsLesson.jsx'))
const PracticeLesson1 = L(() => import('../2-Modull/PracticeLesson1.jsx'))
const PracticeLesson2 = L(() => import('../2-Modull/PracticeLesson2.jsx'))
const PeanStackLesson = L(() => import('../2-Modull/PeanStackLesson.jsx'))
const PracticeLesson3 = L(() => import('../2-Modull/PracticeLesson3.jsx'))
const PracticeLesson4 = L(() => import('../2-Modull/PracticeLesson4.jsx'))

// ---- 3-Modul
const ReactIntroLesson = L(() => import('../3-Modull/ReactIntroLesson.jsx'))
const ReactFirstComponentLesson = L(() => import('../3-Modull/ReactFirstComponentLesson.jsx'))
const ReactStateEffectLesson = L(() => import('../3-Modull/ReactStateEffectLesson.jsx'))
const ReactPropsReuseLesson = L(() => import('../3-Modull/ReactPropsReuseLesson.jsx'))
const ReactCrudPracticeLesson = L(() => import('../3-Modull/ReactCrudPracticeLesson.jsx'))
const ReactApiGetLesson = L(() => import('../3-Modull/ReactApiGetLesson.jsx'))
const ReactApiPostLesson = L(() => import('../3-Modull/ReactApiPostLesson.jsx'))
const ReactRouterPracticeLesson = L(() => import('../3-Modull/ReactRouterPracticeLesson.jsx'))
const ReactProjectDayLesson = L(() => import('../3-Modull/ReactProjectDayLesson.jsx'))
const ReactBuildSiteLesson = L(() => import('../3-Modull/ReactBuildSiteLesson.jsx'))

// ---- 4-Modul
const DataIntroLesson = L(() => import('../4-Modull/DataIntroLesson.jsx'))
const DbSqlNosqlLesson = L(() => import('../4-Modull/DbSqlNosqlLesson.jsx'))
const NodeServerLesson = L(() => import('../4-Modull/NodeServerLesson.jsx'))
const RoutingLesson = L(() => import('../4-Modull/RoutingLesson.jsx'))
const PostgresCrudLesson = L(() => import('../4-Modull/PostgresCrudLesson.jsx'))
const BackendCrudPracticeLesson = L(() => import('../4-Modull/BackendCrudPracticeLesson.jsx'))
const ApiPostmanLesson = L(() => import('../4-Modull/ApiPostmanLesson.jsx'))
const FullstackConnectPracticeLesson = L(() => import('../4-Modull/FullstackConnectPracticeLesson.jsx'))
const AuthEnvLesson = L(() => import('../4-Modull/AuthEnvLesson.jsx'))
const FullstackProjectDayLesson = L(() => import('../4-Modull/FullstackProjectDayLesson.jsx'))
const FullstackFeedbackLesson = L(() => import('../4-Modull/FullstackFeedbackLesson.jsx'))

// ---- 4a-Modul
const NestArchAliveLesson = L(() => import('../4a-Modull/NestArchAliveLesson.jsx'))
const NestArchResourceLesson = L(() => import('../4a-Modull/NestArchResourceLesson.jsx'))
const NestArchPracticeLesson = L(() => import('../4a-Modull/NestArchPracticeLesson.jsx'))

// ---- 4b-Modul
const JestUnitTestLesson = L(() => import('../4b-Modull/JestUnitTestLesson.jsx'))
const EdgeCasesTestLesson = L(() => import('../4b-Modull/EdgeCasesTestLesson.jsx'))

// ---- 4c-Modul
const CiCdIntroLesson = L(() => import('../4c-Modull/CiCdIntroLesson.jsx'))
const GithubActionsLesson = L(() => import('../4c-Modull/GithubActionsLesson.jsx'))
const FullPipelineProjectLesson = L(() => import('../4c-Modull/FullPipelineProjectLesson.jsx'))
const AiPipelineProjectLesson = L(() => import('../4c-Modull/AiPipelineProjectLesson.jsx'))
const FullProPipelineLesson = L(() => import('../4c-Modull/FullProPipelineLesson.jsx'))

// ---- 5-Modul
const BotIntroLesson = L(() => import('../5-Modull/BotIntroLesson.jsx'))
const BotApiButtonsLesson = L(() => import('../5-Modull/BotApiButtonsLesson.jsx'))
const BotStatefulMemoryLesson = L(() => import('../5-Modull/BotStatefulMemoryLesson.jsx'))
const BotAiProjectLesson = L(() => import('../5-Modull/BotAiProjectLesson.jsx'))
const BotAiBrainLesson = L(() => import('../5-Modull/BotAiBrainLesson.jsx'))
const BotFullProjectLesson = L(() => import('../5-Modull/BotFullProjectLesson.jsx'))
const BotFeedbackIterationLesson = L(() => import('../5-Modull/BotFeedbackIterationLesson.jsx'))
const BotAiAgentLesson = L(() => import('../5-Modull/BotAiAgentLesson.jsx'))

// ---- 6-Modul
const SystemArchitectureLesson = L(() => import('../6-Modull/SystemArchitectureLesson.jsx'))
const ArchPatternsLesson = L(() => import('../6-Modull/ArchPatternsLesson.jsx'))
const AgentArchitectureLesson = L(() => import('../6-Modull/AgentArchitectureLesson.jsx'))
const ClaudeSkillsLesson = L(() => import('../6-Modull/ClaudeSkillsLesson.jsx'))
const WriteSkillLesson = L(() => import('../6-Modull/WriteSkillLesson.jsx'))
const PipelineProjectLesson = L(() => import('../6-Modull/PipelineProjectLesson.jsx'))
const ReactNativeBasicsLesson = L(() => import('../6-Modull/ReactNativeBasicsLesson.jsx'))
const ReactNativeAppLesson = L(() => import('../6-Modull/ReactNativeAppLesson.jsx'))
const MobileAppPracticeLesson = L(() => import('../6-Modull/MobileAppPracticeLesson.jsx'))
const FullSystemProjectLesson = L(() => import('../6-Modull/FullSystemProjectLesson.jsx'))

// n = PDF dasturidagi asl dars raqami (App.jsx bilan bir xil — QA hisobot uchun mo'ljal)
const MODULES = [
  {
    id: '1', slug: 'm1', title: 'Men internetdaman',
    lessons: [
      { key: 'm1-01', n: 1,  type: 'Kod',     emoji: '🌐', title: 'Internet qanday ishlaydi',        sub: 'brauzer, server, domen, DNS — so\'rov yo\'li', comp: InternetLesson },
      { key: 'm1-03', n: 3,  type: 'Kod',     emoji: '📄', title: 'HTML qo\'lda — 1',                sub: 'teg, sarlavha, ro\'yxat, havola', comp: Htmllesson1 },
      { key: 'm1-04', n: 4,  type: 'Kod',     emoji: '🖼️', title: 'HTML qo\'lda — 2',                sub: 'rasm, forma, struktura, DevTools', comp: Htmllesson2 },
      { key: 'm1-14', n: 5,  type: 'Kod',     emoji: '🛠️', title: 'Takrorlash: HTML ustaxonasi',     sub: 'birinchi mijozlar — 5 buyurtma, debug, imtihon', comp: HtmlTakrorlashLesson },
      { key: 'm1-06', n: 7,  type: 'Kod',     emoji: '🎨', title: 'CSS qo\'lda — 1',                 sub: 'rang, shrift, bo\'shliqlar', comp: CssLesson1 },
      { key: 'm1-07', n: 8,  type: 'Kod',     emoji: '📐', title: 'CSS qo\'lda — 2',                 sub: 'layout, flexbox, DevTools', comp: CssLesson2 },
      { key: 'm1-08', n: 9,  type: 'Proyekt', emoji: '🧱', title: 'Praktika: portfolio strukturasi', sub: 'saytni bo\'laklaymiz, HTML skelet', comp: HtmlPractice },
      { key: 'm1-15', n: 10, type: 'Kod',     emoji: '💻', title: 'VS Code — professional start',    sub: 'o\'rnatish, Emmet, Live Server, jonli card', comp: VsCodeLesson },
      { key: 'm1-10', n: 11, type: 'Proyekt', emoji: '💅', title: 'Praktika: bezash va yakunlash',   sub: 'CSS + kontent + AI bilan tugma', comp: CssPractice },
      { key: 'm1-09', n: 12, type: 'Kod',     emoji: '🔀', title: 'Git va GitHub',                   sub: 'commit, push — kod uchun vaqt mashinasi', comp: GitLesson },
      { key: 'm1-11', n: 13, type: 'Kod',     emoji: '🚀', title: 'Netlify va deploy',               sub: 'hosting, maktab poddomeni', comp: DeployLesson },
    ],
  },
  {
    id: '2', slug: 'm2', title: 'Sistemalar qanday o\'ylaydi',
    lessons: [
      { key: 'm2-01', n: 1,  type: 'Kod',     emoji: '🧠', title: 'Sistema va Algoritm',              sub: 'komponent, bog\'lanish, ketma-ketlik', comp: JsIntroLesson },
      { key: 'm2-03', n: 3,  type: 'Kod',     emoji: '📦', title: 'JS — O\'zgaruvchilar',             sub: 'let / const / var, ma\'lumot turlari', comp: JsVarsLesson },
      { key: 'm2-04', n: 4,  type: 'Kod',     emoji: '🔀', title: 'JS — if / else',                   sub: 'shart, taqqoslash operatorlari', comp: JsConditionsLesson },
      { key: 'm2-05', n: 5,  type: 'Kod',     emoji: '🔁', title: 'JS — Sikllar',                     sub: 'for, while, massivni aylanish', comp: JsLoopsLesson },
      { key: 'm2-06', n: 6,  type: 'Kod',     emoji: '🧩', title: 'JS — Funksiyalar, Array + Object', sub: 'parametr, return, xotira (Stack/Heap)', comp: JsFunctionsLesson },
      { key: 'm2-08', n: 8,  type: 'Proyekt', emoji: '⚡', title: 'Loyiha kuni: saytga jon',          sub: 'HTML/CSS saytga interaktivlik', comp: PracticeLesson1 },
      { key: 'm2-09', n: 9,  type: 'Proyekt', emoji: '🤖', title: 'Loyiha kuni: AI bilan tez sayt',   sub: 'prompt orqali sifatli loyiha', comp: PracticeLesson2 },
      { key: 'm2-10', n: 10, type: 'Kod',     emoji: '🍽️', title: 'PERN Stack — umumiy ko\'rinish',   sub: 'PostgreSQL + Express + React + Node', comp: PeanStackLesson },
      { key: 'm2-11', n: 11, type: 'Proyekt', emoji: '🛠️', title: 'Dekompozitsiya va ishlab chiqish — 1', sub: 'AI\'ni ochishdan oldin bo\'laklaymiz', comp: PracticeLesson3 },
      { key: 'm2-12', n: 12, type: 'Proyekt', emoji: '🚀', title: 'Ishlab chiqish — 2: MVP tayyor',   sub: 'feature\'larni yakunlash, deploy', comp: PracticeLesson4 },
    ],
  },
  {
    id: '3', slug: 'm3', title: 'Frontend — React',
    lessons: [
      { key: 'm3-01', n: 1,  type: 'Kod',     emoji: '⚛️', title: 'React nima va nima uchun?',       sub: 'komponent, Virtual DOM, React Native', comp: ReactIntroLesson },
      { key: 'm3-03', n: 3,  type: 'Kod',     emoji: '🧱', title: 'Birinchi komponent',              sub: 'Vite, JSX, props, loyiha strukturasi', comp: ReactFirstComponentLesson },
      { key: 'm3-04', n: 4,  type: 'Kod',     emoji: '💗', title: 'State va Effect',                 sub: 'useState + useEffect, lifecycle', comp: ReactStateEffectLesson },
      { key: 'm3-06', n: 6,  type: 'Kod',     emoji: '🏭', title: 'Props va qayta ishlatish',        sub: 'ma\'lumotni komponentlar orasida uzatish', comp: ReactPropsReuseLesson },
      { key: 'm3-07', n: 7,  type: 'Proyekt', emoji: '🐠', title: 'Praktika: AI bilan to\'liq CRUD', sub: 'Create / Read / Update / Delete', comp: ReactCrudPracticeLesson },
      { key: 'm3-08', n: 8,  type: 'Kod',     emoji: '🛎️', title: 'API bilan ishlash — GET',         sub: 'fetch / axios, JSON, loading', comp: ReactApiGetLesson },
      { key: 'm3-09', n: 9,  type: 'Kod',     emoji: '📦', title: 'API — POST / PUT / DELETE',       sub: 'serverga ma\'lumot yuborish', comp: ReactApiPostLesson },
      { key: 'm3-11', n: 11, type: 'Proyekt', emoji: '🌀', title: 'Praktika: React Router',          sub: 'ko\'p sahifali ilova, navigatsiya', comp: ReactRouterPracticeLesson },
      { key: 'm3-12', n: 12, type: 'Proyekt', emoji: '🚗', title: 'Loyiha kuni — AvtoIjara',         sub: 'React + API + CRUD + routing', comp: ReactProjectDayLesson },
      { key: 'm3-13', n: 13, type: 'Proyekt', emoji: '🏗️', title: 'Final loyihani bo\'laklash va qurish', sub: 'komponent sxemasi + ishlaydigan loyiha', comp: ReactBuildSiteLesson },
    ],
  },
  {
    id: '4', slug: 'm4', title: 'Ma\'lumot va bog\'lanishlar',
    lessons: [
      { key: 'm4-01', n: 1,  type: 'Kod',     emoji: '🔌', title: 'Ma\'lumot nima',               sub: 'JSON, jadval, bog\'lanish, PK/FK', comp: DataIntroLesson },
      { key: 'm4-03', n: 3,  type: 'Kod',     emoji: '📦', title: 'SQL vs NoSQL — PostgreSQL',    sub: 'qachon qaysi biri kerak', comp: DbSqlNosqlLesson },
      { key: 'm4-04', n: 4,  type: 'Kod',     emoji: '🏪', title: 'Node.js — birinchi server',    sub: 'npm, Express, birinchi endpoint', comp: NodeServerLesson },
      { key: 'm4-05', n: 5,  type: 'Kod',     emoji: '📮', title: 'Routing — Express / Nest',     sub: 'method + path, 404, /:id', comp: RoutingLesson },
      { key: 'm4-06', n: 6,  type: 'Kod',     emoji: '🐘', title: 'PostgreSQL so\'rovlari',       sub: 'SELECT, INSERT, UPDATE, DELETE', comp: PostgresCrudLesson },
      { key: 'm4-08', n: 8,  type: 'Proyekt', emoji: '🚗', title: 'Praktika: Backend CRUD',       sub: 'AvtoIjara — Express + PostgreSQL', comp: BackendCrudPracticeLesson },
      { key: 'm4-09', n: 9,  type: 'Kod',     emoji: '📡', title: 'API nima + Postman',           sub: 'so\'rov va javob, status kodlari', comp: ApiPostmanLesson },
      { key: 'm4-10', n: 10, type: 'Proyekt', emoji: '🌉', title: 'Praktika: React + Node ulash', sub: 'fetch, CORS — front ↔ back', comp: FullstackConnectPracticeLesson },
      { key: 'm4-11', n: 11, type: 'Kod',     emoji: '🔑', title: 'Autentifikatsiya va .env',     sub: 'JWT token, login, himoyalangan route', comp: AuthEnvLesson },
      { key: 'm4-13', n: 13, type: 'Proyekt', emoji: '🅿️', title: 'Fullstack loyiha kuni',        sub: 'AvtoStoyanka — baza + server + panel', comp: FullstackProjectDayLesson },
      { key: 'm4-14', n: 14, type: 'Proyekt', emoji: '💬', title: 'Fikr bo\'yicha yaxshilash',    sub: 'sinfdoshlar fikridan 3 muammo topib tuzatildi', comp: FullstackFeedbackLesson },
    ],
  },
  {
    id: '4a', slug: 'm4a', title: 'NestJS + Arxitektura',
    lessons: [
      { key: 'm4a-01', n: 1, type: 'Kod',     emoji: '🪺', title: 'NestJS va arxitektura',          sub: 'MVC, module, controller, service', comp: NestArchAliveLesson },
      { key: 'm4a-03', n: 3, type: 'Kod',     emoji: '📋', title: 'Boilerplate: Nest + PostgreSQL', sub: 'Entity, DTO, Repository — CRUD', comp: NestArchResourceLesson },
      { key: 'm4a-04', n: 4, type: 'Proyekt', emoji: '📚', title: 'Praktika: yangi modul',          sub: 'KitobShop — o\'z controller + service', comp: NestArchPracticeLesson },
    ],
  },
  {
    id: '4b', slug: 'm4b', title: 'Loyihani testlash',
    lessons: [
      { key: 'm4b-01', n: 1, type: 'Kod', emoji: '🧪', title: 'Unit-test: Jest',         sub: 'describe / it / expect — birinchi test', comp: JestUnitTestLesson },
      { key: 'm4b-03', n: 3, type: 'Kod', emoji: '🌶️', title: 'Edge case va error path', sub: 'happy path vs xato, toThrow', comp: EdgeCasesTestLesson },
    ],
  },
  {
    id: '4c', slug: 'm4c', title: 'CI/CD + Deploy',
    lessons: [
      { key: 'm4c-01', n: 1, type: 'Kod',     emoji: '🛫', title: 'CI/CD nima va nega kerak',     sub: 'Continuous Integration / Deployment', comp: CiCdIntroLesson },
      { key: 'm4c-03', n: 3, type: 'Kod',     emoji: '🗺️', title: 'GitHub Actions — asoslar',     sub: 'avtomatik ish oqimi: qadamlar va sozlash fayli', comp: GithubActionsLesson },
      { key: 'm4c-04', n: 4, type: 'Proyekt', emoji: '🧳', title: 'Loyiha kuni: to\'liq lenta',   sub: 'backend + frontend — real loyiha', comp: FullPipelineProjectLesson },
      { key: 'm4c-05', n: 5, type: 'Proyekt', emoji: '🧑‍🔧', title: 'Loyiha kuni: promptlar bilan', sub: 'AI bilan lentani boshqarish', comp: AiPipelineProjectLesson },
      { key: 'm4c-07', n: 7, type: 'Proyekt', emoji: '⚙️', title: 'Loyiha kuni: hammasi birga',   sub: 'test + lint + deploy + monitoring', comp: FullProPipelineLesson },
    ],
  },
  {
    id: '5', slug: 'm5', title: 'Botlar va avtomatlashtirish',
    lessons: [
      { key: 'm5-01', n: 1,  type: 'Kod',     emoji: '🤖', title: 'Bot nima',                     sub: 'hodisaga javob beradigan mantiq: signal keladi, bot amal qiladi', comp: BotIntroLesson },
      { key: 'm5-03', n: 3,  type: 'Kod',     emoji: '🎛️', title: 'Telegram Bot API + tugmalar',  sub: 'BotFather, token, /start, inline', comp: BotApiButtonsLesson },
      { key: 'm5-04', n: 4,  type: 'Kod',     emoji: '🧠', title: 'Stateful logika + PostgreSQL', sub: 'bot eslab qoladi, ma\'lumot saqlaydi', comp: BotStatefulMemoryLesson },
      { key: 'm5-05', n: 5,  type: 'Proyekt', emoji: '🪄', title: 'Loyiha kuni: AI bilan bot',    sub: 'promptlar bilan istalgan Telegram bot', comp: BotAiProjectLesson },
      { key: 'm5-06', n: 6,  type: 'Proyekt', emoji: '💡', title: 'Bot ichida AI',                sub: 'AI API\'ni ulash, xulq sozlash', comp: BotAiBrainLesson },
      { key: 'm5-07', n: 7,  type: 'Proyekt', emoji: '📦', title: 'Loyiha kuni: bot + DB + AI',   sub: 'to\'liq ishlaydigan bot + hosting', comp: BotFullProjectLesson },
      { key: 'm5-09', n: 9,  type: 'Proyekt', emoji: '🔁', title: 'Fikr va iteratsiya',           sub: 'foydalanuvchi nima dedi va nimani tuzatamiz', comp: BotFeedbackIterationLesson },
      { key: 'm5-10', n: 10, type: 'Proyekt', emoji: '🦾', title: 'AI-agent yaratish',            sub: 'idrok, qaror va amal aylanmasi', comp: BotAiAgentLesson },
    ],
  },
  {
    id: '6', slug: 'm6', title: 'Tizimni to\'liq yig\'aman',
    lessons: [
      { key: 'm6-01', n: 1,  type: 'Kod',     emoji: '🧭', title: 'Komponentlardan tizim',           sub: 'front + back + baza + AI + bot', comp: SystemArchitectureLesson },
      { key: 'm6-03', n: 3,  type: 'Kod',     emoji: '🏛️', title: 'Arxitektura patternlari',         sub: 'MVC, mikroservis — sodda tilda', comp: ArchPatternsLesson },
      { key: 'm6-04', n: 4,  type: 'Kod',     emoji: '🦾', title: 'AI-agent nima',                   sub: 'agent vs oddiy AI — qaror sikli', comp: AgentArchitectureLesson },
      { key: 'm6-05', n: 5,  type: 'Kod',     emoji: '✨', title: 'Claude Skills — nima',            sub: 'Skills AI xulqini qanday o\'zgartiradi', comp: ClaudeSkillsLesson },
      { key: 'm6-07', n: 7,  type: 'Kod',     emoji: '🛠️', title: 'O\'z Skill\'ingizni yozing',      sub: 'struktura, test, kontekst-injiniring', comp: WriteSkillLesson },
      { key: 'm6-08', n: 8,  type: 'Proyekt', emoji: '🔗', title: 'Praktika: to\'liq pipeline',      sub: 'React + Node + PG + Telegram + AI', comp: PipelineProjectLesson },
      { key: 'm6-09', n: 9,  type: 'Kod',     emoji: '📱', title: 'React Native — asoslar',          sub: 'RN nima, Expo setup', comp: ReactNativeBasicsLesson },
      { key: 'm6-10', n: 10, type: 'Kod',     emoji: '🧳', title: 'RN: komponent, navigatsiya, API', sub: 'View, Text, Stack Navigator, fetch', comp: ReactNativeAppLesson },
      { key: 'm6-11', n: 11, type: 'Proyekt', emoji: '📲', title: 'Praktika: mobil ilova',           sub: 'eski loyihaning mobil versiyasi', comp: MobileAppPracticeLesson },
      { key: 'm6-13', n: 13, type: 'Proyekt', emoji: '🏗️', title: 'Loyiha kuni: to\'liq tizim',      sub: 'end-to-end ishlaydigan tizim', comp: FullSystemProjectLesson },
    ],
  },
]

const ALL = MODULES.flatMap(m => m.lessons.map(l => ({ ...l, mod: m })))

const TYPE = {
  Kod:     { color: '#019ACB', label: 'Kod' },
  Proyekt: { color: '#1F7A4D', label: 'Proyekt' },
}
const FILTERS = ['Hammasi', 'Kod', 'Proyekt']

function useRoute() {
  const read = () => { const m = window.location.hash.match(/^#\/lesson\/(.+)$/); return m ? m[1] : null }
  const [key, setKey] = useState(read)
  useEffect(() => {
    const on = () => setKey(read())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return key
}

function LessonLoading() {
  return (
    <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', background: '#F6F4EF', fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div className="lz-spin" style={{ width: 34, height: 34, margin: '0 auto 14px', borderRadius: '50%', border: '3px solid #E7E3DA', borderTopColor: '#FF4F28' }} />
        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: '#5A5A60' }}>Dars yuklanmoqda…</p>
      </div>
      <style>{`@keyframes lzspin { to { transform: rotate(360deg) } } .lz-spin { animation: lzspin 0.8s linear infinite }`}</style>
    </div>
  )
}

export default function TexnikDemoApp() {
  const key = useRoute()
  const lesson = ALL.find(l => l.key === key)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('Hammasi')
  // UZ-RU: global dars tili — localStorage'da saqlanadi, har darsga lang prop bo'lib uzatiladi
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('cc_lang') === 'ru' ? 'ru' : 'uz' } catch { return 'uz' }
  })
  const pickLang = (l) => { setLang(l); try { localStorage.setItem('cc_lang', l) } catch {} }

  useEffect(() => { window.scrollTo(0, 0) }, [key])

  const modules = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return MODULES.map(m => ({
      ...m,
      shown: m.lessons.filter(l => {
        if (filter !== 'Hammasi' && l.type !== filter) return false
        if (!needle) return true
        return (l.title + ' ' + l.sub + ' ' + m.title).toLowerCase().includes(needle)
      }),
    })).filter(m => m.shown.length > 0)
  }, [q, filter])

  if (lesson) {
    const C = lesson.comp
    return (
      <Suspense fallback={<LessonLoading />}>
        <C lang={lang} />
        <a href="#/" title="Bosh sahifa — boshqa darsni tanlash" aria-label="Bosh sahifa"
          style={{ position: 'fixed', bottom: 14, left: 14, zIndex: 950, width: 40, height: 40, borderRadius: 12, border: 'none', background: '#FFFFFF', color: '#5A5A60', fontSize: 19, lineHeight: '40px', textAlign: 'center', textDecoration: 'none', cursor: 'pointer', boxShadow: '0 6px 18px -6px rgba(58,53,48,0.35)', opacity: 0.55, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>⌂</a>
        {/* UZ-RU: dars ichida til almashtirgich — ⌂ yonida, progress saqlanadi (komponent remount bo'lmaydi) */}
        <div style={{ position: 'fixed', bottom: 14, left: 62, zIndex: 950, display: 'flex', borderRadius: 12, background: '#FFFFFF', boxShadow: '0 6px 18px -6px rgba(58,53,48,0.35)', overflow: 'hidden', opacity: 0.55, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>
          {['uz', 'ru'].map(l => (
            <button key={l} title={l === 'uz' ? "Dars tili: o'zbekcha" : 'Язык урока: русский'} onClick={() => pickLang(l)}
              style={{ width: 34, height: 40, border: 'none', cursor: 'pointer', fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 800, fontSize: 11.5, background: lang === l ? '#0E0E10' : 'transparent', color: lang === l ? '#fff' : '#5A5A60', transition: 'background 0.15s, color 0.15s' }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </Suspense>
    )
  }

  const counts = { Kod: 0, Proyekt: 0 }
  ALL.forEach(l => { if (counts[l.type] !== undefined) counts[l.type]++ })

  return (
    <div style={{ minHeight: '100dvh', background: '#F6F4EF', fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,600&family=Manrope:wght@500;600;700;800&display=swap');
        .hp { max-width: 880px; margin: 0 auto; padding: clamp(28px,5vw,56px) 20px 80px; }
        .lz-card { display: flex; align-items: center; gap: 14px; width: 100%; text-align: left; background: #fff; border: none; border-radius: 14px; padding: 13px 16px; cursor: pointer; text-decoration: none; box-shadow: 0 5px 18px -12px rgba(58,53,48,0.22); transition: transform 0.16s, box-shadow 0.16s; }
        .lz-card:hover { transform: translateY(-2px); box-shadow: 0 14px 30px -12px rgba(255,79,40,0.3); }
        .lz-card:hover .lz-arrow { color: #FF4F28; transform: translateX(4px); }
        .lz-num { flex-shrink: 0; width: 28px; height: 28px; border-radius: 8px; background: #F6F4EF; color: #5A5A60; font-weight: 800; font-size: 12.5px; display: flex; align-items: center; justify-content: center; }
        .lz-chip { flex-shrink: 0; font-size: 10.5px; font-weight: 800; padding: 3px 9px; border-radius: 99px; letter-spacing: 0.02em; }
        .lz-grid { display: flex; flex-direction: column; gap: 8px; }
        .lz-nav { position: sticky; top: 0; z-index: 20; background: rgba(246,244,239,0.92); backdrop-filter: blur(8px); border-bottom: 1px solid #E7E3DA; }
        .lz-nav-in { max-width: 880px; margin: 0 auto; padding: 10px 20px; display: flex; gap: 6px; align-items: center; overflow-x: auto; }
        .lz-pill { flex-shrink: 0; font-size: 12.5px; font-weight: 800; padding: 6px 11px; border-radius: 9px; border: none; background: #fff; color: #5A5A60; cursor: pointer; text-decoration: none; transition: background 0.15s, color 0.15s; }
        .lz-pill:hover { background: #FF4F28; color: #fff; }
        .lz-pill.on { background: #0E0E10; color: #fff; }
        .lz-in { flex: 1; min-width: 120px; border: none; background: #fff; border-radius: 9px; padding: 7px 11px; font: 600 12.5px/1 'Manrope', system-ui, sans-serif; color: #0E0E10; outline: none; }
        .lz-in::placeholder { color: #A7A6A2; font-weight: 600; }
        .lz-mod { scroll-margin-top: 62px; margin-bottom: 30px; }
        @media (max-width: 620px) { .lz-card { gap: 10px; padding: 12px } .lz-chip { display: none } }
      `}</style>

      <nav className="lz-nav">
        <div className="lz-nav-in">
          {MODULES.map(m => <a key={m.id} className="lz-pill" href={`#${m.slug}`}>{m.id}</a>)}
          <span style={{ width: 1, height: 20, background: '#E2DED4', flexShrink: 0, margin: '0 4px' }} />
          {FILTERS.map(f => (
            <button key={f} className={`lz-pill${filter === f ? ' on' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
          <input className="lz-in" placeholder="Dars qidirish…" value={q} onChange={e => setQ(e.target.value)} />
          <span style={{ width: 1, height: 20, background: '#E2DED4', flexShrink: 0, margin: '0 4px' }} />
          {['uz', 'ru'].map(l => (
            <button key={l} className={`lz-pill${lang === l ? ' on' : ''}`} title={l === 'uz' ? "Dars tili: o'zbekcha" : 'Язык уроков: русский'} onClick={() => pickLang(l)}>{l.toUpperCase()}</button>
          ))}
        </div>
      </nav>

      <div className="hp">
        <p style={{ margin: '0 0 6px', fontSize: 11.5, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF4F28' }}>CoddyCamp · Senior 2026 · QA-ko'rik</p>
        <h1 style={{ margin: '0 0 8px', fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 'clamp(27px,4.4vw,40px)', color: '#0E0E10' }}>Texnik darslar — 1–6 modul</h1>
        <p style={{ margin: '0 0 18px', fontSize: 14, fontWeight: 500, color: '#5A5A60', maxWidth: 620 }}>
          Faqat Kod va Proyekt darslari (PM darslar alohida loyihada). Har dars UZ va RU tillarida — tilni yuqoridagi
          yoki dars ichidagi UZ/RU tugmasi bilan almashtiring. Dars raqami — asosiy dasturdagi o'rni.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 34 }}>
          {[
            { v: ALL.length, t: 'texnik dars' },
            { v: counts.Kod, t: '💻 Kod' },
            { v: counts.Proyekt, t: '🛠 Proyekt' },
            { v: 'UZ·RU', t: '🌐 ikki til' },
          ].map(s => (
            <span key={s.t} style={{ background: '#fff', borderRadius: 10, padding: '7px 12px', fontSize: 12.5, fontWeight: 700, color: '#5A5A60', boxShadow: '0 4px 14px -10px rgba(58,53,48,0.3)' }}>
              <b style={{ color: '#0E0E10', fontWeight: 800 }}>{s.v}</b> {s.t}
            </span>
          ))}
        </div>

        {modules.length === 0 && (
          <p style={{ fontSize: 14, fontWeight: 600, color: '#A7A6A2' }}>Hech narsa topilmadi — boshqa so'z bilan qidiring.</p>
        )}

        {modules.map(mod => (
          <section key={mod.id} id={mod.slug} className="lz-mod">
            <div style={{ margin: '0 2px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#FF4F28' }}>{mod.id}-MODUL</span>
                <h2 style={{ margin: 0, fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 'clamp(18px,2.6vw,23px)', color: '#0E0E10' }}>{mod.title}</h2>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#A7A6A2' }}>· {mod.lessons.length} texnik dars</span>
              </div>
            </div>
            <div className="lz-grid">
              {mod.shown.map(l => {
                const t = TYPE[l.type]
                return (
                  <a key={l.key} className="lz-card" href={`#/lesson/${l.key}`}>
                    <span className="lz-num">{l.n}</span>
                    <span style={{ fontSize: 23, flexShrink: 0 }}>{l.emoji}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontWeight: 700, fontSize: 'clamp(14px,1.9vw,16px)', color: '#0E0E10' }}>{l.title}</span>
                      <span style={{ display: 'block', marginTop: 1, fontSize: 12, fontWeight: 500, color: '#8A8880' }}>{l.sub}</span>
                    </span>
                    <span className="lz-chip" style={{ background: `${t.color}18`, color: t.color }}>{t.label}</span>
                    <span className="lz-arrow" style={{ fontSize: 17, color: '#A7A6A2', transition: 'transform 0.2s, color 0.2s', flexShrink: 0 }}>→</span>
                  </a>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
