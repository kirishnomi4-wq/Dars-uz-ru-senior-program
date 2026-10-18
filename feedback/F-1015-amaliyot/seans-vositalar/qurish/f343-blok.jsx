// ===== F-1015-343: 19 → 8 ekran. Ip — m2-11 dagi jonli katalog (ccDokon): savat + jami (Gemini) → xato ovi → deploy (Netlify) =====
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
  { n: { uz: 'Ruchka', ru: 'Ручка' }, p: 3000, t: 'oquv' }, { n: { uz: "Chizg'ich", ru: 'Линейка' }, p: 4000, t: 'oquv' },
  { n: { uz: 'Sharbat', ru: 'Сок' }, p: 6000, t: 'ichimlik' }, { n: { uz: 'Suv', ru: 'Вода' }, p: 3000, t: 'ichimlik' },
  { n: { uz: 'Shokolad', ru: 'Шоколад' }, p: 8000, t: 'shirinlik' }, { n: { uz: 'Pechenye', ru: 'Печенье' }, p: 5000, t: 'shirinlik' }
];
const narxSon = (p) => parseInt(String(p ?? '').replace(/\D/g, ''), 10) || 0;
const somF = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const kamHarakat = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// O'quvchining katalogi (m2-11 a2 da yozgani); bo'lmasa — namuna
const dkKatalog = () => {
  const d = dkRead();
  const k = Array.isArray(d.katalog) ? d.katalog.filter(x => x && String(x.n || '').trim() && narxSon(x.p) > 0).map(x => ({ n: String(x.n).trim(), p: narxSon(x.p), t: DK_TOIFA.some(t => t.id === x.t) ? x.t : 'oquv' })) : [];
  if (k.length >= 2) return { nom: String(d.nom || '').trim() || tr(DK_NOM), items: k, oz: true };
  return { nom: tr(DK_NOM), items: DK_MAHSULOT.map(x => ({ n: tr(x.n), p: x.p, t: x.t })), oz: false };
};
const jamiSon = (items, savat) => savat.reduce((s, i) => s + items[i].p, 0);
// Xatoli kod: narx matn bo'lsa, «+» yopishtiradi — 0 + "3000" = "03000"
const jamiXato = (items, savat) => savat.reduce((s, i) => s + String(items[i].p), '0');

// Do'kon maketi: katalog + toifa tugmalari + qidiruv (o'tgan dars) va savat + jami (bugun).
// savat — massiv (indekslar) yoki null (savat hali yo'q); olik — «Savatga» bosilsa hech narsa bo'lmaydi (kirish ekrani)
const DokonSavat = ({ nom, items, url, savat = null, onSavatga, onTozala, jami = '0', xato = false, olik = false }) => {
  const [toifa, setToifa] = useState('hammasi');
  const [soz, setSoz] = useState('');
  const [silk, setSilk] = useState(-1);
  const silkT = useRef(null);
  useEffect(() => () => clearTimeout(silkT.current), []);
  const toifalar = DK_TOIFA.filter(t => items.some(x => x.t === t.id));
  const izla = soz.trim().toLowerCase();
  const korin = items.map((x, i) => ({ ...x, _i: i })).filter(x => (toifa === 'hammasi' || x.t === toifa) && (!izla || x.n.toLowerCase().includes(izla)));
  const bor = Array.isArray(savat);
  const bos = (i) => {
    if (olik) { clearTimeout(silkT.current); setSilk(-1); requestAnimationFrame(() => setSilk(i)); silkT.current = setTimeout(() => setSilk(-1), 500); }
    if (onSavatga) onSavatga(i);
  };
  return (
    <div className={`dk-sayt ${items.length > 4 ? 'dk-6' : ''}`}>
      <div className="dk-bar"><span className="bb-dots"><i /><i /><i /></span><span className="dk-url">{url || 'mini-dokon · Live Server'}</span></div>
      <div className="dk-body">
        <div className="dk-bosh">
          <p className="dk-h1">{nom}</p>
          {bor && <div className="dk-ong"><span key={savat.length} className={`dk-pill dk-savat ${savat.length ? 'dk-sanoq' : ''}`}>{tr({ uz: 'Savat', ru: 'Корзина' })} · {savat.length}</span></div>}
        </div>
        <input className="dk-qidir" value={soz} onChange={e => setSoz(e.target.value)} placeholder={tr({ uz: 'Qidirish...', ru: 'Поиск...' })} aria-label={tr({ uz: 'Qidiruv', ru: 'Поиск' })} />
        <div className="dk-filtr">{[{ id: 'hammasi', uz: 'Hammasi', ru: 'Все' }, ...toifalar].map(t => <button key={t.id} type="button" className={`dk-tf ${toifa === t.id ? 'on' : ''}`} aria-pressed={toifa === t.id} onClick={() => setToifa(t.id)}>{tr(t)}</button>)}</div>
        {korin.length ? (
          <div className="dk-grid">{korin.map(x => { const r = DK_RANG[x.t]; const tf = DK_TOIFA.find(t => t.id === x.t); return (
            <div key={x._i} className="dk-karta">
              <span className="dk-rasm" style={r ? { background: r[0] } : undefined} />
              {tf && <span className="dk-toifa" style={{ color: r[1] }}>{tr(tf)}</span>}
              <b>{x.n}</b>
              <span className="dk-narx">{somF(x.p)} {tr({ uz: "so'm", ru: 'сум' })}</span>
              <div className="dk-amal"><button type="button" className={`dk-savatga ${silk === x._i ? 'ql-silk' : ''}`} onClick={() => bos(x._i)}>{tr({ uz: 'Savatga', ru: 'В корзину' })}</button></div>
            </div>); })}</div>
        ) : <p className="dk-yoq-t">{tr({ uz: 'Hech narsa topilmadi', ru: 'Ничего не найдено' })}</p>}
        {bor && <div className={`dk-jami ${xato ? 'dk-jami-xato' : ''}`}>
          {savat.length ? <ul className="dk-savat-l">{savat.map((i, k) => <li key={k} className={k === savat.length - 1 ? 'dk-kir' : ''}><span>{items[i].n}</span><span>{somF(items[i].p)}</span></li>)}</ul>
            : <p className="dk-jami-bosh">{tr({ uz: "Savat bo'sh", ru: 'Корзина пуста' })}</p>}
          <div className="dk-jami-q">
            <span>{tr({ uz: 'Jami', ru: 'Итого' })}</span>
            <b key={jami} className="dk-kir">{jami} {tr({ uz: "so'm", ru: 'сум' })}</b>
            {onTozala && savat.length > 0 && <button type="button" className="dk-tozala" onClick={onTozala}>{tr({ uz: 'Tozalash', ru: 'Очистить' })}</button>}
          </div>
        </div>}
      </div>
    </div>
  );
};
// Savati o'zida turadigan maket (reja va deploy ekranlaridagi namuna)
const DokonOzi = ({ nom, items, url }) => {
  const [savat, setSavat] = useState([]);
  return <DokonSavat nom={nom} items={items} url={url} savat={savat} onSavatga={i => setSavat(s => [...s, i])} onTozala={() => setSavat([])} jami={somF(jamiSon(items, savat))} />;
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
const NusxaTugma = ({ matn, yorliq }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return <button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr(yorliq)}</button>;
};

// ===== SCREEN 0 — KIRISH: o'quvchining katalogi, «Savatga» bosilsa hech narsa bo'lmaydi =====
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const kat = useMemo(dkKatalog, []);
  const [bosildi, setBosildi] = useState(!!storedAnswer);
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const OPTS = [
    { id: 'a', label: tr({ uz: 'Bosilgan mahsulotni eslab qoladigan savat', ru: 'Корзина, которая запоминает выбранный товар' }) },
    { id: 'b', label: tr({ uz: 'Tugmaning yorqinroq rangi', ru: 'Более яркий цвет кнопки' }) },
    { id: 'c', label: tr({ uz: "Ko'proq mahsulot", ru: 'Больше товаров' }) }
  ];
  const pick = (v) => { if (picked !== null) return; setPicked(v); onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: true }); };
  const savolRef = useScrollIntoViewOnMobile(bosildi);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null} label={{ uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">{tr({ uz: <>Do'kon bor, lekin hech narsa <span className="italic" style={{ color: T.accent }}>sotib olib</span> bo'lmaydi.</>, ru: <>Магазин есть, но ничего <span className="italic" style={{ color: T.accent }}>не купить</span>.</> })}</h1>
        <Mentor>{kat.oz
          ? tr({ uz: <>O'tgan darsda qurgan katalogingiz shu. Biror kartochkadagi <b style={{ color: T.ink }}>«Savatga»</b> tugmasini bosing — nima bo'ladi?</>, ru: <>Вот каталог, который Вы построили на прошлом уроке. Нажмите <b style={{ color: T.ink }}>«В корзину»</b> на любой карточке — что произойдёт?</> })
          : tr({ uz: <>O'tgan darsdagi katalog shu. Biror kartochkadagi <b style={{ color: T.ink }}>«Savatga»</b> tugmasini bosing — nima bo'ladi?</>, ru: <>Вот каталог с прошлого урока. Нажмите <b style={{ color: T.ink }}>«В корзину»</b> на любой карточке — что произойдёт?</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{kat.oz ? tr({ uz: "Sizning do'koningiz · o'tgan darsdan", ru: 'Ваш магазин · с прошлого урока' }) : tr({ uz: "Katalog · o'tgan darsdan", ru: 'Каталог · с прошлого урока' })}</p>
            <DokonSavat nom={kat.nom} items={kat.items} olik onSavatga={() => setBosildi(true)} />
          </Col>
          <Col>
            <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: 'Natija', ru: 'Результат' })}</p>
            {!bosildi && <p className="small" style={{ margin: 0, opacity: 0.6, textAlign: 'center', padding: '24px 0' }}>{tr({ uz: '(hali bosilmadi)', ru: '(пока не нажато)' })}</p>}
            {bosildi && <div ref={savolRef} className="fade-step">
              <p className="hook-ack" style={{ marginTop: 0 }}>{tr({ uz: "Hech narsa bo'lmadi — tugma bor, lekin bosilganini hech kim eslab qolmaydi.", ru: 'Ничего не произошло — кнопка есть, но никто не запоминает нажатие.' })}</p>
              <p className="eyebrow" style={{ color: T.ink2, margin: '14px 0 9px' }}>{tr({ uz: 'Nima yetishmayapti?', ru: 'Чего не хватает?' })}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {OPTS.map(o => { const on = picked === o.id; return (
                  <button key={o.id} className={`hook-option ${on ? 'on' : ''}`} disabled={picked !== null} onClick={() => pick(o.id)}>
                    <span className="radio">{on && <span className="radio-dot" />}</span><span>{o.label}</span>
                  </button>); })}
              </div>
              {picked !== null && <p className="hook-ack fade-step">{picked === 'a'
                ? tr({ uz: <>To'g'ri! Tugma bosilganda dastur mahsulotni bir joyga yozib qo'yishi kerak — bu <b>savat</b>. Bugun uni JavaScript bilan qo'shamiz va do'konni internetga chiqaramiz.</>, ru: <>Верно! При нажатии программа должна куда-то записать товар — это <b>корзина</b>. Сегодня добавим её на JavaScript и выпустим магазин в интернет.</> })
                : tr({ uz: <>Aslida rang ham, mahsulot soni ham yordam bermaydi: dastur bosilgan mahsulotni bir joyga yozib qo'yishi kerak — bu <b>savat</b>. Bugun uni JavaScript bilan qo'shamiz va do'konni internetga chiqaramiz.</>, ru: <>На самом деле не помогут ни цвет, ни число товаров: программа должна куда-то записать нажатый товар — это <b>корзина</b>. Сегодня добавим её на JavaScript и выпустим магазин в интернет.</> })}</p>}
            </div>}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA: «Avval tayyorlaning ▾» + REJA.md (o'tgan darsdan) + 3 blok =====
const TAYYOR = [
  { uz: <>VS Code'da o'tgan darsdagi <span className="qcode">mini-dokon</span> papkasini oching, Go Live — katalog, toifa tugmalari va qidiruv ishlayaptimi?</>, ru: <>Откройте в VS Code папку <span className="qcode">mini-dokon</span> с прошлого урока, Go Live — каталог, кнопки категорий и поиск работают?</> },
  { uz: "Boshqa oynada gemini.google.com'ni oching.", ru: 'В другом окне откройте gemini.google.com.' },
  { uz: "netlify.com'ga GitHub bilan kiring — 1-moduldagi Netlify darsidagidek.", ru: 'Войдите на netlify.com через GitHub — как на уроке Netlify в 1-м модуле.' }
];
const REJA_BLOK = [
  { t: { uz: 'Savat va jami narx', ru: 'Корзина и итог' }, tag: 'Gemini' },
  { t: { uz: 'Xatoni topish', ru: 'Поиск ошибки' }, tag: { uz: 'siz + Gemini', ru: 'Вы + Gemini' } },
  { t: { uz: 'Internetga chiqarish', ru: 'Выпуск в интернет' }, tag: 'Netlify' }
];
const QISM_NOM = { royxat: { uz: "Mahsulot ro'yxati", ru: 'Список товаров' }, karta: { uz: 'Kartochkalar', ru: 'Карточки' }, filtr: { uz: 'Toifa tugmalari', ru: 'Кнопки категорий' }, qidiruv: { uz: 'Qidiruv', ru: 'Поиск' }, sevimli: { uz: 'Sevimli', ru: 'Избранное' }, savat: { uz: 'Savat', ru: 'Корзина' }, tolov: { uz: "To'lov", ru: 'Оплата' }, akkaunt: { uz: 'Akkaunt bilan kirish', ru: 'Вход в аккаунт' } };
// O'tgan darsdagi reja (ccDokon) → bugungi holat: «Shart» ✓, bugun — savat va deploy, «Keyin» — qolgani
const rejaBugun = () => {
  const d = dkRead();
  const toza = (a) => (Array.isArray(a) ? a.filter((id, i) => QISM_NOM[id] && a.indexOf(id) === i) : []);
  let shart = toza(d.rejaShart).slice(0, 4);
  if (!shart.length) shart = ['royxat', 'karta', 'filtr', 'qidiruv'];
  const keyin = Object.keys(QISM_NOM).filter(id => !shart.includes(id) && id !== 'savat');
  return { shart: shart.filter(id => id !== 'savat'), keyin };
};
const rejaBugunMatn = ({ shart, keyin }) => {
  const yoz = (L) => `${L === 'uz' ? "# Mini-do'kon — reja" : '# Мини-магазин — план'}\n\n${L === 'uz' ? '## Shart (MVP)' : '## Нужно (MVP)'}\n${shart.map((id, i) => `${i + 1}. ${QISM_NOM[id][L]} ✓`).join('\n')}\n\n${L === 'uz' ? '## Bugun' : '## Сегодня'}\n${L === 'uz' ? '- Savat va jami narx\n- Deploy' : '- Корзина и итог\n- Деплой'}\n\n${L === 'uz' ? '## Keyin' : '## Потом'}\n${keyin.map(id => `- ${QISM_NOM[id][L]}`).join('\n')}\n`;
  return tr({ uz: yoz('uz'), ru: yoz('ru') });
};
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
const Screen1 = ({ screen, onNext, onPrev }) => {
  const kat = useMemo(dkKatalog, []);
  const reja = useMemo(rejaBugun, []);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz', ru: 'Начинаем' }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Do'konni <span className="italic" style={{ color: T.accent }}>oxiriga</span> yetkazamiz.</>, ru: <>Доводим магазин <span className="italic" style={{ color: T.accent }}>до конца</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>O'tgan darsda katalog, toifa tugmalari va qidiruvni qurdingiz. Bugun <b style={{ color: T.ink }}>savat va jami narxni</b> qo'shasiz, xatoni topib tuzatasiz va do'konni internetga chiqarasiz — dars oxirida havolani do'stingizga yuborasiz.</>, ru: <>На прошлом уроке Вы построили каталог, кнопки категорий и поиск. Сегодня добавите <b style={{ color: T.ink }}>корзину и итоговую цену</b>, найдёте и исправите ошибку и выпустите магазин в интернет — в конце урока отправите ссылку другу.</> })}</Mentor>
        <TayyorTugma />
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: 'Dars oxirida · namuna', ru: 'К концу урока · образец' })}</p>
            <DokonOzi nom={kat.nom} items={kat.items} url="mini-dokon.netlify.app" />
          </Col>
          <Col>
            <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: 'Dars oxirida · namuna', ru: 'К концу урока · образец' })}</p>
            <div className="am-karta am-reja-k fade-up delay-1">
              <div className="am-prompt-h"><p className="flow-label">{tr({ uz: "REJA.md · o'tgan darsdan", ru: 'REJA.md · с прошлого урока' })}</p><NusxaTugma matn={rejaBugunMatn(reja)} yorliq={{ uz: 'Yangisini nusxalash', ru: 'Скопировать новый' }} /></div>
              <div className="rj-oyna">
                <div className="rj-body">
                  <div className="rj-h2">{tr({ uz: '## Shart (MVP)', ru: '## Нужно (MVP)' })}</div>
                  {reja.shart.map((id, i) => <div key={id} className="rj-li">{i + 1}. {tr(QISM_NOM[id])} <span className="rj-ok">✓</span></div>)}
                  <div className="rj-h2 rj-bugun">{tr({ uz: '## Bugun', ru: '## Сегодня' })}</div>
                  <div className="rj-li rj-bugun">{tr({ uz: '- Savat va jami narx', ru: '- Корзина и итог' })}</div>
                  <div className="rj-li rj-bugun">{tr({ uz: '- Deploy', ru: '- Деплой' })}</div>
                  <div className="rj-h2">{tr({ uz: '## Keyin', ru: '## Потом' })}</div>
                  <div className="rj-li rj-yoq">{reja.keyin.map(id => tr(QISM_NOM[id])).join(' · ')}</div>
                </div>
              </div>
              <hr className="am-chiziq" />
              <p className="flow-label">{tr({ uz: `Bugungi ${REJA_BLOK.length} blok`, ru: `${REJA_BLOK.length} блока сегодня` })}</p>
              <ol className="am-blok-qator">{REJA_BLOK.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
            </div>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a1 — Gemini: savat (massiv + push) va jami (for sikli funksiyada); kod oynasi har bosishda yangilanadi =====
const A1 = {
  qadamlar: [
    { uz: "«Savatga»ni bosing — kod oynasida savat massivi qanday o'sishini ko'ring.", ru: 'Нажимайте «В корзину» — в окне кода видно, как растёт массив корзины.' },
    { uz: "«Promptni nusxalash» → gemini.google.com'ga qo'ying, oxiriga `index.html`, `style.css` va `script.js` kodini qo'shing va yuboring.", ru: '«Скопировать промпт» → вставьте в gemini.google.com, в конце добавьте код `index.html`, `style.css` и `script.js` и отправьте.' },
    { uz: "Javobdagi fayllarni almashtiring, `Ctrl+S`.", ru: 'Замените файлы на файлы из ответа, `Ctrl+S`.' },
    { uz: "Live Server'da 2–3 mahsulot qo'shing: soni va jami to'g'rimi? Qo'lda hisoblab solishtiring.", ru: 'В Live Server добавьте 2–3 товара: количество и итог верны? Посчитайте вручную и сравните.' }
  ]
};
const a1Prompt = (nom) => tr({
  uz: `«${nom}» do'konimga savat va jami narx qo'sh. Toifa tugmalari va qidiruv ishlashda davom etsin.\n1. script.js da savat massivi bo'lsin: let savat = [];\n2. Har kartochkada «Savatga» tugmasi. Bosilganda mahsulot savat.push() bilan qo'shilsin.\n3. Tepada «Savat: N» — savatdagi mahsulotlar soni (savat.length).\n4. jamiHisobla() funksiyasi for sikli bilan savatdagi narxlarni qo'shib, «Jami: … so'm» qatoriga yozsin. Har qo'shilganda chaqirilsin.\nHar bo'limga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.\nMana kodim:\n{index.html, style.css va script.js kodini shu yerga qo'ying}`,
  ru: `Добавь в мой магазин «${nom}» корзину и итоговую цену. Кнопки категорий и поиск пусть продолжают работать.\n1. В script.js пусть будет массив корзины: let savat = [];\n2. На каждой карточке кнопка «В корзину». По нажатию товар добавляется через savat.push().\n3. Вверху «Корзина: N» — число товаров в корзине (savat.length).\n4. Функция jamiHisobla() циклом for складывает цены товаров в корзине и пишет их в строку «Итого: … сум». Вызывай её после каждого добавления.\nК каждому разделу — короткий комментарий. Измененные файлы верни целиком.\nВот мой код:\n{вставьте сюда код index.html, style.css и script.js}`
});
// Kod oynasi — savat va jami o'zgaruvchilarining hozirgi qiymati
const SavatKod = ({ items, savat, oxirgi }) => {
  const nomlar = savat.map(i => `"${items[i].n}"`);
  const narxlar = savat.map(i => items[i].p);
  const yigindi = narxlar.length > 5 ? `${narxlar.slice(0, 4).join(' + ')} + …` : narxlar.join(' + ');
  return (
    <div className="rj-oyna sk-oyna">
      <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">script.js · {tr({ uz: 'qiymatlar hozir', ru: 'значения сейчас' })}</span></div>
      <div className="rj-body">
        <div className="sk-izoh">// {tr({ uz: 'oxirgi amal', ru: 'последнее действие' })}</div>
        <div key={oxirgi + savat.length} className="rj-li sk-nur">{oxirgi || '—'}</div>
        <div className="sk-izoh">// {tr({ uz: 'hozir', ru: 'сейчас' })}</div>
        <div className="rj-li"><span className="sk-k">savat</span> = [{nomlar.join(', ')}];  <span className="sk-izoh">// savat.length = {savat.length}</span></div>
        <div className="rj-li"><span className="sk-k">jami</span> = {jamiSon(items, savat)};{narxlar.length > 1 && <>  <span className="sk-izoh">// for: {yigindi}</span></>}</div>
      </div>
    </div>
  );
};
const ScreenSavat = ({ screen, onNext, onPrev }) => {
  const kat = useMemo(dkKatalog, []);
  const [savat, setSavat] = useState([]);
  const [oxirgi, setOxirgi] = useState('');
  const qosh = (i) => { setSavat(s => [...s, i]); setOxirgi(`savat.push("${kat.items[i].n}");`); };
  const tozala = () => { setSavat([]); setOxirgi('savat = [];'); };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 1 · Gemini', ru: 'Практика 1 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>Savat</span> va jami narxni qo'shing.</>, ru: <>Добавьте <span className="italic" style={{ color: T.accent }}>корзину</span> и итоговую цену.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Savat — bu <b style={{ color: T.ink }}>massiv</b>: «Savatga» bosilganda mahsulot unga <span className="qcode">push</span> bilan qo'shiladi. Jami — <b style={{ color: T.ink }}>for sikli</b> bilan narxlar yig'indisi. Bosib ko'ring: pastdagi kod har safar o'zgaradi.</>, ru: <>Корзина — это <b style={{ color: T.ink }}>массив</b>: при нажатии «В корзину» товар добавляется в него через <span className="qcode">push</span>. Итог — сумма цен через <b style={{ color: T.ink }}>цикл for</b>. Попробуйте: код ниже меняется при каждом нажатии.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "Do'kon · bosib ko'ring", ru: 'Магазин · попробуйте' })}</p>
            <DokonSavat nom={kat.nom} items={kat.items} savat={savat} onSavatga={qosh} onTozala={tozala} jami={somF(jamiSon(kat.items, savat))} />
            <SavatKod items={kat.items} savat={savat} oxirgi={oxirgi} />
          </Col>
          <Col>
            <PromptBlok matn={a1Prompt(kat.nom)} />
            <QadamTugma b={A1} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a2 — xato ovi: narx matn ("3000") bo'lib qolgan → jami «030006000»; o'quvchi topadi, tuzatadi, o'z do'konini tekshiradi =====
const A2 = {
  qadamlar: [
    { uz: "Do'konga 2 ta mahsulot qo'shing va jamiga qarang — qaysi qismda xato?", ru: 'Добавьте в магазин 2 товара и посмотрите на итог — в какой части ошибка?' },
    { uz: 'Kodda aybdor qatorni toping va tuzating.', ru: 'Найдите в коде виноватую строку и исправьте её.' },
    { uz: "O'z do'koningizni ro'yxat bo'yicha tekshiring.", ru: 'Проверьте свой магазин по списку.' },
    { uz: "Xato topsangiz — ikki maydonni to'ldiring va promptni Gemini'ga yuboring. Xato bo'lmasa — keyingi qadamga o'ting.", ru: 'Нашли ошибку — заполните два поля и отправьте промпт в Gemini. Ошибок нет — переходите к следующему шагу.' }
  ]
};
const A2_QISM = [
  { id: 'soni', uz: 'Savat soni', ru: 'Число в корзине' },
  { id: 'jami', uz: 'Jami narx', ru: 'Итоговая цена' },
  { id: 'nom', uz: 'Mahsulot nomi', ru: 'Название товара' }
];
const A2_TEKSHIR = [
  { uz: "Bitta mahsulotni 2 marta qo'shing — soni 2, jami 2 barobar bo'ladimi?", ru: 'Добавьте один товар 2 раза — число 2, итог вдвое больше?' },
  { uz: "2 xil mahsulot qo'shing — jamini qo'lda hisoblab solishtiring.", ru: 'Добавьте 2 разных товара — посчитайте итог вручную и сравните.' },
  { uz: "Toifa tugmasini yoki qidiruvni ishlatib, keyin «Savatga»ni bosing — ishlaydimi?", ru: 'Нажмите кнопку категории или воспользуйтесь поиском, потом «В корзину» — работает?' }
];
const a2Prompt = (nima, qanday) => tr({
  uz: `Do'konimda xato bor — faqat shu joyni tuzat, qolganiga tegma.\nNima bo'ldi: ${nima.trim() || "{nima bo'ldi}"}\nNima bo'lishi kerak: ${qanday.trim() || "{nima bo'lishi kerak}"}\nXato qaysi qatorda va nega bo'lganini bir gap bilan tushuntir. O'zgargan faylni to'liq qaytar.\nMana kodim:\n{script.js kodini shu yerga qo'ying}`,
  ru: `В моём магазине ошибка — исправь только это место, остальное не трогай.\nЧто случилось: ${nima.trim() || '{что случилось}'}\nКак должно быть: ${qanday.trim() || '{как должно быть}'}\nОбъясни одной фразой, в какой строке ошибка и почему. Измененный файл верни целиком.\nВот мой код:\n{вставьте сюда код script.js}`
});
// Xatoli kod: 2–3 qatorda narx qo'shtirnoqda (matn); tuzatilgach — son
const BugKod = ({ items, savat, tuzatildi, tanlangan, onQator }) => {
  const q = (n) => (tuzatildi ? String(n) : `"${n}"`);
  // massivda savatdagi birinchi ikki xil mahsulot ko'rinadi (bo'lmasa — katalogdagi birinchi ikkitasi)
  const ikki = [...new Set([...savat, 0, 1])].slice(0, 2).map(i => items[i]);
  const QATOR = [
    'let mahsulotlar = [',
    `  { nom: "${ikki[0].n}", narx: ${q(ikki[0].p)} },`,
    `  { nom: "${ikki[1].n}", narx: ${q(ikki[1].p)} },`,
    '];',
    'function jamiHisobla() {',
    '  let jami = 0;',
    '  for (let i = 0; i < savat.length; i++) jami = jami + savat[i].narx;',
    tr({ uz: '  jamiQator.textContent = "Jami: " + jami + " so\'m";', ru: '  jamiQator.textContent = "Итого: " + jami + " сум";' }),
    '}'
  ];
  return (
    <div className="rj-oyna bk-oyna fade-step">
      <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">script.js</span></div>
      <div className="bk-body">
        {QATOR.map((t, i) => { const n = i + 1; const ok = tuzatildi && (n === 2 || n === 3); return (
          <button key={i} type="button" className={`bk-q ${tanlangan === n ? (n === 2 || n === 3 ? 'bk-topildi' : 'bk-emas') : ''} ${ok ? 'bk-tuzaldi' : ''}`} disabled={tuzatildi} onClick={() => onQator(n)}>
            <span className="bk-n">{n}</span><span className="bk-t">{t}</span>
          </button>); })}
      </div>
    </div>
  );
};
const ScreenXato = ({ screen, onNext, onPrev }) => {
  const kat = useMemo(dkKatalog, []);
  const [savat, setSavat] = useState([]);
  const [qism, setQism] = useState(null);
  const [qator, setQator] = useState(null);
  const [tuzatildi, setTuzatildi] = useState(false);
  const [nima, setNima] = useState('');
  const [qanday, setQanday] = useState('');
  const kodRef = useScrollIntoViewOnMobile(qism === 'jami');
  const ikki = savat.length >= 2;
  const jamiOk = jamiSon(kat.items, savat);
  const topildi = qator === 2 || qator === 3;
  const qismXabar = qism === 'jami'
    ? { t: 'info', m: tr({ uz: `To'g'ri: ${savat.slice(0, 2).map(i => kat.items[i].p).join(' + ')} bo'lsa, ${somF(jamiSon(kat.items, savat.slice(0, 2)))} chiqishi kerak edi. Endi kodda sababini toping — aybdor qatorni bosing.`, ru: `Верно: ${savat.slice(0, 2).map(i => kat.items[i].p).join(' + ')} должно давать ${somF(jamiSon(kat.items, savat.slice(0, 2)))}. Теперь найдите причину в коде — нажмите на виноватую строку.` }) }
    : qism === 'soni' ? { t: 'xato', m: tr({ uz: "Soni to'g'ri: nechta qo'shsangiz, shuncha. Jamiga qarang.", ru: 'Число верное: сколько добавили, столько и есть. Посмотрите на итог.' }) }
    : qism === 'nom' ? { t: 'xato', m: tr({ uz: "Nomlar to'g'ri. Jamini qo'lda hisoblab ko'ring.", ru: 'Названия верные. Посчитайте итог вручную.' }) } : null;
  const qatorXabar = qator === null || topildi ? null
    : qator === 7 ? tr({ uz: "Qo'shish shu yerda bo'ladi va qatorning o'zi to'g'ri. Narx qanday saqlangan? Massivga qarang.", ru: 'Сложение происходит здесь, и сама строка верная. Как хранится цена? Посмотрите на массив.' })
    : qator === 6 ? tr({ uz: 'jami = 0 — son, hisob to\'g\'ri boshlanadi.', ru: 'jami = 0 — число, счёт начинается верно.' })
    : tr({ uz: "Bu qatorda xato yo'q. «+» qaysi qiymatlarni qo'shyapti?", ru: 'В этой строке ошибки нет. Какие значения складывает «+»?' });
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · xato ovi', ru: 'Практика 2 · поиск ошибки' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Xatoni toping va AI'ga <span className="italic" style={{ color: T.accent }}>aniq</span> ayting.</>, ru: <>Найдите ошибку и <span className="italic" style={{ color: T.accent }}>точно</span> опишите её AI.</> })}</h2></div>
        <Mentor>{tr({ uz: <>AI yozgan kodda ham xato bo'ladi. Bu do'konda <b style={{ color: T.ink }}>bitta xato</b> yashiringan: 2 ta mahsulot qo'shing va jamiga qarang.</>, ru: <>В коде, который пишет AI, тоже бывают ошибки. В этом магазине спрятана <b style={{ color: T.ink }}>одна ошибка</b>: добавьте 2 товара и посмотрите на итог.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tuzatildi ? tr({ uz: "Do'kon · tuzatildi", ru: 'Магазин · исправлено' }) : tr({ uz: "Do'kon · bitta xato bor", ru: 'Магазин · есть одна ошибка' })}</p>
            <DokonSavat nom={kat.nom} items={kat.items} savat={savat} onSavatga={i => setSavat(s => [...s, i])} onTozala={() => setSavat([])} jami={tuzatildi ? somF(jamiOk) : jamiXato(kat.items, savat)} xato={!tuzatildi && savat.length > 0} />
            {qism === 'jami' && <div ref={kodRef}><BugKod items={kat.items} savat={savat} tuzatildi={tuzatildi} tanlangan={qator} onQator={setQator} /></div>}
          </Col>
          <Col>
            <div className="am-karta">
              <p className="flow-label">{tr({ uz: '1 · Qaysi qismda xato?', ru: '1 · В какой части ошибка?' })}</p>
              {!ikki && qism !== 'jami' && <p className="am-satr">{tr({ uz: "Avval 2 ta mahsulotni savatga qo'shing.", ru: 'Сначала добавьте 2 товара в корзину.' })}</p>}
              <div className="am-chips">{A2_QISM.map(o => <button key={o.id} type="button" className={`am-chip ${qism === o.id ? 'on' : ''}`} aria-pressed={qism === o.id} disabled={(!ikki && qism !== 'jami') || qism === 'jami'} onClick={() => setQism(o.id)}>{tr(o)}</button>)}</div>
              {qismXabar && <p key={qism} className={`ql-xabar ${qismXabar.t}`} role="status">{qismXabar.m}</p>}
            </div>
            {qism === 'jami' && <div className="am-karta am-ochil">
              <p className="flow-label">{tr({ uz: '2 · Kodda qaysi qator aybdor?', ru: '2 · Какая строка в коде виновата?' })}</p>
              {!topildi && <p className="am-satr">{tr({ uz: 'Koddagi qatorni bosing.', ru: 'Нажмите на строку в коде.' })}</p>}
              {qatorXabar && <p key={qator} className="ql-xabar xato" role="status">{qatorXabar}</p>}
              {topildi && <>
                <p className="am-osti">{tr({ uz: <>Narx <b>qo'shtirnoqda</b> — demak bu matn. Matnga «+» yopishtiradi: <span className="qcode">0 + "3000" = "03000"</span>. Son bo'lsa qo'shadi: <span className="qcode">0 + 3000 = 3000</span>.</>, ru: <>Цена в <b>кавычках</b> — значит, это текст. К тексту «+» приклеивает: <span className="qcode">0 + "3000" = "03000"</span>. С числом — складывает: <span className="qcode">0 + 3000 = 3000</span>.</> })}</p>
                {!tuzatildi && <button type="button" className="am-saqla" onClick={() => setTuzatildi(true)}>{tr({ uz: "Qo'shtirnoqni olib tashlash", ru: 'Убрать кавычки' })}</button>}
                {tuzatildi && <p className="ql-xabar info" role="status">{tr({ uz: `Tuzaldi! Narx endi son, jami to'g'ri: ${somF(jamiOk)} so'm.`, ru: `Исправлено! Цена теперь число, итог верный: ${somF(jamiOk)} сум.` })}</p>}
              </>}
            </div>}
            {tuzatildi && <div className="am-karta am-ochil">
              <p className="flow-label">{tr({ uz: "3 · Endi o'z do'koningizni tekshiring", ru: '3 · Теперь проверьте свой магазин' })}</p>
              <ul className="am-band">{A2_TEKSHIR.map((x, i) => <li key={i}>{tr(x)}</li>)}</ul>
              <p className="am-satr">{tr({ uz: "Xato topsangiz — AI'ga aniq yozing:", ru: 'Нашли ошибку — точно напишите AI:' })}</p>
              <label className="am-maydon"><span>{tr({ uz: "Nima bo'ldi?", ru: 'Что случилось?' })}</span><input className="am-input" value={nima} onChange={e => setNima(e.target.value)} placeholder={tr({ uz: "masalan: jami 03000 so'm chiqyapti", ru: 'например: итог показывает 03000 сум' })} /></label>
              <label className="am-maydon"><span>{tr({ uz: "Nima bo'lishi kerak?", ru: 'Как должно быть?' })}</span><input className="am-input" value={qanday} onChange={e => setQanday(e.target.value)} placeholder={tr({ uz: "masalan: 3000 + 6000 = 9 000 so'm chiqsin", ru: 'например: 3000 + 6000 = 9 000 сум' })} /></label>
            </div>}
            {tuzatildi && <PromptBlok matn={a2Prompt(nima, qanday)} />}
            <QadamTugma b={A2} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a3 — Netlify: papkani sudrab tashlash (m1-11 yo'li) → havola → ulashish kartasi =====
const A3_QADAM = [
  { uz: "netlify.com'ni oching va GitHub bilan kiring.", ru: 'Откройте netlify.com и войдите через GitHub.' },
  { uz: "Projects sahifasining eng pastiga tushing — papka tashlanadigan katta maydon bor (topilmasa: app.netlify.com/drop).", ru: 'Спуститесь в самый низ страницы Projects — там большое поле для папки (если не нашли: app.netlify.com/drop).' },
  { uz: "`mini-dokon` papkasini shu maydonga sudrab tashlang — papkaning o'zini, fayllarni birma-bir emas.", ru: 'Перетащите папку `mini-dokon` в это поле — саму папку, а не файлы по одному.' },
  { uz: "Havola chiqadi (oxiri .netlify.app) — nusxalang va shu yerga qo'ying.", ru: 'Появится ссылка (заканчивается на .netlify.app) — скопируйте и вставьте сюда.' },
  { uz: "Havolani telefoningizda oching: savat va jami ishlayaptimi?", ru: 'Откройте ссылку на телефоне: корзина и итог работают?' }
];
const havolaToza = (s) => String(s || '').trim();
const havolaOk = (s) => /^https?:\/\/[^\s/]+\.[^\s/]+(\/\S*)?$/i.test(havolaToza(s));
const ScreenDeploy = ({ screen, onNext, onPrev }) => {
  const kat = useMemo(dkKatalog, []);
  const [havola, setHavola] = useState(() => dkRead().havola || '');
  const [saqlangan, setSaqlangan] = useState(() => havolaOk(dkRead().havola));
  const ok = havolaOk(havola);
  const netlify = /\.netlify\.app(\/|$)/i.test(havolaToza(havola));
  const saqla = () => { if (!ok) return; dkWrite({ havola: havolaToza(havola) }); setSaqlangan(true); };
  const host = ok ? havolaToza(havola).replace(/^https?:\/\//i, '').replace(/\/.*$/, '') : 'mini-dokon.netlify.app';
  const xabar = tr({ uz: `Mening do'konim: ${havolaToza(havola)} — savatga biror narsa qo'shib ko'r!`, ru: `Мой магазин: ${havolaToza(havola)} — попробуй что-нибудь добавить в корзину!` });
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 3 · Netlify', ru: 'Практика 3 · Netlify' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Do'konni <span className="italic" style={{ color: T.accent }}>internetga</span> chiqaring.</>, ru: <>Выпустите магазин <span className="italic" style={{ color: T.accent }}>в интернет</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>1-moduldagi yo'l: Netlify'ga <b style={{ color: T.ink }}>papkani sudrab tashlaysiz</b> — havola tayyor. Havolani shu yerga qo'ying: do'konni ulashadigan karta chiqadi.</>, ru: <>Путь из 1-го модуля: <b style={{ color: T.ink }}>перетаскиваете папку</b> в Netlify — ссылка готова. Вставьте ссылку сюда: появится карточка, чтобы поделиться магазином.</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-karta">
              <p className="flow-label">{tr({ uz: 'Netlify · 5 qadam', ru: 'Netlify · 5 шагов' })}</p>
              <ol className="am-qadam">{A3_QADAM.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
            </div>
            {!saqlangan && <div className="am-karta">
              <label className="am-maydon"><span>{tr({ uz: 'Netlify bergan havola', ru: 'Ссылка от Netlify' })}</span><input className="am-input" value={havola} onChange={e => setHavola(e.target.value)} placeholder="https://….netlify.app" inputMode="url" /></label>
              {ok && !netlify && <p className="am-satr">{tr({ uz: "Netlify havolasi odatda .netlify.app bilan tugaydi — tekshirib ko'ring.", ru: 'Ссылка Netlify обычно заканчивается на .netlify.app — проверьте.' })}</p>}
              <button type="button" className="am-saqla" disabled={!ok} onClick={saqla}>{ok ? tr({ uz: 'Saqlash', ru: 'Сохранить' }) : tr({ uz: 'Havolani qo\'ying', ru: 'Вставьте ссылку' })}</button>
            </div>}
            {saqlangan && <div className="am-karta dp-karta am-ochil">
              <div className="am-prompt-h"><p className="am-tayyor-ok">{tr({ uz: "Do'koningiz internetda!", ru: 'Ваш магазин в интернете!' })}</p><button type="button" className="am-nusxa" onClick={() => setSaqlangan(false)}>{tr({ uz: 'Tahrirlash', ru: 'Изменить' })}</button></div>
              <a className="dp-havola" href={havolaToza(havola)} target="_blank" rel="noopener noreferrer">{havolaToza(havola)}</a>
              <p className="am-satr">{tr({ uz: 'Do\'stingizga yuboring:', ru: 'Отправьте другу:' })}</p>
              <pre className="am-masalan">{xabar}</pre>
              <div className="am-chips"><NusxaTugma matn={xabar} yorliq={{ uz: 'Xabarni nusxalash', ru: 'Скопировать сообщение' }} /><NusxaTugma matn={havolaToza(havola)} yorliq={{ uz: 'Havolani nusxalash', ru: 'Скопировать ссылку' }} /></div>
            </div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Kutilgan natija · internetda', ru: 'Ожидаемый результат · в интернете' })}</p>
            <DokonOzi nom={kat.nom} items={kat.items} url={host} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
