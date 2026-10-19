# Pitch-seansga topshiriq: m9-16 «Pitch» darsi — QA fidbek F-1015-344…347 (19.10)

Salom. Men 7–14-M QA seansiman. QA m9-16 (`src/9-Modull/PmPrototypePitchLesson.jsx`, sening darsing) bo'yicha 4 ta fidbek berdi. Men faylga TEGMADIM — bir fayl, bir muharrir. Retsept B: avval tashxis+taklifni foydalanuvchiga ayt, tasdiqdan keyin tuzat.

**Kontekst:** QA suratlari ESKI bilddan (16 ekranli). 19.10 02:27 da men `deploy-qa.sh 9` bilan 11-M QA saytiga sening YANGI (11 ekranli, uncommitted) versiyangni chiqarib qo'ydim — smoke 32/32. Har topilma yangi versiyada tekshirilgan, pastdagi tashxis yangi kodga tegishli. Rasmlar: `feedback/F-1015-7-14M/F-1015-344…347-*.png`. Mening yangi-versiya suratlarim: `feedback/F-1015-7-14M/suratlar/F-1015-344-hozir/` (m-uz-s4 = taxmindan oldin, m-uz-s4-…-taxmin = done holati, d-uz-s7 = juftlik, d-uz-s6 = test).

## F-1015-344 — Screen8 «Jonli demo» (SCREEN_META indeks 4), telefon 390px — «qaysi bosiladi?»
Rasm `F-1015-344-m9-16-s9-mobil.png`. Foydalanuvchi: «UI/UX tarafdan qiyin, qaysi bosiladi? chalkashlik bor».
Tashxis: taxmindan keyin tepada telefon-maket + to'rt BolakKarta (bosilmaydi, lekin ramkali — tugmaga o'xshaydi), bosiladigan `QadamQatori` (S8_QADAM, 3 qadam) esa eng pastda — telefonda ekran ostida qoladi; footer «Qadamlarni bajaring (0/3)» deydi, qadamlar ko'rinmaydi.
Taklif: taxmindan keyin qadam qatori BIRINCHI (Mentor ostida), bittadan (213 «Bittadan»); telefon va bo'laklar natija sifatida pastda; BolakKarta ixcham holatda chegarasiz holat-chip ko'rinishida (213.3; tugmaga o'xshamasin). Mentor matni joriy qadamni aytadi.

## F-1015-345 — Screen11 juftlik (indeks 7): «3 daqiqani boshlash»ni 2 marta bossa? qanday tekshiriladi?
Rasmlar `F-1015-345-m9-16-s12-boshlash.png`, `-baholang.png`.
Fakt (kod): `boshla` → tugma «To'xtatish»ga almashadi, ikki marta bosib bo'lmaydi; «Ayting» qadami `toxtat` (qadam 0→1) bilan tugaydi — boshqa tekshiruv yo'q, vaqt saqlanadi, 3:00 dan oshsa `oshdi`.
Foydalanuvchiga halol ayt: isbot-mexanizmi yo'q (praktika qoidasi: ustoz/sherik birga — 336 bilan bir sinf, u yerda B qaror). Ixtiyoriy kichik to'siq: taymer < 30 s bo'lsa «To'xtatish» o'rniga «Hali erta» (ikkinchi bosishda baribir to'xtaydi). Foydalanuvchi qaror qilsin.

## F-1015-346 — Screen11 Baholang/Tuzating — «UX ancha tushunarsiz»
Rasmlar `F-1015-346-m9-16-s12-tuzating.png`, `-tuzatildi.png`.
Tashxis: Tuzating qadamida ochiladigan qator (`ochiladi(i)`: ✗ olgan yoki hammasi ✓ bo'lsa izohli) faqat binafsha ramka oladi — «Tuzatish» tugmasi yo'q, o'quvchi qatorni bosish kerakligini bilmaydi; pastdagi nav-tugma «Bitta bo'lakni tuzating» o'chiq turadi; ochilmaydigan qatorlar xira emas.
Taklif: ochiladigan qatorda aniq ikkinchi-tugma «Tuzatish» (QTugma ikkinchi); qolgan qatorlar xira (opacity .5); Mentor matni bo'lak nomini aytadi («Muammo bo'lagini tuzating»); Baholangda hamma ✓ bo'lsa ogohlantirish matni ham qaysi qatorni ochish mumkinligini aytsin.

## F-1015-347 — Screen12 test (indeks 6): «tekshiruv yozuvingiz» — tushunarsiz
Rasm `F-1015-347-m9-16-s13-test.png`. Foydalanuvchi: «test kitobmidi? "Test sifatida qo'shilgan kitob" deb so'rasa bo'larmidi?».
Fakt: «tekshiruv yozuvi» atamasi darsda o'rgatilmagan (faqat reja qatori, 298-satr atrofida). Taklif: `questionText` + `question` (uz): «Kitob ilovangiz Database'ida 12 ta kitob; 5 tasini sinab ko'rish uchun o'zingiz qo'shgansiz. Nima deysiz?»; ru mos; reja qatoridagi «tekshiruv yozuvlari»ni ham «sinab ko'rish uchun qo'shilgan yozuvlar»ga. Javoblar o'zgarmaydi.

## Yakun
Tasdiqdan keyin: `npm run gates -- src/9-Modull/PmPrototypePitchLesson.jsx` 13/13 + `npm run lint:jsx`; suratlar (390 + 1280); jurnalingga F-1018-… raqamlari bilan; 11-M QA sayt: `S=<o'z scratchpad> bash feedback/F-1015-7-14M/vositalar/deploy-qa.sh 9` (`$S/kf.txt` kerak — App.jsx `key comp` ro'yxati). Commit — foydalanuvchi buyrug'i bilan. Men m9-16 ga tegmayman; boshqa savol bo'lsa foydalanuvchi orqali.
