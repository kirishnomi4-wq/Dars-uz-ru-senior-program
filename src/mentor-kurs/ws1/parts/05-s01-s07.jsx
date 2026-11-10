
// ============================================================
//  1 · Kirish — dars oxiridagi natija: haqiqiy brauzerdagi panel (10b)
// ============================================================
const PLAN1 = ['Umumiy tushuncha', 'Gateway va token', 'Hodisa va panel', 'Ulanish holati', 'AI', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [], res: true }, { hl: [0, 1] }, { hl: [2, 3, 4, 5] }, { hl: [5] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    {seg.res && <><div className="mk-tag" style={{ margin: 0 }}>{t("Dars oxirida — bot buyurtma oldi, panel sahifani yangilamasdan ko'rsatdi", "В конце урока — бот получил заказ, панель показала его без обновления страницы")}</div><PanelView k="10b" small /></>}
  </div>} />;
}

// ============================================================
//  2 · So'rov–javob: panel so'ramaguncha bilmaydi (ws1v2-out/02)
// ============================================================
const T2A = outRange('02', /1-so'rov/, /— Bobur/).concat(outPick('02', (l) => /— Bobur|qabul qilindi/.test(l)));
const T2B = outRange('02', /2-so'rov/, /tokensiz/);
const T2C = outRange('02', /tokensiz/, null);
// F-1109-06: «ikki yo'l» kartalari va kichik 401 terminali o'rniga ikki ketma-ketlik yonma-yon (ws1v2-out/02, 04 — haqiqiy vaqtlar)
function Seq2({ c }) {
  return <div className="z">
    <div className="z-two">
      <div className="z-card">
        <p className="z-h">{t("Oddiy HTTP — panel so'ramaguncha bilmaydi", "Обычный HTTP — панель не знает, пока не спросит")}</p>
        <div className="w1-sq">
          <div className="hd" /><div className="hd">{t("Panel", "Панель")}</div><div className="hd">{t("Server · bot", "Сервер · бот")}</div>
          <div className="tm">1</div><div className="l2r">GET /admin/orders →</div><div className="zm">[]</div>
          <div className="tm">20:19:16</div><div className="stale">{t("ekran: bo'sh", "экран: пусто")}</div><div>{t("Bobur: «Buyurtma #1 qabul qilindi!»", "Бобур: «Buyurtma #1 qabul qilindi!»")}</div>
          <div className="tm">…</div><div className="stale">{t("ekran eski — so'ramadi", "экран старый — не спросила")}</div><div className="z-mut">{t("bazada #1 bor", "в базе есть #1")}</div>
          <div className="tm">2</div><div className="l2r">GET /admin/orders →</div><div className="zm">[{'{'}"id":1,"customer":"Bobur",…{'}'}]</div>
          <div className={'tm' + (c ? ' hl' : '')}>token?</div><div className={'l2r' + (c ? ' hl' : '')}>{t("tokensiz GET →", "GET без токена →")}</div><div className={c ? 'hl' : ''}><span className="z-tag r">401</span></div>
        </div>
      </div>
      <div className="z-card" style={{ borderColor: '#15803D' }}>
        <p className="z-h" style={{ color: '#15803D' }}>{t("Doimiy ulanish — server o'zi aytadi", "Постоянное соединение — сервер сообщает сам")}</p>
        <div className="w1-sq r">
          <div className="hd" /><div className="hd">{t("Panel", "Панель")}</div><div className="hd">{t("Server · bot", "Сервер · бот")}</div>
          <div className="tm">{t("1 marta", "1 раз")}</div><div className="r2l" style={{ gridColumn: 'span 2', justifyContent: 'center' }}>{t("ulanish ochiladi va ochiq turadi ⇄", "соединение открывается и остаётся открытым ⇄")}</div>
          <div className="tm">20:19:24</div><div className="ok">{t("yangi qator #2", "новая строка #2")}</div><div className="push"><span>← order-changed</span><span>{'{'}"orderId":2,</span><span>&nbsp;"reason":"new"{'}'}</span></div>
          <div className="tm">20:19:26</div><div className="ok">{t("holat o'zgardi", "статус изменён")}</div><div className="push"><span>← order-changed</span><span>{'{'}"orderId":2,</span><span>&nbsp;"reason":"status"{'}'}</span></div>
        </div>
        <span className="z-mut">{t("panel so'ramaydi — server o'zgarish bo'lganda o'zi yuboradi", "панель не спрашивает — сервер сам отправляет при изменении")}</span>
      </div>
    </div>
    <div className="z-card">
      <p className="z-h">{t("Panelni jonli qilishning ikki yo'li", "Два способа сделать панель живой")}</p>
      <div className="z-two">
        <div><b>Polling</b>{t(" — har 3 soniyada qayta so'rash. Oddiy, lekin ko'pincha javob o'zgarmagan, kechikish qoladi.", " — переспрашивать каждые 3 секунды. Просто, но ответ часто не меняется, остаётся задержка.")}</div>
        <div><b>{t("Doimiy ulanish", "Постоянное соединение")}</b>{t(" — bir marta ulanadi, server o'zgarishda o'zi xabar beradi.", " — подключается один раз, сервер сам сообщает об изменении.")}</div>
      </div>
    </div>
  </div>;
}
const S2 = mkS(2, [{ v: 'a' }, { v: 'b' }, { v: 'two' }, { v: 'c' }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <>
    {seg.v === 'a' && <Term title={t("VS Code terminali · curl va server logi", "терминал VS Code · curl и лог сервера")} lines={T2A} />}
    {seg.v === 'b' && <Term title={t("VS Code terminali · curl", "терминал VS Code · curl")} lines={T2B} />}
    {(seg.v === 'two' || seg.v === 'c') && <Seq2 c={seg.v === 'c'} />}
  </>} />;
}

// ============================================================
//  3 · Doimiy ulanish va socket.io: polling → websocket (ws1v2-out/04, 01, 08)
// ============================================================
const T3A = outRange('04', /ulanmoqda…/, /order-changed/);
const T3B = outPick('01', (l) => /Mapped|ishlayapti|LiveModule/.test(l));
const T3EV = outPick('04', (l) => /order-changed/.test(l)).slice(0, 1);
const T3C = outRange('08', /^\$ npm run live/, null);
const S3 = mkS(3, [{ v: 'c' }, { v: 'port' }, { v: 'ev' }, { v: 'start' }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <>
    {seg.v === 'c' && <Term title={t("VS Code terminali · npm run live", "терминал VS Code · npm run live")} lines={T3A} />}
    {seg.v === 'port' && <Term title={t("VS Code terminali · server (npm run start)", "терминал VS Code · сервер (npm run start)")} lines={T3B} />}
    {seg.v === 'ev' && <div style={{ display: 'grid', gap: 10 }}><Term title={t("VS Code terminali · npm run live", "терминал VS Code · npm run live")} lines={T3EV} />
      <div className="pg-two"><Card c={C1.ws} h={t("Hodisa nomi", "Имя события")}><p><code>order-changed</code>{t(" — bo'lib o'tgan ish, kichik harf va chiziqcha", " — о случившемся, строчными буквами через дефис")}</p></Card><Card c={C1.live} h={t("Ichida", "Внутри")}><p><code>orderId</code>{t(" va ", " и ")}<code>reason</code> (<code>new</code> | <code>status</code>{t(") — ro'yxat emas", ") — не список")}</p></Card></div></div>}
    {seg.v === 'start' && <Term title={t("VS Code terminali · ws1-start (gateway yo'q)", "терминал VS Code · ws1-start (нет gateway)")} lines={T3C} er />}
  </>} />;
}

// ============================================================
//  4 · Gateway: token ulanish ochilayotganda tekshiriladi (live.gateway.ts, admin-token.ts, modullar)
// ============================================================
const GW = { dec: lineN('GATEWAY', /@WebSocketGateway/), con: lineN('GATEWAY', /handleConnection\(/), oc: lineN('GATEWAY', /orderChanged\(orderId/) };
const S4 = mkS(4, [{ v: 'gw', from: GW.dec, to: GW.dec + 5, f: ['d'] }, { v: 'gw', from: GW.con, to: GW.con + 7, f: ['c'] }, { v: 'tok' }, { v: 'gw', from: GW.oc - 2, to: GW.oc + 2, f: ['e'], mod: true }]);
function Screen4(p) {
  const ids = { ...rngIds(GW.dec, GW.dec + 5, 'd'), ...rngIds(GW.con, GW.con + 7, 'c'), ...rngIds(GW.oc - 2, GW.oc + 2, 'e') };
  return <Lesson p={p} S={S4} scene={({ seg }) => <>
    {seg.v === 'gw' && !seg.mod && <Code k="GATEWAY" ids={ids} from={seg.from} to={seg.to} focus={seg.f} fresh={F.gw} />}
    {seg.v === 'tok' && <Code k="TOKEN" ids={rngIds(5, 11, 't')} focus={['t']} />}
    {seg.mod && <div style={{ display: 'grid', gap: 8 }}><CodePanel file="live.gateway.ts" lines={kod('GATEWAY', ids, seg.from, seg.to)} focus={seg.f} />
      <CodePanel file="telegram.module.ts" lines={kod('TGMOD', { [lineN('TGMOD', /LiveModule/)]: 'm', [lineN('TGMOD', /imports:/)]: 'm' })} focus={['m']} /></div>}
  </>} />;
}

// ============================================================
//  5 · Tekshiruv 1 — tokensiz klient nima ko'radi (ws1v2-out/03)
// ============================================================
function Screen5(p) {
  return MC(p, 5, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file="live.gateway.ts" lines={kod('GATEWAY', rngIds(GW.con + 1, GW.con + 4, 'c'), GW.con, GW.con + 4)} focus={['c']} />
      <Term lines={jt('$ npm run live -- ""')} />
    </div>,
    after: <Term title={t('VS Code terminali · npm run live -- ""', 'терминал VS Code · npm run live -- ""')} lines={outRange('03', /^\$ npm run live -- ""/, /# Noto/)} />,
  });
}

// ============================================================
//  6 · Buzamiz: return unutildi — log yolg'on (ws1v2-out/07, 03)
// ============================================================
const RET = lineN('GATEWAY', /^\s+return;$/, GW.con);
const T6CLI = outRange('07', /^\$ npm run live/, /# Server logi/);
const T6SRV = outRange('07', /# Server logi/, null);
const T6OK = outRange('03', /# Server logi/, null);
const CAUSE6 = ['client.disconnect() — ulanish yopiladi, lekin funksiyadan chiqilmaydi', "return yo'q — keyingi satrlar baribir bajariladi", "client.data.admin = true va log «panel ulandi» — rad etilgan klient uchun", "Keyin shu yerga xona yoki ruxsat qo'shilsa — rad etilgan klient ularni oladi"];
const S6 = mkS(6, [{ v: 'code' }, { v: 'cli' }, { v: 'log' }, { v: 'cause' }]);
function Screen6(p) {
  const code = <CodePanel file={t("live.gateway.ts · buzilgan", "live.gateway.ts · сломанная копия")} lines={kod('GATEWAY', { [RET]: 'x' }, GW.con, GW.con + 7, { [RET]: false })} focus={['x']} />;
  return <Lesson p={p} S={S6} scene={({ seg }) => <>
    {seg.v === 'code' && <Ide files={compact(FILES(), F.gw)} active={F.gw}>{code}</Ide>}
    {seg.v === 'cli' && <div style={{ display: 'grid', gap: 8 }}>{code}<Term title={t('VS Code terminali · npm run live -- ""', 'терминал VS Code · npm run live -- ""')} lines={T6CLI} /></div>}
    {seg.v === 'log' && <div className="pg-two"><Term title={t("server logi · return yo'q", "лог сервера · нет return")} lines={T6SRV} er /><Term title={t("server logi · to'g'ri kod (03)", "лог сервера · правильный код (03)")} lines={T6OK} /></div>}
    {seg.v === 'cause' && <div style={{ display: 'grid', gap: 10 }}><Term title={t("server logi · return yo'q", "лог сервера · нет return")} lines={T6SRV} er /><Cause items={CAUSE6} on={4} bad={2} /></div>}
  </>} />;
}

// ============================================================
//  7 · Amaliyot 1 — server va terminal klienti
// ============================================================
const P7 = mkPractice(7, [[], [0, 1], [2, 3], []], {
  code: [{ step: 1, file: F.env, lines: kod('ENV', { [lineN('ENV', /ADMIN_PANEL_TOKEN/)]: 'e' }) }, { step: 2, file: F.cli, lines: kod('CLIENT'), copy: false }],
});
function ScreenP7(p) { return <Practice p={p} S={P7.S} steps={P7.steps} trouble={P7.trouble} proof={P7.proof} code={P7.code} tree={FILES()} />; }
