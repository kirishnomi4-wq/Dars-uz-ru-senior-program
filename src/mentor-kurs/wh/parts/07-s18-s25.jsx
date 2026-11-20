// ============================================================
//  18 · AI webhook yozdi — ikki javob (whv2-ai/*/00-javob.md, diff-stat)
// ============================================================
// F-1109-06: xulosa — ikki iqtibos o'rniga taqqoslash jadvali (whv2-ai/XULOSA.md) va «AI o'zi aytgan gapni o'qing»
function Cmp18() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Talab: «POST, JSON, HMAC-SHA256, X-Signature, kalit .env da» — xizmat hujjatidagidek qisqa", "Требование: «POST, JSON, HMAC-SHA256, X-Signature, ключ в .env» — коротко, как в документации сервиса")}</p>
      <table className="z-tbl wh-a18"><tbody>
        <tr><th /><th>1-AI</th><th>2-AI</th></tr>
        <tr><td>{t("Manzil", "Адрес")}</td><td>/payments/webhook</td><td>/webhooks/payment</td></tr>
        <tr><td>{t("Imzo", "Подпись")}</td><td>{t("xom tana · timingSafeEqual", "сырое тело · timingSafeEqual")} <span className="g">{t("to'g'ri", "верно")}</span></td><td>{t("xom tana · timingSafeEqual", "сырое тело · timingSafeEqual")} <span className="g">{t("to'g'ri", "верно")}</span></td></tr>
        <tr><td>{t("Takror", "Повтор")}</td><td>{t("200 duplicate, 1 qator", "200 duplicate, 1 строка")} <span className="g">{t("to'g'ri", "верно")}</span></td><td>{t("1 qator", "1 строка")} <span className="g">{t("to'g'ri", "верно")}</span></td></tr>
        <tr className="w"><td>{t("Summa farq qilsa", "Если сумма отличается")}</td><td>{t("yozadi, panelda «Summa mos emas»", "записывает, в панели «Summa mos emas»")}</td><td>{t("200, «to'landi» — o'zi aytdi: ", "200, «оплачено» — сам сказал: ")}<b>{t("«siz hal qiling»", "«решайте вы»")}</b> <span className="f">{t("AI aytdi", "AI сказал")}</span></td></tr>
        <tr className="w"><td>{t("O'z sinovi", "Своя проверка")}</td><td>embedded-postgres, smoke 15/15</td><td>{t("supertest + mock, baza yo'q", "supertest + mock, базы нет")}</td></tr>
        <tr className="w"><td>{t("Doira", "Рамки")}</td><td>{t("bir marta loyihadan tashqariga nusxa — ", "один раз копия вне проекта — ")}<b>{t("o'zi aytdi", "сказал сам")}</b>{t(", o'chirdi", ", удалил")} <span className="f">{t("doiradan chiqdi", "вышел за рамки")}</span></td><td>{t("toza", "чисто")}</td></tr>
      </tbody></table>
    </div>
    <div className="z-rule">{t("AI o'zi aytgan gapni o'qing: ", "Читайте, что AI сказал сам: ")}<b>{t("«siz hal qiling»", "«решайте вы»")}</b>{t(" — summa qarori sizda.", " — решение по сумме за вами.")}</div>
  </div>;
}
const S18 = mkS(18, [{ v: 'stage' }, { v: 'prompt' }, { v: 'cards' }, { v: 'quote' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {(seg.v === 'stage' || seg.v === 'prompt') && <div className="c1-stage">
      <div style={{ '--c': T.ink3, opacity: 0.45 }}><h4>{t("1–4-bosqich · siz", "Этапы 1–4 · вы")}</h4><p>{t("imzo, tartib, xom tana, takror, rad, to'rt buzilish", "подпись, порядок, сырое тело, повтор, отказ, четыре поломки")}</p></div>
      <div style={{ '--c': C1.ai }}><h4>{t("5-bosqich · AI yozadi, siz qabul qilasiz", "Этап 5 · пишет AI, вы принимаете")}</h4><p>{t("qisqa talab → ikki webhook → haqiqiy bazada sinov", "короткое требование → два webhook → проверка на настоящей базе")}</p></div>
    </div>}
    {seg.v === 'prompt' && <div style={{ marginTop: 10 }}><AiReply who={t("Prompt — ikkala AI'ga bir xil", "Промпт — одинаковый для обоих AI")} prompt={KOD.PROMPT1} tag={t("ishorasiz: xom tana, takror, tartib, summa yo'q", "без подсказок: нет сырого тела, повтора, порядка, суммы")} /></div>}
    {seg.v === 'cards' && <div className="pg-two">
      <AiReply who={t("1-AI (kuchli model)", "1-й AI (сильная модель)")} said={<>{KOD.AI.ai1.stat} · <code>POST /payments/webhook</code> · <code>rawBody</code> · <code>timingSafeEqual</code>, <code>sha256=</code>{t(" ham qabul · UNIQUE + ", " тоже принимается · UNIQUE + ")}<code>FOR UPDATE</code> · <b>{t("«Summa mos emas» holati", "статус «Summa mos emas»")}</b> · 409 · smoke 15/15 (<code>embedded-postgres</code>)</>} />
      <AiReply who={t("2-AI (kuchsizroq model)", "2-й AI (модель слабее)")} said={<>{KOD.AI.ai2.stat} · <code>POST /webhooks/payment</code> · <code>rawBody</code> · 64-hex + <code>timingSafeEqual</code>{t(" · takror — qatorni yangilaydi · ", " · повтор — обновляет строку · ")}<b>{t("summa farq qilsa — 200 va faqat log", "сумма отличается — 200 и только лог")}</b></>} />
    </div>}
    {seg.v === 'quote' && <Cmp18 />}
  </>} />;
}

// ============================================================
//  19 · AI webhook'lari haqiqiy bazada (whv2-ai/*/01-haqiqiy-baza.txt)
// ============================================================
// «## N. …» bo'limidagi javob kodi va qatorlar soni
function aiTest(ai, n) {
  const L = KOD.OUT[ai].split('\n');
  const part = (k) => { const a = L.findIndex((l) => l.startsWith(`## ${k}.`)); if (a < 0) return null; const b = L.findIndex((l, i) => i > a && l.startsWith('## ')); return L.slice(a + 1, b < 0 ? L.length : b); };
  const rowsOf = (S) => (S ? (S.map((l) => (l.match(/qatorlari: (\d+)/) || [])[1]).filter(Boolean).pop() || '') : '');
  const S = part(n); if (!S) return '?';
  const codes = S.map((l) => (l.match(/← (\d{3})/) || [])[1]).filter(Boolean).join(' · ');
  if (n === 2 || n === 7) return `${codes} · ${rowsOf(S)} qator`;
  if (n === 3 || n === 4) return `${codes} · ${rowsOf(S) === rowsOf(part(n - 1)) ? "yangi qator yo'q" : 'qator qo\'shildi!'}`;
  return codes;
}
const TESTS19 = [[1, "to'g'ri imzo"], [2, 'takror'], [3, 'imzosiz'], [4, '«abc» imzo'], [6, "bo'sh joyli JSON"], [7, 'bir vaqtda ikki']];
const aiSec = (ai, n) => { const L = KOD.OUT[ai].split('\n'); const a = L.findIndex((l) => l.startsWith(`## ${n}.`)); const b = L.findIndex((l, i) => i > a && l.startsWith('## ')); return L.slice(a, b).filter((l) => l.trim()).map((l) => ({ h: liveLine(l) })); };
const aiGet = (ai, re) => KOD.OUT[ai].split('\n').filter((l) => re.test(l)).map((l) => ({ h: liveLine(l) }));
const FOUR19 = ['Imzo xom baytlardanmi (rawBody)?', 'Imzo har qanday yozuvdan oldinmi?', 'Takror va bir vaqtdagi xabar — bitta qatormi?', 'Summa buyurtma jami bilan solishtiriladimi?'];
const S19 = mkS(19, [{ v: 'tab' }, { v: 'sum' }, { v: 'three' }, { v: 'four' }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <>
    {seg.v === 'tab' && <table className="c1-res"><thead><tr><th>{t("Sinov (haqiqiy PostgreSQL)", "Проверка (настоящий PostgreSQL)")}</th><th>1-AI</th><th>2-AI</th></tr></thead>
      <tbody>{TESTS19.map(([n, h]) => <tr key={n}><td>{h}</td><td className="ok">{aiTest('ai1', n)}</td><td className="ok">{aiTest('ai2', n)}</td></tr>)}</tbody></table>}
    {seg.v === 'sum' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("1-AI · summa 1 200, buyurtma 120 000", "1-й AI · сумма 1 200, заказ 120 000")} lines={[...aiSec('ai1', 5), ...aiGet('ai1', /^#2 /)]} /><Term title={t("2-AI · o'sha xabar", "2-й AI · то же сообщение")} lines={[...aiSec('ai2', 5), ...aiGet('ai2', /^#2 /)]} er /></div>}
    {seg.v === 'three' && <div className="pg-three">
      <Card c={T.ink3} h={t("Bizniki (wh-done)", "Наш (wh-done)")}><p>{t("400 «summa mos emas» — yozilmaydi. Pul o'tgan bo'lsa, yozuv ", "400 «summa mos emas» — не записывается. Если деньги прошли, запись ")}<b>{t("yo'qoladi", "пропадает")}</b></p></Card>
      <Card c={T.green} h="1-AI" hl><p>{t("yoziladi, ", "записывается, ")}<b>{t("«Summa mos emas»", "«Summa mos emas»")}</b>{t(" — admin farqni ko'radi. Bu yerda bizdan yaxshiroq", " — админ видит разницу. Здесь лучше нас")}</p></Card>
      <Card c={T.accent} h="2-AI"><p>{t("«To'landi» — admin yetkazib beradi, pul 1 %", "«To'landi» — админ доставит, денег 1 %")}</p></Card>
    </div>}
    {seg.v === 'four' && <div className="mk-light" style={{ padding: 16 }}><div className="mk-tag">{t("AI webhook'ini qabul qilish — to'rt savol", "Приём webhook от AI — четыре вопроса")}</div><div className="mk-plan">{FOUR19.map((x, i) => <div key={i} className="hl" style={{ animation: `mk-up .4s ${i * 0.1}s ease both` }}><b>0{i + 1}</b><span>{x}</span></div>)}</div></div>}
  </>} />;
}

// ============================================================
//  20 · Tekshiruv 4 — summa mos emas (ai2/01, ai1/01)
// ============================================================
function Screen20(p) {
  return MC(p, 20, {
    above: <Term title={t("2-AI · haqiqiy bazada (5-sinov)", "2-й AI · на настоящей базе (проверка 5)")} lines={[...aiSec('ai2', 5).slice(2), ...aiGet('ai2', /^#2 /), ...aiGet('ai2', /WARN \[Payment\] #2/)]} />,
    after: <Term title={t("1-AI · o'sha xabar", "1-й AI · то же сообщение")} lines={[...aiSec('ai1', 5).slice(2), ...aiGet('ai1', /^#2 /)]} />,
  });
}

// ============================================================
//  21 · m11-03 xaritasi (PaymentWebhookLesson.jsx — SCREEN_META 20)
// ============================================================
const BLOK21 = [['1 Kirish', 's0 · s1 reja', "mijozning gapi dalil emas (2)"], ['2 Xabar va imzo', "s2 to'lov xabari · s3 test · s4 imzo · s5 test", "soxta 401, xom tana (9, 12)"], ['3 Takror', "s6 javob yo'qoldi · s7 kod oynasi · s8 test", 'bir vaqtda ikki xabar (10)'], ['4 Rad va test rejim', 's9 rad · s10 test · s11 test rejim', "to'langani «rad» ga tushmaydi (10)"], ['5 Sxema va amaliyot', "s12–s14 sxema · A1 o'z Backend'i · A2 mashq sahifa", 'tartib (13), kalit (15), Render ⚠']];
const S21 = mkS(21, [{ v: 'cards' }, { v: 'cards', way: true }, { v: 'blok' }, { v: 'repo' }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m11-03 (20 ekran)", "Ученик · m11-03 (20 экранов)")} hl><p><b>Maydon Jamoa</b>{t(" — Pro, 30 kun · 10 000 so'm, test rejim · to'lov xabari · imzo · takror · rad · to'lov oqimi sxemasi", " — Pro, 30 дней · 10 000 сум, тестовый режим · сообщение об оплате · подпись · повтор · отказ · схема потока оплаты")}</p>{seg.way && <p style={{ marginTop: 6 }}><b>{t("Amaliyot:", "Практика:")}</b>{t(" A1 — o'z Backend'ida ", " A1 — в своём Backend ")}<code>POST /tolov/webhook</code>{t(" (agent bilan) · A2 — «Mashq to'lov» sahifasi va uch tekshiruv", " (с агентом) · A2 — страница «Mashq to'lov» и три проверки")}</p>}</Card>
      <Card c={T.accent} h={t("Siz · bugun", "Вы · сегодня")}><p>{t("OrderBotNest: imzo · tartib · ", "OrderBotNest: подпись · порядок · ")}<code>rawBody</code>{t(" · takror · rad · summa · AI", " · повтор · отказ · сумма · AI")}</p></Card>
    </div>}
    {seg.v === 'blok' && <table className="pg-dict"><tbody>{BLOK21.map(([a, b, c]) => <tr key={a}><td><b>{a}</b></td><td>{b}</td><td>{c}</td></tr>)}</tbody></table>}
    {seg.v === 'repo' && <div className="pg-three">{[['maydon-jamoa', 'm13-dars-03-done'], [t('Manzil', "Адрес"), 'POST /tolov/webhook'], [t('Imzo · kalit', "Подпись · ключ"), 'X-Imzo · TOLOV_KALITI']].map(([h, tx]) => <Card key={h} c={T.green} h={h}><p><code>{tx}</code></p></Card>)}</div>}
  </>} />;
}

// ============================================================
//  22 · O'quvchi so'zlari va mashq sahifa (manba/wh-out/01, 02, 05, 13 — maydon-jamoa)
// ============================================================
const DICT22 = [["to'lov xabari · POST /tolov/webhook", 'webhook · POST /payments/webhook'], ['imzo · X-Imzo · TOLOV_KALITI', 'X-Signature · PAYMENT_WEBHOOK_SECRET'], ['takror xabar · { takror: true }', '{ duplicate: true }'], ['holat: tolandi / rad', 'status: paid / failed'], ["mashq to'lov sahifasi", 'npm run pay']];
const mjL = (k, keep = () => true) => KOD.OUT[k].split('\n').filter((l) => l.trim() && keep(l)).map((l) => ({ h: liveLine(l) }));
const S22 = mkS(22, [{ v: 'dict' }, { v: 'page' }, { v: 'btn' }, { v: 'order' }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <>
    {seg.v === 'dict' && <table className="pg-dict"><tbody>{DICT22.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>}
    {seg.v === 'page' && <Term title={t("maydon-jamoa · «Mashq to'lov» sahifasi (01.11)", "maydon-jamoa · страница «Mashq to'lov» (01.11)")} lines={mjL('mj01')} />}
    {seg.v === 'btn' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("«To'lash» tugmasi", "кнопка «To'lash»")} lines={mjL('mj02')} /><Term title={t("«Imzosiz» tugmasi", "кнопка «Imzosiz»")} lines={mjL('mj05')} er /></div>}
    {seg.v === 'order' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("maydon-jamoa · tolov.controller.ts — imzo tekshiruvi yozuvdan keyin (tajriba nusxasi)", "maydon-jamoa · tolov.controller.ts — проверка подписи после записи (копия для опыта)")} lines={mjL('mj13').slice(0, 12)} er /><div className="n2-warn">Imzosiz → <b>401</b>{t(", lekin ", ", но ")}<code>tolovlar</code>{t(" jadvalida qator — 13-ekrandagi xato, o'quvchi loyihasida ham. Agent kodni yozsa, o'quvchi javob kodiga emas, ", " в таблице строка — ошибка с экрана 13, и в проекте ученика тоже. Когда код пишет агент, ученик смотрит не на код ответа, ")}<b>{t("jadvalga", "а на таблицу")}</b>{t(" qarasin.", " .")}</div></div>}
  </>} />;
}

// ============================================================
//  23 · Sinfdagi holatlar va o'quvchi savollari
// ============================================================
const CARDS23 = [['Hamma xabar 401', 'Imzo mos emas', "kalit bo'sh yoki Render'dagisi boshqa"], ["Haqiqiy «To'lash» ham 401", 'Imzo mos emas', 'rawBody yoqilmagan'], ['401, lekin jadvalda qator', '—', 'imzo yozuvdan keyin'], ['«Ikki marta» — ikki qator', 'takror kelmadi', "to'lov raqami noyob emas"], ['400', 'javob matnida maydon nomi', 'maydon yoki summa xato'], ['.env Git\'da', 'git ls-files da fayl nomi', 'kalitlar darhol almashtiriladi']];
const QA23 = [
  ['«Payme ulasam bo\'ladimi?»', "AI Startup kursida emas: real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan (o'quvchi darsi s1 eslatmasi)."],
  ['«Nega takrorga ham 200?»', 'Xato kodi qaytsa, xizmat qayta yuboraveradi.'],
  ['«Nega rad yoziladi?»', '«To\'lovim qayerda?» savoliga javob.'],
  ['«Kalitni agentga bersam tezroq bo\'lardi-ku?»', "Kalit kimda bo'lsa, o'sha «to'landi» yasaydi."],
];
function QA({ items }) {
  const [open, setOpen] = useState(-1);
  return <div className="pg-qa">{items.map(([q, a], i) => <button key={q} onClick={() => setOpen(open === i ? -1 : i)}><b>{q}</b>{open === i && <p>{a}</p>}</button>)}</div>;
}
const S23 = mkS(23, [{ v: 'a' }, { v: 'b' }, { v: 'qa' }, { v: 'qa' }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {(seg.v === 'a' || seg.v === 'b') && <div className="pg-three">{CARDS23.slice(seg.v === 'a' ? 0 : 3, seg.v === 'a' ? 3 : 6).map(([h, x, y], i) => <Card key={h} c={T.accent} h={`${(seg.v === 'a' ? 1 : 4) + i} · ${h}`}><p>{x}</p><p style={{ marginTop: 4 }}>→ {y}</p></Card>)}</div>}
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
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: dalil, imzo, raw body, tartib, takror, rad, bo'sh kalit va AI'ning summasi. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi to'lov xabari kelganda avval imzo, keyin summa, keyin yozuv: buni o'quvchiga ham shu tartibda tushuntirasiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
  { k: 'q', t: "To'lov xizmati natijani serverga o'zi yuboradi (webhook); mijoz yoki ilovaning «to'ladim»i dalil emas — dalil faqat imzoli xabar", st: ['q'] },
  { k: 'sg', t: "Imzo — HMAC-SHA256(xom tana, kalit); server qayta hisoblaydi, timingSafeEqual; bo'sh kalit — hamma xabar rad; kalit faqat .env va hostingda", st: ['sg'] },
  { k: 'or', t: "Tartib: imzo → maydonlar → buyurtma va summa → yozuv. Yozuv imzodan oldin bo'lsa — 401, lekin bazada «to'landi»", st: ['or'] },
  { k: 'rb', t: "Imzo baytlardan: rawBody: true va req.rawBody; JSON.stringify(body) dan hisoblash — bo'sh joyli haqiqiy to'lovni rad etadi", st: ['sg'] },
  { k: 'dp', t: "Takror — payment_id UNIQUE + ON CONFLICT DO NOTHING (bir vaqtda kelsa ham bitta qator), javob 200; rad ham yoziladi, to'langanini tushirmaydi", st: ['dp'] },
  { k: 'ai', t: "AI webhook'iga to'rt savol: baytlarmi · tartib · takror · summa; haqiqiy bazada sinang — bu safar summada AI-1 bizdan yaxshiroq edi", st: ['ai'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (BotMap + to'lov xizmati); har band rasmning o'z qismini yoritadi
const MAP25 = {
  q: { on: PAY_ON, note: PAID, jest: PAY([['X-Signature', 'ok'], ['POST /payments/webhook', 'ok']], 'pass', '200') },
  sg: { on: PAY_ON, jest: PAY([['HMAC-SHA256', 'ok'], ['timingSafeEqual', 'ok']], 'pass', '200') },
  or: { on: PAY_ON, note: PAID, jest: PAY(() => [['record → ' + t('imzo', 'подпись'), 'bad']], 'fail', t("401 · bazada paid", '401 · в базе paid')) },
  rb: { on: PAY_ON, jest: PAY([['JSON.stringify(body)', 'bad']], 'fail', '401') },
  dp: { on: PAY_ON, note: PAID, jest: PAY(() => [[t('takror', 'повтор'), 'ok'], ['ON CONFLICT DO NOTHING', 'ok']], 'pass', '200 · duplicate') },
  ai: { on: PAY_ON, note: PAID, jest: PAY([['X-Signature', 'ok'], ['POST /payments/webhook', 'ok']], 'pass', '200') },
};
function SummaryMap25({ hl }) {
  const m = MAP25[hl] || MAP25.q;
  return <div className="mk-light" style={{ padding: 14 }}>
    <BotMap loc={DB_ALL} {...m} max={1.05} tag={t("Bugungi dars — to'lov xabari: imzo, tartib, takror", 'Сегодняшний урок — сообщение об оплате: подпись, порядок, повтор')} />
  </div>;
}
const HOMEWORK25 = [
  { t: "Servis — payment.service.ts: summa farq qilsa 400 emas, yozish va payment_status = 'amount_mismatch'", c: [] },
  { t: "Panel — admin.html TOLOV ga amount_mismatch: '⚠️ Summa mos emas'", c: [] },
  { t: "Test — payment.service.spec.ts dagi «summa mos emas» testini yangilang; smoke'ga bitta band", c: ['npm test', 'npm run smoke -- payment'] },
  { t: "Sinov — curl bilan summa 1200: 200 va panelda «⚠️ Summa mos emas»", c: ["BODY='{\"paymentId\":\"pay_kam\",\"orderId\":1,\"status\":\"paid\",\"amount\":1200}'", "SIG=$(printf '%s' \"$BODY\" | openssl dgst -sha256 -hmac \"$PAYMENT_WEBHOOK_SECRET\" | sed 's/^.*= //')", 'curl -s -X POST localhost:3000/payments/webhook -H "Content-Type: application/json" -H "X-Signature: $SIG" -d "$BODY"'] },
  { t: "Topshirish — README «To'lov webhook'i» jadvali → git push → repo linki platformaga", c: ['git add . && git commit -m "to\'lov: summa mos emas holati"', 'git push'] },
];
const CHEATSHEET25 = `# Webhook: to'lov xabari — mentor eslatmasi (OrderBotNest)
## Loyiha
git fetch --tags · git checkout wh-start (= ws2-done) → wh-done (src/api/payment/, payments jadvali, main.ts rawBody, panelda «To'lov», npm run pay) · .env: PAYMENT_WEBHOOK_SECRET=<uzun tasodifiy satr>
## Umumiy tushuncha
to'lov xizmati natijani serverga O'ZI yuboradi: POST /payments/webhook · mijoz/ilovaning «to'ladim»i dalil emas — dalil faqat imzoli xabar · manzil internetda ochiq
## Imzo (signature.ts)
X-Signature = HMAC-SHA256(xom tana, PAYMENT_WEBHOOK_SECRET), hex 64 · server qayta hisoblaydi, timingSafeEqual (uzunlik farq qilsa — yo'q) · kalit bo'sh — hamma xabar rad
## Tartib (payment.controller.ts)
1 imzo → 401 · 2 maydonlar (paymentId, orderId, status paid|failed, amount) → 400 · 3 buyurtma va summa = total → 400 · 4 yozuv · imzo YOZUVDAN OLDIN
## Xom tana
NestFactory.create(AppModule, { rawBody: true }) · req.rawBody · JSON.stringify(body) dan emas — bo'sh joyli haqiqiy to'lov 401 bo'ladi
## Takror va rad (payment.service.ts)
INSERT … ON CONFLICT (payment_id) DO NOTHING RETURNING id — bo'sh bo'lsa { duplicate: true }, javob 200 · bir vaqtda kelsa ham bitta qator · failed ham yoziladi · to'langanini «rad» ga tushirmaydi (payment_status IS DISTINCT FROM 'paid')
## Tekshirish
npm run pay -- <raqam> [ok | rad | ikki | imzosiz | soxta] · npm test (48) · npm run smoke -- payment (5) · psql: SELECT * FROM payments
## To'rt buzilish va belgisi
JSON.stringify — bo'sh joyli to'lov 401 · rawBody yo'q — haqiqiy to'lov ham 401 · tartib — 401, lekin bazada paid (testlar: 3 qizil) · kalit bo'sh — ishga tushishda WARN, hamma 401
## AI webhook'iga to'rt savol
imzo xom baytlardanmi · imzo yozuvdan oldinmi · takror va bir vaqtdagi xabar bitta qatormi · summa buyurtma bilan solishtiriladimi (AI-2: 1 200 so'm → «To'landi»)
## Sinfga tayyorgarlik (m11-03, 20 ekran)
Maydon Jamoa — Pro, 30 kun · 10 000 so'm, test rejim · POST /tolov/webhook · X-Imzo · TOLOV_KALITI · { takror: true } · holat tolandi/rad · «Mashq to'lov» sahifasi: To'lash · Rad etish · Ikki marta · Imzosiz · Payme — kursda emas
## Sinfdagi holatlar
hamma 401 → kalit · haqiqiy ham 401 → rawBody · 401, lekin qator → tartib · ikki qator → raqam noyob emas · 400 → javob matni · .env Git'da → kalit almashtiriladi
## Sizning uyga vazifangiz (40–60 daqiqa)
summa mos emas → yozish va 'amount_mismatch' · panelda «⚠️ Summa mos emas» · test va smoke · README · repo linki platformaga`;
const s25Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "To'lov xizmati <b>o'zi yuboradi</b>; dalil — faqat imzoli xabar", "Birinchi: to'lov xizmati natijani serverga o'zi yuboradi, bu webhook. Mijozning yoki ilovaning to'ladim degani dalil emas, dalil faqat xizmatning imzoli xabari.", { hl: 'q' }),
  sg('b2', "Imzo — <b>xom tana va kalitdan HMAC</b>; bo'sh kalit — rad", "Ikkinchi: imzo xom tana va maxfiy kalitdan HMAC. Server o'zi qayta hisoblaydi va timing safe equal bilan solishtiradi. Kalit bo'sh bo'lsa, hamma xabar rad etiladi.", { hl: 'q' }),
  sg('b3', "Tartib: <b>imzo, maydonlar, summa, yozuv</b>", "Uchinchi: tartib. Imzo, maydonlar, buyurtma va summa, keyin yozuv. Yozuv imzodan oldin bo'lsa, javob to'rt yuz bir, lekin bazada to'landi qoladi.", { hl: 'or' }),
  sg('b4', "Imzo <b>baytlardan</b>: rawBody true", "To'rtinchi: imzo baytlardan hisoblanadi. Raw body true bo'lmasa yoki imzo JSON stringify'dan hisoblansa, haqiqiy to'lov ham rad etiladi.", { hl: 'rb' }),
  sg('b5', "Takror — <b>bitta qator</b>, javob 200; rad ham yoziladi", "Beshinchi: takror xabar. Payment id noyob, on conflict do nothing: bir vaqtda kelsa ham bitta qator, javob ikki yuz. Rad etilgan to'lov ham yoziladi, to'langani tushmaydi.", { hl: 'dp' }),
  sg('b6', "AI webhook'iga <b>to'rt savol</b> — summa ham", "Oltinchi: AI yozgan webhook'ga to'rt savol: baytlar, tartib, takror va summa. Haqiqiy bazada sinang. Bugun summada birinchi AI bizdan yaxshiroq edi.", { hl: 'ai' }),
  sg('hw', "<b>Uyga vazifa</b>: summa mos emas — 400 emas, yozib ajratish", "Uyga vazifa: summasi mos kelmagan to'lovni to'rt yuz o'rniga yozib, alohida belgilang: payment status amount mismatch, panelda summa mos emas. Pul o'tgan bo'lsa, yozuv yo'qolmasin.", { hl: 'hw' }),
  sg('hw2', "Testni yangilang, smoke'ga band; <b>repo linki platformaga</b>", "Servis testini yangi xatti-harakatga moslang, smoke'ga bitta band qo'shing va curl bilan bir ming ikki yuz so'm yuborib, panelni ko'ring. README jadvali, GitHub, link platformaga. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: imzo, tartib, xom tana, takror, buzilishlar, AI savollari — bir sahifada", "Pastda bir sahifalik eslatma: umumiy tushuncha, imzo va tartib, xom tana, takror va rad, to'rt buzilish va belgisi, AI'ga to'rt savol, m11-03 lug'ati va sinfdagi holatlar. Nusxalab yoki yuklab oling.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET25, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('webhook-tolov-xabari-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
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
            <div className="mk-rule" style={{ marginTop: 12 }}><b>{t("Tekshiruvchi qaraydi:", "Проверяющий смотрит:")}</b>{t(" imzo hali ham birinchi · mos kelmagan summa yozilgan va ajratilgan (to'landi emas) · test yangilangan · README.", " подпись по-прежнему первая · несовпавшая сумма записана и выделена (не «оплачено») · тест обновлён · README.")}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t("Bu kursdagi oxirgi mentor darsi", "Последний урок для менторов в этом курсе")}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("OrderBotNest — boshidan oxirigacha", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("Bot, baza, testlar, lenta, jonli panel va to'lov", RS('NEXT_D'))}</div></div>
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
        <p className="mk-eyebrow">{t("Mentor kursi · Webhook", "Курс для менторов · Webhook")}</p>
        <h1>{t(LESSON_TITLE, RS('TITLE'))}</h1>
        <p className="af">{t('Bu darsdan keyin siz', 'После этого урока вы')}</p>
        <ul className="ok">
          {t(["to'lov xabarini qabul qilasiz: imzo xom tanadan, keyin maydonlar, keyin yozuv", "takror va rad xabarlarini to'g'ri yozasiz: bitta to'lov — bitta qator", "to'rt xatoni buzib ko'rasiz va AI yozgan webhook'ni to'rt savol bilan tekshirasiz"], ['примете сообщение об оплате: подпись из сырого тела, потом поля, потом запись', 'правильно запишете повтор и отказ: один платёж — одна строка', 'сломаете четыре ошибки и проверите webhook от AI четырьмя вопросами']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 15 daqiqa, 11-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: WebSocket-2 darsi (jonli panel), Telegraf darsidagi bot tokeni va PostgreSQL, telefon, AI yordamchi; haqiqiy to'lov xizmatiga ulanmaymiz · Loyiha: wh-start tegi", 'Урок со звуком · 1 ч 15 мин, после 11-го экрана можно сделать перерыв · Нужно: урок WebSocket-2 (живая панель), токен бота и PostgreSQL из урока Telegraf, телефон, AI-помощник; к настоящему платёжному сервису не подключаемся · Проект: тег wh-start')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><BotMap loc={DB_ALL} {...S1M[0]} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, ScreenP8, Screen9, Screen10, ScreenP11, Screen12, Screen13, Screen14, Screen15, Screen16, ScreenP17, Screen18, Screen19, Screen20, Screen21, Screen22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function WebhookMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
