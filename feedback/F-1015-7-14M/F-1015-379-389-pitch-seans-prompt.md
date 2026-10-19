# Pitch-seansga topshiriq: m12-02 · m12-05 · m12-08 — QA fidbek F-1015-379 · 380 · 386 · 389 (19.10)

Salom. Men 7–14-M QA seansiman. QA uchta pitch darsing bo'yicha fidbek berdi. Men bu fayllarga TEGMADIM (06:37 da sen ularni tahrirlayotganing ko'rindi). Retsept B: avval tashxis va taklifni foydalanuvchiga ayt, tasdiqdan keyin tuzat.

**Diqqat:** QA suratlari 19.10 ertalabki bilddan. Har bandni o'zingning HOZIRGI versiyangda tekshir — tuzalgan bo'lsa, «OQLANDI» deb yoz. Rasmlar: `feedback/F-1015-7-14M/F-1015-379-*.png`, `F-1015-380-*.png`, `F-1015-386-*.png`, `F-1015-389-*.png`.

## QA'ning umumiy UI/UX qoidalari (foydalanuvchi yuborgan, hamma darsga)
- Bitta asosiy diqqat: o'quvchi qaysi savolga javob berayotganini darhol tushunsin.
- Har chegara, ikonka, rang va yorliq bir vazifaga xizmat qilsin, aks holda olib tashlanadi.
- Oraliq 8 · 16 · 24 · 32 px.
- Bog'liq narsa bitta guruhda; bog'liq bo'lmaganini bo'sh joy ajratadi.
- Rang holatni bildiradi: yashil — faqat tasdiqlangan to'g'ri, qizil — xato, binafsha — joriy tanlov.
- Bosqichma-bosqich ochish: faqat shu qadamga kerak narsa ko'rinadi.
- Uch vizual daraja: sahifa · misol kartasi · izoh/javob maydoni.
- Tartib: savol → ko'rsatma → interaktiv misol → javob izohi.

## 1. F-1015-379 · 380 — m12-02 «Mahsulotingiz hikoyasi» (`PmStoryPitchLesson.jsx`)
- **s3 (`379-m12-02-s3.png`):** telefon + 6 ta funksiya-chipi + 3 ta bo'sh punktir uya «1 2 3». Bo'sh uya — DE 159 bo'sh-holat ramkasi. Taklif: uyalar o'rniga to'lgan qator bosilganda paydo bo'ladi.
- **s7 (`380-m12-02-s7-qaysi-bosiladi.png`, QA: «qaysi bosiladi?»):** bitta ekranda bashorat, stepper, ipucha matni, Kim/Lahza/O'zgarish uch kartasi, Hakam kartasi, olti bo'lak kartasi, vaqt chizig'i va «(0/3)» — sakkiz qatlam. Taklif: chiziq + joriy qadamning bitta elementi (men m12-13 s2 ni shunday qildim: 1-qadam laptop, 2-qadam hakam, 3-qadam B reja; telefon olindi).
- **Pastki tugmadagi «(0/3)»:** DE 213.21 — stepper bor joyda son tugmada takrorlanmaydi.
- **s5/s7 mobil (`379-m12-02-s5-iphone.png`, `s7-mobil.png`):** telefonda tartib chalkash — tekshir.

## 2. F-1015-386 — m12-05 «Guruh pitchingizda nimani tuzatishni aytadi» (`PmPitchTrainingLesson.jsx`)
- **QA so'zi:** «nima nimani anglatyapti — bilish qiyin»; «layout tartibsiz, takror ko'p, keraksiz elementlar»; «bitta tugma bosildi, tugadi — keyingiga qanday o'tiladi?» (`386-m12-05-s2-stuck.png`).
- **s2/s3:** «Tinglovchilar» kartasi, bo'sh nutq qatori «…», bo'sh vaqt chizig'i, Baholash varag'idagi 6 ta bo'sh katak va bo'sh «Hakam savoli» maydoni bir vaqtda ko'rinadi. Taklif: bo'sh kataklar o'rniga to'lgan qator; joriy qadamning bitta elementi.
- **Tiqilish:** 1-tugmadan keyin keyingi tugma chiqmayapti (yoki ko'rinmayapti) — oxirigacha bosib sina.
- **Reja matni (`386-m12-05-s1-reja.png`):** QA «bilib olasiz», «o'rganasiz», «to'ldirasiz» ostiga chizib, ba'zi joylarda «-ing» buyruq shakli yaxshiroq dedi. **Qaror qabul qilindi (19.10 07:20, foydalanuvchi: «taklifing maqul»):** MATN_KORPUS §REJA-BUYRUQ — reja qadamlari buyruq shaklida («bilib oling», «yozing», «ayting»), sarlavha o'zgarmaydi, ruschasi ham buyruq. Men 7–14-M dagi 40 darsda qildim; sening 7 ta pitch darsingdagi `REJA` massivlariga ham qo'llash kerak.

## 3. F-1015-389 — m12-08 «Final pitchingiz 5 daqiqaga tayyormi» (`PmFinalPitchLesson.jsx`)
- **QA so'zi:** «04-sahifadan o'tishning iloji yo'q — shunaqa sahifalarda tiqilib qolinyapti; qolganlarida ham har gapga bitta karta» (`389-m12-08-s3-otmaydi.png`, Safari'da ham).
- **s3 «Tuzatish va taymer»:** uchala tugmani bosib, «Davom etish» yoqilishini Safari'da ham tekshir. Olti bo'lak qatori — har biri chegarali alohida karta; DE 213.3: bitta karta, ichida qatorlar chiziq bilan ajraladi.
- **s0–s2 (`389-m12-08-s0*.png`, `s1*.png`, `s2*.png`):** Safari va Chrome suratlari bor — joylashuvni solishtir.

## Men 7–14-M da nima qildim (namuna sifatida)
- **Ma'nosiz matn kuchaydi:** qolipdagi `manoliMatn` endi «fast freak. afs sdfa dfs», «fasted saf s f», «qwe rty», «asd asd asd» va «ㄹㅇㅁㄴ» ni ham to'xtatadi. QBlok yumshoq rejimda (buyruq, fayl nomi o'tadi). Sening darslaringda `manoliMatn(s)` chaqirig'i bo'lsa, o'zi kuchayadi.
- **Bo'sh qator ko'rsatilmaydi:** m12-11 jadvallari, m12-12 kalendar-taxta, m12-13 hakam varag'i.
- **Amaliyot kartasi (QBlok):** `ajratSarlavha` prop'i — qadam nomi alohida sarlavha qatorida. Pitch darslarida QBlok yo'q.

## Yakun
`npm run gates -- <fayl>` 13/13 + `npm run lint:jsx`; suratlar; jurnalingga F-ID bilan; 14-M QA sayti: `bash feedback/F-1015-7-14M/vositalar/deploy-qa.sh 12`. Commit — faqat foydalanuvchi buyrug'i bilan. Men bu uch faylga tegmayman.
