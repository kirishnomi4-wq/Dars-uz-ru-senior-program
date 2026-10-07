# 7-dars «Jonli prototip: qog'ozdan bosiladigan ekrangacha» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026

Audit bahosi 6.5/10 (pedagogika 9 · amaliy qiymat 9 · texnik aniqlik 6.5 · termin/continuity 6 · 90 daqiqaga sig'ishi 5). Hukm: **Qabul 11 · Qisman 4 · Rad 7 · O'zgarishsiz 14** (10-band 09:58 da qabuldan radga o'tdi — QOIDALAR T-028, T-067).
Tekshirilgan manbalar: MD o'zi (grep) · `GATE_M_JAVOB.md` (07-q0 A — Public) · tayanch 1.6, 2, 9.2 (to'rt namuna o'yin), 9.16 · 9, 11, 13, 16-dars MD lari («sinab ko'rish» ishlatilishi).
Zaxira: scratchpad `md07/` (07, 09, 11, 16 va tayanch).

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Prototip platformaga bog'liq emas — React + Vite» — noto'g'ri; 8-dars tanlovi sun'iy bo'lib qoladi | **Qabul** | O'quvchi matnida (A1 «Prompt» qadami ustida): «Prototip brauzerda quriladi; telefon ko'rinishi — kichik ekranda tekshirish uchun, final platforma hali tanlanmagan.» MD A-7: «vaqtincha brauzerda — final platforma tanlovini majburlamaydi»; tayanch 9.71. |
| 2 | «Prototip hech narsani saqlamaydi» — umumiy ta'rif emas | **Qisman** | Ta'rif («Bosiladigan, lekin hali haqiqiy ma'lumotsiz ekranlar prototip deyiladi.») qoladi — «hali» bosqichni aytadi. Umumiy da'volar olindi: «Bu prototip … ma'lumotni saqlamaydi» — 6-ekran xulosasi, 7-ekran to'g'ri izohi, yakun, kartochka. |
| 3 | «Jonli prototip» — kurs nomi | **Qabul** | «Animatsiyasi bor prototipni bu kursda jonli prototip deymiz.»; kartochka «Bu kursda jonli prototip nima?»; tayanch 2. |
| 4 | Wireframe ta'rifida «rangsiz» — mutlaq qoida emas | **Qabul** | Ta'rif: «… qayerda nima turadi.» (3-ekran, yakun, recap, kartochka, tayanch 2); «rang va shrift tanlanmaydi» — bugungi mashq qoidasi (3-ekran xulosasi «Bugungi wireframe …», 4-ekran A izohi). |
| 5 | Strelka — wireframe'ning umumiy qismi emas | **Qisman** | 3-ekran xulosasi «Bugungi wireframe joyni va o'tishni ko'rsatadi …» bilan doira yopildi; bo'lak qoladi (ekranlar orasidagi o'tish — bugungi chizmaning ishi). |
| 6 | Public repo — kanonik qaror emas | **Rad** | Kanonik: GATE M **07-q0 A — Public** (foydalanuvchi, 06.10); tayanch 9.16. Xavfsizlik uchun A1 1-qadamiga kulrang qator: «Repo ochiq — unga telefon raqami, manzil kabi shaxsiy ma'lumot yozmang.»; tayanch 9.73. |
| 7 | To'rt namuna o'yin — kanonik emas | **Rad** | Kanonik: tayanch 9.2 (06.10 tunda muzlatilgan; 7, 10, 11, 13-darslar bir). MD TAYANCHGA SAVOL 3 «yopildi» deb belgilandi. |
| 8 | 90 daqiqaga juda zich | **Qisman** | Animatsiyalar bitta talabda (agent bir yo'la yozadi) — ularni bo'lish vaqt tejamaydi. Zaxira yo'li o'quvchiga ochiq: yakun sarlavhasi holatga qarab (36-band), uyga vazifa 1 — ulgurmagan qadamlar. Real vaqt — qurishda pilot taymeri bilan o'lchanadi (MD A-bo'lim vaqt qatori). |
| 9 | 20 ekran — 11 va 12-ekranni birlashtirish | **Rad** | Tuzilma GATE M da tasdiqlangan; 11 — tushuncha, 12 — kod (PM-082/TEX qolip). Pilot o'lchovidan keyin qayta ko'riladi. |
| 10 | 0-ekranda noto'g'ri javobga «Qiziq fikr!» | **Rad** (09:58 da tuzatildi) | Avval qabul qilib olib tashlagan edim — **xato**: QOIDALAR T-028 («hookda xato tanlovga uyaltirmaydigan neytral javob («Qiziq fikr!»)») va T-067 («Aynan!» / «Qiziq fikr!») — kurs qonuni, maqtov emas. Qaytarildi; javob matnlari aniqroq: 1 — «… lekin O'yin ekrani umuman yo'q.» · 3 — «Bosish ishladi — lekin kartaga hech qanday ekran ulanmagan.» |
| 11 | Agentni ortiqcha ayblamaslik | **Qisman** | 2-variant javobi: «… — ekranlar tuzilishini agent o'zi tanladi.» («taxmin qildi» o'rniga); «bu misolda» qoladi. |
| 12 | 8-ekran natijalari — «mumkin» bilan | **Qabul** | Uchta `QXato` dan bittasida «mumkin» yo'q edi: «Ish aniq aytilmasa, agent bo'sh joyni o'zi to'ldirishi mumkin.» (62). |
| 13, 14 | Figma «odatda»; «keyin to'g'ridan-to'g'ri kodga o'tasiz» | **Qabul** | 5-ekran Mentori: «Ekranni Figma kabi dasturda ham chizish mumkin, bugun esa qog'oz va qalam yetadi — shu chizmadan prototip quramiz. …» |
| 15 | `pm-m9d7-wireframe` ga `suratFayli` | **Rad** | Fayl nomi qat'iy — `wireframe.jpg` (tayanch 9.16); brauzer kaliti fayl yo'lini bilmaydi. |
| 16–20, 22–26, 29, 30 | «Kamida 2 ekran» · React state · «Backend yo'q» · forma · 10-ekran · animatsiya xulosasi · son kodi · A2 talabi · Motion · GitHub UI so'zlari · Antigravity surat zaxirasi · README surati | O'zgarishsiz | Auditor tasdiqladi. |
| 21 | «sinab ko'ring», «Sinaldi» — o'z tekshiruvi uchun «tekshirish» | **Qabul** | 11-ekran: «telefonda tekshirib ko'ring», «Tekshirildi: 0 / 3», «Uch kalitni tekshiring». **Sinf-supurish:** 9-dars («Uch holatni tekshiring», O'qituvchi eslatmasi), 11-dars («Tekshirish» tugmasi, 6 joy), 16-dars Yordami — tuzatildi. Qoladi: «O'zingizni sinab ko'ring» — platformaning kartochka sarlavhasi; 13-dars «sinfdoshingiz bilan sinang» — haqiqiy sinov; «sinab ko'rishga kun belgilash» — harakat belgisi (real odam). Tayanch 9.73. |
| 27, 28 | `pm-m9d7-repo` { name, url } | **Rad** | Hech bir keyingi dars uni o'qimaydi; o'quvchi repo'si GitHub'da, Mentor misoli `maydon-jamoa`. Kerak bo'lganda — o'qiydigan dars bilan birga qo'shiladi. |
| 31 | 7-darsda «Maydon Jamoa — mobil ilova» | **Qabul** | O'quvchi matnida «mobil ilova» deb aytilmas edi (grep — faqat MD «Ip» qatori va 8-dars nomi); MD Ip qatori «mahsulot» ga o'zgardi; tayanch 9.71. |
| 32 | Telefon ramkasi — platforma tanlangandek | **Qabul** | 1 bilan: A1 qatori + O'qituvchi eslatmasi (1-ekran): «telefon ko'rinishi — prototipni kichik ekranda tekshirish uchun; final platforma hali tanlanmagan». |
| 33 | Reja teglari `wireframe`, `prototip` — atama tug'ilishidan oldin | **Rad** | Teglar — menyu ostidagi so'zlar («wireframe → talab → bosiladigan prototip», P-015, foydalanuvchi tasdiqlagan nomlar); o'quvchi ularni menyuda darsdan oldin ko'radi. Ta'rif — 3 va 6-ekranda, sarlavhalarda yo'q (T-011). Auditor ham menyuni istisno deb qabul qilgan. |
| 34 | Menyu osti | O'zgarishsiz | — |
| 35 | Final tartibida agent qurishi ko'rinmaydi | **Qabul** | `PROTOTIP_YOLI` 3-bo'lagi: «Agent qurgan ekranlarni qog'ozdagi bilan solishtirish» (4 joy — 1-ekran, 14-ekran, ip, recap). |
| 36 | Yakun — holatga qarab | **Qabul** | A2 bajarilgan — «Qog'ozdagi ekranlaringiz endi bosiladi va jonli.» · A1 bajarilgan, A2 yo'q — «Bosiladigan prototipingiz tayyor — animatsiya uyda.» (51) · A1 yo'q — «Prototip boshlandi — qolgan qadamlar uyda.» (42); yuqori yorliq ham shunga qarab. |
| TS 1–8 | Agent savollari | Qabul / yopildi | 3 — tayanch 9.2 · 6 — GATE M 07-q0 A · qolganlari — auditor ham qabul qilgan. |

Tekshiruv: `lint:til` 07, 09, 11, 16 — 0 error (07 — eski ikki ogohlantirish) · o'zaro tekshiruv — arena 3/3/3/3, «Keyingi dars» mos.
