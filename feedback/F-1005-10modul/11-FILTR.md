# 11-dars «Besh daqiqada nimani ko'rsatasiz?» — tashqi audit (ChatGPT) Filtr bilan, 05.10.2026

Audit bahosi 7.5/10 (pedagogika 9 · pitch tuzilishi 9 · raqamlar 7 · continuity/texnik 6.5). Hukm: **Qabul 16 · Qisman 2 · Rad 0 · O'zgarishsiz 5**.
Zaxira: scratchpad `11-oldin-filtr.md`, `tayanch-oldin-11filtr.md`.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «11 band» — fayl o'zi bilan zid (TAYANCHGA SAVOL 1 eskirgan) | **Qabul** | Rost — tayanch 1 da 11 bor (05.10). TAYANCHGA SAVOL 1 yopildi; bitta manba: 6 → 11, maqsad 20 (A-6, `MAYDON_PITCH.BOSH`). |
| 2 | Raqamlar slaydi ikki o'lchovni bitta formaga tiqadi | **Qabul** | Eng muhim topilma. Raqamlar slaydi — **ikki blok**: «Bosh raqam» (oldin → hozir) va «A/B» (A va B) + bitta «Halol gap». A-1, A-6, 6-ekran (A/B bloki), 10-ekran (bosh raqam bloki), 11-ekran formasi va kirishi, yakun, saqlash (`raqamlar: { bosh, ab, halolGap }`), tayanch 8 va 9.21. |
| 3 | «Halol gap» — «qancha odamdan» tor va birligi noto'g'ri | **Qabul** | «Halol gap — raqam qanday sanalganini va undan qancha xulosa qilsa bo'lishini ochiq aytish.» — A-4, 6-ekran joriy qatori, 11-ekran maydoni va `QXato`, kartochka, recap 7, tayanch 2; arena 5 ✔ «Xulosaga brauzer kamligini» (26; ✔ o'rni A). |
| 4 | Database yo'q bo'lsa dashboard/Umami soni — boshqa o'lchov | **Qabul** | «Database'dan bosh raqamni ola olmasangiz — uni o'ylab topmang: sizda bor raqamni va u qayerdan olinganini yozing (dashboard va Umami boshqa narsani sanaydi).» |
| 5 | SQL soniga o'z tekshiruv bandlari kiradi | **Qabul** | 10-ekran `QIzoh`: «Bu SQL o'yin kunini emas, band yozilgan vaqtni sanaydi. Sonda o'z tekshiruv bandlaringiz ham bo'lishi mumkin.» (109); O'qituvchi eslatmasi — «11 ta odam band qildi» emas; Mentor 11 — kurs bosh raqami, o'quvchi SQL soni bilan aralashtirilmaydi. |
| 6 | Har slaydga 1 daqiqa — «haqiqat» emas | **Qabul** | Natija qatori «bu mashqda: taxminan 2 daqiqa», taymer bo'laklari «≈1 daqiqa», `QIzoh` «Bu mashq uchun boshlang'ich taqsimot … jami 5 daqiqa». TAYANCHGA SAVOL 2 yopildi. |
| 7 | Bitta ✗ tuzatilsa «pitch tuzatildi» — kuchli | **Qabul** | 13-ekran xulosasi «Pitchingizning eng zaif slaydi tuzatildi. Qolgan ✗ slaydlarni uyda tuzatasiz.»; yakun sarlavhasi «Pitch besh daqiqalik bo'ldi, eng zaif slayd tuzatildi.» (54); uyga vazifa ② — «qolgan ✗ slaydlarni». |
| 8 | Airbnb — universal qoida bo'lmasin | **Qabul** | 5-ekran to'g'ri izohi «Bizning pitch tartibimizda ham avval muammo keladi, keyin yechim.»; recap 5; 4-ekran O'qituvchi eslatmasi. |
| Hook | «Aynan!» Keyingi qadam slaydini yashiradi | **Qisman** | «Aynan!» — qoida (tayanch 7.7) qoladi; javobga «Yana bitta savol ham bor — keyingi ekranda.» (102). |
| 6-ekran | «Zal raqamga ishonadi» — binar | **Qabul** | Sarlavha «A/B raqami qachon tushunarli bo'ladi?»; xulosa «… raqam tushunarli bo'lishi uchun …» (99); kartochka. |
| 7-ekran | «Necha kishidan» — buyurtma ≠ kishi | **Qabul** | ✔ A «Nima sanalgani va o'tgan haftadagi soni» (39; C 43 — eng uzun emas); recap 7. |
| 8-ekran | Fidbek ta'rifi juda keng | **Qabul** | «Fidbek — pitchdagi aniq joy haqidagi fikr yoki taklif.» — xulosa (108), A-4, kartochka, tayanch 2 (tayanchdagi ta'rif bilan moslashtirildi). |
| 10-ekran | SQL o'yin kunini emas, yozilgan vaqtni sanaydi | **Qabul** | 5-band bilan. |
| 11-ekran | Forma — bosh raqam + A/B + halol gap | **Qabul** | 2-band bilan; A/B bo'lmasa — blok bo'sh qoladi, bosh raqamda solishtirish OKR «hozir». |
| 12-ekran | Taymerni sinf bo'ylab bir vaqtda | **Qabul** | O'qituvchi eslatmasi: «avval hamma A, keyin hamma B». |
| Saqlash | `raqamlar` sxemasi | **Qabul** | `{ bosh: { nima, oldin, hozir }, ab: { a, b }, halolGap }`; kalit tayanch 8 ga qo'shildi (TAYANCHGA SAVOL 6 yopildi). |
| Sarl. 6 | — | **Qabul** | 6-ekran bandida. |
| 9-ekran · SQL (`COUNT(*)`, `\dt`) · 5 daqiqadan keyin taymer to'xtamasligi · 8-ekran gaplari · boshqa sarlavhalar | — | **O'zgarishsiz** | Auditor tasdiqladi. |
| Airbnb «o'nga yaqin» | Urg'u bermaslik | **Qisman** | Bank so'zi qoladi (1/4 bosqichda bir marta); darsning o'qi — tartib. |

**Sinf-supurish:** «qancha odamdan» (halol gap) — faqat 11. «Necha kishidan sanalgani» — faqat 11 (Muammo slaydidagi «Necha kishidan nechtasi …» qoldi — suhbat odamlar bilan, to'g'ri). Dashboard/Umami bosh raqam o'rniga — faqat 11. Tekshiruv bandlari — 1-dars O'qituvchi eslatmasida allaqachon bor. TAYANCHGA SAVOL 8 (keyingi qadam) — 10-dars bilan bir xil, yopildi.
lint:til 11 — 19 ogohlantirish (zaxirada 20), tayanch — 12 (bir xil), yangi topilma 0.
