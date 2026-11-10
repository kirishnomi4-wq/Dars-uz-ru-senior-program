
// ============================================================
//  10 · Buzamiz: tinglovchi connect ichida (xato nusxa — 00b; ws2v2-out/06, 04)
// ============================================================
const X = { u0: lineN('HTML_XATO', /function ulan\(\)/), c0: lineN('HTML_XATO', /ulanish\.on\('connect'/) };
X.bad = lineN('HTML_XATO', /ulanish\.on\('order-changed'/, X.c0);
X.end = lineN('HTML_XATO', /^\s+\}\);$/, X.bad);
const CAUSE10 = ["connect — birinchi ulanishda HAM har qayta ulanishda ishlaydi", "ichidagi ulanish.on(…) har safar YANGI tinglovchi qo'shadi, eskisi o'chmaydi", "ikki qayta ulanishdan keyin — uchta tinglovchi: bitta hodisaga uchta GET", "connect ichida — faqat bir martalik ish (yukla()); tinglovchi bir marta, tashqarida"];
const S10 = mkS(10, [{ v: 'code' }, { v: 'net' }, { v: 'two' }, { v: 'cause' }]);
function Screen10(p) {
  const code = <CodePanel file={t("admin.html · xato nusxa (tinglovchi connect ichida)", "admin.html · копия с ошибкой (слушатель внутри connect)")} lines={kod('HTML_XATO', { [X.bad]: 'x', ...rngIds(X.c0, X.c0 + 2, 'c') }, X.c0, X.end)} focus={['x']} />;
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {seg.v === 'code' && <Ide files={compact(FILES(), F.html)} active={F.html}>{code}</Ide>}
    {seg.v === 'net' && <div style={{ display: 'grid', gap: 8 }}>{code}<NetList k="06" /></div>}
    {seg.v === 'two' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="06-2" small label={t("xato nusxa · 1 qayta ulanishdan keyin", "копия с ошибкой · после 1 переподключения")} /><PanelView k="04-3" small label={t("ws2-done · to'g'ri kod", "ws2-done · правильный код")} /></div>}
    {seg.v === 'cause' && <div style={{ display: 'grid', gap: 10 }}><NetList k="06" /><Cause items={CAUSE10} on={4} bad={1} /></div>}
  </>} />;
}

// ============================================================
//  11 · Tekshiruv 2 — LineCheck: connect ichidagi ulanish.on (xato nusxa)
// ============================================================
const LC11 = KOD.HTML_XATO.lines.filter((l) => l.n >= X.u0 && l.n <= X.end).map((l) => ({ h: tsLine(l.t), n: l.n }));
const HD = { u0: lineN('HTML', /function ulan\(\)/) };
const LC11_FIXED = KOD.HTML.lines.filter((l) => l.n >= HD.u0 && l.n <= H.lo).map((l) => ({ h: tsLine(l.t), n: l.n, ...(l.n >= H.lo - 1 ? { neu: true } : {}) }));
const NET11 = netGroups('06').map((g) => ({ h: liveLine(`order-changed #${g.id} · ${g.rc === 0 ? 'birinchi ulanish' : g.rc + ' qayta ulanishdan keyin'} → GET ×${g.n}`) }));
function Screen11(p) {
  const m = MDT[11];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={t("admin.html · ulan() · xato nusxa", "admin.html · ulan() · копия с ошибкой")} lines={LC11} target={LC11.findIndex((l) => l.n === X.bad)}
    fixed={LC11_FIXED} fixedExtra={[{ file: t('Network · xato nusxa (06): bitta hodisaga GET soni', "Network · копия с ошибкой (06): число GET на одно событие"), lines: NET11 }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  12 · Amaliyot 2 — Network'da GET sanash
// ============================================================
const P12 = mkPractice(12, [[], [0, 1], [2, 3], []], {
  code: [{ step: 0, file: F.html, lines: kod('HTML_XATO', { [X.bad]: 'x' }, X.c0, X.end), copy: false }],
});
function ScreenP12(p) { return <Practice p={p} S={P12.S} steps={P12.steps} trouble={P12.trouble} proof={P12.proof} code={P12.code} tree={FILES()} />; }

// ============================================================
//  13 · Tarmoq uzildi: panel boshqa kompyuterda (ws2v2-out/03, 05 — proksi)
// ============================================================
const FLOW13 = [['pn', 'Panel', "do'kon kompyuteri", C1.live], ['net', 'Tarmoq', 'proksi 3101 — kesiladi', T.accent], ['srv', 'Server 3100', 'bot va baza ishlaydi', T.green]];
const T13A = sec('03', 'Brauzer', (l) => !/tugadi|SURAT/.test(l));
const T13B = sec('05', 'Brauzer', (l) => !/tugadi|SURAT/.test(l));
const Q13A = sec('03', 'Qadamlar');
// F-1109-06: xulosa — uch karta o'rniga natijalar jadvali (uch usul × ws2-start / ws2-done, haqiqiy yurgizishlar 01–05, 11) va tarmoq sxemasi
function Res13() {
  const bz = <span className="bz">{t("buzildi", "сломалось")}</span>, tk = <span className="tk">{t("takrorlanmadi", "не повторилось")}</span>;
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Uch usul — oxirgi holat: panel ro'yxati va baza (haqiqiy yurgizishlar)", "Три способа — итоговое состояние: список панели и база (настоящие запуски)")}</p>
      <table className="z-tbl w2-r13"><tbody>
        <tr><th>{t("usul", "способ")}</th><th>ws2-start</th><th>ws2-done</th></tr>
        <tr><td>{t("server qayta yondi", "сервер перезапущен")}</td><td className="s">{t("ro'yxat: #1 · bazada 2 ta ", "список: #1 · в базе 2 ")}{bz}</td><td className="d">{t("ro'yxat: #2, #1 ", "список: #2, #1 ")}{tk}</td></tr>
        <tr><td>{t("brauzer Offline", "браузер Offline")}</td><td className="s">{t("ro'yxat: #1 — Offline paytidagi buyurtma yo'q ", "список: #1 — заказа, сделанного в Offline, нет ")}{bz}</td><td className="d">{t("ro'yxat: #2, #1 ", "список: #2, #1 ")}{tk}</td></tr>
        <tr><td>{t("tarmoq uzildi (proksi)", "обрыв сети (прокси)")}</td><td className="s">{t("ro'yxat: bo'sh · bazada #1 ", "список: пусто · в базе #1 ")}{bz}</td><td className="d">{t("ro'yxat: #1 ", "список: #1 ")}{tk}</td></tr>
      </tbody></table>
    </div>
    <div className="z-card">
      <p className="z-h">{t("Tarmoq uzilishi — haqiqiy do'konda", "Обрыв сети — в настоящем магазине")}</p>
      <div className="z-flow">
        <div className="z-st ok"><b>{t("Server · bot", "Сервер · бот")}</b><span className="z-mut">{t("Render'da — ishlayveradi", "на Render — продолжает работать")}</span></div>
        <div className="z-ar bad">✕</div>
        <div className="z-st bad"><b>{t("Do'kon Wi-Fi", "Wi-Fi магазина")}</b><span className="z-mut">{t("uzildi — proksi bilan modellashtirildi", "оборвался — смоделировано прокси")}</span></div>
        <div className="z-ar bad">✕</div>
        <div className="z-st"><b>{t("Panel", "Панель")}</b><span className="z-mut">{t("do'kon kompyuterida", "на компьютере магазина")}</span></div>
      </div>
    </div>
    <div className="z-rule">{t("Usul uch xil, ", "Способа три, ")}<b>{t("sabab bitta", "причина одна")}</b>{t(": qayta ulanish — yangi ulanish, hodisa o'tib ketgan. Bitta tuzatish uchalasini yopdi.", ": переподключение — новое соединение, событие уже прошло. Одно исправление закрыло все три.")}</div>
  </div>;
}
const S13 = mkS(13, [{ v: 'sx' }, { v: 'a' }, { v: 'b' }, { v: 'rule' }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {seg.v === 'sx' && <div style={{ display: 'grid', gap: 10 }}><Flow items={FLOW13} hl={['net']} /><Term title={t("qadamlar (03)", "шаги (03)")} lines={Q13A} /></div>}
    {seg.v === 'a' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="03-2" small label={t("ws2-start · tarmoq qaytgach", "ws2-start · после возврата сети")} /><Term title={t("panel logi (03, ws2-start)", "лог панели (03, ws2-start)")} lines={T13A} er /></div>}
    {seg.v === 'b' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="05-2" small label={t("ws2-done · tarmoq qaytgach", "ws2-done · после возврата сети")} /><Term title={t("panel logi (05, ws2-done)", "лог панели (05, ws2-done)")} lines={T13B} /></div>}
    {seg.v === 'rule' && <Res13 />}
  </>} />;
}

// ============================================================
//  14 · connectionStateRecovery: tiklaydi, lekin hammasini emas (ws2v2-out/07)
// ============================================================
const DEC14 = lineN('GATEWAY_TIKLASH', /@WebSocketGateway\(/);
const K7 = secRaw('07', 'Klient');
const C7 = K7.map((l, i) => (/connect ·/.test(l) ? i : -1)).filter((i) => i >= 0);
const K7A = K7.slice(0, C7[1] + 1).map((l) => ({ h: liveLine(l) }));
const K7B = K7.slice(C7[1] + 1, C7[2] + 1).map((l) => ({ h: liveLine(l) }));
const K7C = K7.slice(C7[2] + 1).map((l) => ({ h: liveLine(l) }));
const Q7 = secRaw('07', 'Qadamlar');
const qd = (re) => Q7.filter((l) => re.test(l)).map((l) => ({ h: liveLine(l) }));
// F-1109-06: xulosa — ikki karta o'rniga uch tajriba × ikki mexanizm jadvali (ws2v2-out/07 klient logi)
function Rec14() {
  const y = <td className="c y">✓</td>, n = <td className="c n">✕</td>;
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("connectionStateRecovery (2 daqiqa) — uch tajriba, klient logi", "connectionStateRecovery (2 минуты) — три опыта, лог клиента")}</p>
      <table className="z-tbl w2-r14"><tbody>
        <tr><th>{t("holat", "случай")}</th><th>{t("klient ko'rdi", "клиент увидел")}</th><th className="c">{t("tiklash", "восстановление")}</th><th className="c">{t("connect da qayta so'rash", "повторный запрос при connect")}</th></tr>
        <tr><td><b>B</b>{t(" · hodisa olgan, tarmoq uzildi, shu payt #3", " · получил событие, сеть оборвалась, в это время #3")}</td><td>21:41:47 order-changed {'{'}"orderId":3{'}'} → connect · <b>recovered=true</b>{t(" · id o'sha", " · id тот же")}</td>{y}{y}</tr>
        <tr><td><b>A</b>{t(" · hali hodisa olmagan, tarmoq uzildi", " · ещё не получал событий, сеть оборвалась")}</td><td>21:41:29 connect · <b>recovered=false</b>{t(" — o'tkazilgan buyurtma kelmadi", " — пропущенный заказ не пришёл")}</td>{n}{y}</tr>
        <tr><td><b>C</b>{t(" · server qayta yondi", " · сервер перезапущен")}</td><td>21:41:57 connect · <b>recovered=false</b>{t(" — holat server xotirasi bilan yo'qoldi", " — состояние пропало вместе с памятью сервера")}</td>{n}{y}</tr>
      </tbody></table>
    </div>
    <div className="z-two">
      <div className="z-card"><b>{t("Tiklash — qo'shimcha", "Восстановление — дополнительно")}</b><span className="z-mut">{t("qisqa tarmoq uzilishida yordam beradi", "помогает при коротком обрыве сети")}</span></div>
      <div className="z-card" style={{ borderColor: 'var(--ok)' }}><b style={{ color: 'var(--ok)' }}>{t("Qayta so'rash — majburiy", "Повторный запрос — обязателен")}</b><span className="z-mut">{t("server qayta yonishi eng ko'p uchraydi: deploy, xato. ws2-done da gateway o'zgarmadi.", "перезапуск сервера случается чаще всего: deploy, ошибка. В ws2-done gateway не менялся.")}</span></div>
    </div>
  </div>;
}
const S14 = mkS(14, [{ v: 'code' }, { v: 'b' }, { v: 'ac' }, { v: 'dec' }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <>
    {seg.v === 'code' && <CodePanel file={t("live.gateway.ts · tajriba nusxasi", "live.gateway.ts · копия для опыта")} lines={kod('GATEWAY_TIKLASH', { [DEC14]: 'r' }, DEC14 - 2, DEC14 + 1)} focus={['r']} />}
    {seg.v === 'b' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("qadamlar · B", "шаги · B")} lines={qd(/^\S+ — B\)/)} /><Term title={t("klient · B — oldin hodisa olgan, keyin tarmoq uzildi", "клиент · B — получил событие, потом сеть оборвалась")} lines={K7B} /></div>}
    {seg.v === 'ac' && <div className="pg-two"><Term title={t("A — klient hali hodisa olmagan", "A — клиент ещё не получал событий")} lines={K7A} er /><Term title={t("C — server qayta yondi", "C — сервер перезапустился")} lines={K7C} er /></div>}
    {seg.v === 'dec' && <Rec14 />}
  </>} />;
}

// ============================================================
//  15 · Tekshiruv 3 — tiklash va server qayta yonishi (07 C)
// ============================================================
function Screen15(p) {
  return MC(p, 15, {
    above: <Term title={t("klient · tiklash yoqilgan, server qayta yondi (07 C)", "клиент · восстановление включено, сервер перезапустился (07 C)")} lines={K7C} />,
    after: <div style={{ display: 'grid', gap: 8 }}><Term title={t("qadamlar · C", "шаги · C")} lines={qd(/C\)|qayta ishga tushirildi/)} /><Term title={t("klient · C", "клиент · C")} lines={K7C} er /></div>,
  });
}

// ============================================================
//  16 · Amaliyot 3 — npm run live va buzish yozuvi (live-client.js, BUZISH.md ws2-done)
// ============================================================
const CL = { r0: lineN('CLIENT', /async function royxat\(\)/), c0: lineN('CLIENT', /^s\.on\('connect'/) };
CL.end = lineN('CLIENT', /^\}\);$/, CL.c0);
const BZ = { a: lineN('BUZISH', /^\| № \|/), b: lineN('BUZISH', /^\| 3 \|/) };
const P16 = mkPractice(16, [[], [0, 1], [2, 3], []], {
  code: [{ step: 0, file: F.cli, lines: kod('CLIENT', {}, CL.r0 - 1, CL.end) }, { step: 3, file: F.buz, lines: kod('BUZISH', {}, BZ.a, BZ.b), copy: false }],
});
function ScreenP16(p) { return <Practice p={p} S={P16.S} steps={P16.steps} trouble={P16.trouble} proof={P16.proof} code={P16.code} tree={FILES()} />; }
