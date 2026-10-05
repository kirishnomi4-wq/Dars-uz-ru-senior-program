# 6-Modul (LMS: 8-Modul) · 6-dars (PM) «Ilova o'zi qaror qilsa, kimga tegadi?» — MD v3

Fayl: `src/6-Modull/PmLesson23.jsx` · 16 ekran · faqat o'zbekcha (ru — kod bosqichida, RU_TARJIMON_SHABLON bilan)
Asos: `06-PmLesson23-v2.md` (F-0929-08 auditi qabul qilingan) + F-1004 PM 2-to'lqini (14 · 15 · 17 · 20 · 21 — saqlanadi). v3 faqat **o'zgargan ekranlarni** to'liq yozadi;
«v2 dagidek» deyilgan joy matni v2 dan (u yerda «o'zgarmaydi» deyilgan bo'lsa — `06-PmLesson23-sozlar.md` dan) olinadi.
Menyu nomi = dars nomi (DE-205): `App.jsx` m6-06 «Ilova o'zi qaror qilsa, kimga tegadi?» — o'zgarmaydi. Oldingi dars m6-05 «Claude Skills — nima» · keyingi m6-07 «O'z Skill'ingizni yozing».
Fidbek: qator yoniga `>> ...` yozing. Tasdiqlangach (GATE M) dars shu holatga keltiriladi.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi: `INLINE_KEYS` s3 = 1 · s5 = 2 · s7 = 0 · s11 = 1 (0 dan sanaladi); arena kaliti 0,3,2,1 · 1,0,2,3 · 0,2,1,3.
⚠️ Uyga vazifa (`HwCard`) — matniga tegilmaydi, faqat emoji olinadi (PM-027); xabar pastda.

---

## A. Darsning tayanchi (v2 A-bo'limi o'z kuchida + 04.10 qonunlari)

1. **Bosh savol (dars bo'yi bitta ibora):** «Bu qaror **kimga tegadi**?» — «jabr ko'radi» yo'q (v2).
2. **Chegara — bitta ta'rif, dars bo'yi so'zma-so'z (T-042):**
   «Chegara — ilova qaysi ishni o'zi qilishi, qaysisini odamga qoldirishi haqida oldindan yozilgan qoida.»
   Hozir kodda uch xil ta'rif bor (2-ekran xulosasi · takrorlash/kartochka/yakun · arena 1-savol) — v3 da bittasi qoladi.
   «qaror» so'zi darsda ikki ma'noda yashardi (T-015): ilovaning qarori («bu qaror kimga tegadi?») va chegaraning o'zi («oldindan qilingan qaror», «uchta qaror yozasiz»).
   v3: **qaror** — faqat ilova/bot qiladigan ish; o'quvchi yozadigani — **chegara** (reja ekranida, atama hali ochilmagan joyda — **qoida**).
3. **Uch daraja — Ish yo'lidagi uch yo'l nomi (bir ma'no — bir so'z, T-014):** **O'zi qiladi** · **Avval so'raydi** · **Faqat odam**.
   v2 dagi «O'zi qilaversin / Odam tasdiqlagach qilsin / O'zi umuman qilmasin» shu uch nomga o'tadi. O'quvchi yozadigan «…maydi» qatori pastki ikki yo'l haqida.
4. **Qachon chegara kerak — ikki shart:** ilova ishni **o'zi qiladi** va u **odamga tegadi** (10-ekran kodi aynan shu ikki shart).
5. **Avval misol, keyin atama (PM-107):** «chegara» so'zi birinchi marta 2-ekran xulosasida, o'quvchi bitta javobni uch yo'ldan yuborib ko'rgandan keyin chiqadi.
   0–1-ekranda bu so'z yo'q (§126).
6. **Toza yuza (185):** tugma, variant, chip, eyebrow va kartada emoji yo'q (hozir: 🙂😕 🛒 ✅ 🙋🤖⛔ 📱 🎲 🌙🔁🧹🏷 ⭐ ▶⏹ 🚀 📝 🗂 👆). Istisno — arena, nishon medali, podium.

## Darsning ipi va bitta vizual

- **Misol-ip (P-001):** o'quvchining **mini-do'koni** — 1-darsdagi sayt (Telefon 2 500 000 · Quloqchin 300 000), 2-darsda unga varaq to'ldirilgan (`pm-m6d2-prd`).
  Hook — o'quvchining o'z telefonidagi «so'ramay qilingan» uch ish; 2-ekrandan boshlab hammasi mini-do'konda: ilovasi, AI javoblari, boti, kodi.
- **Bitta vizual — «Ish yo'li» (yangi, 163/180; bitta manba `ISH_YOLI`):** gorizontal chizma, uch tugun (chizilgan belgi + nom, emoji/logotip yo'q):
  `Ilova` (AI belgisi — kichik chip) → `Do'kon egasi` (odam belgisi; chegara nuqtasi) → `Mijoz` (odam + telefon).
  Ular orasida **uch yo'l** (nomi yo'l ustida, mono):
  - **O'zi qiladi** — Ilova'dan Mijoz'ga to'g'ri yoy; Do'kon egasi chetda qoladi;
  - **Avval so'raydi** — Ilova → Do'kon egasi (to'xtaydi, ✓ yoki ✗) → Mijoz;
  - **Faqat odam** — Ilova kulrang («bu ishni qilmaydi»), ishni Do'kon egasi o'zi boshlaydi → Mijoz.
  **Ish** — kichik karta (konvert), nomi bilan; yo'l bo'ylab uchadi. **Holatlar:** Mijoz yashil (zarar yo'q) · qizil (zarar, ostida odam nomi + bitta qator fakt) ·
  kulrang (kutyapti, soat yorlig'i). Do'kon egasi ustida **«Kutmoqda: N»** sanog'i (ko'p bo'lsa qizil). Soat yorlig'i: «1 soniya» · «5 daqiqa» · «2 soat».
  Ishlatiladi: 2 (uch yo'l), 4 (uch ish), 6 (5-bosqich, kichik), 10 (kod natijasi). 9-ekranda `Ilova` o'rnida `Bot`.
- **Ikkinchi maket — chat (`ChatMock`, F-1004-15, saqlanadi):** AI chat oynasi, pastida kulrang qator. Faqat 6-ekranda.

---

## 0 · Kirish  ← QKirish (DE-201 standarti)
- Eyebrow: Kirish · so'ramay qilingan ish
- Sarlavha: **Ilova so'ramay qaror qilganda, sizga qanday tuyulgan?** (53)
- Mentor: **Uchala ishni ilova sizdan so'ramay qildi.** (39)
- Maket (chapda) — telefon ekrani (191-ramka), uchta bildirishnoma:
  «Sizga mos qo'shiqlar tanlab qo'yildi» · «Do'stlaringizga taklif yuborildi» · «Obunangiz avtomatik uzaytirildi»
- Variantlar (o'ngda, radio): Qulay bo'lgan — vaqtimni tejadi · Yoqmagan — o'zim tanlamoqchi edim
- Javob (ikkalasida bir xil — sof so'rovnoma, maqtov yo'q, J-026): **Ikkalasi ham rost. Farq bitta savolda: bu qaror kimga tegadi? Bugun shu savolni mini-do'koningizga berasiz.** (107)
- **Harakat → Vizual o'zgarish:** variantni tanlash → maketdagi har bildirishnoma yonida birin-ketin yorliq ajralib chiqadi: «kimga tegdi → sizga»; javob o'ngda ochiladi.
- Jonli darsda: ovozlar foizi (hozirgidek, `hvote`).
✎ 🙂/😕 olindi (185) · Mentor gapi (uch ish ro'yxati) maketga ko'chdi (T-047), Mentor endi yangi faktni aytadi, «Bu…» bilan boshlanmaydi (T-029) · javob 196 → 107 belgi (162) · maket qo'shildi (QKirish)

## 1 · Reja  ← QReja (DE-201)
- Eyebrow: Reja
- Sarlavha: **Bugun mini-do'koningiz uchun uchta qoida yozasiz.** (49)
- Mentor: **Har qatorda — ilova o'zi qilmaydigan ish va u tegadigan odam.** (61)
- Chapda — «Dars oxirida sizda shunday ro'yxat bo'ladi» + uch qator birin-ketin yoziladi (oxirida ✓):
  Narxni o'zi o'zgartirmaydi → Eski narxni ko'rgan mijoz · Sharhni o'zi o'chirmaydi → Sharh yozgan mijoz · Buyurtmani o'zi to'lovga yubormaydi → Hali o'ylab turgan mijoz
- O'ngda — «01 · matn · teg» kartalari (bosilmaydi, P-015):
  - 01 · Ilova o'zi qilgan ish kimga tegishini ko'rasiz · `tajriba`
  - 02 · Qaysi ish odamdan o'tishini tanlaysiz · `tanlov`
  - 03 · Mini-do'koningizga qoidalar yozasiz · `yozish`
  - 04 · Qoidalarni kod bilan tekshirasiz · `kod`
- Tugma: Boshlaymiz →
✎ «Maqsad» → QReja (chap — natija-ro'yxat, o'ng — qadamlar) · «uchta qaror» → «uchta qoida» (A-2, T-015) · 🛒 «Mini-do'kon» yorlig'i va ✅ olindi · «chegara» so'zi bu ekranda yo'q (§126)

## 2 · Bitta javob — uch yo'l  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · uch yo'l
- Sarlavha: **AI javobi mijozga qaysi yo'l bilan borsin?** (42)
- Mentor: **Javobda xato bor: telefon ertaga emas, uch kunda keladi. Javobni uchala yo'ldan yuborib ko'ring.** (96)
- Bashorat (ballsiz, 181): **Qaysi yo'lda xato mijozga yetib boradi?** · O'zi qiladi · Avval so'raydi · Faqat odam — tanlov saqlanadi.
- O'ngda — Ish yo'li. `Ilova` tugunida AI javobi kartasi: savol «Telefon qachon keladi?» → javob «Ertaga yetib keladi.»
- Chapda — harakat paneli, uch yo'l tugmasi: **O'zi qiladi** · **Avval so'raydi** · **Faqat odam** (o'tilgani ✓).
- **Harakat → Vizual o'zgarish:** yo'lni bosish → javob-kartasi o'sha yo'l bo'ylab uchadi:
  - O'zi qiladi → karta to'g'ri Mijoz'ga; soat «1 soniya»; Mijoz qizil, pufak: **Ertaga kutdi — telefon kelmadi.** (31)
  - Avval so'raydi → karta Do'kon egasida to'xtaydi, «Ertaga» ustidan chiziladi, «3 kunda» yoziladi; karta Mijoz'ga yashil; soat «5 daqiqa»; pufak: **Javob to'g'ri keldi.** (20)
  - Faqat odam → `Ilova` kulrang; javobni Do'kon egasi o'zi yozadi; soat «2 soat»; Mijoz kulrang, pufak: **Javob to'g'ri, lekin 2 soat kutdi.** (34)
  3/3 da uch yo'l nomi bilan xaritada qoladi — bu chegaraning uch darajasi. Harakat paneli yopiladi, xarita fokusga (199).
- Natija qatori: «Taxminingiz: … · haqiqatda: O'zi qiladi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: **Chegara — ilova qaysi ishni o'zi qilishi, qaysisini odamga qoldirishi haqida oldindan yozilgan qoida.** (101)
- Qator (xulosadan keyin, kulrang): **4-darsda agentga qo'ygan vakolat chegarangiz ham shunday qoida edi.** (67)
- Tugma (pastki): 3 yo'lni sinang (N/3) → Davom etish
✎ ikki toggle-karta («Ilova so'raydi / o'zi qiladi») + matn-xulosa (ta'rif + 3 daraja + 4-dars gapi, ~400 belgi) → bitta javob uch yo'ldan yuboriladi, natija xaritada (184).
  «Ilova so'raydi» farqi saqlandi — u endi «Avval so'raydi» yo'li (5-ekran testi va arena 2–3 shunga tayanadi) · 3 daraja = yo'l nomlari · 4-dars gapi 1 qatorga (T-052)

## 3 · 1-savol  ← QTest (v2 dagidek, izohlar qisqaradi)
- Savol: **Uchala do'konda ham mijozga AI javob yozadi. Qaysi birida chegara bor?**
- Variantlar: Javobni AI yozib, o'zi yuboradigan do'konda · ✔ Javobni AI yozib, egasi yuboradigan do'konda · Javobni AI ikki marta yozadigan do'konda — kalit `s3: 1`
- To'g'ri izohi: **Chegara AI'ni to'xtatmaydi — uning ishini odamdan o'tkazadi.** (60)
- Xato izohlari: 0 — **Bu javob hech kimdan o'tmaydi: AI yozdi va yubordi.** (51) · 2 — **Ikki marta yozsa ham, javobni hech kim o'qimaydi.** (49)
✎ xato izohlari 62/71 → 51/49 · ko'rinish QTest (DE-203)

## 4 · AI xato qilsa, kimga tegadi?  ← QTushuncha (markaziy; F-1004-14 mexanikasi saqlanadi, vizual xaritaga o'tdi)
- Eyebrow: Tajriba · uch ish
- Sarlavha: **AI xato qilsa, kimga tegadi?** (28)
- Mentor (1-bosqich): **Uchala ishda «O'zi qiladi» ni bosing va Ish yo'liga qarang.** (59)
- Mentor (2-bosqich): **Do'kon egasi hamma ishni o'qiy olmaydi. Qaysi bitta ishda «Avval so'raydi» ni bosasiz?** (86)
- Chapda — uch ish qatori, har birida bir xil ikki tugma **O'zi qiladi** · **Avval so'raydi**:
  - Mijozning savoliga javob — o'zi: AI javobni o'zi yuboradi · so'raydi: javobni do'kon egasi o'qiydi
  - Mahsulot tavsifi (saytdagi matn) — o'zi: AI tavsifni saytga o'zi chiqaradi · so'raydi: do'kon egasi o'qib chiqaradi
  - Manzili tushunarsiz buyurtma — o'zi: ilova buyurtmani o'zi bekor qiladi · so'raydi: ilova avval mijozdan so'raydi
- O'ngda — Ish yo'li, Mijoz tomonida uch o'rin (har ishning odami):
  | Ish | Kimga tegadi | O'zi qiladi → (qizil) | Avval so'raydi → (yashil) |
  |---|---|---|---|
  | Javob | «Zaryadlagich qo'shib berasizmi?» deb so'ragan mijoz | **AI «qo'shib beramiz» dedi; qutida zaryadlagich yo'q.** (52) | **Do'kon egasi o'qidi — xato mijozga yetmadi.** (43) |
  | Tavsif | Tavsifni o'qigan mijoz | **Tavsifda «suvga chidaydi» edi; quloqchin yomg'irda buzildi.** (59) | **Do'kon egasi o'qidi — xato saytga chiqmadi.** (43) |
  | Bekor | Manzilini qisqa yozgan mijoz | **Buyurtmasi bekor bo'ldi; u kechgacha kutdi.** (43) | **Ilova so'radi — mijoz manzilni to'g'riladi.** (43) |
- **Harakat → Vizual o'zgarish:**
  1-bosqich — «O'zi qiladi» → ish-kartasi Ilova'dan to'g'ri Mijoz'ga uchadi, o'sha mijoz o'rni qizil: odam nomi + fakt qatori. «Avval so'raydi» → karta so'rov nuqtasida
  to'xtaydi (javob, tavsif — Do'kon egasi; buyurtma — mijozning o'ziga «?» savoli), ✓, keyin Mijoz yashil + tinch qatori. Uch ishda «O'zi qiladi» ko'rilgach — 2-bosqich.
  2-bosqich — bitta ishda «Avval so'raydi» → shu ish so'rov nuqtasidan o'tadi («Kutmoqda: 1»), qolgan ikkitasi «O'zi qiladi» yo'lidan oqadi; panel yopiladi, xarita fokusga (199).
  «Boshqasini tanlash» (ikkinchi darajali tugma) — tanlovni qaytaradi.
- Xulosa (tanlovga qarab, bittasi):
  - javob: **Xato javob endi mijozga yetmaydi. Qolgan ikki ishni AI qilaveradi — do'kon sekinlashmadi.** (89)
  - tavsif: **Bu ham chegara. Lekin tavsif bir marta yoziladi, savol esa har kuni keladi — xato javob ham.** (92)
  - buyurtma: **Bu ham chegara. Lekin javob har kuni yoziladi, xato javobni esa hech kim o'qimaydi.** (83)
- Tugma (pastki): ① Yana N ishda «O'zi qiladi» ni bosing → ② Bitta ishda «Avval so'raydi» ni bosing → Davom etish
✎ har qatordagi ikki xil uzun tugma → bir xil «O'zi qiladi / Avval so'raydi» (2-ekran yo'l nomlari; nav-yozuv tugma nomi bilan aynan — T-024, hozir «AI o'zi qiladi» degan tugma yo'q) ·
  «kim — fakt» qatori ish qatoridan xaritaga ko'chdi (184) · Mentor UI ta'rifi → harakat (T-047) · xulosalar 100/121/124 → ≤92 · fakt qatorlari ≤60

## 5 · 2-savol  ← QTest (v2 dagidek, izohlar qisqaradi)
- Savol: **Chegara birinchi navbatda qaysi ishga kerak bo'ladi?**
- Variantlar: Ilova mijozdan so'rab qiladigan ishga · Do'kon egasi o'zi qo'lda qiladigan ishga · ✔ Ilova so'ramay, o'zi qiladigan ishga — kalit `s5: 2`
- To'g'ri izohi: **Ilova so'ramay qilgan ishni hech kim to'xtatmaydi — chegara shunga kerak.** (73)
- Xato izohlari: 0 — **Bu ishda ilova avval so'raydi — odam xatoni to'xtatadi.** (55) · 1 — **Qo'lda qilinadigan ishni odamning o'zi bajaradi.** (48)
✎ to'g'ri izoh 2 gap / 224 belgi → bitta gap (QTest); ikki shart («o'zi qiladi + odamga tegadi») takrorlash oynasi 3-kartasida, kartochkada, yakunda va kodda qoladi · xato izohlari ≤60

## 6 · AI chat pastidagi qator  ← QVoqea (PM keys; F-1004-15 `ChatMock` saqlanadi)
- Eyebrow: Biznes olamidan · Yorliq: AI chat · N/5
- Sarlavha: **AI bilan yozishganda har kuni ko'radigan bitta qator** (52)
- Chapda — `ChatMock`: «AI yordamchi» oynasi · mijoz: «Telefon zaryadlagich bilan keladimi?» · AI: «Ha, qutida zaryadlagich bor.» · yozish maydoni · pastda kulrang qator.
- O'ngda — slayd-karta (bitta), nuqtalar 1–5:
  1. **Telefon yoki kompyuterda AI bilan yozishasiz** (44) — Masalan, Gemini, ChatGPT yoki Claude. Savol yozasiz, javob bir necha soniyada keladi.
  2. **Ekranning pastida kichkina bitta qator turadi** (45) — Kulrang, mayda harflar bilan. Qaysi savol yozsangiz ham, u o'sha joyda turaveradi.
  3. Bashorat (ballsiz, «Avval o'zingiz belgilab ko'ring»): **Sizningcha, o'sha qator u yerda nima uchun turadi?**
     · Ilovani yozganlarning nomi ko'rinib tursin · Javob necha so'z bo'lgani ko'rinib tursin · ✔ O'qigan odam javobni tekshirib ko'rsin
     Natija: «Taxminingiz: … · haqiqatda: o'qigan odam javobni tekshirib ko'rsin» (yoki «Taxminingiz to'g'ri chiqdi»).
  4. **O'sha qatorda nima yozilgan** (27) — Taxminan shunday: «AI xato qilishi mumkin — muhim ma'lumotni tekshiring». Aniq so'zlari ilovaga qarab farq qiladi.
     Javobni AI yozdi, unga ishonadigan esa — odam.
  5. Xulosa-bosqichi (bitta yashil xulosa): **Bu chegarani ilovani yaratganlar qo'ygan. Mini-do'koningizda chegarani siz qo'yasiz.** (84)
- **Harakat → Vizual o'zgarish:** «Keyingi bosqich» → chat o'zgaradi: 1 — yozishma; 2 — pastki qator yonadi (matni xira); 3 — bashorat, qator hali yopiq;
  4 — qator matni ochiladi; 5 — chat ostida kichik Ish yo'li: `AI` → `Siz` (qator — «Avval so'raydi» yo'li), chegara nuqtasi yashil yonadi.
- Tugma (pastki): Keyingi bosqich (N/5) → Davom etish
✎ eyebrow «📱 Haqiqiy holat» → «Biznes olamidan», yorliq «AI chat · N/5» (PM-028) · «🎲 Avval o'zingiz belgilab ko'ring» → emojisiz (79) · «Topdingiz!/Adashdingiz —» → QTaxmin ·
  ko'prik-matni (259 belgi, «ya'ni siz» shiori — T-042) → bitta xulosa (84) · 1-slayd sarlavhasi 83 → 44 (misol nomlari matnga) · fakt saqlandi (v2 tekshirgan: Gemini/ChatGPT/Claude pastidagi ogohlantirish)

## 7 · 3-savol  ← QTest (v2 dagidek, izohlar qisqaradi)
- Savol: **AI mahsulot tavsifini yozdi. Chegara qaysi ikki qadam orasiga qo'yiladi?**
- Variantlar: ✔ Yozilgandan keyin, saytga chiqishdan oldin · Saytga chiqqandan keyin, mijoz o'qishidan oldin · Mijoz o'qigandan keyin, buyurtma berishdan oldin — kalit `s7: 0`
- To'g'ri izohi: **Xato tavsif saytga chiqmasdan oldin, odam o'qiganda tutiladi.** (61)
- Xato izohlari: 1 — **Saytdagi tavsifni mijoz istalgan payt ochishi mumkin.** (53) · 2 — **Mijoz o'qigan bo'lsa, xato unga yetib bo'lgan.** (46)
✎ to'g'ri izoh 2 gap → 1 · xato izohlari 79/69 → 53/46

## 8 · Uch chegara  ← QMustaqil (F-1004-17 bitta ustun saqlanadi)
- Eyebrow: Mustaqil ish
- Sarlavha: **Mini-do'koningizga uchta chegara yozing.** (40)
- Varaq-qatori (faqat 2-darsda varaq to'ldirilgan bo'lsa): «O'z varag'ingizdan: {kim} uchun — {yechim}»
- Mentor: **Har ishga bitta savol bering: ilova buni o'zi qilsa va xato qilsa, kimga tegadi?** (80)
- Chiplar: 1-chegara · 2-chegara · 3-chegara (yozilgani ✓)
- Forma: «Ilova qaysi ishni o'zi qilmaydi?» · «Bu qaror kimga tegadi?» · **Saqlash** (o'ngda, 187)
- Javob-qatorlari (yozayotganda, bittadan):
  - qisqa: **Qisqa qoldi: ilova qaysi ishni o'zi qilmaydi?** (45)
  - takror: **Bu ish yuqorida yozilgan — boshqa ishni oling.** (46)
  - inkorsiz: **Qatorni «…maydi» bilan tugating: ilova nimani qilmaydi?** (55)
  - guruh: **«Mijozlar» — qaysi mijoz? U o'sha payt nima qilayotgan edi?** (59)
  - bir xil odam: **Uchala qator bitta odamga tegyapti — boshqasini toping.** (55)
  - tayyor: **Ish ham, odam ham yozildi.** (26)
- Yordam: Ikki savol bering: ilova buni so'ramay qilsa nima bo'ladi? Bu qaror aniq kimga tegadi?
- **Harakat → Vizual o'zgarish:** «Saqlash» → yuqoridagi chip yashil ✓, keyingisi accent; 3/3 da forma yopiladi, ro'yxat fokusga (199):
  sarlavha «Chegaralaringiz», har qator «qoida → odam» + ✎ (tahrirlash).
- Tugma (pastki): ① Birinchi chegarani yozing va saqlang → ② Yana N chegara yozing → Davom etish
✎ varaqning 2-qatori («Bu — shu modulda quradigan mini-do'koningiz. Unga uchta chegara yozasiz.») olindi — sarlavhani takrorlardi (T-048, §223) · javob-qatorlari 68/78/66 → ≤59 ·
  «Chegara — ilova nima qilmasligi» (ta'rifga zid) → «…maydi» ko'rsatmasi · «Saqlash →» → «Saqlash» · ro'yxat sarlavhasi sonsiz (§223)

## 9 · Do'konning boti  ← QTushuncha (juftlash; odam kartasi — telefon)
- Eyebrow: Tajriba · do'kon boti
- Sarlavha: **Har qarorni u tegadigan odamga qo'shing.** (40)
- Mentor: **Bot ham do'koningizning ilovasi. Botning qarorini bosing, keyin u tegadigan odamni.** (83)
- Chapda — botning to'rt qarori (emojisiz): Buyurtma tasdig'ini kechasi soat ikkida yuboradi · Javob kelmasa, har o'n daqiqada qayta yozadi ·
  Bir hafta javob bermagan buyurtmani o'zi bekor qiladi · Chegirma xabarini faqat ko'p buyurtma berganlarga yuboradi
- O'ngda — to'rt odam kartasi (kichik telefon ramkasi ichida nom; tartib o'zgarmaydi): Dars paytida telefonini o'chirib qo'yadigan mijoz · Birinchi marta buyurtma bergan mijoz ·
  Telefonini yostiq yonida qoldiradigan mijoz · Kasal bo'lib yotib qolgan mijoz
- **Harakat → Vizual o'zgarish:** qarorni, keyin odamni bosish → to'g'ri bo'lsa botning xabari o'sha odamning telefoniga tushadi va karta o'zgaradi:
  - yostiq yonida — ekran 02:00 da yonadi, «Buyurtmangiz tasdiqlandi»; qator: **Xabar ertalab ham yetardi — uyqusi bo'lindi.** (44)
  - darsda — bir xil «Javob bering» xabarlari ustma-ust (6 ta); qator: **Darsdan chiqqanda telefoni bir xil xabarga to'lgan edi.** (55)
  - kasal — «Buyurtmangiz bekor qilindi»; qator: **Tuzalib qaraganda buyurtmasi bekor bo'lgan edi.** (47)
  - birinchi marta — ekran bo'sh, «Chegirma −20%» xabari xira chiziq ustida qoladi; qator: **Chegirma bo'lganini umuman bilmadi.** (35)
  Noto'g'ri odam → karta silkinadi, bitta qator: **Bu odamga boshqa qaror tegadi. U qachon telefonga qaraydi?** (58)
  Uchinchi juftlikdan keyin to'rtinchisi o'zi qo'shiladi (hozirgidek). 4/4 da panel yopiladi, to'rt telefon fokusga (199).
- Xulosa: **Bot so'ramay qilgan to'rt qarorning har biri aniq bir odamga tegdi.** (67)
- Yordam (birinchi xatodan keyin): Bu odam qaysi paytda telefoniga qaray oladi? Bot undan nimani kutyapti?
- Nishon qoidasi qatori — §183 standarti (hamma darsda bir xil).
- Tugma (pastki): Yana N juftlikni tuzing → Davom etish
✎ 🌙🔁🧹🏷 va «👆» olindi · ostidagi sabab-matni → telefon kartasi o'zgaradi (184) · «✅ To'rtala qarorni ham bot o'zi qildi — …» → bitta xulosa · eyebrow «Tekshiruv» (test bilan adashardi) → «Tajriba» ·
  xato izohi 93 → 58 · Mentor: «Uch chegarangiz tayyor — endi shu savolni…» (UI ta'rifi) → qisqa harakat

## 10 · Kod yozish  ← QKod (PM 22–25 kompilyator ekrani, F-1004-20)
- Eyebrow: Kod yozish · ikki shart
- Sarlavha: **Chegara kerak ishlarni topadigan kod yozamiz.** (45)
- 1-bosqich — darvoza-savol (pastda savol Q1): **Chegarada odam tasdig'i talab qilingan. Agent ishni boshlashdan oldin nima qiladi?**
  · ✔ Odamdan tasdiq so'raydi · Ishni ikki marta bajaradi · Darhol o'zi bajarib qo'yadi — xato: **Tasdiq ish boshlanishidan oldin so'raladi — kimdan?** (51)
- Mentor (2-bosqich): **Har ishda ikki qiymat bor: oziQiladi — ilova o'zi qiladimi, tegadi — kimga tegadi.** (82)
- Chapda — vazifa (3 band, `kdreq`): Do'kon ro'yxatidan `javobYozish` qaytdi · Do'kon ro'yxatidan `buyurtmaBekor` qaytdi, `hisobotYigish` esa qaytmadi · Bot ro'yxatidan faqat `kechasiXabar` qaytdi
  · Yordam: Bitta ishdan boshlang: `javobYozish` ni ilova o'zi qiladimi? Bu ish odamga tegadimi? Ikkalasi ham ha bo'lsa — nomi ro'yxatga tushadi.
    Qo'shimcha: `narxOzgartirish` ishining `oziQiladi` qiymatini `true` ga o'zgartiring va do'kon ro'yxati endi nima berishini ko'ring.
- O'ngda — «Ikki ro'yxat — bitta funksiya» · Kompilyator — kod yozib, natijasini darhol ko'rsatadigan oyna: chapda kod, o'ngda natija. · **Kompilyatorni ochish**
- Kod (starter), shartlar va tekshiruv xabarlari — v2 dagidek.
- **Harakat → Vizual o'zgarish:** kompilyatorda shartlar bajarilib, «Davom etish» bosilgach → ekranda Ish yo'li: kod topgan uch ish (`javobYozish`, `buyurtmaBekor`,
  `kechasiXabar`) «Avval so'raydi» yo'liga o'tadi, `hisobotYigish`, `adminXabar` «O'zi qiladi» yo'lida qoladi (P-046 — holat koddan).
- Xulosa: **Kod har ishga ikki savol berdi va chegara kerak uchta ishni topdi.** (66)
- Tugma (pastki): ① Javobni belgilang → ② Kodni yozing → Davom etish
✎ «⭐ Qo'shimcha» → «Qo'shimcha» · Mentor 2 gap/172 → 1 gap (82), sarlavhani takrorlamaydi · kod natijasi endi xaritada va bitta xulosada (oldin kompilyator yopilgach hech narsa o'zgarmasdi)

## 11 · 4-savol (yakuniy)  ← QTest (v2 dagidek, izohlar qisqaradi)
- Savol: **Do'kon egasi hamma ishga chegara qo'ydi. Endi nima bo'ladi?**
- Variantlar: Xatolar kamayadi, ish tezligi esa o'zgarmaydi · ✔ Har ish do'kon egasi o'qiguncha turib qoladi · Do'kon egasi faqat eng muhim ishlarni o'qiydi — kalit `s11: 1`
- To'g'ri izohi: **Har ish egasini kutadi — shuning uchun chegara tanlab qo'yiladi.** (64)
- Xato izohlari: 0 — **Xato kamayadi — bu rost. Egasi hammasiga ulguradimi?** (52) · 2 — **Chegara hamma ishda — egasi qaysi birini o'qimay qoldiradi?** (59)
✎ to'g'ri izoh 2 gap → 1 · xato izohlari 70/92 → 52/59 va to'g'ri javob iborasini aytmaydi (S-010; oldin 0-izoh «har ish do'kon egasini kutadi» deb ✔ ni ochardi)

## 12 · O'zingiz o'ylab ko'ring  ← QMustaqil (2 qadam; v2 dagidek, belgilar tozalanadi)
- Eyebrow: O'zingiz o'ylab ko'ring
- Sarlavha: **Uch chegarangizni yoddan ayta olasizmi?** (39)
- Mentor: **Ekranga qaramasdan javob bering: ilova qaysi ishni o'zi qilmaydi va bu kimga tegadi?** (84)
- 1 · Ovoz chiqarib ayting: qaysi ish va qaysi odam (jonli: «Sherigingizga ayting…», A/B navbat — hozirgidek) · taymer tugmasi: **30 soniyani boshlash** · To'xtatish · Yana 30 soniya
- 2 · Endi bir qator yozing — «Ilova ... ni o'zi qilmaydi, bu qaror ... ga tegadi» · yozilgach: ✓ Yozildi
- **Harakat → Vizual o'zgarish:** taymer boshlanadi → halqa sanaydi; qator yozilgach 2-qadam ✓, panel yopiladi (199).
✎ eyebrow «· 2 qadam» olindi (chiplar 1/2 ko'rsatadi, §223) · ▶ ⏹ ↻ belgilari olindi (185)

## 13 · Natijalar  ← QNatija — v2 dagidek (F-1004-21 `pod-card`)

## 14 · Takrorlash  ← QKartochka — 11 karta (pastda)

## 15 · Yakun  ← QYakun (PM: `HwCard`)
- Chiplar: ✓ Dars tugadi · N/4 to'g'ri
- Sarlavha: **Uchta chegarangiz yozildi.** (26)
- CODE STRIKE (arena) — o'rtada, 999px kapsula (192).
- Endi siz bilasiz:
  - Chegara — ilova qaysi ishni o'zi qilishi, qaysisini odamga qoldirishi haqida oldindan yozilgan qoida.
  - Chegara ilova o'zi qiladigan va odamga tegadigan ishga qo'yiladi — ayniqsa muhim yoki xavfli ishga.
  - Har chegarada bu qaror tegadigan aniq odamlar yoziladi.
  - Mini-do'koningizda chegarani ilova emas, siz qo'yasiz.
- Keyingi dars — **O'z Skill'ingizni yozing:** AI uchun o'zingiz yo'riqnoma yozib, uni sinab ko'rasiz.
- Uyga vazifa — `HwCard` (matn o'zgarmaydi; emoji 📝 🗂 👆 olinadi — PM-027).
- Nishonlar (mentorda yo'q).
✎ ta'rif bittaga keldi (A-2) · 4-band «…qo'yadi — ya'ni siz» (shior, T-042) → to'liq gap · 🚀 olindi

---

## Nishonlar (o'zgarmaydi — inglizcha nom, medal emoji o'yin qatlami)
Mirror Check! — Qaror kimga tegishini o'zingiz ko'rdingiz · Rule Maker! — Uch chegarani odami bilan yozdingiz ·
Pair Finder! — To'rt qarorni odamiga qo'shdingiz · Limit Coder! — Chegara kerak ishlarni kod bilan topdingiz

## Qisqa takrorlash oynalari (har ballik test — 3 karta; emoji o'rniga raqam 1·2·3, S-026)
1. **(3) Chegara — oldindan yozilgan qoida**
   1 · Chegara nima — Ilova qaysi ishni o'zi qilishi, qaysisini odamga qoldirishi haqida oldindan yozilgan qoida.
   2 · Chegara ilovani to'xtatmaydi — U bitta ishni ilovadan olib, **odamga qaytaradi**. Qolgan ishlarni ilova avvalgidek o'zi qiladi. (v2 dagidek)
   3 · Do'konda buni qanday ko'rasiz — Javobni AI yozadi, yuborishdan oldin uni **do'kon egasi o'qiydi**. · Savol: Do'koningizda qaysi ish odamdan o'tishi kerak?
2. **(5) Chegara qaysi ishga kerak** — v2 dagidek (So'ralgan ishni odam to'xtata oladi · O'zi qilingan ishni hech kim to'xtatmaydi · Ikki savol yetadi).
3. **(7) AI yozadi, odam o'qib chiqadi** — v2 dagidek (Ilovaning o'zi yozib qo'ygan · Chegara qayerga tushadi · Tavsif ham shunday).
4. **(11) Chegara tanlab qo'yiladi** — v2 dagidek (Chegarani qaysi ish oladi · Hamma ishga qo'ysangiz · Aniq kim).
✎ ⚖️🙋🛒📱⏱🎯🛑🔎🤖 → 1·2·3 · 1-oyna ta'rifi bitta ta'rifga

## Jonli viktorina (12 savol; ✔ o'rni o'zgarmaydi — faqat matn)
1. Chegara nima? — ✔ **Ilova qaysi ishni odamga qoldirishi haqidagi qoida** · Ilova qaysi ishni birinchi qilishi haqidagi qoida · Ilova qaysi mijozga xabar yuborishi haqidagi qoida · Ilova qaysi rangda ko'rinishi haqidagi qoida (✔ 0)
2. Ilova so'raydigan ish bilan o'zi qiladigan ishning farqi nimada? — So'ralgan ish odamga tezroq yetib boradi · O'zi qiladigan ishda odam kamroq xato qiladi · So'ralgan ishni ilova ikki marta bajaradi · ✔ So'ralgan ishni odam to'xtata oladi (✔ 3)
3. Do'kon egasi kuniga faqat bitta ishni o'zi o'qib chiqa oladi. Qaysi ishni tanlagani to'g'ri? — Mijozga o'zi qo'ng'iroq qiladigan ishni · Ilova mijozdan so'rab bajaradigan ishni · ✔ Ilova hech kimdan so'ramay bajaradigan ishni · Ilova hech qachon bajarmaydigan ishni (✔ 2)
4. Ilova mijozning savatidan mahsulotni o'zi olib tashlasa, kimga tegadi? — v2 dagidek (✔ 1 Savatni to'ldirib, to'lovga o'tayotgan mijoz)
5. Tavsif hech kim o'qimay saytga chiqsa, nima bo'ladi? — v2 dagidek (✔ 1 Xato tavsifni mijoz o'qib, ishonib qoladi)
6. Buyurtmani ilova o'zi bekor qilsa, kimga tegadi? — v2 dagidek (✔ 0 Manzilini qisqa yozib yuborgan mijoz)
7. Ilova kech qolgan buyurtmaning yetkazish vaqtini o'zi o'zgartirib qo'ydi. Bu ishga nega chegara kerak? — v2 dagidek (✔ 2 Yangi vaqtga ishonib kutgan mijoz aldanib qoladi)
8. Bot tasdiq xabarini kechasi soat ikkida yuborsa, kimga tegadi? — v2 dagidek (✔ 3 Telefonini yostiq yonida qoldiradigan mijoz)
9. Bir hafta telefoniga qaray olmagan mijozga botning qaysi qarori tegdi? — v2 dagidek (✔ 0 Bot buyurtmani o'zi bekor qilib yubordi)
10. Birinchi marta buyurtma bergan mijoz chegirmadan bexabar qoldi. Botning qaysi qarori shunga olib keldi? — v2 dagidek (✔ 2)
11. Do'kon egasi endi har bir buyurtmani o'zi o'qib chiqishga majbur. Sabab nima? — v2 dagidek (✔ 1 Do'kondagi hamma ishga chegara qo'yib chiqilgan)
12. Ilovaga yangi ish qo'shilmoqchi: mijozga tabrikni o'zi yuborish. Chegara kerakmi — buni kim hal qiladi? — Ilovaning o'zi sinab hal qiladi · Tabrik keladigan mijozning o'zi · **Telefonni ishlab chiqargan kompaniya** · ✔ Ilovani yaratayotgan odam (✔ 3)
✎ 1: ✔ «…o'zi qilmasligi haqidagi qaror» (ta'rifning yarmi, A-2 ga zid) → «…odamga qoldirishi haqidagi qoida»; variantlar bir shaklda «… haqidagi qoida»; 4-variant «sahifani o'zi ochmasligi» ham chegaraga o'xshardi → «qaysi rangda ko'rinishi» ·
  12: «Ilovaga kod yozgan dasturchi» → «Telefonni ishlab chiqargan kompaniya» (dasturchi ham ilovani yaratadi — ikkinchi himoyalanadigan javob edi, S-002)
Fon so'zlari (arena): chegara · qaror · mijoz · javob · bot · odam · tavsif · ilova (+ ✅ 🔴 🛒 — o'yin qatlami). Uyga vazifa kapsulasi: chegara · qaror · mijoz · javob · odam · bot (+ ✅). Kodda {uz,ru} bor.

## Kartochkalar (11)
| Old tomon | Orqa |
|---|---|
| Chegara nima? | Ilova qaysi ishni o'zi qilishi, qaysisini odamga qoldirishi haqida oldindan yozilgan qoida |
| Chegaraning uch darajasi qaysi? | O'zi qiladi · Avval so'raydi · Faqat odam |
| Chegara qaysi ishga qo'yiladi? | Ilova o'zi qiladigan va odamga tegadigan ishga |
| Chegara yozishdan oldin qaysi savol beriladi? | Bu qaror kimga tegadi? |
| Qaror tegadigan odam qanday yoziladi? | Aniq kim ekanini aytib — «hamma» deb emas |
| AI yozgan tavsif saytga chiqishidan oldin nima bo'ladi? | Do'kon egasi o'qib chiqadi |
| Hamma ishga chegara qo'yilsa nima bo'ladi? | Har ish odamni kutadi — do'kon sekinlashadi |
| Bot tasdiqni kechasi yuborsa, kimga tegadi? | Telefonini yostiq yonida qoldiradigan mijozga |
| AI javobni mijozga o'zi yozib yuborsa, kimga tegadi? | «Zaryadlagich qo'shib berasizmi?» deb so'ragan mijozga |
| Mini-do'koningizda chegarani kim qo'yadi? | Siz — ilovani yaratayotgan odam |
| Agentga qo'yilgan chegara nima deb ataladi? | Vakolat chegarasi (inglizcha guardrail) |
✎ +1 karta (uch daraja) · 1-karta ta'rifi bitta · «Ilovani yaratayotgan odam — ya'ni siz» (shior) → savol aniqlashdi

---

## Xabar (o'zgartirilmaydi — PM-027)
- `HwCard` to'liq varianti 3-qadami hali «Yoniga **jabr ko'radigan** bitta odamni qo'ying» — dars bo'yi «kimga tegadi» (v2 da ham shu xabar berilgan, kartaga ataylab tegilmagan).

## B. Kod bosqichida (KOD)
1. `ISH_YOLI` — bitta manba (180): tugunlar (Ilova/Bot · Do'kon egasi · Mijoz), uch yo'l nomi, ish-kartalari, soat yorliqlari. `IshYoli` komponenti: karta uchishi,
   tugun holati (yashil · qizil · kulrang-kutish), «Kutmoqda: N», ✗/✓ belgisi, `reduced-motion` — sakrash. Ekranlar 2, 4, 6 (5-bosqich, kichik), 9 (`Bot`), 10 shundan o'qiydi.
2. 0-ekran `QKirish`: telefon maketi (3 bildirishnoma) + «kimga tegdi → sizga» yorliqlari; `HOOK_OPTS` `ic` olinadi; J-026 (correct:false, maqtovsiz) saqlanadi.
3. 1-ekran `QReja`: chap — `DEMO_QAROR` ro'yxati («Dars oxirida…», ✅ → ✓, 🛒 yorliq olinadi); o'ng — 4 qadam `{t, teg}`.
4. 2-ekran qayta quriladi: `S2_CARDS`, `S2_LEVELS`, toggle va «Kartalarga qaytish» olinadi; `QBashorat` + `QTaxmin` + `useTugadi`; ⛶ (q17), tugadi (q18).
5. 4-ekran: tugma matni ikkala tanlovda yagona «O'zi qiladi» / «Avval so'raydi» (ishga xos ibora `title`/xaritada); `kzg-who` qatori `IshYoli` ga; `KZQ_RES` yangi matn; nav-yozuv (T-024); ⛶ + tugadi.
6. 6-ekran `QVoqea`: eyebrow «Biznes olamidan», yorliq «AI chat · N/5»; «🎲» va «📱» olinadi; `hit/miss` → `QTaxmin`; ko'prik → `QXulosa`; 5-bosqichda kichik `IshYoli`.
7. 9-ekran: `BOT_QARORLAR.ic` olinadi; odam kartasi = kichik telefon ramkasi (191), juftlanganda bot xabari tushadi; `done-mini` → `QXulosa`; xato qatori ≤60; «👆» olinadi; ⛶ + tugadi.
8. 10-ekran: «⭐» olinadi; tugagach `IshYoli` (kod natijasi — `finishPractice` dan keyin, `chegaraKerak` natijasidan) + `QXulosa`. Darvoza-savol — savol Q1 javobiga qarab.
9. 3/5/7/11 `QuestionScreen` → `QTest` ko'rinishi (DE-203, q20); `explainCorrect` bitta qisqa gap, `explainWrong` ≤60 (yuqoridagi matnlar).
10. Ta'rif bitta (A-2): 2-ekran xulosasi · `RECAPS[3].cards[0]` · `FLASHCARDS[0]` · yakun `RECAP[0]` · arena 1-savol ✔ — so'zma-so'z.
11. `RECAPS` `ic` emoji → raqam 1·2·3 (S-026).
12. `FLASHCARDS` 10 → 11 (uch daraja), `QKartochka` (DE-204, q21); 10-karta yangi matn.
13. Yakun `QYakun`: `RECAP[3]` yangi; «🚀» olinadi; `HwCard` dan faqat emoji (📝 🗂 👆) olinadi.
14. 12-ekran: ▶ ⏹ ↻ belgilari olinadi; eyebrow «· 2 qadam» olinadi.
15. 8-ekran: varaqning 2-qatori olinadi; `sfb` qatorlari ≤60; «Saqlash →» → «Saqlash»; ro'yxat sarlavhasi «Chegaralaringiz».
16. MentorNote (yakun): «qatorda bitta aniq odam nomlanganmi?» → «aniq kim nomlanganmi?» (v2 8-ekrandagi tuzatish yakunga yetmagan).
17. `SCREEN_INTENTS` s2 / s4 / s9 / s10 — yangi harakatga mos.
18. Arena: 1-savol ✔ va variantlar, 12-savol 2-variant (✔ indekslari o'zgarmaydi; `lint` q23 3/3/3/3).
19. ru (6-RU bosqichi): arena 8-savol ✔ ru «Клиент, который спит, не выключив телефон» uz bilan mos emas → «Клиент, который оставляет телефон у подушки» (9-ekran va kartochka bilan bir xil).
20. Darvozalar: `npm run gates -- src/6-Modull/PmLesson23.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint-qolip` q13–q21 · surat 1280 + 393.

## Savollar (foydalanuvchi hal qiladi)
- **Q1 · 10-ekran darvoza-savoli** («Agent ishni boshlashdan oldin nima qiladi?») kodning ikki shartiga bog'liq emas, QKod esa bitta ish (P-008, 190).
  A — olib tashlash, ekran to'g'ri vazifadan boshlanadi (tavsiya) · B — qoldirish (v2 dagidek).
- **Q2 · «qaror» → «qoida»** (A-2): chegaraning o'zi «qoida», «qaror» — faqat ilova/bot ishi. A — shunday (tavsiya, T-015) · B — v2 dagidek «oldindan qilingan qaror».

---

## GATE M — o'z tekshiruvim
- [✓] Oldingi/keyingi dars va menyu nomi — `App.jsx`: m6-05 «Claude Skills — nima» → **m6-06 «Ilova o'zi qaror qilsa, kimga tegadi?»** → m6-07 «O'z Skill'ingizni yozing»; nom o'zgarmaydi, yakundagi «Keyingi dars» mos (205).
- [✓] Bitta misol-ip — mini-do'kon (hook o'quvchining o'z telefonidan, 2-ekrandan hammasi do'konda); metafora yo'q · bitta vizual — **Ish yo'li** (2, 4, 6, 9, 10); 6-ekran chat va 9-ekran telefon kartalari — o'sha yo'lning `Ilova`/`Mijoz` uchlari.
- [✓] «Harakat → Vizual o'zgarish» — tushuncha-ekranlar 0, 2, 4, 6, 9 va ish-ekranlar 8, 10, 12; matn-karta qolmadi (2-ekran toggle-kartalari, 9-ekran sabab-matni, 6-ekran ko'prik-matni olindi).
- [✓] O'lchov: sarlavha ≤53 (hammasi bitta qator) · Mentor ≤2 gap, sarlavhani takrorlamaydi (0, 9, 10 qayta yozildi) · xulosa ≤101 · hook javobi 107 · xato izohi ≤60 (3/5/7/11, 8, 9, 10).
- [✓] Atamalar: «vakolat chegarasi (guardrail)» — 4-dars bilan bir xil · «mini-do'kon», «do'kon egasi», «kompilyator» — modul bo'ylab bir xil · yangi: «Ish yo'li», yo'l nomlari «O'zi qiladi · Avval so'raydi · Faqat odam» — dars bo'yi faqat shu so'zlar;
  «avval» ravishi yo'l nomi yonida ishlatilmaydi (4, 9-ekran Mentori qayta yozildi) · siz-forma; zanjir/yorliq ot-shaklda.
- [✓] Testlar: ✔ o'rni o'zgarmagan (s3 = 1 · s5 = 2 · s7 = 0 · s11 = 1; arena 12 — indekslar o'sha) · variantlar uzunligi yaqin (±7) · to'g'ri izoh — bitta gap, «To'g'ri!» siz ·
  xato izohi ✔ iborasini aytmaydi (11-ekran 0-izoh tuzatildi). Izoh: ballik testlarda **3 variant** (PM darslar kodi shunday); 4-variant qo'shilmadi — ✔ o'rni va jonli statistika o'zgarmasin.
- [—] Final tartib-mashqi yo'q (PM darsida final — 11-ekran testi); Mentor tartib aytmaydi.
- [✓] Emoji yuzada yo'q (o'yin qatlami — arena fon belgilari, nishon medallari, podium 🥇🥈🥉 — istisno) · kafolat gaplari yo'q («hech kim to'xtatmaydi» — misol ichidagi holat, umumiy va'da emas).
- [✓] Ichki kodlar ekranda yo'q («4-darsda» — dars raqami, o'quvchi ko'radi) · tarixiy voqea yo'q; 6-ekran fakti (AI chat pastidagi ogohlantirish) v2 da tekshirilgan, «aniq so'zlari farq qiladi» saqlandi · KOD ro'yxati — 20 band.
- [✓] Karta T · P · S · PM ko'rildi: T-014/015 (qaror ↔ qoida, yo'l nomlari) · T-024 (4-ekran tugma = nav-yozuv) · T-042 (bitta ta'rif, «ya'ni siz» shiori olindi) · T-047/048 (0, 8-ekran takror) ·
  T-064 («ekran» so'zi yo'q) · P-014/015 (reja «01 · matn · teg», bosilmaydi) · P-046 (10-ekran holat koddan) · P-062/§223 (8, 12-ekran soni bir marta) · S-002 (arena 12 ikkinchi to'g'ri javob) ·
  S-010 (xato izohlari) · S-026 (takrorlash raqamli) · PM-027 (HwCard) · PM-028/029 (6-ekran «Biznes olamidan», chizilgan chat) · PM-030/107 (atama 2-ekranda, misoldan keyin, bir marta).

