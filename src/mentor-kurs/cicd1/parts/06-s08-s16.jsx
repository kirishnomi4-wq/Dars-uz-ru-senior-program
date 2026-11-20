
// ============================================================
//  8 · ci.yml: uch qism — on, runs-on, steps (cicd1-done, 15 satr)
// ============================================================
const IDS8 = { ...rngIds(1, 2, 'a'), ...rngIds(3, 5, 'b'), ...rngIds(6, 11, 'c'), ...rngIds(12, 15, 'd') };
const MAP8 = [['- run: npm ci', "1-qadam · paketlar o'rnatildimi?"], ['- run: npx tsc --noEmit', "2-qadam · turlar to'g'rimi?"], ['- run: npm test', '3-qadam · testlar yashilmi?'], ['- run: npm run build', "4-qadam · dist yig'ildimi?"]];
const S8 = mkS(8, [{ f: ['a'] }, { f: ['b'] }, { f: ['c'] }, { f: ['d'], map: true }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <>
    {!seg.map && <Ide files={compact(FILES(F.ci), F.ci)} active={F.ci} fresh={F.ci}><CodePanel file="ci.yml" lines={kod('CI_DONE', IDS8)} focus={seg.f} /></Ide>}
    {seg.map && <div className="pg-two">
      <CodePanel file="ci.yml · 12–15" lines={kod('CI_DONE', IDS8, 12, 15)} focus={seg.f} />
      <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">{t("run: satrlari ↔ 4-ekrandagi to'rt buyruq", "строки run: ↔ четыре команды с экрана 4")}</div>
        {MAP8.map(([a, b], i) => <div key={a} className="c1-code" style={{ marginBottom: 6, animation: `mk-up .35s ${i * 0.08}s ease both` }}><span className="n" style={{ color: T.accent, fontSize: 18 }}>{i + 1}</span><span className="t"><code>{a}</code><br />{b}</span></div>)}
      </div>
    </div>}
  </>} />;
}

// ============================================================
//  9 · Push → Actions: yashil run, qadamlar va vaqt (run 10 — haqiqiy)
// ============================================================
const PUSH9 = jt('$ git add .github\n$ git commit -m "ci: lenta"\n$ git push');
const L9 = runLog('10', 'Run npm test', (l) => /^\$|^PASS|^Tests:|^Test Suites/.test(l));
const D10 = Object.fromEntries(visibleSteps('10').map((s) => [s[0], s[2]]));
const DUR9 = { ci: D10['Run npm ci'], tsc: D10['Run npx tsc --noEmit'], test: D10['Run npm test'], build: D10['Run npm run build'] };
const S9 = mkS(9, [{ v: 'push' }, { v: 'run', hl: ['Run actions/checkout@v4', 'Run actions/setup-node@v4', 'Run npm ci', 'Run npx tsc --noEmit', 'Run npm test', 'Run npm run build'] }, { v: 'log' }, { v: 'sum' }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <>
    {seg.v === 'push' && <div style={{ display: 'grid', gap: 10 }}><Term title={t("VS Code terminali · OrderBotNest", "терминал VS Code · OrderBotNest")} lines={PUSH9} /><RunRows keys={['10']} hl={['10']} /></div>}
    {seg.v === 'run' && <RunView k="10" hlStep={seg.hl} />}
    {seg.v === 'log' && <RunView k="10" open="Run npm test" lines={L9} hlStep="Run npm test" />}
    {seg.v === 'sum' && <div style={{ display: 'grid', gap: 10 }}><Lenta4 st={{ ci: 'ok', tsc: 'ok', test: 'ok', build: 'ok' }} dur={DUR9} /><div className="mk-rule">{t("push → toza mashina → ", "push → чистая машина → ")}<code>checkout</code> → <code>setup-node</code>{t(" → sizning to'rt buyrug'ingiz → ", " → ваши четыре команды → ")}<b>{t("yashil", "зелёный")}</b>{t(". Run jami ", ". Всего run ")}{KOD.RUNS['10'].dur}{t(" (GitHub'dagi haqiqiy run #", " (настоящий run на GitHub #")}{KOD.RUNS['10'].n}).</div></div>}
  </>} />;
}

// ============================================================
//  10 · Buzamiz: test qizil — lentada qaysi qadam, qaysi yurmadi (run 11 — haqiqiy)
// ============================================================
const PUSH10 = jt('$ git commit -am "sinov: chegara buzildi (< → <=)"\n$ git push');
const L10 = runLog('11', 'Run npm test', (l) => /^\$|^FAIL|●|Kolonka|> 37|^Tests:|##\[error\]/.test(l));
const CAUSE10 = ["npm test chiqish kodi 1 berdi (chegara testi qizil)", "Lenta shu qadamda to'xtadi — npm run build «skipped»", "Buzuq kod yig'ilmadi, hech qayerga chiqmadi", 'Satrni tiklab push qilsangiz — run yana yashil'];
// F-1120-02 (M52): 1-segment (x) — mentor 36-satrdagi «<» ni yana o'zi bosadi → «<=», keyin push (run 11 — haqiqiy)
const RunMini = ({ broken, known, pins }) => <N1Mini><FlowMini tag={t("push → GitHub'dagi toza mashina", 'push → чистая машина GitHub')}
  boxes={[['npm ci · tsc', '✓ ✓', 'ok'], ['npm test', !broken ? '✓' : known ? '✕' : '?', broken && known ? 'bad' : ''], ['npm run build', !broken ? '✓' : known ? 'skipped' : '?', '']]}
  res={broken ? [known ? 'Process completed with exit code 1.' : '?', 'bad'] : null} pins={pins} /></N1Mini>;
const S10 = mkS(10, [{ v: 'act' }, { v: 'push' }, { v: 'steps', hl: ['Run npm test', 'Run npm run build'] }, { v: 'log' }, { v: 'cause' }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={(b) => <Scene10 b={b} />} />;
}
// Qadamlar: 0 bosing · 1 push (natija «?») · 2 qadamlar, bo'laklar 1·2 · 3 log · 4 sabab
function Scene10({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const v = beat === 0 ? (act.hit ? 'push' : 'act') : seg.v;
  const mini = <RunMini broken={v !== 'act'} known={beat >= 2} pins={beat === 2 ? { 1: 1, 2: 2 } : {}} />;
  return <>
    {v === 'act' && <Ide files={compact(FILES(), F.ord)} active={F.ord}><div onClick={act.onClick}><CodePanel file="order.service.ts" lines={ACT36()} focus={['x']} /></div>{mini}</Ide>}
    {v === 'push' && <div style={{ display: 'grid', gap: 10 }}><CodePanel file={t("order.service.ts · buzilgan", "order.service.ts · сломан")} lines={kod('ORDER_36', { 36: 'x' }, 35, 38, EDIT36)} focus={['x']} /><Term lines={PUSH10} />{mini}<RunRows keys={['10', '11']} hl={['11']} /></div>}
    {v === 'steps' && <><RunView k="11" hlStep={seg.hl} />{mini}</>}
    {v === 'log' && <RunView k="11" open="Run npm test" lines={L10} hlStep="Run npm test" ann={null} />}
    {v === 'cause' && <div style={{ display: 'grid', gap: 10 }}><Lenta4 st={{ ci: 'ok', tsc: 'ok', test: 'bad', build: 'skip' }} hl={['test']} /><Cause items={CAUSE10} on={4} bad={1} /></div>}
  </>;
}

// ============================================================
//  11 · Tekshiruv 2 — qizil qadamdan keyin (cicd1v2-out/06 · run 15)
// ============================================================
const T11 = outRange('06', /^\$ npx tsc/, /chiqish kodi: 2/, (l) => /^\$|error TS|chiqish kodi/.test(l));
function Screen11(p) {
  return MC(p, 11, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="ci.yml · 12–15" lines={kod('CI_DONE', { 13: 't' }, 12, 15)} focus={['t']} />
      <Term title={t("VS Code terminali · npx tsc --noEmit", "терминал VS Code · npx tsc --noEmit")} lines={T11} er />
    </div>,
    after: <RunView k="15" only={/^Run np/} ann={null} hlStep={['Run npx tsc --noEmit', 'Run npm test', 'Run npm run build']} />,
  });
}

// ============================================================
//  12 · Amaliyot 2 — ci.yml o'z reposingizda, yashil run
// ============================================================
const P12 = mkPractice(12, [[], [0, 1], [2, 3], []], {
  code: [{ step: 1, file: F.ci, lines: kod('CI_DONE') }, { step: 2, file: F.ord, lines: kod('ORDER_36', { 36: 'x' }, 33, 40, EDIT36), copy: false }],
});
function ScreenP12(p) { return <Practice p={p} S={P12.S} steps={P12.steps} trouble={P12.trouble} proof={P12.proof} code={P12.code} tree={FILES(F.ci)} />; }

// ============================================================
//  13 · Checkout yo'q — mashinada repo yo'q (2-checkout-yoq.yml · run 12 — haqiqiy)
// ============================================================
const YML13 = kod('CI_DONE', { 7: 'x' }, 1, 15, { 7: false });
const L13 = runLog('12', 'Run npm ci', (l) => /^\$|EUSAGE|can only install|npm-shrinkwrap|later to generate/.test(l));
const MACH13 = {
  l: { h: 'Sizning mashinangiz', st: 'ok', rows: [['papka', "OrderBotNest/ — to'la"], ['package-lock.json', 'bor'], ['npm ci', '✓']] },
  r: { h: "Runner · checkout yo'q", st: 'bad', rows: [['papka', '/home/runner/work/OrderBotNest/OrderBotNest — bo\'sh'], ['package-lock.json', "yo'q"], ['npm ci', '✗ «can only install with an existing package-lock.json»']], note: "Kodni mashinaga actions/checkout olib keladi. U yo'q — papka bo'sh, xabar esa «lock yarating» deydi." },
};
const S13 = mkS(13, [{ v: 'yml' }, { v: 'run' }, { v: 'mach' }, { v: 'sum' }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {seg.v === 'yml' && <Ide files={compact(FILES(F.ci), F.ci)} active={F.ci}><CodePanel file={t("ci.yml · checkout satri olib tashlandi", "ci.yml · строка checkout убрана")} lines={YML13} focus={['x']} /></Ide>}
    {seg.v === 'run' && <RunView k="12" open="Run npm ci" lines={L13} hlStep="Run npm ci" />}
    {seg.v === 'mach' && <Machines left={MACH13.l} right={MACH13.r} hl="r" />}
    {seg.v === 'sum' && <div style={{ display: 'grid', gap: 10 }}>
      <CodePanel file="ci.yml · 6–8" lines={kod('CI_DONE', { 7: 'c' }, 6, 8)} focus={['c']} />
      <div className="n2-warn">{t("Har workflow'da ", "В каждом workflow ")}<b>{t("birinchi qadam — ", "первый шаг — ")}<code>actions/checkout</code></b>{t(". Logda «lock yo'q» yoki «package.json yo'q» ko'rsangiz — repongizni emas, ", ". Если в логе видите «нет lock» или «нет package.json» — ищите не в репозитории, а эту строку в ")}<code>ci.yml</code>{t("dagi shu satrni qidiring.", ".")}</div>
    </div>}
  </>} />;
}

// ============================================================
//  14 · npm ci va lock: «in sync» xatosi (package.json · cicd1v2-out/03c · run 13 — haqiqiy)
// ============================================================
const PK_N = KOD.PKG_TELEGRAF.lines.find((l) => l.t.includes('"telegraf"')).n;
const EDIT_PKG = { [PK_N]: '    "telegraf": "4.16.0",' };
const T14 = outPick('03c', (l) => /^\$|EUSAGE|Invalid:|chiqish kodi/.test(l)); // uzun «in sync» satri — RunView logida (o'raladi)
const L14 = runLog('13', 'Run npm ci', (l) => /^\$|EUSAGE|in sync|Invalid:/.test(l));
const CAUSE14 = ['package.json: telegraf 4.16.0 (qo\'lda), package-lock.json: 4.16.3 (eski)', "npm ci lock fayldan AYNAN o'rnatadi — bir baytini ham o'zgartirmaydi", "Mos kelmasa — taxmin qilmaydi, qizil beradi: «in sync» emas", "Lokalda npm install → lock yangilanadi → lock ham commit'ga"];
// F-1109-06: sabab va xulosa — gapli kartalar o'rniga ikki yo'l oqimi (biz qilgan · to'g'ri), haqiqiy EUSAGE xabari bilan (cicd1v2-out/03c)
function Flow14({ two }) {
  return <div className="z">
    <div className={'z-card' + (two ? '' : ' hl')}>
      <p className="z-h">{t("Biz qildik — package.json qo'lda, npm install yo'q", "Мы сделали — package.json вручную, без npm install")}</p>
      <div className="z-flow">
        <div className="z-st ac"><b>package.json</b><span className="zm">"telegraf": "4.16.0"</span><span className="z-mut">{t("qo'lda o'zgardi", "изменён вручную")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st off"><b>npm install</b><span className="z-mut">{t("yurgizilmadi", "не запускали")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ac"><b>package-lock.json</b><span className="zm">telegraf@4.16.3</span><span className="z-mut">{t("eskicha qoldi", "остался старым")}</span></div>
        <div className="z-ar bad">→</div>
        <div className="z-st bad"><b>npm ci</b><span className="z-tag r">{t("chiqish kodi 1", "код выхода 1")}</span><span className="z-mut">{t("lokalda ham, lentada ham (run 13)", "и локально, и в конвейере (run 13)")}</span></div>
      </div>
      <div className="z-term"><span className="r">npm error code EUSAGE</span>{'\n'}npm error `npm ci` can only install packages when your package.json and package-lock.json … are <span className="hl">in sync</span>.{'\n'}<span className="r">npm error Invalid: lock file's telegraf@4.16.3 does not satisfy telegraf@4.16.0</span></div>
    </div>
    <div className={'z-card' + (two ? ' hl' : ' dim')}>
      <p className="z-h">{t("To'g'ri yo'l — versiya o'zgarsa", "Правильный путь — если версия меняется")}</p>
      <div className="z-flow">
        <div className="z-st"><b>package.json</b><span className="z-mut">{t("versiya o'zgardi", "версия изменилась")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>npm install</b><span className="z-mut">{t("lokalda", "локально")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>package-lock.json</b><span className="z-mut">{t("yangilandi", "обновлён")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>commit</b><span className="z-mut">{t("ikkala fayl", "оба файла")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>npm ci</b><span className="z-tag g">{t("lentada 0", "в конвейере 0")}</span></div>
      </div>
      <span className="z-mut">{t("npm ci lock fayldan aynan o'rnatadi; mos kelmasa — taxmin qilmaydi, to'xtaydi.", "npm ci ставит строго по lock-файлу; если не совпадает — не угадывает, останавливается.")}</span>
    </div>
  </div>;
}
const S14 = mkS(14, [{ v: 'code' }, { v: 'run' }, { v: 'cause' }, { v: 'two' }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <>
    {seg.v === 'code' && <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="package.json" lines={kod('PKG_TELEGRAF', { [PK_N]: 'x' }, null, null, EDIT_PKG)} focus={['x']} />
      <CodePanel file="package-lock.json" lines={kod('LOCK_TELEGRAF', { [KOD.LOCK_TELEGRAF.lines[1].n]: 'l' })} focus={['l']} />
    </div>}
    {seg.v === 'run' && <div style={{ display: 'grid', gap: 8 }} className="c1-small"><Term title={t("VS Code terminali · npm ci (lokalda ham)", "терминал VS Code · npm ci (и локально)")} lines={T14} er /><RunView k="13" open="Run npm ci" lines={L14} hlStep="Run npm ci" ann={null} only={/^Run np/} /></div>}
    {(seg.v === 'cause' || seg.v === 'two') && <Flow14 two={seg.v === 'two'} />}
  </>} />;
}

// ============================================================
//  15 · tsc qadami: test yashil, lenta yolg'on yashil (user.service.ts 16 · cicd1v2-out/06 · run 14, 15 — haqiqiy)
// ============================================================
const U16 = KOD.USER_20.lines.find((l) => l.n === 16).t;
const EDIT16 = { 16: U16.replace('String(from.id)', 'from.id') };
const T15 = outRange('06', /^\$ npx tsc/, null, (l) => /^\$|error TS|^Tests:|chiqish kodi/.test(l));
const S15 = mkS(15, [{ v: 'code' }, { v: 'r14' }, { v: 'both' }, { v: 'sum' }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <>
    {seg.v === 'code' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file={t("user.service.ts · buzilgan", "user.service.ts · сломан")} lines={kod('USER_20', { 16: 'x' }, 15, 22, EDIT16)} focus={['x']} /><Term title={t("VS Code terminali · npx tsc --noEmit · npm test", "терминал VS Code · npx tsc --noEmit · npm test")} lines={T15} er /></div>}
    {seg.v === 'r14' && <RunView k="14" note={[t("Yolg'on yashil", "Ложный зелёный"), t("ci.yml'da tsc qadami yo'q — tur xatosi hech kim so'ramagani uchun tekshirilmadi; nest build bu kodni yig'a olmaydi", "в ci.yml нет шага tsc — ошибку типа не проверили, потому что никто не спросил; nest build этот код не соберёт")]} />}
    {seg.v === 'both' && <div className="pg-two c1-small"><RunView k="14" /><RunView k="15" hlStep="Run npx tsc --noEmit" /></div>}
    {seg.v === 'sum' && <div style={{ display: 'grid', gap: 10 }}>
      <CodePanel file="ci.yml · 12–15" lines={kod('CI_DONE', { 13: 't' }, 12, 15)} focus={['t']} />
      <div className="n2-warn">{t("Lenta ", "Конвейер ")}<b>{t("faqat so'ralgan narsani", "только то, о чём спросили,")}</b>{t(" tekshiradi. Testlar yashil bo'lsa ham, turlar noto'g'ri bo'lishi mumkin. ", " проверяет. Даже если тесты зелёные, типы могут быть неверными. ")}{t(<><code>npx tsc --noEmit</code> — <code>npm ci</code>dan keyin, <code>npm test</code>dan oldin: 3 soniya, build'gacha bormay to'xtatadi.</>, <><code>npx tsc --noEmit</code> — после <code>npm ci</code>, до <code>npm test</code>: 3 секунды, останавливает, не доходя до build.</>)}</div>
    </div>}
  </>} />;
}

// ============================================================
//  16 · Tekshiruv 3 — LineCheck: YAML surilish (4-surilish-xato.yml 8-satr → indeks 7; run 17 · 08 tahlilchi)
// ============================================================
const Y4 = KOD.YML_4_SURILISH_XATO.lines;
const LC16 = Y4.map((l) => ({ h: yamlLine(l.t), n: l.n }));
const LC16_FIXED = Y4.flatMap((l) => l.n >= 8 ? [{ h: yamlLine(l.t), n: l.n, gone: true }, { h: yamlLine(l.t.slice(2)), n: l.n, neu: true }] : [{ h: yamlLine(l.t), n: l.n }]);
const T16X = [...outRange('08', /^--- 3-runs-on-yoq/, /Required property/, (l) => /^---|XATO/.test(l)), ...jt('X This run likely failed because of a workflow file issue.')];
function Screen16(p) {
  const m = MDT[16];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="ci.yml" lines={LC16} target={7}
    tree={{ root: MKCFG.root, files: compact(FILES(F.ci), F.ci), active: F.ci }}
    fixed={LC16_FIXED} fixedExtra={[{ file: t("ci.yml · runs-on yo'q — rasmiy tahlilchi (08) va GitHub (run 16)", "ci.yml · нет runs-on — официальный анализатор (08) и GitHub (run 16)"), lines: T16X }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}
