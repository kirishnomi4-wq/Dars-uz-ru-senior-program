// ===== F-1015-303 · Praktika qolipi (pilot): ish VS Code + Gemini + Live Server'da, ustoz bilan birga =====
// Dars ekrani faqat yo'l ko'rsatadi: vazifa · prompt maslahati · kutilgan natija surati. Isbot va qulf yo'q (GATE Q-1015, F-1015-302).

// ----- Namuna kodlari (ortda qolgan o'quvchi uchun; index.html — HTML Praktika oxiridagi sahifa) -----
const NAMUNA_HTML = `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Aziza Karimova</h1>
    <p>Frontend dasturchi</p>
    <nav>
      <a href="#men">Men haqimda</a>
      <a href="#loyihalar">Loyihalarim</a>
      <a href="#aloqa">Aloqa</a>
    </nav>
  </header>

  <section id="men">
    <h2>Men haqimda</h2>
    <p>Salom! Men HTML o'rganyapman va o'z saytimni yasayapman.</p>
  </section>

  <section id="loyihalar">
    <h2>Loyihalarim</h2>
    <ul>
      <li>Birinchi HTML sahifam</li>
      <li>Ro'yxatdan o'tish formasi</li>
      <li>CSS bilan bezalgan kartochka</li>
    </ul>
  </section>

  <section id="aloqa">
    <h2>Aloqa</h2>
    <a href="mailto:aziza@mail.uz">Pochta</a>
  </section>

  <footer>Aziza Karimova, 2026</footer>
</body>
</html>
`;
// style.css — a1 boshi (HTML Praktika dizayni) → a2 boshi (+ menyu tugmalari) → a3 boshi (+ kartochkalar)
const NAMUNA_CSS_0 = `body { margin: 0; font-family: Arial, sans-serif; background: #f2f2f2; color: #222; }
header { background: #1b2238; color: #fff; text-align: center; padding: 32px 24px; }
header p { color: #ffb199; }
nav { display: flex; justify-content: center; gap: 16px; margin-top: 16px; }
nav a { color: #fff; }
section { max-width: 800px; margin: 24px auto; background: #fff; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }
h2 { color: #ff4f28; }
footer { background: #1b2238; color: #fff; text-align: center; padding: 16px; }
`;
const NAMUNA_CSS_1 = NAMUNA_CSS_0 + `nav a { text-decoration: none; background: rgba(255, 255, 255, 0.12); padding: 8px 16px; border-radius: 999px; }
nav a:hover { background: #ff4f28; }
`;
const NAMUNA_CSS_2 = NAMUNA_CSS_1 + `#loyihalar ul { display: flex; gap: 16px; padding: 0; list-style: none; }
#loyihalar li { flex: 1; border: 2px solid #ff4f28; border-radius: 12px; padding: 16px; }
`;

// «Namuna kodini nusxalash» — clipboard yopiq bo'lsa, namunani ustoz beradi (HtmlPractice naqshi)
const NamunaBtn = ({ kod, label = { uz: 'Namuna kodini nusxalash', ru: 'Скопировать код образца' } }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(kod); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq */ } };
  return <button type="button" className="am-namuna" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr(label)}</button>;
};

// ----- Bitta vizual: portfolio sahifasi, 4 holat (boshi → tugma → karta → rang) -----
const PS_MENYU = [{ uz: 'Men haqimda', ru: 'Обо мне' }, { uz: 'Loyihalarim', ru: 'Мои проекты' }, { uz: 'Aloqa', ru: 'Контакты' }];
const PS_LOYIHALAR = [{ uz: 'Birinchi HTML sahifam', ru: 'Моя первая HTML-страница' }, { uz: "Ro'yxatdan o'tish formasi", ru: 'Форма регистрации' }, { uz: 'CSS bilan bezalgan kartochka', ru: 'Карточка, оформленная CSS' }];
const PS_DARAJA = { boshi: 0, tugma: 1, karta: 2, rang: 3 };
const PfSahifa = ({ holat = 'boshi', halqa = null }) => {
  const d = PS_DARAJA[holat] || 0;
  const cls = ['ps', d >= 1 ? 'ps-tugma' : '', d >= 2 ? 'ps-karta' : '', d >= 3 ? 'ps-rang' : ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <div className="ps-bar"><span className="bb-dots"><i /><i /><i /></span><span className="ps-url">{tr({ uz: 'portfolio · Live Server', ru: 'portfolio · Live Server' })}</span></div>
      <div className="ps-body">
        <div className="ps-hd">
          <p className="ps-h1">Aziza Karimova</p>
          <p className="ps-yon">{tr({ uz: 'Frontend dasturchi', ru: 'Фронтенд-разработчик' })}</p>
          <div className={`ps-nav ${halqa === 'menyu' ? 'ps-halqa' : ''}`}>
            {PS_MENYU.map((m, i) => <span key={i} className={`ps-a ${d >= 1 && i === 1 ? 'ps-ustida' : ''}`}>{tr(m)}{d >= 1 && i === 1 && <span className="ps-kursor" aria-hidden="true" />}</span>)}
          </div>
        </div>
        <div className="ps-sec"><p className="ps-h2">{tr({ uz: 'Men haqimda', ru: 'Обо мне' })}</p><p className="ps-p">{tr({ uz: "Salom! Men HTML o'rganyapman va o'z saytimni yasayapman.", ru: 'Привет! Я изучаю HTML и делаю свой сайт.' })}</p></div>
        <div className={`ps-sec ${halqa === 'loyiha' ? 'ps-halqa' : ''}`}><p className="ps-h2">{tr({ uz: 'Loyihalarim', ru: 'Мои проекты' })}</p><ul className="ps-ul">{PS_LOYIHALAR.map((l, i) => <li key={i}>{tr(l)}</li>)}</ul></div>
        <div className="ps-sec"><p className="ps-h2">{tr({ uz: 'Aloqa', ru: 'Контакты' })}</p><span className="ps-pochta">{tr({ uz: 'Pochta', ru: 'Почта' })}</span></div>
        <div className="ps-ft">Aziza Karimova, 2026</div>
      </div>
    </div>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish): o'tgan dars ↔ bugun oxirida — nima o'zgargan? =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: "Faqat style.css o'zgargan, matnlar o'sha-o'sha", ru: 'Изменился только style.css, тексты те же' } },
  { id: 'b', label: { uz: 'HTML butunlay qaytadan yozilgan', ru: 'HTML полностью переписан заново' } },
  { id: 'c', label: { uz: "Bu boshqa odamning sayti", ru: 'Это сайт другого человека' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const isNarrow = useIsMobile(768);
  const resultRef = useRef(null);
  const pick = (v) => {
    if (picked !== null) return;
    setPicked(v);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: v, correct: v === 'a' });
    if (isNarrow) setTimeout(() => { if (resultRef.current) resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 140);
  };
  return (
    <Stage eyebrow={tr({ uz: 'CSS Praktika · kirish', ru: 'CSS практика · введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null} label={picked === null ? { uz: 'Javobni tanlang', ru: 'Выберите ответ' } : { uz: 'Davom etish', ru: 'Продолжить' }} onClick={onNext} />}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <h1 className="title h-title fade-up">{tr({ uz: <>Bu sahifada nima <span className="italic" style={{ color: T.accent }}>o'zgargan</span>?</>, ru: <>Что <span className="italic" style={{ color: T.accent }}>изменилось</span> на этой странице?</> })}</h1>
        <Mentor>{tr({ uz: <>Chapda — o'tgan darsdagi sahifangiz, o'ngda — bugun oxirida shunday bo'ladi. Ikkalasiga qarang va javobni tanlang.</>, ru: <>Слева — ваша страница с прошлого урока, справа — такой она станет сегодня к концу. Посмотрите на обе и выберите ответ.</> })}</Mentor>
        <Split three>
          <Col><p className="flow-label">{tr({ uz: "O'tgan dars", ru: 'Прошлый урок' })}</p><PfSahifa holat="boshi" /></Col>
          <Col><p className="flow-label">{tr({ uz: 'Bugun oxirida', ru: 'Сегодня к концу' })}</p><PfSahifa holat="rang" /></Col>
          <Col>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 26 }}>
              {HOOK_OPTS.map((o, i) => { const on = picked === o.id; return (<button key={o.id} className={`hook-option am-navbat ${on ? 'on' : ''}`} style={{ animationDelay: `${0.25 + i * 0.35}s` }} disabled={picked !== null} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>); })}
            </div>
            {picked !== null && (
              <div ref={resultRef} className={`${picked === 'a' ? 'frame-success' : 'frame-soft'} fade-step`}>
                <p className="body" style={{ margin: 0, color: T.ink }}>{picked === 'a'
                  ? tr({ uz: <><b>Aynan!</b> Ism, bo'limlar, matnlar — o'sha. O'zgargani faqat <span className="qcode">style.css</span>.</>, ru: <><b>Именно!</b> Имя, разделы, тексты — те же. Изменился только <span className="qcode">style.css</span>.</> })
                  : tr({ uz: <><b>Qiziq fikr!</b> Matnlarga qarang: ism va bo'limlar o'sha. O'zgargani faqat <span className="qcode">style.css</span>.</>, ru: <><b>Интересная мысль!</b> Посмотрите на тексты: имя и разделы те же. Изменился только <span className="qcode">style.css</span>.</> })}</p>
              </div>
            )}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — TAYYORGARLIK (QReja): 3 qator + bugungi 3 blok =====
const REJA_BLOK = [
  { t: { uz: 'Menyu — tugmalar', ru: 'Меню — кнопки' }, tag: ':hover' },
  { t: { uz: 'Loyihalar — kartochkalar', ru: 'Проекты — карточки' }, tag: 'flex' },
  { t: { uz: "O'z rangingiz", ru: 'Ваш цвет' }, tag: 'Ctrl+H' }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
    <div className="screen">
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun nimani <span className="italic" style={{ color: T.accent }}>o'zgartirasiz</span>?</>, ru: <>Что вы сегодня <span className="italic" style={{ color: T.accent }}>измените</span>?</> })}</h2></div>
      <Mentor>{tr({ uz: <>Bugun faqat <span className="qcode">style.css</span> ustida ishlaymiz — HTML o'zgarmaydi. Ikki blokni Gemini bilan, uchinchisini o'zingiz qilasiz.</>, ru: <>Сегодня работаем только со <span className="qcode">style.css</span> — HTML не меняется. Два блока делаете с Gemini, третий — сами.</> })}</Mentor>
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Tayyorlanish', ru: 'Подготовка' })}</p>
          <ol className="am-qadam fade-up delay-1">
            <li><span className="am-qn">1</span><span>{tr({ uz: <>VS Code'da <span className="qcode">portfolio</span> papkasini oching, <span className="qcode">style.css</span> ni oching, Go Live.</>, ru: <>Откройте в VS Code папку <span className="qcode">portfolio</span>, откройте <span className="qcode">style.css</span>, Go Live.</> })}</span></li>
            <li><span className="am-qn">2</span><span>{tr({ uz: "Boshqa oynada gemini.google.com'ni oching.", ru: 'В другом окне откройте gemini.google.com.' })}</span></li>
            <li><span className="am-qn">3</span><span>{tr({ uz: 'Ustoz bilan birga — har blokni hamma birga boshlaydi.', ru: 'Вместе с учителем — каждый блок начинаем все вместе.' })}</span></li>
          </ol>
          <div className="am-past fade-up delay-2">
            <span>{tr({ uz: "O'tgan darsdagi sahifangiz yo'qmi? Nusxalab, o'z faylingizga qo'ying:", ru: 'Нет страницы с прошлого урока? Скопируйте и вставьте в свой файл:' })}</span>
            <span className="am-past-btn"><NamunaBtn kod={NAMUNA_HTML} label={{ uz: 'index.html namunasi', ru: 'Образец index.html' }} /><NamunaBtn kod={NAMUNA_CSS_0} label={{ uz: 'style.css namunasi', ru: 'Образец style.css' }} /></span>
          </div>
        </Col>
        <Col>
          <p className="flow-label">{tr({ uz: 'Bugungi 3 blok', ru: '3 блока сегодня' })}</p>
          <ol className="roadmap">{REJA_BLOK.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.t)}</span><span className="step-tag">{s.tag}</span></span></li>))}</ol>
          <PfSahifa holat="rang" />
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== a1 · a2 · a3 — AMALIYOT BLOKLARI (vazifa · prompt maslahati · kutilgan natija; o'tish — «Davom etish») =====
const AMALIYOT = {
  a1: {
    eyebrow: { uz: 'Amaliyot 1 · menyu', ru: 'Практика 1 · меню' },
    title: { uz: 'Menyu havolalarini tugmaga aylantiring.', ru: 'Превратите ссылки меню в кнопки.' },
    vazifa: { uz: "Menyudagi havolalar tugmadek ko'rinsin, sichqoncha ustiga borganda rangi o'zgarsin.", ru: 'Ссылки меню должны выглядеть как кнопки, а при наведении мыши менять цвет.' },
    bandlar: [
      { uz: "nima o'zgarsin — menyu havolalari: fon, ichki bo'shliq, yumaloq burchak; sichqoncha ustida — boshqa rang", ru: 'что изменить — ссылки меню: фон, внутренний отступ, скруглённые углы; при наведении — другой цвет' },
      { uz: "faqat `style.css`, HTML'ga tegmasin", ru: 'только `style.css`, HTML не трогать' },
      { uz: 'hozirgi `style.css`', ru: 'текущий `style.css`' }
    ],
    masalan: { uz: "Menyu havolalarimni tugmaga aylantir: fon, ichki bo'shliq, yumaloq burchak.\nSichqoncha ustiga borganda tugma rangi o'zgarsin.\nFaqat style.css'ni o'zgartir, HTML'ga tegma. To'liq style.css'ni qaytar.\nMana style.css: {style.css kodini shu yerga qo'ying}", ru: 'Преврати ссылки моего меню в кнопки: фон, внутренний отступ, скруглённые углы.\nПри наведении мыши цвет кнопки должен меняться.\nМеняй только style.css, HTML не трогай. Верни style.css целиком.\nВот style.css: {вставьте сюда код style.css}' },
    holat: 'tugma', halqa: 'menyu',
    osti: { uz: "Sichqoncha ustida turgan holat CSS'da `:hover` deb yoziladi — Gemini javobida `nav a:hover` kabi qoidani toping.", ru: 'Состояние «мышь над элементом» в CSS пишется как `:hover` — найдите в ответе Gemini правило вроде `nav a:hover`.' },
    namuna: NAMUNA_CSS_0
  },
  a2: {
    eyebrow: { uz: 'Amaliyot 2 · kartochkalar', ru: 'Практика 2 · карточки' },
    title: { uz: 'Loyihalaringizni yonma-yon kartochka qiling.', ru: 'Сделайте проекты карточками в ряд.' },
    vazifa: { uz: "«Loyihalarim» ro'yxatidagi har ish alohida kartochka bo'lsin, uchalasi bir qatorda tursin.", ru: 'Каждая работа из списка «Мои проекты» должна стать отдельной карточкой, все три — в один ряд.' },
    bandlar: [
      { uz: "nima o'zgarsin — «Loyihalarim» ro'yxati: yonma-yon kartochkalar, orasida bo'shliq, yumaloq burchak", ru: 'что изменить — список «Мои проекты»: карточки в ряд, промежуток между ними, скруглённые углы' },
      { uz: "faqat `style.css`, HTML'ga tegmasin", ru: 'только `style.css`, HTML не трогать' },
      { uz: 'hozirgi `style.css`', ru: 'текущий `style.css`' }
    ],
    masalan: { uz: "«Loyihalarim» bo'limidagi ro'yxatni yonma-yon kartochkalarga aylantir.\nHar kartochka: oq fon, ramka, yumaloq burchak, ichki bo'shliq. Orasida bo'shliq bo'lsin.\nFaqat style.css'ni o'zgartir, HTML'ga tegma. To'liq style.css'ni qaytar.\nMana style.css: {style.css kodini shu yerga qo'ying}", ru: 'Преврати список в разделе «Мои проекты» в карточки в ряд.\nКаждая карточка: белый фон, рамка, скруглённые углы, внутренний отступ. Между ними — промежуток.\nМеняй только style.css, HTML не трогай. Верни style.css целиком.\nВот style.css: {вставьте сюда код style.css}' },
    holat: 'karta', halqa: 'loyiha',
    osti: { uz: "Bu CSS darsidagi flexbox: `display: flex` — yonma-yon, `gap` — orasidagi bo'shliq.", ru: 'Это flexbox из урока CSS: `display: flex` — в ряд, `gap` — промежуток между ними.' },
    namuna: NAMUNA_CSS_1
  },
  a3: {
    eyebrow: { uz: "Amaliyot 3 · Gemini'siz", ru: 'Практика 3 · без Gemini' },
    title: { uz: "Saytga o'zingiz tanlagan rangni bering.", ru: 'Дайте сайту цвет, который выбрали сами.' },
    vazifa: null,
    qadamlar: [
      { uz: "`style.css` da asosiy rangni toping — tugmalar va sarlavhalarda takrorlanadigan kod (namunada `#ff4f28`).", ru: 'Найдите в `style.css` основной цвет — код, который повторяется в кнопках и заголовках (в образце `#ff4f28`).' },
      { uz: "`Ctrl+H` bosing: yuqori qatorga eski rangni, pastkisiga yangisini yozing va `Ctrl+Alt+Enter` bosing — hammasi birdan almashadi.", ru: 'Нажмите `Ctrl+H`: в верхнюю строку — старый цвет, в нижнюю — новый, и нажмите `Ctrl+Alt+Enter` — заменится всё сразу.' },
      { uz: '`Ctrl+S` — Live Server\'da sahifaga qarang.', ru: '`Ctrl+S` — посмотрите на страницу в Live Server.' }
    ],
    yordam: { uz: 'Rang kodini bilmasangiz — VS Code\'da rang kodi yonidagi kichik kvadratni bosing, rang tanlagich ochiladi.', ru: 'Не знаете код цвета — нажмите в VS Code на маленький квадрат рядом с кодом цвета, откроется палитра.' },
    holat: 'rang', halqa: null, masalanYorliq: true,
    namuna: NAMUNA_CSS_2
  }
};
const ScreenAmaliyot = ({ screen, onNext, onPrev }) => {
  const b = AMALIYOT[SCREEN_META[screen].id];
  return (
    <Stage eyebrow={tr(b.eyebrow)} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(b.title)}</h2></div>
        <Split>
          <Col>
            {b.vazifa && <div className="am-karta fade-up delay-1"><p className="flow-label">{tr({ uz: 'Vazifa', ru: 'Задание' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{fmtCode(tr(b.vazifa))}</p></div>}
            {b.bandlar && <div className="am-karta fade-up delay-2">
              <p className="flow-label">{tr({ uz: 'Promptda ayting', ru: 'Скажите в промпте' })}</p>
              <ul className="am-band">{b.bandlar.map((x, i) => <li key={i}>{fmtCode(tr(x))}</li>)}</ul>
              <p className="flow-label" style={{ marginTop: 4 }}>{tr({ uz: 'Masalan', ru: 'Например' })}</p>
              <pre className="am-masalan">{tr(b.masalan)}</pre>
            </div>}
            {b.qadamlar && <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Qadamlar', ru: 'Шаги' })}</p>
              <ol className="am-qadam">{b.qadamlar.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(b.yordam)}</p>
            </div>}
            <div className="am-past fade-up delay-3"><span>{tr({ uz: 'Ortda qoldingizmi?', ru: 'Отстали?' })}</span><NamunaBtn kod={b.namuna} /></div>
          </Col>
          <Col>
            <p className="flow-label">{tr(b.masalanYorliq ? { uz: 'Kutilgan natija · masalan', ru: 'Ожидаемый результат · например' } : { uz: 'Kutilgan natija', ru: 'Ожидаемый результат' })}</p>
            <PfSahifa holat={b.holat} halqa={b.halqa} />
            {b.osti && <p className="small am-osti">{fmtCode(tr(b.osti))}</p>}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== s16 — TOPSHIRISH (QTest, yagona ballik): ✔ C =====
const Screen16 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Topshirish', ru: 'Сдача' })}
    questionText="Kartochkalarni bir qatorga qaysi qoida tizadi?"
    question={<><h2 className="title h-title">{tr({ uz: <>Kartochkalarni bir qatorga qaysi <span className="italic" style={{ color: T.accent }}>qoida</span> tizadi?</>, ru: <>Какое <span className="italic" style={{ color: T.accent }}>правило</span> ставит карточки в один ряд?</> })}</h2><div style={{ marginTop: 'clamp(10px,1.6vw,14px)' }}><Mentor>{tr({ uz: "Avval sahifangizni ustozga ko'rsating. Keyin savolga javob bering.", ru: 'Сначала покажите страницу учителю. Потом ответьте на вопрос.' })}</Mentor></div></>}
    options={['`ul { text-align: center; }`', '`li { margin: 0 auto; }`', '`ul { display: flex; }`', '`li { padding: 16px; }`']} correctIdx={2}
    explainCorrect={{ uz: '`display: flex` ichidagi elementlarni bir qatorga tizadi.', ru: '`display: flex` выстраивает вложенные элементы в один ряд.' }}
    explainWrong={{ 0: { uz: '`text-align` matnni joylaydi, kartochkalarni emas.', ru: '`text-align` выравнивает текст, а не карточки.' }, 1: { uz: "`margin: 0 auto` bitta blokni markazga qo'yadi.", ru: '`margin: 0 auto` ставит один блок по центру.' }, 3: { uz: "`padding` — kartochka ichidagi bo'shliq.", ru: '`padding` — отступ внутри карточки.' }, default: { uz: "Elementlarni yonma-yon qo'yadigan qoidani eslang.", ru: 'Вспомните правило, которое ставит элементы в ряд.' } }} />
);
