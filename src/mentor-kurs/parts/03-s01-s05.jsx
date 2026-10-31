
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
  kicker: 'Kirish', eyebrow: 'Mentor kursi · 1-dars', title: "Siz Express'ni bilasiz. Endi Nest.",
  plan: ['Nega Nest', "Uch bo'lak: Controller · Service · Module", 'Dependency Injection', "cars route'larini quramiz", "Buzamiz va xatoni o'qiymiz", "Amaliyot (to'rt bo'lak)", "O'quvchi darsiga ko'prik"],
  segments: [
    { id: 'a', key: "Express bilimingiz ustiga <b>Nest</b> qo'yamiz: u Express'ni bekor qilmaydi, tartib beradi", text: "Assalomu alaykum. Siz Express bilan server yozgansiz: route ochgansiz, so'rovni qabul qilgansiz, javob qaytargansiz. Bugun shu bilimingiz ustiga NestJS qo'yamiz. Nest Express'ni bekor qilmaydi, aksincha, uning ustiga tartib o'rnatadi.", hl: [] },
    { id: 'b', key: "Dars oxirida bo'sh papkadan <b>ishlaydigan server</b> qurib bo'lasiz", text: "Dars oxirida siz bo'sh papkadan boshlab mashinalar ro'yxatini qaytaradigan server qurasiz.", hl: [3] },
    { id: 'c', key: "Nest xato xabarini <b>o'qiy olasiz</b>: qaysi klass, qaysi dependency yetishmayapti, qaysi fayl", text: "Nest'ning xato xabarlarini o'qiy olasiz: qaysi klassda xato, qaysi dependency yetishmayapti va qaysi faylni ochish kerak.", hl: [4] },
    { id: 'd', key: "O'quvchi darsidagi <b>har so'z</b> nimani anglatishini bilib olasiz", text: "Va o'quvchi darsida qaysi so'z nimani anglatishini bilasiz.", hl: [6] },
    { id: 'e', key: "Yetti bosqich. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi", text: "Dars yetti bosqichdan iborat. Shoshilmang: har ekranda ovozni o'chirish, ekranni boshidan eshitish va to'liq matnini o'qish mumkin. Ustoz gapirib bo'lgach, Davom tugmasi ochiladi. Bosing, boshlaymiz.", hl: [] },
  ],
};
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div className="mk-light"><div className="mk-plan">
    {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
  </div></div>} />;
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
function Screen3(p) {
  const teams = [['routes/', 'controllers/', 'services/'], ['api/', 'handlers/', 'logic/'], ['src/', 'lib/', 'utils/']];
  return <Lesson p={p} S={S3} scene={({ beat }) => (<>
    <Block at={0} beat={beat} dim={beat >= 1}><div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">{t("Express · har jamoa o'zicha", 'Express · каждая команда по-своему')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {teams.map((tm, i) => <div key={i} className="mk-card"><h5>{t(`${i + 1}-jamoa`, `Команда ${i + 1}`)}</h5>{tm.map((f) => <div key={f} className="mk-file" style={{ padding: '2px 0' }}><i style={{ background: T.ink3 }} />{f}</div>)}</div>)}
      </div>
    </div></Block>
    <Block at={1} beat={beat}><div className="mk-light" style={{ padding: 16, border: `2px solid ${beat >= 3 ? T.line : T.accent}`, transition: 'border-color .4s' }}>
      <div className="mk-tag" style={{ color: T.accent }}>{t('NestJS · tartib va nomlar — hamma loyihada bir xil', 'NestJS · порядок и имена — одинаковы в любом проекте')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {[['Controller', PART.ctrl, t("so'rovni qabul qiladi", 'принимает запрос')], ['Service', PART.svc, t('ishni bajaradi', 'выполняет работу')], ['Module', PART.mod, t("ro'yxat: nima bor", 'список: что есть')]].map(([n, c, d], i) => (
          <div key={n} className="mk-box" style={{ '--c': c, animation: beat >= 1 ? `mk-up .45s ${i * 0.18}s ease both` : 'none' }}><h4>{n}</h4><p>{d}</p></div>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: beat >= 3 ? '#FFF0EB' : '#F0F2F5', border: `1px solid ${beat >= 3 ? T.accent : T.line}`, transition: 'all .4s', fontSize: 14 }}>
        <b style={{ color: beat >= 3 ? T.accent : T.ink2 }}>{t('Ichida: Express (platform-express)', 'Внутри: Express (platform-express)')}</b>{beat >= 3 && <span style={{ color: T.ink2 }}>{t(" — so'rovni haqiqatda Express qabul qiladi, Nest yo'naltiradi.", ' — запрос на самом деле принимает Express, Nest его направляет.')}</span>}
      </div>
    </div></Block>
  </>)} />;
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
const DOT_LEFT = { browser: 'calc((100% - 88px) / 6)', ctrl: '50%', svc: 'calc(100% - (100% - 88px) / 6)' };
function Screen5b(p) {
  return <Lesson p={p} S={S5b} scene={({ seg }) => {
    const boxes = seg.boxes;
    const boxStyle = (k, c) => ({ '--c': c, opacity: boxes.includes(k) ? (seg.box && seg.box !== k ? 0.4 : 1) : 0, transform: boxes.includes(k) ? 'none' : 'translateY(10px)' });
    const cls = (k) => `mk-box${seg.box === k ? ' hl' : ''}`;
    // F-1030-24: Explorer yonida brauzer ham «fayllar ichida»dek ko'rinardi — endi fayl nomi qutining o'zida
    const fileTag = (f) => <div style={{ font: `600 11.5px ${MONO}`, color: T.ink3, marginTop: 6 }}>{f}</div>;
    return <div className="mk-light" style={{ padding: 20 }}>
      <div className="mk-tag">{t("So'rov yo'li — brauzerdan fayllarga va qaytib", 'Путь запроса — из браузера к файлам и обратно')}</div>
      <div className="mk-flow">
        <div className={`mk-dot${seg.dot ? ' in' : ''}${seg.reply ? ' back' : ''}`} style={{ left: DOT_LEFT[seg.dot || 'browser'] }} />
        <div className="mk-row">
          <div className={cls('browser')} style={boxStyle('browser', T.ink2)}><h4 style={{ color: T.ink }}>{t('Brauzer', 'Браузер')}</h4><p>GET localhost:3000</p><div style={{ font: `600 11.5px ${SANS}`, color: T.ink3, marginTop: 6 }}>{t('loyihadan tashqarida', 'вне проекта')}</div></div>
          <div className={`mk-arrow${seg.dot === 'ctrl' || seg.dot === 'svc' ? ' on' : ''}${seg.reply ? ' back' : ''}`}>{seg.reply ? '←' : '→'}</div>
          <div className={cls('ctrl')} style={boxStyle('ctrl', PART.ctrl)}><h4>AppController</h4><p>{t("so'rovni qabul qiladi, Service'ni chaqiradi", 'принимает запрос, вызывает Service')}</p>{fileTag('src/app.controller.ts')}</div>
          <div className={`mk-arrow${seg.dot === 'svc' ? ' on' : ''}${seg.reply ? ' back' : ''}`}>{seg.reply ? '←' : '→'}</div>
          <div className={cls('svc')} style={boxStyle('svc', PART.svc)}><h4>AppService</h4><p>{t("ishni bajaradi → 'Hello World!'", "выполняет работу → 'Hello World!'")}</p>{fileTag('src/app.service.ts')}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
          <div className={cls('mod')} style={{ ...boxStyle('mod', PART.mod), minWidth: '62%' }}><h4>AppModule</h4><p><code>controllers: [AppController]</code> · <code>providers: [AppService]</code></p>{fileTag('src/app.module.ts')}</div>
        </div>
      </div>
    </div>;
  }} />;
}

// --- Amaliyot 1/4: Nest'ni o'rnating, nest new ni boshlab qo'ying (o'rnatilguncha dars davom etadi) ---
const P0 = {
  kicker: 'Amaliyot 1 / 4', eyebrow: "Hozir o'zingizda · 3–5 daqiqa (o'rnatish fonda)", title: "Nest'ni o'rnating, loyihani boshlab qo'ying", tableAt: 4,
  segments: [
    { id: 'a', key: "Endi <b>siz</b>: Nest'ni o'rnatib, loyihani yaratishni boshlab qo'yasiz", text: "Endi navbat sizga. Hozirgina ko'rgan loyihani o'zingizda yaratib qo'yasiz: uchta qadam. O'rnatish bir-uch daqiqa oladi, kutmaysiz, Davom bosib darsni davom ettirasiz, loyiha fonda o'rnatiladi.", hl: [] },
    { id: 'b', key: "1-qadam: Node versiyasi <b>20 yoki undan yuqori</b> bo'lishi shart", text: "Birinchi: node versiyasini tekshiring. Nest o'n birinchi versiya Node yigirma yoki undan yuqorisini talab qiladi. Past bo'lsa, jadvaldagi yo'l bilan yangilang.", hl: [0] },
    { id: 'c', key: "2-qadam: <b>Nest CLI</b>'ni o'rnating, versiyasini isbot maydoniga yozing", text: "Ikkinchi: Nest CLI'ni global o'rnating va versiyasini tekshiring. Chiqqan raqamni pastdagi isbot maydoniga yozing.", hl: [1] },
    { id: 'd', key: "3-qadam: <code>nest new cars-api</code> — o'rnatish fonda, kutmasdan davom eting", text: "Uchinchi: nest new cars-api. Paket menejeri so'ralsa npm'ni tanlang. O'rnatish boshlangach, kutmang: katakchani belgilang va Davom bosing.", hl: [2] },
    { id: 'e', key: "Boshqacha chiqsa — pastdagi <b>«Boshqacha chiqdimi?»</b> tugmasi; katakcha va isbotsiz Davom ochilmaydi", text: "Biror narsa boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing: xato va yechimi o'sha yerda. Uchala katakcha belgilanmaguncha va isbot to'g'ri yozilmaguncha Davom tugmasi ochilmaydi.", hl: [] },
  ],
};
const P0_STEPS = [
  { t: 'Node', cmds: ['node --version'], exp: 'v20 yoki undan yuqori (Nest 11 talabi)' },
  { t: 'Nest CLI', cmds: ['npm i -g @nestjs/cli', 'nest --version'], exp: '11.x.x' },
  { t: "Loyiha — boshlab qo'ying", cmds: ['nest new cars-api'], exp: "paket menejeri: npm · o'rnatish 1–3 daqiqa — kutmang, Davom bosing" },
];
const P0_TROUBLE = [
  ['node: v18 yoki past', "nodejs.org dan LTS (20+) o'rnating, terminalni qayta oching, node --version ni qaytaring"],
  ['nest: command not found', "CLI o'rnatilmagan yoki terminal yangilanmagan: 2-qadamni qaytaring, terminalni qayta oching"],
  ['npm install uzoq / xato', "internetni tekshiring; nest new --skip-install, keyin papkada npm install"],
];
const P0_PROOF = { label: "Isbot: nest --version nima chiqardi?", placeholder: 'terminalda chiqqan raqamni yozing', check: (v) => /^v?11\./.test(v), wrong: "Kutilgan 11.x.x — CLI o'rnatilmagan yoki eski versiya" };
function ScreenP0(p) { return <Practice p={p} S={P0} steps={P0_STEPS} trouble={P0_TROUBLE} proof={P0_PROOF} />; }
