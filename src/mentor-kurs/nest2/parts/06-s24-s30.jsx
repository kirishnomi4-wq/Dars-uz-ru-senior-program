
// ============================================================
//  6-BOSQICH · O'quvchi darslariga ko'prik (24–28)
// ============================================================
const MAP03 = [
  { t: 'Kirish va reja', s: '1–3', d: "«Admin tizimi tayyor — avtosalonda mashina yo'q» → alohida resurs; reja — 5 bosqich; mashina shakli — 4 ustun", m: "«Resurs — bir tur ma'lumot, o'z papkasi, o'z 5 bosqichi»; id ustuni yozilmaydi" },
  { t: '5 bosqich, har bosqichdan keyin test', s: '4–15', d: "Har faylda «qaysi qator shu faylga tegishli» (begona qator — boshqa qatlamdan) · Entity → DTO → Service → Controller → Module → «nega /car 404?»", m: "har bosqichdagi qoida: ustun — Entity, qoida — DTO, super(carRepo) — Service, eshik — Controller, ro'yxat — Module" },
  { t: "So'rov yo'li, agent, debugging", s: '16–18', d: "POST /car sayohati · agent 5 faylni yozadi (playbook) · debugging: agent Controller'ga @Column qo'yib yuborgan — topib olib tashlaydi", m: '«Agent aytganingizni yozadi — nazoratchi sizsiz»' },
  { t: 'Ochilish kuni — haqiqiy loyihada', s: '19', d: "VS Code'da IntroNestArxitechture: car resursi 5 bosqich + AppModule, 6 bandli ro'yxat, «Bajardim — ustozni kuting»", m: "eng ko'p vaqt shu yerda: hammaning /api/v1/car 200 bo'lmaguncha o'tmang" },
  { t: 'Podium, kartochkalar, yakun', s: '20–22', d: '12 kartochka: Resurs, Entity, BaseEntity, DTO, 400, PartialType, BaseService, super, @Post, Module, 404, DI', m: 'kartochkalarni birga o\'qing — har biri bugungi bir ekraningiz' },
];
const S24 = {
  kicker: "6-bosqich · ko'prik", eyebrow: "m4a-03 · «Birinchi resursni qo'lda qo'shish — mashinalar»", title: "m4a-03: o'quvchi siz bugun qilgan ishni qiladi",
  segments: [
    sg('a', "m4a-03 — <b>siz bugun qilgan ish</b>: car resursi, besh bosqich, 22 ekran", "Endi darsning asosiy maqsadi: bu mavzuni o'quvchiga o'tish. Ikkita o'quvchi darsi bor. Birinchisi m4a-03: o'quvchi aynan siz bugun qilgan ishni qiladi, car resursini besh bosqichda qo'shadi. Yigirma ikki ekran.", { hl: [] }),
    sg('b', "Har bosqichda o'quvchi <b>shu faylga tegishli qatorni</b> tanlaydi, keyin test, agent va haqiqiy loyiha", "Har bosqichda o'quvchi qatorlarni tanlaydi, qaysi biri shu faylga tegishli, keyin qisqa test. So'ng agent besh faylni yozadi va o'quvchi agent xatosini topadi. Oxirida amaliyot haqiqiy loyihada. Siz har bosqichda qoidani aytasiz: ustun Entity'da, qoida DTO'da, eshik Controller'da.", { hl: [1, 2] }),
    sg('c', "Diqqat: o'quvchi darsida manzil <b><code>/car</code></b> deb yozilgan — haqiqatda <b>404</b>; <code>/api/v1/car</code> deb tuzating", "Diqqat, birinchi xato. O'quvchi darsida manzil hamma joyda prefikssiz, slesh car deb yozilgan, amaliyot ro'yxatida ham: brauzerda slesh car'ni oching, ikki yuz. Haqiqatda bu to'rt yuz to'rt. Darsdan oldin o'quvchilarga ayting: manzil api v bir slesh car.", { hl: [3], warn: true }),
    sg('d', "90 daqiqaning <b>20 tasi haqiqiy loyihaga</b> ketadi — o'quvchilar eng ko'p shu yerda qoqiladi", "Vaqt rejasi, taklif: to'qson daqiqa. Kirish va reja o'n besh, besh bosqich qirq, agent va xato topish o'n, haqiqiy loyiha yigirma, yakun besh. Eng ko'p qoqiladigan joy haqiqiy loyiha: hammaning car route'i ishlamaguncha oldinga o'tmang.", { hl: [], time: true }),
    sg('e', "Xulosa: o'quvchi darsi <b>«5 fayl»</b> deydi — DTO'ni bitta sanaydi; qoqilganga 2-amaliyot jadvali bilan yordam bering", "Xulosa: o'quvchi darsi besh fayl deydi, ikki DTO'ni bitta deb sanaydi, bu xato emas. Haqiqiy loyihada qoqilgan o'quvchiga ikkinchi amaliyotdagi jadvalingiz bilan yordam berasiz: har xabar va uning yechimi o'sha yerda.", { hl: [1, 3] }),
  ],
};
const TIME03 = [['0–15', 'kirish, reja, mashina shakli'], ['15–55', 'besh bosqich + testlar'], ['55–65', "so'rov yo'li, agent, debugging"], ['65–85', 'Ochilish kuni — haqiqiy loyiha', 1], ['85–90', 'podium, kartochkalar, yakun']];
function Screen24(p) {
  return <Lesson p={p} S={S24} scene={({ seg }) => <>
    {seg.time
      ? <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">{t('m4a-03 · 90 daqiqa (taklif)', 'm4a-03 · 90 минут (предложение)')}</div>
          <div style={{ display: 'grid', gap: 8 }}>{TIME03.map(([a, b, x]) => <div key={a} className={`mk-step${x ? ' hl' : ''}`}><span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 64 }}>{a}</span><div className="t">{b}</div></div>)}</div></div>
      : <div style={{ display: 'grid', gap: 8 }}>
          {MAP03.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
            <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
            <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{t('ekran', 'экраны')} {b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{seg.hl.includes(i) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>{t('Siz: ', 'Вы: ')}{b.m}</div>}</div>
          </div>)}
        </div>}
    {seg.warn && <div className="n2-grid2">
      <div className="mk-card" style={{ borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t("O'quvchi darsida (amaliyot ro'yxati)", 'В уроке ученика (список практики)')}</h5><div style={{ fontSize: 14 }}>«{t("Brauzerda", 'В браузере')} <code>/car</code> {t("ni oching — 200 javobini ko'ring (404 emas)", 'откройте — увидите ответ 200 (а не 404)')}»</div></div>
      <Json st={404}>{t(`GET localhost:3000/car  →  {"statusCode":404,"error":{"message":"Cannot GET /car"}}\nto'g'risi: localhost:3000/api/v1/car`, `GET localhost:3000/car  →  {"statusCode":404,"error":{"message":"Cannot GET /car"}}\nправильно: localhost:3000/api/v1/car`)}</Json>
    </div>}
  </>} />;
}

// ============================================================
//  25 · O'quvchi tili
// ============================================================
const DICT2 = [
  ['javon chizmasi', 'Entity', 'jadval shakli', 'm4a-03'],
  ['buyurtma anketasi · anketa nusxasi', 'DTO · PartialType', "kiruvchi ma'lumot qoidalari", 'm4a-03'],
  ["nazoratchi to'xtatadi → 400", 'ValidationPipe', 'DTO qoidasi buzildi', 'm4a-03'],
  ["tayyor retsept kitobi · omborni ko'rsatadi", 'BaseService · super(carRepo)', 'tayyor CRUD · qaysi jadval', 'm4a-03'],
  ['omborchi', 'Repository', 'jadval bilan ishlash', 'm4a-01'],
  ['ofitsiant · eshik', 'Controller · route', "so'rovni qabul qiladi", 'm4a-01, m4a-03'],
  ["kirish taxtasi — yozilmagan bo'lim ko'rinmaydi → 404", 'Module · AppModule imports', "ro'yxat", 'm4a-03'],
  ["qo'riqchi · 🔒 faqat admin · 🌐 hamma", "Guard · @Roles('admin') · @Roles('public')", 'token va rol', 'm4a-04'],
  ['yorliq — ko\'p kitob bitta yorliqda, yorliq kitobda', '@ManyToOne', 'categoryId kitob jadvalida', 'm4a-04'],
];
const S25 = {
  kicker: "6-bosqich · ko'prik", title: "O'quvchi tili: javon chizmasi, anketa, retsept kitobi…",
  segments: [
    sg('a', "O'quvchi darslari <b>restoran tilida</b> gapiradi — siz ikkala tilni birga aytasiz", "Ikkinchi darsga o'tishdan oldin til. O'quvchi darslari Nest birinchi darsidagidek restoran tilida gapiradi. Siz ikkala tilni bilasiz va sinfda ularni birga aytasiz.", { rows: [] }),
    sg('b', "Entity <b>javon chizmasi</b> deyiladi, DTO — <b>buyurtma anketasi</b>, 400 esa nazoratchi to'xtatgani", "Entity javon chizmasi. DTO buyurtma anketasi, Partial type uning nusxasi. Anketa qoidasi buzilsa nazoratchi to'xtatadi, to'rt yuz.", { rows: [0, 1, 2] }),
    sg('c', "Qolgan qatlamlar oshxona tilida: <b>retsept kitobi</b>, omborchi, ofitsiant va <b>kirish taxtasi</b>", "Base service tayyor retsept kitobi, super qatori omborni ko'rsatadi. Repository omborchi. Controller ofitsiant, har route eshik. Module kirish taxtasi: taxtada yozilmagan bo'lim ko'rinmaydi, to'rt yuz to'rt.", { rows: [3, 4, 5, 6] }),
    sg('d', "Xulosa: KitobShop'da qo'riqchi va yorliq; <b>ikkala so'zni birga</b> ayting — «javon chizmasi, ya'ni Entity»", "KitobShop'da yana ikki so'z: qo'riqchi, bu Guard; yorliq, bu kitobni kategoriyaga bog'lash. Xulosa: ikkala so'zni birga ayting, masalan javon chizmasi, ya'ni Entity. Metafora vazifani tushuntiradi, kodni emas.", { rows: [7, 8] }),
  ],
};
function Screen25(p) {
  return <Lesson p={p} S={S25} scene={({ seg, beat }) => <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">{t("O'quvchi aytadi → siz bilasiz", 'Ученик говорит → вы знаете')}</div>
    <table className="mk-tbl"><thead><tr><th>{t("o'quvchi darsida", 'в уроке ученика')}</th><th>{t('atama', 'термин')}</th><th>{t('vazifa', 'задача')}</th><th>{t('qayerdan', 'откуда')}</th></tr></thead><tbody>
      {DICT2.map(([a, b, c, d], i) => <tr key={a} className={seg.rows.includes(i) ? 'hl' : ''} style={{ opacity: seg.rows.length && !seg.rows.includes(i) ? 0.55 : 1 }}><td>{a}</td><td><code>{b}</code></td><td style={{ color: T.ink2 }}>{c}</td><td style={{ color: T.ink3, fontSize: 12 }}>{d}</td></tr>)}
    </tbody></table>
    <Block at={3} beat={beat}><div className="mk-rule" style={{ marginTop: 12 }}>{t(<>Ikkala so'zni birga ayting: <b>«javon chizmasi, ya'ni Entity»</b>. Metafora vazifani tushuntiradi, kodni emas.</>, <>Говорите оба слова вместе: <b>«чертёж стеллажа, то есть Entity»</b>. Метафора объясняет задачу, а не код.</>)}</div></Block>
  </div>} />;
}

// ============================================================
//  26 · m4a-04 KitobShop va tayyorgarlik
// ============================================================
const MAP04 = ['kirish', 'reja · 3 resurs, Copilot Agent', 'Amaliyot 1 — aniq buyruq', 'Amaliyot 2 — 3 playbook: Category → Book → Order', "Amaliyot 3 — @Roles: qaysi eshik ochiq", "Amaliyot 4 — eshik sinovi: POST /order → 'public'", 'test', 'podium', 'yakun'];
const PREP04 = [
  ['signin va Authorize', "o'quvchi darslarida o'rgatilmagan — 19-ekrandagi ishni sinf bilan birga qiling"],
  ['har o\'quvchida oddiy admin', "playbook'da @Roles('admin'): superadmin bilan 403 — superadmin bilan admin yaratib, KitobShop'ni shu admin bilan sinash"],
  ['kategoriya kitobdan oldin', "yo'q kategoriya bilan 500 (foreign key), id formati noto'g'ri bo'lsa 400"],
];
const BOOK_ENT = ts(String.raw`
@Entity('books')
export class BookEntity extends BaseEntity {
  @Column() title: string;
  @Column() author: string;
  @Column() price: number;
  @Column({ default: false }) is_featured: boolean;

  @ManyToOne(() => CategoryEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @Column() categoryId: string;
}`, { 8: { id: 'm' }, 9: { id: 'm' }, 10: { id: 'm' }, 12: { id: 'm' } });
const S26 = {
  kicker: "6-bosqich · ko'prik", eyebrow: "m4a-04 · «Praktika — KitobShop backend»", title: "KitobShop: o'quvchi buyuradi, agent yozadi — sizning tayyorgarligingiz",
  segments: [
    sg('a', "m4a-04 — <b>uch resurs agent bilan</b>: o'quvchi buyuradi, tekshiradi va shundan keyin qabul qiladi", "Ikkinchi dars m4a-04, KitobShop. Besh qadamni endi Copilot agenti qiladi, uch resurs uchun: kategoriya, kitob va buyurtma. O'quvchi yozmaydi: buyuradi, natijani tekshiruv ro'yxati bilan solishtiradi va shundan keyingina qabul qiladi.", { prep: -1, v: 'map' }),
    sg('b', "Diqqat: o'quvchi darslari <b>token va Authorize'ni o'rgatmaydi</b> — darsning boshida siz ko'rsatasiz", "Diqqat, ikkinchi xato. KitobShop'da yopiq eshiklar bor, ular token so'raydi. Lekin o'quvchi darslarining hech birida signin, token va Authorize o'rgatilmagan. Darsning boshida uchinchi amaliyotdagi ishni o'quvchilar bilan birga qiling: signin va Authorize.", { prep: 0, v: 'prep' }),
    sg('c', "Diqqat: playbook'da <code>@Roles('admin')</code> — <b>superadmin bilan 403</b>; har o'quvchi avval oddiy admin yaratsin", "Uchinchi xato. Playbook'larda yopiq eshiklarga faqat admin yozilgan. Superadmin bilan kirgan o'quvchi kitob qo'sha olmaydi, to'rt yuz uch oladi. Yechim: darsdan oldin har o'quvchi superadmin bilan oddiy admin yaratsin va KitobShop'ni shu admin bilan sinasin.", { prep: 1, v: 'prep' }),
    sg('d', "Yangi narsa — <b><code>ManyToOne</code></b>: kitob kategoriyaga bog'lanadi; yo'q kategoriya → 500, noto'g'ri id → 400", "Darsdagi yangi narsa: kitobni kategoriyaga bog'lash, ManyToOne. Kitob jadvalida kategoriya id'si ustuni va tashqi kalit paydo bo'ladi. Sinab ko'rdik: mavjud bo'lmagan kategoriya bilan besh yuz, terminalda violates foreign key constraint. Id formati noto'g'ri bo'lsa to'rt yuz. Avval kategoriya, keyin kitob.", { prep: 2, v: 'code' }),
    sg('e', "Xulosa: darsdan oldin uch narsa — <b>signin va Authorize</b>, <b>oddiy admin</b>, kategoriya kitobdan oldin", "Xulosa: KitobShop'dan oldin uch narsani tayyorlang: signin va Authorize'ni ko'rsatish, har o'quvchida oddiy admin, va kategoriya kitobdan oldin yaratilishi. Vaqt, taklif: to'qson daqiqaning qirqi uch playbook'ka ketadi, eng xavfli bo'lak, chunki hammaning agenti ishlashi kerak.", { prep: 9, v: 'prep' }),
  ],
};
function Screen26(p) {
  return <Lesson p={p} S={S26} scene={({ seg }) => <>
    {seg.v === 'map' && <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">{t("m4a-04 · 9 ekran", 'm4a-04 · 9 экранов')}</div>
      <div className="mk-plan">{MAP04.map((x, i) => <div key={i} className={i === 3 ? 'hl' : ''}><b>{String(i + 1).padStart(2, '0')}</b><span>{x}</span></div>)}</div></div>}
    {seg.v !== 'map' && <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag" style={{ color: T.accent }}>{t('Darsdan oldin — sizning tayyorgarligingiz', 'Перед уроком — ваша подготовка')}</div>
      <div style={{ display: 'grid', gap: 8 }}>{PREP04.map(([h, d], i) => <div key={i} className={`mk-step${seg.prep === i || seg.prep === 9 ? ' hl' : ''}`} style={{ opacity: seg.prep !== 9 && seg.prep !== i && i > seg.prep ? 0.4 : 1 }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span><div className="t"><b>{h}</b><div style={{ fontSize: 13 }}>{d}</div></div></div>)}</div></div>}
    {seg.v === 'code' && <Ide files={tree(BASE, [F.bEnt, 'src/core/entity/category.entity.ts', F.bMod, F.bCtrl, F.bSvc])} active={F.bEnt}>
      <CodePanel file={F.bEnt} lines={BOOK_ENT} focus={['m']} />
      <Term title="psql · \d books" lines={plainLines(String.raw`
 categoryId  | uuid | not null
 FOREIGN KEY ("categoryId") REFERENCES categories(id) ON DELETE CASCADE`)} />
      <Term er lines={term(String.raw`
POST /api/v1/book {…,"categoryId":"aa8481e7-…b108"}  → 500 Internal server error
QueryFailedError: insert or update on table "books" violates foreign key constraint "FK_a0f13454de3df36e337e01dbd55"
POST /api/v1/book {…,"categoryId":"1"}  → 400 categoryId must be a UUID`)} />
    </Ide>}
  </>} />;
}

// ============================================================
//  27 · Sinfdagi 6 holat va o'quvchi savollari
// ============================================================
const STUMBLE2 = [
  ["O'quvchi darsidagi /car", '404 Cannot GET /car', 'manzil /api/v1/car'],
  ['Kira olmayapti', '401 Admin not fount · bazada nomsiz superadmin', ".env Superadmin bloki; bo'sh yaratilgan bo'lsa — satrni o'chirib qayta yoqish"],
  ["Resurs ko'rinmaydi", "Mapped yo'q + 404 · yoki can't resolve … \"CarEntityRepository\"", 'app.module.ts imports · forFeature'],
  ['Raqamli id', '500 + invalid input syntax for type uuid: "1"', "id — javobdagi uuid"],
  ['Token va rol', '401 Unauthorized · 403 Forbidden resource', "Authorize · @Roles ro'yxati (superadmin va admin — har xil rol)"],
  ["Entity o'zgardi", "column \"…\" contains null values · ma'lumot jim yo'qoldi", "yangi ustun nullable: true · Entity'da nima o'zgarganini so'rang"],
];
const QA2 = [
  ['Nega id raqam emas?', "uuid taxmin qilib bo'lmaydigan noyob matn, ikki server bir vaqtda yozsa ham to'qnashmaydi; BaseEntity'da bir marta yozilgan."],
  ['Nega javob data ichida?', "successRes: hamma muvaffaqiyat bir shaklda, frontend doim data'ni o'qiydi; xato — error.message."],
  ['Terminalda Danggg nima?', "xato filtridagi console.log, loyiha muallifining izi; xato emas."],
  ['Nega javobda hashed_password ko\'rinadi?', "all/admin Entity'dagi hamma ustunni qaytaradi; sahifalangan GET /api/v1/admin'da select bilan faqat id, username, is_active olinadi — parol shunday yashiriladi."],
];
const S27 = {
  kicker: '6-bosqich · sinfda', title: 'Sinfda albatta chiqadigan 6 holat va tayyor javoblar',
  segments: [
    sg('a', "Sinfda <b>albatta</b> chiqadigan olti holat — hammasini bugun o'zingiz ko'rdingiz", "Ikkala darsni bilasiz. Endi reja buziladigan joylar: sinfda albatta chiqadigan oltita holat. Hammasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa.", { hl: [] }),
    sg('b', "<code>/car</code> manzili <b>404</b> beradi; kira olmaslik sababi — <code>.env</code> va bo'sh superadmin satri", "Birinchi: o'quvchi darsidagi slesh car, to'rt yuz to'rt, manzil api v bir slesh car. Ikkinchi: o'quvchi tizimga kira olmayapti. Env'dagi superadmin blokini tekshiring; superadmin bo'sh yaratilgan bo'lsa, bazadagi satrni o'chirib, serverni qayta ishga tushiring.", { hl: [0, 1] }),
    sg('c', "Resurs ko'rinmasa AppModule yoki <code>forFeature</code>'ni, 500 chiqsa <b>uuid</b> formatini tekshiring", "Uchinchi: resurs ko'rinmaydi. Mapped satri yo'q bo'lsa bosh modul, can't resolve va Repository bo'lsa forFeature. To'rtinchi: car slesh bir, besh yuz, chunki id uuid: javobdagi id'ni nusxalash kerak.", { hl: [2, 3] }),
    sg('d', "401 bo'lsa Authorize, 403 bo'lsa <b>rol</b>, server yiqilsa yangi ustunga <code>nullable</code> qo'ying", "Beshinchi: to'rt yuz bir, Authorize; to'rt yuz uch, Roles ro'yxatida bu rol yo'q, ko'pincha superadmin bilan kirilgan. Oltinchi: Entity'ga majburiy ustun qo'shilgan va server yiqilgan, ustunni ixtiyoriy qiling.", { hl: [4, 5] }),
    sg('e', "Xulosa: xato chiqsa avval <b>statusga</b> qarang — u xato qaysi qatlamdan kelganini aytadi", "Xulosa va usul: xato chiqsa avval statusga qarang. To'rt yuz to'rt manzil yoki modul, to'rt yuz DTO, to'rt yuz bir va uch Guard, besh yuz terminal. Javobni aytmang, xabarni o'quvchi bilan birga o'qing. Pastdagi kartalarda o'quvchi savollariga tayyor javob bor.", { hl: [], qa: true }),
  ],
};
function Screen27(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S27} scene={({ seg }) => <>
    <div className="mk-qa">
      {STUMBLE2.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>{t(<><b>404</b> — manzil yoki modul · <b>400</b> — DTO qoidasi · <b>401 / 403</b> — Guard · <b>500</b> — terminalni o'qing. Javobni aytmang: xabarni o'quvchi bilan birga o'qing.</>, <><b>404</b> — адрес или модуль · <b>400</b> — правило DTO · <b>401 / 403</b> — Guard · <b>500</b> — читайте терминал. Не говорите ответ: читайте сообщение вместе с учеником.</>)}</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">{t("O'quvchi so'rasa — bosing", 'Если ученик спросит — нажмите')}</div>
      <div className="mk-qa">{QA2.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}

// ============================================================
//  28 · O'z-sinov — 8 savol (Nest-1 Screen27 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = [
  { q: "O'quvchi loyihasida server qaysi faylda ishga tushadi?", o: ['src/main.ts', 'src/api/app.service.ts', 'src/api/app.module.ts', 'src/config/index.ts'], c: 1, e: "main.ts faqat Aplication.main()ni chaqiradi; server app.service.ts'da.", s: 5 },
  { q: "POST /api/v1/car bo'sh {} bilan yuborildi. Javob?", o: ["201, bo'sh mashina yaratiladi", '404, route topilmadi', '500, server xatosi', "400, buzilgan qoidalar ro'yxati"], c: 3, e: 'Global ValidationPipe DTO qoidalarini tekshiradi.', s: 13 },
  { q: 'GET /api/v1/car/1 — nima bo\'ladi?', o: ['500, terminalda uuid xatosi', '404, mashina topilmadi', '200, birinchi mashina', '400, DTO qoidasi buzildi'], c: 0, e: "id uuid; «1» bazada xato beradi, filtr uni 500 qiladi.", s: 13 },
  { q: 'Tokensiz GET /api/v1/admin yuborildi. Javob?', o: ['403, rol yetmaydi', "404, route yo'q", "401, token yo'q", "200, adminlar ro'yxati"], c: 2, e: "AuthGuard: Authorization yo'q → 401.", s: 16 },
  { q: "Entity'da price'dan @Column olib tashlandi, server qayta yoqildi. Nima bo'ladi?", o: ['Server yiqiladi, xato chiqadi', "Ustun bazadan jim o'chadi", "Ustun bazada o'zgarmay qoladi", 'Faqat DTO xato beradi'], c: 1, e: "synchronize bazani Entity'ga moslaydi — ustun o'chadi, xabar yo'q.", s: 21 },
  { q: "O'quvchi m4a-03 bo'yicha localhost:3000/car'ni ochdi — 404, terminalda car uchun 5 ta Mapped bor. Nima deysiz?", o: ["Manzil /api/v1/car bo'lishi kerak", "CarModule'ni AppModule'ga ulang", 'Serverni qayta ishga tushiring', "Authorize'ga token qo'ying"], c: 0, e: "Mapped bor — route bor; o'quvchi darsida prefiks yozilmagan.", s: 24 },
  { q: "KitobShop: superadmin tokeni bilan POST /book — 403. O'quvchiga nima deysiz?", o: ['Qayta signin qiling, token eskirgan', "Authorize'ga tokenni qayta qo'ying", "BookModule'ni AppModule'ga ulang", 'Oddiy admin yarating va u bilan kiring'], c: 3, e: "@Roles('admin') — superAdmin ro'yxatda yo'q; token yaroqli, shuning uchun 403.", s: 26 },
  { q: "O'quvchi .env'ni keyin to'ldirdi, lekin kira olmayapti; bazada nomsiz superadmin bor. Nima qilasiz?", o: [".env'ni yana bir marta saqlang", 'Serverni ikki marta qayta yoqing', "Bazadagi o'sha satrni o'chirib, qayta yoqing", "USER_NAME'ni boshqa nomga o'zgartiring"], c: 2, e: "Superadmin bor bo'lsa onModuleInit yangisini yaratmaydi.", s: 6 },
];
function Screen28(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = LANG === 'ru' ? (!st.showResult
      ? 'Вы всё посмотрели, теперь проверьте себя. Итоговый тест, восемь вопросов, три из них по урокам ученика. На каждый вопрос одна попытка, после ответа открывается верный вариант и пояснение. Шесть и больше — урок усвоен. Если меньше, вернётесь к указанным экранам и пройдёте тест заново.'
      : sc >= 6
        ? 'Ваш результат сохранён: ' + sc + ' из восьми. Урок усвоен, нажмите «Далее».'
        : 'Хорошо, одну ошибку вы разобрали. Вернитесь и к экранам остальных красных вопросов. Когда будете готовы, нажмите кнопку «Пройти тест заново».')
      : !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol, ulardan uchtasi o'quvchi darslari bo'yicha. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi darslariga kirsangiz, sinfdagi xatolar sizga tanish bo'ladi.", 'Урок усвоен. Теперь, когда вы откроете уроки ученика, ошибки в классе будут вам знакомы.') : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
  };
  const next = () => { if (i < FINAL.length - 1) { setI(i + 1); save({ i: i + 1 }); } else { setShowResult(true); save({ showResult: true }); } };
  const retake = () => { setRes([]); setI(0); setShowResult(false); setAttempt(attempt + 1); save({ res: [], i: 0, showResult: false, attempt: attempt + 1, score: 0 }); };
  return (
    <Stage kicker={t("O'z-sinov", 'Самопроверка')} idx={p.idx} total={p.total} audio={audio} onBack={p.onBack} onNext={p.onNext} onRestart={p.onRestart} nextReady={finished && showResult} nextDisabled={!(finished && showResult)} lockHint={!finished ? t('Savollarga javob bering', 'Ответьте на вопросы') : t('Natijani oching', 'Откройте результат')}>
      <div className="mk-body" style={{ gridTemplateColumns: '1fr', maxWidth: 980, width: '100%', margin: '0 auto' }}>
        <div className="mk-say mc" style={{ overflow: 'auto', paddingRight: 4 }}>
          {showResult ? (<>
            <p className="mk-eyebrow">{t("O'z-sinov · natija", 'Самопроверка · результат')}{attempt > 1 ? t(` · ${attempt}-urinish`, ` · попытка ${attempt}`) : ''}</p>
            <h2 className="mk-title" style={{ fontSize: 'clamp(22px,2.4vw,30px)' }}>{score} / {FINAL.length} — {score >= 6 ? t("dars o'zlashtirildi", 'урок усвоен') : t("yana bir ko'rib chiqing", 'посмотрите ещё раз')}</h2>
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
            <h2 className="mk-title" style={{ fontSize: 'clamp(20px,2.2vw,28px)' }}>{q.q}</h2>
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

// ============================================================
//  29 · Yakun (M13): Barakalla → xulosa → uyga vazifa → eslatma → «Darsni yakunlash»
// ============================================================
const SUM2 = [
  { k: 'farq', t: "O'quvchi loyihasi: server app.service.ts'da, manzil /api/v1, javob data'da, xato error.message'da, sozlama .env'dan", st: ['pre'] },
  { k: 'layer', t: 'Resurs — 5 qatlam: Entity · DTO · Service (BaseService + Repository) · Controller · Module (+ core/index.ts, AppModule)', st: ['ctrl', 'svc', 'repo', 'db'] },
  { k: 'err', t: '400 — DTO qoidasi yoki ortiqcha maydon; 500 — terminalni o\'qing (/car/1 — id uuid)', st: ['pipe'] },
  { k: 'guard', t: "401 — token yo'q; 403 — rol ro'yxatda yo'q; superadmin va admin — har xil rol", st: ['guard'] },
  { k: 'sync', t: "Entity o'zgarsa baza o'zgaradi: ustun jim o'chadi, majburiy ustun serverni yiqitadi", st: ['db'] },
  { k: 'bridge', t: "O'quvchi darslarida 3 xato: /car → /api/v1/car · token va Authorize'ni siz ko'rsatasiz · KitobShop'dan oldin oddiy admin", st: ['br'] },
];
const STATIONS = [['br', t2('Brauzer', 'Браузер'), T.ink2], ['pre', '/api/v1', T.ink2], ['guard', 'Guard', N2.guard], ['pipe', 'ValidationPipe', N2.dto], ['ctrl', 'Controller', PART.ctrl], ['svc', 'Service', PART.svc], ['repo', 'Repository', N2.entity], ['db', t2('jadval', 'таблица'), N2.entity]];
function t2(uz, ruTxt) { return { uz, ru: ruTxt }; }
function SummaryMap2({ hl }) {
  const cur = SUM2.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">{t("Bugungi dars — bitta so'rovning to'liq yo'li", 'Сегодняшний урок — полный путь одного запроса')}</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(0,1fr))', gap: 6 }}>
      {STATIONS.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{typeof n === 'string' ? n : t(n.uz, n.ru)}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK2 = [
  { t: "brand resursi — 5 qadam: brand.entity.ts (name, country) + core/index.ts · dto/ · brand.service.ts · brand.controller.ts (4 eshik) · brand.module.ts + AppModule", c: [] },
  { t: "Swagger: POST /api/v1/brand → 201 · bo'sh name → 400 name should not be empty…", c: [] },
  { t: "car → brand: car.entity.ts'ga @ManyToOne(() => BrandEntity) + @JoinColumn({ name: 'brandId' }) + @Column({ nullable: true }) brandId — server ishga tushadi, cars'da brandId va tashqi kalit", c: [] },
  { t: "Ataylab buzing: brand.module.ts'dan forFeature'ni oling → «can't resolve dependencies of the BrandService (?)» → qaytaring", c: [] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "brand resursi"', 'git push'] },
];
const CHEATSHEET2 = `# Nest-2 — mentor eslatmasi (o'quvchi reposi IntroNestArxitechture)
## Ishga tushirish
git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git · npm install · cp .env.example .env · createdb -U postgres nestarxitechture · npm run start:dev → localhost:3000/api/v1 (Swagger)
## .env — uch blok
DEV_DB_URL (parol, nestarxitechture) · NODE_ENV=dev (boshqasi → prod bazasi, jadval yaratilmaydi) · Access_Token_Key · Superadmin: USER_NAME, FULL_NAME, PHONE, PASSWORD (kuchli)
Bo'sh superadmin yaratilgan bo'lsa: DELETE FROM admins WHERE role='superAdmin'; → qayta npm run start:dev → «Super admin created successfully»
## cars-api'dan farqlar
server: src/api/app.service.ts → Aplication.main() (main.ts faqat chaqiradi) · prefiks /api/v1 · muvaffaqiyat {statusCode, message:'success', data} · xato {statusCode, error:{message}} · oddiy Error → 500, sabab terminalda («Danggg» — console.log)
## Resurs — 5 qatlam, 6 fayl + 2 tahrir
src/core/entity/car.entity.ts (+ core/index.ts export) · src/api/car/dto/create-car.dto.ts · update-car.dto.ts (PartialType @nestjs/swagger'dan) · car.service.ts (extends BaseService, super(carRepo)) · car.controller.ts (findOneById) · car.module.ts (forFeature) + AppModule imports
## Status jadvali
400 DTO qoidasi / ortiqcha maydon («property … should not exist») · 401 token yo'q (Authorize) · 403 rol ro'yxatda yo'q · 404 manzil (/api/v1) yoki modul (Mapped yo'q) · 500 terminalni o'qing (/car/1 → invalid input syntax for type uuid; ParseUUIDPipe → 400)
## Guard
'public' — hamma · @Roles yozilmagan — tizimga kirganlar · 'ID' — o'z yozuvi · superAdmin va admin — har xil rol (@Roles('admin') → superadmin 403) · token 24 soat, eskirsa — qayta signin (/admin/token eskirganni tiklamaydi)
## synchronize tuzoqlari
@Column olib tashlansa — ustun bazadan jim o'chadi · bor jadvalga majburiy ustun → «contains null values» → nullable: true
## O'quvchi darslaridagi 3 xato
m4a-03: /car → /api/v1/car · token/Authorize o'rgatilmagan — siz ko'rsatasiz · m4a-04: KitobShop'dan oldin oddiy admin
## O'quvchi tili
javon chizmasi=Entity · anketa=DTO · nazoratchi=ValidationPipe · retsept kitobi=BaseService · omborchi=Repository · ofitsiant=Controller · kirish taxtasi=Module · qo'riqchi=Guard · yorliq=@ManyToOne
## Sizning uyga vazifangiz
brand resursi + car → brand (@ManyToOne, brandId nullable) + forFeature'ni buzib tuzatish → GitHub → repo linki platformadagi uyga vazifaga`;
// UZ-RU: ruscha segmentlar nest2/parts/08-ru.jsx dagi S29_RU dan (id bo'yicha; 'a' — o'tgan/o'tmagan ikki varianti)
const s29Ru = (passed, segs) => (LANG === 'ru' ? segs.map((s) => ({ ...s, ...(S29_RU[s.id === 'a' ? (passed ? 'a_pass' : 'a_fail') : s.id] || {}) })) : segs);
const s29Segments = (passed) => s29Ru(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "O'quvchi loyihasi: server <b>app.service.ts</b>'da, manzil <b>/api/v1</b>, javob shakllari bitta", "Birinchi: o'quvchi loyihasida server app service ts faylida ishga tushadi, manzil api v bir bilan boshlanadi, javob data ichida, xato error message ichida, sozlama env'dan.", { hl: 'farq' }),
  sg('b2', "Resurs — <b>5 qatlam</b>: Entity, DTO, Service, Controller, Module", "Ikkinchi: resurs besh qatlam. Entity, DTO, Base service'dan meros olgan Service, Controller va Module, ustiga core index va bosh modul.", { hl: 'layer' }),
  sg('b3', "<b>400</b> — DTO qoidasi; <b>500</b> — terminalni o'qing", "Uchinchi: to'rt yuz DTO qoidasidan keladi, besh yuz bo'lsa sabab terminalda, masalan id uuid bo'lgani uchun.", { hl: 'err' }),
  sg('b4', "<b>401</b> — token yo'q, <b>403</b> — rol yo'q; superadmin va admin — har xil rol", "To'rtinchi: to'rt yuz bir token yo'q, to'rt yuz uch rol ro'yxatda yo'q. Superadmin va admin har xil rol.", { hl: 'guard' }),
  sg('b5', "Entity o'zgarsa <b>baza o'zgaradi</b> — jim yoki yiqilib", "Beshinchi: Entity o'zgarsa baza ham o'zgaradi. Ustun olib tashlansa ma'lumot jim o'chadi, majburiy ustun qo'shilsa server yiqiladi.", { hl: 'sync' }),
  sg('b6', "O'quvchi darslarida <b>3 xato</b> — sinfda siz tuzatasiz", "Oltinchi, sinf uchun eng muhimi: o'quvchi darslarida uchta xato bor. Slesh car o'rniga api v bir slesh car, token va Authorize'ni siz ko'rsatasiz, KitobShop'dan oldin oddiy admin.", { hl: 'bridge' }),
  sg('hw', "<b>Uyga vazifa</b>: brand resursi, car'ni brand'ga bog'lash va bitta buzib-tuzatish", "Uyga vazifa. O'z loyihangizga brand resursini qo'shing, aynan o'quvchining uyga vazifasi: name va country, DTO qoidalari, Base service'dan meros, to'rt eshik va bosh modul. Keyin car'ni brand'ga bog'lang, yangi ustun ixtiyoriy bo'lsin. Bir marta ataylab forFeature'ni olib tashlang, xabarni o'qing va tuzating.", { hl: 'hw' }),
  sg('hw2', "Topshirish: GitHub'dagi repo linkini <b>platformadagi uyga vazifaga</b> qo'ying — boshqa hech narsa kerak emas", "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: .env, farqlar, 5 qatlam, statuslar, 3 xato — bir sahifada", "Pastda bir sahifalik eslatma: env ro'yxati, farqlar, besh qatlam, status jadvali, Guard qoidalari va o'quvchi darslaridagi uchta xato. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen29(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET2, CHEATSHEET2_RU);
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('nest-2-mentor-eslatma.md', 'nest-2-pamyatka-mentora.md'); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s29Segments(passed), [passed]);
  const b = useBeats(segments, p.review);
  const hl = b.seg.hl;
  const phase = hl === 'hw' ? 'hw' : hl === 'note' ? 'note' : 'sum';
  const shown = segments.slice(0, b.beat + 1).filter((s) => /^b\d/.test(s.id)).length;
  return (
    <Stage kicker={t('Yakun', 'Итог')} idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onFinish} onRestart={p.onRestart} nextReady={b.done} nextDisabled={!b.done} nextLabel={t('Darsni yakunlash', 'Завершить урок')} lockHint={t("Ustoz gapirib bo'lgach ochiladi", 'Откроется, когда учитель договорит')}>
      <div className="mk-body">
        <Say title={passed ? t('Barakalla! Endi siz bilasiz', 'Отлично! Теперь вы знаете') : t('Endi siz bilasiz', 'Теперь вы знаете')} segments={segments} beat={b.beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk} review={p.review} />
        <div className="mk-scene top" style={{ overflow: 'auto' }}>
          {phase === 'sum' && (<>
            <SummaryMap2 hl={hl} />
            <div className="mk-plan">{SUM2.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 40–60 daqiqa', 'Домашнее задание · 40–60 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK2.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}>{t(<><b>Tekshiruvchi qaraydi:</b> brand resursi to'liq · extends BaseService · AppModule · brandId ixtiyoriy va tashqi kalit bor · 201/400 ishlaydi.</>, <><b>Проверяющий смотрит:</b> ресурс brand полностью · extends BaseService · AppModule · brandId необязателен и есть внешний ключ · 201/400 работают.</>)}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t('Jest — birinchi unit-test', 'Jest — первый unit-тест')}</div></div>
          </div>}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  Muqova va ildiz
// ============================================================
function Cover({ onStart }) {
  return (
    <div className="mk-cover"><div className="card">
      <p className="mk-eyebrow">{t('Mentor kursi · NestJS', 'Курс для менторов · NestJS')}</p>
      <h1>{t(LESSON_TITLE, 'Репозиторий ученика: один ресурс, Guard и ошибки в классе')}</h1>
      <p>{t("Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.", 'Урок озвучен. На каждом экране говорит учитель, экран меняется вместе с ним. Проверьте наушники или громкость.')}</p>
      <ul>
        {t(["Jami taxminan 1 soat 20 daqiqa: ovoz ~35 daqiqa · to'rt amaliyot 35–45 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 15-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: Nest-1 darsi o'tilgan · Node.js 20+ · PostgreSQL ishlab turgan · Git · VS Code", "Loyiha: o'quvchi reposi IntroNestArxitechture — darsda uni o'zingizda ishga tushirasiz"], ['Всего около 1 часа 20 минут: озвучка ~35 минут · четыре практики 35–45 минут · 4 проверки · самопроверка 8 вопросов. После экрана 15 можно сделать перерыв', 'Нужно: пройден урок Nest-1 · Node.js 20+ · запущенный PostgreSQL · Git · VS Code', 'Проект: репозиторий ученика IntroNestArxitechture — на уроке вы запустите его у себя']).map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>{t('Boshlash →', 'Начать →')}</button>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, ScreenP1, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, ScreenP2, Screen16, Screen17, Screen18, ScreenP3, Screen20, Screen21, Screen22, ScreenP4, Screen24, Screen25, Screen26, Screen27, Screen28, Screen29]; // F-1031-09: o'quvchi uyga vazifasini tekshirish ekrani olib tashlandi (mentor tekshirmaydi)
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function NestRepoMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
  setLang(lang);
  useCss();
  useCss2();
  const total = SCREENS.length;
  const [started, setStarted] = useState(startAt != null);
  const [idx, setIdx] = useState(Math.min(Math.max(0, startAt || 0), total - 1));
  const [answers, setAnswers] = useState({});
  const [returnTo, setReturnTo] = useState(null);
  const [seen, setSeen] = useState({});
  const [rev, setRev] = useState(0);
  const [mode, setMode] = useState('live');
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
      lessonId: LESSON_ID, lessonTitle: LESSON_TITLE,
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
  const fin = Object.values(answers).find((a) => a && a.type === 'final');
  return <S key={`${idx}:${rev}`} idx={idx} total={total} lang={lang} stored={answers[idx]} testScore={fin ? fin.score : 0} seen={!!seen[idx]} review={mode === 'review' && !!seen[idx]} onAnswer={onAnswer} onNext={next} onBack={idx > 0 ? () => { setMode('review'); setIdx((i) => i - 1); } : null} onFinish={finish} onGoto={goto} onRestart={restart} />;
}
