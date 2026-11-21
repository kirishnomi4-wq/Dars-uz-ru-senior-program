
// ============================================================
//  1 · Kirish — dars oxiridagi natija: 10 test, yarim soniyada (jest1v2-out/11)
// ============================================================
const PLAN1 = ['Nega va qayerda', 'Birinchi test', "Yolg'on testlar", 'Statuslar va chegara', 'AI testi', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [5] }], { plan: PLAN1 });
// F-1120-02 (M51): darsning rasmi — «Buyurtma boti» xaritasi + Jest qatori (BotMap, parts/02e-bot.jsx); reja pastda.
// Testda Telegram ham, baza ham yo'q: faqat telegram modulidagi funksiya chaqiriladi (texts.ts, keyboards.ts)
const DB_ALL = { products: 'db', users: 'db', carts: 'db', orders: 'db' };
const UNIT_ON = ['telegram'];
const S1M = [
  { loc: DB_ALL, on: UNIT_ON, tgSub: 'texts · keyboards', jest: { cmd: 'npm test', files: ['texts.spec.ts', 'keyboards.spec.ts'], res: 'pass', txt: '10 passed' } },
  { loc: DB_ALL, on: UNIT_ON, tgSub: 'texts.ts', jest: { cmd: 'npx jest texts', files: ['texts.spec.ts'], res: 'fail', txt: '1 failed' } },
  { loc: DB_ALL, on: UNIT_ON, tgSub: 'texts · keyboards', jest: { cmd: 'AI', files: ['texts.spec.ts', 'keyboards.spec.ts'], res: 'pass', txt: '36 passed' } },
  { loc: DB_ALL, on: UNIT_ON, tgSub: 'texts · keyboards', jest: { cmd: 'npm test', files: ['texts.spec.ts', 'keyboards.spec.ts'], res: 'pass', txt: '10 passed' } },
];
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg, beat }) => { const m = S1M[Math.min(beat, 3)]; return <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 12 }}>
    <BotMap {...m} tag={t("Bugungi darsning rasmi — buyurtma botining qoidasi test bilan qo'riqlanadi", 'Картина урока — правило бота заказов охраняет тест')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>; }} />;
}

// ============================================================
//  2 · Smoke bor — nega yana test? (orderbot-out/10 · jest1v2-out/12)
// ============================================================
const T2_SMOKE = [{ h: jestLine('$ npm run smoke') }, { h: '<span class="cm"># baza shop_smoke · har qadam alohida node jarayonida · restart · 5 mijoz bir vaqtda</span>' }, { h: '<span class="ok">NATIJA: 5/5 ✓</span>' }];
const T2_UNIT = out('12');
const S2 = mkS(2, [{ v: 'smoke' }, { v: 'unit' }, { v: 'code' }, { v: 'sum' }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <>
    {/* F-1120-02 (M51): ikki karta o'rniga darsning rasmi — smoke butun botni, unit-test bitta funksiyani tekshiradi */}
    {seg.v === 'smoke' && <div className="mk-light" style={{ padding: 14 }}><BotMap loc={DB_ALL} clients={5} chat={['[✅ Buyurtma berish]', "Buyurtma #1 qabul qilindi! Jami: 220 000 so'm", 'ok']} jest={{ name: 'Smoke', cmd: 'npm run smoke', files: [t('shop_smoke · restart · 5 mijoz', 'shop_smoke · рестарт · 5 клиентов')], res: 'pass', txt: '5/5' }} tag={t("Smoke — butun bot: telefon, server, baza", 'Smoke — весь бот: телефон, сервер, база')} /></div>}
    {seg.v === 'smoke' && <Term lines={T2_SMOKE} />}
    {(seg.v === 'unit' || seg.v === 'sum') && <div className="mk-light" style={{ padding: 14 }}><BotMap loc={DB_ALL} on={UNIT_ON} tgSub="texts · keyboards" jest={{ cmd: 'npm test', files: ['texts.spec.ts', 'keyboards.spec.ts'], res: 'pass', txt: '10 passed' }} tag={t("Unit-test — bitta funksiya: Telegram ham, baza ham, .env ham kerak emas", 'Unit-тест — одна функция: не нужны ни Telegram, ни база, ни .env')} /></div>}
    {seg.v === 'unit' && <Term lines={T2_UNIT} />}
    {seg.v === 'code' && <Ide files={compact(FILES(F.txs), F.txs)} active={F.txs}>
      <CodePanel file="texts.spec.ts" lines={kod('SPEC04', { 1: 'i' }, 1, 2)} focus={['i']} />
      <CodePanel file="texts.ts" lines={kod('TX_SOM', { 4: 's' }, 3, 4)} focus={['s']} style={{ marginTop: 10 }} />
      <div className="n2-warn" style={{ marginTop: 10 }}>{t("Testda ", "В тесте ")}<b>{t("Telegraf ham, baza ham", "Ни Telegraf, ни база")}</b>{t(" import qilinmaydi — faqat ", " не импортируются — только ")}<code>som</code>{t(" funksiyasi. ", " функция. ")}<code>.env</code>{t(" yo'q, 10 test 0,5 soniyada.", " нет, 10 тестов за 0,5 секунды.")}</div>
    </Ide>}
    {seg.v === 'sum' && <div className="mk-rule">Smoke — <b>{t("«ishlayaptimi»", "«работает ли»")}</b>; unit-test — <b>{t("«shu qoida buzilmadimi»", "«не нарушено ли это правило»")}</b>{t(". Saytning so'rov va javobi — Jest ikkinchi darsida.", ". Запрос и ответ сайта — на втором уроке по Jest.")}</div>}
  </>} />;
}

// ============================================================
//  3 · Jest testni qayerdan topadi (package.json jest bo'limi · jest1v2-out/01)
// ============================================================
const T3 = out('01', outFind('01', /^\$ npm test/));
const S3 = mkS(3, [{ v: 'pkg', f: ['t'] }, { v: 'pkg', f: ['r'] }, { v: 'run' }, { v: 'run', f: ['nf'] }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <>
    {seg.v === 'pkg' && <Ide files={compact(FILES(), F.pkg)} active={F.pkg}>
      <CodePanel file="package.json" lines={[...kod('PKG_TEST', { 14: 't' }), { h: '<span class="cm">…</span>', n: '' }, ...kod('PKG', { 45: 'j', 51: 'r', 52: 'r', 53: 'x', 54: 'x', 55: 'x' }, 45, 57)]} focus={seg.f} />
    </Ide>}
    {seg.v === 'run' && <CodePanel file="package.json" lines={kod('PKG', {}, 51, 52)} />}
    {seg.v === 'run' && <Term title={t("VS Code terminali · OrderBotNest", "терминал VS Code · OrderBotNest")} lines={T3} er focus={seg.f || []} />}
  </>} />;
}

// ============================================================
//  4 · Tekshiruv 1 — test/ papkasidagi fayl (jest1v2-out/14)
// ============================================================
const T4_PKG = kod('PKG', {}, 51, 52);
const T4_AFTER = out('14', outFind('14', /^No tests found/));
function Screen4(p) {
  return MC(p, 4, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <Ide files={tree(['node_modules/', 'src/', 'test/texts.spec.ts', '.env.example', F.pkg, 'README.md'])} active="test/texts.spec.ts">
        <CodePanel file="package.json" lines={T4_PKG} />
      </Ide>
    </div>,
    after: <Term title={t("VS Code terminali · OrderBotNest", "терминал VS Code · OrderBotNest")} lines={T4_AFTER} er />,
  });
}

// ============================================================
//  5 · Birinchi test: describe · it · expect (texts.ts 1–4 · kod-02-texts.spec.ts)
// ============================================================
const S5 = mkS(5, [{ v: 'src' }, { v: 'spec', f: ['i'] }, { v: 'spec', f: ['d', 't', 'e'] }, { v: 'spec', f: [] }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <>
    {seg.v === 'src' && <Code k="TX_SOM" ids={{ 3: 's', 4: 's' }} focus={['s']} files={FILES()} active={F.tx} />}
    {seg.v === 'spec' && <Code k="SPEC02" ids={{ 1: 'i', 3: 'd', 4: 't', 5: 'e' }} focus={seg.f} files={FILES(F.txs)} active={F.txs} fresh={F.txs} />}
    {seg.v === 'spec' && seg.f.length === 3 && <div className="pg-three">
      <Card c={T.blue} h="describe"><p>{t("qaysi funksiya — ", "какая функция — ")}<code>som</code></p></Card>
      <Card c={T.purple} h="it"><p>{t("bitta vaziyat — oddiy gap bilan", "одна ситуация — обычным предложением")}</p></Card>
      <Card c={JC.jest} h="expect … toBe"><p>{t("natija = etalon (qo'lda yoziladi)", "результат = эталон (пишется вручную)")}</p></Card>
    </div>}
  </>} />;
}

// ============================================================
//  6 · Bir xil ikki qator — FAIL (jest1v2-out/02 aynan)
// ============================================================
const L6 = outLines('02');
const i6 = (re) => L6.findIndex((l) => re.test(l)) + 1;
const T6 = out('02', i6(/^FAIL/), undefined, {
  [i6(/● som/)]: { id: 'd' }, [i6(/Expected:/)]: { id: 'e' }, [i6(/Received:/)]: { id: 'e' }, [i6(/^\s*>/)]: { id: 'g' }, [i6(/^\s*\|\s*\^/)]: { id: 'g' }, [i6(/at Object/)]: { id: 'g' },
});
const S6 = mkS(6, [{ f: ['d'] }, { f: ['e'] }, { f: ['g'] }, { f: ['e'] }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <Term title={t("VS Code terminali · npm test -- texts", "терминал VS Code · npm test -- texts")} lines={T6} er focus={seg.f} />} />;
}

// ============================================================
//  7 · Ichida: toBe va bo'linmas probel (jest1v2-out/03, 04)
// ============================================================
const L7 = outLines('03');
const CODES7 = (L7[2] || '').trim().split(/\s+/);
const CH7 = Array.from("120" + String.fromCharCode(160) + "000 so'm");
const T7_EQ = out('02', i6(/expect\(received\)/), i6(/Received:/), { [i6(/expect\(received\)/)]: { id: 'o' } });
const FIX7 = [...kod('SPEC04', {}, 1, 5), { h: tsLine(KOD.SPEC02.lines[4].t), n: 6, gone: true }, ...kod('SPEC04', { 6: 'f' }, 6, 6).map((l) => ({ ...l, neu: true })), ...kod('SPEC04', {}, 7, 8), ...kod('SPEC04', {}, 9, 11).map((l) => ({ ...l, neu: true })), ...kod('SPEC04', {}, 12, 12)];
const T7_PASS = out('04', outFind('04', /^PASS/));
// F-1104-07: katta solishtirish — Expected (siz yozgan) va Received (som qaytargan) belgilari yonma-yon, bittalab
const EXP7 = Array.from("120 000 so'm");
const REC7 = CH7;
const code4 = (c) => c.charCodeAt(0).toString(16).padStart(4, '0');
function Compare7({ mode }) {
  const [n, setN] = useState(mode === 'diff' ? EXP7.length : 0);
  useEffect(() => {
    if (mode === 'diff') { setN(EXP7.length); return undefined; }
    setN(0); let k = 0;
    const id = setInterval(() => { k += 1; setN(k); if (k >= EXP7.length) clearInterval(id); }, 380);
    return () => clearInterval(id);
  }, [mode]);
  const row = (arr, other, who, lab) => <div className="cmp-row"><div className="cmp-lab"><b>{who}</b><small>{lab}</small></div>
    {arr.map((c, i) => { const shown = i < n; const same = code4(c) === code4(other[i]); return <div key={i} className={`cmp-c${shown ? ' on' : ''}${shown ? (same ? ' ok' : ' bad') : ''}${mode === 'diff' && !same ? ' big' : ''}`}><i>{c === ' ' || c.charCodeAt(0) === 160 ? '·' : c}</i><small>{code4(c)}</small></div>; })}</div>;
  return <div className="mk-light cmp" style={{ padding: 16 }}>
    <div className="mk-tag">{t("Jest ikki matnni belgima-belgi solishtiradi", "Jest сравнивает два текста посимвольно")}</div>
    {row(EXP7, REC7, 'Expected', t('siz yozgan', "написали вы"))}
    {row(REC7, EXP7, 'Received', t('som qaytargan', "вернул som"))}
    {n >= 4 && <div className="cmp-note">{mode === 'diff' ? <>{t("Farq faqat ", "Разница только ")}<b>{t("4-belgida", "в 4-м символе")}</b>: <code>0020</code>{t(" — oddiy probel (siz yozgan) · ", " — обычный пробел (написали вы) · ")}<code>00a0</code>{t(" — bo'linmas probel (", " — неразрывный пробел (")}<code>toLocaleString('ru-RU')</code>{t(" qo'ygan). Qolgan 11 belgi bir xil.", " ставит). Остальные 11 символов одинаковы.")}</> : <>{t("4-belgida birinchi farq — ", "В 4-м символе первое различие — ")}<b>{t("teng emas", "не равно")}</b>{t(", shuning uchun test qizil.", ", поэтому тест красный.")}</>}</div>}
  </div>;
}
const S7 = mkS(7, [{ v: 'eq' }, { v: 'chars' }, { v: 'fix' }, { v: 'fix', sum: true }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <>
    {(seg.v === 'eq' || seg.v === 'chars') && <Term title={t("VS Code terminali · FAIL", "терминал VS Code · FAIL")} lines={T7_EQ} er focus={seg.v === 'eq' ? ['o'] : []} />}
    {(seg.v === 'eq' || seg.v === 'chars') && <Compare7 mode={seg.v === 'eq' ? 'scan' : 'diff'} />}
    {seg.v === 'fix' && <><CodePanel file="texts.spec.ts" lines={FIX7} focus={seg.sum ? [] : ['f']} /><Term lines={T7_PASS} /></>}
  </>} />;
}

// ============================================================
//  8 · Amaliyot 1 — texts.spec.ts
// ============================================================
const P8 = mkPractice(8, [[], [0, 1], [2, 3], []], {
  code: [
    { step: 1, file: F.txs, lines: kod('SPEC02') },
    { step: 3, file: F.txs, lines: kod('SPEC04') },
  ],
});
function ScreenP8(p) { return <Practice p={p} S={P8.S} steps={P8.steps} trouble={P8.trouble} proof={P8.proof} code={P8.code} tree={FILES(F.txs)} />; }

// ============================================================
//  9 · Yolg'on PASS: expect yo'q (kod-05-yolgon.spec.ts · jest1v2-out/05)
// ============================================================
const T9 = out('05', 2);
const S9 = mkS(9, [{ v: 'code' }, { v: 'run' }, { v: 'run', sum: true }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <>
    {seg.v === 'code' ? <Code k="SPEC05" ids={{ 5: 'c' }} focus={['c']} files={FILES(F.txs, 'src/api/telegram/yolgon.spec.ts')} active="src/api/telegram/yolgon.spec.ts" /> : <CodePanel file="yolgon.spec.ts" lines={kod('SPEC05', {}, 3, 7)} />}
    {seg.v === 'run' && <Term title={t("VS Code terminali · npm test -- yolgon", "терминал VS Code · npm test -- yolgon")} lines={T9} />}
    {seg.sum && <div className="mk-rule">{t("Har ", "В каждом ")}<code>it</code>{t(" ichida kamida bitta ", " — внутри хотя бы один ")}<b>expect</b>{t(". Xatoni faqat ", ". Ошибку бросает только ")}<code>expect</code>{t(" tashlaydi.", " .")}</div>}
  </>} />;
}

// ============================================================
//  10 · Etalon koddan olingan — buzilgan kodda ham yashil (kod-06-savat.spec.ts · jest1v2-out/06a, 06)
// ============================================================
const T10A = out('06a', 2);
const T10B = out('06', outFind('06', /^FAIL/), outFind('06', /^\s*Jami: 100,000/));
// F-1104-09: oqim chizmasi — som() natijasi va ikki etalon qayerdan keladi
function Flow10({ broken }) {
  const res = broken ? "100,000 so'm" : "100 000 so'm";
  const Box = ({ h, v, c, hl }) => <div className={`fl-box${hl ? ' hl' : ''}`} style={{ '--c': c }}><small>{h}</small><b>{v}</b></div>;
  const verdict = (ok, lie) => <div className={`fl-v ${ok ? (lie ? 'lie' : 'ok') : 'bad'}`}>{ok ? (lie ? t("✓ yashil — lekin yolg'on", "✓ зелёный — но ложный") : t('✓ yashil', "✓ зелёный")) : t('✕ qizil', "✕ красный")}</div>;
  return <div className="mk-light fl" style={{ padding: 14 }}>
    <div className="mk-tag">{broken ? t("som buzildi (en-US) — kim nimani ko'radi", "som сломана (en-US) — кто что видит") : t("som to'g'ri — ikkala test", "som правильная — оба теста")}</div>
    <div className="fl-grid">
      <Box h={t("som(100000) qaytaradi", "som(100000) возвращает")} v={res} c={broken ? T.accent : T.green} hl={broken} />
      <div className="fl-tests">
        <div className="fl-row"><span className="fl-ar">→</span><Box h={t("1-test etaloni: `Jami: ${som(100000)}`", "эталон 1-го теста: `Jami: ${som(100000)}`")} v={'Jami: ' + res} c={broken ? T.accent : T.blue} hl={broken} /><span className="fl-eq">{t('teng', 'равно')}</span>{verdict(true, broken)}</div>
        <div className="fl-row"><span className="fl-ar">→</span><Box h={t("2-test etaloni: qo'lda yozilgan", "эталон 2-го теста: написан вручную")} v="Jami: 100 000 so'm" c={T.blue} /><span className="fl-eq">{broken ? t('teng emas', 'не равно') : t('teng', 'равно')}</span>{verdict(!broken)}</div>
      </div>
    </div>
    {broken && <div className="fl-note">{t("1-test etaloni ham ", "Эталон 1-го теста тоже ")}<b>{t("som'dan", "из som")}</b>{t(" yasaladi — som buzilsa, etalon ham u bilan birga buziladi.", " делается — если som сломается, эталон сломается вместе с ней.")}</div>}
  </div>;
}
const S10 = mkS(10, [{ v: 'both' }, { v: 'break' }, { v: 'res' }, { v: 'res', sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {seg.v === 'both' && <><CodePanel file="savat.spec.ts" lines={kod('SPEC06', { 11: 'a', 16: 'b' }, 9, 17)} focus={['a', 'b']} /><Flow10 /></>}
    {seg.v === 'break' && <Code k="TX_SOM" ids={{ 4: 'x' }} focus={['x']} edit={{ 4: KOD.TX_SOM.lines[3].t.replace("'ru-RU'", "'en-US'") }} files={FILES('src/api/telegram/savat.spec.ts')} active={F.tx} />}
    {seg.v === 'res' && !seg.sum && <><Flow10 broken /><Term title={t("VS Code terminali · som buzilgan", "терминал VS Code · som сломан")} lines={T10B} er /></>}
    {/* F-1120-02 (M50-2): xulosada matnli qoida o'rniga shu ekranning oqim chizmasi (som buzilgan holat) qoladi — ${som(…)} nega xavfli */}
    {seg.sum && <><CodePanel file="savat.spec.ts" lines={kod('SPEC06', { 11: 'a', 16: 'b' }, 10, 16)} focus={['a']} /><Flow10 broken /></>}
  </>} />;
}

// ============================================================
//  11 · Tekshiruv 2 — LineCheck (jest1v2-out/23 buzuq, 24 tuzatilgan; target 16-satr → bo'lakda 5-satr, indeks 4)
// ============================================================
const LC11 = KOD.SPEC_OP_BUZUQ.lines.filter((l) => l.n >= 12 && l.n <= 19).map((l) => ({ h: tsLine(l.t), n: l.n }));
const LC11_FIXED = KOD.SPEC_OP.lines.filter((l) => l.n >= 12 && l.n <= 19).flatMap((l) => l.n === 16 ? [{ h: tsLine(KOD.SPEC_OP_BUZUQ.lines[15].t), n: 16, gone: true }, { h: tsLine(l.t), n: 16, neu: true }] : [{ h: tsLine(l.t), n: l.n }]);
const L24 = outLines('24');
const T11X = out('24', L24.findIndex((l, i) => i > 20 && /^FAIL/.test(l)) + 1, L24.findIndex((l, i) => i > 20 && /Holati/.test(l)) + 1);
function Screen11(p) {
  const m = MDT[11];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="texts.spec.ts" lines={LC11} target={4}
    tree={{ root: MKCFG.root, files: compact(FILES(F.txs), F.txs), active: F.txs }}
    fixed={LC11_FIXED} fixedExtra={[{ file: t('terminal — som en-US bilan buzilgan', "терминал — som сломана через en-US"), lines: T11X }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}
