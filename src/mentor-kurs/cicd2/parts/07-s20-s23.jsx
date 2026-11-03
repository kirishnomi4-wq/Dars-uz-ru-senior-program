// ============================================================
//  20 · Tekshiruv 4 — key'siz cache (cicd2-out/50, 53)
// ============================================================
function Screen20(p) {
  const m = MDT[20];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    above={<div style={{ marginBottom: 14 }}><CodePanel file="ci.yml — o'quvchi darsi (s14)" lines={YML_CACHE_BAD} /></div>}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: run #{RUNS['50'].n} qizil · to'g'risi — setup-node cache: npm (run #{RUNS['53'].n}: npm install 16 s)</div>
      <RunView k="50" open={3} lines={LOG_CACHE_BAD} hlStep={3} />
    </div>} />;
}

// ============================================================
//  21 · m4c-03 xaritasi (GithubActionsLesson.jsx — SCREEN_META 23)
// ============================================================
const MAP21 = [
  { t: 'Kirish', s: 's0–s1', d: 'chamadon lentada, skaner yurmadi · reja', m: "Actions oynasi, run ro'yxati (2-ekran)" },
  { t: 'Joylashuv va YAML', s: 's2–s7', d: "Actions nima · .github/workflows/ci.yml · YAML bo'sh joy · workflow → job → step · 2 test", m: "workflows — s harfisiz run yo'q (14) · qadamsiz qizil — fayl xatosi (13)" },
  { t: 'on, runs-on, amallar', s: 's8–s12', d: "on: · runs-on · test · uses / run · tartib (@v4)", m: 'my-laptop — cheksiz kutadi (14) · uses logi (4) · tartib xato — kod 127 (10)' },
  { t: "Qo'shimchalar", s: 's13–s16', d: 'matrix · cache · test · secrets', m: 'matrix ulanmagan (16) · cache key\'siz qizil (17) · secret bo\'laklab ochiq (18)' },
  { t: 'Markaziy va yakun', s: 's17–s19', d: "yo'l xaritasini yozish · yakuniy (1 urinish) · amaliyot · kartochkalar · uyga vazifa", m: 'simulyatsiya va haqiqat (22-ekran)' },
];
const S21 = mkS(21, [{ hl: [] }, { hl: [2], v4: true }, { hl: [3] }, { hl: [4], sum: true }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP21.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{(seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.v4 && <div className="n2-warn" style={{ animation: 'mk-up .4s ease both' }}>Run #{RUNS['25'].n} (@v4): yashil, lekin izohda — <b>«Node.js 20 is deprecated … forced to run on Node.js 24»</b>. Tavsiya — v7.</div>}
    {seg.sum && <div className="mk-rule">O'quvchi darsi — simulyatsiya, Actions — haqiqat: har o'quvchi faylini <b>push qilsin</b> va run'ni siz bilan birga o'qisin.</div>}
  </div>} />;
}

// ============================================================
//  22 · Simulyatsiya va haqiqiy Actions (cicd2-out/16, 17, 14, 12, 20)
// ============================================================
const LOG16 = lg("/home/runner/work/_temp/da38ae49….sh: line 1: syntax error near unexpected token `'test''\n##[error]Process completed with exit code 2.");
const LOG17 = lg("remote: Write access to repository not granted.\nfatal: unable to access 'https://github.com/kirishnomi4-wq/mentor-ci-sinov/': The requested URL returned error: 403\n##[error]Process completed with exit code 128.");
const SIM22 = [
  { s: "s17: run: print('test')", g: 'syntax error, kod 2 — qizil', k: '16', c: 'bad' },
  { s: 's17: run: git push', g: '403, kod 128 — qizil (token: Contents: read)', k: '17', c: 'bad' },
  { s: "s18: test qadami yo'q — «qizil chiroq»", g: 'run yashil — testsiz lenta hech narsani tekshirmaydi', k: '14', c: 'ok' },
  { s: "«Repongiz yo'qmi?»: echo ok && exit 0", g: "test doim yashil; qizil uchun echo xato && exit 1", k: '12', c: 'ink' },
];
const S22 = mkS(22, [{ hl: [0, 1], run: '16', open: 4, lines: LOG16 }, { hl: [1], run: '17', open: 4, lines: LOG17, perm: true }, { hl: [2, 3], run: '14' }, { hl: [], sum: true }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <div style={{ display: 'grid', gap: 10 }}>
    {SIM22.map((x, i) => <div key={i} className={`pg-row${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.4 : 1 }}>
      <span style={{ minWidth: 0, flex: '1 1 45%' }}>{x.s}</span><span style={{ color: T.ink3 }}>→</span>
      <span style={{ flex: '1 1 45%', color: x.c === 'ok' ? T.green : x.c === 'bad' ? T.accent : T.ink, fontWeight: 700 }}>{x.g} <span style={{ color: T.ink3, fontWeight: 500 }}>· #{RUNS[x.k].n}</span></span>
    </div>)}
    {seg.run && <RunView k={seg.run} open={seg.open} lines={seg.lines || []} hlStep={seg.open} />}
    {seg.perm && <div className="pg-row" style={{ animation: 'mk-up .4s ease both' }}><span>Set up job → GITHUB_TOKEN Permissions</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13, color: T.accent }}>Contents: read</span></div>}
    {seg.sum && <div className="mk-rule">Yashil belgi — faqat <b>yozilgan qadamlar o'tdi</b> degani. Lentada <code>npm test</code> albatta bo'lsin.</div>}
  </div>} />;
}

// ============================================================
//  23 · O'quvchi darsidagi so'zlar va sinfdagi holatlar
// ============================================================
const TIL23 = [['yo\'l xaritasi', '.github/workflows/ci.yml'], ['nuqta · amal', 'job · qadam (step)'], ['lenta mashinasi', 'runs-on · Set up job logi'], ['START SIGNALI', "on: push — run qatorida «push»"], ['YASHIL / QIZIL CHIROQ', 'run belgisi ✓ / ✗'], ['PARALLEL LENTALAR · YAQIN JAVON · SEYF', 'matrix · cache · secrets']];
const STUMBLE23 = [
  ["Run yo'q", "Actions bo'sh", '.github/workflows nomi'],
  ['Sariq, kutmoqda', 'queued', 'runs-on: ubuntu-latest'],
  ['Qadamsiz qizil', "job yo'q", "fayl xatosi — surilish, «: »"],
  ['Kod 127', 'jest: not found', 'npm install oldinroq'],
  ['Kod 254', 'Could not read package.json', 'actions/checkout'],
  ['Kod 1, npm ci', "in sync / lock yo'q", 'npm install'],
];
const QA23 = [
  ['«Run qancha vaqt oladi?»', "o'quvchi reposida taxminan 45 s – 1 daq 10 s; eng uzuni — o'rnatish (run #1–#7)."],
  ['«Nega lenta git push qilolmaydi?»', "token faqat o'qishga ruxsat oladi — Set up job logida Contents: read."],
  ['«Ubuntu versiyasi nega boshqacha?»', "ubuntu-latest Ubuntu 26 ga o'tkazilmoqda — GitHub har run'da eslatadi."],
  ["«Secret'ni ko'rsam bo'ladimi?»", "logda yo'q; qiymatni faqat qo'ygan odam biladi. Logga chiqarmang — bo'laklab chiqarilsa ochiq ko'rinadi."],
];
const S23 = mkS(23, [{ v: 'til' }, { hl: [0, 1, 2] }, { hl: [3, 4, 5] }, { hl: [], qa: true }]);
function Screen23(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {seg.v === 'til' ? <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">O'quvchi darsidagi so'z (m4c-03) → Actions oynasida</div>
      <div style={{ display: 'grid', gap: 6 }}>{TIL23.map(([a, b], i) => <div key={i} className="pg-row" style={{ animation: `mk-up .4s ${i * 0.06}s ease both` }}><span style={{ fontFamily: SANS, fontWeight: 700 }}>{a}</span><span style={{ color: T.ink3 }}>→</span><span className="v" style={{ fontSize: 13, fontWeight: 600 }}>{b}</span></div>)}</div>
    </div> : <div className="mk-qa">
      {STUMBLE23.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>}
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Javobni aytmang — <b>o'quvchi bilan birga o'qing</b>: qaysi qadam qizil, qaysi kod, logdagi birinchi error satri.</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA23.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}
