# F-1023 · 23.10 kechki LMS relizi — tayyorlash

Foydalanuvchi (23.10 17:30–17:45): bugun kechga hamma darslarni so'nggi versiyada LMS'ga chiqaramiz. Qarorlar:
- CodeStrike — LMS'dagi oxirgi yuklangan mantiq qoladi. Bugungi `codestrike` kodi (F-1023-01) faqat Abdullohga QA namunasi edi, relizga qo'shilmaydi.
- «Kodsiz, o'zim ko'raman» — ko'rinadigan tugma (mentorlar ko'rmay qolyapti).
- Uy vazifalari — so'nggi versiya (v2, LMS'da 21.10 dan) shartlari JSX oxiridagi «Uyga vazifa» kartasiga ham, uz + ru.
- PM: to'liq yaxshilanganlari kiradi (F-1022-01 dan m3-10, m3-05; qolgan 5 tasi jadval holida — kirmaydi). F-1020 uch darsi + qolip CSS kiradi.
- Commit — ruxsat (push yo'q). Yuklash — alohida gaplashiladi. Darvoza yiqilsa — davom, o'sha paytda aytiladi.

| Vaqt | Yozuv |
|---|---|
| 17:45 | **F-1023-01 ajratildi.** Bugungi CodeStrike kodi `feedback/F-1023-01-learn/codestrike-kod-20261023.patch` ga saqlandi (185 fayl). `useLiveSession.js` va `resultDetails.test.mjs` HEAD holatiga; `resultDetails.js` = HEAD + faqat F-1021-08/09 preview tuzatishi (`onRunChange`); 182 darsdagi QuizArena satri eski holiga (177 tasi `git checkout`, 5 tasida faqat shu satr — boshqa tahrirlar bor). `src` da «F-1023-01» qoldig'i 0. Unit 26/26. Abdullohga berilgan namuna fayl va 2 MD joyida. |
| 17:50 | **F-1023-02 · «O'zim mustaqil ko'raman →»** (`src/live/LiveUI.jsx`): 13px kulrang yozuv o'rniga asosiy tugma kengligida oq fonli, aksent chegarali tugma (`_liveBtnSec`); ru «Смотрю самостоятельно →». `useLiveSession.js` dagi ulanish xatosi matnida eski nom yangilandi. Mantiq o'zgarmagan (`live.selfStudy()`). |
| 18:00 | **F-1023-03 · Uyga vazifa v2 kartalari — 101 dars.** Yangi umumiy komponent `src/qolip/UygaVazifaKarta.jsx` (qadamlar · «Nima tekshiriladi» · «LMS'da «…» vazifasini oching» qatori; test — savollar soni; `tugma` rejimi). Skript `scripts/hw-v2-kartalar.mjs` (quruq yurish / `--yoz`, qayta yurgizish xavfsiz) har darsga o'z `HW_V2` konstantasini yozadi va eski kartani almashtiradi. Vazifa → dars: `LMS_REESTR.json` (modul, tartib); 3- va 4-modulda CRM'dagi bo'sh «03» qatori sababli N ≥ 3 da +1 — 101 ta nom solishtirildi, mos. Naqshlar: A 65 (`hwOpen && <div card hw>`), B 6 (`uyga={<div>}`), D 6 (`HwCard`, «Keyingi dars» saqlanadi), E 3 (`HwKarta`, «Keyingi dars» saqlanadi), E0 1 (`uyga={null}`), F 3 (tugma ham yo'q edi → `tugma`), G 17 (QYakun `uyga` siz → qo'shildi). Ishlatilmay qolgan eski ro'yxatlar o'chirildi (68 ta lokal `HOMEWORK`, 3 `UYGA`, `HW_QADAM`/`HW_KARTA`/`HW_BAND`). |
| 18:00 | **Tutilgan xato:** ReactRouterPractice'da import dars ichidagi kod-namunaning `import` qatoriga tushdi — `lint:undef` ushladi, qo'lda ko'chirildi; skript endi faqat fayl boshidagi import blokiga yozadi. |
| 18:05 | Tekshiruv: lint:jsx 258 toza · esbuild 258 · lint:undef 0 · til-lint 101 darsda error 0 · suratlar (har naqshdan bittasi + ru): InternetLesson (test), DeployLesson, BotAiProject (tugma), MvpFirstScreen (QYakun), WebSocketBasics va EventTracking («Keyingi dars» bilan), VideoPortfolio, Routing ru — hammasi to'g'ri. Sarlavhadagi takror «Uyga vazifa:» prefiksi olib tashlandi. |
| 18:05 | **Qonun:** DARS_ETALON 172-qonun 4-band «Uyga vazifa bloki yakundan olinadi» — bekor, sanali tuzatish qo'shildi (F-1023-03). |
