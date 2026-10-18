// ===== F-1015-348: 19 → 8 ekran. AvtoIjara backend: sxema — o'zingiz (psql) → server — Gemini (pool + 4 endpoint) → AI xatosi (price) =====
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
  { uz: "Ish stolida `avto-ijara-server` papkasini yarating, VS Code'da oching. Terminalda: `npm init -y` va `npm install express pg`.", ru: 'Создайте на рабочем столе папку `avto-ijara-server`, откройте в VS Code. В терминале: `npm init -y` и `npm install express pg`.' },
  { uz: "PostgreSQL ishlayotganini tekshiring: terminalda `psql -U postgres` ochiladimi? (SQL darsidagidek)", ru: 'Проверьте, что PostgreSQL работает: в терминале открывается `psql -U postgres`? (как на уроке SQL)' },
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
    <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">server.js · {tr({ uz: 'oxirgi so\'rov', ru: 'последний запрос' })}</span></div>
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
      <pre className="am-masalan">{kod}</pre>
    </div>
  );
};
// F-1015-352: m4-10 bilan bir xil mashinalar (m4-10 kirishi: «Praktika 1'da Postman orqali bazaga Chevrolet Spark'ni qo'shgan edingiz»)
const BK_BOSH = [{ id: 1, nom: 'Chevrolet Cobalt', narx: 280000, yil: 2022 }, { id: 2, nom: 'Chevrolet Malibu', narx: 520000, yil: 2023 }, { id: 3, nom: 'Kia K5', narx: 610000, yil: 2023 }];
const BLOK3 = [
  { t: { uz: 'cars jadvali', ru: 'Таблица cars' }, tag: { uz: "o'zingiz · psql", ru: 'сами · psql' } },
  { t: { uz: 'Server: pool + 4 endpoint', ru: 'Сервер: pool + 4 endpoint' }, tag: 'Gemini' },
  { t: { uz: 'AI xatosini topish', ru: 'Поиск ошибки AI' }, tag: { uz: 'siz', ru: 'Вы' } }
];
const ZANJIR = ['Postman', 'Express', 'pool.query', 'PostgreSQL'];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Mashinalar endi <span className="italic" style={{ color: T.accent }}>bazada</span> yashaydi.</>, ru: <>Теперь машины живут <span className="italic" style={{ color: T.accent }}>в базе</span>.</> })}</h2></div>
      <Mentor>{tr({ uz: <>Bugun AvtoIjara'ning orqa qismini qurasiz: <b style={{ color: T.ink }}>cars jadvali</b> PostgreSQL'da, <b style={{ color: T.ink }}>Express server</b> esa unga <span className="mono">pool.query</span> orqali so'rov yuboradi. Jadvalni o'zingiz yozasiz, serverni Gemini bilan.</>, ru: <>Сегодня строите серверную часть AvtoIjara: <b style={{ color: T.ink }}>таблица cars</b> в PostgreSQL, а <b style={{ color: T.ink }}>сервер Express</b> отправляет в неё запросы через <span className="mono">pool.query</span>. Таблицу напишете сами, сервер — с Gemini.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Dars oxirida · server javobi', ru: 'К концу урока · ответ сервера' })}</p>
          <Win title="Postman">
            <div className="bk-url"><MBadge m="GET" /><span>localhost:3000/api/cars</span></div>
            <Resp status={200} text="OK" json={JSON.stringify(BK_BOSH, null, 2)} />
          </Win>
        </Col>
        <Col>
          <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: 'Dars oxirida · server javobi', ru: 'К концу урока · ответ сервера' })}</p>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: "So'rov yo'li", ru: 'Путь запроса' })}</p>
            <div className="bk-zanjir">{ZANJIR.map((z, i) => <React.Fragment key={z}><code className="qcode">{z}</code>{i < ZANJIR.length - 1 && <span aria-hidden="true">→</span>}</React.Fragment>)}</div>
            <hr className="am-chiziq" />
            <p className="flow-label">{tr({ uz: `Bugungi ${BLOK3.length} blok`, ru: `${BLOK3.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{BLOK3.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== a1 — sxema (AI'siz): ustunlarni tanlash → CREATE TABLE + INSERT, psql'da bajarish =====
const USTUN = [
  { id: 'nom', tur: 'TEXT', t: { uz: 'nom — mashina nomi', ru: 'nom — название машины' }, shart: true },
  { id: 'narx', tur: 'INTEGER', t: { uz: "narx — kunlik narx, so'm", ru: 'narx — цена в день, сум' }, shart: true },
  { id: 'yil', tur: 'INTEGER', t: { uz: 'yil — ishlab chiqarilgan yili', ru: 'yil — год выпуска' } },
  { id: 'bandmi', tur: 'BOOLEAN', t: { uz: "bandmi — ijarada yoki bo'sh", ru: 'bandmi — в аренде или свободна' } }
];
const sxemaSql = (on) => {
  const cols = USTUN.filter(u => on.has(u.id));
  const ins = cols.filter(u => u.id !== 'bandmi');
  const val = (r) => ins.map(u => (u.id === 'nom' ? `'${r.nom}'` : r[u.id])).join(', ');
  return `CREATE TABLE cars (\n  id SERIAL PRIMARY KEY${cols.map(u => `,\n  ${u.id} ${u.tur}`).join('')}\n);\n\nINSERT INTO cars (${ins.map(u => u.id).join(', ')}) VALUES\n${BK_BOSH.map(r => `  (${val(r)})`).join(',\n')};\n\nSELECT * FROM cars;`;
};
const A1_QADAM = [
  { uz: "Terminalda: `psql -U postgres` (parol — PostgreSQL o'rnatilganda berilgan).", ru: 'В терминале: `psql -U postgres` (пароль — тот, что задали при установке PostgreSQL).' },
  { uz: "`CREATE DATABASE avtoijara;` keyin `\\c avtoijara` — bazaga ulanasiz.", ru: '`CREATE DATABASE avtoijara;` потом `\\c avtoijara` — подключаетесь к базе.' },
  { uz: "«Nusxalash» → SQL'ni psql'ga qo'ying, Enter.", ru: '«Скопировать» → вставьте SQL в psql, Enter.' },
  { uz: "Oxirgi `SELECT` 3 ta mashinani ko'rsatdimi?", ru: 'Последний `SELECT` показал 3 машины?' }
];
const ScreenSxema = ({ screen, onNext, onPrev }) => {
  const [on, setOn] = useState(() => new Set(['nom', 'narx']));
  const [xabar, setXabar] = useState('');
  const almash = (u) => {
    if (u.shart && on.has(u.id)) { setXabar(tr({ uz: `«${u.id}»siz mashinani ijaraga berib bo'lmaydi — bu ustun shart.`, ru: `Без «${u.id}» машину не сдать в аренду — эта колонка обязательна.` })); return; }
    setXabar(''); setOn(o => { const n = new Set(o); if (n.has(u.id)) n.delete(u.id); else n.add(u.id); return n; });
  };
  const sql = sxemaSql(on);
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot 1 · AI'siz", ru: 'Практика 1 · без AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>cars</span> jadvalini o'zingiz yozing.</>, ru: <>Напишите таблицу <span className="italic" style={{ color: T.accent }}>cars</span> сами.</> })}</h2></div>
        <Mentor>{tr({ uz: <>AI kod yozishidan oldin siz qaror qilasiz: mashina haqida nimani saqlaymiz? Ustunlarni tanlang — SQL o'zi yig'iladi. <span className="mono">id</span> har doim bor: u har mashinaning takrorlanmas raqami.</>, ru: <>Прежде чем AI напишет код, решаете Вы: что храним о машине? Выберите колонки — SQL соберётся сам. <span className="mono">id</span> есть всегда: это уникальный номер каждой машины.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: 'Ustunlar', ru: 'Колонки' })}</p>
            <div className="am-chips"><span className="am-chip on" aria-disabled="true">✓ id — SERIAL PRIMARY KEY</span>{USTUN.map(u => <button key={u.id} type="button" className={`am-chip ${on.has(u.id) ? 'on' : ''}`} aria-pressed={on.has(u.id)} onClick={() => almash(u)}>{on.has(u.id) ? '✓ ' : '+ '}{tr(u.t)}</button>)}</div>
            {xabar && <p key={xabar} className="ql-xabar xato" role="status">{xabar}</p>}
            <DbTable rows={BK_BOSH} />
          </Col>
          <Col>
            <KodNusxa yorliq={{ uz: 'SQL · psql uchun', ru: 'SQL · для psql' }} kod={sql} />
            <div className="am-karta">
              <p className="flow-label">{tr({ uz: 'Terminalda · psql', ru: 'В терминале · psql' })}</p>
              <ol className="am-qadam">{A1_QADAM.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
            </div>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a2 — Gemini: server.js (Pool + 4 endpoint, $1 $2); Postman maketida so'rov yuborib, jadval o'zgarishini ko'rish =====
const SORVLAR = [
  { m: 'GET', url: '/api/cars', sql: "pool.query('SELECT * FROM cars')" },
  { m: 'POST', url: '/api/cars', body: '{ "nom": "Chevrolet Spark", "narx": 190000, "yil": 2021 }', sql: "pool.query('INSERT INTO cars (nom, narx, yil) VALUES ($1, $2, $3) RETURNING *', [nom, narx, yil])" },
  { m: 'PUT', url: '/api/cars/2', body: '{ "narx": 480000 }', sql: "pool.query('UPDATE cars SET narx = $1 WHERE id = $2 RETURNING *', [narx, id])" },
  { m: 'DELETE', url: '/api/cars/1', sql: "pool.query('DELETE FROM cars WHERE id = $1', [id])" }
];
const a2Prompt = () => tr({
  uz: "Node.js + Express loyiham (avto-ijara-server) bor, express va pg o'rnatilgan. PostgreSQL'da avtoijara bazasida cars jadvali: id SERIAL, nom TEXT, narx INTEGER, yil INTEGER.\nserver.js yoz:\n1. pg'dan Pool bilan bazaga ulan (user, password, database: avtoijara — tepada o'zgaruvchilarda, parolni o'zim yozaman).\n2. app.use(express.json()).\n3. GET /api/cars — SELECT * FROM cars, natijani res.json bilan qaytar.\n4. POST /api/cars — req.body dan nom, narx, yil; INSERT ... VALUES ($1, $2, $3) RETURNING *, status 201.\n5. PUT /api/cars/:id — narxni yangilasin: UPDATE ... SET narx = $1 WHERE id = $2.\n6. DELETE /api/cars/:id — shu mashinani o'chirsin.\nQiymatlarni SQL matniga yopishtirma — faqat $1, $2 bilan. Xato bo'lsa status 500 va xato matnini qaytar. Port 3000.\nHar bo'limga qisqa izoh yoz. Faylni to'liq yoz.",
  ru: 'У меня есть проект Node.js + Express (avto-ijara-server), установлены express и pg. В PostgreSQL в базе avtoijara таблица cars: id SERIAL, nom TEXT, narx INTEGER, yil INTEGER.\nНапиши server.js:\n1. Подключись к базе через Pool из pg (user, password, database: avtoijara — в переменных вверху, пароль впишу сам).\n2. app.use(express.json()).\n3. GET /api/cars — SELECT * FROM cars, верни результат через res.json.\n4. POST /api/cars — из req.body nom, narx, yil; INSERT ... VALUES ($1, $2, $3) RETURNING *, статус 201.\n5. PUT /api/cars/:id — обновляет цену: UPDATE ... SET narx = $1 WHERE id = $2.\n6. DELETE /api/cars/:id — удаляет эту машину.\nНе вклеивай значения в текст SQL — только через $1, $2. При ошибке — статус 500 и текст ошибки. Порт 3000.\nК каждому разделу — короткий комментарий. Файл напиши целиком.'
});
const A2_QADAM = [
  { uz: "Chapda to'rt so'rovni yuboring — jadval qanday o'zgarishini ko'ring.", ru: 'Слева отправьте четыре запроса — посмотрите, как меняется таблица.' },
  { uz: "«Promptni nusxalash» → gemini.google.com; javobni `server.js` ga qo'ying, parolni yozing, `Ctrl+S`.", ru: '«Скопировать промпт» → gemini.google.com; ответ вставьте в `server.js`, впишите пароль, `Ctrl+S`.' },
  { uz: "Terminalda `node server.js`; brauzerda localhost:3000/api/cars — 3 ta mashina chiqdimi?", ru: 'В терминале `node server.js`; в браузере localhost:3000/api/cars — видны 3 машины?' },
  { uz: "POST, PUT va DELETE'ni Postman'da yuboring, keyin psql'da `SELECT * FROM cars;` bilan tekshiring.", ru: 'Отправьте POST, PUT и DELETE в Postman, потом проверьте в psql через `SELECT * FROM cars;`.' }
];
const ScreenServer = ({ screen, onNext, onPrev }) => {
  const [rows, setRows] = useState(BK_BOSH);
  const [tanlov, setTanlov] = useState(0);
  const [javob, setJavob] = useState(null);
  const [oxirgi, setOxirgi] = useState('');
  const [flash, setFlash] = useState(null);
  const s = SORVLAR[tanlov];
  const yubor = () => {
    let next = rows; let st = 200; let txt = 'OK'; let json; let fl = null;
    if (s.m === 'GET') json = JSON.stringify(rows, null, 2);
    if (s.m === 'POST') { const id = Math.max(0, ...rows.map(r => r.id)) + 1; const r = { id, nom: 'Chevrolet Spark', narx: 190000, yil: 2021 }; next = [...rows, r]; st = 201; txt = 'Created'; json = JSON.stringify(r, null, 2); fl = id; }
    if (s.m === 'PUT') { const r = rows.find(x => x.id === 2); if (r) { next = rows.map(x => (x.id === 2 ? { ...x, narx: 480000 } : x)); json = JSON.stringify({ ...r, narx: 480000 }, null, 2); fl = 2; } else { st = 404; txt = 'Not Found'; json = '{ "error": "topilmadi" }'; } }
    if (s.m === 'DELETE') { if (rows.some(x => x.id === 1)) { next = rows.filter(x => x.id !== 1); json = '{ "status": "o\'chirildi" }'; } else { st = 404; txt = 'Not Found'; json = '{ "error": "topilmadi" }'; } }
    setRows(next); setJavob({ st, txt, json }); setOxirgi(s.sql); setFlash(fl);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · Gemini', ru: 'Практика 2 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Serverni <span className="italic" style={{ color: T.accent }}>Gemini</span> bilan yozing.</>, ru: <>Напишите сервер вместе с <span className="italic" style={{ color: T.accent }}>Gemini</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har endpoint — bitta method va bitta manzil: ichida <span className="mono">pool.query</span> SQL'ni bazaga olib boradi. Qiymatlar matnga yopishtirilmaydi — <span className="mono">$1, $2</span> bilan beriladi. So'rovlarni yuborib ko'ring.</>, ru: <>Каждый endpoint — один метод и один адрес: внутри <span className="mono">pool.query</span> несёт SQL в базу. Значения не вклеиваются в текст — передаются через <span className="mono">$1, $2</span>. Отправьте запросы.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Postman · so'rov yuboring", ru: 'Postman · отправьте запрос' })}</p>
            <Win title="Postman">
              <div className="am-chips">{SORVLAR.map((x, i) => <button key={x.m} type="button" className={`am-chip ${tanlov === i ? 'on' : ''}`} aria-pressed={tanlov === i} onClick={() => { setTanlov(i); setJavob(null); }}>{x.m}</button>)}</div>
              <div className="bk-url"><MBadge m={s.m} /><span>localhost:3000{s.url}</span><button type="button" className="am-saqla bk-send" onClick={yubor}>Send</button></div>
              {s.body && <pre className="am-masalan bk-body">{s.body}</pre>}
              {javob && <Resp status={javob.st} text={javob.txt} json={javob.json} />}
            </Win>
            <DbTable rows={rows} flashId={flash} />
            <KodOyna oxirgi={oxirgi} qatorlar={[<span key="n" className="sk-izoh">// cars: {rows.length} {tr({ uz: 'qator', ru: 'строк' })}</span>]} />
          </Col>
          <Col>
            <PromptBlok matn={a2Prompt()} />
            <QadamTugma b={A2_QADAM} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
