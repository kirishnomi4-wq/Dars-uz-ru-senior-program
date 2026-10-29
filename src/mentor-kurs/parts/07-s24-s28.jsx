
// ============================================================
//  7-BOSQICH · ko'prik (2), o'tish rejasi (3), savollar, o'z-sinov, yakun + ILDIZ
// ============================================================
const TREE = [
  { t: 'IntroNestArxitechture/', f: true }, { t: '  src/main.ts', g: 'g' },
  { t: '  src/api/', f: true }, { t: '    app.module.ts', g: 'g' }, { t: '    admin/admin.module.ts', g: 'g' }, { t: '    admin/admin.controller.ts', g: 'g' }, { t: '    admin/admin.service.ts', g: 'g' }, { t: '    admin/dto/create-admin.dto.ts', g: 'y' }, { t: '    auth/ (kirish)', g: 'r' },
  { t: '  src/core/', f: true }, { t: '    entity/admin.entity.ts', g: 'y' }, { t: '    repository/admin.repository.ts', g: 'y' },
  { t: '  src/common/', f: true }, { t: '    guard/auth.guard.ts', g: 'r' }, { t: '    guard/roles.guard.ts', g: 'r' }, { t: '    decorator/', g: 'r' },
  { t: '  src/infrastructure/', f: true }, { t: '    lib/BaseService.ts', g: 'r' }, { t: '    lib/token/Token.ts', g: 'r' }, { t: '    response/successRes.ts', g: 'r' }, { t: '    pagination/', g: 'r' },
];
const S25a = {
  kicker: "7-bosqich · ko'prik", title: "O'quvchi clone qiladigan loyiha",
  segments: [
    { id: 'a', key: "O'quvchi <b>noldan yozmaydi</b>: tayyor loyihani clone qiladi", text: "Endi o'quvchi darsiga qaraymiz, chunki u bu mavzuni boshqacha ko'radi. O'quvchi noldan yozmaydi: GitHub'dan tayyor loyihani clone qiladi, IntroNestArxitechture, va uni ishga tushiradi.", lit: null },
    { id: 'b', key: "Kattaroq: <code>api</code> · <code>core</code> · <code>common</code> · <code>infrastructure</code>", text: "Loyiha kattaroq: api, core, common, infrastructure papkalari.", lit: 'f' },
    { id: 'c', key: "<b>Yashil</b> — bugun to'liq bilasiz", text: "Yashil belgilangan joylarni siz bugun to'liq bilasiz: admin module, admin controller, admin service, main. Ular aynan bizning cars fayllarimiz, faqat admin uchun va kattaroq.", lit: 'g' },
    { id: 'd', key: "<b>Sariq</b> — keyingi dars: entity, dto, repository", text: "Sariq joylar keyingi darsda: entity, bu bazadagi jadval shakli; dto, kiruvchi ma'lumot shakli; repository, baza bilan gaplashuvchi.", lit: 'y' },
    { id: 'e', key: "<b>Kulrang</b> — keyinroq: auth, guard, BaseService, token, javob shakli", text: "Kulrang joylar undan keyin: auth moduli, guard, BaseService, token, bir xil javob shakli. Bu fayllarning kodini bu darsda ko'rmaysiz, bu ataylab. O'quvchi ularni so'rasa, javob: nom va vazifa, kod keyingi darslarda. Hozir faqat qayerda turganini biling.", show: "Kulrang joylar undan keyin: auth, guard, BaseService, token, bir xil javob shakli. Bu fayllarning kodini bu darsda ko'rmaysiz — ataylab. O'quvchi so'rasa: <b>nom va vazifa, kod keyingi darslarda</b>.", lit: 'r' },
  ],
};
function Screen25a(p) {
  return <Lesson p={p} S={S25a} scene={({ seg, beat }) => {
    const lit = (g) => (g === 'g' && beat >= 2) || (g === 'y' && beat >= 3) || (g === 'r' && beat >= 4);
    return <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">github.com/Azizbekcrypto/IntroNestArxitechture</div>
      <div className="mk-tree" style={{ fontSize: 13.5 }}>{TREE.map((n, i) => <div key={i} className={n.f ? (beat >= 1 ? 'f' : '') : (n.g && lit(n.g) ? n.g : '')} style={{ opacity: beat >= 1 || n.f ? 1 : 0.6, outline: seg.lit && n.g === seg.lit && lit(n.g) ? `2px solid ${T.accent}` : 'none', outlineOffset: -2 }}>{n.t}</div>)}</div>
      <div style={{ display: 'flex', gap: 10, marginTop: 10, fontSize: 12 }}><span className="mk-tree"><span className="g" style={{ padding: '1px 6px' }}>bugun</span></span><span className="mk-tree"><span className="y" style={{ padding: '1px 6px' }}>keyingi dars</span></span><span className="mk-tree"><span className="r" style={{ padding: '1px 6px' }}>keyinroq</span></span></div>
    </div>;
  }} />;
}

const DICT = [['ofitsiant', 'Controller', "so'rovni oladi, oshxonaga uzatadi"], ['oshpaz', 'Service', 'ishni bajaradi'], ['omborchi', 'Repository', 'baza bilan gaplashadi'], ['javon chizmasi', 'Entity', 'jadval shakli'], ['buyurtma anketasi', 'DTO', "kiruvchi ma'lumot shakli"], ['nazoratchi', 'Guard', 'tokenni tekshiradi'], ['bir xil lagan', 'successRes', 'javob shakli'], ['shtat jadvali', 'Module', "ro'yxat"]];
const S25b = {
  kicker: "7-bosqich · ko'prik", title: "O'quvchi darsining tili: restoran",
  segments: [
    { id: 'a', key: "O'quvchi darsi <b>restoran tilida</b> gapiradi", text: "O'quvchi darsi restoran tilida gapiradi: Controller ofitsiant, Service oshpaz, Repository omborchi, Guard nazoratchi, Module shtat jadvali. O'quvchi shu so'zlarda o'ylaydi.", n: 8 },
    { id: 'b', key: "«oshpaz» desa — siz <b>Service</b> ekanini bilasiz", text: "Siz endi ikkala tilni bilasiz: o'quvchi oshpaz desa, siz Service ekanini bilasiz va to'g'ri faylni ko'rsatasiz. Darsda ikkala so'zni birga ayting: oshpaz, ya'ni Service.", n: 8 },
    { id: 'c', key: "Metafora chegarasi: <b>vazifa</b> o'xshaydi, kod emas", text: "Bitta ogohlantirish: metafora vazifani tushuntiradi, kodni emas. O'quvchi ofitsiant oshxonaga kirmaydi deganda, Controller Service'ni chaqiradi, lekin ichida hisob qilmaydi degan ma'noni tushunsin. Shu chegarani siz ushlab turasiz.", n: 8 },
  ],
};
function Screen25b(p) {
  return <Lesson p={p} S={S25b} scene={({ beat }) => <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">O'quvchi eshitadi → atama → vazifa</div>
    <table className="mk-tbl"><thead><tr><th>o'quvchi darsida</th><th>atama</th><th>vazifa</th></tr></thead><tbody>
      {DICT.map(([a, b, c], i) => <tr key={a} style={{ animation: `mk-up .35s ${i * 0.08}s ease both` }}><td>{a}</td><td><code>{b}</code></td><td style={{ color: T.ink2 }}>{c}</td></tr>)}
    </tbody></table>
    <Block at={2} beat={beat}><div className="mk-rule" style={{ marginTop: 12 }}>Ikkala so'zni birga ayting: <b>«oshpaz, ya'ni Service»</b>. Metafora vazifani tushuntiradi, kodni emas.</div></Block>
  </div>} />;
}

// --- O'tish rejasi 1: o'quvchi darsining xaritasi (m4a-01, 22 ekran) ---
const MAP = [
  { t: 'Kirish', s: 's0–s1', d: "1240 qatorli server.js og'rig'i → «tayyor loyihani clone qilamiz», 4 qadam rejasi", m: "Siz buni shu darsning 2-ekranida ko'rdingiz: o'quvchi ham aynan shu og'riqdan boshlaydi. Nest nomini erta aytmang, avval og'riq." },
  { t: 'Clone va ishga tushirish', s: 's2–s4', d: "git clone + npm install, .env to'ldirish, start:dev; test: kalit qayerda turadi", m: "Eng ko'p vaqt shu yerda ketadi. Hammaning serveri ishlamaguncha oldinga o'tmang." },
  { t: 'Swagger va bino xaritasi', s: 's5–s8', d: 'Swagger eshiklari (endpointlar), papkalar daraxti; test: Controller vazifasi', m: "«Ofitsiant» so'zi shu yerda kiradi. Daraxtda yashil fayllarni (module/controller/service) o'zingiz ko'rsating." },
  { t: "Buyurtma yo'li", s: 's9–s10', d: 'Guard → Controller → Service → Repository → successRes tartibi sudrab teriladi; test', m: "Bu bizning «so'rov yo'li» ekranimiz, faqat ikki bekat ko'p: Guard va Repository. Nega ko'p — keyingi dars deb ayting." },
  { t: 'Qatlamlar', s: 's11–s16', d: 'Entity/BaseEntity, DTO (201/400), BaseService (CRUD tayyor), Module (smena), 5 qadam tartibi; test', m: "Chuqur emas: nom va vazifa. Entity va DTO keyingi darsda qo'l bilan yoziladi." },
  { t: 'Qurish va yakun', s: 's18–s20', d: "AI 5 faylni yozadi, yakuniy debugging (xato qatorni olib tashlash), amaliy topshiriq, arena, kartochkalar", m: "Debugging ekranida siz bugun o'rgangan qoida ishlaydi: Controller'da hisob bo'lmaydi." },
];
const R1 = {
  kicker: "7-bosqich · o'tish rejasi", eyebrow: "m4a-01 · «Nest arxitektura — tirik ko'rish»", title: "O'quvchi darsining xaritasi: 6 blok, 22 ekran",
  segments: [
    { id: 'a', key: "O'quvchi darsi: <b>6 blok, 22 ekran</b>", text: "Endi o'quvchi darsini o'zini ko'ramiz, chunki siz uni o'tasiz. Yigirma ikki ekran, oltita blok. Har blok uchun o'quvchi nima qiladi va siz nima deysiz.", hl: [] },
    { id: 'b', key: "1 · Kirish: <b>o'sha og'riq</b>", text: "Birinchi blok, kirish: o'quvchi ming ikki yuz qirq qatorli faylni ko'radi va tayyor loyihani clone qilish rejasini oladi. Siz buni shu darsning boshida ko'rdingiz. Nest nomini erta aytmang, avval og'riq.", hl: [0] },
    { id: 'c', key: "2 · Clone va ishga tushirish: <b>eng ko'p vaqt</b>", text: "Ikkinchi blok, clone va ishga tushirish: git clone, npm install, env fayli, start dev. Eng ko'p vaqt shu yerda ketadi. Hammaning serveri ishlamaguncha oldinga o'tmang.", hl: [1] },
    { id: 'd', key: "3 · Swagger va bino xaritasi: <b>«ofitsiant» kiradi</b>", text: "Uchinchi blok: Swagger'da eshiklarni ko'radi, keyin papkalar daraxtini. Ofitsiant so'zi shu yerda kiradi. Daraxtda module, controller, service fayllarini o'zingiz ko'rsating.", hl: [2] },
    { id: 'e', key: "4 · Buyurtma yo'li: <b>bizning so'rov yo'li + 2 bekat</b>", text: "To'rtinchi blok, buyurtma yo'li: o'quvchi nazoratchi, ofitsiant, oshpaz, omborchi, lagan tartibini sudrab teradi. Bu bizning so'rov yo'li ekranimiz, faqat ikki bekat ko'p: Guard va Repository. Nega ko'p, keyingi dars deb ayting.", hl: [3] },
    { id: 'f', key: "5 · Qatlamlar: <b>nom va vazifa</b>, chuqur emas", text: "Beshinchi blok, qatlamlar: Entity, DTO, BaseService, Module va besh qadam tartibi. Chuqur emas: nom va vazifa. Entity va DTO keyingi darsda qo'l bilan yoziladi.", hl: [4] },
    { id: 'g', key: "6 · Qurish va yakun: <b>debugging'da bugungi qoida</b>", text: "Oltinchi blok: o'quvchi AI'ga beshta faylni yozdiradi, keyin yakuniy debugging, xato qatorni topib olib tashlaydi, so'ng amaliy topshiriq va arena. Debugging ekranida siz bugun o'rgangan qoida ishlaydi: Controller'da hisob bo'lmaydi.", hl: [5] },
  ],
};
function ScreenR1(p) {
  return <Lesson p={p} S={R1} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{seg.hl.includes(i) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz: {b.m}</div>}</div>
    </div>)}
  </div>} />;
}

// --- O'tish rejasi 2: o'quvchi qoqiladigan joylar ---
const STUMBLE = [
  { q: 'git clone ishlamaydi', a: "Git o'rnatilmagan yoki internet yo'q. Zaxira: GitHub'dan ZIP yuklab olib ochish. Darsdan oldin o'zingiz bir marta clone qilib ko'ring." },
  { q: 'npm install uzoq yoki xato', a: "Sabr: 2–5 daqiqa normal. Xato bo'lsa Node versiyasini tekshiring (20+), node_modules'ni o'chirib qayta urining." },
  { q: ".env to'ldirilmagan — server yiqiladi", a: "Loyiha PostgreSQL'ga ulanadi: «Unable to connect to the database» — ikkinchi satr sababni aytadi (keyingi ekranda to'rt xabar). .env.example'dan nusxa oling, PostgreSQL darsidagi bazani yoqing." },
  { q: 'Port 3000 band', a: "Oldingi dars serveri ochiq qolgan. Uni yoping yoki PORT=3001 bilan ishga tushiring." },
  { q: "«can't resolve dependencies»", a: "Siz endi o'qiy olasiz: kim, nima, qayerda. O'quvchi bilan birga jurnalni o'qing, javobni aytmang, savol bering: qaysi modul? qaysi ro'yxat?" },
  { q: '«Nega Express emas?» yoki metafora chalkashdi', a: "Bitta gap: katta loyihada tartib kerak, Nest tartibni majburiy qiladi, ichida o'sha Express. Metafora chalkashsa lug'atga qaytaring: oshpaz, ya'ni Service." },
];
const R2 = {
  kicker: "7-bosqich · o'tish rejasi", eyebrow: "m4a-01 · darsda nima bo'ladi", title: "O'quvchi qoqiladigan 6 joy",
  segments: [
    { id: 'a', key: "Sinfda <b>albatta</b> uchraydigan 6 holat", text: "Darsda albatta uchraydigan oltita holat. Har biriga tayyor javobingiz bo'lsin.", hl: [] },
    { id: 'b', key: "1 · clone ishlamaydi → <b>ZIP zaxirasi</b>", text: "Birinchi: git clone ishlamaydi. Git o'rnatilmagan yoki internet yo'q. Zaxira: GitHub'dan ZIP yuklab olib ochish. Darsdan oldin o'zingiz bir marta clone qilib ko'ring.", hl: [0] },
    { id: 'c', key: "2 · npm install → <b>sabr, Node 20+</b>", text: "Ikkinchi: npm install uzoq yoki xato. Ikki-besh daqiqa normal. Xato bo'lsa Node versiyasini tekshiring, yigirma yoki undan yuqori bo'lsin, node modules papkasini o'chirib qayta urining.", hl: [1] },
    { id: 'd', key: "3 · .env va PostgreSQL → <b>server yiqiladi</b>", text: "Uchinchi, eng muhimi: env fayli to'ldirilmagan. Loyiha PostgreSQL'ga ulanadi. Bazaning manzili bo'lmasa yoki PostgreSQL ishlamasa, server ishga tushmaydi: Unable to connect to the database. Keyingi ekranda shu xatoning uch ko'rinishini o'qiymiz.", hl: [2] },
    { id: 'e', key: "4 · port band → <b>oldingi serverni yoping</b>", text: "To'rtinchi: port uch ming band. Oldingi dars serveri ochiq qolgan. Uni yoping yoki boshqa port bilan ishga tushiring.", hl: [3] },
    { id: 'f', key: "5 · can't resolve → <b>birga o'qing, javobni aytmang</b>", text: "Beshinchi: can't resolve dependencies xatosi. Siz endi o'qiy olasiz: kim, nima, qayerda. O'quvchi bilan birga jurnalni o'qing, javobni aytmang, savol bering: qaysi modul, qaysi ro'yxat.", hl: [4] },
    { id: 'g', key: "6 · «Nega Express emas?» → <b>bitta gap</b>", text: "Oltinchi: nega Express emas degan savol yoki metafora chalkashuvi. Bitta gap: katta loyihada tartib kerak, Nest tartibni majburiy qiladi, ichida o'sha Express. Metafora chalkashsa lug'atga qaytaring.", hl: [5] },
  ],
};
function ScreenR2(p) {
  return <Lesson p={p} S={R2} scene={({ seg }) => <div className="mk-qa">
    {STUMBLE.map((s, i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {s.q}</b>{(seg.hl.includes(i) || seg.hl.length === 0) && <p>{s.a}</p>}</button>)}
  </div>} />;
}

// --- O'tish rejasi 2b: sinfda chiqadigan xato — baza ulanmadi (haqiqiy chiqishlar: manba/nest-out/15–18) ---
const DB_ERRS = [
  { at: 1, id: 'db1', h: `<span class="er">ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...</span>` },
  { at: 1, id: 'db1', h: `Error: connect <span class="er">ECONNREFUSED</span> 127.0.0.1:5432` },
  { at: 2, h: `` },
  { at: 2, id: 'db2', h: `<span class="er">ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...</span>` },
  { at: 2, id: 'db2', h: `Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: <span class="er">client password must be a string</span>` },
  { at: 3, h: `` },
  { at: 3, id: 'db3', h: `<span class="er">ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...</span>` },
  { at: 3, id: 'db3', h: `error: <span class="er">password authentication failed for user "postgres"</span>` },
  { at: 4, h: `` },
  { at: 4, id: 'db4', h: `<span class="er">ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...</span>` },
  { at: 4, id: 'db4', h: `error: <span class="er">database "cars_db" does not exist</span>` },
  { at: 5, h: `` },
  { at: 5, id: 'db5', h: `ERROR [TypeOrmModule] Unable to connect to the database. Retrying (10)...` },
  { at: 5, id: 'db5', h: `<span class="er">ERROR [ExceptionHandler] error: …</span>   <span class="cm">← 10 urinishdan keyin server yiqiladi</span>` },
];
const DB_ROWS = [
  { at: 1, m: 'connect ECONNREFUSED 127.0.0.1:5432', s: "PostgreSQL ishlamayapti yoki port noto'g'ri", f: "pg_isready yoki xizmatni yoqing; .env'dagi port 5432 mi" },
  { at: 2, m: 'client password must be a string', s: ".env yo'q yoki DEV_DB_URL o'qilmagan (parol undefined)", f: ".env.example'dan .env nusxalang, serverni qayta ishga tushiring" },
  { at: 3, m: 'password authentication failed for user', s: ".env'dagi parol yoki foydalanuvchi noto'g'ri", f: "psql bilan shu parolni sinang, .env'ni to'g'rilang" },
  { at: 4, m: 'database "…" does not exist', s: "ulanish va parol to'g'ri, lekin shu nomli baza yaratilmagan", f: "createdb bilan bazani yarating yoki .env'dagi nomni tekshiring" },
];
const RDB = {
  kicker: "7-bosqich · o'tish rejasi", eyebrow: "m4a-01 · sinfda eng ko'p chiqadigan xato", title: "Baza ulanmadi: to'rt xabar, to'rt sabab",
  segments: [
    { id: 'a', key: "O'quvchi loyihasi <b>PostgreSQL'ga ulanadi</b> — sinfdagi 1-xato shu", text: "Bugun to'rt Nest xatosini o'rgandingiz. Lekin sinfda eng ko'p chiqadigani boshqa: o'quvchi loyihasi PostgreSQL'ga ulanadi, va ulanish ko'pincha birinchi urinishda bo'lmaydi. Xabar har doim bir xil boshlanadi: Unable to connect to the database, Retrying. Sabab esa ikkinchi satrda. To'rtta haqiqiy holat." },
    { id: 'b', key: "1 · <b>ECONNREFUSED</b> → PostgreSQL ishlamayapti yoki port", text: "Birinchi: connect ECONNREFUSED, manzil va port. Demak shu portda hech kim javob bermayapti: PostgreSQL ishlamayapti yoki env faylida port noto'g'ri. Yechim: xizmatni yoqing, portni tekshiring.", show: "<b>connect ECONNREFUSED 127.0.0.1:5432</b>: shu portda hech kim javob bermayapti — PostgreSQL ishlamayapti yoki .env'dagi port noto'g'ri. Yechim: xizmatni yoqing, portni tekshiring." },
    { id: 'c', key: "2 · <b>client password must be a string</b> → .env yo'q", text: "Ikkinchi, eng chalg'ituvchisi: client password must be a string. Bu parol noto'g'ri degani emas. Parol umuman yo'q, undefined: env fayli yo'q yoki DEV DB URL o'qilmagan. Yechim: env example dan nusxa oling, serverni qayta ishga tushiring.", show: "<b>client password must be a string</b> — eng chalg'ituvchisi: parol noto'g'ri emas, parol <b>umuman yo'q</b> (undefined): .env yo'q yoki DEV_DB_URL o'qilmagan. Yechim: .env.example → .env, serverni qayta." },
    { id: 'd', key: "3 · <b>password authentication failed</b> → parol/foydalanuvchi", text: "Uchinchi: password authentication failed for user. Bu endi haqiqatan parol yoki foydalanuvchi nomi noto'g'ri. Yechim: env faylidagi qiymatlarni tekshiring, psql bilan sinang.", show: "<b>password authentication failed for user \"postgres\"</b>: endi haqiqatan parol yoki foydalanuvchi noto'g'ri. Yechim: .env qiymatlarini psql bilan sinang." },
    { id: 'd2', key: "4 · <b>database … does not exist</b> → baza yaratilmagan", text: "To'rtinchi: database, nomi, does not exist. Ulanish bor, parol ham to'g'ri, lekin PostgreSQL'da bunday nomli baza yo'q: uni hali hech kim yaratmagan. Yechim: bazani yarating yoki env faylidagi nomni tekshiring.", show: "<b>database \"cars_db\" does not exist</b>: ulanish va parol to'g'ri, lekin bunday nomli baza <b>yaratilmagan</b>. Yechim: <code>createdb cars_db</code> yoki .env'dagi nomni tekshiring." },
    { id: 'e', key: "Qoida: «Unable to connect» → <b>kodga tegmang</b>: .env va PostgreSQL", text: "TypeORM o'n marta qayta urinadi, keyin server yiqiladi. Qoida: Unable to connect ko'rsangiz, kodga tegmang, muammo kodda emas. Ikkinchi satrni o'qing, env faylini va PostgreSQL'ni tekshiring. Bu to'rt xabar eslatmada ham bor." },
  ],
};
function ScreenRdb(p) {
  return <Lesson p={p} S={RDB} scene={({ seg, beat }) => (<>
    <CodePanel file="terminal — o'quvchi loyihasi, haqiqiy chiqishlar" numbers={false} wrap style={{ background: '#1F1115' }} beat={beat} lines={DB_ERRS} focus={beat >= 1 && beat <= 5 ? ['db' + beat] : []} />
    <Block at={1} beat={beat}><table className="mk-tbl"><thead><tr><th>xabar (2-satr)</th><th>sabab</th><th>yechim</th></tr></thead><tbody>
      {DB_ROWS.filter((r) => r.at <= beat).map((r, i) => <tr key={i} className={r.at === beat ? 'hl' : ''}><td><code>{r.m}</code></td><td>{r.s}</td><td>{r.f}</td></tr>)}
    </tbody></table></Block>
    <Block at={5} beat={beat}><div className="mk-rule"><b>«Unable to connect»</b> → kodga tegmang: 2-satrni o'qing, <code>.env</code> va PostgreSQL'ni tekshiring.</div></Block>
  </>)} />;
}

// --- O'tish rejasi 3: 90 daqiqa ---
const PLAN90 = [
  { t: '0–10', n: "Kirish va og'riq", d: 'server.js misoli, 4 qadam rejasi' },
  { t: '10–30', n: 'Clone va ishga tushirish', d: "hammada server ishlaguncha; .env va PostgreSQL" },
  { t: '30–45', n: 'Swagger, bino xaritasi, 1–2-test', d: 'eshiklar, papkalar, «ofitsiant»' },
  { t: '45–60', n: "Buyurtma yo'li, 3-test", d: 'Guard → Controller → Service → Repository → successRes' },
  { t: '60–75', n: 'Qatlamlar, 4-test', d: 'Entity, DTO, BaseService, Module — nom va vazifa' },
  { t: '75–90', n: 'AI qurish, debugging, arena', d: "bugungi qoida: Controller'da hisob yo'q" },
];
const R3 = {
  kicker: "7-bosqich · o'tish rejasi", eyebrow: 'm4a-01 · 90 daqiqa (taklif)', title: "Vaqt rejasi va uch qoida",
  segments: [
    { id: 'a', key: "90 daqiqa: <b>oltita bo'lak</b>", text: "Taklif qilingan vaqt rejasi: to'qson daqiqa, oltita bo'lak. Bu taklif, sinfingizga qarab o'zgartirasiz.", hl: [] },
    { id: 'b', key: "0–30: kirish va <b>hammada server ishlaguncha</b>", text: "Birinchi o'ttiz daqiqa: kirish va clone. Eng xavfli bo'lak clone va ishga tushirish, shuning uchun unga yigirma daqiqa.", hl: [0, 1] },
    { id: 'c', key: "30–60: Swagger, xarita, <b>buyurtma yo'li</b>", text: "O'ttizdan oltmishgacha: Swagger, bino xaritasi, buyurtma yo'li va uchta test.", hl: [2, 3] },
    { id: 'd', key: "60–90: qatlamlar, <b>AI qurish, debugging</b>", text: "Oltmishdan to'qsongacha: qatlamlar, AI bilan qurish, yakuniy debugging va arena.", hl: [4, 5] },
    { id: 'e', key: "Uch qoida: <b>server · ikki so'z · jurnal birga</b>", text: "Va uch qoida. Birinchi: hammaning serveri ishlamaguncha oldinga o'tmang. Ikkinchi: metafora va atamani birga ayting, oshpaz, ya'ni Service. Uchinchi: xato chiqsa jurnalni o'quvchi bilan birga o'qing, javobni aytmang.", hl: [] },
  ],
};
function ScreenR3(p) {
  return <Lesson p={p} S={R3} scene={({ seg, beat }) => (<>
    <div style={{ display: 'grid', gap: 8 }}>
      {PLAN90.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1, alignItems: 'center' }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 56 }}>{b.t}</span>
        <div className="t"><b style={{ marginBottom: 0 }}>{b.n}</b><div className="exp">{b.d}</div></div>
      </div>)}
    </div>
    <Block at={4} beat={beat}><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      {[['Server avval', "hammada ishlamaguncha oldinga o'tmang"], ["Ikki so'z birga", '«oshpaz, ya\'ni Service»'], ['Jurnal birga', "javobni aytmang, savol bering"]].map(([h, d], i) => <div key={h} className="mk-card" style={{ borderColor: T.accent, animation: `mk-up .4s ${i * 0.15}s ease both` }}><h5 style={{ color: T.accent }}>{h}</h5><div style={{ fontSize: 13 }}>{d}</div></div>)}
    </div></Block>
  </>)} />;
}

// --- S26 O'quvchi so'raydigan savollar ---
const QA = [
  ['Nega Express emas, Nest?', "Loyiha katta bo'lganda tartib kerak; Nest tartibni majburiy qiladi, ichida esa o'sha Express."],
  ["Dekorator nima o'zi?", "Klass yoki metod ustidagi belgi; Nest'ga shu narsa nima ekanini aytadi, kod bajarmaydi."],
  ['providers nima?', "Shu modul yaratib beradigan narsalar, asosan Service'lar."],
  ["Service'ni nega alohida qildik?", "Alohida sinash va qayta ishlatish uchun; Controller yupqa qoladi."],
  ["Nest Express'dan tezmi?", "Yo'q, tezlik bir xil, ichida Express. Nest tezlik emas, tartib beradi."],
  ["Injectable'ni o'chirdim, ishlayapti. Kerak emasmi?", "Bog'liqligi bo'lmagani uchun ishladi; bog'liqlik paydo bo'lganda server ishga tushadi, lekin so'rovda 500 TypeError — jim xato. Shuning uchun doim yoziladi."],
];
const S26 = {
  kicker: "7-bosqich · savollar", title: "O'quvchi so'raydigan savollar",
  segments: [
    { id: 'a', key: "Sizga beriladigan <b>6 savol</b>", text: "Darsda sizga beriladigan savollar taxminan shular bo'ladi.", hl: [] },
    { id: 'q1', key: "1 · Nega Express emas? → <b>tartib</b>", text: "Birinchisi: nega Express emas, Nest? Javob: loyiha katta bo'lganda tartib kerak, Nest tartibni majburiy qiladi, ichida esa o'sha Express.", hl: [0] },
    { id: 'q2', key: "2 · Dekorator? → <b>belgi</b>", text: "Ikkinchisi: dekorator nima? Klass yoki metod ustidagi belgi, Nest'ga shu narsa nima ekanini aytadi.", hl: [1] },
    { id: 'q3', key: "3 · providers? → <b>Service'lar</b>", text: "Uchinchisi: providers nima? Shu modul yaratib beradigan narsalar, asosan Service'lar.", hl: [2] },
    { id: 'q4', key: "4 · Nega alohida Service? → <b>sinash, qayta ishlatish</b>", text: "To'rtinchisi: Service'ni nega alohida qildik? Alohida sinash va qayta ishlatish uchun, Controller esa yupqa qoladi.", hl: [3] },
    { id: 'q5', key: "5 · Tezmi? → <b>yo'q, tartib</b>", text: "Beshinchisi: Nest tezmi? Yo'q, tezlik bir xil, chunki ichida Express. Nest tezlik emas, tartib beradi.", hl: [4] },
    { id: 'q6', key: "6 · Injectable'siz ishlayapti? → <b>hozircha, keyin jim xato</b>", text: "Oltinchisi: Injectable'ni o'chirdim, ishlayapti. Bog'liqligi bo'lmagani uchun; bog'liqlik paydo bo'lganda server ishga tushadi, lekin so'rovda besh yuz, jim xato. Shuning uchun doim yoziladi.", hl: [5] },
    { id: 'z', key: "Har kartani <b>bosib</b> o'qing", text: "Har kartani bosib, javobni o'qing. O'zingiz javob bera olmaydigan savol kelsa, darsdagi shu ekranga qayting.", hl: [], closeAll: true },
  ],
};
function Screen26(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S26} scene={({ seg }) => {
    const isOpen = (i) => seg.hl.includes(i) || (!seg.closeAll ? false : open.includes(i)) || open.includes(i);
    return <div className="mk-qa">
      {QA.map(([q, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{i + 1}. {q}</b>{isOpen(i) && <p>{a}</p>}</button>)}
    </div>;
  }} />;
}

// --- S27 O'z-sinov — 8 savol, HAR SAVOLDA BITTA URINISH ---
const FINAL = [
  { q: "Nest ichida so'rovni haqiqatda qaysi kutubxona qabul qiladi?", o: ["Nest'ning o'z HTTP serveri", 'Express (platform-express)', 'Node http moduli bevosita', 'Har doim Fastify'], c: 1, e: "Nest Express ustidagi qatlam; Fastify'ga almashtirish mumkin, lekin standart Express.", s: 3 },
  { q: "@Controller('cars') va @Get(':id') birga qaysi manzilni ochadi?", o: ['/cars?id=5', '/id/cars', '/cars/5', '/:id/cars'], c: 2, e: "Controller prefiksi + metod yo'li.", s: 18 },
  { q: 'POST metodida status yozilmagan. Nest nima qaytaradi?', o: ['200', '201', '204', '202'], c: 1, e: "Nest POST uchun 201 ni o'zi qo'yadi.", s: 20 },
  { q: "«Nest can't resolve dependencies of the X (?)» — so'roq belgisi nimani bildiradi?", o: ["Noma'lum modul", "Topilmagan argument o'rni", 'Sintaksis xatosi', "Marshrut yo'q"], c: 1, e: 'Qavs ichida konstruktor argumentlari, ? — topilmagani.', s: 23 },
  { q: "Server «successfully started», /cars 404, jurnalda Mapped {/cars…} yo'q. Eng ehtimoliy sabab?", o: ["CarsModule AppModule imports'ida yo'q", "Injectable yo'q", 'Port band', "Service'da xato"], c: 0, e: "Jim xato: modul ulanmagan, Nest papkani o'qimagan.", s: 24 },
  { q: "Service ichida throw new Error('x'). Mijozga nima boradi?", o: ['404 va «x»', '500 Internal server error', '400', 'Hech narsa, server yiqiladi'], c: 1, e: 'Oddiy Error → 500, xabar yashiriladi.', s: 28 },
  { q: "Yangi xabar: «Nest can't resolve dependencies of the UsersService (?, JwtService). Please make sure that the argument ConfigService at index [0] is available in the UsersModule module.» Nima qilasiz?", o: ["users.module.ts — providers'ga ConfigService (yoki ConfigModule import)", "users.service.ts — konstruktordan JwtService'ni o'chirish", "app.module.ts — controllers'ga UsersService", "UsersService'ga @Injectable() qo'shish"], c: 0, e: "Kim: UsersService · nima: ConfigService, index [0] · qayerda: UsersModule. JwtService topilgan (ikkinchi o'rin), muammo unda emas.", s: 23 },
  { q: "orders.module.ts: controllers: [OrdersController], providers: [] — OrdersController konstruktorida OrdersService so'ralgan. Server nima qiladi?", o: ["Ishga tushadi, /orders → 404", "Yiqiladi: can't resolve dependencies of the OrdersController (?)", "Ishga tushadi, /orders → 500", "Yiqiladi: invalid controller detected"], c: 1, e: "providers bo'sh → Nest OrdersService'ni topa olmaydi → ishga tushishda yiqiladi (1-buzish bilan bir xil).", s: 23 },
];
function Screen27(p) {
  const segs = useMemo(() => [{ id: 'intro', text: UZ + "Yakuniy sinov, sakkiz savol. Bu o'zingizni halol o'lchash: har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz.", trigger: 'on_mount' }], []);
  const audio = useAudio(segs);
  const sfx = useSfx();
  const st = p.stored || {};
  const [i, setI] = useState(st.i || 0);
  const [res, setRes] = useState(st.res || []);
  const [attempt, setAttempt] = useState(st.attempt || 1);
  const [showResult, setShowResult] = useState(!!st.showResult);
  const q = FINAL[i];
  const picked = res[i] ? res[i].picked : null;
  const score = res.filter((x) => x && x.correct).length;
  const finished = res.filter(Boolean).length === FINAL.length;
  const save = (patch) => p.onAnswer({ type: 'final', i, res, attempt, showResult, score, total: FINAL.length, ...patch });
  const pick = (k) => {
    if (picked !== null) return;
    audio.triggerEvent('option_picked');
    const r = [...res]; r[i] = { picked: k, correct: k === q.c }; setRes(r);
    if (k === q.c) sfx.playCorrect(); else sfx.playWrong();
    const sc = r.filter((x) => x && x.correct).length; save({ res: r, score: sc });
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(UZ + (sc >= 6 ? "Dars o'zlashtirildi. Endi o'quvchi darsiga kirsangiz, har so'z tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring. Bu normal holat, Nest birinchi kunda hammaga ham o'tirmaydi.")), 400);
  };
  const next = () => { if (i < FINAL.length - 1) { setI(i + 1); save({ i: i + 1 }); } else { setShowResult(true); save({ showResult: true }); } };
  const retake = () => { setRes([]); setI(0); setShowResult(false); setAttempt(attempt + 1); save({ res: [], i: 0, showResult: false, attempt: attempt + 1, score: 0 }); };
  return (
    <Stage kicker="O'z-sinov" idx={p.idx} total={p.total} audio={audio} onBack={p.onBack} onNext={p.onNext} nextReady={finished && showResult} nextDisabled={!finished}>
      <div className="mk-body" style={{ gridTemplateColumns: '1fr', maxWidth: 860, width: '100%', margin: '0 auto' }}>
        <div className="mk-say" style={{ justifyContent: 'center' }}>
          {showResult ? (<>
            <p className="mk-eyebrow">O'z-sinov · natija{attempt > 1 ? ` · ${attempt}-urinish` : ''}</p>
            <h2 className="mk-title" style={{ fontSize: 'clamp(22px,2.4vw,30px)' }}>{score} / {FINAL.length} — {score >= 6 ? "dars o'zlashtirildi" : "yana bir ko'rib chiqing"}</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {FINAL.map((f, k) => <div key={k} className="mk-card" style={{ display: 'flex', gap: 12, alignItems: 'center', borderColor: res[k] && res[k].correct ? T.green : T.accent }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: res[k] && res[k].correct ? T.green : T.accent, minWidth: 22 }}>{res[k] && res[k].correct ? '✓' : '✗'}</span>
                <span style={{ flex: 1, fontSize: 14 }}>{f.q}</span>
                {res[k] && !res[k].correct && p.onGoto && <button className="mk-btn soft sm" onClick={() => p.onGoto(f.s - 1)}>{f.s}-ekran</button>}
              </div>)}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, flexWrap: 'wrap' }}>
              {score < 6 && <button className="mk-btn ghost" onClick={retake}>Sinovni qayta topshirish</button>}
              <span style={{ color: T.ink2, fontSize: 14 }}>Ekranga qaytib «Davom» bossangiz, shu natijaga qaytasiz.</span>
            </div>
          </>) : (<>
            <p className="mk-eyebrow">O'z-sinov · {i + 1} / {FINAL.length} · bitta urinish · to'g'ri: {score}</p>
            <h2 className="mk-title" style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}>{q.q}</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {q.o.map((o, k) => { let cls = 'mk-opt'; if (picked !== null) { if (k === q.c) cls += ' ok'; else if (k === picked) cls += ' bad'; else cls += ' off'; } return <button key={k} className={cls} disabled={picked !== null} onClick={() => pick(k)}><span className="l">{String.fromCharCode(65 + k)}</span><span>{o}</span></button>; })}
            </div>
            {picked !== null && <div className="mk-fb" style={{ '--c': picked === q.c ? T.green : T.accent, '--bg': picked === q.c ? '#E3F5EC' : '#FFF0EB' }}><b>{picked === q.c ? "To'g'ri" : "Noto'g'ri — to'g'risi yashil"}</b><span>{q.e}</span></div>}
            {picked !== null && <div style={{ marginTop: 14 }}><button className="mk-btn ready" onClick={next}>{i < FINAL.length - 1 ? 'Keyingi savol →' : "Natijani ko'rish →"}</button></div>}
          </>)}
        </div>
      </div>
    </Stage>
  );
}

// --- S28 Yakun + eslatma ---
const CHEATSHEET = `# Nest 1-dars — mentor eslatmasi
## Buyruqlar
npm i -g @nestjs/cli · nest new cars-api · npm run start:dev
nest g module cars · nest g controller cars --no-spec · nest g service cars --no-spec
## Uch bo'lak
Controller — so'rovni oladi, Service'ni chaqiradi, qaytaradi (yupqa)
Service — ish: hisob, qoida, baza; req/res yo'q; @Injectable()
Module — ro'yxat: imports · controllers · providers; ro'yxatda yo'q = Nest uchun yo'q
## Dependency Injection
constructor(private readonly carsService: CarsService) — siz yaratmaysiz, Nest providers'dan yaratib beradi (1 nusxa)
## 4 xato
1 «can't resolve dependencies of the X (?) … argument Y at index [0] … in the Z module» → Z modulining providers'iga Y
2 server ishga tushdi, /cars 404, jurnalda Mapped {/cars…} yo'q → AppModule imports: [CarsModule]
3 «invalid controller … does not have the @Controller() decorator» → dekoratorni qaytaring
4 @Injectable'siz ishlaydi (bog'liqlik yo'q) → bog'liqlik qo'shilsa: server ishga tushadi, so'rovda 500 TypeError (jim xato) → baribir yoziladi
## Baza ulanmadi (o'quvchi loyihasi, TypeORM — «Unable to connect to the database. Retrying (1)…», 10 urinish, keyin yiqiladi)
connect ECONNREFUSED 127.0.0.1:5432 → PostgreSQL ishlamayapti yoki port noto'g'ri · SASL … client password must be a string → .env yo'q/o'qilmagan · password authentication failed for user → .env'dagi parol/foydalanuvchi noto'g'ri · database "…" does not exist → baza yaratilmagan (createdb) yoki .env'dagi nom noto'g'ri
## Yordam
Hech biri mos kelmasa: skrinshot + xato matni → mentor-kurs Telegram guruhi
## Xato turi
HttpException oilasi (NotFound 404, BadRequest 400, Unauthorized 401, Forbidden 403) → status + xabar · oddiy Error → 500, xabar yashirin
## Javoblar
GET /cars 200 · GET /cars/1 200 · GET /cars/99 404 · POST /cars 201 (o'zi) · /cars/abc → 404 «NaN» (tekshiruv yo'q — DTO keyingi dars)
## O'quvchi darsi tili
ofitsiant=Controller · oshpaz=Service · omborchi=Repository · javon chizmasi=Entity · anketa=DTO · nazoratchi=Guard · shtat jadvali=Module
## Uch qoida (dars o'tishda)
hammada server ishlaguncha oldinga o'tmang · «oshpaz, ya'ni Service» · xato chiqsa jurnalni birga o'qing, javobni aytmang`;
const S28 = {
  kicker: 'Yakun', title: 'Endi siz bilasiz',
  items: ["Nest — Express ustidagi majburiy tartib", "Controller so'rovni oladi va yupqa qoladi", "Service ishni bajaradi va so'rov haqida bilmaydi", "Module — ro'yxat, Nest faqat ro'yxatdagini ko'radi", 'Dependency Injection: siz yaratmaysiz, Nest konstruktor orqali beradi', "Nest xatolari o'qiladi: kim · nima · qayerda"],
  segments: [
    { id: 'a', key: "Darsni yakunlaymiz", text: "Darsni yakunlaymiz. Endi siz bilasiz.", hl: [] },
    { id: 'b1', key: "Nest = Express + <b>majburiy tartib</b>", text: "Nest bu Express ustidagi majburiy tartib.", hl: [0] },
    { id: 'b2', key: "Controller <b>yupqa</b>", text: "Controller so'rovni oladi va yupqa qoladi.", hl: [1] },
    { id: 'b3', key: "Service <b>ishlaydi</b>, so'rovni bilmaydi", text: "Service ishni bajaradi va so'rov haqida bilmaydi.", hl: [2] },
    { id: 'b4', key: "Module <b>ro'yxat</b>", text: "Module ro'yxat, Nest faqat ro'yxatdagini ko'radi.", hl: [3] },
    { id: 'b5', key: "DI: <b>Nest beradi</b>", text: "Dependency Injection: siz yaratmaysiz, Nest konstruktor orqali beradi.", hl: [4] },
    { id: 'b6', key: "Xatolar <b>o'qiladi</b>: kim · nima · qayerda", text: "Va eng muhimi: Nest xatolari o'qiladi, ularda kim, nima, qayerda yozilgan.", hl: [5] },
    { id: 'c', key: "<b>Eslatmani oling</b>. Keyingi dars: Entity, DTO, Repository", text: "Pastda bir sahifalik eslatma: buyruqlar, to'rt xato, qoidalar va o'quvchi darsi lug'ati. Nusxalab yoki yuklab oling. Keyingi dars: birinchi resursni qo'lda qo'shish, mashinalar: Entity, DTO va Repository. U yerda bugungi cars moduli haqiqiy PostgreSQL bazasiga ulanadi. Rahmat.", hl: [] },
  ],
};
function Screen28(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const download = () => { try { const b = new Blob([CHEATSHEET], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'nest-1-dars-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const b = useBeats(S28.segments);
  // Kichik ekran: eslatma 7-qadamda kiradi va sahnadan pastda qoladi — ovoz u haqida gapirganda ko'rinishga aylantiriladi
  const sceneRef = useRef(null);
  useEffect(() => {
    const s = sceneRef.current; if (!s || b.beat < 7 || s.scrollHeight <= s.clientHeight + 4) return;
    const t = s.querySelector('.mk-light'); if (!t) return;
    s.scrollTo({ top: Math.max(0, t.getBoundingClientRect().top - s.getBoundingClientRect().top + s.scrollTop - 8), behavior: 'smooth' });
  }, [b.beat]);
  return (
    <Stage kicker={S28.kicker} idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onFinish} nextReady={b.done} nextLabel="Darsni yakunlash">
      <div className="mk-body">
        <Say title={S28.title} segments={S28.segments} beat={b.beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk} />
        <div className="mk-scene top" style={{ overflow: 'auto' }} ref={sceneRef}>
          <div className="mk-plan">{S28.items.map((t, i) => <div key={i} className={b.seg.hl.includes(i) ? 'hl' : (b.seg.hl.length ? 'dim' : '')} style={{ opacity: b.beat === 0 ? 0.35 : undefined }}><b>0{i + 1}</b><span>{t}</span></div>)}</div>
          <Block at={7} beat={b.beat}><div className="mk-light" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={CHEATSHEET} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 220, overflow: 'auto' }}>{CHEATSHEET}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Keyingi dars</h5><div style={{ fontSize: 15, fontWeight: 700 }}>Birinchi resursni qo'lda qo'shish — mashinalar</div><div className="exp">Entity, DTO, Repository — CRUD · bugungi cars moduli haqiqiy PostgreSQL bazasiga ulanadi</div></div>
          </div></Block>
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  MUQOVA + ILDIZ
// ============================================================
function Cover({ onStart }) {
  return (
    <div className="mk-cover"><div className="card">
      <p className="mk-eyebrow">Mentor kursi · 1-dars</p>
      <h1>NestJS arxitekturasi: Module, Controller, Service</h1>
      <p>Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.</p>
      <ul>
        <li>Jami 60–70 daqiqa: ovoz 25 daqiqa · to'rt amaliyot 25 daqiqa · 5 tekshiruv · o'z-sinov 8 savol</li>
        <li>Kerak: Node.js 20+, VS Code, terminal — amaliyot dars ichida, har amaliyotda isbot maydoni</li>
        <li>Har ekranda: ovozni qaytarish, o'chirish, «Matn» tugmasi</li>
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5a, ScreenP0, Screen5b, Screen6, Screen7, Screen8, Screen9, ScreenP1, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenLC1, Screen16, Screen17, ScreenP2, Screen18, Screen19, Screen20, Screen21, ScreenLC2, Screen22, Screen23, ScreenP3, Screen25a, Screen25b, ScreenR1, ScreenR2, ScreenRdb, ScreenR3, Screen26, Screen27, Screen28];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function NestArchMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
  useCss();
  const total = SCREENS.length;
  const [started, setStarted] = useState(startAt != null);
  const [idx, setIdx] = useState(Math.min(Math.max(0, startAt || 0), total - 1));
  const [answers, setAnswers] = useState({});
  const [returnTo, setReturnTo] = useState(null);
  const startTime = useRef(Date.now());
  const finished = useRef(false);
  const onAnswer = useCallback((payload) => setAnswers((a) => ({ ...a, [idx]: payload })), [idx]);
  const goto = useCallback((to) => { setReturnTo(idx); setIdx(Math.max(0, Math.min(to, total - 1))); }, [idx, total]);
  const next = () => { if (returnTo != null) { const r = returnTo; setReturnTo(null); setIdx(r); } else setIdx((i) => Math.min(i + 1, total - 1)); };
  const finish = () => {
    if (finished.current) return; finished.current = true;
    const vals = Object.values(answers);
    const checks = vals.filter((a) => a && a.type === 'mc');
    const fin = vals.find((a) => a && a.type === 'final');
    const practices = vals.filter((a) => a && a.type === 'practice');
    const score = fin ? fin.score : 0, totalQ = FINAL.length;
    const practiceDone = practices.length === PRACTICE_COUNT && practices.every((x) => x.done);
    onFinished && onFinished({
      lessonId: LESSON_ID, lessonTitle: 'NestJS arxitekturasi: Module, Controller, Service',
      durationSec: Math.floor((Date.now() - startTime.current) / 1000),
      totalQuestions: totalQ, correctAnswers: score, scorePercent: Math.round((score / totalQ) * 100), passed: score >= 6 && practiceDone, testPassed: score >= 6,
      finalAttempts: fin ? fin.attempt : 0,
      checks: checks.map((c) => ({ firstTry: c.firstTry, tries: c.tries })),
      practiceDone,
      answers: Object.entries(answers).map(([i, a]) => ({ screen: Number(i) + 1, ...a })),
    });
  };
  if (!started) return <Cover onStart={() => setStarted(true)} />;
  const S = SCREENS[idx];
  return <S key={idx} idx={idx} total={total} lang={lang} stored={answers[idx]} onAnswer={onAnswer} onNext={next} onBack={idx > 0 ? () => setIdx((i) => i - 1) : null} onFinish={finish} onGoto={goto} />;
}
