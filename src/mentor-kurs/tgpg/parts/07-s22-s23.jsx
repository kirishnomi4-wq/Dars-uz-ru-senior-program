// ============================================================
//  22 · m5-04 xaritasi (BotStatefulMemoryLesson.jsx — SCREEN_META 21)
// ============================================================
const MAP22 = [
  { t: 'Kirish', s: 's0–s1', d: 'adashgan suhbat · reja', m: 'holatsiz handler (2-ekran)' },
  { t: 'Holat', s: 's2–s6, s8', d: "holatsiz · holat bilan · test · obyekt · qayta ishga tushirish (ikki quti) · test", m: "RAM'da yo'qolishi haqiqiy (4-ekran)" },
  { t: 'Alohida', s: 's7, s9–s10', d: 'ikki mijoz · ikkalasi birdan · test', m: 'yashirin aralashish (6-ekran)' },
  { t: 'Baza', s: 's11–s15', d: "users jadvali · qadam-baqadam holat · SQL bo'shliqlari · test · oqim tartibi", m: 'BIGINT va matn (13–14-ekran) · takror INSERT (15-ekran)' },
  { t: 'Yakun', s: 's16', d: 'amaliyot (Neon + AI + TelegramBotNest) · kartochkalar · uyga vazifa', m: 'token, .env (19-ekran)' },
];
const S22 = mkS(22, [{ hl: [] }, { hl: [4], neon: true }, { hl: [3] }, { hl: [1, 2], sum: true }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP22.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.neon && <div className="n2-warn">Neon: <code>DATABASE_URL</code> oxiridagi <code>?sslmode=require</code> qolsin — repo kodi shunga qarab <code>ssl</code> yoqadi (<code>database.module.ts</code>). Neon'ni o'zimiz sinamadik.</div>}
    {seg.sum && <div className="mk-rule">Ikki mijoz va qayta ishga tushirishni sinfda <b>jonli</b> ko'rsating — ikki akkaunt bilan.</div>}
  </div>} />;
}

// ============================================================
//  23 · O'quvchi darsidagi so'zlar va sinfdagi holatlar
// ============================================================
const DICT23 = [['holat · holatli bot', 'state · stateful bot'], ['sessiya', 'bitta mijozning holati, kaliti chat.id'], ['dastur xotirasi · PostgreSQL qutisi', 'RAM · disk']];
const STUMBLE23 = [
  ['Ism unutildi', 'qayta ishga tushgach «Ismingiz nima?»', 'holat RAM\'da — bazaga'],
  ['Buyurtma aralashdi', "xato yo'q", 'umumiy o\'zgaruvchi — chat.id'],
  ['Katta raqam', 'integer out of range', 'BIGINT'],
  ['Ikkinchi /start', 'duplicate key', 'avval SELECT'],
  ['Bot javob bermaydi', '401: Unauthorized', 'token'],
  ['Server yonmaydi', 'DATABASE_URL topilmadi', '.env'],
];
const QA23 = [
  ['«Holatni JSON faylda saqlasa bo\'lmaydimi?»', "bitta jarayonda ishlaydi, lekin bir vaqtda ko'p yozuvda va serverni almashtirganda baza ishonchli."],
  ['«Nega ctx.chat.id, ism emas?»', "ism takrorlanadi, raqam — yo'q."],
  ["«Neon'ni o'chirsam, holat nima bo'ladi?»", "baza bilan birga yo'qoladi."],
  ['«Telegram raqam beradi-ku, nega matn bo\'lib keldi?»', "node-pg va TypeORM bigint'ni matn qaytaradi (14-ekran)."],
];
const S23 = mkS(23, [{ v: 'til' }, { hl: [0, 1, 2] }, { hl: [3, 4, 5] }, { hl: [], qa: true }]);
function Screen23(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {seg.v === 'til' ? <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">O'quvchi darsidagi so'z → uning atamasi</div>
      <table className="mk-tbl"><tbody>{DICT23.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>
    </div> : <div className="mk-qa">
      {STUMBLE23.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>}
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Xato chiqmasa — o'quvchi bilan birga <b>holat qayerda saqlanayotganiga</b> qarang: obyektdami, bazadami.</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA23.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}
