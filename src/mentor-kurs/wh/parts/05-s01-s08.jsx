
// ============================================================
//  1 · Kirish — dars oxiridagi natija: panelda «To'landi» va «Rad etildi» (whv2-out/12, 3-surat)
// ============================================================
const PLAN1 = ['Umumiy tushuncha', 'Imzo', 'Takror va rad', 'Buzamiz', 'AI', 'Sinfga tayyorgarlik'];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4, 5] }, { hl: [5] }], { plan: PLAN1 });
// F-1120-02 (M51): darsning rasmi — «Buyurtma boti» xaritasi; pastki qatorda to'lov xizmati: natijani serverga o'zi yuboradi (webhook, X-Signature)
const DB_ALL = { products: 'db', users: 'db', carts: 'db', orders: 'db' };
const PAY_ON = ['order', 'db', 'orders'];
const PAY = (steps, res, badge) => ({ get name() { return t("To'lov xizmati", 'Платёжный сервис'); }, get steps() { return typeof steps === 'function' ? steps() : steps; }, res, badge });
const PAID = { orders: 'payment_status: paid' };
const S1M = [
  { on: PAY_ON, note: PAID, jest: PAY([['X-Signature', 'ok'], ['POST /payments/webhook', 'ok']], 'pass', '200') },
  { on: PAY_ON, note: PAID, jest: PAY([['POST /payments/webhook', 'ok']], 'pass', '200') },
  { on: PAY_ON, jest: PAY(() => [[t('imzosiz', 'без подписи'), 'bad'], [t('takror', 'повтор'), 'ok']], 'fail', '401 · 200') },
  { on: PAY_ON, note: PAID, jest: PAY([['X-Signature', 'ok'], ['POST /payments/webhook', 'ok']], 'pass', '200') },
];
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg, beat }) => { const m = S1M[Math.min(beat, 3)]; return <div className="mk-light" style={{ padding: 16, display: 'grid', gap: 12 }}>
    <BotMap loc={DB_ALL} {...m} tag={t("Bugungi darsning rasmi — to'lov xabari imzo bilan keladi, server tekshirib yozadi", 'Картина урока — сообщение об оплате приходит с подписью, сервер проверяет и записывает')} />
    <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(6,minmax(0,1fr))', gap: 6 }}>
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div>
  </div>; }} />;
}

// ============================================================
//  2 · Kim kimga yuboradi: to'lov xabari (oqim; whv2-out/03 — tana)
// ============================================================
const FLOW2 = [['m', 'Mijoz', 'kartani xizmatga beradi', T.blue], ['x', "To'lov xizmati", 'Payme, Click kabi', C1.ai], ['w', 'POST /payments/webhook', 'tana + X-Signature', T.accent], ['s', 'Server', 'imzo → yozuv', T.green], ['p', 'Panel', "order-changed 'payment'", C1.ws]];
const T2 = outPick('03', (l) => /^→ POST|X-Signature/.test(l));
// F-1109-06: gapli kartalar o'rniga webhook yo'li haqiqiy tana, imzo va javob bilan (whv2-out/03, 12) va «dalil emas / dalil» juftligi
function Path2({ pair, full }) {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("To'lov natijasini server qayerdan biladi — webhook yo'li (npm run pay -- 1)", "Откуда сервер узнаёт результат оплаты — путь webhook (npm run pay -- 1)")}</p>
      <div className="z-flow">
        <div className="z-st"><b>{t("To'lov xizmati", "Платёжный сервис")}</b><span className="z-mut">Payme, Click …</span></div>
        <div className="z-ar">→</div>
        <div className="z-st blue" style={{ flex: '2 1 0' }}><b>POST /payments/webhook</b><span className="zm" style={{ fontSize: 12 }}>{'{'}"paymentId":"pay_0005d844","orderId":1,"status":"paid","amount":120000{'}'}</span><span className="zm" style={{ fontSize: 12 }}>X-Signature: 5c7333467…</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>{t("Server", "Сервер")}</b><span className="z-tag g">200</span><span className="zm" style={{ fontSize: 12 }}>{'{'}"ok":true,"duplicate":false{'}'}</span></div>
      </div>
      <div className={'z-flow' + (full ? '' : ' dim')}>
        <div className="z-st"><b>payments</b><span className="zm" style={{ fontSize: 12 }}>pay_0005d844 · #1 · paid · 120000</span></div>
        <div className="z-ar">→</div>
        <div className="z-st"><b>orders</b><span className="zm" style={{ fontSize: 12 }}>#1 · payment_status: paid</span></div>
        <div className="z-ar">→</div>
        <div className="z-st"><b>{t("Panel", "Панель")}</b><span className="zm" style={{ fontSize: 12 }}>order-changed {'{'}"orderId":1,"reason":"payment"{'}'}</span></div>
      </div>
    </div>
    <div className={'z-two' + (pair ? '' : ' dim')}>
      <div className="z-card" style={{ borderColor: 'var(--bad)' }}><b style={{ color: 'var(--bad)' }}>{t("Dalil emas", "Не доказательство")}</b><span className="z-mut">{t("mijoz «to'ladim» desa yoki ilova shunday ko'rsatsa", "если клиент говорит «я оплатил» или так показывает приложение")}</span></div>
      <div className="z-card" style={{ borderColor: 'var(--ok)' }}><b style={{ color: 'var(--ok)' }}>{t("Dalil", "Доказательство")}</b><span className="z-mut">{t("faqat xizmatning imzoli xabari: tanada to'rt maydon, sarlavhada imzo", "только подписанное сообщение сервиса: четыре поля в теле, подпись в заголовке")}</span></div>
    </div>
  </div>;
}
const S2 = mkS(2, [{ v: 'flow' }, { v: 'two' }, { v: 'ws' }, { v: 'body' }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <>
    {seg.v === 'flow' && <Path2 />}
    {seg.v === 'two' && <Path2 pair />}
    {seg.v === 'ws' && <div className="pg-two">
      <Card c={C1.ws} h="WebSocket"><p>{t("server → panel: server o'zi xabar beradi", "сервер → панель: сервер сообщает сам")}</p></Card>
      <Card c={T.accent} h="Webhook" hl><p>{t("tashqi xizmat → server: xizmat o'zi yuboradi, server ", "внешний сервис → сервер: сервис шлёт сам, сервер ")}<b>{t("kutadi", "ждёт")}</b>{t(" — manzil internetda ochiq", " — адрес открыт в интернете")}</p></Card>
    </div>}
    {seg.v === 'body' && <Path2 pair full />}
  </>} />;
}

// ============================================================
//  3 · wh-start: manzil yo'q — 404 (whv2-out/01)
// ============================================================
const T3A = outRange('01', /^\$ curl/, /^\$ psql/);
const T3B = outRange('01', /^\$ psql/, null);
// F-1109-06: xulosa — uch karta o'rniga haqiqiy 404 va orders jadvali (whv2-out/01) hamda wh-done dagi uch tekshiruv oqimi
function Need3() {
  return <div className="z">
    <div className="z-card" style={{ borderColor: 'var(--bad)' }}>
      <p className="z-h">{t("wh-start: xizmat xabar yubordi — server bilmadi", "wh-start: сервис отправил сообщение — сервер не узнал")}</p>
      <div className="z-term"><span className="m">$ curl -X POST http://localhost:3100/payments/webhook -d '{'{'}"paymentId":"pay_1","orderId":1,"status":"paid","amount":120000{'}'}'</span>{'\n'}<span className="r">{'{'}"message":"Cannot POST /payments/webhook","error":"Not Found","statusCode":404{'}'}</span></div>
      <table className="z-tbl" style={{ maxWidth: 320 }}><tbody><tr><th>id</th><th>status</th><th>total</th></tr><tr className="bad"><td>1</td><td>NEW</td><td>120000</td></tr></tbody></table>
      <span className="z-mut">{t("pul o'tgan, buyurtma bazada «NEW» qoldi — admin bilmaydi", "деньги прошли, заказ в базе остался «NEW» — админ не знает")}</span>
    </div>
    <div className="z-card">
      <p className="z-h">{t("wh-done da xabar uch tekshiruvdan o'tadi", "В wh-done сообщение проходит три проверки")}</p>
      <div className="z-flow">
        <div className="z-st ok"><b>{t("1 · Manzil", "1 · Адрес")}</b><span className="zm">POST /payments/webhook</span><span className="z-mut">{t("404 o'rniga yo'l bor", "вместо 404 есть маршрут")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>{t("2 · Imzo", "2 · Подпись")}</b><span className="z-mut">{t("xabar haqiqatan xizmatdanmi", "действительно ли сообщение от сервиса")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>{t("3 · Bir martalik yozuv", "3 · Однократная запись")}</b><span className="z-mut">{t("ikki marta kelsa ham — bir qator", "даже если придёт дважды — одна строка")}</span></div>
      </div>
    </div>
  </div>;
}
const S3 = mkS(3, [{ v: 'a' }, { v: 'b' }, { v: 'open' }, { v: 'need' }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <>
    {seg.v === 'a' && <Term title={t("VS Code terminali · wh-start", "терминал VS Code · wh-start")} lines={T3A} er />}
    {seg.v === 'b' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("VS Code terminali · wh-start", "терминал VS Code · wh-start")} lines={T3A} er /><Term title={t("psql · buyurtma", "psql · заказ")} lines={T3B} /></div>}
    {seg.v === 'open' && <div className="pg-two"><Card c={T.green} h={t("To'lov xizmati", "Платёжный сервис")}><p>{t("to'g'ri xabar yuboradi", "шлёт правильное сообщение")}</p></Card><Card c={T.accent} h={t("Istalgan odam", "Кто угодно")} hl><p>{t("xuddi shu manzilga «#1 to'landi» yubora oladi — manzil ", "может прислать на этот же адрес «#1 оплачен» — адрес ")}<b>{t("ochiq", "открыт")}</b></p></Card></div>}
    {seg.v === 'need' && <Need3 />}
  </>} />;
}

// ============================================================
//  4 · Imzo: xom tana + kalit → HMAC (signature.ts, .env.example)
// ============================================================
const SG = { s0: lineN('SIG', /^export function sign\(/), v0: lineN('SIG', /^export function isValidSignature\(/), chk: lineN('SIG', /if \(!secret \|\| !rawBody/), eq: lineN('SIG', /timingSafeEqual\(got, expected\)/) };
const ENV4 = lineN('ENV', /^PAYMENT_WEBHOOK_SECRET=/);
const S4 = mkS(4, [{ v: 'key' }, { v: 'sign' }, { v: 'chk' }, { v: 'eq' }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <>
    {seg.v === 'key' && <div style={{ display: 'grid', gap: 8 }}><div className="pg-two"><Card c={C1.ai} h={t("To'lov xizmati", "Платёжный сервис")}><p>{t("kabinetida — kalit", "в своём кабинете — ключ")}</p></Card><Card c={T.green} h={t("Bizning server", "Наш сервер")}><p><code>.env</code>{t(" da — o'sha kalit", " — тот же ключ")}</p></Card></div><CodePanel file=".env.example" lines={kod('ENV', { [ENV4]: 'k', [ENV4 - 1]: 'k', [ENV4 - 2]: 'k' }, ENV4 - 2, ENV4)} focus={['k']} /></div>}
    {seg.v === 'sign' && <Code k="SIG" ids={rngIds(SG.s0, SG.s0 + 2, 's')} from={1} to={SG.s0 + 2} focus={['s']} />}
    {seg.v === 'chk' && <Code k="SIG" ids={rngIds(SG.chk - 1, SG.chk, 'c')} from={SG.v0} to={SG.chk} focus={['c']} />}
    {seg.v === 'eq' && <Code k="SIG" ids={rngIds(SG.eq - 1, SG.eq, 'e')} from={SG.v0} to={SG.eq + 1} focus={['e']} />}
  </>} />;
}

// ============================================================
//  5 · Controller: imzo, maydonlar, yozuv — shu tartibda (payment.controller.ts, main.ts, whv2-out/02)
// ============================================================
const CT = { post: lineN('CTRL', /@Post\('webhook'\)/), iff: lineN('CTRL', /^\s+if \($/, lineN('CTRL', /@Post\('webhook'\)/)), parse: lineN('CTRL', /const p = parsePayment/), rec: lineN('CTRL', /const r = await this\.payments\.record/), ret: lineN('CTRL', /return \{ ok: true/) };
const MN = lineN('MAIN', /NestFactory\.create\(AppModule/);
const T5 = outPick('02', (l) => /main\.ts:|Mapped \{\/payments|ishlayapti/.test(l));
// F-1109-06: xulosa — uch karta o'rniga tekshiruv zanjiri (yiqilsa 401 / 400, whv2-out/06, 11) va rawBody bor/yo'q natijalari (07, 08)
// 400 xabari — haqiqiy chiqishdan (whv2-out/11), qo'lda ko'chirilmaydi
const MSG5 = ((KOD.OUT['11'] || '').match(/summa mos emas: [^"\\]+/) || ['summa mos emas'])[0];
function Chain5() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("payment.controller.ts — tartib: imzo, maydonlar, yozuv", "payment.controller.ts — порядок: подпись, поля, запись")}</p>
      <div className="wh-g5">
        <div className="z-st"><b>{t("xabar", "сообщение")}</b><span className="zm" style={{ fontSize: 12 }}>req.rawBody + X-Signature</span></div>
        <div className="z-ar">→</div>
        <div className="z-st blue"><b>{t("1 · imzo", "1 · подпись")}</b><span className="z-mut">{t("rawBody dan HMAC", "HMAC из rawBody")}</span></div>
        <div className="z-ar">→</div>
        <div className="z-st blue"><b>{t("2 · maydonlar", "2 · поля")}</b><span className="z-mut">paymentId · orderId · status · amount</span></div>
        <div className="z-ar">→</div>
        <div className="z-st ok"><b>{t("3 · yozuv", "3 · запись")}</b><span className="z-mut">{t("payments va orders", "payments и orders")}</span><span className="z-tag g">200</span></div>
        <div /><div />
        <div className="down">↓</div><div /><div className="down">↓</div><div /><div />
        <div /><div />
        <div className="z-st bad"><span className="z-tag r">401</span><span className="zm" style={{ fontSize: 12 }}>imzo noto'g'ri</span><span className="z-mut">{t("hech narsa yozilmadi", "ничего не записано")}</span></div><div />
        <div className="z-st bad"><span className="z-tag o">400</span><span className="zm" style={{ fontSize: 12 }}>{MSG5}</span></div><div /><div />
      </div>
    </div>
    <div className="z-card">
      <p className="z-h">{t("Imzo xom tanadan — shuning uchun main.ts da rawBody: true", "Подпись из сырого тела — поэтому в main.ts rawBody: true")}</p>
      <div className="z-two">
        <div className="z-st ok"><b>{t("rawBody bilan", "с rawBody")}</b><span className="zm" style={{ fontSize: 12 }}>{t("bo'sh joyli JSON → 200 ", "JSON с пробелами → 200 ")}{'{'}"ok":true{'}'}</span></div>
        <div className="z-st bad"><b>{t("rawBody yo'q", "без rawBody")}</b><span className="zm" style={{ fontSize: 12 }}>{t("to'g'ri imzo ham → 401 · payments: 0", "даже верная подпись → 401 · payments: 0")}</span></div>
      </div>
    </div>
  </div>;
}
const S5 = mkS(5, [{ v: 'sig' }, { v: 'rec' }, { v: 'main' }, { v: 'order' }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <>
    {seg.v === 'sig' && <Code k="CTRL" ids={rngIds(CT.iff, CT.iff + 5, 's')} from={CT.post - 1} to={CT.iff + 5} focus={['s']} />}
    {seg.v === 'rec' && <Code k="CTRL" ids={{ [CT.parse]: 'r', [CT.rec]: 'r', [CT.ret]: 'r' }} from={CT.iff} to={CT.ret + 1} focus={['r']} />}
    {seg.v === 'main' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file="src/main.ts" lines={kod('MAIN', { [MN]: 'm', [MN - 1]: 'm' }, MN - 1, MN + 1)} focus={['m']} /><Term title={t("server logi · npm run start (02)", "лог сервера · npm run start (02)")} lines={T5} /></div>}
    {seg.v === 'order' && <Chain5 />}
  </>} />;
}

// ============================================================
//  6 · Tekshiruv 1 — imzosiz xabar (whv2-out/05)
// ============================================================
const T6 = outRange('05', /^\$ npm run pay -- \d+ imzosiz/, /^\$ npm run pay -- \d+ soxta/);
function Screen6(p) {
  return MC(p, 6, {
    above: <CodePanel file="payment.controller.ts · webhook()" lines={kod('CTRL', rngIds(CT.iff, CT.rec, 'c'), CT.iff, CT.rec)} focus={['c']} />,
    after: <Term title={t("VS Code terminali · npm run pay -- 1 imzosiz (05)", "терминал VS Code · npm run pay -- 1 imzosiz (05)")} lines={T6} />,
  });
}

// ============================================================
//  7 · Haqiqiy oqim: npm run pay → panelda «To'landi» (pay.js; whv2-out/03, 12)
// ============================================================
const PY = { sg: lineN('PAY', /^const sign = /), fe: lineN('PAY', /const r = await fetch\(`\$\{url\}\/payments\/webhook`/) };
const T7A = outRange('03', /^\$ npm run pay/, /^## Server/);
const T7L = outPick('03', (l) => /LOG \[Payment\] pay_/.test(l));
const T7DB = outRange('03', /^\$ psql/, null);
const T7EV = KOD.OUT['12'].split('\n').filter((l) => /"reason":"payment"/.test(l)).slice(0, 1).map((l) => ({ h: liveLine(ms(l)) }));
const S7 = mkS(7, [{ v: 'pay' }, { v: 'run' }, { v: 'db' }, { v: 'panel' }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <>
    {seg.v === 'pay' && <Code k="PAY" ids={{ ...rngIds(PY.sg, PY.sg, 'p'), ...rngIds(PY.fe, PY.fe + 1, 'p') }} from={PY.sg} to={PY.fe + 4} focus={['p']} />}
    {seg.v === 'run' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("VS Code terminali · npm run pay -- 1", "терминал VS Code · npm run pay -- 1")} lines={T7A} /><Term title={t("server logi", "лог сервера")} lines={T7L} /></div>}
    {seg.v === 'db' && <Term title={t("psql · payments va orders (03)", "psql · payments и orders (03)")} lines={T7DB} />}
    {seg.v === 'panel' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="12-1" small label={t("to'lovdan oldin", "до оплаты")} /><PanelView k="12-2" small label={t("to'lovdan keyin — sahifa yangilanmadi", "после оплаты — страница не обновлялась")} /><Term title={t("panel logi", "лог панели")} lines={T7EV} /></div>}
  </>} />;
}

// ============================================================
//  8 · Amaliyot 1 — webhook va soxta to'lov xizmati
// ============================================================
const P8 = mkPractice(8, [[], [0, 1], [2, 3], []], {
  code: [{ step: 1, file: F.env, lines: kod('ENV', { [ENV4]: 'k' }, ENV4 - 2, ENV4) }, { step: 3, file: F.pay, lines: kod('PAY'), copy: false }],
});
function ScreenP8(p) { return <Practice p={p} S={P8.S} steps={P8.steps} trouble={P8.trouble} proof={P8.proof} code={P8.code} tree={FILES()} />; }
