
// ============================================================
//  5-BOSQICH · S18–S23, LineCheck 2, Amaliyot 3
// ============================================================
const MODULE_BROKEN = [
  { h: `<span class="d">@Module</span>({` },
  { h: `  controllers: [<span class="c">CarsController</span>],` },
  { gone: true, h: `  providers: [<span class="c">CarsService</span>]` },
  { neu: true, h: `  providers: []` },
  { h: `})` },
];
const ERR1 = [
  { at: 1, id: 'e-who', h: `ERROR [ExceptionHandler] Nest can't resolve dependencies of the <span class="er">CarsController (?)</span>.` },
  { at: 2, id: 'e-what', h: `Please make sure that the argument <span class="er">CarsService at index [0]</span> is available` },
  { at: 3, id: 'e-where', h: `in the <span class="er">CarsModule</span> module.` },
  { at: 4, h: `` },
  { at: 4, id: 'e-solutions', h: `Potential solutions:` },
  { at: 4, id: 'e-solutions', h: `- Is CarsModule a valid NestJS module?` },
  { at: 4, id: 'e-solutions', h: `- If CarsService is a provider, is it part of the current CarsModule?` },
  { at: 4, id: 'e-solutions', h: `- If CarsService is exported from a separate @Module, is that module imported within CarsModule?` },
];
const S18 = {
  kicker: '5-bosqich · buzamiz 1', title: "Buzamiz 1: providers bo'sh",
  segments: [
    { id: 'a', key: "Ataylab buzamiz: <b>providers bo'sh</b>", text: "Endi ataylab buzamiz, chunki o'quvchilaringiz aynan shu xatolarni qiladi, siz esa ularni o'qiy olishingiz kerak. Birinchi holat: cars module da providers ro'yxatidan CarsService'ni o'chirdik.", focus: [] },
    { id: 'b', key: "<b>Kim?</b> CarsController. (?) = topilmagan joy", text: "Serverni ishga tushiramiz, u yiqiladi. Xabarni bo'lak-bo'lak o'qiymiz. Birinchi bo'lak: Nest CarsController'ning bog'liqliklarini topa olmadi. Qavsdagi so'roq belgisi bu topilmagan joy.", show: "Serverni ishga tushiramiz, u yiqiladi. Xabarni bo'lak-bo'lak o'qiymiz. <b>Nest can't resolve dependencies of the CarsController</b>: Nest CarsController'ning bog'liqliklarini topa olmadi. Qavsdagi <b>(?)</b> bu topilmagan joy.", focus: ['e-who'] },
    { id: 'c', key: "<b>Nima yetishmayapti?</b> CarsService, index 0", text: "Ikkinchi bo'lak: nolinchi argument, ya'ni konstruktordagi birinchi parametr, CarsService, mavjud emas.", show: "<b>argument CarsService at index [0] is available</b>: nolinchi argument, ya'ni konstruktordagi birinchi parametr, CarsService, mavjud emas.", focus: ['e-what'] },
    { id: 'd', key: "<b>Qayerda?</b> CarsModule", text: "Uchinchi bo'lak: qaysi modulda qidirdi, CarsModule'da. Mana, uch savolga javob bor: kim, nima yetishmayapti, qayerda.", show: "<b>in the CarsModule module</b>: qaysi modulda qidirdi, CarsModule'da. Mana, uch savolga javob bor: <b>kim, nima yetishmayapti, qayerda</b>.", focus: ['e-where'] },
    { id: 'e', key: "Nest yechimlarni <b>o'zi sanaydi</b>", text: "Pastda Nest o'zi yechimlarni sanaydi: CarsService provider bo'lsa, u shu modulda bormi? Javob: cars module ni ochamiz, providers'ga CarsService'ni qaytaramiz.", focus: ['e-solutions'] },
    { id: 'f', key: "Eng ko'p uchraydigan xato → <b>modul faylini oching</b>", text: "Bu Nest'dagi eng ko'p uchraydigan xato. Uni ko'rsangiz, har doim modul faylini oching.", focus: [] },
  ],
};
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg, beat }) => (<>
    <Block at={0} beat={beat} dim={beat >= 1 && beat <= 4}><CodePanel file="src/cars/cars.module.ts" numbers={false} lines={MODULE_BROKEN} /></Block>
    <Block at={1} beat={beat}><CodePanel file="terminal — server yiqildi" numbers={false} wrap style={{ background: '#1F1115' }} beat={beat} lines={ERR1} focus={seg.focus} /></Block>
    <Block at={5} beat={beat}><div className="mk-rule"><b>Kim · nima · qayerda.</b> «can't resolve dependencies» ko'rsangiz — modul faylini oching, <code>providers</code>'ni tekshiring.</div></Block>
  </>)} />;
}

// --- S19 jim xato (+ bashorat) ---
const S19 = {
  kicker: '5-bosqich · buzamiz 2', title: "Buzamiz 2: imports'da CarsModule yo'q",
  segments: [
    { id: 'a', key: "Bosh modul <code>imports</code>'idan CarsModule o'chirildi", text: "Ikkinchi holat. app module da imports ro'yxatidan CarsModule'ni olib tashladik." },
    { id: 'b', key: "Bashorat: server ishga tushadimi?", text: "Bashorat qiling: serverni ishga tushirsak, xato chiqib yiqiladimi, yoki ishga tushadimi?", ask: { q: 'Server nima qiladi?', opts: ['Xato bilan yiqiladi', 'Ishga tushadi'], answer: 1 } },
    { id: 'c', key: "<b>Ishga tushdi</b>, xato yo'q", text: "Server ishga tushdi, muvaffaqiyatli deb yozdi, hamma narsa yaxshidek. Xato yo'q." },
    { id: 'd', key: "Lekin cars → <b>404</b>. Ildiz ishlaydi", text: "Lekin cars manzilini so'rasak, to'rt yuz to'rt, Cannot GET cars. Ildiz manzil esa ishlaydi.", show: "Lekin <code>/cars</code> so'rasak, <b>404, Cannot GET /cars</b>. <code>/</code> esa ishlaydi." },
    { id: 'e', key: "Nest cars papkasini <b>umuman o'qimadi</b>", text: "Nima bo'ldi? AppModule CarsModule'ni ulamadi, shuning uchun Nest cars papkasini umuman o'qimadi. Xato yo'q, chunki Nest uchun u modul shunchaki yo'q. Bu jim xato, eng xavflisi." },
    { id: 'f', key: "Jurnalda <b>CarsController satri yo'q</b>", text: "Buni qanday topasiz? Jurnalga qarang: CarsController satri yo'q, cars uchun Mapped satri yo'q. Jurnalni o'qishni odat qiling degan edim, sabab mana shu." },
    { id: 'g', key: "Qoida: 404 + kod to'g'ri → <b>jurnal, keyin imports</b>", text: "Qoida: marshrut to'rt yuz to'rt bersa va kodingiz to'g'ri ko'rinsa, avval jurnalda Mapped satrini qidiring, keyin bosh modulning imports ro'yxatini tekshiring." },
  ],
};
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ beat }) => (<>
    <Block at={0} beat={beat} dim={beat >= 2 && beat !== 4}><CodePanel file="src/app.module.ts" numbers={false} lines={[{ h: `<span class="d">@Module</span>({` }, { gone: true, h: `  imports: [<span class="c">CarsModule</span>],` }, { neu: true, h: `  imports: [],` }, { h: `  controllers: [<span class="c">AppController</span>],` }, { h: `  providers: [<span class="c">AppService</span>],` }, { h: `})` }]} /></Block>
    <Block at={2} beat={beat}><CodePanel file="terminal — xato YO'Q" numbers={false} wrap style={{ background: '#111827' }} beat={beat} lines={[
      { at: 2, h: `[Nest] LOG [InstanceLoader] AppModule dependencies initialized` },
      { at: 2, h: `[Nest] LOG [RoutesResolver] AppController {/}:` },
      { at: 2, h: `[Nest] LOG [RouterExplorer] Mapped {/, GET} route` },
      { at: 5, id: 'miss', keep: true, h: `<span class="er">⟵ bu yerda CarsController {/cars} va Mapped {/cars…} bo'lishi kerak edi — yo'q</span>` },
      { at: 2, id: 'ok', h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
      { at: 3, h: `` },
      { at: 3, h: `<span class="p">GET /cars</span> → <span class="er">404</span>  {"message":"Cannot GET /cars","error":"Not Found","statusCode":404}` },
      { at: 3, h: `<span class="p">GET /</span>     → <span class="ok">200</span>  Hello World!` }]} focus={beat === 2 ? ['ok'] : (beat === 5 ? ['miss'] : [])} /></Block>
    <Block at={6} beat={beat}><div className="mk-rule"><b>404 + kod to'g'ri ko'rinadi?</b> 1) jurnalda <code>Mapped</code> satrini qidiring · 2) bosh modulning <code>imports</code>'ini tekshiring.</div></Block>
  </>)} />;
}

// --- S20 Controller dekoratori yo'q ---
const S20 = {
  kicker: '5-bosqich · buzamiz 3', title: "Buzamiz 3: Controller dekoratori yo'q",
  segments: [
    { id: 'a', key: "Dekorator o'chirildi, klass qoldi → <b>yiqiladi</b>", text: "Uchinchi holat: cars controller da Controller dekoratorini o'chirdik, klass joyida qoldi. Server yiqiladi." },
    { id: 'b', key: "«<b>Invalid controller</b>»: belgi yo'q, lekin ro'yxatda bor", text: "Xabar: noto'g'ri controller aniqlandi. CarsController'da Controller dekoratori yo'q, lekin u qaysidir modulning controllers ro'yxatida turibdi.", show: "<b>An invalid controller has been detected.</b> CarsController does not have the @Controller() decorator, but it is being listed in the controllers array of some module." },
    { id: 'c', key: "Belgi bo'lmasa Nest <b>tanimaydi</b>", text: "Nest aniq aytyapti: siz uni ro'yxatga yozgansiz, lekin klassda belgi yo'q. Dekoratorlar ekranida aytganimni eslang: belgi bo'lmasa, Nest klassni tanimaydi." },
    { id: 'd', key: "Yechim: <b>bitta satr</b>, dekoratorni qaytarish", text: "Yechim bitta satr: dekoratorni qaytarish. O'quvchilar buni ko'pincha kodni nusxalab yozganda, birinchi satrni tushirib qoldirganda qiladi." },
  ],
};
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ beat }) => {
    const fixed = beat >= 3;
    return (<>
      <CodePanel key={fixed ? 'f' : 'b'} file="src/cars/cars.controller.ts" lines={[
        { h: `<span class="k">import</span> { Body, Controller, Get, Param, Post } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
        { h: `` },
        fixed ? { neu: true, h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` } : { gone: true, h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)   <span class="cm">← o'chirildi</span>` },
        { h: `<span class="k">export class</span> <span class="c">CarsController</span> {` },
        { h: `  <span class="k">constructor</span>(<span class="k">private readonly</span> carsService: <span class="c">CarsService</span>) {}` },
        { h: `  <span class="cm">// …</span>` },
        { h: `}` }]} />
      <Block at={1} beat={beat} dim={fixed}><CodePanel file="terminal — server yiqildi" numbers={false} wrap style={{ background: '#1F1115' }} lines={[
        { h: `UnknownRequestMappingException [Error]: <span class="er">An invalid controller has been detected.</span>` },
        { h: `"CarsController" <span class="er">does not have the @Controller() decorator</span>` },
        { h: `but it is being listed in the "controllers" array of some module.` }]} /></Block>
      <Block at={3} beat={beat}><div className="mk-rule"><b>Yechim: bitta satr.</b> Dekoratorni qaytaring. Nusxalashda birinchi satr tushib qolgan bo'ladi.</div></Block>
    </>);
  }} />;
}

// --- S21 Injectable yo'q (+ bashorat) ---
const S21 = {
  kicker: '5-bosqich · buzamiz 4', title: "Buzamiz 4: Injectable dekoratori yo'q",
  segments: [
    { id: 'a', key: "Service'dan <b>Injectable</b> o'chirildi", text: "To'rtinchi holat. cars service dan Injectable dekoratorini o'chirdik. Service'ning o'zida konstruktor yo'q, u hech kimga bog'liq emas." },
    { id: 'b', key: "Bashorat: ishlaydimi?", text: "Bashorat qiling: serverni ishga tushirsak, cars manzili ishlaydimi?", ask: { q: 'Injectable dekoratorisiz /cars ishlaydimi?', opts: ['Ha, ishlaydi', "Yo'q, xato chiqadi"], answer: 0 } },
    { id: 'c', key: "<b>Ishlayapti.</b> Nega?", text: "Kutilmagan natija: hammasi ishlayapti, cars manzili ikki yuz qaytaryapti. Nega? CarsService'ning o'zining konstruktorida hech qanday bog'liqlik yo'q. Nest uni bog'liqliksiz yaratib qo'ya oldi." },
    { id: 'd', key: "Injectable = «konstruktorga qarab <b>nima kerakligini aniqla</b>»", text: "Injectable aslida Nest'ga shuni aytadi: bu klassning konstruktoriga qarab, unga nima kerakligini aniqlang. Belgi bo'lmasa, Nest konstruktorga qaramaydi." },
    { id: 'd2', key: "Bog'liqlik qo'shsak: <b>server ishga tushadi</b>, so'rovda <b>500</b>. Jim xato", text: "Endi sinab ko'ramiz: shu Injectable'siz Service'ga bog'liqlik qo'shamiz, konstruktorida PricingService so'raladi. Natija kutilmagan: server xatosiz ishga tushadi, Mapped satrlari joyida. Lekin cars so'rovi besh yuz qaytaradi, jurnalda TypeError: undefined ning withDiscount xossasini o'qib bo'lmaydi. Nest bog'liqlikni jimgina yetkazmadi, maydon bo'sh qoldi. Bu jim xato: ishga tushishda emas, birinchi so'rovda chiqadi.", show: "Injectable'siz Service'ga bog'liqlik qo'shdik (<code>constructor(private pricing: PricingService)</code>). Server <b>xatosiz ishga tushadi</b>, lekin <code>GET /cars</code> → <b>500</b>, jurnalda <code>TypeError: Cannot read properties of undefined (reading 'withDiscount')</code>. Nest bog'liqlikni jimgina yetkazmadi — maydon bo'sh. <b>Jim xato</b>: ishga tushishda emas, birinchi so'rovda." },
    { id: 'e', key: "Qoida: <b>har Service'ga yoziladi</b>, kerak bo'lmasa ham", text: "Shuning uchun qoida sodda: Injectable har Service'ga yoziladi, hozir kerak bo'lmasa ham. O'quvchi men o'chirdim, ishlayapti, demak kerak emas desa, siz nega kerakligini tushuntira olasiz: bog'liqlik paydo bo'lganda xato ishga tushishda emas, so'rov paytida chiqadi, uni topish qiyin." },
  ],
};
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ beat }) => (<>
    <CodePanel file="src/cars/cars.service.ts" lines={[
      { gone: true, h: `<span class="d">@Injectable</span>()   <span class="cm">← o'chirildi</span>` },
      { h: `<span class="k">export class</span> <span class="c">CarsService</span> {` },
      { id: 'ctor', h: `  <span class="cm">// konstruktor yo'q — hech kimga bog'liq emas</span>` },
      { h: `  <span class="k">private</span> cars: <span class="c">Car</span>[] = [ <span class="cm">…</span> ];` },
      { h: `  <span class="c">findAll</span>() { <span class="k">return this</span>.cars; }` },
      { h: `}` }]} focus={beat === 0 || beat === 2 ? ['ctor'] : []} />
    <Block at={2} beat={beat}><CodePanel file="terminal" numbers={false} wrap style={{ background: '#111827' }} lines={[
      { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars, GET} route</span>` },
      { h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
      { h: `<span class="p">GET /cars</span> → <span class="ok">200</span>  [{"id":1,"brand":"Chevrolet",…}, {"id":2,"brand":"Kia",…}]` }]} /></Block>
    <Block at={4} beat={beat} dim={beat >= 5}><CodePanel file="terminal — Injectable'siz + bog'liqlik (haqiqiy chiqish)" numbers={false} wrap style={{ background: '#1F1115' }} lines={[
      { h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
      { h: `<span class="p">GET /cars</span> → <span class="er">500</span>  {"statusCode":500,"message":"Internal server error"}` },
      { h: `[Nest] ERROR [ExceptionsHandler] <span class="er">TypeError: Cannot read properties of undefined (reading 'withDiscount')</span>` },
      { h: `    at CarsService.findAll (src/cars/cars.service.ts:21:22)` }]} /></Block>
    <Block at={5} beat={beat}><div className="mk-rule"><b>Qoida:</b> <code>@Injectable()</code> har Service'ga yoziladi, bog'liqligi bo'lmasa ham. Bo'lmasa — bog'liqlik paydo bo'lganda <b>jim xato</b>: server ishga tushadi, so'rovda 500.</div></Block>
  </>)} />;
}

// --- Tekshiruv 4: qaysi satr xato (modul) ---
const LC2_LINES = [
  { h: `<span class="k">import</span> { Module } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { h: `<span class="k">import</span> { OrdersController } <span class="k">from</span> <span class="s">'./orders.controller'</span>;` },
  { h: `<span class="k">import</span> { OrdersService } <span class="k">from</span> <span class="s">'./orders.service'</span>;` },
  { h: `<span class="k">import</span> { PaymentService } <span class="k">from</span> <span class="s">'./payment.service'</span>;` },
  { h: `` },
  { h: `<span class="d">@Module</span>({` },
  { h: `  imports: [],` },
  { h: `  controllers: [<span class="c">OrdersController</span>, <span class="c">PaymentService</span>],` },
  { h: `  providers: [<span class="c">OrdersService</span>],` },
  { h: `})` },
  { h: `<span class="k">export class</span> <span class="c">OrdersModule</span> {}` },
];
function ScreenLC2(p) {
  return <LineCheck {...p} kicker="Tekshiruv 4" eyebrow="Tekshiruv · 4 / 5 — qaysi satr xato?" title="Server yiqiladi: «can't resolve dependencies of the OrdersController»"
    q="To'rtinchi tekshiruv. Bu modul bilan server yiqiladi: OrdersController'ning bog'liqligi topilmadi deydi. Xato qaysi satrda? Bosing."
    file="src/orders/orders.module.ts" lines={LC2_LINES} target={[7, 8]}
    ok="PaymentService Service, u controllers ro'yxatiga yozilgan, providers'da esa yo'q. Ikkala satr birga tuzatiladi: sakkizinchi satrdan PaymentService olinadi, to'qqizinchi satrga, providers'ga, qo'shiladi. Controllers'da faqat OrdersController qoladi."
    okShort="8 va 9-satr birga: PaymentService controllers'dan olinadi (8), providers'ga qo'shiladi (9)."
    hint="Xato ro'yxatlarda. Har narsa o'z ro'yxatidami: Controller controllers'da, Service providers'da?" />;
}

// --- S22 Error vs HttpException ---
const S22 = {
  kicker: '5-bosqich · xato turi', title: 'Xatoning ikki turi: Error va HttpException',
  segments: [
    { id: 'a', key: "findOne'da oddiy <b>Error</b> tashladik", text: "Oxirgi holat xato haqida. findOne ichida NotFoundException o'rniga oddiy Error tashladik, matni topilmadi." },
    { id: 'b', key: "Javob: <b>500</b>, matnimiz yo'qoldi — to'g'ri shunday", text: "Javob: besh yuz, Internal server error. Bizning topilmadi matnimiz yo'qoldi. Nest kutilmagan xatoni foydalanuvchiga ko'rsatmaydi, bu to'g'ri: ichki tafsilot tashqariga chiqmasligi kerak." },
    { id: 'c', key: "<b>HttpException oilasi</b>: Nest taniydi, status + xabar", text: "NotFoundException esa Nest'ning HttpException oilasidan. Nest uni taniydi va to'g'ri status bilan, xabari bilan qaytaradi." },
    { id: 'd', key: "400 · 401 · 403 · 404", text: "Oilada boshqalari ham bor: BadRequest to'rt yuz, Unauthorized to'rt yuz bir, Forbidden to'rt yuz uch, NotFound to'rt yuz to'rt." },
    { id: 'e', key: "Qoida: foydalanuvchi bilishi kerak → HttpException. «Nega 500?» → <b>qanday xato tashladingiz?</b>", text: "Qoida: foydalanuvchi bilishi kerak bo'lgan xato HttpException bilan tashlanadi, qolgani besh yuz bo'lib qoladi. O'quvchi nega besh yuz chiqyapti desa, birinchi savolingiz: qanday xato tashladingiz?" },
  ],
};
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ beat }) => (<>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <Block at={0} beat={beat} dim={beat >= 2 && beat <= 3}><CodePanel file="oddiy Error" numbers={false} wrap beat={beat} lines={[
        { h: `<span class="k">throw new</span> <span class="c">Error</span>(<span class="s">'topilmadi'</span>);` },
        { at: 1, h: `` },
        { at: 1, h: `<span class="p">GET /cars/99</span> → <span class="er">500</span>` },
        { at: 1, h: `{"statusCode":500,"message":"Internal server error"}` },
        { at: 1, h: `<span class="cm">// «topilmadi» yo'qoldi — yashirildi</span>` }]} /></Block>
      <Block at={2} beat={beat}><CodePanel file="HttpException oilasi" numbers={false} wrap beat={beat} lines={[
        { h: `<span class="k">throw new</span> <span class="c">NotFoundException</span>(<span class="s">'Car with id 99 not found'</span>);` },
        { h: `` },
        { h: `<span class="p">GET /cars/99</span> → <span class="ok">404</span>` },
        { h: `{"message":"Car with id 99 not found","error":"Not Found","statusCode":404}` }]} /></Block>
    </div>
    <Block at={3} beat={beat}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
      {[['BadRequestException', 400], ['UnauthorizedException', 401], ['ForbiddenException', 403], ['NotFoundException', 404]].map(([n, c], i) => <div key={n} className="mk-card" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}><h5 style={{ color: T.accent }}>{c}</h5><code style={{ fontSize: 12 }}>{n}</code></div>)}
    </div></Block>
    <Block at={4} beat={beat}><div className="mk-rule"><b>Foydalanuvchi bilishi kerak</b> → HttpException (404/400/401/403). Qolgani → 500, xabari yashirin.</div></Block>
  </>)} />;
}

// --- S23 Tekshiruv 5 — xatoni o'qish ---
function Screen23(p) {
  const above = <CodePanel numbers={false} wrap style={{ marginBottom: 18, background: '#1F1115' }} lines={[
    { h: `Nest can't resolve dependencies of the OrdersController (<span class="er">?</span>, OrdersService).` },
    { h: `Please make sure that the argument <span class="er">PaymentService at index [0]</span> is available` },
    { h: `in the <span class="er">OrdersModule</span> module.` }]} />;
  return <MCRetry {...p} kicker="Tekshiruv 5" eyebrow="Tekshiruv · 5 / 5 — xatoni o'qish" above={above}
    title="Bu o'quvchingizning loyihasi. Qaysi faylni ochasiz va nimani tuzatasiz?"
    q="Beshinchi tekshiruv. Ekrandagi xabarni o'qing. Bu sizning emas, o'quvchingizning loyihasi, u yordam so'radi. Qaysi faylni ochasiz va nimani tuzatasiz?"
    opts={["orders.controller.ts — konstruktordan OrdersService'ni o'chirish", "orders.module.ts — providers'ga PaymentService qo'shish", "app.module.ts — imports'ga OrdersController qo'shish", "payment.service.ts — Controller dekoratori qo'shish"]} correct={1}
    ok="orders module, providers ro'yxatiga PaymentService. Xabarda hamma narsa yozilgan: kim, OrdersController; nima yetishmayapti, PaymentService, index nol; qayerda, OrdersModule. Qavsda so'roq belgisi birinchi o'rinda, OrdersService ikkinchi o'rinda topilgan. Demak faqat PaymentService yetishmayapti."
    okShort="orders.module.ts → providers: [OrdersService, PaymentService]. Kim: OrdersController · nima: PaymentService, index [0] · qayerda: OrdersModule."
    wrong={{ 0: "OrdersService topilgan, muammo unda emas.", 2: "Controller imports'ga yozilmaydi, imports faqat modullar uchun.", 3: "Controller dekoratori Service'ga qo'yilmaydi; bu xabar PaymentService modul ro'yxatida yo'qligini aytyapti." }} />;
}

// --- Amaliyot 3: o'zingiz buzing va tuzating ---
const P3 = {
  kicker: 'Amaliyot 4 / 4', eyebrow: "Hozir o'zingizda · 5 daqiqa", title: "O'zingiz buzing va tuzating", tableAt: 3,
  segments: [
    { id: 'a', key: "Endi <b>siz buzasiz</b>: ikki holat", text: "Oxirgi amaliyot: endi siz buzasiz. Ikki holat, besh daqiqa. Maqsad xatoni o'z ko'zingiz bilan ko'rish va o'qish.", hl: [] },
    { id: 'b', key: "1 · providers'ni bo'shating → xatoni o'qing → qaytaring", text: "Birinchi: cars module da providers ro'yxatini bo'shating, serverni ishga tushiring, xatodan kim, nima, qayerda ni toping. Xabardagi in the nuqta nuqta module so'zlari orasidagi modul nomini isbot maydoniga yozing, keyin qaytaring.", hl: [0] },
    { id: 'c', key: "2 · imports'dan CarsModule'ni oling → jurnalga qarang", text: "Ikkinchi: app module da imports'dan CarsModule'ni olib tashlang. Server ishga tushadi. Jurnalda qaysi satr yo'qolganini toping, cars manzilini so'rang, keyin qaytaring.", hl: [1] },
    { id: 'd', key: "Isbot: <b>skrinshot</b> (Mapped satrlari + cars 99 javobi)", text: "Hammasi qaytarilgach, jurnaldagi Mapped satrlari va cars to'qson to'qqiz javobi ko'ringan skrinshotni saqlab qo'ying. Bu sizning bajarganingiz isboti, platformada amaliyotni yuklash oynasi bo'ladi.", hl: [2] },
  ],
};
const P3_STEPS = [
  { t: "providers bo'sh", cmds: [], exp: "«Nest can't resolve dependencies of the CarsController (?)» → kim · nima · qayerda → providers: [CarsService] qaytaring" },
  { t: "imports'da CarsModule yo'q", cmds: [], exp: "server ishga tushadi · jurnalda CarsController satri YO'Q · GET /cars → 404 → imports: [CarsModule] qaytaring" },
  { t: 'Skrinshot', cmds: [], exp: 'jurnalda 3 ta Mapped {/cars…} + GET /cars/99 → 404 JSON' },
];
const P3_TROUBLE = [
  ['Qaytardim, baribir xato', "Faylni saqladingizmi? start:dev saqlashda o'zi qayta yuklaydi; terminalda yangi jurnalni kuting"],
  ['Boshqa xato chiqdi', "Xabarni bo'lak-bo'lak o'qing: kim · nima · qayerda. Potential solutions ro'yxati yechimni aytadi"],
];
const P3_PROOF = { label: 'Isbot: xabardagi «in the ___ module» — modul nomi', placeholder: 'CarsModule', check: (v) => /^carsmodule$/i.test(v.replace(/\s/g, '')), wrong: "Xabarni qayta o'qing: «in the … module» orasidagi nom" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }
