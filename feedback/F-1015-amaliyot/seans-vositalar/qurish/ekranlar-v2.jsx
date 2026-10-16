// ===== F-1015-309 · CSS Praktika v2: Demo Day saytining bosh sahifasi (GATE V2 — Q1–Q5 A) =====
// Qolip — pilot v1 (F-1015-303): vazifa · prompt maslahati · natija surati; «Davom etish»; isbot yo'q.
// Ip — ccDemoDay (PmLesson1 → VsCodeLesson → shu dars → DeployLesson → PmLesson3).

// ----- Demo Day g'oyasi (ccDemoDay) — VsCodeLesson / DeployLesson bilan bir kalit -----
const DEMO_KEY = 'ccDemoDay';
const demoRead = () => { try { const v = JSON.parse(localStorage.getItem(DEMO_KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const demoWrite = (patch) => { try { localStorage.setItem(DEMO_KEY, JSON.stringify({ ...(demoRead() || {}), ...patch, savedAt: Date.now() })); } catch { /* saqlab bo'lmadi */ } };
// G'oya-bank — VsCodeLesson dagi bilan AYNAN (95-qonun olami); g'oyasiz kelgan o'quvchi shu yerdan oladi.
const IDEA_BANK = [
  { id: 'togarak', muammo: { uz: "To'garak jadvali faqat devorda — uydan ko'rib bo'lmaydi", ru: 'Расписание кружка только на стене — из дома не посмотришь' }, yechim: { uz: 'Jadval va manzil sayti', ru: 'Сайт с расписанием и адресом' } },
  { id: 'dokon', muammo: { uz: "Mahalla do'konida nima bor-yo'qligini borib ko'rmaguncha bilib bo'lmaydi", ru: 'Что есть в магазине у дома — не узнаешь, пока не сходишь' }, yechim: { uz: 'Menyu va narxlar sayti', ru: 'Сайт с меню и ценами' } },
  { id: 'seksiya', muammo: { uz: "Sport seksiyasining vaqti va narxini telefon qilib so'rashga to'g'ri keladi", ru: 'Время и цену секции приходится узнавать по телефону' }, yechim: { uz: "Mashg'ulot vaqtlari sayti", ru: 'Сайт с расписанием тренировок' } },
  { id: 'kitob', muammo: { uz: "Sinfda kimda qaysi kitob borligini hech kim bilmaydi", ru: 'Никто не знает, у кого в классе какая книга' }, yechim: { uz: "Kitob almashinuv ro'yxati sayti", ru: 'Сайт со списком обмена книгами' } },
];
// Uslublar — DeployLesson dagi bilan AYNAN (Q3 A: tanlov shu darsga ko'chdi); ekranda emojisiz
const STYLES = [
  { id: 'minimal', name: { uz: 'Minimalist', ru: 'Минимализм' }, sub: { uz: 'oq fon, tinch', ru: 'белый фон, спокойный' },
    desc: { uz: "oq fon, ko'p bo'sh joy, qora matn va bitta urg'u rang. Shrift sodda va tinch.", ru: 'белый фон, много воздуха, чёрный текст и один акцентный цвет. Шрифт простой и спокойный.' } },
  { id: 'yorqin', name: { uz: 'Yorqin', ru: 'Яркий' }, sub: { uz: 'quvnoq ranglar', ru: 'весёлые цвета' },
    desc: { uz: "yorqin ranglar (to'q sariq va ko'k), katta sarlavhalar, quvnoq ohang.", ru: 'яркие цвета (оранжевый и синий), крупные заголовки, весёлое настроение.' } },
  { id: 'qorongi', name: { uz: "Qorong'i", ru: 'Тёмный' }, sub: { uz: "to'q fon, oq matn", ru: 'тёмный фон, белый текст' },
    desc: { uz: "to'q fon, oq matn, yashil urg'u rang. Shrift zamonaviy.", ru: 'тёмный фон, белый текст, зелёный акцент. Шрифт современный.' } },
  { id: 'gradient', name: { uz: 'Gradient', ru: 'Градиент' }, sub: { uz: "rang o'tishlari", ru: 'переливы цвета' },
    desc: { uz: "binafsha va pushti rang o'tishli fonlar, yumshoq soyalar, dumaloq burchaklar.", ru: 'фоны с фиолетово-розовыми переходами, мягкие тени, скруглённые углы.' } },
];
// O'quvchi g'oyasi (muammo, yechim) — yo'q bo'lsa namuna (bankdagi birinchi)
const useDemo = () => {
  const [d, setD] = useState(() => demoRead() || {});
  const set = (patch) => { demoWrite(patch); setD(demoRead() || {}); };
  const bor = !!(d.muammo && d.yechim);
  return { d, set, bor, muammo: bor ? d.muammo : tr(IDEA_BANK[0].muammo), yechim: bor ? d.yechim : tr(IDEA_BANK[0].yechim) };
};

// ----- Namuna kodlari (ortda qolgan o'quvchi uchun; namuna — to'garak jadvali sayti) -----
const NAMUNA_BOSH = `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mening saytim</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
</body>
</html>
`;
const NAMUNA_HTML = `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>To'garak jadvali</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <p class="logo">To'garak jadvali</p>
    <nav>
      <a href="index.html">Bosh sahifa</a>
      <a href="#aloqa">Aloqa</a>
    </nav>
  </header>

  <section class="hero">
    <h1>Jadval va manzil sayti</h1>
    <p>To'garak jadvali faqat devorda — uydan ko'rib bo'lmaydi.</p>
    <a class="tugma" href="#afzallik">Batafsil</a>
  </section>

  <section id="afzallik" class="kartalar">
    <div class="karta"><h2>Jadval</h2><p>Hamma to'garak vaqti bitta sahifada.</p></div>
    <div class="karta"><h2>Manzil</h2><p>Qaysi xonada bo'lishini oldindan bilasiz.</p></div>
    <div class="karta"><h2>Telefonda</h2><p>Uydan ham, yo'lda ham ochiladi.</p></div>
  </section>

  <footer id="aloqa">To'garak jadvali, 2026</footer>
</body>
</html>
`;
const NAMUNA_CSS = `body { margin: 0; font-family: Arial, sans-serif; background: #ffffff; color: #1b1b1b; }
header { display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; border-bottom: 1px solid #eeeeee; }
.logo { font-weight: bold; margin: 0; }
nav { display: flex; gap: 16px; }
nav a { color: #1b1b1b; text-decoration: none; }
.hero { max-width: 800px; margin: 48px auto; text-align: center; padding: 0 24px; }
.hero h1 { font-size: 40px; margin: 0 0 12px; }
.tugma { display: inline-block; background: #d4380d; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; }
.kartalar { display: flex; gap: 16px; max-width: 900px; margin: 0 auto 48px; padding: 0 24px; }
.karta { flex: 1; border: 1px solid #eeeeee; border-radius: 12px; padding: 20px; }
.karta h2 { color: #d4380d; font-size: 18px; margin: 0 0 8px; }
footer { text-align: center; padding: 24px; border-top: 1px solid #eeeeee; }
`;

// «Namuna kodini nusxalash» — clipboard yopiq bo'lsa, namunani ustoz beradi
const NamunaBtn = ({ kod, label = { uz: 'Namuna kodini nusxalash', ru: 'Скопировать код образца' } }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(kod); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq */ } };
  return <button type="button" className="am-namuna" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr(label)}</button>;
};

// ----- Bitta vizual: Demo Day bosh sahifasi, 3 holat (xom → uslub → rang) × 4 uslub -----
const DS_AFZAL = [
  { h: { uz: 'Bir joyda', ru: 'В одном месте' }, p: { uz: 'Kerakli hamma narsa bitta sahifada.', ru: 'Всё нужное — на одной странице.' } },
  { h: { uz: 'Tez', ru: 'Быстро' }, p: { uz: "Borib so'ramasdan bilib olasiz.", ru: 'Узнаёте, не выходя из дома.' } },
  { h: { uz: 'Telefonda', ru: 'В телефоне' }, p: { uz: "Uydan ham, yo'lda ham ochiladi.", ru: 'Открывается и дома, и в дороге.' } },
];
const DemoSahifa = ({ holat = 'uslub', uslub = 'minimal', muammo, yechim, halqa = null }) => {
  const cls = ['ds', holat === 'xom' ? 'ds-xom' : `ds-${uslub}`, holat === 'rang' ? 'ds-rang' : ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <div className="ds-bar"><span className="bb-dots"><i /><i /><i /></span><span className="ds-url">mening-saytim · Live Server</span></div>
      <div className="ds-body">
        <div className="ds-hd"><span className="ds-logo">{yechim}</span><span className="ds-nav"><span>{tr({ uz: 'Bosh sahifa', ru: 'Главная' })}</span><span>{tr({ uz: 'Aloqa', ru: 'Контакты' })}</span></span></div>
        <div className={`ds-hero ${halqa === 'hero' ? 'ds-halqa' : ''}`}>
          <p className="ds-h1">{yechim}</p>
          <p className="ds-p">{muammo}</p>
          <span className="ds-tugma">{tr({ uz: 'Batafsil', ru: 'Подробнее' })}</span>
        </div>
        <div className={`ds-kartalar ${halqa === 'karta' ? 'ds-halqa' : ''}`}>
          {DS_AFZAL.map((k, i) => <div key={i} className="ds-karta"><p className="ds-h2">{tr(k.h)}</p><p className="ds-p">{tr(k.p)}</p></div>)}
        </div>
        <div className="ds-ft">{yechim}, 2026</div>
      </div>
    </div>
  );
};

// ===== SCREEN 0 — KIRISH (QKirish): bosh sahifa — odam avval nimani ko'radi? =====
const HOOK_OPTS = [
  { id: 'a', label: { uz: 'Sayt qaysi muammoni hal qilishini', ru: 'Какую проблему решает сайт' } },
  { id: 'b', label: { uz: "Saytning hamma sahifalari ro'yxatini", ru: 'Список всех страниц сайта' } },
  { id: 'c', label: { uz: 'Saytni kim yasaganini', ru: 'Кто сделал сайт' } }
];
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const demo = useDemo();
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
        <h1 className="title h-title fade-up">{tr({ uz: <>Saytingizga kirgan odam avval <span className="italic" style={{ color: T.accent }}>nimani</span> ko'radi?</>, ru: <>Что человек <span className="italic" style={{ color: T.accent }}>первым</span> увидит на вашем сайте?</> })}</h1>
        <Mentor>{tr({ uz: <>O'ngda — Demo Day saytingizning bosh sahifasi, bugun shunday bo'ladi. Qarang va javobni tanlang.</>, ru: <>Справа — главная страница вашего сайта для Demo Day, сегодня она станет такой. Посмотрите и выберите ответ.</> })}</Mentor>
        <Split>
          <Col>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {HOOK_OPTS.map((o, i) => { const on = picked === o.id; return (<button key={o.id} className={`hook-option am-navbat ${on ? 'on' : ''}`} style={{ animationDelay: `${0.25 + i * 0.35}s` }} disabled={picked !== null} onClick={() => pick(o.id)}><span className="radio">{on && <span className="radio-dot" />}</span><span>{tr(o.label)}</span></button>); })}
            </div>
            {picked !== null && (
              <div ref={resultRef} className={`${picked === 'a' ? 'frame-success' : 'frame-soft'} fade-step`}>
                <p className="body" style={{ margin: 0, color: T.ink }}>{picked === 'a'
                  ? tr({ uz: <><b>Aynan!</b> Bosh sahifa bir qarashda aytadi: qanday muammo va sayt uni qanday hal qiladi.</>, ru: <><b>Именно!</b> Главная страница с первого взгляда говорит: какая проблема и как сайт её решает.</> })
                  : tr({ uz: <><b>Qiziq fikr!</b> Sarlavhaga qarang: u muammoga yechimni aytadi — odam shuni birinchi ko'radi.</>, ru: <><b>Интересная мысль!</b> Посмотрите на заголовок: он называет решение проблемы — его человек видит первым.</> })}</p>
              </div>
            )}
          </Col>
          <Col><p className="flow-label">{tr({ uz: 'Bugun oxirida', ru: 'Сегодня к концу' })}</p><DemoSahifa holat="uslub" uslub={demo.d.uslub || 'minimal'} muammo={demo.muammo} yechim={demo.yechim} /></Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — REJA (QReja): g'oya · tayyorlanish · 3 blok =====
const REJA_BLOK = [
  { t: { uz: 'Bosh sahifa', ru: 'Главная страница' }, tag: 'HTML' },
  { t: { uz: 'Dizayn', ru: 'Дизайн' }, tag: { uz: 'uslub', ru: 'стиль' } },
  { t: { uz: "O'z rangingiz", ru: 'Ваш цвет' }, tag: 'Ctrl+H' }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const demo = useDemo();
  const [ozgar, setOzgar] = useState(false);
  const tanla = (b) => { demo.set({ muammo: tr(b.muammo), yechim: tr(b.yechim), manba: b.id, holat: demo.d.holat || 'tanlangan' }); setOzgar(false); };
  const bankOchiq = !demo.bor || ozgar;
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun Demo Day saytingizni <span className="italic" style={{ color: T.accent }}>boshlaysiz</span></>, ru: <>Сегодня вы <span className="italic" style={{ color: T.accent }}>начинаете</span> сайт для Demo Day</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bugun bosh sahifa: HTML'ni Gemini tez yozadi, asosiy vaqt — dizaynga. Qolgan sahifalar — Netlify darsida.</>, ru: <>Сегодня — главная страница: HTML быстро пишет Gemini, основное время — на дизайн. Остальные страницы — на уроке Netlify.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr(bankOchiq ? { uz: "G'oyangizni tanlang", ru: 'Выберите идею' } : { uz: "Sizning g'oyangiz", ru: 'Ваша идея' })}</p>
            {!bankOchiq && <div className="am-karta fade-up delay-1">
              <p className="body" style={{ margin: 0, color: T.ink }}><b>{tr({ uz: 'Muammo:', ru: 'Проблема:' })}</b> {demo.d.muammo}</p>
              <p className="body" style={{ margin: 0, color: T.ink }}><b>{tr({ uz: 'Yechim:', ru: 'Решение:' })}</b> {demo.d.yechim}</p>
              <button type="button" className="am-namuna" style={{ alignSelf: 'flex-start' }} onClick={() => setOzgar(true)}>{tr({ uz: "Boshqa g'oya tanlash", ru: 'Выбрать другую идею' })}</button>
            </div>}
            {bankOchiq && <div className="am-bank fade-up delay-1">
              {IDEA_BANK.map(b => <button key={b.id} type="button" className={`hook-option ${demo.d.manba === b.id ? 'on' : ''}`} onClick={() => tanla(b)}><span className="radio">{demo.d.manba === b.id && <span className="radio-dot" />}</span><span><b>{tr(b.yechim)}</b><br /><span className="small" style={{ color: T.ink2 }}>{tr(b.muammo)}</span></span></button>)}
            </div>}
            <p className="flow-label" style={{ marginTop: 6 }}>{tr({ uz: 'Tayyorlanish', ru: 'Подготовка' })}</p>
            <ol className="am-qadam fade-up delay-2">
              <li><span className="am-qn">1</span><span>{tr({ uz: <>Ish stolida <span className="qcode">mening-saytim</span> papkasini yarating va VS Code'da oching.</>, ru: <>Создайте на рабочем столе папку <span className="qcode">mening-saytim</span> и откройте её в VS Code.</> })}</span></li>
              <li><span className="am-qn">2</span><span>{tr({ uz: <>Ichida <span className="qcode">index.html</span> va <span className="qcode">style.css</span>; <span className="qcode">index.html</span> da <span className="qcode">!</span> + Tab, Go Live.</>, ru: <>Внутри — <span className="qcode">index.html</span> и <span className="qcode">style.css</span>; в <span className="qcode">index.html</span> — <span className="qcode">!</span> + Tab, Go Live.</> })}</span></li>
              <li><span className="am-qn">3</span><span>{tr({ uz: "Boshqa oynada gemini.google.com'ni oching.", ru: 'В другом окне откройте gemini.google.com.' })}</span></li>
            </ol>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Bugungi 3 blok', ru: '3 блока сегодня' })}</p>
            <ol className="roadmap">{REJA_BLOK.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.t)}</span><span className="step-tag">{tr(s.tag)}</span></span></li>))}</ol>
            <DemoSahifa holat="rang" uslub={demo.d.uslub || 'minimal'} muammo={demo.muammo} yechim={demo.yechim} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a1 · a2 · a3 — AMALIYOT BLOKLARI =====
const AMALIYOT = {
  a1: {
    eyebrow: { uz: 'Amaliyot 1 · HTML', ru: 'Практика 1 · HTML' },
    title: { uz: "Bosh sahifaning HTML'ini Gemini'ga yozdiring.", ru: 'Пусть Gemini напишет HTML главной страницы.' },
    vazifa: { uz: "Bosh sahifaning hamma qismi bo'lsin — dizaynsiz, faqat HTML.", ru: 'На главной странице должны быть все части — без дизайна, только HTML.' },
    bandlar: [
      { uz: 'muammo va yechimingiz', ru: 'ваши проблема и решение' },
      { uz: "qismlar: sayt nomi va menyu, sarlavha, muammo haqida bir gap, «Batafsil» tugmasi, 3 afzallik kartasi, footer", ru: 'части: название сайта и меню, заголовок, одна фраза о проблеме, кнопка «Подробнее», 3 карточки преимуществ, footer' },
      { uz: 'faqat HTML, `style.css` ulangan', ru: 'только HTML, `style.css` подключён' }
    ],
    masalan: (m, y) => ({ uz: `Demo Day loyiham uchun bosh sahifa — index.html'ni yoz.\nMuammo: ${m}. Saytim: ${y}.\nSahifada: tepada sayt nomi va menyu (Bosh sahifa, Aloqa), katta sarlavha, muammo haqida bitta gap,\n«Batafsil» tugmasi, saytning 3 ta afzalligi — 3 ta karta, eng pastda footer.\nstyle.css <link> bilan ulangan bo'lsin. Hozircha CSS yozma, faqat HTML.`, ru: `Напиши index.html — главную страницу моего проекта для Demo Day.\nПроблема: ${m}. Мой сайт: ${y}.\nНа странице: вверху название сайта и меню (Главная, Контакты), крупный заголовок, одна фраза о проблеме,\nкнопка «Подробнее», 3 преимущества сайта — 3 карточки, внизу footer.\nПодключи style.css через <link>. CSS пока не пиши, только HTML.` }),
    holat: 'xom', halqa: null,
    osti: { uz: "HTML — sahifaning tuzilmasi: hamma qism bor, lekin hali bezaksiz.", ru: 'HTML — структура страницы: все части на месте, но пока без оформления.' },
    namuna: NAMUNA_BOSH
  },
  a2: {
    eyebrow: { uz: 'Amaliyot 2 · dizayn', ru: 'Практика 2 · дизайн' },
    title: { uz: 'Saytingiz uchun uslub tanlang.', ru: 'Выберите стиль для сайта.' },
    uslubTanlov: true,
    bandlar: [
      { uz: 'uslub — tanlaganingiz', ru: 'стиль — тот, что выбрали' },
      { uz: "kartalar bir qatorda, «Batafsil» tugmasi ko'zga tashlansin", ru: 'карточки в один ряд, кнопка «Подробнее» заметная' },
      { uz: "faqat `style.css`, HTML'ga tegmasin · hozirgi `index.html`", ru: 'только `style.css`, HTML не трогать · текущий `index.html`' }
    ],
    masalan: (m, y, u) => ({ uz: `Bosh sahifamga dizayn ber — faqat style.css'ni yoz, HTML'ni o'zgartirma.\nUslub: ${u}\n3 ta karta bir qatorda, orasida bo'shliq; «Batafsil» tugmasi ko'zga tashlansin.\nMana kodim: {index.html kodini shu yerga qo'ying}`, ru: `Оформи мою главную страницу — напиши только style.css, HTML не меняй.\nСтиль: ${u}\n3 карточки в один ряд, с промежутком; кнопка «Подробнее» должна бросаться в глаза.\nВот мой код: {вставьте сюда код index.html}` }),
    holat: 'uslub', halqa: 'karta',
    osti: { uz: "Gemini javobida kartalarni yonma-yon qo'ygan `display: flex` va `gap` ni toping.", ru: 'Найдите в ответе Gemini `display: flex` и `gap` — они ставят карточки в ряд.' },
    namuna: NAMUNA_HTML
  },
  a3: {
    eyebrow: { uz: "Amaliyot 3 · Gemini'siz", ru: 'Практика 3 · без Gemini' },
    title: { uz: "Saytga o'zingiz tanlagan rangni bering.", ru: 'Дайте сайту цвет, который выбрали сами.' },
    qadamlar: [
      { uz: "`style.css` da asosiy rangni toping — tugma va sarlavhalarda takrorlanadigan kod (namunada `#d4380d`).", ru: 'Найдите в `style.css` основной цвет — код, который повторяется в кнопке и заголовках (в образце `#d4380d`).' },
      { uz: "`Ctrl+H` bosing: yuqori qatorga eski rangni, pastkisiga yangisini yozing va `Ctrl+Alt+Enter` bosing — hammasi birdan almashadi.", ru: 'Нажмите `Ctrl+H`: в верхнюю строку — старый цвет, в нижнюю — новый, и нажмите `Ctrl+Alt+Enter` — заменится всё сразу.' },
      { uz: "`Ctrl+S` — Live Server'da sahifaga qarang.", ru: '`Ctrl+S` — посмотрите на страницу в Live Server.' }
    ],
    yordam: { uz: "Rang kodini bilmasangiz — VS Code'da rang kodi yonidagi kichik kvadratni bosing, rang tanlagich ochiladi.", ru: 'Не знаете код цвета — нажмите в VS Code на маленький квадрат рядом с кодом цвета, откроется палитра.' },
    holat: 'rang', halqa: null, masalanYorliq: true,
    namuna: NAMUNA_CSS
  }
};
const ScreenAmaliyot = ({ screen, onNext, onPrev }) => {
  const b = AMALIYOT[SCREEN_META[screen].id];
  const demo = useDemo();
  const uslub = demo.d.uslub || null;
  const st = STYLES.find(s => s.id === uslub) || null;
  const masalan = b.masalan ? tr(b.masalan(demo.muammo, demo.yechim, st ? tr(st.desc) : tr({ uz: '{tanlagan uslubingiz}', ru: '{выбранный стиль}' }))) : null;
  return (
    <Stage eyebrow={tr(b.eyebrow)} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(b.title)}</h2></div>
        <Split>
          <Col>
            {b.vazifa && <div className="am-karta fade-up delay-1"><p className="flow-label">{tr({ uz: 'Vazifa', ru: 'Задание' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{fmtCode(tr(b.vazifa))}</p></div>}
            {b.uslubTanlov && <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Uslub', ru: 'Стиль' })}</p>
              <div className="am-uslub">{STYLES.map(s => <button key={s.id} type="button" className={`am-uslub-btn ${uslub === s.id ? 'on' : ''}`} onClick={() => demo.set({ uslub: s.id })}><b>{tr(s.name)}</b><span>{tr(s.sub)}</span></button>)}</div>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: 'Har kim boshqa uslub tanlasa, sinfda bir xil sayt chiqmaydi.', ru: 'Если каждый выберет свой стиль, в классе не будет одинаковых сайтов.' })}</p>
            </div>}
            {b.bandlar && <div className="am-karta fade-up delay-2">
              <p className="flow-label">{tr({ uz: 'Promptda ayting', ru: 'Скажите в промпте' })}</p>
              <ul className="am-band">{b.bandlar.map((x, i) => <li key={i}>{fmtCode(tr(x))}</li>)}</ul>
              <p className="flow-label" style={{ marginTop: 4 }}>{tr({ uz: 'Masalan', ru: 'Например' })}</p>
              <pre className="am-masalan">{masalan}</pre>
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
            <DemoSahifa holat={b.holat} uslub={uslub || 'minimal'} muammo={demo.muammo} yechim={demo.yechim} halqa={b.halqa} />
            {b.osti && <p className="small am-osti">{fmtCode(tr(b.osti))}</p>}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
