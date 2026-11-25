
// ============================================================
//  NEST-1 SOZLAMASI (31.10: dvigateldan ko'chirildi — dvigatel umumiy, darsga xos qiymat shu yerda)
// ============================================================
const LESSON_ID = 'mentor-nest-01-arxitektura-v1';
const APP_FILES = ['src/main.ts', 'src/app.module.ts', 'src/app.controller.ts', 'src/app.service.ts'];
const CARS_FILES = ['src/cars/cars.module.ts', 'src/cars/cars.controller.ts', 'src/cars/cars.service.ts'];
const ALL_FILES = [...APP_FILES, ...CARS_FILES];
MKCFG.root = 'cars-api';
MKCFG.files = ALL_FILES;

// ============================================================
//  1–2-BOSQICH · S1–S5b
//  Ovoz qoidasi: kod o'qilmaydi, nima bo'layotgani aytiladi; «/» va «@» so'z bilan.
// ============================================================
const S1 = {
  kicker: 'Kirish', eyebrow: 'Mentor kursi · NestJS', title: "Siz Express'ni bilasiz. Endi Nest.",
  plan: ['Nega Nest', "Uch bo'lak: Controller · Service · Module", 'Dependency Injection', "cars route'larini quramiz", "Buzamiz va xatoni o'qiymiz", "Amaliyot (to'rt bo'lak)", "O'quvchi darsini o'tish"],
  segments: [
    { id: 'a', key: "Express bilimingiz ustiga <b>Nest</b> qo'yamiz: u Express'ni bekor qilmaydi, tartib beradi", text: "Assalomu alaykum. Siz Express bilan server yozgansiz: route ochgansiz, so'rovni qabul qilgansiz, javob qaytargansiz. Bugun shu bilimingiz ustiga NestJS qo'yamiz. Nest Express'ni bekor qilmaydi, aksincha, uning ustiga tartib o'rnatadi.", hl: [] },
    { id: 'b', key: "Dars oxirida bo'sh papkadan <b>ishlaydigan server</b> qurib bo'lasiz", text: "Dars oxirida siz bo'sh papkadan boshlab mashinalar ro'yxatini qaytaradigan server qurasiz.", hl: [3] },
    { id: 'c', key: "Nest xato xabarini <b>o'qiy olasiz</b>: qaysi klass, qaysi dependency yetishmayapti, qaysi fayl", text: "Nest'ning xato xabarlarini o'qiy olasiz: qaysi klassda xato, qaysi dependency yetishmayapti va qaysi faylni ochish kerak.", hl: [4] },
    { id: 'd', key: "O'quvchi darsidagi <b>har so'z</b> nimani anglatishini bilib olasiz", text: "Va o'quvchi darsida qaysi so'z nimani anglatishini bilasiz.", hl: [6] },
    { id: 'e', key: "Yetti bosqich. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi", text: "Dars yetti bosqichdan iborat. Shoshilmang: har ekranda ovozni o'chirish, ekranni boshidan eshitish va to'liq matnini o'qish mumkin. Ustoz gapirib bo'lgach, Davom tugmasi ochiladi. Bosing, boshlaymiz.", hl: [] },
  ],
};
// F-1120-02: sahna — darsning rasmi (Nest mashinasi) + yetti bosqich. Har gapda rasmning o'sha qismi o'zgaradi:
// a Express ustida Nest · b ishlaydigan server (GET /cars) · c xato o'qiladi (?) · d o'quvchi darsi so'zlari · e reja
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg, beat }) => <Scene1 seg={seg} beat={beat} />} />;
}
function Scene1({ seg, beat }) {
  const out = beat === 1 ? '[{"id":1,"brand":"Chevrolet",…}, {"id":2,"brand":"Kia",…}]' : null;
  const err = beat === 2;
  const st = beat === 1 ? { br: 'hl' } : beat === 2 ? { ctrl: 'hl' } : beat === 3 ? { ctrl: 'hl', svc: 'hl', mod: 'hl' } : {};
  return <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 14 }}>
    <NestMachine cfg={N1_CARS} url="localhost:3000/cars" out={out} outKind="code" st={st} exp={beat === 0 ? 'hl' : ''} links={beat >= 3}
      sock={err ? { ctrl: { t: '(?)', er: true } } : null}
      lab={beat >= 3 ? { ctrl: t('ofitsiant', 'официант'), svc: t('oshpaz', 'повар'), mod: t('shtat jadvali', 'штатное расписание') } : null}
      readRow read={err ? ['terminal', "ERROR [ExceptionHandler] Nest can't resolve dependencies of the <span class=\"n1-er\">CarsController (?)</span>."] : beat === 1 ? ['terminal', '<span class="n1-c">GET /cars</span> → <span class="n1-ok">200</span>'] : null}
      tag={t("Bugungi darsning rasmi — dars davomida shu rasmga qaytamiz", 'Картина сегодняшнего урока — к ней мы будем возвращаться')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(7,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>;
}

// --- S2 Express: 20 qator → o'sgan loyiha (misol) ---
const EXPRESS_LINES = [
  { h: `<span class="k">const</span> express = <span class="c">require</span>(<span class="s">'express'</span>);` },
  { h: `<span class="k">const</span> app = <span class="c">express</span>();` },
  { h: `app.<span class="c">use</span>(express.<span class="c">json</span>());` },
  { h: `<span class="k">let</span> cars = [{ id: <span class="d">1</span>, brand: <span class="s">'Chevrolet'</span>, model: <span class="s">'Malibu'</span> }];` },
  { h: `` },
  { id: 'route1', h: `app.<span class="c">get</span>(<span class="s">'/cars'</span>, (req, res) => {` },
  { id: 'route1', h: `  res.<span class="c">json</span>(cars);` },
  { id: 'route1', h: `});` },
  { id: 'route2', h: `app.<span class="c">get</span>(<span class="s">'/cars/:id'</span>, (req, res) => {` },
  { id: 'route2', h: `  <span class="k">const</span> car = cars.<span class="c">find</span>(c => c.id === <span class="c">Number</span>(req.params.id));` },
  { id: 'route2', h: `  <span class="k">if</span> (!car) <span class="k">return</span> res.<span class="c">status</span>(<span class="d">404</span>).<span class="c">json</span>({ message: <span class="s">'topilmadi'</span> });` },
  { id: 'route2', h: `  res.<span class="c">json</span>(car);` },
  { id: 'route2', h: `});` },
  { id: 'route3', h: `app.<span class="c">post</span>(<span class="s">'/cars'</span>, (req, res) => {` },
  { id: 'route3', h: `  <span class="k">const</span> car = { id: cars.length + <span class="d">1</span>, ...req.body };` },
  { id: 'route3', h: `  cars.<span class="c">push</span>(car);` },
  { id: 'route3', h: `  res.<span class="c">status</span>(<span class="d">201</span>).<span class="c">json</span>(car);` },
  { id: 'route3', h: `});` },
  { h: `` },
  { h: `app.<span class="c">listen</span>(<span class="d">3000</span>);` },
];
const GROWN_LINES = [
  { n: 212, h: `app.<span class="c">post</span>(<span class="s">'/auth/register'</span>, <span class="k">async</span> (req, res) => {` },
  { n: 213, h: `  <span class="k">const</span> hash = <span class="k">await</span> bcrypt.<span class="c">hash</span>(req.body.password, <span class="d">10</span>);` },
  { n: 214, h: `  <span class="cm">// ... 40 qator tekshiruv</span>` },
  { n: 588, h: `app.<span class="c">post</span>(<span class="s">'/orders'</span>, upload.<span class="c">single</span>(<span class="s">'file'</span>), <span class="k">async</span> (req, res) => {` },
  { n: 589, h: `  <span class="cm">// ... to'lov, email, baza — hammasi shu yerda</span>` },
  { n: 990, id: 'login', h: `<span class="cm">// login qayerda??? 1000 qator pastda...</span>` },
  { n: 1187, h: `app.<span class="c">post</span>(<span class="s">'/auth/login'</span>, <span class="k">async</span> (req, res) => {` },
  { n: 1240, h: `app.<span class="c">listen</span>(<span class="d">3000</span>);` },
];
const S2 = {
  kicker: '1-bosqich · Nega Nest', title: "Express: tanish manzara va og'riq",
  segments: [
    { id: 'a', key: "Tanish manzara: butun Express server bitta <code>server.js</code> faylida", text: "Avval sizga tanish narsadan boshlaymiz, Express'dan. Mana tanish manzara: butun server bitta server js faylida.", focus: [] },
    { id: 'b', key: "<code>GET /cars</code> kelsa, mashinalar <b>ro'yxatini</b> qaytaramiz", text: "cars route'iga GET kelsa, ro'yxatni qaytaramiz.", show: "<code>/cars</code> route'iga GET kelsa, ro'yxatni qaytaramiz.", focus: ['route1'] },
    { id: 'c', key: "<code>GET /cars/:id</code> kelsa, <b>bitta mashinani</b> qidiramiz, topilmasa 404", text: "cars path'idan keyin id kelsa, bittasini qidiramiz, topilmasa to'rt yuz to'rt.", show: "<code>/cars/:id</code> kelsa, bittasini qidiramiz, topilmasa 404.", focus: ['route2'] },
    { id: 'd', key: "<code>POST /cars</code> yangisini qo'shadi. Hammasi <b>20 qator</b> — muammo yo'q", text: "POST kelsa, yangisini qo'shamiz. Hammasi yigirma qator, hammasi ko'z oldingizda. Bu bosqichda hech qanday muammo yo'q.", show: "<code>POST /cars</code> kelsa, yangisini qo'shamiz. Hammasi 20 qator, hammasi ko'z oldingizda. Bu bosqichda hech qanday muammo yo'q.", focus: ['route3'] },
    { id: 'e', key: "Loyiha o'sib <b>1240 qatorga</b> yetdi (shartli misol) — login qayerdaligini qidirasiz", text: "Muammo loyiha o'sganda boshlanadi. Foydalanuvchilar qo'shildi, kirish va ro'yxatdan o'tish qo'shildi, buyurtmalar, to'lov, fayl yuklash. Mana shartli misol, haqiqiy loyiha emas: fayl ming ikki yuz qirq qator deylik. Login qayerda edi? Qidirasiz.", show: "Muammo loyiha o'sganda boshlanadi. Foydalanuvchilar, kirish, buyurtmalar, to'lov, fayl yuklash. Mana <b>shartli misol</b> (haqiqiy loyiha emas): fayl <b>1240 qator</b>. Login qayerda edi? Qidirasiz.", focus: ['login'], grow: true },
    { id: 'f', key: "Xulosa: bitta route'da hamma ish — sinab bo'lmaydi, ikki kishi to'qnashadi. <b>Nest shu og'riq uchun</b>", text: "Xulosa: bitta route ichida ham so'rovni o'qish, ham tekshirish, ham bazaga yozish bor. Shu bo'lakni alohida sinab bo'lmaydi, chunki u route'dan ajralmagan. Ikki kishi bir faylda ishlasa, har kuni to'qnashuv. Siz buni his qilgansiz. Nest aynan shu og'riq uchun yaratilgan. O'quvchi darsi ham aynan shu misoldan boshlanadi.", focus: [], grow: true },
  ],
};
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => {
    const grown = !!seg.grow;
    const lines = grown ? [...EXPRESS_LINES.slice(0, 6).map((l) => ({ ...l, id: null })), { n: '…', h: t('<span class="cm">// … 200 qator</span>', '<span class="cm">// … 200 строк</span>') }, ...GROWN_LINES] : EXPRESS_LINES;
    return <Ide root="express-api" files={['server.js']} active="server.js"><CodePanel key={grown ? 'g' : 'n'} file={grown ? t('server.js · 1240 qator (shartli misol, haqiqiy loyiha emas)', 'server.js · 1240 строк (условный пример, не реальный проект)') : t('server.js · 20 qator', 'server.js · 20 строк')} lines={lines} focus={seg.focus} /></Ide>;
  }} />;
}

// --- S3 Nest nima beradi ---
const S3 = {
  kicker: '1-bosqich · Nega Nest', title: 'Nest nima beradi: majburiy tartib',
  segments: [
    { id: 'a', key: "Express'da har jamoa papkalarni <b>o'zicha</b> bo'ladi — yangi odam qaytadan o'rganadi", text: "Xo'sh, og'riqni ko'rdik: hamma narsa bitta faylda. Tajribali Express dasturchi bunga nima qiladi? Faylni bo'ladi: routes papkasi, controllers papkasi, services papkasi. Lekin har jamoa buni o'zicha qiladi, yangi odam kelganda tartibni qaytadan o'rganadi.", show: "Xo'sh, og'riqni ko'rdik: hamma narsa bitta faylda. Tajribali Express dasturchi bunga nima qiladi? Faylni bo'ladi: <code>routes/</code>, <code>controllers/</code>, <code>services/</code>. Lekin har jamoa buni o'zicha qiladi, yangi odam kelganda tartibni qaytadan o'rganadi." },
    { id: 'b', key: "Nest tartibni <b>majburiy</b> qiladi: uch bo'lak — Controller, Service, Module", text: "Nest shu tartibni majburiy va bir xil qiladi. U uchta bo'lakka nom beradi: Controller, Service, Module." },
    { id: 'c', key: "Har Nest loyihasida bo'laklar bir joyda, bir nomda — <b>Toshkentda yozilganini Berlin bir daqiqada tushunadi</b>", text: "Har Nest loyihasida ular bir xil joyda, bir xil nomda turadi. Shuning uchun Toshkentdagi jamoa yozgan loyihani Berlindagi dasturchi ochsa, qayerda nima turganini bir daqiqada topadi." },
    { id: 'd', key: "Xulosa: Nest ichida <b>o'sha Express</b> ishlaydi — bilganingiz bekor bo'lmaydi, ustiga tartib qo'shiladi", text: "Xulosa va muhim fakt: Nest ichida o'sha Express ishlaydi. So'rovni haqiqatda Express qabul qiladi, Nest esa uni to'g'ri bo'lakka yo'naltiradi. Demak siz bilgan hech narsa bekor bo'lmaydi." },
  ],
};
// F-1120-02: sahna — a Express: har jamoa o'zicha · b Nest: uch bo'lak (mashina) · c har loyihada bir xil joy va nom · d ichida Express
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ beat }) => <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 10 }}>
    <TeamsStrip st={beat >= 1 ? 'dim' : ''} />
    <div style={{ opacity: beat >= 1 ? 1 : 0.12, transition: 'opacity .5s' }}>
      <NestMachine cfg={N1_CARS} st={beat === 1 ? { ctrl: 'hl', svc: 'hl', mod: 'hl' } : {}} exp={beat >= 3 ? 'hl' : ''} links={beat >= 1}
        readRow read={beat === 2 ? [t('har Nest loyihasida', 'в каждом проекте Nest'), 'src/cars/cars.controller.ts · cars.service.ts · cars.module.ts'] : null}
        tag={t('NestJS · tartib va nomlar — hamma loyihada bir xil', 'NestJS · порядок и имена — одинаковы в любом проекте')} />
    </div>
  </div>} />;
}

// --- S4 TypeScript va decorator ---
const DECO_LINES = [
  { id: 'l-ctrl', h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` },
  { id: 'l-class', h: `<span class="k">export class</span> <span class="c">CarsController</span> {` },
  { id: 'l-get', h: `  <span class="d">@Get</span>()` },
  { id: 'l-get', h: `  <span class="c">findAll</span>() { <span class="cm">/* … */</span> }` },
  { h: `}` },
];
const S4 = {
  kicker: '1-bosqich · Nega Nest', title: 'TypeScript va decorator: @ belgisi',
  segments: [
    { id: 'a', key: "TypeScript — <b>tiplari bor</b> JavaScript: JavaScript bilsangiz, o'qiy olasiz", text: "Nest kodini ochishdan oldin bitta yangi narsani bilib olaylik, aks holda kod sizga begona ko'rinadi. Nest loyihalari TypeScript'da yoziladi. TypeScript bu JavaScript'ning o'zi, faqat tiplari bor: string, number va shunga o'xshash. Siz JavaScript bilsangiz, TypeScript'ni o'qiy olasiz.", focus: [] },
    { id: 'b', key: "Yangi narsa: <b>@</b> (kuchukcha) bilan boshlanadigan satr — <b>decorator</b>", text: "Lekin bitta yangi narsa bor, u bilan ko'p uchrashasiz: kuchukcha belgisi bilan boshlanadigan satrlar. Masalan, Controller decorator'i, qavsda cars. Bu decorator deyiladi.", show: "Lekin bitta yangi narsa bor, u bilan ko'p uchrashasiz: <b>@</b> (kuchukcha) belgisi bilan boshlanadigan satrlar. Masalan, <code>@Controller('cars')</code>. Bu <b>decorator</b> deyiladi.", focus: ['l-ctrl'] },
    { id: 'c', key: "Decorator Nest'ga aytadi: <b>bu klass Controller</b>, bu metod GET'ni qabul qiladi", text: "Decorator klass yoki metodning tepasiga yoziladi va Nest'ga xabar beradi: bu klass Controller, uning path'i cars. Get decorator'i esa metod ustida turadi: GET so'rov kelsa, shu metod.", show: "Decorator klass yoki metodning tepasiga yoziladi va Nest'ga xabar beradi: «bu klass Controller, uning path'i cars». <code>@Get</code> esa metod ustida turadi: «GET so'rov kelsa, shu metod».", focus: ['l-get'] },
    { id: 'd', key: "Xulosa: decorator kod bajarmaydi, belgi qo'yadi — <b>belgi yo'q bo'lsa, Nest klassni tanimaydi</b>", text: "Xulosa: decorator kodni bajarmaydi, u belgi qo'yadi. Nest ishga tushganda shu belgilarni o'qib, hamma bo'lakni joyiga qo'yadi. Shuni eslab qoling: decorator yo'q bo'lsa, Nest o'sha klassni tanimaydi. Beshinchi bosqichda buni ataylab buzib, xatosini ham ko'ramiz.", focus: [] },
  ],
};
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg, beat }) => (<>
    {/* UX-7: JS/TS solishtiruvi oynaning ichida, editor ustida — alohida «suzib» turmaydi */}
    <Ide files={['src/cars/cars.controller.ts']} active="src/cars/cars.controller.ts">
      <Block at={0} beat={beat}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <span className="mk-card" style={{ fontSize: 13.5 }}><b>JavaScript</b> → <code>let price = 250</code></span>
        <span className="mk-card" style={{ fontSize: 13.5 }}><b>TypeScript</b> → <code>let price: number = 250</code></span>
      </div></Block>
      <CodePanel file="src/cars/cars.controller.ts" lines={DECO_LINES} focus={seg.focus} style={{ fontSize: 15 }} />
    </Ide>
    <Block at={3} beat={beat}><div className="mk-rule">{t(<><b>Decorator</b> — klass yoki metod ustidagi <b>@</b> (kuchukcha) belgili satr. Kod bajarmaydi, Nest'ga «bu nima» deb aytadi. Belgi yo'q — Nest klassni tanimaydi.</>, <><b>Decorator</b> — строка со знаком <b>@</b> («собачка») над классом или методом. Код не выполняет, говорит Nest, «что это». Нет метки — Nest не узнаёт класс.</>)}</div></Block>
  </>)} />;
}

// --- S5a Fayllar: VS Code Explorer (katta ko'rinish, vazifa izohi bilan) ---
const FILES5 = ['src/main.ts', 'src/app.module.ts', 'src/app.controller.ts', 'src/app.service.ts', 'src/app.controller.spec.ts', 'test/app.e2e-spec.ts', 'package.json', 'tsconfig.json'];
const FILES5_DESC = { 'src/main.ts': 'ilovani ishga tushiradi', 'src/app.module.ts': "ro'yxat", 'src/app.controller.ts': "so'rovni qabul qiladi", 'src/app.service.ts': 'ishni bajaradi', 'src/app.controller.spec.ts': 'avtomatik test — bugun tegmaymiz', 'test/app.e2e-spec.ts': 'avtomatik test — bugun tegmaymiz', 'package.json': "paketlar va npm buyruqlari (start:dev)", 'tsconfig.json': 'TypeScript sozlamasi' };
const S5a = {
  kicker: "2-bosqich · Uch bo'lak", title: 'Tirik loyiha: nest new nimani yaratdi',
  segments: [
    { id: 'a', key: "<code>nest new cars-api</code> yaratgan loyiha: <b>src</b> ichida to'rtta asosiy fayl", text: "Endi tayyorsiz: decorator'ni bilasiz, uch bo'lakning nomini bilasiz. Haqiqiy loyihaga qaraymiz. nest new cars-api buyrug'i mana shu papka va fayllarni yaratdi, xuddi VS Code'ning chap panelida ko'rganingizdek. Bizga kerakli hamma narsa src papkasida: to'rtta asosiy fayl.", hl: null },
    { id: 'b', key: "<b>main.ts</b> ilovani ishga tushiradi — boshqa hech narsa qilmaydi", text: "main ts: ilovani ishga tushiradi, boshqa hech narsa qilmaydi.", hl: 'src/main.ts' },
    { id: 'c', key: "<b>app.module.ts</b> — ro'yxat: Nest shunga qarab hamma narsani yig'adi", text: "app module ts: ro'yxat. Nest shu ro'yxatga qarab hamma narsani yig'adi.", hl: 'src/app.module.ts' },
    { id: 'd', key: "<b>app.controller.ts</b> so'rovni qabul qiladi va javobni qaytaradi", text: "app controller ts: so'rovni qabul qiladi va javobni qaytaradi.", hl: 'src/app.controller.ts' },
    { id: 'e', key: "<b>app.service.ts</b> ishni bajaradi; <b>spec</b> fayllar — avtomatik test, bugun tegmaymiz", text: "app service ts: ishni bajaradi. spec bilan tugaydigan fayllar avtomatik testlar, ularni Jest ishga tushiradi. Bugun ularga tegmaymiz. package json'da npm buyruqlari turadi, start dev ham shu yerda.", hl: 'src/app.service.ts' },
    { id: 'f', key: "Xulosa: uch bo'lak, uch rang — <b>ko'k Controller · yashil Service · sariq Module</b>", text: "Xulosa: loyihada uch turdagi bo'lak bor, har biri o'z faylida. Uchta rangni eslab qoling: ko'k Controller, yashil Service, sariq Module. Dars davomida har kod yonida shu Explorer turadi va qaysi faylda ekaningizni ko'rsatib boradi. Keyingi ekranda siz ham shu loyihani o'zingizda yaratib qo'yasiz.", hl: null },
  ],
};
function Screen5a(p) {
  return <Lesson p={p} S={S5a} scene={({ seg }) => <FileTree big files={FILES5} active={seg.hl} desc={FILES5_DESC} />} />;
}

// --- S5b So'rov yo'li ---
const S5b = {
  kicker: "2-bosqich · Uch bo'lak", title: "Bitta so'rovning yo'li",
  segments: [
    { id: 'a', key: "Brauzer <code>localhost:3000</code> manziliga <b>GET so'rov</b> yubordi", text: "Loyihangiz fonda o'rnatilayotganda, fayllar bir-biri bilan qanday ishlashini ko'raylik. Buning eng yaxshi yo'li, bitta so'rovning yo'lini kuzatish. Brauzer localhost uch ming manziliga GET so'rov yubordi.", dot: 'browser', boxes: ['browser'], file: null },
    { id: 'b', key: "So'rovni <b>AppController</b> qabul qildi — unda GET uchun metod bor", text: "So'rovni AppController qabul qildi, chunki unda GET uchun metod bor. U app controller ts faylida yashaydi, nomi qutining pastida.", dot: 'ctrl', boxes: ['browser', 'ctrl'], box: 'ctrl', file: 'src/app.controller.ts' },
    { id: 'c', key: "Controller javobni o'zi o'ylamaydi — <b>AppService'dan so'raydi</b>", text: "Controller o'zi javob o'ylab topmaydi, u AppService'dan so'raydi. Service Hello World matnini qaytaradi.", dot: 'svc', boxes: ['browser', 'ctrl', 'svc'], box: 'svc', file: 'src/app.service.ts' },
    { id: 'd', key: "Controller Service bergan matnni <b>brauzerga qaytardi</b>", text: "Controller shu matnni brauzerga yuboradi. Brauzerda Hello World chiqadi.", dot: 'browser', boxes: ['browser', 'ctrl', 'svc'], box: 'ctrl', reply: true, file: 'src/app.controller.ts' },
    { id: 'e', key: "<b>AppModule</b> ikkalasini ro'yxatda ushlaydi — Nest shunga qarab yig'adi", text: "AppModule esa bu ikkalasini bitta ro'yxatda ushlab turadi, Nest shu ro'yxatga qarab ularni yig'adi.", dot: null, boxes: ['browser', 'ctrl', 'svc', 'mod'], box: 'mod', file: 'src/app.module.ts' },
    { id: 'f', key: "Xulosa: yo'l doim shu — <b>so'rov → Controller → Service → javob</b>", text: "Xulosa: har so'rov bir xil yo'l bosadi. So'rov, Controller, Service, javob. Module esa bu bo'laklarni ro'yxatda ushlaydi. Bu yo'lni dars davomida ko'p marta ko'rasiz. Keyingi uch ekranda har faylni ochib, satrma-satr o'qiymiz.", dot: null, boxes: ['browser', 'ctrl', 'svc', 'mod'], file: null },
  ],
};
// F-1120-02: sahna — Nest mashinasi (02b-mashina.jsx). So'rov qizil yo'lakda boradi, javob yashil yo'lakda qaytadi;
// pastki qora satrda shu paytda bajarilayotgan satr (fayl:satr — CTRL_LINES, SVC_LINES, MOD_LINES bilan bir xil raqam)
function Screen5b(p) {
  return <Lesson p={p} S={S5b} scene={({ beat }) => <Scene5b beat={beat} />} />;
}
function Scene5b({ beat }) {
  const late = useLate(beat, 950);
  const st = [
    { br: 'hl', ctrl: 'g', svc: 'g', mod: 'g' },
    { br: '', ctrl: 'hl', svc: 'g', mod: 'g' },
    { br: '', ctrl: '', svc: 'hl', mod: 'g' },
    { br: 'hl', ctrl: '', svc: '', mod: 'g' },
    { br: '', ctrl: '', svc: '', mod: 'hl' },
    {},
  ][Math.min(beat, 5)];
  const back = beat === 2 && late;
  const pkt = beat >= 5 ? { loop: true, label: t("so'rov", 'запрос') }
    : beat === 4 ? { off: true, x: 'b', lane: 2, label: '' }
    : beat === 3 ? { x: 'b', lane: 2, grn: true, label: "'Hello World!'" }
    : back ? { x: 's', lane: 2, grn: true, label: "'Hello World!'" }
    : { x: ['b', 'c', 's'][beat], lane: 1, label: 'GET /' };
  const fill = [[0, 0], [243, 0], [501, 0], [501, 501], [501, 501], [501, 501]][Math.min(beat, 5)];
  const read = [
    [t('brauzer', 'браузер'), 'GET http://localhost:3000/'],
    ['src/app.controller.ts:8', '<span class="n1-d">@Get</span>()'],
    ['src/app.service.ts:6', "<span class=\"n1-k\">return</span> <span class=\"n1-s\">'Hello World!'</span>;"],
    ['src/app.controller.ts:10', '<span class="n1-k">return this</span>.appService.getHello();'],
    ['src/app.module.ts:7–8', 'controllers: [<span class="n1-c">AppController</span>],  providers: [<span class="n1-c">AppService</span>],'],
    [t('natija', 'результат'), 'GET /  →  <span class="n1-ok">200</span>  Hello World!'],
  ][Math.min(beat, 5)];
  const out = beat >= 4 || (beat === 3 && late) ? 'Hello World!' : null;
  return <div className="mk-light" style={{ padding: 16 }}>
    <NestMachine cfg={N1_APP} st={st} out={out} links={beat >= 4} modHot={beat === 4} lanes pkt={pkt} fill={fill} readRow read={read}
      tag={t("So'rov yo'li — brauzerdan fayllarga va qaytib", 'Путь запроса — из браузера к файлам и обратно')} />
  </div>;
}

// --- Amaliyot 1/4: Nest'ni o'rnating, nest new ni boshlab qo'ying (o'rnatilguncha dars davom etadi) ---
// F-1125-01 (M54): versiya buyruqning o'zida qotirilgan (@12), nest new savollarsiz (bayroqlar bilan) —
// dars chiqishlari Nest 12 da shu buyruqlar bilan tekshirilgan: feedback/F-1125-01-nest1-kuchaytirish/nest12/FARQLAR.md
const P0 = {
  kicker: 'Amaliyot 1 / 4', eyebrow: "Hozir o'zingizda · 3–5 daqiqa (o'rnatish fonda)", title: "Nest'ni o'rnating, loyihani boshlab qo'ying", tableAt: 4,
  segments: [
    { id: 'a', key: "Endi <b>siz</b>: Nest'ni o'rnatib, loyihani yaratishni boshlab qo'yasiz", text: "Endi navbat sizga. Hozirgina ko'rgan loyihani o'zingizda yaratib qo'yasiz: uchta qadam. O'rnatish bir-uch daqiqa oladi, kutmaysiz, Davom bosib darsni davom ettirasiz, loyiha fonda o'rnatiladi.", hl: [] },
    { id: 'b', key: "1-qadam: Node versiyasi <b>22 yoki undan yuqori</b> bo'lishi shart", text: "Birinchi: node versiyasini tekshiring. Yigirma ikki yoki undan yuqori bo'lishi kerak. Past bo'lsa, jadvaldagi yo'l bilan yangilang.", hl: [0] },
    { id: 'c', key: "2-qadam: <b>Nest CLI 12</b>'ni o'rnating, versiyasini isbot maydoniga yozing", text: "Ikkinchi: Nest CLI'ni global o'rnating. Buyruq oxirida kuchukcha belgisi va o'n ikki turibdi: bu darsdagi hamma kod va terminal satrlari Nest'ning o'n ikkinchi versiyasida tekshirilgan, shuning uchun aynan shu versiyani o'rnatamiz. Keyin versiyani tekshiring va chiqqan raqamni pastdagi isbot maydoniga yozing.", show: "Ikkinchi: Nest CLI'ni global o'rnating. Buyruq oxirida <code>@12</code> turibdi: bu darsdagi hamma kod va terminal satrlari Nest'ning 12-versiyasida tekshirilgan, shuning uchun aynan shu versiyani o'rnatamiz. Keyin versiyani tekshiring va chiqqan raqamni pastdagi isbot maydoniga yozing.", hl: [1] },
    { id: 'd', key: "3-qadam: <code>nest new</code> buyrug'ini <b>to'liq nusxalang</b> — o'rnatish fonda, kutmasdan davom eting", text: "Uchinchi: loyihani yarating. Buyruqni qo'lda yozmang, to'liq nusxalang. Nest'ning o'n ikkinchi versiyasi loyiha yaratishda to'rtta savol beradi, biz javoblarni buyruqning o'zida berdik: paket menejeri npm, modul tizimi CommonJS, kuzatuv xizmati va AI agentlar uchun fayllar kerak emas. CommonJS'ni tanladik, chunki o'quvchi loyihasi ham shu tizimda yozilgan. O'rnatish boshlangach, kutmang: katakchani belgilang va Davom bosing.", show: "Uchinchi: loyihani yarating. Buyruqni qo'lda yozmang, to'liq nusxalang. Nest'ning 12-versiyasi loyiha yaratishda to'rtta savol beradi, biz javoblarni buyruqning o'zida berdik: paket menejeri <code>npm</code>, modul tizimi <code>CommonJS</code>, kuzatuv xizmati va AI agentlar uchun fayllar kerak emas. CommonJS'ni tanladik, chunki o'quvchi loyihasi ham shu tizimda yozilgan. O'rnatish boshlangach, kutmang: katakchani belgilang va Davom bosing.", hl: [2] },
    { id: 'e', key: "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi", text: "Biror narsa boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing: yechimlar oynasi ochiladi, xato va yechimi o'sha yerda. Uchala katakcha belgilanmaguncha va isbot to'g'ri yozilmaguncha Davom tugmasi ochilmaydi. Demak, shu amaliyotdan keyin kompyuteringizda Nest o'rnatilgan va yangi loyiha yaratilmoqda.", hl: [] },
  ],
};
const P0_STEPS = [
  { t: 'Node', cmds: ['node --version'], exp: 'v22 yoki undan yuqori' },
  { t: 'Nest CLI', cmds: ['npm i -g @nestjs/cli@12', 'nest --version'], exp: '12.x.x' },
  { t: "Loyiha — boshlab qo'ying", cmds: ['nest new cars-api -p npm --type cjs --no-observe --skip-skills'], exp: "savol chiqmaydi · o'rnatish 1–3 daqiqa — kutmang, Davom bosing" },
];
const P0_TROUBLE = [
  ['node: 22 dan past', "nodejs.org dan LTS versiyani o'rnating, terminalni qayta oching, 1-qadamni qaytaring"],
  ['nest: command not found', "CLI o'rnatilmagan yoki terminal yangilanmagan: 2-qadamni qaytaring, terminalni qayta oching"],
  ['nest new savol berdi (package manager, module system…)', "Buyruq to'liq nusxalanmagan: Ctrl+C bosing va 3-qadamdagi buyruqni to'liq nusxalab qayta yozing"],
  ["error: unknown option '--type'", "Eski Nest CLI qolgan: 2-qadamdagi buyruqni qaytaring, nest --version 12 ni ko'rsatsin"],
  ['npm install uzoq / xato', "internetni tekshiring; 3-qadamdagi buyruq oxiriga --skip-install qo'shing, keyin papkada npm install"],
];
const P0_PROOF = { label: "Isbot: nest --version nima chiqardi?", placeholder: 'terminalda chiqqan raqamni yozing', check: (v) => /^v?12\./.test(v), wrong: "Kutilgan 12.x.x — buyruqdagi @12 tushib qolgan yoki terminal yangilanmagan" };
function ScreenP0(p) { return <Practice p={p} S={P0} steps={P0_STEPS} trouble={P0_TROUBLE} proof={P0_PROOF} />; }
