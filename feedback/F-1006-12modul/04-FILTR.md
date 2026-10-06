# 4-dars «Loyiha kuni: jonli xabar va eslatma» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026, F-1006-358

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch, 11-Modul tayanchi, rasmiy hujjat, dastur) → qonun → tasdiqlangan qaror → auditoriya. Hukm: Qabul / Qisman / Rad + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-1700/` (12 MD va tayanch).

Audit bahosi 7/10 (pedagogika 8.5 · real vaqt mahsulot fikri 9 · texnik aniqlik 6 · mobil eslatma 5.5 · web-trek 8 · 90 daqiqa 5).
Hukm (46 band + 1 qo'shimcha savol): **Qabul 21 · Qisman 5 · Rad 3 · Allaqachon / o'zgarishsiz 17**.

## Asosiy bandlar

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | 5-ekran: «ilova yopildi → ulanish uzildi» — sabab qat'iy ko'rsatilmasin, natija ko'rsatilsin | **Qabul** | Sahna: «Ilovani yopish» → chiziq xira tortadi (yorliqsiz); «O'yindan chiqish» → 1-telefon tomon konvert chizilmaydi, yorliq «jonli xabar ko'rinmadi». Matn: «yetmaydi» → «ko'rinmaydi» (bashorat, natija, 7-ekran izohi, takrorlash oynasi, A-bo'lim, KOD). Tayanch 1.4 va 9.36 e. Qaror-0 8 ning ma'nosi o'sha — so'zi natija tilida. |
| 2 | Hookdagi «Qiziq fikr!» olib tashlansin | **Rad** | T-028/T-067 (seans Filtr qoidasi: doim rad). Javob matnlari auditor taklifiga yaqin — o'zgarishsiz. |
| 3 | «Backend yuboradigan eslatma Expo Go'da ishlamaydi» — bola «Backend hech qachon yubora olmaydi» deb tushunmasin | **Qabul** | 5-ekran QIzoh: «Backend yuboradigan eslatma ham bor — u bu modulda qurilmaydi: Google yoki Apple xizmati va alohida sozlash kerak.» (145 → 114). Kartochkada «Expo Go'da ishlamaydi; bu modulda qurilmaydi» qoldi — rasmiy fakt, chegarasi bilan. |
| 4 | «Google yoki Apple xabar xizmati» yetarli | Allaqachon | Tayanch 9.26. **Topildi:** arena 10 da hali «Ishlab chiqaruvchi xizmati» turgan edi → ✔ «Google yoki Apple xizmati va sozlash». |
| 5 | «O'z harakati uchun chiqmasin» — `{ oyinId, sabab }` bilan qanday bilinadi? Agentga qoldirilmasin | **Qabul** | Haq: tayanch 9.25 «usulini agent tanlaydi» degan edi. Yangi qoida (tayanch 9.36 b): **javobdagi o'z maydonlari** (`menQoshilganman`, `menNavbatdaman`, `menTasdiqlaganman`) o'zgargan bo'lsa — o'z harakati (navbatdan o'tishdan tashqari). Hodisaga maydon qo'shilmaydi (3-dars qarori saqlanadi), vaqtga tayanmaydi (band 20). Ilova o'z so'rovidan keyin ro'yxatni oldin yangilab qo'ysa — son o'zgarmagan bo'ladi, xabar baribir chiqmaydi. |
| 6, 13, 18 | Tashkilotchi ekanini ilova qanday biladi? | **Qabul** | Tayanch 9.25 da allaqachon qaror bor edi (`menTashkilotchiman`, GATE M M-q3 tavsiyasi A), lekin 04 MD unga moslanmagan edi — endi Mentor talabida aniq: «`GET /oyinlar` javobiga `menTashkilotchiman` qo'sh». M-q3 javobingiz kutilmoqda (B bo'lsa — maydon 11-Modul repo'sidan keladi). |
| 7 | Son — ulanishlar, ekran emas; o'qituvchiga aniq | **Qabul** | 2-ekran O'qituvchi eslatmasi: «son — xonadagi ulanishlar; odatda har ochiq o'yin ekrani bittadan ulanish beradi». O'quvchi matni o'zgarmadi. |
| 8 | Ulanish uzilganda ham yangi son yuborilsin | **Qabul** | O'quvchi va Mentor promptida: «… yangi sonni yuborsin — ulanish uzilganda ham». REPO 1 da avvaldan bor edi. Rasmiy hujjat: uzilgan ulanish xonadan o'zi chiqadi. |
| 9 | Xonaga kirish — ruxsat qoidasi | **Qisman** | O'quvchi promptining «Nima buzilmasin» qatoriga: «ekranni kim ko'ra olishi avvalgidek qolsin». Mentor misolida o'yinlar hamma uchun ochiq — qo'shimcha kerak emas. |
| 10 | `korayotganlar-ozgardi` sonni o'zi olib keladi — yaxshi istisno | Allaqachon | O'zgarishsiz. |
| 11, 12 | Agentning ikkinchi ulanishi asosiy yo'l bo'lmasin; bir daqiqa kutish shart emas | **Qabul** | Amaliyot 1 4-qadam (2): **web-trek** — kompyuterda ikkinchi oyna (agentsiz) · **mobil trek** — sherik telefoni · agent — faqat zaxira, «30 soniyadan keyin yop». Tayanch 9.36 g. |
| 14 | Jonli xabar `GET /oyinlar` dan keyin — yaxshi | Allaqachon | O'zgarishsiz. |
| 15 | «To'ldi» xabarini qanday tanlash agentga aniq aytilsin | **Qabul** | Mentor talabi: «qo'shilganlar ko'paysa — «qo'shildi», o'yin to'lsa — «to'ldi»» (yangi javobdan). |
| 16 | `chiqdi` + navbatdagi avtomatik kirsa — «joy bo'shadi» noto'g'ri | **Qabul** | Haq — 11-Modul tayanchi 164: navbatdagi bitta tranzaksiyada `qoshildi` bo'ladi, son o'zgarmaydi. Qoida (tayanch 9.36 a): xabar sababdan emas, sonlar farqidan — kamaysa «joy bo'shadi», o'zgarmasa boshqalarga xabar yo'q. REPO 3: muhrdan oldin shu holat tekshiriladi. |
| 17 | Navbatdan o'tish — sababdan emas, holatlar farqidan | **Qabul** | Tayanch 9.36 c: oldin `menNavbatdaman`, endi `menQoshilganman` → «Navbatdan o'yinga o'tdingiz». |
| 19, 21, 22 | «Chiqmasligi kerak» tekshiruvlari; eslatma talabi foydalanuvchi ehtiyojidan; faqat muvaffaqiyatli «Qo'shilaman»dan keyin | Allaqachon | O'zgarishsiz. |
| 20 | O'z harakatini aniqlash vaqtga bog'liq bo'lmasin | **Qabul** | Band 5 qoidasi vaqtga tayanmaydi — javoblarni solishtiradi. |
| 23, 45 | Navbatdan o'tgan o'yinchiga eslatma yo'q | **Qisman** | Qurilmaydi — birinchi versiya cheklovi (tayanch 9.36 i). A-bo'lim halol chegarasi va A3 O'qituvchi eslatmasida ochiq aytiladi; o'quvchiga «faqat «Qo'shilaman» bosilgan telefonda». Lending va pitchda «eslatadi» va'dasi yo'q (tayanch 1.1). |
| 24 | «Hisobdan chiqish»da eslatmalar nima bo'ladi? | **Qabul** | Qaror (tayanch 9.36 i): «Hisobdan chiqish» va «Hisobni o'chirish» da shu telefondagi eslatmalar bekor bo'ladi — 7-dars Mentor talabiga qo'shildi (07 MD, A1 3-band; 7-dars ishga tushirishdan oldingi tekshiruv bloki). |
| 25 | Android aniq vaqt va Expo Go'da eslatma — haqiqiy telefonda sinalsin | **Qabul** | «Qur» darvozasi (tayanch 9.34 i kengaydi): ruxsat, test holatida chiqish, bekor qilish — Android va iPhone'da. Shubhali 2 ⛔. |
| 26 | Kanal va ruxsat oynasi — pilotda | Allaqachon | Shubhali 1, 2; kutilgan natijada umumiy chizma. |
| 27, 28 | Ilova ochiq paytda eslatma ko'rsatish (`setNotificationHandler`) olib tashlansin | **Rad** | Auditor dalili — «jonli xabar bilan takror». Tekshirdim: eslatma vaqtida (17:00) hodisa yo'q, jonli xabar chiqmaydi — takror bo'lmaydi. Qo'shimcha sabab: o'quvchi test holatida ilovani ochiq qoldirsa, handler bo'lmasa eslatma ko'rinmaydi va u «ishlamadi» deb o'ylaydi. A3 ✎ va tayanch 9.36 i ga yozildi. |
| 29, 31 | Web «Xabarlar» tasmasi; yangilanganda bo'sh | Allaqachon | O'zgarishsiz. |
| 30 | Tasma «eslatma o'rnida» emas — boshqa ish | **Qabul** | «eslatma o'rnida» → «bu blokda» / «3-qadamda» (reja, A3 «Ochish», A-bo'lim); arena 12 savoli «Web-trekda uchinchi amaliyotda nima quriladi?». |
| 32, 33 | 7-ekran D va A — «Mentor misolida» | Allaqachon | O'zgarishsiz. |
| 34 | «Hozir ko'ryapti» hamma mahsulotga majburiy bo'lmasin | **Qisman** | Dastur (00-MANBA, 4-qator): natija «Presence + xabarlar mahsulotda» — har mahsulotda qoladi. Halol qator qo'shildi: «Mahsulotingizni bir vaqtda bitta odam ishlatsa — son sizning ochiq qurilmalaringizni sanaydi (masalan, telefon va kompyuter).» |
| 35 | Jonli xabar faqat foydali o'zgarishda | **Qabul** | A2 «Ochish»: «Har o'zgarish jonli xabarga arzimaydi: foydalanuvchi darhol bilishi kerak bo'lganini tanlang — qolganlari ekranda jimgina yangilanadi.» |
| 36 | A3 ehtiyojdan boshlanadi | Allaqachon | O'zgarishsiz. |
| 37 | 90 daqiqa juda zich | **Qisman** | Vaqt qatori: «90 daqiqaga sig'ishi — «qur» pilotida taymer bilan o'lchanadi, o'lchanmaguncha da'vo emas»; tayanch 9.34 i. Bloklar qisqartirilmadi — dastur uch qismni talab qiladi. |
| 38, 39 | «Bajardim» 3-qadamdan keyin — tekshirilmagan blok «ishlaydi» deb chiqadi | **Qabul** | Haq. Qoida (tayanch 9.36 h): blok bajarilgani — faqat 4-qadam «Bajardim»idan; «Ulgurmasangiz» yo'lida 3-qadamdan keyin faqat «Davom etish» ochiladi. Yakun: ✓ yorlig'i va «Uch qism ishlayapti» — uchala blok tekshirilganda; yangi holat «Hozir ko'ryapti»ni telefonda tekshirish qoldi.» Sinf-supurish — pastda. |
| 40, 41 | Test holatini qaytarish; «Bugun» farqi | Allaqachon | O'zgarishsiz. |
| 42 | Bitta o'yinga bitta eslatma | **Qabul** | Mentor talabi: «qayta rejalashtirilsa — eskisi bekor bo'lsin»; REPO 4. |
| 43, 44, 46 | Bir soatdan kam — qo'yilmaydi; chiqishda bekor; 16:59 → 17:00 sahna | Allaqachon | O'zgarishsiz. |
| Qo'shimcha | `chiqdi` + navbat — jonli xabar matni? | **Qabul** | Band 16: son o'zgarmasa boshqalarga xabar yo'q; navbatdan o'tganga — «Navbatdan o'yinga o'tdingiz». |

## «Majburiy 10 fix» — holat

| № | Fix | Holat |
|---|---|---|
| 1 | «Ilova yopildi → ulanish darhol uzildi» qat'iy ko'rsatilmasin | ✅ band 1 (+ 9-dars) |
| 2 | «Qiziq fikr!» | ✗ Rad (qonun) |
| 3 | O'z harakatini aniqlash usuli | ✅ band 5 (tayanch 9.36 b) |
| 4 | Tashkilotchi — API | ✅ band 6 (`menTashkilotchiman`; M-q3 javobi kutilmoqda) |
| 5 | `chiqdi` + navbat — «joy bo'shadi» | ✅ band 16 |
| 6 | Uzilganda ham yangi son | ✅ band 8 |
| 7 | Agentning ikkinchi ulanishi — zaxira | ✅ band 11 |
| 8 | Ochiq ilovada eslatma ko'rsatish olib tashlansin | ✗ Rad (band 27 — sabab bilan) |
| 9 | Expo Go eslatmasi haqiqiy telefonlarda | ⛔ «qur» darvozasi (band 25) |
| 10 | «Bajardim» — tekshirilganiga bog'lansin | ✅ band 38 |

## «TAYANCHGA SAVOL» bo'yicha auditor qarorlari (17 band)
2, 3, 4, 6, 12, 13, 14, 15, 16 — QABUL, o'zgarishsiz. 1 — «Qiziq fikr!» qismi rad (band 2). 5 — band 11. 7 — band 6. 8 — band 5. 9 — band 27 (rad). 10 — band 23. 11 — band 24. 17 — band 38.

## Sinf-supurish (12 MD + tayanch, 06.10)

| Sinf | Qidirildi | Topildi → tuzatildi |
|---|---|---|
| «Yopiq ilovaga hodisa yetmaydi / ulanish yo'q» + sahnada chiziq uzilishi | 12 MD + tayanch | 04 (A-bo'lim, ip, vizual, 5-ekran, 7-ekran, takrorlash, KOD) · **09** (asosiy fikr ×2, halol chegara, ip, vizual, 2-ekran sahnasi, xulosa, ✎, 1-savol izohlari, takrorlash, kartochka, KOD, o'lchov) · tayanch 1.4 |
| «Bajardim» tekshiruvdan oldin | 12 MD | 02 A1 · 04 A1, A2 · 05 A1 · 09 A1 → «Davom etish» ochiladi, blok bayrog'i — tekshiruvdan keyin; 03 da avvaldan to'g'ri |
| «Ishlab chiqaruvchi xizmati» (tayanch 9.26 dan qolgan) | 12 MD | 04 arena 10 |
| Jonli xabar sababdan tanlanadi | 12 MD + tayanch | 04 Mentor talabi, REPO 3 · tayanch 1.4 · 9.25 ning ikkinchi gapi 9.36 b bilan almashtirildi |
| Chiqishda eslatmalar | 12 MD | 07 Mentor talabi 3-band |
| «eslatma o'rnida» (web-trek) | 12 MD | faqat 04 |

`lint:til` — 02, 04, 05, 07: 0 topilma · 09: 0 error, 1 warn (avvaldan) · tayanch: 0 error, 3 warn (avvaldan).
