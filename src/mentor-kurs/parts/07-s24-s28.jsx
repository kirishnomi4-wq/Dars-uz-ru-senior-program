
// ============================================================
//  7-BOSQICH · ko'prik (2), o'tish rejasi (3), savollar, o'z-sinov, yakun + root komponent
// ============================================================
// 30.10: haqiqiy repo strukturasi (GitHub API, IntroNestArxitechture HEAD) — M10
const TREE = [
  { t: 'IntroNestArxitechture/', f: true }, { t: '  src/main.ts', g: 'r' }, { t: '  src/config/index.ts', g: 'r' },
  { t: '  src/api/', f: true }, { t: '    app.module.ts', g: 'g' }, { t: '    app.service.ts  (Service emas!)', g: 'r' },
  { t: '    admin/admin.module.ts', g: 'g' }, { t: '    admin/admin.controller.ts', g: 'g' }, { t: '    admin/admin.service.ts', g: 'g' },
  { t: '    admin/dto/ (create · update · signin)', g: 'y' }, { t: '    auth/ (kirish)', g: 'r' },
  { t: '  src/core/', f: true }, { t: '    entity/Base.entity.ts · admin.entity.ts', g: 'y' }, { t: '    repository/admin.repository.ts', g: 'y' },
  { t: '  src/common/', f: true }, { t: '    guard/ (auth · roles)', g: 'r' }, { t: '    decorator/ · interface/ · enum/ · dto/', g: 'r' },
  { t: '  src/infrastructure/', f: true }, { t: '    base/base.service.ts', g: 'r' }, { t: '    exception/AllException.filter.ts', g: 'r' },
  { t: '    lib/token/ · lib/crypto/', g: 'r' }, { t: '    response/successRes.ts · pagination/', g: 'r' },
];
// F-1030-16: mentor kursdagi hamma darsni o'tib bo'lgan — «keyingi darsda» deyilmaydi; har rangli joy uchun mentorning TAYYOR GAPI shu yerda
const S25A_SAY = {
  y: [['Entity', "bazadagi jadval shakli: TypeORM shu klassdan jadval yasaydi"], ['DTO', "kiruvchi ma'lumot shakli: majburiy maydon va tiplar shu yerda tekshiriladi, xato bo'lsa 400"], ['Repository', "bazaga yozish va o'qish metodlari: Service bazaga shu orqali murojaat qiladi"]],
  r: [['auth', "kirish va ro'yxatdan o'tish moduli"], ['Guard', "so'rov Controller'ga yetguncha tokenni tekshiradi, yaroqsiz bo'lsa to'xtatadi"], ['BaseService', "hamma Service uchun tayyor CRUD metodlari, admin service undan meros oladi"], ['Token', "kirgan foydalanuvchining ruxsatnomasi"], ['successRes', "hamma javob bir xil shaklda qaytishi uchun yordamchi"], ['main.ts → app.service.ts', "server shu yerda ishga tushadi (Aplication klassi). Nomi app.service, lekin bu loyihada Service emas"], ['AllExceptionFilter', "hamma xatoni bitta shaklda qaytaradi: { statusCode, error: { message } }"], ['config', ".env qiymatlarini (PORT, DEV_DB_URL) o'qiydi"]],
};
const S25a = {
  kicker: "7-bosqich · o'quvchi darsini o'tish", title: "O'quvchi clone qiladigan loyiha",
  segments: [
    { id: 'a', key: "O'quvchi <b>noldan yozmaydi</b>: GitHub'dan tayyor loyihani clone qilib, ishga tushiradi", text: "Siz Nest'ni o'zingiz qurdingiz va o'zingiz buzdingiz. Endi darsning asosiy maqsadiga o'tamiz: bu mavzuni o'quvchiga o'tish. Avval o'quvchi darsiga qaraymiz, chunki u bu mavzuni boshqacha ko'radi. O'quvchi noldan yozmaydi: GitHub'dan tayyor loyihani clone qiladi, IntroNestArxitechture, va uni ishga tushiradi.", lit: null },
    { id: 'b', key: "Loyiha kattaroq: <code>api</code> · <code>core</code> · <code>common</code> · <code>infrastructure</code> papkalari", text: "Loyiha kattaroq: api, core, common, infrastructure papkalari.", lit: 'f' },
    { id: 'c', key: "<b>Yashil</b> — bugun kod bilan ko'rdingiz: admin module, controller, service — bizning cars'ning o'zi", text: "Yashil belgilangan joylarni siz bugun kod bilan ko'rdingiz: admin module, admin controller, admin service va bosh modul. Ular aynan bizning cars fayllarimiz, faqat admin uchun va kattaroq. Darsda ularni kodi bilan ko'rsatasiz.", lit: 'g' },
    { id: 'd', key: "<b>Sariq</b> — Entity · DTO · Repository: o'quvchi so'rasa, <b>bir gapda</b> tushuntirasiz", text: "Sariq joylar: entity, dto va repository. O'quvchi darsida ular nomi va vazifasi bilan chiqadi, so'rasa bir gapda tushuntirasiz. Entity, bazadagi jadval shakli: TypeORM shu klassdan jadval yasaydi.", lit: 'y' },
    { id: 'd2', key: "<b>DTO</b> — kiruvchi ma'lumot shakli, <b>Repository</b> — bazaga yozish va o'qish", text: "DTO, kiruvchi ma'lumot shakli: majburiy maydonlar va tiplar shu yerda tekshiriladi. Repository, bazaga yozish va o'qish metodlari: Service bazaga shu orqali murojaat qiladi. Ularning kodini kursdagi keyingi mentor darslarida to'liq o'rganasiz, hozir bir gap yetarli.", lit: 'y' },
    { id: 'e', key: "<b>Kulrang</b> — auth, Guard, BaseService, filter, config: <b>nom va vazifa</b>, bittadan gap", text: "Kulrang joylar. Auth moduli kirish va ro'yxatdan o'tishni qiladi. Guard so'rov Controller'ga yetguncha tokenni tekshiradi, yaroqsiz bo'lsa to'xtatadi. BaseService hamma Service uchun tayyor CRUD metodlari, admin service undan meros oladi. Token, kirgan foydalanuvchining ruxsatnomasi. successRes, hamma javob bir xil shaklda qaytishi uchun yordamchi.", lit: 'r' },
    { id: 'e2', key: "Ehtiyot joy: server <code>api/app.service.ts</code>'da ishga tushadi — nomi Service, lekin <b>Service emas</b>", text: "Bitta ehtiyot joy: bu loyihada server main ts'da emas, api papkasidagi app service ts faylida ishga tushadi. Nomi app service, lekin u Service emas, serverni ishga tushiradigan klass. O'quvchi so'rasa, shuni ayting.", lit: 'r' },
    { id: 'e3', key: "Xavotir olmang: bu loyihaning o'ziga xos joylarini <b>keyingi mentor darsida</b> clone qilib ko'rasiz", text: "Xavotir olmang: bu loyihaning o'ziga xos joylarini, route'lar api v1 bilan boshlanishini, xato javobining shaklini va BaseService'ni keyingi mentor darsida clone qilib, o'zingiz ko'rasiz. O'quvchi darsida esa shu gaplar yetarli.", lit: 'r' },
    { id: 'f', key: "Xulosa: strukturadagi <b>har rangli joy uchun bitta tayyor gapingiz</b> bor", text: "Xulosa: yashil fayllarni kod bilan ko'rsatasiz, sariq va kulranglarni bittadan gap bilan tushuntirib, darsga qaytasiz. O'quvchi darsi bu fayllarning kodini ochmaydi, shuning uchun bitta gap yetarli.", lit: null },
  ],
};
function Screen25a(p) {
  return <Lesson p={p} S={S25a} sceneTop scene={({ seg, beat }) => {
    // rang shu rangning birinchi segmentidan yonadi (segment bo'linsa ham siljimaydi)
    const lit = (g) => { const k = S25a.segments.findIndex((s) => s.lit === g); return k >= 0 && beat >= k; };
    const say = seg.lit === 'y' || seg.lit === 'r' ? S25A_SAY[seg.lit] : null;
    return <div style={{ display: 'grid', gridTemplateColumns: say ? 'minmax(0,1fr) minmax(0,1fr)' : '1fr', gap: 12, alignItems: 'start' }}>
      <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">github.com/Azizbekcrypto/IntroNestArxitechture</div>
        <div className="mk-tree" style={{ fontSize: 13 }}>{TREE.map((n, i) => <div key={i} className={n.f ? (beat >= 1 ? 'f' : '') : (n.g && lit(n.g) ? n.g : '')} style={{ opacity: beat >= 1 || n.f ? 1 : 0.6, outline: seg.lit && n.g === seg.lit && lit(n.g) ? `2px solid ${T.accent}` : 'none', outlineOffset: -2 }}>{n.t}</div>)}</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 10, fontSize: 12, flexWrap: 'wrap' }}><span className="mk-tree"><span className="g" style={{ padding: '1px 6px' }}>{t("kod bilan ko'rsatasiz", 'показываете с кодом')}</span></span><span className="mk-tree"><span className="y" style={{ padding: '1px 6px' }}>{t('bir gapda tushuntirasiz', 'объясняете одной фразой')}</span></span><span className="mk-tree"><span className="r" style={{ padding: '1px 6px' }}>{t('nom va vazifa', 'название и задача')}</span></span></div>
      </div>
      {say && <div key={seg.lit} className="mk-light" style={{ padding: 14, animation: 'mk-up .4s ease both' }}>
        <div className="mk-tag" style={{ color: T.accent }}>{t("O'quvchi so'rasa — sizning gapingiz", 'Если ученик спросит — ваша фраза')}</div>
        <div style={{ display: 'grid', gap: 8 }}>{say.map(([a, b]) => <div key={a} style={{ fontSize: 13.5, lineHeight: 1.45 }}><code style={{ fontFamily: MONO, fontWeight: 700 }}>{a}</code> — {b}</div>)}</div>
      </div>}
    </div>;
  }} />;
}

const DICT = [['ofitsiant', 'Controller', "so'rovni oladi, oshxonaga uzatadi"], ['oshpaz', 'Service', 'ishni bajaradi'], ['omborchi', 'Repository', 'baza bilan gaplashadi'], ['javon chizmasi', 'Entity', 'jadval shakli'], ['buyurtma anketasi', 'DTO', "kiruvchi ma'lumot shakli"], ['nazoratchi', 'Guard', 'tokenni tekshiradi'], ['bir xil lagan', 'successRes', 'javob shakli'], ['shtat jadvali', 'Module', "ro'yxat"]];
const S25b = {
  kicker: "7-bosqich · o'quvchi darsini o'tish", title: "O'quvchi darsining tili: restoran",
  segments: [
    { id: 'a', key: "O'quvchi darsi <b>restoran tilida</b> gapiradi: ofitsiant, oshpaz, omborchi…", text: "Loyihaning fayllarini ko'rdik. Endi o'quvchi shu fayllarni qanday so'zlar bilan eslashini bilib olaylik. O'quvchi darsi restoran tilida gapiradi: Controller ofitsiant, Service oshpaz, Repository omborchi, Guard nazoratchi, Module shtat jadvali. O'quvchi shu so'zlarda o'ylaydi.", n: 8 },
    { id: 'b', key: "O'quvchi «oshpaz» desa — siz <b>Service</b> ekanini bilasiz va faylni ko'rsatasiz", text: "Siz endi ikkala tilni bilasiz: o'quvchi oshpaz desa, siz Service ekanini bilasiz va to'g'ri faylni ko'rsatasiz. Darsda ikkala so'zni birga ayting: oshpaz, ya'ni Service.", n: 8 },
    { id: 'c', key: "Xulosa: metafora <b>vazifani</b> tushuntiradi, kodni emas — ikkala so'zni birga ayting", text: "Xulosa va bitta ogohlantirish: metafora vazifani tushuntiradi, kodni emas. O'quvchi ofitsiant oshxonaga kirmaydi deganda, Controller Service'ni chaqiradi, lekin ichida hisob qilmaydi degan ma'noni tushunsin. Shu chegarani siz ushlab turasiz.", n: 8 },
  ],
};
// F-1120-02: jadval o'rniga — o'quvchi loyihasining yo'li, har bekatda restoran so'zi va atama (KitchenMap, DICT dan)
function Screen25b(p) {
  return <Lesson p={p} S={S25b} scene={({ beat }) => <div className="mk-light" style={{ padding: 16 }}>
    <KitchenMap beat={beat} dict={DICT} />
    <Block at={2} beat={beat}><div className="mk-rule" style={{ marginTop: 12 }}>{t(<>Ikkala so'zni birga ayting: <b>«oshpaz, ya'ni Service»</b>. Metafora vazifani tushuntiradi, kodni emas.</>, <>Говорите оба слова вместе: <b>«повар, то есть Service»</b>. Метафора объясняет задачу, а не код.</>)}</div></Block>
  </div>} />;
}

// --- O'tish rejasi 1: o'quvchi darsining xaritasi (m4a-01, 22 ekran) ---
const MAP = [
  { t: 'Kirish', s: 's0–s1', d: "1240 qatorli server.js og'rig'i → «tayyor loyihani clone qilamiz», 4 qadam rejasi", m: "Siz buni shu darsning 2-ekranida ko'rdingiz: o'quvchi ham aynan shu og'riqdan boshlaydi. Nest nomini erta aytmang, avval og'riq." },
  { t: 'Clone va ishga tushirish', s: 's2–s4', d: "git clone + npm install, .env to'ldirish, start:dev; test: kalit qayerda turadi", m: "Eng ko'p vaqt shu yerda ketadi. Hammaning serveri ishlamaguncha oldinga o'tmang." },
  { t: 'Swagger va bino xaritasi', s: 's5–s8', d: "Swagger eshiklari (endpoint'lar), papka strukturasi; test: Controller vazifasi", m: "«Ofitsiant» so'zi shu yerda kiradi. Strukturada yashil fayllarni (module/controller/service) o'zingiz ko'rsating." },
  { t: "Buyurtma yo'li", s: 's9–s10', d: 'Guard → Controller → Service → Repository → successRes tartibi sudrab teriladi; test', m: "Bu bizning «so'rov yo'li» ekranimiz, faqat ikki bekat ko'p: Guard tokenni tekshiradi, Repository bazaga yozadi. Har biriga bir gap — 31-ekrandagi tayyor gaplar." },
  { t: 'Qatlamlar', s: 's11–s16', d: 'Entity/BaseEntity, DTO (201/400), BaseService (CRUD tayyor), Module (smena), 5 qadam tartibi; test', m: "Chuqur emas: har biriga bir gap. Entity — jadval shakli, DTO — kiruvchi ma'lumot shakli (noto'g'ri bo'lsa 400), BaseService — tayyor CRUD, Module — ro'yxat. Xavotir olmang: Entity, DTO va Repository'ni kursdagi keyingi mentor darslarida to'liq, kodi bilan o'rganasiz." },
  { t: 'Qurish va yakun', s: 's18–s20', d: "AI 5 faylni yozadi, yakuniy debugging (xato qatorni olib tashlash), amaliy topshiriq, arena, kartochkalar", m: "Debugging ekranida siz bugun o'rgangan qoida ishlaydi: Controller'da hisob bo'lmaydi." },
];
const R1 = {
  kicker: "7-bosqich · o'tish rejasi", eyebrow: "m4a-01 · «Nest arxitektura — tirik ko'rish»", title: "O'quvchi darsining xaritasi: 6 blok, 22 ekran",
  segments: [
    { id: 'a', key: "O'quvchi darsi <b>m4a-01</b>: 6 blok, 22 ekran — har blokda siz nima deysiz", text: "Loyihani ham, o'quvchi tilini ham bilasiz. Endi o'quvchi darsining o'zini ekranma-ekran ko'ramiz, chunki siz uni o'tasiz. Yigirma ikki ekran, oltita blok. Har blok uchun o'quvchi nima qiladi va siz nima deysiz.", hl: [] },
    { id: 'b', key: "1-blok · kirish: o'quvchi ham <b>o'sha og'riqdan</b> boshlaydi — Nest nomini erta aytmang", text: "Birinchi blok, kirish: o'quvchi ming ikki yuz qirq qatorli faylni ko'radi va tayyor loyihani clone qilish rejasini oladi. Siz buni shu darsning boshida ko'rdingiz. Nest nomini erta aytmang, avval og'riq.", hl: [0] },
    { id: 'c', key: "2-blok · clone va ishga tushirish: <b>eng ko'p vaqt</b> shu yerda ketadi", text: "Ikkinchi blok, clone va ishga tushirish: git clone, npm install, env fayli, start dev. Eng ko'p vaqt shu yerda ketadi. Hammaning serveri ishlamaguncha oldinga o'tmang.", hl: [1] },
    { id: 'd', key: "3-blok · Swagger va papka strukturasi: <b>«ofitsiant»</b> so'zi shu yerda kiradi", text: "Uchinchi blok: Swagger'da eshiklarni ko'radi, keyin papka strukturasini. Ofitsiant so'zi shu yerda kiradi. Strukturada module, controller, service fayllarini o'zingiz ko'rsating.", hl: [2] },
    { id: 'e', key: "4-blok · buyurtma yo'li: bizning so'rov yo'li + <b>Guard va Repository</b>", text: "To'rtinchi blok, buyurtma yo'li: o'quvchi nazoratchi, ofitsiant, oshpaz, omborchi, lagan tartibini sudrab teradi. Bu bizning so'rov yo'li ekranimiz, faqat ikki bekat ko'p: Guard tokenni tekshiradi, Repository bazaga yozadi. Har biriga bitta gap yetarli.", hl: [3] },
    { id: 'f', key: "5-blok · qatlamlar: Entity, DTO, BaseService — <b>har biriga bir gap</b>, chuqur emas", text: "Beshinchi blok, qatlamlar: Entity, DTO, BaseService, Module va besh qadam tartibi. Chuqur emas, har biriga bir gap. Entity, jadval shakli. DTO, kiruvchi ma'lumot shakli, noto'g'ri bo'lsa to'rt yuz. BaseService, tayyor CRUD metodlari. Module, ro'yxat. Xavotir olmang: Entity, DTO va Repository'ni kursdagi keyingi mentor darslarida to'liq, kodi bilan o'rganasiz. O'quvchi darsining bu blokida esa bir gap yetarli.", hl: [4] },
    { id: 'g', key: "6-blok · AI bilan qurish va debugging: <b>Controller'da hisob bo'lmaydi</b> qoidasi ishlaydi", text: "Oltinchi blok: o'quvchi AI'ga beshta faylni yozdiradi, keyin yakuniy debugging, xato qatorni topib olib tashlaydi, so'ng amaliy topshiriq va arena. Debugging ekranida siz bugun o'rgangan qoida ishlaydi: Controller'da hisob bo'lmaydi.", hl: [5] },
    { id: 'h', key: "Xulosa: eng ko'p kuch — <b>2-blok (server)</b> va <b>6-blok (debugging)</b>", text: "Xulosa: oltita blokdan ikkitasi sizdan eng ko'p kuch talab qiladi. Ikkinchisi, chunki hammaning serveri ishlashi kerak. Oltinchisi, chunki debugging'da bugungi qoidani o'quvchi o'zi topishi kerak.", hl: [1, 5] },
  ],
};
function ScreenR1(p) {
  return <Lesson p={p} S={R1} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{seg.hl.includes(i) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>{t('Siz: ', 'Вы: ')}{b.m}</div>}</div>
    </div>)}
  </div>} />;
}

// --- O'tish rejasi 2: o'quvchilar xato qiladigan joylar ---
const STUMBLE = [
  { q: 'git clone ishlamaydi', a: "Git o'rnatilmagan yoki internet yo'q. Zaxira: GitHub'dan ZIP yuklab olib ochish. Darsdan oldin o'zingiz bir marta clone qilib ko'ring." },
  { q: 'npm install uzoq yoki xato', a: "Sabr: 2–5 daqiqa normal. Xato bo'lsa Node versiyasini tekshiring (20+), node_modules'ni o'chirib qayta urining." },
  { q: ".env to'ldirilmagan — server yiqiladi", a: "Loyiha PostgreSQL'ga ulanadi: «Unable to connect to the database» — ikkinchi satr sababni aytadi (keyingi ekranda to'rt xabar). cp .env.example .env, keyin PostgreSQL ishlayotganini tekshiring." },
  { q: 'Port 3000 band', a: "Oldingi dars serveri ochiq qolgan. Uni yoping yoki PORT=3001 bilan ishga tushiring." },
  { q: "«can't resolve dependencies»", a: "Siz endi o'qiy olasiz: qaysi klass, qaysi dependency, qaysi fayl. O'quvchi bilan birga terminaldagi xabarni o'qing, javobni aytmang, savol bering: qaysi fayl? qaysi ro'yxat?" },
  { q: '«Nega Express emas?» yoki metafora chalkashdi', a: "Bitta gap: katta loyihada tartib kerak, Nest tartibni majburiy qiladi, ichida o'sha Express. Metafora chalkashsa lug'atga qaytaring: oshpaz, ya'ni Service." },
];
const R2 = {
  kicker: "7-bosqich · o'tish rejasi", eyebrow: "m4a-01 · darsda nima bo'ladi", title: "O'quvchilar xato qiladigan 6 joy",
  segments: [
    { id: 'a', key: "Sinfda <b>albatta</b> uchraydigan 6 holat — har biriga tayyor javobingiz bo'lsin", text: "Rejani bilasiz. Endi reja buziladigan joylarni ko'raylik: darsda albatta uchraydigan oltita holat. Har biriga tayyor javobingiz bo'lsin.", hl: [] },
    { id: 'b', key: "1 · <code>git clone</code> ishlamaydi → zaxira: GitHub'dan <b>ZIP yuklab olish</b>", text: "Birinchi: git clone ishlamaydi. Git o'rnatilmagan yoki internet yo'q. Zaxira: GitHub'dan ZIP yuklab olib ochish. Darsdan oldin o'zingiz bir marta clone qilib ko'ring.", hl: [0] },
    { id: 'c', key: "2 · <code>npm install</code> uzoq yoki xato → 2–5 daqiqa normal, <b>Node 20+</b>", text: "Ikkinchi: npm install uzoq yoki xato. Ikki-besh daqiqa normal. Xato bo'lsa Node versiyasini tekshiring, yigirma yoki undan yuqori bo'lsin, node modules papkasini o'chirib qayta urining.", hl: [1] },
    { id: 'd', key: "3 · <code>.env</code> yo'q yoki PostgreSQL ishlamaydi → server <b>yiqiladi</b>", text: "Uchinchi, eng muhimi: env fayli yaratilmagan. Loyiha PostgreSQL'ga ulanadi. Bazaning manzili bo'lmasa yoki PostgreSQL ishlamasa, server ishga tushmaydi: Unable to connect to the database. Keyingi ekranda shu xatoning to'rt ko'rinishini o'qiymiz.", hl: [2] },
    { id: 'e', key: "4 · port 3000 band → <b>oldingi serverni yoping</b> yoki boshqa port bering", text: "To'rtinchi: port uch ming band. Oldingi dars serveri ochiq qolgan. Uni yoping yoki boshqa port bilan ishga tushiring.", hl: [3] },
    { id: 'f', key: "5 · «can't resolve» → o'quvchi bilan <b>birga o'qing</b>, javobni aytmang", text: "Beshinchi: can't resolve dependencies xatosi. Siz endi o'qiy olasiz: qaysi klass, qaysi dependency, qaysi fayl. O'quvchi bilan birga terminaldagi xabarni o'qing, javobni aytmang, savol bering: qaysi fayl, qaysi ro'yxat.", hl: [4] },
    { id: 'g', key: "6 · «Nega Express emas?» → <b>bitta gap</b>: tartib kerak, ichida o'sha Express", text: "Oltinchi: nega Express emas degan savol yoki metafora chalkashuvi. Bitta gap: katta loyihada tartib kerak, Nest tartibni majburiy qiladi, ichida o'sha Express. Metafora chalkashsa lug'atga qaytaring.", hl: [5] },
    { id: 'h0', key: "Ogohlantirish: o'quvchi loyihasida route'lar <code>/api/v1</code> bilan boshlanadi — prefiks unutilsa <b>404</b>", text: "Yana bitta ogohlantirish: o'quvchi loyihasida hamma route api v1 bilan boshlanadi, admin emas, api v1 admin. Prefiks unutilsa to'rt yuz to'rt chiqadi. Bu loyihani keyingi mentor darsida to'liq, clone qilib ko'rasiz.", show: "Yana bitta ogohlantirish: o'quvchi loyihasida hamma route <code>/api/v1</code> bilan boshlanadi — <code>/admin</code> emas, <code>/api/v1/admin</code>; prefiks unutilsa <b>404</b>. Bu loyihani keyingi mentor darsida to'liq, clone qilib ko'rasiz.", hl: [] },
    { id: 'h', key: "Xulosa: darsdan oldin loyihani <b>o'zingiz bir marta ko'taring</b> — o'quvchilar xato qiladigan joyni oldindan bilasiz", text: "Xulosa: bu holatlarning ko'pi darsning birinchi yigirma daqiqasida chiqadi. Shuning uchun darsdan oldin loyihani o'zingiz bir marta clone qilib, env bilan ishga tushirib ko'ring: qayerda qoqilish mumkinligini o'zingiz his qilasiz.", show: "Xulosa: bu holatlarning ko'pi darsning birinchi 20 daqiqasida chiqadi. Darsdan oldin loyihani o'zingiz bir marta clone qilib, .env bilan ishga tushirib ko'ring: qayerda qoqilish mumkinligini o'zingiz his qilasiz.", hl: [] },
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
  { at: 1, m: 'connect ECONNREFUSED 127.0.0.1:5432', s: "PostgreSQL ishlamayapti yoki port noto'g'ri", f: "<b>PostgreSQL'ni ishga tushiring</b>: Windows — Services → postgresql → Start · Mac — <code>brew services start postgresql</code> · Linux — <code>sudo systemctl start postgresql</code>. Keyin .env'dagi port 5432 ekanini tekshiring" },
  { at: 2, m: 'client password must be a string', s: ".env yo'q yoki DEV_DB_URL o'qilmagan (parol undefined)", f: "<b>Loyiha papkasida: <code>cp .env.example .env</code></b> (Windows: <code>copy .env.example .env</code>). Ichida <code>DEV_DB_URL</code> tayyor — parolni o'zingiznikiga almashtiring, serverni qayta ishga tushiring" },
  { at: 3, m: 'password authentication failed for user', s: ".env'dagi parol yoki foydalanuvchi noto'g'ri", f: ".env.example'da parol shunchaki <code>password</code> — <code>DEV_DB_URL</code>'ga o'z PostgreSQL parolingizni yozing; <code>psql -U postgres</code> bilan sinang" },
  { at: 4, m: 'database "…" does not exist', s: "ulanish va parol to'g'ri, lekin shu nomli baza yaratilmagan", f: "bazani yarating: <code>createdb -U postgres nestarxitechture</code> (nom — DEV_DB_URL oxiridagi so'z)" },
];
const RDB = {
  kicker: "7-bosqich · o'tish rejasi", eyebrow: "m4a-01 · sinfda eng ko'p chiqadigan xato", title: "Baza ulanmadi: to'rt xabar, to'rt sabab",
  segments: [
    { id: 'a', key: "O'quvchi loyihasi <b>PostgreSQL'ga ulanadi</b> — sinfdagi 1-xato shu, sabab doim <b>2-satrda</b>", text: "Oldingi ekrandagi uchinchi holatni, env va PostgreSQL'ni, alohida ko'ramiz, chunki sinfda eng ko'p vaqt shunga ketadi. Bugun to'rt Nest xatosini o'rgandingiz. Lekin sinfda eng ko'p chiqadigani boshqa: o'quvchi loyihasi PostgreSQL'ga ulanadi, va ulanish ko'pincha birinchi urinishda bo'lmaydi. Xabar har doim bir xil boshlanadi: Unable to connect to the database, Retrying. Sabab esa ikkinchi satrda. To'rtta haqiqiy holat." },
    { id: 'b', key: "1 · <b>ECONNREFUSED</b> → PostgreSQL ishlamayapti: <b>PostgreSQL'ni ishga tushiring</b>", text: "Birinchi: connect ECONNREFUSED, manzil va port. Demak shu portda hech kim javob bermayapti: PostgreSQL ishlamayapti yoki env faylida port noto'g'ri. Yechim: PostgreSQL'ni ishga tushiring. Windows'da Services oynasida postgresql'ni Start qilasiz, Mac va Linux'da jadvaldagi buyruq bilan. Keyin portni tekshiring.", show: "<b>connect ECONNREFUSED 127.0.0.1:5432</b>: shu portda hech kim javob bermayapti — PostgreSQL ishlamayapti yoki .env'dagi port noto'g'ri. Yechim: <b>PostgreSQL'ni ishga tushiring</b> (Windows: Services → postgresql → Start; Mac/Linux: jadvaldagi buyruq), keyin portni tekshiring." },
    { id: 'c', key: "2 · <b>client password must be a string</b> → .env yo'q: <code>cp .env.example .env</code>", text: "Ikkinchi, eng chalg'ituvchisi: client password must be a string. Bu parol noto'g'ri degani emas. Parol umuman yo'q, undefined: env fayli yo'q. O'quvchi loyihasida tayyor namuna bor, env example fayli. Yechim bitta: shu namunadan nusxa olib, env faylini yaratish, ichidagi parolni o'ziniki bilan almashtirish va serverni qayta ishga tushirish. Sinfda buni hammaga birinchi bo'lib ayting.", show: "<b>client password must be a string</b> — eng chalg'ituvchisi: parol noto'g'ri emas, parol <b>umuman yo'q</b> (undefined) — .env fayli yo'q. Loyihada tayyor namuna bor: <b>.env.example</b>. Yechim: <code>cp .env.example .env</code>, ichidagi parolni o'zingiznikiga almashtiring, serverni qayta ishga tushiring. Sinfda buni hammaga birinchi bo'lib ayting." },
    { id: 'd', key: "3 · <b>password authentication failed</b> → .env'dagi parol noto'g'ri: <b>o'z parolingizni</b> yozing", text: "Uchinchi: password authentication failed for user. Bu endi haqiqatan parol yoki foydalanuvchi nomi noto'g'ri. Sinfda bu tez-tez chiqadi, chunki env example'dagi parol shunchaki password so'zi. Yechim: DEV DB URL ichiga o'quvchining o'z PostgreSQL parolini yozish.", show: "<b>password authentication failed for user \"postgres\"</b>: endi haqiqatan parol yoki foydalanuvchi noto'g'ri. Sinfda tez-tez chiqadi: .env.example'dagi parol shunchaki <code>password</code>. Yechim: <code>DEV_DB_URL</code>'ga o'z PostgreSQL parolingizni yozing." },
    { id: 'd2', key: "4 · <b>database … does not exist</b> → baza yaratilmagan: <code>createdb</code>", text: "To'rtinchi: database, nomi, does not exist. Ulanish bor, parol ham to'g'ri, lekin PostgreSQL'da bunday nomli baza yo'q: uni hali hech kim yaratmagan. O'quvchi loyihasida nom DEV DB URL oxirida, nestarxitechture. Yechim: shu nom bilan bazani yaratish.", show: "<b>database \"…\" does not exist</b>: ulanish va parol to'g'ri, lekin bunday nomli baza <b>yaratilmagan</b>. O'quvchi loyihasida nom <code>DEV_DB_URL</code> oxirida: <code>nestarxitechture</code>. Yechim: <code>createdb -U postgres nestarxitechture</code>." },
    { id: 'e', key: "Xulosa: «Unable to connect» → <b>kodga tegmang</b> — 2-satrni o'qing, .env va PostgreSQL'ni tekshiring", text: "TypeORM o'n marta qayta urinadi, keyin server yiqiladi. Xulosa va qoida: Unable to connect ko'rsangiz, kodga tegmang, muammo kodda emas. Ikkinchi satrni o'qing, env faylini va PostgreSQL'ni tekshiring. Bu to'rt xabar eslatmada ham bor." },
  ],
};
function ScreenRdb(p) {
  return <Lesson p={p} S={RDB} scene={({ seg, beat }) => (<>
    {beat < 5 && <CodePanel file={t('terminal — haqiqiy chiqishlar (sinovdagi baza nomi: cars_db)', 'terminal — реальный вывод (имя базы в проверке: cars_db)')} numbers={false} wrap style={{ background: '#1F1115' }} beat={beat} lines={DB_ERRS.filter((l) => l.at === Math.min(beat, 4) || l.at == null)} focus={beat >= 1 && beat <= 4 ? ['db' + beat] : []} />}
    <Block at={1} beat={beat}><table className="mk-tbl"><thead><tr><th>{t('xabar (2-satr)', 'сообщение (2-я строка)')}</th><th>{t('sabab', 'причина')}</th><th>{t('yechim', 'решение')}</th></tr></thead><tbody>
      {DB_ROWS.filter((r) => r.at <= beat).map((r, i) => <tr key={i} className={r.at === beat ? 'hl' : ''}><td><code>{r.m}</code></td><td>{r.s}</td><td dangerouslySetInnerHTML={html(r.f)} /></tr>)}
    </tbody></table></Block>
    <Block at={5} beat={beat}><div className="mk-rule">{t(<><b>«Unable to connect»</b> → TypeORM 10 marta qayta urinadi, keyin server yiqiladi. <b>Kodga tegmang:</b> 2-satrni o'qing, <code>.env</code> va PostgreSQL'ni tekshiring.</>, <><b>«Unable to connect»</b> → TypeORM делает 10 попыток, потом сервер падает. <b>Код не трогайте:</b> прочитайте 2-ю строку, проверьте <code>.env</code> и PostgreSQL.</>)}</div></Block>
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
    { id: 'a', key: "Taklif: <b>90 daqiqa, oltita bo'lak</b> — sinfingizga qarab o'zgartirasiz", text: "O'quvchilar xato qiladigan joylarni va ularning yechimini bilasiz. Endi vaqtni rejalaymiz. Taklif qilingan vaqt rejasi: to'qson daqiqa, oltita bo'lak. Bu taklif, sinfingizga qarab o'zgartirasiz.", hl: [] },
    { id: 'b', key: "0–30: kirish va clone — <b>hammada server ishlaguncha</b> oldinga o'tmang", text: "Birinchi o'ttiz daqiqa: kirish va clone. Eng xavfli bo'lak clone va ishga tushirish, shuning uchun unga yigirma daqiqa.", hl: [0, 1] },
    { id: 'c', key: "30–60: Swagger, papkalar xaritasi, <b>buyurtma yo'li</b> va uchta test", text: "O'ttizdan oltmishgacha: Swagger, bino xaritasi, buyurtma yo'li va uchta test.", hl: [2, 3] },
    { id: 'd', key: "60–90: qatlamlar, <b>AI bilan qurish</b>, debugging va arena", text: "Oltmishdan to'qsongacha: qatlamlar, AI bilan qurish, yakuniy debugging va arena.", hl: [4, 5] },
    { id: 'e', key: "Xulosa — uch qoida: <b>server avval · ikki so'z birga · xabarni birga o'qish</b>", text: "Xulosa: uch qoida. Birinchi: hammaning serveri ishlamaguncha oldinga o'tmang. Ikkinchi: metafora va atamani birga ayting, oshpaz, ya'ni Service. Uchinchi: xato chiqsa terminaldagi xabarni o'quvchi bilan birga o'qing, javobni aytmang.", hl: [] },
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
      {t([['Server avval', "hammada ishlamaguncha oldinga o'tmang"], ["Ikki so'z birga", '«oshpaz, ya\'ni Service»'], ['Xabarni birga o\'qing', "javobni aytmang, savol bering"]], [['Сначала сервер', 'пока не работает у всех, дальше не идите'], ['Два слова вместе', '«повар, то есть Service»'], ['Читайте сообщение вместе', 'ответ не говорите, задавайте вопрос']]).map(([h, d], i) => <div key={h} className="mk-card" style={{ borderColor: T.accent, animation: `mk-up .4s ${i * 0.15}s ease both` }}><h5 style={{ color: T.accent }}>{h}</h5><div style={{ fontSize: 13 }}>{d}</div></div>)}
    </div></Block>
  </>)} />;
}

// --- S26 O'quvchi so'raydigan savollar ---
const QA = [
  ['Nega Express emas, Nest?', "Loyiha katta bo'lganda tartib kerak; Nest tartibni majburiy qiladi, ichida esa o'sha Express."],
  ["Decorator nima o'zi?", "Klass yoki metod ustidagi belgi; Nest'ga shu narsa nima ekanini aytadi, kod bajarmaydi."],
  ['providers nima?', "Shu modul yaratib beradigan narsalar, asosan Service'lar."],
  ["Service'ni nega alohida qildik?", "Alohida sinash va qayta ishlatish uchun; Controller'da esa logika qolmaydi."],
  ["Nest Express'dan tezmi?", "Yo'q, tezlik bir xil, ichida Express. Nest tezlik emas, tartib beradi."],
  ["Injectable'ni o'chirdim, ishlayapti. Kerak emasmi?", "Dependency'si bo'lmagani uchun ishladi; dependency paydo bo'lganda server ishga tushadi, lekin so'rovda 500 TypeError — yashirin xato. Shuning uchun doim yoziladi."],
];
const S26 = {
  kicker: "7-bosqich · savollar", title: "O'quvchi so'raydigan savollar",
  segments: [
    { id: 'a', key: "Darsda sizga beriladigan <b>6 savol</b> va tayyor javoblar", text: "Dars rejasi tayyor. Oxirgi tayyorgarlik: o'quvchi sizga beradigan savollar. Ular taxminan shular bo'ladi.", hl: [] },
    { id: 'q1', key: "1 · «Nega Express emas?» → katta loyihada <b>tartib kerak</b>, ichida o'sha Express", text: "Birinchisi: nega Express emas, Nest? Javob: loyiha katta bo'lganda tartib kerak, Nest tartibni majburiy qiladi, ichida esa o'sha Express.", hl: [0] },
    { id: 'q2', key: "2 · «Decorator nima?» → klass ustidagi <b>belgi</b>: Nest'ga «bu nima»ligini aytadi", text: "Ikkinchisi: decorator nima? Klass yoki metod ustidagi belgi, Nest'ga shu narsa nima ekanini aytadi.", hl: [1] },
    { id: 'q3', key: "3 · «providers nima?» → modul <b>yaratib beradigan</b> narsalar, asosan Service'lar", text: "Uchinchisi: providers nima? Shu modul yaratib beradigan narsalar, asosan Service'lar.", hl: [2] },
    { id: 'q4', key: "4 · «Nega alohida Service?» → <b>alohida sinash</b> va qayta ishlatish uchun", text: "To'rtinchisi: Service'ni nega alohida qildik? Alohida sinash va qayta ishlatish uchun, Controller'da esa logika qolmaydi.", hl: [3] },
    { id: 'q5', key: "5 · «Nest tezroqmi?» → yo'q, ichida Express; Nest <b>tezlik emas, tartib</b> beradi", text: "Beshinchisi: Nest tezmi? Yo'q, tezlik bir xil, chunki ichida Express. Nest tezlik emas, tartib beradi.", hl: [4] },
    { id: 'q6', key: "6 · «Injectable'siz ishlayapti-ku?» → hozircha; dependency qo'shilsa — <b>yashirin xato, 500</b>", text: "Oltinchisi: Injectable'ni o'chirdim, ishlayapti. Dependency'si bo'lmagani uchun; dependency paydo bo'lganda server ishga tushadi, lekin so'rovda besh yuz, yashirin xato. Shuning uchun doim yoziladi.", hl: [5] },
    { id: 'z', key: "Xulosa: javob bera olmagan savolingiz bo'lsa — <b>darsdagi o'sha ekranga</b> qayting", text: "Xulosa: bu oltita javob sizda tayyor bo'lsin. Har kartani bosib, javobni o'zingiz yana o'qing. O'zingiz javob bera olmaydigan savol bo'lsa, darsdagi o'sha ekranga qayting.", hl: [], closeAll: true },
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
  { q: "@Controller('cars') va @Get(':id') birga qaysi path'ni ochadi?", o: ['/cars?id=5', '/id/cars', '/cars/5', '/:id/cars'], c: 2, e: "Controller prefiksi + metod yo'li.", s: 18 },
  { q: 'POST metodida status yozilmagan. Nest nima qaytaradi?', o: ['200', '201', '204', '202'], c: 1, e: "Nest POST uchun 201 ni o'zi qo'yadi.", s: 20 },
  { q: "«Nest can't resolve dependencies of the X (?)» — so'roq belgisi nimani bildiradi?", o: ["Noma'lum modul — import yo'q", "Topilmagan argumentning o'rni", "Sintaksis xatosi — qavs yopilmagan", "Route yo'q — Controller bo'sh"], c: 1, e: 'Qavs ichida konstruktor argumentlari, ? — topilmagani.', s: 23 },
  { q: "Server «successfully started», /cars 404, terminalda Mapped {/cars…} yo'q. Eng ehtimoliy sabab?", o: ["CarsModule AppModule imports'ida yo'q", "Injectable yo'q — CarsService ulanmagan", "Port band — server boshqa portda", "Service'da xato — u 404 qaytaradi"], c: 0, e: "Yashirin xato: modul ulanmagan, Nest papkani o'qimagan.", s: 24 },
  { q: "Service ichida throw new Error('x'). Mijozga nima boradi?", o: ['404 va «x»', '500 Internal server error', '400', 'Hech narsa, server yiqiladi'], c: 1, e: 'Oddiy Error → 500, xabar yashiriladi.', s: 28 },
  { q: "Yangi xabar: «Nest can't resolve dependencies of the UsersService (?, JwtService). Please make sure that the argument ConfigService at index [0] is available in the UsersModule module.» Nima qilasiz?", o: ["users.module.ts — providers'ga ConfigService", "users.service.ts — konstruktordan JwtService'ni o'chirish", "app.module.ts — controllers'ga UsersService qo'shish", "UsersService'ga @Injectable() qo'shish"], c: 0, e: "Klass: UsersService · dependency: ConfigService, index [0] · fayl: users.module.ts (UsersModule). JwtService topilgan (ikkinchi o'rin), muammo unda emas.", s: 23 },
  { q: "orders.module.ts: controllers: [OrdersController], providers: [] — OrdersController konstruktorida OrdersService so'ralgan. Server nima qiladi?", o: ["Ishga tushadi, /orders → 404 qaytadi", "Yiqiladi: can't resolve dependencies (?)", "Ishga tushadi, /orders → 500 qaytadi", "Yiqiladi: invalid controller detected"], c: 1, e: "providers bo'sh → Nest OrdersService'ni topa olmaydi → ishga tushishda yiqiladi (1-buzish bilan bir xil).", s: 23 },
];
function Screen27(p) {
  const st = p.stored || {};
  // Kirish gapi holatga qarab (F-1030-19): birinchi marta — sinov sharti; natijadan ekranga borib qaytganda — xatolarni o'rganishda davom etish;
  // o'tgan bo'lsa — natija saqlangan. Qayta o'qilmaydi.
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = LANG === 'ru' ? (!st.showResult
      ? 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов. Это честная проверка себя: на каждый вопрос одна попытка, после ответа открывается верный вариант и пояснение. Шесть и больше — урок усвоен. Если меньше, вернётесь к указанным экранам и пройдёте тест заново.'
      : sc >= 6
        ? 'Ваш результат сохранён: ' + sc + ' из восьми. Урок усвоен, нажмите «Далее».'
        : 'Хорошо, одну ошибку вы разобрали. Вернитесь и к экранам остальных красных вопросов. Когда будете готовы, нажмите кнопку «Пройти тест заново».')
      : !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol. Bu o'zingizni halol o'lchash: har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
      : sc >= 6
        ? "Natijangiz saqlangan: sakkizdan " + ['nol', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz'][sc] + ". Dars o'zlashtirilgan, Davom bosing."
        : "Yaxshi, bir xatoyingizni ko'rib chiqdingiz. Qolgan qizil savollarning ekranlariga ham qayting. Tayyor bo'lgach, Sinovni qayta topshirish tugmasini bosing.";
    return p.review ? [] : [{ id: 'intro', text: voice(text), trigger: 'on_mount' }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const audio = useAudio(segs);
  const sfx = useSfx();
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi darsiga kirsangiz, har so'z tanish bo'ladi.", 'Урок усвоен. Теперь, когда вы откроете урок ученика, каждое слово будет знакомым.') : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring. Bu normal holat, Nest birinchi kunda hammaga ham o'tirmaydi.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново. Это нормально: Nest не у всех укладывается в первый день.'))), 400);
  };
  const next = () => { if (i < FINAL.length - 1) { setI(i + 1); save({ i: i + 1 }); } else { setShowResult(true); save({ showResult: true }); } };
  const retake = () => { setRes([]); setI(0); setShowResult(false); setAttempt(attempt + 1); save({ res: [], i: 0, showResult: false, attempt: attempt + 1, score: 0 }); };
  return (
    <Stage kicker={t("O'z-sinov", 'Самопроверка')} idx={p.idx} total={p.total} audio={audio} onBack={p.onBack} onNext={p.onNext} onRestart={p.onRestart} nextReady={finished && showResult} nextDisabled={!(finished && showResult)} lockHint={!finished ? t('Savollarga javob bering', 'Ответьте на вопросы') : t('Natijani oching', 'Откройте результат')}>
      <div className="mk-body" style={{ gridTemplateColumns: '1fr', maxWidth: 980, width: '100%', margin: '0 auto' }}>
        <div className="mk-say mc" style={{ overflow: 'auto', paddingRight: 4 }}>
          {showResult ? (<>
            <p className="mk-eyebrow">{t("O'z-sinov · natija", 'Самопроверка · результат')}{attempt > 1 ? t(` · ${attempt}-urinish`, ` · попытка ${attempt}`) : ''}</p>
            <h2 className="mk-title mc-q" style={{ fontSize: 'clamp(22px,1.9vw,26px)' }}>{score} / {FINAL.length} — {score >= 6 ? t("dars o'zlashtirildi", 'урок усвоен') : t("yana bir ko'rib chiqing", 'посмотрите ещё раз')}</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {FINAL.map((f, k) => <div key={k} className="mk-card" style={{ display: 'flex', gap: 12, alignItems: 'center', borderColor: res[k] && res[k].correct ? T.green : T.accent }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: res[k] && res[k].correct ? T.green : T.accent, minWidth: 22 }}>{res[k] && res[k].correct ? '✓' : '✗'}</span>
                <span style={{ flex: 1, fontSize: 14 }}>{f.q}</span>
                {res[k] && !res[k].correct && p.onGoto && <button className="mk-btn soft sm" onClick={() => p.onGoto(f.s - 1)}>{t(`${f.s}-ekran`, `экран ${f.s}`)}</button>}
              </div>)}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, flexWrap: 'wrap' }}>
              {score < 6 && <button className="mk-btn ghost" onClick={retake}>{t('Sinovni qayta topshirish', 'Пройти тест заново')}</button>}
              <span style={{ color: T.ink2, fontSize: 14 }}>{t('Ekranga qaytib «Davom» bossangiz, shu natijaga qaytasiz.', 'Если вернётесь к экрану и нажмёте «Далее», попадёте обратно к этому результату.')}</span>
            </div>
          </>) : (<>
            <p className="mk-eyebrow">{t("O'z-sinov", 'Самопроверка')} · {i + 1} / {FINAL.length} · {t("bitta urinish · to'g'ri:", 'одна попытка · верно:')} {score}</p>
            <h2 className="mk-title mc-q">{q.q}</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {q.o.map((o, k) => { let cls = 'mk-opt'; if (picked !== null) { if (k === q.c) cls += ' ok'; else if (k === picked) cls += ' bad'; else cls += ' off'; } return <button key={k} className={cls} disabled={picked !== null} onClick={() => pick(k)}><span className="l">{String.fromCharCode(65 + k)}</span><span>{o}</span></button>; })}
            </div>
            {picked !== null && <div className="mk-fb" style={{ '--c': picked === q.c ? T.green : T.accent, '--bg': picked === q.c ? '#E3F5EC' : '#FFF0EB' }}><b>{picked === q.c ? t("To'g'ri", 'Верно') : t("Noto'g'ri — to'g'risi yashil", 'Неверно — правильный ответ зелёный')}</b><span>{q.e}</span></div>}
            {picked !== null && <div style={{ marginTop: 14 }}><button className="mk-btn ready" onClick={next}>{i < FINAL.length - 1 ? t('Keyingi savol →', 'Следующий вопрос →') : t("Natijani ko'rish →", 'Посмотреть результат →')}</button></div>}
          </>)}
        </div>
      </div>
    </Stage>
  );
}

// --- S28 Yakun + eslatma ---
const CHEATSHEET = `# Nest-1 — mentor eslatmasi
## Buyruqlar
npm i -g @nestjs/cli@12 · nest new cars-api -p npm --type cjs --no-observe --skip-skills · npm run start:dev
nest g module cars · nest g controller cars --no-spec · nest g service cars --no-spec
## Uch bo'lak
Controller — so'rovni oladi, Service'ni chaqiradi, qaytaradi (logika yozilmaydi)
Service — ish: hisob, qoida, baza; req/res yo'q; @Injectable()
Module — ro'yxat: imports · controllers · providers; ro'yxatda yo'q = Nest uchun yo'q
## Dependency Injection
constructor(private readonly carsService: CarsService) — siz yaratmaysiz, Nest providers'dan yaratib beradi (1 instance)
## 4 xato
1 «can't resolve dependencies of the X (?) … argument Y at index [0] … in the Z module» → Z modulining providers'iga Y
2 server ishga tushdi, /cars 404, terminalda Mapped {/cars…} yo'q → AppModule imports: [CarsModule]
3 «invalid controller … does not have the @Controller() decorator» → decorator'ni qaytaring
4 @Injectable'siz ishlaydi (dependency yo'q) → dependency qo'shilsa: server ishga tushadi, so'rovda 500 TypeError (yashirin xato) → baribir yoziladi
## Baza ulanmadi (o'quvchi loyihasi, TypeORM — «Unable to connect to the database. Retrying (1)…», 10 urinish, keyin yiqiladi)
connect ECONNREFUSED 127.0.0.1:5432 → PostgreSQL'ni ishga tushiring (Windows: Services → postgresql; Mac: brew services start postgresql; Linux: sudo systemctl start postgresql)
SASL … client password must be a string → .env yo'q: cp .env.example .env, parolni o'zingiznikiga almashtiring
password authentication failed for user → .env.example'dagi parol «password» — DEV_DB_URL'ga o'z parolingiz
database "…" does not exist → createdb -U postgres nestarxitechture (nom — DEV_DB_URL oxirida)
## Yordam
Hech biri mos kelmasa: skrinshot + xato matni → mentor-kurs Telegram guruhi
## Xato turi
HttpException oilasi (NotFound 404, BadRequest 400, Unauthorized 401, Forbidden 403) → status + xabar · oddiy Error → 500, xabar yashirin
## Javoblar
GET /cars 200 · GET /cars/1 200 · GET /cars/99 404 · POST /cars 201 (o'zi) · /cars/abc → 404 «NaN» (tekshiruv yo'q; @Param('id', ParseIntPipe) yoki DTO + ValidationPipe → 400)
## O'quvchi darsi tili
ofitsiant=Controller · oshpaz=Service · omborchi=Repository · javon chizmasi=Entity · anketa=DTO · nazoratchi=Guard · shtat jadvali=Module
## Uch qoida (dars o'tishda)
hammada server ishlaguncha oldinga o'tmang · «oshpaz, ya'ni Service» · xato chiqsa terminaldagi xabarni birga o'qing, javobni aytmang
## Uyga vazifa
cars-api'ga users moduli: nest g module/controller/service users · Service: ro'yxat + findAll/findOne/create, topilmasa NotFoundException · Controller: GET /users · GET /users/:id · POST /users · bir marta ataylab buzing (providers bo'sh) va tuzating · GitHub'ga push → repo linki platformadagi uyga vazifaga`;
// --- S28 Yakun (F-1030-20): Barakalla → animatsion xulosa (so'rov yo'li qayta chiziladi, 6 band birin-ketin) → uyga vazifa → eslatma → «Darsni yakunlash» ---
// hl — xulosa xaritasida yoritiladigan qism: all · ctrl · svc · mod · di · err
const S28_ITEMS = [
  { k: 'all', t: "Nest — Express ustidagi majburiy tartib" },
  { k: 'ctrl', t: "Controller so'rovni oladi — unda logika yozilmaydi" },
  { k: 'svc', t: "Service ishni bajaradi va so'rov haqida bilmaydi" },
  { k: 'mod', t: "Module — ro'yxat, Nest faqat ro'yxatdagini ko'radi" },
  { k: 'di', t: 'Dependency Injection: siz yaratmaysiz, Nest konstruktor orqali beradi' },
  { k: 'err', t: "Nest xatosi o'qiladi: qaysi klass · qaysi dependency · qaysi fayl" },
];
const HOMEWORK = [
  { t: 'users moduli', c: ['nest g module users', 'nest g controller users --no-spec', 'nest g service users --no-spec'] },
  { t: "Service: foydalanuvchilar ro'yxati + findAll, findOne, create; topilmasa NotFoundException", c: [] },
  { t: 'Controller: GET /users · GET /users/:id · POST /users — terminalda 3 ta Mapped', c: [] },
  { t: "Bir marta ataylab buzing (providers'ni bo'shating), xabarni o'qing, tuzating", c: [] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "users moduli"', 'git push'] },
];
const s28Segments = (passed) => s28Ru(passed, [
  passed
    ? { id: 'a', key: "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", text: "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", hl: null }
    : { id: 'a', key: "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", text: "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", hl: null },
  { id: 'b1', key: "Nest — Express ustidagi <b>majburiy tartib</b>", text: "Birinchi: Nest bu Express ustidagi majburiy tartib. Ichida o'sha Express ishlaydi.", hl: 'all' },
  { id: 'b2', key: "<b>Controller</b> so'rovni oladi, Service'ni chaqiradi, javobni qaytaradi — <b>logika yozilmaydi</b>", text: "Ikkinchi: Controller so'rovni oladi, Service'ni chaqiradi va javobni qaytaradi. Unda hisob yo'q.", hl: 'ctrl' },
  { id: 'b3', key: "<b>Service</b> ishni bajaradi va so'rov haqida bilmaydi", text: "Uchinchi: Service ishni bajaradi va so'rov haqida hech narsa bilmaydi. Shuning uchun uni alohida sinash va qayta ishlatish oson.", hl: 'svc' },
  { id: 'b4', key: "<b>Module</b> — ro'yxat: Nest faqat ro'yxatdagini ko'radi", text: "To'rtinchi: Module ro'yxat. Nest faqat ro'yxatda yozilganini ko'radi.", hl: 'mod' },
  { id: 'b5', key: "<b>Dependency Injection</b>: providers'ga yozasiz, konstruktorda so'raysiz — Nest inject qiladi", text: "Beshinchi: Dependency Injection. Siz Service'ni providers'ga yozasiz va konstruktorda so'raysiz, yaratib inject qilishni Nest qiladi.", hl: 'di' },
  { id: 'b6', key: "Nest xatosi <b>o'qiladi</b>: qaysi klass · qaysi dependency · qaysi fayl", text: "Va eng muhimi: Nest xatosi o'qiladi. Xabarda qaysi klass, qaysi dependency yetishmayapti va qaysi faylni ochish kerakligi yozilgan, javob esa ko'pincha modul faylida.", hl: 'err' },
  { id: 'hw', key: "<b>Uyga vazifa</b>: cars-api'ga <code>users</code> modulini o'zingiz qo'shing va GitHub'ga chiqaring", text: "Uyga vazifa. cars api loyihangizga users modulini shu darsdagi usulda qo'shing: uchta CLI buyrug'i, Service'da foydalanuvchilar ro'yxati va findAll, findOne, create metodlari, topilmasa NotFoundException. Controller'da uchta route. Keyin bir marta ataylab buzing, masalan providers'ni bo'shating, xabarni o'qing va tuzating. Tayyor loyihani GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying.", hl: 'hw' },
  { id: 'c', key: "<b>Eslatmani oling</b>: buyruqlar, xatolar, qoidalar va uyga vazifa — bir sahifada", text: "Pastda bir sahifalik eslatma: buyruqlar, to'rt Nest xatosi, baza ulanish xatolari, qoidalar, o'quvchi darsi lug'ati va uyga vazifa. Nusxalab yoki yuklab oling, o'quvchi darsini o'tayotganda yoningizda tursin.", hl: 'note' },
  { id: 'z', key: "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", text: "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", hl: 'note' },
]);
// UZ-RU: ruscha segmentlar parts/08-ru.jsx dagi S28_RU dan (id bo'yicha; 'a' — o'tgan/o'tmagan ikki varianti)
const s28Ru = (passed, segs) => (LANG === 'ru' ? segs.map((s) => ({ ...s, ...(S28_RU[s.id === 'a' ? (passed ? 'a_pass' : 'a_fail') : s.id] || {}) })) : segs);
// F-1120-02: xulosa — darsning o'sha rasmi (Nest mashinasi); har band rasmning o'z qismini yoritadi
function SummaryMap({ hl }) {
  const one = (k) => (hl === k ? 'hl' : 'dim');
  const st = hl === 'ctrl' ? { ctrl: 'hl', svc: 'dim', mod: 'dim', br: 'dim' }
    : hl === 'svc' ? { svc: 'hl', ctrl: 'dim', mod: 'dim', br: 'dim' }
    : hl === 'mod' ? { mod: one('mod'), ctrl: '', svc: '', br: 'dim' }
    : hl === 'di' ? { mod: 'hl', ctrl: 'hl', svc: '', br: 'dim' }
    : hl === 'err' ? { ctrl: 'hl', svc: 'dim', br: 'dim' } : {};
  const read = hl === 'di' ? ['src/cars/cars.controller.ts', '<span class="n1-k">constructor</span>(<span class="n1-k">private readonly</span> carsService: <span class="n1-c">CarsService</span>) {}']
    : hl === 'err' ? ['terminal', "ERROR [ExceptionHandler] Nest can't resolve dependencies of the <span class=\"n1-er\">CarsController (?)</span>."]
    : hl === 'svc' ? ['src/cars/cars.service.ts', 'findAll() { <span class="n1-k">return this</span>.cars; }']
    : hl === 'ctrl' ? ['src/cars/cars.controller.ts', '<span class="n1-d">@Get</span>() findAll() { <span class="n1-k">return this</span>.carsService.findAll(); }'] : null;
  return <div className="mk-light" style={{ padding: 16 }}>
    <NestMachine cfg={N1_CARS} url="localhost:3000/cars" out={hl === 'err' ? null : '[{"id":1,"brand":"Chevrolet",…}, …]'} outKind="code" st={st}
      exp={hl === 'all' ? 'hl' : ''} links={hl === 'mod' || hl === 'di'} modHot={hl === 'mod' || hl === 'di'}
      sock={hl === 'err' ? { ctrl: { t: '(?)', er: true } } : null} readRow read={read}
      tag={t('Bugungi dars — bir qarashda', 'Сегодняшний урок — одним взглядом')} />
  </div>;
}
function Screen28(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET, CHEATSHEET_RU);
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('nest-1-mentor-eslatma.md', 'nest-1-pamyatka-mentora.md'); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s28Segments(passed), [passed]);
  const b = useBeats(segments, p.review);
  const hl = b.seg.hl;
  const phase = hl === 'hw' ? 'hw' : hl === 'note' ? 'note' : 'sum';
  const shown = segments.slice(0, b.beat + 1).filter((s) => s.id.startsWith('b')).length; // nechta xulosa bandi chiqdi
  return (
    <Stage kicker={t('Yakun', 'Итог')} idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onFinish} onRestart={p.onRestart} nextReady={b.done} nextDisabled={!b.done} nextLabel={t('Darsni yakunlash', 'Завершить урок')} lockHint={t("Ustoz gapirib bo'lgach ochiladi", 'Откроется, когда учитель договорит')}>
      <div className="mk-body">
        <Say title={passed ? t('Barakalla! Endi siz bilasiz', 'Отлично! Теперь вы знаете') : t('Endi siz bilasiz', 'Теперь вы знаете')} segments={segments} beat={b.beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk} review={p.review} />
        <div className="mk-scene top" style={{ overflow: 'auto' }}>
          {phase === 'sum' && (<>
            <SummaryMap hl={hl} />
            <div className="mk-plan" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 8 }}>{S28_ITEMS.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both', padding: '9px 12px' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 40–60 daqiqa', 'Домашнее задание · 40–60 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}>{t(<><b>Topshirish:</b> GitHub repo linki → platformadagi uyga vazifangiz. Tekshiruvchi qaraydi: 3 ta Mapped, 404 xabari, buzib-tuzatilgan joy (commit tarixida).</>, <><b>Сдача:</b> ссылка на репозиторий GitHub → ваше домашнее задание на платформе. Проверяющий смотрит: 3 строки Mapped, сообщение 404, место, которое сломали и исправили (в истории commit).</>)}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("O'quvchi reposi: bitta resurs, Guard va sinfdagi xatolar", 'Репозиторий ученика: один ресурс, Guard и ошибки в классе')}</div><div className="exp">{t("Nest-2 · o'quvchi loyihasi IntroNestArxitechture: car resursi 5 qatlamda, token va rollar, sinfdagi xatolar", 'Nest-2 · проект ученика IntroNestArxitechture: ресурс car в 5 слоях, токен и роли, ошибки в классе')}</div></div>
          </div>}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  MUQOVA + ROOT KOMPONENT
// ============================================================
// F-1120-02: muqova — chapda dars nima berishi, o'ngda darsning rasmi (so'rov aylanib turadi); eslatmalar bitta qisqa satrda
function Cover({ onStart, resume }) {
  return (
    <div className="mk-cover"><div className="card n1-cv">
      <div className="tx">
        <p className="mk-eyebrow">{t('Mentor kursi · NestJS', 'Курс для менторов · NestJS')}</p>
        <h1>{t('NestJS arxitekturasi: Module, Controller, Service', 'Архитектура NestJS: Module, Controller, Service')}</h1>
        <p className="af">{t('Bu darsdan keyin siz', 'После этого урока вы')}</p>
        <ul className="ok">
          {t(["so'rov Nest ichida qaysi fayldan qaysi faylga o'tishini chizib bera olasiz", "cars modulini o'z kompyuteringizda qurasiz", "o'quvchilar qiladigan 4 ta xatoni terminal xabaridan taniysiz"], ['сможете нарисовать, из какого файла в какой файл проходит запрос внутри Nest', 'соберёте модуль cars на своём компьютере', 'узнаете 4 ошибки учеников по сообщению в терминале']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars: quloqchin yoki ovozni tekshiring · 1,5–2 soat, 22-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: Node.js 20+, VS Code, terminal", 'Урок со звуком: проверьте наушники или громкость · 1,5–2 часа, после 22-го экрана можно сделать перерыв · Нужно: Node.js 20+, VS Code, терминал')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><NestMachine cfg={N1_APP} out="Hello World!" lanes pkt={{ loop: true, label: t("so'rov", 'запрос') }} fill={[501, 501]} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5a, ScreenP0, Screen5b, Screen6, Screen7, Screen8, Screen9, ScreenP1, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenLC1, Screen16, Screen17, ScreenP2, Screen18, Screen19, Screen20, Screen21, ScreenLC2, Screen22, Screen23, ScreenP3, Screen25a, Screen25b, ScreenR1, ScreenR2, ScreenRdb, ScreenR3, Screen26, Screen27, Screen28];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function NestArchMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
  setLang(lang); // UZ-RU (F-1030-38): render'dan oldin — ma'lumot va t() shu tilda
  useCss();
  useCssN1(); // F-1120-02: Nest mashinasi uslubi (02b-mashina.jsx)
  const total = SCREENS.length;
  const [started, setStarted] = useState(startAt != null);
  const [idx, setIdx] = useState(Math.min(Math.max(0, startAt || 0), total - 1));
  const [answers, setAnswers] = useState({});
  const [returnTo, setReturnTo] = useState(null);
  const [seen, setSeen] = useState({});   // to'liq ko'rilgan ekranlar — qaytib kelganda Davom qulfi yo'q (F-1030-01)
  const [rev, setRev] = useState(0);      // ↺ boshidan: key o'zgaradi → ekran qayta o'rnatiladi (F-1030-05)
  const [mode, setMode] = useState('live');
  const sv = useMentorSave({ id: LESSON_ID, total, startAt, started, idx, answers, seen, setIdx, setAnswers, setSeen, setStarted }); // A12: Orqaga/Davom bilan ko'rilgan ekranga kelinsa — 'review' (tayyor holat, ovozsiz); ↺ va N-ekranga o'tish — 'live'
  const startTime = useRef(Date.now());
  const finished = useRef(false);
  const onAnswer = useCallback((payload) => setAnswers((a) => ({ ...a, [idx]: payload })), [idx]);
  const goto = useCallback((to) => { setMode('live'); setReturnTo(idx); setIdx(Math.max(0, Math.min(to, total - 1))); }, [idx, total]);
  const next = () => { setMode('review'); setSeen((s) => ({ ...s, [idx]: true })); if (returnTo != null) { const r = returnTo; setReturnTo(null); setIdx(r); } else setIdx((i) => Math.min(i + 1, total - 1)); };
  const restart = useCallback(() => { setMode('live'); setRev((r) => r + 1); }, []);
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
  if (!started) return <Cover onStart={sv.start} resume={sv.resume} />;
  const S = SCREENS[idx];
  const fin = Object.values(answers).find((a) => a && a.type === 'final');
  return <S key={`${idx}:${rev}`} idx={idx} total={total} lang={lang} stored={answers[idx]} testScore={fin ? fin.score : 0} seen={!!seen[idx]} review={mode === 'review' && !!seen[idx]} onAnswer={onAnswer} onNext={next} onBack={idx > 0 ? () => { setMode('review'); setIdx((i) => i - 1); } : null} onFinish={finish} onGoto={goto} onRestart={restart} />;
}
