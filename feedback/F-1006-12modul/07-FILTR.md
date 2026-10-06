# 7-dars «50 foydalanuvchiga qanday yetasiz?» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026, F-1006-361

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch, 11-Modul tayanchi, 6 va 10-darslar) → qonun → tasdiqlangan qaror (Qaror-0 10, 11, 13, 14, 16) → auditoriya. Hukm: Qabul / Qisman / Rad + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-1730/` (12 MD va tayanch).

Audit bahosi 6.5/10 (PM 8.5 · foydalanuvchiga chiqarish 9 · ma'lumot va maxfiylik 6.5 · o'z mahsulotiga ko'chirish 5.5 · texnik hajm 5 · 90 daqiqa 3.5).
Hukm (50 band): **Qabul 20 · Qisman 7 · Rad 1 · Allaqachon / o'zgarishsiz 22**.

## Asosiy bandlar

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | O'quvchi talabida telefon → login majburiy — mahsulot qarori agentga o'tadi | **Qabul** | O'quvchi talabi: «ro'yxatdan o'tishda mahsulotga kerak bo'lmagan shu ma'lumot so'ralmasin: **{ortiqcha ma'lumot}**. Kirish uchun alohida nom kerak bo'lsa — login …». Qavsni o'quvchi «Ochish» dagi savoldan to'ldiradi. Mentor Yordamida telefon → login aynan qoldi. Talab zinapoyasi: ikki joy (tayanch 9.24, 9.39 a). Qaror-0 14 Mentor misoli uchun — o'zgarmadi. |
| 2 | Mavjud akkauntlarning hammasi `namuna = true` — faqat Mentor repo'si uchun to'g'ri | **Qabul** | O'quvchi talabi: agent ro'yxat ko'rsatadi, «qaysilari namuna ekanini men aytaman» — agent taxmin qilmaydi. Mentor Yordamida — hammasi (11-Modul sinovchilari). O'qituvchi eslatmasi: haqiqiy odamning akkaunti namuna qilinmaydi. |
| 3 | «Hisobni o'chirish» — har mahsulotda boshqa siyosat kerak | **Qabul** | O'quvchi talabi: «Unga tegishli qaysi yozuvlar o'chishi va qaysilari qolishini avval menga ro'yxat qilib ko'rsat — men tasdiqlagach bajar.» Mentor Yordamida aniq qaror qoldi. |
| 4 | Siyosatdagi «kim ko'radi» ni koddan har doim bilib bo'lmaydi | **Qabul** | Prompt: «koddan bilib bo'lmaydigan joyni «[savol]» deb qoldir, uni men yozaman». 3-bo'limda o'quvchi to'ldiradi; Mentor misoli: «Database'ni faqat ilova egasi ko'radi» — buni Mentor biladi, kod aytmaydi. |
| 5 | «Yuridik hujjat emas» qatori | Allaqachon | O'zgarishsiz. |
| 6 | Fayl tekshiruvdan oldin boshlanmasin | **Qabul** | Fayl — faqat (1) o'tgach (ro'yxatdan o'tish, «Bu login band», asosiy harakat); SQL va tozalash — navbat paytida. «Ulgurmasangiz» qatori shunday qayta yozildi. |
| 7, 8 | A1 va A2 22 daqiqaga sig'maydi (35–50 va 30–45) | **Qisman** | Haq bo'lishi mumkin — lekin hajmning ko'pi sizning qarorlaringiz: telefon → login (Qaror-0 14), hodisalar (Qaror-0 16), iPhone yo'li (Qaror-0 10), fayl (Qaror-0 11). O'zim qisqartirmadim. Vaqt qatoriga: pilotda taymer bilan; GATE M **M-q2** (brauzer ko'rinishini 8-darsga ko'chirish) shu yukni kamaytiradi — javobingiz kutilmoqda. Reja sarlavhasi va yashil qator yuborishni va'da qilmaydi (band 21). |
| 9 | Hodisa nomi «o'tgan zamon fe'li» — umumiy qoida emas | **Qabul** | «Bu kursda nomlar kichik harf va chiziqcha bilan, bo'lib o'tgan ish ma'nosida» (02 bilan bir). |
| 10, 11 | Qurilma ID — odam emas | Allaqachon | O'zgarishsiz; 8-dars auditida «qurilma» → «foydalanuvchi» aylanmasligi ko'riladi. |
| 12, 13 | `ochdi` takrorlanmasin; hodisa faqat muvaffaqiyatdan keyin | **Qabul** | O'quvchi talabiga: «Har hodisa ish muvaffaqiyatli tugagandan keyin yozilsin; ilovaning bitta ochilishiga bitta hodisa.» Mentor: «ilova ochilganda (bitta ochilishga bitta) — `ochdi`». |
| 14, 15 | Analitika xatosi ilovani to'xtatmaydi; 60 kun — 10-Modul muddati | Allaqachon | O'zgarishsiz. |
| 16, 17 | `telefon` ustunini qiymatlari bilan o'chirish — qaytarib bo'lmaydi; login ro'yxati oldin ko'rsatilsin | **Qabul** | Ikki bosqich: agent ro'yxat ko'rsatadi (akkaunt, beriladigan login, olib tashlanadigan ustun) → o'quvchi tekshiradi va «Davom et» deydi → keyin o'chiradi. Ikkala promptda va 3-bo'limda; tayanch 9.39 b. |
| 18 | Tashkilotchisi bo'sh qolgan o'yinlar ro'yxatni buzmasin | **Qabul** | Mentor talabiga: «bunday o'yinlar ro'yxatda va «O'yin» ekranida xatosiz ko'rinsin». |
| 19, 20 | Chiqishda eslatmalar bekor (4-dars bilan); 2 va 4-band | Allaqachon | 04-FILTR 24 (tayanch 9.36 i) va 06-FILTR sinf-supurishida (07 51, 316) tuzatilgan. |
| 21 | «Birinchi foydalanuvchilar yo'lda» — sinf chati haqiqiy kanal bo'lmasa | **Qabul** | Yashil: «Siyosat saytda, havola lendingda, post yuborildi.» · reja sarlavhasi: «Bugun reja tuzib, ilovangizni yuborishga tayyorlaysiz.» · A-bo'lim: post Mentorga ko'rsatiladi (tayanch 9.38). |
| 22 | 20 = 11 sinfdosh + 9 | Allaqachon | O'zgarishsiz. |
| 23 | Sinfdoshlarni qo'l ko'tartirib sanash — bosim | **Qabul** | Sinfdosh soni — ixtiyoriy («bilsangiz»), sinfda hech kim majburlanmaydi (A-bo'lim, A2 (3), O'qituvchi eslatmasi, uyga ②, tayanch 9.6). |
| 24 | «Modul maqsadi — 50» o'quvchiga me'yor bo'lib qolmasin | **Qabul** | «Bu moduldagi mashq maqsadi — 50. Yana kanal bormi?» (50) |
| 25 | Jami son | Allaqachon | O'zgarishsiz. |
| 26 | «Har e'londa tashkilotchi yuboradi» — majburiy xatti-harakatdek | **Qabul** | «tashkilotchilar xohlasa o'z jamoasiga yuboradi» (2-ekran, Yordam, tayanch 1.7). 10-darsdagi «Havolani ulashish» tugmasi ham tashkilotchining tanlovi — o'zgarmadi. |
| 27, 30 | iPhone yo'li, `_redirects` — pilotda | Allaqachon | Shubhali 1, Qaror-0 10 zaxirasi; tayanch 9.39 k. |
| 28 | `localStorage` — xavfsizlik bo'yicha bir gap | **Qabul** | O'qituvchi eslatmasi: «Brauzer yo'li — zaxira: token brauzer xotirasida saqlanadi, telefondagidan farqli.» |
| 29 | Veb eksport uchun paketlar | **Qisman** | Prompt: «Brauzer uchun paket yetishmasa — `npx expo install` bilan qo'sh va qaysi paket ekanini ayt.» Aniq paketlar ro'yxatini yozmadim — bizdagi manbalarda yo'q; pilotda. |
| 31 | Ikkinchi Netlify sayti — qo'shimcha yuk | **Qisman** | GATE M M-q2 (iPhone yo'lini 8-darsga ko'chirish) — sizning qaroringiz. |
| 32 | APK havolasi boshqa telefonda ochiladimi | **Qabul** | A2 (1): «Havolani boshqa telefonda yoki brauzerning yashirin oynasida ham oching — fayl Expo akkauntisiz yuklanishi kerak; yuklanmasa, havolani lendingda qoldirmang.» «Qur» darvozasi. |
| 33–35, 38, 39 | Ogohlantirish matni; iPhone eslatmasi yo'q; bitta lending havolasi; siyosatni kod bilan solishtirish; «Nima uchun» o'quvchidan | Allaqachon | O'zgarishsiz. |
| 36, 37 | Siyosat havolasi A1 da, sahifa A2 da; fayl siyosatdan oldin | **Qisman** (36) · **Qabul** (37) | Tartib qoldi (navbat vaqti); O'qituvchi eslatmasi ochiq: «O'rnatish fayli tayyor bo'lsa ham, maxfiylik sahifasi va havola tekshirilmaguncha odamlarga berilmaydi.» |
| 40, 41 | «Asosiy harakat» — «bir marta qo'shilgan»mi yoki hozirgi holatmi? Joriy sxema qaysi birini sanaydi? | **Qabul** | Haq — muhim topilma. Tayanch 9.23 SQL i hozirgi holatni sanaydi (`holat IN ('qoshildi', 'keladi')`, chiqqan sanalmaydi), matn esa «kamida bitta o'yinga qo'shilgan» edi. Ta'rif sanaladigan qilindi: **«hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan»** — 7, 10, 11, 12-darslar va tayanch (sinf-supurish). |
| 42 | «Ro'yxatdan o'tgan 20» — bugungi emas, hozirgacha | **Qisman** | O'quvchi yozuvi: «Hozirgacha ro'yxatdan o'tgan»; uyga ② ham. Mentor misolidagi «ishga tushirish kuni — 20» qoldi (Mentor uchun shu kuni hammasi yangi). |
| 43 | Son va sana | Allaqachon | O'zgarishsiz. |
| 44 | Hookdagi «Qiziq fikr!» | **Rad** | T-028/T-067 (seans Filtr qoidasi: doim rad). Javob matni allaqachon «Tanishlardan boshlash mumkin — rejada ham shunday» deydi. |
| 45–47 | 2-ekran savoli; 20 bashorati; taxmin = haqiqiy | Allaqachon | O'zgarishsiz. |
| 48 | Uch bosqich har mahsulotga majburiy | **Qisman** | Uch bosqich — kurs artefakti (tayanch 1.7). Yordamga: «Yangi kanal bo'lmasa — 3-bosqich oldingi kanallarda davom etishi mumkin.» |
| 49 | 6-darsdagi ruxsat uch holati 7-darsga ham | **Qabul** | 5-ekran: kanal `ruxsat: 'bor'` lardan to'ldiriladi; `'soraladi'` yonida «avval ruxsat so'rang». Tayanch 9.39 j. |
| 50 | 7-darsdagi «Hozircha o'rnatish havolasi yo'q» — 1 va 6-darslarga ham | Allaqachon | 01-FILTR (lending) va 06-FILTR 1 (Mentor posti) da qilingan. |

## «Majburiy 10 fix» — holat

| № | Fix | Holat |
|---|---|---|
| 1 | O'quvchiga telefon → login majburiy emas | ✅ band 1 |
| 2 | Mavjud akkauntlar avtomatik namuna emas | ✅ band 2 |
| 3 | Ustun o'chirilishidan oldin ro'yxat va tasdiq | ✅ band 16, 17 |
| 4 | Asosiy harakat ta'rifi sanaladigan | ✅ band 40 (5 fayl) |
| 5 | 6-darsdagi ruxsat holati | ✅ band 49 |
| 6 | Ota-ona bandi Mentor bilan yopilmaydi | ✅ 06-FILTR da |
| 7 | Siyosatda taxmin yo'q | ✅ band 4 |
| 8 | iPhone yo'li pilotsiz va'da emas | ⛔ «qur» darvozasi + M-q2 |
| 9 | APK havolasi boshqa telefonda | ✅ band 32 (darsda) · ⛔ «qur» da sinov |
| 10 | 90 daqiqa | ⛔ «qur» pilotida + M-q2 |

## «TAYANCHGA SAVOL» bo'yicha auditor qarorlari (19 + 3 yangi)
1, 2, 4, 5, 7, 10, 11, 14, 15, 17 — QABUL, o'zgarishsiz. 3 — band 1. 6 — band 2. 8 — band 23. 9 — band 18. 12 — pilot. 13 — 06-FILTR. 16 — band 36. 18 — band 1. 19 — band 40.
Auditorning yangi savollari: 20 (login har doim kerakmi) — band 1 · 21 (namuna — o'quvchi tasdig'i) — band 2 · 22 (asosiy harakat — hozirgi holat) — band 40.

## Sinf-supurish (12 MD + tayanch, 06.10)

| Sinf | Qidirildi | Topildi → tuzatildi |
|---|---|---|
| «Asosiy harakat» — «kamida bitta o'yinga qo'shilgan/qo'shildi» (o'lchanmaydi) | 12 MD + tayanch | 07 (3) · 10 (6) · 11 (8) · 12 (3) · tayanch (3) → «hozir kamida bitta o'yinda qatnashayotgan / qatnashyapti …». O'lchangan qatorlarga ta'sir yo'q |
| O'quvchi talabida Mentorning mahsulot qarori (login, namuna, o'chirish) | 12 MD | faqat 07 |
| Qaytarib bo'lmaydigan o'zgarish tasdiqsiz | 12 MD | 07 (ikkala prompt). 5-dars tekshiruv yozuvlari — `id` bo'yicha, qoldi |
| Sinfdoshlarni sinfda so'rab sanash | 12 MD + tayanch | 07 · tayanch 9.6. 10-dars «Sinfdoshlar alohida» — 7-dars sonidan o'qiydi, o'zgarmadi |
| «Har e'londa tashkilotchi yuboradi» | 12 MD + tayanch | 07 (2) · tayanch 1.7 |

`lint:til` — 07, 12: 0 topilma · 10: 0 error, 1 warn (avvaldan) · 11: 0 error, 17 warn (avvaldan — MEXANIZM-TAKLIF 7) · tayanch: 0 error, 3 warn (avvaldan).
