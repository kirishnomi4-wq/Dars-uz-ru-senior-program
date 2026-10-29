
// ============================================================
//  4-BOSQICH · S12–S17, LineCheck 1, Amaliyot 2
// ============================================================
const CLI_LINES = [
  { at: 0, id: 'cmd1', h: `<span class="p">$</span> nest g module cars` },
  { at: 1, id: 'out1', h: `<span class="ok">CREATE</span> src/cars/cars.module.ts (81 bytes)` },
  { at: 1, id: 'out1u', h: `<span class="wn">UPDATE</span> src/app.module.ts (308 bytes)` },
  { at: 2, h: `` },
  { at: 2, id: 'cmd2', h: `<span class="p">$</span> nest g controller cars --no-spec` },
  { at: 2, id: 'out2', h: `<span class="ok">CREATE</span> src/cars/cars.controller.ts (97 bytes)` },
  { at: 2, id: 'out2', h: `<span class="wn">UPDATE</span> src/cars/cars.module.ts (166 bytes)` },
  { at: 3, h: `` },
  { at: 3, id: 'cmd3', h: `<span class="p">$</span> nest g service cars --no-spec` },
  { at: 3, id: 'out3', h: `<span class="ok">CREATE</span> src/cars/cars.service.ts (88 bytes)` },
  { at: 3, id: 'out3', h: `<span class="wn">UPDATE</span> src/cars/cars.module.ts (240 bytes)` },
];
const DIFF_LINES = [
  { h: `<span class="d">@Module</span>({` },
  { neu: true, h: `  imports: [<span class="c">CarsModule</span>],` },
  { h: `  controllers: [<span class="c">AppController</span>],` },
  { h: `  providers: [<span class="c">AppService</span>],` },
  { h: `})` },
];
const S12 = {
  kicker: '4-bosqich · CLI', title: 'CLI bilan cars modulini yaratamiz',
  segments: [
    { id: 'a', key: "<code>nest g module cars</code> — g = generate", text: "Endi o'zimiz quramiz. Mashinalar uchun alohida modul kerak. Nest CLI buni uch buyruq bilan yaratadi. Birinchisi: nest g module cars. g bu generate, yaratish.", focus: ['cmd1'] },
    { id: 'b', key: "CLI bosh modulga <b>o'zi yozdi</b>: UPDATE", text: "Natija ikki satr: CREATE, cars module yaratildi, va UPDATE, app module o'zgartirildi. Ikkinchi satrga e'tibor bering: CLI bosh modulga o'zi kirib, imports ro'yxatiga CarsModule'ni qo'shib qo'ydi. Qo'l bilan qilsangiz, aynan shuni unutasiz.", focus: ['out1u'] },
    { id: 'c', key: "<code>nest g controller cars</code> — ro'yxatga yozildi", text: "Ikkinchi buyruq: nest g controller cars. no-spec qo'shimchasi test faylini hozircha yaratma degani, Jest darsida qaytamiz. Controller yaratildi va cars modulining controllers ro'yxatiga yozildi.", show: "<code>nest g controller cars --no-spec</code>. <code>--no-spec</code>: test faylini hozircha yaratma, Jest darsida qaytamiz. Controller yaratildi va cars modulining <code>controllers</code> ro'yxatiga yozildi.", focus: ['cmd2', 'out2'] },
    { id: 'd', key: "<code>nest g service cars</code> — providers'ga yozildi", text: "Uchinchi buyruq: nest g service cars. Service yaratildi va providers ro'yxatiga yozildi.", focus: ['cmd3', 'out3'] },
    { id: 'e', key: "3 buyruq → 3 CREATE + 3 UPDATE. <b>Nima qilganini biling</b>", text: "Uch buyruq, oltita o'zgarish va hamma ro'yxat to'g'ri. CLI'ga ishonish mumkin, lekin u nima qilganini bilish shart, chunki buzilganda qo'l bilan tuzatasiz.", focus: [] },
  ],
};
function Screen12(p) {
  return <Lesson p={p} S={S12} scene={({ seg, beat }) => (<>
    <CodePanel file="terminal" lines={CLI_LINES} beat={beat} focus={seg.focus} numbers={false} style={{ background: '#111827' }} />
    <Block at={1} beat={beat} dim={beat >= 2}><CodePanel file="src/app.module.ts · CLI o'zi o'zgartirdi" lines={DIFF_LINES} numbers={false} /></Block>
    <Block at={4} beat={beat}><div className="mk-rule"><b>3 buyruq → 3 CREATE + 3 UPDATE.</b> Har ro'yxat (imports · controllers · providers) CLI tomonidan to'ldirildi.</div></Block>
  </>)} />;
}

// --- S13 Bo'sh fayllar (+ bashorat) ---
const S13 = {
  kicker: "4-bosqich · bo'sh fayllar", title: "Controller ro'yxatda, lekin marshrut yo'q",
  segments: [
    { id: 'a', key: "<b>cars.module.ts</b>: ikkala ro'yxat to'ldirilgan", text: "Yaratilgan fayllarga qarang. cars module: controllers'da CarsController, providers'da CarsService." },
    { id: 'b', key: "Bashorat: CLI yaratgan fayllar bilan server…", text: "Fayllarni ochishdan oldin bashorat qiling. CLI hozirgina yaratgan Controller va Service bilan serverni ishga tushirsak, nima bo'ladi? Uchta variantdan birini bosing.", ask: { q: "CLI yaratgan fayllar bilan server nima qiladi?", opts: ['Xato bilan yiqiladi', "Ishga tushadi, /cars → 404", "Ishga tushadi, /cars → 200, bo'sh ro'yxat"], answer: 1 } },
    { id: 'c', key: "Controller va Service: <b>bo'sh klasslar</b>", text: "Fayllarga qaraymiz. cars controller: Controller dekoratori, qavsda cars, va bo'sh klass. cars service: Injectable dekoratori va bo'sh klass. Ichida bitta ham metod yo'q.", show: "<b>cars.controller.ts</b>: <code>@Controller('cars')</code> va bo'sh klass. <b>cars.service.ts</b>: <code>@Injectable()</code> va bo'sh klass. Ichida bitta ham metod yo'q." },
    { id: 'd', key: "Controller ko'rindi, lekin <b>Mapped yo'q</b>", text: "Jurnalda yangi satr bor: CarsController, qavs ichida cars manzili. Nest Controller'ni ko'rdi va unga manzil berdi. Lekin Mapped satri yo'q, chunki klass ichida hali bitta ham metod yo'q.", show: "Jurnalda yangi satr: <code>CarsController {/cars}</code>. Nest Controller'ni ko'rdi va unga manzil berdi. Lekin <b>Mapped satri yo'q</b>, chunki klass ichida hali bitta ham metod yo'q." },
    { id: 'e', key: "cars manzili: <b>404</b>, eshik bor, ichida hech kim yo'q", text: "Brauzerda cars manzilini ochsak: to'rt yuz to'rt, Cannot GET cars. Bu xato emas, bu tabiiy holat: eshik bor, ichida hech kim yo'q.", show: "Brauzerda /cars ochsak: <b>404, Cannot GET /cars</b>. Bu xato emas, bu tabiiy holat: eshik bor, ichida hech kim yo'q." },
    { id: 'f', key: "Tartib: avval <b>Service</b>, keyin <b>Controller</b>", text: "Keyingi ikki ekranda avval Service'ni, keyin Controller'ni to'ldiramiz. Tartib aynan shunday: avval ishni bajaradigan bo'lak, keyin uni chaqiradigan bo'lak." },
  ],
};
function Screen13(p) {
  const mini = (file, lines) => <CodePanel file={file} numbers={false} lines={lines} style={{ padding: '14px 14px', fontSize: 12.5 }} />;
  return <Lesson p={p} S={S13} scene={({ beat }) => (<>
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 10 }}>
      <Block at={0} beat={beat} dim={beat === 2}>{mini('cars.module.ts', [{ h: `<span class="d">@Module</span>({` }, { h: `  controllers: [<span class="c">CarsController</span>],` }, { h: `  providers: [<span class="c">CarsService</span>]` }, { h: `})` }, { h: `<span class="k">export class</span> <span class="c">CarsModule</span> {}` }])}</Block>
      <Block at={2} beat={beat}>{mini('cars.controller.ts', [{ h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` }, { h: `<span class="k">export class</span> <span class="c">CarsController</span> {}` }])}</Block>
      <Block at={2} beat={beat}>{mini('cars.service.ts', [{ h: `<span class="d">@Injectable</span>()` }, { h: `<span class="k">export class</span> <span class="c">CarsService</span> {}` }])}</Block>
    </div>
    <Block at={3} beat={beat}><CodePanel file="terminal" numbers={false} wrap style={{ background: '#111827' }} beat={beat} lines={[
      { at: 3, h: `[Nest] LOG [InstanceLoader] CarsModule dependencies initialized` },
      { at: 3, id: 'x', h: `[Nest] LOG [RoutesResolver] <span class="ok">CarsController {/cars}:</span>` },
      { at: 3, h: `[Nest] LOG [NestApplication] Nest application successfully started` },
      { at: 4, h: `` },
      { at: 4, h: `<span class="p">GET /cars</span> → <span class="er">404</span>  {"message":"Cannot GET /cars","error":"Not Found","statusCode":404}` }]} focus={beat === 3 ? ['x'] : []} /></Block>
    <Block at={5} beat={beat}><div className="mk-rule">Tartib: avval <b>Service</b> (ishni bajaradigan), keyin <b>Controller</b> (uni chaqiradigan).</div></Block>
  </>)} />;
}

// --- S14 Service kodi ---
const CARS_SVC_LINES = [
  { at: 0, h: `<span class="k">import</span> { Injectable, NotFoundException } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { at: 0, h: `` },
  { at: 0, id: 'l-interface', h: `<span class="k">export interface</span> <span class="c">Car</span> {` },
  { at: 0, id: 'l-interface', h: `  id: <span class="k">number</span>;  brand: <span class="k">string</span>;  model: <span class="k">string</span>;  price: <span class="k">number</span>;` },
  { at: 0, id: 'l-interface', h: `}` },
  { at: 1, h: `` },
  { at: 1, h: `<span class="d">@Injectable</span>()` },
  { at: 1, h: `<span class="k">export class</span> <span class="c">CarsService</span> {` },
  { at: 1, id: 'l-array', h: `  <span class="k">private</span> cars: <span class="c">Car</span>[] = [` },
  { at: 1, id: 'l-array', h: `    { id: <span class="d">1</span>, brand: <span class="s">'Chevrolet'</span>, model: <span class="s">'Malibu'</span>, price: <span class="d">250</span> },` },
  { at: 1, id: 'l-array', h: `    { id: <span class="d">2</span>, brand: <span class="s">'Kia'</span>, model: <span class="s">'K5'</span>, price: <span class="d">320</span> },` },
  { at: 1, id: 'l-array', h: `  ];` },
  { at: 2, h: `` },
  { at: 2, id: 'l-findAll', h: `  <span class="c">findAll</span>(): <span class="c">Car</span>[] { <span class="k">return this</span>.cars; }` },
  { at: 2, h: `` },
  { at: 2, id: 'l-findOne', h: `  <span class="c">findOne</span>(id: <span class="k">number</span>): <span class="c">Car</span> {` },
  { at: 2, id: 'l-findOne', h: `    <span class="k">const</span> car = <span class="k">this</span>.cars.<span class="c">find</span>((c) => c.id === id);` },
  { at: 3, id: 'l-notfound', h: `    <span class="k">if</span> (!car) <span class="k">throw new</span> <span class="c">NotFoundException</span>(<span class="s">\`Car with id \${id} not found\`</span>);` },
  { at: 2, id: 'l-findOne', h: `    <span class="k">return</span> car;` },
  { at: 2, id: 'l-findOne', h: `  }` },
  { at: 4, h: `` },
  { at: 4, id: 'l-create', h: `  <span class="c">create</span>(data: <span class="c">Omit</span>&lt;<span class="c">Car</span>, <span class="s">'id'</span>&gt;): <span class="c">Car</span> {` },
  { at: 4, id: 'l-create', h: `    <span class="k">const</span> car: <span class="c">Car</span> = { id: <span class="k">this</span>.cars.length + <span class="d">1</span>, ...data };` },
  { at: 4, id: 'l-create', h: `    <span class="k">this</span>.cars.<span class="c">push</span>(car);` },
  { at: 4, id: 'l-create', h: `    <span class="k">return</span> car;` },
  { at: 4, id: 'l-create', h: `  }` },
  { at: 1, h: `}` },
];
const S14 = {
  kicker: '4-bosqich · Service', title: "Service: ro'yxat va uch metod",
  segments: [
    { id: 'a', key: "<b>Car interfeysi</b>: id, brand, model, price — shakl", text: "cars service ni to'ldiramiz. Avval Car interfeysi: mashinada id, brand, model va price bo'ladi. Interface TypeScript'ning shakl tavsifi, bazadagi jadval emas, hozircha shunchaki shakl.", focus: ['l-interface'] },
    { id: 'b', key: "Ro'yxat xotirada: Malibu, K5. <b>Baza hali yo'q</b>", text: "Keyin ro'yxat: ikkita mashina, Chevrolet Malibu va Kia K5, narxi million so'mda. Baza hali yo'q, ma'lumot xotirada turibdi, bu dars uchun yetarli.", focus: ['l-array'] },
    { id: 'c', key: "<code>findAll</code> — hammasi · <code>findOne</code> — id bo'yicha", text: "findAll ro'yxatni qaytaradi. findOne id bo'yicha qidiradi.", focus: ['l-findAll', 'l-findOne'] },
    { id: 'd', key: "Topilmasa: <b>NotFoundException</b> → Nest o'zi 404 qiladi", text: "Topilmasa, NotFoundException tashlaydi. Bu Nest'ning tayyor xatosi: siz uni tashlaysiz, Nest uni o'zi to'rt yuz to'rt javobga aylantiradi, statusi va xabari bilan. Express'da buni qo'lda, status to'rt yuz to'rt va json deb yozardingiz.", show: "Topilmasa, <b>NotFoundException</b> tashlaydi. Bu Nest'ning tayyor xatosi: siz uni tashlaysiz, Nest uni o'zi 404 javobga aylantiradi, statusi va xabari bilan. Express'da buni <code>res.status(404).json</code> deb qo'lda yozardingiz.", focus: ['l-notfound'] },
    { id: 'e', key: "<code>create</code> qo'shadi. <code>Omit&lt;Car,'id'&gt;</code> = Car'ning id'siz shakli", text: "create yangi mashinani ro'yxatga qo'shadi va qaytaradi. Qavsdagi Omit Car vergul id, TypeScript yozuvi: Car'ning id'siz shakli, chunki id'ni biz o'zimiz beramiz. Yana bir marta qarang: bu faylda so'rov haqida bitta so'z ham yo'q. Faqat mashinalar va ular bilan ishlaydigan uch metod.", show: "<code>create</code> yangi mashinani qo'shadi va qaytaradi. <code>Omit&lt;Car, 'id'&gt;</code> — TypeScript yozuvi: Car'ning id'siz shakli, chunki id'ni biz beramiz. Bu faylda so'rov haqida bitta so'z ham yo'q.", focus: ['l-create'] },
  ],
};
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg, beat }) => <CodePanel file="src/cars/cars.service.ts" lines={CARS_SVC_LINES} beat={beat} focus={seg.focus} />} />;
}

// --- S15 Controller kodi ---
const CARS_CTRL_LINES = [
  { h: `<span class="k">import</span> { Body, Controller, Get, Param, Post } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { h: `<span class="k">import</span> { CarsService } <span class="k">from</span> <span class="s">'./cars.service'</span>;` },
  { h: `` },
  { id: 'l-ctrl', h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` },
  { h: `<span class="k">export class</span> <span class="c">CarsController</span> {` },
  { id: 'l-ctor', h: `  <span class="k">constructor</span>(<span class="k">private readonly</span> carsService: <span class="c">CarsService</span>) {}` },
  { h: `` },
  { id: 'l-get', h: `  <span class="d">@Get</span>()` },
  { id: 'l-get', h: `  <span class="c">findAll</span>() { <span class="k">return this</span>.carsService.<span class="c">findAll</span>(); }` },
  { h: `` },
  { id: 'l-getid', h: `  <span class="d">@Get</span>(<span class="s">':id'</span>)` },
  { id: 'l-param', h: `  <span class="c">findOne</span>(<span class="d">@Param</span>(<span class="s">'id'</span>) id: <span class="k">string</span>) {` },
  { id: 'l-param', h: `    <span class="k">return this</span>.carsService.<span class="c">findOne</span>(<span class="c">Number</span>(id));` },
  { id: 'l-getid', h: `  }` },
  { h: `` },
  { id: 'l-post', h: `  <span class="d">@Post</span>()` },
  { id: 'l-body', h: `  <span class="c">create</span>(<span class="d">@Body</span>() body: { brand: <span class="k">string</span>; model: <span class="k">string</span>; price: <span class="k">number</span> }) {` },
  { id: 'l-body', h: `    <span class="k">return this</span>.carsService.<span class="c">create</span>(body);` },
  { id: 'l-post', h: `  }` },
  { h: `}` },
];
const EXN_ROWS = [
  { at: 1, e: "app.get('/cars', …)", n: '@Get()' },
  { at: 2, e: 'req.params.id', n: "@Param('id') id" },
  { at: 3, e: 'req.body', n: '@Body() body' },
  { at: 3, e: 'app.use(express.json())', n: 'kerak emas — yoqilgan' },
];
const S15 = {
  kicker: '4-bosqich · Controller', title: 'Controller: uch marshrut',
  segments: [
    { id: 'a', key: "Manzil <b>cars</b>; konstruktor: «menga CarsService kerak»", text: "cars controller. Controller dekoratori, qavsda cars: hamma metod cars manzili bilan boshlanadi. Konstruktor: menga CarsService kerak.", show: "cars.controller.ts. <code>@Controller('cars')</code>: hamma metod /cars bilan boshlanadi. Konstruktor: «menga CarsService kerak».", focus: ['l-ctrl', 'l-ctor'] },
    { id: 'b', key: "Bo'sh <code>@Get()</code> = <b>GET /cars</b> → findAll", text: "Get dekoratori bo'sh: GET cars. Metod Service'ning findAll'ini chaqiradi.", show: "<code>@Get()</code> bo'sh: <b>GET /cars</b>. Metod findAll'ni chaqiradi.", focus: ['l-get'] },
    { id: 'c', key: "<code>@Get(':id')</code> = <b>GET /cars/:id</b> · <b>@Param</b> = req.params, qiymat — matn", text: "Get dekoratori ikki nuqta id bilan: cars manzilidan keyin raqam, masalan cars besh. Param dekoratori Express'dagi req params id ning o'zi, faqat dekorator orqali olinadi. Manzildan kelgan qiymat har doim matn, shuning uchun Number bilan raqamga o'tkazamiz.", show: "<code>@Get(':id')</code>: <b>GET /cars/5</b> kabi manzil. <code>@Param('id') id</code>: Express'dagi <code>req.params.id</code> ning o'zi, faqat dekorator orqali olinadi. Manzildan kelgan qiymat har doim matn, shuning uchun <code>Number</code> bilan raqamga o'tkazamiz.", focus: ['l-getid', 'l-param'] },
    { id: 'd', key: "<code>@Post()</code> = <b>POST /cars</b> · <b>@Body</b> = req.body, express.json kerak emas", text: "Post dekoratori: POST cars. Body dekoratori Express'dagi req body. Nest'da express json ni qo'lda ulash shart emas, u ichida yoqilgan.", show: "<code>@Post()</code>: <b>POST /cars</b>. <code>@Body() body</code>: Express'dagi <code>req.body</code>. Nest'da <code>express.json()</code> ni qo'lda ulash shart emas, u ichida yoqilgan.", focus: ['l-post', 'l-body'] },
    { id: 'e', key: "Uch metod bir shaklda: <b>ol → chaqir → qaytar</b>", text: "Qarang, uchala metod ham bir xil shaklda: so'rovdan kerakli qismni olish, Service metodini chaqirish, natijani qaytarish. Controller'da if yo'q, hisob yo'q, baza yo'q.", focus: [] },
  ],
};
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <CodePanel file="src/cars/cars.controller.ts" lines={CARS_CTRL_LINES} focus={seg.focus} />}
    below={({ beat }) => beat >= 1 && <table className="mk-tbl"><thead><tr><th>Express</th><th>Nest</th></tr></thead><tbody>
      {EXN_ROWS.filter((r) => r.at <= beat).map((r, i) => <tr key={i} className={r.at === beat ? 'hl' : ''}><td><code>{r.e}</code></td><td><code>{r.n}</code></td></tr>)}
    </tbody></table>} />;
}

// --- Tekshiruv 2: qaysi satr xato (Controller) ---
const LC1_LINES = [
  { h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` },
  { h: `<span class="k">export class</span> <span class="c">CarsController</span> {` },
  { h: `  <span class="k">constructor</span>(<span class="k">private readonly</span> carsService: <span class="c">CarsService</span>) {}` },
  { h: `` },
  { h: `  <span class="d">@Get</span>()` },
  { h: `  <span class="c">findAll</span>() { <span class="k">return this</span>.carsService.<span class="c">findAll</span>(); }` },
  { h: `` },
  { h: `  <span class="d">@Get</span>(<span class="s">':id'</span>)` },
  { h: `  <span class="c">findOne</span>(<span class="d">@Param</span>(<span class="s">'id'</span>) id: <span class="k">string</span>) {` },
  { h: `    <span class="k">const</span> car = <span class="k">this</span>.carsService.<span class="c">findOne</span>(<span class="c">Number</span>(id));` },
  { h: `    <span class="k">if</span> (car.price > <span class="d">300</span>) car.price = car.price * <span class="d">0.9</span>;` },
  { h: `    <span class="k">return</span> car;` },
  { h: `  }` },
  { h: `}` },
];
function ScreenLC1(p) {
  return <LineCheck {...p} kicker="Tekshiruv 2" eyebrow="Tekshiruv · 2 / 5 — qaysi satr xato?" title="Bu Controller ishlaydi, lekin bitta satr noto'g'ri joyda"
    q="Ikkinchi tekshiruv. Ekrandagi Controller ishlaydi, xato chiqarmaydi. Lekin bitta satr bu faylda turmasligi kerak. Qaysi satr? Bosing."
    file="src/cars/cars.controller.ts" lines={LC1_LINES} target={10}
    ok="Chegirma hisobi Controller'da turibdi. Ishlaydi, lekin bu mantiq, u Service'ga tegishli: alohida sinab bo'lmaydi va Telegram bot shu chegirmani ololmaydi. Controller oladi, chaqiradi, qaytaradi."
    okShort="11-satr: chegirma hisobi — mantiq, u Service'ga tegishli. Controller oladi, chaqiradi, qaytaradi."
    hint="Bu satr Controller'ning ishi: so'rovni olish, Service'ni chaqirish yoki qaytarish. Hisob qayerda?" />;
}

// --- S16 Jurnal va javoblar ---
const REQS = [
  { k: 'r1', m: 'GET', u: '/cars', st: 200, body: `[{"id":1,"brand":"Chevrolet","model":"Malibu","price":250},\n {"id":2,"brand":"Kia","model":"K5","price":320}]` },
  { k: 'r2', m: 'GET', u: '/cars/1', st: 200, body: `{"id":1,"brand":"Chevrolet","model":"Malibu","price":250}` },
  { k: 'r3', m: 'GET', u: '/cars/99', st: 404, body: `{"message":"Car with id 99 not found","error":"Not Found","statusCode":404}` },
  { k: 'r4', m: 'POST', u: '/cars  {brand:"Chevrolet", model:"Cobalt", price:145}', st: 201, body: `{"id":3,"brand":"Chevrolet","model":"Cobalt","price":145}` },
  { k: 'r5', m: 'POST', u: '/cars  {}  (bo\'sh)', st: 201, body: `{"id":4}` },
];
const S16 = {
  kicker: '4-bosqich · ishga tushdi', title: 'Jurnal va javoblar',
  segments: [
    { id: 'a', key: "Uchta <b>Mapped</b>: uchala marshrut ulangan", text: "Server ishga tushdi. Jurnalda uchta yangi Mapped satri: cars GET, cars id GET, cars POST. Uchala marshrut ulangan. Endi so'rov yuboramiz.", open: null },
    { id: 'b', key: "<code>GET /cars</code> → <b>200</b>, JSON o'zi yasaladi", text: "GET cars: ikki yuz va ikki mashinalik ro'yxat, JSON ko'rinishida. Biz JSON stringify yozmadik, Nest obyektni o'zi JSON qiladi.", show: "<code>GET /cars</code>: <b>200</b> va ikki mashinalik ro'yxat, JSON ko'rinishida. Biz <code>JSON.stringify</code> yozmadik, Nest obyektni o'zi JSON qiladi.", open: 'r1' },
    { id: 'c', key: "<code>GET /cars/1</code> → <b>200</b>, Malibu", text: "GET cars bir: ikki yuz va Malibu.", show: "<code>GET /cars/1</code>: <b>200</b> va Malibu.", open: 'r2' },
    { id: 'd', key: "<code>GET /cars/99</code> → <b>404</b> + xabar", text: "GET cars to'qson to'qqiz: to'rt yuz to'rt va xabar, Car with id 99 not found. Bu bizning NotFoundException, Nest uni shu ko'rinishga keltirdi: message, error, statusCode.", show: "<code>GET /cars/99</code>: <b>404</b> va xabar, Car with id 99 not found. Bu bizning NotFoundException, Nest uni shu ko'rinishga keltirdi: <code>message</code>, <code>error</code>, <code>statusCode</code>.", open: 'r3' },
    { id: 'e', key: "<code>POST /cars</code> → <b>201 Created</b> o'zi qo'yiladi", text: "POST cars bilan Cobalt yuboramiz: ikki yuz bir Created va yangi mashina, id uch. E'tibor bering, biz ikki yuz birni yozmadik. Nest POST uchun uni o'zi qo'yadi, Express'da ikki yuz bo'lardi.", show: "<code>POST /cars</code> bilan Cobalt yuboramiz: <b>201 Created</b> va yangi mashina, id 3. Biz 201 yozmadik, Nest POST uchun o'zi qo'yadi; Express'da 200 bo'lardi.", open: 'r4' },
    { id: 'f', key: "<code>POST /cars {}</code> → <b>201, {id:4}</b>. Tekshiruv yo'q", text: "Yana bir sinov: bo'sh POST yuboramiz, ichida hech narsa yo'q. Nest baribir ikki yuz bir qaytaradi va faqat id to'rt bo'lgan mashina yaratadi. Nest kiruvchi ma'lumotni o'zi tekshirmaydi, siz aytmaguncha. Tekshiruv keyingi darsda, DTO bilan.", show: "Bo'sh <code>POST /cars {}</code>: Nest baribir <b>201</b> qaytaradi va faqat <code>{id:4}</code> yaratadi. Nest kiruvchi ma'lumotni o'zi tekshirmaydi, siz aytmaguncha — tekshiruv keyingi darsda, DTO bilan.", open: 'r5' },
    { id: 'g', key: "Besh tugmani <b>o'zingiz bosing</b> — keyin Davom", text: "Endi beshala tugmani o'zingiz bosib, har javobni o'qing. Davom besh tugmadan keyin ochiladi.", open: null },
  ],
};
function Screen16(p) {
  const [open, setOpen] = useState(null);
  const [clicked, setClicked] = useState([]);
  return <Lesson p={p} S={S16} ready={() => clicked.length >= REQS.length} scene={({ seg, beat }) => {
    const cur = REQS.find((r) => r.k === (open || seg.open));
    return (<>
      <CodePanel file="terminal" numbers={false} wrap style={{ background: '#111827' }} lines={[
        { h: `[Nest] LOG [RoutesResolver] CarsController {/cars}:` },
        { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars, GET} route</span>` },
        { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars/:id, GET} route</span>` },
        { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars, POST} route</span>` },
        { h: `[Nest] LOG [NestApplication] Nest application successfully started` }]} />
      <Block at={1} beat={beat}><div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">So'rov yuborish — bosing</div>
        <div className="mk-req">
          {REQS.map((r) => <button key={r.k} className={(open || seg.open) === r.k ? 'hl' : ''} onClick={() => { setOpen(r.k); setClicked((c) => c.includes(r.k) ? c : [...c, r.k]); }}><span className={`st s${String(r.st)[0]}`}>{r.st}</span><span>{r.m} {r.u}</span></button>)}
        </div>
        {cur && <pre key={cur.k} style={{ animation: 'mk-up .3s ease both' }}>{cur.body}</pre>}
      </div></Block>
    </>);
  }} />;
}

// --- S17 Tekshiruv 3 — bashorat ---
function Screen17(p) {
  return <MCRetry {...p} kicker="Tekshiruv 3" eyebrow="Tekshiruv · 3 / 5 — bashorat"
    title="Kodimiz hozirgi holatda. GET /cars/abc so'rovi kelsa, javob qanday bo'ladi?"
    q="Uchinchi tekshiruv, bashorat qiling. Kimdir cars manzilidan keyin abc deb yubordi. Kodimiz hozirgi holatda. Javob qanday bo'ladi?"
    opts={["200 va bo'sh obyekt", '500 Internal server error', '404 va «Car with id NaN not found»', '400 Bad Request']} correct={2}
    ok="To'rt yuz to'rt va Car with id NaN not found. Number abc natijasi NaN. Ro'yxatda id NaN bo'lgan mashina yo'q, shuning uchun findOne NotFoundException tashlaydi. Ishlaydi, lekin xabar chiroyli emas: foydalanuvchi NaN so'zini ko'rmasligi kerak. Nest kiruvchi ma'lumotni o'zi tekshirmaydi, siz aytmaguncha; buni keyingi darsda DTO bilan qilasiz."
    okShort="404, «Car with id NaN not found»: Number('abc') = NaN → findOne topmaydi → NotFoundException. Tekshiruv yo'q — DTO keyingi darsda."
    wrong={{ 0: "find hech narsa topmasa undefined qaytaradi, bizning kod esa bu holatda xato tashlaydi.", 1: "Besh yuz faqat biz kutmagan xato bo'lganda chiqadi; bu yerda xatoni o'zimiz NotFoundException bilan tashladik.", 3: "To'rt yuzni hech kim qaytarmaydi, chunki tekshiruv yozilmagan." }} />;
}

// --- Amaliyot 2: cars modulini quring ---
const P2 = {
  kicker: 'Amaliyot 3 / 4', eyebrow: "Hozir o'zingizda · 10–15 daqiqa", title: 'cars modulini quring', tableAt: 5,
  segments: [
    { id: 'a', key: "Endi <b>siz</b>: cars moduli, to'rt qadam", text: "Yana navbat sizga. Hozirgina ko'rgan cars modulini o'z loyihangizda qurasiz: to'rt qadam, o'n-o'n besh daqiqa.", hl: [] },
    { id: 'b', key: "1 · uch CLI buyrug'i", text: "Birinchi: uch buyruq bilan modul, controller va service yarating. Terminalda uchta CREATE va uchta UPDATE chiqishi kerak.", hl: [0] },
    { id: 'c', key: "2 · Service — <b>nusxalang</b> («Kod»)", text: "Ikkinchi: Service'ni darsdagi kod bilan to'ldiring. U pastdagi Kod tugmasida turibdi, nusxalab qo'ying.", hl: [1] },
    { id: 'd', key: "3 · Controller — <b>o'zingiz yozing</b>, 20 qator", text: "Uchinchi: Controller'ni o'zingiz yozing, yigirma qator. Namuna Kod tugmasida ko'rinadi, lekin nusxalanmaydi, ataylab. Dekorator va konstruktorni qo'lingiz his qilsin. Jurnalda uchta Mapped satri chiqsin.", hl: [2] },
    { id: 'e', key: "4 · to'rt so'rov: 200 · 200 · 404 · 201", text: "To'rtinchi: brauzer yoki Postman bilan to'rtta so'rovni yuboring va javoblarni darsdagi bilan solishtiring: ikki yuz, ikki yuz, to'rt yuz to'rt, ikki yuz bir. cars to'qson to'qqiz javobidagi xabarni isbot maydoniga yozing.", hl: [3] },
    { id: 'f', key: "Boshqacha chiqdimi — jadval", text: "Boshqacha chiqsa, jadvalga qarang. To'rtala katakcha va isbot to'ldirilgach, davom eting.", hl: [] },
  ],
};
const P2_STEPS = [
  { t: 'cars moduli', cmds: ['nest g module cars', 'nest g controller cars --no-spec', 'nest g service cars --no-spec'], exp: '3 CREATE, 3 UPDATE' },
  { t: 'Service — nusxalang', cmds: [], exp: 'cars.service.ts — «Kod» tugmasidan nusxalang' },
  { t: "Controller — o'zingiz yozing", cmds: [], exp: "cars.controller.ts — 20 qator, namuna «Kod»da (nusxalanmaydi) · jurnalda 3 ta Mapped {/cars…}" },
  { t: "So'rovlar", cmds: [], exp: 'GET /cars · /cars/1 · /cars/99 · POST /cars → 200 · 200 · 404 · 201' },
];
const P2_PROOF = { label: 'Isbot: GET /cars/99 javobidagi message maydoni', placeholder: 'Car with id 99 not found', check: (v) => /not found/i.test(v) && /99/.test(v), wrong: 'Kutilgan: Car with id 99 not found — javobdagi message qiymatini aynan yozing' };
const P2_TROUBLE = [
  ['Qizil TypeScript xatosi (fayl:satr)', "Nusxalashda satr tushib qolgan: ko'rsatilgan satrni «Kod» bilan solishtiring"],
  ['Cannot GET /cars', "Jurnalda Mapped {/cars…} bormi? Yo'q bo'lsa app.module.ts → imports: [CarsModule]"],
  ['POST da body undefined', "Postman'da Body → raw → JSON tanlanganmi? Content-Type: application/json"],
];
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} code={[{ file: 'src/cars/cars.service.ts', lines: CARS_SVC_LINES }, { file: 'src/cars/cars.controller.ts', lines: CARS_CTRL_LINES, copy: false }]} />; }
