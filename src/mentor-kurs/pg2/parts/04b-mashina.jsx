
// ============================================================
//  PG-2 DARSINING RASMI (F-1120-02, qonun M51) — «So'rov bazagacha va qaytib».
//  Chapda ikki mijoz: Postman (Express orqali) va psql (to'g'ridan-to'g'ri SQL). O'rtada Express (server.js):
//  express.json → route → pool.query. O'ngda PostgreSQL: car_rental · cars va shop · products. Pastda — bajarilayotgan satr.
//  Qiymatlar — manba/pg2-out (11-crud-sorovlar, 12-price-xato, 13-express-json-yoq, v2b-01). Satr raqamlari server.js dagidek
//  (06-s14-s27.jsx: Pool 10–16 · json 18 · GET 21–29 · POST 32–44, SQL 36). Modul darajasida PG/T ishlatilmaydi (yig'ish tartibi).
//  Ranglar: dars ranglari (T, PG). CSS izohida backtick yo'q.
// ============================================================
const CARS0 = [['1', 'Chevrolet Cobalt', '280000'], ['2', 'Chevrolet Malibu', '520000'], ['3', 'Kia K5', '610000']];
const PRODS0 = [['1', 'Klaviatura', '120000'], ['2', 'Sichqoncha', '75000']];
// on: yonib turgan bekatlar ('pm','json','route','pool','cars','psql','shop'); berilmasa — hammasi oddiy
// path: 'api' | 'psql' | 'both' — qaysi yo'l rangli · back: javob yo'li (yashil) · st: status (null — yo'q, '?' — hali noma'lum)
// bad: { at: 'json'|'route'|'pool'|'cars'|'pg', why } · pins: { json|route|pool|cars|col|pm: raqam } (M52-4)
// cars/prods: jadval qatorlari · newRow: cars'da yangi qator (yashil) · col: cars ustunlari satri · psqlLine: [buyruq, natija]
// route/sql: Express ichidagi satrlar · rc: natija chipi · ro: [fayl:satr, html] · tag · max
function CrudMachine({ on, path = 'api', back, st = null, res, bad, pins = {}, cars = CARS0, newRow, col, prods = PRODS0, psqlLine, req, route, sql, rc, ro, tag, max, json = true }) {
  const W = 760, BOT = 300;
  const H = BOT + (ro ? 54 : 4);
  const lit = (k) => !on || on.includes(k);
  const ds = (k) => (bad && bad.at === k ? 'bad' : lit(k) ? (on ? 'hl' : '') : 'dim');
  const apiOn = path === 'api' || path === 'both', psqlOn = path === 'psql' || path === 'both';
  const stC = st == null || st === '?' ? T.ink3 : st >= 400 ? '#DC2626' : T.green;
  const station = (k, y, txt, ref, c) => {
    const s = ds(k);
    return <div key={k} className="n1-abs n1-st" data-st={s === 'dim' ? 'dim' : undefined} style={{ left: 244, top: y, width: 244, height: 34, borderRadius: 9, border: `2px solid ${s === 'bad' ? '#DC2626' : c}`, background: s === 'bad' ? '#FEF2F2' : T.paper, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', font: `500 ${((n) => (n > 30 ? 10 : n > 26 ? 10.5 : 11.5))(txt.replace(/<[^>]+>/g, '').length)}px ${MONO}`, color: s === 'bad' ? '#B91C1C' : T.ink, whiteSpace: 'nowrap', overflow: 'hidden', boxShadow: s === 'hl' ? '0 0 0 3px rgba(226,69,31,.14)' : 'none', textDecoration: s === 'bad' && k === 'json' ? 'line-through' : 'none' }}>
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }} dangerouslySetInnerHTML={html(txt)} /><span style={{ color: T.ink3, fontSize: 10.5 }}>{ref}</span>
    </div>;
  };
  const pin = (k, x, y) => (pins[k] ? <span key={'p' + k} className="n1-pin on" style={{ left: x, top: y }}>{pins[k]}</span> : null);
  const tbl = (k, name, cols, rows, y, hlRow, colsHtml) => {
    const s = ds(k);
    return <div className="n1-abs n1-st" data-st={s === 'dim' ? 'dim' : undefined} style={{ left: 530, top: y, width: 202, borderRadius: 10, border: `1.5px solid ${s === 'bad' ? '#DC2626' : s === 'hl' ? PG.pg : T.line}`, background: T.paper, overflow: 'hidden', boxShadow: s === 'hl' ? '0 0 0 3px rgba(51,103,145,.14)' : 'none' }}>
      <div style={{ padding: '5px 9px', font: `700 11.5px ${MONO}`, color: PG.pg, background: '#F1F5F9' }}>{name}</div>
      <div style={{ padding: '3px 9px', font: `600 10.5px ${MONO}`, color: s === 'bad' ? '#B91C1C' : T.ink2, borderTop: `1px solid ${T.line}`, whiteSpace: 'nowrap' }} dangerouslySetInnerHTML={html(colsHtml || cols)} />
      {rows.map((r, i) => <div key={i} style={{ padding: '2px 8px', font: `500 10px/1.55 ${MONO}`, color: i === hlRow ? T.green : T.ink, background: i === hlRow ? '#E3F5EC' : undefined, fontWeight: i === hlRow ? 700 : 500, borderTop: `1px solid ${T.line}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.join(' · ')}</div>)}
    </div>;
  };
  const rq = req || { m: 'POST', url: '/api/cars', body: '{ "model": "Chevrolet Spark", … }' };
  const pl = psqlLine || ['shop=#', 'UPDATE products SET price = 99000 WHERE id = 1;', 'UPDATE 1'];
  return <N1Fit w={W} h={H} max={max}>
    {tag && <span className="n1-tagl" style={{ left: 20, top: 4 }}>{tag}</span>}
    {/* Postman — Express orqali */}
    <div className="n1-abs n1-st" data-st={ds('pm') === 'dim' ? 'dim' : undefined} style={{ left: 20, top: 30, width: 196, height: 138, borderRadius: 12, border: `2px solid ${ds('pm') === 'hl' ? PG.post : T.line}`, background: T.paper, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderBottom: `1px solid ${T.line}`, whiteSpace: 'nowrap' }}><b style={{ font: `700 12px ${SANS}`, color: PG.post }}>Postman</b><span style={{ font: `700 10px ${MONO}`, color: '#fff', background: rq.m === 'GET' ? PG.pg : T.green, borderRadius: 5, padding: '2px 5px' }}>{rq.m}</span><span style={{ font: `500 11px ${MONO}`, color: T.ink2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{rq.url}</span></div>
      <div style={{ padding: '5px 10px', font: `500 10px/1.5 ${MONO}`, color: T.ink2, height: 56, overflow: 'hidden', overflowWrap: 'anywhere' }}>{rq.body || t("tanasiz so'rov", 'запрос без тела')}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px', borderTop: `1px solid ${T.line}` }}>
        <span style={{ font: `700 12px ${MONO}`, color: '#fff', background: stC, borderRadius: 6, padding: '3px 7px', minWidth: 34, textAlign: 'center', transition: 'background .4s' }}>{st == null ? '…' : st}</span>
        <span style={{ font: `500 10px/1.35 ${MONO}`, color: st >= 400 ? '#B91C1C' : T.ink2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflowWrap: 'anywhere' }}>{res || ''}</span>
      </div>
    </div>
    {pin('pm', 206, 22)}
    {/* psql — to'g'ridan-to'g'ri SQL */}
    <div className="n1-abs n1-st" data-st={ds('psql') === 'dim' ? 'dim' : undefined} style={{ left: 20, top: 222, width: 196, height: 74, borderRadius: 12, background: T.code, padding: '8px 10px', font: `500 10.5px/1.45 ${MONO}`, color: T.codeInk, overflow: 'hidden', boxShadow: ds('psql') === 'hl' ? '0 0 0 3px rgba(226,69,31,.18)' : 'none' }}>
      <div style={{ color: '#8A90A2', whiteSpace: 'nowrap' }}>psql</div>
      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><span style={{ color: '#8A90A2' }}>{pl[0]}</span> {pl[1]}</div>
      <div className={/ERROR/.test(pl[2]) ? 'n1-er' : 'n1-ok'} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pl[2]}</div>
    </div>
    {/* Express — server.js */}
    <div className="n1-app" style={{ left: 232, top: 30, width: 268, height: 160 }} />
    <span className="n1-tagl" style={{ left: 246, top: 40 }}>Express · server.js</span>
    {json ? station('json', 58, 'app.use(<span class="n1-c">express.json</span>())', '18', T.yellow) : <div className="n1-abs" style={{ left: 244, top: 58, width: 244, height: 34, borderRadius: 9, border: '1.5px dashed #F2A9A9', background: '#FEF2F2', display: 'flex', alignItems: 'center', padding: '0 10px', font: `600 11.5px ${MONO}`, color: '#B91C1C', whiteSpace: 'nowrap' }}>{t("18-satr yo'q — req.body: undefined", 'строки 18 нет — req.body: undefined')}</div>}
    {station('route', 100, route || "app.<span class=\"n1-k\">post</span>(<span class=\"n1-s\">'/api/cars'</span>)", route && /get/.test(route) ? '21' : '32', T.ink2)}
    {station('pool', 142, sql || 'pool.query(sql, [$1, $2, $3])', route && /get/.test(route) ? '23' : '36', T.purple)}
    {pin('json', 478, 50)}{pin('route', 478, 92)}{pin('pool', 478, 134)}
    {/* PostgreSQL */}
    <div className="n1-abs" style={{ left: 520, top: 30, width: 220, height: 266, borderRadius: 14, border: `2px solid ${ds('pg') === 'bad' ? '#DC2626' : PG.pg}`, background: ds('pg') === 'bad' ? '#FEF2F2' : '#F7FAFC' }} />
    <span className="n1-abs" style={{ left: 532, top: 21, background: T.paper, padding: '0 6px', font: `700 12.5px/16px ${SANS}`, color: PG.pg, whiteSpace: 'nowrap' }}>PostgreSQL :5432</span>
    {tbl('cars', 'car_rental · cars', 'id · model · daily_price', cars, 48, newRow, col)}
    {tbl('shop', 'shop · products', 'id · name · price', prods, 210, -1)}
    {pin('cars', 716, 40)}{pin('col', 716, 66)}
    {/* yo'llar */}
    <svg className="n1-svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <marker id="pg2r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={T.accent} /></marker>
        <marker id="pg2g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={T.green} /></marker>
        <marker id="pg2k" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#B9BFCB" /></marker>
      </defs>
      <path d="M216 75 L 240 75" fill="none" stroke={apiOn ? T.accent : '#B9BFCB'} strokeWidth="2" markerEnd={`url(#${apiOn ? 'pg2r' : 'pg2k'})`} />
      <path d="M366 92 L 366 98 M366 134 L 366 140" fill="none" stroke={apiOn ? T.accent : '#B9BFCB'} strokeWidth="2" />
      <path d="M488 159 L 526 159" fill="none" stroke={apiOn ? T.accent : '#B9BFCB'} strokeWidth="2" markerEnd={`url(#${apiOn ? 'pg2r' : 'pg2k'})`} strokeDasharray={bad && (bad.at === 'json' || bad.at === 'route') ? '4 4' : '0'} />
      {back && <path d="M520 206 L 228 206 L 228 150 L 220 150" fill="none" stroke={bad ? '#DC2626' : T.green} strokeWidth="2" markerEnd={`url(#${bad ? 'pg2r' : 'pg2g'})`} strokeDasharray={bad ? '5 4' : '0'} />}
      <path d="M216 259 L 530 259" fill="none" stroke={psqlOn ? T.accent : '#D5D9E1'} strokeWidth="2" markerEnd={`url(#${psqlOn ? 'pg2r' : 'pg2k'})`} strokeDasharray={psqlOn ? '0' : '5 5'} />
    </svg>
    {back && <span className="n1-abs" style={{ left: 374, top: 206, transform: 'translate(-50%,-50%)', background: T.paper, padding: '1px 7px', borderRadius: 6, font: `600 11px ${MONO}`, color: bad ? '#B91C1C' : T.green, whiteSpace: 'nowrap', border: `1px solid ${bad ? '#F2A9A9' : '#BFE3D0'}` }}>{back}</span>}
    <span className="n1-abs" style={{ left: 374, top: 259, transform: 'translate(-50%,-50%)', background: T.paper, padding: '1px 7px', font: `600 10.5px ${MONO}`, color: psqlOn ? T.accent : T.ink3, whiteSpace: 'nowrap' }}>{t("psql — SQL to'g'ridan-to'g'ri", 'psql — SQL напрямую')}</span>
    {rc && <span className="n1-abs" style={{ left: 534, top: 182, font: `600 10.5px ${MONO}`, color: T.green, whiteSpace: 'nowrap', background: '#E3F5EC', borderRadius: 6, padding: '3px 7px' }}>{rc}</span>}
    {bad && bad.why && <span className="n1-abs" style={{ left: bad.at === 'cars' || bad.at === 'pg' ? 534 : 244, top: bad.at === 'cars' || bad.at === 'pg' ? 182 : 196, font: `700 11px ${SANS}`, color: '#B91C1C', whiteSpace: 'nowrap', background: T.paper, padding: '1px 4px' }}>✕ {bad.why}</span>}
    {ro && <div className="n1-ro" style={{ left: 20, top: BOT + 8, width: 720, height: 42 }}><span className="rf">{ro[0]}</span><code style={{ fontSize: ro[1].replace(/<[^>]+>/g, '').length > 72 ? 11.5 : 13, background: 'transparent', color: T.codeInk, padding: 0, border: 0 }} dangerouslySetInnerHTML={html(ro[1])} /></div>}
  </N1Fit>;
}

// «Buzamiz» (22, 23) — VS Code oynasi ichidagi kichik rasm (M52): Postman → express.json → INSERT → cars → javob
// broken: 'col' (price) | 'json' · known: natija ko'rinadimi (M52-3: ovoz aytguncha «?») · fixed · pins: { a: 1, b: 2 }
function CrudMini({ broken, known, fixed, pins = {} }) {
  const bad = broken && !fixed;
  const st = !broken && !fixed ? null : !known ? '?' : bad ? 500 : 201;
  const box = (x, w, label, sub, state) => <div className="n1-abs" style={{ left: x, top: 34, width: w, height: 50, borderRadius: 10, border: `2px solid ${state === 'bad' ? '#DC2626' : state === 'ok' ? T.green : T.line}`, background: state === 'bad' ? '#FEF2F2' : T.paper, padding: '6px 9px', transition: 'all .4s' }}>
    <div style={{ font: `700 11.5px ${MONO}`, color: state === 'bad' ? '#B91C1C' : T.ink, whiteSpace: 'nowrap', textDecoration: state === 'bad' && sub === 'gone' ? 'line-through' : 'none' }} dangerouslySetInnerHTML={html(label)} />
    <div style={{ font: `500 10.5px ${MONO}`, color: state === 'bad' ? '#B91C1C' : T.ink3, whiteSpace: 'nowrap', marginTop: 3 }}>{sub === 'gone' ? t("o'chirilgan", 'удалена') : sub}</div>
  </div>;
  const colBad = bad && broken === 'col', jsonBad = bad && broken === 'json';
  return <>
    <span className="n1-tagl" style={{ left: 8, top: 12 }}>{t("POST /api/cars — so'rovning yo'li", 'POST /api/cars — путь запроса')}</span>
    {box(8, 92, 'Postman', 'POST', '')}
    {box(116, 128, 'express.json()', jsonBad ? 'gone' : 'req.body ✓', jsonBad ? 'bad' : fixed && broken === 'json' ? 'ok' : '')}
    {box(260, 156, 'INSERT INTO cars', colBad ? '(model, price, …)' : '(model, daily_price…)', colBad ? 'bad' : fixed && broken === 'col' ? 'ok' : '')}
    {box(430, 90, 'cars', 'daily_price', '')}
    {[100, 244, 416].map((x) => <div key={x} className={`n1-arr${bad && x > (jsonBad ? 100 : 244) ? ' off' : ''}`} style={{ left: x + 1, top: 58, width: 14 }} />)}
    <span className="n1-abs" style={{ left: 8, top: 96, font: `700 11.5px ${MONO}`, whiteSpace: 'nowrap', color: st == null || st === '?' ? T.ink3 : st >= 400 ? '#DC2626' : T.green }}>{st == null ? '' : `${t('javob', 'ответ')} → ${st}`}{st === 500 && jsonBad ? " · req.body: undefined" : st === 500 ? t(" · cars'da price ustuni yo'q", ' · в cars нет колонки price') : ''}</span>
    {pins.a && <span className="n1-pin on" style={{ left: jsonBad ? 230 : 402, top: 26 }}>{pins.a}</span>}
    {pins.b && <span className="n1-pin on" style={{ left: jsonBad ? 230 : 502, top: jsonBad ? 72 : 26 }}>{pins.b}</span>}
  </>;
}
