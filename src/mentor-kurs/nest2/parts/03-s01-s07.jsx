
// ============================================================
//  MENTOR KURSI · 4-dars (Nest-2) «O'quvchi reposi: bitta resurs, Guard va sinfdagi xatolar»
//  F-1031-01 · manba-haqiqat: feedback/F-1029-02-mentor-kurs/03-Nest2-mentor-v4.md (GATE M 31.10, 30/30)
//  Haqiqiy chiqishlar: feedback/F-1029-02-mentor-kurs/manba/nest2-out/ (00–27)
// ============================================================
const LESSON_ID = 'mentor-nest-02-oquvchi-reposi-v1';
const LESSON_TITLE = "O'quvchi reposi: bitta resurs, Guard va sinfdagi xatolar";
const N2 = { entity: T.purple, dto: '#C2410C', guard: '#B91C1C', term: '#111827', termEr: '#1F1115' };
MKCFG.root = 'IntroNestArxitechture';
MKCFG.kind = (f) => /\.entity\.ts$/.test(f) ? N2.entity : /\/dto\//.test(f) ? N2.dto : /guard/.test(f) ? N2.guard : null;

// Explorer: VS Code tartibi — har darajada avval papkalar, keyin fayllar (alifbo). Ro'yxat ekranga qarab tanlanadi (sig'ishi uchun).
const byTree = (a, b) => {
  const A = a.split('/'), B = b.split('/');
  for (let i = 0; i < Math.min(A.length, B.length); i++) {
    if (A[i] === B[i]) continue;
    const ad = i < A.length - 1, bd = i < B.length - 1;
    if (ad !== bd) return ad ? -1 : 1;
    return A[i].toLowerCase() < B[i].toLowerCase() ? -1 : 1;
  }
  return A.length - B.length;
};
const tree = (...groups) => Array.from(new Set(groups.flat())).sort(byTree);
const F = {
  main: 'src/main.ts', cfg: 'src/config/index.ts', appMod: 'src/api/app.module.ts', appSvc: 'src/api/app.service.ts',
  aMod: 'src/api/admin/admin.module.ts', aCtrl: 'src/api/admin/admin.controller.ts', aSvc: 'src/api/admin/admin.service.ts',
  aCdto: 'src/api/admin/dto/create-admin.dto.ts', aUdto: 'src/api/admin/dto/update-admin.dto.ts', aSdto: 'src/api/admin/dto/signin-admin.dto.ts',
  coreIdx: 'src/core/index.ts', baseEnt: 'src/core/entity/Base.entity.ts', aEnt: 'src/core/entity/admin.entity.ts', aRepo: 'src/core/repository/admin.repository.ts',
  authG: 'src/common/guard/auth.guard.ts', rolesG: 'src/common/guard/roles.guard.ts', rolesD: 'src/common/decorator/roles-decorator.ts',
  baseSvc: 'src/infrastructure/base/base.service.ts', filter: 'src/infrastructure/exception/AllException.filter.ts', okRes: 'src/infrastructure/response/successRes.ts',
  env: '.env', envEx: '.env.example',
  cEnt: 'src/core/entity/car.entity.ts', cCdto: 'src/api/car/dto/create-car.dto.ts', cUdto: 'src/api/car/dto/update-car.dto.ts',
  cSvc: 'src/api/car/car.service.ts', cCtrl: 'src/api/car/car.controller.ts', cMod: 'src/api/car/car.module.ts',
  bMod: 'src/api/book/book.module.ts', bCtrl: 'src/api/book/book.controller.ts', bSvc: 'src/api/book/book.service.ts', bEnt: 'src/core/entity/book.entity.ts',
};
const CAR_ALL = [F.cEnt, F.cCdto, F.cUdto, F.cSvc, F.cCtrl, F.cMod];
const BASE = [F.main, F.appMod, F.appSvc, F.coreIdx];
MKCFG.files = tree(BASE);

// Kod rang beruvchi (Nest-1 sinflari: k kalit so'z · s satr · d decorator/son · c klass · cm izoh). Matn — String.raw, HTML'siz.
const KW = /^(import|from|export|class|extends|implements|const|let|return|async|await|new|private|readonly|if|throw|this|constructor|static|void|type|true|false|null|undefined|abstract|string|number|boolean|try|catch|as|default)$/;
const escH = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function tsLine(src) {
  const re = /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(@\w+)|([A-Za-z_$][\w$]*)|(\d+(?:\.\d+)?)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += escH(src.slice(last, m.index)); last = re.lastIndex;
    const [w, cm, str, dec, id, num] = m;
    if (cm) out += `<span class="cm">${escH(cm)}</span>`;
    else if (str) out += `<span class="s">${escH(str)}</span>`;
    else if (dec) out += `<span class="d">${escH(dec)}</span>`;
    else if (id) out += KW.test(id) ? `<span class="k">${id}</span>` : /^[A-Z]/.test(id) ? `<span class="c">${id}</span>` : id;
    else if (num) out += `<span class="d">${num}</span>`;
    else out += escH(w);
  }
  return out + escH(src.slice(last));
}
// Kod satrlari: meta — {satr raqami (1-dan): {id, at, gone, neu, keep}}
const ts = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: tsLine(l), ...(meta[i + 1] || {}) }));
// Terminal: ERROR qizil, Mapped/started yashil, ogohlantirish sariq
const termCls = (l) => /ERROR|Error|error:|Exception|TS\d{4}/.test(l) ? 'er' : /Mapped|successfully|created successfully|runnig onn/.test(l) ? 'ok' : /Retrying|WARN/.test(l) ? 'wn' : '';
const term = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => { const c = termCls(l); return { h: c ? `<span class="${c}">${escH(l)}</span>` : escH(l), ...(meta[i + 1] || {}) }; });
const plainLines = (src, meta = {}) => src.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n').map((l, i) => ({ h: escH(l), ...(meta[i + 1] || {}) }));

// Ovoz → «Matn» (transkript) uchun yozma ko'rinish: aytiladigan kod nomlari va raqamlar
const SPOKEN = [
  ['localhost uch ming, slesh api v bir', 'localhost:3000/api/v1'], ['localhost uch ming slesh admin', 'localhost:3000/admin'], ['localhost uch ming', 'localhost:3000'],
  ['api v bir slesh admin', '/api/v1/admin'], ['api v bir slesh car', '/api/v1/car'], ['slesh api v bir', '/api/v1'], ['api v bir', '/api/v1'],
  ['slesh admin', '/admin'], ['slesh car', '/car'], ['car slesh bir', '/car/1'],
  ['env example', '.env.example'], ['NODE ENV', 'NODE_ENV'], ['DEV DB URL', 'DEV_DB_URL'], ['PROD DB URL', 'PROD_DB_URL'],
  ['main ts', 'main.ts'], ['app service ts', 'app.service.ts'], ['app module', 'app.module.ts'], ['core index', 'core/index.ts'], ['index ts', 'index.ts'],
  ['Base service', 'BaseService'], ['Base entity', 'BaseEntity'], ['Car entity', 'CarEntity'], ['Car service', 'CarService'], ['Car controller', 'CarController'], ['Car module', 'CarModule'],
  ['car module', 'car.module.ts'], ['car service', 'car.service.ts'], ['car entity', 'car.entity.ts'],
  ['Book service', 'BookService'], ['Book module', 'BookModule'], ['book module', 'book.module.ts'], ['Book entity Repository', 'BookEntityRepository'], ['Book entity', 'BookEntity'],
  ['Car entity Repository', 'CarEntityRepository'], ['Auth guard', 'AuthGuard'], ['Roles guard', 'RolesGuard'], ['Partial type', 'PartialType'], ['ParseUUIDPipe', 'ParseUUIDPipe'],
  ['is available', 'is_available'], ['admin service', 'admin.service.ts'], ['onModuleInit', 'onModuleInit'], ['server runnig onn port', 'server runnig onn port'],
];
DIGITS.unshift(['ikki yuz qirq', '240'], ['bir yuz qirq besh', '145'], ["o'ttiz yettita", '37 ta'], ["o'ttiz olti", '36'], ["yigirma to'rt soat", '24 soat'], ["to'qqizta", '9 ta'], ["o'n-o'n besh", '10–15']);
const wr = (s) => digits(SPOKEN.reduce((acc, [a, b]) => acc.split(a).join(b), s));
// Segment: id · kalit ibora (HTML) · ovoz matni · qo'shimcha (sahna maydonlari)
const sg = (id, key, text, extra = {}) => ({ id, key, text, show: wr(text), ...extra });
// Haqiqiy inglizcha iboralar ovozda [English pronunciation] ichida (M21) — uzunlari oldin
EN_PHRASES.unshift(
  /Super admin created successfully/g, /server runnig onn port/g, /Validation failed, uuid is expected/g, /invalid input syntax for type uuid/g,
  /property color should not exist/g, /property should not exist/g, /price must be a number/g, /password is not strong enough/g,
  /username or password incorect/g, /Admin not fount/g, /error in creating super admin/g, /contains null values/g,
  /violates foreign key constraint/g, /Forbidden resource/g, /Unauthorized/g, /database does not exist/g,
);

// Nest-2 ga xos qo'shimcha CSS (dvigatel CSS'iga tegilmaydi). Izohda backtick yo'q (CLAUDE.md).
const CSS2 = `
.mk-explorer{overflow:auto}
.n2-path{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 2px}
.n2-path span{font:600 11px/1 ${MONO};letter-spacing:.06em;text-transform:uppercase;padding:6px 9px;border-radius:999px;border:1.5px solid var(--c);color:var(--c);background:${T.paper};opacity:.45;transition:opacity .3s,background .3s,color .3s}
.n2-path span.on{opacity:1;background:var(--c);color:#fff}
.n2-path span.done{opacity:1}
.n2-path i{color:${T.ink3};font-style:normal}
.n2-swg{display:grid;gap:6px}
.n2-swg .r{display:flex;align-items:center;gap:10px;padding:7px 10px;border:1px solid ${T.line};border-radius:8px;background:${T.paper};font:12.5px ${MONO};transition:opacity .3s,border-color .3s,box-shadow .3s}
.n2-swg .r.hl{border-color:${T.accent};box-shadow:0 0 0 3px rgba(226,69,31,.12)}
.n2-swg .r.dim{opacity:.45}
.n2-swg .m{font:700 11px/1 ${MONO};padding:4px 7px;border-radius:5px;color:#fff;min-width:54px;text-align:center}
.n2-swg .lk{margin-left:auto;font-size:13px}
.n2-swg .hd{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:4px}
.n2-auth{font:600 12px ${SANS};padding:6px 12px;border:1.5px solid #49CC90;color:#2F9E6E;border-radius:6px;background:#fff;transition:box-shadow .3s}
.n2-auth.hl{box-shadow:0 0 0 4px rgba(73,204,144,.25)}
.n2-json{margin:0;font:12px/1.5 ${MONO};white-space:pre-wrap;word-break:break-word;color:${T.ink2};background:#F6F7F9;border:1px solid ${T.line};border-radius:8px;padding:8px 10px}
.n2-st{font:700 11px/1 ${MONO};padding:3px 7px;border-radius:6px;display:inline-block;justify-self:start}
.n2-st.s2{background:#E3F5EC;color:${T.green}}.n2-st.s4{background:#FFF0EB;color:${T.accent}}.n2-st.s5{background:#FDECEC;color:#B91C1C}
.n2-cmp{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.n2-cmp .mk-card h5{margin-bottom:8px}
.n2-mini .mk-panel{font-size:12px;padding:12px 14px}
.n2-grid2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:1300px){.n2-grid2{grid-template-columns:1fr}}
.n2-table td,.n2-table th{font-size:12.5px}
.n2-warn{border-left:4px solid ${T.accent};background:#FFF0EB;border-radius:10px;padding:10px 12px;font-size:14px;line-height:1.5}
.n2-warn b{color:${T.accent}}
`;
function useCss2() {
  useEffect(() => {
    let s = document.getElementById('mk-css-n2');
    if (!s) { s = document.createElement('style'); s.id = 'mk-css-n2'; document.head.appendChild(s); }
    if (s.textContent !== CSS2) s.textContent = CSS2;
  }, []);
}

// Kichik umumiy sahna bo'laklari (shu dars uchun)
const LAYERS = [['Entity', N2.entity], ['DTO', N2.dto], ['Service', PART.svc], ['Controller', PART.ctrl], ['Module', PART.mod]];
function LayerPath({ at }) {
  return <div className="n2-path">{LAYERS.map(([n, c], i) => <React.Fragment key={n}>{i > 0 && <i>→</i>}<span className={i === at ? 'on' : (i < at ? 'done' : '')} style={{ '--c': c }}>{i < at ? '✓ ' : ''}{n}</span></React.Fragment>)}</div>;
}
const Term = ({ lines, title, er, beat, focus }) => <CodePanel file={title || 'terminal'} numbers={false} wrap style={{ background: er ? N2.termEr : N2.term }} lines={lines} beat={beat} focus={focus} />;
const Json = ({ st, children }) => <div style={{ display: 'grid', gap: 4 }}>{st && <span className={`n2-st s${String(st)[0]}`}>{st}</span>}<pre className="n2-json">{children}</pre></div>;
const METHOD_C = { GET: '#61AFFE', POST: '#49CC90', PATCH: '#50E3C2', DELETE: '#F93E3E' };

// ============================================================
//  1 · Kirish
// ============================================================
const S1 = {
  kicker: 'Kirish', eyebrow: 'Mentor kursi · 4-dars', title: "Siz cars-api'ni qurdingiz. Endi o'quvchi reposi.",
  plan: ['Ishga tushirish', "cars-api'dan farqlar", 'Resurs: 5 qatlam', 'Guard va token', 'Buzamiz', "O'quvchi darslariga ko'prik"],
  segments: [
    sg('a', "Nest-1 da loyihani noldan qurdingiz — o'quvchi esa <b>tayyor loyihani clone qiladi</b>", "Assalomu alaykum. Nest birinchi darsida siz cars api'ni bo'sh papkadan qurdingiz. O'quvchingiz esa noldan yozmaydi: u GitHub'dan tayyor loyihani clone qiladi. Bugun aynan shu loyihani ochamiz, unga bitta resurs qo'shamiz va sinfda chiqadigan xatolarni ko'ramiz.", { hl: [] }),
    sg('b', "Dars oxirida loyiha sizda ishlaydi va unga <b>car resursini o'zingiz qo'shgan</b> bo'lasiz", "Dars oxirida loyiha sizning kompyuteringizda bazasi bilan ishlaydi, unga o'zingiz car resursini qo'shgan bo'lasiz. Resursning beshta qatlamini bir marta, tartib bilan yozamiz.", { hl: [0, 2] }),
    sg('c', "Token va rollarni bilasiz: <b>401 va 403</b> nima uchun chiqishini ajratasiz", "Loyiha himoyasini ham bilasiz: token qayerdan keladi, to'rt yuz bir va to'rt yuz uch nima uchun chiqadi. O'quvchi darsining ikkinchi qismi aynan shunga tayanadi.", { hl: [3] }),
    sg('d', "O'quvchi darslaridagi <b>uchta xatoni</b> oldindan bilasiz — sinfda vaqt yo'qotmaysiz", "Va eng muhimi: o'quvchi darslarida uchta joy bor, ular sinfda albatta muammo beradi. Ularni oldindan bilib olasiz va sinfda vaqt yo'qotmaysiz.", { hl: [4, 5] }),
    sg('e', "Olti bosqich, to'rt amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi", "Dars olti bosqichdan iborat, orasida to'rtta amaliyot bor, ularni o'z kompyuteringizda qilasiz. Shoshilmang: har ekranni boshidan eshitish va matnini o'qish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.", { hl: [] }),
  ],
};
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">{t('Dars oxirida — sizning loyihangizda', 'В конце урока — в вашем проекте')}</div>
      <div className="n2-swg"><div className="r hl"><span className="m" style={{ background: METHOD_C.GET }}>GET</span><span>/api/v1/car</span></div></div>
      <Json st={200}>{`{"statusCode":200,"message":"success","data":[{"brand":"Chevrolet","model":"Malibu","price":250,"is_available":true,…}]}`}</Json>
    </div>
  </div>} />;
}

// ============================================================
//  2 · Loyiha xaritasi va ishga tushirish
// ============================================================
const MAP2 = [F.aMod, F.aCtrl, F.aSvc, F.aCdto, F.appMod, F.appSvc, F.rolesD, F.authG, F.rolesG, F.cfg, F.baseEnt, F.aEnt, F.aRepo, F.coreIdx, F.baseSvc, F.filter, F.okRes, F.main];
const MAP2_DESC = {
  [F.aMod]: 'resurs: Module', [F.aCtrl]: 'resurs: Controller', [F.aSvc]: 'resurs: Service', [F.aCdto]: 'resurs: DTO',
  [F.appMod]: 'bosh modul', [F.appSvc]: 'server shu yerda ishga tushadi', [F.authG]: 'qo\'riqchi', [F.rolesG]: 'qo\'riqchi', [F.rolesD]: 'rol belgisi',
  [F.cfg]: '.env o\'qiladi', [F.aEnt]: 'jadval shakli', [F.baseEnt]: 'umumiy ustunlar', [F.aRepo]: 'Repository tipi',
  [F.baseSvc]: 'tayyor CRUD', [F.filter]: 'xato shakli', [F.okRes]: 'javob shakli',
};
const DIR_OF = { api: 'src/api/', core: 'src/core/', common: 'src/common/', infra: 'src/infrastructure/' };
const ENV_LINES = plainLines(String.raw`
PORT=3000

NODE_ENV=dev

# DB
DEV_DB_URL=postgres://postgres:password@localhost:5432/nestarxitechture
PROD_DB_URL=postgres://postgres:password@localhost:5432/db_prod

# JWT == (openssl rand -base64 32) <= JWT token kaliti yaratib beradi
Access_Token_Key=…
Access_Token_Time=24h

# Superadmin
USER_NAME=superadmin
FULL_NAME=Super Admin
PHONE=+998901234567
PASSWORD=Superadmin1!`, { 6: { id: 'db' }, 13: { id: 'sa' }, 14: { id: 'sa' }, 15: { id: 'sa' }, 16: { id: 'sa' } });
const RUN_TERM = term(String.raw`
$ git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git
Cloning into 'IntroNestArxitechture'...
$ cd IntroNestArxitechture && npm install
added 759 packages, and audited 760 packages in 16s
$ cp .env.example .env
$ createdb -U postgres nestarxitechture
$ npm run start:dev
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized
[Nest] LOG [InstanceLoader] AdminModule dependencies initialized
[Nest] LOG [RoutesResolver] AdminController {/api/v1/admin}:
[Nest] LOG [RouterExplorer] Mapped {/api/v1/admin, POST} route
[Nest] LOG [RouterExplorer] Mapped {/api/v1/admin/signin, POST} route
…  (jami 9 ta Mapped)
Super admin created successfully
[Nest] LOG [NestApplication] Nest application successfully started
server runnig onn port 3000`, { 1: { at: 1 }, 2: { at: 1 }, 3: { at: 1 }, 4: { at: 1 }, 5: { at: 2 }, 6: { at: 3 }, 7: { at: 3 }, 8: { at: 3 }, 9: { at: 3 }, 10: { at: 3 }, 11: { at: 3 }, 12: { at: 3 }, 13: { at: 3 }, 14: { at: 3 }, 15: { at: 3, id: 'sa' }, 16: { at: 3 }, 17: { at: 3, id: 'port' } });
const S2 = {
  kicker: '1-bosqich · ishga tushirish', title: "To'rt papka, to'rt buyruq, bitta fayl",
  segments: [
    sg('a', "Loyiha <code>src</code>da <b>37 fayl</b>, lekin hammasi <b>to'rt papkada</b> — har birining bitta vazifasi", "cars api'da yettita fayl edi, bu loyihaning src papkasida o'ttiz yettita. Qo'rqmang, hammasi to'rt papkada. api'da resurslar: Module, Controller, Service va DTO. core'da bazaning shakli, Entity'lar. common'da umumiy narsalar, Guard va decorator'lar. infrastructure'da poydevor: Base service, xato filtri, token.", { view: 'map' }),
    sg('b', "<code>git clone</code> va <code>npm install</code>: loyiha va paketlar, <b>bir daqiqacha</b>", "Ishga tushirish uchun to'rt buyruq va bitta fayl kerak. Birinchi ikkitasi: git clone loyihani oladi, npm install paketlarni o'rnatadi, bir daqiqacha.", { view: 'run' }),
    sg('c', "<code>.env</code> namunadan olinadi: <b>parol, baza nomi</b> va <b>Superadmin bloki</b> to'ldiriladi", "Keyin fayl: env. Loyihada namuna bor, env example, undan nusxa olinadi va uch joy to'ldiriladi: baza manzilidagi parol, o'zingizning PostgreSQL parolingiz; baza nomi, nestarxitechture; va Superadmin bloki, nom va kuchli parol. Superadmin bo'sh qolsa nima bo'lishini oltinchi ekranda ko'ramiz.", { view: 'run', focus: ['db', 'sa'] }),
    sg('d', "<code>createdb</code> va <code>start:dev</code>: terminalda <b>superadmin yaratildi</b> va to'qqizta <b>Mapped</b>", "Uchinchi buyruq bazani yaratadi, to'rtinchisi serverni ishga tushiradi. Terminalni o'qing: bazaga ulandi, env'dagi superadmin bazaga yozildi, keyin to'qqizta Mapped satri, hammasi api v bir bilan boshlanadi. Oxirgi satr imlo xatosi bilan: server runnig onn port. Bu xato emas, loyihadagi matn shunday.", { view: 'run' }),
    sg('e', "Xulosa: to'rt buyruq va <code>.env</code>dagi uch joy; superadmin satri <b>faqat birinchi safar</b> chiqadi", "Xulosa: to'rt buyruq va env'dagi uch joy. Bir narsani yodda tuting: superadmin yaratilgani haqidagi satr faqat birinchi ishga tushirishda chiqadi. Keyingi safar superadmin bazada bor, satr chiqmaydi, bu normal.", { view: 'run' }),
  ],
};
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg, beat }) => seg.view === 'map'
    ? <FileTree big files={tree(MAP2)} desc={MAP2_DESC} />
    : <Ide files={tree(BASE, [F.envEx, F.env])} active={F.env}>
        <Term lines={RUN_TERM} beat={beat} focus={beat >= 3 ? ['sa', 'port'] : []} />
        {beat === 2 && <CodePanel file=".env" lines={ENV_LINES} focus={seg.focus || []} />}
        <Block at={4} beat={beat}><div className="mk-rule"><b>server runnig onn port 3000</b> — {t("satr aynan shunday, imlo xatosi bilan: kodda shunday yozilgan. O'quvchi «xato chiqdi» desa — bu muvaffaqiyat satri.", 'строка именно такая, с опечаткой: так написано в коде. Если ученик скажет «вышла ошибка» — это строка успешного запуска.')}</div></Block>
      </Ide>} />;
}

// ============================================================
//  3 · Swagger
// ============================================================
const SWG = [
  ['POST', '/api/v1/admin', 1], ['GET', '/api/v1/admin', 1], ['POST', '/api/v1/admin/signin', 0], ['POST', '/api/v1/admin/token', 0], ['POST', '/api/v1/admin/signout', 0],
  ['GET', '/api/v1/admin/all/admin', 1], ['GET', '/api/v1/admin/{id}', 1], ['PATCH', '/api/v1/admin/{id}', 1], ['DELETE', '/api/v1/admin/{id}', 1],
];
function Swagger({ hl = [], authHl, title = 'Azizbek' }) {
  return <div className="mk-light" style={{ padding: 14 }}>
    <div className="n2-swg">
      <div className="hd"><div><b style={{ fontSize: 18 }}>{title}</b> <span className="mk-tag" style={{ display: 'inline', marginLeft: 6 }}>1.0 · /api/v1</span></div><span className={`n2-auth${authHl ? ' hl' : ''}`}>Authorize 🔓</span></div>
      <div className="mk-tag" style={{ margin: '4px 0 2px' }}>admin</div>
      {SWG.map(([m, u, lock], i) => <div key={i} className={`r${hl.includes(i) ? ' hl' : (hl.length ? ' dim' : '')}`}><span className="m" style={{ background: METHOD_C[m] }}>{m}</span><span>{u}</span>{lock ? <span className="lk" title="token">🔒</span> : <span className="lk" style={{ opacity: .25 }}>—</span>}</div>)}
    </div>
  </div>;
}
const S3 = {
  kicker: '1-bosqich · Swagger', title: "Swagger: localhost:3000/api/v1 — loyihaning menyusi",
  segments: [
    sg('a', "Server ishlayapti — brauzerda <code>/api/v1</code>: <b>Swagger</b> sahifasi ochiladi", "Server ishlayapti. Brauzerda localhost uch ming, slesh api v bir ni ochamiz. Bu Swagger, loyihaning menyusi: o'quvchi m4a-01 darsida shu sahifani ko'rgan. Oddiy localhost uch ming ochilsa to'rt yuz to'rt chiqadi, sababini keyingi bosqichda ko'ramiz.", { hl: [] }),
    sg('b', "<code>admin</code> bo'limida <b>9 route</b>: signin, token, signout va olti CRUD route", "admin bo'limida to'qqizta route: kirish uchun signin, token va signout, qolgan oltitasi adminlarni yaratish, ko'rish, o'zgartirish va o'chirish uchun.", { hl: [0, 1, 2, 3, 4, 5, 6, 7, 8] }),
    sg('c', "Qulf — <b>hujjatdagi belgi</b>: <code>token</code> va <code>signout</code>da qulf yo'q, lekin ular ham token so'raydi", "Ba'zi qatorlarda qulf belgisi bor: bu route'ga token kerak, u Authorize tugmasi orqali beriladi. Lekin ehtiyot bo'ling: qulfni dasturchi qo'lda qo'yadi. token va signout'da qulf yo'q, ammo ular ham token so'raydi. Ishonchli manba qulf emas, Guard kodi, uni to'rtinchi bosqichda o'qiymiz.", { hl: [3, 4], auth: true }),
    sg('d', "Xulosa: Swagger'da route, kiruvchi shakl va javob ko'rinadi — <b>o'quvchi uchun asosiy oyna</b>", "Xulosa: Swagger'da hamma route, kiruvchi ma'lumot shakli va javob namunasi bor, Postman kerak emas. Endi o'zingiz shu holatga keling: birinchi amaliyot.", { hl: [] }),
  ],
};
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg, beat }) => <>
    <Browser url="localhost:3000/api/v1" out="Swagger UI" />
    <Swagger hl={seg.hl} authHl={seg.auth} />
    <Block at={2} beat={beat}><div className="n2-warn"><b>{t('Qulf', 'Замок')}</b> {t("— Swagger hujjatidagi belgi (dasturchi qo'yadi). Haqiqiy tekshiruv — Guard: tokensiz", '— значок в документации Swagger (ставит разработчик). Реальная проверка — Guard: без токена')} <code>POST /api/v1/admin/token</code> → <b>401</b>.</div></Block>
  </>} />;
}

// ============================================================
//  4 · Amaliyot 1 — o'zingizda ishga tushiring
// ============================================================
const P1 = {
  kicker: 'Amaliyot 1 / 4', eyebrow: "Hozir o'zingizda · 10–15 daqiqa", title: "O'quvchi reposini o'zingizda ishga tushiring", tableAt: 3,
  segments: [
    sg('a', "Endi siz: loyihani <b>o'zingizda ishga tushirasiz</b> — to'rt qadam", "Endi navbat sizga: loyihani o'z kompyuteringizda ishga tushirasiz. To'rt qadam, o'n-o'n besh daqiqa. Boshlashdan oldin PostgreSQL ishlab turganini tekshiring.", { hl: [] }),
    sg('b', "1–2-qadam: clone, install, <code>.env</code> — <b>Superadmin blokini to'ldirmasdan</b> ishga tushirmang", "Birinchi: clone va npm install. Ikkinchi: env example'dan env yarating va uch joyni to'ldiring. Superadmin blokini to'ldirmasdan serverni ishga tushirmang, keyin tuzatish qiyinroq.", { hl: [0, 1] }),
    sg('c', "3–4-qadam: baza, server, Swagger; isbot — <code>successfully started</code> satri <b>sanasi bilan</b>", "Uchinchi: bazani yarating va serverni ishga tushiring. To'rtinchi: brauzerda Swagger'ni oching. Isbot maydoniga terminaldagi successfully started satrini butunligicha, sanasi bilan nusxalang.", { hl: [2, 3] }),
    sg('d', "Boshqacha chiqsa — pastdagi <b>«Boshqacha chiqdimi?»</b> tugmasi; katakcha va isbotsiz Davom ochilmaydi", "Biror narsa boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing: sinfda ham aynan shu holatlar chiqadi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi.", { hl: [] }),
  ],
};
const P1_STEPS = [
  { t: 'Clone va install', cmds: ['git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git', 'cd IntroNestArxitechture', 'npm install'], exp: 'added … packages' },
  { t: '.env', cmds: ['cp .env.example .env'], exp: "DEV_DB_URL (parol, nestarxitechture) · NODE_ENV=dev · USER_NAME, FULL_NAME, PHONE, PASSWORD (kuchli: Superadmin1! kabi)" },
  { t: 'Baza va server', cmds: ['createdb -U postgres nestarxitechture', 'npm run start:dev'], exp: 'Super admin created successfully · 9 ta Mapped {/api/v1/admin…} · server runnig onn port 3000' },
  { t: 'Swagger', cmds: ['localhost:3000/api/v1'], exp: "admin bo'limi, 9 route" },
];
const P1_TROUBLE = [
  ['Unable to connect + ECONNREFUSED / password authentication failed / does not exist', "Nest-1 dagi baza xatolari: PostgreSQL ishlamayapti · parol noto'g'ri · baza yaratilmagan"],
  ['Unable to connect + getaddrinfo ENOTFOUND base', ".env umuman yo'q — 2-qadam"],
  ["error TS2307: Cannot find module 'class-validator'", 'npm install oxirigacha bormagan — qayta npm install'],
  ['EADDRINUSE: address already in use :::3000', 'Nest-1 dagi cars-api ochiq qolgan — uni yoping'],
  ['Super admin created successfully chiqmadi', 'superadmin bazada bor (ilgari ishga tushirgansiz) — normal; kira olmasangiz 6-ekran'],
];
const P1_PROOF = { label: "Isbot: terminaldagi «Nest application successfully started» satri — sanasi bilan", placeholder: "terminaldagi satrni shu yerga qo'ying", check: (v) => /successfully started/i.test(v) && /\b20\d\d\b/.test(v), wrong: "Satr «successfully started» so'zlari va sanasi (yil) bilan bo'lsin — terminaldan butun satrni nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} />; }

// ============================================================
//  5 · Farqlar: server joyi, prefiks, javob shakli
// ============================================================
const MAIN_LINES = ts(String.raw`
import { Aplication } from './api/app.service';

void Aplication.main();`);
const APPSVC_LINES = ts(String.raw`
export class Aplication {
  static async main(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new AllExceptionFilter());
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    const api: string = 'api/v1';

    app.setGlobalPrefix(api);
    …
    await app.listen(PORT, () => console.log('server runnig onn port', PORT));
  }
}`, { 1: { id: 'cls' }, 2: { id: 'cls' }, 3: { id: 'cls' }, 5: { id: 'set' }, 6: { id: 'set' }, 7: { id: 'set' }, 8: { id: 'set' }, 9: { id: 'set' }, 10: { id: 'set' }, 11: { id: 'set' }, 12: { id: 'set' }, 13: { id: 'set' }, 14: { id: 'pre' }, 16: { id: 'pre' }, 18: { id: 'listen' } });
const S5 = {
  kicker: '2-bosqich · farqlar', title: "Uch farq: server boshqa faylda, manzil /api/v1 bilan, javob bitta shaklda",
  segments: [
    sg('a', "<code>main.ts</code> uch satr — server <b><code>api/app.service.ts</code></b>dagi <code>Aplication.main()</code>da ishga tushadi", "Loyiha ishlayapti. Endi uni cars api bilan solishtiramiz, uchta farq bor. Birinchisi: main ts'da atigi uch satr, u faqat Aplication klassini chaqiradi. Server api papkasidagi app service ts'da ishga tushadi. Nomi Service, lekin bu Service emas, ichida Nest birinchi darsidagi create va listen.", { file: F.appSvc, focus: ['cls', 'listen'] }),
    sg('b', "Ikkinchi farq — <b>global prefiks</b>: har route oldiga <code>api/v1</code> o'zi qo'shiladi", "Ikkinchisi shu faylda: global prefiks, api v bir. Controller'da admin deb yozilgan, lekin manzil api v bir slesh admin. Shuning uchun slesh admin ochilsa to'rt yuz to'rt. To'g'ri manzilda to'rt yuz bir, ya'ni route bor, faqat token kerak.", { file: F.appSvc, focus: ['pre'] }),
    sg('c', "Uchinchi farq — <b>javob shakli</b>: muvaffaqiyat <code>data</code> ichida, xato <code>error.message</code> ichida", "Uchinchisi: javob shakli. cars api'da Nest o'zining standart shaklini qaytarardi. Bu loyihada muvaffaqiyatli javob statusCode, message va data ko'rinishida, xato esa statusCode va error ichida message. Buni ikki fayl qiladi: successRes va global xato filtri.", { file: F.appSvc, focus: ['set'] }),
    sg('d', "Filtr oddiy xatoni <b>500</b> qiladi, sababini <b>terminalga</b> yozadi; <code>Danggg</code> satri — xato emas", "Filtr haqida yana ikki gap. HttpException oilasidan bo'lmagan har qanday xato besh yuz bo'ladi, Internal server error, haqiqiy sababi esa terminalga yoziladi. Terminalda har xatodan oldin Danggg degan so'z chiqadi: bu filtrdagi console log, xato emas.", { file: F.filter, focus: [] }),
    sg('e', "Xulosa: 404 ko'rsangiz — avval <code>/api/v1</code>; 500 ko'rsangiz — <b>terminalni o'qing</b>", "Xulosa: bu loyihada to'rt yuz to'rt ko'rsangiz, avval manzilda api v bir bor-yo'qligini tekshiring. Besh yuz ko'rsangiz, sababni brauzerdan emas, terminaldan qidiring. O'quvchi app service'ni ochib Service qidirsa, server shu yerda yoqiladi deb ayting.", { file: F.appSvc, focus: [] }),
  ],
};
const FILTER_LINES = ts(String.raw`
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage = 'Internal server error';
    console.log(exception);
    if (exception instanceof HttpException) {
      console.log('Danggg', exception.getResponse());
      …
    }
    res.status(status).json({ statusCode: status, error: { message: errorMessage } });
  }
}`, { 4: { id: 'st' }, 5: { id: 'st' }, 6: { id: 'st' }, 7: { id: 'st' }, 9: { id: 'st' }, 10: { id: 'log' }, 12: { id: 'log' }, 15: { id: 'out' } });
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg, beat }) => <Ide files={tree(BASE, [F.filter, F.okRes])} active={beat === 0 ? F.main : seg.file}>
    {beat === 0 && <CodePanel file={F.main} lines={MAIN_LINES} />}
    {seg.file === F.filter
      ? <CodePanel file={F.filter} lines={FILTER_LINES} focus={['st', 'log']} />
      : <CodePanel file={F.appSvc} lines={APPSVC_LINES} focus={seg.focus} />}
    <Block at={1} beat={beat}><div className="n2-grid2">
      <Browser url="localhost:3000/admin" out="404" er /><Browser url="localhost:3000/api/v1/admin" out="401" />
    </div></Block>
    <Block at={2} beat={beat}><div className="n2-grid2">
      <Json st={200}>{`{"statusCode":200,"message":"success","data":[…]}`}</Json>
      <Json st={404}>{`{"statusCode":404,"error":{"message":"Cannot GET /admin"}}`}</Json>
    </div></Block>
  </Ide>} />;
}

// ============================================================
//  6 · Farqlar: .env, config va ikki tuzoq
// ============================================================
const CFG_LINES = ts(String.raw`
dot.config();

export const config = {
  PORT: Number(process.env.PORT),

  DB: {
    url:
      String(process.env.NODE_ENV) === 'dev'
        ? String(process.env.DEV_DB_URL)
        : String(process.env.PROD_DB_URL),
    sync: String(process.env.NODE_ENV) === 'dev' ? true : false,
  },

  Token: {
    access_token_key: String(process.env.Access_Token_Key) || 'secret',
    …
  },

  SuperAdmin: {
    username: String(process.env.USER_NAME),
    password: String(process.env.PASSWORD),
    …
  },
};`, { 1: { id: 'dot' }, 6: { id: 'db' }, 7: { id: 'db' }, 8: { id: 'db' }, 9: { id: 'db' }, 10: { id: 'db' }, 11: { id: 'db' }, 12: { id: 'db' }, 19: { id: 'sa' }, 20: { id: 'sa' }, 21: { id: 'sa' }, 22: { id: 'sa' }, 23: { id: 'sa' } });
const NODEENV_TERM = term(String.raw`
# NODE_ENV=prod, prod bazasi yo'q
[Nest] ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...
error: database "nest2_prod" does not exist          ← o'quvchida nomi db_prod
…  (9 marta qayta urinadi, keyin yiqiladi)
# NODE_ENV=prod, baza bor, lekin bo'sh (jadval yaratilmaydi)
InternalServerErrorException: error in creating super admin`);
const BLANK_SA = plainLines(String.raw`
$ psql -d nestarxitechture -c "select username, role from admins"
 username |    role
----------+------------
 ali      | admin
          | superAdmin          ← nomsiz superadmin
# .env to'ldirildi, server qayta yoqildi: «Super admin created» — 0 marta
POST /api/v1/admin/signin  {"username":"superadmin","password":"Superadmin1!"}
{"statusCode":401,"error":{"message":"Admin not fount"}}`, { 5: { id: 'blank' }, 8: { id: 'res' } });
const S6 = {
  kicker: '2-bosqich · farqlar', title: "To'rtinchi farq: hamma sozlama .env'dan — va ikki jim tuzoq",
  segments: [
    sg('a', "<code>config/index.ts</code> <code>.env</code>ni o'qiydi: <b>port, baza, token kaliti, superadmin</b>", "Ikkinchi ekranda env'ni to'ldirdik. Endi uni kim o'qishini ko'ramiz: config papkasidagi index ts. U env'dan port, baza manzili, token kaliti va superadmin ma'lumotlarini oladi. Loyihaning qolgan qismi env'ga emas, shu config'ga murojaat qiladi.", { focus: ['dot'] }),
    sg('b', "<code>NODE_ENV=dev</code> → dev bazasi va <b>jadvallar o'zi yaratiladi</b>; boshqa qiymat → prod bazasi", "Eng muhim qator: NODE ENV dev bo'lsa, dev baza manzili olinadi va synchronize yoqiladi, ya'ni TypeORM jadvallarni o'zi yaratadi. Boshqa har qanday qiymatda prod manzili olinadi va jadvallar yaratilmaydi.", { focus: ['db'] }),
    sg('c', "<code>NODE_ENV</code> noto'g'ri: <b>does not exist</b> yoki <b>error in creating super admin</b> — sabab yashirin", "Sinab ko'rdik: NODE ENV prod bo'lsa va prod bazasi yo'q bo'lsa, server database does not exist deb yiqiladi. Prod bazasi bor, lekin bo'sh bo'lsa, xabar boshqa: error in creating super admin. Haqiqiy sabab, jadval yo'qligi, kod ichida yashirin. Ikkala holatda javob bitta: NODE ENV dev.", { focus: ['db'] }),
    sg('d', "Jim tuzoq: superadmin bo'sh qolsa — bazada <b>nomsiz superadmin</b>; <code>.env</code>ni keyin to'ldirish yordam bermaydi", "Ikkinchi tuzoq jimroq. Superadmin bloki bo'sh qolsa, server xatosiz ishga tushadi va bazaga nomsiz superadmin yozadi. Keyin env to'ldirilsa ham yangisi yaratilmaydi: server superadmin bor deb hisoblaydi. Sinab ko'rdik: env'dagi nom bilan kirilsa to'rt yuz bir, Admin not fount.", { focus: ['sa'] }),
    sg('e', "Xulosa: o'quvchi kira olmasa — <b>bo'sh superadmin satrini o'chirib</b>, serverni qayta yoqing", "Xulosa: env'da NODE ENV dev bo'lsin va superadmin bloki to'liq bo'lsin. O'quvchi to'g'ri nom bilan kira olmasa va bazada nomsiz superadmin bo'lsa, o'sha satrni o'chiring va serverni qayta ishga tushiring. Sinab ko'rdik: superadmin env'dan yangidan yoziladi va signin ishlaydi.", { focus: [] }),
  ],
};
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg, beat }) => <Ide files={tree(BASE, [F.cfg, F.env])} active={F.cfg}>
    <CodePanel file={F.cfg} lines={CFG_LINES} focus={seg.focus} />
    {beat === 2 && <Term er lines={NODEENV_TERM} />}
    {beat >= 3 && <Term lines={BLANK_SA} focus={beat === 3 ? ['blank', 'res'] : []} />}
    <Block at={4} beat={beat}><div className="mk-rule"><b>{t('Yechim:', 'Решение:')}</b> <code>psql -U postgres -d nestarxitechture -c "DELETE FROM admins WHERE role='superAdmin';"</code> → <code>npm run start:dev</code> → <code>Super admin created successfully</code> → signin <b>201</b></div></Block>
  </Ide>} />;
}

// ============================================================
//  7 · Tekshiruv 1 — «/admin ochdim, 404»
// ============================================================
function Screen7(p) {
  return <MCRetry {...p} kicker={t('Tekshiruv 1', 'Проверка 1')} eyebrow={t('Tekshiruv · 1 / 4', 'Проверка · 1 / 4')}
    title={t("O'quvchi: «Brauzerda localhost:3000/admin ochdim — 404». Birinchi nimani tekshirasiz?", 'Ученик: «Открыл в браузере localhost:3000/admin — 404». Что проверите первым?')}
    q={t("Farqlarni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. O'quvchi aytadi: brauzerda localhost uch ming slesh admin ochdim, to'rt yuz to'rt. Server ishlayapti, terminalda xato yo'q. Birinchi nimani tekshirasiz? Variantni tanlang.", 'Вы видели отличия, давайте проверим. Первая проверка. Ученик говорит: открыл в браузере localhost 3000 admin, получил 404. Сервер работает, в терминале ошибок нет. Что вы проверите первым? Выберите вариант.')}
    opts={t(['app.module.ts — AdminModule imports\'da bormi', 'Manzil — prefiks /api/v1 tushib qolgan', '.env — PostgreSQL paroli to\'g\'rimi', 'Swagger — Authorize bosilganmi'], ['app.module.ts — есть ли AdminModule в imports', 'Адрес — пропущен префикс /api/v1', '.env — верный ли пароль PostgreSQL', 'Swagger — нажата ли Authorize'])} correct={1}
    ok={t("Manzil. Bu loyihada hamma route api v bir bilan boshlanadi. Slesh admin degan route yo'q, shuning uchun to'rt yuz to'rt va Cannot GET slesh admin. Terminalda Mapped satrlari api v bir slesh admin deb turibdi. To'g'ri manzilda to'rt yuz bir chiqadi, bu token masalasi.", 'Адрес. В этом проекте все routes начинаются с api v1. Route просто admin нет, поэтому 404 и Cannot GET admin. В терминале строки Mapped показывают api v1 admin. По правильному адресу будет 401, а это уже вопрос токена.')}
    okShort={t("Prefiks: /api/v1/admin. Terminalda Mapped {/api/v1/admin…} — route bor, manzil noto'g'ri.", 'Префикс: /api/v1/admin. В терминале Mapped {/api/v1/admin…} — route есть, адрес неверный.')}
    wrong={t({ 0: "Modul ulanmagan bo'lsa admin uchun Mapped satri bo'lmasdi; u bor.", 2: "Parol noto'g'ri bo'lsa server ishga tushmasdi: Unable to connect.", 3: "Token yo'q bo'lsa javob 401 bo'ladi, 404 emas." }, { 0: 'Если бы модуль не был подключён, строки Mapped для admin не было бы; а она есть.', 2: 'При неверном пароле сервер бы не запустился: Unable to connect.', 3: 'Без токена ответ был бы 401, а не 404.' })} />;
}
