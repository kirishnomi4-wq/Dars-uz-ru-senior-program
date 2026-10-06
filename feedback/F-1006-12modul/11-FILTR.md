# 11-dars «Raqamlaringiz pitchni qanday o'zgartiradi?» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026, F-1006-365

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch, Qaror-0 19, 10 va 12-darslar, 11-Modul 16-dars) → qonun → tasdiqlangan qaror → auditoriya. Hukm: Qabul / Qisman / Rad + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-1850/` (33 fayl).

Audit bahosi 7/10 (PM fikri 9 · pitch pedagogikasi 9 · dalil modeli 6 · 10 → 11 continuity 8 · 12-darsga artefakt 8 · yakkama-yakka 5.5).
Hukm (30 band): **Qabul 18 · Qisman 3 · Rad 0 · Allaqachon / o'zgarishsiz 9**.

## Asosiy bandlar

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Ta'rif «dalil — son yoki yozuv», amalda esa har dalilda raqam majburiy | **Qabul** | Haq — ikki model birga turgan (MD ning o'zi TAYANCHGA SAVOL 7 da sezgan, lekin yopmagan). Ustiga xato ham bor edi: 6-ekran 11-Modul pitchidagi muammo dalilini taklif qiladi, u esa 11-Modulda «sanoq **yoki harakat belgisi**» — raqamsiz bo'lsa, dars uni o'zi taklif qilib, o'zi bloklardi. Yangi model: dalil — son yoki yozuv; sanaydigan manbadan (Database · sanoq sahifasi · Umami) — son, intervyu va sinov yozuvlaridan — son yoki yozuv. Kalit: `dalil: { son, yozuv, manba, qachon }`. 3-ekran xulosasi, 6-ekran maydoni va tekshiruvlari, kartochka, yakun, tayanch 1.11, 2, 8, 9.43 a; 12 MD ham. |
| 2 | «Sinov yozuvlari» manbasi — qabul, lekin raqam majburiy bo'lmasin | **Qabul** | Band 1 bilan: intervyu va sinov yozuvlarida raqam shart emas; kulrang eslatma «Sanagan bo'lsangiz — sonini ham yozing». Manba tayanch 1.11 ga qo'shildi. |
| 3 | «Ilovani odamlar ishlatyapti» — 38 va 19 bilan ham keng da'vo; o'lchangan gapga qayta yozilsin | **Qisman** | Gap qoladi: «dalili bor gap qoladi, dalil qo'shiladi» holati darsga kerak (hookning birinchi varianti). Lekin dalil endi nimani o'lchashini ochiq aytadi — ostida 10-darsdagi hisobot izohi: «asosiy harakat — hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan»; O'qituvchi eslatmasi: zal «ishlatish nima?» desa — javob shu qatorda. **Bundan kattaroq muammo topildi (pastda M1):** 3-da'voning qayta yozilgan gapi aynan shu 38 va 19 ni takrorlardi. |
| 4 | Muammo da'vosi — 5 intervyudan 4 tasi «hamma o'yinchi» haqida isbot emas | **Qisman** | Muammo gapi — 11-Modul pitchidan (o'sha modulda tasdiqlangan shakl), o'zgarmadi. Dalil yoniga 11-Modul 16-darsidagi chegara qo'yildi: «5 o'yinchi — kichik son: bu tanlov uchun dalil, isbot emas.» (2-ekran 1-karta, O'qituvchi eslatmasi, tayanch 1.11). |
| 5 | Yechim va jonli demodagi gaplar «da'vo emas» deb o'rgatilmasin | **Qabul** | O'quvchi matni: «Yechim — zal jonli demoda o'zi ko'radi, bugun unga dalil qo'yilmaydi». A-bo'lim va tayanch 9.43 c: ular ham tekshirsa bo'ladigan gap; bugungi mashqqa kirmaydi. |
| 6 | Jonli demo ham dalil turi | **Qabul** | Tayanch 1.11, 9.43 c va O'qituvchi eslatmasida shunday yozildi; bugungi mashq — zal o'zi ko'ra olmaydigan gaplar. |
| 7 | «Sana» maydonida «11-Modul 3–4-darslari» — sana emas | **Qabul** | Dalilning uchinchi narsasi endi **«qachon»** (kun yoki davr). Qaror-0 19 ning o'z so'zi ham «qachon sanalgan». 10-dars hisobotida «sana» qoladi — u yerda kalendar kun yoziladi; hisobotdan olingan dalilda «qachon» o'rnida shu sana turadi. 3-ekran (sarlavha, chip, `QIzoh`), 4-ekran testi, 6, 7-ekran, kartochka, recap, nishon tavsifi, fon so'zlari, kalit. Yon foyda: `lint:til` dagi 17 soxta ogohlantirish yo'qoldi (2 qoldi — MD ichki izohida). |
| 8 | «+ Yangi gap» o'zidan da'vo bo'lib belgilanadi | **Qabul** | Yangi gap oddiy gap bo'lib qo'shiladi; da'vo bo'lsa, o'quvchi boshqa gaplar kabi o'zi belgilaydi. |
| 9 | 1–6 chegarasi: belgilanmagan tekshirsa bo'ladigan gap pitchda qolsa, «har da'voda dalil bor» yolg'on | **Qabul** | 6 dan ortganda: «Oltita yetadi — qolganini birlashtiring yoki olib tashlang.» Yakuniy «Pitchim» kartasida belgilanmagan gaplar ham ko'rinadi, tepada: «Belgilanmagan gaplarni ko'zdan kechiring: tekshirsa bo'ladigani qolmadimi?»; «Ko'rib chiqdim» belgisisiz saqlanmaydi. Halol chegara («Shubhali» 13): dars qaysi gap da'vo ekanini o'zi aniqlay olmaydi — belgi rasmiy bosilishi mumkin. |
| 10, 11 | 8-ekran testida ikki himoyalanadigan javob: va'dani maqsad deb qayta yozish ham to'g'ri | **Qabul** | MD ning o'zi «Shubhali 6» da «auditor bahsli deyishi mumkin» deb yozgan — haq chiqdi. Yangi savol: «Pitchingizdan «Bir oyda 200 kishi bo'ladi» va'dasini olib tashladingiz. O'rniga nima aytasiz?» ✔ B «Keyingi qiladigan bitta ishingizni». Kalit o'rni (B) o'zgarmadi. |
| 12 | «Kelajak soni doim olib tashlanadi» deyilmasin | **Qabul** | 7-ekran Yordam va O'qituvchi eslatmasi, recap, «Endi siz bilasiz», tayanch 9.43 e: va'da olib tashlanadi **yoki** maqsad deb qayta yoziladi; Mentor olib tashlagani — uning tanlovi. |
| 13 | `bolaklar` va `savedAt` — qat'iy qabul | **Qabul** | Taklif edi — tayanch 8 ga kirdi. |
| 14 | `gap` asl holida, `yangiGap` alohida | Allaqachon | Saqlandi. |
| 15 | O'zgarmas shartlar: `qoldi` → dalil bor va h.k. | **Qabul** | A-12, KOD 9, tayanch 8: `qoldi` → `dalil` bor · `qayta-yozildi` → `yangiGap` va `dalil` bor · `olib-tashlandi` → shart emas; saqlashdan oldin tekshiriladi. |
| 16 | «Yangi gapda dalildagi son bo'lsin» tekshiruvi yuzaki | **Qabul** | Yumshoq eslatma bo'lib qoldi va shunday deb yozildi: son gapda borligi moslikni bildirmaydi. Moslik — Mentorning ikkinchi savoli: «Bu dalil aynan shu gapni ko'rsatadimi?» |
| 17 | 10-darsda «tuzatish» olgan son — faqat ogohlantirish yetmaydi | **Qabul** | Butun darsni emas, o'sha qatorni bloklash: 10-dars kalitiga `tuzatishQator` qo'shildi (10 MD, tayanch 8); 11-darsda shu qatorning tanlovi sariq va bosilmaydi, tuzatilgan son «O'zim yozaman» orqali kiritiladi. Eski saqlash uchun zaxira yo'l yozildi. |
| 18 | 10-darsdagi «O'sish bormi?» shu darsda qolgan | Allaqachon | 10-FILTR supurishida tuzatilgan («Oldingi son bormi?»). |
| 19 | Yakkama-yakka jonli sinxronlashga bog'lanmasin | **Qabul** | Asosiy yo'l — o'quvchi o'z ekranini ko'rsatadi; jonli Mentor varag'i — qo'shimcha, dars unga bog'liq emas. 6-ekrandagi ikki holatli qator bittaga tushdi. Mentor ro'yxati faqat saqlash signallaridan (matn uzatilmaydi). |
| 20 | 12 o'quvchi × 4 daqiqa = 48 daqiqa — sig'maydi | **Qabul** | Har o'quvchida Mentor uchta narsani ko'radi: eng muhim bitta da'vo · uning dalili · bitta dalilsiz gap qarori — ≈ 2–3 daqiqa (12 kishi ≈ 36 daqiqa). ⛔ Bu reja: «qur» pilotida taymer bilan. |
| 21 | Uch savol; qarorni o'quvchi qiladi | Allaqachon | Saqlandi. |
| 22 | «Sinfdoshlar alohida aytilganmi?» har da'voga mos emas | **Qabul** | Birinchi savol: «Bu son qayerdan va nimani sanaydi?»; sinfdoshlar — faqat ro'yxatdan o'tganlar soni bo'lsa. |
| 23 | Manba chiplari da'voga qarab filtrlansin | **Qisman** | Filtr qo'yilmadi (auditor ham «PM darsida qabul qilsa bo'ladi» deydi; so'z bo'yicha filtr erkin matnda noto'g'ri ishlaydi). Moslikni Mentorning ikkinchi savoli ko'radi — O'qituvchi eslatmasida ochiq yozildi. |
| 24–27 | Hook · 2-ekran · 3-ekran ketma-ketligi · 4-ekran testi | Allaqachon | Saqlandi; 3 va 4-ekranda faqat «sana» → «qachon». |
| 28 | Birinchi yakun sarlavhasi kuchli | **Qabul** | Sarlavha qoldi, lekin endi 7-ekrandagi ko'rik belgisiga bog'langan (band 9). |
| 29 | Uyga vazifa ② | Allaqachon | Saqlandi. |
| 30 | «Keyingi dars» qatoridan keyin yana nishonlar bor | O'zgarishsiz | Yakun tartibi — qolip standarti (hamma darsda: … Keyingi dars · Nishonlaringiz). |

## O'zim topganlar

| № | Topilma | Nima qilindi |
|---|---|---|
| M1 | **Mentor misolida bitta dalil ikki da'voda:** 2-da'vo dalili — 38 va 19; 3-da'voning qayta yozilgan gapi ham «38 kishidan 19 tasi …». Darsning o'z ogohlantirishi («Bu dalil boshqa da'voda ham bor») Mentor misolida ishga tushardi. Bu tayanch 1.11 dagi mening xatoim. | 3-da'vo endi **qaytganlar soni** bilan qayta yoziladi: «Birinchi uch kunda ilovani ochgan 46 qurilmadan 17 tasi keyingi ikki kunda yana ochdi.» (10-dars hisobotining 4-qatori; yangi son yo'q). «Yoqdi» ↔ «qaytib ochdi» — 12-darsdagi zal savoli «qaytib kelyaptimi?» bilan ham bir yo'nalish. Tayanch 1.11, 9.43 b; 2-ekran 3-karta, 7-ekran Yordam, kartochka, 12 MD izohi. |
| M2 | 6-ekran 11-Modul muammo dalilini taklif qilib, raqamsiz bo'lsa o'zi bloklardi | Band 1 bilan yopildi. |
| M3 | MD «10-dars MD si parallel yozilmoqda — o'qilmadi» deb turgan edi | 10 MD (10-FILTR dan keyingi shakl) bilan solishtirildi: `oldin`, `qaytgan` ikki soni, `manba` qiymatlari, `tuzatishQator`. |

## «Majburiy 8 fix» — holat

| № | Fix | Holat |
|---|---|---|
| 1 | «Son yoki yozuv» va majburiy son | ✅ band 1 |
| 2 | «Sana» → «qachon» | ✅ band 7 |
| 3 | «Ilovani odamlar ishlatyapti» | ◐ band 3 (gap qoldi, dalil nimani o'lchashini aytadi) + M1 |
| 4 | Jonli demodagi gaplar — mashqdan tashqari, «da'vo emas» emas | ✅ band 5, 6 |
| 5 | 1–6 chegarasi va belgilanmagan gaplar | ✅ band 9 |
| 6 | 8-ekran testi | ✅ band 10 |
| 7 | «Tuzatish» olgan son — bloklash | ✅ band 17 (o'sha qator) |
| 8 | Yakkama-yakka — 1–2 da'vo, pilot | ◐ band 20 (qisqardi; ⛔ pilot — «qur») |

## «TAYANCHGA SAVOL» bo'yicha auditor qarorlari (17 band)
1, 5, 6, 14, 15, 16 — QABUL. 2 — band 4. 3 — band 5. 4 — band 7. 7 — band 1. 8 — band 2. 9 — band 13. 10 — band 9. 11 — band 19. 12 — band 20. 13 — band 17. 17 — 9.23 shakli; tayanch 1.11 yangilandi (+ M1).

## Sinf-supurish (12 MD + tayanch, 06.10)

| Sinf | Qidirildi | Topildi → tuzatildi |
|---|---|---|
| Dalilning uchinchi narsasi «sana» | 12 MD + tayanch | 11 · 12 (A-bo'lim, dalil qatori shakli) · tayanch 1.11, 2, 8; 10-dars hisobotidagi «sana» — kalendar kun: o'zgarishsiz |
| `dalil: { son, manba, sana }` | 11, 12, tayanch 8 | uchalasi → `{ son, yozuv, manba, qachon }` |
| Bitta dalil ikki da'voda (Mentor misoli) | 11, 12, tayanch | 11 · tayanch 1.11 · 12 (izoh) |
| «Va'da doim olib tashlanadi» | 11, 12 | 11 (recap, yakun, Yordam); 12 — 12-dars Filtrida tekshiriladi |
| Oldingi darsda «tuzatish» olgan son keyin ishlatilishi | 10, 11, 12 | 10 (`tuzatishQator`) · 11; 12 — 12-dars Filtrida |
| Yangi element o'zidan «to'g'ri» holatga tushishi (+ Yangi gap) | 12 MD | faqat 11 |

`lint:til` — 12 MD va tayanch: 0 error (ogohlantirishlar 25 → 10); 11: 0 error, 2 warn (MD ichki izohidagi «sana»).

## Foydalanuvchiga
- Tayanch 1.11 dagi o'z qarorlarim o'zgardi (Qaror-0 ga tegmaydi): dalilning uchinchi narsasi — «qachon»; Mentorning 3-da'vosi qaytganlar soni bilan qayta yoziladi.
- Yangi ochiq savol yo'q. «Qur» ro'yxatiga: yakkama-yakka vaqtini taymer bilan o'lchash.
