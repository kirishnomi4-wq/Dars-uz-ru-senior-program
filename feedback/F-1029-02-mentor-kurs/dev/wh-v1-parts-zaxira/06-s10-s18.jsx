// ============================================================
//  Chiqishlar va kod: takror (wh-out/03, 10), kalit (wh-out/11), rawBody (wh-amal-out/04–05)
// ============================================================
const CTRL_TAKROR = tsN([
  '    if (await this.tolovlar.existsBy({ tolov_raqami: tolovRaqami })) return { takror: true };',
  '    try {',
  '      await this.tolovlar.insert({ tolov_raqami: tolovRaqami, oyinchi_id: oyinchiId, summa, holat });',
  '    } catch (e) {',
  "      // Ikki bir xil xabar bir vaqtda keldi: ikkinchisini jadvaldagi noyoblik to'xtatdi — u ham takror (500 emas)",
  "      if ((e as { code?: string }).code === '23505') return { takror: true };",
  '      throw e;',
  '    }',
], 51, { 1: { id: 't' }, 5: { id: 'u' }, 6: { id: 'u' } });
const OUT10 = tm(String.raw`
# ikki curl bir vaqtda: {"tolovRaqami":"m-bir-vaqtda","holat":"tolandi","summa":10000,"oyinchiId":11}
{"ok":true} [HTTP 200]
{"takror":true} [HTTP 200]
$ psql: m-bir-vaqtda qatorlari → count 1
# PostgreSQL logi (ikkinchisi tekshiruvdan o'tib ketgan, uni noyob ustun to'xtatgan):
ERROR:  duplicate key value violates unique constraint "UQ_8d49ab7ce320a778ace3fb848bd"
DETAIL:  Key (tolov_raqami)=(m-bir-vaqtda) already exists.`, { 2: { id: 'a' }, 3: { id: 'b' }, 4: { id: 'b' }, 5: { id: 'c' }, 7: { id: 'c' }, 8: { id: 'c' } });
const ENVX = tm(String.raw`
# backend/.env.example — to'lov qismi (aynan)
# To'lov xabarining maxfiy kaliti (13-Modul 3-dars): «Mashq to'lov» sahifasi xabarni shu kalit bilan imzolaydi (HMAC SHA-256),
# POST /tolov/webhook imzoni shu kalit bilan tekshiradi. Bo'sh bo'lsa — hech bir to'lov xabari qabul qilinmaydi (401).
# Qiymat repo'ga, agentga va chatga yozilmaydi: .env ga va Render'ga o'zingiz qo'yasiz. Laptop uchun ham tasodifiy kalit:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
TOLOV_KALITI=`, { 5: { id: 'q' }, 6: { id: 'k' } });
const OUT11 = tm(String.raw`
# TOLOV_KALITI= (bo'sh) bilan Backend — haqiqiy «To'lash»
{"tolovRaqami":"m-1793494246616","javoblar":[{"holat":401,"tana":{"message":"Imzo mos emas",…}}]}`, { 2: { id: 'x' } });
const OUT11_OK = tm(String.raw`
# .env da TOLOV_KALITI yozilgach (wh-amal-out/02):
To'lash (mashq) · m-1793494311872 — 200 {"ok":true}`, { 2: { id: 'ok' } });

// ============================================================
//  10 · Takror xabar
// ============================================================
const S10 = mkS(10, [{ v: 'pay', li: [] }, { v: 'pay', li: ['ikki1', 'ikki2'] }, { v: 'run' }, { v: 'code', sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'pay' && <PayPage on={['ikki']} li={seg.li} />}
    {seg.v === 'run' && <Term lines={OUT10} focus={['a', 'b', 'c']} title="terminal — bir vaqtda ikki xabar (haqiqiy)" />}
    {seg.v === 'code' && <div className="j2-wide-only"><Ide files={REPO_FILES} active={RF.ctrl}><CodePanel file={RF.ctrl} wrap lines={CTRL_TAKROR} focus={[]} style={{ fontSize: 12.5 }} /></Ide></div>}
    {seg.sum && <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.blue }}><h4>1 · oldindan tekshiruv</h4><p>shu to'lov raqami bormi → 200 {'{ takror: true }'}</p></div>
      <div className="mk-box" style={{ '--c': T.green }}><h4>2 · noyob ustun</h4><p>tolov_raqami unique → 23505 → ham takror</p></div>
    </div>}
  </div>} />;
}

// ============================================================
//  11 · Rad etilgan to'lov (wh-amal-out/02; README «Hozir ishlaydi»)
// ============================================================
const S11 = mkS(11, [{ li: ['rad'] }, { li: ['rad'], db: true }, { li: [], readme: true }, { li: [], readme: true, sum: true }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.li.length > 0 && <PayPage on={['rad']} li={seg.li} />}
    {seg.db && <Term lines={TOLOVLAR3} focus={['r']} title="psql — maydon_jamoa (haqiqiy)" />}
    {seg.readme && <div className="mk-card" style={{ borderColor: T.accent }}><h5>README · To'lov</h5><div style={{ fontSize: 14.5, lineHeight: 1.55 }}>«Hozir ishlaydi: to'lov xabari <code>POST /tolov/webhook</code> da qabul qilinadi va <code>tolovlar</code> ga yoziladi; <b>Pro va ilova hali o'zgarmaydi</b>. Test rejim: pul yechilmaydi.»</div></div>}
    {seg.sum && <div className="mk-rule">Rad — <b>yoziladigan natija</b>; bugungi qurilgan qism — qabul va yozuv.</div>}
  </div>} />;
}

// ============================================================
//  12 · Tekshiruv 3
// ============================================================
function Screen12(p) {
  const m = MDT[12];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: «Ikki marta yuborish»</div>
      <PayPage on={['ikki']} li={['ikki1', 'ikki2']} />
    </div>} />;
}

// ============================================================
//  13 · Amaliyot 2 — Ikki marta va Imzosiz (wh-amal-out/03)
// ============================================================
const P2 = mkS(13, [{ hl: [] }, { hl: [0, 1] }, { hl: [] }], { tableAt: 2 });
const P2_STEPS = [
  { t: "Ikki marta — mashq sahifasida «Ikki marta yuborish»", cmds: [], exp: '… — 200 {"ok":true} va … — 200 {"takror":true} (bir xil m- raqam)' },
  { t: "Imzosiz — «Imzosiz yuborish»", cmds: [], exp: '… — 401 {"message":"Imzo mos emas",…}' },
];
const P2_TROUBLE = [
  ['Ikkinchisi ham ok', "ikki xil m- raqam bilan bosilgan — «Ikki marta yuborish» tugmasini bosing, «To'lash» ni ikki marta emas"],
  ['Imzosiz 200', 'Backend eski kod bilan — git log --oneline -1 da 6a1ed16 bo\'lsin'],
];
const P2_PROOF = { label: 'Ikki marta yuborishning ikkinchi satri', placeholder: 'sahifadagi satrni nusxalang', check: (v) => /takror/.test(v), wrong: "«Ikki marta yuborish · m-…» bilan boshlanadigan ikkinchi satrni nusxalang" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }

// ============================================================
//  14 · Kalit: faqat .env va Render'da (.env.example; wh-out/11)
// ============================================================
const S14 = mkS(14, [{ v: 'env', f: ['k'] }, { v: 'env', f: ['q'] }, { v: 'bosh' }, { v: 'git', sum: true }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'env' && <Term lines={ENVX} focus={seg.f} title={RF.envx} />}
    {seg.v === 'bosh' && <Term er lines={OUT11} focus={['x']} title="terminal — kalitsiz Backend (haqiqiy)" />}
    {seg.v === 'bosh' && <Term lines={OUT11_OK} focus={['ok']} title="kalit bilan (haqiqiy)" />}
    {seg.v === 'git' && <div className="mk-card"><h5>O'quvchi darsi · A1, 1-qadam</h5><div style={{ fontSize: 14, lineHeight: 1.6 }}>Terminalda <code>git status</code>: <code>.env</code> fayllari ro'yxatda ko'rinmasin.<br />Keyin <code>git ls-files backend/.env</code> — natija <b>bo'sh</b> bo'lishi kerak; fayl nomi chiqsa — kalitlar almashtiriladi.</div></div>}
    {seg.sum && <div className="mk-rule">Kalit chiqib qolsa — <b>yangisi</b> qo'yiladi (<code>.env</code> va Render), eskisi ishlatilmaydi.</div>}
  </div>} />;
}

// ============================================================
//  15 · Amaliyot 3 — rawBody ni buzamiz (wh-amal-out/04–05)
// ============================================================
const P3 = mkS(15, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: "Buzish — src/main.ts: NestFactory.create(AppModule, { rawBody: true }) → NestFactory.create(AppModule); Backend'da Ctrl+C, keyin", cmds: ['npm run start'], exp: 'Nest application successfully started' },
  { t: "To'lash — sahifada «To'lash (mashq)»", cmds: [], exp: '… — 401 {"message":"Imzo mos emas",…}' },
  { t: "Qaytarish — { rawBody: true } ni qaytaring; Ctrl+C, keyin", cmds: ['npm run start'], exp: 'start ✓' },
  { t: "Tekshirish — «To'lash (mashq)»", cmds: [], exp: '… — 200 {"ok":true}' },
];
const P3_TROUBLE = [
  ['2-qadamda ham 200', 'Backend qayta yoqilmagan — Ctrl+C va qayta npm run start'],
  ['4-qadamda ham 401', 'rawBody: true to\'liq qaytmagan — git diff src/main.ts bo\'sh bo\'lsin'],
];
const P3_PROOF = { label: '2-qadamdagi satr', placeholder: 'sahifadagi satrni nusxalang', check: (v) => /401/.test(v), wrong: "«To'lash (mashq) · m-… — 401» satrini nusxalang" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }

// ============================================================
//  16 · Tekshiruv 4
// ============================================================
function Screen16(p) {
  const m = MDT[16];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija va kod</div>
      <Term er lines={OUT11} focus={['x']} />
      <CodePanel file={RF.imzo} wrap lines={IMZO_TS.slice(11, 13)} focus={['k']} />
    </div>} />;
}

// ============================================================
//  17 · m11-03 xaritasi (PaymentWebhookLesson.jsx — SCREEN_META 20)
// ============================================================
const MAP17 = [
  { t: 'Kirish', s: 's0–s1', d: 'reja · pul chegarasi', m: 'ilovaning gapi dalil emas (4-ekran)' },
  { t: 'Xabar va imzo', s: 's2–s5', d: "to'lov xabari · test · imzo · test", m: 'soxta 401, xom tana (6–7-ekran)' },
  { t: 'Takror', s: 's6–s8', d: 'javob yo\'qoldi · kod oynasi · test', m: 'bir vaqtda ikki xabar (10-ekran)' },
  { t: 'Rad va test rejim', s: 's9–s11', d: 'rad · test · test rejim', m: "Pro hali yo'q (11-ekran)" },
  { t: 'Sxema va amaliyot', s: 's12–s14, A1, A2', d: "to'lov oqimi sxemasi · sinov · o'z Backend'i · mashq sahifa", m: 'kalit, rawBody, Render (14–15-ekran)' },
];
const S17 = mkS(17, [{ hl: [] }, { hl: [2, 4] }, { hl: [0, 3], warn: true }, { hl: [4], sum: true }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP17.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.warn && <div className="n2-warn">Pul chegarasi: darsda hech kim haqiqiy to'lov xizmatiga ro'yxatdan o'tmaydi va karta yozmaydi. «Payme ulasam bo'ladimi?» — real ishga tushirish ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan; <b>AI Startup kursida emas</b> (o'quvchi darsi s1).</div>}
    {seg.sum && <div className="mk-rule">A1 — <b>kalit gigiyenasi</b>, A2 — uch tekshiruv; Render'da mashq sahifa <code>RENDER_EXTERNAL_URL</code> ga yuboradi (biz sinamadik).</div>}
  </div>} />;
}

// ============================================================
//  18 · O'quvchi darsidagi so'zlar va sinfdagi holatlar
// ============================================================
const DICT18 = [["to'lov xabari", 'webhook · POST /tolov/webhook'], ['imzo · kalit', 'HMAC SHA-256 · TOLOV_KALITI'], ['takror xabar', 'tolov_raqami noyob · { takror: true }'], ["test rejim · mashq to'lov", "pul yechilmaydi; xizmat o'rnida Backend sahifasi"]];
const STUMBLE18 = [
  ['Hamma xabar 401', 'Imzo mos emas', "kalit bo'sh"],
  ["Haqiqiy to'lash ham 401", 'Imzo mos emas', "rawBody yo'q"],
  ['401, lekin jadvalda qator', '—', 'imzo yozuvdan keyin'],
  ["Ro'yxat 400", 'Ism, login va parolni yozing', 'login maydoni'],
  ['400 oyinchiId — mavjud hisob', '—', "manzildagi oyinchi= noto'g'ri"],
  [".env Git'da", "git ls-files da fayl nomi", 'kalitlar almashtiriladi'],
];
const QA18 = [
  ["«Payme ulasam bo'ladimi?»", "AI Startup kursida emas: real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan (o'quvchi darsi s1 eslatmasi)."],
  ['«Nega takrorga ham 200?»', 'xato kodi qaytsa, xizmat qayta yuboraveradi.'],
  ['«Nega rad yoziladi?»', "«to'lovim qayerda?» savoliga javob."],
  ["«Kalitni agentga bersam tezroq bo'lardi-ku?»", "kalit kimda bo'lsa, o'sha «to'landi» yasaydi."],
];
const S18 = mkS(18, [{ v: 'til' }, { hl: [0, 1, 2] }, { hl: [3, 4, 5] }, { hl: [], qa: true }]);
function Screen18(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {seg.v === 'til' ? <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">O'quvchi darsidagi so'z → uning atamasi</div>
      <table className="mk-tbl"><tbody>{DICT18.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>
    </div> : <div className="mk-qa">
      {STUMBLE18.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>}
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>401 bo'lsa — shu tartibda: <b>kalit, rawBody, tekshiruv tartibi</b>; qolganida javob matnini birga o'qing.</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA18.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}
