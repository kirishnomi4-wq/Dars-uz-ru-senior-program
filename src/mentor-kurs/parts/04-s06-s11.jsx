
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
    { id: 'a', key: "<code>@Controller()</code> qavsi bo'sh — bu Controller'ning path'i <b>root</b> (<code>/</code>)", text: "So'rov yo'lidagi birinchi bekat Controller edi. So'rov aynan shu faylga keladi, shuning uchun undan boshlaymiz. Mana app controller ts. To'rtinchi satrda Controller decorator'i, qavsi bo'sh. Demak bu Controller'ning path'i root. Qavsga cars yozsak, uning hamma metodlari cars path'i bilan boshlanadi.", show: "So'rov yo'lidagi birinchi bekat Controller edi — so'rov aynan shu faylga keladi, shuning uchun undan boshlaymiz. <b>app.controller.ts</b>. To'rtinchi satr: <code>@Controller()</code>, qavsi bo'sh. Demak bu Controller'ning path'i root, ya'ni <code>/</code>. Qavsga cars yozsak, uning hamma metodlari <code>/cars</code> bilan boshlanadi.", focus: ['l-decorator'] },
    { id: 'b', key: "Decorator ostida <b>oddiy TypeScript klass</b>: AppController", text: "Keyin oddiy klass: AppController. Uni Controller qilgan narsa ustidagi decorator.", focus: ['l-class'] },
    { id: 'c', key: "Konstruktor aytadi: <b>«menga AppService kerak»</b> — qanday kelishi 14-ekranda", text: "Konstruktorda bitta satr bor: unda AppService nomli bo'lak so'raladi. Buni hozircha shunday tushuning: bu Controller'ga AppService kerak. Qanday kelishini o'n to'rtinchi ekranda ko'ramiz.", show: "Konstruktorda bitta satr: <code>private readonly appService: AppService</code>. Buni hozircha shunday tushuning: «bu Controller'ga AppService kerak». Qanday kelishini 14-ekranda ko'ramiz.", focus: ['l-ctor'] },
    { id: 'c2', key: "<code>private readonly</code> parametr <b>o'zi klass maydoniga</b> aylanadi — <code>this.appService</code> tayyor", text: "Bir TypeScript qisqa yozuvi: konstruktor parametri oldida private readonly tursa, u avtomatik klassning maydoni bo'ladi. To'rtinchi ekrandagi Car klassida buni qo'lda yozgan edik: this nuqta brand teng brand. Bu yerda o'sha satr yozilmaydi, u o'zi bajariladi.", show: "TypeScript qisqa yozuvi: parametr oldida <code>private readonly</code> tursa, u avtomatik klass maydoni bo'ladi. 4-ekrandagi <code>Car</code> klassida buni qo'lda yozgan edik: <code>this.brand = brand</code>. Bu yerda o'sha satr yozilmaydi, u o'zi bajariladi.", focus: ['l-ctor'] },
    { id: 'd', key: "<code>@Get()</code> metod ustida: <b>GET so'rov kelsa, shu metodni chaqir</b>", text: "Pastda Get decorator'i. U metod ustida turibdi va aytyapti: GET so'rov kelsa, shu metodni chaqir. Express'dagi app get bilan bir xil ma'no, faqat endi metodning ustida.", show: "Pastda <code>@Get()</code>. U metod ustida turibdi va aytyapti: «GET so'rov kelsa, shu metodni chaqir». Express'dagi <code>app.get</code> bilan bir xil ma'no, faqat endi metodning ustida.", focus: ['l-get', 'l-method'] },
    { id: 'e', key: "Metod ichida bitta ish: <b>Service'ni chaqirib, natijani qaytarish</b>", text: "Metod ichida bitta ish: Service'ning metodini chaqirib, natijasini qaytarish.", show: "Metod ichida bitta ish: <code>this.appService.getHello()</code> natijasini qaytarish.", focus: ['l-return'] },
    { id: 'f', key: "Xulosa: Controller'da <b>logika yozilmaydi</b> — so'rovni oldi, Service'ni chaqirdi, javobni qaytardi", text: "Xulosa: Controller'da logika yozilmaydi. U so'rovni oldi, kerakli Service'ni chaqirdi, javobni qaytardi. Controller shunday bo'lishi kerak: logika Service'da, Controller faqat ulaydi.", focus: [] },
  ],
};
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg, beat }) => (<>
    <Ide files={APP_FILES} active="src/app.controller.ts"><CodePanel file="src/app.controller.ts" lines={CTRL_LINES} focus={seg.focus} /></Ide>
    <Block at={6} beat={beat}><div className="mk-rule">{t(<><b>Controller'da logika yozilmaydi:</b> so'rovni oladi → Service'ni chaqiradi → javobni qaytaradi. <code>if</code>, hisob, baza — Service'da.</>, <><b>В Controller логику не пишут:</b> принимает запрос → вызывает Service → возвращает ответ. <code>if</code>, расчёты, база — в Service.</>)}</div></Block>
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
    { id: 'a', key: "<code>@Injectable()</code> — «bu klassni kerakli joyga <b>inject qilish mumkin</b>»", text: "Controller so'rovni oldi va ishni Service'ga uzatdi. Demak keyingi bekat Service, uni ochamiz: app service ts. Ustida Injectable decorator'i. Bu so'z inglizcha, inject qilish mumkin degani: Nest'ga aytadi, shu klassni kerak bo'lgan joyga inject qilsa bo'ladi.", show: "Controller so'rovni oldi va ishni Service'ga uzatdi. Demak keyingi bekat — Service: <b>app.service.ts</b>. Ustida <code>@Injectable()</code>. Bu so'z inglizcha, «inject qilish mumkin» degani: Nest'ga aytadi, shu klassni kerak bo'lgan joyga inject qilsa bo'ladi.", focus: ['l-injectable'] },
    { id: 'b', key: "Haqiqiy ish <b>Service'da</b>: narx hisobi, qoida tekshiruvi, bazaga yozish", text: "Ichida getHello metodi, u Hello World qaytaradi. Hozir bu juda kichkina, lekin qoida katta loyihada ham o'zgarmaydi: haqiqiy ish Service'da bo'ladi. Narxni hisoblash, qoidani tekshirish, bazaga yozish, hammasi shu yerda.", focus: ['l-method'] },
    { id: 'c', key: "Service'da <code>req</code> ham, <code>res</code> ham yo'q — shuning uchun <b>serversiz sinaladi</b>", text: "Bir narsaga e'tibor bering: Service so'rov haqida hech narsa bilmaydi. Unda req ham, res ham yo'q. Shuning uchun uni alohida sinash oson: test fayli metodni chaqiradi va natijani kutilgan qiymat bilan solishtiradi, server ishga tushirilmaydi.", focus: [] },
    { id: 'd', key: "Xulosa: bitta Service'ni <b>HTTP Controller ham, Telegram bot ham</b> ishlatadi", text: "Va shuning uchun bitta Service'ni ikki joy ishlatishi mumkin: HTTP Controller ham, Telegram bot ham. Xulosa: ish Service'da, Controller faqat uni so'rovga ulaydi.", focus: [] },
  ],
};
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg, beat }) => (<>
    <Ide files={APP_FILES} active="src/app.service.ts"><CodePanel file="src/app.service.ts" lines={SVC_LINES} focus={seg.focus} /></Ide>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <Block at={1} beat={beat}><div className="mk-card" style={{ borderColor: PART.svc }}><h5 style={{ color: PART.svc }}>{t("Service'da bor", 'В Service есть')}</h5><div style={{ fontSize: 14 }}>{t('hisob · qoida · bazaga murojaat', 'расчёты · правила · обращение к базе')}</div></div></Block>
      <Block at={2} beat={beat}><div className="mk-card"><h5>{t("Service'da yo'q", 'В Service нет')}</h5><div style={{ fontSize: 14 }}><code>req</code> · <code>res</code> · route — {t('shuning uchun serversiz sinaladi', 'поэтому тестируется без сервера')}</div></div></Block>
    </div>
    <Block at={3} beat={beat}><div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-row">
        <div className="mk-box" style={{ '--c': PART.ctrl }}><h4>HTTP Controller</h4><p>{t("brauzer so'rovi", 'запрос из браузера')}</p></div>
        <div className="mk-arrow on">→</div>
        <div className="mk-box hl" style={{ '--c': PART.svc }}><h4>CarsService</h4><p>{t('bitta instance, bitta logika', 'один instance, одна логика')}</p></div>
        <div className="mk-arrow on">←</div>
        <div className="mk-box" style={{ '--c': T.purple }}><h4>{t('Telegram bot', 'Telegram-бот')}</h4><p>{t("bot buyrug'i", 'команда бота')}</p></div>
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
    { id: 'a', key: "<code>@Module</code> ichida <b>uchta ro'yxat</b>: imports · controllers · providers", text: "Controller ham, Service ham tayyor. Lekin Nest ularning borligini qayerdan biladi? Javob uchinchi faylda, Module'da. app module ts: Module decorator'i va ichida uchta ro'yxat.", focus: ['l-module'] },
    { id: 'b', key: "<code>controllers</code> — Controller'lar, <code>providers</code> — Nest yaratadigan <b>Service'lar</b>", text: "controllers: shu modulga tegishli Controller'lar. providers: shu modul yaratib beradigan narsalar, hozircha bu Service'lar. provider so'zini eslab qoling, Nest Service'ni shunday ataydi.", focus: ['l-controllers', 'l-providers'] },
    { id: 'c', key: "<code>imports</code> — boshqa modullar. Nest <b>faqat ro'yxatdagini</b> ko'radi", text: "imports: boshqa modullar, hozir bo'sh. Module hech qanday ish qilmaydi, u ro'yxat. Lekin bu ro'yxat hal qiluvchi: Nest faqat shu yerda yozilgan narsani ko'radi.", focus: ['l-imports'] },
    { id: 'd', key: "Fayl bor, lekin ro'yxatda yo'q — <b>Nest uchun u yo'q</b>", text: "Controller yozib, uni controllers ro'yxatiga qo'shmasangiz, u yo'qdek. Service yozib, providers'ga qo'shmasangiz, Nest uni inject qila olmaydi.", focus: [] },
    { id: 'e', key: "Xulosa: <b>AppModule</b> tepada, qolgan modullar unga <code>imports</code> orqali ulanadi", text: "Loyihada bir nechta modul bo'ladi: cars uchun, users uchun, orders uchun. Hammasining tepasida AppModule turadi va qolganlarini imports orqali o'ziga ulaydi. Xulosa: Module ish qilmaydi, lekin u ro'yxat bo'lgani uchun xatolarning ko'pi aynan shu faylda tuzatiladi.", focus: ['l-imports'] },
  ],
};
// F-1120-02: kod ostida — Nest ko'radigan uch ro'yxat (Shelves); oxirida modullar strukturasi chiziqlar bilan (ModTree)
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg, beat }) => (<>
    {beat < 4 && <Ide files={APP_FILES} active="src/app.module.ts"><CodePanel file="src/app.module.ts" lines={MOD_LINES} focus={seg.focus} /></Ide>}
    <div className="mk-light" style={{ padding: 14 }}><Shelves beat={Math.min(beat, 3)} /></div>
    <Block at={3} beat={beat} dim={beat >= 4}><div className="mk-rule">{t(<><b>Ro'yxatda yo'q = Nest uchun yo'q.</b> Controller → <code>controllers</code>, Service → <code>providers</code>, boshqa modul → <code>imports</code>.</>, <><b>Нет в списке = нет для Nest.</b> Controller → <code>controllers</code>, Service → <code>providers</code>, другой модуль → <code>imports</code>.</>)}</div></Block>
    {beat >= 4 && <div className="mk-light" style={{ padding: 14 }}><ModTree /></div>}
  </>)} />;
}

// --- S9 main.ts va terminal chiqishi ---
// F-1125-01: oxirgi satr Nest 12 qolipida void bilan keladi (feedback/F-1125-01-nest1-kuchaytirish/nest12/qolip-n12-cjs/main.ts)
const MAIN_LINES = [
  { h: `<span class="k">import</span> { NestFactory } <span class="k">from</span> <span class="s">'@nestjs/core'</span>;` },
  { h: `<span class="k">import</span> { AppModule } <span class="k">from</span> <span class="s">'./app.module'</span>;` },
  { h: `` },
  { h: `<span class="k">async function</span> <span class="c">bootstrap</span>() {` },
  { id: 'main-create', h: `  <span class="k">const</span> app = <span class="k">await</span> NestFactory.<span class="c">create</span>(<span class="c">AppModule</span>);` },
  { id: 'main-listen', h: `  <span class="k">await</span> app.<span class="c">listen</span>(process.env.PORT ?? <span class="d">3000</span>);` },
  { h: `}` },
  { id: 'main-boot', h: `<span class="k">void</span> <span class="c">bootstrap</span>();` },
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
  kicker: '2-bosqich · main.ts', title: "main.ts va terminaldagi ishga tushish satrlari",
  segments: [
    { id: 'a', key: "<code>main.ts</code> bosh modulni Nest'ga beradi — <b>Nest hammasini yig'adi</b>", text: "Uch bo'lakni ko'rdik. Endi ular qanday ishga tushadi? Hammasi main ts dan boshlanadi. Birinchi satr: Nest'ga bosh modulni beramiz. U modul ro'yxatini o'qiydi, Service'larni yaratadi, Controller'larni ulaydi.", show: "Uch bo'lakni ko'rdik. Endi ular qanday ishga tushadi? Hammasi main.ts dan boshlanadi. <code>NestFactory.create(AppModule)</code>: Nest'ga bosh modulni beramiz. U modul ro'yxatini o'qiydi, Service'larni yaratadi, Controller'larni ulaydi.", focus: ['main-create'], lf: [] },
    { id: 'b', key: "Port 3000 tinglanadi. Terminalda: <code>npm run start:dev</code>", text: "Keyin uch ming portni tinglaydi, Express'dagi kabi. Oxirgi satrda bootstrap funksiyasi chaqiriladi. Oldidagi void so'zi bu chaqiruvning natijasi bizga kerak emasligini bildiradi, ilova ishlashiga ta'sir qilmaydi. Endi terminalga qarang, npm run start dev yozdik.", show: "Keyin <code>listen(3000)</code>: Express'dagi kabi portni tinglaydi. Oxirgi satrda <code>bootstrap()</code> chaqiriladi. Oldidagi <code>void</code> bu chaqiruvning natijasi bizga kerak emasligini bildiradi, ilova ishlashiga ta'sir qilmaydi. Endi terminalga qarang, <code>npm run start:dev</code> yozdik.", focus: ['main-listen', 'main-boot'], lf: [] },
    { id: 'c', key: "Terminal: <b>dependencies initialized</b> — ro'yxatdagi hamma narsa yaratildi", text: "Birinchi satr: Nest ilovasi ishga tushmoqda. Ikkinchi: AppModule'ning dependency'lari tayyor, ya'ni ro'yxatdagi hamma narsa yaratildi.", show: "Starting Nest application. <b>AppModule dependencies initialized</b>: AppModule'ning dependency'lari tayyor, ya'ni ro'yxatdagi hamma narsa yaratildi.", focus: [], lf: ['log1', 'log2'] },
    { id: 'd', key: "Terminal: <b>Mapped {/, GET}</b> — root path'ga GET route'i ulandi", text: "Keyin: AppController topildi va unga root path berildi. Mapped satri: root path'ga GET route'i ulandi. Va oxirgisi: ilova muvaffaqiyatli ishga tushdi.", show: "<code>AppController {/}</code>: Controller topildi va unga path berildi. <b>Mapped {/, GET} route</b>: root path'ga GET route'i ulandi. Nest application successfully started.", focus: [], lf: ['log3', 'log4', 'log5'] },
    { id: 'e', key: "Odat: route ishlamasa — <b>avval terminaldagi Mapped satrini</b> qidiring", text: "Bu satrlarni o'qishni odat qiling. Keyinchalik biror route ishlamasa, birinchi qiladigan ishingiz terminaldagi shu satrlarga qarash bo'ladi: Mapped satri bormi, yo'qmi.", focus: [], lf: ['log4'] },
    { id: 'f', key: "Xulosa: main.ts → modul → Controller → brauzerda <b>Hello World!</b>", text: "Brauzerda localhost uch ming, javob: Hello World. Xulosa: main ts bosh modulni beradi, Nest ro'yxatdan hamma bo'lakni yig'adi va route'larni ulaydi, terminal esa nima ulanganini aytib turadi.", show: "Brauzerda <code>localhost:3000</code>, javob: <b>Hello World!</b> Xulosa: main.ts bosh modulni beradi, Nest ro'yxatdan hamma bo'lakni yig'adi va route'larni ulaydi, terminal esa nima ulanganini aytib turadi.", focus: [], lf: [] },
  ],
};
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg, beat }) => (<>
    <Ide files={APP_FILES} active="src/main.ts">
      <CodePanel file="src/main.ts" lines={MAIN_LINES} focus={seg.focus} />
      <Block at={1} beat={beat}><CodePanel file="terminal" lines={LOG_LINES} beat={beat} focus={seg.lf} numbers={false} wrap style={{ background: '#111827' }} /></Block>
      <Block at={5} beat={beat}><Browser url="localhost:3000" out="Hello World!" /></Block>
    </Ide>
  </>)} />;
}

// --- Amaliyot 1: loyihani yarating va ishga tushiring ---
const P1 = {
  kicker: 'Amaliyot 2 / 4', eyebrow: "Hozir o'zingizda · 3–5 daqiqa", title: "Ishga tushiring va terminalni o'qing", tableAt: 4,
  segments: [
    { id: 'a', key: "1-amaliyotdagi loyihangiz o'rnatildi — endi uni <b>ishga tushirasiz</b>", text: "Yana navbat sizga. Birinchi amaliyotda boshlab qo'ygan loyihangiz o'rnatilib bo'lgan bo'lsa kerak. Uch qadam: ishga tushirasiz, terminaldagi satrlarni o'qiysiz, brauzerda ko'rasiz.", hl: [] },
    { id: 'b', key: "1-qadam: papkaga kirib <code>npm run start:dev</code> yozing", text: "Birinchi: papkaga kiring va npm run start dev yozing.", hl: [0] },
    { id: 'c', key: "2-qadam: terminalda <b>Mapped</b> satrini toping va isbot maydoniga qo'ying", text: "Ikkinchi: terminalda Mapped satrini toping va uni aynan nusxalab, pastdagi isbot maydoniga qo'ying.", hl: [1] },
    { id: 'd', key: "3-qadam: brauzerda <code>localhost:3000</code> — <b>Hello World!</b> chiqsin", text: "Uchinchi: brauzerda localhost uch ming, Hello World ni ko'ring.", hl: [2] },
    { id: 'e', key: "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi", text: "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Uchala katakcha belgilanmaguncha va isbot to'g'ri qo'yilmaguncha Davom ochilmaydi. Demak, shu amaliyotdan keyin loyihangiz ishga tushgan va siz terminaldagi Mapped satrlarini o'qiy olasiz.", hl: [] },
  ],
};
const P1_STEPS = [
  { t: 'Ishga tushirish', cmds: ['cd cars-api', 'npm run start:dev'], exp: 'oxirida «Nest application successfully started»' },
  { t: 'Terminal', cmds: [], exp: 'Mapped {/, GET} route satri — nusxalab isbot maydoniga qo\'ying' },
  { t: 'Brauzer', cmds: [], exp: 'localhost:3000 → Hello World!' },
];
const P1_TROUBLE = [
  ['nest new hali tugamagan', "Terminalda «Successfully created project» chiqishini kuting; 5 daqiqadan oshsa — internet yoki npm install uzoq (--skip-install, keyin npm install)"],
  ['EADDRINUSE :::3000', "3000-portda boshqa server ochiq: uni yoping yoki PORT=3001 npm run start:dev"],
  ['Mapped satri yo\'q, xato bor', "Xato matnini o'qing: qizil TypeScript xatosi bo'lsa fayl:satr ko'rsatilgan; nest new tugamagan bo'lsa kuting"],
  ['Terminalda ObserveModule satrlari bor', "Loyiha 1-amaliyotdagi buyruq bilan yaratilmagan: cars-api papkasini o'chiring va 1-amaliyotning 3-qadamidagi buyruqni to'liq nusxalab qayta yarating"],
];
const P1_PROOF = { label: 'Isbot: terminaldagi Mapped satrini nusxalang', placeholder: "terminaldagi satrni shu yerga qo'ying", check: (v) => /Mapped\s*\{\s*\/\s*,\s*GET\s*\}/i.test(v), wrong: "Kutilgan: Mapped {/, GET} route — terminaldagi satrni aynan nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} />; }

// --- S10 Tekshiruv 1 ---
function Screen10(p) {
  return <MCRetry {...p} kicker={t('Tekshiruv 1', 'Проверка 1')} eyebrow={t('Tekshiruv · 1 / 6', 'Проверка · 1 / 6')}
    title={t('Mashina narxiga chegirma hisoblaydigan kodni qayerga yozasiz?', 'Куда вы напишете код, который считает скидку на цену машины?')}
    q={t("Uch bo'lakni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Faraz qiling, mashina narxiga chegirma hisoblash kerak. Bu kod qayerga yoziladi? Variantni tanlang.", 'Три части вы увидели, теперь проверим. Первая проверка. Представьте, что нужно посчитать скидку на цену машины. Куда пишется этот код? Выберите вариант.')}
    opts={t(['Controller metodi ichiga', 'Service metodi ichiga', 'AppModule ichiga', 'main.ts ichiga'], ['Внутрь метода Controller', 'Внутрь метода Service', 'Внутрь AppModule', 'Внутрь main.ts'])} correct={1}
    ok={t("To'g'ri, Service. Hisob, qoida va bazaga murojaat Service'da turadi. Controller faqat so'rovni oladi va Service'ni chaqiradi. Shunda chegirmani serversiz ham sinab ko'rish mumkin. Demak, biznes logika qayerda turadi deb so'ralsa, javob doim Service.", 'Верно, Service. Расчёты, правила и обращение к базе живут в Service. Controller только принимает запрос и вызывает Service. Тогда скидку можно проверить и без сервера. Значит, если спрашивают, где живёт бизнес-логика, ответ всегда Service.')}
    okShort={t("Service: hisob, qoida, baza — shu yerda. Controller faqat oladi va chaqiradi.", 'Service: расчёты, правила, база — здесь. Controller только принимает и вызывает.')}
    wrong={t({ 0: "Controller'da logika yozilmaydi: u so'rovni oladi va Service'ga uzatadi, hisoblamaydi.", 2: "Module ro'yxat, unda ish bajaradigan kod yozilmaydi.", 3: "main.ts faqat ilovani ishga tushiradi." }, { 0: 'В Controller логику не пишут: он принимает запрос и передаёт его в Service, а не считает.', 2: 'Module — это список, код, который выполняет работу, в нём не пишут.', 3: 'main.ts только запускает приложение.' })} />;
}

// --- S11 Dependency Injection — qadam-baqadam, fayllar bilan (F-1030-06: avvalgi ko'rinish tushunarsiz edi) ---
// Savol (konstruktorda so'ralgan, lekin hech kim new qilmagan) → Express'da qanday edi → Nest'ning 3 qadami (module o'qiydi → 1 instance → konstruktorga beradi) → nom → foyda → xulosa
const S11 = {
  kicker: '3-bosqich · Dependency Injection', title: "Service Controller'ga qanday keladi",
  segments: [
    { id: 'a', key: "Konstruktorda <b>«menga AppService kerak»</b> — lekin uni hech kim <code>new</code> bilan yaratmagan", text: "Tekshiruvda Controller Service'ni chaqiradi dedik. Lekin Controller Service'ni qayerdan oladi? Shu savol bilan Controller faylidagi konstruktorga qaytamiz. Bu yerda yozilgan: menga AppService kerak. Lekin butun loyihada new AppService degan satr yo'q. Unda Service qayerdan keladi? Shu ekranda aynan shuni qadam-baqadam ko'ramiz.", show: "Tekshiruvda «Controller Service'ni chaqiradi» dedik. Lekin Controller Service'ni qayerdan oladi? Shu savol bilan Controller faylidagi konstruktorga qaytamiz: <code>constructor(private readonly appService: AppService)</code> — «menga AppService kerak». Lekin butun loyihada <code>new AppService()</code> degan satr yo'q. Unda Service qayerdan keladi?", st: 'ctrl' },
    { id: 'b', key: "Express'da o'zingiz yaratasiz: <code>require</code> + <code>new</code>, <b>har faylda qaytadan</b>", text: "Express'da bu ishni o'zingiz qilasiz: require qilasiz, new bilan yaratasiz, har kerakli faylda qaytadan. Uchta faylga kerak bo'lsa, uch marta. Nest'da bu ish sizdan olingan.", st: 'express' },
    { id: 'c', key: "1-qadam: Nest ishga tushganda <b>app.module.ts</b>'dagi <code>providers</code>'ni o'qiydi", text: "Birinchi qadam. Server ishga tushganda Nest app module ts faylini ochadi va providers ro'yxatini o'qiydi: unda AppService turibdi.", st: 'mod' },
    { id: 'd', key: "2-qadam: Nest AppService'dan <b>bitta instance</b> yaratib, o'zida saqlaydi", text: "Ikkinchi qadam. Nest AppService'dan bitta instance yaratadi va o'zida saqlab qo'yadi. Bu ombor Nest konteyneri deyiladi.", st: 'make' },
    { id: 'e', key: "3-qadam: konstruktordagi tip <code>AppService</code> — Nest <b>shu instance'ni konstruktorga beradi</b>", text: "Uchinchi qadam. Nest AppController'ni yaratayotib uning konstruktoriga qaraydi: parametrning tipi AppService. Tip buyurtma varaqasi kabi ishlaydi: Nest konteynerdan aynan shu tipdagi instance'ni olib, konstruktorga beradi. Endi this appService tayyor.", st: 'give' },
    { id: 'f', key: "Bu usulning nomi: <b>Dependency Injection</b> — dependency'ni inject qilish", text: "Bu usul Dependency Injection deyiladi, dependency'ni inject qilish. Dependency, chunki Controller Service'siz ishlay olmaydi. Inject, chunki uni siz emas, Nest tashqaridan olib kelib beradi.", st: 'give' },
    { id: 'g', key: "Foyda: <b>bitta instance</b>, testda <b>soxtasini berish</b> mumkin, Controller manbani bilmaydi", text: "Nega bu yaxshi? Birinchidan, butun loyihada bitta instance. Ikkinchidan, testda haqiqiy Service o'rniga soxtasini berish mumkin, Controller buni sezmaydi. Uchinchidan, Controller Service qayerdan kelganini bilishi shart emas.", st: 'give' },
    { id: 'h', key: "Xulosa: siz ikki ish qilasiz — <b>providers'ga yozasiz, konstruktorda so'raysiz</b>", text: "Xulosa. Sizning ishingiz ikkita: Service'ni modulning providers ro'yxatiga yozish va kerakli joyda konstruktorda so'rash. Yaratish va inject qilishni Nest qiladi. Ikkalasidan biri unutilsa nima bo'lishini beshinchi bosqichda ataylab buzib ko'ramiz.", st: 'give' },
  ],
};
// F-1120-02: sahna — Nest konteyneri AppService instance'ini konstruktorga olib boradi (DiMachine, 02b-mashina.jsx).
// Ikki matnli karta o'rniga: 1-qatorda loyiha qidiruvi (new AppService — 0), 2-qatorda Express'dagi uch marta new, oxirida uch foyda chizmasi
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ beat }) => <div className="mk-light" style={{ padding: 16 }}><DiMachine beat={beat} /></div>} />;
}
