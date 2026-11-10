
// ============================================================
//  1 · Kirish — dars oxiridagi natija: main'dagi PR merge run'i (37): test + smoke
// ============================================================
const PLAN1 = ['Umumiy tushuncha', "Qizilni o'qish va cache", 'matrix', 'Smoke va secret', 'PR va AI', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [], res: true }, { hl: [0, 1] }, { hl: [2, 3, 4, 5] }, { hl: [5] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    {seg.res && <><div className="mk-tag" style={{ margin: 0 }}>{t("Dars oxirida — main'da ikki job: test va smoke (Postgres bilan)", "В конце урока — в main две job: test и smoke (с Postgres)")}</div><RunView k="37" job="smoke" only={/Initialize|npm ci|npm run smoke|Stop/} /></>}
  </div>} />;
}

// ============================================================
//  2 · Actions nima qiladi: run → job → step, GitHub qo'shgan qadamlar (run 10 — Post'lar bilan)
// ============================================================
const GH_STEPS = ['Set up job', 'Post Run actions/setup-node@v4', 'Post Run actions/checkout@v4', 'Complete job'];
// F-1109-06: xulosa — uch ta'rif kartasi o'rniga haqiqiy run 41845454983 ichma-ich (run → ikki job → qadamlar)
const N2_TEST = [['Set up job', '1 s', 1], ['actions/checkout@v4', '0 s', 1], ['actions/setup-node@v4', '4 s', 1], ['npm ci', '5 s'], ['npx tsc --noEmit', '2 s'], ['npm test', '1 s'], ['npm run build', '3 s']];
const N2_SMOKE = [['Set up job', '0 s', 1], ['Initialize containers', '13 s', 1], ['actions/checkout@v4', '1 s', 1], ['actions/setup-node@v4', '3 s', 1], ['npm ci', '10 s'], ['npm run smoke', '9 s']];
function RunNest2() {
  const st = (rows) => rows.map(([n, s, pre]) => <div key={n} className={'st' + (pre ? ' pre' : '')}>{n}<span>{s}</span></div>);
  return <div className="z">
    <div className="c2-n2">
      <div className="lab">RUN · 41845454983 · push · ci-sinov · 9fc3af1 · <span style={{ color: '#15803D' }}>✓ success</span></div>
      <div className="jobs">
        <div className="job"><div className="lab">{t("JOB test · alohida mashina · 19 s", "JOB test · отдельная машина · 19 s")}</div>{st(N2_TEST)}</div>
        <div className="need">needs<br />→</div>
        <div className="job"><div className="lab">{t("JOB smoke · alohida mashina · 41 s", "JOB smoke · отдельная машина · 41 s")}</div>{st(N2_SMOKE)}</div>
      </div>
    </div>
    <div className="z-three">
      <div className="z-card" style={{ borderColor: '#1D4ED8', padding: 10 }}><b style={{ color: '#1D4ED8' }}>run</b><span className="z-mut">{t("bitta push → bitta run: yashil yoki qizil", "один push → один run: зелёный или красный")}</span></div>
      <div className="z-card" style={{ borderColor: '#15803D', padding: 10 }}><b style={{ color: '#15803D' }}>job</b><span className="z-mut">{t("jobs: ostidagi har nom — alohida mashina; needs tartib beradi", "каждое имя под jobs: — отдельная машина; needs задаёт порядок")}</span></div>
      <div className="z-card" style={{ borderColor: '#6D3BE4', padding: 10 }}><b style={{ color: '#6D3BE4' }}>step</b><span className="z-mut">{t("uses / run qatori; kulranglarini GitHub o'zi qo'shadi", "строка uses / run; серые GitHub добавляет сам")}</span></div>
    </div>
  </div>;
}
const S2 = mkS(2, [{ v: 'yml', f: ['j'] }, { v: 'yml', f: ['s'] }, { v: 'run', hl: GH_STEPS }, { v: 'three' }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <>
    {seg.v === 'yml' && <div className="pg-two"><Yml k="CI_START" title="ci.yml · cicd2-start" ids={{ 3: 'j', 4: 'j', ...rngIds(6, 15, 's') }} focus={seg.f} /><RunView k="c1-10" post /></div>}
    {seg.v === 'run' && <RunView k="c1-10" post hlStep={seg.hl} />}
    {seg.v === 'three' && <RunNest2 />}
  </>} />;
}

// ============================================================
//  3 · uses ichida: Set up job, checkout, setup-node loglari (run 10 — aynan)
// ============================================================
const L3_SETUP = runLog('c1-10', 'Set up job', (l) => /Current runner version|^Image:|^Contents:|Download action repository/.test(l));
const L3_CHECKOUT = runLog('c1-10', 'Run actions/checkout@v4', (l) => /Syncing repository|Deleting the contents|git init|fetch --no-tags/.test(l)).map((l) => ({ ...l, t: l.t.replace(/\[command\]\/usr\/bin\//, '$ ').replace(/ origin \+[0-9a-f]+:.*$/, ' origin +ef9e667…') }));
const L3_NODE = runLog('c1-10', 'Run actions/setup-node@v4', (l) => /^\s+node-version:|^\s+cache:|Found in cache|^node: |^npm: /.test(l));
// F-1109-06: xulosa — uch karta o'rniga job vaqt chizig'i (run 41832879751) va uch tayyor qadamning haqiqiy log satrlari
function Uses3() {
  return <div className="z c2-s3">
    <div className="z-card">
      <p className="z-h">{t("JOB test · run 41832879751 · 25 s — qadamlar vaqt bo'yicha", "JOB test · run 41832879751 · 25 s — шаги по времени")}</p>
      <div className="c2-t3">
        <div className="h" style={{ flex: 1.2 }}>1</div><div className="h" style={{ flex: 0.8 }}>2</div><div className="h" style={{ flex: 1.2 }}>3</div>
        <div className="m" style={{ flex: 11 }}>npm ci · 11 s</div><div className="m" style={{ flex: 3 }}>tsc 3 s</div><div className="m" style={{ flex: 2 }}>test</div><div className="m" style={{ flex: 3 }}>build</div><div className="p" style={{ flex: 2.4 }}>post</div>
      </div>
      <div className="c2-t3l"><span>:25</span><span><b style={{ color: '#1D4ED8' }}>1</b> Set up job · <b style={{ color: '#1D4ED8' }}>2</b> checkout · <b style={{ color: '#1D4ED8' }}>3</b> setup-node{t(" — GitHub tayyor qadamlari; kulrang — sizniki", " — готовые шаги GitHub; серые — ваши")}</span><span>:49</span></div>
    </div>
    <div className="z-three">
      <div className="z-card" style={{ borderColor: '#1D4ED8', padding: 10 }}><b style={{ color: '#1D4ED8' }}>Set up job</b>
        <div className="z-term">Image: <span className="y">ubuntu-26.04</span>{'\n'}GITHUB_TOKEN Permissions{'\n'}Contents: <span className="y">read</span>{'\n'}Download action repository 'actions/checkout@v4' (SHA:11d5…7262)</div>
        <span className="z-mut">{t("qaysi mashina, qanday ruxsat", "какая машина, какие права")}</span></div>
      <div className="z-card" style={{ borderColor: '#15803D', padding: 10 }}><b style={{ color: '#15803D' }}>checkout</b>
        <div className="z-term">git init /home/runner/work/OrderBotNest/…{'\n'}git … fetch … <span className="y">--depth=1</span> origin +ef9e667…</div>
        <span className="z-mut">{t("bo'sh papka, faqat oxirgi commit", "пустая папка, только последний commit")}</span></div>
      <div className="z-card" style={{ borderColor: '#6D3BE4', padding: 10 }}><b style={{ color: '#6D3BE4' }}>setup-node</b>
        <div className="z-term">Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64{'\n'}node: <span className="y">v24.22.1</span>{'\n'}npm: <span className="y">11.19.1</span></div>
        <span className="z-mut">{t("runner'dagi tayyor Node", "готовый Node на runner")}</span></div>
    </div>
    <div className="z-rule"><b>uses</b>{t(" — boshqalar yozgan skript, lekin logi ochiq: mashina, versiya, ruxsat — shu yerda.", " — скрипт, написанный другими, но лог открыт: машина, версия, права — здесь.")}</div>
  </div>;
}
const S3 = mkS(3, [{ v: 'setup' }, { v: 'checkout' }, { v: 'node' }, { v: 'sum' }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <>
    {seg.v === 'setup' && <RunView k="c1-10" open="Set up job" lines={L3_SETUP} hlStep="Set up job" only={/Set up job|checkout|setup-node|npm ci/} />}
    {seg.v === 'checkout' && <RunView k="c1-10" open="Run actions/checkout@v4" lines={L3_CHECKOUT} hlStep="Run actions/checkout@v4" only={/Set up job|checkout|setup-node|npm ci/} />}
    {seg.v === 'node' && <RunView k="c1-10" open="Run actions/setup-node@v4" lines={L3_NODE} hlStep="Run actions/setup-node@v4" only={/Set up job|checkout|setup-node|npm ci/} />}
    {seg.v === 'sum' && <Uses3 />}
  </>} />;
}

// ============================================================
//  4 · Qizil run'ni o'qish: annotatsiya qisqa, sabab — qadam logida (run 15 tsc, run 11 test)
// ============================================================
const L4_TSC = runLog('c1-15', 'Run npx tsc --noEmit', (l) => /^\$|error TS|Types of property|Type 'number'/.test(l));
const L4_TEST = runLog('c1-11', 'Run npm test', (l) => /^\$|^FAIL|●|Kolonka|> 37|^Tests:|##\[error\]/.test(l));
const ORDER4 = ['Belgi: run qizil', 'Chapda qizil job', 'Qizil qadam (✗)', 'Qadam logi — sabab shu yerda', '##[error] satrlari → annotatsiya (qisqa)'];
const S4 = mkS(4, [{ v: 'ann' }, { v: 'log' }, { v: 'test' }, { v: 'order' }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <>
    {seg.v === 'ann' && <RunView k="c1-15" annAll only={/^Run np/} hlStep="Run npx tsc --noEmit" />}
    {seg.v === 'log' && <RunView k="c1-15" ann={null} only={/^Run np/} open="Run npx tsc --noEmit" lines={L4_TSC} hlStep="Run npx tsc --noEmit" />}
    {seg.v === 'test' && <RunView k="c1-11" only={/^Run np/} open="Run npm test" lines={L4_TEST} hlStep="Run npm test" />}
    {seg.v === 'order' && <div className="mk-light" style={{ padding: 16 }}><div className="mk-tag">{t("Qizil run'ni o'qish tartibi", "Порядок чтения красного run")}</div><div className="mk-plan">{ORDER4.map((x, i) => <div key={i} className={i === 3 ? 'hl' : ''} style={{ animation: `mk-up .4s ${i * 0.1}s ease both` }}><b>0{i + 1}</b><span>{x}</span></div>)}</div></div>}
  </>} />;
}

// ============================================================
//  5 · Tekshiruv 1 — annotatsiya «exit code 1» (run 11)
// ============================================================
function Screen5(p) {
  return MC(p, 5, {
    above: <RunView k="c1-11" only={/^Run np/} hlStep="Run npm test" />,
    after: <RunView k="c1-11" ann={null} only={/npm test/} open="Run npm test" lines={L4_TEST} />,
  });
}

// ============================================================
//  6 · Cache: saqlandi → tiklandi → main'da yo'q (run 10, 11, 18)
// ============================================================
const KEY6 = ((KOD.RUNS['c1-10'].log['Post Run actions/setup-node@v4'] || []).find((l) => /Cache saved with the key/.test(l)) || '').replace(/.*key: /, '');
const S6 = mkS(6, [{ hl: 0 }, { hl: 1 }, { hl: 2 }, { v: 'key' }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <>
    <CacheChain hl={seg.v === 'key' ? null : seg.hl} />
    {seg.v === 'key' && <div className="mk-light" style={{ padding: 12, marginTop: 10 }}><div className="mk-tag">{t("Cache kaliti", "Ключ cache")}</div>
      <div style={{ display: 'grid', gap: 6 }}>
        {[['node-cache', t('setup-node yaratgan cache', "cache, созданный setup-node")], ['Linux-x64', t('runner mashinasi', "машина runner")], ['npm', t('paket menejeri', "менеджер пакетов")], [KEY6.replace(/^node-cache-Linux-x64-npm-/, '').slice(0, 12) + '…', t('package-lock.json ning hash\'i — lock o\'zgarsa kalit o\'zgaradi', "хеш package-lock.json — если lock меняется, меняется и ключ")]].map(([a, b], i) => <div key={a} className="c1-code" style={{ animation: `mk-up .35s ${i * 0.08}s ease both` }}><span className="n" style={{ fontSize: 12, color: T.accent }}>{i + 1}</span><span className="t"><code>{a}</code> — {b}</span></div>)}
      </div>
      <div className="mk-rule" style={{ marginTop: 8 }}>Cache — <b>{t("tezlik", "скорость")}</b>{t(", to'g'rilik emas: «not found» xato emas, «hit» — lock o'zgarmagan.", ", а не правильность: «not found» — не ошибка, «hit» — lock не менялся.")}</div>
    </div>}
  </>} />;
}

// ============================================================
//  7 · Amaliyot 1 — o'z run'ingizni o'qish
// ============================================================
const P7 = mkPractice(7, [[], [0, 1], [2, 3], []]);
function ScreenP7(p) { return <Practice p={p} S={P7.S} steps={P7.steps} trouble={P7.trouble} proof={P7.proof} tree={FILES()} />; }
