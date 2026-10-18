// ===== SCREEN 1 — REJA (F-1015-340/341): «Avval tayyorlaning ▾» + bugungi qoida + 3 blok =====
const TAYYOR = [
  { uz: <>Ish stolida <span className="qcode">mini-dokon</span> papkasini yarating va VS Code'da oching; ichida <span className="qcode">REJA.md</span>, <span className="qcode">index.html</span>, <span className="qcode">style.css</span> va <span className="qcode">script.js</span>, Go Live.</>, ru: <>Создайте на рабочем столе папку <span className="qcode">mini-dokon</span> и откройте её в VS Code; внутри <span className="qcode">REJA.md</span>, <span className="qcode">index.html</span>, <span className="qcode">style.css</span> и <span className="qcode">script.js</span>, Go Live.</> },
  { uz: "Boshqa oynada gemini.google.com'ni oching.", ru: 'В другом окне откройте gemini.google.com.' },
  { uz: "Copilot yoqilganini tekshiring — VS Code pastki chizig'ida Copilot belgisi bor.", ru: 'Проверьте, что Copilot включён — в нижней строке VS Code есть значок Copilot.' }
];
const REJA_BLOK = [
  { t: { uz: 'Reja', ru: 'План' }, tag: { uz: "o'zingiz · REJA.md", ru: 'сами · REJA.md' } },
  { t: { uz: 'Katalog va toifa tugmalari', ru: 'Каталог и кнопки категорий' }, tag: 'Gemini' },
  { t: { uz: 'Qidiruv', ru: 'Поиск' }, tag: 'Copilot' }
];
// F-1015-334 (foydalanuvchi, A variant): «Avval tayyorlaning» — ochiladigan, ko'zga tashlanadigan tugma; ochilmaguncha «nafas oladi»
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
        <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>{tr(x)}</span></li>)}</ol>
        <p className="am-tayyor-s">{tr({ uz: "Tayyor bo'lsa — «Boshlaymiz».", ru: 'Готово — «Начинаем».' })}</p>
      </div>}
    </div></div>
  );
};
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz', ru: 'Начинаем' }} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Do'konni qaysi <span className="italic" style={{ color: T.accent }}>qadamdan</span> boshlaysiz?</>, ru: <>С какого <span className="italic" style={{ color: T.accent }}>шага</span> начнёте магазин?</> })}</h2></div>
      <Mentor>{tr({ uz: <>Bugun maktab mini-do'konini JavaScript bilan jonlantirasiz: toifa tugmalari va qidiruv ishlaydi. AI'ni darrov ochmaymiz: avval <b style={{ color: T.ink }}>reja</b> tuzasiz, keyin uni qadamma-qadam qurasiz.</>, ru: <>Сегодня оживите школьный мини-магазин на JavaScript: заработают кнопки категорий и поиск. AI сразу не открываем: сначала составите <b style={{ color: T.ink }}>план</b>, потом построите его шаг за шагом.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Dars oxirida · namuna', ru: 'К концу урока · образец' })}</p>
          <DokonJonli nom={tr(DK_NOM)} items={dkNamuna()} q={Q_BUGUN} />
        </Col>
        <Col>
          <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: 'Dars oxirida · namuna', ru: 'К концу урока · образец' })}</p>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: 'Bugungi qoida', ru: 'Правило дня' })}</p>
            <p className="am-qoida-m">{tr({ uz: <>Avval <span style={{ color: T.accent, fontStyle: 'italic' }}>bo'laklang</span>, keyin AI'ni oching.</>, ru: <>Сначала <span style={{ color: T.accent, fontStyle: 'italic' }}>разбейте</span>, потом открывайте AI.</> })}</p>
            <hr className="am-chiziq" />
            <p className="flow-label">{tr({ uz: `Bugungi ${REJA_BLOK.length} blok`, ru: `${REJA_BLOK.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{REJA_BLOK.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== Bitta ip — o'quvchining mini-do'koni (F-1015-341: jonli katalog): reja (a1) → katalog + toifa tugmalari (a2) → qidiruv (a3) =====
const DOKON_KEY = 'ccDokon';
const dkRead = () => { try { const v = JSON.parse(localStorage.getItem(DOKON_KEY) || 'null'); return v && typeof v === 'object' ? v : {}; } catch { return {}; } };
const dkWrite = (patch) => { try { localStorage.setItem(DOKON_KEY, JSON.stringify({ ...dkRead(), ...patch, savedAt: Date.now() })); } catch { /* saqlab bo'lmadi */ } };
const DK_NOM = { uz: "Maktab mini-do'koni", ru: 'Школьный мини-магазин' };
const DK_TOIFA = [
  { id: 'oquv', uz: "O'quv", ru: 'Учёба' },
  { id: 'ichimlik', uz: 'Ichimlik', ru: 'Напитки' },
  { id: 'shirinlik', uz: 'Shirinlik', ru: 'Сладости' }
];
const DK_RANG = { oquv: ['#dbeafe', '#1d4ed8'], ichimlik: ['#dcfce7', '#15803d'], shirinlik: ['#fef3c7', '#b45309'] };
const DK_MAHSULOT = [
  { n: { uz: 'Ruchka', ru: 'Ручка' }, p: '3 000', t: 'oquv' }, { n: { uz: "Chizg'ich", ru: 'Линейка' }, p: '4 000', t: 'oquv' },
  { n: { uz: 'Sharbat', ru: 'Сок' }, p: '6 000', t: 'ichimlik' }, { n: { uz: 'Suv', ru: 'Вода' }, p: '3 000', t: 'ichimlik' },
  { n: { uz: 'Shokolad', ru: 'Шоколад' }, p: '8 000', t: 'shirinlik' }, { n: { uz: 'Pechenye', ru: 'Печенье' }, p: '5 000', t: 'shirinlik' }
];
const dkNamuna = () => DK_MAHSULOT.map(x => ({ n: tr(x.n), p: x.p, t: x.t }));
const Q_BUGUN = new Set(['royxat', 'karta', 'filtr', 'qidiruv']);
const narxToza = (p) => (p || '').replace(/\s*(so'm|сум)\s*$/i, '').trim();
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SevBelgi = ({ on }) => <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 20.5S3 15 3 9a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 6-9 11.5-9 11.5z" fill={on ? '#e11d48' : 'none'} stroke={on ? '#e11d48' : '#64748b'} strokeWidth="2" strokeLinejoin="round" /></svg>;
// Jonli do'kon maketi: q — qaysi qismlar qurilgan (a1 dagi «Shart» ustuni); toifa tugmalari, qidiruv, yurak, savat — bosilsa ishlaydi
const DokonJonli = ({ nom, items, q, yangi = null, teg = {} }) => {
  const [toifa, setToifa] = useState('hammasi');
  const [soz, setSoz] = useState('');
  const [sev, setSev] = useState(() => new Set());
  const [savat, setSavat] = useState(0);
  const bor = (id) => q.has(id);
  const yq = (id) => (yangi === id ? ' dk-yangi-q' : '');
  const teglash = (id) => (teg[id] ? <span className="dk-teg">{teg[id]}</span> : null);
  const toifalar = DK_TOIFA.filter(t => items.some(x => x.t === t.id));
  const izla = soz.trim().toLowerCase();
  const korin = items.map((x, i) => ({ ...x, _i: i })).filter(x => (!bor('filtr') || toifa === 'hammasi' || x.t === toifa) && (!bor('qidiruv') || !izla || (x.n || '').toLowerCase().includes(izla)));
  const nomi = (x) => (x.n && x.n.trim() ? <b>{x.n.trim()}</b> : <span className="dk-yoq">? {tr({ uz: 'nomi', ru: 'название' })}</span>);
  const narxi = (x) => (narxToza(x.p) ? <span className="dk-narx">{narxToza(x.p)} {tr({ uz: "so'm", ru: 'сум' })}</span> : <span className="dk-yoq">? {tr({ uz: 'narx', ru: 'цена' })}</span>);
  const sevAlmash = (i) => setSev(o => { const n = new Set(o); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  return (
    <div className={`dk-sayt ${items.length > 4 ? 'dk-6' : ''}`}>
      <div className="dk-bar"><span className="bb-dots"><i /><i /><i /></span><span className="dk-url">mini-dokon · Live Server</span></div>
      <div className="dk-body">
        <div className="dk-bosh">
          <p className="dk-h1">{nom && nom.trim() ? nom.trim() : <span className="dk-yoq">? {tr({ uz: "do'kon nomi", ru: 'название магазина' })}</span>}</p>
          <div className="dk-ong">
            {bor('sevimli') && <span className={`dk-pill dk-kir${yq('sevimli')}`}><SevBelgi on={sev.size > 0} /> {sev.size}</span>}
            {bor('savat') && <span className={`dk-pill dk-savat dk-kir${yq('savat')}`}>{tr({ uz: 'Savat', ru: 'Корзина' })} · {savat}</span>}
            {bor('tolov') && <span className={`dk-pill dk-tolov dk-kir${yq('tolov')}`}>{tr({ uz: "To'lash", ru: 'Оплатить' })}</span>}
            {bor('akkaunt') && <span className={`dk-pill dk-kir${yq('akkaunt')}`}>{tr({ uz: 'Kirish', ru: 'Войти' })}</span>}
          </div>
        </div>
        {bor('qidiruv') && <div className={`dk-rel dk-kir${yq('qidiruv')}`}><input className="dk-qidir" value={soz} onChange={e => setSoz(e.target.value)} placeholder={tr({ uz: 'Qidirish...', ru: 'Поиск...' })} aria-label={tr({ uz: 'Qidiruv', ru: 'Поиск' })} />{teglash('qidiruv')}</div>}
        {bor('filtr') && <div className={`dk-filtr dk-rel dk-kir${yq('filtr')}`}>{[{ id: 'hammasi', uz: 'Hammasi', ru: 'Все' }, ...toifalar].map(t => <button key={t.id} type="button" className={`dk-tf ${toifa === t.id ? 'on' : ''}`} aria-pressed={toifa === t.id} onClick={() => setToifa(t.id)}>{tr(t)}</button>)}{teglash('filtr')}</div>}
        {!bor('royxat') && <div className="dk-bosh-sahifa">{tr({ uz: "Bo'sh sahifa — «Shart» ustuniga qism qo'shing", ru: 'Пустая страница — добавьте часть в столбец «Нужно»' })}</div>}
        {bor('royxat') && !bor('karta') && <ul className={`dk-royxat dk-kir${yq('royxat')}`}>{korin.map(x => <li key={x._i}>{(x.n || '').trim() || '?'} — {narxToza(x.p) || '?'} {tr({ uz: "so'm", ru: 'сум' })}</li>)}</ul>}
        {bor('royxat') && bor('karta') && (korin.length ? (
          <div className="dk-grid">{korin.map((x, k) => { const r = DK_RANG[x.t]; const tf = DK_TOIFA.find(t => t.id === x.t); return (
            <div key={x._i} className="dk-karta dk-pop" style={{ animationDelay: `${Math.min(k, 8) * 45}ms` }}>
              <span className="dk-rasm" style={r ? { background: r[0] } : undefined} />
              {tf && <span className="dk-toifa" style={{ color: r[1] }}>{tr(tf)}</span>}
              {nomi(x)}
              {narxi(x)}
              {(bor('sevimli') || bor('savat')) && <div className="dk-amal">
                {bor('sevimli') && <button type="button" className="dk-sev" aria-pressed={sev.has(x._i)} aria-label={tr({ uz: 'Sevimli', ru: 'Избранное' })} onClick={() => sevAlmash(x._i)}><SevBelgi on={sev.has(x._i)} /></button>}
                {bor('savat') && <button type="button" className="dk-savatga" onClick={() => setSavat(s => s + 1)}>{tr({ uz: 'Savatga', ru: 'В корзину' })}</button>}
              </div>}
            </div>); })}</div>
        ) : <p className="dk-yoq-t">{tr({ uz: 'Hech narsa topilmadi', ru: 'Ничего не найдено' })}</p>)}
      </div>
    </div>
  );
};

const PromptBlok = ({ matn, tayyor }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return (
    <div className="am-karta fade-up delay-2">
      {tayyor && <p className="am-tayyor-ok">{tr(tayyor)}</p>}
      <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Prompt', ru: 'Промпт' })}</p><button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Promptni nusxalash', ru: 'Скопировать промпт' })}</button></div>
      <pre className="am-masalan">{matn}</pre>
    </div>
  );
};
const Qadamlar = ({ b, cls = '' }) => (
  <div className={`am-karta ${cls}`}>
    <p className="flow-label">{tr({ uz: 'Qadamlar', ru: 'Шаги' })}</p>
    <ol className="am-qadam">{b.qadamlar.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
    {b.yordam && <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(b.yordam)}</p>}
  </div>
);
// F-1015-330: a2/a3 da qadamlar bitta tugmada — o'ngdagi namuna ostida, bosilsa ochiladi
const QadamTugma = ({ b, cls = '' }) => {
  const [ochiq, setOchiq] = useState(false);
  return (
    <div className={`am-karta am-qt ${ochiq ? 'on' : ''} ${cls}`}>
      <button type="button" className="am-qt-btn" aria-expanded={ochiq} onClick={() => setOchiq(o => !o)}>
        <span>{tr({ uz: 'Qadamlar', ru: 'Шаги' })} · {b.qadamlar.length}</span><span className="am-qt-ic" aria-hidden="true">▾</span>
      </button>
      {ochiq && <ol className="am-qadam am-ochil">{b.qadamlar.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>}
    </div>
  );
};

const KodNusxa = ({ yorliq, kod }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(kod); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return (
    <div className="am-kod">
      <div className="am-prompt-h"><p className="flow-label">{tr(yorliq)}</p><button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></div>
      <pre className="am-masalan">{kod}</pre>
    </div>
  );
};
const NusxaTugma = ({ matn, yorliq }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return <button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr(yorliq)}</button>;
};

// ===== a1 — «Do'konni yig'ing» (F-1015-341, AI'siz): qismlarni «Shart» / «Keyin» ga suring; bog'liqlik + 40 daqiqa → REJA.md =====
const BYUDJET = 40;
// need — busiz bu qism ishlamaydi; s — o'quvchiga savol (nega avval need kerak)
const QISM = [
  { id: 'royxat', n: { uz: "Mahsulot ro'yxati", ru: 'Список товаров' }, m: 10, need: null },
  { id: 'karta', n: { uz: 'Kartochkalar', ru: 'Карточки' }, m: 10, need: 'royxat', s: { uz: 'kartochkaga nimani chizasiz?', ru: 'что рисовать на карточке?' } },
  { id: 'filtr', n: { uz: 'Toifa tugmalari', ru: 'Кнопки категорий' }, m: 10, need: 'karta', s: { uz: 'tugma nimani saralaydi?', ru: 'что будет отбирать кнопка?' } },
  { id: 'qidiruv', n: { uz: 'Qidiruv', ru: 'Поиск' }, m: 10, need: 'karta', s: { uz: 'qidiruv nimani topadi?', ru: 'что будет находить поиск?' } },
  { id: 'sevimli', n: { uz: 'Sevimli', ru: 'Избранное' }, m: 15, need: 'karta', s: { uz: "yurakni qayerga qo'yasiz?", ru: 'куда поставить сердечко?' } },
  { id: 'savat', n: { uz: 'Savat', ru: 'Корзина' }, m: 25, need: 'karta', s: { uz: "savatga nima qo'shasiz?", ru: 'что класть в корзину?' } },
  { id: 'tolov', n: { uz: "To'lov", ru: 'Оплата' }, m: 40, need: 'savat', s: { uz: "nimaning pulini to'laydi?", ru: 'за что платить?' } },
  { id: 'akkaunt', n: { uz: 'Akkaunt bilan kirish', ru: 'Вход в аккаунт' }, m: 40, need: null }
];
const qTop = (id) => QISM.find(x => x.id === id);
const qDaq = (ids) => ids.reduce((s, id) => s + qTop(id).m, 0);
const rejaMatn = (shart, keyin) => {
  const yoz = (L, daq) => `${L === 'uz' ? "# Mini-do'kon — reja" : '# Мини-магазин — план'}\n\n${L === 'uz' ? '## Shart (MVP)' : '## Нужно (MVP)'} — ${qDaq(shart)} ${daq}\n${shart.map((id, i) => `${i + 1}. ${qTop(id).n[L]} — ${qTop(id).m} ${daq}`).join('\n')}\n\n${L === 'uz' ? '## Keyin' : '## Потом'}\n${keyin.map(id => `- ${qTop(id).n[L]}`).join('\n')}\n`;
  return tr({ uz: yoz('uz', 'daqiqa'), ru: yoz('ru', 'минут') });
};
// REJA.md — VS Code oynasi ko'rinishida
const RejaMaket = ({ shart, keyin }) => (
  <div className="rj-oyna">
    <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">REJA.md</span></div>
    <div className="rj-body">
      <div className="rj-h1">{tr({ uz: "# Mini-do'kon — reja", ru: '# Мини-магазин — план' })}</div>
      <div className="rj-h2">{tr({ uz: `## Shart (MVP) — ${qDaq(shart)} daqiqa`, ru: `## Нужно (MVP) — ${qDaq(shart)} минут` })}</div>
      {shart.map((id, i) => <div key={id} className="rj-li">{i + 1}. {tr(qTop(id).n)} — {qTop(id).m} {tr({ uz: 'daqiqa', ru: 'минут' })}</div>)}
      <div className="rj-h2">{tr({ uz: '## Keyin', ru: '## Потом' })}</div>
      {keyin.map(id => <div key={id} className="rj-li">- {tr(qTop(id).n)}</div>)}
    </div>
  </div>
);
const A1 = {
  qadamlar: [
    { uz: "Har qismni «Shart» yoki «Keyin» ustuniga suring — yoki qismni bosib, keyin ustunni bosing.", ru: 'Перетащите каждую часть в столбец «Нужно» или «Потом» — или нажмите на часть, потом на столбец.' },
    { uz: "«Shart» qismlar 40 daqiqaga sig'sin — vaqt chizig'iga qarang.", ru: 'Части «Нужно» должны уложиться в 40 минут — смотрите на полоску времени.' },
    { uz: "«Saqlash» → «REJA.md ni nusxalash» → `REJA.md` ga qo'ying, `Ctrl+S`.", ru: '«Сохранить» → «Скопировать REJA.md» → вставьте в `REJA.md`, `Ctrl+S`.' }
  ]
};
const qismOqi = (k) => { const d = dkRead()[k]; return Array.isArray(d) ? d.filter((id, i) => qTop(id) && d.indexOf(id) === i) : []; };
const ScreenReja = ({ screen, onNext, onPrev }) => {
  const [shart, setShart] = useState(() => qismOqi('rejaShart'));
  const [keyin, setKeyin] = useState(() => { const s = qismOqi('rejaShart'); return qismOqi('rejaKeyin').filter(id => !s.includes(id)); });
  const [yigil, setYigil] = useState(() => !!dkRead().rejaSaqlangan);
  const [tan, setTan] = useState(null);       // bosib tanlangan qism (sudramasdan joylash uchun)
  const [hover, setHover] = useState(null);   // sudralayotganda ustidagi ustun
  const [xabar, setXabar] = useState(null);   // { t: 'xato' | 'info', m }
  const [silk, setSilk] = useState(null);
  const [yangi, setYangi] = useState(null);
  const elRef = useRef({});
  const flipRef = useRef(null);
  const dragRef = useRef(null);
  const sudraldi = useRef(false);
  const silkT = useRef(null);
  useEffect(() => () => clearTimeout(silkT.current), []);
  useEffect(() => { dkWrite({ rejaShart: shart, rejaKeyin: keyin }); }, [shart, keyin]);
  const pool = QISM.filter(x => !shart.includes(x.id) && !keyin.includes(x.id)).map(x => x.id);
  const daq = qDaq(shart);
  const oshdi = daq > BYUDJET;
  const kerak = ['royxat', 'karta'].filter(id => !shart.includes(id));
  const toliq = pool.length === 0 && !oshdi && kerak.length === 0;
  const qolgan = BYUDJET - daq;

  // FLIP: qism eski joyidan yangisiga «uchib» boradi
  const eslab = (ust) => { const r = {}; Object.entries(elRef.current).forEach(([id, el]) => { if (el) r[id] = el.getBoundingClientRect(); }); if (ust) r[ust.id] = ust.rect; flipRef.current = r; };
  useLayoutEffect(() => {
    const old = flipRef.current; flipRef.current = null;
    if (!old || kamHarakat()) return;
    Object.entries(elRef.current).forEach(([id, el]) => {
      const o = old[id]; if (!el || !o || !el.animate) return;
      const n = el.getBoundingClientRect(); const dx = o.left - n.left, dy = o.top - n.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'translate(0,0)' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
    });
  }, [shart, keyin]);
  const qaytar = (id, rect) => { const el = elRef.current[id]; if (!el || !rect || !el.animate || kamHarakat()) return; const n = el.getBoundingClientRect(); el.animate([{ transform: `translate(${rect.left - n.left}px,${rect.top - n.top}px)` }, { transform: 'translate(0,0)' }], { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' }); };
  const silkit = (id) => { clearTimeout(silkT.current); setSilk(id); silkT.current = setTimeout(() => setSilk(null), 480); };

  const kochir = (id, zona, rect) => {
    setTan(null);
    const q = qTop(id);
    if (zona === 'shart') {
      if (shart.includes(id)) { qaytar(id, rect); return; }
      if (q.need && !shart.includes(q.need)) {
        if (rect) qaytar(id, rect); else silkit(id);
        setXabar({ t: 'xato', m: tr({ uz: `Avval «${qTop(q.need).n.uz}» kerak — ${q.s.uz}`, ru: `Сначала нужно «${qTop(q.need).n.ru}» — ${q.s.ru}` }) });
        return;
      }
      eslab(rect && { id, rect });
      setKeyin(k => k.filter(x => x !== id)); setShart(s => [...s, id]); setYangi(id);
      const keyingi = daq + q.m;
      setXabar(keyingi > BYUDJET ? { t: 'xato', m: tr({ uz: `${keyingi} daqiqa — bugun ulgurmaysiz. Bitta qismni «Keyin» ustuniga o'tkazing.`, ru: `${keyingi} минут — сегодня не успеете. Перенесите одну часть в столбец «Потом».` }) } : null);
      return;
    }
    // «Keyin» yoki qismlar qatori: shu qismga tayanganlar ham «Shart»dan chiqadi
    const ketadi = new Set([id]);
    let topildi = true;
    while (topildi) { topildi = false; shart.forEach(s => { const nd = qTop(s).need; if (nd && ketadi.has(nd) && !ketadi.has(s)) { ketadi.add(s); topildi = true; } }); }
    const ergash = shart.filter(s => s !== id && ketadi.has(s));
    if ((zona === 'keyin' && keyin.includes(id)) || (zona === 'pool' && pool.includes(id))) { qaytar(id, rect); return; }
    eslab(rect && { id, rect });
    setShart(s => s.filter(x => !ketadi.has(x)));
    setKeyin(k => { const qol = k.filter(x => x !== id); return zona === 'keyin' ? [...qol, id, ...ergash] : qol; });
    setYangi(null);
    setXabar(ergash.length ? { t: 'info', m: tr({ uz: `${ergash.map(x => `«${qTop(x).n.uz}»`).join(', ')} ham ko'chdi — ular «${q.n.uz}»siz ishlamaydi.`, ru: `${ergash.map(x => `«${qTop(x).n.ru}»`).join(', ')} тоже перенесены — без «${q.n.ru}» они не работают.` }) } : null);
  };

  // Sudrash: qismning o'zi barmoq/sichqoncha ortidan yuradi; qo'yilgan ustunga FLIP bilan o'tiradi
  const bosildi = (e, id) => {
    if (e.button !== undefined && e.button !== 0) return;
    const el = elRef.current[id]; if (!el) return;
    dragRef.current = { id, el, x0: e.clientX, y0: e.clientY, faol: false };
    const ustun = (x, y) => { const t = document.elementFromPoint(x, y); const z = t && t.closest ? t.closest('[data-zona]') : null; return z ? z.getAttribute('data-zona') : null; };
    const harakat = (ev) => {
      const d = dragRef.current; if (!d) return;
      const dx = ev.clientX - d.x0, dy = ev.clientY - d.y0;
      if (!d.faol && Math.hypot(dx, dy) < 6) return;
      if (!d.faol) { d.faol = true; d.el.classList.add('ql-sudr'); setTan(null); }
      d.el.style.transform = `translate(${dx}px,${dy}px)`;
      setHover(ustun(ev.clientX, ev.clientY));
    };
    const qoyib = (ev) => {
      window.removeEventListener('pointermove', harakat); window.removeEventListener('pointerup', qoyib); window.removeEventListener('pointercancel', qoyib);
      const d = dragRef.current; dragRef.current = null;
      if (!d || !d.faol) return;
      sudraldi.current = true; setTimeout(() => { sudraldi.current = false; }, 0);
      const z = ev.type === 'pointerup' ? ustun(ev.clientX, ev.clientY) : null;
      const r = d.el.getBoundingClientRect();
      d.el.classList.remove('ql-sudr'); d.el.style.transform = '';
      setHover(null);
      const rect = { left: r.left, top: r.top };
      if (z) kochir(d.id, z, rect); else qaytar(d.id, rect);
    };
    window.addEventListener('pointermove', harakat); window.addEventListener('pointerup', qoyib); window.addEventListener('pointercancel', qoyib);
  };

  const chip = (id, zona, i) => {
    const q = qTop(id);
    return (
      <button key={id} type="button" ref={el => { elRef.current[id] = el; }} className={`ql-chip ${tan === id ? 'ql-tan' : ''} ${silk === id ? 'ql-silk' : ''}`} aria-pressed={tan === id}
        onPointerDown={e => bosildi(e, id)} onClick={e => { e.stopPropagation(); if (sudraldi.current) return; setTan(t => (t === id ? null : id)); }}>
        {zona === 'shart' && <span className="ql-n">{i + 1}</span>}
        <b>{tr(q.n)}</b><span className="ql-daq">{q.m} {tr({ uz: 'daqiqa', ru: 'мин' })}</span>
      </button>
    );
  };
  const ustunProps = (id) => ({
    'data-zona': id,
    className: `ql-zona ql-zona-${id} ${tan ? 'ql-kut' : ''} ${hover === id ? 'ql-ust' : ''}`,
    onClick: () => { if (tan) kochir(tan, id); },
    role: tan ? 'button' : undefined,
    tabIndex: tan ? 0 : undefined,
    onKeyDown: (e) => { if (tan && e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); kochir(tan, id); } }
  });
  const saqla = () => { if (!toliq) return; dkWrite({ rejaShart: shart, rejaKeyin: keyin, rejaSaqlangan: true }); setYigil(true); setXabar(null); setTan(null); };
  const saqlaYorliq = pool.length ? { uz: `Hamma qismni joylang — yana ${pool.length} ta`, ru: `Разместите все части — ещё ${pool.length}` }
    : oshdi ? { uz: '40 daqiqadan oshdi', ru: 'Больше 40 минут' }
    : kerak.length ? { uz: "Ro'yxat va kartochkalarsiz do'kon bo'sh", ru: 'Без списка и карточек магазин пуст' }
    : { uz: 'Saqlash', ru: 'Сохранить' };
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot 1 · AI'siz", ru: 'Практика 1 · без AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>40 daqiqaga sig'adigan <span className="italic" style={{ color: T.accent }}>do'konni</span> yig'ing.</>, ru: <>Соберите <span className="italic" style={{ color: T.accent }}>магазин</span>, который уложится в 40 минут.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har qismda qancha vaqt olishi yozilgan. Bugun <b style={{ color: T.ink }}>40 daqiqangiz</b> bor: shunga sig'adigan, lekin ishlaydigan do'kon — bu <b style={{ color: T.ink }}>MVP</b>. Qolgani — «Keyin».</>, ru: <>У каждой части указано, сколько времени она займёт. Сегодня у вас <b style={{ color: T.ink }}>40 минут</b>: магазин, который в них уложится и при этом работает, — это <b style={{ color: T.ink }}>MVP</b>. Остальное — «Потом».</> })}</Mentor>
        <Split>
          <Col>
            {!yigil && <div className="am-karta ql-taxta fade-up delay-1">
              <div {...ustunProps('pool')}>
                <div className="ql-zona-h"><span>{tr({ uz: "Do'kon qismlari", ru: 'Части магазина' })}</span><span className="ql-izoh">{tr({ uz: 'suring yoki bosing', ru: 'перетащите или нажмите' })}</span></div>
                <div className="ql-chips">{pool.length ? pool.map(id => chip(id, 'pool')) : <span className="ql-bosh">{tr({ uz: 'Hammasi joylandi', ru: 'Всё размещено' })}</span>}</div>
              </div>
              <div className="ql-ikki">
                <div {...ustunProps('shart')}>
                  <div className="ql-zona-h"><span>{tr({ uz: 'Shart (MVP)', ru: 'Нужно (MVP)' })}</span><span className={`ql-vaqt-t ${oshdi ? 'ql-osh' : ''}`}>{daq} / {BYUDJET} {tr({ uz: 'daqiqa', ru: 'мин' })}</span></div>
                  <div key={oshdi ? 'osh' : 'ok'} className={`ql-bar ${oshdi ? 'ql-osh ql-osh-w' : ''}`} role="progressbar" aria-valuemin={0} aria-valuemax={BYUDJET} aria-valuenow={daq}><i style={{ width: `${Math.min(daq / BYUDJET, 1) * 100}%` }} /></div>
                  <div className="ql-chips ql-ustun">{shart.length ? shart.map((id, i) => chip(id, 'shart', i)) : <span className="ql-bosh">{tr({ uz: "Busiz do'kon ishlamaydigan qismlar", ru: 'Части, без которых магазин не работает' })}</span>}</div>
                </div>
                <div {...ustunProps('keyin')}>
                  <div className="ql-zona-h"><span>{tr({ uz: 'Keyin', ru: 'Потом' })}</span></div>
                  <div className="ql-chips ql-ustun">{keyin.length ? keyin.map(id => chip(id, 'keyin')) : <span className="ql-bosh">{tr({ uz: "Kutsa bo'ladigan qismlar", ru: 'Части, которые могут подождать' })}</span>}</div>
                </div>
              </div>
              {xabar && <p key={xabar.m} className={`ql-xabar ${xabar.t}`} role="status">{xabar.m}</p>}
              {!xabar && toliq && qolgan >= 10 && <p className="ql-xabar info" role="status">{tr({ uz: `Yana ${qolgan} daqiqa bor — yana bitta qism sig'adi.`, ru: `Осталось ${qolgan} минут — поместится ещё одна часть.` })}</p>}
              <button type="button" className="am-saqla" disabled={!toliq} onClick={saqla}>{tr(saqlaYorliq)}</button>
            </div>}
            {yigil && <div className="am-karta am-ochil">
              <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Sizning rejangiz', ru: 'Ваш план' })}</p><button type="button" className="am-nusxa" onClick={() => setYigil(false)}>{tr({ uz: 'Tahrirlash', ru: 'Изменить' })}</button></div>
              <RejaMaket shart={shart} keyin={keyin} />
              <p className="am-tayyor-ok">{tr({ uz: "Reja tayyor — uni REJA.md ga qo'ying.", ru: 'План готов — вставьте его в REJA.md.' })}</p>
              <NusxaTugma matn={rejaMatn(shart, keyin)} yorliq={{ uz: 'REJA.md ni nusxalash', ru: 'Скопировать REJA.md' }} />
            </div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Do'kon · rejangizdan quriladi", ru: 'Магазин · строится из вашего плана' })}</p>
            <DokonJonli nom={tr(DK_NOM)} items={dkNamuna()} q={new Set(shart)} yangi={yangi} />
            <QadamTugma b={A1} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a2 — Gemini: katalog (massiv + for) va toifa tugmalari (if) =====
const A2 = {
  qadamlar: [
    { uz: "Do'kon nomi va mahsulotlarni yozing, toifasini tanlang → «Saqlash».", ru: 'Впишите название магазина и товары, выберите категорию → «Сохранить».' },
    { uz: "«Promptni nusxalash» → gemini.google.com'ga qo'ying va yuboring.", ru: '«Скопировать промпт» → вставьте в gemini.google.com и отправьте.' },
    { uz: "Javobdagi uch faylni `index.html`, `style.css` va `script.js` ga qo'ying, `Ctrl+S`.", ru: 'Вставьте три файла из ответа в `index.html`, `style.css` и `script.js`, `Ctrl+S`.' },
    { uz: "Live Server'da toifa tugmalarini bosing — kartochkalar almashadimi?", ru: 'В Live Server нажмите кнопки категорий — карточки меняются?' }
  ]
};
const narxSon = (p) => narxToza(p).replace(/\D/g, '');
const katToliq = (x) => !!(x && x.n && x.n.trim().length >= 2 && /\d/.test(x.p || '') && DK_TOIFA.some(t => t.id === x.t));
const a2Prompt = (nom, m) => {
  const tl = DK_TOIFA.filter(t => m.some(x => x.t === t.id));
  const qator = (L) => m.map(x => `- ${x.n.trim()}, ${narxSon(x.p)} ${L === 'uz' ? "so'm" : 'сум'}, ${DK_TOIFA.find(t => t.id === x.t)[L]}`).join('\n');
  return {
    uz: `${nom} uchun bitta sahifali do'kon yasa. index.html, style.css va script.js'ni alohida, to'liq yoz.\n1. Mahsulotlar script.js da massivda tursin — har biri { nom, narx, toifa }:\n${qator('uz')}\n2. Kartochkalarni for sikli bilan chiz: nomi, narxi va toifasi.\n3. Tepada toifa tugmalari: Hammasi, ${tl.map(t => t.uz).join(', ')}. Bosilganda if bilan faqat shu toifa kartochkalari qolsin.\nHozircha faqat shu: savat va qidiruv qo'shma. Har bo'limga qisqa izoh yoz.`,
    ru: `Сделай одностраничный магазин «${nom}». Напиши index.html, style.css и script.js отдельно и целиком.\n1. Товары храни в script.js в массиве — каждый { name, price, category }:\n${qator('ru')}\n2. Карточки рисуй циклом for: название, цена и категория.\n3. Сверху кнопки категорий: Все, ${tl.map(t => t.ru).join(', ')}. По нажатию через if остаются только карточки этой категории.\nПока только это: корзину и поиск не добавляй. К каждому разделу — короткий комментарий.`
  };
};
const BOSH_KAT = () => Array.from({ length: 6 }, () => ({ n: '', p: '', t: '' }));
const ScreenKatalog = ({ screen, onNext, onPrev }) => {
  const [nom, setNom] = useState(() => dkRead().nom || '');
  const [m, setM] = useState(() => { const d = dkRead().katalog; return Array.isArray(d) && d.length === 6 ? d.map(x => ({ n: (x && x.n) || '', p: (x && x.p) || '', t: (x && x.t) || '' })) : BOSH_KAT(); });
  const [saqlangan, setSaqlangan] = useState(() => !!dkRead().katSaqlangan);
  const [yigil, setYigil] = useState(() => !!dkRead().katSaqlangan);
  const yozNom = (v) => { setNom(v); dkWrite({ nom: v }); };
  const yozM = (i, k, v) => setM(o => { const n = o.map(x => ({ ...x })); n[i][k] = v; dkWrite({ katalog: n }); return n; });
  const toza = m.filter(katToliq);
  const toliq = nom.trim().length >= 3 && toza.length >= 4 && new Set(toza.map(x => x.t)).size >= 2;
  const saqla = () => { if (!toliq) return; dkWrite({ katSaqlangan: true }); setSaqlangan(true); setYigil(true); };
  const matn = toliq && saqlangan ? tr(a2Prompt(nom.trim(), toza)) : null;
  const yozilgan = m.filter(x => x.n.trim() || x.p.trim());
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · Gemini', ru: 'Практика 2 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: 'Katalog va toifa tugmalarini quring.', ru: 'Постройте каталог и кнопки категорий.' })}</h2></div>
        <Mentor>{tr({ uz: <>Gemini'ga rejangizning birinchi qismlarini berasiz: <b style={{ color: T.ink }}>ro'yxat, kartochkalar va toifa tugmalari</b>. Prompt JavaScript darslaridagi so'zlar bilan aytadi: massiv, for sikli, if.</>, ru: <>Даёте Gemini первые части своего плана: <b style={{ color: T.ink }}>список, карточки и кнопки категорий</b>. Промпт говорит словами из уроков JavaScript: массив, цикл for, if.</> })}</Mentor>
        <Split>
          <Col>
            {!yigil && <div className="am-karta fade-up delay-1">
              <label className="am-maydon"><span>{tr({ uz: "Do'kon nomi", ru: 'Название магазина' })}</span><input className="am-input" value={nom} placeholder={tr({ uz: `masalan: ${DK_NOM.uz}`, ru: `например: ${DK_NOM.ru}` })} onChange={e => yozNom(e.target.value)} /></label>
              <div className="am-chips"><button type="button" className="am-chip" onClick={() => yozNom(tr(DK_NOM))}>{tr(DK_NOM)}</button></div>
              <div className="am-maydon"><span>{tr({ uz: 'Mahsulotlar — nomi, narxi, toifasi (kamida 4 ta)', ru: 'Товары — название, цена, категория (минимум 4)' })}</span>
                {m.map((x, i) => (
                  <div key={i} className="rj-qator">
                    <span className="am-qn">{i + 1}</span>
                    <input className="am-input" value={x.n} placeholder={tr({ uz: `masalan: ${DK_MAHSULOT[i].n.uz}`, ru: `например: ${DK_MAHSULOT[i].n.ru}` })} onChange={e => yozM(i, 'n', e.target.value)} />
                    <input className="am-input dk-narx-in" inputMode="numeric" value={x.p} placeholder={DK_MAHSULOT[i].p} aria-label={tr({ uz: "Narxi, so'm", ru: 'Цена, сум' })} onChange={e => yozM(i, 'p', e.target.value)} />
                    <select className="am-input dk-toifa-in" value={x.t} aria-label={tr({ uz: 'Toifasi', ru: 'Категория' })} onChange={e => yozM(i, 't', e.target.value)}>
                      <option value="">{tr({ uz: 'toifa', ru: 'категория' })}</option>
                      {DK_TOIFA.map(t => <option key={t.id} value={t.id}>{tr(t)}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <button type="button" className="am-saqla" disabled={!toliq} onClick={saqla}>{tr(toliq ? { uz: 'Saqlash', ru: 'Сохранить' } : { uz: 'Nom va kamida 4 mahsulot, 2 xil toifa', ru: 'Название и минимум 4 товара, 2 разные категории' })}</button>
            </div>}
            {yigil && <div className="am-karta am-ochil">
              <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Sizning katalogingiz', ru: 'Ваш каталог' })}</p><button type="button" className="am-nusxa" onClick={() => setYigil(false)}>{tr({ uz: 'Tahrirlash', ru: 'Изменить' })}</button></div>
              <p className="am-loyiha-nom">{nom}</p>
              <p className="am-satr">{toza.map(x => x.n.trim()).join(' · ')}</p>
            </div>}
            {matn && <div className="am-ochil"><PromptBlok matn={matn} tayyor={{ uz: "Prompt tayyor — Gemini'ga yuboring.", ru: 'Промпт готов — отправьте в Gemini.' }} /></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Natija · yozganingizdan quriladi', ru: 'Результат · строится из вашего текста' })}</p>
            <DokonJonli nom={nom} items={yozilgan.length ? yozilgan : BOSH_KAT().slice(0, 2)} q={new Set(['royxat', 'karta', 'filtr'])} />
            <p className="small am-osti">{tr({ uz: "Qidiruv hali yo'q — uni keyingi qadamda Copilot bilan qo'shasiz.", ru: 'Поиска пока нет — добавите его на следующем шаге с Copilot.' })}</p>
            <QadamTugma b={A2} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a3 — Copilot: izohdan qidiruv (input + funksiya) =====
const A3_IZOH_HTML = { uz: '<!-- qidiruv maydoni: input, id="qidiruv", placeholder "Qidirish..." -->', ru: '<!-- поле поиска: input, id="qidiruv", placeholder "Поиск..." -->' };
const A3_IZOH_JS = { uz: "// qidiruv: yozilgan so'z nomida bor mahsulotlarnigina chiz", ru: '// поиск: рисуй только товары, в названии которых есть введённое слово' };
const A3 = {
  qadamlar: [
    { uz: "`index.html` da toifa tugmalari ustiga 1-izohni qo'ying, `Enter` → kulrang taklifni o'qing, `Tab`.", ru: 'В `index.html` над кнопками категорий вставьте 1-й комментарий, `Enter` → прочитайте серую подсказку, `Tab`.' },
    { uz: "`script.js` oxiriga 2-izohni qo'ying, `Enter` → `Tab`. Taklif bir necha qator bo'lishi mumkin — hammasini o'qing.", ru: 'В конец `script.js` вставьте 2-й комментарий, `Enter` → `Tab`. Подсказка может быть в несколько строк — прочитайте целиком.' },
    { uz: "`Ctrl+S` → qidiruvga bitta mahsulot nomining boshini yozing: faqat o'sha mahsulot qoladimi?", ru: '`Ctrl+S` → впишите в поиск начало названия одного товара: остался только он?' },
    { uz: "`REJA.md` da bajarilgan qismlar yoniga ✓ qo'ying.", ru: 'В `REJA.md` поставьте ✓ рядом с готовыми частями.' }
  ]
};
const ScreenCopilot = ({ screen, onNext, onPrev }) => {
  const d = dkRead();
  const ozi = Array.isArray(d.katalog) ? d.katalog.filter(katToliq) : [];
  const items = ozi.length >= 4 ? ozi : dkNamuna();
  const nom = ozi.length >= 4 && d.nom && d.nom.trim() ? d.nom : tr(DK_NOM);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 3 · Copilot', ru: 'Практика 3 · Copilot' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: "Copilot bilan qidiruv qo'shing.", ru: 'Добавьте поиск с Copilot.' })}</h2></div>
        <Mentor>{tr({ uz: <>Copilot sahifangizdagi kodni o'qiydi va izohdan qidiruv funksiyasini yozadi. Nima qilishini <b style={{ color: T.ink }}>siz</b> aytasiz: izoh aniq bo'lsa, taklif ham aniq.</>, ru: <>Copilot читает код вашей страницы и по комментарию пишет функцию поиска. Что она делает, говорите <b style={{ color: T.ink }}>вы</b>: точный комментарий — точная подсказка.</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-karta fade-up delay-1">
              <KodNusxa yorliq={{ uz: '1 · index.html ga — toifa tugmalari ustiga', ru: '1 · в index.html — над кнопками категорий' }} kod={tr(A3_IZOH_HTML)} />
              <KodNusxa yorliq={{ uz: '2 · script.js ga — oxiriga', ru: '2 · в script.js — в конец' }} kod={tr(A3_IZOH_JS)} />
            </div>
            <Qadamlar b={A3} cls="fade-up delay-2" />
            <details className="am-yordam"><summary>{tr({ uz: 'Taklif chiqmadimi?', ru: 'Подсказка не появилась?' })}</summary><p>{tr({ uz: "Izohdan keyin Enter'ni yana bir bosing. Baribir chiqmasa — pastki chiziqdagi Copilot belgisini tekshiring yoki ikkala izohni Gemini'ga yuboring.", ru: 'Нажмите Enter после комментария ещё раз. Если нет — проверьте значок Copilot в нижней строке или отправьте оба комментария в Gemini.' })}</p></details>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Kutilgan natija · qidiruv ishlaydi', ru: 'Ожидаемый результат · поиск работает' })}</p>
            <DokonJonli nom={nom} items={items} q={Q_BUGUN} yangi="qidiruv" teg={{ qidiruv: 'Copilot' }} />
            <p className="small am-osti">{tr({ uz: "Yozib ko'ring — sizning saytingiz ham shunday ishlashi kerak.", ru: 'Попробуйте ввести — ваш сайт должен работать так же.' })}</p>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

