
// ============================================================
//  8 · matrix: bitta fayl, ikki Node — fail-fast 24 ni bekor qildi (run 30)
// ============================================================
const L8_22 = runLog('30', 'Run npm ci', (l) => /^\$|EUSAGE|Missing:/.test(l), 'test (22)');
// F-1109-06: xulosa — ikki karta o'rniga ikki haqiqiy run vaqt o'qida (41844079933 · 41844193379) va annotatsiya xabari
function Matrix8() {
  const ax = <div className="ax"><span>0 s</span><span>10</span><span>20</span><span>30 s</span></div>;
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("fail-fast: true (odatiy) · run 41844079933", "fail-fast: true (по умолчанию) · run 41844079933")}</p>
      <div className="c2-m8">
        <span className="lb">test (22)</span><div className="tr"><div className="bar bad" style={{ left: 0, width: '33%' }}>{t("npm ci qizil · 10 s", "npm ci красный · 10 s")}</div></div>
        <span className="lb">test (24)</span><div className="tr"><div className="bar can" style={{ left: 0, width: '73%' }}>{t("cancelled · 22 s — yarmida to'xtatildi", "cancelled · 22 s — остановлен на полпути")}</div></div>
        {ax}
      </div>
      <div className="z-term"><span className="r">X The strategy configuration was canceled because "test._22" failed</span></div>
    </div>
    <div className="z-card">
      <p className="z-h">fail-fast: false · run 41844193379</p>
      <div className="c2-m8">
        <span className="lb">test (22)</span><div className="tr"><div className="bar bad" style={{ left: '16%', width: '33%' }}>{t("npm ci qizil · 10 s", "npm ci красный · 10 s")}</div></div>
        <span className="lb">test (24)</span><div className="tr"><div className="bar ok" style={{ left: 0, width: '83%' }}>{t("yashil · 25 s · Tests: 25 passed", "зелёный · 25 s · Tests: 25 passed")}</div></div>
        {ax}
      </div>
      <span className="z-mut">{t("Run baribir qizil — lekin to'liq javob bor: 24 da hammasi o'tadi, muammo faqat 22 da.", "Run всё равно красный — но ответ полный: на 24 всё проходит, проблема только на 22.")}</span>
    </div>
    <div className="z-rule">{t("matrix mashinani emas, ", "matrix проверяет не машину, а ")}<b>{t("versiyani", "версию")}</b>{t(" sinaydi: bitta kod × bir nechta Node, parallel.", ": один код × несколько Node, параллельно.")}</div>
  </div>;
}
const S8 = mkS(8, [{ v: 'yml' }, { v: 'run22' }, { v: 'run24' }, { v: 'sum' }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <>
    {seg.v === 'yml' && <Ide files={compact(FILES(), F.ci)} active={F.ci}><CodePanel file="ci.yml · matrix" lines={kod('YML_1_MATRIX', { ...rngIds(6, 8, 'm'), 13: 'v' })} focus={['m', 'v']} /></Ide>}
    {seg.v === 'run22' && <RunView k="30" job="test (22)" ann={null} only={/^Run np/} open="Run npm ci" lines={L8_22} hlStep="Run npm ci" />}
    {seg.v === 'run24' && <RunView k="30" job="test (24)" annAll only={/^Run np/} hlStep={['Run npx tsc --noEmit']} />}
    {seg.v === 'sum' && <Matrix8 />}
  </>} />;
}

// ============================================================
//  9 · fail-fast: false — 22 qizil, 24 yashil (run 31)
// ============================================================
const L9_22 = runLog('31', 'Run npm ci', (l) => /^\$|Missing:/.test(l), 'test (22)');
const S9 = mkS(9, [{ v: 'run24' }, { v: 'run22' }, { v: 'who' }, { v: 'sum' }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <>
    {seg.v === 'run24' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file="ci.yml · fail-fast: false" lines={kod('YML_2_MATRIX_FAIL_FAST_FALSE', { 7: 'f' }, 6, 9)} focus={['f']} /><RunView k="31" job="test (24)" ann={null} only={/^Run np/} /></div>}
    {seg.v === 'run22' && <RunView k="31" job="test (22)" only={/^Run np/} open="Run npm ci" lines={L9_22} hlStep="Run npm ci" />}
    {seg.v === 'who' && <div className="pg-two">
      <Card c={C1.ci} h={t("Kutubxona (npm paketi)", "Библиотека (npm-пакет)")}><p>{t("Har xil loyihalarda, har xil Node'da ishlatiladi → ", "Используется в разных проектах, на разных Node → ")}<b>{t("matrix kerak", "нужен matrix")}</b>: 20, 22, 24…</p></Card>
      <Card c={T.green} h={t("Bot / sayt (OrderBotNest)", "Бот / сайт (OrderBotNest)")}><p>{t("Bitta serverda, bitta Node'da yuradi → ", "Работает на одном сервере, на одном Node → ")}<b>{t("mashinangizdagi bitta raqam", "одного числа с вашей машины")}</b>{t(" yetadi (CI/CD-1 17-ekran).", " хватает (CI/CD-1, экран 17).")}</p></Card>
    </div>}
    {/* F-1120-02 (M51): xulosada darsning rasmi (matnli qoida o'rniga) — matrix: test (22) qizil, test (24) yashil, fail-fast: false — ikkalasi oxirigacha (run 31) */}
    {seg.v === 'sum' && <div style={{ display: 'grid', gap: 10 }}><RunView k="31" job="test (24)" ann={null} only={/^Run np/} /><div className="mk-light" style={{ padding: 12 }}><BotMap loc={DB_ALL} on={[...CI_ON, 'db', 'products', 'users', 'carts', 'orders']} dbLabel={DB_SVC} jest={{ name: 'matrix', steps: [['test (22)', 'bad'], ['test (24)', 'ok']], res: 'fail', badge: 'fail-fast: false' }} max={1} tag={t("matrix — bir nechta versiya, parallel; fail-fast tez, false — to'liq javob", 'matrix — несколько версий параллельно; fail-fast быстро, false — полный ответ')} /></div></div>}
  </>} />;
}

// ============================================================
//  10 · Tekshiruv 2 — fail-fast (run 30)
// ============================================================
function Screen10(p) {
  return MC(p, 10, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="ci.yml · 6–8" lines={kod('YML_1_MATRIX', rngIds(6, 8, 'm'), 6, 8)} focus={['m']} />
      <RunView k="30" job="test (22)" ann={null} only={/^Run npm ci/} src={t("haqiqiy run · #21 · 10-soniyada", "настоящий run · #21 · на 10-й секунде")} />
    </div>,
    after: <RunView k="30" job="test (24)" ann={null} only={/tsc|npm test|build/} />,
  });
}

// ============================================================
//  11 · Amaliyot 2 — matrix o'z reposida
// ============================================================
const P11 = mkPractice(11, [[], [0, 1], [2, 3], []], {
  code: [{ step: 0, file: F.ci, lines: kod('YML_1_MATRIX') }, { step: 2, file: F.ci, lines: kod('YML_2_MATRIX_FAIL_FAST_FALSE') }],
});
function ScreenP11(p) { return <Practice p={p} S={P11.S} steps={P11.steps} trouble={P11.trouble} proof={P11.proof} code={P11.code} tree={FILES()} />; }

// ============================================================
//  12 · Smoke lentada: bazali tekshiruvga baza qayerdan — services (umumiy)
// ============================================================
// F-1109-06: xulosa — bitta qoida o'rniga ikki job yonma-yon va lentadagi haqiqiy smoke logi (run 41845454983, cicd2v2-out/32)
function Smoke12() {
  return <div className="z">
    <div className="z-two">
      <div className="z-card">
        <p className="z-h">{t("JOB test — bazasiz · 19 s", "JOB test — без базы · 19 s")}</p>
        <div className="z-flow">
          <div className="z-st"><b>npm test</b><span className="z-mut">Jest</span></div>
          <div className="z-ar">→</div>
          <div className="z-st blue"><b>manager</b><span className="zm">mock</span><span className="z-mut">{t("baza yo'q", "базы нет")}</span></div>
        </div>
        <span className="z-mut">{t("tez: kodning mantiqini tekshiradi", "быстро: проверяет логику кода")}</span>
      </div>
      <div className="z-card" style={{ borderColor: 'var(--pg)' }}>
        <p className="z-h">JOB smoke — needs: test · 41 s</p>
        <div className="z-flow">
          <div className="z-st"><b>npm run smoke</b><span className="z-mut">{t("bot jarayoni", "процесс бота")}</span></div>
          <div className="z-ar">→</div>
          <div className="z-st blue"><b>services: postgres:18</b><span className="z-mut">{t("konteyner · 13 s ko'tarildi", "контейнер · поднялся за 13 s")}</span><span className="zm" style={{ fontSize: 11.5 }}>localhost:5432/shop</span></div>
        </div>
        <span className="z-mut">{t("to'liq: haqiqiy bazaga yozadi, job tugasa konteyner o'chadi", "полно: пишет в настоящую базу, после job контейнер удаляется")}</span>
      </div>
    </div>
    <div className="z-card">
      <p className="z-h">{t("Run 41845454983 · smoke logi — lentada haqiqiy Postgres bilan", "Run 41845454983 · лог smoke — в конвейере с настоящим Postgres")}</p>
      <div className="z-term"><span className="m">— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)</span>{'\n'}<span className="g">✓</span> telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»{'\n'}<span className="g">✓</span> savat restartdan o'tdi → «Savat:»{'\n'}<span className="g">✓</span> buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»{'\n'}<span className="m">— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor</span>{'\n'}<span className="g">✓</span> ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0{'\n'}<span className="g">✓</span> ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1{'\n'}<span className="g">NATIJA: 5/5 ✓</span></div>
    </div>
    <div className="z-rule">{t("Unit test — ", "Unit test — ")}<b>{t("bazasiz, tez", "без базы, быстро")}</b>{t(". Smoke — ", ". Smoke — ")}<b>{t("bazali, to'liq", "с базой, полный")}</b>{t(". Lentada ikkalasi: test → smoke.", ". В конвейере оба: test → smoke.")}</div>
  </div>;
}
const S12 = mkS(12, [{ v: 'two' }, { v: 'smoke' }, { v: 'services' }, { v: 'sum' }]);
function Screen12(p) {
  return <Lesson p={p} S={S12} scene={({ seg }) => <>
    {seg.v === 'two' && <div className="pg-two">
      <Card c={T.green} h="Unit test (Jest-2)" hl><p>{t("mock · baza yo'q · 25 test · ", "mock · базы нет · 25 тестов · ")}<b>2 s</b>{t(" — lentada bor", " — есть в конвейере")}</p></Card>
      <Card c={C1.pg} h="Smoke (TgPg)"><p><code>npm run smoke</code>{t(" — haqiqiy Nest + Telegraf kodi, ", " — настоящий код Nest + Telegraf, ")}<b>{t("haqiqiy Postgres", "настоящий Postgres")}</b>: restart 3 + race 2 → <code>NATIJA: 5/5 ✓</code>{t(" — lentada yo'q: runner'da baza yo'q", " — в конвейере нет: на runner нет базы")}</p></Card>
    </div>}
    {seg.v === 'smoke' && <div style={{ display: 'grid', gap: 8 }}>
      <Code k="PKG_SMOKE" files={FILES()} active={F.pkg} ids={{ [lineN('PKG_SMOKE', /"smoke"/)]: 's' }} focus={['s']} />
      <CodePanel file="scripts/smoke.js" lines={[...kod('SMOKE_URL', { [lineN('SMOKE_URL', /DATABASE_URL/)]: 'u' }), { h: '<span class="cm">…</span>', n: '' }, ...kod('SMOKE_DB', { [lineN('SMOKE_DB', /CREATE DATABASE/)]: 'd' })]} focus={['u', 'd']} />
    </div>}
    {seg.v === 'services' && <div className="pg-two">
      <div className="c1-mach ok"><h4>{t("Job mashinasi (runner)", "Машина job (runner)")}</h4><div className="r"><span>{t("qadamlar", "шаги")}</span><code>npm ci → npm run smoke</code></div><div className="r"><span>DATABASE_URL</span><code>postgresql://…@localhost:5432/shop</code></div><p>smoke <code>localhost:5432</code>{t(" ga ulanadi — yonidagi konteynerga", " — это соседний контейнер")}</p></div>
      <div className="c1-mach pg hl"><h4>services: postgres</h4><div className="r"><span>image</span><code>postgres:18</code></div><div className="r"><span>port</span><code>5432 → 5432</code></div><div className="r"><span>healthcheck</span><code>pg_isready</code></div><p>{t("job bilan tug'iladi (", "рождается с job (")}<code>Initialize containers</code>{t("), job bilan o'ladi (", "), умирает с job (")}<code>Stop containers</code>)</p></div>
    </div>}
    {seg.v === 'sum' && <Smoke12 />}
  </>} />;
}

// ============================================================
//  13 · services: postgres + needs: test — smoke job yashil (run 32)
// ============================================================
const L13 = runLog('32', 'Run npm run smoke', (l) => /^\$|== vaqt|✓|✗|NATIJA/.test(l), 'smoke');
const S13 = mkS(13, [{ v: 'needs' }, { v: 'services' }, { v: 'steps' }, { v: 'log' }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {seg.v === 'needs' && <Ide files={compact(FILES(), F.ci)} active={F.ci}><CodePanel file="ci.yml · smoke job" lines={kod('YML_3_SMOKE_SERVICES', { 16: 'n', 17: 'n' }, 14, 20)} focus={['n']} /></Ide>}
    {seg.v === 'services' && <CodePanel file="ci.yml · services" lines={kod('YML_3_SMOKE_SERVICES', { 19: 's', 20: 's', 21: 'i', 24: 'd', 26: 'p', ...rngIds(27, 30, 'h') }, 19, 30)} focus={['s', 'i', 'd', 'p', 'h']} />}
    {seg.v === 'steps' && <div style={{ display: 'grid', gap: 8 }} className="c1-small"><CodePanel file={t("ci.yml · smoke qadamlari", "ci.yml · шаги smoke")} lines={kod('YML_3_SMOKE_SERVICES', { 38: 'r', 39: 'e', 40: 'e' }, 31, 40)} focus={['r', 'e']} /><RunView k="32" job="smoke" only={/Initialize|npm ci|npm run smoke|Stop/} hlStep="Initialize containers" /></div>}
    {seg.v === 'log' && <RunView k="32" job="smoke" only={/Initialize|npm ci|npm run smoke|Stop/} open="Run npm run smoke" lines={L13} hlStep="Run npm run smoke" />}
  </>} />;
}

// ============================================================
//  14 · DATABASE_URL qayerdan: env (konteyner) va secrets (tashqi); nomi xato → bo'sh (run 33)
// ============================================================
const L14 = runLog('33', 'Run npm run smoke', (l) => /^\$|^env:|DATABASE_URL:|SMOKE XATO: DATABASE_URL|##\[error\]/.test(l), 'smoke');
// F-1120-02 (M52): 3-segment (x) — mentor 41-satrdagi secrets.DATABASE_URL ni o'zi bosadi → DATABSE_URL (run 33 — haqiqiy)
const OK41 = kod('YML_4_SMOKE_SECRET_XATO', { 41: 'x' }, 38, 41).map((l) => (l.n === 41 ? { ...l, h: l.h.replace('DATABSE_URL', '<span class="n1-act" data-act="1">DATABASE_URL</span>') } : l));
const SecretMini = ({ broken, known, pins }) => <N1Mini><FlowMini tag={t("secret nomi → qiymat → smoke", 'имя secret → значение → smoke')}
  boxes={[[broken ? 'secrets.DATABSE_URL' : 'secrets.DATABASE_URL', t('ci.yml · 41-satr', 'ci.yml · строка 41'), broken ? 'bad' : ''], [t('qiymat', 'значение'), !broken ? '***' : known ? t("bo'sh — xato yo'q", 'пусто — ошибки нет') : '?', ''], ['npm run smoke', !broken ? '✓' : known ? '✕' : '?', broken && known ? 'bad' : '']]}
  res={broken ? [known ? 'SMOKE XATO: DATABASE_URL topilmadi · exit code 2' : '?', 'bad'] : null} pins={pins} /></N1Mini>;
const S14 = mkS(14, [{ v: 'env' }, { v: 'secrets' }, { v: 'act' }, { v: 'run' }, { v: 'sum' }]);
function Screen14(p) {
  const cards = (hl) => <div className="pg-two">
    <div className={`c1-mach ok${hl === 'env' ? ' hl' : ''}`}><h4>{t("env: — konteyner", "env: — контейнер")}</h4><div className="r"><span>{t("ci.yml, smoke qadami", "ci.yml, шаг smoke")}</span><code>env:</code></div><p><code>DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop</code></p><p>{t("yml'da ochiq — to'g'ri: konteyner job ichida tug'iladi va o'ladi, tashqaridan ulanib bo'lmaydi", "открыто в yml — правильно: контейнер рождается и умирает внутри job, снаружи не подключиться")}</p></div>
    <div className={`c1-mach${hl === 'secrets' ? ' hl' : ''}`}><h4>{t("secrets — tashqi resurs", "secrets — внешний ресурс")}</h4><div className="r"><span>GitHub</span><code>Settings → Secrets → Actions</code></div><div className="r"><span>log</span><code>***</code></div><p><code>{'DATABASE_URL: ${{ secrets.DATABASE_URL }}'}</code></p><p>{t("haqiqiy baza, bot tokeni — yml'ga yozilmaydi: repo ochiq, tarix abadiy", "настоящая база, токен бота — в yml не пишутся: репозиторий открыт, история вечна")}</p></div>
  </div>;
  return <Lesson p={p} S={S14} scene={(b) => <Scene14 b={b} cards={cards} />} />;
}
// Qadamlar: 0 env · 1 secrets · 2 bosing (act) · 3 run qizil, bo'laklar 1·2 · 4 xulosa
function Scene14({ b, cards }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const v = beat === 2 ? (act.hit ? 'broke' : 'act') : seg.v;
  const mini = <SecretMini broken={v !== 'act'} known={beat >= 3} pins={beat === 3 ? { 0: 1, 2: 2 } : {}} />;
  return <>
    {seg.v === 'env' && cards('env')}
    {seg.v === 'secrets' && cards('secrets')}
    {v === 'act' && <div style={{ display: 'grid', gap: 8 }}><div onClick={act.onClick}><CodePanel file="ci.yml" lines={OK41} focus={['x']} /></div>{mini}</div>}
    {v === 'broke' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file={t("ci.yml · 41-satr — harf tushib qoldi", "ci.yml · строка 41 — пропала буква")} lines={kod('YML_4_SMOKE_SECRET_XATO', { 41: 'x' }, 38, 41)} focus={['x']} />{mini}</div>}
    {v === 'run' && <div style={{ display: 'grid', gap: 8 }} className="c1-small"><CodePanel file={t("ci.yml · 41-satr — harf tushib qolgan", "ci.yml · строка 41 — пропала буква")} lines={kod('YML_4_SMOKE_SECRET_XATO', { 41: 'x' }, 38, 41)} focus={['x']} />{mini}<RunView k="33" job="smoke" ann={null} only={/npm run smoke/} open="Run npm run smoke" lines={L14} /></div>}
    {seg.v === 'sum' && <div style={{ display: 'grid', gap: 10 }}>{cards(null)}<div className="n2-warn">{t("Secret nomi xato — GitHub ", "Неверное имя secret — GitHub ")}<b>{t("indamaydi", "молчит")}</b>{t(", qiymat bo'sh, dastur yiqiladi («topilmadi»). Logda ", ", значение пустое, программа падает («topilmadi»). В логе ")}<code>***</code>{t(" — runner URL ichidagi ", " — runner внутри URL ")}<code>user:parol@</code>{t(" ni o'zi yashiradi (run 33, secret'siz ham).", " скрывает сам (run 33, и без secret).")}</div></div>}
  </>;
}

// ============================================================
//  15 · Tekshiruv 3 — LineCheck: secret nomi xato (4-smoke-secret-xato.yml 31–41, 41-satr → indeks 10)
// ============================================================
const LC15 = kod('YML_4_SMOKE_SECRET_XATO', {}, 31, 41);
const LC15_FIXED = LC15.flatMap((l) => l.n === 41 ? [{ ...l, gone: true }, { h: yamlLine('          DATABASE_URL: ${{ secrets.DATABASE_URL }}'), n: 41, neu: true }] : [l]);
const T15X = runLogLines('33', 'Run npm run smoke', (l) => /SMOKE XATO: DATABASE_URL|##\[error\]/.test(l), 'smoke');
function Screen15(p) {
  const m = MDT[15];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={t("ci.yml · smoke qadamlari", "ci.yml · шаги smoke")} lines={LC15} target={10}
    tree={{ root: MKCFG.root, files: compact(FILES(), F.ci), active: F.ci }}
    fixed={LC15_FIXED} fixedExtra={[{ file: t('GitHub · smoke job logi (run 33) — konteyner uchun oddiy env: ham yetadi (13-ekran)', "GitHub · лог job smoke (run 33) — для контейнера хватает обычного env: (экран 13)"), lines: T15X }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}
