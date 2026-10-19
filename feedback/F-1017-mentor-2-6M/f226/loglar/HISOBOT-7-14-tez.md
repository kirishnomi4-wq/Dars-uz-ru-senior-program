# Reliz hisoboti — 2026-10-18 07:46 UTC

API: **prod** · modullar: **7,8,9,10,11,12,13,14** · darslar: **102** · shared: yo'q (DE 221) · preview-sinov: tanlanma · lms/ ga yurishda yozildi: yo'q

| | Qadam | Tafsilot |
|---|---|---|
| ✓ | ro'yxat: 102 dars (7:12 8:14 9:12 10:11 11:16 12:12 13:12 14:13) · katalog 2026-10-18 |  |
| ✓ | unit-testlar (previewMode + resultDetails) | pass 24 · fail 0 |
| ✓ | preview-keys-check (yangi xotira-kalitlari himoyada) | Prefikssiz (${…} bilan boshlanadi) — qo'lda ko'ring: ·   src/live/resultDetails.js — sealKey · ✓ hamma kalit qoplangan |
| ✓ | yakka yig'ish (yuklash-papka): 102 fayl |  |
| — | shared yig'ish | o'tkazildi — kompilyator dars ichida (DE 221), --shared bilan yoqiladi |
| ✓ | statik: 102 fayl — o'ram, window-belgi yo'q, API=prod, supabase yo'q |  |
| ✗ | smoke-lms yakka: ✗ 23 | ✗ 02-EventTrackingLesson.jsx dars: ha (260 belgi) · kompilyator: yo'q<br>✗ 03-LiveDashboardLesson.jsx dars: ha (540 belgi) · kompilyator: kutilmaydi<br>✗ 05-SecurityBasicsLesson.jsx dars: ha (585 belgi) · kompilyator: yo'q<br>✗ 10-PmYearPathLesson.jsx    dars: ha (519 belgi) · kompilyator: yo'q<br>✗ 01-PmTenIdeasLesson.jsx    dars: ha (361 belgi) · kompilyator: yo'q<br>✗ 03-PmInterviewsOneLesson.jsx dars: ha (475 belgi) · kompilyator: yo'q<br>✗ 06-PmRoadmapLesson.jsx     dars: ha (535 belgi) · kompilyator: yo'q<br>✗ 07-LivePrototypeLesson.jsx dars: ha (546 belgi) · kompilyator: yo'q<br>✗ 08-PlatformChoiceLesson.jsx dars: ha (378 belgi) · kompilyator: yo'q<br>✗ 09-ExpoPrototypeLesson.jsx dars: ha (582 belgi) · kompilyator: yo'q |
| — | smoke-shared | o'tkazildi (DE 221) |
| ✓ | smoke-preview yakka: 8/8 (tanlanma) |  |
| — | smoke-preview shared | o'tkazildi (DE 221) |

**Hukm: YIQILDI ✗**

## Darslar

| Modul | key | src | lesson_id |
|---|---|---|---|
| 7 | m5-01 | `src/5-Modull/BotIntroLesson.jsx` | `bot-intro-05-01-v18` |
| 7 | m5-02 | `src/5-Modull/PmLesson19.jsx` | `pm-m5d2-v1` |
| 7 | m5-03 | `src/5-Modull/BotApiButtonsLesson.jsx` | `bot-api-buttons-05-02-v18` |
| 7 | m5-04 | `src/5-Modull/BotStatefulMemoryLesson.jsx` | `bot-stateful-memory-05-03-v18` |
| 7 | m5-05 | `src/5-Modull/BotAiProjectLesson.jsx` | `bot-ai-project-05-05-v18` |
| 7 | m5-06 | `src/5-Modull/BotAiBrainLesson.jsx` | `bot-ai-brain-05-04-v18` |
| 7 | m5-07 | `src/5-Modull/BotFullProjectLesson.jsx` | `bot-full-project-05-07-v18` |
| 7 | m5-08 | `src/5-Modull/PmLesson20.jsx` | `pm-m5d8-v1` |
| 7 | m5-09 | `src/5-Modull/BotFeedbackIterationLesson.jsx` | `bot-feedback-05-06-v18` |
| 7 | m5-10 | `src/5-Modull/BotAiAgentLesson.jsx` | `bot-ai-agent-05-10-v18` |
| 7 | m5-14 | `src/pm/PmMetricsLesson.jsx` | `pm-m5d11-metrika-v1` |
| 7 | m5-11 | `src/5-Modull/PmLesson21.jsx` | `pm-m5d11-v1` |
| 8 | m6-01 | `src/6-Modull/SystemArchitectureLesson.jsx` | `sys-arch-06-01-v18` |
| 8 | m6-02 | `src/6-Modull/PmLesson22.jsx` | `pm-m6d2-v1` |
| 8 | m6-03 | `src/6-Modull/ArchPatternsLesson.jsx` | `arch-patterns-06-03-v18` |
| 8 | m6-04 | `src/6-Modull/AgentArchitectureLesson.jsx` | `agent-arch-06-04-v18` |
| 8 | m6-05 | `src/6-Modull/ClaudeSkillsLesson.jsx` | `claude-skills-06-05-v18` |
| 8 | m6-06 | `src/6-Modull/PmLesson23.jsx` | `pm-m6d6-v1` |
| 8 | m6-07 | `src/6-Modull/WriteSkillLesson.jsx` | `write-skill-06-07-v18` |
| 8 | m6-08 | `src/6-Modull/PipelineProjectLesson.jsx` | `pipeline-project-06-08-v18` |
| 8 | m6-09 | `src/6-Modull/ReactNativeBasicsLesson.jsx` | `rn-basics-06-09-v18` |
| 8 | m6-10 | `src/6-Modull/ReactNativeAppLesson.jsx` | `rn-app-06-10-v18` |
| 8 | m6-11 | `src/6-Modull/MobileAppPracticeLesson.jsx` | `mobile-practice-06-11-v18` |
| 8 | m6-12 | `src/6-Modull/PmLesson24.jsx` | `pm-m6d12-v1` |
| 8 | m6-13 | `src/6-Modull/FullSystemProjectLesson.jsx` | `full-system-06-13-v18` |
| 8 | m6-14 | `src/6-Modull/PmLesson25.jsx` | `pm-m6d14-v1` |
| 9 | m7-01 | `src/7-Modull/PmProductProblemLesson.jsx` | `pm-m7d1-v1` |
| 9 | m7-02 | `src/7-Modull/PmFiveInterviewsLesson.jsx` | `m7-02-v1` |
| 9 | m7-03 | `src/7-Modull/PmInterviewMvpLesson.jsx` | `pm-m7d3-v1` |
| 9 | m7-04 | `src/7-Modull/MvpArchitectureLesson.jsx` | `m7-04-v1` |
| 9 | m7-05 | `src/7-Modull/AnimationLesson.jsx` | `m7-05-v1` |
| 9 | m7-06 | `src/7-Modull/PmAnalyticsDayOneLesson.jsx` | `m7-06-v1` |
| 9 | m7-07 | `src/7-Modull/MvpFirstScreenLesson.jsx` | `m7-07-v1` |
| 9 | m7-08 | `src/7-Modull/PmDesignMotionLesson.jsx` | `m7-08-v1` |
| 9 | m7-09 | `src/7-Modull/MvpCompleteLesson.jsx` | `m7-09-v1` |
| 9 | m7-10 | `src/7-Modull/PmUsabilityTestLesson.jsx` | `m7-10-v1` |
| 9 | m7-11 | `src/7-Modull/MvpIterationLesson.jsx` | `m7-11-v1` |
| 9 | m7-12 | `src/7-Modull/PmUserStoryPitchLesson.jsx` | `m7-12-v1` |
| 10 | m8-01 | `src/8-Modull/PmOkrLesson.jsx` | `pm-m8d1-okr-v1` |
| 10 | m8-02 | `src/8-Modull/EventTrackingLesson.jsx` | `m8-02-event-tracking-v1` |
| 10 | m8-03 | `src/8-Modull/LiveDashboardLesson.jsx` | `m8-03-v1` |
| 10 | m8-04 | `src/8-Modull/PmAbTestLesson.jsx` | `m8-04-v1` |
| 10 | m8-05 | `src/8-Modull/SecurityBasicsLesson.jsx` | `m8-05-security-basics-v1` |
| 10 | m8-06 | `src/8-Modull/PmTrustAuditLesson.jsx` | `m8-06-v1` |
| 10 | m8-07 | `src/8-Modull/ProductionDeployLesson.jsx` | `m8-07-production-deploy-v1` |
| 10 | m8-08 | `src/8-Modull/ProdUpgradeLesson.jsx` | `m8-08-v1` |
| 10 | m8-09 | `src/8-Modull/ProdReviewLesson.jsx` | `m8-09-v1` |
| 10 | m8-10 | `src/8-Modull/PmYearPathLesson.jsx` | `pm-m8d10-yol-v1` |
| 10 | m8-11 | `src/8-Modull/PmPitchRehearsalLesson.jsx` | `pm-m8d11-pitch-v1` |
| 11 | m9-01 | `src/9-Modull/PmTenIdeasLesson.jsx` | `pm-m9d1-v1` |
| 11 | m9-02 | `src/9-Modull/PmIdeaRiceLesson.jsx` | `pm-m9d2-v1` |
| 11 | m9-03 | `src/9-Modull/PmInterviewsOneLesson.jsx` | `pm-m9d3-v1` |
| 11 | m9-04 | `src/9-Modull/PmFinalIdeaLesson.jsx` | `pm-m9d4-v1` |
| 11 | m9-05 | `src/9-Modull/PmPrdLesson.jsx` | `pm-m9d5-v1` |
| 11 | m9-06 | `src/9-Modull/PmRoadmapLesson.jsx` | `pm-m9d6-v1` |
| 11 | m9-07 | `src/9-Modull/LivePrototypeLesson.jsx` | `m9-07-v1` |
| 11 | m9-08 | `src/9-Modull/PlatformChoiceLesson.jsx` | `m9-08-v1` |
| 11 | m9-09 | `src/9-Modull/ExpoPrototypeLesson.jsx` | `m9-09-v1` |
| 11 | m9-10 | `src/9-Modull/FoundationDayLesson.jsx` | `m9-10-v1` |
| 11 | m9-11 | `src/9-Modull/FeatureOneLesson.jsx` | `m9-11-v1` |
| 11 | m9-12 | `src/9-Modull/FeatureTwoLesson.jsx` | `m9-12-v1` |
| 11 | m9-13 | `src/9-Modull/PmAudienceTestLesson.jsx` | `pm-m9d13-v1` |
| 11 | m9-14 | `src/9-Modull/FeatureThreeLesson.jsx` | `m9-14-v1` |
| 11 | m9-15 | `src/9-Modull/PmOneOnOneLesson.jsx` | `pm-m9d15-v1` |
| 11 | m9-16 | `src/9-Modull/PmPrototypePitchLesson.jsx` | `pm-m9d16-v1` |
| 12 | m10-01 | `src/10-Modull/PmLandingLesson.jsx` | `pm-m10d1-v1` |
| 12 | m10-02 | `src/10-Modull/WebSocketBasicsLesson.jsx` | `m10-02-v1` |
| 12 | m10-03 | `src/10-Modull/PmRealtimeSpecLesson.jsx` | `pm-m10d3-v1` |
| 12 | m10-04 | `src/10-Modull/LiveNotifyDayLesson.jsx` | `m10-04-v1` |
| 12 | m10-05 | `src/10-Modull/BreakAndFixLesson.jsx` | `m10-05-v1` |
| 12 | m10-06 | `src/10-Modull/PmChannelsLesson.jsx` | `pm-m10d6-v1` |
| 12 | m10-07 | `src/10-Modull/PmFiftyUsersLesson.jsx` | `pm-m10d7-v1` |
| 12 | m10-08 | `src/10-Modull/PmDropOffLesson.jsx` | `pm-m10d8-v1` |
| 12 | m10-09 | `src/10-Modull/RetentionDayLesson.jsx` | `m10-09-v1` |
| 12 | m10-10 | `src/10-Modull/PmUsersCheckLesson.jsx` | `pm-m10d10-v1` |
| 12 | m10-11 | `src/10-Modull/PmPitchReviewLesson.jsx` | `pm-m10d11-v1` |
| 12 | m10-12 | `src/10-Modull/PmGrowthPitchLesson.jsx` | `pm-m10d12-v1` |
| 13 | m11-01 | `src/11-Modull/PmUnitEconomicsLesson.jsx` | `pm-m11d1-v1` |
| 13 | m11-02 | `src/11-Modull/PmMonetizationLesson.jsx` | `pm-m11d2-v1` |
| 13 | m11-03 | `src/11-Modull/PaymentWebhookLesson.jsx` | `m11-03-v1` |
| 13 | m11-04 | `src/11-Modull/PmPricingLesson.jsx` | `pm-m11d4-v1` |
| 13 | m11-05 | `src/11-Modull/PaymentDayLesson.jsx` | `m11-05-v1` |
| 13 | m11-06 | `src/11-Modull/PmMoneyTalkLesson.jsx` | `pm-m11d6-v1` |
| 13 | m11-07 | `src/11-Modull/PmTermsLesson.jsx` | `pm-m11d7-v1` |
| 13 | m11-08 | `src/11-Modull/WinBackDayLesson.jsx` | `m11-08-v1` |
| 13 | m11-09 | `src/11-Modull/PmPayCheckLesson.jsx` | `pm-m11d9-v1` |
| 13 | m11-10 | `src/11-Modull/ReferralDayLesson.jsx` | `m11-10-v1` |
| 13 | m11-11 | `src/11-Modull/PmReflectionLesson.jsx` | `pm-m11d11-v1` |
| 13 | m11-12 | `src/11-Modull/StabilizeDayLesson.jsx` | `m11-12-v1` |
| 14 | m12-01 | `src/12-Modull/PmInvestorPitchLesson.jsx` | `pm-m12d1-v1` |
| 14 | m12-02 | `src/12-Modull/PmStoryPitchLesson.jsx` | `pm-m12d2-v1` |
| 14 | m12-03 | `src/12-Modull/ProductSpeedLesson.jsx` | `m12-03-v1` |
| 14 | m12-04 | `src/12-Modull/PolishDayLesson.jsx` | `m12-04-v1` |
| 14 | m12-05 | `src/12-Modull/PmPitchTrainingLesson.jsx` | `pm-m12d5-v1` |
| 14 | m12-06 | `src/12-Modull/DemoPrepLesson.jsx` | `m12-06-v1` |
| 14 | m12-07 | `src/12-Modull/PmDemoTestLesson.jsx` | `pm-m12d7-v1` |
| 14 | m12-08 | `src/12-Modull/PmFinalPitchLesson.jsx` | `pm-m12d8-v1` |
| 14 | m12-09 | `src/12-Modull/VideoPortfolioLesson.jsx` | `m12-09-v1` |
| 14 | m12-10 | `src/12-Modull/PmFreelanceLesson.jsx` | `pm-m12d10-v1` |
| 14 | m12-11 | `src/12-Modull/PmProgramsLesson.jsx` | `pm-m12d11-v1` |
| 14 | m12-12 | `src/12-Modull/PmNextStepsLesson.jsx` | `pm-m12d12-v1` |
| 14 | m12-13 | `src/12-Modull/PmDressRehearsalLesson.jsx` | `pm-m12d13-v1` |
