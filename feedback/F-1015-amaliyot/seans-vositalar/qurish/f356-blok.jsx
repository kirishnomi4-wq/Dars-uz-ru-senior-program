// ===== F-1015-356: 20 → 7 ekran. KitobShop lentasi ishonchli: o'yin (eski s13 — 4 yaxshilash + rollback, maket) → ci.yml ga haqiqiy matrix, kesh, seyf + push maketi =====
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
  { uz: "«Loyiha kuni — to'liq lentani qurish» darsidagi `ci.yml` KitobShop'da bor: GitHub → Actions yashil.", ru: '`ci.yml` из урока «Проектный день — построение полного конвейера» есть в KitobShop: GitHub → Actions зелёный.' },
  { uz: "KitobShop'ning `.env` faylidagi `JWT_SECRET` qiymatini oching («Autentifikatsiya va .env» darsidan) — u GitHub seyfiga qo'yiladi, kodga emas.", ru: 'Откройте значение `JWT_SECRET` в файле `.env` KitobShop (из урока «Аутентификация и .env») — оно пойдёт в сейф GitHub, а не в код.' },
  { uz: "GitHub'da KitobShop repo sahifasini oching: «Settings» bo'limi ko'rinadimi?", ru: 'Откройте страницу репозитория KitobShop на GitHub: видна вкладка «Settings»?' }
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
const BLOK2 = [
  { t: { uz: '4 yaxshilash va eski yukni qaytarish', ru: '4 улучшения и возврат старого багажа' }, tag: { uz: 'maket', ru: 'макет' } },
  { t: { uz: "KitobShop ci.yml: matrix, kesh, seyf", ru: 'ci.yml KitobShop: matrix, кеш, сейф' }, tag: 'GitHub Actions' }
];
// Matrix ishlari: Node 22 va 24 (2026 yil kuzida qo'llab-quvvatlanadigan LTS versiyalar)
const PRO_ISH = [
  { node: 22, v1: '1m 04s', v2: '33s' },
  { node: 24, v1: '58s', v2: '30s' }
];
const ProPanel = ({ push }) => (
  <div className="ci-panel">
    <div className="ci-top"><span>KitobShop · Actions</span><span className={`ci-tablo ${push ? 'green' : ''}`}>CI {push ? 'passing' : '…'}</span></div>
    {PRO_ISH.map(j => <div key={j.node} className={`ci-row ${push ? 'ci-ok' : 'ci-kut'}`}><span className="ci-b">{push ? '✓' : '○'}</span><span>lenta ({j.node})</span><code>Node {j.node}</code><span className="ci-v">{push ? (push > 1 ? j.v2 : j.v1) : ''}</span></div>)}
  </div>
);
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>KitobShop lentasini <span className="italic" style={{ color: T.accent }}>ishonchli</span> qilamiz.</>, ru: <>Делаем ленту KitobShop <span className="italic" style={{ color: T.accent }}>надёжной</span>.</> })}</h2></div>
      <Mentor>{tr({ uz: <>KitobShop'da lenta bor va qizil testni Copilot bilan tuzatdingiz. Bugun <span className="mono">ci.yml</span> ga 3 ta haqiqiy yaxshilash qo'shasiz: ikki Node versiyasida birdan tekshirish (matrix), tez yig'ish (kesh) va maxfiy kalitni seyfdan olish (secrets). Sinov reysi va eski yukni qaytarishni maketda ko'rasiz.</>, ru: <>В KitobShop есть лента, и красный тест Вы починили с Copilot. Сегодня добавляете в <span className="mono">ci.yml</span> 3 настоящих улучшения: проверка сразу в двух версиях Node (matrix), быстрая сборка (кеш) и секретный ключ из сейфа (secrets). Тестовый рейс и возврат старого багажа увидите на макете.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Dars oxirida · GitHub Actions', ru: 'К концу урока · GitHub Actions' })}</p>
          <ProPanel push={2} />
        </Col>
        <Col>
          <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: 'Dars oxirida · GitHub Actions', ru: 'К концу урока · GitHub Actions' })}</p>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: `Bugungi ${BLOK2.length} blok`, ru: `${BLOK2.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{BLOK2.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== a2 — KitobShop ci.yml: matrix (Node 22, 24), cache: npm, JWT_SECRET seyfdan; push maketi — 1-push kesh yo'q, 2-push kesh tiklandi; kalit ochiq yozilsa — ogohlantirish =====
const PRO_YML = [
  'name: CI',
  'on: push',
  'jobs:',
  '  lenta:',
  '    runs-on: ubuntu-latest',
  '    strategy:',
  '      matrix:',
  '        node: [22, 24]',
  '    env:',
  '      JWT_SECRET: ${{ secrets.JWT_SECRET }}',
  '    steps:',
  '      - uses: actions/checkout@v4',
  '      - uses: actions/setup-node@v4',
  '        with:',
  '          node-version: ${{ matrix.node }}',
  '          cache: npm',
  '      - run: npm ci',
  '      - run: npm test',
  '      - run: npm run lint',
  '      - run: npm run build'
].join('\n');
const PRO_QADAM = [
  { uz: "GitHub → KitobShop → Settings → Secrets and variables → Actions → «New repository secret»: nomi `JWT_SECRET`, qiymati — `.env` dagi qiymat.", ru: 'GitHub → KitobShop → Settings → Secrets and variables → Actions → «New repository secret»: имя `JWT_SECRET`, значение — из `.env`.' },
  { uz: "`.github/workflows/ci.yml` ni nusxa bilan almashtiring: `strategy.matrix`, `env` va `cache: npm` qo'shildi.", ru: 'Замените `.github/workflows/ci.yml` копией: добавлены `strategy.matrix`, `env` и `cache: npm`.' },
  { uz: "`git add .` → `git commit -m \"Ishonchli lenta\"` → `git push`.", ru: '`git add .` → `git commit -m "Ishonchli lenta"` → `git push`.' },
  { uz: "Actions: ikki ish birga yonadi — «lenta (22)» va «lenta (24)». Jurnalda kalit `***` bo'lib ko'rinadi.", ru: 'Actions: два задания запускаются вместе — «lenta (22)» и «lenta (24)». В журнале ключ виден как `***`.' },
  { uz: "Yana bitta kichik push (masalan README) — `setup-node` qadamida kesh tiklanadi, `npm ci` tezroq o'tadi.", ru: 'Ещё один маленький push (например, README) — на шаге `setup-node` кеш восстанавливается, `npm ci` проходит быстрее.' }
];
const ScreenProCi = ({ screen, onNext, onPrev }) => {
  const [push, setPush] = useState(0);
  const [ochiq, setOchiq] = useState(false);
  const [sc, setSc] = useState(0);
  const pushQil = () => { setPush(n => n + 1); setSc(n => n + 1); };
  const ikkinchi = push > 1;
  const jurnal = push === 0 ? [] : [
    `$ git push · ${tr({ uz: 'lenta boshlandi — 2 ish birga', ru: 'лента запущена — 2 задания вместе' })}`,
    `setup-node · ${ikkinchi ? tr({ uz: 'kesh tiklandi (Cache restored)', ru: 'кеш восстановлен (Cache restored)' }) : tr({ uz: 'kesh topilmadi — birinchi marta saqlanadi', ru: 'кеш не найден — сохраняется впервые' })}`,
    `✓ npm ci · ${ikkinchi ? '6s' : '38s'}`,
    ochiq ? 'env JWT_SECRET: kitob-sir-2026' : 'env JWT_SECRET: ***',
    '✓ npm test · ✓ npm run lint · ✓ npm run build'
  ];
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · GitHub Actions', ru: 'Практика 2 · GitHub Actions' })} screen={screen} scrollSignal={sc} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>KitobShop lentasiga <span className="italic" style={{ color: T.accent }}>matrix, kesh va seyf</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Matrix, кеш и сейф</span> для ленты KitobShop.</> })}</h2></div>
        <Mentor>{tr({ uz: <><span className="mono">matrix</span> — KitobShop ikki Node versiyasida birdan tekshiriladi. <span className="mono">cache: npm</span> — ikkinchi push'dan boshlab paketlar tezroq o'rnatiladi. <span className="mono">env</span> — kalit seyfdan keladi va jurnalda <span className="mono">***</span> bo'lib ko'rinadi. Ikki marta push qilib ko'ring.</>, ru: <><span className="mono">matrix</span> — KitobShop проверяется сразу в двух версиях Node. <span className="mono">cache: npm</span> — со второго push пакеты ставятся быстрее. <span className="mono">env</span> — ключ приходит из сейфа и в журнале виден как <span className="mono">***</span>. Сделайте push два раза.</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-chips">
              <button type="button" className="am-saqla" onClick={pushQil}>{push ? tr({ uz: 'Yana git push', ru: 'Ещё git push' }) : 'git push'}</button>
              <button type="button" className={`am-chip ${ochiq ? 'on' : ''}`} aria-pressed={ochiq} onClick={() => setOchiq(x => !x)}>{ochiq ? tr({ uz: '✓ Kalit kodda ochiq', ru: '✓ Ключ открыт в коде' }) : tr({ uz: '+ Kalitni kodga ochiq yozish', ru: '+ Записать ключ в код открыто' })}</button>
            </div>
            <ProPanel push={push} />
            <div className="rj-oyna">
              <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">Actions · {tr({ uz: 'lenta jurnali', ru: 'журнал ленты' })}</span></div>
              <div className="rj-body">
                {push === 0 ? <div className="rj-li pro-izoh">{tr({ uz: '// git push bosing', ru: '// нажмите git push' })}</div>
                  : jurnal.map((l, i) => <div key={i} className={`rj-li ${i === 3 && ochiq ? 'pro-ochiq' : ''} ${i === 1 && ikkinchi ? 'pro-kesh' : ''}`}>{l}</div>)}
              </div>
            </div>
            {ochiq && <p className="ql-xabar xato" role="status">{fmtCode(tr({ uz: "Kalit kodda ochiq yozilsa, repo'ni ko'rgan har kim uni o'qiydi va GitHub uni yashira olmaydi. Seyfga qo'ying: `${{ secrets.JWT_SECRET }}`.", ru: 'Если ключ записан в коде открыто, его прочитает любой, кто видит репозиторий, и GitHub не сможет его скрыть. Положите в сейф: `${{ secrets.JWT_SECRET }}`.' }))}</p>}
            {ikkinchi && !ochiq && <p className="ql-xabar info" role="status">{tr({ uz: "Ikkinchi push: kesh tiklandi, npm ci 38s → 6s. Ikkala Node versiyasi yashil, kalit yashirin.", ru: 'Второй push: кеш восстановлен, npm ci 38s → 6s. Обе версии Node зелёные, ключ скрыт.' })}</p>}
          </Col>
          <Col>
            <KodNusxa yorliq={{ uz: '.github/workflows/ci.yml', ru: '.github/workflows/ci.yml' }} kod={PRO_YML} />
            <QadamTugma b={PRO_QADAM} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
