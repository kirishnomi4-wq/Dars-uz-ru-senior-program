const PromptBlok = ({ matn }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return (
    <div className="am-karta fade-up delay-2">
      <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Prompt', ru: 'Промпт' })}</p><button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Promptni nusxalash', ru: 'Скопировать промпт' })}</button></div>
      <pre className="am-masalan">{matn}</pre>
    </div>
  );
};
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
  { uz: "VS Code'da `robo-games` papkasini oching, terminalda `npm run dev` — localhost:5173 ochiladimi?", ru: 'Откройте в VS Code папку `robo-games`, в терминале `npm run dev` — localhost:5173 открывается?' },
  { uz: "Ikkinchi terminalda: `npm install react-router-dom`.", ru: 'Во втором терминале: `npm install react-router-dom`.' },
  { uz: "Boshqa oynada gemini.google.com'ni oching.", ru: 'В другом окне откройте gemini.google.com.' }
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
// Kod oynasi: oxirgi amal (setGames…) va ro'yxatning hozirgi holati
const KodOyna = ({ oxirgi, qatorlar }) => (
  <div className="rj-oyna">
    <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">App.jsx · {tr({ uz: 'qiymatlar hozir', ru: 'значения сейчас' })}</span></div>
    <div className="rj-body">
      <div className="sk-izoh">// {tr({ uz: 'oxirgi amal', ru: 'последнее действие' })}</div>
      <div key={oxirgi} className="rj-li sk-nur">{oxirgi || '—'}</div>
      <div className="sk-izoh">// {tr({ uz: 'hozir', ru: 'сейчас' })}</div>
      {qatorlar.map((q, i) => <div key={i} className="rj-li">{q}</div>)}
    </div>
  </div>
);
// Router kodi: hozirgi URL va unga mos kelgan <Route>
const RouteQator = ({ r, mos }) => (
  <div className={`rj-li ${mos ? 'sk-mos' : ''}`}>{`<Route path="${r.path}" element={<${r.comp} />} />`}{mos && <span className="sk-izoh">  // {tr({ uz: 'mos keldi', ru: 'совпал' })}</span>}</div>
);
const urlOf = (path, id) => (path === '/game/:id' ? `/game/${id}` : path);
const IlovaOyna = ({ path, id, onGo, children }) => (
  <Win title="robo-games — localhost:5173" minH={150}>
    <UrlBar path={urlOf(path, id)} />
    <NavMenu active={path} onGo={onGo} />
    <div style={{ marginTop: 10 }}>{children}</div>
  </Win>
);
// Reja ekranidagi namuna: menyu, kartochka → o'yin sahifasi
const RouterNamuna = () => {
  const [path, setPath] = useState('/');
  const [id, setId] = useState(1);
  return <IlovaOyna path={path} id={id} onGo={setPath}><PageView path={path} gameId={id} onOpen={(g) => { setId(g); setPath('/game/:id'); }} /></IlovaOyna>;
};
const BLOK3 = [
  { t: { uz: "Sahifalar ro'yxati", ru: 'Список страниц' }, tag: { uz: "o'zingiz · VS Code", ru: 'сами · VS Code' } },
  { t: { uz: "O'yin sahifasi va qo'shish", ru: 'Страница игры и добавление' }, tag: 'Gemini' },
  { t: { uz: 'AI xatosini topish', ru: 'Поиск ошибки AI' }, tag: { uz: 'siz', ru: 'Вы' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>robo-games <span className="italic" style={{ color: T.accent }}>3 sahifali</span> bo'ladi.</>, ru: <>В robo-games будет <span className="italic" style={{ color: T.accent }}>3 страницы</span>.</> })}</h2></div>
      <Mentor>{tr({ uz: <>Bugun ilovangizga <b style={{ color: T.ink }}>Bosh, O'yin va Qo'shish</b> sahifalari qo'shiladi va ular orasida ekran oqarmasdan yuriladi. Sahifalar ro'yxatini o'zingiz yozasiz, o'yin sahifasi va formani Gemini bilan qurasiz.</>, ru: <>Сегодня в приложении появятся страницы <b style={{ color: T.ink }}>Главная, Игра и Добавить</b>, и между ними можно ходить без белого экрана. Список страниц напишете сами, страницу игры и форму построите с Gemini.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: "Dars oxirida · bosib ko'ring", ru: 'К концу урока · попробуйте' })}</p>
          <RouterNamuna />
        </Col>
        <Col>
          <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: "Dars oxirida · bosib ko'ring", ru: 'К концу урока · попробуйте' })}</p>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: 'Manzil → sahifa', ru: 'Адрес → страница' })}</p>
            <ul className="cr-jadval">{ROUTES.map(r => <li key={r.path}><code className="qcode">{r.path}</code><span>{tr(r.page)}</span><code className="qcode">{`<${r.comp} />`}</code></li>)}</ul>
            <hr className="am-chiziq" />
            <p className="flow-label">{tr({ uz: `Bugungi ${BLOK3.length} blok`, ru: `${BLOK3.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{BLOK3.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== a1 — sahifalar ro'yxati (AI'siz): BrowserRouter + Routes + Link; kod oynasi mos kelgan Route'ni ko'rsatadi =====
const A1_QADAM = [
  { uz: "`main.jsx` da `<App />` ni `<BrowserRouter>` ichiga oling (import — `react-router-dom` dan).", ru: 'В `main.jsx` оберните `<App />` в `<BrowserRouter>` (import — из `react-router-dom`).' },
  { uz: "`src/pages` papkasida `Home.jsx`, `GamePage.jsx`, `AddPage.jsx` — hozircha har birida bitta sarlavha.", ru: 'В папке `src/pages` создайте `Home.jsx`, `GamePage.jsx`, `AddPage.jsx` — пока в каждом один заголовок.' },
  { uz: "`App.jsx` da `<Routes>` ichiga 3 ta `<Route>`: `/` → Home, `/game/:id` → GamePage, `/add` → AddPage.", ru: 'В `App.jsx` внутри `<Routes>` — 3 `<Route>`: `/` → Home, `/game/:id` → GamePage, `/add` → AddPage.' },
  { uz: "Tepaga menyu: `<Link to=\"/\">` va `<Link to=\"/add\">` — `<a>` emas.", ru: 'Наверху меню: `<Link to="/">` и `<Link to="/add">` — не `<a>`.' },
  { uz: "Saqlang — menyuni bosing: manzil o'zgaradimi, ekran oqarmaydimi?", ru: 'Сохраните — нажмите меню: адрес меняется, экран не белеет?' }
];
const A1_KOD = `// main.jsx
import { BrowserRouter } from 'react-router-dom';
<BrowserRouter><App /></BrowserRouter>

// App.jsx
import { Routes, Route, Link } from 'react-router-dom';
<nav>
  <Link to="/">Bosh</Link> <Link to="/add">Qo'shish</Link>
</nav>
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/game/:id" element={<GamePage />} />
  <Route path="/add" element={<AddPage />} />
</Routes>`;
const ScreenRoutes = ({ screen, onNext, onPrev }) => {
  const [path, setPath] = useState('/');
  const [id, setId] = useState(1);
  const [oxirgi, setOxirgi] = useState('');
  const go = (p) => { setPath(p); setOxirgi(`<Link to="${urlOf(p, id)}">`); };
  const open = (g) => { setId(g); setPath('/game/:id'); setOxirgi(`<Link to="/game/${g}">`); };
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot 1 · AI'siz", ru: 'Практика 1 · без AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sahifalar <span className="italic" style={{ color: T.accent }}>ro'yxatini</span> yozing.</>, ru: <>Напишите <span className="italic" style={{ color: T.accent }}>список</span> страниц.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har <span className="mono">{'<Route>'}</span> — bitta qator: manzil (<span className="mono">path</span>) va sahifa (<span className="mono">element</span>). Menyu va kartochkalarni bosing: kod oynasida qaysi qator mos kelganini ko'rasiz. Keyin VS Code'da o'zingiz yozasiz.</>, ru: <>Каждый <span className="mono">{'<Route>'}</span> — одна строка: адрес (<span className="mono">path</span>) и страница (<span className="mono">element</span>). Нажимайте меню и карточки: в окне кода видно, какая строка совпала. Потом напишете сами в VS Code.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Ilova · bosib ko'ring", ru: 'Приложение · попробуйте' })}</p>
            <IlovaOyna path={path} id={id} onGo={go}><PageView path={path} gameId={id} onOpen={open} /></IlovaOyna>
            <KodOyna oxirgi={oxirgi} qatorlar={[<span key="u">URL = "{urlOf(path, id)}";</span>, ...ROUTES.map(r => <RouteQator key={r.path} r={r} mos={r.path === path} />), ...(path === '/game/:id' ? [<span key="p">useParams();  <span className="sk-izoh">{`// { id: "${id}" }`}</span></span>] : [])]} />
          </Col>
          <Col>
            <div className="am-karta">
              <p className="flow-label">{tr({ uz: "VS Code'da · robo-games", ru: 'В VS Code · robo-games' })}</p>
              <ol className="am-qadam">{A1_QADAM.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
            </div>
            <details className="am-yordam"><summary>{tr({ uz: "Qotib qoldingizmi? Kodni ko'rish", ru: 'Застряли? Посмотреть код' })}</summary><pre className="am-masalan">{A1_KOD}</pre></details>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a2 — Gemini: GamePage (useParams + find) va AddPage (forma + useNavigate) =====
const A2_QADAM = [
  { uz: "Chapdagi ilovada kartochkani oching va «Qo'shish»da o'yin saqlang — kod oynasida useParams va navigate'ni ko'ring.", ru: 'В приложении слева откройте карточку и сохраните игру в «Добавить» — в окне кода видно useParams и navigate.' },
  { uz: "«Promptni nusxalash» → gemini.google.com'ga qo'ying, oxiriga `main.jsx`, `App.jsx` va sahifalar kodini qo'shing va yuboring.", ru: '«Скопировать промпт» → вставьте в gemini.google.com, в конце добавьте код `main.jsx`, `App.jsx` и страниц и отправьте.' },
  { uz: "Javobdagi fayllarni almashtiring, `Ctrl+S`.", ru: 'Замените файлы на файлы из ответа, `Ctrl+S`.' },
  { uz: "«Tekshiring» ro'yxatini brauzerda o'ting.", ru: 'Пройдите список «Проверьте» в браузере.' }
];
const A2_TEKSHIR = [
  { uz: "Kartochka bosilsa manzil `/game/3` bo'ladimi, o'sha o'yin chiqadimi?", ru: 'При нажатии на карточку адрес становится `/game/3`, открывается эта игра?' },
  { uz: "Manzilga `/game/99` yozing — «O'yin topilmadi» chiqadimi?", ru: 'Впишите адрес `/game/99` — появляется «Игра не найдена»?' },
  { uz: "«Saqlash»dan keyin Bosh sahifada yangi o'yin turibdimi?", ru: 'После «Сохранить» новая игра есть на Главной?' },
  { uz: "Kodda `<a href>` yo'qmi — hammasi `<Link>`mi?", ru: 'В коде нет `<a href>` — везде `<Link>`?' }
];
const a2Prompt = () => tr({
  uz: "React loyihamda (robo-games) react-router-dom bor, App.jsx da 3 ta Route: /, /game/:id, /add. Ikki sahifani to'ldir:\n1. GamePage: useParams() bilan id'ni olsin va games ro'yxatidan shu o'yinni find bilan topib, nomi va tavsifini ko'rsatsin. Topilmasa «O'yin topilmadi» deb yozsin.\n2. Bosh sahifadagi har kartochka <Link to={`/game/${g.id}`}> bilan o'sha sahifaga olib borsin.\n3. AddPage: o'yin nomi kiritiladigan forma. «Saqlash» bosilganda o'yin setGames([...games, yangi]) bilan qo'shilsin va useNavigate() bilan Bosh sahifaga qaytsin.\ngames state App.jsx da qolsin, sahifalarga props bilan uzatilsin. <a href> ishlatma — faqat <Link>.\nHar bo'limga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.\nMana kodim:\n{main.jsx, App.jsx va sahifalar kodini shu yerga qo'ying}",
  ru: "В моём React-проекте (robo-games) есть react-router-dom, в App.jsx 3 Route: /, /game/:id, /add. Заполни две страницы:\n1. GamePage: берёт id через useParams() и находит эту игру в списке games через find, показывает название и описание. Если не нашлась — пишет «Игра не найдена».\n2. Каждая карточка на Главной ведёт на свою страницу через <Link to={`/game/${g.id}`}>.\n3. AddPage: форма для названия игры. По нажатию «Сохранить» игра добавляется через setGames([...games, yangi]) и через useNavigate() происходит возврат на Главную.\nState games пусть остаётся в App.jsx и передаётся страницам через props. Не используй <a href> — только <Link>.\nК каждому разделу — короткий комментарий. Измененные файлы верни целиком.\nВот мой код:\n{вставьте сюда код main.jsx, App.jsx и страниц}"
});
const YANGI_BG = 'linear-gradient(135deg,#CFD8B2,#B0BC90)';
const ScreenSahifalar = ({ screen, onNext, onPrev }) => {
  const [list, setList] = useState(() => GAMES.slice());
  const [path, setPath] = useState('/');
  const [id, setId] = useState(1);
  const [nom, setNom] = useState('');
  const [oxirgi, setOxirgi] = useState('');
  const g = list.find(x => x.id === Number(id));
  const open = (gid) => { setId(gid); setPath('/game/:id'); setOxirgi(`<Link to="/game/${gid}">`); };
  const saqla = () => { const n = nom.trim(); if (!n) return; const yangi = { id: Math.max(...list.map(x => x.id)) + 1, name: n, emoji: '🎮', likes: 0, players: '0', bg: YANGI_BG }; setList(l => [...l, yangi]); setNom(''); setPath('/'); setOxirgi('navigate("/");'); };
  const qatorlar = [<span key="u">URL = "{urlOf(path, id)}";</span>];
  if (path === '/game/:id') { qatorlar.push(<span key="p">const {'{ id }'} = useParams();  <span className="sk-izoh">{`// "${id}"`}</span></span>); qatorlar.push(<span key="f">games.find(g =&gt; g.id === Number(id));  <span className="sk-izoh">{`// ${g ? `"${g.name}"` : 'undefined'}`}</span></span>); }
  qatorlar.push(<span key="l" className="sk-izoh">// games.length = {list.length}</span>);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · Gemini', ru: 'Практика 2 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'yin sahifasi va formani <span className="italic" style={{ color: T.accent }}>Gemini</span> bilan quring.</>, ru: <>Постройте страницу игры и форму с <span className="italic" style={{ color: T.accent }}>Gemini</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bitta <span className="mono">GamePage</span> istalgan o'yinni ko'rsatadi: <span className="mono">useParams()</span> manzildagi <span className="mono">:id</span>'ni beradi. Formadan keyin esa havola bosilmaydi — kodning o'zi <span className="mono">navigate("/")</span> bilan Bosh sahifaga qaytaradi.</>, ru: <>Одна <span className="mono">GamePage</span> показывает любую игру: <span className="mono">useParams()</span> отдаёт <span className="mono">:id</span> из адреса. А после формы ссылку никто не нажимает — код сам возвращает на Главную через <span className="mono">navigate("/")</span>.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Ilova · bosib ko'ring", ru: 'Приложение · попробуйте' })}</p>
            <IlovaOyna path={path} id={id} onGo={(p) => { setPath(p); setOxirgi(`<Link to="${urlOf(p, id)}">`); }}>
              {path === '/' && <div className="fade-step" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>{list.map(x => <RoCard key={x.id} name={x.name} players={x.players} emoji={x.emoji} likes={x.likes} bg={x.bg} onClick={() => open(x.id)} />)}</div>}
              {path === '/game/:id' && (g ? <div className="fade-step rt-oyin"><div className="rt-rasm" style={{ background: g.bg }}>{g.emoji}</div><p className="rt-nom">{g.name}</p><p className="body" style={{ margin: 0, color: T.ink2 }}>{g.desc ? tr(g.desc) : tr({ uz: "Yangi qo'shilgan o'yin.", ru: 'Недавно добавленная игра.' })}</p></div>
                : <p className="ql-xabar xato">{tr({ uz: "O'yin topilmadi", ru: 'Игра не найдена' })}</p>)}
              {path === '/add' && <div className="fade-step rt-forma">
                <label className="am-maydon"><span>{tr({ uz: "O'yin nomi", ru: 'Название игры' })}</span><input className="am-input" value={nom} onChange={e => setNom(e.target.value)} placeholder="Piggy" /></label>
                <button type="button" className="am-saqla" disabled={!nom.trim()} onClick={saqla}>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
              </div>}
            </IlovaOyna>
            <div className="am-chips"><button type="button" className="am-chip" onClick={() => open(99)}>{tr({ uz: '/game/99 ni ochish', ru: 'Открыть /game/99' })}</button></div>
            <KodOyna oxirgi={oxirgi} qatorlar={qatorlar} />
          </Col>
          <Col>
            <PromptBlok matn={a2Prompt()} />
            <div className="am-karta">
              <p className="flow-label">{tr({ uz: 'Tekshiring', ru: 'Проверьте' })}</p>
              <ul className="am-band">{A2_TEKSHIR.map((x, i) => <li key={i}>{fmtCode(tr(x))}</li>)}</ul>
            </div>
            <QadamTugma b={A2_QADAM} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
