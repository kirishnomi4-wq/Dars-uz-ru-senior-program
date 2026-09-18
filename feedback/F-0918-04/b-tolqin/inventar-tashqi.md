# T2-A — 17 «tashqi» nishon inventari (2026-09-18)

`ACH_TRIGGERS` jadvalidan tashqarida beriladigan nishonlar: 16 darsda to'g'ridan-to'g'ri `earn('…')` + PmLesson25 `ACH_EXTRA`.
To'liq yozuvlar (qator, kod parchasi, shart, tavsif): `inventar-tashqi.json`. Kod o'qildi, brauzerda ko'rilmadi.
Mashq-o'tishida (`firstPassRef`) hammasi baribir muzlagan — `earn` birinchi qatorda qaytadi.

## Hukmlar

| Hukm | Soni | Nishonlar |
|---|---|---|
| **O'LIK** | 4 | BotFeedbackIteration `neverSilent` · JsConditions `logician` · JsVars `coder` · PeanStack `coder` — ACHIEVEMENTS'da yo'q, `earn` darhol qaytadi. P2 aytgan `logician` / PeanStack `coder` tasdiqlandi, yana 2 tasi topildi. Tozalash — tunda tegilmaydi |
| **MEHNAT** | 6 | HtmlPractice `coder` · JsFunctions `coder` (s13 trigger ham) · JsLoops `assemblymaster` · PracticeLesson1 `coder` · PracticeLesson2 `builder` (sayt nashri) · VsCode `cardmaster` — praktika (kod yozish) tugaganda; 2-A bo'yicha, kod 0 |
| **HALOL (agregat)** | 2 | PmMetrics `dataEye` (s7/s8 QuestionScreen + s9 bir martalik MatchPairs) · PmUserStory `hotspotAce` (s7/s8/s9 QuestionScreen) |
| **BONUS (152)** | 1 | ClaudeSkills `beforeAfter` — tavsif har yo'lda rost, darsda boshqa kafolatli nishon yo'q; kod 0, reyestrga |
| **A** | 3 | BotIntro `neverSilent` · PracticeLesson4 `planner` · PmLesson25 `proofFinder` |
| **TEKIN → taklif A-agregat** | 1 | PmJtbd `jobHunter` |

## A — tuzatish taklifi

- **BotIntro `neverSilent`** (≈2480): s7 faqat 4/4 da yechiladi → `bonus` doim true → `sheetMaster` bilan doim birga, `missedRef` tekshiruvisiz
  (151-qonunni aylanib o'tadi). Tuzatish: `&& !missedRef.current.has(_m.id)` (1 qator; P6 partiyasi egasi). Ochiq savol: bitta
  topshiriqqa ikki nishon qolsinmi.
- **PracticeLesson4 `planner`** (≈1405): yakuniy DragDrop-test s15 da har qanday yechimga. Ball-tuzatishi bilan birga: `if (earn && first)`.
- **PmLesson25 `proofFinder`** (ACH_EXTRA, ≈872/3643): tanlov qotmaydi — xatodan keyin to'g'risini bossa ham beriladi. `missTry(s4)` yaramaydi
  (s4 ning `slideTalker` bonusini to'sadi). Taklif: birinchi tanlovni muhrlash (`firstPickRef` + SLAYD_KEY saqlovida `firstPick`), ~5 qator.

## PmJtbd `jobHunter` — tavsif rost emas

Shart `picked != null` — uchala testga JAVOB berilsa, xato bo'lsa ham beriladi; tavsif «3 tekshiruvni ham yechib chiqdingiz».
Taklif (matnga tegmaydi): shart `.correct` ga — qardosh etalonlar `dataEye` va `hotspotAce` bilan bir xil «3 dan 3» agregat
(`correct` = birinchi urinish). 1 token. Muqobil — tavsifni «…javob berdingiz» ga o'zgartirish (matn → tasdiq).

## 152-qonun chegarasi (kafolatli ≤ 2)

PmJtbd: `graduate` + `jobHunter` (hozir tekin) = 2 → chegara ichida, lekin tavsif yolg'on. ClaudeSkills: faqat `beforeAfter` = 1.
BotIntro: `keyMaster` (bonus) = 1; `neverSilent` A bo'lgach — 1.
