
// ============================================================
//  9 · Imzosiz va boshqa kalit — 401 (whv2-out/05)
// ============================================================
const T9B = outRange('05', /^\$ npm run pay -- \d+ soxta/, /^## Server/);
const T9L = outPick('05', (l) => /WARN \[Payment\]/.test(l));
const T9DB = outRange('05', /^\$ psql/, null);
// F-1109-06: xulosa — ikki qoida kartasi ostiga bir xil to'lov × uch xil imzo jadvali (whv2-out/03, 05)
function Sig9() {
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("Bir xil to'lov — uch xil imzo (npm run pay -- 1 …)", "Один и тот же платёж — три разные подписи (npm run pay -- 1 …)")}</p>
      <table className="z-tbl wh-a9"><tbody>
        <tr><th>{t("xabar", "сообщение")}</th><th>{t("javob", "ответ")}</th><th>payments</th><th>{t("server logi", "лог сервера")}</th></tr>
        <tr className="ok"><td>{t("to'g'ri kalit bilan imzolangan", "подписано верным ключом")}</td><td>200 {'{'}"ok":true,"duplicate":false{'}'}</td><td>{t("+1 qator", "+1 строка")}</td><td>LOG pay_0005d844 · #1 · paid</td></tr>
        <tr className="bad"><td>{t("imzosiz", "без подписи")}</td><td>401 imzo noto'g'ri</td><td>{t("yangi qator yo'q", "новой строки нет")}</td><td>WARN imzo noto'g'ri — xabar rad etildi</td></tr>
        <tr className="bad"><td>{t("boshqa kalit bilan (soxta)", "другим ключом (поддельный)")}</td><td>401 imzo noto'g'ri</td><td>{t("yangi qator yo'q", "новой строки нет")}</td><td>WARN imzo noto'g'ri — xabar rad etildi</td></tr>
      </tbody></table>
    </div>
    <div className="z-two">
      <div className="z-card" style={{ borderColor: 'var(--ok)' }}><b style={{ color: 'var(--ok)' }}>{t("Kalit — butun himoya", "Ключ — вся защита")}</b><span className="z-mut">{t("to'g'ri imzoni faqat kalitni biladigan yasaydi", "верную подпись делает только тот, кто знает ключ")}</span></div>
      <div className="z-card" style={{ borderColor: 'var(--bad)' }}><b style={{ color: 'var(--bad)' }}>{t("Kalit qayerda", "Где ключ")}</b><span className="z-mut">{t(".env va hosting sozlamasi — kodda, git'da, chatda emas", ".env и настройки хостинга — не в коде, не в git, не в чате")}</span></div>
    </div>
  </div>;
}
const S9 = mkS(9, [{ v: 'a' }, { v: 'b' }, { v: 'log' }, { v: 'rule' }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <>
    {seg.v === 'a' && <Term title={t("VS Code terminali · imzosiz", "терминал VS Code · imzosiz")} lines={T6} er />}
    {seg.v === 'b' && <div style={{ display: 'grid', gap: 8 }}><Term title="imzosiz" lines={T6} er /><Term title={t("boshqa kalit bilan (soxta)", "другим ключом (поддельный)")} lines={T9B} er /></div>}
    {seg.v === 'log' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("server logi", "лог сервера")} lines={T9L} /><Term title={t("psql · payments qatorlari (o'zgarmadi)", "psql · строки payments (не изменились)")} lines={T9DB} /></div>}
    {seg.v === 'rule' && <Sig9 />}
  </>} />;
}

// ============================================================
//  10 · Takror va rad (whv2-out/04, 15, 06, 12; payment.service.ts)
// ============================================================
const SV = { ins: lineN('SVC', /INSERT INTO payments/), dup: lineN('SVC', /if \(rows\.length === 0\) return \{ duplicate: true \}/), upd: lineN('SVC', /UPDATE orders SET payment_status/) };
const T10A = outRange('04', /^\$ npm run pay/, /^\$ psql/);
const T10C = outRange('15', /^\$ curl/, null);
const T10R = outRange('06', /^\$ npm run pay/, null);
const S10 = mkS(10, [{ v: 'ikki' }, { v: 'svc' }, { v: 'rad' }, { v: 'panel' }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {seg.v === 'ikki' && <Term title={t("VS Code terminali · npm run pay -- 1 ikki (04)", "терминал VS Code · npm run pay -- 1 ikki (04)")} lines={T10A} />}
    {seg.v === 'svc' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file="payment.service.ts" lines={kod('SVC', rngIds(SV.ins, SV.dup, 'd'), SV.ins - 1, SV.dup)} focus={['d']} /><Term title={t("bir xil xabar bir vaqtda ikki marta (15)", "одно и то же сообщение дважды одновременно (15)")} lines={T10C} /></div>}
    {seg.v === 'rad' && <Term title={t("VS Code terminali · npm run pay -- 2 rad (06)", "терминал VS Code · npm run pay -- 2 rad (06)")} lines={T10R} />}
    {seg.v === 'panel' && <div style={{ display: 'grid', gap: 8 }}><PanelView k="12-3" small label={t("panel · sahifa yangilanmadi", "панель · страница не обновилась")} /><CodePanel file={t("payment.service.ts · to'langani tushmaydi", "payment.service.ts · оплаченный не падает")} lines={kod('SVC', rngIds(SV.upd, SV.upd + 1, 'u'), SV.upd - 1, SV.upd + 3)} focus={['u']} /></div>}
  </>} />;
}

// ============================================================
//  11 · Amaliyot 2 — ikki marta, imzosiz, rad
// ============================================================
const P11 = mkPractice(11, [[], [0, 1], [2, 3], []]);
function ScreenP11(p) { return <Practice p={p} S={P11.S} steps={P11.steps} trouble={P11.trouble} proof={P11.proof} tree={FILES()} />; }

// ============================================================
//  12 · Buzamiz: xom tana va rawBody (00b; whv2-out/07done, 07json, 08)
// ============================================================
const JS = { a: lineN('CTRL_JSON', /Buffer\.from\(JSON\.stringify\(body\)\)/) };
// curl satri ikkiga: buyruq va tana (bo'sh joylar ko'rinsin)
const splitCurl = (k) => KOD.OUT[k].split('\n').filter((l) => l.trim()).slice(1).filter((l, i, a) => i < a.findIndex((x) => x.startsWith('## Server'))).flatMap((l) => { const m = /^(\$ curl .*?) -d '(.*)'$/.exec(l); return m ? [m[1] + ' \\', "    -d '" + m[2] + "'"] : [l]; }).map((l) => ({ h: liveLine(l) }));
const T12A = splitCurl('07done');
const T12B = splitCurl('07json');
const MNR = lineN('MAIN_NORAW', /NestFactory\.create\(AppModule/);
const T12C = [...outPick('08', (l) => /main\.ts:/.test(l)), ...outRange('08', /^\$ npm run pay/, /^## Server/), ...outRange('08', /^\$ psql/, null)];
const CAUSE12 = ['Xizmat imzoni aniq baytlardan hisoblaydi — bo\'sh joy ham bayt', "Nest tanani obyektga aylantiradi, baytlarni tashlaydi", "JSON.stringify(body) — boshqa baytlar: bo'sh joy yo'qoladi, imzo mos kelmaydi", "Baytlarni faqat rawBody: true saqlaydi — req.rawBody"];
const S12 = mkS(12, [{ v: 'code' }, { v: 'two' }, { v: 'raw' }, { v: 'cause' }]);
function Screen12(p) {
  return <Lesson p={p} S={S12} scene={({ seg }) => <>
    {seg.v === 'code' && <CodePanel file={t("payment.controller.ts · json nusxa (imzo JSON.stringify'dan)", "payment.controller.ts · копия json (подпись из JSON.stringify)")} lines={kod('CTRL_JSON', rngIds(JS.a - 1, JS.a + 3, 'x'), JS.a - 3, JS.a + 5)} focus={['x']} />}
    {seg.v === 'two' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("wh-done (xom tana) · bo'sh joyli JSON", "wh-done (сырое тело) · JSON с пробелами")} lines={T12A} /><Term title={t("json nusxa · o'sha xabar", "копия json · то же сообщение")} lines={T12B} er /></div>}
    {seg.v === 'raw' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file={t("src/main.ts · norawbody nusxa", "src/main.ts · копия norawbody")} lines={kod('MAIN_NORAW', { [MNR]: 'x' }, MNR - 1, MNR + 1)} focus={['x']} /><Term title={t("norawbody · to'g'ri imzoli to'lov (08)", "norawbody · оплата с верной подписью (08)")} lines={T12C} er /></div>}
    {seg.v === 'cause' && <Cause items={CAUSE12} on={4} bad={2} />}
  </>} />;
}

// ============================================================
//  13 · Buzamiz: tartib — 401, lekin «To'landi» (00b tartib; whv2-out/09, 09b)
// ============================================================
const TR = { parse: lineN('CTRL_TARTIB', /const p = parsePayment/), rec: lineN('CTRL_TARTIB', /const r = await this\.payments\.record/) };
TR.thr = lineN('CTRL_TARTIB', /throw new UnauthorizedException/, TR.rec);
const T13A = outRange('09', /^\$ npm run pay/, /^## Server/);
const T13DB = outRange('09', /^\$ psql/, null);
const CAUSE13 = ['parsePayment va record — imzodan oldin', 'record tranzaksiyasi tugadi: payments da qator, orders.payment_status = paid', "keyin imzo tekshiriladi — 401 qaytadi", '401 faqat javob — bazaga yozilganni qaytarmaydi: admin yetkazadi, pul yo\'q'];
const S13 = mkS(13, [{ v: 'code' }, { v: 'run' }, { v: 'db' }, { v: 'cause' }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {seg.v === 'code' && <CodePanel file={t("payment.controller.ts · tartib nusxa", "payment.controller.ts · копия tartib")} lines={kod('CTRL_TARTIB', { [TR.parse]: 'x', [TR.rec]: 'x' }, TR.parse, TR.thr + 1)} focus={['x']} />}
    {seg.v === 'run' && <Term title={t("VS Code terminali · npm run pay -- 1 imzosiz (09)", "терминал VS Code · npm run pay -- 1 imzosiz (09)")} lines={T13A} />}
    {seg.v === 'db' && <div style={{ display: 'grid', gap: 8 }}><Term title="psql (09)" lines={T13DB} er /><PanelView k="09b-1" small label={t("tartib nusxa · imzosiz xabardan keyin", "копия с порядком · после сообщения без подписи")} /></div>}
    {seg.v === 'cause' && <Cause items={CAUSE13} on={4} bad={3} />}
  </>} />;
}

// ============================================================
//  14 · Tekshiruv 2 — LineCheck: record imzodan oldin (tartib nusxa)
// ============================================================
const LC14 = KOD.CTRL_TARTIB.lines.filter((l) => l.n >= TR.parse && l.n <= TR.thr + 1).map((l) => ({ h: tsLine(l.t), n: l.n }));
const LC14_FIXED = KOD.CTRL.lines.filter((l) => l.n >= CT.iff && l.n <= CT.rec).map((l) => ({ h: tsLine(l.t), n: l.n, ...(l.n >= CT.parse ? { neu: true } : {}) }));
function Screen14(p) {
  const m = MDT[14];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={t("payment.controller.ts · webhook() · tartib nusxa", "payment.controller.ts · webhook() · копия tartib")} lines={LC14} target={LC14.findIndex((l) => l.n === TR.rec)}
    fixed={LC14_FIXED} fixedExtra={[{ file: t('psql · tartib nusxa, imzosiz xabardan keyin (09) — 401, lekin paid', "psql · копия с порядком, после сообщения без подписи (09) — 401, но paid"), lines: T13DB }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  15 · Kalit bo'sh, summa va maydon xato (whv2-out/10, 11; signature.ts)
// ============================================================
const T15W = outPick('10', (l) => /PAYMENT_WEBHOOK_SECRET bo'sh/.test(l));
const T15P = [...outRange('10', /^\$ npm run pay/, /^\$ psql/), ...outRange('10', /^\$ psql/, null)];
const T15S = outPick('11', (l) => !/^\s*$/.test(l));
// F-1109-06: xulosa — ikki karta o'rniga haqiqiy ogohlantirish va natija (whv2-out/10) hamda kalit joylari teglar bilan
function Key15() {
  return <div className="z">
    <div className="z-card" style={{ borderColor: 'var(--bad)' }}>
      <p className="z-h">{t(".env da PAYMENT_WEBHOOK_SECRET bo'sh — server ishga tushadi, lekin", "PAYMENT_WEBHOOK_SECRET в .env пустой — сервер запускается, но")}</p>
      <div className="z-term"><span className="y">WARN [Payment] PAYMENT_WEBHOOK_SECRET bo'sh — har to'lov xabari 401 bilan rad etiladi (.env)</span>{'\n'}<span className="m">$ npm run pay -- 1</span>{'\n'}<span className="r">← 401 {'{'}"message":"imzo noto'g'ri","error":"Unauthorized","statusCode":401{'}'}</span>{'\n'}<span className="m">payments_qatorlari:</span> 0</div>
      <span className="z-mut">{t("imzo to'g'ri bo'lsa ham — summa va qator to'g'ri bo'lsa ham — har xabar 401", "даже при верной подписи, сумме и строке — каждое сообщение 401")}</span>
    </div>
    <div className="z-two">
      <div className="z-card" style={{ borderColor: 'var(--ok)' }}>
        <p className="z-h" style={{ color: 'var(--ok)' }}>{t("Kalit — shu yerda", "Ключ — здесь")}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}><span className="z-tag g">{t(".env (lokal)", ".env (локально)")}</span><span className="z-tag g">{t("hosting sozlamasi (Render)", "настройки хостинга (Render)")}</span><span className="z-tag g">{t("xizmat kabineti", "кабинет сервиса")}</span></div>
      </div>
      <div className="z-card" style={{ borderColor: 'var(--bad)' }}>
        <p className="z-h" style={{ color: 'var(--bad)' }}>{t("Kalit — hech qachon", "Ключ — никогда")}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}><span className="z-tag r">{t("kodda", "в коде")}</span><span className="z-tag r">{t("git'da", "в git")}</span><span className="z-tag r">{t("AI'ga chatda", "AI в чате")}</span><span className="z-tag r">{t("skrinshotda", "на скриншоте")}</span></div>
        <span className="z-mut">{t("tushib qolsa — darhol almashtiriladi", "если утёк — сразу меняется")}</span>
      </div>
    </div>
  </div>;
}
const S15 = mkS(15, [{ v: 'warn' }, { v: 'p401' }, { v: 'p400' }, { v: 'hyg' }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <>
    {seg.v === 'warn' && <Term title={t("server logi · ishga tushish (10)", "лог сервера · запуск (10)")} lines={T15W} />}
    {seg.v === 'p401' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("kalit bo'sh · npm run pay (10)", "ключ пустой · npm run pay (10)")} lines={T15P} er /><CodePanel file="signature.ts" lines={kod('SIG', { [SG.chk]: 'c' }, SG.chk - 1, SG.chk)} focus={['c']} /></div>}
    {seg.v === 'p400' && <Term title={t("imzo to'g'ri, summa va holat xato (11)", "подпись верная, сумма и статус неверные (11)")} lines={T15S} />}
    {seg.v === 'hyg' && <Key15 />}
  </>} />;
}

// ============================================================
//  16 · Tekshiruv 3 — kalit bo'sh bo'lsa (10; payment.controller.spec.ts)
// ============================================================
const CS16 = lineN('CSPEC', /kalit bo'sh — to'g'ri ko'rinadigan imzo ham 401/);
function Screen16(p) {
  return MC(p, 16, {
    above: <div style={{ display: 'grid', gap: 8 }}><CodePanel file="signature.ts" lines={kod('SIG', { [SG.chk]: 'c' }, SG.chk - 1, SG.chk)} focus={['c']} /><Term title={t("server logi (10)", "лог сервера (10)")} lines={T15W} /></div>,
    after: <div style={{ display: 'grid', gap: 8 }}><Term title={t("kalit bo'sh · npm run pay (10)", "ключ пустой · npm run pay (10)")} lines={T15P} /><CodePanel file="payment.controller.spec.ts" lines={kod('CSPEC', { [CS16]: 't' }, CS16, CS16)} focus={['t']} /></div>,
  });
}

// ============================================================
//  17 · Amaliyot 3 — tartibni buzing, testlar qizarsin (whv2-out/14, 13)
// ============================================================
const P17 = mkPractice(17, [[], [0, 1], [2, 3], []], {
  code: [{ step: 0, file: F.ctrl, lines: kod('CTRL_TARTIB', { [TR.parse]: 'x', [TR.rec]: 'x' }, TR.parse, TR.thr + 1), copy: false }, { step: 2, file: F.cspec, lines: kod('CSPEC', {}, lineN('CSPEC', /imzosiz — 401/), lineN('CSPEC', /imzodan keyin tana/) + 5), copy: false }],
});
function ScreenP17(p) { return <Practice p={p} S={P17.S} steps={P17.steps} trouble={P17.trouble} proof={P17.proof} code={P17.code} tree={FILES()} />; }
