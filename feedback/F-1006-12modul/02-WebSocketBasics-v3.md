# 12-Modul · 2-dars «WebSocket: ekran o'zi yangilanadigan ulanish» — MD v3 (yangi dars, TEX — modulning texnik cho'qqisi)

Fayl: `src/10-Modull/WebSocketBasicsLesson.jsx` (kalit `m10-02`, App.jsx `type: 'Kod'`) · **20 ekran** (15 dars ekrani + 2 amaliyot bloki + podium, kartochkalar, yakun) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. TEX, keyssiz (Qaror-0 22). Qolip: texnik dars (QKirish, QReja, QTushuncha, QTest, QKod, QMustaqil, QTartib) + 2 amaliyot bloki (QBlok). Kod — `src/skelet/NamunaDars.jsx` dan.
Menyu (DE-205, App.jsx `m10-02`): «WebSocket: ekran o'zi yangilanadigan ulanish» · osti «doimiy ulanish, hodisalar va real vaqt oqimi sxemasi» ·
oldingi `m10-01` «Mahsulotingizni bir sahifada qanday tanishtirasiz?» · keyingi `m10-03` «Ekran o'zi yangilanishi uchun nimani yozasiz?».
Namuna (tuzilish, hajm): 11-Modul `08-PlatformChoice-v3.md` + `08-FILTR.md` · 10-Modul `02-EventTracking-v3.md` + `02-FILTR.md` · 10-Modul `03-LiveDashboard-v3.md` (qayta-qayta so'rash ko'prigi) — matn ko'chirilmadi.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul «C» 19–31, majburiy): kartochkalar alohida ekran · test yorlig'i yo'q · navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan, Mentor aynan shu harakatni aytadi) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi · telefon maketi chapda, o'lchami barqaror · ≤3 blok · bo'sh ustun yo'q · yakuniy holat ixcham · ko'p elementli mashq ketma-ket · stilsiz element yo'q.
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 3-ekran **B** · 6-ekran **D** · 8-ekran **A** · 11-ekran **C** · 14-ekran (final tartib, sentinel `0`) · arena A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa — 0–3 ≈ 10 · 4–8 ≈ 14 · 9 (kod oynasi) ≈ 8 · 10–14 ≈ 18 · A1 ≈ 30 · podium, kartochkalar, yakun ≈ 6 — jami ≈ 86 · A2 ≈ 6 faqat vaqt qolsa, qolmasa — uyga vazifa ① (02-FILTR 11: A1 22 → 30 edi; 90 daqiqaga sig'ishi — «qur» pilotida taymer bilan o'lchanadi, o'lchanmaguncha da'vo emas). Ulgurmagan o'quvchi yo'li — A-bo'lim 10-band.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (tayanch 4, 1.2):** dars oxirida o'quvchining o'z repo'sida ilova (web-trekda — sayt) Backend'ga **doimiy ulangan**: ulanish token bilan, ekran tepasida **ulanish belgisi** («Ulangan» · «Ulanmoqda…» · «Ulanmagan»);
   `README.md` da **«Real vaqt»** bo'limi — real vaqt oqimi sxemasi (jadval). Sxema darsda saqlanadi: `pm-m10d2-sxema` = `{ qatorlar: [{ id, nuqta, kimNima, hodisa, kimOladi, ekranda }] }` (3-dars o'qiydi; `id` barqaror, tartib o'zgarmaydi — tayanch 8).
   Mentor misoli — «Maydon Jamoa», repo `maydon-jamoa`, teg `m12-dars-02-done` (`m12-dars-02-start` = `m12-dars-01-done` = `m11-dars-15-done` + `lending/`).
   **Bugun Backend hodisa yubormaydi** — `oyin-ozgardi` 3-darsning ishi (tayanch 1.2); o'quvchi matnida bu «hozircha faqat ulanish va belgi» deb aytiladi, keyingi dars va'da qilinmaydi (T-038).
2. **Bugungi asosiy fikr (P-013):** Doimiy ulanish ochiq tursa, Backend ilova so'rashini kutmaydi — hodisa yuboradi; bu misolda hodisa o'zgarish bo'lganini aytadi, yangi holatni ilova Backend'dan qayta so'raydi.
3. **Oldingi darslardan keladigan narsa (11-Modul tayanchi 1.6, 1.7, 9.29, 9.74 — aynan):** ilova (Expo) · Backend (NestJS, Render) · Database (Neon); yo'llar `POST /royxat` · `POST /kirish` · `GET /oyinlar` (token bilan; tartib `yaratilgan` bo'yicha, eng yangisi tepada) ·
   `POST /oyinlar` · `…/qoshilish` · `…/tasdiq` · `…/chiqish` · `…/navbat`. Ekranlar: «O'yinlar» (kun sarlavhalari, kartada «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10», kutish yozuvi, pastga tortib yangilash) · «O'yin» («Qo'shilaman» → «Qo'shildingiz», «Kelaman», «Kelishini tasdiqladi: 7 / 9», «Navbatda: N») ·
   «E'lon berish» · «Ro'yxatdan o'tish» · «Kirish» · «Hisobdan chiqish». Token telefonda `expo-secure-store` da; web-trekda `localStorage` da; Backend manzili `EXPO_PUBLIC_API_URL` (web — `VITE_API_URL`).
   **Real vaqt nuqtasi** (11-Modul 8-darsi): ekran ochiq turganda boshqa odam tufayli ma'lumoti o'zgarishi mumkin bo'lgan joy — «8 / 10», qo'shilganlar ro'yxati, «Kelaman» belgilari; 11-Modulda ilova ularni **ekran ochilganda va pastga tortib yangilaganda** so'raydi (web-trekda — «Yangilash» tugmasi).
   11-Modul 8-dars kod oynasi: `korsat()` · `sora()` · `yangila.addEventListener('click', korsat)` — bugungi kod oynasi shu nomlar bilan davom etadi (tayanch 1.2).
   10-Modul 3-darsi: dashboard har 5 soniyada Backend'dan qayta-qayta so'rardi — bir gapli ko'prik (4-ekran Mentori).
4. **Mazmun (tayanch 1.2 — aynan):**
   - Nega hozir o'zi yangilanmaydi: so'rov–javobda ilova so'raydi, Backend javob beradi — ilova so'ramasa, Backend unga hech narsa yubora olmaydi.
   - Doimiy ulanish: ilova bir marta ulanadi, ulanish ochiq turadi, Backend istagan payt hodisa yubora oladi. Tartib (T-011): avval hodisa sahnada → «doimiy ulanish» → atama «WebSocket» → asbob «socket.io».
   - Ulanish token bilan: ilova ulanayotganda tokenni yuboradi; token bo'lmasa yoki yaroqsiz bo'lsa — Backend ulanishni yopadi (token yopiq so'rovlardagidek ishlatiladi, lekin Backend uni ulanish ochilayotganda tekshiradi — 02-FILTR 3). Ilova uchun bitta fayl `mobil/src/ulanish.ts`; Backend'da NestJS gateway.
   - Ulanish belgisi («O'yinlar» ekrani tepasida): «Ulangan» · «Ulanmoqda…» · «Ulanmagan».
   - Hodisa `oyin-ozgardi` — `{ oyinId, sabab }`: faqat qaysi o'yin o'zgargani va nega. O'quvchi matnida: «Hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi.» Haqiqat manbai bitta — Database.
   - Real vaqt oqimi sxemasi (Mentor misoli, besh qator — 12-ekran va A2 kutilgan natija, bitta manba `MENTOR_SXEMA`):

   | Real vaqt nuqtasi | Kim nima qiladi | Hodisa | Kim oladi | Ekranda nima o'zgaradi |
   |---|---|---|---|---|
   | «8 / 10» va qo'shilganlar ro'yxati | o'yinchi «Qo'shilaman» ni bosadi | `oyin-ozgardi` · sabab `qoshildi` | hamma ulangan ilova | «8 / 10» → «9 / 10», ro'yxatda yangi o'yinchi |
   | «8 / 10» va qo'shilganlar ro'yxati | o'yinchi o'yindan chiqadi (navbatdagi kirsa — shu hodisa) | `oyin-ozgardi` · sabab `chiqdi` | hamma ulangan ilova | son va ro'yxat yangilanadi |
   | «Kelaman» belgilari | o'yinchi «Kelaman» ni bosadi | `oyin-ozgardi` · sabab `tasdiqladi` | hamma ulangan ilova | «Kelishini tasdiqladi: 7 / 9» → «8 / 9» |
   | «Navbatda: N» | o'yinchi navbatga yoziladi | `oyin-ozgardi` · sabab `navbatga-yozildi` | hamma ulangan ilova | «Navbatda: 1» |
   | o'yinlar ro'yxati | tashkilotchi o'yin e'lon qiladi | `oyin-ozgardi` · sabab `elon-berildi` | hamma ulangan ilova | ro'yxatda yangi karta |

   - Render (tayanch 6): yangi versiya chiqqanda ulanish uziladi (A1 da bir gap). «Ochiq ulanishdagi xabarlar uyg'oq tutadi» — faqat O'qituvchi eslatmasida (socket.io ping xabarlariga tegishliligi «qur» da tekshiriladi — 02-FILTR 25).
5. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2 — ta'riflar so'zma-so'z):**
   - **doimiy ulanish** — ilova bilan Backend orasida ochiq turadigan ulanish: ikkalasi istagan payt xabar yubora oladi (4-ekran, harakatdan keyin). **Ulanish** — shu darsda faqat ilova va Backend orasidagi ulanish («ulanish joyi» (6-Modul) bu darsda yo'q).
   - **WebSocket** — doimiy ulanishni beradigan texnologiya (4-ekran, ikkinchi nom qatori). Ishlatilmaydi: vebsoket, soket (yolg'iz).
   - **socket.io** — doimiy ulanish bilan ishlashni osonlashtiradigan kutubxona; nomi tarjima qilinmaydi; ilovada `socket.io-client`, Backend'da NestJS gateway (7-ekran). **gateway** — Backend'da ulanishlarni qabul qiladigan klass (7-ekranda kod kartasi yorlig'i, bitta kulrang izoh; TAYANCHGA SAVOL 5).
   - **hodisa** — ulanish orqali yuboriladigan nomli xabar: nomi va ma'lumoti bor (5-ekran). Bu darsda **faqat** shu ma'noda (T-015; analitika hodisasi 7, 8, 10-darslarda). Ishlatilmaydi: event, voqea, signal.
   - **xabar** — ulanish orqali yuboriladigan narsa (umumiy so'z); hodisa — nomli xabar. «Jonli xabar» bu darsda yo'q.
   - **tinglovchi** — hodisa kelganda ishlaydigan kod (`ulanish.on(…)`) — 9-ekran, Mentor gapida. Ishlatilmaydi: listener, handler.
   - **ulanish holatlari · ulanish belgisi** — **ulangan** — hodisalar keladi · **ulanmoqda** — ulanish yo'q, ilova o'zi ulanishga urinmoqda (birinchi marta yoki uzilgandan keyin); shu payt bo'lgan hodisalar kelmaydi · **ulanmagan** — ilova urinmayapti (masalan, token yaroqsiz yoki foydalanuvchi hisobdan chiqqan).
     Ekrandagi yozuvlar: «Ulangan» · «Ulanmoqda…» · «Ulanmagan». «holat» bu darsda ikki birikmada: «ulanish holati» va kanonik gapdagi «yangi holat» (TAYANCHGA SAVOL 14). Ishlatilmaydi: status, offline, onlayn.
   - **qayta ulanish** — uzilgan ulanishni qayta tiklash (10-ekran). Ishlatilmaydi: reconnect.
   - **real vaqt** — o'zgarishdan keyin foydalanuvchi qo'lda yangilamasdan ekran tez yangilanishi (02-FILTR 6; kartochkada, izoh bilan: «amalda — odatda bir necha soniyada»); **real vaqt nuqtasi** — 11-Moduldan; **real vaqt oqimi sxemasi** — kim nima qilganda qaysi hodisa kimga borishi va ekranda nima o'zgarishi yozilgan jadval (12-ekran, harakatdan keyin).
     «sxema» bu darsda faqat shu jadval; arxitektura rasmi — «chizma» (11-Modul), bu darsda tilga olinmaydi.
   - **so'raydi · so'rov · javob** — ilova Backend'dan (10–11-Modul asosiy fe'li); **qayta-qayta so'raydi** — 10-Modul dashboard'i (bir gapli ko'prik). **pastga tortib yangilash** — telefondagi harakat; web-trekda **«Yangilash» tugmasi**.
   - **token** — kirishda olingan kalit; **yopiq so'rov** — token bilan boradigan so'rov (11-Modul). **Hisobdan chiqish** — tugma nomi (11-Modul).
   - **tashkilotchi · o'yinchi** (ismsiz) · tugmalar «Qo'shilaman» · «Kelaman» · «Yangilash» · «Saqlash» · «Nusxalash» · «Bajardim».
   - **agent** (Antigravity) · **prompt** · **talab** (qayerda · nima qilsin · nima buzilmasin) · **README** · **tekshirish** (o'z ishini ko'rish; «sinov» bu darsda yo'q).
   - **Ishlatilmaydi:** server (prozada), real-time, polling (o'quvchi matnida — «qayta-qayta so'raydi»; kartochkada bir marta qavsda), kanal (ulanish ma'nosida), tunnel, «ekran» dars ekrani ma'nosida (T-064 — «ekran» faqat ilova ekrani), «Modul 12», A1/A2, `m10-02`.
6. **Mentor misolidagi raqamlar (tayanch 1.0, 1.2, 9.2 — aynan):** namuna o'yin **Shanba, 18:00 · Mahalla maydoni · 8 / 10** → «9 / 10»; «Kelishini tasdiqladi: 7 / 9» → «8 / 9»; «Navbatda: 1»; 10-Modul dashboard'i — har 5 soniyada. Boshqa son yo'q; statistika deyilmaydi (T-043).
   Kod oynasida namuna o'yin `oyinId: 1` (TAYANCHGA SAVOL 3).
7. **Metafora yo'q. Keyssiz** (TEX, Qaror-0 22). Qahramon yo'q — vazifani Mentor beradi; odamlar roli bilan: o'yinchi, tashkilotchi, sherik («1-telefon · siz» / «2-telefon · boshqa o'yinchi» — sahna rol yorliqlari).
8. **Kod — kim nima yozadi:** Backend gateway, `ulanish.ts` va belgini **agent** yozadi (A1 talabi); **tinglovchini o'quvchi qo'lda yozadi** — kod oynasida (9-ekran), namuna `ulanish` obyekti bilan («haqiqiy Backend emas» — oynadagi izohda ochiq);
   repo'da bugun tinglovchi yozilmaydi (hodisa hali yo'q). React Native va gateway kodi darsda — o'qiladigan qisqartirilgan bo'lak + telefon maketi (7-ekran); kod oynasida faqat brauzerda ishlaydigan JS. Har blokda mobil va web yo'li.
9. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; telefon, Backend tuguni, konvert, chiziq — CSS/SVG; «Maydon Jamoa» nomi telefon maketida o'z rangida (11-Modul 4-dars quruvchisi tanlagan yashil); logotip yo'q; rang — faqat holat foni (D3): «Ulangan» — `ok`, «Ulanmoqda…» — `accent`, «Ulanmagan» — `ink2`.
10. **Vaqt (90 daqiqa) va ulgurmagan yo'l:** taqsimot tepada. A1 ichida Render kutishi dars oqimini to'xtatmaydi (3-qadamda kutish paytida nima qilinishi yozilgan). Ulgurmasa: A1 4-qadam (telefonda tekshirish) va A2 — uyga vazifa 1-bandi; sxema 13-ekranda baribir saqlanadi (3-dars shuni o'qiydi).
    Yakun sarlavhasi holatga qarab (19-ekran). O'qituvchi eslatmasi 1-ekranda.
11. **Texnik faktlar** — «Manbalar» bo'limida (rasmiy hujjat, 06.10.2026); o'quvchiga ko'rinmaydi. Qisqasi: `connect` birinchi ulanishda va qayta ulanishda ishlaydi; qayta ulanish sukutda yoqilgan (1 s → 2 barobar → ko'pi bilan 5 s); Backend yopgan ulanishda (`io server disconnect`) ilova o'zi qayta urinmaydi;
    uzilgan paytdagi hodisa qayta ulanganda kelmaydi («ko'pi bilan bir marta»); uzilishni payqash sukutda 45 soniyagacha (`pingInterval` 25 s + `pingTimeout` 20 s); socket.io imkon bo'lsa WebSocket orqali ulanadi, bo'lmasa HTTP long-polling bilan; brauzer uchun CORS alohida ruxsat; Render: ochiq ulanishdagi xabarlar so'rov sanaladi (ping xabarlari — «qur» da tekshiriladi), deploy'da uziladi.

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon Jamoa» — mahalladagi mini-futbol uchun jamoa yig'adigan ilova (tayanch 1.0). 11-Modul oxirida «8 / 10» ekran ochilganda va pastga tortganda yangilanardi; bugun ilova Backend'ga doimiy ulanadi,
  hodisa nima olib kelishi ko'riladi, ulanish belgisi tekshiriladi va real vaqt oqimi sxemasi yoziladi. O'quvchi xuddi shuni o'z mahsulotida qiladi (13-ekran, A1, A2).
- **Hook:** ikki telefonda bitta o'yin — ikkinchisida «Qo'shilaman» bosiladi, birinchisida «8 / 10» qoladi → «ilova so'ramasa, Backend o'zi ayta olmaydi» → 4-ekranda ulanish ochiq qoladi va konvert o'zi keladi → 5-ekranda konvert ichida nom va sabab, son esa qayta so'raladi →
  7-ekranda ulanish token bilan → 9-ekranda tinglovchi qo'lda → 10-ekranda uzilish va uch belgi → 12–13-ekranlarda sxema → A1 (ulanish repo'da) → A2 (sxema README'da).
- **Bitta vizual — «ikki telefon va Backend» sahnasi** (bitta manba `SAHNA` + `NAMUNA_OYIN`, 163/180; TAQIQLAR 5: «ikki telefon maketi va ular orasidagi Backend: hodisa uchib boradi, ikkinchi ekranda son o'zgaradi»):
  - **chapda «1-telefon · siz»** (ramka ≈170×272, o'lcham barqaror — SABOQ 22): «Maydon Jamoa» nomi o'z rangida; ekranlar 11-Moduldagidek — **O'yin** («‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · 10 joy: to'la doiralar va uzuq chiziqli bo'sh joylar · «Qo'shilaman») ·
    **O'yinlar** (tepasida **ulanish belgisi** — nuqta + yozuv; kartalar; 10-ekrandan). Telefon holat qatorida samolyot belgisi (uchish rejimi — faqat 10-ekranda bosiladi). Yorliq ramka **ustida** (SABOQ 23): «1-telefon · siz».
  - **o'rtada Backend tuguni** — «Backend» (texnologiya nomi yozilmaydi — tayanchdagi stek 11-Moduldan ma'lum); ichida bir qatorli belgi «Database: 8» → «Database: 9» (haqiqat manbai; alohida tugun yo'q — ≤3 blok, SABOQ 26). 7-ekranda ostida gateway kod kartasi; 10-ekranda «Token: yaroqli / yaroqsiz» kaliti.
  - **o'ngda «2-telefon · boshqa o'yinchi»** — o'sha O'yin ekrani, «Qo'shilaman» (halqa — harakat shu telefonda boshlanadi).
  - **chiziq** telefon ↔ Backend: 2-ekranda faqat so'rov paytida yonib so'nadi (so'rov–javob); 4-ekrandan 1-telefon tomonda **ochiq qoladi** va sekin yonib turadi (doimiy ulanish); 10-ekranda uziladi (uzuq, kulrang), qayta tiklanadi, yopiladi.
  - **konvert** — so'rov («so'rov», «javob» yorlig'i) va hodisa (`oyin-ozgardi` yorlig'i; ochilsa ichida nom va ma'lumot). Hodisa konverti Backend'dan 1-telefonga **ilova so'ramasdan** uchadi (ochiq chiziq bo'ylab).
  - Holatlar: kulrang (yo'q) → oq (bor) → accent (joriy) → yashil (ishladi). Son almashganda bir lahza kattalashib qaytadi (11-Modul 9.14). `prefers-reduced-motion` da konvert yurmaydi, chiziq miltillamaydi — holatlar bir zumda almashadi (DE-200).
  - Ishlatilishi: 0 (ikki telefon, javobdan keyin Backend tug'iladi) · 1 (tayyor holat) · 2 · 4 · 5 · 7 (bitta telefon + kod kartalari) · 10 · 12 (bitta telefon + jadval) · 14 (final) · A1, A2 kutilgan natija.
- **Yakun:** mahsulotingiz Backend'ga ulangan, sxema README'da · keyingi dars — sxemadagi hodisalar talabga aylanadi.

---

## 0 · Kirish — son o'zgarmadi  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **Sizning ekraningizda nega hali «8 / 10» turibdi?** (48)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: Maydon Jamoa 11-Modul oxiridagi holatda: ikkinchi telefonda «Qo'shilaman» ni bosing va birinchisiga qarang.
  - variantlar ochilgach: Endi o'ngdagi javoblardan birini tanlang.
- Maket (chap, ikki telefon yonma-yon, bir balandlikda): «1-telefon · siz» va «2-telefon · boshqa o'yinchi» — ikkalasida O'yin ekrani: «‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · 8 to'la doira + 2 bo'sh joy · «Qo'shilaman».
  2-telefondagi «Qo'shilaman» halqada (faol element); 1-telefonniki oddiy.
- **Harakat → Vizual o'zgarish:** «Qo'shilaman» (2-telefon) → 2-telefonda «8» → «9» (bir lahza kattalashib qaytadi), 9-doira to'la bo'ladi, tugma o'chiq «Qo'shildingiz»; 1-telefonda «8 / 10» qoladi, ~2 soniyadan keyin son ustida kulrang yorliq «eski».
  Shundan keyin o'ngdagi variantlar faollashadi (bosilmaguncha xira).
- Variantlar (radio, ballsiz):
  - Backend yangi sonni hali bilmaydi (32)
  - ✔ Ilova Backend'dan qayta so'ramadi (34)
  - Ikkinchi telefon sizga yubormadi (31)
- Javob — 2-variant: **Aynan!** 11-Modulda ilova so'raganda yangilanadi: ekran ochilganda va pastga tortib yangilaganda. (95)
- Javob — 1-variant: **Qiziq fikr!** Backend biladi: qo'shilish Database'ga yozildi. Ilova esa undan hali qayta so'ramadi. (97)
- Javob — 3-variant: **Qiziq fikr!** Telefonlar bir-birini tanimaydi: ikkalasi ham sonni faqat Backend'dan so'raydi. (91)
- Javobdan keyin: ikki telefon orasida **Backend** tuguni tug'iladi (ichida «Database: 9»); 2-telefondan Backend'ga chiziq bir marta yonib so'nadi (so'rov o'tgan yo'l); Backend'dan 1-telefonga — uzuq kulrang chiziq, ustida «?».
  Tanlangan variant ixcham qator bo'lib qoladi (SABOQ 11).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ Hook obyekti — darsning o'qitish obyekti (P-001): ekran o'zi yangilanishi uchun yo'l. Savol — 11-Modul 8-darsidan eslash; «?» chizig'i bugungi yo'lni ochadi (TAYANCHGA SAVOL 1). Uchala variant «kim — nima qilmadi» shaklida, 31–34 belgi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun mahsulotingiz Backend'ga ulanib turadi.** (45)
- Mentor: Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingizda qilasiz. Backend bugun hali xabar yubormaydi — bugungi ish ulanish va sxema.
- Chap — «Dars oxirida»: 1-telefon «O'yinlar» ekrani, tepasida ulanish belgisi (yashil nuqta · «Ulangan»), telefondan Backend tuguniga ochiq chiziq sekin yonib turadi; bir marta o'zi yuradi (DE-200): chiziq chiziladi → belgi «Ulangan».
  Telefon ostida README kartasining bitta qatori: «Real vaqt» · 5 qator.
- O'ng — qadamlar (tex-karta «01 · matn · teg», bosilmaydi; teglar App.jsx `sub` so'zlari bilan — P-015):
  - 01 · Ekran nega o'zi yangilanmasligini ko'rish · `so'rov`
  - 02 · Ochiq turadigan ulanish va undan keladigan xabar · `doimiy ulanish, hodisalar`
  - 03 · Ilovani Backend'ga ulash, belgini tekshirish · `ulanish`
  - 04 · Mahsulotingiz uchun sxema yozish · `real vaqt oqimi sxemasi`
- Pastki qator (mono, kichik): o'z repo'ngiz — ulanish va `README.md` «Real vaqt» · Mentor misoli `maydon-jamoa` · tayyor holat `m12-dars-02-done`
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: darsning og'ir qismi — 9-ekran (kod oynasi) va A1 (Backend + ilova + Render). 2, 4, 5-ekranlarga ortiqcha vaqt bermang. Vaqt yetmasa A2 uyga vazifaning 1-bandiga o'tadi; sxema 13-ekranda saqlanadi.
  socket.io imkon bo'lsa WebSocket orqali ulanadi, bo'lmasa boshqa yo'l (HTTP long-polling) bilan — darsda «socket.io — WebSocket'ning o'zi» deyilmaydi; o'quvchi so'rasa, shu gap yetadi.

## 2 · So'rov va javob  ← QTushuncha (bashorat + 2 qadam)
- Eyebrow: Tushuncha · so'rov
- Sarlavha: **So'rov bo'lmasa, Backend nima qila oladi?** (41)
- Mentor: Backend tugunidagi «1-telefonga yuborish» ni bosib ko'ring, keyin birinchi telefonni pastga torting.
- Bashorat (ballsiz, yorliq «Avval o'zingiz belgilab ko'ring»; tanlangach ixcham qator): **Backend yangi sonni birinchi telefonga o'zi yubora oladimi?** · Ha, istagan payt · Yo'q, faqat so'rovga javoban
- Sahna (0-ekran oxiridagi holat): 1-telefon «8 / 10» (yorliq «eski») · Backend («Database: 9»; ichida tugma «1-telefonga yuborish» — halqada) · 2-telefon «9 / 10», «Qo'shildingiz». Qadam belgilari tugma yonida (SABOQ 21): 1 Yuborib ko'ring · 2 Pastga torting.
- **Harakat → Vizual o'zgarish:**
  1. «1-telefonga yuborish» → konvert Backend'dan chiqadi, lekin 1-telefonga yo'l yo'q: uzuq chiziq boshida to'xtab, silkinib orqaga qaytadi; Backend ichida bir qator «so'rov yo'q — yo'l yopiq». 1-telefon tepasida «↓ Pastga torting» halqaga o'tadi.
  2. 1-telefonni pastga tortish (sudrash; klaviaturada — «Yangilash» tugmasi) → konvert «so'rov» 1-telefondan Backend'ga, chiziq so'rov davomida yonadi → konvert «javob» qaytadi → «8» → «9» (kattalashib qaytadi), «eski» yorlig'i yo'qoladi → chiziq yana so'nadi.
- Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: yo'q, faqat so'rovga javoban» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: 11-Modulda yo'l faqat so'rov paytida ochiladi: ilova so'ramasa, Backend unga hech narsa yubora olmaydi. (103)
- Tugadi (199): qadam belgilari yopiladi, sahna butun enga; vizual ⛶ ichida (q17). Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish
✎ «1-telefonga yuborish» — sahna tugmasi (haqiqiy Backend'da bunday tugma yo'q): o'quvchi Backend'ning qo'lidan nima kelmasligini o'zi ko'radi. Pastga tortish — 11-Modul 8-dars 6-ekranidagi mexanika (sudrash + klaviatura zaxirasi).

## 3 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol
- Savol: **11-Modulda ilova yangi sonni Backend'dan qachon olardi?** (8 so'z; 02-FILTR 33)
  - Database'da son o'zgargan paytda
  - ✔ Backend'ga so'rov yuborgan paytda
  - Boshqa o'yinchi qo'shilgan paytda
  - Ilova ekranda ochiq turgan paytda
- Kalit: **B** (index 1). To'rttalasi «… paytda» shaklida; uzunlik — skript o'lchovi (O'lchov bo'limi).
- To'g'ri izohi: So'rov bo'lmasa, Backend'dan ilovaga yo'l ochilmaydi — javob faqat so'rovga keladi.
- Xato izohlari (≤60):
  - A: Database o'zgardi — lekin ilovaga yo'lni kim ochadi? (52)
  - C: Qo'shilish Backend'ga yetdi; sizning ilovangizga-chi? (53)
  - D: Ochiq turgan ekranda son eski qoldi — nimadir yetmadi. (54)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 4 · Ochiq turadigan ulanish  ← QTushuncha (bashorat + 2 qadam)
- Eyebrow: Tushuncha · ulanish
- Sarlavha: **Ulanish ochiq tursa, nima o'zgaradi?** (36)
- Mentor: 10-Modulda dashboard Backend'dan qayta-qayta so'rardi — bugun boshqa yo'l: birinchi telefonda Maydon Jamoa'ni oching.
- Bashorat (ballsiz; tanlangach ixcham qator): **Ulanish ochiq turganda Backend ilovaga qachon xabar yubora oladi?** · Faqat ilova so'raganda · Har 5 soniyada · Istagan payt (S-015: bir o'lchov, o'sish tartibida)
- Sahna (yangi holat, ikkala o'yin «8 / 10»): 1-telefon — bosh ekran, «Maydon Jamoa» belgisi (matnsiz oddiy yashil shakl + nom; halqada) · Backend («Database: 8») · 2-telefon — O'yin ekrani, «Qo'shilaman». Qadam belgilari: 1 Ilovani oching · 2 Ikkinchi telefonda qo'shiling.
- **Harakat → Vizual o'zgarish:**
  1. «Maydon Jamoa» (1-telefon) → ilova ochiladi (O'yin ekrani): konvert «so'rov» borib-keladi, «8 / 10» chiqadi; keyin telefondan Backend'ga chiziq chiziladi va **so'nmaydi** — sekin yonib turadi, ustida yorliq «ochiq».
     Nom qatori 1 (bitta): Ilova bilan Backend orasida ochiq turadigan ulanish — doimiy ulanish.
  2. «Qo'shilaman» (2-telefon) → konvert «so'rov» 2-telefondan Backend'ga, «Database: 8» → «9», 2-telefonda «9 / 10»; shundan keyin Backend'dan ochiq chiziq bo'ylab konvert `oyin-ozgardi` **o'zi** 1-telefonga uchadi (1-telefon so'ramagan) va telefon chetida yopiq turadi — yonida nuqta, yorliq «ochilmagan». 1-telefonda son hali «8 / 10».
     Nom qatori 2 (bitta): Doimiy ulanishni beradigan texnologiya — WebSocket.
- Natija qatori: «Taxminingiz: … · haqiqatda: istagan payt» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Ulanish ochiq turganda ikkalasi istagan payt xabar yubora oladi: Backend ilova so'rashini kutmaydi. (99)
- Tugadi (199): qadam belgilari yopiladi, sahna fokusga — yopiq konvert 1-telefon chetida qoladi (keyingi ekran uni ochadi); vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish
✎ T-011 tartibi: hodisa sahnada (konvert o'zi keldi) → «doimiy ulanish» → «WebSocket». Qayta-qayta so'rash ko'prigi — Mentor gapida bir marta (tayanch 1.2). Son 1-telefonda o'zgarmagani — rost holat: tinglovchi hali yo'q (9-ekran).

## 5 · Konvert ichida nima bor  ← QTushuncha (bashorat + 2 qadam)
- Eyebrow: Tushuncha · hodisa
- Sarlavha: **Backend yuborgan xabarda nima bor?** (34)
- Mentor (bosqichga qarab): boshida — Birinchi telefon chetidagi konvertni bosib oching. · ochilgach — Ichida son yo'q: «Qayta so'rash» ni bosing.
- Bashorat (ballsiz; tanlangach ixcham qator): **Konvert ichida nima bor?** · Faqat qaysi o'yin o'zgargani · O'yinning yangi soni · O'yinlarning to'liq ro'yxati (S-015: kamdan ko'pga)
- Sahna (4-ekran oxiri): 1-telefon «8 / 10», chetida yopiq konvert (halqada) · Backend («Database: 9») · 2-telefon «9 / 10». Telefon ostida tugma «Qayta so'rash» (xira — konvert ochilgach halqaga o'tadi).
- **Harakat → Vizual o'zgarish:**
  1. Konvert → ochiladi, ichida ikki qator: `oyin-ozgardi` (yorliq «nomi») · `{ oyinId: 1, sabab: 'qoshildi' }` (yorliq «ma'lumoti»). Son yo'q — «8 / 10» o'zgarmaydi.
     Nom qatori (bitta): Ulanish orqali yuboriladigan nomli xabar — hodisa: nomi va ma'lumoti bor.
  2. «Qayta so'rash» → konvert «so'rov» `GET /oyinlar` 1-telefondan Backend'ga → «Database: 9» bir lahza yonadi → konvert «javob» qaytadi → «8» → «9» (kattalashib qaytadi), 9-doira to'la.
- Natija qatori: «Taxminingiz: … · haqiqatda: faqat qaysi o'yin o'zgargani va sababi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu misolda hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi. (94)
- Qator (`QIzoh`, xulosadan keyin, bitta): Haqiqiy sonni ilova Backend'dan qayta oladi; Backend uchun manba — Database. (76)
- Tugadi (199): «Qayta so'rash» yopiladi, ochiq konvert va «9 / 10» fokusga; vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish
✎ «Qayta so'rash» — sahna tugmasi: haqiqiy ilovada bu ishni tinglovchi kodi qiladi (9-ekranda o'quvchi yozadi); ✎ izohda shunday. Kanonik gap tayanch 1.2 dan, oldiga «Bu misolda» qo'shildi (TAYANCHGA SAVOL 4).

## 6 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol
- Savol: **Mentor misolida `oyin-ozgardi` hodisasi ilovaga nimani olib keladi?** (8 so'z)
  - O'yinning yangi sonini va ro'yxatini
  - Qo'shilgan o'yinchining ismini
  - O'yinlarning yangilangan ro'yxatini
  - ✔ Qaysi o'yin o'zgargani va sababini
- Kalit: **D** (index 3). To'rttalasi «nimani» savoliga ot bilan javob beradi; «o'yin» so'zi uch variantda.
- To'g'ri izohi: Hodisada `oyinId` va `sabab` bor; yangi sonni ilova `GET /oyinlar` dan qayta so'raydi.
- Xato izohlari (≤60):
  - A: Konvertni ochganingizda ichida son bormidi? (43)
  - B: Hodisada ism yo'q edi: unda ikki maydon bor. (44)
  - C: Ro'yxat katta, hodisa esa qisqa — ikki maydon. (46)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 7 · Kim ulanayotgani  ← QTushuncha (bashorat + 2 qadam; kod kartalari)
- Eyebrow: Tushuncha · token
- Sarlavha: **Backend kim ulanayotganini qayerdan biladi?** (43)
- Mentor: Mentor misolida ulanishni socket.io kutubxonasi ochadi — avval «Tokensiz ulanish» ni, keyin «Token bilan ulanish» ni bosing.
- Bashorat (ballsiz; tanlangach ixcham qator): **Ulanayotgan ilova Backend'ga o'zi haqida nimani yuboradi?** · Hech narsa · Tokenni · Ism va parolni (S-015: kamdan ko'pga)
- Chap — 1-telefon («O'yinlar» ekrani; tepasida belgi joyi — kulrang nuqta, yozuvsiz). Telefon **ostida** kod kartasi (o'qish uchun, qisqartirilgan — P-065), yorlig'i `mobil/src/ulanish.ts`:
  ```ts
  import { io } from 'socket.io-client';

  const ulanish = io(BACKEND_MANZILI, {
    auth: { token },
  });
  ```
  Karta ostida kulrang bir qator: `BACKEND_MANZILI` — `.env` dagi `EXPO_PUBLIC_API_URL` (web-trekda `VITE_API_URL`); `token` — kirishda saqlangan token.
  Telefon ostida ikki tugma: «Tokensiz ulanish» (halqada) · «Token bilan ulanish».
- O'ng — Backend tuguni; **ostida** kod kartasi (o'qish uchun, qisqartirilgan), yorlig'i `backend` · gateway — Backend'da ulanishlarni qabul qiladigan klass:
  ```ts
  @WebSocketGateway()
  export class OyinlarGateway {
    handleConnection(ulanish: Socket) {
      const token = ulanish.handshake.auth.token;
      if (!tokenYaroqli(token)) ulanish.disconnect();
    }
  }
  ```
- **Harakat → Vizual o'zgarish:**
  1. «Tokensiz ulanish» → ilova kartasida `auth` qatori bo'sh ko'rinadi (`auth: {}`), telefondan Backend'ga chiziq chizila boshlaydi → gateway kartasida `if (!tokenYaroqli(token)) ulanish.disconnect();` qatori qizil yonadi → chiziq uziladi va yo'qoladi; telefon tepasida belgi «Ulanmagan» (kulrang).
  2. «Token bilan ulanish» → `auth: { token }` qatori yonadi → chiziq chiziladi → gateway kartasida tekshiruv qatori yashil ✓ → chiziq ochiq qoladi (sekin yonadi); belgi «Ulangan» (yashil nuqta).
- Nom qatori (2/2 dan keyin, bitta): socket.io — doimiy ulanish bilan ishlashni osonlashtiradigan kutubxona; u imkon bo'lsa WebSocket orqali ulanadi. Ilovada `socket.io-client`, Backend'da NestJS gateway. (02-FILTR 1: WebSocket — texnologiya, socket.io — bu loyihadagi kutubxona)
- Natija qatori: «Taxminingiz: … · haqiqatda: tokenni» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu misolda ilova ulanayotganda tokenni yuboradi; Backend shu paytda tekshiradi va yaroqsiz bo'lsa yopadi. (105)
- Qator (`QIzoh`, xulosadan keyin, bitta): Token yopiq so'rovlardagidek ishlatiladi, lekin bu yerda u ulanish ochilayotganda tekshiriladi. (95)
- Tugadi (199): tugmalar yopiladi, telefon va Backend ochiq chiziq bilan fokusga, kod kartalari qoladi (o'qish uchun); vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ikkalasini sinab ko'ring (N/2) → Davom etish
✎ Kod kartalari — Mentor repo'sidagi koddan qisqartirilgan bo'lak (P-065); `BACKEND_MANZILI`, `tokenYaroqli` — o'qish uchun yordamchi nomlar, to'liq kodni agent yozadi (TAYANCHGA SAVOL 5). Uch blok: telefon + kartasi · Backend + kartasi · tugmalar (SABOQ 26).
  Backend yopgan ulanishda ilova o'zi qayta urinmaydi (socket.io: `io server disconnect`) — shuning uchun belgi «Ulanmagan», «Ulanmoqda…» emas (Manbalar 2).

## 8 · 3-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 3-savol
- Savol: **Mentor misolida ilova yaroqsiz token bilan ulanmoqchi. Backend nima qiladi?** (10 so'z)
  - ✔ Ulanishni yopadi, hodisa yubormaydi
  - Ulanishni ochadi, hodisa yubormaydi
  - Ulanishni ochadi, parolni so'raydi
  - Ulanishni yopadi, yangi token beradi
- Kalit: **A** (index 0). To'rttalasi «Ulanishni …, … » shaklida; «yopadi» va «ochadi» ikkitadan (shakl-telli yo'q).
- To'g'ri izohi: Ulanish ochilayotganda token yaroqsiz bo'lsa, Backend uni yopadi. (65)
- Xato izohlari (≤60):
  - B: Yaroqsiz tokendan keyin Backend kodida qaysi qator ishladi? (59)
  - C: Parol faqat kirishda yoziladi; ulanishda so'ralmaydi. (53)
  - D: Yangi token faqat «Kirish» ekranida olinadi. (44)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 9 · Tinglovchi  ← QKod
- Eyebrow: Kod yozish · tinglovchi
- Sarlavha: **Hodisa kelganda sonni qayta so'raydigan kod yozamiz.** (52) — §19 sarlavha oilasi
- Mentor: Hodisa kelganda ishlaydigan kod tinglovchi deyiladi. Uni o'zingiz terib yozasiz: qo'lda yozganda o'rganiladi.
- Chap — vazifa (3 band):
  1. `ulanish.on('oyin-ozgardi', …)` bilan tinglovchi yozing.
  2. Tinglovchi ichida `korsat()` ni chaqiring — son qayta so'ralsin.
  3. Natija oynasida «Boshqa o'yinchi qo'shildi» ni bosing: «Yangilash» ni bosmasdan son 8 dan 9 ga o'tsin.
- Yordam: Shakli 11-Moduldagi `yangila.addEventListener('click', korsat)` kabi: avval hodisa nomi qo'shtirnoqda, keyin ishlaydigan funksiya. Son o'zgarmasa — nom `oyin-ozgardi` deb, chiziqcha bilan yozilganini tekshiring.
- Tugma (o'ngda): Bajardim — shartlar ✓ bo'lgach ochiladi (§19 halol tugma).
- O'ng — platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi; ostida bir qator: «Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.») → `HtmlCompiler`, fayllar:
  - `index.html` — tayyor, o'zgarmaydi:
    ```html
    <div class="oyin">
      <p>Shanba, 18:00 · Mahalla maydoni</p>
      <p class="hisob"><span class="son">…</span> / 10</p>
      <button class="yangila">Yangilash</button>
    </div>
    <button class="boshqa">Boshqa o'yinchi qo'shildi</button>
    <p class="kelgan">Kelgan hodisa: hali yo'q</p>
    ```
  - `namuna.js` — tayyor, o'zgarmaydi (tepasida izoh ochiq):
    ```js
    // Backend va ulanish o'rnida NAMUNA (haqiqiy Backend emas):
    // son shu faylda turadi, hodisani «Boshqa o'yinchi qo'shildi» tugmasi yuboradi.
    let qoshilgan = 8;
    function sora() {
      return qoshilgan;
    }

    const tinglovchilar = [];
    const ulanish = {
      on: function (nom, kod) {
        tinglovchilar.push({ nom: nom, kod: kod });
      },
    };

    document.querySelector('.boshqa').addEventListener('click', function () {
      if (qoshilgan >= 10) return;
      qoshilgan = qoshilgan + 1;
      const malumot = { oyinId: 1, sabab: 'qoshildi' };
      document.querySelector('.kelgan').textContent =
        'Kelgan hodisa: oyin-ozgardi ' + JSON.stringify(malumot);
      tinglovchilar.forEach(function (t) {
        if (t.nom === 'oyin-ozgardi') t.kod(malumot);
      });
    });
    ```
  - `app.js` — tepasi tayyor (11-Modul 8-darsidan), pastini o'quvchi yozadi (boshlang'ich holat):
    ```js
    const son = document.querySelector('.son');
    const yangila = document.querySelector('.yangila');
    function korsat() {
      son.textContent = sora();
    }
    korsat();
    // 11-Modul: tugma bosilganda so'raydi
    yangila.addEventListener('click', korsat);

    // Bugun: hodisa kelganda so'rang.
    // 1) ulanish.on bilan 'oyin-ozgardi' ga tinglovchi yozing — shu yerda
    ```
- Kod oynasi sarlavhasi: `app.js — hodisa kelganda qayta so'rang`
- Shart xabarlari (≤60):
  - 1 — `ulanish.on` `'oyin-ozgardi'` nomi bilan chaqirilsin. (53)
  - 2 — Hodisa kelganda `korsat` ishlasin: son 8 dan 9 ga o'tsin. (57)
- **Harakat → Vizual o'zgarish:** tinglovchi yozilmaguncha «Boshqa o'yinchi qo'shildi» bosilsa — pastda «Kelgan hodisa: oyin-ozgardi {"oyinId":1,"sabab":"qoshildi"}» chiqadi, son «8 / 10» qoladi («Yangilash» bosilsa — «9 / 10»).
  Tinglovchi yozilgach: tugma bosilganda son o'zi «9 / 10», yana bosilsa «10 / 10». Har shart bajarilganda ✓. Kod o'zgarsa natija oynasi boshidan ochiladi (yana «8»). «Bajardim» → panel yopiladi, natija oynasi fokusga (199).
- Xulosa: Bu kodda son uch paytda so'raladi: sahifa ochilganda, «Yangilash» bosilganda va hodisa kelganda. (96)
- Qator (`QIzoh`, xulosadan keyin): Bu oynada `ulanish` — namuna: haqiqiy Backend emas, hodisani tugma yuboradi. (76)
✎ `ulanish.on('oyin-ozgardi', korsat)` ham, `function (hodisa) { korsat(); }` o'rami ham qabul qilinadi (KOD 9). Hodisa ma'lumoti pastdagi qatorda ko'rinadi — unda son yo'qligi yana bir bor ko'z oldida (5-ekran bilan bir manba).
  Repo'da bugun tinglovchi yozilmaydi (hodisa hali yo'q) — bu oyna ko'nikma uchun (tayanch 1.2).

## 10 · Ulanish belgisi  ← QTushuncha (bashorat + 4 qadam)
- Eyebrow: Tushuncha · ulanish holati
- Sarlavha: **Ulanish uzilsa, o'yinchi buni qayerdan biladi?** (46)
- Mentor: Doimiy ulanish ham uziladi — birinchi telefonda uchish rejimini yoqing va tepadagi belgiga qarang.
- Bashorat (ballsiz; tanlangach ixcham qator): **Uchish rejimida belgi nimani ko'rsatadi?** · «Ulangan» · «Ulanmoqda…» · «Ulanmagan»
- Sahna: 1-telefon — «O'yinlar» ekrani, tepasida belgi «Ulangan» (yashil nuqta); kartalar: Shanba, 18:00 · Mahalla maydoni · 8 / 10 (va boshqa namuna kartalar xira); holat qatorida samolyot belgisi (halqada) · Backend («Database: 8»; ostida kalit «Token: yaroqli») · 2-telefon — O'yin, «Qo'shilaman».
  Qadam belgilari (tugma yonida): 1 Uchish rejimini yoqing · 2 Ikkinchi telefonda qo'shiling · 3 Uchish rejimini o'chiring · 4 Tokenni yaroqsiz qiling.
- **Harakat → Vizual o'zgarish:**
  1. Samolyot → chiziq uziladi (uzuq, kulrang), belgi «Ulanmoqda…» (accent nuqta, yengil pulsatsiya); uzilgan chiziq boshida kichik ↻ — ilova o'zi urinmoqda. 2-telefondagi «Qo'shilaman» halqaga o'tadi.
  2. «Qo'shilaman» (2-telefon) → 2-telefonda «9 / 10», «Database: 9»; Backend'dan konvert `oyin-ozgardi` uzuq chiziqqa chiqadi va uzilgan joyda so'nadi — yonida yorliq «kelmadi». 1-telefonda «8 / 10». Samolyot yana halqada.
  3. Samolyot (o'chirish) → ↻ chiziqni qayta tiklaydi (odatda bir necha soniya — sahnada ≈2 s) → belgi «Ulangan»; «8 / 10» qoladi, yonida kulrang «eski bo'lishi mumkin». Backend ostidagi kalit halqaga o'tadi.
  4. «Token: yaroqli» → «yaroqsiz» → Backend ulanishni yopadi: chiziq yo'qoladi, ↻ yo'q → belgi «Ulanmagan» (kulrang).
- Nom qatori (4/4 dan keyin, bitta): Uch belgi — uch ulanish holati: ulangan, ulanmoqda, ulanmagan.
- Natija qatori: «Taxminingiz: … · haqiqatda: «Ulanmoqda…»» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Ulangan — hodisalar keladi; ulanmoqda — ilova o'zi urinmoqda; ulanmagan — ilova urinmayapti. (98)
- Qator (`QIzoh`, xulosadan keyin, bitta): Ulanish qaytgani son to'g'rilandi degani emas: bu misolda uzilishdagi hodisa keyin kelmaydi. (92)
- Tugadi (199): qadam belgilari va kalit yopiladi, telefon uch belgi bilan (kichik qator: «Ulangan · Ulanmoqda… · Ulanmagan») fokusga; vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/4) → Davom etish
✎ T-045: «doimiy» — uzilmaydi degani emas (Mentor gapi). Uzilgan paytdagi hodisa — tayanch 2 ta'rifidan («shu payt bo'lgan hodisalar kelmaydi»); 5-darsning «qayta ulanganda qayta so'rash» tuzatishi bu yerda aytilmaydi (T-038). «Ulanmagan» — Backend yopgan ulanish (TAYANCHGA SAVOL 8).
  Haqiqiy telefonda uzilishni payqash 45 soniyagacha cho'zilishi mumkin (Manbalar 5) — sahnada tez; A1 4-qadamda «bir daqiqagacha» deb yozilgan.

## 11 · 4-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 4-savol
- Savol: **«Ulanmoqda…» paytida boshqa o'yinchi qo'shildi. Ekraningizda nima bo'ladi?** (9 so'z)
  - Hodisa keladi, son o'zi yangilanadi
  - Hodisa kutib turadi, keyin keladi
  - ✔ Hodisa kelmaydi, son eski qoladi
  - Hodisa keladi, ilova yopilib qoladi
- Kalit: **C** (index 2). To'rttalasi «Hodisa …, … » shaklida; «keladi» uch variantda.
- To'g'ri izohi: Ulanish uzilgan paytda bo'lgan hodisa bu misolda keyin ham kelmaydi — son eski qoladi.
- Xato izohlari (≤60):
  - A: Ulanish uzilgan — hodisa qaysi yo'ldan kelardi? (47)
  - B: Bu misolda Backend uzilgan ilova uchun hodisani saqlamaydi. (59)
  - D: Ilova ishlayveradi: belgi o'zgaradi, ekran yopilmaydi. (54)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 12 · Mentor sxemasi  ← QTushuncha (bashorat + 5 qator, bittadan)
- Eyebrow: Tushuncha · sxema
- Sarlavha: **Kim nima qilsa, kimning ekrani o'zgaradi?** (41)
- Mentor: Har o'zgarish uchun Backend yuboradigan hodisaning sababini tanlang — qator jadvalga tushadi.
- Bashorat (ballsiz; tanlangach ixcham qator): **Besh xil o'zgarish uchun Mentor nechta hodisa nomi yozgan?** · Bitta · Uchta · Beshta
- Chap — 1-telefon (Maydon Jamoa): joriy qatorga mos ekran va joy halqada (1, 2 — O'yin: «8 / 10» va doiralar · 3 — O'yin, tashkilotchi ko'rinishi: «Kelishini tasdiqladi: 7 / 9» · 4 — O'yin: «Navbatda: 0» · 5 — O'yinlar ro'yxati).
- O'ng — sxema jadvali: besh ustun sarlavhasi (Real vaqt nuqtasi · Kim nima qiladi · Hodisa · Kim oladi · Ekranda nima o'zgaradi), qatorlar bo'sh (uzuq chiziqli, U-041), hisoblagich «Qatorlar: 0 / 5».
  Jadval ostida joriy karta — **bittadan** (SABOQ 9, 13): «Kim nima qiladi» matni va besh sabab varianti (hamma kartada bir xil tartibda): `qoshildi` · `chiqdi` · `tasdiqladi` · `navbatga-yozildi` · `elon-berildi`.
  Kartalar (A-bo'lim jadvali, aynan):
  1. o'yinchi «Qo'shilaman» ni bosadi → `qoshildi`
  2. o'yinchi o'yindan chiqadi (navbatdagi kirsa — shu hodisa) → `chiqdi`
  3. o'yinchi «Kelaman» ni bosadi → `tasdiqladi`
  4. o'yinchi navbatga yoziladi → `navbatga-yozildi`
  5. tashkilotchi o'yin e'lon qiladi → `elon-berildi`
- **Harakat → Vizual o'zgarish:** sabab varianti →
  - to'g'ri → telefon chetiga kichik konvert `oyin-ozgardi · <sabab>` uchib keladi → telefondan Backend'ga kichik `GET /oyinlar` so'rovi borib-qaytadi → shundan keyin telefondagi joy o'zgaradi (02-FILTR 36: hodisa → qayta so'rash → ekran) (1: «8 / 10» → «9 / 10», yangi doira · 2: «9 / 10» → «8 / 10» · 3: «7 / 9» → «8 / 9» · 4: «Navbatda: 1» · 5: ro'yxatda yangi karta), qator jadvalga sirg'alib kiradi (~1 s yashil): nuqta · kim nima qiladi · `oyin-ozgardi` · sabab · hamma ulangan ilova · ekranda nima o'zgaradi; hisoblagich oshadi; keyingi karta chiqadi;
  - boshqa sabab → karta silkinadi, bir qator (`QXato`, ≤60): Sabab o'yinchi nima qilganini aytadi — kartani qayta o'qing. (60)
- Nom qatori (5/5 dan keyin, bitta): Kim nima qilganda qaysi hodisa kimga borishi va ekranda nima o'zgarishi yozilgan jadval — real vaqt oqimi sxemasi.
- Natija qatori: «Taxminingiz: … · Mentor misolida: bitta — `oyin-ozgardi`, besh sabab bilan» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Mentor misolida bitta hodisa besh sabab bilan keladi; har qatorda kim olishi va nima o'zgarishi yozilgan. (105)
- Qator (`QIzoh`, xulosadan keyin, bitta): Sxema — reja: hodisalar hali yuborilmaydi; Mentorning sodda variantida ular hamma ulangan ilovaga boradi. (105)
- Tugadi (199): karta yopiladi, to'liq jadval butun enga (telefon kichik, chapda); vizual ⛶ ichida. Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qatorlarni to'ldiring (N/5) → Davom etish
✎ Jadval kataklaridagi «→» — tayanch 1.2 jadvalidan aynan (Shubhali 10). Bitta hodisa nomi + sabab — Mentor qarori, umumiy qolip emas (13-ekran Yordami). Jadvalning 1280 px da sig'ishi — vizual bosqichda (KOD 12).

## 13 · O'z sxemangiz  ← QMustaqil (bitta karta ketma-ket — SABOQ 29)
- Eyebrow: Mustaqil ish · sxema
- Sarlavha: **Mahsulotingiz uchun real vaqt oqimi sxemasini yozing.** (53)
- Mentor: 11-Modulda README'ga yozgan real vaqt nuqtalaringizdan boshlang: har nuqtaga bitta qator.
- Tepada ixcham chiziq: 1 · 2 · 3 … (joriy qator accent, tayyori ✓). Bir vaqtda bitta katta karta — besh maydon:
  1. Real vaqt nuqtasi — «Ekraningizdagi qaysi joy boshqa odam tufayli o'zgaradi?» (ipucha: masalan: «8 / 10» va qo'shilganlar ro'yxati)
  2. Kim nima qiladi (ipucha: masalan: o'yinchi «Qo'shilaman» ni bosadi)
  3. Hodisa — nomi va, kerak bo'lsa, sababi (ipucha: masalan: oyin-ozgardi · sabab qoshildi)
  4. Kim oladi (ipucha: masalan: hamma ulangan ilova)
  5. Ekranda nima o'zgaradi (ipucha: masalan: «8 / 10» o'rniga «9 / 10»)
  Karta ostida ikki tugma: «Qator tayyor» (asosiy) · «Yana qator» (ikkinchi darajali; ko'pi bilan 5 qator; kamida 1 — 02-FILTR 19).
- Yordam (ochiladigan): Bu kursda hodisa nomi kichik harf va chiziqcha bilan, bo'lib o'tgan ish ma'nosida yoziladi: `oyin-ozgardi`. Bitta nom va bir necha sabab ham, har o'zgarishga alohida nom ham bo'ladi — qaror sizniki.
  Mahsulotingizda boshqa odam o'zgartiradigan joy bo'lmasa — o'zingiz ikkinchi qurilmada o'zgartiradigan ma'lumotni oling: telefonda qo'shdingiz, kompyuterda ko'rinsin.
- Shart xabari («Saqlash» bosilganda, ≤60): Kamida ikki qator kerak; har qatorda beshta katak to'lsin. (58)
- Tugma (o'ngda): Saqlash → `pm-m10d2-sxema` = `{ qatorlar: [{ id, nuqta, kimNima, hodisa, kimOladi, ekranda }] }` (`id` — `q1`, `q2`… yaratilganda beriladi, qayta ishlatilmaydi; tartib o'zgarmaydi).
- **Harakat → Vizual o'zgarish:** «Qator tayyor» → karta ixcham qatorga yig'ilib tepadagi ro'yxatga tushadi (nuqta · hodisa · ekranda — uzun matn qisqartiriladi, SABOQ 29); keyingi karta bo'sh ochiladi;
  «Saqlash» → hammasi bitta ixcham qator: «Sxema · N qator ✓» (SABOQ 17).
- Xulosa (saqlagach): Sxemangiz saqlandi — amaliyotda u README'ga ko'chiriladi. (57)
- Tugma (pastki): Saqlang → Davom etish
✎ Kalit oldin bor bo'lsa — qatorlar to'ldirilgan holda ochiladi, o'zgartirsa bo'ladi. Shaxsiy ma'lumot (ism) kalitga yozilmaydi — maydonlar rol bilan («o'yinchi»). Qator soni va `hodisa` bitta matn maydoni — TAYANCHGA SAVOL 9.

## 14 · Hodisa yo'li (final)  ← QTartib (ball · sentinel `0`)
- Eyebrow: Yakuniy · tartib
- Sarlavha: **O'zgarish sizning ekraningizga qaysi tartibda yetadi?** (53)
- Mentor: Bo'laklarni bajariladigan tartibda joylang.
- Bo'laklar (to'g'ri tartibda; ekranda aralash; sudrash yoki bosish — 188):
  1. Ilova Backend'ga token bilan ulanadi
  2. Boshqa o'yinchi «Qo'shilaman» ni bosadi
  3. Backend qo'shilishni Database'ga yozib tugatadi
  4. Backend `oyin-ozgardi` hodisasini yuboradi
  5. Ilova `GET /oyinlar` dan qayta so'raydi
  6. Ekraningizda «9 / 10» ko'rinadi
- Uyalar: 6 ta, har birida faqat raqam va «bu yerga qo'ying» (tartibni ochmaydi).
- Xato: Tartib mos emas — bo'lakni bosib qaytaring. (43)
- Xulosa (yechilgach, bir marta): Bu misolda avval Database'dagi o'zgarish tugaydi, keyin hodisa yuboriladi — ilova yangi sonni oladi. (100)
  - Oldin xato bo'lgan bo'lsa, havola: Qisqa takrorlash — mavzuni yana bir ko'rish
✎ 3 va 4-bo'laklar tartibi — o'qitiladigan nuqta: hodisa o'zgarish saqlanib tugashidan (tranzaksiya — 11-Modul 14-darsi) oldin ketsa, ilova eski sonni oladi (02-FILTR 2) (RECAPS 5 sinfga savoli). 1-bo'lak birinchi — ulanish bo'lmasa hodisa kelmaydi (TAYANCHGA SAVOL 23).

## 15 · Amaliyot 1 — ilova Backend'ga ulanadi  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈30 daq — 02-FILTR 11)
- Eyebrow: Amaliyot 1 · o'z repo'ngiz
- Sarlavha: **Mahsulotingiz Backend'ga ulansin va belgi ko'rsatsin.** (53)
- Mentor: Talab tayyor — ikki joyni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.
- Model (tayanch 4, 11-Modul 9.1, 9.12): to'rt qadamning hammasi o'quvchining o'z repo'sida, o'z mahsuloti va trekida; Mentor misoli — namuna (o'ngda kutilgan natija, `{…}` yonida kulrang «masalan: …», «Yordam»da Mentor misolidagi to'liq talab). 5-qadam yo'q.
  Talab zinapoyasi A1: tayyor talab + 2 joy. Trek — `pm-m9d8-platforma.trek` (yo'q bo'lsa — blok tepasida ikki tugma «Mobil trek» · «Web-trek», tanlov shu kalitga yoziladi — 11-Modul 9.77).
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching (11-Modul oxiridagi holat: kirish ishlaydi, ro'yxat Backend'dan keladi). Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin; ko'rinsa, agentga: «`.env` fayllarini `.gitignore` ga qo'sh.»
     Mobil trekda `cd mobil`, `npx expo start` ishlab tursin va ilova telefoningizda ochiq bo'lsin; web-trekda saytingiz Netlify'da ochiq tursin.
     Belgi turadigan ekranni tanlang: Mentor misolida — «O'yinlar» (eng ko'p ochiladigan ekran); mahsulotingizda — foydalanuvchi eng ko'p vaqt o'tkazadigan ekran.
  2. **Prompt** — qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring (mobil trek ko'rinishi; web-trek qatorlari pastda):
     > Qayerda: `backend/` — yangi gateway (NestJS, socket.io: `@nestjs/websockets` va `@nestjs/platform-socket.io`); `mobil/` — yangi fayl `src/ulanish.ts` (`socket.io-client`) va {belgi turadigan ekran}.
     > Nima qilsin: ilova kirgandan keyin Backend'ga bir marta ulansin va ulanayotganda tokenni yuborsin (`auth`); manzil — `EXPO_PUBLIC_API_URL`. Backend tokenni ulanish ochilayotganda tekshirsin: token yo'q yoki yaroqsiz bo'lsa — ulanishni yopsin. Ilova tokenni o'qib bo'lgandan keyingina ulansin. `README.md` «Stek» qatoriga socket.io ni qo'sh.
     > {belgi turadigan ekran} tepasida ulanish belgisi tursin: ulangan — «Ulangan»; ulanish yo'q va ilova o'zi ulanishga urinayotgan bo'lsa — «Ulanmoqda…»; urinmayotgan bo'lsa — «Ulanmagan». «Hisobdan chiqish»da ulanish yopilsin; qayta kirilganda yangi token bilan ulansin. Ekran qayta ochilganda ulanish tinglovchilari ko'payib ketmasin.
     > Hozircha hech qanday hodisa yuborilmasin va tinglanmasin — faqat ulanish va belgi.
     > Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` fayllariga tegma. Paket kerak bo'lsa — `mobil/` da faqat `npx expo install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {belgi turadigan ekran} — «masalan: «O'yinlar» ekrani (`src/app/index.tsx`)» (ikki joyda bir xil — bitta qavs, ikki marta qo'yiladi)
     - {avvalgidek ishlashi kerak bo'lgan ishlar} — «masalan: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat»
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab (mobil trek):
     > Qayerda: `backend/` — yangi gateway (NestJS, socket.io: `@nestjs/websockets` va `@nestjs/platform-socket.io`); `mobil/` — yangi fayl `src/ulanish.ts` (`socket.io-client`) va «O'yinlar» ekrani (`src/app/index.tsx`).
     > Nima qilsin: ilova kirgandan keyin Backend'ga bir marta ulansin va ulanayotganda tokenni yuborsin (`auth`); manzil — `EXPO_PUBLIC_API_URL`. Backend tokenni ulanish ochilayotganda tekshirsin: token yo'q yoki yaroqsiz bo'lsa — ulanishni yopsin. Ilova tokenni o'qib bo'lgandan keyingina ulansin. `README.md` «Stek» qatoriga socket.io ni qo'sh.
     > «O'yinlar» ekrani tepasida ulanish belgisi tursin: ulangan — «Ulangan»; ulanish yo'q va ilova o'zi ulanishga urinayotgan bo'lsa — «Ulanmoqda…»; urinmayotgan bo'lsa — «Ulanmagan». «Hisobdan chiqish»da ulanish yopilsin; qayta kirilganda yangi token bilan ulansin. Ekran qayta ochilganda ulanish tinglovchilari ko'payib ketmasin.
     > Hozircha hech qanday hodisa yuborilmasin va tinglanmasin — faqat ulanish va belgi.
     > Nima buzilmasin: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` fayllariga tegma. Paket kerak bo'lsa — `mobil/` da faqat `npx expo install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Web-trekda (Yordam ostida; trek kalitidan o'zi almashadi — qavslar o'sha ikkitasi): «Qayerda» — `prototip/` — yangi fayl `src/ulanish.js` (`socket.io-client`) va {belgi turadigan sahifa}; gateway'da brauzer uchun CORS: faqat `WEB_ORIGIN` dagi manzilga ruxsat ·
     «Nima qilsin» — sayt kirgandan keyin … manzil — `VITE_API_URL`; token `localStorage` dan · «Nima buzilmasin» — … «Yangilash» tugmasi qolsin … Paket kerak bo'lsa — `npm install` bilan.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "ulanish"`, `git push`.
     Render Backend'ning yangi versiyasini chiqaradi — Render sahifasida tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Kutayotganda agent yozgan fayllardan ikki joyni toping: ilovada `auth` qatori, Backend'da tokenni tekshiradigan qator.
     Mobil trekda `npx expo start` ishlab tursin: Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`). Web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabingizning har gapini bajarib ko'ring. Mentor misolida:
     (1) Ilovani oching (kirgan holda): «O'yinlar» tepasida belgi «Ulangan» bo'lishi kerak. Bo'lmasa — bir daqiqagacha kuting: Render'ning bepul xizmati uxlab qolgan bo'lsa, birinchi ulanish cho'ziladi.
     (2) Telefonda uchish rejimini yoqing: belgi «Ulanmoqda…» ga o'tishi kerak — darhol o'zgarmasligi mumkin: uzilishni aniqlash vaqt oladi (bir daqiqagacha). Uchish rejimini o'chiring: belgi «Ulangan» ga qaytishi kerak, odatda bir necha soniyada.
     (3) Avvalgi ishlar: ro'yxatni pastga torting, bitta o'yinga qo'shilib ko'ring — avvalgidek ishlasin.
     (4) Agentga yozing: «Backend'ga tokensiz ulanib ko'r va nima bo'lganini ayt.» Kutilgani — ulanish yopildi. Agent javobi — uning so'zi; belgini esa o'zingiz ko'rdingiz.
     Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
     Web-trekda: saytingizni telefon brauzerida oching va uchish rejimini telefonda yoqasiz — kompyuterda Wi-Fi'ni o'chirish dars sahifasini ham uzadi.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon maketi, Expo Go, nom o'z rangida; uch kadr bir marta o'zi yuradi):
  - «O'yinlar», tepasida belgi: yashil nuqta · «Ulangan» → holat qatorida samolyot: accent nuqta · «Ulanmoqda…» → samolyot o'chdi: yashil nuqta · «Ulangan»
  - ostida fayl kartasi: `backend/src/…gateway.ts` (yangi) · `mobil/src/ulanish.ts` (yangi) · `mobil/src/app/index.tsx` (o'zgardi) · `README.md` («Stek»: + socket.io)
  - web-trekda: brauzer oynasi `….netlify.app`, sahifa tepasida o'sha belgi; fayl kartasida `prototip/src/ulanish.js`.
- Hammasi bajarilgach (yashil): Mahsulotingiz Backend'ga ulangan: belgi ulanish holatini ko'rsatadi. (67)
- Qator (`QIzoh`, natija ostida, bitta): Render'da yangi versiya chiqqanda ulanish uziladi — belgi bir lahza «Ulanmoqda…» bo'ladi. (89)
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-02-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) —
  qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).
- Ulgurmasangiz: Render kutishi cho'zilsa — 4-qadam uyga vazifaning 1-bandi; 3-qadamdan keyin «Davom etish» ochiladi — 2-amaliyotga o'ting. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi (04-FILTR 38).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: `{belgi turadigan ekran}` — oldindan bo'sh, kulrang «masalan»; `{avvalgidek ishlashi kerak bo'lgan ishlar}` — `pm-m9d5-prd.funksiyalar` bo'lsa, undan to'ldiriladi (tahrirlanadi), bo'lmasa bo'sh. Trek qatorlari (papka, fayl, manzil, qo'lda yangilash, paket) — `trek` dan o'zi yoziladi, joy emas (08 MD naqshi).
  Texnologiya nomi promptda — yangi kutubxona birinchi kiritilgani uchun (tayanch 4). Agentning «ulanish yopildi» javobi — da'vo (sinf 2d); isbot — telefondagi belgi. Push odati — `git status` → `git add <fayl>` (tayanch 3).
- O'qituvchi eslatmasi: Render bepul xizmati 15 daqiqa so'rovsiz qolsa uxlaydi; rasmiy hujjat: ochiq ulanishdagi WebSocket xabarlari ham so'rov sanaladi — socket.io ping xabarlari shunga kiradimi, «qur» da tekshiriladi (o'quvchiga aytilmaydi — 02-FILTR 25). 11-Modul 15-darsidagi «Render uxlaydi» riski bilan bog'lanishi: ulangan foydalanuvchi bo'lsa uyg'oq, hech kim bo'lmasa uxlaydi (02-FILTR 26). 4-qadam (2) da belgi sekin o'zgarsa — hujjatdagi 45 soniya chegarasi (Manbalar 5); shoshiltirmang.

## 16 · Amaliyot 2 — sxema README'da  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈6–12 daq; vaqt qolmasa — uyga vazifa ①, 02-FILTR 11)
- Eyebrow: Amaliyot 2 · o'z repo'ngiz
- Sarlavha: **Sxemangizni README'ga yozdiring va tekshiring.** (46)
- Mentor: Sxemani siz yozgansiz — agent faqat ko'chiradi, siz solishtirasiz; «1 · Ochish»dan boshlang.
- Talab zinapoyasi A2: tayyor talab + 2 joy (bittasi mustaqil ishdan oldindan to'ldirilgan, bittasini o'quvchi yozadi). Mobil va web-trekda blok bir xil (farq — sxemangiz so'zlarida: «ilova» yoki «sayt»).
- Qadamlar (o'z repo'ngizda):
  1. **Ochish** — `README.md` ni oching: «Arxitektura» bo'limida 11-Modulda yozilgan real vaqt nuqtalaringiz turibdi. Mustaqil ishdagi sxemangiz pastdagi talabga o'zi qo'yilgan — o'qib chiqing.
     Sxemada odamlar roli bilan yoziladi (o'yinchi, tashkilotchi) — ism va boshqa shaxsiy ma'lumot README'ga yozilmaydi.
  2. **Prompt** — qatorlarni tekshiring (tahrirlasangiz bo'ladi), oxirgi qavsni o'zingiz yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `README.md` — yangi «Real vaqt» bo'limi, «Arxitektura» bo'limidan keyin.
     > Nima qilsin: pastdagi qatorlarni besh ustunli jadval qilib yoz: real vaqt nuqtasi · kim nima qiladi · hodisa · kim oladi · ekranda nima o'zgaradi. So'zlarimni o'zgartirma, qator va hodisa qo'shma.
     > {sxema qatorlari}
     > Jadval ostiga bitta qator yoz: {hozirgi holat}
     > Nima buzilmasin: faqat `README.md`; boshqa bo'lim va fayllarga tegma. O'zgargan fayllarni ayt.
     Qavslar: {sxema qatorlari} — `pm-m10d2-sxema` dan oldindan yoziladi (har qator bir satr: «nuqta | kim nima qiladi | hodisa | kim oladi | ekranda nima o'zgaradi»); saqlanmagan bo'lsa — bo'sh, kulrang
     «masalan: «8 / 10» va qo'shilganlar ro'yxati | o'yinchi «Qo'shilaman» ni bosadi | oyin-ozgardi · sabab qoshildi | hamma ulangan ilova | «8 / 10» → «9 / 10»» ·
     {hozirgi holat} — o'quvchi yozadi: «masalan: Hozircha faqat ulanish va belgi bor — hodisalar hali yuborilmaydi.»
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: `README.md` — yangi «Real vaqt» bo'limi, «Arxitektura» bo'limidan keyin.
     > Nima qilsin: pastdagi qatorlarni besh ustunli jadval qilib yoz: real vaqt nuqtasi · kim nima qiladi · hodisa · kim oladi · ekranda nima o'zgaradi. So'zlarimni o'zgartirma, qator va hodisa qo'shma.
     > «8 / 10» va qo'shilganlar ro'yxati | o'yinchi «Qo'shilaman» ni bosadi | oyin-ozgardi · sabab qoshildi | hamma ulangan ilova | «8 / 10» → «9 / 10», ro'yxatda yangi o'yinchi
     > «8 / 10» va qo'shilganlar ro'yxati | o'yinchi o'yindan chiqadi (navbatdagi kirsa — shu hodisa) | oyin-ozgardi · sabab chiqdi | hamma ulangan ilova | son va ro'yxat yangilanadi
     > «Kelaman» belgilari | o'yinchi «Kelaman» ni bosadi | oyin-ozgardi · sabab tasdiqladi | hamma ulangan ilova | «Kelishini tasdiqladi: 7 / 9» → «8 / 9»
     > «Navbatda: N» | o'yinchi navbatga yoziladi | oyin-ozgardi · sabab navbatga-yozildi | hamma ulangan ilova | «Navbatda: 1»
     > o'yinlar ro'yxati | tashkilotchi o'yin e'lon qiladi | oyin-ozgardi · sabab elon-berildi | hamma ulangan ilova | ro'yxatda yangi karta
     > Jadval ostiga yoz: `oyin-ozgardi` — `{ oyinId, sabab }`. Hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi. Hozircha faqat ulanish va belgi bor — hodisalar hali yuborilmaydi.
     > Nima buzilmasin: faqat `README.md`; boshqa bo'lim va fayllarga tegma. O'zgargan fayllarni ayt.
  3. **Ko'rish** — `README.md` da «Real vaqt» bo'limi: jadval va ostidagi qator. Agent boshqa faylni ham o'zgartirgan bo'lsa: «Faqat README.md ni o'zgartir, qolganini qaytar.»
  4. **Tekshirish va GitHub** — har qatorni o'zingiz yozgani bilan solishtiring: beshta katak so'zma-so'z mosmi · agent qator yoki hodisa qo'shmaganmi · ostidagi qator hozirgi holatni aytadimi.
     Farq bo'lsa, agentga: «{qaysi qator} men yozgandek emas: {qanday bo'lsin}. Faqat README.md ni o'zgartir.»
     Mos bo'lsa — `git status`: o'zgargan fayl faqat `README.md`; `git add README.md`, `git commit -m "real vaqt sxemasi"`, `git push`. GitHub'da repo sahifasini yangilang — «Real vaqt» bo'limi ko'rinadi.
     `git push` xato bersa — xato qatorini agentga yuboring (token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (README ko'rinishi, Markdown sahifasi kabi chizilgan):
  - **Real vaqt** · jadval — A-bo'lim 4-bandidagi besh qator (aynan)
  - ostida: `oyin-ozgardi` — `{ oyinId, sabab }`. Hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi. Hozircha faqat ulanish va belgi bor — hodisalar hali yuborilmaydi.
  - pastda GitHub sahifasining kichik ko'rinishi: `maydon-jamoa` · `README.md` — «Real vaqt».
- Hammasi bajarilgach (yashil): Sxemangiz README'da: har qatorini o'zingiz tekshirdingiz. (56)
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-02-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — `README.md` dagi «Real vaqt» bo'limi.
- Ulgurmasangiz: bu blok uyga vazifaning 1-bandi — sxema darsda saqlangan.
- Nishon (bonus): Stay Connected — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: 3-qadam «Ko'rish» — README ishga tushiriladigan kod emas (11-Modul 08 MD naqshi). «Hozirgi holat» qatori — README'da faqat hozir bor narsa yoziladi (TAQIQLAR 1: lending va postdagi halollik qoidasi README'ga ham) — TAYANCHGA SAVOL 11.
  Mentor README'sidagi kanonik gap tayanch 1.2 dan aynan; o'quvchining hodisasi boshqacha bo'lishi mumkin — shuning uchun uning promptida bu gap yo'q, faqat «hozirgi holat».

## 17 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 4 savol + final + 2 blok «Bajardim» (`PRACTICE_BASE`). QKod (9) va QMustaqil (13) — `practice: -1`.
- Savol yorliqlari (`Q_LABELS`): 3 — «1 — Backend qachon yuboradi» · 6 — «2 — Hodisa ichida nima bor» · 8 — «3 — Yaroqsiz token» · 11 — «4 — Uzilish paytidagi hodisa» · 14 — «Yakuniy — hodisa yo'li»

## 18 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (SABOQ 16). Karta ostida, birinchi bosishgacha: «Kartani bosing — javob ochiladi»; karta yuzi halqada.
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim · hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Yakun  ← QYakun (texnik darslar standarti, 192/204)
- Yuqori yorliqlar: ✓ Ulanish va sxema tayyor (faqat A1 va A2 bajarilganda; aks holda yorliq yo'q) · {N}/5 to'g'ri
- Sarlavha (holatga qarab, P-046; sinf 1): A1 va A2 bajarilgan — **Mahsulotingiz Backend'ga ulangan, sxema README'da.** (50) · A1 bajarilgan, A2 yo'q — **Mahsulotingiz ulangan — sxemani README'ga yozish qoldi.** (55) ·
  A1 bajarilmagan, sxema saqlangan — **Sxemangiz tayyor — ulanishni tugatish qoldi.** (44) · hech biri — **Ulanish boshlandi — qolgan qadamni uyda tugating.** (49)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- Bugungi asosiy fikr (`small`, ScoreRing'dan keyin, P-013): Doimiy ulanish ochiq tursa, Backend ilova so'rashini kutmaydi — hodisa yuboradi; bu misolda hodisa o'zgarish bo'lganini aytadi, yangi holatni ilova Backend'dan qayta so'raydi.
- Endi siz bilasiz (5):
  - So'rov–javobda ilova so'ramasa, Backend unga hech narsa yubora olmaydi.
  - Doimiy ulanish ochiq turadi: ilova ham, Backend ham istagan payt xabar yubora oladi.
  - Bu misolda hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi.
  - Ilova token bilan ulanadi; ulanish uzilishi mumkin — belgi uch holatdan birini ko'rsatadi.
  - Real vaqt oqimi sxemasi: kim nima qilganda qaysi hodisa kimga boradi va ekranda nima o'zgaradi.
- Uyga vazifa (`uyga`, karta: kim uchun — o'z mahsulotingiz · muddat — keyingi darsgacha):
  1. **Tugatish** — darsda ulgurmagan qadamlarni bajaring: mahsulotingizda belgi «Ulangan» bo'lsin, README'da «Real vaqt» bo'limi tursin.
  2. **Tekshirish** — uyda uchish rejimini yana bir marta yoqib o'chiring: belgi uch holatdan qaysilarini ko'rsatdi? Kutilganidan farq bo'lsa — nima qilganingiz va nima ko'rganingizni bir qator yozib qo'ying.
  3. **Sxema** — mahsulotingizning har ekranini ochib chiqing: boshqa odam tufayli o'zgaradigan yana joy bormi? Sxemada 5 tadan kam qator bo'lsa — darsdagi sxema kartasiga va README'ga qo'shing (02-FILTR 39).
- Keyingi dars — «Ekran o'zi yangilanishi uchun nimani yozasiz?»: sxemangizdagi hodisalar talabga aylanadi.
- Nishonlaringiz — N/4
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (4) — inglizcha nom va medal (o'yin qatlami)
- **Event Reader** — Hodisa nimani olib kelishini topdingiz (6-ekran, 2-savol)
- **Token Gate** — Yaroqsiz tokenda Backend nima qilishini bildingiz (8-ekran, 3-savol)
- **Line Check** — Uzilish paytidagi hodisa kelmasligini topdingiz (11-ekran, 4-savol)
- **Stay Connected** — Ikkala amaliyot blokini oxirigacha bajardingiz (16-ekran, oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q (152)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 06.10: Event Reader · Token Gate · Line Check · Stay Connected — 0).

## Qisqa takrorlash oynalari (5) — har ballik testga 3 karta (S-026: kod qatori bor joyda kod, qolganida raqam)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Backend faqat so'rovga javob beradi»
   - 1 · Ilova so'raydi — Backend javob beradi.
   - 2 · So'rov bo'lmasa, Backend'dan ilovaga yo'l ochilmaydi.
   - 3 · Shuning uchun 11-Modulda son ekran ochilganda va pastga tortganda yangilanadi.
   - Sinfga savol: Ekran bir soat ochiq tursa-yu, hech kim uni tortmasa, son nima bo'ladi?
2. 2-savol (6-ekran) — «Hodisa aytadi, ilova so'raydi»
   - Hodisaning nomi bor · `oyin-ozgardi`
   - Ma'lumotida ikki maydon · `{ oyinId: 1, sabab: 'qoshildi' }`
   - Yangi sonni ilova qayta so'raydi · `GET /oyinlar`
   - Sinfga savol: Hodisa sonning o'zini olib kelsa, nima noqulay bo'lishi mumkin edi?
3. 3-savol (8-ekran) — «Ulanish token bilan»
   - Ilova ulanayotganda tokenni yuboradi · `auth: { token }`
   - Backend tokenni tekshiradi · `handleConnection(ulanish)`
   - Token yaroqsiz bo'lsa, ulanish yopiladi · `ulanish.disconnect()`
   - Sinfga savol: Token tekshirilmasa, kimlar ulana olardi?
4. 4-savol (11-ekran) — «Uch ulanish holati»
   - 1 · Ulangan — hodisalar keladi.
   - 2 · Ulanmoqda — ulanish yo'q, ilova o'zi ulanishga urinmoqda; shu payt bo'lgan hodisalar kelmaydi.
   - 3 · Ulanmagan — ilova urinmayapti.
   - Sinfga savol: Belgi yana «Ulangan» bo'ldi. Ekrandagi son yangimi — buni qanday bilasiz?
5. Final (14-ekran) — «Hodisa yo'li»
   - 1 · Ulanish · 2 · Bosish · 3 · Database'ga yozuv
   - 4 · Backend hodisa yuboradi · `oyin-ozgardi`
   - 5 · Ilova qayta so'raydi · 6 · «9 / 10» ko'rinadi
   - Sinfga savol: Backend hodisani Database'ga yozishdan oldin yuborsa, ilova qaysi sonni oladi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| 11-Modulda ilova yangi sonni qachon olardi? | Ekran ochilganda va pastga tortib yangilaganda | Ilova so'ramasa, Backend o'zi yubora olmaydi |
| Doimiy ulanish nima? | Ilova bilan Backend orasida ochiq turadigan ulanish | Ikkalasi istagan payt xabar yubora oladi |
| WebSocket nima? | Doimiy ulanishni beradigan texnologiya | 10-Modulda sayt qayta-qayta so'rardi (polling) — bu boshqa yo'l |
| socket.io nima? | Doimiy ulanish bilan ishlashni osonlashtiradigan kutubxona | Imkon bo'lsa WebSocket orqali ulanadi; ilovada `socket.io-client` |
| Hodisa nima? | Ulanish orqali yuboriladigan nomli xabar | Nomi va ma'lumoti bor: `oyin-ozgardi` · `{ oyinId, sabab }` |
| Mentor misolida hodisa nimani aytadi? | Qaysi o'yin o'zgargani va sababini | Yangi holatni ilova Backend'dan qayta so'raydi |
| Tinglovchi nima? | Hodisa kelganda ishlaydigan kod | `ulanish.on('oyin-ozgardi', korsat)` |
| Ilova Backend'ga nima bilan ulanadi? | Token bilan | Token yo'q yoki yaroqsiz bo'lsa — Backend ulanishni yopadi |
| Ulanish belgisi qaysi uch holatni ko'rsatadi? | «Ulangan», «Ulanmoqda…», «Ulanmagan» | Mentor misolida — «O'yinlar» ekrani tepasida |
| «Ulanmoqda…» paytida bo'lgan hodisa nima bo'ladi? | Bu misolda kelmaydi | Pastga tortib yangilash shuning uchun qoladi |
| Real vaqt oqimi sxemasida qaysi besh ustun bor? | Nuqta · kim nima qiladi · hodisa · kim oladi · ekranda nima o'zgaradi | Mentor misolida besh qator, bitta hodisa nomi |
| Real vaqt nima? | O'zgarish bo'lgan zahoti ekranda ko'rinishi | Amalda — odatda bir necha soniyada; ulanish uzilsa, kechikadi |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. Qayta-qayta so'rashda yangi son qachon ko'rinadi? ✔ Keyingi so'rov yuborilganda · Database o'zgargan zahoti · Backend hodisa yuborganda · Ulanish qayta tiklanganda
2. Doimiy ulanishni kim ochadi? Backend — ilovaga o'zi ulanadi · ✔ Ilova — Backend'ga ulanadi · Database — ikkalasiga ulanadi · Ikkinchi telefon — ulab beradi
3. WebSocket nima beradi? Parolni tekshiradigan token · O'yinlar saqlanadigan jadval · ✔ Ochiq turadigan doimiy ulanish · Telefonga o'rnatiladigan fayl
4. Hodisaning qaysi ikki qismi bor? Sarlavhasi va rasmi · Manzili va paroli · Jadvali va ustuni · ✔ Nomi va ma'lumoti
5. Hodisada `sabab: 'chiqdi'` nimani bildiradi? ✔ O'yinchi o'yindan chiqdi · Ilova hisobdan chiqdi · Ulanish uzilib qoldi · Backend o'chib qoldi
6. Hodisa kelgach, Mentor ilovasi yangi sonni qayerdan oladi? Hodisaning ma'lumotidan · ✔ Backend'dan qayta so'rab · Telefon xotirasidan · Ikkinchi telefondan
7. `ulanish.on('oyin-ozgardi', korsat)` qatori nima qiladi? Hodisani Backend'ga qaytarib yuboradi · Ulanishni butunlay yopib qo'yadi · ✔ Hodisa kelganda `korsat` ni ishlatadi · Tugma bosilganda `korsat` ni ishlatadi
8. Backend ulanayotgan ilovani nimadan taniydi? Yuborgan ismidan · Yozgan parolidan · Telefon rusumidan · ✔ Yuborgan tokenidan
9. Belgi «Ulanmagan». Bu nimani bildiradi? ✔ Ilova ulanishga urinmayapti · Ilova qayta urinib turibdi · Hodisalar kelib turibdi · Backend sonni yangilayapti
10. Uchish rejimi o'chirildi. socket.io nima qiladi? Foydalanuvchidan parol so'raydi · ✔ O'zi qayta ulanishga urinadi · Ilovani yopib, qayta ochadi · Hodisalarni Database'ga yozadi
11. Sxemadagi «Kim oladi» ustuni nimani aytadi? Tugmani kim bosganini · Kodni kim yozib berganini · ✔ Hodisa kimga borishini · E'lonni kim berganini
12. Mentor sxemasida `elon-berildi` sababi qachon yuboriladi? Yangi o'yinchi qo'shilganda · O'yinchi navbatga yozilganda · O'yinchi kelishini tasdiqlaganda · ✔ Tashkilotchi o'yin e'lon qilganda

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D.
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari — ru'da ham o'sha; R-008): doimiy ulanish · WebSocket · socket.io · hodisa · `oyin-ozgardi` · `{ oyinId, sabab }` · tinglovchi · `ulanish.on` · token · «Ulangan» · «Ulanmoqda…» · «Ulanmagan» · sxema · `GET /oyinlar` · Maydon Jamoa

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 20 ekran: hook · rule · exploration · test · exploration ×2 · test · exploration · test · practice(kod) · exploration · test · exploration · practice(mustaqil) · test(final, `scope: 'final'`) · practice(blok) ×2 · stats · flashcards · summary.
   `INLINE_KEYS`: s3 **1 (B)** · s6 **3 (D)** · s8 **0 (A)** · s11 **2 (C)** · s14 sentinel **0**; QKod (9), QMustaqil (13) va bloklar (15, 16) — `practice: -1`. `LESSON_META.lessonId` — `m10-02-v1`.
2. **Bitta manba (180):** `SAHNA` (ikki telefon, Backend tuguni, chiziq holatlari, konvert turlari), `NAMUNA_OYIN` (Shanba, 18:00 · Mahalla maydoni · 8 / 10; `oyinId: 1`), `MENTOR_SXEMA` (besh qator — A-bo'lim 4; 12-ekran kartalari, A2 kutilgan natija, kartochka),
   `HODISA_YOLI` (6 bo'lak — 14-ekran), `BELGILAR` (uch holat: yozuv, rang tokeni) — 0–2, 4, 5, 7, 10, 12, 14–16-ekranlar va kartochka shundan o'qiydi.
3. **`IkkiTelefonSahna`** komponenti: chapda «1-telefon · siz» (191; ≈170×272 — SABOQ 22; yorliq ramka ustida — SABOQ 23), o'rtada Backend tuguni («Database: N» belgisi ichida), o'ngda «2-telefon · boshqa o'yinchi»; propslar: `telefonlar` (1 yoki 2), `chiziq` (`yoq` · `sorov` · `ochiq` · `uzilgan` · `yopiq`), `belgi` (1-telefon tepasidagi ulanish belgisi), `konvertlar`.
   Konvert turlari: `sorov` / `javob` (yorliqli) · `hodisa` (yopiq → ochiq: nom + ma'lumot qatorlari). Son animatsiyasi (kattalashib qaytadi) 11-Modul telefon maketidan — nusxa, import emas (darslar mustaqil). Bosiladigan qismlar faylda e'lon qilinadi
   (`// qolip-maket: ws-qoshil ws-yubor ws-tort ws-ikon ws-konvert ws-qayta ws-tokensiz ws-token ws-samolyot ws-kalit ws-sabab`). `prefers-reduced-motion` da harakat to'xtaydi (DE-200). Logotip/emoji yo'q (D4).
4. **0-ekran:** ikki telefon; «Qo'shilaman» (2-telefon) → son animatsiyasi, «eski» yorlig'i ~2 s dan keyin; variantlar shundan keyin faol; javobdan keyin Backend tuguni va «?» chizig'i tug'iladi (kirish animatsiyasi, SABOQ 19).
5. **2-ekran:** Backend ichida sahna tugmasi «1-telefonga yuborish» (konvert silkinib qaytadi); pastga tortish — sudrash (pointer events, 60 px dan oshsa) + klaviatura uchun «Yangilash» (a11y) — 11-Modul 08 KOD 8 naqshi.
6. **4-ekran:** 1-telefon bosh ekran holati (belgi + nom); ochilganda avtomatik so'rov (bir marta), keyin chiziq `ochiq` holatga; 2-telefondagi qo'shilish → hodisa konverti `yopiq` holatda 1-telefon chetida qoladi (5-ekranga o'tadi — ikkala ekran bitta `SAHNA` holatidan).
7. **5-ekran:** konvert bosilganda ochiladi (nom · ma'lumot qatorlari, mono); «Qayta so'rash» sahna tugmasi → so'rov-javob animatsiyasi → son.
8. **7-ekran:** bitta telefon + Backend; ikki kod kartasi (mono, 3–6 qator, sintaksis rangi yo'q — faqat yonadigan qator: `auth` · `disconnect`); «Tokensiz ulanish» / «Token bilan ulanish» tugmalari; belgi «Ulanmagan» / «Ulangan».
9. **9-ekran (QKod) → `HtmlCompiler`** (ko'p fayl: `index.html` tayyor · `namuna.js` tayyor · `app.js` — tepa qismi tayyor, pasti o'quvchi). Tekshiruvlar: (1) `ulanish.on(` chaqiruvi `'oyin-ozgardi'` (yoki `"…"`) nomi bilan — AST yoki ishonchli regex;
   (2) runtime: `.boshqa` ga `click` → `.son` matni `9`, yana → `10` (ikki hodisa, ikki yangilanish); `korsat` to'g'ridan-to'g'ri ham, `function`/arrow o'rami ichida `korsat()` ham qabul. «Bajardim» shartlar ✓ bo'lgach ochiladi (§19). Qoralama kaliti `pm-m10d2-code`.
   ⚠️ Starter fayllar `.jsx` ichida shablon-satr — izohlarda backtik yo'q (CLAUDE.md); `namuna.js` izohlari backtiksiz yozildi. Apostrof `'` — JS satrida muammo emas, lekin `'Kelgan hodisa: …'` ichida apostrofli so'z yo'q (ataylab).
10. **10-ekran:** samolyot tugmasi (holat qatorida) — `uzilgan` holat + ↻; 2-telefon qo'shilishi → konvert uzilgan joyda so'nadi («kelmadi»); samolyot o'chirilsa ≈2 s dan keyin `ochiq` + «eski bo'lishi mumkin» yorlig'i; Backend ostida «Token: yaroqli / yaroqsiz» kaliti → `yopiq`, belgi «Ulanmagan».
    Belgi komponenti `UlanishBelgisi` (nuqta + yozuv; ranglar `BELGILAR` dan: `ok` · `accent` · `ink2`) — 1, 7, 10, 15-ekranlarda bitta komponent.
11. **12-ekran:** sabab variantlari — besh tugma (bir xil tartib); to'g'ri → `MENTOR_SXEMA[i]` qatori jadvalga; telefon ko'rinishi qatorga qarab (`ekran` maydoni: `oyin` · `oyin-tashkilotchi` · `oyinlar`); jadval 1280 px da bitta ekranga sig'ishi vizual bosqichda tekshiriladi — sig'masa «Kim oladi» ustuni jadval ostida bitta qatorga chiqadi (hammasi bir xil).
12. **13-ekran (QMustaqil):** bitta katta karta, ixcham chiziq (SABOQ 29); «Qator tayyor» → ixcham qator; «Yana qator» (≤5); saqlash `pm-m10d2-sxema` = `{ qatorlar: [{ id, nuqta, kimNima, hodisa, kimOladi, ekranda }] }`, `id` — `q1`… (o'chirilgan id qayta ishlatilmaydi); kalit bor bo'lsa — to'ldirilgan holda ochiladi; shart — kamida 2 qator, har qatorda 5 maydon bo'sh emas.
13. **15, 16-ekran** — `ScreenBlok` (skeletdagi ulagich) + `QPrompt` (2-qadam; `{…}` joylari). A1: `{belgi turadigan ekran}` — bo'sh (ikki marta bir qavs), `{avvalgidek ishlashi kerak bo'lgan ishlar}` ← `pm-m9d5-prd.funksiyalar` (`, ` bilan; tahrirlanadi); trek qatorlari (`mobil/` · `prototip/`, `src/ulanish.ts` · `src/ulanish.js`, `EXPO_PUBLIC_API_URL` · `VITE_API_URL`, «pastga tortib yangilash» · ««Yangilash» tugmasi», `npx expo install` · `npm install`, CORS qatori faqat web) — `pm-m9d8-platforma.trek` dan matn, joy emas; kalit yo'q bo'lsa — blok tepasida trek tugmalari (tanlov kalitga yoziladi, 11-Modul 9.77).
    A2: `{sxema qatorlari}` ← `pm-m10d2-sxema.qatorlar` (har qator «nuqta | kimNima | hodisa | kimOladi | ekranda»), `{hozirgi holat}` — bo'sh, kulrang «masalan». 3-qadam nomi «Ko'rish», 4-qadam — «Tekshirish va GitHub». A1 4-qadam — «Telefonda tekshirish» (web-trekda ham: telefon brauzeri).
    ⚠️ Qolipda yo'q (11-Modul bloklari bilan bir — MEXANIZM-TAKLIF): `{…}` yonida kulrang «masalan», oldindan yozilgan qiymat, qadam ichidagi «Yordam», «Ulgurmasangiz» qatori, «O'qituvchi eslatmasi» (o'quvchi yuzasida yo'q). O'ngda telefon maketi (A1, uch kadr) va README ko'rinishi (A2). `ACH_TRIGGERS`: A2 oxirgi «Bajardim» → Stay Connected.
14. `RECAPS` 5 (kalit = 3, 6, 8, 11, 14) · `Q_LABELS` {3, 6, 8, 11, 14} · `ACHIEVEMENTS` 4 (`ACH_TRIGGERS`: 6 → Event Reader, 8 → Token Gate, 11 → Line Check, A2 → Stay Connected) · `QUIZ_BANK` 12 (to'g'ri javob 3/3/3/3) · flashcard 12 (alohida ekran, Mentor yo'q, «Kartani bosing — javob ochiladi», SABOQ 16) · `HW_TOKENS` fon so'zlari {uz, ru}.
15. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6) — skeletdan ko'chirilmaydi. Hook javoblari «Aynan!» / «Qiziq fikr!» (T-028, T-067).
16. **Darvozalar:** `npm run gates -- src/10-Modull/WebSocketBasicsLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` · `python3 feedback/F-1005-10modul/stilsiz.py <fayl>` (SABOQ 31) · `lint:layout` 1280/1366/390 · surat 1280 + 393; har ekran 4 savol (SABOQ 30) hisobotda.

**REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m12-dars-02-start` = `m12-dars-01-done` → `m12-dars-02-done`):**
1. `backend/`: `npm i --save @nestjs/websockets @nestjs/platform-socket.io`; yangi gateway (`@WebSocketGateway()`, HTTP server bilan bitta portda): `handleConnection` da `handshake.auth.token` kirishdagi qoida bilan tekshiriladi (`JWT_SECRET`), yaroqsiz — `disconnect()`; brauzer uchun `cors: { origin: WEB_ORIGIN }`.
   Hodisa yuborilmaydi (3-dars). `README.md` «Stek» qatoriga socket.io.
2. `mobil/src/ulanish.ts`: `io(process.env.EXPO_PUBLIC_API_URL, { auth: { token } })` — token `expo-secure-store` dan o'qilgandan keyin ulanadi (`autoConnect: false` + `connect()` yoki `auth` funksiya ko'rinishida — agent tanlaydi); bitta obyekt, bir marta ochiladi; «Hisobdan chiqish»da `disconnect()`.
3. `mobil/src/app/index.tsx` («O'yinlar»): tepada `UlanishBelgisi` — `connect` → «Ulangan»; `disconnect` da `active` rost bo'lsa → «Ulanmoqda…», aks holda → «Ulanmagan»; birinchi ulanish paytida — «Ulanmoqda…» (TAYANCHGA SAVOL 7).
4. `README.md` «Real vaqt» bo'limi — A2 Mentor talabi natijasi (besh qator jadval + ostidagi uch gap). «Darslar va teglar» jadvaliga `m12-dars-02-done` qatori.
5. Muhrdan oldin: Render'da deploy; telefonda belgi «Ulangan» → uchish rejimi → «Ulanmoqda…» → «Ulangan» (qanchada o'zgargani jurnalga); agent tokensiz ulanib ko'radi — yopiladi; Expo Go'da uchish rejimi paytida Metro bilan aloqa nima bo'lishi yoziladi (Shubhali 1).

## Manbalar (o'zim tekshirdim, 06.10.2026; o'quvchiga ko'rinmaydi)
1. socket.io — `socket.io/docs/v4/client-socket-instance/`: «This event is fired by the Socket instance upon connection and reconnection.» (connect) · «a new handler will be registered every time the socket instance reconnects» (connect ichida tinglovchi — yomon) ·
   uzilish sabablari jadvali: `io server disconnect` va `io client disconnect` — o'zi qayta ulanmaydi; `ping timeout`, `transport close`, `transport error` — ulanadi · «The socket.active attribute indicates whether the socket will automatically try to reconnect».
2. socket.io — `socket.io/docs/v4/client-api/`: `socket.disconnect()` — «Manually disconnects the socket. In that case, the socket will not try to reconnect.» · `io(url, { auth: { token } })` namunasi · `socket.io.on("reconnect_attempt" …)`, `"reconnect"`, `"reconnect_failed"` (Manager hodisalari — 5-dars uchun eslatma).
3. socket.io — `socket.io/docs/v4/client-options/`: `reconnection: true`, `reconnectionDelay: 1000`, `reconnectionDelayMax: 5000`, `reconnectionAttempts: Infinity`; `transports` sukut `["polling", "websocket", "webtransport"]`; `auth` — «Credentials that are sent when accessing a namespace».
4. socket.io — `socket.io/docs/v4/server-socket-instance/`: `socket.handshake.auth` — «the authentication payload»; `socket.id` — «regenerated after each reconnection» (barqaror ID emas); server tomonda `socket.disconnect()`.
5. socket.io — `socket.io/docs/v4/server-options/`: `pingInterval` 25000, `pingTimeout` 20000 — «If the client does not receive a ping packet from the server within pingInterval + pingTimeout ms, then the client also considers that the connection is closed» → uzilishni payqash 45 s gacha;
   `connectionStateRecovery` — sukutda yoqilmagan (yoqilsa uzilish paytidagi paketlar tiklanishi mumkin — darsda «bu misolda» chegarasi).
6. socket.io — `socket.io/docs/v4/`: «Socket.IO is NOT a WebSocket implementation.» · «Although Socket.IO indeed uses WebSocket for transport when possible, it adds additional metadata to each packet.» · «The connection will fall back to HTTP long-polling in case the WebSocket connection cannot be established.»
   `socket.io/docs/v4/how-it-works/`: mijoz avval HTTP long-polling bilan ulanadi, keyin WebSocket'ga o'tishga urinadi.
7. socket.io — `socket.io/docs/v4/delivery-guarantees/` (tayanch 6 orqali): «at most once» · «there is no such buffer on the server, which means that any event that was missed by a disconnected client will not be transmitted to that client upon reconnection».
8. socket.io — `socket.io/docs/v4/handling-cors/`: «Since Socket.IO v3, you need to explicitly enable Cross-Origin Resource Sharing (CORS).» · «CORS only applies to browsers … Native applications are not covered either.» → web-trekda `WEB_ORIGIN`, mobil trekda CORS kerak emas.
9. socket.io — `socket.io/how-to/use-with-react-native`: `import { io } from "socket.io-client"`; haqiqiy qurilmada `localhost` emas — kompyuter IP si yoki internetdagi manzil; «Starting with API level 28 (Android 9 and higher), cleartext traffic is blocked by default» → `https` (Render beradi).
10. NestJS — `docs.nestjs.com/websockets/gateways`: `npm i --save @nestjs/websockets @nestjs/platform-socket.io`; gateway — `@WebSocketGateway()` belgili klass; «each gateway listens on the same port as the HTTP server»; `OnGatewayConnection.handleConnection()` — mijoz socket instansiyasini oladi; `@WebSocketServer() server`.
11. Render — `render.com/docs/free`: «Render spins down a Free web service that goes 15 minutes without receiving any inbound traffic. This includes both HTTP requests and WebSocket messages from existing connections.» · «about one minute» · «750 Free instance hours» · «Do not use them for production applications».
    `render.com/docs/websocket`: «Render web services can accept inbound WebSocket connections from the public internet» · «they close automatically when the instance is replaced (for example, during a deploy)» · `wss` ishlatiladi · qayta ulanish — exponential backoff (socket.io sukuti shunday).
12. MDN — `developer.mozilla.org/en-US/docs/Web/API/WebSockets_API`: «The WebSocket API makes it possible to open a two-way interactive communication session between the user's browser and a server. … without having to poll the server for a reply.» — «doimiy ulanish» ta'rifining asosi.
13. Kursdagi so'zlar (grep, 06.10): «qayta-qayta so'raydi», «polling» (bir marta ko'prik) — `feedback/F-1005-10modul/03-LiveDashboard-v3.md` · `korsat()`, `sora()`, `yangila.addEventListener('click', korsat)` — 11-Modul `08-PlatformChoice-v3.md` 8-ekran · «real vaqt nuqtasi» ta'rifi — o'sha MD 5-ekran · `WEB_ORIGIN`, `localStorage` (web-trek) — 11-Modul tayanchi 3, 9.7.

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Hook savoli — 11-Modulni eslash** («Sizning ekraningizda nega hali «8 / 10» turibdi?»), ✔ «Ilova Backend'dan qayta so'ramadi»; javobdan keyin Backend tuguni va «?» chizig'i bugungi yo'lni ochadi. Topshiriqdagi «ikki telefon: biri bosdi, ikkinchisida son o'zgarmadi» hodisasi shu.
2. **Sahna joylashuvi:** «1-telefon · siz» chapda, Backend o'rtada, «2-telefon · boshqa o'yinchi» o'ngda (TAQIQLAR 5 «ikki telefon va ular orasidagi Backend» + SABOQ 21 «telefon chapda»). Database alohida tugun emas — Backend ichida «Database: N» belgisi (≤3 blok).
3. **Namuna o'yin `oyinId: 1`** — kod oynasida va 5-ekranda; tayanchda id yo'q (11-Modul 9.29: Shanba 18:00 — birinchi seed). Boshqa id kerak bo'lsa — bitta `NAMUNA_OYIN` o'zgaradi.
4. **Kanonik gap oldiga «Bu misolda»** (5-ekran xulosasi, yakun, asosiy fikr): «Bu misolda hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi.» — sinf 2b (Mentor misoli umumiy qolip emas; 4-darsda hodisa sonning o'zini olib keladi). Kartochka va Mentor README'sida — tayanch so'zma-so'z.
5. **7-ekran kod kartalari:** gateway klass nomi `OyinlarGateway`, yordamchi `tokenYaroqli(token)`, `BACKEND_MANZILI` — o'qish uchun qisqartirilgan nomlar (to'liq kodni agent yozadi, nomlarni o'zi tanlaydi). «gateway» so'zi o'quvchi matnida — karta yorlig'i va bitta izoh («Backend'da ulanishlarni qabul qiladigan klass»); tayanch 2 da yo'q.
6. **Web-trek fayli `prototip/src/ulanish.js`**, token `localStorage` dan, gateway'da CORS — `WEB_ORIGIN` (11-Modul 3, 9.7 bilan bir); tayanch 1.4 da faqat «brauzerda `socket.io-client`».
7. **Birinchi ulanish paytidagi belgi — «Ulanmoqda…»** (✅ tayanch 9.1: yozuv «Qayta ulanmoqda…» edi, «Ulanmoqda…» ga almashdi — birinchi ulanishda «qayta» so'zi yolg'on bo'lardi — T-044); Render uyg'onguncha bir daqiqagacha shu belgi turadi (A1 4-qadam (1)).
8. **«Ulanmagan»ni sahnada chaqirish — Backend'dagi «Token: yaroqli / yaroqsiz» kaliti** (10-ekran 4-qadam); A1 da «Ulanmagan» telefonda tekshirilmaydi — agent tokensiz ulanib ko'radi (4-qadam (4)). «Hisobdan chiqish» da ulanish yopiladi, lekin ekran «Kirish»ga o'tadi — belgi ko'rinmaydi.
9. **13-ekran sxemasi:** kamida 1 (02-FILTR 19: «kamida 2» edi — real vaqt nuqtasi bitta bo'lgan mahsulot ham bor), ko'pi bilan 5 qator; `hodisa` — bitta matn maydoni («oyin-ozgardi · sabab qoshildi» ko'rinishida, tayanch 8 sxemasi bilan bir); `id` — `q1`, `q2`…; hodisa nomi shakli — faqat Yordamda (qattiq tekshiruv yo'q).
10. **Mahsulotida boshqa odam o'zgartiradigan joy bo'lmagan o'quvchi** — Yordam: «o'zingiz ikkinchi qurilmada o'zgartiradigan ma'lumotni oling» (sinf 2b «mos qism bo'lmasa nima qilishi»).
11. **A2 README «hozirgi holat» qatori** — o'quvchi yozadi (ikkinchi joy): README'da faqat hozir bor narsa (halollik qoidasi lending va postdan README'ga ham); Mentor README'sida qo'shimcha kanonik gap va `{ oyinId, sabab }`.
12. **socket.io va WebSocket munosabati** — «imkon bo'lsa WebSocket orqali ulanadi» (kartochka izohi, O'qituvchi eslatmasi; Manbalar 6) — tayanchda yo'q, T-045 uchun qo'shildi; o'quvchi matnida «socket.io — WebSocket'ning o'zi» hech qayerda yo'q.
13. **«real vaqt» ta'rifi** (tayanch 2: «o'zgarish bo'lgan zahoti») kafolat taqiqi bilan birga — kartochkada izoh «amalda — odatda bir necha soniyada; ulanish uzilsa, kechikadi».
14. **«holat» ikki birikmada** — «ulanish holati» (3 ta) va kanonik gapdagi «yangi holat»; **«belgi»** — «ulanish belgisi» va 11-Moduldan kelgan ««Kelaman» belgilari» (sxema qatori). Ikkalasi tayanch so'zlari; T-015 bo'yicha boshqa «holat»/«belgi» yo'q.
15. **Kutish vaqtlari o'quvchi matnida:** «bir daqiqagacha» (belgi o'zgarishi — hujjatdagi 45 s; Render uyg'onishi ≈1 daqiqa), «odatda bir necha soniyada» (qayta ulanish, 1 → 5 s), «bir necha daqiqa cho'zilishi mumkin» (Render deploy — o'lchanmagan, Shubhali 3).
16. **Kod oynasi namunasi:** tugma «Boshqa o'yinchi qo'shildi», qator «Kelgan hodisa: …» (hodisada son yo'qligi ko'rinib turishi uchun), `namuna.js` alohida fayl, 10 da to'xtaydi.
17. **Nishon nomlari** Event Reader · Token Gate · Line Check · Stay Connected (grep 0).
18. **Reja sarlavhasi** «Bugun mahsulotingiz Backend'ga ulanib turadi.» (02-FILTR 40: «ilova» → «mahsulot», web-trek ham) va to'rt qadam matni (teglar `sub` so'zlaridan).
19. **Uyga vazifa uch bandi** (tugatish · uchish rejimi tekshiruvi · yangi real vaqt nuqtasi) — tayanch 4 «yakun kartasida, o'z mahsuloti bo'yicha»; mazmuni mening qarorim.
20. **A1 4-qadam (4)** — agentga «tokensiz ulanib ko'r»: agent javobi da'vo deb aytilgan; belgi — o'quvchining o'z tekshiruvi.
21. **12-ekran QIzoh «Sxema — reja: hodisalar hali yuborilmaydi; Mentorning sodda variantida ular hamma ulangan ilovaga boradi.»** — sahnada telefon o'zgarayotganini halollashtirish va «hamma ulangan ilova» ustunini tushuntirish uchun (02-FILTR 18).
22. **Web-trekda uchish rejimi** — saytni telefon brauzerida ochish (kompyuterda Wi-Fi'ni o'chirish dars sahifasini uzadi); DevTools yo'li yozilmadi (Shubhali 6).
23. **Final tartibi** 6 bo'lak: ulanish birinchi (ulanish bo'lmasa hodisa kelmaydi); 3 (Database'ga yozib tugatish) 4 (hodisa) dan oldin — o'qitiladigan nuqta (02-FILTR 2).
24. **4-savol (11-ekran) «bu misolda»** chegarasi — socket.io `connectionStateRecovery` yoqilsa uzilishdagi paketlar tiklanishi mumkin (sukutda yo'q) — distraktor «kutib turadi, keyin keladi» shuning uchun «bu misolda» noto'g'ri.

## Shubhali joylar (ishonchim komil emas)
1. **Expo Go + uchish rejimi:** uchish rejimi Metro (kompyuterdagi `npx expo start`) bilan aloqani ham uzadi — ilova ishlayveradimi, Expo Go ogohlantirish chiqaradimi — qurilmada sinalmagan; pilotda tekshiriladi (REPO 5). ⛔ 02-FILTR 9: bu — «qur» darvozasi: haqiqiy Android telefon + Expo Go'da sinalmaguncha A1 4-qadam (2) muzlatilmaydi; ishlamasa — boshqa takrorlanadigan yo'l tanlanadi va MD yangilanadi (hozir to'qilmaydi).
2. **Belgi «Ulanmoqda…» ga o'tish vaqti** — hujjat bo'yicha 45 s gacha (`pingInterval` + `pingTimeout`); telefon OS ulanishni tezroq yopishi mumkin — o'lchanmagan. A1 da «bir daqiqagacha cho'zilishi mumkin» deb yozildi.
3. **Render deploy vaqti** («bir necha daqiqa») va Render sahifasidagi tugma/menyu nomlari — umumiy so'z bilan; «Deploys» nomi yozilmadi.
4. **socket.io avval HTTP long-polling bilan ulanadi, keyin WebSocket'ga o'tadi** (Manbalar 6) — sahnadagi «ochiq chiziq» soddalashtirish; «socket.io = WebSocket» deyilmagan. Render bepul xizmatida bitta instansiya — long-polling uchun sticky session muammosi bo'lmasligi kerak (taxmin, sinalmagan).
5. **Render «uyg'oq tutadi»** — hujjatda «WebSocket messages from existing connections» so'rov sanaladi; socket.io heartbeat (ping/pong) ham xabarmi — hujjatda aniq yozilmagan; 02-FILTR 25 dan keyin o'quvchi matnidan olindi, faqat O'qituvchi eslatmasida, «qur» da tekshiriladi.
6. **Web-trek uzilish tekshiruvi:** telefon brauzerida uchish rejimi — ishlashi kerak; Chrome DevTools «Offline» ochiq WebSocket'ni uzadimi — sinalmagan, yozilmadi. CORS `WEB_ORIGIN` qatori — gateway uchun alohida sozlash (`cors` opsiyasi) — agent yozadi.
7. **`ulanish.ts` o'qish bo'lagi** — tokenni `expo-secure-store` dan asinxron o'qish ko'rsatilmagan (qisqartirilgan); haqiqiy kod `autoConnect: false` yoki `auth` funksiya bilan bo'ladi — REPO 2.
8. **«Ulanmagan» amalda qachon ko'rinadi** — token yaroqsiz bo'lsa 11-Modul qoidasi bo'yicha `401` da ilova «Kirish»ni ochadi; «O'yinlar» da «Ulanmagan» ko'rinishi uchun Backend ulanishni yopgan, lekin HTTP so'rov hali `401` bermagan payt kerak — kam uchraydi. 8-darsdagi mehmon ko'rinishida (ulanish faqat kirganlarga) ko'rinishi mumkin — 8-dars MD qaror qiladi.
9. **Vaqt:** 15 dars ekrani + A1 (Backend + ilova + Render) ≈ 90 daqiqaga zich; A1 kutish paytida ish berildi, A2 va A1 4-qadam uyga o'tishi mumkin (A-bo'lim 10).
10. **Jadval kataklaridagi «→»** («8 / 10» → «9 / 10») — tayanch 1.2 jadvalidan aynan (12-ekran, A2, Mentor README); T-035 «o'quvchi izohida va test variantida yo'q» — jadval katagi izoh emas, lekin GATE M da ko'rsatiladi. 13-ekran ipuchasida «o'rniga» bilan yozildi.
11. **Bashorat (10-ekran)** uchta belgi yozuvini natijadan oldin ko'rsatadi — yozuvlar ilova belgilari, kashfiyot esa «qaysi biri» va «hodisa kelmadi».
12. **5-ekran «Qayta so'rash» va 2-ekran «1-telefonga yuborish»** — sahna tugmalari (haqiqiy ilovada yo'q); ✎ izohlarda ochiq, o'quvchi matnida «sahna» so'zi yo'q — vizual bosqichda tugma oddiy ilova tugmasidan ajralib turishi kerak (chegarali, ramkadan tashqarida).
13. **Sxema jadvali (12-ekran) 5 ustun × 5 qator** 1280×800 da bitta ekranga sig'ishi — vizual bosqichda (KOD 11 zaxira yo'li).
14. **Arena 10** («socket.io o'zi qayta ulanishga urinadi») — sukut sozlamada rost (`reconnection: true`); `io server disconnect` da urinmaydi — savol uchish rejimi (tarmoq uzilishi) haqida, shuning uchun rost.
15. **A1 4-qadam (3)** o'quvchi o'z Database'siga haqiqiy qo'shilish yozadi (o'z akkaunti) — tekshiruv yozuvi emas, o'chirilmaydi; muammo ko'rmadim, lekin 7-dars sanog'ida sinfdosh/o'zi alohida sanaladi.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7, 14 band)
1. [x] **Yakun holatga qarab** — 19-ekran: to'rt sarlavha (A1+A2 · A1 · sxema saqlangan · hech biri); ✓ yorlig'i faqat A1 va A2 bajarilganda; sarlavha o'quvchi ishini aytadi, Mentor natijasini emas.
2. [x] **Da'vo isbot emas** — a) «Bu misolda», «Mentor misolida», «11-Modulda», «bu kodda» (5, 7, 10, 11, 12, 14-ekran xulosalari, asosiy fikr, yakun) · b) bitta hodisa + sabab — Mentor qarori (12-ekran xulosa, 13-ekran Yordam) · c) «bo'lishi kerak», «odatda bir necha soniyada», «bir daqiqagacha cho'zilishi mumkin», «odatda o'zi qayta yuklaydi» (A1 3–4-qadam); «ulanadi» o'rniga «ulanishga urinadi» (arena 10) · d) A1 4-qadam (4): agent javobi — «uning so'zi», belgi — o'z tekshiruvi.
3. [x] **Maxfiy qiymat chiqmaydi** — A1 1-qadam: `git status` da `.env` yo'q; A1 3-qadam va A2 4-qadam: «`.env` qiymatlari, token va kalitlarni emas»; prompt: «`.env` fayllariga tegma»; A2 1-qadam: README'ga ism yo'q; 13-ekran kalitiga shaxsiy ma'lumot yozilmaydi.
4. [x] **Tashqi xizmat faqat rasmiy hujjat** — socket.io, NestJS, Render, MDN — Manbalar 1–12 (havola, sana, iqtibos); Render sahifa nomlari umumiy so'z bilan; tekshirilmagan qadamlar «pilotda» (Shubhali 1–3, 6).
5. [x] **Har sonning manbasi va o'lchovi** — sonlar faqat Mentor misolidan («8 / 10», «7 / 9», «Navbatda: 1», 5 soniya); kutish vaqtlari manbasi Manbalar 5, 11 va TAYANCHGA SAVOL 15; statistika yo'q.
6. [x] **Tayanchda yo'q narsa to'qilmagan** — to'qilgan har tafsilot TAYANCHGA SAVOL 1–24 da (sahna tugmalari, `oyinId: 1`, gateway nomi, web fayl nomi, nishonlar, uyga vazifa, kutish vaqtlari).
7. [x] **Saqlash kaliti o'qiydigan darsning ehtiyojidan** — `pm-m10d2-sxema` tayanch 8 sxemasi aynan; `id` barqaror (`q1`…), tartib o'zgarmaydi; 3-dars qatorlarni `id` lari bilan nusxalaydi (03-FILTR 20: 3-dars bu kalitga yozmaydi); kalit yo'q bo'lsa A2 qavsi bo'sh, kulrang «masalan».
8. [x] **Test: bitta himoyalanadigan javob** — 4 test + final + arena 12: variantlar bir shaklda, uzunlik skript bilan (O'lchov); «Farqi yo'q» tipidagi variant yo'q; tashqi xizmat distraktorlari sukut sozlamaga mos («bu misolda» — 4-savol); savoldagi son javobda takrorlanmaydi.
9. [—] **Keys: bank so'zi aynan** — dars keyssiz (Qaror-0 22), brend va real kompaniya yo'q.
10. [x] **90 daqiqa** — vaqt taqsimoti tepada va A-bo'lim 10; A1 3-qadamda kutish paytida ish; «Ulgurmasangiz» har blokda; «Ortda qoldingizmi» ikkala blokda; O'qituvchi eslatmasi 1-ekran va A1.
11. [x] **Bir ma'no — bir so'z** — «hodisa» faqat ulanish hodisasi; «xabar» — ulanish orqali yuboriladigan narsa; «holat» ikki birikmada (TAYANCHGA SAVOL 14); «belgi» — ulanish belgisi va «Kelaman» belgilari (tayanch); «tekshirish» — o'z ishi, «sinov» yo'q; «sxema» faqat jadval; «so'raydi» — asosiy fe'l.
12. [x] **Web-trek teng yo'l** — A1: web prompt qatorlari to'liq (papka, fayl, `VITE_API_URL`, `localStorage`, CORS `WEB_ORIGIN`, «Yangilash» tugmasi, `npm install`), kutilgan natijada brauzer oynasi, tekshiruv telefon brauzerida; A2 ikkala trekda bir xil; 7-ekran karta izohi (`VITE_API_URL`); test va final ikkala trekka to'g'ri («ilova» — web-trekda sayt; 02-FILTR 40: o'quvchi mahsuloti haqidagi sarlavha va yakunda «mahsulotingiz», final bo'laklarida neytral «Ilova» — Maydon Jamoa sahnasi).
13. [x] **Agent va o'quvchi ishi ajratilgan** — qaror o'quvchida: belgi turadigan ekran, buzilmasin ro'yxati, sxema qatorlari va hodisa nomlari, «hozirgi holat» qatori; agent quradi va ko'chiradi; tekshiruvda o'quvchi nimani ko'rishi aniq (belgi, uchish rejimi, README qatorlari); agent tekshiruv yozuvi yaratmaydi.
14. [x] **O'smir xavfsizligi** — ism, telefon, akkaunt ma'lumoti hech qayerda so'ralmaydi va yozilmaydi (README, kalit, prompt); A1 4-qadam faqat o'z ilovasida; «buzish» yo'q (5-dars); boshqa odamning ilovasi tekshirilmaydi.

## O'lchov (scratchpad `md02/olchov.py`, 06.10.2026; 02-FILTR dan keyin qayta yurgizildi)
Skript natijasi (fayl yozilgandan keyin; `!!!` — chegaradan oshgan joy; hammasi tuzatilgan). Belgilar — oddiy `len`, ✔ va bo'shliqlarsiz.
Yakun sarlavhalari (holatga qarab, skript qamramagan): 50 · 55 · 44 · 49. Kod oynasi shart xabarlari: 53 · 57. QIzoh qatorlariga chegara yo'q (bitta qator); eng uzuni — 12-ekran sxema qatori 105.

```
## Sarlavhalar (≤55)
   48  Sizning ekraningizda nega hali «8 / 10» turibdi?
   45  Bugun mahsulotingiz Backend'ga ulanib turadi.
   41  So'rov bo'lmasa, Backend nima qila oladi?
   36  Ulanish ochiq tursa, nima o'zgaradi?
   34  Backend yuborgan xabarda nima bor?
   43  Backend kim ulanayotganini qayerdan biladi?
   52  Hodisa kelganda sonni qayta so'raydigan kod yozamiz.
   46  Ulanish uzilsa, o'yinchi buni qayerdan biladi?
   41  Kim nima qilsa, kimning ekrani o'zgaradi?
   53  Mahsulotingiz uchun real vaqt oqimi sxemasini yozing.
   53  O'zgarish sizning ekraningizga qaysi tartibda yetadi?
   53  Mahsulotingiz Backend'ga ulansin va belgi ko'rsatsin.
   46  Sxemangizni README'ga yozdiring va tekshiring.
   25  O'zingizni sinab ko'ring.
   50  Mahsulotingiz Backend'ga ulangan, sxema README'da.
   55  Mahsulotingiz ulangan — sxemani README'ga yozish qoldi.
## Xulosalar (≤110)
  103  11-Modulda yo'l faqat so'rov paytida ochiladi: ilova so'ramasa, Backend unga hech narsa yubora olmaydi.
   99  Ulanish ochiq turganda ikkalasi istagan payt xabar yubora oladi: Backend ilova so'rashini kutmaydi.
   94  Bu misolda hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi.
  105  Bu misolda ilova ulanayotganda tokenni yuboradi; Backend shu paytda tekshiradi va yaroqsiz bo'lsa yopadi.
   96  Bu kodda son uch paytda so'raladi: sahifa ochilganda, «Yangilash» bosilganda va hodisa kelganda.
   92  Ulangan — hodisalar keladi; ulanmoqda — ilova o'zi urinmoqda; ulanmagan — ilova urinmayapti.
  105  Mentor misolida bitta hodisa besh sabab bilan keladi; har qatorda kim olishi va nima o'zgarishi yozilgan.
   57  Sxemangiz saqlandi — amaliyotda u README'ga ko'chiriladi.
  100  Bu misolda avval Database'dagi o'zgarish tugaydi, keyin hodisa yuboriladi — ilova yangi sonni oladi.
## Hook javoblari (≤120)
   95  Aynan! 11-Modulda ilova so'raganda yangilanadi: ekran ochilganda va pastga tortib yangilaganda.
   97  Qiziq fikr! Backend biladi: qo'shilish Database'ga yozildi. Ilova esa undan hali qayta so'ramadi.
   91  Qiziq fikr! Telefonlar bir-birini tanimaydi: ikkalasi ham sonni faqat Backend'dan so'raydi.
## Xato izohlari / QXato / shart (≤60)
   52  Database o'zgardi — lekin ilovaga yo'lni kim ochadi?
   53  Qo'shilish Backend'ga yetdi; sizning ilovangizga-chi?
   54  Ochiq turgan ekranda son eski qoldi — nimadir yetmadi.
   43  Konvertni ochganingizda ichida son bormidi?
   44  Hodisada ism yo'q edi: unda ikki maydon bor.
   46  Ro'yxat katta, hodisa esa qisqa — ikki maydon.
   59  Yaroqsiz tokendan keyin Backend kodida qaysi qator ishladi?
   53  Parol faqat kirishda yoziladi; ulanishda so'ralmaydi.
   44  Yangi token faqat «Kirish» ekranida olinadi.
   47  Ulanish uzilgan — hodisa qaysi yo'ldan kelardi?
   59  Bu misolda Backend uzilgan ilova uchun hodisani saqlamaydi.
   54  Ilova ishlayveradi: belgi o'zgaradi, ekran yopilmaydi.
   60  Sabab o'yinchi nima qilganini aytadi — kartani qayta o'qing.
   58  Kamida ikki qator kerak; har qatorda beshta katak to'lsin.
   43  Tartib mos emas — bo'lakni bosib qaytaring.
## QIzoh qatorlari
   76  Haqiqiy sonni ilova Backend'dan qayta oladi; Backend uchun manba — Database.
   95  Token yopiq so'rovlardagidek ishlatiladi, lekin bu yerda u ulanish ochilayotganda tekshiriladi.
   76  Bu oynada `ulanish` — namuna: haqiqiy Backend emas, hodisani tugma yuboradi.
   92  Ulanish qaytgani son to'g'rilandi degani emas: bu misolda uzilishdagi hodisa keyin kelmaydi.
  105  Sxema — reja: hodisalar hali yuborilmaydi; Mentorning sodda variantida ular hamma ulangan ilovaga boradi.
   89  Render'da yangi versiya chiqqanda ulanish uziladi — belgi bir lahza «Ulanmoqda…» bo'ladi.
## Mentor gaplari (gap soni)
  2 gap · 152  Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingizda qilasiz. Backend bugun hali xabar yubormaydi
  1 gap · 100  Backend tugunidagi «1-telefonga yuborish» ni bosib ko'ring, keyin birinchi telefonni pastga torting.
  1 gap · 117  10-Modulda dashboard Backend'dan qayta-qayta so'rardi — bugun boshqa yo'l: birinchi telefonda Maydon Jamoa'ni oching.
  2 gap · 118  boshida — Birinchi telefon chetidagi konvertni bosib oching. · ochilgach — Ichida son yo'q: «Qayta so'rash» ni bosing.
  1 gap · 124  Mentor misolida ulanishni socket.io kutubxonasi ochadi — avval «Tokensiz ulanish» ni, keyin «Token bilan ulanish» ni bos
  2 gap · 109  Hodisa kelganda ishlaydigan kod tinglovchi deyiladi. Uni o'zingiz terib yozasiz: qo'lda yozganda o'rganiladi.
  1 gap · 98  Doimiy ulanish ham uziladi — birinchi telefonda uchish rejimini yoqing va tepadagi belgiga qarang.
  1 gap · 93  Har o'zgarish uchun Backend yuboradigan hodisaning sababini tanlang — qator jadvalga tushadi.
  1 gap · 89  11-Modulda README'ga yozgan real vaqt nuqtalaringizdan boshlang: har nuqtaga bitta qator.
  1 gap · 43  Bo'laklarni bajariladigan tartibda joylang.
  1 gap · 88  Talab tayyor — ikki joyni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.
  1 gap · 92  Sxemani siz yozgansiz — agent faqat ko'chiradi, siz solishtirasiz; «1 · Ochish»dan boshlang.
## Ballik testlar — variant uzunliklari (±15% o'rtachadan)
  ## 3 · 1-savol ✔ (jonli ball · savol 0 so'z · variantlar [32, 33, 33, 33] · eng uzun 33 / eng qisqa 32 · OK
      A   32  Database'da son o'zgargan paytda
      B✔  33  Backend'ga so'rov yuborgan paytda
      C   33  Boshqa o'yinchi qo'shilgan paytda
      D   33  Ilova ekranda ochiq turgan paytda
  ## 6 · 2-savol ✔ (jonli ball · savol 8 so'z · variantlar [36, 30, 35, 34] · eng uzun 36 / eng qisqa 30 · OK
      A   36  O'yinning yangi sonini va ro'yxatini
      B   30  Qo'shilgan o'yinchining ismini
      C   35  O'yinlarning yangilangan ro'yxatini
      D✔  34  Qaysi o'yin o'zgargani va sababini
  ## 8 · 3-savol ✔ (jonli ball · savol 10 so'z · variantlar [35, 35, 34, 36] · eng uzun 36 / eng qisqa 34 · OK
      A✔  35  Ulanishni yopadi, hodisa yubormaydi
      B   35  Ulanishni ochadi, hodisa yubormaydi
      C   34  Ulanishni ochadi, parolni so'raydi
      D   36  Ulanishni yopadi, yangi token beradi
  ## 11 · 4-savol ✔ (jonli bal · savol 8 so'z · variantlar [35, 33, 32, 35] · eng uzun 35 / eng qisqa 32 · OK
      A   35  Hodisa keladi, son o'zi yangilanadi
      B   33  Hodisa kutib turadi, keyin keladi
      C✔  32  Hodisa kelmaydi, son eski qoladi
      D   35  Hodisa keladi, ilova yopilib qoladi
## Arena (12) — ✔ o'rni va variant uzunliklari
   1. ✔A · 6 so'z · [27, 25, 25, 25] · OK  Qayta-qayta so'rashda yangi son qachon ko'rinadi?
   2. ✔B · 4 so'z · [30, 26, 29, 30] · OK  Doimiy ulanishni kim ochadi?
   3. ✔C · 3 so'z · [27, 28, 30, 29] · OK  WebSocket nima beradi?
   4. ✔D · 5 so'z · [19, 17, 17, 17] · OK  Hodisaning qaysi ikki qismi bor?
   5. ✔A · 5 so'z · [24, 21, 20, 20] · OK  Hodisada `sabab: 'chiqdi'` nimani bildiradi?
   6. ✔B · 8 so'z · [23, 24, 19, 19] · OK  Hodisa kelgach, Mentor ilovasi yangi sonni qayerdan oladi?
   7. ✔C · 5 so'z · [37, 32, 37, 38] · OK  `ulanish.on('oyin-ozgardi', korsat)` qatori nima qiladi?
   8. ✔D · 5 so'z · [16, 16, 17, 18] · OK  Backend ulanayotgan ilovani nimadan taniydi?
   9. ✔A · 5 so'z · [27, 26, 23, 26] · OK  Belgi «Ulanmagan». Bu nimani bildiradi?
  10. ✔B · 6 so'z · [31, 28, 27, 30] · OK  Uchish rejimi o'chirildi. socket.io nima qiladi?
  11. ✔C · 6 so'z · [21, 25, 22, 21] · OK  Sxemadagi «Kim oladi» ustuni nimani aytadi?
  12. ✔D · 6 so'z · [27, 28, 32, 33] · OK  Mentor sxemasida `elon-berildi` sababi qachon yuboriladi?
  taqsimot: {'A': 3, 'B': 3, 'C': 3, 'D': 3} · tartib: A B C D A B C D A B C D
## Ekranlar
  20 ekran: 0 Kirish — son o'zgarmadi | 1 Reja | 2 So'rov va javob | 3 1-savol ✔ (jonli ball) | 4 Ochiq turadigan ulanish | 5 Konvert ichida nima bor | 6 2-savol ✔ (jonli ball) | 7 Kim ulanayotgani | 8 3-savol ✔ (jonli ball) | 9 Tinglovchi | 10 Ulanish belgisi | 11 4-savol ✔ (jonli ball) | 12 Mentor sxemasi | 13 O'z sxemangiz | 14 Hodisa yo'li (final) | 15 Amaliyot 1 — ilova Backend'ga u | 16 Amaliyot 2 — sxema README'da | 17 Natijalar (podium) — umumiy sha | 18 Takrorlash | 19 Yakun
```
## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m10-01` «Mahsulotingizni bir sahifada qanday tanishtirasiz?» → **`m10-02` «WebSocket: ekran o'zi yangilanadigan ulanish»** (osti «doimiy ulanish, hodisalar va real vaqt oqimi sxemasi») → `m10-03` «Ekran o'zi yangilanishi uchun nimani yozasiz?»; reja teglari `sub` so'zlari bilan; yakundagi «Keyingi dars» — `00-NOMLAR.md` 3-qator.
- [x] Bitta misol-ip («Maydon Jamoa», hook → bloklar); metafora yo'q; bitta vizual — `IkkiTelefonSahna` (ikki telefon va Backend; 7, 12-ekranlarda bitta telefon + karta/jadval — o'sha manba); o'quvchining o'z mahsuloti — 13-ekran va bloklar. Keyssiz.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2, 4, 5, 7, 10, 12 (va 0, 9, 13, 14, 15, 16) — matn-karta yo'q; bashoratlar (2, 4, 5, 7, 10, 12) tanlangach ixcham qator bo'lib qoladi; har harakatli ekranda faol element halqada, Mentor shu harakatni aytadi.
- [x] Sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 — o'lchov skripti (O'lchov bo'limi).
- [x] Atamalar tayanch 2 va 11-Modul bilan bir xil (doimiy ulanish, WebSocket, socket.io, hodisa, tinglovchi, ulanish holatlari, qayta ulanish, real vaqt oqimi sxemasi, real vaqt nuqtasi, token, so'raydi); siz-forma; tugma ot-shaklda («Yangilash», «Saqlash», «Nusxalash», «Bajardim»); agent promptlari — T-002 istisnosi; olam matni (hodisa nomi, kod) — T-008.
- [x] Testlar: variantlar bir shaklda, uzunligi yaqin (skript), to'g'ri javob yolg'iz eng uzun emas; kalit so'z/kod/tire faqat to'g'rida emas · ✔: s3 B · s6 D · s8 A · s11 C · arena A·B·C·D ×3 · inkor-savol yo'q · ballik testlar ketma-ket emas (3, 6, 8, 11, 14).
- [x] Final: uyalarda faqat raqam va «bu yerga qo'ying», Mentor tartibni aytmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «hech qachon», «darhol», «darrov», «albatta», «100%», «kafolat» — o'quvchi matnida yo'q; «istagan payt» — ulanish ochiq turganda, tayanch ta'rifi).
- [x] Ichki kodlar o'quvchi matnida yo'q (A1/A2, `m10-02`, kod raqami, «mini-PRD», «pilot»); modul raqami LMS bo'yicha («10-Modulda», «11-Modulda»); tarixiy voqea yo'q; tashqi xizmat tugmasi bosilmaydi (faqat `git`, Antigravity, telefon uchish rejimi); T-038 va'da-qatori yo'q — kelajak faqat yakun qatorida · «KOD» (16) va «REPO» (5) ro'yxati to'liq.
- [x] Karta T · P · S ko'rildi: T-002 · T-008 · T-009 · T-010 · T-011 (doimiy ulanish → WebSocket → socket.io → hodisa → tinglovchi — harakatdan keyin; sarlavhalarda yangi atama yo'q: «WebSocket» faqat dars nomida — TEX qoidasi) · T-014/015 · T-016/017 (metafora yo'q) · T-024 · T-029 · T-034 · T-039 («ilovangiz» — 11-Moduldan bor) ·
      T-042 · T-043 · T-044 · T-045 (uziladi va qayta ulanadi; socket.io WebSocket emas; hodisa son olib kelmaydi — «bu misolda») · T-047 · T-048 · T-049 · T-052 (doimiy ulanish — 11-Modul so'rovi bilan; tinglovchi — `addEventListener` bilan) · T-064 · T-066 · T-070 ·
      P-001/002/004 · P-007 · P-008 · P-010 · P-013 · P-014/015 · P-016 · P-025 · P-026 (xato yo'li, ayb o'quvchida emas) · P-028 (tashqi tugma nomi taxmin qilinmadi) · P-036 · P-046 · P-052 · P-055 · P-059 · P-062 · P-063 (`MENTOR_SXEMA`, `HODISA_YOLI`) · P-064 · P-065 (7-ekran) · P-067 ·
      S-001 · S-002 · S-004 · S-006 · S-008 · S-010 · S-015 (bashoratlar o'sish tartibida) · S-018 (brend yo'q) · S-019 · S-020 · S-026 · S-040 · SABOQ 6, 9, 11, 12, 13, 16, 17, 19–31.
