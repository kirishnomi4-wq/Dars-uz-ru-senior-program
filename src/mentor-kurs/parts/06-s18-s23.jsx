
// ============================================================
//  5-BOSQICH · S18–S23, LineCheck 2, Amaliyot 3
// ============================================================
const MODULE_BROKEN = [
  { h: `<span class="d">@Module</span>({` },
  { h: `  controllers: [<span class="c">CarsController</span>],` },
  { gone: true, h: `  providers: [<span class="c">CarsService</span>]` },
  { neu: true, h: `  providers: []` },
  { h: `})` },
];
const ERR1 = [
  { at: 1, id: 'e-who', h: `ERROR [ExceptionHandler] Nest can't resolve dependencies of the <span class="er">CarsController (?)</span>.` },
  { at: 2, id: 'e-what', h: `Please make sure that the argument <span class="er">CarsService at index [0]</span> is available` },
  { at: 3, id: 'e-where', h: `in the <span class="er">CarsModule</span> module.` },
  { at: 4, h: `` },
  { at: 4, id: 'e-solutions', h: `Potential solutions:` },
  { at: 4, id: 'e-solutions', h: `- Is CarsModule a valid NestJS module?` },
  { at: 4, id: 'e-solutions', h: `- If CarsService is a provider, is it part of the current CarsModule?` },
  { at: 4, id: 'e-solutions', h: `- If CarsService is exported from a separate @Module, is that module imported within CarsModule?` },
];
// F-1120-02: buzishdan oldingi butun holat — CarsService bosiladi (data-act)
const MODULE_OK = [
  { h: `<span class="d">@Module</span>({` },
  { h: `  controllers: [<span class="c">CarsController</span>],` },
  { h: `  providers: [<span class="c n1-act" data-act="1">CarsService</span>]` },
  { h: `})` },
];
// Tuzatilgan holat va muvaffaqiyatli terminal — har «Buzamiz» ekrani tuzatish bilan tugaydi (MENTOR_DARS_ETALON 3-qonun, F-1030-13)
const MODULE_FIXED = [
  { h: `<span class="d">@Module</span>({` },
  { h: `  controllers: [<span class="c">CarsController</span>],` },
  { gone: true, h: `  providers: []` },
  { neu: true, h: `  providers: [<span class="c">CarsService</span>]` },
  { h: `})` },
];
const OK_CARS = [
  { h: `[Nest] LOG [RoutesResolver] CarsController {/cars}:` },
  { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars, GET} route</span>` },
  { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars/:id, GET} route</span>` },
  { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars, POST} route</span>` },
  { h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
];
const S18 = {
  kicker: '5-bosqich · buzamiz 1', title: "Buzamiz 1: providers bo'sh",
  segments: [
    // F-1120-02: mentor o'zi buzadi — kodda yonib turgan so'zni bosadi (act); keyingi segment buzilgan holatdan boshlanadi
    { id: 'x', key: "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>CarsService</code> ustiga bosing", text: "Ishlaydigan modulimiz bor. Endi uni ataylab buzamiz, chunki o'quvchilaringiz aynan shu xatolarni qiladi, siz esa ularni o'qiy olishingiz kerak. Bu safar buzishni o'zingiz qilasiz: o'ngdagi kodda CarsService so'zi yonib turibdi, ustiga bosing.", act: "O'ngdagi kodda yonib turgan <b>CarsService</b> ustiga bosing — u providers ro'yxatidan o'chadi.", focus: [] },
    { id: 'a', key: "Ataylab buzamiz: <code>cars.module.ts</code>'da <b>providers bo'sh</b> qoldi", text: "Birinchi holat: cars module da providers ro'yxatidan CarsService'ni o'chirdingiz, ro'yxat bo'sh qoldi.", focus: [] },
    { id: 'b', key: "Server yiqildi. 1-bo'lak — <b>qaysi klass?</b> CarsController; <code>(?)</code> — topilmagan dependency o'rni", text: "Serverni ishga tushiramiz, u yiqiladi. Xabarni uch bo'lakka bo'lib o'qiymiz. Birinchi bo'lak, qaysi klass: Nest CarsController'ning dependency'larini topa olmadi. Qavsdagi so'roq belgisi topilmagan dependency'ning o'rni.", show: "Serverni ishga tushiramiz, u yiqiladi. Xabarni uch bo'lakka bo'lib o'qiymiz. 1 · <b>qaysi klass</b>: <b>Nest can't resolve dependencies of the CarsController</b> — Nest CarsController'ning dependency'larini topa olmadi. Qavsdagi <b>(?)</b> — topilmagan dependency'ning o'rni.", focus: ['e-who'] },
    { id: 'c', key: "2-bo'lak — <b>qaysi dependency yetishmayapti?</b> CarsService, konstruktordagi 0-argument", text: "Ikkinchi bo'lak, qaysi dependency yetishmayapti: nolinchi argument, ya'ni konstruktordagi birinchi parametr, CarsService.", show: "2 · <b>qaysi dependency</b>: <b>argument CarsService at index [0] is available</b> — nolinchi argument, ya'ni konstruktordagi birinchi parametr, CarsService.", focus: ['e-what'] },
    { id: 'd', key: "3-bo'lak — <b>qaysi fayl?</b> CarsModule, ya'ni <code>cars.module.ts</code>", text: "Uchinchi bo'lak, qaysi faylni ochamiz: Nest CarsModule'da qidirdi va topmadi, demak cars module ts fayli. Mana, uch savolga javob bor: qaysi klass, qaysi dependency, qaysi fayl.", show: "3 · <b>qaysi fayl</b>: <b>in the CarsModule module</b> — Nest CarsModule'da qidirdi va topmadi, demak <code>cars.module.ts</code>. Uch savolga javob bor: <b>qaysi klass · qaysi dependency · qaysi fayl</b>.", focus: ['e-where'] },
    { id: 'e', key: "Pastda Nest <b>yechimni o'zi taklif qiladi</b>: CarsService shu modulda bormi?", text: "Pastda Nest o'zi yechimlarni sanaydi. Ikkinchisi bizning holat: CarsService provider bo'lsa, u shu modulda bormi? Yo'q, biz uni o'chirganmiz.", focus: ['e-solutions'] },
    { id: 'f', key: "Tuzatamiz: <code>providers: [CarsService]</code> qaytdi — server <b>ishga tushdi</b>", text: "Tuzatamiz: cars module ts faylini ochib, providers ro'yxatiga CarsService'ni qaytaramiz va saqlaymiz. start dev serverni o'zi qayta yuklaydi: terminalda Mapped satrlari va successfully started.", focus: [] },
    { id: 'g', key: "Xulosa: «can't resolve dependencies» ko'rsangiz — <b>modul faylini oching</b>, providers'ni tekshiring", text: "Xulosa: bu Nest'dagi eng ko'p uchraydigan xato. Xabarni uch savol bilan o'qiysiz: qaysi klass, qaysi dependency, qaysi fayl. Javob esa doim modul faylida: yetishmayotgan Service providers ro'yxatiga yoziladi.", focus: [] },
  ],
};
function Screen18(p) {
  return <Lesson p={p} S={S18} sceneTop scene={(b) => <Scene18 b={b} />} />;
}
// Qadamlar (F-1120-02 dan): 0 bosing · 1 buzildi · 2–4 xatoning 3 bo'lagi · 5 yechimlar · 6 tuzatildi · 7 xulosa
function Scene18({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const broken = act.hit || beat >= 1;
  const fixed = beat >= 6;
  const pin = beat === 2 ? 1 : beat === 3 ? 2 : beat === 4 ? 3 : 0;
  return (
    <Ide className="mk-zich" files={ALL_FILES} active="src/cars/cars.module.ts">
      <div onClick={act.onClick}><CodePanel key={fixed ? 'f' : broken ? 'b' : 'o'} file="src/cars/cars.module.ts" numbers={false} lines={fixed ? MODULE_FIXED : broken ? MODULE_BROKEN : MODULE_OK} style={{ opacity: beat >= 2 && beat <= 5 ? 0.5 : 1, transition: 'opacity .4s' }} /></div>
      <MiniProviders broken={broken} fixed={fixed} pin={pin} known={!broken || beat >= 2} />
      {fixed
        ? <CodePanel file={t('terminal — tuzatildi, server ishga tushdi', 'terminal — исправлено, сервер запустился')} numbers={false} wrap style={{ background: '#111827' }} lines={OK_CARS} />
        : <Block at={2} beat={beat}><CodePanel file={t('terminal — server yiqildi', 'terminal — сервер упал')} numbers={false} wrap style={{ background: '#1F1115' }} beat={beat - 1} lines={ERR1} focus={seg.focus} marks={{ 0: 'n1-p1', 1: 'n1-p2', 2: 'n1-p3' }} /></Block>}
      <Block at={7} beat={beat}><div className="mk-rule">{t(<><b>Qaysi klass · qaysi dependency · qaysi fayl.</b> «can't resolve dependencies» ko'rsangiz — modul faylini oching, <code>providers</code>'ni tekshiring.</>, <><b>Какой класс · какой dependency · какой файл.</b> Видите «can't resolve dependencies» — откройте файл модуля, проверьте <code>providers</code>.</>)}</div></Block>
    </Ide>
  );
}

// --- S19 yashirin xato (+ o'ylab ko'ring) ---
const S19 = {
  kicker: '5-bosqich · buzamiz 2', title: "Buzamiz 2: imports'da CarsModule yo'q",
  segments: [
    { id: 'x', key: "Yana <b>o'zingiz buzasiz</b>: <code>imports</code> ro'yxatidagi <code>CarsModule</code> ustiga bosing", text: "Birinchi xatoni o'qidik va tuzatdik. Ikkinchi holat boshqacha: bu safar server yiqilmaydi, va aynan shuning uchun xavfli. Buzishni yana o'zingiz qilasiz: app module faylida imports ro'yxatidagi CarsModule so'zi yonib turibdi, ustiga bosing.", act: "<b>app.module.ts</b>'dagi <b>CarsModule</b> ustiga bosing — u imports ro'yxatidan o'chadi." },
    { id: 'a', key: "Ataylab buzamiz: <code>app.module.ts</code>'ning <code>imports</code>'idan CarsModule olindi", text: "CarsModule imports ro'yxatidan olib tashlandi, ro'yxat bo'sh qoldi." },
    { id: 'b', key: "O'ylab ko'ring: server <b>xato bilan yiqiladimi</b> yoki ishga tushadimi?", text: "O'ylab ko'ring: serverni ishga tushirsak, xato chiqib yiqiladimi, yoki ishga tushadimi?", ask: { q: 'Server nima qiladi?', opts: ['Xato bilan yiqiladi', 'Ishga tushadi'], answer: 1 } },
    { id: 'c', key: "Server <b>ishga tushdi</b> — «successfully started», xato yo'q", text: "Server ishga tushdi, muvaffaqiyatli deb yozdi, hamma narsa yaxshidek. Xato yo'q." },
    { id: 'd', key: "Lekin <code>/cars</code> → <b>404</b>, root path esa ishlaydi", text: "Lekin cars route'ini so'rasak, to'rt yuz to'rt, Cannot GET cars. Root path esa ishlaydi.", show: "Lekin <code>/cars</code> so'rasak, <b>404, Cannot GET /cars</b>. <code>/</code> esa ishlaydi." },
    { id: 'e', key: "AppModule CarsModule'ni ulamadi — Nest cars papkasini <b>umuman o'qimadi</b>. Bu yashirin xato", text: "Nima bo'ldi? AppModule CarsModule'ni ulamadi, shuning uchun Nest cars papkasini umuman o'qimadi. Xato yo'q, chunki Nest uchun u modul shunchaki yo'q. Bu yashirin xato, eng xavflisi." },
    { id: 'f', key: "Topish yo'li: terminalda <b>CarsController satri ham, Mapped ham yo'q</b>", text: "Buni qanday topasiz? Terminalga qarang: CarsController satri yo'q, cars uchun Mapped satri yo'q. Terminaldagi satrlarni o'qishni odat qiling degan edim, sabab mana shu." },
    { id: 'g', key: "Tuzatamiz: <code>imports: [CarsModule]</code> qaytdi — Mapped satrlari <b>qaytib keldi</b>", text: "Tuzatamiz: app module ts faylida imports ro'yxatiga CarsModule'ni qaytaramiz. Server qayta yuklanadi va terminalda CarsController hamda uchta Mapped satri qaytib keladi. cars route'i yana ishlaydi." },
    { id: 'h', key: "Xulosa: 404 bo'lsa-yu kod to'g'ri ko'rinsa — <b>avval terminaldagi Mapped</b>, keyin imports", text: "Xulosa: route to'rt yuz to'rt bersa va kodingiz to'g'ri ko'rinsa, avval terminalda Mapped satrini qidiring, keyin bosh modulning imports ro'yxatini tekshiring." },
  ],
};
function Screen19(p) {
  return <Lesson p={p} S={S19} sceneTop scene={(b) => <Scene19 b={b} />} />;
}
// Qadamlar (F-1120-02 dan): 0 bosing · 1 buzildi · 2 o'ylab ko'ring · 3 ishga tushdi · 4 404 · 5 nima bo'ldi · 6 topish yo'li · 7 tuzatildi · 8 xulosa
function Scene19({ b }) {
  const { beat } = b;
  const act = useAct(b);
  const broken = act.hit || beat >= 1;
  const fixed = beat >= 7;
  if (fixed) return (
    <Ide className="mk-zich" files={ALL_FILES} active="src/app.module.ts">
      <CodePanel key="f" file="src/app.module.ts" numbers={false} lines={[{ h: `<span class="d">@Module</span>({` }, { gone: true, h: `  imports: [],` }, { neu: true, h: `  imports: [<span class="c">CarsModule</span>],` }, { h: `  controllers: [<span class="c">AppController</span>],` }, { h: `  providers: [<span class="c">AppService</span>],` }, { h: `})` }]} />
      <MiniImports broken fixed />
      <CodePanel file={t('terminal — tuzatildi', 'terminal — исправлено')} numbers={false} wrap style={{ background: '#111827' }} lines={[...OK_CARS, { h: `` }, { h: `<span class="p">GET /cars</span> → <span class="ok">200</span>  [{"id":1,"brand":"Chevrolet",…}, …]` }]} />
      <Block at={8} beat={beat}><div className="mk-rule">{t(<><b>404 + kod to'g'ri ko'rinadi?</b> 1) terminalda <code>Mapped</code> satrini qidiring · 2) bosh modulning <code>imports</code>'ini tekshiring.</>, <><b>404, а код выглядит верным?</b> 1) ищите в терминале строку <code>Mapped</code> · 2) проверьте <code>imports</code> главного модуля.</>)}</div></Block>
    </Ide>
  );
  const lines = broken
    ? [{ h: `<span class="d">@Module</span>({` }, { gone: true, h: `  imports: [<span class="c">CarsModule</span>],` }, { neu: true, h: `  imports: [],` }, { h: `  controllers: [<span class="c">AppController</span>],` }, { h: `  providers: [<span class="c">AppService</span>],` }, { h: `})` }]
    : [{ h: `<span class="d">@Module</span>({` }, { h: `  imports: [<span class="c n1-act" data-act="1">CarsModule</span>],` }, { h: `  controllers: [<span class="c">AppController</span>],` }, { h: `  providers: [<span class="c">AppService</span>],` }, { h: `})` }];
  return (
    <Ide className="mk-zich" files={ALL_FILES} active="src/app.module.ts">
      <Block at={0} beat={beat} dim={beat >= 3 && beat !== 5}><div onClick={act.onClick}><CodePanel key={broken ? 'b' : 'o'} file="src/app.module.ts" numbers={false} lines={lines} /></div></Block>
      <MiniImports broken={broken} fixed={false} known={beat >= 4} unread={beat >= 5} />
      <Block at={3} beat={beat}><CodePanel file={t("terminal — xato YO'Q", 'terminal — ошибки НЕТ')} numbers={false} wrap style={{ background: '#111827' }} beat={beat - 1} lines={[
        { at: 2, h: `[Nest] LOG [InstanceLoader] AppModule dependencies initialized` },
        { at: 2, h: `[Nest] LOG [RoutesResolver] AppController {/}:` },
        { at: 2, h: `[Nest] LOG [RouterExplorer] Mapped {/, GET} route` },
        { at: 5, id: 'miss', keep: true, h: t("<span class=\"er\">⟵ bu yerda CarsController {/cars} va Mapped {/cars…} bo'lishi kerak edi — yo'q</span>", '<span class="er">⟵ здесь должны были быть CarsController {/cars} и Mapped {/cars…} — их нет</span>') },
        { at: 2, id: 'ok', h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
        { at: 3, h: `` },
        { at: 3, h: `<span class="p">GET /cars</span> → <span class="er">404</span>  {"message":"Cannot GET /cars","error":"Not Found","statusCode":404}` },
        { at: 3, h: `<span class="p">GET /</span>     → <span class="ok">200</span>  Hello World!` }]} focus={beat === 3 ? ['ok'] : (beat === 6 ? ['miss'] : [])} /></Block>
    </Ide>
  );
}

// --- S20 Controller decorator'i yo'q ---
const S20 = {
  kicker: '5-bosqich · buzamiz 3', title: "Buzamiz 3: Controller decorator'i yo'q",
  segments: [
    { id: 'x', key: "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>@Controller('cars')</code> ustiga bosing", text: "Yashirin xatoni ko'rdik. Uchinchi holat decorator haqida: to'rtinchi ekranda aytgan qoidani endi amalda ko'ramiz. cars controller faylida Controller decorator'i yonib turibdi, ustiga bosib o'chiring.", act: "<b>cars.controller.ts</b>'dagi <b>@Controller('cars')</b> ustiga bosing — decorator o'chadi." },
    { id: 'a', key: "Ataylab buzamiz: <code>@Controller('cars')</code> o'chirildi, klass qoldi — server <b>yiqiladi</b>", text: "Decorator o'chdi, klass joyida qoldi. Server yiqiladi." },
    { id: 'b', key: "Xabar: «<b>invalid controller</b>» — belgi yo'q, lekin controllers ro'yxatida turibdi", text: "Xabar: noto'g'ri controller aniqlandi. CarsController'da Controller decorator'i yo'q, lekin u qaysidir modulning controllers ro'yxatida turibdi.", show: "<b>An invalid controller has been detected.</b> CarsController does not have the @Controller() decorator, but it is being listed in the controllers array of some module." },
    { id: 'c', key: "4-ekrandagi qoida ishladi: belgi bo'lmasa, <b>Nest klassni tanimaydi</b>", text: "Nest aniq aytyapti: siz uni ro'yxatga yozgansiz, lekin klassda belgi yo'q. Decorator'lar ekranida aytganimni eslang: belgi bo'lmasa, Nest klassni tanimaydi." },
    { id: 'd', key: "Tuzatamiz: decorator qaytdi — server <b>ishga tushdi</b>, Mapped satrlari joyida", text: "Tuzatish bitta satr: decorator'ni qaytaramiz. Server qayta yuklanadi, terminalda Mapped satrlari va successfully started." },
    { id: 'e', key: "Xulosa: «invalid controller» — <b>birinchi satr tushib qolgan</b>, decorator'ni qaytaring", text: "Xulosa: invalid controller xabarini ko'rsangiz, xabarda aytilgan klassning ustiga qarang. O'quvchilar buni ko'pincha kodni qo'lda ko'chirganda, birinchi satrni tushirib qoldirganda qiladi." },
  ],
};
function Screen20(p) {
  return <Lesson p={p} S={S20} sceneTop scene={(b) => <Scene20 b={b} />} />;
}
// Qadamlar (F-1120-02 dan): 0 bosing · 1 buzildi · 2 xabar · 3 qoida · 4 tuzatildi · 5 xulosa
function Scene20({ b }) {
  const { beat } = b;
  const act = useAct(b);
  const broken = act.hit || beat >= 1;
  const fixed = beat >= 4;
  const deco = fixed ? { neu: true, h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)` }
    : broken ? { gone: true, h: `<span class="d">@Controller</span>(<span class="s">'cars'</span>)   <span class="cm">${t("← o'chirildi", '← удалено')}</span>` }
    : { h: `<span class="n1-act" data-act="1"><span class="d">@Controller</span>(<span class="s">'cars'</span>)</span>` };
  return (<Ide className="mk-zich" files={ALL_FILES} active="src/cars/cars.controller.ts">
    <div onClick={act.onClick}><CodePanel key={fixed ? 'f' : broken ? 'b' : 'o'} file="src/cars/cars.controller.ts" lines={[
      { h: `<span class="k">import</span> { Body, Controller, Get, Param, Post } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
      { h: `` },
      deco,
      { h: `<span class="k">export class</span> <span class="c">CarsController</span> {` },
      { h: `  <span class="k">constructor</span>(<span class="k">private readonly</span> carsService: <span class="c">CarsService</span>) {}` },
      { h: `  <span class="cm">// …</span>` },
      { h: `}` }]} /></div>
    <MiniCtrlDeco broken={broken} fixed={fixed} />
    {fixed
      ? <CodePanel file={t('terminal — tuzatildi, server ishga tushdi', 'terminal — исправлено, сервер запустился')} numbers={false} wrap style={{ background: '#111827' }} lines={OK_CARS} />
      : <Block at={2} beat={beat}><CodePanel file={t('terminal — server yiqildi', 'terminal — сервер упал')} numbers={false} wrap style={{ background: '#1F1115' }} lines={[
          { h: `UnknownRequestMappingException [Error]: <span class="er">An invalid controller has been detected.</span>` },
          { h: `"CarsController" <span class="er">does not have the @Controller() decorator</span>` },
          { h: `but it is being listed in the "controllers" array of some module.` }]} /></Block>}
    <Block at={5} beat={beat}><div className="mk-rule">{t(<><b>«invalid controller»</b> → xabardagi klass ustiga qarang: decorator tushib qolgan. Bitta satr bilan tuzatiladi.</>, <><b>«invalid controller»</b> → посмотрите над классом из сообщения: пропал decorator. Исправляется одной строкой.</>)}</div></Block>
  </Ide>);
}

// --- S21 Injectable yo'q (+ o'ylab ko'ring) — haqiqiy chiqishlar: manba/nest-out/12 (500) va 14 (nazorat, 200) ---
const S21 = {
  kicker: '5-bosqich · buzamiz 4', title: "Buzamiz 4: Injectable decorator'i yo'q",
  segments: [
    { id: 'x', key: "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>@Injectable()</code> ustiga bosing", text: "Controller decorator'siz Nest klassni tanimadi. Service'da ham shundaymi? To'rtinchi holat: cars service faylida Injectable decorator'i yonib turibdi, ustiga bosib o'chiring.", act: "<b>cars.service.ts</b>'dagi <b>@Injectable()</b> ustiga bosing — decorator o'chadi." },
    { id: 'a', key: "Ataylab buzamiz: <code>cars.service.ts</code>'dan <code>@Injectable()</code> o'chirildi", text: "Injectable o'chdi. Service'ning o'zida konstruktor yo'q, u hech kimga bog'liq emas." },
    { id: 'b', key: "O'ylab ko'ring: <code>@Injectable()</code>'siz <code>/cars</code> <b>ishlaydimi?</b>", text: "O'ylab ko'ring: serverni ishga tushirsak, cars route'i ishlaydimi?", ask: { q: "Injectable decorator'siz /cars ishlaydimi?", opts: ['Ha, ishlaydi', "Yo'q, xato chiqadi"], answer: 0 } },
    { id: 'c', key: "<b>Ishlayapti!</b> CarsService hech kimga bog'liq emas — Nest uni oddiy yaratdi", text: "Kutilmagan natija: hammasi ishlayapti, cars route'i ikki yuz qaytaryapti. Nega? CarsService'ning o'zining konstruktorida hech qanday dependency yo'q. Nest uni dependency'siz yaratib qo'ya oldi." },
    { id: 'd', key: "<code>@Injectable()</code> Nest'ga aytadi: <b>konstruktorga qarab, nima kerakligini aniqla</b>", text: "Injectable aslida Nest'ga shuni aytadi: bu klassning konstruktoriga qarab, unga nima kerakligini aniqlang. Belgi bo'lmasa, Nest konstruktorga qaramaydi." },
    { id: 'd2', key: "Dependency qo'shsak: server <b>ishga tushadi</b>, lekin so'rovda <b>500</b> — bu yashirin xato", text: "Endi sinab ko'ramiz: shu Injectable'siz Service'ga dependency qo'shamiz, konstruktorida PricingService so'raladi. Natija kutilmagan: server xatosiz ishga tushadi, Mapped satrlari joyida. Lekin cars so'rovi besh yuz qaytaradi, terminalda TypeError: undefined ning withDiscount xossasini o'qib bo'lmaydi. Nest dependency'ni inject qilmadi va xato ham bermadi, maydon bo'sh qoldi. Bu yashirin xato: ishga tushishda emas, birinchi so'rovda chiqadi.", show: "Injectable'siz Service'ga dependency qo'shdik (<code>constructor(private pricing: PricingService)</code>). Server <b>xatosiz ishga tushadi</b>, lekin <code>GET /cars</code> → <b>500</b>, terminalda <code>TypeError: Cannot read properties of undefined (reading 'withDiscount')</code>. Nest dependency'ni inject qilmadi va xato bermadi — maydon bo'sh. <b>Yashirin xato</b>: ishga tushishda emas, birinchi so'rovda." },
    { id: 'd3', key: "Tuzatamiz: <code>@Injectable()</code> qaytdi — PricingService inject qilindi, <code>/cars</code> → <b>200</b>", text: "Tuzatamiz: Injectable decorator'ini qaytaramiz. PricingService modulning providers ro'yxatida turibdi. Endi Nest konstruktorga qaraydi, PricingService'ni inject qiladi va cars so'rovi yana ikki yuz qaytaradi.", show: "Tuzatamiz: <code>@Injectable()</code> qaytdi. <code>PricingService</code> modulning <code>providers</code>'ida turibdi. Endi Nest konstruktorga qaraydi, PricingService'ni inject qiladi va <code>GET /cars</code> yana <b>200</b> qaytaradi." },
    { id: 'e', key: "Xulosa: <code>@Injectable()</code> <b>har Service'ga yoziladi</b>, hozir kerak bo'lmasa ham", text: "Xulosa va qoida: Injectable har Service'ga yoziladi, hozir kerak bo'lmasa ham. O'quvchi men o'chirdim, ishlayapti, demak kerak emas desa, siz nega kerakligini tushuntira olasiz: dependency paydo bo'lganda xato ishga tushishda emas, so'rov paytida chiqadi, uni topish qiyin." },
  ],
};
function Screen21(p) {
  return <Lesson p={p} S={S21} sceneTop scene={(b) => <Scene21 b={b} />} />;
}
// Qadamlar (F-1120-02 dan): 0 bosing · 1 buzildi · 2 o'ylab ko'ring · 3 ishlayapti · 4 nega · 5 dependency → 500 · 6 tuzatildi · 7 xulosa
function Scene21({ b }) {
  const { beat } = b;
  const act = useAct(b);
  const broken = act.hit || beat >= 1;
  const withDep = beat >= 5;
  const fixed = beat >= 6;
  const svcLines = [
    fixed ? { neu: true, h: `<span class="d">@Injectable</span>()   <span class="cm">${t('← qaytdi', '← вернули')}</span>` }
      : broken ? { gone: true, h: `<span class="d">@Injectable</span>()   <span class="cm">${t("← o'chirildi", '← удалено')}</span>` }
      : { h: `<span class="n1-act" data-act="1"><span class="d">@Injectable</span>()</span>` },
    { h: `<span class="k">export class</span> <span class="c">CarsService</span> {` },
    withDep
      ? { id: 'ctor', neu: !fixed, h: `  <span class="k">constructor</span>(<span class="k">private readonly</span> pricing: <span class="c">PricingService</span>) {}` }
      : { id: 'ctor', h: `  <span class="cm">${t("// konstruktor yo'q — hech kimga bog'liq emas", '// конструктора нет — ни от кого не зависит')}</span>` },
    { h: `  <span class="k">private</span> cars: <span class="c">Car</span>[] = [ <span class="cm">…</span> ];` },
    withDep
      ? { h: `  <span class="c">findAll</span>() { <span class="k">return this</span>.cars.<span class="c">map</span>((c) => ({ ...c, price: <span class="k">this</span>.pricing.<span class="c">withDiscount</span>(c.price) })); }` }
      : { h: `  <span class="c">findAll</span>() { <span class="k">return this</span>.cars; }` },
    { h: `}` }];
  return (
    <Ide files={[...ALL_FILES, 'src/cars/pricing.service.ts']} active="src/cars/cars.service.ts">
      <div onClick={act.onClick}><CodePanel key={fixed ? 'f' : withDep ? 'd' : broken ? 'b' : 'o'} file="src/cars/cars.service.ts" lines={svcLines} focus={beat === 1 || beat === 3 || beat === 5 ? ['ctor'] : []} /></div>
      <MiniInjectable broken={broken} dep={withDep} fixed={fixed} known={!broken || beat >= 3} />
      {fixed
        ? <CodePanel file={t('terminal — tuzatildi (haqiqiy chiqish)', 'terminal — исправлено (реальный вывод)')} numbers={false} wrap style={{ background: '#111827' }} lines={[
            { h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
            { h: `<span class="p">GET /cars</span> → <span class="ok">200</span>  [{"id":1,"brand":"Chevrolet",…}, {"id":2,"brand":"Kia",…}]` }]} />
        : withDep
          ? <CodePanel file={t("terminal — Injectable'siz + dependency (haqiqiy chiqish)", 'terminal — без Injectable + dependency (реальный вывод)')} numbers={false} wrap style={{ background: '#1F1115' }} lines={[
              { h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
              { h: `<span class="p">GET /cars</span> → <span class="er">500</span>  {"statusCode":500,"message":"Internal server error"}` },
              { h: `[Nest] ERROR [ExceptionsHandler] <span class="er">TypeError: Cannot read properties of undefined (reading 'withDiscount')</span>` },
              { h: `    at CarsService.findAll (src/cars/cars.service.ts:21:22)` }]} />
          : <Block at={3} beat={beat}><CodePanel file="terminal" numbers={false} wrap style={{ background: '#111827' }} lines={[
              { h: `[Nest] LOG [RouterExplorer] <span class="ok">Mapped {/cars, GET} route</span>` },
              { h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` },
              { h: `<span class="p">GET /cars</span> → <span class="ok">200</span>  [{"id":1,"brand":"Chevrolet",…}, {"id":2,"brand":"Kia",…}]` }]} /></Block>}
      <Block at={7} beat={beat}><div className="mk-rule">{t(<><b>Qoida:</b> <code>@Injectable()</code> har Service'ga yoziladi, dependency'si bo'lmasa ham. Bo'lmasa — dependency paydo bo'lganda <b>yashirin xato</b>: server ishga tushadi, so'rovda 500.</>, <><b>Правило:</b> <code>@Injectable()</code> пишут на каждый Service, даже без dependency. Иначе, когда dependency появится, — <b>скрытая ошибка</b>: сервер запускается, а на запросе 500.</>)}</div></Block>
    </Ide>
  );
}

// --- Tekshiruv 4: qaysi satr xato (modul) ---
const LC2_LINES = [
  { h: `<span class="k">import</span> { Module } <span class="k">from</span> <span class="s">'@nestjs/common'</span>;` },
  { h: `<span class="k">import</span> { OrdersController } <span class="k">from</span> <span class="s">'./orders.controller'</span>;` },
  { h: `<span class="k">import</span> { OrdersService } <span class="k">from</span> <span class="s">'./orders.service'</span>;` },
  { h: `<span class="k">import</span> { PaymentService } <span class="k">from</span> <span class="s">'./payment.service'</span>;` },
  { h: `` },
  { h: `<span class="d">@Module</span>({` },
  { h: `  imports: [],` },
  { h: `  controllers: [<span class="c">OrdersController</span>, <span class="c">PaymentService</span>],` },
  { h: `  providers: [<span class="c">OrdersService</span>],` },
  { h: `})` },
  { h: `<span class="k">export class</span> <span class="c">OrdersModule</span> {}` },
];
// Topilgach — tuzatilgan holat (F-1030-14): PaymentService controllers'dan chiqadi, providers'ga kiradi
// n — tuzatilgan fayldagi haqiqiy satr raqami: ovoz «sakkizinchi / to'qqizinchi satr» deydi (nest-linecheck/TAKLIF.md)
const LC2_FIXED = [
  ...LC2_LINES.slice(0, 7).map((l, i) => ({ ...l, n: i + 1 })),
  { gone: true, n: '', h: LC2_LINES[7].h },
  { neu: true, n: 8, h: `  controllers: [<span class="c">OrdersController</span>],   <span class="cm">// faqat Controller qoldi</span>` },
  { gone: true, n: '', h: LC2_LINES[8].h },
  { neu: true, n: 9, h: `  providers: [<span class="c">OrdersService</span>, <span class="c">PaymentService</span>],   <span class="cm">// Service — shu yerda</span>` },
  ...LC2_LINES.slice(9).map((l, i) => ({ ...l, n: 10 + i })),
];
function ScreenLC2(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 4', 'Проверка 4')} eyebrow={t('Tekshiruv · 4 / 6 — qaysi satr xato?', 'Проверка · 4 / 6 — какая строка с ошибкой?')} title={t("Server yiqiladi: «can't resolve dependencies of the OrdersController»", "Сервер падает: «can't resolve dependencies of the OrdersController»")}
    task={t("Qoida: Controller — <code>controllers</code>'da, Service — <code>providers</code>'da. Bu modulda bitta narsa <b>noto'g'ri ro'yxatga</b> yozilgan. <b>O'sha satrni bosing.</b>", 'Правило: Controller — в <code>controllers</code>, Service — в <code>providers</code>. В этом модуле одна вещь записана <b>не в тот список</b>. <b>Нажмите на эту строку.</b>')}
    q={t("To'rt xato holatini ko'rdingiz, endi o'zingiz toping. To'rtinchi tekshiruv. Bu modul bilan server yiqiladi: OrdersController'ning dependency'si topilmadi deydi. Qoidani eslang: Controller controllers ro'yxatida, Service providers ro'yxatida. Bitta narsa noto'g'ri ro'yxatda. O'sha satrni bosing.", 'Четыре случая ошибок вы увидели, теперь найдите сами. Четвёртая проверка. С этим модулем сервер падает: пишет, что не найден dependency для OrdersController. Вспомните правило: Controller в списке controllers, Service в списке providers. Одна вещь стоит не в том списке. Нажмите на эту строку.')}
    file="src/orders/orders.module.ts" lines={LC2_LINES} target={[7, 8]}
    tree={{ root: 'shop-api', files: ['src/orders/orders.module.ts', 'src/orders/orders.controller.ts', 'src/orders/orders.service.ts', 'src/orders/payment.service.ts'], active: 'src/orders/orders.module.ts' }}
    fixed={LC2_FIXED}
    ok={t("To'g'ri. PaymentService bu Service, lekin u controllers ro'yxatiga yozilgan, providers'da esa yo'q. Ekranda tuzatilgan holat ko'rinib turibdi: sakkizinchi satrda faqat OrdersController qoldi, PaymentService to'qqizinchi satrga, providers'ga ko'chdi. Endi Nest uni yaratadi va OrdersController'ga inject qiladi. Demak, Service doim providers ro'yxatiga yoziladi, controllers'ga emas.", 'Верно. PaymentService — это Service, но он записан в список controllers, а в providers его нет. На экране исправленный вариант: в восьмой строке остался только OrdersController, а PaymentService перенесён в девятую строку, в providers. Теперь Nest его создаст и сделает inject в OrdersController. Значит, Service всегда записывают в providers, а не в controllers.')}
    okShort={t("PaymentService — Service, u providers'da bo'lishi kerak. Tuzatildi: controllers: [OrdersController] · providers: [OrdersService, PaymentService].", 'PaymentService — это Service, он должен быть в providers. Исправлено: controllers: [OrdersController] · providers: [OrdersService, PaymentService].')}
    hint={t("Bu satr o'z joyida. Har narsa o'z ro'yxatidami: Controller controllers'da, Service providers'da? Nomi Service bilan tugaydigan narsani qidiring.", 'Эта строка на своём месте. Всё ли в своём списке: Controller в controllers, Service в providers? Ищите то, что заканчивается на Service.')} />;
}

// --- S22 Error vs HttpException ---
const S22 = {
  kicker: '5-bosqich · xato turi', title: 'Xatoning ikki turi: Error va HttpException',
  segments: [
    { id: 'a', key: "Ataylab buzamiz: <code>findOne</code>'da NotFoundException o'rniga <b>oddiy Error</b> tashladik", text: "Hozirgacha xatolar server ishga tushayotganda chiqdi. Oxirgi holat boshqa: server ishlayapti, xato so'rov paytida tashlanadi. Qaysi status qaytadi? cars service ts ichidagi findOne'da NotFoundException o'rniga oddiy Error tashladik, matni topilmadi." },
    { id: 'b', key: "Javob <b>500</b>, «topilmadi» matni yo'qoldi — Nest kutilmagan xatoni yashiradi", text: "Javob: besh yuz, Internal server error. Bizning topilmadi matnimiz yo'qoldi. Nest kutilmagan xatoni foydalanuvchiga ko'rsatmaydi, bu to'g'ri: ichki tafsilot tashqariga chiqmasligi kerak." },
    { id: 'c', key: "<b>HttpException oilasini</b> Nest taniydi: to'g'ri status va xabar bilan qaytaradi", text: "NotFoundException esa Nest'ning HttpException oilasidan. Nest uni taniydi va to'g'ri status bilan, xabari bilan qaytaradi." },
    { id: 'd', key: "Oila: <b>400</b> BadRequest · <b>401</b> Unauthorized · <b>403</b> Forbidden · <b>404</b> NotFound", text: "Oilada boshqalari ham bor: BadRequest to'rt yuz, noto'g'ri ma'lumot. Unauthorized to'rt yuz bir, kirish qilinmagan. Forbidden to'rt yuz uch, ruxsat yo'q. NotFound to'rt yuz to'rt, topilmadi." },
    { id: 'e', key: "Tuzatamiz: <code>Error</code> → <code>NotFoundException</code> — javob yana <b>404</b> va xabar", text: "Tuzatamiz: findOne'dagi oddiy Error'ni NotFoundException'ga almashtiramiz. Endi cars to'qson to'qqiz so'roviga yana to'rt yuz to'rt va Car with id 99 not found xabari keladi." },
    { id: 'f', key: "Xulosa: o'quvchi «nega 500?» desa — <b>«qanday xato tashladingiz?»</b> deb so'rang va almashtiring", text: "Xulosa va sinfdagi qoida: foydalanuvchi bilishi kerak bo'lgan xato HttpException oilasi bilan tashlanadi, qolgani besh yuz bo'lib qoladi va xabari yashiriladi. O'quvchi nega besh yuz chiqyapti desa, birinchi savolingiz: qanday xato tashladingiz? Oddiy Error bo'lsa, mos HttpException'ga almashtirasiz: topilmasa NotFound, ma'lumot noto'g'ri bo'lsa BadRequest." },
  ],
};
function Screen22(p) {
  return <Lesson p={p} S={S22} sceneTop scene={({ beat }) => beat >= 4 ? (
    <Ide files={ALL_FILES} active="src/cars/cars.service.ts">
      <CodePanel file="src/cars/cars.service.ts · findOne" lines={[
        { h: `  <span class="c">findOne</span>(id: <span class="k">number</span>): <span class="c">Car</span> {` },
        { h: `    <span class="k">const</span> car = <span class="k">this</span>.cars.<span class="c">find</span>((c) => c.id === id);` },
        { gone: true, h: `    <span class="k">if</span> (!car) <span class="k">throw new</span> <span class="c">Error</span>(<span class="s">'${t('topilmadi', 'не найдено')}'</span>);` },
        { neu: true, h: `    <span class="k">if</span> (!car) <span class="k">throw new</span> <span class="c">NotFoundException</span>(<span class="s">\`Car with id \${id} not found\`</span>);` },
        { h: `    <span class="k">return</span> car;` },
        { h: `  }` }]} />
      <CodePanel file={t('terminal — tuzatildi', 'terminal — исправлено')} numbers={false} wrap style={{ background: '#111827' }} lines={[
        { h: `<span class="p">GET /cars/99</span> → <span class="ok">404</span>  {"message":"Car with id 99 not found","error":"Not Found","statusCode":404}` }]} />
      <Block at={5} beat={beat}><div className="mk-rule">{t(<><b>«Nega 500?»</b> → «Qanday xato tashladingiz?» Oddiy <code>Error</code> → mos HttpException: topilmasa <code>NotFoundException</code> (404), ma'lumot noto'g'ri bo'lsa <code>BadRequestException</code> (400).</>, <><b>«Почему 500?»</b> → «Какую ошибку вы бросили?» Обычный <code>Error</code> → подходящий HttpException: не найдено — <code>NotFoundException</code> (404), неверные данные — <code>BadRequestException</code> (400).</>)}</div></Block>
    </Ide>
  ) : (<Ide files={ALL_FILES} active="src/cars/cars.service.ts">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <Block at={0} beat={beat} dim={beat >= 2 && beat <= 3}><CodePanel file={t('oddiy Error', 'обычный Error')} numbers={false} wrap beat={beat} lines={[
        { h: `<span class="k">throw new</span> <span class="c">Error</span>(<span class="s">'${t('topilmadi', 'не найдено')}'</span>);` },
        { at: 1, h: `` },
        { at: 1, h: `<span class="p">GET /cars/99</span> → <span class="er">500</span>` },
        { at: 1, h: `{"statusCode":500,"message":"Internal server error"}` },
        { at: 1, h: `<span class="cm">${t("// «topilmadi» yo'qoldi — yashirildi", '// «не найдено» пропало — скрыто')}</span>` }]} /></Block>
      <Block at={2} beat={beat}><CodePanel file={t('HttpException oilasi', 'семейство HttpException')} numbers={false} wrap beat={beat} lines={[
        { h: `<span class="k">throw new</span> <span class="c">NotFoundException</span>(<span class="s">'Car with id 99 not found'</span>);` },
        { h: `` },
        { h: `<span class="p">GET /cars/99</span> → <span class="ok">404</span>` },
        { h: `{"message":"Car with id 99 not found","error":"Not Found","statusCode":404}` }]} /></Block>
    </div>
    <Block at={3} beat={beat}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
      {[['BadRequestException', 400, t("ma'lumot noto'g'ri", 'неверные данные')], ['UnauthorizedException', 401, t('kirish qilinmagan', 'вход не выполнен')], ['ForbiddenException', 403, t("ruxsat yo'q", 'нет доступа')], ['NotFoundException', 404, t('topilmadi', 'не найдено')]].map(([n, c, d], i) => <div key={n} className="mk-card" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}><h5 style={{ color: T.accent }}>{c} · {d}</h5><code style={{ fontSize: 11.5 }}>{n}</code></div>)}
    </div></Block>
  </Ide>)} />;
}

// --- S23 Tekshiruv 5 — xatoni o'qish ---
function Screen23(p) {
  const above = <CodePanel numbers={false} wrap style={{ marginBottom: 18, background: '#1F1115', flex: '0 0 auto', maxHeight: 'none' }} lines={[
    { h: `Nest can't resolve dependencies of the OrdersController (<span class="er">?</span>, OrdersService).` },
    { h: `Please make sure that the argument <span class="er">PaymentService at index [0]</span> is available` },
    { h: `in the <span class="er">OrdersModule</span> module.` }]} />;
  // To'g'ri javobdan keyin — tuzatilgan fayl Explorer bilan (M2: har kod misolida tuzatish ko'rinadi)
  const after = <>
    <div className="mk-tag" style={{ color: T.green, marginBottom: 8 }}>{t('Tuzatildi — yangi satr yashil', 'Исправлено — новая строка зелёная')}</div>
    <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="src/orders/orders.module.ts" numbers={false} lines={[
        { h: `<span class="d">@Module</span>({` },
        { h: `  controllers: [<span class="c">OrdersController</span>],` },
        { gone: true, h: `  providers: [<span class="c">OrdersService</span>],` },
        { neu: true, h: `  providers: [<span class="c">OrdersService</span>, <span class="c">PaymentService</span>],   <span class="cm">${t("// qo'shildi", '// добавлено')}</span>` },
        { h: `})` }]} />
      <CodePanel file={t('terminal — tuzatildi', 'terminal — исправлено')} numbers={false} wrap style={{ background: '#111827' }} lines={[
        { h: `[Nest] LOG [InstanceLoader] <span class="ok">OrdersModule dependencies initialized</span>` },
        { h: `[Nest] LOG [NestApplication] <span class="ok">Nest application successfully started</span>` }]} />
    </div>
  </>;
  return <MCRetry {...p} kicker={t('Tekshiruv 5', 'Проверка 5')} eyebrow={t("Tekshiruv · 5 / 6 — xatoni o'qish", 'Проверка · 5 / 6 — чтение ошибки')} above={above} after={after}
    title={t("Bu o'quvchingizning loyihasi. Qaysi faylni ochasiz va nimani tuzatasiz?", 'Это проект вашего ученика. Какой файл вы откроете и что исправите?')}
    q={t("Sinfdagi haqiqiy holat. Beshinchi tekshiruv. Ekrandagi xabarni o'qing. Bu sizning emas, o'quvchingizning loyihasi, u yordam so'radi. Qaysi faylni ochasiz va nimani tuzatasiz?", 'Настоящая ситуация в классе. Пятая проверка. Прочитайте сообщение на экране. Это не ваш проект, а проект вашего ученика, он попросил помощи. Какой файл вы откроете и что исправите?')}
    opts={t(["orders.controller.ts — konstruktordan OrdersService'ni o'chirish", "orders.module.ts — providers'ga PaymentService qo'shish", "app.module.ts — imports'ga OrdersController qo'shish", "payment.service.ts — Controller decorator'i qo'shish"], ['orders.controller.ts — удалить OrdersService из конструктора', 'orders.module.ts — добавить PaymentService в providers', 'app.module.ts — добавить OrdersController в imports', 'payment.service.ts — добавить decorator Controller'])} correct={1}
    ok={t("To'g'ri: orders module faylida providers ro'yxatiga PaymentService qo'shiladi. Xabarda hamma narsa yozilgan: klass OrdersController, dependency PaymentService, index nol, fayl OrdersModule. Qavsda so'roq belgisi birinchi o'rinda turibdi, OrdersService esa ikkinchi o'rinda topilgan. Ekranda tuzatilgan fayl: PaymentService qo'shildi va server ishga tushdi. Demak, so'roq belgisi turgan o'rindagi dependency yetishmayapti.", 'Верно: в файле orders module в список providers добавляется PaymentService. В сообщении написано всё: класс OrdersController, dependency PaymentService, index ноль, файл OrdersModule. В скобках знак вопроса стоит на первом месте, а OrdersService на втором найден. На экране исправленный файл: PaymentService добавлен, и сервер запустился. Значит, не хватает того dependency, на месте которого стоит знак вопроса.')}
    okShort={t("orders.module.ts → providers: [OrdersService, PaymentService]. Klass: OrdersController · dependency: PaymentService, index [0] · fayl: orders.module.ts.", 'orders.module.ts → providers: [OrdersService, PaymentService]. Класс: OrdersController · dependency: PaymentService, index [0] · файл: orders.module.ts.')}
    wrong={t({ 0: "OrdersService topilgan, muammo unda emas.", 2: "Controller imports'ga yozilmaydi, imports faqat modullar uchun.", 3: "Controller decorator'i Service'ga qo'yilmaydi; bu xabar PaymentService modul ro'yxatida yo'qligini aytyapti." }, { 0: 'OrdersService найден, проблема не в нём.', 2: 'Controller не пишут в imports, imports — только для модулей.', 3: 'Decorator Controller не ставят на Service; это сообщение говорит, что PaymentService нет в списке модуля.' })} />;
}

// --- Amaliyot 3: o'zingiz buzing va tuzating ---
const P3 = {
  kicker: 'Amaliyot 4 / 4', eyebrow: "Hozir o'zingizda · 5 daqiqa", title: "O'zingiz buzing va tuzating", tableAt: 3,
  segments: [
    { id: 'a', key: "Endi <b>siz buzasiz</b>: ikki holat — xatoni o'z ko'zingiz bilan o'qiysiz", text: "Oxirgi amaliyot: endi siz buzasiz. Ikki holat, besh daqiqa. Maqsad xatoni o'z ko'zingiz bilan ko'rish va o'qish.", hl: [] },
    { id: 'b', key: "1-qadam: <code>providers</code>'ni bo'shating, xabardan <b>qaysi klass · qaysi dependency · qaysi fayl</b>'ni toping, qaytaring", text: "Birinchi: cars module da providers ro'yxatini bo'shating, serverni ishga tushiring, xabardan qaysi klass, qaysi dependency va qaysi fayl ekanini toping. Topgan uchta javobingizni, klass, dependency va faylni, vergul bilan isbot maydoniga yozing, keyin providers'ni qaytaring.", hl: [0] },
    { id: 'c', key: "2-qadam: <code>imports</code>'dan CarsModule'ni oling — terminalda <b>qaysi satr yo'qolganini</b> toping", text: "Ikkinchi: app module da imports'dan CarsModule'ni olib tashlang. Server ishga tushadi. Terminalda qaysi satr yo'qolganini toping, cars route'ini so'rang, keyin qaytaring.", hl: [1] },
    { id: 'd', key: "3-qadam: hammasini qaytaring — terminalda <b>3 ta Mapped</b>, <code>/cars/99</code> → <b>404</b>", text: "Uchinchi: hammasini qaytaring va tekshiring. Terminalda yana uchta Mapped satri bo'lsin, cars to'qson to'qqiz so'rovi to'rt yuz to'rt va xabar qaytarsin. Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Uchala katakcha va isbot to'g'ri bo'lmaguncha Davom ochilmaydi. Demak, endi siz Nest xabaridan klass, dependency va faylni o'zingiz topa olasiz.", hl: [2] },
  ],
};
const P3_STEPS = [
  { t: "providers bo'sh", cmds: [], exp: "«Nest can't resolve dependencies of the CarsController (?)» → klass · dependency · fayl → providers: [CarsService] qaytaring" },
  { t: "imports'da CarsModule yo'q", cmds: [], exp: "server ishga tushadi · terminalda CarsController satri YO'Q · GET /cars → 404 → imports: [CarsModule] qaytaring" },
  { t: 'Qaytaring va tekshiring', cmds: [], exp: 'terminalda yana 3 ta Mapped {/cars…} · GET /cars/99 → 404 «Car with id 99 not found»' },
];
const P3_TROUBLE = [
  ['Qaytardim, baribir xato', "Faylni saqladingizmi? start:dev saqlashda o'zi qayta yuklaydi; terminalda yangi satrlarni kuting"],
  ['Boshqa xato chiqdi', "Xabarni uch savol bilan o'qing: qaysi klass · qaysi dependency · qaysi fayl. Potential solutions ro'yxati yechimni aytadi"],
];
// Isbot = M18 formulasi: xabardan topilgan uch javob (klass · dependency · fayl); fayl nomi yoki modul nomi qabul
const P3_PROOF = { label: "Isbot: 1-qadam xabaridan — qaysi klass, qaysi dependency, qaysi fayl? (vergul bilan)", placeholder: 'klass, dependency, fayl', check: (v) => { const x = v.toLowerCase().replace(/\s/g, ''); return x.includes('carscontroller') && x.includes('carsservice') && (x.includes('cars.module') || x.includes('carsmodule')); }, wrong: "Xabarni qayta o'qing: «of the ___» — klass, «argument ___ at index [0]» — dependency, «in the ___ module» — fayl" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }
