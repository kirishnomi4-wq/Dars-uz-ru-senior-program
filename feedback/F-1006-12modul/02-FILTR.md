# 2-dars «WebSocket: ekran o'zi yangilanadigan ulanish» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026, F-1006-356

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (App.jsx, oldingi darslar, tayanch, rasmiy hujjat) → qonun → tasdiqlangan qaror → auditoriya. Hukm: Qabul / Qisman / Rad + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-1600/` (01–12 MD va tayanch).

Audit bahosi 7/10 (pedagogika 9 · WebSocket/socket.io tushuntirishi 6 · texnik aniqlik 6.5 · 11 → 12 continuity 8.5 · o'z mahsulotiga ko'chirish 8 · 90 daqiqa 4.5).
Hukm (40 band): **Qabul 19 · Qisman 5 · Rad 1 · Allaqachon / o'zgarishsiz 15** (dars nomini o'zgartirish taklifi — band 1 ichida, foydalanuvchiga savol). «Majburiy 10 fix» va «TAYANCHGA SAVOL» qarorlari — pastdagi ikki jadvalda.

## Asosiy bandlar

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Dars nomi «WebSocket», amalda socket.io — ikki nom bitta narsadek ko'rinadi | **Qisman** | Ko'prik qo'shildi (7-ekran nom qatori): «socket.io — … kutubxona; u imkon bo'lsa WebSocket orqali ulanadi». Kartochka 602 da allaqachon bor edi. **Dars nomini o'zgartirish — Rad:** nom `00-NOMLAR.md` da foydalanuvchi tasdig'i bilan; MD 864 qatorida T-011 bo'yicha «WebSocket faqat dars nomida — TEX qoidasi». Nomni o'zgartirish — faqat foydalanuvchi qarori (hisobotda savol). |
| 2 | Hodisa yozuvdan emas, tranzaksiya tugagandan keyin yuborilsin | **Qabul** | 14-ekran: 3-bo'lak «Backend qo'shilishni Database'ga yozib tugatadi», xulosa «avval Database'dagi o'zgarish tugaydi, keyin hodisa yuboriladi»; ✎ izohida tranzaksiya (11-Modul 14-darsi). Sinf-supurish: 03 MD (4 joy) «yozib tugatgandan keyin»; tayanch 57-qator. |
| 3 | Token qoidasi HTTP bilan «bir xil» emas — ulanish ochilayotganda tekshiriladi | **Qabul** | 7-ekran xulosa, QIzoh, 8-ekran to'g'ri izohi; A1 talabi (2 trek); tayanch 45-qator. «qoida bilan bir» — 12 MD da 0. |
| 4 | Chiqish → qayta kirish: yangi token bilan qayta ulanish talabda yo'q | **Qabul** | A1 talabi (2 trek): «Ilova tokenni o'qib bo'lgandan keyingina ulansin», «qayta kirilganda yangi token bilan ulansin»; tayanch 45. |
| 5 | Ekran qayta ochilganda tinglovchilar ko'payib ketmasin | **Qabul** | A1 talabi (2 trek): «Ekran qayta ochilganda ulanish tinglovchilari ko'payib ketmasin» — agent talabi, o'quvchiga nazariya yo'q (audit taklifi bilan bir); tayanch 45. |
| 6 | «Real vaqt = o'zgarish bo'lgan zahoti» juda mutlaq | **Qabul** | A-bo'lim atamasi va tayanch 239: «o'zgarishdan keyin foydalanuvchi qo'lda yangilamasdan ekran tez yangilanishi». |
| 7 | «Doimiy» uzilmaydi degani emas — 10-ekran yaxshi | Allaqachon | O'zgarishsiz. |
| 8 | Qayta ulanish ekrandagi son to'g'rilandi degani emas — bir gap kerak | **Qabul** | 11-ekran QIzoh: «Ulanish qaytgani son to'g'rilandi degani emas: bu misolda uzilishdagi hodisa keyin kelmaydi.» 5-dars va'da qilinmadi. |
| 9 | Expo Go + uchish rejimi haqiqiy telefonda sinalmagan — muzlatishga to'siq | **Qisman** | Haq — Shubhali 1 da bor edi. Endi «qur» darvozasi deb yozildi (Shubhali 1 ⛔ + JURNAL): pilotda haqiqiy Android + Expo Go'da sinalmaguncha A1 4-qadam (2) muzlatilmaydi; muqobil yo'l hozir to'qilmaydi (audit ham shuni aytadi). MD ning o'zi o'zgarmadi. |
| 10 | «Ulanmoqda…» ga o'tish 45 s — o'quvchi «ishlamadi» deb o'ylaydi | **Qabul** | A1 4-qadam (2): «darhol o'zgarmasligi mumkin: uzilishni aniqlash vaqt oladi (bir daqiqagacha)». Aniq soniya o'quvchi matnida yo'q. |
| 11 | A1 22 daqiqa real emas; 90 daqiqaga sig'masligi mumkin | **Qisman** | A1 ≈ 30; A2 — faqat vaqt qolsa, qolmasa uyga vazifa ① (16-ekran sarlavhasi va vaqt qatori). Jami ≈ 86 + A2. Tushuncha ekranlari qisqartirilmadi — audit ham «hammasi kerak» deydi. 90 daqiqa — pilotda taymer bilan o'lchanadi, o'lchanmaguncha da'vo emas. |
| 12 | «Xato ko'pincha sozlamada, sizda emas» olib tashlansin | **Qabul** | 02 A1 olib tashlandi. Sinf-supurish: 03 (254), 04 (182, 349), 05 (474) — 4 joy; 04 349 «avval telefon sozlamasini tekshiring». 12 MD da 0. |
| 13 | `git checkout -f` xavfli | Allaqachon | 01-FILTR 17 dan beri har «Ortda qoldingizmi»da «alohida papkada» + «faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi» (02: 472, 517); tayanch 286. |
| 14–16 | Kod oynasi, `korsat` argumentsiz, «hodisada son yo'q» | Allaqachon | O'zgarishsiz. |
| 17 | «Son faqat Database'dan olinadi» — ilova Database'ga ulanadi deb qolmasin | **Qabul** | 5-ekran QIzoh: «Haqiqiy sonni ilova Backend'dan qayta oladi; Backend uchun manba — Database.» (audit varianti); tayanch 57. |
| 18 | «Hamma ulangan ilova» — Mentorning sodda varianti deb scope | **Qabul** | 12-ekran QIzoh: «Sxema — reja: hodisalar hali yuborilmaydi; Mentorning sodda variantida ular hamma ulangan ilovaga boradi.» Xona — 4-darsda (04 MD 31). |
| 19 | O'z sxemasi «kamida 2 qator» sun'iy | **Qabul** | 13-ekran va kelishuv 9: kamida 1, ko'pi bilan 5. |
| 20 | Hodisa nomi «o'tgan zamon fe'li» — umumiy qoida emas | **Qabul** | 13-ekran Yordam: «Bu kursda hodisa nomi kichik harf va chiziqcha bilan, bo'lib o'tgan ish ma'nosida yoziladi». |
| 21–23 | Bitta hodisa + sabab Mentor qarori; A2 agent faqat ko'chiradi; hozirgi holat qatori | Allaqachon | O'zgarishsiz. |
| 24 | README jadvaliga «reja» belgisi | **Qisman** | O'zgarishsiz: audit o'zi «hozirgi holat qatori yetarli» deydi; sarlavhaga «(reja)» qo'yilsa, 3-darsda hodisalar qurilgach sarlavha yolg'on bo'lib qoladi — holat qatori esa har darsda yangilanadi. |
| 25 | Render «xabarlar uyg'oq tutadi» — o'quvchi matnidan olinsin | **Qabul** | A1 QIzoh endi faqat «yangi versiya chiqqanda ulanish uziladi»; uyg'oqlik — O'qituvchi eslatmasida, «qur» da tekshiriladi. Rasmiy hujjat «WebSocket messages from existing connections» ni so'rov sanaydi, socket.io ping xabari ham shunga kiradimi — aniq yozilmagan. Tayanch 62 ham shunday. |
| 26 | Render uxlashi + ulanish — 11-Modul 15-dars riski bilan bog'lansin (o'qituvchiga) | **Qabul** | O'qituvchi eslatmasi: «ulangan foydalanuvchi bo'lsa uyg'oq, hech kim bo'lmasa uxlaydi». O'quvchiga yo'q. |
| 27 | Web-trek CORS farqi yaxshi | Allaqachon | O'zgarishsiz. |
| 28 | `prototip/` yoki `web/` — web-trek papkasi qaysi? | **Qabul** | Tekshirildi: 11-Modul tayanchi 153, 237, 249 — web-trek = `prototip/` (adaptiv + PWA). 02 to'g'ri. **Topildi:** 01 MD 373 da «`web/`» — `prototip/` ga tuzatildi. |
| 29–31 | Gateway kartasi «qisqartirilgan»; «Ulanmagan» A1 da majburiy emas; agent «tokensiz ulandim» — da'vo | Allaqachon | Karta yorlig'i 212, 222 qatorlarda bor; A1 kutilgan natijasi «Ulangan» va «Ulanmoqda…» ni tekshiradi. |
| 32 | Hookdagi «Qiziq fikr!» olib tashlansin | **Rad** | Kurs qonuni T-028/T-067 (seans prompti Filtr qoidasi: olib tashlash har doim rad). Matnning qolgan qismi auditor taklifiga yaqin — o'zgarishsiz. |
| 33 | 3-ekran savoli «Backend yangi sonni qachon yuboradi» — mijoz nuqtai nazaridan bo'lsin | **Qabul** | «11-Modulda ilova yangi sonni Backend'dan qachon olardi?» · ✔ «Backend'ga so'rov yuborgan paytda» (34 belgi — variantlar 32–34). |
| 34 | 2-ekran «hech narsa yubora olmaydi» 11-Modulga scope | Allaqachon | Xulosa «11-Modulda …» bilan boshlanadi. |
| 35 | 4-ekran «istagan payt» — ulanish ochiq turganda | **Qabul** | Xulosa: «Ulanish ochiq turganda ikkalasi istagan payt xabar yubora oladi …». |
| 36 | 12-ekran: hodisa → `GET` → ekran tartibi ko'rinsin | **Qabul** | Harakat: konvert → kichik `GET /oyinlar` so'rovi borib-qaytadi → telefondagi joy o'zgaradi. Vizual bosqichda sahnaning o'zida (izohda emas). |
| 37–38 | 14-ekran tartibi; «ulanish birinchi» — fon holat | Allaqachon | O'zgarishsiz. |
| 39 | Uyga vazifa 3 va «ko'pi bilan 5» ziddiyati | **Qabul** | «Sxemada 5 tadan kam qator bo'lsa — … qo'shing». |
| 40 | Yakun sarlavhasi web-trek uchun «Mahsulotingiz» | **Qisman** | Reja sarlavhasi, A1 sarlavhasi va yashil xabari, yakun ikki holati, A-bo'lim «Yakun», uyga vazifa ① — «mahsulotingiz». Final bo'laklari (14-ekran, Maydon Jamoa sahnasi) — neytral «Ilova». Test va tushuncha ekranlaridagi «ilova» — Mentor misoli, o'zgarmadi. |

## «Majburiy 10 fix» — holat

| № | Fix | Holat |
|---|---|---|
| 1 | WebSocket ↔ socket.io ajratish | ✅ band 1 (ko'prik) |
| 2 | Dars nomi va T-011 | ❓ foydalanuvchiga savol — nom tasdiqlangan, TEX qoidasi ruxsat beradi |
| 3 | Tranzaksiyadan keyin hodisa | ✅ band 2 + 03 sinf-supurish |
| 4 | Token ulanish paytida tekshiriladi | ✅ band 3 |
| 5 | Chiqish → kirish → yangi token | ✅ band 4 |
| 6 | Tinglovchilar ko'paymasin | ✅ band 5 |
| 7 | 12-ekran hodisa → `GET` → ekran | ✅ band 36 |
| 8 | Expo Go + uchish rejimi pilotda | ⛔ «qur» darvozasi (band 9) |
| 9 | Render «uyg'oq» o'quvchi matnidan chiqsin | ✅ band 25 |
| 10 | 90 daqiqa pilotda | ⛔ «qur» darvozasi (band 11) |

## «TAYANCHGA SAVOL» bo'yicha auditor qarorlari (24 band)

1, 2, 4, 5, 7, 10, 11, 14, 16, 17, 20, 21, 24 — QABUL, o'zgarishsiz. 3 (`oyinId: 1` faqat Mentor namunasi) — MD shunday. 6 (`prototip/` yoki `web/`) — band 28. 8 («Ulanmagan» — tushuncha sifatida) — band 30.
9 (2–5 qator) — band 19. 12 (socket.io ko'prigi) — band 1. 13 (real vaqt ta'rifi) — band 6. 15 (kutish vaqtlari) — band 10. 18 (reja sarlavhasi) — band 40. 19 (uyga vazifa 3) — band 39. 22 (web uchish rejimi) — pilot. 23 (final tartibi) — band 2.

## Sinf-supurish (12 MD + tayanch, 06.10 15:58)

| Sinf | Qidirildi | Topildi → tuzatildi |
|---|---|---|
| «sizda emas» (ayb haqida da'vo) | 12 MD | 03:254 · 04:182 · 04:349 · 05:474 → 4 joy; 04 690 izohi yangilandi |
| «Database'ga yozgandan keyin» (tranzaksiya) | 12 MD + tayanch | 03:237, 248, 529, 554 → «yozib tugatgandan keyin»; 03 arena 1 «yozilgandan keyin» — o'zgarmadi (variant to'g'ri, tranzaksiya tafsiloti kerak emas) |
| «qoida bilan bir» (token) | 12 MD + tayanch | tayanch 45 → 1 joy |
| «haqiqat manbai bitta» | 12 MD + tayanch | tayanch 57 → 1 joy |
| «uyg'oq tutadi» (Render) | 12 MD + tayanch | tayanch 62 · 02 manba qatori 72 → 2 joy; 03–12 da 0 |
| web-trek papkasi `web/` | 12 MD | 01:373 → `prototip/` |

lint:til — 01, 02, 03, 04, 05: 0 topilma.
