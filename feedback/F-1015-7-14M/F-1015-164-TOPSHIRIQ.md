# F-1015-164 — dars maydonida bosib bo'lmaydigan tugma qolmasin (agent topshirig'i, 17.10)

**Foydalanuvchi:** «bosib bo'lmaydigan tugmalar nega qoladi — olib tashlashimiz kerak yoki to'g'irlashimiz kerak, logika bilan, vaziyatga qarab».
«Faqat aniqlik, sifat va ehtiyotkorlikda yaxshi ishlasin.»

Sabab (F-1015-160, m5-14 s7): kartada xira «Avval holatni tanlang» tugmasi turardi — o'quvchi bosadi, hech narsa bo'lmaydi, nima qilishni faqat
pastki o'ng tugma aytadi. Tuzatilgan namuna: `src/pm/PmMetricsLesson.jsx` 7-ekran (`Screen7`, «Shu holat yaxshiroq» → «Foizni hisoblash»).

## Sening ro'yxating
`feedback/F-1015-7-14M/F-1015-164-ROYXAT-<A|B|C|D>.md` — o'lchovda topilgan har o'chiq tugma: kalit, fayl, ekran, klass, matn, surat.
Ro'yxat — boshlang'ich holat (javobsiz). Belgi «maket?» — ota-klassida sayt/telefon/brauzer/backend sahnasi bor, ehtimol ilova surati.

## To'rt tur va yechim (har holatni KODNI O'QIB aniqla, keyin tur tanla)
1. **Oldingi ish kutilyapti** (variantlar/tablar/raqamli bo'limlar «avval X qiling» deb o'chiq): element ish qilinmaguncha **ko'rsatilmaydi**,
   ish qilingach paydo bo'ladi (`fade-step`/`fade-up` — faylda qaysi klass bor bo'lsa). Savol/yorliq matni qolishi mumkin. Qilinadigan ish
   ekranda ko'rinib turishi va Mentor/yorliq uni aytishi shart. Namuna: qolip `QKirish` (`src/qolip/index.jsx`, `!yopiq &&`), 6-Modull `hook-option` (`return !tried ? null : …`).
   Raqamli bosqich tablari (1 · 2 · 3) — faqat ochilganlari (joriy + o'tilgan) ko'rsatiladi YOKI joriy tab bosiladigan, keyingisi ko'rinmaydi.
2. **Forma to'lmagan** («Saqlash», «Qator tayyor», «Qo'shish», «Bajardim», «Shablonga yozish», «Tekshirish»…): tugma **doim bosiladi**;
   shart bajarilmagan bo'lsa bosilganda harakat bo'lmaydi, tugma ostida qisqa sabab chiqadi (nima yetishmayapti — aniq: «2 ta qator bo'sh»,
   «Kamida ikki so'z yozing.»), birinchi bo'sh maydonga fokus. Mavjud tekshiruv mantig'i (`matnOk`, uzunlik, son) O'ZGARMAYDI — faqat qayerda ko'rinishi.
   Sabab matni 60 belgigacha (uz), RU ham (75 gacha). Agar faylda shunday xabar uslubi bor bo'lsa — o'shani ishlat.
   ⚠ «Bajardim» amaliyot qadamida (o'quvchi kompyuterida ish) shartsiz bosiladigan bo'lsa — shunchaki yoq; shartli bo'lsa (2-tur) sabab chiqsin.
3. **Sanoq yoki talab tugma shaklida** («Yana 4 qadam», «Avval ustun savolini yeching», «Avval Neon ko'rsatgan sonni yozing»): tugma emas —
   oddiy kichik matn (sanoq/talab), shart bajarilgach o'rnida haqiqiy tugma chiqadi.
4. **Bosilgan holat** («✓ Saqlash», «✓ Ko'rdingiz», «Qo'shildingiz» — dars boshqaruvi bo'lsa): o'chiq tugma emas, ✓ belgili yozuv (status, `<span>`),
   tugma ko'rinishisiz. Faylda bunday status uslubi (`done-row`, `cmt-done`, `lp-check` …) bo'lsa — o'shani ishlat.

**Maket istisnosi (TEGILMAYDI):** telefon/sayt/brauzer/ilova suratining o'z elementi — band vaqt katagi, ilova tugmasi, ‹ › strelka, brauzer ↻,
«(mashq)» to'lov oynasi tugmasi — bu ilova qanday ko'rinishini ko'rsatadi, real ilovada ham shunday. Lekin agar «maket?» belgili tugma aslida DARS
boshqaruvi bo'lsa (o'quvchi shuni bosib davom etadi, masalan sahnadagi «Internetni uzish» kabi sinov tugmalari, navbat bilan ochiladiganlar) — 1-tur.
Shubhali bo'lsa — tegma va hisobotda «shubhali» ro'yxatiga yoz (fayl:qator, nega).

## Tegilmaydigan narsalar
- Faqat ro'yxatingdagi fayllar. **`src/qolip/`, `src/live/`, `App.jsx`, `src/mentor/`, `scripts/`, `package.json` — TEGILMAYDI** (qolip komponenti
  ichidagi o'zgarish kerak bo'lsa — hisobotga yoz, men qilaman). Boshqa agentlarning fayllari — tegilmaydi (to'rt agent parallel).
- Ball/kalit mantig'i: `set_quiz_keys`, `useLiveSession`, `INLINE_KEYS`, `correctIdx`, `onAnswer`, `firstCorrectRef`, nishon shartlari, `localStorage` kalitlari — o'zgarmaydi.
- Javob berilgandan keyingi o'chiq holat (tanlangan variantdan keyin qolganlari) — ro'yxatda bo'lmasa tegilmaydi (bu «javob qulflandi»).
- Pastki navigatsiya (`NavNext disabled`, «Davom etish») — doiradan tashqari.
- Jonli rejim (Mentor ekrani, `isMentor`, `MentorNote`, `mstats`) — o'zgarmaydi; mentor uchun ochiq bo'lgan narsa ochiq qoladi.

## Matn qoidalari (yangi so'z yozsang)
- Avval `MATN_KORPUS.md` dan tegishli bo'limlarni o'qi (taqlid-manba). Adabiy o'zbek, lotin, «siz», qisqa. «asbob» — TAQIQ. Sinonim yo'q:
  shu darsda ishlatilgan so'zni ishlat. Qisqartiraman deb tushunarsiz so'z yozma. Emoji qo'shma.
- Har yangi uz matnga ru juft (`tr({ uz, ru })`).
- CSS izohiga backtick YOZILMAYDI. CSS shablon satri ichida `${}` bilan ehtiyot.

## Ish tartibi (har fayl)
1. Zaxira: `mkdir -p arxiv/F-1015-164-oldin && cp -n <fayl> arxiv/F-1015-164-oldin/` (bor bo'lsa ustidan yozma).
2. Ro'yxatdagi har tugmaning kodini top (matn/klass bo'yicha grep), sharti va mantig'ini o'qi, turini aniqla.
3. Tahrir (Edit; katta almashtirish — python `assert count==1`).
4. `npm run gates -- <fayl>` — **12/12** shart. Yiqilsa tuzat (o'zing kiritgan xatoni). Oldindan bor `til` xatosi bo'lsa — hisobotga yoz.
5. Ko'z bilan tekshir: vite **http://localhost:5300** ishlab turibdi (o'chirma, qayta yoqma). Surat:
   `node feedback/F-1015-7-14M/vositalar/scrl.mjs <papka> <kalit> <lessonId> <jami> <ekranlar> uz` (lessonId — fayldagi `lessonId:`; jami — `SCREEN_META.length`,
   yoki darsni ochib localStorage `ccProgress:<lessonId>.total`). Surat papkasi: `feedback/F-1015-7-14M/suratlar/F-1015-164-keyin-<A|B|C|D>/`.
   Kerak bo'lsa playwright bilan tugma bosib keyingi holatni ham ol (shart bajarilgach tugma chiqadimi; 2-turda bosilganda sabab chiqadimi).
   Har o'zgargan ekranni KAMIDA bitta suratda ko'r (Read bilan). RU ham bitta suratda tekshir (matn sig'adimi).
6. MD sinxron: o'quvchi ko'radigan matn yoki tartib o'zgarsa — modul MD'sida shu ekran qismiga qator + `✎ F-1015-164`.
   MD joylari: 7-M `feedback/F-0928-QA-5modul/YAKUNIY/`, 8-M `feedback/F-0929-QA-6modul/YAKUNIY/`, 9-M `feedback/F-1005-9modul/*-v3.md`,
   10-M `feedback/F-1005-10modul/YAKUNIY/`, 11-M `feedback/F-1005-11modul/YAKUNIY/`, 12-M `feedback/F-1006-12modul/*-v3.md`,
   13-M `feedback/F-1007-13modul/*-v3.md`, 14-M `feedback/F-1008-14modul/*-v3.md` (fayl nomi dars nomiga mos).

## Hisobot (oxirida, qisqa, o'zbekcha)
- Har tuzatilgan joy: `fayl:qator` · kalit sN · tur (1–4) · nima qilindi (bir gap) · surat yo'li.
- Tegilmagan (maket) — ro'yxat qatori + sabab (bir so'z).
- Shubhali / qaror kerak — alohida.
- Har fayl darvoza natijasi (12/12 yoki qaysi yiqildi va nega).
- Commit QILINMAYDI. Deploy YO'Q.
