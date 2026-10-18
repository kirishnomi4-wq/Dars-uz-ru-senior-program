# 4a-Modul m4a-04 «Praktika — KitobShop backend» — yakuniy matn

Fayl: `src/4a-Modull/NestArchPracticeLesson.jsx` · 9 ekran · Oldingi: «Birinchi resursni qo'lda qo'shish — mashinalar» (m4a-03) · Keyingi: 4b-Modul «Unit-test: Jest» (m4b-01)
Ip: o'tgan darsda qo'lda qo'shilgan Nest resursi (mashinalar) → bugun 3 resursli KitobShop (Category · Book · Order) — Copilot Chat «Agent» rejimi yozadi, o'quvchi buyuradi va tekshiradi · AI: Copilot Agent (a2) · Sinfda Swagger `localhost:3000/api`
Holat: 2026-10-18 02:xx — kodga mos (F-1015-353 tungi qurish 23 → 9 ekran → **398 kirish** → **399 03/09 o'ng ustun** → **400 06/09 blur-qulf** → **401 yakun bandi + o'lik Screen19**; foydalanuvchi «roziman»). `lessonId: nest-arch-practice-4a-03-v18`.
Zaxira: `arxiv/F-1015-398-oldin/` · `…399-oldin/` · `…400-oldin/` · `…401-oldin/`. Qurish: `qurish/f398.py` … `f401.py` (har biri bir marta).

## 0 · Kirish (hook, ballsiz)
- Sarlavha: Mana siz quradigan narsa — haqiqiy onlayn **kitob do'koni**.
- Mentor: Bu — **KitobShop**: admin kitob qo'shadi, mijoz ko'radi va buyurtma beradi. Har qator — bitta **eshik** (endpoint): 🔒 faqat admin, 🌐 hamma. Bittasini ochib **«Try it out»** bilan sinang.
- Chapda Swagger-maketi «KitobShop API /api/v1», 7 eshik: 🔒 POST /category · 🌐 GET /category · 🔒 POST /book · 🌐 GET /book · 🌐 GET /book/featured (⭐ Top kitoblar) · 🌐 POST /order · 🔒 GET /order. Har biri ochiladi, «Try it out» javob (201/200 JSON) ko'rsatadi.
- O'ngda savol «Bunday backendni qanday quramiz?»: Hammasini bitta ulkan faylga yozamiz · ✔ 3 resurs — har biri 5 qadam, agent bilan tez quramiz · Bunday do'kon backendini faqat katta jamoa quradi.
- Javob (216-qonun, F-1015-398): a «Bitta ulkan fayl — har o'zgarish uni chalkashtiradi.» · b «Aynan!» · c «Katta jamoa emas — tartib kerak.» + «Bugun 3 resursni agent bilan qurasiz: siz buyurasiz, tekshirasiz.»
- Tugma «Boshlaymiz».

## 1 · Reja
- Sarlavha: Bugun KitobShop'ni **agent** bilan qurasiz.
- Mentor: O'tgan darsda mashinalar resursini qo'lda qo'shdingiz — 5 fayl va AppModule. Bugun xuddi shu ishni Copilot agenti qiladi: u bir nechta faylni o'zi yozadi. Sizning ishingiz — aniq buyruq berish va natijani tekshirish.
- «Avval tayyorlaning · 3 qadam» (oyna): 1. O'tgan darsdagi Nest loyihasini VS Code'da oching, `npm run start:dev` — Swagger localhost:3000/api ochiladimi? · 2. Copilot Chat (`Ctrl+Alt+I`), chat ostidagi ro'yxatdan «Agent» rejimi · 3. PostgreSQL ishlab turganini tekshiring (`.env`).
- Chapda «Dars oxirida · KitobShop API»: 3 resurs — Category (kitob turlari) · Book (@ManyToOne → Category) · Order (@ManyToOne → Book).
- O'ngda «Bugungi 4 blok»: Aniq buyruq — Category (siz) · 3 resurs — playbook (Copilot Agent) · Eshiklar: ochiq yoki admin (@Roles) · Eshik sinovi — xatoni topish (siz).
- Tugma «Boshlaymiz».

## 2 · Amaliyot 1 · aniq buyruq (s3, F-1015-399)
- Sarlavha: Agent **aynan** aytganingizni yozadi — ko'proq emas.
- Mentor: Birinchi resurs — **Category**. Uchta buyruq bor, uchalasi ham ishonarli ko'rinadi. Bittasini yuboring va **oqibatini** ko'ring: bo'lim **kirish taxtasiga** yozilmasa, mijoz eshikni topa olmaydi.
- Chapda 3 buyruq-karta: 1 «kategoriya qil» · 2 «category.entity.ts yoz: name ustuni.» · 3 «Category resursini qo'sh: Entity (name) -> DTO -> BaseService'dan service -> CRUD controller -> module va AppModule'ga ula.»
- O'ngda boshidanoq: «Agent yaratayotgan fayllar» (kutilmoqda: «buyruq kutilmoqda — chapdan bittasini yuboring») + «Restoran kirish taxtasi — AppModule.imports»: TypeOrmModule · AuthModule **bor** · CategoryModule **yo'q** · GET /category **404** (qizil signal).
- Buyruq yuborilgach fayllar «yoziladi»; 1 — bitta chalkash `category.ts` («Agent nima so'ralganini o'zi taxmin qildi»), 2 — faqat entity («aniq — lekin TO'LIQ emas»), 3 — 5 fayl + taxtaga yozildi → «Category tirik! Farq "aniq/noaniq"da emas edi — TO'LIQmi shunda edi.»
- 1–2 da maslahat: «Bo'lim taxtada yo'q — mijoz uchun bu eshik mavjud emas. Boshqa buyruqni sinang.»
- Tugma: «To'liq playbookni yuboring» → «Davom etish».

## 3 · Amaliyot 2 · Copilot Agent — 3 resurs (a2, haqiqiy ish, nishonli)
- Sarlavha: 3 resursni **agentga** qurdiring.
- Mentor: Har resurs — bitta playbook: Entity → DTO → Service → Controller → Module va AppModule. Agent aynan aytganingizni yozadi, shuning uchun har natijani tekshiruv ro'yxati bilan tekshiring.
- Chapda resurs-chiplar Category · Book · Order; tanlangan resursning playbook-kartasi (nusxalanadi):
  - **Category**: Category resursini qo'sh: Entity (name) → Create/Update DTO (@IsString) → BaseService'dan CategoryService → CRUD controller → CategoryModule va AppModule'ga ula. POST, PATCH, DELETE — @Roles('admin'); GET — ochiq.
  - **Book**: Book resursini qo'sh: Entity (title, author, price, is_featured — boolean, default false) va Category bilan @ManyToOne (ko'p kitob → bitta kategoriya) → Create/Update DTO (@IsString, @IsNumber, categoryId) → BaseService'dan BookService → CRUD controller + GET /book/featured (faqat is_featured: true) → BookModule va AppModule'ga ula. POST, PATCH, DELETE — @Roles('admin'); GET — ochiq.
  - **Order**: Order resursini qo'sh: Entity (customer_name, quantity) va Book bilan @ManyToOne (har buyurtma — bitta kitob) → Create DTO (@IsString, @IsInt, bookId) → BaseService'dan OrderService → controller: POST /order — ochiq (mijoz), GET /order — @Roles('admin') → OrderModule va AppModule'ga ula.
- «Tekshiruv · <resurs>» (4 katak): 5 fayl bor: entity, dto, service, controller, module · Modul AppModule imports'ida (usiz — 404) · Service BaseService'dan meros oladi · @Roles('admin') faqat POST/PATCH/DELETE da.
- «Qadamlar» (oyna, 4): 1. Playbookni nusxalang, Copilot Chat («Agent») ga qo'ying, Enter · 2. Agent yaratgan/o'zgartirgan fayllarni ro'yxatdan oching va o'qing · 3. Ro'yxatdan o'tsa — «Keep», noto'g'ri bo'lsa — «Undo» va buyruqni aniqlashtiring · 4. `npm run start:dev` — Swagger'da yangi eshiklarni «Try it out» bilan sinang; keyingi resurs.
- O'ngda «Swagger · sinab ko'ring» — KitobShop API maketi (7 eshik).
- «Davom etish»da nishon «Shelf Master!» 📚 (BLOK_ACH).

## 4 · Amaliyot 3 · @Roles — eshiklar (s7, nishonli)
- Sarlavha: Qaysi eshik **ochiq**, qaysi biri faqat admin uchun?
- Mentor: Har endpoint uchun @Roles ni to'g'ri tanlang: 🌐 public (hamma) yoki 🔒 admin. O'ylang: bu amalni begona odam qila olsa, xavfli emasmi?
- 6 qator, har birida 🌐 public / 🔒 admin: GET /book (public) · GET /book/featured (public) · POST /order (public) · POST /book (admin) · DELETE /book/:id (admin) · GET /order (admin). Noto'g'ri bosilsa izoh (masalan «Mijoz buyurtma beradi — ro'yxatdan o'tmasdan ham (public).»).
- Hammasi to'g'ri: «✓ Mukammal! Ko'rish/buyurtma — ochiq, qo'shish/o'chirish/buyurtmalar ro'yxati — admin. @Roles('public') tokenni o'tkazib yuboradi, qolgani himoyalangan.»
- Tugma «Har eshikni belgilang» → «Davom etish» (nishon «Guard Up!» 🛡️).

## 5 · Amaliyot 4 · eshik sinovi — xatoni topish (s14, nishonli, F-1015-400)
- Sarlavha: Do'kon ochildi — lekin **bironta buyurtma kelmayapti**.
- Mentor: Sabab aytilmaydi — **o'zingiz topasiz**. Avval mijoz bo'lib, keyin admin bo'lib eshiklarni taqillatib ko'ring: qaysi eshik kimga ochilyapti? Dalil yig'ilgach, kodni ochamiz.
- Chapda «Eshik sinovi — ikki rolda taqillatib ko'ring»: GET /book · POST /order · GET /order, har birida 🧍 Mijoz «sinash» / 🔑 Admin «sinash» → javob kodi (200 · **403** · 403 / 200 · 201 · 200).
- O'ngda AI-karta «OrderController tayyor!» + `order.controller.ts` — uch eshik mijoz sifatida sinalguncha qatorlar **blur-qulf** ostida (o'qilmaydi, bosilmaydi), «Avval dalil yig'ing — uch eshikni mijoz sifatida sinang ←».
- Dalil yig'ilgach: «Dalil: mijoz POST /order da 403 olyapti — bu eshik ochiq bo'lishi kerak edi. Admin esa 201 oladi. Demak muammo — ruxsatda. Endi kodni oching →»; kod ochiladi, «Qaysi qator mijozni to'sib qo'ygan? Bosing.» Xato qator: `@Roles(UserRole.ADMIN)` (controller ustida).
- Topilgach: «✓ Topdingiz! Qo'riqchiga noto'g'ri ro'yxat berilgan — u sizning MIJOZINGIZNI do'koningizga kiritmayapti. To'g'risi: @Roles('public').» Tugma «POST'ni @Roles('public') ga o'zgartirish» → «✓ Tuzatildi — buyurtma endi ochiq!», mijoz 201. Nishon «Nice Catch!» 🔍.
- Tugma: «Eshiklarni sinang» → «Xato qatorni toping» → «Endi tuzating» → «Davom etish».

## 6 · Test (s15, MCScreen, ballli, nishonli)
- Mijoz buyurtma berolsin desak, qatorni qanday tuzatamiz? — A Qo'riqchini (`@UseGuards()`) butunlay olib tashlaymiz · ✔ B `@Roles('public')` ga o'zgartiramiz · C Har bir mijozga `@Roles(ADMIN)` beramiz · D Tugmani frontend'da yashiramiz.
- Izohlar: ✔ «`POST /order` hammaga ochiq, qolgan eshiklar admin'da qoladi.» · A «Qo'riqchi ketsa, admin eshiklari ham ochilib qoladi.» · C «Har mijoz admin bo'lsa, u kitob ham qo'sha oladi — xavfli.» · D «Tugmani yashirish himoya emas — server baribir 403 beradi.»
- Birinchi urinishda to'g'ri — nishon «Shop Owner!» 🏪.

## 7 · Podium (spod)
- «Kim g'olib?» — N/1 to'g'ri javob; mustaqil rejimda «Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.» Tugma «Davom etish».

## 8 · Yakun (s20, F-1015-401)
- Chiplar: «✓ Real backend qurdingiz» · «N/1 to'g'ri». Sarlavha: Endi siz **backend dasturchisi**siz. Code Strike banneri.
- «Endi siz bilasiz»: 3 bog'langan resursli real backend qurdingiz (Category · Book · Order) · Bosh dasturchi sikli: Rejalashtirish → Yo'naltirish → Tekshirish · Eshik va qo'riqchi: @UseGuards + @Roles — 🌐 public (mijoz) vs 🔒 admin · Yorliq: @ManyToOne — ko'p kitob → bitta yorliq (yorliq kitobda saqlanadi) · Kirish taxtasi: AppModule'ga ulanmagan bo'lim = 404 · AI yo'l qo'ygan xatoni dalil bilan topdingiz (403 — mijozga yopiq qolgan eshik).
- «Uyga vazifa» kapsulasi: **O'z marketplace'ingiz** — elektronika/kiyim do'koni: 3 resursni rejaga soling · **Playbook** — har resurs uchun Copilot agentiga beradigan aniq playbook yozing (5 qadam + AppModule'ga ulash) · **Tekshiruv** — har eshikni ikki rolda sinang: mijoz va admin.
- «🚀 Siz endi istalgan g'oyani backendga aylantira olasiz — agentni boshqarib, har eshikni tekshirib!»
- «🏅 Nishonlaringiz» (4: Shelf Master · Guard Up · Nice Catch · Shop Owner) · Arena (12 savol) · tugmalar «Qaytadan» · «Modulni yakunlash ✓».

## Arena (12 savol, to'g'risi ✔)
1. Yangi resurs (masalan Book) uchun nechta fayl kerak? — ✔ 5 — har qatlam uchun bitta fayl
2. Bo'lim AppModule'ga ulanmasa nima bo'ladi? — ✔ Eshik topilmaydi — 404 qaytadi
3. Kitobni kategoriyaga bog'lash uchun qaysi dekorator? — ✔ `@ManyToOne()`
4. `@ManyToOne` qaysi faylga yoziladi? — ✔ `book.entity.ts`
5. Token'siz mijoz `POST /book` qilsa, server nima qaytaradi? — ✔ 401/403 — qo'riqchi rad etadi
6. Eshikka qo'riqchi qo'yadigan dekorator qaysi? — ✔ `@UseGuards()`
7. `GET /book` hamma uchun ochiq bo'lsin desak? — ✔ `@Roles('public')` qo'yamiz
8. Faqat `is_featured: true` kitoblarni qanday qaytaramiz? — ✔ `findAll` ga `where` shartini beramiz
9. `BaseService` ni meros olgan service nimani tekin oladi? — ✔ Tayyor CRUD metodlarini
10. Muvaffaqiyatli POST (qo'shildi) qaysi status kodni qaytaradi? — ✔ 201 Created
11. DTO nima uchun kerak? — ✔ Kiruvchi so'rovning qoidalari
12. Kitob bilan birga uning kategoriyasini ham olib kelish uchun `findAll` ga nima beriladi? — ✔ `relations: { category: true }`

## Sinov
`node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m4a04.mjs <OUT>` — 27/27 · `ru-m4a04.mjs` toza (9/9) · `npm run lint:jsx` toza (18.10 02:xx). `npm run gates` — 10/12: ❌ 6 (tell QUIZ #2 tire / #9 atama; emoji RECAP-konst, SHOP_FLOW, Screen7, test 💡) — hammasi F-353 dan oldingi bloklar, zaxirada ham bor.
Ochiq: 4a/4c praktikalari (m4c-04/05/07) kirish javobi 216-qonun bo'yicha ko'rikda tekshiriladi; rol-fayl ov-bandi «kesilgan ekranga tayangan matn» (F-397, F-401 sinfi) — ruxsat kutilmoqda.
