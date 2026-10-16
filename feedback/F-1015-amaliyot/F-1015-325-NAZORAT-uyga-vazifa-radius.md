# F-1015-325 · «Uyga vazifa» tugmasi — CODE STRIKE kabi yumshoq burchak (nazorat seansi uchun vazifa)

> Tayyorladi: 3-seans (praktikalar), 2026-10-16 16:00. **Bajarilmagan** — umumiy fayllar, 97 dars. Bir fayl — bir muharrir: bajarishni nazorat seansi taqsimlaydi.
> Rasm: `F-1015-325-uyga-radius.png` (foydalanuvchi). Prototip suratlari: `seans-vositalar/suratlar/f325/` (oldin/keyin).

## 1. Qaror
Foydalanuvchi (16.10 ~15:50): «CODE STRIKE'ning burchagi yumshoq, uyga vazifada qattiq — to'g'rilashimiz kerak, bir xil, CODE STRIKE'dagidek yumshoq qilaylik».
Variant **A** tanlandi: «hamma darsda, shoshilmasdan, aniqlikda».

Bu 192-qonunning 2-bandini (`.hw-big { border-radius: 22px }`, 04.10 da foydalanuvchining o'zi qat'iy qilgan) o'zgartiradi →
**yangi raqamli qonun** kerak (eski raqam o'zgarmaydi). Taklif: **209-qonun** (yoki nazorat bergan navbatdagi raqam — 2-seans ham qonun qo'shmoqda).

## 2. O'lchov (16.10 16:00, `src/` bo'yicha, `arxiv/` va `2-moodull eski/` hisobga olinmagan)
| Joy | Nima | Soni |
|---|---|---|
| `src/qolip/qolipCss.js:248` | `.hw-big { … border-radius: 22px; … }` | 1 (→ 79 QYakun darsi shu yerdan oladi) |
| `src/qolip/qolipCss.js:246` | `.hw-big-wrap::before { … border-radius: 34px; … }` (nur halqasi) | 1 |
| darsning o'z CSS'i | `.hw-big {…22px…}` + `.hw-big-wrap::before {…34px…}` — **har faylda aynan bittadan** (tekshirildi) | **97 fayl** |
| ixcham variant | `.screen:has(.hw-chips) .hw-big { … border-radius: 15px; }` | 4 fayl: `5-Modull/PmLesson19`, `5-Modull/PmLesson21`, `6-Modull/PmLesson25`, `pm/PmMetricsLesson` |
| darvoza | `lint-qolip.mjs` q11 (91–92-qator): `!== '22px'` → error | 1 |
| qonun | `DARS_ETALON.md` 192-qonun 2-band | yangi qonun |

97 faylning **38 tasida commit qilinmagan o'zgarish bor** (boshqa seanslar ishi) — tahrirdan oldin egasi bilan kelishiladi.
Fayllar ro'yxati — 6-bo'lim (`*` — commit'siz o'zgarishi bor).

> 16.10 ~16:10 (F-1015-326): `CssPractice.jsx` «Uyga vazifa» tugmasi qolip standartiga keltirildi (rang, ramka, soya, yaltirash, nur halqasi, «zaryad») — radiusi hali 22px, u ham shu 97 ro'yxatda, almashtirish qoidasi unga ham aynan tushadi (tekshirildi).

## 3. Aniq tahrirlar
1. **qolip:** `qolipCss.js:248` `.hw-big {` ichida `border-radius: 22px;` → `border-radius: 999px;` · `:246` `.hw-big-wrap::before {` ichida `border-radius: 34px;` → `border-radius: 999px;`.
2. **97 dars:** xuddi shu ikki almashtirish (regex, faqat shu qoidalar ichida):
   `(\.hw-big \{[^}]*?border-radius: )22px` → `\g<1>999px` · `(\.hw-big-wrap::before \{[^}]*?border-radius: )34px` → `\g<1>999px` — har faylda `count == 1` assert.
3. **4 PM fayl (ixcham):** `(\.screen:has\(\.hw-chips\) \.hw-big \{[^}]*?border-radius: )15px` → `\g<1>999px`. **Foydalanuvchi (16.10 ~16:10): ha** — ixcham variant ham kapsula.
4. **darvoza:** `lint-qolip.mjs` q11: `hwb[1].trim() !== '22px'` → `!== '999px'`; xabar: `«Uyga vazifa» radiusi … — 999px bo'lsin (DE-209)`; 23-qator izohi ham.
5. **qonun (loyiha):**
   > **209-QONUN: «UYGA VAZIFA» — CODE STRIKE KABI KAPSULA (2026-10-16, F-1015-325).** 192-qonunning 2-bandi o'rniga.
   > Foydalanuvchi: «CODE STRIKE'ning burchagi yumshoq, uyga vazifada qattiq — bir xil, CODE STRIKE'dagidek yumshoq qilaylik».
   > 1. `.hw-big { border-radius: 999px }` va nur halqasi `.hw-big-wrap::before { border-radius: 999px }`; ixcham variant ham. O'rni va eni 192 dagidek: o'rtada, `min(560px, 100%)`.
   > 2. Hamma darsda aynan bir xil. Tekshiruv: `gates:qolip` q11 — error.
   > **Bog'liq:** 192.

## 4. Prototip (fayl o'zgarmadi — CSS brauzerda ustiga qo'yildi, `seans-vositalar/sinov/hw-radius-proto.mjs`)
| Dars | 1280 px | 390 px | Matn yumaloq chetgacha |
|---|---|---|---|
| HtmlPractice (qolip) | 560×127 | 366×93 | ≥31 / ≥21 px |
| CssPractice (o'z CSS) | 560×125 | 366×91 | ≥30 / ≥20 px |
| PmLesson19 (o'z CSS) | 560×82 | 366×75 | ≥10 / ≥12 px |
Matn hech qayerda egri chetga tegmaydi, pageerror 0. Suzuvchi so'zlar chetlarda ozgina kesilishi mumkin (tugma `overflow: hidden`) — bezak, ma'noga ta'sir yo'q.

## 5. Tekshiruv rejasi (bajargandan keyin)
1. `npm run gates -- <har fayl>` (q11 yangi qiymat bilan) — 98 fayl toza; `npm run lint:jsx`.
2. Qayta o'lchov: `.hw-big` 22px qolmagan (grep 0), 999px — 98 + 4.
3. Surat: har moduldan bitta dars, 1280 + 390 (prototip skripti `addStyleTag` siz).
4. `vite build` toza.

## 6. Fayllar (97) — `*` commit'siz o'zgarishi bor
- `src/1-Modull/` — CssLesson1 · CssLesson2 · CssPractice* · DeployLesson · GitLesson · Htmllesson1 · Htmllesson2 · HtmlTakrorlashLesson · InternetLesson · PmLesson1 · PmLesson2 · PmLesson3 · VsCodeLesson
- `src/2-Modull/` — JsConditionsLesson · JsFunctionsLesson · JsIntroLesson · JsLoopsLesson · JsVarsLesson · PeanStackLesson · PmLesson4 · PmLesson5 · PmLesson6 · PmMuammoIzlash · PracticeLesson1* · PracticeLesson2* · PracticeLesson3* · PracticeLesson4*
- `src/3-Modull/` — PmLesson10 · PmLesson7 · PmLesson8 · PmLesson9 · ReactApiGetLesson · ReactApiPostLesson · ReactBuildSiteLesson* · ReactCrudPracticeLesson* · ReactFirstComponentLesson · ReactIntroLesson · ReactProjectDayLesson* · ReactPropsReuseLesson · ReactRouterPracticeLesson* · ReactStateEffectLesson
- `src/4a-Modull/` — NestArchAliveLesson · NestArchPracticeLesson* · NestArchResourceLesson · PmLesson15
- `src/4b-Modull/` — EdgeCasesTestLesson · JestUnitTestLesson · PmLesson16
- `src/4c-Modull/` — AiPipelineProjectLesson* · CiCdIntroLesson · FullPipelineProjectLesson* · FullProPipelineLesson* · GithubActionsLesson · PmLesson17 · PmLesson18
- `src/4-Modull/` — ApiPostmanLesson · AuthEnvLesson · BackendCrudPracticeLesson* · DataIntroLesson · DbSqlNosqlLesson · FullstackConnectPracticeLesson* · FullstackFeedbackLesson* · FullstackProjectDayLesson* · NodeServerLesson · PmLesson11 · PmLesson12 · PmLesson13 · PmLesson14 · PostgresCrudLesson · RoutingLesson
- `src/5-Modull/` — BotAiAgentLesson · BotAiBrainLesson · BotAiProjectLesson* · BotApiButtonsLesson* · BotFeedbackIterationLesson* · BotFullProjectLesson* · BotIntroLesson · BotStatefulMemoryLesson · PmLesson19* · PmLesson20* · PmLesson21*
- `src/6-Modull/` — AgentArchitectureLesson* · ArchPatternsLesson* · ClaudeSkillsLesson* · FullSystemProjectLesson* · MobileAppPracticeLesson* · PipelineProjectLesson* · PmLesson22* · PmLesson23* · PmLesson24* · PmLesson25* · ReactNativeAppLesson* · ReactNativeBasicsLesson* · WriteSkillLesson*
- `src/pm/` — PmJtbdLesson · PmMetricsLesson* · PmUserStoryLesson
