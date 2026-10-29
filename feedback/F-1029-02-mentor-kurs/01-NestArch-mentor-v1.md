# Mentor kursi · 1-dars «NestJS arxitekturasi: Module, Controller, Service» — ovozli ssenariy v1

F-ID: F-1029-02 · Sana: 2026-10-29 · Holat: **KO'RIKDA** (GATE M kutilmoqda) · Fidbek: qator yoniga `>> …`

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | CoddyCamp mentori. Node, Express, Telegraf, Postman — biladi. NestJS, TypeScript dekoratorlari, Dependency Injection — yangi. |
| Qanday o'qiydi | Yolg'iz, platformada, ustozsiz. Dars o'zi ustoz: ovoz + ekran sinxron, har ekranda pauza va qaytarish. |
| Dars oxirida mentor | 1) bo'sh papkadan `/cars` ishlaydigan Nest server quradi · 2) Controller/Service/Module vazifasini o'z so'zi bilan aytadi · 3) Nest'ning 4 ta tipik xato xabarini o'qib, qaysi faylni ochishni biladi · 4) o'quvchi darsi (m4a-01) qaysi so'z bilan nimani atashini biladi |
| Til | Faqat o'zbekcha, adabiy, «siz». Atama inglizcha qoladi, birinchi uchrashda qavsda izoh (imtihon uslubi: «fulfilled (bajarildi)»). |
| Misol-ip | `cars-api` loyihasi, `Car` resursi (Chevrolet Malibu, Kia K5, Cobalt). O'quvchi darsi m4a-03 ham shu resursda. Kod nomlari inglizcha. |
| Haqiqiylik | Barcha kod, jurnal (log) va xato matnlari 29.10.2026 da haqiqiy loyihada yurgizilgan: Nest 11.0.1 · CLI 11.0.10 · Node 24.18 · TypeScript 5.7. Hech bir chiqish o'ylab topilmagan. |
| Ovoz | Qoralama: `uz-UZ-SardorNeural` (edge-tts, so'z-vaqt belgilari bilan). Yakuniy: ElevenLabs, o'sha matndan. Matn o'zgarsa audio qayta yasaladi. |
| O'yin qatlami | Yo'q: arena, podium, nishon, ball yo'q. Bor: jarayon chizig'i «N / 28», 3 oraliq tekshiruv, 1 o'z-sinov (8 savol), amaliyot ro'yxati. |
| Hajm | 28 ekran · ovoz ≈ 30–34 daqiqa · amaliyot ≈ 20 daqiqa · o'z-sinov ≈ 8 daqiqa |

### Belgilar va dvigatel qoidalari (KOD — JSX quriladigan bosqichda)
- **Ovoz** maydoni — mentor eshitadigan HAR so'z. `[[id]]` belgisi: shu so'z aytilganda ekranda `id` elementi yonadi (ajralib turadi). TTS'ga belgi yuborilmaydi, dvigatel uni keyingi so'zning vaqtiga bog'laydi.
- Ekranga kirilganda ovoz o'zi boshlanadi (birinchi ekranda «Boshlash» bosilgach — brauzer talabi). Boshqaruv: ▶ / ❚❚ · −10 s · tezlik 1× · 1.25× · 1.5× · «Matn» (transkriptni ko'rsatish/yashirish).
- «Davom» tugmasi doim ko'rinadi, lekin ovoz tugamaguncha xira; mentor xohlasa baribir bosa oladi (kattalar). Tekshiruv ekranlarida javob tanlanmaguncha «Davom» yopiq.
- Kod panellari: satr raqamlari, «Nusxalash» tugmasi. Terminal panellari: haqiqiy chiqish, rangsiz, monoshrift.
- Audio fayl nomlari: `mentor/nest-01/s01.mp3` + `s01.json` (so'z-vaqt). Qayerda turadi — **ochiq savol** (pastda).

---

## A. Darsning tayanchi

**Tushunchalar (bir ma'no — bir so'z):**
- so'rov (request) · javob (response) · marshrut (route) · manzil (URL yo'li)
- Controller — so'rovni qabul qiladi, Service'ni chaqiradi, javobni qaytaradi. Yupqa.
- Service — ishni bajaradi (hisob, qoida, baza). So'rov haqida bilmaydi. Nest tilida **provider**.
- Module — ro'yxat: `imports` · `controllers` · `providers`. Nest faqat ro'yxatdagini ko'radi.
- dekorator (decorator) — klass yoki metod ustidagi `@` belgi; Nest'ga «bu nima» deb aytadi.
- Dependency Injection — bog'liqlikni yetkazib berish: siz yaratmaysiz, Nest konstruktor orqali beradi.
- HttpException oilasi — `NotFoundException` 404 · `BadRequestException` 400 · `UnauthorizedException` 401 · `ForbiddenException` 403. Oddiy `Error` → 500.

**Darsning ipi:** bitta so'rovning yo'li — brauzer → Controller → Service → javob. Har ekran shu yo'lning bir joyini kattalashtiradi. Vizual: uchta quti (Controller ko'k · Service yashil · Module sariq) butun dars davomida bir xil rangda.

**Bosqichlar:** 1 Nega Nest (S2–S4) · 2 Uch bo'lak (S5–S10) · 3 Dependency Injection (S11) · 4 cars'ni quramiz (S12–S17) · 5 Buzamiz va o'qiymiz (S18–S23) · 6 Amaliyot (S24) · 7 O'quvchi darsiga ko'prik (S25–S26) · O'z-sinov va yakun (S27–S28)

---

## S1 · Kirish — «Siz Express'ni bilasiz. Endi Nest.»
- **Ekranda:** chapda sarlavha va 7 bosqichli reja (kartalar, id: `reja1…reja7`). O'ngda yakuniy natija maketi: terminalda `GET /cars` va JSON javob (2 mashina).
- **Ovoz:**
  Assalomu alaykum. Siz Express bilan server yozgansiz: marshrut ochgansiz, so'rovni qabul qilgansiz, javob qaytargansiz. Bugun shu bilimingiz ustiga NestJS qo'yamiz. Nest Express'ni bekor qilmaydi, aksincha, uning ustiga tartib o'rnatadi. Dars oxirida siz bo'sh papkadan boshlab [[reja4]] mashinalar ro'yxatini qaytaradigan server qurasiz, [[reja5]] Nest'ning xato xabarlarini o'qiy olasiz va [[reja7]] o'quvchi darsida qaysi so'z nimani anglatishini bilasiz. Dars yetti bosqichdan iborat, reja ekranning chap tomonida turibdi. Shoshilmang: har ekranda ovozni to'xtatish, o'n soniya orqaga qaytarish va matnini o'qish mumkin. Tayyor bo'lsangiz, «Boshlash»ni bosing.
- **Harakat:** «Boshlash» (birinchi ishora; keyingi ekranlarda ovoz o'zi boshlanadi).
- ≈ 55 s

## S2 · Express: tanish manzara va og'riq
- **Ekranda:** kod paneli `server.js` (Express, 38 qator): `app.get('/cars')` (id `route1`), `app.get('/cars/:id')` (`route2`), `app.post('/cars')` (`route3`), ichida massiv va mantiq. Panel burchagida hisoblagich «server.js · 38 qator». `[[grow]]` da panel tez aylanib «1240 qator» bo'ladi, orasida `// login qayerda???` izohi qizil yonadi.
- **Ovoz:**
  Mana sizga tanish fayl. Express, bitta server.js. [[route1]] /cars manziliga GET kelsa ro'yxatni qaytaramiz, [[route2]] /cars/:id kelsa bittasini qidiramiz, [[route3]] POST kelsa yangisini qo'shamiz. Hammasi o'ttiz sakkiz qator, hammasi ko'z oldingizda. Bu bosqichda hech qanday muammo yo'q. Muammo loyiha o'sganda boshlanadi. [[grow]] Foydalanuvchilar qo'shildi, kirish va ro'yxatdan o'tish qo'shildi, buyurtmalar, to'lov, fayl yuklash. Endi fayl ming ikki yuz qirq qator. Login qayerda edi? Qidirasiz. Bitta marshrut ichida ham so'rovni o'qish, ham tekshirish, ham bazaga yozish bor. Shu bo'lakni alohida sinab bo'lmaydi, chunki u marshrutdan ajralmagan. Ikki kishi bir faylda ishlasa, har kuni to'qnashuv. Siz buni his qilgansiz. Nest aynan shu og'riq uchun yaratilgan.
- ≈ 65 s

## S3 · Nest nima beradi: majburiy tartib
- **Ekranda:** ikki qavatli sxema: pastda quti «Express (platform-express)» (id `express`), ustida «NestJS — tartib va nomlar» (`nest`). Ichida uch quti: Controller (`ctrl`, ko'k) · Service (`svc`, yashil) · Module (`mod`, sariq). Yon izoh: «So'rovni haqiqatda Express qabul qiladi».
- **Ovoz:**
  Tajribali Express dasturchi ham faylni bo'ladi: routes papkasi, controllers papkasi, services papkasi. Lekin har jamoa buni o'zicha qiladi, yangi odam kelganda tartibni qaytadan o'rganadi. Nest shu tartibni [[nest]] majburiy va bir xil qiladi. U uchta bo'lakka nom beradi: [[ctrl]] Controller, [[svc]] Service, [[mod]] Module. Har Nest loyihasida ular bir xil joyda, bir xil nomda turadi. Shuning uchun Toshkentdagi jamoa yozgan loyihani Berlindagi dasturchi ochsa, qayerda nima turganini bir daqiqada topadi. Yana bir muhim fakt: [[express]] Nest ichida o'sha Express ishlaydi. So'rovni haqiqatda Express qabul qiladi, Nest esa uni to'g'ri bo'lakka yo'naltiradi. Demak siz bilgan hech narsa bekor bo'lmaydi.
- ≈ 55 s

## S4 · TypeScript va dekorator: `@` belgisi
- **Ekranda:** kod: `@Controller('cars')` (id `ctrl`) ustida, `export class CarsController {}` pastida; yonida `@Get()` (id `get`). `@` belgilari katta, ajratilgan (id `at`). Karta: «Dekorator (decorator) — klass yoki metod ustiga yoziladigan belgi. Kod bajarmaydi, Nest'ga shu narsa nima ekanini aytadi.»
- **Ovoz:**
  Nest loyihalari TypeScript'da yoziladi. TypeScript bu JavaScript'ning o'zi, faqat tiplari bor: string, number va shunga o'xshash. Siz JavaScript bilsangiz, TypeScript'ni o'qiy olasiz. Lekin bitta yangi narsa bor, u bilan ko'p uchrashasiz: [[at]] «et» belgisi bilan boshlanadigan satrlar. Masalan, [[ctrl]] @Controller('cars'). Bu dekorator deyiladi. Dekorator klass yoki metodning tepasiga yoziladi va Nest'ga xabar beradi: «bu klass Controller, uning manzili cars». [[get]] @Get esa metod ustida turadi: «GET so'rov kelsa, shu metod». Dekorator kodni bajarmaydi, u belgi qo'yadi. Nest ishga tushganda shu belgilarni o'qib, hamma bo'lakni joyiga qo'yadi. Shuni eslab qoling: dekorator yo'q bo'lsa, Nest o'sha klassni tanimaydi. Buni keyinroq ataylab buzib ham ko'rsatamiz.
- ≈ 60 s

## S5 · Uch bo'lak bir qarashda — tirik loyiha
- **Ekranda:** chapda `nest new cars-api` daraxti (id `tree`): `src/main.ts` (`main`), `app.module.ts` (`module`, sariq), `app.controller.ts` (`controller`, ko'k), `app.service.ts` (`service`, yashil), `app.controller.spec.ts` (xira). O'ngda so'rov yo'li (id `flow`): Brauzer → AppController → AppService → «Hello World!» — ovoz aytganda nuqta yo'l bo'ylab yuradi.
- **Ovoz:**
  Endi haqiqiy loyihaga qaraymiz. nest new cars-api buyrug'i mana shu fayllarni yaratdi. [[tree]] src papkasida to'rtta asosiy fayl bor: [[main]] main.ts, [[module]] app.module.ts, [[controller]] app.controller.ts va [[service]] app.service.ts. Bitta so'rovning yo'lini kuzataylik. [[flow]] Brauzer localhost uch ming manziliga keldi. So'rovni [[controller]] AppController qabul qildi, chunki unda GET uchun metod bor. Controller o'zi javob o'ylab topmaydi, u [[service]] AppService'dan so'raydi. Service «Hello World!» matnini qaytaradi. Controller shu matnni brauzerga yuboradi. [[module]] AppModule esa bu ikkalasini bitta ro'yxatda ushlab turadi, Nest shu ro'yxatga qarab ularni yig'adi. Mana shu yo'lni, so'rov, Controller, Service, javob, dars davomida ko'p marta ko'rasiz. Keyingi uch ekranda har faylni ochib o'qiymiz.
- ≈ 60 s

## S6 · Controller — so'rovni qabul qiladi
- **Ekranda:** `app.controller.ts` (haqiqiy), satr raqamli; id'lar: `l-decorator` (4-satr), `l-class` (5), `l-ctor` (6), `l-get` (8), `l-return` (10).
  ```ts
  import { Controller, Get } from '@nestjs/common';
  import { AppService } from './app.service';

  @Controller()
  export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
      return this.appService.getHello();
    }
  }
  ```
- **Ovoz:**
  app.controller.ts. [[l-decorator]] To'rtinchi satr: @Controller(). Qavs ichi bo'sh, demak bu Controller'ning manzili ildiz, ya'ni oddiy slesh. Agar @Controller('cars') yozsak, uning hamma metodlari /cars bilan boshlanadi. [[l-class]] Keyin oddiy klass: AppController. [[l-ctor]] Konstruktorda bitta satr bor: private readonly appService: AppService. Buni hozircha shunday tushuning: «bu Controller'ga AppService kerak». Qanday kelishini alohida ekranda gaplashamiz. [[l-get]] Pastda @Get() dekoratori. U metod ustida turibdi va aytyapti: «GET so'rov kelsa, shu metodni chaqir». Express'dagi app.get bilan bir xil ma'no, faqat endi metodning ustida. [[l-return]] Metod ichida bitta ish: this.appService.getHello() natijasini qaytarish. E'tibor bering: Controller'da mantiq yo'q. U so'rovni oldi, kerakli Service'ni chaqirdi, javobni qaytardi. Controller shunday yupqa bo'lishi kerak.
- ≈ 65 s

## S7 · Service — ishni bajaradi
- **Ekranda:** `app.service.ts` (haqiqiy); id: `l-injectable` (3), `l-class` (4), `l-method` (5–7). Yon karta: «Service'da: hisob · qoida · bazaga murojaat. Service'da yo'q: req, res, manzil.»
  ```ts
  import { Injectable } from '@nestjs/common';

  @Injectable()
  export class AppService {
    getHello(): string {
      return 'Hello World!';
    }
  }
  ```
- **Ovoz:**
  app.service.ts. [[l-injectable]] Ustida @Injectable() dekoratori. Bu so'z inglizcha, «yetkazib berish mumkin» degani: Nest'ga aytadi, shu klassni kerak bo'lgan joyga yetkazib bersa bo'ladi. [[l-method]] Ichida getHello metodi, u «Hello World!» qaytaradi. Hozir bu juda kichkina, lekin qoida katta loyihada ham o'zgarmaydi: haqiqiy ish Service'da bo'ladi. Narxni hisoblash, qoidani tekshirish, bazaga yozish, hammasi shu yerda. Bir narsaga e'tibor bering: Service so'rov haqida hech narsa bilmaydi. Unda req ham, res ham yo'q. Shuning uchun uni alohida sinash oson: metodni chaqirasiz, natijani tekshirasiz, server shart emas. Jest darsida aynan shuni qilasiz. Va shuning uchun bitta Service'ni ikki joy ishlatishi mumkin, masalan, HTTP Controller ham, Telegram bot ham.
- ≈ 55 s

## S8 · Module — ro'yxat
- **Ekranda:** `app.module.ts` (haqiqiy); id: `l-module` (5), `l-imports` (6), `l-controllers` (7), `l-providers` (8). Karta: «imports — boshqa modullar · controllers — shu modulning Controller'lari · providers — shu modul yaratib beradigan narsalar (Service'lar)».
  ```ts
  import { Module } from '@nestjs/common';
  import { AppController } from './app.controller';
  import { AppService } from './app.service';

  @Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {}
  ```
- **Ovoz:**
  app.module.ts. [[l-module]] @Module dekoratori va ichida uchta ro'yxat. [[l-controllers]] controllers: shu modulga tegishli Controller'lar. [[l-providers]] providers: shu modul yaratib beradigan narsalar, hozircha bu Service'lar. provider so'zini eslab qoling, Nest Service'ni shunday ataydi. [[l-imports]] imports: boshqa modullar, hozir bo'sh. Module hech qanday ish qilmaydi, u ro'yxat. Lekin bu ro'yxat hal qiluvchi: Nest faqat shu yerda yozilgan narsani ko'radi. Controller yozib, uni controllers ro'yxatiga qo'shmasangiz, u yo'qdek. Service yozib, providers'ga qo'shmasangiz, Nest uni yetkazib bera olmaydi. Loyihada bir nechta modul bo'ladi: cars uchun, users uchun, orders uchun. Hammasining tepasida AppModule turadi va qolganlarini imports orqali o'ziga ulaydi.
- ≈ 55 s

## S9 · main.ts va ishga tushish jurnali
- **Ekranda:** chapda `main.ts` (haqiqiy; id `main-create` 5-satr, `main-listen` 6-satr). O'ngda terminal: `$ npm run start:dev` va haqiqiy jurnal (id `log1…log4`), pastida brauzer satri `localhost:3000` → «Hello World!» (id `hello`).
  ```ts
  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';

  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
  }
  bootstrap();
  ```
  ```
  [Nest] LOG [NestFactory] Starting Nest application...
  [Nest] LOG [InstanceLoader] AppModule dependencies initialized
  [Nest] LOG [RoutesResolver] AppController {/}:
  [Nest] LOG [RouterExplorer] Mapped {/, GET} route
  [Nest] LOG [NestApplication] Nest application successfully started
  ```
- **Ovoz:**
  Hammasi main.ts dan boshlanadi. [[main-create]] NestFactory.create(AppModule): Nest'ga bosh modulni beramiz. U modul ro'yxatini o'qiydi, Service'larni yaratadi, Controller'larni ulaydi. [[main-listen]] Keyin listen uch ming: Express'dagi kabi portni tinglaydi. Endi terminalga qarang, npm run start:dev yozdik. [[log1]] Starting Nest application. [[log2]] AppModule dependencies initialized: AppModule'ning bog'liqliklari tayyor, ya'ni ro'yxatdagi hamma narsa yaratildi. [[log3]] AppController, qavsda slesh: Controller topildi va unga manzil berildi. [[log4]] Mapped slesh, GET route: slesh manziliga GET marshruti ulandi. Nest application successfully started. Bu satrlarni o'qishni odat qiling. Keyinchalik biror marshrut ishlamasa, birinchi qiladigan ishingiz shu jurnalga qarash bo'ladi: Mapped satri bormi, yo'qmi. [[hello]] Brauzerda localhost uch ming, javob: Hello World!
- ≈ 65 s

## S10 · Tekshiruv 1
- **Savol:** Mashina narxiga chegirma hisoblaydigan kodni qayerga yozasiz?
- **Variantlar:** A) Controller metodi ichiga · B) Service metodi ichiga ✔ · C) AppModule ichiga · D) main.ts ichiga
- **Ovoz (savol):** Birinchi tekshiruv. Faraz qiling, mashina narxiga chegirma hisoblash kerak. Bu kod qayerga yoziladi? Variantni tanlang.
- **Ovoz (to'g'ri):** Service. Hisob, qoida va bazaga murojaat Service'da turadi. Controller faqat so'rovni oladi va Service'ni chaqiradi. Shunda chegirmani serversiz ham sinab ko'rish mumkin.
- **Ovoz (xato) — tanlangan variantga qarab, keyin to'g'ri izoh:** A) Controller yupqa qoladi: u so'rovni oladi va uzatadi, hisoblamaydi. · C) Module ro'yxat, unda ish bajaradigan kod yozilmaydi. · D) main.ts faqat ilovani ishga tushiradi.
- ≈ 35 s

## S11 · Dependency Injection — Service Controller'ga qanday keladi
- **Ekranda:** ikki ustun. Chap «Express'da» (id `ex-require`): `const CarsService = require('./cars.service'); const service = new CarsService();` — bu satr uch faylda takrorlangan ko'rinadi. O'ng «Nest'da» (id `nest-ctor`): `constructor(private readonly carsService: CarsService) {}`. Markazda quti «Nest konteyneri» (id `container`): providers ro'yxatidan AppService'ni bir marta yaratadi, strelka bilan Controller'ga beradi; «1 nusxa» yorlig'i (id `single`).
- **Ovoz:**
  Endi konstruktordagi o'sha satrga qaytamiz. [[nest-ctor]] constructor, private readonly appService: AppService. [[ex-require]] Express'da siz Service'ni o'zingiz chaqirardingiz: require qilib, new bilan yaratib, har kerakli faylda qaytadan. Nest'da siz yaratmaysiz. Siz faqat aytasiz: «menga AppService kerak». [[container]] Nest ishga tushganda providers ro'yxatiga qaraydi, AppService'ni bir marta yaratadi va kimga kerak bo'lsa, konstruktor orqali qo'liga beradi. Bu usul Dependency Injection deyiladi, bog'liqlikni yetkazib berish. Bog'liqlik, chunki Controller Service'ga bog'liq. Yetkazib berish, chunki uni Nest olib keladi. [[single]] Nega bu yaxshi? Birinchidan, butun loyihada bitta nusxa. Ikkinchidan, test paytida haqiqiy Service o'rniga soxtasini berish mumkin, Controller buni sezmaydi. Uchinchidan, Controller Service qayerdan kelganini bilishi shart emas. Konstruktordagi tip, AppService, Nest uchun buyurtma varaqasi: tipga qarab nimani berishni biladi.
- ≈ 70 s

## S12 · CLI bilan cars modulini yaratamiz
- **Ekranda:** terminal, uch buyruq va haqiqiy chiqish (id `cmd1/out1`, `cmd2/out2`, `cmd3/out3`). O'ngda `app.module.ts` farqi: yangi satr `imports: [CarsModule]` yashil (id `diff`).
  ```
  $ nest g module cars
  CREATE src/cars/cars.module.ts (81 bytes)
  UPDATE src/app.module.ts (308 bytes)

  $ nest g controller cars --no-spec
  CREATE src/cars/cars.controller.ts (97 bytes)
  UPDATE src/cars/cars.module.ts (166 bytes)

  $ nest g service cars --no-spec
  CREATE src/cars/cars.service.ts (88 bytes)
  UPDATE src/cars/cars.module.ts (240 bytes)
  ```
- **Ovoz:**
  Endi o'zimiz quramiz. Mashinalar uchun alohida modul kerak. Nest CLI buni uch buyruq bilan yaratadi. [[cmd1]] nest g module cars. g bu generate, yaratish. [[out1]] Natija ikki satr: CREATE cars.module.ts va UPDATE app.module.ts. Ikkinchi satrga e'tibor bering: CLI bosh modulga o'zi kirib, [[diff]] imports ro'yxatiga CarsModule'ni qo'shib qo'ydi. Qo'l bilan qilsangiz, aynan shuni unutasiz. [[cmd2]] nest g controller cars. --no-spec qo'shimchasi test faylini hozircha yaratma degani, Jest darsida qaytamiz. [[out2]] CREATE cars.controller.ts, UPDATE cars.module.ts: Controller yaratildi va cars modulining controllers ro'yxatiga yozildi. [[cmd3]] nest g service cars. [[out3]] Service yaratildi va providers ro'yxatiga yozildi. Uch buyruq, oltita o'zgarish va hamma ro'yxat to'g'ri. CLI'ga ishonish mumkin, lekin u nima qilganini bilish shart, chunki buzilganda qo'l bilan tuzatasiz.
- ≈ 65 s

## S13 · Bo'sh fayllar: Controller ro'yxatda, lekin marshrut yo'q
- **Ekranda:** uch kichik kod paneli (haqiqiy; id `f-module`, `f-ctrl`, `f-svc`). Pastda terminal: jurnalda yangi satr `CarsController {/cars}:` (id `log`), Mapped yo'q; brauzer `/cars` → 404 JSON (id `curl`).
  ```ts
  // cars.module.ts
  @Module({
    controllers: [CarsController],
    providers: [CarsService]
  })
  export class CarsModule {}

  // cars.controller.ts
  @Controller('cars')
  export class CarsController {}

  // cars.service.ts
  @Injectable()
  export class CarsService {}
  ```
  ```
  {"message":"Cannot GET /cars","error":"Not Found","statusCode":404}
  ```
- **Ovoz:**
  Yaratilgan fayllarga qarang. [[f-module]] cars.module.ts: controllers'da CarsController, providers'da CarsService. [[f-ctrl]] cars.controller.ts: @Controller('cars') va bo'sh klass. [[f-svc]] cars.service.ts: @Injectable() va bo'sh klass. Serverni ishga tushiramiz. [[log]] Jurnalda yangi satr: CarsController, qavs ichida slesh cars. Nest Controller'ni ko'rdi va unga /cars manzilini berdi. Lekin Mapped satri yo'q, chunki klass ichida hali bitta ham metod yo'q. [[curl]] Brauzerda /cars ochsak: 404, Cannot GET /cars. Bu xato emas, bu tabiiy holat: eshik bor, ichida hech kim yo'q. Keyingi ikki ekranda avval Service'ni, keyin Controller'ni to'ldiramiz. Tartib aynan shunday: avval ishni bajaradigan bo'lak, keyin uni chaqiradigan bo'lak.
- ≈ 55 s

## S14 · Service: ro'yxat va uch metod
- **Ekranda:** `cars.service.ts` to'liq (haqiqiy); id: `l-interface` (3–8), `l-array` (12–15), `l-findAll` (17–19), `l-findOne` (21–27), `l-notfound` (24), `l-create` (29–33).
  ```ts
  import { Injectable, NotFoundException } from '@nestjs/common';

  export interface Car {
    id: number;
    brand: string;
    model: string;
    price: number;
  }

  @Injectable()
  export class CarsService {
    private cars: Car[] = [
      { id: 1, brand: 'Chevrolet', model: 'Malibu', price: 250 },
      { id: 2, brand: 'Kia', model: 'K5', price: 320 },
    ];

    findAll(): Car[] {
      return this.cars;
    }

    findOne(id: number): Car {
      const car = this.cars.find((c) => c.id === id);
      if (!car) {
        throw new NotFoundException(`Car with id ${id} not found`);
      }
      return car;
    }

    create(data: Omit<Car, 'id'>): Car {
      const car: Car = { id: this.cars.length + 1, ...data };
      this.cars.push(car);
      return car;
    }
  }
  ```
- **Ovoz:**
  cars.service.ts ni to'ldiramiz. [[l-interface]] Avval Car interfeysi: mashinada id, brand, model va price bo'ladi. Interface TypeScript'ning shakl tavsifi, bazadagi jadval emas, hozircha shunchaki shakl. [[l-array]] Keyin ro'yxat: ikkita mashina, Chevrolet Malibu va Kia K5, narxi million so'mda. Baza hali yo'q, ma'lumot xotirada turibdi, bu dars uchun yetarli. [[l-findAll]] findAll ro'yxatni qaytaradi. [[l-findOne]] findOne id bo'yicha qidiradi. [[l-notfound]] Topilmasa, NotFoundException tashlaydi. Bu Nest'ning tayyor xatosi: siz uni tashlaysiz, Nest uni o'zi 404 javobga aylantiradi, statusi va xabari bilan. Express'da buni res.status(404).json deb qo'lda yozardingiz. [[l-create]] create yangi mashinani ro'yxatga qo'shadi va qaytaradi. Yana bir marta qarang: bu faylda so'rov haqida bitta so'z ham yo'q. Faqat mashinalar va ular bilan ishlaydigan uch metod.
- ≈ 65 s

## S15 · Controller: uch marshrut
- **Ekranda:** `cars.controller.ts` to'liq (haqiqiy); id: `l-ctrl` (4), `l-ctor` (6), `l-get` (8–11), `l-getid` (13), `l-param` (14), `l-post` (18), `l-body` (19). Yon jadval «Express ↔ Nest»: `app.get('/cars', …)` ↔ `@Get()` · `req.params.id` ↔ `@Param('id') id` · `req.body` ↔ `@Body() body` · `app.use(express.json())` ↔ kerak emas, yoqilgan.
  ```ts
  import { Body, Controller, Get, Param, Post } from '@nestjs/common';
  import { CarsService } from './cars.service';

  @Controller('cars')
  export class CarsController {
    constructor(private readonly carsService: CarsService) {}

    @Get()
    findAll() {
      return this.carsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.carsService.findOne(Number(id));
    }

    @Post()
    create(@Body() body: { brand: string; model: string; price: number }) {
      return this.carsService.create(body);
    }
  }
  ```
- **Ovoz:**
  cars.controller.ts. [[l-ctrl]] @Controller('cars'): hamma metod /cars bilan boshlanadi. [[l-ctor]] Konstruktor: menga CarsService kerak. [[l-get]] @Get() bo'sh: GET /cars. Metod findAll'ni chaqiradi. [[l-getid]] @Get(':id'): GET /cars/5 kabi manzil. [[l-param]] @Param('id') id: Express'dagi req.params.id ning o'zi, faqat dekorator orqali olinadi. Manzildan kelgan qiymat har doim matn, shuning uchun Number bilan raqamga o'tkazamiz. [[l-post]] @Post(): POST /cars. [[l-body]] @Body() body: Express'dagi req.body. Nest'da express.json() ni qo'lda ulash shart emas, u ichida yoqilgan. Qarang, uchala metod ham bir xil shaklda: so'rovdan kerakli qismni olish, Service metodini chaqirish, natijani qaytarish. Controller'da if yo'q, hisob yo'q, baza yo'q.
- ≈ 60 s

## S16 · Ishga tushiramiz: jurnal va javoblar
- **Ekranda:** chapda terminal jurnali (haqiqiy; id `log-mapped` — uch Mapped satri). O'ngda «So'rov yuborish» paneli: to'rt tugma `GET /cars` (id `r1`) · `GET /cars/1` (`r2`) · `GET /cars/99` (`r3`) · `POST /cars {Cobalt}` (`r4`); bosilganda status va haqiqiy JSON ochiladi. Ovoz aytganda tegishli javob o'zi ochiladi.
  ```
  [Nest] LOG [RoutesResolver] CarsController {/cars}:
  [Nest] LOG [RouterExplorer] Mapped {/cars, GET} route
  [Nest] LOG [RouterExplorer] Mapped {/cars/:id, GET} route
  [Nest] LOG [RouterExplorer] Mapped {/cars, POST} route
  [Nest] LOG [NestApplication] Nest application successfully started
  ```
  ```
  GET /cars      → 200  [{"id":1,"brand":"Chevrolet","model":"Malibu","price":250},{"id":2,"brand":"Kia","model":"K5","price":320}]
  GET /cars/1    → 200  {"id":1,"brand":"Chevrolet","model":"Malibu","price":250}
  GET /cars/99   → 404  {"message":"Car with id 99 not found","error":"Not Found","statusCode":404}
  POST /cars     → 201  {"id":3,"brand":"Chevrolet","model":"Cobalt","price":145}
  ```
- **Ovoz:**
  Server ishga tushdi. [[log-mapped]] Jurnalda uchta yangi Mapped satri: /cars GET, /cars/:id GET, /cars POST. Uchala marshrut ulangan. Endi so'rov yuboramiz. [[r1]] GET /cars: 200 va ikki mashinalik ro'yxat, JSON ko'rinishida. Biz JSON.stringify yozmadik, Nest obyektni o'zi JSON qiladi. [[r2]] GET /cars/1: 200 va Malibu. [[r3]] GET /cars/99: 404 va xabar, Car with id 99 not found. Bu bizning NotFoundException, Nest uni shu ko'rinishga keltirdi: message, error, statusCode. [[r4]] POST /cars bilan Cobalt yuboramiz: 201 Created va yangi mashina, id uch. E'tibor bering, biz 201 yozmadik. Nest POST uchun 201 ni o'zi qo'yadi, Express'da 200 bo'lardi. Ekranning o'ng tomonidagi tugmalarni o'zingiz bosib ko'ring, har javobni o'qing.
- **Harakat:** kamida 2 tugma bosilgach «Davom» ochiladi.
- ≈ 60 s

## S17 · Tekshiruv 2 — bashorat
- **Savol:** Kodimiz hozirgi holatda. `GET /cars/abc` so'rovi kelsa, javob qanday bo'ladi?
- **Variantlar:** A) 200 va bo'sh obyekt · B) 500 Internal server error · C) 404 va «Car with id NaN not found» ✔ · D) 400 Bad Request
- **Ovoz (savol):** Ikkinchi tekshiruv, bashorat qiling. Kimdir /cars/abc manziliga GET yubordi. Kodimiz hozirgi holatda. Javob qanday bo'ladi?
- **Ovoz (to'g'ri):** 404 va Car with id NaN not found. Number('abc') natijasi NaN. Ro'yxatda id NaN bo'lgan mashina yo'q, shuning uchun findOne NotFoundException tashlaydi. Ishlaydi, lekin xabar chiroyli emas: foydalanuvchi NaN so'zini ko'rmasligi kerak. Yana bir misol: bo'sh POST yuborsangiz, Nest 201 bilan id uch, boshqa hech narsasiz mashina yaratadi. Kiruvchi ma'lumotni tekshirish alohida mavzu, keyingi darsda DTO bilan aynan shuni qilasiz. Hozir muhimi: Nest hech narsani o'zi tekshirmaydi, siz aytmaguncha.
- **Ovoz (xato):** A) find hech narsa topmasa undefined qaytaradi, bizning kod esa bu holatda xato tashlaydi. · B) 500 faqat biz kutmagan xato bo'lganda chiqadi; bu yerda xatoni o'zimiz NotFoundException bilan tashladik. · D) 400 ni hech kim qaytarmaydi, chunki tekshiruv yozilmagan.
- *(Haqiqiy tekshiruv 29.10: `/cars/abc` → 404 `Car with id NaN not found`; bo'sh `POST /cars` → 201 `{"id":3}`.)*
- ≈ 50 s

## S18 · Buzamiz 1: providers bo'sh
- **Ekranda:** chapda `cars.module.ts`, `providers: []` qizil, o'chirilgan `CarsService` chizilgan. O'ngda terminal, haqiqiy xato (qisqartirilgan); id: `e-who`, `e-what`, `e-where`, `e-solutions`.
  ```
  ERROR [ExceptionHandler] Nest can't resolve dependencies of the CarsController (?).
  Please make sure that the argument CarsService at index [0] is available
  in the CarsModule module.

  Potential solutions:
  - Is CarsModule a valid NestJS module?
  - If CarsService is a provider, is it part of the current CarsModule?
  - If CarsService is exported from a separate @Module, is that module imported within CarsModule?
  ```
- **Ovoz:**
  Endi ataylab buzamiz, chunki o'quvchilaringiz aynan shu xatolarni qiladi, siz esa ularni o'qiy olishingiz kerak. Birinchi holat: cars.module.ts da providers ro'yxatidan CarsService'ni o'chirdik. Serverni ishga tushiramiz, u yiqiladi. Xabarni bo'lak-bo'lak o'qiymiz. [[e-who]] Nest can't resolve dependencies of the CarsController: Nest CarsController'ning bog'liqliklarini topa olmadi. Qavsdagi so'roq belgisi bu topilmagan joy. [[e-what]] Please make sure that the argument CarsService at index 0 is available: nolinchi argument, ya'ni konstruktordagi birinchi parametr, CarsService, mavjud emas. [[e-where]] in the CarsModule module: qaysi modulda qidirdi, CarsModule'da. Mana, uch savolga javob bor: kim, nima yetishmayapti, qayerda. [[e-solutions]] Pastda Nest o'zi yechimlarni sanaydi: CarsService provider bo'lsa, u shu modulda bormi? Javob: cars.module.ts ni ochamiz, providers'ga CarsService'ni qaytaramiz. Bu Nest'dagi eng ko'p uchraydigan xato. Uni ko'rsangiz, har doim modul faylini oching.
- ≈ 70 s

## S19 · Buzamiz 2: AppModule imports'da CarsModule yo'q — jim xato
- **Ekranda:** chapda `app.module.ts`, `imports: []`. O'ngda terminal: haqiqiy jurnal (CarsController satri YO'Q, `successfully started` bor; id `started`, bo'sh joy `log-missing` ko'rsatkich bilan «bu yerda CarsController bo'lishi kerak edi»); pastda `/cars` → 404 (id `r404`), `/` → Hello World!.
  ```
  [Nest] LOG [InstanceLoader] AppModule dependencies initialized
  [Nest] LOG [RoutesResolver] AppController {/}:
  [Nest] LOG [RouterExplorer] Mapped {/, GET} route
  [Nest] LOG [NestApplication] Nest application successfully started
  ```
- **Ovoz:**
  Ikkinchi holat xavfliroq, chunki xato chiqmaydi. app.module.ts da imports ro'yxatidan CarsModule'ni olib tashladik. Server ishga tushdi, [[started]] successfully started, hamma narsa yaxshidek. [[r404]] Lekin /cars so'rasak, 404, Cannot GET /cars. Slesh esa ishlaydi. Nima bo'ldi? AppModule CarsModule'ni ulamadi, shuning uchun Nest cars papkasini umuman o'qimadi. Xato yo'q, chunki Nest uchun u modul shunchaki yo'q. Buni qanday topasiz? [[log-missing]] Jurnalga qarang: CarsController satri yo'q, Mapped slesh cars satri yo'q. Jurnalni o'qishni odat qiling degan edim, sabab mana shu. Qoida: marshrut 404 bersa va kodingiz to'g'ri ko'rinsa, avval jurnalda Mapped satrini qidiring, keyin bosh modulning imports ro'yxatini tekshiring.
- ≈ 60 s

## S20 · Buzamiz 3: @Controller dekoratori yo'q
- **Ekranda:** chapda `cars.controller.ts`, 4-satr bo'sh (dekorator o'chirilgan, xira izi). O'ngda haqiqiy xato; id `e1`, `e2`, `e3`.
  ```
  UnknownRequestMappingException [Error]: An invalid controller has been detected.
  "CarsController" does not have the @Controller() decorator
  but it is being listed in the "controllers" array of some module.
  ```
- **Ovoz:**
  Uchinchi holat: cars.controller.ts da @Controller dekoratorini o'chirdik, klass joyida qoldi. Server yiqiladi. [[e1]] An invalid controller has been detected. [[e2]] CarsController does not have the @Controller() decorator, [[e3]] but it is being listed in the controllers array of some module. Nest aniq aytyapti: siz uni ro'yxatga yozgansiz, lekin klassda belgi yo'q. Dekoratorlar ekranida aytganimni eslang: belgi bo'lmasa, Nest klassni tanimaydi. Yechim bitta satr: dekoratorni qaytarish. O'quvchilar buni ko'pincha kodni nusxalab yozganda, birinchi satrni tushirib qoldirganda qiladi.
- ≈ 45 s

## S21 · Buzamiz 4: @Injectable yo'q — ishlayveradi
- **Ekranda:** chapda `cars.service.ts`, 10-satr bo'sh (dekorator o'chirilgan). O'ngda haqiqiy jurnal: hamma Mapped satrlari va `successfully started`; `/cars` → 200 (id `ok`). Karta: «Qoida: @Injectable() har Service'ga yoziladi, bog'liqligi bo'lmasa ham.»
- **Ovoz:**
  To'rtinchi holat kutilmagan. cars.service.ts dan @Injectable() ni o'chirdik. Serverni ishga tushirdik, [[ok]] hammasi ishlayapti, /cars 200 qaytaryapti. Nega? CarsService'ning o'zining konstruktorida hech qanday bog'liqlik yo'q. Nest uni bog'liqliksiz yaratib qo'ya oldi. @Injectable aslida Nest'ga «bu klassning konstruktoriga qarab, unga nima kerakligini aniqlang» deydi. Service'ga keyin repository kerak bo'lganda, keyingi darsda, @Injectable'siz aynan birinchi holatdagi xato chiqadi. Shuning uchun qoida sodda: @Injectable() har Service'ga yoziladi, hozir kerak bo'lmasa ham. Bu holatni ko'rsatganimning sababi: o'quvchi «men o'chirdim, ishlayapti, demak kerak emas» desa, siz nega kerakligini tushuntira olasiz.
- ≈ 55 s

## S22 · Xatoning ikki turi: Error va HttpException
- **Ekranda:** ikki ustun. Chap (id `left`): `throw new Error('topilmadi')` → javob `500 {"statusCode":500,"message":"Internal server error"}`. O'ng (id `right`): `throw new NotFoundException('Car with id 99 not found')` → `404 {"message":"Car with id 99 not found","error":"Not Found","statusCode":404}`. Pastda oila ro'yxati: BadRequestException 400 · UnauthorizedException 401 · ForbiddenException 403 · NotFoundException 404.
- **Ovoz:**
  Oxirgi holat xato haqida. findOne ichida NotFoundException o'rniga oddiy throw new Error yozdik. [[left]] Javob: 500, Internal server error. Bizning «topilmadi» matnimiz yo'qoldi. Nest kutilmagan xatoni foydalanuvchiga ko'rsatmaydi, bu to'g'ri: ichki tafsilot tashqariga chiqmasligi kerak. [[right]] NotFoundException esa Nest'ning HttpException oilasidan. Nest uni taniydi va to'g'ri status bilan, xabari bilan qaytaradi. Oilada boshqalari ham bor: BadRequestException to'rt yuz, UnauthorizedException to'rt yuz bir, ForbiddenException to'rt yuz uch. Qoida: foydalanuvchi bilishi kerak bo'lgan xato HttpException bilan tashlanadi, qolgani besh yuz bo'lib qoladi. O'quvchi «nega besh yuz chiqyapti» desa, birinchi savolingiz: qanday xato tashladingiz?
- ≈ 55 s

## S23 · Tekshiruv 3 — xatoni o'qish
- **Ekranda:** xato matni (o'ylab topilgan loyiha, lekin Nest'ning haqiqiy shakli):
  ```
  Nest can't resolve dependencies of the OrdersController (?, OrdersService).
  Please make sure that the argument PaymentService at index [0] is available
  in the OrdersModule module.
  ```
- **Savol:** Bu o'quvchingizning loyihasi. Qaysi faylni ochasiz va nimani tuzatasiz?
- **Variantlar:** A) orders.controller.ts — konstruktordan OrdersService'ni o'chirish · B) orders.module.ts — providers'ga PaymentService qo'shish ✔ · C) app.module.ts — imports'ga OrdersController qo'shish · D) payment.service.ts — @Controller qo'shish
- **Ovoz (savol):** Uchinchi tekshiruv. Ekrandagi xabarni o'qing. Bu sizning emas, o'quvchingizning loyihasi, u yordam so'radi. Qaysi faylni ochasiz va nimani tuzatasiz?
- **Ovoz (to'g'ri):** orders.module.ts, providers ro'yxatiga PaymentService. Xabarda hamma narsa yozilgan: kim, OrdersController; nima yetishmayapti, PaymentService, index nol; qayerda, OrdersModule. Qavsda so'roq belgisi birinchi o'rinda, OrdersService ikkinchi o'rinda topilgan. Demak faqat PaymentService yetishmayapti.
- **Ovoz (xato):** A) OrdersService topilgan, muammo unda emas. · C) Controller imports'ga yozilmaydi, imports faqat modullar uchun. · D) @Controller Service'ga qo'yilmaydi; bu xabar PaymentService modul ro'yxatida yo'qligini aytyapti.
- ≈ 45 s

## S24 · Amaliyot: o'z kompyuteringizda
- **Ekranda:** 6 qadamli ro'yxat, har birida buyruq + «Nusxalash» + kutilgan natija satri (id `s1…s6`), belgilash katakchasi. O'ngda S14 va S15 kodi (nusxalash uchun). Pastda jadval «Agar boshqacha chiqsa».

  | # | Qadam | Buyruq | Kutilgan natija |
  |---|---|---|---|
  | 1 | Nest CLI | `npm i -g @nestjs/cli` · `nest --version` | `11.x.x` |
  | 2 | Loyiha | `nest new cars-api` (paket menejeri: npm) | «Successfully created project cars-api» |
  | 3 | Ishga tushirish | `cd cars-api` · `npm run start:dev` | jurnalda `Mapped {/, GET} route`; brauzerda `localhost:3000` → Hello World! |
  | 4 | cars moduli | `nest g module cars` · `nest g controller cars --no-spec` · `nest g service cars --no-spec` | 3 CREATE, 3 UPDATE |
  | 5 | Kod | S14 va S15 kodini `cars.service.ts` va `cars.controller.ts` ga joylang | jurnalda 3 ta `Mapped {/cars…}` |
  | 6 | So'rovlar | brauzer yoki Postman: `GET /cars`, `/cars/1`, `/cars/99`, `POST /cars` | 200 · 200 · 404 · 201 (S16 bilan bir xil) |

  | Boshqacha chiqdi | Sabab va yechim |
  |---|---|
  | `nest: command not found` | CLI o'rnatilmagan yoki terminal yangilanmagan: 1-qadamni qaytaring, terminalni qayta oching |
  | `EADDRINUSE: address already in use :::3000` | 3000-portda boshqa server ochiq: uni yoping yoki `PORT=3001 npm run start:dev` |
  | Qizil TypeScript xatosi, fayl va satr raqami bilan | Nusxalashda satr tushib qolgan: ko'rsatilgan satrni S14/S15 bilan solishtiring |
  | `Cannot GET /cars` | S19 qoidasi: jurnalda `Mapped {/cars…}` bormi? Yo'q bo'lsa `app.module.ts` → `imports: [CarsModule]` |

- **Ovoz:**
  Endi navbat sizga. Ekrandagi olti qadamni o'z kompyuteringizda bajaring, har buyruqning yonida nusxalash tugmasi bor. [[s1]] Birinchi: Nest CLI'ni o'rnating. [[s2]] Ikkinchi: nest new cars-api, paket menejeri so'ralsa npm'ni tanlang. [[s3]] Uchinchi: papkaga kiring, npm run start:dev, brauzerda Hello World! ni ko'ring. [[s4]] To'rtinchi: uch buyruq bilan cars modulini yarating. [[s5]] Beshinchi: Service va Controller'ni darsdagi kod bilan to'ldiring, kod o'ng tomonda turibdi. [[s6]] Oltinchi: to'rtta so'rovni yuboring va javoblarni darsdagi bilan solishtiring. Keyin bitta narsani ataylab buzing, masalan providers ro'yxatini bo'shating, xatoni o'qing va qaytaring. Biror narsa boshqacha chiqsa, pastdagi jadvalga qarang, eng ko'p uchraydigan to'rt holat yozilgan. Tugatganingizda jurnaldagi Mapped satrlari va /cars/99 javobi ko'ringan skrinshotni saqlab qo'ying, u sizning bajarganingiz isboti.
- **Harakat:** 6 katakcha belgilangach «Davom». Skrinshotni qayerga topshirish — **ochiq savol**.
- ≈ 65 s

## S25 · O'quvchi darsiga ko'prik: ular nimani ko'radi
- **Ekranda:** chapda `IntroNestArxitechture` daraxti (o'quvchi clone qiladigan loyiha), rang bilan: **yashil** (id `green`) — bugun o'rgandingiz: `src/main.ts`, `api/app.module.ts`, `api/admin/admin.module.ts`, `admin.controller.ts`, `admin.service.ts`; **sariq** (`yellow`) — keyingi dars: `core/entity/*`, `core/repository/*`, `api/admin/dto/*`; **kulrang** (`gray`) — keyinroq: `common/guard/*`, `infrastructure/lib/token`, `infrastructure/response/successRes.ts`, `infrastructure/pagination`. O'ngda lug'at (id `dict`):

  | O'quvchi darsida | Atama |
  |---|---|
  | ofitsiant | Controller |
  | oshpaz | Service |
  | omborchi | Repository |
  | javon chizmasi | Entity |
  | buyurtma anketasi | DTO |
  | nazoratchi | Guard |
  | bir xil lagan | successRes (javob shakli) |

- **Ovoz:**
  Endi o'quvchi darsiga qaraymiz, chunki u bu mavzuni boshqacha ko'radi. O'quvchi noldan yozmaydi: u GitHub'dan tayyor loyihani clone qiladi, IntroNestArxitechture, va uni ishga tushiradi. [[tree]] Loyiha kattaroq: api, core, common, infrastructure papkalari. [[green]] Yashil belgilangan joylarni siz bugun to'liq bilasiz: admin.module.ts, admin.controller.ts, admin.service.ts, main.ts. Ular aynan bizning cars fayllarimiz, faqat admin uchun va kattaroq. [[yellow]] Sariq joylar keyingi darsda: entity, bu bazadagi jadval shakli; dto, kiruvchi ma'lumot shakli; repository, baza bilan gaplashuvchi. [[gray]] Kulrang joylar undan keyin: guard, token, bir xil javob shakli. [[dict]] O'ng tomondagi lug'at juda muhim. O'quvchi darsi restoran tilida gapiradi: Controller ofitsiant, Service oshpaz, Repository omborchi, Guard nazoratchi. O'quvchi shu so'zlarda o'ylaydi. Siz endi ikkala tilni bilasiz: o'quvchi «oshpaz» desa, siz Service ekanini bilasiz va to'g'ri faylni ko'rsatasiz.
- ≈ 70 s

## S26 · O'quvchi so'raydigan savollar
- **Ekranda:** 6 karta, bosilganda javob ochiladi (id `q1…q6`):
  1. «Nega Express emas, Nest?» → Loyiha katta bo'lganda tartib kerak; Nest tartibni majburiy qiladi, ichida esa o'sha Express.
  2. «Dekorator nima o'zi?» → Klass yoki metod ustidagi belgi; Nest'ga shu narsa nima ekanini aytadi, kod bajarmaydi.
  3. «providers nima?» → Shu modul yaratib beradigan narsalar, asosan Service'lar.
  4. «Service'ni nega alohida qildik? Bitta faylda bo'lsa bo'lmaydimi?» → Alohida sinash va qayta ishlatish uchun; Controller yupqa qoladi.
  5. «Nest Express'dan tezmi?» → Yo'q, tezlik bir xil, ichida Express. Nest tezlik emas, tartib beradi.
  6. «@Injectable'ni o'chirdim, ishlayapti. Demak kerak emasmi?» → Bog'liqligi bo'lmagani uchun ishladi; bog'liqlik paydo bo'lganda yiqiladi, shuning uchun doim yoziladi.
- **Ovoz:**
  Darsda sizga beriladigan savollar taxminan shular bo'ladi. [[q1]] Birinchisi: nega Express emas, Nest? Javob: loyiha katta bo'lganda tartib kerak, Nest tartibni majburiy qiladi, ichida esa o'sha Express. [[q2]] Ikkinchisi: dekorator nima? Klass yoki metod ustidagi belgi, Nest'ga shu narsa nima ekanini aytadi. [[q3]] Uchinchisi: providers nima? Shu modul yaratib beradigan narsalar, asosan Service'lar. [[q4]] To'rtinchisi: Service'ni nega alohida qildik? Alohida sinash va qayta ishlatish uchun, Controller esa yupqa qoladi. [[q5]] Beshinchisi: Nest tezmi? Yo'q, tezlik bir xil, chunki ichida Express. Nest tezlik emas, tartib beradi. [[q6]] Oltinchisi: @Injectable'ni o'chirdim, ishlayapti. Bog'liqligi bo'lmagani uchun; bog'liqlik paydo bo'lganda yiqiladi, shuning uchun doim yoziladi. Har kartani bosib, javobni o'qing. O'zingiz javob bera olmaydigan savol kelsa, darsdagi shu ekranga qayting.
- ≈ 60 s

## S27 · O'z-sinov — 8 savol
- **Qoida:** har savol bitta urinish, javobdan keyin izoh ko'rinadi (ovozsiz, matn). Oxirida natija: 6/8 va undan yuqori — «Dars o'zlashtirildi»; past bo'lsa — «Qaysi ekranlarga qaytish» ro'yxati (har savol ekraniga havola). Natija qayd qilinadimi — **ochiq savol**.
- **Ovoz (kirish):** Yakuniy sinov, sakkiz savol. Bu baho emas, o'zingizni tekshirish. Har savolda bitta urinish, javobdan keyin izoh chiqadi. Olti va undan ko'p to'g'ri javob dars o'zlashtirilganini bildiradi. Kam bo'lsa, qaysi ekranga qaytish kerakligini ko'rsatamiz.

| # | Savol | A | B | C | D | ✔ | Izoh | Qaytish |
|---|---|---|---|---|---|---|---|---|
| 1 | Nest ichida so'rovni haqiqatda qaysi kutubxona qabul qiladi? | Nest'ning o'z HTTP serveri | Express (platform-express) | Node `http` moduli bevosita | Har doim Fastify | B | Nest Express ustidagi qatlam; Fastify'ga almashtirish mumkin, lekin standart Express | S3 |
| 2 | `@Controller('cars')` va `@Get(':id')` birga qaysi manzilni ochadi? | `/cars?id=5` | `/id/cars` | `/cars/5` | `/:id/cars` | C | Controller prefiksi + metod yo'li | S15 |
| 3 | POST metodida status yozilmagan. Nest nima qaytaradi? | 200 | 201 | 204 | 202 | B | Nest POST uchun 201 ni o'zi qo'yadi | S16 |
| 4 | «Nest can't resolve dependencies of the X (?)» — so'roq belgisi nimani bildiradi? | Noma'lum modul | Topilmagan argument o'rni | Sintaksis xatosi | Marshrut yo'q | B | Qavs ichida konstruktor argumentlari, `?` — topilmagani | S18 |
| 5 | Server «successfully started», `/cars` 404, jurnalda `Mapped {/cars…}` yo'q. Eng ehtimoliy sabab? | CarsModule AppModule imports'ida yo'q | @Injectable yo'q | Port band | Service'da xato | A | Jim xato: modul ulanmagan, Nest papkani o'qimagan | S19 |
| 6 | Service ichida `throw new Error('x')`. Mijozga nima boradi? | 404 va «x» | 500 Internal server error | 400 | Hech narsa, server yiqiladi | B | Oddiy Error → 500, xabar yashiriladi | S22 |
| 7 | Dependency Injection'da Service nusxasini kim yaratadi? | Controller `new` bilan | main.ts | Nest konteyneri, providers ro'yxatiga qarab | Har so'rovda Express | C | Bir marta yaratiladi, konstruktor orqali beriladi | S11 |
| 8 | Qaysi kod Controller'da turishi to'g'ri? | Chegirma hisoblash | Bazaga yozish | `@Param`'dan id olib Service'ni chaqirish | Parolni hash qilish | C | Controller yupqa: oladi, chaqiradi, qaytaradi | S6 |

- **Ovoz (6/8 va yuqori):** Dars o'zlashtirildi. Endi o'quvchi darsiga kirsangiz, har so'z tanish bo'ladi.
- **Ovoz (6 dan kam):** Hali bir necha joy mustahkam emas. Ro'yxatdagi ekranlarga qayting, keyin sinovni qaytadan topshiring. Bu normal holat, Nest birinchi kunda hammaga ham o'tirmaydi.
- ≈ 25 s ovoz + 8 daqiqa sinov

## S28 · Yakun — endi siz bilasiz
- **Ekranda:** 6 band (id `b1…b6`) + karta «Keyingi dars: Birinchi resursni qo'lda qo'shish — Entity, DTO, Repository» + eslatma «Amaliyot skrinshotingiz».
- **Ovoz:**
  Darsni yakunlaymiz. Endi siz bilasiz. [[b1]] Nest bu Express ustidagi majburiy tartib. [[b2]] Controller so'rovni oladi va yupqa qoladi. [[b3]] Service ishni bajaradi va so'rov haqida bilmaydi. [[b4]] Module ro'yxat, Nest faqat ro'yxatdagini ko'radi. [[b5]] Dependency Injection: siz yaratmaysiz, Nest konstruktor orqali beradi. [[b6]] Va eng muhimi: Nest xatolari o'qiladi, ularda kim, nima, qayerda yozilgan. Keyingi dars: birinchi resursni qo'lda qo'shish, Entity, DTO va Repository. U yerda bugungi cars moduli haqiqiy PostgreSQL bazasiga ulanadi. Amaliyot skrinshotingiz tayyor bo'lsa, dars tugadi. Rahmat.
- ≈ 45 s

---

## B. Ochiq savollar (GATE M'da javob kutiladi)
1. **Audio qayerda turadi?** Mentor platformasi JSX'ni bitta fayl sifatida oladimi? Unda 28 ta mp3 tashqi manzilda bo'lishi kerak: bizning server (`dars-api`), Vercel yoki CRM'ning o'zi.
2. **Platforma protokoli:** o'quvchi LMS'dagi kabi `onFinished` / progress bormi, yoki boshqa? CRM jamoasidan so'rash kerak bo'lishi mumkin.
3. **Amaliyot isboti:** skrinshot qayerga topshiriladi (CRM'da yuklash bormi, yoki Telegram'da bosh mentorga)?
4. **O'z-sinov natijasi** qayd qilinadimi («o'tdi» belgisi), yoki faqat o'zini tekshirish?
5. **Qoralama ovoz:** Sardor TTS maqulmi, yoki haqiqiy odam? TTS bo'lsa ssenariy ustida bemalol ishlaymiz, har tahrirda audio bir buyruq bilan yangilanadi.
6. **Hajm:** 28 ekran, ovoz ≈ 32 daqiqa. Bitta dars sifatida qoladimi, yoki ikkiga bo'linadimi (1–17 «quramiz», 18–28 «buzamiz va o'qiymiz»)?

## C. KOD — JSX bosqichida quriladigan narsalar
- Ovoz-dvigatel: `AudioPlayer` (mp3 + so'z-vaqt JSON, `[[id]]` → highlight), boshqaruv paneli, transkript.
- Ekran turlari: Kod-panel (satr raqamli, highlight), Terminal-panel, Sxema (uch quti, so'rov nuqtasi), So'rov-paneli (S16, bosiladigan), Tekshiruv (S10/S17/S23), Ro'yxat-katakcha (S24), Kartalar (S26), Sinov (S27), Yakun (S28).
- Jarayon chizig'i «N / 28», ekranlar orasida «Orqaga / Davom», oxirgi holat localStorage'da (qaytib kirganda davom etadi).
- Manba-fayllar: ssenariy shu MD; audio `scripts/mentor-tts.mjs` (yoki .py) bilan MD'dan yasaladi; haqiqiy chiqishlar `feedback/F-1029-02-mentor-kurs/manba/nest-out/`.
