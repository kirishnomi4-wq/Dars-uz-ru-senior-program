# 13-Modul (kod: `src/11-Modull`) · 6-dars (PM) «Pul haqida qanday gaplashasiz?» — MD v3

Fayl: `src/11-Modull/PmMoneyTalkLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m11-06` · **12 ekran** (keyssiz PM shakli — tayanch 4) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Quruvchi qoidalari (12-Modul `QURUVCHI_SABOQ.md` A–E majburiy; E 40–55 qat'iy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q · keyingi bosiladigan joy doim ko'rinadi (har variantning o'z yengil chegarasi — E 40; bitta navbatdagi tugma — halqa) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi, natijada u yashil xulosa qutisining birinchi kichik qatori (E 42) · kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket, bir vaqtda bitta katta karta (E 53) · odamlar real ko'rinishda (SABOQ 36) ·
ekranda ≤ 3 blok · maketda hech narsa kesilmaydi (E 41) · yakun — E 50 standarti («Bugungi asosiy fikr» qutisi yakunda yo'q) · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **C** (`correctIdx 2`) · 5-ekran — **B** (`1`) · 8-ekran — **D** (`3`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 449–451, grep 07.10, DE-205): `m11-05` «Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz» → **`m11-06` «Pul haqida qanday gaplashasiz?»** (osti: «narx bo'yicha uchta real suhbat», `type: 'PM'`) → `m11-07` «Foydalanuvchiga shartlarni qanday ochiq aytasiz?».
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn (suhbat savollari va suhbat yozuvlari), mustaqil ish majburiy (6, 7-ekranlar). **Keyssiz** (tayanch 5, Qaror-0 21). **Kod ekrani yo'q** (tayanch 4: «6 — yo'q»). REPO yo'q (tayanch 3: `m13-dars-06-done` = `05-done`).
**Real odamlar va pul bilan ishlaydigan dars** — `00-TAQIQLAR.md` 1 (pul suhbati bosimsiz, real pul yo'q) va 3 (o'smir xavfsizligi) to'liq; 12-Modul tayanchi 1.6 (olti bandli ro'yxat) kuchda (Qaror-0 11).
Vaqt: ≈ 90 daqiqa (taqsimot — A-10; ⛔ reja, «qur» pilotida taymer bilan o'lchanadi).
Manba: `00-MODUL-TAYANCH.md` (1.0 — Pro, «Doimiy o'yin», kim to'laydi · 1.4 — Mentor narxi va to'lov taklifi ekrani · **1.6 — suhbat savollari, javob belgilari, uch suhbat, Mentor xulosasi, rol o'yini, real suhbatlar — AYNAN** · 1.13 — sonlar · 2 — atamalar · 4 — 6-dars qatori va keyssiz shakl · 7 — sinflar · 8 — `pm-m11d4-narx`, `pm-m9d3-intervyu`, `pm-m11d6-suhbat`) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 2, 3, 10, 11, 12, 21, 22, 23) · `00-TAQIQLAR.md` (0, 1, 3, 4, 5, 6, 7) · `00-NOMLAR.md` · 12-Modul tayanchi (1.6 — olti bandli ro'yxat; 9.38, 9.39 e) · 11-Modul tayanchi (1.3 — intervyu savollari, «Hozir nima bilan»; 8 — `pm-m9d3-intervyu`) ·
namunalar: 12-Modul `06-PmChannels-v3.md` + `06-FILTR.md` (juftlik va yakka rejim, real odamlar xavfsizligi) · 11-Modul `03-PmInterviewsOne-v3.md` + `03-FILTR.md` (savollar shabloni, haqiqiy va mashq yozuvi) · 12-Modul `11-PmPitchReview-v3.md` + `11-FILTR.md` (12 ekranli keyssiz shakl).
⚠️ Modul raqami o'quvchi matnida — LMS raqami: «11-Modulda» (intervyular; kod `9-Modull`), «9-Modulda» (kod `7-Modull`), «4-darsda» (shu modul). Kod raqami faqat fayl yo'lida.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi** (dastur: «To'lashni qanday taklif qilish; skript, mentor bilan rol o'yini → narx bo'yicha 3 real suhbat»; tayanch 4: «suhbat savollari; rol o'yini; narx bo'yicha real suhbatlar yozuvi (darsda va uyda — 3 tagacha)»; Qaror-0 2, 11):
   o'quvchi Mentorning to'rt savolini o'z mahsulotiga moslab **o'z suhbat savollarini** yozadi (6-ekran) — narx 4-darsdagi kalitidan (`pm-m11d4-narx`), yo'q bo'lsa o'zi yozadi;
   sherigi bilan **rol o'yini** o'tkazadi: so'raydi, javobni **so'zma-so'z** yozadi, **javob belgisi**ni qo'yadi, keyin almashadi (7-ekran). Sherik haqiqatan o'quvchi mahsulotida to'laydigan rolda bo'lsa va o'zi uchun javob berishga rozi bo'lsa — darsdagi suhbat **real** (bittagacha; rozilikni sherikning o'zi bosadi), aks holda — **mashq** (`tur: 'mashq'`; F-1007-464).
   Uyda — keyingi darsgacha tanish odamlar bilan **uchtagacha real suhbat** (darsdagi real suhbat ham kiradi). Saqlanadi `pm-m11d6-suhbat` (9, 11-darslar o'qiydi).
   Natija besh holatda bo'lishi mumkin (11-ekran sarlavhasi shunga qarab): suhbat savollari + real suhbat · suhbat savollari + mashq yozuvi · suhbat savollari, yozuvsiz · suhbat savollari tugamagan · suhbat savollari yozilmagan. ✓ va nishon — birinchi ikki holatda.
   Bugun hech kimdan pul olinmaydi, hech narsa sotilmaydi va hech kimga to'lov sahifasi yuborilmaydi (TAQIQLAR 1). Keyingi darslar (yozma tasdiq, hujjatlar) ekranda va'da qilinmaydi (T-038).
2. **Bugungi asosiy fikr (P-013 — darsning ichki o'qi; yakunda ko'rsatilmaydi, SABOQ E 50):** Suhbat — sotish emas, savol: odamning gapi so'zma-so'z yoziladi va narx haqida dalil bo'ladi, isbot emas. (105)
3. **O'tilgan — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - 13-Modul 1, 2, 4-darslar: **narx** — «odam to'laydigan pul» (4-dars; o'quvchida — o'z taxmini) · **Pro** · **«Doimiy o'yin»** · **pullik obuna** (doim ikki so'z; bu darsda faqat A-6 da) · **to'lov taklifi ekrani** — 4-darsdagi ekran (sarlavha, matn, narx, «To'lovga o'tish») · **test rejim** — «Test rejim: pul yechilmaydi» qatori.
   - 9 va 11-Modul: **intervyu** — «bitta odam bilan suhbat» (9-Modul) · 11-Modul 3-darsi: «Hozir buni nima bilan hal qilyapsiz?» savoli («Hozir nima bilan» qatori), javob **u aytganidek, o'sha zahoti** yoziladi, g'oya faqat oxirgi savolda aytiladi, sherik g'oya auditoriyasidan bo'lmasa — **mashq yozuvi**.
   - 12-Modul: **dalil** — «da'voni ko'rsatadigan son yoki yozuv» (11-dars; intervyu va sinov yozuvlaridan — son ham, yozuv ham) · **olti bandli ro'yxat** (6-dars, bitta manba `XAVFSIZLIK`) · kichik son — «… dalil, isbot emas» shakli.
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **suhbat** (narx haqida; tayanch 2: «narx haqida real odam bilan savol-javob; sotish emas») — 2-ekran xulosasida, olti gap ajratilgandan keyin: «Bu darsda suhbat — sotish emas, savol: avval odamning hozirgi ishi so'raladi, keyin narx.»
     O'quvchi matnida ta'rif shu bitta shaklda (T-042): 2-ekran xulosasi = yakun 1-qatori = kartochka 1 javobi; tayanch 2 dagi «real odam bilan» — kartochka 1 izohida va arena 1 da.
     9-Moduldagi «intervyu — bitta odam bilan suhbat» bilan ko'prik (T-052): narx haqidagi suhbat — o'sha intervyu kabi, faqat oxirida narx aytiladi (2-ekran O'qituvchi eslatmasi, kartochka 1 izohi).
   - **suhbat savollari** — «Suhbat savollari — har odamga bir xil tartibda beriladigan asosiy savollar.» (2-ekran `QIzoh`; F-1007-464: «so'zma-so'z» — faqat javob uchun; odam tushunmasa, savol bir marta qisqa aniqlashtiriladi, narx o'zgarmaydi). GATE M M-q2 A (07.10): «skript» o'rniga (9-Modulda «Umami skripti» — kod ma'nosida); kalit maydoni `skript` va `MENTOR_SKRIPT` — ichki.
   - **so'zma-so'z** — odam qanday aytgan bo'lsa, shunday (4-ekran Mentori: «intervyudagidek» — 9, 11-Moduldagi «u aytganidek» bilan bir gapda tenglashadi; kartochka 6 izohi).
   - **javob belgisi** — **ha** · **qimmat** · **yo'q** · **javob yo'q** (tayanch 1.6; tartib o'zgarmaydi). 4-ekranda Mentor yozuvlariga qo'yiladi; «javob yo'q» — belgi tugmalari ostidagi doimiy qator «Javob yo'q — odam javob bermasa.» Kalitda: `'ha' | 'qimmat' | 'yoq' | 'javobsiz'`.
   - **rol o'yini** (tayanch 1.6) — sherik auditoriya rolini o'ynab javob beradi; yozuvi — **mashq**, uchta real suhbatga kirmaydi. **real suhbat** — odam haqiqatan to'laydigan rolda va o'zi uchun javob beradi (7-ekran `QIzoh`).
   - **kichik son** — Mentor xulosasi «Uch suhbat — kichik son: narx haqida dalil, isbot emas.» (tayanch 1.6; 4-ekran). Nimaning isboti emasligi (sinf 5) — «narx to'g'ri ekanining isboti emas» (kartochka 10, yakun).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«suhbat»** — faqat narx haqidagi savol-javob, real odam bilan; sherik bilan mashq — **«rol o'yini»**; uning natijasi — **«mashq yozuvi»**. **«intervyu»** — faqat 9, 11-Moduldagi ish (ko'prik).
   - **«sotish»** — faqat ta'rifda («sotish emas») va tugma yorlig'ida «Sotish gapi». «ko'ndirmang» — faqat fe'l bo'lib (Yordam, uyga vazifa ②). «sotuv», «skript-sotuv», «taklif qilish» (suhbat ma'nosida) — yo'q; «taklif» so'zi faqat «to'lov taklifi ekrani» atamasida.
   - **«belgi»** — faqat javob belgisi; 11-Moduldagi «harakat belgisi» bu darsda yo'q; ✓ / ✕ «belgi» deb atalmaydi.
   - **«yozuv»** — bitta suhbat yoki rol o'yinining yozib olingani (kim · gap · belgi · narx); **«Yozuvlarim»** — o'quvchi yozuvlari ro'yxati: real suhbatlar va mashq yozuvi (varaq bo'limi nomi; F-1007-464 — «Suhbatlarim» ichida mashq ham turardi).
   - **«narx»** — odam to'laydigan pul (4-dars); **«qimmat»** — faqat javob belgisi; Mentor narxi — «Mentorning taxmini» (tayanch 1.4).
   - **«tanish»** — o'quvchi biladigan odam (11-Modulda intervyu bergan, sinfdosh, ota-ona, mahalla guruhidagi tanish); juftligi — **«notanish»**.
   - **«to'laydigan odam»** — mahsulotda pul to'lashi mumkin bo'lgan rol (Mentor misolida — tashkilotchi; o'yinchilar bepul — tayanch 1.0). O'quvchi kalitida — **«kim»** (rol, ism emas).
   - **«tekshir-»** — 1-ekranda narx taxmini haqida (tayanch 1.4 so'zi: «Narx 6-darsdagi suhbatlarda tekshiriladi») va test ekranlari eyebrow'ida «Tekshiruv» (kurs naqshi). **«sinov»** — bu darsda yo'q.
   - **Ishlatilmaydi:** skript (M-q2 A), sotuv, ko'ndirish (ot), predzakaz, oldindan to'lov, **tasdiq** (9-dars so'zi — bugun yo'q), harakat belgisi, respondent, anketa, so'rovnoma, hodisa, xabar (Telegram xabari ma'nosida), spam, user, CAC, LTV, paywall, «Modul 13», pilot, keys, daftar.
6. **Mentor misoli (tayanch 1.0, 1.4, 1.6 — AYNAN; o'quvchi matnida «Mentor misolida»):**
   - **Kim to'laydi (1.0):** Pro — tashkilotchi uchun 30 kunlik pullik obuna, bitta qulaylik «Doimiy o'yin»; o'yinchilar uchun hamma narsa bepul. Shuning uchun Mentor tashkilotchilar bilan gaplashadi.
   - **Mentor narxi (1.4, «Mentorning taxmini»):** 30 kun — 15 000 so'm. **To'lov taklifi ekrani (1.4 so'zma-so'z; `MENTOR_EKRAN`):** sarlavha «Doimiy o'yin — Pro'da» · matn «Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.» · narx «30 kun — 15 000 so'm» · tugma «To'lovga o'tish» · pastda kulrang «Test rejim: pul yechilmaydi».
   - **Mentorning suhbat savollari (1.6 so'zma-so'z; `MENTOR_SKRIPT`):** 1) «Hozir o'yinni qanday yig'asiz va bunga haftada qancha vaqt ketadi?» · 2) «Bunga hozir pul sarflaysizmi — nimaga?» ·
     3) «"Doimiy o'yin" 30 kunga 15 000 so'm bo'lsa — olarmidingiz? Nega?» · 4) (javob «yo'q» yoki «qimmat» bo'lsa) «Qancha bo'lsa olardingiz?». Javob so'zma-so'z yoziladi; Mentor ko'ndirmaydi, «o'ylab ko'ring» demaydi.
   - **Uch suhbat (1.6 so'zma-so'z; `MENTOR_SUHBAT`)** — mahalla futbol guruhi tashkilotchilari, guruh egasining ruxsati bilan, tartib raqami bilan, ismsiz:

| Kim | Gap (so'zma-so'z) | Belgi | Narx |
|---|---|---|---|
| 1-tashkilotchi | «Har hafta guruhga o'zim yozaman. O'zi e'lon qilsa — 15 000 ga olaman.» | ha | 15 000 |
| 2-tashkilotchi | «Telegram guruhi tekin-ku, pul to'lamayman.» | yo'q | — |
| 3-tashkilotchi | «15 000 qimmat. 10 000 bo'lsa olardim.» | qimmat | 10 000 |

   - **Mentor xulosasi (1.6 so'zma-so'z):** «Uch suhbat — kichik son: narx haqida dalil, isbot emas. Narx hozircha qoladi, "qimmat" javobi yozib qo'yildi.» (4-ekranda ikkiga bo'linadi: birinchi gap — `QIzoh`, ikkinchisi — varaq ostidagi Mentor yozuvi.)
   - **Sotish gaplari (2-ekran anti-namunasi; `SOTISH_GAPLAR` — Mentor ularni aytmaydi):** «"Doimiy o'yin" juda qulay — hozir olmasangiz, keyin qimmatlashadi.» · «Boshqa tashkilotchilar ham oldi — siz ham yaxshilab o'ylab ko'ring.»
     Iboralar TAQIQLAR 1 va tayanch 1.6 dan («hozir olmasangiz qimmatlashadi», «hamma oldi», «o'ylab ko'ring») — ikkalasi ham Mentor misolida yolg'on (narx oshmaydi, hech kim olmagan) va ekranda «Mentor bunday demaydi» qatoriga tushadi (TAYANCHGA SAVOL 5).
7. **Raqamlar (faqat tayanch 1.0, 1.4, 1.6, 1.13; «Mentor misolida» / «Mentorning taxmini»):** 30 kun — 15 000 so'm · uch suhbat: ha (15 000) · yo'q · qimmat (10 000) · 1, 2, 3-tashkilotchi — tartib raqami.
   Boshqa son yo'q: tashkilotchilar soni (6) va keyingi darslarning sonlari bu darsda aytilmaydi (sinf 12 — keyingi dars sonlari oldindan ochilmaydi). Testlardagi ikkinchi misolda son yo'q (arena 5 — «yarim narx» so'zi bilan).
8. **Ikkinchi misol faqat testda (P-002), o'smir olamidan:** kitob almashish ilovasi (3, 5-ekran; 12-Modul testlari olami) · umumiy «tanishingiz» (8-ekran, arena). Metafora yo'q. Keys yo'q.
9. **Real odamlar va pul chegarasi (TAQIQLAR 1, 3; Qaror-0 11; tayanch 1.6):**
   - kim bilan: faqat tanish — 11-Modulda intervyu bergan odamlar, sinfdosh, ota-ona, mahalla guruhidagi tanish (guruh egasining ruxsati bilan); notanishga yozilmaydi; uchrashuv taklifi kelsa — faqat kattalar bilan; uydagi suhbatlar — ota-onaga aytib;
   - darsda: rol o'yini (sherik bilan) va imkon bo'lsa bitta real suhbat — sherik haqiqatan o'quvchi mahsulotida to'laydigan rolda bo'lsa (o'xshash emas) va o'zi rozi bo'lsa («Roziman» ni o'zi bosadi); real suhbat ixtiyoriy; qolgani — uyda;
   - tanishlar orasida to'laydigan rol bo'lmasa — real suhbat 0, bu ham halol natija; shu rolga o'xshash tanish bilan suhbat — mashq (F-1007-464);
   - suhbat — savol: ko'ndirish, «hozir olmasangiz…», «hamma oldi», «o'ylab ko'ring» yo'q; «yo'q» ham natija;
   - **real pul yo'q:** suhbatda pul olinmaydi — odam «ha» desa ham; to'lov sahifasi va «mashq to'lov» havolasi odamlarga berilmaydi (TAQIQLAR 1; SU-q1 A ruhida — TAYANCHGA SAVOL 11);
   - yozuvda va kalitda: rol (ism emas) — ism, familiya, telefon, Telegram nomi, maktab raqami yo'q; sherik ismi hech qayerga yozilmaydi;
   - sinfda kim nechta suhbat qilgani va kim «ha» deganini qo'l ko'tartirib sanash yo'q (12-Modul 9.39 e); Mentor ekranida belgilar va gaplar ko'rsatilmaydi — faqat «Yozuv saqladi» signali;
   - 12-Modul olti bandli ro'yxati (`XAVFSIZLIK`) kuchda — mahalla guruhi orqali yozilsa (7-ekran Yordami, uyga vazifa ①).
10. **Vaqt (≈ 90 daqiqa; ⛔ reja — «qur» pilotida taymer bilan, o'lchanmaguncha da'vo emas):** kirish va reja (0–1) ≈ 5 · savol yoki sotish gapi va 1-savol (2–3) ≈ 11 · uch suhbat va 2-savol (4–5) ≈ 10 · suhbat savollari (6) ≈ 12 ·
    rol o'yini (7) ≈ 25 (Mentor ko'rsatishi ≈ 3 · juftlikda har yo'nalish ≈ 6 · almashish va saqlash ≈ 4 · real suhbat — imkon bo'lsa ≈ 6) · yakuniy savol, podium, kartochkalar, arena (8–11) ≈ 22 · zaxira ≈ 5.
    **Ulgurmagan o'quvchi yo'li:** 7-ekranda bitta yozuv (mashq) yetadi, almashish — sherikning ekranida · real suhbat — uyda · 6-ekran tugamasa — yakun «Suhbat savollari hali tugamagan», uyga vazifa ④ · jonli darsda Mentor 6, 7-ekranlarni `optionalLive` bilan o'tkazadi. Tashqi kutish yo'q (repo, build, xizmat yo'q).
11. **Saqlash kalitlari (tayanch 8; pilot kaliti — shu holicha majburiy):**
    - **o'qiydi:** `pm-m11d4-narx` (`narx`, `davrKun`, `ekran.sarlavha`, `ekran.matn`, `ekran.tugma`) — 0, 6-ekranlar · `pm-m11d2-model` (`kim`, `nima`) — 6-ekranda oldindan to'ldirish, tahrirlanadi (F-1007-464) · `pm-m9d3-intervyu` (`yozuvlar[].kim`, `goyalar[].kim` — faqat rol) — 6-ekranning kulrang qatori.
      Yo'q bo'lsa: narx — o'quvchi o'zi yozadi (0-ekranda Mentor misoli ko'rinadi); intervyu qatori — ko'rinmaydi; `kim`, `nima` — bo'sh.
    - **yozadi:** `pm-m11d6-suhbat` = `{ skript: [4], suhbatlar: [{ id, tur: 'real' | 'mashq', kim, hozir: string | null, gap, javob: 'ha' | 'qimmat' | 'yoq' | 'javobsiz', narxi: n | null, qachon }] (real 0–3 + mashq 0–1), xulosa: string | null, savedAt }` (tayanch 8, 9.10 aynan; `hozir` — 1, 2-savol javobi qisqa, ≤ 80: 7-ekranda yoziladi, bo'sh qolsa `null`; uy suhbatlarida — 9-darsda; F-1007-464). Maydonlar shartnomasi:
      `skript` — to'rt savolning to'liq matni (o'quvchi to'ldirgan; tartib o'zgarmaydi) · `id` — `s1`, `s2`… (barqaror, tartib o'zgarmaydi) · `tur` — `real` (sherik o'zi uchun javob berdi) yoki `mashq` (rol o'yini) ·
      `kim` — rol, ism emas: mashqda «{rol}», realda «{rol} (sinfdosh)» (PM-018 shakli) · `gap` — odamning narx haqidagi gapi so'zma-so'z (3-savol javobi; 4-savol berilgan bo'lsa — uning javobi ham, bo'sh joy bilan; «javob yo'q»da bo'sh satr) · `javob` — belgi ·
      `narxi` — «ha»da suhbat savollaridagi narx · «qimmat» yoki «yo'q»da 4-savolda aytilgan son (aytilmagan yoki 4-savol o'tkazilgan bo'lsa `null`) · «javob yo'q»da `null` · `qachon` — suhbat bo'lgan kun `YYYY-MM-DD` (darsda — bugun; uy suhbatida — o'quvchi tanlaydi; F-1007-467) ·
      `xulosa` — bu darsda `null` (darsdagi yozuvlar — mashq yoki bitta real; xulosani kim va qachon yozishi — TAYANCHGA SAVOL 10) · `savedAt` — har saqlashda yangilanadi. 6-ekran `skript` ni, 7-ekran `suhbatlar` ni yozadi — bitta kalit, qo'shib saqlanadi.
      Darsda yozuvlar ≤ 2 (bitta mashq, bitta real) — «real 0–3 + mashq 0–1» ichida; uy suhbatlari 9-darsda kiritiladi (tayanch 9.10). Kalitga ism, login, telefon, Telegram nomi yozilmaydi. Kod qoralamasi kaliti yo'q (kod ekrani yo'q).
12. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › ✎ — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q («har doim», «hech qachon», «darrov», «albatta», «100%»); belgi-formula (→, ×, =) o'quvchi izohida yo'q.
13. **Kod ekrani yo'q** (tayanch 4: PM darslarida mexanika ketma-ket takrorlanmaydi — 4 — bloklar · 6 — yo'q · 7 — bloklar). **Trek:** PM darsi, blok yo'q — ikkala trekka bir xil; sarlavha va savollarda «mahsulotingiz» (sinf 11).

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.4, 1.5):** 4-darsda narx uch usul bilan chiqarildi va to'lov taklifi ekrani qo'yildi, 5-darsda to'lov oqimi buzib tekshirildi. Narx hozircha taxmin — tayanch 1.4: «Narx 6-darsdagi suhbatlarda tekshiriladi». Bugun — o'sha narxni to'laydigan odamlarning o'z gapi.
- **Dars ipi:** 0 — telefonda 4-darsdagi to'lov taklifi ekrani: narxni aytsangiz, odam nima deydi? (ballsiz) → 2 — Mentor tashkilotchiga aytsa bo'ladigan oltita gap: savol yoki sotish gapi — Mentorning suhbat savollari yig'iladi (atamalar «suhbat», «suhbat savollari») → 3 — test: suhbat nimadan boshlanadi →
  4 — Mentorning uch suhbati: har javobga belgi, «yo'q» ham natija, kichik son → 5 — test: «pul bermayman» javobi qanday yoziladi → 6 — o'z suhbat savollaringiz → 7 — sherik bilan rol o'yini (sherik to'laydigan odam bo'lsa — real suhbat) →
  8 — yakuniy: uchta «olaman» nimani ko'rsatadi → podium → kartochkalar → yakun (holatga qarab); uyda — tanish odamlar bilan uchtagacha real suhbat.
- **Bitta vizual — «Suhbat varag'i» (`SuhbatVaraq`, dars bo'yi; 163/180; bitta manba `MENTOR_EKRAN` + `MENTOR_SKRIPT` + `MENTOR_SUHBAT` + o'quvchi ma'lumoti `pm-m11d4-narx`, `pm-m11d6-suhbat`):**
  - **telefon** (chapda, ≈170×272 — SABOQ 22; 0, 6-ekran): to'lov taklifi ekrani — o'quvchiniki (`pm-m11d4-narx`) yoki Mentorniki; pastda doim kulrang «Test rejim: pul yechilmaydi» (TAQIQLAR 1). Mentorniki bo'lsa — tepada «Maydon Jamoa» o'z yashil rangida (11-Modul 9.62), logotipsiz.
  - **sahna** (chapda; 2, 4, 7-ekran): ikki odam real ko'rinishda (SABOQ 36: bosh, soch, yuz belgisi, rangli kiyim, iliq ranglar, qo'lida telefon). Chapdagisi savol beradi (2, 4: «Mentor»; 7: «Siz»), o'ngdagisi javob beradi (2: «tashkilotchi»; 4: «1-tashkilotchi» → «2-…» → «3-…»; 7: «Sherigingiz» + rol yorlig'i).
    Har odam ustida pufak: savol — chapdagidan, javob — o'ngdagidan. Joy (hovli, maktab) chizilmaydi (TAYANCHGA SAVOL 16).
  - **varaq** (o'ngda; 1, 2, 4, 6, 7-ekran): sarlavha «Mentor misoli · Maydon Jamoa» (nom o'z yashil rangida) → 6, 7-ekranlarda «Suhbat savollarim» / «Yozuvlarim». Ikki bo'lim: **Savollar** — to'rt raqamli savol (4-savol ostida kulrang shart «javob «yo'q» yoki «qimmat» bo'lsa») ·
    **Suhbatlar** — jadval: kim · gap · belgi · narx. Belgi katagi rangi: ha — `ok`, qimmat — `accent`, yo'q va javob yo'q — kulrang `ink2` (qizil yo'q — «yo'q» xato emas).
  - Ishlatiladi: 0 (telefon + javob pufagi) · 1 (varaq skeleti) · 2 (sahna + varaq «Savollar») · 3, 5, 8 (javobdan keyin kichik varaq) · 4 (sahna + varaq «Suhbatlar») · 6 (telefon + karta + varaq «Suhbat savollarim») · 7 (sahna + karta + «Yozuvlarim»).
  - `prefers-reduced-motion` da uchish va to'lqin yo'q — yakuniy holat birdan qo'yiladi. 393 kenglikda sahna yoki telefon varaq ustida, o'lchami kichraymaydi; hech narsa kesilmaydi (E 41). Vizual ⛶ ichida (q17, E 48).
- **Keyingi bosiladigan joy (E 40, qat'iy):** har bosiladigan variant va tugmaning o'z yengil accent chegarasi, yengil to'lqin navbatma-navbat 2 marta, kattalashishsiz; bitta navbatdagi tugma — halqa, to'lqin 3 marta, `scale` yo'q. `prefers-reduced-motion` da to'lqin yo'q, chegara qoladi.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → gap pufakdan varaqqa uchadi, belgi katakka tushadi, son gapdan narx katagiga sirg'aladi · yangi qator ~1 s yashil yonadi · hisoblagich sanab o'sadi. Bezak-harakat yo'q.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Pul haqida qanday gaplashasiz?** (30) — dars nomi (DE-205)
- Mentor: Narxni 4-darsda o'zingiz belgiladingiz. To'laydigan odamga aytsangiz, u nima deydi?
  (`pm-m11d4-narx` yo'q yoki `narx` bo'sh bo'lsa — Mentor: Mentorning taxmini: Pro 30 kunga 15 000 so'm. Buni tashkilotchiga aytsangiz, u nima deydi?)
- Maket (chap; `SuhbatVaraq` telefon holati): o'quvchining to'lov taklifi ekrani — `ekran.sarlavha` · `ekran.matn` · narx qatori «{davrKun} kun — {narx} so'm» (`davrKun` bo'sh bo'lsa «{narx} so'm») · tugma `{ekran.tugma}` · pastda kulrang «Test rejim: pul yechilmaydi»; ramka ustida yorliq «4-darsdagi ekraningiz».
  Kalit yo'q bo'lsa — Mentor ekrani (A-6 so'zma-so'z), ramka ustida yorliq «Mentor misoli · Maydon Jamoa», narx qatori yonida kulrang «Mentorning taxmini». Telefon ostida — «tashkilotchi» yorlig'i va bo'sh pufak «…» (odam figurasi yo'q — F-1007-473; maket ustuni o'z kengligida, variantlar uning yonida, orada bo'shliq yo'q).
- Variantlar (radio, o'ng; bir uzunlikda — P-016):
  - «Ha, olaman» deydi (18)
  - «Qimmat ekan» deydi (19)
  - «Kerak emas» deydi (18)
- Javob (uchalasida bir xil, maqtovsiz — J-026, KORPUS §119): Uchalasi ham bo'lishi mumkin — oldindan bilib bo'lmaydi. Buni odamning o'zidan so'raysiz va gapini yozib olasiz. (112)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent chegara bilan qotadi; odam pufagida «…» o'rniga uch javob navbat bilan bir lahza ko'rinadi va oxirida pufakda «?» qoladi — qaysi biri bo'lishi ochilmaydi (P-036); telefondagi narx qatori bir lahza accent bilan yonadi.
  Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni; ism yo'q).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: uch variant (har birining yengil chegarasi, navbatma-navbat to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: Javoblarni muhokama qilmang — bugun ularni odamning o'zidan eshitish yo'lini ko'rasiz. 4-darsda narxi saqlanmagan o'quvchi Mentor misolini ko'radi; narxini 6-ekranda o'zi yozadi.
✎ Hook — o'quvchi o'zi qilgan ish (4-darsdagi narx va ekran) va o'z savoli (P-016). Uch variant — tayanch 1.6 dagi uch javob turi (ha · qimmat · yo'q) oddiy so'z bilan; payoff hech birini rad etmaydi (KORPUS §119). «Javob yo'q» — 4-ekranda, belgi tugmalari ostidagi izoh bilan.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun narx haqida savol berishni o'rganasiz.** (44)
- Mentor: Narxingiz hozircha taxmin — uni odamlarning o'z gapi bilan tekshirasiz. Avval sherigingiz bilan mashq qilasiz.
- Chap — yorliq «Narx bo'yicha uchta real suhbat» (App.jsx osti so'zma-so'z, P-015) + ostida kulrang qator: Darsda — suhbat savollari va mashq; suhbatlar — darsda va uyda, uchtagacha. (75)
  Vizual: `SuhbatVaraq` varaq o'zi yuradi (DE-200) — «Savollar» bo'limida to'rtta raqamli bo'sh uzuq qator (o'quvchi 6-ekranda to'ldiradi — U-041), «Yozuvlarim · real 0 / 3» bo'limida ustun nomlari «kim · gap · belgi · narx» va uchta bo'sh uzuq qator navbat bilan chiziladi.
  Savol matni yo'q — 2-ekran kashfiyotini ochmaydi (P-036); ustun nomlari — haqiqiy mazmun (SABOQ 33).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Narxni suhbatning qayerida aytishni bilasiz · `suhbat`
  - 02 · Odamning javobini so'zma-so'z yozasiz · `ha · qimmat · yo'q`
  - 03 · O'z narxingiz uchun savollar yozasiz · `suhbat savollari`
  - 04 · Sherigingiz bilan rol o'yinida mashq qilasiz · `rol o'yini`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: Menyu ostidagi «uchta real suhbat» — dastur natijasi: darsda — suhbat savollari, rol o'yini va imkon bo'lsa bitta real suhbat; qolgani uyda (Qaror-0 11). Darsda hech kim pul olmaydi va hech narsa sotmaydi.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011); «suhbat», «suhbat savollari», «rol o'yini» — faqat kulrang teglarda (P-015). Chap yorliq App.jsx ostini so'zma-so'z beradi, ostidagi kulrang qator uni darsdagi haqiqatga chegaralaydi (11-Modul 03-FILTR 1 sinfi: menyu osti darsda bo'lmaydigan sonni va'da qilmasin).

## 2 · Savol yoki sotish gapi  ← QTushuncha (markaziy; ketma-ket 6 karta — SABOQ 9/13, E 53)
- Eyebrow: Tushuncha · suhbat
- Sarlavha: **Mentor tashkilotchiga qaysi gaplarni aytadi?** (44)
- Mentor: Mentor misolida Pro tashkilotchi uchun, o'yinchilar bepul — har gapga mos tugmani bosing.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 zinapoya): **Mentor hozir 6 gap aytadi — nechtasi savol bo'ladi?** (F-1007-474: gaplar hali ekranda yo'q, shuning uchun savol «hozir keladi» deb aytadi; sahna ustida «6 gap» va 1…6 katakcha — kelgani yashil, joriysi accent) · 2 · 3 · 4 — tanlangach yopilmaydi: ixcham qator «Taxminingiz: N» natijagacha turadi; tugmalar shundan keyin yoqiladi.
- Vizual (≤ 3 blok: sahna · varaq · tugmalar qatori): **chapda** — sahna (Mentor va tashkilotchi; ular orasida joriy gap kartasi «Gap n / 6», kulrang — hali hech kim aytmagan) · **o'ngda** — varaq «Mentor misoli · Maydon Jamoa»: **Savollar** bo'limi — to'rtta raqamli bo'sh uzuq uya; ostida kulrang qator «Mentor bunday demaydi · 0» ·
  **varaq ostida** — ikki tugma: «Savol» · «Sotish gapi».
- Kartalar (navbat bilan; 1, 3, 4, 6 — Mentorning suhbat savollari, tayanch 1.6 so'zma-so'z; 2, 5 — sotish gaplari, A-6):
  1. «Hozir o'yinni qanday yig'asiz va bunga haftada qancha vaqt ketadi?» ✔ Savol → varaqning 1-uyasiga
  2. «"Doimiy o'yin" juda qulay — hozir olmasangiz, keyin qimmatlashadi.» ✔ Sotish gapi
  3. «Bunga hozir pul sarflaysizmi — nimaga?» ✔ Savol → 2-uya
  4. «"Doimiy o'yin" 30 kunga 15 000 so'm bo'lsa — olarmidingiz? Nega?» ✔ Savol → 3-uya (uya ostida kulrang yorliq «narx — Mentorning taxmini»); `QIzoh` (~4 s): Narx aytildi, lekin bu ham savol: oxirida «Nega?». Javobi — so'z, hali to'lov emas. (83)
  5. «Boshqa tashkilotchilar ham oldi — siz ham yaxshilab o'ylab ko'ring.» ✔ Sotish gapi
  6. «Qancha bo'lsa olardingiz?» ✔ Savol → 4-uya; uya ostida kulrang shart: javob «yo'q» yoki «qimmat» bo'lsa
- **Harakat → Vizual o'zgarish:** tugmani bosish → to'g'ri bo'lsa: «Savol» — gap kartadan Mentor pufagiga, so'ng varaqdagi navbatdagi uyaga uchadi (~1 s yashil), tashkilotchi pufagida «…» (endi u gapiradi — javob ochilmaydi);
  «Sotish gapi» — kartadagi gap ustidan chiziq tortiladi, gap Mentor pufagiga kirmaydi — xiralashib «Mentor bunday demaydi · n» qatoriga yig'iladi. Joriy karta keyingisiga almashadi.
  Xato → tugma silkinadi, gap kartasi bir lahza `err` fon, bitta `QXato` (≤60; javobni aytmaydi):
  - 1-gap, «Sotish gapi»: Bu gap tashkilotchidan nimani so'rayapti — qarang. (50)
  - 2-gap, «Savol»: Bu gap odamdan biror narsa so'rayaptimi? (40)
  - 3-gap, «Sotish gapi»: Bu gap odamni olishga undayaptimi? (34)
  - 4-gap, «Sotish gapi»: Gap oxiriga qarang: endi kim gapiradi? (38)
  - 5-gap, «Savol»: Bu gap odamdan so'rayaptimi yoki undayaptimi? (45)
  - 6-gap, «Sotish gapi»: Bu gapga kim javob beradi — qarang. (35)
- Natija (bitta blok — E 42; `tugadi`: tugmalar yopiladi, sahna yig'iladi, varaq butun enga, ⛶ ichida — q17/q18): yashil xulosa qutisi — birinchi kichik qator taxmin: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: 4»;
  varaq sarlavhasi «Mentorning suhbat savollari» bo'ladi (harflar almashadi): to'rt savol tartib bilan, ostida «Mentor bunday demaydi · 2».
- Xulosa: Bu darsda suhbat — sotish emas, savol: avval odamning hozirgi ishi so'raladi, keyin narx. (89) — atama «suhbat» shu yerda tug'iladi (T-011)
- `QIzoh` (qutining oxirgi kichik qatori — E 42): Suhbat savollari — har odamga bir xil tartibda beriladigan asosiy savollar. (75) — atama «suhbat savollari»
- Tugma (pastki): Avval belgilang → Gaplarni ajrating (N/6) → Davom etish
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Gap odamdan nimadir so'rayaptimi yoki uni olishga undayaptimi? (62)
- Keyingi bosiladigan joy: bashorat variantlari → ikki tugma (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Just Ask! (olti gap birinchi urinishda).
- O'qituvchi eslatmasi: Mentor misolida Pro — tashkilotchi uchun, o'yinchilar bepul (tayanch 1.0): shuning uchun suhbat tashkilotchilar bilan. 4-gapda narx aytiladi, lekin u ham savol — oxirida «Nega?», keyin odam o'zi gapiradi.
  9-Modulda intervyu — bitta odam bilan suhbat edi; 11-Modulda g'oyani faqat oxirgi savolda aytgansiz. Narx haqidagi suhbat ham shunday: avval odamning hozirgi ishi, narx keyin.
  Sotish gaplari — Mentor aytmaydigan gaplar: «hozir olmasangiz…» — soxta shoshilinch, «boshqalar ham oldi» — Mentor misolida hech kim olmagan. Sinfga savol: «Sizga kimdir biror narsani «hozir olmasangiz, qimmatlashadi» deb sotishga uringanmi?»
  Mahsulotni tushuntirish yomon emas: bu suhbatda avval odamning narx haqidagi fikri eshitiladi, shuning uchun ko'ndirilmaydi (F-1007-464).
✎ Kartalar tartibi — suhbat savollari tartibi (1, 3, 4, 6), orasida ikki sotish gapi. Ikki sotish gapi — ikki xil bosim: soxta shoshilinch (2) va «hamma oldi» + «o'ylab ko'ring» (5) — TAQIQLAR 1 va tayanch 1.6 so'zlari.

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: Tekshiruv · suhbat (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Kitob almashish ilovangiz haqida sinfdoshingiz bilan gaplashasiz. Avval nima qilasiz?** (10 so'z)
  - A — Ilovaning narxini birinchi bo'lib aytaman (41)
  - B — Ilovaning hamma imkoniyatini ko'rsataman (40)
  - ✔ C — Hozir kitobni qanday topishini so'rayman (40)
  - D — Sinfdoshlar ham olganini aytib beraman (38)
- Kalit: **C** (index 2). To'rttalasi bir shaklda (birinchi shaxs fe'li bilan tugaydi); uzunlik — «O'lchov»; to'g'ri javob yolg'iz eng uzun emas; variantda savoldagi so'z takrorlanmaydi (S-008).
  Distraktorlar uch xil (12-Modul 9.44 f): A — tartib (narx avval) · B — savol yo'q (ko'rsatish) · D — bosim va yolg'on («hamma oldi» turi).
- To'g'ri izohi: Avval odamning hozirgi ishi so'raladi, narx keyin. (50)
- Xato izohlari (≤60):
  - A: Mentor narxni nechanchi savolda aytgan edi? (43)
  - B: Bu ko'rsatish — odamdan hech narsa so'ralmadi. (46)
  - D: Bu sotish gapi — suhbatda odam o'zi gapiradi. (45)
  - (umumiy) Mentorning birinchi savoli nima haqida edi? (43)
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): kitob ilovasi varag'i — «1 · hozirgi ish» accent bilan yonadi, «3 · narx» kulrang.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Ask First! — birinchi urinishda to'g'ri.
- Izoh (MD): distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas (S-004): A — narx suhbat savollarida uchinchi; B — odamdan hech narsa so'ralmaydi; D — 2-ekrandagi sotish gapi turi. B hayotda «yomon» emas — lekin savol suhbat haqida, u esa savol emas. Ikkala trekka to'g'ri.

## 4 · Uch suhbat  ← QTushuncha (ketma-ket, 3 yozuv; SABOQ 9/13, E 53)
- Eyebrow: Tushuncha · javob
- Sarlavha: **Uch tashkilotchi narx haqida nima dedi?** (39)
- Mentor: Mentor javoblarni intervyudagidek so'zma-so'z yozgan — har yozuvga mos belgini bosing.
- Bashorat (ballsiz; S-015 — o'sish tartibida): **Uch tashkilotchidan nechtasi «ha» dedi?** · 0 · 1 · 2 — tanlangach ixcham qator natijagacha turadi; belgi tugmalari shundan keyin yoqiladi.
- Vizual (≤ 3 blok: sahna · varaq · belgi tugmalari): **chapda** — sahna: Mentor (pufagida 3-savol: «"Doimiy o'yin" 30 kunga 15 000 so'm bo'lsa — olarmidingiz? Nega?») va joriy tashkilotchi (yorliq «1-tashkilotchi» …; pufagida gapi so'zma-so'z) ·
  **o'ngda** — varaq: «Mentorning suhbat savollari» (ixcham, 3-savol accent) va «Suhbatlar · n / 3» jadvali (kim · gap · belgi · narx) · **varaq ostida** — to'rt belgi tugmasi: ha · qimmat · yo'q · javob yo'q; tugmalar ostida doimiy kulrang qator: Javob yo'q — odam javob bermasa. (32)
- Yozuvlar (tayanch 1.6 so'zma-so'z; navbat bilan):
  1. **1-tashkilotchi:** «Har hafta guruhga o'zim yozaman. O'zi e'lon qilsa — 15 000 ga olaman.» ✔ ha → belgi katagi yashil «ha»; narx katagiga gapdagi «15 000» uchadi.
  2. **2-tashkilotchi:** «Telegram guruhi tekin-ku, pul to'lamayman.» ✔ yo'q → katak kulrang «yo'q», narx katagi «—»; `QIzoh` (~3 s): «Yo'q» ham natija — u ham yozuvda qoladi. (41)
  3. **3-tashkilotchi:** «15 000 qimmat. 10 000 bo'lsa olardim.» ✔ qimmat → katak accent «qimmat»; narx katagiga gapdagi «10 000» uchadi.
- **Harakat → Vizual o'zgarish:** belgi tugmasini bosish → to'g'ri bo'lsa belgi tugmadan jadval qatoridagi katakka uchadi (~1 s rangli), gapdagi son narx katagiga sirg'aladi (1, 3); joriy tashkilotchi o'rniga keyingisi pufagi bilan kiradi.
  Xato → tugma silkinadi, katak bir lahza `err` fon, bitta `QXato` (≤60; javobni aytmaydi):
  - 1-yozuv, «qimmat» yoki «yo'q» · 2-yozuv, «ha»: Gapning oxirini qayta o'qing: u nima qiladi? (44)
  - 2-yozuv, «qimmat»: U narxni qimmat dedimi? (23)
  - 3-yozuv, «ha»: U shu narxda olishini aytdimi? (30)
  - 3-yozuv, «yo'q»: U boshqa narxda nima qilishini aytdi — qarang. (46)
  - istalgan yozuv, «javob yo'q»: U javob berdi — gapi yozilgan. (30)
- Natija (bitta blok — E 42; `tugadi`: belgi tugmalari yopiladi, sahna yig'iladi, varaq butun enga): yashil xulosa qutisi — birinchi kichik qator taxmin («Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: 1»);
  varaqda uch qator to'la (ha · 15 000 · yo'q · — · qimmat · 10 000), jadval ostida kulrang Mentor yozuvi (T-008 — olam ichidagi matn, tayanch 1.6): Narx hozircha qoladi, «qimmat» javobi yozib qo'yildi.
- Xulosa: Bu darsda javob so'zma-so'z yoziladi va belgi oladi: ha, qimmat, yo'q yoki javob yo'q. (86)
- `QIzoh` (qutining oxirgi kichik qatori): Mentor xulosasi: uch suhbat — kichik son: narx haqida dalil, isbot emas. (72)
- Tugma (pastki): Avval belgilang → Belgi qo'ying (N/3) → Davom etish
- Ipucha (40 s): Odam shu narxda oladimi, qimmat dedimi yoki olmaydimi? (54)
- Keyingi bosiladigan joy: bashorat → to'rt belgi tugmasi (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Word for Word! (uch yozuvga birinchi urinishda mos belgi).
- O'qituvchi eslatmasi: Mentor ko'ndirmadi va «o'ylab ko'ring» demadi — 2-tashkilotchining «yo'q»i ham yozildi. Uning gapi — 4-darsdagi raqobat: tashkilotchi o'yinni Telegram guruhida bepul yig'adi.
  «Ha» — odamning so'zi: u hali to'lamagan va Mentor pul olmagan. 3-tashkilotchining «10 000»i — uning gapi, yangi narx emas: Mentor narxni hozircha o'zgartirmadi.
  «Kichik son: isbot emas» — uch kishining gapi narx hamma tashkilotchiga to'g'ri ekanini isbotlamaydi. «Javob yo'q» Mentor misolida bo'lmagan — xabar yozib so'ralganda bo'lishi mumkin.
✎ Yozuvlar tartibi va matni — tayanch 1.6 aynan. Belgi tugmalari tartibi o'zgarmaydi (ha · qimmat · yo'q · javob yo'q — tayanch tartibi). «tekin-ku» — olam ichidagi gap (T-008), «…» ichida (til-lint `sheva-yuklama-ku` istisnosi).

## 5 · 2-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: Tekshiruv · yozuv (savol ustida yorliq yo'q)
- Savol: **Tanishingiz: «Kitobni do'stimdan so'rab olaman, pul bermayman». Yozuvga nima yozasiz?** (10 so'z)
  - A — «Qiziqmadi» degan xulosa va «yo'q» belgisi (42)
  - ✔ B — Uning gapi so'zma-so'z va «yo'q» belgisi (40)
  - C — Uning gapi so'zma-so'z va «qimmat» belgisi (42)
  - D — Hech narsa: «yo'q» javobi yozuvga kirmaydi (42)
- Kalit: **B** (index 1). «so'zma-so'z» — B va C da, «yo'q» — A, B, D da (kalit so'z faqat to'g'rida emas); to'g'ri javob eng uzun emas; uzunlik — «O'lchov».
  Distraktorlar uch xil: A — odamning gapi o'rniga o'z xulosasi · C — noto'g'ri belgi (u narxni qimmat demadi) · D — «yo'q»ni yozmaslik.
- To'g'ri izohi: Odamning o'z gapi va belgisi — «yo'q» ham natija. (49)
- Xato izohlari (≤60):
  - A: Xulosa sizniki — yozuvga odamning gapi tushadi. (47)
  - C: U narxni qimmat dedimi? Gapini qayta o'qing. (44)
  - D: Mentor misolida «yo'q» javobi yozilmay qolganmidi? (50)
  - (umumiy) Mentor 2-tashkilotchining gapini qanday yozgan edi? (51)
- Javob topilgach (kichik): kitob ilovasi yozuv qatori: «tanish · «Kitobni do'stimdan so'rab olaman, pul bermayman» · yo'q · —».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol ekrandan ko'chirilmaydi (§106): Mentor misoli emas — kitob ilovasi va boshqa gap; 4-ekrandagi Mentor xulosasi emas — yozuvning o'zi so'raladi. Bitta javob himoyalanadi: odam narxni qimmat demagan, to'lamasligini aytgan.

## 6 · Suhbat savollaringiz  ← QMustaqil (USTAXONA — ketma-ket karta, 3 qism; SABOQ 9, 13, 29, E 43, E 53)
- Eyebrow: Mustaqil ish · suhbat savollari
- Sarlavha: **Narxingiz uchun suhbat savollarini yozing.** (42)
- Mentor: Mentorning savollarini o'z mahsulotingizga moslang — bo'sh joylarni to'ldiring.
- **Chapda — telefon** (`SuhbatVaraq` telefon holati: 0-ekrandagi o'quvchi ekrani). `pm-m11d4-narx` yo'q bo'lsa — telefon ko'rinmaydi, karta va varaq bitta ustunda (bo'sh ustun yo'q — SABOQ 20).
  **O'ngda — bitta katta karta (joriy qism)**, ostida varaq «Suhbat savollarim» ixcham: to'rt savol, o'zgaradigan joylar uzuq ramkada (to'ldiriladigan joy — U-041). Maydonlarda yorliq input ichida — raqam belgisi va qisqa savol (E 43).
- Qismlar (ketma-ket; «Saqlash» o'ngda — 187):
  1. **Kim to'laydi** — maydon (≤ 30; `pm-m11d2-model.kim` dan oldindan, tahrirlanadi — yorliq «2-darsdagi tanlovingiz»; kalit yo'q bo'lsa bo'sh, placeholder «Mahsulotingizda kim to'laydi? Rolini yozing»).
     Kulrang qator (`pm-m9d3-intervyu` bo'lsa): 11-Modulda intervyu berganlar: «{kim}» · «{kim}» … (takrorsiz, ko'pi bilan 5; faqat rol). Kalit yo'q — qator ko'rinmaydi.
  2. **Hozirgi ish** — 1-savol qolipi: «Hozir [ … ] va bunga qancha vaqt ketadi?» — maydon (≤ 50; placeholder «masalan: o'yinni qanday yig'asiz»).
     Ostida o'zgarmaydigan 2-savol: «Bunga hozir pul sarflaysizmi — nimaga?» (kulrang yorliq «o'zgarmaydi»).
  3. **Narx** — 3-savol qolipi: «"[ nima ]" [davr] kunga [narx] so'm bo'lsa — olarmidingiz? Nega?»:
     - nima (≤ 40; `pm-m11d2-model.nima` dan oldindan, tahrirlanadi — 40 belgidan uzun bo'lsa bo'sh; placeholder «Qulaylik nomi — masalan: Doimiy o'yin»); kulrang qator (`ekran.sarlavha` bo'lsa): 4-darsdagi ekraningiz: «{ekran.sarlavha}»
     - narx (son, so'm) — `pm-m11d4-narx.narx` dan oldindan, tahrirlanadi; yorliq «4-darsdagi narxingiz · taxmin»; kalit yo'q bo'lsa bo'sh (placeholder «Narx, so'm — taxmin»)
     - davr (kun, ixtiyoriy) — `davrKun` dan; bo'sh bo'lsa savoldan «[davr] kunga» qismi tushib qoladi: «"[nima]" [narx] so'm bo'lsa — olarmidingiz? Nega?»
     Ostida o'zgarmaydigan 4-savol: «Qancha bo'lsa olardingiz?» (kulrang shart «javob «yo'q» yoki «qimmat» bo'lsa»).
- Tekshiruv (`QXato`, ≤60; maydon ostida; yumshoqlari ikkinchi «Saqlash» bilan o'tadi):
  - maydon bo'sh (bloklaydi): Bu joy bo'sh — savol to'liq chiqmaydi. (38)
  - «Kim to'laydi» da «@», «t.me/», «+998» yoki 7+ raqam (bloklaydi): Rol yozing — ism, telefon va akkaunt nomi emas. (47)
  - «Hozirgi ish» yoki «nima» da «@», «t.me/», «+998» yoki telefon shakli — 9 raqam (bloklaydi; «qur» 08.10, sadoqat): Savolga telefon va akkaunt nomi yozilmaydi. (43)
  - «Hozirgi ish» da «so'm» yoki narxga o'xshash son — 1 000 va undan katta (bloklaydi): Narx uchinchi savolda — bu yerda hozirgi ishni so'rang. (55)
  - «Hozirgi ish» da «siz» qo'shimchasi yo'q (yumshoq): Bo'lakni odamga savol qilib yozing: «…siz» bilan. (49)
  - «Hozirgi ish» yoki «nima» da sotish so'zlari — «arzon», «atigi», «chegirma», «tezroq», «oling», «olmasangiz», «hamma oldi», «o'ylab ko'ring» (yumshoq): Bu sotish gapiga o'xshaydi — odamdan so'rang. (45)
  - «Hozirgi ish» da kelajak shakli — «-armidingiz», «-arsiz», «bo'lsa» (yumshoq): Hozirgi ishni so'rang — bo'lmagan ishni emas. (45)
  - narx bo'sh yoki 0 (bloklaydi): Narxni yozing — 4-darsdagi taxminingiz. (39)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
- Yordam (bosilsa ochiladi; Mentor misolidan, A-6): Mentor misolida: tashkilotchi · «o'yinni qanday yig'asiz» · «Doimiy o'yin» · 30 kun · 15 000 so'm. Bo'lakni odamga savol qilib yozing; narx faqat uchinchi savolda.
  Savolni ✎ bilan o'zingizga moslasangiz ham, u odamdan so'rasin — olishga undamasin. 4-darsda narx yozmagan bo'lsangiz, bugungi taxminingizni yozing — u ham taxmin.
- **Harakat → Vizual o'zgarish:** «Saqlash» → qism qiymati kartadan varaqdagi uzuq joyga uchadi (~1 s yashil), savol to'liq gapga aylanadi; narx qismida telefondagi narx qatori varaqdagi 3-savolga chiziq bilan ulanadi (SABOQ 35). Keyingi qism kiradi.
  3/3 da karta yopiladi, varaq butun enga — «Suhbat savollarim»: to'rt savol, har birida ✎ (bosilsa o'sha savol katta karta bo'lib ochiladi — SABOQ 29). Tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`.
- Xulosa: Suhbat savollaringiz tayyor: avval hozirgi ish so'raladi, narx — uchinchi savolda. (82)
- Saqlash: `pm-m11d6-suhbat.skript` = to'rt savolning to'liq matni (A-11).
- Tugma (pastki): Savollarni to'ldiring (N/3) → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: joriy maydon (accent chegara, to'lqin) → «Saqlash» → keyingi qism.
- Artefakt-strip (U-042): shu ekrandan — «Suhbat savollarim · 4 ta» (ixcham); 7-ekranda ko'rinadi; test, arena, podium va yakunda yo'q (E 50).
- Nishon yo'q (saqlash — Mentorga signal).
- Mentor rejimi: forma o'rniga Mentorning suhbat savollari (A-6). Mentor statistikasi: «Savollarni yozdi».
- O'qituvchi eslatmasi: 12 daqiqa. Eng ko'p xato — birinchi savolda mahsulotni yoki narxni aytish: «Odam bu ishni hozir qanday qiladi?» deb so'rang. Kim to'lashini o'quvchi 2-darsda tanlagan — maydon shundan oldindan yozilgan bo'ladi, o'quvchi tasdiqlaydi yoki o'zgartiradi; siz aytmaysiz.
  Narxni siz qo'ymaysiz (TAQIQLAR 1: «shuncha qo'ying» deyilmaydi); 4-darsda narxi saqlanmagan o'quvchi bugungi taxminini yozadi.

## 7 · Rol o'yini  ← QMustaqil (juftlik + yakka rejim; 3 qism ketma-ket)
- Eyebrow: Juftlikda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **Sherigingiz bilan rol o'yinini o'tkazing.** (41)
- Mentor (jonli darsda): Siz so'raysiz, sherigingiz javob beradi: gapini so'zma-so'z yozing, keyin almashasiz.
- Mentor (yakka rejimda): Sherik bo'lmasa, savollaringizni ovoz chiqarib o'qing — mashqni uyda qilasiz.
- Qism yorliqlari (ot-shakl, T-073): 1 Kim · 2 Savollar · 3 Yozuv
- **Chapda — sahna:** «Siz» va «Sherigingiz» (real ko'rinishda; sherik ustida yorliq — 1-qismdan keyin «{kim} rolida» yoki «{kim}») · **o'ngda — bitta katta karta (joriy qism)** · ostida ixcham chiziq «Yozuvlarim · real n / 3 · mashq n».
- Qismlar:
  1. **Kim** — savol: Sherigingiz qanday javob beradi? · kulrang qator: Haqiqatan «{kim}» bo'lsa va o'zi xohlasa — o'zi uchun javob beradi; bo'lmasa — rol o'ynaydi. · ikki tugma:
     - «Rol o'ynab javob beradi» → karta yorlig'i **mashq** (kulrang); `QIzoh`: Rol o'yini — mashq: bu yozuv uchta real suhbatga kirmaydi. (58)
     - «O'zi javob beradi» → karta sherikka qaraydi: «Sherigingiz o'zi bossin» · ikki tugma «Roziman — o'zim uchun javob beraman» · «Rol o'ynayman» (→ mashq). «Roziman» → yorlig'i **real suhbat** (yashil); `QIzoh`: Sherigingiz o'zi uchun javob beradi — bu real suhbat. (53)
     Ostida kulrang qator (ikkalasida): Real suhbat ixtiyoriy. Sherigingiz ismini hech qayerga yozmang.
  2. **Savollar** — suhbat savollari bittadan (sahnada — «Siz» pufagida, kartada — katta):
     - 1, 2-savol: kartada savol · tugma «Keyingi savol»; 2-savoldan keyin maydon «Hozir nima qiladi?» (qisqa, uning so'zlari bilan; ≤ 80; placeholder «masalan: Har hafta guruhga o'zim yozaman, pul sarflamayman») → `hozir`
     - 3-savol: maydon «U nima dedi?» (so'zma-so'z; ≤ 160) · to'rt belgi tugmasi: ha · qimmat · yo'q · javob yo'q (ostida doimiy qator «Javob yo'q — odam javob bermasa.»)
     - belgi «yo'q» yoki «qimmat» → 4-savol kiradi: «Qancha bo'lsa olardingiz?» — maydon «U nima dedi?» (gapga qo'shiladi) va son maydoni «Narx, so'm — aytgan bo'lsa». «Yo'q» da kartada kulrang qator «Sababi narx bo'lmasa (masalan, «kerak emas») — bu savolni bermang.» va tugma «O'tkazish» (`narxi: null`; F-1007-464).
  3. **Yozuv** — yozuv qatori ko'rinishi: «{kim} · «{gap}» · {belgi} · {narx}», ostida kulrang «Hozir: {hozir}» (bo'lsa) + «Saqlash».
     Saqlangach `QIzoh`: Endi almashing: sherigingiz o'z ekranida so'raydi, siz javob berasiz. (69)
     Ikkinchi tugma «+ Yana bitta suhbat» — darsda ko'pi bilan ikkita yozuv: bitta mashq va bitta real (tayanch 1.6); qaysi tur bo'sh bo'lsa, o'sha tugma ochiq.
- Tekshiruv (`QXato`, ≤60; yumshoqlari ikkinchi bosish bilan o'tadi):
  - «U nima dedi?» bo'sh (bloklaydi): Sherigingiz nima dedi — shuni yozing. (37)
  - «+998», «@», «t.me/» yoki telefon shakli — 9 raqam («90 123 45 67» yoki bo'shliqsiz) (bloklaydi; `gap` va `hozir` da): Yozuvga telefon va akkaunt nomi yozilmaydi. (43)
  - boshqa 7+ raqam ketma-ket (yumshoq — narx bo'lishi mumkin, masalan «1000000»; F-1007-464): Bu telefon raqamimi yoki narxmi? Telefon yozilmaydi. (52)
  - belgi tanlanmagan (bloklaydi): Belgini tanlang: ha, qimmat, yo'q yoki javob yo'q. (50)
  - «Hozir nima qiladi?» bo'sh (yumshoq; qoldirilsa `hozir: null`): Hozir nima qilishini qisqa yozing. (34)
  - xulosa so'zlari — «qiziqdi», «qiziqmadi», «yoqdi», «yoqmadi», «rozi bo'ldi», «ko'ndi» (yumshoq): Bu xulosaga o'xshaydi — gapini so'zma-so'z yozing. (50)
  - belgi «ha», gapda «qimmat» so'zi (yumshoq): Gapida «qimmat» bor — belgini qayta qarang. (43)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
- Yordam: Javobni yaxshilamang va qisqartirmang — odam qanday aytgan bo'lsa, shunday yozing. Mentor misolida: «15 000 qimmat. 10 000 bo'lsa olardim.» — belgi «qimmat», narx 10 000.
  «Ha» desa ham pul so'ramang; «yo'q» desa — ko'ndirmang, yozib qo'ying. Uyda mahalla guruhi orqali yozsangiz — 12-Moduldagi olti bandli ro'yxat kuchda.
  Ism, telefon yoki akkaunt nomini aytsa — [ism], [telefon] bilan almashtiring, qolganini o'zgartirmang (F-1007-467).
  Savolni tushunmasa — boshqa so'z bilan bir marta aniqlashtiring, narxni o'zgartirmang. «Yo'q» sababi narx bo'lmasa, to'rtinchi savolni bermang — ko'ndirishga o'xshab qoladi.
- **Harakat → Vizual o'zgarish:** 1-qism tugmasi → sherik ustida yorliq paydo bo'ladi, karta yorlig'i «mashq» yoki «real suhbat»; «Keyingi savol» → savol pufagi «Siz»dan chiqadi, sherik pufagida «…»;
  gap yozilib belgi tanlanganda → gap qo'shtirnoqda sherik pufagiga va karta qatoriga sirg'aladi (~1 s yashil), belgi katagi rangga kiradi; «Saqlash» → karta kichrayib «Yozuvlarim» chizig'iga uchadi (real — «n / 3» ichiga, mashq — alohida «mashq» qatoriga), sanoq o'sadi.
  Tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`. Oxirida karta yopiladi, varaq butun enga — yozuvlar, har birida ✎.
- Xulosa (holatdan, P-046):
  - real yozuv bor: Birinchi real suhbat yozildi: gap so'zma-so'z, belgisi bilan. (61)
  - faqat mashq yozuvi: Mashq yozuvi tayyor — real suhbatlar uyda, tanish odamlar bilan. (64)
  - yakka rejim (yozuvsiz): Savollaringiz o'qildi — rol o'yini va suhbatlar uyda. (53)
- Yakka rejim (sherik yo'q): karta o'rnida — suhbat savollaringiz (to'rttasi) va tugma «Ovoz chiqarib o'qidim»; yozuv yo'q, nishon yo'q.
- Saqlash: `pm-m11d6-suhbat.suhbatlar` — har «Saqlash» bitta yozuv `{ id, tur, kim, hozir, gap, javob, narxi, qachon }` (A-11 shartnomasi; `hozir` — 2-savoldan keyingi qisqa qator yoki `null`); `xulosa: null`; `savedAt`.
- Tugma (pastki): Uch qismni bajaring (N/3) → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: ikki tugma (navbatma-navbat) → «Keyingi savol» → «U nima dedi?» maydoni → belgi tugmalari → «Saqlash».
- Nishon: **Recorded!** (birinchi yozuv saqlanganda — mashq yoki real; bonus, ish bajarilgan ekranda — P-048).
- Mentor statistikasi: «Yozuv saqladi» (son). Belgilar, gaplar va «real / mashq» bo'linishi Mentor ekraniga ham, proyektorga ham chiqmaydi (TAQIQLAR 3: kim «ha» degani va kim nechta suhbat qilgani sanalmaydi).
- O'qituvchi eslatmasi: Juftliklardan oldin ≈ 3 daqiqa — Mentor bilan rol o'yini (Qaror-0 2): bitta o'quvchi suhbat savollarini o'qiydi, siz Mentor misolidagi tashkilotchi rolida javob berasiz — Mentor misolidagi uch tashkilotchi gapidan birini aynan ayting; sinf javobni so'zma-so'z yozishni ko'radi.
  Keyin juftlikda: ≈ 6 daqiqa birinchisi so'raydi, ≈ 6 daqiqa ikkinchisi. Sherik haqiqatan o'quvchi mahsulotida to'laydigan rolda bo'lsa va o'zi xohlasa — o'z nomidan javob beradi (real suhbat; «Roziman» ni sherikning o'zi bosadi); o'xshasa-yu shu rol bo'lmasa yoki xohlamasa — rol o'ynaydi. Real suhbat ixtiyoriy. Kim «ha» eshitganini sinfda so'ramang va sanamang.
  Sherik «ha» desa ham pul olinmaydi, to'lov sahifasi yoki «mashq to'lov» havolasi berilmaydi.
✎ Juftlik naqshi — 12-Modul 6-dars 10-ekran va 11-Modul 3-dars 10-ekran: tur tanlovi (real / mashq), qismlar ketma-ket, yakka rejim. 1, 2-savol javobi — `hozir` ga qisqa qator (F-1007-464; TAYANCHGA SAVOL 3); `gap` — faqat narx haqidagi gap.

## 8 · Yakuniy savol  ← QTest (✔ D, `correctIdx 3`; ikkala trekka to'g'ri)
- Eyebrow: Yakuniy tekshiruv (savol ustida yorliq yo'q)
- Savol: **Auditoriyangizdagi uch tanish narxingizni eshitib «olaman» dedi. Bu nimani ko'rsatadi?** (10 so'z)
  - A — Narx to'g'ri ekanining aniq isbotini (36)
  - B — Narx oshsa ham olishlari aniqligini (35)
  - C — Ulardan pulni hozir olsa bo'lishini (35)
  - ✔ D — Ularning so'zini, hali to'lovni emas (36)
- Kalit: **D** (index 3). To'rttalasi bir shaklda («…ni»); tire va qavs hech birida yo'q; uzunlik — «O'lchov».
  Distraktorlar uch xil: A — kichik sondan umumiy xulosa (isbot) · B — dalildan tashqari xulosa (narxni oshirish) · C — real pul (TAQIQLAR 1).
- To'g'ri izohi: «Olaman» — so'z: odam hali to'lamagan. (38)
- Xato izohlari (≤60):
  - A: Uch kishi — kichik son: bu isbot bo'ladimi? (43)
  - B: Ular boshqa narxni eshitmagan — buni bilmaysiz. (47)
  - C: Suhbatda pul olinmaydi — odam «ha» desa ham. (44)
  - (umumiy) Mentor uch suhbatdan keyin qanday xulosa qildi? (47)
- Javob topilgach (kichik): varaq — uch qator «ha · ha · ha», ostida kulrang: so'z — hali to'lov emas.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol sonni o'qishni so'raydi (uch), umumiy xulosa qildirmaydi (T-043). 5-ekran (yozuv qanday yoziladi) va arena 8 («ha» desa nima qilasiz — harakat) bilan kalit ibora takrorlanmaydi (S-008).

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 3 savol (3, 5, 8); 6, 7-ekranlar «Saqlash» — Mentorga signal (`PRACTICE_BASE`, ball yo'q).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Suhbat nimadan boshlanadi» · 5 — «2 — "Yo'q" qanday yoziladi» · 8 — «Yakuniy — "Olaman" nimani ko'rsatadi»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi yengil accent chegara bilan (E 49), ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N.
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun (SABOQ E 50 standarti)
- Yorliqlar (tepada): Dars tugadi · N/3 to'g'ri
- Sarlavha (holatga qarab — P-046, E 54; ✓ va nishon — faqat birinchi ikki holatda; sarlavha o'quvchi qilgan ishni aytadi):
  - savollar saqlangan, real yozuv bor: **Suhbat savollari tayyor, birinchi real suhbat yozildi.** (54)
  - savollar saqlangan, faqat mashq yozuvi: **Suhbat savollari tayyor, rol o'yini yozildi.** (44)
  - savollar saqlangan, yozuv yo'q: **Suhbat savollari tayyor, rol o'yini va suhbatlar qoldi.** (55)
  - savollar qisman saqlangan (1–2 qism): **Suhbat savollari hali tugamagan — uyda tugating.** (48)
  - hech narsa saqlanmagan: **Suhbat savollari hali yozilmagan — uyda yozing.** (47)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi — yo'q (E 50; fikr A-2 da — darsning ichki o'qi).
- Endi siz bilasiz (T-048 — asosiy fikr so'zma-so'z takrorlanmaydi):
  - Bu darsda suhbat — sotish emas, savol: avval odamning hozirgi ishi so'raladi, keyin narx.
  - Suhbat savollari — har odamga bir xil tartibda beriladigan asosiy savollar.
  - Javob so'zma-so'z yoziladi va belgi oladi; «yo'q» ham natija.
  - Uch suhbat — kichik son: narx haqida dalil, lekin narx to'g'ri ekanining isboti emas.
  - Suhbat faqat tanish odam bilan; «ha» desa ham pul olinmaydi.
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar; alohida `.homework.jsx` yo'q): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: auditoriyangizdagi tanish odamlar · Nechta: uchtagacha real suhbat — darsdagi real suhbat ham kiradi · Muddat: keyingi darsgacha
  - ① Tanish odamni tanlang: 11-Modulda intervyu bergan odam, sinfdosh, ota-ona yoki mahalla guruhidagi tanish — guruh egasining ruxsati bilan. U mahsulotingizda to'laydigan rolda bo'lsin; bunday tanish bo'lmasa — 0 ham halol natija. Ota-onangizga ayting.
  - ② Suhbat savollarini tartib bilan bering: narx — uchinchi savolda; «yo'q» desa, ko'ndirmang.
  - ③ Javobni o'sha zahoti qog'ozga yozing, ismsiz: rol · hozir nima qiladi (qisqa) · narx haqidagi gapi (so'zma-so'z) · belgi · aytgan narxi.
  - ④ Darsda qolgan qismni tugating: {holatga qarab — suhbat savollarini yozing · rol o'yinini oilangizdan biri bilan o'tkazing}. Hammasi tugagan bo'lsa ④ ko'rinmaydi.
  - Karta ostida (bitta kulrang qator): Notanishga yozmang; uchrashuv taklifi kelsa — faqat kattalar bilan. «Ha» desa ham, pul olmang.
  - Tugma: Amaliy topshiriqni bajarish →
- **AI bilan davom** (`AiDavomCard`, CODE STRIKE ostida, mentor rejimida yo'q — F-1007-475, PM-109): sarlavha **Erta tugatdingizmi? AI bilan davom eting** · matn: gemini.google.com'ni oching, pastdagi so'rovni yuboring va suhbat savollaringizni bittadan bering — AI tashkilotchi bo'lib javob beradi. Javoblarini «Orqaga» bilan qaytib, rol o'yini yozuviga kiriting. · so'rov qutisi (nusxalash tugmasi): «Sen «Maydon Jamoa»ga o'xshash ilovada har hafta o'yin tashkil qiladigan tashkilotchisan: o'yinchilarni qo'lda yig'asan, bunga vaqt ketadi. Men senga narx haqida 4 ta savol beraman. Har biriga qisqa, hayotiy javob ber; narx aytilganda avval ikkilan, keyin o'z fikringni ayt. O'zing savol berma, sotishga undama. Birinchi savolim: »
  Sabab: mustaqil rejimda sherik yo'q — 6–7-ekranlar tez o'tadi va dars qisqa tugaydi; AI sherik o'rnini bosadi, yozuv 7-ekrandagi mashq yozuviga tushadi.
- Keyingi dars — «Foydalanuvchiga shartlarni qanday ochiq aytasiz?»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18). Artefakt-strip yakunda yo'q (E 50).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): uyga vazifada keyingi darslar (yozma tasdiq) aytilmaydi (T-038; pilot eslatmasi 6). Uy suhbatlari — qog'ozda (11-Modul 3-dars naqshi); kalitga qanday tushishi — TAYANCHGA SAVOL 7.
  «Uchtagacha» — maqsad uchta, lekin kam bo'lsa ham halol natija, baho emas (12-Modul 10-dars qoidasi ruhi; sinf 14 — uyga vazifa yengil va aniq). «Kim bilan» — HwCard yorlig'i (11-Modul 3-dars bilan bir).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Just Ask!** (2-ekran, olti gap birinchi urinishda) — Savol va sotish gapini ajratdingiz (34)
- **Ask First!** (3-ekran, 1-savol birinchi urinishda) — Suhbat nimadan boshlanishini topdingiz (38)
- **Word for Word!** (4-ekran, uch yozuv birinchi urinishda) — Uch javobga mos belgi qo'ydingiz (32)
- **Recorded!** (7-ekran, birinchi yozuv saqlanganda — bonus) — Rol o'yini yoki suhbat yozuvini saqladingiz (43)
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (Recorded!, ish qilingan ekranda — P-048); yakka rejimda berilmaydi (yozuv yo'q). Yakuniy savol va 5-ekran nishonsiz. 6-ekran nishonsiz (saqlash — Mentorga signal).

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
- **3 · Suhbat nimadan boshlanadi** — 1 Bu darsda suhbat — sotish emas, savol. · 2 Avval odamning hozirgi ishi so'raladi: qanday qiladi, vaqt va pul sarflaydimi. · 3 Narx keyin aytiladi — Mentor misolida uchinchi savolda.
  — Sinfga savol: Birinchi savolingiz nima haqida?
- **5 · Javob qanday yoziladi** — 1 Javob so'zma-so'z yoziladi — o'z xulosangiz emas. · 2 Belgi odamning gapidan: ha, qimmat, yo'q yoki javob yo'q. · 3 «Yo'q» ham natija — u ham yozuvda qoladi.
  — Sinfga savol: «Qiziqmadi» deb yozsangiz, nima yo'qoladi?
- **8 · «Olaman» nimani ko'rsatadi** — 1 «Olaman» — odamning so'zi: u hali to'lamagan. · 2 Uch suhbat — kichik son: narx haqida dalil, isbot emas. · 3 Suhbatda pul olinmaydi — odam «ha» desa ham.
  — Sinfga savol: «Ha» degan odamga keyin nima deysiz?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Bu darsda suhbat nima? | Sotish emas, savol: avval odamning hozirgi ishi so'raladi, keyin narx | Narx haqida real odam bilan; 11-Moduldagi intervyu kabi |
| Suhbatda narx qachon aytiladi? | Odamning hozirgi ishi so'ralgandan keyin | Mentor misolida — uchinchi savolda |
| Suhbat savollari qanday beriladi? | Har odamga bir xil tartibda | Tushunmasa — bir marta aniqlashtiriladi; narx o'zgarmaydi |
| Mentor to'rtinchi savolni qachon beradi? | Javob «yo'q» yoki «qimmat» bo'lsa | Savol: «Qancha bo'lsa olardingiz?» |
| «Hozir olmasangiz, keyin qimmatlashadi» — bu savolmi? | Yo'q, bu sotish gapi | Mentor bunday demaydi |
| Javob qanday yoziladi? | So'zma-so'z — odam qanday aytgan bo'lsa, shunday | 9 va 11-Moduldagi intervyudagidek: u aytganidek, o'sha zahoti |
| Javobga qanday belgilar qo'yiladi? | Ha, qimmat, yo'q yoki javob yo'q | Belgi odamning o'z gapidan |
| «Qimmat» belgisi qachon qo'yiladi? | Odam narxni qimmat desa | Boshqa narx aytsa — narx katagiga; aytmasa — bo'sh |
| «Yo'q» javobi ham yozib qo'yiladimi? | Ha — «yo'q» ham natija | Mentor misolida 2-tashkilotchi: «pul to'lamayman» |
| Uch suhbat narx haqida nima beradi? | Dalil — lekin narx to'g'ri ekanining isboti emas | Uch — kichik son |
| Rol o'yinidagi yozuv real suhbatmi? | Yo'q — bu mashq | Real suhbat — odam o'zi uchun javob bersa |
| Narx haqida kim bilan gaplashasiz? | Tanish odam bilan — ota-onangizga aytib | Notanishga yozilmaydi; yozuvda ism yo'q |
- §145: har javobdagi so'z darsda bor (suhbat, sotish gapi, suhbat savollari — 2 · belgilar, so'zma-so'z, «yo'q» ham natija, kichik son — 4 · mashq, real suhbat — 7 · tanish, ota-ona — A-9, 7-ekran Yordami, yakun).
- S-027: har old tomon — to'liq savol, «?» bilan; «ta'rif → atamani toping» shakli yo'q. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 3·6·10 · C 2·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda. Uzunliklar — `md06/olchov.py` (pastda «O'lchov»).
1. Bu darsda suhbat nima? (2)
   - ✔ A — Narx haqida real odamga savol berish (36)
   - B — Mahsulotni tanishlarga sotish usuli (35)
   - C — Ilovani do'stlarga ko'rsatib chiqish (36)
   - D — Narxni Mentor bilan kelishib olish (34)
2. Mentor misolida narx qaysi savolda aytiladi? (2)
   - A — Birinchi savolda, hammasidan oldin (34)
   - B — Ikkinchi savolda, pul haqida so'rab (35)
   - ✔ C — Uchinchi savolda, ishni so'ragach (33)
   - D — To'rtinchi savolda, eng oxirida (31)
3. Mentor to'rtinchi savolni qachon beradi? (2, 4)
   - A — Suhbat boshida, birinchi bo'lib (31)
   - ✔ B — Javob «yo'q» yoki «qimmat» bo'lsa (33)
   - C — Tashkilotchi «ha» deb javob bersa (33)
   - D — Tashkilotchi umuman javob bermasa (33)
4. Qaysi gap sotish gapi? (2)
   - A — Hozir buni qanday qilyapsiz? (28)
   - B — Bunga hozir pul sarflaysizmi? (29)
   - C — Vaqt ajratganingiz uchun rahmat! (32)
   - ✔ D — Hamma oldi, siz ham olasizmi? (29)
5. Odam: «Qimmat, yarim narxda olardim». Yozuvingizda nima turadi? (4)
   - ✔ A — «Qimmat» belgisi va uning narxi (31)
   - B — «Ha» belgisi va savoldagi narx (30)
   - C — «Yo'q» belgisi, narx yozilmaydi (31)
   - D — «Javob yo'q» belgisi, gap yo'q (30)
6. Mentor misolida uch tashkilotchidan nechtasi «ha» dedi? (4)
   - A — Uchalasi — hammasi «ha» dedi (28)
   - ✔ B — Bittasi — faqat 1-tashkilotchi (30)
   - C — Ikkitasi — 1 va 3-tashkilotchi (30)
   - D — Hech biri — hammasi rad etdi (28)
7. Odam xabaringizga javob bermadi. Qaysi belgi qo'yiladi? (4)
   - A — «Yo'q» — demak, u olmaydi ekan (30)
   - B — «Qimmat» — narx unga yoqmadi (28)
   - ✔ C — «Javob yo'q» — gapi yozilmagan (30)
   - D — Hech narsa — yozuv qilinmaydi (29)
8. Tanishingiz «ha, olaman» dedi. Endi nima qilasiz? (7, 8)
   - A — Pulni hozir naqd olib qo'yaman (30)
   - B — Narxni ikki baravar oshiraman (29)
   - C — Do'stlarini ham olishga undayman (32)
   - ✔ D — Gapini yozaman, pul olmayman (28)
9. Narx haqidagi suhbat uchun kimni tanlaysiz? (6, 7)
   - ✔ A — Auditoriyamdagi tanish odamni (29)
   - B — Internetdagi notanish odamni (28)
   - C — Mahsulot kerak bo'lmagan odamni (31)
   - D — O'zimni — javobni o'zim yozaman (31)
10. Mahalla guruhidagi tanishga yozishdan oldin nima qilasiz? (A-9, uyga vazifa)
    - A — Ko'p guruhga xabar tashlayman (29)
    - ✔ B — Guruh egasidan ruxsat so'rayman (31)
    - C — Uning telefon raqamini topaman (30)
    - D — Hech narsa qilmayman — u tanish (31)
11. Suhbat yozuvida odam qanday ataladi? (6, 7)
    - A — Ismi va familiyasi bilan (24)
    - B — Telegram'dagi nomi bilan (24)
    - ✔ C — Roli bilan: «tashkilotchi» (26)
    - D — Kim ekani umuman yozilmaydi (27)
12. Rol o'yinidagi yozuv nega real suhbatga kirmaydi? (7)
    - A — Unda narx umuman aytilmagan edi (31)
    - B — Uni Mentor o'zi tekshirmagan edi (32)
    - C — Sherik «yo'q» deb javob bergan (30)
    - ✔ D — Sherik rolni o'ynab javob bergan (32)
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006); kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 3-ekran (suhbat nimadan boshlanadi — kitob ilovasi) ↔ arena 2 (narx qaysi savolda — Mentor misoli) ·
  5-ekran («yo'q» qanday yoziladi) ↔ arena 5 («qimmat» — belgi va narx), arena 7 («javob yo'q») · 8-ekran («olaman» nimani ko'rsatadi) ↔ arena 8 («ha» desa nima qilasiz — harakat).
- Distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas: 1 — sotish, ko'rsatish, Mentor bilan kelishish · 4 — suhbat savollari va xushmuomala gap (uch xil) · 8 — real pul, narxni oshirish, bosim (uch xil) ·
  9 — notanish, auditoriyadan tashqari, o'zi yozgan javob (uch xil) · 10 — spam, shaxsiy ma'lumot, ruxsatsiz (uch xil) · 11 — ism, akkaunt nomi, rolsiz yozuv. Arena 6 — Mentor misoli (tayanch 1.6), 3-tashkilotchining «10 000 bo'lsa olardim»i — «qimmat».
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — suhbat · savol · narx · suhbat savollari · belgi · ha · qimmat · yo'q · yozuv · tanish · Maydon Jamoa · uyga vazifa banneri — suhbat · narx · yozuv. Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/11-Modull/PmMoneyTalkLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `pm-m11d6-v1` (PM darslar naqshi `pm-m11dN-v1`), `lessonTitle` — «Pul haqida qanday gaplashasiz?».
2. `SCREEN_META` 12: hook · plan · concept · test · concept · test · practice · practice · test · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` { 3: 2, 5: 1, 8: 3 }; `savolSotish: -1`, `belgilar: -1` (2, 4-ekran — ballsiz, nishon bilan);
   6, 7 `practice: -1`, signal `PRACTICE_BASE + ekran`. `narrow` — 3, 5, 8, 9-ekranlar.
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4 `QTushuncha` (`zoom`, `tugadi` — q17/q18; `QBashorat` + taxmin qatori yashil xulosa qutisi ichida — E 42) · s3/s5/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s6/s7 `QMustaqil` · s9 `QNatija` · `sflash` `QKartochka` · s11 `QYakun`.
3. **`SuhbatVaraq`** — bitta vizual (180; qolipda yo'q, yangi): rejimlar `telefon` (to'lov taklifi ekrani: o'quvchi kalitidan yoki `MENTOR_EKRAN`; «Test rejim: pul yechilmaydi» doim) · `sahna` (ikki odam, real ko'rinish — SABOQ 36; pufaklar; rol yorliqlari) ·
   `varaq` (bo'limlar «Savollar» — 4 uya, «Suhbatlar» — jadval kim · gap · belgi · narx; sarlavhalar «Mentor misoli · Maydon Jamoa» / «Mentorning suhbat savollari» / «Suhbat savollarim» / «Yozuvlarim»). Belgi ranglari: `ok` · `accent` · `ink2` (qizil yo'q).
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: sv-uya sv-belgi sv-qator`). Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz. 393 da maket varaq ustida, o'lchami barqaror (≈170×272), kesilmaydi (E 41; DOM detektori bilan).
4. **Bitta manbalar (A-6 aynan):** `MENTOR_EKRAN` (1.4) · `MENTOR_SKRIPT` (4 savol, 1.6) · `MENTOR_SUHBAT` (3 × `{ kim, gap, javob, narxi }`: 1-tashkilotchi — `ha`, 15000 · 2-tashkilotchi — `yoq`, null · 3-tashkilotchi — `qimmat`, 10000) · `MENTOR_XULOSA` (1.6, ikki gap) · `SOTISH_GAPLAR` (2).
   Mentor rejimi, s0 (kalit yo'q holati), s2, s4, s6 (Yordam) shulardan o'qiydi.
5. **s2** — `QBashorat` (2 · 3 · 4) → 6 karta, ikki tugma («Savol» / «Sotish gapi»), kalit `[savol, sotish, savol, savol, sotish, savol]`; savol → varaqning navbatdagi uyasi, sotish → «Mentor bunday demaydi · n»; `QIzoh` 4-kartada; `QXato` 6 ta; natijada «Mentorning suhbat savollari» sarlavhasi + xulosa + `QIzoh` (suhbat savollari ta'rifi); 40 s ipucha; nishon `justAsk`.
6. **s4** — `QBashorat` (0 · 1 · 2) → 3 yozuv, to'rt belgi tugmasi (ha · qimmat · yo'q · javob yo'q; doimiy izoh qatori), kalit `[ha, yoq, qimmat]`; belgi katakka uchadi, son gapdan narx katagiga (1, 3); `QIzoh` 2-yozuvda; `QXato` jadvali (4-ekran); natijada Mentor yozuvi (1.6 ikkinchi gap) varaq ostida; nishon `wordForWord`.
7. **s6** — o'qiydi `pm-m11d4-narx` (`narx`, `davrKun`, `ekran.*`), `pm-m11d2-model` (`kim`, `nima` — oldindan to'ldirish) va `pm-m9d3-intervyu` (`yozuvlar[].kim`, `goyalar[].kim` — takrorsiz, ≤5); uch qism ketma-ket; savol qoliplari (1 va 3-savol, `davrKun` bo'sh bo'lsa — qisqa shakl); tekshiruvlar (bo'sh · telefon/akkaunt · «Hozirgi ish» da «so'm» yoki 1 000 dan katta son — bloklaydi; «siz» yo'q · sotish so'zlari · kelajak shakli — yumshoq) —
   **PM-108 tartibida kamida 10 namuna bilan `node` da sinaladi** (masalan: «o'yinni qanday yig'asiz» o'tadi · «haftada 2 marta o'yinni qanday yig'asiz» o'tadi · «ilovani 5 000 ga olasizmi» bloklanadi · «kitobni qayerdan topasiz» o'tadi · «arzon narxda olarmidingiz» yumshoq · «+998 90 …» bloklanadi); narx soni bo'shliq bilan ko'rsatiladi («15 000»).
   Saqlash → `pm-m11d6-suhbat.skript` (4 satr, to'liq gap), `savedAt`. ✎ — savolni tahrirlash (o'sha tekshiruvlar bilan).
8. **s7** — `skript` dan o'qiydi (6-ekran saqlanmagan bo'lsa — kulrang qator «Avval suhbat savollaringizni yozing» va 6-ekranga qaytish tugmasi; Mentor rejimida — Mentorning suhbat savollari); 1-qism (tur; real — sherikning «Roziman» tugmasi bilan), 2-qism (1, 2-savol — «Keyingi savol», keyin `hozir` maydoni; 3-savol — maydon + belgi tugmalari; «yo'q»/«qimmat» → 4-savol, «yo'q»da «O'tkazish»), 3-qism (ko'rinish + «Saqlash»);
   yozuv `{ id: 's1'…, tur, kim, hozir, gap, javob, narxi, qachon: 'YYYY-MM-DD' }` (`kim`: real bo'lsa «{rol} (sinfdosh)», mashq bo'lsa «{rol}») → `suhbatlar` ga qo'shiladi (darsda ≤ 2: bittadan `mashq` va `real`); `xulosa: null`; tekshiruvlar (bo'sh · telefon shakli/akkaunt · belgi — bloklaydi; xulosa so'zlari · «ha» + «qimmat» · boshqa 7+ raqam · `hozir` bo'sh — yumshoq) — `node` da namunalar bilan («1000000 bo'lsa olardim» — yumshoq, «90 123 45 67» — bloklanadi);
   yakka rejim — suhbat savollari va «Ovoz chiqarib o'qidim» (yozuv yo'q); nishon `recorded` (birinchi «Saqlash»). Ichki holat dars progressida (yarim yozilgan yozuv qayta ochilganda o'z joyida — E 51).
9. **Mentor rejimi:** o'quvchilar ro'yxatida faqat saqlash signallari («Savollarni yozdi» · «Yozuv saqladi»; `PRACTICE_BASE`); gap, belgi, narx, `tur` Mentorga ham uzatilmaydi va proyektorga chiqmaydi (TAQIQLAR 3). 0-ekrandagi sinf ovozlari — faqat variantlar soni.
10. Testlar s3/s5/s8 — `correctIdx` 2/1/3 = `INLINE_KEYS`; `RECAPS` {3, 5, 8} (`ic` → 1/2/3 + `ask`); `Q_LABELS` {3, 5, 8}. Savol ustida yorliq yo'q (SABOQ 6); javobdan keyingi kichik vizual — `QuestionScreen` `vizual` (SABOQ 4).
11. `ACHIEVEMENTS` 4 (`justAsk`, `askFirst`, `wordForWord`, `recorded`) + `ACH_TRIGGERS`. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3 — arena jadvali) + `set_quiz_keys`; `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — `sflash` alohida ekranda. `SCREEN_INTENTS`.
12. s11 `QYakun`: sarlavha **besh holat** — `pm-m11d6-suhbat` dan (`skript` to'liq / qisman / yo'q · `suhbatlar` da `real` / faqat `mashq` / bo'sh) (P-046, E 54); `recap` 5 qator = «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» ko'rsatilmaydi (E 50);
    `uyga` — `HwCard` (Kim bilan · Nechta · Muddat + ①②③④; ④ holatdan yig'iladi); `keyingi` — «Foydalanuvchiga shartlarni qanday ochiq aytasiz?». Yordam darajalari (P-033): qulf-yorliq · ipucha 40 s · rescue 110 s.
13. App.jsx `m11-06` qatoriga `comp: PmMoneyTalkLesson` + import — asosiy seans, «qur» bosqichida (nom va osti o'zgarmaydi — DE-205 ✓, App.jsx 450-qator). Bu agent App.jsx ga tegmaydi.
14. **REPO — yo'q** (PM darsi; tayanch 3: `m13-dars-06-done` = `05-done`).
- Darvozalar: `npm run gates -- src/11-Modull/PmMoneyTalkLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` 0 · `lint:jsx` 0 · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30) · maket kesilmasligi (E 41) · haqiqiy click bilan har tugma (E 47).
  ⚠️ CSS izohida va matn konstantalarida backtik yo'q (template-satr tuzog'i, CLAUDE.md).

## Manbalar (07.10.2026)
- Bu darsda tashqi xizmat qadami yo'q — rasmiy tashqi sahifa **ochilmadi** (tugma, menyu, narx, limit yo'q). Telegram faqat Mentor misolidagi gapda («Telegram guruhi tekin-ku…» — tayanch 1.6) va 4-darsdagi raqobat sifatida (tayanch 1.4) tilga olinadi; keys emas (K2 — faqat 2-darsda, TAQIQLAR 8).
- Suhbat savollari, javob belgilari, uch suhbat, Mentor xulosasi, rol o'yini, real suhbatlar kimlar bilan — `00-MODUL-TAYANCH.md` 1.6 (aynan); Pro va kim to'lashi — 1.0; narx va to'lov taklifi ekrani — 1.4; sonlar — 1.13; kalitlar — 8; qarorlar — `GATE_M_JAVOB.md` Qaror-0 1, 2, 11.
- Xavfsizlik: `00-TAQIQLAR.md` 1, 3 · 12-Modul tayanchi 1.6 (olti bandli ro'yxat), 9.38 d (ota-ona bandi Mentor bilan yopilmaydi), 9.39 e (sinfda sanash yo'q). Intervyu so'zlari — 11-Modul tayanchi 1.3, `03-PmInterviewsOne-v3.md`; `pm-m9d3-intervyu` shakli — 11-Modul tayanchi 8.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. ✅ **Yopildi — GATE M M-q2 A (07.10): o'quvchi matnida «suhbat savollari», kalit maydoni `skript` ichki.** Avvalgi savol: **«skript» atamasi** — Qaror-0 2 va tayanch 1.6 so'zi bilan qoldirdim, ta'rifi 2-ekranda. Lekin: (a) 9-Modulda o'quvchi matnida «Umami skripti» — kod qatori ma'nosida (T-015 modullararo); (b) rus tilida bu so'z ko'pincha «sotuv skripti» ma'nosida ishlatiladi, dars esa «sotish emas» deydi.
   Muqobil — «suhbat savollari» (kalit nomi `skript` qoladi). Qaror kerak; RU bosqichiga ham tegadi.
2. **O'quvchi suhbat savollari qolipi** — Mentornikidan: 1-savol «Hozir [ … ] va bunga qancha vaqt ketadi?» (Mentor gapidagi «haftada» o'quvchi qolipida yo'q — mahsulotga qarab davr boshqa), 2 va 4-savol o'zgarmaydi, 3-savolda «[nima]» — o'quvchi yozadi.
   F-1007-464: `pm-m11d2-model.kim` va `.nima` oldindan to'ldiriladi (o'quvchi tasdiqlaydi yoki o'zgartiradi); tayanch 8 o'quvchilar ro'yxatiga 6-dars qo'shildi. Placeholder'lar Mentor misolidan («masalan: o'yinni qanday yig'asiz», «Qulaylik nomi — masalan: Doimiy o'yin»).
3. **1, 2-savol javoblari kalitga yozilmaydi** — `gap` faqat narx haqidagi gap (3 va 4-savol javobi). F-1007-464: 1, 2-savol javobi (hozir nima qiladi, nimaga pul sarflaydi) 2-savoldan keyin bitta qisqa qator bo'lib `hozir` ga yoziladi (≤ 80; bo'sh — `null`); kalit shakli o'zgarmadi (`hozir` tayanch 8 da bor edi).
4. **2-tashkilotchiga 4-savol berilganmi va javobi** — tayanchda yo'q (suhbat savollari bo'yicha «yo'q» javobida 4-savol beriladi). Darsda faqat uning 3-savoldagi gapi ko'rsatiladi; 4-savol javobi to'qilmadi.
5. **Sotish gaplari (2-ekran, ikkitasi)** — tayanchda yo'q; TAQIQLAR 1 va tayanch 1.6 iboralaridan yig'ildi (A-6). Mentor ularni aytmaydi — ekranda «Mentor bunday demaydi».
6. **`suhbatlar` soni** — tayanch «(0–3)». Darsda ≤ 2 yozuv (bitta mashq, bitta real). Uydagi uchta real suhbat qo'shilsa, mashq bilan 4 bo'ladi — taklif: «real 0–3 + mashq 0–1» yoki mashq yozuvi uy suhbatlari kiritilganda o'chadi.
7. **Uy suhbatlari kalitga qanday tushadi** — uyga vazifada: qog'ozga (11-Modul 3-dars naqshi; 6-dars keyingi darslarni va'da qilmaydi). Variantlar: (a) 9-dars ularni kiritadi («yo'q bo'lsa — o'quvchi o'zi yozadi», tayanch 8); (b) 6-dars qayta ochilsa, 7-ekran yozuv qo'shishga ruxsat beradi. Men (a) ni tavsiya qilaman; (b) — LMS da dars qayta ochilishi va boshqa qurilma sinalmagan.
8. **`kim` shakli** — mashqda «{rol}», realda «{rol} (sinfdosh)» (PM-018: rol birinchi, munosabat qavsda). Uy suhbatlarida — «{rol} (ota-ona)», «{rol} (mahalla guruhidagi tanish)» kabi. F-1007-464: alohida `aloqa` maydoni qo'shilmadi — 9, 11-darslar munosabat bo'yicha ajratmaydi.
9. **`narxi` qoidasi** — «ha»da suhbat savollaridagi narx (1.13: «ha (15 000)»), «qimmat»/«yo'q»da 4-savolda aytilgan son, «javob yo'q»da `null`. «Yo'q» deb, 4-savolda narx aytgan odam — belgini o'quvchi o'zi tanlaydi (dars belgini o'zgartirmaydi). «Yo'q»da 4-savol sababi narx bo'lmasa o'tkaziladi — `narxi: null` (F-1007-464).
10. **`xulosa`** — tayanchda turi yo'q. Bu darsda `null` (yozuvlar — mashq yoki bitta real; xulosa uchun kam). Taklif: uy suhbatlaridan keyin o'quvchining bitta gapi (`string`), Mentor xulosasi shaklida — qaysi darsda yozilishini 9-dars MD si hal qiladi.
11. **«Pul olinmaydi — "ha" desa ham» va «to'lov sahifasi, "mashq to'lov" havolasi odamlarga berilmaydi»** — TAQIQLAR 1 va SU-q1 A (9-dars) dan 6-darsga men ko'chirdim (A-9, 7-ekran, yakun, arena 8).
12. **Darsdagi real suhbat sharti** — sherik haqiqatan o'quvchi mahsulotida to'laydigan rolda bo'lsa va o'zi rozi bo'lsa («Roziman — o'zim uchun javob beraman» ni sherikning o'zi bosadi; F-1007-464); tayanch: «sinfdosh auditoriya bo'lsa». Ko'p o'quvchida sherik to'laydigan odam bo'lmaydi — faqat mashq (Shubhali 2).
13. **«Mentor bilan rol o'yini» (Qaror-0 2)** — jonli darsda Mentor (o'qituvchi) juftliklardan oldin bitta o'quvchi bilan ko'rsatadi (7-ekran O'qituvchi eslatmasi, A-6 gaplari bilan); yakka rejimda — savollarni ovoz chiqarib o'qish, rol o'yini uyda.
14. **Hook maketi** — 4-darsdagi to'lov taklifi ekrani (`pm-m11d4-narx.ekran`) telefonda; kalit yo'q bo'lsa — Mentor ekrani (1.4).
15. **Reja chap qatori** — menyu osti «narx bo'yicha uchta real suhbat» so'zma-so'z + kulrang chegara qatori (darsda — suhbat savollari va mashq). Menyu ostining o'zini o'zgartirmadim (NOM-q0 A).
16. **Sahna** — Mentor va tashkilotchi yuzma-yuz chizilgan, joy ko'rsatilmaydi; tayanchda suhbat qayerda (yuzma-yuz, qo'ng'iroq yoki xabar) bo'lgani yo'q.
17. **«so'zma-so'z» va «u aytganidek»** — bir gapda tenglashtirildi (4-ekran Mentori «intervyudagidek», kartochka 6), keyin faqat «so'zma-so'z».
18. **Yakun sarlavhalari** — besh holat (A-1); ✓ va nishon — suhbat savollari + kamida bitta yozuv bo'lganda.
19. **Mentor statistikasi** — faqat «Savollarni yozdi» va «Yozuv saqladi»; belgilar, gaplar va real/mashq bo'linishi ko'rsatilmaydi (TAQIQLAR 3 ning o'qilishi).
20. **Modeli reklama yoki B2B bo'lgan o'quvchi** (2-darsdagi tanlovi) — to'laydigan odam (reklama beruvchi, boshqa biznes) tanish doirada bo'lmasligi mumkin. Dars buni hal qilmaydi: 6-ekranda «Kim to'laydi» — o'quvchining o'zi; tanishlar orasida shu rol bo'lmasa, uyga vazifada suhbat yo'q — halol natija. F-1007-464 (ChatGPT ham shu variantni qabul qildi): shu rolga o'xshash tanish real sanalmaydi; tanish doirada bu rol bo'lmasa — real suhbat 0, mashq bilan davom etadi, bu halol natija (uyga vazifa ①, A-9).

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **90 daqiqa** — 7-ekran ≈ 25 daqiqa (Mentor ko'rsatishi + ikki yo'nalish + imkon bo'lsa real suhbat), 6-ekran ≈ 12. Bu — reja: «qur» pilotida 12–15 o'quvchi bilan taymer bilan o'lchanadi. ChatGPT bahosi — 95–110 daqiqa (o'lchanmagan; F-1007-464).
2. ⛔ **Darsdagi real suhbat** — sherik o'quvchi mahsulotida to'laydigan odam bo'lishi kam (masalan, Mentor misolida to'laydigan — tashkilotchi, sinfdosh esa ko'pincha o'yinchi). Ko'p o'quvchida darsda faqat mashq yozuvi bo'ladi — yakun ikkinchi holati shuning uchun ✓ bilan.
3. **3-savol — bo'lajak ish haqida** («olarmidingiz?»): 9, 11-Modul intervyu texnikasida kelajak savoli «bo'sh savol» deb o'rgatilgan. Tayanchdagi savollar shunday; dars javobni «so'z — hali to'lov emas» va «narx haqida dalil, isbot emas» deb chegaralaydi (4, 8-ekran, kartochka 10). F-1007-464: 2-ekranning 4-kartasida ham aytiladi — «Javobi — so'z, hali to'lov emas».
4. **Ismni tekshirib bo'lmaydi** — erkin matnda ismni dastur aniqlay olmaydi; bloklanadi faqat telefon va akkaunt shakli (raqam, «@», «t.me/»). Ism — kulrang qator va Mentor ko'rigi bilan.
5. **Yumshoq tekshiruvlar** (xulosa so'zlari, sotish so'zlari, «siz» qo'shimchasi, kelajak shakli) — erkin matnda noto'g'ri ishlashi mumkin; bloklamaydi. `node` sinovida namunalar bilan (KOD 7, 8).
6. ✅ **«skript» → «suhbat savollari»** — GATE M M-q2 A (TAYANCHGA SAVOL 1).
7. **Sotish gaplari ichida yolg'on** («boshqa tashkilotchilar ham oldi» — Mentor misolida hech kim olmagan) — anti-namuna sifatida; ekranda «Mentor bunday demaydi» deb yopiladi. Auditor «Mentor misoli ichki izchil» sinfi bilan so'rashi mumkin.
8. **Hook variantlari** uch javob turini (ha · qimmat · yo'q) oddiy so'z bilan oldindan ko'rsatadi — 4-ekran belgilari kashfiyoti to'liq ochilmaydi (atama va «javob yo'q» yo'q), lekin P-036 nuqtai nazaridan bahsli.
9. **Uy suhbatlari kalitga tushmaydi** (bu darsda) — 9-dars ularni o'qiy olmaydi; TAYANCHGA SAVOL 7.
10. **«Maydon Jamoa» telefon maketida faqat 0-ekranda (Mentor holati)** — boshqa ekranlarda nom varaq sarlavhasida o'z rangida (12-Modul 11-dars naqshi). Vizual bosqichda tekshirilsin (TAQIQLAR 0).
11. **Arena 9 «Mahsulot kerak bo'lmagan odamni»** — «auditoriyadan tashqari» degan ma'noda; auditor «u ham fikr berishi mumkin» desa, savol «narx haqidagi suhbat» bilan chegaralangan.
12. **Arena 2 D «To'rtinchi savolda»** — 4-savolda odam o'z narxini aytadi, lekin so'rovchi narx aytmaydi; savol «narx aytiladi» (so'rovchi) — bitta javob himoyalanadi, ammo nozik.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 16 band + 12-Modul tayanchi 7 + 13-Modul pul sinflari)
1. [x] **90 daqiqa — reja, o'lchov emas** — A-10 taqsimot va «Ulgurmagan o'quvchi yo'li»; ⛔ pilotda taymer (Shubhali 1); «sig'adi» deyilmaydi; tashqi kutish yo'q.
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — tashqi xizmat qadami yo'q (Manbalar); real suhbat va 7-ekran vaqti — ⛔ pilotda (Shubhali 1, 2); LMS da darsni qayta ochish — tekshirilmagan, darsga tayanmaydi (TAYANCHGA SAVOL 7).
3. [x] **Saqlash kaliti — shartnoma** — A-11: har maydon, tipi, `tur` (`real` / `mashq`), `id` barqaror, `narxi` uch holat, `xulosa: null` va nega, `qachon` shakli; ≤ 2 yozuv; kalitga ism yo'q; dars boshqa darsning kalitiga yozmaydi (`pm-m11d4-narx`, `pm-m9d3-intervyu` — faqat o'qiladi).
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — xulosalar «Bu darsda …» (2, 4-ekran, yakun); suhbat savollari — «Mentorning savollarini … moslang» (6-ekran), ✎ bilan o'zgartirish mumkin; to'rt savol, to'rt belgi — kurs qolipi, o'quvchi mahsulotiga majburiy shakl emas (6-ekran Yordami).
5. [x] **Kafolat va sabab da'vosi yo'q** — «"Olaman" — so'z: odam hali to'lamagan» (8-ekran); «isbot emas» — nimaning isboti emasligi aytilgan (kartochka 10, yakun); «tasdiq oldi = sotdi» yo'q; Mentor narxni o'zgartirmadi — sabab da'vosi qo'yilmagan (4-ekran eslatmasi).
6. [x] **Yakun, «Bajardim», yashil xabar, nishon — faqat rost holatda** — yakun besh holat (11-ekran; E 54); 7-ekran xulosasi uch holat; nishon «Recorded!» faqat saqlanganda, yakka rejimda yo'q; nishon tavsiflari qilingan ishni aytadi.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — «uchtagacha real suhbat» — real yozuvlar soni (`tur: 'real'`), mashq kirmaydi (7-ekran `QIzoh`); belgi — har yozuvga bitta; «kichik son» — uch suhbat haqida.
8. [x] **Test: bitta himoyalanadigan javob** — 3, 5, 8-ekran va arena: distraktorlar uch xil turkumdan (Izoh qatorlari), hayotda rost bo'lib qoladigan variant yo'q (arena 11 D «Kim ekani umuman yozilmaydi» — «ism yozilmaydi» qoidasi bilan aralashib, ikkinchi to'g'ri javobga aylanmasligi uchun), inkor-savol yo'q (arena 11 qayta yozildi), to'g'ri javob yolg'iz eng uzun emas.
9. [x] **Real odamlar xavfsizligi** — A-9: ota-ona bandi Mentor bilan yopilmaydi (uyga vazifa ①: «Ota-onangizga ayting»); sinfda sanash yo'q, Mentor statistikasida belgi yo'q; o'quvchi Mentor nomidan tasdiqlamaydi (bu darsda Mentor tasdig'i yo'q); bitta chatga ko'p xabar, notanishga yozish — yo'q (arena 9, 10); ixtiyoriy narsa majburiydek aytilmaydi («uchtagacha»).
10. [x] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — agent yo'q; rol o'yini va suhbatni o'quvchi o'zi o'tkazadi; sun'iy yozuv yo'q (mashq — `tur: 'mashq'` bilan ajratilgan).
11. [x] **Web-trek teng yo'l** — PM darsi, blok yo'q; matnda «mahsulotingiz», ilova emas (A-13); kalitlar ikkala trekda bir.
12. [x] **Mentor misoli ichki izchil** — uch suhbat, suhbat savollari, narx — tayanch 1.4, 1.6 aynan; keyingi darsning sonlari (6 tashkilotchi, tasdiqlar) ochilmagan (A-7); sahna uchun yangi tafsilot — TAYANCHGA SAVOL 4, 5, 16.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — kim to'laydi, hozirgi ish, nima, narx — o'quvchida (6-ekran); narxni Mentor aytmaydi (O'qituvchi eslatmasi); agent prompti yo'q.
14. [x] **Uyga vazifa yengil va aniq** — 4 band, «uchtagacha», qog'ozga, muddat — keyingi darsgacha; ④ faqat qolgan qism bo'lsa; kam bo'lsa — halol natija.
15. [x] **Ayb da'vosi yo'q** — xato izohlari harakatga chaqiradi («qayta o'qing», «shuni yozing»); «xatongiz emas», «sizda emas» yo'q.
16. [x] **Kelajak va'dasi yo'q** — keyingi darslar (tasdiq, hujjatlar) va'da qilinmaydi; to'lov taklifi ekranida faqat 4-darsdagi matn; «tez orada» yo'q.
- [x] **12-Modul tayanchi 7 (14 band)** — holatga qarab yakun (11-ekran) · da'vo isbot emas (4, 8-ekran) · maxfiy qiymat yo'q (agent, `.env` bu darsda yo'q) · tashqi xizmat — yo'q · har sonning manbasi (A-7: «Mentor misolida», «Mentorning taxmini») ·
  tayanchda yo'q narsa — TAYANCHGA SAVOL · kalit o'qiydigan darsdan (9, 11) · test bitta javob · keys — [—] keyssiz · 90 daqiqa · bir ma'no — bir so'z (A-5) · web-trek teng · agent yo'q · o'smir xavfsizligi (A-9).
- [x] **13-Modulga xos (pul)** — real pul yo'q (A-9, 7-ekran, yakun, arena 8) · karta ma'lumoti hech qayerda (maket — faqat to'lov taklifi ekrani, karta formasi yo'q) · «mashq to'lov» bu darsda ishlatilmaydi va odamlarga berilmaydi ·
  «Test rejim: pul yechilmaydi» har to'lov ekranida (0, 6-ekran telefoni) · narx — «Mentorning taxmini» (A-6, 0-ekran) · suhbatda bosim yo'q (2-ekran, 6, 7-ekran tekshiruvi) · oferta — [—] bu darsda yo'q.

## O'lchov — `md06/olchov.py` natijasi (qavsdagi sonlar skript bilan tekshirilgan)
```
Qavsdagi uzunliklar: 138 ta — matn bilan mos (skript har «(N)» ni oldidagi matnga solishtiradi; 7 tasi — «- » yoki «(umumiy)» bilan
  boshlangan qatorlar — qo'lda qayta sanaldi; qolgan 16 signal — ekran, bo'lim va savol raqamlari, uzunlik emas).
Sarlavhalar (12 ta, holat variantlari bilan): 25–55 · ≤55, hammasi bitta qator.
Xulosalar: 2-ekran 89 · 4-ekran 86 · 6-ekran 82 · 7-ekran 61 / 64 / 53 · ≤110.
QIzoh qatorlari: 41–83 (bitta qator; 2-ekran 4-karta 83 va ta'rif 75 — F-1007-464). Ipucha: 62 · 54.
Bugungi asosiy fikr (A-2, yakunda ko'rsatilmaydi): 105 · ≤110.
Hook javobi: 112 · ≤120 (sof so'rovnoma — uchala variantga bitta javob); hook variantlari 18 · 19 · 18.
To'g'ri izohlar: 50 · 49 · 38 · ≤60.
Xato izohlari va QXato (34 ta): 23–55 · ≤60.
Nishon tavsiflari: 34 · 38 · 32 · 43 · ≤48 (KORPUS §63).
Mentor gaplari: kirish 2 gap (83) · reja 2 gap (110) · interaktiv 2, 4, 6, 7-ekran — 1 gap (79–89);
  sarlavha so'zlari Mentorda (`overlap.py`): 0/4 · 0/6 · 1/5 · 0/6 · 0/4 · 1/5 · 1/5 — hech qayerda ≥50% emas; «Bu…», «Hammasini…» bilan boshlanmaydi.
Test savollari: 3-ekran 10 so'z · 5-ekran 10 · 8-ekran 10 · arena 4–8 · ≤12.
3-ekran: A 41 · B 40 · ✔C 40 · D 38 | min/max 38/41 (+8%)
5-ekran: A 42 · ✔B 40 · C 42 · D 42 | min/max 40/42 (+5%)
8-ekran: A 36 · B 35 · C 35 · ✔D 36 | min/max 35/36 (+3%)
arena 1: ✔A 36 · B 35 · C 36 · D 34 | +6%
arena 2: A 34 · B 35 · ✔C 33 · D 31 | +13%
arena 3: A 31 · ✔B 33 · C 33 · D 33 | +6%
arena 4: A 28 · B 29 · C 32 · ✔D 29 | +14%
arena 5: ✔A 31 · B 30 · C 31 · D 30 | +3%
arena 6: A 28 · ✔B 30 · C 30 · D 28 | +7%
arena 7: A 30 · B 28 · ✔C 30 · D 29 | +7%
arena 8: A 30 · B 29 · C 32 · ✔D 28 | +14%
arena 9: ✔A 29 · B 28 · C 31 · D 31 | +11%
arena 10: A 29 · ✔B 31 · C 30 · D 31 | +7%
arena 11: A 24 · B 24 · ✔C 26 · D 27 | +12%
arena 12: A 31 · B 32 · C 30 · ✔D 32 | +7%
To'g'ri variant hech bir testda yolg'iz eng uzun emas.
ARENA ✔ taqsimoti: {'A': 3, 'B': 3, 'C': 3, 'D': 3}
```
Belgilar soni — bo'shliq bilan, `**` siz (Python `len`). `npm run lint:til feedback/F-1007-13modul/06-PmMoneyTalk-v3.md` — **0 error, 0 warn** (birinchi yurishda 6 error va 8 warn edi: ekran elementi uchun inglizcha so'z «tugma» bilan, animatsiya so'zi «to'lqin» bilan almashdi, va'da-qatorga o'xshagan ibora qayta yozildi, kirill so'z TAYANCHGA SAVOL 1 dan olindi).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 449–451 (grep 07.10) — `m11-05` «Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz» → **`m11-06` «Pul haqida qanday gaplashasiz?»** (osti «narx bo'yicha uchta real suhbat» — 1-ekran chap yorlig'i so'zma-so'z) →
  `m11-07` «Foydalanuvchiga shartlarni qanday ochiq aytasiz?» (yakundagi «Keyingi dars» qatori). 0-ekran sarlavhasi — dars nomi.
- [x] Bitta misol-ip — «Maydon Jamoa» (Pro, «Doimiy o'yin», Mentorning suhbat savollari, uch suhbat — tayanch 1.0, 1.4, 1.6); ikkinchi misol faqat testlarda (kitob almashish ilovasi — P-002); keyssiz; metafora yo'q; bitta vizual — `SuhbatVaraq` (telefon · sahna · varaq).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2 (tugma → gap varaqdagi uyaga uchadi yoki «Mentor bunday demaydi»ga tushadi), 4 (belgi tugmasi → belgi katakka, son narx katagiga uchadi) + 0, 6, 7; testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q.
- [x] O'lchov (python, `md06/olchov.py`, `overlap.py`): sarlavha 25–49 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 (53–89) · hook javobi 112 · to'g'ri izoh 38–50 · xato izohi 24–55.
- [x] Atamalar oldingi darslar bilan bir (grep): narx, to'lov taklifi ekrani, test rejim, Pro, «Doimiy o'yin» — 13-Modul tayanchi 2 · intervyu, «u aytganidek», mashq yozuvi — 9, 11-Modul · dalil, olti bandli ro'yxat — 12-Modul ·
  yangi: suhbat, suhbat savollari, so'zma-so'z, javob belgisi, rol o'yini, real suhbat, kichik son — misoldan keyin, ta'rif dars bo'yi bir xil · siz-forma; tugmalar ot-shaklda yoki siz-formada («Savol», «Sotish gapi», «Keyingi savol», «Saqlash», «Rol o'ynab javob beradi»). «skript» → «suhbat savollari» (GATE M M-q2 A).
- [x] Testlar: 4 variant, bir shaklda, farq ≤15% (3–14%); to'g'ri javob yolg'iz eng uzun emas; kalit so'z faqat to'g'rida emas («so'zma-so'z» 5-ekranda B va C da); inkor-savol yo'q; javobda savoldagi so'z takrorlanmaydi · ✔ o'rni 3-ekran C, 5-ekran B, 8-ekran D (yangi dars) · arena A·B·C·D ×3.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✕ › ✎ — belgilar) · kafolat so'zlari yo'q («har doim», «hech qachon», «darrov», «albatta», «100%» — o'quvchi matnida 0) · xulosalar «Bu darsda …» bilan chegaralangan.
- [x] Ichki kodlar o'quvchi matnida yo'q (`m11-06`, «A1», «Modul 13», K-raqam yo'q; modul raqami LMS bo'yicha — «11-Modulda», «9-Modulda», «4-darsda»); tarixiy voqea yo'q (keyssiz); «KOD» ro'yxati 14 band, REPO yo'q.
- [x] Karta T · P · S · PM: T-008 (tashkilotchilar gapi, Mentor yozuvi — olam ichidagi matn) · T-011/PM-030 (suhbat, suhbat savollari — 2-ekran oxirida; belgi, kichik son — 4-ekranda) · T-014/T-015 (A-5: suhbat/rol o'yini, sotish, belgi, yozuv, tasdiq yo'q) ·
  T-016/T-017 (metafora yo'q) · T-020 · T-024 · T-029/T-047 · T-038 (keyingi darslar va'da qilinmaydi) · T-039 («narxingiz» — 4-darsda bor; kalit yo'q bo'lsa Mentor varianti) · T-042 (ta'riflar so'zma-so'z: 2, 4-ekran, kartochka, yakun) · T-043 («Mentor misolida», «Bu darsda») · T-045 («olaman» — to'lov emas) · T-048 · T-049 · T-052 (intervyu ↔ suhbat, «u aytganidek» ↔ so'zma-so'z) · T-064 · T-070 («tanish» ↔ «notanish») ·
  P-001 · P-002 · P-004 (6, 7 — o'z mahsuloti) · P-008 · P-012 (testlar 3, 5, 8 ketma-ket emas) · P-013 · P-014/P-015 · P-016 · P-025 · P-026 (kalit yo'q bo'lsa — o'zi yozadi) · P-033 · P-036 · P-046 · P-048 · P-052 · P-055 · P-062 · P-064 · P-067 ·
  S-001 (savollar 4–10 so'z) · S-002/S-004/S-010 · S-006 · S-008 · S-015 · S-019 · S-020 · S-026 · S-027 · §102 · §110 · §119 · §144/§145 · PM-005 (2-tur) · PM-018 (`kim` — rol, munosabat qavsda) · PM-020 (1, 3-savol qoliplari to'liq gap) · PM-021 · PM-027 · J-026 · SABOQ 1–39, E 40–55.
- [x] Pul va xavfsizlik (TAQIQLAR 1, 3): real pul yo'q, karta ma'lumoti yo'q, «Test rejim: pul yechilmaydi» har to'lov ekranida, narx — «Mentorning taxmini», bosim yo'q, faqat tanish doira, ism/telefon/Telegram nomi yo'q, sinfda sanash yo'q, Mentor uch suhbati va suhbat savollari — tayanch 1.6 aynan.
