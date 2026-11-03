// ============================================================
//  20 · CD: Delivery va Deployment
// ============================================================
const S20 = mkS(20, [{ v: 'ci' }, { v: 'del' }, { v: 'dep' }, { v: 'both', sum: true }]);
function Screen20(p) {
  return <Lesson p={p} S={S20} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Lenta st={{ install: 'ok', test: 'ok', lint: 'off', build: 'ok', deploy: seg.sum ? 'off' : undefined }} hl={seg.v === 'ci' ? ['install', 'test', 'build'] : ['deploy']} />
    {seg.v !== 'ci' && <div className="pg-two">
      <div className={`mk-box${seg.v === 'del' || seg.v === 'both' ? ' hl' : ''}`} style={{ '--c': T.blue }}><h4>Continuous Delivery</h4><p>tayyor — chiqarishni mas'ul odam tasdiqlaydi</p></div>
      <div className={`mk-box${seg.v === 'dep' || seg.v === 'both' ? ' hl' : ''}`} style={{ '--c': T.green }}><h4>Continuous Deployment</h4><p>hammasi yashil bo'lsa — o'zi chiqaradi</p></div>
    </div>}
    {(seg.v === 'dep' || seg.sum) && <div className="n2-warn">Chiqarish uchun parol va kalitlar — <b>ci.yml'da emas</b>, GitHub Secrets'da (o'quvchi kartochkasi «Secret»).</div>}
    {seg.sum && <div className="mk-rule">Bugungi lenta <b>build'da tugaydi</b>. Haqiqiy chiqarish — o'quvchilarning loyiha kunlarida (m4c-04, m4c-07).</div>}
  </div>} />;
}

// ============================================================
//  21 · Tekshiruv 4 — qaysi rejim
// ============================================================
function Screen21(p) {
  const m = MDT[21];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Delivery: lenta tekshiradi → xodim tasdiqlaydi → chiqadi</div>
      <Lenta only={['install', 'test', 'build', 'deploy']} st={{ install: 'ok', test: 'ok', build: 'ok' }} hl={['deploy']} />
    </div>} />;
}

// ============================================================
//  22 · m4c-01 xaritasi (CiCdIntroLesson.jsx — SCREEN_META 21)
// ============================================================
const MAP22 = [
  { t: 'Kirish', s: 's0–s1', d: "qo'lda uchirish · reja", m: 'lenta = terminal buyruqlari (2-ekran)' },
  { t: 'Tushuncha', s: 's2–s8', d: 'muammo · lenta · test · CI · CD · nuqtalar va buyruqlar · test', m: 'chiqish kodi (4-ekran)' },
  { t: "O'yin", s: 's9–s11', d: "lenta o'yini (qizil nuqtada to'xtaydi) · test · nega", m: '&& zanjiri (8-ekran)' },
  { t: 'ci.yml', s: 's12–s14', d: "ikki holat · ci.yml bo'shliqlari (on · runs-on · run) · test", m: 'checkout (11-ekran) · npm install (13-ekran)' },
  { t: 'Yakun', s: 's15–s16', d: "lentani yig'ish · amaliyot (o'z repoga ci.yml) · kartochkalar · uyga vazifa (test)", m: "Actions'da qizil va yashil (19-ekran)" },
];
const S22 = mkS(22, [{ hl: [] }, { hl: [3, 4], warn: true }, { hl: [2] }, { hl: [4], sum: true }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP22.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.warn && <div className="n2-warn">Amaliyotdagi <code>ci.yml</code>da <b>checkout yo'q</b> — birinchi qadam qilib <code>- uses: actions/checkout@v7</code> qo'shtiring; o'rnatish — <code>npm install</code>.</div>}
    {seg.sum && <div className="mk-rule">Vaqt (taklif): 90 daqiqaning <b>30 tasi</b> — amaliyotga. Har o'quvchi Actions'da <b>bitta yashil</b> lentani ko'rsin.</div>}
  </div>} />;
}

// ============================================================
//  23 · O'quvchi darsidagi so'zlar va sinfdagi holatlar
// ============================================================
const STUMBLE23 = [
  ["Lenta yo'q", 'Actions bo\'sh', '.github/workflows nomi'],
  ["Checkout yo'q", 'Could not read package.json', 'actions/checkout'],
  ['npm ci', 'in sync', 'npm install'],
  ["Test yo'q", 'No tests found', 'bitta test'],
  ['Lint', '46 error', 'lentadan olib turish'],
  ['YAML', 'qator raqami', 'surilish'],
];
const QA23 = [
  ['«Lenta pulli emasmi?»', "GitHub hujjatida (01.11.2026): ochiq repoda standart mashina bepul; yopiq repoda tarifdagi bepul ulushdan sarflanadi, oshsa — pullik."],
  ['«Kompyuterim o\'chiq bo\'lsa ham ishlaydimi?»', 'ha — lenta GitHub mashinasida yuradi.'],
  ['«Qizil lenta — yomonmi?»', "yo'q — xato foydalanuvchidan oldin ushlandi."],
  ['«.env lentada bormi?»', "yo'q — maxfiy qiymatlar GitHub Secrets'da."],
];
const S23 = mkS(23, [{ v: 'til' }, { hl: [1, 2, 3] }, { hl: [0, 4, 5] }, { hl: [], qa: true }]);
function Screen23(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {seg.v === 'til' ? <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">O'quvchi darsidagi so'z → uning atamasi</div>
      <Lenta />
      <div className="mk-tag" style={{ margin: '10px 0 0' }}>chamadon = kod · yo'l xaritasi = ci.yml · lenta mashinasi = runner</div>
    </div> : <div className="mk-qa">
      {STUMBLE23.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>}
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Javobni aytmang — <b>lenta logini o'quvchi bilan birga o'qing</b>: avval qaysi qadam qizil, keyin xabar.</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA23.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}
