
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
    { id: 'a', key: "Birinchi buyruq: <code>nest g module cars</code> — g = generate, ya'ni yaratish", text: "Asoslar tayyor: uch bo'lakni va Dependency Injection'ni bilasiz. Endi o'zimiz quramiz. Mashinalar uchun alohida modul kerak. Nest CLI buni uch buyruq bilan yaratadi. Birinchisi: nest g module cars. g bu generate, yaratish.", focus: ['cmd1'] },
    { id: 'b', key: "CLI bosh modulga <b>o'zi kirib</b>, <code>imports</code>'ga CarsModule'ni qo'shdi — UPDATE", text: "Natija ikki satr: CREATE, cars module yaratildi, va UPDATE, app module o'zgartirildi. Ikkinchi satrga e'tibor bering: CLI bosh modulga o'zi kirib, imports ro'yxatiga CarsModule'ni qo'shib qo'ydi. Qo'l bilan qilsangiz, aynan shuni unutasiz.", focus: ['out1u'] },
    { id: 'c', key: "<code>nest g controller cars</code> — Controller yaratildi va <b>controllers'ga yozildi</b>", text: "Ikkinchi buyruq: nest g controller cars. no-spec qo'shimchasi test faylini yaratma degani: bu darsda testlar bilan ishlamaymiz, fayllar kamroq bo'lsin. Controller yaratildi va cars modulining controllers ro'yxatiga yozildi.", show: "<code>nest g controller cars --no-spec</code>. <code>--no-spec</code>: test faylini yaratma — bu darsda testlar bilan ishlamaymiz. Controller yaratildi va cars modulining <code>controllers</code> ro'yxatiga yozildi.", focus: ['cmd2', 'out2'] },
    { id: 'd', key: "<code>nest g service cars</code> — Service yaratildi va <b>providers'ga yozildi</b>", text: "Uchinchi buyruq: nest g service cars. Service yaratildi va providers ro'yxatiga yozildi.", focus: ['cmd3', 'out3'] },
    { id: 'e', key: "Xulosa: 3 buyruq — 3 CREATE, 3 UPDATE. <b>CLI nima qilganini biling</b>, buzilsa qo'lda tuzatasiz", text: "Xulosa: uch buyruq, oltita o'zgarish va hamma ro'yxat to'g'ri. Chapdagi Explorer'da cars papkasi va uch yangi fayl paydo bo'ldi. CLI'ga ishonish mumkin, lekin u nima qilganini bilish shart, chunki buzilganda qo'l bilan tuzatasiz.", focus: [] },
  ],
};
function Screen12(p) {
  // Explorer buyruq bilan birga o'sadi: har CREATE — yangi fayl paydo bo'ladi, UPDATE qilingan fayl yoritiladi
  return <Lesson p={p} S={S12} scene={({ seg, beat }) => {
    const files = [...APP_FILES, ...(beat >= 1 ? [CARS_FILES[0]] : []), ...(beat >= 2 ? [CARS_FILES[1]] : []), ...(beat >= 3 ? [CARS_FILES[2]] : [])];
    const fresh = beat === 1 ? [CARS_FILES[0]] : beat === 2 ? [CARS_FILES[1]] : beat === 3 ? [CARS_FILES[2]] : [];
    const active = beat === 1 ? 'src/app.module.ts' : beat === 2 ? CARS_FILES[1] : beat === 3 ? CARS_FILES[2] : null;
    return (
      <Ide files={files} active={active} fresh={fresh}>
        <CodePanel file="terminal" lines={CLI_LINES} beat={beat} focus={seg.focus} numbers={false} style={{ background: '#111827' }} />
        <Block at={1} beat={beat} dim={beat >= 2}><CodePanel file={t("src/app.module.ts · CLI o'zi o'zgartirdi", 'src/app.module.ts · CLI изменил сам')} lines={DIFF_LINES} numbers={false} /></Block>
        <Block at={4} beat={beat}><div className="mk-rule">{t(<><b>3 buyruq → 3 CREATE + 3 UPDATE.</b> Har ro'yxat (imports · controllers · providers) CLI tomonidan to'ldirildi.</>, <><b>3 команды → 3 CREATE + 3 UPDATE.</b> Каждый список (imports · controllers · providers) заполнил CLI.</>)}</div></Block>
      </Ide>
    );
  }} />;
}

// --- S13 Bo'sh fayllar (+ o'ylab ko'ring) — F-1030-09: avval uch fayl birdan chiqardi; endi bittadan, Explorer bilan ---
// Fayl → savol → fayl → fayl → terminal → brauzer → xulosa (manzil Controller'dan, route metoddan)
const S13_FILES = {
  'src/cars/cars.module.ts': [{ h: `<span class="d">@Module</span>({` }, { id: 'lst', h: `  controllers: [<span class="c">CarsController</span>],` }, { id: 'lst', h: `  providers: [<span class="c">CarsService</span>]` }, { h: `})` }, { h: `<span class="k">export class</span> <span class="c">CarsModule</span> {}` }],
  'src/cars/cars.controller.ts': [{ h: `<span class="k">import</span> { Controller } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` }, { h: `` }, { id: 'dec', h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` }, { id: 'body', h: `<span class="k">export class</span> <span class="c">CarsController</span> {}   <span class="cm">// ichi bo'sh — metod yo'q</span>` }],
  'src/cars/cars.service.ts': [{ h: `<span class="k">import</span> { Injectable } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` }, { h: `` }, { h: `<span class="d">@Injectable</span>()` }, { id: 'body', h: `<span class="k">export class</span> <span class="c">CarsService</span> {}   <span class="cm">// ichi bo'sh</span>` }],
};
const S13 = {
  kicker: "4-bosqich · bo'sh fayllar", title: "CLI yaratgan fayllar bo'sh: path bor, route yo'q",
  segments: [
    { id: 'a', key: "<b>cars.module.ts</b>: ikkala ro'yxatni CLI <b>o'zi to'ldirdi</b>", text: "CLI uch faylni yaratdi va ro'yxatlarga yozdi. Ichida nima bor? Birma-bir ochamiz. Birinchisi cars module ts: controllers ro'yxatida CarsController, providers ro'yxatida CarsService. Ikkalasini CLI o'zi yozdi.", file: 'src/cars/cars.module.ts', focus: ['lst'] },
    { id: 'b', key: "O'ylab ko'ring: shu fayllar bilan server ishga tushsa, <code>/cars</code> nima qaytaradi?", text: "Boshqa fayllarni ochishdan oldin o'ylab ko'ring. CLI hozirgina yaratgan Controller va Service bilan serverni ishga tushirsak, cars route'i nima qaytaradi? Uchta variantdan birini bosing.", ask: { q: "CLI yaratgan fayllar bilan server nima qiladi?", opts: ['Xato bilan yiqiladi', "Ishga tushadi, /cars → 404", "Ishga tushadi, /cars → 200, bo'sh ro'yxat"], answer: 1 }, file: 'src/cars/cars.module.ts', focus: [] },
    { id: 'c', key: "<b>cars.controller.ts</b>: decorator bor, lekin klass ichi <b>bo'sh — birorta metod yo'q</b>", text: "Endi cars controller ts. Controller decorator'i bor, qavsda cars. Lekin klassning ichi bo'sh: Get ham, Post ham, birorta metod yo'q.", show: "<b>cars.controller.ts</b>: <code>@Controller('cars')</code> bor, lekin klass ichi bo'sh — <code>@Get</code> ham, <code>@Post</code> ham, birorta metod yo'q.", file: 'src/cars/cars.controller.ts', focus: ['dec', 'body'] },
    { id: 'd', key: "<b>cars.service.ts</b>: <code>@Injectable()</code> bor, ichi ham <b>bo'sh</b>", text: "cars service ts ham xuddi shunday: Injectable decorator'i bor, ichi bo'sh.", show: "<b>cars.service.ts</b>: <code>@Injectable()</code> bor, ichi ham bo'sh.", file: 'src/cars/cars.service.ts', focus: ['body'] },
    { id: 'e', key: "Terminalda <code>CarsController {/cars}</code> bor, lekin <b>Mapped satri yo'q</b>", text: "Serverni ishga tushiramiz. Terminalda yangi satr bor: CarsController, qavs ichida cars path'i. Nest Controller'ni ko'rdi va unga path berdi. Lekin Mapped satri yo'q, chunki route metoddan paydo bo'ladi, metod esa yo'q.", show: "Terminalda yangi satr: <code>CarsController {/cars}</code>. Nest Controller'ni ko'rdi va unga path berdi. Lekin <b>Mapped satri yo'q</b>, chunki route metoddan paydo bo'ladi, metod esa yo'q.", file: null, focus: [] },
    { id: 'f', key: "Brauzerda <code>/cars</code> → <b>404</b>: eshik bor, ichida hech kim yo'q", text: "Brauzerda cars route'ini ochsak: to'rt yuz to'rt, Cannot GET cars. Bu xato emas, bu tabiiy holat: eshik bor, ichida hech kim yo'q.", show: "Brauzerda /cars ochsak: <b>404, Cannot GET /cars</b>. Bu xato emas, bu tabiiy holat: eshik bor, ichida hech kim yo'q.", file: null, focus: [] },
    { id: 'g', key: "Xulosa: path'ni Controller beradi, route'ni <b>metod</b> beradi — endi avval Service, keyin Controller", text: "Xulosa: path'ni Controller decorator'i beradi, route'ni esa metod va uning ustidagi Get yoki Post beradi. Metod yo'q ekan, Mapped ham yo'q, javob to'rt yuz to'rt. Keyingi ikki ekranda fayllarni to'ldiramiz: avval ishni bajaradigan Service, keyin uni chaqiradigan Controller.", file: null, focus: [] },
  ],
};
function Screen13(p) {
  return <Lesson p={p} S={S13} sceneTop scene={({ seg, beat }) => (
    <Ide files={ALL_FILES} active={seg.file}>
      {beat < 4
        ? <CodePanel key={seg.file} file={seg.file} lines={S13_FILES[seg.file]} focus={seg.focus} style={{ fontSize: 14 }} />
        : <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 10 }}>
            {CARS_FILES.map((f) => <CodePanel key={f} file={baseName(f)} numbers={false} lines={S13_FILES[f].filter((l) => l.h && !/import/.test(l.h)).map((l) => ({ ...l, h: l.h.replace(/\s*<span class="cm">[^<]*<\/span>/, '') }))} style={{ padding: '14px 12px', fontSize: 11.5 }} />)}
          </div>}
      <Block at={4} beat={beat}><CodePanel file="terminal" numbers={false} wrap style={{ background: '#111827' }} lines={[
        { h: `[Nest] LOG [InstanceLoader] CarsModule dependencies initialized` },
        { id: 'x', h: `[Nest] LOG [RoutesResolver] <span class="ok">CarsController {/cars}:</span>` },
        { id: 'miss', keep: true, h: t("<span class=\"er\">⟵ bu yerda Mapped {/cars, GET} bo'lishi kerak edi — metod yo'q, satr ham yo'q</span>", '<span class="er">⟵ здесь должна была быть строка Mapped {/cars, GET} — метода нет, и строки нет</span>') },
        { h: `[Nest] LOG [NestApplication] Nest application successfully started` }]} focus={beat === 4 ? ['x', 'miss'] : []} /></Block>
      <Block at={5} beat={beat}><Browser url="localhost:3000/cars" out={'404 · {"message":"Cannot GET /cars"}'} er /></Block>
      <Block at={6} beat={beat}><div className="mk-rule">{t(<><b>Path — Controller'dan, route — metoddan.</b> Metod yo'q → Mapped yo'q → 404. Tartib: avval <b>Service</b> (ishni bajaradigan), keyin <b>Controller</b> (uni chaqiradigan).</>, <><b>Path — от Controller, route — от метода.</b> Нет метода → нет Mapped → 404. Порядок: сначала <b>Service</b> (выполняет работу), потом <b>Controller</b> (вызывает его).</>)}</div></Block>
    </Ide>
  )} />;
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
    { id: 'a', key: "<code>Car</code> interfeysi — mashinaning <b>shakli</b>: id, brand, model, price (bazadagi jadval emas)", text: "Fayllar bo'sh, route yo'q. Tartib bo'yicha avval ishni bajaradigan bo'lakni, Service'ni to'ldiramiz. cars service ts. Avval Car interfeysi: mashinada id, brand, model va price bo'ladi. Interface TypeScript'ning shakl tavsifi, bazadagi jadval emas, hozircha shunchaki shakl.", focus: ['l-interface'] },
    { id: 'b', key: "Ro'yxat hozircha <b>xotirada</b>: Malibu va K5 — bu darsda baza kerak emas", text: "Keyin ro'yxat: ikkita mashina, Chevrolet Malibu va Kia K5, narxi million so'mda. Baza hali yo'q, ma'lumot xotirada turibdi, bu dars uchun yetarli.", focus: ['l-array'] },
    { id: 'c', key: "<code>findAll</code> hammasini qaytaradi, <code>findOne</code> <b>id bo'yicha</b> bittasini qidiradi", text: "findAll ro'yxatni qaytaradi. findOne id bo'yicha qidiradi.", focus: ['l-findAll', 'l-findOne'] },
    { id: 'd', key: "Topilmasa <b>NotFoundException</b> tashlaydi — Nest uni o'zi <b>404 javobga</b> aylantiradi", text: "Topilmasa, NotFoundException tashlaydi. Bu Nest'ning tayyor xatosi: siz uni tashlaysiz, Nest uni o'zi to'rt yuz to'rt javobga aylantiradi, statusi va xabari bilan. Express'da buni qo'lda, status to'rt yuz to'rt va json deb yozardingiz.", show: "Topilmasa, <b>NotFoundException</b> tashlaydi. Bu Nest'ning tayyor xatosi: siz uni tashlaysiz, Nest uni o'zi 404 javobga aylantiradi, statusi va xabari bilan. Express'da buni <code>res.status(404).json</code> deb qo'lda yozardingiz.", focus: ['l-notfound'] },
    { id: 'e', key: "Xulosa: <code>create</code> qo'shadi, Service'da esa <b>so'rov haqida bitta so'z yo'q</b>", text: "create yangi mashinani ro'yxatga qo'shadi va qaytaradi. Qavsdagi Omit Car vergul id, TypeScript yozuvi: Car'ning id'siz shakli, chunki id'ni biz o'zimiz beramiz. Xulosa: bu faylda so'rov haqida bitta so'z ham yo'q, req ham, res ham yo'q. Faqat mashinalar va ular bilan ishlaydigan uch metod. Shuning uchun uni Controller ham, Telegram bot ham ishlata oladi.", show: "<code>create</code> yangi mashinani qo'shadi va qaytaradi. <code>Omit&lt;Car, 'id'&gt;</code> — TypeScript yozuvi: Car'ning id'siz shakli, chunki id'ni biz beramiz. <b>Xulosa:</b> bu faylda so'rov haqida bitta so'z ham yo'q — faqat mashinalar va uch metod.", focus: ['l-create'] },
  ],
};
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg, beat }) => <Ide files={ALL_FILES} active="src/cars/cars.service.ts"><CodePanel file="src/cars/cars.service.ts" lines={beat >= 4 ? CARS_SVC_LINES.slice(6).map((l, k) => ({ ...l, n: 7 + k })) : CARS_SVC_LINES} beat={beat} focus={seg.focus} /></Ide>} />;
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
  kicker: '4-bosqich · Controller', title: 'Controller: uch route',
  segments: [
    { id: 'a', key: "<code>@Controller('cars')</code>: hamma metod <b>/cars</b> bilan boshlanadi; konstruktor CarsService so'raydi", text: "Service tayyor: mashinalar ro'yxati va uchta metod. Endi Service'ni so'rovga ulaydigan bo'lakni, Controller'ni yozamiz. cars controller ts. Controller decorator'i, qavsda cars: hamma metod cars path'i bilan boshlanadi. Konstruktor: menga CarsService kerak.", show: "Service tayyor: mashinalar ro'yxati va uchta metod. Endi Service'ni so'rovga ulaydigan bo'lakni — Controller'ni yozamiz. <b>cars.controller.ts</b>. <code>@Controller('cars')</code>: hamma metod /cars bilan boshlanadi. Konstruktor: «menga CarsService kerak».", focus: ['l-ctrl', 'l-ctor'] },
    { id: 'b', key: "Bo'sh <code>@Get()</code> = <b>GET /cars</b> → Service'ning findAll'i chaqiriladi", text: "Get decorator'i bo'sh: GET cars. Metod Service'ning findAll'ini chaqiradi.", show: "<code>@Get()</code> bo'sh: <b>GET /cars</b>. Metod findAll'ni chaqiradi.", focus: ['l-get'] },
    { id: 'c', key: "<code>@Get(':id')</code> = <b>GET /cars/5</b>; <code>@Param('id')</code> — Express'dagi req.params.id, qiymati matn", text: "Get decorator'i ikki nuqta id bilan: cars path'idan keyin raqam, masalan cars besh. Param decorator'i Express'dagi req params id ning o'zi, faqat decorator orqali olinadi. URL'dan kelgan qiymat har doim matn, shuning uchun Number bilan raqamga o'tkazamiz.", show: "<code>@Get(':id')</code>: <b>GET /cars/5</b> kabi path. <code>@Param('id') id</code>: Express'dagi <code>req.params.id</code> ning o'zi, faqat decorator orqali olinadi. URL'dan kelgan qiymat har doim matn, shuning uchun <code>Number</code> bilan raqamga o'tkazamiz.", focus: ['l-getid', 'l-param'] },
    { id: 'd', key: "<code>@Post()</code> = <b>POST /cars</b>; <code>@Body()</code> — req.body, express.json ulash shart emas", text: "Post decorator'i: POST cars. Body decorator'i Express'dagi req body. Nest'da express json ni qo'lda ulash shart emas, u ichida yoqilgan.", show: "<code>@Post()</code>: <b>POST /cars</b>. <code>@Body() body</code>: Express'dagi <code>req.body</code>. Nest'da <code>express.json()</code> ni qo'lda ulash shart emas, u ichida yoqilgan.", focus: ['l-post', 'l-body'] },
    { id: 'e', key: "Xulosa: uch metod bir shaklda — <b>so'rovdan olinadi, Service chaqiriladi, natija qaytariladi</b>", text: "Xulosa: uchala metod ham bir xil shaklda. So'rovdan kerakli qism olinadi, Service metodi chaqiriladi, natija qaytariladi. Controller'da if yo'q, hisob yo'q, baza yo'q. Chapdagi jadval Express'dagi tanish yozuvlarning Nest'dagi o'rnini ko'rsatadi.", focus: [] },
  ],
};
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <Ide files={ALL_FILES} active="src/cars/cars.controller.ts"><CodePanel file="src/cars/cars.controller.ts" lines={CARS_CTRL_LINES} focus={seg.focus} /></Ide>}
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
// Topilgach — tuzatilgan holat (F-1030-14): hisob Controller'dan olinadi, Service'ning findOne'iga ko'chadi
// n — tuzatilgan fayldagi haqiqiy satr raqami (o'chgan satr raqamsiz; raqamlar siljimasin — nest-linecheck/TAKLIF.md)
const LC1_FIXED = [
  ...LC1_LINES.slice(0, 9).map((l, i) => ({ ...l, n: i + 1 })),
  { gone: true, n: '', h: LC1_LINES[9].h },
  { gone: true, n: '', h: LC1_LINES[10].h },
  { gone: true, n: '', h: LC1_LINES[11].h },
  { neu: true, n: 10, h: `    <span class="k">return this</span>.carsService.<span class="c">findOne</span>(<span class="c">Number</span>(id));   <span class="cm">// yana bitta satr</span>` },
  ...LC1_LINES.slice(12).map((l, i) => ({ ...l, n: 11 + i })),
];
const LC1_SVC_FIXED = [
  { h: `  <span class="c">findOne</span>(id: <span class="k">number</span>): <span class="c">Car</span> {` },
  { h: `    <span class="k">const</span> car = <span class="k">this</span>.cars.<span class="c">find</span>((c) => c.id === id);` },
  { h: `    <span class="k">if</span> (!car) <span class="k">throw new</span> <span class="c">NotFoundException</span>(<span class="s">\`Car with id \${id} not found\`</span>);` },
  { neu: true, h: `    <span class="k">if</span> (car.price > <span class="d">300</span>) <span class="k">return</span> { ...car, price: car.price * <span class="d">0.9</span> };   <span class="cm">// chegirma — Service'da</span>` },
  { h: `    <span class="k">return</span> car;` },
  { h: `  }` },
];
function ScreenLC1(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 2', 'Проверка 2')} eyebrow={t('Tekshiruv · 2 / 5 — qaysi satr xato?', 'Проверка · 2 / 5 — какая строка с ошибкой?')} title={t("Bu Controller ishlaydi, lekin bitta satr noto'g'ri faylda turibdi", 'Этот Controller работает, но одна строка стоит не в том файле')}
    task={t("Qoida: Controller faqat so'rovdan oladi, Service'ni chaqiradi va natijani qaytaradi — <b>hisob qilmaydi</b>. Bu Controller'da bitta satr hisob qilyapti. <b>O'sha satrni bosing.</b>", 'Правило: Controller только берёт из запроса, вызывает Service и возвращает результат — <b>не считает</b>. В этом Controller одна строка считает. <b>Нажмите на эту строку.</b>')}
    q={t("Controller'ni yozdik, endi o'zingiz tekshiring. Ikkinchi tekshiruv. Qoidani eslang: Controller faqat so'rovdan oladi, Service'ni chaqiradi va natijani qaytaradi, hisob qilmaydi. Ekrandagi Controller ishlaydi, lekin bitta satr hisob qilyapti. O'sha satrni bosing.", 'Controller мы написали, теперь проверьте сами. Вторая проверка. Вспомните правило: Controller только берёт из запроса, вызывает Service и возвращает результат, он не считает. Controller на экране работает, но одна строка в нём считает. Нажмите на эту строку.')}
    file="src/cars/cars.controller.ts" lines={LC1_LINES} target={10}
    tree={{ files: ALL_FILES, active: 'src/cars/cars.controller.ts' }}
    fixed={LC1_FIXED.filter((l) => String(l.h).trim() !== '')} fixedExtra={[{ file: 'src/cars/cars.service.ts · findOne', lines: LC1_SVC_FIXED }]}
    ok={t("To'g'ri. O'n birinchi satr narxga chegirma hisoblayapti. Ishlaydi, lekin bu biznes logika, u Service'ga tegishli: Controller'da tursa, uni alohida sinab bo'lmaydi va Telegram bot shu chegirmani ololmaydi. Ekranda tuzatilgan holat ko'rinib turibdi: hisob Service'ning findOne metodiga ko'chdi, Controller'da yana bitta satr qoldi. Demak, Controller'da hisob ko'rsangiz, uni Service'ga ko'chirish kerak.", 'Верно. Одиннадцатая строка считает скидку на цену. Это работает, но это бизнес-логика, и она относится к Service: пока она в Controller, её нельзя протестировать отдельно, и Telegram-бот не получит эту скидку. На экране виден исправленный вариант: расчёт перенесён в метод findOne в Service, а в Controller снова одна строка. Значит, если видите расчёт в Controller, его нужно перенести в Service.')}
    okShort={t("11-satr: chegirma hisobi — biznes logika, u Service'ga tegishli. Tuzatildi: hisob cars.service.ts → findOne'ga ko'chdi, Controller'da yana bitta satr.", 'Строка 11: расчёт скидки — бизнес-логика, она относится к Service. Исправлено: расчёт перенесён в cars.service.ts → findOne, в Controller снова одна строка.')}
    hint={t("Bu satr Controller'ning o'z ishi: so'rovdan olish, Service'ni chaqirish yoki qaytarish. Narxni o'zgartirib, hisob qilayotgan satrni qidiring.", 'Эта строка — собственная работа Controller: взять из запроса, вызвать Service или вернуть. Ищите строку, которая меняет цену, то есть считает.')} />;
}

// --- S16 Terminal va javoblar ---
const REQS = [
  { k: 'r1', m: 'GET', u: '/cars', st: 200, body: `[{"id":1,"brand":"Chevrolet","model":"Malibu","price":250},\n {"id":2,"brand":"Kia","model":"K5","price":320}]` },
  { k: 'r2', m: 'GET', u: '/cars/1', st: 200, body: `{"id":1,"brand":"Chevrolet","model":"Malibu","price":250}` },
  { k: 'r3', m: 'GET', u: '/cars/99', st: 404, body: `{"message":"Car with id 99 not found","error":"Not Found","statusCode":404}` },
  { k: 'r4', m: 'POST', u: '/cars  {brand:"Chevrolet", model:"Cobalt", price:145}', st: 201, body: `{"id":3,"brand":"Chevrolet","model":"Cobalt","price":145}` },
  { k: 'r5', m: 'POST', u: '/cars  {}  (bo\'sh)', st: 201, body: `{"id":4}` },
];
const S16 = {
  kicker: '4-bosqich · ishga tushdi', title: 'Terminal va javoblar', lockHint: "Beshala so'rov tugmasini bosing",
  segments: [
    { id: 'a', key: "Terminalda uchta <b>Mapped</b> satri — uchala route ulangan", text: "Service ham, Controller ham tayyor. Endi eng qiziq joyi: serverni ishga tushirib, haqiqiy so'rov yuboramiz. Server ishga tushdi. Terminalda uchta yangi Mapped satri: cars GET, cars id GET, cars POST. Uchala route ulangan. Endi so'rov yuboramiz.", open: null },
    { id: 'b', key: "<code>GET /cars</code> → <b>200</b>: JSON'ni Nest o'zi yasadi, stringify yozilmadi", text: "GET cars: ikki yuz va ikki mashinalik ro'yxat, JSON ko'rinishida. Biz JSON stringify yozmadik, Nest obyektni o'zi JSON qiladi.", show: "<code>GET /cars</code>: <b>200</b> va ikki mashinalik ro'yxat, JSON ko'rinishida. Biz <code>JSON.stringify</code> yozmadik, Nest obyektni o'zi JSON qiladi.", open: 'r1' },
    { id: 'c', key: "<code>GET /cars/1</code> → <b>200</b> va bitta mashina — Malibu", text: "GET cars bir: ikki yuz va Malibu.", show: "<code>GET /cars/1</code>: <b>200</b> va Malibu.", open: 'r2' },
    { id: 'd', key: "<code>GET /cars/99</code> → <b>404</b>: bizning NotFoundException, Nest xabar bilan qaytardi", text: "GET cars to'qson to'qqiz: to'rt yuz to'rt va xabar, Car with id 99 not found. Bu bizning NotFoundException, Nest uni shu ko'rinishga keltirdi: message, error, statusCode.", show: "<code>GET /cars/99</code>: <b>404</b> va xabar, Car with id 99 not found. Bu bizning NotFoundException, Nest uni shu ko'rinishga keltirdi: <code>message</code>, <code>error</code>, <code>statusCode</code>.", open: 'r3' },
    { id: 'e', key: "<code>POST /cars</code> → <b>201 Created</b> — bu status kodini Nest o'zi qo'ydi", text: "POST cars bilan Cobalt yuboramiz: ikki yuz bir Created va yangi mashina, id uch. E'tibor bering, biz ikki yuz birni yozmadik. Nest POST uchun uni o'zi qo'yadi, Express'da ikki yuz bo'lardi.", show: "<code>POST /cars</code> bilan Cobalt yuboramiz: <b>201 Created</b> va yangi mashina, id 3. Biz 201 yozmadik, Nest POST uchun o'zi qo'yadi; Express'da 200 bo'lardi.", open: 'r4' },
    { id: 'f', key: "Bo'sh <code>POST {}</code> ham <b>201</b> — Nest kiruvchi ma'lumotni <b>o'zi tekshirmaydi</b>", text: "Yana bir sinov: bo'sh POST yuboramiz, ichida hech narsa yo'q. Nest baribir ikki yuz bir qaytaradi va faqat id to'rt bo'lgan mashina yaratadi. Nest kiruvchi ma'lumotni o'zi tekshirmaydi, siz aytmaguncha.", show: "Bo'sh <code>POST /cars {}</code>: Nest baribir <b>201</b> qaytaradi va faqat <code>{id:4}</code> yaratadi. Nest kiruvchi ma'lumotni o'zi tekshirmaydi, siz aytmaguncha.", open: 'r5' },
    { id: 'f2', key: "Aytish usuli — <b>DTO + ValidationPipe</b>: bo'sh so'rovga Nest o'zi <b>400</b> qaytaradi", text: "Aytish usuli DTO: alohida klassda brand matn va majburiy, price raqam deb yoziladi, ValidationPipe yoqiladi. Shunda bo'sh so'rovga Nest o'zi to'rt yuz, Bad Request qaytaradi. Bu darsda uni yozmaymiz, lekin o'quvchi so'rasa, javobingiz shu.", show: "Aytish usuli — <b>DTO</b>: alohida klassda <code>brand</code> matn va majburiy, <code>price</code> raqam deb yoziladi, <code>ValidationPipe</code> yoqiladi; bo'sh so'rovga Nest o'zi <b>400 Bad Request</b> qaytaradi: <code>[&quot;brand should not be empty&quot;, …]</code> (sinab ko'rilgan). Bu darsda yozmaymiz — o'quvchi so'rasa, javobingiz shu.", open: 'r5' },
    { id: 'g', key: "Xulosa: JSON, 201 va 404 xabarini <b>Nest o'zi qiladi</b> — beshala tugmani bosib ko'ring", text: "Xulosa: Nest JSON'ni, POST uchun ikki yuz birni va xato xabarini o'zi qiladi, kiruvchi ma'lumotni tekshirishni esa siz aytmaguncha qilmaydi. Endi beshala tugmani o'zingiz bosib, har javobni o'qing. Davom besh tugmadan keyin ochiladi.", open: null },
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
        <div className="mk-tag">{t("So'rov yuborish — bosing", 'Отправить запрос — нажмите')}</div>
        <div className="mk-req">
          {REQS.map((r) => <button key={r.k} className={(open || seg.open) === r.k ? 'hl' : ''} onClick={() => { setOpen(r.k); setClicked((c) => c.includes(r.k) ? c : [...c, r.k]); }}><span className={`st s${String(r.st)[0]}`}>{r.st}</span><span>{r.m} {r.u}</span></button>)}
        </div>
        {cur && <pre key={cur.k} style={{ animation: 'mk-up .3s ease both' }}>{cur.body}</pre>}
      </div></Block>
    </>);
  }} />;
}

// --- S17 Tekshiruv 3 — o'ylab ko'ring ---
function Screen17(p) {
  return <MCRetry {...p} kicker={t('Tekshiruv 3', 'Проверка 3')} eyebrow={t("Tekshiruv · 3 / 5 — o'ylab ko'ring", 'Проверка · 3 / 5 — подумайте')}
    title={t("Kodimiz hozirgi holatda. GET /cars/abc so'rovi kelsa, javob qanday bo'ladi?", 'Код в текущем виде. Пришёл запрос GET /cars/abc — каким будет ответ?')}
    q={t("Javoblarni ko'rdik. Endi bir qadam oldinga o'ylaymiz. Uchinchi tekshiruv, o'ylab ko'ring. Kimdir cars path'idan keyin abc deb yubordi. Kodimiz hozirgi holatda. Javob qanday bo'ladi?", 'Ответы мы увидели. Теперь подумаем на шаг вперёд. Третья проверка, подумайте. Кто-то отправил abc после пути cars. Код в текущем виде. Каким будет ответ?')}
    opts={t(["200 va bo'sh obyekt — mashina yo'q", "500 Internal server error — Service yiqildi", '404 va «Car with id NaN not found»', '400 Bad Request — id son emas'], ['200 и пустой объект — машины нет', '500 Internal server error — Service упал', '404 и «Car with id NaN not found»', '400 Bad Request — id не число'])} correct={2}
    ok={t("To'g'ri: to'rt yuz to'rt va Car with id NaN not found. Number abc natijasi NaN, bunday id'li mashina yo'q, shuning uchun findOne NotFoundException tashlaydi. Ishlaydi, lekin foydalanuvchi NaN so'zini ko'rmasligi kerak. Id ParseIntPipe bilan olinsa, abc kelganda Nest o'zi to'rt yuz, Bad Request qaytaradi. Demak, Nest kiruvchi ma'lumotni siz pipe bilan aytmaguncha tekshirmaydi.", 'Верно: 404 и Car with id NaN not found. Number от abc даёт NaN, машины с таким id нет, поэтому findOne бросает NotFoundException. Это работает, но пользователь не должен видеть слово NaN. Если брать id через ParseIntPipe, то при abc Nest сам вернёт 400, Bad Request. Значит, Nest не проверяет входящие данные, пока вы не скажете ему это через pipe.')}
    okShort={t("404, «Car with id NaN not found»: Number('abc') = NaN → findOne topmaydi → NotFoundException. Tekshiruv yo'q; @Param('id', ParseIntPipe) yozilsa — 400 «Validation failed (numeric string is expected)» (sinab ko'rilgan).", "404, «Car with id NaN not found»: Number('abc') = NaN → findOne не находит → NotFoundException. Проверки нет; если написать @Param('id', ParseIntPipe) — 400 «Validation failed (numeric string is expected)» (проверено).")}
    wrong={t({ 0: "find hech narsa topmasa undefined qaytaradi, bizning kod esa bu holatda xato tashlaydi.", 1: "Besh yuz faqat biz kutmagan xato bo'lganda chiqadi; bu yerda xatoni o'zimiz NotFoundException bilan tashladik.", 3: "To'rt yuzni hech kim qaytarmaydi, chunki tekshiruv yozilmagan." }, { 0: 'Если find ничего не находит, он возвращает undefined, а наш код в этом случае бросает ошибку.', 1: '500 появляется только при ошибке, которую мы не ожидали; здесь ошибку мы бросили сами через NotFoundException.', 3: '400 никто не возвращает, потому что проверка не написана.' })} />;
}

// --- Amaliyot 2: cars modulini quring ---
const P2 = {
  kicker: 'Amaliyot 3 / 4', eyebrow: "Hozir o'zingizda · 10–15 daqiqa", title: 'cars modulini quring', tableAt: 5,
  segments: [
    { id: 'a', key: "Endi <b>siz</b>: cars modulini o'z loyihangizda to'rt qadamda qurasiz", text: "Yana navbat sizga. Hozirgina ko'rgan cars modulini o'z loyihangizda qurasiz: to'rt qadam, o'n-o'n besh daqiqa.", hl: [] },
    { id: 'b', key: "1-qadam: uch CLI buyrug'i — terminalda <b>3 CREATE, 3 UPDATE</b> chiqsin", text: "Birinchi: uch buyruq bilan modul, controller va service yarating. Terminalda uchta CREATE va uchta UPDATE chiqishi kerak.", hl: [0] },
    { id: 'c', key: "2-qadam: Service kodini <b>nusxalang</b> — qadam ichidagi «Kodni ochish» tugmasida", text: "Ikkinchi: Service'ni darsdagi kod bilan to'ldiring. Ikkinchi qadam ichida Kodni ochish tugmasi bor, kod o'sha yerda, nusxalab qo'ying.", hl: [1] },
    { id: 'd', key: "3-qadam: Controller'ni <b>o'zingiz yozing</b> — namunani ko'rasiz, lekin nusxalanmaydi", text: "Uchinchi: Controller'ni o'zingiz yozing, yigirma qator. Namuna uchinchi qadam ichidagi Kodni ochish tugmasida ko'rinadi, lekin nusxalanmaydi, ataylab. Decorator va konstruktorni qo'lingiz his qilsin. Terminalda uchta Mapped satri chiqsin.", hl: [2] },
    { id: 'e', key: "4-qadam: to'rtta so'rov — javoblar <b>200 · 200 · 404 · 201</b> bo'lsin", text: "To'rtinchi: brauzer yoki Postman bilan to'rtta so'rovni yuboring va javoblarni darsdagi bilan solishtiring: ikki yuz, ikki yuz, to'rt yuz to'rt, ikki yuz bir. cars to'qson to'qqiz javobidagi xabarni isbot maydoniga yozing.", hl: [3] },
    { id: 'f', key: "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi", text: "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha belgilanmaguncha va isbot to'g'ri yozilmaguncha Davom ochilmaydi. Demak, shu amaliyotdan keyin sizda o'zingiz qurgan cars moduli bor va u so'rovlarga javob beradi.", hl: [] },
  ],
};
const P2_STEPS = [
  { t: 'cars moduli', cmds: ['nest g module cars', 'nest g controller cars --no-spec', 'nest g service cars --no-spec'], exp: '3 CREATE, 3 UPDATE' },
  { t: 'Service — nusxalang', cmds: [], exp: "cars.service.ts — «Kodni ochish» → «nusxalash», faylga qo'ying" },
  { t: "Controller — o'zingiz yozing", cmds: [], exp: "cars.controller.ts — 20 qator, namunani «Kodni ochish»da ko'ring (nusxalanmaydi) · terminalda 3 ta Mapped {/cars…}" },
  { t: "So'rovlar", cmds: [], exp: 'GET /cars · /cars/1 · /cars/99 · POST /cars → 200 · 200 · 404 · 201' },
];
const P2_PROOF = { label: 'Isbot: GET /cars/99 javobidagi message maydoni', placeholder: "javobdagi message matnini yozing", check: (v) => /not found/i.test(v) && /99/.test(v), wrong: 'Kutilgan: Car with id 99 not found — javobdagi message qiymatini aynan yozing' };
const P2_TROUBLE = [
  ['Qizil TypeScript xatosi (fayl:satr)', "Nusxalashda satr tushib qolgan: ko'rsatilgan satrni «Kodni ochish»dagi kod bilan solishtiring"],
  ['Cannot GET /cars', "Terminalda Mapped {/cars…} bormi? Yo'q bo'lsa app.module.ts → imports: [CarsModule]"],
  ['POST da body undefined', "Postman'da Body → raw → JSON tanlanganmi? Content-Type: application/json"],
];
// F-1031-04: «Kodni ochish» oynasida butun cars-api ko'rinadi; faqat amaliyot fayllari bosiladi
const P2_TREE = ['dist/', 'node_modules/', ...ALL_FILES, 'test/', 'package.json'];
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} tree={P2_TREE} code={[{ file: 'src/cars/cars.service.ts', lines: CARS_SVC_LINES, step: 1 }, { file: 'src/cars/cars.controller.ts', lines: CARS_CTRL_LINES, copy: false, step: 2 }]} />; }
