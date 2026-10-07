# 11-Modul · 8-dars «Arxitektura va platforma: web yoki mobil ilova» — MD v3

Fayl: `src/9-Modull/PlatformChoiceLesson.jsx` (kalit `m9-08`, App.jsx `type: 'Kod'`) · **20 ekran** (15 dars ekrani + 2 amaliyot bloki + podium, kartochkalar, yakun) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. TEX, keyssiz (Qaror-0 17). Qolip: texnik dars (QKirish, QReja, QTushuncha, QTest, QKod, QMustaqil, QTartib) + 2 amaliyot bloki (QBlok).
Menyu nomi (DE-205, App.jsx `m9-08`): «Arxitektura va platforma: web yoki mobil ilova» · osti «qismlar, real vaqt nuqtalari, stek — asoslangan tanlov» ·
oldingi `m9-07` «Jonli prototip: qog'ozdan bosiladigan ekrangacha» · keyingi `m9-09` «React Native va Expo: prototip telefonda».
Namuna: 9-Modul `04-MvpArchitecture-v3.md` (chizma, qismlar, jadval, stek, bloklar) · 11-Modul `07-LivePrototype-v3.md` (TEX tuzilishi, QKod, bloklar yangi modelda) · `10-FoundationDay-v3.md` (atama, trek farqi).
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 4-ekran **C** · 7-ekran **A** · 9-ekran **D** · 11-ekran **B** · 14-ekran (final tartib, sentinel `0`) · arena A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa — 0–3 ≈ 15 · 4–9 ≈ 20 · 10–14 ≈ 20 · A1 ≈ 15 · A2 ≈ 12 · podium, kartochkalar, yakun ≈ 5.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (dastur v9 · tayanch 3, 4):** dars oxirida o'quvchining o'z repo'sidagi `README.md` da **«Arxitektura» bo'limi** bor: chizma (uch qism), jadvallar va ustunlar,
   real vaqt nuqtalari, platforma va bir gapli asos, stek. Bo'limni agent yozadi, o'quvchi tekshiradi va GitHub'ga yuboradi; 10-dars A1 talabi «README dagi arxitektura bo'yicha» shunga tayanadi (tayanch 9.19).
   Platforma tanlovi saqlanadi: `pm-m9d8-platforma` = `{ trek: 'web' | 'mobil', javoblar: [4], asos }` (9–14-darslar o'qiydi).
   Mentor misoli — «Maydon Jamoa», repo `maydon-jamoa`, teg `m11-dars-08-done` (`m11-dars-08-start` = `m11-dars-07-done`).
2. **Bugungi asosiy fikr (P-013):** Chizma qismlar, jadvallar va real vaqt nuqtalarini ko'rsatadi; bu modulda platforma faqat foydalanuvchi ochadigan qismni tanlaydi — Backend va Database ikkala trekda bir xil.
3. **Oldingi darslardan keladigan narsa** (tayanch 1.4–1.6, aynan): PRD dagi uchta asosiy funksiya — **o'yin e'loni va qo'shilish** · **o'yin kuni tasdiq** · **chiqish va navbat**
   (darsda nomi bilan; F1/F2/F3 — faqat MD/kodda) · 7-darsdagi prototip (React + Vite, namuna ma'lumot, uch ekran: O'yinlar · O'yin · E'lon berish) · PRD «Keyin» ro'yxati:
   o'yindan oldin eslatma (push) · ro'yxat o'zi yangilanadi (real vaqt). O'quvchining o'z PRD si — `pm-m9d5-prd` (A1 prompti o'qiydi).
4. **Arxitektura (tayanch 1.6, aynan):** ilova (Expo) · Backend (NestJS) · Database (Neon). Jadvallar:
   `oyinchilar` (`id` · `ism` · `telefon` · `parol_hash`) · `oyinlar` (`id` · `kun` · `soat` · `maydon` · `kerak` · `tashkilotchi_id` · `yaratilgan`) ·
   `ishtirokchilar` (`oyin_id` · `oyinchi_id` · `holat`: `qoshildi` / `keladi` / `navbatda` / `chiqdi` · `yaratilgan`).
   «8 / 10»: 10 — `oyinlar.kerak`; 8 — shu o'yinga qo'shilganlar (`ishtirokchilar` dagi qatorlar; navbatdagilar va chiqqanlar sanalmaydi — TAYANCHGA SAVOL 6).
5. **Real vaqt nuqtasi (tayanch 1.6, 2 — aynan):** ekran ochiq turganda boshqa odam tufayli ma'lumoti o'zgarishi mumkin bo'lgan joy: «8 / 10» · qo'shilganlar ro'yxati · o'yin kunidagi «Kelaman» belgilari.
   Bu modulda ilova **ekran ochilganda va pastga tortib yangilaganda so'raydi**; ekran o'zi yangilanishi (WebSocket) — **12-Modulda** (faqat nomi aytiladi, o'rgatilmaydi;
   Mentor roadmap'idagi «Ro'yxat o'zi yangilanadi (real vaqt) — keyinroq (12-Modul)» qatori bilan bitta gap). Web-trekda — sahifa ochilganda va «Yangilash» bosilganda (TAYANCHGA SAVOL 4).
6. **Platforma tanlovi — to'rt savol (tayanch 1.6, aynan; `TORT_SAVOL` — 10, 13-ekranlar, A2, kartochka bitta manbadan, P-063):**
   1) foydalanuvchi mahsulotni qayerda ochadi (yo'lda telefonda / uyda kompyuterda) · 2) telefon imkoniyati kerakmi (kamera, eslatma) · 3) havola bilan tez ulashish muhimmi · 4) qaysi stekni yaxshiroq bilasiz.
   Natija: **web** yoki **mobil** + bir gapli asos. Mentor: mobil — **«o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak»** (aynan).
   Mentor misolidagi to'rt javob (tayanchda faqat asos bor — TAYANCHGA SAVOL 2): 1 — maydonda va yo'lda, telefonda → mobil · 2 — ha, o'yindan oldin eslatma → mobil ·
   3 — ha, e'lonni Telegram guruhiga tashlash qulay → web · 4 — ikkalasi ham tanish → teng. Bitta savol web tomonga tortadi — asos qaysi savol muhimroq ekanini aytadi.
7. **Stek (Qaror-0 12, aynan):** Backend — NestJS (TypeORM), Render · Database — Neon (PostgreSQL) · mobil trek — ilova Expo (React Native), telefonda Expo Go orqali ochiladi ·
   web-trek — sayt React (Vite), Netlify. Trek faqat birinchi qismni almashtiradi.
8. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2):**
   - **qism** — ilova · Backend · Database (9-Modul so'zi). **ilova** — o'yinchi telefonida ochadigan qism (Mentor misolida); web-trekda shu qism — **sayt** (9-Modul so'zi). «frontend», «klient», «komponent» (qism ma'nosida) — yo'q.
   - **chizma (arxitektura)** — qismlar va ular orasidagi so'rovlar chizilgan rasm; jadvallar Database ostida (9-Modul «Chizma (arxitektura)»; 2-ekranda nom qatori). «sxema» — yo'q.
     «chizma» bu darsda faqat arxitektura ma'nosida; 7-darsdagi qog'oz chizmasi — **wireframe** (bu darsda tilga olinmaydi).
   - **jadval · ustun · qator** — 9-Moduldan («Jadvaldagi har qator — bitta …»). Jadval va ustun nomlari — tayanch aynan, mono.
   - **bog'lovchi ustun** — boshqa jadvaldagi qatorni ko'rsatadigan ustun; bu darsdagi nomlarda u `_id` bilan tugaydi — ta'rif qismi emas (08-FILTR 11) (kursdagi `m4-01` so'zi; 3-ekranda bir gap, T-052 — TAYANCHGA SAVOL 5).
   - **real vaqt nuqtasi** — 5-ekranda saralashdan **keyin** tug'iladi (T-011); «real-time» o'quvchi matnida yo'q. **so'raydi · so'rov** — ilova Backend'dan (10-Modul asosiy fe'li). **pastga tortib yangilash** — telefondagi tanish harakat.
   - **WebSocket** — faqat nom (6-ekran `QIzoh`, kartochka); ta'riflanmaydi.
   - **platforma** — mahsulot qayerda ishlashi: **web** (brauzerdagi sayt) yoki **mobil** (telefon ilovasi) — 10-ekranda nom qatori. **trek** — o'quvchi tanlagan yo'l: **web-trek**, **mobil trek** (12-ekran Mentori).
   - **stek** — birga ishlaydigan texnologiyalar to'plami (9-Modul ta'rifi; yozuv — 11-Modul tayanchi va App.jsx `sub` dagidek «stek» — TAYANCHGA SAVOL 1). 12-ekranda nom qatori.
   - **asos** — tanlovning bir gapli sababi. **to'rt savol** — yuqoridagi 6-band.
   - **tashkilotchi · o'yinchi** (ismsiz) · **e'lon · qo'shilish · tasdiq · navbat** · tugmalar «Qo'shilaman» · «Kelaman» · «Yuborish» · «Yangilash».
   - **agent** (Antigravity) · **prompt** (agentga xabar) · **talab** (qayerda · nima qilsin · nima buzilmasin) · **README** · **tekshirish** (o'z ishini ko'rish; «sinov» bu darsda yo'q).
   - **Ishlatilmaydi:** server (prozada), baza, frontend, real-time, sxema, Figma, «ekran» dars ekrani ma'nosida (T-064 — «ekran» faqat ilova ekrani).
9. **Metafora yo'q. Keyssiz.** Qahramon yo'q — vazifani Mentor beradi; odamlar — tashkilotchi, o'yinchi («1-telefon · siz» — sahna rol yorlig'i). Real kompaniya va raqam yo'q.
10. **Toza yuza (185, D4):** tugma, variant, karta va maketlarda emoji yo'q; telefon, brauzer, chizma tugunlari chizilgan (CSS/SVG), logotip yo'q; rang — faqat holat foni. O'yin qatlami (arena, nishon, podium) — mustasno.
11. **Manbalar (o'quvchiga ko'rinmaydi, 06.10.2026):**
    - React Native — reactnative.dev/docs/flatlist: `onRefresh` — «If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the `refreshing` prop correctly.»
      `refreshing` — «Set this true while waiting for new data from a refresh.» (darsda RN kodi yo'q; KOD 15 — 11-dars uchun eslatma).
    - Expo, Expo Go, Netlify, Render, Neon — tayanch 6 (rasmiy hujjat, 06.10). Bu darsda tashqi xizmatda tugma bosilmaydi — faqat Antigravity va `git` (7-darsdagi buyruqlar).
    - Kursdagi so'zlar (grep, 06.10): «Chizma (arxitektura)» — `src/7-Modull/MvpArchitectureLesson.jsx` · «bog'lovchi ustun (foreign key)» — `src/4-Modull/DataIntroLesson.jsx` ·
      «stack» — `MvpArchitectureLesson.jsx` («Yangi stack kerakmi?») · «stek» — 11-Modul tayanch 1.6, App.jsx `m9-08` osti, 10-dars MD Mentori.

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon Jamoa» — mahalladagi mini-futbol uchun jamoa yig'adigan ilova (tayanch 1). 7-darsda prototip bosiladigan bo'ldi; bugun uning ortidagi qismlar chiziladi
  (uch qism → uch jadval → real vaqt nuqtalari) va platforma to'rt savol bilan tanlanadi → stek. O'quvchi xuddi shuni o'z mahsulotida qiladi (13-ekran, A1, A2).
- **Hook:** Maydon Jamoa ilova ham, sayt ham bo'lishi mumkin — ilovada «Qo'shilaman» bosilsa, sayt ham «9 / 10» ni ko'rsatadi → ikkalasi bitta Backend va Database'dan so'raydi →
  «ortidagi qismlar bitta; tanlanadigani — foydalanuvchi ochadigan qism».
- **Bitta vizual — «Maydon Jamoa chizmasi»** (bitta manba `JAMOA_CHIZMA` + `NAMUNA_OYINLAR`, 163/180; SABOQ 21–23):
  - **chapda telefon** (ramka ≈170×272, 191) — «Maydon Jamoa» nomi o'z rangida; ekranlar 7-darsdagidek: **O'yinlar** (o'yin kartalari) · **O'yin** («‹ O'yinlar» · kun va soat · maydon · «8 / 10» ·
    qo'shilganlar — 10 ta joy: to'la doiralar va uzuq chiziqli bo'sh joylar · «Qo'shilaman») · **E'lon berish** (Kun · Soat · Maydon · Nechta odam · «Yuborish»).
    Texnologiya yorlig'i telefon ramkasining **ustida** (SABOQ 23): «ilova · ?» → 12-ekrandan «ilova · Expo»; web-trek ko'rinishida ramka brauzer oynasiga aylanadi: «sayt · React».
    Ba'zi ekranlarda ikki telefon yonma-yon («1-telefon · siz» / «2-telefon · boshqa o'yinchi» yoki «tashkilotchi» / «o'yinchi»).
  - **o'rtada Backend tuguni** — «Backend · NestJS» (texnologiya 12-ekrangacha yozilmaydi: «Backend»); ichida bir qatorli holat («to'liqmi? ✓», «joy bormi? ✓»).
  - **o'ngda Database tuguni** — «Database · Neon»; ichida uch jadval kartasi `oyinchilar` · `oyinlar` · `ishtirokchilar` (3-ekrandan ustunlari bilan; `_id` ustunlaridan ingichka chiziq bog'langan jadvalga).
  - **konvert** — so'rov: telefondan Backend'ga, Backend'dan Database'ga va qaytib (yorlig'ida bir so'z: «e'lon», «so'rov», «javob»). Yangi qator jadvalga sirg'alib kiradi va ~1 s yashil yonadi (SABOQ 19).
  - **real vaqt nuqtalari** — 5-ekrandan telefon ichida accent nuqta-halqa bilan belgilangan joylar.
  - Holatlar: kulrang (hali ochilmagan) → oq (ochilgan) → accent (joriy) → yashil (ishladi). `prefers-reduced-motion` da konvert va pulsatsiya harakatsiz, holatlar bir zumda almashadi (DE-200).
  - **Namuna o'yinlar** (tayanch 9.2, aynan): Shanba, 18:00 · Mahalla maydoni · 8 / 10 — Shanba, 20:00 · Maktab maydoni · 6 / 10 — Yakshanba, 10:00 · Park maydoni · 4 / 8 —
    Yakshanba, 17:00 · Mahalla maydoni · 9 / 10.
  - Ishlatilishi: 0 (telefon + brauzer, keyin chizma tug'iladi) · 1 (tayyor holat) · 2 (uch qism) · 3 (jadvallar) · 5–6 (real vaqt) · 10 (platforma) · 12 (trek almashadi) · 14 (final) · A1, A2 kutilgan natija.
- **Yakun:** o'z README'ngizda arxitektura va asoslangan platforma · keyingi dars — prototipni tanlangan platformada telefonda ochish.

---

## 0 · Kirish — ilova va sayt  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **Ilovada qo'shilgan o'yinchini sayt qanday ko'rdi?** (49)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: Maydon Jamoa ilova ham, sayt ham bo'lishi mumkin — ilovada «Qo'shilaman» ni bosing, keyin saytni yangilang.
  - variantlar ochilgach: Endi o'ngdagi javoblardan birini tanlang.
- Maket (chap, ikki maket yonma-yon, bir balandlikda):
  - **telefon** — ustida yorliq «ilova»; «Maydon Jamoa» O'yin ekrani: «‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · 8 to'la doira + 2 bo'sh joy · «Qo'shilaman» (halqa + yengil pulsatsiya — faol element).
  - **brauzer oynasi** — ustida yorliq «sayt»; o'sha O'yin sahifasi, «8 / 10». Manzil qatorida ↻ «Yangilash» (xira — «Qo'shilaman» bosilgach faollashadi va halqaga o'tadi).
- **Harakat → Vizual o'zgarish:** «Qo'shilaman» → telefonda son «8» → «9» (bir lahza kattalashib qaytadi), 9-doira to'liq bo'ladi, tugma o'chiq «Qo'shildingiz»; brauzerda «8 / 10» qoladi.
  ↻ «Yangilash» → brauzer oynasi bir lahza oqaradi va qayta chiziladi: «9 / 10», 9-doira to'la. Shundan keyin o'ngdagi variantlar faollashadi (bosilmaguncha xira).
- Variantlar (radio, ballsiz):
  - Ilova saytga xabar yubordi (26)
  - ✔ Ikkalasi bitta joydan so'radi (29)
  - Sayt telefondan o'qib oldi (26)
- Javob — 2-variant: **Aynan!** Bu misolda o'yinlar bitta Backend va Database'da turadi — ilova ham, sayt ham shu yerdan so'raydi.
- Javob — 1-variant: **Qiziq fikr!** Ilova saytni tanimaydi: ikkalasi ham o'yinlarni bitta Backend'dan so'raydi.
- Javob — 3-variant: **Qiziq fikr!** Telefon o'chiq bo'lsa ham, sayt shu sonni Backend'dan olishi mumkin — demak, u boshqa joydan oladi. (111)
- Javobdan keyin: ikki maket ostida chizma tug'iladi — ikkalasidan chiziq bitta **Backend** tuguniga, undan **Database** tuguniga (kulrang → oq); telefon ustidagi yorliq «ilova · ?», brauzer ustidagi «sayt · ?».
  Tanlangan variant ixcham qator bo'lib qoladi (SABOQ 11).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ Hook obyekti — darsning o'qitish obyekti (P-001): qismlar va platforma tanlovi. Uchala variant «kim — nima qildi» shaklida, uzunligi 26–29. Maydon Jamoa ikki shaklda — fikr tajribasi (TAYANCHGA SAVOL 7).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun qismlarni chizib, sayt yoki ilovani tanlaysiz.** (52)
- Mentor: Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingiz uchun README'ga yozdirasiz.
- Chap — «Dars oxirida»: Maydon Jamoa chizmasi **tayyor** holatda, bir marta o'zi yuradi (DE-200): telefon «ilova · Expo» → konvert → «Backend · NestJS» → «Database · Neon» (uch jadval kartasi);
  telefon ichida uch accent nuqta (real vaqt nuqtalari); ostida bitta qator: «mobil — o'yinchi maydonda, qo'lida telefon».
- O'ng — qadamlar (tex-karta «01 · matn · teg», bosilmaydi; teglar App.jsx `sub` bilan — P-015):
  - 01 · Qismlarni chizish · `qismlar`
  - 02 · Jadvallar va ustunlar · `oyinlar`
  - 03 · Real vaqt nuqtalarini topish · `real vaqt nuqtalari`
  - 04 · Platforma va stekni tanlash · `stek — asoslangan tanlov`
- Pastki qator (mono, kichik): o'z repo'ngiz — `README.md` «Arxitektura» · Mentor misoli `maydon-jamoa` · tayyor holat `m11-dars-08-done`
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: bu darsda yangi kod paketi o'rnatilmaydi — natija `README.md` bo'limi; vaqt yetmasa A2 uyga vazifaning 1-bandiga o'tadi.

## 2 · Uch qism  ← QTushuncha (bashorat + qadamlar)
- Eyebrow: Tushuncha · qismlar
- Sarlavha: **E'lon yo'lida har qism nima qiladi?** (35)
- Mentor: Avval tashkilotchi telefonida «Yuborish» ni bosing, keyin o'yinchi telefonida «O'yinlar» ni oching.
- Bashorat (ballsiz, yorliq «Avval o'zingiz belgilab ko'ring»; tanlangach ixcham qator bo'lib qoladi): **E'lonni qaysi qism saqlaydi?** · Ilova · Backend · Database
- Chap — ikki telefon yonma-yon: «tashkilotchi» — E'lon berish formasi to'ldirilgan: Kun «Yakshanba» · Soat «10:00» · Maydon «Park maydoni» · Nechta odam «8» · «Yuborish» (halqada) ·
  «o'yinchi» — O'yinlar ro'yxati: Shanba, 18:00 · 8 / 10 — Shanba, 20:00 · 6 / 10 — Yakshanba, 17:00 · 9 / 10 (Yakshanba 10:00 hali yo'q).
- O'ng — chizma: Backend · Database tugunlari kulrang (texnologiya nomisiz). Qadam-chiplari (163.8, tugmaning yonida; alohida ustun emas — SABOQ 21): 1 E'lonni yuboring · 2 Ro'yxatni oching.
- **Harakat → Vizual o'zgarish:**
  1. «Yuborish» → konvert «e'lon» tashkilotchi telefonidan Backend'ga uchadi → Backend oq bo'ladi, ichida qator «to'liqmi? ✓» → konvert Database'ga → Database oq, ichida «+1 e'lon» bir lahza yashil.
     Tashkilotchi telefoni O'yinlar ro'yxatiga qaytadi. O'yinchi telefonida hali hech narsa o'zgarmagan; «O'yinlar» halqaga o'tadi.
  2. O'yinchi telefonida «O'yinlar» → konvert «so'rov» telefon → Backend → Database → konvert «javob» qaytadi → ro'yxatga yangi karta sirg'alib kiradi:
     «Yakshanba, 10:00 · Park maydoni · 0 / 8» (~1 s yashil). Tugunlar ostida bittadan so'z paydo bo'ladi: telefonlar — «ko'rsatadi», Backend — «tekshiradi», Database — «saqlaydi».
- Nom qatori (2/2 dan keyin, bitta): Qismlar va ular orasidagi so'rovlar chizilgan bu rasm — Maydon Jamoa chizmasi (arxitektura).
- Natija qatori: «Taxminingiz: … · haqiqatda: Database» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu misolda ham 9-Moduldagidek uch qism: ilova ko'rsatadi, Backend tekshiradi, Database saqlaydi. (96)
- Tugadi (199): qadam-chiplari yopiladi, ikki telefon va chizma butun enga; vizual ⛶ ichida (q17). Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish
✎ «0 / 8» — e'lon berilgan lahza (hali hech kim qo'shilmagan); namuna o'yinlardagi «4 / 8» — keyingi holat (TAYANCHGA SAVOL 8). Backend tekshiruvi «to'liqmi?» — tayanchda yo'q tafsilot (TAYANCHGA SAVOL 9).

## 3 · Uch jadval  ← QTushuncha (bashorat + saralash, bittadan)
- Eyebrow: Tushuncha · jadvallar
- Sarlavha: **Maydon Jamoa ma'lumotlari qaysi jadvallarda turadi?** (51)
- Mentor: Har bo'lak uchun uni saqlaydigan jadvalni bosing.
- Bashorat (ballsiz; tanlangach ixcham qator): **Maydon Jamoa'ga nechta jadval kerak?** · Bitta · Uchta · Oltita
- Chap — telefon: joriy bo'lakka mos joy yonadi (E'lon berish formasi · Ro'yxatdan o'tish maydonlari · O'yin ekranidagi qo'shilganlar).
- O'ng — Database tuguni: uch jadval kartasi — `oyinchilar` · `oyinlar` · `ishtirokchilar`; har kartada `id` (yoki `yaratilgan`) kulrang, yonida izoh «Database o'zi to'ldiradi»; qolgan ustun joylari uzuq chiziqli (U-041).
  Ostida bo'lak-karta — **bittadan** chiqadi (SABOQ 9, 13), hisoblagich «Joylandi: 0 / 6»:
  1. Kun, soat va maydon → `oyinlar`: `kun` · `soat` · `maydon`
  2. Nechta odam kerak → `oyinlar`: `kerak`
  3. Ism, telefon va parol → `oyinchilar`: `ism` · `telefon` · `parol_hash`
  4. O'yinni kim e'lon qilgani → `oyinlar`: `tashkilotchi_id` (chiziq `oyinchilar` ga)
  5. Kim qaysi o'yinga qo'shilgani → `ishtirokchilar`: `oyin_id` · `oyinchi_id` (ikki chiziq — `oyinlar` va `oyinchilar` ga)
  6. Qo'shildi, keladi, navbatda yoki chiqdi → `ishtirokchilar`: `holat`
- **Harakat → Vizual o'zgarish:** jadval kartasini bosish →
  - to'g'ri → bo'lak kichrayib kartaga uchib kiradi va ustun nomlariga aylanadi (yangi ustun ~1 s yashil); `_id` ustunida bog'langan jadvalga ingichka chiziq chiziladi; hisoblagich oshadi; keyingi bo'lak chiqadi;
  - boshqa jadval → karta silkinadi, bir qator (`QXato`, ≤60):
    - 1: Kun va soat — o'yinniki, odamniki emas. (39)
    - 2: Nechta odam kerakligini e'lon aytadi — u o'yinniki. (51)
    - 3: Ism va parol — odamniki; u ko'p o'yinga qo'shiladi. (51)
    - 4: E'lon bergan odam — o'yinning bir ma'lumoti. (44)
    - 5: Bitta o'yinchi ko'p o'yinga qo'shiladi — alohida jadval. (56)
    - 6: Holat har o'yinda boshqacha — u qo'shilishniki. (47)
  `parol_hash` ustuni yonida kulrang bir qator (tayanch 9.4, aynan): «hash — paroldan yasalgan satr: undan parolni qaytarib bo'lmaydi».
- Joriy qator (5-bo'lakdan keyin, bitta): Boshqa jadvaldagi qatorni ko'rsatadigan ustun bog'lovchi ustun deyiladi; bu darsda ularning nomi `_id` bilan tugaydi.
- Natija qatori: «Taxminingiz: … · haqiqatda: uchta» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu misolda uch jadval: kim — `oyinchilar`, qaysi o'yin — `oyinlar`, kim qaysi o'yinda — `ishtirokchilar`. (105)
- Tugadi (199): bo'lak-karta yopiladi, uch jadval chiziqlari bilan butun enga; vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Bo'laklarni joylang (N/6) → Davom etish

## 4 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol
- Savol: **O'yin kartasida «8 / 10». 8 qaysi jadvaldan sanaladi?** (9 so'z) — kalitda savoldagi son yo'q (S-019)
  - `oyinlar` — o'yin qatoridagi son ustunidan
  - `oyinchilar` — ro'yxatdan o'tgan hamma odamdan
  - ✔ `ishtirokchilar` — shu o'yinga qo'shilganlardan
  - `oyinlar` — `kerak` ustunidagi qiymatdan
- Kalit: **C** (index 2). To'rttalasi «`jadval` — qayerdan» shaklida; `oyinlar` ikki variantda; uzunlik — skript o'lchovi (GATE M).
- To'g'ri izohi: 8 — shu o'yinga qo'shilganlar qatorlari, 10 esa `oyinlar` dagi `kerak` ustuni.
- Xato izohlari (≤60):
  - A: `oyinlar` da qo'shilganlar soni uchun ustun yo'q. (49)
  - B: `oyinchilar` — hamma odam, bu o'yinga qo'shilmaganlar ham. (58)
  - D: `kerak` — 10, ya'ni nechta odam kerakligi. (42)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 5 · Boshqa odam o'zgartiradigan joylar  ← QTushuncha (saralash, bittadan)
- Eyebrow: Tushuncha · real vaqt
- Sarlavha: **Boshqa odam sabab qaysi ma'lumot o'zgaradi?** (42) — ekranning o'zi emas, ma'lumot (08-FILTR 13)
- Mentor: Ekran ochiq turibdi — har bo'lak uchun tanlang: «Ma'lumoti o'zgaradi» yoki «O'zgarmaydi».
- Chap — telefon («1-telefon · siz»), O'yin ekrani: «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · qo'shilganlar doiralari · «Qo'shilaman». Joriy bo'lak telefonda halqada.
  4-bo'lakda telefon «o'yin kuni» ko'rinishiga o'tadi: qo'shilganlar doiralarida «Kelaman» belgisi (✓) bor-yo'q.
- O'ng — bo'lak-karta bittadan, har birida ikki tugma «Ma'lumoti o'zgaradi» · «O'zgarmaydi»; hisoblagich «Topildi: 0 / 3»:
  1. «8 / 10» → Ma'lumoti o'zgaradi
  2. «Shanba, 18:00 · Mahalla maydoni» → O'zgarmaydi
  3. Qo'shilganlar doiralari → Ma'lumoti o'zgaradi
  4. O'yin kunidagi «Kelaman» belgilari → Ma'lumoti o'zgaradi
- **Harakat → Vizual o'zgarish:**
  - «Ma'lumoti o'zgaradi» (1, 3, 4) → telefondagi o'sha joy accent nuqta-halqa bilan belgilanadi, yonida kichik konvert-belgi (boshqa telefondan keladi); hisoblagich oshadi;
  - «O'zgarmaydi» (2) → joy kulrang «e'londa yozilgan» yorlig'ini oladi;
  - adashgan tanlov → karta silkinadi, bir qator (≤60): 1, 3, 4 uchun «Kimdir qo'shilsa yoki tasdiqlasa, bu ma'lumot o'zgaradi.» (56) · 2 uchun «Kun, soat va maydonni tashkilotchi e'londa yozgan.» (50)
- Nom qatori (4/4 dan keyin, bitta): Ekran ochiq turganda boshqa odam tufayli ma'lumoti o'zgarishi mumkin bo'lgan joy — real vaqt nuqtasi.
- Xulosa: Bu misolda uchta real vaqt nuqtasi: «8 / 10», qo'shilganlar va «Kelaman» belgilari. (83)
- Tugadi (199): karta yopiladi, telefon uch belgilangan nuqta bilan fokusga; vizual ⛶ ichida. Tugmalar: Orqaga · Bo'laklarni saralang (N/4) → Davom etish
✎ «Qo'shilaman» tugmasi saralashga kirmadi: o'yin to'lsa u «O'yin to'ldi» ga almashadi (11-dars) — tayanch ro'yxatida yo'q, chalg'itmasin (TAYANCHGA SAVOL 10).

## 6 · Ekran qachon yangilanadi  ← QTushuncha (bashorat + qadamlar)
- Eyebrow: Tajriba · so'rov
- Sarlavha: **O'yinchi qo'shilsa, ekraningizdagi son o'zgaradimi?** (51)
- Mentor: Ikkinchi telefonda «Qo'shilaman» ni bosing va birinchisiga qarang.
- Bashorat (ballsiz; tanlangach ixcham qator): **Birinchi telefonda «8 / 10» qachon «9 / 10» bo'ladi?** · O'zi, o'sha soniyada · Ilova qayta so'raganda
- Chap — ikki telefon: «1-telefon · siz» va «2-telefon · boshqa o'yinchi», ikkalasida O'yin ekrani «Shanba, 18:00 · 8 / 10». Ekranga kirganda 1-telefondan konvert «so'rov» Backend'ga boradi va «8 / 10» bilan qaytadi
  (ochilganda so'rash — kirish animatsiyasi, SABOQ 19).
- O'ng — chizma: Backend → Database (`ishtirokchilar` kartasi, hisoblagich «Shanba 18:00: 8 qator»). Qadam-chiplari: 1 Qo'shiling (2-telefon) · 2 Pastga torting (1-telefon).
- **Harakat → Vizual o'zgarish:**
  1. 2-telefonda «Qo'shilaman» → konvert Backend'ga («joy bormi? ✓») → `ishtirokchilar` ga yangi qator sirg'alib kiradi (8 → 9 qator, yashil) → 2-telefonda «9 / 10».
     1-telefonda «8 / 10» qoladi, ustida kulrang yorliq «eski». 1-telefon ekranining tepasida «↓ Pastga torting» belgisi halqada.
  2. 1-telefonni pastga tortish (sudrash; klaviaturada — «Yangilash» tugmasi) → tepada aylanayotgan belgi → konvert «so'rov» Backend → Database → «javob» qaytadi → «8» → «9» (bir lahza kattalashib qaytadi), «eski» yorlig'i yo'qoladi.
- Natija qatori: «Taxminingiz: … · haqiqatda: ilova qayta so'raganda» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu modulda ilova so'raganda yangilanadi: ekran ochilganda va pastga tortib yangilaganda. (88)
- Qator (`QIzoh`, xulosadan keyin, bitta): Ekran o'zi yangilanadigan yo'llardan biri — WebSocket; roadmap'da u keyinroq ufqda, 12-Modulda. (95; WebSocket yagona yo'l emas — 08-FILTR 14)
- Tugadi (199): qadam-chiplari yopiladi, ikki telefon va chizma fokusga. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish
✎ Telefonda pastga tortish — sudrash harakati; sichqoncha bilan ham sudraladi, `prefers-reduced-motion` da konvert harakatsiz. Bashorat 1-varianti 12-Modulda rost bo'ladi — bu modul haqida savol (S-004).

## 7 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol
- Savol: **Ekran ochiq. Uch o'yinchi «Kelaman» ni bosdi. Tashkilotchi qachon ko'radi?** (10 so'z) — 6-ekranning nusxasi emas: boshqa real vaqt nuqtasi, boshqa odam
  - ✔ Ekranni pastga tortib yangilaganda
  - Har bosishda o'sha soniyaning o'zida
  - Faqat o'yin tugaganidan keyin
  - O'yinchilar unga xabar yozganda
- Kalit: **A** (index 0). To'rttalasi «qachon» savoliga vaqt holi bilan javob beradi.
- To'g'ri izohi: Bu modulda ilova so'raganda yangilanadi: ekran ochilganda yoki pastga tortilganda.
- Xato izohlari (≤60):
  - B: Ekran o'zi yangilanishi — keyinroq ufqda, bu modulda emas. (58)
  - C: Belgilar Database'da allaqachon bor — so'rash yetadi. (53)
  - D: Xabar shart emas — belgilar Database'ga yozilgan. (49)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 8 · «Yangilash» bilan so'rash  ← QKod
- Eyebrow: Kod yozish · so'rov
- Sarlavha: **Sonni qayta so'rab ko'rsatadigan kod yozamiz.** (45) — §19 sarlavha oilasi
- Mentor: Kod oynasida telefon yo'q — pastga tortish o'rnida «Yangilash» tugmasi; ikki qatorni o'zingiz terib yozasiz, qo'lda yozganda o'rganiladi.
- Chap — vazifa (3 band):
  1. Sahifa ochilganda `korsat()` ni bir marta chaqiring.
  2. `yangila` tugmasi bosilganda `korsat` ishlasin: `addEventListener('click', …)`.
  3. Natija oynasida «Yangilash» ni ikki marta bosing — son 8 dan oshib borsin.
- Yordam: Son «…» bo'lib qolsa, `korsat();` qatori oxirida qavslar borligini tekshiring. Tugma ishlamasa — `addEventListener` ga `korsat` qavssiz beriladi.
- Tugma (o'ngda): Bajardim — shartlar ✓ bo'lgach ochiladi.
- O'ng — platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi; ostida bir qator: «Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.») → `HtmlCompiler`, fayllar:
  - `index.html` — tayyor, o'zgarmaydi:
    ```html
    <div class="oyin">
      <p>Shanba, 18:00 · Mahalla maydoni</p>
      <p class="hisob"><span class="son">…</span> / 10</p>
      <button class="yangila">Yangilash</button>
    </div>
    ```
  - `app.js` — tepasi tayyor, pastini o'quvchi yozadi (boshlang'ich holat):
    ```js
    // Backend o'rnida namuna (haqiqiy Backend emas): har so'rov navbatdagi javobni oladi —
    // so'rovlar orasida boshqa o'yinchilar qo'shilgandek (08-FILTR 16)
    let qoshilgan = 8;
    function sora() {
      const javob = qoshilgan;
      if (qoshilgan < 10) qoshilgan = qoshilgan + 1;
      return javob;
    }

    const son = document.querySelector('.son');
    const yangila = document.querySelector('.yangila');
    function korsat() {
      son.textContent = sora();
    }
    // 1) sahifa ochilganda korsat() ni shu yerda chaqiring
    // 2) «Yangilash» bosilganda korsat ishlasin — shu yerda
    ```
- Kod oynasi sarlavhasi: `app.js — ochilganda va «Yangilash» da so'rang`
- Shart xabarlari (≤60):
  - 1 — `korsat()` sahifa ochilganda bir marta chaqirilsin. (51)
  - 2 — `yangila` ga `click` bilan `korsat` ulansin. (44)
- **Harakat → Vizual o'zgarish:** o'quvchi yozadi → natija oynasi qayta ochiladi: 1-qatordan keyin «… / 10» → «8 / 10» (sahifa ochilganda so'raldi); 2-qatordan keyin «Yangilash» → «9 / 10» → yana bosilsa «10 / 10».
  Har shart bajarilganda ✓. Kod o'zgarsa natija oynasi boshidan ochiladi (yana «8»). «Bajardim» → panel yopiladi, natija oynasi fokusga (199).
- Xulosa: Son ochilganda bir marta, keyin har «Yangilash» da so'raladi; so'ralmasa, eskisi turadi. (88)
- Qator (`QIzoh`, xulosadan keyin): Telefon ilovasida «Yangilash» o'rnida — ro'yxatni pastga tortish. (65)
✎ `sora()` — Backend o'rnidagi namuna funksiya (kod oynasida Backend yo'q); izohda shunday yozilgan (T-045). Haqiqiy so'rov — 10-darsdan `fetch` bilan (agent yozadi).

## 9 · 3-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 3-savol
- Savol: **«Yangilash» bosilganda son yangilansin. Qaysi qatorni qo'shasiz?** (7 so'z)
  - `son.addEventListener('click', korsat)`
  - `yangila.addEventListener('click', sora)`
  - `yangila.addEventListener('load', korsat)`
  - ✔ `yangila.addEventListener('click', korsat)`
- Kalit: **D** (index 3). To'rttalasi «`element.addEventListener('hodisa', funksiya)`» shaklida; `yangila`, `click`, `korsat` har biri uchta variantda (kalit so'z faqat to'g'rida emas).
- To'g'ri izohi: Tugma bosilganda `korsat` ishlaydi: u so'raydi va javobni ekranga yozadi.
- Xato izohlari (≤60):
  - A: `son` — yozuv, uni hech kim bosmaydi. (37)
  - B: `sora` javob oladi, lekin ekranga yozmaydi. (43)
  - C: `load` — ochilish hodisasi, tugma bosilishi emas. (49)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 10 · To'rt savol  ← QTushuncha (bashorat + savollar bittadan)
- Eyebrow: Tushuncha · platforma
- Sarlavha: **Maydon Jamoa sayt bo'lsinmi yoki ilova?** (39)
- Mentor: To'rt savolga Maydon Jamoa misolida javob bering — har javob bitta signal: qaysi tomonga tortadi?
- Bashorat (ballsiz; tanlangach ixcham qator): **Maydon Jamoa uchun qaysi biri?** · Sayt — brauzerda · Ilova — telefonda
- Chap — telefon: Maydon Jamoa O'yinlar ro'yxati (to'rt namuna o'yin).
- O'ng — ikki ustun (bir balandlikda, SABOQ 1): **web** (kichik brauzer ramkasi) · **mobil** (kichik telefon ramkasi); o'rtada ingichka «teng» chizig'i. Ustunlar ostida savol-karta — **bittadan**, har birida ikki chip:
  1. Foydalanuvchi mahsulotni qayerda ochadi? — ✓ «Maydonda va yo'lda, telefonda» → mobil · «Uyda, kompyuterda» → `QXato`: O'yinchi o'yin oldidan maydonda — qo'lida telefon. (50)
  2. Telefonning o'z imkoniyati kerakmi — kamera, joylashuv yoki telefonga keladigan eslatma? — ✓ «Ha — o'yindan oldin eslatma» → mobil (signal ostida kulrang: «Mobil tomonga tortadi — web'da umuman yo'q degani emas.») · «Yo'q — hammasi ekranda» → `QXato`: PRD dagi «Keyin» ro'yxatida eslatma bor. (40)
  3. Odamlar uni hech narsa o'rnatmasdan havoladan darhol ochishi muhimmi? — ✓ «Ha — e'lonni Telegram guruhiga tashlash» → web · «Yo'q — hech kim ulashmaydi» → `QXato`: Hozir o'yinchilar Telegram guruhida yig'ilishadi. (49)
  4. Qaysi stekni yaxshiroq bilasiz? (kartada kulrang yorliq «Qurish sharti»; 1–3 — «Foydalanuvchi signali», 08-FILTR 4) — ✓ «Ikkalasini — React va React Native» → teng · «Hech birini» → `QXato`: Kursda React'da ham, React Native'da ham yozgansiz. (51)
- **Harakat → Vizual o'zgarish:** to'g'ri chip → chip kichik signal-belgiga aylanib o'z ustuniga uchib tushadi (web / mobil) yoki «teng» chizig'ida qoladi; ustunlarda son yo'q (signallar sanalmaydi — 08-FILTR 1); keyingi savol chiqadi.
  4/4 da: Mentorning hal qiluvchi signallari — 1 va 2 — accent halqa oladi → mobil ustuni accent bo'ladi, chapdagi telefon ustidagi yorliq «ilova · ?» → «ilova · mobil»; pastda asos qatori yoziladi (tayanch, aynan):
  «Mobil — o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak.»
- Nom qatori (4/4 dan keyin, bitta): Mahsulot qayerda ishlashi platforma deyiladi: web — brauzerdagi sayt, mobil — telefon ilovasi.
- Natija qatori: «Taxminingiz: … · Mentor misolida: ilova — telefonda» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu misolda hal qiluvchi signal — o'yinchi maydonda, qo'lida telefon; havoladan ochish web tomonda qoldi. (104)
- Qator (`QIzoh`, xulosadan keyin): Signallar sanalmaydi: asos qaysi signal muhimroq ekanini aytadi. (64)
- Tugadi (199): savol-karta yopiladi, ikki ustun va asos qatori fokusga; vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Savollarga javob bering (N/4) → Davom etish
✎ 3-savolda to'g'ri javob web tomonga tortadi — tanlov sanoq emas, hal qiluvchi signal va asos (TAYANCHGA SAVOL 2; 08-FILTR 1). Darsda «web'da eslatma bo'lmaydi» deyilmaydi (T-045; Shubhali 1).

## 11 · 4-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 4-savol
- Savol: **Foydalanuvchilar mahsulotni kompyuterda ochadi, havola ulashadi. Qaysi platforma?** (8 so'z) — Maydon Jamoa emas, boshqa holat (§106)
  - Mobil — telefon ko'pchilikning cho'ntagida
  - ✔ Web — kompyuterda ochiladi, havola ulashiladi
  - Web — sayt ilovadan chiroyliroq ko'rinadi
  - Mobil — eslatma telefonga kelishi mumkin
- Kalit: **B** (index 1). Ikki «Web», ikki «Mobil» (shakl-telli yo'q, §147); to'rttalasi «platforma — sabab» shaklida.
- To'g'ri izohi: Kompyuterda ochiladi va havola bilan ulashiladi — ikkala javob web tomonga tortadi.
- Xato izohlari (≤60):
  - A: Telefon bor, lekin bu odamlar mahsulotni kompyuterda ochadi. (60)
  - C: Ko'rinish to'rt savolga kirmaydi. (33)
  - D: Savolda eslatma kerak deyilmagan. (33)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 12 · Trek va stek  ← QTushuncha (ikki holatni almashtirish)
- Eyebrow: Tushuncha · stek
- Sarlavha: **Web yoki mobil: qaysi qism boshqa texnologiyada?** (48)
- Mentor: Tanlangan platformadagi yo'lingiz trek deyiladi — mobil trek yoki web-trek; ikkalasini almashtirib ko'ring.
- Chap — telefon (Maydon Jamoa, O'yinlar ro'yxati). O'ng — chizma: Backend · Database. Tepada kalit (ikki tugma): «mobil trek» · «web-trek» (birinchisi halqada). Hisoblagich «Ko'rildi: 0 / 2».
- **Harakat → Vizual o'zgarish:**
  - «mobil trek» → telefon ramkasi, ustida yorliq «ilova · Expo (React Native)», ostida chip «telefonda — Expo Go orqali»; Backend tuguniga «NestJS · Render», Database tuguniga «Neon (PostgreSQL)» yoziladi;
  - «web-trek» → ramka brauzer oynasiga aylanadi (o'sha O'yinlar ro'yxati), yorliq «sayt · React (Vite)», chip «Netlify»; Backend va Database yorliqlari o'zgarmaydi — bir marta yengil yonib, «o'zgarmadi ✓» belgisi chiqadi.
  2/2 dan keyin kalit yana mobilga qaytadi (Mentor misoli).
- Nom qatori (2/2 dan keyin): Birga ishlaydigan texnologiyalar to'plami — stek; 9-Modulda Maydon uchun ham stek tanlagansiz.
- Xulosa: Bu modulda trek faqat birinchi qismni almashtiradi: Backend va Database ikkala trekda bir xil. (94)
- Qator (`QIzoh`, xulosadan keyin): Stek tanish bo'lsa, agent yozgan kodni o'zingiz tekshirasiz. (60)
- Tugadi (199): kalit yopiladi, chizma butun enga (mobil holatda); vizual ⛶ ichida. Tugmalar: Orqaga · Ikki trekni ko'ring (N/2) → Davom etish

## 13 · Mahsulotingiz platformasi  ← QMustaqil (bitta katta karta, ketma-ket — SABOQ 29)
- Eyebrow: Mustaqil ish · platforma
- Sarlavha: **Mahsulotingiz uchun platformani tanlang** (39)
- Mentor: To'rt savolga o'z mahsulotingiz uchun javob bering, keyin trekni tanlab, asosini bir gapda yozing.
- Tepada — ixcham chiziq: 1 · 2 · 3 · 4 · Hal qiluvchi · Trek · Asos (joriysi accent, bajarilgani ✓). Bir vaqtda bitta katta karta.
- Kartalar (`TORT_SAVOL` dan; har javob chipi bosilgach ustunlarga bitta belgi tushadi — 10-ekrandagi ikki ustun kichik ko'rinishda kartaning o'ng tomonida):
  1. Foydalanuvchingiz mahsulotni qayerda ochadi? — «Yo'lda yoki ko'chada, telefonda» (mobil) · «Uyda yoki darsda, kompyuterda» (web) · «Ikkalasida ham» (teng)
  2. Telefonning o'z imkoniyati kerakmi — kamera, joylashuv yoki eslatma? — «Ha, kerak» (mobil) · «Yo'q, kerak emas» (teng)
  3. Odamlar uni hech narsa o'rnatmasdan havoladan ochishi muhimmi? — «Ha, muhim» (web) · «Unchalik emas» (teng)
  4. Qaysi stekni yaxshiroq bilasiz? (yorliq «Qurish sharti») — «React — sayt» (web) · «React Native — ilova» (mobil) · «Ikkalasini» (teng)
  5. Hal qiluvchi — «Qaysi signal qaroringizga eng ko'p ta'sir qiladi?» — to'rt javobingiz chip bo'lib turadi, bir yoki ikkitasini bosasiz.
  6. Trek — ikki katta tugma: «Web-trek» · «Mobil trek» (ustunlarda son yo'q — tanlov o'quvchiniki).
  7. Asos — bitta maydon: «Nega shu platforma? Bir gapda» (ipucha «masalan: o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak»).
- Yordam (ochiladigan): Bir savol boshqa tomonga tortsa, asosda mahsulotingiz uchun qaysi savol muhimroq ekanini yozing.
- Shart xabari (Saqlash bosilganda, ≤60): «Javoblar, hal qiluvchi signal va asos kerak.» (44)
- Tugma (o'ngda): Saqlash → `pm-m9d8-platforma` = `{ trek, javoblar: [4], halQiluvchi: [1–2], asos }` (08-FILTR 21).
- **Harakat → Vizual o'zgarish:** chip → belgi o'z ustuniga uchadi, karta keyingisiga suriladi; trek tugmasi → chizmaning kichik nusxasida birinchi qism telefon yoki brauzer ramkasiga aylanadi;
  «Saqlash» → karta bitta ixcham qatorga yig'iladi (SABOQ 17): «Platforma · mobil trek · asos ✓» (yoki «web-trek»).
- Xulosa (saqlagach): Platformangiz va asosingiz saqlandi — amaliyotda README'ga shu yoziladi. (72)
- Tugma (pastki): Saqlang → Davom etish
✎ `javoblar` — tanlangan chip matni (4 satr). Kalit oldin bor bo'lsa — kartalar to'ldirilgan holda ochiladi, o'zgartirsa bo'ladi.

## 14 · Qo'shilish yo'li (final)  ← QTartib (ball · sentinel `0`)
- Eyebrow: Yakuniy · tartib
- Sarlavha: **Qo'shilish boshqa telefonga qaysi tartibda yetadi?** (50)
- Mentor: Bo'laklarni bajariladigan tartibda joylang.
- Bo'laklar (to'g'ri tartibda; ekranda aralash; sudrash yoki bosish — 188):
  1. O'yinchi «Qo'shilaman» ni bosadi
  2. Ilova Backend'ga so'rov yuboradi
  3. Backend o'yinda joy borligini tekshiradi
  4. Database `ishtirokchilar` ga qator yozadi
  5. Boshqa o'yinchi ekranni pastga tortadi
  6. Uning ekranida «9 / 10» ko'rinadi
- Uyalar: 6 ta, har birida faqat raqam va «bu yerga qo'ying» (tartibni ochmaydi).
- Xato: Tartib xato — bo'lakni bosib qaytaring. (39)
- Xulosa (yechilgach, bir marta): Qo'shilish uch qismdan o'tadi; boshqa telefon uni qayta so'raganda ko'radi. (75)
  - Oldin xato bo'lgan bo'lsa, havola: Qisqa takrorlash — mavzuni yana bir ko'rish

## 15 · Amaliyot 1 — README: qismlar va jadvallar  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈15 daq)
- Eyebrow: Amaliyot 1 · o'z repo'ngiz
- Sarlavha: **README'ga chizma va jadvallarni yozdiring.** (42)
- Mentor: Hamma qadamni o'z mahsulotingiz bilan qilasiz, o'ngda — namuna; «1 · Ochish»dan boshlang.
- Model (tayanch 4, 9.1): to'rt qadamning hammasi o'quvchining o'z repo'sida, o'z mahsuloti va trekida; Mentor misoli — namuna: o'ngda kutilgan natija, `{…}` yonida kulrang «masalan: …», «Yordam»da Mentor misolidagi to'liq talab. 5-qadam yo'q.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — 7-darsdagi repo papkangizni Antigravity'da oching: `README.md` da talab va wireframe surati turibdi.
     Papka bu kompyuterda yo'q bo'lsa — terminalda `git clone https://github.com/{login}/{repo}.git` · `cd {repo}`.
  2. **Prompt** — qavslarning bir qismi mustaqil ishdagi tanlovingiz va PRD'ingizdan to'ldirilgan; tekshiring, bo'sh qavsni o'zingiz yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     (kalitlar yo'q bo'lsa:) qavslarni o'z mahsulotingiz bilan to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     ✎ F-1006-281: `{saqlanadigan ma'lumotlar}` ataylab bo'sh — «to'ldirilgan» gapi yolg'on edi; kalitsiz holat uchun ikkinchi gap
     > Qayerda: `README.md` — yangi «Arxitektura» bo'limi.
     > Nima qilsin: chizmani matn bilan chiz — uch qism va strelkalar: {ilova yoki sayt} → Backend → Database.
     > Asosiy funksiyalar: {uchta asosiy funksiya}. Saqlanadigan ma'lumotlar: {saqlanadigan ma'lumotlar}. Shular uchun Database jadvallarini yoz: har jadval nomi, ustunlari va har ustun nima saqlashi. Bog'lovchi ustunlar qaysi jadvalga bog'langanini yoz.
     > Nima buzilmasin: kod va papkalarga tegma — faqat `README.md` dagi yangi bo'lim. O'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {ilova yoki sayt} — «masalan: ilova (Expo)»
     - {uchta asosiy funksiya} — «masalan: o'yin e'loni va qo'shilish; o'yin kuni tasdiq; chiqish va navbat»
     - {saqlanadigan ma'lumotlar} — o'quvchi o'zi yozadi (oldindan to'ldirilmaydi; 08-FILTR 30): «masalan: o'yinchilar; o'yinlar; kim qaysi o'yinga qo'shilgani»
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: `README.md` — yangi «Arxitektura» bo'limi.
     > Nima qilsin: chizmani matn bilan chiz — uch qism va strelkalar: ilova (Expo) → Backend → Database.
     > Asosiy funksiyalar: o'yin e'loni va qo'shilish; o'yin kuni tasdiq; chiqish va navbat. Saqlanadigan ma'lumotlar: o'yinchilar; o'yinlar; kim qaysi o'yinga qo'shilgani. Shular uchun Database jadvallarini yoz: har jadval nomi, ustunlari va har ustun nima saqlashi. Bog'lovchi ustunlar qaysi jadvalga bog'langanini yoz.
     > Nima buzilmasin: kod va papkalarga tegma — faqat `README.md` dagi yangi bo'lim. O'zgargan fayllarni ayt.
  3. **Ko'rish** — Antigravity'da `README.md` ni oching: «Arxitektura» bo'limida chizma va jadvallar bor. Agent boshqa faylni ham o'zgartirgan bo'lsa: «Faqat README.md ni o'zgartir, qolganini qaytar.»
  4. **Tekshirish** — har funksiyangizni oling va README'dan toping: u qaysi jadvalga nima yozadi? Talabning har qatori:
     qayerda — o'zgargan fayl faqat `README.md` · nima qilsin — chizmada uch qism, har jadvalda ustunlar va izohi, bog'lovchi ustunlar bog'langan jadvali bilan, siz yozgan har ma'lumot jadvalda bor · nima buzilmasin — kod o'zgarmagan.
     Funksiya joy topmasa, agentga: «{funksiya} uchun jadvalda joy yo'q: {nima saqlansin}. Faqat README.md ni o'zgartir.»
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (README ko'rinishi, Markdown sahifasi kabi chizilgan; o'quvchi o'zinikini shunga solishtiradi):
  - **Arxitektura** · chizma: `ilova (Expo) → Backend (NestJS) → Database (Neon)`
  - `oyinchilar` — `id` · `ism` · `telefon` · `parol_hash`
  - `oyinlar` — `id` · `kun` · `soat` · `maydon` · `kerak` · `tashkilotchi_id` → `oyinchilar`
  - `ishtirokchilar` — `oyin_id` → `oyinlar` · `oyinchi_id` → `oyinchilar` · `holat` · `yaratilgan`
- Hammasi bajarilgach (yashil): README'da chizma va jadvallar: har funksiya o'z joyini oldi. (60)
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m11-dars-08-done` —
  `README.md` dagi «Arxitektura» bo'limi. O'z README'ngizni shunga qarab to'ldirasiz.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: `{ilova yoki sayt}` — `pm-m9d8-platforma.trek` dan (mobil → «ilova (Expo)», web → «sayt (React)»); `{uchta asosiy funksiya}` — `pm-m9d5-prd.funksiyalar` dan; yozuv yo'q bo'lsa — qavs bo'sh, faqat kulrang «masalan».
  Talab zinapoyasi (tayanch 9.12): A1 — tayyor talab + 2 joy (ikkalasi oldindan to'ldiriladi, tahrirlanadi). 3-qadam nomi «Ko'rish» — README ishga tushiriladigan kod emas (TAYANCHGA SAVOL 11).
  Jadval nomlarini agent o'zi tanlaydi — o'quvchiniki Mentor misolidan farq qiladi; tekshiruv «har funksiya joy oldimi» (Shubhali 4).

## 16 · Amaliyot 2 — README: real vaqt, platforma, stek va GitHub  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈12 daq)
- Eyebrow: Amaliyot 2 · o'z repo'ngiz
- Sarlavha: **Real vaqt nuqtalari va platformani README'ga qo'shing.** (54)
- Mentor: Platforma tanlovingiz allaqachon talabda — real vaqt nuqtalarini o'zingiz yozasiz; «1 · Ochish»dan boshlang.
  (platforma kaliti yo'q bo'lsa:) Platforma va real vaqt nuqtalarini o'zingiz yozasiz; «1 · Ochish»dan boshlang. ✎ F-1006-281
- Qadamlar (o'z repo'ngizda, o'z mahsulotingiz bilan):
  1. **Ochish** — `README.md` ochiq, «Arxitektura» bo'limi ko'rinib turibdi. Prototipingizning eng ko'p ishlatiladigan ekranini eslang: unda boshqa odam nimani o'zgartiradi?
  2. **Prompt** — qavsni to'ldiring, platforma qatorini tekshiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `README.md` — «Arxitektura» bo'limining oxiri.
     > Nima qilsin: «Real vaqt nuqtalari» kichik bo'limi: {real vaqt nuqtalari}; har biriga yoz: ilova uni {qachon so'raydi} so'raydi, ekran o'zi yangilanishi hozircha yo'q.
     > «Platforma» kichik bo'limi: {platforma va asos}. «Stek» kichik bo'limi: {ilova yoki sayt texnologiyasi}; Backend — NestJS va TypeORM, Render; Database — Neon (PostgreSQL).
     > Nima buzilmasin: faqat `README.md`; boshqa bo'lim va fayllarga tegma. O'zgargan fayllarni ayt.
     Qavslar: {real vaqt nuqtalari} — o'quvchi yozadi (kulrang «masalan: «8 / 10», qo'shilganlar ro'yxati, «Kelaman» belgilari») · {platforma va asos} — mustaqil ishdan oldindan yozilgan
     (kulrang «masalan: mobil — o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak») · {qachon so'raydi} va {ilova yoki sayt texnologiyasi} — trekingizdan o'zi yoziladi:
     mobil — «ekran ochilganda va pastga tortib yangilaganda», «ilova — Expo (React Native), telefonda Expo Go orqali» · web — «sahifa ochilganda va «Yangilash» bosilganda», «sayt — React (Vite), Netlify».
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: `README.md` — «Arxitektura» bo'limining oxiri.
     > Nima qilsin: «Real vaqt nuqtalari» kichik bo'limi: «8 / 10», qo'shilganlar ro'yxati, o'yin kunidagi «Kelaman» belgilari; har biriga yoz: ilova uni ekran ochilganda va pastga tortib yangilaganda so'raydi, ekran o'zi yangilanishi hozircha yo'q.
     > «Platforma» kichik bo'limi: mobil — o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak. «Stek» kichik bo'limi: ilova — Expo (React Native), telefonda Expo Go orqali; Backend — NestJS va TypeORM, Render; Database — Neon (PostgreSQL).
     > Nima buzilmasin: faqat `README.md`; boshqa bo'lim va fayllarga tegma. O'zgargan fayllarni ayt.
  3. **Ko'rish** — `README.md` da «Arxitektura» bo'limi to'liq: chizma · jadvallar · real vaqt nuqtalari · platforma · stek.
  4. **Tekshirish va GitHub** — talabning har qatori: har real vaqt nuqtasi yonida qachon so'rashi yozilgan · platforma va asos — siz saqlagandek · stek trekingizga mos · boshqa fayl o'zgarmagan.
     Hammasi mos bo'lsa — repo papkasida `git status`: o'zgargan fayl faqat `README.md` bo'lsin; keyin `git add README.md`, `git commit -m "arxitektura va platforma"`, `git push`.
     GitHub'da repo sahifasini yangilang — README'da «Arxitektura» bo'limi ko'rinadi. `git push` xato bersa: «Shu xato chiqdi: {xato}. Tuzat.»
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (README ko'rinishi, A1 dagi bo'lim davomi):
  - **Real vaqt nuqtalari** — «8 / 10» · qo'shilganlar ro'yxati · «Kelaman» belgilari — ekran ochilganda va pastga tortib yangilaganda so'raydi
  - **Platforma** — mobil: o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak
  - **Stek** — Expo (React Native) · NestJS + TypeORM, Render · Neon (PostgreSQL)
  - ostida GitHub sahifasining kichik ko'rinishi: `maydon-jamoa` · `README.md` — «Arxitektura».
- Hammasi bajarilgach (yashil): README'da arxitektura to'liq: real vaqt nuqtalari, platforma va stek GitHub'da. (79)
- Pastki qator: yo'q — «Ortda qoldingizmi» faqat A1 da, darsda bir marta (SABOQ 39, F-1006-271; quruvchi F-1006-281 da olib tashlagan).
- Nishon (bonus): Architecture Ready — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: talab zinapoyasi A2 — tayyor talab + 2 joy (bittasini o'quvchi yozadi, bittasi oldindan to'ldirilgan); trekka qarab qatorlar — `pm-m9d8-platforma.trek` dan, kalit yo'q bo'lsa ikkala variant ko'rinadi (M-q5 naqshi).
  Push odati — tayanch 3 (`git status` → `git add <fayl>`). «Stek» qatori 10-dars A1 uchun kerak (TAYANCHGA SAVOL 3).

## 17 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 4 savol + final + 2 blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari (`Q_LABELS`): 4 — «1 — «8 / 10» qayerdan» · 7 — «2 — «Kelaman» qachon ko'rinadi» · 9 — «3 — «Yangilash» qatori» · 11 — «4 — Platforma tanlovi» · 14 — «Yakuniy — qo'shilish yo'li»

## 18 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (SABOQ 16). Karta ostida, birinchi bosishgacha: «Kartani bosing — javob ochiladi»; karta yuzi halqada.
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim · hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Yakun  ← QYakun (texnik darslar standarti, 192/204)
- Yuqori yorliqlar: ✓ Arxitektura tayyor (A2 bajarilgan bo'lsa; A1 — «✓ Chizma tayyor»; A1 yo'q — yorliq yo'q) · {N}/5 to'g'ri
- Sarlavha (holatga qarab, P-046; 08-FILTR 31): A2 bajarilgan — **Chizma tayyor, platforma asos bilan tanlandi.** (45) · A1 bajarilgan, A2 yo'q — **Chizma tayyor — README ning qolgani uyda.** (42) ·
  A1 bajarilmagan — **Platforma tanlandi — README uyda yoziladi.** (41)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- Bugungi asosiy fikr (`small`, ScoreRing'dan keyin, P-013): Chizma qismlar, jadvallar va real vaqt nuqtalarini ko'rsatadi; bu modulda platforma faqat foydalanuvchi ochadigan qismni tanlaydi — Backend va Database ikkala trekda bir xil.
- Endi siz bilasiz (5):
  - Bu misolda uch qism: ilova ko'rsatadi, Backend tekshiradi, Database saqlaydi.
  - Funksiyalar qaysi ma'lumot saqlanishini ko'rsatadi; har qo'shilish — `ishtirokchilar` dagi bitta qator.
  - Real vaqt nuqtasi — ekran ochiq turganda boshqa odam tufayli ma'lumoti o'zgarishi mumkin bo'lgan joy.
  - Bu modulda ekran ochilganda va pastga tortib yangilaganda so'raydi.
  - Platforma signallar va asos bilan tanlanadi; bu modulda Backend va Database ikkala trekda bir xil.
- Uyga vazifa (`uyga`, karta: kim uchun — o'z mahsulotingiz · muddat — keyingi darsgacha):
  1. **Tugatish** — README'dagi «Arxitektura» bo'limi to'liq bo'lsin: chizma, jadvallar, real vaqt nuqtalari, platforma va stek; GitHub'ga yuborilgan bo'lsin.
  2. **Tekshirish** — PRD'dagi uchala funksiyani oling: har biri qaysi jadvalga nima yozadi? Joy topilmasa — agent bilan README'ga ustun qo'shing.
  3. **Asos** — mahsulotingiz foydalanuvchisidan bitta odamga birinchi savolni bering: u mahsulotni qayerda ochardi? Javobi asosingizga zid bo'lsa — to'rt savolni qayta ko'ring; trek yoki asos o'zgarsa, darsdagi platforma kartasida ham, README'da ham yangilang.
- Keyingi dars — «React Native va Expo: prototip telefonda»: platforma tanlandi, endi prototipni shu platformada telefonda ochish navbati.
- Nishonlaringiz — N/4
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (4) — inglizcha nom va medal (o'yin qatlami)
- **Count Rows** — «8» qatorlardan sanalishini bildingiz (4-ekran, 1-savol)
- **Ask Again** — ekran so'raganda yangilanishini bildingiz (7-ekran, 2-savol)
- **Platform Call** — platformani to'rt savol bilan tanladingiz (11-ekran, 4-savol)
- **Architecture Ready** — ikkala amaliyot blokini oxirigacha bajardingiz (16-ekran, oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q (152)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 06.10: Count Rows · Ask Again · Platform Call · Architecture Ready — 0).

## Qisqa takrorlash oynalari (5) — har ballik testga 3 karta (S-026: kod qatori bor joyda kod, qolganida raqam)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «8 qatorlardan sanaladi»
   - Har qo'shilish — `ishtirokchilar` dagi bitta qator · `oyin_id · oyinchi_id · holat`
   - Shu o'yinga qo'shilganlar sanaladi — 8 · `holat: qoshildi`
   - 10 — `oyinlar` dagi `kerak` ustuni · `kerak: 10`
   - Sinfga savol: O'yinchi o'yindan chiqsa, «8 / 10» qanday o'zgaradi?
2. 2-savol (7-ekran) — «Ekran so'raganda yangilanadi»
   - 1 · Ekran ochilganda ilova Backend'dan so'raydi.
   - 2 · Pastga tortib yangilaganda yana so'raydi.
   - 3 · Ekran o'zi yangilanishi (WebSocket) — keyinroq ufqda, 12-Modulda.
   - Sinfga savol: Tashkilotchi ekranni yangilamasa, «Kelaman» belgilarini qachon ko'radi?
3. 3-savol (9-ekran) — «Tugmaga `korsat` ulanadi»
   - Ochilganda bir marta so'raladi · `korsat();`
   - Tugma bosilganda yana so'raladi · `yangila.addEventListener('click', korsat)`
   - `korsat` so'raydi va ekranga yozadi · `son.textContent = sora();`
   - Sinfga savol: `korsat()` ni ochilganda chaqirmasak, ekranda nima turadi?
4. 4-savol (11-ekran) — «To'rt savol»
   - 1 · Qayerda ochadi: yo'lda telefonda yoki uyda kompyuterda.
   - 2 · Telefon imkoniyati kerakmi · 3 · Havola bilan ulashish muhimmi.
   - 4 · Qaysi stekni yaxshiroq bilasiz — natija: web yoki mobil + bir gapli asos.
   - Sinfga savol: Savollar ikki tomonga tortsa, qanday tanlaysiz?
5. Final (14-ekran) — «Qo'shilish yo'li»
   - 1 · Bosish · 2 · So'rov · 3 · Backend tekshiradi
   - 4 · Database `ishtirokchilar` ga qator yozadi
   - 5 · Boshqa telefon pastga tortadi · 6 · «9 / 10» ko'rinadi
   - Sinfga savol: 5-qadam bo'lmasa, boshqa o'yinchi nimani ko'radi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Bu misolda qaysi uch qism bor? | Ilova, Backend va Database | Ilova ko'rsatadi, Backend tekshiradi, Database saqlaydi |
| Chizma (arxitektura) nimani ko'rsatadi? | Qismlar va ular orasidagi so'rovlar | Jadvallar — Database ostida |
| Maydon Jamoa'da qaysi uch jadval bor? | `oyinchilar`, `oyinlar`, `ishtirokchilar` | Kim · qaysi o'yin · kim qaysi o'yinda |
| «Qo'shilaman» bosilsa, qaysi jadvalga qator tushadi? | `ishtirokchilar` | `holat` — `qoshildi` |
| Bog'lovchi ustun nima? | Boshqa jadvaldagi qatorni ko'rsatadigan ustun | Masalan, `oyin_id` — `oyinlar` dagi o'yin |
| Real vaqt nuqtasi nima? | Ekran ochiq turganda boshqa odam tufayli ma'lumoti o'zgarishi mumkin bo'lgan joy | «8 / 10», qo'shilganlar, «Kelaman» belgilari |
| Bu modulda ilova qachon so'raydi? | Ekran ochilganda va pastga tortib yangilaganda | O'zi yangilanishi — 12-Modulda (WebSocket) |
| Kod oynasida «Yangilash» ga `korsat` qanday ulanadi? | `yangila.addEventListener('click', korsat)` | Telefonda — ro'yxatni pastga tortish |
| Platforma tanlovidagi to'rt savol qaysilar? | Qayerda ochadi · telefon imkoniyati · havola bilan ulashish · qaysi stek tanish | Natija: web yoki mobil + bir gapli asos |
| Mentor misolida platforma qaysi va nega? | Mobil | O'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak |
| Stek nima? | Birga ishlaydigan texnologiyalar to'plami | Mobil trekda: Expo · NestJS · Neon |
| Bu modulda trek almashsa, qaysi qism o'zgaradi? | Faqat ilova yoki sayt | Backend va Database ikkala trekda bir xil |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. Maydon Jamoa'da yangi e'lonni qaysi qism saqlaydi? ✔ Database — jadval qatorida · Backend — o'z kodi ichida · Ilova — telefon xotirasida · Telegram — guruh xabarida
2. Bitta o'yinchi ko'p o'yinga qo'shiladi. Bu qayerda yoziladi? `oyinchilar` dagi bitta ustunda · ✔ `ishtirokchilar` dagi qatorlarda · `oyinlar` dagi bitta ustunda · Telefondagi o'yinlar ro'yxatida
3. `tashkilotchi_id` ustuni nimani ko'rsatadi? O'yinga qo'shilgan o'yinchini · O'yin qaysi maydonda ekanini · ✔ O'yinni kim e'lon qilganini · Nechta o'yinchi kerakligini
4. Qaysi biri real vaqt nuqtasi? O'yinning kuni va soati · O'yin maydonining nomi · E'lon berish formasi · ✔ Qo'shilganlar ro'yxati
5. Bu modulda ilova qachon Backend'dan so'raydi? ✔ Ochilganda va pastga tortilganda · Faqat ilova birinchi o'rnatilgan kuni · Faqat telefon qayta yoqilganda · Har daqiqada o'zi, so'ramasdan
6. Kodda `korsat()` nega sahifa ochilganda chaqiriladi? Tugma o'zi bosilib qolmasligi uchun · ✔ Son birinchi marta so'ralishi uchun · `sora` funksiyasi o'chib qolmasligi uchun · Sahifa tezroq ochilib ketishi uchun
7. Platforma nima? Backend turadigan internet xizmati · Ekranlarning qog'ozdagi chizmasi · ✔ Mahsulot web yoki mobilda ishlashi · Database'dagi jadvallar to'plami
8. Foydalanuvchi mahsulotni yo'lda, telefonda ochadi. Bu javob qaysi tomonga tortadi? Web tomoniga · Ikkalasiga teng · Hech qaysisiga · ✔ Mobil tomoniga
9. Havola bilan tez ulashish muhim. Bu javob qaysi tomonga tortadi? ✔ Web tomoniga · Mobil tomoniga · Hech qaysisiga · Ikkalasiga teng
10. Mentor misolida platforma nega mobil? Ilova saytdan chiroyliroq ko'rinadi · ✔ O'yinchi maydonda, qo'lida telefon · Faqat React Native tanish bo'lgan · Telegram guruhiga havola tashlanadi
11. Stek nima? Mahsulot ochiladigan platforma · PRD dagi funksiyalar ro'yxati · ✔ Birga ishlaydigan texnologiyalar · Ilova ekranlari va tugmalari
12. Web-trekdan mobil trekka o'tsangiz, nima o'zgaradi? Backend va Database ikkalasi · Faqat Database jadvallari · Uchala qism birdaniga almashadi · ✔ Foydalanuvchi ochadigan qism

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D.
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari — ru'da ham o'sha; R-008): chizma · arxitektura · `oyinlar` · `ishtirokchilar` · real vaqt nuqtasi · «8 / 10» · `addEventListener` · web · mobil · stek · Expo · NestJS · Neon · README · Maydon Jamoa

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 20 ekran: hook · rule · exploration ×2 · test · exploration ×2 · test · practice(kod) · test · exploration · test · exploration ·
   practice(mustaqil) · test(final, `scope: 'final'`) · practice(blok) ×2 · stats · flashcards · summary. `INLINE_KEYS`: s4 **2 (C)** · s7 **0 (A)** · s9 **3 (D)** · s11 **1 (B)** · s14 sentinel **0**;
   QKod (8), QMustaqil (13) va bloklar (15, 16) — `practice: -1`. `LESSON_META.lessonId` — `m9-08-v1`.
2. **Bitta manba (180):** `JAMOA_CHIZMA` (qismlar, uch jadval va ustunlari, bog'lovchi chiziqlar, real vaqt nuqtalari), `NAMUNA_OYINLAR` (4 o'yin — tayanch 9.2; 7-dars bilan bir xil),
   `TORT_SAVOL` (to'rt savol, Mentor javoblari va tomoni; 13-ekran chiplari) — 0–3, 5, 6, 10, 12–16-ekranlar va kartochka shundan o'qiydi; `QOSHILISH_YOLI` (6 bo'lak — 14-ekran).
3. **`JamoaChizma`** komponenti: chapda telefon (191; o'lcham barqaror ≈170×272 — SABOQ 22), yorliq ramka ustida (SABOQ 23), `trek` propi (`mobil` — telefon ramkasi, `web` — brauzer oynasi), bitta yoki ikki telefon;
   o'rtada Backend, o'ngda Database (uch jadval kartasi, `_id` chiziqlari SVG); konvert (so'rov/javob), yangi qator ~1 s yashil; real vaqt nuqta-halqalari. Bosiladigan qismlar faylda e'lon qilinadi
   (`// qolip-maket: jc-qoshil jc-yangila jc-yubor jc-oyinlar jc-tort jc-jadval jc-trek`). `prefers-reduced-motion` da harakat to'xtaydi (DE-200). Logotip/emoji yo'q (D4). Telefon ekranlari 7-dars `JamoaTelefon` dan qayta ishlatiladi (bitta qurilgan bo'lsa — import emas, nusxa: darslar mustaqil).
4. **0-ekran:** telefon + brauzer yonma-yon; «Qo'shilaman» → son animatsiyasi (9.14); ↻ faqat shundan keyin faol; variantlar ikkala harakatdan keyin ochiladi; javobdan keyin chizma tug'iladi.
5. **2-ekran:** ikki telefon (tashkilotchi / o'yinchi), `QQadamlar` chiplari tugma yonida (SABOQ 21), konvert yo'li 2 bosqich; yangi karta «Yakshanba, 10:00 · Park maydoni · 0 / 8» ro'yxatda kun tartibida joyiga kiradi.
6. **3-ekran:** 6 bo'lak bittadan (SABOQ 13), uch jadval kartasi — bosish nishoni; to'g'ri bo'lak ustunlarga aylanadi; `_id` chizig'i (SVG). 2 ustunda `id`/`yaratilgan` oldindan kulrang.
7. **5-ekran:** 4 bo'lak bittadan, «O'zgaradi» / «O'zgarmaydi»; 4-bo'lakda telefon «o'yin kuni» holati (doiralarda ✓ — bu holat faqat shu ekranda).
8. **6-ekran:** ekranga kirganda 1-telefondan avtomatik so'rov (bir marta); pastga tortish — sudrash (pointer events, 60 px dan oshsa yangilaydi) + klaviatura uchun «Yangilash» tugmasi (a11y); 2-telefondagi «Qo'shilaman» — `ishtirokchilar` hisoblagichi 8 → 9.
9. **8-ekran (QKod) → `HtmlCompiler`** (ko'p fayl: `index.html` tayyor · `app.js` — tepa qismi tayyor, pasti o'quvchi). Tekshiruvlar (AST yoki ishonchli regex): yuqori darajada `korsat()` chaqiruvi ·
   `yangila.addEventListener('click', korsat)` (qavssiz `korsat`; `function`/arrow o'rami ham qabul — ichida `korsat()`). «Bajardim» shartlar ✓ bo'lgach ochiladi (§19). Qoralama kaliti `pm-m9d8-code`.
   ⚠️ `app.js` starter `.jsx` ichida shablon-satr — izohlarda backtik yo'q (CLAUDE.md); starter izohlari backtiksiz yozildi.
10. **10-ekran:** savol-karta bittadan, ikki chip; to'g'ri chip belgisi ustunga uchadi (`TORT_SAVOL[i].tomon`), adashganda `QXato`; 4/4 da asos qatori (aynan tayanch) va telefon yorlig'i «ilova · mobil».
11. **12-ekran:** kalit `mobil` / `web` — `JamoaChizma trek` propini almashtiradi; o'zgarmagan tugunlar bir marta yengil yonadi; 2/2 dan keyin `mobil` ga qaytadi.
12. **13-ekran (QMustaqil):** bitta katta karta, ixcham chiziq (SABOQ 29); chiplardan `javoblar` (matn), ustunlar sanog'i (ko'rsatish uchun, saqlanmaydi), `trek`, `asos` (bo'sh emas — shart);
    saqlash `pm-m9d8-platforma` = `{ trek: 'web' | 'mobil', javoblar: [4], asos }`; kalit bor bo'lsa — to'ldirilgan holda ochiladi.
13. **15, 16-ekran** — `ScreenBlok` (skeletdagi ulagich) + `QPrompt` (2-qadam; `{…}` joylari). A1: `{ilova yoki sayt}` ← `pm-m9d8-platforma.trek`, `{uchta asosiy funksiya}` ← `pm-m9d5-prd.funksiyalar` (`; ` bilan), tahrirlanadi.
    A2: `{platforma va asos}` ← `trek` + `asos` (tahrirlanadi), `{real vaqt nuqtalari}` — bo'sh, kulrang «masalan»; `{qachon so'raydi}` va `{ilova yoki sayt texnologiyasi}` — trekdan matn (joy emas, o'zgarmas qism);
    trek kaliti yo'q bo'lsa — ikkala trek qatori ko'rinadi. 3-qadam nomi «Ko'rish», 4-qadam (A2) — «Tekshirish va GitHub».
    ⚠️ Qolipda yo'q (11-Modulning hamma bloklari — JURNAL MEXANIZM-TAKLIF 1–2): `{…}` yonida kulrang «masalan», oldindan yozilgan qiymat, qadam ichidagi «Yordam»; `QM.ortda` yorlig'i «Mentor misolini ochib ko'ring».
    O'ngda README ko'rinishi (Markdown sahifasi kabi chizilgan karta) + A2 da GitHub sahifasining kichik ko'rinishi. `ACH_TRIGGERS`: A2 oxirgi «Bajardim» → Architecture Ready.
14. `RECAPS` 5 (kalit = 4, 7, 9, 11, 14) · `Q_LABELS` {4, 7, 9, 11, 14} · `ACHIEVEMENTS` 4 (`ACH_TRIGGERS`: 4 → Count Rows, 7 → Ask Again, 11 → Platform Call, A2 → Architecture Ready) ·
    `QUIZ_BANK` 12 (to'g'ri javob 3/3/3/3) · flashcard 12 (alohida ekran, Mentor yo'q, «Kartani bosing — javob ochiladi», SABOQ 16) · `HW_TOKENS` fon so'zlari {uz, ru}.
15. **11-darsga eslatma (bu darsda kod yo'q):** mobil trekda pastga tortib yangilash — React Native `FlatList` ning `onRefresh` + `refreshing` xossalari («Pull to Refresh», reactnative.dev/docs/flatlist, 06.10).
16. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6) — skeletdan ko'chirilmaydi.
17. **Darvozalar:** `npm run gates -- src/9-Modull/PlatformChoiceLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` · `stilsiz.py` (10-Modul SABOQ 31) · `lint:layout` 1280/1366/390 · surat 1280 + 393.

## REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m11-dars-08-start` = `m11-dars-07-done` → `m11-dars-08-done`)
1. Faqat `README.md` o'zgaradi — yangi **«Arxitektura»** bo'limi (A1 + A2 Mentor talablari natijasi, tayanch 1.6 bilan aynan):
   - chizma (kod blokida matn): `ilova (Expo) → Backend (NestJS) → Database (Neon)`;
   - jadvallar: `oyinchilar` (`id` · `ism` · `telefon` · `parol_hash`) · `oyinlar` (`id` · `kun` · `soat` · `maydon` · `kerak` · `tashkilotchi_id` → `oyinchilar` · `yaratilgan`) ·
     `ishtirokchilar` (`oyin_id` → `oyinlar` · `oyinchi_id` → `oyinchilar` · `holat`: `qoshildi` / `keladi` / `navbatda` / `chiqdi` · `yaratilgan`), har ustunga qisqa izoh;
   - «Real vaqt nuqtalari»: «8 / 10» · qo'shilganlar ro'yxati · o'yin kunidagi «Kelaman» belgilari — ekran ochilganda va pastga tortib yangilaganda so'raydi; o'zi yangilanishi (WebSocket) — 12-Modul;
   - «Platforma»: mobil — o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak;
   - «Stek»: ilova — Expo (React Native), telefonda Expo Go orqali · Backend — NestJS + TypeORM, Render · Database — Neon (PostgreSQL).
   - «Darslar va teglar» jadvaliga `m11-dars-08-done` qatori.
2. `prototip/` ga tegilmaydi. Kod yo'q — muhrdan oldin: toza papkada `git clone` → `git checkout -f m11-dars-08-done` → `README.md` GitHub'da to'g'ri ko'rinadi (jadval va kod bloklari).
3. Antigravity'da A1/A2 talablari bilan bir marta yozdirib ko'riladi (agent faqat `README.md` ga tegadimi, jadval nomlarini qanday tanlaydi — Shubhali 4).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
> **Holat (06.10, 08-FILTR):** 1, 3, 4, 7, 11, 12, 14 — qabul · 2 — qisman: signal + hal qiluvchi + asos, sanoq yo'q · 5 — ta'rif `_id` siz · 6 — tayanch 9.74 · 8 — tayanch 9.31 (yangi e'lon «0 / N») ·
> 9 — tayanch 9.32 (`400` — bo'sh forma: «to'liqmi?») · 10 — qabul (uch nuqta) · 13 — tuzatildi: trek yoki asos o'zgarsa, platforma kartasi ham yangilanadi.
1. **«stek» — «stack» emas.** 9-Modul o'quvchi matnida «stack» («Yangi stack kerakmi?», `MvpArchitectureLesson.jsx`); 11-Modul tayanchi 1.6, App.jsx `m9-08` osti va 10-dars MD Mentori — «stek».
   «stek» ni oldim (P-015: reja teglari `sub` bilan so'zma-so'z; 9-darsdagi Expo Router «Stack» navigatsiyasi bilan ham aralashmaydi — T-015). 12-ekran nom qatori 9-Modulga ko'prik («9-Modulda Maydon uchun ham stek tanlagansiz»), ingliz yozuvi tilga olinmadi.
2. **Mentor misolidagi to'rt javob** — tayanchda faqat asos bor. Men: 1 — maydonda va yo'lda, telefonda (mobil) · 2 — o'yindan oldin eslatma (mobil) · 3 — ha, e'lonni Telegram guruhiga tashlash (**web**) · 4 — ikkalasi tanish (teng).
   3-javob ataylab web tomonda: tanlov sanoq emas, asos (10-ekran `QIzoh`). Agar hamma javob mobil bo'lishi kerak bo'lsa — 10-ekran 3-savoli va arena 9 o'zgaradi.
3. **README «Arxitektura» bo'limiga «Stek» kichik bo'limi qo'shildi** (tayanch 3 teg qatorida yo'q): 10-dars A1 «`README.md` dagi arxitektura bo'yicha» Backend texnologiyasini shundan oladi (P-060 — texnologiya repo'da).
4. **Web-trekda real vaqt nuqtasi** — tayanchda faqat mobil («pastga tortib»). Men: «sahifa ochilganda va «Yangilash» bosilganda so'raydi» (8-ekran QKod ham shu). 10-Modul dashboard'idagi «har 5 soniyada so'rash» bu modulda tilga olinmadi.
5. **«bog'lovchi ustun»** — kursdagi `m4-01` so'zi (DataIntro: «bog'lovchi ustun (foreign key)»); tayanch 2 da yo'q. 3-ekranda bir gap, kartochkada bir marta; ball beriladigan savollarda «`_id`» — arena 3 izohsiz emas (ustun nomi o'zi).
6. **«8 / 10» sanog'i:** 8 — `ishtirokchilar` dagi shu o'yinga qo'shilganlar (`holat` `qoshildi` yoki `keladi`; `navbatda`, `chiqdi` sanalmaydi) — tayanchda aniq yozilmagan; darsda faqat «shu o'yinga qo'shilganlar» deyiladi.
7. **Hook — Maydon Jamoa ikki shaklda** (ilova va sayt yonma-yon, fikr tajribasi): Mentor «bo'lishi mumkin» deydi, 10-ekranda mobil tanlanadi. 10-dars hookidagi ikki telefon sahnasi bilan to'qnashmaydi (u prototip, bu — Backend bilan).
8. **2-ekran namunasi:** tashkilotchi Yakshanba 10:00 · Park maydoni · 8 kishi e'lonini beradi → ro'yxatda «0 / 8» (namuna o'yinlardagi «4 / 8» — keyingi holat). Boshqa yangi o'yin o'ylab topilmadi.
9. **Backend e'londa nimani tekshiradi** — «to'liqmi?» (kun, soat, maydon, nechta odam); qo'shilishda — «joy bormi?» (11-dars «O'yin to'ldi» bilan mos). Tayanchda e'lon tekshiruvi yo'q.
10. **Real vaqt nuqtalari — uchta (tayanch).** «Qo'shilaman» tugmasi ham o'yin to'lsa «O'yin to'ldi» ga almashadi (11-dars) — saralashga kiritilmadi; kerak bo'lsa to'rtinchi nuqta bo'ladi.
11. **Bloklar 3-qadami «Ko'rish»** («Ishga tushirish» emas — README ishga tushiriladigan kod emas); push faqat A2 oxirida (7-dars naqshi). Ikki blok ham faqat `README.md` ga tegadi.
12. **«12-Modulda»** — katta harf bilan (o'quvchi matnidagi «9-Modulda» qoidasi); tayanchda «12-Modul» kichik harf bilan yozilgan.
13. **Uyga vazifa 3-bandi** — foydalanuvchidan bitta odamga 1-savol (qayerda ochadi): intervyu emas, bitta savol; asos tuzatilsa README'da (saqlangan `pm-m9d8-platforma` o'zgarmaydi — 9-dars kalitni o'qisa, eski trek qoladi).
14. **QKod (8-ekran)** — dasturda «ixtiyoriy kod oynasi (web)»: `HtmlCompiler`, `sora()` — Backend o'rnidagi namuna funksiya (izohda shunday yozilgan). RN kodi darsda yo'q (9-dars mavzusi).

## Shubhali joylar (ishonchim komil emas)
1. **«eslatma telefonga kelishi kerak» → mobil.** Web'da ham eslatma (push) yuborish mumkin (masalan, bosh ekranga qo'shilgan saytda) — dars buni inkor qilmaydi: 10-ekranda faqat «telefon imkoniyati kerakmi» savoli mobil tomonga tortadi, «web'da eslatma yo'q» degan gap yo'q (T-045).
2. **Telefonda «Expo Go orqali»** — 12-ekran chipi: Expo Go — sinash vositasi, do'konga chiqarish emas (T-045); «deploy» so'zi ishlatilmadi. Web-trekda «Netlify» — tayanch 1.6 (9-darsda chiqadi).
3. **«Kursda React'da ham, React Native'da ham yozgansiz»** (10-ekran 4-savol `QXato`) — React Native kursdagi `m6-09…11` darslarida o'tilgan; modul raqamini atamadim (LMS raqami 6 yoki 8 — manbalarda ikki xil; tayanch 1.6 «6-Modul» deydi).
4. **Agent jadval nomlarini o'zicha tanlaydi** — o'quvchining README'si Mentor misolidan farq qiladi; tekshiruv «har funksiya joy oldimi», nomlar emas. Agent `README.md` dan tashqariga tegsa — 3-qadamda bir gap bilan qaytariladi.
5. **0-ekran 3-javobi** «Telefon o'chiq bo'lsa ham sayt «9 / 10» ni ko'rsatadi» — bu misoldagi arxitektura uchun rost (ma'lumot Backend/Database'da); fikr tajribasi sifatida o'qilishi kerak.
6. **Pastga tortish (6-ekran) kompyuterda** — sichqoncha bilan sudrash g'ayritabiiy bo'lishi mumkin; zaxira — «Yangilash» tugmasi (KOD 8). Vizual bosqichda sinab ko'rilsin.
7. **2-ekran «0 / 8»** — namuna o'yinlar bilan bir qarashda farq (4 / 8); TAYANCHGA SAVOL 8.
8. **Vaqt:** 15 dars ekrani + 2 blok ≈ 90 daqiqaga zich; ulgurmasa A2 uyga vazifaning 1-bandiga o'tadi (1-ekran O'qituvchi eslatmasi).

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m9-07` «Jonli prototip: qog'ozdan bosiladigan ekrangacha» → **`m9-08` «Arxitektura va platforma: web yoki mobil ilova»**
      (osti «qismlar, real vaqt nuqtalari, stek — asoslangan tanlov») → `m9-09` «React Native va Expo: prototip telefonda»; reja teglari `sub` so'zlari bilan.
- [x] Bitta misol-ip («Maydon Jamoa», hook → bloklar); metafora yo'q; bitta vizual — `JamoaChizma` (telefon · Backend · Database, trekka qarab birinchi qism); o'quvchining o'z mahsuloti — 13-ekran va bloklar. 11-ekran savoli — boshqa holat (P-002: faqat testda).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2, 3, 5, 6, 10, 12 (va 0, 8, 13, 14, 15, 16) — matn-karta yo'q; bashoratlar (2, 3, 6, 10) tanlangach ixcham qator bo'lib qoladi.
- [x] Sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 — o'lchov skripti (scratchpad `md08/olchov.py`; natija hisobotda).
- [x] Atamalar tayanch 2 va oldingi darslar bilan (qism, chizma (arxitektura), jadval/ustun/qator, bog'lovchi ustun, real vaqt nuqtasi, platforma, trek, stek — TAYANCHGA SAVOL 1, 5); siz-forma;
      tugma ot-shaklda yoki siz-formada («Yuborish», «Yangilash», «Saqlash»); agent promptlari — T-002 istisnosi.
- [x] Testlar: variantlar bir shaklda, uzunligi yaqin (skript), to'g'ri javob yolg'iz eng uzun emas; kalit so'z/kod/tire faqat to'g'rida emas · ✔: s4 C · s7 A · s9 D · s11 B · arena A·B·C·D ×3 · inkor-savol yo'q.
- [x] Final: uyalarda faqat raqam va «bu yerga qo'ying», Mentor tartibni aytmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov», «darhol», «albatta» — o'quvchi matnida yo'q).
- [x] Ichki kodlar o'quvchi matnida yo'q (F1–F3, `m9-08`, kod raqami); modul raqami LMS bo'yicha («9-Modulda», «12-Modulda»); tarixiy voqea yo'q; tashqi xizmat tugmasi bosilmaydi (faqat `git`, Antigravity) · «KOD» (17) va «REPO» (3) ro'yxati to'liq.
- [x] Karta T · P · S ko'rildi: T-002 · T-008 (prompt va chat matni) · T-011 (real vaqt nuqtasi, platforma, stek, bog'lovchi ustun — harakatdan keyin; sarlavhalarda yangi atama yo'q) ·
      T-014/015 («chizma» faqat arxitektura; «stek» — «Stack» navigatsiyasidan ajratilgan; «ilova» faqat telefon ilovasi) · T-016/017 · T-024 · T-029 · T-039 («README'ngiz», «trekingiz» — yaratilgandan keyin) ·
      T-043 («Bu misolda», «Mentor misolida», «bu modulda») · T-045 (prototip/Expo Go/web push inkor qilinmadi) · T-052 (chizma, stek — 9-Modul; bog'lovchi ustun — `m4-01`) · T-064 ·
      P-001/002/004 · P-008 · P-013 · P-015 · P-016 · P-025 · P-026 · P-028 · P-036 · P-040 (3, 5-ekran hisoblagich) · P-046 · P-052 · P-055 · P-059 · P-062 · P-063 (`TORT_SAVOL`, `QOSHILISH_YOLI`) · P-064 · P-065 (8-ekran) · P-067 ·
      S-001 · S-002 · S-004 · S-006 · S-008 · S-010 · S-018 (brend yo'q) · S-019 · S-020 · S-026 · S-040 · SABOQ 6, 9, 11, 12, 13, 16, 17, 19–29.
