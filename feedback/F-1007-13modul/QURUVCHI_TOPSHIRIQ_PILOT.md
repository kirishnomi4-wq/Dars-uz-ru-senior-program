# 13-Modul — pilot quruvchi topshirig'i (2 dars, 2 agent; 08.10.2026)

> «Qur» buyrug'i — foydalanuvchi, 08.10.2026 tunda («ertalabgacha … agentlarni yuborib 2 ta man korishim un pilotni darslarni tayyorla»). Pilotlar — 00-SEANS_PROMPT 78/86 bo'yicha bitta TEX va bitta real suhbat darsi.
> Har agentga shu fayl + o'z darsining qatori beriladi. Commit, push, deploy — YO'Q. MD ga tegilmaydi (kerak bo'lsa — hisobotda «MD ga taklif»). `maydon-jamoa` repo'siga, App.jsx ga, `src/qolip`, `src/skelet`, `src/live`, `konveyer/*`, boshqa modullarga tegilmaydi.

## Darslar va fayllar (har agent — faqat o'z fayli)

| Dars | Kalit | Fayl (`src/11-Modull/`) | MD (`feedback/F-1007-13modul/`) | Ekran | Turi | Palitra | Namuna (faqat ko'rish, kod ko'chirilmaydi) |
|---|---|---|---|---|---|---|---|
| 3 | m11-03 | `PaymentWebhookLesson.jsx` | `03-PaymentWebhook-v3.md` + `03-FILTR.md` | 20 | TEX (modul cho'qqisi) | `qolipRang('tex')` | 12-Modul `src/10-Modull/WebSocketBasicsLesson.jsx` (sahna, konvert uchishi, `QKod` + `HtmlCompiler` ko'p fayl yechimi, `ScreenBlok`) · `BreakAndFixLesson.jsx` (tekshiruv kartasi, blok bayrog'i) |
| 6 | m11-06 | `PmMoneyTalkLesson.jsx` | `06-PmMoneyTalk-v3.md` + `06-FILTR.md` | 12 | PM (real suhbat, keyssiz) | `qolipRang('pm')` | 12-Modul `src/10-Modull/PmDropOffLesson.jsx`, `PmChannelsLesson.jsx` (QMustaqil ketma-ket karta, yorliq input ichida, tekshiruvlar, yakun) |

Fayl skeletdan oldindan nusxalangan: `LESSON_META` (`m11-03-v1` / `pm-m11d6-v1`, `lessonTitle` — menyu nomi), export nomi, palitra, LiveGate sarlavhasi (`tr(LESSON_META.lessonTitle)`) qo'yilgan; `npm run gates` 12/12.
App.jsx ga ulangan — lokal serverda `http://127.0.0.1:5175/#/lesson/m11-03` va `…/m11-06` (server asosiy seansniki; ishga tushirmang, to'xtatmang).
`src/10-Modull` va boshqa modullarni boshqa seanslar tahrirlaydi — faqat o'qing.

## O'qish tartibi
1. `feedback/F-1007-13modul/QURUVCHI_SABOQ.md` — va u ko'rsatgan 9, 10, 11, **12**-Modul `QURUVCHI_SABOQ.md` lari TO'LIQ; fidbek rasmlaridan o'z ekran turingizga o'xshashlarini Read bilan.
2. `konveyer/2-QURUVCHI.md` (qoidalar, tartib, darvozalar, hisobot) + o'z darsi MD si (TO'LIQ, bir marta) + `00-MODUL-TAYANCH.md` (1.0, 1.4 va o'z darsingiz bo'limi; 2; 3; 8; 9-bo'limda o'z darsingiz raqami tilga olingan bandlar) + `00-TAQIQLAR.md` + o'z `NN-FILTR.md`.
3. Skelet `src/skelet/NamunaDars.jsx` (faylingiz — uning nusxasi) va `src/qolip/QOLIP.md`; karta `konveyer/QURISH_KARTASI.md` (U · K · J).
4. Namuna fayllari — faqat qanday yechilganini ko'rish uchun (grep / sed oraliq); kod bo'lagi ko'chirilmaydi.

## Darsga xos eslatmalar (to'liq ro'yxat — MD ning «KOD» bo'limi, band-band)

- **3-dars** (MD «KOD» 1–16; REPO — sizniki emas):
  - Bitta vizual `TolovSahna` (telefon CHAPDA, xizmat tuguni, Backend tuguni + mini-jadval `tolovlar`; konvert turlari `xabar` · `javob` · `sorov`) — manbalar `TOLOV_SAHNA`, `MASHQ_SAHIFA`, `NAMUNA_XABAR`, `MENTOR_SXEMA`, `ISHLASH_TARTIBI`, `XIZMAT_KARTALAR`.
    **Karta maydoni (raqam, muddat, CVV) hech bir holatda chizilmaydi**; mashq sahifasida kulrang «Test rejim: pul yechilmaydi»; summa yonida «Mentorning taxmini». Payme · Click · Stripe — nom o'z rangida, logotipsiz.
  - 7-ekran `QKod` → `HtmlCompiler`, uch fayl (`index.html`, `namuna.js` tayyor; `app.js` — o'quvchi). Skelet tuzog'i (MEXANIZM 11): kompilyator faqat birinchi JS faylni ulaydi, tekshiruv async ni kutmaydi —
    12-Modul `WebSocketBasicsLesson.jsx` yechimini ko'ring va haqiqiy kompilyatorda sinang (boshlang'ich kod 0 shart, namuna yechim hamma shart, noto'g'ri yechim yiqiladi); hisobotda qanday hal qilganingizni yozing.
    Starter matnida backtik yo'q; JS satrlarida apostrofli so'z yo'q; qatorlar ≤ 70 belgi (SABOQ 37).
  - 13-ekran `QMustaqil` — bitta katta karta ketma-ket (E 53), `pm-m11d3-oqim` (tayanch 8 aynan; `test` maydoni bor bo'lsa saqlanib qoladi).
  - 14-ekran — final `QTartib` (sentinel `0`, `scope: 'final'`). 15, 16-ekran — `ScreenBlok` + `QBlok` + `QPrompt`; A2 4-qadamida **tekshiruv kartasi** (3 ta, bittadan; «Kutilganidek» / «Boshqacha» → `pm-m11d3-oqim.test.{imzo,takror,rad}`);
    «Davom etish»: A1 — 3-qadamdan keyin, A2 — 2-qadamdan keyin (E 55); blok bayrog'i — faqat 4-qadam «Bajardim»idan; «Ortda qoldingizmi» — faqat A1 da (SABOQ 39).
  - `RECAPS` 5 (3, 5, 8, 10, 14), `Q_LABELS` shu kalitlar, nishon 4, arena 12 (✔ — MD dagi o'rinlar); kartochkalar alohida ekran (18); yakun — texnik standart, holatga qarab (MD).
  - Fayl katta (20 ekran): ekranma-ekran yozing, har 3–4 ekrandan keyin `esbuild`; turn tugab qolsa — to'xtab, nima qolganini hisobotda aniq yozing (chala ekranni «tayyor» demang).
- **6-dars** (MD «KOD» 1–14):
  - Bitta vizual `SuhbatVaraq` (rejimlar `telefon` · `sahna` · `varaq`); odamlar real ko'rinishda (SABOQ 36); belgi ranglari `ok` · `accent` · `ink2` (qizil yo'q); 393 da maket kesilmaydi (E 41).
  - 2-ekran: 6 karta ikki tugma («Savol» / «Sotish gapi»), bittadan; 4-ekran: 3 yozuv, to'rt belgi tugmasi; bashorat → yashil xulosa qutisining birinchi kichik qatori (E 42).
  - 6-ekran: `pm-m11d4-narx`, `pm-m11d2-model` (`kim`, `nima` — oldindan to'ldirish), `pm-m9d3-intervyu` dan o'qiydi; uch qism ketma-ket; tekshiruvlar **PM-108: kamida 10 namuna bilan `node` da** (MD dagi misollar) — natijasini hisobotga.
  - 7-ekran — rol o'yini: real suhbat **faqat sherikning o'z «Roziman» tugmasi bilan** (06-FILTR); «yo'q»da «O'tkazish»; yozuv `{ id, tur, kim, hozir, gap, javob, narxi, qachon }` (`qachon` — suhbat kuni, sukut — bugun; 09-FILTR 7);
    so'zma-so'z gapda ism va telefon — [ism], [telefon] (Yordamda qoida). Mentor rejimida gap, belgi, narx uzatilmaydi — faqat saqlash signallari (TAQIQLAR 3).
  - `RECAPS` {3, 5, 8}, `Q_LABELS` {3, 5, 8}, nishon 4, arena 12, kartochka 12 (alohida ekran); yakun — besh holat (MD), uyga vazifa `HwCard` (④ holatdan).

## Tekshiruv va hisobot
- `npm run gates -- <fayl>` **12/12** · `npm run lint:jsx` — o'z faylingiz bo'yicha 0 · `npm run -s lint:til -- <fayl>` 0 error · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` — faqat skelet klasslari.
- Surat: `SHOT_WAIT=1500 SHOT_H=773 node konveyer/vositalar/shots.mjs <fayl> <scratchpad>/<NN>-qurish/desk` (hamma ekran «xato: yo'q») va `SHOT_W=393 SHOT_H=844` bilan `…/mob`.
  Bitta ekran va bosishlar: `node konveyer/vositalar/ekran.mjs <fayl> <scratchpad>/<NN>-qurish/c "<ekran>:<selektor>|<selektor>*3"` (W/H — `SHOT_W`, `SHOT_H`).
  Kesik + ⛶ markazi + skrol + pageerror: `node feedback/F-1007-13modul/vositalar/kesik.mjs m11-NN src/11-Modull/<fayl> desk mob` (server 5175).
  Har suratni Read bilan ko'z bilan ko'ring; harakatli ekranlarda harakatdan OLDIN va KEYIN surati; ⛶ ni bosib kattalashganini ham.
- Vaqtinchalik fayllar — faqat scratchpad ichida `<NN>-qurish/` (ikkinchi agent scratchpad'ni baham ko'radi).
- Hisobot (`konveyer/2-QURUVCHI.md` shakli): ekranlar jadvali (qolip turi, «4/4») · KOD ro'yxati band-band · darvozalar aynan (buyruq va natija) · MD dan chetlashish (har biri sababi va SABOQ raqami bilan) va «MD ga taklif» ·
  qolip taklifi · RU-qarz · faylingizdan tashqari ishlar · surat yo'llari · **nimani tekshirmadingiz** (ochiq yozing).
- Turn-byudjeti: 3-dars ≤ 170, 6-dars ≤ 130; faylni qayta-qayta to'liq o'qimang (grep / sed oraliq). Savol bermang — ikkilansangiz MD ga eng yaqin yechim va hisobotda yozing.
