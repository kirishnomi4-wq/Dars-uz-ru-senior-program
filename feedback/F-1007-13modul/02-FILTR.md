# 2-dars «Mahsulotingiz qanday pul topadi?» — tashqi audit (ChatGPT) Filtr bilan, 07.10.2026

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch, 11/12-Modul tayanchlari, rasmiy hujjat) → qonun (QOIDALAR, TAQIQLAR) → tasdiqlangan qaror (`GATE_M_JAVOB.md`) → auditoriya. Hukm: Qabul / Qisman / Rad / Allaqachon + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-02/` (hamma MD, tayanch, MANBA, GATE_M_JAVOB). Tuzatish skripti: scratchpad `f02/tuzat02.py` (73 juftlik, har biri faylda bir marta — skript tekshirgan). F-1007-460.
Eslatma: auditor 29-band (uyga vazifa ①) va boshqa joylarda F-1007-459 dan oldingi nusxani ko'rgan — «Kim bilan» allaqachon «ota-ona yoki sinfdosh» edi.

Audit bahosi 7.5/10 (pedagogika 9 · model tanlash mantig'i 8.5 · o'z mahsuloti 8.5 · atamalar 8 · SQL/o'lchov 6.5 · 90 daqiqa 6). Hukm: **Qabul 13 · Qisman 3 · Rad 3 · Allaqachon 11 qator (13 band: 23–25 bitta qatorda)**.
⚠️ **Tasdiqlangan matnga tegadigan Qabul (foydalanuvchiga alohida):** tayanch 1.0 «Sabab (Mentor)» — «… va odam chaqiradi» olib tashlandi (8-band) · tayanch 1.2 reklama sababi (5-band) · tayanch 8 `pm-m11d2-model` sxemasiga `soniAsos` (21-band). Qaror-0 matni o'zgarmadi.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Hookda «hozircha noma'lum / hech kim» yo'li yo'q — o'quvchini majburan tanlatadi | **Qabul** | MD ning o'z Shubhali 10 i. To'rtinchi variant «Hali bilmayman — kim to'lashi noma'lum» (38; boshqalari 35–38), javobi «Qiziq fikr! Hozircha tanga hech kimdan chiqmayapti. Kim to'lashini besh yo'lni solishtirib belgilaysiz.» (103; T-067: «Bugun … ko'ramiz» quyrug'isiz); sahnada tanga chizilmaydi, odamlar ustida «?». 1-dars `kimTolaydi: null` holati bilan bir yo'l. |
| 2 | Hookdagi «Qiziq fikr!» olib tashlansin | **Rad** | T-028, T-067 — kurs qonuni; tayanch 7 «tashqi auditda har safar rad»; 01-FILTR 11. Javob matnlari auditor taklif qilgan mazmunda allaqachon (har yo'l nima ekanini aytadi, hech birini rad etmaydi). |
| 3 | «Pullik obuna = hamma to'laydi» — universal ta'rifdek | **Qabul** | Haq: hayotda pullik obuna bepul qism bilan birga ham ishlatiladi (Pro — shuning misoli), kursdagi besh yo'l esa uni «hamma to'laydigan» variant deb ajratadi. O'quvchi matnida «bu darsdagi pullik obuna modeli» — recap, qisqa takrorlash 5, kartochka 3 (izohda «Pro ham pullik obuna, lekin faqat qo'shimcha uchun»), arena 9; A-4 va tayanch 2 ga qator. |
| 4 | «Asosiy ish hamma uchun bepul» — universal freemium qonuni qilinmasin | **Rad** | Bu freemium'ning odatdagi ta'rifi (asosiy qism bepul, qo'shimcha pullik) — kurs soddalashtirishi emas; tayanch 2 ta'rifi (ATAMA-q0 A tasdiqlagan). Auditor ham «mayli» degan. |
| 5 | Reklama rad sababi: «44 juda kam» — universal chegara; «o'smirlar ma'lumoti» reklamani ma'lumot sotish deb o'rgatadi | **Qabul** | Ikkinchi qism — haqiqiy xavf (reklama uchun ma'lumot berish shart emas, T-045). Qator: «44 foydalanuvchi — reklama beruvchi uchun hali kichik auditoriya.» (65; «Mentorning taxmini» yorlig'i ostida, «hali»). «O'smirlar ma'lumoti reklamaga ishlatilmaydi» — faqat O'qituvchi eslatmasida, Mentor qarori sifatida. Kartochka 4: «Mentor misolida hozir tanlanmadi: auditoriya hali kichik». Tayanch 1.2. |
| 6 | B2B sababi — kuchli PM fikri, saqlansin | Allaqachon | O'zgarishsiz. |
| 7 | Tranzaksiya: «yuridik shaxs va shartnoma kerak» — universal huquqiy da'vodek | **Qisman** | Faktga tayanadi: Payme kassasi faqat yuridik shaxs yoki YaTT uchun (tayanch 6, rasmiy, 07.10.2026) — «kerak bo'lishi mumkin» deb yumshatish rad (rasmiy fakt bor). Lekin haq: atama izohsiz edi va S-020 ni buzardi (arena 5 — ballik). Qator: «Boshqalar nomidan pul yig'ish: yuridik shaxs (ro'yxatdan o'tgan firma) va shartnoma kerak.» (90; «Mentorning taxmini» ostida — Mentor sababi); kartochka 10 izohi «Yuridik shaxs — davlatda ro'yxatdan o'tgan firma»; O'qituvchi eslatmasida rasmiy asos. «Maydon pulini bo'lishish» nomi sahna tegiga o'tdi («… · roadmap: uzoqroq») — arena 4, 5 shu nom bilan so'raydi. |
| 8 | «Odam chaqiradi» — Pro bunday qilmaydi | **Qabul** | Haq: «Doimiy o'yin» faqat o'yinni qayta e'lon qiladi. 2-ekran O'qituvchi eslatmasi; xulosa «Pro uning har haftalik e'lonini o'zi qiladi» (109; avval «ishini oladi» — noaniq). Sinf-supurish: **4-dars** 4-ekran varag'i «Qiymat · har haftalik e'lon va odam chaqirish — o'zi» → «… e'lon — o'zi»; **tayanch 1.0** «Sabab (Mentor)» va **1.4** «qiymat». |
| 9 | Muhr «mos emas» — modelni yomon deb ko'rsatadi; «hozir tanlanmadi» | **Qabul** | To'rt kartada muhr «hozir tanlanmadi» (kulrang), natija qatorlari, vizual ta'rifi, dars ipi, `yolKarta` holati `tanlanmadi`; O'qituvchi eslatmasi: «reklama va B2B keyinroq mumkin, tranzaksiya roadmap'da «uzoqroq»». 8-ekrandagi o'quvchi maydoni «Nega mos emas?» qoldi — u o'quvchining o'z mahsuloti haqidagi hukmi. |
| 10 | Telegram keysi yaxshi bog'langan | Allaqachon | O'zgarishsiz. |
| 11 | K2 3/3: Premium ×3 va «foydaga chiqdi» bir kadrda — sabab illyuziyasi | **Qabul** | MD ning o'z Shubhali 9 i — eslatma O'qituvchida qolgan edi. Ikki karta ostida o'quvchiga ko'rinadigan kulrang qator: «Ikkalasi bir yilda bo'lgan — biri ikkinchisining sababi ekani bu yerda aytilmagan.» (82). Bank so'zi o'zgarmadi (PM-016). |
| 12 | 8-ekran formasi kuchli | Allaqachon | O'zgarishsiz. |
| 13 | «Nima bepul» kartasida PRD funksiyalari dastlab «bepul» — freemium tomon og'diradi | **Qabul** | Haq — tanlov oldindan qiyshaymasin. Dastlab hech biri tanlanmagan; har funksiyaga «bepul» yoki «pullik» bosilmaguncha bloklaydi (`QXato` «Har funksiyaga «bepul» yoki «pullik»ni tanlang.» — 47). KOD 8. |
| 14 | Modelga zid juftliklar yumshoq emas, qattiq bloklansin (obuna + rol · reklama/B2B + hamma · freemium + bo'sh) | **Qisman** | Reklama/B2B + «hamma foydalanuvchi» va bepul asos + bo'sh bepul qism — ta'rifning o'ziga zid → **bloklaydi**. Pullik obuna + rol — **yumshoq qoladi**: to'lovchi foydalanuvchining o'zi bo'lmasligi mumkin (ota-ona farzandi uchun to'laydi — 1-dars 8-ekran eslatmasi ham shuni aytadi); qattiq blok haqiqiy holatni taqiqlardi. Xabar: «Bu modelda har foydalanuvchi uchun to'lanadi — shundaymi?» (57). |
| 15 | Bepul asos + bo'sh bepul qism — qattiq blok | **Qabul** | 14-band bilan. |
| 16 | Reklama/B2B uchun to'lovchi turi yordamchisi | Allaqachon | Model tugmalari ostida kulrang «reklama bergan kompaniya» · «xizmat olgan biznes» bor edi. |
| 17 | `rad` — kamida bitta | Allaqachon | O'zgarishsiz. |
| 18 | Sherik tekshiruvi — ikki savol, «yaxshi/yomon» yo'q | Allaqachon | O'zgarishsiz. |
| 19 | Neon soni — «to'lashi mumkin» ≠ «to'lashga tayyor» ochiq aytilsin | **Qabul** | Yashil qator «To'lashi mumkin bo'lganlar sanaldi: bu rolingizdagi hisoblar, to'lashga tayyorlar emas.» (87) · recap «To'lashi mumkin bo'lganlar — rolga mos hisoblar soni, to'lashga tayyorlar emas.» · kartochka 12 · A-4 ta'rifi. 9-dars va'da qilinmadi (T-038). |
| 20 | «Pro kerak bo'lishi mumkin bo'lgan tashkilotchilar» — kuchli | **Qabul** | O'qituvchi eslatmasi: «Pro to'lovchi roliga mos tashkilotchilar, to'lashga tayyorligi noma'lum (hech kim so'ralmagan)». |
| 21 | Taxmin yo'li «son to'qish»ga yaqin — asosi saqlansin | **Qabul** | MD ning o'z Shubhali 12 si. Taxmin tanlansa — majburiy maydon `Nimaga tayanib? Masalan: guruhda nechta tashkilotchi borligi` (≥ 8 belgi, bloklaydi; `QXato` 33); kalitga `soniAsos: string \| null` (faqat `'taxmin'` da). Tayanch 8, 9.37. 4-dars `soni` ni «Hammasi to'lasa: {soni} × {narx}» deb ishlatadi — rolga mos son ma'nosiga mos (grep); yangi maydonni o'qishi shart emas. |
| 22 | `soniManba` — qat'iy kerak | Allaqachon | O'zgarishsiz. |
| 23–25 | SQL, agentga faqat nom, Neon menyu yo'li O'qituvchi eslatmasida | Allaqachon | O'zgarishsiz. |
| 26 | 5-ekran savoli ikki qavatli | **Qabul** | MD ning o'z Shubhali 5 i. «Pro pullik bo'lsa ham, nega bu «pullik obuna» modeli emas?» (10 so'z); «pullik», «obuna» variantlarda yo'q (S-008); ✔ A va variantlar o'zgarmadi. |
| 27 | Yakuniy test «nima uchun to'laydi»ni ham so'rasin | **Rad** | Savol «Modelni tanlashdan **oldin** nimani bilishingiz kerak?» — boshlang'ich ikki savolni so'raydi; B yagona himoyalanadigan javob. «Nima uchun» qo'shilsa to'g'ri variant 48 belgi bo'lib, qolganlaridan yolg'iz uzun chiqadi (S-006). Ortiqcha qat'iylik 28-bandda tuzatildi. |
| 28 | «Model shu ikki savoldan chiqadi» — deterministik formula | **Qabul** | To'g'ri izohi «Avval kim to'lashi va nima bepul qolishi aniqlanadi.» (52) · A-2 «Model tanlash … boshlanadi» · qisqa takrorlash 11: «3 Keyin model tanlanadi — sababi mahsulotdan.» |
| 29 | Uyga vazifa ① — «tanish katta odam» | Allaqachon | F-1007-459 sinf-supurishida «ota-ona yoki sinfdosh» bo'lgan; «faqat katta odam» rad — 01-FILTR 28 sababi (model tushuntiriladi, pul so'ralmaydi; sinfdosh — xavfsiz ro'yxatda). |
| 30 | Uyga vazifa ② | Allaqachon | O'zgarishsiz. |
| 31 | 90 daqiqa — 105–120 | **Qisman** | Bu ham o'lchanmagan baho — ⛔ pilotda taymer (sinf 1). A-12 ga oldindan belgilangan qisqartirish: 9-ekran yakka rejimga, 10-ekran sanog'i uyga (Shubhali 1 da bor edi). |
| Sarl. | Sarlavhalar | Allaqachon | Auditor hammasini tasdiqladi. |
| TS | TAYANCHGA SAVOL 1–20 qarorlari | — | 1, 3, 4, 6, 10, 11, 12, 14, 16–20 — auditor qabul qildi; 2 — Qisman (14-band); 5, 8, 9 — Qabul (✅ yopildi); 7 — Qabul (3-band); 13 — Rad (2-band); 15 — Qabul (19-band). Holat qatorlari MD «TAYANCHGA SAVOL» da. |
| TS+ | Auditorning yangi savollari 21–24 | Javob berildi | 21 → kurs ichidagi variant, o'quvchi matnida «bu darsdagi» · 22 → maxfiylik qatori — Mentor qarori, faqat O'qituvchi eslatmasida · 23 → `soniAsos` saqlanadi · 24 → rolga mos hisoblar soni, to'lashga tayyorlik emas. |

## Sinf-supurish (12 MD + tayanch, grep va ko'z bilan)
- **«Odam chaqirish» Pro ishi sifatida** — 04 (4-ekran varag'i, 1 joy) → tuzatildi; tayanch 1.0, 1.4 → tuzatildi; qolgan MD larda 0.
- **«mos emas» muhri** — 03–12 da 0.
- **Oldindan tanlangan qiymat bilan forma (og'diruvchi sukut)** — 03–12 da «(dastlab —» 0.
- **Ta'rifga zid juftlik yumshoq ogohlantirish bilan o'tishi** — boshqa yumshoq tekshiruvlar (06, 07, 09, 11) — erkin matndagi so'z ro'yxati (sotish so'zlari, va'da so'zlari, xulosa so'zlari): ular adashishi mumkin, yumshoq bo'lgani to'g'ri — sinf emas.
- **«To'lashi mumkin» = «to'lashga tayyor» aralashishi** — 04 `soni` ni «Hammasi to'lasa: …» deb ishlatadi (faraz — mos); 06 «to'laydigan odam — to'lashi mumkin bo'lgan rol» (mos); boshqalarda 0.
- **«Yuridik shaxs» ballik matnda izohsiz** — faqat 02 da (arena 5) — endi 4-ekranda birinchi ko'rinishda qavsda; 03, 04, 07 da ballik matnda 0 (o'quvchi matnidagi «Real ishga tushirish — … yuridik shaxs yoki YaTT …» — Qaror-0 6 so'zma-so'z, 2-darsdan keyin — o'tilgan).
- **Keys sahnasida bir yildagi ikki son sabab-oqibatdek** — 11-dars K17 raqamsiz, ikki son yonma-yon yo'q — 0.
- «Qiziq fikr!» (Rad) va freemium ta'rifi (Rad) — supurilmadi.

## Tekshiruv
- `lint:til`: 02 — 0 error, 1 warn (K2 bankining ruscha iqtibosi — zaxirada ham) · 04 — TOZA · tayanch — 0 error (25 warn — o'zgarmagan).
- `qisqa.py` 02: 15 ekran, arena 3/3/3/3, sarlavha >55 yo'q.
- Qavsdagi uzunliklar Python `len` bilan qayta sanaldi: 2-ekran xulosasi birinchi variantda 115, tranzaksiya qatori 117 edi (≤110 dan oshgan) — qisqartirildi (109, 90); `QXato` 61 → 57; tranzaksiya qatoriga qo'lda yozgan 91 → 90. «O'lchov» bo'limiga F-1007-460 qatori.
- ✔ o'rinlari o'zgarmadi (3 — C · 5 — A · 7 — D · 11 — B; arena A·B·C·D ×3); 5-ekran savoli o'zgardi, variantlari — yo'q.
