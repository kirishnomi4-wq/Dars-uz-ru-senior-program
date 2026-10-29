
// ============================================================
//  2–3-BOSQICH · S6–S9, Amaliyot 1, S10, S11
// ============================================================
const CTRL_LINES = [
  { id: 'l-import', h: `<span class="k">import</span> { Controller, Get } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { id: 'l-import', h: `<span class="k">import</span> { AppService } <span class="k">from</span> <span class="s">'./app.service'</span>;` },
  { h: `` },
  { id: 'l-decorator', h: `<span class="d">@Controller</span>()` },
  { id: 'l-class', h: `<span class="k">export class</span> <span class="c">AppController</span> {` },
  { id: 'l-ctor', h: `  <span class="k">constructor</span>(<span class="k">private readonly</span> appService: <span class="c">AppService</span>) {}` },
  { h: `` },
  { id: 'l-get', h: `  <span class="d">@Get</span>()` },
  { id: 'l-method', h: `  <span class="c">getHello</span>(): <span class="k">string</span> {` },
  { id: 'l-return', h: `    <span class="k">return</span> <span class="k">this</span>.appService.<span class="c">getHello</span>();` },
  { id: 'l-method', h: `  }` },
  { h: `}` },
];
const S6 = {
  kicker: '2-bosqich · Controller', title: "Controller — so'rovni qabul qiladi",
  segments: [
    { id: 'a', key: "<b>Controller dekoratori</b>: manzil ildiz", text: "app controller ts. To'rtinchi satrda Controller dekoratori, qavsi bo'sh. Demak bu Controller'ning manzili ildiz manzil. Qavsga cars yozsak, uning hamma metodlari cars manzili bilan boshlanadi.", show: "app.controller.ts. To'rtinchi satr: <code>@Controller()</code>, qavsi bo'sh. Demak bu Controller'ning manzili ildiz, ya'ni <code>/</code>. Qavsga cars yozsak, uning hamma metodlari <code>/cars</code> bilan boshlanadi.", focus: ['l-decorator'] },
    { id: 'b', key: "Oddiy klass: <b>AppController</b>", text: "Keyin oddiy klass: AppController.", focus: ['l-class'] },
    { id: 'c', key: "Konstruktor: <b>«menga AppService kerak»</b>", text: "Konstruktorda bitta satr bor: unda AppService nomli bo'lak so'raladi. Buni hozircha shunday tushuning: bu Controller'ga AppService kerak. Qanday kelishini alohida ekranda gaplashamiz.", show: "Konstruktorda bitta satr: <code>private readonly appService: AppService</code>. Buni hozircha shunday tushuning: «bu Controller'ga AppService kerak». Qanday kelishini alohida ekranda gaplashamiz.", focus: ['l-ctor'] },
    { id: 'c2', key: "<code>private readonly</code> = maydon <b>o'zi yaratiladi</b>", text: "Bir TypeScript qisqa yozuvi: konstruktor parametri oldida private readonly tursa, u avtomatik klassning maydoni bo'ladi. JavaScript'da this nuqta appService teng appService deb yozardingiz, bu yerda o'sha satr yozilmaydi, u o'zi bajariladi.", show: "TypeScript qisqa yozuvi: parametr oldida <code>private readonly</code> tursa, u avtomatik klass maydoni bo'ladi. JavaScript'dagi <code>this.appService = appService</code> satri yozilmaydi, u o'zi bajariladi.", focus: ['l-ctor'] },
    { id: 'd', key: "<b>Get dekoratori</b> = GET kelsa shu metod", text: "Pastda Get dekoratori. U metod ustida turibdi va aytyapti: GET so'rov kelsa, shu metodni chaqir. Express'dagi app get bilan bir xil ma'no, faqat endi metodning ustida.", show: "Pastda <code>@Get()</code>. U metod ustida turibdi va aytyapti: «GET so'rov kelsa, shu metodni chaqir». Express'dagi <code>app.get</code> bilan bir xil ma'no, faqat endi metodning ustida.", focus: ['l-get', 'l-method'] },
    { id: 'e', key: "Bitta ish: <b>Service'ni chaqirib natijani qaytarish</b>", text: "Metod ichida bitta ish: Service'ning metodini chaqirib, natijasini qaytarish.", show: "Metod ichida bitta ish: <code>this.appService.getHello()</code> natijasini qaytarish.", focus: ['l-return'] },
    { id: 'f', key: "Controller <b>yupqa</b>: oldi, chaqirdi, qaytardi", text: "E'tibor bering: Controller'da mantiq yo'q. U so'rovni oldi, kerakli Service'ni chaqirdi, javobni qaytardi. Controller shunday yupqa bo'lishi kerak.", focus: [] },
  ],
};
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg, beat }) => (<>
    <CodePanel file="src/app.controller.ts" lines={CTRL_LINES} focus={seg.focus} />
    <Block at={6} beat={beat}><div className="mk-rule"><b>Controller yupqa:</b> so'rovni oladi → Service'ni chaqiradi → javobni qaytaradi. If yo'q, hisob yo'q, baza yo'q.</div></Block>
  </>)} />;
}

// --- S7 Service ---
const SVC_LINES = [
  { h: `<span class="k">import</span> { Injectable } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { h: `` },
  { id: 'l-injectable', h: `<span class="d">@Injectable</span>()` },
  { id: 'l-class', h: `<span class="k">export class</span> <span class="c">AppService</span> {` },
  { id: 'l-method', h: `  <span class="c">getHello</span>(): <span class="k">string</span> {` },
  { id: 'l-method', h: `    <span class="k">return</span> <span class="s">'Hello World!'</span>;` },
  { id: 'l-method', h: `  }` },
  { h: `}` },
];
const S7 = {
  kicker: '2-bosqich · Service', title: 'Service — ishni bajaradi',
  segments: [
    { id: 'a', key: "<b>Injectable</b> = «yetkazib berish mumkin»", text: "app service ts. Ustida Injectable dekoratori. Bu so'z inglizcha, yetkazib berish mumkin degani: Nest'ga aytadi, shu klassni kerak bo'lgan joyga yetkazib bersa bo'ladi.", show: "app.service.ts. Ustida <code>@Injectable()</code>. Bu so'z inglizcha, «yetkazib berish mumkin» degani: Nest'ga aytadi, shu klassni kerak bo'lgan joyga yetkazib bersa bo'ladi.", focus: ['l-injectable'] },
    { id: 'b', key: "<b>Haqiqiy ish Service'da</b>: hisob, qoida, baza", text: "Ichida getHello metodi, u Hello World qaytaradi. Hozir bu juda kichkina, lekin qoida katta loyihada ham o'zgarmaydi: haqiqiy ish Service'da bo'ladi. Narxni hisoblash, qoidani tekshirish, bazaga yozish, hammasi shu yerda.", focus: ['l-method'] },
    { id: 'c', key: "Service so'rov haqida <b>bilmaydi</b> → serversiz sinaladi", text: "Bir narsaga e'tibor bering: Service so'rov haqida hech narsa bilmaydi. Unda req ham, res ham yo'q. Shuning uchun uni alohida sinash oson: metodni chaqirasiz, natijani tekshirasiz, server shart emas. Jest darsida aynan shuni qilasiz.", focus: [] },
    { id: 'd', key: "Bitta Service — <b>ikki joyda</b> ishlatiladi", text: "Va shuning uchun bitta Service'ni ikki joy ishlatishi mumkin: HTTP Controller ham, Telegram bot ham.", focus: [] },
  ],
};
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg, beat }) => (<>
    <CodePanel file="src/app.service.ts" lines={SVC_LINES} focus={seg.focus} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <Block at={1} beat={beat}><div className="mk-card" style={{ borderColor: PART.svc }}><h5 style={{ color: PART.svc }}>Service'da bor</h5><div style={{ fontSize: 14 }}>hisob · qoida · bazaga murojaat</div></div></Block>
      <Block at={2} beat={beat}><div className="mk-card"><h5>Service'da yo'q</h5><div style={{ fontSize: 14 }}><code>req</code> · <code>res</code> · manzil — shuning uchun serversiz sinaladi</div></div></Block>
    </div>
    <Block at={3} beat={beat}><div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-row">
        <div className="mk-box" style={{ '--c': PART.ctrl }}><h4>HTTP Controller</h4><p>brauzer so'rovi</p></div>
        <div className="mk-arrow on">→</div>
        <div className="mk-box hl" style={{ '--c': PART.svc }}><h4>CarsService</h4><p>bitta nusxa, bitta mantiq</p></div>
        <div className="mk-arrow on">←</div>
        <div className="mk-box" style={{ '--c': T.purple }}><h4>Telegram bot</h4><p>bot buyrug'i</p></div>
      </div>
    </div></Block>
  </>)} />;
}

// --- S8 Module ---
const MOD_LINES = [
  { h: `<span class="k">import</span> { Module } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { h: `<span class="k">import</span> { AppController } <span class="k">from</span> <span class="s">'./app.controller'</span>;` },
  { h: `<span class="k">import</span> { AppService } <span class="k">from</span> <span class="s">'./app.service'</span>;` },
  { h: `` },
  { id: 'l-module', h: `<span class="d">@Module</span>({` },
  { id: 'l-imports', h: `  imports: [],` },
  { id: 'l-controllers', h: `  controllers: [<span class="c">AppController</span>],` },
  { id: 'l-providers', h: `  providers: [<span class="c">AppService</span>],` },
  { id: 'l-module', h: `})` },
  { h: `<span class="k">export class</span> <span class="c">AppModule</span> {}` },
];
const S8 = {
  kicker: '2-bosqich · Module', title: "Module — ro'yxat",
  segments: [
    { id: 'a', key: "<b>Module dekoratori</b>: uchta ro'yxat", text: "app module ts. Module dekoratori va ichida uchta ro'yxat.", focus: ['l-module'] },
    { id: 'b', key: "<code>controllers</code> · <code>providers</code> (= Service'lar)", text: "controllers: shu modulga tegishli Controller'lar. providers: shu modul yaratib beradigan narsalar, hozircha bu Service'lar. provider so'zini eslab qoling, Nest Service'ni shunday ataydi.", focus: ['l-controllers', 'l-providers'] },
    { id: 'c', key: "<code>imports</code> — boshqa modullar. <b>Ro'yxat hal qiluvchi</b>", text: "imports: boshqa modullar, hozir bo'sh. Module hech qanday ish qilmaydi, u ro'yxat. Lekin bu ro'yxat hal qiluvchi: Nest faqat shu yerda yozilgan narsani ko'radi.", focus: ['l-imports'] },
    { id: 'd', key: "Ro'yxatda yo'q = <b>Nest uchun yo'q</b>", text: "Controller yozib, uni controllers ro'yxatiga qo'shmasangiz, u yo'qdek. Service yozib, providers'ga qo'shmasangiz, Nest uni yetkazib bera olmaydi.", focus: [] },
    { id: 'e', key: "<b>AppModule</b> tepada, qolganlari <code>imports</code> orqali", text: "Loyihada bir nechta modul bo'ladi: cars uchun, users uchun, orders uchun. Hammasining tepasida AppModule turadi va qolganlarini imports orqali o'ziga ulaydi.", focus: ['l-imports'] },
  ],
};
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg, beat }) => (<>
    <CodePanel file="src/app.module.ts" lines={MOD_LINES} focus={seg.focus} />
    <Block at={3} beat={beat} dim={beat >= 4}><div className="mk-rule"><b>Ro'yxatda yo'q = Nest uchun yo'q.</b> Controller → <code>controllers</code>, Service → <code>providers</code>, boshqa modul → <code>imports</code>.</div></Block>
    <Block at={4} beat={beat}><div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">Modullar daraxti</div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><div className="mk-box hl" style={{ '--c': PART.mod, minWidth: 220 }}><h4>AppModule</h4><p><code>imports: [CarsModule, UsersModule, OrdersModule]</code></p></div></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {['CarsModule', 'UsersModule', 'OrdersModule'].map((m, i) => <div key={m} className="mk-box" style={{ '--c': PART.mod, animation: `mk-up .4s ${0.15 + i * 0.15}s ease both` }}><h4>{m}</h4><p>controllers · providers</p></div>)}
      </div>
    </div></Block>
  </>)} />;
}

// --- S9 main.ts va jurnal ---
const MAIN_LINES = [
  { h: `<span class="k">import</span> { NestFactory } <span class="k">from</span> <span class="s">'@nestjs/core'</span>;` },
  { h: `<span class="k">import</span> { AppModule } <span class="k">from</span> <span class="s">'./app.module'</span>;` },
  { h: `` },
  { h: `<span class="k">async function</span> <span class="c">bootstrap</span>() {` },
  { id: 'main-create', h: `  <span class="k">const</span> app = <span class="k">await</span> NestFactory.<span class="c">create</span>(<span class="c">AppModule</span>);` },
  { id: 'main-listen', h: `  <span class="k">await</span> app.<span class="c">listen</span>(process.env.PORT ?? <span class="d">3000</span>);` },
  { h: `}` },
  { h: `<span class="c">bootstrap</span>();` },
];
const LOG_LINES = [
  { at: 1, h: `<span class="p">$</span> npm run start:dev` },
  { at: 2, id: 'log1', h: `[Nest] LOG [NestFactory] Starting Nest application...` },
  { at: 2, id: 'log2', h: `[Nest] LOG [InstanceLoader] <span class="ok">AppModule dependencies initialized</span>` },
  { at: 3, id: 'log3', h: `[Nest] LOG [RoutesResolver] AppController {/}:` },
  { at: 3, id: 'log4', h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/, GET} route</span>` },
  { at: 3, id: 'log5', h: `[Nest] LOG [NestApplication] Nest application successfully started` },
];
const S9 = {
  kicker: '2-bosqich · main.ts', title: 'main.ts va ishga tushish jurnali',
  segments: [
    { id: 'a', key: "Bosh modul Nest'ga beriladi, <b>Nest yig'adi</b>", text: "Hammasi main ts dan boshlanadi. Birinchi satr: Nest'ga bosh modulni beramiz. U modul ro'yxatini o'qiydi, Service'larni yaratadi, Controller'larni ulaydi.", show: "Hammasi main.ts dan boshlanadi. <code>NestFactory.create(AppModule)</code>: Nest'ga bosh modulni beramiz. U modul ro'yxatini o'qiydi, Service'larni yaratadi, Controller'larni ulaydi.", focus: ['main-create'], lf: [] },
    { id: 'b', key: "Port 3000 tinglanadi. Terminal: <code>npm run start:dev</code>", text: "Keyin uch ming portni tinglaydi, Express'dagi kabi. Endi terminalga qarang, npm run start dev yozdik.", show: "Keyin <code>listen(3000)</code>: Express'dagi kabi portni tinglaydi. Endi terminalga qarang, <code>npm run start:dev</code> yozdik.", focus: ['main-listen'], lf: [] },
    { id: 'c', key: "Jurnal: <b>bog'liqliklar tayyor</b>", text: "Birinchi satr: Nest ilovasi ishga tushmoqda. Ikkinchi: AppModule'ning bog'liqliklari tayyor, ya'ni ro'yxatdagi hamma narsa yaratildi.", show: "Starting Nest application. <b>AppModule dependencies initialized</b>: AppModule'ning bog'liqliklari tayyor, ya'ni ro'yxatdagi hamma narsa yaratildi.", focus: [], lf: ['log1', 'log2'] },
    { id: 'd', key: "Jurnal: <b>Mapped</b> = marshrut ulandi", text: "Keyin: AppController topildi va unga ildiz manzil berildi. Mapped satri: ildiz manzilga GET marshruti ulandi. Va oxirgisi: ilova muvaffaqiyatli ishga tushdi.", show: "<code>AppController {/}</code>: Controller topildi va unga manzil berildi. <b>Mapped {/, GET} route</b>: ildiz manzilga GET marshruti ulandi. Nest application successfully started.", focus: [], lf: ['log3', 'log4', 'log5'] },
    { id: 'e', key: "Odat: marshrut ishlamasa — <b>avval jurnal</b>", text: "Bu satrlarni o'qishni odat qiling. Keyinchalik biror marshrut ishlamasa, birinchi qiladigan ishingiz shu jurnalga qarash bo'ladi: Mapped satri bormi, yo'qmi.", focus: [], lf: ['log4'] },
    { id: 'f', key: "Brauzer: <b>Hello World!</b>", text: "Brauzerda localhost uch ming, javob: Hello World.", show: "Brauzerda <code>localhost:3000</code>, javob: <b>Hello World!</b>", focus: [], lf: [] },
  ],
};
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg, beat }) => (<>
    <CodePanel file="src/main.ts" lines={MAIN_LINES} focus={seg.focus} />
    <Block at={1} beat={beat}><CodePanel file="terminal" lines={LOG_LINES} beat={beat} focus={seg.lf} numbers={false} wrap style={{ background: '#111827' }} /></Block>
    <Block at={5} beat={beat}><div className="mk-light" style={{ padding: '12px 16px', display: 'flex', gap: 14, alignItems: 'center' }}>
      <span className="mk-card" style={{ fontFamily: MONO, fontSize: 13, padding: '6px 12px' }}>localhost:3000</span>
      <span style={{ fontSize: 22, fontWeight: 800 }}>Hello World!</span>
    </div></Block>
  </>)} />;
}

// --- Amaliyot 1: loyihani yarating va ishga tushiring ---
const P1 = {
  kicker: 'Amaliyot 2 / 4', eyebrow: "Hozir o'zingizda · 3–5 daqiqa", title: "Ishga tushiring va jurnalni o'qing", tableAt: 4,
  segments: [
    { id: 'a', key: "Loyihangiz o'rnatildi — endi <b>ishga tushiring</b>", text: "Yana navbat sizga. Birinchi amaliyotda boshlab qo'ygan loyihangiz o'rnatilib bo'lgan bo'lsa kerak. Uch qadam: ishga tushirasiz, jurnalni o'qiysiz, brauzerda ko'rasiz.", hl: [] },
    { id: 'b', key: "1 · <code>npm run start:dev</code>", text: "Birinchi: papkaga kiring va npm run start dev yozing.", hl: [0] },
    { id: 'c', key: "2 · jurnalda <b>Mapped</b> satrini toping", text: "Ikkinchi: jurnalda Mapped satrini toping va uni aynan nusxalab, pastdagi isbot maydoniga qo'ying.", hl: [1] },
    { id: 'd', key: "3 · brauzer: <b>Hello World</b>", text: "Uchinchi: brauzerda localhost uch ming, Hello World ni ko'ring.", hl: [2] },
    { id: 'e', key: "Boshqacha chiqdimi — jadval", text: "Boshqacha chiqsa, jadvalga qarang. Uchala katakcha va isbot to'ldirilgach, davom eting.", hl: [] },
  ],
};
const P1_STEPS = [
  { t: 'Ishga tushirish', cmds: ['cd cars-api', 'npm run start:dev'], exp: 'oxirida «Nest application successfully started»' },
  { t: 'Jurnal', cmds: [], exp: 'Mapped {/, GET} route satri — nusxalab isbot maydoniga qo\'ying' },
  { t: 'Brauzer', cmds: [], exp: 'localhost:3000 → Hello World!' },
];
const P1_TROUBLE = [
  ['nest new hali tugamagan', "Terminalda «Successfully created project» chiqishini kuting; 5 daqiqadan oshsa — internet yoki npm install uzoq (--skip-install, keyin npm install)"],
  ['EADDRINUSE :::3000', "3000-portda boshqa server ochiq: uni yoping yoki PORT=3001 npm run start:dev"],
  ['Mapped satri yo\'q, xato bor', "Xato matnini o'qing: qizil TypeScript xatosi bo'lsa fayl:satr ko'rsatilgan; nest new tugamagan bo'lsa kuting"],
];
const P1_PROOF = { label: 'Isbot: jurnaldagi Mapped satrini nusxalang', placeholder: 'Mapped {/, GET} route', check: (v) => /Mapped\s*\{\s*\/\s*,\s*GET\s*\}/i.test(v), wrong: "Kutilgan: Mapped {/, GET} route — jurnaldagi satrni aynan nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} />; }

// --- S10 Tekshiruv 1 ---
function Screen10(p) {
  return <MCRetry {...p} kicker="Tekshiruv 1" eyebrow="Tekshiruv · 1 / 5"
    title="Mashina narxiga chegirma hisoblaydigan kodni qayerga yozasiz?"
    q="Birinchi tekshiruv. Faraz qiling, mashina narxiga chegirma hisoblash kerak. Bu kod qayerga yoziladi? Variantni tanlang."
    opts={['Controller metodi ichiga', 'Service metodi ichiga', 'AppModule ichiga', 'main.ts ichiga']} correct={1}
    ok="Service. Hisob, qoida va bazaga murojaat Service'da turadi. Controller faqat so'rovni oladi va Service'ni chaqiradi. Shunda chegirmani serversiz ham sinab ko'rish mumkin."
    okShort="Service: hisob, qoida, baza — shu yerda. Controller faqat oladi va chaqiradi."
    wrong={{ 0: "Controller yupqa qoladi: u so'rovni oladi va uzatadi, hisoblamaydi.", 2: "Module ro'yxat, unda ish bajaradigan kod yozilmaydi.", 3: "main.ts faqat ilovani ishga tushiradi." }} />;
}

// --- S11 Dependency Injection ---
const S11 = {
  kicker: '3-bosqich · Dependency Injection', title: "Service Controller'ga qanday keladi",
  segments: [
    { id: 'a', key: "Konstruktordagi <b>o'sha satr</b>", text: "Endi konstruktordagi o'sha satrga qaytamiz: Controller'ga AppService kerak deb yozilgan joy.", show: "Endi konstruktordagi o'sha satrga qaytamiz: <code>constructor(private readonly appService: AppService)</code>." },
    { id: 'b', key: "Express: o'zingiz yaratardingiz. Nest: <b>«menga kerak»</b> deysiz", text: "Express'da siz Service'ni o'zingiz chaqirardingiz: require qilib, new bilan yaratib, har kerakli faylda qaytadan. Nest'da siz yaratmaysiz. Siz faqat aytasiz: menga AppService kerak." },
    { id: 'c', key: "Nest <b>bir marta yaratadi</b>, konstruktorga beradi", text: "Nest ishga tushganda providers ro'yxatiga qaraydi, AppService'ni bir marta yaratadi va kimga kerak bo'lsa, konstruktor orqali qo'liga beradi." },
    { id: 'd', key: "<b>Dependency Injection</b> = bog'liqlikni yetkazib berish", text: "Bu usul Dependency Injection deyiladi, bog'liqlikni yetkazib berish. Bog'liqlik, chunki Controller Service'ga bog'liq. Yetkazib berish, chunki uni Nest olib keladi." },
    { id: 'e', key: "Foyda: <b>1 nusxa · test oson · bog'lanmagan</b>", text: "Nega bu yaxshi? Birinchidan, butun loyihada bitta nusxa. Ikkinchidan, test paytida haqiqiy Service o'rniga soxtasini berish mumkin, Controller buni sezmaydi. Uchinchidan, Controller Service qayerdan kelganini bilishi shart emas." },
    { id: 'f', key: "Tip = <b>buyurtma varaqasi</b>", text: "Konstruktordagi tip, AppService, Nest uchun buyurtma varaqasi: tipga qarab nimani berishni biladi." },
  ],
};
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ beat }) => (<>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <Block at={1} beat={beat} dim={beat >= 2}><CodePanel file="Express · 3 faylda qaytadan" numbers={false} lines={[
        { h: `<span class="k">const</span> CarsService = <span class="c">require</span>(<span class="s">'./cars.service'</span>);` },
        { h: `<span class="k">const</span> service = <span class="k">new</span> <span class="c">CarsService</span>();` },
        { h: `<span class="cm">// orders.js da yana… users.js da yana…</span>` }]} /></Block>
      <Block at={0} beat={beat} dim={beat === 1}><CodePanel file="Nest · bir satr" numbers={false} lines={[
        { h: `<span class="k">constructor</span>(` },
        { id: 't', h: `  <span class="k">private readonly</span> appService: <span class="c">AppService</span>` },
        { h: `) {}` }]} focus={beat >= 5 ? ['t'] : []} /></Block>
    </div>
    <Block at={2} beat={beat}><div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">Nest konteyneri</div>
      <div className="mk-row">
        <div className="mk-box" style={{ '--c': PART.mod }}><h4>providers</h4><p><code>[AppService]</code> — ro'yxat</p></div>
        <div className="mk-arrow on">→</div>
        <div className="mk-box hl" style={{ '--c': PART.svc }}><h4>AppService</h4><p><b>1 nusxa</b> — Nest yaratdi</p></div>
        <div className="mk-arrow on">→</div>
        <div className="mk-box" style={{ '--c': PART.ctrl }}><h4>AppController</h4><p>konstruktor orqali oldi</p></div>
      </div>
    </div></Block>
    <Block at={3} beat={beat}><div className="mk-rule"><b>Dependency Injection</b> — bog'liqlikni yetkazib berish: siz yaratmaysiz, Nest <code>providers</code>'ga qarab yaratadi va konstruktorga beradi.</div></Block>
    <Block at={4} beat={beat}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      {[['1 nusxa', 'butun loyihada bitta'], ['Test oson', 'soxta Service beriladi, Controller sezmaydi'], ["Bog'lanmagan", 'Controller qayerdan kelganini bilmaydi']].map(([h, d], i) => <div key={h} className="mk-card" style={{ animation: `mk-up .4s ${i * 0.15}s ease both` }}><h5>{h}</h5><div style={{ fontSize: 13 }}>{d}</div></div>)}
    </div></Block>
  </>)} />;
}
