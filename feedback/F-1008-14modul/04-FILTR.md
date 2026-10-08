# 4-dars «Loyiha kuni: demo uchun sayqal» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026 (F-1008-562)

Filtr tartibi — `01-FILTR.md` dagidek. Zaxira: scratchpad `zaxira-04/`. Skript: scratchpad `f04_tuzat.py` (91 juftlik + «Backend kodiga tegma» ×7, har biri faylda aynan bir marta — skript tekshirgan).
Audit bahosi 6,5/10 (pedagogika 9 · UX 8,5 · reduced-motion 7 · tekshiruv halolligi 6 · test-data 5,5 · deploy 4 · 90 daqiqa 4). Hukm: **Qabul 22 · Qisman 5 · Rad 3 · Allaqachon 11** (39 band + sarlavha + 24 TS + 9 shart; takrorlar birlashtirildi).
⚠️ **Auditor eski nusxani ko'rgan:** 1-band (push → tekshirish) 03-FILTR 19 supurishida qisman tuzatilgan edi (lokal ishga tushirish push'dan oldinga); lekin haqiqiy tekshiruv (Slow 4G, ikki marta bosish) hali push'dan keyin edi — endi push har blokning 4-qadami oxirida.
⚠️ **Tasdiqlangan matnni o'zgartiradigan Qabul (foydalanuvchiga alohida):** tayanch 1.4 «`prefers-reduced-motion` — animatsiya o'chadi, holat qoladi» → «bu demo yo'lidagi ortiqcha harakat o'chadi, holat qoladi (umumiy qoida emas); kutish belgisi harakatsiz qolmaydi — yashiriladi» (3, 4-bandlar).

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Uchala blokda push → tekshirish; tekshirish → push bo'lsin | **Qabul** | Uch blokda bir xil tartib: 3-qadam — lokal ishga tushirish + `git status` (push yo'q) → 4-qadam — DevTools tekshiruvi → «Kutilganidek» bo'lsa push (A3 da — push → yangi versiya → deploy'da bir marta, telefon ixtiyoriy). A-8 «Tartib», KOD 8, «Ulgurmasangiz» qatorlari («kod push qilinmagan holda qoladi»). 9.45. |
| 2 | `.env` `git status` — isbot emas; tracked-file tekshiruvi | **Rad** | 13-Modul tayanchi 3 va 14-Modul 9.41: `git ls-files` — faqat yangi maxfiy/sozlama fayl paydo bo'lgan darsda; bu darsda yangi kalit yo'q (03-FILTR 24 bilan bir). `git status` qatori — oddiy gigiena, isbot sifatida aytilmagan. |
| 3 | «Harakat kamaytirilsa, animatsiya o'chadi» — universal qoida emas | **Qabul** | 5-ekran xulosasi → «Bu demo yo'lida harakat kamaytirilsa, harakat o'chadi: yozuv, kulrang kartalar va yangi son qoladi.» (102); «Endi siz bilasiz» 5, takrorlash 2, kartochka 9, A-1, A-4; tayanch 1.4 (⚠️). 9.46. |
| 4 | Harakatsiz spinner — «buzilgan ikonka» signali; yashirish, yozuv qoladi | **Qabul** | A3 prompt va Yordam («kutish belgisi aylanmasin — uni yashir, kutish yozuvi yetadi»), 5-ekran 2-harakat («kutish belgisi chiqmaydi — yozuv yetadi»), A-6, A3 kutilgan natija, REPO 4, 4-qadam (2). 9.46. |
| 5 | «Tez ikki marta bosdim, son bir marta o'zgardi» — ikkinchi so'rov ketmaganini isbotlamaydi; Network'da so'rov soni | **Qabul** | A1 4-qadam (3b): Network ro'yxatida asosiy so'rov faqat bitta — ikkinchi bosishdan yangi qator yo'q; kutilgan natija parchasi. 9.45. |
| 6 | Tugma o'chirish — Backend takror himoyasi emas (teacher line) | **Qabul** | A1 O'qituvchi eslatmasi. 9.47. |
| 7 | «Backend'ga tegma» ↔ namuna yozuv — ziddiyat | **Qabul** | Hamma promptda «Backend kodiga tegma» (7 joy), chegara qatori: «tekshiruv uchun faqat namuna yozuv yaratilishi mumkin»; TS10. 9.47. |
| 8 | `namuna=true` — yetarli izolyatsiya emas (realtime, Telegram, eslatma, taklif, analitika) | **Qabul** | A1 1-qadam prompti: faqat namuna akkaunt bilan; sanoq, eslatma, Telegram xabari va taklif sanog'iga kirmasligini agent tekshirib aytadi (`namuna` belgisi 12-Modulda shuni qiladi); chetlamasa — tekshiruvdan keyin o'chirish (Backend kodiga bugun tegilmaydi). A-9. 9.47. |
| 9 | «Namuna yozuv o'chirilmaydi» — shartli | Qisman | 8-band sharti bilan: chiqarilgan bo'lsa qoladi (6-dars namuna akkaunt — 9.19), chiqarilmagan bo'lsa o'chiriladi. TS9, ✎. |
| 10 | «Ikkita kulrang karta» generic learner uchun qattiq | **Qabul** | O'quvchi prompti → «ro'yxat joyini taxminan to'ldiradigan kulrang shakllar — haqiqiy kontentga yaqin shakl va o'lchamda (soni ekraningizga qarab)»; Mentor Yordamida ikkita qoldi. A-1, ✎, TS3. 9.48. |
| 11 | «Haqiqiy karta o'lchamida bo'lsa … siljimaydi» — absolyut | **Qabul** | A2 vazifa, prompt («iloji boricha siljimasin»), 4-qadam (2) («sezilarli sakrash ko'rindimi?»), «Endi siz bilasiz» 3 («katta siljishni kamaytiradi»), kartochka 6, arena 5 («sakrash kamaysin» — 33, ±15% ichida), A-3 (3-dars bilan mos — 03-FILTR 11), kutilgan natija yorlig'i. 9.49. |
| 12 | Slow 4G ro'yxat fetchini sekinlatmasligi mumkin | Qisman | A2 O'qituvchi eslatmasi: «3G» → «Disable cache» + yangilash; ⛔ Mentor ilovasida pilotda. Debug-delay qo'shilmadi (yangi xatti-harakat prodga chiqmasin). |
| 13 | «Kutish yozuvi qancha kutishni aytadi» — stale vaqt da'vosi | **Qabul** | → «kutish borligini aytadi» (2-ekran eslatmasi, A2 1-qadam, kartochka 7, TS1); yozuv matni (11-Modul mahsulot matni) o'zgarmadi. 9.49. |
| 14 | Muvaffaqiyat faqat o'z harakatiga — saqlang | Allaqachon | A3 Yordam, ✎. |
| 15 | 0,3 soniya — bankdan tashqari yangi son | **Qabul** | RAD: A-6, A3 Yordam, REPO 3, TS4 — «bir lahza», davom — loyihada bor animatsiya vaqti. 9.48. |
| 16 | Shimmer — tayanchda yo'q, optional | **Qabul** | Olib tashlandi (optional emas — scope kamaydi): joy egallovchi harakatsiz — A-6, bitta vizual, 2-ekran, 5-ekran jadvali 6 → 5 qator, A2 prompt va Yordam, A3 prompt, 4-qadam, KOD 2–3, REPO 2, TS5. 9.48. |
| 17 | Animatsiya qo'shib, keyin o'chirish — ortiqcha | **Qabul** | 16-band bilan: reduced-motion tekshiruvi ikki harakat (aylanish, kattalashish) bilan. |
| 18 | Reja sarlavhasi — «hakamga javob beradi» natija va'dasi | Qisman | Savol shakli RAD (P-014); «hakamga javob beradi» da'vosi olindi → «Bugun demo yo'lingizdagi uch joyni o'zgartirasiz.» (49). |
| 19 | Hook «Aynan!» / «Qiziq fikr!» | **Rad** | T-028, T-067, tayanch 7 (01–03-FILTR bilan bir). |
| 20 | Hook ✔ «Bir lahza hech narsa» — grammatik mos emas | **Qabul** | Variantlar → «Tugmaning yozuvi o'zgardi» · «Kutish belgisi chiqdi» · ✔ «Avval hech narsa o'zgarmadi» (bir shakl, 21–27 belgi). |
| 21 | 2-ekran bashorati «yangi narsa qo'shmaydi» — UI elementlar yangi | **Qabul** | → «Mentor demo yo'li uchun yangi funksiya qo'shadimi?» · Yo'q, qo'shmaydi · Bitta yangi tugma · Bitta yangi ekran; natija «yo'q, qo'shmaydi». |
| 22 | «Ekranlar va tugmalar o'sha» — mostly okay | Allaqachon | O'zgarishsiz. |
| 23 | A1/A2 lokal focused check, A3 integration, keyin deploy | **Qabul** | 1-band tartibi aynan shu. |
| 24 | A1 «3-qadamdan keyin davom» — tekshirilmagan fix keyingi blokka | **Qabul** | Endi 3-qadamdan keyin kod push qilinmagan holda qoladi; tekshiruv va push 3-amaliyot boshida — tekshirilmagan kod odamlarga chiqmaydi. |
| 25 | A2 ham | **Qabul** | 24-band bilan bir. |
| 26 | A3 push → deploy → verify loop qimmat | **Qabul** | 1-band: lokal tekshiruv → push → deploy → deploy'da bir marta. |
| 27 | `ccProgress` reload'da saqlanadimi | Allaqachon | Ha — localStorage, K-003 (F-0730-01 progress-saqlov); KOD 8 va TS17 ga yozildi. |
| 28 | «Uch blok bajarildi» faqat A3 bilan — xavfli | **Qabul** | Yorliq — A1 && A2 && A3 bayrog'i (yakun, KOD 10, o'z tekshiruvi 6). 9.50. |
| 29 | Grey Cards / Calm Mode — «Bajardim» + check card | **Qabul** | Trigger — «Bajardim» + tekshiruv kartasi belgilangan; Grey Cards tavsifi → «Yuklanish holatini … tekshirdingiz». 9.50. |
| 30 | «Sayqal» termin — QABUL | Allaqachon | Tayanch 2, T19. |
| 31 | «Haqiqiy karta o'lchamida» — generic productda karta bo'lmasligi mumkin | **Qabul** | «haqiqiy kontent egallaydigan joyga yaqin shaklda» (A-1, A2 vazifa, prompt). 9.48. |
| 32 | «Muvaffaqiyat animatsiyasi qisqa bo'ladi» universal emas | **Qabul** | «Endi siz bilasiz» 4 → «Bu darsdagi muvaffaqiyat animatsiyasi qisqa va bir martalik». 9.49. |
| 33 | «Muvaffaqiyat» — ish bajarildi ma'nosida | Allaqachon | A-5. |
| 34 | 2-savol yaxshi | Allaqachon | O'zgarishsiz. |
| 35 | 1-savol to'g'ri izohi «shu zahoti» → «bosilishi bilan» | **Qabul** | → «Bosilgani tugma holatida ko'rinadi; ikkinchisi yuborilmaydi.» (60). |
| 36 | DevTools UI labels gate | Allaqachon | Shubhali 5, REPO 6. |
| 37 | Expo Go reduced motion — qurilma gate | Allaqachon | Shubhali 3; telefon tekshiruvi ixtiyoriy (A3 4-qadam (5)). |
| 38 | APK rebuild yo'q — QAT'IY QABUL | Allaqachon | TS8. |
| 39 | 90 daqiqa optimistik (115–150) | Allaqachon + Qabul | ⛔ bor edi; A-10 qisqartirish tartibi yangilandi (telefon o'tkaziladi · A3 animatsiya minimal · deploy'dagi tekshiruv o'qituvchi boshqaruvida · kartochkalar uyda; 1–2-amaliyot tekshiruvi push'dan oldin shart — o'tkazilmaydi); shimmer chiqdi (16). |
| S | Sarlavhalar: asosiy QAT'IY QABUL; Reja → savol; A2 → «Yuklanayotganda bo'sh joy qolmasin» | Qisman | Reja — 18-band; A2 → «Ro'yxat yuklanayotganda bo'sh joy qolmasin.» (43). |
| TS | 1 → 13 · 2 ✓ · 3 → 10 · 4 → 15 · 5 → 16 · 6, 7 shartli (⛔ bor) · 8 ✓ · 9 → 9 · 10 → 7 · 11, 14, 15, 16 ✓ · 12 → 29 · 13 → 28; 17–24 → 1, 5, 8, 4, 10, 27, 28, 15 | — | Hammasi mos bandlarda. |

**9 hard fix:** 1 ✓ · 2 Rad (qoida) · 3 ✓ (Network) · 4 ✓ (shartli izolyatsiya) · 5 ✓ · 6 ✓ · 7 ✓ · 8 ✓ (0,3 RAD, shimmer yo'q) · 9 ⛔ + tartib.

## Sinf-supurish (13 MD + tayanch, grep)
- Push tartibi — 03 A2 (tekshiruv push'dan oldin, 03-FILTR 19), 07 (lokal demo yo'li push'dan oldin) — bor; 04 — endi push 4-qadam oxirida; 06 — faqat hujjat. 9.45 bilan muhrlandi.
- «animatsiya o'chadi» universal gap — faqat 04 va tayanch 1.4; 09-Modul ta'rifi («sayt biladi») o'zgarmadi.
- Shimmer / 0,3 s — faqat 04 (03 MD da «sokin miltillash» yo'q — grep 0).
- «Backend'ga tegma» — 03 promptlarida `lending/` va `{ilova papkasi}` (Backend yo'q); 06, 07 — tekshiriladi keyingi auditlarda (07 da «Backend'ga tegma» bo'lsa — buzish darsi, Backend kodiga tegilmaydi — ma'nosi bir).
- «sahifa siljimaydi» — 03 tuzatilgan (03-FILTR 11), 04 — endi mos.

## Tekshiruv
`lint:til` 04, tayanch — 0 error · `mdtekshir.py` 04 — 12/12 ekran, arena 3/3/3/3, uzun 0 · `kesishma.py` takror 0 · `lint:prompt` ✓.
