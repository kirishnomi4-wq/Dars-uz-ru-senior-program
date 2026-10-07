# 7-dars «Production deploy: domen, SSL, monitoring» — tashqi audit (ChatGPT) Filtr bilan, 05.10.2026

Audit bahosi 7.5/10 (pedagogika 9 · deploy/monitoring 8 · texnik aniqlik 7 · tashqi servis faktlari 6.5). Hukm: **Qabul 13 · Qisman 1 · Rad 3 · O'zgarishsiz 5**.
Tashqi faktlar qayta o'qildi (05.10): help.uptimerobot.com/en/articles/11604710 · render.com/docs/free · neon.com/pricing · docs.netlify.com (https-ssl, configure-external-dns).
Zaxira: scratchpad `07-oldin-filtr.md`, `05/06/08/09-oldin-07filtr.md`, `tayanch-oldin-07filtr.md`.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Production» va Render Free zid signal | **Qabul** | Tasdiqlandi: Render — «Do not use them for production applications». Kurs ta'rifi qoladi; 1-ekranda kulrang qator «Bepul rejalar uzluksiz ishlashni va'da qilmaydi: Render bepul xizmatni prod uchun tavsiya qilmaydi.»; kartochka izohi; O'qituvchi eslatmasi; tayanch 6. **O'zim topgan:** yakundagi «production darajasiga olib chiqasiz» → «prodga tayyorlaysiz» (8-dars menyu ostidagi «production darajasiga» — 8-dars auditida ko'riladi). |
| 2 | UptimeRobot Free «shaxsiy, notijorat» — noto'g'ri | **Qabul** | **Mening fakt xatom:** rasmiy yordam maqolasi (28.09.2026 yangilangan) — «can be used for business, commercial, and revenue-generating projects». A3 Mentori: «UptimeRobot'ning bepul rejasi «Maydon»ga yetadi.»; MD A-10 va tayanch 6 tuzatildi. Boshqa MD larda bu gap yo'q. |
| 3 | «Birinchi bo'lib sizga aytadi» — kafolat emas | **Qisman** | Matnda olindi: asosiy fikr «Monitoring saytni siz o'rningizga so'rab turadi va javob bo'lmasa sizga xabar beradi…», 1-ekran Mentori va yakun sarlavhasi «…ogohlantirish sizga keladi», 8-ekran O'qituvchi eslatmasi (navbatdagi so'rov, qayta so'rash). Menyu osti yozuvi (siz tasdiqlagan nom) — **GATE savoli 07-q0**. |
| 4 | `/health` — «Backend javob beryaptimi», sog'liq emas | **Qabul** | Ta'rif: «Backend javob berayotganini aytadigan yo'l… Database, band qilish va kirish ishlashini isbotlamaydi.» 7-ekran testi o'zgarmadi (auditor ham). |
| 5 | Neon 17-kun — aniq bashorat emas | **Qabul** | Tasdiqlandi: bepul compute 2 CU gacha kattalashadi. Kalendarda «soddalashtirilgan hisob» yorlig'i; joriy qator, natija («hisob bo'yicha: oy tugamasdan»), bashorat varianti; xulosa «monitoring bepul limitni sarflamaydi» («oy oxirigacha yetadi» kafolati olindi); O'qituvchi eslatmasi «aniq kunni va'da qilmang». |
| 6 | Render 750 soat — workspace bo'yicha umumiy | **Qabul** | 8-ekran `QIzoh`: «Narxi: so'rovlar bepul Backend'ni uyg'oq tutishi mumkin — Render'ning 750 soatlik umumiy limitidan sarflanadi.» (110); O'qituvchi eslatmasi; REPO README. |
| 7 | HTTPS: «faqat brauzer va sayt ochadi» — juda sodda | **Qabul** | «Yo'ldagi ma'lumot shifrlangan — tarmoqda kuzatayotgan odam mazmunini o'qiy olmaydi» (A-bo'lim, takrorlash 2, kartochka, yakun, tayanch 2). 5-ekran testi qoldi. |
| 8 | «SSL sertifikati» va TLS | **Qabul** | Faqat 4-ekran O'qituvchi eslatmasida; testga chiqmaydi. |
| 9 | Chrome «Connection is secure» — qabul sharti emas | **Qabul** | A1 4-qadam: «`https://` bilan ochilsin, brauzer ulanish xavfsiz ekanini ko'rsatsin, ogohlantirish bo'lmasin (Chrome'da masalan …)»; sertifikat nomini topish olib tashlandi; maket «namuna yozuv». |
| 11 | Tashqi interfeys yozuvlariga qattiq bog'lanmaslik | **Qabul** | Avval vazifa, keyin «hozir: …» — Netlify nomi, Render «Environment» / «Save and deploy», UptimeRobot «+ Add New Monitor». |
| 13 | Monitoring Render'ni uyg'oq tutadi — «yon ta'sir» emas, «narxi» | **Qabul** | 6-band bilan; README va tayanch 6 ham «bepul rejadagi narxi». |
| 14 | O'z domeni: DNS va sertifikat vaqt oladi | **Qabul** | Tasdiqlandi (Netlify: «several hours», «a full day»). Xulosa «… Bunga vaqt ketishi mumkin.»; maket yorlig'i «vaqt tezlashtirilgan»; O'qituvchi eslatmasi; kartochka; yakun. TAYANCHGA SAVOL 12 yopildi. |
| 15 | 10-ekran bashorati — «DNS yozuvidan keyin» yetarli emas | **Qabul** | «Domen Netlify'ga qo'shilgach, sayt HTTPS bilan shu zahoti ochiladimi?» · «Yo'q, avval DNS, keyin sertifikat»; natija qatori shu bilan. |
| 16 | A2 `git add .` — 5-dars odatiga zid | **Qabul** | A2: `git status` → `git add backend/src/app.controller.ts`. **Sinf-supurish:** 6, 8 (3 joy), 9-darslar → «`git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil; shularni `git add` bilan qo'shing»; 5-dars gapi `git add .` ni ham nomlaydi. 3, 4-darslar 5-darsdan oldin — 9-Modul odatida qoldi. Tayanch 9.17. |
| 17 | «Taxminan bir daqiqagacha» — o'quvchi matnidan olinsin | **Rad** | Modul bo'yi kelishuv (03-FILTR 10, 04-FILTR 12): manbali fakt, «kechikishi mumkin — … gacha» shakli muddat emas; 3, 4, 7, 9-darslar bir xil. |
| Sarl. 4 | «HTTPS yo'lda nimani yashiradi?» | **Rad** | T-011: atama harakatdan keyin tug'iladi — sarlavhada hali yo'q. Hozirgi savol olam ichida va aniq. |
| Sarl. 10 | «O'z domeningiz Netlify'ga qanday boradi?» | **Rad** | T-039: o'z domeni — Mentor misoli, o'quvchiniki qilinmaydi (pul to'lanmaydi). |
| 10 · 12 · hook · 4, 5, 7, 8-ekranlar · tayanch (50/5, `/yoq`, `maydon-mahalla.uz` maket) | — | **O'zgarishsiz** | Auditor tasdiqladi; o'quvchi o'z nomini allaqachon tanlaydi (`maydon-` + o'z so'zi). |

**Sinf-supurish:** «notijorat» — 11 MD: faqat 7 va tayanch. `git add .` — 6, 8, 9 tuzatildi. «oy o'rtasida tugaydi» — 7 (README), tayanch 3 va 6. «birinchi bo'lib siz bilasiz» — 6-dars yakuni menyu nomini so'zma-so'z keltiradi (DE-205) — 07-q0 javobiga qarab.
lint:til 05, 06, 07 — 0; 08, 09, tayanch — eski ogohlantirishlar (zaxira bilan bir xil), yangi topilma 0.
