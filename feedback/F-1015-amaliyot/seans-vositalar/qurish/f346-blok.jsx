// ===== F-1015-346: 23 → 8 ekran. AvtoIjara: katalog + mashina sahifasi (Gemini) → ijara + jami (Gemini) → AI xatosi (kun unutilgan) =====
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
  { uz: "Terminalda: `npm create vite@latest avto-ijara` (React, JavaScript), keyin `cd avto-ijara`, `npm install` va `npm install react-router-dom`.", ru: 'В терминале: `npm create vite@latest avto-ijara` (React, JavaScript), потом `cd avto-ijara`, `npm install` и `npm install react-router-dom`.' },
  { uz: "`npm run dev` — localhost:5173 ochiladimi? Papkani VS Code'da oching.", ru: '`npm run dev` — localhost:5173 открывается? Откройте папку в VS Code.' },
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
    <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">avto-ijara · {tr({ uz: 'qiymatlar hozir', ru: 'значения сейчас' })}</span></div>
    <div className="rj-body">
      <div className="sk-izoh">// {tr({ uz: 'oxirgi amal', ru: 'последнее действие' })}</div>
      <div key={oxirgi} className="rj-li sk-nur">{oxirgi || '—'}</div>
      <div className="sk-izoh">// {tr({ uz: 'hozir', ru: 'сейчас' })}</div>
      {qatorlar.map((q, i) => <div key={i} className="rj-li">{q}</div>)}
    </div>
  </div>
);
const KodNusxa = ({ yorliq, kod }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(kod); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return (
    <div className="am-karta">
      <div className="am-prompt-h"><p className="flow-label">{tr(yorliq)}</p><button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></div>
      <pre className="am-masalan av-json">{kod}</pre>
    </div>
  );
};
const AV_YOL = { '/': { uz: 'Bosh', ru: 'Главная' }, '/bookings': { uz: 'Mening ijaralarim', ru: 'Мои аренды' } };
const avUrl = (path, id) => (path === '/car/:id' ? `/car/${id}` : path);
// AvtoIjara oynasi: manzil qatori, menyu, sahifa
const AvOyna = ({ path, id, onGo, menyu, children }) => (
  <Win title="avto-ijara — localhost:5173" minH={150}>
    <div className="av-url"><span>localhost:5173</span><b>{avUrl(path, id)}</b></div>
    <div className="av-menu">{menyu.map(p => <button key={p} type="button" className={`av-link ${path === p ? 'on' : ''}`} onClick={() => onGo(p)}>{tr(AV_YOL[p])}</button>)}</div>
    <div style={{ marginTop: 10 }}>{children}</div>
  </Win>
);
const KunTanlov = ({ kun, setKun }) => (
  <div className="av-kun">
    <button type="button" className="av-kb" aria-label="−" disabled={kun <= 1} onClick={() => setKun(k => Math.max(1, k - 1))}>−</button>
    <b>{kun} {tr({ uz: 'kun', ru: kun === 1 ? 'день' : 'дн.' })}</b>
    <button type="button" className="av-kb" aria-label="+" onClick={() => setKun(k => Math.min(14, k + 1))}>+</button>
  </div>
);
const Ijaralar = ({ list }) => {
  const jami = list.reduce((s, b) => s + b.price * b.days, 0);
  return (
    <div className="fade-step av-ijara">
      {list.length ? <ul className="av-ijara-l">{list.map((b, i) => <li key={i}><span>{b.name}</span><span>{b.days} × {som(b.price)}</span><b>{somT(b.price * b.days)}</b></li>)}</ul>
        : <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "Hali ijara yo'q", ru: 'Аренд пока нет' })}</p>}
      <p className="av-jami"><span>{tr({ uz: 'Jami', ru: 'Итого' })}</span><b key={jami}>{somT(jami)}</b></p>
    </div>
  );
};
// To'liq namuna: katalog → mashina → kun → ijara → «Mening ijaralarim»
const AvNamuna = () => {
  const [path, setPath] = useState('/');
  const [id, setId] = useState(1);
  const [kun, setKun] = useState(3);
  const [list, setList] = useState([]);
  const c = carById(id);
  return (
    <AvOyna path={path} id={id} onGo={setPath} menyu={['/', '/bookings']}>
      {path === '/' && <Grid cols={2}>{CARS.map(x => <CarCard key={x.id} car={x} onOpen={() => { setId(x.id); setKun(3); setPath('/car/:id'); }} />)}</Grid>}
      {path === '/car/:id' && <div className="fade-step"><CarDetail id={id} /><KunTanlov kun={kun} setKun={setKun} /><button type="button" className="am-saqla" onClick={() => { setList(l => [...l, { name: c.name, price: c.price, days: kun }]); setPath('/bookings'); }}>{tr({ uz: 'Ijaraga olish', ru: 'Взять в аренду' })} · {somT(c.price * kun)}</button></div>}
      {path === '/bookings' && <Ijaralar list={list} />}
    </AvOyna>
  );
};
const BLOK3 = [
  { t: { uz: 'Katalog va mashina sahifasi', ru: 'Каталог и страница машины' }, tag: 'Gemini' },
  { t: { uz: 'Ijara va jami narx', ru: 'Аренда и итог' }, tag: 'Gemini' },
  { t: { uz: 'AI xatosini topish', ru: 'Поиск ошибки AI' }, tag: { uz: 'siz', ru: 'Вы' } }
];
const SAHIFA3 = [
  { yol: '/', t: { uz: 'Bosh — mashinalar katalogi', ru: 'Главная — каталог машин' } },
  { yol: '/car/:id', t: { uz: 'Mashina — tafsilot va kun tanlash', ru: 'Машина — детали и выбор дней' } },
  { yol: '/bookings', t: { uz: 'Mening ijaralarim — jami narx', ru: 'Мои аренды — итог' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun <span className="italic" style={{ color: T.accent }}>AvtoIjara</span> saytini qurasiz.</>, ru: <>Сегодня строите сайт <span className="italic" style={{ color: T.accent }}>AvtoIjara</span>.</> })}</h2></div>
      <Mentor>{tr({ uz: <>Modulda o'rganganingiz — komponent, state, fetch va Router — bitta saytga birlashadi. Ilovani <b style={{ color: T.ink }}>qismlarga bo'lib</b>, har qismni Gemini'ga alohida prompt bilan berasiz va har qadamdan keyin brauzerda tekshirasiz.</>, ru: <>Всё изученное в модуле — компоненты, state, fetch и Router — объединится в одном сайте. Вы <b style={{ color: T.ink }}>разбиваете приложение на части</b>, каждую отдаёте Gemini отдельным промптом и после каждого шага проверяете в браузере.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: "Dars oxirida · bosib ko'ring", ru: 'К концу урока · попробуйте' })}</p>
          <AvNamuna />
        </Col>
        <Col>
          <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: "Dars oxirida · bosib ko'ring", ru: 'К концу урока · попробуйте' })}</p>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: '3 sahifa', ru: '3 страницы' })}</p>
            <ul className="cr-jadval">{SAHIFA3.map(x => <li key={x.yol}><code className="qcode">{x.yol}</code><span>{tr(x.t)}</span></li>)}</ul>
            <hr className="am-chiziq" />
            <p className="flow-label">{tr({ uz: `Bugungi ${BLOK3.length} blok`, ru: `${BLOK3.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{BLOK3.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== a1 — Gemini: katalog (fetch cars.json) va mashina sahifasi (Router, useParams) =====
const carsJson = () => JSON.stringify(CARS.map(c => ({ id: c.id, name: c.name, price: c.price, seats: c.seats, desc: tr(c.desc) })), null, 2);
const a1Prompt = () => tr({
  uz: "Vite + React loyiham (avto-ijara) bor, react-router-dom o'rnatilgan. Mashina ijara sayti qur — hozircha ikki sahifa:\n1. Bosh sahifa (/): public/cars.json dan fetch bilan mashinalarni yuklasin (useEffect + useState) va har birini kartochka qilib chiqarsin: nomi va kunlik narxi (so'm/kun). Yuklanayotganda «Yuklanmoqda...» yozsin.\n2. Mashina sahifasi (/car/:id): useParams bilan id'ni olib, o'sha mashinaning nomi, narxi, o'rindiqlari va tavsifini ko'rsatsin. Kartochka <Link> bilan shu sahifaga olib borsin.\nSahifalar src/pages papkasida alohida faylda bo'lsin. Har bo'limga qisqa izoh yoz. Barcha fayllarni (main.jsx, App.jsx, sahifalar) to'liq yoz.",
  ru: 'У меня есть проект Vite + React (avto-ijara), установлен react-router-dom. Сделай сайт аренды машин — пока две страницы:\n1. Главная (/): загружает машины из public/cars.json через fetch (useEffect + useState) и выводит каждую карточкой: название и цена в день (сум/день). Во время загрузки пишет «Загрузка...».\n2. Страница машины (/car/:id): берёт id через useParams и показывает название, цену, число мест и описание этой машины. Карточка ведёт на эту страницу через <Link>.\nСтраницы — отдельными файлами в папке src/pages. К каждому разделу — короткий комментарий. Все файлы (main.jsx, App.jsx, страницы) напиши целиком.'
});
const A1_QADAM = [
  { uz: "`public` papkasida `cars.json` faylini yarating va mashinalar ro'yxatini nusxalab qo'ying.", ru: 'В папке `public` создайте файл `cars.json` и вставьте скопированный список машин.' },
  { uz: "«Promptni nusxalash» → gemini.google.com'ga yuboring.", ru: '«Скопировать промпт» → отправьте в gemini.google.com.' },
  { uz: "Javobdagi fayllarni `src` ga qo'ying (`pages` papkasini yarating), `Ctrl+S`.", ru: 'Положите файлы из ответа в `src` (создайте папку `pages`), `Ctrl+S`.' },
  { uz: "Brauzerda: 4 ta kartochka chiqdimi? Bittasini bosing — manzil `/car/2` bo'lib, o'sha mashina ochiladimi?", ru: 'В браузере: появились 4 карточки? Нажмите одну — адрес становится `/car/2` и открывается эта машина?' }
];
const ScreenKatalog = ({ screen, onNext, onPrev }) => {
  const [path, setPath] = useState('/');
  const [id, setId] = useState(1);
  const [oxirgi, setOxirgi] = useState('fetch("/cars.json");');
  const c = carById(id);
  const qatorlar = [<span key="u">URL = "{avUrl(path, id)}";</span>, <span key="c">cars.length = {CARS.length};  <span className="sk-izoh">// cars.json {tr({ uz: 'dan', ru: 'из' })}</span></span>];
  if (path === '/car/:id') { qatorlar.push(<span key="p">const {'{ id }'} = useParams();  <span className="sk-izoh">{`// "${id}"`}</span></span>); qatorlar.push(<span key="f">cars.find(c =&gt; c.id === Number(id));  <span className="sk-izoh">{`// "${c.name}", ${c.price}`}</span></span>); }
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 1 · Gemini', ru: 'Практика 1 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Katalog va mashina <span className="italic" style={{ color: T.accent }}>sahifasini</span> quring.</>, ru: <>Постройте каталог и <span className="italic" style={{ color: T.accent }}>страницу</span> машины.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Birinchi qism: mashinalar <span className="mono">cars.json</span> faylidan <span className="mono">fetch</span> bilan keladi, kartochka bosilsa <span className="mono">/car/:id</span> sahifasi ochiladi. Promptda aynan shu yozilgan — nima, qayerdan va qanday.</>, ru: <>Первая часть: машины приходят из файла <span className="mono">cars.json</span> через <span className="mono">fetch</span>, по нажатию на карточку открывается страница <span className="mono">/car/:id</span>. В промпте написано именно это — что, откуда и как.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Natija · bosib ko'ring", ru: 'Результат · попробуйте' })}</p>
            <AvOyna path={path} id={id} onGo={(p) => { setPath(p); setOxirgi(`<Link to="${p}">`); }} menyu={['/']}>
              {path === '/' && <Grid cols={2}>{CARS.map(x => <CarCard key={x.id} car={x} onOpen={() => { setId(x.id); setPath('/car/:id'); setOxirgi(`<Link to="/car/${x.id}">`); }} />)}</Grid>}
              {path === '/car/:id' && <CarDetail id={id} />}
            </AvOyna>
            <KodOyna oxirgi={oxirgi} qatorlar={qatorlar} />
          </Col>
          <Col>
            <KodNusxa yorliq={{ uz: 'public/cars.json', ru: 'public/cars.json' }} kod={carsJson()} />
            <PromptBlok matn={a1Prompt()} />
            <QadamTugma b={A1_QADAM} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a2 — Gemini: kun tanlash, ijara (bookings state), «Mening ijaralarim» va jami =====
const a2Prompt = () => tr({
  uz: "AvtoIjara saytimga ijara qo'sh (kodim pastda):\n1. Mashina sahifasida kun tanlash: «−» va «+» tugmalari, kamida 1 kun; ostida «Jami: narx × kun» darhol yangilansin.\n2. «Ijaraga olish» bosilganda ijara bookings ro'yxatiga qo'shilsin: setBookings([...bookings, { id, name, price, days }]). bookings state App.jsx da tursin va sahifalarga props bilan uzatilsin.\n3. Yangi sahifa «Mening ijaralarim» (/bookings): har ijara — nomi, kun va price * days; eng pastda umumiy jami — for sikli bilan har ijaraning price * days yig'indisi. Menyuga <Link> qo'sh.\nHar bo'limga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.\nMana kodim:\n{App.jsx va sahifalar kodini shu yerga qo'ying}",
  ru: 'Добавь аренду в мой сайт AvtoIjara (код ниже):\n1. На странице машины выбор дней: кнопки «−» и «+», минимум 1 день; под ними «Итого: цена × дни» обновляется сразу.\n2. По нажатию «Взять в аренду» аренда добавляется в список bookings: setBookings([...bookings, { id, name, price, days }]). State bookings пусть лежит в App.jsx и передаётся страницам через props.\n3. Новая страница «Мои аренды» (/bookings): каждая аренда — название, дни и price * days; внизу общий итог — сумма price * days всех аренд циклом for. Добавь <Link> в меню.\nК каждому разделу — короткий комментарий. Измененные файлы верни целиком.\nВот мой код:\n{вставьте сюда код App.jsx и страниц}'
});
const A2_QADAM = [
  { uz: "Chapda mashina tanlab, kunni o'zgartiring va ijaraga oling — kod oynasida `price * days` ni ko'ring.", ru: 'Слева выберите машину, поменяйте дни и возьмите в аренду — в окне кода видно `price * days`.' },
  { uz: "«Promptni nusxalash» → gemini.google.com, oxiriga `App.jsx` va sahifalar kodini qo'shing va yuboring.", ru: '«Скопировать промпт» → gemini.google.com, в конце добавьте код `App.jsx` и страниц и отправьте.' },
  { uz: "Javobdagi fayllarni almashtiring, `Ctrl+S`.", ru: 'Замените файлы на файлы из ответа, `Ctrl+S`.' },
  { uz: "«Tekshiring» ro'yxatini brauzerda o'ting.", ru: 'Пройдите список «Проверьте» в браузере.' }
];
const A2_TEKSHIR = [
  { uz: "Cobalt (280 000 so'm) 3 kunga — jami 840 000 so'm mi?", ru: 'Cobalt (280 000 сум) на 3 дня — итог 840 000 сум?' },
  { uz: "Malibu 3 kun + Cobalt 2 kun — «Mening ijaralarim»da jami 2 120 000 so'm mi?", ru: 'Malibu 3 дня + Cobalt 2 дня — в «Мои аренды» итог 2 120 000 сум?' },
  { uz: "Kun 0 ga tushmaydimi?", ru: 'Дни не опускаются до 0?' },
  { uz: "Sahifa almashganda ijaralar yo'qolmaydimi?", ru: 'Аренды не пропадают при смене страницы?' }
];
const ScreenIjara = ({ screen, onNext, onPrev }) => {
  const [path, setPath] = useState('/car/:id');
  const [id, setId] = useState(1);
  const [kun, setKun] = useState(3);
  const [list, setList] = useState([]);
  const [oxirgi, setOxirgi] = useState('');
  const c = carById(id);
  const ol = () => { setList(l => [...l, { name: c.name, price: c.price, days: kun }]); setOxirgi(`setBookings([...bookings, { name: "${c.name}", price: ${c.price}, days: ${kun} }]);`); setPath('/bookings'); };
  const jami = list.reduce((s, b) => s + b.price * b.days, 0);
  const qatorlar = [<span key="u">URL = "{avUrl(path, id)}";</span>];
  if (path === '/car/:id') qatorlar.push(<span key="k">price * days;  <span className="sk-izoh">{`// ${c.price} * ${kun} = ${c.price * kun}`}</span></span>);
  qatorlar.push(<span key="j">jami = {jami};  {list.length > 0 && <span className="sk-izoh">{`// for: ${list.map(b => `${b.price}*${b.days}`).join(' + ')}`}</span>}</span>);
  qatorlar.push(<span key="l" className="sk-izoh">// bookings.length = {list.length}</span>);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · Gemini', ru: 'Практика 2 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ijara va <span className="italic" style={{ color: T.accent }}>jami narxni</span> qo'shing.</>, ru: <>Добавьте аренду и <span className="italic" style={{ color: T.accent }}>итоговую цену</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Saytning o'zagi: bitta ijara narxi — <span className="mono">price * days</span>, umumiy jami — hamma ijaralar yig'indisi. Ijaralar <span className="mono">bookings</span> state'ida turadi, shuning uchun sahifa almashsa ham yo'qolmaydi.</>, ru: <>Ядро сайта: цена одной аренды — <span className="mono">price * days</span>, общий итог — сумма всех аренд. Аренды лежат в state <span className="mono">bookings</span>, поэтому не пропадают при смене страницы.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Natija · bosib ko'ring", ru: 'Результат · попробуйте' })}</p>
            <AvOyna path={path} id={id} onGo={(p) => { setPath(p); setOxirgi(`<Link to="${p}">`); }} menyu={['/', '/bookings']}>
              {path === '/' && <Grid cols={2}>{CARS.map(x => <CarCard key={x.id} car={x} onOpen={() => { setId(x.id); setKun(3); setPath('/car/:id'); setOxirgi(`<Link to="/car/${x.id}">`); }} />)}</Grid>}
              {path === '/car/:id' && <div className="fade-step"><CarDetail id={id} /><KunTanlov kun={kun} setKun={setKun} /><button type="button" className="am-saqla" onClick={ol}>{tr({ uz: 'Ijaraga olish', ru: 'Взять в аренду' })} · {somT(c.price * kun)}</button></div>}
              {path === '/bookings' && <Ijaralar list={list} />}
            </AvOyna>
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
