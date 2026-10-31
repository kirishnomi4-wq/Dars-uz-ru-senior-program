# MENTOR_DARS_ETALON — mentor darslari qonuni

> **Doira:** `src/mentor-kurs/` dagi ovozli mentor darslari (12 ta NEW mavzu: PostgreSQL ×2, Telegraf+PG, Nest ×2, Jest ×2, CI/CD ×2, WebSocket ×2, Webhook).
> **Etalon-dars:** `src/mentor-kurs/NestArchMentorLesson.jsx` (manba — `parts/01…07`, dvigatel `parts/02-dvigatel.jsx`).
> **Tug'ilishi:** 2026-10-30, foydalanuvchining 39 ekranli so'zma-so'z ko'rigi (F-1030-01…20, jurnal: `feedback/F-1029-02-mentor-kurs/JURNAL.md`).
> **Qoida:** yangi qonun = yangi raqam (M17, M18 …); eski raqam o'zgarmaydi. O'quvchi darslari qonuni boshqa — `DARS_ETALON.md`, `PM_DARS_ETALON.md`; bu fayl faqat mentor darslari uchun.

---

## 0. Kim uchun va nima uchun

**O'quvchi (bu darsni o'qiydigan odam) — mentor.** U Express'ni biladi, lekin yangi mavzuni (Nest, Jest, CI/CD…) hali bilmaydi. Yonida ustoz yo'q — **dars o'zi ustoz**: ovoz gapiradi, ekran u bilan birga o'zgaradi.

**Mentor nima qiladi:** kursdagi 12 ta mentor darsining **hammasini** o'tib bo'lgach, o'quvchilarga darslarni boshidan o'tadi. Demak:
- mentor darsni ko'rib darhol sinfga kirmaydi — u **butun kursni** biladi;
- mentor darsi o'quvchi darsidan **chuqurroq**: o'quvchi so'raydigan har atamaga mentorda tayyor javob bo'lishi kerak;
- har dars oxirida mentor: (1) mavzuni biladi, (2) o'z qo'li bilan qilgan, (3) o'quvchi darsini qanday o'tishni biladi, (4) sinfda chiqadigan xatolarga tayyor.

**Uslub (o'zgarmas, 29.10 qarorlari):** JSX + ovoz (ekran-yozuv video yo'q, o'yin qatlami yo'q) · mentor imtihoni tili: atama inglizcha + qavsda izoh, adabiy «siz» · «shoshilmaslik, haqiqiy dars» · haqiqiy loyiha ustida (shartli misol bo'lsa — ochiq aytiladi).

---

## 1. Ekran anatomiyasi (qolip)

```
┌ mk-head:  ● KICKER (bosqich)                      [🔈 ovoz] [↺ boshidan]  14 / 39 ┐
├ mk-body ─────────────────────────────┬──────────────────────────────────────────┤
│ Say (chap):                          │ Sahna (o'ng):                            │
│   sarlavha                           │   ┌ Explorer ┐ ┌ kod / terminal ┐        │
│   KALIT IBORA (hozirgi segment)      │   │ src/     │ │ …              │        │
│   ▬ ▬ ▬ ▬ (qadam chiziqchalari)       │   │  app.…   │ └────────────────┘        │
│   [Matn] — to'liq transkript          │   └──────────┘ [brauzer] [qoida-blok]   │
├ mk-nav: [← Orqaga]                                         [Davom →] (qulf) ────┤
```

- **Segment = qadam = bitta vizual o'zgarish.** Segment ovozi tugaganda keyingisi boshlanadi; sahna `at`/`focus`/`hl` bo'yicha o'zgaradi.
- **Chapda faqat hozirgi segmentning kalit iborasi** (M6). Oldingi gap kulrang qilib qoldirilmaydi. To'liq matn — «Matn» tugmasida.
- **Ekran turlari** (dvigatel komponentlari): `Lesson` (oddiy), `Practice` (amaliyot), `MCRetry` (variantli tekshiruv), `LineCheck` (qaysi satr xato), `Screen27` (yakuniy sinov), `Screen28` (yakun).

---

## 2. Qonunlar

### M1 · Fayl daraxti — har kod sahnasida (F-1030-10)
**Qoida.** Loyiha fayli ko'rsatilgan **har** sahnada chapda VS Code uslubidagi **Explorer** turadi: `Explorer · <loyiha>`, papkalar, fayllar uch rangda (ko'k Controller · yashil Service · sariq Module · kulrang boshqa), **hozir ochiq fayl yoritilgan** (oq fon + qizil chiziq). Kod paneli yuqorisidagi yorliqda to'liq yo'l: `src/cars/cars.service.ts`.
- Hali yaratilmagan fayl daraxtda **ko'rinmaydi**; CLI yaratganda paydo bo'ladi (`fresh` — animatsiya bilan).
- Bir ekranda bir nechta fayl bo'lsa, daraxtda faol fayl qadam bilan almashadi (`seg.file`).
- Tekshiruv ekranlarida ham (`LineCheck` → `tree`), boshqa loyiha bo'lsa — o'z ildizi bilan (`root: 'shop-api'`).

**Nega.** Mentor so'zi: «vscodeda filelar chap tomonda kichkina korinadi va qaysi fileligimiz bilinadi bunda esa tolka kod kod kod gapirib yotibti tushunarsiz». Fayl joyi ko'rinmasa, kod bo'lagi «havoda» qoladi va ekran tushunilmaydi (14- va 16-ekran shu sababdan tushunarsiz edi).

**Qanday.** `Ide` / `FileTree` (`parts/02-dvigatel.jsx`): `<Ide files={ALL_FILES} active="src/cars/cars.service.ts"> …kod… </Ide>`. Katta ko'rinish (vazifa izohi bilan) — `<FileTree big desc={…} />` (5-ekran).

✅ `Ide` + yo'lli yorliq + faol fayl. ❌ Faqat qora kod paneli, burchakda xira `cars.controller.ts`.

### M2 · Tekshiruvdan keyin — tuzatilgan kod ko'rsatiladi (F-1030-14)
**Qoida.** «Qaysi satr xato» tekshiruvida to'g'ri satr topilgach, kod **tuzatilgan holatga** o'tadi: eski satr **chizilgan** (`gone`), yangisi **yashil** (`neu`), yonida qisqa izoh (`// faqat Controller qoldi`). Tuzatish boshqa faylga ham tegsa — o'sha fayl ham ko'rsatiladi (`fixedExtra`), masalan hisob Controller'dan Service'ga ko'chsa.

**Nega.** «xatoni aytyapman va togri controleerda bitasi qoladi unisi providerga ketadi deyapti ammo kodga shunaqa vizualne korsatish yoq». Xatoni topish — yarim ish; mentor sinfda **tuzatishni** ko'rsatadi.

**Qanday.** `LineCheck … fixed={LC2_FIXED} fixedExtra={[…]}`; variantli tekshiruvda (`MCRetry`) — `after={…}` bloki: to'g'ri javobdan keyin tuzatilgan fayl Explorer bilan + yashil terminal (29-ekran). Ovozdagi `ok` matni: «Ekranda tuzatilgan …».

### M3 · «Buzamiz» ekrani tuzatish bilan tugaydi (F-1030-13)
**Qoida.** Ataylab buzilgan har holat tartibi: **buzish → server/so'rov natijasi → xabarni bo'laklab o'qish → tuzatish (yashil satr) → muvaffaqiyatli terminal (`successfully started` / `200`) → xulosa-qoida**. Tuzatish segmenti alohida, sahna tuzatilgan kodga va yashil terminalga o'tadi.

**Nega.** «xatoni koridk va tahlil qildik togrilashchi kodda». Xato tahlil qilinib, tuzatilmay qolsa, ekran chala tuyuladi.

**Dalil.** Tuzatilgan holat ham haqiqiy chiqish bo'lishi shart (masalan Injectable qaytarilgach `/cars` 200 — `manba/nest-out/14`).

### M4 · Davom qulfi (F-1030-01)
**Qoida.**
1. Oddiy ekran: **ustoz gapirib bo'lmaguncha Davom bosilmaydi** (`nextDisabled={!done}`). Ovoz o'chiq bo'lsa — «Keyingi qadam →» bilan qadam-baqadam o'tiladi, oxirgi qadamda Davom ochiladi.
2. Amaliyot: **hamma katakcha + to'g'ri isbot + ovoz tugadi** — shundan keyingina Davom.
3. Ekran ilgari to'liq o'tilgan bo'lsa (`p.seen`) — qaytib kelganda qulf yo'q.
4. Holat chapdagi kartada aytiladi: «isbot kutilmoqda» / «ovoz tugagach Davom ochiladi».
5. **Takrorlash rejimi (A12, 30.10):** «← Orqaga» (yoki Orqaga'dan keyin Davom) bilan ilgari ko'rilgan ekranga kelinsa — ekran **tayyor (yakuniy) holatda, ovozsiz** ochiladi, chapda izoh: «Takrorlash: … Ovoz bilan qayta eshitish — ↺ boshidan». ↺ bosilsa yoki sinov natijasidagi «N-ekran» tugmasi bilan kelinsa — ovoz bilan, boshidan (`mode: 'review' | 'live'`, `useBeats(segments, review)`).

**Nega.** «organmasdan oxirigacha eshitmasdan davom ni bosib ketmasn», «isbot yozmasa davom ochilmasin».

### M5 · Har ekran xulosa bilan tugaydi (F-1030-15)
**Qoida.** Har `Lesson` ekranining **oxirgi segmenti — xulosa**: kalit iborasi «Xulosa: …» bilan boshlanadi, ovozi fikrni yopadi (1–3 gap: nima bo'ldi + nima qilish kerak). Xulosa yangi fakt qo'shmaydi — ekranni bog'laydi. Istisnolar: 1-ekran (kirish) reja bilan tugaydi; amaliyot ekranlarida oxirgi segment Davom shartini aytadi («Katakchalar va isbot bo'lmasa, Davom ochilmaydi»).

**Nega.** «har bir page chaladayda xulosasi yoqday … oquvchi 500 chiqdi desa, qanday xato tashladingiz deyapti tamom nima». Savol bilan tugagan ekran — chala ekran.

✅ «Xulosa: o'quvchi «nega 500?» desa — «qanday xato tashladingiz?» deb so'rang va almashtiring: topilmasa NotFound, ma'lumot noto'g'ri bo'lsa BadRequest.» ❌ «Qoida: … «Nega 500?» → qanday xato tashladingiz?» (javob yo'q).

### M6 · Kalit ibora — bitta to'liq ma'noli gap (F-1030-03, F-1030-07)
**Qoida.** Kalit ibora (`key`) = segmentning **asosiy ma'nosi, bitta to'liq gapda**. Norma **8–14 so'z**; 5–7 so'z faqat gap to'liq ma'noli bo'lsa. Kalit so'zlar ro'yxati, telegramma uslubi, «X → Y» shifr — **taqiq**. Eng muhim 1–3 so'z `<b>` bilan (qizil). Kod — `<code>` (qora fon, oq yozuv — fon bilan qo'shilib ketmaydi).

| ❌ Edi | ✅ Bo'ldi |
|---|---|
| Toshkent yozdi, Berlin bir daqiqada tushundi | Har Nest loyihasida bo'laklar bir joyda, bir nomda — **Toshkentda yozilganini Berlin bir daqiqada tushunadi** |
| Sinab bo'lmaydi, to'qnashuv. Nest shu og'riq uchun | Bitta marshrutda hamma ish — alohida sinab bo'lmaydi, ikki kishi to'qnashadi. **Nest shu og'riq uchun** |
| Tip = buyurtma varaqasi | 3-qadam: konstruktordagi tip `AppService` — Nest **shu nusxani konstruktorga beradi** |
| 5 · Tezmi? → yo'q, tartib | 5 · «Nest tezroqmi?» → yo'q, ichida Express; Nest **tezlik emas, tartib** beradi |

**Tekshiruv.** Skript: barcha `key` so'z soni (`< 7` yoki `> 18` — qo'lda ko'riladi).

### M7 · «↺ boshidan» — butun ekranni qaytaradi (F-1030-05)
**Qoida.** Yuqoridagi ↺ tugmasi **ekranni boshidan** boshlaydi: ovoz 1-segmentdan, sahna boshlang'ich holatda. Faqat hozirgi gapni qaytarish — taqiq (ko'p bosqichli ekranda adashtiradi). Texnik: ildiz `rev` kaliti → ekran qayta o'rnatiladi (`onRestart`).

### M8 · Mentor hammasini biladi — «keyingi darsda» deyilmaydi (F-1030-16)
**Qoida.**
1. Mentor darsida «keyingi darsda ko'ramiz/o'rganamiz», «Jest darsida qaytamiz» — **taqiq**. Mavzu kerak bo'lsa — shu yerda **bir-ikki gap bilan** tushuntiriladi.
2. O'quvchi darsida faqat nomi chiqadigan har atama (Entity, DTO, Repository, Guard, BaseService, token, successRes…) uchun mentorga **tayyor bir gap** beriladi (ko'prik ekrani — «O'quvchi so'rasa — sizning gapingiz» kartasi).
3. Mentorga «o'quvchiga keyingi dars deb ayting» degan maslahat — taqiq; o'rniga: «bir gap bilan tushuntiring va darsga qaytaring».
4. Ruxsat: navigatsiya («Kursdagi keyingi dars: …» kartasi), o'z darsi ichidagi havola («14-ekranda ko'ramiz», «beshinchi bosqichda buzib ko'ramiz»).
5. **Tinchlantirish ruxsat va kerak (F-1030-28):** o'quvchi darsida chiqadigan, lekin bu mentor darsida chuqur o'tilmaydigan mavzu (Entity, DTO, Repository…) uchun: bir gap tushuntirish **+** «Xavotir olmang: buni kursdagi keyingi mentor darslarida to'liq, kodi bilan o'rganasiz». Maqsad — mentor vahima qilmasin. Taqiq faqat hozir kerak bo'lgan narsani keyinga surish.

✅ «Nest kiruvchi ma'lumotni o'zi tekshirmaydi … Aytish usuli DTO: alohida klassda brand matn va majburiy deb yoziladi, ValidationPipe yoqiladi — bo'sh so'rovga Nest o'zi 400 qaytaradi.» ❌ «Tekshiruv keyingi darsda, DTO bilan.»

### M9 · Mentor lug'ati (F-1030-04, F-1030-08, F-1030-17, F-1030-18)
| ❌ Ishlatilmaydi | ✅ Ishlatiladi | Sabab |
|---|---|---|
| jurnal (terminal chiqishi ma'nosida) | **terminal**, terminaldagi satrlar / xabar | «qaysi jurnal, jurnal yoqku bizda» |
| bashorat qiling | **o'ylab ko'ring**; natija: «Sizning javobingiz» | foydalanuvchi qarori |
| et belgisi (ovozda «@») | **kuchukcha** belgisi; ekranda `@` (kuchukcha) | «@ ni it emas kuchukcha deylik» |
| xizmatni yoqing | **PostgreSQL'ni ishga tushiring** + OS buyrug'i (Windows: Services → postgresql → Start · Mac: `brew services start postgresql` · Linux: `sudo systemctl start postgresql`) | «xizmatni yoqing deyapti qaysi xizmat» |
| havola | **link** (loyiha lug'ati, `til-lint`) | `MATN_ETALONI` lug'ati |
| marshrut | **route** (`route'lar`, `route'ni`) | F-1030-21: mentor inglizcha atamani biladi |
| mantiq; «Controller yupqa» | **logika**, biznes logika; «Controller'da logika yozilmaydi» | F-1030-25 |
| bog'liqlik | **dependency** (`dependency'ni`, `dependency'si`) | F-1030-21 |
| yetkazib berish (DI) | **inject qilish** | F-1030-21 |
| manzil (route yo'li) / ildiz | **path** / **root** (`root path`); URL va baza manzili — «manzil» qoladi | F-1030-21 |
| nusxa (DI ma'nosida) | **instance**; «nusxalang» (copy) qoladi | F-1030-21 |
| dekorator | **decorator** (`decorator'i`) | F-1030-21 |
| daraxt | **Explorer** / **fayl strukturasi** | F-1030-23 |
| kim · nima · qayerda | **qaysi klass · qaysi dependency · qaysi fayl** (M18) | F-1030-29 |
| so'rov, javob, ro'yxat | **o'zbekcha qoladi** (oddiy so'zlar; kodda `request`/`providers` ko'rinib turadi) | 30.10 qaror |

**Apostrof tuzog'i (30.10, o'z xatoyim):** inglizcha atamaga o'zbekcha qo'shimcha apostrof bilan qo'shiladi (`route'ni`). Bir tirnoqli JS satr ichida bu satrni **buzadi** — bunday satr qo'shtirnoqqa olinadi. Qo'shtirnoqlarni regex bilan ommaviy almashtirish **taqiq**: o'zbekcha apostroflar (`bo'ladi`) buzilib ketdi (53 joy, qayta tiklandi). Almashtirishdan keyin har doim esbuild + vite build.
| keyingi darsda | (M8) shu yerda bir gap | mentor hammasini biladi |

Ovoz qoidalari (29.10): kod ovozda o'qilmaydi — nima bo'layotgani aytiladi; «/» va «@» so'z bilan; raqam ovozda so'z bilan, ekranda raqam (`digits()`, uzun ibora oldin).

### M10 · Halol raqam va haqiqiy chiqish (F-1030-02)
**Qoida.** Ekranda aytilgan har son **ko'rsatilgan narsaga mos**: «20 qator» desa — kodda 20 satr. Terminal chiqishlari, xato matnlari, status kodlari — **haqiqiy ishga tushirishdan** (`feedback/F-1029-02-mentor-kurs/manba/nest-out/`), taxmin bilan yozilmaydi. Shartli misol bo'lsa — ekranda ochiq: «shartli misol, haqiqiy loyiha emas». O'quvchi loyihasi haqidagi fakt — repodan tekshiriladi (30.10: `IntroNestArxitechture/.env.example` — `DEV_DB_URL=postgres://postgres:password@localhost:5432/nestarxitechture`).

**Nega.** «38 qator deyapmiz kodda 18 korinyapti» — bitta noto'g'ri raqam butun darsga ishonchni sindiradi.

### M11 · Amaliyot ekrani (F-1030-01, F-1030-12)
**Qoida.**
- Har qadam: katakcha · nusxalanadigan buyruqlar · «Kutilgan: …».
- Kod kerak bo'lgan qadamda — **qadam ichida «Kodni ochish · fayl.ts» tugmasi** (pastki burchakdagi yashirin «Kod» tugmasi — taqiq). Kod ochilganda Explorer bilan, fayl bosilsa almashadi; «namuna — o'zingiz yozing, nusxalash yo'q» belgisi kerak joyda.
- **Isbot maydoni** majburiy; placeholder **javobni ko'rsatmaydi** («terminalda chiqqan raqamni yozing», ❌ `11.0.10`). Xato qiymatga izoh chiqadi.
- «Boshqacha chiqdimi?» jadvali + oxirgi qator: «Hech biri emas → skrinshot + xato matni mentor-kurs Telegram guruhiga».

### M12 · Tekshiruvlar va yakuniy sinov (F-1030-11, F-1030-19)
**Qoida.**
- Tekshiruv sharti **qoidani eslatadi va aniq vazifa beradi**: «Qoida: Controller … hisob qilmaydi. Bu Controller'da bitta satr hisob qilyapti. O'sha satrni bosing.» ❌ «Kodda bitta xato bor» (nimaga qarab qidirishni aytmaydi).
- Xato tanlansa maslahat **yo'nalish** beradi («Narxni o'zgartirib, hisob qilayotgan satrni qidiring»), ❌ mavhum savol («Hisob qayerda?»). To'g'risi ochilmaydi.
- Yakuniy sinov: bitta urinish, izoh ochiladi; natijada xato savol yonida «N-ekran» tugmasi; ekrandan qaytganda kirish ovozi **qayta o'qilmaydi** — o'rniga: «Yaxshi, bir xatoyingizni ko'rib chiqdingiz. Qolgan qizil savollarning ekranlariga ham qayting. Tayyor bo'lgach, Sinovni qayta topshirish tugmasini bosing.»

### M13 · Yakun ekrani tartibi (F-1030-20)
**Qoida.** Oxirgi ekran tartibi: **(1)** sinov ≥ o'tish balli → «**Barakalla!** Siz darsni yaxshi o'rgandingiz» (o'tmagan bo'lsa — qayta topshirish maslahati) → **(2)** animatsion xulosa: so'rov yo'li sxemasi (nuqta yuradi) + 6 band birin-ketin, har band sxemaning o'z qismini yoritadi → **(3) uyga vazifa** kartasi (M14) → **(4)** bir sahifalik eslatma (nusxalash / .md yuklab olish) → **(5)** «Darsni yakunlash» (`onFinished`, dars tugallanadi).

### M14 · Uyga vazifa (F-1030-20)
**Qoida.** Har dars uyga vazifa bilan tugaydi: **shu dars usulini yangi narsada takrorlash** (Nest 1-dars: `users` moduli — 3 CLI buyrug'i, Service ro'yxat + findAll/findOne/create + NotFoundException, Controller 3 marshrut) **+ bir marta ataylab buzib tuzatish + GitHub'ga push, link platformadagi uyga vazifaga va mentor-kurs Telegram guruhiga**. Dars ichida link maydoni yo'q (foydalanuvchi qarori 30.10). Kartada: qadamlar, nusxalanadigan buyruqlar, vaqt (40–60 daqiqa), tekshiruvchi nimaga qarashi. Vazifa eslatmaga ham yoziladi.

### M15 · Ekran sig'ishi va kichik ekran (F-1029-02-02, F-1030 Chrome)
**Qoida.** Har ekran **1920×1080 va 1280×720** da tekshiriladi. VS Code oynasi (M19) sahnadan oshmaydi (`max-height:100%`), sig'masa **editor qismi o'zi aylanadi**, fayl tab'i tepada qotib turadi (sticky). Aylantirish faqat eng yaqin aylanuvchi konteynerda (`scrollBox`: editor yoki sahna) — sahifaning o'zi hech qachon siljimaydi (30.10: siljigan sahifada oyna sarlavhasi tepadagi tugmalarni yopgan edi). Sahna markazlashuvi «xavfsiz» (`margin:auto`), sig'masa tepasi kesilmaydi. Bitta qadamda ikki narsa ko'rinishi shart bo'lsa va sig'masa — faktni qoida-kartaga ko'chiring (35-ekran: «10 marta qayta urinadi»). Tekshiruv: headless o'lchov «sahifa-siljigan=0 · yashirin-yoritilgan=0 · nav=ok» — 39/39. Sahna sig'masa — panel ichida aylanadi va **shu qadamda paydo bo'lgan blok avtomatik ko'rinishga** keladi (`Lesson` → `sceneRef`). Kod paneli yoritilgan satrga o'zi aylanadi (`CodePanel`). Fayl nomlari Explorer'da kesilmaydi (218px).

### M16 · Ovoz ishlamasa dars qotmaydi (F-1030 Chrome)
**Qoida.** Ovoz rad etilsa / o'chiq bo'lsa: «Keyingi qadam →» ko'rinadi; savol segmentida runtime kutayotgan bo'lsa, qadam savolga suriladi (`useBeats`) — savol baribir chiqadi. Hech bir ekran faqat ovozga bog'lab qo'yilmaydi.

### M17 · Ekranlar orasida ustoz ko'prigi (F-1030-26)
**Qoida.** Har ekranning **birinchi gapi** oldingi ekrandan kelib, shu ekranga nega o'tganimizni aytadi — haqiqiy ustoz kabi. Formula: *oldingi natija → savol yoki ehtiyoj → shu ekran*. Quruq boshlanish («app controller ts.») — taqiq. Ko'prik `text` ga ham, `show` bo'lsa unga ham yoziladi; tekshiruvlarning `q` ovozi ham ko'prik bilan boshlanadi.

✅ «Controller so'rovni oldi va ishni Service'ga uzatdi. Demak keyingi bekat Service, uni ochamiz: app service ts.» ✅ «Fayllar bo'sh, route yo'q. Tartib bo'yicha avval ishni bajaradigan bo'lakni, Service'ni to'ldiramiz.» ❌ «app service ts. Ustida Injectable decorator'i.»

### M18 · Xato xabarini o'qish formulasi (F-1030-29)
**Qoida.** «can't resolve dependencies» va shunga o'xshash xabar uch savol bilan o'qiladi: **qaysi klass** (`… of the CarsController`) · **qaysi dependency** (`argument CarsService at index [0]`) · **qaysi fayl** (`in the CarsModule module` → `cars.module.ts`). Mavhum «kim · nima · qayerda» — taqiq: «qayerda» emas, aniq **fayl nomi**.

### M19 · Bitta VS Code oynasi (F-1030-22, F-1030-24)
**Qoida.** Explorer va kod **bitta oyna** ichida: sarlavha qatori (●●● `cars-api — Visual Studio Code`), chapda Explorer, o'ngda editor, kod panelida fayl yorlig'i (tab). Alohida turgan Explorer kartasi — taqiq. Istisno: **jarayon sxemasi** (so'rov yo'li) — unga Explorer qo'yilmaydi (brauzer «fayllar ichida»dek ko'rinadi); fayl nomi sxemadagi qutining o'ziga yoziladi.

### M20 · Topilgan tekshiruv — toza ekran (F-1030-27)
**Qoida.** Variantli tekshiruvda to'g'ri javob topilgach **boshqa variantlar yo'qoladi**, faqat to'g'risi qoladi; izoh va tuzatilgan fayl (`after`) darhol uning ostida. Xato javob paytida esa variantlar joyida qoladi (xato qizil, yopiq).

### M21 · Ovoz platformaga tayyor (30.10)
**Qoida.** (1) Har ovoz matni `[O'zbekcha tallaffuz]` bilan boshlanadi. (2) Haqiqiy inglizcha **ibora** (terminal xabari, «Dependency Injection», «Hello World»…) `[English pronunciation] … [end]` ichida — buni dvigateldagi `voice()` avtomatik qiladi (`EN_PHRASES` ro'yxati); yakka atama (Controller, route) o'ralmaydi. Teg faqat ovozga ketadi, ekranda/«Matn»da ko'rinmaydi. (3) Segment **≤ 60 so'z** (platforma: ~25 s, 60–80 so'z) — uzun bo'lsa bo'linadi; sahna qadam raqamiga bog'langan bo'lsa (`beat >= N`), raqam emas, segment belgisi bo'yicha hisoblanadi (masalan `lit`). (4) Ovozda `/ + = % ×` yo'q.

### M22 · Yopishdan oldingi to'liq sinov (30.10)
**Qoida.** Dars yopilishidan oldin: (1) ovoz yoqilgan (tezlatilgan) holda muqovadan oxirigacha **avtomatik to'liq o'tish** — har ekranda kirishda Davom yopiq, hech biri qotmaydi, amaliyot/tekshiruv/sinov bajariladi, `onFinished` `passed/testPassed/practiceDone` = true; 1920 va 1280 da. (2) `tayyorla.sh` → `.oz.jsx`, va **siqilgan fayl alohida sahifada render qilib** tekshiriladi. (3) Darsdagi har da'vo haqiqiy ishga tushirishda (`manba/drive*.sh`, `nest-out/`).

### M23 · UX/UI asoslari (30.10, foydalanuvchi artifact orqali tasdiqladi: UX-1, 3–8 qabul, UX-2 rad)
**Qoida.**
1. **Qulf izohi:** Davom yopiq bo'lsa, yonida sababi yoziladi (`lockHint`): «Ustoz gapirib bo'lgach ochiladi» · «To'g'ri javobni toping» · «Xato satrni toping» · «Katakchalar va isbotni to'ldiring» · «Beshala so'rov tugmasini bosing» · «Savollarga javob bering». Yangi topshiriqli ekran o'z `lockHint`ini beradi.
2. **Sahna doim yuqoridan** (kalit ibora bilan bir chiziqda) — ekran almashganda oyna sakramaydi. Markazlash faqat tekshiruv ekranlarida (`.mk-say.mc`, xavfsiz `margin:auto`).
3. **Xiralik:** o'tgan blok 0,55, fokusdan tashqari kod satri 0,5 — matn o'qilishi shart (orqaga qaytilganda ekran yakuniy holatda ochiladi).
4. **Tekshiruv ekrani:** savol bloki 980 px, sarlavha 24–34 px, variant 18 px.
5. **Ustunlar** hamma o'lchamda 4:8; ≥1600 px da kod 14 px, Explorer 13 px.
6. **Vizual qo'shimcha** (JS/TS solishtiruvi kabi) kod bilan bog'liq bo'lsa — VS Code oynasi ichida, alohida suzib turmaydi.
7. **Klaviatura:** Davom ochiq bo'lsa `→` yoki `Enter`; matn maydonida va tugma fokusida (Enter) ishlamaydi.
8. **Isbot maydoni chap ustunda qoladi** (UX-2 rad etildi — qadam ichiga ko'chirilmaydi).
**Usul:** UX o'zgarishi avval darsning nusxasida qilinadi, «oldin/keyin» haqiqiy suratlari bitta artifactda qaror bilan beriladi; faqat tasdiqlangani darsga o'tadi.

### M24 · Ikki til — UZ etalon, RU alohida bo'lak (31.10, F-1030-38; PRD §6.3, §9-2, §9-3)
**Qoida.**
1. Har mentor darsi **UZ + RU bitta faylda**, platforma `lang` beradi. O'zbekcha — etalon, ruscha undan tarjima; avval UZ to'liq yopiladi, keyin RU.
2. Ruscha ekran-ma'lumotlari **alohida bo'lakda** `parts/08-ru.jsx`: `ru(obj, {…})` — segment `id` bo'yicha, kod satri va ro'yxat indeks bo'yicha; `setLang()` ildizda bir marta (obyektning o'zi almashadi, o'zbekcha nusxa saqlanadi). Sahna va dvigatel yozuvlari — `t(uz, ru)`, faqat render ichida. O'zbekcha bo'laklarga (`03…07`) tarjima uchun **tegilmaydi**.
3. Uslub: «Вы», mentor imtihoni — dasturlash atamalari ruschada ham **inglizcha** (Controller, route, dependency, decorator, inject…); kod ichidagi o'zbekcha izoh va xabarlar **ruschaga**; metafora so'zlari o'quvchi darsining ruschasidan **aynan** (официант, повар, кладовщик, чертёж стеллажа, анкета заказа…).
4. Ovoz: belgisi tilga qarab `[O'zbekcha tallaffuz]` / `[Русское произношение]`; inglizcha iboralar ikkala tilda `[English pronunciation] … [end]`. Lokal: RU `ru-RU-DmitryNeural`; platformada **erkak ovozi** (31.10 qarori).
5. Himoya: `ruCheck` — ruscha ma'lumot o'zbekchada yo'q joyga tushsa konsolda `[ru] o'zbekchada yo'q: …`. `onFinished` o'zbekcha qoladi (RU_I18N_SPEC 5-qoida).
6. Yopishdan oldin (M22 ga qo'shimcha): **RU qoldiq 0** (ekran + «Matn» + ovozga ketgan matn) · **UZ belgima-belgi o'zgarmagan** (RU'dan oldin/keyin solishtiruv) · RU ovozli to'liq o'tish 1920 va 1280 · `.oz.jsx` ikkala tilda render. Vositalar: `dev/til-tekshiruv.mjs`, `dev/e2e-ovozli-otish.mjs … ru`, `dev/ekran-olchov.mjs … ru`.
7. Ruscha tarjimani **foydalanuvchi o'zi ko'radi** (31.10); ko'rilmagan tarjima «texnik tekshiruvdan o'tgan, tasdiqlanmagan» deb belgilanadi.

**Nega.** Mentorlar ikki tilda; bitta fayl = bitta `lesson_id`, tilni platforma tanlaydi. Alohida bo'lak — o'zbekcha matnga tegmasdan tarjima qilinadi va UZ o'zgarmaganini **isbotlab** bo'ladi (Nest-1: 39 ekran + 217 ovoz matni belgima-belgi bir xil chiqdi).

### M25 · Explorer — daraja chiziqlari (31.10, F-1031-02)
**Qoida.** Har Explorer'da (katta xarita ham, VS Code oynasi ham) VS Code'dagidek **vertikal daraja chiziqlari**: har ota-papka uchun bitta ingichka kulrang chiziq, papka ichidagi hamma qatorlar bo'ylab. Katta xaritada (`FileTree big`) daraja oralig'i 18px, oddiy Explorer'da 12px. Faol fayl qatori (chap qizil ramka) chiziqni surmaydi — chiziq papka qatoridagi bilan bir tekisda.
**Nega.** Faqat chapdan surish bilan fayllar «alohida-alohida» ko'rinadi: qaysi fayl qaysi papkada ekani ko'zga tashlanmaydi (foydalanuvchi, 2-ekran xaritasi). Mentor sinfda VS Code'ni ko'radi — dars ham shunday ko'rinsa, ko'chirish oson.
**Texnik.** Dvigatel `FileTree` (`parts/02-dvigatel.jsx`, `treeGuides`), CSS `.mk-explorer .ig` (`parts/01-asos.jsx`). Darsda alohida ish kerak emas.

### M26 · Yordamchi jadval yopiq turadi, ovozda tugma nomi aytiladi (31.10, F-1031-03)
**Qoida.**
1. Amaliyotdagi «Boshqacha chiqdimi?» jadvali **yopiq**: o'rnida tugma «Boshqacha chiqdimi? — N ta holat va yechim ▸»; bosilsa ochiladi, yana bosilsa yopiladi.
2. Jadval paydo bo'ladigan segmentda (`tableAt`) ustoz tugmani **nomi bilan aytadi**: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing». Kalit iborada ham tugma nomi turadi (`«Boshqacha chiqdimi?»`). «Jadvalga qarang» deyilmaydi — jadval ko'rinmaydi.
3. Shu segmentda tugma qizil ramka bilan yonadi (3 marta to'lqin), ochilgach o'chadi.
**Nega.** Jadval juda kerak, lekin doim ochiq tursa qadamlar ostida joy egallaydi va ko'zni chalg'itadi (foydalanuvchi: «ochiq turgandan ko'ra bildirib aytaylik, bossa keyin ochilsin»).
**Texnik.** Dvigatel `Practice` (`tOpen`, `.mk-trbtn`, `.hot`); tekshiruv vositasi `dev/til-tekshiruv.mjs` yopiq jadvalni ochib matnini ham tekshiradi.

### M27 · «Kodni ochish» — loyihaning to'liq ko'rinishi, qaytish ko'zga tashlanadi (31.10, F-1031-04 · F-1031-05)
**Qoida.**
1. Amaliyotdagi kod oynasida Explorer **butun loyihani** ko'rsatadi (VS Code tartibi: avval papkalar, keyin fayllar; ildizda `dist/`, `node_modules/`, `test/`, `package.json` ham) — mentor sinfda aynan shu loyiha ustida ishlaydi.
2. Mavzuga aloqasiz papkalar **yopiq** (`▸`, ochilmaydi — yozuv `'src/api/admin/'` kabi `/` bilan tugaydi). Amaliyot fayllari turgan papka ochiq, yonidagi fayllar ham ko'rinadi (masalan `entity/` ichida `admin.entity.ts`, `Base.entity.ts`, `car.entity.ts`).
3. **Faqat amaliyot fayllari bosiladi** (`clickable` = `code` ro'yxati); qolganlari xira, bosilmaydi.
4. «← Qadamlarga qaytish» — VS Code oynasidan **tashqarida, tepada, katta qora tugma**; yonida qaysi kod ochiq ekani («Kod namunasi · car.entity.ts»).
**Nega.** Faqat 6 ta fayl ko'rinsa, haqiqiy loyiha hissi yo'qoladi (foydalanuvchi: «nestarxitechture'ning vibe'ini bersin, ustida davom etadiku»). Kichik kulrang qaytish tugmasi kod oynasi ichida ko'rinmadi — mentor qadamlarga qanday qaytishni so'radi.
**Texnik.** Dvigatel: `FileTree` (`shut` papka, `clickable`, `.mute`), `Ide clickable`, `Practice tree` + `.mk-codebar`. Darsda: `Practice … tree={P2_TREE}` (Nest-2: o'quvchi reposi daraxti; Nest-1: `['dist/', 'node_modules/', ...ALL_FILES, 'test/', 'package.json']`).

### M28 · G'alati ko'rinadigan qaror — sababi va «bu to'g'ri» bilan (31.10, F-1031-06)
**Qoida.** Loyihada qoidadan chetga chiqqan joy ko'rsatilsa (masalan signin'da `@Roles('public')`, `'ID'` roli, qulfsiz `token`/`signout`), ustoz uch narsani aytadi: **nima qiladi**, **nega shunday qilingan**, **bu to'g'ri qarormi yoki xatomi**. Sahnada o'sha haqiqiy kod satri yoritiladi, yonida bir gapli karta («`'public'` — to'g'ri qaror: tokenni shu eshikdan olasiz. Qolgan eshiklar yopiq»).
✅ «Nega signin'ga public qo'yilgan? Token aynan signin'da beriladi… Signin ham token so'rasa, hech kim kira olmasdi. Shuning uchun bu to'g'ri qaror, xavfsizlik teshigi emas.» ❌ «Public bo'lsa tekshirmasdan o'tkazadi. Shuning uchun signin tokensiz ishlaydi.» (nega va baho yo'q)
**Nega.** Mentor istisnoni ko'radi-yu, sababini bilmasa «xato» deb o'ylaydi yoki o'quvchiga tushuntira olmaydi (foydalanuvchi: «bu yaxshi narsaligini aytib ketaylik, bo'lmasa tushunmay o'tirmasin»).

### M29 · Tekshiruvdan keyingi tuzatilgan kod — yonida (31.10, F-1031-07)
**Qoida.** `MCRetry` da `after` (tuzatilgan kod) bo'lsa, to'g'ri javobdan keyin ekran **ikki ustun**: chapda xato xabari, savol, to'g'ri javob, izoh (tepadan); o'ngda VS Code oynasi va yashil terminal. 1300px dan tor ekranda — ustma-ust. Bir ustunga hammasini pastma-past qo'yish taqiq: sahifa sig'maydi, savol tepasi kesiladi.
**Texnik.** Dvigatel `MCRetry` (`.mk-body.mc-split`, `.mc-after`). Darsda alohida ish kerak emas.

### M30 · Mentor o'quvchi uyga vazifasini tekshirmaydi; o'z uyga vazifasi — faqat GitHub linki (31.10, F-1031-09 · F-1031-11)
**Qoida.**
1. Mentor darsida **o'quvchi uyga vazifasini tekshirish** bo'yicha ekran, eslatma bo'limi yoki savol bo'lmaydi — buni **support mentor** qiladi. Uyga vazifa kriteriyalari keyin alohida qoida bo'ladi.
2. Mentorning **o'z** uyga vazifasi (dars davomi) qoladi; topshirish — **faqat GitHub repo linki platformadagi uyga vazifaga**. Telegram'ga yuborish va skrinshot so'ralmaydi.
3. «Hech biri emas → skrinshot + xato matni → mentor-kurs Telegram guruhi» (amaliyotdagi yordam qatori) — bu yordam kanali, uyga vazifa topshirish emas; qoladi.
**Nega.** Foydalanuvchi: «bu darsda nimaga kerak? tekshirishni mentor emas, support mentor qiladi… mentorga qo'ymaylik»; «Telegram'ga tashlashi shart emas, platformaga GitHub reposining URL'ini bersa yetarli». Kod hamma narsani ko'rsatadi; natijani hozircha hech kim kuzatmaydi (PRD §9-5) — skrinshot ortiqcha ish.

### M31 · Dars tartib raqami yozilmaydi — mavzu yoziladi (31.10, F-1031-15 · F-1031-12)
**Qoida.**
1. Muqova, 1-ekran eyebrow, eslatma (.md) sarlavhasi va boshqa joylarda «Mentor kursi · 1-dars / 3-dars» kabi **tartib raqami yo'q** — mavzu yoziladi: `Mentor kursi · NestJS` / `Курс для менторов · NestJS`.
2. Yakundagi «keyingi dars» kartasi — **«Kursdagi keyingi mentor darsi»** + keyingi darsning **nomi** va bir gaplik mazmuni (UZ + RU). Raqam ham, «tez orada» ham emas.
3. PRD §4 jadvalidagi raqam — faqat ichki qurish tartibi; o'quvchi ko'radigan matnga chiqmaydi.
**Nega.** Foydalanuvchi: mentor platformasida mentor darslari videodarslar orasida turadi — bizning raqam u yerdagi tartibga to'g'ri kelmaydi va chalg'itadi.

---

## 3. Oldingi asos-qoidalar (29.10, audit №1–2)
- Bitta segment = bitta vizual o'zgarish; segment ≤ ~25 s (ElevenLabs).
- O'ylab ko'ring savoli (`ask`) — javobdan oldin ochilmaydi; natija keyingi segmentda.
- Har bosqichdan keyin amaliyot (4 ta) — isbot bilan; `passed = sinov ≥ 6 && amaliyotlar isbot bilan`.
- Ko'prik bo'limi: o'quvchi darsi xaritasi (blok → «siz nima deysiz»), qoqiladigan joylar, sinfdagi eng ko'p xato (baza ulanishi), vaqt rejasi, o'quvchi savollari.
- Yordam kanali — «mentor-kurs Telegram guruhi» (umumiy).

---

## 4. Tekshiruv ro'yxati (har yangi mentor darsi — yopishdan oldin)

| # | Band | Qanday |
|---|---|---|
| 1 | Har kod sahnasida Explorer, faol fayl to'g'ri (M1) | 1920 surat, ko'z bilan |
| 2 | Har LineCheck — `fixed` bor (M2) | `grep -c "fixed=" ` = LineCheck soni |
| 3 | Har «Buzamiz» — tuzatish segmenti + yashil terminal (M3) | surat, oxirgi qadam |
| 4 | Davom ovozdan oldin yopiq, amaliyotda isbotsiz yopiq (M4) | headless: `davom=yopiq` |
| 5 | Har `Lesson` oxirgi segmenti «Xulosa:» (M5) | skript |
| 6 | Kalit iboralar 7–18 so'z (M6) | skript |
| 7 | «keyingi darsda», «jurnal», «bashorat», «et belgisi», «xizmatni yoqing», «marshrut», «mantiq», «bog'liqlik», «daraxt», «yupqa», «kim · nima» — 0 (M8, M9, M18) | `grep -ci` |
| 12 | Har ekranning 1-gapi ko'prik (M17) | 1-segmentlar ro'yxati, ko'z bilan |
| 8 | Raqamlar kodga mos, chiqishlar `manba/` da (M10) | qo'lda |
| 9 | Isbot placeholder javobni ko'rsatmaydi (M11) | `grep placeholder` |
| 10 | 1280×720 da yangi blok ko'rinadi (M15) | headless 1280 |
| 11 | Darvozalar: esbuild · vite build · `lint:jsx` · `lint:til` 0 error | buyruqlar DAVOM.md da |
| 13 | RU qoldiq 0 · UZ belgima-belgi o'zgarmagan · RU ovozli o'tish 1920/1280 · `.oz.jsx` ikkala tilda (M24) | `dev/til-tekshiruv.mjs`, `dev/e2e-ovozli-otish.mjs … ru` |
| 14 | Explorer'da daraja chiziqlari (M25) · amaliyot jadvali yopiq, `tableAt` segmentida tugma nomi aytiladi (M26) | 1920 surat; `grep -c "Boshqacha chiqdimi"` ovoz matnida = amaliyot soni |
| 15 | «Kodni ochish» bor har amaliyotda `tree` berilgan; xira fayl bosilmaydi, «Qadamlarga qaytish» tepada (M27) | `grep -c "code={"` = `grep -c "tree={"`; headless: xira bosish → o'zgarmaydi, qaytish → qadamlar |
| 16 | Har istisno (public, 'ID', qulfsiz route…) — «nega» va «to'g'rimi» aytilgan (M28) · `after` li tekshiruv 1920 da bir ekranga sig'adi (M29) | ovoz matni ko'z bilan; headless: to'g'ri javobdan keyin `mk-body` aylanmaydi |
| 17 | O'quvchi uyga vazifasini tekshirish ekrani/bo'limi yo'q; mentor uyga vazifasi topshirish — faqat GitHub linki (M30) | `grep -i "uyga vazifalarni tekshir\|Telegram guruh.*yuboring"` = 0 |
| 18 | Tartib raqami yo'q, eyebrow'da mavzu; keyingi dars kartasida nom (M31) | `grep -E "[0-9]+-dars\|урок [0-9]"` dars bo'laklarida = 0 |

---

## 5. Jurnal (qonun qo'shilishi)
- **2026-10-31 (6)** — M31 (tartib raqami yozilmaydi, mavzu yoziladi; keyingi dars kartasida nom — F-1031-15, F-1031-12) + tekshiruv 18-band. Sinf-supurish: qurilgan darslar 2 ta — Nest-1 (muqova, eyebrow, eslatma sarlavhasi, keyingi dars kartasi UZ+RU), Nest-2 (muqova, eyebrow UZ+RU).
- **2026-10-31 (5)** — M30 (mentor o'quvchi uyga vazifasini tekshirmaydi; o'z uyga vazifasi — faqat GitHub linki, F-1031-09/11) + tekshiruv 17-band. Sinf-supurish: Nest-2 (28-ekran olib tashlandi, 29 ekran), Nest-1 (topshirish matni UZ+RU).
- **2026-10-31 (4)** — M28 (istisno — sababi va bahosi bilan, F-1031-06), M29 (tekshiruvdan keyingi kod yonida, ikki ustun, F-1031-07) + tekshiruv ro'yxati 16-band. F-1031-08 (24-ekran: «qadam» o'rniga «bosqich») — so'z tanlovi, jurnalda.
- **2026-10-31 (3)** — M27 (kod oynasida loyihaning to'liq daraxti, faqat amaliyot fayllari bosiladi, qaytish tugmasi tepada — F-1031-04/05) + tekshiruv ro'yxati 15-band. Sinf-supurish: «Kodni ochish» bor amaliyotlar — 2 ta (Nest-1 P2, Nest-2 P2), ikkalasi tuzatildi.
- **2026-10-31 (2)** — Nest-2 qurilgan dars ko'rigi: M25 (Explorer daraja chiziqlari, F-1031-02), M26 (yordamchi jadval yopiq + ovozda tugma nomi, F-1031-03) + tekshiruv ro'yxati 14-band. Sinf-supurish: qurilgan darslar 2 ta (Nest-1, Nest-2) — ikkalasi shu raundda (dvigatel umumiy; Nest-1 ning 4 amaliyot matni UZ+RU moslandi).
- **2026-10-31** — M24 (ikki til: UZ etalon, RU `08-ru.jsx`, `t()`, `ruCheck`, erkak ovozi, foydalanuvchi ko'rigi) + tekshiruv ro'yxati 13-band. PRD qarorlari §9 (umumiy dvigatel, moslashuvchan hajm, tartib: Nest-2 → boshidan).
- **2026-10-30 (5)** — UX/UI ko'rigi: M23 (qulf izohi, sahna yuqoridan, xiralik, tekshiruv o'lchami, 4:8, oyna ichidagi qo'shimcha, klaviatura; isbot chapda qoladi).
- **2026-10-30 (4)** — 1-dars yopilishi: M15 (VS Code oyna sig'ishi, scrollBox, sticky tab), M21 (ovoz: voice() teglari, ≤60 so'z), M22 (yopishdan oldingi to'liq sinov); M11 isbot = M18 formulasi (4-amaliyot).
- **2026-10-30 (3)** — foydalanuvchi 2-ko'rigi F-1030-21…29: M17 (ko'prik), M18 (klass · dependency · fayl), M19 (bitta VS Code oynasi), M20 (toza tekshiruv), M8-5 (tinchlantirish), M9 lug'ati (route, logika, dependency, inject, path/root, instance, decorator, Explorer) + apostrof tuzog'i.
- **2026-10-30 (2)** — M2 `MCRetry after`, M4 5-band (takrorlash rejimi), M14 topshirish joyi; muqova vaqti 1,5–2 soat (ovoz o'lchandi: ~45 daqiqa, edge-tts Sardor −5% ≈ 106 so'z/daq).
- **2026-10-30** — M1…M16 (F-1030-01…20, birinchi so'zma-so'z ko'rik, Nest 1-dars v4). Sinf-supurish: mentor kursida qurilgan dars — 1 ta (`NestArchMentorLesson`), hammasi shu raundda tuzatildi; qolgan 11 dars shu qonun bilan quriladi.
