// ============================================================
//  17 · AI tuzatdi — ikki javob (ws2v2-ai/*/00-javob.md, diff)
// ============================================================
// F-1109-06: xulosa — ikki iqtibos o'rniga taqqoslash jadvali (ws2v2-ai/XULOSA.md) va xulosa qoidasi
function Cmp17() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Prompt: buyurtmachining shikoyati — ishorasiz", "Промпт: жалоба заказчика — без подсказок")}</p>
      <table className="z-tbl w2-a2"><tbody>
        <tr><th /><th>1-AI</th><th>2-AI</th></tr>
        <tr><td>{t("Sabab", "Причина")}</td><td>{t("topdi", "нашёл")} <span className="g">{t("to'g'ri", "верно")}</span>{t(" — «ulanish yo'q paytda yuborilgan hodisa hech kimga yetmaydi»", " — «событие, отправленное без соединения, никому не доходит»")}</td><td>{t("topdi", "нашёл")} <span className="g">{t("to'g'ri", "верно")}</span></td></tr>
        <tr><td>{t("Tuzatish", "Исправление")}</td><td>connect → holatQoy + yukla()</td><td>{t("xuddi shu", "то же")}</td></tr>
        <tr><td>{t("O'zgargan", "Изменено")}</td><td>admin.html, README.md (+22/−3)</td><td>admin.html (+8/−1)</td></tr>
        <tr><td>{t("Qo'shimcha", "Дополнительно")}</td><td>{t("so'rov raqami — eski javob yangisini bosmasin", "номер запроса — старый ответ не перекроет новый")}</td><td>{t("xuddi shu", "то же")}</td></tr>
        <tr className="w"><td>{t("Tinglovchi", "Слушатель")}</td><td>{t("connect ichiga ko'chirilmadi", "не перенесён внутрь connect")} <span className="f">{t("10-ekrandagi tuzoq", "ловушка с экрана 10")}</span></td><td>{t("xuddi shu", "то же")}</td></tr>
        <tr className="w"><td>{t("O'z sinovi", "Своя проверка")}</td><td>{t("headless Chrome, baza o'rniga JSON fayl", "headless Chrome, вместо базы JSON-файл")} <span className="f">{t("bazasiz", "без базы")}</span></td><td>jsdom <span className="f">{t("bazasiz", "без базы")}</span>{t(" · sinov papkasi loyihadan tashqarida", " · папка проверки вне проекта")}</td></tr>
      </tbody></table>
    </div>
    <div className="z-rule">{t("Ikkalasi «eski javob yangisini bosmasin» himoyasini ", "Оба добавили защиту «старый ответ не перекроет новый» ")}<b>{t("o'zi qo'shdi", "сами")}</b>{t(" — lekin ", " — но проверяли ")}<b>{t("haqiqiy bazasiz", "без настоящей базы")}</b>{t(" sinagan.", ".")}</div>
  </div>;
}
const S17 = mkS(17, [{ v: 'stage' }, { v: 'prompt' }, { v: 'cards' }, { v: 'quote' }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <>
    {(seg.v === 'stage' || seg.v === 'prompt') && <div className="c1-stage">
      <div style={{ '--c': T.ink3, opacity: 0.45 }}><h4>{t("1–4-bosqich · siz", "Этапы 1–4 · вы")}</h4><p>{t("da'vo, uch usul, tuzatish, takror tinglovchi, tiklash", "утверждение, три способа, исправление, повторный слушатель, восстановление")}</p></div>
      <div style={{ '--c': C1.ai }}><h4>{t("5-bosqich · AI tuzatadi, siz qabul qilasiz", "Этап 5 · исправляет AI, вы принимаете")}</h4><p>{t("shikoyat → ikki tuzatish → haqiqiy bazada sinov", "жалоба → два исправления → проверка на настоящей базе")}</p></div>
    </div>}
    {seg.v === 'prompt' && <div style={{ marginTop: 10 }}><AiReply who={t("Prompt — ikkala AI'ga bir xil", "Промпт — одинаковый для обоих AI")} prompt={KOD.PROMPT1} tag={t("ishorasiz: connect, qayta so'rash, tinglovchi yo'q", "без подсказок: нет connect, повторного запроса, слушателя")} /></div>}
    {seg.v === 'cards' && <div className="pg-two">
      <AiReply who={t("1-AI (kuchli model)", "1-й AI (сильная модель)")} said={<>{KOD.AI.ai1.stat} · <code>connect</code> → <code>holatQoy</code> + <b><code>yukla()</code></b>{t(" · so'rov raqami (", " · номер запроса (")}<code>soroqRaqami</code>{t(") — faqat oxirgi javob chiziladi · ", ") — рисуется только последний ответ · ")}<code>try/catch</code>{t(" tarmoq xatosida · README'ga bir qator", " при ошибке сети · одна строка в README")}</>} />
      <AiReply who={t("2-AI (kuchsizroq model)", "2-й AI (модель слабее)")} said={<>{KOD.AI.ai2.stat} · <code>connect</code> → <code>holatQoy</code> + <b><code>yukla()</code></b>{t(" · so'rov raqami (", " · номер запроса (")}<code>sorovSoni</code>{t(") · tinglovchi joyida qoldi", ") · слушатель остался на месте")}</>} />
    </div>}
    {seg.v === 'quote' && <Cmp17 />}
  </>} />;
}

// ============================================================
//  18 · AI tuzatishlari haqiqiy bazada (ws2v2-ai/*/01, ai1/01a, ai1 diff)
// ============================================================
const DIFF18 = KOD.AI.ai1.diff.split('\n').filter((l) => /soroqRaqami|const men|men !== /.test(l)).map((l) => ({ h: liveLine(l) }));
const P18A = L1A.filter((l) => /brauzer: (WebSocket|kadr)/.test(l)).slice(-3).map((l) => ({ h: liveLine(ms(l)) }));
const FOUR18 = ["Ro'yxat connect'da so'raladimi?", 'Tinglovchi bittami — connect dan tashqaridami?', 'Sinovda xato haqiqatan yuz berdimi — eski kod yiqildimi?', "Nima ortiqcha qo'shildi — kerakmi?"];
const S18 = mkS(18, [{ v: 'two' }, { v: 'diff' }, { v: 'luck' }, { v: 'four' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {seg.v === 'two' && <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'grid', gap: 6 }}><PanelView k="ai1-3" small label={t("1-AI · server qayta yongach", "1-й AI · после перезапуска сервера")} /><Term title="1-AI" lines={jt(lastLine('ai1', /^## Navbatdagi/).replace(/^## /, ''))} /></div>
      <div style={{ display: 'grid', gap: 6 }}><PanelView k="ai2-3" small label={t("2-AI · server qayta yongach", "2-й AI · после перезапуска сервера")} /><Term title="2-AI" lines={jt(lastLine('ai2', /^## Navbatdagi/).replace(/^## /, ''))} /></div>
    </div>}
    {seg.v === 'diff' && <CodePanel file={t("1-AI · admin.html · git diff (so'rov raqami)", "1-й AI · admin.html · git diff (номер запроса)")} lines={DIFF18} />}
    {seg.v === 'luck' && <Term title={t("1-AI nusxasi · birinchi urinish — panel buyurtmadan oldin ulandi (01a)", "копия 1-го AI · первая попытка — панель подключилась до заказа (01a)")} lines={[...P18A, { h: liveLine(t('# hodisa oddiy yo\'l bilan keldi — xato yuz bermagan, eski kod ham o\'tardi', "# событие пришло обычным путём — ошибки не было, старый код тоже прошёл бы")) }]} />}
    {seg.v === 'four' && <div className="mk-light" style={{ padding: 16 }}><div className="mk-tag">{t("AI'ning qayta ulanish tuzatishini qabul qilish — to'rt savol", "Приём исправления переподключения от AI — четыре вопроса")}</div><div className="mk-plan">{FOUR18.map((x, i) => <div key={i} className="hl" style={{ animation: `mk-up .4s ${i * 0.1}s ease both` }}><b>0{i + 1}</b><span>{x}</span></div>)}</div></div>}
  </>} />;
}

// ============================================================
//  19 · Tekshiruv 4 — «sinadim, o'tdi» (ai1/01a)
// ============================================================
function Screen19(p) {
  return MC(p, 19, {
    above: <Term title={t("panel logi · 1-AI nusxasi, birinchi urinish (01a)", "лог панели · копия 1-го AI, первая попытка (01a)")} lines={P18A} />,
    after: <div style={{ display: 'grid', gap: 8 }}><Term title={t("qayta sinov — buyurtma panel ulanishidan oldin (ai1/01)", "повторная проверка — заказ до подключения панели (ai1/01)")} lines={jt(lastLine('ai1', /^## Navbatdagi/).replace(/^## /, ''))} /><PanelView k="ai1-3" small label={t("1-AI · qayta sinov", "1-й AI · повторная проверка")} /></div>,
  });
}

// ============================================================
//  20 · m10-05 xaritasi (BreakAndFixLesson.jsx — SCREEN_META 19)
// ============================================================
const BLOK20 = [['1 Kirish', "s0 «bajardim» — da'vo · s1 reja", "README «o'zi yangilanadi» (3-ekran)"], ['2 Uch muammo', 's2–s3 uzilish · s4–s5 takror · s6–s7 xona', '4, 10-ekran; xona — 21-ekran'], ['3 Tinglovchi', 's8 kod oynasi', "connect ichidagi on (11-ekran)"], ['4 Yozuv va qayta tekshiruv', 's9 yozuv · s10 test · s11 qayta tekshiruv · s12 mustaqil', "shu urinishda (3) · hodisa kelgan urinish — isbot emas (19)"], ['5 Amaliyot', "A1 o'z ilovasini buzish · A2 agentga tuzattirish", '22-ekran']];
const S20 = mkS(20, [{ v: 'cards' }, { v: 'cards', three: true }, { v: 'blok' }, { v: 'teg' }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m10-05 (19 ekran)", "Ученик · m10-05 (19 экранов)")} hl><p><b>Maydon Jamoa</b>{t(" — agent «uchala chekka holatni bajardim» · uch usul: internetni uzish · fonga olish · Backend'ning yangi versiyasi · buzish yozuvi · tuzatish ", " — агент «выполнил все три крайних случая» · три способа: отключить интернет · уход в фон · новая версия Backend · запись поломки · исправление в ")}<code>ulanish.ts</code>{t(" da", "")}</p>{seg.three && <p style={{ marginTop: 6 }}><b>{t("Uch muammo:", "Три проблемы:")}</b>{t(" son eski · jonli xabar ikki marta · «Hozir ko'ryapti» kam", " число старое · живое сообщение дважды · «Hozir ko'ryapti» меньше")}</p>}</Card>
      <Card c={T.accent} h={t("Siz · bugun", "Вы · сегодня")}><p>{t("OrderBotNest: da'vo · uch usul · ", "OrderBotNest: утверждение · три способа · ")}<code>connect</code>{t(" da qayta so'rash · takror tinglovchi · tiklash · AI", " : повторный запрос · повторный слушатель · восстановление · AI")}</p></Card>
    </div>}
    {seg.v === 'blok' && <table className="pg-dict"><tbody>{BLOK20.map(([a, b, c]) => <tr key={a}><td><b>{a}</b></td><td>{b}</td><td>{c}</td></tr>)}</tbody></table>}
    {seg.v === 'teg' && <div className="pg-two"><Card c={T.ink3} h="m12-dars-05-start"><p>kod = <code>m12-dars-04-done</code>{t(" — agent «bajardim» degan holat; tinglovchi ", " — состояние, когда агент сказал «выполнил»; слушатель внутри ")}<code>connect</code>{t(" ichida", " ")}</p></Card><Card c={T.green} h="m12-dars-05-done"><p><code>BUZISH.md</code>{t(" + tuzatish ", " + исправление ")}<code>mobil/src/ulanish.ts</code>{t(" da; Backend o'zgarmagan", " ; Backend не менялся")}</p></Card></div>}
  </>} />;
}

// ============================================================
//  21 · Maydon Jamoa'dagi uchinchi muammo — xona (manba/ws2-out/05, 06; ulanish.ts m12-dars-05)
// ============================================================
const MJ5 = KOD.OUT.mj05.split('\n').filter((l) => l.trim() && !/^#/.test(l));
const mjl = (L) => L.map((l) => ({ h: liveLine(l.replace(/^\s+/, '')) }));
const MJ5A = mjl(MJ5.slice(0, MJ5.findIndex((l) => /yangi versiyasi/.test(l))));
const MJ5B = mjl(MJ5.slice(MJ5.findIndex((l) => /yangi versiyasi/.test(l))).filter((l) => !/io client disconnect/.test(l)));
const MJ6 = mjl(KOD.OUT.mj06.split('\n').filter((l) => l.trim() && !/^#|^\$|io client disconnect/.test(l)).slice(-7));
const MJC = lineN('MJ_UL', /ulanish\.on\('connect'/);
const MJC_END = lineN('MJ_UL', /^\s+\}\);$/, MJC);
const ROWS21 = [["Son eski (uzilishdagi hodisa)", "bor — 4, 6, 13-ekran", "bor — s2–s3"], ['Takror tinglovchi', "tuzatishdagi tuzoq — 10-ekran", "boshidan bor — s4–s5"], ['Xona («Hozir ko\'ryapti»)', "yo'q — panel hammaga bitta hodisa oladi", "bor — s6–s7"]];
const S21 = mkS(21, [{ v: 'a' }, { v: 'b' }, { v: 'fix' }, { v: 'tab' }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <>
    {seg.v === 'a' && <Term title={t("maydon-jamoa · m12-dars-05-start · Backend haqiqiy (05)", "maydon-jamoa · m12-dars-05-start · настоящий Backend (05)")} lines={MJ5A} />}
    {seg.v === 'b' && <Term title={t("maydon-jamoa · yangi versiyadan keyin (05)", "maydon-jamoa · после новой версии (05)")} lines={MJ5B} er />}
    {seg.v === 'fix' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file="maydon-jamoa · mobil/src/ulanish.ts · m12-dars-05-done" lines={kod('MJ_UL', rngIds(MJC + 1, MJC_END - 1, 'f'), MJC, MJC_END)} focus={['f']} /><Term title={t("tuzatilgan (06)", "исправлено (06)")} lines={MJ6} /></div>}
    {seg.v === 'tab' && <table className="c1-res"><thead><tr><th>{t("Muammo", "Проблема")}</th><th>OrderBotNest</th><th>{t("Maydon Jamoa (o'quvchi)", "Maydon Jamoa (ученик)")}</th></tr></thead><tbody>{ROWS21.map((r) => <tr key={r[0]}>{r.map((x, i) => <td key={i}>{x}</td>)}</tr>)}</tbody></table>}
  </>} />;
}

// ============================================================
//  22 · A1 va A2 — o'quvchi o'z ilovasini buzadi (BreakAndFixLesson ScreenA1, ScreenA2)
// ============================================================
const A1_22 = [["Uchish rejimi", "«Ulanmoqda…» kuting (bir daqiqagacha) → agent o'zgarish qiladi → uchish rejimini o'chiring"], ['Fonga olish', "boshqa ilovaga o'ting → o'zgarish → bir daqiqadan keyin qayting"], ["Render'da qayta chiqarish", "«Manual Deploy» → «Deploy latest commit» — bir necha daqiqa (⚠ sinalmagan)"]];
const A2_22 = [['Qayerda', 'mobil/src/ulanish.ts va undan foydalanadigan ekran'], ['Nima qilsin', "yozuvdagi «buzildi» qatorlari bo'yicha tuzatish"], ['Nima buzilmasin', "Backend, mavjud hodisa nomlari"]];
const S22 = mkS(22, [{ v: 'a1' }, { v: 'fly' }, { v: 'render' }, { v: 'a2' }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <>
    {(seg.v === 'a1' || seg.v === 'render') && <div className="pg-three">{A1_22.map(([h, tx], i) => <Card key={h} c={seg.v === 'render' && i === 2 ? T.accent : T.blue} h={`${i + 1} · ${h}`} hl={seg.v === 'render' && i === 2} dim={seg.v === 'render' && i !== 2}><p>{tx}</p></Card>)}</div>}
    {seg.v === 'fly' && <div className="pg-two"><Card c={T.blue} h={t("O'quvchi · uchish rejimi", "Ученик · режим полёта")}><p>{t("«bir daqiqagacha kuting» — erta qaytsa «buzilmadi»", "«подождите до минуты» — если вернуться рано, «buzilmadi»")}</p></Card><Card c={T.accent} h={t("Siz · Offline (6-ekran)", "Вы · Offline (экран 6)")} hl><p>{t("6 s — buzilmadi · 60 s — buzildi: ping 25 + 20 s", "6 s — не сломалось · 60 s — сломалось: ping 25 + 20 s")}</p></Card></div>}
    {seg.v === 'a2' && <div style={{ display: 'grid', gap: 8 }}><div className="pg-three">{A2_22.map(([h, tx]) => <Card key={h} c={C1.ai} h={h}><p>{tx}</p></Card>)}</div><div className="mk-rule">{t("Agentning «tuzatdim»i ham ", "«Исправил» от агента — тоже ")}<b>{t("da'vo", "утверждение")}</b>{t(" — «buzildi» urinishlari xuddi shu usul bilan qaytariladi.", " — попытки «buzildi» повторяются тем же способом.")}</div></div>}
  </>} />;
}

// ============================================================
//  23 · Sinfdagi holatlar va o'quvchi savollari
// ============================================================
const CARDS23 = [["Belgi «Ulangan», son eski", 'uzilishdan keyin', "connect da qayta so'rash yo'q"], ['Jonli xabar ikki marta', 'qayta ulanishdan keyin', 'tinglovchi connect ichida'], ["«Hozir ko'ryapti» kam", 'yangi versiyadan keyin', "xonaga qayta kirish yo'q"], ['Hamma urinish «buzilmadi»', 'uchish rejimi qisqa yoki Expo Go qayta yuklagan ⚠', 'bir daqiqa kuting; bu ham natija'], ['«Ulanmoqda…» uzoq', 'Render qayta chiqyapti ⚠', 'bir necha daqiqa'], ['Agent «tuzatdim» dedi', 'qayta tekshiruv qilinmagan', 'xuddi shu usul bilan qaytarish']];
const QA23 = [
  ["«Socket.io o'zi qayta ulanadi-ku, nega tuzatamiz?»", "Ulanishni tiklaydi, lekin o'tkazib yuborilgan hodisani va xonani tiklamaydi."],
  ["«Server o'tkazilgan hodisani o'zi qayta bersa bo'lmaydimi?»", "socket.io'da connectionStateRecovery bor, lekin u server xotirasida: yangi versiya chiqqanda yo'q. Qayta so'rash baribir kerak."],
  ['«Tinglovchi ikki marta bo\'lsa, nima yomon?»', "Har o'zgarish ikki marta so'raladi, jonli xabar ikki marta chiqadi; har qayta ulanishda yana ko'payadi."],
  ["«Backend'ni tuzatish kerakmi?»", "Yo'q: uchala tuzatish ilovada (ulanish.ts)."],
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
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: qayta ulanish, uzilishdagi hodisa, tuzatish, takror tinglovchi, Offline, tiklash va AI sinovi. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi yoki agent bajardim desa, u bilan birga xuddi shu usul bilan buzib ko'rasiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
  { k: 'q', t: "socket.io ulanishni o'zi tiklaydi, lekin bu yangi ulanish: uzilish paytida yuborilgan hodisa unga kelmaydi — server hodisani faqat hozir ulanganlarga beradi", st: ['q'] },
  { k: 'bz', t: "«O'zi yangilanadi» — da'vo; tekshiruv — buzib ko'rish va yozuv: usul · nima qildim · nima kutdim · nima bo'ldi → belgi (shu kompyuterda, shu urinishda)", st: ['bz'] },
  { k: 'm3', t: "Uch usul, bitta sabab: server qayta yonishi (Telegram navbati panel ulanishidan tez), Offline ping vaqtidan uzun (60 s buziladi, 6 s — yo'q), tarmoq uzilishi", st: ['bz'] },
  { k: 'fx', t: "Tuzatish: connect ichida yukla() — birinchi va har qayta ulanishda ro'yxat bazadan; tinglovchi bir marta, connect dan tashqarida (ichida — takror GET)", st: ['fx'] },
  { k: 'rc', t: "connectionStateRecovery — qisqa tarmoq uzilishida yordam beradi; server qayta yonganda va hodisa olmagan klientda — yo'q. Qayta so'rash majburiy, tiklash — qo'shimcha", st: ['rc'] },
  { k: 'ai', t: "AI tuzatishiga to'rt savol: qayerda so'raydi · tinglovchi nechta · sinovda eski kod yiqildimi · nima ortiqcha qo'shildi; hodisa kelgan urinish — isbot emas", st: ['ai'] },
];
const STATIONS25 = [['q', 'Qayta ulanish', T.blue], ['bz', 'Da\'vo · buzish', T.accent], ['fx', "connect'da so'rash", T.green], ['rc', 'Tiklash', C1.ws], ['ai', 'AI', C1.ai]];
function SummaryMap25({ hl }) {
  const cur = SUM25.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">{t("Bugungi dars — ulanish uzilsa: buzamiz va tuzatamiz", "Сегодняшний урок — если соединение оборвалось: ломаем и чиним")}</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 6 }}>
      {STATIONS25.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 13, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK25 = [
  { t: "Holat — Offline («Ulanmoqda…» bo'lguncha) → admin botda /orders dan tasdiqlaydi → Online: «Tasdiqlandi» ko'rindimi", c: [] },
  { t: "Yozuv — BUZISH.md ga yangi qator: usul · nima qildim · kutdim · bo'ldi · belgi", c: [] },
  { t: "Klient — scripts/live-client.js: connect da recovered qiymatini chiqaring", c: ['console.log(`connect · recovered=${s.recovered}`)'] },
  { t: "Tiklash — gateway'ga connectionStateRecovery: tarmoq uzilishi va server qayta yonishida recovered — ikki qator", c: ['@WebSocketGateway({ connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000 } })'] },
  { t: "Topshirish — README «Qayta ulanish» ga qaroringiz (bir gap) → git push → repo linki platformaga", c: ['git add . && git commit -m "qayta ulanish: holat va tiklash sinovi"', 'git push'] },
];
const CHEATSHEET25 = `# WebSocket: ulanish uzilsa — mentor eslatmasi (OrderBotNest)
## Loyiha
git fetch --tags · git checkout ws2-start (= ws1-done) → ws2-done (public/admin.html, scripts/live-client.js, BUZISH.md) · npm run start:dev → http://localhost:3000/admin · npm run live
## Umumiy tushuncha
socket.io ulanishni o'zi tiklaydi — bu YANGI ulanish · server.emit faqat hozir ulanganlarga · uzilish paytidagi hodisa keyin kelmaydi · ro'yxat bazada → har connect da qayta so'rash
## Buzish yozuvi (BUZISH.md)
№ · Usul · Nima qildim · Nima kutdim · Nima bo'ldi · Belgi (buzildi / buzilmadi) · Tuzatish · Qayta tekshiruv — «nima bo'ldi» = ko'rgan narsa; «buzilmadi» — shu urinishda, isbot emas
## Uch usul
server qayta yondi (Ctrl+C → start; Telegram navbatidagi xabar panel ulanishidan oldin bajariladi) · DevTools → Network → Offline: 6 s — buzilmaydi (kadr Online'da keladi), 60 s — buziladi (~33–40 s da «Ulanmoqda…») · tarmoq uzildi (panel boshqa kompyuterda)
## Tuzatish (admin.html)
ulanish.on('connect', () => { holatQoy('ulangan'); yukla(); }) · alohida yukla() olib tashlandi — ro'yxat ikki joyda: connect va order-changed · ulanish.on('order-changed', () => yukla()) — BIR MARTA, connect dan tashqarida
## Tuzoq
tinglovchi connect ichida → har qayta ulanishda yana bittasi: bitta hodisaga 1 → 2 → 3 GET (F12 → Network, filtr orders), sariq belgi yo'qoladi
## connectionStateRecovery
@WebSocketGateway({ connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000 } }) · tarmoq qisqa uzilsa: recovered=true, o'tkazilgan hodisa keladi · server qayta yonsa yoki klient hodisa olmagan bo'lsa: recovered=false · qayta so'rash majburiy, tiklash — qo'shimcha
## AI tuzatishiga to'rt savol
ro'yxat connect da so'raladimi · tinglovchi bittami, tashqaridami · sinovda xato yuz berdimi (eski kod yiqildimi) · nima ortiqcha qo'shildi (so'rov raqami — zararsiz)
## Sinfga tayyorgarlik (m10-05, 19 ekran)
Maydon Jamoa: agent «bajardim» — da'vo · uch usul: internetni uzish · fonga olish · Backend yangi versiyasi · uch muammo: son eski · jonli xabar ikki marta · «Hozir ko'ryapti» kam (xona — uzilganda chiqadi, qayta kirish kerak) · tuzatish ulanish.ts da, Backend o'zgarmaydi · m12-dars-05-start → done
## Sinfdagi holatlar
son eski → qayta so'rash yo'q · xabar ikki marta → tinglovchi connect ichida · «Hozir ko'ryapti» kam → xonaga qaytish yo'q · hammasi «buzilmadi» → uchish rejimi qisqa / Expo Go · Render uzoq · agent «tuzatdim» → xuddi shu usul bilan qaytarish
## Sizning uyga vazifangiz (40–60 daqiqa)
holat o'zgarishini Offline bilan buzish · BUZISH.md qatori · live-client'da recovered · tiklash — ikki holat · README qarori · repo linki platformaga`;
const s25Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Qayta ulanish — <b>yangi ulanish</b>; uzilishdagi hodisa kelmaydi", "Birinchi: socket.io ulanishni o'zi tiklaydi, lekin bu yangi ulanish. Server hodisani faqat hozir ulanganlarga yuboradi, uzilish paytidagisi keyin kelmaydi.", { hl: 'q' }),
  sg('b2', "«O'zi yangilanadi» — <b>da'vo</b>; tekshiruv — buzish yozuvi", "Ikkinchi: o'zi yangilanadi degan gap da'vo. Tekshiruv buzib ko'rish va har urinishni yozish: usul, nima qildim, nima kutdim, nima bo'ldi va belgi.", { hl: 'bz' }),
  sg('b3', "<b>Uch usul, bitta sabab</b>: qayta yonish, Offline, tarmoq", "Uchinchi: uch usul. Server qayta yonadi, Telegram navbati panel ulanishidan tez. Offline ping vaqtidan uzun, bir daqiqa. Tarmoq uziladi. Sabab bitta: hodisa o'tib ketgan.", { hl: 'm3' }),
  sg('b4', "Tuzatish: <b>connect ichida yukla()</b>; tinglovchi — tashqarida", "To'rtinchi: tuzatish connect ichida yukla, har ulanishda ro'yxat bazadan. Tinglovchi bir marta, connect'dan tashqarida, aks holda har qayta ulanishda yana bittasi qo'shiladi.", { hl: 'fx' }),
  sg('b5', "Tiklash — <b>qo'shimcha</b>; qayta so'rash — majburiy", "Beshinchi: connection state recovery qisqa tarmoq uzilishida yordam beradi. Server qayta yonganda esa holat yo'qoladi. Shuning uchun qayta so'rash majburiy, tiklash faqat qo'shimcha.", { hl: 'rc' }),
  sg('b6', "AI tuzatishiga <b>to'rt savol</b>: xato haqiqatan yuz berdimi", "Oltinchi: AI tuzatishiga to'rt savol. Qayerda so'raydi, tinglovchi nechta, sinovda eski kod yiqildimi, nima ortiqcha qo'shildi. Hodisa kelgan urinish isbot emas.", { hl: 'ai' }),
  sg('hw', "<b>Uyga vazifa</b>: holat o'zgarishini buzing; tiklashni sinang", "Uyga vazifa: holat o'zgarishini ham buzib tekshiring. Offline paytida admin buyurtmani tasdiqlasin, keyin Online. Natijani buzish yozuviga qator qilib yozing.", { hl: 'hw' }),
  sg('hw2', "Klientda <b>recovered</b>, gateway'da tiklash — ikki holat; qaror README'ga", "Keyin terminal klientiga recovered qiymatini qo'shing, gateway'da tiklashni yoqing va tarmoq uzilishi hamda server qayta yonishida natijani yozing. Qaroringizni README'ga, linkni platformaga. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: uch usul, tuzatish, tuzoq, tiklash, AI savollari — bir sahifada", "Pastda bir sahifalik eslatma: umumiy tushuncha, buzish yozuvi, uch usul, tuzatish va tuzoq, tiklash chegarasi, AI'ga to'rt savol, m10-05 xaritasi va sinfdagi holatlar. Nusxalab yoki yuklab oling.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET25, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('websocket-qayta-ulanish-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
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
            <div className="mk-plan">{SUM25.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 40–60 daqiqa', 'Домашнее задание · 40–60 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK25.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>{t("Tekshiruvchi qaraydi:", "Проверяющий смотрит:")}</b>{t(" yozuvda «Nima bo'ldi» — ko'rgani · ", " в записи «Что было» — увиденное · ")}<code>recovered</code>{t(" qiymati ikki holatda · qaror sababi bilan · ", " значение в двух случаях · решение с причиной · ")}<code>connect</code>{t(" da qayta so'rash o'chirilmagan.", " повторный запрос в connect не удалён.")}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("Webhook", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("To'lov xabari: imzo, takror va rad", RS('NEXT_D'))}</div></div>
          </div>}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  Muqova va ildiz
// ============================================================
function Cover({ onStart, resume }) {
  return (
    <div className="mk-cover"><div className="card">
      <p className="mk-eyebrow">{t("Mentor kursi · WebSocket", "Курс для менторов · WebSocket")}</p>
      <h1>{t(LESSON_TITLE, RS('TITLE'))}</h1>
      <p>{t("Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.", 'Урок озвучен. На каждом экране говорит учитель, экран меняется вместе с ним. Проверьте наушники или громкость.')}</p>
      <ul>
        {t(["Jami taxminan 1 soat 15–30 daqiqa: ovoz ~25 daqiqa · uchta amaliyot 50–60 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 12-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: WebSocket-1 mentor darsi (OrderBotNest nusxangiz, jonli panel) · Telegraf darsidagi bot tokeni va PostgreSQL · Chrome (DevTools) · telefon · AI yordamchi", "Loyiha: github.com/Azizbekcrypto/OrderBotNest — ws2-start (= ws1-done) → ws2-done; har chiqish haqiqiy server, baza va brauzerdan"], RS('COVER')).map((x) => <li key={x}>{x}</li>)}
      </ul>
      <CoverStart onStart={onStart} resume={resume} />
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenP9, Screen10, Screen11, ScreenP12, Screen13, Screen14, Screen15, ScreenP16, Screen17, Screen18, Screen19, Screen20, Screen21, Screen22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function WsReconnectMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
  setLang(lang);
  useCss();
  useCss3();
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
