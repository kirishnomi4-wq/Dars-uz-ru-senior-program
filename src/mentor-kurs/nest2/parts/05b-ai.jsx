// ============================================================
//  6-bosqich · AI yozgan kod (F-1125-01, M56). HAQIQIY AI yurgizishi — Claude Haiku ×2, har biri o'z nusxasida:
//  o'quvchi reposi (45071ac) + 2-amaliyotdagi car resursi + o'z PostgreSQL bazasi. Resurs customer (2-amaliyot car va uyga vazifa brand bilan to'qnashmaydi).
//  Manba: feedback/F-1125-01-nest1-kuchaytirish/ai-nest2/ — 00-promptlar.md · A-oddiy/ · B-nest/ · B-nest-tuzatilgan/ · XULOSA.md (M10)
// ============================================================
const CUS_ALL = ['src/core/entity/customer.entity.ts', 'src/api/customer/dto/create-customer.dto.ts', 'src/api/customer/dto/update-customer.dto.ts', 'src/api/customer/customer.service.ts', 'src/api/customer/customer.controller.ts', 'src/api/customer/customer.module.ts'];
// Topshiriq AI'ga o'zbekcha berilgan — ruscha darsda ham aynan shu matn (tarjima qilinmaydi)
const AI2_PROMPT_A = "Loyihamga mijozlar bo'limini qo'shib ber. Mijozlar ro'yxatini ko'rish, bittasini olish, yangi mijoz qo'shish, o'zgartirish va o'chirish kerak. Mijozda ism, telefon va yosh bo'lsin, yoshi 18 dan kichik bo'lsa qo'shmasin. Ro'yxatni hamma ko'ra olsin, qo'shish, o'zgartirish va o'chirishni faqat admin qila olsin.";
const AI2_PROMPT_B = ["customer resursini car resursi bilan bir xil tuzilishda qo'sh.", "Entity: name, phone (unique), age; core/index.ts'dan export", 'DTO: class-validator, age butun son, kamida 18; UpdateCustomerDto — PartialType', "Service — BaseService'dan meros", "Controller: POST, GET, GET :id, PATCH, DELETE; AuthGuard + RolesGuard; yozish — superAdmin va admin, GET — hammaga", 'Module — forFeature, AppModule imports; npm run build xatosiz'];
const AI2_LOG = term(String.raw`
[Nest] LOG [InstanceLoader] CustomerModule dependencies initialized
[Nest] LOG [RoutesResolver] CustomerController {/api/v1/customer}:
[Nest] LOG [RouterExplorer] Mapped {/api/v1/customer, POST} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/customer, GET} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/customer/:id, GET} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/customer/:id, PATCH} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/customer/:id, DELETE} route`);
// [so'rov, A, B] — ai-nest2/A-oddiy/04-sorovlar.txt va B-nest/04-sorovlar.txt; bad — kutilganidan boshqacha
const AI2_REQ_OK = [
  ['GET /customer', { st: 200 }, { st: 200 }],
  ['POST /customer', { st: 401 }, { st: 401 }],
  ['POST · age 15 · token', { st: 400 }, { st: 400 }],
  ['POST {} · token', { st: 400 }, { st: 400 }],
  ['POST + "id" · token', { st: 400, n: '«property id should not exist»' }, { st: 400, n: '«property id should not exist»' }],
];
const AI2_REQ_ODD = [
  ['GET /customer/abc', { st: 400, n: '«uuid is expected»' }, { st: 500, n: '«Internal server error»', bad: true }],
  // modul darajasida tarjima — faqat getter (aks holda RU'da o'zbekcha qoladi)
  ['POST · takror telefon · token', { st: 201, get n() { return t("ikkinchi mijoz, o'sha telefon", 'второй клиент, тот же телефон'); }, bad: true }, { st: 500, n: '«Internal server error»', bad: true }],
];
function Ai2Cell({ c }) {
  return <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 0, padding: '6px 10px', borderRadius: 8, border: `1px solid ${c.bad ? T.accent : T.line}`, background: c.bad ? '#FFF0EB' : T.paper }}>
    <span className={`st s${String(c.st)[0]}`}>{c.st}</span>
    {c.n && <span style={{ font: `12.5px/1.35 ${MONO}`, color: c.bad ? T.accent : T.ink2, overflowWrap: 'anywhere' }}>{c.n}</span>}
  </div>;
}
function Ai2Rows({ rows }) {
  return rows.map(([q, a, b]) => <div key={q} style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 8, alignItems: 'center' }}>
    <code style={{ font: `12.5px/1.35 ${MONO}`, overflowWrap: 'anywhere' }}>{q}</code><Ai2Cell c={a} /><Ai2Cell c={b} />
  </div>);
}
const S_AI2 = {
  kicker: '6-bosqich · AI yozgan kod', title: 'AI yozgan customer resursi: ikki topshiriq, ikki natija',
  segments: [
    sg('a', "AI'ga o'quvchi reposida <b>customer</b> resursini yozdirdik: bir xil AI, <b>ikki xil topshiriq</b>", "Nest birinchi darsida AI'ga cars api'da customers modulini yozdirgan edik. Endi xuddi shu ishni o'quvchi reposida qildik, car resursi qo'shilgan holatda. AI bitta, Claude Haiku, topshiriq ikki xil: chapdagisi oddiy so'zlar bilan, o'ngdagisi repo uslubida. Bu safar tekshirish kengroq: besh qatlam, himoya va baza."),
    sg('b', "1-tekshiruv — <b>besh qatlam va himoya</b>: ikkala AI ham to'g'ri qurdi", "Birinchi tekshiruv tuzilish. Besh qatlam joyidami: Entity, DTO, Base service'dan meros Service, Controller, forFeature bilan Module va bosh modul. Himoya: guard'lar klass ustida, GET'lar public, yozish faqat superadmin va admin. Ikkala AI ham bularning hammasini to'g'ri qildi, terminalda customer uchun beshta Mapped satri."),
    sg('c', "2-tekshiruv — <b>so'rov</b>: odatiy so'rovlarda ikkalasi bir xil, <b>repo o'zi yordam beradi</b>", "Ikkinchi tekshiruv so'rov bilan. Odatiy so'rovlarda ikkalasi bir xil: ro'yxat hammaga ochiq, tokensiz qo'shish to'rt yuz bir, o'n besh yosh, bo'sh body va begona id maydoni to'rt yuz. Begona maydonni AI emas, reponing o'zi to'xtatadi: ValidationPipe'da forbidNonWhitelisted yoqilgan."),
    sg('d', "Kutilmagan so'rov: <b>harfli id</b> va <b>takror telefon</b> — B ikkalasida 500", "Kutilmagan ikki so'rov boshqacha chiqdi. Harfli id: A to'rt yuz qaytardi, chunki ParseUUIDPipe qo'ygan, B esa besh yuz. B car resursidagi satrni ko'chirgan, uchinchi bosqichda car bir so'rovi ham besh yuz bergan edi. Takror telefon: B da telefon unique, baza rad etdi, lekin javob besh yuz. A da unique yo'q, ikkinchi mijoz o'sha telefon bilan yaratildi."),
    sg('e', "Xulosa: AI loyihadagi namunani <b>zaifligi bilan birga</b> ko'chiradi — kutilmagan so'rovni o'zingiz yuboring", "Xulosa. AI loyihadagi namunani ko'chiradi, uning zaifligi bilan birga. Tuzilish va himoya to'g'ri bo'lsa ham, javobni kutilmagan so'rovlar ochadi: harfli id, bo'sh body, begona maydon va takror qiymat. Demak, AI yozgan resursni besh qatlam, himoya va to'rtta kutilmagan so'rov bilan tekshiring."),
  ],
};
function ScreenAI(p) {
  return <Lesson p={p} S={S_AI2} scene={({ beat }) => (<>
    {beat === 0 && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">{t('A · oddiy topshiriq', 'A · простое задание (дано на узбекском)')}</div>
        <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>«{AI2_PROMPT_A}»</div>
      </div>
      <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">{t('B · repo uslubidagi topshiriq', 'B · задание в стиле репозитория (дано на узбекском)')}</div>
        <div style={{ display: 'grid', gap: 4, fontSize: 14, lineHeight: 1.45 }}>{AI2_PROMPT_B.map((x, i) => <div key={i}>{i ? '· ' : ''}{x}</div>)}</div>
      </div>
    </div>}
    {beat === 1 && <>
      <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">{t('1-tekshiruv · besh qatlam va himoya', 'Проверка 1 · пять слоёв и защита')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '6px 14px', alignItems: 'center', fontSize: 14 }}>
          <span /><b>A</b><b>B</b>
          {[t('Entity · DTO · Service (BaseService) · Controller · Module', 'Entity · DTO · Service (BaseService) · Controller · Module'), t("core/index.ts · forFeature · AppModule · 5 ta Mapped", 'core/index.ts · forFeature · AppModule · 5 строк Mapped'), t("Guard'lar klass ustida · GET — @Roles('public') · yozish — superAdmin, admin", "Guard над классом · GET — @Roles('public') · запись — superAdmin, admin"), t("DTO: ism va telefon majburiy · age butun son, ≥ 18", 'DTO: имя и телефон обязательны · age целое, ≥ 18')].map((x) => [<span key={x}>{x}</span>, <span key={x + 'a'} style={{ color: T.green, fontWeight: 700 }}>✓</span>, <span key={x + 'b'} style={{ color: T.green, fontWeight: 700 }}>✓</span>])}
        </div>
      </div>
      <Term title={t('VS Code terminali · IntroNestArxitechture (B)', 'Терминал VS Code · IntroNestArxitechture (B)')} lines={AI2_LOG} />
    </>}
    {beat >= 2 && <div className="mk-light mk-req" style={{ padding: 14, display: 'grid', gap: 8 }}>
      <div className="mk-tag">{t("2-tekshiruv · so'rov — haqiqiy javoblar (/api/v1)", 'Проверка 2 · запросы — настоящие ответы (/api/v1)')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 8, fontSize: 13, color: T.ink3, fontWeight: 600 }}><span>{t("So'rov", 'Запрос')}</span><span>{t('A · oddiy', 'A · простое')}</span><span>{t('B · repo uslubida', 'B · в стиле репозитория')}</span></div>
      <Ai2Rows rows={AI2_REQ_OK} />
      {beat >= 3 && <>
        <div className="mk-tag" style={{ marginTop: 6 }}>{t("Kutilmagan so'rovlar", 'Неожиданные запросы')}</div>
        <Ai2Rows rows={AI2_REQ_ODD} />
      </>}
    </div>}
    <Block at={4} beat={beat}><div className="mk-rule">{t(<><b>AI yozgan resursni tekshirish:</b> besh qatlam · himoya (guard, rollar) · kutilmagan so'rovlar — harfli id, bo'sh body, begona maydon, takror qiymat. Javob 500 bo'lsa — terminalni o'qing.</>, <><b>Проверка ресурса от ИИ:</b> пять слоёв · защита (guard, роли) · неожиданные запросы — id из букв, пустой body, чужое поле, повторное значение. Ответ 500 — читайте терминал.</>)}</div></Block>
  </>)} />;
}

// --- Tekshiruv 5: B yozgan Controller — harfli id → 500. Haqiqiy kod: ai-nest2/B-nest/01-diff.txt, customer.controller.ts 32–42 ---
const LCAI2_LINES = ts(String.raw`
  @Roles('public')
  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Roles('public')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOneById(id);
  }`).map((l, i) => ({ ...l, n: 32 + i }));
const LCAI2_FIXED = [
  ...LCAI2_LINES.slice(0, 8),
  { ...LCAI2_LINES[8], gone: true, n: '' },
  { neu: true, n: 40, h: tsLine(`  findOne(@Param('id', ParseUUIDPipe) id: string) {`) },
  ...LCAI2_LINES.slice(9),
];
function ScreenLCAI(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 5', 'Проверка 5')} eyebrow={t('Tekshiruv · 5 / 5 — qaysi satr xato?', 'Проверка · 5 / 5 — какая строка с ошибкой?')} title={t("AI yozgan Controller: qaysi satr 500 ga sabab?", 'Controller от ИИ: какая строка даёт 500?')}
    task={t("Qoida: id — uuid; noto'g'ri id <b>400</b> bilan qaytadi, 500 bilan emas. B ning <code>GET /api/v1/customer/abc</code> so'rovi <b>500</b> berdi. <b>Aybdor satrni bosing.</b>", 'Правило: id — это uuid; неверный id возвращается с <b>400</b>, а не с 500. Запрос <code>GET /api/v1/customer/abc</code> у B дал <b>500</b>. <b>Нажмите на виноватую строку.</b>')}
    q={t("Beshinchi, oxirgi tekshiruv. Bu B yozgan Controller, customer papkasidagi customer controller ts faylida, o'ttiz ikkinchi satrdan. Harfli id bilan so'rov besh yuz berdi. Qoida: id uuid, noto'g'ri id to'rt yuz bilan qaytishi kerak. Qaysi satr id'ni tekshirmasdan bazaga yuboryapti? O'sha satrni bosing.", 'Пятая, последняя проверка. Это Controller, который написал B, файл customer controller ts в папке customer, с тридцать второй строки. Запрос с id из букв дал пятьсот. Правило: id это uuid, неверный id должен возвращаться с четырёхсот. Какая строка отправляет id в базу без проверки? Нажмите на эту строку.')}
    file="src/api/customer/customer.controller.ts" lines={LCAI2_LINES} target={8}
    tree={{ root: MKCFG.root, files: tree(BASE, CAR_ALL, CUS_ALL), active: 'src/api/customer/customer.controller.ts' }}
    fixed={LCAI2_FIXED.filter((l) => String(l.h).trim() !== '')} fixedExtra={[{ file: t('terminal — tuzatilgandan keyin (haqiqiy)', 'terminal — после исправления (настоящий)'), lines: plainLines(String.raw`
GET /api/v1/customer/abc → 400 {"message":"Validation failed (uuid is expected)"}
GET /api/v1/customer/00000000-0000-0000-0000-000000000000 → 404 {"message":"not found"}`) }]}
    ok={t("To'g'ri. Qirqinchi satrda id hech qanday tekshiruvsiz olinadi va to'g'ri bazaga ketadi. PostgreSQL abc'ni uuid deb o'qiy olmaydi, xato beradi, foydalanuvchiga esa besh yuz boradi. Tuzatish: ParseUUIDPipe. Tuzatilgan kodda abc so'roviga to'rt yuz keldi. Car resursida ham xuddi shu satr bor, uchinchi bosqichdagi besh yuz shundan. Demak, AI namunadan ko'chirgan satrni namunaning o'zi bilan birga tekshiring.", 'Верно. В сороковой строке id берётся без всякой проверки и сразу уходит в базу. PostgreSQL не может прочитать abc как uuid и выдаёт ошибку, а пользователю приходит пятьсот. Исправление: ParseUUIDPipe. В исправленном коде на запрос abc пришло четыреста. В ресурсе car такая же строка, отсюда и пятьсот на третьем этапе. Значит, строку, которую ИИ скопировал из образца, проверяйте вместе с самим образцом.')}
    okShort={t("40-satr: @Param('id') — id tekshirilmay bazaga ketadi, PostgreSQL «invalid input syntax for type uuid» → 500. Tuzatildi: @Param('id', ParseUUIDPipe) → 400 (sinab ko'rilgan).", "Строка 40: @Param('id') — id уходит в базу без проверки, PostgreSQL «invalid input syntax for type uuid» → 500. Исправлено: @Param('id', ParseUUIDPipe) → 400 (проверено).")}
    hint={t("Bu satr route'ni belgilaydi, ruxsat beradi yoki natijani qaytaradi. id qayerda olinayotganini qidiring.", 'Эта строка задаёт route, даёт доступ или возвращает результат. Ищите строку, где берётся id.')} />;
}
