// ============================================================
//  6-bosqich · AI yozgan kod (F-1125-01, 3-ish; foydalanuvchi 25.11: AI bloki «A — avval Nest-1», resurs customers)
//  HAQIQIY AI yurgizishi — Claude Haiku ×2, har biri o'z nusxasida (darsning 3-amaliyotdan keyingi cars-api, Nest 12):
//  feedback/F-1125-01-nest1-kuchaytirish/ai-nest1/ — 00-promptlar.md · A2-oddiy/ · B2-nest/ · *-tuzatilgan/ · XULOSA.md
//  Raqam va xabarlar o'sha papkadagi 04-sorovlar.txt va 03-start.log dan (M10); o'ylab topilmagan.
// ============================================================
const AI_FILES = [...ALL_FILES, 'src/customers/customers.module.ts', 'src/customers/customers.controller.ts', 'src/customers/customers.service.ts'];
// AI'ga berilgan topshiriq o'zbekcha edi — ruscha darsda ham aynan shu matn ko'rsatiladi (tarjima qilinmaydi)
const AI_PROMPT_A = "Loyihamga mijozlar bo'limini qo'shib ber. Mashinani ijaraga oladigan mijozlar ro'yxatini ko'rish, bittasini id bo'yicha olish va yangi mijoz qo'shish kerak. Mijozda ism, telefon va yosh bo'lsin. Yoshi 18 dan kichik bo'lsa, qo'shmasin.";
const AI_PROMPT_B = ["NestJS'da customers moduli yarat.", 'CLI bilan: module · controller --no-spec · service --no-spec', "Service: findAll, findOne (NotFoundException), create; yosh < 18 → BadRequestException, tekshiruv Service'da", "Controller: GET, GET :id (ParseIntPipe), POST — faqat Service'ni chaqiradi", "Module ro'yxatlarda, AppModule imports'ida; npm run build xatosiz"];
const AI_LOG = [
  { h: `<span class="p">$</span> npm run start:dev` },
  { h: `[Nest] LOG [InstanceLoader] <span class="ok">CustomersModule dependencies initialized</span>` },
  { h: `[Nest] LOG [RoutesResolver] CustomersController {/customers}:` },
  { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/customers, GET} route</span>` },
  { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/customers/:id, GET} route</span>` },
  { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/customers, POST} route</span>` },
  { h: `[Nest] LOG [NestApplication] Nest application successfully started` },
];
// [so'rov, A natijasi, B natijasi]; bad — kutilganidan boshqacha (qizil)
const AI_REQ_OK = [
  ['GET /customers', { st: 200 }, { st: 200 }],
  ['GET /customers/99', { st: 404 }, { st: 404 }],
  ['POST /customers · age 15', { st: 400 }, { st: 400 }],
  ['GET /customers/abc', { st: 404, n: '«Customer with id NaN not found»', bad: true }, { st: 400, n: '«Validation failed»' }],
];
const AI_REQ_ODD = [
  ['POST /customers {}', { st: 400, n: '«name is required»' }, { st: 201, n: '{"id":4}', bad: true }],
  ['POST /customers {"id":1, …}', { st: 201, n: 'id 4' }, { st: 201, n: 'id 1', bad: true, dup: true }],
];
function AiCell({ c }) {
  return <div style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 0, padding: '6px 10px', borderRadius: 8, border: `1px solid ${c.bad ? T.accent : T.line}`, background: c.bad ? '#FFF0EB' : T.paper }}>
    <span className={`st s${String(c.st)[0]}`}>{c.st}</span>
    {c.n && <span style={{ font: `12.5px/1.35 ${MONO}`, color: c.bad ? T.accent : T.ink2, overflowWrap: 'anywhere' }}>{c.n}{c.dup ? t(' — takror', ' — повтор') : ''}</span>}
  </div>;
}
function AiRows({ rows }) {
  return rows.map(([q, a, b]) => <div key={q} style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 8, alignItems: 'center' }}>
    <code style={{ font: `12.5px/1.35 ${MONO}`, overflowWrap: 'anywhere' }}>{q}</code><AiCell c={a} /><AiCell c={b} />
  </div>);
}
const S_AI = {
  kicker: '6-bosqich · AI yozgan kod', title: 'AI yozgan customers moduli: ikki topshiriq, ikki natija',
  segments: [
    { id: 'a', key: "AI'ga <b>customers</b> modulini yozdirdik: bir xil AI, <b>ikki xil topshiriq</b>", text: "Hozir kodning ko'pini AI yozadi, sizning ishingiz uni tekshirish. Biz cars api loyihasiga ijarachilar, ya'ni customers modulini AI'ga yozdirdik. AI bitta, Claude Haiku, topshiriq ikki xil: chapdagisi oddiy so'zlar bilan, o'ngdagisi Nest tilida. Ikkalasida bitta qoida bor: yoshi o'n sakkizdan kichik bo'lsa, qo'shmasin.", show: "Hozir kodning ko'pini AI yozadi, sizning ishingiz uni tekshirish. Biz <code>cars-api</code> loyihasiga ijarachilar, ya'ni <b>customers</b> modulini AI'ga yozdirdik. AI bitta, Claude Haiku, topshiriq ikki xil: chapdagisi oddiy so'zlar bilan, o'ngdagisi Nest tilida. Ikkalasida bitta qoida bor: yoshi 18 dan kichik bo'lsa, qo'shmasin." },
    { id: 'b', key: "1-tekshiruv — <b>tuzilish</b>: to'rt savol, ikkala AI ham o'tdi", text: "Birinchi tekshiruv tuzilish, bugungi darsning to'rt savoli. Fayllar: module, controller, service bormi. Ro'yxatlar: Service providers'da, modul AppModule imports'idami, terminalda customers uchun uchta Mapped satri chiqdimi. Logika: yosh qoidasi Service'dami. Decorator'lar joyidami. Ikkala AI ham to'rttala savoldan o'tdi." },
    { id: 'c', key: "2-tekshiruv — <b>so'rov</b>: <code>/customers/abc</code> da A <b>404 «NaN»</b> qaytardi", text: "Ikkinchi tekshiruv so'rov bilan. Ro'yxat, to'qson to'qqiz va o'n besh yoshli mijoz ikkalasida to'g'ri. Lekin customers abc so'rovida A to'rt yuz to'rt va NaN qaytardi: unda ParseIntPipe yo'q, id Number bilan olingan, yigirma birinchi ekrandagi holatning o'zi. B da ParseIntPipe bor, chunki topshiriqda so'ralgan edi.", show: "Ikkinchi tekshiruv so'rov bilan. Ro'yxat, <code>/customers/99</code> va 15 yoshli mijoz ikkalasida to'g'ri. Lekin <code>/customers/abc</code> so'rovida A <b>404</b> va «NaN» qaytardi: unda <code>ParseIntPipe</code> yo'q, id <code>Number</code> bilan olingan, 21-ekrandagi holatning o'zi. B da <code>ParseIntPipe</code> bor, chunki topshiriqda so'ralgan edi." },
    { id: 'd', key: "Kutilmagan so'rov: <b>bo'sh POST</b> va body'da <b>id: 1</b> — B da ikkalasi o'tib ketdi", text: "Endi kutilmagan ikki so'rov: bo'sh POST va body ichida id bir. A ikkalasini to'xtatdi: bo'sh POST'ga to'rt yuz, body'dagi id'ga e'tibor bermadi. B esa bo'sh mijoz yaratdi va ro'yxatda ikkinchi id bir paydo bo'ldi. Endi customers bir so'rovi eskisini qaytaradi, yangisi esa takror id bilan yotadi.", show: "Endi kutilmagan ikki so'rov: bo'sh <code>POST {}</code> va body ichida <code>\"id\": 1</code>. A ikkalasini to'xtatdi: bo'sh POST'ga <b>400</b>, body'dagi id'ga e'tibor bermadi. B esa bo'sh mijoz yaratdi va ro'yxatda <b>ikkinchi id: 1</b> paydo bo'ldi. Endi <code>/customers/1</code> eskisini qaytaradi, yangisi esa takror id bilan yotadi." },
    { id: 'e', key: "Xulosa: har AI <b>topshiriqda yozilmaganini</b> o'tkazib yubordi — <b>4 savol va 3 so'rov</b> bilan tekshiring", text: "Xulosa. Har AI topshiriqda yozilmagan narsani o'tkazib yubordi: oddiy topshiriq Nest'ga xos ParseIntPipe'ni, Nest topshirig'i kiruvchi ma'lumot tekshiruvini. Bu bitta sinov, boshqa AI boshqacha yozadi. Demak, AI kodini to'rt savol bilan o'qing va uchta kutilmagan so'rov yuboring: harfli id, bo'sh body va begona maydon." },
  ],
};
function ScreenAI6(p) {
  return <Lesson p={p} S={S_AI} scene={({ beat }) => (<>
    {beat === 0 && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">{t("A · oddiy topshiriq", 'A · простое задание (дано на узбекском)')}</div>
        <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>«{AI_PROMPT_A}»</div>
      </div>
      <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">{t('B · Nest tilidagi topshiriq', 'B · задание на языке Nest (дано на узбекском)')}</div>
        <div style={{ display: 'grid', gap: 4, fontSize: 14, lineHeight: 1.45 }}>{AI_PROMPT_B.map((x, i) => <div key={i}>{i ? '· ' : ''}{x}</div>)}</div>
      </div>
    </div>}
    {beat === 1 && <>
      <div className="mk-light" style={{ padding: 14 }}>
        <div className="mk-tag">{t("1-tekshiruv · tuzilish — to'rt savol", 'Проверка 1 · структура — четыре вопроса')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '6px 14px', alignItems: 'center', fontSize: 14 }}>
          <span /><b>A</b><b>B</b>
          {[t('Fayllar: module · controller · service', 'Файлы: module · controller · service'), t("Ro'yxatlar: providers · AppModule imports · 3 ta Mapped", 'Списки: providers · imports в AppModule · 3 строки Mapped'), t("Logika: yosh qoidasi Service'da", 'Логика: правило возраста в Service'), t("Decorator'lar: @Controller · @Injectable · @Get / @Post", 'Decorator: @Controller · @Injectable · @Get / @Post')].map((x) => [<span key={x}>{x}</span>, <span key={x + 'a'} style={{ color: T.green, fontWeight: 700 }}>✓</span>, <span key={x + 'b'} style={{ color: T.green, fontWeight: 700 }}>✓</span>])}
        </div>
      </div>
      <CodePanel file={t('VS Code terminali · cars-api (B)', 'Терминал VS Code · cars-api (B)')} numbers={false} wrap style={{ background: '#111827' }} lines={AI_LOG} />
    </>}
    {beat >= 2 && <div className="mk-light mk-req" style={{ padding: 14, display: 'grid', gap: 8 }}>
      <div className="mk-tag">{t("2-tekshiruv · so'rov — haqiqiy javoblar", 'Проверка 2 · запросы — настоящие ответы')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 8, fontSize: 13, color: T.ink3, fontWeight: 600 }}><span>{t("So'rov", 'Запрос')}</span><span>{t('A · oddiy', 'A · простое')}</span><span>{t('B · Nest tilida', 'B · на языке Nest')}</span></div>
      <AiRows rows={AI_REQ_OK} />
      {beat >= 3 && <>
        <div className="mk-tag" style={{ marginTop: 6 }}>{t("Kutilmagan so'rovlar", 'Неожиданные запросы')}</div>
        <AiRows rows={AI_REQ_ODD} />
      </>}
    </div>}
    <Block at={4} beat={beat}><div className="mk-rule">{t(<><b>AI kodini tekshirish:</b> 4 savol — fayllar · ro'yxatlar · logika Service'da · decorator'lar; 3 kutilmagan so'rov — harfli id (<code>/abc</code>) · bo'sh body (<code>{'{}'}</code>) · begona maydon (<code>"id": 1</code>).</>, <><b>Проверка кода от ИИ:</b> 4 вопроса — файлы · списки · логика в Service · decorator; 3 неожиданных запроса — id из букв (<code>/abc</code>) · пустой body (<code>{'{}'}</code>) · чужое поле (<code>"id": 1</code>).</>)}</div></Block>
  </>)} />;
}

// --- Tekshiruv 6: AI (B) yozgan create() — takror id. Haqiqiy kod: ai-nest1/B2-nest/01-diff.txt, 32–39-satr ---
const LCAI_LINES = [
  { n: 32, h: `  <span class="c">create</span>(data: <span class="c">CreateCustomerData</span>): <span class="c">Customer</span> {` },
  { n: 33, h: `    <span class="k">if</span> (data.age < <span class="d">18</span>) {` },
  { n: 34, h: `      <span class="k">throw new</span> <span class="c">BadRequestException</span>(<span class="s">'Customer must be at least 18 years old'</span>);` },
  { n: 35, h: `    }` },
  { n: 36, h: `    <span class="k">const</span> customer: <span class="c">Customer</span> = { id: <span class="k">this</span>.nextId++, ...data };` },
  { n: 37, h: `    <span class="k">this</span>.customers.<span class="c">push</span>(customer);` },
  { n: 38, h: `    <span class="k">return</span> customer;` },
  { n: 39, h: `  }` },
];
// Tuzatilgan holat — ai-nest1/B2-nest-tuzatilgan (haqiqiy yurgizish): id oxirida, body'dagi id e'tiborga olinmaydi.
// Natija qatorlari 04-sorovlar.txt dan qisqartirilgan («…» — qolgan maydonlar), id va status o'zgarmagan.
const LCAI_FIXED = [
  ...LCAI_LINES.slice(0, 4),
  { gone: true, n: '', h: LCAI_LINES[4].h },
  { neu: true, n: 36, h: `    <span class="k">const</span> customer: <span class="c">Customer</span> = { ...data, id: <span class="k">this</span>.nextId++ };` },
  ...LCAI_LINES.slice(5),
];
const LCAI_RUN = [
  { h: `<span class="p">POST /customers</span> {"id":1,"name":"Soxta",…}` },
  { h: `→ <span class="ok">201</span> {"id":5,"name":"Soxta",…}` },
  { h: `<span class="p">GET /customers/1</span> → <span class="ok">200</span> {"id":1,"name":"Ali",…}` },
];
function ScreenLCAI(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 6', 'Проверка 6')} eyebrow={t('Tekshiruv · 6 / 6 — qaysi satr xato?', 'Проверка · 6 / 6 — какая строка с ошибкой?')} title={t("AI yozgan create(): qaysi satr takror id'ga sabab?", 'create() от ИИ: какая строка даёт повторный id?')}
    task={t('Qoida: yangi yozuvning id\'sini <b>server beradi</b>, so\'rovdan kelgan id qabul qilinmaydi. Body\'da <code>"id": 1</code> yuborilganda ro\'yxatda ikkinchi <code>id: 1</code> paydo bo\'ldi. <b>Aybdor satrni bosing.</b>', 'Правило: id новой записи <b>выдаёт сервер</b>, id из запроса не принимается. Когда в body отправили <code>"id": 1</code>, в списке появился второй <code>id: 1</code>. <b>Нажмите на виноватую строку.</b>')}
    q={t("Oltinchi, oxirgi tekshiruv. Bu B yozgan create metodi, customers papkasidagi customers service ts faylida. Body ichida id bir yuborilganda, ro'yxatda ikkinchi id bir paydo bo'ldi. Qoida: yangi yozuvning id'sini server beradi, so'rovdan kelgan id qabul qilinmaydi. Qaysi satr so'rovdagi id'ni o'tkazib yuboryapti? O'sha satrni bosing.", 'Шестая, последняя проверка. Это метод create, который написал B, в файле customers service ts в папке customers. Когда в body отправили id один, в списке появился второй id один. Правило: id новой записи выдаёт сервер, id из запроса не принимается. Какая строка пропускает id из запроса? Нажмите на эту строку.')}
    file={t('src/customers/customers.service.ts · create() — B yozgan', 'src/customers/customers.service.ts · create() — написал B')} lines={LCAI_LINES} target={4}
    tree={{ files: AI_FILES, active: 'src/customers/customers.service.ts' }}
    fixed={LCAI_FIXED} fixedExtra={[{ file: t('terminal — tuzatilgandan keyin (haqiqiy)', 'terminal — после исправления (настоящий)'), lines: LCAI_RUN }]}
    ok={t("To'g'ri. O'ttiz oltinchi satrda avval server bergan id yoziladi, keyin data'ning hamma maydoni ustidan yoziladi, body'dagi id ham. Tuzatish: id'ni oxiriga qo'yish. Tuzatilgan kodda id bir yuborilsa ham yangi mijoz besh raqamini oldi. Bo'sh POST'ni esa DTO va ValidationPipe yopadi. Demak, AI kodida uch nuqta bilan yoyishni ko'rsangiz, tartibiga qarang.", 'Верно. В тридцать шестой строке сначала записывается id от сервера, а потом поверх него все поля data, в том числе id из body. Исправление: поставить id в конец. В исправленном коде, даже если отправить id один, новый клиент получил номер пять. А пустой POST закрывают DTO и ValidationPipe. Значит, если в коде от ИИ видите разворот через три точки, смотрите на порядок.')}
    okShort={t("36-satr: { id: …, ...data } — body'dagi id server bergan id ustidan yoziladi. Tuzatildi: { ...data, id: this.nextId++ } → yangi mijoz id 5 (sinab ko'rilgan).", 'Строка 36: { id: …, ...data } — id из body записывается поверх id от сервера. Исправлено: { ...data, id: this.nextId++ } → новый клиент id 5 (проверено).')}
    hint={t("Bu satr yoshni tekshiradi, ro'yxatga qo'shadi yoki natijani qaytaradi. Yangi mijoz obyekti yig'ilayotgan satrni qidiring.", 'Эта строка проверяет возраст, добавляет в список или возвращает результат. Ищите строку, где собирается объект нового клиента.')} />;
}
