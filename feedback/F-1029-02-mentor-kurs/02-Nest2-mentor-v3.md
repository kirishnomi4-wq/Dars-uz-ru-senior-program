# Mentor kursi · Nest-2 «O'quvchi reposi: Entity, DTO, Repository, BaseService» — MD v3

F-ID: F-1031-01 · Sana: 2026-10-31 · Holat: **KO'RIKDA** ([GATE M] kutilmoqda) · Fidbek: qator yoniga `>> …`
Fayl (quriladi): `src/mentor-kurs/NestRepoMentorLesson.jsx` (bo'laklar `src/mentor-kurs/nest2/parts/03…08`, dvigatel — umumiy `parts/01–02`) · **45 ekran** · UZ (RU — 7-bosqichda, M24)
Qonun: `MENTOR_DARS_ETALON.md` M1–M24 · PRD: `PRD-mentor-kurs.md` (4-dars) · Haqiqiy chiqishlar: `manba/nest2-out/` (skript `manba/drive-nest2.sh`, 31.10.2026)

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | Mentor. Nest-1 ni o'tgan: cars-api'ni noldan qurgan, Module · Controller · Service · DI · 4 Nest xatosi · baza ulanish xatolari (Rdb) · o'quvchi reposining strukturasini bir qarashda ko'rgan (Nest-1 S25a). Entity, DTO, Repository, BaseService, Guard — hali kodi bilan ko'rmagan. |
| Dars oxirida mentor | 1) o'quvchi reposini o'z kompyuterida clone qilib, `.env` va bazasi bilan ishga tushiradi, Swagger'da ko'radi · 2) bu loyihaning cars-api'dan **5 farqini** aytadi va har birining oqibatini biladi (404, 400, javob shakli) · 3) bitta resursning **5 qatlamini** kod bilan o'qiydi va o'zi yangi resurs qo'shadi (aynan o'quvchi darsi usulida) · 4) Guard'ning 401 va 403 ini ajratadi · 5) sinfda chiqadigan 4 xatoni xabaridan taniydi va tuzatadi · 6) m4a-03 va m4a-04 darslarini qanday o'tishni va **uyga vazifalarini qanday tekshirishni** biladi |
| O'quvchi darslari | **m4a-03** «Birinchi resursni qo'lda qo'shish — mashinalar» (22 ekran: 5 qadam, debugging, «Ochilish kuni» haqiqiy loyihada) · **m4a-04** «Praktika — KitobShop backend» (9 ekran: Copilot Agent playbook ×3, @ManyToOne, @Roles, eshik sinovi). Oldingi: m4a-01 (clone, Swagger, so'rov yo'li). |
| Kursdagi o'rni | Mentor darsi 3 (Nest-1) → **4 (shu)** → 5 (Jest-1). |
| Til | O'zbekcha, adabiy, «siz». Atama inglizcha + birinchi uchrashda qavsda izoh. M9 lug'ati: route · path · dependency · inject · decorator · instance · logika · Explorer · terminal · link · «o'ylab ko'ring» · «kuchukcha». O'quvchi metaforalari (javon chizmasi, anketa…) faqat 7-bosqichda, «o'quvchi tili» sifatida. |
| Misol-ip | **O'quvchi reposi** `github.com/Azizbekcrypto/IntroNestArxitechture` (HEAD `45071ac`, «Base arxitechture DDD»). Mavjud resurs — `admin`. Biz qo'shadigan resurs — `car` (aynan o'quvchi darsi m4a-03 dagi: `brand · model · price · is_available`, path `/api/v1/car`). Ko'prikda — KitobShop (`category → book`, @ManyToOne). |
| Repo holati (qaror 31.10, 1a) | Repo **o'zgartirilmaydi**: imlo (`server runnig onn port`, `Admin not fount`, `username or password incorect`), filtrdagi `Danggg` log, bo'sh superadmin namunasi — darsda «shunday chiqadi, xato emas» deb o'rgatiladi (S3, S5, S8, S9, S17). Repo keyin tuzatilsa — shu ekranlar yangilanadi. |
| Haqiqiylik (M10) | Hamma terminal satri, javob va xato — 31.10.2026 da haqiqiy yurgizishdan: Node 24.18 · Nest 11.1 · TypeORM 1.0 · PostgreSQL 17 (lokal, alohida `nest2_mentor` bazasi). Har ekran ostida «Manba:» qatori — `manba/nest2-out/NN-…`. Darsda ko'rsatiladigan **`.env` parol — `password`** (`.env.example` dagidek); haqiqiy yurgizishdagi parol hech qayerga yozilmagan. |
| Hajm | 45 ekran · 7 bosqich · 4 amaliyot · 5 tekshiruv · 4 buzish · 8 savollik sinov · ovoz ≈ 55 daqiqa · jami ≈ 2 soat (amaliyotlar bilan) |
| Dvigatel | Nest-1 niki, o'zgarishsiz: `Lesson` · `Practice` · `MCRetry` · `LineCheck` · `Screen27` · `Screen28`; sahna — `Ide` (Explorer `root: 'IntroNestArxitechture'`) · `CodePanel` · `Browser` · terminal paneli · qoida-karta. Yangi primitiv kerak bo'lsa — «KOD» ro'yxatida (oxirida). |

### MD'ni o'qish qoidasi
- **Segment** = bitta qadam = bitta vizual o'zgarish. Har segmentda: **kalit ibora** (chapda, 8–14 so'z, M6) → **Ovoz** (mentor eshitadigan har so'z, ≤ 60 so'z, M21) → *sahna* (nima o'zgaradi). Ovozda kod o'qilmaydi («car service ts», «api v bir»), raqam so'z bilan; ekrandagi `show` matni raqam va kod bilan — bu MD'da faqat ovozdan farq qilsa yoziladi.
- Har `Lesson` ekranining 1-gapi — **ko'prik** (M17), oxirgi segmenti — **Xulosa** (M5). Har kod sahnasida Explorer, faol fayl yoritilgan (M1, M19).
- Tekshiruvlar: `MCRetry` (variantli, topilgach boshqa variantlar yo'qoladi, M20) va `LineCheck` (qaysi satr xato → tuzatilgan kod, M2, M12). Amaliyot: katakcha + buyruq + «Kutilgan» + isbot (M11); Davom qulfi M4.
- Terminal bloklari — haqiqiy chiqishdan **qisqartirilgan** (satrlar olib tashlangan joyda `…`), lekin hech bir satr o'ylab topilmagan.

---

## A. Darsning tayanchi

**Tushunchalar (bir ma'no — bir so'z):**
- **resurs** — ilova boshqaradigan bir tur ma'lumot (admin, mashina, kitob). Bir resurs = **5 qatlam / 5 fayl**: Entity → DTO → Service → Controller → Module.
- **Entity** — bazadagi jadval shakli: klass = jadval, `@Column` = ustun. TypeORM shu klassdan jadval yasaydi (`synchronize: true` bo'lsa — o'zi, dev rejimida).
- **BaseEntity** — hamma Entity'ning otasi: `id` (uuid), `created_at`, `updated_at` tekin.
- **DTO** (Data Transfer Object) — kiruvchi ma'lumot shakli va qoidalari: `@IsString`, `@IsNotEmpty`, `@IsNumber`… Qoida buzilsa **400**. `PartialType` — hamma maydon ixtiyoriy nusxa (update uchun), `OmitType` — ba'zi maydonlarsiz nusxa (signin).
- **ValidationPipe** — DTO qoidalarini so'rov kelganda tekshiradigan Nest mexanizmi. Bu loyihada **global**: `whitelist` (DTO'da yo'q maydon olib tashlanadi), `forbidNonWhitelisted` (olib tashlash o'rniga **400**), `transform` (so'rovni DTO klassiga aylantiradi).
- **Repository** — bitta jadval bilan ishlash metodlari (`find`, `findOne`, `save`, `update`, `delete`). TypeORM beradi; modulga `TypeOrmModule.forFeature([Entity])` bilan, Service'ga `@InjectRepository(Entity)` bilan keladi — bu Nest-1 dagi DI, faqat instance'ni TypeORM yasaydi.
- **BaseService** — hamma Service uchun tayyor CRUD: `create` (201) · `findAll` · `findAllWithPagination` · `findOneBy` · `findOneById` (topilmasa 404 `not found`) · `update` · `remove`. Yangi Service undan **meros oladi** (`extends BaseService`), konstruktorda `super(repo)` — «qaysi jadval».
- **successRes** — hamma muvaffaqiyatli javobning bitta shakli: `{ statusCode, message: 'success', data }`.
- **AllExceptionFilter** — hamma xatoning bitta shakli: `{ statusCode, error: { message } }` (Nest'ning standart `{ message, error, statusCode }` emas!). Oddiy `Error` → 500 «Internal server error».
- **global prefiks** — `setGlobalPrefix('api/v1')`: hamma route `/api/v1/…` bilan boshlanadi; unutilsa **404** `Cannot GET /car`.
- **Guard** — so'rov Controller'ga yetguncha tekshiruv. `AuthGuard`: `Authorization: Bearer <token>` bor va to'g'rimi — yo'q bo'lsa **401**; `@Roles('public')` bo'lsa tekshirmaydi. `RolesGuard`: tokendagi rol `@Roles(...)` ro'yxatida bormi — yo'q bo'lsa **403**; `'ID'` — o'z id'si bo'lsa ruxsat.
- **token** (JWT) — kirgan foydalanuvchining ruxsatnomasi: signin'da beriladi (`accessToken` javobda, `refreshToken` cookie'da), keyin har so'rovda `Authorization: Bearer …` da yuboriladi. Swagger'da — «Authorize» tugmasi.
- **config/index.ts** — `.env`ni o'qib, bitta `config` obyektiga yig'adi: `NODE_ENV=dev` → `DEV_DB_URL` va `synchronize: true`; boshqa qiymat → `PROD_DB_URL` va `synchronize: false`.
- **uuid** — bu loyihada `id` raqam emas, `3f2a…` ko'rinishidagi 36 belgili matn. `/car/1` so'rovi **500** beradi (bazaga «1» uuid emas).

**Darsning ipi:** bitta so'rovning yo'li, Nest-1 dagidek, lekin endi **to'liq**: brauzer → global prefiks → Guard → ValidationPipe (DTO) → Controller → Service (BaseService) → Repository → PostgreSQL jadvali (Entity) → `successRes` / `AllExceptionFilter`. Har bosqich shu yo'lning bir bekatini ochadi. Vizual — Nest-1 dagi uchta quti (Controller ko'k · Service yashil · Module sariq) + yangi to'rt quti: **Entity (binafsha) · DTO (to'q sariq) · Repository (jigarrang) · Guard (qizil)**; ranglar dars bo'yi bir xil.

**Bosqichlar:** 1 Clone va ishga tushirish (S2–S4, P1) · 2 cars-api'dan 5 farq (S5–S9, T1) · 3 Resurs qatlamlari — admin misolida (S10–S14, T2, P2) · 4 Eshik qo'riqchisi (S15–S17, T3) · 5 Resurs qo'shamiz — car (S18–S23, T4, P3) · 6 Buzamiz (S24–S27, T5, P4) · 7 O'quvchi darslariga ko'prik (S28–S34) · O'z-sinov va yakun (S35–S36).

**Ekran raqamlari (dvigatel «N / 45»):**
1 S1 · 2 S2 · 3 S3 · 4 S4 · 5 P1 · 6 S5 · 7 S6 · 8 S7 · 9 S8 · 10 S9 · 11 T1 · 12 S10 · 13 S11 · 14 S12 · 15 S13 · 16 S14 · 17 T2 · 18 P2 · 19 S15 · 20 S16 · 21 S17 · 22 T3 · 23 S18 · 24 S19 · 25 S20 · 26 S21 · 27 S22 · 28 S23 · 29 T4 · 30 P3 · 31 S24 · 32 S25 · 33 S26 · 34 S27 · 35 T5 · 36 P4 · 37 S28 · 38 S29 · 39 S30 · 40 S31 · 41 S32 · 42 S33 · 43 S34 · 44 S35 (sinov) · 45 S36 (yakun).

**Explorer ro'yxati (hamma kod sahnasida, `root: 'IntroNestArxitechture'`; faol fayl yoritiladi, yangi yaratilgan fayl `fresh` bilan paydo bo'ladi):**
```
src/main.ts
src/config/index.ts
src/api/app.module.ts
src/api/app.service.ts
src/api/admin/admin.module.ts · admin.controller.ts · admin.service.ts
src/api/admin/dto/create-admin.dto.ts · update-admin.dto.ts · signin-admin.dto.ts
src/api/auth/auth.module.ts · auht.service.ts            (repoda nomi shunday — «auht»)
src/api/car/…                                             (5-bosqichda paydo bo'ladi)
src/core/index.ts
src/core/entity/Base.entity.ts · admin.entity.ts         (+ car.entity.ts — 5-bosqich)
src/core/repository/admin.repository.ts
src/common/guard/auth.guard.ts · roles.guard.ts
src/common/decorator/roles-decorator.ts · get-request-user-decorator.ts · cookie-getter-decorator.ts
src/common/dto/query-pagination.dto.ts · enum/user-enum.ts · interface/…
src/infrastructure/base/base.service.ts
src/infrastructure/exception/AllException.filter.ts
src/infrastructure/response/successRes.ts · pagination/Pager.ts · RepositoryPager.ts
src/infrastructure/lib/token/Token.ts · lib/crypto/brypt.ts
.env.example · .env (3-ekrandan) · package.json
```
Rang: Controller ko'k · Service yashil · Module sariq · Entity binafsha · DTO to'q sariq · Guard qizil · qolgani kulrang.

---

## S1 · Kirish — «cars-api'ni o'zingiz qurdingiz. Endi o'quvchi clone qiladigan loyiha»  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · 4-dars` · Sarlavha: **Siz cars-api'ni qurdingiz. Endi o'quvchi reposi.**
- Sahna: chapda 7 bosqichli reja (`mk-plan`, ovoz aytganda yoritiladi), o'ngda yakuniy natija: Swagger sahifasining kichik maketi — `GET /api/v1/car` qatori ochiq, ostida haqiqiy javob `{ "statusCode": 200, "message": "success", "data": [ … ] }`.
- Reja: 01 Clone va ishga tushirish · 02 cars-api'dan 5 farq · 03 Resurs qatlamlari: Entity · DTO · Repository · BaseService · 04 Eshik qo'riqchisi: Guard · 05 car resursini qo'shamiz · 06 Buzamiz va xatoni o'qiymiz · 07 O'quvchi darslariga ko'prik
- Segmentlar:
  1. **Nest-1 da cars-api'ni noldan qurdingiz — endi o'quvchi clone qiladigan loyihani ochamiz**
     Ovoz: «Assalomu alaykum. Nest birinchi darsida siz cars api loyihasini bo'sh papkadan qurdingiz: Module, Controller, Service va Dependency Injection. O'quvchingiz esa noldan yozmaydi. U GitHub'dan tayyor loyihani clone qiladi. Bugun aynan shu loyihani ochamiz va ichini o'qiymiz.»
  2. **Dars oxirida bu loyihani o'z kompyuteringizda ishga tushirgan bo'lasiz — baza va Swagger bilan**
     Ovoz: «Dars oxirida siz bu loyihani o'z kompyuteringizda ishga tushirgan bo'lasiz: PostgreSQL bazasi va Swagger sahifasi bilan.» · reja 01 yonadi
  3. **Bitta resursning beshta qatlamini o'qiysiz: Entity, DTO, Repository, BaseService, Controller**
     Ovoz: «Bitta resursning beshta qatlamini kod bilan o'qiysiz: Entity, DTO, Repository, BaseService va Controller. Va o'zingiz yangi resurs qo'shasiz, aynan o'quvchi darsidagi tartibda.» · reja 03, 05 yonadi
  4. **Sinfda chiqadigan xatolarni xabaridan taniysiz: 404, 400, 401, 403 va 500**
     Ovoz: «Sinfda chiqadigan xatolarni xabaridan taniysiz: to'rt yuz to'rt, to'rt yuz, to'rt yuz bir, to'rt yuz uch va besh yuz. Har biriga tayyor javobingiz bo'ladi.» · reja 04, 06 yonadi
  5. **Yetti bosqich. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi**
     Ovoz: «Dars yetti bosqichdan iborat, reja chapda. Shoshilmang: har ekranda ovozni o'chirish, boshidan eshitish va to'liq matnini o'qish mumkin. Ustoz gapirib bo'lgach Davom tugmasi ochiladi. Bosing, boshlaymiz.»
- Manba: Swagger javobi — `nest2-out/11-cars-requests.txt` (GET /api/v1/car).

## S2 · Loyiha xaritasi: to'rt papka, har birining vazifasi  ← `Lesson`
- Kicker: `1-bosqich · clone` · Sarlavha: **Loyiha xaritasi: api · core · common · infrastructure**
- Sahna: Explorer katta ko'rinishda (`FileTree big`, Nest-1 S5a kabi): to'rt papka yopiq, ovoz aytganda birma-bir ochiladi va yonida vazifa izohi chiqadi (`desc`). Yuqorida GitHub qatori: `Azizbekcrypto/IntroNestArxitechture · 45071ac · Base arxitechture DDD`.
- Segmentlar:
  1. **O'quvchi reposini ochdik: cars-api'da 4 fayl edi, bu yerda `src/`da 37 fayl, to'rt papka**
     Ovoz: «Loyihani ochamiz. cars api da to'rtta fayl edi. Bu yerda src ichida o'ttiz yettita fayl bor, lekin qo'rqmang: hammasi to'rtta papkaga tartib bilan joylashgan. Har papkaning bitta vazifasi bor.»
  2. **`api/` — siz bilgan bo'laklar: har resursning Module, Controller, Service va DTO'lari**
     Ovoz: «Birinchi papka, api. Bu yerda siz bilgan bo'laklar turadi: har resursning Module, Controller, Service va DTO fayllari. Hozir bitta resurs bor, admin. Bosh modul app module ts ham shu yerda.» · `api/` ochiladi
  3. **`core/` — bazaning shakli: Entity'lar va Repository tiplari**
     Ovoz: «Ikkinchi, core. Bu bazaning shakli: Entity fayllari, ya'ni jadvallar, va Repository tiplari. Bir qoida: jadval qanday ko'rinishini faqat shu papka biladi.» · `core/` ochiladi
  4. **`common/` — hamma resurs ishlatadigan umumiy narsalar: Guard, decorator, enum, interface**
     Ovoz: «Uchinchi, common. Hamma resurs birga ishlatadigan umumiy narsalar: Guard'lar, o'z decorator'lar, enum va interface'lar, sahifalash DTO'si.» · `common/` ochiladi
  5. **`infrastructure/` — poydevor: BaseService, xato filtri, javob shakli, token, parol**
     Ovoz: «To'rtinchi, infrastructure, poydevor. Hamma Service meros oladigan BaseService, xatolarni bir shaklga keltiradigan filtr, javob shakli successRes, token va parol xizmatlari, sahifalash. Bularni yozmaysiz, ishlatasiz.» · `infrastructure/` ochiladi
  6. **Xulosa: resurs qo'shganda `api/` ga 4 fayl, `core/` ga 1 fayl yoziladi — qolgani tayyor**
     Ovoz: «Xulosa: yangi resurs qo'shganda api papkasiga to'rtta fayl, core papkasiga bitta Entity yozasiz. common va infrastructure'ga tegmaysiz, ular tayyor. Shu xaritani yodda tuting, dars bo'yi shu to'rt papkada yuramiz.»
- Manba: `nest2-out/01-clone.log` (fayllar ro'yxati — `src/` 37 fayl).

## S3 · Clone, `.env`, baza, `start:dev` — haqiqiy terminal  ← `Lesson`
- Kicker: `1-bosqich · ishga tushirish` · Sarlavha: **To'rt buyruq va bitta fayl: loyiha tirik**
- Sahna: chapda terminal paneli (haqiqiy satrlar, segment bilan to'ldiriladi), o'ngda `.env` fayli (`Ide`, faol `.env`): `.env.example` dan nusxa, o'zgargan satrlar yashil. Pastda qoida-karta (6-segmentda).
- Segmentlar:
  1. **Xaritani bilasiz — endi loyihani tirik qilamiz: to'rt buyruq va bitta fayl**
     Ovoz: «Xaritani bilasiz, endi loyihani tirik qilamiz. O'quvchi ham, siz ham bir xil yo'ldan o'tasiz: to'rt buyruq va bitta fayl. Terminalga qarang.»
  2. **`git clone` va `npm install` — ikki-besh daqiqa, paketlar ichida TypeORM, class-validator, Swagger**
     Ovoz: «git clone loyihani oladi, npm install paketlarni o'rnatadi: ikki-besh daqiqa. Paketlar ichida Nest'dan tashqari TypeORM, pg, class validator va Swagger bor, hammasini keyin kod bilan ko'rasiz.» · terminal: `Cloning into 'IntroNestArxitechture'...` · `npm install` → `added 759 packages, and audited 760 packages in 16s` (keshsiz 1–3 daqiqa)
  3. **`.env` — `.env.example` dan nusxa: parol o'zingizniki, baza nomi `nestarxitechture`**
     Ovoz: «Bitta fayl: env. Loyihada tayyor namuna bor, env example. Undan nusxa olasiz va ikki joyni o'zgartirasiz: DEV DB URL ichidagi parol, o'zingizning PostgreSQL parolingiz, va baza nomi, nestarxitechture, u oxirida turibdi.» · `.env` da `DEV_DB_URL=postgres://postgres:password@localhost:5432/nestarxitechture` yoritiladi
  4. **`.env` da yana bir blok — Superadmin: `USER_NAME`, `PASSWORD`… bo'sh qolsa, kirib bo'lmaydi**
     Ovoz: «Env'da yana bitta blok bor, Superadmin: foydalanuvchi nomi, to'liq ism, telefon va parol. Namunada ular bo'sh. Bo'sh qoldirsangiz server ishga tushadi, lekin tizimga kirib bo'lmaydi. Nega shunday, o'ninchi ekranda ko'rasiz. Hozir to'ldiring: parol kuchli bo'lsin, masalan Developer bir undov belgisi.» · `.env` Superadmin bloki yoritiladi: `USER_NAME=superadmin · FULL_NAME=Super Admin · PHONE=+998901234567 · PASSWORD=Developer1!`
  5. **`createdb nestarxitechture` — baza yaratilmasa server «does not exist» deb yiqiladi (Nest-1 Rdb)**
     Ovoz: «Uchinchi buyruq: createdb nestarxitechture. Nest birinchi darsida ko'rgansiz: baza yaratilmagan bo'lsa server database does not exist deb yiqiladi. PostgreSQL ishlab turgan bo'lsin.» · terminal: `createdb -U postgres nestarxitechture`
  6. **`npm run start:dev` — terminalda TypeORM jadval yasadi, superadmin yaratildi, route'lar ulandi**
     Ovoz: «To'rtinchi: npm run start dev. Terminalni o'qiymiz: Nest ishga tushmoqda, TypeORM moduli tayyor, demak bazaga ulandi va admins jadvalini yaratdi. Keyin bir satr: Super admin created successfully, env'dagi superadmin bazaga yozildi. Keyin route'lar: Mapped satrlari, hammasi api v bir bilan boshlanadi. Oxirida: server running on port uch ming.» · terminal (haqiqiy, qisqartirilgan):
     ```
     [Nest] LOG [NestFactory] Starting Nest application...
     [Nest] LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized
     [Nest] LOG [InstanceLoader] AdminModule dependencies initialized
     [Nest] LOG [RoutesResolver] AdminController {/api/v1/admin}:
     [Nest] LOG [RouterExplorer] Mapped {/api/v1/admin, POST} route
     [Nest] LOG [RouterExplorer] Mapped {/api/v1/admin/signin, POST} route
     …  (jami 9 ta Mapped)
     Super admin created successfully
     [Nest] LOG [NestApplication] Nest application successfully started
     server runnig onn port 3000
     ```
  7. **Xulosa: clone → install → `.env` (parol, baza, superadmin) → createdb → start:dev**
     Ovoz: «Xulosa: clone, install, env fayli, createdb, start dev. Env'da uch narsa: parol, baza nomi va superadmin. Shu tartibni o'quvchiga ham aynan shunday berasiz. Keyingi ekranda brauzerda ko'ramiz.»
- Qoida-karta (6-segmentdan): `server runnig onn port 3000` — satr aynan shunday, imlo xatosi bilan: kodda `console.log('server runnig onn port', PORT)`. O'quvchi «xato chiqdi» desa — bu xato emas, muvaffaqiyat satri.
- Manba: `nest2-out/01-clone.log`, `02-npm-install.log`, `07-start-ok.log`, repo `src/api/app.service.ts:46`.

## S4 · Swagger: `localhost:3000/api/v1`  ← `Lesson`
- Kicker: `1-bosqich · Swagger` · Sarlavha: **Swagger — loyihaning menyusi: 9 route, hammasi `/api/v1`**
- Sahna: `Browser` — manzil `localhost:3000/api/v1`, Swagger sahifasi maketi (sarlavha, `admin` bo'limi, 9 route qatori — haqiqiy ro'yxat), «Authorize» tugmasi (qulf belgisi). Segment bilan qatorlar yoritiladi.
- Segmentlar:
  1. **Server ishlayapti — brauzerda `localhost:3000/api/v1`: Swagger sahifasi ochiladi**
     Ovoz: «Server ishlayapti. Brauzerda localhost uch ming slesh api v bir ni ochamiz. Bu Swagger: loyihaning menyusi, o'quvchi birinchi darsda shu sahifani ko'rgan.»
  2. **E'tibor: manzil `localhost:3000` emas, `/api/v1` — ildizni ochsangiz 404**
     Ovoz: «E'tibor bering: manzil oddiy localhost uch ming emas, api v bir. Ildizni ochsangiz to'rt yuz to'rt chiqadi. Nega, ikkinchi bosqichda kod bilan ko'ramiz.»
  3. **`admin` bo'limida 9 route: signin, token, signout va CRUD — har qatorda qulf belgisi bor yoki yo'q**
     Ovoz: «admin bo'limida to'qqizta route: kirish uchun signin, token va signout, qolgani CRUD: yaratish, ro'yxat, bittasi, o'zgartirish, o'chirish. Qatorlarga qarang: ba'zilarida qulf belgisi bor, ba'zilarida yo'q.» · 9 qator yoritiladi (haqiqiy ro'yxat: `POST /admin` · `GET /admin` · `POST /admin/signin` · `POST /admin/token` · `POST /admin/signout` · `GET /admin/all/admin` · `GET /admin/{id}` · `PATCH /admin/{id}` · `DELETE /admin/{id}` — hammasi `/api/v1` bilan; Swagger JSON: title «Azizbek», version 1.0)
  4. **Qulf = token kerak: «Authorize» tugmasi orqali beriladi — buni to'rtinchi bosqichda qilamiz**
     Ovoz: «Qulf, token kerak degani: so'rov yuborishdan oldin yuqoridagi Authorize tugmasiga tokenni kiritasiz. Tokenni qayerdan olish va qulf qanday ishlashini to'rtinchi bosqichda ko'ramiz.» · «Authorize» yoritiladi
  5. **Xulosa: Swagger'da hamma route va uning shakli ko'rinadi — o'quvchi uchun bu asosiy oyna**
     Ovoz: «Xulosa: Swagger'da loyihaning hamma route'i, kiruvchi ma'lumot shakli va javob namunasi ko'rinadi. O'quvchi uchun bu asosiy oyna, Postman kerak emas. Endi siz ham shu holatga keling: birinchi amaliyot.»
- Manba: `nest2-out/06-requests.txt` (Swagger sarlavhasi va route ro'yxati), `07-start-ok.log`.

## P1 · Amaliyot 1 / 4 — clone qiling, ishga tushiring, Swagger'ni oching  ← `Practice`
- Kicker: `Amaliyot 1 / 4` · Eyebrow: `Hozir o'zingizda · 10–15 daqiqa` · Sarlavha: **O'quvchi reposini o'zingizda tirik qiling** · `tableAt: 5`
- Segmentlar:
  1. **Endi siz: o'quvchi yo'lidan to'liq o'tasiz — clone'dan Swagger'gacha, besh qadam**
     Ovoz: «Endi navbat sizga. O'quvchi darsda o'tadigan yo'ldan to'liq o'tasiz: clone'dan Swagger'gacha, besh qadam. Buyruqlar yonida nusxalash tugmasi bor.»
  2. **1-qadam: clone va install — PostgreSQL ishlab turganini oldin tekshiring**
     Ovoz: «Birinchi: clone va npm install. Boshlashdan oldin PostgreSQL ishlab turganini tekshiring, Nest birinchi darsidagi buyruq bilan.» · 1-qadam yoritiladi
  3. **2-qadam: `.env` — parol, baza nomi va Superadmin bloki to'liq, parol kuchli**
     Ovoz: «Ikkinchi: env example'dan env yarating. Parol o'zingizniki, baza nomi nestarxitechture, Superadmin blokini to'ldiring: parol kuchli bo'lsin, katta harf, raqam va belgi bilan.» · 2-qadam
  4. **3-qadam: `createdb` · 4-qadam: `start:dev` — isbot: terminaldagi superadmin satri**
     Ovoz: «Uchinchi: bazani yarating. To'rtinchi: start dev. Terminalda Super admin created successfully satrini toping va isbot maydoniga nusxalang.» · 3-, 4-qadam
  5. **5-qadam: brauzerda `/api/v1` — Swagger, admin bo'limi, 9 route**
     Ovoz: «Beshinchi: brauzerda localhost uch ming slesh api v bir. Swagger ochilsa, admin bo'limida to'qqizta route ko'rsangiz, tayyor.» · 5-qadam
  6. **Boshqacha chiqsa — jadval. Katakchalar va isbot bo'lmasa, Davom ochilmaydi**
     Ovoz: «Boshqacha chiqsa pastdagi jadvalga qarang: eng ko'p uchraydigan beshta holat. Beshala katakcha va isbot to'g'ri bo'lmaguncha Davom ochilmaydi.»
- Qadamlar (`steps`):
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Clone va install | `git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git` · `cd IntroNestArxitechture` · `npm install` | `added … packages` (2–5 daqiqa) |
  | 2 | `.env` | `cp .env.example .env` → `DEV_DB_URL` parol + `nestarxitechture` · `USER_NAME`, `FULL_NAME`, `PHONE`, `PASSWORD` (kuchli), `Access_Token_Key` | fayl saqlangan, GitHub'ga chiqmaydi (`.gitignore`) |
  | 3 | Baza | `createdb -U postgres nestarxitechture` | hech narsa chiqmaydi = yaratildi |
  | 4 | Server | `npm run start:dev` | `Super admin created successfully` · `Mapped {/api/v1/admin…}` ×9 · `server runnig onn port 3000` |
  | 5 | Swagger | brauzer: `localhost:3000/api/v1` | sahifa ochildi, `admin` bo'limi, 9 route |
- Isbot: «Terminaldagi superadmin satrini nusxalang» · placeholder: «terminaldagi satrni shu yerga qo'ying» · tekshiruv: `/super admin created/i` · xato: «Kutilgan satr `Super admin created successfully` — server ishga tushmagan yoki satr boshqa; terminalni yuqoriga aylantiring».
- «Boshqacha chiqdi» jadvali:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `Unable to connect to the database` + `ECONNREFUSED` / `password authentication failed` / `does not exist` | Nest-1 Rdb: PostgreSQL ishlamayapti · parol noto'g'ri · baza yaratilmagan — 2-satrni o'qing |
  | `Unable to connect to the database` + `getaddrinfo ENOTFOUND base` | `.env` umuman yo'q — 2-qadam (manzil o'rniga `undefined` so'zi ketadi) |
  | `Cannot find module 'class-validator'` | `npm install` tugamagan yoki eski `node_modules` — qayta `npm install` |
  | `EADDRINUSE :::3000` | Nest-1 dagi cars-api ochiq qolgan — uni yoping |
  | Swagger ochildi, lekin `localhost:3000` → 404 | to'g'ri: manzil `/api/v1` bilan |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `nest2-out/02-npm-install.log`, `03-no-class-validator.log`, `04-no-env.log`, `05-env-no-db.log`, `07-start-ok.log`, `15-port-busy-second.log`.

---

## S5 · 1-farq: server `main.ts`da emas — `api/app.service.ts`dagi `Aplication.main()`da ishga tushadi  ← `Lesson`
- Kicker: `2-bosqich · 5 farq` · Sarlavha: **1-farq: `main.ts` uch satr, server `Aplication.main()`da**
- Sahna: `Ide`, faol `src/main.ts` (3 satr), 3-segmentdan `src/api/app.service.ts` ga o'tadi (48 satr, `CodePanel` yoritilgan satrga aylanadi). Yon qoida-karta 6-segmentda.
- Kod `src/main.ts` (haqiqiy, 3 satr):
  ```ts
  import { Aplication } from './api/app.service';

  void Aplication.main();
  ```
- Kod `src/api/app.service.ts` (haqiqiy, 12–27 va 46-satrlar ko'rsatiladi):
  ```ts
  export class Aplication {
    static async main(): Promise<void> {
      const app = await NestFactory.create(AppModule);

      app.useGlobalFilters(new AllExceptionFilter());
      app.use(cookieParser());
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );
      const api: string = 'api/v1';

      app.setGlobalPrefix(api);
      …
      await app.listen(PORT, () => console.log('server runnig onn port', PORT));
    }
  }
  ```
- Segmentlar:
  1. **Swagger'ni ko'rdingiz. Endi bu loyiha cars-api'dan nimasi bilan farq qiladi — beshta farq, birinchisi `main.ts`**
     Ovoz: «Swagger'ni ko'rdingiz, loyiha ishlayapti. Endi savol: bu loyiha siz qurgan cars api dan nimasi bilan farq qiladi? Beshta farq bor va har biri sinfda savol tug'diradi. Birinchisi main ts dan boshlanadi.»
  2. **`main.ts` da uch satr: Aplication klassini import qiladi va `main()` ni chaqiradi — tamom**
     Ovoz: «main ts ni ochamiz. cars api da bu yerda NestFactory create va listen turardi. Bu yerda uch satr: Aplication klassini import qiladi va uning main metodini chaqiradi. Tamom. Demak server boshqa faylda ishga tushadi.» · `main.ts` 1- va 3-satr
  3. **O'sha fayl — `api/app.service.ts`. Nomi Service, lekin Service emas: ichida `NestFactory.create`**
     Ovoz: «O'sha fayl api papkasidagi app service ts. Nomi app service, lekin bu Service emas, Injectable ham yo'q. Ichida Aplication klassi va static main metodi: NestFactory create, bosh modul, shu siz bilgan satr.» · Explorer `app.service.ts` ga o'tadi, 12–14-satr yoritiladi
  4. **`main()` ichida to'rt sozlama: filtr, cookie, ValidationPipe, prefiks — qolgan to'rt farq shu yerda**
     Ovoz: «Create'dan keyin to'rtta sozlama: global filtr, cookie parser, global ValidationPipe va global prefiks api v bir. Qolgan to'rt farqning uchtasi mana shu satrlarda. Keyingi ekranlarda birma-bir ochamiz.» · 16–27-satrlar
  5. **Oxirida `listen(PORT)` — port `.env`dan, va o'sha «server runnig onn port» satri**
     Ovoz: «Oxirida listen: port env'dan keladi, va terminalda ko'rgan satr: server running on port. Satr imlo xatosi bilan yozilgan, running'da n tushib qolgan, on'da n ortiqcha. O'quvchi buni xato deb o'ylasa, bu muvaffaqiyat satri deb ayting.» · 46-satr
  6. **Xulosa: o'quvchi «server qayerda yoqiladi?» desa — `api/app.service.ts`, `Aplication.main()`; `main.ts` faqat chaqiradi**
     Ovoz: «Xulosa: bu loyihada server api papkasidagi app service ts faylida, Aplication klassining main metodida ishga tushadi. main ts faqat chaqiradi. O'quvchi app service'ni ochib Service qidirsa, shuni ayting.»
- Qoida-karta: `app.service.ts` ≠ Service. Bu loyihada Service'lar `api/<resurs>/<resurs>.service.ts` da (masalan `admin.service.ts`).
- Manba: repo `src/main.ts`, `src/api/app.service.ts`.

## S6 · 2-farq: global prefiks `/api/v1` — unutilsa 404  ← `Lesson`
- Kicker: `2-bosqich · 5 farq` · Sarlavha: **2-farq: hamma route `/api/v1` bilan boshlanadi**
- Sahna: `Ide`, faol `app.service.ts`, 25–27-satrlar yoritilgan; o'ngda ikki `Browser` kartasi: `localhost:3000/admin` → qizil javob; `localhost:3000/api/v1/admin` → (hozircha) 401 javobi. Pastda terminaldan 3 ta `Mapped` satri.
- Segmentlar:
  1. **Birinchi farqni ko'rdik. Ikkinchisi — Swagger'da ko'rgan `/api/v1`: `setGlobalPrefix`**
     Ovoz: «Birinchi farqni ko'rdik, server qayerda. Ikkinchisi siz Swagger'da ko'rgan narsa: nega hamma manzil api v bir bilan boshlanadi? Javob shu ikki satrda: api o'zgaruvchisi va set global prefix.» · 25–27-satr
  2. **cars-api'da `@Controller('cars')` → `/cars` edi. Bu yerda `@Controller('admin')` → `/api/v1/admin`**
     Ovoz: «cars api da Controller cars degan edik va manzil slesh cars bo'lardi. Bu yerda Controller admin, lekin manzil api v bir slesh admin. Prefiks hamma Controller'ning oldiga o'zi qo'shiladi, Controller'da yozilmaydi.» · terminal: `Mapped {/api/v1/admin, POST} route` …
  3. **Sinfdagi 1-savol: «`/admin` ochdim — 404». Javob: prefiks. Xabar `Cannot GET /admin`**
     Ovoz: «Sinfdagi birinchi savol shu bo'ladi: localhost uch ming slesh admin ochdim, to'rt yuz to'rt. Brauzerga qarang: xabar Cannot GET slesh admin. Loyihada bunday manzil yo'q, chunki prefiks tushib qolgan.» · chap brauzer: `{"statusCode":404,"error":{"message":"Cannot GET /admin"}}` (haqiqiy)
  4. **To'g'ri manzil `/api/v1/admin` — endi 404 emas, 401: route bor, lekin token kerak**
     Ovoz: «To'g'ri manzil: api v bir slesh admin. Endi javob to'rt yuz to'rt emas, to'rt yuz bir, Unauthorized. Bu yaxshi xabar: route topildi, faqat token kerak. Tokenni to'rtinchi bosqichda olamiz.» · o'ng brauzer: `{"statusCode":401,"error":{"message":"Unauthorized"}}` (haqiqiy)
  5. **Xulosa: 404 ko'rsangiz avval manzilda `/api/v1` bormi, keyin terminalda `Mapped` satri bormi**
     Ovoz: «Xulosa: bu loyihada to'rt yuz to'rt ko'rsangiz ikki narsani tekshirasiz. Birinchi, manzilda api v bir bormi. Ikkinchi, terminalda o'sha route'ning Mapped satri bormi. Ikkalasi joyida bo'lsa, muammo boshqa joyda.»
- Manba: `nest2-out/06-requests.txt` (`GET /admin`, `GET /api/v1/admin`), `07-start-ok.log` (Mapped satrlari).

## S7 · 3-farq: global `ValidationPipe` — DTO qoidasi buzilsa 400, ortiqcha maydon ham 400  ← `Lesson`
- Kicker: `2-bosqich · 5 farq` · Sarlavha: **3-farq: ValidationPipe hamma route uchun yoqilgan**
- Sahna: `Ide`, faol `app.service.ts`, 18–24-satrlar; o'ngda uchta so'rov kartasi (Nest-1 S16 uslubi, bosiladigan): `POST /api/v1/admin {}` · `POST … {…, "color": "qizil"}` · `POST … {"password": "123"}` — javoblari haqiqiy. `lockHint`: «Uchala so'rov tugmasini bosing».
- Segmentlar:
  1. **Nest-1 da bo'sh POST 201 qaytargan edi — Nest tekshirmaydi, siz aytmaguncha. Bu loyihada aytilgan**
     Ovoz: «Prefiksni bilasiz. Uchinchi farq. Nest birinchi darsida bo'sh POST yuborganimizda Nest ikki yuz bir qaytargan edi: u kiruvchi ma'lumotni siz aytmaguncha tekshirmaydi. Bu loyihada aytilgan: global ValidationPipe, uchta sozlama bilan.» · 18–24-satr
  2. **`whitelist` — DTO'da yo'q maydon olib tashlanadi; `forbidNonWhitelisted` — olib tashlash o'rniga 400**
     Ovoz: «whitelist: so'rovda DTO'da yozilmagan maydon kelsa, u jimgina olib tashlanadi. forbidNonWhitelisted esa qattiqroq: olib tashlash o'rniga to'rt yuz qaytaradi, property falon should not exist. Bu loyihada ikkalasi yoqilgan, demak ortiqcha maydon xato.» · 20–21-satr
  3. **`transform` — so'rov DTO klassiga aylantiriladi; `@Type(() => Number)` bo'lsa matn raqamga o'tadi**
     Ovoz: «transform: kelgan oddiy obyekt DTO klassiga aylantiriladi. Sahifalash DTO'sida ko'rasiz: page va limit manzildan matn bo'lib keladi, Type Number decorator'i bilan raqamga aylanadi.» · 22-satr
  4. **Bo'sh `POST /api/v1/admin {}` → 400, xabarda hamma buzilgan qoida vergul bilan**
     Ovoz: «Sinab ko'ramiz, bo'sh POST. Javob to'rt yuz va xabarda hamma buzilgan qoida: username should not be empty, username must be a string va hokazo. Nest hammasini bir yo'la sanaydi.» · 1-karta: `{"statusCode":400,"error":{"message":"username should not be empty, username must be a string, phone_number should not be empty, phone_number must be a string, full_name should not be empty, full_name must be a string, password is not strong enough"}}`
  5. **Ortiqcha `color` maydoni → 400 `property color should not exist` — o'quvchi AI yozgan kodda ko'p uchraydi**
     Ovoz: «Ikkinchi sinov: hamma maydon to'g'ri, lekin ortiqcha color maydoni bor. To'rt yuz: property color should not exist. O'quvchi AI yozgan kodda buni ko'p ko'radi: DTO'da bitta maydon, so'rovda boshqa.» · 2-karta: `{"statusCode":400,"error":{"message":"property color should not exist"}}`
  6. **Kuchsiz parol → 400 `password is not strong enough` — `@IsStrongPassword` DTO'da**
     Ovoz: «Uchinchi: parol bir ikki uch. To'rt yuz, password is not strong enough. Bu DTO'dagi IsStrongPassword decorator'i: katta harf, kichik harf, raqam, belgi, sakkiz belgi. Shuning uchun env'dagi superadmin paroli ham kuchli bo'lishi kerak.» · 3-karta: `{"statusCode":400,"error":{"message":"password is not strong enough"}}`
  7. **Xulosa: 400 ko'rsangiz — xabarni o'qing, u DTO'dagi qaysi qoida buzilganini aytadi; ortiqcha maydon ham 400**
     Ovoz: «Xulosa: bu loyihada to'rt yuz DTO'dan keladi. Xabarni o'qing: qaysi maydon, qaysi qoida. Ortiqcha maydon ham to'rt yuz, bu whitelist. Uchala tugmani o'zingiz bosib, javoblarni o'qing, keyin Davom ochiladi.»
- Manba: `nest2-out/09-validation.txt`, repo `src/api/admin/dto/create-admin.dto.ts`, `src/common/dto/query-pagination.dto.ts`.

## S8 · 4-farq: `AllExceptionFilter` — hamma xato bitta shaklda  ← `Lesson`
- Kicker: `2-bosqich · 5 farq` · Sarlavha: **4-farq: xato javobi `{ statusCode, error: { message } }`**
- Sahna: `Ide`, faol `src/infrastructure/exception/AllException.filter.ts` (satrlar 10–19, 24–41, 43–49 yoritiladi); o'ngda ikki javob yonma-yon: cars-api'dagi 404 (`{"message":"Car with id 99 not found","error":"Not Found","statusCode":404}`) va bu loyihadagi 404 (`{"statusCode":404,"error":{"message":"not found"}}`).
- Kod (haqiqiy, qisqartirilgan):
  ```ts
  @Catch()
  export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<Response>();

      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      let errorMessage = 'Internal server error';
      console.log(exception);

      if (exception instanceof HttpException) {
        const exceptionResponse = exception.getResponse();
        console.log('Danggg', exceptionResponse);
        …
          const message = (exceptionResponse as any).message;
          if (Array.isArray(message)) {
            errorMessage = message.join(', ');
          } else {
            errorMessage = message || errorMessage;
          }
      }
      const errorResponse = {
        statusCode: status,
        error: {
          message: errorMessage,
        },
      };
      res.status(status).json(errorResponse);
    }
  }
  ```
- Segmentlar:
  1. **400 javobini ko'rdingiz — shakli Nest'nikiga o'xshamaydi: `error` ichida `message`. Sabab — to'rtinchi farq, filtr**
     Ovoz: «To'rt yuz javobini ko'rdingiz. Shakliga e'tibor berdingizmi? cars api da Nest message, error, statusCode qaytarardi. Bu yerda statusCode, keyin error, uning ichida message. Sabab to'rtinchi farq: global filtr, AllException filter.» · ikki javob yonma-yon
  2. **`@Catch()` bo'sh — hamma xato shu yerga tushadi. `HttpException` bo'lsa statusi olinadi, bo'lmasa 500**
     Ovoz: «Faylni ochamiz. Catch decorator'i bo'sh: istisno yo'q, hamma xato shu yerga keladi. Agar xato HttpException oilasidan bo'lsa, statusi olinadi, to'rt yuz, to'rt yuz to'rt. Bo'lmasa besh yuz, Internal server error. Nest birinchi darsidagi qoida shu yerda kod bilan.» · 10–19-satr
  3. **Xabar massiv bo'lsa — `join(', ')`: shuning uchun 400 da qoidalar vergul bilan bitta satrda**
     Ovoz: «Keyin xabar: Nest'da ValidationPipe xatosi massiv bo'ladi, qoidalar ro'yxati. Filtr uni join bilan bitta satrga yig'adi, vergul bilan. Shuning uchun to'rt yuzda qoidalar bitta matn bo'lib keldi.» · 36–39-satr
  4. **Oxirida bitta shakl: `statusCode` va `error.message` — o'quvchi frontend'da doim `error.message`ni o'qiydi**
     Ovoz: «Oxirida javob yig'iladi: statusCode va error ichida message. Hamma xato shu shaklda, bu qulay: o'quvchi frontend yozganda doim error nuqta message'ni o'qiydi.» · 43–49-satr
  5. **Filtr terminalga ham yozadi: `console.log(exception)` va `console.log('Danggg', …)` — terminaldagi «Danggg» xato emas**
     Ovoz: «Yana ikki satr: filtr xatoni terminalga ham chiqaradi, console log; HttpException bo'lsa yana bir console log, Danggg so'zi bilan, loyiha muallifining izi. Demak brauzerda qisqa xabar, terminalda to'liq matn va har to'rt yuzdan oldin Danggg. O'quvchi bu nima desa: filtrdagi console log, xato emas. Besh yuz chiqsa haqiqiy sababni terminaldan o'qiysiz.» · 22-, 26-satr
  6. **Xulosa: xato shakli `{ statusCode, error: { message } }`; 500 bo'lsa — sabab terminalda**
     Ovoz: «Xulosa: bu loyihada xato javobi har doim statusCode va error message. To'rt yuzlar tushunarli xabar bilan keladi, besh yuz esa Internal server error, sababi terminalda. O'quvchi nega xato shakli boshqacha desa, shu faylni ko'rsating.»
- Manba: repo `src/infrastructure/exception/AllException.filter.ts`; javoblar `nest2-out/08-auth-requests.txt` (404), Nest-1 `nest-out/02-working.log` (cars-api 404).

## S9 · 5-farq: `config/index.ts` va `.env` — superadmin bo'sh qolsa nima bo'ladi  ← `Lesson`
- Kicker: `2-bosqich · 5 farq` · Sarlavha: **5-farq: hamma sozlama `.env`dan, `config` orqali**
- Sahna: `Ide`, faol `src/config/index.ts` (32 satr); o'ngda `.env.example` (yashil: to'ldirilgan, qizil: bo'sh satrlar); 5-segmentda terminal + so'rov javobi (haqiqiy).
- Kod (haqiqiy, qisqartirilgan):
  ```ts
  dot.config();

  export const config = {
    PORT: Number(process.env.PORT),
    Node_env: process.env.NODE_ENV,

    DB: {
      url:
        String(process.env.NODE_ENV) === 'dev'
          ? String(process.env.DEV_DB_URL)
          : String(process.env.PROD_DB_URL),
      sync: String(process.env.NODE_ENV) === 'dev' ? true : false,
    },

    Token: {
      access_token_key: String(process.env.Access_Token_Key) || 'secret',
      …
    },

    SuperAdmin: {
      username: String(process.env.USER_NAME),
      fullName: String(process.env.FULL_NAME),
      password: String(process.env.PASSWORD),
      phone: String(process.env.PHONE)
    },
  };
  ```
- Segmentlar:
  1. **To'rt farqni ko'rdik. Beshinchisi `.env` bilan bog'liq — sinfda eng ko'p vaqt oladigani**
     Ovoz: «To'rt farqni ko'rdik: server joyi, prefiks, ValidationPipe, filtr. Beshinchisi env bilan bog'liq va sinfda eng ko'p vaqt oladigani. cars api da env yo'q edi. Bu yerda hamma sozlama env'dan keladi, config papkasidagi bitta fayl orqali.»
  2. **`dot.config()` `.env`ni o'qiydi, `config` obyekti yig'iladi: PORT, DB, Token, SuperAdmin**
     Ovoz: «Birinchi satr: dotenv env faylini o'qiydi va process env'ga qo'yadi. Keyin config obyekti: port, baza, token kalitlari va superadmin. Loyihaning qolgan qismi env'ni emas, shu config'ni import qiladi.» · 5–8-satr
  3. **`NODE_ENV === 'dev'` → `DEV_DB_URL` va `synchronize: true`; boshqa qiymat → `PROD_DB_URL`, sync yo'q**
     Ovoz: «Eng muhim satrlar: NODE ENV dev bo'lsa, DEV DB URL va synchronize true, ya'ni TypeORM jadvallarni o'zi yaratadi. Boshqa har qanday qiymat, masalan prod yoki yozilmagan bo'lsa, PROD DB URL va synchronize false. Buni oltinchi bosqichda buzib ko'ramiz.» · 11–17-satr
  4. **`.env.example`da `USER_NAME=` bo'sh turibdi — bo'sh ham qiymat: superadmin nomsiz va parolsiz yaratiladi, xato chiqmaydi**
     Ovoz: «Endi superadmin bloki. Env example'da USER NAME, PASSWORD va qolganlari yozilgan, lekin bo'sh. Bo'sh ham qiymat: bo'sh matn. Demak onModuleInit nomsiz va parolsiz superadmin yaratadi, xato chiqarmaydi. Kalit ham bo'sh qolsa, config unga secret so'zini beradi.» · 26–31-satr; `.env.example` qizil satrlar
  5. **Haqiqiy natija: bazada nomi bo'sh superadmin; signin'ga DTO yo'l bermaydi — 400 `password is not strong enough`. Jim xato**
     Ovoz: «Buni haqiqatda sinab ko'rdik: namunadagi env bilan server ishga tushdi, Super admin created successfully, bazada username ustuni bo'sh superadmin. Lekin kirib bo'lmaydi: signin DTO'si parolni kuchli deb talab qiladi, bo'sh yoki oddiy parolga to'rt yuz, password is not strong enough. Server xato bermaydi, kirish esa imkonsiz, jim xato.» · psql (haqiqiy): `username | full_name | phone_number | role | is_active` → ` | | | superAdmin | t` · signin → `{"statusCode":400,"error":{"message":"password is not strong enough"}}`
  6. **Xulosa: `.env` da uch blok to'ldiriladi — baza, token kaliti, superadmin (kuchli parol); bo'sh qoldirilsa jim xato**
     Ovoz: «Xulosa: env'da uch blok to'ldiriladi: baza manzili, token kaliti va superadmin, paroli kuchli. Bo'sh qoldirilsa xato chiqmaydi, lekin kirib bo'lmaydi, bu jim xato. O'quvchi tizimga kirolmasa, birinchi savolingiz: env'dagi superadmin bloki to'ldirilganmi?»
- Qoida-karta: `.env` tekshiruv ro'yxati — `DEV_DB_URL` (parol, baza nomi) · `NODE_ENV=dev` · `Access_Token_Key` · `USER_NAME · FULL_NAME · PHONE · PASSWORD` (kuchli). `.env` umuman yo'q → `Unable to connect to the database` + `getaddrinfo ENOTFOUND base` (manzil o'rniga `undefined` so'zi ketadi, pg uni noto'g'ri o'qiydi — `04-no-env.log`).
- Manba: repo `src/config/index.ts`, `src/api/admin/admin.service.ts` (`onModuleInit`), `nest2-out/06-first-start-blank-superadmin.log`, `06-requests.txt`.

## T1 · Tekshiruv 1 / 5 — «`/admin` ochdim, 404»  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 5`
- Sarlavha: **O'quvchi: «Brauzerda `localhost:3000/admin` ochdim — 404». Birinchi nimani tekshirasiz?**
- Ovoz (ko'prik bilan): «Beshta farqni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. O'quvchi aytadi: brauzerda localhost uch ming slesh admin ochdim, to'rt yuz to'rt chiqdi. Server ishlayapti, terminalda xato yo'q. Birinchi nimani tekshirasiz? Variantni tanlang.»
- Variantlar (to'g'risi — 2):
  1. `app.module.ts` — AdminModule `imports`da bormi
  2. Manzil — `/api/v1/admin` bo'lishi kerak, prefiks tushib qolgan
  3. `.env` — PostgreSQL paroli to'g'rimi
  4. Token — Swagger'da «Authorize» bosilganmi
- To'g'ri izoh (ovoz): «Manzil. Bu loyihada hamma route api v bir bilan boshlanadi, set global prefix. Slesh admin degan route yo'q, shuning uchun to'rt yuz to'rt va Cannot GET slesh admin. Terminalda Mapped satrlari api v bir slesh admin deb turibdi. To'g'ri manzilda javob to'rt yuz bir bo'ladi, bu alohida masala.» · qisqa: «Prefiks: `/api/v1/admin`. Terminalda `Mapped {/api/v1/admin…}` — route bor, manzil noto'g'ri edi.»
- Xato izohlari: 1 — «AdminModule ulanmagan bo'lsa terminalda admin uchun Mapped satri bo'lmasdi; u bor. Avval manzilni tekshiring.» · 3 — «Parol noto'g'ri bo'lsa server umuman ishga tushmasdi: Unable to connect. Bu yerda server ishlayapti.» · 4 — «Token yo'q bo'lsa javob 401 bo'ladi, 404 emas. 404 — route topilmadi.»
- Manba: `nest2-out/06-requests.txt` (`GET /admin` → 404 `Cannot GET /admin`).

---

## S10 · Entity: `Base.entity.ts` + `admin.entity.ts` — klass = jadval  ← `Lesson`
- Kicker: `3-bosqich · Entity` · Sarlavha: **Entity — jadval shakli: klass jadval, `@Column` ustun**
- Sahna: `Ide`, faol `src/core/entity/Base.entity.ts` (17 satr), 4-segmentdan `admin.entity.ts` (25 satr); o'ngda 6-segmentda psql chiqishi `\d admins` — ustunlar jadvali (haqiqiy), Entity satri ↔ ustun qatori bir rangda bog'lanadi.
- Kod `Base.entity.ts` (haqiqiy):
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
- Kod `admin.entity.ts` (haqiqiy):
  ```ts
  @Entity('admins')
  export class AdminEntity extends BaseEntity {
    @Column({ unique: true })
    username: string;

    @Column()
    hashed_password: string;

    @Column()
    full_name: string;

    @Column()
    phone_number: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
    role: UserRole;

    @Column({ default: true })
    is_active: boolean;
  }
  ```
- Segmentlar:
  1. **Loyihaning farqlarini bilasiz. Endi ichiga kiramiz: bitta resurs — admin — beshta qatlamda. Birinchisi Entity**
     Ovoz: «Loyihaning farqlarini bilasiz. Endi ichiga kiramiz. Bitta resursni, admin'ni, beshta qatlamda o'qiymiz: Entity, DTO, Repository, Service va Controller. Keyin xuddi shu beshtasini o'zingiz yozasiz. Birinchi qatlam Entity, core papkasida.»
  2. **Entity — bazadagi jadvalning shakli: klass jadval, har `@Column` ustun. TypeORM shundan jadval yasaydi**
     Ovoz: «Entity bazadagi jadvalning shakli. Klass jadval, klassdagi har bir Column decorator'i jadvaldagi ustun. Siz SQL yozmaysiz: TypeORM shu klassga qarab jadvalni o'zi yaratadi, dev rejimida synchronize true bo'lgani uchun.»
  3. **Avval ota: `BaseEntity` — `id` uuid, `created_at`, `updated_at`. Har jadvalda bor, bir marta yozilgan**
     Ovoz: «Avval ota klass, Base entity. Uchta ustun: id, PrimaryGeneratedColumn uuid, ya'ni raqam emas, o'ttiz olti belgili noyob matn. created at va updated at, TypeORM ularni o'zi to'ldiradi. Bu uchta ustun har jadvalda bor, lekin bir marta shu yerda yozilgan.» · 8–16-satr
  4. **`admin.entity.ts`: `@Entity('admins')` — jadval nomi; `extends BaseEntity` — uch ustun tekin keldi**
     Ovoz: «Endi admin entity ts. Birinchi satr: Entity decorator'i, qavsda jadval nomi admins. Keyin extends Base entity: id, created at, updated at tekin keldi, qayta yozilmaydi. O'quvchi id ustunini qo'lda yozsa, bu xato.» · Explorer `admin.entity.ts`, 6–7-satr
  5. **Besh o'z ustuni: `username` unique, `hashed_password`, `full_name`, `phone_number`, `role` enum, `is_active` default true**
     Ovoz: «Keyin o'z ustunlari. username, unique: ikki admin bir xil nom ololmaydi. hashed password: parol ochiq saqlanmaydi, bcrypt bilan shifrlangan. full name, phone number. role, enum: superAdmin, admin, driver, user, standart admin. is active, standart true.» · 8–24-satr
  6. **Bazada haqiqatda shunday: `\d admins` — har Entity satriga bitta ustun, `id` uuid, `role` enum**
     Ovoz: «Bazaga qaraymiz, psql'da d admins. Har Entity satriga bitta ustun: id uuid, created at va updated at timestamp, username, hashed password, full name, phone number, role enum, is active boolean. Buni siz yaratmadingiz, TypeORM yaratdi.» · psql jadvali (haqiqiy):
     ```
     id              | uuid                        | not null | uuid_generate_v4()
     created_at      | timestamp without time zone | not null | now()
     updated_at      | timestamp without time zone | not null | now()
     username        | character varying           | not null |
     hashed_password | character varying           | not null |
     full_name       | character varying           | not null |
     phone_number    | character varying           | not null |
     role            | admins_role_enum            | not null | 'admin'::admins_role_enum
     is_active       | boolean                     | not null | true
     UNIQUE CONSTRAINT (username)
     ```
  7. **Xulosa: Entity = jadval shakli, `core/entity/`da; `BaseEntity`dan meros — `id`, sanalar tekin; `@Column` — ustun**
     Ovoz: «Xulosa: Entity jadvalning shakli va u core papkasida turadi. Base entity'dan meros olinadi, id va sanalar tekin. Har Column bitta ustun. Yangi resurs qo'shganda birinchi yoziladigan fayl shu. O'quvchi darsi buni javon chizmasi deydi, lekin siz Entity deysiz.»
- Manba: repo `src/core/entity/Base.entity.ts`, `admin.entity.ts`, `src/common/enum/user-enum.ts`; `nest2-out/07-signin.txt` (`\d admins`).

## S11 · DTO: `create-admin.dto.ts`, `update` (PartialType), `signin` (OmitType)  ← `Lesson`
- Kicker: `3-bosqich · DTO` · Sarlavha: **DTO — kiruvchi ma'lumot shakli va qoidalari, uch fayl**
- Sahna: `Ide`, faol `src/api/admin/dto/create-admin.dto.ts` (39 satr), keyin `update-admin.dto.ts` (4 satr), `signin-admin.dto.ts` (6 satr); o'ngda Swagger'dagi `POST /api/v1/admin` kartasi: «Example Value» — DTO'dagi `example` lardan yig'ilgan JSON (haqiqiy: `developer`, `+998885666999`, `Qosimov DinMuhammad`, `Developer1!`).
- Kod `create-admin.dto.ts` (haqiqiy, birinchi va oxirgi maydon):
  ```ts
  export class CreateAdminDto {
    @ApiProperty({
      type: 'string',
      description: 'user_name for admin',
      example: 'developer',
    })
    @IsString()
    @IsNotEmpty()
    username: string;
    …
    @ApiProperty({ type: 'string', description: 'Password for admin', example: 'Developer1!' })
    @IsStrongPassword()
    password: string;
  }
  ```
- Kod `update-admin.dto.ts` / `signin-admin.dto.ts` (haqiqiy):
  ```ts
  export class UpdateAdminDto extends PartialType(CreateAdminDto) {}

  export class SignInDto extends OmitType(CreateAdminDto, ['full_name', 'phone_number'] as const) {}
  ```
- Segmentlar:
  1. **Jadval shakli bor. Endi so'rovdan keladigan ma'lumot shakli — DTO. Entity bilan adashtirmang: Entity baza, DTO so'rov**
     Ovoz: «Jadval shaklini ko'rdik. Endi so'rovdan keladigan ma'lumotning shakli, DTO, Data Transfer Object. Entity bilan adashtirmang: Entity bazadagi jadval, DTO so'rovdagi ma'lumot. Parol Entity'da hashed password, DTO'da esa oddiy password, chunki mijoz ochiq parol yuboradi.»
  2. **Har maydonda ikki xil decorator: `@ApiProperty` — Swagger uchun, `@IsString`/`@IsNotEmpty` — tekshiruv uchun**
     Ovoz: «Create admin dto ni ochamiz. Har maydonda ikki xil decorator. ApiProperty Swagger uchun: tavsif va misol, siz Swagger'da ko'rgan Example Value shu yerdan keladi. IsString va IsNotEmpty tekshiruv uchun: ValidationPipe shu qoidalarni ishlatadi.» · 5–12-satr; Swagger kartasi
  3. **`@IsStrongPassword()` — katta harf, kichik harf, raqam, belgi, 8 belgi: shuning uchun `123` → 400**
     Ovoz: «Parolda IsStrongPassword: kamida sakkiz belgi, katta va kichik harf, raqam va belgi. Sakkizinchi ekranda bir ikki uch parol shu qoidaga tushib to'rt yuz bergan edi.» · 37–38-satr
  4. **`UpdateAdminDto = PartialType(CreateAdminDto)` — o'sha maydonlar, hammasi ixtiyoriy: PATCH'da faqat o'zgarganini yuborasiz**
     Ovoz: «Ikkinchi fayl bitta satr: Update admin dto Partial type Create admin dto dan. O'sha to'rt maydon, lekin hammasi ixtiyoriy. PATCH so'rovida faqat o'zgargan maydonni yuborasiz, qolgani tekshirilmaydi.» · Explorer `update-admin.dto.ts`
  5. **`SignInDto = OmitType(CreateAdminDto, ['full_name', 'phone_number'])` — faqat `username` va `password` qoladi**
     Ovoz: «Uchinchi fayl: Sign in dto Omit type bilan, full name va phone number olib tashlangan. Qolgani username va password, qoidalari bilan. Shuning uchun signin'da ham parol kuchli bo'lishi shart: o'ninchi ekrandagi bo'sh superadmin shu sabab kirolmagan edi, va noto'g'ri parol kuchsiz bo'lsa ham javob shu, password is not strong enough.» · Explorer `signin-admin.dto.ts`
  6. **`PartialType` va `OmitType` bu loyihada `@nestjs/swagger`dan — shunda Swagger ham to'g'ri ko'rsatadi**
     Ovoz: «Bir detal: Partial type va Omit type bu loyihada nestjs swagger paketidan import qilingan, nestjs mapped types'dan emas. Shunda Swagger ham hosila DTO'ni to'g'ri ko'rsatadi. O'quvchi AI yozgan kodda boshqa paketdan kelsa, ishlaydi, lekin Swagger'da maydonlar yo'qoladi.» · 1-satrlar
  7. **Xulosa: DTO uch fayl — create (qoidalar), update (PartialType), signin (OmitType); 400 shu yerdan**
     Ovoz: «Xulosa: resursning DTO'si odatda uch fayl: create, qoidalar bilan; update, Partial type; va kerak bo'lsa boshqa shakl, signin'dagi kabi Omit type. To'rt yuz javoblar shu fayllardan keladi. O'quvchi darsi buni buyurtma anketasi deydi.»
- Manba: repo `src/api/admin/dto/*.ts`; `nest2-out/09-validation.txt`, `06-requests.txt`.

## S12 · Repository: `forFeature` → `@InjectRepository` — bu Nest-1 dagi DI  ← `Lesson`
- Kicker: `3-bosqich · Repository` · Sarlavha: **Repository — jadval bilan ishlash metodlari; uni TypeORM beradi**
- Sahna: `Ide`, faol `src/core/repository/admin.repository.ts` (3 satr) → `src/api/admin/admin.module.ts` (13-satr) → `admin.service.ts` (31–37-satr). O'ngda Nest-1 S11 dagi DI sxemasi, uch qadam: `forFeature([AdminEntity])` o'qiydi → TypeORM `Repository<AdminEntity>` instance yasaydi → `@InjectRepository` konstruktorga beradi.
- Kod (haqiqiy):
  ```ts
  // src/core/repository/admin.repository.ts
  export type AdminRepository = Repository<AdminEntity>;

  // src/api/admin/admin.module.ts
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    JwtModule.register({ global: true }),
  ],

  // src/api/admin/admin.service.ts
  constructor(
    @InjectRepository(AdminEntity) private readonly adminRepo: AdminRepository,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(adminRepo);
  }
  ```
- Segmentlar:
  1. **Jadval va so'rov shakli bor. Jadvalga kim yozadi va o'qiydi? Repository — uchinchi qatlam**
     Ovoz: «Jadval shakli va so'rov shakli bor. Endi jadvalga kim yozadi va kim o'qiydi? Repository. Uchinchi qatlam, lekin uni siz yozmaysiz: TypeORM beradi. Repository'da tayyor metodlar bor: find, findOne, save, update, delete.»
  2. **`admin.repository.ts` bitta satr — tip: `Repository<AdminEntity>`. Fayl faqat nom berish uchun**
     Ovoz: «admin repository ts faylini ochamiz. Bitta satr: Admin repository bu Repository Admin entity dan. Bu faqat tip, nom berish uchun. Haqiqiy Repository instance'ini TypeORM yasaydi.» · 4-satr
  3. **Kim yasaydi? `admin.module.ts`da `TypeOrmModule.forFeature([AdminEntity])` — «shu modulga admins jadvali Repository'si kerak»**
     Ovoz: «Kim yasaydi? Admin module ts'ni ochamiz, imports'da TypeOrm module forFeature Admin entity. Bu Nest'ga aytadi: shu modulga admins jadvali uchun Repository kerak. TypeORM uni yasaydi va modulning providers'iga qo'shadi, siz yozmagan bo'lsangiz ham.» · Explorer `admin.module.ts`, 13-satr
  4. **Kim oladi? Service konstruktorida `@InjectRepository(AdminEntity)` — Nest-1 dagi DI, faqat tip emas, decorator bilan**
     Ovoz: «Kim oladi? Admin service ts, konstruktor. InjectRepository Admin entity, private readonly adminRepo. Bu Nest birinchi darsidagi Dependency Injection'ning o'zi: providers'da bor, konstruktorda so'raladi, Nest beradi. Farqi bitta: Repository'ni tip bo'yicha emas, InjectRepository decorator'i bilan so'raysiz.» · Explorer `admin.service.ts`, 32-satr; DI sxemasi 3-qadam
  5. **`forFeature` unutilsa — Nest-1 dagi o'sha xato: «can't resolve dependencies of the AdminService (?)» — argument `AdminEntityRepository`**
     Ovoz: «forFeature unutilsa nima bo'ladi? Nest birinchi darsidagi o'sha xato: can't resolve dependencies of the Admin service, so'roq belgisi. Dependency'ning nomi Admin entity Repository. Oltinchi bosqichda buni haqiqatda buzamiz.»
  6. **Xulosa: Repository = jadval bilan ishlash; `forFeature([Entity])` modulda, `@InjectRepository(Entity)` Service'da — ikkalasi juft**
     Ovoz: «Xulosa: Repository jadval bilan ishlash metodlari, TypeORM beradi. Siz ikki narsa yozasiz, ular juft: modulda forFeature Entity, Service konstruktorida InjectRepository Entity. Biri bo'lmasa server ishga tushmaydi. O'quvchi darsi buni omborchi deydi.»
- Manba: repo `src/core/repository/admin.repository.ts`, `src/api/admin/admin.module.ts`, `admin.service.ts`; xato matni — `nest2-out/12-break-forfeature.log` (car uchun, nomi almashadi).

## S13 · BaseService: hamma Service uchun tayyor CRUD va `successRes`  ← `Lesson`
- Kicker: `3-bosqich · BaseService` · Sarlavha: **BaseService — yetti tayyor metod, bitta javob shakli**
- Sahna: `Ide`, faol `src/infrastructure/base/base.service.ts` (79 satr, metodlar segment bilan yoritiladi); o'ngda `successRes.ts` (9 satr) kichik panel va haqiqiy javob namunasi `GET /api/v1/admin/all/admin`.
- Kod (haqiqiy, qisqartirilgan):
  ```ts
  export class BaseService<CreateDto, UpdateDto, Entity> {
    constructor(private readonly repository: Repository<any>) {}

    get getRepository() { return this.repository; }

    async create(dto: CreateDto): Promise<ISuccessRes> {
      let data = this.repository.create({ ...dto }) as any as Entity;
      data = await this.repository.save(data);
      return successRes(data, 201);
    }

    async findAll(options?: IFindOptions<Entity>): Promise<ISuccessRes> {
      const data = (await this.repository.find({ ...options })) as Entity[];
      return successRes(data);
    }

    async findAllWithPagination(options?) { return await RepositoryPager.findAll(this.getRepository, options); }

    async findOneById(id: string, options?): Promise<ISuccessRes> {
      const data = await this.repository.findOne({ …, where: { id, ...options?.where } });
      if (!data) {
        throw new HttpException('not found', 404);
      }
      return successRes(data);
    }

    async update(id: string, dto: UpdateDto): Promise<ISuccessRes> {
      await this.findOneById(id);
      await this.repository.update(id, dto as any);
      const data = await this.repository.findOne({ where: { id } });
      return successRes(data);
    }

    async remove(id: string): Promise<ISuccessRes> {
      await this.findOneById(id);
      await this.repository.delete(id);
      return successRes({});
    }
  }

  // src/infrastructure/response/successRes.ts
  export const successRes = (data: any, statusCode = 200): ISuccessRes => {
    return { statusCode, message: 'success', data };
  };
  ```
- Segmentlar:
  1. **Repository metodlarini kim chaqiradi? Nest-1 da Service'da o'zingiz yozgansiz. Bu yerda bir marta yozilgan — BaseService**
     Ovoz: «Repository'ning metodlarini kim chaqiradi? Nest birinchi darsida Service'da findAll, findOne, create'ni o'zingiz yozgansiz. Bu loyihada ular bir marta yozilgan, hamma resurs uchun: infrastructure papkasidagi Base service.»
  2. **Klass uchta tip oladi: `CreateDto`, `UpdateDto`, `Entity`; konstruktorda Repository — «qaysi jadval»**
     Ovoz: «Faylni ochamiz. Klass uchta tip oladi: Create dto, Update dto va Entity, ular qavs ichida, generic. Konstruktorda bitta narsa: repository, qaysi jadval bilan ishlash. Metodlar shu repository'ni chaqiradi.» · 12–13-satr
  3. **`create` — `repository.create` + `save`, javob `successRes(data, 201)`: 201 shu yerdan**
     Ovoz: «create metodi: repository create obyekt yasaydi, save bazaga yozadi, va successRes data, ikki yuz bir qaytaradi. Nest birinchi darsida ikki yuz birni Nest qo'ygan edi, bu yerda esa javob ichida ham yoziladi.» · 19–25-satr
  4. **`findAll` va `findAllWithPagination` — ro'yxat; `findOneById` — topilmasa `HttpException('not found', 404)`**
     Ovoz: «findAll ro'yxat qaytaradi, findAllWithPagination sahifalab, page va limit bilan. findOneById bittasini topadi, topilmasa HttpException not found, to'rt yuz to'rt. Filtr buni statusCode to'rt yuz to'rt, error message not found qilib qaytaradi.» · 27–38, 52–65-satr
  5. **`update` va `remove` avval `findOneById` ni chaqiradi — yo'q id'ga 404, bor bo'lsa yangilaydi yoki o'chiradi, `remove` → `data: {}`**
     Ovoz: «update va remove avval findOneById ni chaqiradi: id topilmasa to'rt yuz to'rt, topilsa yangilaydi yoki o'chiradi. remove'dan keyin javobda data bo'sh obyekt.» · 67–78-satr
  6. **`successRes` — hamma muvaffaqiyat bitta shaklda: `{ statusCode, message: 'success', data }`; frontend doim `data`ni o'qiydi**
     Ovoz: «Hamma metod successRes qaytaradi, to'qqiz satrli fayl: statusCode, message success va data. Xato filtri bilan juft: muvaffaqiyat bir shaklda, xato bir shaklda. Frontend doim data'ni o'qiydi.» · `successRes.ts` paneli; javob namunasi (haqiqiy, qisqartirilgan): `GET /api/v1/admin/all/admin` → `{"statusCode":200,"message":"success","data":[{"id":"1e46532b-…","username":"superadmin","role":"superAdmin","is_active":true,…}]}` · sahifalangan `GET /api/v1/admin` → `{"statusCode":200,"message":"success","data":[],"totalElements":0,"totalPages":0,"pageSize":10,"currentPage":1,"from":0,"to":0}` (superadmin ro'yxatda yo'q — Controller `role: admin` bilan filtrlaydi)
  7. **Xulosa: yangi Service `extends BaseService` — CRUD tekin; o'ziga xos logika kerak bo'lsa metodni ustiga yozadi**
     Ovoz: «Xulosa: yangi Service Base service'dan meros oladi va yetti metodni tekin oladi. O'ziga xos logika kerak bo'lsa, masalan parolni shifrlash, metodni ustiga yozadi. Keyingi ekranda aynan shuni admin service'da ko'ramiz. O'quvchi darsi buni tayyor retsept kitobi deydi.»
- Manba: repo `src/infrastructure/base/base.service.ts`, `response/successRes.ts`, `pagination/RepositoryPager.ts`; `nest2-out/08-auth-requests.txt`.

## S14 · `AdminService extends BaseService`: `super(adminRepo)`, superadmin, `create` ustiga yozilgan  ← `Lesson`
- Kicker: `3-bosqich · Service` · Sarlavha: **AdminService — meros + o'ziga xos uch ish**
- Sahna: `Ide`, faol `src/api/admin/admin.service.ts` (172 satr; 25–37, 38–59, 93–111-satrlar segment bilan yoritiladi, editor o'zi aylanadi — M15). O'ngda terminal satri `Super admin created successfully` va `POST /api/v1/admin` ikkinchi marta → 400 `Phone Number already exists` (haqiqiy — telefon avval tekshiriladi).
- Kod (haqiqiy, qisqartirilgan):
  ```ts
  @Injectable()
  export class AdminService extends BaseService<CreateAdminDto, UpdateAdminDto, AdminEntity> {
    constructor(
      @InjectRepository(AdminEntity) private readonly adminRepo: AdminRepository,
      private readonly crypto: CryptoService,
      private readonly tokenService: TokenService,
    ) {
      super(adminRepo);
    }
    async onModuleInit() {
      try {
        const { fullName, password, username, phone } = config.SuperAdmin;
        const existsSuperadmin = await this.adminRepo.findOne({ where: { role: UserRole.SUPER_ADMIN } });
        const hashedPassword = await this.crypto.encrypt(password);
        if (!existsSuperadmin) {
          const superadmin = this.adminRepo.create({ username, full_name: fullName, hashed_password: hashedPassword, phone_number: phone, role: UserRole.SUPER_ADMIN });
          await this.adminRepo.save(superadmin);
          console.log('Super admin created successfully');
        }
      } catch (error) {
        throw new InternalServerErrorException('error in creating super admin');
      }
    }

    async create(createAdminDto: CreateAdminDto) {
      const { password, username, phone_number, ...rest } = createAdminDto;
      const exist = await this.adminRepo.findOne({ where: { username } });
      …
      if (exist) throw new HttpException('Username already exists', 400);

      const hashed_password = await this.crypto.encrypt(password);

      return super.create({ ...rest, username, phone_number, hashed_password } as any);
    }
    …
  }
  ```
- Segmentlar:
  1. **BaseService'ni ko'rdik. Endi undan meros olgan haqiqiy Service — `admin.service.ts`: `@Injectable`, `extends BaseService`, uch tip**
     Ovoz: «Base service'ni ko'rdik. Endi undan meros olgan haqiqiy Service, admin service ts. Ustida Injectable, Nest birinchi darsidagidek. Keyin extends Base service, uchta tip bilan: Create admin dto, Update admin dto, Admin entity.» · 25–30-satr
  2. **Konstruktorda uch dependency: Repository, CryptoService, TokenService; `super(adminRepo)` — BaseService'ga jadvalni beradi**
     Ovoz: «Konstruktorda uchta dependency: Repository, InjectRepository bilan; Crypto service, parol uchun; Token service, token uchun. Va bitta muhim satr: super adminRepo. Bu Base service'ning konstruktorini chaqiradi va unga jadvalni beradi. Shu satr bo'lmasa CRUD ishlamaydi.» · 31–37-satr
  3. **`onModuleInit` — server ishga tushganda bir marta: superadmin yo'q bo'lsa, `.env`dagidan yaratadi — o'sha terminal satri**
     Ovoz: «onModuleInit metodi: Nest uni modul tayyor bo'lganda bir marta chaqiradi. U bazada superadmin bormi deb qaraydi, yo'q bo'lsa env'dagi ma'lumotdan yaratadi va terminalga Super admin created successfully yozadi. Uchinchi ekranda ko'rgan satr shu yerdan. Ikkinchi ishga tushirishda satr chiqmaydi, superadmin bor.» · 38–59-satr; terminal satri
  4. **`create` ustiga yozilgan: username va telefon bandmi tekshiradi → 400, parolni shifrlaydi, keyin `super.create`**
     Ovoz: «create metodi Base service'dagini ustiga yozadi, chunki admin'da o'ziga xos ish bor: username va telefon band emasmi, tekshiradi, band bo'lsa to'rt yuz: Phone Number already exists yoki Username already exists, telefon avval tekshiriladi. Parolni bcrypt bilan shifrlaydi. Keyin super create: saqlashni baribir Base service qiladi.» · 93–111-satr; javob `{"statusCode":400,"error":{"message":"Phone Number already exists"}}`
  5. **`findAll`, `findOneById`, `remove` yozilmagan — ular BaseService'dan; Controller ularni to'g'ridan-to'g'ri chaqiradi**
     Ovoz: «E'tibor bering: findAll, findOneById, remove bu faylda yo'q. Ular Base service'dan keladi, Controller ularni to'g'ridan-to'g'ri chaqiradi. Yozilgani faqat o'ziga xos ish: create, signIn, updateAdmin.»
  6. **Xulosa: Service = `extends BaseService` + `super(repo)` + faqat o'ziga xos metodlar; CRUD'ni qayta yozmaysiz**
     Ovoz: «Xulosa: bu loyihada Service shunday yoziladi: Base service'dan meros, super repo, va faqat o'ziga xos metodlar. CRUD qayta yozilmaydi. O'quvchi AI'ga Service yozdirganda AI ko'pincha findAll'ni qaytadan yozadi: ishlaydi, lekin ortiqcha, Base service bor deb ayting.»
- Manba: repo `src/api/admin/admin.service.ts`; `nest2-out/07-start-ok.log`, `09-validation.txt`.

## T2 · Tekshiruv 2 / 5 — qaysi satr boshqa qatlamniki?  ← `LineCheck`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 5 — qaysi satr xato?` · Sarlavha: **Bu Entity ishlaydi, lekin bitta satr boshqa qatlamniki**
- Shart (`task`): «Qoida: Entity jadval shaklini belgilaydi — har ustun `@Column`. Tekshirish qoidalari (`@IsString`, `@IsNumber`…) DTO'da turadi. Bu Entity'da bitta satr DTO'niki, va shu sabab jadvalda bitta ustun yetishmaydi. **O'sha satrni bosing.**»
- Ovoz (`q`, ko'prik bilan): «Beshta qatlamdan to'rttasini ko'rdingiz, endi o'zingiz tekshiring. Ikkinchi tekshiruv. Qoidani eslang: Entity jadval shakli, har ustun Column. Tekshirish qoidalari DTO'da. Ekrandagi Entity'da bitta satr DTO'niki va shu sabab jadvalda bitta ustun yetishmaydi. O'sha satrni bosing.»
- Fayl: `src/core/entity/car.entity.ts` (Explorer: `IntroNestArxitechture`, faol shu fayl) · `target: 10` (1-dan boshlab):
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
  10    @IsNumber()                      ← xato satr
  11    price: number;
  12
  13    @Column({ default: true })
  14    is_available: boolean;
  15  }
  ```
- Tuzatilgan (`fixed`): 10-satr chizilgan (`gone`), o'rniga yashil `@Column()` (`// ustun — Entity'da`); 2-satr import ham chizilgan. `fixedExtra`: `src/api/car/dto/create-car.dto.ts · price` — `@IsNumber()` yashil (`// qoida — DTO'da`).
- To'g'ri izoh (`ok`, ovoz): «To'g'ri. O'ninchi satr IsNumber, bu tekshirish qoidasi, u DTO'ga tegishli. Entity'da Column bo'lmasa TypeORM price ustunini yaratmaydi: jadvalda brand va is available bor, price yo'q, server esa xatosiz ishga tushadi, jim xato. Ekranda tuzatilgan holat: Entity'da Column, IsNumber esa create car dto'ga ko'chdi.» · qisqa: «10-satr: `@IsNumber` — DTO qoidasi. Entity'da `@Column()` bo'lmasa jadvalda `price` ustuni yaratilmaydi (xatosiz!). Tuzatildi: `@Column()` Entity'da, `@IsNumber()` DTO'da.»
- Maslahat (`hint`): «Bu satr Entity'ning o'z ishi: jadval nomi, meros yoki ustun. Ustun bo'lmagan, lekin qiymatni tekshiradigan decorator'ni qidiring.»
- Manba: qoida — TypeORM faqat `@Column` bilan belgilangan maydonlar uchun ustun yaratadi (repo `Base.entity.ts`, `admin.entity.ts` namunasi).

## P2 · Amaliyot 2 / 4 — signin, token, Swagger'da yopiq route  ← `Practice`
- Kicker: `Amaliyot 2 / 4` · Eyebrow: `Hozir o'zingizda · 5–7 daqiqa` · Sarlavha: **Tizimga kiring va yopiq route'ni oching** · `tableAt: 4`
- Segmentlar:
  1. **Endi siz: Swagger'da superadmin bilan kiring, token oling, yopiq route'ga so'rov yuboring — to'rt qadam**
     Ovoz: «Endi navbat sizga. Swagger'da superadmin bilan tizimga kirasiz, token olasiz va yopiq route'ga so'rov yuborasiz. To'rt qadam, besh-yetti daqiqa. Guard qanday ishlashini keyingi bosqichda kod bilan ko'ramiz, hozir qo'l bilan his qilasiz.»
  2. **1-qadam: `POST /api/v1/admin/signin` — `.env`dagi `USER_NAME` va `PASSWORD`; javobda `data.token`**
     Ovoz: «Birinchi: Swagger'da POST admin signin ni oching, Try it out, username va password env'dagi superadmin qiymatlari. Execute. Javob kodi ikki yuz bir, POST uchun Nest shunday qo'yadi; body'da statusCode ikki yuz va data ichida token. Token eyJ bilan boshlanadi.» · 1-qadam
  3. **2-qadam: tokenni nusxalang → yuqoridagi «Authorize» → kiriting → Authorize**
     Ovoz: «Ikkinchi: tokenni qo'shtirnoqsiz nusxalang, sahifa tepasidagi Authorize tugmasini bosing, maydonga qo'ying va Authorize. Endi qulf belgilari yopiq holatga o'tadi.» · 2-qadam
  4. **3-qadam: `GET /api/v1/admin/all/admin` → 200, `data` ichida superadmin · 4-qadam: Logout → yana so'rov → 401**
     Ovoz: «Uchinchi: GET admin all admin ni bajaring: ikki yuz, data ichida sizning superadmin'ingiz. To'rtinchi: Authorize oynasida Logout qiling va so'rovni qaytaring: to'rt yuz bir, Unauthorized. Ikkalasini ko'rish shart.» · 3-, 4-qadam
  5. **Isbot — tokenning birinchi 10 belgisi. Boshqacha chiqsa — jadval. Katakchalar va isbot bo'lmasa, Davom ochilmaydi**
     Ovoz: «Isbot maydoniga tokenning birinchi o'n belgisini yozing. Boshqacha chiqsa pastdagi jadval. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi.»
- Qadamlar:
  | # | Qadam | Qayerda | Kutilgan |
  |---|---|---|---|
  | 1 | Signin | Swagger → `POST /api/v1/admin/signin` → Try it out → `{"username": "<USER_NAME>", "password": "<PASSWORD>"}` → Execute | `201 Created` (POST) · body `{"statusCode":200,"message":"success","data":{"token":"eyJ…"}}` |
  | 2 | Authorize | token nusxa → «Authorize» (tepada) → maydon → Authorize | qulflar yopiq holatga o'tadi |
  | 3 | Yopiq route | `GET /api/v1/admin/all/admin` → Execute | `200` · `data[0].username` = sizning superadmin |
  | 4 | Tokensiz | Authorize → Logout → o'sha so'rov | `401` · `{"statusCode":401,"error":{"message":"Unauthorized"}}` |
- Isbot: «Tokenning birinchi 10 belgisi» · placeholder: «javobdagi token'dan nusxa» · tekshiruv: `/^eyJ[A-Za-z0-9_-]{7,}$/` (10 belgi, `eyJ` bilan boshlanadi) · xato: «Token `eyJ` bilan boshlanadi — javobdagi `data.token` qiymatidan nusxalang, qo'shtirnoqsiz».
- «Boshqacha chiqdi»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | signin → `400 password is not strong enough` | yozgan parolingiz kuchsiz — DTO bazadan oldin tekshiradi; yoki `.env`dagi `PASSWORD` kuchsiz/bo'sh (S9): kuchli parol yozing, bazadagi superadmin satrini o'chiring (`DELETE FROM admins WHERE role='superAdmin'`), serverni qayta ishga tushiring |
  | signin → `401 Admin not fount` | `username` `.env`dagi `USER_NAME` bilan bir xil emas (imlo repodan: «fount») |
  | signin → `400 username or password incorect` | parol kuchli, lekin noto'g'ri — `.env`dagi `PASSWORD` bilan solishtiring (imlo repodan: «incorect») |
  | 3-qadam → `401` | Authorize bosilmagan yoki token qo'shtirnoq bilan qo'yilgan |
  | 3-qadam → `403 Forbidden resource` | kirgan foydalanuvchi superadmin emas — `.env`dagi superadmin bilan kiring |
  | Hech biri emas | skrinshot + javob matni — mentor-kurs Telegram guruhiga |
- Manba: `nest2-out/07-signin.txt`, `08-auth-requests.txt`, `10-roles.txt`.

---

## S15 · `AuthGuard` — token bormi: yo'q bo'lsa 401, `'public'` bo'lsa tekshirmaydi  ← `Lesson`
- Kicker: `4-bosqich · Guard` · Sarlavha: **AuthGuard — so'rov Controller'ga yetguncha birinchi tekshiruv**
- Sahna: `Ide`, faol `src/common/guard/auth.guard.ts` (40 satr); o'ngda so'rov yo'li sxemasi (Nest-1 S5b uslubi, Explorer'siz — M19 istisno): Brauzer → **AuthGuard** (qizil) → RolesGuard → Controller → Service; nuqta Guard'da to'xtaydi va qizil «401» chiqadi; 5-segmentda `admin.controller.ts` 31–32-satr kichik panel (`@UseGuards(AuthGuard, RolesGuard)`).
- Kod (haqiqiy, qisqartirilgan):
  ```ts
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

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
        req.user = payload; // { id, role, ... } bo'lishi kerak
        return true;
      } catch {
        throw new UnauthorizedException();
      }
    }
  }
  ```
- Segmentlar:
  1. **Amaliyotda 401 va 200 ni ko'rdingiz. Kim qaror qildi? Controller emas — undan oldin turgan Guard**
     Ovoz: «Amaliyotda tokensiz to'rt yuz bir, token bilan ikki yuz oldingiz. Kim qaror qildi? Controller emas: so'rov Controller'ga yetmasdan to'xtadi. Buni Guard qiladi, qo'riqchi. Bu loyihada ikkita: Auth guard va Roles guard. Avval birinchisi.» · sxema: nuqta Guard'gacha
  2. **`canActivate` — bitta savolga javob: so'rov o'tsinmi? `true` — o'tadi, xato — to'xtaydi**
     Ovoz: «Auth guard ts. Klass CanActivate'ni amalga oshiradi: bitta metod, canActivate, bitta savol: so'rov o'tsinmi? true qaytarsa o'tadi, xato tashlasa shu yerda to'xtaydi va Controller umuman ishlamaydi.» · 14–17-satr
  3. **Avval `@Roles('public')` tekshiriladi — bo'lsa `return true`: shuning uchun signin tokensiz ishlaydi**
     Ovoz: «Birinchi ish: Reflector orqali route'ning Roles belgisini o'qiydi. Agar unda public bo'lsa, darhol true: token kerak emas. Shuning uchun signin tokensiz ishladi, unda Roles public turibdi. Kirish eshigi ochiq bo'lishi kerak, aks holda hech kim kirolmaydi.» · 19–23-satr
  4. **Keyin header: `Authorization: Bearer …` yo'q yoki `Bearer` bilan boshlanmasa → `UnauthorizedException` = 401**
     Ovoz: «Keyin so'rovning Authorization header'i o'qiladi. Yo'q bo'lsa yoki Bearer so'zi bilan boshlanmasa, Unauthorized exception, to'rt yuz bir. Swagger'dagi Authorize tugmasi aynan shu header'ni qo'shadi.» · 25–28-satr
  5. **Token tekshiriladi: `jwt.verify` kalit bilan — yaroqsiz yoki muddati o'tgan bo'lsa yana 401; yaroqli bo'lsa `req.user = payload`**
     Ovoz: «Token bor bo'lsa, jwt verify uni env'dagi kalit bilan tekshiradi: soxta yoki muddati o'tgan bo'lsa yana to'rt yuz bir. Yaroqli bo'lsa ichidagi ma'lumot, id va rol, so'rovga yoziladi: req user. Keyingi qo'riqchi shuni o'qiydi.» · 30–38-satr
  6. **Qayerda ulangan? `admin.controller.ts`: `@UseGuards(AuthGuard, RolesGuard)` — butun Controller uchun; `car`da yo'q, shuning uchun ochiq**
     Ovoz: «Guard qayerda ulangan? Admin controller ts, klass ustida: UseGuards Auth guard, Roles guard. Butun Controller uchun, har route'da yozilmaydi. Beshinchi bosqichda yozadigan car Controller'imizda UseGuards bo'lmaydi, shuning uchun u ochiq bo'ladi.» · kichik panel `admin.controller.ts` 31–33
  7. **Xulosa: 401 = «kim ekaningiz noma'lum» — token yo'q yoki yaroqsiz; yechim Authorize, kodga tegilmaydi**
     Ovoz: «Xulosa: to'rt yuz bir, kim ekaningiz noma'lum degani: token yo'q yoki yaroqsiz. Yechim kodda emas: signin qiling, tokenni Authorize'ga qo'ying. public route'lar tokensiz ochiq. Endi ikkinchi qo'riqchi: token bor, lekin ruxsat yetarlimi?»
- Manba: repo `src/common/guard/auth.guard.ts`, `src/api/admin/admin.controller.ts:31–47`; `nest2-out/08-auth-requests.txt` (401 soxta token, `Bearer`siz).

## S16 · `RolesGuard` va `@Roles` — rol mos kelmasa 403; `'ID'` — o'ziniki bo'lsa mumkin  ← `Lesson`
- Kicker: `4-bosqich · Guard` · Sarlavha: **RolesGuard — token bor, lekin bu eshik sizga ochiqmi?**
- Sahna: `Ide`, faol `src/common/guard/roles.guard.ts` (32 satr) → `src/common/decorator/roles-decorator.ts` (6 satr) → `admin.controller.ts` (39–47, 73–76, 102–107-satrlar). O'ngda haqiqiy javoblar: oddiy admin `ali` tokeni bilan `POST /api/v1/admin` → 403; `GET /api/v1/admin/<o'z id>` → 200; `GET /api/v1/admin/<superadmin id>` → 403.
- Kod (haqiqiy):
  ```ts
  // roles-decorator.ts
  export const ROLES_KEY = 'roles';
  export const Roles = (...roles: (UserRole | string)[]) => SetMetadata(ROLES_KEY, roles);

  // roles.guard.ts
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [ctx.getHandler(), ctx.getClass()]);

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
  }

  // admin.controller.ts
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) { … }

  @Roles('public')
  @Post('signin')
  signin(…) { … }

  @Roles(UserRole.SUPER_ADMIN, 'ID')
  @Get(':id')
  findOneById(@Param('id') id: string) { … }
  ```
- Segmentlar:
  1. **Token bor — kim ekaningiz ma'lum. Endi ikkinchi savol: bu eshik sizga ochiqmi? RolesGuard**
     Ovoz: «Auth guard'dan o'tdingiz: kim ekaningiz ma'lum. Ikkinchi qo'riqchi boshqa savol beradi: bu eshik aynan sizga ochiqmi? Roles guard. U route ustidagi Roles belgisi bilan tokendagi rolni solishtiradi.»
  2. **`@Roles(...)` — oddiy decorator: `SetMetadata` bilan route'ga rollar ro'yxatini yopishtiradi, boshqa hech narsa qilmaydi**
     Ovoz: «Avval belgi: roles decorator ts, ikki satr. Roles decorator'i SetMetadata bilan route'ga rollar ro'yxatini yopishtiradi, boshqa hech narsa qilmaydi. O'qiydigan Guard. O'quvchi darsida bu decorator'ni AI yozgan kodda ko'p ko'rasiz.» · Explorer `roles-decorator.ts`
  3. **Uch «o'tadi»: ro'yxat yo'q yoki `'public'` · rol ro'yxatda · `'ID'` va o'z id'si — qolgani `false` = 403**
     Ovoz: «Endi roles guard ts. Logika uch qator. Ro'yxat yo'q, bo'sh yoki public bo'lsa, o'tadi. Tokendagi rol ro'yxatda bo'lsa, o'tadi. Ro'yxatda ID so'zi bo'lsa va so'ralgan id tokendagi id bilan bir xil bo'lsa, o'tadi: o'zini o'zi ko'rishi mumkin. Qolgan hamma holat false: Nest buni to'rt yuz uch, Forbidden resource qiladi.» · 19–30-satr
  4. **Controller'da: `create` → faqat `SUPER_ADMIN`; `signin` → `'public'`; `findOneById` → `SUPER_ADMIN` yoki `'ID'`**
     Ovoz: «Admin controller'da ko'ramiz: create faqat superadmin, signin public, findOneById superadmin yoki ID, ya'ni oddiy admin faqat o'zini ko'ra oladi. Rol tokenda keladi, token esa signin'da bazadagi roldan yasalgan.» · Explorer `admin.controller.ts`
  5. **Haqiqiy sinov: oddiy admin `ali` tokeni — `POST /admin` → 403; `GET /admin/<o'z id>` → 200; `GET /admin/<superadmin id>` → 403**
     Ovoz: «Haqiqatda sinab ko'rdik: superadmin bilan ali degan oddiy admin yaratdik va uning tokeni bilan so'rov yubordik. POST admin: to'rt yuz uch, Forbidden resource. GET admin o'z id'si: ikki yuz. GET admin superadmin id'si: to'rt yuz uch. Token bor, lekin eshik yopiq.» · javoblar (haqiqiy): `POST /api/v1/admin` → `{"statusCode":403,"error":{"message":"Forbidden resource"}}` · `GET /api/v1/admin/<ali id>` → 200 · `GET /api/v1/admin/<superadmin id>` → 403 · `PATCH /api/v1/admin/<ali id>` → 200 (`'ID'`) · `DELETE /api/v1/admin/<ali id>` → 403 (faqat superAdmin)
  6. **Xulosa: 401 — token yo'q, 403 — token bor, rol yetmaydi; o'quvchi 403 desa — `@Roles` ro'yxatini va tokendagi rolni solishtiring**
     Ovoz: «Xulosa: to'rt yuz bir, token yo'q yoki yaroqsiz; to'rt yuz uch, token bor, lekin rol yetmaydi. O'quvchi to'rt yuz uch desa, ikki narsani solishtiring: route ustidagi Roles ro'yxati va tokendagi rol. Yechim ko'pincha Roles'dagi so'z: o'quvchi darsida POST order'ga admin yozib, mijozni kiritmay qo'yadi.»
- Qoida-karta: `401` = AuthGuard (token) · `403` = RolesGuard (rol) · `'public'` = ikkala Guard ham o'tkazadi · `'ID'` = o'z yozuvi.
- Manba: repo `src/common/guard/roles.guard.ts`, `src/common/decorator/roles-decorator.ts`, `src/api/admin/admin.controller.ts`; `nest2-out/10-roles.txt`.

## S17 · Signin oqimi: parol → token → cookie → `Authorize`  ← `Lesson`
- Kicker: `4-bosqich · token` · Sarlavha: **Token qayerdan keladi: signin oqimi**
- Sahna: `Ide`, faol `src/api/admin/admin.service.ts` (113–135-satrlar `signIn`), 4-segmentda `src/infrastructure/lib/token/Token.ts` (30–50); o'ngda so'rov yo'li: `POST /api/v1/admin/signin` → `AdminService.signIn` → bcrypt `compare` → `TokenService.accessToken` + `refreshToken` → javob `data.token` + `Set-Cookie: adminToken=…` (haqiqiy header).
- Kod (haqiqiy, qisqartirilgan):
  ```ts
  async signIn(signInDto: SignInDto, res: Response) {
    const { username, password } = signInDto;
    const admin = await this.adminRepo.findOne({ where: { username } });
    if (!admin) throw new HttpException('Admin not fount', 401);

    const isMatchPassword = await this.crypto.decrypt(password, admin?.hashed_password as any);
    if (!admin || !isMatchPassword)
      throw new BadRequestException('username or password incorect');

    const payload: IPayload = { id: admin.id, isActive: admin.is_active, role: admin.role };
    const accessToken = await this.tokenService.accessToken(payload);
    const refreshToken = await this.tokenService.refreshToken(payload);
    await this.tokenService.writeCookie(res, 'adminToken', refreshToken, 30 * 24);

    return successRes({ token: accessToken });
  }
  ```
- Segmentlar:
  1. **Ikki Guard tokenni tekshiradi. Token qayerdan keladi? Signin'dan — oqimni boshidan kuzatamiz**
     Ovoz: «Ikkala Guard tokenni tekshiradi. Token o'zi qayerdan keladi? Amaliyotda uni signin'dan oldingiz. Endi oqimni kod bilan kuzatamiz: admin service ts, signIn metodi.»
  2. **Avval DTO (kuchsiz parol → 400), keyin baza: `username` yo'q → 401 `Admin not fount`; parol mos emas → 400 `username or password incorect`**
     Ovoz: «So'rov bu metodga yetguncha DTO tekshiradi: parol kuchsiz bo'lsa to'rt yuz, password is not strong enough, metod ishlamaydi. Keyin bazadan username bo'yicha admin topiladi, yo'q bo'lsa to'rt yuz bir, Admin not fount, imlo repodagidek. Keyin bcrypt compare: ochiq parol bazadagi shifrlangan bilan solishtiriladi, mos kelmasa to'rt yuz, username or password incorect.» · 115–123-satr; javoblar (haqiqiy): `kimdir` → `{"statusCode":401,"error":{"message":"Admin not fount"}}` · `Notogri1!` → `{"statusCode":400,"error":{"message":"username or password incorect"}}` · `notogri` → `{"statusCode":400,"error":{"message":"password is not strong enough"}}`
  3. **Payload: `id`, `isActive`, `role` — tokenning ichidagi ma'lumot; RolesGuard aynan shu `role`ni o'qiydi**
     Ovoz: «Uchinchi: payload yig'iladi, id, isActive va role. Bu tokenning ichiga yoziladigan ma'lumot. Roles guard'da o'qilgan req user role aynan shu. Rol bazadan olinadi, so'rovdan emas: mijoz o'zini superadmin deb yubora olmaydi.» · 125–129-satr
  4. **Ikki token: `accessToken` 24 soat — javobda; `refreshToken` 30 kun — cookie'da (`httpOnly`), `POST /admin/token` yangisini beradi**
     Ovoz: «To'rtinchi: ikki token. Access token, env'da yigirma to'rt soat, javobda data token bo'lib keladi, siz uni Authorize'ga qo'ydingiz. Refresh token, o'ttiz kun, cookie'ga yoziladi, httpOnly, brauzer uni o'zi saqlaydi. Access token eskirsa POST admin token yangisini beradi. Token service ts shu ikkalasini jwt bilan imzolaydi.» · Explorer `Token.ts` 30–50; javob (haqiqiy): `HTTP/1.1 201 Created` · `Set-Cookie: adminToken=eyJ…; Max-Age=2592000; Path=/; Expires=…; HttpOnly` · body `{"statusCode":200,"message":"success","data":{"token":"eyJ…"}}` — HTTP kodi 201 (POST uchun Nest qo'yadi), body ichida 200 (`successRes` standarti): ikkalasi haqiqiy, o'quvchi so'rasa shuni ayting
  5. **Kalit `.env`dagi `Access_Token_Key`: bo'sh qolsa `config` unga `'secret'` so'zini beradi — ishlaydi, lekin kalit emas**
     Ovoz: «Imzo kaliti env'dagi Access Token Key. U bo'sh qolsa config secret so'zini oladi: ishlaydi, lekin bu kalit emas, hamma biladigan so'z. Env'da kalitni to'ldiring, openssl rand bilan, namunada yozilgan.»
  6. **Xulosa: signin → parol tekshiruvi → token (`role` ichida) → har so'rovda `Bearer` → AuthGuard o'qiydi, RolesGuard solishtiradi**
     Ovoz: «Xulosa, to'liq oqim: signin, bazada parol tekshiruvi, token, ichida rol. Keyin har so'rovda Bearer token, Auth guard uni o'qiydi, Roles guard rolni solishtiradi, Controller ishlaydi. O'quvchi darsida bu oqim qo'riqchi deyiladi; siz to'rt yuz bir va to'rt yuz uchni ajratib berasiz.»
- Manba: repo `src/api/admin/admin.service.ts:113–135`, `src/infrastructure/lib/token/Token.ts`, `src/config/index.ts:19–24`; `nest2-out/07-signin.txt`.

## T3 · Tekshiruv 3 / 5 — 401 mi, 403 mi?  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 5`
- Sarlavha: **O'quvchi: «Swagger'da `GET /api/v1/admin`ni bosdim — 401 chiqdi». Sabab?**
- Ovoz: «Ikkala qo'riqchini bilasiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi aytadi: Swagger'da GET admin ni bosdim, to'rt yuz bir chiqdi. Sabab nima? Variantni tanlang.»
- Variantlar (to'g'risi — 2):
  1. `.env`dagi superadmin paroli noto'g'ri
  2. Authorize bosilmagan — so'rovda token yo'q, AuthGuard to'xtatdi
  3. Uning roli `admin`, bu route faqat `superAdmin` uchun
  4. AdminModule `AppModule`ga ulanmagan
- To'g'ri izoh (ovoz): «Token yo'q. To'rt yuz bir Auth guard'dan keladi: Authorization header'i yo'q yoki Bearer bilan boshlanmaydi. Swagger'da bu Authorize bosilmagan degani. Signin qilib tokenni Authorize'ga qo'ysa, so'rov o'tadi yoki rol yetmasa to'rt yuz uch bo'ladi, bu boshqa xato.» · qisqa: «401 = AuthGuard: token yo'q. Yechim — signin → Authorize. Rol yetmasa 403 bo'lardi.»
- Xato izohlari: 1 — «Parol noto'g'ri bo'lsa signin'ning o'zi 400 berardi; bu yerda signin emas, GET so'rovi.» · 3 — «Rol yetmasa RolesGuard 403 Forbidden resource beradi, 401 emas.» · 4 — «Modul ulanmagan bo'lsa route topilmaydi — 404, 401 emas.»
- Manba: `nest2-out/06-requests.txt` (`GET /api/v1/admin` tokensiz → 401), `10-roles.txt` (403).

---

## S18 · 1-qadam: `car.entity.ts` — jadval shakli + `core/index.ts`ga export  ← `Lesson`
- Kicker: `5-bosqich · Entity` · Sarlavha: **car resursi, 1-qadam: Entity**
- Sahna: `Ide`, Explorer'da `src/core/entity/car.entity.ts` `fresh` bilan paydo bo'ladi (2-segment), faol; 5-segmentda `src/core/index.ts`. O'ngda yuqorida 5 qadamli yo'l (`Entity → DTO → Service → Controller → Module`, 1-qadam yoritilgan) — dars bo'yi S18–S22 da turadi.
- Kod `src/core/entity/car.entity.ts` (biz yozgan, haqiqiy yurgizilgan):
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
- Kod `src/core/index.ts` (oxiriga bir satr):
  ```ts
  export * from './entity/car.entity';
  ```
- Segmentlar:
  1. **Beshta qatlamni o'qidingiz. Endi o'zimiz yozamiz: car resursi — aynan o'quvchi darsi m4a-03 ning 5 qadami**
     Ovoz: «Beshta qatlamni admin misolida o'qidingiz, qo'riqchilarni ham. Endi o'zimiz yangi resurs yozamiz: car, mashinalar. Aynan o'quvchi darsi m4a-03 dagi tartib va nomlar bilan, chunki o'quvchi shuni qiladi. Birinchi qadam Entity.» · yo'l 1-qadam
  2. **`core/entity/car.entity.ts`: `@Entity('cars')`, `extends BaseEntity`, to'rt ustun — `brand`, `model`, `price`, `is_available`**
     Ovoz: «core entity papkasida yangi fayl: car entity ts. Entity decorator'i, jadval nomi cars. Base entity'dan meros: id, created at, updated at tekin. To'rt o'z ustuni: brand va model matn, price raqam, is available boolean, standart true.» · Explorer `fresh`; 4–16-satr
  3. **`price: number` → bazada `integer`; `id`ni yozmaymiz — o'quvchi yozsa, bu takror va xato**
     Ovoz: «Bir detal: price number deb yozilsa TypeORM bazada integer ustun yaratadi. Va id'ni yozmaymiz, u Base entity'dan keladi. O'quvchi darsida aynan shu tekshiriladi: id qatorini qo'lda yozgan o'quvchi xato qiladi.» · 13-satr
  4. **Nest-1 dagi `Car` bilan farq: `id` raqam emas, uuid; ma'lumot massivda emas, jadvalda**
     Ovoz: «Nest birinchi darsidagi Car bilan solishtiring: u yerda id bir, ikki, uch edi va ro'yxat massivda turardi. Bu yerda id uuid va ma'lumot bazadagi jadvalda. Shu farq oltinchi bosqichda bitta xatoga sabab bo'ladi.»
  5. **`core/index.ts` — Entity shu yerdan export qilinadi: `export * from './entity/car.entity'`; aks holda `from 'src/core'` import topmaydi**
     Ovoz: «Yana bir satr: core papkasidagi index ts hamma Entity'ni bir joydan export qiladi. Unga car entity'ni qo'shamiz. Aks holda keyingi fayllardagi import from src core Car entity'ni topmaydi. Bu loyihaning o'z qoidasi, o'quvchi darsida aytilmagan, siz bilib turing.» · Explorer `core/index.ts`
  6. **Xulosa: Entity yozildi — jadval hali yo'q: TypeORM uni server ishga tushganda yaratadi, lekin faqat modul ulangandan keyin**
     Ovoz: «Xulosa: Entity yozildi, lekin bazada cars jadvali hali yo'q. TypeORM uni server ishga tushganda yaratadi, lekin faqat Entity biror modulda forFeature bilan ro'yxatga olingandan keyin. Unga beshinchi qadamda yetamiz. Ikkinchi qadam DTO.»
- Manba: `nest2-out/src-car/car.entity.ts`, `core-index.ts`; `11-cars-requests.txt` (`\d cars` — `price integer`).

## S19 · 2-qadam: DTO — `create-car.dto.ts` va `update-car.dto.ts`  ← `Lesson`
- Kicker: `5-bosqich · DTO` · Sarlavha: **car resursi, 2-qadam: DTO — qoidalar**
- Sahna: `Ide`, Explorer'da `src/api/car/dto/create-car.dto.ts` va `update-car.dto.ts` `fresh`; faol create → update. O'ngda Swagger'da bo'ladigan «Example Value»: `{ "brand": "Chevrolet", "model": "Malibu", "price": 250, "is_available": true }`.
- Kod `create-car.dto.ts` (haqiqiy):
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
- Kod `update-car.dto.ts` (haqiqiy):
  ```ts
  import { PartialType } from '@nestjs/swagger';
  import { CreateCarDto } from './create-car.dto';

  export class UpdateCarDto extends PartialType(CreateCarDto) {}
  ```
- Segmentlar:
  1. **Jadval shakli bor. Endi so'rov shakli — `api/car/dto/` papkasida ikki fayl, admin'dagidek**
     Ovoz: «Jadval shakli tayyor. Ikkinchi qadam so'rov shakli: api papkasida car papkasini ochamiz, ichida dto papkasi, ikki fayl. Admin'da uchta edi, car'ga signin kerak emas.» · yo'l 2-qadam; Explorer `fresh`
  2. **`brand`, `model` — `@IsString` + `@IsNotEmpty`; `price` — `@IsNumber`; `is_available` — `@IsOptional` + `@IsBoolean`**
     Ovoz: «Create car dto: brand va model matn va bo'sh bo'lmasin, IsString, IsNotEmpty. price raqam, IsNumber. is available ixtiyoriy va boolean: IsOptional, IsBoolean. Yuborilmasa Entity'dagi standart true ishlaydi.» · 5–23-satr
  3. **Har maydonda `@ApiProperty({ example })` — Swagger'da Example Value shundan; ixtiyoriysi `@ApiPropertyOptional`**
     Ovoz: «Har maydonda ApiProperty, misol bilan: Swagger'da Try it out bosganda tayyor JSON chiqadi, o'quvchi uni o'zgartirib yuboradi. Ixtiyoriy maydonda ApiPropertyOptional.» · Swagger namunasi
  4. **`UpdateCarDto = PartialType(CreateCarDto)` — bitta satr, `@nestjs/swagger`dan**
     Ovoz: «Update car dto bitta satr: Partial type Create car dto dan, nestjs swagger paketidan. PATCH'da faqat o'zgargan maydon yuboriladi, masalan price.» · Explorer `update-car.dto.ts`
  5. **`price` matn bo'lib kelsa (`"250"`) — 400: `transform` bor, lekin `@Type(() => Number)` yo'q; JSON'da raqam yuboring**
     Ovoz: «Ehtiyot joy: price qo'shtirnoq ichida, matn bo'lib kelsa, to'rt yuz: price must be a number. transform yoqilgan, lekin matnni raqamga aylantirish uchun Type Number decorator'i kerak, sahifalash DTO'sidagidek. Oddiy yechim: JSON'da raqamni qo'shtirnoqsiz yuborish.» · javob (haqiqiy): `{"statusCode":400,"error":{"message":"price must be a number conforming to the specified constraints"}}`
  6. **Xulosa: DTO — ikki fayl, qoidalar faqat shu yerda; Entity'da qoida yo'q, DTO'da `@Column` yo'q**
     Ovoz: «Xulosa: DTO ikki fayl, qoidalar faqat shu yerda. Entity'da tekshirish qoidasi yo'q, DTO'da Column yo'q, ikkinchi tekshiruvdagi qoida. Uchinchi qadam Service.»
- Manba: `nest2-out/src-car/dto/*.ts`; `11-cars-requests.txt`.

## S20 · 3-qadam: `CarService extends BaseService` — sakkiz satr  ← `Lesson`
- Kicker: `5-bosqich · Service` · Sarlavha: **car resursi, 3-qadam: Service — meros, metod yozilmaydi**
- Sahna: `Ide`, `src/api/car/car.service.ts` `fresh`, faol. O'ngda solishtiruv kartasi: Nest-1 `cars.service.ts` (~30 satr: massiv, findAll, findOne, create) ↔ bu fayl (8 satr).
- Kod (haqiqiy):
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
- Segmentlar:
  1. **Shakllar tayyor. Uchinchi qadam — ish bajaradigan bo'lak, Service. Nest-1 da 30 satr edi, bu yerda sakkiz**
     Ovoz: «Shakllar tayyor. Uchinchi qadam ish bajaradigan bo'lak, Service. Nest birinchi darsida cars service'da o'ttizga yaqin satr yozgansiz: massiv, findAll, findOne, create. Bu yerda ish qismi sakkiz satr.» · yo'l 3-qadam; solishtiruv kartasi
  2. **`@Injectable()` — Nest-1 dagidek; `extends BaseService<CreateCarDto, UpdateCarDto, CarEntity>` — uch tip**
     Ovoz: «Injectable, Nest birinchi darsidagidek, usiz Nest klassni tanimaydi. Keyin extends Base service, uchta tip: Create car dto, Update car dto, Car entity. Shu satr bilan yetti CRUD metodi keldi.» · 9–10-satr
  3. **Konstruktor: `@InjectRepository(CarEntity) carRepo: Repository<CarEntity>` — TypeORM yasaydi, Nest beradi**
     Ovoz: «Konstruktorda bitta dependency: InjectRepository Car entity, carRepo, tipi Repository Car entity. Admin'da alohida tip fayli bor edi, bu yerda to'g'ridan yozdik, ikkalasi ham to'g'ri. Repository'ni TypeORM yasaydi, Nest konstruktorga beradi.» · 11–12-satr
  4. **`super(carRepo)` — eng muhim satr: BaseService'ga «cars jadvali bilan ishla»; unutilsa TypeScript xato beradi**
     Ovoz: «Va eng muhim satr: super carRepo. Base service'ning konstruktoriga jadvalni beramiz. Bu satr unutilsa TypeScript kompilyatsiyada xato beradi: Constructors for derived classes must contain a super call. O'quvchi darsi buni omborni ko'rsatish deydi.» · 13-satr
  5. **Metod yo'q — kerak emas: `create`, `findAll`, `findOneById`, `update`, `remove` BaseService'dan keladi**
     Ovoz: «Metod yo'q va kerak emas: create, findAll, findOneById, update, remove Base service'dan keladi. Mashinaga xos logika chiqsa, masalan chegirma, shu yerga yoziladi, Controller'ga emas, bu Nest birinchi darsidagi qoida.»
  6. **Xulosa: Service = `@Injectable` + `extends BaseService` + `super(repo)`; AI qaytadan CRUD yozsa — ortiqcha**
     Ovoz: «Xulosa: bu loyihada Service uch narsa: Injectable, extends Base service va super repo. O'quvchi AI'ga yozdirganda AI ko'pincha findAll'ni qaytadan yozadi, bu ishlaydi, lekin ortiqcha, Base service bor deb ayting. To'rtinchi qadam Controller.»
- Manba: `nest2-out/src-car/car.service.ts`; Nest-1 `src/mentor-kurs/parts/05-s12-s17.jsx` (cars.service.ts satr soni).

## S21 · 4-qadam: `CarController` — besh route, hammasi bir satrli  ← `Lesson`
- Kicker: `5-bosqich · Controller` · Sarlavha: **car resursi, 4-qadam: Controller — besh eshik**
- Sahna: `Ide`, `src/api/car/car.controller.ts` `fresh`, faol; har route segment bilan yoritiladi; o'ngda bo'lajak terminal satrlari (`Mapped {/api/v1/car, POST}` …) xira, 7-segmentda yonadi.
- Kod (haqiqiy):
  ```ts
  import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
  import { CarService } from './car.service';
  import { CreateCarDto } from './dto/create-car.dto';
  import { UpdateCarDto } from './dto/update-car.dto';

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
- Segmentlar:
  1. **Service tayyor. To'rtinchi qadam — so'rovni qabul qiladigan Controller: `@Controller('car')`, prefiks bilan `/api/v1/car`**
     Ovoz: «Service tayyor. To'rtinchi qadam so'rovni qabul qiladigan bo'lak, Controller. Controller car: o'quvchi darsida birlik, car. Global prefiks bilan manzil api v bir slesh car bo'ladi, buni Controller'da yozmaymiz.» · yo'l 4-qadam; 6–7-satr
  2. **Konstruktorda `CarService` — Nest-1 dagi DI; Service `providers`da bo'lsa, Nest beradi**
     Ovoz: «Konstruktorda Car service, private readonly. Nest birinchi darsidagi Dependency Injection: Service modulning providers ro'yxatida bo'lsa, Nest uni yaratib beradi.» · 8-satr
  3. **`@Post() create(@Body() dto: CreateCarDto)` — tip `CreateCarDto` bo'lgani uchun ValidationPipe aynan shu qoidalarni tekshiradi**
     Ovoz: «Birinchi eshik: Post, create, Body dto, tipi Create car dto. Tip shunchaki yozuv emas: global ValidationPipe aynan shu tipdagi qoidalarni tekshiradi. Tip any bo'lsa, tekshiruv yo'q.» · 10–13-satr
  4. **`@Get()` ro'yxat · `@Get(':id')` bittasi · `@Patch(':id')` o'zgartirish · `@Delete(':id')` o'chirish — har biri bir satr: `this.carService.…`**
     Ovoz: «Qolgan to'rt eshik: Get ro'yxat, Get id bittasi, Patch id o'zgartirish, Delete id o'chirish. Har birining ichida bitta satr: Car service'ning mos metodini chaqirish. Controller'da logika yo'q, Nest birinchi darsidagi qoida.» · 15–33-satr
  5. **`findOne` `findOneById`ni chaqiradi — metod nomlari BaseService'dagidek bo'lishi shart: `findOneById`, `update`, `remove`**
     Ovoz: «E'tibor bering: findOne eshigi Service'dagi findOneById ni chaqiradi. Metod nomlari Base service'dagidek bo'lishi shart: findOneById, update, remove. O'quvchi AI yozgan kodda findOne deb chaqirsa, TypeScript xato beradi: Property findOne does not exist.» · 20–23-satr
  6. **`@UseGuards` yo'q — bu Controller ochiq, tokensiz ishlaydi; kerak bo'lsa admin'dagidek klass ustiga qo'yiladi**
     Ovoz: «Bu Controller'da UseGuards yo'q, demak hamma eshik ochiq, tokensiz. O'quvchi darsi m4a-03 ham shunday. KitobShop'da esa yopiq eshiklar bo'ladi, u yerda admin'dagidek UseGuards va Roles qo'yiladi.»
  7. **Xulosa: besh eshik, har biri bir satr; terminalda beshta `Mapped {/api/v1/car…}` bo'ladi — lekin modul ulanmaguncha chiqmaydi**
     Ovoz: «Xulosa: besh eshik, har biri bir satr. Server ishga tushganda terminalda beshta Mapped api v bir car satri bo'ladi. Lekin hozir ishga tushirsak bo'lmaydi: Nest bu Controller'ni hali ko'rmaydi. Beshinchi qadam Module.» · terminal satrlari xira → yonadi
- Manba: `nest2-out/src-car/car.controller.ts`; `11-cars-start.log` (Mapped satrlari).

## S22 · 5-qadam: `CarModule` + `AppModule` → terminalda Mapped, bazada `cars` jadvali  ← `Lesson`
- Kicker: `5-bosqich · Module` · Sarlavha: **car resursi, 5-qadam: Module — ro'yxatga olish va ulash**
- Sahna: `Ide`, `src/api/car/car.module.ts` `fresh`, faol → `src/api/app.module.ts` (yashil `CarModule,` satri); 4-segmentda terminal (haqiqiy start:dev chiqishi), 5-segmentda psql `\d cars`.
- Kod `car.module.ts` (haqiqiy):
  ```ts
  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { CarEntity } from 'src/core';
  import { CarService } from './car.service';
  import { CarController } from './car.controller';

  @Module({
    imports: [TypeOrmModule.forFeature([CarEntity])],
    controllers: [CarController],
    providers: [CarService],
  })
  export class CarModule {}
  ```
- Kod `app.module.ts` (o'zgargan joy):
  ```ts
  import { CarModule } from './car/car.module';
  …
    imports: [
      ScheduleModule.forRoot(),
      TypeOrmModule.forRoot({ … }),
      AdminModule,
      AuthModule,
      CarModule,
    ],
  ```
- Segmentlar:
  1. **To'rt fayl bor, lekin Nest ularni ko'rmaydi. Beshinchi qadam — ro'yxat: `car.module.ts`**
     Ovoz: «To'rt fayl bor, lekin Nest ularni hali ko'rmaydi: Nest faqat ro'yxatdagini ko'radi, Nest birinchi darsidagi qoida. Beshinchi qadam ro'yxat, car module ts.» · yo'l 5-qadam
  2. **Uch ro'yxat: `imports: [TypeOrmModule.forFeature([CarEntity])]` — Repository shu yerdan; `controllers`; `providers`**
     Ovoz: «Module decorator'ida uch ro'yxat. imports: TypeOrm module forFeature Car entity, Car service'dagi Repository shu satrdan keladi. controllers: Car controller. providers: Car service. Nest birinchi darsida ikki ro'yxat edi, bu yerda uchinchisi forFeature.» · 7–11-satr
  3. **Keyin `app.module.ts`: `imports`ga `CarModule` — unutilsa server ishga tushadi, lekin `/api/v1/car` → 404, jim xato**
     Ovoz: «Keyin bosh modul: app module ts, imports ro'yxatiga Car module. Bu Nest birinchi darsidagi ikkinchi buzish: unutilsa server xatosiz ishga tushadi, lekin car route'lari yo'q, to'rt yuz to'rt. O'quvchi darsi buni Ochilish kuni deb alohida ekran qilgan.» · Explorer `app.module.ts`, yashil satr
  4. **`start:dev` terminali: `CarController {/api/v1/car}` va beshta `Mapped` — resurs tirik**
     Ovoz: «Saqlaymiz, start dev o'zi qayta yuklaydi. Terminal: Car module dependencies initialized, keyin Car controller api v bir car va beshta Mapped: POST, GET, GET id, PATCH id, DELETE id. Resurs tirik.» · terminal (haqiqiy):
     ```
     [Nest] LOG [InstanceLoader] CarModule dependencies initialized
     [Nest] LOG [RoutesResolver] CarController {/api/v1/car}:
     [Nest] LOG [RouterExplorer] Mapped {/api/v1/car, POST} route
     [Nest] LOG [RouterExplorer] Mapped {/api/v1/car, GET} route
     [Nest] LOG [RouterExplorer] Mapped {/api/v1/car/:id, GET} route
     [Nest] LOG [RouterExplorer] Mapped {/api/v1/car/:id, PATCH} route
     [Nest] LOG [RouterExplorer] Mapped {/api/v1/car/:id, DELETE} route
     [Nest] LOG [NestApplication] Nest application successfully started
     ```
  5. **Bazaga qaraymiz: `cars` jadvali o'zi paydo bo'ldi — `synchronize: true` Entity'dan yasadi; `price integer`, `id uuid`**
     Ovoz: «Va bazaga qaraymiz: cars jadvali paydo bo'ldi, uni hech kim yaratmadi. synchronize true Entity'dan jadval yasadi: id uuid, brand, model, price integer, is available standart true, created at, updated at. Bu faqat dev rejimida, NODE ENV dev.» · psql `\d cars` (haqiqiy):
     ```
     id           | uuid                        | not null | uuid_generate_v4()
     created_at   | timestamp without time zone | not null | now()
     updated_at   | timestamp without time zone | not null | now()
     brand        | character varying           | not null |
     model        | character varying           | not null |
     price        | integer                     | not null |
     is_available | boolean                     | not null | true
     ```
  6. **Xulosa: 5 qadam = 5 fayl + `core/index.ts` + `AppModule` satri; terminalda Mapped yo'q bo'lsa — avval `AppModule`ni oching**
     Ovoz: «Xulosa: besh qadam, besh fayl, plyus core index'dagi export va App module'dagi bitta satr. Terminalda car uchun Mapped bo'lmasa, birinchi ochadigan faylingiz app module ts. Endi so'rov yuboramiz.»
- Manba: `nest2-out/src-car/car.module.ts`, `app.module.ts`; `11-cars-start.log`, `11-cars-requests.txt`.

## S23 · So'rovlar: 201 · 200 · 200 · 200 · 200 va `data: {}`  ← `Lesson`
- Kicker: `5-bosqich · ishladi` · Sarlavha: **Beshta so'rov — haqiqiy javoblar** · `lockHint`: «Beshala so'rov tugmasini bosing»
- Sahna: Nest-1 S16 uslubi — beshta bosiladigan so'rov kartasi (`REQS`), javoblari haqiqiy; segment bilan ochiladi; Davom beshtasi bosilgach.
- So'rovlar (haqiqiy javoblar `nest2-out/11-cars-requests.txt` dan, qisqartirilgan):
  | # | So'rov | Javob |
  |---|---|---|
  | r1 | `POST /api/v1/car` `{"brand":"Chevrolet","model":"Malibu","price":250}` | `201` · `{"statusCode":201,"message":"success","data":{"brand":"Chevrolet","model":"Malibu","price":250,"is_available":true,"id":"efa80745-74d8-4b56-8ea1-f786f2fff787","created_at":"2026-10-30T21:51:37.138Z","updated_at":"2026-10-30T21:51:37.138Z"}}` |
  | r2 | `GET /api/v1/car` | `200` · `{"statusCode":200,"message":"success","data":[{…Malibu…},{…K5…}]}` |
  | r3 | `GET /api/v1/car/efa80745-74d8-4b56-8ea1-f786f2fff787` | `200` · bitta mashina |
  | r4 | `PATCH /api/v1/car/efa80745-74d8-4b56-8ea1-f786f2fff787` `{"price":240}` | `200` · `price: 240`, `updated_at` yangilangan |
  | r5 | `DELETE /api/v1/car/efa80745-74d8-4b56-8ea1-f786f2fff787` | `200` · `{"statusCode":200,"message":"success","data":{}}` |
- Segmentlar:
  1. **Resurs tirik. Endi Swagger'dan beshta so'rov — har javobni o'qiymiz**
     Ovoz: «Resurs tirik. Endi Swagger'dan beshta so'rov yuboramiz va har javobni o'qiymiz. Nest birinchi darsidagi javoblar bilan solishtiring, shakl boshqacha.»
  2. **`POST` → 201: `statusCode`, `message: success`, `data` ichida mashina — `id` uuid, `is_available: true` o'zi keldi, sanalar o'zi**
     Ovoz: «POST car, Malibu: ikki yuz bir. Javob successRes shaklida: statusCode ikki yuz bir, message success, data ichida mashina. id uuid, biz bermadik. is available true, biz bermadik, Entity'dagi standart. created at va updated at, TypeORM qo'ydi.» · r1
  3. **`GET` → 200, `data` massiv; `GET /:id` → 200, bitta; id uuid — 36 belgi**
     Ovoz: «GET car: ikki yuz, data massiv, ikki mashina. GET car id: ikki yuz, bittasi. Id o'ttiz olti belgili uuid, Swagger'da id maydoniga uni to'liq qo'yasiz.» · r2, r3
  4. **`PATCH {price: 240}` → 200, faqat narx o'zgardi, `updated_at` yangi — `UpdateCarDto` qolganini so'ramadi**
     Ovoz: «PATCH car id, faqat price ikki yuz qirq: ikki yuz, narx o'zgardi, updated at yangilandi, qolgan maydonlar joyida. Update car dto Partial type bo'lgani uchun qolganini so'ramadi.» · r4
  5. **`DELETE` → 200 va `data: {}` — BaseService `remove` shunday qaytaradi; qayta `GET` → 404 `not found`**
     Ovoz: «DELETE car id: ikki yuz, data bo'sh obyekt, Base service remove shunday qaytaradi. Shu id'ni qayta so'rasak to'rt yuz to'rt, error message not found.» · r5
  6. **Xulosa: hamma javob `successRes` shaklida, xato `error.message`da; beshala tugmani bosib ko'ring**
     Ovoz: «Xulosa: hamma muvaffaqiyat successRes shaklida, data ichida; xato esa error message'da. Endi beshala tugmani o'zingiz bosib, javoblarni o'qing. Davom beshtadan keyin ochiladi.»
- Manba: `nest2-out/11-cars-requests.txt`.

## T4 · Tekshiruv 4 / 5 — Controller'da bitta satr noto'g'ri joyda  ← `LineCheck`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 5 — qaysi satr xato?` · Sarlavha: **Bu Controller ishlaydi, lekin bitta satr DTO'ning ishini qilyapti**
- Shart (`task`): «Qoida: kiruvchi ma'lumotni tekshirish DTO'da — ValidationPipe o'zi 400 qaytaradi. Controller faqat so'rovdan oladi, Service'ni chaqiradi va natijani qaytaradi. Bu Controller'da bitta satr tekshiruv qilyapti. **O'sha satrni bosing.**»
- Ovoz (`q`): «car resursini yozdik, endi o'zingiz tekshiring. To'rtinchi tekshiruv. Qoidani eslang: kiruvchi ma'lumotni tekshirish DTO'da, ValidationPipe o'zi to'rt yuz qaytaradi. Controller faqat oladi, chaqiradi, qaytaradi. Ekrandagi Controller ishlaydi, lekin bitta satr tekshiruv qilyapti. O'sha satrni bosing.»
- Fayl: `src/api/car/car.controller.ts` (Explorer faol) · `target: 11`:
  ```ts
   1  import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
   2  import { CarService } from './car.service';
   3  import { CreateCarDto } from './dto/create-car.dto';
   4
   5  @Controller('car')
   6  export class CarController {
   7    constructor(private readonly carService: CarService) {}
   8
   9    @Post()
  10    create(@Body() dto: CreateCarDto) {
  11      if (!dto.brand) throw new BadRequestException('brand kerak');     ← xato satr
  12      return this.carService.create(dto);
  13    }
  14
  15    @Get()
  16    findAll() {
  17      return this.carService.findAll();
  18    }
  19
  20    @Get(':id')
  21    findOne(@Param('id') id: string) {
  22      return this.carService.findOneById(id);
  23    }
  24  }
  ```
- Tuzatilgan (`fixed`): 11-satr chizilgan, `create` yana bir satr (`// tekshiruvni DTO qiladi`); `fixedExtra`: `src/api/car/dto/create-car.dto.ts · brand` — `@IsString() @IsNotEmpty() brand: string;` yashil (`// bo'sh brand → 400, ValidationPipe`).
- To'g'ri izoh (`ok`, ovoz): «To'g'ri. O'n birinchi satr brand bo'shligini tekshiryapti. Bu ish DTO'niki: Create car dto'da IsNotEmpty bor va global ValidationPipe bo'sh brand'ga o'zi to'rt yuz qaytaradi, brand should not be empty. Controller'da tekshiruv ikki marta bajariladi va xabar ikki xil bo'ladi. Ekranda tuzatilgan holat: Controller'da yana bir satr, qoida DTO'da.» · qisqa: «11-satr: tekshiruv Controller'da — DTO va ValidationPipe buni qiladi (`brand should not be empty`, 400). Tuzatildi: satr olindi, qoida `create-car.dto.ts`da.»
- Maslahat (`hint`): «Bu satr Controller'ning o'z ishi: olish, chaqirish yoki qaytarish. Kelgan ma'lumotni tekshirib, xato tashlayotgan satrni qidiring.»
- Manba: `nest2-out/11-cars-requests.txt` (`POST {}` → 400 `brand should not be empty, …`).

## P3 · Amaliyot 3 / 4 — car resursini o'zingiz qo'shing  ← `Practice`
- Kicker: `Amaliyot 3 / 4` · Eyebrow: `Hozir o'zingizda · 15–20 daqiqa` · Sarlavha: **car resursini o'z loyihangizga qo'shing** · `tableAt: 6` · `code`: 5 fayl + `core/index.ts` + `app.module.ts` (har qadam ichida «Kodni ochish · fayl» — M11; «namuna — o'zingiz yozing»)
- Segmentlar:
  1. **Endi siz: o'quvchi «Ochilish kuni»da qiladigan ishni o'zingiz qilasiz — 5 qadam, 7 fayl**
     Ovoz: «Endi navbat sizga. O'quvchi darsining oxirida Ochilish kuni bor: u car resursini o'z loyihasida tirik qiladi. Siz buni hozir qilasiz. Besh qadam, yettita faylga tegasiz. Har qadamda Kodni ochish tugmasi bor: namuna, o'zingiz yozing.»
  2. **1–2-qadam: `car.entity.ts` + `core/index.ts`ga export; `dto/` ikki fayl**
     Ovoz: «Birinchi: core entity'da car entity ts va core index'ga export satri. Ikkinchi: api car dto'da create va update.» · 1-, 2-qadam
  3. **3–4-qadam: `car.service.ts` (sakkiz satr), `car.controller.ts` (besh eshik)**
     Ovoz: «Uchinchi: car service ts, sakkiz satr, super carRepo unutilmasin. To'rtinchi: car controller ts, besh eshik, metod nomlari Base service'dagidek.» · 3-, 4-qadam
  4. **5-qadam: `car.module.ts` + `AppModule` → terminalda 5 Mapped; 6-qadam: Swagger'da `POST /api/v1/car` → 201 — isbot `data.id`ning birinchi 8 belgisi**
     Ovoz: «Beshinchi: car module ts va App module imports'iga Car module. Terminalda beshta Mapped api v bir car. Oltinchi: Swagger'da POST car, Malibu: ikki yuz bir. Javobdagi data id'ning birinchi sakkiz belgisini isbot maydoniga yozing.» · 5-, 6-qadam
  5. **Boshqacha chiqsa — jadval. Oltala katakcha va isbot bo'lmasa, Davom ochilmaydi**
     Ovoz: «Boshqacha chiqsa pastdagi jadval, sinfda ham shu jadval ishlaydi. Oltala katakcha va isbot bo'lmasa, Davom ochilmaydi.»
- Qadamlar:
  | # | Qadam | Fayl | Kutilgan |
  |---|---|---|---|
  | 1 | Entity | `src/core/entity/car.entity.ts` + `src/core/index.ts` (`export * from './entity/car.entity'`) | kompilyatsiya xatosiz |
  | 2 | DTO | `src/api/car/dto/create-car.dto.ts` · `update-car.dto.ts` | — |
  | 3 | Service | `src/api/car/car.service.ts` — `extends BaseService`, `super(carRepo)` | — |
  | 4 | Controller | `src/api/car/car.controller.ts` — `@Controller('car')`, 5 route | — |
  | 5 | Module | `src/api/car/car.module.ts` + `app.module.ts` → `imports: [..., CarModule]` | terminal: `CarController {/api/v1/car}` + 5 `Mapped` |
  | 6 | Swagger | `POST /api/v1/car` → `{"brand":"Chevrolet","model":"Malibu","price":250}` | `201` · `data.id` uuid |
- Isbot: «`POST /api/v1/car` javobidagi `data.id`ning birinchi 8 belgisi» · placeholder: «javobdagi id'dan 8 belgi» · tekshiruv: `/^[0-9a-f]{8}$/i` · xato: «uuid 0–9 va a–f belgilaridan: `data.id` qiymatining boshidan 8 ta belgi, defisgacha».
- «Boshqacha chiqdi»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `Cannot find module 'src/core'` yoki `CarEntity` topilmadi | `core/index.ts`ga export satri yozilmagan (S18) |
  | `Nest can't resolve dependencies of the CarService (?)` … `CarEntityRepository` | `car.module.ts`da `TypeOrmModule.forFeature([CarEntity])` yo'q (S12) |
  | Server ishga tushdi, lekin car uchun `Mapped` yo'q, `/api/v1/car` → 404 `Cannot GET /api/v1/car` | `AppModule` `imports`da `CarModule` yo'q |
  | `Property 'findOne' does not exist on type 'CarService'` | metod nomi `findOneById` (S21) |
  | `Constructors for derived classes must contain a 'super' call` | `super(carRepo)` unutilgan (S20) |
  | `POST` → 400 `price must be a number…` | JSON'da `"price": "250"` matn — qo'shtirnoqsiz raqam |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `nest2-out/src-car/`, `11-cars-start.log`, `11-cars-requests.txt`, `12-break-forfeature.log`, `13-break-appmodule.txt`.

---

## S24 · Buzamiz 1: `forFeature` yo'q → «can't resolve dependencies of the CarService (?)»  ← `Lesson`
- Kicker: `6-bosqich · buzamiz 1` · Sarlavha: **Buzamiz 1: `TypeOrmModule.forFeature` olib tashlandi**
- Sahna: `Ide`, faol `src/api/car/car.module.ts` — buzilgan holat (`imports: [TypeOrmModule.forFeature([CarEntity])]` chizilgan, `imports: []` yashil); 2-segmentdan terminal — qizil xabar (haqiqiy, bo'laklab yoritiladi: `e-who` · `e-what` · `e-where` · `e-solutions`); 6-segmentda tuzatilgan kod + yashil terminal (M3).
- Terminal (haqiqiy, `nest2-out/12-break-forfeature.log`):
  ```
  [Nest] ERROR [ExceptionHandler] UnknownDependenciesException [Error]: Nest can't resolve dependencies of the CarService (?).
  Please make sure that the argument "CarEntityRepository" at index [0] is available in the CarModule module.

  Potential solutions:
  - Is CarModule a valid NestJS module?
  - If "CarEntityRepository" is a provider, is it part of the current CarModule?
  - If "CarEntityRepository" is exported from a separate @Module, is that module imported within CarModule?
    @Module({
      imports: [ /* the Module containing "CarEntityRepository" */ ]
    })
  ```
- Tuzatilgan terminal (haqiqiy, `11-cars-start.log`): `CarModule dependencies initialized` · `CarController {/api/v1/car}:` · 5 ta `Mapped {/api/v1/car…}` · `Nest application successfully started`.
- Segmentlar:
  1. **Ishlaydigan resurs bor. Endi ataylab buzamiz — o'quvchi va uning agenti aynan shu xatolarni qiladi. 1-holat: `forFeature` yo'q**
     Ovoz: «Resurs ishlayapti. Endi uni ataylab buzamiz, chunki o'quvchingiz va uning agenti aynan shu xatolarni qiladi, siz esa xabarni o'qiy olishingiz kerak. Birinchi holat: car module ts'da imports'dan TypeOrm module forFeature satrini o'chirdik.» · kod: `gone`/`neu`
  2. **Server yiqildi. 1-bo'lak — qaysi klass: `CarService (?)` — Service'ning dependency'si topilmadi**
     Ovoz: «Serverni ishga tushiramiz, u yiqiladi. Nest birinchi darsidagi uch savol bilan o'qiymiz. Qaysi klass: Nest can't resolve dependencies of the Car service. Bu safar Controller emas, Service'ning dependency'si topilmadi. Qavsdagi so'roq belgisi o'sha o'rin.» · `e-who`
  3. **2-bo'lak — qaysi dependency: `"CarEntityRepository" at index [0]` — konstruktordagi birinchi parametr, Repository**
     Ovoz: «Qaysi dependency: argument Car entity Repository, index nol. Konstruktordagi birinchi parametr, InjectRepository bilan so'ralgan Repository. Repository so'zini ko'rdingizmi, demak gap forFeature'da.» · `e-what`
  4. **3-bo'lak — qaysi fayl: `in the CarModule module` → `car.module.ts`; javob `providers`da emas, `imports`da**
     Ovoz: «Qaysi fayl: in the Car module module, demak car module ts. Nest birinchi darsida javob providers'da edi. Bu safar providers'da hammasi joyida, javob imports'da: Repository'ni TypeOrm module forFeature beradi.» · `e-where`
  5. **Nest yechimni o'zi aytadi: uchinchi band — `imports: [ /* the Module containing "CarEntityRepository" */ ]`**
     Ovoz: «Pastda Nest yechimlarni sanaydi. Uchinchisi bizniki: Car entity Repository boshqa moduldan keladimi, o'sha modul imports'da bormi? Hatto namuna yozilgan: imports, Repository'ni beradigan modul. Bu TypeOrm module forFeature Car entity.» · `e-solutions`
  6. **Tuzatamiz: `imports: [TypeOrmModule.forFeature([CarEntity])]` qaytdi — `CarModule dependencies initialized`, 5 Mapped**
     Ovoz: «Tuzatamiz: car module ts'ga forFeature satrini qaytaramiz va saqlaymiz. Terminal: Car module dependencies initialized, Car controller api v bir car, beshta Mapped, successfully started.» · tuzatilgan kod + yashil terminal
  7. **Xulosa: xabarda `…Repository` so'zi bo'lsa — modul faylining `imports`ini oching: `forFeature([Entity])` bormi**
     Ovoz: «Xulosa: can't resolve dependencies xabarida Repository so'zi bo'lsa, javob modul faylining imports'ida: forFeature Entity bormi? Qaysi klass, qaysi dependency, qaysi fayl formulasi o'zgarmaydi, faqat ro'yxat boshqa.»
- Qoida-karta: `…Service (?)` + `…EntityRepository` → `<resurs>.module.ts` → `imports: [TypeOrmModule.forFeature([<Entity>])]`.
- Manba: `nest2-out/12-break-forfeature.log`, `11-cars-start.log`, `src-car/car.module.ts`.

## S25 · Buzamiz 2: so'rov DTO'ga mos emas — ortiqcha maydon va noto'g'ri tip  ← `Lesson`
- Kicker: `6-bosqich · buzamiz 2` · Sarlavha: **Buzamiz 2: so'rovni buzamiz — 400 ning ikki ko'rinishi**
- Sahna: `Ide`, faol `src/api/car/dto/create-car.dto.ts` (qoidalar yoritiladi); o'ngda uchta so'rov kartasi: `color` bilan → 400 · `price: "145"` → 400 · to'g'ri → 201 (hammasi haqiqiy).
- Segmentlar:
  1. **Kodni buzdik. Endi kodga tegmaymiz — so'rovni buzamiz: o'quvchi va agent eng ko'p shu yerda adashadi**
     Ovoz: «Birinchi holatda kodni buzdik. Ikkinchisida kodga tegmaymiz, so'rovni buzamiz: o'quvchi va agent eng ko'p shu yerda adashadi, chunki DTO bitta narsani kutadi, so'rov boshqasini yuboradi.»
  2. **So'rovga `color: "oq"` qo'shdik → 400 `property color should not exist` — `forbidNonWhitelisted`**
     Ovoz: «Birinchi: hamma maydon to'g'ri, lekin so'rovga color oq qo'shdik. Javob to'rt yuz, property color should not exist. Bu uchinchi farq, forbidNonWhitelisted: DTO'da yo'q maydon xato. Agent Entity'ga color qo'shib, DTO'ga qo'shmagan bo'lsa, o'quvchi aynan shuni ko'radi.» · 1-karta: `{"statusCode":400,"error":{"message":"property color should not exist"}}`
  3. **`price: "145"` — qo'shtirnoq ichida → 400 `price must be a number conforming to the specified constraints`**
     Ovoz: «Ikkinchi: price'ni qo'shtirnoq ichida yubordik, bir yuz qirq besh matn bo'lib. To'rt yuz: price must be a number. Son yozilgan, lekin tipi matn. Swagger'da Example Value'ni o'zgartirganda o'quvchi qo'shtirnoqni qoldirib qo'yadi.» · 2-karta: `{"statusCode":400,"error":{"message":"price must be a number conforming to the specified constraints"}}`
  4. **Tuzatish so'rovda: `color`ni olib tashlang, `price` qo'shtirnoqsiz → 201. Maydon kerak bo'lsa — Entity'ga `@Column` VA DTO'ga qoida, ikkalasiga**
     Ovoz: «Tuzatish kodda emas, so'rovda: color'ni olib tashlaymiz, price'ni qo'shtirnoqsiz yozamiz, ikki yuz bir. Agar color haqiqatan kerak bo'lsa, ikki joyga qo'shiladi: Entity'ga Column va DTO'ga qoida. Biriga qo'shib, ikkinchisini unutish, eng ko'p uchraydigan agent xatosi.» · 3-karta: `{"statusCode":201,"message":"success","data":{…,"brand":"Chevrolet","model":"Malibu","price":250,"is_available":true}}`
  5. **Xulosa: 400 ni xabari bilan o'qing — `should not exist` → ortiqcha maydon; `must be a …` → tip; `should not be empty` → bo'sh. Hammasi DTO'ga qarab**
     Ovoz: «Xulosa: to'rt yuzni xabari bilan o'qing. should not exist, ortiqcha maydon. must be a number, must be a string, tip. should not be empty, bo'sh. Uchalasi DTO'ga nisbatan: javob doim DTO fayli bilan so'rovni yonma-yon qo'yish.»
- Manba: `nest2-out/11-cars-requests.txt` (`color`, `"145"`, to'g'ri POST).

## S26 · Buzamiz 3: `/api/v1/car/1` → 500 — id uuid; `ParseUUIDPipe` bilan 400  ← `Lesson`
- Kicker: `6-bosqich · buzamiz 3` · Sarlavha: **Buzamiz 3: `GET /car/1` — 500, terminalda uuid xatosi**
- Sahna: `Browser` `localhost:3000/api/v1/car/1` → qizil javob; terminal — haqiqiy `QueryFailedError`; 4-segmentdan `Ide` `car.controller.ts` — `findOne` satri o'zgaradi (`ParseUUIDPipe` yashil), javob 400 (haqiqiy); 5-segmentda to'g'ri uuid → 200.
- Haqiqiy chiqishlar: `GET /api/v1/car/1` → `{"statusCode":500,"error":{"message":"Internal server error"}}` · terminal: `QueryFailedError: invalid input syntax for type uuid: "1"` · `ParseUUIDPipe` bilan → `{"statusCode":400,"error":{"message":"Validation failed (uuid is expected)"}}` · `GET /api/v1/car/1746997c-5bde-46eb-8917-5b974105fac8` → 200.
- Kod (tuzatish, haqiqiy yurgizilgan):
  ```ts
  import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
  …
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.carService.findOneById(id);
    }
  ```
- Segmentlar:
  1. **O'quvchi Nest-1 dagi odat bilan `/api/v1/car/1` ni ochadi — 500. Kod to'g'ri, so'rov noto'g'ri; lekin 500 yomon javob**
     Ovoz: «Uchinchi holat o'quvchi odatidan chiqadi: cars api'da mashinalar bir, ikki, uch edi. U api v bir car slesh bir ni ochadi. Besh yuz, Internal server error. Kod to'g'ri, so'rov noto'g'ri, lekin besh yuz yomon javob: o'quvchi nima bo'lganini bilmaydi.» · brauzer
  2. **Terminalni o'qiymiz: `QueryFailedError: invalid input syntax for type uuid: "1"` — PostgreSQL «1» ni uuid deb o'qiy olmadi**
     Ovoz: «Sakkizinchi ekrandagi qoida: besh yuz bo'lsa terminalni o'qing. QueryFailedError, invalid input syntax for type uuid, bir. So'rov bazaga yetib bordi, PostgreSQL id ustuni uuid, bir degan matnni uuid deb o'qiy olmadi va xato qaytardi. Oddiy Error, filtr besh yuz qildi.» · terminal
  3. **Birinchi javob: so'rovda to'g'ri uuid — `GET /api/v1/car/<uuid>` → 200; id javobdagi `data.id`dan nusxalanadi**
     Ovoz: «Birinchi javob so'rovda: id'ni javobdagi data id'dan nusxalab yuborish. To'g'ri uuid bilan ikki yuz. O'quvchiga shuni ayting: bu loyihada id raqam emas.» · 200 javobi
  4. **Ikkinchi javob kodda: `@Param('id', ParseUUIDPipe)` — noto'g'ri id bazaga bormaydi, 400 `Validation failed (uuid is expected)`**
     Ovoz: «Ikkinchi javob kodda, loyihani yaxshilaydi: Controller'da Param id ga ParseUUIDPipe qo'shamiz. Endi noto'g'ri id bazaga bormaydi: to'rt yuz, Validation failed, uuid is expected. Nest birinchi darsidagi ParseIntPipe'ning uuid'li akasi. Biz buni haqiqatda yurgizdik.» · `Ide` `car.controller.ts`, 400 javobi
  5. **Tekshiramiz: `/car/1` → 400 tushunarli xabar bilan, `/car/<uuid>` → 200 — server ishlayveradi**
     Ovoz: «Tekshiramiz: car slesh bir endi to'rt yuz va tushunarli xabar, car slesh uuid ikki yuz. Server ishlayveradi, terminalda besh yuz yo'q.» · ikki javob
  6. **Xulosa: 500 ko'rsangiz terminalni o'qing — `invalid input syntax for type uuid` bo'lsa id raqam yuborilgan; `ParseUUIDPipe` buni 400 qiladi**
     Ovoz: «Xulosa: besh yuz ko'rsangiz terminalni o'qing. invalid input syntax for type uuid bo'lsa, id o'rniga raqam yuborilgan. O'quvchiga javob: id uuid, nusxalang. Loyihaga javob: ParseUUIDPipe, besh yuz o'rniga to'rt yuz.»
- Manba: `nest2-out/11-cars-requests.txt` (`/car/1` 500 + server log), `19-parseuuid.txt` (400 va 200), `19-parseuuid.log`.

## S27 · Buzamiz 4: `NODE_ENV` noto'g'ri — loyiha boshqa bazani qidiradi, xabar sababni yashiradi  ← `Lesson`
- Kicker: `6-bosqich · buzamiz 4` · Sarlavha: **Buzamiz 4: `.env`da `NODE_ENV=prod` — ikki xil yiqilish**
- Sahna: `Ide`, faol `.env` (`NODE_ENV=prod` qizil) + `config/index.ts` 11–17-satrlar; terminal ikki holat uchun (haqiqiy); 5-segmentda `.env` tuzatilgan (`NODE_ENV=dev` yashil) + yashil terminal.
- Terminal (haqiqiy):
  ```
  # 1-ko'rinish — prod bazasi yo'q (nest2-out/14-nodeenv-prod-no-db.log; o'quvchida nomi db_prod)
  [Nest] ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...
  error: database "nest2_prod" does not exist
  …  (9 marta qayta urinadi, keyin yiqiladi)

  # 2-ko'rinish — baza bor, lekin bo'sh: synchronize false, jadval yaratilmaydi (14-nodeenv-prod-empty-db.log)
  [Nest] LOG [RoutesResolver] AdminController {/api/v1/admin}:
  [Nest] LOG [RoutesResolver] CarController {/api/v1/car}:
  src/api/admin/admin.service.ts:57
        throw new InternalServerErrorException('error in creating super admin');
  InternalServerErrorException: error in creating super admin
  ```
- Segmentlar:
  1. **Oxirgi holat `.env`dan: o'quvchi `NODE_ENV=prod` yozdi yoki qatorni o'chirdi. O'ninchi ekrandagi config'ni eslang**
     Ovoz: «Oxirgi holat kodda emas, env'da. O'quvchi NODE ENV ga prod yozdi, yoki qatorni o'chirib yubordi. O'ninchi ekrandagi config'ni eslang: dev bo'lmasa loyiha PROD DB URL'ni oladi va synchronize o'chadi. Ikki xil yiqilish bo'ladi.» · `.env`, `config` 11–17
  2. **1-ko'rinish: prod bazasi yo'q — `Unable to connect… database "db_prod" does not exist`, 9 urinish, yiqiladi. Bu Nest-1 Rdb 4-xabari**
     Ovoz: «Birinchi ko'rinish: prod bazasi yo'q. Unable to connect to the database, database does not exist, o'quvchida nomi db prod. To'qqiz marta qayta urinadi, keyin yiqiladi. Nest birinchi darsidagi to'rtinchi baza xabari, lekin sabab boshqa: baza bor, faqat boshqa nomdagisi qidirilyapti.» · terminal 1
  3. **2-ko'rinish, xavflisi: baza bor, lekin bo'sh — `synchronize: false`, jadval yaratilmaydi; xabar `error in creating super admin` — sababni yashiradi**
     Ovoz: «Ikkinchi ko'rinish xavfliroq: prod bazasi bor, lekin bo'sh. synchronize false, TypeORM jadval yaratmaydi. Server route'larni ulaydi, keyin onModuleInit superadminni qidiradi, admins jadvali yo'q, va yiqiladi. Xabar: error in creating super admin. Haqiqiy sabab, jadval yo'qligi, admin service'dagi catch ichida yashirin.» · terminal 2
  4. **Xabar sababni aytmasa — `.env`ni oching: `NODE_ENV=dev`mi? Yoki bazani `psql`da ko'ring: jadval bormi**
     Ovoz: «Xabar sababni aytmasa, ikki narsani tekshiring: env'da NODE ENV dev'mi, va psql'da bazada jadval bormi. error in creating super admin ko'rsangiz, to'qson foizda javob shu: jadval yo'q, chunki synchronize o'chiq.»
  5. **Tuzatamiz: `NODE_ENV=dev` → `DEV_DB_URL`, `synchronize: true` — jadvallar, superadmin, 14 Mapped**
     Ovoz: «Tuzatamiz: env'da NODE ENV dev. Server qayta yuklanadi: DEV DB URL, synchronize true, jadvallar joyida, superadmin topildi, o'n to'rtta Mapped, successfully started.» · `.env` yashil + terminal (haqiqiy, `15-port-busy-first.log` / `11-cars-start.log`)
  6. **Xulosa: baza xatosi ko'rsangiz, Nest-1 qoidasi: kodga tegmang — `.env`: manzil, parol, `NODE_ENV`; keyin PostgreSQL**
     Ovoz: «Xulosa: baza bilan bog'liq xato ko'rsangiz Nest birinchi darsidagi qoida: kodga tegmang. Env'ni oching: manzil, parol, NODE ENV dev. Keyin PostgreSQL: ishlayaptimi, baza bormi. Bu to'rt holat eslatmada.»
- Qoida-karta: `.env` → `NODE_ENV=dev` · `.env` umuman yo'q → `Unable to connect` + `getaddrinfo ENOTFOUND base` (manzil o'rniga `undefined` so'zi, `04-no-env.log`) · port band → `EADDRINUSE :::3000` (`15-port-busy-second.log`).
- Manba: `nest2-out/14-nodeenv-prod-no-db.log`, `14-nodeenv-prod-empty-db.log`, `14-nodeenv.txt`, `04-no-env.log`, `15-port-busy-second.log`; repo `src/config/index.ts`, `src/api/admin/admin.service.ts:38–59`.

## T5 · Tekshiruv 5 / 5 — o'quvchi KitobShop'ida xato: qaysi faylni ochasiz?  ← `MCRetry`
- Kicker: `Tekshiruv 5` · Eyebrow: `Tekshiruv · 5 / 5 — xatoni o'qish` · `above`: terminal paneli (xabar — S24 dagi haqiqiy xabardan, nomlar KitobShop'ga almashtirilgan):
  ```
  [Nest] ERROR [ExceptionHandler] UnknownDependenciesException [Error]: Nest can't resolve dependencies of the BookService (?).
  Please make sure that the argument "BookEntityRepository" at index [0] is available in the BookModule module.
  ```
- Sarlavha: **Bu o'quvchingizning KitobShop'i. Qaysi faylni ochasiz va nimani tuzatasiz?**
- Ovoz: «Oxirgi tekshiruv, sinfdagi haqiqiy holat. Beshinchi tekshiruv. O'quvchi KitobShop'da agent yozgan Book resursini ishga tushirdi, server yiqildi, ekrandagi xabar. U yordam so'radi. Qaysi faylni ochasiz va nimani tuzatasiz?»
- Variantlar (to'g'risi — 1):
  1. `book.module.ts` — `imports`ga `TypeOrmModule.forFeature([BookEntity])`
  2. `app.module.ts` — `providers`ga `BookService`
  3. `book.service.ts` — konstruktordan `@InjectRepository(BookEntity)` ni olib tashlash
  4. `book.entity.ts` — `@Injectable()` qo'shish
- To'g'ri izoh (ovoz): «book module ts, imports'ga forFeature Book entity. Xabarda hamma narsa bor: qaysi klass, Book service; qaysi dependency, Book entity Repository, index nol; qaysi fayl, Book module. Repository so'zi, demak forFeature. Ekranda tuzatilgan fayl va terminal: Book module dependencies initialized, Book controller api v bir book, Mapped.» · qisqa: «`book.module.ts` → `imports: [TypeOrmModule.forFeature([BookEntity])]`. Klass: BookService · dependency: BookEntityRepository · fayl: `book.module.ts`.»
- `after` (M2): `book.module.ts` tuzatilgan (`imports: []` chizilgan, `imports: [TypeOrmModule.forFeature([BookEntity])]` yashil) + yashil terminal (haqiqiy, `16-book-start.log`): `BookModule dependencies initialized` · `BookController {/api/v1/book}:` · `Mapped {/api/v1/book, POST} route` · `Mapped {/api/v1/book, GET} route`.
- Xato izohlari: 2 — «Service bosh modulning providers'iga yozilmaydi; xabar ham BookModule haqida, AppModule emas.» · 3 — «Repository'ni olib tashlasangiz Service bazaga yoza olmaydi; dependency kerak, uni beradigan satr yetishmayapti.» · 4 — «`@Injectable` Entity'ga qo'yilmaydi; xabar Repository topilmaganini aytyapti, decorator yo'qligini emas.»
- Manba: `nest2-out/12-break-forfeature.log` (xabar shakli), `16-book-start.log` (tuzatilgan terminal), `src-book/book/book.module.ts`.

## P4 · Amaliyot 4 / 4 — o'zingiz buzing va tuzating  ← `Practice`
- Kicker: `Amaliyot 4 / 4` · Eyebrow: `Hozir o'zingizda · 7–10 daqiqa` · Sarlavha: **O'zingiz buzing, o'qing, tuzating** · `tableAt: 3`
- Segmentlar:
  1. **Oxirgi amaliyot: siz buzasiz — uch qadam, xatolarni o'z ko'zingiz bilan o'qiysiz**
     Ovoz: «Oxirgi amaliyot: endi siz buzasiz. Uch qadam, yetti-o'n daqiqa. Maqsad xabarlarni o'z ko'zingiz bilan ko'rish va o'qish, sinfda aynan shular chiqadi.»
  2. **1-qadam: `car.module.ts`dan `forFeature`ni oling → xabardan qaysi klass · qaysi dependency · qaysi fayl → isbotga yozing → qaytaring**
     Ovoz: «Birinchi: car module ts'da imports'dan TypeOrm module forFeature satrini olib tashlang, saqlang, server yiqiladi. Xabardan qaysi klass, qaysi dependency va qaysi fayl ekanini toping, uchalasini vergul bilan isbot maydoniga yozing. Keyin satrni qaytaring.» · 1-qadam
  3. **2-qadam: Swagger'da `GET /api/v1/car/1` → 500, terminalda `invalid input syntax for type uuid` → `ParseUUIDPipe` qo'shing → 400**
     Ovoz: «Ikkinchi: Swagger'da GET car, id maydoniga bir yozing. Besh yuz. Terminalda invalid input syntax for type uuid satrini toping. Keyin Controller'da Param id ga ParseUUIDPipe qo'shing, saqlang va qaytaring: to'rt yuz, Validation failed, uuid is expected.» · 2-qadam
  4. **3-qadam: hammasini tekshiring — terminalda 5 `Mapped {/api/v1/car…}`, `GET /api/v1/car/<uuid>` → 200. Isbot va katakchalar bo'lmasa, Davom ochilmaydi**
     Ovoz: «Uchinchi: hammasini tekshiring. Terminalda beshta Mapped api v bir car, GET car haqiqiy uuid bilan ikki yuz. Uchala katakcha va isbot to'g'ri bo'lmaguncha Davom ochilmaydi.» · 3-qadam
- Qadamlar:
  | # | Qadam | Nima | Kutilgan |
  |---|---|---|---|
  | 1 | `forFeature` yo'q | `car.module.ts` → `imports: []` → saqlang | `Nest can't resolve dependencies of the CarService (?)` … `"CarEntityRepository" at index [0]` … `in the CarModule module` → klass · dependency · fayl → satrni qaytaring |
  | 2 | `/car/1` | Swagger → `GET /api/v1/car/{id}` → `1` | `500` + terminal `QueryFailedError: invalid input syntax for type uuid: "1"` → `@Param('id', ParseUUIDPipe)` → `400 Validation failed (uuid is expected)` |
  | 3 | Qaytaring va tekshiring | — | terminalda 5 ta `Mapped {/api/v1/car…}` · `GET /api/v1/car/<uuid>` → `200` |
- Isbot: «1-qadam xabaridan — qaysi klass, qaysi dependency, qaysi fayl? (vergul bilan)» · placeholder: «klass, dependency, fayl» · tekshiruv: `carservice` ∧ (`carentityrepository` ∨ `repository`) ∧ (`car.module` ∨ `carmodule`) (bo'sh joysiz, kichik harfda) · xato: «Xabarni qayta o'qing: «of the ___» — klass, «argument "___" at index [0]» — dependency, «in the ___ module» — fayl».
- «Boshqacha chiqdi»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Qaytardim, baribir xato | Faylni saqladingizmi? `start:dev` saqlashda o'zi qayta yuklaydi; terminalda yangi satrlarni kuting |
  | `ParseUUIDPipe` import xatosi | `@nestjs/common`dan: `import { …, ParseUUIDPipe } from '@nestjs/common'` |
  | `/car/1` hali ham 500 | `findOne`dagi `@Param('id')` → `@Param('id', ParseUUIDPipe)` — ikkinchi argument; saqlang, terminalda qayta yuklanishini kuting |
  | Boshqa xato | Xabarni uch savol bilan o'qing: qaysi klass · qaysi dependency · qaysi fayl; `Potential solutions` ro'yxati yechimni aytadi |
- Manba: `nest2-out/12-break-forfeature.log`, `11-cars-requests.txt`, `19-parseuuid.txt`, `11-cars-start.log`.

---

## S28 · O'quvchi darsi m4a-03 xaritasi: 22 ekran, 5 blok  ← `Lesson`
- Kicker: `7-bosqich · o'tish rejasi` · Eyebrow: `m4a-03 · «Birinchi resursni qo'lda qo'shish — mashinalar»` · Sarlavha: **O'quvchi darsining xaritasi: 22 ekran, 5 blok**
- Sahna: Nest-1 R1 uslubi — 5 blok kartasi (segment bilan yoritiladi), har kartada «o'quvchi nima qiladi» va «siz nima deysiz».
- Bloklar:
  | # | Blok (ekranlar) | O'quvchi nima qiladi | Siz nima deysiz |
  |---|---|---|---|
  | 1 | Kirish va reja (1–3) | «Admin tizimi tayyor — avtosalonda mashina yo'q» savoli: admin faylini o'zgartiramizmi, yangi resursmi? → **alohida resurs**; reja — 5 qadam; mashina shakli — 4 ustun tanlaydi | «Resurs — bir tur ma'lumot, o'z papkasi, o'z 5 qadami»; ustunlar: `brand · model · price · is_available`, `id` emas |
  | 2 | 5 qadam, har qadamdan keyin test (4–15) | har faylda «qaysi qatorlar shu faylga tegishli» (begona qator — boshqa qatlamdan); Entity → DTO + Update DTO → Service → Controller → Module → «5 fayl tayyor, nega `/car` 404?» (AppModule) | har qadamda **qatlam qoidasi**: ustun — Entity, qoida — DTO, `super(carRepo)` — Service, eshik — Controller, ro'yxat — Module; `AppModule` satri |
  | 3 | So'rov yo'li, agent, debugging (16–18) | `POST /car` sayohati; **agent 5 faylni yozadi** (playbook); debugging: agent Controller'ga `@Column` qatorini qo'yib yuborgan — topib olib tashlaydi (final test) | «Agent aytganingizni yozadi — siz nazoratchisiz»; begona qator = boshqa qatlam |
  | 4 | **Ochilish kuni — haqiqiy loyihada** (19) | VS Code'da `IntroNestArxitechture`: car resursi 5 qadam + `AppModule`, brauzerda `/api/v1/car` → 200 — 6 bandli ro'yxat, «Bajardim — ustozni kuting» | **eng ko'p vaqt shu yerda**: hammaning `/api/v1/car` 200 bo'lmaguncha o'tmang; P3 jadvalingiz shu yerda ishlaydi |
  | 5 | Podium, kartochkalar, yakun (20–22) | jonli natija, 12 kartochka (Resurs, Entity, BaseEntity, DTO, 400, PartialType, BaseService, super, @Post, Module, 404, DI), «Endi yangi resurs qo'sha olasiz» | kartochkalarni birga o'qing — har biri bugungi bir ekraningiz |
- Segmentlar:
  1. **Resursni o'zingiz yozdingiz va buzdingiz. Endi asosiy maqsad: buni o'quvchiga o'tish — avval m4a-03 xaritasi**
     Ovoz: «Resursni o'zingiz yozdingiz va buzdingiz. Endi darsning asosiy maqsadiga o'tamiz: bu mavzuni o'quvchiga o'tish. Ikkita o'quvchi darsi bor. Avval m4a-03, mashinalar resursi: yigirma ikki ekran, beshta blok. Har blok uchun o'quvchi nima qiladi va siz nima deysiz.»
  2. **1-blok · kirish: o'quvchi «admin faylini o'zgartiramizmi?» savolidan boshlaydi — javob: alohida resurs**
     Ovoz: «Birinchi blok, kirish: o'quvchi avtosalonda mashina yo'q degan holatni ko'radi va savol oladi: admin faylini o'zgartiramizmi, yangi resurs quramizmi? Javob alohida resurs. Keyin reja, besh qadam, va mashina shakli: to'rt ustun tanlaydi, id emas. Siz resurs so'zini aniq ayting: bir tur ma'lumot, o'z papkasi, o'z besh qadami.» · 1-karta
  3. **2-blok · 5 qadam: har faylda «qaysi qatorlar shu faylga tegishli» — begona qator boshqa qatlamdan; har qadamdan keyin test**
     Ovoz: «Ikkinchi blok, eng uzuni: besh qadam. Har faylda o'quvchi qatorlarni tanlaydi: qaysi qator shu faylga tegishli, qaysi biri begona, boshqa qatlamdan. Har qadamdan keyin test. Siz har qadamda qatlam qoidasini aytasiz: ustun Entity'da, qoida DTO'da, super carRepo Service'da, eshik Controller'da, ro'yxat Module'da. Oxirida App module satri: besh fayl tayyor, nega car to'rt yuz to'rt.» · 2-karta
  4. **3-blok · so'rov yo'li, agent 5 faylni yozadi, debugging: agent Controller'ga `@Column` qo'yib yuborgan**
     Ovoz: «Uchinchi blok: POST car so'rovining yo'li, keyin agent: o'quvchi besh faylni agentga yozdiradi, playbook bilan. So'ng debugging, bu yakuniy test: agent Controller'ga Column qatorini qo'yib yuborgan, o'quvchi topib olib tashlaydi. Siz aytasiz: agent aytganingizni yozadi, nazoratchi sizsiz; begona qator boshqa qatlamniki.» · 3-karta
  5. **4-blok · Ochilish kuni — haqiqiy loyihada, VS Code'da: siz P3 da qilgan ish; hammaning `/api/v1/car` 200 bo'lmaguncha o'tmang**
     Ovoz: «To'rtinchi blok, Ochilish kuni: o'quvchi VS Code'da haqiqiy loyihaga car resursini qo'shadi, olti bandli ro'yxat bilan, va brauzerda ikki yuzni ko'radi. Bu siz uchinchi amaliyotda qilgan ish. Eng ko'p vaqt shu yerda ketadi: hammaning car route'i ikki yuz bermaguncha oldinga o'tmang. Uchinchi amaliyotdagi jadvalingiz shu yerda ishlaydi.» · 4-karta
  6. **5-blok · podium, 12 kartochka, yakun — kartochkalarni birga o'qing: har biri bugungi bir ekraningiz**
     Ovoz: «Beshinchi blok: jonli natija, o'n ikki kartochka va yakun. Kartochkalarni o'quvchi bilan birga o'qing: Resurs, Entity, Base entity, DTO, to'rt yuz, Partial type, Base service, super, Post, Module, to'rt yuz to'rt, DI. Har biri bugun siz ko'rgan bir ekran.» · 5-karta
  7. **Xulosa: eng ko'p kuch — 2-blok (qatlam qoidasi) va 4-blok (haqiqiy loyiha)**
     Ovoz: «Xulosa: beshta blokdan ikkitasi sizdan eng ko'p kuch talab qiladi. Ikkinchisi, chunki har qadamda qatlam qoidasini siz aytasiz. To'rtinchisi, chunki haqiqiy loyihada hammaning serveri ishlashi kerak.» · 2-, 4-karta
- Manba: `src/4a-Modull/NestArchResourceLesson.jsx` (SCREEN_META 22 ekran, ekran sarlavhalari, PLAYBOOK_FILES, ScreenCarPractice checklist, FLASHCARDS 12).

## S29 · O'quvchi darsining tili: restoran so'zlari ↔ sizning atamalaringiz  ← `Lesson`
- Kicker: `7-bosqich · ko'prik` · Sarlavha: **O'quvchi tili: javon chizmasi, anketa, retsept kitobi…**
- Sahna: ikki ustunli lug'at kartalari (Nest-1 S25b uslubi), 10 juft; segment bilan guruh-guruh yonadi.
- Lug'at (o'quvchi darslaridan aynan):
  | O'quvchi aytadi | Siz bilasiz | Qayerdan |
  |---|---|---|
  | javon chizmasi | **Entity** — jadval shakli | m4a-03 |
  | buyurtma anketasi · bir xil anketa nusxasi | **DTO** · **PartialType** | m4a-03 |
  | nazoratchi to'xtatadi → 400 | **ValidationPipe** (DTO qoidasi) | m4a-03 |
  | tayyor retsept kitobi · omborni ko'rsatadi | **BaseService** · `super(carRepo)` | m4a-03 |
  | omborchi | **Repository** | m4a-01 |
  | ofitsiant · eshik | **Controller** · route (`@Get`, `@Post`…) | m4a-01, m4a-03, m4a-04 |
  | kirish taxtasi · «taxtada yozilmagan bo'lim ko'rinmaydi» → 404 | **Module** · `AppModule imports` | m4a-03 |
  | «Nest o'zi ulaydi» | **Dependency Injection** | m4a-03 |
  | qo'riqchi · 🔒 faqat admin · 🌐 hamma | **Guard** · `@Roles(...)` · `@Roles('public')` | m4a-04 |
  | yorliq (ko'p kitob → bitta yorliq, yorliq kitobda) | **@ManyToOne** (`categoryId` kitob jadvalida) | m4a-04 |
- Segmentlar:
  1. **Xaritani bilasiz. O'quvchi shu fayllarni qanday so'zlar bilan eslaydi — o'quvchi darsi restoran tilida gapiradi**
     Ovoz: «Darsning xaritasini bilasiz. Endi o'quvchi shu fayllarni qanday so'zlar bilan eslashini bilib oling: o'quvchi darsi Nest birinchi darsidagidek restoran tilida gapiradi, lekin yangi so'zlar bilan.»
  2. **Entity — javon chizmasi; DTO — buyurtma anketasi; PartialType — bir xil anketa nusxasi; 400 — nazoratchi to'xtatdi**
     Ovoz: «Entity javon chizmasi: jadval qanday ko'rinadi. DTO buyurtma anketasi, Partial type o'sha anketaning nusxasi. Anketa qoidasi buzilsa nazoratchi to'xtatadi, to'rt yuz: bu ValidationPipe.» · 1–3-juft
  3. **BaseService — tayyor retsept kitobi, `super(carRepo)` — omborni ko'rsatish; Repository — omborchi**
     Ovoz: «Base service tayyor retsept kitobi: oshpaz retseptni qaytadan yozmaydi. super carRepo omborni ko'rsatish: qaysi jadval. Repository omborchi, birinchi darsdan.» · 4–5-juft
  4. **Controller — ofitsiant, route — eshik; Module — kirish taxtasi: taxtada yozilmagan bo'lim ko'rinmaydi, 404**
     Ovoz: «Controller ofitsiant, har route eshik: Post qo'shish eshigi, Get o'qish eshigi. Module kirish taxtasi: taxtada yozilmagan bo'lim ko'rinmaydi, to'rt yuz to'rt. Bu App module imports.» · 6–7-juft
  5. **KitobShop'da: qo'riqchi — Guard, qulf — `@Roles(admin)`, globus — `'public'`; yorliq — `@ManyToOne`, yorliq kitobda turadi**
     Ovoz: «KitobShop darsida yana ikki so'z: qo'riqchi, bu Guard; qulf belgisi faqat admin, globus hamma uchun, bu Roles. Va yorliq: ko'p kitob bitta yorliqqa, yorliq kitobning o'zida turadi. Bu ManyToOne, categoryId ustuni kitob jadvalida.» · 8–10-juft
  6. **Xulosa: ikkala so'zni birga ayting — «javon chizmasi, ya'ni Entity»; metafora vazifani tushuntiradi, kodni emas**
     Ovoz: «Xulosa: darsda ikkala so'zni birga ayting: javon chizmasi, ya'ni Entity. Metafora vazifani tushuntiradi, kodni emas: o'quvchi anketa desa, siz DTO faylini ochib qoidalarni ko'rsatasiz. Shu chegarani siz ushlab turasiz.»
- Manba: `NestArchResourceLesson.jsx` (RULE_CARDS, FLASHCARDS), `NestArchPracticeLesson.jsx` (🔒/🌐, yorliq izohi), `NestArchAliveLesson.jsx` (omborchi, ofitsiant).

## S30 · O'quvchi darsi m4a-04 xaritasi: KitobShop — 9 ekran, agent bilan  ← `Lesson`
- Kicker: `7-bosqich · o'tish rejasi` · Eyebrow: `m4a-04 · «Praktika — KitobShop backend»` · Sarlavha: **KitobShop: o'quvchi 3 resursni agentga qurdiradi**
- Sahna: 9 ekran kartasi (segment bilan); 4-segmentda `Ide` kichik panel — haqiqiy `book.entity.ts` (ManyToOne) + terminal/javob.
- Ekranlar: 1 kirish (tayyor KitobShop: admin kitob qo'shadi, mijoz ko'radi va buyurtma beradi; eshiklar 🔒/🌐) · 2 reja (3 resurs playbook, Copilot Agent) · 3 **Amaliyot 1 · aniq buyruq** («Agent aynan aytganingizni yozadi — ko'proq emas») · 4 **Amaliyot 2 · Copilot Chat «Agent» rejimi**: 3 playbook — Category → Book (`@ManyToOne → Category`) → Order (`@ManyToOne → Book`), har biridan keyin tekshiruv ro'yxati, keyin «Keep» · 5 **Amaliyot 3 · @Roles**: qaysi eshik ochiq (`GET /book` public), qaysi faqat admin (`POST /book`) · 6 **Amaliyot 4 · eshik sinovi**: «do'kon ochildi, buyurtma kelmayapti» — agent `POST /order`ga `@Roles(ADMIN)` qo'ygan → `@Roles('public')` · 7 test (12 savol) · 8 podium · 9 yakun.
- Playbook namunasi (o'quvchi nusxalaydi, darsdan aynan): «Book resursini qo'sh: Entity (title, author, price, is_featured — boolean, default false) va Category bilan @ManyToOne (ko'p kitob → bitta kategoriya) → Create/Update DTO (@IsString, @IsNumber, categoryId) → BaseService'dan BookService → CRUD controller …»
- Mentor uchun tayyor kod — `@ManyToOne` (haqiqiy yurgizilgan, `nest2-out/src-book/book.entity.ts`):
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
- Segmentlar:
  1. **m4a-03 da o'quvchi qo'lda yozdi. m4a-04 da xuddi shu ishni agent qiladi — uch resurs, KitobShop**
     Ovoz: «m4a-03 da o'quvchi car resursini qo'lda yozdi. Keyingi dars m4a-04, KitobShop: xuddi shu besh qadamni Copilot agenti qiladi, uch resurs uchun: Category, Book, Order. To'qqiz ekran, to'rt amaliyot. O'quvchi yozmaydi, buyuradi va tekshiradi.» · 1–2-karta
  2. **Amaliyot 1–2: aniq buyruq va 3 playbook — har playbook'dan keyin tekshiruv ro'yxati, keyin «Keep»; siz ro'yxatni ushlab turasiz**
     Ovoz: «Birinchi amaliyot: aniq buyruq, agent aytganingizni yozadi, ko'proq emas. Ikkinchi: uchta playbook, Copilot Chat'ning Agent rejimida. Har playbook'dan keyin tekshiruv ro'yxati: besh fayl bormi, Base service'dan merosmi, App module'ga ulanganmi, Roles kerakli eshiklardami. Faqat keyin Keep. Siz ro'yxatni ushlab turasiz: o'quvchi o'qimasdan Keep bosmasin.» · 3–4-karta
  3. **Yangi narsa — `@ManyToOne`: Book → Category, Order → Book. Mentorga tayyor kod: `@ManyToOne` + `@JoinColumn` + `categoryId` ustuni**
     Ovoz: «Bu darsda yangi narsa bor: ManyToOne. Kitob kategoriyaga, buyurtma kitobga bog'lanadi. Siz uchun tayyor kod: book entity'da ManyToOne Category entity, JoinColumn categoryId va categoryId ustuni. Biz buni haqiqatda yurgizdik: POST book categoryId bilan ikki yuz bir, bazada books jadvalida categoryId ustuni va tashqi kalit.» · `Ide` panel; haqiqiy: `\d books` → `categoryId | uuid | not null` + `FOREIGN KEY ("categoryId") REFERENCES categories(id) ON DELETE CASCADE` · `POST /api/v1/category {"name":"Detektiv"}` → 201 · `POST /api/v1/book {…,"categoryId":"aa8481e7-…"}` → `{"statusCode":201,…,"categoryId":"aa8481e7-…"}` · `GET /api/v1/book` → `data[0].category: {"name":"Detektiv",…}` (`relations: { category: true }`)
  4. **Yo'q `categoryId` → 500, terminalda `violates foreign key constraint`; formati noto'g'ri → 400 `categoryId must be a UUID`**
     Ovoz: «Va ikkita tayyor javob. Mavjud bo'lmagan categoryId yuborilsa besh yuz, terminalda violates foreign key constraint: baza bog'lanishni tekshiradi, bunday kategoriya yo'q. Formati uuid bo'lmasa, masalan bir, to'rt yuz, categoryId must be a UUID, bu DTO'dagi IsUUID. O'quvchi avval kategoriya yaratsin, keyin uning id'sini kitobga yozsin.» · haqiqiy: `POST /api/v1/book {…,"categoryId":"aa8481e7-…b108"}` → `{"statusCode":500,"error":{"message":"Internal server error"}}`, terminal: `QueryFailedError: insert or update on table "books" violates foreign key constraint "FK_a0f13454de3df36e337e01dbd55"` · `"categoryId":"1"` → `{"statusCode":400,"error":{"message":"categoryId must be a UUID"}}`
  5. **Amaliyot 3–4: @Roles — qaysi eshik ochiq; eshik sinovi — agent `POST /order`ni admin qilib qo'ygan, mijoz buyurtma berolmaydi → `'public'`**
     Ovoz: «Uchinchi amaliyot Roles: o'quvchi har eshikni ochiq yoki admin deb belgilaydi: GET book hamma, POST book admin. To'rtinchi, eshik sinovi: do'kon ochildi, buyurtma kelmayapti, chunki agent POST order'ga Roles admin qo'ygan. Tuzatish bitta so'z: public. Siz to'rt yuz uchni bu yerda tushuntirasiz, Roles guard'dagi logika bilan.» · 5–6-karta
  6. **Xulosa: bu darsda o'quvchi kod yozmaydi — buyuradi va tekshiradi; sizning ishingiz tekshiruv ro'yxati va 401/403**
     Ovoz: «Xulosa: KitobShop darsida o'quvchi kod yozmaydi, buyuradi va tekshiradi. Sizning ikki ishingiz: har playbook'dan keyin tekshiruv ro'yxatini o'quvchi bilan birga o'tish, va to'rt yuz bir bilan to'rt yuz uchni ajratib berish.»
- Manba: `src/4a-Modull/NestArchPracticeLesson.jsx` (SCREEN_META 9, PLAYBOOK, TEKSHIRUV, eshik sinovi); `nest2-out/src-book/`, `16-book-start.log`, `16-book-requests.txt`, `18-book-fk-requests.txt`.

## S31 · O'quvchi qoqiladigan 6 joy  ← `Lesson`
- Kicker: `7-bosqich · o'tish rejasi` · Eyebrow: `m4a-03 · m4a-04 · darsda nima bo'ladi` · Sarlavha: **Sinfda albatta uchraydigan 6 holat**
- Sahna: Nest-1 R2 uslubi — 6 karta (`STUMBLE`), har birida xabar (haqiqiy) + yechim; segment bilan yonadi.
- Kartalar:
  | # | Holat | Xabar (haqiqiy) | Yechim |
  |---|---|---|---|
  | 1 | `npm install` to'liq emas / eski `node_modules` | `error TS2307: Cannot find module 'class-validator'` (terminal, kompilyatsiya) | `npm install` qayta; tugaguncha kuting (1–3 daqiqa) |
  | 2 | `.env` chala | superadmin bo'sh → server ishlaydi, signin `400 password is not strong enough`; `NODE_ENV` yozilmagan/`prod` → `database "db_prod" does not exist` (bizda nomi boshqa edi — `nest2-out/14-nodeenv-prod-no-db.log`) | `.env` ro'yxati (S9): `NODE_ENV=dev`, superadmin 4 maydon, kalit |
  | 3 | Prefiks unutildi | `GET /car` → `404` `{"statusCode":404,"error":{"message":"Cannot GET /car"}}` | manzil `/api/v1/car`; Swagger'dan yuboring |
  | 4 | Nest resursni ko'rmaydi | `AppModule`da yo'q → server ishlaydi, `Mapped` yo'q, `/api/v1/car` → 404 · `forFeature` yo'q → `Nest can't resolve dependencies of the CarService (?)` … `CarEntityRepository` | `app.module.ts` → `imports` · `car.module.ts` → `TypeOrmModule.forFeature([CarEntity])` |
  | 5 | Raqamli id | `GET /api/v1/car/1` → `500 Internal server error`; terminalda `invalid input syntax for type uuid: "1"` | id uuid — javobdagi `data.id`ni nusxalang; Nest-1 dagi 1, 2, 3 bu yerda yo'q. Loyihada 500 o'rniga 400 kerak bo'lsa — `@Param('id', ParseUUIDPipe)` → `Validation failed (uuid is expected)` (S26) |
  | 6 | Token va rol | `401 Unauthorized` — Authorize bosilmagan · `403 Forbidden resource` — `@Roles` ro'yxatida bu rol yo'q (KitobShop: `POST /order` admin) | signin → Authorize · `@Roles` ro'yxatini tokendagi rol bilan solishtiring, mijoz eshigi `'public'` |
- Segmentlar:
  1. **Xaritani va tilni bilasiz. Endi reja buziladigan joylar — ikki darsda albatta uchraydigan olti holat**
     Ovoz: «Rejani va tilni bilasiz. Endi reja buziladigan joylarni ko'raylik: ikki darsda albatta uchraydigan oltita holat. Har birining haqiqiy xabari va yechimi bor.»
  2. **1 · `Cannot find module 'class-validator'` — install tugamagan; 2 · `.env` chala: superadmin bo'sh yoki `NODE_ENV` noto'g'ri**
     Ovoz: «Birinchi: Cannot find module class validator. npm install tugamagan yoki eski node modules. Qayta install. Ikkinchi, eng ko'pi: env chala. Superadmin bo'sh, kirolmaydi. NODE ENV yozilmagan yoki prod, loyiha boshqa bazani qidiradi, database does not exist. O'ninchi ekrandagi ro'yxat bilan tekshiring.» · 1-, 2-karta
  3. **3 · prefiks: `/car` → 404 `Cannot GET /car`; 4 · Nest ko'rmaydi: `AppModule`da yo'q (jim 404) yoki `forFeature` yo'q (can't resolve)**
     Ovoz: «Uchinchi: prefiks. Slesh car to'rt yuz to'rt, Cannot GET slesh car. Manzil api v bir slesh car. To'rtinchi: Nest resursni ko'rmaydi, ikki ko'rinishda: App module'da yo'q, server ishlaydi, lekin Mapped yo'q, jim to'rt yuz to'rt; yoki forFeature yo'q, can't resolve dependencies, Car entity Repository.» · 3-, 4-karta
  4. **5 · `/car/1` → 500: id uuid, terminalda `invalid input syntax for type uuid` — o'quvchi Nest-1 dagi raqamlarni eslaydi**
     Ovoz: «Beshinchi: o'quvchi cars api'dagidek car slesh bir deb so'raydi. Besh yuz. Terminalda invalid input syntax for type uuid. Bu loyihada id uuid, javobdagi data id'ni nusxalash kerak. Kod to'g'ri, so'rov noto'g'ri.» · 5-karta
  5. **6 · 401 — Authorize bosilmagan; 403 — `@Roles`da bu rol yo'q; KitobShop'da `POST /order` admin bo'lib qolgan**
     Ovoz: «Oltinchi: token va rol. To'rt yuz bir, Authorize bosilmagan, signin qilib tokenni qo'ysin. To'rt yuz uch, Roles ro'yxatida bu rol yo'q: KitobShop'da POST order'ga admin yozilgan bo'ladi, mijoz uchun public kerak.» · 6-karta
  6. **Xulosa: avval status — 404 manzil/modul · 400 DTO · 401/403 Guard · 500 terminal; darsdan oldin loyihani o'zingiz ko'taring**
     Ovoz: «Xulosa va usul: xato chiqsa avval statusga qarang. To'rt yuz to'rt manzil yoki modul, to'rt yuz DTO, to'rt yuz bir va uch Guard, besh yuz terminalni o'qing. Va darsdan oldin loyihani o'zingiz bir marta clone qilib ko'taring: qayerda qoqilishini oldindan bilasiz.»
- Manba: `nest2-out/03-no-class-validator.log`, `06-requests.txt`, `14-nodeenv-prod-no-db.log`, `11-cars-requests.txt`, `12-break-forfeature.log`, `13-break-appmodule.txt`, `10-roles.txt`.

## S32 · Uyga vazifalarni qanday tekshirasiz: Brand va Review  ← `Lesson`
- Kicker: `7-bosqich · o'tish rejasi` · Eyebrow: `m4a-03 · m4a-04 · uyga vazifa` · Sarlavha: **Ikki uyga vazifa — siz nimaga qaraysiz**
- Sahna: ikki karta (chap: m4a-03 Brand, o'ng: m4a-04 Review), har birida vazifa matni (LMS'dagi bilan bir xil) va tekshiruv ro'yxati — segment bilan bandlar yonadi; 5-segmentda kod paneli: «tizimga kirganlar» eshigi qanday yoziladi.
- m4a-03 uyga vazifa (LMS matni): «Xuddi shu 6 qadam bilan Brand (avtomobil brendi) resursini o'zingiz, agentsiz qo'shing. 1. Entity: name (matn), country (matn). 2. DTO: ikkalasi @IsString, @IsNotEmpty; tahrirlash DTO — PartialType. 3. Service BaseService dan meros; Controller — 4 ta eshik. 4. BrandModule ni AppModule'ga ulang. 5. Swagger'da ikki skrinshot: POST /brand → 201 va bo'sh name → 400. GitHub linki.» — **Nima tekshiriladi:** 5 fayl, nomlari tartibli · DTO qoidalari · `extends BaseService` · `AppModule`da · 201 va 400 skrinshotlari.
- m4a-04 uyga vazifa (LMS matni): «KitobShop'ga kitob sharhlari (Review) qo'shing — agent bilan, lekin rejani siz tuzasiz. 1. Review: text, rating (1–5), kitobga @ManyToOne. 2. GET /review — hamma uchun ochiq; POST — tizimga kirganlar; DELETE — faqat ADMIN. 3. Agentga yozgan promptlaringizni README'ga qo'shing. 4. Swagger'da uch skrinshot: tokensiz POST → 401, oddiy foydalanuvchi DELETE → 403, ADMIN DELETE → 200. 5. GitHub linki.» — **Nima tekshiriladi:** `@ManyToOne Review → Book` · rollar to'g'ri eshiklarda · 3 skrinshot statuslari bilan · README'da prompt.
- «Tizimga kirganlar» eshigi (kod bo'yicha, `roles.guard.ts:19` + `auth.guard.ts:23`):
  ```ts
  @UseGuards(AuthGuard, RolesGuard)
  @Controller('review')
  export class ReviewController {
    @Roles('public')  @Get()      findAll() { … }     // hamma: AuthGuard token so'ramaydi
                      @Post()     create() { … }      // @Roles YO'Q: token shart (401), rol tekshirilmaydi
    @Roles(UserRole.ADMIN)  @Delete(':id')  remove() { … }   // faqat admin: aks holda 403
  }
  ```
- Segmentlar:
  1. **Qoqiladigan joylarni bilasiz. Dars tugagach ish qolmaydi — ikki uyga vazifa keladi va siz tekshirasiz**
     Ovoz: «Qoqiladigan joylarni bilasiz. Dars tugagach ishingiz tugamaydi: ikki uyga vazifa keladi va siz tekshirasiz. Ikkalasining matni platformadagi bilan bir xil, ekranda.»
  2. **Brand (m4a-03): 5 fayl, DTO qoidalari, `extends BaseService`, `AppModule`, ikki skrinshot — 201 va bo'sh `name` → 400**
     Ovoz: «Birinchisi Brand, mashina brendi: o'quvchi car bilan qilgan besh qadamni agentsiz takrorlaydi. Siz beshta narsaga qaraysiz: besh fayl va nomlar tartibli, DTO'da IsString va IsNotEmpty, Service Base service'dan meros, Brand module App module'da, va ikki skrinshot: POST brand ikki yuz bir, bo'sh name to'rt yuz. Skrinshotdagi to'rt yuz xabari name should not be empty bo'lishi kerak.» · chap karta
  3. **Review (m4a-04): `@ManyToOne Review → Book`, rollar eshiklarda, uch skrinshot — 401, 403, 200, README'da prompt**
     Ovoz: «Ikkinchisi Review, kitob sharhlari, agent bilan. To'rt narsa: review entity'da ManyToOne Book entity va bookId ustuni; rollar to'g'ri eshiklarda; uch skrinshot: tokensiz POST to'rt yuz bir, oddiy foydalanuvchi DELETE to'rt yuz uch, admin DELETE ikki yuz; va README'da agentga yozilgan promptlar.» · o'ng karta
  4. **Eng ko'p xato — «POST — tizimga kirganlar»: bu `@Roles` YOZILMAGAN eshik: AuthGuard token so'raydi, RolesGuard ro'yxat yo'qligi uchun o'tkazadi**
     Ovoz: «Bu vazifada eng ko'p xato POST'da bo'ladi: tizimga kirganlar uchun. Buni qanday yozish kerak? Roles umuman yozilmaydi. Auth guard token so'raydi, tokensiz to'rt yuz bir. Roles guard'da ro'yxat yo'q, u o'tkazadi. Bu ikki Guard'ning kodidan kelib chiqadi, o'n to'qqizinchi va yigirmanchi ekranlar.» · kod paneli
  5. **Tekshirishda skrinshotga emas, kodga qarang: `@Roles` qaysi eshikda, `@ManyToOne` qaysi faylda — o'quvchi darsidagi testlar ham shuni so'raydi**
     Ovoz: «Tekshirganda skrinshotdan tashqari kodga qarang: Roles qaysi eshikda, ManyToOne qaysi faylda, book entity'da emas, review entity'da. O'quvchi darsidagi testlar ham aynan shuni so'raydi.»
  6. **Xulosa: Brand — 5 band, Review — 4 band; ro'yxat eslatmada; topshiriq linki platformada, savol Telegram guruhida**
     Ovoz: «Xulosa: Brand besh band, Review to'rt band, ro'yxat darsning eslatmasida bor. O'quvchi linkni platformadagi uyga vazifaga yuboradi, savollarini guruhda beradi. Siz ro'yxat bo'yicha ko'rasiz.»
- Manba: `NestArchResourceLesson.jsx` HW_V2 (6-3), `NestArchPracticeLesson.jsx` HW_V2 (6-4); repo `src/common/guard/auth.guard.ts:19–23`, `roles.guard.ts:14–21`.

## S33 · Vaqt rejasi: ikki dars, 90 daqiqadan — va uch qoida  ← `Lesson`
- Kicker: `7-bosqich · o'tish rejasi` · Eyebrow: `m4a-03 · m4a-04 · 90 + 90 daqiqa (taklif)` · Sarlavha: **Ikki darsning vaqt rejasi va uch qoida**
- Sahna: ikki vaqt chizig'i (Nest-1 R3 uslubi), bo'laklar segment bilan yonadi; pastda uch qoida kartasi.
- m4a-03 (90): 0–15 kirish, reja, mashina shakli · 15–55 besh qadam + testlar (har qadam ≈ 8 daqiqa) · 55–65 so'rov yo'li, agent, debugging · **65–85 Ochilish kuni — haqiqiy loyihada** · 85–90 podium, kartochkalar, yakun.
- m4a-04 (90): 0–10 kirish, reja · 10–20 aniq buyruq · **20–60 uch playbook, Copilot Agent** (hammaning agenti ishlashi kerak) · 60–75 @Roles va eshik sinovi · 75–90 test, podium, yakun.
- Segmentlar:
  1. **Qoqiladigan joylar va uyga vazifalarni bilasiz. Endi vaqt: ikki dars, har biri 90 daqiqa — taklif, sinfingizga qarab o'zgartirasiz**
     Ovoz: «Qoqiladigan joylarni va uyga vazifalarni bilasiz. Endi vaqtni rejalaymiz: ikki dars, har biri to'qson daqiqa. Bu taklif, sinfingizga qarab o'zgartirasiz.»
  2. **m4a-03: 15 kirish · 40 besh qadam · 10 agent va debugging · 20 Ochilish kuni · 5 yakun**
     Ovoz: «m4a-03: birinchi o'n besh daqiqa kirish, reja, mashina shakli. Keyin qirq daqiqa besh qadam va testlar, har qadamga sakkiz daqiqa. O'n daqiqa so'rov yo'li, agent, debugging. Yigirma daqiqa Ochilish kuni, haqiqiy loyihada, eng xavfli bo'lak. Besh daqiqa yakun.» · chap chiziq
  3. **m4a-04: 10 kirish · 10 aniq buyruq · 40 uch playbook · 15 @Roles va eshik sinovi · 15 test va yakun**
     Ovoz: «m4a-04: o'n daqiqa kirish va reja, o'n daqiqa aniq buyruq, qirq daqiqa uch playbook, bu yerda hammaning Copilot agenti ishlashi kerak, bu eng xavfli bo'lak. O'n besh daqiqa Roles va eshik sinovi, o'n besh daqiqa test va yakun.» · o'ng chiziq
  4. **Xulosa — uch qoida: hammaning `/api/v1/car` 200 · AI kodini o'quvchi o'zi o'qib Keep bossin · avval status, keyin terminal**
     Ovoz: «Xulosa, uch qoida. Birinchi: Ochilish kunida hammaning car route'i ikki yuz bermaguncha oldinga o'tmang. Ikkinchi: agent yozgan kodni o'quvchi o'zi o'qib, tekshiruv ro'yxati bilan Keep bossin, siz o'rniga bosmang. Uchinchi: xato chiqsa avval status, keyin terminal, javobni aytmang, birga o'qing.» · qoida kartasi
- Manba: `NestArchResourceLesson.jsx`, `NestArchPracticeLesson.jsx` (ekran soni va tartibi); Nest-1 R3 (uslub).

## S34 · O'quvchi so'raydigan savollar  ← `Lesson`
- Kicker: `7-bosqich · savollar` · Sarlavha: **O'quvchi so'raydigan 6 savol va tayyor javoblar**
- Sahna: Nest-1 S26 uslubi — 6 karta (`QA`), bosilganda javob ochiladi; oxirgi segmentda `closeAll`.
- Segmentlar:
  1. **Reja tayyor. Oxirgi tayyorgarlik — o'quvchi beradigan savollar, taxminan shular**
     Ovoz: «Dars rejasi tayyor. Oxirgi tayyorgarlik: o'quvchi sizga beradigan savollar. Ular taxminan shular bo'ladi.»
  2. **1 · «Nega id raqam emas?» → uuid: taxmin qilib bo'lmaydi, ikki server to'qnashmaydi — `BaseEntity`da bir marta yozilgan**
     Ovoz: «Birinchisi: nega id bir, ikki, uch emas? Javob: uuid taxmin qilib bo'lmaydigan noyob matn, ikki server bir vaqtda yozsa ham to'qnashmaydi. U Base entity'da bir marta yozilgan, hamma jadvalga keladi.» · 1-karta
  3. **2 · «Nega javob `data` ichida?» → `successRes`: hamma javob bir shaklda, frontend doim `data`ni o'qiydi; xato — `error.message`**
     Ovoz: «Ikkinchisi: nega javob data ichida keladi? successRes: hamma muvaffaqiyat bir shaklda, statusCode, message, data; frontend doim data'ni o'qiydi. Xato ham bir shaklda, error message.» · 2-karta
  4. **3 · «`super(carRepo)` nima?» → BaseService'ga jadvalni berish; 4 · «PartialType nima qiladi?» → hamma maydon ixtiyoriy nusxa, PATCH uchun**
     Ovoz: «Uchinchisi: super carRepo nima? Base service'ning konstruktoriga jadvalni berish, usiz CRUD ishlamaydi. To'rtinchisi: Partial type nima qiladi? Create dto'ning nusxasi, hamma maydon ixtiyoriy, PATCH uchun.» · 3-, 4-karta
  5. **5 · «Nega `/car` emas, `/api/v1/car`?» → `setGlobalPrefix`; 6 · «403 nima, 401 bilan farqi?» → token yo'q vs rol yetmaydi**
     Ovoz: «Beshinchisi: nega slesh car emas, api v bir slesh car? Set global prefix, app service ts da, hamma route'ga qo'shiladi. Oltinchisi: to'rt yuz uch nima, to'rt yuz birdan farqi? To'rt yuz bir token yo'q, to'rt yuz uch token bor, lekin rol yetmaydi.» · 5-, 6-karta
  6. **Xulosa: bu olti javob tayyor bo'lsin; javob bera olmagan savolingiz bo'lsa — darsdagi o'sha ekranga qayting**
     Ovoz: «Xulosa: bu oltita javob sizda tayyor bo'lsin. Har kartani bosib javobni yana o'qing. O'zingiz javob bera olmaydigan savol bo'lsa, darsdagi o'sha ekranga qayting: id uchun o'n ikkinchi, javob shakli uchun o'n beshinchi, Guard uchun o'n to'qqizinchi va yigirmanchi.» · `closeAll`
- Manba: S10, S13, S20, S19, S6, S15–S16.

---

## S35 · O'z-sinov — 8 savol, bitta urinish, ≥ 6 o'tdi  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz** (ovoz va mexanika Nest-1 S27 bilan bir xil; qaytganda kirish gapi M12 bo'yicha).
- Savollar (`FINAL`, to'g'ri o'rinlari 1/2/3/4 — ikkitadan; `s` — xato bo'lsa qaytiladigan ekran raqami):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | O'quvchi loyihasida server qaysi faylda ishga tushadi? | `src/main.ts` · `src/api/app.service.ts` (`Aplication.main`) · `src/api/app.module.ts` · `src/config/index.ts` | 2 | `main.ts` faqat `Aplication.main()`ni chaqiradi; `NestFactory.create`, filtr, pipe, prefiks — `app.service.ts`da. | 6 |
  | 2 | `@Controller('car')` + global prefiks → to'liq manzil? | `/car` · `/api/car` · `/api/v1/car` · `/v1/car` | 3 | `setGlobalPrefix('api/v1')` hamma Controller oldiga qo'shiladi. | 7 |
  | 3 | `POST /api/v1/car` bo'sh `{}` bilan. Javob? | `201`, bo'sh mashina · `404 not found` · `500 Internal server error` · `400 brand should not be empty, …` | 4 | Global ValidationPipe DTO qoidalarini tekshiradi, hamma buzilgan qoida bitta xabarda. | 8 |
  | 4 | DTO'da yo'q `color` maydoni yuborildi. Javob? | saqlanadi · `400 property color should not exist` · jim olib tashlanadi, 201 · `500` | 2 | `forbidNonWhitelisted: true` — ortiqcha maydon 400. | 8 |
  | 5 | `GET /api/v1/car/1`. Javob? | `500`, terminalda `invalid input syntax for type uuid` · `404 not found` · `200`, birinchi mashina · `400` | 1 | id uuid; «1» bazaga uuid sifatida ketadi, PostgreSQL xato beradi, filtr 500 qiladi. | 33 |
  | 6 | `id`, `created_at`, `updated_at` qayerdan keladi? | DTO'dan · har Entity'da qo'lda yoziladi · `BaseEntity`dan meros · `BaseService`dan | 3 | `Base.entity.ts` — bir marta yozilgan, `extends BaseEntity`. | 12 |
  | 7 | Tokensiz `GET /api/v1/admin`. Javob? | `403 Forbidden resource` · `404` · `200` · `401 Unauthorized` | 4 | AuthGuard: `Authorization` yo'q → 401. 403 — rol yetmaganda. | 19 |
  | 8 | Xabar: «Nest can't resolve dependencies of the ReviewService (?). Please make sure that the argument ReviewEntityRepository at index [0] is available in the ReviewModule context.» Nima qilasiz? | `review.module.ts` — `imports: [TypeOrmModule.forFeature([ReviewEntity])]` · `app.module.ts` — `providers`ga ReviewService · `review.service.ts` — konstruktordan repo'ni olib tashlash · `review.entity.ts` — `@Injectable()` qo'shish | 1 | Klass: ReviewService · dependency: ReviewEntityRepository · fayl: `review.module.ts` — Repository `forFeature`dan keladi. | 31 |
- `passed = ball ≥ 6 && 4 amaliyot isbot bilan` (Nest-1 bilan bir xil); `onFinished` maydonlari o'zgarmaydi.

## S36 · Yakun — Barakalla, xulosa xaritasi, uyga vazifa, eslatma  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz** · tartib M13: (1) Barakalla / qayta topshirish maslahati → (2) animatsion xulosa (so'rov yo'li sxemasi — nuqta yuradi: brauzer → prefiks → Guard → ValidationPipe → Controller → Service/BaseService → Repository → jadval; 6 band birin-ketin yoritadi) → (3) uyga vazifa → (4) eslatma → (5) «Darsni yakunlash».
- Xulosa 6 band (`S28_ITEMS`):
  1. O'quvchi loyihasi = cars-api + 5 farq: `Aplication.main` · `/api/v1` · ValidationPipe · AllExceptionFilter · `config` + `.env`
  2. Resurs = 5 qadam: Entity → DTO → Service (`extends BaseService`, `super(repo)`) → Controller → Module (+ `AppModule`, `core/index.ts`)
  3. BaseService CRUD tekin; javob `successRes` — `{ statusCode, message, data }`; xato — `{ statusCode, error: { message } }`
  4. 400 — DTO (qoida yoki ortiqcha maydon) · 404 — manzil yoki modul · 500 — terminalni o'qing (`/car/1` — uuid)
  5. 401 — token yo'q (AuthGuard) · 403 — rol yetmaydi (RolesGuard) · `'public'` ochiq
  6. Xato o'qiladi: qaysi klass · qaysi dependency · qaysi fayl → `forFeature` yoki `imports`
- Segmentlar (ovoz): a — «Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.» / o'tmagan: «Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.» · b1…b6 — yuqoridagi 6 band bittadan (har biri 1–2 gap, sxemaning o'z bekati yonadi) · hw — uyga vazifa · c — eslatma · z — «Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.»
- **Uyga vazifa** (M14 — shu dars usulini yangi narsada takrorlash; ovoz `hw`): «Uyga vazifa. O'z loyihangizga brand resursini qo'shing, aynan o'quvchining uyga vazifasi: name va country, DTO qoidalari, Base service'dan meros, to'rt eshik, App module. Keyin car entity'ga ManyToOne bilan brand'ni bog'lang, brandId ustuni car'da. Bir marta ataylab buzing, forFeature'ni olib tashlang, xabarni o'qing, tuzating. GitHub'ga chiqaring va linkni platformadagi uyga vazifangizga hamda mentor-kurs Telegram guruhingizga yuboring. Qirq-oltmish daqiqa.»
  | # | Qadam | Buyruq / fayl |
  |---|---|---|
  | 1 | `brand` resursi — 5 qadam (o'quvchi vazifasi bilan bir xil) | `brand.entity.ts` (`name`, `country`) · `dto/` · `brand.service.ts` · `brand.controller.ts` (4 eshik) · `brand.module.ts` + `AppModule` + `core/index.ts` |
  | 2 | Swagger: `POST /api/v1/brand` → 201 · bo'sh `name` → 400 | ikki javobni ko'ring |
  | 3 | `car.entity.ts`ga `@ManyToOne(() => BrandEntity)` + `@JoinColumn({ name: 'brandId' })` + `@Column() brandId: string`; `CreateCarDto`ga `@IsUUID() brandId` | `POST /api/v1/car` brandId bilan → 201; yo'q brandId → 500 `foreign key` |
  | 4 | Ataylab buzing: `brand.module.ts`dan `forFeature`ni oling → xabarni o'qing (klass · dependency · fayl) → qaytaring | — |
  | 5 | GitHub + link → platforma uyga vazifasi + Telegram guruh | `git add . && git commit -m "brand resursi"` · `git push` |
  Tekshiruvchi nimaga qaraydi: 5 fayl · `extends BaseService` · `AppModule` · `@ManyToOne` `car.entity.ts`da · 201/400 ishlaydi.
- **Eslatma** (bir sahifa, nusxalash / `.md`): `.env` ro'yxati · 5 buyruq (clone … start:dev) · 5 farq · resurs 5 qadami (fayl yo'llari) · javob shakllari (success / error) · status jadvali (400 · 401 · 403 · 404 · 500 — sabab va qayerga qarash) · 6 qoqilish · o'quvchi lug'ati (10 juft) · uyga vazifalarni tekshirish ro'yxati (Brand 5, Review 4) · vaqt rejasi · o'z uyga vazifangiz.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: Jest — birinchi unit-test».

---

## «KOD» — qurishda kerak bo'ladigan o'zgarishlar (dvigatelga TEGMAY, faqat shu darsning bo'laklarida)
1. Explorer ro'yxati — `IntroNestArxitechture` fayllari (A-bo'limda), `root: 'IntroNestArxitechture'`; fayl rangi: `.entity.ts` binafsha, `dto/` to'q sariq, `guard/` qizil (FILE_KIND kengaytmasi — dvigatelda `root`ga qarab emas, fayl nomiga qarab; mavjud 3 rang qoladi). ⚠️ Agar FILE_KIND dvigatelda bo'lsa — darsning o'z bo'lagida ustidan yoziladi, `parts/02` ga tegilmaydi.
2. Kod panellari: haqiqiy repo fayllari — `nest2-out/src-car/`, `src-book/` va repodan (`admin.*`, `base.service.ts`, `AllException.filter.ts`, `config/index.ts`, `auth.guard.ts`, `roles.guard.ts`, `Token.ts`, dto'lar) satrma-satr, qisqartirilgan joy `…` bilan.
3. Terminal bloklari — `nest2-out/*.log` dan rangsiz, satrlar olib tashlangan joyda `…`.
4. S7 va S23 — Nest-1 S16 `REQS` kartalari (bosiladigan so'rovlar, `lockHint`), javoblar `nest2-out/09-validation.txt`, `11-cars-requests.txt`dan aynan.
5. S4 Swagger maketi — `Browser` ichida sodda ro'yxat (9 route, qulf belgisi): `nest2-out/06-requests.txt` Swagger JSON ro'yxatidan.
6. S28–S33 — Nest-1 R1/R2/R3/S26 komponentlari (karta ro'yxati, `STUMBLE`, `QA`, vaqt chizig'i) — ma'lumot almashadi, komponent o'sha.
7. S36 xulosa sxemasi — Nest-1 `SummaryMap` kengaytirilgan: 8 bekat (prefiks, Guard, Pipe, Controller, Service, Repository, jadval, javob).
8. Isbot tekshiruvlari: P1 `/super admin created/i` · P2 `/^eyJ[A-Za-z0-9_-]{7,}$/` · P3 `/^[0-9a-f]{8}$/i` · P4 `carservice` + `carentityrepository`/`repository` + `car.module`/`carmodule`.
9. RU — 7-bosqichda `parts/08-ru.jsx` (M24), UZ yopilgandan keyin.
