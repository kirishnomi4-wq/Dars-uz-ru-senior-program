// ===== F-1015-384 (17.10, foydalanuvchi «xa qil»): a2 ikkiga — server va o'qish (GET) · yozish (POST, PUT, DELETE). Har birida bitta ish, qisqa prompt =====
// Prompt yig'iq karta: «Ko'rish» — oynada to'liq matn, «Promptni nusxalash» — nusxa (Qadamlar kabi; sahifa uzaymaydi)
const PromptKarta = ({ matn }) => {
  const [ok, setOk] = useState(false);
  const [ochiq, setOchiq] = useState(false);
  const btnRef = useRef(null);
  const yopRef = useRef(null);
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  const yop = () => { setOchiq(false); setTimeout(() => btnRef.current && btnRef.current.focus(), 0); };
  useEffect(() => {
    if (!ochiq) return;
    const onKey = (e) => { if (e.key === 'Escape') yop(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    yopRef.current && yopRef.current.focus();
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [ochiq]);
  const birinchi = matn.split('\n')[0];
  return (
    <div className="am-karta pk-karta">
      <div className="am-prompt-h">
        <p className="flow-label">{tr({ uz: 'Prompt', ru: 'Промпт' })}</p>
        <span className="pk-tg">
          <button ref={btnRef} type="button" className="pk-kor" aria-haspopup="dialog" onClick={() => setOchiq(true)}>{tr({ uz: "Ko'rish", ru: 'Показать' })}</button>
          <button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Promptni nusxalash', ru: 'Скопировать промпт' })}</button>
        </span>
      </div>
      <p className="pk-bosh">{birinchi}</p>
      {ochiq && createPortal(<>
        <div className="zoom-backdrop" onClick={yop} />
        <div className="am-tt-oyna pk-oyna" role="dialog" aria-modal="true" aria-label={tr({ uz: 'Prompt', ru: 'Промпт' })}>
          <div className="am-tt-oyna-h"><span className="am-tayyor-h">{tr({ uz: 'Prompt', ru: 'Промпт' })}</span><button ref={yopRef} type="button" className="am-tt-yop" onClick={yop} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button></div>
          <pre className="am-masalan">{matn}</pre>
          <button type="button" className="am-nusxa pk-ich" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Promptni nusxalash', ru: 'Скопировать промпт' })}</button>
        </div>
      </>, (btnRef.current && btnRef.current.closest('.lesson-root')) || document.body)}
    </div>
  );
};
const Tekshir = ({ b }) => (
  <div className="am-karta">
    <p className="flow-label">{tr({ uz: 'Tekshiring', ru: 'Проверьте' })}</p>
    <ul className="am-band">{b.map((x, i) => <li key={i}>{fmtCode(tr(x))}</li>)}</ul>
  </div>
);
// Postman maketi: tanlangan so'rov → Send → javob; jadval va kod oynasi o'zgaradi
const usePostman = (sorvlar, boshQator) => {
  const [rows, setRows] = useState(boshQator);
  const [tanlov, setTanlov] = useState(0);
  const [javob, setJavob] = useState(null);
  const [oxirgi, setOxirgi] = useState('');
  const [flash, setFlash] = useState(null);
  const [nur, setNur] = useState(0);
  const s = sorvlar[tanlov];
  const yubor = () => {
    let next = rows; let st = 200; let txt = 'OK'; let json; let fl = null;
    if (s.m === 'GET') json = JSON.stringify(rows, null, 2);
    if (s.m === 'POST') { const id = Math.max(0, ...rows.map(r => r.id)) + 1; const r = { id, nom: 'Chevrolet Spark', narx: 190000, yil: 2021 }; next = [...rows, r]; st = 201; txt = 'Created'; json = JSON.stringify(r, null, 2); fl = id; }
    if (s.m === 'PUT') { const r = rows.find(x => x.id === 2); if (r) { next = rows.map(x => (x.id === 2 ? { ...x, narx: 480000 } : x)); json = JSON.stringify({ ...r, narx: 480000 }, null, 2); fl = 2; } else { st = 404; txt = 'Not Found'; json = '{ "error": "topilmadi" }'; } }
    if (s.m === 'DELETE') { if (rows.some(x => x.id === 1)) { next = rows.filter(x => x.id !== 1); json = '{ "status": "o\'chirildi" }'; } else { st = 404; txt = 'Not Found'; json = '{ "error": "topilmadi" }'; } }
    setRows(next); setJavob({ st, txt, json }); setOxirgi(s.sql); setFlash(fl); setNur(n => n + 1);
  };
  const tanla = (i) => { setTanlov(i); setJavob(null); };
  return { rows, tanlov, tanla, javob, oxirgi, flash, nur, s, yubor };
};
const PostmanOyna = ({ sorvlar, pm }) => (
  <Win title="Postman">
    {sorvlar.length > 1 && <div className="am-chips">{sorvlar.map((x, i) => <button key={x.m} type="button" className={`am-chip ${pm.tanlov === i ? 'on' : ''}`} aria-pressed={pm.tanlov === i} onClick={() => pm.tanla(i)}>{x.m}</button>)}</div>}
    <div className="bk-url"><MBadge m={pm.s.m} /><span>localhost:3000{pm.s.url}</span><button type="button" className="am-saqla bk-send" onClick={pm.yubor}>Send</button></div>
    {pm.s.body && <pre className="am-masalan bk-body">{pm.s.body}</pre>}
    {pm.javob && <Resp status={pm.javob.st} text={pm.javob.txt} json={pm.javob.json} />}
  </Win>
);

// ----- a2 · Server va o'qish (GET) -----
const SORV_GET = [{ m: 'GET', url: '/api/cars', sql: "pool.query('SELECT * FROM cars')" }];
const a2Prompt = () => tr({
  uz: "Node.js + Express loyiham (avto-ijara-server) bor, express va pg o'rnatilgan. PostgreSQL'da avtoijara bazasida cars jadvali bor.\nserver.js yoz:\n1. pg'dan Pool bilan bazaga ulan (user, password, database: avtoijara — tepada o'zgaruvchilarda, parolni o'zim yozaman).\n2. GET /api/cars — SELECT * FROM cars, natijani res.json bilan qaytar. Xato bo'lsa status 500 va xato matni.\nPort 3000. Har bo'limga qisqa izoh yoz. Faylni to'liq yoz.",
  ru: 'У меня есть проект Node.js + Express (avto-ijara-server), установлены express и pg. В PostgreSQL в базе avtoijara есть таблица cars.\nНапиши server.js:\n1. Подключись к базе через Pool из pg (user, password, database: avtoijara — в переменных вверху, пароль впишу сам).\n2. GET /api/cars — SELECT * FROM cars, верни результат через res.json. При ошибке — статус 500 и текст ошибки.\nПорт 3000. К каждому разделу — короткий комментарий. Файл напиши целиком.'
});
const A2_QADAM = [
  { uz: "Chapda GET'ni yuboring — javob jadvaldagi qatorlarning o'zi.", ru: 'Слева отправьте GET — ответ совпадает со строками таблицы.' },
  { uz: "«Promptni nusxalash» → gemini.google.com; javobni `server.js` ga qo'ying, parolni yozing, `Ctrl+S`.", ru: '«Скопировать промпт» → gemini.google.com; ответ вставьте в `server.js`, впишите пароль, `Ctrl+S`.' },
  { uz: "Terminalda `node server.js` — server ishga tushdi.", ru: 'В терминале `node server.js` — сервер запущен.' },
  { uz: "«Tekshiring» ro'yxatini o'ting.", ru: 'Пройдите список «Проверьте».' }
];
const A2_TEKSHIR = [
  { uz: "`node server.js` xatosiz ishga tushdimi?", ru: '`node server.js` запустился без ошибок?' },
  { uz: "Brauzerda localhost:3000/api/cars — 3 ta mashina chiqdimi?", ru: 'В браузере localhost:3000/api/cars — видны 3 машины?' }
];
const ScreenServer = ({ screen, onNext, onPrev }) => {
  const pm = usePostman(SORV_GET, BK_BOSH);
  return (
    <Stage mentorYigil eyebrow={tr({ uz: 'Amaliyot 2 · Gemini', ru: 'Практика 2 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Server va <span className="italic" style={{ color: T.accent }}>o'qish</span>.</>, ru: <>Сервер и <span className="italic" style={{ color: T.accent }}>чтение</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Server bazaga <span className="mono">Pool</span> orqali ulanadi. Birinchi endpoint — <span className="mono">GET /api/cars</span>: ichida <span className="mono">pool.query</span> SQL'ni bazaga olib boradi va qatorlarni qaytaradi.</>, ru: <>Сервер подключается к базе через <span className="mono">Pool</span>. Первый endpoint — <span className="mono">GET /api/cars</span>: внутри <span className="mono">pool.query</span> несёт SQL в базу и возвращает строки.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Postman · so'rov yuboring", ru: 'Postman · отправьте запрос' })}</p>
            <PostmanOyna sorvlar={SORV_GET} pm={pm} />
            <DbTable rows={pm.rows} />
            <Tekshir b={A2_TEKSHIR} />
          </Col>
          <Col>
            <PromptKarta matn={a2Prompt()} />
            <QadamTugma b={A2_QADAM} />
            <KodOyna oxirgi={pm.oxirgi} nur={pm.nur} qatorlar={[<span key="n" className="sk-izoh">// cars: {pm.rows.length} {tr({ uz: 'qator', ru: 'строк' })}</span>]} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ----- a3 · Yozish (POST, PUT, DELETE) -----
const SORV_YOZ = [
  { m: 'POST', url: '/api/cars', body: '{ "nom": "Chevrolet Spark", "narx": 190000, "yil": 2021 }', sql: "pool.query('INSERT INTO cars (nom, narx, yil) VALUES ($1, $2, $3) RETURNING *', [nom, narx, yil])" },
  { m: 'PUT', url: '/api/cars/2', body: '{ "narx": 480000 }', sql: "pool.query('UPDATE cars SET narx = $1 WHERE id = $2 RETURNING *', [narx, id])" },
  { m: 'DELETE', url: '/api/cars/1', sql: "pool.query('DELETE FROM cars WHERE id = $1', [id])" }
];
const a3Prompt = () => tr({
  uz: "server.js ga yozish endpointlarini qo'sh (kodim pastda):\n1. app.use(express.json()).\n2. POST /api/cars — req.body dan nom, narx, yil; INSERT ... VALUES ($1, $2, $3) RETURNING *, status 201.\n3. PUT /api/cars/:id — narxni yangilasin: UPDATE ... SET narx = $1 WHERE id = $2.\n4. DELETE /api/cars/:id — shu mashinani o'chirsin.\nQiymatlarni SQL matniga yopishtirma — faqat $1, $2 bilan. O'zgargan faylni to'liq qaytar.\nMana kodim:\n{server.js kodini shu yerga qo'ying}",
  ru: 'Добавь в server.js endpoint-ы записи (код ниже):\n1. app.use(express.json()).\n2. POST /api/cars — из req.body nom, narx, yil; INSERT ... VALUES ($1, $2, $3) RETURNING *, статус 201.\n3. PUT /api/cars/:id — обновляет цену: UPDATE ... SET narx = $1 WHERE id = $2.\n4. DELETE /api/cars/:id — удаляет эту машину.\nНе вклеивай значения в текст SQL — только через $1, $2. Изменённый файл верни целиком.\nВот мой код:\n{вставьте сюда код server.js}'
});
const A3_QADAM = [
  { uz: "Chapda POST, PUT va DELETE'ni yuboring — jadval qanday o'zgarishini ko'ring.", ru: 'Слева отправьте POST, PUT и DELETE — посмотрите, как меняется таблица.' },
  { uz: "«Promptni nusxalash» → gemini.google.com, oxiriga `server.js` kodini qo'shing; javobni almashtiring, `Ctrl+S`.", ru: '«Скопировать промпт» → gemini.google.com, в конце добавьте код `server.js`; замените ответ, `Ctrl+S`.' },
  { uz: "Serverni qayta ishga tushiring: `Ctrl+C`, keyin `node server.js`.", ru: 'Перезапустите сервер: `Ctrl+C`, затем `node server.js`.' },
  { uz: "Postman'da uchala so'rovni yuboring va «Tekshiring» ro'yxatini o'ting.", ru: 'Отправьте все три запроса в Postman и пройдите список «Проверьте».' }
];
const A3_TEKSHIR = [
  { uz: "POST'dan keyin psql'da `SELECT * FROM cars;` — yangi mashina bormi?", ru: 'После POST в psql `SELECT * FROM cars;` — новая машина есть?' },
  { uz: "PUT'dan keyin o'sha mashinaning narxi o'zgardimi?", ru: 'После PUT цена этой машины изменилась?' },
  { uz: "DELETE'dan keyin o'sha qator yo'qoldimi?", ru: 'После DELETE эта строка исчезла?' }
];
const ScreenYozish = ({ screen, onNext, onPrev }) => {
  const pm = usePostman(SORV_YOZ, BK_BOSH);
  return (
    <Stage mentorYigil eyebrow={tr({ uz: 'Amaliyot 3 · Gemini', ru: 'Практика 3 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qo'shish, o'zgartirish va <span className="italic" style={{ color: T.accent }}>o'chirish</span>.</>, ru: <>Добавление, изменение и <span className="italic" style={{ color: T.accent }}>удаление</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <><span className="mono">POST</span> qo'shadi, <span className="mono">PUT</span> o'zgartiradi, <span className="mono">DELETE</span> o'chiradi. Qiymatlar SQL matniga yopishtirilmaydi — <span className="mono">$1, $2</span> bilan beriladi.</>, ru: <><span className="mono">POST</span> добавляет, <span className="mono">PUT</span> изменяет, <span className="mono">DELETE</span> удаляет. Значения не вклеиваются в текст SQL — передаются через <span className="mono">$1, $2</span>.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Postman · so'rov yuboring", ru: 'Postman · отправьте запрос' })}</p>
            <PostmanOyna sorvlar={SORV_YOZ} pm={pm} />
            <DbTable rows={pm.rows} flashId={pm.flash} qisqa />
            <Tekshir b={A3_TEKSHIR} />
          </Col>
          <Col>
            <PromptKarta matn={a3Prompt()} />
            <QadamTugma b={A3_QADAM} />
            <KodOyna oxirgi={pm.oxirgi} nur={pm.nur} qatorlar={[<span key="n" className="sk-izoh">// cars: {pm.rows.length} {tr({ uz: 'qator', ru: 'строк' })}</span>]} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
