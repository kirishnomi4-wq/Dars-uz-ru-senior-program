
// ============================================================
//  TgPg — «Buzamiz» (20-ekran) uchun kichik rasm (F-1120-02, M51/M52). Darsning katta rasmi — parts/02e-bot.jsx (BotMap).
//  Qiymatlar: manba/orderbot-out/09, 10-smoke-buzuq (buzuq: 1/0 5/0 5/0 5/0 5/0), tgpg-done: 1/0 × 5. CSS izohida backtick yo'q.
// ============================================================
// locked: kodda qulf bormi · known: natija ko'rinadimi (M52-3: ovoz aytguncha «?») · fixed · pins: { a, b }
function RaceMini({ locked, known, fixed, pins = {} }) {
  const bad = !locked && !fixed;
  const res = !known ? '?' : bad ? '5 / 0' : '1 / 0';
  const box = (x, w, label, sub, state) => <div className="n1-abs" style={{ left: x, top: 34, width: w, height: 50, borderRadius: 10, border: `2px solid ${state === 'bad' ? '#DC2626' : state === 'ok' ? T.green : T.line}`, background: state === 'bad' ? '#FEF2F2' : T.paper, padding: '6px 9px', transition: 'all .4s' }}>
    <div style={{ font: `700 11.5px ${MONO}`, color: state === 'bad' ? '#B91C1C' : T.ink, whiteSpace: 'nowrap' }}>{label}</div>
    <div style={{ font: `500 10.5px ${MONO}`, color: state === 'bad' ? '#B91C1C' : T.ink3, whiteSpace: 'nowrap', marginTop: 3 }}>{sub}</div>
  </div>;
  return <>
    <span className="n1-tagl" style={{ left: 8, top: 12 }}>{t("5 mijoz · 1 ta Planshet · bir vaqtda", '5 клиентов · 1 Planshet · одновременно')}</span>
    {box(8, 104, '×5 mijoz', '✅ Buyurtma', '')}
    {box(128, 196, locked || fixed ? 'findOne + lock' : 'findOneBy', locked || fixed ? t('qulf: biri kutadi', 'блок: второй ждёт') : t('qulfsiz: hammasi 1 ni ko\'radi', 'без блока: все видят 1'), bad ? 'bad' : fixed ? 'ok' : '')}
    {box(340, 172, 'products', 'Planshet · stock 1', '')}
    {[112, 324].map((x) => <div key={x} className="n1-arr" style={{ left: x + 1, top: 58, width: 14 }} />)}
    <span className="n1-abs" style={{ left: 8, top: 96, font: `700 11.5px ${MONO}`, whiteSpace: 'nowrap', color: res === '?' ? T.ink3 : bad ? '#DC2626' : T.green }}>{t('sotildi / ombor', 'продано / склад')} → {res}{known && bad ? t(' · CHECK ushlamadi', ' · CHECK не поймал') : ''}</span>
    {pins.a && <span className="n1-pin on" style={{ left: 310, top: 26 }}>{pins.a}</span>}
    {pins.b && <span className="n1-pin on" style={{ left: 498, top: 26 }}>{pins.b}</span>}
  </>;
}
