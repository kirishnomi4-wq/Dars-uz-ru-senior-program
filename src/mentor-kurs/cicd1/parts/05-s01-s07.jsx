
// ============================================================
//  1 · Kirish — dars oxiridagi natija: main'dagi yashil run (cicd1-done, run 18)
// ============================================================
const PLAN1 = ['Umumiy tushuncha', "Lenta qo'lda", 'GitHub Actions', "To'rt tuzoq", 'Mashina farqi va AI', 'CD va sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [], res: true }, { hl: [0, 1, 2, 3] }, { hl: [4, 5] }, { hl: [5] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    {seg.res && <><div className="mk-tag" style={{ margin: 0 }}>{t("Dars oxirida — OrderBotNest main'ida har push'da shu run", "В конце урока — в main OrderBotNest при каждом push такой run")}</div><RunView k="18" only={/^Run /} /></>}
  </div>} />;
}

// ============================================================
//  2 · CI/CD nima qiladi: «menda ishlaydi» → «toza mashinada ishlaydi» (umumiy tushuncha — F-1104 foydalanuvchi talabi)
// ============================================================
const S2 = mkS(2, [{ v: 'now' }, { v: 'ci' }, { v: 'cicd' }, { v: 'today' }]);
// F-1109-06: gapli kartalar o'rniga push → CI → CD → server oqimi; boshidan ko'rinadi, gapirilayotgan qism yonadi, xulosada hammasi to'liq
const lit2 = (beat, at) => (beat >= at ? '' : ' dim');
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ beat }) => <div className="z">
    <div className="z-card">
      <p className="z-h">{t("git push dan serverga — CI va CD", "От git push до сервера — CI и CD")}</p>
      <div className="z-flow">
        <div className={'z-st' + lit2(beat, 1)}><b>git push</b><span className="z-mut">{t("siz", "вы")}</span></div>
        <div className={'z-ar' + lit2(beat, 1)}>→</div>
        <div className={'z-st blue' + lit2(beat, 1) + (beat === 1 ? ' hl' : '')} style={{ flex: '4.2 1 0' }}>
          <b>{t("CI · GitHub'dagi toza mashina", "CI · чистая машина на GitHub")}</b>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}><span className="z-tag g">npm ci 0</span><span className="z-tag g">tsc 0</span><span className="z-tag g">test 0</span><span className="z-tag g">build 0</span></div>
          <span className="z-mut">{t("hammaga bir xil javob: yashil yoki qizil", "для всех один ответ: зелёный или красный")}</span>
        </div>
        <div className={'z-ar' + lit2(beat, 2)}>→</div>
        <div className={'z-st ac' + lit2(beat, 2) + (beat === 2 ? ' hl' : '')} style={{ flex: '2.6 1 0' }}><b>{t("CD · yukni chiqarish", "CD · выпуск груза")}</b><span className="zm">node dist/main</span><span className="z-tag r">{t("DATABASE_URL topilmadi", "DATABASE_URL не найден")}</span></div>
        <div className={'z-ar' + lit2(beat, 3)}>→</div>
        <div className={'z-st off' + lit2(beat, 3)} style={{ flex: '1.6 1 0' }}><b>server</b><span className="z-mut">{t("Secrets · keyingi dars", "Secrets · следующий урок")}</span></div>
      </div>
      <div className={'z-band' + lit2(beat, 3)} style={{ gridTemplateColumns: '1fr 4.2fr 2.6fr 1.6fr' }}><div></div><div style={{ background: '#DBEAFE', color: '#1D4ED8' }}>{t("bugun — to'liq", "сегодня — полностью")}</div><div style={{ background: '#FFEDD5', color: '#C2410C' }}>{t("bugun — chegaragacha", "сегодня — до границы")}</div><div style={{ background: '#F3F4F6', color: '#6B7280' }}>{t("keyingi dars", "следующий урок")}</div></div>
    </div>
    <div className="z-two">
      <div className={'z-card' + (beat === 0 ? ' hl' : '')}>
        <p className="z-h">{t("Hozir — «menda ishlaydi»", "Сейчас — «у меня работает»")}</p>
        <div className="z-flow">
          <div className="z-st ok"><b>{t("siz", "вы")}</b><span className="zm">npm test</span><span className="z-tag g">{t("yashil", "зелёный")}</span></div>
          <div className="z-ar">→</div>
          <div className="z-st bad"><b>{t("hamkor", "коллега")}</b><span className="zm">npm test</span><span className="z-tag r">{t("qizil", "красный")}</span></div>
        </div>
        <span className="z-mut">{t("kod bir xil, mashina boshqa: node_modules, Node, .env", "код тот же, машина другая: node_modules, Node, .env")}</span>
      </div>
      <div className={'z-card' + lit2(beat, 2)}>
        <p className="z-h">{t("CD — ikki xil", "CD — два вида")}</p>
        <div style={{ display: 'grid', gap: 6, fontSize: 14 }}><div><b>Delivery</b>{t(" — paket tayyor, odam tugmani bosadi", " — пакет готов, человек нажимает кнопку")}</div><div><b>Deployment</b>{t(" — lenta o'zi chiqaradi", " — конвейер выпускает сам")}</div><span className="z-mut">{t("ikkalasi ham CI'dan keyin: qizil yuk chiqmaydi", "оба после CI: красный груз не выходит")}</span></div>
      </div>
    </div>
  </div>} />;
}

// ============================================================
//  3 · Lenta: to'rt qadam, chiqish kodi, qizilda to'xtaydi
// ============================================================
const CODES3 = [['0', T.green, 'yashil — buyruq tugadi, xato yo\'q', 'npm ci · tsc · npm test · npm run build (01)'], ['1', T.accent, 'qizil — Jest: test yiqildi', 'npm test → FAIL … [chiqish kodi: 1] (02)'], ['2', T.accent, 'qizil — tsc: tur xatosi', 'npx tsc --noEmit → error TS2322 (06)'], ['127', T.accent, 'qizil — buyruq topilmadi', 'sh: 1: jest: not found (04)']];
const S3 = mkS(3, [{ v: 'lenta' }, { v: 'lenta', q: true }, { v: 'codes' }, { v: 'stop' }]);
// F-1109-06: lenta jadvali — to'rt vaziyat × to'rt qadam, har katakda haqiqiy chiqish kodi; xulosada jadval qoladi
const ROWS3 = [
  ["hammasi to'g'ri", 'Всё верно', [['0', '5.7 s'], ['0', '2.6 s'], ['0', '2.2 s'], ['0', '3.5 s']], true],
  ['test yiqildi', 'тест упал', [['0'], ['0'], ['1', 'FAIL'], ['-', 'yurmadi', 'не запускался']], false],
  ['tur xatosi', 'ошибка типа', [['0'], ['2', 'TS2322'], ['-', 'yurmaydi', 'не запускается'], ['-', 'yurmaydi', 'не запускается']], false],
  ["npm ci tushib qoldi", 'npm ci пропущен', [['-', "yo'q", 'нет'], ['-', '—', '—'], ['127', 'jest: not found'], ['-', 'yurmaydi', 'не запускается']], false],
];
function Cell3({ c }) {
  if (c[0] === '-') return <td className="sk">{t(c[1], c[2])}</td>;
  return <td className={c[0] === '0' ? 'c0' : 'cx'}>{c[0]}{c[1] && <small>{c[1]}</small>}</td>;
}
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ beat }) => <div className="z c1-l3">
    <div className="z-card">
      <p className="z-h">{t("Lenta — to'rt buyruq, har biri chiqish kodi qaytaradi (lokal yurgizish, toza papka)", "Конвейер — четыре команды, каждая возвращает код выхода (локальный запуск, чистая папка)")}</p>
      <table className="z-tbl">
        <tbody>
          <tr><th className="l">{t("vaziyat", "ситуация")}</th>{LENTA.map(([k, cmd, q]) => <th key={k}>{cmd}<small className={beat >= 1 ? '' : 'dim'} style={{ fontFamily: 'system-ui,sans-serif' }}>{q}</small></th>)}<th>{t("lenta", "конвейер")}</th></tr>
          {ROWS3.map(([uz, ruN, cells, ok], r) => <tr key={r} className={beat >= (r === 0 ? 0 : 2) ? '' : 'dim'}>
            <td className="l">{t(uz, ruN)}</td>{cells.map((c, i) => <Cell3 key={i} c={c} />)}
            <td><span className={'r ' + (ok ? 'g' : 'x')}>{ok ? t('yashil', 'зелёный') : t('qizil', 'красный')}</span></td>
          </tr>)}
        </tbody>
      </table>
    </div>
    <div className="z-two">
      <div className={'z-card' + (beat >= 2 ? '' : ' dim')}>
        <p className="z-h">{t("Lenta sonni o'qimaydi — faqat nolmi?", "Конвейер не читает число — только ноль ли?")}</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}><span className="z-tag g">{t("0 → keyingi qadam", "0 → следующий шаг")}</span><span className="z-tag r">{t("1 · 2 · 127 → to'xtaydi", "1 · 2 · 127 → остановка")}</span></div>
      </div>
      <div className={'z-rule' + (beat >= 3 ? '' : ' dim')} style={{ alignSelf: 'stretch' }}>{t("Test qizil bo'lsa, ", "Если тест красный, ")}<b>{t("build boshlanmaydi", "build не начинается")}</b>{t(" — buzuq kod yig'ilmaydi.", " — сломанный код не собирается.")}</div>
    </div>
  </div>} />;
}

// ============================================================
//  4 · Toza clone: OrderBotNest'ni qo'lda lentadan o'tkazamiz (cicd1v2-out/01, 07)
// ============================================================
const T4A = outRange('01', /^# Toza/, /^tsconfig/);
const T4B = outRange('01', /^\$ npm ci/, /chiqish kodi: 0 · 2\.6/, (l) => !/^npm warn/.test(l));
const T4C = outRange('01', /^\$ npm test/, null, (l) => !/^(Snapshots|Ran all|Time:|> jest|> order-bot|api|config|core|infrastructure|main\.d\.ts|main\.js\.map|tsconfig\.tsbuildinfo)$|^> order-bot/.test(l));
const DUR4 = { ci: '5.7 s', tsc: '2.6 s', test: '2.2 s', build: '3.5 s' };
const S4 = mkS(4, [{ v: 'ls' }, { v: 'ci' }, { v: 'test' }, { v: 'lenta' }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <>
    {seg.v === 'ls' && <Term title={t("VS Code terminali · OrderBotNest (yangi clone, jest2-done)", "терминал VS Code · OrderBotNest (новый clone, jest2-done)")} lines={T4A} />}
    {seg.v === 'ci' && <Term title={t("VS Code terminali · OrderBotNest", "терминал VS Code · OrderBotNest")} lines={T4B} />}
    {seg.v === 'test' && <Term title={t("VS Code terminali · OrderBotNest", "терминал VS Code · OrderBotNest")} lines={T4C} />}
    {seg.v === 'lenta' && <div style={{ display: 'grid', gap: 10 }}>
      <Lenta4 st={{ ci: 'ok', tsc: 'ok', test: 'ok', build: 'ok' }} dur={DUR4} />
      <div className="mk-rule">{t("To'rt buyruq · jami ", "Четыре команды · всего ")}<b>{t("≈ 15 soniya", "≈ 15 секунд")}</b>{t(" · to'rtala chiqish kodi ", " · все четыре кода выхода ")}<b>0</b>{t(" — lenta yashil. GitHub'dagi mashina har push'da aynan shuni qiladi.", " — конвейер зелёный. Машина на GitHub при каждом push делает ровно это.")}</div>
    </div>}
  </>} />;
}

// ============================================================
//  5 · Tekshiruv 1 — jest: not found (cicd1v2-out/04, 01)
// ============================================================
function Screen5(p) {
  return MC(p, 5, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <Term title={t("VS Code terminali · toza clone, npm ci yurmagan", "терминал VS Code · чистый clone, npm ci не запускался")} lines={out('04')} er />
      <div className="mk-pair"><code>ls</code> → 7 ta: <code>package.json</code> · <code>package-lock.json</code> · <code>src</code> … — <b>{t("node_modules yo'q", "нет node_modules")}</b></div>
    </div>,
    after: <Term title={t("VS Code terminali · npm ci", "терминал VS Code · npm ci")} lines={outRange('01', /^\$ npm ci/, /chiqish kodi: 0 · 5\.7/, (l) => !/^npm warn/.test(l))} />,
  });
}

// ============================================================
//  6 · Test qizil — zanjir shu yerda to'xtaydi (order.service.ts 36 · cicd1v2-out/02)
// ============================================================
const EDIT36 = { 36: '        if (p.stock <= c.qty) {' };
const T6A = outRange('02', /^\$ npm ci/, /^tsc ✓/);
const T6B = outPick('02', (l) => /^\$|✓|^FAIL|●|Kolonka|36 \||> 37|^Tests:|chiqish kodi/.test(l));
const S6 = mkS(6, [{ v: 'code' }, { v: 'chain' }, { v: 'run' }, { v: 'lenta' }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <>
    {seg.v === 'code' && <Code k="ORDER_36" files={FILES()} active={F.ord} ids={{ 36: 'x' }} edit={EDIT36} focus={['x']} />}
    {seg.v === 'chain' && <><CodePanel file={t("order.service.ts · buzilgan", "order.service.ts · сломан")} lines={kod('ORDER_36', { 36: 'x' }, 35, 38, EDIT36)} focus={['x']} /><Term lines={T6A} /></>}
    {seg.v === 'run' && <Term title={t("VS Code terminali · npm ci && npx tsc --noEmit && npm test && npm run build", "терминал VS Code · npm ci && npx tsc --noEmit && npm test && npm run build")} lines={T6B} er />}
    {seg.v === 'lenta' && <div style={{ display: 'grid', gap: 10 }}>
      <Lenta4 st={{ ci: 'ok', tsc: 'ok', test: 'bad', build: 'skip' }} hl={['test']} />
      <div className="mk-rule"><code>&amp;&amp;</code>{t(" zanjiri birinchi qizilda uziladi — GitHub lentasi ham: yurmagan qadamni ", " цепочка рвётся на первом красном — конвейер GitHub тоже: незапущенный шаг он показывает как ")}<b>skipped</b>{t(" deb ko'rsatadi. Tiklash: ", " . Восстановление: ")}<code>git checkout -- src/api/order/order.service.ts</code></div>
    </div>}
  </>} />;
}

// ============================================================
//  7 · Amaliyot 1 — lentani qo'lda yurgizish
// ============================================================
const P7 = mkPractice(7, [[], [0, 1], [2, 3], []], {
  code: [{ step: 2, file: F.ord, lines: kod('ORDER_36', { 36: 'x' }, 33, 40, EDIT36), copy: false }],
});
function ScreenP7(p) { return <Practice p={p} S={P7.S} steps={P7.steps} trouble={P7.trouble} proof={P7.proof} code={P7.code} tree={FILES()} />; }
