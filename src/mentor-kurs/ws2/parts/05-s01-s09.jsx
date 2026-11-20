
// ============================================================
//  1 · Kirish — dars oxiridagi natija: server qayta yongach #2 sariq (ws2v2-out/04, 3-surat)
// ============================================================
const PLAN1 = ['Umumiy tushuncha', "Yo'qolgan buyurtma", 'Takror tinglovchi', 'Tarmoq va tiklash', 'AI', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4, 5] }, { hl: [5] }], { plan: PLAN1 });
// F-1120-02 (M51): darsning rasmi — «Buyurtma boti» xaritasi + admin paneli; bugungi savol — server qayta yonganda yoki tarmoq uzilganda
// o'chiq paytdagi buyurtma panelga yetadimi. Panel belgisi — admin.html dagi haqiqiy yozuv (tarjima qilinmaydi)
const DB_ALL = { products: 'db', users: 'db', carts: 'db', orders: 'db' };
const LIVE_ON = ['phone', 'telegram', 'order', 'db', 'orders'];
const PNL = (steps, res, badge) => ({ get name() { return t('Admin panel', 'Админ-панель'); }, get steps() { return typeof steps === 'function' ? steps() : steps; }, res, badge }); // steps — funksiya bo'lsa render paytida (tarjima)
const S1M = [
  { on: LIVE_ON, note: { get orders() { return t("#2 — server o'chiq paytda", '#2 — пока сервер выключен'); } }, jest: PNL([['connect → yukla()', 'ok'], ['order-changed', 'ok']], 'pass', 'Ulangan') },
  { on: ['telegram', 'orders', 'db'], note: { get orders() { return t("#2 bazada, panelda yo'q", '#2 в базе, в панели нет'); } }, jest: PNL(() => [['transport close', 'bad'], [t('qayta ulandi', 'переподключился'), 'ok']], 'fail', 'Ulangan') },
  { on: LIVE_ON, jest: PNL(() => [['connect → yukla()', 'ok'], [t('tinglovchi bitta', 'один слушатель'), 'ok']], 'pass', 'Ulangan') },
  { on: LIVE_ON, jest: PNL([['connect → yukla()', 'ok'], ['order-changed', 'ok']], 'pass', 'Ulangan') },
];
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg, beat }) => { const m = S1M[Math.min(beat, 3)]; return <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 12 }}>
    <BotMap loc={DB_ALL} {...m} tag={t("Bugungi darsning rasmi — uzilishdan keyin panel buyurtmani yo'qotmaydimi", 'Картина урока — не теряет ли панель заказ после обрыва')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>; }} />;
}

// ============================================================
//  2 · Qayta ulanish nimani tiklaydi, nimani yo'q (ws2v2-out/01 — terminal)
// ============================================================
const T2 = sec('01', 'Terminal');
const FLOW2 = [['on', 'Ulangan', "#1 ko'rindi", T.green], ['off', 'Uzildi', "server o'chdi", '#B7791F'], ['ev', 'Buyurtma #2', 'order-changed → 0 panel', T.accent], ['re', 'Qayta ulandi', 'yangi ulanish', C1.ws], ['old', "Ro'yxat eski", 'faqat #1', T.accent]];
// F-1109-06: beshta kichik karta o'rniga katta oqim (uzilishdagi hodisa → 0 panel) va pastda yechim aylanasi
function Lost2({ fix }) {
  return <div className="z">
    <div className={'z-card' + (fix ? '' : ' hl')}>
      <p className="z-h">{t("Uzilish paytida yuborilgan hodisa — kimga yetadi?", "Событие, отправленное во время обрыва, — кому дойдёт?")}</p>
      <div className="z-flow">
        <div className="z-st ok"><b>{t("Ulangan", "Подключено")}</b><span className="z-mut">{t("#1 ko'rindi", "#1 видно")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st bad"><b>{t("Uzildi", "Обрыв")}</b><span className="z-mut">{t("server o'chdi yoki tarmoq", "сервер выключился или сеть")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ac"><b>{t("Buyurtma #2", "Заказ #2")}</b><span className="zm">order-changed</span><span className="z-tag r">{t("0 panel", "0 панелей")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st blue"><b>{t("Qayta ulandi", "Переподключилась")}</b><span className="z-mut">{t("yangi ulanish", "новое соединение")}</span></div>
        <div className="z-ar bad">→</div>
        <div className="z-st bad"><b>{t("Ro'yxat eski", "Список старый")}</b><span className="zm">{t("faqat #1", "только #1")}</span></div>
      </div>
      <span className="z-mut">{t("socket.io ulanishni o'zi tiklaydi — lekin server hodisani faqat ", "socket.io сам восстанавливает соединение — но сервер шлёт событие только ")}<b>{t("hozir ulanganlarga", "подключённым сейчас")}</b>{t(" yuboradi.", ".")}</span>
    </div>
    <div className={'z-card' + (fix ? ' hl' : ' dim')} style={{ borderColor: 'var(--ok)' }}>
      <p className="z-h" style={{ color: 'var(--ok)' }}>{t("Yechim — ro'yxat bazada: har connect da qayta so'raymiz", "Решение — список в базе: при каждом connect запрашиваем заново")}</p>
      <div className="z-flow">
        <div className="z-st blue"><b>connect</b><span className="z-mut">{t("birinchi ham, qayta ham", "и первый, и повторный")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st"><b>GET /admin/orders</b><span className="z-mut">{t("bazadan to'liq ro'yxat", "полный список из базы")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>{t("Ro'yxat to'g'ri", "Список верный")}</b><span className="zm">#2, #1</span><span className="z-mut">{t("uzilishda nima bo'lgani muhim emas", "неважно, что было во время обрыва")}</span></div>
      </div>
    </div>
  </div>;
}
const S2 = mkS(2, [{ v: 'term' }, { v: 'flow' }, { v: 'two' }, { v: 'rule' }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <>
    {seg.v === 'term' && <Term title={t("VS Code terminali · npm run live (ws2-start)", "терминал VS Code · npm run live (ws2-start)")} lines={T2} />}
    {seg.v === 'flow' && <Lost2 />}
    {seg.v === 'two' && <div className="pg-two">
      <Card c={T.green} h={t("Tiklanadi", "Восстанавливается")}><p>{t("ulanishning o'zi · token (", "само соединение · токен (")}<code>auth</code>{t(" har ulanishda qayta yuboriladi) · tinglovchilar — klientda turadi", " отправляется заново при каждом подключении) · слушатели — живут в клиенте")}</p></Card>
      <Card c={T.accent} h={t("Tiklanmaydi", "Не восстанавливается")} hl><p>{t("uzilish paytidagi hodisa · serverning shu ulanishga bog'lagan narsasi — masalan, ", "событие во время обрыва · то, что сервер привязал к этому соединению, — например, ")}<b>{t("xona", "комната")}</b>{t(" (o'quvchi darsida)", " (в уроке ученика)")}</p></Card>
    </div>}
    {seg.v === 'rule' && <Lost2 fix />}
  </>} />;
}

// ============================================================
//  3 · «O'zi yangilanadi» — da'vo; buzish yozuvi (README ws2-start, BUZISH.md ws2-done)
// ============================================================
const RD3 = lineN('README_START', /o'zi yangilanadi/);
const BZ_HEAD = KOD.BUZISH.lines.find((l) => /^\| № \|/.test(l.t)).t.split('|').map((x) => x.trim()).filter(Boolean).slice(0, 6);
const METHODS3 = [['Server qayta yondi', 'deploy yoki xato — Ctrl+C va qayta', T.green], ['Brauzer Offline', 'DevTools → Network → Offline', '#B7791F'], ['Tarmoq uzildi', "panel boshqa kompyuterda, server Render'da", C1.ws]];
// F-1109-06: xulosa — ikki ta'rif kartasi o'rniga BUZISH yozuvi jadval bo'lib (1-qator haqiqiy, BUZISH.md), belgi ma'nosi va «da'vo» qoidasi
function Buz3() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("BUZISH yozuvi — har urinish bir qator (o'quvchi darsidagi BUZISH.md ustunlari)", "Запись BUZISH — каждая попытка одна строка (колонки BUZISH.md из урока ученика)")}</p>
      <table className="z-tbl w2-b3"><tbody>
        <tr><th>{t("usul", "способ")}</th><th>{t("nima qildim", "что сделал")}</th><th>{t("nima kutdim", "что ожидал")}</th><th>{t("nima bo'ldi — ekranda", "что произошло — на экране")}</th><th>{t("belgi", "отметка")}</th></tr>
        <tr><td>{t("server qayta yondi", "сервер перезапущен")}</td><td>{t("Ctrl+C, 5 s, qayta yoqdim; o'chiq paytda Bobur buyurtma berdi", "Ctrl+C, 5 s, снова включил; пока был выключен, Бобур сделал заказ")}</td><td>{t("ro'yxatda #2", "в списке #2")}</td><td>{t("«Ulangan» · ro'yxat: #1 · bazada 2 ta", "«Ulangan» · список: #1 · в базе 2")}</td><td><span className="bz">{t("buzildi", "сломалось")}</span></td></tr>
        <tr className="w"><td>{t("brauzer Offline", "браузер Offline")}</td><td>DevTools → Network → Offline</td><td>…</td><td>…</td><td>…</td></tr>
        <tr className="w"><td>{t("tarmoq uzildi", "обрыв сети")}</td><td>{t("panel va server orasidagi proksi kesildi", "прокси между панелью и сервером оборван")}</td><td>…</td><td>…</td><td>…</td></tr>
      </tbody></table>
      <span className="z-mut">{t("«nima bo'ldi» ustuniga taxmin emas — ekranda ko'rilgan narsa yoziladi", "в колонку «что произошло» пишется не догадка — то, что видно на экране")}</span>
    </div>
    <div className="z-two">
      <div className="z-card" style={{ borderColor: 'var(--bad)' }}><b style={{ color: 'var(--bad)' }}>{t("buzildi", "сломалось")}</b><span>{t("ko'rilgan narsa kutilgandan farq qildi — muammo bor", "увиденное отличается от ожидаемого — проблема есть")}</span></div>
      <div className="z-card"><b style={{ color: 'var(--ink2)' }}>{t("buzilmadi", "не сломалось")}</b><span>{t("shu kompyuterda, shu urinishda — ", "на этом компьютере, в этой попытке — ")}<b>{t("isbot emas", "не доказательство")}</b></span></div>
    </div>
    <div className="z-rule">{t("README: «ro'yxat o'zi yangilanadi» — ", "README: «список обновляется сам» — ")}<b>{t("da'vo", "заявление")}</b>{t(": aytilgan, isbotlanmagan. Tekshiruv — buzib ko'rish.", ": сказано, не доказано. Проверка — попробовать сломать.")}</div>
  </div>;
}
const S3 = mkS(3, [{ v: 'rd' }, { v: 'cols' }, { v: 'met' }, { v: 'belgi' }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <>
    {seg.v === 'rd' && <CodePanel file="OrderBotNest · README.md · ws2-start" lines={kod('README_START', { [RD3]: 'd' }, RD3 - 2, RD3 + 3)} focus={['d']} />}
    {seg.v === 'cols' && <div style={{ display: 'grid', gap: 10 }}><div className="mk-tag" style={{ margin: 0 }}>{t("Buzish yozuvi — BUZISH.md (o'quvchi darsidagi bilan bir xil ustunlar)", "Запись поломки — BUZISH.md (те же колонки, что в уроке ученика)")}</div>
      <div className="pg-three" style={{ gridTemplateColumns: 'repeat(6,minmax(0,1fr))' }}>{BZ_HEAD.map((h, i) => <div key={h} className="mk-box hl" style={{ '--c': i === 4 ? T.accent : T.blue, padding: '10px 8px', textAlign: 'center', animation: `mk-up .35s ${i * 0.08}s ease both` }}><h4 style={{ margin: 0, fontSize: 13 }}>{h}</h4></div>)}</div>
      <div className="mk-rule">{t("«Nima bo'ldi» — ", "«Что было» — ")}<b>{t("ekranda ko'rgan narsa", "то, что видели на экране")}</b>{t(", taxmin emas.", ", не догадка.")}</div></div>}
    {seg.v === 'met' && <div className="pg-three">{METHODS3.map(([h, tx, c], i) => <Card key={h} c={c} h={`${i + 1} · ${h}`}><p>{tx}</p><p style={{ marginTop: 4 }}>{t("shu paytda — buyurtma", "в этот момент — заказ")}</p></Card>)}</div>}
    {seg.v === 'belgi' && <Buz3 />}
  </>} />;
}

// ============================================================
//  4 · Server qayta yondi: buyurtma bazada, panelda yo'q (ws2v2-out/01)
// ============================================================
const SRV4 = secRaw('01', 'Server logi');
const SRV4B = SRV4.slice(SRV4.findIndex((l, i) => i > SRV4.findIndex((x) => /ishlayapti/.test(x)) && /ishlayapti/.test(l))).map((l) => ({ h: liveLine(l) }));
const BAZA4 = lastLine('01', /^## Baza/).replace(/^## /, ''); const KELDI4 = lastLine('01', /^## Navbatdagi/).replace(/^## /, '');
const S4 = mkS(4, [{ v: 'p' }, { v: 'srv' }, { v: 'p3' }, { v: 'db' }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    <PanelView k={seg.v === 'p' ? '01-1' : seg.v === 'srv' ? '01-2' : '01-3'} small label="ws2-start" />
    <div style={{ display: 'grid', gap: 8 }}>
      {seg.v === 'p' && <><PanelView k="01-2" small label={t("ws2-start · Ctrl+C dan keyin", "ws2-start · после Ctrl+C")} /><div className="mk-rule">{t("Server terminalida ", "В терминале сервера ")}<b>Ctrl+C</b>{t(" — belgi «Ulanmoqda…», ro'yxat ekranda qoladi. Shu payt Bobur botga yozdi.", " — знак «Ulanmoqda…», список остаётся на экране. В этот момент Бобур написал боту.")}</div></>}
      {seg.v === 'srv' && <Term title={t("server logi · qayta ishga tushgandan keyin", "лог сервера · после перезапуска")} lines={SRV4B} />}
      {seg.v === 'p3' && <Term title={t("VS Code terminali · npm run live", "терминал VS Code · npm run live")} lines={T2} />}
      {seg.v === 'db' && <><Card c={T.accent} h={t("Baza (psql)", "База (psql)")} hl><p><code>{BAZA4}</code></p></Card><Card c={T.ink3} h={t("Hodisa #2", "Событие #2")}><p>{KELDI4}</p></Card></>}
    </div>
  </div>} />;
}

// ============================================================
//  5 · Nega: Telegram navbati panel ulanishidan tez (telegram.service.ts, 01, ai1a)
// ============================================================
const TG_INIT = lineN('TG', /async onModuleInit\(\)/), TG_L = lineN('TG', /\.launch\(/);
const FLOW5 = [['up', 'Server yondi', 'app.listen', T.green], ['bot', 'Bot navbatni oldi', 'launch → xabar → #2', T.blue], ['ev', 'order-changed', '0 panelga', T.accent], ['try', 'Panel urinadi', '1 → 2 → 4 → 5 s', '#B7791F'], ['on', 'Ulandi', 'hodisa o\'tib ketgan', C1.ws]];
const P5A = sec('01', 'Brauzer', (l) => /WebSocket|belgi:|kadr/.test(l)).slice(-3);
const L1A = KOD.OUT.ai1a.split('\n');
const P5B = L1A.filter((l) => /^\d\d:\d\d:\d\d\.\d+ (brauzer: (WebSocket|kadr))/.test(l)).slice(-2).map((l) => ({ h: liveLine(ms(l)) }));
// F-1109-06: beshta kichik karta o'rniga haqiqiy vaqt o'qi :30–:45 (ws2v2-out/01): #2 bazaga 21:37:37, panel 21:37:39 da ulanadi
function Time5({ res }) {
  const tk = [[90, ':30'], [224, ':33'], [358, ':36'], [492, ':39'], [626, ':42'], [760, ':45']];
  return <div className="z">
    <div className="w2-vw-card">
      <svg viewBox="0 0 780 270" role="img" aria-label="server qayta yonishi vaqt o'qi">
        <rect x="397" y="28" width="98" height="206" fill="#FEE2E2" />
        <text x="446" y="22" textAnchor="middle" className="ss" fill="#B91C1C" fontWeight="700">{t("2,2 s — hodisa yo'qoldi", "2,2 s — событие потеряно")}</text>
        <line x1="90" y1="234" x2="760" y2="234" stroke="#9CA3AF" />
        {tk.map(([x, l]) => <g key={x}><line x1={x} y1="230" x2={x} y2="238" stroke="#D1D5DB" /><text x={x} y="252" textAnchor="middle" className="tt">{l}</text></g>)}
        <text x="8" y="70" className="ll">{t("Server", "Сервер")}</text>
        <rect x="90" y="56" width="268" height="22" rx="5" fill="#FECACA" /><text x="224" y="72" textAnchor="middle" className="ss" fill="#991B1B">{t("o'chiq (Ctrl+C)", "выключен (Ctrl+C)")}</text>
        <rect x="358" y="56" width="402" height="22" rx="5" fill="#BBF7D0" /><text x="560" y="72" textAnchor="middle" className="ss" fill="#166534">{t("ishlayapti", "работает")}</text>
        <text x="8" y="138" className="ll">{t("Bot · baza", "Бот · база")}</text>
        <line x1="90" y1="132" x2="760" y2="132" stroke="#E5E7EB" strokeWidth="2" />
        <circle cx="403" cy="132" r="9" fill="#EA580C" />
        <text x="418" y="122" className="ss" fill="#9A3412" fontWeight="700">{t("#2 bazada", "#2 в базе")}</text>
        <text x="418" y="152" className="ss" fill="#9A3412">{t("order-changed yuborildi", "order-changed отправлено")}</text>
        <text x="8" y="206" className="ll">{t("Panel", "Панель")}</text>
        <line x1="112" y1="200" x2="497" y2="200" stroke="#9CA3AF" strokeWidth="4" strokeDasharray="8 6" />
        <text x="230" y="190" textAnchor="middle" className="ss" fill="#4B5563">«Ulanmoqda…»</text>
        <rect x="497" y="189" width="263" height="22" rx="5" fill="#BFDBFE" /><text x="628" y="205" textAnchor="middle" className="ss" fill="#1E3A8A">{t("«Ulangan» · ro'yxat: #1", "«Ulangan» · список: #1")}</text>
        <line x1="403" y1="141" x2="403" y2="186" stroke="#EA580C" strokeWidth="2" strokeDasharray="4 4" />
        <text x="410" y="178" className="ss" fill="#B91C1C" fontWeight="700">✕</text>
      </svg>
    </div>
    <div className={'w2-res' + (res ? '' : ' dim')}>
      <div><small>{t("Bazada", "В базе")}</small><b>{t("2 ta buyurtma", "2 заказа")}</b></div>
      <div className="bad"><small>{t("Panelda", "В панели")}</small><b>{t("faqat #1", "только #1")}</b></div>
      <div className="fix"><small>{t("ws2-done tuzatishi", "исправление ws2-done")}</small><div>{t("har ", "при каждом ")}<code>connect</code>{t(" da ro'yxatni bazadan qayta so'raydi", " заново запрашивает список из базы")}</div></div>
    </div>
  </div>;
}
const S5 = mkS(5, [{ v: 'code' }, { v: 'flow' }, { v: 'two' }, { v: 'rule' }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <>
    {seg.v === 'code' && <Code k="TG" ids={rngIds(TG_L - 1, TG_L + 8, 'l')} from={TG_INIT} to={TG_L + 8} focus={['l']} />}
    {seg.v === 'flow' && <Time5 />}
    {seg.v === 'two' && <div className="pg-two">
      <Term title={t("panel · bu urinishda kech qoldi (01)", "панель · в этой попытке опоздала (01)")} lines={[...P5A, { h: liveLine(t("# order-changed #2 — kelmadi", "# order-changed #2 — не пришло")) }]} er />
      <Term title={t("panel · AI nusxasi, bir urinish — ulgurdi (ai1a)", "панель · копия AI, одна попытка — успела (ai1a)")} lines={P5B} />
    </div>}
    {seg.v === 'rule' && <Time5 res />}
  </>} />;
}

// ============================================================
//  6 · Brauzer Offline: 6 s — buzilmadi, 60 s — buzildi (ws2v2-out/02)
// ============================================================
const P6 = secRaw('02', 'Brauzer');
const OFF2 = P6.findIndex((l, i) => i > P6.findIndex((x) => /Offline yoqildi/.test(x)) && /Offline yoqildi/.test(l));
// panel logi + qadamlardagi «Bobur buyurtma berdi» satri — vaqt bo'yicha birlashtiriladi
const Q6 = secRaw('02', 'Qadamlar').filter((l) => /Bobur/.test(l));
const mix6 = (L) => { const a = L[0].slice(0, 8), b = L[L.length - 1].slice(0, 8); return [...L.map(ms), ...Q6.filter((q) => q.slice(0, 8) >= a && q.slice(0, 8) <= b)].sort((x, y) => (x.slice(0, 8) < y.slice(0, 8) ? -1 : x.slice(0, 8) > y.slice(0, 8) ? 1 : 0)).map((l) => ({ h: liveLine(l) })); };
const P6A = mix6(P6.slice(P6.findIndex((l) => /Offline yoqildi/.test(l)), OFF2));
const P6B = mix6(P6.slice(OFF2).filter((l) => !/tugadi/.test(l)));
const BAZA6 = sec('02', 'Server logi', (l) => /bazada/.test(l)).slice(-1);
function DevTools({ off }) {
  return <div className="c2-dev">
    <div className="tabs"><span>Elements</span><span>Console</span><b>Network</b><span>Application</span></div>
    <div className="tool"><span>☐ Preserve log</span><span className={`sel${off ? ' off' : ''}`}>{off ? 'Offline' : 'No throttling'} ▾</span></div>
    <div className="list"><span>No throttling · Fast 4G · Slow 4G · 3G · <b style={{ color: off ? T.accent : T.ink }}>Offline</b></span><span>model — Chrome DevTools, F12 → Network</span></div>
  </div>;
}
const S6 = mkS(6, [{ v: 'dev' }, { v: 'a' }, { v: 'b' }, { v: 'res' }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <>
    {seg.v === 'dev' && <DevTools off />}
    {seg.v === 'a' && <Term title={t("panel logi · Offline ~6 s (ws2-start)", "лог панели · Offline ~6 s (ws2-start)")} lines={P6A} />}
    {seg.v === 'b' && <Term title={t("panel logi · Offline 60 s (ws2-start)", "лог панели · Offline 60 s (ws2-start)")} lines={P6B} er />}
    {seg.v === 'res' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="02-4" small label={t("ws2-start · Online'dan keyin", "ws2-start · после Online")} /><div style={{ display: 'grid', gap: 8 }}><Term title={t("server logi", "лог сервера")} lines={BAZA6} /><div className="mk-rule">Offline <b>{t("belgi «Ulanmoqda…» bo'lguncha", "пока знак не станет «Ulanmoqda…»")}</b>{t(" ushlab turilsa — buziladi (ping: 25 + 20 s).", " держать — ломается (ping: 25 + 20 s).")}</div></div></div>}
  </>} />;
}

// ============================================================
//  7 · Tekshiruv 1 — belgi «Ulangan», buyurtma yo'q (01)
// ============================================================
function Screen7(p) {
  const L = SRV4B.filter((x) => /Buyurtma #2|panel ulandi|ishlayapti/.test(x.h)).slice(0, 3);
  return MC(p, 7, {
    above: <Term title={t("server logi · qayta ishga tushgandan keyin (01)", "лог сервера · после перезапуска (01)")} lines={L} />,
    after: <div style={{ display: 'grid', gap: 8 }}><Term title={t("baza · psql", "база · psql")} lines={jt(BAZA4)} /><Term title={t("panel logi", "лог панели")} lines={jt(KELDI4)} er /></div>,
  });
}

// ============================================================
//  8 · Tuzatish: connect da qayta so'rash (admin.html, live-client.js ws2-done; 04, 09, 11, 08)
// ============================================================
const H = { c0: lineN('HTML', /ulanish\.on\('connect'/), lo: lineN('HTML', /ulanish\.on\('order-changed'/) };
const HS = { s0: lineN('HTML_START', /addEventListener\('submit'/) };
const HS_END = lineN('HTML_START', /^\s+ulan\(\);$/, lineN('HTML_START', /^\s+if \(token\) \{/));
const HS_EDIT = Object.fromEntries(KOD.HTML_START.lines.filter((l) => l.n > HS.s0 && l.n <= HS_END && l.t.trim() === 'yukla();').map((l) => [l.n, false]));
const T8_09 = sec('09', 'Brauzer', (l) => !/tugadi/.test(l));
const T8_04 = sec('04', 'Terminal', (l) => /connect ·|GET \/admin|disconnect/.test(l)).slice(-3);
const T8_11 = sec('11', 'Brauzer', (l) => /Offline|kadr|GET \/admin|→ «/.test(l) && !/tugadi/.test(l)).slice(-5);
const T8_08 = outPick('08', (l) => /^Tests:|NATIJA/.test(l));
const S8 = mkS(8, [{ v: 'c' }, { v: 'sub' }, { v: '04' }, { v: '11' }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <>
    {seg.v === 'c' && <Code k="HTML" ids={{ ...rngIds(H.c0 - 1, H.c0 + 3, 'n'), ...rngIds(H.lo - 1, H.lo, 'o') }} from={H.c0 - 1} to={H.lo} focus={['n']} title="admin.html · ulan() · ws2-done" />}
    {seg.v === 'sub' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file={t("admin.html · kirish va sahifa ochilishi · ws2-start → ws2-done", "admin.html · вход и открытие страницы · ws2-start → ws2-done")} lines={kod('HTML_START', Object.fromEntries(Object.keys(HS_EDIT).map((n) => [n, 'x'])), HS.s0, HS_END + 1, HS_EDIT)} focus={['x']} /><Term title={t("brauzer · noto'g'ri token (09, ws2-done)", "браузер · неверный токен (09, ws2-done)")} lines={T8_09} /></div>}
    {seg.v === '04' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="04-3" small label={t("ws2-done · server qayta yongach", "ws2-done · после перезапуска сервера")} /><Term title={t("VS Code terminali · npm run live (ws2-done)", "терминал VS Code · npm run live (ws2-done)")} lines={T8_04} /></div>}
    {seg.v === '11' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="11-3" small label={t("ws2-done · Offline 60 s, Online'dan keyin", "ws2-done · Offline 60 с, после Online")} /><Term title={t("panel logi (11)", "лог панели (11)")} lines={T8_11} /><Term title={t("npm test · npm run smoke (08) — server kodi o'zgarmagan", "npm test · npm run smoke (08) — код сервера не менялся")} lines={T8_08} /></div>}
  </>} />;
}

// ============================================================
//  9 · Amaliyot 1 — Offline bilan buzish va tuzatish
// ============================================================
const P9 = mkPractice(9, [[], [0, 1], [2, 3], []], {
  code: [{ step: 3, file: F.html, lines: kod('HTML', rngIds(H.c0 - 1, H.c0 + 3, 'n'), H.c0 - 1, H.lo) }],
});
function ScreenP9(p) { return <Practice p={p} S={P9.S} steps={P9.steps} trouble={P9.trouble} proof={P9.proof} code={P9.code} tree={FILES()} />; }
