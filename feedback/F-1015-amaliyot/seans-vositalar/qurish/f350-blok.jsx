// ===== F-1015-350: 25 → 9 ekran. AvtoStoyanka: baza (2 jadval) — o'zingiz → server — Gemini → qorovul paneli — Gemini → JOIN (eski s12) =====
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
  { uz: "Ikki papka: `avto-stoyanka-server` (`npm init -y`, `npm install express pg cors`) va `avto-stoyanka` (`npm create vite@latest avto-stoyanka`, React).", ru: 'Две папки: `avto-stoyanka-server` (`npm init -y`, `npm install express pg cors`) и `avto-stoyanka` (`npm create vite@latest avto-stoyanka`, React).' },
  { uz: "PostgreSQL ishlayotganini tekshiring: `psql -U postgres` ochiladimi?", ru: 'Проверьте, что PostgreSQL работает: открывается `psql -U postgres`?' },
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
    <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">avto-stoyanka · {tr({ uz: 'oxirgi amal', ru: 'последнее действие' })}</span></div>
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
const BLOK4 = [
  { t: { uz: 'Baza: 2 jadval', ru: 'База: 2 таблицы' }, tag: { uz: "o'zingiz · psql", ru: 'сами · psql' } },
  { t: { uz: 'Server: kirish va chiqish', ru: 'Сервер: въезд и выезд' }, tag: 'Gemini' },
  { t: { uz: 'Qorovul paneli', ru: 'Панель охранника' }, tag: 'Gemini' },
  { t: { uz: 'Tarix: JOIN', ru: 'История: JOIN' }, tag: { uz: "o'zingiz", ru: 'сами' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qorovul uchun <span className="italic" style={{ color: T.accent }}>stoyanka paneli</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Панель стоянки</span> для охранника.</> })}</h2></div>
      <Mentor>{tr({ uz: <>Loyiha kuni: AvtoIjara'da o'rganganingizni yangi loyihada qo'llaysiz. Qorovul bir qarashda ko'rishi kerak: qaysi joy bo'sh, qaysi band va bugun qancha pul yig'ildi. <b style={{ color: T.ink }}>Baza, server va panel</b> — hammasini bugun yig'asiz.</>, ru: <>Проектный день: применяете изученное на AvtoIjara в новом проекте. Охранник должен с одного взгляда видеть: какое место свободно, какое занято и сколько денег собрано сегодня. <b style={{ color: T.ink }}>База, сервер и панель</b> — всё соберёте сегодня.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Dars oxirida · qorovul paneli', ru: 'К концу урока · панель охранника' })}</p>
          <GuardPanel spots={mkSpots()} tushum={30000} />
        </Col>
        <Col>
          <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: 'Dars oxirida · qorovul paneli', ru: 'К концу урока · панель охранника' })}</p>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: "Ikki jadval — bitta bog'lanish", ru: 'Две таблицы — одна связь' })}</p>
            <ul className="cr-jadval">
              <li><code className="qcode">joylar</code><span>{tr({ uz: 'A1…B4, bo\'sh yoki band', ru: 'A1…B4, свободно или занято' })}</span></li>
              <li><code className="qcode">sessiyalar</code><span>{tr({ uz: 'kim, qachon, qancha — joy_id orqali', ru: 'кто, когда, сколько — через joy_id' })}</span></li>
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

// ===== a1 — baza (AI'siz): joylar + sessiyalar (joy_id → joylar.id), joyni bosganda uning sessiyalari =====
const BAZA_SQL = `CREATE TABLE joylar (
  id SERIAL PRIMARY KEY,
  raqam TEXT,
  bandmi BOOLEAN DEFAULT false
);

CREATE TABLE sessiyalar (
  id SERIAL PRIMARY KEY,
  joy_id INTEGER REFERENCES joylar(id),
  mashina TEXT,
  kirgan TIMESTAMP DEFAULT now(),
  chiqqan TIMESTAMP,
  tolov INTEGER
);

INSERT INTO joylar (raqam) VALUES
  ('A1'), ('A2'), ('A3'), ('A4'), ('B1'), ('B2'), ('B3'), ('B4');

SELECT * FROM joylar;`;
const A1_QADAM = [
  { uz: "Terminalda: `psql -U postgres`, keyin `CREATE DATABASE stoyanka;` va `\\c stoyanka`.", ru: 'В терминале: `psql -U postgres`, потом `CREATE DATABASE stoyanka;` и `\\c stoyanka`.' },
  { uz: "«Nusxalash» → SQL'ni psql'ga qo'ying, Enter.", ru: '«Скопировать» → вставьте SQL в psql, Enter.' },
  { uz: "Oxirgi `SELECT` 8 ta joyni ko'rsatdimi?", ru: 'Последний `SELECT` показал 8 мест?' },
  { uz: "Sinab ko'ring: `INSERT INTO sessiyalar (joy_id, mashina) VALUES (99, 'X');` — baza rad etadimi? (99-joy yo'q)", ru: 'Проверьте: `INSERT INTO sessiyalar (joy_id, mashina) VALUES (99, \'X\');` — база отказывает? (места 99 нет)' }
];
const ScreenBaza = ({ screen, onNext, onPrev }) => {
  const spots = useMemo(() => mkSpots(), []);
  const [sel, setSel] = useState(2);
  const s = spots.find(x => x.id === sel);
  const ses = SES_DATA.filter(x => x.joy_id === sel);
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot 1 · AI'siz", ru: 'Практика 1 · без AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bazani — <span className="italic" style={{ color: T.accent }}>ikki jadvalni</span> — yozing.</>, ru: <>Напишите базу — <span className="italic" style={{ color: T.accent }}>две таблицы</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bitta joyda kun bo'yi ko'p mashina turadi — bu «bitta → ko'p». <span className="mono">sessiyalar.joy_id</span> har yozuvni o'z joyiga bog'laydi (<span className="mono">REFERENCES joylar(id)</span>). Joyni bosing — uning sessiyalari chiqadi.</>, ru: <>На одном месте за день стоит много машин — это «один → много». <span className="mono">sessiyalar.joy_id</span> связывает каждую запись с её местом (<span className="mono">REFERENCES joylar(id)</span>). Нажмите на место — появятся его сессии.</> })}</Mentor>
        <Split>
          <Col>
            <GuardPanel spots={spots} onSpotClick={(x) => setSel(x.id)} selectedId={sel} />
            <Table cap="sessiyalar" cols={['id', 'joy_id', 'mashina', 'tolov']} rows={SES_DATA} hi={(r) => r.joy_id === sel} hiCol="joy_id" />
            <KodOyna oxirgi={`SELECT * FROM sessiyalar WHERE joy_id = ${sel};`} qatorlar={[<span key="r" className="sk-izoh">{`// ${s.raqam} (id ${sel}) — ${ses.length} ${tr({ uz: 'ta sessiya', ru: 'сессий' })}`}</span>]} />
          </Col>
          <Col>
            <KodNusxa yorliq={{ uz: 'SQL · psql uchun', ru: 'SQL · для psql' }} kod={BAZA_SQL} />
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

// ===== a2 — Gemini: server (GET joylar, POST kirish, PUT chiqish, GET tushum); panelda bosib, SQL'ni ko'rish =====
const a2Prompt = () => tr({
  uz: "Node.js + Express loyiham (avto-stoyanka-server): express, pg va cors o'rnatilgan. PostgreSQL'da stoyanka bazasi: joylar (id, raqam, bandmi) va sessiyalar (id, joy_id → joylar.id, mashina, kirgan, chiqqan, tolov).\nserver.js yoz (Pool, express.json, cors, port 3000):\n1. GET /api/joylar — hamma joylar, id tartibida.\n2. POST /api/kirish — body: { joy_id, mashina }. Joy bandmi = true bo'lsin va sessiyalarga yangi qator qo'shilsin.\n3. PUT /api/chiqish/:joy_id — joy bandmi = false; shu joyning ochiq sessiyasiga (chiqqan IS NULL) chiqqan = now() va tolov = 10000 yozilsin.\n4. GET /api/tushum — bugungi tolov yig'indisi (SUM).\nQiymatlar faqat $1, $2 bilan. Xato bo'lsa status 500. Har bo'limga qisqa izoh yoz. Faylni to'liq yoz.",
  ru: 'Мой проект Node.js + Express (avto-stoyanka-server): установлены express, pg и cors. В PostgreSQL база stoyanka: joylar (id, raqam, bandmi) и sessiyalar (id, joy_id → joylar.id, mashina, kirgan, chiqqan, tolov).\nНапиши server.js (Pool, express.json, cors, порт 3000):\n1. GET /api/joylar — все места по порядку id.\n2. POST /api/kirish — body: { joy_id, mashina }. Место bandmi = true и новая строка в sessiyalar.\n3. PUT /api/chiqish/:joy_id — место bandmi = false; в открытую сессию этого места (chiqqan IS NULL) записать chiqqan = now() и tolov = 10000.\n4. GET /api/tushum — сумма tolov за сегодня (SUM).\nЗначения — только через $1, $2. При ошибке статус 500. К каждому разделу — короткий комментарий. Файл напиши целиком.'
});
const A2_QADAM = [
  { uz: "Chapda bo'sh joyni bosing (kirish), keyin band joyni (chiqish) — kod oynasida ikkala SQL'ni ko'ring.", ru: 'Слева нажмите свободное место (въезд), потом занятое (выезд) — в окне кода оба SQL.' },
  { uz: "«Promptni nusxalash» → gemini.google.com; javobni `server.js` ga qo'ying, parolni yozing, `Ctrl+S`.", ru: '«Скопировать промпт» → gemini.google.com; ответ вставьте в `server.js`, впишите пароль, `Ctrl+S`.' },
  { uz: "`node server.js`; brauzerda localhost:3000/api/joylar — 8 ta joy chiqdimi?", ru: '`node server.js`; в браузере localhost:3000/api/joylar — видны 8 мест?' },
  { uz: "Postman'da POST /api/kirish va PUT /api/chiqish/2 ni yuboring, keyin /api/tushum ni oching.", ru: 'В Postman отправьте POST /api/kirish и PUT /api/chiqish/2, потом откройте /api/tushum.' }
];
const ScreenStServer = ({ screen, onNext, onPrev }) => {
  const [spots, setSpots] = useState(() => mkSpots());
  const [tushum, setTushum] = useState(0);
  const [oxirgi, setOxirgi] = useState('');
  const [ikkinchi, setIkkinchi] = useState('');
  const [flash, setFlash] = useState(null);
  const RAQAM = ['10A777AA', '01Z555ZZ', '40M222MM', '25T888TT'];
  const bos = (x) => {
    if (!x.bandmi) { const m = RAQAM[spots.filter(z => z.bandmi).length % RAQAM.length]; setSpots(a => a.map(z => (z.id === x.id ? { ...z, bandmi: true, mashina: m } : z))); setOxirgi(`UPDATE joylar SET bandmi = true WHERE id = ${x.id};`); setIkkinchi(`INSERT INTO sessiyalar (joy_id, mashina) VALUES (${x.id}, '${m}');`); }
    else { setSpots(a => a.map(z => (z.id === x.id ? { ...z, bandmi: false, mashina: null } : z))); setTushum(t => t + FEE); setOxirgi(`UPDATE joylar SET bandmi = false WHERE id = ${x.id};`); setIkkinchi(`UPDATE sessiyalar SET chiqqan = now(), tolov = ${FEE} WHERE joy_id = ${x.id} AND chiqqan IS NULL;`); }
    setFlash(x.id);
  };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · Gemini', ru: 'Практика 2 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Server: <span className="italic" style={{ color: T.accent }}>kirish va chiqish</span>.</>, ru: <>Сервер: <span className="italic" style={{ color: T.accent }}>въезд и выезд</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har amal ikki jadvalga tegadi: kirishda joy band bo'ladi va yangi sessiya yoziladi, chiqishda joy bo'shaydi va sessiyaga to'lov yoziladi. Joylarni bosing — kod oynasida ikkala SQL'ni ko'rasiz.</>, ru: <>Каждое действие трогает обе таблицы: при въезде место занимается и пишется новая сессия, при выезде место освобождается и в сессию пишется оплата. Нажимайте места — в окне кода оба SQL.</> })}</Mentor>
        <Split>
          <Col>
            <GuardPanel spots={spots} onSpotClick={bos} tushum={tushum} flashId={flash} />
            <KodOyna oxirgi={oxirgi} qatorlar={ikkinchi ? [<span key="i">{ikkinchi}</span>] : []} />
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

// ===== a3 — Gemini: qorovul paneli (front) — fetch, kirgizish formasi, chiqarish, tushum =====
const a3Prompt = () => tr({
  uz: "Vite + React loyiham (avto-stoyanka) uchun qorovul paneli qur. Server: http://localhost:3000.\n1. Sahifa ochilganda GET /api/joylar va GET /api/tushum ni fetch qilsin.\n2. Joylar to'ri: har joy katta kartochka — bo'sh bo'lsa yashil «BO'SH», band bo'lsa qizil «BAND» va mashina raqami.\n3. Bo'sh joy bosilsa — mashina raqami yoziladigan kichik forma; «Kirgizish» POST /api/kirish ga { joy_id, mashina } yuborsin.\n4. Band joy bosilsa — «Chiqarish» tugmasi; PUT /api/chiqish/:joy_id.\n5. Har amaldan keyin joylar va tushum qayta yuklansin. Tepada: bo'sh va band soni, bugungi tushum.\nQorovul uchun: katta yozuv, kam matn, rang bilan tushunarli. Har bo'limga qisqa izoh yoz. Barcha fayllarni to'liq yoz.",
  ru: 'Сделай панель охранника для моего проекта Vite + React (avto-stoyanka). Сервер: http://localhost:3000.\n1. При открытии страницы делает fetch GET /api/joylar и GET /api/tushum.\n2. Сетка мест: каждое место — крупная карточка; свободное — зелёное «СВОБОДНО», занятое — красное «ЗАНЯТО» и госномер.\n3. По нажатию на свободное место — маленькая форма для госномера; «Впустить» отправляет { joy_id, mashina } на POST /api/kirish.\n4. По нажатию на занятое — кнопка «Выпустить»; PUT /api/chiqish/:joy_id.\n5. После каждого действия места и выручка загружаются заново. Вверху: число свободных и занятых, выручка за сегодня.\nДля охранника: крупный текст, мало слов, понятно по цвету. К каждому разделу — короткий комментарий. Все файлы напиши целиком.'
});
const A3_QADAM = [
  { uz: "Chapdagi panelda mashina kirgizing va chiqaring — qorovul ko'radigan hamma narsa shu.", ru: 'На панели слева впустите и выпустите машину — это всё, что видит охранник.' },
  { uz: "«Promptni nusxalash» → gemini.google.com; fayllarni `avto-stoyanka/src` ga qo'ying, `npm run dev`.", ru: '«Скопировать промпт» → gemini.google.com; файлы положите в `avto-stoyanka/src`, `npm run dev`.' },
  { uz: "Server ham ishlab turishi kerak (`node server.js`) — CORS'ni eslang.", ru: 'Сервер тоже должен работать (`node server.js`) — помните про CORS.' },
  { uz: "Mashina kirgizib-chiqaring: rang, soni va tushum o'zgaradimi? F5 dan keyin ham saqlanadimi?", ru: 'Впустите и выпустите машину: меняются цвет, счётчики и выручка? Сохраняется после F5?' }
];
const ScreenStPanel = ({ screen, onNext, onPrev }) => {
  const [spots, setSpots] = useState(() => mkSpots());
  const [tushum, setTushum] = useState(20000);
  const [tanlangan, setTanlangan] = useState(null);
  const [raqam, setRaqam] = useState('');
  const [oxirgi, setOxirgi] = useState("fetch('http://localhost:3000/api/joylar')");
  const t = spots.find(x => x.id === tanlangan);
  const kirgiz = () => { const m = raqam.trim().toUpperCase(); if (!m || !t) return; setSpots(a => a.map(z => (z.id === t.id ? { ...z, bandmi: true, mashina: m } : z))); setOxirgi(`fetch('/api/kirish', { method: 'POST', body: JSON.stringify({ joy_id: ${t.id}, mashina: "${m}" }) })`); setRaqam(''); setTanlangan(null); };
  const chiqar = () => { if (!t) return; setSpots(a => a.map(z => (z.id === t.id ? { ...z, bandmi: false, mashina: null } : z))); setTushum(x => x + FEE); setOxirgi(`fetch('/api/chiqish/${t.id}', { method: 'PUT' })`); setTanlangan(null); };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 3 · Gemini', ru: 'Практика 3 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qorovul <span className="italic" style={{ color: T.accent }}>paneli</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Панель</span> охранника.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Qorovul kod ko'rmaydi — unga katta, rangli panel kerak. Bo'sh joyni bosing va mashina raqamini yozing, band joyni bosib chiqaring: panel serverga <span className="mono">fetch</span> yuboradi va qayta yuklanadi.</>, ru: <>Охранник не видит код — ему нужна крупная цветная панель. Нажмите свободное место и впишите госномер, нажмите занятое и выпустите: панель отправляет <span className="mono">fetch</span> на сервер и перезагружается.</> })}</Mentor>
        <Split>
          <Col>
            <GuardPanel spots={spots} onSpotClick={(x) => { setTanlangan(x.id); setRaqam(''); }} tushum={tushum} selectedId={tanlangan} />
            {t && !t.bandmi && <div className="am-karta fs-forma am-ochil"><label className="am-maydon"><span>{tr({ uz: `${t.raqam} · mashina raqami`, ru: `${t.raqam} · госномер` })}</span><input className="am-input" value={raqam} onChange={e => setRaqam(e.target.value)} placeholder="01A123BC" /></label><button type="button" className="am-saqla" disabled={!raqam.trim()} onClick={kirgiz}>{tr({ uz: 'Kirgizish', ru: 'Впустить' })}</button></div>}
            {t && t.bandmi && <div className="am-karta fs-forma am-ochil"><p className="am-satr" style={{ flex: 1 }}>{t.raqam} · {t.mashina}</p><button type="button" className="am-saqla" onClick={chiqar}>{tr({ uz: `Chiqarish · ${sp(FEE)} so'm`, ru: `Выпустить · ${sp(FEE)} сум` })}</button></div>}
            <KodOyna oxirgi={oxirgi} qatorlar={[<span key="s" className="sk-izoh">{`// bo'sh: ${spots.filter(x => !x.bandmi).length}, band: ${spots.filter(x => x.bandmi).length}, tushum: ${tushum}`}</span>]} />
          </Col>
          <Col>
            <PromptBlok matn={a3Prompt()} />
            <QadamTugma b={A3_QADAM} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
