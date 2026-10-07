# 13-Modul · 12-dars «Loyiha kuni: barqarorlashtirish» — MD v3 (yangi dars, loyiha kuni qolipi)

Fayl: `src/11-Modull/StabilizeDayLesson.jsx` (kalit `m11-12`, App.jsx `type: 'Proyekt'`) · **12 ekran** (8 dars ekrani + 3 amaliyot bloki + kartochkalar; SABOQ 12) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. Loyiha kuni, keyssiz (Qaror-0 21). Qolip: QKirish · QReja · QTushuncha ×2 · QTest ×2 · QBlok ×3 · podium · QKartochka · QYakun. Kod — `src/skelet/NamunaDars.jsx` dan.
Menyu (DE-205, App.jsx 455–457): `m11-11` «Mahsulotingiz hozir qayerda?» → **`m11-12` «Loyiha kuni: barqarorlashtirish»** (osti «asosiy yo'llarni tekshiramiz va tuzatamiz») → `m11-13` «Zaxira dars» (`comp` siz).
Namuna (tuzilish, hajm): 12-Modul `05-BreakAndFix-v3.md` + `05-FILTR.md` (buzish yozuvi, «Tuzatish qilindi», o'sha usul bilan qayta tekshirish) · 12-Modul `09-RetentionDay-v3.md` + `09-FILTR.md` (loyiha kuni shakli, uch blok, tekshiruv yozuvlarini `id` bo'yicha o'chirish, «uyda» yo'q) · pilot `03-PaymentWebhook-v3.md` (to'lov oqimi, mashq to'lov) — matn ko'chirilmadi.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul C 19–31, 11-Modul D 32–39, 12-Modul E 40–55 — majburiy): kartochkalar alohida ekran, Mentorsiz · test yorlig'i yo'q · navbatdagi harakat doim ko'rinadi (bitta tugma — halqa; variantlar — har birining o'z yengil chegarasi, E 40) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi · taxmin natijasi va QIzoh — yashil xulosa qutisi ichida (E 42) · telefon maketi chapda, o'lchami barqaror (≈170×272) · ≤3 blok · bo'sh ustun yo'q · maketda hech narsa kesilmaydi (E 41) · ko'p elementli mashq ketma-ket (E 53) · yakun — standart tarkib (E 50).
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 4-ekran **C** · 7-ekran **A** · final tartib-mashqi yo'q (loyiha kuni, 172) · arena A·B·C·D ×3.
Vaqt (reja, o'lchov emas): ≈ 90 daqiqa — 0–1 ≈ 5 · 2 ≈ 8 · Amaliyot 1 ≈ 25 · 4 ≈ 2 · 5 ≈ 6 · Amaliyot 2 ≈ 17 · 7 ≈ 2 · Amaliyot 3 ≈ 18 · podium, kartochkalar, yakun, arena ≈ 7 — jami ≈ 90.
⛔ 90 daqiqaga sig'ishi — «qur» pilotida taymer bilan o'lchanadi (besh tekshiruv, ikki tuzatish, Render kutishi, o'rnatish fayli navbati); o'lchanmaguncha da'vo emas (tayanch 7.1). Ulgurmagan o'quvchi yo'li — A-bo'lim 11.
⚠️ **Darsning chegaralari (TAQIQLAR 1, 3; tayanch 1.12):** yangi funksiya qo'shilmaydi — faqat yozuvdagi topilma tuzatiladi · buzib tekshirish — faqat o'quvchining **o'z mahsulotida** va tekshiruv uchun ochilgan hisoblarda · `XATOLAR.md` da qolgan topilma yashirilmaydi («qoldi» va sababi) ·
performance va «investor ko'zi bilan» demo-test bu darsda yo'q (14-Modul ishi — o'quvchi matnida va'da qilinmaydi, faqat O'qituvchi eslatmasida) · uyga vazifa yo'q (loyiha kuni).
⚠️ **Pul chegarasi (TAQIQLAR 1, Qaror-0 5, 6):** 3-tekshiruv — faqat «mashq to'lov» (test rejim), real pul yo'q · karta ma'lumoti hech qayerda (maketda, namunada, promptda yozilmaydi va chizilmaydi; mashq sahifasida karta maydoni yo'q) · maxfiy kalitlar faqat `.env` da, agentga yuborilmaydi ·
to'lov taklifi ekrani maketida «Test rejim: pul yechilmaydi», mashq sahifasi maketida «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.» · narx yonida yorliq «Mentorning taxmini».

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (tayanch 4, 1.12):** dars oxirida o'quvchining o'z mahsulotida **besh yo'l** buzish yozuvi bilan tekshirilgan (1 kirish va ro'yxat · 2 asosiy harakat · 3 to'lov oqimi — to'landi, rad, takror · 4 taklif havolasi · 5 eslatma yoki Telegram xabari);
   «buzildi» chiqqanlardan **eng muhim 1–2 tasi** agentga yozuv bilan berilgan, **«Tuzatish qilindi»** (ish fakti) va **o'sha usul bilan qayta tekshirilgan**; repo ildizida **`XATOLAR.md`** — har topilma usuli, natijasi va holati bilan, qolgani «qoldi» va sababi bilan;
   o'zgargan qismning **yangi versiyasi** odamlarga chiqarilgan. Yangi funksiya qo'shilmaydi. «Buzilmadi» ham natija — yakun sarlavhasi holatga qarab (11-ekran).
   Saqlash: **yangi kalit yo'q** (tayanch 8: «12-dars natijasi — repo'dagi `XATOLAR.md`»); besh tekshiruv kartasi dars holatida (`ccProgress`, KOD 3). O'qiladi: `pm-m11d5-buzish` (3-tekshiruv kartasi tepasidagi bitta qator) · `pm-m9d8-platforma.trek` (tayanch 4: trek qatorlari).
   Mentor misoli — «Maydon Jamoa», repo `maydon-jamoa`: `m13-dars-12-start` (= `m13-dars-11-done` = `m13-dars-10-done`, tayanch 3) → `m13-dars-12-done` (ikki tuzatish · `XATOLAR.md` · yangi versiya).
2. **Bugungi asosiy fikr (P-013; yakunda ko'rsatilmaydi — darsning ichki o'qi, SABOQ E 50):** Yangi ish qo'shilgach eski yo'llar ham buzish yozuvi bilan qayta tekshiriladi: eng muhim topilma tuzatilib, o'sha usul bilan qayta ko'riladi, qolgani `XATOLAR.md` da yashirilmaydi.
3. **Oldingi darslardan keladigan narsa (aynan):**
   - 12-Modul 5-darsi: **buzish yozuvi** — nima qildim · nima kutdim · nima bo'ldi → belgi **buzildi** / **buzilmadi**; «Tuzatish qilindi» (ish fakti) va «qayta tekshiruvda takrorlanmadi» / «qayta tekshiruvda yana buzildi» (natija) — alohida; kutish buzishdan **oldin** yoziladi.
   - 12-Modul 7-darsi: ro'yxatdan o'tish — ism, login, parol; band login — `409` «Bu login band»; «Hisobdan chiqish» va «Hisobni o'chirish»; namuna va tekshiruv akkauntlari (`namuna`); 9.35 a, 9.37 g — tekshiruv akkauntini agent ochadi, tekshiruvdan keyin faqat aytilgan `id` bo'yicha o'chiriladi; 9.41 i — sinfdagi sun'iy tekshiruv yozuvi haqiqiy sanoqdan chiqariladi.
   - 12-Modul 4, 9-darslar: **eslatma** (telefon ekraniga ilova chiqaradigan xabar; o'yin eslatmasi, uch kunlik eslatma). 9.28: brauzer ko'rinishi — `npx expo export -p web` → `netlify deploy --prod --dir dist` (push'dan keyin o'zi yangilanmaydi); 9.29: Render faqat `backend/` o'zgarsa qayta chiqaradi; «APK o'zi yangilanmaydi» — yangi o'rnatish fayli va lendingdagi havola.
   - 13-Modul 3–5-darslar: **takror xabar** (3-dars) — bitta to'lov raqami bir marta sanaladi · «mashq to'lov» sahifasi («To'lash (mashq)», «Rad etish (mashq)», «Ikki marta yuborish», «Imzosiz yuborish»; 5-darsdan «Kechiktirib yuborish», «Noto'g'ri imzo») · to'lov taklifi ekrani (so'zma-so'z, tayanch 1.4): «Doimiy o'yin — Pro'da» · «Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.» · «30 kun — 15 000 so'm» · «To'lovga o'tish» · «Test rejim: pul yechilmaydi» (+ «Pro shartlari» — 7-darsdan) ·
     «E'lon berish» ekranida «Har hafta takrorlansin»; keyingi hafta o'yini `GET /oyinlar` so'ralganda yaratiladi (agent 4-darsda «bir marta yaratiladi» degan — tekshirilmagan da'vo; asosiy seans, 07.10) · 5-dars tuzatishlari: Pro bir marta uzayadi, «Javob kutilmoqda» va «Qayta tekshirish», «To'lov o'tmadi — qayta urinib ko'ring», Pro muddati tugashi; `BUZISH.md` «To'lov»; kalit `pm-m11d5-buzish`.
   - 13-Modul 8-darsi: **Telegram xabari** — Backend Telegram bot orqali yuboradigan xabar; ilovada «Telegram'da xabar olish» va «Telegram xabarlarini o'chirish»; xabar shakli (tayanch 1.8): «Shanba, 18:00 o'yini yana e'lon qilindi · Mahalla maydoni — 3 / 10»; haftasiga ko'pi bilan ikkita.
   - 13-Modul 10-darsi: **taklif kodi** (6 belgi, katta harf va raqam), lending «Taklif kodi: AB12CD», ro'yxatdan o'tish formasida «Taklif kodi (bo'lsa)» — APK'da kod qo'lda yoziladi; `taklif_qilgan_id`; mukofot — Pro'ga 7 kun (yangi hisob + asosiy harakat; bir qurilma va namuna sanalmaydi); `10-done` da kod katta harf bilan solishtiriladi — kichik harf muammosini 12-dars topadi (tayanch 1.10).
4. **Mazmun (tayanch 1.12 — aynan):**
   - **Besh tekshiruv** — asosiy yo'llar, har biri buzish yozuvi bilan: 1) kirish va ro'yxat · 2) asosiy harakat (o'yin e'loni, qo'shilish) · 3) to'lov oqimi (muvaffaqiyatli, rad, takror) · 4) taklif havolasi · 5) eslatma yoki Telegram xabari. Yangi funksiya qo'shilmaydi.
   - **Mentor misoli natijasi:** 1, 2, 3 — **buzilmadi** · 4 — **buzildi**: taklif kodi kichik harf bilan yozilsa qabul qilinmadi → tuzatish: kod katta harfga o'tkazilib solishtiriladi ·
     5 — **buzildi**: ikki telefon bir vaqtda «O'yinlar» ni ochganda keyingi «Doimiy o'yin» ikki marta yaratildi va Telegram xabari ikki marta ketdi. Sabab: keyingi o'yin `GET /oyinlar` so'ralganda yaratiladi; ikki so'rov bir vaqtda kelsa, ikkalasi ham «hali yo'q» deb ko'radi →
     tuzatish: Database'da cheklov — bitta doimiy o'yin seriyasida bitta sana uchun bitta o'yin; ikkinchi yaratish urinishi jimgina o'tkazib yuboriladi. Ikkalasi «Tuzatish qilindi», qayta tekshiruvda takrorlanmadi.
     ⚠️ 5-topilma — asosiy seans qarori (07.10, muvofiqlashtiruvchi xabari): avvalgi «Pro tugagan «Doimiy o'yin» yana e'lon qilindi» 7-dars ofertasining 4-bandi va 5-dars A1 (Pro tugashi) bilan zid edi — ishlatilmaydi; tayanch 1.12 va 3 (`m13-dars-12-done`) shunga moslanadi.
   - **Mentorning besh tekshiruv yozuvi** (bitta manba `MENTOR_TEKSHIRUV`; 2-ekran, 1-amaliyot kutilgan natija va «Yordam», 2-amaliyot Yordami, 3-amaliyot kutilgan natija; matn — Mentorning o'zi, T-008; TAYANCHGA SAVOL 1–4):

   | № | Yo'l | Bu yo'lga tekkan darslar | Nima qildim | Nima kutdim | Nima bo'ldi | Belgi | Tuzatishdan keyin |
   |---|---|---|---|---|---|---|---|
   | 1 | Kirish va ro'yxat | 12-Modul 7-dars (login) · 10-dars («Taklif kodi (bo'lsa)») | Yangi tekshiruv akkaunti bilan ro'yxatdan o'tdim, hisobdan chiqib qayta kirdim; keyin shu loginni boshqa ro'yxatda yozib ko'rdim. | Kirgach «O'yinlar» ochiladi; band loginda «Bu login band» chiqadi. | Kirgach «O'yinlar» ochildi; band loginda «Bu login band» chiqdi. | buzilmadi | — |
   | 2 | Asosiy harakat | 11-Modul · 4-dars («Har hafta takrorlansin») | Tekshiruv akkauntidan yangi o'yin e'lon qildim; ikkinchi telefonda boshqa tekshiruv akkaunti bilan «Shanba, 18:00» ga qo'shildim, keyin o'yindan chiqdim. | Yangi o'yin «O'yinlar» da chiqadi; qo'shilganda «9 / 10», chiqqanda yana «8 / 10» — ikkala telefonda. | Yangi o'yin chiqdi; «9 / 10», keyin «8 / 10» — ikkala telefonda. | buzilmadi | — |
   | 3 | To'lov oqimi | 3, 4, 5-darslar · 10-dars (mukofot — Pro'ga 7 kun) | Tekshiruv akkauntida «Har hafta takrorlansin» ni bosib, to'lov taklifi ekranidan mashq to'lovga o'tdim: avval «Rad etish (mashq)», keyin yana «To'lovga o'tish» va «Ikki marta yuborish». | Rad etishda «To'lov o'tmadi — qayta urinib ko'ring», Pro yo'q; ikki marta yuborishda Pro 30 kunga bir marta yoqiladi. | Rad etishda «To'lov o'tmadi — qayta urinib ko'ring», Pro yo'q; ikki marta yuborishda Pro 30 kunga yoqildi, `tolovlar` da bitta «tolandi» qatori. | buzilmadi | — |
   | 4 | Taklif havolasi | 10-dars (taklif kodi; ilovada kod qo'lda yoziladi) | Taklif havolamni ikkinchi telefonda ochdim — lendingda «Taklif kodi: AB12CD». Ikki yangi tekshiruv akkaunti bilan ro'yxatdan o'tdim: birida kodni «AB12CD», ikkinchisida «ab12cd» deb yozdim. | Ikkala hisobda ham taklif qilgan odam yoziladi (Neon'da `taklif_qilgan_id`). | «AB12CD» da yozildi; «ab12cd» da kod qabul qilinmadi — taklif sanalmadi. | buzildi | Tuzatish qilindi · qayta tekshiruvda takrorlanmadi |
   | 5 | Eslatma yoki Telegram xabari | 12-Modul 4, 9-darslar (eslatma) · 4-dars («Doimiy o'yin» — keyingi o'yin «O'yinlar» so'ralganda) · 8-dars (Telegram xabari) | Tekshiruv akkauntida «Doimiy o'yin» e'lon qildim; Telegram'i ulangan boshqa tekshiruv akkaunti unga qo'shildi. Agent o'yin vaqtini o'tgan haftaga qo'ydi; men ikki telefonda «O'yinlar» ni bir vaqtda ochdim. | Keyingi hafta o'yini bitta yaratiladi, Telegram xabari bitta keladi. | Keyingi hafta o'yini ikki marta yaratildi; Telegram'ga «… yana e'lon qilindi» xabari ikki marta keldi. | buzildi | Tuzatish qilindi · qayta tekshiruvda takrorlanmadi |

   ⛔ Yozuv «qur» pilotida Mentor repo'sida `m13-dars-12-start` bilan haqiqiy telefonda olinadi; natija boshqacha chiqsa — yozuv, sahna, testlar va `XATOLAR.md` haqiqiy natijaga moslanadi, o'quv muvozanati uchun natija tanlanmaydi (12-Modul 9.37 a, b; Shubhali 1).
   - **Tuzatishlar** (tayanch 1.12 va asosiy seans qarori 07.10; Mentor misolida ikkalasi `backend/` da — TAYANCHGA SAVOL 5): 4 — kod katta harfga o'tkazilib solishtiriladi · 5 — Database'da cheklov: bitta doimiy o'yin seriyasida bitta sana uchun bitta o'yin; ikkinchi yaratish urinishi jimgina o'tkazib yuboriladi.
     Agentning sabab gapi (2-amaliyot kutilgan natijasi, olam matni): 4 — «kod katta harfdagi kod bilan harfma-harf solishtirilgan» (tuzatishdan kelib chiqadi) · 5 — «ikki so'rov bir vaqtda kelganda ikkalasi ham keyingi o'yinni «hali yo'q» deb ko'rgan» (asosiy seans sababi). Boshqa sabab to'qilmadi.
     Ko'prik (o'quvchi matnida bir marta — kartochka 8 izohi): 3-darsdagi takror xabar g'oyasi — bitta ish bir marta.
   - **Agentning to'rt taklifi** (5-ekran; bitta manba `AGENT_TAKLIF`; olam matni; TAYANCHGA SAVOL 8): 1) «Taklif kodini solishtirishdan oldin katta harfga o'tkazaman.» — tuzatish (4-topilma) · 2) «Ro'yxatdan o'tish ekraniga yangi dizayn beraman.» — yangi funksiya ·
     3) «Bir sanaga keyingi o'yin ikki marta yaratilmasligi uchun Database'da cheklov qo'yaman.» — tuzatish (5-topilma) · 4) «Pro tugashidan oldin tashkilotchiga Telegram xabari yuboraman.» — yangi funksiya. Qoida: **tuzatish — yozuvdagi topilmaga bog'lanadi; bog'lanmasa — yangi funksiya, bugun qo'shilmaydi.**
   - **Qaysi topilma birinchi (bu kursda; TAYANCHGA SAVOL 7):** avval — odamning asosiy ishini to'xtatadigan topilma; keyin — odamga noto'g'ri narsa ko'rsatadigan yoki yuboradigan (noto'g'ri Pro, keraksiz xabar, sanalmagan taklif). Qolgani bugun tuzatilmaydi — `XATOLAR.md` da «qoldi» va sababi.
   - **`XATOLAR.md`** (repo ildizida; tayanch 1.12: har topilma — usul · natija · holat) — Mentor misoli (bitta manba `MENTOR_XATOLAR`; 3-amaliyot kutilgan natija; TAYANCHGA SAVOL 6):
     ```
     # XATOLAR

     Barqarorlik tekshiruvi: besh yo'l, buzish yozuvi bilan.

     ## Taklif havolasi — kichik harfdagi kod
     - Usul: ikki yangi tekshiruv akkaunti bilan ro'yxatdan o'tdim; kodni birida «AB12CD», ikkinchisida «ab12cd» deb yozdim.
     - Natija: kutdim — ikkalasida taklif qilgan odam yoziladi; bo'ldi — «ab12cd» qabul qilinmadi, taklif sanalmadi.
     - Holat: Tuzatish qilindi · qayta tekshiruvda takrorlanmadi.

     ## Telegram xabari — keyingi «Doimiy o'yin» ikki marta
     - Usul: tekshiruv akkauntidagi «Doimiy o'yin» vaqti o'tgan haftaga qo'yildi; ikki telefonda «O'yinlar» bir vaqtda ochildi.
     - Natija: kutdim — keyingi o'yin bitta, Telegram xabari bitta; bo'ldi — o'yin ikki marta yaratildi, xabar ikki marta keldi.
     - Holat: Tuzatish qilindi · qayta tekshiruvda takrorlanmadi.

     Buzilmagan yo'llar: kirish va ro'yxat · asosiy harakat · to'lov oqimi.
     Tekshirilmagan yo'llar: yo'q.
     ```
     Holat so'zlari (sinf 5; tayanchdagi «tuzatildi» o'rniga): «Tuzatish qilindi · qayta tekshiruvda takrorlanmadi» · «Tuzatish qilindi · qayta tekshiruvda yana buzildi» · «qoldi — {sabab}». Topilma yo'q bo'lsa ham fayl yoziladi (besh yo'l «buzilmagan»).
   - **Yangi versiya — o'zgargan qismga qarab** (12-Modul 9.28, 9.29, 1.8; TAYANCHGA SAVOL 5): `backend/` — `git push` bilan Render'da (odatda o'zi yangilanadi) · `mobil/` — APK o'zi yangilanmaydi: yangi o'rnatish fayli (`eas build -p android --profile preview`) va lendingdagi havola; brauzer ko'rinishi — `npx expo export -p web` → `netlify deploy --prod --dir dist` ·
     web-trek sayti — push'dan keyin Netlify odatda o'zi yangilaydi (ko'rinmasa — qayta `netlify deploy --prod`, 12-Modul 9.40 i). **Mentor misolida ikkala tuzatish `backend/` da** — yangi versiya Render'da; APK va brauzer ko'rinishi o'sha Backend'ga ulanadi, ular uchun yangi fayl kerak emas.
5. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2 — ta'riflar so'zma-so'z):**
   - **barqarorlik tekshiruvi** — asosiy yo'llarni buzish yozuvi bilan tekshirish (tayanch 2 so'zma-so'z; 2-ekran nom qatorida, besh tekshiruvdan keyin — T-011). Ishlatilmaydi: stabilizatsiya (prozada), QA, regression, «test qilish». Dars nomidagi «barqarorlashtirish» — App.jsx nomi, o'zgarmaydi.
   - **yo'l** — odam mahsulotda boshidan oxirigacha bajaradigan muhim ish (bu darsda beshta, tayanch 1.12). ⚠️ «asosiy yo'l» (tayanch) va **«asosiy harakat»** (2-yo'l nomi; 12-Modul ta'rifi: «hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan») — bir ildiz: o'quvchi matnida «asosiy yo'llar» faqat ta'rif qatorida (2-ekran nom qatori, kartochka 1, «Endi siz bilasiz» 1), qolgan joyda «besh yo'l» (TAYANCHGA SAVOL 17).
   - **tekshiruv** — bitta yo'lni bir marta tekshirib yozish (12-Modulda «urinish» edi — bugun har yo'lga bitta); «tekshirish» — o'z ishini ko'rish. «sinov» bu darsda yo'q (real odam yo'q); «test» — faqat maketdagi «Test rejim: pul yechilmaydi» (ballik savol ekranda «savol»).
   - **buzish yozuvi** — 12-Modul 5-darsidan (uch qator + belgi). Bugun belgi uchta: **«Buzildi»** · **«Buzilmadi»** · **«Mahsulotimda hali yo'q»** (yo'q yo'l «buzilmadi» deb yozilmaydi — TAYANCHGA SAVOL 9). «buzish», «buzildi / buzilmadi» — dars atamasi (TAQIQLAR 5); «buzuq», «buzilgan» (sifat) — yo'q.
   - **topilma** — tekshiruvda «buzildi» chiqqan joy. **«Tuzatish qilindi»** — kodda o'zgartirish qilindi (ish fakti) · **«qayta tekshiruvda takrorlanmadi»** / **«qayta tekshiruvda yana buzildi»** — o'sha usul bilan ko'rilgan natija · **«qoldi»** — bugun tuzatilmagan topilma (sababi bilan). «tuzatildi», «endi ishlaydi», «isbotlandi» — yo'q.
   - **`XATOLAR.md`** — topilmalar ro'yxati fayli (tayanch 2). Ishlatilmaydi: bug-list, «bag».
   - **yangi funksiya** — mahsulotga qo'shiladigan yangi tugma, ekran yoki ish (bugun qo'shilmaydi). **yangi versiya** — o'zgargan qismning odamlarga chiqarilgan nusxasi (Render · o'rnatish fayli · brauzer ko'rinishi · Netlify).
   - **tekshiruv akkaunti** — tekshiruv uchun ochilgan hisob: namuna ism va login bilan, haqiqiy emas; dars oxirida `id` bo'yicha o'chiriladi (12-Modul «tekshiruv akkaunti» — o'quvchi matnida «hisob», UI «Hisobni o'chirish» bilan bir; TAYANCHGA SAVOL 10).
   - **Telegram xabari** (8-dars) va **eslatma** (12-Modul) — aralashmaydi; 5-yo'l nomi ikkalasini aytadi («eslatma yoki Telegram xabari»), o'quvchi o'z mahsulotidagisini tanlaydi.
   - **to'lov taklifi ekrani · mashq to'lov · test rejim · Pro · «Doimiy o'yin» · taklif havolasi · taklif kodi · mukofot** — tayanch 2 aynan; bu darsda yangidan ta'riflanmaydi.
   - **agent** (Antigravity) · **prompt** · **talab** (qayerda · nima qilsin · nima buzilmasin) · **sanoq yozuvi** (faqat tozalash qatorida) · **APK** · **o'rnatish fayli** · **brauzer ko'rinishi**.
   - **Ishlatilmaydi:** server (prozada), stabilizatsiya, QA, bug, regression, «sinov», «test qilish», «tuzatildi» (belgi sifatida), «hodisa» (sanoq yozuvi o'rnida), performance, demo-test, A1/A2/A3, `m11-12`, «Modul 13».
6. **Mentor misolidagi sonlar (tayanch 1.13 — aynan):** besh tekshiruv — buzilmadi **3**, buzildi **2** → «Tuzatish qilindi» **2**, qayta tekshiruvda takrorlanmadi **2**. Boshqa sonlar — oldingi darslardan, belgi sifatida: «Shanba, 18:00 · Mahalla maydoni · 8 / 10» → «9 / 10» (12-Modul namuna o'yini) ·
   «Taklif kodi: AB12CD» (tayanch 1.10) · «30 kun — 15 000 so'm» (yorliq «Mentorning taxmini», tayanch 1.4) · Pro'ga 7 kun (mukofot, tayanch 1.10). Sahna uchun yangi: tekshiruv «Doimiy o'yini» «Juma, 18:00 · Mahalla maydoni» va xabardagi «0 / 10» (TAYANCHGA SAVOL 3).
   Statistika yoki tadqiqot deyilmaydi (T-043); «besh tekshiruvdan ikkitasi» — Mentor misolining fakti, umumiy qoida emas.
7. **Metafora yo'q. Keyssiz** (loyiha kuni, Qaror-0 21). Real kompaniya, brend keysi yo'q (Telegram — asbob). Qahramon yo'q — vazifani Mentor beradi; odamlar roli bilan: tashkilotchi, o'yinchi, sherik («1-telefon · siz» / «2-telefon · tekshiruv akkaunti» — sahna yorliqlari).
8. **Amaliyot bloki (tayanch 4, 12-Modul 9.36):** to'rt bandning hammasi o'quvchining **o'z repo'sida, o'z mahsuloti va trekida**; Mentor misoli — namuna (o'ngda «kutilgan natija · namuna: Maydon Jamoa», `{…}` yonida kulrang «masalan: …», «Yordam»da Mentor misolidagi to'liq prompt). 5-band yo'q.
   Band nomlari: 1-amaliyot — Ochish · Prompt · Besh tekshiruv · Tekshirish (12-Modul 5-dars A1 naqshi: kod yozilmaydi) · 2-amaliyot — Ochish · Prompt · Ishga tushirish · Tekshirish · 3-amaliyot — Ochish · Qayta tekshirish · `XATOLAR.md` · Yangi versiya (12-Modul 5-dars A2 naqshi: qayta tekshirish o'z bandida; TAYANCHGA SAVOL 11).
   Talab zinapoyasi: A1 — tayyor talab + bitta joy · A2 — tayyor talab + ikki joy (biri yozuvdan oldindan) · A3 — tayyor talab (`XATOLAR.md`) + yozuv oldindan. Prompt — agentga buyruq, sen-formada (T-002); oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.» (A1 da — «Nima o'zgartirganingni ayt.»).
   Trek — `pm-m9d8-platforma.trek` (yo'q bo'lsa — 1-amaliyot tepasida «Mobil trek» · «Web-trek», tanlov shu kalitga yoziladi — 11-Modul 9.77); farq — «Ochish» dagi trek qatori va «Yordam» ostida bir gap.
   Xato yo'li (har blokda bitta gap, ayb da'vosisiz — 12-Modul 9.34 e): «Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas)». Push odati: `git status` → `git add <fayl>` (`git add .` emas).
9. **Xavfsizlik va tozalash (TAQIQLAR 3; 12-Modul 9.35 a, 9.37 g, 9.41 i):** tekshirish faqat o'z mahsulotida; o'zgarishni sherik o'z hisobidan, web-trekda kompyuterdagi yashirin oynada ikkinchi tekshiruv akkaunti bilan, bo'lmasa agent qiladi; haqiqiy foydalanuvchining hisobi ishlatilmaydi.
   Darsda ikki marta ko'rinadi: 2-ekran QIzohi va 1-amaliyot 1-band (qalin). Taklif tekshiruvidagi hisoblar bilan asosiy ish qilinmaydi — aks holda o'quvchining o'ziga mukofot yoziladi (tayanch 1.10 sharti; TAYANCHGA SAVOL 13).
   Tekshiruv akkauntlari, tekshiruv o'yinlari va ular yozgan sanoq yozuvlari 3-amaliyot oxirida agent ko'rsatgan ro'yxat bo'yicha, `id` bilan o'chiriladi (o'quvchi «O'chir» degandan keyin — 12-Modul 9.39 b). Telegram'ni tekshiruv akkauntiga ulasa — chat raqami shu hisob bilan o'chadi.
10. **Uyga vazifa yo'q** (tayanch 4: loyiha kunlari 5, 8, 10, 12). Yakunda HwCard yo'q; ulgurmagan ish — yakun sarlavhasi holatga qarab aytadi (sinf 6). O'rnatish fayli navbatda qolsa — havola **keyingi dars boshida** almashtiriladi, «uyda» deyilmaydi (12-Modul 9.41 h).
11. **Vaqt (90 daqiqa — reja) va ulgurmagan yo'l:** taqsimot tepada. 1-amaliyotda «Davom etish» uchta tekshiruv kartasi belgilangach ochiladi (MD qarori — SABOQ E 55); qolgan kartalar 3-amaliyotdan oldin ham ochiq; ulgurmagan yo'l `XATOLAR.md` da «Tekshirilmagan yo'llar» qatoriga yoziladi.
    2-amaliyotda ulgurmasa — bitta topilma; ikkinchisi 3-amaliyotda «qoldi» (sabab: vaqt yetmadi). 3-amaliyotda — `XATOLAR.md` birinchi, yangi versiya keyin; o'rnatish fayli navbati dars oqimini to'xtatmaydi (podium va arena paytida yuradi). Blok bayrog'i — faqat oxirgi band «Bajardim»idan (12-Modul 9.36 h).
12. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; telefon, yozuv kartasi, chat, fayl kartasi, Neon qatori — CSS/SVG; «Maydon Jamoa» nomi telefon maketida o'z rangida (11-Modul yashili); logotip yo'q.
    Rang — faqat holat foni (D3): «Buzildi» — `err` · «Buzilmadi» — `ink2` · «Mahsulotimda hali yo'q» — `line` chegarali, fonsiz · «Tuzatish qilindi» — `accent` · «qayta tekshiruvda takrorlanmadi» — `ok` · «qayta tekshiruvda yana buzildi» — `err` · «qoldi» — `ink2`.
13. **Texnik faktlar** — «Manbalar» bo'limida (tayanch 6, 12-Modul tayanchi 6 va 9, o'zim tekshirganlarim; 07.10.2026); o'quvchiga ko'rinmaydi.

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon Jamoa» — mahalladagi mini-futbol uchun jamoa yig'adigan ilova (tayanch 1.0). Bu modulda unga to'lov taklifi ekrani va mashq to'lov (3–5), Telegram xabari (8), taklif kodi (10) qo'shildi — agent har safar «Tayyor!» degan.
  Bugun Mentor yangi narsa qo'shmaydi: besh yo'lni buzish yozuvi bilan qayta tekshiradi, ikki topilmani agentga beradi, agentning yangi funksiya takliflarini rad etadi, tuzatishni o'sha usul bilan qayta ko'radi, `XATOLAR.md` yozadi va yangi versiyani chiqaradi. O'quvchi xuddi shuni o'z mahsulotida qiladi (uch blok).
- **Hook:** uch «Tayyor!» va ochilgan ilova → «to'liq ishlashini qanday bilasiz?» → 2-ekranda besh tekshiruv: ikkitasida buzildi — atama «barqarorlik tekshiruvi» → 1-amaliyot (o'z besh yo'li) → 5-ekranda agentning to'rt taklifi: ikkitasi tuzatish, ikkitasi yangi funksiya → 2-amaliyot (tuzatish) → 3-amaliyot (qayta tekshirish, `XATOLAR.md`, yangi versiya).
- **Bitta vizual — «yo'l sahnasi»** (bitta manba `YOL_SAHNA` + `YOLLAR` + `MENTOR_TEKSHIRUV`, 163/180):
  - **chapda telefon «1-telefon · siz»** (ramka ≈170×272, o'lcham barqaror — SABOQ 22; yorliq ramka ustida — SABOQ 23): «Maydon Jamoa» nomi o'z rangida; ekran yo'lga qarab almashadi — «Ro'yxatdan o'tish» (Ism · Login · Parol · «Taklif kodi (bo'lsa)») · «O'yinlar» · to'lov taklifi ekrani → «Mashq to'lov» sahifasi · lending «Taklif kodi: AB12CD» · Telegram chati.
    Telefon ostida ixcham chiziq «1 · 2 · 3 · 4 · 5» — besh yo'l (joriy — accent, tayyori — belgi rangida). Kerak bo'lganda yonida kichik ikkinchi telefon «2-telefon · tekshiruv akkaunti» va bir qatorli Neon kartasi (`taklif_qilgan_id`, `pro_gacha`, `tolovlar`, `oyinlar`).
  - **o'ngda bitta karta** (≤3 blok): **buzish yozuvi kartasi** (2-ekran, 1-amaliyot) — sarlavha «N · {yo'l}», ostida kulrang qator «Bu yo'lga tekkan darslar: …», uch qator «Nima qildim» · «Nima kutdim» · «Nima bo'ldi», belgi joyi ·
    yoki **agent chati** (5-ekran, 2-amaliyot) · yoki **fayl kartasi `XATOLAR.md`** (1-ekran tayyor holati, 3-amaliyot).
  - Holatlar: kulrang (kutmoqda) → accent (joriy) → belgi rangi (A-bo'lim 12). Karta ixcham qatorga yig'ilib chiziqqa tushadi (SABOQ 17). `prefers-reduced-motion` da harakat to'xtaydi — holatlar animatsiyasiz almashadi (DE-200).
  - Ishlatilishi: 0 (telefon + agent chati) · 1 (tayyor holat: besh yo'l chizig'i + `XATOLAR.md` kartasi) · 2 (telefon + yozuv kartasi) · 5 (ikki topilma + agent chati) · bloklarning o'ng tomoni (kutilgan natija).
- **Yakun:** besh yo'l tekshirilgan, eng muhim topilma tuzatilib qayta tekshirilgan, `XATOLAR.md` da hamma topilma holati bilan, yangi versiya chiqqan · uyga vazifa yo'q · keyingi dars — «Zaxira dars».

---

## 0 · Kirish — uch «Tayyor!»dan keyin  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Mahsulotingiz to'liq ishlashini qanday bilasiz?** (47)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: Mentor misolida bu modulda ilovaga to'lov, Telegram xabari va taklif kodi qo'shildi — telefonda «Ilovani ochish» ni bosing.
  - ilova ochilgach: Ilova ochildi — endi javobingizni tanlang.
- Maket (chap): telefon «1-telefon · siz» — ilova yopiq, ekranda «Maydon Jamoa» nomi o'z rangida (logotipsiz); telefon ustida agent chati — uch pufak (Antigravity, T-008), navbat bilan chiqadi: «Tayyor! To'lov taklifi ekrani ishlaydi.» · «Tayyor! Telegram xabari yuboriladi.» · «Tayyor! Taklif kodi formaga qo'shildi.»
  Telefon ostida sahna tugmasi **«Ilovani ochish»** (halqada).
- **Harakat → Vizual o'zgarish:** «Ilovani ochish» → telefonda «O'yinlar» ochiladi: «Shanba, 18:00 · Mahalla maydoni · 8 / 10» (karta bir lahza ajralib kiradi) → o'ngdagi variantlar faollashadi (bosilmaguncha xira).
- Variantlar (radio, ballsiz):
  - Ilova ochildi — demak, hammasi ishlaydi (39)
  - ✔ Ro'yxatdan to'lovgacha o'zim bosib ko'raman (43)
  - Agent uch marta «Tayyor!» dedi — shu yetadi (43)
- Javob — 2-variant: **Aynan! Ilova ochilishi — faqat bitta ish. Ro'yxat, to'lov va taklif kodi har biri alohida tekshiriladi.** (103)
- Javob — 1-variant: **Qiziq fikr! Ochilish ishladi — bu rost. Ro'yxat, to'lov va taklif kodi esa boshqa joyda ishlaydi.** (97)
- Javob — 3-variant: **Qiziq fikr! Agentning «Tayyor!» degani — da'vo. Uni har ishni o'zingiz bosib ko'rib tekshirasiz.** (96)
- Javobdan keyin: agent pufaklari ostida kulrang yorliq «da'vo · birga tekshirilmagan». Tanlangan variant ixcham qator bo'lib qoladi (SABOQ 11).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
- ✎ Hook obyekti — darsning o'qitish obyekti (P-001): oldingi darslarda qo'shilgan ishlar va agentning «Tayyor!» degani. Ilova ataylab oddiy ochiladi (12-Modul 5-dars hook naqshi). Javob shoxlari bir uzunlikda; 1-variantning rost tomoni tan olinadi (§119);
  hook javobi Mentor gapida aytilmagan (P-016). «Aynan!» / «Qiziq fikr!» — kurs qonuni (T-028, T-067). Agent pufaklari — 4, 8, 10-darslardagi ish, so'zlari mening qarorim (TAYANCHGA SAVOL 12). Sarlavhada «mahsulotingiz» — web-trekni ham qamraydi (12-Modul 9.34 h).

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qator + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Bugun mahsulotingizni tekshirasiz va tuzatasiz.** (47)
- Mentor: Yangi funksiya bugun qo'shilmaydi — faqat bor narsa sinchiklab ko'riladi. Har blokda Mentor namunasi o'ng tomonda turadi.
- Chap — «Dars oxirida»: bir marta o'zi yuradi (DE-200): besh yo'l chizig'i — «1 Kirish va ro'yxat · 2 Asosiy harakat · 3 To'lov oqimi · 4 Taklif havolasi · 5 Eslatma yoki Telegram xabari», har birining yonida belgi joyi (uzuq chiziqli — bugun o'quvchi to'ldiradi, U-041) →
  fayl kartasi `XATOLAR.md` (ichida uch ustun nomi «Usul · Natija · Holat») → kichik chip «yangi versiya». Mentor natijalari ko'rsatilmaydi — 2-ekran kashfiyoti (SABOQ 33).
- O'ng — bugungi uch ish (tex-karta «01 · matn», bosilmaydi; teg yo'q — 172):
  - 01 · Besh yo'lni buzish yozuvi bilan tekshirish
  - 02 · Eng muhim bir-ikki topilmani tuzatish
  - 03 · Qayta tekshirish, `XATOLAR.md` va yangi versiya
- Pastki qator (mono, kichik): o'z repo'ngiz · Mentor misoli `maydon-jamoa` · boshlang'ich teg `m13-dars-12-start` · namuna `m13-dars-12-done`
- Pastki qator 2 (kichik): «Maydon Jamoa» — namuna; besh yo'lni o'z mahsulotingizda tekshirasiz.
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: og'ir qismlar — 1-amaliyot (besh tekshiruv, tekshiruv akkauntlari; 5-tekshiruvda agent vaqtni suradi) va 3-amaliyot (Render kutishi, o'rnatish fayli navbati). 2 va 5-ekranlarga ortiqcha vaqt bermang.
  Tekshiruv akkauntlari, tekshiruv o'yinlari va ular yozgan sanoq yozuvlari 3-amaliyot oxirida `id` bo'yicha o'chiriladi — haqiqiy sanoqqa qo'shilmasin (12-Modul 9.41 i). Tekshiruv o'yini haqiqiy foydalanuvchilarga ham ro'yxatda ko'rinadi — uni dars oxirigacha qoldirmang.
  Taklif tekshiruvidagi hisoblar bilan asosiy ish qilinmaydi — aks holda o'quvchining o'ziga mukofot (Pro'ga 7 kun) yozilib qoladi. Performance va «investor ko'zi bilan» demo-test — 14-Modul ishi; o'quvchiga aytmang. Uyga vazifa yo'q.
- ✎ Sarlavha — natija va'dasi (P-014), App.jsx `sub` «asosiy yo'llarni tekshiramiz va tuzatamiz» bilan bir ma'noda (P-015; «asosiy yo'l» — 2-ekranda ta'rifdan keyin, sarlavhada yo'q — T-011); Mentor sarlavhani takrorlamaydi — yangi gap: yangi funksiya bugun yo'q (T-072). Uch qator ot-shaklda (§224); «topilma» — oddiy so'z, ta'rifi 2-ekranda.

## 2 · Besh tekshiruv  ← QTushuncha (bashorat + 5 tekshiruv, bittadan)
- Eyebrow: Tushuncha · besh yo'l
- Sarlavha: **Besh tekshiruvning qaysilarida ilova buzildi?** (45)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Mentor bugun besh yo'lni yozuv bilan qayta ko'rdi — avval taxminingizni belgilang.
  - harakat paytida: Tekshiruvni ko'ring va kutilgani bilan bo'lganini solishtirib belgi qo'ying.
  - tugagach: Besh belgi qo'yildi — natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181; yorliq «Avval o'zingiz belgilab ko'ring»; tanlangach ixcham qator): **Besh tekshiruvdan nechtasida Mentor ilovasi buzildi?** · Bittasida · Ikkitasida · Uchtasida (S-015: bir o'lchov, o'sish tartibida)
- Chap — telefon («Maydon Jamoa»; ekran tekshiruvga qarab), ostida ixcham chiziq «1 · 2 · 3 · 4 · 5» (joriy — accent, tayyori — belgi rangida).
- O'ng — buzish yozuvi kartasi (bittadan, SABOQ 9, E 53): sarlavha «N · {yo'l}» · kulrang qator «Bu yo'lga tekkan darslar: …» · «Nima qildim» · «Nima kutdim» · «Nima bo'ldi» (avval yopiq) · tugma **«Tekshiruvni ko'rish»** (halqada) → keyin ikki tugma **«Buzildi»** · **«Buzilmadi»** (har birining o'z chegarasi, E 40).
  Matn — A-bo'lim 4-band jadvali (`MENTOR_TEKSHIRUV`, aynan).
- **Harakat → Vizual o'zgarish:** «Tekshiruvni ko'rish» → telefon o'sha yo'lni o'ynaydi (≈3 s) → kartada «Nima qildim» va «Nima kutdim» yoziladi → «Nima bo'ldi» yoziladi → «Buzildi» / «Buzilmadi» faollashadi →
  - to'g'ri belgi → karta ixcham qatorga yig'ilib pastdagi chiziqqa tushadi («4 · Taklif havolasi · buzildi»; ~1 s belgi rangida) → keyingi karta kiradi;
  - boshqa belgi → karta silkinadi, bir qator (`QXato`, ≤60): Kutilgani va bo'lgani bir xilmi — yana o'qing. (46)
  Telefonda (har yo'l — bir necha qisqa kadr ketma-ket, KOD 4):
  1 — «Ro'yxatdan o'tish» → «O'yinlar» → «Hisobdan chiqish» → «Kirish» → «O'yinlar»; ikkinchi ro'yxatda login maydoni ostida qizil qator «Bu login band» ·
  2 — «E'lon berish» → «O'yinlar» da yangi karta; kichik ikkinchi telefonda «Shanba, 18:00»: «8 / 10» → «9 / 10» → «8 / 10» ·
  3 — to'lov taklifi ekrani (so'zma-so'z, narx yonida «Mentorning taxmini», pastda «Test rejim: pul yechilmaydi») → «Mashq to'lov» («Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.» · «Maydon Jamoa — Pro, 30 kun · 15 000 so'm») → «Rad etish (mashq)» → «To'lov o'tmadi — qayta urinib ko'ring» → yana «To'lovga o'tish» → «Ikki marta yuborish» → ilovada Pro; Neon kartasi `tolovlar`: bitta «tolandi» qatori ·
  4 — lending «Taklif kodi: AB12CD» → forma «Taklif kodi (bo'lsa)»: «AB12CD» — Neon kartasida `taklif_qilgan_id` yozildi (yashil) → ikkinchi formada «ab12cd» — `taklif_qilgan_id` bo'sh (qizil) ·
  5 — Neon kartasi: o'yin vaqti — o'tgan hafta (yorliq «agent qo'ydi») → ikki telefonda bir vaqtda «O'yinlar» → ikkala ro'yxatda ikkita bir xil yangi karta «Juma, 18:00 · Mahalla maydoni · 0 / 10» (ikkinchisi qizil chegarada) → Telegram chatida ikki bir xil bot xabari: «Juma, 18:00 o'yini yana e'lon qilindi · Mahalla maydoni — 0 / 10».
- Nom qatori (5/5 dan keyin, bitta): Asosiy yo'llarni buzish yozuvi bilan tekshirish — barqarorlik tekshiruvi. (73)
- Xulosa qutisi (E 42): 1-qator — «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: ikkitasida» · xulosa · oxirgi kichik qator — QIzoh.
- Xulosa: Mentor misolida beshtadan ikkitasida ilova buzildi: ikkalasida bir necha darsning ishi uchrashgan. (98)
- QIzoh (xulosa qutisining oxirgi qatori — xavfsizlik chegarasi): Tekshirish — faqat o'z mahsulotingizda va tekshiruv uchun ochilgan hisoblarda. (78)
- Tugadi (199): karta yopiladi, besh ixcham qator (yo'l · belgi) va telefon fokusga; vizual ⛶ ichida (q17). Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Tekshiruvlarni ko'ring (N/5) → Davom etish
- ✎ Mentor misolining besh tekshiruvi — tayanch 1.12 (natija aynan); yozuv matni va «tekkan darslar» qatori — TAYANCHGA SAVOL 1, 2. T-011: besh tekshiruv sahnada → keyin atama. «Bu yo'lga tekkan darslar» — tayanch faktlari (1.4, 1.5, 1.8, 1.10; 12-Modul 7-dars):
  o'quvchi har yo'lga keyingi darslar tekkanini ko'radi — arena 2 va kartochka 2 shunga tayanadi. Xulosa sabab da'vo qilmaydi: «uchrashgan» — fakt; buzilmagan 1 va 3-yo'llarga ham ikki dars tekkan — umumiy qoida emas (sinf 4, 5).
  «Juma, 18:00 · Mahalla maydoni» — tekshiruv «Doimiy o'yini» (Mentor misolidagi namuna o'yin «Shanba, 18:00» bilan to'qnashmasin; TAYANCHGA SAVOL 3). Telefonda karta maydoni hech bir kadrda chizilmaydi.

## 3 · Amaliyot 1 — besh tekshiruv  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈25 daq)
- Eyebrow: Amaliyot 1 · o'z mahsulotingiz
- Sarlavha: **Mahsulotingizni besh yo'l bo'yicha tekshirib yozing.** (52)
- Mentor: Bu blokda kod yozilmaydi: agent faqat tekshiruvga yordam beradi, ko'rish va yozuv — sizda; «1 · Ochish»dan boshlang.
- Vazifa (prompt ustida, bitta qator): Har yo'lda avval nima kutishingizni yozasiz, keyin bajarib, ko'rganingizni yozasiz va belgi qo'yasiz.
- Model (tayanch 4, 12-Modul 9.36): to'rt bandning hammasi o'quvchining o'z repo'sida, o'z mahsuloti va trekida; Mentor misoli — namuna (o'ngda kutilgan natija, `{…}` yonida kulrang «masalan: …», «Yordam»da Mentor misolidagi to'liq prompt va yozuv). Talab zinapoyasi A1: tayyor talab + bitta joy.
- Bandlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching — 10-darsda to'xtagan joyingizdan (11-dars repo'ga yozmagan). Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin.
     Mobil trekda `npx expo start` ishlab tursin, ilova telefoningizda Expo Go'da ochiq bo'lsin; web-trekda saytingiz brauzerda ochiq tursin.
     Besh yo'l — sizning mahsulotingizda: 1 kirish va ro'yxat · 2 asosiy harakat (mahsulotingizdagi asosiy ish) · 3 to'lov oqimi — mashq to'lovda to'landi, rad va ikki marta yuborish · 4 taklif havolasi · 5 eslatma yoki Telegram xabari — qaysi biri bo'lsa.
     Biror yo'l mahsulotingizda hali bo'lmasa — kartasida **«Mahsulotimda hali yo'q»** ni tanlaysiz: bu «buzilmadi» emas.
     **Tekshirish faqat o'z mahsulotingizda va tekshiruv uchun ochilgan hisoblarda: haqiqiy foydalanuvchining hisobi va boshqa odamning mahsuloti ishlatilmaydi.** Bugun kod o'zgarmaydi.
     Taklif tekshiruvidagi yangi hisob bilan asosiy ishni qilmang — aks holda o'zingizga mukofot yozilib qoladi.
  2. **Prompt** — qavsni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: o'z loyiham — faqat o'qish uchun: kod va fayllarni o'zgartirma. Database'da yozish mumkin — faqat tekshiruv akkauntlari (sen ochganlari va men aytgan loginlar) va ularning yozuvlari.
     > Nima qilsin: bugun men mahsulotimning besh yo'lini tekshiraman: kirish va ro'yxat · {asosiy harakat} · to'lov oqimi · taklif havolasi · eslatma yoki Telegram xabari. Har tekshiruvdan oldin senga nima kerakligini aytaman: tekshiruv akkaunti ochish (namuna ism va login bilan, haqiqiy emas), shu hisob nomidan so'rov yuborish yoki tekshiruv akkauntidagi vaqt va muddatni o'zgartirish. Avval nima qilishingni ayt; «Qil» desam — bajar va qaysi hisob, qaysi yozuv, qaysi `id` ekanini ayt.
     > Nima buzilmasin: kod, `.env` va haqiqiy foydalanuvchilarning hisoblari va yozuvlariga tegma. Hech narsani tuzatma va tuzatish taklif qilma — men hozir faqat tekshiryapman. Nima o'zgartirganingni ayt.
     Qavs yonida kulrang namuna (Mentor misolidan): {asosiy harakat} — «masalan: o'yin e'lon qilish va o'yinga qo'shilish».
     Yordam (ochiladigan) — Mentor misolidagi to'liq prompt (yuqoridagi, qavs o'rnida «o'yin e'lon qilish va o'yinga qo'shilish») va Mentorning keyingi ikki xabari:
     > Tekshiruv akkaunti och: namuna ism va login bilan, haqiqiy emas. Login va parolni menga ayt.
     > Shu tekshiruv akkauntidagi «Doimiy o'yin» vaqtini o'tgan haftaga qo'y. Qaysi `id` ni o'zgartirganingni ayt.
  3. **Besh tekshiruv** — chapda kartalar bittadan (SABOQ 9, E 53): har kartada **«Nima qilaman»** (oldindan yozilgan, tahrirlanadi) va **«Nima kutaman»** — **tekshirishdan oldin** yozing; keyin bajaring va **«Nima bo'ldi»** qatoriga ko'rganingizni yozing;
     oxirida belgi: **«Buzildi»** · **«Buzilmadi»** · **«Mahsulotimda hali yo'q»**. Karta ixcham qatorga yig'iladi (bosib tahrirlanadi), keyingisi kiradi.
     O'zgarishni boshqa hisob qilishi kerak bo'lsa: sherik — o'z hisobidan, o'z telefonida · web-trekda — kompyuterdagi yashirin oynada ikkinchi tekshiruv akkaunti bilan · bo'lmasa — agent («Qil»).
     Formadan o'zingiz ochgan tekshiruv akkauntlarining loginini yozib boring — 3-amaliyot oxirida ular o'chiriladi.
     Oldindan yozilgan «Nima qilaman» (bitta manba `YOLLAR`):
     (1) Kirish va ro'yxat — «Yangi tekshiruv akkaunti bilan ro'yxatdan o'taman, hisobdan chiqaman va qayta kiraman.»
     (2) Asosiy harakat — «Tekshiruv akkauntidan asosiy ishni qilaman; boshqa hisob uni ko'radi va o'z harakatini qiladi.»
     (3) To'lov oqimi — «Pullik qulaylikdan to'lov taklifi ekraniga, undan mashq to'lovga o'taman: avval «Rad etish (mashq)», keyin yana «To'lovga o'tish» va «Ikki marta yuborish».»
         Karta tepasida (faqat `pm-m11d5-buzish` bo'lsa, bitta kulrang qator): «5-darsda: {usul — belgi · qayta tekshiruv}» — masalan: «ikki marta yuborish — buzildi · takrorlanmadi». `qayta` bo'sh yoki «yana buzildi» bo'lgan usulni bugun shu kartada ham qaytaring.
     (4) Taklif havolasi — «Taklif havolamni ochaman; ikki yangi tekshiruv akkaunti bilan ro'yxatdan o'tib, kodni qo'lda yozaman: birida katta, birida kichik harf bilan.»
     (5) Eslatma yoki Telegram xabari — «Xabar chiqadigan holatni tekshiruv akkauntida yuzaga keltiraman va xabar necha marta kelganini sanayman; keyin shuni ikki qurilmada bir vaqtda qaytaraman. Vaqtni kerak bo'lsa agent suradi.»
     Ipuchalar (input ichida, E 43): «Nima kutaman» — «Ekranda yoki Neon'da aniq nima ko'rinadi?» · «Nima bo'ldi» — «Ko'rganingiz — taxmin emas».
     Har karta ostida «Yordam» — Mentor yozuvining o'sha kartasi (A-bo'lim 4-band jadvali, belgisi bilan).
     Shart xabarlari (≤60): «Nima kutaman» bo'sh bo'lsa — Avval nima kutishingizni yozing: ekranda nima ko'rinadi? (56) · belgi bosilganda «Nima bo'ldi» bo'sh bo'lsa — Belgidan oldin nima ko'rganingizni yozing. (42)
     Xato chiqsa — bu ham natija: uni «Nima bo'ldi» qatoriga yozing. Agentga faqat xato qatorini yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Nima bo'lganini ayt, hech narsani o'zgartirma.»
  4. **Tekshirish** — besh yozuvni o'qing: «Nima bo'ldi» — ko'rganingiz; har «Buzildi» va «Buzilmadi» «Nima kutdim» bilan solishtirilgan; «Mahsulotimda hali yo'q» — faqat haqiqatan yo'q yo'lda.
     Keyin agentga: «Bugun tekshiruv uchun ochilgan hisoblar — sen ochganlaring va men formadan ochganlarim: {tekshiruv loginlari} — va ular yaratgan yozuvlar ro'yxatini `id` lari bilan ko'rsat. Hozircha hech narsani o'chirma.» — ro'yxat 3-amaliyot oxirida kerak bo'ladi.
     Qavs yonida kulrang namuna: {tekshiruv loginlari} — «masalan: tekshiruv1, tekshiruv2».
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa»: Mentor yozuvining besh ixcham kartasi (A-bo'lim jadvali, «Tuzatishdan keyin» ustunisiz), har birida uch qator va belgi: 1 · buzilmadi · 2 · buzilmadi · 3 · buzilmadi · 4 · buzildi · 5 · buzildi; kartalar ustida kichik telefon «Maydon Jamoa».
  Web-trekda: o'sha kartalar, telefon o'rnida brauzer oynasi `….netlify.app`.
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - kamida bitta «Buzildi» — Besh yo'l tekshirildi: topilganlar keyingi blokda tuzatiladi. (61)
  - «Buzildi» yo'q — Besh yo'l tekshirildi: mahsulotingiz buzilmadi — bu ham natija. (63)
  - ostida kulrang qator (faqat «Mahsulotimda hali yo'q» bo'lsa): Mahsulotingizda hali yo'q yo'llar tekshirilmadi: {N} ta. (56)
- Pastki qator (kichik; darsda bir marta — SABOQ 39): Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-12-start` —
  oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. Bu — tekshiruvdan oldingi kod; tuzatilgan holati — `m13-dars-12-done`. `backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz.
- Ulgurmasangiz: uchta karta belgilangach «Davom etish» ochiladi — qolganini 3-amaliyotdan oldin bajaring; ulgurmagan yo'l `XATOLAR.md` da «Tekshirilmagan yo'llar» qatoriga yoziladi. Blok besh karta va 4-band «Bajardim»idan keyin bajarilgan sanaladi (12-Modul 9.36 h).
- Nishon (bonus): Five Paths — 4-band «Bajardim»ida.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: kod yozilmaydi (tayanch 1.12 — tekshiruv bloki); agent — tekshiruv yordamchisi: hisob ochadi, so'rov yuboradi, vaqt va muddatni suradi, `id` aytadi (12-Modul 9.35 a, 9.37 g, h — sherik va web-trekdagi o'z yo'li agentdan oldin). Agentning «qildim» degani — da'vo; natija — o'quvchining o'zi ko'rgani (sinf 5, 10).
  Kutish tekshirishdan **oldin** (12-Modul 5-dars, final 1-bo'lak). «Nima qilaman» — umumiy qolip emas: o'quvchi o'z mahsulotiga moslab tahrirlaydi (sinf 4, 13). 4-kartadagi «katta va kichik harf» — APK'da kod qo'lda yoziladi (tayanch 1.10) — odam qanday yozishini tekshirish; o'quvchi kodida muammo bo'lmasligi ham mumkin («buzilmadi» ham natija).
  5-kartadagi «necha marta kelgani» va «ikki qurilmada bir vaqtda» — Mentor topilmasi aynan shunda chiqqan (TAYANCHGA SAVOL 2); o'quvchi mahsulotida xabar boshqacha yaratilsa — muammo bo'lmasligi ham mumkin. Tekshiruv akkauntini Telegram'ga ulash — o'quvchining o'z Telegram'i bilan; tozalashda chat raqami hisob bilan o'chadi (A-bo'lim 9; Shubhali 4).
- O'qituvchi eslatmasi: 5-tekshiruvda agent Database'da tekshiruv o'yinining vaqtini suradi — Render va Neon bilan ishlashi pilotda tekshiriladi (Shubhali 3). «Bir vaqtda» ochish bir urinishda chiqmasligi mumkin — ikki-uch marta qaytarish mumkin, har urinish yozuvga kiradi (Shubhali 12). Web-trekda 5-yo'l — Telegram xabari (trekka bog'liq emas) yoki 12-Moduldagi «Siz yo'q paytingizda» qatori.

## 4 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Mahsulotingizda eslatma ham, Telegram xabari ham yo'q. Beshinchi kartaga nima qo'yasiz?** (11 so'z)
  - A · «Buzilmadi» — xato hech qayerda chiqmadi (40)
  - B · «Buzildi» — kutgan xabarim kelmadi (34)
  - C · ✔ «Mahsulotimda hali yo'q» — tekshirilmadi (40)
  - D · Hech narsa — kartani bo'sh qoldiraman (37)
- Kalit: **C** (index 2). To'rttalasi «… — …» shaklida (tire hamma variantda); qo'shtirnoq uch variantda; to'g'ri variant yolg'iz eng uzun emas (O'lchov).
- To'g'ri izohi: Bu yo'l tekshirilmadi — uni «buzilmadi» deb bo'lmaydi. (54)
- Xato izohlari (≤60):
  - A: «Buzilmadi» — bor yo'l kutilganidek ishlaganda. (47)
  - B: «Buzildi» — bor yo'l kutilganidek ishlamaganda. (47)
  - D: Bo'sh karta bu yo'l haqida hech narsa aytmaydi. (47)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): savol 1-amaliyot qoidasini yangi vaziyatda so'raydi (§106); distraktorlar uch turkumda: A — yo'q narsani «ishladi» deb yozish (yolg'on «buzilmadi», sinf 6) · B — yo'qlikni nosozlik deb yozish · D — yozuvni yashirish. Haqiqiy hayotda ham «yo'q yo'l buzilmadi» yozuvi rost emas.
  Tushuncha 1 g'oyasi (keyin qo'shilgan ish eski yo'lga tegadi) — arena 2 va kartochka 2 da (TAYANCHGA SAVOL 16).

## 5 · Faqat topilma  ← QTushuncha (bashorat + 4 taklif, bittadan)
- Eyebrow: Tushuncha · faqat tuzatish
- Sarlavha: **Agentning qaysi taklifi bugun qilinadi?** (39)
- Mentor (bosqichga qarab, SABOQ 11; har biri bitta gap):
  - bashoratgacha: Mentor ikki topilmani agentga berdi, agent to'rt taklif yozdi — avval taxminingizni belgilang.
  - harakat paytida: Taklifni chapdagi ikki topilma bilan solishtiring va ro'yxatini tanlang.
  - tugagach: To'rt taklif joylandi — natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz; tanlangach ixcham qator): **To'rt taklifdan nechtasi bugun qilinadi?** · Bittasi · Ikkitasi · Uchtasi
- Chap — Mentorning ikki topilma kartasi (ixcham, qizil belgi; `MENTOR_TEKSHIRUV` 4 va 5): «4 · Taklif havolasi · buzildi — «ab12cd» qabul qilinmadi» · «5 · Telegram xabari · buzildi — keyingi o'yin ikki marta yaratildi».
  Ostida ikki ro'yxat joyi (uzuq chiziqli): «Bugun — tuzatish» · «Bugun emas — yangi funksiya».
- O'ng — agent chati (Antigravity, T-008): taklif pufaklari bittadan, ustida «Taklif N / 4»; pufak ostida ikki tugma **«Bugun — tuzatish»** · **«Bugun emas — yangi funksiya»** (har birining o'z chegarasi, E 40).
  Takliflar (`AGENT_TAKLIF`, aynan; shu tartibda): 1 «Taklif kodini solishtirishdan oldin katta harfga o'tkazaman.» · 2 «Ro'yxatdan o'tish ekraniga yangi dizayn beraman.» · 3 «Bir sanaga keyingi o'yin ikki marta yaratilmasligi uchun Database'da cheklov qo'yaman.» · 4 «Pro tugashidan oldin tashkilotchiga Telegram xabari yuboraman.»
- **Harakat → Vizual o'zgarish:** tugma bosiladi →
  - to'g'ri «Bugun — tuzatish» (1, 3) → pufakdan chapdagi topilma kartasiga chiziq tortiladi, karta yonida yorliq «tuzatadi», taklif «Bugun — tuzatish» ro'yxatiga tushadi;
  - to'g'ri «Bugun emas — yangi funksiya» (2, 4) → pufak kulrang tortib «Bugun emas» ro'yxatiga tushadi, yonida kulrang yorliq «hech bir topilmaga bog'lanmaydi»;
  - boshqa tanlov → pufak silkinadi, bir qator (`QXato`, ≤60): Taklifni chapdagi ikki topilma bilan yana solishtiring. (55)
  → keyingi taklif kiradi. To'rttasidan keyin har ro'yxatda ikkitadan taklif turadi.
- Xulosa qutisi (E 42): 1-qator — «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: ikkitasi» · xulosa · QIzoh.
- Xulosa: Bu darsda faqat topilmaga bog'langan o'zgarish qilinadi: yangi funksiya tekshirilmagan yangi yo'l ochadi. (105)
- QIzoh: Bugun ulgurmagan topilma ham `XATOLAR.md` ga «qoldi» deb, sababi bilan yoziladi. (78)
- Tugadi (199): chat yopiladi, ikki topilma kartasi va ikki ro'yxat fokusga; vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Takliflarni joylang (N/4) → Davom etish
- ✎ Yangi funksiya qo'shilmasligi — tayanch 1.12, Qaror-0 19; qoida sanaladigan: taklif yozuvdagi topilmaga bog'lanadimi (sinf 7). Ikki tuzatish — tayanch 1.12 so'zlari agent tilida; ikki yangi funksiya — mening qarorim (TAYANCHGA SAVOL 8):
  ikkalasi ham haqiqiy hayotda foydali bo'lishi mumkin — «yomon g'oya» deyilmaydi, faqat «bugun emas» (sinf 8: distraktor yolg'on emas, qoida bo'yicha noto'g'ri). 4-taklif kelajak va'dasi emas — rad etilgan g'oya, hech qayerda «keyin qilamiz» deyilmaydi (sinf 16).
  QIzoh — «qolgan topilma yashirilmaydi» qoidasining birinchi uchrashuvi; to'liq ishi 2 va 3-amaliyotda.

## 6 · Amaliyot 2 — eng muhim topilma  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈17 daq)
- Eyebrow: Amaliyot 2 · o'z repo'ngiz
- Sarlavha: **Eng muhim bir-ikki topilmani tuzating.** (38)
- Mentor: Yozuvni agentga so'zma-so'z berasiz: tuzatishni u qiladi, yangi narsa qo'shilmaganini siz ko'rasiz; «1 · Ochish»dan boshlang.
- Talab zinapoyasi A2: tayyor talab + 2 joy (`{tanlangan topilmalar}` — 1-amaliyot kartalaridan oldindan; `{avvalgidek ishlashi kerak bo'lgan yo'llar}` — oldindan, tahrirlanadi).
- Bandlar (o'z repo'ngizda):
  1. **Ochish** — 1-amaliyotdagi «Buzildi» belgili kartalaringiz pastda. Bir yoki ikkitasini tanlang (tanlov kartalari, ko'pi bilan ikkita): bu kursda avval — odamning asosiy ishini to'xtatadigan topilma; keyin — odamga noto'g'ri narsa ko'rsatadigan yoki yuboradigan (noto'g'ri Pro, keraksiz xabar, sanalmagan taklif).
     Qolgani bugun tuzatilmaydi — 3-amaliyotda `XATOLAR.md` ga «qoldi» deb, sababi bilan yoziladi.
     Hech biri «Buzildi» bo'lmasa — 2 va 3-bandni o'tkazib yuboring: 4-bandda faqat `git status` toza ekanini ko'rasiz.
  2. **Prompt** — qavslarni tekshiring (tahrirlasangiz bo'ladi), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: yozuvdagi topilmaga tegishli fayllar — avval sababini top, keyin faqat kerakli joyni o'zgartir.
     > Nima qilsin: pastdagi har topilmani tuzat: mahsulot «Nima kutdim» qatoridagidek ishlasin. Har topilmaning sababini bir gap bilan ayt va qaysi faylni o'zgartirganingni ayt.
     > {tanlangan topilmalar}
     > Nima buzilmasin: yangi funksiya, yangi tugma yoki yangi ekran qo'shma — faqat topilmani tuzat. {avvalgidek ishlashi kerak bo'lgan yo'llar} avvalgidek ishlasin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar: {tanlangan topilmalar} — 1-amaliyot kartalaridan oldindan yoziladi (har biri: «N · {yo'l}. Nima qildim: … Nima kutdim: … Nima bo'ldi: …») ·
     {avvalgidek ishlashi kerak bo'lgan yo'llar} — oldindan: 1-amaliyotdagi «Buzilmadi» belgili yo'llar nomi (tahrirlanadi); bo'lmasa — bo'sh, kulrang «masalan: kirish va ro'yxat, o'yin e'loni va qo'shilish, to'lov oqimi».
     Yordam (ochiladigan) — Mentor misolidagi to'liq prompt:
     > Qayerda: `backend/` — ro'yxatdan o'tishdagi taklif kodi tekshiruvi va «O'yinlar» so'ralganda keyingi «Doimiy o'yin» yaratiladigan joy (va uning jadvali). Avval sababini top, keyin faqat kerakli joyni o'zgartir.
     > Nima qilsin: pastdagi har topilmani tuzat: ilova «Nima kutdim» qatoridagidek ishlasin. Har topilmaning sababini bir gap bilan ayt va qaysi faylni o'zgartirganingni ayt.
     > 4 · Taklif havolasi. Nima qildim: Taklif havolamni ikkinchi telefonda ochdim — lendingda «Taklif kodi: AB12CD». Ikki yangi tekshiruv akkaunti bilan ro'yxatdan o'tdim: birida kodni «AB12CD», ikkinchisida «ab12cd» deb yozdim. Nima kutdim: Ikkala hisobda ham taklif qilgan odam yoziladi (Neon'da `taklif_qilgan_id`). Nima bo'ldi: «AB12CD» da yozildi; «ab12cd» da kod qabul qilinmadi — taklif sanalmadi.
     > 5 · Telegram xabari. Nima qildim: Tekshiruv akkauntida «Doimiy o'yin» e'lon qildim; Telegram'i ulangan boshqa tekshiruv akkaunti unga qo'shildi. Agent o'yin vaqtini o'tgan haftaga qo'ydi; men ikki telefonda «O'yinlar» ni bir vaqtda ochdim. Nima kutdim: Keyingi hafta o'yini bitta yaratiladi, Telegram xabari bitta keladi. Nima bo'ldi: Keyingi hafta o'yini ikki marta yaratildi; Telegram'ga «… yana e'lon qilindi» xabari ikki marta keldi.
     > Nima buzilmasin: yangi funksiya, yangi tugma yoki yangi ekran qo'shma — faqat topilmani tuzat. Kirish va ro'yxat, o'yin e'loni va qo'shilish, to'lov oqimi avvalgidek ishlasin; Pro muddati ichidagi «Doimiy o'yin» har hafta e'lon qilinaversin, Telegram xabari har yangi o'yinga bitta ketsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida, bir gap): «Qayerda» qatorida — topilma qayerda bo'lsa: sayt papkangiz (`prototip/`) yoki `backend/`; qolgani o'sha.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q. Agent aytgan sabablarni o'qing — ular uning so'zi.
     Agent har topilma uchun qaysi faylni o'zgartirganini aytgan va u `git status` da ko'ringan bo'lsa — o'sha kartada **«Tuzatish qilindi»** ni belgilang: bu ish fakti — kodda o'zgartirish qilindi; to'g'riligini 3-amaliyot ko'rsatadi.
     Kutayotganda agentga (SABOQ 52; «Nusxalash» bilan):
     > Har tuzatishda o'zgargan qatorlarni fayl nomi va qator raqami bilan ko'rsat; har biri qaysi topilmaga tegishli — bitta gap bilan ayt. Kodni o'zgartirma.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — terminalda `git diff --stat`: o'zgargan fayllar faqat tanlangan topilmalarga tegishli. Agent ko'rsatgan qatorlarni oching: yangi tugma, yangi ekran yoki yangi jadval yo'q.
     Yangi narsa bo'lsa — agentga: «{nima} — yangi funksiya. Uni olib tashla, faqat tuzatish qolsin. O'zgargan fayllarni ayt.»
     Keyin `git add <fayl>` (`git add .` emas) → `git commit -m "barqarorlik: tuzatish"` → `git push`. `backend/` o'zgargan bo'lsa — Render'da yangi versiya tugashini kuting (bir necha daqiqa cho'zilishi mumkin);
     mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`); web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa»: agent chati — ikki pufak (T-008): siz → «4 va 5-tekshiruv kutganimdek emas — yozuvim pastda. Tuzat, sababini bir gap bilan ayt.» ·
  Antigravity → «Sabab: 4 — kod katta harfdagi kod bilan harfma-harf solishtirilgan; endi katta harfga o'tkazilib solishtiriladi. 5 — ikki so'rov bir vaqtda kelganda ikkalasi ham keyingi o'yinni «hali yo'q» deb ko'rgan; endi Database bir sanaga bitta o'yinni qabul qiladi, ikkinchisi o'tkazib yuboriladi.»;
  ostida fayl kartasi: `backend/` — o'zgargan fayllar (taklif kodi tekshiruvi · o'yinlar jadvalidagi cheklov); yangi tugma va ekran yo'q; ikki kartada belgi «Tuzatish qilindi» (accent).
- Hammasi bajarilgach (yashil, holatga qarab):
  - «Tuzatish qilindi» bor — Tuzatish qilindi, yangi narsa qo'shilmadi — natijani keyingi blok ko'rsatadi. (77)
  - «Buzildi» yo'q edi — Tuzatadigan topilma yo'q — kod o'zgarmadi. (42)
- Ulgurmasangiz: bitta topilmani tuzating — ikkinchisi 3-amaliyotda «qoldi» bo'ladi (sabab: vaqt yetmadi). «Davom etish» 4-band «Bajardim»idan keyin ochiladi (push bo'lmasa, 3-amaliyotdagi qayta tekshirish eski kodni ko'radi).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: tuzatishni agent qiladi, sababini u aytadi — o'quvchi uni o'z yozuvi bilan solishtiradi (sinf 13). O'quvchi promptida «Qayerda» — topilmaga tegishli fayllar, papka nomi yo'q (12-Modul 9.37 e); Mentor Yordamida — `backend/` (ikki tuzatish Backend'da — TAYANCHGA SAVOL 5).
  Tanlov qoidasi — bu kurs qoidasi, «Bu kursda» bilan (sinf 4; TAYANCHGA SAVOL 7). «Tuzatish qilindi» — ish fakti, natija emas (sinf 5). `git diff --stat` — yangi funksiya kirmaganini ko'rishning o'quvchi yo'li (Manbalar 6); agentning «faqat tuzatdim» degani — da'vo.

## 7 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol
- Savol: **Agent tuzatish bilan birga yangi tugma ham qo'shdi. Nima qilasiz?** (10 so'z)
  - A · ✔ Agentga tugmani olib tashlashni aytaman (39)
  - B · Tugmani qoldiraman — odamlarga qulay bo'ladi (44)
  - C · Tuzatishni ham, tugmani ham bekor qilaman (41)
  - D · Tugmani topilma qilib yozuvga qo'shaman (39)
- Kalit: **A** (index 0). To'rttalasi birinchi shaxsdagi harakat gapi; «tugma» so'zi to'rttalasida; tire faqat B da (to'g'rida emas).
- To'g'ri izohi: Bugun faqat topilmaga bog'langan o'zgarish qoladi. (50)
- Xato izohlari (≤60):
  - B: Qulay bo'lishi mumkin — lekin u tekshirilmagan yangi yo'l. (58)
  - C: Tuzatish topilmaga bog'langan — u nega ketishi kerak? (53)
  - D: Topilma — tekshiruvda kutilgani bo'lmagan joy. (46)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 5-ekran takliflari emas — yangi vaziyat (agent allaqachon qo'shgan; §106). Distraktorlar uch turkumda: B — yangi funksiyani qabul qilish (asosiy yanglish) · C — haddan oshgan javob (tuzatishni ham tashlash) · D — tushuncha almashuvi (tugma — topilma emas).
  B «qulay bo'lishi mumkin» — rost tomoni tan olinadi (S-010); haqiqiy hayotda ham barqarorlik kunida tekshirilmagan qo'shimcha kodni qoldirish odatdagi yo'l emas — distraktor rost bo'lib qolmaydi.

## 8 · Amaliyot 3 — qayta tekshiruv va yangi versiya  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈18 daq)
- Eyebrow: Amaliyot 3 · qayta tekshiruv va yangi versiya
- Sarlavha: **Qayta tekshiring va topilmalarni `XATOLAR.md` ga yozing.** (54)
- Mentor: Tuzatishni o'sha usul bilan qayta ko'rasiz, keyin hamma topilma faylga yoziladi; «1 · Ochish»dan boshlang.
- Talab zinapoyasi A3: tayyor talab (`XATOLAR.md`) + `{to'liq yozuv}` oldindan; «qoldi» sababini o'quvchi yozadi.
- Bandlar (o'z repo'ngizda):
  1. **Ochish** — «Tuzatish qilindi» belgili kartalaringiz pastda. Yangi kod ishlab turibdi: `backend/` o'zgargan bo'lsa — Render'da yangi versiya tugagan; mobil trekda Expo Go yangi kodni ko'rsatadi; web-trekda sayt yangilangan. Tekshiruv akkauntlari — 1-amaliyotdagilar.
  2. **Qayta tekshirish** — har «Tuzatish qilindi» topilmani **o'sha usul bilan** qaytaring — kartadagi «Nima qildim» qatori bo'yicha. Tanlang: **«Qayta tekshiruvda takrorlanmadi»** · **«Qayta tekshiruvda yana buzildi»**.
     Yana buzilsa — agentga bir marta: «{yo'l} qayta tekshiruvda yana buzildi: {nima bo'ldi}. Tuzat, yangi narsa qo'shma, o'zgargan fayllarni ayt.» → `git push` → o'sha usul bilan yana bir marta. Ikkinchi marta ham buzilsa — `XATOLAR.md` da «qoldi».
     Har «qoldi» topilma uchun bitta qator yozing — «Nega qoldi?» (ipucha: masalan: vaqt yetmadi). Tanlanmagan topilmalar ham shu yerda «qoldi».
  3. **`XATOLAR.md`** — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Loyiha ildizida `XATOLAR.md` yarat: pastdagi yozuvimni so'zma-so'z ko'chir. Har topilma — yo'l nomi va uch qator: usul (nima qildim), natija (nima kutdim va nima bo'ldi), holat — men yozgandek. Oxirida ikki qator: buzilmagan yo'llar va tekshirilmagan yo'llar. Boshqa faylga tegma.
     > {to'liq yozuv}
     Qavs: {to'liq yozuv} — besh kartadan oldindan yoziladi (har topilma: yo'l · nima qildim · nima kutdim · nima bo'ldi · holat — «Tuzatish qilindi · qayta tekshiruvda takrorlanmadi» / «Tuzatish qilindi · qayta tekshiruvda yana buzildi» / «qoldi — {sabab}»; oxirida buzilmagan va tekshirilmagan yo'llar ro'yxati).
     `XATOLAR.md` ni yozuvingiz bilan solishtiring: har topilma bormi, «qoldi» topilma ham yozilganmi. Mos bo'lsa — `git add XATOLAR.md` → `git commit -m "barqarorlik: XATOLAR.md"` → `git push`.
     Topilma yo'q bo'lsa ham fayl yoziladi — unda besh yo'l «buzilmagan» qatorida.
  4. **Yangi versiya** — odamlar ishlatadigan versiya o'zgargan qismga qarab chiqadi:
     - `backend/` — 2-amaliyotdagi `git push` bilan Render'da chiqdi; ilova va brauzer ko'rinishi o'sha Backend'ga ulanadi — ular uchun yangi fayl kerak emas.
     - mobil trekda `mobil/` o'zgargan bo'lsa — APK o'zi yangilanmaydi: `cd mobil` → `eas build -p android --profile preview` (bepul rejada oyiga 15 ta Android build — keraksiz qayta tayyorlamang). Navbatni kutmang: «Bajardim»ni bosing va davom eting.
       Fayl tayyor bo'lgach agentga: «`lending/index.html` dagi «Android: ilovani o'rnatish» havolasini shu manzilga almashtir: {yangi havola}. Boshqa joyga tegma.» → `git push`. Dars oxirigacha tayyor bo'lmasa — keyingi dars boshida.
       Brauzer ko'rinishi (iPhone yo'li) push'dan keyin o'zi yangilanmaydi: `npx expo export -p web`, keyin `netlify deploy --prod --dir dist`.
     - web-trekda — push'dan keyin saytni telefonda oching: tuzatish ko'rinmasa, sayt buyruq bilan chiqarilgan — qayta `netlify deploy --prod`.
     Odamlar ochadigan manzilda (brauzer ko'rinishi yoki saytingiz) tuzatilgan yo'lni bir marta qaytaring. `backend/` dan boshqa joy o'zgarmagan bo'lsa — shu yerdagi qaytarish yetadi.
     Oxirida tozalash — agentga: «1-amaliyotda ko'rsatgan tekshiruv akkauntlari va yozuvlari ro'yxatini yana ko'rsat. «O'chir» desam — faqat shu `id` lardagi yozuvlarni o'chir; haqiqiy foydalanuvchilarning yozuvlariga tegma.» Ro'yxatni o'qing, keyin «O'chir» deng.
- Blok ostida (faqat mobil trekda, `eas build` ishga tushirilgan bo'lsa; oxirgi «Bajardim»dan keyin, bittasi tanlanadi): «Havola almashtirildi» · «Fayl navbatda» — yakundagi yorliq shundan (12-Modul 8, 9-darslar naqshi).
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa»: Mentorning ikki kartasi — «4 · Taklif havolasi» va «5 · Telegram xabari», har birida «Tuzatish qilindi» (accent) va «qayta tekshiruvda takrorlanmadi» (yashil) belgilari ·
  ostida fayl kartasi `XATOLAR.md` (A-bo'lim 4, `MENTOR_XATOLAR`; GitHub sahifasining kichik ko'rinishi `maydon-jamoa` · `XATOLAR.md`) · eng pastda kichik qator: «yangi versiya: Render — `backend/` · APK va brauzer ko'rinishi o'zgarmadi».
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - hamma tuzatilgan topilma «takrorlanmadi», «qoldi» yo'q — Qayta tekshirildi: topilmalar `XATOLAR.md` da, yangi versiya chiqdi. (66)
  - «qoldi» yoki «yana buzildi» bor — `XATOLAR.md` tayyor: qolgan topilma sababi bilan yozildi. (55)
  - topilma yo'q — `XATOLAR.md` tayyor: besh yo'l buzilmadi. (39)
- Qator (`QIzoh`, natija ostida; faqat mobil trekda va `mobil/` o'zgargan bo'lsa): APK o'zi yangilanmaydi: eski faylni o'rnatganlar tuzatishni yangisini o'rnatgach ko'radi. (89)
- Ulgurmasangiz: `XATOLAR.md` birinchi, yangi versiya keyin; o'rnatish fayli havolasi — keyingi dars boshida. Tozalashni o'tkazib yubormang. «Davom etish» 3-band «Bajardim»idan keyin ochiladi (`XATOLAR.md` push qilingach); blok bayrog'i — 4-band «Bajardim»idan (SABOQ E 55 — MD qarori).
- Nishon (bonus): Bug Log — 3-band «Bajardim»ida (`XATOLAR.md` push qilingach).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: qayta tekshirish — o'sha usul, o'quvchining o'zi (sinf 10); ikkinchi aylanish bir marta, keyin «qoldi» — dars oqimi to'xtamaydi (sinf 1). `XATOLAR.md` — yozuvning so'zma-so'z nusxasi: agent qo'shmaydi, qisqartirmaydi; «qoldi» topilma yashirilmaydi (tayanch 1.12; TAYANCHGA SAVOL 6).
  Yangi versiya — o'zgargan qismga qarab (TAYANCHGA SAVOL 5): Mentor misolida faqat Render; o'quvchida `mobil/` o'zgarsa — APK va brauzer ko'rinishi (12-Modul 9.28, 1.8). Tekshirilmagan tuzatishdan o'rnatish fayli tayyorlanmaydi — shuning uchun qayta tekshirish 2-bandda, fayl 4-bandda (12-Modul 8-dars naqshi).
  Tozalash — agent ko'rsatgan ro'yxat va «O'chir» (12-Modul 9.37 g, 9.39 b, 9.41 i); `tolovlar` dagi mashq qatorlari — 3-dars ✎: o'chirish shart emas, lekin hisob o'chirilganda bog'langan qatorlarni agent o'zi aytadi (Shubhali 7).
- O'qituvchi eslatmasi: o'rnatish fayli navbati podium va arena paytida yuradi. Tekshiruv akkauntlarini o'chirishdan oldin o'quvchi ro'yxatni o'qiganini ko'ring — ro'yxatda haqiqiy foydalanuvchi bo'lmasligi kerak.

## 9 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 2 savol (skelet infrasi); bloklar «Bajardim» — mentorga signal (`PRACTICE_BASE`, 5-Modul naqshi).
- Savol yorliqlari (`Q_LABELS`): 4 — «1 — Yo'q yo'lning belgisi» · 7 — «2 — Faqat tuzatish»

## 10 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (SABOQ 16). Karta ostida, birinchi bosishgacha: «Kartani bosing — javob ochiladi»; karta yuzi ingichka accent chegarada, 3 marta yengil tebranadi, kattalashishsiz (E 49).
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 11 · Yakun  ← QYakun (texnik darslar standarti, 172/192/204; SABOQ E 50)
- Yuqori yorliqlar: ✓ `XATOLAR.md` tayyor (faqat 3-amaliyot 3-bandi bajarilganda; aks holda yorliq yo'q) · {N}/2 to'g'ri · mobil trekda, 3-amaliyotda «Fayl navbatda» tanlangan bo'lsa — kulrang yorliq «O'rnatish fayli navbatda»
- Sarlavha (bloklar holatiga qarab, P-046; sinf 6 — o'quvchi qilgan ishni aytadi, har holat rost — E 54):
  - uch blok; «Buzildi» bor, hamma tuzatilgan topilma «takrorlanmadi», «qoldi» yo'q — **Tuzatish qilindi va qayta tekshiruvda takrorlanmadi.** (52)
  - uch blok; «Buzildi» yo'q edi — **Besh yo'l tekshirildi — mahsulotingiz buzilmadi.** (48)
  - uch blok; «qoldi» yoki «yana buzildi» bor — **`XATOLAR.md` tayyor — qolgan topilma ochiq yozilgan.** (50)
  - 1 va 2-blok («Tuzatish qilindi» bor), 3-blok yo'q — **Tuzatish qilindi — qayta tekshirish hali qilinmagan.** (52)
  - 1-blok, «Buzildi» bor, 2-blok yo'q — **Besh yo'l yozildi — tuzatish hali qilinmagan.** (45)
  - 1-blok, «Buzildi» yo'q, 3-blok yo'q — **Besh yo'l tekshirildi — `XATOLAR.md` hali yozilmagan.** (51)
  - 1-blok to'liq emas, kamida bitta karta bor — **Tekshiruv hali tugamagan — qolgan yo'llar kutyapti.** (51)
  - hech biri — **Besh tekshiruv hali yozilmagan.** (31)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- «Bugungi asosiy fikr» qutisi yakunda yo'q (SABOQ E 50) — fikr A-bo'lim 2-bandida, darsning ichki o'qi.
- Endi siz bilasiz (5):
  - Barqarorlik tekshiruvi — asosiy yo'llarni buzish yozuvi bilan tekshirish.
  - Keyin qo'shilgan ish eski yo'lga tegishi mumkin, shuning uchun besh yo'l ham qayta ko'riladi.
  - Mahsulotda yo'q yo'l «buzilmadi» deb emas, «hali yo'q» deb yoziladi.
  - Barqarorlik kunida faqat yozuvdagi topilma tuzatiladi; qolgani `XATOLAR.md` da «qoldi» deb, sababi bilan turadi.
  - Yangi versiya o'zgargan qismga qarab chiqadi: Backend — Render'da, ilova — yangi o'rnatish fayli bilan.
- Uyga vazifa — yo'q (loyiha kuni; tayanch 4). `uyga: null`. «O'rnatish fayli navbatda» yorlig'i ostida bitta qator: «Fayl tayyor bo'lgach, lendingdagi havolani keyingi dars boshida almashtirasiz.»
- Keyingi dars — «Zaxira dars»
- Nishonlaringiz — N/4
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash
- ✎ «Tuzatish qilindi va qayta tekshiruvda takrorlanmadi» — ikki fakt, «tuzatildi» emas (sinf 5). Holatlar 8 ta, har biri rost (E 54: «hech narsa» — alohida; qisman — «hali tugamagan»). «Keyingi dars» qatori — App.jsx `m11-13` nomi (T-038: boshqa joyda va'da yo'q); 14-Modul tilga olinmaydi.

---

## Nishonlar (4) — inglizcha nom va medal (o'yin qatlami)
- **Honest Mark** — Mahsulotda yo'q yo'lga to'g'ri belgini tanladingiz (4-ekran, 1-savol)
- **Fix Only** — Yangi tugmani olib tashlash kerakligini topdingiz (7-ekran, 2-savol)
- **Five Paths** — Besh yo'lni o'z mahsulotingizda tekshirib yozdingiz (1-amaliyot, 4-band «Bajardim») — bonus, birinchi urinish sharti yo'q (152)
- **Bug Log** — Topilmalarni `XATOLAR.md` ga holati bilan yozdingiz (3-amaliyot, 3-band «Bajardim») — bonus, birinchi urinish sharti yo'q; tavsif — qilingan ish, «mahsulot barqaror» emas (sinf 6)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 07.10: Honest Mark · Fix Only · Five Paths · Bug Log — 0). Ikki blok nishoni — ish uchun (P-048), tekin emas.

## Qisqa takrorlash oynalari (2) — har ballik testga 3 karta (S-026: kodsiz kartada raqam)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Belgi ko'rilgan narsani aytadi»
   - 1 · Buzildi — yo'l bor, kutilgani bo'lmadi.
   - 2 · Buzilmadi — yo'l bor, kutilgani bo'ldi.
   - 3 · Mahsulotimda hali yo'q — yo'l tekshirilmadi.
   - Sinfga savol: Bo'sh qolgan karta yozuvda nimani yashiradi?
2. 2-savol (7-ekran) — «Bugun faqat tuzatish»
   - 1 · O'zgarish yozuvdagi topilmaga bog'lanadi — bugun qilinadi.
   - 2 · Topilmaga bog'lanmasa — yangi funksiya: bugun qo'shilmaydi.
   - 3 · Ulgurmagan topilma — `XATOLAR.md` da «qoldi», sababi bilan.
   - Sinfga savol: Agent «yana bir qulaylik qo'shay» desa, nima deysiz?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Barqarorlik tekshiruvi nima? | Asosiy yo'llarni buzish yozuvi bilan tekshirish | Bu darsda besh yo'l: kirish va ro'yxat, asosiy harakat, to'lov oqimi, taklif havolasi, eslatma yoki Telegram xabari |
| Nega eski yo'llar ham qayta tekshiriladi? | Keyin qo'shilgan ish ularga tegishi mumkin | Mentor misolida taklif kodi ro'yxatdan o'tish formasiga qo'shilgan |
| Buzish yozuvida qaysi uch qator bor? | Nima qildim, nima kutdim, nima bo'ldi | Oxirida belgi: buzildi yoki buzilmadi |
| «Nima kutaman» qachon yoziladi? | Tekshirishdan oldin | Shunda natija bilan solishtirsa bo'ladi |
| Mahsulotingizda yo'q yo'lga qaysi belgi qo'yiladi? | «Mahsulotimda hali yo'q» | U «buzilmadi» emas: bu yo'l tekshirilmagan |
| Mentor misolida besh tekshiruvdan nechtasida ilova buzildi? | Ikkitasida: taklif havolasi va Telegram xabari | Kirish, asosiy harakat va to'lov oqimi — buzilmadi |
| Mentor misolida kichik harfdagi taklif kodi bilan nima bo'ldi? | Kod qabul qilinmadi — taklif sanalmadi | Tuzatish: kod katta harfga o'tkazilib solishtiriladi |
| Mentor misolida ikki telefon bir vaqtda «O'yinlar»ni ochganda nima bo'ldi? | Keyingi «Doimiy o'yin» ikki marta yaratildi, Telegram xabari ikki marta ketdi | Tuzatish: Database bir sanaga bitta o'yinni qabul qiladi — 3-darsdagi takror xabar kabi: bitta ish bir marta |
| Barqarorlik kunida yangi funksiya qo'shiladimi? | Yo'q — faqat yozuvdagi topilma tuzatiladi | Yangi funksiya tekshirilmagan yangi yo'l ochadi |
| Tuzatishga ulgurmagan topilma nima qilinadi? | `XATOLAR.md` ga «qoldi» deb, sababi bilan yoziladi | Qolgan topilma yashirilmaydi |
| «Tuzatish qilindi» va «qayta tekshiruvda takrorlanmadi» farqi nimada? | Birinchisi — kod o'zgargani, ikkinchisi — o'sha usul bilan ko'rilgan natija | Ikkalasi alohida belgilanadi |
| Ilova kodi o'zgarsa, APK o'rnatganlarga yangi versiya qanday yetadi? | Yangi o'rnatish fayli va lendingdagi yangi havola orqali | APK o'zi yangilanmaydi; faqat `backend/` o'zgarsa — Render'ning o'zi yetadi |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. Mentor besh yo'lni yozuv bilan qayta ko'rdi. Bu qanday ish? ✔ Barqarorlik tekshiruvi · Yangi funksiya qo'shish · Pullik obunani yoqish · Taklif havolasi tarqatish
2. Mentor taklif kodini qo'shdi. Nega ro'yxatdan o'tish ham tekshirildi? Ro'yxat har hafta o'zi o'zgaradi · ✔ Kod shu formaga qo'shilgan edi · Login endi taklif kodi bo'lgan · Telegram bot formani yangilagan
3. Tekshiruv uchun qaysi hisobdan foydalanasiz? Sinfdoshingiz bergan login va paroldan · Ilovadagi eng faol o'yinchi hisobidan · ✔ Tekshiruv uchun ochilgan yangi hisobdan · Hisobsiz — kirmagan mehmon ko'rinishidan
4. Nima kutishingizni qachon yozasiz? Natijani ko'rganingizdan keyin · Agent «Tayyor!» degan zahoti · Dars oxirida, yakun ekranida · ✔ Tekshirishni boshlashdan oldin
5. Nega barqarorlik kunida yangi funksiya qo'shilmaydi? ✔ U tekshirilmagan yangi yo'l ochadi · Agent bugun yangi kod yoza olmaydi · Yangi funksiya faqat pullik bo'ladi · Foydalanuvchilar uni umuman sezmaydi
6. Uch topilma bor, vaqt ikkitasiga yetdi. Uchinchisi-chi? `XATOLAR.md` dan butunlay o'chiriladi · ✔ `XATOLAR.md` da «qoldi» deb, sababi bilan · Agentga «Tuzatish qilindi» deb yozdiriladi · Hech kimga aytilmay, keyinga qoladi
7. Mentor misolida «Ikki marta yuborish»dan keyin Pro necha kunga yoqildi? 60 kunga — ikki marta · 7 kunga — mukofot kabi · ✔ 30 kunga — bir marta · Umuman yoqilmadi — rad
8. «Tuzatish qilindi» nimani bildiradi? Qayta tekshiruvda takrorlanmaganini · Topilma `XATOLAR.md` dan o'chganini · Agent ishni endi boshlaganini · ✔ Kodda o'zgartirish qilinganini
9. Mentor tuzatishi faqat `backend/` da. APK'ni yangilash kerakmi? ✔ Yo'q — ilova o'sha Backend'ga ulanadi · Ha — APK har tuzatishda o'zi yangilanadi · Ha — Render APK'ni ham qayta yig'adi · Yo'q — APK'ni yangilab bo'lmaydi
10. Mentor misolida brauzer ko'rinishi push'dan keyin o'zi yangilanadimi? Ha — Netlify uni har safar o'zi yig'adi · ✔ Yo'q — qayta eksport va deploy kerak · Ha — Expo Go uni o'zi yangilaydi · Yo'q — uni faqat APK almashtiradi
11. Mentor misolida ikki telefon bir vaqtda «O'yinlar»ni ochganda nima bo'ldi? Bitta o'yin yaratildi, xabar ham bitta · Ikkala telefonda ilova yopilib qoldi · ✔ Keyingi o'yin ikki marta yaratildi · Hamma o'yinlar ro'yxatdan o'chib ketdi
12. Darsdan keyin tekshiruv akkauntlari nima qilinadi? Haqiqiy sanoqda qolaveradi · Sinfdoshlarga berib yuboriladi · `namuna` deb belgilanib qoladi · ✔ `id` bo'yicha o'chiriladi

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
- Ha/Yo'q savollari — 9 va 10: har birida ikkitadan «Ha», ikkitadan «Yo'q» (S-006). Kod belgisi faqat to'g'rida emas (6 — A va B da; 8 — B da; 12 — C va D da).
- 2 — tushuncha 1 g'oyasi (keyin qo'shilgan ish eski yo'lga tegadi); distraktorlar uch turkumda: kod o'zi o'zgaradi · noto'g'ri mahsulot fakti · noto'g'ri tizim qismi. 7 — 5-dars tuzatishi bugun ham ishlaydimi (3-tekshiruv). 9 — Mentor qarori (TAYANCHGA SAVOL 5).
- 10 — «Mentor misolida» bilan chegaralangan: boshqa sozlamada (Git bilan ulangan sayt) Netlify o'zi yig'ishi mumkin — savol Mentorning brauzer ko'rinishi haqida (12-Modul 9.28). 11 — tuzatishgacha holat (asosiy seans qarori 07.10; tayanch 1.12 yangilanadi); A — kutilgan holat, buzilmasa rost bo'lardi — savol «Mentor misolida» bo'lgan voqea haqida.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari ru'da ham o'sha; R-008): barqarorlik tekshiruvi · buzish yozuvi · besh yo'l · buzildi · buzilmadi · hali yo'q · Tuzatish qilindi · takrorlanmadi · `XATOLAR.md` · yangi versiya · taklif kodi · «Doimiy o'yin» · Maydon Jamoa

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 12: hook · plan · concept · practice(blok) · test · concept · practice(blok) · test · practice(blok) · stats · flashcards (`sflash`) · summary.
   `INLINE_KEYS`: s4 **2 (C)** · s7 **0 (A)**; bloklar (3, 6, 8) — `practice: -1`. Final tartib-mashqi yo'q (172). `LESSON_META.lessonId` — `m11-12-v1`, `lessonTitle` — «Loyiha kuni: barqarorlashtirish». App.jsx `m11-12` ga `comp: StabilizeDayLesson` — «qur» bosqichida (asosiy seans, aniq Edit).
2. **Bitta manba (180):** `YOL_SAHNA` (telefon kadrlari: `royxat` · `oyinlar` · `elon` · `tolovEkran` · `mashq` · `lending` · `telegram`; kichik ikkinchi telefon; bir qatorli Neon kartasi) ·
   `YOLLAR` (besh yo'l: kalit `kirish` · `harakat` · `tolov` · `taklif` · `xabar`, nomi, «Bu yo'lga tekkan darslar», oldindan yozilgan «Nima qilaman») · `MENTOR_TEKSHIRUV` (A-bo'lim 4-band jadvali, aynan) ·
   `AGENT_TAKLIF` (to'rt taklif: matn, `tur: 'tuzatish' | 'yangi'`, `topilma: 4 | 5 | null`) · `MENTOR_XATOLAR` (A-bo'lim 4, fayl matni aynan) · `BELGILAR` (yozuv va rang tokeni — A-bo'lim 12) — 0, 1, 2, 5-ekranlar, bloklar o'ngi va kartochka shundan o'qiydi.
3. **Dars holati (`ccProgress`; yangi `pm-…` kaliti yo'q — tayanch 8):** `yozuv: [{ yol: 'kirish' | 'harakat' | 'tolov' | 'taklif' | 'xabar', qilaman, kutaman, boldi, belgi: 'buzildi' | 'buzilmadi' | 'yoq' | null, tanlandi: bool, tuzatishQilindi: bool, qayta: 'takrorlanmadi' | 'takrorlandi' | null, qoldiSabab: string | null }]`
   (beshta, tartib o'zgarmaydi; `yol` — barqaror kalit) · `xatolarYozildi: bool` · `navbatda: bool | null` · blok bayroqlari. Ism, login, parol, Telegram chat raqami holatga ham yozilmaydi.
   O'qiladi: `pm-m11d5-buzish` (faqat 1-amaliyot 3-kartasi tepasidagi qator; yozilmaydi) · `pm-m9d8-platforma.trek` (yo'q bo'lsa — 1-amaliyot tepasida «Mobil trek» · «Web-trek», tanlov shu kalitga yoziladi — 11-Modul 9.77).
4. **`YolSahna`** komponenti: chapda telefon (≈170×272 — SABOQ 22; yorliq ramka ustida — SABOQ 23; «Maydon Jamoa» o'z rangida), ostida ixcham chiziq «1 · 2 · 3 · 4 · 5»; kerak bo'lsa kichik ikkinchi telefon va bir qatorli Neon kartasi; o'ngda bitta karta — `BuzishYozuvi` · agent chati · `XatolarFayl` (≤3 blok).
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: sb-och sb-korish sb-belgi sb-taklif sb-tanla sb-qayta`). `prefers-reduced-motion` da harakat to'xtaydi (DE-200). Logotip va emoji yo'q (D4). **Karta maydoni (raqam, muddat, CVV) hech bir kadrda chizilmaydi.**
5. **0-ekran:** agent chati — uch pufak navbat bilan (kirish animatsiyasi, SABOQ 19); «Ilovani ochish» → «O'yinlar» → variantlar faol; javobdan keyin pufaklar ostida «da'vo · birga tekshirilmagan».
6. **2-ekran:** `QBashorat` / `QTaxmin` (yopilmaydi — ixcham qator); besh karta bittadan (E 53); «Tekshiruvni ko'rish» → `YOL_SAHNA` kadrlari ≈3 s; belgi tugmalari — to'g'risi `MENTOR_TEKSHIRUV[i].belgi` dan; noto'g'ri → silkinish + `QXato`; to'g'ri → ixcham qatorga uchadi;
   nom qatori 5/5 dan keyin; xulosa qutisi (E 42): natija qatori · xulosa · QIzoh; `zoom`; `tugadi`.
7. **5-ekran:** `QBashorat` / `QTaxmin`; `AGENT_TAKLIF` bittadan («Taklif N / 4»); ikki tugma; to'g'ri «tuzatish» → SVG chiziq pufakdan topilma kartasiga + yorliq «tuzatadi»; to'g'ri «yangi funksiya» → kulrang + «hech bir topilmaga bog'lanmaydi»; noto'g'ri → silkinish + `QXato`;
   ikki ro'yxat (uzuq chiziqli joyga taklif tushadi); xulosa qutisi (E 42); `zoom`; `tugadi`.
8. **Bloklar (3, 6, 8)** — `ScreenBlok` + `QBlok` + `QPrompt` (12-Modul 9-dars naqshi):
   - **1-amaliyot:** 3-bandda `TekshiruvKarta` ×5, bittadan: «Nima qilaman» (textarea, oldindan `YOLLAR`), «Nima kutaman» (shart), «Nima bo'ldi» (shart), uch belgi tugmasi; belgi qo'yilgach yorliqlar «Nima qildim» · «Nima kutdim» bo'ladi (matn o'sha; 12-Modul 5-dars naqshi), karta ixcham qatorga yig'iladi (bosib tahrirlanadi); «Yordam» — `MENTOR_TEKSHIRUV[i]`.
     3-karta tepasida `pm-m11d5-buzish` qatori: `urinishlar.map(u => USUL_NOMI[u.usul] + ' — ' + BELGI_NOMI(u.buzildi) + (u.qayta ? ' · ' + QAYTA_NOMI[u.qayta] : ''))` (`USUL_NOMI`: `ikki` — «ikki marta yuborish» · `kech` — «kechiktirib yuborish» · `rad` — «rad etish» · `imzo` — «noto'g'ri imzo»); kalit yo'q — qator ko'rinmaydi (KORPUS §69: yo'qlik aytilmaydi).
     «Davom etish» — uchta karta belgilangach (E 55 naqshi); blok bayrog'i — besh karta belgili va 4-band «Bajardim». `ortda` — faqat shu blokda: `m13-dars-12-start` (SABOQ 39). Prompt qavsi `{asosiy harakat}` — bo'sh, kulrang «masalan».
   - **2-amaliyot:** 1-bandda tanlov kartalari (faqat `belgi: 'buzildi'`, ko'pi bilan 2) → `tanlandi`; `{tanlangan topilmalar}` ← `yozuv` (format: «N · {yo'l nomi}. Nima qildim: … Nima kutdim: … Nima bo'ldi: …»); `{avvalgidek ishlashi kerak bo'lgan yo'llar}` ← `belgi: 'buzilmadi'` nomlari (tahrirlanadi);
     3-bandda har tanlangan kartaga «Tuzatish qilindi» → `tuzatishQilindi`; «Davom etish» — 4-band «Bajardim»idan keyin (erta ochilmaydi). «Buzildi» yo'q bo'lsa — 2, 3-band o'tkaziladi.
   - **3-amaliyot:** 2-bandda har `tuzatishQilindi` kartaga ikki tugma («Qayta tekshiruvda takrorlanmadi» · «Qayta tekshiruvda yana buzildi») → `qayta`; «Nega qoldi?» maydoni — `buzildi` bo'lib tanlanmagan, `takrorlandi` bo'lgan kartalarga → `qoldiSabab`;
     3-bandda `{to'liq yozuv}` ← `yozuv` (format: har topilma «## {N} · {yo'l nomi}» · «- Usul: {qilaman}» · «- Natija: kutdim — {kutaman}; bo'ldi — {boldi}» · «- Holat: …»; oxirida «Buzilmagan yo'llar: …» · «Tekshirilmagan yo'llar: … / yo'q» — `belgi: 'yoq'` va `null` lar); `xatolarYozildi` — 3-band «Bajardim»;
     4-band — trek bo'yicha qatorlar; mobil trekda `eas build` qatori faqat «`mobil/` o'zgardi» belgilansa (o'quvchi `git diff --stat` dan biladi — tanlov tugmasi «`mobil/` o'zgardi» · «Faqat `backend/`»); ikki tugma «Havola almashtirildi» · «Fayl navbatda» → `navbatda`.
   - ⚠️ Qolipda yo'q (12-Modul bloklari bilan bir — MEXANIZM-TAKLIF): `{…}` yonidagi kulrang «masalan», oldindan yozilgan qiymat, qadam ichidagi «Yordam», tekshiruv va tanlov kartalari, «Ulgurmasangiz» qatori — o'z faylida kichik o'rovchi bilan, `src/qolip` ga tegilmaydi.
   - `ACH_TRIGGERS`: 4 → Honest Mark · 7 → Fix Only · 1-amaliyot 4-band → Five Paths · 3-amaliyot 3-band → Bug Log.
9. **11-ekran `QYakun`:** sarlavha — `yozuv` va blok bayroqlaridan (sakkiz holat); ✓ yorliq — `xatolarYozildi`; «O'rnatish fayli navbatda» — `navbatda`; `recap` 5 qator; `uyga: null`; `keyingi` — «Zaxira dars». «Bugungi asosiy fikr» yo'q (E 50).
10. `RECAPS` 2 (kalit = 4 va 7) · `Q_LABELS` {4, 7} · `ACHIEVEMENTS` 4 · `QUIZ_BANK` 12 (to'g'ri javob 0·1·2·3 ×3) · flashcard 12 (`sflash`, Mentor yo'q, «Kartani bosing — javob ochiladi»; SABOQ 12, 16) · `QZ_BG_SHAPES` fon so'zlari {uz, ru}, emoji yo'q.
11. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6). Hook javoblari «Aynan!» / «Qiziq fikr!» (T-028, T-067). `narrow` faqat 4, 7, 9-ekranlarda (171).
12. **Darvozalar:** `npm run gates -- src/11-Modull/StabilizeDayLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` (SABOQ 31) · `lint:layout` 1280/1366/390 · surat 1280 + 393; har ekran «4 savol» (SABOQ 30) hisobotda.
13. ru — uz tasdiqlangach, bir yo'la (6-RU). Tayanch 10 da yo'q yangi so'zlar (RU bosqichida o'lchanadi): barqarorlik tekshiruvi · topilma · «Mahsulotimda hali yo'q» · «qoldi» · tekshiruv akkaunti · yangi funksiya.

## REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m13-dars-12-start` = `m13-dars-11-done` = `m13-dars-10-done` → `m13-dars-12-done`, tayanch 3)
1. `m13-dars-12-start`: `README.md` ga eslatma «Bu holatda barqarorlik tekshiruvi qilinmagan: ikki topilma bor — 12-darsda topiladi.» (tayanch 3 dagi `05-start` naqshi; TAYANCHGA SAVOL 14).
   ⛔ Muhrdan oldin ikki topilma haqiqatan takrorlanishi tekshiriladi — Mentor telefonida (Android, Expo Go) va brauzer ko'rinishida: 4 — «ab12cd» bilan `taklif_qilgan_id` bo'sh qoladimi; 5 — ikki telefon bir vaqtda «O'yinlar» ni ochganda keyingi «Doimiy o'yin» ikki marta yaratilib, Telegram xabari ikki marta ketadimi
   (vaqtga bog'liq — bir necha urinish, natija jurnalga; Shubhali 1, 12). Mos kelmasa — MD (yozuv, sahna, testlar, `MENTOR_XATOLAR`) va tayanch 1.12 haqiqiy natijaga moslanadi.
2. `m13-dars-12-done` (`backend/`; asosiy seans qarori 07.10 — tayanch 3 qatori: «ikki tuzatish (taklif kodi katta-kichik harf · keyingi doimiy o'yin bir marta — Database cheklovi)»): ro'yxatdan o'tishda kelgan taklif kodi katta harfga o'tkazilib solishtiriladi ·
   `oyinlar` da cheklov — bitta doimiy o'yin seriyasida bitta sana uchun bitta o'yin (masalan, seriya va sana bo'yicha noyoblik; seriya qanday saqlanishi — 4-dars kodiga qarab); `GET /oyinlar` dagi ikkinchi yaratish urinishi xatosiz o'tkazib yuboriladi va Telegram xabari faqat haqiqatan yaratilgan o'yin uchun ketadi (8-dars qoidasi o'zgarmaydi).
   `mobil/`, `lending/` o'zgarmaydi → APK va brauzer ko'rinishi qayta chiqarilmaydi; yangi versiya — `git push` bilan Render (TAYANCHGA SAVOL 5).
3. `XATOLAR.md` (repo ildizi) — `MENTOR_XATOLAR` aynan · `README.md` «Darslar va teglar» jadvaliga `m13-dars-12-done` qatori.
4. Muhrdan oldin: besh tekshiruv `MENTOR_TEKSHIRUV` bo'yicha `12-start` da (natija jadvalga mosmi — jurnalga), tuzatishdan keyin 4 va 5 o'sha usul bilan qayta («takrorlanmadi»; 5 — bir necha bir vaqtdagi ochish bilan); Mentor tekshiruv akkauntlari, tekshiruv o'yinlari va sanoq yozuvlari agent ko'rsatgan `id` lar bo'yicha o'chiriladi; haqiqiy `oyinchilar` va `oyinlar` yozuvlari o'zgarmaydi.

## Manbalar (o'zim tekshirdim yoki tayanch orqali, 07.10.2026; o'quvchiga ko'rinmaydi)
1. Tayanch (`00-MODUL-TAYANCH.md`) 1.12 va 1.13 — besh tekshiruv, Mentor natijasi, 4-topilma va uning tuzatishi (aynan); 5-topilma, sababi va tuzatishi — asosiy seans qarori (muvofiqlashtiruvchi xabari, 07.10; tayanch 1.12 va 3 shunga yangilanadi); `XATOLAR.md` (usul · natija · holat), uch blok; Qaror-0 19 (DARS-q2 A) — «yangi funksiya qo'shilmaydi; 14-Modulning demo-testi va performance darslari takrorlanmaydi».
2. Tayanch 1.4 (to'lov taklifi ekrani so'zma-so'z; «Har hafta takrorlansin»; keyingi o'yin `GET /oyinlar` da) · 1.5 (5-dars tuzatishlari, «To'lov o'tmadi — qayta urinib ko'ring», Pro tugashi, `pm-m11d5-buzish`) · 1.8 (Telegram xabari shakli, «Telegram'da xabar olish» / «Telegram xabarlarini o'chirish») ·
   1.10 («Taklif kodi: AB12CD», «Taklif kodi (bo'lsa)», `taklif_qilgan_id`, mukofot va shartlar, `10-done` dagi katta harf) · 8 (12-dars yangi kalit yozmaydi) · 9.1 (summa 15 000, mashq sahifa qatori) · 9.7 (`POST /tolov/boshlash` — har to'lovga yangi raqam).
3. 12-Modul tayanchi (`feedback/F-1006-12modul/00-MODUL-TAYANCH.md`): 1.7 («Bu login band», «Hisobni o'chirish», `namuna`) · 6 (EAS: `eas build -p android --profile preview`, bepul rejada oyiga 15 Android build; `npx expo export -p web`) · 9.28 (brauzer ko'rinishi — `netlify deploy --prod --dir dist`, push'dan keyin o'zi yangilanmaydi) ·
   9.29 (Render faqat `backend/` o'zgarsa qayta chiqaradi) · 9.35 a, 9.37 g, h, 9.39 b, 9.41 i (tekshiruv akkaunti, `id` bo'yicha o'chirish, sherik — agentdan oldin, qaytarib bo'lmaydigan o'zgarishdan oldin ro'yxat, sun'iy yozuvni o'chirish) · 9.36 h (blok bayrog'i) · 9.40 i (web-trek — qayta `netlify deploy --prod`) · 9.41 h (loyiha kunida «uyda» yo'q).
4. Netlify CLI — 12-Modul `08-PmDropOff-v3.md` Manbalari (docs.netlify.com/cli/get-started, 06.10.2026): «By default, the `deploy` command deploys to a unique _draft_ URL for previewing and testing» · «To do a _production_ deploy to your main site URL, use the `--prod` flag» → 3-amaliyot 4-band, arena 10.
5. Render — 12-Modul `05-BreakAndFix-v3.md` Manbalar 7, 8 (render.com/docs/deploys, render.com/docs/monorepo-support, 06.10.2026): «Whenever you push or merge a change to that branch, by default Render automatically rebuilds and redeploys your service.» ·
   «If you set a root directory for your service, Render only triggers an autodeploy if your changes affect files anywhere under that directory.» → 2-amaliyot 4-band, 3-amaliyot 4-band, arena 9.
6. Git — `git diff --stat` (o'zim, lokal `git diff --help`, git 2.53.0, 07.10.2026): «--stat[=<width>[,<name-width>[,<count>]]] — Generate a diffstat.» → 2-amaliyot 4-band (o'zgargan fayllar ro'yxati).
7. Kursdagi so'zlar (grep, 07.10): buzish yozuvi, «Tuzatish qilindi», «qayta tekshiruvda takrorlanmadi / yana buzildi», kutish oldin — 12-Modul `05-BreakAndFix-v3.md` · tekshiruv yozuvlarini `id` bo'yicha o'chirish, «Havola almashtirildi» · «Fayl navbatda», «uyda» yo'q — 12-Modul `09-RetentionDay-v3.md` ·
   «APK o'zi yangilanmaydi», lending havolasini almashtirish prompti, `cd mobil` — 12-Modul `08-PmDropOff-v3.md` · mashq sahifa matni va tugmalari — pilot `03-PaymentWebhook-v3.md` · App.jsx 455–457 (`m11-11`, `m11-12` osti «asosiy yo'llarni tekshiramiz va tuzatamiz», `m11-13`).
8. Tashqi xizmatlarning tugma va menyu nomlari (Render, Netlify, Expo, Neon, Telegram) o'quvchi matnida yo'q — faqat buyruqlar va kursda o'tilgan so'zlar (tayanch 6, 12-Modul tayanchi 6). Komissiya, narx, limit bu darsda aytilmaydi (oyiga 15 Android build — 12-Modul tayanchi 6 dan).

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Mentorning besh tekshiruv yozuvi** (A-bo'lim 4 jadvali) — tayanchda faqat natija va tuzatish bor; «Nima qildim / kutdim / bo'ldi» matni va «Bu yo'lga tekkan darslar» qatori — mening qarorim (har biri tayanch faktidan). ⛔ «qur» da haqiqiy natija ustun.
2. **5-tekshiruv usuli:** agent tekshiruv o'yinining vaqtini o'tgan haftaga suradi (bir hafta kutilmaydi), Mentor ikki telefonda «O'yinlar» ni bir vaqtda ochadi (sinfda — ikkala telefonda bir vaqtda pastga tortib yangilash). O'quvchiga 1-amaliyot 5-kartasida «xabar necha marta keldi» va «ikki qurilmada bir vaqtda» beriladi.
   Ko'prik 3-darsdagi takror xabarga (bitta ish — bir marta) — faqat kartochka 8 izohida, bir gap.
3. **Sahna uchun yangi tafsilot:** tekshiruv «Doimiy o'yini» — «Juma, 18:00 · Mahalla maydoni» (namuna «Shanba, 18:00» bilan to'qnashmasin) · Telegram xabarida «— 0 / 10» (yangi yaratilgan o'yin). Tayanch 1.8 namunasida «3 / 10» — yangi hafta o'yinida kim qo'shilgan bo'lishi 8-dars mexanikasiga bog'liq: 8 MD bilan moslash kerak.
4. **4-topilmaning «Nima bo'ldi»** — «kod qabul qilinmadi — taklif sanalmadi» (`taklif_qilgan_id` bo'sh). Forma kichik harfdagi kodga nima deydi (xato qatori yoki jim qabul) — tayanchda yo'q; 10 MD bilan moslash.
5. **Mentor tuzatishlari ikkalasi `backend/` da** → yangi versiya — Render; APK va brauzer ko'rinishi qayta chiqarilmaydi (ular o'sha Backend'ga ulanadi). Tayanch 1.12 «APK — yangi o'rnatish fayli, havola almashtiriladi» — o'quvchi uchun shartli (`mobil/` o'zgarsa).
   5-tuzatish — Database cheklovi: migratsiya `backend/` ichida, Render yangi versiyasi bilan qo'llanadi. Muqobil: kod ilovada ham katta harfga o'tkazilsa — Mentor ham APK va brauzer ko'rinishini chiqaradi (3-amaliyot to'liq ko'rinadi, lekin EAS navbati vaqt oladi). Qaror sizda.
6. **`XATOLAR.md` shakli:** sarlavha, har topilma — yo'l nomi + usul · natija · holat; holat so'zlari sinf 5 bo'yicha («tuzatildi» o'rniga «Tuzatish qilindi · qayta tekshiruvda takrorlanmadi» / «… yana buzildi» / «qoldi — {sabab}»); oxirida «Buzilmagan yo'llar» va «Tekshirilmagan yo'llar»; topilma yo'q bo'lsa ham fayl yoziladi.
7. **Topilma tanlash qoidasi** (bu kursda): avval odamning asosiy ishini to'xtatadigan, keyin odamga noto'g'ri narsa ko'rsatadigan yoki yuboradigan. Tayanchda faqat «eng muhim 1–2 tasi».
8. **5-ekran — agentning to'rt taklifi:** ikki tuzatish (4 — tayanch 1.12 so'zi; 5 — asosiy seans tuzatishi agent tilida: «Bir sanaga keyingi o'yin ikki marta yaratilmasligi uchun Database'da cheklov qo'yaman.») + ikki yangi funksiya («Ro'yxatdan o'tish ekraniga yangi dizayn beraman.», «Pro tugashidan oldin tashkilotchiga Telegram xabari yuboraman.») — mening qarorim; «yangi funksiya qo'shilmaydi» qoidasini sahnada ko'rsatish uchun.
9. **Uchinchi belgi «Mahsulotimda hali yo'q»** (1-amaliyot, 1-savol, yakun, `XATOLAR.md` «Tekshirilmagan yo'llar») — o'quvchi mahsulotida 4 yoki 5-yo'l bo'lmasligi mumkin (ortda qolgan); «buzilmadi» deb yozish yolg'on bo'lardi.
10. **Atama «tekshiruv akkaunti»** (12-Modulda «tekshiruv akkaunti») — UI «Hisobni o'chirish» va tayanch 1.10 «yangi hisob» bilan bir so'z. Modul bo'yi bir xillash kerakmi (5, 10-darslar)?
11. **Bloklar band nomlari:** 1-amaliyot — Ochish · Prompt · Besh tekshiruv · Tekshirish; 3-amaliyot — Ochish · Qayta tekshirish · `XATOLAR.md` · Yangi versiya. Tayanch 4 dagi «Ochish → Prompt → Ishga tushirish → Tekshirish» dan chetlashish (12-Modul 5-dars A1 va A2 naqshi: kod yozilmaydigan va qayta tekshiruvli blok).
12. **Hook:** agent pufaklari («Tayyor! To'lov taklifi ekrani ishlaydi.» · «Tayyor! Telegram xabari yuboriladi.» · «Tayyor! Taklif kodi formaga qo'shildi.»), ✔ «Ro'yxatdan to'lovgacha o'zim bosib ko'raman» — mening qarorim.
13. **Taklif tekshiruvidagi hisoblar asosiy ish qilmaydi** — aks holda o'quvchining o'ziga mukofot yoziladi (tayanch 1.10 sharti: yangi hisob + asosiy harakat; tekshiruv akkaunti formadan ochilsa `namuna = false`).
14. **`m13-dars-12-start` README eslatmasi** («ikki topilma bor — 12-darsda topiladi») — tayanch 3 da faqat `05-start` uchun bor; «Ortda qoldingizmi» — 1-amaliyotda `12-start`, tuzatilgani `12-done` (bir qatorda).
15. **Saqlash:** yangi kalit yo'q; besh karta dars holatida (`ccProgress`); o'qiladi `pm-m11d5-buzish` (3-karta tepasidagi qator) va `pm-m9d8-platforma.trek` (tayanch 4 umumiy qoidasi; tayanch 4 jadvalining 12-qatorida faqat `pm-m11d5-buzish`).
16. **Testlar mavzusi:** 1-savol — «hali yo'q» belgisi (1-amaliyot qoidasi), 2-savol — yangi funksiya (5-ekran g'oyasi, yangi vaziyatda). 2-ekran g'oyasi (keyin qo'shilgan ish eski yo'lga tegadi) — arena 2 va kartochka 2 da.
    Sabab: 2-ekran g'oyasi bo'yicha bitta himoyalanadigan javobli ekran savoli chiqmadi (besh yo'l hammasi qayta tekshiriladi — «qaysi yo'lni ham?» savolida bir nechta to'g'ri javob bo'lardi).
17. **«asosiy yo'l» va «asosiy harakat»** — bir ildiz, ikki ma'no (T-015 xavfi): ikkalasi ham tayanch so'zi. O'quvchi matnida «asosiy yo'llar» — faqat ta'rif (2-ekran nom qatori, kartochka 1, «Endi siz bilasiz» 1); boshqa joyda «besh yo'l», «yo'l».
18. **1-amaliyotda «Davom etish» uchta karta belgilangach** (E 55 naqshi); ulgurmagan yo'l `XATOLAR.md` da «Tekshirilmagan yo'llar» qatorida.
19. **Nishonlar:** Honest Mark · Fix Only · Five Paths · Bug Log (grep `src/`, `feedback/` — 0).
20. **Vaqt taqsimoti:** 1-amaliyot ≈ 25 (besh tekshiruv) · 2-amaliyot ≈ 17 · 3-amaliyot ≈ 18 — reja.
21. **3-amaliyot «qoldi» sababi** — o'quvchi yozadi (bitta qator, ipucha «masalan: vaqt yetmadi»); tanlanmagan topilma ham «qoldi».
22. **2-tekshiruvda tekshiruv o'yini** e'lon qilinadi — haqiqiy foydalanuvchilar uni ro'yxatda ko'radi (jonli xabar va Telegram xabari bormaydi: 4-dars xabari — faqat o'ziga tegishli o'yinga, 8-dars xabari — faqat «Doimiy o'yin»ga); tozalashda o'chiriladi.
    Muqobil: 2-tekshiruvda e'lon qilinmaydi, faqat namuna o'yinga qo'shilish va chiqish (tayanch 1.12 dagi «o'yin e'loni» to'liq tekshirilmaydi).

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **Ikki topilma Mentor repo'sida `m13-dars-12-start` da takrorlanadimi** — ayniqsa 5-topilma (ikki bir vaqtdagi so'rov): 4-dars kodi keyingi o'yinni qanday yaratishiga bog'liq (tekshiruv va yaratish bitta so'rovda bo'lsa ham, ikki so'rov orasidagi oraliq qisqa). «Qur» pilotida tekshiriladi; mos kelmasa MD va tayanch 1.12 moslanadi.
2. ⛔ **90 daqiqa** — besh tekshiruv (≈25), ikki tuzatish, Render kutishi, EAS navbati; «qur» pilotida taymer bilan.
3. ⛔ **Agent tekshiruv o'yinining vaqtini Database'da o'zgartira olishi** (Neon bilan qanday ulanishi) — pilotda; bo'lmasa: agent `UPDATE … WHERE id = …` so'rovini yozadi, o'quvchi Neon SQL Editor'da o'zi «Run» qiladi (12-Modul 10-dars Neon yo'li).
4. **Tekshiruv akkauntini o'quvchining o'z Telegram'iga ulash** (5-tekshiruv) — chat raqami tekshiruv akkaunti bilan Database'ga yoziladi va tozalashda o'chadi; o'smir uchun maqbulmi — Mentor ko'rib chiqadi (muqobil: 5-yo'lni eslatma bilan tekshirish).
5. **Sinfdagi tekshiruv yozuvlari** — tekshiruv o'yini haqiqiy foydalanuvchilarga bir necha daqiqa ko'rinadi; formadan ochilgan tekshiruv akkauntlari (`namuna = false`) dars oxirigacha haqiqiy sanoqqa (ro'yxatdan o'tganlar, taklif bilan kelganlar) kiradi — o'quvchi 3-amaliyot tozalashiga yetmasa qolib ketadi.
6. **Telefon klaviaturasi birinchi harfni o'zi katta qilishi mumkin** («Ab12cd») — 4-tekshiruvda o'quvchi aynan nima yozilganini ko'rishi kerak; pilotda ko'riladi.
7. **Hisob o'chirilganda bog'langan yozuvlar** (`tolovlar` dagi mashq qatorlari, `taklif_qilgan_id`, Telegram chat raqami) — tashqi kalit xatosi bo'lishi mumkin; agent ro'yxatda aytadi va hal qiladi — sinalmagan.
8. **EAS navbati va `netlify deploy`** — Netlify CLI'ga kirish 12-Modul 7-darsida qilingan deb olindi; interfeys nomlari aytilmaydi.
9. **Web-trekda 5-yo'l** — Telegram xabari (trekka bog'liq emas) yoki 12-Moduldagi «Siz yo'q paytingizda» qatori; «chiqmasligi kerak» holatini yuzaga keltirish o'quvchi mahsulotiga bog'liq — umumiy so'z bilan yozildi.
10. **Mentor fayl kartasi** (2-amaliyot kutilgan natija: «`backend/` — ikki fayl») — fayl nomlari «qur» da aniqlanadi.
11. **3-tekshiruvda rad etilgandan keyin qayta to'lov** — tayanch 9.7 bo'yicha har «To'lovga o'tish» yangi to'lov raqami oladi; rad etilgan sahifada qayta urinish ishlamasligi mumkin — shuning uchun yozuvda «keyin yana «To'lovga o'tish»». Pilotda ko'riladi.
12. **«Bir vaqtda» ochish** — ikki telefonda qo'lda bir vaqtda bosish har safar bir xil oraliq bermaydi: muammo birinchi urinishda chiqmasligi mumkin. O'quvchi yozuvida «bir vaqtda ochdim — bitta o'yin» natijasi «buzilmadi» bo'ladi, lekin bu «hech qachon ikki marta bo'lmaydi» degani emas («shu urinishda» — 12-Modul 5-dars naqshi).

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 16 band + 12-Modul tayanchi 7 + pul sinflari)
1. [x] **90 daqiqa — reja, o'lchov emas** — tepada taqsimot «reja, o'lchov emas» va ⛔ pilot taymeri; A-bo'lim 11; har blokda «Ulgurmasangiz»; 1-amaliyotda «Davom etish» uchta kartadan keyin; Render va EAS kutishi dars oqimini to'xtatmaydi (3-amaliyot 4-band); «sig'adi» deyilmagan (Shubhali 2).
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — Shubhali 1 (ikki topilma), 2 (90 daqiqa), 3 (agent Database'da vaqtni suradi) — ⛔; buyruqlar (`eas build`, `npx expo export -p web`, `netlify deploy --prod --dir dist`, `git diff --stat`) — 12-Modul tayanchi va rasmiy manbadan (Manbalar 3–6); tashqi xizmat tugma nomlari yo'q.
3. [x] **Saqlash kaliti — shartnoma** — yangi kalit yo'q (tayanch 8); dars holati shakli — KOD 3 (`belgi` uch holat + `null`, `qayta` uch holat, ish fakti `tuzatishQilindi` va natija `qayta` alohida); `pm-m11d5-buzish` faqat o'qiladi; boshqa darsning kaliti yozilmaydi; ism, login, chat raqami yozilmaydi.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Mentor misolida» (2-ekran xulosasi, kartochka 6–8, arena 7, 9–11), «Bu darsda» (5-ekran xulosasi), «bu kursda» (topilma tanlash qoidasi, 2-amaliyot 1-band); «Nima qilaman» — tahrirlanadigan namuna (1-amaliyot ✎); besh yo'l o'quvchi mahsulotida «hali yo'q» bo'lishi mumkin.
5. [x] **Kafolat va sabab da'vosi yo'q** — «Tuzatish qilindi» (ish fakti) va «qayta tekshiruvda takrorlanmadi» (natija) alohida (2, 3-amaliyot, yakun, kartochka 11, arena 8); agentning «Tayyor!», «qildim», sabab gapi — da'vo (0-ekran, 1, 2-amaliyot ✎);
   2-ekran xulosasi sabab emas, fakt («uchrashgan»); «odatda o'zi yangilaydi», «bir necha daqiqa cho'zilishi mumkin»; «tuzatildi», «endi ishlaydi», «barqaror bo'ldi» — o'quvchi matnida 0; Bug Log tavsifi — ish.
6. [x] **Yakun, «Bajardim», yashil xabar, nishon — faqat rost holatda** — yakun sakkiz sarlavha (har biri rost; «hech biri» alohida, qisman — «hali tugamagan»); ✓ yorliq faqat `XATOLAR.md` yozilganda; bloklar yashil xabari 2–3 holatli; blok bayrog'i faqat oxirgi band «Bajardim»idan; «Mahsulotimda hali yo'q» — «buzilmadi» deb sanalmaydi.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — «barqarorlik tekshiruvi» — besh yo'l, har biriga bitta yozuv (darsda aynan shu qilinadi); «topilma» — «buzildi» belgili karta; «tuzatish» — topilmaga bog'langan o'zgarish (5-ekran: bog'lanish ko'rinadi); «eng» so'zli ta'rif yo'q.
8. [x] **Test: bitta himoyalanadigan javob** — 1-savol distraktorlari uch turkumda (yolg'on «buzilmadi» · yo'qlikni nosozlik deyish · yozuvni yashirish); 2-savol — uch turkum (qabul qilish · haddan oshish · tushuncha almashuvi); arena 2, 5, 9, 11 distraktorlari turli turkumdan;
   haqiqiy hayotda rost bo'lib qolishi mumkin bo'lganlar chiqarildi (arena 10 «Mentor misolida» bilan chegaralandi); uzunlik ±15% (O'lchov); ✔ yolg'iz eng uzun emas.
9. [x] **Real odamlar xavfsizligi** — tekshirish faqat o'z mahsulotida (2-ekran QIzohi, 1-amaliyot 1-band qalin, arena 3); haqiqiy foydalanuvchi hisobi ishlatilmaydi; sherik o'z hisobidan; tekshiruv yozuvlari `id` bo'yicha o'chiriladi (3-amaliyot 4-band); Telegram'ni ulash — o'z Telegram'i (Shubhali 4); qo'l ko'tartirib sanash yo'q.
10. [x] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — besh tekshiruvni o'quvchi o'zi bajaradi va yozadi; o'zgarishni avval sherik, web-trekda yashirin oyna, keyin agent qiladi (1-amaliyot 3-band); qayta tekshirish — o'zi (3-amaliyot 2-band); agent hisob ochadi va `id` bo'yicha o'chiradi.
11. [x] **Web-trek teng yo'l** — sarlavhalarda «mahsulotingiz»; har blokda web qatori (sayt brauzerda, yashirin oyna, `prototip/`, Netlify, qayta `netlify deploy --prod`); 5-yo'l — Telegram xabari trekka bog'liq emas (Shubhali 9); test va arena ikkala trekka to'g'ri.
12. [x] **Mentor misoli ichki izchil** — sonlar tayanch 1.13 dan (3 buzilmadi, 2 buzildi, 2 tuzatish); 5-topilma — asosiy seans qarori bilan almashtirildi (avvalgisi 7-dars oferta 4-bandi va 5-dars A1 bilan zid edi); oldingi darslar matni aynan (to'lov taklifi ekrani, mashq sahifa, «Taklif kodi: AB12CD», Telegram xabari shakli); yangi tafsilotlar TAYANCHGA SAVOL 1–5, 8, 12, 22 da; bitta dalil ikki da'voda yo'q.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — 1-amaliyot `{asosiy harakat}` va tahrirlanadigan «Nima qilaman»; 2-amaliyot: qaysi topilma — o'quvchi tanlaydi, «Qayerda» — topilmaga tegishli fayllar, `{avvalgidek ishlashi kerak bo'lgan yo'llar}` — o'zi; tozalash — agent ro'yxat, o'quvchi «O'chir» (12-Modul 9.39 b).
14. [x] **Uyga vazifa yengil va aniq** — loyiha kuni: uyga vazifa yo'q, «uyda» deyilmaydi; o'rnatish fayli — keyingi dars boshida (A-bo'lim 10).
15. [x] **Ayb da'vosi yo'q** — xato yo'llari: «Shu xato chiqdi: {xato}. …»; «xatongiz emas», «sizda emas» — 0; 1-amaliyotda xato — «bu ham natija».
16. [x] **Kelajak va'dasi yo'q** — 5-ekrandagi rad etilgan g'oyalar «bugun emas», «keyin qilamiz» deyilmaydi; 14-Modul, performance, demo-test — faqat O'qituvchi eslatmasida; kelajak — yakundagi «Keyingi dars» qatori va «keyingi dars boshida» (o'rnatish fayli havolasi).
+ **12-Modul tayanchi 7 (11-Modul sinflari)** — holatga qarab yakun [x] · da'vo isbot emas [x] (agent «Tayyor!» — da'vo; «takrorlanmadi» — shu tekshiruv natijasi) · maxfiy qiymat agentga va ochiq joyga chiqmaydi [x] (`git status` — `.env` yo'q; xato yo'lida «`.env` qiymatlari, token va kalitlarni emas») ·
  tashqi xizmat haqida faqat rasmiy hujjat [x] (Manbalar 3–6) · har sonning manbasi [x] (A-bo'lim 6) · tayanchda yo'q narsa to'qilmagan [x] (TAYANCHGA SAVOL 1–22) · saqlash kaliti o'qiydigan darsdan [x] · test: bitta javob [x] · keys [—] (keyssiz, Qaror-0 21) · 90 daqiqa [x] ·
  bir ma'no — bir so'z [x] («test» faqat maketdagi «Test rejim»; «sinov» yo'q; «xabar» — Telegram xabari; «asosiy yo'l» / «asosiy harakat» — TAYANCHGA SAVOL 17) · web-trek [x] · agent va o'quvchi ishi ajratilgan [x] · o'smir xavfsizligi [x].
+ **13-Modulga xos (pul):** real pul yo'q [x] (3-tekshiruv — mashq to'lov; tepada chegara) · karta ma'lumoti hech qayerda [x] (maketlarda karta maydoni yo'q — KOD 4; promptlarda yo'q) · «mashq to'lov» Payme/Click ko'rinishini taqlid qilmaydi [x] (bu darsda Payme/Click yo'q; mashq sahifa — 3-darsdagi o'z ko'rinishi) ·
  «test rejim» belgisi har to'lov ekranida [x] (2-ekran 3-tekshiruv kadri, 1-amaliyot kutilgan natija: «Test rejim: pul yechilmaydi», «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.») · narx — «Mentorning taxmini» [x] (maketda 15 000 yonida yorliq) ·
  suhbat va tasdiqda bosim yo'q [—] (bu darsda suhbat va tasdiq yo'q) · oferta — shablon [—] (7-dars; to'lov taklifi ekranidagi «Pro shartlari» havolasi — o'zgarishsiz) · komissiya aytilmagan [x].

## O'lchov (scratchpad `md12/olchov.py`, 07.10.2026; yakuniy fayl bo'yicha)
Belgilar — ko'rinadigan matn: `**` va backtick olib tashlangan, ✔ va boshidagi bo'shliqsiz. `!!!` — chegaradan oshgan joy. Qavsdagi sonlar MD ichida skript bilan yozildi (farq — 0).
Hook javoblari «Aynan!» / «Qiziq fikr!» bilan sanaldi. QIzoh qatorlariga chegara yo'q (bitta qator). Mentor gaplari: interaktiv ekranlarda bitta gap, 1-ekran (reja) — ikki gap.

```
## Sarlavhalar (≤55)
   47  Mahsulotingiz to'liq ishlashini qanday bilasiz?
   47  Bugun mahsulotingizni tekshirasiz va tuzatasiz.
   45  Besh tekshiruvning qaysilarida ilova buzildi?
   52  Mahsulotingizni besh yo'l bo'yicha tekshirib yozing.
   39  Agentning qaysi taklifi bugun qilinadi?
   38  Eng muhim bir-ikki topilmani tuzating.
   54  Qayta tekshiring va topilmalarni XATOLAR.md ga yozing.
   25  O'zingizni sinab ko'ring.
   52  Tuzatish qilindi va qayta tekshiruvda takrorlanmadi.   [yakun]
   48  Besh yo'l tekshirildi — mahsulotingiz buzilmadi.   [yakun]
   50  XATOLAR.md tayyor — qolgan topilma ochiq yozilgan.   [yakun]
   52  Tuzatish qilindi — qayta tekshirish hali qilinmagan.   [yakun]
   45  Besh yo'l yozildi — tuzatish hali qilinmagan.   [yakun]
   51  Besh yo'l tekshirildi — XATOLAR.md hali yozilmagan.   [yakun]
   51  Tekshiruv hali tugamagan — qolgan yo'llar kutyapti.   [yakun]
   31  Besh tekshiruv hali yozilmagan.   [yakun]
## Xulosalar (≤110)
   98  Mentor misolida beshtadan ikkitasida ilova buzildi: ikkalasida bir necha darsning ishi uchrashgan.
  105  Bu darsda faqat topilmaga bog'langan o'zgarish qilinadi: yangi funksiya tekshirilmagan yangi yo'l ochadi.
## Hook javoblari (≤120)
  103  Aynan! Ilova ochilishi — faqat bitta ish. Ro'yxat, to'lov va taklif kodi har biri alohida tekshiriladi.
   97  Qiziq fikr! Ochilish ishladi — bu rost. Ro'yxat, to'lov va taklif kodi esa boshqa joyda ishlaydi.
   96  Qiziq fikr! Agentning «Tayyor!» degani — da'vo. Uni har ishni o'zingiz bosib ko'rib tekshirasiz.
## Hook variantlari
   39  Ilova ochildi — demak, hammasi ishlaydi
   43  Ro'yxatdan to'lovgacha o'zim bosib ko'raman
   43  Agent uch marta «Tayyor!» dedi — shu yetadi
## Xato izohlari / QXato / shart / to'g'ri izoh (≤60)
   46  Kutilgani va bo'lgani bir xilmi — yana o'qing.
   56  Avval nima kutishingizni yozing: ekranda nima ko'rinadi?
   42  Belgidan oldin nima ko'rganingizni yozing.
   54  Bu yo'l tekshirilmadi — uni «buzilmadi» deb bo'lmaydi.
   47  «Buzilmadi» — bor yo'l kutilganidek ishlaganda.
   47  «Buzildi» — bor yo'l kutilganidek ishlamaganda.
   47  Bo'sh karta bu yo'l haqida hech narsa aytmaydi.
   55  Taklifni chapdagi ikki topilma bilan yana solishtiring.
   50  Bugun faqat topilmaga bog'langan o'zgarish qoladi.
   58  Qulay bo'lishi mumkin — lekin u tekshirilmagan yangi yo'l.
   53  Tuzatish topilmaga bog'langan — u nega ketishi kerak?
   46  Topilma — tekshiruvda kutilgani bo'lmagan joy.
## QIzoh / nom qatorlari / bloklar «Hammasi bajarilgach»
   73  Asosiy yo'llarni buzish yozuvi bilan tekshirish — barqarorlik tekshiruvi.   [Nom qatori (]
   78  Tekshirish — faqat o'z mahsulotingizda va tekshiruv uchun ochilgan hisoblarda.   [QIzoh (xulos]
   78  Bugun ulgurmagan topilma ham XATOLAR.md ga «qoldi» deb, sababi bilan yoziladi.   [QIzoh]
   89  APK o'zi yangilanmaydi: eski faylni o'rnatganlar tuzatishni yangisini o'rnatgach ko'radi.   [Qator (`QIzo]
   61  Besh yo'l tekshirildi: topilganlar keyingi blokda tuzatiladi.   [blok]
   63  Besh yo'l tekshirildi: mahsulotingiz buzilmadi — bu ham natija.   [blok]
   56  Mahsulotingizda hali yo'q yo'llar tekshirilmadi: {N} ta.   [blok, kulrang]
   77  Tuzatish qilindi, yangi narsa qo'shilmadi — natijani keyingi blok ko'rsatadi.   [blok]
   42  Tuzatadigan topilma yo'q — kod o'zgarmadi.   [blok]
   66  Qayta tekshirildi: topilmalar XATOLAR.md da, yangi versiya chiqdi.   [blok]
   55  XATOLAR.md tayyor: qolgan topilma sababi bilan yozildi.   [blok]
   39  XATOLAR.md tayyor: besh yo'l buzilmadi.   [blok]
## Mentor gaplari (gap soni · belgi)
  1 gap · 123  Mentor misolida bu modulda ilovaga to'lov, Telegram xabari va taklif kodi qo'shildi — telefonda «Ilovani ochish» ni bosing.
  1 gap ·  42  Ilova ochildi — endi javobingizni tanlang.
  2 gap · 121  Yangi funksiya bugun qo'shilmaydi — faqat bor narsa sinchiklab ko'riladi. Har blokda Mentor namunasi o'ng tomonda turadi.
  1 gap ·  82  Mentor bugun besh yo'lni yozuv bilan qayta ko'rdi — avval taxminingizni belgilang.
  1 gap ·  76  Tekshiruvni ko'ring va kutilgani bilan bo'lganini solishtirib belgi qo'ying.
  1 gap ·  62  Besh belgi qo'yildi — natijani taxminingiz bilan solishtiring.
  1 gap · 116  Bu blokda kod yozilmaydi: agent faqat tekshiruvga yordam beradi, ko'rish va yozuv — sizda; «1 · Ochish»dan boshlang.
  1 gap ·  94  Mentor ikki topilmani agentga berdi, agent to'rt taklif yozdi — avval taxminingizni belgilang.
  1 gap ·  72  Taklifni chapdagi ikki topilma bilan solishtiring va ro'yxatini tanlang.
  1 gap ·  64  To'rt taklif joylandi — natijani taxminingiz bilan solishtiring.
  1 gap · 125  Yozuvni agentga so'zma-so'z berasiz: tuzatishni u qiladi, yangi narsa qo'shilmaganini siz ko'rasiz; «1 · Ochish»dan boshlang.
  1 gap · 106  Tuzatishni o'sha usul bilan qayta ko'rasiz, keyin hamma topilma faylga yoziladi; «1 · Ochish»dan boshlang.
## Ballik testlar — variant uzunliklari (±15% o'rtachadan)
  4 · 1-savol ✔ (jonli ball)  ← QTest · savol 11 so'z · variantlar [40, 34, 40, 37] · o'rtacha 37.8 · OK
      A   40  «Buzilmadi» — xato hech qayerda chiqmadi
      B   34  «Buzildi» — kutgan xabarim kelmadi
      C✔  40  «Mahsulotimda hali yo'q» — tekshirilmadi
      D   37  Hech narsa — kartani bo'sh qoldiraman
  7 · 2-savol ✔ (jonli ball)  ← QTest · savol 10 so'z · variantlar [39, 44, 41, 39] · o'rtacha 40.8 · OK
      A✔  39  Agentga tugmani olib tashlashni aytaman
      B   44  Tugmani qoldiraman — odamlarga qulay bo'ladi
      C   41  Tuzatishni ham, tugmani ham bekor qilaman
      D   39  Tugmani topilma qilib yozuvga qo'shaman
## Arena (12) — ✔ o'rni va variant uzunliklari
  ✔A · 10 so'z · [22, 23, 21, 25] · o'rtacha 22.8 · OK  1. Mentor besh yo'lni yozuv bilan qayta ko'rdi. Bu qanday ish?
  ✔B · 9 so'z · [32, 30, 30, 31] · o'rtacha 30.8 · OK  2. Mentor taklif kodini qo'shdi. Nega ro'yxatdan o'tish ham tekshirildi?
  ✔C · 5 so'z · [38, 37, 39, 40] · o'rtacha 38.5 · OK  3. Tekshiruv uchun qaysi hisobdan foydalanasiz?
  ✔D · 4 so'z · [30, 28, 28, 30] · o'rtacha 29.0 · OK  4. Nima kutishingizni qachon yozasiz?
  ✔A · 6 so'z · [34, 34, 35, 36] · o'rtacha 34.8 · OK  5. Nega barqarorlik kunida yangi funksiya qo'shilmaydi?
  ✔B · 7 so'z · [35, 39, 42, 35] · o'rtacha 37.8 · OK  6. Uch topilma bor, vaqt ikkitasiga yetdi. Uchinchisi-chi?
  ✔C · 10 so'z · [21, 22, 20, 22] · o'rtacha 21.2 · OK  7. Mentor misolida «Ikki marta yuborish»dan keyin Pro necha kunga yoqildi?
  ✔D · 4 so'z · [35, 33, 29, 30] · o'rtacha 31.8 · OK  8. «Tuzatish qilindi» nimani bildiradi?
  ✔A · 8 so'z · [37, 40, 36, 32] · o'rtacha 36.2 · OK  9. Mentor tuzatishi faqat backend/ da. APK'ni yangilash kerakmi?
  ✔B · 8 so'z · [39, 36, 32, 33] · o'rtacha 35.0 · OK  10. Mentor misolida brauzer ko'rinishi push'dan keyin o'zi yangilanadimi?
  ✔C · 10 so'z · [38, 36, 34, 38] · o'rtacha 36.5 · OK  11. Mentor misolida ikki telefon bir vaqtda «O'yinlar»ni ochganda nima bo'ldi?
  ✔D · 6 so'z · [26, 30, 28, 23] · o'rtacha 26.8 · OK  12. Darsdan keyin tekshiruv akkauntlari nima qilinadi?
  taqsimot: {'A': 3, 'B': 3, 'C': 3, 'D': 3} · tartib: A B C D A B C D A B C D

!!! jami: 0
```

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m11-11` «Mahsulotingiz hozir qayerda?» → **`m11-12` «Loyiha kuni: barqarorlashtirish»** (osti «asosiy yo'llarni tekshiramiz va tuzatamiz», 456-qator) → `m11-13` «Zaxira dars» (`comp` siz); reja sarlavhasi `sub` bilan bir ma'noda; yakundagi «Keyingi dars» — `00-NOMLAR.md` 13-qator.
- [x] Bitta misol-ip («Maydon Jamoa», hook → bloklar); metafora yo'q; bitta vizual — `YolSahna` (telefon + bitta karta: yozuv / chat / `XATOLAR.md`); o'quvchining o'z mahsuloti — uch blok. Keyssiz.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2, 5 (va 0, 1, 3, 6, 8 — bloklar o'ng tomoni) — matn-karta yo'q; bashoratlar tanlangach ixcham qator bo'lib qoladi; har harakatli ekranda faol element halqada, Mentor shu harakatni aytadi (bosqichga qarab).
- [x] Sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 — O'lchov bo'limi (0 ta oshish).
- [x] Atamalar tayanch 2 va oldingi darslar bilan bir xil (buzish yozuvi, «Tuzatish qilindi», «qayta tekshiruvda takrorlanmadi / yana buzildi», barqarorlik tekshiruvi, `XATOLAR.md`, to'lov taklifi ekrani, mashq to'lov, taklif kodi, Telegram xabari, eslatma);
      siz-forma; tugma ot-shaklda yoki natija nomi («Buzildi», «Buzilmadi», «Mahsulotimda hali yo'q», «Tuzatish qilindi», «Nusxalash», «Bajardim»); agent promptlari — T-002 istisnosi; agent pufaklari va Mentor yozuvi — olam matni (T-008). Ochiq: «tekshiruv akkaunti» (TAYANCHGA SAVOL 10), «asosiy yo'l» (17).
- [x] Testlar: variantlar bir shaklda, uzunligi ±15% (skript), ✔ yolg'iz eng uzun emas; kalit so'z / kod / tire faqat to'g'rida emas (1-savolda tire hammasida; 2-savolda tire faqat B da) · ✔: s4 C · s7 A · arena A·B·C·D ×3 · inkor-savol yo'q · ballik testlar ketma-ket emas (4, 7).
- [x] Final: loyiha kunida tartib-mashqi yo'q (172) — band tegishli emas.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «hech qachon», «darhol», «darrov», «albatta», «100%», «kafolat» — o'quvchi matnida 0; grep).
- [x] Ichki kodlar o'quvchi matnida yo'q (A1/A2/A3 — faqat MD izohlarida; o'quvchiga «1-amaliyot»; `m11-12`, kod raqami, «pilot» yo'q); modul raqami LMS bo'yicha («12-Modul 7-dars», «11-Modul»); tarixiy voqea yo'q · «KOD» (13) va «REPO» (4) ro'yxati to'liq.
- [x] Karta (`QURISH_KARTASI.md`) T · P · S ko'rildi: T-002 · T-008 · T-009 · T-010 · T-011 (barqarorlik tekshiruvi — besh tekshiruvdan keyin nom qatorida; sarlavhalarda yangi atama yo'q) · T-014/015 (TAYANCHGA SAVOL 10, 17) · T-016/017 (metafora yo'q) · T-024 · T-029 · T-034 · T-039 («mahsulotingiz» — o'quvchida bor) ·
      T-042 · T-043 («Mentor misolida», «bu darsda») · T-044 · T-045 («takrorlanmadi» — shu tekshiruv natijasi, hamma holat uchun isbot emas; agent sababi — uning so'zi) · T-047 · T-048 · T-049 (yakun — o'quvchi ishi) · T-052 · T-064 · T-066 · T-070 ·
      P-001/002/004 · P-007 · P-008 · P-010 · P-013 · P-014/015 · P-016 · P-025 (uyga vazifa yo'q) · P-026 (xato yo'li, ayb yo'q) · P-028 (buyruqlar rasmiy, tugma nomlari yo'q) · P-036 · P-046 (yakun va blok natijasi o'quvchi yozuvidan) · P-052 · P-055 · P-059 · P-062 · P-063 (`MENTOR_TEKSHIRUV`, `AGENT_TAKLIF`, `YOLLAR`) · P-064 · P-067 ·
      S-001 · S-002 · S-004 · S-006 (arena 9, 10) · S-008 · S-010 · S-015 (bashoratlar o'sish tartibida) · S-018 (brend keysi yo'q) · S-019 · S-020 · S-026 · S-040 · PM-018 (agentning ichki qarori da'vo qilinmaydi) · SABOQ 6, 9, 11, 12, 16, 17, 19–31, E 40–55.
- [ ] **Tayanch bilan to'liq moslik — ochiq:** 5-topilma asosiy seans qarori bilan yozildi, tayanch 1.12 va 3 hali eski matnda (07.10, yangilanishi kutilmoqda); TAYANCHGA SAVOL 1–5 (Mentor yozuvi, 5-tekshiruv usuli, sahna tafsilotlari, 4-topilma javobi, yangi versiya faqat Render) va 22 (tekshiruv o'yini) foydalanuvchi qarorini kutadi; ⛔ Shubhali 1–3 — «qur» darvozasi. Tasdiqlanmaguncha bu band belgilanmaydi.
