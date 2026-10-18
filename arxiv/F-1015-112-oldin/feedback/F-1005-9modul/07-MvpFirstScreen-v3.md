# 9-Modul (kod: 7-Modul) · 7-dars «Loyiha kuni: MVP — birinchi ekran» — MD v3 (loyiha kuni qolipi)

Fayl: `src/7-Modull/MvpFirstScreenLesson.jsx` · kalit `m7-07` · **8 ekran + 3 amaliyot bloki + kartochkalar = 12** · faqat o'zbekcha (ru — 6-RU bosqichida)
Asos: dars yangi — hamma ekran noldan · qolip: 172-qonun (8 + 3) va 173-qonun (blok repo ustida) · qaror 8 (blok oxirida «O'z g'oyangiz» qadami) ·
namuna: `feedback/F-0929-QA-6modul/08-PipelineProject-v3.md` (tuzilish, matn ko'chirilmadi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hali yo'q.
⚠️ Testlarda to'g'ri javob O'RNI shu MD dan olinadi va keyin o'zgarmaydi: 3-ekran **C**, 5-ekran **A**; arena 12 savol — A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 58 (A1 ≈ 20 · A2 ≈ 23 · A3 ≈ 15; har blokning 5-qadami ≈ 3 daqiqa).
Menyu nomi (DE-205): App.jsx `m7-07` — «Loyiha kuni: MVP — birinchi ekran» (osti: «talabni siz yozasiz, agent quradi») ·
oldingi dars m7-06 «Birinchi odam kirganda nimani ko'rasiz?» · keyingi m7-08 «Yaxshi interfeysdan nimani olasiz?».

---

Tashqi audit (ChatGPT) Filtri: `07-FILTR.md` — 05.10.2026 qo'llandi.
Pilot fidbeki F-1005-84…88 (05.10.2026) qo'llandi — o'zgargan joylar ✎ bilan: 2-ekran bo'laklari ketma-ket (84) · navbatdagi harakat doim ko'rinadi (85/87, SABOQ 11) ·
kartochkalar alohida ekran (88, SABOQ 12 — P-058 dan farq, foydalanuvchi qarori).

## A. Darsning tayanchi — qolip, atamalar, misol-ip

1. **Bitta natija (172.2).** Dars oxirida `maydon` repo'sida «Maydon» saytining birinchi ekrani Backend bilan ishlaydi: vaqt kataklari
   `GET /vaqtlar?kun=` dan keladi, kun almashtirilsa kataklar shu kunniki bo'ladi, Backend javob bermasa sayt buni aytadi;
   animatsiya darsidagi uch harakat va `vaqt-tanladi` hodisasi joyida qoladi. Natija 1-ekranda ko'rsatiladi, uch blokda quriladi, podiumda sanaladi.
   Bugungi yagona yangi ko'nikma — **talab yozish**; kodni Antigravity yozadi. Teg: `dars-07-done`.
2. **Bugungi asosiy fikr (P-013):** Agent talabga tayanib quradi; noaniq yoki aytilmagan joyni taxmin qilishi mumkin — shuning uchun natijani talabning har qatori bo'yicha saytda tekshirasiz.
   Uch qism (qayerda · nima qilsin · nima buzilmasin) — bu kursdagi amaliy qolip, dunyodagi yagona qoida emas: matnda «bu darsda» (audit 2). «Nima buzilmasin» — agentga cheklov, kafolat emas: tekshiruv baribir o'quvchida (audit 4).
3. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2-bo'lim):**
   - **talab** — promptdagi vazifa; uch qismi: **qayerda · nima qilsin · nima buzilmasin** (173.4). 2-ekranda, harakatdan keyin tug'iladi (T-011). «spec», «TZ» yo'q.
     Yaxshi talab — uchala qismi bor va har qatorini saytda tekshirib bo'ladi. Yomon talab — qism tushib qolgan yoki umumiy so'z («chiroyli qil»).
   - **prompt** — agentga yuboriladigan xabar (5–6-Moduldan tanish). Blokdagi «Prompt» qadami va «Nusxalash» qutisi shu nomda qoladi.
     Prompt — xabar, talab — uning ichidagi vazifa; ikkalasi 2-ekranda bir gapda tenglashtiriladi (T-052).
   - **agent** — Antigravity (6-Moduldan tanish). Prozada «agent», blok qadamlarida dastur nomi «Antigravity» (qayerga yuborish).
   - **sayt** (`web/`, `localhost:5173`) · **Backend** (`backend/`, `localhost:3000`) · **Database** (`bandlar` jadvali, Neon). «server», «baza», «frontend» yo'q.
   - **vaqt katagi** (birinchi marta to'liq, keyin «katak») · **bo'sh** · **band** · **kun almashtirgichi** · **hodisa** (`vaqt-tanladi`, analitika darsidan) · **animatsiya** (animatsiya darsidan).
   - **tekshirish** — natijani o'zingiz saytda ko'rib chiqasiz. «sinov» ishlatilmaydi: u modulda real odam ilovani ishlatishi uchun band (10-dars, T-015).
   - «ekran» — faqat MVP ekrani ma'nosida (dars nomi: «birinchi ekran»); dars ekrani o'quvchi matnida «ekran» deb atalmaydi (T-064).
   - «Tayyor» — faqat agent javobidagi so'z (0- va 4-ekran); yakun belgisida ham yo'q (T-015). «maydon» — faqat «Maydon» sayti; forma joylari «qator» deyiladi.
4. **Metafora yo'q.**
5. **Kod yozish — Antigravity** (173.1). Prompt faqat *qayerda · nima qilsin · nima buzilmasin* deydi (173.4) — har qator o'z yorlig'i bilan boshlanadi,
   shuning uchun talabning uch qismi har blokda ko'rinib turadi. Texnologiya aytilmaydi (repo'da). Xato bo'lsa — har blokda bitta gap: «Shu xato chiqdi: {xato}. Tuzat.»
   Prompt matni sen-formada (T-002) — o'quvchi agentga buyruq beradi.
6. **Talab yozish zinapoyasi (uch blok):** A1 — talab tayyor, faqat `{kun}` joyini to'ldirasiz · A2 — «Nima buzilmasin» qatorini o'zingiz yozasiz ·
   A3 — uch qatorni ham o'zingiz yozasiz (namuna «Yordam» ortida). Har blokning 5-qadami — «O'z g'oyangiz»: shu talabni o'z MVP g'oyangiz uchun yozasiz (qaror 8).
7. **Real odam bilan ish bu darsda yo'q** (qaror 7 — 2, 10, 12-darslar). **Uyga vazifa yo'q** (172.4): ish repo'da, keyingi dars shu repo ustida.
8. **Toza yuza (D4):** tugma va variantlarda emoji yo'q; maketlar chizilgan (CSS), logotip yo'q; rang — faqat holat foni (D3).
9. **Navbatdagi harakat doim ko'rinadi (SABOQ 11, F-1005-85/87):** har harakatli ekranda keyingi bosiladigan element halqa va yengil pulsatsiya bilan ajralib turadi
   (kam harakat rejimida pulsatsiya o'chadi, halqa qoladi); Mentor gapi bosqichga qarab almashadi va aynan shu harakatni aytadi.
   Bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlangan variant» natija chiqquncha turadi. Ko'p bo'lakli mashq — bo'laklar bittadan (SABOQ 9, 13).

## Darsning ipi va bitta vizual

- **Misol-ip:** «Maydon» (tayanch 1) — mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan sayt; 4–6-darslarda skeleti, animatsiyasi va analitikasi qurilgan.
  O'quvchi blokda Mentor misolini repo'da quradi, 5-qadamda shu talabni o'z g'oyasiga yozadi. Kutilgan natija doim «Maydon» bilan ko'rsatiladi.
- **Hook:** bir qatorli prompt «Vaqtlarni Backend'dan olib kel.» → agent «Tayyor!» → saytda ikkinchi ro'yxat, kun tanlab bo'lmaydi, katak jonlanmaydi →
  «Nima yetishmadi?» → talab (2-ekran).
- **Bitta vizual — «Maydon» sayt maketi (`MAYDON_KATAKLAR`, dars bo'yi, 163/180):**
  - Brauzer ramkasi `localhost:5173`; sarlavha «Maydon»; kun almashtirgichi «‹ Bugun ›» (ikki kichik strelka, o'rtada kun nomi).
  - Olti vaqt katagi (2 qator × 3): 16:00 · 17:00 · 18:00 · 19:00 · 20:00 · 21:00 — **bo'sh** (oq) yoki **band** (kulrang, «band» yozuvi, bosilmaydi).
  - Ostida bitta mono holat qatori — kataklar qayerdan: «namuna ma'lumot · faylda» (dars boshi) → `GET /vaqtlar?kun=2026-10-10 · Backend` (ulangan) →
    «Backend javob bermadi» (xato holati). 2- va 4-ekranda yonida hodisa sanog'i `vaqt-tanladi · N`.
  - Holatlar: statik (kun almashtirgichi yo'q) · Backend'dan · buzilgan joy (qizil halqa + bir qatorlik kuzatuv) · tuzaldi (yashil halqa, so'nadi) · xato holati (kataklar o'rnida xabar).
  - Animatsiya maketda haqiqiy: bo'sh katak bosilsa kichrayib qaytadi (`transform`); «buzilgan» holatda jonlanmaydi. `prefers-reduced-motion` da harakat yo'q, faqat rang.
  - Namuna sanalari: bugun — Dushanba (`2026-10-05`), namuna bandlar — Shanba (`2026-10-10`) 17:00 va 20:00 (18:00 ataylab bo'sh — 10-dars sinov vazifasi «Shanba 18:00»).
  - Ishlatilishi: 0 (hook, buzilgan) · 1 (tayyor natija) · 2 (talab qismlari) · 4 (talab qatorlarini tekshirish) ·
    A1 o'ng — Backend javobi (brauzer `localhost:3000/vaqtlar?kun=…`), A2/A3 o'ng — shu maketning kattasi (bitta manba).
- **Yakun:** birinchi ekran Backend bilan ishlaydi · keyingi dars — bitta yaxshi namuna va animatsiyalar.

---

## 0 · Kirish — agent «Tayyor» dedi  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Agent «Tayyor» dedi. Nega sayt buzildi?** (39)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: «Maydon» saytidagi kataklarni Backend'dan olmoqchimiz — agentga bir qatorli prompt yozildi. «Yuborish»ni bosing.
  - agent «Tayyor» degach: Agent «Tayyor» dedi — saytga qarang va javobni tanlang. (55)
  - javobdan keyin: Agent «Tayyor» dedi, lekin saytda uch joy buzildi — ular qizil bilan belgilandi. (80)
- Navbatdagi harakat (halqa + yengil pulsatsiya): avval «Yuborish» tugmasi, agent javobidan keyin — uchta variant guruhi.
- Maket (chap): tepada agent chati — o'quvchi pufagi «Vaqtlarni Backend'dan olib kel.» va «Yuborish» tugmasi; ostida «Maydon» maketi **statik** holatda:
  kun almashtirgichi yo'q, olti katak faylda yozilgan namuna (4-darsdagidek), holat qatori «namuna ma'lumot · faylda». Bo'sh katak bosilsa kichrayib qaytadi.
- **Harakat → Vizual o'zgarish:** «Yuborish» → agent pufagi «yozmoqda…» → «Tayyor! Vaqtlar endi Backend'dan keladi.» → maket o'zgaradi:
  kataklar ostida yangi oddiy ro'yxat chiqadi («16:00 — bo'sh», «17:00 — bo'sh» …), kataklar o'zi faylda qoladi, kun almashtirgichi yo'q,
  katak bosilsa endi jonlanmaydi. Shundan keyin savol ochiladi.
- Savol: **Nima yetishmadi?**
  - Agent kuchsiz — boshqa agentni ishlatish kerak edi (50)
  - ✔ Promptda joy yo'q — nimaga tegmaslik ham aytilmagan (51)
  - Prompt juda qisqa — uni uzunroq yozish kerak edi (48)
- Javob — 2-variant: **Aynan!** Bu misolda agent vaqtlarni Backend'dan oldi, lekin qayerga qo'yish va nimaga tegmaslik aytilmagan edi. (102)
- Javob — 1 yoki 3: **Qiziq fikr!** Muammo agentda ham, uzunlikda ham emas: vaqtlar keldi, lekin qayerga qo'yish va nimaga tegmaslik yozilmagan. (108)
- Javobdan keyin: maketda uch joy qizil halqa bilan belgilanadi, har birida bir qator: «Ikkinchi ro'yxat» · «Kun tanlab bo'lmaydi» (bo'sh joy, uzuq chiziq — U-041) ·
  «Katak jonlanmaydi». Ular 2-ekranda tuzatiladi.
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ F-1005-85/87: Mentor gapi bosqichga qarab almashadi (oldin «Yuborish» ko'rsatmasi javobdan keyin ham turardi); navbatdagi element ajralib turadi.

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qadam + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Dars oxirida «Maydon» ekrani Backend bilan ishlaydi.** (52)
- Mentor: Talabni siz yozasiz, kodni agent yozadi. «Maydon» — namuna: har amaliyot oxirida o'z g'oyangizga ham yozasiz.
- Chap — «Dars oxirida»: «Maydon» maketi **tayyor** holatda, bir marta o'zi yuradi (DE-200):
  - «‹ Bugun ›» — olti katak bo'sh; «›» bilan Shanbaga o'tiladi → 17:00 va 20:00 «band» bo'ladi; bo'sh katak kichrayib qaytadi.
  - Holat qatori: `GET /vaqtlar?kun=2026-10-10 · Backend`.
- O'ng — bugungi 3 qadam (tex-karta, bosilmaydi; qadam ostida teg yo'q — 172, F-1003-06):
  - 01 · Backend tanlangan kunning kataklarini beradi
  - 02 · Sayt kataklarni Backend'dan oladi, kun almashadi
  - 03 · Backend javob bermasa, sayt buni aytadi
- Pastki qator (mono, kichik): repo `maydon` · boshlang'ich holat `dars-07-start` · namuna `dars-07-done`
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Talabning uch qismi  ← QTushuncha
- Eyebrow: Tushuncha · talab
- Sarlavha: **Promptga nima qo'shsangiz, agent aniqroq quradi?** (48)
- Mentor (bosqichga qarab, SABOQ 11):
  - bashoratgacha: Kirishdagi bir qatorli promptni to'ldiramiz — avval taxminingizni belgilang. (76)
  - bo'laklar paytida: Bo'lak qo'shilsa, agent saytni qaytadan quradi. Kerak bo'lsa «Qo'shish», kerak bo'lmasa «Kerak emas»ni bosing. (110)
  - tugagach: Har bo'lak qo'shilganda agent saytni qaytadan qurdi. (52)
- Bashorat (ballsiz, 181) birinchi keladi, kartasi halqa bilan ajralib turadi: **Promptga bitta qism qo'shsangiz, nechta buzilgan joy tuzaladi?** · Bittasi · Ikkitasi · Uchalasi.
  Tanlangach yopilmaydi: ixcham qator «TAXMININGIZ · savol · tanlangan variant» natija chiqquncha turadi.
- Chapda prompt kartasi: «Vaqtlarni Backend'dan olib kel.» va ostida uchta bo'sh qator — har birida nomi ko'rinib turadi: **Qayerda · Nima qilsin · Nima buzilmasin**.
- Bashoratdan keyin bo'laklar **bittadan** katta karta bo'lib prompt kartasi ostida chiqadi (F-1005-84, qaror A). Karta: yorliq «Bo'lak N / 4» ·
  savol «Bu bo'lak promptga kerakmi?» · bo'lak matni (katta) · ikki teng tugma «Qo'shish» / «Kerak emas» (navbatdagi harakat — halqa + pulsatsiya).
  Tartib (tuzoq birinchi ham, oxirgi ham emas):
  1. «Kun almashtirilsa, kataklar shu kun uchun Backend'dan kelsin» — joyi: **Nima qilsin**
  2. «Chiroyli va zamonaviy qilib ber» — tuzoq (S-040)
  3. «Katak animatsiyasi va `vaqt-tanladi` hodisasi» — joyi: **Nima buzilmasin**
  4. «Saytdagi vaqt kataklari» — joyi: **Qayerda**
- O'ngda «Maydon» maketi — kirishdagi natija: uch buzilgan joy qizil halqada (ikkinchi ro'yxat · kun tanlab bo'lmaydi · katak jonlanmaydi), hodisa sanog'i `vaqt-tanladi · 0`.
- **Harakat → Vizual o'zgarish:**
  - kerakli bo'lakda «Qo'shish» → bo'lak matni prompt kartasidagi o'z qatoriga uchib tushadi (qator bir lahza yoritiladi) → «agent qaytadan quryapti…» (≈0,8 s) →
    maketda mos joy tuzaladi (halqa yashil, so'nadi); shu payt keyingi bo'lak kartasi chiqadi, tugmalari qurilish tugagach ochiladi:
    - Qayerda → ikkinchi ro'yxat yo'qoladi, kataklarning o'zi Backend'dan keladi (holat qatori `GET /vaqtlar`);
    - Nima qilsin → kataklar ustida kun almashtirgichi paydo bo'ladi; Shanbaga o'tilsa 17:00 va 20:00 band bo'ladi;
    - Nima buzilmasin → bo'sh katak bosilsa kichrayib qaytadi, hodisa sanog'i `vaqt-tanladi · 1`;
  - tuzoqda «Kerak emas» → karta chetga so'nib ketadi, keyingi bo'lak chiqadi.
  - **Xato tanlov** → karta silkinadi, savol qatori o'rnida sabab chiqadi (karta o'smaydi), bosilgan tugma xiralashadi:
    - tuzoqda «Qo'shish» → maket ranglari bir lahza o'zgaradi, buzilgan joylar qoladi: «Umumiy so'z — agent nimani tuzatishni bilmaydi.» (47)
    - kerakli bo'lakda «Kerak emas» → sabab maketdagi qizil yorliq bilan bir so'zda: «Kerak — usiz kun tanlab bo'lmaydi.» (34) ·
      «Kerak — usiz katak jonlanmaydi.» (31) · «Kerak — usiz ikkinchi ro'yxat qoladi.» (37)
  Har qism faqat o'z joyini tuzatadi (holat qo'shilgan qismlardan chiziladi — P-046; bu dars mexanikasi — haqiqiy kodda bitta o'zgarish bir necha joyga tegishi mumkin).
  Kam harakat rejimida uchish va pulsatsiya yo'q — matn qatorga darhol tushadi. Telefonda (bir ustun, maket tepada) agent qurayotganda maket ko'rinadigan joyga suriladi, keyin — keyingi karta.
- Joriy qator (3/3 dan keyin, bitta): Promptdagi bunday vazifa **talab** deyiladi: qayerda, nima qilsin, nima buzilmasin. (79)
- Natija qatori: «Taxminingiz: … · haqiqatda: har qism bitta joyni tuzatdi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu darsda talab uch qismli: qayerda, nima qilsin, nima buzilmasin. Bu mashqda har qism bitta muammoni yopdi. (108)
- Tugadi (199): harakat paneli yopiladi; uch qatorli talab kartasi va tuzalgan maket yonma-yon fokusga; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval taxminingizni belgilang → Har bo'lakka javob bering (N/4) → Davom etish
✎ F-1005-84 (qaror A): to'rt bo'lak endi birdaniga turmaydi — bittadan katta karta, «Qo'shish» / «Kerak emas», xato tanlovga sabab; bo'sh qatorlarda nom ko'rinadi;
  pastki panelga yaqin to'rtinchi bo'lak muammosi yo'qoldi. F-1005-85/87: bashorat yopilmaydi, navbatdagi element ajralib turadi, Mentor bosqichga qarab almashadi.

## A1 · Amaliyot 1 — Backend kun bo'yicha kataklarni beradi  ← amaliyot bloki (≈20 daq)
- Eyebrow: Amaliyot 1 · Backend → Database
- Sarlavha: **Backend tanlangan kunning vaqt kataklarini bersin.** (50)
- Mentor: Talab yozilgan — siz faqat {kun} joyini to'ldirasiz; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Birinchi terminalda: `cd backend`, `npm run start:dev`. Ikkinchisida: `cd web`, `npm run dev`.
  2. **Prompt** — `{kun}` joyiga eng yaqin shanba sanasini `yil-oy-kun` shaklida yozing (masalan `2026-10-10`), «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: `backend/`, yangi yo'l `GET /vaqtlar?kun=` (kun — sana, masalan 2026-10-10).
     > Nima qilsin: shu kun uchun 16:00 dan 21:00 gacha har soatga bitta katak qaytarsin: soat va holat — «bo'sh» yoki «band».
     > Holatni `bandlar` jadvalidan ol: shu kun va soatda yozuv bo'lsa — «band».
     > `http://localhost:5173` dan kelgan so'rovga ruxsat ber (CORS).
     > Tekshirish uchun `bandlar` jadvalida **{kun}** kuni 17:00 va 20:00 namuna bandlari bo'lmasa — qo'sh; bor bo'lsa, qayta qo'shma.
     > Nima buzilmasin: sayt kodi va `bandlar` jadvalining ustunlari. Boshqa joyga tegma.
  3. **Ishga tushirish** — Backend terminali o'zi qayta yukladi, xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — `localhost:3000/vaqtlar?kun=` ga o'z sanangizni qo'shib oching: olti katak, 17:00 va 20:00 — «band». Boshqa sanani yozing — hammasi «bo'sh».
  5. **O'z g'oyangiz** — shu promptni o'z g'oyangizga yozing: g'oyangizning birinchi ekrani Backend'dan qaysi ro'yxatni oladi? Uch qatorni to'ldiring:
     Qayerda: … · Nima qilsin: … · Nima buzilmasin: … — «Bajardim» uchala qator yozilgach ochiladi.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (brauzer maketi `localhost:3000/vaqtlar?kun=2026-10-10`):
  ```
  [ { "soat": "16:00", "holat": "bo'sh" },
    { "soat": "17:00", "holat": "band" },
    { "soat": "18:00", "holat": "bo'sh" },
    { "soat": "19:00", "holat": "bo'sh" },
    { "soat": "20:00", "holat": "band" },
    { "soat": "21:00", "holat": "bo'sh" } ]
  ```
- Hammasi bajarilgach (yashil): Backend tanlangan kunning kataklarini beradi, holatini Database'dan oladi. (74)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-07-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 3 · 1-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Kataklar keldi, lekin `vaqt-tanladi` hodisasi yozilmayapti. Talabda nima yo'q edi?** (10 so'z)
  - Qayerda — agent saytning qaysi joyida ishlashi
  - Nima qilsin — agent qaysi ishni bajarishi
  - ✔ Nima buzilmasin — agent nimaga tegmasligi
  - Texnologiya — agent qaysi kutubxonani olishi
- Kalit: **C** (index 2). Variantlar: 46 · 41 · 41 · 44 belgi — to'g'ri variant eng uzun emas; to'rttalasi bir shaklda («Qism — agent …»).
- To'g'ri izohi: Agent hodisaga tegmaslik kerakligini bilmadi — bu talabda aytilmagan edi.
- Xato izohlari (≤60):
  - A: Joy aytilgan — kataklar o'z joyiga keldi. (41)
  - B: Ish bajarilgan — kataklar Backend'dan keldi. (44)
  - D: Kutubxona repo'da tanlangan. Hodisa nega yo'qoldi? (50)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 2-ekranda «Nima buzilmasin» yo'qligi animatsiyada ko'rindi; savol boshqa belgini — hodisani — so'raydi (§106: slayddan ko'chirib bo'lmaydi).

## 4 · Talabning har qatori — bitta tekshiruv  ← QTushuncha
- Eyebrow: Tushuncha · tekshirish
- Sarlavha: **Agent «Tayyor» dedi. Ishlaganini qanday bilasiz?** (48)
- Mentor (bosqichga qarab, SABOQ 11):
  - bashoratgacha: Avval taxminingizni belgilang, keyin talab qatorlarini bittadan bosasiz. (72)
  - tekshirish paytida: Talabning har qatorini bosing — sayt uni bajaryaptimi, o'zingiz ko'rasiz.
  - 2-qator ishlamaganda: Shanbaga o'tildi, lekin kataklar o'zgarmadi. Agentga tuzatish talabi yozildi — «Qayta tekshirish»ni bosing. (107)
  - tugagach: Har qatorni saytda o'zingiz ko'rdingiz. (39)
- Bashorat (ballsiz) birinchi keladi, kartasi halqa bilan ajralib turadi: **Agent «Tayyor» degan talabning nechta qatori ishlaydi?** · Bittasi · Ikkitasi · Uchalasi.
  Tanlangach yopilmaydi: ixcham qator «TAXMININGIZ · savol · tanlangan variant» natija chiqquncha turadi.
- Navbatdagi element (halqa + pulsatsiya): tartibdagi birinchi tekshirilmagan qator; 2-qator ishlamasa — «Qayta tekshirish» (tuzatish bloki ko'rinadigan joyga suriladi).
- Chapda talab kartasi — 2-ekrandagi uch qator (bitta manba, P-063), qadam-ro'yxati ko'rinishida (163.8, o'tgani ✓):
  1. Qayerda: saytdagi vaqt kataklari
  2. Nima qilsin: kun almashtirilsa, kataklar shu kun uchun Backend'dan kelsin
  3. Nima buzilmasin: katak animatsiyasi va `vaqt-tanladi` hodisasi
- O'ngda «Maydon» maketi — agent ishidan keyin: kun almashtirgichi bor, «‹ Bugun ›», olti katak bo'sh, holat qatori `GET /vaqtlar · Backend`, hodisa sanog'i `vaqt-tanladi · 0`.
- **Harakat → Vizual o'zgarish:** o'quvchi talab qatorini bosadi → maket o'sha qatorni o'zi bajarib ko'rsatadi:
  - 1-qator → kataklar joyi yoritiladi, ikkinchi ro'yxat yo'q → qator ✓, bir qator: «Kataklar o'z joyida, ikkinchi ro'yxat yo'q.» (43)
  - 2-qator → Shanbaga o'tiladi → kataklar **o'zgarmaydi** (hammasi bo'sh qoladi), holat qatorida `GET /vaqtlar` — kun qo'shilmagan → qator qizil.
    Ostida tuzatish talabi (mono, uch qator) va «Qayta tekshirish» tugmasi:
    «Qayerda: kun almashtirgichi. · Nima qilsin: Shanbaga o'tilsa kataklar o'zgarmayapti — tanlangan kun `?kun=` ga qo'shilsin. · Nima buzilmasin: katak animatsiyasi.»
    → «Qayta tekshirish» → «agent tuzatyapti…» → Shanba: 17:00 va 20:00 band, holat qatori `GET /vaqtlar?kun=2026-10-10` → qator ✓.
  - 3-qator → bo'sh katak bosiladi → kichrayib qaytadi, hodisa sanog'i `vaqt-tanladi · 1` → qator ✓, bir qator: «Animatsiya va hodisa joyida.» (28)
  Qatorlar istalgan tartibda tekshiriladi.
- Natija qatori: «Taxminingiz: … · haqiqatda: bu safar uchtadan ikkitasi ishladi, bittasini tuzatdingiz» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Agent «Tayyor» desa ham, talabning har qatorini tekshirasiz. Mos kelmagan joyni aniq yozib, tuzattirasiz. (105)
- Tugadi (199): qadam-ro'yxati yopiladi; uch qatori ✓ talab va maket fokusga; vizual ⛶ ichida.
- Tugma (pastki): Avval taxminingizni belgilang → Har qatorni tekshiring (N/3) → Davom etish
✎ F-1005-85/87: bashorat tanlangach yopilmaydi (oldin karta yo'qolib, nimani bosish bilinmasdi); navbatdagi qator yoki «Qayta tekshirish» ajralib turadi;
  1280×773 da «Qayta tekshirish» pastki panel ostida qolmaydi.

## A2 · Amaliyot 2 — sayt kataklarni Backend'dan oladi, kun almashadi  ← amaliyot bloki (≈23 daq)
- Eyebrow: Amaliyot 2 · Sayt → Backend
- Sarlavha: **Sayt kataklarni Backend'dan olsin, kun almashsin.** (49)
- Mentor: Endi «Nima buzilmasin» qatorini o'zingiz yozasiz — u agentga nimani saqlashni aytadi, tekshiruv esa baribir sizda. «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — ikkala terminal ishlayapti (`npm run start:dev` va `web` da `npm run dev`). Brauzerda `localhost:5173` ni oching: kataklar hali faylda, kun almashtirgichi yo'q.
  2. **Prompt** — `{nima buzilmasin}` joyini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: saytdagi vaqt kataklari (`web/`).
     > Nima qilsin: kun almashtirilsa, kataklar shu kun uchun Backend'dan kelsin — `http://localhost:3000/vaqtlar?kun=`.
     > Kataklar ustida kun almashtirgichi bo'lsin: «‹» va «›» strelkalari, o'rtada kun nomi («Bugun», «Shanba»). Sahifa ochilganda — bugungi kun.
     > «band» katak bosilmasin.
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — namuna qator): «Nima buzilmasin: katak bosilganda kichrayib qaytishi, band bo'lganda rangi silliq o'zgarishi,
     «Band qilindi» belgisi va `vaqt-tanladi` hodisasi. Boshqa joyga tegma.»
  3. **Ishga tushirish** — sayt o'zi yangilandi, terminalda xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — talabning har qatorini tekshiring: kataklar o'z joyida, ikkinchi ro'yxat yo'q · birinchi amaliyotda yozgan shanbangizni bosing —
     17:00 va 20:00 band, boshqa kun — hammasi bo'sh · bo'sh katakni bosing — animatsiya darsidagidek jonlanadi. Mos kelmagan qatorni uch qism bilan agentga yozing.
  5. **O'z g'oyangiz** — shu promptni o'z g'oyangizga yozing: g'oyangizning birinchi ekrani ro'yxatni qanday ko'rsatadi va unda nima buzilmasin? Uch qatorni to'ldiring.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (brauzer maketi `localhost:5173`, dars maketining kattasi):
  - Maydon
  - ‹ **Shanba** ›
  - 16:00 bo'sh · 17:00 band · 18:00 bo'sh
  - 19:00 bo'sh · 20:00 band · 21:00 bo'sh
- Hammasi bajarilgach (yashil): Kataklar Backend'dan keladi, kun almashadi — animatsiya va hodisa joyida. (73)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-07-done`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 5 · 2-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Shanba bosildi, kataklar o'zgarmadi. Agentga nima yozasiz?** (8 so'z)
  - ✔ Bosilgan kunni so'rovga qo'sh, kataklarni yangila
  - Ishlamayapti — butun saytni boshidan qayta yoz
  - Kun almashtirgichini olib tashla, faqat bugun qolsin
  - Kataklarni Backend'siz, yana avvalgidek fayldan ol
- Kalit: **A** (index 0). Variantlar: 49 · 46 · 47 · 50 belgi — to'rttalasi agentga sen-buyruq (T-002), bir shaklda; to'g'ri variant eng uzun emas.
- To'g'ri izohi: Joy va kerakli natija aniq — agent faqat shu joyni tuzatadi.
- Xato izohlari (≤60):
  - B: Agent qayerni tuzatishni bilmaydi — ishlagani ham buziladi. (59)
  - C: Kun almashishi talabda bor — uni olib tashlab bo'lmaydi. (56)
  - D: Faylga qaytsa, kataklar yana faqat bitta kunniki bo'ladi. (57)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## A3 · Amaliyot 3 — Backend javob bermasa, sayt aytadi; butun ekranni tekshirish  ← amaliyot bloki (≈15 daq)
- Eyebrow: Amaliyot 3 · xato holati, tekshirish
- Sarlavha: **Backend javob bermasa, sayt buni aytsin.** (40)
- Mentor: Endi uch qatorni ham o'zingiz yozasiz, namuna «Yordam»da; «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — ikkala terminal ishlayapti, sayt kataklarni Backend'dan ko'rsatyapti.
  2. **Prompt** — vazifa: kataklar kelguncha «Yuklanmoqda…» chiqsin; Backend javob bermasa — «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.»
     Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — namuna talab):
     > Qayerda: saytdagi vaqt kataklari joyi.
     > Nima qilsin: kataklar kelguncha «Yuklanmoqda…» deb yozsin. Backend javob bermasa — «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.»
     > Nima buzilmasin: kun almashtirgichi, katak animatsiyasi va `vaqt-tanladi` hodisasi. Boshqa joyga tegma.
  3. **Ishga tushirish** — sayt o'zi yangilandi, terminalda xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Butun ekranni tekshirish** — (1) Xato holatini ko'rish uchun Backend'ni ataylab to'xtating: terminalida Ctrl+C, sahifani yangilang — sayt «Vaqtlarni yuklab bo'lmadi» deydi; Backend'ni qayta yoqing
     (`npm run start:dev`). (2) Kunni almashtiring va bo'sh katakni bosing — animatsiya joyida. (3) Umami panelida `vaqt-tanladi` hodisasi soni oshgan.
  5. **O'z g'oyangiz** — shu promptni o'z g'oyangizga yozing: ma'lumot kelmasa, g'oyangizning birinchi ekrani nima deydi? Uch qatorni to'ldiring.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (brauzer maketi `localhost:5173`):
  - Maydon
  - ‹ **Shanba** ›
  - (kataklar o'rnida) Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.
- Hammasi bajarilgach (yashil): Birinchi ekran ishlaydi: kataklar Backend'dan keladi, Backend javob bermasa sayt buni aytadi. (93)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-07-done`
- Nishon (bonus): First Screen — oxirgi «Bajardim»da (5-qadam).
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 6 · Natijalar (podium)
- Jonli reyting: 2 savol (skelet infrasi); bloklar «Bajardim» — mentorga signal (`PRACTICE_BASE`, 5-Modul naqshi).
- Savol yorliqlari: 3 — «1 — Talab qismlari» · 5 — «2 — Tuzatish talabi».

## Kartochkalar — alohida ekran (`sflash`, 11 / 12)  ← QKartochka
- F-1005-88: kartochka alohida ekran (P-058 dan farq, foydalanuvchi qarori 05.10; SABOQ 12). Tartib: … A3 → podium → **kartochkalar** → yakun (1-dars naqshi).
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; F-1005-91 B).
- Kartochkalar — 12 ta, matn o'zgarmagan (jadval — «Kartochkalar (12)» bo'limida) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N ·
  birinchi bosishgacha karta yuzi halqa va yengil pulsatsiya bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →
✎ F-1005-88: oldin kartochkalar yakun ichida edi — yakun ichki skroll bilan sig'magan, tepadagi CODE STRIKE kesilgan.

## 7 · Yakun — keyingi dars  ← QYakun
- Eyebrow: Yakun · belgi: ✓ Loyiha kuni tugadi
- Sarlavha: **Birinchi ekran ishlayapti: talab bo'yicha tekshirildi.** (52) — «Tayyor» faqat agent javobida (A-bo'lim T-015)
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz (3):
  - Agentga vazifani uch qism bilan yozasiz: qayerda, nima qilsin, nima buzilmasin
  - Agent «Tayyor» desa ham, talabning har qatorini tekshirasiz
  - Mos kelmagan joyni aniq yozib, tuzatishni so'raysiz
- Uyga vazifa — yo'q (172.4: ish repo'da, keyingi dars shu repo ustida).
- Keyingi dars — «Yaxshi interfeysdan nimani olasiz?»: bitta yaxshi namuna tanlab, animatsiyalarni agent orqali qo'shasiz.
- Nishonlaringiz — N/3
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q; kirishda CODE STRIKE to'liq ko'rinadi.
- Tugmalar: Orqaga · Qaytadan · Yakunlash
✎ F-1005-88: kartochkalar yakundan alohida ekranga o'tdi.

---

## Nishonlar (3)
- **Three Parts** — Talabning qaysi qismi yetmaganini topdingiz (3-ekran, 1-savol)
- **Clear Fix** — Ko'rganingizni aniq talabga aylantirdingiz (5-ekran, 2-savol)
- **First Screen** — Uch amaliyot blokini oxirigacha bajardingiz (A3 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Talabning uch qismi (bu darsdagi qolip)»
   - `Qayerda: saytdagi vaqt kataklari` · Joy aytildi — Ikkinchi ro'yxat paydo bo'lmaydi.
   - `Nima qilsin: kun bosilsa, kataklar kelsin` · Ish aytildi — Kataklar tanlangan kunniki bo'ladi.
   - `Nima buzilmasin: vaqt-tanladi hodisasi` · Tegmaslik aytildi — Hodisa va animatsiya joyida qoladi.
   - Sinfga savol: «Nima buzilmasin» bo'lmasa, agent nimaga tegishi mumkin?
2. 2-savol (5-ekran) — «Ko'rganingiz — aniq talab»
   - `Ishlamayapti, tuzat` · Noaniq — Agent qayerni tuzatishni bilmaydi.
   - `Shanbaga o'tilsa kataklar o'zgarmayapti` · Nima ko'rdingiz — Joy va belgi aniq.
   - `Bosilgan kun ?kun= ga qo'shilsin` · Nima bo'lsin — Agent faqat shu joyni tuzatadi.
   - Sinfga savol: «Ishlamayapti» o'rniga agentga nima yozasiz?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Talab nima? | Promptdagi vazifa | Bu darsda uch qism bilan: qayerda, nima qilsin, nima buzilmasin |
| Talab bilan prompt bir narsami? | Yo'q | Prompt — agentga xabar, talab — uning ichidagi vazifa |
| Talabda «qayerda» bo'lmasa, agent nima qiladi? | Joyni boshqacha talqin qilishi mumkin | Masalan: kataklar ostida ikkinchi ro'yxat |
| «Nima buzilmasin» nimani aytadi? | Agent nimaga tegmasligini — tekshiruv baribir sizda | Masalan: katak animatsiyasi va `vaqt-tanladi` hodisasi |
| «Chiroyli qil» — nega talab emas? | Uni tekshirib bo'lmaydi | Agent nimani o'zgartirishni o'zi taxmin qiladi |
| Bu loyiha talabida React yoki NestJS ni qayta yozish kerakmi? | Yo'q | Stack repo'da tanlangan |
| Agent «Tayyor» desa, nima qilasiz? | Talabning har qatorini tekshirasiz | Har qator — bitta tekshiruv |
| Tekshiruvda qator mos kelmasa-chi? | Ko'rganingizni aniq yozib, tuzatishni so'raysiz | «Ishlamayapti» emas — nima bo'ldi, nima bo'lsin |
| Terminalda xato chiqsa, agentga nima yozasiz? | «Shu xato chiqdi: {xato}. Tuzat.» | Xatoning aniq matni bilan |
| `GET /vaqtlar?kun=2026-10-10` nima qaytaradi? | Shu kunning vaqt kataklari | Har biri: soat va holat — bo'sh yoki band |
| Katak band ekanini Backend qayerdan biladi? | `bandlar` jadvalidan | Shu kun va soatda yozuv bo'lsa — band |
| Backend javob bermasa, sayt nima qiladi? | Buni aytadi | «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.» |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3
1. Talab nima? ✔ Promptdagi vazifa: qayerda, nima qilsin, nima buzilmasin · Agent javobi: qaysi fayllar o'zgargani va «Tayyor» so'zi · Sayt ko'rinishi: tugmalar, kataklar va ularning ranglari · Backend ro'yxati: hamma yo'llar va undagi hamma jadvallar
2. Agent kataklar ostiga ikkinchi ro'yxat qo'shdi. Talabda nima yo'q edi? Nima qilsin — qaysi ishni bajarish · ✔ Qayerda — saytda qaysi joyda ishlash · Nima buzilmasin — nimaga tegmaslik · Texnologiya — qaysi kutubxonani olish
3. Qaysi biri yaxshi talab? Saytni chiroyli va zamonaviy qilib ber, iltimos · Hammasini o'zing bilganingcha tartibga keltir · ✔ Kataklar Backend'dan kelsin, animatsiya qolsin · Kataklar bilan bir narsa qil, yaxshi chiqsin
4. Agent «Tayyor» dedi. Keyin nima qilasiz? Keyingi talabni shu zahoti agentga yuborasiz · Agentdan «rostdanmi?» deb yana so'raysiz · Kodni o'chirib, agentga qayta yozdirasiz · ✔ Talabning har qatorini saytda tekshirasiz
5. «Nima buzilmasin» qatoriga nima yoziladi? ✔ Ishlab turgan narsa: animatsiya va hodisa · Hali qurilmagan funksiyalarning ro'yxati · Qaysi kutubxona bilan yozish kerakligi · Agent ishni necha daqiqada tugatishi kerak
6. `GET /vaqtlar?kun=2026-10-10` nima qaytaradi? Shu kuni band qilganlarning ismlari · ✔ Shu kunning kataklari va holati · Haftadagi hamma kunlarning nomlari · Saytning bosh sahifasi uchun kod
7. Katak «band» ekanini Backend qayerdan biladi? Saytdagi kun almashtirgichining rangidan · Umami'dagi `vaqt-tanladi` sonidan · ✔ `bandlar` jadvalidagi yozuvdan · Brauzerning o'z xotirasidan
8. Tekshiruvda bitta qator mos kelmadi. Agentga nima yozasiz? «Ishlamayapti, tuzat» degan bitta gap · Butun saytni boshidan qayta yozish iltimosi · Boshqa agentga o'tib ko'rish taklifi · ✔ Nima ko'rganingiz va nima bo'lishi kerak
9. Terminalda xato chiqdi. Agentga nima yuborasiz? ✔ Xatoning aniq matni va «Tuzat» so'zi · «Ishlamayapti» degan bitta so'zni · Butun loyihani qayta yozish iltimosini · Faqat «Yordam ber» degan qisqa gapni
10. Bu loyiha talabida React yoki NestJS ni qayta yozish kerakmi? Ha — har talabda kutubxona nomi turadi · ✔ Yo'q — stack repo'da tanlangan · Ha — agent usiz kod yoza olmaydi · Yo'q — agent o'zi boshqasini topadi
11. Backend javob bermayapti. Sayt nima qilishi kerak? Bo'sh oq sahifani ko'rsatib turishi · Eski kataklarni ko'rsataverib turishi · ✔ Vaqtlarni yuklab bo'lmaganini aytishi · Backend'ni o'zi qaytadan yoqib qo'yishi
12. Ju 9 bosildi. Sayt qaysi manzilga so'rov yuboradi? `/vaqtlar` — kun qo'shilmagan · `/bandlar?kun=2026-10-09` · `/kirish?kun=2026-10-09` · ✔ `/vaqtlar?kun=2026-10-09`

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
Uzunlik: to'g'ri variant hech bir savolda eng uzun emas (S-006); 10-savolda «Ha» 2 · «Yo'q» 2; kod-belgi (backtik) faqat to'g'rida emas (7, 12).
Fon so'zlari: talab · qayerda · nima qilsin · nima buzilmasin · `GET /vaqtlar` · `?kun=` · `bandlar` · Antigravity · CORS · `vaqt-tanladi` · Umami · Motion · `localhost:5173` · 17:00

---

## KOD — razrabotkada quriladigan narsalar (dars yangi, `src/skelet/NamunaDars.jsx` dan)
1. `SCREEN_META` 12: hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` 2: 3-ekran **2 (C)**, 5-ekran **0 (A)**;
   `practice: -1` uch blokda. Final tartib-mashqi yo'q (172). `sflash` podium va yakun orasida — F-1005-88 (P-058 dan farq, foydalanuvchi qarori);
   ballik ekran indekslari (4, 7 — `RECAPS`, `Q_LABELS`) o'zgarmadi; eski 11 ekranli saqlov `progRead` da `total` mos kelmagani uchun o'qilmaydi.
2. **`MAYDON_KATAKLAR` + `MaydonMaket`** — bitta manba (180): kun almashtirgichi, 6 katak, holat qatori, hodisa sanog'i, holatlar (statik · Backend · buzilgan joy · tuzaldi · xato);
   0, 1, 2, 4-ekran va A2/A3 o'ng tomoni shundan o'qiydi. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: …`). Logotip/emoji yo'q (D4).
   Hook statik kataklari — 4-dars namunasidan (qaysi soat band — 4-dars MD si bilan bir xil).
3. **`TALAB_QATORLAR`** — bitta `const` (P-063): 2-ekran bo'laklari, 4-ekran talab kartasi va 1-savol oynasi shundan; A2 prompti shu matndan boshlanadi.
4. 0-ekran `QKirish` (maket = agent chati + `MaydonMaket` statik; «Yuborish»dan keyin variantlar ochiladi).
   2-ekran `QTushuncha` (`QBashorat`/`QTaxmin`, bo'lak kartasi — `QKarta` + ikki `QTugma`, `BOLAK_TARTIB` bittadan; uchish — qator matn joyigacha
   `getBoundingClientRect` + `transform`, `--lz` hisobga olinadi; holat qo'shilgan qismlar to'plamidan — 2³ holat), `zoom`, `tugadi`.
   4-ekran `QTushuncha` (uch talab qatori `QChip`, 2-qatorda tuzatish talabi + «Qayta tekshirish»), `QBashorat`/`QTaxmin`, `zoom`, `tugadi`.
   SABOQ 11: `.mf-navbat` (halqa + pulsatsiya, `prefers-reduced-motion` da faqat halqa) · `TaxminIxcham` — tanlangan bashorat qatori · Mentor bosqichga qarab.
5. 3 va 5-ekran `QTest` — matn yuqoridagidek; xato izohlari ≤60.
6. **Amaliyot bloklari** — `ScreenBlok` + `QBlok` + `QPrompt` (skeletdan). Har blok **5 qadam** (173.2 dagi 4 qadam + qaror 8 «O'z g'oyangiz»):
   - 5-qadam — uch qatorli forma (Qayerda · Nima qilsin · Nima buzilmasin), `ccProgress` da saqlanadi, «Nusxalash» bor; «Bajardim» uchala qator bo'sh emasligida ochiladi.
     Qolipda forma qadami yo'q — `QBlok` ga `forma` turi qo'shiladi yoki ulagichda yoziladi (asosiy seans qarori — TAYANCHGA SAVOL 10).
   - `QPrompt` ichida «Yordam» (A2 — namuna qator, A3 — namuna talab), bosilsa ochiladi. Qolipda yo'q bo'lsa — qo'shiladi.
   - 4-qadam nomi: «Brauzerda tekshirish» (A1, A2) · «Butun ekranni tekshirish» (A3). O'ng: A1 — brauzer maketi (JSON), A2/A3 — `MaydonMaket` katta.
   - `ortda`: A1 = `dars-07-start`, A2/A3 = `dars-07-done` (K10).
7. `RECAPS` 2 (kalit = 3 va 5); `Q_LABELS` {3, 5}. `ACHIEVEMENTS` 3, `ACH_TRIGGERS`: 3-ekran → Three Parts, 5-ekran → Clear Fix, A3 oxirgi «Bajardim» → First Screen.
8. Kartochkalar — alohida `sflash` ekran (`ScreenFlashcards`, `QKartochka`, 12 karta; 1-dars naqshi). 7-ekran `QYakun`: `uyga` yo'q, `recap` 3 qator, `keyingi` matni yuqoridagidek.
9. `QUIZ_BANK` 12 savol (✔ 0·1·2·3 ×3); `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008).
10. `LESSON_META.lessonId` — `m7-07-v1`. App.jsx `m7-07` qatoriga `comp` — «qur» bosqichida (asosiy seans).
11. `narrow` faqat 3, 5, 6-ekranlarda (171). Darvozalar: `npm run gates` 12/12 · `lint:olchov` 0 · `lint:emoji` · `lint:layout` 1280/1366 · surat (1280 + 393).

## REPO — `maydon` ga qo'shiladigan narsalar (`dars-06-done` → `dars-07-done`)
1. **`dars-07-done`** = `dars-06-done` + A1–A3 namunasi («Maydon»):
   - `backend/`: `GET /vaqtlar?kun=YYYY-MM-DD` → `[{ soat: '16:00', holat: "bo'sh" | 'band' }, …]` (16:00–21:00, 6 ta); holat — `bandlar` da shu `kun` + `soat` bo'lsa «band»;
     CORS faqat `http://localhost:5173`; namuna yozuvlar: eng yaqin shanba 17:00 va 20:00 (namuna sanasi README da).
   - `web/`: kataklar ustida kun almashtirgichi «‹ Bugun ›» (strelkalar, ochilganda bugun); kataklar `GET /vaqtlar?kun=` dan, kun bosilganda qayta so'raladi; «band» katak bosilmaydi;
     kelguncha «Yuklanmoqda…», Backend javob bermasa «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.»;
     animatsiya darsidagi uch harakat (`transition`, `transform`, Motion) va `vaqt-tanladi` hodisasi o'zgarmagan.
   - README: «Darslar va teglar» jadvaliga 7-dars qatori; «Xatolar» jadvaliga: `Failed to fetch` — Backend ishlamayapti / CORS yoqilmagan · kun bosilsa kataklar o'zgarmaydi — `?kun=` yuborilmayapti.
2. **Shart:** `dars-07-done` teg kurs boshlanishidan oldin upstream'da bo'lishi kerak (6-Modul REPO 3-band bilan bir xil sabab).
3. **Bog'liqlik:** `GET /vaqtlar` va kun almashtirgichi 9-darsda (`POST /bandlar`, band qilish) va 10-darsda (sinov: «kunni almashtirishni sezmadi») tayyor deb olinadi — nomlar bir xil bo'lishi kerak.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **prompt ↔ talab** (modul bo'yi, 6, 8, 9, 11-darslar ham): «prompt — agentga xabar, talab — uning ichidagi vazifa (uch qism)» deb tenglashtirdim. Nega: qaror 8 da «shu promptni…»,
   tayanchda «talab» — ikkala so'z bir darsda yashaydi; sinonim bo'lmasligi uchun farq bir gapda aytiladi. Boshqa darslar ham shu ta'rifda bo'lishi kerak.
2. **«tekshirish», «sinov» emas** (modul bo'yi): o'z natijangizni ko'rib chiqish — «tekshirish». Nega: tayanchda «sinov» = real odam bilan (10-dars); bir ildiz ikki ma'noda yashamasin (T-015).
3. **Kataklar soatlari 16:00–21:00 (6 ta)** — tayanchda yo'q. 4–5-darsdagi statik kataklar shu soatlarda bo'lishi kerak.
4. **`holat` qiymatlari** «bo'sh» / «band», **`kun`** — sana `YYYY-MM-DD`, **`soat`** — `'18:00'` satri. Tayanchda faqat «soat + holat». 4-dars (jadval) va 9-dars (`POST /bandlar`) bilan bir xil bo'lsin.
5. **Kun almashtirgichi** — strelkali «‹ Bugun ›» (GATE M K3). 10-darsdagi «kunni almashtirishni sezmadi» muammosi shu kichik strelkalar haqida.
6. **Xato holati** («Yuklanmoqda…», «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.») — `dars-07-done` ga qo'shdim; tayanch jadvalida yo'q. Nega: A3 uchun uchinchi ish kerak
   va «birinchi ishlaydigan ekran» Backend o'chganda oq qolmasin. Rad etilsa A3 — «butun ekranni tekshirish + bitta tuzatish talabi» bo'ladi.
7. **Namuna bandlar** (2 yozuv, eng yaqin shanba 17:00 va 20:00) — 9-darsgacha `POST /bandlar` yo'q, «band» katakni ko'rsatish uchun kerak. 18:00 ataylab bo'sh (10-dars sinov vazifasi).
8. ~~`dars-07-start` teg yo'q~~ — yopildi (K10): repo'da `dars-07-start` = `dars-06-done`.
9. **Repo manzili va fork/clone** — tayanchda yo'q; `git fetch --tags` URLsiz yozdim. O'quvchi fork qilsa — `git fetch <upstream> --tags` kerak (6-Modul M-q8 kabi).
10. **«O'z g'oyangiz» qadami** (qaror 8, modul bo'yi 6–9, 11): blokning 5-qadami, dars ichidagi uch qatorli forma (saqlanadi, «Nusxalash» bilan). 173.2 «4 qadam» dan farqli —
    qolipga forma turi kerak. Muqobil: faqat «Nusxalash» + o'z loyiha papkasidagi fayl (fayl nomi tayanchda yo'q, shuning uchun tanlamadim).
    172.4 «uyga vazifa yo'q» saqlandi; qaror 8 dagi «o'z MVP si uyda davom etadi» yakunda alohida qator bo'lib chiqmaydi — kerakmi?
11. **Fayl nomlari** (`web/` ichidagi katak komponenti) tayanchda yo'q — promptda papka va tasvir («saytdagi vaqt kataklari (`web/`)») yozdim.
12. **«Band qilindi» belgisi 7-darsda** — `POST /bandlar` hali yo'q; animatsiya darsidagi xatti-harakati o'zgarmaydi deb oldim (buzilmasin ro'yxatida bor).

## Bahsli joylar (ishonchim to'liq emas)
- 2-ekran 2³ holat modeli (har qism faqat o'z joyini tuzatadi) — haqiqiy agentda qismlar bog'liq bo'lishi mumkin; matnda «Bu misolda» deb chegaralandi (T-043).
- 3-ekran va arena 2-savol bir shaklda (to'rt qism) — holat boshqa (hodisa / ikkinchi ro'yxat), §144 bo'yicha qabul qildim.
- Hook «Qiziq fikr!» javobi 115 belgi — ≤120 ichida, lekin namunadagidan uzun.
- A2 Mentor gapi uzun (117 belgi, bitta gap) — «katakdagi animatsiya va hodisani nomlang» ishora; qisqartirilsa o'quvchi nima yozishni bilmay qolishi mumkin.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): m7-06 «Birinchi odam kirganda nimani ko'rasiz?» → **m7-07 «Loyiha kuni: MVP — birinchi ekran»** →
  m7-08 «Yaxshi interfeysdan nimani olasiz?» (App.jsx 313–315-qatorlar, grep bilan).
- [x] Bitta misol-ip («Maydon», repo `maydon`) · metafora yo'q · bitta vizual dars bo'yi — `MaydonMaket` (0, 1, 2, 4; bloklarda uning maketlari).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (bo'lakni qo'shish → buzilgan joy tuzaladi), 4 (qatorni bosish → sayt o'zi bajaradi); 0-ekran ham harakatli.
- [x] SABOQ 11 (F-1005-85/87): harakatli ekranlarda navbatdagi element halqa + pulsatsiya bilan, Mentor shu harakatni aytadi; bashorat natijagacha turadi. SABOQ 12 (F-1005-88): kartochkalar alohida ekran.
- [x] Sarlavhalar ≤55 bitta qator (39–52) · Mentor ≤2 gap (interaktiv ekran va bloklarda 1), sarlavhani takrorlamaydi · xulosalar ≤110 (73–109) ·
  hook javobi ≤120 (95/115) · xato izohlari ≤60 (41–59). Sanoq python bilan (belgi soni).
- [x] Atamalar tayanch bilan bir xil: sayt · Backend · Database · vaqt katagi · band · hodisa · talab · agent; «baza», «server», «bron», «spec», «TZ» yo'q ·
  siz-forma; Antigravity promptlari va 5-savol variantlari sen-formada (T-002) · tugmalar ot-shaklda yoki siz-formada («Har bo'lakka javob bering», «Qayta tekshirish»).
- [x] Testlar: variantlar 41–46 va 46–50 belgi, to'g'ri variant eng uzun emas; strelka/qavs faqat to'g'rida emas; shakl bir xil · ✔ o'rni: 3-ekran C, 5-ekran A · arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (172) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov» — yo'q; «shu zahoti» faqat arena distraktorida, harakat ma'nosida).
- [x] Ichki kodlar o'quvchi matnida yo'q («A1», «T6», «Modul 9» yo'q — blok o'quvchiga «birinchi amaliyot»); «5-dars», «6-dars» o'rniga «animatsiya darsi», «analitika darsi» ·
  tarixiy voqea, real kompaniya raqami yo'q · «KOD» (11) va «REPO» (3) ro'yxati to'liq.
- [x] Karta T · P · S: T-002/011/014/015/029/039/043/047/052/064 · P-001/008/013/015/036/046/052/059/062/063/064/067 · S-001/004/006/008/010/026/040 — ko'rildi.
- [ ] P-028 (tashqi manzil tirikligi): Umami panelidagi bo'lim nomi va repo manzili tayanchda yo'q — «Umami panelida» deb umumiy yozildi, repo URL — TAYANCHGA SAVOL 9.
- [ ] 173.2 «blok = 4 qadam» — qaror 8 bilan 5 qadam bo'ldi; qolipda forma qadami yo'q (TAYANCHGA SAVOL 10, KOD 6) — tasdiq kerak.
