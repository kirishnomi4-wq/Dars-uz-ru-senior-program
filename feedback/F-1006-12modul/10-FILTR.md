# 10-dars «50 foydalanuvchiga yetdingizmi?» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026, F-1006-364

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch, dastur, 7, 8, 9, 11, 12-darslar) → qonun → tasdiqlangan qaror (Qaror-0) → auditoriya. Hukm: Qabul / Qisman / Rad + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-1840/` (32 fayl).

Audit bahosi 7/10 (PM mantiqi 9 · hisobot halolligi 8.5 · analitika va SQL 6.5 · 7 → 10 continuity 7 · 11–12-darsga artefakt 6.5 · 90 daqiqa 6).
Hukm (15 band): **Qabul 10 · Qisman 2 · Rad 1 · Allaqachon 2**.

## Asosiy bandlar

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Eng kam bo'g'in» — birligi har xil sonlarni solishtirishga undaydi, dars esa buni taqiqlaydi | **Qabul** | Haq: dars o'z qoidasiga zid ibora ishlatgan (asosiy fikr, 12-ekran ✔ va izohlari, arena 10, uyga vazifa). «Eng kam bo'g'in» hamma joydan olindi: «bitta bo'g'in tanlanib, unga bitta ish yoziladi». Zaxira rejaning birinchi qatori «qaysi bo'g'inda odam kam» qoldi (Qaror-0 15 so'zi), lekin tanlov endi **dalil bilan**: 11-ekranda «Qaysi son yoki fakt buni ko'rsatadi?» majburiy va kalitga yoziladi (`zaxira.dalil`). 8 va 11-ekranda o'quvchi ko'radigan qator: «Bo'g'inlarning birligi har xil: sonlari solishtirilmaydi — har birining ichiga qaraladi.» O'qituvchi eslatmasi: Mentor kanalni «2 — eng kichik son» uchun emas, post ikki joyga yetgani uchun tanladi. |
| 2 | «O'sish bormi?» — «yo'q» javobi tuzatish bo'lmasa, savol noto'g'ri nomlangan | **Qabul** | Uchinchi savol — **«Oldingi son bormi?»** (Nimaga qarang: son yonida oldingi son va sanasi turibdimi — solishtirsa bo'ladimi?). O'sish — tekshiruv savoli emas, zaxira reja sababi. Birinchi marta sanalgan qatorda — «birinchi o'lchov» (Mentor hisobotida 3 va 4-qator; o'quvchida belgi). 4, 11-ekran, kartochka, recap, «Endi siz bilasiz», arena 6, tayanch 1.10 va 9.42 a, 11 MD A-bo'limi. Bu tayanchdagi o'z qarorim edi (MD ning o'zi TAYANCHGA SAVOL 4 da shubha qilgan). |
| 3 | `qaytgan` faqat foizni saqlaydi — 46 / 17 va davr yo'qoladi | **Qabul** | `qaytgan: { birinchi, keyingi, foiz, davr, manba, sana }` (tayanch 8, 9.42 c). 11 MD dagi dalil tanlovi ham ikki son va davr bilan chiqadi. `royxat.oldin`, `asosiy.oldin` ham tayanch 8 ga kirdi (KOD da bor edi, tayanchda yo'q edi). Qadamlar va lending sonlari — dars ichida qoldi: 11 va 12-darslar ularni o'qimaydi (grep). |
| 4 | SQL qilinmasa ham `royxat.manba = 'Database'` yoziladi | **Qabul** | 9-ekran manbani faqat «Bajardim»da yozadi; «Vaqt tugasa» yo'lida son 10-ekranda sanoq sahifasidan yoziladi va manbani o'quvchi tanlaydi. 8-dars MD sidan tekshirdim: sanoq sahifasidagi «ro'yxatdan o'tgan» ham `namuna = false` bilan sanaladi — halol manba. |
| 5 | Qaytganlar foizi SQL i — kesishma | **Qabul** | Agentga prompt: «faqat shu qurilmalar ichidan … 2-davrda birinchi marta ochgan qurilmalar kirmasin»; kartada kulrang qator; tekshiruv — ikkinchi son birinchisidan katta emas. (9-FILTR dan qarz, tayanch 9.41 i.) |
| 6 | 9-darsdagi sinf tekshiruvi `eslatmadan-ochdi` ga aralashadi | **Qabul** | 9-darsda tekshiruv yozuvlari endi `id` bo'yicha o'chiriladi (09-FILTR 6). 10-darsda: Mentor misolidagi 9 — tekshiruvsiz (A-bo'limda); o'quvchi kartasida kulrang qator — o'chirmagan bo'lsa «o'z qurilmam ham bor» deb yozadi. Qo'shimcha: «eslatmadan ochdi» endi qadamlar ro'yxatida emas, alohida yozuv («qadam emas: eslatma bosilib ilova ochilgan qurilmalar») — u foydalanuvchi yo'lining qadami emas edi. |
| 7 | Asosiy harakat — hozirgi holat; boshqa joyda «bir marta qilgan»ga qaytmasin | **Qabul** | Ta'rif to'g'ri edi, lekin supurishda bitta qoldiq topildi: 7-ekran B xato izohi «Bir marta qo'shilgan bo'lishi mumkin — keyin-chi?» → «Bu son hozirgi holatni aytadi — ikki davrni solishtiradimi?» |
| 8 | «Ro'yxatdan o'tganlar qo'l ko'tarsin» — bosim | **Qabul** | O'qituvchi eslatmasidan olindi: sinfdosh soni ixtiyoriy, 7-darsdagi son qoladi, ommaviy so'rov yo'q (tayanch 9.39 e bilan zid edi). |
| 9 | «Bo'g'in» izohi sodda emas; «yo'l bo'lagi» tabiiyroq | **Qisman** | Izoh: «Bu darsda bo'g'in — odam postdan asosiy harakatgacha o'tadigan yo'lning alohida joyi.» Auditor matni («foydalanuvchi yo'lidagi alohida joy») olinmadi — «foydalanuvchi yo'li» modulda qadamlarning ta'rifi (tayanch 2), ikki so'z aralashib ketardi. Atamani almashtirish — yo'q (tayanch so'zi, 11-dars ham ishlatadi). |
| 10 | 90 daqiqa — faqat oldingi artefaktlar to'liq bo'lsa | **Qisman** | ⛔ «qur» darvozasi: 9 → 10 → 11-ekranlar taymer bilan (tayanch 9.42). 11-ekranga majburiy dalil qatori qo'shildi — vaqtni oshirishi mumkin, ochiq yozildi. |
| 11 | Hookdagi «Qiziq fikr!» ketsin | **Rad** | Qonun (T-028, T-067). Taklif qilingan izohlar mazmunan bor («nechta ekani bilinmaydi», «ro'yxatdan o'tganmi — bilinmaydi»). |
| 12 | Duolingo «qo'rquv»i o'quvchi mahsulotiga ko'chmasin — o'quvchi ko'radigan qatorda ham | Allaqachon | 6-ekran 3/3 kulrang qatori: «Sizning eslatmangiz — o'tgan darsdagi qoida bilan: foyda aytadi, qo'rqitmaydi.» |
| 13 | 50 ga yetganlarga uyga vazifa baribir majburiy bo'lib qolgan | **Qabul** | ① — 50 ga yetgan va zaxira yozmaganlarga ixtiyoriy: «xohlasangiz, hisobotdan yaxshilamoqchi bo'lgan bitta bo'g'inni tanlab, unga bitta ish qiling». |
| 14 | «Havolani ulashish» — nima ulashiladi, qanday | **Qabul** | Tayanch 9.42 e: lending manzili `?kanal=ilova` belgisi bilan (6-dars mexanizmi; natija Umami'da kanal bo'yicha ko'rinadi — gipoteza shu bilan tekshiriladi). Ulashish usuli to'qilmadi — «qur» da rasmiy hujjatdan. O'quvchi uyga vazifasida: nima o'zgarishi va qayerga olib borishini talabda o'zi yozadi. |
| 15 | Holatga qarab yakun | Allaqachon | Saqlandi. |
| Sarlavhalar | Reja ekranida «metrika hisoboti», «zaxira reja» ta'rifdan oldin | O'zgarishsiz | App.jsx osti (so'zma-so'z), kulrang yorliq — auditor ham qabul qiladi. |

## O'zim topganlar va oldingi Filtrlardan qarzlar

| № | Topilma | Nima qilindi |
|---|---|---|
| M1 | **08-FILTR 15 dan qarz:** tuzatishdan keyingi Mentor sonlari (15 · 11 · 73%) 10 MD da umuman yo'q edi | 8-ekran, «O'rnatish va ro'yxat» bo'g'ini kartasiga ikkinchi qator: «8-darsdagi tuzatishdan keyin birinchi marta ochgan qurilmalar — 15, ulardan ro'yxatdan o'tgani — 11 (73%; oldin 59%)» + «15 ta qurilma — kam: farq bor, lekin bu isbot emas». Arifmetikani tekshirdim: 61 − 46 = 15, 38 − 27 = 11 — tayanch sonlari bilan mos. O'qituvchi eslatmasi: shu sabab Mentor bu bo'g'inga yana vaqt berib, kanalni tanlaydi. |
| M2 | **8-darsdagi sanoq `?dan=` bu sonni bermaydi** — u «shu vaqtdan keyingi yozuvlar»ni sanaydi, qaytgan eski qurilmalar ham kiradi (9-darsga ko'ra 46 dan 17 tasi qaytgan) | 10-dars `?dan=` dan foydalanmaydi: `chiqarildiVaqt` bo'yicha «birinchi `ochdi` shu vaqtdan keyin» sharti bilan agent `SELECT` yozadi (11-ekran Yordami). Tayanch 9.42 g, 8 MD izohi; `?dan=` ning keragi «qur» da qayta ko'riladi. |
| M3 | 10 MD «Shubhali joylar»: «sanoq sahifasi namunasiz sanaydimi — 8-dars MD hali yo'q» | 8 MD dan tekshirildi — sanaydi; band yopildi. |
| M4 | 9-darsdan qolgan havola almashtirish (09-FILTR 38) vaqtga kirmagan edi | 0-ekran O'qituvchi eslatmasi: 0–1-mashqlar paytida, sinf kutmaydi. |

## «Majburiy 8 fix» — holat

| № | Fix | Holat |
|---|---|---|
| 1 | «Eng kam bo'g'in»ni qayta nomlash | ✅ band 1 |
| 2 | «O'sish bormi?» → solishtirish savoli | ✅ band 2 |
| 3 | Qaytganlar: 46 / 17 va davr kalitda | ✅ band 3 |
| 4 | SQL qilinmaganda haqiqiy manba | ✅ band 4 |
| 5 | Qaytganlar SQL i — kesishma | ✅ band 5 |
| 6 | Sinf tekshiruvi yozuvlari | ✅ band 6 (9-darsda o'chiriladi) |
| 7 | 50 ga yetganlarga uyga vazifa | ✅ band 13 |
| 8 | 9–11-ekranlar pilot | ⛔ «qur» darvozasi |

## «TAYANCHGA SAVOL» bo'yicha auditor qarorlari (18 band)
1, 2, 3, 5, 6, 7, 9, 11, 13, 14, 15, 16 — QABUL (5 — kun-ma-kun son to'qilmaydi; 13 — vaqt ustuni bo'lmasa kunlarga bo'linmaydi; 16 — nimani sanashni o'quvchi aytadi). 4 — band 2. 8 — band 3. 10 — band 9. 12 — band 5. 17 — bitta manba, 06-FILTR dan keyingi matn (tayanch 9.42 f). 18 — Mentor tegini ko'rish «majburiy emas» deb yozildi.

## Sinf-supurish (12 MD + tayanch, 06.10)

| Sinf | Qidirildi | Topildi → tuzatildi |
|---|---|---|
| «O'sish bormi?» | 12 MD + tayanch | 10 · 11 (A-bo'lim) · tayanch 1.10 |
| «Eng kam bo'g'in» / «kam bo'g'in» | 12 MD + tayanch | 10 · tayanch 1.10 («tanlangan bo'g'in — kanal») · 11, 12 — yo'q (01 dagi «eng kam natija» — boshqa ma'no) |
| Foiz kalitda yolg'iz | tayanch 8, 11, 12 | `qaytgan` — 10, tayanch 8, 11 (dalil tanlovi); boshqa kalitlarda foiz yo'q |
| Manba bajarilmagan qadam nomidan | 12 MD | faqat 10 (9-ekran) |
| «Qo'l ko'tarsin» bilan son yig'ish | 12 MD | 10 tuzatildi · 03, 07, 08 — «kim bajardi?» so'rovi (son emas, sinf holati): o'zgarishsiz · 12 — zal bahosi: o'zgarishsiz |
| Asosiy harakat «bir marta» | 12 MD | 10 (7-ekran B izohi) |
| `eslatmadan-ochdi` qadam sifatida | 12 MD | 10 (hisobot pastki qatori, KOD) · 11, 12 — tilga olinmaydi |

`lint:til` — 10: 0 error, 1 warn (bank iqtibosi, avvaldan) · qolganlari pastda.

## Foydalanuvchiga
- Tayanch 1.10 dagi o'z qarorim o'zgardi: tekshiruvning uchinchi savoli endi **«Oldingi son bormi?»** («O'sish bormi?» edi). Qaror-0 ga tegmaydi.
- Yangi ochiq savol yo'q. «Qur» ro'yxatiga qo'shildi: Mentor Database'ida qaytganlar foizi va tuzatishdan keyingi sonlarni SQL bilan qayta sanash; `?dan=` kerakmi.
