
// ============================================================
//  Jest-1 — «Buzamiz» (14-ekran) uchun kichik rasm (F-1120-02, M51/M52). Katta rasm — parts/02e-bot.jsx (BotMap + jest qatori).
//  Qiymatlar: jest1v2-out/07 (3 passed), 08 (1 failed, 2 passed; Received — Yetkazildi va Bekor tugmalari). CSS izohida backtick yo'q.
// ============================================================
// broken: shart buzildimi · known: natija ko'rinadimi (M52-3) · fixed · pins: { a, b }
function KbMini({ broken, known, fixed, pins = {} }) {
  const bad = broken && !fixed;
  const res = !broken && !fixed ? null : !known ? '?' : bad ? t('1 failed, 2 passed', '1 failed, 2 passed') : '3 passed';
  const box = (x, w, label, sub, state) => <div className="n1-abs" style={{ left: x, top: 34, width: w, height: 50, borderRadius: 10, border: `2px solid ${state === 'bad' ? '#DC2626' : state === 'ok' ? T.green : T.line}`, background: state === 'bad' ? '#FEF2F2' : T.paper, padding: '6px 9px', transition: 'all .4s' }}>
    <div style={{ font: `700 11.5px ${MONO}`, color: state === 'bad' ? '#B91C1C' : T.ink, whiteSpace: 'nowrap' }}>{label}</div>
    <div style={{ font: `500 10.5px ${MONO}`, color: state === 'bad' ? '#B91C1C' : T.ink3, whiteSpace: 'nowrap', marginTop: 3 }}>{sub}</div>
  </div>;
  return <>
    <span className="n1-tagl" style={{ left: 8, top: 12 }}>{t("Test kodni chaqiradi — bot ham, baza ham yo'q", 'Тест вызывает код — ни бота, ни базы')}</span>
    {box(8, 150, 'keyboards.spec.ts', t("kutadi: tugma yo'q", 'ждёт: кнопок нет'), '')}
    {box(174, 160, "orderKeyboard(…)", bad ? t("39: faqat 'DELIVERED'", "39: только 'DELIVERED'") : "'DELIVERED' || 'CANCELLED'", bad ? 'bad' : fixed ? 'ok' : '')}
    {box(350, 162, t('natija', 'результат'), !known || !broken ? '?' : bad ? t('2 tugma: 🚚 ❌', '2 кнопки: 🚚 ❌') : 'undefined', bad && known ? 'bad' : '')}
    {[158, 334].map((x) => <div key={x} className="n1-arr" style={{ left: x + 1, top: 58, width: 14 }} />)}
    {res && <span className="n1-abs" style={{ left: 8, top: 96, font: `700 11.5px ${MONO}`, whiteSpace: 'nowrap', color: res === '?' ? T.ink3 : bad ? '#DC2626' : T.green }}>npx jest keyboards → {res}</span>}
    {pins.a && <span className="n1-pin on" style={{ left: 148, top: 26 }}>{pins.a}</span>}
    {pins.b && <span className="n1-pin on" style={{ left: 502, top: 26 }}>{pins.b}</span>}
  </>;
}
