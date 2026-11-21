
// ============================================================
//  1 · Kirish — dars oxiridagi natija: 5 fayl, 25 test (jest2v2-out/12)
// ============================================================
const PLAN1 = ['Umumiy tushuncha', 'Telefon: edge case', 'Buyurtma: error path', "Chegara va «bo'lmasligi kerak»", 'HTTP test va AI', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [] }, { hl: [0] }, { hl: [1, 2, 3, 4] }, { hl: [5] }], { plan: PLAN1 });
// F-1120-02 (M51): darsning rasmi — «Buyurtma boti» xaritasi + Jest qatori (BotMap, parts/02e-bot.jsx); reja pastda.
// Bugungi uch joy: telefon qoidasi (telegram · phone.ts), buyurtma xatolari (order · baza o'rniga mock), sayt API (supertest)
const DB_ALL = { products: 'db', users: 'db', carts: 'db', orders: 'db' };
const J2_FILES = ['spec: phone · order.service · app.controller'];
const S1M = [
  { on: ['telegram', 'order'], jest: { files: J2_FILES, res: 'pass', txt: '25 passed' } },
  { on: ['telegram', 'order'], jest: { files: J2_FILES, res: 'pass', txt: '25 passed' } },
  { on: ['telegram', 'order'], jest: { files: J2_FILES, res: 'pass', txt: '25 passed' }, note: { products: 'mock: findOne → Kolonka, stock 1' } },
  { on: ['telegram', 'order'], jest: { files: J2_FILES, res: 'pass', txt: '25 passed' } },
];
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg, beat }) => { const m = S1M[Math.min(beat, 3)]; return <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 12 }}>
    <BotMap loc={DB_ALL} tgSub="phone.ts" {...m} tag={t("Bugungi darsning rasmi — bot noto'g'ri kirishda to'g'ri buziladimi", 'Картина урока — правильно ли ломается бот на неверном вводе')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>; }} />;
}

// ============================================================
//  2 · Uch yo'l: happy path, edge case, error path (umumiy tushuncha — F-1104 foydalanuvchi talabi)
// ============================================================
const PATHS2 = [
  { k: 'happy', c: JC.happy, h: 'Happy path — kutilgan kirish', ex: ['+998901234567', 'omborda 10 ta'], q: "Buyurtma qabul qilindi. Jest-1 ning hamma testi shu yo'lda edi.", t: "test: natija to'g'rimi" },
  { k: 'edge', c: JC.edge, h: 'Edge case — qoidaning chegarasi', ex: ['+998 90 123 45 67', '9 ta raqam', 'omborda aynan 2 ta'], q: "Kod xato bermaydi — lekin javobi to'g'rimi?", t: "test: chegarada ham to'g'rimi" },
  { k: 'err', c: JC.err, h: 'Error path — kod ataylab xato beradi', ex: ["telefon yo'q", "savat bo'sh", 'omborda 1 ta, savatda 2'], q: "Xato — to'g'ri xulq. Qaysi xabar? Keyin nima bo'lmaydi?", t: "test: xato chiqdi va keyingi qadam bo'lmadi" },
];
const S2 = mkS(2, [{ on: 0 }, { on: 1 }, { on: 2 }, { on: -1, all: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <><div className="pg-three">
    {PATHS2.map((x, i) => <div key={x.k} className={`path${seg.on === i ? ' hl' : ''}${seg.on >= 0 && seg.on !== i ? ' dim' : ''}`} style={{ '--c': x.c }}>
      <h4>{x.h}</h4>{x.ex.map((e) => <div key={e} className="ex">{e}</div>)}<div className="q">{x.q}</div>{seg.all && <div className="t">{x.t}</div>}
    </div>)}
  </div>
    {/* F-1120-02 (M51): xulosada darsning rasmi — bugungi uch yo'l botning qaysi joyida sinaladi (telegram · phone.ts, order); testlar hali yozilmagan */}
    {seg.all && <div className="mk-light" style={{ padding: 12 }}><BotMap loc={DB_ALL} tgSub="phone.ts" on={['telegram', 'order']} jest={{ steps: [['happy path', ''], ['edge case', ''], ['error path', '']], res: '?', badge: t('bugun yozamiz', 'пишем сегодня') }} max={1} tag={t("Har funksiyaga uch yo'lning testi — bugun uchalasini yozamiz", 'Тесты трёх путей для каждой функции — сегодня пишем все три')} /></div>}
  </>} />;
}

// ============================================================
//  3 · Telefon qoidasi yashirin — alohida funksiyaga (jest2-start 12, 155–157 · phone.ts · jest2-done 10, 155–156)
// ============================================================
const S3 = mkS(3, [{ v: 'old', f: ['p', 'u'] }, { v: 'old', f: ['p'] }, { v: 'new' }, { v: 'use' }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <>
    {seg.v === 'old' && <Ide files={compact(FILES(), F.tg)} active={F.tg}>
      <CodePanel file="telegram.service.ts" lines={[...kod('TS_PHONE', { 12: 'p' }), { h: '<span class="cm">…</span>', n: '' }, ...kod('TS_ONTEXT', { 155: 'u', 156: 'u', 157: 'u' })]} focus={seg.f} />
    </Ide>}
    {seg.v === 'new' && <Code k="PHONE_OLD" files={FILES(F.ph)} active={F.ph} fresh={F.ph} ids={{ 2: 'r', 4: 'i' }} focus={['r', 'i']} />}
    {seg.v === 'use' && <Ide files={compact(FILES(F.ph), F.tg)} active={F.tg}>
      <CodePanel file="telegram.service.ts · jest2-done" lines={[...kod('TS_IMPORT_NEW', { 10: 'i' }), { h: '<span class="cm">…</span>', n: '' }, ...kod('TS_ONTEXT_NEW', { 155: 'u', 156: 'u' }, 153, 158)]} focus={['i', 'u']} />
    </Ide>}
  </>} />;
}

// ============================================================
//  4 · Tekshiruv 1 — probel bilan yozilgan raqam (jest2v2-out/02)
// ============================================================
function Screen4(p) {
  return MC(p, 4, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="phone.ts" lines={kod('PHONE_OLD', { 2: 'r', 4: 'i' })} focus={['r', 'i']} />
      <div className="mk-pair">{t("Aziza yozdi: ", "Азиза написала: ")}<code>+998 90 123 45 67</code></div>
    </div>,
    after: <Term title={t("VS Code terminali · npm test -- phone", "терминал VS Code · npm test -- phone")} lines={out('02', outFind('02', /✕/), outFind('02', /Received:/))} er />,
  });
}

// ============================================================
//  5 · Edge testlar: it.each (kod-02-phone.spec.ts · jest2v2-out/02)
// ============================================================
const T5 = out('02', outFind('02', /^FAIL/), outFind('02', /^Tests:/));
// F-1109-06: xulosa — FAIL parchasi o'rniga it.each jadvalining o'zi (jest2v2-out/02) va qoida raqamlar o'qida
const ROWS5 = [
  ['g', "it.each — to'g'ri raqamlar", 'it.each — правильные номера'],
  ['r', '+998901234567', "to'g'ri raqam", 'true', 'true', true],
  ['r', '998901234567', "to'g'ri raqam", 'true', 'true', true],
  ['g', "it.each — noto'g'ri kirishlar", 'it.each — неверные вводы'],
  ['r', '12345678', '8 ta raqam — qisqa', 'false', 'false', true],
  ['r', '+99890123456789', '14 ta raqam — uzun', 'false', 'false', true],
  ['r', 'abc', 'harf', 'false', 'false', true],
  ['r', "''", "bo'sh", 'false', 'false', true],
  ['g', "it — mijozning odati", 'it — привычка клиента'],
  ['r', '+998 90 123 45 67', 'mijoz probel bilan yozadi', 'true', 'false', false],
];
function Each5() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("phone.spec.ts — bitta qoida, yetti kirish · npm test -- phone", "phone.spec.ts — одно правило, семь вводов · npm test -- phone")}</p>
      <table className="z-tbl j2-5"><tbody>
        <tr><th>{t("kirish", "ввод")}</th><th>{t("test nomi", "имя теста")}</th><th className="c">{t("kutilgan", "ожидалось")}</th><th className="c">isPhone</th><th className="c">test</th></tr>
        {ROWS5.map((r, i) => r[0] === 'g' ? <tr key={i} className="grp"><td colSpan={5}>{t(r[1], r[2])}</td></tr>
          : <tr key={i} className={r[5] ? '' : 'bad'}><td>{r[1]}</td><td>{r[2]}</td><td className="c">{r[3]}</td><td className="c">{r[5] ? r[4] : <b>{r[4]}</b>}</td><td className={'c ' + (r[5] ? 'p' : 'f')}>{r[5] ? '✓' : '✕'}</td></tr>)}
      </tbody></table>
      <span className="z-mut">Tests: 1 failed, 6 passed, 7 total</span>
    </div>
    <div className="z-card">
      <p className="z-h">{t("Qoida: ", "Правило: ")}<span className="zk">/^\+?\d{'{'}9,13{'}'}$/</span>{t(" — raqamlar soni", " — количество цифр")}</p>
      <div className="j2-nl">
        <div className="x">8<small>{t("qisqa", "коротко")}</small></div><div>9</div><div>10</div><div>11</div><div>12</div><div>13</div><div className="x">14<small>{t("uzun", "длинно")}</small></div><div className="x">␣<small>{t("probel", "пробел")}</small></div>
      </div>
      <span className="z-mut">{t("8 va 14 — chegaradan bitta tashqarida. Probel qoidada umuman yo'q: mijoz yozadi, regex bilmaydi.", "8 и 14 — на одну за границей. Пробела в правиле нет вовсе: клиент пишет, regex не знает.")}</span>
    </div>
  </div>;
}
const S5 = mkS(5, [{ f: ['a'] }, { f: ['b'] }, { f: ['c'], run: true }, { f: [], run: true, sum: true }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <>
    {!seg.run && <Code k="SPEC_PHONE_02" files={FILES(F.ph, F.phs)} active={F.phs} fresh={F.phs} ids={{ ...rngIds(4, 6, 'a'), ...rngIds(8, 15, 'b'), ...rngIds(17, 19, 'c') }} focus={seg.f} />}
    {seg.run && !seg.sum && <><CodePanel file="phone.spec.ts" lines={kod('SPEC_PHONE_02', rngIds(17, 19, 'c'), 17, 20)} focus={seg.f} /><Term title={t("VS Code terminali · npm test -- phone", "терминал VS Code · npm test -- phone")} lines={T5} er /></>}
    {seg.sum && <Each5 />}
  </>} />;
}

// ============================================================
//  6 · Ichida: tuzatish va «9 ta nol ham o'tadi» (kod-03-phone.ts · jest2v2-out/03, 04)
// ============================================================
const FIX6 = kod('PHONE_OLD', { 4: 'f' }, 1, 4, { 4: KOD.PHONE_NEW.lines[3].t });
const T6A = out('03', outFind('03', /^PASS/), outFind('03', /^Tests:/));
const T6B = out('04', outFind('04', /isPhone — qoida/), outFind('04', /^Tests:/));
// F-1109-06: xulosa — ikki karta o'rniga phone.ts 4-satr diff (kod manbasidan) va bir xil kirishlar eski/yangi qoidada (jest2v2-out/02–04)
function Diff6() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("phone.ts 4-satr — bitta o'zgarish", "phone.ts строка 4 — одно изменение")}</p>
      <div className="z-term"><span className="r">- {KOD.PHONE_OLD.lines[3].t}</span>{'\n'}<span className="g">+ {KOD.PHONE_NEW.lines[3].t}</span></div>
    </div>
    <div className="z-card">
      <p className="z-h">{t("Bir xil kirishlar — eski va yangi qoida", "Одни и те же вводы — старое и новое правило")}</p>
      <table className="z-tbl j2-6"><tbody>
        <tr><th>{t("kirish", "ввод")}</th><th className="c">trim()</th><th className="c">replace()</th><th /></tr>
        <tr><td>+998901234567</td><td className="c p">true</td><td className="c p">true</td><td /></tr>
        <tr><td>12345678 · 14 ta · abc · ''</td><td className="c">false</td><td className="c">false</td><td /></tr>
        <tr className="tor"><td>+998 90 123 45 67</td><td className="c f">false</td><td className="c p">true</td><td><span className="lab o">{t("qoida tor edi", "правило было узким")}</span></td></tr>
        <tr className="keng"><td>000000000</td><td className="c p">true</td><td className="c p">true</td><td><span className="lab b">{t("qoida keng — sizning qaroringiz", "правило широкое — ваше решение")}</span></td></tr>
      </tbody></table>
      <span className="z-mut">{t("npm test -- phone: 7 passed → «9 ta nol ham o'tadi» bilan 8 passed. Test qoidani tekshiradi; qoidaning o'zi to'g'rimi — buni siz hal qilasiz.", "npm test -- phone: 7 passed → с «9 нулей тоже проходит» 8 passed. Тест проверяет правило; верно ли само правило — решаете вы.")}</span>
    </div>
  </div>;
}
const S6 = mkS(6, [{ v: 'fix' }, { v: 'nol' }, { v: 'nol', rule: true }, { v: 'sum' }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <>
    {seg.v === 'fix' && <><CodePanel file="phone.ts" lines={FIX6} focus={['f']} /><Term title={t("VS Code terminali · npm test -- phone", "терминал VS Code · npm test -- phone")} lines={T6A} /></>}
    {seg.v === 'nol' && <><CodePanel file="phone.spec.ts" lines={kod('SPEC_PHONE_04', rngIds(22, 25, 'n'), 22, 26)} focus={seg.rule ? [] : ['n']} /><Term title={t("VS Code terminali · npm test -- phone", "терминал VS Code · npm test -- phone")} lines={T6B} /></>}
    {seg.rule && <div className="n2-warn">{t(<>Test <b>qoidani</b> tekshiradi. Qoidaning o'zi to'g'rimi (9 ta nol — telefonmi?) — bu <b>sizning qaroringiz</b>.</>, <>Тест проверяет <b>правило</b>. Верно ли само правило (9 нулей — телефон?) — это <b>ваше решение</b>.</>)}</div>}
    {seg.v === 'sum' && <Diff6 />}
  </>} />;
}

// ============================================================
//  7 · Amaliyot 1 — phone.ts va phone.spec.ts
// ============================================================
const P7 = mkPractice(7, [[], [0, 1], [2, 3], []], {
  code: [
    { step: 1, file: F.phs, lines: kod('SPEC_PHONE_02') },
    { step: 2, file: F.ph, lines: kod('PHONE_NEW') },
    { step: 3, file: F.phs, lines: kod('SPEC_PHONE_04') },
  ],
});
function ScreenP7(p) { return <Practice p={p} S={P7.S} steps={P7.steps} trouble={P7.trouble} proof={P7.proof} code={P7.code} tree={FILES(F.ph, F.phs)} />; }

// ============================================================
//  8 · place — uch xato, ikki xil joy (order.service.ts 24–45, jest2-start)
// ============================================================
function Flow8({ hl }) {
  return <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">{t("place() — xato qayerda otiladi", "place() — где бросается ошибка")}</div>
    <div className="fl-grid">
      <div className="fl-box" style={{ '--c': T.blue }}><small>place(user, cart)</small><b>{t("funksiya chaqirildi", "функция вызвана")}</b></div>
      <div className="fl-tests">
        <div className="fl-row"><span className="fl-ar">→</span><div className={`fl-box${hl === 'sync' ? ' hl' : ''}`} style={{ '--c': JC.err }}><small>{t("25–26-satr · darhol, funksiyaning o'zida", "строки 25–26 · сразу, в самой функции")}</small><b>throw «Telefon raqami yo'q» · «Savat bo'sh»</b></div><div className="fl-v bad">{t("sinxron xato", "синхронная ошибка")}</div></div>
        <div className="fl-row"><span className="fl-ar">→</span><div className={`fl-box${hl === 'async' ? ' hl' : ''}`} style={{ '--c': JC.edge }}><small>{t("27-satr: transaction(async …) → 37-satr", "строка 27: transaction(async …) → строка 37")}</small><b>throw «Kolonka: omborda faqat 1 ta qoldi»</b></div><div className="fl-v bad">{t("promise xatosi", "ошибка promise")}</div></div>
      </div>
    </div>
  </div>;
}
const S8 = mkS(8, [{ v: 'code', f: ['s'] }, { v: 'code', f: ['a'] }, { v: 'flow', hl: 'sync' }, { v: 'flow', hl: 'async', sum: true }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <>
    {seg.v === 'code' && <Code k="ORDER_PLACE" files={FILES()} active={F.ord} ids={{ 25: 's', 26: 's', 36: 'a', 37: 'a', 38: 'a' }} focus={seg.f} from={24} to={38} />}
    {seg.v === 'flow' && <Flow8 hl={seg.hl} />}
    {/* F-1120-02 (M51): xulosada matnli qoida o'rniga darsning rasmi — order moduli, ikki xil xato va ikki xil expect (order.service.ts 25–26 · 27→37) */}
    {seg.sum && <div className="mk-light" style={{ padding: 12 }}><BotMap loc={DB_ALL} tgSub="phone.ts" on={['order', 'orders', 'products']} tx="rollback" jest={{ steps: [['toThrow()', 'ok'], ['rejects.toThrow()', 'ok']], res: 'pass' }} ro={['order.service.ts:25', t("25–26 darhol → <b>.toThrow()</b> · 27→37 transaction ichida → <b>await … .rejects.toThrow()</b>", "25–26 сразу → <b>.toThrow()</b> · 27→37 внутри transaction → <b>await … .rejects.toThrow()</b>")]} max={1} tag={t("Xatoni sinashdan oldin qayerda otilishini aniqlang — darholmi, promise ichidami", 'Прежде чем проверять ошибку — где она бросается: сразу или внутри promise')} /></div>}
  </>} />;
}

// ============================================================
//  9 · Mock: baza o'rniga soxta manager (kod-05-order.service.spec.ts 8–31)
// ============================================================
const S9 = mkS(9, [{ f: ['m'], to: 16 }, { f: ['d'], to: 16 }, { f: ['t'], to: 31 }, { f: ['r'], from: 44, to: 50 }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <>
    <Code k="SPEC_ORDER_05" files={FILES(F.ph, F.phs, F.ors)} active={F.ors} fresh={F.ors} ids={{ ...rngIds(8, 14, 'm'), 15: 'd', ...rngIds(23, 29, 't'), ...rngIds(45, 50, 'r') }} focus={seg.f} from={seg.from || 1} to={seg.to} />
    {seg.f[0] === 'r' && <div className="mk-rule"><code>mockResolvedValue</code>{t(" — bu testda ", " — в этом тесте ")}<code>findOne</code>{t(" aynan shu mahsulotni qaytaradi: omborda ", " возвращает именно этот товар: на складе ")}<b>1 ta</b>{t(". Baza yo'q, kod haqiqiy.", ". Базы нет, код настоящий.")}</div>}
  </>} />;
}

// ============================================================
//  10 · toThrow va rejects.toThrow — to'rt test yashil (kod-05 33–67 · jest2v2-out/05)
// ============================================================
const T10 = out('05', outFind('05', /^PASS/), outFind('05', /^Tests:/));
const S10 = mkS(10, [{ f: ['s'], to: 42 }, { f: ['a'], from: 44, to: 55 }, { f: ['h'], from: 57, to: 67, run: true }, { run: true, sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {!seg.sum && <CodePanel file="order.service.spec.ts" lines={kod('SPEC_ORDER_05', { ...rngIds(34, 38, 's'), ...rngIds(40, 42, 's'), ...rngIds(51, 54, 'a'), 65: 'h', 66: 'h' }, seg.from || 33, seg.to)} focus={seg.f} />}
    {seg.run && <Term title={t("VS Code terminali · npm test -- order.service", "терминал VS Code · npm test -- order.service")} lines={T10} />}
    {seg.sum && <div className="pg-two">
      <Card c={JC.err} h={t("Sinxron xato", "Синхронная ошибка")}><p><code>expect(() =&gt; service.place(…)).toThrow('…')</code>{t(" — funksiya o'raladi, Jest o'zi chaqiradi", " — функция обёрнута, Jest вызывает её сам")}</p></Card>
      <Card c={JC.edge} h={t("Promise xatosi", "Ошибка promise")}><p><code>await expect(service.place(…)).rejects.toThrow('…')</code>{t(" — darhol chaqiriladi, promise kutiladi", " — вызывается сразу, promise ожидается")}</p></Card>
    </div>}
  </>} />;
}

// ============================================================
//  11 · Buzamiz: toThrow promise xatosida — natija yo'q (kod-07 · jest2v2-out/07)
// ============================================================
const T11 = out('07');
const CAUSE11 = ["toThrow o'ramni chaqirdi — place() promise qaytardi", "Shu paytda xato yo'q → Jest «test o'tdi» deb hisobladi", "Xato keyin, promise ichida otildi — hech kim ushlamadi", 'Node butun jarayonni to\'xtatdi: PASS ham, FAIL ham yo\'q'];
function Cause({ items, on, bad }) {
  return <div className="cause">{items.map((x, i) => <div key={i} className={`${i < on ? 'on' : ''}${bad === i ? ' bad' : ''}`}><i>{i + 1}</i><span>{x}</span></div>)}</div>;
}
// F-1120-02 (M52): 1-segment (x) — mentor to'g'ri testdagi 51-satrni (await … .rejects) o'zi bosadi → test sinxron toThrow shakliga o'tadi
const ACT11 = kod('SPEC_ORDER_10', { 51: 'x', 52: 'x', 53: 'x' }, 44, 55).map((l) => (l.n === 51 ? { ...l, h: '<span class="n1-act" data-act="1">' + l.h + '</span>' } : l));
const S11 = mkS(11, [{ v: 'act' }, { v: 'code' }, { v: 'run' }, { v: 'cause' }, { v: 'cause', sum: true }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={(b) => <Scene11 b={b} />} />;
}
// Qadamlar: 0 bosing · 1 toThrow shakli (natija «?») · 2 jarayon quladi, bo'laklar 1·2 · 3 sabab · 4 xulosa
function Scene11({ b }) {
  const { seg, beat } = b;
  const act = useAct(b);
  const v = beat === 0 ? (act.hit ? 'code' : 'act') : seg.v;
  const broken = v !== 'act';
  const mini = <N1Mini><FlowMini tag={t("Test place() ni chaqiradi — xato promise ichida", 'Тест вызывает place() — ошибка внутри promise')}
    boxes={[[t('test · 51-satr', 'тест · строка 51'), broken ? '() => … .toThrow' : 'await … .rejects', broken ? 'bad' : ''], ['place(user, cart)', t('Promise qaytaradi', 'возвращает Promise'), ''], [t('Jest natijasi', 'Результат Jest'), beat >= 2 ? t("PASS/FAIL yo'q", 'нет PASS/FAIL') : '?', beat >= 2 ? 'bad' : '']]}
    res={broken ? [beat >= 2 ? t('Node.js v24.18.0 — jarayon quladi', 'Node.js v24.18.0 — процесс упал') : '?', 'bad'] : null} pins={beat === 2 ? { 0: 1, 2: 2 } : {}} /></N1Mini>;
  return <>
    {v !== 'cause' && <Ide files={compact(FILES(F.ph, F.phs, F.ors), F.ors)} active={F.ors}>
      {v === 'act' && <div onClick={act.onClick}><CodePanel file="order.service.spec.ts" lines={ACT11} focus={['x']} /></div>}
      {v === 'code' && <CodePanel key="c" file={t("order.service.spec.ts · buzilgan", "order.service.spec.ts · сломан")} lines={kod('SPEC_ORDER_07', { 51: 'x', 52: 'x', 53: 'x' }, 44, 55)} focus={['x']} />}
      {v === 'run' && <CodePanel key="r" file={t("order.service.spec.ts · buzilgan", "order.service.spec.ts · сломан")} lines={kod('SPEC_ORDER_07', { 51: 'x' }, 51, 53)} focus={['x']} marks={beat === 2 ? { 0: 'n1-p1' } : {}} />}
      {mini}
    </Ide>}
    {v === 'run' && <Term title={t("VS Code terminali · natija yo'q", "терминал VS Code · результата нет")} lines={T11} er marks={{ [T11.findIndex((l) => /Node\.js v/.test(l.h || ''))]: 'n1-p2' }} />}
    {v === 'cause' && <><Term title={t("VS Code terminali · natija yo'q", "терминал VS Code · результата нет")} lines={T11} er /><Cause items={CAUSE11} on={4} bad={3} /></>}
  </>;
}
