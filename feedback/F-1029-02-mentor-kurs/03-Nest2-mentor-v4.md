# Mentor kursi · Nest-2 «O'quvchi reposi: bitta resurs, Guard va sinfdagi xatolar» — MD v4

F-ID: F-1031-01 · Sana: 2026-10-31 · Holat: **KO'RIKDA** ([GATE M] kutilmoqda) · Fidbek: qator yoniga `>> …`
Oldingi versiya: `02-Nest2-mentor-v3.md` (45 ekran) — audit `AUDIT-Nest2-MD-2026-10-31.md` (35 band) natijasida qayta tuzildi.
Fayl (quriladi): `src/mentor-kurs/NestRepoMentorLesson.jsx` · bo'laklar `src/mentor-kurs/nest2/parts/` · dvigatel — umumiy `src/mentor-kurs/parts/01–02` (PRD §9-1)
Qonun: `MENTOR_DARS_ETALON.md` M1–M24 · Haqiqiy chiqishlar: `manba/nest2-out/` (skriptlar `drive-nest2.sh`, `drive-nest2-extra.sh`, `drive-nest2-extra2.sh`)

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | Nest-1 ni o'tgan mentor: cars-api'ni noldan qurgan, Module · Controller · Service · DI va Nest xatolarini o'qishni biladi. Entity, DTO, Repository, BaseService, Guard'ni kodi bilan ko'rmagan. |
| Dars oxirida mentor | 1) o'quvchi reposini o'zida bazasi bilan ishga tushiradi · 2) unga car resursini 5 qatlamda o'zi qo'shadi · 3) 401 va 403 ni ajratadi, superadmin va admin farqini biladi · 4) sinfda chiqadigan xatolarni xabaridan taniydi · 5) m4a-03 va m4a-04 ni o'tishni, ulardagi **3 ta xatoni** va uyga vazifalarni tekshirishni biladi |
| O'quvchi darslari | **m4a-03** «Birinchi resursni qo'lda qo'shish — mashinalar» (22 ekran) · **m4a-04** «Praktika — KitobShop backend» (9 ekran). Oldingi: m4a-01 (clone, Swagger). |
| Kursdagi o'rni | Mentor darsi 3 (Nest-1) → **4 (shu)** → 5 (Jest-1) |
| Til | O'zbekcha, adabiy, «siz». Atama inglizcha (M9: route · dependency · inject · decorator · instance · logika · Explorer · terminal). Ovozda kod o'qilmaydi — nima bo'layotgani aytiladi. O'quvchi metaforalari faqat 25-ekranda. |
| Misol-ip | **Bitta resurs — `car`** (o'quvchi m4a-03 dagi: `brand · model · price · is_available`). Dars bo'yi shu resurs yoziladi, so'raladi, himoya qilinadi va buziladi. Loyihadagi `admin` — faqat yonida namuna. |
| «5 qatlam» (bitta ro'yxat) | **Entity · DTO · Service · Controller · Module.** Repository — Service ichida (TypeORM beradi), BaseService — Service'ning poydevori. Fayllar: 6 (DTO ikkita) + `core/index.ts` + `AppModule` satri. O'quvchi darsi «5 fayl» deydi (DTO'ni bitta sanaydi). |
| Repo holati (qaror 1a) | Repo o'zgartirilmaydi: `server runnig onn port`, `Admin not fount`, `incorect`, filtrdagi `Danggg` — darsda «shunday chiqadi, xato emas» deb aytiladi. |
| O'quvchi darslaridagi xatolar | Mentor darsida **ochiq aytiladi** (24, 26-ekran); o'quvchi darslarini tuzatish — alohida ish, oxirgi bo'limda ro'yxat (qaror kutilmoqda). |
| Haqiqiylik (M10) | Har terminal satri, javob va xato — 31.10.2026 yurgizishdan (Node 24.18 · Nest 11.1 · TypeORM 1.0 · PostgreSQL 17, alohida `nest2_mentor` bazasi). Har ekranda «Manba» qatori. Ekrandagi `.env` paroli — `password` (namunadagidek). |
| Hajm | **29 ekran** (31.10, F-1031-09: o'quvchi uyga vazifasini tekshirish ekrani olib tashlandi — mentor tekshirmaydi, support mentor tekshiradi) · 6 bosqich · 4 amaliyot · 4 tekshiruv · 8 savollik sinov · ovoz ≈ 35 daqiqa (o'lchandi: 3443 so'z + yakun) · amaliyotlar ≈ 35–45 daqiqa · **jami ≈ 1 soat 20 daqiqa** |
| Me'yor | Har `Lesson` ≤ 5 segment, segment ovozi ≤ 60 so'z; 1-gap — ko'prik (M17), oxirgisi — «Xulosa» (M5) |

---

## A. Darsning tayanchi

**Tushunchalar (bir ma'no — bir so'z):**
- **resurs** — ilova boshqaradigan bir tur ma'lumot (admin, mashina, kitob); 5 qatlam.
- **Entity** — bazadagi jadval shakli: klass = jadval, `@Column` = ustun. `BaseEntity`dan meros: `id` (uuid), `created_at`, `updated_at`.
- **synchronize** — dev rejimida (`NODE_ENV=dev`) server har ishga tushganda bazani Entity'ga moslaydi: jadval o'zi yaratiladi, Entity o'zgarsa baza ham so'ramasdan o'zgaradi.
- **DTO** — kiruvchi ma'lumot shakli va qoidalari. `PartialType` — hamma maydon ixtiyoriy nusxa (PATCH).
- **ValidationPipe** — DTO qoidalarini tekshiradi; bu loyihada global, DTO'da yo'q maydon ham **400**.
- **Repository** — bitta jadval bilan ishlash metodlari; TypeORM beradi: modulda `forFeature([Entity])` ↔ Service'da `@InjectRepository(Entity)` — juft.
- **BaseService** — yetti tayyor CRUD metodi; yangi Service undan meros oladi, `super(repo)` bilan jadvalni beradi.
- **javob shakli** — muvaffaqiyat `{ statusCode, message: 'success', data }` (`successRes`), xato `{ statusCode, error: { message } }` (`AllExceptionFilter`); oddiy `Error` → 500.
- **global prefiks** — hamma route `/api/v1/…`.
- **Guard** — Controller'dan oldingi tekshiruv. `AuthGuard` → token yo'q/yaroqsiz **401**; `RolesGuard` → rol `@Roles(...)` ro'yxatida yo'q **403**. `'public'` — ikkalasi o'tkazadi; `@Roles` yozilmagan — token kerak, rol tekshirilmaydi.
- **superAdmin va admin — har xil rol** — ikki xil rol so'zi; `@Roles('admin')` eshigiga superadmin ham 403.

**Darsning ipi:** car resursi bitta so'rovning to'liq yo'lida: brauzer → `/api/v1` → (Guard) → ValidationPipe (DTO) → Controller → Service (BaseService) → Repository → jadval (Entity) → javob shakli. Vizual — Nest-1 ranglari (Controller ko'k · Service yashil · Module sariq) + Entity binafsha · DTO to'q sariq · Guard qizil. 8–12-ekranlarda tepada 5 qatlam yo'li turadi, hozirgi qatlam yonadi.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | Loyiha xaritasi va ishga tushirish | Lesson | 1 · ishga tushirish |
| 3 | Swagger | Lesson | 1 |
| 4 | Amaliyot 1 — o'zingizda ishga tushiring | Practice | 1 |
| 5 | Farqlar: server joyi, prefiks, javob shakli | Lesson | 2 · farqlar |
| 6 | Farqlar: `.env`, config va ikki tuzoq | Lesson | 2 |
| 7 | Tekshiruv 1 — «`/admin` ochdim, 404» | MCRetry | 2 |
| 8 | 1-qatlam: Entity | Lesson | 3 · resurs |
| 9 | 2-qatlam: DTO va ValidationPipe | Lesson | 3 |
| 10 | BaseService | Lesson | 3 |
| 11 | 3-qatlam: Service va Repository | Lesson | 3 |
| 12 | 4–5-qatlam: Controller, Module, AppModule | Lesson | 3 |
| 13 | Haqiqiy so'rovlar | Lesson | 3 |
| 14 | Tekshiruv 2 — qaysi satr boshqa qatlamniki | LineCheck | 3 |
| 15 | Amaliyot 2 — car resursini qo'shing | Practice | 3 |
| 16 | AuthGuard va token | Lesson | 4 · Guard |
| 17 | RolesGuard: 403, superadmin va admin — har xil rol | Lesson | 4 |
| 18 | Tekshiruv 3 — superadmin bilan 403 | MCRetry | 4 |
| 19 | Amaliyot 3 — signin, Authorize, oddiy admin | Practice | 4 |
| 20 | Buzamiz 1: `forFeature` yo'q | Lesson | 5 · buzamiz |
| 21 | Buzamiz 2: Entity o'zgardi — baza o'zgardi | Lesson | 5 |
| 22 | Tekshiruv 4 — o'quvchi KitobShop'idagi xato | MCRetry | 5 |
| 23 | Amaliyot 4 — o'zingiz buzing | Practice | 5 |
| 24 | m4a-03 va undagi `/car` xatosi | Lesson | 6 · ko'prik |
| 25 | O'quvchi tili | Lesson | 6 |
| 26 | m4a-04 KitobShop va tayyorgarlik | Lesson | 6 |
| 27 | Sinfdagi 6 holat va o'quvchi savollari | Lesson | 6 |
| 28 | Uyga vazifalarni tekshirish | Lesson | 6 |
| 29 | O'z-sinov — 8 savol | Screen27 | — |
| 30 | Yakun | Screen28 | — |

**Explorer** (`root: 'IntroNestArxitechture'`): `src/main.ts` · `src/config/index.ts` · `src/api/app.module.ts` · `src/api/app.service.ts` · `src/api/admin/` (module · controller · service · dto ×3) · `src/api/auth/` · `src/core/index.ts` · `src/core/entity/Base.entity.ts` · `admin.entity.ts` · `src/core/repository/` · `src/common/guard/` · `src/common/decorator/` · `src/infrastructure/base/base.service.ts` · `src/infrastructure/exception/AllException.filter.ts` · `src/infrastructure/response/successRes.ts` · `.env.example` · `.env` (2-ekrandan). Car fayllari 8-ekrandan boshlab bittadan `fresh` bilan paydo bo'ladi: `core/entity/car.entity.ts` (8) · `api/car/dto/` (9) · `car.service.ts` (11) · `car.controller.ts`, `car.module.ts` (12).

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · NestJS` · Sarlavha: **Siz cars-api'ni qurdingiz. Endi o'quvchi reposi.**
- Sahna: chapda reja (6 bosqich, ovoz bilan yonadi); o'ngda natija — Swagger maketi: `GET /api/v1/car` ochiq, javob `{"statusCode":200,"message":"success","data":[…]}`.
- Reja: 01 Ishga tushirish · 02 cars-api'dan farqlar · 03 Resurs: 5 qatlam · 04 Guard va token · 05 Buzamiz · 06 O'quvchi darslariga ko'prik
1. **Nest-1 da loyihani noldan qurdingiz — o'quvchi esa tayyor loyihani clone qiladi**
   Ovoz: «Assalomu alaykum. Nest birinchi darsida siz cars api'ni bo'sh papkadan qurdingiz. O'quvchingiz esa noldan yozmaydi: u GitHub'dan tayyor loyihani clone qiladi. Bugun aynan shu loyihani ochamiz, unga bitta resurs qo'shamiz va sinfda chiqadigan xatolarni ko'ramiz.»
2. **Dars oxirida loyiha sizda ishlaydi va unga car resursini o'zingiz qo'shgan bo'lasiz**
   Ovoz: «Dars oxirida loyiha sizning kompyuteringizda bazasi bilan ishlaydi, unga o'zingiz car resursini qo'shgan bo'lasiz. Resursning beshta qatlamini bir marta, tartib bilan yozamiz.» · reja 01, 03
3. **Token va rollarni bilasiz: 401 va 403 nima uchun chiqishini ajratasiz**
   Ovoz: «Loyiha himoyasini ham bilasiz: token qayerdan keladi, to'rt yuz bir va to'rt yuz uch nima uchun chiqadi. O'quvchi darsining ikkinchi qismi aynan shunga tayanadi.» · reja 04
4. **O'quvchi darslaridagi uchta xatoni oldindan bilasiz — sinfda vaqt yo'qotmaysiz**
   Ovoz: «Va eng muhimi: o'quvchi darslarida uchta joy bor, ular sinfda albatta muammo beradi. Ularni oldindan bilib olasiz va sinfda vaqt yo'qotmaysiz.» · reja 05, 06
5. **Olti bosqich, to'rt amaliyot. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi**
   Ovoz: «Dars olti bosqichdan iborat, orasida to'rtta amaliyot bor, ularni o'z kompyuteringizda qilasiz. Shoshilmang: har ekranni boshidan eshitish va matnini o'qish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.»
- Manba: `nest2-out/11-cars-requests.txt` (GET /api/v1/car).

## 2 · Loyiha xaritasi va ishga tushirish  ← `Lesson`
- Kicker: `1-bosqich · ishga tushirish` · Sarlavha: **To'rt papka, to'rt buyruq, bitta fayl**
- Sahna: chapda katta Explorer (`FileTree big`): to'rt papka birma-bir ochiladi, yonida vazifa izohi; o'ngda terminal (haqiqiy satrlar, segment bilan to'ladi) va `.env` paneli (o'zgargan satrlar yashil).
1. **Loyiha `src`da 37 fayl, lekin hammasi to'rt papkada — har birining bitta vazifasi**
   Ovoz: «cars api'da yettita fayl edi, bu loyihaning src papkasida o'ttiz yettita. Qo'rqmang, hammasi to'rt papkada. api'da resurslar: Module, Controller, Service va DTO. core'da bazaning shakli, Entity'lar. common'da umumiy narsalar, Guard va decorator'lar. infrastructure'da poydevor: Base service, xato filtri, token.» · papkalar ochiladi
2. **`git clone` va `npm install`: loyiha va paketlar, bir daqiqacha**
   Ovoz: «Ishga tushirish uchun to'rt buyruq va bitta fayl kerak. Birinchi ikkitasi: git clone loyihani oladi, npm install paketlarni o'rnatadi, bir daqiqacha.» · terminal: `Cloning into 'IntroNestArxitechture'...` · `added 759 packages, and audited 760 packages in 16s`
3. **`.env` namunadan olinadi: parol, baza nomi va Superadmin bloki to'ldiriladi**
   Ovoz: «Keyin fayl: env. Loyihada namuna bor, env example, undan nusxa olinadi va uch joy to'ldiriladi: baza manzilidagi parol, o'zingizning PostgreSQL parolingiz; baza nomi, nestarxitechture; va Superadmin bloki, nom va kuchli parol. Superadmin bo'sh qolsa nima bo'lishini oltinchi ekranda ko'ramiz.» · `.env`: `DEV_DB_URL=postgres://postgres:password@localhost:5432/nestarxitechture` · `USER_NAME=superadmin` · `PASSWORD=Superadmin1!`
4. **`createdb` va `start:dev`: terminalda superadmin yaratildi va to'qqizta Mapped**
   Ovoz: «Uchinchi buyruq bazani yaratadi, to'rtinchisi serverni ishga tushiradi. Terminalni o'qing: bazaga ulandi, env'dagi superadmin bazaga yozildi, keyin to'qqizta Mapped satri, hammasi api v bir bilan boshlanadi. Oxirgi satr imlo xatosi bilan: server runnig onn port. Bu xato emas, loyihadagi matn shunday.»
   ```
   [Nest] LOG [NestFactory] Starting Nest application...
   [Nest] LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized
   [Nest] LOG [InstanceLoader] AdminModule dependencies initialized
   [Nest] LOG [RoutesResolver] AdminController {/api/v1/admin}:
   [Nest] LOG [RouterExplorer] Mapped {/api/v1/admin, POST} route
   …  (jami 9 ta Mapped)
   Super admin created successfully
   [Nest] LOG [NestApplication] Nest application successfully started
   server runnig onn port 3000
   ```
5. **Xulosa: to'rt buyruq va `.env`dagi uch joy; superadmin satri faqat birinchi safar chiqadi**
   Ovoz: «Xulosa: to'rt buyruq va env'dagi uch joy. Bir narsani yodda tuting: superadmin yaratilgani haqidagi satr faqat birinchi ishga tushirishda chiqadi. Keyingi safar superadmin bazada bor, satr chiqmaydi, bu normal.»
- Manba: `nest2-out/01-clone.log` (37 fayl), `02-npm-install.log`, `07-start-ok.log`; 2-ishga tushirishda satr yo'q — `11-cars-start.log`.

## 3 · Swagger  ← `Lesson`
- Kicker: `1-bosqich · Swagger` · Sarlavha: **Swagger: `localhost:3000/api/v1` — loyihaning menyusi**
- Sahna: `Browser` → `localhost:3000/api/v1`, Swagger maketi: `admin` bo'limi, 9 route (haqiqiy ro'yxat), qulf belgilari, «Authorize» tugmasi.
1. **Server ishlayapti — brauzerda `/api/v1`: Swagger sahifasi ochiladi**
   Ovoz: «Server ishlayapti. Brauzerda localhost uch ming, slesh api v bir ni ochamiz. Bu Swagger, loyihaning menyusi: o'quvchi m4a-01 darsida shu sahifani ko'rgan. Oddiy localhost uch ming ochilsa to'rt yuz to'rt chiqadi, sababini keyingi bosqichda ko'ramiz.»
2. **`admin` bo'limida 9 route: signin, token, signout va olti CRUD route**
   Ovoz: «admin bo'limida to'qqizta route: kirish uchun signin, token va signout, qolgan oltitasi adminlarni yaratish, ko'rish, o'zgartirish va o'chirish uchun.» · ro'yxat: `POST /api/v1/admin` · `GET /api/v1/admin` · `POST …/signin` · `POST …/token` · `POST …/signout` · `GET …/all/admin` · `GET …/{id}` · `PATCH …/{id}` · `DELETE …/{id}`
3. **Qulf — hujjatdagi belgi: `token` va `signout`da qulf yo'q, lekin ular ham token so'raydi**
   Ovoz: «Ba'zi qatorlarda qulf belgisi bor: bu route'ga token kerak, u Authorize tugmasi orqali beriladi. Lekin ehtiyot bo'ling: qulfni dasturchi qo'lda qo'yadi. token va signout'da qulf yo'q, ammo ular ham token so'raydi. Ishonchli manba qulf emas, Guard kodi, uni to'rtinchi bosqichda o'qiymiz.»
4. **Xulosa: Swagger'da route, kiruvchi shakl va javob ko'rinadi — o'quvchi uchun asosiy oyna**
   Ovoz: «Xulosa: Swagger'da hamma route, kiruvchi ma'lumot shakli va javob namunasi bor, Postman kerak emas. Endi o'zingiz shu holatga keling: birinchi amaliyot.»
- Manba: `nest2-out/06-requests.txt` (Swagger JSON route'lari); qulf — repo `admin.controller.ts` (`@ApiBearerAuth` 6 route'da, `token`/`signout`da yo'q); `10-roles.txt` (`POST /api/v1/admin/token` tokensiz → 401).

## 4 · Amaliyot 1 — o'zingizda ishga tushiring  ← `Practice`
- Kicker: `Amaliyot 1 / 4` · Eyebrow: `Hozir o'zingizda · 10–15 daqiqa` · Sarlavha: **O'quvchi reposini o'zingizda ishga tushiring** · `tableAt: 3`
1. **Endi siz: loyihani o'zingizda ishga tushirasiz — to'rt qadam**
   Ovoz: «Endi navbat sizga: loyihani o'z kompyuteringizda ishga tushirasiz. To'rt qadam, o'n-o'n besh daqiqa. Boshlashdan oldin PostgreSQL ishlab turganini tekshiring.»
2. **1–2-qadam: clone, install, `.env` — Superadmin blokini to'ldirmasdan ishga tushirmang**
   Ovoz: «Birinchi: clone va npm install. Ikkinchi: env example'dan env yarating va uch joyni to'ldiring. Superadmin blokini to'ldirmasdan serverni ishga tushirmang, keyin tuzatish qiyinroq.»
3. **3–4-qadam: baza, server, Swagger; isbot — `successfully started` satri sanasi bilan**
   Ovoz: «Uchinchi: bazani yarating va serverni ishga tushiring. To'rtinchi: brauzerda Swagger'ni oching. Isbot maydoniga terminaldagi successfully started satrini butunligicha, sanasi bilan nusxalang.»
4. **Boshqacha chiqsa — pastdagi «Boshqacha chiqdimi?» tugmasi; katakcha va isbotsiz Davom ochilmaydi**
   Ovoz: «Biror narsa boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing: sinfda ham aynan shu holatlar chiqadi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Clone va install | `git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git` · `cd IntroNestArxitechture` · `npm install` | `added … packages` |
  | 2 | `.env` | `cp .env.example .env` → `DEV_DB_URL` (parol, `nestarxitechture`) · `NODE_ENV=dev` · `USER_NAME`, `FULL_NAME`, `PHONE`, `PASSWORD` (kuchli: `Superadmin1!` kabi) | fayl saqlandi |
  | 3 | Baza va server | `createdb -U postgres nestarxitechture` · `npm run start:dev` | `Super admin created successfully` · 9 ta `Mapped {/api/v1/admin…}` · `server runnig onn port 3000` |
  | 4 | Swagger | brauzer: `localhost:3000/api/v1` | `admin` bo'limi, 9 route |
- Isbot: «Terminaldagi `Nest application successfully started` satri — sanasi bilan» · placeholder: «terminaldagi satrni shu yerga qo'ying» · KOD: `successfully started` + joriy yil.
- «Boshqacha chiqdi»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `Unable to connect to the database` + `ECONNREFUSED` / `password authentication failed` / `does not exist` | Nest-1 dagi baza xatolari: PostgreSQL ishlamayapti · parol noto'g'ri · baza yaratilmagan |
  | `Unable to connect to the database` + `getaddrinfo ENOTFOUND base` | `.env` umuman yo'q — 2-qadam |
  | `error TS2307: Cannot find module 'class-validator'` | `npm install` oxirigacha bormagan — qayta `npm install` |
  | `EADDRINUSE: address already in use :::3000` | Nest-1 dagi cars-api ochiq qolgan — uni yoping |
  | `Super admin created successfully` chiqmadi | superadmin bazada bor (ilgari ishga tushirgansiz) — normal; kira olmasangiz 6-ekran |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `nest2-out/03-no-class-validator.log`, `04-no-env.log`, `05-env-no-db.log`, `07-start-ok.log`, `15-port-busy-second.log`.

---

## 5 · Farqlar: server joyi, prefiks, javob shakli  ← `Lesson`
- Kicker: `2-bosqich · farqlar` · Sarlavha: **Uch farq: server boshqa faylda, manzil `/api/v1` bilan, javob bitta shaklda**
- Sahna: `Ide`: `src/main.ts` (3 satr) → `src/api/app.service.ts` (12–27, 46-satr); 2-segmentda ikki `Browser` kartasi; 3-segmentda ikki javob namunasi; 4-segmentda `AllException.filter.ts` kichik panel.
1. **`main.ts` uch satr — server `api/app.service.ts`dagi `Aplication.main()`da ishga tushadi**
   Ovoz: «Loyiha ishlayapti. Endi uni cars api bilan solishtiramiz, uchta farq bor. Birinchisi: main ts'da atigi uch satr, u faqat Aplication klassini chaqiradi. Server api papkasidagi app service ts'da ishga tushadi. Nomi Service, lekin bu Service emas, ichida Nest birinchi darsidagi create va listen.»
2. **Ikkinchi farq — global prefiks: har route oldiga `api/v1` o'zi qo'shiladi**
   Ovoz: «Ikkinchisi shu faylda: global prefiks, api v bir. Controller'da admin deb yozilgan, lekin manzil api v bir slesh admin. Shuning uchun slesh admin ochilsa to'rt yuz to'rt. To'g'ri manzilda to'rt yuz bir, ya'ni route bor, faqat token kerak.» · `GET /admin` → `{"statusCode":404,"error":{"message":"Cannot GET /admin"}}` · `GET /api/v1/admin` → `{"statusCode":401,"error":{"message":"Unauthorized"}}`
3. **Uchinchi farq — javob shakli: muvaffaqiyat `data` ichida, xato `error.message` ichida**
   Ovoz: «Uchinchisi: javob shakli. cars api'da Nest o'zining standart shaklini qaytarardi. Bu loyihada muvaffaqiyatli javob statusCode, message va data ko'rinishida, xato esa statusCode va error ichida message. Buni ikki fayl qiladi: successRes va global xato filtri.» · `{"statusCode":200,"message":"success","data":[…]}` ↔ `{"statusCode":404,"error":{"message":"not found"}}`
4. **Filtr oddiy xatoni 500 qiladi, sababini terminalga yozadi; `Danggg` satri — xato emas**
   Ovoz: «Filtr haqida yana ikki gap. HttpException oilasidan bo'lmagan har qanday xato besh yuz bo'ladi, Internal server error, haqiqiy sababi esa terminalga yoziladi. Terminalda har xatodan oldin Danggg degan so'z chiqadi: bu filtrdagi console log, xato emas.»
5. **Xulosa: 404 ko'rsangiz — avval `/api/v1`; 500 ko'rsangiz — terminalni o'qing**
   Ovoz: «Xulosa: bu loyihada to'rt yuz to'rt ko'rsangiz, avval manzilda api v bir bor-yo'qligini tekshiring. Besh yuz ko'rsangiz, sababni brauzerdan emas, terminaldan qidiring. O'quvchi app service'ni ochib Service qidirsa, server shu yerda yoqiladi deb ayting.»
- Manba: repo `src/main.ts`, `src/api/app.service.ts`, `src/infrastructure/exception/AllException.filter.ts`, `response/successRes.ts`; `nest2-out/06-requests.txt`, `08-auth-requests.txt`.

## 6 · Farqlar: `.env`, config va ikki tuzoq  ← `Lesson`
- Kicker: `2-bosqich · farqlar` · Sarlavha: **To'rtinchi farq: hamma sozlama `.env`dan — va ikki jim tuzoq**
- Sahna: `Ide`: `src/config/index.ts` (11–17, 26–31-satr) + `.env` paneli; 3-segmentda terminal (ikki holat), 4-segmentda psql va signin javobi; 5-segmentda qoida-karta.
1. **`config/index.ts` `.env`ni o'qiydi: port, baza, token kaliti, superadmin**
   Ovoz: «Ikkinchi ekranda env'ni to'ldirdik. Endi uni kim o'qishini ko'ramiz: config papkasidagi index ts. U env'dan port, baza manzili, token kaliti va superadmin ma'lumotlarini oladi. Loyihaning qolgan qismi env'ga emas, shu config'ga murojaat qiladi.»
2. **`NODE_ENV=dev` → dev bazasi va jadvallar o'zi yaratiladi; boshqa qiymat → prod bazasi**
   Ovoz: «Eng muhim qator: NODE ENV dev bo'lsa, dev baza manzili olinadi va synchronize yoqiladi, ya'ni TypeORM jadvallarni o'zi yaratadi. Boshqa har qanday qiymatda prod manzili olinadi va jadvallar yaratilmaydi.» · 11–17-satr
3. **`NODE_ENV` noto'g'ri: `does not exist` yoki `error in creating super admin` — sabab yashirin**
   Ovoz: «Sinab ko'rdik: NODE ENV prod bo'lsa va prod bazasi yo'q bo'lsa, server database does not exist deb yiqiladi. Prod bazasi bor, lekin bo'sh bo'lsa, xabar boshqa: error in creating super admin. Haqiqiy sabab, jadval yo'qligi, kod ichida yashirin. Ikkala holatda javob bitta: NODE ENV dev.»
   ```
   [Nest] ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...
   error: database "nest2_prod" does not exist          ← o'quvchida nomi db_prod
   ---
   InternalServerErrorException: error in creating super admin
   ```
4. **Jim tuzoq: superadmin bo'sh qolsa — bazada nomsiz superadmin; `.env`ni keyin to'ldirish yordam bermaydi**
   Ovoz: «Ikkinchi tuzoq jimroq. Superadmin bloki bo'sh qolsa, server xatosiz ishga tushadi va bazaga nomsiz superadmin yozadi. Keyin env to'ldirilsa ham yangisi yaratilmaydi: server superadmin bor deb hisoblaydi. Sinab ko'rdik: env'dagi nom bilan kirilsa to'rt yuz bir, Admin not fount.»
   psql: `username | role` → `ali | admin` · `  | superAdmin` (nomsiz) · `.env` to'ldirilgach qayta ishga tushirish: `Super admin created` — 0 marta · signin → `{"statusCode":401,"error":{"message":"Admin not fount"}}`
5. **Xulosa: o'quvchi kira olmasa — bo'sh superadmin satrini o'chirib, serverni qayta yoqing**
   Ovoz: «Xulosa: env'da NODE ENV dev bo'lsin va superadmin bloki to'liq bo'lsin. O'quvchi to'g'ri nom bilan kira olmasa va bazada nomsiz superadmin bo'lsa, o'sha satrni o'chiring va serverni qayta ishga tushiring. Sinab ko'rdik: superadmin env'dan yangidan yoziladi va signin ishlaydi.»
- Qoida-karta: `psql -U postgres -d nestarxitechture -c "DELETE FROM admins WHERE role='superAdmin';"` → `npm run start:dev` → `Super admin created successfully`.
- Manba: repo `src/config/index.ts`, `src/api/admin/admin.service.ts` (`onModuleInit`); `nest2-out/14-nodeenv-prod-no-db.log`, `14-nodeenv-prod-empty-db.log`, `06-first-start-blank-superadmin.log`, `06-requests.txt`; bo'sh superadmin → `.env` to'ldirildi → 401 `Admin not fount` → satr o'chirildi → `Super admin created successfully` → signin 201 — `27-superadmin-reset.txt`.

## 7 · Tekshiruv 1 — «`/admin` ochdim, 404»  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **O'quvchi: «Brauzerda `localhost:3000/admin` ochdim — 404». Birinchi nimani tekshirasiz?**
- Ovoz: «Farqlarni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. O'quvchi aytadi: brauzerda localhost uch ming slesh admin ochdim, to'rt yuz to'rt. Server ishlayapti, terminalda xato yo'q. Birinchi nimani tekshirasiz? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 `app.module.ts` — AdminModule `imports`da bormi · 2 Manzil — prefiks `/api/v1` tushib qolgan · 3 `.env` — PostgreSQL paroli to'g'rimi · 4 Swagger — Authorize bosilganmi
- To'g'ri (ovoz): «Manzil. Bu loyihada hamma route api v bir bilan boshlanadi. Slesh admin degan route yo'q, shuning uchun to'rt yuz to'rt va Cannot GET slesh admin. Terminalda Mapped satrlari api v bir slesh admin deb turibdi. To'g'ri manzilda to'rt yuz bir chiqadi, bu token masalasi.» · qisqa: «Prefiks: `/api/v1/admin`. Terminalda `Mapped {/api/v1/admin…}` — route bor, manzil noto'g'ri.»
- Xato izohlari: 1 — «Modul ulanmagan bo'lsa admin uchun Mapped satri bo'lmasdi; u bor.» · 3 — «Parol noto'g'ri bo'lsa server ishga tushmasdi: Unable to connect.» · 4 — «Token yo'q bo'lsa javob 401 bo'ladi, 404 emas.»
- Manba: `nest2-out/06-requests.txt`.

---

## 8 · 1-qatlam: Entity  ← `Lesson`
- Kicker: `3-bosqich · Entity` · Sarlavha: **car resursi, 1-qatlam: Entity — jadval shakli**
- Sahna: tepada 5 qatlam yo'li (`Entity → DTO → Service → Controller → Module`, 1 yonadi); `Ide`: `src/core/entity/car.entity.ts` `fresh`; o'ngda kichik panel «Loyihada: `admin.entity.ts`» va `Base.entity.ts`; 4-segmentda `src/core/index.ts`.
- Kod `car.entity.ts` (haqiqiy yurgizilgan):
  ```ts
  import { Column, Entity } from 'typeorm';
  import { BaseEntity } from './Base.entity';

  @Entity('cars')
  export class CarEntity extends BaseEntity {
    @Column()
    brand: string;

    @Column()
    model: string;

    @Column()
    price: number;

    @Column({ default: true })
    is_available: boolean;
  }
  ```
- Kod `Base.entity.ts` (repodan):
  ```ts
  export abstract class BaseEntity extends TypeOrmBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
  }
  ```
1. **Loyihaga bitta resurs qo'shamiz — o'quvchi m4a-03 dagi car, besh qatlam bilan**
   Ovoz: «Loyihani bilasiz. Endi unga bitta resurs qo'shamiz: mashinalar, car. Aynan o'quvchi m4a-03 darsida qiladigan ish, o'sha nomlar bilan. Resurs besh qatlam: Entity, DTO, Service, Controller va Module. Har qatlam yonida loyihadagi admin fayli namuna bo'lib turadi.» · yo'l, 1 yonadi
2. **Entity — jadval shakli: klass jadval, `@Column` yozilgan har maydon — ustun**
   Ovoz: «Birinchi qatlam Entity, core papkasida. Entity bazadagi jadvalning shakli: klass jadval, ustiga Column decorator'i yozilgan har maydon bitta ustun. SQL yozilmaydi: TypeORM jadvalni shu klassdan o'zi yaratadi.»
3. **`BaseEntity`dan meros — `id` (uuid) va ikki sana tekin; `id`ni qayta yozish xato**
   Ovoz: «Klass Base entity'dan meros oladi va undan uchta ustun tekin keladi: id, yaratilgan va o'zgartirilgan vaqt. id raqam emas, uuid, o'ttiz olti belgili matn. O'quvchi id ustunini qo'lda yozsa, bu takror: o'quvchi darsida aynan shu xato sifatida ko'rsatiladi.» · `Base.entity.ts` paneli
4. **To'rt o'z ustuni; yangi Entity `core/index.ts`ga ham yoziladi, aks holda topilmaydi**
   Ovoz: «O'z ustunlarimiz to'rtta: brand va model matn, price raqam, is available standart qiymati true. Va bitta loyiha qoidasi: core papkasidagi index ts hamma Entity'ni bir joydan beradi, yangi Entity shu yerga qo'shiladi. Qo'shilmasa, boshqa fayllar Car entity'ni topa olmaydi, TypeScript xato beradi.» · `core/index.ts`: `export * from './entity/car.entity';` · xato: `error TS2305: Module '"src/core"' has no exported member 'CarEntity'.`
5. **Xulosa: Entity — jadval shakli; jadvalning o'zi modul ulangach, server ishga tushganda paydo bo'ladi**
   Ovoz: «Xulosa: Entity jadval shakli, u core papkasida, Base entity'dan meros bilan. Bazada jadval hozircha yo'q: TypeORM uni server ishga tushganda, resurs moduli ulangandan keyin yaratadi. O'quvchi darsi Entity'ni javon chizmasi deydi.»
- Manba: `nest2-out/src-car/car.entity.ts`, `core-index.ts`, `25-ts-errors.txt` (c); repo `src/core/entity/Base.entity.ts`, `admin.entity.ts`.

## 9 · 2-qatlam: DTO va ValidationPipe  ← `Lesson`
- Kicker: `3-bosqich · DTO` · Sarlavha: **2-qatlam: DTO — kiruvchi ma'lumot qoidalari, 400 shu yerdan**
- Sahna: yo'l (2 yonadi); `Ide`: `src/api/car/dto/create-car.dto.ts` va `update-car.dto.ts` `fresh`; o'ngda Swagger «Example Value»: `{ "brand": "Chevrolet", "model": "Malibu", "price": 250, "is_available": true }`; 4-segmentda `app.service.ts` 18–24-satr paneli.
- Kod `create-car.dto.ts` (haqiqiy yurgizilgan):
  ```ts
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

  export class CreateCarDto {
    @ApiProperty({ example: 'Chevrolet' })
    @IsString()
    @IsNotEmpty()
    brand: string;

    @ApiProperty({ example: 'Malibu' })
    @IsString()
    @IsNotEmpty()
    model: string;

    @ApiProperty({ example: 250 })
    @IsNumber()
    price: number;

    @ApiPropertyOptional({ example: true })
    @IsBoolean()
    @IsOptional()
    is_available?: boolean;
  }
  ```
- Kod `update-car.dto.ts`:
  ```ts
  import { PartialType } from '@nestjs/swagger';
  import { CreateCarDto } from './create-car.dto';

  export class UpdateCarDto extends PartialType(CreateCarDto) {}
  ```
1. **Jadval shakli bor. DTO — so'rovdan keladigan ma'lumot shakli va qoidalari**
   Ovoz: «Jadval shakli tayyor. Ikkinchi qatlam so'rovdan keladigan ma'lumot: DTO. Entity bazadagi jadval, DTO esa so'rovdagi ma'lumot, ikkalasini adashtirmang. DTO'lar resurs papkasining ichidagi dto papkasida turadi.»
2. **Har maydonda qoida: `brand`, `model` — matn va bo'sh emas, `price` — raqam, `is_available` — ixtiyoriy**
   Ovoz: «Yaratish DTO'sida har maydon ustida qoida: brand va model matn bo'lsin va bo'sh bo'lmasin, price raqam bo'lsin, is available ixtiyoriy. Har maydonda yana bitta decorator bor, Swagger uchun misol: Swagger'dagi tayyor JSON shu misollardan yig'iladi.»
3. **O'zgartirish DTO'si — `PartialType`: o'sha maydonlar, hammasi ixtiyoriy**
   Ovoz: «O'zgartirish DTO'si bitta qator: Partial type, ya'ni yaratishdagi maydonlar, lekin hammasi ixtiyoriy, PATCH'da faqat o'zgargan maydon yuboriladi. Partial type nestjs swagger paketidan olinadi. Boshqa paketdan olinsa ham ishlaydi, lekin Swagger'da maydonlar yo'qoladi, buni sinab ko'rdik.»
4. **Qoidalarni global ValidationPipe tekshiradi: DTO'da yo'q maydon ham 400**
   Ovoz: «Qoidalarni kim tekshiradi? Loyihada global ValidationPipe yoqilgan. cars api'da bo'sh so'rov ikki yuz bir qaytargan edi; bu loyihada qoida buzilsa to'rt yuz, xabarda hamma buzilgan qoida sanaladi. Yana bir sozlama: DTO'da yo'q maydon kelsa ham to'rt yuz, property should not exist.» · `whitelist: true, forbidNonWhitelisted: true, transform: true`
5. **Xulosa: 400 ko'rsangiz — xabar DTO'dagi qaysi qoida buzilganini aytadi**
   Ovoz: «Xulosa: DTO ikki fayl, kiruvchi ma'lumot qoidalari faqat shu yerda. To'rt yuz ko'rsangiz, xabarni o'qing: qaysi maydon, qaysi qoida. Haqiqiy javoblarni o'n uchinchi ekranda ko'ramiz. O'quvchi darsi DTO'ni buyurtma anketasi deydi.»
- Manba: `nest2-out/src-car/dto/*.ts`; `26-mapped-types.txt` (`@nestjs/mapped-types` → Swagger'da `properties: {}`, PATCH 200); repo `src/api/app.service.ts:18–24`.

## 10 · BaseService  ← `Lesson`
- Kicker: `3-bosqich · Service` · Sarlavha: **BaseService — CRUD bir marta yozilgan, hamma resurs meros oladi**
- Sahna: yo'l (3 yonadi, xira); `Ide`: `src/infrastructure/base/base.service.ts` (metodlar segment bilan yoritiladi); o'ngda solishtiruv: Nest-1 `cars.service.ts` — 27 satr (massiv, findAll, findOne, create) ↔ bu loyihada Service'ning ish qismi — 8 satr.
- Kod (repodan, qisqartirilgan):
  ```ts
  export class BaseService<CreateDto, UpdateDto, Entity> {
    constructor(private readonly repository: Repository<any>) {}

    async create(dto: CreateDto): Promise<ISuccessRes> {
      let data = this.repository.create({ ...dto }) as any as Entity;
      data = await this.repository.save(data);
      return successRes(data, 201);
    }
    async findAll(options?) { … return successRes(data); }
    async findAllWithPagination(options?) { … }
    async findOneBy(options) { … }
    async findOneById(id: string, options?) {
      …
      if (!data) {
        throw new HttpException('not found', 404);
      }
      return successRes(data);
    }
    async update(id: string, dto: UpdateDto) { await this.findOneById(id); … }
    async remove(id: string) { await this.findOneById(id); … return successRes({}); }
  }
  ```
1. **Nest-1 da CRUD'ni o'zingiz yozgansiz — bu yerda u bir marta, BaseService'da yozilgan**
   Ovoz: «Uchinchi qatlam Service, lekin avval uning poydevori. Nest birinchi darsida findAll, findOne va create'ni o'zingiz yozgansiz. Bu loyihada ular bir marta, infrastructure papkasidagi Base service'da yozilgan va hamma resurs uchun ishlaydi.»
2. **Yetti metod: yaratish, ro'yxat (oddiy va sahifalab), bittasini topish (ikki usul), o'zgartirish, o'chirish**
   Ovoz: «Base service'da yettita metod: yaratish, oddiy va sahifalangan ro'yxat, bittasini topishning ikki usuli, o'zgartirish va o'chirish. Yozuv topilmasa hammasi bir xil javob beradi: to'rt yuz to'rt, not found.»
3. **Har metod javobni `successRes` bilan qaytaradi — beshinchi ekrandagi o'sha shakl**
   Ovoz: «Har metod javobni successRes orqali qaytaradi, beshinchi ekrandagi o'sha shakl: yaratishda statusCode ikki yuz bir, qolganida ikki yuz. Shuning uchun hamma resursning javobi bir xil ko'rinadi.»
4. **Xulosa: CRUD qayta yozilmaydi; o'ziga xos ish bo'lsa — faqat o'sha metod ustiga yoziladi**
   Ovoz: «Xulosa: yangi resursda CRUD qayta yozilmaydi, u Base service'dan meros. O'ziga xos ish kerak bo'lsa, masalan admin'da parolni shifrlash, faqat o'sha metod ustiga yoziladi. O'quvchi darsi Base service'ni tayyor retsept kitobi deydi.»
- Manba: repo `src/infrastructure/base/base.service.ts`, `response/successRes.ts`; Nest-1 `parts/05-s12-s17.jsx` (`CARS_SVC_LINES` — 27 satr).

## 11 · 3-qatlam: Service va Repository  ← `Lesson`
- Kicker: `3-bosqich · Service` · Sarlavha: **3-qatlam: Service — meros, Repository va `super`**
- Sahna: yo'l (3 yonadi); `Ide`: `src/api/car/car.service.ts` `fresh`; o'ngda DI sxemasi (Nest-1 dagi uch qadam): `forFeature([CarEntity])` → TypeORM Repository yasaydi → `@InjectRepository` konstruktorga beradi; 4-segmentda kichik panel «Loyihada: `admin.service.ts`» (konstruktor, 31–37-satr).
- Kod `car.service.ts` (haqiqiy yurgizilgan):
  ```ts
  import { Injectable } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { BaseService } from 'src/infrastructure/base/base.service';
  import { CarEntity } from 'src/core';
  import { CreateCarDto } from './dto/create-car.dto';
  import { UpdateCarDto } from './dto/update-car.dto';

  @Injectable()
  export class CarService extends BaseService<CreateCarDto, UpdateCarDto, CarEntity> {
    constructor(
      @InjectRepository(CarEntity) private readonly carRepo: Repository<CarEntity>,
    ) {
      super(carRepo);
    }
  }
  ```
1. **`CarService` — `@Injectable` va BaseService'dan meros: ish qismi sakkiz satr, metod yo'q**
   Ovoz: «Endi car service. Ustida Injectable, Nest birinchi darsidagidek. Klass Base service'dan meros oladi, uchta tip bilan: ikki DTO va Entity. Ish qismi sakkiz satr, birorta metod yozilmagan.»
2. **Konstruktorda Repository so'raladi va `super` orqali BaseService'ga beriladi**
   Ovoz: «Konstruktorda bitta dependency: shu jadvalning Repository'si, ya'ni bazaga yozish va o'qish metodlari. Keyingi qatorda u super orqali Base service'ga beriladi: endi yetti metod qaysi jadval bilan ishlashni biladi. super unutilsa, TypeScript kompilyatsiyada xato beradi.» · xato: `error TS2377: Constructors for derived classes must contain a 'super' call.`
3. **Repository'ni TypeORM yasaydi: modulda `forFeature` va Service'da `InjectRepository` — juft**
   Ovoz: «Repository'ni o'zingiz yozmaysiz, uni TypeORM yasaydi. Buning uchun ikki joy kerak va ular juft: resurs modulida forFeature, Service konstruktorida InjectRepository, ikkalasida ham o'sha Entity. Bu Nest birinchi darsidagi Dependency Injection, faqat instance'ni TypeORM beradi.» · DI sxemasi
4. **Loyihadagi namuna — `AdminService`: tuzilishi xuddi shu, ustiga parol va token ishi**
   Ovoz: «Yonidagi admin service ham xuddi shunday tuzilgan, faqat ishi ko'proq: parolni shifrlaydi, token beradi va server ishga tushganda superadmin yaratadi. Uning ham CRUD qismi Base service'dan keladi.»
5. **Xulosa: Service — meros, Repository va `super`; mashinaga xos logika bo'lsa — shu yerga**
   Ovoz: «Xulosa: Service uch narsa: Base service'dan meros, Repository va super. Mashinaga xos logika chiqsa, masalan chegirma, u shu yerga yoziladi, Controller'ga emas. O'quvchi kodida CRUD qaytadan yozilgan bo'lsa, ishlaydi, lekin ortiqcha: Base service bor deb ayting.»
- Manba: `nest2-out/src-car/car.service.ts`, `25-ts-errors.txt` (a); repo `src/api/admin/admin.service.ts:25–37`.

## 12 · 4–5-qatlam: Controller, Module, AppModule  ← `Lesson`
- Kicker: `3-bosqich · Controller · Module` · Sarlavha: **Controller, Module va AppModule — resurs tirik**
- Sahna: yo'l (4, keyin 5 yonadi); `Ide`: `src/api/car/car.controller.ts` `fresh` → `car.module.ts` `fresh` → `src/api/app.module.ts` (yashil `CarModule,` satri); 4-segmentda terminal va psql.
- Kod `car.controller.ts` (haqiqiy yurgizilgan):
  ```ts
  @Controller('car')
  export class CarController {
    constructor(private readonly carService: CarService) {}

    @Post()
    create(@Body() dto: CreateCarDto) {
      return this.carService.create(dto);
    }

    @Get()
    findAll() {
      return this.carService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.carService.findOneById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateCarDto) {
      return this.carService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.carService.remove(id);
    }
  }
  ```
- Kod `car.module.ts` va `app.module.ts` (o'zgargan joy):
  ```ts
  @Module({
    imports: [TypeOrmModule.forFeature([CarEntity])],
    controllers: [CarController],
    providers: [CarService],
  })
  export class CarModule {}

  // src/api/app.module.ts
    imports: [ …, AdminModule, AuthModule, CarModule ],
  ```
1. **Controller — besh route, har biri bitta satr: Service'ning mos metodini chaqiradi**
   Ovoz: «To'rtinchi qatlam Controller. Unda beshta route: yaratish, ro'yxat, bittasi, o'zgartirish va o'chirish. Har birining ichida bitta satr, Service'ning mos metodi chaqiriladi, logika yo'q. Bittasini topish metodi Base service'da findOneById deb ataladi, boshqa nom yozilsa TypeScript xato beradi.» · xato: `error TS2551: Property 'findOne' does not exist on type 'CarService'. Did you mean 'findOneBy'?`
2. **Kirish parametrining tipi DTO — ValidationPipe aynan shu klass qoidalarini tekshiradi**
   Ovoz: «Yaratish va o'zgartirish route'larida kirish parametrining tipi DTO. Bu shunchaki yozuv emas: ValidationPipe aynan shu klassning qoidalarini tekshiradi. Bu Controller'da Guard yo'q, demak hamma route tokensiz ochiq, o'quvchi darsida ham shunday.»
3. **Module — uch ro'yxat; keyin AppModule'ga ulanadi, aks holda route'lar yo'q**
   Ovoz: «Beshinchi qatlam Module, uchta ro'yxat: imports'da forFeature, controllers'da Controller, providers'da Service. Va oxirgi qadam bosh modul: app module'ning imports ro'yxatiga Car module. Bu unutilsa, server xatosiz ishga tushadi, lekin car route'lari bo'lmaydi.»
4. **Terminalda beshta Mapped, bazada `cars` jadvali — uni hech kim yaratmadi**
   Ovoz: «Saqlaymiz, server qayta yuklanadi. Terminalda Car controller va beshta Mapped satri. Bazaga qarasak, cars jadvali paydo bo'lgan: id uuid, to'rtta ustun va ikki sana. Uni hech kim yaratmadi, synchronize Entity'dan yasadi.»
   ```
   [Nest] LOG [InstanceLoader] CarModule dependencies initialized
   [Nest] LOG [RoutesResolver] CarController {/api/v1/car}:
   [Nest] LOG [RouterExplorer] Mapped {/api/v1/car, POST} route
   [Nest] LOG [RouterExplorer] Mapped {/api/v1/car, GET} route
   [Nest] LOG [RouterExplorer] Mapped {/api/v1/car/:id, GET} route
   [Nest] LOG [RouterExplorer] Mapped {/api/v1/car/:id, PATCH} route
   [Nest] LOG [RouterExplorer] Mapped {/api/v1/car/:id, DELETE} route
   ---  psql \d cars
   id           | uuid    | not null | uuid_generate_v4()
   created_at   | timestamp without time zone | not null | now()
   updated_at   | timestamp without time zone | not null | now()
   brand        | character varying | not null
   model        | character varying | not null
   price        | integer | not null
   is_available | boolean | not null | true
   ```
5. **Xulosa: 5 qatlam — 6 fayl, ustiga `core/index.ts` va AppModule'dagi bitta satr**
   Ovoz: «Xulosa: besh qatlam olti faylda, chunki DTO ikkita, va yana ikki tahrir: core index'dagi export va app module'dagi bitta satr. Terminalda car uchun Mapped bo'lmasa, birinchi ochadigan fayl app module. Endi so'rov yuboramiz.»
- Manba: `nest2-out/src-car/`, `11-cars-start.log`, `11-cars-requests.txt` (`\d cars`), `13-break-appmodule.txt` (Mapped 0, 404), `25-ts-errors.txt` (b).

## 13 · Haqiqiy so'rovlar  ← `Lesson`
- Kicker: `3-bosqich · so'rovlar` · Sarlavha: **So'rovlar: 201 · 200 · 400 — va `/car/1` nega 500** · `lockHint`: «Hamma so'rov tugmasini bosing»
- Sahna: Nest-1 S16 uslubi — bosiladigan so'rov kartalari (`REQS`), javoblar haqiqiy; 4-segmentda terminal satri va `ParseUUIDPipe` kichik paneli.
- Kartalar (haqiqiy, qisqartirilgan):
  | # | So'rov | Javob |
  |---|---|---|
  | r1 | `POST /api/v1/car` `{"brand":"Chevrolet","model":"Malibu","price":250}` | `201` · `{"statusCode":201,"message":"success","data":{"id":"efa80745-…","created_at":"…","updated_at":"…","brand":"Chevrolet","model":"Malibu","price":250,"is_available":true}}` |
  | r2 | `GET /api/v1/car` | `200` · `{"statusCode":200,"message":"success","data":[{…Malibu…},{…K5…}]}` (K5 — ikkinchi POST, `is_available:false`) |
  | r3 | `PATCH /api/v1/car/efa80745-…` `{"price":240}` | `200` · `price: 240`, `updated_at` yangilandi |
  | r4 | `DELETE /api/v1/car/efa80745-…` | `200` · `{"statusCode":200,"message":"success","data":{}}`; qayta GET → `404 not found` |
  | r5 | `POST /api/v1/car` `{}` · `{…,"color":"oq"}` · `{…,"price":"145"}` | `400` · `brand should not be empty, brand must be a string, model should not be empty, model must be a string, price must be a number conforming to the specified constraints` · `property color should not exist` · `price must be a number conforming to the specified constraints` |
  | r6 | `GET /api/v1/car/1` | `500` · `{"statusCode":500,"error":{"message":"Internal server error"}}`; terminal: `QueryFailedError: invalid input syntax for type uuid: "1"` |
1. **Resurs tirik: `POST` → 201, `id` uuid va sanalar o'zi qo'yildi**
   Ovoz: «Resurs tirik, Swagger'dan so'rov yuboramiz. Mashina qo'shamiz: ikki yuz bir va successRes shaklidagi javob. id uuid, is available true va ikki sana: bularni biz bermadik, ular Base entity'dan va standart qiymatdan.» · r1
2. **`GET` ro'yxat va bittasi, `PATCH` faqat narx, `DELETE` — bo'sh `data`**
   Ovoz: «GET ro'yxatni va bittasini qaytaradi, ikki yuz. PATCH bilan faqat narxni o'zgartiramiz: ikki yuz, qolgan maydonlar joyida. DELETE: ikki yuz va data bo'sh obyekt. O'chirilgan mashinani qayta so'rasangiz to'rt yuz to'rt.» · r2–r4
3. **Qoida buzilsa 400: bo'sh so'rov, ortiqcha maydon, qo'shtirnoqdagi raqam**
   Ovoz: «Endi qoidalarni buzamiz. Bo'sh so'rov: to'rt yuz va hamma buzilgan qoida. Ortiqcha color maydoni: to'rt yuz, property color should not exist. Narx qo'shtirnoq ichida: to'rt yuz, price must be a number. O'quvchi Swagger'dagi misolni o'zgartirganda qo'shtirnoqni ko'p qoldiradi.» · r5
4. **`/api/v1/car/1` → 500: id uuid; `ParseUUIDPipe` qo'shilsa — tushunarli 400**
   Ovoz: «Va o'quvchi odati: cars api'dagidek car slesh bir. Besh yuz. Terminalda sabab: invalid input syntax for type uuid, chunki id raqam emas. Controller'da id parametriga ParseUUIDPipe qo'shilsa, so'rov bazaga yetmaydi: to'rt yuz va tushunarli xabar, Validation failed, uuid is expected.» · r6 · panel: `findOne(@Param('id', ParseUUIDPipe) id: string)` → `{"statusCode":400,"error":{"message":"Validation failed (uuid is expected)"}}`
5. **Xulosa: muvaffaqiyat `data`da, xato `error.message`da; 500 bo'lsa — terminal**
   Ovoz: «Xulosa: muvaffaqiyat data ichida, xato error message ichida. To'rt yuz bo'lsa xabar DTO qoidasini aytadi, besh yuz bo'lsa sabab terminalda. Endi tugmalarni o'zingiz bosib, har javobni o'qing, keyin Davom ochiladi.»
- Manba: `nest2-out/11-cars-requests.txt` (r1–r6 va server log), `19-parseuuid.txt`.

## 14 · Tekshiruv 2 — qaysi satr boshqa qatlamniki  ← `LineCheck`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4 — qaysi satr xato?` · Sarlavha: **Bu Entity'da bitta satr boshqa qatlamniki**
- Shart (`task`): «Qoida: Entity jadval shaklini belgilaydi — har ustun `@Column` bilan. Tekshirish qoidalari (`@IsString`, `@IsNumber`…) DTO'da turadi. Bu Entity'da bitta satr DTO'niki. **O'sha satrni bosing.**»
- Ovoz (`q`): «Besh qatlamni ko'rdingiz, endi o'zingiz tekshiring. Ikkinchi tekshiruv. Qoidani eslang: Entity'da har ustun Column bilan, tekshirish qoidalari esa DTO'da. Ekrandagi Entity'da bitta satr DTO'niki. O'sha satrni bosing.»
- Fayl: `src/core/entity/car.entity.ts` (Explorer faol) — haqiqiy yurgizilgan buzuq nusxa:
  ```ts
   1  import { Column, Entity } from 'typeorm';
   2  import { IsNumber } from 'class-validator';
   3  import { BaseEntity } from './Base.entity';
   4
   5  @Entity('cars')
   6  export class CarEntity extends BaseEntity {
   7    @Column()
   8    brand: string;
   9
  10    @Column()
  11    model: string;
  12
  13    @IsNumber()                 ← xato satr
  14    price: number;
  15
  16    @Column({ default: true })
  17    is_available: boolean;
  18  }
  ```
- Tuzatilgan (`fixed`): 13-satr chizilgan, o'rniga yashil `@Column()`; 2-satr (import) chizilgan. `fixedExtra`: haqiqiy natija — `\d cars`: buzuq holatda `price` ustuni yo'q, tuzatilgach `price | integer | not null`.
- To'g'ri (ovoz, `ok`): «To'g'ri. O'n uchinchi satr IsNumber, bu tekshirish qoidasi, u DTO'ga tegishli. Bu xato jim ishlaydi, sinab ko'rdik: server xatosiz ishga tushadi, lekin synchronize price ustunini bazadan o'chiradi. POST ikki yuz bir qaytaradi, narx esa hech qayerda saqlanmaydi. Ekranda tuzatilgan holat: Entity'da Column.»
- Qisqa (`okShort`): «13-satr: `@IsNumber` — DTO qoidasi. Sinalgan: server ishga tushadi, `price` ustuni bazadan o'chadi, POST 201, narx yo'q. Tuzatildi: `@Column()`.»
- Maslahat (`hint`): «Bu satr Entity'ning o'z ishi: import, jadval nomi yoki ustun. Ustun yaratmaydigan, qiymatni tekshiradigan decorator'ni qidiring.»
- Manba: `nest2-out/23-entity-isnumber.txt` (`\d cars` — `price` yo'q; POST 201 javobida `price` yo'q; bazada faqat brand, model), `23b-entity-restored.log`.

## 15 · Amaliyot 2 — car resursini qo'shing  ← `Practice`
- Kicker: `Amaliyot 2 / 4` · Eyebrow: `Hozir o'zingizda · 20 daqiqa` · Sarlavha: **car resursini o'z loyihangizga qo'shing** · `tableAt: 4` · `code`: 6 fayl + 2 tahrir (har qadam ichida «Kodni ochish · fayl», «namuna — o'zingiz yozing»)
1. **Endi siz car resursini qo'shasiz — o'quvchining «Ochilish kuni», sinfdan oldin**
   Ovoz: «Endi navbat sizga: car resursini o'z loyihangizga qo'shasiz. Bu o'quvchi darsining Ochilish kuni, siz uni sinfdan oldin bir marta o'zingiz qilib ko'rasiz. Yigirma daqiqacha. Har qadamda Kodni ochish tugmasi bor: bu namuna, kodni o'zingiz yozing.»
2. **1–3-qadam: Entity va `core/index.ts`, ikki DTO, Service**
   Ovoz: «Birinchi: Entity va core index'ga export. Ikkinchi: ikki DTO. Uchinchi: Service, super'ni unutmang.»
3. **4–5-qadam: Controller, Module va AppModule — terminalda beshta Mapped**
   Ovoz: «To'rtinchi: Controller, beshta route. Beshinchi: Module va bosh modulga ulash. Terminalda beshta Mapped satrini ko'rsangiz, resurs tirik.»
4. **6-qadam: Swagger'da POST → 201; isbot — javobdagi `id`ning birinchi 8 belgisi**
   Ovoz: «Oltinchi: Swagger'da bitta mashina qo'shing, ikki yuz bir. Javobdagi id'ning birinchi sakkiz belgisini isbot maydoniga yozing. Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. Katakchalar va isbot bo'lmasa, Davom ochilmaydi.»
- Qadamlar:
  | # | Qadam | Fayl | Kutilgan |
  |---|---|---|---|
  | 1 | Entity | `src/core/entity/car.entity.ts` + `src/core/index.ts` (`export * from './entity/car.entity';`) | — |
  | 2 | DTO | `src/api/car/dto/create-car.dto.ts` · `update-car.dto.ts` | — |
  | 3 | Service | `src/api/car/car.service.ts` | — |
  | 4 | Controller | `src/api/car/car.controller.ts` | — |
  | 5 | Module | `src/api/car/car.module.ts` + `src/api/app.module.ts` → `imports: [..., CarModule]` | `CarController {/api/v1/car}` + 5 ta `Mapped` |
  | 6 | Swagger | `POST /api/v1/car` → `{"brand":"Chevrolet","model":"Malibu","price":250}` | `201` · `data.id` uuid |
- Isbot: «Javobdagi `data.id`ning birinchi 8 belgisi» · placeholder: «id'ning boshidan 8 belgi, defisgacha» · KOD: 8 ta hex belgi va ekrandagi namuna (`efa80745`) emas.
- «Boshqacha chiqdi» (hammasi haqiqiy matn):
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `error TS2305: Module '"src/core"' has no exported member 'CarEntity'.` | `core/index.ts`ga export yozilmagan (8-ekran) |
  | `error TS2377: Constructors for derived classes must contain a 'super' call.` | `super(carRepo)` yo'q (11-ekran) |
  | `error TS2551: Property 'findOne' does not exist on type 'CarService'. Did you mean 'findOneBy'?` | metod nomi `findOneById` (12-ekran) |
  | `Nest can't resolve dependencies of the CarService (?)` … `"CarEntityRepository"` | `car.module.ts`da `forFeature` yo'q (20-ekranda batafsil) |
  | Server ishladi, car uchun `Mapped` yo'q, `/api/v1/car` → `404 Cannot GET /api/v1/car` | `AppModule` imports'ida `CarModule` yo'q |
  | `400 price must be a number…` | JSON'da raqam qo'shtirnoq ichida |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `nest2-out/25-ts-errors.txt`, `12-break-forfeature.log`, `13-break-appmodule.txt`, `11-cars-requests.txt`.

---

## 16 · AuthGuard va token  ← `Lesson`
- Kicker: `4-bosqich · Guard` · Sarlavha: **AuthGuard: token bormi — yo'q bo'lsa 401**
- Sahna: so'rov yo'li sxemasi (Explorer'siz, M19 istisno): Brauzer → **AuthGuard** (qizil) → RolesGuard → Controller → Service, nuqta Guard'da to'xtaydi va «401» chiqadi; `Ide` kichik paneli: `src/common/guard/auth.guard.ts` va `admin.controller.ts` 31–32-satr (`@UseGuards(AuthGuard, RolesGuard)`).
- Kod `auth.guard.ts` (repodan, qisqartirilgan):
  ```ts
  canActivate(ctx: ExecutionContext): boolean {
    //  Agar route @Roles('public') bo'lsa — token talab qilinmaydi
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (roles?.includes('public')) return true;

    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers.authorization as string | undefined;
    if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException();

    const token = auth.slice(7);
    try {
      const payload = jwt.verify(token, config.Token.access_token_key);
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
  ```
1. **Car route'lari ochiq edi; admin route'lari himoyalangan — Controller'dan oldin Guard turadi**
   Ovoz: «Car route'larimiz tokensiz ochiq. Admin route'lari esa himoyalangan: tokensiz to'rt yuz bir. Buni Controller emas, undan oldin turgan Guard qiladi, qo'riqchi. Admin Controller ustida ikkita Guard ulangan: Auth guard va Roles guard. Birinchisidan boshlaymiz.» · sxema
2. **Nega `'public'`? Token signin'da beriladi — signin ham token so'rasa, hech kim kira olmasdi**
   Ovoz: «Auth guard avval route'dagi Roles belgisiga qaraydi: public bo'lsa, tekshirmasdan o'tkazadi. Nega signin'ga public qo'yilgan? Token aynan signin'da beriladi, kirishdan oldin hech kimda token yo'q. Signin ham token so'rasa, hech kim kira olmasdi. Shuning uchun bu to'g'ri qaror, xavfsizlik teshigi emas: kirish eshigi ochiq, qolgan eshiklar yopiq.»
   Sahna (F-1031-06): `admin.controller.ts` 46–53 (`@Roles('public')` yoritilgan, signin route'i) + karta «`'public'` — to'g'ri qaror: tokenni shu eshikdan olasiz. Qolgan eshiklar yopiq.»
3. **Aks holda `Authorization: Bearer` va yaroqli token kerak — bo'lmasa 401**
   Ovoz: «Qolgan route'larda so'rovda Authorization header'i bo'lishi kerak: Bearer so'zi va token. Header yo'q, token soxta yoki muddati o'tgan bo'lsa, to'rt yuz bir, Unauthorized. Token yaroqli bo'lsa, ichidagi id va rol so'rovga yoziladi, keyingi Guard shuni o'qiydi.»
4. **Token signin'da beriladi va 24 soat yashaydi; eskirsa — qayta signin**
   Ovoz: «Token signin'da beriladi va env'dagi sozlamaga ko'ra yigirma to'rt soat yashaydi. Muddati o'tsa nima qilinadi? Sinab ko'rdik: loyihadagi token yangilash route'i ham yaroqli token so'raydi, eskirgan token bilan to'rt yuz bir beradi. Demak yagona yo'l: qayta signin.»
   Haqiqiy (`Access_Token_Time=5s` bilan): 6 soniyadan keyin `GET /api/v1/admin/all/admin` → `401` · `POST /api/v1/admin/token` (cookie + eskirgan token) → `401` · yangi signin tokeni bilan → `201`
5. **Xulosa: 401 — «kim ekaningiz noma'lum»: signin qiling va tokenni Authorize'ga qo'ying**
   Ovoz: «Xulosa: to'rt yuz bir, kim ekaningiz noma'lum degani. Yechim kodda emas: signin qiling va tokenni Swagger'dagi Authorize oynasiga qo'ying. Endi ikkinchi qo'riqchi: token bor, lekin bu eshik sizga ochiqmi?»
- Manba: repo `src/common/guard/auth.guard.ts`, `src/api/admin/admin.controller.ts:31–58`, `.env.example` (`Access_Token_Time=24h`); `nest2-out/22-token-expiry.txt`, `06-requests.txt`.

## 17 · RolesGuard: 403, superadmin va admin — har xil rol  ← `Lesson`
- Kicker: `4-bosqich · Guard` · Sarlavha: **RolesGuard: token bor, lekin bu eshik sizga ochiqmi — yo'q bo'lsa 403**
- Sahna: `Ide`: `src/common/guard/roles.guard.ts` (19–30-satr) → `roles-decorator.ts`; o'ngda haqiqiy javoblar jadvali (3–4-segmentda yonadi); 5-segmentda qoida-karta.
- Kod `roles.guard.ts` (repodan):
  ```ts
  if (!roles || roles.includes('public') || roles.length === 0) {
    return true;
  }
  if (
    (req.user?.role && roles.includes(req.user.role)) ||
    (roles.includes('ID') && req.user?.id === req.params.id)
  ) {
    return true;
  }
  return false;
  ```
- Haqiqiy javoblar (sinov Controller'i: KitobShop playbook qoidalari bilan):
  | Eshik | Tokensiz | superadmin (`superAdmin`) | oddiy admin `ali` (`admin`) |
  |---|---|---|---|
  | `@Roles('admin')` POST | 401 | **403 Forbidden resource** | 201 |
  | `@Roles('public')` GET | 200 | 200 | 200 |
  | `@Roles` yozilmagan PATCH | 401 | 200 | 200 |
  | `@Roles(UserRole.ADMIN)` DELETE | — | **403** | 200 |
1. **`@Roles(...)` — route ustidagi rollar ro'yxati; Guard uni tokendagi rol bilan solishtiradi**
   Ovoz: «Ikkinchi qo'riqchi Roles guard. Har route ustida Roles decorator'i bilan rollar ro'yxati yoziladi. Guard shu ro'yxatni tokendagi rol bilan solishtiradi. Rol signin'da bazadan olinadi, mijoz uni o'zi o'zgartira olmaydi.»
2. **O'tadi: ro'yxat yo'q yoki `'public'` · rol ro'yxatda · `'ID'` va o'z yozuvi; qolgani 403**
   Ovoz: «Guard uch holatda o'tkazadi: ro'yxat yo'q yoki public bo'lsa; tokendagi rol ro'yxatda bo'lsa; ro'yxatda ID so'zi bo'lsa va foydalanuvchi o'z yozuvini so'rasa. Qolgan hamma holat to'rt yuz uch, Forbidden resource.»
3. **Muhim: `superAdmin` va `admin` — har xil rol — `@Roles('admin')` eshigiga superadmin ham 403 oladi**
   Ovoz: «Endi eng muhim gap, sinfda albatta chiqadi. Loyihada ikki rol bor, superadmin va admin, ular har xil so'z. Ro'yxatda faqat admin yozilgan eshikka superadmin kirsa ham to'rt yuz uch oladi. Sinab ko'rdik: superadmin tokeni bilan to'rt yuz uch, oddiy admin tokeni bilan ikki yuz bir.» · jadval 1-qator
4. **`@Roles` yozilmagan eshik — «tizimga kirganlar uchun»: token kerak, rol tekshirilmaydi**
   Ovoz: «Va yana bir holat: Roles umuman yozilmagan eshik. Auth guard token so'raydi, tokensiz to'rt yuz bir. Roles guard'da ro'yxat yo'q, u o'tkazadi. Demak bu eshik tizimga kirgan har kim uchun ochiq.» · jadval 3-qator
5. **Xulosa: 401 — token yo'q; 403 — rol ro'yxatda yo'q: ro'yxat va kirgan rolni yonma-yon qo'ying**
   Ovoz: «Xulosa: to'rt yuz bir, token yo'q yoki yaroqsiz; to'rt yuz uch, token bor, lekin rol ro'yxatda yo'q. O'quvchi to'rt yuz uch desa, ikki narsani yonma-yon qo'ying: route ustidagi Roles ro'yxati va u qaysi rol bilan kirgani.»
- Qoida-karta: `401` = AuthGuard (token) · `403` = RolesGuard (rol) · `'public'` = hamma · `@Roles` yo'q = tizimga kirganlar · `'ID'` = o'z yozuvi · `superAdmin` va `admin` — har xil rol.
- Manba: repo `src/common/guard/roles.guard.ts`, `roles-decorator.ts`, `src/common/enum/user-enum.ts`; `nest2-out/21-roles-superadmin.txt`, `10-roles.txt`.

## 18 · Tekshiruv 3 — superadmin bilan 403  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4`
- `above`: kod paneli `src/api/book/book.controller.ts` — `@UseGuards(AuthGuard, RolesGuard)` · `@Roles('admin')` `@Post()`; javob `{"statusCode":403,"error":{"message":"Forbidden resource"}}`
- Sarlavha: **O'quvchi: «KitobShop'da superadmin tokeni bilan kitob qo'shdim — 403». Sabab?**
- Ovoz: «Ikkala qo'riqchini bilasiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi KitobShop'da superadmin tokeni bilan kitob qo'shmoqchi, javob to'rt yuz uch. Ekranda route kodi va javob. Sabab nima? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 Token muddati o'tgan, qayta signin kerak · 2 Authorize bosilmagan, so'rovda token yo'q · 3 Ro'yxatda faqat `admin`, superadminning roli boshqa · 4 BookModule `AppModule`ga ulanmagan
- To'g'ri (ovoz): «Ro'yxatda faqat admin, superadminning roli esa superAdmin, boshqa so'z. Token yaroqli, shuning uchun to'rt yuz bir emas, to'rt yuz uch. Yechim: superadmin bilan oddiy admin yaratib, KitobShop'ni o'sha admin bilan sinash. Ekranda natija: oddiy admin tokeni bilan ikki yuz bir.» · qisqa: «`superAdmin` va `admin` — har xil rol. Token yaroqli → 403 (401 emas). Oddiy admin bilan → 201.»
- `after`: haqiqiy javob — `ali` (role `admin`) tokeni bilan `POST /api/v1/book` → `{"statusCode":201,"message":"success","data":{…"title":"Test kitob"…}}`
- Xato izohlari: 1 — «Token eskirgan bo'lsa Auth guard 401 berardi, 403 emas.» · 2 — «Token yo'q bo'lsa ham 401. 403 — token bor, rol ro'yxatda yo'q.» · 4 — «Modul ulanmagan bo'lsa route topilmaydi: 404.»
- Manba: `nest2-out/21-roles-superadmin.txt`.

## 19 · Amaliyot 3 — signin, Authorize, oddiy admin  ← `Practice`
- Kicker: `Amaliyot 3 / 4` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **Superadmin bilan kiring, oddiy admin yarating va farqni ko'ring** · `tableAt: 4`
1. **Endi siz: signin, Authorize va oddiy admin — KitobShop darsidan oldingi tayyorgarlik**
   Ovoz: «Endi navbat sizga. Bu amaliyot KitobShop darsidan oldin har o'quvchi qiladigan tayyorgarlik: superadmin bilan kirish, oddiy admin yaratish va farqni ko'rish. To'rt qadam, o'n daqiqacha.»
2. **1–2-qadam: superadmin bilan signin qiling, tokenni Authorize'ga qo'ying — adminlar ro'yxati 200 bilan ochiladi**
   Ovoz: «Birinchi: Swagger'da signin, env'dagi superadmin nomi va paroli bilan. Javobdagi tokenni qo'shtirnoqsiz nusxalang. Ikkinchi: tokenni Authorize oynasiga qo'ying va adminlar ro'yxatini so'rang: ikki yuz.»
3. **3-qadam: POST admin bilan oddiy admin yarating; isbot — uning `id`sidan 8 belgi**
   Ovoz: «Uchinchi: POST admin bilan oddiy admin yarating, paroli kuchli bo'lsin. Javob ikki yuz bir, yangi adminning roli admin. Uning id'sidan birinchi sakkiz belgini isbot maydoniga yozing.»
4. **4-qadam: yangi admin bilan kiring va POST admin qiling — 403 chiqishi kerak**
   Ovoz: «To'rtinchi: Authorize'dan chiqing, yangi admin bilan kiring va yana POST admin qiling: to'rt yuz uch, chunki admin yaratish faqat superadmin uchun. Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. Katakchalar va isbot bo'lmasa, Davom ochilmaydi.»
- Qadamlar (haqiqiy javoblar):
  | # | Qadam | Swagger | Kutilgan |
  |---|---|---|---|
  | 1 | Signin | `POST /api/v1/admin/signin` → `{"username":"<USER_NAME>","password":"<PASSWORD>"}` | HTTP `201` · body `{"statusCode":200,"message":"success","data":{"token":"eyJ…"}}` |
  | 2 | Authorize | token → «Authorize» → `GET /api/v1/admin/all/admin` | `200` · `data[0].role` = `superAdmin` |
  | 3 | Oddiy admin | `POST /api/v1/admin` → `{"username":"ali","phone_number":"+998901112233","full_name":"Ali Valiyev","password":"Developer1!"}` | `201` · `"role":"admin"` |
  | 4 | Farq | Logout → `ali` bilan signin → Authorize → `POST /api/v1/admin` | `403` · `{"statusCode":403,"error":{"message":"Forbidden resource"}}` |
- Isbot: «Yangi admin `id`sining birinchi 8 belgisi» · placeholder: «id'ning boshidan 8 belgi» · KOD: 8 ta hex.
- «Boshqacha chiqdi» (haqiqiy matnlar):
  | Chiqdi | Sabab va yechim |
  |---|---|
  | signin → `400 password is not strong enough` | yozilgan parol kuchsiz — `.env`dagi `PASSWORD`ni aynan yozing |
  | signin → `401 Admin not fount` | username `.env`dagi bilan bir xil emas (imlo repodan); yoki superadmin bo'sh yaratilgan — 6-ekrandagi yechim |
  | signin → `400 username or password incorect` | parol kuchli, lekin noto'g'ri (imlo repodan) |
  | `401 Unauthorized` | Authorize bosilmagan yoki token qo'shtirnoq bilan qo'yilgan |
  | POST admin → `400 Phone Number already exists` / `Username already exists` | shu telefon yoki nom band — boshqasini yozing |
  | Hech biri emas | skrinshot + javob — mentor-kurs Telegram guruhiga |
- Manba: `nest2-out/07-signin.txt`, `20-signin-wrong.txt`, `09-validation.txt`, `10-roles.txt`, `08-auth-requests.txt`, `27-superadmin-reset.txt`.

---

## 20 · Buzamiz 1: `forFeature` yo'q  ← `Lesson`
- Kicker: `5-bosqich · buzamiz 1` · Sarlavha: **`forFeature` o'chirildi — xabarni uch savol bilan o'qiymiz**
- Sahna: `Ide`: `src/api/car/car.module.ts` — buzilgan holat (`forFeature` satri chizilgan, `imports: []` yashil); terminal — qizil xabar, bo'laklab yoritiladi (`e-who` · `e-what` · `e-where`); 4-segmentda tuzatilgan kod va yashil terminal (M3).
- Terminal (haqiqiy):
  ```
  [Nest] ERROR [ExceptionHandler] UnknownDependenciesException [Error]: Nest can't resolve dependencies of the CarService (?).
  Please make sure that the argument "CarEntityRepository" at index [0] is available in the CarModule module.

  Potential solutions:
  - Is CarModule a valid NestJS module?
  - If "CarEntityRepository" is a provider, is it part of the current CarModule?
  - If "CarEntityRepository" is exported from a separate @Module, is that module imported within CarModule?
  ```
1. **Ataylab buzamiz: `car.module.ts`dan `forFeature` olib tashlandi — server yiqildi**
   Ovoz: «Resurs ishlaydi, himoyani bilasiz. Endi ataylab buzamiz, chunki o'quvchi va uning agenti aynan shu xatolarni qiladi. Car module'dan forFeature satrini olib tashladik. Server yiqildi, xabarni Nest birinchi darsidagi uch savol bilan o'qiymiz.»
2. **Qaysi klass — `CarService (?)`: bu safar Service'ning dependency'si topilmadi**
   Ovoz: «Qaysi klass: Car service. Nest birinchi darsida bu yerda Controller edi, bu safar Service. Qavsdagi so'roq belgisi topilmagan dependency o'rni.» · `e-who`
3. **Qaysi dependency — `CarEntityRepository`; qaysi fayl — `CarModule`, ya'ni `car.module.ts`**
   Ovoz: «Qaysi dependency: Car entity Repository, konstruktordagi birinchi parametr. Qaysi fayl: Car module, ya'ni car module ts. Repository so'zini ko'rdingizmi, demak javob providers'da emas, imports'da: Repository'ni forFeature beradi.» · `e-what`, `e-where`
4. **Tuzatamiz: `forFeature` qaytdi — beshta Mapped va successfully started**
   Ovoz: «Tuzatamiz: forFeature satrini qaytaramiz va saqlaymiz. Terminal: Car module tayyor, Car controller, beshta Mapped va successfully started.» · yashil terminal
5. **Xulosa: xabarda `…Repository` bo'lsa — modul faylining `imports`ida `forFeature` bormi**
   Ovoz: «Xulosa: can't resolve dependencies xabarida Repository so'zi bo'lsa, modul faylini oching va imports'da shu Entity bilan forFeature bor-yo'qligini tekshiring. Formula o'zgarmaydi: qaysi klass, qaysi dependency, qaysi fayl.»
- Manba: `nest2-out/12-break-forfeature.log`, `11-cars-start.log`.

## 21 · Buzamiz 2: Entity o'zgardi — baza o'zgardi  ← `Lesson`
- Kicker: `5-bosqich · buzamiz 2` · Sarlavha: **Entity o'zgarsa, baza o'zi o'zgaradi — jim yoki yiqilib**
- Sahna: chapda `Ide` `car.entity.ts` (holatga qarab o'zgaradi), o'ngda psql `\d cars` paneli «oldin / keyin» va terminal.
1. **`synchronize` har ishga tushishda bazani Entity'ga moslaydi — qulay ham, xavfli ham**
   Ovoz: «Ikkinchi holat bazada ko'rinadi. Dev rejimida synchronize yoqilgan: server har ishga tushganda bazani Entity'ga moslaydi. Jadval o'zi yaratilgani qulay edi. Lekin Entity o'zgarsa, baza ham so'ramasdan o'zgaradi.»
2. **Ustundan `@Column` olib tashlansa — ustun bazadan o'chadi: server xatosiz, narx yo'q**
   Ovoz: «Ikkinchi tekshiruvdagi holatni haqiqatda yurgizdik: price'dan Column olib tashlandi. Server xatosiz ishga tushdi, synchronize price ustunini bazadan o'chirdi. POST ikki yuz bir qaytaradi, lekin narx na javobda, na bazada. Hech qanday xabar chiqmaydi.»
   `\d cars`: `brand · model` (price yo'q) · `POST /api/v1/car {…,"price":250}` → `201` · `"data":{…"brand":"Chevrolet","model":"Malibu","is_available":true}` (price yo'q)
3. **Bor jadvalga majburiy ustun qo'shilsa — server yiqiladi: `contains null values`**
   Ovoz: «Teskari holat: jadvalda mashinalar bor, Entity'ga esa majburiy yangi ustun qo'shildi, masalan brand'ga bog'lash uchun brandId. Server ishga tushmaydi: column brandId contains null values. Eski satrlarda bu ustun bo'sh, majburiy ustun esa bo'sh bo'la olmaydi.»
   ```
   QueryFailedError: column "brandId" of relation "cars" contains null values
   ```
4. **Yechim: yangi ustun `nullable: true` — server ishga tushadi, eski ma'lumot joyida**
   Ovoz: «Yechim: yangi ustunni ixtiyoriy qilish, nullable true. Sinab ko'rdik: shunday qilinsa server ishga tushdi, ustun va tashqi kalit yaratildi, eski mashinalar joyida qoldi.» · `brandId | uuid | (nullable)` · `FOREIGN KEY ("brandId") REFERENCES brands(id)`
5. **Xulosa: Entity'ni o'zgartirish — bazani o'zgartirish; «ma'lumot yo'qoldi» desa — Entity'ni so'rang**
   Ovoz: «Xulosa: Entity'ni o'zgartirish bazani o'zgartirish demak. Ustun olib tashlansa, ma'lumot jim o'chadi; majburiy ustun qo'shilsa, server yiqiladi. O'quvchi ma'lumotlarim yo'qoldi yoki contains null values desa, birinchi savol: Entity'da nimani o'zgartirdingiz?»
- Manba: `nest2-out/23-entity-isnumber.txt`, `24-brand-fk.txt`, `24-brand-notnull.log`, `24-brand-nullable.log`.

## 22 · Tekshiruv 4 — o'quvchi KitobShop'idagi xato  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4 — xatoni o'qish`
- `above`: terminal paneli — 20-ekrandagi haqiqiy xabar, nomlar KitobShop'ga almashtirilgan (ochiq yoziladi: «xabar shakli haqiqiy, nomlar almashtirilgan»):
  ```
  Nest can't resolve dependencies of the BookService (?).
  Please make sure that the argument "BookEntityRepository" at index [0] is available in the BookModule module.
  ```
- Sarlavha: **O'quvchingizning KitobShop'i yiqildi. Qaysi faylni ochasiz va nimani tuzatasiz?**
- Ovoz: «Oxirgi tekshiruv, sinfdagi haqiqiy holat. To'rtinchi tekshiruv. O'quvchi agent yozgan kitob resursini ishga tushirdi, server yiqildi, ekranda xabar. U yordam so'radi. Qaysi faylni ochasiz va nimani tuzatasiz?»
- Variantlar (to'g'risi — 1): 1 `book.module.ts` — `imports`ga `TypeOrmModule.forFeature([BookEntity])` · 2 `app.module.ts` — `providers`ga `BookService` · 3 `book.service.ts` — konstruktordan Repository'ni olib tashlash · 4 `book.entity.ts` — `@Injectable()` qo'shish
- To'g'ri (ovoz): «book module, imports'ga forFeature Book entity bilan. Qaysi klass: Book service. Qaysi dependency: Book entity Repository. Qaysi fayl: Book module. Repository so'zi, demak forFeature. Ekranda tuzatilgan fayl va terminal: Book module tayyor, Book controller va Mapped satrlari.» · qisqa: «Klass `BookService` · dependency `BookEntityRepository` · fayl `book.module.ts` → `forFeature([BookEntity])`.»
- `after`: `book.module.ts` tuzatilgan + yashil terminal (haqiqiy): `BookModule dependencies initialized` · `BookController {/api/v1/book}:` · `Mapped {/api/v1/book, POST} route` · `Mapped {/api/v1/book, GET} route`
- Xato izohlari: 2 — «Service bosh modulning providers'iga yozilmaydi; xabar BookModule haqida.» · 3 — «Repository'siz Service bazaga yoza olmaydi; dependency kerak, uni beradigan satr yetishmayapti.» · 4 — «`@Injectable` Entity'ga qo'yilmaydi; xabar Repository topilmaganini aytyapti.»
- Manba: `nest2-out/12-break-forfeature.log` (xabar shakli), `16-book-start.log`, `src-book/book/book.module.ts`.

## 23 · Amaliyot 4 — o'zingiz buzing  ← `Practice`
- Kicker: `Amaliyot 4 / 4` · Eyebrow: `Hozir o'zingizda · 7 daqiqa` · Sarlavha: **O'zingiz buzing, xabarni o'qing, tuzating** · `tableAt: 3`
1. **Oxirgi amaliyot: o'zingiz buzasiz — ikki qadam, xabar o'z terminalingizda**
   Ovoz: «Oxirgi amaliyot: endi o'zingiz buzasiz. Ikki qadam, yetti daqiqacha. Maqsad xabarni o'z terminalingizda ko'rish va o'qish.»
2. **1-qadam: `forFeature`ni oling, xabardan klass, dependency va faylni isbotga yozing, keyin qaytaring**
   Ovoz: «Birinchi: car module'dan forFeature satrini olib tashlang va saqlang, server yiqiladi. Xabardan qaysi klass, qaysi dependency, qaysi fayl ekanini toping va vergul bilan isbot maydoniga yozing. Keyin satrni joyiga qaytaring.»
3. **2-qadam: `/api/v1/car/1` 500 beradi, sababi terminalda; `ParseUUIDPipe` qo'shsangiz — tushunarli 400**
   Ovoz: «Ikkinchi: Swagger'da car'ni id bir bilan so'rang: besh yuz. Terminalda invalid input syntax for type uuid satrini toping. Keyin Controller'da id parametriga ParseUUIDPipe qo'shing va so'rovni takrorlang: to'rt yuz. Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. Katakchalar va isbot bo'lmasa, Davom ochilmaydi.»
- Qadamlar:
  | # | Qadam | Nima | Kutilgan |
  |---|---|---|---|
  | 1 | `forFeature` yo'q | `car.module.ts` → `imports: []` → saqlang | `Nest can't resolve dependencies of the CarService (?)` … `"CarEntityRepository" at index [0]` … `CarModule module` → satrni qaytaring → 5 ta `Mapped` |
  | 2 | uuid | `GET /api/v1/car/1` → terminal → `@Param('id', ParseUUIDPipe)` | `500` + `QueryFailedError: invalid input syntax for type uuid: "1"` → keyin `400 Validation failed (uuid is expected)` |
- Isbot: «1-qadam xabaridan — qaysi klass, qaysi dependency, qaysi fayl? (vergul bilan)» · placeholder: «klass, dependency, fayl» · KOD: `carservice` + `carentityrepository` + (`car.module` yoki `carmodule`).
- «Boshqacha chiqdi»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Qaytardim, baribir xato | faylni saqladingizmi? `start:dev` saqlashda qayta yuklaydi — terminalda yangi satrlarni kuting |
  | `ParseUUIDPipe` topilmadi | import `@nestjs/common`dan |
  | `/car/1` hali ham 500 | `@Param('id', ParseUUIDPipe)` — ikkinchi argument `findOne`ga yozilganmi |
  | Boshqa xato | uch savol: qaysi klass · qaysi dependency · qaysi fayl; `Potential solutions` ro'yxati yechimni aytadi |
- Manba: `nest2-out/12-break-forfeature.log`, `11-cars-requests.txt`, `19-parseuuid.txt`.

---

## 24 · m4a-03 va undagi `/car` xatosi  ← `Lesson`
- Kicker: `6-bosqich · ko'prik` · Eyebrow: `m4a-03 · «Birinchi resursni qo'lda qo'shish — mashinalar»` · Sarlavha: **m4a-03: o'quvchi siz bugun qilgan ishni qiladi**
- Sahna: o'quvchi darsi xaritasi — 5 blok kartasi (segment bilan yonadi); 3-segmentda o'quvchi darsidagi amaliyot ro'yxati qatori qizil: «Brauzerda `/car` ni oching — `200` javobini ko'ring (404 emas)» va yonida haqiqiy javob `{"statusCode":404,"error":{"message":"Cannot GET /car"}}`; 4-segmentda vaqt chizig'i.
- Bloklar (o'quvchi darsidan): 1 kirish va reja (1–3-ekran) · 2 besh bosqich, har bosqichdan keyin test (4–15) · 3 so'rov yo'li, agent 5 faylni yozadi, debugging — agent Controller'ga `@Column` qo'yib yuborgan (16–18) · 4 «Ochilish kuni» — haqiqiy loyihada, VS Code'da (19) · 5 podium, 12 kartochka, yakun (20–22).
1. **m4a-03 — siz bugun qilgan ish: car resursi, besh bosqich, 22 ekran**
   Ovoz: «Endi darsning asosiy maqsadi: bu mavzuni o'quvchiga o'tish. Ikkita o'quvchi darsi bor. Birinchisi m4a-03: o'quvchi aynan siz bugun qilgan ishni qiladi, car resursini besh bosqichda qo'shadi. Yigirma ikki ekran.»
2. **Har bosqichda o'quvchi shu faylga tegishli qatorni tanlaydi, keyin test, agent va haqiqiy loyiha**
   Ovoz: «Har bosqichda o'quvchi qatorlarni tanlaydi, qaysi biri shu faylga tegishli, keyin qisqa test. So'ng agent besh faylni yozadi va o'quvchi agent xatosini topadi. Oxirida amaliyot haqiqiy loyihada. Siz har bosqichda qoidani aytasiz: ustun Entity'da, qoida DTO'da, eshik Controller'da.»
3. **Diqqat: o'quvchi darsida manzil `/car` deb yozilgan — haqiqatda 404; `/api/v1/car` deb tuzating**
   Ovoz: «Diqqat, birinchi xato. O'quvchi darsida manzil hamma joyda prefikssiz, slesh car deb yozilgan, amaliyot ro'yxatida ham: brauzerda slesh car'ni oching, ikki yuz. Haqiqatda bu to'rt yuz to'rt. Darsdan oldin o'quvchilarga ayting: manzil api v bir slesh car.»
4. **90 daqiqaning 20 tasi haqiqiy loyihaga ketadi — o'quvchilar eng ko'p shu yerda qoqiladi**
   Ovoz: «Vaqt rejasi, taklif: to'qson daqiqa. Kirish va reja o'n besh, besh bosqich qirq, agent va xato topish o'n, haqiqiy loyiha yigirma, yakun besh. Eng ko'p qoqiladigan joy haqiqiy loyiha: hammaning car route'i ishlamaguncha oldinga o'tmang.»
5. **Xulosa: o'quvchi darsi «5 fayl» deydi — DTO'ni bitta sanaydi; qoqilganga 2-amaliyot jadvali bilan yordam bering**
   Ovoz: «Xulosa: o'quvchi darsi besh fayl deydi, ikki DTO'ni bitta deb sanaydi, bu xato emas. Haqiqiy loyihada qoqilgan o'quvchiga ikkinchi amaliyotdagi jadvalingiz bilan yordam berasiz: har xabar va uning yechimi o'sha yerda.»
- Manba: `src/4a-Modull/NestArchResourceLesson.jsx` (SCREEN_META 22, ekran sarlavhalari, `ScreenCarPractice` ro'yxati; `/car` prefikssiz 67 marta, `api/v1` — 2); `nest2-out/11-cars-requests.txt` (`GET /car` → 404).

## 25 · O'quvchi tili  ← `Lesson`
- Kicker: `6-bosqich · ko'prik` · Sarlavha: **O'quvchi tili: javon chizmasi, anketa, retsept kitobi…**
- Sahna: ikki ustunli lug'at kartalari (Nest-1 S25b uslubi), guruh-guruh yonadi.
- Lug'at (o'quvchi darslaridan aynan):
  | O'quvchi aytadi | Siz bilasiz | Qayerdan |
  |---|---|---|
  | javon chizmasi | **Entity** — jadval shakli | m4a-03 |
  | buyurtma anketasi · anketa nusxasi | **DTO** · **PartialType** | m4a-03 |
  | nazoratchi to'xtatadi → 400 | **ValidationPipe** | m4a-03 |
  | tayyor retsept kitobi · omborni ko'rsatadi | **BaseService** · `super(carRepo)` | m4a-03 |
  | omborchi | **Repository** | m4a-01 |
  | ofitsiant · eshik | **Controller** · route | m4a-01, m4a-03 |
  | kirish taxtasi — «taxtada yozilmagan bo'lim ko'rinmaydi» → 404 | **Module** · AppModule `imports` | m4a-03 |
  | qo'riqchi · 🔒 faqat admin · 🌐 hamma | **Guard** · `@Roles('admin')` · `@Roles('public')` | m4a-04 |
  | yorliq — ko'p kitob bitta yorliqda, yorliq kitobda saqlanadi | **@ManyToOne** (`categoryId` kitob jadvalida) | m4a-04 |
1. **O'quvchi darslari restoran tilida gapiradi — siz ikkala tilni birga aytasiz**
   Ovoz: «Ikkinchi darsga o'tishdan oldin til. O'quvchi darslari Nest birinchi darsidagidek restoran tilida gapiradi. Siz ikkala tilni bilasiz va sinfda ularni birga aytasiz.»
2. **Entity javon chizmasi deyiladi, DTO — buyurtma anketasi, 400 esa nazoratchi to'xtatgani**
   Ovoz: «Entity javon chizmasi. DTO buyurtma anketasi, Partial type uning nusxasi. Anketa qoidasi buzilsa nazoratchi to'xtatadi, to'rt yuz.» · 1–3-juft
3. **Qolgan qatlamlar oshxona tilida: retsept kitobi, omborchi, ofitsiant va kirish taxtasi**
   Ovoz: «Base service tayyor retsept kitobi, super qatori omborni ko'rsatadi. Repository omborchi. Controller ofitsiant, har route eshik. Module kirish taxtasi: taxtada yozilmagan bo'lim ko'rinmaydi, to'rt yuz to'rt.» · 4–7-juft
4. **Xulosa: KitobShop'da qo'riqchi va yorliq; ikkala so'zni birga ayting — «javon chizmasi, ya'ni Entity»**
   Ovoz: «KitobShop'da yana ikki so'z: qo'riqchi, bu Guard; yorliq, bu kitobni kategoriyaga bog'lash. Xulosa: ikkala so'zni birga ayting, masalan javon chizmasi, ya'ni Entity. Metafora vazifani tushuntiradi, kodni emas.» · 8–9-juft
- Manba: `NestArchResourceLesson.jsx` (RULE_CARDS, FLASHCARDS), `NestArchPracticeLesson.jsx` (🔒/🌐, yorliq), `NestArchAliveLesson.jsx` (omborchi, ofitsiant).

## 26 · m4a-04 KitobShop va tayyorgarlik  ← `Lesson`
- Kicker: `6-bosqich · ko'prik` · Eyebrow: `m4a-04 · «Praktika — KitobShop backend»` · Sarlavha: **KitobShop: o'quvchi buyuradi, agent yozadi — sizning tayyorgarligingiz**
- Sahna: 9 ekran kartasi; 2–3-segmentda «darsdan oldin» ro'yxati (3 band) yonadi; 4-segmentda `Ide` paneli — haqiqiy `book.entity.ts` va javoblar.
- Ekranlar (o'quvchi darsidan): 1 kirish · 2 reja (3 resurs, Copilot Agent) · 3 Amaliyot 1 — aniq buyruq · 4 Amaliyot 2 — 3 playbook: Category → Book (`@ManyToOne → Category`) → Order (`@ManyToOne → Book`), har biridan keyin tekshiruv ro'yxati, keyin «Keep» · 5 Amaliyot 3 — `@Roles`: qaysi eshik ochiq · 6 Amaliyot 4 — eshik sinovi: agent `POST /order`ga `@Roles(ADMIN)` qo'ygan → `'public'` · 7 test · 8 podium · 9 yakun.
- Kod (haqiqiy yurgizilgan, `nest2-out/src-book/book.entity.ts`):
  ```ts
  @Entity('books')
  export class BookEntity extends BaseEntity {
    @Column() title: string;
    @Column() author: string;
    @Column() price: number;
    @Column({ default: false }) is_featured: boolean;

    @ManyToOne(() => CategoryEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'categoryId' })
    category: CategoryEntity;

    @Column() categoryId: string;
  }
  ```
1. **m4a-04 — uch resurs agent bilan: o'quvchi buyuradi, tekshiradi va shundan keyin qabul qiladi**
   Ovoz: «Ikkinchi dars m4a-04, KitobShop. Besh qadamni endi Copilot agenti qiladi, uch resurs uchun: kategoriya, kitob va buyurtma. O'quvchi yozmaydi: buyuradi, natijani tekshiruv ro'yxati bilan solishtiradi va shundan keyingina qabul qiladi.»
2. **Diqqat: o'quvchi darslari token va Authorize'ni o'rgatmaydi — darsning boshida siz ko'rsatasiz**
   Ovoz: «Diqqat, ikkinchi xato. KitobShop'da yopiq eshiklar bor, ular token so'raydi. Lekin o'quvchi darslarining hech birida signin, token va Authorize o'rgatilmagan. Darsning boshida uchinchi amaliyotdagi ishni o'quvchilar bilan birga qiling: signin va Authorize.»
3. **Diqqat: playbook'da `@Roles('admin')` — superadmin bilan 403; har o'quvchi avval oddiy admin yaratsin**
   Ovoz: «Uchinchi xato. Playbook'larda yopiq eshiklarga faqat admin yozilgan. Superadmin bilan kirgan o'quvchi kitob qo'sha olmaydi, to'rt yuz uch oladi. Yechim: darsdan oldin har o'quvchi superadmin bilan oddiy admin yaratsin va KitobShop'ni shu admin bilan sinasin.»
4. **Yangi narsa — `ManyToOne`: kitob kategoriyaga bog'lanadi; yo'q kategoriya → 500, noto'g'ri id → 400**
   Ovoz: «Darsdagi yangi narsa: kitobni kategoriyaga bog'lash, ManyToOne. Kitob jadvalida kategoriya id'si ustuni va tashqi kalit paydo bo'ladi. Sinab ko'rdik: mavjud bo'lmagan kategoriya bilan besh yuz, terminalda violates foreign key constraint. Id formati noto'g'ri bo'lsa to'rt yuz. Avval kategoriya, keyin kitob.»
   Haqiqiy: `\d books` → `categoryId | uuid | not null` · `FOREIGN KEY ("categoryId") REFERENCES categories(id) ON DELETE CASCADE` · yo'q kategoriya → `500` + `QueryFailedError: insert or update on table "books" violates foreign key constraint` · `"categoryId":"1"` → `400 categoryId must be a UUID`
5. **Xulosa: darsdan oldin uch narsa — signin va Authorize, oddiy admin, kategoriya kitobdan oldin**
   Ovoz: «Xulosa: KitobShop'dan oldin uch narsani tayyorlang: signin va Authorize'ni ko'rsatish, har o'quvchida oddiy admin, va kategoriya kitobdan oldin yaratilishi. Vaqt, taklif: to'qson daqiqaning qirqi uch playbook'ka ketadi, eng xavfli bo'lak, chunki hammaning agenti ishlashi kerak.»
- Manba: `src/4a-Modull/NestArchPracticeLesson.jsx` (SCREEN_META 9, PLAYBOOK, TEKSHIRUV; signin/Authorize/superadmin — 0 marta); `nest2-out/21-roles-superadmin.txt`, `16-book-requests.txt`, `18-book-fk-requests.txt`.

## 27 · Sinfdagi 6 holat va o'quvchi savollari  ← `Lesson`
- Kicker: `6-bosqich · sinfda` · Sarlavha: **Sinfda albatta chiqadigan 6 holat va tayyor javoblar**
- Sahna: Nest-1 R2 uslubi — 6 karta (`STUMBLE`), segment bilan yonadi; pastda «O'quvchi so'rasa» — 4 ta ochiladigan karta (`QA`, ovozsiz, bosib o'qiladi).
- Kartalar:
  | # | Holat | Haqiqiy xabar | Yechim |
  |---|---|---|---|
  | 1 | O'quvchi darsidagi `/car` | `404` `Cannot GET /car` | manzil `/api/v1/car` |
  | 2 | Kira olmayapti | `401 Admin not fount` · bazada nomsiz superadmin | `.env` Superadmin bloki; bo'sh yaratilgan bo'lsa — satrni o'chirib qayta yoqish |
  | 3 | Resurs ko'rinmaydi | `Mapped` yo'q + `404` · yoki `can't resolve … "CarEntityRepository"` | `app.module.ts` imports · `forFeature` |
  | 4 | Raqamli id | `500` + `invalid input syntax for type uuid: "1"` | id — javobdagi uuid |
  | 5 | Token va rol | `401 Unauthorized` · `403 Forbidden resource` | Authorize · `@Roles` ro'yxati (superadmin va admin — har xil rol) |
  | 6 | Entity o'zgardi | `column "…" contains null values` · ma'lumot jim yo'qoldi | yangi ustun `nullable: true` · Entity'da nima o'zgarganini so'rang |
- O'quvchi so'rasa (QA kartalari):
  - «Nega id raqam emas?» → uuid taxmin qilib bo'lmaydigan noyob matn, ikki server bir vaqtda yozsa ham to'qnashmaydi; `BaseEntity`da bir marta yozilgan.
  - «Nega javob `data` ichida?» → `successRes`: hamma muvaffaqiyat bir shaklda, frontend doim `data`ni o'qiydi; xato — `error.message`.
  - «Terminalda `Danggg` nima?» → xato filtridagi `console.log`, loyiha muallifining izi; xato emas.
  - «Nega javobda `hashed_password` ko'rinadi?» → `all/admin` Entity'dagi hamma ustunni qaytaradi; sahifalangan `GET /api/v1/admin`da `select` bilan faqat `id`, `username`, `is_active` olinadi — parol shunday yashiriladi.
1. **Sinfda albatta chiqadigan olti holat — hammasini bugun o'zingiz ko'rdingiz**
   Ovoz: «Ikkala darsni bilasiz. Endi reja buziladigan joylar: sinfda albatta chiqadigan oltita holat. Hammasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa.»
2. **`/car` manzili 404 beradi; kira olmaslik sababi — `.env` va bo'sh superadmin satri**
   Ovoz: «Birinchi: o'quvchi darsidagi slesh car, to'rt yuz to'rt, manzil api v bir slesh car. Ikkinchi: o'quvchi tizimga kira olmayapti. Env'dagi superadmin blokini tekshiring; superadmin bo'sh yaratilgan bo'lsa, bazadagi satrni o'chirib, serverni qayta ishga tushiring.» · 1–2-karta
3. **Resurs ko'rinmasa AppModule yoki `forFeature`'ni, 500 chiqsa uuid formatini tekshiring**
   Ovoz: «Uchinchi: resurs ko'rinmaydi. Mapped satri yo'q bo'lsa bosh modul, can't resolve va Repository bo'lsa forFeature. To'rtinchi: car slesh bir, besh yuz, chunki id uuid: javobdagi id'ni nusxalash kerak.» · 3–4-karta
4. **401 bo'lsa Authorize, 403 bo'lsa rol, server yiqilsa yangi ustunga `nullable` qo'ying**
   Ovoz: «Beshinchi: to'rt yuz bir, Authorize; to'rt yuz uch, Roles ro'yxatida bu rol yo'q, ko'pincha superadmin bilan kirilgan. Oltinchi: Entity'ga majburiy ustun qo'shilgan va server yiqilgan, ustunni ixtiyoriy qiling.» · 5–6-karta
5. **Xulosa: xato chiqsa avval statusga qarang — u xato qaysi qatlamdan kelganini aytadi**
   Ovoz: «Xulosa va usul: xato chiqsa avval statusga qarang. To'rt yuz to'rt manzil yoki modul, to'rt yuz DTO, to'rt yuz bir va uch Guard, besh yuz terminal. Javobni aytmang, xabarni o'quvchi bilan birga o'qing. Pastdagi kartalarda o'quvchi savollariga tayyor javob bor.»
- Manba: `nest2-out/11-cars-requests.txt`, `06-requests.txt`, `12-break-forfeature.log`, `13-break-appmodule.txt`, `21-roles-superadmin.txt`, `24-brand-fk.txt`, `23-entity-isnumber.txt`, `08-auth-requests.txt` (`hashed_password`); repo `admin.controller.ts:73–93` (`select`).

## 28 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz** (mexanika va ovoz Nest-1 S27 bilan bir xil; qaytganda M12 bo'yicha).
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — xato bo'lsa qaytiladigan ekran):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | O'quvchi loyihasida server qaysi faylda ishga tushadi? | `src/main.ts` · `src/api/app.service.ts` · `src/api/app.module.ts` · `src/config/index.ts` | 2 | `main.ts` faqat `Aplication.main()`ni chaqiradi; server `app.service.ts`da. | 5 |
  | 2 | `POST /api/v1/car` bo'sh `{}` bilan yuborildi. Javob? | 201, bo'sh mashina yaratiladi · 404, route topilmadi · 500, server xatosi · 400, buzilgan qoidalar ro'yxati | 4 | Global ValidationPipe DTO qoidalarini tekshiradi. | 13 |
  | 3 | `GET /api/v1/car/1` — nima bo'ladi? | 500, terminalda uuid xatosi · 404, mashina topilmadi · 200, birinchi mashina · 400, DTO qoidasi buzildi | 1 | id uuid; «1» bazada xato beradi, filtr uni 500 qiladi. | 13 |
  | 4 | Tokensiz `GET /api/v1/admin` yuborildi. Javob? | 403, rol yetmaydi · 404, route yo'q · 401, token yo'q · 200, adminlar ro'yxati | 3 | AuthGuard: `Authorization` yo'q → 401. | 16 |
  | 5 | Entity'da `price`dan `@Column` olib tashlandi, server qayta yoqildi. Nima bo'ladi? | Server yiqiladi, xato chiqadi · Ustun bazadan jim o'chadi · Ustun bazada o'zgarmay qoladi · Faqat DTO xato beradi | 2 | `synchronize` bazani Entity'ga moslaydi — ustun o'chadi, xabar yo'q. | 21 |
  | 6 | O'quvchi m4a-03 bo'yicha `localhost:3000/car`ni ochdi — 404, terminalda car uchun 5 ta Mapped bor. Nima deysiz? | Manzil `/api/v1/car` bo'lishi kerak · CarModule'ni AppModule'ga ulang · Serverni qayta ishga tushiring · Authorize'ga token qo'ying | 1 | Mapped bor — route bor; o'quvchi darsida prefiks yozilmagan. | 24 |
  | 7 | KitobShop: superadmin tokeni bilan `POST /book` — 403. O'quvchiga nima deysiz? | Qayta signin qiling, token eskirgan · Authorize'ga tokenni qayta qo'ying · BookModule'ni AppModule'ga ulang · Oddiy admin yarating va u bilan kiring | 4 | `@Roles('admin')` — `superAdmin` ro'yxatda yo'q; token yaroqli, shuning uchun 403. | 26 |
  | 8 | O'quvchi `.env`ni keyin to'ldirdi, lekin kira olmayapti; bazada nomsiz superadmin bor. Nima qilasiz? | `.env`ni yana bir marta saqlang · Serverni ikki marta qayta yoqing · Bazadagi o'sha satrni o'chirib, qayta yoqing · `USER_NAME`ni boshqa nomga o'zgartiring | 3 | Superadmin bor bo'lsa `onModuleInit` yangisini yaratmaydi. | 6 |
- `passed = ball ≥ 6 && 4 amaliyot isbot bilan` (Nest-1 bilan bir xil); `onFinished` maydonlari o'zgarmaydi.

## 29 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz** · tartib M13: (1) Barakalla / qayta topshirish maslahati → (2) animatsion xulosa — so'rov yo'li sxemasi (nuqta yuradi: brauzer → `/api/v1` → Guard → ValidationPipe → Controller → Service → Repository → jadval), 6 band birin-ketin yonadi → (3) uyga vazifa → (4) eslatma → (5) «Darsni yakunlash».
- Xulosa 6 band (har biri 1–2 gap ovozda, sxemaning o'z bekati yonadi):
  1. O'quvchi loyihasi: server `app.service.ts`da, manzil `/api/v1`, javob `data`da, xato `error.message`da, sozlama `.env`dan.
  2. Resurs — 5 qatlam: Entity · DTO · Service (BaseService + Repository) · Controller · Module (+ `core/index.ts`, AppModule).
  3. 400 — DTO qoidasi yoki ortiqcha maydon; 500 — terminalni o'qing (`/car/1` — id uuid).
  4. 401 — token yo'q; 403 — rol ro'yxatda yo'q; superadmin va admin — har xil rol.
  5. Entity o'zgarsa baza o'zgaradi: ustun jim o'chadi, majburiy ustun serverni yiqitadi.
  6. O'quvchi darslarida 3 xato: `/car` → `/api/v1/car` · token va Authorize'ni siz ko'rsatasiz · KitobShop'dan oldin oddiy admin.
- Segment ovozlari: a — «Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.» / o'tmagan: «Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.» · b1…b6 — yuqoridagi bandlar · hw — uyga vazifa · c — eslatma · z — «Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.»
- **Uyga vazifa** (M14; ovoz `hw`): «Uyga vazifa. O'z loyihangizga brand resursini qo'shing, aynan o'quvchining uyga vazifasi: name va country, DTO qoidalari, Base service'dan meros, to'rt eshik va bosh modul. Keyin car'ni brand'ga bog'lang, yangi ustun ixtiyoriy bo'lsin. Bir marta ataylab forFeature'ni olib tashlang, xabarni o'qing va tuzating. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying, boshqa hech narsa kerak emas.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | `brand` resursi | `core/entity/brand.entity.ts` (`name`, `country`) + `core/index.ts` · `api/brand/dto/` · `brand.service.ts` · `brand.controller.ts` (4 eshik) · `brand.module.ts` + AppModule | 4–5 ta `Mapped {/api/v1/brand…}` |
  | 2 | Swagger | `POST /api/v1/brand` · bo'sh `name` | `201` · `400 name should not be empty…` |
  | 3 | car → brand | `car.entity.ts`: `@ManyToOne(() => BrandEntity)` + `@JoinColumn({ name: 'brandId' })` + `@Column({ nullable: true }) brandId: string` | server ishga tushadi, `cars`da `brandId` + tashqi kalit |
  | 4 | Buzish | `brand.module.ts`dan `forFeature`ni oling → xabar → qaytaring | `can't resolve dependencies of the BrandService (?)` |
  | 5 | Topshirish | `git add . && git commit -m "brand resursi"` · `git push` → repo linki platformadagi uyga vazifaga (Telegram, skrinshot yo'q — F-1031-11) | — |
  Vaqt: 40–60 daqiqa. Tekshiruvchi nimaga qaraydi: brand resursi to'liq · `extends BaseService` · AppModule · `brandId` ixtiyoriy va tashqi kalit bor · 201/400 ishlaydi.
- **Eslatma** (bir sahifa, nusxalash / `.md`): `.env` ro'yxati (NODE_ENV, baza, kalit, superadmin) va bo'sh superadmin yechimi · ishga tushirish buyruqlari · farqlar (server joyi, `/api/v1`, javob shakllari) · resursning 5 qatlami va fayl yo'llari · status jadvali (400 · 401 · 403 · 404 · 500 — sabab va qayerga qarash) · Guard qoidalari (`'public'`, `@Roles` yo'q, `'ID'`, superadmin va admin — har xil rol) · synchronize tuzoqlari · o'quvchi darslaridagi 3 xato · o'quvchi tili (9 juft) · KitobShop tayyorgarligi · uyga vazifalarni tekshirish ro'yxati · o'z uyga vazifangiz.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: Jest — birinchi unit-test».

---

## «KOD» — qurishda (dvigatelga tegmay, faqat shu darsning bo'laklarida)
1. Explorer: `root: 'IntroNestArxitechture'`, fayl ro'yxati A-bo'limda; car fayllari 8, 9, 11, 12-ekranlarda `fresh`. Fayl rangi: `.entity.ts` binafsha · `dto/` to'q sariq · `guard/` qizil — `FILE_KIND` dvigatelda bo'lsa, darsning o'z bo'lagida kengaytiriladi, `parts/02` ga tegilmaydi.
2. Tepada 5 qatlam yo'li (8–12-ekran) — kichik sahna bloki, hozirgi qatlam yonadi.
3. Kod va terminal — `nest2-out/` dan aynan; qisqartirilgan joyda `…`; terminal rangsiz.
4. 13-ekran — Nest-1 S16 `REQS` kartalari (6 ta), `lockHint`.
5. **LineCheck `target` 0 dan sanaladi** (Nest-1: `target={10}` = 11-satr). 14-ekran: MD'dagi 13-satr → `target={12}`.
6. Isbotlar: 4-ekran — `/successfully started/i` va joriy yil (4 raqam) · 15-ekran — `/^[0-9a-f]{8}$/i` va `efa80745` emas · 19-ekran — `/^[0-9a-f]{8}$/i` va `d4264287` emas · 23-ekran — `carservice` + `carentityrepository` + (`car.module` | `carmodule`), bo'sh joysiz, kichik harf.
7. 27-ekran QA kartalari — Nest-1 S26 komponenti, ovozsiz (bosib ochiladi).
8. 29-ekran xulosa sxemasi — Nest-1 `SummaryMap` kengaytmasi: 8 bekat.
9. RU — UZ yopilgandan keyin, `parts/08-ru.jsx` (M24).

## O'quvchi darslari uchun alohida ish (qaror 31.10: hozir tegilmaydi, mentor darsida aytiladi)
1. **m4a-03** `NestArchResourceLesson.jsx`: manzil `/car` → `/api/v1/car` (67 joy; kamida amaliyot ro'yxati «Brauzerda `/car` ni oching»).
2. **m4a-04** `NestArchPracticeLesson.jsx`: boshiga signin → Authorize → oddiy admin yaratish qadami; playbook'lardagi `@Roles('admin')` superadmin bilan 403 berishi haqida bir gap.
3. **m4a-04 uyga vazifa** (LMS 6-4): «oddiy foydalanuvchi DELETE → 403» — loyihada oddiy foydalanuvchi yo'q; matnni «superadmin yoki boshqa rol bilan DELETE → 403» ga moslash.
