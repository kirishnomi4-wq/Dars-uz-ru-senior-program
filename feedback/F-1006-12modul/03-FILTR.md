# 3-dars «Ekran o'zi yangilanishi uchun nimani yozasiz?» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026, F-1006-357

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (App.jsx, oldingi darslar, tayanch, 11-Modul tayanchi) → qonun → tasdiqlangan qaror → auditoriya. Hukm: Qabul / Qisman / Rad + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-1630/` (12 MD va tayanch).
Eslatma: auditor 03 MD ning 15:58 dan oldingi nusxasini o'qigan — 1 va 34-bandlar 02-FILTR sinf-supurishida allaqachon tuzatilgan edi.

Audit bahosi 7.5/10 (pedagogika 9 · PM talab yozish modeli 9 · texnik aniqlik 6.5 · 2 → 3 continuity 8 · 90 daqiqa 5.5).
Hukm (37 band): **Qabul 14 · Qisman 4 · Rad 2 · Allaqachon / o'zgarishsiz 17**.

## Asosiy bandlar

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Hodisa — tranzaksiya tugagandan keyin (prompt, Yordam, arena 1) | **Qabul** | Prompt va Yordam 15:58 da tuzatilgan («yozib tugatgandan keyin»). Endi arena 1 ham: ✔ «Database'dagi o'zgarish tugagach» · «Database'dagi o'zgarishdan oldin». |
| 2 | «Yozilgan talab — bajarilgan ish emas» saqlansin | Allaqachon | O'zgarishsiz. |
| 3 | Chekka holatlar tekshirilmaydi — 5-dars shu repo holatidan boshlanishi tayanchda muhrlansin | **Qabul** | Tayanch 9.35 (c): `03-done` → `04-done` = `05-start` da chekka holatlar tekshirilmagan, ikki muammo shu teglarda. A2 yashil xabari «chekka holatlar ishlaydi» demaydi — tekshirildi. |
| 4 | 4-ekran 2-vaziyat — «mumkin bo'lgan xato» deb berilsin | Allaqachon | Sahna tepasida «Vaziyat N/3 · shunday bo'lishi mumkin», O'qituvchi eslatmasi: «har telefonda har safar shunday bo'lmaydi». |
| 5 | 3-vaziyat: konvert «ilova fonda» bilan so'nishi — sabab da'vosi; faqat natija ko'rsatilsin | **Qabul** | Sahna: bosh ekran → 2-telefonda qo'shilish → 1-telefonga konvert chizilmaydi → qaytganda «8 / 10 · eski». KOD 7, TAYANCHGA SAVOL 3, Shubhali 1 yangilandi. |
| 6, 7 | «Chekka holat» atamasi tartibi; «Bu darsda» chegarasi | Allaqachon | O'zgarishsiz. |
| 8 | PRD ko'prigi — «bu kursda» | **Qisman** | Kartochka izohi: «Bu kursdagi bo'linish; PRD — 11-Modul 5-darsida». Mentor gapi «11-Modulda PRD yozgansiz — u …» o'quvchining o'z PRD siga tegishli — o'zgarmadi. |
| 9 | «Hodisada faqat nima o'zgargani» noaniq | **Qabul** | O'quvchi prompti: «hodisada faqat o'zgargan yozuvning `id` si va sababi bo'lsin». Mentor Yordami — `{ oyinId, sabab }` (avvaldan). |
| 10 | «Hamma ulangan ilova» — faqat Mentor qarori | Allaqachon | O'quvchi prompti o'z qatorlaridan; «hamma ulangan» faqat Mentor Yordamida (02 QIzoh «Mentorning sodda varianti»). |
| 11 | Ikki ekran bir hodisadan ikki `GET` | **Qabul** | O'quvchi prompti: «bitta hodisa ochiq ekranni bir marta yangilasin»; Mentor Yordami: «bitta hodisadan keyin `GET /oyinlar` bir marta — «O'yinlar» va «O'yin» shu javobdan o'qisin» (11-Modul 9.29). REPO 5 va tayanch 9.35 (d): 5-darsdagi «ikki marta» faqat qayta ulanishdan keyin ko'rinadi. |
| 12 | Tekshiruv agentga bog'liq — o'quvchining o'z yo'li asosiy bo'lsin | **Qisman** | **Web-trek:** asosiy yo'l endi o'quvchining o'zi — kompyuterdagi yashirin oynada 11-Moduldagi ikkinchi namuna akkaunt bilan (11-Modul 9.34, 9.88). **Mobil trek:** agent asosiy qoladi — 3-darsda mobil o'quvchida ikkinchi qurilma yo'q (iPhone sherik Expo Go'da ochmaydi, brauzer ko'rinishi 7-darsda); juftlik (Android) — muqobil, agent Render'ga yetolmasa ham. 8-ekran ✔ «Tekshiruv so'rovidan keyin …», kartochka, arena 8 trekka moslandi. |
| 13, 14 | Expo akkaunti berilmaydi; `id` bo'yicha o'chirish | Allaqachon | O'zgarishsiz. |
| 15 | Namuna akkaunt paroli qayerdan? | **Qabul** | Haq: 11-Modul tayanchida (9.88) faqat raqamlar bor, parol yo'q — agent to'qishi mumkin edi. Yangi qoida (tayanch 9.35 a): **tekshiruv akkauntini agent ro'yxatdan o'tish yo'li bilan o'zi ochadi** (namuna ism va raqam), parolni o'zi biladi; oxirida akkaunt va yozuvlar `id` bo'yicha o'chiriladi. 09 MD da shu yo'l avvaldan zaxira edi. |
| 16 | «Ulanmagan» — koddan tekshiruv deb belgilansin | Allaqachon | «Bu — agentning so'zi va kod qatori: telefonda bu holatni ko'rmadingiz.» |
| 17 | Uchish rejimi — haqiqiy telefonda sinalmaguncha muzlatilmasin | **Qabul** | «Qur» darvozasi (tayanch 9.34 i) 03 A2 ga ham: Shubhali 4 ⛔. A2 (2) matni 02 dagidek: «darhol o'zgarmasligi mumkin: uzilishni aniqlash vaqt oladi». |
| 18 | A2 tekshiruvi 1-chekka holatni tekshirmaydi | Allaqachon | A2 natijasi faqat holatlar va README; kichik qator «agent chekka holatlarni «bajardim» desa — hali uning so'zi». |
| 19 | A2 sarlavhasi blok ishini to'liq aytmaydi | **Qabul** | «Ulanish holatlari ekranda, talab README'da bo'lsin.» (51) · eyebrow «Amaliyot 2 · holatlar va README». |
| 20 | 3-dars `pm-m10d2-sxema` ga yozmasin | **Qabul** | `pm-m10d3-talab.hodisalar` — qatorlar nusxasi `{ id, kimNima, hodisa, kimOladi, ekranda }`; 2-dars kaliti o'zgarmaydi. Grep: `hodisalar` ni 4–12-darslar o'qimaydi — xavfsiz. Tayanch 8, 02 MD sinf 7 yangilandi. |
| 21 | `ulanmoqda` kaliti o'zgarmasin | Allaqachon | Tayanch 8 bilan bir. |
| 22 | `a1`/`a2` faqat dars ichida — 4–5-darslar uchun yetarlimi | **Qabul** (tekshirildi) | Grep: 4-dars faqat `buzilmasin`, 5-dars `chekka` va `buzilmasin` ni o'qiydi. Maydon qo'shilmaydi (auditor ham «avtomatik qo'shmang» degan). TAYANCHGA SAVOL 14 yopildi. |
| 23, 24 | «Nima buzilmasin» A2 da; A1 da tayyor qator | Allaqachon | O'zgarishsiz. |
| 25 | Hookdagi «Qiziq fikr!» olib tashlansin | **Rad** | T-028/T-067 (seans Filtr qoidasi: doim rad). A javobidagi «o'zi tanlaydi» esa o'zgardi (band 37). |
| 26 | C ham to'liq emas — «Aynan!» yumshatilsin | **Qisman** | «Aynan!» qoladi (T-067). Matn: «Hodisalar va uzilishdagi ekran — talabning ikki bo'limi. Yana bitta bo'lim bor, uni ham ochasiz.» (96) — to'liq emasligini aytadi, bo'lim nomini oldindan bermaydi (P-036). |
| 27, 28 | 2-ekran bashorati; 3-ekran D | Allaqachon | Bashorat matni band 37 bo'yicha qayta yozildi. |
| 29 | Yordamda yo'llar to'liq yozilsin | **Qabul** | `POST /oyinlar/:id/tasdiq` · `/chiqish` · `/navbat` — 11-Modul tayanchi 161–164 bilan solishtirildi. |
| 30 | Butun `GET /oyinlar` — qabul | Allaqachon | O'zgarishsiz. |
| 31 | «Ochiq ekranni yangilasin» noaniq | **Qabul** | O'quvchi prompti: «shu qatorning «ekranda nima o'zgaradi» qismidagi ma'lumotni Backend'dan qayta so'rasin». |
| 32 | 90 daqiqa; 2-dars ulanishi tugamagan o'quvchi | **Qisman** | 0-ekran O'qituvchi eslatmasi: 2-dars ulanishi tugamagan o'quvchi bugun o'shani tugatadi, bu darsning ikki amaliyoti uyga — yakun shuni aytadi. 90 daqiqa — «qur» pilotida taymer bilan (9.34 i). |
| 33, 34 | `checkout -f`; «sizda emas» | Allaqachon | Himoya gapi bor (01-FILTR 17); «sizda emas» 15:58 da olib tashlangan. |
| 35 | Uyga vazifa ③ — talab va kod farqi | **Qabul** | «… README'dagi «Chekka holatlar» bo'limiga qo'shing — bu talab: kod hali o'zgarmaydi.» |
| 36 | «Keyingi dars» qatori qonunga zid | **Rad** | Qonun aksini aytadi: P-023 va T-075 yakunda «Keyingi dars — «nom»» qatorini talab qiladi; T-038 faqat «keyingi darsda …» va'dasini taqiqlaydi. Qator nomni aytadi, va'da emas. Tartib — `QYakun` qolipi. |
| 37 | «Agent o'zi tanlaydi» — mutlaq | **Qabul** | Bitta ibora hamma joyda: «agentning tanloviga qoladi» (hook A, 2-ekran bashorati va natijasi, 4-ekran Mentori, yakun, takrorlash, kartochka, A-bo'lim). 3-ekran savoli: «Bu talab nimani aytmaydi?» (variantlar o'zgarmadi); nishon Gap Finder va `Q_LABELS` shunga moslandi. |

## «Majburiy 9 fix» — holat

| № | Fix | Holat |
|---|---|---|
| 1 | Tranzaksiyadan keyin hodisa | ✅ band 1 |
| 2 | `pm-m10d2-sxema` ga yozilmasin | ✅ band 20 |
| 3 | Tekshiruv agent tarmog'iga bog'liq bo'lmasin | ◐ band 12 — web-trek agentsiz; mobil trekda agent + juftlik; agent tarmog'i — «qur» pilotida |
| 4 | Namuna akkaunt paroli manbasi | ✅ band 15 (tayanch 9.35 a; 04, 05, 09 ham) |
| 5 | 4-ekran sahnalari — mumkin bo'lgan natija | ✅ band 5 (2-vaziyat — band 4, avvaldan) |
| 6 | «Qiziq fikr!» olib tashlash, C da «Aynan!» yumshatish | ✗ / ◐ — 25 Rad (qonun), 26 Qisman |
| 7 | A2 sarlavhasi | ✅ band 19 |
| 8 | Expo Go + uchish rejimi pilotda | ⛔ «qur» darvozasi (band 17) |
| 9 | 90 daqiqa pilotda | ⛔ «qur» darvozasi (band 32) |

## «TAYANCHGA SAVOL» bo'yicha auditor qarorlari (22 band)
1, 2, 4, 7, 8, 9, 11, 12, 13, 15, 16, 18, 20, 21, 22 — QABUL, o'zgarishsiz. 3 — band 4, 5. 5 — band 21. 6 — band 20 (RAD qabul qilindi). 10 — band 1. 14 — band 22. 17 — band 3. 19 — band 26.

## Sinf-supurish (12 MD + tayanch, 06.10 16:14)

| Sinf | Qidirildi | Topildi → tuzatildi |
|---|---|---|
| Agent tekshiruvi — parol manbasi yo'q («namuna o'yinchi nomidan») | 12 MD + tayanch | 03 (A-bo'lim 7, A1 4-bo'lak, kutilgan natija kartasi, O'qituvchi eslatmasi, ✎, kartochka, arena 8, REPO 5, Shubhali 3, sinf 14) · 04 (64, 185, 201, 275, 276, 278, 351, 518) · 05 (29, 50–52, 67, 73, 461, 466, 4-qadam xabari, 510–511, 743, 767) · 09 (176–177, 180, 191, 506) · tayanch 1.3 (74–75) + 9.35 |
| «agent o'zi tanlaydi» | 12 MD | faqat 03 → hammasi «agentning tanloviga qoladi» |
| Boshqa darsning kalitiga yozish | 12 MD + tayanch | faqat 03 (5-ekran, KOD 8) → tayanch 8 yangilandi; 02 MD sinf 7 izohi |
| Arena: «Database'ga yozilgandan keyin» | 12 MD | faqat 03 arena 1 |
| Uchish rejimi: «bir daqiqagacha cho'zilishi mumkin» (02-FILTR 10 dan qolgani) | 12 MD | 03 A2 (2) → 02 dagi gap |
| Hodisa mazmuni «nima o'zgargani» | 12 MD | faqat 03 prompti |

`lint:til` — 02, 04, 05: 0 topilma · 03: 0 error, 1 warn (agent promptidagi «och» — agentga buyruq, T-002 istisnosi) · 09: 0 error, 1 warn (avvaldan) · tayanch: 0 error, 3 warn (avvaldan).
