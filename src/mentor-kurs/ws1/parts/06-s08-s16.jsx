
// ============================================================
//  8 · Hodisa: tranzaksiyadan keyin, ichida faqat «nima o'zgardi» (telegram.service.ts, admin.controller.ts)
// ============================================================
const TG = { pl: lineN('TG', /await this\.orders\.place\(/), st: lineN('TG', /await this\.orders\.setStatus\(/) };
const TG_EMIT_NEW = lineN('TG', /orderChanged\(order\.id, 'new'\)/), TG_EMIT_ST = lineN('TG', /orderChanged\(order\.id, 'status'\)/);
const CT = { list: lineN('CTRL', /@Get\('orders'\)/) };
const S8 = mkS(8, [{ v: 'pl' }, { v: 'st' }, { v: 'flow' }, { v: 'ctrl' }]);
function Screen8(p) {
  return <Lesson p={p} S={S8} scene={({ seg }) => <>
    {seg.v === 'pl' && <Code k="TG" ids={{ [TG.pl]: 'a', [TG_EMIT_NEW]: 'e', [TG_EMIT_NEW - 1]: 'e' }} from={TG.pl - 3} to={TG_EMIT_NEW + 2} focus={['a', 'e']} />}
    {seg.v === 'st' && <CodePanel file={t("telegram.service.ts · status tugmasi", "telegram.service.ts · кнопка статуса")} lines={kod('TG', { [TG.st]: 'a', [TG_EMIT_ST]: 'e' }, TG.st, TG_EMIT_ST + 1)} focus={['a', 'e']} />}
    {seg.v === 'flow' && <div style={{ display: 'grid', gap: 10 }}><Flow hl={['tx', 'ev', 'get']} /><div className="mk-rule">{t("Hodisada ", "В событии ")}<b>{t("faqat", "только")}</b> <code>orderId</code>{t(" va ", " и ")}<code>reason</code>{t(" — ro'yxat ham, telefon ham yo'q. Ma'lumot manbai bitta: baza (token bilan ", " — нет ни списка, ни телефона. Источник данных один: база (с токеном ")}<code>GET</code>).</div></div>}
    {seg.v === 'ctrl' && <Code k="CTRL" ids={rngIds(CT.list, CT.list + 16, 'l')} from={CT.list - 2} to={CT.list + 16} focus={['l']} />}
  </>} />;
}

// ============================================================
//  9 · Panel sahifasi: ulanish, tinglovchi, qayta so'rash (public/admin.html)
// ============================================================
const H = { scr: lineN('HTML', /socket\.io\/socket\.io\.js"><\/script>/), yk: lineN('HTML', /async function yukla/), ul: lineN('HTML', /function ulan\(\)/), on: lineN('HTML', /ulanish\.on\('order-changed'/), esc: lineN('HTML', /const esc =/), escU: lineN('HTML', /esc\(o\.customer\)/) };
const S9 = mkS(9, [{ v: 'scr' }, { v: 'ul', f: ['i', 'c'] }, { v: 'ul', f: ['o'] }, { v: 'esc' }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <>
    {seg.v === 'scr' && <Code k="HTML" ids={{ [H.scr]: 's', [H.scr - 1]: 's', [H.yk + 1]: 'f' }} from={H.scr - 1} to={H.yk + 1} focus={['s', 'f']} fresh={F.html} />}
    {seg.v === 'ul' && <Code k="HTML" ids={{ [H.ul + 2]: 'i', [H.ul + 4]: 'c', [H.ul + 6]: 'c', [H.on]: 'o' }} from={H.ul} to={H.on + 1} focus={seg.f} />}
    {seg.v === 'esc' && <CodePanel file="admin.html" lines={[...kod('HTML', { [H.esc]: 'e' }, H.esc - 1, H.esc), { h: '<span class="cm">…</span>', n: '' }, ...kod('HTML', { [H.escU]: 'e' }, H.escU, H.escU + 1)]} focus={['e']} />}
  </>} />;
}

// ============================================================
//  10 · Haqiqiy oqim: bot → server → panel (10-panel, 04, 12)
// ============================================================
const T10CLI = outPick('04', (l) => /order-changed|connect · ulangan/.test(l));
const T10SRV = outPick('04', (l) => /\[Live\] panel ulandi|— Bobur|qabul qilindi|— admin|Tasdiqlangan$/.test(l)).slice(0, 6);
const T10CI = outPick('12', (l) => /✓ (test|smoke) in|— live|✓ (tokensiz|yangi|GET|admin)|NATIJA/.test(l));
const S10 = mkS(10, [{ k: '10a' }, { k: '10b' }, { k: '10c', cli: true }, { ci: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <>
    {!seg.ci && !seg.cli && <PanelView k={seg.k} note={seg.k === '10a' ? t('token kiritildi — ro\'yxat GET /admin/orders dan', "токен введён — список из GET /admin/orders") : t('bot buyurtma oldi — sahifa yangilanmadi', "бот получил заказ — страница не обновилась")} />}
    {seg.cli && <div style={{ display: 'grid', gap: 8 }} className="c1-small"><PanelView k="10c" small note={t("admin tasdiqladi", "админ подтвердил")} /><div className="pg-two"><Term title="npm run live" lines={T10CLI} /><Term title={t("server logi", "лог сервера")} lines={T10SRV} /></div></div>}
    {seg.ci && <Term title="GitHub Actions · main · ws1-done (run 41856397400)" lines={T10CI} />}
  </>} />;
}

// ============================================================
//  11 · Tekshiruv 2 — LineCheck: () => yukla qavssiz (admin.html ulan(), 11b)
// ============================================================
const LC11 = KOD.HTML.lines.filter((l) => l.n >= H.ul && l.n <= H.on).map((l) => ({ h: tsLine(l.n === H.on ? l.t.replace('() => yukla())', '() => yukla)') : l.t), n: l.n }));
const LC11_FIXED = KOD.HTML.lines.filter((l) => l.n >= H.ul && l.n <= H.on).flatMap((l) => l.n === H.on ? [{ h: tsLine(l.t.replace('() => yukla())', '() => yukla)')), n: l.n, gone: true }, { h: tsLine(l.t), n: l.n, neu: true }] : [{ h: tsLine(l.t), n: l.n }]);
const T11X = [...txtLines(KOD.OUT['11b'].split('# brauzer')[1].split('#')[0]).filter((x) => !/^\s*$/.test(x.h)), ...outPick('11b', (l) => /order-changed/.test(l))];
function Screen11(p) {
  const m = MDT[11];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file="admin.html · ulan()" lines={LC11} target={LC11.length - 1}
    fixed={LC11_FIXED} fixedExtra={[{ file: t("brauzer (qavssiz) · 15 s — ro'yxat o'zgarmadi; o'sha paytda npm run live", "браузер (без скобок) · 15 с — список не изменился; в это же время npm run live"), lines: T11X }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  12 · Amaliyot 2 — brauzerda panel va bot
// ============================================================
const P12 = mkPractice(12, [[], [0, 1], [2, 3], []], { code: [{ step: 0, file: F.html, lines: kod('HTML', {}, H.ul, H.on + 1), copy: false }] });
function ScreenP12(p) { return <Practice p={p} S={P12.S} steps={P12.steps} trouble={P12.trouble} proof={P12.proof} code={P12.code} tree={FILES()} />; }

// ============================================================
//  13 · Uch holat (03, 05, 06, 10d, 10e)
// ============================================================
const S13 = mkS(13, [{ on: 0 }, { on: 1 }, { on: 2 }, { sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <>
    {!seg.sum && <><States on={seg.on} />{seg.on === 1 && <div style={{ marginTop: 10 }}><PanelView k="10d" small note={t("server to'xtatildi — ro'yxat ekranda qoladi", "сервер остановлен — список остаётся на экране")} /></div>}{seg.on === 2 && <div style={{ marginTop: 10 }}><PanelView k="10e" small note={t("ikkinchi oyna — token «notogri»", "второе окно — токен «notogri»")} /></div>}</>}
    {seg.sum && <div style={{ display: 'grid', gap: 10 }}><States /><CodePanel file="admin.html" lines={kod('HTML', { [H.ul + 6]: 'd', [H.ul + 7]: 'd' }, H.ul + 5, H.ul + 7)} focus={['d']} /></div>}
  </>} />;
}

// ============================================================
//  14 · Server o'chdi va qayta yondi (05)
// ============================================================
const L05 = outLines('05');
const T14A = outRange('05', /^\$ npm run live/, /disconnect: transport close/);
const T14B = outRange('05', /disconnect: transport close/, /connect · ulangan · transport: polling/);
const T14C = outRange('05', /^\$ npm run live/, null);
const STOPAT = (L05.find((l) => /server to'xtatildi/.test(l)) || '').slice(0, 8), STARTAT = (L05.find((l) => /qayta ishga/.test(l)) || '').slice(0, 8);
const S14 = mkS(14, [{ v: 'a' }, { v: 'b' }, { v: 'c' }, { v: 'q' }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <>
    {seg.v === 'a' && <Term title={t(`npm run live · ${STOPAT} — server to'xtatildi (Ctrl+C)`, `npm run live · ${STOPAT} — сервер остановлен (Ctrl+C)`)} lines={T14A.concat(T14B.slice(0, 1))} />}
    {seg.v === 'b' && <Term title={t("npm run live · qayta urinishlar", "npm run live · повторные попытки")} lines={T14B} />}
    {seg.v === 'c' && <Term title={t(`npm run live · ${STARTAT} — server qayta ishga tushirildi`, `npm run live · ${STARTAT} — сервер снова запущен`)} lines={T14C} />}
    {seg.v === 'q' && <div className="pg-two"><PanelView k="10d" small note={t("server o'chgan payt", "момент, когда сервер выключен")} /><Card c={C1.live} h={t("Savol — WebSocket-2", "Вопрос — WebSocket-2")}><p>{t("Server o'chiq paytida bot buyurtma olsa, panel qayta ulanganda uni ", "Если бот получил заказ, пока сервер был выключен, панель при переподключении ")}<b>{t("ko'radimi", "увидит его")}</b>{t("? Hodisa o'sha paytda hech kimga yetmagan.", "? Событие в тот момент ни до кого не дошло.")}</p></Card></div>}
  </>} />;
}

// ============================================================
//  15 · «Muzlash»: 45 soniya javobsiz (06)
// ============================================================
const L06 = outLines('06');
const FRZ = (L06.find((l) => /muzlatildi/.test(l)) || '').slice(0, 8), PTO = (L06.find((l) => /ping timeout/.test(l)) || '').slice(0, 8), CONT = (L06.find((l) => /davom ettirildi/.test(l)) || '').slice(0, 8);
const secs = (a, b) => { const s = (x) => x.split(':').reduce((t, v) => t * 60 + Number(v), 0); return a && b ? s(b) - s(a) : 0; };
const T15 = outRange('06', /^\$ npm run live/, /^# 45/);
// F-1109-06: xulosa — to'rt kichik karta o'rniga haqiqiy vaqt o'qi 20:19:50–20:20:55 (ws1v2-out/06), oraliq ajratilgan; 25 + 20 qoidasi
function Time15() {
  const gap = secs(FRZ, PTO);
  return <div className="z">
    <div className="z-card">
      <p className="z-h">{t("npm run live · server muzlatildi (kill -STOP) — haqiqiy vaqtlar", "npm run live · сервер заморожен (kill -STOP) — настоящее время")}</p>
      <svg className="z-svg" viewBox="0 0 780 250" role="img" aria-label="muzlash vaqt o'qi">
        <rect x="152" y="26" width="444" height="196" fill="#FEF3C7" opacity=".55" />
        <text x="374" y="20" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400E">{gap} s{t(" — klient hech narsa bilmaydi", " — клиент ничего не знает")}</text>
        <line x1="90" y1="222" x2="760" y2="222" stroke="#9CA3AF" />
        <g fontSize="12" fill="#6B7280">
          {[[90, ':19:50'], [193, ':20:00'], [296, ':10'], [399, ':20'], [502, ':30'], [605, ':40'], [708, ':50']].map(([x, l]) => <text key={x} x={x} y="240" textAnchor="middle" className="mono">{l}</text>)}
        </g>
        <text x="8" y="66" fontSize="13" fontWeight="700" fill="#374151">{t("Server", "Сервер")}</text>
        <rect x="90" y="52" width="62" height="22" rx="5" fill="#BBF7D0" />
        <rect x="152" y="52" width="536" height="22" rx="5" fill="#E5E7EB" stroke="#9CA3AF" strokeDasharray="5 4" />
        <text x="420" y="68" textAnchor="middle" fontSize="12.5" fill="#374151">{t("muzlagan: ulanish ochiq, javob yo'q", "заморожен: соединение открыто, ответа нет")}</text>
        <rect x="688" y="52" width="72" height="22" rx="5" fill="#BBF7D0" /><text x="724" y="68" textAnchor="middle" fontSize="12" fill="#166534">{t("davom", "продолжил")}</text>
        <text x="8" y="126" fontSize="13" fontWeight="700" fill="#374151">{t("Klient", "Клиент")}</text>
        <rect x="131" y="112" width="465" height="22" rx="5" fill="#BBF7D0" />
        <text x="350" y="128" textAnchor="middle" fontSize="12.5" fill="#166534">{t("«ulangan» — belgi yashil, hodisa kelmaydi", "«подключено» — значок зелёный, событий нет")}</text>
        <rect x="596" y="112" width="92" height="22" rx="5" fill="#F3F4F6" stroke="#9CA3AF" strokeDasharray="4 3" /><text x="642" y="128" textAnchor="middle" fontSize="12" fill="#4B5563">{t("ulanmoqda…", "подключается…")}</text>
        <rect x="688" y="112" width="72" height="22" rx="5" fill="#BBF7D0" /><text x="724" y="128" textAnchor="middle" fontSize="12" fill="#166534">{t("ulangan", "подключено")}</text>
        <line x1="596" y1="96" x2="596" y2="150" stroke="#DC2626" strokeWidth="2.5" />
        <text x="596" y="168" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#DC2626">{PTO} ping timeout</text>
        <text x="152" y="190" textAnchor="middle" fontSize="12" fill="#92400E" className="mono">{FRZ} STOP</text>
        <text x="760" y="190" textAnchor="end" fontSize="12" fill="#166534" className="mono">{CONT} CONT{t(" → darhol ulandi", " → сразу подключился")}</text>
      </svg>
    </div>
    <div className="z-two">
      <div className="z-card">
        <p className="z-h">{t("Nega 45 soniyagacha", "Почему до 45 секунд")}</p>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}><span className="z-tag b">pingInterval 25 s</span><b>+</b><span className="z-tag b">pingTimeout 20 s</span><b>=</b><span className="z-tag o">{t("45 s gacha", "до 45 s")}</span></div>
        <span className="z-mut">{t("socket.io standarti: javob yo'qligini faqat ping aniqlaydi", "стандарт socket.io: отсутствие ответа определяет только ping")}</span>
      </div>
      <div className="z-rule">{t("Sinfda: «uchish rejimida belgi o'zgarmadi» — ", "В классе: «в режиме полёта значок не изменился» — ")}<b>{t("kuting, 45 soniyagacha", "подождите, до 45 секунд")}</b>.</div>
    </div>
  </div>;
}
const S15 = mkS(15, [{ v: 'frz' }, { v: 'wait' }, { v: 'ping' }, { v: 'sum' }]);
function Screen15(p) {
  const line = <div className="c1-flow"><div style={{ '--c': C1.live }}><b>{FRZ}</b><small>{t("muzlatildi (kill -STOP)", "заморожен (kill -STOP)")}</small></div><span className="ar">→</span><div style={{ '--c': T.ink3 }}><b>+{secs(FRZ, PTO)} s</b><small>{t("javob yo'q — belgi «Ulangan»", "ответа нет — знак «Ulangan»")}</small></div><span className="ar">→</span><div style={{ '--c': T.accent }}><b>{PTO}</b><small>ping timeout</small></div><span className="ar">→</span><div style={{ '--c': T.green }}><b>{CONT}</b><small>{t("davom — darhol ulandi", "продолжение — сразу подключился")}</small></div></div>;
  return <Lesson p={p} S={S15} scene={({ seg }) => <>
    {seg.v === 'frz' && <Term title="npm run live" lines={T15.slice(0, 3)} />}
    {seg.v === 'wait' && <div style={{ display: 'grid', gap: 10 }}><Term title="npm run live" lines={T15.slice(0, 3)} />{line}</div>}
    {seg.v === 'ping' && <div className="pg-two"><Term title="npm run live" lines={T15} /><Card c={C1.ws} h={t("ping qoidasi (socket.io standarti)", "правило ping (стандарт socket.io)")}><p>{t("Server har ", "Сервер каждые ")}<b>25 s</b>{t(" ping yuboradi → klient javob beradi.", " шлёт ping → клиент отвечает.")}</p><p><b>20 s</b>{t(" ichida javob yo'q — ulanish o'lik: ", " нет ответа — соединение мертво: ")}<code>ping timeout</code>.</p><p>{t("Eng uzog'i — ", "Самое долгое — ")}<b>45 s</b>.</p></Card></div>}
    {seg.v === 'sum' && <Time15 />}
  </>} />;
}

// ============================================================
//  16 · Tekshiruv 3 — server javob bermasa (06)
// ============================================================
function Screen16(p) {
  return MC(p, 16, {
    above: <Term title={t("npm run live · server muzlatildi", "npm run live · сервер заморожен")} lines={['connect · ulangan · transport: polling', 'muzlatildi', 'ping timeout'].map((w) => outPick('06', (l) => l.includes(w))[0]).filter(Boolean)} />,
    after: <Term title="npm run live" lines={T15} />,
  });
}
