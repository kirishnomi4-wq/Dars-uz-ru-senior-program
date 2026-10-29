
// ============================================================
//  1–2-BOSQICH · S1–S5b
//  Ovoz qoidasi: kod o'qilmaydi, nima bo'layotgani aytiladi; «/» va «@» so'z bilan.
// ============================================================
const S1 = {
  kicker: 'Kirish', eyebrow: 'Mentor kursi · 1-dars', title: "Siz Express'ni bilasiz. Endi Nest.",
  plan: ['Nega Nest', "Uch bo'lak: Controller · Service · Module", 'Dependency Injection', 'cars manzilini quramiz', "Buzamiz va xatoni o'qiymiz", "Amaliyot (to'rt bo'lak)", "O'quvchi darsiga ko'prik"],
  segments: [
    { id: 'a', key: "Express bilimingiz ustiga <b>Nest</b> qo'yamiz", text: "Assalomu alaykum. Siz Express bilan server yozgansiz: marshrut ochgansiz, so'rovni qabul qilgansiz, javob qaytargansiz. Bugun shu bilimingiz ustiga NestJS qo'yamiz. Nest Express'ni bekor qilmaydi, aksincha, uning ustiga tartib o'rnatadi.", hl: [] },
    { id: 'b', key: "Dars oxirida: <b>ishlaydigan server</b>", text: "Dars oxirida siz bo'sh papkadan boshlab mashinalar ro'yxatini qaytaradigan server qurasiz.", hl: [3] },
    { id: 'c', key: "Nest xatolarini <b>o'qiy olasiz</b>", text: "Nest'ning xato xabarlarini o'qiy olasiz: kim, nima yetishmayapti, qayerda.", hl: [4] },
    { id: 'd', key: "O'quvchi darsining <b>tilini</b> bilasiz", text: "Va o'quvchi darsida qaysi so'z nimani anglatishini bilasiz.", hl: [6] },
    { id: 'e', key: "Yetti bosqich. Shoshilmang.", text: "Dars yetti bosqichdan iborat. Shoshilmang: har ekranda ovozni to'xtatish, qaytarish va matnini o'qish mumkin. Tayyor bo'lsangiz, Davom tugmasini bosing.", hl: [] },
  ],
};
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div className="mk-light"><div className="mk-plan">
    {S1.plan.map((t, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{t}</span></div>)}
  </div></div>} />;
}

// --- S2 Express: 38 qator → o'sgan loyiha (misol) ---
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
    { id: 'a', key: "Tanish fayl: <code>server.js</code>", text: "Mana sizga tanish fayl. Express, bitta server js.", focus: [] },
    { id: 'b', key: "Ro'yxat: <b>GET /cars</b>", text: "cars manziliga GET kelsa, ro'yxatni qaytaramiz.", show: "<code>/cars</code> manziliga GET kelsa, ro'yxatni qaytaramiz.", focus: ['route1'] },
    { id: 'c', key: "Bittasi: <b>GET /cars/:id</b>", text: "cars manzilidan keyin id kelsa, bittasini qidiramiz.", show: "<code>/cars/:id</code> kelsa, bittasini qidiramiz.", focus: ['route2'] },
    { id: 'd', key: "Yangisi: <b>POST /cars</b>. 38 qator, muammo yo'q", text: "POST kelsa, yangisini qo'shamiz. Hammasi o'ttiz sakkiz qator, hammasi ko'z oldingizda. Bu bosqichda hech qanday muammo yo'q.", show: "<code>POST /cars</code> kelsa, yangisini qo'shamiz. Hammasi 38 qator, hammasi ko'z oldingizda. Bu bosqichda hech qanday muammo yo'q.", focus: ['route3'] },
    { id: 'e', key: "Loyiha o'sdi: <b>1240 qator</b> (shartli misol). Login qayerda?", text: "Muammo loyiha o'sganda boshlanadi. Foydalanuvchilar qo'shildi, kirish va ro'yxatdan o'tish qo'shildi, buyurtmalar, to'lov, fayl yuklash. Mana shartli misol, haqiqiy loyiha emas: fayl ming ikki yuz qirq qator deylik. Login qayerda edi? Qidirasiz.", show: "Muammo loyiha o'sganda boshlanadi. Foydalanuvchilar, kirish, buyurtmalar, to'lov, fayl yuklash. Mana <b>shartli misol</b> (haqiqiy loyiha emas): fayl <b>1240 qator</b>. Login qayerda edi? Qidirasiz.", focus: ['login'], grow: true },
    { id: 'f', key: "Sinab bo'lmaydi, to'qnashuv. <b>Nest shu og'riq uchun</b>", text: "Bitta marshrut ichida ham so'rovni o'qish, ham tekshirish, ham bazaga yozish bor. Shu bo'lakni alohida sinab bo'lmaydi, chunki u marshrutdan ajralmagan. Ikki kishi bir faylda ishlasa, har kuni to'qnashuv. Siz buni his qilgansiz. Nest aynan shu og'riq uchun yaratilgan. O'quvchi darsi ham aynan shu misoldan boshlanadi.", focus: [], grow: true },
  ],
};
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => {
    const grown = !!seg.grow;
    const lines = grown ? [...EXPRESS_LINES.slice(0, 6).map((l) => ({ ...l, id: null })), { n: '…', h: `<span class="cm">// … 200 qator</span>` }, ...GROWN_LINES] : EXPRESS_LINES;
    return <CodePanel key={grown ? 'g' : 'n'} file={grown ? "server.js · 1240 qator (shartli misol, haqiqiy loyiha emas)" : 'server.js · 38 qator'} lines={lines} focus={seg.focus} />;
  }} />;
}

// --- S3 Nest nima beradi ---
const S3 = {
  kicker: '1-bosqich · Nega Nest', title: 'Nest nima beradi: majburiy tartib',
  segments: [
    { id: 'a', key: "Express'da har jamoa <b>o'zicha</b> bo'ladi", text: "Tajribali Express dasturchi ham faylni bo'ladi: marshrutlar papkasi, kontrollerlar papkasi, servislar papkasi. Lekin har jamoa buni o'zicha qiladi, yangi odam kelganda tartibni qaytadan o'rganadi.", show: "Tajribali Express dasturchi ham faylni bo'ladi: <code>routes/</code>, <code>controllers/</code>, <code>services/</code>. Lekin har jamoa buni o'zicha qiladi, yangi odam kelganda tartibni qaytadan o'rganadi." },
    { id: 'b', key: "Nest: tartib <b>majburiy va bir xil</b>", text: "Nest shu tartibni majburiy va bir xil qiladi. U uchta bo'lakka nom beradi: Controller, Service, Module." },
    { id: 'c', key: "Toshkent yozdi, Berlin bir daqiqada tushundi", text: "Har Nest loyihasida ular bir xil joyda, bir xil nomda turadi. Shuning uchun Toshkentdagi jamoa yozgan loyihani Berlindagi dasturchi ochsa, qayerda nima turganini bir daqiqada topadi." },
    { id: 'd', key: "Ichida <b>o'sha Express</b> ishlaydi", text: "Yana bir muhim fakt: Nest ichida o'sha Express ishlaydi. So'rovni haqiqatda Express qabul qiladi, Nest esa uni to'g'ri bo'lakka yo'naltiradi. Demak siz bilgan hech narsa bekor bo'lmaydi." },
  ],
};
function Screen3(p) {
  const teams = [['routes/', 'controllers/', 'services/'], ['api/', 'handlers/', 'logic/'], ['src/', 'lib/', 'utils/']];
  return <Lesson p={p} S={S3} scene={({ beat }) => (<>
    <Block at={0} beat={beat} dim={beat >= 1}><div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">Express · har jamoa o'zicha</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {teams.map((t, i) => <div key={i} className="mk-card"><h5>{i + 1}-jamoa</h5>{t.map((f) => <div key={f} className="mk-file" style={{ padding: '2px 0' }}><i style={{ background: T.ink3 }} />{f}</div>)}</div>)}
      </div>
    </div></Block>
    <Block at={1} beat={beat}><div className="mk-light" style={{ padding: 16, border: `2px solid ${beat >= 3 ? T.line : T.accent}`, transition: 'border-color .4s' }}>
      <div className="mk-tag" style={{ color: T.accent }}>NestJS · tartib va nomlar — hamma loyihada bir xil</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {[['Controller', PART.ctrl, "so'rovni qabul qiladi"], ['Service', PART.svc, 'ishni bajaradi'], ['Module', PART.mod, "ro'yxat: nima bor"]].map(([n, c, d], i) => (
          <div key={n} className="mk-box" style={{ '--c': c, animation: beat >= 1 ? `mk-up .45s ${i * 0.18}s ease both` : 'none' }}><h4>{n}</h4><p>{d}</p></div>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: beat >= 3 ? '#FFF0EB' : '#F0F2F5', border: `1px solid ${beat >= 3 ? T.accent : T.line}`, transition: 'all .4s', fontSize: 14 }}>
        <b style={{ color: beat >= 3 ? T.accent : T.ink2 }}>Ichida: Express (platform-express)</b>{beat >= 3 && <span style={{ color: T.ink2 }}> — so'rovni haqiqatda Express qabul qiladi, Nest yo'naltiradi.</span>}
      </div>
    </div></Block>
  </>)} />;
}

// --- S4 TypeScript va dekorator ---
const DECO_LINES = [
  { id: 'l-ctrl', h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` },
  { id: 'l-class', h: `<span class="k">export class</span> <span class="c">CarsController</span> {` },
  { id: 'l-get', h: `  <span class="d">@Get</span>()` },
  { id: 'l-get', h: `  <span class="c">findAll</span>() { <span class="cm">/* … */</span> }` },
  { h: `}` },
];
const S4 = {
  kicker: '1-bosqich · Nega Nest', title: 'TypeScript va dekorator: @ belgisi',
  segments: [
    { id: 'a', key: "TypeScript = JavaScript + <b>tiplar</b>", text: "Nest loyihalari TypeScript'da yoziladi. TypeScript bu JavaScript'ning o'zi, faqat tiplari bor: string, number va shunga o'xshash. Siz JavaScript bilsangiz, TypeScript'ni o'qiy olasiz.", focus: [] },
    { id: 'b', key: "Yangi narsa: <b>@ belgili satr = dekorator</b>", text: "Lekin bitta yangi narsa bor, u bilan ko'p uchrashasiz: et belgisi bilan boshlanadigan satrlar. Masalan, Controller dekoratori, qavsda cars. Bu dekorator deyiladi.", show: "Lekin bitta yangi narsa bor, u bilan ko'p uchrashasiz: <b>@</b> belgisi bilan boshlanadigan satrlar. Masalan, <code>@Controller('cars')</code>. Bu <b>dekorator</b> (decorator) deyiladi.", focus: ['l-ctrl'] },
    { id: 'c', key: "Dekorator Nest'ga aytadi: <b>«bu nima»</b>", text: "Dekorator klass yoki metodning tepasiga yoziladi va Nest'ga xabar beradi: bu klass Controller, uning manzili cars. Get dekoratori esa metod ustida turadi: GET so'rov kelsa, shu metod.", show: "Dekorator klass yoki metodning tepasiga yoziladi va Nest'ga xabar beradi: «bu klass Controller, uning manzili cars». <code>@Get</code> esa metod ustida turadi: «GET so'rov kelsa, shu metod».", focus: ['l-get'] },
    { id: 'd', key: "Belgi yo'q — Nest <b>tanimaydi</b>", text: "Dekorator kodni bajarmaydi, u belgi qo'yadi. Nest ishga tushganda shu belgilarni o'qib, hamma bo'lakni joyiga qo'yadi. Shuni eslab qoling: dekorator yo'q bo'lsa, Nest o'sha klassni tanimaydi. Buni keyinroq ataylab buzib ham ko'rsatamiz.", focus: [] },
  ],
};
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg, beat }) => (<>
    <Block at={0} beat={beat}><div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
      <span className="mk-card" style={{ fontSize: 13 }}><b>JavaScript</b> → <code>let price = 250</code></span>
      <span className="mk-card" style={{ fontSize: 13 }}><b>TypeScript</b> → <code>let price: number = 250</code></span>
    </div></Block>
    <CodePanel file="cars.controller.ts" lines={DECO_LINES} focus={seg.focus} style={{ fontSize: 15 }} />
    <Block at={3} beat={beat}><div className="mk-rule"><b>Dekorator</b> (decorator) — klass yoki metod ustidagi <b>@</b> belgi. Kod bajarmaydi, Nest'ga «bu nima» deb aytadi. Belgi yo'q — Nest klassni tanimaydi.</div></Block>
  </>)} />;
}

// --- S5a Fayllar ---
const FILES5 = [
  { n: 'src/main.ts', k: 'main', c: T.ink2, d: 'ilovani ishga tushiradi' },
  { n: 'src/app.module.ts', k: 'module', c: PART.mod, d: "ro'yxat" },
  { n: 'src/app.controller.ts', k: 'controller', c: PART.ctrl, d: "so'rovni qabul qiladi" },
  { n: 'src/app.service.ts', k: 'service', c: PART.svc, d: 'ishni bajaradi' },
  { n: 'src/app.controller.spec.ts', k: 'spec', c: T.ink3, d: 'test (Jest darsida)' },
];
const S5a = {
  kicker: "2-bosqich · Uch bo'lak", title: 'Tirik loyiha: nest new nimani yaratdi',
  segments: [
    { id: 'a', key: "<code>nest new cars-api</code> — fayllar", text: "Endi haqiqiy loyihaga qaraymiz. nest new cars-api buyrug'i mana shu fayllarni yaratdi. src papkasida to'rtta asosiy fayl bor.", hl: [] },
    { id: 'b', key: "<b>main</b> — ishga tushiradi", text: "main ts: ilovani ishga tushiradi, boshqa hech narsa qilmaydi.", hl: ['main'] },
    { id: 'c', key: "<b>app.module</b> — ro'yxat", text: "app module ts: ro'yxat. Nest shu ro'yxatga qarab hamma narsani yig'adi.", hl: ['module'] },
    { id: 'd', key: "<b>app.controller</b> — so'rovni qabul qiladi", text: "app controller ts: so'rovni qabul qiladi.", hl: ['controller'] },
    { id: 'e', key: "<b>app.service</b> — ishni bajaradi", text: "app service ts: ishni bajaradi. Beshinchi fayl, spec, bu test, unga Jest darsida qaytamiz.", hl: ['service', 'spec'] },
    { id: 'f', key: "Uch rang — <b>uch bo'lak</b>, dars bo'yi", text: "Uchta rangni eslab qoling: ko'k Controller, yashil Service, sariq Module. Dars davomida shu uch rang bilan yuramiz. Keyingi ekranda siz ham shu loyihani o'zingizda yaratib qo'yasiz, o'rnatilguncha dars davom etadi.", hl: [] },
  ],
};
function Screen5a(p) {
  return <Lesson p={p} S={S5a} scene={({ seg }) => <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">cars-api / src</div>
    <div style={{ display: 'grid', gap: 8 }}>
      {FILES5.map((f, i) => <div key={f.k} className="mk-step" style={{ borderColor: seg.hl.includes(f.k) ? f.c : T.line, boxShadow: seg.hl.includes(f.k) ? `0 0 0 3px rgba(226,69,31,.12)` : 'none', opacity: seg.hl.length && !seg.hl.includes(f.k) ? 0.45 : 1, animation: `mk-up .4s ${i * 0.1}s ease both` }}>
        <i style={{ width: 10, height: 10, borderRadius: 3, background: f.c, marginTop: 6, flex: '0 0 auto' }} />
        <div className="t"><b style={{ fontFamily: MONO, fontSize: 13 }}>{f.n}</b><div className="exp">{f.d}</div></div>
      </div>)}
    </div>
  </div>} />;
}

// --- S5b So'rov yo'li ---
const S5b = {
  kicker: "2-bosqich · Uch bo'lak", title: "Bitta so'rovning yo'li",
  segments: [
    { id: 'a', key: "Brauzer: <code>localhost:3000</code>", text: "Bitta so'rovning yo'lini kuzataylik. Brauzer localhost uch ming manziliga keldi.", dot: 'browser', boxes: ['browser'] },
    { id: 'b', key: "<b>Controller</b> qabul qildi", text: "So'rovni AppController qabul qildi, chunki unda GET uchun metod bor.", dot: 'ctrl', boxes: ['browser', 'ctrl'], box: 'ctrl' },
    { id: 'c', key: "Controller <b>Service'dan so'raydi</b>", text: "Controller o'zi javob o'ylab topmaydi, u AppService'dan so'raydi. Service Hello World matnini qaytaradi.", dot: 'svc', boxes: ['browser', 'ctrl', 'svc'], box: 'svc' },
    { id: 'd', key: "Javob <b>brauzerga qaytdi</b>", text: "Controller shu matnni brauzerga yuboradi.", dot: 'browser', boxes: ['browser', 'ctrl', 'svc'], box: 'ctrl', reply: true },
    { id: 'e', key: "<b>Module</b> ikkalasini ro'yxatda ushlaydi", text: "AppModule esa bu ikkalasini bitta ro'yxatda ushlab turadi, Nest shu ro'yxatga qarab ularni yig'adi.", dot: null, boxes: ['browser', 'ctrl', 'svc', 'mod'], box: 'mod' },
    { id: 'f', key: "So'rov → Controller → Service → javob", text: "Mana shu yo'lni, so'rov, Controller, Service, javob, dars davomida ko'p marta ko'rasiz. Keyingi uch ekranda har faylni ochib o'qiymiz.", dot: null, boxes: ['browser', 'ctrl', 'svc', 'mod'] },
  ],
};
const DOT_LEFT = { browser: 'calc((100% - 88px) / 6)', ctrl: '50%', svc: 'calc(100% - (100% - 88px) / 6)' };
function Screen5b(p) {
  return <Lesson p={p} S={S5b} scene={({ seg }) => {
    const boxes = seg.boxes;
    const boxStyle = (k, c) => ({ '--c': c, opacity: boxes.includes(k) ? (seg.box && seg.box !== k ? 0.4 : 1) : 0, transform: boxes.includes(k) ? 'none' : 'translateY(10px)' });
    const cls = (k) => `mk-box${seg.box === k ? ' hl' : ''}`;
    return <div className="mk-light" style={{ padding: 20 }}>
      <div className="mk-tag">So'rov yo'li</div>
      <div className="mk-flow">
        <div className={`mk-dot${seg.dot ? ' in' : ''}${seg.reply ? ' back' : ''}`} style={{ left: DOT_LEFT[seg.dot || 'browser'] }} />
        <div className="mk-row">
          <div className={cls('browser')} style={boxStyle('browser', T.ink2)}><h4 style={{ color: T.ink }}>Brauzer</h4><p>GET localhost:3000</p></div>
          <div className={`mk-arrow${seg.dot === 'ctrl' || seg.dot === 'svc' ? ' on' : ''}${seg.reply ? ' back' : ''}`}>{seg.reply ? '←' : '→'}</div>
          <div className={cls('ctrl')} style={boxStyle('ctrl', PART.ctrl)}><h4>AppController</h4><p>so'rovni qabul qiladi, Service'ni chaqiradi</p></div>
          <div className={`mk-arrow${seg.dot === 'svc' ? ' on' : ''}${seg.reply ? ' back' : ''}`}>{seg.reply ? '←' : '→'}</div>
          <div className={cls('svc')} style={boxStyle('svc', PART.svc)}><h4>AppService</h4><p>ishni bajaradi → 'Hello World!'</p></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
          <div className={cls('mod')} style={{ ...boxStyle('mod', PART.mod), minWidth: '62%' }}><h4>AppModule</h4><p><code>controllers: [AppController]</code> · <code>providers: [AppService]</code></p></div>
        </div>
      </div>
    </div>;
  }} />;
}

// --- Amaliyot 1/4: Nest'ni o'rnating, nest new ni boshlab qo'ying (o'rnatilguncha dars davom etadi) ---
const P0 = {
  kicker: 'Amaliyot 1 / 4', eyebrow: "Hozir o'zingizda · 3–5 daqiqa (o'rnatish fonda)", title: "Nest'ni o'rnating, loyihani boshlab qo'ying", tableAt: 4,
  segments: [
    { id: 'a', key: "Endi <b>siz</b>: o'rnatib, nest new ni boshlab qo'yasiz", text: "Endi navbat sizga. Hozirgina ko'rgan loyihani o'zingizda yaratib qo'yasiz: uchta qadam. O'rnatish bir-uch daqiqa oladi, kutmaysiz, Davom bosib darsni davom ettirasiz, loyiha fonda o'rnatiladi.", hl: [] },
    { id: 'b', key: "1 · Node <b>20 yoki yuqori</b>", text: "Birinchi: node versiyasini tekshiring. Nest o'n birinchi versiya Node yigirma yoki undan yuqorisini talab qiladi. Past bo'lsa, jadvaldagi yo'l bilan yangilang.", hl: [0] },
    { id: 'c', key: "2 · Nest CLI: <code>npm i -g @nestjs/cli</code>", text: "Ikkinchi: Nest CLI'ni global o'rnating va versiyasini tekshiring. Chiqqan raqamni pastdagi isbot maydoniga yozing.", hl: [1] },
    { id: 'd', key: "3 · <code>nest new cars-api</code> — boshlab qo'ying", text: "Uchinchi: nest new cars-api. Paket menejeri so'ralsa npm'ni tanlang. O'rnatish boshlangach, kutmang: katakchani belgilang va Davom bosing.", hl: [2] },
    { id: 'e', key: "Boshqacha chiqdimi — jadval", text: "Biror narsa boshqacha chiqsa, pastdagi jadvalga qarang. Uchala katakcha va isbot to'ldirilgach, davom eting.", hl: [] },
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
const P0_PROOF = { label: "Isbot: nest --version nima chiqardi?", placeholder: '11.0.10', check: (v) => /^v?11\./.test(v), wrong: "Kutilgan 11.x.x — CLI o'rnatilmagan yoki eski versiya" };
function ScreenP0(p) { return <Practice p={p} S={P0} steps={P0_STEPS} trouble={P0_TROUBLE} proof={P0_PROOF} />; }
