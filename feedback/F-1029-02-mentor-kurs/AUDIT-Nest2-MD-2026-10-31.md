# Nest-2 MD v3 — halol o'z-audit (31.10.2026, F-1031-01)

Manba: `02-Nest2-mentor-v3.md` (1636 satr) to'liq qayta o'qildi; shubhali joylar o'quvchi darslari (`src/4a-Modull/NestArch*Lesson.jsx`), repo kodi va `manba/nest2-out/` bilan solishtirildi. MD'ga TEGILMADI — yechim foydalanuvchi bilan kelishiladi.
Belgi: 🔴 jiddiy · 🟠 o'rta · 🟡 mayda · ✔ fakt bilan tasdiqlangan · ⚠ koddan aniq, lekin haqiqiy yurgizish kerak.

## A. Ko'prik — mentor sinfda qoqiladi (eng muhimi)
1. 🔴✔ O'quvchi darsi m4a-03 hamma joyda `/car` deydi (67 marta, `api/v1` atigi 2 marta), amaliyot ro'yxatida «Brauzerda `/car` ni oching — 200». Repoda prefiks bor → haqiqatda 404 `Cannot GET /car`. MD buni jimgina `/api/v1/car` qilib yozgan, mentorga «o'quvchi darsida xato yozilgan, sinfda tuzating» deyilmagan.
2. 🔴✔ O'quvchi darslarida superadmin, `.env` Superadmin bloki, signin, Authorize umuman o'rgatilmaydi (m4a-01/03/04 da 0 marta). Lekin m4a-04 va uning uyga vazifasi (401/403/200 skrinshotlar) tokensiz bajarilmaydi. MD ko'prigi buni mentorga aytmaydi.
3. 🔴⚠ KitobShop playbook'larida `@Roles('admin')`. Superadminning roli `superAdmin` → RolesGuard'da ro'yxatda yo'q → superadmin POST/PATCH/DELETE da 403 oladi. O'quvchi avval superadmin bilan oddiy admin yaratib, o'sha admin bilan kirishi kerak. MD'da yo'q.
4. 🔴⚠ Review uyga vazifasi: «oddiy foydalanuvchi DELETE → 403». Repoda oddiy foydalanuvchi uchun signin yo'q (faqat admins jadvali). S32 dagi `@Roles(UserRole.ADMIN)` namunasi bilan superadmin ham 403 oladi. Vazifani qanday bajarish va tekshirish mentorga tushuntirilmagan.
5. 🔴✔ Bo'sh superadmin tuzog'i: `.env` to'ldirilmasdan bir marta ishga tushirilsa, bazada nomsiz superadmin qoladi; keyin `.env`ni to'ldirish yordam bermaydi (`onModuleInit` superadmin bor deb o'tkazib yuboradi) — satrni o'chirish kerak. Faqat P2 jadvalida bor; S9 va S31 (sinfdagi holatlar) da yo'q.
6. 🟠 m4a-04 ning asosiy ishi — Copilot Agent bilan playbook. Mentor darsda buni bir marta ham o'zi qilmaydi.

## B. Noto'g'ri faktlar (M10)
7. 🔴✔ S17: «Access token eskirsa `POST /admin/token` yangisini beradi» — noto'g'ri. Bu route'da `@Roles('public')` yo'q, AuthGuard yaroqli access token so'raydi; eskirgan token bilan 401 (`10-roles.txt`: tokensiz → 401).
8. 🟠✔ S4: «Qulf = token kerak». `token` va `signout` da qulf yo'q (`@ApiBearerAuth` qo'yilmagan), lekin ular ham token so'raydi.
9. 🟠✔ S7: `POST /api/v1/admin` ga 400 javoblar xuddi hamma uchundek ko'rsatilgan. Bu route faqat superadmin tokeni bilan ishlaydi, Guard Pipe'dan oldin turadi — tokensiz 401. Yurgizishda token bilan yuborilgan.
10. 🟠 T4 izohi: «Controller'da tekshiruv ikki marta bajariladi». Noto'g'ri: ValidationPipe bo'sh `brand`ni oldinroq to'xtatadi, Controller'dagi satr hech qachon ishlamaydi (o'lik kod).
11. 🟠✔ Sanoq xatolari: S2 «cars-api'da 4 fayl» (7 edi) · S2 «api/ ga 4 fayl» (5) · S10 «besh o'z ustuni» (6) · S14 «o'ziga xos uch ish» (onModuleInit bilan 4) · S22 «to'rt fayl bor» (5) · P3 «besh qadam, yettita fayl» (jadvalda 6 qadam, 8 fayl).
12. 🔴 «5 qatlam» uch xil: S1 — Entity·DTO·Repository·BaseService·Controller; S10 — Entity·DTO·Repository·Service·Controller; A/S18 — Entity·DTO·Service·Controller·Module. O'quvchi darsi — «5 qadam, 5 fayl» (Entity·DTO·Service·Controller·Module).
13. 🟡✔ S26: «Sakkizinchi ekrandagi qoida» — filtr 9-ekranda.
14. 🟡 Mayda: S27 «to'qson foizda» (o'ylab topilgan raqam) · S35 q8 xabarida «ReviewModule context» (haqiqiysi «module») · S3 `.env` paroli `Developer1!`, yurgizishda boshqa · S23 GET'da K5 bor, uni yaratish ko'rsatilmagan · S7 «sahifalash DTO'sida ko'rasiz» — darsda ko'rsatilmaydi · S10 «siz Entity deysiz» ↔ S29 «ikkala so'zni birga ayting».

## C. Tekshirilmagan da'volar (yurgizishda yo'q)
15. 🟠 S11-6 (mapped-types'dan PartialType → Swagger'da maydon yo'qoladi) · S20-4 va P3 (`Constructors for derived classes…`) · S21-5 va P3 (`Property 'findOne' does not exist` — haqiqiy TS xabari «Did you mean…» qo'shishi mumkin) · P3 (`Cannot find module 'src/core'` — ehtimol boshqa matn) · T2 («`@Column`siz — ustun yaratilmaydi, xato yo'q») · S14-6, S20-6 («AI ko'pincha findAll'ni qayta yozadi»).
16. 🔴⚠ S36 uyga vazifa: `car.entity`ga `@ManyToOne` + `brandId NOT NULL` — P3 dan qolgan mashinalar bor jadvalda synchronize yiqilishi mumkin. Sinalmagan.

## D. Metodik tuzilma
17. 🔴 5 qatlam IKKI marta o'tiladi: 3-bosqich (admin, o'qish, S10–S14) va 5-bosqich (car, yozish, S18–S22) — ~10 ekran takror.
18. 🟠 Birinchi misol eng murakkabi: admin (bcrypt, token, onModuleInit, signIn) — oddiy car'dan oldin.
19. 🟠 Tushuncha o'rgatilmasdan ishlatiladi: S7 (ValidationPipe, «DTO qoidasi») DTO ekrani S11 dan oldin.
20. 🟠 Amaliyot joylashuvi: 3-bosqich (5 qatlam) amaliyotsiz; uning oxiridagi P2 aslida 4-bosqich mavzusi (token, Guard). 2- va 4-bosqichda amaliyot yo'q.
21. 🟠 Uzun passiv bloklar: S5–S9 (5 ekran), S10–S14 (5), S28–S34 — 7 ta ketma-ket tinglash ekrani, oxirida sinov.
22. 🔴 Darsning «asosiy maqsadi» — ko'prik (7-bosqich) — yakuniy sinovda 0 savol: 8 savolning hammasi texnik.
23. 🟠✔ Hajm: ovoz o'lchandi — 7035 so'z ≈ 66 daqiqa (pasportda 55); + amaliyotlar ~45 daqiqa + sinov → ~2,5 soat (pasportda 2).
24. 🟠 Ortiqcha chuqurlik: S17 (refresh token, cookie — o'quvchi darslarida yo'q, ustiga fakt xato), S11-6 (paketlar farqi), cookie-parser, sahifalash.
25. 🟡 Takror: ortiqcha `color` → 400 (S7, S25, sinov q4); matnli `price` (S19, S25, P3). S25 asosan oldingilarni qaytaradi.
26. 🟡 S3 — namoyish ekranida «Hozir to'ldiring» (amaliyot keyinroq, P1 da).

## E. Isbot va tekshiruvlar
27. 🟠 P1 isboti `Super admin created successfully` faqat birinchi yaratilganda chiqadi; superadmin bazada bo'lsa (avval ishga tushirgan, bo'sh .env bilan) — satr chiqmaydi, Davom ochilmaydi, mentor qotadi. «database already exists» holati jadvalda yo'q.
28. 🟠 P2 isboti: har JWT `eyJhbGciOi` bilan boshlanadi — 10 belgi har doim bir xil, xato izohi `eyJ`ni ochib qo'yadi. 200 va 401 ko'rilganini isbotlamaydi.
29. 🟡 P3 isboti: istalgan 8 hex belgi o'tadi; S23 ekranida `efa80745` turibdi — ko'chirsa bo'ladi.
30. 🟡 Sinov variantlarida «belgi»: q1 — qavs faqat to'g'risida; q3, q5 — to'g'ri variant boshqalardan ancha uzun.
31. 🟡 T5 — S24 ning nomlari almashtirilgan nusxasi; T1, T3 — hozirgina aytilgan narsani so'raydi (transfer kam).

## F. Ovoz
32. 🟠 23 segmentda kod deyarli so'zma-so'z o'qiladi («InjectRepository Car entity, carRepo, tipi Repository Car entity», «Update admin dto Partial type Create admin dto dan») — ovoz qoidasi: kod o'qilmaydi, nima bo'layotgani aytiladi.

## G. Qurishda (texnik)
33. 🟡 LineCheck `target`: Nest-1 da 0 dan sanaladi (`target={10}` = 11-satr). MD'da 1 dan — T2/T4 da bitta siljiydi.
34. 🟡 T2 Explorer'da `car.entity.ts` — car fayllari 5-bosqichgacha yo'q.

## H. Repo (qaror 1a — o'zgarmaydi, lekin mentor bilishi kerak)
35. 🟡✔ `GET /admin…` javobida `hashed_password` qaytadi (S13 namunada `…` bilan yashirilgan). O'quvchi so'rasa — javob kerak.

## I. ⚠ holatlar haqiqiy yurgizildi (31.10 12:42, `manba/drive-nest2-extra2.sh` → `nest2-out/21–26`)
- **3-band ✔ TASDIQLANDI** (`21-roles-superadmin.txt`): `@Roles('admin')` eshikka superadmin tokeni → **403 Forbidden resource**; oddiy admin `ali` → 201; tokensiz → 401. `@Roles('public')` → tokensiz 200. `@Roles` yozilmagan eshik → tokensiz 401, superadmin 200, ali 200 («tizimga kirganlar» aynan shunday yoziladi). `@Roles(UserRole.ADMIN)` DELETE → superadmin 403, ali 200. `POST /api/v1/admin` tokensiz → 401 (S7 dagi 400 lar faqat token bilan).
- **7-band ✔ TASDIQLANDI** (`22-token-expiry.txt`, `Access_Token_Time=5s`): token eskirgach GET → 401; `POST /admin/token` cookie bilan → 401, cookie + eskirgan token → 401, cookie + **yangi** token → 201. Demak `/admin/token` eskirgan tokenni tiklamaydi — yechim: qayta signin.
- **T2 (15-band) ✔ KUCHLIROQ CHIQDI** (`23-entity-isnumber.txt`): Entity'da `@Column` o'rniga `@IsNumber` → server xatosiz ishga tushadi, **synchronize `price` ustunini bazadan O'CHIRADI**, POST 201 qaytadi, lekin javobda ham, bazada ham `price` yo'q — jim ma'lumot yo'qotish.
- **16-band ✔ TASDIQLANDI** (`24-brand-fk.txt`): jadvalda satr bo'lganda `@Column() brandId` (NOT NULL) qo'shilsa server yiqiladi: `QueryFailedError: column "brandId" of relation "cars" contains null values`. `@Column({ nullable: true })` bilan ishga tushadi, FK yaratiladi. Uyga vazifa va S31 shunga moslanadi.
- **15-band TS matnlari ✔** (`25-ts-errors.txt`): `error TS2377: Constructors for derived classes must contain a 'super' call.` · `error TS2551: Property 'findOne' does not exist on type 'CarService'. Did you mean 'findOneBy'?` · `error TS2305: Module '"src/core"' has no exported member 'CarEntity'.` (car.module.ts va car.service.ts — ikki joyda).
- **S11-6 ✔ TASDIQLANDI** (`26-mapped-types.txt`): `PartialType` `@nestjs/mapped-types`dan bo'lsa Swagger'da `UpdateCarDto` → `properties: {}` (maydonlar yo'qoladi), PATCH esa ishlaydi (200).
- **27-band ✔** `Super admin created successfully` faqat birinchi ishga tushirishda (07 log: 1, 11/16 log: 0).
- Yurgizish tuzoqlari: inline buyruq qatorida «nest start» so'zi bo'lsa skriptdagi `pkill -f` o'z shellini o'ldiradi (ikki marta, exit 144); `start()` kompilyatsiyani kutmasa eski server javob beradi (bir to'plam natija yaroqsiz bo'lib qayta olindi).
