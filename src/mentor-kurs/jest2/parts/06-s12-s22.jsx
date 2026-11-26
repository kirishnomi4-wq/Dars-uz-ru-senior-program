
// ============================================================
//  12 · Tekshiruv 2 — rejects sinxron xatoda (kod-06 · jest2v2-out/06)
// ============================================================
function Screen12(p) {
  return MC(p, 12, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="order.service.spec.ts" lines={kod('SPEC_ORDER_06', { 35: 'x', 36: 'x', 37: 'x' }, 35, 37)} focus={['x']} />
      <CodePanel file="order.service.ts" lines={kod('ORDER_PLACE', { 25: 't' }, 25, 25)} focus={['t']} />
    </div>,
    after: <Term title={t("VS Code terminali · npm test -- order.service -t telefon", "терминал VS Code · npm test -- order.service -t telefon")} lines={out('06', outFind('06', /●/), outFind('06', /^\s*>\s*25/))} er />,
  });
}

// ============================================================
//  13 · await unutildi — xabar noto'g'ri, natija yo'q (kod-08 · jest2v2-out/08)
// ============================================================
const T13 = outPick('08', (l) => !/^\s+at |matcherResult|^\s*'|^\s*"|pass: false|^\s*\}|^\s*\{$|innerErr|^\s+\^$/.test(l));
const CAUSE13 = ['Test funksiyasi promise\'ni kutmasdan darhol tugadi', 'Promise keyin rad etildi — Jest farqni ko\'rdi (Expected / Received)', 'Lekin bu xato qaysi testniki? Jest bog\'lay olmadi', 'Jarayon to\'xtadi: PASS ham, FAIL ham yo\'q'];
const S13 = mkS(13, [{ v: 'code' }, { v: 'run' }, { v: 'cause' }, { v: 'cause', sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {seg.v === 'code' && <CodePanel file={t("order.service.spec.ts · await yo'q", "order.service.spec.ts · нет await")} lines={kod('SPEC_ORDER_08', { 51: 'x', 52: 'x' }, 44, 54)} focus={['x']} />}
    {seg.v === 'run' && <><CodePanel file={t("order.service.spec.ts · await yo'q", "order.service.spec.ts · нет await")} lines={kod('SPEC_ORDER_08', { 51: 'x' }, 51, 53)} focus={['x']} /><Term title={t("VS Code terminali · natija yo'q", "терминал VS Code · результата нет")} lines={T13} er /></>}
    {seg.v === 'cause' && <><Term title={t("VS Code terminali · natija yo'q", "терминал VS Code · результата нет")} lines={T13.slice(0, 5)} er /><Cause items={CAUSE13} on={4} bad={0} /></>}
  </>} />;
}

// ============================================================
//  14 · Tekshiruv 3 — LineCheck: await yo'q (kod-08 44–54, xato 51-satr → indeks 7; 08b tuzatilgan)
// ============================================================
const LC14 = kod('SPEC_ORDER_08', {}, 44, 54);
const LC14_FIXED = kod('SPEC_ORDER_08', {}, 44, 54).flatMap((l) => l.n === 51 ? [{ ...l, gone: true }, { h: tsLine('    await expect(service.place(user, cart)).rejects.toThrow('), n: 51, neu: true }] : [l]);
const T14X = out('08b', outFind('08b', /●/), outFind('08b', /Received message/));
function Screen14(p) {
  const m = MDT[14];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="order.service.spec.ts" lines={LC14} target={7}
    tree={{ root: MKCFG.root, files: compact(FILES(F.ph, F.phs, F.ors), F.ors), active: F.ors }}
    fixed={LC14_FIXED} fixedExtra={[{ file: t("VS Code terminali · await bilan, xabar noto'g'ri", "терминал VS Code · с await, сообщение неверное"), lines: T14X }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  15 · Xato yo'lida nima bo'lmasligi kerak (kod-05 44–55, 57–67 · order.service.ts 36–45)
// ============================================================
// F-1109-06: xulosa — ikki expect kartasi o'rniga place() oqimi (order.service.ts satrlari bilan) va har expect qaysi qutini tekshirishi
function Flow15() {
  return <div className="z j2-15">
    <div className="flow">
      <div className="st"><h6>{t("Savat", "Корзина")}</h6><div className="zm">Kolonka × 2</div><div className="ln">{t("cart · spec 18-satr", "cart · spec строка 18")}</div></div>
      <div className="ar">→</div>
      <div className="st"><h6>{t("Ombor (mock)", "Склад (mock)")}</h6><div className="zm">findOne → stock: <b>1</b></div><div className="ln">{t("service 31-satr", "service строка 31")}</div></div>
      <div className="ar">→</div>
      <div className="st x"><h6>{t("Tekshiruv", "Проверка")}</h6><div className="zm">1 &lt; 2 → throw</div><span className="z-tag r">{t("✗ xato chiqdi", "✗ ошибка вышла")}</span><div className="ln">{t("service 36–37-satr", "service строки 36–37")}</div></div>
      <div className="ar">✕</div>
      <div className="st off"><h6>{t("Omborni kamaytirish", "Уменьшение склада")}</h6><div className="zm">UPDATE products SET stock = stock - $1</div><span className="z-tag g">{t("chaqirilmadi · ombor 1 qoldi", "не вызван · на складе осталось 1")}</span><div className="ln">{t("service 42-satr", "service строка 42")}</div></div>
    </div>
    <div className="as">
      <div className="a"><b>{t("1-qism · xato chiqdi", "Часть 1 · ошибка вышла")}</b><div className="zm">await expect(service.place(user, cart)){'\n'}.rejects.toThrow('Kolonka: omborda faqat 1 ta qoldi')</div><small>{t("«Tekshiruv» qutisini tekshiradi", "проверяет блок «Проверка»")}</small></div>
      <div className="a"><b>{t("2-qism · keyingi qadam bo'lmadi", "Часть 2 · следующий шаг не случился")}</b><div className="zm">expect(manager.query){'\n'}.not.toHaveBeenCalled()</div><small>{t("«Omborni kamaytirish» qutisini tekshiradi", "проверяет блок «Уменьшение склада»")}</small></div>
    </div>
  </div>;
}
const S15 = mkS(15, [{ v: 'src' }, { v: 'not' }, { v: 'times' }, { v: 'sum' }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <>
    {seg.v === 'src' && <Code k="ORDER_PLACE" files={FILES(F.ors)} active={F.ord} ids={{ 36: 'c', 37: 'c', 38: 'c', 42: 'u', 43: 'u', 44: 'u', 45: 'u' }} focus={['c', 'u']} from={35} to={45} />}
    {seg.v === 'not' && <CodePanel file="order.service.spec.ts" lines={kod('SPEC_ORDER_05', { 54: 'n' }, 44, 55)} focus={['n']} />}
    {seg.v === 'times' && <CodePanel file="order.service.spec.ts" lines={kod('SPEC_ORDER_05', { 66: 'n' }, 57, 67)} focus={['n']} />}
    {seg.v === 'sum' && <Flow15 />}
  </>} />;
}

// ============================================================
//  16 · Chegara: < → <= (jest2v2-out/09, 09b, 09c · kod-10 69–78)
// ============================================================
const BREAK16 = { 36: KOD.ORDER_PLACE.lines.find((l) => l.n === 36).t.replace('p.stock < c.qty', 'p.stock <= c.qty') };
const T16A = out('09', outFind('09', /^PASS/), outFind('09', /^Tests:/));
const T16B = out('09c', outFind('09c', /^FAIL/), outFind('09c', /^\s*>\s*37/));
const T16C = out('09b', outFind('09b', /^PASS/), outFind('09b', /^Tests:/));
// F-1120-02 (M52): 1-segment (x) — mentor 36-satrdagi «<» ni o'zi bosadi (data-act) → «<=»
const L36 = KOD.ORDER_PLACE.lines.find((l) => l.n === 36).t;
const ACT16 = kod('ORDER_PLACE', { 36: 'x' }, 35, 38).map((l) => (l.n === 36 ? { ...l, h: tsLine(L36.split('p.stock < c.qty')[0] + 'p.stock ') + '<span class="n1-act" data-act="1">' + tsLine('<') + '</span>' + tsLine(' c.qty' + L36.split('p.stock < c.qty')[1]) } : l));
// 1280×720 da kichik rasm bilan sig'sin: 5-testdan nomi, stock: 2 va kutilgan jami (oraliq satrlar «…»)
const SPEC16 = (() => { const L = kod('SPEC_ORDER_10', { 69: 'c', 73: 'c', 77: 'c' }, 69, 78); const keep = [69, 73, 76, 77, 78]; const out = []; L.forEach((l) => { if (!keep.includes(l.n)) { if (out.length && out[out.length - 1].n !== '') out.push({ h: '<span class="cm">…</span>', n: '' }); return; } out.push(l); }); return out; })();
const S16 = mkS(16, [{ v: 'act' }, { v: 'break' }, { v: 'four' }, { v: 'five' }, { v: 'ok' }]);
function Screen16(p) {
  return <Lesson p={p} S={S16} scene={(b) => <Scene16 b={b} />} />;
}
// Qadamlar: 0 bosing · 1 buzildi (natija «?») · 2 to'rt test yashil · 3 5-test qizil, bo'laklar 1·2 · 4 tiklandi → 5 passed
function Scene16({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const v = beat === 0 ? (act.hit ? 'break' : 'act') : seg.v;
  const broken = v !== 'act' && v !== 'ok';
  const res = v === 'act' || v === 'break' ? (v === 'break' ? ['?', ''] : null) : v === 'four' ? ['npm test -- order.service → 4 passed ' + t('(sezilmadi)', '(не заметили)'), 'ok'] : v === 'five' ? ['5-test → 1 failed: Kolonka: omborda faqat 2 ta qoldi', 'bad'] : ['5 passed', 'ok'];
  const mini = <N1Mini><FlowMini tag={t("Chegara: omborda 2 ta, savatda 2 ta", 'Граница: на складе 2, в корзине 2')}
    boxes={[[t('mock: stock 2', 'mock: stock 2'), t('savatda: 2 ta', 'в корзине: 2'), ''], [broken ? 'p.stock <= c.qty' : 'p.stock < c.qty', t('36-satr', 'строка 36'), broken ? 'bad' : v === 'ok' ? 'ok' : ''], [t('buyurtma', 'заказ'), v === 'five' ? t("rad: «faqat 2 ta qoldi»", 'отказ: «осталось только 2»') : v === 'act' || v === 'ok' ? t('qabul · 100 000', 'принят · 100 000') : '?', v === 'five' ? 'bad' : '']]}
    res={res} pins={beat === 3 ? { 1: 1, 2: 2 } : {}} /></N1Mini>;
  return <>
    {v !== 'five' && v !== 'ok' && <Ide files={compact(FILES(F.ors), F.ord)} active={F.ord}>
      {v === 'act' ? <div onClick={act.onClick}><CodePanel file="order.service.ts" lines={ACT16} focus={['x']} /></div> : <CodePanel key="b" file={t("order.service.ts · buzilgan", "order.service.ts · сломан")} lines={kod('ORDER_PLACE', { 36: 'x' }, 35, 38, BREAK16)} focus={['x']} />}
      {mini}
    </Ide>}
    {(v === 'break' || v === 'four') && <Term title={t("VS Code terminali · npm test -- order.service", "терминал VS Code · npm test -- order.service")} lines={T16A} />}
    {v === 'four' && <div className="n2-warn">{t(<>To'rt test yashil: ular <b>1 ta</b> va <b>10 ta</b> ni sinaydi — <code>&lt;</code> va <code>&lt;=</code> farqi faqat <b>aynan teng</b> bo'lganda.</>, <>Четыре теста зелёные: они проверяют <b>1</b> и <b>10</b> — разница между <code>&lt;</code> и <code>&lt;=</code> только при <b>точном равенстве</b>.</>)}</div>}
    {v === 'five' && <><Ide files={compact(FILES(F.ors), F.ors)} active={F.ors}><CodePanel file="order.service.spec.ts" lines={SPEC16} focus={['c']} />{mini}</Ide><Term title={t("VS Code terminali · buzilgan kod bilan", "терминал VS Code · со сломанным кодом")} lines={T16B} er /></>}
    {v === 'ok' && <><Term title={t("VS Code terminali · tiklangan kod bilan", "терминал VS Code · с восстановленным кодом")} lines={T16C} />{mini}<div className="mk-rule">{t(<>Har <code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code> shartiga — <b>aynan teng</b> qiymat bilan test.</>, <>На каждое условие <code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code> — тест со значением <b>ровно на равенстве</b>.</>)}</div></>}
  </>;
}

// ============================================================
//  17 · Amaliyot 2 — order.service.spec.ts va chegara
// ============================================================
const P17 = mkPractice(17, [[], [0, 1], [2, 3], []], {
  code: [
    { step: 0, file: F.ors, lines: kod('SPEC_ORDER_05', {}, 1, 31), copy: false },
    { step: 1, file: F.ors, lines: kod('SPEC_ORDER_05', {}, 33, 68), copy: false },
    { step: 2, file: F.ors, lines: kod('SPEC_ORDER_10', {}, 69, 79), copy: false },
  ],
});
function ScreenP17(p) { return <Practice p={p} S={P17.S} steps={P17.steps} trouble={P17.trouble} proof={P17.proof} code={P17.code} tree={FILES(F.ph, F.phs, F.ors)} />; }

// ============================================================
//  18 · Sayt API'siga HTTP test: supertest (jest2v2-out/10, 11 · kod-11)
// ============================================================
const T18A = out('10');
const T18B = out('11', outFind('11', /^PASS/), outFind('11', /^Tests:/));
// F-1109-06: xulosa — ikki gapli karta o'rniga ikki parallel oqim bir qolipda: kirish → kod → chiqish → expect (haqiqiy qiymatlar)
function Two18() {
  const row = (inp, code, codeNote, outp, exp) => <div className="z-flow">
    <div className="z-st"><b>{t("kirish", "ввод")}</b>{inp}</div><div className="z-ar">→</div>
    <div className="z-st blue"><b>{t("kod", "код")}</b><span className="zm">{code}</span>{codeNote && <span className="z-mut">{codeNote}</span>}</div><div className="z-ar">→</div>
    <div className="z-st"><b>{t("chiqish", "вывод")}</b>{outp}</div><div className="z-ar">→</div>
    <div className="z-st ok"><b>expect</b><span className="zm">{exp}</span><span className="z-tag g">✓</span></div>
  </div>;
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Bot handler'i — order.service.spec.ts", "Handler бота — order.service.spec.ts")}</p>
      {row(<><span className="zm">place(user, cart)</span><span className="z-mut">{t("Kolonka × 2, omborda 1", "Kolonka × 2, на складе 1")}</span></>, 'OrderService.place', t("manager — mock", "manager — mock"), <span className="zm">throw 'Kolonka: omborda faqat 1 ta qoldi'</span>, '.rejects.toThrow(…)')}
    </div>
    <div className="z-card">
      <p className="z-h">{t("Sayt route'i — app.controller.spec.ts · supertest · Tests: 2 passed", "Route сайта — app.controller.spec.ts · supertest · Tests: 2 passed")}</p>
      {row(<span className="zm">request(app.getHttpServer()).get('/')</span>, 'AppController', t("xotirada: port ochilmaydi, baza yo'q", "в памяти: порт не открывается, базы нет"), <><span className="z-tag g">200</span><span className="zm">{'{'} ok: true, service: 'order-bot' {'}'}</span></>, 'status 200 · toEqual')}
      {row(<span className="zm">.get('/nope')</span>, t("route yo'q", "route нет"), null, <><span className="z-tag o">404</span><span className="zm">Cannot GET /nope</span></>, 'status 404 · message')}
    </div>
    <div className="z-rule">{t("Qolip bitta: ", "Шаблон один: ")}<b>{t("kirish beriladi, chiqish solishtiriladi", "даём ввод, сравниваем вывод")}</b>{t(" — bot handler'i ham, sayt route'i ham.", " — и handler бота, и route сайта.")}</div>
  </div>;
}
const S18 = mkS(18, [{ v: 'install' }, { v: 'setup' }, { v: 'tests' }, { v: 'sum' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {seg.v === 'install' && <Term title={t("VS Code terminali · OrderBotNest", "терминал VS Code · OrderBotNest")} lines={T18A} />}
    {seg.v === 'setup' && <Code k="SPEC_APP" files={FILES(F.ph, F.phs, F.ors, F.apps)} active={F.apps} fresh={F.apps} ids={rngIds(7, 14, 's')} focus={['s']} from={1} to={14} />}
    {seg.v === 'tests' && <><CodePanel file="app.controller.spec.ts" lines={kod('SPEC_APP', { ...rngIds(17, 21, 'a'), ...rngIds(23, 27, 'b') }, 16, 28)} focus={['a', 'b']} /><Term title={t("VS Code terminali · npm test -- app.controller", "терминал VS Code · npm test -- app.controller")} lines={T18B} /></>}
    {seg.v === 'sum' && <Two18 />}
  </>} />;
}

// ============================================================
//  19 · Tekshiruv 4 — GET /nope (kod-11 23–27 · jest2v2-out/11)
// ============================================================
function Screen19(p) {
  return MC(p, 19, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="app.controller.ts" lines={kod('APP_CTRL', { 6: 'g' }, 3, 10)} focus={['g']} />
      <CodePanel file="app.controller.spec.ts" lines={kod('SPEC_APP', { 24: 'r' }, 23, 27)} focus={['r']} />
    </div>,
    after: <Term title={t("VS Code terminali · npm test -- app.controller", "терминал VS Code · npm test -- app.controller")} lines={T18B} />,
  });
}

// ============================================================
//  20 · AI edge testlar yozdi — ikki to'plam (jest2v2-ai/ai1, ai2)
// ============================================================
// 26.11 (F-1125-01, M56 — Nest-1 darajasi): bitta vazifa, ikki topshiriq — oddiy (p1-prompt.txt, 04.11) va Jest tilida (p2-prompt.txt, 26.11);
// o'sha ikki model, har biri o'z nusxasida (jest2v2-ai/p2/). 2-topshiriqdagi probel satri bu yerda ko'rsatilmaydi — mentor uni 22-ekranda (Tekshiruv 5) o'zi topadi.
const P2_JEST = ["OrderBotNest'ga jest bilan edge case va error path testlarini yoz.",
  "- Telefon qoidasi: telegram.service.ts dagi PHONE ni src/api/telegram/phone.ts ga isPhone(text) funksiyasi qilib ajrat, telegram.service.ts shu funksiyani chaqirsin. phone.spec.ts da it.each bilan: to'g'ri raqam, chegara (eng qisqa va eng uzun to'g'ri raqam, bittaga qisqa va bittaga uzun), harf, bo'sh satr, probel bilan yozilgan raqam.",
  "- OrderService.place: uch error path — telefon yo'q, savat bo'sh, omborda yetmaydi. Baza o'rniga mock: Test.createTestingModule, DataSource.transaction, manager.findOne va manager.query — jest.fn.",
  "- Sinxron xato — expect(() => …).toThrow('…'), promise xatosi — await expect(…).rejects.toThrow('…'). Xatodan keyin UPDATE ketmaganini not.toHaveBeenCalled bilan tekshir. Chegara: omborda aynan 2 ta, 2 ta olinadi — o'tadi.",
  "- Xato xabarini qo'lda yoz, koddan olma. Boshqa kodni o'zgartirma. npm test yashil bo'lsin; qaysi fayl qo'shilgani va o'zgarganini yoz."].join('\n');
// 2-AI, 1-topshiriq: telegram.service.spec.ts — «rad etiladi» ro'yxati (jest2v2-ai/ai2, aynan; 50–55 va 58–60 qisqartirilgan)
const AI2_P1_PROBEL = [
  { n: 49, h: tsLine("  it.each([") },
  { n: '', h: '<span class="cm">…</span>' },
  { n: 56, h: tsLine("    ['++998901234567', 'ikki +'],") },
  { n: 57, id: 'p', h: tsLine("    ['+998 90 123 45 67', 'ichida bo\\'shliq'],") },
  { n: '', h: '<span class="cm">…</span>' },
  { n: 61, h: tsLine("  ])('rad etiladi: %j (%s)', async (phone) => {") },
];
// Natija 2 × 2 — jest2v2-ai/XULOSA.md (p1) va p2/XULOSA.md (p2): test soni (eski 10 bilan), qo'shilgan qator (diff-stat), telefon qoidasi
// t() chizish paytida (modul yuklanganda til hali o'rnatilmagan) — shuning uchun funksiya
const RES20 = () => [
  [t('1-AI (kuchli model)', '1-й AI (сильная модель)'), t('50 test · 352 qator', '50 тестов · 352 строки'), false, t('23 test · 114 qator', '23 теста · 114 строк'), true],
  [t('2-AI (kuchsizroq model)', '2-й AI (модель слабее)'), t('42 test · 224 qator', '42 теста · 224 строки'), false, t('23 test · 90 qator', '23 теста · 90 строк'), true],
];
const S20 = mkS(20, [{ v: 'intro' }, { v: 'prompt' }, { v: 'two' }, { v: 'snip' }, { v: 'snip', sum: true }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg }) => <>
    {seg.v === 'intro' && <div className="pg-two">
      <Card c={T.ink3} h={t("1–4-bosqich · xato yo'lini siz yozdingiz", "Этапы 1–4 · путь ошибки писали вы")} dim><p><code>isPhone</code> · mock · <code>toThrow</code> / <code>rejects</code> · <code>not.toHaveBeenCalled</code>{t(" · chegara", " · граница")}</p></Card>
      <Card c={JC.ai} h={t("5-bosqich · AI yozadi, siz qabul qilasiz", "Этап 5 · пишет AI, вы принимаете")} hl><p>{t("Savol: ", "Вопрос: ")}<b>{t("bu test xatoni ushlaydimi — va qoidani sinaydimi?", "ловит ли этот тест ошибку — и проверяет ли он правило?")}</b></p></Card>
    </div>}
    {seg.v === 'prompt' && <div className="pg-two">
      <AiReply who={t("1-topshiriq · oddiy so'zlar bilan", "1-е задание · простыми словами")} prompt={KOD.PROMPT1} tag={t("haqiqiy yurgizish · 04.11", "настоящий запуск · 04.11")} />
      <AiReply who={t("2-topshiriq · Jest tilida", "2-е задание · на языке Jest")} prompt={P2_JEST} tag={t("haqiqiy yurgizish · 26.11", "настоящий запуск · 26.11")} hl />
    </div>}
    {seg.v === 'two' && <div className="mk-light" style={{ padding: 12 }}><table className="j2-res"><thead><tr><th />
      <th>{t("1-topshiriq · oddiy so'zlar bilan", "1-е задание · простыми словами")}</th><th>{t("2-topshiriq · Jest tilida", "2-е задание · на языке Jest")}</th></tr></thead>
      <tbody>{RES20().map(([who, a, aOk, b, bOk]) => <tr key={who}><td>{who}</td>
        <td>{a}<br /><b className={aOk ? 'ok' : 'no'}>{t("qoida ajratilmadi — handler orqali", "правило не выделено — через handler")}</b></td>
        <td>{b}<br /><b className={bOk ? 'ok' : 'no'}><code>isPhone</code>{t(" ajratildi", " выделен")}</b></td></tr>)}
        <tr><td>{t("To'rttalasida", "У всех четырёх")}</td><td colSpan={2}><code>await … rejects.toThrow</code> · <code>not.toHaveBeenCalled</code>{t(" — to'g'ri; so'ralmagan kodga tegmadi", " — верно; код, о котором не просили, не тронут")}</td></tr>
      </tbody></table></div>}
    {seg.v === 'snip' && <div className="pg-two">
      <CodePanel file={t("1-AI · 1-topshiriq · telegram.service.phone.spec.ts · rad ro'yxati", "1-й AI · 1-е задание · telegram.service.phone.spec.ts · список отказов")} lines={kod('AI1_TEL', { 90: 'p' })} focus={['p']} />
      <CodePanel file={t("2-AI · 1-topshiriq · telegram.service.spec.ts · «rad etiladi»", "2-й AI · 1-е задание · telegram.service.spec.ts · «rad etiladi»")} lines={AI2_P1_PROBEL} focus={['p']} />
    </div>}
    {seg.sum && <div className="mk-rule">{t(<>Topshiriqni <b>dars tilida</b> bering — tuzilish to'g'ri bo'ladi. <b>Qoidani</b> (probelli raqam qabul qilinadimi) siz aytasiz; «hammasi yashil» — hali <b>tekshiruv emas</b>.</>, <>Давайте задание <b>на языке урока</b> — структура будет верной. <b>Правило</b> (принимать ли номер с пробелами) задаёте вы; «всё зелёное» — ещё <b>не проверка</b>.</>)}</div>}
  </>} />;
}

// ============================================================
//  21 · Buzib tekshirish: AI to'plamlari (mutatsiya-men.txt, mutatsiya-ai.txt)
// ============================================================
const S21 = mkS(21, [{ rows: 5 }, { rows: 5, all: true }, { rows: 5, seal: true }, { rows: 5, sum: true }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <>
    {!seg.seal && <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">{t("Nechta test qizardi (0 — buzilish sezilmadi) · ", "Сколько тестов покраснело (0 — поломка не замечена) · ")}<code>jest2v2-mutatsiya.sh</code></div><MutTable rows={seg.rows} />{(seg.all || seg.sum) && <div className="mk-pair" style={{ marginTop: 6 }}>{t("2-topshiriq (Jest tilida): 1-AI 23 test · 2-AI 23 test — beshala buzishda bittadan qizardi", "2-е задание (на языке Jest): 1-й AI 23 теста · 2-й AI 23 теста — на всех пяти поломках покраснело по одному")} · <code>p2/mutatsiya-p2.txt</code></div>}</div>}
    {seg.seal && <div style={{ display: 'grid', gap: 8 }}>
      <div className="mk-tag" style={{ margin: 0 }}>{t("Oltinchi «buzilish» — buzib bo'lmaydi: AI hozirgi xulqni muhrlagan", "Шестую «поломку» — не сломать: AI запечатал текущее поведение")}</div>
      <CodePanel file={t("1-AI · telegram.service.phone.spec.ts · «rad etiladi» ro'yxatida", '1-й AI · telegram.service.phone.spec.ts · в списке «rad etiladi»')} lines={kod('AI1_TEL', { 90: 'p' }, 88, 92)} focus={['p']} />
      <CodePanel file={t("phone.ts · 6-ekrandagi tuzatish", "phone.ts · исправление с экрана 6")} lines={kod('PHONE_NEW', { 4: 'f' }, 3, 4)} focus={['f']} />
      <div className="n2-warn">{t(<>Tuzatishdan keyin AI testi <b>qizaradi</b>: u qoidani emas, kod hozir qanday ishlashini qo'riqlayapti. Mijoz odatini AI bilmaydi.</>, <>После исправления тест от AI <b>краснеет</b>: он охраняет не правило, а то, как код работает сейчас. О привычке клиента AI не знает.</>)}</div>
    </div>}
    {seg.sum && <div className="mk-rule">{t(<>AI testi <b>xatoni ushlaydi</b> — va <b>hozirgi xulqni muhrlaydi</b>. Har testdan so'rang: bu qoidami, yoki «kod hozir shunday»mi?</>, <>Тест от AI <b>ловит ошибку</b> — и <b>запечатывает текущее поведение</b>. У каждого теста спросите: это правило или «код просто сейчас так»?</>)}</div>}
  </>} />;
}

// ============================================================
//  22 · Amaliyot 3 — AI test yozadi, siz buzib tekshirasiz (prompt — MD 22-ekrandan aynan, setStatus 66–87)
// ============================================================
const PROMPT22 = KOD.PROMPT2.split('. ').map((s, i, a) => ({ h: escH(s + (i < a.length - 1 ? '.' : '')) }));
const P22 = mkPractice(22, [[], [0, 1], [2, 3], []], {
  code: [{ step: 0, file: 'prompt.txt', lines: PROMPT22 }, { step: 2, file: F.ord, lines: kod('ORDER_SETSTATUS'), copy: false }],
});
function ScreenP22(p) { return <Practice p={p} S={P22.S} steps={P22.steps} trouble={P22.trouble} proof={P22.proof} code={P22.code} tree={['prompt.txt', F.ord, F.ors]} />; }
