// ===== F-1015-376 (17.10, foydalanuvchi «A»): 8 → 9 ekran — har amaliyotda BITTA ish, qisqa prompt; chapda ilova + «Tekshiring», o'ngda prompt + kod oynasi =====
// a1 — katalog (fetch cars.json) · a2 — mashina sahifasi va kun (useParams, price * days) · a3 — ijaralar va jami (bookings, for)
const carsJson = () => JSON.stringify(CARS.map(c => ({ id: c.id, name: c.name, price: c.price, seats: c.seats, desc: tr(c.desc) })), null, 2);
// cars.json — katta qora quti emas: kichik karta, «Ko'rish» oynada ochadi, «Nusxalash» nusxalaydi
// qolip-maket: av-json-kor
const JsonKarta = () => {
  const [ok, setOk] = useState(false);
  const [ochiq, setOchiq] = useState(false);
  const btnRef = useRef(null);
  const yopRef = useRef(null);
  const kod = carsJson();
  const nusxa = async () => { try { await navigator.clipboard.writeText(kod); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  const yop = () => { setOchiq(false); setTimeout(() => btnRef.current && btnRef.current.focus(), 0); };
  useEffect(() => {
    if (!ochiq) return;
    const onKey = (e) => { if (e.key === 'Escape') yop(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    yopRef.current && yopRef.current.focus();
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [ochiq]);
  return (
    <div className="am-karta av-json-k">
      <div className="am-prompt-h">
        <p className="flow-label">public/cars.json · {tr({ uz: `${CARS.length} mashina`, ru: `${CARS.length} машины` })}</p>
        <span className="av-json-tg">
          <button ref={btnRef} type="button" className="av-json-kor" aria-haspopup="dialog" onClick={() => setOchiq(true)}>{tr({ uz: "Ko'rish", ru: 'Показать' })}</button>
          <button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button>
        </span>
      </div>
      {ochiq && createPortal(<>
        <div className="zoom-backdrop" onClick={yop} />
        <div className="am-tt-oyna" role="dialog" aria-modal="true" aria-label="public/cars.json">
          <div className="am-tt-oyna-h"><span className="am-tayyor-h">public/cars.json</span><button ref={yopRef} type="button" className="am-tt-yop" onClick={yop} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button></div>
          <pre className="am-masalan av-json">{kod}</pre>
        </div>
      </>, (btnRef.current && btnRef.current.closest('.lesson-root')) || document.body)}
    </div>
  );
};
const useKodNur = () => {
  const [oxirgi, setOxirgi] = useState('');
  const [nur, setNur] = useState(0); // har bosishda kod oynasi yonadi
  const [yig, setYig] = useState(0);
  const kodRef = useRef(null);
  const korsat = () => setTimeout(() => { const el = kodRef.current; if (!el) return; const r = el.getBoundingClientRect(); if (r.top < 0 || r.bottom > window.innerHeight) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 420);
  const setOx = (v) => { setOxirgi(v); setNur(n => n + 1); korsat(); };
  return { oxirgi, setOx, nur, yig, setYig, kodRef };
};
const Tekshir = ({ b }) => (
  <div className="am-karta">
    <p className="flow-label">{tr({ uz: 'Tekshiring', ru: 'Проверьте' })}</p>
    <ul className="am-band">{b.map((x, i) => <li key={i}>{fmtCode(tr(x))}</li>)}</ul>
  </div>
);
const OngUstun = ({ prompt, k, qatorlar, qadam, ust }) => (
  <Col>
    {ust}
    <PromptBlok matn={prompt} yigil onYigil={() => k.setYig(y => y + 1)} />
    <div ref={k.kodRef} key={'k' + k.yig} className={k.yig ? 'sk-kotar' : ''}><KodOyna oxirgi={k.oxirgi} nur={k.nur} qatorlar={qatorlar} /></div>
    <QadamTugma b={qadam} />
  </Col>
);

// ----- a1 · Katalog -----
const a1Prompt = () => tr({
  uz: "Vite + React loyiham (avto-ijara) bor, react-router-dom o'rnatilgan. Bosh sahifani qur (src/pages/Home.jsx, App.jsx da Route path=\"/\"):\npublic/cars.json dan fetch bilan mashinalarni yuklasin (useEffect + useState) va har birini kartochka qilib chiqarsin: nomi va kunlik narxi (so'm/kun). Yuklanayotganda «Yuklanmoqda...» yozsin.\nHar bo'limga qisqa izoh yoz. Fayllarni to'liq yoz.",
  ru: 'У меня есть проект Vite + React (avto-ijara), установлен react-router-dom. Сделай главную страницу (src/pages/Home.jsx, в App.jsx Route path="/"):\nона загружает машины из public/cars.json через fetch (useEffect + useState) и выводит каждую карточкой: название и цена в день (сум/день). Во время загрузки пишет «Загрузка...».\nК каждому разделу — короткий комментарий. Файлы напиши целиком.'
});
const A1_QADAM = [
  { uz: "`public` papkasida `cars.json` faylini yarating va «Nusxalash» bilan olingan ro'yxatni qo'ying.", ru: 'В папке `public` создайте файл `cars.json` и вставьте список, скопированный кнопкой «Скопировать».' },
  { uz: "«Promptni nusxalash» → gemini.google.com'ga yuboring.", ru: '«Скопировать промпт» → отправьте в gemini.google.com.' },
  { uz: "Javobdagi fayllarni `src` ga qo'ying (`pages` papkasini yarating), `Ctrl+S`.", ru: 'Положите файлы из ответа в `src` (создайте папку `pages`), `Ctrl+S`.' },
  { uz: "«Tekshiring» ro'yxatini brauzerda o'ting.", ru: 'Пройдите список «Проверьте» в браузере.' }
];
const A1_TEKSHIR = [
  { uz: "4 ta kartochka chiqdimi — nomi va kunlik narxi bilan?", ru: 'Появились 4 карточки — с названием и ценой в день?' },
  { uz: "Sahifani yangilang — bir lahza «Yuklanmoqda...» ko'rinadimi?", ru: 'Обновите страницу — на миг видно «Загрузка...»?' }
];
const ScreenKatalog = ({ screen, onNext, onPrev }) => {
  const k = useKodNur();
  const [yuk, setYuk] = useState(false);
  const qayta = () => { setYuk(true); k.setOx('fetch("/cars.json");'); setTimeout(() => { setYuk(false); k.setOx('setCars(data);'); }, 900); };
  const qatorlar = [<span key="y">yuklanmoqda = {String(yuk)};</span>, <span key="c">cars.length = {yuk ? 0 : CARS.length};  <span className="sk-izoh">// cars.json {tr({ uz: 'dan', ru: 'из' })}</span></span>];
  return (
    <Stage mentorYigil eyebrow={tr({ uz: 'Amaliyot 1 · Gemini', ru: 'Практика 1 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>Katalogni</span> quring.</>, ru: <>Постройте <span className="italic" style={{ color: T.accent }}>каталог</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Birinchi qism — faqat Bosh sahifa: mashinalar <span className="mono">cars.json</span> faylidan <span className="mono">fetch</span> bilan keladi va kartochka bo'lib chiqadi.</>, ru: <>Первая часть — только главная: машины приходят из файла <span className="mono">cars.json</span> через <span className="mono">fetch</span> и выводятся карточками.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Natija · bosib ko'ring", ru: 'Результат · попробуйте' })}</p>
            <AvOyna path="/" id={1} onGo={qayta} menyu={['/']}>
              {yuk ? <p className="small fade-step" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: 'Yuklanmoqda...', ru: 'Загрузка...' })}</p>
                : <div className="fade-step"><Grid cols={2}>{CARS.map(x => <CarCard key={x.id} car={x} />)}</Grid></div>}
            </AvOyna>
            <div className="am-chips"><button type="button" className="am-chip" onClick={qayta}>{tr({ uz: '↻ Qayta yuklash', ru: '↻ Загрузить заново' })}</button></div>
            <Tekshir b={A1_TEKSHIR} />
          </Col>
          <OngUstun ust={<JsonKarta />} prompt={a1Prompt()} k={k} qatorlar={qatorlar} qadam={A1_QADAM} />
        </Split>
      </div>
    </Stage>
  );
};

// ----- a2 · Mashina sahifasi va kun -----
const a2Prompt = () => tr({
  uz: "AvtoIjara saytimga mashina sahifasini qo'sh (kodim pastda):\n1. /car/:id sahifasi: useParams bilan id'ni olsin va cars dan find bilan topib — nomi, narxi, o'rindiqlari va tavsifini ko'rsatsin.\n2. Bosh sahifadagi har kartochka <Link> bilan shu sahifaga olib borsin.\n3. Sahifada kun tanlash: «−» va «+», kamida 1 kun; ostida «Narx: price × kun» darhol yangilansin.\nHar bo'limga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.\nMana kodim:\n{App.jsx va sahifalar kodini shu yerga qo'ying}",
  ru: 'Добавь в мой сайт AvtoIjara страницу машины (код ниже):\n1. Страница /car/:id: берёт id через useParams, находит машину в cars через find и показывает название, цену, число мест и описание.\n2. Каждая карточка на главной ведёт на эту страницу через <Link>.\n3. На странице выбор дней: «−» и «+», минимум 1 день; под ними «Цена: price × дни» обновляется сразу.\nК каждому разделу — короткий комментарий. Изменённые файлы верни целиком.\nВот мой код:\n{вставьте сюда код App.jsx и страниц}'
});
const A2_QADAM = [
  { uz: "Chapda kartochkani bosing va kunni o'zgartiring — kod oynasida `useParams` va `price * days` ni ko'ring.", ru: 'Слева нажмите карточку и поменяйте дни — в окне кода видно `useParams` и `price * days`.' },
  { uz: "«Promptni nusxalash» → gemini.google.com, oxiriga `App.jsx` va sahifalar kodini qo'shing va yuboring.", ru: '«Скопировать промпт» → gemini.google.com, в конце добавьте код `App.jsx` и страниц и отправьте.' },
  { uz: "Javobdagi fayllarni almashtiring, `Ctrl+S`.", ru: 'Замените файлы на файлы из ответа, `Ctrl+S`.' },
  { uz: "«Tekshiring» ro'yxatini brauzerda o'ting.", ru: 'Пройдите список «Проверьте» в браузере.' }
];
const A2_TEKSHIR = [
  { uz: "Kartochka bosilsa manzil `/car/2` bo'lib, o'sha mashina ochiladimi?", ru: 'При нажатии на карточку адрес становится `/car/2` и открывается эта машина?' },
  { uz: "Kun 1 dan pastga tushmaydimi?", ru: 'Дни не опускаются ниже 1?' },
  { uz: "Kun o'zgarsa, narx ham darhol o'zgaradimi?", ru: 'При смене дней цена сразу меняется?' }
];
const ScreenMashina = ({ screen, onNext, onPrev }) => {
  const k = useKodNur();
  const [path, setPath] = useState('/');
  const [id, setId] = useState(1);
  const [kun, setKunS] = useState(3);
  const c = carById(id);
  const setKun = (f) => setKunS(prev => { const v = typeof f === 'function' ? f(prev) : f; if (v !== prev) k.setOx(`setDays(${v});`); return v; });
  const qatorlar = [<span key="u">URL = "{avUrl(path, id)}";</span>];
  if (path === '/car/:id') { qatorlar.push(<span key="p">const {'{ id }'} = useParams();  <span className="sk-izoh">{`// "${id}"`}</span></span>); qatorlar.push(<span key="f">cars.find(c =&gt; c.id === Number(id));  <span className="sk-izoh">{`// "${c.name}"`}</span></span>); qatorlar.push(<span key="k">price * days;  <span className="sk-izoh">{`// ${c.price} * ${kun} = ${c.price * kun}`}</span></span>); }
  return (
    <Stage mentorYigil eyebrow={tr({ uz: 'Amaliyot 2 · Gemini', ru: 'Практика 2 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Mashina sahifasi va <span className="italic" style={{ color: T.accent }}>ijara narxi</span>.</>, ru: <>Страница машины и <span className="italic" style={{ color: T.accent }}>цена аренды</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Kartochka bosilsa <span className="mono">/car/:id</span> ochiladi: <span className="mono">useParams</span> id'ni beradi. Kun tanlansa, narx <span className="mono">price * days</span> bilan darhol hisoblanadi.</>, ru: <>По нажатию на карточку открывается <span className="mono">/car/:id</span>: <span className="mono">useParams</span> даёт id. При выборе дней цена сразу считается как <span className="mono">price * days</span>.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Natija · bosib ko'ring", ru: 'Результат · попробуйте' })}</p>
            <AvOyna path={path} id={id} onGo={(p) => { setPath(p); k.setOx(`<Link to="${p}">`); }} menyu={['/']}>
              {path === '/' && <Grid cols={2}>{CARS.map(x => <CarCard key={x.id} car={x} onOpen={() => { setId(x.id); setKunS(3); setPath('/car/:id'); k.setOx(`<Link to="/car/${x.id}">`); }} />)}</Grid>}
              {path === '/car/:id' && <div className="fade-step"><CarDetail id={id} /><KunTanlov kun={kun} setKun={setKun} /><p className="av-narx">{tr({ uz: 'Narx', ru: 'Цена' })}: {som(c.price)} × {kun} = <b key={kun}>{somT(c.price * kun)}</b></p></div>}
            </AvOyna>
            <Tekshir b={A2_TEKSHIR} />
          </Col>
          <OngUstun prompt={a2Prompt()} k={k} qatorlar={qatorlar} qadam={A2_QADAM} />
        </Split>
      </div>
    </Stage>
  );
};

// ----- a3 · Ijaralar va jami -----
const a3Prompt = () => tr({
  uz: "AvtoIjara saytimga ijaralarni qo'sh (kodim pastda):\n1. Mashina sahifasidagi «Ijaraga olish» bosilganda ijara bookings ro'yxatiga qo'shilsin: setBookings([...bookings, { id, name, price, days }]). bookings state App.jsx da tursin.\n2. Yangi sahifa «Mening ijaralarim» (/bookings): har ijara — nomi, kun va price * days; pastda jami — for sikli bilan yig'indi. Menyuga <Link> qo'sh.\nHar bo'limga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.\nMana kodim:\n{App.jsx va sahifalar kodini shu yerga qo'ying}",
  ru: 'Добавь в мой сайт AvtoIjara аренды (код ниже):\n1. По нажатию «Взять в аренду» на странице машины аренда добавляется в список bookings: setBookings([...bookings, { id, name, price, days }]). State bookings пусть лежит в App.jsx.\n2. Новая страница «Мои аренды» (/bookings): каждая аренда — название, дни и price * days; внизу итог — сумма циклом for. Добавь <Link> в меню.\nК каждому разделу — короткий комментарий. Изменённые файлы верни целиком.\nВот мой код:\n{вставьте сюда код App.jsx и страниц}'
});
const A3_QADAM = [
  { uz: "Chapda ijaraga oling va «Mening ijaralarim»ni oching — kod oynasida `setBookings` va `jami` ni ko'ring.", ru: 'Слева возьмите в аренду и откройте «Мои аренды» — в окне кода видно `setBookings` и `jami`.' },
  { uz: "«Promptni nusxalash» → gemini.google.com, oxiriga `App.jsx` va sahifalar kodini qo'shing va yuboring.", ru: '«Скопировать промпт» → gemini.google.com, в конце добавьте код `App.jsx` и страниц и отправьте.' },
  { uz: "Javobdagi fayllarni almashtiring, `Ctrl+S`.", ru: 'Замените файлы на файлы из ответа, `Ctrl+S`.' },
  { uz: "«Tekshiring» ro'yxatini brauzerda o'ting.", ru: 'Пройдите список «Проверьте» в браузере.' }
];
const A3_TEKSHIR = [
  { uz: "Ikki ijara oling — «Mening ijaralarim»da ikkalasi ham bormi?", ru: 'Возьмите две аренды — обе есть в «Мои аренды»?' },
  { uz: "Jami har bir ijara narxining yig'indisiga tengmi?", ru: 'Итог равен сумме цен всех аренд?' },
  { uz: "Bosh sahifaga o'tib qayting — ijaralar joyidami?", ru: 'Перейдите на главную и вернитесь — аренды на месте?' }
];
const ScreenIjara = ({ screen, onNext, onPrev }) => {
  const k = useKodNur();
  const [path, setPath] = useState('/car/:id');
  const [id, setId] = useState(1);
  const [kun, setKun] = useState(3);
  const [list, setList] = useState([]);
  const c = carById(id);
  const ol = () => { setList(l => [...l, { name: c.name, price: c.price, days: kun }]); k.setOx(`setBookings([...bookings, { name: "${c.name}", price: ${c.price}, days: ${kun} }]);`); setPath('/bookings'); };
  const jami = list.reduce((s, b) => s + b.price * b.days, 0);
  const qatorlar = [<span key="u">URL = "{avUrl(path, id)}";</span>, <span key="l">bookings.length = {list.length};</span>];
  qatorlar.push(<span key="j">jami = {jami};  {list.length > 0 && <span className="sk-izoh">{`// for: ${list.map(b => `${b.price}*${b.days}`).join(' + ')}`}</span>}</span>);
  return (
    <Stage mentorYigil eyebrow={tr({ uz: 'Amaliyot 3 · Gemini', ru: 'Практика 3 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ijaralar va <span className="italic" style={{ color: T.accent }}>jami narx</span>.</>, ru: <>Аренды и <span className="italic" style={{ color: T.accent }}>итоговая цена</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Ijaralar <span className="mono">bookings</span> ro'yxatida turadi. «Mening ijaralarim» sahifasi ularni ko'rsatadi, jami esa <span className="mono">for</span> bilan yig'iladi.</>, ru: <>Аренды лежат в списке <span className="mono">bookings</span>. Страница «Мои аренды» их показывает, а итог собирается циклом <span className="mono">for</span>.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Natija · bosib ko'ring", ru: 'Результат · попробуйте' })}</p>
            <AvOyna path={path} id={id} onGo={(p) => { setPath(p); k.setOx(`<Link to="${p}">`); }} menyu={['/', '/bookings']}>
              {path === '/' && <Grid cols={2}>{CARS.map(x => <CarCard key={x.id} car={x} onOpen={() => { setId(x.id); setKun(3); setPath('/car/:id'); k.setOx(`<Link to="/car/${x.id}">`); }} />)}</Grid>}
              {path === '/car/:id' && <div className="fade-step"><CarDetail id={id} /><KunTanlov kun={kun} setKun={setKun} /><button type="button" className="am-saqla" onClick={ol}>{tr({ uz: 'Ijaraga olish', ru: 'Взять в аренду' })} · {somT(c.price * kun)}</button></div>}
              {path === '/bookings' && <Ijaralar list={list} />}
            </AvOyna>
            <Tekshir b={A3_TEKSHIR} />
          </Col>
          <OngUstun prompt={a3Prompt()} k={k} qatorlar={qatorlar} qadam={A3_QADAM} />
        </Split>
      </div>
    </Stage>
  );
};
