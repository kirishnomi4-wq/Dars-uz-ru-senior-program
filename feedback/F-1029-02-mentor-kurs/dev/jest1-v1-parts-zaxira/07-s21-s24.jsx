
// ============================================================
//  21 · m4b-01 xaritasi
// ============================================================
const MAP21 = [
  { t: 'Kirish', s: 's0–s1', d: 'qo\'lda vs test · reja (4 qadam)', m: '' },
  { t: 'Tushuncha', s: 's2–s4', d: 'funksiya — mashina · Jestbot poygasi (5 hisob qo\'lda vs bitta buyruq) · test', m: "Jest reposida tayyor (3-ekran)" },
  { t: 'Yozish', s: 's5–s11', d: "o'rnatish (npm i -D jest ts-jest) · test fayli (4 qism) · expect · varaqa (yolg'on PASS) · npm test · 2 test", m: 'joy va nom (4, 17-ekran) · haqiqiy PASS chiqishi (6-ekran)' },
  { t: 'Buzish', s: 's12–s15', d: "AAA · FAIL (* → +) · test · AI yolg'on testlari", m: "FAIL o'qish tartibi (8-ekran) · kim xato (9-ekran)" },
  { t: 'Yakun', s: 's16–s17', d: "etalon kartochkasi + noto'g'ri etalon · amaliyot o'z loyihasida · kartochkalar · uyga vazifa deliveryFee", m: 'chegara (13-ekran)' },
];
const S21 = mkS(21, [{ hl: [] }, { hl: [2] }, { hl: [3] }, { hl: [4], sum: true }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP21.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.sum && <div className="mk-rule">Amaliyot oldidan: repo <code>npm install</code> bilan · test <code>src/</code> ichida · nomi <code>.spec.ts</code></div>}
  </div>} />;
}

// ============================================================
//  22 · O'quvchi darsidagi so'zlar
// ============================================================
const DICT22 = [
  ['mashina — kirish → chiqish', 'funksiya'], ['Jestbot — sinovchi robot', 'Jest (npm test)'], ['robot papkasi — qaysi mashina sinaladi', 'describe'],
  ['sinov varaqasi — nima tekshiriladi', 'it'], ['etalon kartochkasi — qanday chiqish kutiladi', 'expect(…).toBe(…)'], ["yolg'on test", "expect'siz yoki noto'g'ri etalon"],
  ['Tayyorlash → Chaqirish → Tekshirish', 'AAA'],
];
const S22 = mkS(22, [{ rows: [] }, { rows: [0, 2, 3, 4] }, { rows: [5, 6] }, { rows: [4], sum: true }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">O'quvchi darsidagi so'z → uning atamasi</div>
    <table className="mk-tbl"><thead><tr><th>o'quvchi darsida</th><th>atama</th></tr></thead><tbody>
      {DICT22.map(([a, b], i) => (seg.sum && !seg.rows.includes(i)) ? null : <tr key={a} className={seg.rows.includes(i) ? 'hl' : ''} style={{ opacity: seg.rows.length && !seg.rows.includes(i) ? 0.55 : 1 }}><td>{a}</td><td><code>{b}</code></td></tr>)}
    </tbody></table>
    {seg.sum && <div style={{ marginTop: 12, display: 'grid', gap: 8 }}><CodePanel file="order.spec.ts" lines={ORDER_SPEC} focus={['exp']} /><div className="mk-rule">«Etalon kartochkasi, <b>ya'ni expect</b>» — va shu satrni ko'rsating. Terminalda so'zlar inglizcha: PASS, FAIL, Expected, Received.</div></div>}
  </div>} />;
}

// ============================================================
//  23 · O'quvchi darsidagi npm i -D jest ts-jest (jest1-out/11)
// ============================================================
const INST23 = jt(String.raw`
--- oldin   jest 30.4.2 · ts-jest 29.4.11
$ npm i -D jest ts-jest
--- keyin   jest 30.5.2 · ts-jest 29.4.15
$ npm test
PASS src/delivery.spec.ts
PASS src/order.spec.ts
Tests:       4 passed, 4 total`, { 1: { id: 'v' }, 3: { id: 'v' } });
const S23 = mkS(23, [{ v: 'card' }, { v: 'run' }, { v: 'run', tip: true }, { v: 'run', tip: true, sum: true }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    <div className="pg-two">
      <div className="mk-card"><h5>O'quvchi darsi · 5-ekran</h5><div style={{ fontSize: 14, lineHeight: 1.6 }}><code>npm i -D jest ts-jest</code> · <code>package.json</code>: <code>"test": "jest"</code></div></div>
      <div className="mk-card" style={{ borderColor: T.green }}><h5 style={{ color: T.green }}>O'quvchi reposida allaqachon</h5><div style={{ fontSize: 14, lineHeight: 1.6 }}>jest 30 · ts-jest 29 · <code>"test": "jest"</code> · <code>jest</code> bo'limi</div></div>
    </div>
    {seg.v === 'run' && <Term lines={INST23} focus={['v']} />}
    {seg.tip && <div className="mk-rule">O'quvchi buyruqni bajaraversin — zarari yo'q. Siz: «Nest loyihasi Jest'ni oldindan qo'ygan, bu buyruq uni yangilaydi».</div>}
    {seg.sum && <div className="n2-warn">Bo'sh loyihada bu ikki qadam <b>yetarli emas</b> — 18-ekrandagi zanjir.</div>}
  </>} />;
}

// ============================================================
//  24 · Sinfdagi holatlar va o'quvchi savollari
// ============================================================
const STUMBLE24 = [
  ['Test topilmadi', 'No tests found', 'src/ ichida, .spec.ts'],
  ["O'rnatish", 'npm ci … in sync', 'npm install'],
  ["Yolg'on yashil", "PASS, lekin expect yo'q", 'har it da expect'],
  ["Qizil, kod to'g'ri", "Expected noto'g'ri", 'etalonni qo\'lda hisoblash'],
  ['Chegara', 'faqat aynan qiymat qizil', 'uch test: yuqori · aynan · past'],
  ["Bo'sh loyiha", "ESM · describe · TypeScript 6/7", "o'quvchi reposida yozish yoki 3 buyruq"],
];
const QA24 = [
  ['«Test kodni tuzatadimi?»', "yo'q, faqat xabar beradi; tuzatish — sizniki."],
  ['«Har funksiyaga test kerakmi?»', "hisob, shart va pul bor joyga — albatta; oddiy uzatuvchi funksiyaga shart emas."],
  ['«toBe va === farqi?»', "toBe ham qat'iy solishtiradi (Object.is), lekin natijani Jest'ga xabar qiladi: PASS yoki FAIL; === faqat true/false."],
  ['«Jest faqat Nest uchunmi?»', "yo'q, istalgan JavaScript/TypeScript loyihasi; Nest'da tayyor sozlangan."],
  ['«AI test yozsa bo\'ladimi?»', "ha, lekin har testga ikki savol: expect bormi, etalon to'g'rimi."],
];
const S24 = mkS(24, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [5], qa: true }]);
function Screen24(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S24} scene={({ seg }) => <>
    <div className="mk-qa">
      {STUMBLE24.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Javobni aytmang — <b>terminaldagi xabarni o'quvchi bilan birga o'qing</b>.</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA24.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}
