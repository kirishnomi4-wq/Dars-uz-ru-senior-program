# F-1022-01 · m6-02 «Bitta gapni uch kishi bir xil tushunadimi?» — qayta yozish (ekranma-ekran)

> Holat: **✅ KOD 24.10 18:33** (gates 13/13; arena #12 xato varianti tell uchun «PRD'ni yozgan odam»). Avval: QORALAMA. Tasdiqdan keyin `src/6-Modull/PmLesson22.jsx` ga o'tadi (uz + ru parallel). Uy vazifasi tegilmaydi.
> Foydalanuvchi qarori (22.10): **aralash** — PRD atamasi qoladi (eng kerakli narsa) + haqiqiy AI; gap aytuvchi — **ustoz** («murabbiy» emas).

## 0. Nima o'zgaradi, nima qoladi

**Muammo:** markaziy metafora — buyurtmachi (basseyn murabbiysi) **uch dasturchiga** og'zaki gap aytdi → uch xil ilova; varaq to'lsa → uch dasturchi bir xil ekran. O'quvchi bu yerda kim? Na dasturchi, na PM. «Dasturchi» 20 joy, «murabbiy» 21 joy.

**Yechim (mexanika aynan qoladi, rol almashadi):**
- Gap aytuvchi — **ustozingiz** (sinfdagi o'z ustozi; ru «наставник»). U sizga bitta gap aytdi.
- Uch dasturchi → **siz Gemini'ga uch marta yozdingiz — uch xil ilova chiqdi.** Uch ilova vizuali qoladi (s0 hook'da), «uch urinish» bo'ladi.
- Varaq to'lgach → **«Bitta varaq — AI har safar bir xil quradi»** (uch bir xil ekran vizuali qoladi).
- «Bo'sh katak — dasturchi taxmin qiladi» → **«AI taxmin qiladi»** (test, kartalar, arena, qoida, RECAP).
- **PRD atamasi qoladi va kuchayadi:** s4 da varaq to'lgach «bu PRD» (hozir ham bor) + yangi gap: «Bu varaq — ikki narsa birdan: startapchining PRD'si va AI'ga beriladigan to'liq prompt».

**«Murabbiy» ikki xil:** (1) gap aytuvchi — s0, s4, s4 eslatmasi, nishon-matni → **ustoz**; (2) keys-olamidagi basseyn xodimi — s5 test varianti «Uch murabbiy ham ilovadan mamnun», s9 1-varaq «Murabbiy uchun kunlik ro'yxat» (3 qator + sabab), s9 3-varaq «Bitta murabbiyga o'rganib qolganlar», arena «Basseyn murabbiysi» → **o'z nomida qoladi** (basseyn xodimi, foydalanuvchi sifatida).

**Qoladi:** basseyn olami · to'rt katakli varaq (Muammo · Kim · Yechim · O'lchov) · s4 to'rt savol mexanikasi · s8 o'z mini-do'koni PRD'si · s9 uch varaq tekshiruvi · Geyts/Allen keysi · VS Code kodingi · test to'g'ri javoblari o'rni (`s3 s5 s7 s11`) · 16 ekran.

Belgilar: ❌ hozir → ✅ yangi. Ko'rsatilmagan matn o'zgarmaydi.

---

## 01 / 16 · s0 · Kirish — bitta gap, uch xil ilova

| | ❌ hozir | ✅ yangi |
|---|---|---|
| Mentor gapi | Basseynga bordingiz — guruh to'lib qolgan, bekorga qaytdingiz. Siz kabi qaytganlar ko'p. Murabbiy dasturchilarga bitta gap aytdi. | Basseynga bordingiz — guruh to'lib qolgan, bekorga qaytdingiz. Siz kabi qaytganlar ko'p. Ustozingiz sizga bitta gap aytdi, siz uni Gemini'ga uch marta yozdingiz. |
| Gap-kartasi | Murabbiy: «Joy band qiladigan ilova kerak». | Ustoz: «Joy band qiladigan ilova kerak». |
| 2 variant | Gap juda qisqa aytilgan · Har kim boshqacha tushungan | (o'zgarmaydi) |
| Natija-matn | Ikkalasi ham to'g'ri. Sabab esa bitta: gap **faqat og'zaki** aytildi. Og'zaki gapni har kim o'zicha tushunadi. Bugun shu gapni bitta varaqqa yozasiz. | Ikkalasi ham to'g'ri. Sabab esa bitta: gap **faqat og'zaki** aytildi, siz uni har safar boshqacha yozdingiz — AI har safar boshqacha qurdi. Bugun shu gapni bitta varaqqa yozasiz. |

**Mexanika:** mentor «Natijani ochish» (m3-10 naqshi), diagramma tanlov paytida.
> **Bu slayd nima uchun:** bitta og'zaki gapdan nega uch xil ilova chiqqanini o'quvchi tanlaydi va sabab gap faqat og'zaki aytilgani ekanini ko'radi.
> (hozirgi qoladi) Ovozlar bo'linadi — ikkala javob ham hayotdan olingan…

---

## 02 / 16 · s1 · Maqsad — bo'sh varaq

Matn o'zgarmaydi.
> **Bu slayd nima uchun:** dars oxirida to'rt katakli bitta varaq to'ldirishini oldindan ko'rsatadi; kataklar bo'sh — javobni sinf keyin topadi.

---

## 03 / 16 · s2 · Ikki karta (og'zaki / yozilgan)

| | ❌ hozir | ✅ yangi |
|---|---|---|
| 1-karta | Gap yozib olinmasa, keyin har kim uni o'zicha eslaydi. Aytilmay qolgan joyini esa har kim o'zi to'ldiradi. | Gap yozib olinmasa, keyin uni har safar boshqacha yozasiz. Aytilmay qolgan joyini esa AI o'zi to'ldiradi. |
| 2-karta | Gap o'zgarmay turadi. Uch kishi ham bitta qatorni o'qiydi. | Gap o'zgarmay turadi. Uch marta yozsangiz ham AI bitta qatorni o'qiydi. |

> **Bu slayd nima uchun:** og'zaki gap bilan yozilgan qator farqini o'quvchi ikki kartani ochib o'zi topadi.

---

## 04 / 16 · s3 · Test «birinchi nima qilasiz?»

| | ❌ hozir | ✅ yangi |
|---|---|---|
| 4-variant (xato) | Dasturchilarga og'zaki aytaman | AI'ga eslab qolganimcha yozaman |
| 4-variant izohi | Og'zaki aytilsa, uch dasturchi uch xil tushunadi. | Eslab yozilsa, har safar boshqacha chiqadi — AI har safar boshqacha quradi. |

To'g'ri javob (2: «Eshitganimni qatorga yozib olaman») va izohi o'zgarmaydi.
> **Bu slayd nima uchun:** og'zaki gapni eshitgach birinchi ish — qatorga yozib olish ekanini mustahkamlaydi.

---

## 05 / 16 · s4 · Yadro — to'rt savol, bitta varaq

| | ❌ hozir | ✅ yangi |
|---|---|---|
| Mentor (1-bosqich) | Murabbiy: «Basseynga joy band qiladigan ilova kerak.» Varaq katagini bosing — bu unga savol, javob o'sha katakka yoziladi. | Ustoz: «Basseynga joy band qiladigan ilova kerak.» Varaq katagini bosing — bu ustozga savol, javob o'sha katakka yoziladi. |
| Mentor (2-bosqich, varaq to'lgach) | Bunday varaqni **PRD** deyishadi — mahsulot talablari hujjati (Product Requirements Document). Katta jamoada u bir necha sahifa, bizda — to'rt katak. | Bunday varaqni **PRD** deyishadi — mahsulot talablari hujjati (Product Requirements Document). Katta kompaniyada u bir necha sahifa, bizda — to'rt katak. **Siz uchun bu ikki narsa birdan: startapchining PRD'si va AI'ga beriladigan to'liq prompt.** |
| Tugma | ▶ Endi nima qurishadi? | ▶ Endi AI nima quradi? |
| Natija (uch bir xil ekran ostida) | Bitta varaq — uch dasturchida bir xil natija. | Bitta varaq — AI har safar bir xil quradi. |

To'rt savol/javob (S4_JAVOB), varaq, nishon mexanikasi — o'zgarmaydi.
> **Bu slayd nima uchun:** o'quvchi ustozga to'rt savolni o'zi beradi, varaq to'ladi va AI har safar bir xil ekran qurishini ko'radi — darsning asosiy ekrani.
> ❌ «…so'rang: «murabbiydan nimani so'rash kerak edi?»…» → ✅ «…so'rang: «ustozdan nimani so'rash kerak edi?»…» (qolgani o'zgarmaydi)

---

## 06 / 16 · s5 · Test «O'lchov katagi»

Matn o'zgarmaydi — «Uch murabbiy ham ilovadan mamnun» basseyn xodimlari, keys-olam. Izoh ham qoladi.
> **Bu slayd nima uchun:** O'lchov katagiga faqat sanab bo'ladigan son tushishini aniqlaydi.

---

## 07 / 16 · s6 · Geyts va Allen · 08 / 16 · s7 · Test

Matn o'zgarmaydi (haqiqiy keys, uchinchi shaxs).
> s6 — **Bu slayd nima uchun:** Geyts va Allen ishni aniq yozilgan gapdan boshlagani va tilni qanday sinaganini o'quvchi voqeadan biladi.
> s7 — **Bu slayd nima uchun:** til haqiqiy Altairda sinalmasa ham nega ishlaganini tanlaydi — aniq yozilgan talab kuchini mustahkamlaydi.

---

## 09 / 16 · s8 · Mustaqil ish — mini-do'kon uchun bitta varaq

Matn o'zgarmaydi (o'quvchi o'z do'koni uchun to'rt katakni to'ldiradi — allaqachon o'z roli). Sarlavha «Mini-do'koningiz uchun bitta varaq to'ldiring» qoladi.
> **Bu slayd nima uchun:** o'quvchi o'z mini-do'koni uchun PRD'ning to'rt katagini bittalab to'ldiradi — darsning asosiy natijasi; shu varaq keyin AI'ga prompt bo'ladi.
> (hozirgi eslatma qoladi: nima sotishini o'ylamagan o'quvchi… baholash-mezoni…)

---

## 10 / 16 · s9 · Tekshiruv — uch varaq, javobsiz katak

Matn o'zgarmaydi: 1-varaq «Murabbiy uchun kunlik ro'yxat» (muammo/kim/yechim/sabab — basseyn murabbiylari foydalanuvchi sifatida), 3-varaq «Bitta murabbiyga o'rganib qolganlar» — keys-olam.
> **Bu slayd nima uchun:** o'quvchi uch varaqni o'qib, o'z savoliga javob bermaydigan katakni topadi va to'liq to'g'ri varaqni ham tanib oladi.
> (hozirgi eslatma qoladi)

---

## 11 / 16 · s10 · Koding — yozilmagan katakni topadigan funksiya

Matn o'zgarmaydi.
> **Bu slayd nima uchun:** qator ma'nosini odam o'qiydi, umuman yozilmagan katakni esa kod topadi — o'quvchi shu funksiyani VS Code'da to'ldiradi.

---

## 12 / 16 · s11 · Yakuniy test «Kim katagi bo'sh qoldi»

| | ❌ hozir | ✅ yangi |
|---|---|---|
| Savol | Varaqning «Kim» katagi bo'sh qoldi. Dasturchi hech kimdan so'ramay, ishni boshladi. Natijada nima bo'ladi? | Varaqning «Kim» katagi bo'sh qoldi. Siz shu varaqni AI'ga yubordingiz, u hech narsa so'ramay qurdi. Natijada nima bo'ladi? |
| 2-variant (to'g'ri) | Kim uchun qurishni o'zi taxmin qiladi | Kim uchun qurishni AI o'zi taxmin qiladi |
| To'g'ri izoh | Katak bo'sh qolsa, dasturchi uni o'z taxmini bilan to'ldiradi. Taxmin noto'g'ri bo'lsa, ilova boshqa odamlar uchun qurilib qoladi. Shuning uchun katak bo'sh qolmaydi: bilmasangiz — so'rab aniqlashtirasiz. | Katak bo'sh qolsa, AI uni o'z taxmini bilan to'ldiradi. Taxmin noto'g'ri bo'lsa, ilova boshqa odamlar uchun qurilib qoladi. Shuning uchun katak bo'sh qolmaydi: bilmasangiz — so'rab aniqlashtirasiz. |
| 1-izoh | Ish to'xtamaydi — dasturchi baribir quradi, faqat kim uchun ekanini o'zi taxmin qiladi. | Ish to'xtamaydi — AI baribir quradi, faqat kim uchun ekanini o'zi taxmin qiladi. |
| 3-izoh | Qolgan kataklar joyida turibdi — faqat bo'sh qolgan katakni dasturchi o'z taxmini bilan to'ldiradi. | Qolgan kataklar joyida turibdi — faqat bo'sh qolgan katakni AI o'z taxmini bilan to'ldiradi. |
| 4-izoh | Hammaga emas — dasturchi taxmin qilgan odamlarga quriladi. | Hammaga emas — AI taxmin qilgan odamlarga quriladi. |
| Default izoh | Katak bo'sh qolsa, dasturchi taxmin qiladi. Bilmasangiz — so'rab aniqlashtiring. | Katak bo'sh qolsa, AI taxmin qiladi. Bilmasangiz — so'rab aniqlashtiring. |

Qayta-tushuntirish (RECAPS) kartasi: «Bo'sh katak ishni to'xtatmaydi — Dasturchi uni o'z taxmini bilan to'ldiradi» → «AI uni o'z taxmini bilan to'ldiradi».
> **Bu slayd nima uchun:** bo'sh katak AI'ni taxmin qilishga olib kelishini o'quvchi tanlaydi.

---

## 13 / 16 · s12 · Refleksiya

| | ❌ hozir | ✅ yangi |
|---|---|---|
| Yozgandan keyingi qoida | Bugungi qoida: aniq yozilmasa — dasturchi taxmin qiladi. | Bugungi qoida: aniq yozilmasa — AI taxmin qiladi. |

> **Bu slayd nima uchun:** o'quvchi qaysi katak qiyin bo'lganini aytadi va bir qatorda yozib qoldiradi.

---

## 14 / 16 · s13 · Natijalar · 15 / 16 · s14 · Kartalar

| Karta | ❌ hozir | ✅ yangi |
|---|---|---|
| 7 (javob) | Dasturchi uni taxmin bilan to'ldiradi | AI uni taxmin bilan to'ldiradi |

Qolgan 9 karta o'zgarmaydi («PRD nima?», «PRD'ning sodda ko'rinishi», «PRD inglizcha to'liq nomi» — atama qoladi).
> s13 — **Bu slayd nima uchun:** sinf natijasi va g'oliblar.
> s14 — **Bu slayd nima uchun:** o'nta karta bilan o'quvchi o'zini o'zi tekshiradi.

---

## 16 / 16 · s15 · Yakun

**«Endi siz bilasiz» (RECAP):**

| № | ❌ hozir | ✅ yangi |
|---|---|---|
| 2 | PRD — mahsulot talablari hujjati. Uning eng sodda ko'rinishi — bitta varaq, to'rt katak. | PRD — mahsulot talablari hujjati. Uning eng sodda ko'rinishi — bitta varaq, to'rt katak. Siz uchun u AI'ga beriladigan to'liq prompt ham. |
| 4 | Katak bo'sh qolsa, dasturchi taxmin qiladi — bilmasangiz, so'rab aniqlashtiring. | Katak bo'sh qolsa, AI taxmin qiladi — bilmasangiz, so'rab aniqlashtiring. |

**Nishon «Right Question!»:** «To'rt savolni murabbiydan o'zingiz so'radingiz» → «To'rt savolni ustozdan o'zingiz so'radingiz».

**Arena (to'g'ri javob o'rinlari qoladi):**

| Savol | ❌ hozir | ✅ yangi |
|---|---|---|
| «Menga PRD bering» — dasturchi nimani so'rayapti? | | «Menga PRD bering» — hamkoringiz nimani so'rayapti? (to'g'ri: Talablar hujjatini) |
| «Kim» katagiga qaysi qator to'g'ri? — 4-variant | Kod yozadigan dasturchilar | Kod yozadigan AI |
| O'lchov katagi nima uchun kerak? — 3-variant | Dasturchilar sonini aytadi | Ustunlar sonini aytadi |
| O'lchov katagi bo'sh qolsa, nima yo'qoladi? — 4-variant | Dasturchining haqi | Ilovaning nomi |
| Varaq to'ldirilgach uch dasturchi nima qurdi? | | Varaq to'ldirilgach AI uch urinishda nima qurdi? (to'g'ri: Uchalasi bir xil ekran) |
| Varaq bo'sh qolsa, kim taxmin qiladi? — 4-variant (to'g'ri) | Kod yozadigan dasturchi | Kod yozadigan AI |

> **Bu slayd nima uchun:** CodeStrike arenasi, uy vazifasi va nishonlar.

---

## Hisob
- «dasturchi» 20 joy → 0; «murabbiy» 21 joy → 10 ta (gap aytuvchi) «ustoz», 11 ta (basseyn xodimi) qoladi.
- Atama: PRD 6 joyda qoladi + 2 joyda kuchayadi (s4 mentor, RECAP 2 — «AI'ga beriladigan to'liq prompt»).
- Mexanika: s0 mentor «Natijani ochish»; 111-qonun 16 ekran (MentorNote mexanizmi m3-10/m3-05 dan: `ScreenIdxCtx` + `MENTOR_WHY`, bo'sh `<MentorNote />` s2/testlar/s6/s14).
- ru: «murabbiy» → «наставник», «dasturchi» → «AI»; test/arena to'g'ri javob o'rinlari o'zgarmaydi.
- Uy vazifasi (`PmLesson22.homework.jsx`) — TEGILMAYDI.
