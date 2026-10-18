// ===== F-1015-353: 23 → 9 ekran. KitobShop: Copilot Chat «Agent» rejimi — playbook (Category, Book, Order) → tekshiruv → @Roles → eshik sinovi =====
const QadamTugma = ({ b }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <div className={`am-karta am-qt ${ochiq ? 'on' : ''}`}>
      <button type="button" className="am-qt-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>
        <span>{tr({ uz: 'Qadamlar', ru: 'Шаги' })} · {b.length}</span><span className="am-qt-ic" aria-hidden="true">▾</span>
      </button>
      {ochiq && <ol className="am-qadam am-ochil">{b.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>}
    </div>
  );
};
const TAYYOR = [
  { uz: "O'tgan darsdagi Nest loyihasini (IntroNestArxitechture) VS Code'da oching, terminalda `npm run start:dev` — Swagger localhost:3000/api da ochiladimi?", ru: 'Откройте в VS Code Nest-проект с прошлого урока (IntroNestArxitechture), в терминале `npm run start:dev` — Swagger открывается на localhost:3000/api?' },
  { uz: "Copilot Chat'ni oching (`Ctrl+Alt+I`) va chat ostidagi ro'yxatdan «Agent» rejimini tanlang.", ru: 'Откройте Copilot Chat (`Ctrl+Alt+I`) и в списке под чатом выберите режим «Agent».' },
  { uz: "PostgreSQL ishlab turganini tekshiring (loyihaning `.env` faylidagi baza).", ru: 'Проверьте, что PostgreSQL работает (база из файла `.env` проекта).' }
];
const TayyorTugma = () => {
  const [ochiq, setOchiq] = useState(false);
  const [korgan, setKorgan] = useState(false);
  return (
    <div className="fade-up delay-1"><div className={`am-tayyor am-tt ${ochiq ? 'on' : ''} ${korgan ? '' : 'am-tt-nafas'}`}>
      <button type="button" className="am-tt-btn" aria-expanded={ochiq} onClick={() => { setOchiq(o => !o); setKorgan(true); }}>
        <span className="am-tayyor-h">{tr({ uz: 'Avval tayyorlaning', ru: 'Сначала подготовьтесь' })} · {tr({ uz: `${TAYYOR.length} qadam`, ru: `${TAYYOR.length} шага` })}</span>
        <span className="am-qt-ic" aria-hidden="true">▾</span>
      </button>
      {ochiq && <div className="am-tt-ich am-ochil">
        <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
        <p className="am-tayyor-s">{tr({ uz: "Tayyor bo'lsa — «Boshlaymiz».", ru: 'Готово — «Начинаем».' })}</p>
      </div>}
    </div></div>
  );
};
const KodNusxa = ({ yorliq, kod }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(kod); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return (
    <div className="am-karta">
      <div className="am-prompt-h"><p className="flow-label">{tr(yorliq)}</p><button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></div>
      <pre className="am-masalan">{kod}</pre>
    </div>
  );
};
const BLOK4 = [
  { t: { uz: 'Aniq buyruq — Category', ru: 'Точная команда — Category' }, tag: { uz: 'siz', ru: 'Вы' } },
  { t: { uz: '3 resurs — playbook', ru: '3 ресурса — playbook' }, tag: 'Copilot Agent' },
  { t: { uz: 'Eshiklar: ochiq yoki admin', ru: 'Двери: открыто или админ' }, tag: '@Roles' },
  { t: { uz: 'Eshik sinovi — xatoni topish', ru: 'Проверка дверей — поиск ошибки' }, tag: { uz: 'siz', ru: 'Вы' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz', ru: 'Начинаем' }} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun KitobShop'ni <span className="italic" style={{ color: T.accent }}>agent</span> bilan qurasiz.</>, ru: <>Сегодня строите KitobShop вместе с <span className="italic" style={{ color: T.accent }}>агентом</span>.</> })}</h2></div>
      <Mentor>{tr({ uz: <>O'tgan darsda mashinalar resursini qo'lda qo'shdingiz — 5 fayl va AppModule. Bugun xuddi shu ishni <b style={{ color: T.ink }}>Copilot agenti</b> qiladi: u bir nechta faylni o'zi yozadi. Sizning ishingiz — aniq buyruq berish va natijani tekshirish.</>, ru: <>На прошлом уроке Вы вручную добавили ресурс машин — 5 файлов и AppModule. Сегодня ту же работу делает <b style={{ color: T.ink }}>агент Copilot</b>: он сам пишет несколько файлов. Ваша работа — дать точную команду и проверить результат.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Dars oxirida · KitobShop API', ru: 'К концу урока · KitobShop API' })}</p>
          <ShopSwagger openId={null} onToggle={() => {}} triedIds={new Set(SHOP_EPS.map(e => e.m + e.path))} onTry={() => {}} />
        </Col>
        <Col>
          <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: 'Dars oxirida · KitobShop API', ru: 'К концу урока · KitobShop API' })}</p>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: '3 resurs', ru: '3 ресурса' })}</p>
            <ul className="cr-jadval">
              <li><code className="qcode">Category</code><span>{tr({ uz: 'kitob turlari', ru: 'жанры книг' })}</span></li>
              <li><code className="qcode">Book</code><span>{tr({ uz: '@ManyToOne → Category', ru: '@ManyToOne → Category' })}</span></li>
              <li><code className="qcode">Order</code><span>{tr({ uz: '@ManyToOne → Book', ru: '@ManyToOne → Book' })}</span></li>
            </ul>
            <hr className="am-chiziq" />
            <p className="flow-label">{tr({ uz: `Bugungi ${BLOK4.length} blok`, ru: `${BLOK4.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{BLOK4.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== a2 — Copilot Chat «Agent» rejimi: 3 ta playbook, tekshiruv ro'yxati, Swagger'da sinash =====
const PLAYBOOK = [
  { id: 'cat', nom: 'Category', uz: "Category resursini qo'sh: Entity (name) → Create/Update DTO (@IsString) → BaseService'dan CategoryService → CRUD controller → CategoryModule va AppModule'ga ula. POST, PATCH, DELETE — @Roles('admin'); GET — ochiq.", ru: "Добавь ресурс Category: Entity (name) → Create/Update DTO (@IsString) → CategoryService от BaseService → CRUD controller → CategoryModule и подключи в AppModule. POST, PATCH, DELETE — @Roles('admin'); GET — открыто." },
  { id: 'book', nom: 'Book', uz: "Book resursini qo'sh: Entity (title, author, price, is_featured — boolean, default false) va Category bilan @ManyToOne (ko'p kitob → bitta kategoriya) → Create/Update DTO (@IsString, @IsNumber, categoryId) → BaseService'dan BookService → CRUD controller + GET /book/featured (faqat is_featured: true) → BookModule va AppModule'ga ula. POST, PATCH, DELETE — @Roles('admin'); GET — ochiq.", ru: "Добавь ресурс Book: Entity (title, author, price, is_featured — boolean, default false) и @ManyToOne с Category (много книг → одна категория) → Create/Update DTO (@IsString, @IsNumber, categoryId) → BookService от BaseService → CRUD controller + GET /book/featured (только is_featured: true) → BookModule и подключи в AppModule. POST, PATCH, DELETE — @Roles('admin'); GET — открыто." },
  { id: 'order', nom: 'Order', uz: "Order resursini qo'sh: Entity (customer_name, quantity) va Book bilan @ManyToOne (har buyurtma — bitta kitob) → Create DTO (@IsString, @IsInt, bookId) → BaseService'dan OrderService → controller: POST /order — ochiq (mijoz), GET /order — @Roles('admin') → OrderModule va AppModule'ga ula.", ru: "Добавь ресурс Order: Entity (customer_name, quantity) и @ManyToOne с Book (каждый заказ — одна книга) → Create DTO (@IsString, @IsInt, bookId) → OrderService от BaseService → controller: POST /order — открыто (клиент), GET /order — @Roles('admin') → OrderModule и подключи в AppModule." }
];
const AGENT_QADAM = [
  { uz: "Playbookni nusxalang va Copilot Chat'ga («Agent» rejimida) qo'ying, Enter.", ru: 'Скопируйте playbook и вставьте в Copilot Chat (режим «Agent»), Enter.' },
  { uz: "Agent qaysi fayllarni yaratganini va o'zgartirganini ro'yxatdan ko'ring — har birini oching va o'qing.", ru: 'Посмотрите в списке, какие файлы агент создал и изменил, — откройте и прочитайте каждый.' },
  { uz: "Tekshiruv ro'yxatidan o'tsa — «Keep» (saqlash); noto'g'ri bo'lsa — «Undo» va buyruqni aniqlashtiring.", ru: 'Если проходит список проверки — «Keep» (сохранить); если неверно — «Undo» и уточните команду.' },
  { uz: "`npm run start:dev` — Swagger'da yangi eshiklarni «Try it out» bilan sinang. Keyingi resursga o'ting.", ru: '`npm run start:dev` — испытайте новые двери в Swagger через «Try it out». Переходите к следующему ресурсу.' }
];
const TEKSHIRUV = [
  { uz: "5 fayl bor: entity, dto, service, controller, module", ru: 'Есть 5 файлов: entity, dto, service, controller, module' },
  { uz: "Modul AppModule'ning imports ro'yxatiga yozilgan (usiz — 404)", ru: 'Модуль вписан в imports в AppModule (без него — 404)' },
  { uz: "Service BaseService'dan meros oladi — CRUD qayta yozilmagan", ru: 'Service наследует BaseService — CRUD не переписан заново' },
  { uz: "@Roles('admin') faqat kerakli eshiklarda (POST/PATCH/DELETE)", ru: "@Roles('admin') только на нужных дверях (POST/PATCH/DELETE)" }
];
const ScreenAgent = ({ screen, onNext, onPrev }) => {
  const [res, setRes] = useState('cat');
  const [belgi, setBelgi] = useState(() => new Set());
  const [openId, setOpenId] = useState(null);
  const [tried, setTried] = useState(() => new Set());
  const pb = PLAYBOOK.find(x => x.id === res);
  const tog = (i) => setBelgi(b => { const n = new Set(b); const k = res + i; if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const tayyor = PLAYBOOK.filter(x => TEKSHIRUV.every((_, i) => belgi.has(x.id + i))).length;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · Copilot Agent', ru: 'Практика 2 · Copilot Agent' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>3 resursni <span className="italic" style={{ color: T.accent }}>agentga</span> qurdiring.</>, ru: <>Пусть <span className="italic" style={{ color: T.accent }}>агент</span> построит 3 ресурса.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har resurs — bitta playbook: Entity → DTO → Service → Controller → Module va AppModule. Agent aynan aytganingizni yozadi, shuning uchun har natijani tekshiruv ro'yxati bilan solishtiring va faqat keyin «Keep» bosing.</>, ru: <>Каждый ресурс — один playbook: Entity → DTO → Service → Controller → Module и AppModule. Агент пишет ровно то, что Вы сказали, поэтому сверяйте каждый результат со списком проверки и только потом жмите «Keep».</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-chips">{PLAYBOOK.map(x => <button key={x.id} type="button" className={`am-chip ${res === x.id ? 'on' : ''}`} aria-pressed={res === x.id} onClick={() => setRes(x.id)}>{TEKSHIRUV.every((_, i) => belgi.has(x.id + i)) ? '✓ ' : ''}{x.nom}</button>)}</div>
            <KodNusxa yorliq={{ uz: `Playbook · ${pb.nom}`, ru: `Playbook · ${pb.nom}` }} kod={tr(pb)} />
            <div className="am-karta">
              <p className="flow-label">{tr({ uz: `Tekshiruv · ${pb.nom}`, ru: `Проверка · ${pb.nom}` })}</p>
              <div className="ag-tek">{TEKSHIRUV.map((t, i) => <label key={i} className="ag-tek-q"><input type="checkbox" checked={belgi.has(res + i)} onChange={() => tog(i)} /><span>{tr(t)}</span></label>)}</div>
              <p className="ql-xabar info" role="status">{tr({ uz: `Tekshirilgan resurslar: ${tayyor} / 3`, ru: `Проверено ресурсов: ${tayyor} / 3` })}</p>
            </div>
          </Col>
          <Col>
            <QadamTugma b={AGENT_QADAM} />
            <p className="flow-label">{tr({ uz: "Swagger · sinab ko'ring", ru: 'Swagger · попробуйте' })}</p>
            <ShopSwagger openId={openId} onToggle={(id) => setOpenId(o => (o === id ? null : id))} triedIds={tried} onTry={(id) => setTried(t => new Set([...t, id]))} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
