
// ============================================================
//  17 · AI panel yozdi — ikki to'plam (ws1v2-ai)
// ============================================================
const AIG = (n, k, re) => (KOD.AI[n][k] || '').split('\n').filter((l) => re.test(l));
// F-1109-06: xulosa — ikki iqtibos kartasi o'rniga taqqoslash jadvali (ws1v2-ai/XULOSA.md) va xulosa qoidasi
function Cmp17() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Prompt: «jonli buyurtmalar paneli, sahifa o'zi yangilansin, WebSocket bilan» — ishorasiz", "Промпт: «живая панель заказов, страница обновляется сама, через WebSocket» — без подсказок")}</p>
      <table className="z-tbl w1-a17"><tbody>
        <tr><th /><th>1-AI</th><th>2-AI</th></tr>
        <tr><td>{t("Hajm", "Объём")}</td><td>{t("17 fayl, +855 satr", "17 файлов, +855 строк")}</td><td>{t("15 fayl, +512 satr", "15 файлов, +512 строк")}</td></tr>
        <tr className="w"><td>{t("Transport", "Транспорт")}</td><td>{t("xom ws, socket.io emas", "голый ws, не socket.io")} <span className="f">{t("o'quvchi darsi socket.io", "урок ученика — socket.io")}</span></td><td>{t("xuddi shu", "то же")}</td></tr>
        <tr><td>{t("Qayta ulanish", "Переподключение")}</td><td>{t("o'zi qo'lda yozgan · 30 s ping", "написал сам вручную · ping 30 s")}</td><td>{t("o'zi qo'lda yozgan", "написал сам вручную")}</td></tr>
        <tr className="w"><td>Token</td><td>{t("o'zi qo'shdi", "добавил сам")} <span className="g">{t("yaxshi", "хорошо")}</span>{t(" — lekin URL'da ?token=", " — но в URL ?token=")} <span className="f">{t("loglarda qoladi", "остаётся в логах")}</span></td><td>{t("xuddi shu", "то же")}</td></tr>
        <tr className="w"><td>{t("Hodisada", "В событии")}</td><td>{t("butun buyurtma, telefon bilan", "весь заказ, с телефоном")} <span className="f">{t("har panelga", "в каждую панель")}</span></td><td>{t("xuddi shu", "то же")}</td></tr>
        <tr className="w"><td>{t("Mavjud kod", "Существующий код")}</td><td>{t("order.service.spec.ts o'zgardi (+4 test)", "order.service.spec.ts изменён (+4 теста)")}</td><td>{t("o'zgardi (+3 test)", "изменён (+3 теста)")}</td></tr>
        <tr className="w"><td>{t("O'z sinovi", "Своя проверка")}</td><td>{t("mock baza · 11/11", "mock-база · 11/11")} <span className="f">{t("Postgres yo'q", "нет Postgres")}</span></td><td>{t("mock servis · 10/10", "mock-сервис · 10/10")} <span className="f">{t("Postgres yo'q", "нет Postgres")}</span></td></tr>
      </tbody></table>
    </div>
    <div className="z-rule">{t("Ikkalasi ishonchli ko'rinadi, testlari yashil — lekin ", "Оба выглядят надёжно, тесты зелёные — но ")}<b>{t("bazasiz sinagan", "проверяли без базы")}</b>{t(". Keyingi ekranda haqiqiy bazada sinaymiz.", ". На следующем экране проверим на настоящей базе.")}</div>
  </div>;
}
const S17 = mkS(17, [{ v: 'stage' }, { v: 'prompt' }, { v: 'cards' }, { v: 'quote' }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <>
    {(seg.v === 'stage' || seg.v === 'prompt') && <div className="c1-stage">
      <div style={{ '--c': T.ink3, opacity: 0.45 }}><h4>{t("1–4-bosqich · siz", "Этапы 1–4 · вы")}</h4><p>{t("gateway, token, hodisa, panel, uch holat", "gateway, токен, событие, панель, три состояния")}</p></div>
      <div style={{ '--c': C1.ai }}><h4>{t("5-bosqich · AI yozadi, siz qabul qilasiz", "Этап 5 · пишет AI, вы принимаете")}</h4><p>{t("bitta prompt → ikki panel → haqiqiy bazada sinov", "один промпт → две панели → проверка на настоящей базе")}</p></div>
    </div>}
    {seg.v === 'prompt' && <div style={{ marginTop: 10 }}><AiReply who={t("Prompt — ikkala AI'ga bir xil", "Промпт — одинаковый для обоих AI")} prompt={KOD.PROMPT1} tag={t("ishorasiz: socket.io, token, hodisa tarkibi yo'q", "без подсказок: нет socket.io, токена, состава события")} /></div>}
    {seg.v === 'cards' && <div className="pg-two">
      <AiReply who={t("1-AI (kuchli model)", "1-й AI (сильная модель)")} said={<>{KOD.AI.ai1.stat}{t(" · xom ", " · голый ")}<code>ws</code> (<code>@nestjs/platform-ws</code>) · <code>ws://…/admin/ws?token=…</code>{t(" · ulanganda 30 ta (snapshot), keyin ", " · при подключении 30 (snapshot), потом ")}<code>order/created</code>, <code>order/updated</code> — <b>{t("butun buyurtma", "весь заказ")}</b> · <code>OrderService</code>{t(" va uning testi o'zgardi · ", " и его тест изменены · ")}<code>timingSafeEqual</code>, <code>textContent</code></>} />
      <AiReply who={t("2-AI (kuchsizroq model)", "2-й AI (модель слабее)")} said={<>{KOD.AI.ai2.stat}{t(" · xuddi shu yo'l: xom ", " · тот же путь: голый ")}<code>ws</code> · <code>/ws/orders?token=…</code> · snapshot 50 ta · <code>created</code> / <code>updated</code>{t(" — butun buyurtma · ", " — весь заказ · ")}<code>OrderService</code>{t(" va testi o'zgardi", " и тест изменены")}</>} />
    </div>}
    {seg.v === 'quote' && <Cmp17 />}
  </>} />;
}

// ============================================================
//  18 · AI panellari haqiqiy bazada (ws1v2-ai/*/01–04)
// ============================================================
const AIROW = (n) => {
  const tl = KOD.AI[n]['01'] || '', s = KOD.AI[n]['02'] || '', c = KOD.AI[n]['03'] || '';
  return [(/chiqish kodi: 0/.test(tl) ? '✓' : '✗'), (tl.match(/Tests:\s+(\d+ passed, \d+ total)/) || [])[1] || '?', (s.match(/NATIJA: (\d+\/\d+)/) || [])[1] || '?', (c.match(/close (\d+ [\w ]+)/) || [])[1] || '?'];
};
const T18 = (KOD.AI.ai2['04'] || '').split('\n').filter((l) => /xabar|open/.test(l)).map((l) => ({ h: liveLine(l.length > 190 ? l.slice(0, 190) + '…' : l) }));
const FOUR18 = ["Qaysi kutubxona — o'quvchi darsidagi socket.io'mi?", "Token qayerda — manzilda (?token=) emasmi?", 'Hodisada nima bor — va uni kim oladi?', "Mavjud fayllardan nima o'zgardi — git diff --stat, testlar"];
const S18 = mkS(18, [{ v: 'tab' }, { v: 'log' }, { v: 'vs' }, { v: 'four' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {seg.v === 'tab' && <table className="c1-res"><thead><tr><th /><th>tsc</th><th>npm test</th><th>smoke (PostgreSQL)</th><th>{t("tokensiz", "без токена")}</th></tr></thead>
      <tbody>{[['1-AI', 'ai1'], ['2-AI', 'ai2']].map(([h, n]) => <tr key={n}><td>{h}</td>{AIROW(n).map((x, i) => <td key={i} className={i < 3 ? 'ok' : ''}>{x}</td>)}</tr>)}</tbody></table>}
    {seg.v === 'log' && <Term title={t("xom ws klienti · 2-AI · token bilan, bot buyurtma oldi, admin tasdiqladi", "голый клиент ws · 2-й AI · с токеном, бот получил заказ, админ подтвердил")} lines={T18} />}
    {seg.v === 'vs' && <div className="pg-two">
      <div className="c1-state" style={{ '--c': T.green }}><span className="belgi">{t("Bizniki", "Наш")}</span><code>{"io({ auth: { token } })"}</code><p>{t("manzil toza — token ulanish ma'lumotida", "адрес чистый — токен в данных подключения")}</p><code>{'order-changed { orderId, reason }'}</code><p>{t("ma'lumot — token bilan GET'da", "данные — в GET с токеном")}</p></div>
      <div className="c1-state" style={{ '--c': T.accent }}><span className="belgi">AI</span><code>{AIG('ai2', '04', /ulanmoqda.*token=/)[0] ? AIG('ai2', '04', /ulanmoqda.*token=/)[0].replace(/^\S+ ulanmoqda… /, '') : 'ws://…/ws/orders?token=…'}</code><p>{t("token manzilda — tarix va loglarga yoziladi", "токен в адресе — пишется в историю и логи")}</p><code>created {'{ id, customer, phone, items… }'}</code><p>{t("har hodisada mijoz telefoni", "в каждом событии телефон клиента")}</p></div>
    </div>}
    {seg.v === 'four' && <div className="mk-light" style={{ padding: 16 }}><div className="mk-tag">{t("AI real vaqt kodini qabul qilish — to'rt savol", "Приём кода реального времени от AI — четыре вопроса")}</div><div className="mk-plan">{FOUR18.map((x, i) => <div key={i} className="hl" style={{ animation: `mk-up .4s ${i * 0.1}s ease both` }}><b>0{i + 1}</b><span>{x}</span></div>)}</div></div>}
  </>} />;
}

// ============================================================
//  19 · Tekshiruv 4 — token URL'da
// ============================================================
function Screen19(p) {
  const ai = AIG('ai2', '04', /ulanmoqda.*token=/)[0] || '';
  const our = outPick('04', (l) => /ulanmoqda…/.test(l))[0];
  return MC(p, 19, {
    above: <div style={{ display: 'grid', gap: 8 }}><Term title={t("xom ws klienti · 2-AI", "голый клиент ws · 2-й AI")} lines={jt(ai)} /><CodePanel file={t("admin.html · bizniki", "admin.html · наш")} lines={kod('HTML', { [H.ul + 2]: 'i' }, H.ul + 2, H.ul + 2)} focus={['i']} /></div>,
    after: <div className="pg-two"><Term title={t("AI — token manzilda", "AI — токен в адресе")} lines={jt(ai)} er /><Term title={t("bizniki — manzil toza", "наш — адрес чистый")} lines={our ? [our] : []} /></div>,
  });
}

// ============================================================
//  20 · Amaliyot 3 — AI'ga aniq prompt (MD 20-ekrandan aynan)
// ============================================================
const PROMPT20 = KOD.PROMPT2.split('. ').map((s, i, a) => ({ h: escH(s + (i < a.length - 1 ? '.' : '')) }));
const P20 = mkPractice(20, [[], [0, 1], [2, 3], []], { code: [{ step: 0, file: 'prompt.txt', lines: PROMPT20 }] });
function ScreenP20(p) { return <Practice p={p} S={P20.S} steps={P20.steps} trouble={P20.trouble} proof={P20.proof} code={P20.code} tree={['prompt.txt', F.html, F.gw, F.ctrl]} />; }

// ============================================================
//  21 · m10-02 xaritasi (WebSocketBasicsLesson.jsx — SCREEN_META 20)
// ============================================================
const BLOK21 = [['1 Kirish', 's0 ekran yangilanmaydi · s1 reja', "so'rov–javobda server gapirmaydi (2-ekran)"], ['2 Ulanish', "s2–s4 yo'l yopiq / ochiq · s5–s6 konvert · s7–s8 token", "tokensiz — bir lahza connect (5) · return (6)"], ['3 Tinglovchi', 's9 kod oynasi', '() => yukla qavssiz (11)'], ['4 Holat', "s10–s11 uch belgi, uzilishda hodisa yo'qoladi", '45 s (15)'], ['5 Sxema va amaliyot', "s12–s14 sxema · A1 o'z repo + Render · A2 README", 'Render uxlashi, telefon — sinfda']];
const S21 = mkS(21, [{ v: 'cards' }, { v: 'cards', rule: true }, { v: 'blok' }, { v: 'teg' }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m10-02 (20 ekran)", "Ученик · m10-02 (20 экранов)")} hl><p><b>Maydon Jamoa</b>{t(" — ikki telefon, biri eski «8 / 10» · yopiq va ochiq yo'l · konvert ", " — два телефона, на одном старое «8 / 10» · закрытая и открытая дорога · конверт ")}<code>{'oyin-ozgardi { oyinId, sabab }'}</code>{t(" (son yo'q) · token bilan ulanish · tinglovchi · uch belgi · real vaqt sxemasi · amaliyot: ", " (без числа) · соединение с токеном · слушатель · три знака · схема реального времени · практика: ")}<code>maydon-jamoa</code> + Render</p></Card>
      <Card c={T.accent} h={t("Siz · bugun", "Вы · сегодня")}><p>{t("OrderBotNest panel · gateway · ", "Панель OrderBotNest · gateway · ")}<code>order-changed</code>{t(" · uch holat · ping 45 s · AI", " · три состояния · ping 45 с · AI")}</p>{seg.rule && <p style={{ marginTop: 6 }}><b>{t("Qoidalar bir xil:", "Правила те же:")}</b>{t(" socket.io, token ulanishda, konvert, qayta so'rash, uch belgi.", " socket.io, токен при соединении, конверт, повторный запрос, три знака.")}</p>}</Card>
    </div>}
    {seg.v === 'blok' && <table className="pg-dict"><tbody>{BLOK21.map(([a, b, c]) => <tr key={a}><td><b>{a}</b></td><td>{b}</td><td>{c}</td></tr>)}</tbody></table>}
    {seg.v === 'teg' && <div className="pg-two"><Card c={T.ink3} h="m12-dars-02-done"><p>{t("ulanish bor, ", "соединение есть, ")}<b>{t("hodisa yo'q", "события нет")}</b>{t(" — son o'zi o'zgarmaydi (xato emas)", " — число само не меняется (не ошибка)")}</p></Card><Card c={T.green} h="m12-dars-03-done"><p>{t("hodisa bor — ", "событие есть — ")}<code>oyin-ozgardi</code>{t(", ilova ", ", приложение заново запрашивает ")}<code>GET /oyinlar</code>{t(" ni qayta so'raydi", " ")}</p></Card></div>}
  </>} />;
}

// ============================================================
//  22 · O'quvchi so'zlari va real vaqt sxemasi (README'lar, ulanish.ts)
// ============================================================
const DICT22 = [["yopiq yo'l / ochiq yo'l", "so'rov–javob / doimiy ulanish"], ['konvert', 'hodisa (oyin-ozgardi · bizda order-changed) — ichida son yo\'q'], ['belgi', 'ulanish holati (connected, active)'], ['tinglovchi', 'ulanish.on(…)'], ["qayta so'rash", 'GET /oyinlar · bizda GET /admin/orders']];
const MJ_ON = lineN('MJ_ULANISH', /ulanish\?\.on\('oyin-ozgardi'/), MJ_CON = lineN('MJ_ULANISH', /ulanish\.on\('connect'/);
const S22 = mkS(22, [{ v: 'dict' }, { v: 'ob' }, { v: 'mj' }, { v: 'ul' }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <>
    {seg.v === 'dict' && <table className="pg-dict"><tbody>{DICT22.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>}
    {seg.v === 'ob' && <CodePanel file="OrderBotNest · README.md · ws1-done" lines={kod('README', {}, null, null)} />}
    {seg.v === 'mj' && <CodePanel file="maydon-jamoa · README.md · m12-dars-03-done" lines={kod('MJ_README', {}, null, null)} />}
    {seg.v === 'ul' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file="maydon-jamoa · mobil/src/ulanish.ts" lines={kod('MJ_ULANISH', { [MJ_CON]: 'c', [MJ_ON]: 'o' }, MJ_CON, MJ_ON + 2)} focus={['c', 'o']} />
      <div className="n2-warn">{t(<>Tinglovchi <code>connect</code> <b>ichida</b></>, <>Слушатель <b>внутри</b> <code>connect</code></>)}{t(" qo'shiladi — har qayta ulanishda yana bittasi. Hozir ishlaydi; WebSocket-2 da buzib ko'ramiz. Sinfda tuzatmang — belgilang.", " добавляется — при каждом переподключении ещё один. Сейчас работает; на WebSocket-2 сломаем. В классе не исправляйте — отметьте.")}</div></div>}
  </>} />;
}

// ============================================================
//  23 · Sinfdagi holatlar va o'quvchi savollari
// ============================================================
const CARDS23 = [['Belgi bir lahza yashil, keyin qizil', 'io server disconnect', 'token — qayta kirish'], ['Belgi sariq, keyin yashil', 'transport close → connect', 'server qayta yondi — normal'], ["Uchish rejimida belgi o'zgarmadi", '45 s gacha ping timeout', 'kuting'], ["Son o'zi o'zgarmadi", "hodisa yo'q (m12-dars-02)", 'xato emas — keyingi teg'], ["Birinchi ulanish cho'zildi", 'Render uxlagan', 'bir daqiqa kuting'], ['Terminalda «null» / «panel ulandi» rad etilganda', "return yo'q", '6-ekran']];
const QA23 = [
  ['«WebSocket va socket.io bir narsami?»', "socket.io — kutubxona: imkon bo'lsa WebSocket orqali, bo'lmasa polling; qayta ulanish va ping tayyor."],
  ["«Nega hodisada son yo'q?»", "Ikki kishi birdan qo'shilsa adashmasin — son har doim Backend'dan."],
  ['«Uzilgan paytdagi hodisa keyin keladimi?»', "Yo'q: socket.io eski hodisani saqlamaydi; qayta ulanganda qayta so'rash kerak — keyingi dars."],
  ['«Token muddati tugasa?»', "Keyingi ulanishda Backend yopadi — «Ulanmagan», qayta kirish."],
];
function QA({ items }) {
  const [open, setOpen] = useState(-1);
  return <div className="pg-qa">{items.map(([q, a], i) => <button key={q} onClick={() => setOpen(open === i ? -1 : i)}><b>{q}</b>{open === i && <p>{a}</p>}</button>)}</div>;
}
const S23 = mkS(23, [{ v: 'a' }, { v: 'b' }, { v: 'qa' }, { v: 'qa' }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {(seg.v === 'a' || seg.v === 'b') && <div className="pg-three">{CARDS23.slice(seg.v === 'a' ? 0 : 3, seg.v === 'a' ? 3 : 6).map(([h, x, y], i) => <Card key={h} c={T.accent} h={`${(seg.v === 'a' ? 1 : 4) + i} · ${h}`}><p><code>{x}</code></p><p style={{ marginTop: 4 }}>→ {y}</p></Card>)}</div>}
    {seg.v === 'qa' && <><div className="mk-tag" style={{ margin: 0 }}>{t("O'quvchi so'rasa — bosib oching", "Если ученик спросит — нажмите, чтобы открыть")}</div><QA items={QA23} /></>}
  </>} />;
}

// ============================================================
//  24 · O'z-sinov — 8 savol (MD 24, FINAL)
// ============================================================
const FINAL = MDT[24].final;
function Screen24(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = LANG === 'ru' ? (!st.showResult ? RS('FIN_INTRO')
      : sc >= 6 ? 'Ваш результат сохранён: ' + sc + ' из восьми. Урок усвоен, нажмите «Далее».'
        : 'Хорошо, одну ошибку вы разобрали. Вернитесь и к экранам остальных красных вопросов. Когда будете готовы, нажмите кнопку «Пройти тест заново».')
      : !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: so'rov–javob, token, return, hodisa tarkibi, tinglovchi, uch holat, ping va AI'ning tokeni. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
      : sc >= 6
        ? "Natijangiz saqlangan: sakkizdan " + ['nol', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz'][sc] + ". Dars o'zlashtirilgan, Davom bosing."
        : "Yaxshi, bir xatoyingizni ko'rib chiqdingiz. Qolgan qizil savollarning ekranlariga ham qayting. Tayyor bo'lgach, Sinovni qayta topshirish tugmasini bosing.";
    return p.review ? [] : [{ id: 'intro', text: voice(text), trigger: 'on_mount' }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const audio = useAudio(segs);
  const sfx = useSfx();
  const [i, setI] = useState(st.i || 0);
  const [res, setRes] = useState(st.res || []);
  const [attempt, setAttempt] = useState(st.attempt || 1);
  const [showResult, setShowResult] = useState(!!st.showResult);
  const q = FINAL[i];
  const picked = res[i] ? res[i].picked : null;
  const score = res.filter((x) => x && x.correct).length;
  const finished = res.filter(Boolean).length === FINAL.length;
  const save = (patch) => p.onAnswer({ type: 'final', i, res, attempt, showResult, score, total: FINAL.length, ...patch });
  const pick = (k) => {
    if (picked !== null) return;
    audio.triggerEvent('option_picked');
    const r = [...res]; r[i] = { picked: k, correct: k === q.c }; setRes(r);
    if (k === q.c) sfx.playCorrect(); else sfx.playWrong();
    const sc = r.filter((x) => x && x.correct).length; save({ res: r, score: sc });
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi ekran o'zgarmayapti desa, avval belgiga, keyin server terminaliga qaraysiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
  };
  const next = () => { if (i < FINAL.length - 1) { setI(i + 1); save({ i: i + 1 }); } else { setShowResult(true); save({ showResult: true }); } };
  const retake = () => { setRes([]); setI(0); setShowResult(false); setAttempt(attempt + 1); save({ res: [], i: 0, showResult: false, attempt: attempt + 1, score: 0 }); };
  return (
    <Stage kicker={t("O'z-sinov", 'Самопроверка')} idx={p.idx} total={p.total} audio={audio} onBack={p.onBack} onNext={p.onNext} onRestart={p.onRestart} nextReady={finished && showResult} nextDisabled={!(finished && showResult)} lockHint={!finished ? t('Savollarga javob bering', 'Ответьте на вопросы') : t('Natijani oching', 'Откройте результат')}>
      <div className="mk-body" style={{ gridTemplateColumns: '1fr', maxWidth: 980, width: '100%', margin: '0 auto' }}>
        <div className="mk-say mc" style={{ overflow: 'auto', paddingRight: 4 }}>
          {showResult ? (<>
            <p className="mk-eyebrow">{t("O'z-sinov · natija", 'Самопроверка · результат')}{attempt > 1 ? t(` · ${attempt}-urinish`, ` · попытка ${attempt}`) : ''}</p>
            <h2 className="mk-title mc-q" style={{ fontSize: 'clamp(22px,1.9vw,26px)' }}>{score} / {FINAL.length} — {score >= 6 ? t("dars o'zlashtirildi", 'урок усвоен') : t("yana bir ko'rib chiqing", 'посмотрите ещё раз')}</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {FINAL.map((f, k) => <div key={k} className="mk-card" style={{ display: 'flex', gap: 12, alignItems: 'center', borderColor: res[k] && res[k].correct ? T.green : T.accent }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: res[k] && res[k].correct ? T.green : T.accent, minWidth: 22 }}>{res[k] && res[k].correct ? '✓' : '✗'}</span>
                <span style={{ flex: 1, fontSize: 14 }}>{f.q}</span>
                {res[k] && !res[k].correct && p.onGoto && <button className="mk-btn soft sm" onClick={() => p.onGoto(f.s - 1)}>{t(`${f.s}-ekran`, `экран ${f.s}`)}</button>}
              </div>)}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, flexWrap: 'wrap' }}>
              {score < 6 && <button className="mk-btn ghost" onClick={retake}>{t('Sinovni qayta topshirish', 'Пройти тест заново')}</button>}
              <span style={{ color: T.ink2, fontSize: 14 }}>{t('Ekranga qaytib «Davom» bossangiz, shu natijaga qaytasiz.', 'Если вернётесь к экрану и нажмёте «Далее», попадёте обратно к этому результату.')}</span>
            </div>
          </>) : (<>
            <p className="mk-eyebrow">{t("O'z-sinov", 'Самопроверка')} · {i + 1} / {FINAL.length} · {t("bitta urinish · to'g'ri:", 'одна попытка · верно:')} {score}</p>
            <h2 className="mk-title mc-q">{q.q}</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {q.o.map((o, k) => { let cls = 'mk-opt'; if (picked !== null) { if (k === q.c) cls += ' ok'; else if (k === picked) cls += ' bad'; else cls += ' off'; } return <button key={k} className={cls} disabled={picked !== null} onClick={() => pick(k)}><span className="l">{String.fromCharCode(65 + k)}</span><span>{o}</span></button>; })}
            </div>
            {picked !== null && <div className="mk-fb" style={{ '--c': picked === q.c ? T.green : T.accent, '--bg': picked === q.c ? '#E3F5EC' : '#FFF0EB' }}><b>{picked === q.c ? t("To'g'ri", 'Верно') : t("Noto'g'ri — to'g'risi yashil", 'Неверно — правильный ответ зелёный')}</b><span>{q.e}</span></div>}
            {picked !== null && <div style={{ marginTop: 14 }}><button className="mk-btn ready" onClick={next}>{i < FINAL.length - 1 ? t('Keyingi savol →', 'Следующий вопрос →') : t("Natijani ko'rish →", 'Посмотреть результат →')}</button></div>}
          </>)}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  25 · Yakun (M13, M14, M30)
// ============================================================
const SUM25 = [
  { k: 'q', t: "So'rov–javobda server faqat so'ralganda javob beradi; jonli panel uchun doimiy ulanish — socket.io: avval polling, keyin websocket, HTTP bilan bitta portda", st: ['q'] },
  { k: 'gw', t: "Gateway: handleConnection da client.handshake.auth.token — noto'g'ri bo'lsa disconnect() va return (aks holda log yolg'on); token bitta joyda (isAdminToken), bo'sh token ham rad", st: ['gw'] },
  { k: 'ev', t: "Hodisa tranzaksiya tugagach: await place(…) → orderChanged(id, 'new'); ichida faqat { orderId, reason } — panel GET /admin/orders ni token bilan qayta so'raydi (konvert)", st: ['ev'] },
  { k: 'pn', t: "Panel: io({ auth: { token } }) (token manzilda emas), tinglovchi () => yukla() (qavs bilan), matn esc() bilan", st: ['ev'] },
  { k: 'st', t: "Uch holat: ulangan · ulanmoqda (active=true: transport close, xhr poll error, ping timeout ≤ 45 s) · ulanmagan (active=false: io server disconnect — token). Server yongach klient o'zi ulanadi", st: ['st'] },
  { k: 'ai', t: "AI real vaqt kodiga to'rt savol: kutubxona (socket.io'mi) · token qayerda · hodisada nima, kim oladi · mavjud fayllardan nima o'zgardi; haqiqiy baza bilan tekshiring (npm run smoke -- live)", st: ['ai'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (BotMap + admin paneli); har band rasmning o'z qismini yoritadi.
// Panel belgilari — admin.html dagi haqiqiy yozuvlar (Ulangan · Ulanmoqda… · Ulanmagan), shuning uchun tarjima qilinmaydi
const PNL = (steps, res, badge) => ({ get name() { return t('Admin panel', 'Админ-панель'); }, steps, res, badge });
const MAP25 = {
  q: { on: ['telegram'], jest: PNL([['GET /admin/orders', ''], ['socket.io', 'ok']], 'pass', 'Ulangan') },
  gw: { on: ['telegram'], jest: PNL([['token', 'ok'], ['disconnect() · return', 'ok']], 'pass', 'Ulangan') },
  ev: { on: LIVE_ON, chat: CHAT_LIVE, jest: PNL([['orderChanged', 'ok'], ['order-changed', 'ok']], 'pass', 'Ulangan') },
  pn: { on: LIVE_ON, chat: CHAT_LIVE, jest: PNL([["io({ auth: { token } })", 'ok']], 'pass', 'Ulangan') },
  st: { on: ['telegram'], jest: PNL([['transport close', 'bad'], ['xhr poll error', 'bad']], '?', 'Ulanmoqda…') },
  ai: { on: LIVE_ON, chat: CHAT_LIVE, jest: PNL([['npm run smoke -- live', 'ok']], 'pass', 'Ulangan') },
};
function SummaryMap25({ hl }) {
  const m = MAP25[hl] || MAP25.ev;
  return <div className="mk-light" style={{ padding: 14 }}>
    <BotMap loc={DB_ALL} {...m} max={1.05} tag={t("Bugungi dars — bot buyurtma oladi, panel o'zi ko'rsatadi", 'Сегодняшний урок — бот получает заказ, панель показывает сама')} />
  </div>;
}
const HOMEWORK25 = [
  { t: "API — admin.controller.ts: @Get('stock') — token → mahsulotlar (nom, qoldiq)", c: ['curl -s localhost:3000/admin/stock -H "Authorization: Bearer <token>"'] },
  { t: 'Test — admin.controller.spec.ts: tokensiz 401, token bilan 200 va ro\'yxat', c: ['npm test -- admin'] },
  { t: "Panel — admin.html: yukla() ichida ombor ham qayta so'raladi, ro'yxat pastda (yangi hodisa ochilmaydi)", c: [] },
  { t: "README — «Jonli panel» jadvaliga «ombor qoldig'i» qatori", c: [] },
  { t: 'Topshirish — git push → repo linki platformadagi uyga vazifaga', c: ['git add . && git commit -m "panel: ombor qoldig\'i"', 'git push'] },
];
const CHEATSHEET25 = `# WebSocket — mentor eslatmasi (OrderBotNest, jonli panel)
## Loyiha
git fetch --tags · git checkout ws1-start (= cicd2-done) → ws1-done (src/api/live/, public/admin.html, scripts/live-client.js) · .env: ADMIN_PANEL_TOKEN=<so'z> · npm run start:dev → http://localhost:3000/admin
## So'rov–javob vs doimiy ulanish
GET /admin/orders — server faqat so'ralganda javob beradi (polling — qayta-qayta so'rash) · socket.io — bir marta ulanish, server o'zi yuboradi; avval polling, keyin websocket; HTTP bilan bitta portda
## Gateway qolipi (live.gateway.ts)
@WebSocketGateway() · handleConnection(client): if (!isAdminToken(client.handshake.auth?.token)) { client.disconnect(); return; } · client.data.admin = true · orderChanged(orderId, reason): this.server?.emit('order-changed', { orderId, reason })
return unutilsa: klient yopiladi, lekin keyingi satrlar bajariladi — log «panel ulandi» yolg'on
## Hodisa — tranzaksiyadan keyin, konvert
const order = await this.orders.place(…) → this.live.orderChanged(order.id, 'new') · setStatus → 'status' · ichida faqat { orderId, reason }; panel GET /admin/orders (Authorization: Bearer) ni qayta so'raydi
## Panel qolipi (admin.html)
<script src="/socket.io/socket.io.js"> · ulanish = io({ auth: { token } }) · on('connect') → Ulangan · on('disconnect'|'connect_error') → ulanish.active ? Ulanmoqda : Ulanmagan · on('order-changed', () => yukla()) — qavs bilan! · esc() — Telegram'dan kelgan matn
## Uch holat va xabarlar
Ulangan — connect · Ulanmoqda (active=true) — transport close (server o'chdi), xhr poll error (server yo'q), ping timeout (≤ 45 s javobsiz) · Ulanmagan (active=false) — io server disconnect (token)
ping: server har 25 s, 20 s javob kutadi → 45 s
## Tekshirish
npm run live · npm run live -- notogri · npm run live -- "" · npm run smoke -- live (4 band) · CI smoke job — 9/9
## AI real vaqt kodiga to'rt savol
kutubxona (socket.io'mi — o'quvchi darsi bilan bir xil) · token qayerda (?token= — tarix va loglarda) · hodisada nima (telefonmi?) · mavjud fayllardan nima o'zgardi (OrderService, testlar)
## Sinfga tayyorgarlik (m10-02, 20 ekran)
Maydon Jamoa «8 / 10» · yopiq/ochiq yo'l = so'rov–javob/doimiy ulanish · konvert = hodisa (oyin-ozgardi { oyinId, sabab }) · belgi = holat · tinglovchi = ulanish.on · m12-dars-02 — hodisa yo'q (xato emas), m12-dars-03 — bor · ulanish.ts: tinglovchi connect ichida — WebSocket-2
## Sinfdagi holatlar
bir lahza yashil → qizil: token · sariq → yashil: server qayta yondi · uchish rejimi: 45 s · son o'zgarmadi: m12-dars-02 · Render uxlagan: 1 daqiqa · «null»: return yo'q
## Sizning uyga vazifangiz (40–60 daqiqa)
GET /admin/stock (token, test) · panelda ombor qoldig'i — order-changed dan keyin qayta so'raladi · README jadvali · repo linki platformaga`;
const s25Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "So'rov–javobda server <b>o'zi gapirmaydi</b>; socket.io — doimiy ulanish", "Birinchi: so'rov–javobda server faqat so'ralganda javob beradi. Jonli panel uchun doimiy ulanish kerak: socket.io, avval polling, keyin websocket, HTTP bilan bitta portda.", { hl: 'q' }),
  sg('b2', "Gateway: token ulanishda, <b>disconnect va return</b>", "Ikkinchi: gateway har ulanishda handshake auth token'ni tekshiradi. Noto'g'ri bo'lsa disconnect va return. Return unutilsa, klient yopiladi, lekin log yolg'on gapiradi.", { hl: 'gw' }),
  sg('b3', "Hodisa <b>tranzaksiyadan keyin</b>, ichida faqat «nima o'zgardi»", "Uchinchi: hodisa tranzaksiya tugagach yuboriladi va ichida faqat buyurtma raqami va sabab. Panel yangi ro'yxatni token bilan qayta so'raydi. Ma'lumotning manbai bitta, baza.", { hl: 'ev' }),
  sg('b4', "Panel: <b>auth'da token</b>, tinglovchida <b>qavs</b>, matn esc bilan", "To'rtinchi: panel tokenni manzilda emas, auth'da yuboradi. Tinglovchida yukla qavs bilan chaqiriladi, qavssiz ro'yxat yangilanmaydi. Mijoz ismi esc bilan, matn sifatida.", { hl: 'pn' }),
  sg('b5', "<b>Uch holat</b>: ulangan · ulanmoqda · ulanmagan; ping 45 s", "Beshinchi: uch holat. Ulanmoqda, active true: server o'chgan, javob bermayapti, ping timeout qirq besh soniyagacha. Ulanmagan, active false: server yopdi, token. Server yongach klient o'zi ulanadi.", { hl: 'st' }),
  sg('b6', "AI real vaqt kodiga <b>to'rt savol</b> va haqiqiy baza", "Oltinchi: AI yozgan real vaqt kodiga to'rt savol: qaysi kutubxona, token qayerda, hodisada nima, mavjud fayllardan nima o'zgardi. Va har doim haqiqiy baza bilan tekshiring: npm run smoke live.", { hl: 'ai' }),
  sg('hw', "<b>Uyga vazifa</b>: panelga ombor qoldig'i — yangi hodisasiz", "Uyga vazifa: panelga ikkinchi real vaqt nuqtasi, ombor qoldig'i. Yangi hodisa ochmang: order changed kelganda ombor ham qayta so'ralsin. Buning uchun get admin stock, token bilan, va unga test.", { hl: 'hw' }),
  sg('hw2', "README jadvaliga qator; <b>repo linki platformaga</b>", "README'dagi jonli panel jadvaliga ombor qatorini qo'shing. Buyurtmani bekor qilib, qoldiq o'zi o'sganini ko'ring. GitHub'ga chiqaring va linkni platformadagi uyga vazifaga qo'ying. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: gateway va panel qoliplari, uch holat, AI savollari — bir sahifada", "Pastda bir sahifalik eslatma: gateway va panel qoliplari, hodisa qoidasi, uch holat va xabarlari, ping, tekshirish buyruqlari, AI'ga to'rt savol, m10-02 lug'ati va sinfdagi holatlar. Nusxalab yoki yuklab oling.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET25, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('websocket-jonli-panel-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s25Segments(passed), [passed]);
  const b = useBeats(segments, p.review);
  const hl = b.seg.hl;
  const phase = hl === 'hw' ? 'hw' : hl === 'note' ? 'note' : 'sum';
  const shown = segments.slice(0, b.beat + 1).filter((s) => /^b\d/.test(s.id)).length;
  return (
    <Stage kicker={t('Yakun', 'Итог')} idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onFinish} onRestart={p.onRestart} nextReady={b.done} nextDisabled={!b.done} nextLabel={t('Darsni yakunlash', 'Завершить урок')} lockHint={t("Ustoz gapirib bo'lgach ochiladi", 'Откроется, когда учитель договорит')}>
      <div className="mk-body">
        <Say title={passed ? t('Barakalla! Endi siz bilasiz', 'Отлично! Теперь вы знаете') : t('Endi siz bilasiz', 'Теперь вы знаете')} segments={segments} beat={b.beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk} review={p.review} />
        <div className="mk-scene top" style={{ overflow: 'auto' }}>
          {phase === 'sum' && (<>
            <SummaryMap25 hl={hl} />
            {/* F-1120-02: bandlar rasm ostida ixcham to'rda — rasm surilib ketmasin (M51-2) */}
            <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, marginTop: 10 }}>{SUM25.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span style={{ fontSize: 12.5 }}>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 40–60 daqiqa', 'Домашнее задание · 40–60 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK25.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>{t("Tekshiruvchi qaraydi:", "Проверяющий смотрит:")}</b>{t(" yangi hodisa ochilmagan (", " новое событие не заведено (")}<code>order-changed</code>{t(" yetadi) · ", " хватает) · ")}<code>/admin/stock</code>{t(" token bilan himoyalangan va testlangan · README jadvali.", " защищён токеном и протестирован · таблица README.")}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("WebSocket: ulanish uzilsa", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("Uzilish paytidagi buyurtma, takror tinglovchi va qayta ulanishda qayta so'rash", RS('NEXT_D'))}</div></div>
          </div>}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  Muqova va ildiz
// ============================================================
// F-1120-02 (M51): muqova — chapda dars nima berishi, o'ngda darsning rasmi; eslatmalar bitta qisqa satrda
function Cover({ onStart, resume }) {
  return (
    <div className="mk-cover"><div className="card n1-cv">
      <div className="tx">
        <p className="mk-eyebrow">{t("Mentor kursi · WebSocket", "Курс для менторов · WebSocket")}</p>
        <h1>{t(LESSON_TITLE, RS('TITLE'))}</h1>
        <p className="af">{t('Bu darsdan keyin siz', 'После этого урока вы')}</p>
        <ul className="ok">
          {t(["so'rov–javob va doimiy ulanish farqini ko'rsatasiz: socket.io, gateway, token", "bot buyurtma olganda hodisa yuborasiz — admin paneli sahifani yangilamasdan ko'rsatadi", "panel belgisi va server logidan uzilish sababini topasiz, AI kodini to'rt savol bilan tekshirasiz"], ['покажете разницу запрос–ответ и постоянного соединения: socket.io, gateway, токен', 'отправите событие, когда бот получил заказ, — админ-панель покажет без перезагрузки', 'найдёте по значку панели и логу сервера причину обрыва, проверите код AI четырьмя вопросами']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 15–30 daqiqa, 12-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: CI/CD-2 darsi (OrderBotNest nusxangiz), Telegraf darsidagi bot tokeni va PostgreSQL, Node.js 20+, VS Code, brauzer, AI yordamchi · Loyiha: ws1-start tegi", 'Урок со звуком · 1 ч 15–30 мин, после 12-го экрана можно сделать перерыв · Нужно: урок CI/CD-2 (ваша копия OrderBotNest), токен бота и PostgreSQL из урока Telegraf, Node.js 20+, VS Code, браузер, AI-помощник · Проект: тег ws1-start')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><BotMap loc={DB_ALL} on={LIVE_ON} chat={CHAT_LIVE} jest={PANEL} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, ScreenP7, Screen8, Screen9, Screen10, Screen11, ScreenP12, Screen13, Screen14, Screen15, Screen16, Screen17, Screen18, Screen19, ScreenP20, Screen21, Screen22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function WsBasicsMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
  setLang(lang);
  useCss();
  useCss3();
  useCssN1(); // F-1120-02: dars rasmi uslubi (parts/02b-rasm.jsx)
  const total = SCREENS.length;
  const [started, setStarted] = useState(startAt != null);
  const [idx, setIdx] = useState(Math.min(Math.max(0, startAt || 0), total - 1));
  const [answers, setAnswers] = useState({});
  const [returnTo, setReturnTo] = useState(null);
  const [seen, setSeen] = useState({});
  const [rev, setRev] = useState(0);
  const [mode, setMode] = useState('live');
  const sv = useMentorSave({ id: LESSON_ID, total, startAt, started, idx, answers, seen, setIdx, setAnswers, setSeen, setStarted });
  const startTime = useRef(Date.now());
  const finished = useRef(false);
  const onAnswer = useCallback((payload) => setAnswers((a) => ({ ...a, [idx]: payload })), [idx]);
  const goto = useCallback((to) => { setMode('live'); setReturnTo(idx); setIdx(Math.max(0, Math.min(to, total - 1))); }, [idx, total]);
  const next = () => { setMode('review'); setSeen((s) => ({ ...s, [idx]: true })); if (returnTo != null) { const r = returnTo; setReturnTo(null); setIdx(r); } else setIdx((i) => Math.min(i + 1, total - 1)); };
  const restart = useCallback(() => { setMode('live'); setRev((r) => r + 1); }, []);
  const finish = () => {
    if (finished.current) return; finished.current = true;
    const vals = Object.values(answers);
    const checks = vals.filter((a) => a && a.type === 'mc');
    const fin = vals.find((a) => a && a.type === 'final');
    const practices = vals.filter((a) => a && a.type === 'practice');
    const score = fin ? fin.score : 0, totalQ = FINAL.length;
    const practiceDone = practices.length === PRACTICE_COUNT && practices.every((x) => x.done);
    onFinished && onFinished({
      lessonId: LESSON_ID, lessonTitle: LESSON_TITLE,
      durationSec: Math.floor((Date.now() - startTime.current) / 1000),
      totalQuestions: totalQ, correctAnswers: score, scorePercent: Math.round((score / totalQ) * 100), passed: score >= 6 && practiceDone, testPassed: score >= 6,
      finalAttempts: fin ? fin.attempt : 0,
      checks: checks.map((c) => ({ firstTry: c.firstTry, tries: c.tries })),
      practiceDone,
      answers: Object.entries(answers).map(([i, a]) => ({ screen: Number(i) + 1, ...a })),
    });
  };
  if (!started) return <Cover onStart={sv.start} resume={sv.resume} />;
  const S = SCREENS[idx];
  const fin = Object.values(answers).find((a) => a && a.type === 'final');
  return <S key={`${idx}:${rev}`} idx={idx} total={total} lang={lang} stored={answers[idx]} testScore={fin ? fin.score : 0} seen={!!seen[idx]} review={mode === 'review' && !!seen[idx]} onAnswer={onAnswer} onNext={next} onBack={idx > 0 ? () => { setMode('review'); setIdx((i) => i - 1); } : null} onFinish={finish} onGoto={goto} onRestart={restart} />;
}
