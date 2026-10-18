// ===== F-1015-354: 18 → 8 ekran. KitobShop'ga haqiqiy lenta (GitHub Actions): quruvchi (eski s6) → ci.yml + push maketi → qizil jurnal (eski s3); deploy maketda =====
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
  { uz: "«Praktika — KitobShop backend» darsidagi KitobShop GitHub'da bo'lsin: `git push` qilingan, repo sahifasi ochiladi.", ru: 'KitobShop из урока «Практика — бэкенд KitobShop» должен быть на GitHub: сделан `git push`, страница репозитория открывается.' },
  { uz: "Kompyuteringizda `npm test` («Unit-test: Jest» darsidagi testlar) va `npm run lint` yashil o'tadimi?", ru: 'На компьютере `npm test` (тесты из урока «Юнит-тесты: Jest») и `npm run lint` проходят зелёными?' },
  { uz: "Copilot Chat ochiq bo'lsin — qizil jurnal chiqsa, undan so'raysiz.", ru: 'Пусть Copilot Chat будет открыт — если журнал покраснеет, спросите у него.' }
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
// Kod oynasi: oxirgi amal (setGames…) va ro'yxatning hozirgi holati
const KodOyna = ({ oxirgi, qatorlar }) => (
  <div className="rj-oyna">
    <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">Actions · {tr({ uz: 'lenta jurnali', ru: 'журнал ленты' })}</span></div>
    <div className="rj-body">
      <div className="sk-izoh">// {tr({ uz: 'oxirgi amal', ru: 'последнее действие' })}</div>
      <div key={oxirgi} className="rj-li sk-nur">{oxirgi || '—'}</div>
      <div className="sk-izoh">// {tr({ uz: 'hozir', ru: 'сейчас' })}</div>
      {qatorlar.map((q, i) => <div key={i} className="rj-li">{q}</div>)}
    </div>
  </div>
);
const BLOK3 = [
  { t: { uz: '5 nuqtani tizish', ru: 'Выстроить 5 точек' }, tag: { uz: "o'zingiz", ru: 'сами' } },
  { t: { uz: "KitobShop'ga ci.yml va push", ru: 'ci.yml в KitobShop и push' }, tag: 'GitHub Actions' },
  { t: { uz: 'Qizil jurnaldan sabab', ru: 'Причина в красном журнале' }, tag: { uz: 'siz', ru: 'Вы' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>KitobShop'ga <span className="italic" style={{ color: T.accent }}>haqiqiy lenta</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Настоящая лента</span> для KitobShop.</> })}</h2></div>
      <Mentor>{tr({ uz: <>Bugun KitobShop'ga lenta ulaysiz: har <span className="mono">git push</span>'dan keyin GitHub o'zi yig'adi, testlarni yurgizadi, o'lchaydi va o'raydi — repo sahifasida yashil yoki qizil TABLO chiqadi. ✈️ Uchirish bu darsda maketda ko'rsatiladi.</>, ru: <>Сегодня подключаете ленту к KitobShop: после каждого <span className="mono">git push</span> GitHub сам собирает, запускает тесты, проверяет и упаковывает — на странице репозитория появляется зелёное или красное ТАБЛО. ✈️ Взлёт в этом уроке показан на макете.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Dars oxirida · GitHub Actions', ru: 'К концу урока · GitHub Actions' })}</p>
          <LentaPanel holat={CI_NUQTA.map((n, i) => (i < 4 ? 'ok' : 'maket'))} />
        </Col>
        <Col>
          <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: 'Dars oxirida · GitHub Actions', ru: 'К концу урока · GitHub Actions' })}</p>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: `Bugungi ${BLOK3.length} blok`, ru: `${BLOK3.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{BLOK3.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== a2 — KitobShop'ga ci.yml (haqiqiy), push maketi: nuqtalar birma-bir yonadi, xato kiritilsa — qizil =====
const CI_NUQTA = [
  { id: 'install', ic: '📦', t: { uz: "Yig'ish", ru: 'Сборка' }, cmd: 'npm ci', vaqt: '14s' },
  { id: 'test', ic: '🔍', t: { uz: 'Skaner', ru: 'Сканер' }, cmd: 'npm test', vaqt: '9s' },
  { id: 'lint', ic: '📐', t: { uz: "O'lcham ramkasi", ru: 'Габарит-рамка' }, cmd: 'npm run lint', vaqt: '4s' },
  { id: 'build', ic: '🎁', t: { uz: "O'rash", ru: 'Упаковка' }, cmd: 'npm run build', vaqt: '11s' },
  { id: 'deploy', ic: '✈️', t: { uz: 'Uchirish', ru: 'Взлёт' }, cmd: 'deploy', vaqt: '' }
];
const CI_YML = `name: CI
on: push
jobs:
  lenta:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci           # Yig'ish
      - run: npm test         # Skaner
      - run: npm run lint     # O'lcham ramkasi
      - run: npm run build    # O'rash
      # Uchirish — bu darsda maketda`;
const HOLAT_BELGI = { kut: '○', run: '◌', ok: '✓', fail: '✗', skip: '—', maket: '✈' };
const LentaPanel = ({ holat }) => {
  const qizil = holat.includes('fail');
  const tugadi = holat.every(h => h !== 'kut' && h !== 'run');
  return (
    <div className="ci-panel">
      <div className="ci-top"><span>KitobShop · Actions</span><span className={`ci-tablo ${tugadi ? (qizil ? 'red' : 'green') : ''}`}>CI {tugadi ? (qizil ? 'failing' : 'passing') : '…'}</span></div>
      {CI_NUQTA.map((n, i) => <div key={n.id} className={`ci-row ci-${holat[i]}`}><span className="ci-b">{HOLAT_BELGI[holat[i]]}</span><span>{n.ic} {tr(n.t)}</span><code>{n.cmd}</code><span className="ci-v">{holat[i] === 'ok' ? n.vaqt : holat[i] === 'maket' ? tr({ uz: 'maket', ru: 'макет' }) : ''}</span></div>)}
    </div>
  );
};
const A2_QADAM = [
  { uz: "KitobShop'da `.github/workflows/ci.yml` faylini yarating va nusxani qo'ying.", ru: 'В KitobShop создайте файл `.github/workflows/ci.yml` и вставьте копию.' },
  { uz: "`package.json` da `test`, `lint`, `build` skriptlari borligini tekshiring (Nest loyihasida bor).", ru: 'Проверьте, что в `package.json` есть скрипты `test`, `lint`, `build` (в Nest-проекте есть).' },
  { uz: "`git add .` → `git commit -m \"CI lenta\"` → `git push`.", ru: '`git add .` → `git commit -m "CI lenta"` → `git push`.' },
  { uz: "GitHub → Actions: nuqtalar yashil bo'ldimi? Qizil bo'lsa — jurnalni oching (keyingi amaliyot).", ru: 'GitHub → Actions: точки зелёные? Если красная — откройте журнал (следующая практика).' },
  { uz: "README.md ga TABLO: `![CI](https://github.com/LOGIN/REPO/actions/workflows/ci.yml/badge.svg)`.", ru: 'В README.md — ТАБЛО: `![CI](https://github.com/LOGIN/REPO/actions/workflows/ci.yml/badge.svg)`.' }
];
const ScreenCiYml = ({ screen, onNext, onPrev }) => {
  const [xato, setXato] = useState(false);
  const [holat, setHolat] = useState(() => CI_NUQTA.map(() => 'kut'));
  const [jurnal, setJurnal] = useState([]);
  const tRef = useRef([]);
  useEffect(() => () => tRef.current.forEach(clearTimeout), []);
  const push = () => {
    tRef.current.forEach(clearTimeout); tRef.current = [];
    const h = CI_NUQTA.map(() => 'kut'); setHolat(h.slice()); setJurnal([`$ git push · ${tr({ uz: 'lenta boshlandi', ru: 'лента запущена' })}`]);
    let toxta = false;
    CI_NUQTA.forEach((n, i) => {
      tRef.current.push(setTimeout(() => {
        if (n.id === 'deploy') { h[i] = toxta ? 'skip' : 'maket'; setHolat(h.slice()); setJurnal(j => [...j, toxta ? `— ✈️ ${tr({ uz: "Uchirish o'tkazib yuborildi", ru: 'Взлёт пропущен' })}` : `✈ ${tr({ uz: 'Uchirish — maket (bu darsda haqiqiy deploy yo\'q)', ru: 'Взлёт — макет (в этом уроке настоящего деплоя нет)' })}`]); return; }
        if (toxta) { h[i] = 'skip'; setHolat(h.slice()); setJurnal(j => [...j, `— ${n.ic} ${n.cmd} · ${tr({ uz: "o'tkazib yuborildi", ru: 'пропущено' })}`]); return; }
        if (xato && n.id === 'lint') { h[i] = 'fail'; toxta = true; setHolat(h.slice()); setJurnal(j => [...j, `✗ ${n.cmd} · src/book/book.service.ts:12  error  'narx' is assigned a value but never used`]); return; }
        h[i] = 'ok'; setHolat(h.slice()); setJurnal(j => [...j, `✓ ${n.cmd} · ${n.vaqt}`]);
      }, 450 * (i + 1)));
    });
  };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · GitHub Actions', ru: 'Практика 2 · GitHub Actions' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>KitobShop'ga <span className="italic" style={{ color: T.accent }}>ci.yml</span> qo'shing.</>, ru: <>Добавьте <span className="italic" style={{ color: T.accent }}>ci.yml</span> в KitobShop.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Yo'l xaritasi — bitta fayl: <span className="mono">on: push</span> START SIGNALI, ostida nuqtalar tartib bilan. Push qilib ko'ring: nuqtalar birma-bir yonadi. Keyin xato kiritib ko'ring — bitta nuqta qizarsa, undan keyingilari o'tkazib yuboriladi.</>, ru: <>Карта маршрута — один файл: <span className="mono">on: push</span> — СТАРТОВЫЙ СИГНАЛ, ниже точки по порядку. Сделайте push: точки загораются по одной. Потом внесите ошибку — если одна точка покраснеет, следующие пропускаются.</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-chips">
              <button type="button" className="am-saqla" onClick={push}>git push</button>
              <button type="button" className={`am-chip ${xato ? 'on' : ''}`} aria-pressed={xato} onClick={() => setXato(x => !x)}>{xato ? tr({ uz: '✓ Kodda lint xatosi bor', ru: '✓ В коде есть ошибка lint' }) : tr({ uz: '+ Lint xatosini kiritish', ru: '+ Внести ошибку lint' })}</button>
            </div>
            <LentaPanel holat={holat} />
            <KodOyna oxirgi={jurnal[jurnal.length - 1] || ''} qatorlar={jurnal.slice(0, -1).map((l, i) => <span key={i}>{l}</span>)} />
          </Col>
          <Col>
            <KodNusxa yorliq={{ uz: '.github/workflows/ci.yml', ru: '.github/workflows/ci.yml' }} kod={CI_YML} />
            <QadamTugma b={A2_QADAM} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
