# 5-dars «Ulanish uzilsa: buzamiz va tuzatamiz» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026, F-1006-359

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch, 4-dars MD, rasmiy hujjat) → qonun → tasdiqlangan qaror → auditoriya. Hukm: Qabul / Qisman / Rad + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-1700b/` (12 MD va tayanch).

Audit bahosi 7.5/10 (pedagogika 9.5 · nosozlik izlash fikri 9.5 · texnik aniqlik 7 · 4 → 5 continuity 6.5 · o'z mahsulotiga ko'chirish 8 · 90 daqiqa 4.5).
Hukm (45 band): **Qabul 18 · Qisman 4 · Rad 1 · Allaqachon / o'zgarishsiz 22**.

## Asosiy bandlar

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1, 20 | 5-dars `04-done` dagi uch muammoga qattiq bog'langan — 4-dars hali muzlatilmagan | **Qabul** | ⛔ «Qur» darvozasi (tayanch 9.37 a): `04-done` muhridan oldin haqiqiy telefonda uch urinish `05-start` bilan bajariladi — 04-FILTR dan keyingi talablar bilan (uzilganda son yuboriladi, bitta hodisa — bitta `GET`); natija boshqacha chiqsa, 5-dars sahnalari, `MENTOR_YOZUV` va testlar moslanadi. 04 MD REPO 5 ga ham yozildi. |
| 2 | Shubhali 6 eskirgan («4-dars MD hali yo'q») | **Qabul** | Qayta yozildi: 4-darsning yakuniy kodiga bog'liq, muhrdan oldin tekshiriladi. |
| 3 | Manual Deploy qarori — qabul | Allaqachon | TAYANCHGA SAVOL 1; Render interfeysi — pilotda (Shubhali 1). |
| 4 | «`backend/` ga push qilinganda ham Render shunday ishga tushiradi» — har doim emas | **Qabul** | «11-Moduldagi sozlamada `backend/` ichidagi o'zgarish push qilinsa, Render yangi versiyani odatda o'zi ishga tushiradi.» |
| 5 | Mentor yozuvidagi «fonga olish — buzilmadi» faqat haqiqiy natija bo'lsa | Allaqachon | Shubhali 2 da bor edi; endi `MENTOR_YOZUV` ostida ⛔ qator va tayanch 9.37 b: «o'quv muvozanati uchun natija tanlanmaydi». |
| 6 | «≈20 soniya» o'quvchiga mezon bo'lib qolmasin | **Qabul** | Yaxshiroq mezon topildi: uchish rejimi yoqiladi, **belgi «Ulanmoqda…» bo'lgach** o'zgarish qilinadi, keyin o'chiriladi. Bu ishonchliroq ham: belgi o'tmasdan oldingi o'zgarish TCP orqali keyin yetib kelishi mumkin edi (Shubhali 4). 20 soniya A-bo'lim, Mentor yozuvi (2 joy), 12-ekran, A1, ✎, O'qituvchi eslatmasi, o'lchov va tayanch 1.5 dan olindi. |
| 7 | Expo Go + uchish rejimi haqiqiy telefonda — muzlatishga to'siq | **Qabul** | «Qur» darvozasi (tayanch 9.34 i, 9.37 a). Muqobil yo'l hozir to'qilmaydi. |
| 8 | Hookdagi «Qiziq fikr!» | **Rad** | T-028/T-067 (seans Filtr qoidasi: doim rad). Javob matnlari auditor taklifiga yaqin — o'zgarishsiz. |
| 9, 10 | Buzish yozuvi modeli; «buzilmadi ham natija» | Allaqachon | O'zgarishsiz. |
| 11, 31 | «Tuzatildi» tabiiy tilda «hal bo'ldi» deb o'qiladi | **Qabul** | Tugma va belgi: **«Tuzatish qilindi»** — kodda o'zgartirish qilindi (ish fakti). 11-ekran (sarlavha qatori, belgi, nom qatori, xulosa), final 5-bo'lak, A2, yakun, kartochka, takrorlash, arena 7, 10-ekran A varianti, fon so'zlari, tayanch 1.5 va 7.2d. Kalit `tuzatildi` o'zgarmaydi (ichki). |
| 12 | «`git status` da fayl o'zgardi → Tuzatildi» zaif | **Qabul** | «Agent har muammo uchun qaysi faylni o'zgartirganini aytgan va u `git status` da ko'ringan bo'lsa → «Tuzatish qilindi»; to'g'riligini 4-qadam ko'rsatadi.» Promptga: «qaysi faylni o'zgartirganingni ayt». |
| 13 | Kod oynasi kuchli | Allaqachon | O'zgarishsiz. |
| 14 | Boshlang'ich kodda `connect` ichida `korsat()` yo'q — tayanchga | **Qabul** | Tayanch 9.37 c. |
| 15 | 2-savol D izohi «ulanish bir marta ochiladi» — noto'g'ri (qayta ulanishda yangi ulanish) | **Qabul** | Haq. «Muammo ulanishlar sonida emas — tinglovchi qayta qo'shilgan.» (60) |
| 16, 45 | «Ulanguncha urinaveradi» — faqat kutilmagan uzilishda | **Qabul** | Arena 2: «Tarmoq uzilsa, socket.io sukutda necha marta urinadi?»; A-bo'lim: «kutilmagan uzilishda (tarmoq, Backend'ning yangi versiyasi)». Tayanch 9.37 i. Arena 1, 9, 10 qayta ko'rildi — chegarasi bor. |
| 17, 18, 19 | `connect` hodisa emas; xonaga qaytish; kod qanday yozilishi talabda emas | Allaqachon | O'quvchi matnida — qoida («qayta ulanganda ochiq turgan o'yin xonasiga qayta kiradi»); ID qayerda saqlanishi — faqat REPO (Mentor kodi). |
| 21, 22 | Agent «Yubor» — asosiy yo'l bo'lmasin; 20 soniyalik oyna | **Qabul** (22) · **Qisman** (21) | Vaqt muammosi band 6 bilan yo'qoldi: uchish rejimi o'zgarish qilinguncha turadi, agent sekin javob bersa ham. Yo'l tartibi: sherik yoki web-trekda kompyuterdagi yashirin oyna (o'zi qaytaradi) → agent. Agent prompti qoldi — mobil o'quvchida ko'pincha boshqa qurilma yo'q. |
| 23 | Tekshiruv akkauntini o'chirish — «agent xohlagancha SQL» | **Qisman** | Tartib aniqlandi (tayanch 9.37 g): faqat agent aytgan `id` bo'yicha, `WHERE` bilan; 7-darsdan keyin «Hisobni o'chirish» yo'li bilan. Qayta ishlatiladigan akkaunt — rad: 7-dars sanog'iga tushib qoladi. |
| 24–27 | Har urinishdan oldin qayta ochish; bitta urinish — ikki muammo; bitta yozuvda bir nechta kuzatuv; «buzildi» ta'rifi | Allaqachon | O'zgarishsiz. |
| 28 | `pm-m10d3-talab.chekka` muzlamagan bo'lsa | Allaqachon | 03-FILTR faqat `hodisalar` ni o'zgartirdi; `chekka: [{ id, matn }]` tayanch 8 da o'zgarmagan. |
| 29 | `buzildi: null` — rasmiy `bool \| null` | **Qabul** | Tayanch 8 jadvali va 05 A-bo'lim: `buzildi: bool \| null`. |
| 30 | `qayta` uch qiymat | Allaqachon | O'zgarishsiz. |
| 32, 33 | O'quvchi promptida «Backend'ga tegma» va «Qayerda: `mobil/`» — o'z mahsulotida muammo Backend'da bo'lishi mumkin | **Qabul** | Haq. O'quvchi prompti: «Qayerda: buzish yozuvidagi muammoga tegishli fayllar — avval sababini top, keyin faqat kerakli joyni o'zgartir.» 3-qadamga: agent `backend/` ga tegsa — push va Render kutish. Mentor Yordamida «`mobil/` · Backend'ga tegma» qoldi (uch muammo ilovada). Tayanch 9.37 e. |
| 34, 35 | Sabab — agentning so'zi; ikkinchi aylanish — uyda | Allaqachon | O'zgarishsiz. |
| 36 | 90 daqiqa juda zich | **Qisman** | Vaqt qatori: «qur» pilotida taymer bilan o'lchanadi, o'lchanmaguncha da'vo emas. Ekranlar qisqartirilmadi; 3-usulni o'qituvchi namoyishiga aylantirish — pilot natijasiga qarab. |
| 37 | Uyga «uch usulni ertaga yana» — og'ir | **Qabul** | «Bugun natijasi kutganingizdan boshqacha chiqqan yoki qayta tekshiruvi tugamagan usulni ertaga yana bajaring.» |
| 38–43 | Uyga 3; yakun holatlari; `BUZISH.md`; `checkout -f`; xavfsizlik; «buzish» atamasi | Allaqachon | O'zgarishsiz. |
| 44 | Web-trek uchun «ilova» → «mahsulot» | **Qisman** | A1 sarlavhasi va eyebrow, A1 yashil qatori, yakun 2-holati — «mahsulotingiz». Mentor misoli va tushuncha ekranlaridagi «ilova» qoldi. |

## «Majburiy 10 fix» — holat

| № | Fix | Holat |
|---|---|---|
| 1 | `04-done` da uch muammo — pilot | ⛔ «qur» darvozasi (band 1) |
| 2 | Shubhali 6 | ✅ |
| 3 | Expo Go + uchish rejimi | ⛔ «qur» darvozasi (band 7) |
| 4 | 20 soniya mezon emas | ✅ band 6 — mezon «Ulanmoqda…» belgisi |
| 5 | 2-savol D izohi | ✅ band 15 |
| 6 | «Urinaveradi» — kutilmagan uzilish bilan | ✅ band 16 |
| 7 | Agent — zaxira | ◐ band 21 (sherik va web — oldin; agent qoldi) |
| 8 | O'quvchi promptida «Backend'ga tegma» yo'q | ✅ band 32 |
| 9 | «Tuzatish qilindi» | ✅ band 11 |
| 10 | 90 daqiqa — pilot | ⛔ «qur» darvozasi (band 36) |

## «TAYANCHGA SAVOL» bo'yicha auditor qarorlari (24 band)
1, 4, 5, 6, 9, 10, 13, 15, 16, 18, 19, 22, 23 — QABUL, o'zgarishsiz. 2 — band 1, 5 (pilot). 3 — «Qiziq fikr!» qismi rad (band 8). 7 — band 14. 8 — band 29. 11 — band 23. 12 — band 21. 14 — band 11. 17 — band 37. 20 — band 32. 21 — «qur» dan keyin. 24 — band 16.

## Sinf-supurish (12 MD + tayanch, 06.10)

| Sinf | Qidirildi | Topildi → tuzatildi |
|---|---|---|
| Qat'iy soniya — sinov mezoni sifatida («≈20 soniya») | 12 MD + tayanch | 05 (A-bo'lim 4 va 6, Mentor yozuvi va Yordam, 12-ekran, A1, ✎, TAYANCHGA SAVOL 12, Shubhali 4, sinf 5) · tayanch 1.5. 04 dagi agentning «30 soniyadan keyin yop» — agent uchun parametr, mezon emas — qoldi |
| «Tuzatildi» belgisi | 12 MD + tayanch | 05 · tayanch 1.5, 7.2d. 12-darsdagi «tuzatildi» — pitch bo'lagi (boshqa ma'no), 08 kaliti `tuzatildi` — ichki |
| O'quvchi promptida «Backend'ga tegma» | 12 MD | faqat 05 |
| «Ulanish bir marta ochiladi» | 12 MD | faqat 05 |
| Qayta ulanish — mutlaq gap | 12 MD | 05 (A-bo'lim, arena 2); 02 arena 10 — uchish rejimi bilan chegaralangan, qoldi |

`lint:til` — 05: 0 topilma · tayanch: 0 error, 3 warn (avvaldan).
