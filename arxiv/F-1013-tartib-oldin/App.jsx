import { useState, useEffect, useMemo, lazy, Suspense } from 'react'

// ============================================================================
// CODDYCAMP SENIOR 2026 — BARCHA DARSLAR BITTA JOYDA
// Tartib CoddyCamp_Senior_2026_Final PDF dasturiga 1:1 mos (1 → 7-modul).
// Har dars lazy yuklanadi: bosh sahifa yengil, dars ochilganda o'z chunk'i keladi.
// Hash-routing: #/lesson/KEY — orqaga/oldinga va reload ishlaydi (jonli rejim uchun muhim).
// ============================================================================

const L = (p) => lazy(p)

// ---- 1-Modul
const InternetLesson = L(() => import('./1-Modull/InternetLesson.jsx'))
const PmLesson1 = L(() => import('./1-Modull/PmLesson1.jsx')) // PM M1-D2 (v2 PmAudienceLesson o'chirildi — 2026-07-28, keyin shu dars optimallanadi)
const Htmllesson1 = L(() => import('./1-Modull/Htmllesson1.jsx'))
const Htmllesson2 = L(() => import('./1-Modull/Htmllesson2.jsx'))
const HtmlTakrorlashLesson = L(() => import('./1-Modull/HtmlTakrorlashLesson.jsx')) // Takrorlash: HTML ustaxonasi (2026-07-23)
const VsCodeLesson = L(() => import('./1-Modull/VsCodeLesson.jsx')) // VS Code — professional start (2026-07-23)
const PmLesson2 = L(() => import('./1-Modull/PmLesson2.jsx')) // PM M1-D6 (v2 PmStructureLesson o'chirildi — 2026-07-28)
const CssLesson1 = L(() => import('./1-Modull/CssLesson1.jsx'))
const CssLesson2 = L(() => import('./1-Modull/CssLesson2.jsx'))
const HtmlPractice = L(() => import('./1-Modull/HtmlPractice.jsx'))
const GitLesson = L(() => import('./1-Modull/GitLesson.jsx'))
const CssPractice = L(() => import('./1-Modull/CssPractice.jsx'))
const DeployLesson = L(() => import('./1-Modull/DeployLesson.jsx'))
const PmLesson3 = L(() => import('./1-Modull/PmLesson3.jsx')) // PM M1-D14 (v2 PmPitchLesson o'chirildi — 2026-07-28)

// ---- 2-Modul
const JsIntroLesson = L(() => import('./2-Modull/JsIntroLesson.jsx'))
const PmLesson4 = L(() => import('./2-Modull/PmLesson4.jsx'))
const PmMuammoIzlash = L(() => import('./2-Modull/PmMuammoIzlash.jsx')) // F-0928-06: v9 3-Modul #3 (M7 dan ko'chdi)
const JsVarsLesson = L(() => import('./2-Modull/JsVarsLesson.jsx'))
const JsConditionsLesson = L(() => import('./2-Modull/JsConditionsLesson.jsx'))
const JsLoopsLesson = L(() => import('./2-Modull/JsLoopsLesson.jsx'))
const JsFunctionsLesson = L(() => import('./2-Modull/JsFunctionsLesson.jsx'))
const PmLesson5 = L(() => import('./2-Modull/PmLesson5.jsx'))
const PracticeLesson1 = L(() => import('./2-Modull/PracticeLesson1.jsx'))
const PracticeLesson2 = L(() => import('./2-Modull/PracticeLesson2.jsx'))
const PeanStackLesson = L(() => import('./2-Modull/PeanStackLesson.jsx'))
const PracticeLesson3 = L(() => import('./2-Modull/PracticeLesson3.jsx'))
const PracticeLesson4 = L(() => import('./2-Modull/PracticeLesson4.jsx'))
const PmLesson6 = L(() => import('./2-Modull/PmLesson6.jsx'))

// ---- 3-Modul
const ReactIntroLesson = L(() => import('./3-Modull/ReactIntroLesson.jsx'))
const PmUserStoryLesson = L(() => import('./pm/PmUserStoryLesson.jsx')) // PM pipeline P0 (eski PmLesson7 o'rnida)
const ReactFirstComponentLesson = L(() => import('./3-Modull/ReactFirstComponentLesson.jsx'))
const ReactStateEffectLesson = L(() => import('./3-Modull/ReactStateEffectLesson.jsx'))
const PmLesson8 = L(() => import('./3-Modull/PmLesson8.jsx'))
const ReactPropsReuseLesson = L(() => import('./3-Modull/ReactPropsReuseLesson.jsx'))
const ReactCrudPracticeLesson = L(() => import('./3-Modull/ReactCrudPracticeLesson.jsx'))
const ReactApiGetLesson = L(() => import('./3-Modull/ReactApiGetLesson.jsx'))
const ReactApiPostLesson = L(() => import('./3-Modull/ReactApiPostLesson.jsx'))
const PmLesson9 = L(() => import('./3-Modull/PmLesson9.jsx'))
const ReactRouterPracticeLesson = L(() => import('./3-Modull/ReactRouterPracticeLesson.jsx'))
const ReactProjectDayLesson = L(() => import('./3-Modull/ReactProjectDayLesson.jsx'))
const ReactBuildSiteLesson = L(() => import('./3-Modull/ReactBuildSiteLesson.jsx'))
const PmLesson10 = L(() => import('./3-Modull/PmLesson10.jsx'))

// ---- 4-Modul
const DataIntroLesson = L(() => import('./4-Modull/DataIntroLesson.jsx'))
const PmLesson11 = L(() => import('./4-Modull/PmLesson11.jsx'))
const DbSqlNosqlLesson = L(() => import('./4-Modull/DbSqlNosqlLesson.jsx'))
const NodeServerLesson = L(() => import('./4-Modull/NodeServerLesson.jsx'))
const RoutingLesson = L(() => import('./4-Modull/RoutingLesson.jsx'))
const PostgresCrudLesson = L(() => import('./4-Modull/PostgresCrudLesson.jsx'))
const PmLesson12 = L(() => import('./4-Modull/PmLesson12.jsx'))
const BackendCrudPracticeLesson = L(() => import('./4-Modull/BackendCrudPracticeLesson.jsx'))
const ApiPostmanLesson = L(() => import('./4-Modull/ApiPostmanLesson.jsx'))
const FullstackConnectPracticeLesson = L(() => import('./4-Modull/FullstackConnectPracticeLesson.jsx'))
const AuthEnvLesson = L(() => import('./4-Modull/AuthEnvLesson.jsx'))
const PmLesson13 = L(() => import('./4-Modull/PmLesson13.jsx'))
const FullstackProjectDayLesson = L(() => import('./4-Modull/FullstackProjectDayLesson.jsx'))
const FullstackFeedbackLesson = L(() => import('./4-Modull/FullstackFeedbackLesson.jsx'))
const PmLesson14 = L(() => import('./4-Modull/PmLesson14.jsx'))

// ---- 4a-Modul
const NestArchAliveLesson = L(() => import('./4a-Modull/NestArchAliveLesson.jsx'))
const PmLesson15 = L(() => import('./4a-Modull/PmLesson15.jsx'))
const NestArchResourceLesson = L(() => import('./4a-Modull/NestArchResourceLesson.jsx'))
const NestArchPracticeLesson = L(() => import('./4a-Modull/NestArchPracticeLesson.jsx'))

// ---- 4b-Modul
const JestUnitTestLesson = L(() => import('./4b-Modull/JestUnitTestLesson.jsx'))
const PmLesson16 = L(() => import('./4b-Modull/PmLesson16.jsx'))
const EdgeCasesTestLesson = L(() => import('./4b-Modull/EdgeCasesTestLesson.jsx'))

// ---- 4c-Modul
const CiCdIntroLesson = L(() => import('./4c-Modull/CiCdIntroLesson.jsx'))
const PmLesson17 = L(() => import('./4c-Modull/PmLesson17.jsx'))
const GithubActionsLesson = L(() => import('./4c-Modull/GithubActionsLesson.jsx'))
const FullPipelineProjectLesson = L(() => import('./4c-Modull/FullPipelineProjectLesson.jsx'))
const AiPipelineProjectLesson = L(() => import('./4c-Modull/AiPipelineProjectLesson.jsx'))
const PmLesson18 = L(() => import('./4c-Modull/PmLesson18.jsx'))
const FullProPipelineLesson = L(() => import('./4c-Modull/FullProPipelineLesson.jsx'))

// ---- 5-Modul
const BotIntroLesson = L(() => import('./5-Modull/BotIntroLesson.jsx'))
const PmLesson19 = L(() => import('./5-Modull/PmLesson19.jsx'))
const BotApiButtonsLesson = L(() => import('./5-Modull/BotApiButtonsLesson.jsx'))
const BotStatefulMemoryLesson = L(() => import('./5-Modull/BotStatefulMemoryLesson.jsx'))
const BotAiProjectLesson = L(() => import('./5-Modull/BotAiProjectLesson.jsx'))
const BotAiBrainLesson = L(() => import('./5-Modull/BotAiBrainLesson.jsx'))
const BotFullProjectLesson = L(() => import('./5-Modull/BotFullProjectLesson.jsx'))
const PmLesson20 = L(() => import('./5-Modull/PmLesson20.jsx'))
const BotFeedbackIterationLesson = L(() => import('./5-Modull/BotFeedbackIterationLesson.jsx'))
const BotAiAgentLesson = L(() => import('./5-Modull/BotAiAgentLesson.jsx'))
const PmLesson21 = L(() => import('./5-Modull/PmLesson21.jsx'))

// ---- 6-Modul
const SystemArchitectureLesson = L(() => import('./6-Modull/SystemArchitectureLesson.jsx'))
const PmLesson22 = L(() => import('./6-Modull/PmLesson22.jsx'))
const ArchPatternsLesson = L(() => import('./6-Modull/ArchPatternsLesson.jsx'))
const AgentArchitectureLesson = L(() => import('./6-Modull/AgentArchitectureLesson.jsx'))
const ClaudeSkillsLesson = L(() => import('./6-Modull/ClaudeSkillsLesson.jsx'))
const PmLesson23 = L(() => import('./6-Modull/PmLesson23.jsx'))
const WriteSkillLesson = L(() => import('./6-Modull/WriteSkillLesson.jsx'))
const PipelineProjectLesson = L(() => import('./6-Modull/PipelineProjectLesson.jsx'))
const ReactNativeBasicsLesson = L(() => import('./6-Modull/ReactNativeBasicsLesson.jsx'))
const ReactNativeAppLesson = L(() => import('./6-Modull/ReactNativeAppLesson.jsx'))
const MobileAppPracticeLesson = L(() => import('./6-Modull/MobileAppPracticeLesson.jsx'))
const PmLesson24 = L(() => import('./6-Modull/PmLesson24.jsx'))
const FullSystemProjectLesson = L(() => import('./6-Modull/FullSystemProjectLesson.jsx'))
const PmLesson25 = L(() => import('./6-Modull/PmLesson25.jsx'))

// ---- 7-Modul — eski darslar (src/7-Modull) 05.10 da olib tashlandi: yangi 7-Modul konveyer bilan yangi rejada quriladi.
const PmProductProblemLesson = L(() => import('./7-Modull/PmProductProblemLesson.jsx')) // 9-Modul 1-dars (LMS), konveyer pilot
const MvpFirstScreenLesson = L(() => import('./7-Modull/MvpFirstScreenLesson.jsx')) // 9-Modul 7-dars (LMS), konveyer pilot
// 9-Modul 2-to'lqin (05.10): skeletdan, har biri o'z quruvchi agenti bilan
const PmFiveInterviewsLesson = L(() => import('./7-Modull/PmFiveInterviewsLesson.jsx')) // 9-Modul 2-dars
const PmInterviewMvpLesson = L(() => import('./7-Modull/PmInterviewMvpLesson.jsx')) // 9-Modul 3-dars
const MvpArchitectureLesson = L(() => import('./7-Modull/MvpArchitectureLesson.jsx')) // 9-Modul 4-dars
const AnimationLesson = L(() => import('./7-Modull/AnimationLesson.jsx')) // 9-Modul 5-dars
const PmAnalyticsDayOneLesson = L(() => import('./7-Modull/PmAnalyticsDayOneLesson.jsx')) // 9-Modul 6-dars
const PmDesignMotionLesson = L(() => import('./7-Modull/PmDesignMotionLesson.jsx')) // 9-Modul 8-dars
const MvpCompleteLesson = L(() => import('./7-Modull/MvpCompleteLesson.jsx')) // 9-Modul 9-dars
const PmUsabilityTestLesson = L(() => import('./7-Modull/PmUsabilityTestLesson.jsx')) // 9-Modul 10-dars
const MvpIterationLesson = L(() => import('./7-Modull/MvpIterationLesson.jsx')) // 9-Modul 11-dars
const PmUserStoryPitchLesson = L(() => import('./7-Modull/PmUserStoryPitchLesson.jsx')) // 9-Modul 12-dars
// ---- 8-Modul (LMS 10-Modul, src/8-Modull) — konveyer pilot, 05.10
const EventTrackingLesson = L(() => import('./8-Modull/EventTrackingLesson.jsx')) // 10-Modul 2-dars, pilot
const PmYearPathLesson = L(() => import('./8-Modull/PmYearPathLesson.jsx')) // 10-Modul 10-dars, pilot
const PmOkrLesson = L(() => import('./8-Modull/PmOkrLesson.jsx')) // 10-Modul 1-dars, 2-to'lqin
const LiveDashboardLesson = L(() => import('./8-Modull/LiveDashboardLesson.jsx')) // 10-Modul 3-dars, 2-to'lqin
const PmAbTestLesson = L(() => import('./8-Modull/PmAbTestLesson.jsx')) // 10-Modul 4-dars, 2-to'lqin
const SecurityBasicsLesson = L(() => import('./8-Modull/SecurityBasicsLesson.jsx')) // 10-Modul 5-dars, 2-to'lqin
const PmTrustAuditLesson = L(() => import('./8-Modull/PmTrustAuditLesson.jsx')) // 10-Modul 6-dars, 2-to'lqin
const ProductionDeployLesson = L(() => import('./8-Modull/ProductionDeployLesson.jsx')) // 10-Modul 7-dars, 2-to'lqin
const ProdUpgradeLesson = L(() => import('./8-Modull/ProdUpgradeLesson.jsx')) // 10-Modul 8-dars, 2-to'lqin
const ProdReviewLesson = L(() => import('./8-Modull/ProdReviewLesson.jsx')) // 10-Modul 9-dars, 2-to'lqin
const PmPitchRehearsalLesson = L(() => import('./8-Modull/PmPitchRehearsalLesson.jsx')) // 10-Modul 11-dars, 2-to'lqin
// ---- 9-Modul (LMS 11-Modul, src/9-Modull) — konveyer, 06.10: darslar «qur» bosqichida shu yerga ulanadi
const PmTenIdeasLesson = L(() => import('./9-Modull/PmTenIdeasLesson.jsx')) // 11-Modul 1-dars, pilot
const FoundationDayLesson = L(() => import('./9-Modull/FoundationDayLesson.jsx')) // 11-Modul 10-dars, pilot
// 11-Modul 2-to'lqin (06.10): skeletdan, har biri o'z quruvchi agenti bilan
const PmIdeaRiceLesson = L(() => import('./9-Modull/PmIdeaRiceLesson.jsx')) // 11-Modul 2-dars
const PmInterviewsOneLesson = L(() => import('./9-Modull/PmInterviewsOneLesson.jsx')) // 11-Modul 3-dars
const PmFinalIdeaLesson = L(() => import('./9-Modull/PmFinalIdeaLesson.jsx')) // 11-Modul 4-dars
const PmPrdLesson = L(() => import('./9-Modull/PmPrdLesson.jsx')) // 11-Modul 5-dars
const PmRoadmapLesson = L(() => import('./9-Modull/PmRoadmapLesson.jsx')) // 11-Modul 6-dars
const LivePrototypeLesson = L(() => import('./9-Modull/LivePrototypeLesson.jsx')) // 11-Modul 7-dars
const PlatformChoiceLesson = L(() => import('./9-Modull/PlatformChoiceLesson.jsx')) // 11-Modul 8-dars
const ExpoPrototypeLesson = L(() => import('./9-Modull/ExpoPrototypeLesson.jsx')) // 11-Modul 9-dars
const FeatureOneLesson = L(() => import('./9-Modull/FeatureOneLesson.jsx')) // 11-Modul 11-dars
const FeatureTwoLesson = L(() => import('./9-Modull/FeatureTwoLesson.jsx')) // 11-Modul 12-dars
const PmAudienceTestLesson = L(() => import('./9-Modull/PmAudienceTestLesson.jsx')) // 11-Modul 13-dars
const FeatureThreeLesson = L(() => import('./9-Modull/FeatureThreeLesson.jsx')) // 11-Modul 14-dars
const PmOneOnOneLesson = L(() => import('./9-Modull/PmOneOnOneLesson.jsx')) // 11-Modul 15-dars
const PmPrototypePitchLesson = L(() => import('./9-Modull/PmPrototypePitchLesson.jsx')) // 11-Modul 16-dars
// ---- 10-Modul (LMS 12-Modul, src/10-Modull) — konveyer, 06.10: darslar «qur» bosqichida shu yerga ulanadi
const PmLandingLesson = L(() => import('./10-Modull/PmLandingLesson.jsx')) // 12-Modul 1-dars, pilot
const WebSocketBasicsLesson = L(() => import('./10-Modull/WebSocketBasicsLesson.jsx')) // 12-Modul 2-dars, pilot
const PmRealtimeSpecLesson = L(() => import('./10-Modull/PmRealtimeSpecLesson.jsx')) // 12-Modul 3-dars, 2-to'lqin
const LiveNotifyDayLesson = L(() => import('./10-Modull/LiveNotifyDayLesson.jsx')) // 12-Modul 4-dars, 2-to'lqin
const BreakAndFixLesson = L(() => import('./10-Modull/BreakAndFixLesson.jsx')) // 12-Modul 5-dars, 2-to'lqin
const PmChannelsLesson = L(() => import('./10-Modull/PmChannelsLesson.jsx')) // 12-Modul 6-dars, 2-to'lqin
const PmFiftyUsersLesson = L(() => import('./10-Modull/PmFiftyUsersLesson.jsx')) // 12-Modul 7-dars, 2-to'lqin
const PmDropOffLesson = L(() => import('./10-Modull/PmDropOffLesson.jsx')) // 12-Modul 8-dars, 2-to'lqin
const RetentionDayLesson = L(() => import('./10-Modull/RetentionDayLesson.jsx')) // 12-Modul 9-dars, 2-to'lqin
const PmUsersCheckLesson = L(() => import('./10-Modull/PmUsersCheckLesson.jsx')) // 12-Modul 10-dars, 2-to'lqin
const PmPitchReviewLesson = L(() => import('./10-Modull/PmPitchReviewLesson.jsx')) // 12-Modul 11-dars, 2-to'lqin
const PmGrowthPitchLesson = L(() => import('./10-Modull/PmGrowthPitchLesson.jsx')) // 12-Modul 12-dars, 2-to'lqin
// ---- 11-Modul (LMS 13-Modul, src/11-Modull) — konveyer, 07.10: darslar «qur» bosqichida shu yerga ulanadi
// Modul ro'yxatidagi sarlavhalar — vaqtincha reja (comp yo'q, «tez orada» bo'lib ko'rinadi).
const PaymentWebhookLesson = L(() => import('./11-Modull/PaymentWebhookLesson.jsx')) // 13-Modul 3-dars, 1-to'lqin pilot (08.10)
const PmMoneyTalkLesson = L(() => import('./11-Modull/PmMoneyTalkLesson.jsx')) // 13-Modul 6-dars, 1-to'lqin pilot (08.10)
const PmUnitEconomicsLesson = L(() => import('./11-Modull/PmUnitEconomicsLesson.jsx')) // 13-Modul 1-dars, 2-to'lqin (08.10)
const PmMonetizationLesson = L(() => import('./11-Modull/PmMonetizationLesson.jsx')) // 13-Modul 2-dars, 2-to'lqin (08.10)
const PmPricingLesson = L(() => import('./11-Modull/PmPricingLesson.jsx')) // 13-Modul 4-dars, 2-to'lqin (08.10)
const PaymentDayLesson = L(() => import('./11-Modull/PaymentDayLesson.jsx')) // 13-Modul 5-dars, 2-to'lqin (08.10)
const PmTermsLesson = L(() => import('./11-Modull/PmTermsLesson.jsx')) // 13-Modul 7-dars, 2-to'lqin (08.10)
const WinBackDayLesson = L(() => import('./11-Modull/WinBackDayLesson.jsx')) // 13-Modul 8-dars, 2-to'lqin (08.10)
const PmPayCheckLesson = L(() => import('./11-Modull/PmPayCheckLesson.jsx')) // 13-Modul 9-dars, 2-to'lqin (08.10)
const ReferralDayLesson = L(() => import('./11-Modull/ReferralDayLesson.jsx')) // 13-Modul 10-dars, 2-to'lqin (08.10)
const PmReflectionLesson = L(() => import('./11-Modull/PmReflectionLesson.jsx')) // 13-Modul 11-dars, 2-to'lqin (08.10)
const StabilizeDayLesson = L(() => import('./11-Modull/StabilizeDayLesson.jsx')) // 13-Modul 12-dars, 2-to'lqin (08.10)
// ---- 12-Modul (LMS 14-Modul, src/12-Modull) — konveyer, 08.10 (tungi avtopilot, F-1008-553): darslar «qur» bosqichida shu yerga ulanadi
const PmInvestorPitchLesson = L(() => import('./12-Modull/PmInvestorPitchLesson.jsx')) // 14-Modul 1-dars, 1-to'lqin pilot (08.10, F-1008-572)
const ProductSpeedLesson = L(() => import('./12-Modull/ProductSpeedLesson.jsx')) // 14-Modul 3-dars, 1-to'lqin pilot (08.10, F-1008-572)
const PmStoryPitchLesson = L(() => import('./12-Modull/PmStoryPitchLesson.jsx')) // 14-Modul 2-dars, 2-to'lqin (08.10)
const PolishDayLesson = L(() => import('./12-Modull/PolishDayLesson.jsx')) // 14-Modul 4-dars, 2-to'lqin (08.10)
const PmPitchTrainingLesson = L(() => import('./12-Modull/PmPitchTrainingLesson.jsx')) // 14-Modul 5-dars, 2-to'lqin (08.10)
const DemoPrepLesson = L(() => import('./12-Modull/DemoPrepLesson.jsx')) // 14-Modul 6-dars, 2-to'lqin (08.10)
const PmDemoTestLesson = L(() => import('./12-Modull/PmDemoTestLesson.jsx')) // 14-Modul 7-dars, 2-to'lqin (08.10)
const PmFinalPitchLesson = L(() => import('./12-Modull/PmFinalPitchLesson.jsx')) // 14-Modul 8-dars, 2-to'lqin (08.10)
const VideoPortfolioLesson = L(() => import('./12-Modull/VideoPortfolioLesson.jsx')) // 14-Modul 9-dars, 2-to'lqin (08.10)
const PmFreelanceLesson = L(() => import('./12-Modull/PmFreelanceLesson.jsx')) // 14-Modul 10-dars, 2-to'lqin (08.10)
const PmProgramsLesson = L(() => import('./12-Modull/PmProgramsLesson.jsx')) // 14-Modul 11-dars, 2-to'lqin (08.10)
const PmNextStepsLesson = L(() => import('./12-Modull/PmNextStepsLesson.jsx')) // 14-Modul 12-dars, 2-to'lqin (08.10)
const PmDressRehearsalLesson = L(() => import('./12-Modull/PmDressRehearsalLesson.jsx')) // 14-Modul 13-dars, 2-to'lqin (08.10)
const PmJtbdLesson = L(() => import('./pm/PmJtbdLesson.jsx')) // PM pipeline P1 (eski PmLesson27 o'rnida)
const PmMetricsLesson = L(() => import('./pm/PmMetricsLesson.jsx')) // PM pipeline P1 (M8-D1)
// PmLesson27 — o'lik import olib tashlandi (2026-08-13): m7-02 ni PmJtbdLesson egallagan,
// fayl arxiv/olik-darslar/ ga ko'chirildi. Qayta ulanmaydi.
// PmLesson28 (m7-03) — F-0928-06: mavzu v9 bo'yicha 2-Modulga ko'chdi (yangi PmMuammoIzlash); eski fayl arxivda

// ============================================================================
// DASTUR — PDF tartibida. n = PDF'dagi dars raqami.
// type: Kod | PM | Proyekt | Demo | Rezerv   (Demo/Rezerv — dars fayli yo'q, kulrang qator)
// ============================================================================
const MODULES = [
  {
    id: '2', slug: 'm1', title: 'Men internetdaman', period: 'oy 1–1.5', stage: 1,
    idea: 'Portfolio — birinchi mahsulot. Har qadamda: "Bu kim uchun? Nega bor?"',
    lessons: [
      { key: 'm1-01', n: 1,  type: 'Kod',     emoji: '🌐', title: 'Internet qanday ishlaydi',        sub: 'brauzer, server, domen, DNS — so\'rov yo\'li', comp: InternetLesson },
      { key: 'm1-02', n: 2,  type: 'PM',      emoji: '🎯', title: 'Kim mening foydalanuvchim?',      sub: 'auditoriya va saytning maqsadi', comp: PmLesson1 },
      { key: 'm1-03', n: 3,  type: 'Kod',     emoji: '📄', title: 'HTML asoslari',                sub: 'teg, sarlavha, ro\'yxat, havola', comp: Htmllesson1 },
      { key: 'm1-04', n: 4,  type: 'Kod',     emoji: '🖼️', title: 'HTML: rasm, struktura, forma, DevTools',                sub: 'rasm, forma, struktura, DevTools', comp: Htmllesson2 },
      { key: 'm1-14', n: 5,  type: 'Kod',     emoji: '🛠️', title: 'Takrorlash: HTML ustaxonasi',     sub: 'birinchi mijozlar — 5 buyurtma, debug, imtihon', comp: HtmlTakrorlashLesson },
      { key: 'm1-05', n: 6,  type: 'PM',      emoji: '🗺️', title: 'Struktura — foydalanuvchi uchun qilingan qulaylik',     sub: 'bo\'limlar tartibi kimga qarab tuziladi', comp: PmLesson2 },
      { key: 'm1-06', n: 7,  type: 'Kod',     emoji: '🎨', title: 'CSS asoslari: ranglar, shriftlar, bo\'shliqlar',                 sub: 'rang, shrift, bo\'shliqlar', comp: CssLesson1 },
      { key: 'm1-07', n: 8,  type: 'Kod',     emoji: '📐', title: 'CSS: layout, flexbox, DevTools',                 sub: 'layout, flexbox, DevTools', comp: CssLesson2 },
      { key: 'm1-08', n: 9,  type: 'Proyekt', emoji: '🧱', title: 'HTML Praktika — Portfolio sayt', sub: 'saytni bo\'laklaymiz, HTML shablon', comp: HtmlPractice },
      { key: 'm1-15', n: 10, type: 'Kod',     emoji: '💻', title: 'VS Code',    sub: 'o\'rnatish, Emmet, Live Server, jonli card', comp: VsCodeLesson },
      { key: 'm1-10', n: 11, type: 'Proyekt', emoji: '💅', title: 'CSS Praktika — Portfolioni bezaymiz',   sub: 'CSS + kontent + AI bilan tugma', comp: CssPractice },
      { key: 'm1-09', n: 12, type: 'Kod',     emoji: '🔀', title: 'Git va GitHub — kodni internetga chiqaramiz',                   sub: 'commit, push — kod uchun vaqt mashinasi', comp: GitLesson },
      { key: 'm1-11', n: 13, type: 'Kod',     emoji: '🚀', title: 'Netlify va deploy',               sub: 'hosting, maktab poddomeni', comp: DeployLesson },
      { key: 'm1-12', n: 14, type: 'PM',      emoji: '🎤', title: 'Demo Day — 3 daqiqalik nutq', sub: 'Ota-onangiz oldida saytingizni ko\'rsatasiz: ilgak, muammo, jonli demo va keyingi qadam', comp: PmLesson3 },
      { key: 'm1-13', n: 15, type: 'Demo',    emoji: '🎤', title: 'Demo Day 1',                      sub: 'ota-onalar oldida ochiq himoya' },
    ],
  },
  {
    id: '3', slug: 'm2', title: 'Sistemalar qanday o\'ylaydi', period: 'oy 1.5–3', stage: 1,
    idea: 'Koddagi dekompozitsiya = PM\'dagi dekompozitsiya. Bitta mahorat — ikki til.',
    lessons: [
      { key: 'm2-01', n: 1,  type: 'Kod',     emoji: '🧠', title: 'Sistema va Algoritm',          sub: 'komponent, bog\'lanish, ketma-ketlik', comp: JsIntroLesson },
      { key: 'm2-02', n: 2,  type: 'PM',      emoji: '💊', title: 'Muammodan yechimga',               sub: 'har bir feature — qaysi og\'riqqa dori?', comp: PmLesson4 },
      { key: 'm2-16', n: 3,  type: 'PM',      emoji: '🔎', title: 'Muammoni qanday topamiz',      sub: 'kuzatuv, sharhlar va muammo-reytingi', comp: PmMuammoIzlash }, // F-0928-06
      { key: 'm2-03', n: 4,  type: 'Kod',     emoji: '📦', title: 'JavaScript — O\'zgaruvchilar',          sub: 'let / const / var, ma\'lumot turlari', comp: JsVarsLesson },
      { key: 'm2-04', n: 5,  type: 'Kod',     emoji: '🔀', title: 'JavaScript — if/else',                sub: 'shart, taqqoslash operatorlari', comp: JsConditionsLesson },
      { key: 'm2-05', n: 6,  type: 'Kod',     emoji: '🔁', title: 'JavaScript — Sikllar (for, while)',                  sub: 'for, while, massivni aylanish', comp: JsLoopsLesson },
      { key: 'm2-06', n: 7,  type: 'Kod',     emoji: '🧩', title: 'JavaScript — Funksiya, parametr, return', sub: 'parametr, return, xotira (Stack/Heap)', comp: JsFunctionsLesson },
      { key: 'm2-07', n: 8,  type: 'PM',      emoji: '🪜', title: 'Dekompozitsiya — ochilish ro\'yxati',    sub: 'katta rejani bo\'laklab, MVP va backlog qilish', comp: PmLesson5 },
      { key: 'm2-08', n: 9,  type: 'Proyekt', emoji: '⚡', title: 'Praktika 1 — Saytni jonlantiramiz',       sub: 'HTML/CSS saytga interaktivlik', comp: PracticeLesson1 },
      { key: 'm2-09', n: 10, type: 'Proyekt', emoji: '🤖', title: 'Praktika 2 — AI bilan tez sayt', sub: 'prompt orqali sifatli loyiha', comp: PracticeLesson2 },
      { key: 'm2-10', n: 11, type: 'Kod',     emoji: '🍽️', title: 'PERN Stack — 4 texnologiya, bitta jamoa', sub: 'PostgreSQL + Express + React + Node', comp: PeanStackLesson },
      { key: 'm2-11', n: 12, type: 'Proyekt', emoji: '🛠️', title: 'Praktika 3 — Dekompozitsiya (mini-do\'kon)', sub: 'AI\'ni ochishdan oldin bo\'laklaymiz', comp: PracticeLesson3 },
      { key: 'm2-12', n: 13, type: 'Proyekt', emoji: '🚀', title: 'Praktika 4 — MVP tayyor (deploy)', sub: 'feature\'larni yakunlash, deploy', comp: PracticeLesson4 },
      { key: 'm2-13', n: 14, type: 'PM',      emoji: '🎤', title: 'Sistemani qanday pitch qilish',  sub: 'arxitekturani texnik bo\'lmagan odamga', comp: PmLesson6 },
      { key: 'm2-14', n: 15, type: 'Rezerv',  emoji: '📅', title: 'Zaxira dars',                    sub: 'yetib olish / sayqallash' },
      { key: 'm2-15', n: 16, type: 'Demo',    emoji: '🎤', title: 'Demo Day',                       sub: 'guruh oldida ichki himoya' },
    ],
  },
  {
    id: '4', slug: 'm3', title: 'Frontend — React', period: 'oy 3–4.5', stage: 1,
    idea: 'Komponent = feature. User Story koddan OLDIN yoziladi.',
    lessons: [
      { key: 'm3-01', n: 1,  type: 'Kod',     emoji: '⚛️', title: 'React nima va nima uchun?',      sub: 'komponent, Virtual DOM, React Native', comp: ReactIntroLesson },
      { key: 'm3-02', n: 2,  type: 'PM',      emoji: '📝', title: 'User Story: kim va nima uchun?', sub: '"Men [kim] sifatida..." — JTBD', comp: PmUserStoryLesson },
      { key: 'm3-17', n: 3,  type: 'PM',      emoji: '🌈', title: 'Bitta natija, uch xil sabab',    sub: 'funksional, ijtimoiy, emotsional vazifa (JTBD)', comp: PmJtbdLesson }, // F-0928-06: v9 4-Modul #3 (M7 dan ko'chdi)
      { key: 'm3-03', n: 4,  type: 'Kod',     emoji: '🧱', title: 'Birinchi komponent: Vite, JSX, props',             sub: 'Vite, JSX, props, loyiha strukturasi', comp: ReactFirstComponentLesson },
      { key: 'm3-04', n: 5,  type: 'Kod',     emoji: '💗', title: 'State va Effect: useState + useEffect',                sub: 'useState + useEffect, lifecycle', comp: ReactStateEffectLesson },
      { key: 'm3-05', n: 6,  type: 'PM',      emoji: '⚖️', title: 'Qaysi ishni birinchi qilasiz?', sub: 'Nechta odam so\'raydi va qancha vaqt oladi', comp: PmLesson8 },
      { key: 'm3-06', n: 7,  type: 'Kod',     emoji: '🏭', title: 'Props va qayta ishlatish',       sub: 'ma\'lumotni komponentlar orasida uzatish', comp: ReactPropsReuseLesson },
      { key: 'm3-07', n: 8,  type: 'Proyekt', emoji: '🐠', title: 'Praktika: CRUD — to\'liq boshqariladigan ilova', sub: 'Create / Read / Update / Delete', comp: ReactCrudPracticeLesson },
      { key: 'm3-08', n: 9,  type: 'Kod',     emoji: '🛎️', title: 'API bilan ishlash: GET — serverdan ma\'lumot olish',        sub: 'fetch / axios, JSON, loading', comp: ReactApiGetLesson },
      { key: 'm3-09', n: 10, type: 'Kod',     emoji: '📦', title: 'API: POST/PUT/DELETE — serverga ma\'lumot yuborish',      sub: 'serverga ma\'lumot yuborish', comp: ReactApiPostLesson },
      { key: 'm3-10', n: 11, type: 'PM',      emoji: '✅', title: 'Qachon «tayyor» deb ayta olamiz?', sub: 'ishni qabul qilish shartlari', comp: PmLesson9 },
      { key: 'm3-11', n: 12, type: 'Proyekt', emoji: '🌀', title: 'Praktika: React Router — ko\'p sahifali ilova',         sub: 'ko\'p sahifali ilova, navigatsiya', comp: ReactRouterPracticeLesson },
      { key: 'm3-12', n: 13, type: 'Proyekt', emoji: '🚗', title: 'Praktika: Loyiha kuni — AvtoIjara',        sub: 'React + API + CRUD + routing', comp: ReactProjectDayLesson },
      { key: 'm3-13', n: 14, type: 'Proyekt', emoji: '🏗️', title: 'Praktika: Istalgan saytni qurish — bo\'laklash + aniq prompt', sub: 'komponent sxemasi + ishlaydigan loyiha', comp: ReactBuildSiteLesson },
      { key: 'm3-14', n: 15, type: 'PM',      emoji: '🎤', title: 'Ishlayotgan saytingizni qanday ko\'rsatasiz?', sub: 'uch kadrlik ko\'rsatuv', comp: PmLesson10 },
      { key: 'm3-15', n: 16, type: 'Rezerv',  emoji: '📅', title: 'Zaxira dars',                    sub: 'yetib olish / sayqallash' },
      { key: 'm3-16', n: 17, type: 'Demo',    emoji: '🎤', title: 'Demo Day',                       sub: 'guruh + mehmonlar oldida himoya' },
    ],
  },
  {
    id: '5', slug: 'm4', title: 'Ma\'lumot va bog\'lanishlar', period: 'oy 4.5–6', stage: 1,
    sub: 'Node.js + PostgreSQL',
    idea: 'Ma\'lumot sxemasi — mahsulot qarori. Ma\'lumot tasodifan emas, vazifa uchun yig\'iladi.',
    lessons: [
      { key: 'm4-01', n: 1,  type: 'Kod',     emoji: '🔌', title: 'Ma\'lumot va bog\'lanishlar: JSON, jadval, sxema',                sub: 'JSON, jadval, bog\'lanish, PK/FK', comp: DataIntroLesson },
      { key: 'm4-02', n: 2,  type: 'PM',      emoji: '📊', title: 'Ilova nimani eslab qolsin?',   sub: 'nimani saqlaymiz va nega — bo\'lim shundan quriladi', comp: PmLesson11 },
      { key: 'm4-03', n: 3,  type: 'Kod',     emoji: '📦', title: 'SQL vs NoSQL — nega PostgreSQL',     sub: 'qachon qaysi biri kerak', comp: DbSqlNosqlLesson },
      { key: 'm4-04', n: 4,  type: 'Kod',     emoji: '🏪', title: 'Node.js — birinchi serveringiz',     sub: 'npm, Express, birinchi endpoint', comp: NodeServerLesson },
      { key: 'm4-05', n: 5,  type: 'Kod',     emoji: '📮', title: 'Routing: server so\'rovni qanday topadi',      sub: 'method + path, 404, /:id', comp: RoutingLesson },
      { key: 'm4-06', n: 6,  type: 'Kod',     emoji: '🐘', title: 'PostgreSQL so\'rovlar — CRUD + AI bilan',        sub: 'SELECT, INSERT, UPDATE, DELETE', comp: PostgresCrudLesson },
      { key: 'm4-07', n: 7,  type: 'PM',      emoji: '🔐', title: 'Sinfdoshingiz sahifangizni ochsa, nimani ko\'radi?', sub: 'nima ochiq, nima yopiq — ishonch mahsulot qiymati', comp: PmLesson12 },
      { key: 'm4-08', n: 8,  type: 'Proyekt', emoji: '🚗', title: 'Praktika: Backend CRUD — AvtoIjara',        sub: 'AvtoIjara — Express + PostgreSQL', comp: BackendCrudPracticeLesson },
      { key: 'm4-09', n: 9,  type: 'Kod',     emoji: '📡', title: 'API va Postman — front backend bilan qanday gaplashadi',            sub: 'so\'rov va javob, status kodlari', comp: ApiPostmanLesson },
      { key: 'm4-10', n: 10, type: 'Proyekt', emoji: '🌉', title: 'Praktika: Fullstack ulash — AvtoIjara',  sub: 'fetch, CORS — front ↔ back', comp: FullstackConnectPracticeLesson },
      { key: 'm4-11', n: 11, type: 'Kod',     emoji: '🔑', title: 'Autentifikatsiya va .env — login, JWT, maxfiy kalitlar',      sub: 'JWT token, login, himoyalangan route', comp: AuthEnvLesson },
      { key: 'm4-12', n: 12, type: 'PM',      emoji: '🗂️', title: 'Ilova nimani yozib qoladi?',      sub: 'e\'londan sxemagacha — uch ustun', comp: PmLesson13 },
      { key: 'm4-13', n: 13, type: 'Proyekt', emoji: '🅿️', title: 'Praktika: Loyiha kuni — AvtoStoyanka',         sub: 'AvtoStoyanka — baza + server + panel', comp: FullstackProjectDayLesson },
      { key: 'm4-14', n: 14, type: 'Proyekt', emoji: '💬', title: 'Praktika: Feedback bilan yaxshilash — AvtoStoyanka',     sub: 'sinfdoshlar fikridan 3 muammo topib tuzatildi', comp: FullstackFeedbackLesson },
      { key: 'm4-15', n: 15, type: 'PM',      emoji: '🎤', title: '«Qanday ishlaydi?» deb so\'rashsa', sub: 'uch qavat — uch oddiy gap', comp: PmLesson14 },
      { key: 'm4-16', n: 16, type: 'Rezerv',  emoji: '📅', title: 'Zaxira dars',                   sub: 'yetib olish / sayqallash' },
      { key: 'm4-17', n: 17, type: 'Demo',    emoji: '🎤', title: 'Demo Day',                      sub: 'jonli fullstack demo' },
    ],
  },
  {
    id: '6', slug: 'm4a', title: 'NestJS + Test + CI/CD', period: 'oy 6–9.5', stage: 1,
    idea: 'To\'g\'ri arxitektura = yangi feature\'ni tez yetkazish. Har bir tutilmagan bug — yo\'qotilgan foydalanuvchi. Delivery tezligi = gipotezani tekshirish tezligi.',
    lessons: [
      { key: 'm4a-01', n: 1, type: 'Kod',     emoji: '🪺', title: 'Nest arxitektura — tirik ko\'rish',        sub: 'MVC, module, controller, service', comp: NestArchAliveLesson },
      { key: 'm4a-02', n: 2, type: 'PM',      emoji: '📈', title: 'Hamma birdan kirsa, sayt chidaydimi?', sub: 'yuk — birdan kelgan og\'irlik', comp: PmLesson15 },
      { key: 'm4a-03', n: 3, type: 'Kod',     emoji: '📋', title: 'Birinchi resursni qo\'lda qo\'shish — mashinalar', sub: 'Entity, DTO, Repository — CRUD', comp: NestArchResourceLesson },
      { key: 'm4a-04', n: 4, type: 'Proyekt', emoji: '📚', title: 'Praktika — KitobShop backend',        sub: 'KitobShop — o\'z controller + service', comp: NestArchPracticeLesson },
      { key: 'm4b-01', n: 5, type: 'Kod', emoji: '🧪', title: 'Unit-test: Jest',            sub: 'describe / it / expect — birinchi test', comp: JestUnitTestLesson },
      { key: 'm4b-02', n: 6, type: 'PM',  emoji: '🛡️', title: 'Bitta xato — nechta odam ketadi?', sub: 'nosozlik qayerda tutilsa — shuncha arzon', comp: PmLesson16 },
      { key: 'm4b-03', n: 7, type: 'Kod', emoji: '🌶️', title: 'Edge cases va error path',    sub: 'happy path vs xato, toThrow', comp: EdgeCasesTestLesson },
      { key: 'm4c-01', n: 8, type: 'Kod',     emoji: '🛫', title: 'CI/CD nima va nega kerak',   sub: 'Continuous Integration / Deployment', comp: CiCdIntroLesson },
      { key: 'm4c-02', n: 9, type: 'PM',      emoji: '⚡', title: 'Hammasini birdan chiqaraymi — yoki har hafta bo\'lak?', sub: 'kim tez-tez chiqarsa, o\'sha oldin biladi', comp: PmLesson17 },
      { key: 'm4c-03', n: 10, type: 'Kod',     emoji: '🗺️', title: 'GitHub Actions — yo\'l xaritasini yozish',   sub: 'avtomatik ish oqimi: qadamlar va sozlash fayli', comp: GithubActionsLesson },
      { key: 'm4c-04', n: 11, type: 'Proyekt', emoji: '🧳', title: 'Loyiha kuni — to\'liq lentani qurish', sub: 'backend + frontend — real loyiha', comp: FullPipelineProjectLesson },
      { key: 'm4c-05', n: 12, type: 'Proyekt', emoji: '🧑‍🔧', title: 'AI bilan lentani boshqarish', sub: 'AI bilan lentani boshqarish', comp: AiPipelineProjectLesson },
      { key: 'm4c-06', n: 13, type: 'PM',      emoji: '📟', title: 'Saytingiz hozir ochilyaptimi?', sub: 'chiqqandan keyin saytni kim o\'lchaydi', comp: PmLesson18 },
      { key: 'm4c-07', n: 14, type: 'Proyekt', emoji: '⚙️', title: 'Loyiha kuni: ishonchli lenta', sub: 'test + lint + deploy + monitoring', comp: FullProPipelineLesson },
      { key: 'm4c-08', n: 15, type: 'Rezerv',  emoji: '📅', title: 'Zaxira dars',                sub: 'yetib olish / sayqallash' },
    ],
  },
  {
    id: '7', slug: 'm5', title: 'Botlar va avtomatlashtirish', period: 'oy 9.5–11', stage: 1,
    idea: 'Real odamlar bilan birinchi jonli mahsulot tajribasi. 20+ real foydalanuvchi.',
    lessons: [
      { key: 'm5-01', n: 1,  type: 'Kod',     emoji: '🤖', title: 'Bot nima',                    sub: 'hodisaga javob beradigan mantiq: signal keladi, bot amal qiladi', comp: BotIntroLesson },
      { key: 'm5-02', n: 2,  type: 'PM',      emoji: '🧲', title: 'Botingizni birinchi kim ochadi?', sub: 'yigirmata odam qayerdan keladi', comp: PmLesson19 },
      { key: 'm5-03', n: 3,  type: 'Kod',     emoji: '🎛️', title: 'Telegram Bot API + tugmalar', sub: 'BotFather, token, /start, inline', comp: BotApiButtonsLesson },
      { key: 'm5-04', n: 4,  type: 'Kod',     emoji: '🧠', title: 'Bot eslab qoladi — holat va PostgreSQL', sub: 'bot eslab qoladi, ma\'lumot saqlaydi', comp: BotStatefulMemoryLesson },
      { key: 'm5-05', n: 5,  type: 'Proyekt', emoji: '🪄', title: 'Loyiha kuni: AI bilan bot',   sub: 'promptlar bilan istalgan Telegram bot', comp: BotAiProjectLesson },
      { key: 'm5-06', n: 6,  type: 'Proyekt', emoji: '💡', title: 'Bot ichida AI',               sub: 'AI API\'ni ulash, xulq sozlash', comp: BotAiBrainLesson },
      { key: 'm5-07', n: 7,  type: 'Proyekt', emoji: '📦', title: 'Loyiha kuni: bot + DB + AI',  sub: 'to\'liq ishlaydigan bot + hosting', comp: BotFullProjectLesson },
      { key: 'm5-08', n: 8,  type: 'PM',      emoji: '🎙️', title: 'Botingizni ishlatgan odamdan nimani so\'raysiz?', sub: 'bo\'lib o\'tgan ishini so\'rash va eshitganini yozib olish', comp: PmLesson20 },
      { key: 'm5-09', n: 9,  type: 'Proyekt', emoji: '🔁', title: 'Foydalanuvchi fikri va iteratsiya',sub: 'foydalanuvchi nima dedi va nimani tuzatamiz', comp: BotFeedbackIterationLesson },
      { key: 'm5-10', n: 10, type: 'Proyekt', emoji: '🦾', title: 'AI-agent yaratish',           sub: 'idrok, qaror va amal sikli', comp: BotAiAgentLesson },
      { key: 'm5-14', n: 11, type: 'PM',      emoji: '⭐', title: 'Botingiz yaxshi ishlayotganini qaysi raqam aytadi?', sub: 'bitta bosh raqam va unga yordam beradigan uch raqam', comp: PmMetricsLesson }, // F-0928-06: v9 7-Modul #11 (M8 dan ko'chdi)
      { key: 'm5-11', n: 12, type: 'PM',      emoji: '📈', title: 'Kecha kelgan odam bugun ham keldimi?', sub: 'kelganlar va qaytganlar — ikki xil son', comp: PmLesson21 },
      { key: 'm5-12', n: 13, type: 'Rezerv',  emoji: '📅', title: 'Zaxira dars',                 sub: 'yetib olish / sayqallash' },
      { key: 'm5-13', n: 14, type: 'Demo',    emoji: '🎤', title: 'Demo Day',                    sub: 'jonli bot + 20 foydalanuvchi + metrika' },
    ],
  },
  {
    id: '8', slug: 'm6', title: 'Tizimni to\'liq yig\'aman', period: 'oy 11–12.5', stage: 1,
    idea: '1-bosqich yakuni: o\'quvchi mahsulotni QURA OLADI va TUSHUNTIRA OLADI.',
    lessons: [
      { key: 'm6-01', n: 1,  type: 'Kod',     emoji: '🧭', title: 'Komponentlardan tizim',      sub: 'front + back + baza + AI + bot', comp: SystemArchitectureLesson },
      { key: 'm6-02', n: 2,  type: 'PM',      emoji: '📄', title: 'Bitta gapni uch kishi bir xil tushunadimi?', sub: 'kod yozishdan oldin — bitta varaq, to\'rt katak', comp: PmLesson22 },
      { key: 'm6-03', n: 3,  type: 'Kod',     emoji: '🏛️', title: 'Arxitektura patternlari',    sub: 'MVC, mikroservis — sodda tilda', comp: ArchPatternsLesson },
      { key: 'm6-04', n: 4,  type: 'Kod',     emoji: '🦾', title: 'AI-agent nima',              sub: 'agent vs oddiy AI — qaror sikli', comp: AgentArchitectureLesson },
      { key: 'm6-05', n: 5,  type: 'Kod',     emoji: '✨', title: 'Claude Skills — nima',       sub: 'Skills AI xulqini qanday o\'zgartiradi', comp: ClaudeSkillsLesson },
      { key: 'm6-06', n: 6,  type: 'PM',      emoji: '⚖️', title: 'Ilova o\'zi qaror qilsa, kimga tegadi?', sub: 'chegara — mahsulot qarori', comp: PmLesson23 },
      { key: 'm6-07', n: 7,  type: 'Kod',     emoji: '🛠️', title: 'O\'z Skill\'ingizni yozing', sub: 'tuzilish, sinov, kontekst-injiniring', comp: WriteSkillLesson },
      { key: 'm6-08', n: 8,  type: 'Proyekt', emoji: '🔗', title: 'Loyiha kuni: to\'liq pipeline', sub: 'React + Node + PG + Telegram + AI', comp: PipelineProjectLesson },
      { key: 'm6-09', n: 9,  type: 'Kod',     emoji: '📱', title: 'React Native — asoslari',     sub: 'RN nima, Expo setup', comp: ReactNativeBasicsLesson },
      { key: 'm6-10', n: 10, type: 'Kod',     emoji: '🧳', title: 'RN: komponent, navigatsiya, API', sub: 'FlatList, Stack Navigator, fetch', comp: ReactNativeAppLesson },
      { key: 'm6-11', n: 11, type: 'Proyekt', emoji: '📲', title: 'Loyiha kuni: mobil ilova',      sub: 'eski loyihaning mobil versiyasi', comp: MobileAppPracticeLesson },
      { key: 'm6-12', n: 12, type: 'PM',      emoji: '🗺️', title: 'Bugun qaysi ish boshlanadi?', sub: 'hozir, uch oydan keyin, olti oydan keyin', comp: PmLesson24 },
      { key: 'm6-13', n: 13, type: 'Proyekt', emoji: '🏗️', title: 'Loyiha kuni: to\'liq tizim', sub: 'end-to-end ishlaydigan tizim', comp: FullSystemProjectLesson },
      { key: 'm6-14', n: 14, type: 'PM',      emoji: '🎤', title: 'Raqamingiz nimani isbotlaydi?', sub: 'bitta raqam — bitta slayd', comp: PmLesson25 },
      { key: 'm6-15', n: 15, type: 'Rezerv',  emoji: '📅', title: 'Zaxira dars',                sub: 'yetib olish / sayqallash' },
      { key: 'm6-16', n: 16, type: 'Demo',    emoji: '🎤', title: 'Demo Day 3',                 sub: 'IT-hamjamiyat oldida 3 daqiqalik pitch' },
    ],
  },
  {
    id: '9', slug: 'm7', title: 'Loyiham kim uchun va nima uchun', period: 'oy 9–10.5', stage: 2,
    idea: 'Real odamning real muammosi uchun birinchi mini-MVP — jonli va animatsiyali.',
    lessons: [
      { key: 'm7-01', n: 1, type: 'PM', emoji: '🎯', title: 'Loyihangiz kimga kerak?', sub: 'mahsulot va loyiha farqi, atrofdan 10 muammo', comp: PmProductProblemLesson },
      { key: 'm7-02', n: 2, type: 'PM', emoji: '🎙️', title: 'Besh odamdan nimani bilib olasiz?', sub: 'intervyu: bo\'lib o\'tgan ishni so\'rash, 5 yozuv', comp: PmFiveInterviewsLesson },
      { key: 'm7-03', n: 3, type: 'PM', emoji: '✂️', title: 'Besh suhbatdan qaysi muammo chiqdi?', sub: 'sanoq, bitta muammo, qilamiz / keyin / qilmaymiz', comp: PmInterviewMvpLesson },
      { key: 'm7-04', n: 4, type: 'Kod', emoji: '🏛️', title: 'Mini-MVP arxitekturasi', sub: 'qismlar, ma\'lumot, kirish, deploy — chizma', comp: MvpArchitectureLesson },
      { key: 'm7-05', n: 5, type: 'Kod', emoji: '✨', title: 'Animatsiya: interfeys javob beradi', sub: 'transition, transform, Motion', comp: AnimationLesson },
      { key: 'm7-06', n: 6, type: 'PM', emoji: '📊', title: 'Birinchi odam kirganda nimani ko\'rasiz?', sub: 'nimani o\'lchaymiz — va analitikani ulaymiz', comp: PmAnalyticsDayOneLesson },
      { key: 'm7-07', n: 7, type: 'Proyekt', emoji: '🚧', title: 'Loyiha kuni: MVP — birinchi ekran', sub: 'talabni siz yozasiz, agent quradi', comp: MvpFirstScreenLesson },
      { key: 'm7-08', n: 8, type: 'PM', emoji: '🎨', title: 'Yaxshi interfeysdan nimani olasiz?', sub: 'bitta usul va animatsiyalar', comp: PmDesignMotionLesson },
      { key: 'm7-09', n: 9, type: 'Proyekt', emoji: '🏁', title: 'Loyiha kuni: MVP tayyor', sub: 'qolgan funksiyalar, ishlaydigan MVP', comp: MvpCompleteLesson },
      { key: 'm7-10', n: 10, type: 'PM', emoji: '👀', title: 'Odam ilovangizda qayerda to\'xtab qoladi?', sub: 'sinov: tushuntirmang, kuzating', comp: PmUsabilityTestLesson },
      { key: 'm7-11', n: 11, type: 'Proyekt', emoji: '🔁', title: 'Loyiha kuni: sinovdan keyingi tuzatish', sub: 'eng muhim bitta muammo tuzatiladi', comp: MvpIterationLesson },
      { key: 'm7-12', n: 12, type: 'PM', emoji: '🎤', title: 'Pitchingizda kimning hikoyasi bor?', sub: 'muammo, yechim va real foydalanuvchi', comp: PmUserStoryPitchLesson },
      { key: 'm7-13', n: 13, type: 'Rezerv', emoji: '📅', title: 'Zaxira dars', sub: 'yetib olish / sayqallash' },
    ],
  },
  {
    id: '10', slug: 'm8', title: 'Gipotezani qanday tekshirish', period: 'oy 10.5–12', stage: 2,
    idea: 'O\'z analitikangiz, A/B test, xavfsizlik va production — MVP haqiqiy foydalanuvchi uchun mustahkamlanadi.',
    lessons: [
      { key: 'm8-01', n: 1, type: 'PM', emoji: '🎯', title: 'Bir oyda qaysi raqamni o\'stirasiz?', sub: 'bosh raqam, OKR va birinchi tajriba', comp: PmOkrLesson },
      { key: 'm8-02', n: 2, type: 'Kod', emoji: '📡', title: 'Hodisalar tizimi: har harakat jadvalga yoziladi', sub: 'hodisa → Backend → Database, uch hodisa', comp: EventTrackingLesson },
      { key: 'm8-03', n: 3, type: 'Proyekt', emoji: '📈', title: 'Loyiha kuni: jonli dashboard', sub: 'talabni siz yozasiz, agent dashboard\'ni yig\'adi', comp: LiveDashboardLesson },
      { key: 'm8-04', n: 4, type: 'PM', emoji: '🧪', title: 'Ikki variantdan qaysi biri yaxshiroq ishlaydi?', sub: 'gipoteza va A/B test — B varianti bugun ishga tushadi', comp: PmAbTestLesson },
      { key: 'm8-05', n: 5, type: 'Kod', emoji: '🔐', title: 'Kiberxavfsizlik: zaiflikni topib yopamiz', sub: 'SQL injection, XSS, maxfiy kalitlar, 2FA', comp: SecurityBasicsLesson },
      { key: 'm8-06', n: 6, type: 'PM', emoji: '🛡️', title: 'Foydalanuvchi sizga ma\'lumotini ishonadimi?', sub: 'ma\'lumot sizib chiqsa — audit va maxfiylik siyosati', comp: PmTrustAuditLesson },
      { key: 'm8-07', n: 7, type: 'Kod', emoji: '🌐', title: 'Production deploy: domen, SSL, monitoring', sub: 'sayt yiqilsa, ogohlantirish sizga keladi', comp: ProductionDeployLesson },
      { key: 'm8-08', n: 8, type: 'Proyekt', emoji: '🚧', title: 'Loyiha kuni: prodga ko\'tarish — 1-qism', sub: 'eng yaxshi loyihangiz prod ro\'yxati bo\'yicha', comp: ProdUpgradeLesson },
      { key: 'm8-09', n: 9, type: 'Proyekt', emoji: '🏁', title: 'Loyiha kuni: prodga ko\'tarish — 2-qism', sub: 'code review: har qarorni tushuntirasiz', comp: ProdReviewLesson },
      { key: 'm8-10', n: 10, type: 'PM', emoji: '🛤️', title: 'Bir yilda nimalarni qurdingiz?', sub: 'yillik yo\'l: loyihalar vaqt chizig\'ida va keyingi qadam', comp: PmYearPathLesson },
      { key: 'm8-11', n: 11, type: 'PM', emoji: '🎤', title: 'Besh daqiqada nimani ko\'rsatasiz?', sub: 'pitch repetitsiyasi va qattiq fidbek', comp: PmPitchRehearsalLesson },
      { key: 'm8-12', n: 12, type: 'Rezerv', emoji: '📅', title: 'Zaxira dars', sub: 'yetib olish / sayqallash' },
      { key: 'm8-13', n: 13, type: 'Rezerv', emoji: '📅', title: 'Zaxira dars', sub: 'yetib olish / sayqallash' },
    ],
  },
  {
    id: '11', slug: 'm9', title: 'Final loyiha: g\'oya va rivojlantirish', period: 'oy 12–13.5', stage: 2,
    idea: 'Bitiruvgacha olib boriladigan final mahsulot: g\'oya, intervyu, PRD, prototip va birinchi funksiyalar — web yoki mobil.',
    lessons: [
      { key: 'm9-01', n: 1, type: 'PM', emoji: '💡', title: 'Oltita g\'oyani qayerdan topasiz?', sub: 'muammo, kim uchun va yechim — 6 yozma g\'oya', comp: PmTenIdeasLesson },
      { key: 'm9-02', n: 2, type: 'PM', emoji: '⚖️', title: 'Oltita g\'oyadan qaysi uchtasi qoladi?', sub: 'saralash va RICE bahosi', comp: PmIdeaRiceLesson },
      { key: 'm9-03', n: 3, type: 'PM', emoji: '🎙️', title: 'Ikki g\'oyadan qaysi biri odamlarga kerak?', sub: '10 intervyu, 1-qism: ikki g\'oya, bir xil savollar', comp: PmInterviewsOneLesson },
      { key: 'm9-04', n: 4, type: 'PM', emoji: '🧩', title: 'O\'n intervyudan keyin qaysi g\'oya qoladi?', sub: 'takrorlangan javoblar va final g\'oya', comp: PmFinalIdeaLesson },
      { key: 'm9-05', n: 5, type: 'PM', emoji: '📄', title: 'G\'oyangiz bir sahifaga sig\'adimi?', sub: 'Mentor tekshiruvi va to\'liq PRD', comp: PmPrdLesson },
      { key: 'm9-06', n: 6, type: 'PM', emoji: '🗺️', title: 'Bitiruvgacha nimani qachon qurasiz?', sub: 'RICE bo\'yicha roadmap', comp: PmRoadmapLesson },
      { key: 'm9-07', n: 7, type: 'Kod', emoji: '✏️', title: 'Jonli prototip: qog\'ozdan bosiladigan ekrangacha', sub: 'wireframe → talab → bosiladigan prototip', comp: LivePrototypeLesson },
      { key: 'm9-08', n: 8, type: 'Kod', emoji: '🏛️', title: 'Arxitektura va platforma: web yoki mobil ilova', sub: 'qismlar, real vaqt nuqtalari, stek — asoslangan tanlov', comp: PlatformChoiceLesson },
      { key: 'm9-09', n: 9, type: 'Kod', emoji: '📱', title: 'React Native va Expo: prototip telefonda', sub: 'Expo, navigatsiya; web-trek — adaptiv sayt va PWA', comp: ExpoPrototypeLesson },
      { key: 'm9-10', n: 10, type: 'Proyekt', emoji: '🧱', title: 'Loyiha kuni: poydevor — Database, kirish, deploy', sub: 'tanlangan stekda: ilova Backend\'ga ulanadi', comp: FoundationDayLesson },
      { key: 'm9-11', n: 11, type: 'Proyekt', emoji: '🔧', title: 'Loyiha kuni: 1-asosiy funksiya', sub: 'roadmap\'dagi birinchi funksiya — talabni siz yozasiz', comp: FeatureOneLesson },
      { key: 'm9-12', n: 12, type: 'Proyekt', emoji: '🔧', title: 'Loyiha kuni: 2-asosiy funksiya', sub: 'roadmap\'dagi ikkinchi funksiya', comp: FeatureTwoLesson },
      { key: 'm9-13', n: 13, type: 'PM', emoji: '👀', title: 'Uch foydalanuvchidan keyin nimani tuzatasiz?', sub: 'auditoriya bilan sinov va shu darsda tuzatish', comp: PmAudienceTestLesson },
      { key: 'm9-14', n: 14, type: 'Proyekt', emoji: '🔧', title: 'Loyiha kuni: 3-asosiy funksiya', sub: 'roadmap\'dagi uchinchi funksiya', comp: FeatureThreeLesson },
      { key: 'm9-15', n: 15, type: 'PM', emoji: '🤝', title: 'Roadmap bo\'yicha qayerdasiz?', sub: 'Mentor bilan yakkama-yakka: risklar va tuzatilgan reja', comp: PmOneOnOneLesson },
      { key: 'm9-16', n: 16, type: 'PM', emoji: '🎤', title: 'G\'oyangiz va ilovangiz guruhni ishontiradimi?', sub: 'muammo → yechim → jonli demo', comp: PmPrototypePitchLesson },
      { key: 'm9-17', n: 17, type: 'Demo', emoji: '🎤', title: 'Demo Day 7', sub: 'final g\'oya' },
    ],
  },
  {
    id: '12', slug: 'm10', title: 'Real vaqt va ishga tushirish', period: 'oy 13.5–14.5', stage: 2,
    idea: 'Mahsulot jonlanadi: ekran o\'zi yangilanadi, eslatma keladi — va uni 50 haqiqiy foydalanuvchi ishlatadi.',
    lessons: [
      { key: 'm10-01', n: 1, type: 'PM', emoji: '📰', title: 'Mahsulotingizni bir sahifada qanday tanishtirasiz?', sub: 'lending: sarlavha, foyda va bitta tugma', comp: PmLandingLesson },
      { key: 'm10-02', n: 2, type: 'Kod', emoji: '🔌', title: 'WebSocket: ekran o\'zi yangilanadigan ulanish', sub: 'doimiy ulanish, hodisalar va real vaqt oqimi sxemasi', comp: WebSocketBasicsLesson },
      { key: 'm10-03', n: 3, type: 'PM', emoji: '📝', title: 'Ekran o\'zi yangilanishi uchun nimani yozasiz?', sub: 'real vaqt talabi: hodisalar, ulanish holatlari, chekka holatlar', comp: PmRealtimeSpecLesson },
      { key: 'm10-04', n: 4, type: 'Proyekt', emoji: '🔔', title: 'Loyiha kuni: jonli xabar va eslatma', sub: 'hozir ko\'ryapti, jonli xabar; mobil trekda — telefonga eslatma', comp: LiveNotifyDayLesson },
      { key: 'm10-05', n: 5, type: 'Kod', emoji: '🧯', title: 'Ulanish uzilsa: buzamiz va tuzatamiz', sub: 'uzilish, takror hodisa, qayta ulanish — uchta muammo', comp: BreakAndFixLesson },
      { key: 'm10-06', n: 6, type: 'PM', emoji: '📣', title: 'Birinchi foydalanuvchilar sizni qayerdan topadi?', sub: 'kanallar va birinchi post', comp: PmChannelsLesson },
      { key: 'm10-07', n: 7, type: 'PM', emoji: '🚀', title: '50 foydalanuvchiga qanday yetasiz?', sub: 'yig\'ish rejasi va ishga tushirish', comp: PmFiftyUsersLesson },
      { key: 'm10-08', n: 8, type: 'PM', emoji: '🔎', title: 'Foydalanuvchilar qaysi qadamda to\'xtab qolyapti?', sub: 'qadamlar bo\'yicha sanoq, gipoteza va shu darsda tuzatish', comp: PmDropOffLesson },
      { key: 'm10-09', n: 9, type: 'Proyekt', emoji: '🔁', title: 'Loyiha kuni: foydalanuvchini qaytaradigan eslatma', sub: 'hodisadan eslatmagacha — talabni siz yozasiz', comp: RetentionDayLesson },
      { key: 'm10-10', n: 10, type: 'PM', emoji: '📊', title: '50 foydalanuvchiga yetdingizmi?', sub: 'Mentor tekshiruvi: metrika hisoboti va zaxira reja', comp: PmUsersCheckLesson },
      { key: 'm10-11', n: 11, type: 'PM', emoji: '🤝', title: 'Raqamlaringiz pitchni qanday o\'zgartiradi?', sub: 'Mentor bilan yakkama-yakka: tuzatilgan pitch', comp: PmPitchReviewLesson },
      { key: 'm10-12', n: 12, type: 'PM', emoji: '🎤', title: 'Raqamlaringiz zalni ishontiradimi?', sub: 'metrikali pitch: o\'sish grafigi — dalil', comp: PmGrowthPitchLesson },
      { key: 'm10-13', n: 13, type: 'Rezerv', emoji: '📅', title: 'Zaxira dars', sub: 'taymer bilan to\'liq repetitsiya' },
    ],
  },
  {
    id: '13', slug: 'm11', title: 'O\'sish va monetizatsiya', period: 'oy 14.5–15.5', stage: 2,
    idea: 'Mahsulot pul topa boshlaydi: narx, test rejimdagi to\'lov, taklif havolasi — va birinchi odamlar to\'lashga tayyorligini tasdiqlaydi.',
    lessons: [
      { key: 'm11-01', n: 1, type: 'PM', emoji: '🧮', title: 'Bitta foydalanuvchi sizga qanchaga tushadi?', sub: 'jalb qilish narxi va foydalanuvchi keltiradigan pul', comp: PmUnitEconomicsLesson },
      { key: 'm11-02', n: 2, type: 'PM', emoji: '🧭', title: 'Mahsulotingiz qanday pul topadi?', sub: 'besh model: bepul asos, pullik obuna, reklama, B2B, tranzaksiya', comp: PmMonetizationLesson },
      { key: 'm11-03', n: 3, type: 'Kod', emoji: '🔐', title: 'Webhook: to\'lov Backend\'ga qanday yetib keladi', sub: 'imzo, takror xabar va rad etilgan to\'lov — test rejimda', comp: PaymentWebhookLesson },
      { key: 'm11-04', n: 4, type: 'PM', emoji: '🏷️', title: 'Narxni qanday belgilaysiz?', sub: 'xarajat, raqobat, qiymat → narx va to\'lov taklifi ekrani', comp: PmPricingLesson },
      { key: 'm11-05', n: 5, type: 'Proyekt', emoji: '🧪', title: 'Loyiha kuni: to\'lovni ulaymiz va buzib ko\'ramiz', sub: 'test rejimda to\'lov oqimi; buzamiz va tuzatamiz', comp: PaymentDayLesson },
      { key: 'm11-06', n: 6, type: 'PM', emoji: '🗣️', title: 'Pul haqida qanday gaplashasiz?', sub: 'narx bo\'yicha uchta real suhbat', comp: PmMoneyTalkLesson },
      { key: 'm11-07', n: 7, type: 'PM', emoji: '📄', title: 'Foydalanuvchiga shartlarni qanday ochiq aytasiz?', sub: 'oferta va maxfiylik siyosati saytda', comp: PmTermsLesson },
      { key: 'm11-08', n: 8, type: 'Proyekt', emoji: '📬', title: 'Loyiha kuni: ketayotgan foydalanuvchini qaytarish', sub: 'nega ketishadi va bitta qaytarish mexanikasi', comp: WinBackDayLesson },
      { key: 'm11-09', n: 9, type: 'PM', emoji: '✅', title: 'Kim haqiqatan to\'lashga tayyor?', sub: 'Mentor tekshiruvi: uchta yozma tasdiq', comp: PmPayCheckLesson },
      { key: 'm11-10', n: 10, type: 'Proyekt', emoji: '🔗', title: 'Loyiha kuni: taklif havolasi va mukofot', sub: 'unikal havola, sanoq va mukofot', comp: ReferralDayLesson },
      { key: 'm11-11', n: 11, type: 'PM', emoji: '🪞', title: 'Mahsulotingiz hozir qayerda?', sub: 'roadmap bilan solishtirish va shaxsiy hisobot', comp: PmReflectionLesson },
      { key: 'm11-12', n: 12, type: 'Proyekt', emoji: '🛠️', title: 'Loyiha kuni: barqarorlashtirish', sub: 'asosiy yo\'llarni tekshiramiz va tuzatamiz', comp: StabilizeDayLesson },
      { key: 'm11-13', n: 13, type: 'Rezerv', emoji: '📅', title: 'Zaxira dars', sub: 'yetib olish / sayqallash' },
    ],
  },
  {
    id: '14', slug: 'm12', title: 'Bitiruvchi va mahsulot tezligi', period: 'oy 15.5–16.5', stage: 2,
    idea: 'Mahsulot tez va silliq ishlaydi, pitch va jonli demo hakamlar oldiga tayyor — va keyingi olti oy rejasi bor.',
    lessons: [
      { key: 'm12-01', n: 1, type: 'PM', emoji: '💼', title: 'Investorga pitchni qanday tuzasiz?', sub: 'olti bo\'lak: muammo, bozor, yechim, raqamlar, jamoa, keyingi qadam', comp: PmInvestorPitchLesson },
      { key: 'm12-02', n: 2, type: 'PM', emoji: '📖', title: 'Mahsulotingiz hikoyasini qanday aytasiz?', sub: '5 daqiqalik pitch — hikoya, funksiyalar ro\'yxati emas', comp: PmStoryPitchLesson },
      { key: 'm12-03', n: 3, type: 'Kod', emoji: '⚡', title: 'Mahsulot tezligi: o\'lchaymiz va tezlashtiramiz', sub: 'Lighthouse, rasmlar va yuklanadigan kod hajmi — oldin va keyin', comp: ProductSpeedLesson },
      { key: 'm12-04', n: 4, type: 'Proyekt', emoji: '✨', title: 'Loyiha kuni: demo uchun sayqal', sub: 'demo yo\'lidagi uch joy: bosish, yuklanish, muvaffaqiyat', comp: PolishDayLesson },
      { key: 'm12-05', n: 5, type: 'PM', emoji: '👥', title: 'Guruh pitchingizda nimani tuzatishni aytadi?', sub: 'pitch mashqi 1: guruh fidbeki va tuzatishlar ro\'yxati', comp: PmPitchTrainingLesson },
      { key: 'm12-06', n: 6, type: 'Kod', emoji: '🧰', title: 'Demoga tayyorgarlik: risklar va B reja', sub: 'demo ssenariysi, B reja va yangi funksiyani to\'xtatish', comp: DemoPrepLesson },
      { key: 'm12-07', n: 7, type: 'PM', emoji: '🔍', title: 'Investor ko\'zi bilan: demo buzilmaydimi?', sub: 'demo tekshiruvi: buzamiz, agent tuzatadi, uch marta to\'liq o\'tish', comp: PmDemoTestLesson },
      { key: 'm12-08', n: 8, type: 'PM', emoji: '⏱️', title: 'Final pitchingiz 5 daqiqaga tayyormi?', sub: 'pitch mashqi 2: taymer va savol-javob', comp: PmFinalPitchLesson },
      { key: 'm12-09', n: 9, type: 'Kod', emoji: '🎬', title: 'Video-portfolio: 3 daqiqada o\'zingiz va mahsulot', sub: 'ssenariy, ekran yozuvi va havola', comp: VideoPortfolioLesson },
      { key: 'm12-10', n: 10, type: 'PM', emoji: '🧾', title: 'Birinchi buyurtmani qayerdan topasiz?', sub: 'frilans va stajirovka: reja va ikki xat', comp: PmFreelanceLesson },
      { key: 'm12-11', n: 11, type: 'PM', emoji: '🌍', title: 'Qaysi xalqaro dasturga ariza berasiz?', sub: 'Diamond Challenge, Y Combinator: shartlar va ariza', comp: PmProgramsLesson },
      { key: 'm12-12', n: 12, type: 'PM', emoji: '🗓️', title: 'Keyingi olti oyda nima qilasiz?', sub: 'Mentor bilan yakkama-yakka: olti oylik reja', comp: PmNextStepsLesson },
      { key: 'm12-13', n: 13, type: 'PM', emoji: '🎤', title: 'Demo Day\'ga tayyormisiz?', sub: 'hakamlar oldidan to\'liq repetitsiya', comp: PmDressRehearsalLesson },
      { key: 'm12-14', n: 14, type: 'Rezerv', emoji: '📅', title: 'Zaxira dars: zalni tayyorlash', sub: 'tashkiliy dars' },
      { key: 'm12-15', n: 15, type: 'PM', emoji: '🤝', title: 'Bitiruvchilar bilan uchrashuv', sub: 'tadbir — tashkilotchi bilan' },
      { key: 'm12-16', n: 16, type: 'Demo', emoji: '🏆', title: 'Demo Day 8 — bitiruv himoyasi', sub: 'hakamlar: 5–7 investor va tadbirkor; 5 daqiqa pitch va savol-javob' },
      { key: 'm12-17', n: 17, type: 'Demo', emoji: '🎓', title: 'Bitiruv marosimi', sub: 'sertifikatlar, video-portfolio, g\'oliblar' },
    ],
  },
]

const ALL = MODULES.flatMap(m => m.lessons.map(l => ({ ...l, mod: m })))
const READY = ALL.filter(l => l.comp)

const TYPE = {
  Kod:     { color: '#019ACB', label: 'Kod' },
  PM:      { color: '#FF4F28', label: 'PM' },
  Proyekt: { color: '#1F7A4D', label: 'Proyekt' },
  Demo:    { color: '#7C3AED', label: 'Demo' },
  Rezerv:  { color: '#A7A6A2', label: 'Zaxira' },
}
const FILTERS = ['Hammasi', 'Kod', 'PM', 'Proyekt']

// Hash'dan joriy dars kalitini o'qiydi (#/lesson/KEY → KEY, aks holda null = bosh sahifa)
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

export default function App() {
  const key = useRoute()
  const lesson = READY.find(l => l.key === key)
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
        {/* F-1004-09: telefonda qobiq-tugmalar darsning pastki paneli («Orqaga») ustiga tushardi — panel ustiga ko'tariladi */}
        <style>{'@media (max-width: 720px) { .qa-shell { bottom: calc(80px + env(safe-area-inset-bottom, 0px)) !important; } }'}</style>
        <a className="qa-shell" href="#/" title="Bosh sahifa — boshqa darsni tanlash" aria-label="Bosh sahifa"
          style={{ position: 'fixed', bottom: 14, left: 14, zIndex: 950, width: 40, height: 40, borderRadius: 12, border: 'none', background: '#FFFFFF', color: '#5A5A60', fontSize: 19, lineHeight: '40px', textAlign: 'center', textDecoration: 'none', cursor: 'pointer', boxShadow: '0 6px 18px -6px rgba(58,53,48,0.35)', opacity: 0.55, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>⌂</a>
        {/* UZ-RU: dars ichida til almashtirgich — ⌂ yonida, progress saqlanadi (komponent remount bo'lmaydi) */}
        <div className="qa-shell" style={{ position: 'fixed', bottom: 14, left: 62, zIndex: 950, display: 'flex', borderRadius: 12, background: '#FFFFFF', boxShadow: '0 6px 18px -6px rgba(58,53,48,0.35)', overflow: 'hidden', opacity: 0.55, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1 }} onMouseLeave={e => { e.currentTarget.style.opacity = 0.55 }}>
          {['uz', 'ru'].map(l => (
            <button key={l} title={l === 'uz' ? "Dars tili: o'zbekcha" : 'Язык урока: русский'} onClick={() => pickLang(l)}
              style={{ width: 34, height: 40, border: 'none', cursor: 'pointer', fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 800, fontSize: 11.5, background: lang === l ? '#0E0E10' : 'transparent', color: lang === l ? '#fff' : '#5A5A60', transition: 'background 0.15s, color 0.15s' }}>{l.toUpperCase()}</button>
          ))}
        </div>
      </Suspense>
    )
  }

  const counts = { Kod: 0, PM: 0, Proyekt: 0 }
  ALL.forEach(l => { if (counts[l.type] !== undefined) counts[l.type]++ })

  return (
    <div style={{ minHeight: '100dvh', background: '#F6F4EF', fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,600&family=Manrope:wght@500;600;700;800&display=swap');
        .hp { max-width: 880px; margin: 0 auto; padding: clamp(28px,5vw,56px) 20px 80px; }
        .lz-card { display: flex; align-items: center; gap: 14px; width: 100%; text-align: left; background: #fff; border: none; border-radius: 14px; padding: 13px 16px; cursor: pointer; text-decoration: none; box-shadow: 0 5px 18px -12px rgba(58,53,48,0.22); transition: transform 0.16s, box-shadow 0.16s; }
        .lz-card:hover { transform: translateY(-2px); box-shadow: 0 14px 30px -12px rgba(255,79,40,0.3); }
        .lz-card:hover .lz-arrow { color: #FF4F28; transform: translateX(4px); }
        .lz-card.soon { background: #FBFAF7; box-shadow: none; border: 1px dashed #E2DED4; cursor: default; }
        .lz-card.soon:hover { transform: none; box-shadow: none; }
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
        <p style={{ margin: '0 0 6px', fontSize: 11.5, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF4F28' }}>CoddyCamp · Senior 2026</p>
        <h1 style={{ margin: '0 0 8px', fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: 'clamp(27px,4.4vw,40px)', color: '#0E0E10' }}>Barcha darslar — dastur tartibida</h1>
        <p style={{ margin: '0 0 18px', fontSize: 14, fontWeight: 500, color: '#5A5A60', maxWidth: 620 }}>
          2-moduldan 14-modulgacha, CoddyCamp Senior 2026 dasturi bo'yicha (1-modul Foundation — saytdan tashqari). Darsni bosing — o'z manzili bor, sahifa yangilansa ham ochiq qoladi.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 34 }}>
          {[
            { v: READY.length, t: 'tayyor dars' },
            { v: counts.Kod, t: '💻 Kod' },
            { v: counts.Proyekt, t: '🛠 Proyekt' },
            { v: counts.PM, t: '🧭 PM' },
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
                <span style={{ fontSize: 12, fontWeight: 700, color: '#A7A6A2' }}>· {mod.period} · {mod.lessons.length} dars</span>
              </div>
              <p style={{ margin: '5px 0 0', fontSize: 12.5, fontWeight: 600, color: '#5A5A60', fontStyle: 'italic' }}>💡 {mod.idea}</p>
            </div>
            <div className="lz-grid">
              {mod.shown.map(l => {
                const t = TYPE[l.type]
                const inner = (
                  <>
                    <span className="lz-num">{l.n}</span>
                    <span style={{ fontSize: 23, flexShrink: 0 }}>{l.emoji}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontWeight: 700, fontSize: 'clamp(14px,1.9vw,16px)', color: l.comp ? '#0E0E10' : '#8A8880' }}>{l.title}</span>
                      <span style={{ display: 'block', marginTop: 1, fontSize: 12, fontWeight: 500, color: '#8A8880' }}>{l.sub}</span>
                    </span>
                    <span className="lz-chip" style={{ background: `${t.color}18`, color: t.color }}>{t.label}</span>
                    {l.comp
                      ? <span className="lz-arrow" style={{ fontSize: 17, color: '#A7A6A2', transition: 'transform 0.2s, color 0.2s', flexShrink: 0 }}>→</span>
                      : <span style={{ fontSize: 11, fontWeight: 700, color: '#C4C2BB', flexShrink: 0 }}>—</span>}
                  </>
                )
                return l.comp
                  ? <a key={l.key} className="lz-card" href={`#/lesson/${l.key}`}>{inner}</a>
                  : <div key={l.key} className="lz-card soon">{inner}</div>
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
