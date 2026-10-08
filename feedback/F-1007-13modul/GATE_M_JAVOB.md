# 13-Modul — foydalanuvchi qarorlari (agentlar uchun MAJBURIY)

## Qaror-0 · 07.10.2026 14:00 (sahifa `qaror-0.json`, kod `13M-QAROR-0`; F-1007-450; javob: 24 savolning hammasi A — tavsiya bo'yicha)

Javob qatori (so'zma-so'z): «GATE M 13M-QAROR-0 · Darslar: MANBA ✓ · Savollar: IP-q0 A · IP-q1 A · IP-q2 A · REPO-q0 A · TOLOV-q0 A · TOLOV-q1 A · WH-q0 A · WH-q1 A · PW-q0 A · PW-q1 A · SU-q0 A · SU-q1 A · HJ-q0 A · RET-q0 A · REF-q0 A · REF-q1 A · DARS-q0 A · DARS-q1 A · DARS-q2 A · DARS-q3 A · KEYS-q0 A · ATAMA-q0 A · ATAMA-q1 A · NOM-q0 A»
Manba faktlari — `00-MANBA.md` 5-bo'lim (rasmiy hujjat, 07.10.2026). Bu qarorlar tayanch va MD larda **aynan** shunday; o'zgartirish — faqat foydalanuvchi bilan.

1. **Pul modeli (IP-q0 A):** freemium — o'yinchilar uchun hamma narsa bepul (bugungi ilova o'zgarmaydi); **tashkilotchi** uchun oylik pullik obuna **«Pro»**, bitta qulaylik — **«Doimiy o'yin»** (har hafta shu kun va soatda o'yin o'zi e'lon qilinadi).
   «Maydon pulini bo'lishish» (tranzaksiya modeli) — 2-darsda solishtirish uchun qoladi, roadmap'da «uzoqroq» (11-Modul tayanchi 1.5). Ip K2 Telegram Premium naqshiga mos: bepul qism qisqartirilmaydi, Pro ustiga qulaylik qo'shadi.
2. **Har darsga bitta qator (IP-q1 A):** 1 · Mentor misolida bitta foydalanuvchi qanchaga tushadi va qancha pul olib keladi — o'quvchi o'z mahsuloti uchun hisoblaydi · 2 · beshta model «Maydon Jamoa»ga qo'yib ko'riladi, Mentor «Pro»ni tanlaydi (K2) ·
   3 · to'lov xabari Backend'ga qanday keladi: imzo, takror xabar, rad etilgan to'lov — test rejimda · 4 · xarajat, raqobat (Telegram guruhi bepul), qiymat → narx; «Doimiy o'yin» bosilganda to'lov taklifi ekrani → brauzerda test to'lov → Pro yoqiladi ·
   5 · loyiha kuni: to'lov oqimi to'liq va «to'lovni buzamiz» (ikki marta kelgan xabar, uxlagan Backend, rad etilgan to'lov, soxta imzo) · 6 · skript va Mentor bilan rol o'yini → narx bo'yicha 3 real suhbat ·
   7 · Pro shartlari (oferta shabloni) va maxfiylik siyosatiga to'lov bandi lendingda · 8 · nega ketishadi → bitta yangi qaytarish mexanikasi (Telegram bot xabari) · 9 · kamida 3 tashkilotchidan yozma tasdiq — real to'lov emas; Mentor tekshiruvi ·
   10 · har foydalanuvchiga taklif havolasi (12-Modul «Havolani ulashish» davomi), sanoq, mukofot, suiiste'molga qarshi qoida · 11 · roadmap bilan solishtirish va shaxsiy hisobot · 12 · barqarorlashtirish: asosiy yo'llar tekshiriladi, topilgani tuzatiladi, yangi funksiya qo'shilmaydi · 13 · zaxira.
   Har qator tayanchda aniq so'z va son bilan to'ldiriladi.
3. **Yangi Mentor sonlari (IP-q2 A):** tashkilotchilar soni, narx taxmini, 3 suhbat va 3 tasdiq natijasi, referal natijasi — tayanchda **bitta jadvalda**; 12-Modul tayanchi 1.13 sonlariga zid emas (44 kishi ichidan);
   yorliq «Mentor misoli» / «Mentorning taxmini»; GATE M da foydalanuvchi tasdiqlaydi. Boshqa son to'qilmaydi.
4. **Repo (REPO-q0 A):** `maydon-jamoa` davomi; `m13-dars-01-start` = `m12-dars-10-done`; teglar `m13-dars-NN-start` / `m13-dars-NN-done` (`yechim` tarmog'ida); to'lov qismi `backend/` ichida yangi bo'lim, Pro holati — `oyinchilar` da muddat.
   O'quvchi o'z final repo'sida, o'z mahsuloti va trekida; «Ortda qoldingizmi» — o'z repo'sidan tashqarida, yangi papkada (12-Modul qoidasi). Repo'ga faqat «qur» da, buyruq bilan.
5. **To'lov test muhiti (TOLOV-q0 A):** har o'quvchi o'z repo'sida agent bilan **«mashq to'lov»** bo'lagini quradi — test to'lov sahifasi va o'z Backend manziliga imzoli to'lov xabari; buzish tugmalari: ikki marta yuborish, rad, kechiktirish, noto'g'ri imzo.
   Yuridik shaxs, umumiy server, umumiy kalit kerak emas. Darsda halol gap: «haqiqiy xizmatda bu sahifa va xabar boshqa kompaniya serveridan keladi». Payme va Click — maketda, nomi o'z rangida, rasmiy protokol bilan ko'prik; ularning ko'rinishi va nomi «mashq to'lov» da taqlid qilinmaydi.
   Sabab (rasmiy, 07.10): Stripe ro'yxatida O'zbekiston yo'q; Payme/Click test kaliti — yuridik shaxs yoki YaTT kassasida, Payme kassasida bitta Endpoint URL.
6. **Halollik chegarasi (TOLOV-q1 A):** real to'lov yo'q, faqat test rejim; karta ma'lumoti hech qayerda yozilmaydi va ko'rsatilmaydi; maxfiy kalit faqat `.env` da;
   darsda bir gap: «real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan; bu kursda emas» (Fuqarolik kodeksi 27-modda).
7. **Webhook shakli (WH-q0 A):** 3-darsda «mashq to'lov» xabari — bitta `POST /tolov/webhook` (to'lov raqami · holat: to'landi / rad etildi · summa · imzo sarlavhasi); uch g'oya: imzo tekshiruvi · bitta to'lov raqami bir marta hisoblanadi (takror xabar) · rad etilgan to'lov.
   Kod oynasida takror xabar tekshiruvi; ikki repo bloki (NestJS endpoint va `tolovlar` jadvali). Payme («javob yo'qolsa so'rovni takrorlaydi») va Stripe («bir xabar ikki marta kelishi mumkin», imzo) — rasmiy iqtibos bilan ko'prik.
8. **Uxlagan Backend (WH-q1 A):** Render bepul xizmati qoladi; «uxlagan Backend» — 5-darsning buzish usullaridan biri: birinchi xabar javobsiz qoladi, qayta yuborilgani ikki marta yozilmasligi tekshiriladi. Uyg'oq tutish (ping) yo'q.
9. **Mobil trekda to'lov yo'li (PW-q0 A):** ilovada «Doimiy o'yin» bosilganda **to'lov taklifi ekrani** (nima ochiladi, narx, «To'lovga o'tish») → telefon brauzerida test to'lov sahifasi → to'lov xabari → Backend Pro muddatini yozadi → ilova `GET /men` dan Pro holatini o'qiydi.
   Karta ma'lumoti ilovaga ham, Backend'ga ham kirmaydi. Web-trekda — xuddi shu yo'l sayt ichida. Do'kon to'lov qoidalari haqidagi gap — tayanchda rasmiy havola bilan.
10. **Narx (PW-q1 A):** Mentorning narx taxmini (so'mda) tayanchda 4-darsdagi uch usul bilan chiqariladi — xarajat (bugun bepul xizmatlar; pullik tarif narxi rasmiy sahifadan, sana bilan) · raqobat (Telegram guruhi bepul) · qiymat (tashkilotchining vaqti);
    yorliq «Mentorning taxmini»; GATE M da tasdiqlanadi; 6-dars suhbatlarida tekshiriladi.
11. **6-dars suhbatlari (SU-q0 A):** o'z auditoriyasidagi tanish odamlar — 11-Modulda intervyu bergan odamlar, sinfdosh, ota-ona, mahalla guruhidagi tanish (guruh egasining ruxsati bilan); avval Mentor bilan rol o'yini; Mentor misolida — tashkilotchilar.
    Suhbat — sotish emas, savol: «hozir bu ish uchun nimaga vaqt yoki pul sarflaysiz?», keyin narx aytiladi, javob so'zma-so'z yoziladi; «yo'q» ham natija. 12-Modul xavfsizlik ro'yxati (6 band) kuchda.
12. **9-dars tasdig'i (SU-q1 A):** yozma javob (chat xabari yoki qog'oz: «narx X bo'lsa, … uchun to'layman») + o'quvchi yozuvi: rol (ism emas), narx, sana, so'zma-so'z gap; real pul, oldindan to'lov va karta — yo'q;
    3 ga yetmasa — halol natija va keyingi qadam, baho emas; bosim bilan olingan tasdiq — Mentor tekshiruvida «tuzatish».
13. **7-dars hujjatlari (HJ-q0 A):** `lending/oferta.html` — Pro shartlari: nima beriladi, narx, muddat, qanday bekor qilinadi, pul qaytarilishi, aloqa; tepada «Mashq hujjati — real to'lov qabul qilinmaydi»;
    «sotuvchi» qatori bo'sh: «[real ishga tushirishda — yuridik shaxs yoki YaTT]»; «Bu hujjat yuridik maslahat emas». Maxfiylik siyosatiga to'lov bandi: karta ma'lumotini mahsulot saqlamaydi; saqlanadi — to'lov raqami, summa, sana, Pro muddati.
    Ikkalasiga havola — lendingda va to'lov taklifi ekranida. Ommaviy oferta ta'rifi — Fuqarolik kodeksi 369-modda (bir gap, manba bilan).
14. **8-dars mexanikasi (RET-q0 A):** **Telegram bot orqali xabar** — foydalanuvchi o'zi ulaydi (ilovada «Telegram'da xabar olish» → botda /start bir martalik kod bilan); Backend ilova yopiq bo'lsa ham uning o'yini haqida yozadi;
    o'chirish bir bosish; «haftasiga ko'pi bilan ikkita» qoidasi davom etadi; Telegram chat raqami — maxfiylik siyosatiga qator; Telegram yosh chegarasi aytilmaydi; mobil va web-trek teng. «Bot avval /start bosgan odamga yozadi» — tayanchda Bot API hujjatidan tekshiriladi.
15. **Referal mukofoti (REF-q0 A):** «Pro»ning bepul haftasi (pul ham, chegirma ham emas; test rejimdagi obuna muddati) — taklif qilingan odam yangi hisob ochib, asosiy harakatni qilgandan keyin.
16. **Suiiste'molga qarshi qoida (REF-q1 A):** mukofot — yangi hisob + asosiy harakat; o'zini taklif qilish (bir qurilma) va namuna akkauntlar sanalmaydi; haftasiga mukofotlar soni cheklangan. Sanoq — 12-Modul hodisalar tizimida. Havola faqat tanish doiraga; «do'stingni taklif qil — sovg'a» bosimi yo'q.
17. **1-dars hisobi (DARS-q0 A):** Mentor: jalb qilish narxi pulda **0 so'm** (halol) va nega doim shunday qolmasligi + «agar pullik kanal bo'lsa» mashq hisobi; foydalanuvchi keltiradigan pul — narx taxmini × oylar taxmini, «Mentorning taxmini» yorlig'i bilan;
    ilovani ochish foizi (43%) obunani davom ettirish bilan bir xil o'lchov emas — halol gap; o'quvchi o'z sonlari bilan.
18. **11-dars (DARS-q1 A):** 12 ekran (12-Modul 11-dars shakli): roadmap (`pm-m9d6-roadmap`) dagi har ish — bajarildi · kechikdi · olib tashlandi · yangi qo'shildi + sabab; shaxsiy hisobot — uch savol
    (o'z qarorim bilan nima qildim · qaysi qarorim noto'g'ri chiqdi va qaysi dalil ko'rsatdi · keyingi 4 haftada nima qilaman).
19. **12-dars (DARS-q2 A):** asosiy yo'llar bo'yicha 5 tekshiruv — kirish va ro'yxat · asosiy harakat · to'lov oqimi (muvaffaqiyatli, rad, takror) · taklif havolasi · eslatma yoki xabar; har biri 12-Modul buzish yozuvi bilan (nima qildim · kutdim · bo'ldi);
    topilganlar — `XATOLAR.md`, eng muhim 1–2 tasi tuzatiladi va qayta tekshiriladi; yangi funksiya qo'shilmaydi; 14-Modulning demo-testi va performance darslari takrorlanmaydi.
20. **13-dars (DARS-q3 A):** `comp` siz qator «Zaxira dars», osti «yetib olish / sayqallash» (10-Modul `m8-13` naqshi).
21. **Keyslar (KEYS-q0 A):** 2 — **K2 Telegram Premium** · 11 — **K17 Tesla** · 1, 4, 6, 9 — keyssiz · TEX (3) va loyiha kunlari (5, 8, 10, 12) — keyssiz. Bank so'zi aynan (PM-016).
22. **Atamalar (ATAMA-q0 A):** o'zbekcha ibora asosiy (MATN_KORPUS §20, 12-Modul naqshi), inglizcha nomi kartochkada bir marta; webhook va oferta — o'z nomi bilan. Nomlar (tayanchda aniqlanadi, GATE M da tasdiqlanadi):
    CAC → «jalb qilish narxi» · LTV → «foydalanuvchi keltiradigan pul» · paywall → «to'lov taklifi ekrani» · freemium → «bepul asos va pullik qo'shimcha» · referal → «taklif havolasi» · sandbox → «test rejim» · idempotentlik → «takror xabar».
23. **«Obuna» (ATAMA-q1 A):** pul ma'nosida doim **«pullik obuna»** (kanal obunasidan ajraladi, T-015).
24. **Nomlar va App.jsx (NOM-q0 A):** `00-NOMLAR.md` tasdiq; App.jsx ga `// ---- 11-Modul` izohi va `id: '11'` bloki — 13 qator, `comp` siz.

## GATE M · 13M-GATE-1 · 07.10.2026 (sahifa `gatem-1.json`; F-1007-458; javob: 12 dars ✓, 8 savolning hammasi A — tavsiya bo'yicha)

Javob qatori (so'zma-so'z): «GATE M 13M-GATE-1 · Darslar: T ✓ · 01 ✓ · 02 ✓ · 03 ✓ · 04 ✓ · 05 ✓ · 06 ✓ · 07 ✓ · 08 ✓ · 09 ✓ · 10 ✓ · 11 ✓ · 12 ✓ · Savollar: M-q0 A · M-q1 A · M-q2 A · M-q3 A · M-q4 A · M-q5 A · M-q6 A · M-q7 A»
Bu — matnni tasdiqlash; agent yuborishga va «qur» ga ruxsat emas. Keyingi qadam — har MD ChatGPT auditidan o'tadi (`NN-FILTR.md`).

25. **47 kelishuv (M-q0 A):** tayanch 9.1–9.47 tasdiqlandi — MD lar shunga yozilgan.
26. **Mentor sonlari (M-q1 A):** tayanch 1.13 jadvali tasdiqlandi (tashkilotchilar 6 · 10 000 → 15 000 so'm / 30 kun · 3 oy · «agar» 60 000 → 12 → 1 · Render ≈83 000 · ha / yo'q / qimmat · 5 javob · 6 dan 3 tasdiq · 18 → 7 → 4 → 3, jami 51 · 12-darsda 2 topilma). Boshqa son yo'q.
27. **«skript» → «suhbat savollari» (M-q2 A):** o'quvchi matnida «suhbat savollari»; kalit maydoni `skript` va `MENTOR_SKRIPT` — ichki. Qo'llandi (F-1007-458): 6-dars MD, 9-dars «Ishlatilmaydi», tayanch 1.6, 2, 4, 9.9, 9.15, 10 · TAQIQLAR 5.
28. **Mashq to'lov va real foydalanuvchilar (M-q3 A):** test rejimda Pro'ni mashq to'lov bilan istalgan hisob yoqa oladi; to'lov taklifi ekranida «Test rejim: pul yechilmaydi» (tayanch 9.27).
29. **12-dars 5-topilmasi (M-q4 A):** «ikki telefon bir vaqtda ochganda keyingi «Doimiy o'yin» ikki marta yaratildi» — Database cheklovi bilan tuzatiladi (tayanch 1.12, 9.26).
30. **APK (M-q5 A):** yangi o'rnatish fayli faqat 10 va 12-darsda (12-darsda — ilova o'zgargan bo'lsa); 4, 5, 7, 8-darslarda Expo Go yoki brauzer ko'rinishida tekshiriladi (tayanch 9.33, 9.45).
31. **«Webhook Tested» nishoni (M-q6 A):** uch tekshiruv o'tkazilgani uchun — natijadan qat'i nazar, ish qilingan ekranda.
32. **9-darsda tasdiq xabari (M-q7 A):** darsda faqat 6-darsdagi real suhbatdoshga yoki to'lovchi sinfdoshga, tanish doirada; qolgani uyda; darsda tasdiq 0 bo'lsa — yakun buni rost aytadi (tayanch 9.46).
