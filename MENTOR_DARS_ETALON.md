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
> **02.11:** 1-band M34 bilan almashtirildi (jadval sahifa ichida emas — oyna).
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
> **02.11:** M35 bilan almashtirildi (ikki ustun javobdan keyin emas — boshidan).
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

### M32 · Ustozdek to'liq gap; mentor darsida taqiq so'zlar (02.11, F-1102-14 · F-1102-10 · F-1102-11 · F-1102-15 · F-1102-19)
**Qoida.**
1. Ovoz va kalit ibora — **to'liq gap**, telegraf emas. Ro'yxat aytilsa, avval nima ekani aytiladi: «Qaror ko'rsatkichi **to'rtta savoldan iborat:** ma'lumot bog'langanmi, …». Yangi narsa nomi bilan kiritiladi: «users jadvali tayyor. **Endi ikkinchi jadvalni yaratamiz: postlar saqlanadigan posts jadvali.**»
   ❌ «users tayyor, endi posts.» · «Qaror ko'rsatkichi to'rt savol: bog'lanish, shakl…» · «Ko'prikning keyingi qismi til.»
2. Ekran va ovozda ishlatilmaydi: **«jim»** (→ fe'l bilan «xato bermay», ot bilan «yashirin», bot — «javob bermaydi») · **«ko'prik»** (→ bosqich nomi «O'quvchi darsini o'tish») · **«bu kursda»** (→ «AI Startup kursidagi o'quvchilar», «AI Startup kursida emas»).
3. Ovozda **«psql»** qisqartmasi o'rniga **«PostgreSQL terminali»**; buyruq sifatida (`psql -U postgres`, «psql buyrug'i PATH'da») qoladi; birinchi uchrashganda bir marta: «PostgreSQL terminali, uning dastur nomi psql».
**Nega.** Foydalanuvchi PG-1 ni ovozi bilan tinglab: «users tayyor endi post deyapti tamom — aniq tushunarli qilaylik, haqiqiy ustozday gapirsin», «ko'prik so'zi bo'lmaydi», «jim so'zini umuman ishlatmaymiz», «psql deb qisqacha ketyapti tushunarsiz ekan». Mentor eshitadi, matnni o'qimaydi — shifr gapda mohiyat yo'qoladi.
**Texnik.** til-lint `mentor-jim` · `mentor-koprik` · `mentor-bu-kursda` (error, `onlyFiles: src/mentor-kurs/`). To'liq gap — grep bilan tutilmaydi: har dars ko'rigida ovoz matni shu band bilan o'qiladi.
- **Istisno (02.11, foydalanuvchi 2-savol A):** o'quvchi darsining o'z atamasini bir marta «…» ichida keltirish mumkin («jim buzilish» — `EdgeCasesTestLesson` kartochkasi), yonida mentor so'zi aytiladi («yashirin buzilish, ikkalasi bitta narsa»). Joyi — «O'quvchi darsini o'tish» bosqichidagi so'zlar ekrani (Jest-2 21-ekran). `til-lint` `mentor-jim` « dan keyingi «jim»ni o'tkazadi.

### M33 · Xulosasi yo'q ekranda — «Demak, …» (02.11, F-1102-13)
**Qoida.** «Xulosa:» segmenti faqat `Lesson` da (M5). Tekshiruv va amaliyot ekranlarida mohiyat bir gap bilan mustahkamlanadi:
1. Tekshiruv (`MCRetry`, `LineCheck`) — to'g'ri javob ovozi **«Demak, …»** bilan tugaydi: umumiy qoida bir gapda («Demak, on satrida doim tashqi kalit ustuni turadi»).
2. Amaliyot (`Practice`) — oxirgi segment **«Demak, …»** bilan tugaydi: amaliyotdan keyin mentorda nima bor («Demak, shu amaliyotdan keyin PostgreSQL kompyuteringizda o'rnatilgan va siz unga terminaldan ulana olasiz»).
3. Kirish, o'z-sinov, yakun — kerak emas.
**Nega.** Foydalanuvchi: «ba'zi page'lardan mohiyat topolmayapman… xulosa bo'lmasa, demak manabunday deb ketsa, mustahkamlab ketsa».
**Texnik.** Tekshiruv: `grep -c "Demak,"` ≥ tekshiruv + amaliyot soni (har dars MD'sida).

### M34 · «Boshqacha chiqdimi?» — sahifa ustidagi oyna (02.11, F-1102-12; M26 ning 1-bandini almashtiradi)
**Qoida.** Tugma joyida turadi («Boshqacha chiqdimi? — N ta holat va yechim ↗»). Bosilsa **sahifa ustida oyna** ochiladi (orqa fon xiralashadi); ✕, oynadan tashqarini bosish yoki Esc — yopadi; tugma joyida qoladi, yana bosilsa yana ochiladi. Ovozda: «tugmasini bosing, yechimlar oynasi ochiladi». M26 ning 2–3-bandlari (ovozda tugma nomi, `tableAt` da qizil to'lqin) kuchda.
**Nega.** Sahifa ichida ochilgan jadval qadamlarni pastga surib, sahifani buzardi (foydalanuvchi: «bossa pop-up bo'lsa, yana qayta yo'qoladi, tugmaning o'zi qoladi»).
**Texnik.** Dvigatel `TroubleModal` (`.mk-modal`, `role="dialog"`, Esc). Portal yo'q — platforma SDK faqat react importiga ruxsat beradi.

### M35 · Tekshiruv ekrani boshidan ikki ustun, joyi qimirlamaydi (02.11, F-1102-16; M29 ni almashtiradi)
**Qoida.**
1. `after` bo'lgan tekshiruv **boshidanoq** ikki ustun: chapda savol (sarlavha 20–26 px) va variantlar; o'ngda xato xabari yoki terminal (`above`) va uning ostida bo'sh joy — «To'g'ri javobni topganingizdan keyin shu yerda haqiqiy natija ochiladi».
2. To'g'ri javobdan keyin natija **o'sha bo'sh joyda** ochiladi. Variantlar o'z joyida qoladi: to'g'risi yashil, qolgani xira — hech narsa sakramaydi, yo'qolmaydi.
3. Sahnada «????» kabi quruq belgi yo'q — o'rnida savol: «← baza COMMIT'ga nima deb javob berdi? Variantni tanlang».
**Nega.** Avval to'g'ri javobdan keyin bir ustun ikkiga bo'linar, uch variant yo'qolar va hamma narsa siljirdi (foydalanuvchi: «test to'g'ri ishlagach juda buzilib ketdi… UX/UI tomonlama xato»; «bunaqa dizayn umuman bo'lmaydi»). F-1030-27 («faqat to'g'ri variant qoladi») shu sababli bekor: tuzatilgan blok endi o'ng ustunda.
**Texnik.** Dvigatel `MCRetry` (`split = !!after`, `.mc-q`, `.mc-wait`, variant `.off`).

### M36 · Tuzatilgan kodda eski satr — qizil, yangisi — yashil (02.11, F-1102-18)
**Qoida.** `gone` satr xira emas: **qizil fon, qizil matn, qalin chiziq bilan chizilgan**; `new` satr — yashil. «Oldin → keyin» bir qarashda ko'rinadi.
**Nega.** 25% xira satr qora kod panelida ko'rinmasdi (foydalanuvchi: «do kod juda ko'rinmayapti, qizil rangda qilsak — do va posleni ko'rib xulosa qiladi»).
**Texnik.** Dvigatel CSS `.mk-ln.gone` — hamma darsdagi `gone` satrlarga birdan ta'sir qiladi.

### M37 · Isbot maydoni to'ldirilmaguncha yumshoq yonadi (02.11, F-1102-20)
**Qoida.** Amaliyotdagi isbot maydoni to'g'ri to'ldirilmaguncha qizil ramka va past yorug'likda yonib-o'chadi; ustida qalin «Isbot: …» yozuvi. To'g'ri yozilgach to'xtaydi, yozuv yashil bo'ladi.
**Nega.** Foydalanuvchi katakchalarni belgilab, Davom nega ochilmasligini qidirdi: «shu yerga yozishim kerakligi bilinmadi».
**Texnik.** Dvigatel `Practice` (`.mk-input.need`, `@keyframes mk-glow`).

### M38 · Ovoz matni hech qachon kesilmaydi; amal kerak bo'lsa, ovoz nima bosishni aytadi (02.11, F-1102-17)
**Qoida.**
1. Tekshiruv, LineCheck va amaliyot ovozi oxirida **nima bosiladi** aniq aytiladi («Xato satrni bosing», «Variantni tanlang»).
2. Generator (`dev/<dars>-matn.py`) MD'dagi «…» ichida ichki qo'shtirnoq bo'lsa ham **gapning oxirigacha** oladi; yopilmagan « qolgan matn chiqsa — yig'ish to'xtaydi.
**Nega.** PG-1 16-ekranda ovoz «Lekin natija noto'g'ri: «Bugun Nest o'rgandim»» da kesilgan edi — mentor nima qilishni eshitmadi (foydalanuvchi: «nimanidir bos demayapti… majburiy to'g'rilansin»). Generator ichki «…» ning birinchi » belgisida to'xtagan; 7 darsda 6 joy.
**Texnik.** 10 generatorda naqsh `«(.+?)»(?=\s*·\s|\s*$)` + «F-1102-17 himoyasi». Supurish: 6 joy tuzatildi (PG-1, Jest-1, Jest-2, CI/CD-1, CI/CD-2, TgPg).

### M39 · Darsning asosiy tushunchasi — boshida, ko'rinadigan misol bilan (02.11, F-1102-21)
**Qoida.** Kirishdan keyingi birinchi ekran darsning poydevor tushunchasini **bir xil ma'lumot ustida ko'zga ko'rsatadi** (masalan PG-1: SQL va NoSQL — `users` Mongo'da hujjat, PostgreSQL'da jadval: ustun va qator), nomlarning ma'nosi bilan (SQL — so'rov tili, NoSQL — «SQL emas»). Lug'at (so'z ↔ so'z) undan keyin keladi, o'rnini bosmaydi. Misol haqiqiy yurgizishdan (M10).
**Nega.** Foydalanuvchi PG-1 ni to'liq ko'rib: «eng katta muammo — SQL va NoSQL nimaligi: SQL column, row, NoSQL document». Lug'at abstrakt edi, farq ko'rinmasdi.
**Texnik.** PG-1: `## 2 · SQL va NoSQL` (`manba/drive-pg1-sqlnosql.sh` → `pg1-out/25–26`). Qolgan darslar ko'rigida shu band tekshiriladi (Jest — test nima, CI/CD — lenta nima, WebSocket — doimiy ulanish nima…).

### M40 · Chap panel matni gapga mos: o'lcham, og'irlik, chip, uzun gap (03.11, F-1102-22)
**Qoida.**
1. Chap panel (ustoz gapi): sarlavha `.mk-title` 19–22px / 600, xira (`T.ink2`); kalit gap `.mk-key` 19–22px / 500, to'q; gap 110 belgidan uzun bo'lsa (`data-len="long"`, teglarsiz sanaladi) 17–19px; urg'u `b` 600.
2. Kod chipi `.mk-key code` — och fon (`T.chip`), to'q matn, ingichka hoshiya, qatorda bo'linmaydi (`white-space:nowrap`). Qora blok emas.
3. Tekshiruv savoli `.mk-title.mc-q` 19–22px / 600, to'q; variant 16px. **Yakuniy sinov savoli ham shu klass** — dars bo'lagida `.mk-title` / `.mk-key` ga inline `fontSize` yozilmaydi; ball sarlavhasi 22–26px. Muqova `h1` 24–30px / 700.
4. O'lchamlar faqat dvigatelda (`parts/01-asos.jsx`); uzunlik yorlig'ini `parts/02-dvigatel.jsx` `lenTag()` beradi (`Say` kalit gap va sarlavha, `MCRetry`, `LineCheck`).
**Nega.** Foydalanuvchi PG-2 24-ekranida: «juda katta, qo'pol; gapga mos bo'lsin; testlarda ham, kodli joyda ham, boshida ham». 30px/700 kalit gap va 28px/800 sarlavha o'qish emas, afisha edi; qora chip gapni bo'lib yuborardi. Uch variant haqiqiy renderda ko'rsatildi (8 ekran × hozir/A/B/C), foydalanuvchi A ni tanladi.
**Texnik.** `parts/01-asos.jsx` (`T.chip`/`T.chipLine`, 8 qoida), `parts/02-dvigatel.jsx` (`lenTag`, `keyHtml`, `data-len`); 12 dars yakuniy sinov bo'lagida savol `mk-title mc-q`, ball `clamp(22px,1.9vw,26px)`. Variantlar va kiritish tartibi: `feedback/F-1029-02-mentor-kurs/dev/f1102-22-variantlar/`. Tekshiruv: haqiqiy build surati A surati bilan 0 px farq (`dev/surat-ekran.mjs`).

### M41 · Avval mentor o'rganadi: dars tanasi — mavzu, «Sinfga tayyorgarlik» — oxirida qisqa (03.11, F-1103-03)
**Qoida.**
1. Dars tanasi faqat mavzu, mentorning o'zi uchun: **nima · nega · ichida qanday ishlaydi · qachon buziladi** — haqiqiy yurgizish bilan (M10). «O'quvchiga ayting», «o'quvchi darsida» gaplari tanada bo'lmaydi.
2. Tekshiruv va amaliyot mentorning **o'z tushunchasini** sinaydi: haqiqiy natijani bashorat qilish, sababini topish, tuzatish. «O'quvchi … yozdi» holati faqat yakuniy blokda.
3. Misol-ip o'quvchi darsiga bog'lanmaydi: darsning o'z misoli; o'quvchi darsi ma'lumoti faqat yakuniy blokda, taqqoslash uchun.
4. Yakuniy blok **«Sinfga tayyorgarlik»** 2–3 ekran: o'quvchi darsi xaritasi, uchta qoqiladigan joy, sinf savollari. Butun darsning 10–15 foizidan oshmaydi.
5. Har mavzu bo'limida kamida bitta «ichida nima bo'ladi» ekrani (PG-2: tranzaksiya ichi, `Pool`, `$1` va SQL injection kabi).
**Nega.** Foydalanuvchi (03.11): «juda o'quvchi darsiga kirishamiz; mentor bilimsiz qolsin, faqat o'quvchiga o'tsin — emas; mentor o'rgansin, oxirida o'quvchi uchun biroz tayyorlansin; mohiyatni tushunmasdan o'quvchiga shunchaki gapirib bersa — xato». O'lchov PG-2 v1: 28 ekrandan 4 tasi o'quvchi darsi haqida, lekin tekshiruv 3/3 «O'quvchi: … yozdim», «o'quvchi» so'zi 70 dan ortiq, misol-ip m4-06 do'koni, chuqurlik o'quvchi darsi darajasida.
**Texnik.** Qo'llanish tartibi: PG-2 MD v2 (pilot, foydalanuvchi ko'rigi) → 9 yangi dars → Nest-1/2 tekshiruvi. 3-bo'limdagi «Ko'prik bo'limi» endi yakuniy blok ichida.

### M42 · Tekshiruv ekrani: material savoldan oldin, karta yo'q, sabab variant ichida, bitta «Demak» (03.11, F-1103-02)
**Qoida.**
1. Ikki ustun boshidan (M35): chapda savol va ixcham variantlar; o'ngda **material** — terminal, kod yoki xabar (`above`) savoldan oldin; to'g'ri javobdan keyin o'sha joyda **isbot** (`after`), ostida bitta **«Demak, …»** (`demak`). O'ng ustun butun bo'yi bo'ylab, panel cho'ziladi.
2. «To'g'ri» / «Unday emas» kartasi yo'q: sabab **tanlangan variantning ichida** (to'g'risi yashil, xatosi qizil, 13–14px); to'liq tushuntirish — ovozda.
3. Bir gap ikki joyda yozilmaydi: ekranda sabab (variant ichida) va «Demak» — qo'shimcha izoh (`mk-rule`) qo'yilmaydi.
4. Savol mentor tilida (M41): «O'quvchi: … yozdim» emas, «Buyruq xatosiz o'tdi, javob `UPDATE 0`. Bu nimani bildiradi?».
**Nega.** Foydalanuvchi PG-2 6-ekrani haqida: «gapning ochig'i test page yoqmadi» — anketa ko'rinishi, bir xil gap uch joyda (karta, qizil izoh, ovoz), sahifaning yarmi bo'sh. Ikki variant haqiqiy renderda ko'rsatildi (artifact X5sRDCMScd3dzgk2RdRDLR), foydalanuvchi **A** ni tanladi.
**Texnik.** Dvigatel `MCRetry`: `above` / `after` / `demak`, `.mk-opt .why`, `.mc-after`, `.mc-proof`, `.mc-demak`; `.mk-fb` faqat LineCheck'da qoldi. Dars tomoni: har tekshiruvda `above` material + `demak`, `after` ichida `mk-rule` yo'q — PG-2 v2 dan boshlab, qolgan darslar M41 qayta yozuvida. Demo: `src/mentor-kurs/demo/`, `mentor-demo.html`.

### M43 · Kod va natija ekranga sig'adi: o'ralmaydi, butun enda, natija kod tagida (03.11, F-1103-04, F-1103-08)
**Qoida.**
1. Kod qatori HECH QACHON o'ralmaydi (bir qator — bir qator). Dvigatel `CodePanel` `wrap` ni e'tiborsiz qoldiradi.
2. Kod yoki terminal paneli bor sahna bitta ustun: VS Code oynasi o'ng ustunning to'liq enida, terminal / Postman / psql — kod tagida (`.pg-two:has(.mk-ide), .pg-two:has(.mk-panel)`).
3. Darsning o'z demo-kodi Prettier (80 belgi, `singleQuote`) formatida — uzun qator haqiqiy loyihadagidek mantiqiy qatorlarga bo'linadi; belgilar (`id`) shu bayonotning hamma qatoriga o'tadi (`dev/kod-prettier.mjs`). Reponing haqiqiy kodi (haqiqiy satr raqamlari) va terminal chiqishi o'zgartirilmaydi.
4. 1600 px dan kichik ekranda Explorer 150 px, kod 12 px — 80 belgilik qator butun ko'rinadi; baribir sig'masa — panel ichida gorizontal skroll (sahifa emas).
5. Tekshiruvdagi material/isbot paneli balandligi mazmuniga teng — bo'sh katta quti yo'q (`.mc-after`, `.mc-proof` `flex:0 0 auto`).
**Nega.** Foydalanuvchi TgPg ni Vercel'da ko'rib: «1 qator kod 3 qator bo'lgan — mentor ko'rib o'qigisi ham kelmaydi, o'qisa ham tushunmaydi» · «oynaning kattaligini qara» · «terminal kesilgan, undan ko'ra pastiga qo'ysak bo'ladi» · tekshiruvda «katta bo'shliq qorada nima kerak??». Namuna (TgPg 14-ekran, 1920/1280 surat) tasdiqlandi: «Ha, 12 darsga yoy».
**Texnik.** `parts/01-asos.jsx` (media 1599, `.pg-two:has`, `.mc-*` flex), `parts/02-dvigatel.jsx` (`CodePanel`), `dev/kod-prettier.mjs` (indeks/repo bloklari o'tkaziladi, `FORCE=` bilan qo'lda — so'ng `.slice` chegarasi yangilanadi). Qolgan: haqiqiy fayl satrlari bilan kesiladigan uzun kod (PG-2 15-ekran `server.js` 25–60) — dars qayta qurilganda bo'lak-bo'lak.

### M44 · Progress saqlanadi: mentor darsni bo'lib o'tadi, qaytganda o'z ekranidan davom etadi (03.11, F-1103-06)
**Qoida.**
1. Har dars brauzer xotirasiga (`localStorage`, kalit `ccMentor:<LESSON_ID>`) ekran raqami, ko'rilgan ekranlar va javoblarni yozadi — har o'tishda.
2. Qaytganda dars darhol ekranga tushmaydi: kirish oynasida «N-ekrandan davom etish →» (asosiy) va «Boshidan boshlash» (ikkinchi darajali) + bir qator izoh. Sabab: brauzer ovozni faqat bosishdan keyin chaladi.
3. Ekranlar soni o'zgargan bo'lsa (dars qayta qurilgan) eski yozuv olinmaydi — dars boshidan. «Boshidan boshlash» yozuvni o'chiradi.
4. Javoblar ham tiklanadi — `onFinished` hisobi (`passed`, amaliyot isboti) bo'lib o'tilgan darsda ham to'g'ri.
**Nega.** Dars 1–2 soat; mentor uni bir o'tirishda tugatmaydi. Foydalanuvchi: «yarmigacha ko'rdi, nechadir soatdan keyin kirsa yana 0 bo'lib qoladimi» → «saqlashni qilamiz, o'quvchi darslarda qilganmiz, men ruxsat beraman». Platforma andozasidagi «javoblar faqat useState'da» qoidasidan ongli chekinish — foydalanuvchi qarori (o'quvchi darslaridagi `ccProgress` kabi, F-0730-01).
**Texnik.** Dvigatel `parts/02-dvigatel.jsx`: `useMentorSave`, `loadSaved`, `clearSaved`, `CoverStart`; CSS `.mk-resume`, `.mk-resume-note`. Dars tomoni: asosiy komponentda `const sv = useMentorSave({...})`, `<Cover onStart={sv.start} resume={sv.resume} />`, Cover tugmasi `<CoverStart …/>`. `startAt` (dev, `?s=`) bo'lsa saqlov o'qilmaydi.

### M45 · Tanish buyruq yonida: mentor bilgan texnologiyadan yangi buyruqqa ko'prik — birinchi chiqqan joyda bitta qator (03.11, F-1103-09)
**Qoida.**
1. Mentor allaqachon biladigan texnologiya bo'lsa (PostgreSQL darslarida — Mongoose), yangi buyruq BIRINCHI marta chiqqan joyda uning tanish jufti bitta xira qatorda turadi: `Mongoose'da: await Post.find()` (dvigatel `.mk-pair`, yorliq texnologiya rangida). Haqiqiy natija bilan (`matchedCount: 1`), taxmin emas.
2. Lug'at ekranida tushunchalar bilan birga BUYRUQLAR ham juft bo'ladi (create ↔ INSERT, find ↔ SELECT, updateOne ↔ UPDATE, deleteOne ↔ DELETE).
3. Farq bor joyda — tuzoq kartasi, faqat haqiqatan qoqiladigan joyda (Mongo'da `updateOne({})` bitta hujjat, PostgreSQL'da `WHERE`'siz `UPDATE` — hammasi).
4. Me'yor: bitta qator yoki bitta karta; alohida «Mongo ekrani» yoki har ekranda solishtiruv YO'Q — dars tanasi mavzu (M41), ko'prik faqat eslatma.
**Nega.** Foydalanuvchi ikkala PostgreSQL darsini ko'rib: «create database yoki insert into lar mongodbda bor, shu uchun postgresql'ga qo'shmaymizmi… insert into'larni mongodb bilan ko'rmadim». PG-1 tushunchalarni solishtirgan (collection, populate), buyruqlarni emas; PG-2 da Mongo 0 marta. Mentor yangi buyruqni tanish buyruq yoniga qo'yib tushunadi, yodlamaydi.
**Texnik.** PG-1: lug'at 4 qator (`DICT4`), 12-ekran `.mk-pair` ikki qator; PG-2 v2: 2-ekran ustun, 3/4/5-ekran `.mk-pair`, 9-ekran karta. Haqiqiy: `manba/drive-pg2-mongoose.sh` → `pg2-out/v2d-mongoose.txt` (Mongoose 9.11.4 · MongoDB 6.0.27). Mentor Mongoose'ni biladi (PG-1 qarori 31.10) — mongosh shakli ishlatilmaydi.

---

### M46 · Ovoz mentorni o'z kompyuterida yetaklaydi: qaysi loyiha, qaysi fayl va satr, qaysi terminal (04.11, F-1104-06 · F-1104-11)
**Qoida.**
1. Dars loyiha ustida bo'lsa, birinchi kod ko'rsatilgan joyda ovoz loyihani ochishni aytadi: «Telegraf va PostgreSQL darsidagi OrderBotNest papkasini VS Code'da oching.» Amaliyot ekrani (masalan 8-ekran) bunga kutilmaydi.
2. Kod ko'rsatilganda ovoz **papka → fayl → satr** aytadi: «src, api, telegram papkasidagi keyboards ts faylida, o'ttiz yettinchi satrdan». Funksiya nomining o'zi yetmaydi.
3. Terminal ko'rsatilganda ovoz **qaysi terminalda va qaysi buyruq** yozilganini aytadi («VS Code terminalida, OrderBotNest papkasida, npm test»); panelda `$ buyruq` qatori ko'rinadi, sarlavhasi «VS Code terminali · …».
**Nega.** Foydalanuvchi Jest-1 ni tinglab: «loyiha papkalari turibdi — Telegraf darsidagi botingizni oching deb ketaylik» · «file bir nima deyapti, ammo qanday holatda ko'rishimni tushunolmadim» · «gapirayotganda qayerdagi qaysi file — shularigacha aytsa, mentor yanada yaxshiroq tushunar edi». Ekranda Explorer turadi, lekin mentor ovozni eshitadi va o'z VS Code'iga qaraydi.
**Texnik.** MD ovozida papka/fayl/satr; dars bo'lagida `Term` default sarlavhasi «VS Code terminali · <loyiha>», chiqish `$ ` qatoridan (`out(k, outFind(k, /^\$ /))`). Tekshiruv: kod ekranlari ovozida «faylida» yoki «papkasidagi» (grep), terminal ekranlarida «terminal».

### M47 · Xato chiqqan ekranning o'zida sababi bir gapda aytiladi; chuqur tushuntirish — keyingi ekranda, ko'rinadigan solishtirish bilan (04.11, F-1104-07 · F-1104-09)
**Qoida.**
1. FAIL yoki xato ko'rsatilgan ekranning oxirgi segmenti sababni **bir gapda** aytadi («Demak, sabab bitta joyda: bo'sh joy ikki matnda har xil belgi»). Mentor sababni bilmasdan keyingi ekranga o'tmaydi.
2. Keyingi «ichida» ekrani sababni **ko'rinadigan solishtirish** bilan ochadi: ikki tomon yonma-yon (Expected ↔ Received belgilari, etalon manbasi ↔ funksiya natijasi), bittalab paydo bo'ladi, mos joy yashil, farq katta qizil. Matnli ro'yxat yoki bitta karta emas.
3. Nima solishtirilayotgani ovozda aniq: «Jest sonni emas, ikki matnni solishtiradi».
**Nega.** Foydalanuvchi: «120000 bilan 120 000 ni solishtirdimi?» — 6-ekran xatoni ko'rsatib, sababni keyinga qoldirgan edi; 7-ekrandagi belgilar kartasi kichik va Expected bilan yonma-yon emasdi. «Xato chiqqanida darhol nimadan chiqqanini anglab davom etsam, dars tushunarli bo'lardi.» 10-ekran (etalon koddan) — «jarayon yetib kelmadi».
**Texnik.** Jest-1: `Compare7` (ikki qator, 380 ms qadam, `.cmp-c.big`), `Flow10` (som → etalonlar → hukm, «yashil — lekin yolg'on»). Qolgan darslarda — har qayta yozishda.

### M48 · Variant uzunligi javobni ochmaydi: to'g'ri javob eng uzun ham, eng qisqa ham bo'lib qolmaydi (04.11, F-1104-17)
**Qoida.**
1. Har tekshiruv va yakuniy sinov savolida xato variantlar ham to'g'risi kabi to'liq: natija **va o'z sababi** («PASS — Jest `test/` papkasini o'zi qidiradi»). «FAIL», «Emoji», «Jest eskirgan» kabi bir so'zli variant yo'q.
2. Darsda to'g'ri javob **yagona eng uzun** bo'lgan savollar ≤ ¼, **yagona eng qisqa** bo'lganlar ham ≤ ¼ (11 savol → har biri ≤ 2).
3. Variantlarni tekislaganda to'g'ri javobning o'rni (1/2/3/4) va «Xato izohlari» raqamlari o'zgarmaydi.
**Nega.** Foydalanuvchi Jest-1 yakuniy sinovida: «eng katta xato — to'g'ri javob eng uzuni bo'lib qopti». O'lchov (04.11): 12 dars, 132 savol — to'g'risi eng uzun 97 tasida (Jest-1 10/11, PG-2 10/11, TgPg 10/11, Nest-2 8/11…). Mentor javobni bilmasa ham eng uzun variantni tanlab o'tadi — sinov hech narsani o'lchamaydi. Tekislashning birinchi urinishida teskari belgi chiqdi (to'g'risi eng qisqa 5/11) — shuning uchun ikkala chegara.
**Texnik.** `python3 dev/javob-uzunlik.py src/mentor-kurs/<dars>` (MDT yoki Nest bo'laklari); MD-generatorlarda (`jest1-matn.py` dan boshlab) shu tekshiruv ichida — me'yordan oshsa generator to'xtaydi.

### M49 · Ovozda belgi va kod haqiqiy nomi bilan: `\` — backslash, «m4-03» — «em to'rt, nol uch» (09.11, F-1109-01 · F-1109-02 · F-1109-03)
**Qoida.**
1. Kod belgisi ovozda dasturchilar aytadigan nomi bilan: `\` — «backslash» (RU «бэкслеш»). Tarjima-ta'rif («teskari chiziqcha», «обратная косая черта») yozilmaydi. Inglizcha nomga o'zbekcha qo'shimcha qo'shilmaydi: «backslash'li» emas, «backslash bilan boshlanadigan».
2. O'quvchi darsi kodi (m4-03, m4a-03, m11-03) matnda raqam bilan qoladi; ovozga dvigateldagi `voice()` so'z bilan beradi: «em to'rt, nol uch». Aks holda o'zbekcha ovoz «0» ni «o» harfi deb o'qiydi.
3. Ekranda va «Matn»da kod o'zgarmaydi: «backslash c blog» → `\c blog` (SPOKEN, gap boshidagi «Backslash» ham).
**Nega.** Foydalanuvchi PG-1 ni ovoz bilan tinglab: «yotiq bir narsa chiziq dedi… o'zining inglizcha nomi bor, haqiqiyday aytaylik»; «08 ni nol emas o deb o'qigan».
**Texnik.** `parts/02-dvigatel.jsx`: `EN_PHRASES` ga `/\b[Bb]ackslash\b/` (platformada inglizcha talaffuz), `kodOvoz()` — faqat UZ. Ko'rik saytining edge-tts ovozi uchun `dev/tts-server.py` «backslash» ni «bekslesh» deb o'qitadi (mp3 xeshi o'zgarmaydi).

### M50 · Gapli karta o'rniga mexanizm chizmasi; xulosa qadamida rasm yashirilmaydi (10.11, F-1109-06)
**Qoida.**
1. Tushuntirish ekranining o'ng sahnasi mexanizmni chizadi: oqim, yo'lak, vaqt o'qi, holat sxemasi, jadval yoki terminal. Chap paneldagi gapni o'ngda kartaga qayta yozish («gapli karta») yo'q.
2. Xulosa (oxirgi) segmentida oldingi qadamlardagi hujjat, jadval va chizma yashirilmaydi: ular joyida qoladi, xulosa ularning ustida belgilanadi (kerakli qism yonadi, qolgani xiralashadi). «Orqaga» bilan qaytgan mentor ham bo'sh sahnani ko'rmaydi.
3. Chizmadagi har raqam, vaqt, pid, xabar va satr raqami `manba/*-out` yoki `*-ai/XULOSA.md` dan olinadi va shu ekrandagi terminal bilan bir xil bo'ladi. Dastur chiqishi qo'lda qayta yozilmaydi (`KOD.OUT` dan olinadi).
4. Chizma kartaning o'rnini egallaydi, ustiga qo'shilmaydi: blok soni oshmaydi. Ovoz va chap panel o'zgarmasa, yangi mp3 kerak emas.
5. Istisno: tekshiruv ekrani (M42), «Sinfga tayyorgarlik» (M41), bosib ochiladigan savollar, haqiqiy log yoki kod bilan to'la sahna, fayl daraxti (M1).
**Nega.** Mentor fidbeki: «vizualni yaxshilasak bo'ladimi». O'lchov (09.11): 12 dars, 331 ekran, tushuntirish ekranlarining 45 tasida sahna 30% dan kam. Uch naqsh topildi: A — gapli karta, B — xulosa qadamida rasm yo'qoladi, C — kichik, xira vaqt chizig'i. 49 ekran oldin/keyin ko'rildi: 34 tasi qabul qilindi, 15 tasi qoldirildi. 34 tasi darsga qo'yildi, foydalanuvchi har birini «Yaxshi» deb baholadi (10.11).
**Texnik.** Umumiy uslub `.z` — `parts/01-asos.jsx` (z-card, z-st, dim, hl, z-band); darsga xos CSS — `<dars>/parts/04-yordam.jsx`. Yordamchi komponent `const S<n> = mkS(...)` dan oldin yoziladi, xulosa segmenti `seg.v === 'sum'`. Har yozuv `t(uz, ru)`. Sahna ulushini o'lchash: `vizual-taklif-F-1109-06/olch.mjs` + `toldir.py` (o'ng sahna 447,62,811,580 @1280).

### M51 · Har darsga bitta rasm — dars davomida shu rasmga qaytiladi (20.11, F-1120-02)
**Qoida.**
1. Har darsning bitta asosiy rasmi bor: o'sha mavzuning mexanizmi (Nest-1 — Nest mashinasi: brauzer → Controller → Service, Module ro'yxati, Nest konteyneri). Muqovada, kirishda, tushuncha ekranlarida, «Buzamiz»da va yakunda aynan shu rasm ishlatiladi: joylashuv, rang va nomlar o'zgarmaydi, faqat holat o'zgaradi (yonadi, xiralashadi, buziladi).
2. Rasm ovoz bilan birga yuradi: har segment rasmning bitta qismini o'zgartiradi (so'rov yo'lakda siljiydi, bo'lak yonadi, rozetka bo'shaydi). Xulosa segmentida rasm yashirilmaydi (M50-2).
3. Rasm ostidagi qora satrda shu paytda bajarilayotgan kod satri turadi: `fayl:satr` + satrning o'zi; raqam shu darsdagi kod panelining raqami bilan bir xil (M10).
4. Muqova: chapda «Bu darsdan keyin siz» — 3 ta aniq natija, eslatmalar (ovoz, vaqt, kerakli dasturlar) bitta qisqa satrda; o'ngda darsning rasmi.
5. Bezak yo'q: dars ranglari (`T`, `PART`) va mavjud shakllar; yangi rang, gradient, emoji qo'shilmaydi. Rasm qat'iy o'lchamli qutida chiziladi va sahna eniga moslashadi (`N1Fit`), 1280×720 va 1920×1080 da tekshiriladi (M15).
**Nega.** Mentor fidbeki (20.11): «darslar vizualga qaramagan, qiziqarsiz». O'lchov: Nest-1 tushuncha ekranlarida sahna balandlikning 26–47 %i, DI ekrani ikki matnli karta bilan tugagan. Foydalanuvchi taklifni tasdiqladi («akkuratne, alvasti bo'lmasin») va natijani qabul qildi.
**Texnik.** Nest-1: `parts/02b-mashina.jsx` (NestMachine, N1Fit, DiMachine, Shelves, KitchenMap; CSS `useCssN1`). Boshqa darsda — o'z bo'lagida (`<dars>/parts/02b-…`), dvigatelga darsga xos rasm yozilmaydi. Ko'rik: artifact RGUTPShyxrRmmnVcNFviX9.

### M52 · «Buzamiz» ekranida mentor o'zi buzadi (20.11, F-1120-02)
**Qoida.**
1. «Buzamiz» ekranining 1-segmenti `act`: kodda o'chiriladigan so'z yonib turadi (`n1-act`, `data-act`), chap panelda ko'rsatma («… ustiga bosing — u … ro'yxatidan o'chadi»), ovoz nimani bosishni aytadi (M38). Bosilmaguncha keyingi segment boshlanmaydi.
2. Bosilgach kod, rasm va terminal birga buziladi; keyingi segment ovozi «o'chirdingiz / o'chdi» deydi (mentor o'zi qilgan ish).
3. Savol (`ask`) javobini oldindan ochmaydigan qilib: natija («404», «200», «yiqildi») rasmda ovoz aytgan qadamdan oldin ko'rinmaydi — o'rnida «?» yoki «…».
4. Xatoning har bo'lagi (qaysi klass · qaysi dependency · qaysi fayl, M18) raqam bilan terminal satriga va rasmdagi joyiga bog'lanadi (`marks` → `n1-p1…3`).
**Nega.** Taklif sahifasida foydalanuvchi tanlovi: «Mentor o'zi bosib buzsin» — mentor tinglovchi emas, ishtirokchi bo'ladi.
**Texnik.** Dvigatel: segment `act` → `waits_for` (button_click/step), `answerAsk(seg.id, 0)` sahnadan chaqiriladi (`useAct`). Ovoz hali yuklanayotganda bosilsa — javob eslab qolinadi, qo'lda o'tishga tushmaydi (20.11 tuzatish). Sinov vositalari (`ovoz-matnlar.mjs`, `til-tekshiruv.mjs`) `.n1-act` ni o'zi bosadi.

### M53 · Rasmdagi son va qatorlar ekran sarlavhasi va terminal natijasi bilan bir xil (21.11, F-1120-02)
**Qoida.**
1. Ekran sarlavhasi, ovoz yoki terminal son aytsa («to'rt ustun, to'rt mahsulot», «(4 rows)», «3 passed»), rasm ham aynan shu sonni ko'rsatadi: jadvalda shuncha ustun va qator, ro'yxatda shuncha bo'lak bor.
2. Rasmdagi qator qiymatlari shu ekran terminalidagi natijadan olinadi: tartibi, qiymati va ustunlari bir xil (M50-3).
3. Rasm jadvalning bir qismini ko'rsatsa (namuna), ekranda son da'vosi bo'lmaydi; da'vo bo'lsa — rasm to'liq ko'rsatadi. Qisqartirish faqat son aytilmagan ekranda mumkin (masalan, ROLLBACK yoki ERROR ekrani).
4. Qator ko'paysa, rasm ramkadan chiqmaydi: jadval joyi shu ekran uchun suriladi, boshqa ekranlardagi rasm o'zgarmaydi (piksel farqi 0 bilan tekshiriladi).
**Nega.** 21.11 jonli ko'rik: PG-2 3-ekran sarlavhasi «to'rt ustun, to'rt mahsulot», psql «(4 rows)», rasmda esa 3 ustun va 2 qator edi. Sinf-supurishda PG-2 6-ekran ham chiqdi: `ORDER BY id` «(3 rows)», rasmda 2 qator. Ikkalasi tuzatildi (commit 5d8bd5d3), foydalanuvchi qonunni tasdiqladi («ha»).
**Texnik.** PG-2: `CrudMachine` — `prods` (qatorlar) va `pcols` (ustun satri); 2 dan ko'p qatorda `shop · products` har qator uchun 20 px yuqoriga suriladi (`pg2/parts/04b-mashina.jsx`). Supurish: `grep -rnE "\([0-9]+ rows?\)'"` natijasini rasmga berilgan qatorlar soni bilan solishtirish.

### M54 · O'rnatiladigan vosita versiyasi buyruqda qotiriladi; isbot shu versiyani kutadi (25.11, F-1125-01)
**Qoida.**
1. Amaliyotda global yoki loyiha yaratuvchi vosita o'rnatilsa (`@nestjs/cli` va shu kabi), buyruqda **asosiy versiya qotiriladi**: `npm i -g @nestjs/cli@12`, `nest --version` emas — `@12` bilan. Versiyasiz `npm i -g <paket>` amaliyot qadamida yozilmaydi.
2. Isbot maydoni o'sha asosiy versiyani kutadi (`/^v?12\./`) va xato izohi sababni aytadi («buyruqdagi @12 tushib qolgan»). Isbot bitta aniq versiyaga (`12.0.15`) bog'lanmaydi.
3. Vosita savol bersa (`nest new`: paket menejeri, kuzatuv xizmati, AI agent fayllari, modul tizimi), javoblar **buyruqning o'zida bayroq bilan** beriladi va ovoz har javobni va nega shunday tanlanganini aytadi (M28). Mentor savolni ko'rib to'xtab qolmaydi.
4. Darsdagi har chiqish (fayllar, terminal satrlari, xato matni) **shu qotirilgan versiyada** haqiqiy yurgizishdan olinadi (M10). Dars yozishdan va har katta ko'rikdan oldin `npm view <paket> version` mahalliy `--version` bilan solishtiriladi; yangi asosiy versiya chiqqan bo'lsa — darsdagi holatlar unda qayta yurgiziladi va farqlar ro'yxati yoziladi.
5. Global vositaning eski versiyasi kompyuterda qoladi — yangisi `npx -y <paket>@<versiya>` bilan vaqtinchalik papkada sinaladi.
**Nega.** 25.11: Nest 12 27.08.2026 da chiqqan, Nest-1 esa Nest 11 da yozilgan edi (kompyuterdagi global CLI 11.0.10). 6-ekran isboti faqat `11.` ni qabul qilardi — yangi o'rnatgan mentor «Davom»ni ocha olmasdi. Standart javoblar bilan yaratilgan Nest 12 loyihasida (ESM + @nestjs/observe) dars kodi `error TS2307` berdi. Bayroqlar bilan (`-p npm --type cjs --no-observe --skip-skills`) esa darsning 16 holati Nest 11 bilan bir xil chiqdi. Topilma mentor Muhammadbobur slaydlaridagi «NestJS 12» ni npm'dan tekshirganda chiqdi.
**Texnik.** Sinov: `feedback/F-1125-01-nest1-kuchaytirish/nest12/` — `drive-nest12.sh` (asl `drive.sh`/`drive2.sh`/`drive3.sh` holatlari), `solishtir.py` (PID, vaqt, yo'l, stek tekislanadi), `pty-run.py` (interaktiv buyruqni yozib olish; soxta terminalga o'lcham **albatta** beriladi, aks holda `nest new` spinneri cheksiz aylanadi), `FARQLAR.md`. Supurish: `grep -rn "check: (v)" src/mentor-kurs` — versiya regex'i bor isbotlar; `grep -rnE "npm (i|install) -g [@a-z]"` — versiyasiz global o'rnatish.

### M55 · Mentor videodarslardan o'rgangan va darsni yolg'iz o'tadi: shaxsiy tajriba taxmin qilinmaydi (25.11, F-1125-01)
**Qoida.**
1. Kursdan oldingi bilim (Express, MongoDB/Mongoose, Telegraf) — «videodarslarda ko'rgansiz». «Yozgansiz · ishlagansiz · his qilgansiz» va o'tgan zamon «-ardingiz» faqat kursning o'zida bajarilgan ishga (oldingi dars, shu darsdagi amaliyot) ishora qilsa yoziladi. Usul haqida — hozirgi zamon: «Express'da buni qo'lda yozasiz».
2. Og'riq (katta fayl, jamoada to'qnashuv) ekranda ko'rsatiladi va aytiladi — mentor uni boshdan kechirgan deb taxmin qilinmaydi.
3. Kursda birinchi marta ishlatiladigan vosita (Postman yoki Thunder Client) birinchi amaliyotda tayyorlanadi — o'rnatish qadami va katakcha bilan; birinchi TypeScript darsida tip va class bitta misolda, haqiqiy kompilyator xatosi bilan.
**Nega.** Foydalanuvchi (25.11, Muhammadbobur slaydlari tahlilida): «Mentor expressni videodan organgan boladi … u darsni hechkim otib bermaydi». Supurish: 12 dars, 62 ta «shaxsiy tajriba» iborasi → haqiqiysi 7 ta (Nest-1 da 6, PG-1 da 1); qolgan 55 tasi kursning oldingi darsiga ishora yoki «tajriba = sinov». Korpus §MENTOR-VIDEO.
**Texnik.** Nest-1: 1, 2, 4 (tip + class, `src/misol.ts` — TS 6.0.3 da TS2322), 6 (4-qadam), 8, 14, 17, 22-ekran; PG-1: 1-ekran (MD → `dev/pg1-matn.py` → `ru-ajrat` → `ru-qur`).

### M56 · AI yozgan kod bloki — haqiqiy AI, mentor o'zi tekshiradi (25.11, F-1125-01)
**Qoida.**
1. AI kodi o'ylab topilmaydi: kamida ikki AI yurgiziladi — biri oddiy so'zlar bilan, biri mavzu tilida (Nest tilida) yozilgan topshiriq bilan; har biri alohida nusxada (darsning shu nuqtadagi loyihasi). Topshiriq matni darsda aynan ko'rsatiladi.
2. Tekshiruv ikki qismli: tuzilish (darsning o'z savollari — Nest-1 da fayllar · ro'yxatlar · logika Service'da · decorator'lar) va so'rov — odatiy so'rovlar + uchta kutilmagan: harfli id, bo'sh body, begona maydon. Natija haqiqiy serverdan (M10).
3. «Satrni bosing» tekshiruvi AI'ning haqiqiy satri bilan; tuzatish ham yurgizib ko'rilgan natija bilan. AI xato qilmasa — darsda shunday aytiladi.
4. AI misolining resursi darsning uyga vazifasi bilan to'qnashmaydi (Nest-1: uyga vazifa `users` → AI misoli `customers`).
5. Joyi — dars tanasi (M41: mentorning o'z ko'nikmasi), alohida bosqich; «O'quvchi darsini o'tish» bosqichida faqat bir gap bilan bog'lanadi.
**Nega.** Qayta qurilgan 8 darsda AI bloki bor edi, eng birinchi to'rttasida (Nest-1, Nest-2, PG-1, PG-2) deyarli yo'q, holbuki mos o'quvchi darslarining har birida AI qadami bor. Foydalanuvchi: «A — avval Nest-1», agentlarga «Ha», resurs — customers. Haqiqiy natija: har AI topshiriqda yozilmaganini o'tkazib yubordi (oddiy — ParseIntPipe, Nest tilida — kiruvchi ma'lumot tekshiruvi; ikki yurgizishda ham takror id `{ id, ...data }`).
**Texnik.** Nest-1 `parts/06b-ai.jsx` (ScreenAI6, ScreenLCAI) · manba `feedback/F-1125-01-nest1-kuchaytirish/ai-nest1/` (`00-promptlar.md`, `ai-tekshir.sh`, `A2-oddiy/`, `B2-nest/`, `*-tuzatilgan/`, `XULOSA.md`). Navbat: Nest-2, PG-1, PG-2 — foydalanuvchi Nest-1 ni ko'rib chiqqach.

## 3. Oldingi asos-qoidalar (29.10, audit №1–2)
- Bitta segment = bitta vizual o'zgarish; segment ≤ ~25 s (ElevenLabs).
- O'ylab ko'ring savoli (`ask`) — javobdan oldin ochilmaydi; natija keyingi segmentda.
- Har bosqichdan keyin amaliyot (4 ta) — isbot bilan; `passed = sinov ≥ 6 && amaliyotlar isbot bilan`.
- Ko'prik bo'limi: o'quvchi darsi xaritasi (blok → «siz nima deysiz»), qoqiladigan joylar, sinfdagi eng ko'p xato (baza ulanishi), vaqt rejasi, o'quvchi savollari. **(03.11, M41: endi faqat yakuniy «Sinfga tayyorgarlik» blokida, 2–3 ekran; dars tanasida emas.)**
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
| 19 | Ovoz va kalit iborada telegraf yo'q; «jim», «ko'prik», «bu kursda» 0; ovozda «psql» faqat buyruq sifatida (M32) | `node til-lint.mjs src/mentor-kurs` (mentor-* = 0) + ovoz matni ko'z bilan |
| 20 | Har tekshiruv to'g'ri javobi va har amaliyot oxirgi segmenti «Demak, …» bilan (M33) | `grep -c "Demak,"` MD'da |
| 21 | Tekshiruv boshidan ikki ustun, javobdan keyin hech narsa sakramaydi; «????» yo'q (M35) · «Boshqacha chiqdimi?» oyna, Esc yopadi (M34) · isbot maydoni yonadi (M37) | headless surat: javobdan oldin/keyin; oyna ochilgan surat |
| 22 | Generator yopilmagan « bilan to'xtamaydi — ovoz to'liq (M38) | `python3 dev/<dars>-matn.py` xatosiz |
| 23 | Kirishdan keyin poydevor tushuncha ko'zga ko'rsatilgan (M39) | MD 2-ekran, ko'z bilan |
| 24 | Chap panel: sarlavha xira 22px/600, kalit gap 22px/500 (uzun 19px), chip och va bo'linmaydi; yakuniy sinov savoli oddiy test bilan bir xil (M40) | 1920 surat: 24-ekran, tekshiruv, yakuniy sinov; `grep -E "mk-(title|key)\" style" src/mentor-kurs/*/parts src/mentor-kurs/parts` = 0 |
| 25 | Dars tanasida «o'quvchi darsida / o'quvchiga ayting» yo'q; tekshiruvlar mentor tushunchasini sinaydi; «Sinfga tayyorgarlik» 2–3 ekran (M41) | MD tana ekranlarida `o'quvchi` ≈ 0 (grep); tekshiruv savollari ko'z bilan |
| 26 | Har tekshiruvda material savoldan oldin, karta yo'q, bitta «Demak» (M42) | `grep -c "above="` = `grep -c "<MCRetry"` va `grep -c "demak="` dars bo'laklarida; 1920 surat javobdan oldin/keyin |
| 27 | Qaytganda «N-ekrandan davom etish» va «Boshidan boshlash»; davom — o'sha ekran, javoblar joyida (M44) | `grep -c useMentorSave` asosiy komponentda = 1; headless: 2 ekran o'tish → yangi sahifa → davom → o'sha ekran |
| 28 | Kod o'ralmaydi, kod/terminal sahnasi bitta ustun, natija kod tagida, demo-kod Prettier 80; tekshiruv paneli mazmuniga teng (M43) | `node dev/kod-prettier.mjs <bo'laklar>` — «uzun N → 0» yoki O'TKAZILDI ro'yxati ko'rilgan; 1920 va 1280 surat: kesilgan qator yo'q |
| 29 | Yangi buyruq birinchi chiqqan joyda tanish jufti bitta qatorda, haqiqiy natija bilan; lug'atda buyruq juftlari (M45) | `grep -c "mk-pair"` dars bo'laklarida ≥ 1 (tanish texnologiya bo'lsa); MD manbada haqiqiy yurgizish fayli |

| 30 | Birinchi kod ekranida loyihani ochish aytilgan; kod ekranlari ovozida papka · fayl · satr; terminal ekranlarida «qaysi terminal, qaysi buyruq» va `$` qatori (M46) | MD ovozlarida grep «faylida|papkasidagi», «terminal»; 1280 surat |
| 31 | Xato ekranining oxirgi segmentida sabab bir gapda; «ichida» ekranida yonma-yon ko'rinadigan solishtirish (M47) | MD ko'z bilan; surat |
| 32 | Ko'rikdan oldin hamma ovoz yasalgan (lokal kesh yoki statik mp3) — birinchi eshitishda kechikish yo'q (F-1104-10) | `node dev/ovoz-matnlar.mjs` + kesh/`ovoz-statik.py`: yangi 0 |
| 33 | `grep "ichkari\|qoqila\|keyingi ekranda\."` matn faylida = 0 (§MENTOR-JEST1-KORIK) | grep |
| 34 | To'g'ri javob yagona eng uzun ≤ ¼ va yagona eng qisqa ≤ ¼; xato variantda natija va sabab (M48) | `python3 dev/javob-uzunlik.py src/mentor-kurs/<dars>` — ✓ |
| 35 | Tushuntirish ekranining o'ng sahnasida mexanizm chizmasi, gapli karta yo'q; xulosa segmentida oldingi chizma yoki jadval ko'rinib turadi; chizmadagi raqamlar manba va shu ekran terminali bilan bir xil (M50) | 1280 surat har segmentda; raqamlar `manba/*-out` bilan grep |
| 36 | Darsning bitta rasmi muqova, kirish, tushuncha, «Buzamiz» va yakunda bir xil; bezak yo'q (M51) · «Buzamiz» 1-segmenti `act`, savol javobi oldindan ochilmaydi, xato bo'laklari raqamlangan (M52) | 1600 surat har segmentda; `grep -c "act:"` = «Buzamiz» ekranlari soni |
| 37 | Sarlavha, ovoz yoki terminal aytgan son rasmda ham bir xil: jadval ustunlari va qatorlari, qiymatlari terminaldagidek; qator qo'shilganda boshqa ekranlardagi rasm o'zgarmaydi (M53) | `(N rows)` / `N passed` grep ↔ rasm qatorlari; 1600 va 1280 surat; o'zgarmagan ekranlarda piksel farqi 0 |
| 38 | O'rnatish buyrug'ida asosiy versiya qotirilgan (`@12`), isbot shu versiyani kutadi; vosita savollari bayroq bilan javoblangan va ovozda sababi aytilgan; `npm view` natijasi darsdagi versiya bilan bir xil (M54) | `grep "check: (v)"` + `grep -E "npm (i\|install) -g"`; `npm view <paket> version`; isbot maydoniga eski va yangi versiya yozib ko'rish |
| 39 | Kursdan oldingi bilimga «videodarslarda ko'rgansiz»; «yozgansiz / his qilgansiz / -ardingiz» faqat kursdagi ishga ishora; birinchi ishlatiladigan vosita birinchi amaliyotda tayyorlanadi (M55) | korpus §MENTOR-VIDEO grep = 0 |
| 40 | AI bloki: ikki haqiqiy AI (oddiy va mavzu tilida topshiriq), tuzilish savollari + 3 kutilmagan so'rov haqiqiy serverda, «satrni bosing» AI'ning haqiqiy satri bilan, resurs uyga vazifa bilan to'qnashmaydi (M56) | manba papkasida `ai-tekshir.sh` natijalari; dars matnidagi raqamlar shu natijalar bilan bir xil |
---

## 5. Jurnal (qonun qo'shilishi)
- **2026-11-25 (2)** — **M55** (mentor videodarslardan o'rgangan: shaxsiy tajriba taxmin qilinmaydi) + **M56** (AI yozgan kod bloki — haqiqiy AI, mentor o'zi tekshiradi) + tekshiruv ro'yxati 39–40 (F-1125-01). Foydalanuvchi: T1–T9 «Qabul», AI bloki «A», resurs «customers», keyin «barchasiga ruxsat beraman». Korpus §MENTOR-VIDEO. Sinf-supurish: M55 — 12 dars (haqiqiysi Nest-1 va PG-1 da, tuzatildi); M56 — AI bloki yo'q 4 dars, Nest-1 qurildi, Nest-2 · PG-1 · PG-2 navbatda.
- **2026-11-25** — **M54** (o'rnatiladigan vosita versiyasi buyruqda qotiriladi; isbot shu versiyani kutadi; vosita savollari bayroq bilan) + tekshiruv ro'yxati 38-band (F-1125-01). Foydalanuvchi: «Ha shu taklifing maqul». Sinf-supurish (12 dars): versiyaga bog'langan isbot va versiyasiz global o'rnatish — faqat Nest-1 (1 joy), tuzatildi; Nest-2 va o'quvchi loyihasi (`IntroNestArxitechture`, CLI ^11, CommonJS) global CLI ishlatmaydi.
- **2026-11-21** — **M53** (rasmdagi son va qatorlar sarlavha va terminal bilan bir xil) + tekshiruv ro'yxati 37-band (F-1120-02). Foydalanuvchi: «ha». Sinf-supurish (12 dars rasmlari: CrudMachine, BlogDb, BotMap, FlowMini, NestMachine): son aytilgan 6 joy — PG-2 3 va 6 nomuvofiq edi, tuzatildi; Jest-1 2, 12, 25 («10 passed», «3 passed» — rasmda 3 status) va Jest-2 25 («25 passed») — `manba/jest1v2-out`, `jest2v2-out` bilan mos.
- **2026-11-20** — M51 (har darsga bitta rasm, muqova, bezaksiz) + M52 («Buzamiz»da mentor o'zi bosadi, `act`) + tekshiruv ro'yxati 36-band (F-1120-02). Sinf-supurish: qurilgan 12 dars — Nest-1 da bajarildi; qolgan 11 dars navbat bilan (DAVOM.md).
- **2026-11-10** — F-1109-06 (mentor fidbeki «vizualni yaxshilasak bo'ladimi»): **M50** (gapli karta o'rniga mexanizm chizmasi; xulosa qadamida rasm yashirilmaydi; raqamlar manbadan) + tekshiruv ro'yxati 35. Foydalanuvchi: «m50: Yoz». Sinf-supurish: 12 dars o'lchandi, 49 ekran ko'rildi → 34 almashtirildi (PG-1 1 · PG-2 5 · Jest-1 1 · Jest-2 4 · CI/CD-1 3 · CI/CD-2 4 · WS-1 3 · WS-2 6 · Webhook 6 · Nest-2 1), 15 istisno (5-band).
- **2026-11-04 (2)** — F-1104-15…18: **M48** (variant uzunligi javobni ochmaydi; `dev/javob-uzunlik.py`, generator ichida), tekshiruv ro'yxati 34; lug'at «da'vo → AI aytgan gap»; 5-bosqich kirishi (yangi ko'nikma — alohida segment).
- **2026-11-04** — Jest-1 v2 ovozli ko'rigi F-1104-02…14: **M46** (ovoz mentorni yetaklaydi: loyiha · papka/fayl/satr · terminal), **M47** (xato ekranida sabab darhol; ichida — yonma-yon solishtirish); tekshiruv ro'yxati 30–33; lug'at «qoqiladigan joylar → o'quvchilar xato qiladigan joylar» (sinf-supurish 5 dars, 21 joy); korpus §MENTOR-JEST1-KORIK.
- **2026-11-03 (5)** — M45 (tanish buyruq yonida — F-1103-09; foydalanuvchi: «insert into'larni mongodb bilan ko'rmadim… halol o'ylab nima to'g'ri bo'ladi» → 8 bandli reja tasdiqlandi: «tasdiqlayman, aniq, shoshilmasdan, halol») + tekshiruv 29-band. PG-1 3 joy qurildi, PG-2 v2 matniga 5 joy.
- **2026-11-03 (4)** — M43 (kod va natija ekranga sig'adi — F-1103-04 + F-1103-08; foydalanuvchi namuna sahifasida «Ha, 12 darsga yoy») + tekshiruv 28-band. Sinf-supurish: dvigatel 12/12; Prettier 7 blok (TgPg 4, PG-1 1, PG-2 1, Jest-2 1), o'tkazilgan — repo/indeks bloklari (Nest-2 hammasi, TGSVC_TS, LC21, ASANY…). Qolgan: PG-2 15-ekran (v2 qurilishida).
- **2026-11-03 (3)** — M44 (progress saqlovi — F-1103-06; foydalanuvchi: «saqlashni qilamiz, men ruxsat beraman») + tekshiruv 27-band. Sinf-supurish: dvigatel orqali 12/12 dars; headless sinov PG-1, Nest-1 (dev), Webhook (Vercel) — 3-ekrandan davom ✓, «Boshidan» ✓, xato 0. (M43 raqami «sahna ekranga sig'adi» nomzodi uchun band — F-1103-04.)
- **2026-11-03 (2)** — M41 (avval mentor o'rganadi — F-1103-03; foydalanuvchi: «Ha, PG-2 dan boshla») va M42 (tekshiruv ekrani A varianti — F-1103-02) + tekshiruv 25–26-band. Sinf-supurish: M42 ko'rinishi dvigatel orqali 12 darsga birdan; material (`above`) va «Demak» — har darsning M41 qayta yozuvida.
- **2026-11-03** — M40 (chap panel matni gapga mos — F-1102-22; foydalanuvchi uch variantdan A ni tanladi) + tekshiruv 24-band. Sinf-supurish: dvigatel 12 darsga birdan; yakuniy sinov bo'lagidagi inline o'lcham 12/12 darsda olib tashlandi (foydalanuvchi tasdig'i bilan).
- **2026-11-02** — PG-1 ni foydalanuvchi ovozi bilan to'liq ko'rdi (F-1102-10…21): M32 (to'liq gap, taqiq so'zlar, psql), M33 («Demak, …»), M34 (yordam oynasi; M26-1 o'rniga), M35 (tekshiruv boshidan ikki ustun; M29 o'rniga), M36 (eski satr qizil), M37 (isbot yonadi), M38 (ovoz kesilmaydi; generator himoyasi), M39 (poydevor tushuncha boshida) + tekshiruv 19–23-band. Sinf-supurish: qurilgan 12 dars — so'zlar (jim 22 fayl, ko'prik 28 fayl, bu kursda 2, psql 3 dars) va generator (6 joy) hammasida; dvigatel (M34–M37) 12 darsga birdan; M32-1/M33/M39 — PG-1 da, qolgan 11 dars har birining ko'rigida.
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
