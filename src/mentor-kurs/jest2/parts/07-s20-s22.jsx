// ============================================================
//  20 · m4b-03 xaritasi (EdgeCasesTestLesson.jsx — SCREEN_META 21)
// ============================================================
const MAP20 = [
  { t: 'Kirish', s: 's0–s1', d: "g'alati buyurtmalar · reja (4 qadam)", m: '' },
  { t: 'Edge', s: 's2–s5', d: "happy path · edge (0, manfiy, 1) · test · noto'g'ri ma'lumot (NaN, null)", m: 'yashirin buzilish natijalari (3-ekran)' },
  { t: 'Guard', s: 's6–s9', d: "throw · o'rash () => · test · guard yig'ish (if → throw → return)", m: "() =>siz nima bo'ladi (8-ekran) · shartsiz throw (10-ekran)" },
  { t: 'Mustahkamlash', s: 's10–s15', d: 'testlar va haqiqiy edge testlarini tanlash', m: "toThrow('xabar') (9-ekran) · < 0 (11-ekran)" },
  { t: 'Yakun', s: 's16–s17', d: 'boundary etalon · amaliyot · kartochkalar · uyga vazifa applyCoupon', m: "TypeScript tuzog'i (13-ekran) · chegaraning ikki tomoni (17-ekran)" },
];
const S20 = mkS(20, [{ hl: [] }, { hl: [2] }, { hl: [4] }, { hl: [2, 4], sum: true }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP20.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.sum && <div className="mk-rule">Vaqt (taklif): 90 daqiqaning <b>25 tasi</b> — guard va o'rashga. Uyga vazifada to'rt qiymat: <b>0, 100, −1, 101</b>.</div>}
  </div>} />;
}

// ============================================================
//  21 · O'quvchi darsidagi so'zlar
// ============================================================
const DICT21 = [
  ["shumtaka mijoz · g'alati buyurtma", "edge case, noto'g'ri kirish"],
  ["«hech kim sezmaydi» (NaN kartochkasi)", 'xatosiz noto\'g\'ri natija (0, −10000, NaN)'],
  ["guard · 🚧 shart · 🧯 xato tashlash · ✅ to'g'ri hisob", 'if → throw new Error → return'],
  ["o'rab berish", 'expect(() => f()).toThrow()'],
  ['happy path', 'oddiy, kutilgan kirish'],
];
const S21 = mkS(21, [{ rows: [0] }, { rows: [1, 2] }, { rows: [3], sum: true }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">O'quvchi darsidagi so'z → uning atamasi</div>
    <table className="mk-tbl"><thead><tr><th>o'quvchi darsida</th><th>atama / kod</th></tr></thead><tbody>
      {DICT21.map(([a, b], i) => <tr key={a} className={seg.rows.includes(i) ? 'hl' : ''} style={{ opacity: seg.rows.length && !seg.rows.includes(i) ? 0.55 : 1 }}><td>{a}</td><td><code>{b}</code></td></tr>)}
    </tbody></table>
    {seg.sum && <div style={{ marginTop: 12, display: 'grid', gap: 8 }}><CodePanel file={F.ordSpec} wrap lines={WRAP_OK} focus={['x']} /><div className="mk-rule">«O'rab berish, <b>ya'ni () =&gt;</b>» — va shu satrni ko'rsating. Terminal so'zlari inglizcha qoladi: did not throw, Received message.</div></div>}
  </div>} />;
}

// ============================================================
//  22 · Sinfdagi holatlar va o'quvchi savollari
// ============================================================
const STUMBLE22 = [
  ["Himoya yo'q", 'Received function did not throw', 'guard'],
  ["() => yo'q", 'test funksiya xatosi bilan qulaydi', 'expect(() => …)'],
  ['Boshqa xabar', 'Expected substring / Received message', 'xabarni moslang'],
  ['Happy qizil', 'guard shartsiz yoki juda qattiq', 'if sharti'],
  ["'ikki' qizil chiziq", 'VS Code TS2345, test esa yuradi', 'as any'],
  ["Nomlar yo'q", 'ikki fayl', 'jami son · --verbose'],
];
const QA22 = [
  ["«Nega xato tashlaymiz, 0 qaytarsa bo'lmaydimi?»", "0 — yashirin buzilish (bepul buyurtma); xato darhol ko'rinadi va keyingi qadamni to'xtatadi."],
  ["«toThrow() va toThrow('…') farqi?»", "biri «xato bo'ldimi», ikkinchisi «qaysi xato»."],
  ['«as any yomon emasmi?»', 'kodda — ha; testda ataylab noto\'g\'ri tur berish uchun — joiz.'],
  ['«Hamma funksiyaga guard kerakmi?»', "foydalanuvchidan yoki tashqaridan ma'lumot oladigan funksiyaga — ha."],
];
const S22 = mkS(22, [{ hl: [] }, { hl: [0, 1, 2] }, { hl: [3, 4, 5] }, { hl: [], qa: true }]);
function Screen22(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S22} scene={({ seg }) => <>
    <div className="mk-qa">
      {STUMBLE22.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Javobni aytmang — <b>xabarni o'quvchi bilan birga o'qing</b>: har xabar boshqa sababni aytadi.</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA22.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}
