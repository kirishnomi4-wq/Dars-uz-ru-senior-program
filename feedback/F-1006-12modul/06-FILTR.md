# 6-dars «Birinchi foydalanuvchilar sizni qayerdan topadi?» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026, F-1006-360

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch, 1-dars lending, 7 va 10-darslar) → qonun → tasdiqlangan qaror (Qaror-0 11, 12) → auditoriya. Hukm: Qabul / Qisman / Rad + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-1715/` (12 MD va tayanch).

Audit bahosi 7/10 (pedagogika 8.5 · PM fikri 8.5 · o'smir xavfsizligi 9.5 · 11 → 12 continuity 5.5 · ma'lumot modeli 6 · 90 daqiqa 6.5).
Hukm (43 band): **Qabul 17 · Qisman 3 · Rad 1 · Allaqachon / o'zgarishsiz 22**.

**O'z xatoim:** 1-dars Filtrida (01-FILTR, sinf-supurish) «shu hafta chiqadi» iborasini qidirib, «topilma yo'q» deb yozgan edim — 6-dars Mentor postida va tayanch 1.6 da u bor edi. 01-FILTR ga belgi qo'yildi.

## Asosiy bandlar

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1, 31 | Mentor postidagi «Ilova shu hafta chiqadi» — 11-Modul holatiga zid (ilova ishlaydi) | **Qabul** | Yangi post: «Mahalla futbolchilari, Shanba o'yiniga kim kelishini bitta joyda ko'rish uchun «Maydon Jamoa» ilovasini **qurdim**: … **Ilova ishlayapti, o'rnatish havolasi hozircha yo'q** — sahifasini ko'ring: …» — 1-dars lending matni («Hozircha o'rnatish havolasi yo'q.») bilan bir. A-7, 4-ekran, O'qituvchi eslatmasi, 10-ekran Yordam, takrorlash, TAYANCHGA SAVOL 4, tayanch 1.6. 7-dars ikkinchi posti («ilova chiqdi», havola) bilan mos. |
| 2 | «Uyda so'rayman» → `ruxsat: false` — kanal ta'rifiga zid | **Qabul** | `ruxsat: 'bor' \| 'soraladi'`; telefondagi yorliq «ruxsat kutilmoqda» + `QIzoh` «Ruxsat olingach bu joyga post yuboriladi — hozircha u kanal emas.» Tayanch 8 sxemasi. Grep: 7 va 10-darslar faqat `nom` va `yuborildi` ni o'qiydi — sxema o'zgarishi xavfsiz. |
| 3 | Sinf chati — haqiqiy kanal yoki xavfsiz mashq? | **Qabul** | A-bo'lim 1, 9-ekran O'qituvchi eslatmasi, tayanch 9.38 c: sinfdoshlar auditoriya bo'lsa — birinchi kanal, bo'lmasa — darsdagi xavfsiz mashq; haqiqiy kanallarga — uyda. Qaror-0 12 sinf chatini kanal turi sifatida sanaydi — ikkalasi ham mumkin. |
| 4 | Asosiy fikrga ruxsat ham teng kirsin | **Qabul** | «Birinchi kanal — auditoriyangiz bor, siz a'zo va post yozishga ruxsat bor joy; post olti band tekshirilgach yuboriladi.» (A-bo'lim va yakun) |
| 5 | Shahar kanaliga 1-savolda «Yo'q» — dalil yo'qligi «yo'q» degani emas | **Qabul** | Haq. 2-ekran: 1-savolda tugmalar o'rnida «?» va «Keyingi savol»; yozuv «Intervyuda bu kanal tilga olinmagan — dalil yo'q.»; natijada `QIzoh`: «Dalil yo'q — «yo'q» degani emas: bu joyni a'zolik va ruxsat to'xtatdi.» Tugma N/6 → N/5. |
| 6 | Uch savol qoidasi — qabul | Allaqachon | Band 2 bilan uch holat aniq: Ha → kanal · «Uyda so'rayman» → kutilmoqda · Yo'q → tanlanmaydi. |
| 7 | «Zich auditoriya» 13 yoshga og'ir — o'quvchiga ham izoh | **Qabul** | 7-ekranda `QIzoh`: «Zich auditoriya — mahsulot kerak bo'lgan odamlar bir joyda ko'p yig'ilgani.» Bank matni o'zgarmadi. |
| 8, 11, 12 | Facebook ko'prigi; halol holat; olti band | Allaqachon | O'zgarishsiz. |
| 9 | «Qator» — satr majburiy emas | **Qisman** | So'z qoladi (tayanch atamasi); 4-ekran O'qituvchi eslatmasida «tartib postda bir xil bo'lishi shart emas» bor edi. |
| 10 | Mentor postidagi «kim uchun» auditoriyani aniq aytmaydi | **Qabul** | Tayanchni o'zim yozganman — post «Mahalla futbolchilari, …» bilan boshlanadi (band 1 bilan birga). |
| 13 | «Mentor ko'rdi» 4-bandni (ota-ona) yopadi — xavfsizlik mantig'ida xato | **Qabul** | Haq — tayanch 1.6 dagi mening qarorim edi. Endi: sinf chatida 2-band — postni Mentorga ko'rsatish bilan; **4-band Mentor bilan yopilmaydi**: sinf chati (o'qituvchi nazoratidagi joy) uchun shart emas, sinfdan tashqaridagi har kanaldan oldin majburiy; ✓ faqat o'quvchi belgilaganda. 10-ekran yorliqlari, kartochka, yakun chipi, tayanch 1.6 va 9.38 d. **Foydalanuvchiga savol** (pastda). |
| 14 | «Mentor ko'rdi» — o'quvchi Mentor nomidan tasdiqlaydi | **Qabul** | Tugma **«Mentorga ko'rsatdim»** (o'quvchining o'z ishi); `mentorga: bool` (tayanch 8); Mentor statistikasi «Mentorga ko'rsatdi». Sinf chatiga yuborishni Mentor og'zaki aytadi. |
| 15 | Nusxalash va o'zi yuborish | Allaqachon | O'zgarishsiz. |
| 16 | 12–15 o'quvchi bitta chatga post — chat to'lib ketadi | **Qabul** | Sinf chatiga Mentor tanlagan 2–3 post; qolganlar «Mentorga ko'rsatdim» bilan tugaydi (10-ekran O'qituvchi eslatmasi, tayanch 1.6, 9.38 f). Yakunda yangi holat — «Post tayyor va Mentorga ko'rsatildi.» (✓ bilan). |
| 17 | Instagram havolasi bosiladimi — 7-dars uchun | Allaqachon | Shubhali joylarda bor; 7-dars auditida ko'riladi. |
| 18 | Umami'ning o'z sanog'i va `tashrif` hodisasi bir nom bo'lib qolmasin | **Qabul** | A-bo'lim 3, 11-ekran kulrang qatori, uyga vazifa ①: «Umami sahifa ochilishini o'zi ham sanaydi; kanal bo'yicha son — `tashrif` hodisasidan: unda kanal belgisi bor.» Grep: 1-darsda «tashrif» so'zi yo'q — chalkashlik faqat shu darsda edi. |
| 19–22 | Sonlar isbot emas; Instagram soni yo'q; kanal belgisi; kod oynasi | Allaqachon | O'zgarishsiz. |
| 23 | «To'rt havola» — faqat namuna | **Qabul** | Vazifa 3 va shart 3: «Namuna sahifada to'rt …». |
| 24–27 | `.example`; «Boshqa» qatori himoyasi; intervyu dalili; «Do'stlar» | Allaqachon | O'zgarishsiz. |
| 28 | Post tekshiruvidagi qoidalar ortiqcha to'sishi mumkin | **Qabul** | Shubhali joylarga: «qur» da namuna satrlar bilan sinaladi — «18:00», «8 / 10», «2026-10-10», «5-maktab», «+998 90 …». KOD da PM-032 sinovi bor edi. |
| 29, 30 | Va'da so'zlari yumshoq; 1-dars kalitiga bog'liqlik | Allaqachon | `pm-m10d1-lending` (01-FILTR dan keyin) `foydalar` va `manzil` ni beradi. |
| 32, 33 | Yakun sarlavhasi va chip — sinf chati mashq bo'lsa | **Qabul** | Besh holat: «Postingiz sinf chatiga yuborildi.» · «Post tayyor va Mentorga ko'rsatildi.» · «Post yozildi — Mentorga ko'rsatish qoldi.» · …; chip: «Olti band: tekshirildi» · «Sinf chati uchun tekshirildi — 4-band boshqa kanallardan oldin» · «Olti band: n / 6». |
| 34 | Uyga vazifa katta | **Qisman** | ② — «kamida bitta haqiqiy kanalingiz» (avval «qolgan 1–2»); ① qoladi. ③ (EAS) — Qaror-0 11 sizning qaroringiz: 6-dars uyida boshlanadi, tayyor bo'lmasa 7-dars rejadan boshlanadi — o'zgarmadi. |
| 35 | EAS — 7-dars uchun xavf | **Qisman** | «Qur» da Mentor repo'sida sinaladi (tayanch 9.38 j); 7-darsning zaxira yo'li Qaror-0 11 da bor. |
| 36–39 | 3, 5, 12-testlar; arena «egasi javob bermasa» | Allaqachon | O'zgarishsiz. |
| 40 | Hookdagi «Qiziq fikr!» | **Rad** | T-028/T-067 (seans Filtr qoidasi: doim rad). |
| 41 | Hookdagi «tanish guruh» — umumiy qoida emas | **Qabul** | «Aynan! Mentor misolida odamlar tanish guruhda allaqachon yig'ilgan — havolani o'sha yerda ko'radi.» (91) |
| 42, 43 | Facebook izohi; real odamlar xavfsizligi | Allaqachon | O'zgarishsiz. |
| Sarlavhalar | Reja sarlavhasi faqat haqiqiy kanalga post bo'lsa rost | o'zgarishsiz | «Bugun mahsulotingizni birinchi odamlarga tanishtirasiz.» — post Mentorga ko'rsatiladi va tanlanganlari sinfdoshlarga boradi; sinfdoshlar ham odamlar. |

## «Majburiy 9 fix» — holat

| № | Fix | Holat |
|---|---|---|
| 1 | «Ilova shu hafta chiqadi» | ✅ band 1 |
| 2 | Ruxsat uch holat | ✅ band 2 |
| 3 | Sinf chati: kanal yoki mashq | ✅ band 3 |
| 4 | 4-band Mentor bilan yopilmasin | ✅ band 13 (savol pastda) |
| 5 | «Mentorga ko'rsatdim» | ✅ band 14 |
| 6 | Shahar kanali — «?» | ✅ band 5 |
| 7 | Umami sanog'i va `tashrif` | ✅ band 18 |
| 8 | Bitta chatga 12–15 post | ✅ band 16 |
| 9 | EAS pilotda | ⛔ «qur» darvozasi (band 35) |

## «TAYANCHGA SAVOL» bo'yicha auditor qarorlari (16 band)
1, 5, 6, 7, 8, 11, 12, 13, 16 — QABUL, o'zgarishsiz. 2 — band 5. 3 — tayanch 9.38 i (Mentor misoli olami: sinf chati va Instagram dalili, O'qituvchi eslatmasida). 4 — band 1. 9 — band 2. 10 — band 3. 14 — band 14. 15 — band 18.
Auditorning ikki qo'shimcha savoli — band 3 va band 13.

## Sinf-supurish (12 MD + tayanch, 06.10)

| Sinf | Qidirildi | Topildi → tuzatildi |
|---|---|---|
| Kelajak va'dasi «shu hafta chiqadi» (01-FILTR da o'tkazib yuborilgan) | 12 MD + tayanch | 06 · tayanch 1.6. Boshqa darslarda — 0 |
| «2 va 4-band Mentor ko'rgani bilan yopiladi» | 12 MD + tayanch | 06 · **07** (A-bo'lim 51, A2 316) · tayanch 1.6 |
| `ruxsat: bool` | 12 MD + tayanch | 06 · tayanch 8. 7 va 10-darslar `ruxsat` ni o'qimaydi |
| «Mentor ko'rdi» tugmasi | 12 MD | faqat 06 |
| Dars natijasi «sinf chatiga yuborilgan» | tayanch | tayanch 4 jadvali (6-qator) |

`lint:til` — 06: 0 error, 1 warn (bank matnining ruscha asli — avvaldan) · 07: 0 · tayanch: 0 error (3 warn avvaldan) · 01-FILTR: 0 error (1 warn avvaldan).

## Foydalanuvchiga savol (xavfsizlik — sizning qaroringiz)
Qaror-0 12 da «ota-ona xabardor» deyilgan. Sinf chatiga darsda post yuborilganda ota-ona bandi (4-band) bajarilmagan bo'ladi — men uni «sinf chati o'qituvchi nazoratida, shuning uchun shart emas; ✓ qo'yilmaydi» deb yozdim.
Muqobil: sinf chatiga ham ota-ona ko'rmaguncha yuborilmaydi — darsda post faqat Mentorga ko'rsatiladi, yuborish uyda.
