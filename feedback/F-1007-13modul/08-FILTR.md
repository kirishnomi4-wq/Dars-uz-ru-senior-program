# 8-dars «Loyiha kuni: ketayotgan foydalanuvchini qaytarish» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch 1.4, 1.8, 9.26, 9.38–9.40; 3, 10-darslar naqshi) → qonun (QOIDALAR, TAQIQLAR) → tasdiqlangan qaror (`GATE_M_JAVOB.md`) → auditoriya. Hukm: Qabul / Qisman / Rad / Allaqachon + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-08/` (hamma MD va tayanch). Tuzatish skripti: scratchpad `f08/tuzat08.py` (08 — 89, tayanch — 5 juftlik; birinchi yurishda bitta qator matni boshqacha chiqdi — skript to'xtatdi, fayl yozilmadi, tuzatilib qayta yurgizildi). F-1007-466.

Audit bahosi 5.5/10 (pedagogika 8.5 · maxfiylik 8 · ulanish 7 · xabar yuborish tuzilishi 3.5 · o'lchov 7 · 90 daqiqa 2.5). Hukm: **Qabul 27 · Qisman 3 · Rad 5 · Allaqachon 19** (sarlavhalar qatori bilan).
⚠️ **Siz tasdiqlagan qarorga MD o'zi zid ekan — tuzatildi:** 3-amaliyot oxirida `eas build` (yangi o'rnatish fayli) bor edi — **M-q5 A**: APK faqat 10 va 12-darsda. Olib tashlandi (52-band).
⚠️ **Siz tasdiqlagan qarorlarga zid bandlar — o'zgartirilmadi:** 1 ning A varianti (vaqt bo'yicha o'yin yaratish — tayanch 1.4 Mentor qarori) · 47–48 (Telegram va ilova eslatmalari uchun umumiy chegara — tayanch 9.40) · 50 (nishonlar natijaga bog'lansin — M-q6 A) · 5 (hook javoblari — T-028). Ulardan birortasini o'zgartirmoqchi bo'lsangiz — ayting.
⚠️ **Tasdiqlangan tayanch matniga tegadigan Qabul:** 1.8 (Telegram xabarida son yo'q) · 9.38 · 9.39 (kod, `update_id`, `setWebhook`) · 9.40 (sherik Telegram'i — faqat tekshiruv hisobiga) · yangi 9.54.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Ilova yopiq bo'lsa ham Backend yangi o'yinni biladi» — o'yin `GET /oyinlar` da yaratiladi; hech kim ochmasa xabar ham yo'q | **Qisman** | **Haq — eng katta topilma.** B varianti (halol toraytirish) qabul: asosiy fikr, ip, 2-ekran joriy qatori «Yangi o'yin kimdir ilovani ochganda yaratiladi: hech kim ochmasa, xabar ham ketmaydi.» (85), A-4 halol gaplar, 2-amaliyot `QIzoh`, yakun recap, kartochka 2, 1-ekran O'qituvchi eslatmasi. Gap endi o'yinchining **o'z** ilovasi yopiqligi haqida. **A varianti (vaqt bo'yicha yaratish) — Rad:** tayanch 1.4 Mentor qarori — bepul Backend uxlaydi, vaqtga bog'langan ish ishonchsiz; buning uchun tashqi rejalashtiruvchi xizmat kerak — kursda yo'q. Xohlasangiz — alohida qaror. |
| 2 | 2-ekran sahnasi noto'g'ri tasavvur beradi | **Qabul** | Sahnada konvert yorlig'i «kimdir ilovani ochdi» bor edi; endi joriy qator va xulosa shuni aniq aytadi (1-band). |
| 3 | Pro tugagan tashkilotchining o'yini haqida xabar ketishi | **Qabul** | MD dagi eski gap (REPO 2, Shubhali 10: «08-done da Pro tugagan o'yin yaratiladi — 12-dars topilmasi») 9.26 dan oldingi edi. Endi: Pro tugagan tashkilotchining keyingi o'yini 5-darsdan yaratilmaydi — xabar ham yo'q (⛔ 7-dars pilotida ilovada tekshiriladi); 12-dars topilmasi — takror yaratilish (M-q4 A). |
| 4 | 35 qurilmadan 5 odam ajratilgandek ko'rinadi | **Qabul** | 0-ekran: hisoblagich yorlig'i «12-Modul sanog'i · qurilma, ismsiz», ro'yxat yorlig'i «Mentor so'ragan tanishlar · odam»; Mentor: «Mentor ilovani ochmay qo'ygan beshta tanishidan sababini so'radi …» (98); ✎: Mentor ularni sanoqdan emas, o'zi tanigani uchun bilgan; KOD 4. |
| 5 | Hookdagi «Aynan!» / «Qiziq fikr!» | **Rad** | T-028, T-067; 01-FILTR 11. |
| 6 | Reja Mentori — «Nega ketishadi — ko'rdingiz» kuchli | **Qabul** | «Besh javobda bitta sabab ko'proq uchradi — bugun shunga bitta mexanika qurasiz, namuna «Yordam»da turadi.» (105); ✎, TS 25. |
| 7 | Bir martalik kod Database'da ochiq — hash bo'lsin | **Qisman** | Hash — Rad: 10 daqiqa va bir marta ishlaydigan kod uchun kurs talabini murakkablashtiradi (auditor ham «kamida» variantini bergan). Qabul: kod logga yozilmaydi (talab, tayanch 9.39). |
| 8 | Kod generatori — kriptografik | **Qabul** | Talab: «`crypto` bilan tasodifiy — `Math.random` emas» (o'quvchi talabi va Yordam). |
| 9 | `update_id` takrori — xotirada emas, Database'da | **Qabul** | «`update_id` ni Database'da noyob qilib eslab qol (Backend qayta ishga tushsa ham)» — ikkala talab, tayanch 9.39. |
| 10 | Kodni «ishlatish» bir vaqtdagi ikki so'rovda ham bir marta | **Qabul** | «kodni tekshirish, chat raqamini yozish va kodni o'chirish — bitta Database ishida (bir vaqtdagi ikki so'rovdan faqat bittasi ulaydi)». |
| 11 | «Bitta token ikki joyda ishlamaydi» — texnik noto'g'ri | **Qabul** | 1-qadam: «botning webhook manzili bitta — ikki Backend bitta botning so'rovlarini birga ololmaydi; shuning uchun yangi bot». A-3 dagi 7-Modul iqtibosi — tarix sifatida qoldi. |
| 12 | Yangi bot | Allaqachon | 9.39. |
| 13 | `setWebhook` xato bersa Backend yiqilmasin | **Qabul** | «O'rnatish xato bersa — Backend ishlashda davom etsin, xato logga yozilsin (token va kalitsiz)» — ikkala talab, 9.39. |
| 14 | `RENDER_EXTERNAL_URL` — pilot | Allaqachon | Shubhali 3 ⛔. |
| 15 | «Javobni kechiktirmasin» — xabar yo'qolishi mumkin | **Qabul** | «So'rov javobi xabarlar yuborilgach qaytsin» (bepul Backend javobdan keyin uxlab qolsa, xabar yo'qolmasin); ✎, Shubhali 7, REPO 2. |
| 16 | `telegram_xabarlar` yozuvi qachon yaratiladi | **Qabul** | Tartib: chegara sanog'i va yozuv — bitta Database ishida → faqat yozuv qo'shilgan bo'lsa yuboriladi → Telegram xato bersa yozuv o'chiriladi (chegara behuda ketmaydi). |
| 17 | UNIQUE yuborishdan oldin band qilinsin | **Qabul** | 16-band bilan bir. |
| 18 | Haftalik chegara bir vaqtdagi so'rovlarda ham | **Qabul** | «bir vaqtdagi ikki so'rov ham chegaradan oshirmasin» — sanoq va yozuv bitta Database ishida. |
| 19 | Hafta — qaysi vaqt bo'yicha | **Qabul** | Talabda `Asia/Tashkent` (tayanch 9.40 da bor edi; 4, 10-darslar bilan bir); Shubhali 6 yopildi. |
| 20 | «Sekundiga bittadan» — kurs qoidasi | Allaqachon | Faqat agent talabida turibdi; o'quvchiga Telegram'ning umumiy qoidasi sifatida o'rgatilmaydi. |
| 21 | Botni to'xtatgan odam — qaror kerak | **Qabul** | «Telegram qabul qilmasa — o'sha yozuvni o'chir, chat raqamiga tegma, keyingisiga o't» (keyingi o'yinda yana urinadi). Telegram aniq nima qaytarishi — Shubhali 5 ⛔. |
| 22 | O'zgarish foydalanuvchidan harakat kutadimi | **Qabul** | 2-amaliyot «Ochish»: «U foydalanuvchidan biror harakat kutadimi (masalan, qo'shilish)? Harakat kutmasa — Telegram xabari shart emas.» |
| 23 | «So'ramagan bo'lsangiz — taxmin» | Allaqachon | — |
| 24 | Uchta sun'iy o'yin — alohida skript bo'lsin | **Rad** | 12-Modul naqshi (9.35 a, 9.39 b): agent `namuna = true` yozuvlarni tayyorlaydi, ro'yxatni ko'rsatadi, «Davom et» dan keyin `id` bo'yicha o'chiradi — auditor 25-bandda shu yo'lni qabul qilgan. Repo'ga yangi skript fayli kerak emas. |
| 25 | Ro'yxat → «Davom et» → o'chirish | Allaqachon | — |
| 26 | Sherik Telegram'i o'quvchining haqiqiy hisobiga ulanmasin | **Qabul** | Telegram'i yo'q o'quvchi: agent `namuna = true` tekshiruv hisobini ochadi, sherik «Start»ni o'z Telegram'ida bosadi; 3-amaliyot oxirida ulanish va tekshiruv hisobi `id` bo'yicha o'chiriladi. 1-qadam, A-9, 1-ekran O'qituvchi eslatmasi, TS 23, tayanch 9.40. |
| 27 | TS 23 — joriy variant RAD | **Qabul** | 26-band. |
| 28 | Bir bosishda o'chirish | Allaqachon | — |
| 29 | O'chirish nimani o'chiradi — xabar yozuvlari qoladi | **Qabul** | Siyosat qatori: «… chat raqami o'chiriladi; qaysi o'yin haqida xabar yuborilgani yozuvi hisobingiz o'chirilguncha qoladi.» |
| 30 | «Qancha saqlanadi?» ga ham | **Qabul** | Prompt: «Qaysi ma'lumot?», «Nima uchun?» va «Qancha saqlanadi?» javoblariga (o'quvchi va Yordam), TS 14. |
| 31 | Hisob o'chirilganda xabar yozuvlari ham | Allaqachon | — |
| 32 | `telegramdan-ochdi` — qaytardi demaydi | Allaqachon | — |
| 33 | Qo'lda ochilgan havola sanoqni ifloslaydi | Allaqachon | 3-amaliyot (3): tekshiruv yozuvi `id` bo'yicha o'chiriladi. |
| 34 | «Bitta ochilishga bitta» qanday | **Qabul** | «sahifa yuklanganda bir marta, qayta chizilganda emas» — ikkala talab. |
| 35 | `ochdi` + `telegramdan-ochdi` | Allaqachon | — |
| 36 | 2-savol B yagona emas (chegara, to'xtatilgan bot) | **Qabul** | Savol shartsiz: «Mentor misolida Telegram xabari kelishi uchun telefonda ilova turishi shartmi?» (10 so'z) · ✔ B «Yo'q — xabarni Telegram'dagi bot yozadi» · A, C «Ha — …», D «Yo'q — … SMS» — [40, 39, 42, 38], ±15% OK, ✔ eng uzun emas · xato izohlari, ✎, `Q_LABELS` «2 — Ilova shartmi», Shubhali 15, TS 26. ✔ o'rni B qoldi. |
| 37 | 1-savol | Allaqachon | — |
| 38 | «Start» yozuvi tilga qarab boshqacha | **Qabul** | 1-amaliyot 4-qadam (1): «(tugma nomi Telegram tilingizga qarab boshqacha bo'lishi mumkin)». |
| 39 | «Bot birinchi yozolmaydi» — shaxsiy chat | Allaqachon | — |
| 40 | Maxfiy kalit sarlavhasi — yo'q yoki mos emas → `401` | Allaqachon | «teng bo'lmasa — `401`» ikkalasini qamraydi. |
| 41 | `git grep` — to'liq isbot emas | Allaqachon | O'qituvchi bilsa yetadi; o'quvchi matnida «isbot» deyilmaydi. |
| 42 | «Chat raqami hech qayerda ko'rinmaydi» — Database'da bor | Allaqachon | Tepadagi chegara qatori: «maketda, sahnada, promptda, saqlash kalitida, logda, skrinshotda; Database'da faqat chat raqami». |
| 43 | `telegram: boolean` | Allaqachon | — |
| 44 | Xabardagi son eskiradi — olib tashlansin | **Qabul** | «Shanba, 18:00 o'yini yana e'lon qilindi · Mahalla maydoni» — son yo'q, joriy son havolada. A-4, 2, 5-ekran, 2-amaliyot (namuna, Yordam, kutilgan natija), KOD `TG_XABAR`, TS 1, Shubhali 1, tayanch 1.8, 9.38. |
| 45 | O'quvchi xabarida ham o'zgaruvchan son bo'lmasin | **Qabul** | 2-amaliyot «Ochish»: «tez o'zgaradigan son (masalan, qo'shilganlar) yozilmaydi — u havolada ko'rinadi»; 5-ekran `QIzoh`: «kun, soat, joy». |
| 46 | Telegram sanog'ini Backend yuritadi | Allaqachon | — |
| 47 | Ikki kanal — haftasiga jami 4 ta | **Rad** | Tayanch 9.40 (M-q0 A bilan tasdiqlangan): chegara faqat Telegram xabarlari uchun. Ilova eslatmalari telefonda qo'yiladi — Backend ularni bilmaydi; 12-Modul 9.41 b ham faqat ilova eslatmalari haqida. Maqsad ham boshqa: o'yin eslatmasi — o'zi qo'shilgan o'yin, Telegram — yangi e'lon. Umumiy chegara kerak desangiz — alohida qaror. |
| 48 | Umumiy chegara — tavsiya | **Rad** | 47-band. |
| 49 | Siyosatda Telegram sozlamasi | Allaqachon | Blocker emas. |
| 50 | «Weekly Two», «Easy Off» faqat to'g'ri natijada | **Rad** | M-q6 A naqshi — nishon ish uchun, natijadan qat'i nazar; nomlar qoida va tugma nomi, natija da'vosi emas («Terms Live!» dan farqi), tavsiflari «tekshirdingiz». |
| 51 | «Bajardim» — natija emas; yakun kuzatilgan natijadan | **Qabul** | Har blok 4-qadamida tekshiruv kartasi «Kutilganidek» · «Boshqacha» (3, 10-darslardagidek; dars holatida); yashil qator faqat «Kutilganidek» da, aks holda kulrang «Talabdagidek bo'lmagan joyni agentga yozing va qayta tekshiring.» (64). Yakun — besh holat, yangi: «Telegram xabari qurildi — bitta joyni tuzatish qoldi.» (53); «ishlaydi» — faqat «Kutilganidek» da. KOD 8, 10, TS 21. |
| 52 | APK yasash bu darsga ortiqcha | **Qabul** | Haq — va bu **M-q5 A** ga ham zid edi. `eas build`, «Havola almashtirildi / Fayl navbatda» tugmalari, yakundagi yorliq olib tashlandi; `QIzoh`: «APK o'zi yangilanmaydi: o'rnatilgan faylda Telegram tugmasi yo'q — bugun Expo Go va brauzerda tekshirasiz.» (106); A-10, 1-ekran eslatmasi, Ulgurmasangiz, ✎, KOD, REPO 5. Brauzer ko'rinishini yangilash qoldi (M-q5 A ruxsat bergan). |
| 53 | 90 daqiqa — 150–200 | **Qisman** | O'lchanmagan baho — Shubhali 12 ga yozildi; APK olib tashlandi. Botni darsdan oldin ochib kelish — sizning qaroringiz. ⛔ pilotda taymer. |
| Sarl. | Sarlavhalar | Allaqachon | Auditor tasdiqladi. |
| TS | TAYANCHGA SAVOL 1–26 | — | 1 — Qabul B (44) · 2 — Qabul (4) · 4 — Qabul (11) · 5 — Qisman (7, 8) · 6 — Qabul (13) · 7 — Qabul (9) · 11 — Rad (47) · 13, 14 — Qabul (29, 30) · 18 — Rad (24) · 20 — Rad (50) · 21 — Qabul (51) · 23 — Qabul (26) · 26 — Qabul (36) · qolganlari — auditor qabul qildi. |
| TS+ | Auditorning yangi savollari 27–36 | Javob berildi | 27 → hech nima: o'yin kimdir ochganda yaratiladi; hech kim ochmasa — o'yin ham, xabar ham yo'q (darsda halol aytiladi) · 28 → yo'q (1.4) — qaror sizda · 29 → Database'da, noyob · 30 → ochiq, 10 daqiqa, bir marta, logsiz; `crypto` · 31 → avval yozuv (noyob), faqat qo'shilgan bo'lsa yuboriladi · 32 → ha, `Asia/Tashkent` · 33 → umumiy yo'q, kanal bo'yicha (9.40) — qaror sizda · 34 → sanoq + yozuv → yuborish → xatoda yozuv o'chadi · 35 → hisob o'chirilguncha · 36 → ha, faqat `namuna = true`. |

## Sinf-supurish (12 MD + tayanch)
- **M-q5 A ga zid APK yasash** — 4, 5, 7-darslarda 0; 10, 12 da bor (ruxsat etilgan).
- **Yakun natijani faqat «Bajardim» dan da'vo qiladi** — 3 va 10-darslarda «Kutilganidek / Boshqacha» bor edi, 5-darsda `pm-m11d5-buzish`, 7-darsda «Ochildi / Ochilmadi», 12-darsda belgi; faqat 8 da yo'q edi — tuzatildi.
- **Telegram xabarida eskiradigan son** — 12-dars yozuvida son yo'q; boshqa darslarda 0.
- **Sherik ma'lumotini o'quvchining haqiqiy hisobiga bog'lash** — boshqa darslarda 0 (12-darsda sherik — o'z hisobidan, o'z telefonida).
- **Javobdan keyin yuboriladigan ish (yo'qolishi mumkin)** — boshqa darslarda 0.

## Tekshiruv
- `lint:til`: 08 — 0 error, 5 warn (zaxirada 3; yangi 2 ta — agent talabidagi buyruq shakli «yubor», «o'chir», T-002 istisnosi) · tayanch — 0 error, 25 warn (o'zgarmagan).
- `qisqa.py`: 08 — 12 ekran, sarlavha >55 yo'q (arena ✔ harfsiz — o'zgarmadi, A·B·C·D ×3).
- Python `len`: joriy qator 85 · `QIzoh` 87 / 106 / 97 · Mentor 98 / 105 · yakun 53 · 2-savol [40, 39, 42, 38], 10 so'z · xato izohlari 55, 55 — O'lchov bo'limida yangilandi. ✔ o'rinlari o'zgarmadi.
