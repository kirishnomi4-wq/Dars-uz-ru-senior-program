// ===== F-1015-344: 22 → 8 ekran. Ip — robo-games (m3-03…m3-06): GameCard + games ro'yxati. Qo'shish — o'zingiz (VS Code), TOP va o'chirish — Gemini =====
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
  { uz: "VS Code'da `robo-games` papkasini oching, terminalda `npm run dev` — localhost:5173 da o'yin kartochkalari chiqadimi?", ru: 'Откройте в VS Code папку `robo-games`, в терминале `npm run dev` — на localhost:5173 видны карточки игр?' },
  { uz: "`App.jsx` va `GameCard.jsx` fayllarini oching — bugun shu ikkalasida ishlaysiz.", ru: 'Откройте файлы `App.jsx` и `GameCard.jsx` — сегодня работаете в них.' },
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
const nomlar = (list) => `games = [${list.map(g => `"${g.name}"`).join(', ')}];`;
// Uchala amal ishlaydigan ilova (reja ekranidagi namuna)
const CrudNamuna = () => {
  const [list, setList] = useState(() => GAMES.slice(0, 3));
  const qolgan = POOL.filter(p => !list.some(g => g.id === p.id));
  return (
    <Win title={tr({ uz: 'robo-games — localhost:5173', ru: 'robo-games — localhost:5173' })} minH={120}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span className="cr-son">{tr({ uz: `${list.length} ta o'yin`, ru: `Игр: ${list.length}` })}</span>
        <AddBtn small disabled={!qolgan.length} onClick={() => qolgan.length && setList(l => [...l, qolgan[0]])} />
      </div>
      <CardGrid cols={3}>{list.map(g => <MyCard key={g.id} game={g} onTop={() => setList(l => l.map(x => (x.id === g.id ? { ...x, top: !x.top } : x)))} onDelete={() => setList(l => l.filter(x => x.id !== g.id))} />)}</CardGrid>
      {!list.length && <p className="small" style={{ margin: '8px 0 0', color: T.ink2 }}>{tr({ uz: "Ro'yxat bo'sh", ru: 'Список пуст' })}</p>}
    </Win>
  );
};
const CRUD4 = [
  { en: 'Create', uz: "qo'shish", ru: 'добавить', kod: '[...games, yangi]' },
  { en: 'Read', uz: "ko'rsatish", ru: 'показать', kod: 'games.map(...)' },
  { en: 'Update', uz: "o'zgartirish", ru: 'изменить', kod: '{ ...g, top: !g.top }' },
  { en: 'Delete', uz: "o'chirish", ru: 'удалить', kod: 'games.filter(...)' }
];
const BLOK3 = [
  { t: { uz: "Qo'shish", ru: 'Добавление' }, tag: { uz: "o'zingiz · VS Code", ru: 'сами · VS Code' } },
  { t: { uz: "TOP va o'chirish", ru: 'TOP и удаление' }, tag: 'Gemini' },
  { t: { uz: 'AI xatosini topish', ru: 'Поиск ошибки AI' }, tag: { uz: 'siz', ru: 'Вы' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun ro'yxat <span className="italic" style={{ color: T.accent }}>jonlanadi</span>.</>, ru: <>Сегодня список <span className="italic" style={{ color: T.accent }}>оживает</span>.</> })}</h2></div>
      <Mentor>{tr({ uz: <>O'tgan darslarda <span className="mono">robo-games</span>'da o'yin kartochkalarini chizdingiz. Bugun ularni <b style={{ color: T.ink }}>qo'shasiz, TOP qilasiz va o'chirasiz</b> — bu CRUD amallari. Qo'shishni o'zingiz yozasiz, qolganini Gemini bilan.</>, ru: <>На прошлых уроках Вы нарисовали карточки игр в <span className="mono">robo-games</span>. Сегодня будете их <b style={{ color: T.ink }}>добавлять, отмечать TOP и удалять</b> — это действия CRUD. Добавление напишете сами, остальное — с Gemini.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: "Dars oxirida · bosib ko'ring", ru: 'К концу урока · попробуйте' })}</p>
          <CrudNamuna />
        </Col>
        <Col>
          <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: "Dars oxirida · bosib ko'ring", ru: 'К концу урока · попробуйте' })}</p>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: 'CRUD — ilovaning 4 amali', ru: 'CRUD — 4 действия приложения' })}</p>
            <ul className="cr-jadval">{CRUD4.map(c => <li key={c.en}><b>{c.en}</b><span>{tr(c)}</span><code className="qcode">{c.kod}</code></li>)}</ul>
            <hr className="am-chiziq" />
            <p className="flow-label">{tr({ uz: `Bugungi ${BLOK3.length} blok`, ru: `${BLOK3.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{BLOK3.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== a1 — qo'shish (AI'siz): shu yerda sinab ko'rish + VS Code'da o'zingiz yozasiz =====
const A1_QADAM = [
  { uz: "`App.jsx` da o'yinlar state'da tursin: `const [games, setGames] = useState([...])` — o'tgan darsdagi ro'yxatingiz.", ru: 'В `App.jsx` игры пусть лежат в state: `const [games, setGames] = useState([...])` — Ваш список с прошлого урока.' },
  { uz: "Ro'yxat tepasiga input va «+ O'yin qo'shish» tugmasini qo'ying; yozilgan nom `nom` state'ida tursin.", ru: 'Над списком поставьте input и кнопку «+ Добавить игру»; введённое название пусть лежит в state `nom`.' },
  { uz: "Tugma bosilganda yangi o'yin yasang: `const yangi = { id: Date.now(), name: nom }`.", ru: 'По нажатию кнопки создайте новую игру: `const yangi = { id: Date.now(), name: nom }`.' },
  { uz: "Ro'yxatga qo'shing: `setGames([...games, yangi])` — push emas.", ru: 'Добавьте в список: `setGames([...games, yangi])` — не push.' },
  { uz: "Saqlang — localhost:5173 da yangi kartochka chiqdimi?", ru: 'Сохраните — на localhost:5173 появилась новая карточка?' }
];
const A1_KOD = `const [nom, setNom] = useState('');

function qoshish() {
  const yangi = { id: Date.now(), name: nom };
  setGames([...games, yangi]);
  setNom('');
}

<input value={nom} onChange={e => setNom(e.target.value)} />
<button onClick={qoshish}>+ O'yin qo'shish</button>`;
const ScreenQoshish = ({ screen, onNext, onPrev }) => {
  const [list, setList] = useState(() => GAMES.slice(0, 2));
  const [oxirgi, setOxirgi] = useState('');
  const qolgan = POOL.filter(p => !list.some(g => g.id === p.id));
  const qosh = (p) => { setList(l => [...l, p]); setOxirgi(`setGames([...games, { id: ${p.id}, name: "${p.name}" }]);`); };
  const qaytar = () => { setList(GAMES.slice(0, 2)); setOxirgi(''); };
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot 1 · AI'siz", ru: 'Практика 1 · без AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yangi o'yinni ro'yxatga <span className="italic" style={{ color: T.accent }}>qo'shing</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Добавьте</span> новую игру в список.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Qo'shishning kaliti — uch nuqta: <span className="mono">[...games, yangi]</span> — «eski ro'yxatning hammasi, oxiriga yangisi». Avval shu yerda sinab ko'ring, keyin VS Code'da o'zingiz yozasiz.</>, ru: <>Ключ добавления — три точки: <span className="mono">[...games, yangi]</span> — «весь старый список, а в конец новый». Сначала попробуйте здесь, потом напишете сами в VS Code.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Qo'shish uchun tanlang", ru: 'Выберите, что добавить' })}</p>
            <div className="am-chips">{qolgan.map(p => <button key={p.id} type="button" className="am-chip" onClick={() => qosh(p)}>+ {p.emoji} {p.name}</button>)}{!qolgan.length && <button type="button" className="am-chip" onClick={qaytar}>{tr({ uz: '↺ Boshidan', ru: '↺ Сначала' })}</button>}</div>
            <Win title="robo-games — localhost:5173" minH={110}>
              <CardGrid cols={3}>{list.map(g => <MyCard key={g.id} game={g} flash={oxirgi.includes(`id: ${g.id},`)} />)}</CardGrid>
            </Win>
            <KodOyna oxirgi={oxirgi} qatorlar={[<>{nomlar(list)}  <span className="sk-izoh">// games.length = {list.length}</span></>]} />
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

// ===== a2 — Gemini: TOP (map + {...g}) va o'chirish (filter + confirm) =====
const A2_QADAM = [
  { uz: "Chapdagi ilovada «🔥 TOP» va «✕»ni bosing — kod oynasida map va filter qanday ishlashini ko'ring.", ru: 'В приложении слева нажмите «🔥 TOP» и «✕» — в окне кода видно, как работают map и filter.' },
  { uz: "«Promptni nusxalash» → gemini.google.com'ga qo'ying, oxiriga `App.jsx` va `GameCard.jsx` kodini qo'shing va yuboring.", ru: '«Скопировать промпт» → вставьте в gemini.google.com, в конце добавьте код `App.jsx` и `GameCard.jsx` и отправьте.' },
  { uz: "Javobdagi fayllarni almashtiring, `Ctrl+S`.", ru: 'Замените файлы на файлы из ответа, `Ctrl+S`.' },
  { uz: "Brauzerda va kodda «Tekshiring» ro'yxatini o'ting.", ru: 'Пройдите список «Проверьте» в браузере и в коде.' }
];
const A2_TEKSHIR = [
  { uz: "TOP bosilganda faqat o'sha kartochka o'zgaradimi, qolganlari joyidami?", ru: 'При нажатии TOP меняется только эта карточка, остальные на месте?' },
  { uz: "«✕» dan keyin «Rostdan o'chirilsinmi?» so'raladimi?", ru: 'После «✕» спрашивается «Точно удалить?»?' },
  { uz: "Kodda `map` va `filter` bormi, `push` yoki `splice` yo'qmi?", ru: 'В коде есть `map` и `filter`, нет `push` или `splice`?' }
];
const a2Prompt = () => tr({
  uz: `React loyihamga (robo-games) ikkita amal qo'sh. games ro'yxati App.jsx da useState'da turibdi.\n1. Har kartochkada «🔥 TOP» tugmasi: bosilganda faqat shu o'yinning top qiymati almashsin — games.map bilan: g.id === id ? { ...g, top: !g.top } : g.\n2. Har kartochkada «✕» tugmasi: avval confirm("Rostdan o'chirilsinmi?") bilan so'rasin, keyin games.filter(g => g.id !== id) bilan o'chirsin.\nState'ni to'g'ridan o'zgartirma (push, splice yo'q) — har safar setGames'ga yangi ro'yxat ber. Funksiyalarni GameCard'ga props bilan uzat.\nHar bo'limga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.\nMana kodim:\n{App.jsx va GameCard.jsx kodini shu yerga qo'ying}`,
  ru: `Добавь в мой React-проект (robo-games) два действия. Список games лежит в useState в App.jsx.\n1. На каждой карточке кнопка «🔥 TOP»: по нажатию меняется значение top только у этой игры — через games.map: g.id === id ? { ...g, top: !g.top } : g.\n2. На каждой карточке кнопка «✕»: сначала спрашивает confirm("Точно удалить?"), потом удаляет через games.filter(g => g.id !== id).\nНе меняй state напрямую (без push и splice) — каждый раз передавай в setGames новый список. Функции передай в GameCard через props.\nК каждому разделу — короткий комментарий. Измененные файлы верни целиком.\nВот мой код:\n{вставьте сюда код App.jsx и GameCard.jsx}`
});
const ScreenTopOchir = ({ screen, onNext, onPrev }) => {
  const [list, setList] = useState(() => GAMES.slice());
  const [oxirgi, setOxirgi] = useState('');
  const top = (g) => { setList(l => l.map(x => (x.id === g.id ? { ...x, top: !x.top } : x))); setOxirgi(`setGames(games.map(g => g.id === ${g.id} ? { ...g, top: !g.top } : g));`); };
  const ochir = (g) => { setList(l => l.filter(x => x.id !== g.id)); setOxirgi(`setGames(games.filter(g => g.id !== ${g.id}));`); };
  const toplar = list.filter(g => g.top).map(g => `"${g.name}"`);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · Gemini', ru: 'Практика 2 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>TOP va o'chirishni <span className="italic" style={{ color: T.accent }}>Gemini</span> bilan qo'shing.</>, ru: <>Добавьте TOP и удаление вместе с <span className="italic" style={{ color: T.accent }}>Gemini</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>O'zgartirish — <b style={{ color: T.ink }}>map</b>: kerakli o'yinni topib, nusxasini o'zgartiradi, qolganiga tegmaydi. O'chirish — <b style={{ color: T.ink }}>filter</b>: shu o'yindan boshqa hammasini qoldiradi. Sinab ko'ring, keyin promptni Gemini'ga bering.</>, ru: <>Изменение — <b style={{ color: T.ink }}>map</b>: находит нужную игру и меняет её копию, остальные не трогает. Удаление — <b style={{ color: T.ink }}>filter</b>: оставляет все, кроме этой игры. Попробуйте, потом отдайте промпт Gemini.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Ilova · bosib ko'ring", ru: 'Приложение · попробуйте' })}</p>
            <Win title="robo-games — localhost:5173" minH={110}>
              <CardGrid cols={3}>{list.map(g => <MyCard key={g.id} game={g} onTop={() => top(g)} onDelete={() => ochir(g)} />)}</CardGrid>
              {!list.length && <button type="button" className="am-chip" onClick={() => { setList(GAMES.slice()); setOxirgi(''); }}>{tr({ uz: '↺ Boshidan', ru: '↺ Сначала' })}</button>}
            </Win>
            <KodOyna oxirgi={oxirgi} qatorlar={[<>{nomlar(list)}</>, <>top: [{toplar.join(', ')}];  <span className="sk-izoh">// games.length = {list.length}</span></>]} />
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
