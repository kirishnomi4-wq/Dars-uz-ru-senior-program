# Prod CRM: yangi JSX tekshiruvi 34 darsni qabul qilmayapti (K03, R04)

11 noyabr 2026 · 38-hujjatdan keyin

Salom. «Cannot create catalogue lock» xatosini tuzatganingiz uchun rahmat. Yuklash ishlayapti: `01-InternetLesson-v6.jsx` uz (13381) va ru (14091) qatorlarda Active. Hozir 172 darsdan 138 tasini navbat bilan yuklayapmiz: har dars tekshiruvdan o'tgach Active qilinadi.

Qolgan **34 darsni** CRM saqlashning o'zida rad etyapti. Bu qatorlar o'zgarmagan, eski versiyada Active turibdi.

## 1. K03 — «Недопустимый импорт `react-dom`» (32 dars)

Bu darslar `import { createPortal } from "react-dom"` ishlatadi. Ikki joyda:

- amaliyot darslarida «Avval tayyorlaning» oynasi (dialog) ochiladi;
- PM darslarida javobdan keyin uchadigan yozuvlar (animatsiya qatlami) chiqadi.

Hozir LMS'da turgan eski versiyalarda ham shu import bor va ular ishlayapti.

**Shoshilinch dars:** 12-Modul «PmGrowthPitch» (`12-PmGrowthPitchLesson-v7.jsx`). Prod'dagi versiyada 6-ekranda to'g'ri javob tanlansa oq ekran chiqadi (29.10 dan beri). Tuzatilgan versiya tayyor, lekin K03 tufayli yuklanmayapti.

Ro'yxat (modul · fayl):

| Modul | Darslar |
|---|---|
| 2 | 10-HtmlPractice-v7 · 11-CssPractice-v6 · 13-DeployLesson-v6 |
| 3 | 09-PracticeLesson1-v7 · 10-PracticeLesson2-v6 · 12-PracticeLesson3-v7 · 13-PracticeLesson4-v7 |
| 4 | 08-ReactCrudPracticeLesson-v7 · 12-ReactRouterPracticeLesson-v6 · 13-ReactProjectDayLesson-v7 · 14-ReactBuildSiteLesson-v7 |
| 5 | 08-BackendCrudPracticeLesson-v7 · 10-FullstackConnectPracticeLesson-v7 · 13-FullstackProjectDayLesson-v7 · 14-FullstackFeedbackLesson-v7 |
| 6 | 04-NestArchPracticeLesson-v7 · 11-FullPipelineProjectLesson-v6 · 12-AiPipelineProjectLesson-v6 · 14-FullProPipelineLesson-v6 |
| 12 | 01-PmLandingLesson-v6 · 03-PmRealtimeSpecLesson-v6 · 06-PmChannelsLesson-v7 · 07-PmFiftyUsersLesson-v6 · 08-PmDropOffLesson-v6 · 10-PmUsersCheckLesson-v6 · 11-PmPitchReviewLesson-v6 · 12-PmGrowthPitchLesson-v7 |
| 13 | 01-PmUnitEconomicsLesson-v7 · 06-PmMoneyTalkLesson-v6 · 09-PmPayCheckLesson-v6 · 11-PmReflectionLesson-v6 |
| 14 | 10-PmFreelanceLesson-v6 |

## 2. R04 — «Медиа на внешнем сервере» (3 dars)

| Dars | Manzil | Nima |
|---|---|---|
| 2-Modul 04-Htmllesson2-v6 | `https://coddycamp-uyga-vazifa-v2.vercel.app/rasm/assets/futbol.png` | uyga vazifadagi rasm (bizning sayt) |
| 2-Modul 05-HtmlTakrorlashLesson-v6 | `https://coddycamp-uyga-vazifa-v2.vercel.app/rasm/assets/logo.png` | uyga vazifadagi rasm (bizning sayt) |
| 6-Modul 11-FullPipelineProjectLesson-v6 | `https://github.com/LOGIN/REPO/actions/workflows/ci.yml/badge.svg` | kod namunasidagi matn — rasm sifatida yuklanmaydi (bu dars K03 da ham bor) |

## 3. Savollar

1. **react-dom:** LMS darsni ishga tushirganda `react-dom` ni beradimi?
   - Bersa — K03 ruxsat ro'yxatiga `react-dom` (`createPortal`) ni qo'shib bera olasizmi? Bizda hech narsa o'zgarmaydi, 32 darsni darhol yuklaymiz.
   - Bermasa — ayting: 32 darsdan `createPortal` ni olib tashlaymiz. Bu kattaroq ish va alohida tekshiruv talab qiladi.
2. **R04, ikkita rasm:** ularni CRM'ning o'z media kutubxonasiga (`go.coddycamp.uz/uploads/media_library`) ko'chirsak bo'ladimi? Bo'lsa, qanday yuklaymiz?
3. **R04, kod namunasi:** darsdagi oddiy matn ichidagi manzil ham R04 ga tushyapti. Matndagi manzillar uchun istisno bo'ladimi yoki namunani o'zimiz o'zgartiraylikmi?
4. **Tezlik:** «Браузер» tekshiruvi fayllarni birma-bir tekshiradi, har biriga ~3 daqiqa ketadi. 138 fayl ~6,5 soat oladi. Tekshiruvni parallel qilish mumkinmi?
