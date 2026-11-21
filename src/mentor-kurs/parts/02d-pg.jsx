
// ============================================================
//  PostgreSQL DARSLARI RASMI (F-1120-02, qonun M51) — PG-1 va PG-2 ga yig'iladi (dev/yig.sh).
//  Blog bazasi: users va posts jadvallari, tashqi kalit (posts.user_id → users.id), qoida belgilari,
//  JOIN chiziqlari, rad etilgan yozuv (✕) va pastda psql satri. Ma'lumot — manba/pg1-out dagi haqiqiy blog.
// ============================================================
const BLOG_USERS = [['1', 'ali'], ['2', 'vali'], ['3', 'sardor']];
const BLOG_POSTS = [['1', '1', 'Birinchi post'], ['2', '1', "Bugun Nest o'rgandim"], ['3', '2', 'Salom hammaga']];
// join: 'inner' | 'left' · fk: tashqi kalit chizig'i yonadi · rules: qoida belgilari yonadi · hl: { users: [ustun], posts: [ustun] }
// bad: { t: 'posts'|'users', row: [...], why } — jadvalga kirmagan yozuv · del: users qatori (o'chirish rad etildi)
// empty: jadvallar faqat tuzilish (qatorsiz) · read: [prompt, html] · out: html (natija yoki ERROR) · outEr
function BlogDb({ join, fk, rules, hl = {}, bad, del, empty, read, out, outEr, tag, compact, max, users = BLOG_USERS, posts = BLOG_POSTS }) {
  const RH = 26, TY = 44, HY = TY + 30, BY = HY + 26; // jadval: sarlavha · ustun nomlari · qatorlar
  const U = { x: 20, w: 250, cols: [['id', 60], ['username', 190]] };
  const P = { x: 410, w: 330, cols: [['id', 50], ['user_id', 90], ['izoh', 190]] };
  const rowsU = empty ? [] : users, rowsP = empty ? [] : posts;
  const tblH = 30 + 26 + Math.max(rowsU.length, rowsP.length, 1) * RH + (bad ? RH + 8 : 0);
  const rdY = TY + tblH + 18;
  const H = compact ? rdY : rdY + (read ? 50 : 0) + (out ? 36 : 0) + 6;
  const colX = (tb, i) => tb.x + tb.cols.slice(0, i).reduce((a, c) => a + c[1], 0);
  const matched = (uid) => rowsP.some((r) => r[1] === uid);
  const uState = (i, r) => (del === r[0] ? 'del' : join === 'inner' && !matched(r[0]) ? 'dim' : join === 'left' && !matched(r[0]) ? 'left' : '');
  const cell = (tb, ci, ri, txt, extra = {}) => <div key={ci + '-' + ri} className="n1-abs" style={{ left: colX(tb, ci), top: BY + ri * RH, width: tb.cols[ci][1], height: RH, padding: '0 10px', display: 'flex', alignItems: 'center', font: `500 12.5px ${MONO}`, color: T.ink, borderTop: `1px solid ${T.line}`, whiteSpace: 'nowrap', overflow: 'hidden', ...extra }}>{txt}</div>;
  const head = (tb, name, color) => <>
    <div className="n1-abs" style={{ left: tb.x, top: TY, width: tb.w, height: tblH, border: `2px solid ${color}`, borderRadius: 12, background: T.paper }} />
    <div className="n1-abs" style={{ left: tb.x + 12, top: TY + 7, font: `700 14px ${MONO}`, color }}>{name}</div>
    {tb.cols.map(([c], i) => { const on = (hl[name] || []).includes(i); return <div key={c} className="n1-abs" style={{ left: colX(tb, i), top: HY, width: tb.cols[i][1], height: 26, padding: '0 10px', display: 'flex', alignItems: 'center', font: `700 11.5px ${MONO}`, color: on ? T.accent : T.ink2, background: on ? '#FFF0EB' : '#F6F7F9', borderTop: `1px solid ${T.line}`, transition: 'all .4s' }}>{c}</div>; })}
  </>;
  // tashqi kalit: ikki jadval orasida, ustun nomlari satrida — posts → users
  const jy = (ri) => BY + ri * RH + RH / 2;
  return <N1Fit w={760} h={H} max={max}>
    {tag && <span className="n1-tagl" style={{ left: 20, top: 4 }}>{tag}</span>}
    {head(U, 'users', '#336791')}
    {head(P, 'posts', '#336791')}
    {rules && <>
      <span className="n1-badge ok" style={{ left: U.x + 76, top: TY + 5, height: 20, fontSize: 10.5 }}>PK · NOT NULL · UNIQUE</span>
      <span className="n1-badge ok" style={{ left: P.x + 70, top: TY + 5, height: 20, fontSize: 10.5 }}>user_id REFERENCES users(id)</span>
    </>}
    {rowsU.map((r, i) => { const s = uState(i, r); return <React.Fragment key={'u' + i}>{r.map((c, ci) => cell(U, ci, i, c, { opacity: s === 'dim' ? 0.35 : 1, background: s === 'del' ? '#FEF2F2' : s === 'left' ? '#F5F3FF' : undefined, color: s === 'del' ? '#B91C1C' : T.ink }))}</React.Fragment>; })}
    {join === 'left' && rowsU.filter((r) => !matched(r[0])).map((r) => <span key={'n' + r[0]} className="n1-abs" style={{ left: U.x + U.w + 8, top: jy(rowsU.indexOf(r)) - 9, font: `600 11px ${MONO}`, color: T.purple }}>izoh: NULL</span>)}
    {del && <span className="n1-say er" style={{ left: U.x + U.w - 92, top: jy(rowsU.findIndex((r) => r[0] === del)) - 8 }}>✕ DELETE</span>}
    {rowsP.map((r, i) => <React.Fragment key={'p' + i}>{r.map((c, ci) => cell(P, ci, i, c, { color: ci === 1 && (fk || join) ? T.accent : T.ink, fontWeight: ci === 1 && (fk || join) ? 700 : 500 }))}</React.Fragment>)}
    {bad && <>
      {bad.row.map((c, ci) => cell(bad.t === 'users' ? U : P, ci, (bad.t === 'users' ? rowsU : rowsP).length, c, { top: BY + (bad.t === 'users' ? rowsU : rowsP).length * RH + 6, color: '#B91C1C', textDecoration: 'line-through', background: '#FEF2F2', borderTop: '1.5px dashed #F2A9A9' }))}
      <span className="n1-say er" style={{ left: (bad.t === 'users' ? U.x + U.w : P.x + P.w) - 150, top: TY + tblH + 2, fontSize: 11.5, background: T.paper, padding: '0 4px' }}>✕ {bad.why}</span>
    </>}
    <svg className="n1-svg" width="760" height={H} viewBox={`0 0 760 ${H}`}>
      {(fk || join) && <path d={`M${P.x - 2} ${HY + 13} L ${U.x + U.w + 4} ${HY + 13}`} fill="none" stroke={T.accent} strokeWidth="2" strokeDasharray={fk && !join ? '0' : '5 4'} markerEnd="url(#pgah)" />}
      <defs><marker id="pgah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill={T.accent} /></marker></defs>
      {join && rowsP.map((r, i) => { const ui = rowsU.findIndex((u) => u[0] === r[1]); if (ui < 0) return null; return <path key={i} d={`M${P.x} ${jy(i)} C ${P.x - 60} ${jy(i)}, ${U.x + U.w + 60} ${jy(ui)}, ${U.x + U.w} ${jy(ui)}`} fill="none" stroke={T.purple} strokeWidth="1.6" opacity=".75" />; })}
    </svg>
    {(fk || join) && <span className="n1-abs" style={{ left: (U.x + U.w + P.x) / 2, top: TY - 13, transform: 'translate(-50%,-50%)', font: `600 11px ${MONO}`, color: T.accent, whiteSpace: 'nowrap', background: T.paper, padding: '0 4px' }}>{join ? 'ON users.id = posts.user_id' : 'posts.user_id → users.id'}</span>}
    {!compact && read && <div className="n1-ro" style={{ left: 20, top: rdY, width: 720, height: 44 }}><span className="rf">{read[0]}</span><code style={{ fontSize: read[1].replace(/<[^>]+>/g, '').length > 75 ? 11.5 : undefined }} dangerouslySetInnerHTML={html(read[1])} /></div>}
    {!compact && out && <div className="n1-abs" style={{ left: 20, top: rdY + (read ? 50 : 0), width: 720, height: 30, borderRadius: 8, padding: '0 14px', display: 'flex', alignItems: 'center', font: `600 12px ${MONO}`, whiteSpace: 'nowrap', overflow: 'hidden', background: outEr ? '#FEF2F2' : '#E3F5EC', color: outEr ? '#B91C1C' : T.green }} dangerouslySetInnerHTML={html(out)} />}
  </N1Fit>;
}
