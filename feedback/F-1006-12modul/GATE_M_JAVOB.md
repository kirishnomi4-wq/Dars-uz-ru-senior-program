# 12-Modul — foydalanuvchi qarorlari (agentlar uchun MAJBURIY)

## Qaror-0 · 06.10.2026 12:49 (sahifa `qaror-0.json`, kod `12M-QAROR-0`; javob: «Ha, hammasi A» — 25 savolning hammasi tavsiya bo'yicha)

Foydalanuvchi izohi (so'zma-so'z ma'nosi): «boshlang, aniq, shoshilmasdan MD larni yasang; yaxshi o'ylab, global qonunlarimizni ham o'ylab, sifatli tayyorlang.»
Manba faktlari — `00-MANBA.md` 5-bo'lim (rasmiy hujjat, 06.10.2026).

1. **Mentor misoli (IP-q0 A):** «Maydon Jamoa» davom etadi. Har darsga bitta qator: 1 lending · 2 WebSocket va real vaqt oqimi sxemasi · 3 real vaqt talabi → ekran o'zi yangilanadi ·
   4 «hozir ko'ryapti», jonli xabar, telefonga eslatma · 5 uchta muammo topiladi va tuzatiladi · 6 kanallar va birinchi post · 7 50 foydalanuvchiga reja va ishga tushirish, birinchi 20 foydalanuvchi ·
   8 qadamlar bo'yicha sanoq → gipoteza → shu darsda tuzatish · 9 foydalanuvchini qaytaradigan eslatma · 10 Mentor tekshiruvi va zaxira reja · 11 yakkama-yakka: tuzatilgan pitch · 12 metrikali pitch · 13 zaxira.
2. **Mentor misolining 10-darsdagi natijasi (IP-q1 A):** 50 ga **yetmaydi** — 7-darsda 20, 10-darsda 38; Mentor zaxira rejani o'z misolida ko'rsatadi. Aniq sonlar tayanchda, «Mentor misolida» deb.
3. **Repo (REPO-q0 A):** `maydon-jamoa` davomi, boshlanishi `m11-dars-15-done`; teglar `m12-dars-NN-start` / `m12-dars-NN-done` (`yechim` tarmog'ida); yangi papka `lending/`;
   o'quvchi o'z final repo'sida; «Ortda qoldingizmi» — Mentor misolini ochib ko'rish (11-Modul modeli). Repo'ga faqat «qur» da, buyruq bilan.
4. **Real vaqt steki (RT-q0 A):** NestJS gateway + socket.io. Darsda: WebSocket — doimiy ulanish (tushuncha), socket.io — uni ishlatadigan kutubxona (asbob).
5. **Hodisa → ma'lumot (RT-q1 A):** hodisa — qisqa signal («shu o'yin o'zgardi»); ekran yangi holatni `GET /oyinlar` dan qayta so'raydi. Bitta haqiqat manbai — Database.
6. **«Kim onlayn» (RT-q2 A):** faqat son — «O'yin» ekranida «Hozir ko'ryapti: 3»; ism ko'rsatilmaydi.
7. **Mobil trekda eslatma (ESL-q0 A):** **mahalliy eslatma** — o'yinchi qo'shilganda ilova o'yindan oldinga eslatma rejalashtiradi, chiqsa bekor qiladi; Expo Go'da ham, APK da ham.
   Masofadan push — darsda chizmada va bir gapda («Backend yuboradi; buning uchun alohida sozlash kerak»), **qurilmaydi**.
8. **9-dars mexanikasi (ESL-q1 A):** ikki qatlam, 4-dars asboblari bilan: ilova ochiq — jonli xabar; yopiq — mahalliy eslatma (ilova oxirgi ochilganda rejalashtirgan). Halol chegarasi aytiladi: yopiq ilovaga boshqa odamning hodisasi yetmaydi.
9. **Web-trekda eslatma (ESL-q2 A):** sahifa ichida jonli xabar tasmasi; brauzer push qurilmaydi (cheklov bir gapda halol aytiladi).
10. **Tarqatish (TARQ-q0 A):** Android — APK havolasi (EAS Build); iPhone'li foydalanuvchilar — o'sha ilovaning brauzer ko'rinishi (Expo web → Netlify). ⚠️ Brauzer ko'rinishi pilotda sinaladi; ishlamasa — B («faqat Android») ga qaytiladi va foydalanuvchiga aytiladi.
    Expo Go — faqat o'quvchining o'z telefoni va sinfdoshlar.
11. **EAS navbati (TARQ-q1 A):** build 6-dars uyga vazifasida boshlanadi; 7-darsga havola tayyor keladi; tayyor bo'lmasa — 7-dars rejadan boshlanadi. Mentor misolida tayyor havola bor.
12. **Kanallar (USER-q0 A):** faqat o'zi a'zo bo'lgan joylar va tanish doira: sinf va maktab chati, mahalla yoki to'garak guruhi (guruh egasidan ruxsat so'rab), do'stlar, o'z Instagram sahifasi (bor bo'lsa — yangi akkaunt talab qilinmaydi).
    Notanish odamga shaxsiy xabar yozilmaydi; postda familiya, maktab raqami, telefon va uy manzili yo'q; ota-ona xabardor; soxta akkaunt, bir xil xabarni ko'p guruhga tashlash, sotib olingan obunachi — yo'q; uchrashuv taklifi kelsa — faqat kattalar bilan.
    Mahsulot uchun alohida ochiq Telegram kanali **ochilmaydi**.
13. **Sanoq (USER-q1 A):** ikki son yonma-yon — «ro'yxatdan o'tgan» (50 maqsadi shu; namuna va test akkauntlarsiz) va «asosiy harakatni qilgan»; ikkalasi Database'dan SQL bilan; sinfdoshlar sanaladi, lekin alohida aytiladi.
14. **Ro'yxatdan o'tish (USER-q2 A):** telefon raqami **so'ralmaydi**. 7-darsning birinchi blokida ishga tushirishdan oldingi audit (10-Modul 6-dars naqshi): `telefon` → `login` (o'zi tanlagan nom) + parol; lendingda maxfiylik sahifasi; forma ostida ochiq gap.
    Mentor repo'sida 11-Modul jadvali 12-Modulda o'zgaradi (11-Modul fayllariga bu seans tegmaydi).
15. **Zaxira reja (USER-q3 A):** «zaxira reja» («antikrizis» ishlatilmaydi): qaysi qadamda odam kam · bitta sabab-gipoteza · bitta haftalik qadam. Mentor tekshiruvi javobi — «qabul» yoki «tuzatish»; 50 ga yetmaslik — baho emas.
16. **Analitika (ANAL-q0 A):** 10-Modul hodisalar tizimi davom etadi — 7-darsning birinchi blokida `hodisalar` jadvali va `hodisaYoz` «Maydon Jamoa»ga ko'chiriladi; qadamlar: ochdi → ro'yxatdan o'tdi → qo'shildi → kelishini tasdiqladi.
    Lendingda Umami (tashrif va tugma bosilishi) — ikkinchi manba. 10-darsda dashboard real vaqtda yangilanadi (polling o'rniga 2-dars ulanishi).
17. **Lending tugmasi (LEND-q0 A):** ⚠️ 06.10 15:35 matn o'zgardi (01-FILTR 2, F-1006-354): bo'lim matni endi «Hozircha o'rnatish havolasi yo'q.» — quyidagi asl qator tarix uchun qoladi. 1-darsda (mobil trek) — sahifaning «Qanday qo'shilaman» bo'limiga: «Ilova tayyorlanmoqda — o'rnatish havolasi shu yerda paydo bo'ladi»; shaxsiy ma'lumot yig'ilmaydi; bosilishi Umami bilan sanaladi.
    7-darsda tugma o'rnatish havolasiga almashtiriladi. Web-trekda tugma darhol saytga olib boradi.
18. **Lending qurilishi (LEND-q1 A):** matnni o'quvchi yozadi (sarlavha — kim uchun va nima foyda, uchta foyda, bitta tugma); kod ekrani — VS Code topshirig'i: o'z repo'sida `lending/`, talab bilan agent yig'adi, Netlify'ga darsda chiqadi; lending adaptiv.
19. **11-dars (DARS-q0 A):** 12 ekran, keyssiz, kod ekrani yo'q. O'quvchi 11-Modul pitchini ochadi va har da'vo yoniga dalil qo'yadi — son, manbasi (Database · hodisalar · Umami), qachon sanalgan; dalilsiz da'vo qayta yoziladi yoki olib tashlanadi.
    Natija — tuzatilgan pitch qoralamasi (12-dars o'qiydi). Roadmap holati va risklar takrorlanmaydi — bir ekranda eslatiladi.
20. **12-dars (DARS-q1 A):** 5 daqiqa, besh bo'lak: Muammo · Yechim · Jonli demo · **Raqamlar** · Keyingi qadam. «Raqamlar» — haftalar bo'yicha o'sish grafigi (o'z sonlaridan) va bitta halol gap; grafikni o'quvchi kod oynasida o'z sonlaridan chizadi.
21. **13-dars (DARS-q2 A):** `comp` siz qator, MD yo'q: «Zaxira dars», osti «taymer bilan to'liq repetitsiya».
22. **Keyslar (KEYS-q0 A):** 1 — K3 Instagram · 3 — keyssiz · 6 — K8 Facebook · 7 — keyssiz · 8 — K6 Netflix · 10 — K5 Duolingo · 11 — keyssiz · 12 — K1 Uzum (mintaqaviy). TEX va loyiha kunlari (2, 4, 5, 9) — keyssiz.
23. **Atamalar (ATAMA-q0 A):** jadval tayanch 2-bo'limiga shu holda kiradi (real vaqt · WebSocket — doimiy ulanish · hodisa · hozir ulanganlar · qayta ulanish · takror hodisa · chekka holat · jonli xabar · real vaqt talabi ·
    qadamlar · to'xtab qolish qadami · qaytganlar foizi · lending · asosiy tugma · kanal · Mentor tekshiruvi · zaxira reja · APK).
24. **Telefonga keladigan xabar (ATAMA-q1 A):** **«eslatma»**; «push» so'zi kursda faqat `git push`; kartochkada bir marta «inglizchasi: push notification».
25. **Nomlar va App.jsx (NOM-q0 A):** `00-NOMLAR.md` tasdiq; App.jsx ga `// ---- 10-Modul` izohi va `id: '10'` bloki — 13 qator, `comp` siz. **Qo'llandi 12:51** (ikki aniq Edit, esbuild ✓; boshqa bloklarga tegilmadi).

## GATE M · 06.10.2026 19:17 (sahifa `gatem-1.json`, kod `12M-GATE-2`, versiya 14; F-1006-367)

Javob qatori (so'zma-so'z): «GATE M 12M-GATE-2 · Darslar: 01 ✓ · 02 ✓ · 03 ✓ · 04 ✓ · 05 ✓ · 06 ✓ · 07 ✓ · 08 ✓ · 09 ✓ · 10 ✓ · 11 ✓ · 12 ✓ · Savollar: M-q0 A · M-q1 A · M-q2 A · M-q3 A · M-q4 A · M-q5 A · M-q6 A · M-q7 A · M-q8 A · M-q9 A · M-q10 A · M-q11 A»
**12 dars MD si tasdiqlandi** (ChatGPT auditi va Filtrdan keyingi holat — `01…12-FILTR.md`). Hamma savolda A — hozirgi MD lar shu variant bo'yicha yozilgan, **MD larda o'zgarish kerak emas**. ⚠️ GATE M tasdig'i — «qur» ga ruxsat emas: qurish alohida buyruq bilan.

1. **M-q0 A** — tayanch 9-bo'limidagi kelishuvlar (44 band, 9.33–9.44 auditdan keyin) — tasdiq.
2. **M-q1 A** — 5-dars, 3-buzish usuli: Render sahifasida qo'lda qayta chiqarish (tugma nomi «qur» da interfeysda tekshiriladi).
3. **M-q2 A** — 7-dars hajmi qoladi (iPhone brauzer ko'rinishi 7-darsda); vaqt pilotda taymer bilan.
4. **M-q3 A** — `menTashkilotchiman` 12-Modul 4-darsida qo'shiladi; 11-Modul seansiga bu bo'shliqni foydalanuvchi aytadi.
5. **M-q4 A** — 12-dars «Yechim» bo'lagi: yechim gapi + lendingdagi uch foyda (ChatGPT ning «1–2 foyda» varianti tanlanmadi).
6. **M-q5 A** — 2-dars nomi qoladi: «WebSocket: ekran o'zi yangilanadigan ulanish».
7. **M-q6 A** — Qaror-0 8 so'zi natija tilida: «yopiq ilovada boshqa odamning o'zgarishi jonli xabar bo'lib ko'rinmaydi» (Qaror-0 8 ning asl so'zi «yetmaydi» — tarix uchun yuqorida).
8. **M-q7 A** — navbatdan o'yinga o'tgan odamga eslatma qo'yilmasligi — birinchi versiya cheklovi, o'quvchiga ochiq aytiladi.
9. **M-q8 A** — 6-dars: sinf chatiga — Mentorga ko'rsatib, ota-ona bandisiz; sinfdan tashqaridagi har kanalga — ota-onaga ko'rsatgandan keyin.
10. **M-q9 A** — 9-dars: o'yin kuni 9:00 eslatmasi olib tashlangani tasdiqlandi — bitta eslatma (uch kunlik).
11. **M-q10 A** — «haftasiga ko'pi bilan ikkita»: hamma eslatma sanaladi; o'yin eslatmasi har doim qo'yiladi; hafta ikkitaga to'lsa, ilova o'zidan qo'shmaydi.
12. **M-q11 A** — 9-dars pilotda 90 daqiqaga sig'masa: haftalik chegara o'quvchi amaliyotidan chiqariladi, Mentor namunasida qoladi (pilotdan keyin qo'llanadi — hozir MD o'zgarmaydi).
