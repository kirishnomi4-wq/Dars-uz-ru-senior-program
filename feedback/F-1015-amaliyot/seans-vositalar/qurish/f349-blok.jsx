// ===== F-1015-349: 20 → 8 ekran. Front (m3-12) ↔ back (m4-08): manzil — o'zingiz → CORS (eski s10) → maydonlar, 3 holat, forma — Gemini =====
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
  { uz: "1-terminal: `cd avto-ijara-server` va `node server.js` — server :3000 da ishlasin (o'tgan praktikadagi).", ru: '1-й терминал: `cd avto-ijara-server` и `node server.js` — сервер работает на :3000 (с прошлой практики).' },
  { uz: "2-terminal: `cd avto-ijara` va `npm run dev` — sayt :5173 da (3-moduldagi AvtoIjara).", ru: '2-й терминал: `cd avto-ijara` и `npm run dev` — сайт на :5173 (AvtoIjara из 3-го модуля).' },
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
    <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">avto-ijara · {tr({ uz: 'oxirgi so\'rov', ru: 'последний запрос' })}</span></div>
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
const API = 'http://localhost:3000/api/cars';
const BLOK3 = [
  { t: { uz: 'Saytni serverga ulash', ru: 'Подключить сайт к серверу' }, tag: { uz: "o'zingiz", ru: 'сами' } },
  { t: { uz: 'CORS xatosini tuzatish', ru: 'Исправить ошибку CORS' }, tag: { uz: "o'zingiz", ru: 'сами' } },
  { t: { uz: "Maydonlar, 3 holat va forma", ru: 'Поля, 3 состояния и форма' }, tag: 'Gemini' }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sayt va server <span className="italic" style={{ color: T.accent }}>gaplashadi</span>.</>, ru: <>Сайт и сервер <span className="italic" style={{ color: T.accent }}>разговаривают</span>.</> })}</h2></div>
      <Mentor>{tr({ uz: <>Sizda ikki yarim bor: 3-moduldagi <b style={{ color: T.ink }}>AvtoIjara sayti</b> (:5173) va o'tgan praktikadagi <b style={{ color: T.ink }}>server</b> (:3000). Bugun sayt mashinalarni <span className="mono">cars.json</span> dan emas, serverdan oladi — bazaga qo'shilgan mashina darrov saytda chiqadi.</>, ru: <>У Вас две половины: <b style={{ color: T.ink }}>сайт AvtoIjara</b> из 3-го модуля (:5173) и <b style={{ color: T.ink }}>сервер</b> с прошлой практики (:3000). Сегодня сайт берёт машины не из <span className="mono">cars.json</span>, а с сервера — машина, добавленная в базу, сразу появится на сайте.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Dars oxirida · sayt serverdan', ru: 'К концу урока · сайт с сервера' })}</p>
          <AvtoSite cars={CARS_DB} newId={SPARK.id} cols={2} />
        </Col>
        <Col>
          <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: 'Dars oxirida · sayt serverdan', ru: 'К концу урока · сайт с сервера' })}</p>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: 'Ikki dastur', ru: 'Две программы' })}</p>
            <ul className="cr-jadval">
              <li><code className="qcode">:5173</code><span>{tr({ uz: "sayt (front) — so'raydi", ru: 'сайт (фронт) — спрашивает' })}</span></li>
              <li><code className="qcode">:3000</code><span>{tr({ uz: 'server (back) — javob beradi', ru: 'сервер (бэк) — отвечает' })}</span></li>
            </ul>
            <hr className="am-chiziq" />
            <p className="flow-label">{tr({ uz: `Bugungi ${BLOK3.length} blok`, ru: `${BLOK3.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{BLOK3.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== a1 — AI'siz: ikki dasturni yoqish va fetch manzilini serverga almashtirish (natija — CORS xatosi, keyingi qadamda tuzatiladi) =====
const A1_QADAM = [
  { uz: "1-terminalda server, 2-terminalda sayt ishlab tursin (yuqoridagi «Avval tayyorlaning»).", ru: 'В 1-м терминале работает сервер, во 2-м — сайт («Сначала подготовьтесь» выше).' },
  { uz: "`src/pages/Home.jsx` da `fetch('/cars.json')` qatorini toping.", ru: 'В `src/pages/Home.jsx` найдите строку `fetch(\'/cars.json\')`.' },
  { uz: "Uni yangi qator bilan almashtiring (nusxalang), `Ctrl+S`.", ru: 'Замените её новой строкой (скопируйте), `Ctrl+S`.' },
  { uz: "Brauzerda F12 → Console: qizil xato chiqdimi? Bu — CORS, keyingi qadamda tuzatamiz.", ru: 'В браузере F12 → Console: появилась красная ошибка? Это CORS, исправим на следующем шаге.' }
];
const ScreenUlash = ({ screen, onNext, onPrev }) => {
  const [qadam, setQadam] = useState(0); // 0 eski, 1 manzil almashdi (CORS)
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot 1 · AI'siz", ru: 'Практика 1 · без AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Saytni <span className="italic" style={{ color: T.accent }}>serverga</span> ulang.</>, ru: <>Подключите сайт <span className="italic" style={{ color: T.accent }}>к серверу</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Ulanish — bitta qator: <span className="mono">fetch</span> endi faylni emas, server manzilini so'raydi. Almashtirib ko'ring — birinchi urinishda brauzer so'rovni to'sib qo'yadi. Bu normal: har dasturchi ko'radigan birinchi xato.</>, ru: <>Подключение — одна строка: <span className="mono">fetch</span> теперь запрашивает не файл, а адрес сервера. Замените — с первого раза браузер заблокирует запрос. Это нормально: первая ошибка, которую видит каждый разработчик.</> })}</Mentor>
        <Split>
          <Col>
            <div className="rj-oyna">
              <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">Terminal</span></div>
              <div className="rj-body">
                <TLine cmd="node server.js" /><TLine out={tr({ uz: 'Server :3000 da ishlayapti', ru: 'Сервер работает на :3000' })} />
                <TLine cmd="npm run dev" /><TLine out="➜ Local: http://localhost:5173/" />
              </div>
            </div>
            <div className="am-chips"><button type="button" className={`am-chip ${qadam === 0 ? 'on' : ''}`} aria-pressed={qadam === 0} onClick={() => setQadam(0)}>fetch('/cars.json')</button><button type="button" className={`am-chip ${qadam === 1 ? 'on' : ''}`} aria-pressed={qadam === 1} onClick={() => setQadam(1)}>{`fetch('${API}')`}</button></div>
            {qadam === 0 ? <AvtoSite cars={CARS} cols={2} /> : <><AvtoSite state="error" cols={2} /><Konsol error>{`Access to fetch at '${API}' from origin 'http://localhost:5173' has been blocked by CORS policy`}</Konsol></>}
            {qadam === 0 && <p className="am-satr">{tr({ uz: "Hozir sayt eski fayldan o'qiydi — bazadagi Chevrolet Spark yo'q.", ru: 'Сейчас сайт читает старый файл — Chevrolet Spark из базы нет.' })}</p>}
          </Col>
          <Col>
            <KodNusxa yorliq={{ uz: 'Yangi qator · Home.jsx', ru: 'Новая строка · Home.jsx' }} kod={`fetch('${API}')`} />
            <div className="am-karta">
              <p className="flow-label">{tr({ uz: "VS Code'da", ru: 'В VS Code' })}</p>
              <ol className="am-qadam">{A1_QADAM.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
            </div>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a3 — Gemini: server maydonlari (nom, narx, yil), 3 holat va POST forma =====
const a3Prompt = () => tr({
  uz: `AvtoIjara saytimni (React, avto-ijara) serverga to'liq ula. Server ${API} mashinalarni { id, nom, narx, yil } ko'rinishida qaytaradi (cars.json'dagi name/price emas).\n1. Kartochkalar va mashina sahifasi shu maydonlarni ko'rsatsin: nom, narx (so'm/kun), yil.\n2. Uch holat: yuklanayotganda «Yuklanmoqda...», server javob bermasa «Ma'lumotni yuklab bo'lmadi», aks holda ro'yxat.\n3. Bosh sahifaga forma: nom, narx, yil. «Qo'shish» bosilganda POST ${API} ga JSON yuborsin (Content-Type: application/json), keyin ro'yxatni qayta fetch qilsin.\nHar bo'limga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.\nMana kodim:\n{Home.jsx va mashina sahifasi kodini shu yerga qo'ying}`,
  ru: `Полностью подключи мой сайт AvtoIjara (React, avto-ijara) к серверу. Сервер ${API} возвращает машины в виде { id, nom, narx, yil } (не name/price, как в cars.json).\n1. Карточки и страница машины показывают эти поля: nom, narx (сум/день), yil.\n2. Три состояния: во время загрузки «Загрузка...», если сервер не отвечает — «Не удалось загрузить данные», иначе — список.\n3. На главную — форма: nom, narx, yil. По нажатию «Добавить» отправляет JSON на POST ${API} (Content-Type: application/json), потом заново делает fetch списка.\nК каждому разделу — короткий комментарий. Измененные файлы верни целиком.\nВот мой код:\n{вставьте сюда код Home.jsx и страницы машины}`
});
const A3_QADAM = [
  { uz: "Chapda holatlarni almashtiring va forma bilan mashina qo'shing — kod oynasida POST'ni ko'ring.", ru: 'Слева переключайте состояния и добавьте машину формой — в окне кода видно POST.' },
  { uz: "«Promptni nusxalash» → gemini.google.com, oxiriga `Home.jsx` va mashina sahifasi kodini qo'shing.", ru: '«Скопировать промпт» → gemini.google.com, в конце добавьте код `Home.jsx` и страницы машины.' },
  { uz: "Javobdagi fayllarni almashtiring, `Ctrl+S`.", ru: 'Замените файлы на файлы из ответа, `Ctrl+S`.' },
  { uz: "«Tekshiring» ro'yxatini o'ting.", ru: 'Пройдите список «Проверьте».' }
];
const A3_TEKSHIR = [
  { uz: "Kartochkalarda nom, narx va yil ko'rinadimi (undefined emas)?", ru: 'На карточках видны nom, narx и yil (не undefined)?' },
  { uz: "Serverni to'xtatib (Ctrl+C) saytni yangilang — «yuklab bo'lmadi» chiqadimi?", ru: 'Остановите сервер (Ctrl+C) и обновите сайт — появляется «не удалось загрузить»?' },
  { uz: "Forma bilan qo'shilgan mashina F5 dan keyin ham turibdimi?", ru: 'Машина, добавленная формой, остаётся после F5?' },
  { uz: "psql'da `SELECT * FROM cars;` — yangi qator bormi?", ru: 'В psql `SELECT * FROM cars;` — новая строка есть?' }
];
const ScreenForma = ({ screen, onNext, onPrev }) => {
  const [rows, setRows] = useState(CARS_DB);
  const [holat, setHolat] = useState('data');
  const [nom, setNom] = useState('');
  const [narx, setNarx] = useState('');
  const [oxirgi, setOxirgi] = useState(`fetch('${API}')`);
  const [yangi, setYangi] = useState(null);
  const ok = nom.trim() && /^\d+$/.test(narx.trim());
  const qosh = () => { if (!ok) return; const id = Math.max(...rows.map(r => r.id)) + 1; const c = { ...TRACKER, id, nom: nom.trim(), narx: Number(narx.trim()), yil: 2024 }; setRows(r => [...r, c]); setYangi(id); setHolat('data'); setOxirgi(`fetch('${API}', { method: 'POST', body: JSON.stringify({ nom: "${c.nom}", narx: ${c.narx}, yil: 2024 }) })`); setNom(''); setNarx(''); };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 3 · Gemini', ru: 'Практика 3 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Maydonlar, holatlar va <span className="italic" style={{ color: T.accent }}>forma</span>.</>, ru: <>Поля, состояния и <span className="italic" style={{ color: T.accent }}>форма</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Ulandi — lekin server mashinani <span className="mono">nom, narx, yil</span> deb qaytaradi, sayt esa <span className="mono">name, price</span> ni kutadi: kartochkalarda «undefined» chiqadi. Gemini'ga uchta ishni bering: maydonlarni moslash, uch holat va qo'shish formasi.</>, ru: <>Подключено — но сервер отдаёт машину как <span className="mono">nom, narx, yil</span>, а сайт ждёт <span className="mono">name, price</span>: на карточках появится «undefined». Дайте Gemini три задачи: согласовать поля, три состояния и форму добавления.</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-chips">{[['loading', { uz: 'Yuklanmoqda', ru: 'Загрузка' }], ['error', { uz: 'Xato', ru: 'Ошибка' }], ['data', { uz: 'Tayyor', ru: 'Готово' }]].map(([k, t]) => <button key={k} type="button" className={`am-chip ${holat === k ? 'on' : ''}`} aria-pressed={holat === k} onClick={() => setHolat(k)}>{tr(t)}</button>)}</div>
            <AvtoSite cars={rows} state={holat} newId={yangi} cols={2} />
            <div className="am-karta fs-forma">
              <label className="am-maydon"><span>nom</span><input className="am-input" value={nom} onChange={e => setNom(e.target.value)} placeholder="Chevrolet Tracker" /></label>
              <label className="am-maydon"><span>narx</span><input className="am-input" value={narx} onChange={e => setNarx(e.target.value)} placeholder="450000" inputMode="numeric" /></label>
              <button type="button" className="am-saqla" disabled={!ok} onClick={qosh}>{tr({ uz: "Qo'shish", ru: 'Добавить' })}</button>
            </div>
            <KodOyna oxirgi={oxirgi} qatorlar={[<span key="n" className="sk-izoh">// cars.length = {rows.length}</span>]} />
          </Col>
          <Col>
            <PromptBlok matn={a3Prompt()} />
            <div className="am-karta">
              <p className="flow-label">{tr({ uz: 'Tekshiring', ru: 'Проверьте' })}</p>
              <ul className="am-band">{A3_TEKSHIR.map((x, i) => <li key={i}>{fmtCode(tr(x))}</li>)}</ul>
            </div>
            <QadamTugma b={A3_QADAM} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
