# 8-dars «Foydalanuvchilar qaysi qadamda to'xtab qolyapti?» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026, F-1006-362

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch, dastur, 9 va 10-darslar, 11-Modul tayanchi) → qonun → tasdiqlangan qaror → auditoriya. Hukm: Qabul / Qisman / Rad + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-1745/` (12 MD va tayanch).

Audit bahosi 7/10 (pedagogika 9 · PM fikri 9 · analitika aniqligi 6 · texnik xavfsizlik 7 · 7 → 8 continuity 7 · 90 daqiqa 5).
Hukm (23 band): **Qabul 14 · Qisman 5 · Rad 0 · Allaqachon / o'zgarishsiz 4** (4-bandning «Qiziq fikr!» qismi — rad, qonun).

## Asosiy bandlar

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «To'xtab qolish qadami» ta'rifi («eng kichik bo'lgan joy») bitta joy beradi, darsda esa ikkitasi olinadi | **Qabul** | Haq — tayanch 9.27 mening qarorim edi. Yangi ta'rif: «keyingi qadamga o'tganlar foizi past bo'lgan joy; **bu darsda foizi eng past ikki oraliq olinadi**» (dastur natijasi «2 ketish nuqtasi» shuni talab qiladi). A-bo'lim, 2-ekran joriy qatori, takrorlash, kartochka, tayanch 2, 1.8, 9.27, 9.40 a. |
| 2 | Asosiy fikr «odamlar qayerda to'xtaydi» — aslida qurilmalar sanaladi | **Qabul** | «Bu darsda qadamlar sanog'i qaysi oraliqda kamroq qurilma keyingi qadamga o'tganini ko'rsatadi, gipoteza esa nega shunday bo'lganini taxmin qiladi …». Dars nomi va 6-ekran sarlavhasi — savol sifatida qoldi. |
| 3 | Ikkalasini avtomatik «muammo» deyish — 100 → 99 → 98 da ham | **Qabul** | 2-ekran O'qituvchi eslatmasi: foizlar hammasi baland bo'lsa ham eng past ikkitasi olinadi, lekin bu «muammo» degani emas; birini o'quvchi tanlaydi. |
| 4 | Hookdagi A ham rost; «Qiziq fikr!» | **Qisman** | «Qiziq fikr!» — **rad** (T-028/T-067). Matnlar: A — «So'rash qayerda va nega to'xtaganini aytadi. Hamma qadamni bir xil solishtirish uchun esa sanoq kerak.» · B — «Sanoq qaysi oraliqda kamroq qurilma o'tganini bir qarashda ko'rsatadi. Nega — hali taxmin.» |
| 5 | `pm-m10d8-qadamlar.tur: 'real' \| 'mashq'` | **Qabul** | Kalitga qo'shildi (tayanch 8). 9-dars mashq sonlarini kulrang «mashq sonlari» bilan ko'rsatadi; 10-dars faqat qadam nomlarini o'qiydi. |
| 6 | «Faqat egaga» — aslida umumiy kalit, shaxs emas | **Qabul** | «Maxfiy kalit bilan yopiq»: kalitni bilgan har kim ochadi, chiqib ketsa — yangisi. A1 sarlavhasi: «Qadamlar soni bitta yopiq sahifada ko'rinsin.» A-bo'lim, kirish qatori, kartochka, tekshiruv (2), 9 va 10-darslar, tayanch 1.8, 2. |
| 7 | Kalit bilan ulangan ulanish boshqa xonalarga kirmasin | **Qabul** | Ikkala promptda: «faqat `sanoq` xonasiga — o'yin xonalari va foydalanuvchi harakatlariga emas». |
| 8 | `sanoq-ozgardi` — yozuv saqlangandan keyin | **Qabul** | «yangi yozuv saqlanib tugagach» / «yozib tugatgandan keyin» (tayanch 9.34 a bilan bir). |
| 9 | Sanoq sahifasi zanjiri — pilotsiz muzlatilmasin | **Qabul** | «Qur» darvozasi (tayanch 9.40 j). |
| 10 | Netflix sahnasida 5 belgidan 4 tasi — «aniq 80%» bo'lib qoladi | **Qabul** | Sahna: «ko'rish» belgilarining uzluksiz oqimi, ko'pchiligi tavsiyalardan, ozi qidiruvdan — sanaladigan son yo'q; son faqat Mentor gapida («qariyb»). |
| 11 | 3-ekran testi — yangi ta'rifda ikkinchi past oraliq ham himoyalanadi | **Qabul** | Savol: «Shu sanoqda qaysi oraliqda o'tganlar foizi eng past?»; variantlar sonlar bilan (B — «40 dan 30 tasi o'tgan», ✔ C — «30 dan 10 tasi o'tgan») — foizni o'quvchi hisoblaydi. Uzunliklar ±15% ichida. |
| 12 | Mehmonga javob — ruxsat etilgan maydonlar ro'yxati | **Qabul** | Mentor: tokensiz javobda faqat `id, kun, soat, maydon, kerak, qoshilgan` — boshqasi (keyin qo'shiladiganlari ham) yo'q. O'quvchi prompti: maydonlar ro'yxatini agent avval ko'rsatadi. Tayanch 9.40 f. |
| 13 | Mehmonga ism yo'q — tayanchga | Allaqachon | MD da bor edi; tayanch 9.40 f ga yozildi. |
| 14 | Ro'yxatdan o'tgach qayta kirish va o'yinni topish — qiyinchilik | **Qisman** | Qurilmaydi (bir darsda bitta o'zgarish). O'qituvchi eslatmasida ochiq: bugun faqat «ichini ro'yxatdan o'tishdan oldin ko'rsatish» tekshiriladi. |
| 15 | 8-ekranda 15 → 11 (73%) — 10-darsning natijasini oldindan ochadi | **Qabul** | Auditor TAYANCHGA SAVOL 10 ni rad etdi — qo'shildim. Yangi savol: «Tuzatish tekshirildi va odamlarga chiqdi. Gipoteza to'g'ri ekani bilindimi?» ✔ «Yo'q — buni keyingi kunlarning sonlari aytadi». Takrorlash va kartochka ham. **Topildi:** 10 MD bu sonlarni hozir umuman ko'rsatmaydi (tayanch 1.8 «10-darsda» deydi) — 10-dars Filtrida qo'shiladi. |
| 16 | 10-dars uchun «tuzatishdan keyin» sanog'i ma'lumotda yo'q | **Qisman** | `chiqarildiVaqt` (A2 «Yangi versiya chiqdi» da) va sanoq yo'liga `?dan=` (shu vaqtdan keyingi yozuvlar) qo'shildi. 10-darsda qanday ko'rsatilishi — 10-dars Filtrida. |
| 17–19 | Oldingisidan katta son — yumshoq ogohlantirish; «tuzatildi» va «gipoteza to'g'ri» alohida; `tuzatildi` nomi | Allaqachon | O'zgarishsiz. |
| 20 | `chiqarildi`; web-trekda Netlify usuli muzlatilsin | **Qisman** | 11-Modul web-trek saytini Netlify'ga qanday chiqarishni aytmagan — bitta usulni to'qimadim. Web-trek qatori: telefonda tuzatish ko'rinishini tekshirish; ko'rinmasa — qayta `netlify deploy --prod`. |
| 21 | «New Version» nishoni fayl navbatda bo'lsa ham | **Qabul** | Nishon — faqat «Yangi versiya chiqdi» tanlanganda. |
| 22 | «Live Counter» — faqat tekshiruvdan keyin | **Qabul** | A1 «Ulgurmasangiz»: «Davom etish» ochiladi, blok 4-bo'lim tekshiruvidan keyin bajarilgan sanaladi (tayanch 9.36 h). |
| 23 | 90 daqiqa — 105–125 | **Qisman** | «Qur» pilotida taymer bilan; yangi APK va havola «Ulgurmasangiz» yo'lida avvaldan uyga. |
| Sarlavha | A1: «faqat sizga» → «yopiq sahifada» | **Qabul** | Band 6. |

## «Majburiy 9 fix» — holat

| № | Fix | Holat |
|---|---|---|
| 1 | Ta'rif ikki oraliqqa mos | ✅ band 1 |
| 2 | Asosiy fikr — qurilmalar | ✅ band 2 |
| 3 | `tur` | ✅ band 5 |
| 4 | «Maxfiy kalit bilan yopiq» | ✅ band 6 |
| 5 | Kalitli ulanish — faqat `sanoq` xonasi | ✅ band 7 |
| 6 | 15 / 11 / 73% — 8-darsdan olib tashlash | ✅ band 15 |
| 7 | Mehmon javobi — ruxsat etilgan maydonlar | ✅ band 12 |
| 8 | Tuzatishdan keyingi sanoq | ◐ band 16 (ma'lumot tayyor; 10-dars — keyin) |
| 9 | Pilot va 90 daqiqa | ⛔ «qur» darvozasi |

## «TAYANCHGA SAVOL» bo'yicha auditor qarorlari (17 band)
2, 3, 5, 11, 14, 16, 17 — QABUL, o'zgarishsiz. 1 — band 1. 4 — band 20. 6 — band 6. 7 — CORS bir nechta manzil (prompt: «oldingi manzillar ham qolsin»). 8 — band 12, 13. 9 — band 5. 10 — band 15. 12 — band 14. 13 — band 16. 15 — band 10.

## Sinf-supurish (12 MD + tayanch, 06.10)

| Sinf | Qidirildi | Topildi → tuzatildi |
|---|---|---|
| Ta'rif «foizi eng kichik bo'lgan joy» | 12 MD + tayanch | 08 · tayanch 1.8, 2, 9.27 |
| «Faqat egaga» (sanoq sahifasi) | 12 MD + tayanch | 08 · 09 (29) · 10 (39, 153) · tayanch 1.8, 2 |
| «Sinfda so'rab sanash» (07-FILTR 23 sinfidan qolgani) | 12 MD + tayanch | 08 · 10 (38, 339, 660) · tayanch 1.7 |
| `pm-m10d8-qadamlar` mashq sonlari | 9, 10-darslar | 09 (307) — «mashq sonlari» yorlig'i; 10 faqat nomlarni o'qiydi |
| Kelajak sonlari oldindan ochilishi | 12 MD | faqat 08 |

`lint:til` — 08: 0 error, 2 warn (avvaldan) · 09, 10: 0 error, 1 warn (avvaldan) · tayanch: 0 error, 3 warn (avvaldan).
