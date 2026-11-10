// ============================================================
//  Kod va chiqishlar — maydon-jamoa m13-dars-03-done (6a1ed16) aynan; chiqishlar wh-out / wh-amal-out dan
//  (TOLOV_KALITI qiymati hech qayerda ko'rsatilmaydi)
// ============================================================
const tsN = (arr, start, meta = {}) => arr.map((l, i) => ({ h: tsLine(l), n: start + i, ...(meta[i + 1] || {}) }));
// backend/src/tolov/imzo.ts — to'liq (16 satr)
const IMZO_TS = tsN([
  "import { createHmac, timingSafeEqual } from 'node:crypto';",
  '',
  "// To'lov xabarining imzosi: HMAC SHA-256 (tana, TOLOV_KALITI), hex — 64 belgi.",
  "// Kalit faqat backend/.env va Render'da (TOLOV_KALITI); kodga, logga va README'ga yozilmaydi.",
  'export function imzola(tana: string | Buffer, kalit: string): string {',
  "  return createHmac('sha256', kalit).update(tana).digest('hex');",
  '}',
  '',
  "// Imzo mos keldimi. Kalit bo'sh bo'lsa — hech bir xabar qabul qilinmaydi.",
  "// Avval shakli (64 belgili hex) tekshiriladi: timingSafeEqual uzunligi har xil buferda xato tashlaydi.",
  'export function imzoTogrimi(xomTana: Buffer | undefined, imzo: unknown): boolean {',
  '  const kalit = process.env.TOLOV_KALITI;',
  "  if (!kalit || !xomTana || typeof imzo !== 'string' || !/^[0-9a-f]{64}$/i.test(imzo)) return false;",
  "  const kutilgan = Buffer.from(imzola(xomTana, kalit), 'hex');",
  "  return timingSafeEqual(Buffer.from(imzo, 'hex'), kutilgan);",
  '}',
], 1, { 5: { id: 'h' }, 6: { id: 'h' }, 7: { id: 'h' }, 12: { id: 'k' }, 13: { id: 'k' }, 14: { id: 's' }, 15: { id: 's' } });
// backend/src/main.ts 8–9
const MAIN_TS = tsN([
  "  // rawBody — to'lov xabarining imzosi (13-Modul 3-dars) so'rovning xom tanasidan hisoblanadi: req.rawBody (Buffer)",
  '  const app = await NestFactory.create(AppModule, { rawBody: true });',
], 8, { 2: { id: 'r' } });
// README «To'lov» → «Reja: to'lov oqimi» (aynan)
const REJA2 = [
  ['Ilova', "«To'lovga o'tish» bosilganda to'lov sahifasini ochadi", 'Brauzer'],
  ['Tashkilotchi', "to'lov sahifasida to'laydi yoki rad etadi; karta ma'lumoti faqat xizmatda", "To'lov xizmati"],
  ["To'lov xizmati", "to'lov xabarini yuboradi: POST /tolov/webhook", 'Backend'],
  ['Backend', "imzoni tekshiradi, to'lovni bir marta yozadi, Pro muddatini uzaytiradi, 200 qaytaradi", "To'lov xizmati"],
];
// «Mashq to'lov» sahifasi — maket (matnlar repo HTML'idan aynan), javob satrlari — brauzerda bosilgan haqiqiy natija
const PAY_LI = {
  tolash: "To'lash (mashq) · m-1793494311872 — 200 {\"ok\":true}",
  rad: "Rad etish (mashq) · m-1793494313096 — 200 {\"ok\":true}",
  ikki1: "Ikki marta yuborish · m-1793494315387 — 200 {\"ok\":true}",
  ikki2: "Ikki marta yuborish · m-1793494315387 — 200 {\"takror\":true}",
  imzosiz: 'Imzosiz yuborish · m-1793494316611 — 401 {"message":"Imzo mos emas","error":"Unauthorized","statusCode":401}',
};
function PayPage({ on = [], li = [] }) {
  const T4 = [['tolash', "To'lash (mashq)"], ['rad', 'Rad etish (mashq)'], ['ikki', 'Ikki marta yuborish'], ['imzosiz', 'Imzosiz yuborish']];
  return <div className="wh-pay">
    <div className="url"><span>localhost:3000/tolov-mashq?oyinchi=11&amp;summa=10000</span><span className="warn">⚠ oyna maket · matn va javoblar haqiqiy</span></div>
    <div className="in">
      <h3>Mashq to'lov</h3>
      <p className="test">Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.</p>
      <p className="nima"><b>Maydon Jamoa</b> — Pro, 30 kun · 10 000 so'm</p>
      <div className="tg">{T4.map(([k, t]) => <span key={k} className={on.includes(k) ? 'on' : ''}>{t}</span>)}</div>
      {li.length > 0 && <ul>{li.map((k) => <li key={k} className={/401/.test(PAY_LI[k]) ? 'er' : ''}>{PAY_LI[k]}</li>)}</ul>}
    </div>
  </div>;
}
const TOLOVLAR3 = tm(String.raw`
$ psql -c "SELECT tolov_raqami, holat FROM tolovlar;"
  tolov_raqami   |  holat
-----------------+---------
 m-1793494311872 | tolandi
 m-1793494313096 | rad`, { 4: { id: 't' }, 5: { id: 'r' } });
const OUT07 = tm(String.raw`
# tana: {"tolovRaqami":"soxta-1","holat":"tolandi","summa":10000,"oyinchiId":11}
$ curl … (X-Imzo yo'q)
{"message":"Imzo mos emas","error":"Unauthorized","statusCode":401} [HTTP 401]
$ curl … -H "X-Imzo: abc"
{"message":"Imzo mos emas","error":"Unauthorized","statusCode":401} [HTTP 401]
$ curl … -H "X-Imzo: <boshqa kalit bilan imzo>"
{"message":"Imzo mos emas","error":"Unauthorized","statusCode":401} [HTTP 401]
$ curl … -H "X-Imzo: <to'g'ri kalit, summa 10000 bilan imzo>" -d '{…"summa":1…}'   # summa o'zgartirildi
{"message":"Imzo mos emas","error":"Unauthorized","statusCode":401} [HTTP 401]
$ psql: soxta-1 yozildimi?   → count 0`, { 2: { id: 'a' }, 3: { id: 'a' }, 4: { id: 'a' }, 5: { id: 'a' }, 6: { id: 'b' }, 7: { id: 'b' }, 8: { id: 'c' }, 9: { id: 'c' }, 10: { id: 'z' } });
const OUT08 = tm(String.raw`
# imzo shu matndan:  {"tolovRaqami":"m-xom-1","holat":"tolandi","summa":10000,"oyinchiId":11}
# yuborilgan matn:   { "tolovRaqami": "m-xom-1", "holat": "tolandi", "summa": 10000, "oyinchiId": 11 }
{"message":"Imzo mos emas","error":"Unauthorized","statusCode":401} [HTTP 401]
# xuddi o'sha matn yuborildi:
{"ok":true} [HTTP 200]`, { 3: { id: 'x' }, 5: { id: 'ok' } });
const OUT12 = tm(String.raw`
# src/main.ts: NestFactory.create(AppModule) — rawBody yo'q
$ … tolov-mashq/yubor {"tur":"tolash"}     # haqiqiy «To'lash»
{"tolovRaqami":"m-1793494250782","javoblar":[{"holat":401,"tana":{"message":"Imzo mos emas",…}}]}`, { 3: { id: 'x' } });
// wh-amal-out/05 — rawBody qaytarildi
const OUT12_OK = tm(String.raw`
# src/main.ts qaytarildi:  NestFactory.create(AppModule, { rawBody: true })
To'lash (mashq) · m-1793494329491 — 200 {"ok":true}`, { 2: { id: 'ok' } });

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ["To'lov xabari", 'Imzo', 'Takror, rad va kalit', "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [], res: true }, { hl: [0, 1] }, { hl: [2] }, { hl: [3] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    {seg.res && <><div className="mk-tag" style={{ margin: 0 }}>Dars oxirida — har javobning sababini bilasiz</div>
    <PayPage on={[]} li={['tolash', 'ikki1', 'ikki2', 'imzosiz']} /></>}
  </div>} />;
}

// ============================================================
//  2 · Kim kimga yuboradi (README «Reja: to'lov oqimi»)
// ============================================================
const S2 = mkS(2, [{ hl: [0, 1, 2, 3] }, { hl: [0, 1] }, { hl: [2], tana: true }, { hl: [2], tana: true, sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="mk-light" style={{ padding: 12 }}>
      <div className="mk-tag">README.md · ### Reja: to'lov oqimi</div>
      <table className="mk-tbl" style={{ fontSize: 13.5 }}><thead><tr><th style={{ textAlign: 'left' }}>Kim</th><th style={{ textAlign: 'left' }}>Nima qiladi</th><th style={{ textAlign: 'left' }}>Kimga</th></tr></thead>
        <tbody>{REJA2.map((r, i) => <tr key={i} style={{ opacity: seg.hl.includes(i) ? 1 : 0.4, background: seg.hl.length < 4 && seg.hl.includes(i) ? '#FFF7F3' : 'transparent' }}><td><b>{r[0]}</b></td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody></table>
    </div>
    {seg.tana && <div className="mk-card"><h5>POST /tolov/webhook · tana</h5><div style={{ fontFamily: MONO, fontSize: 14 }}>{"{ tolovRaqami, holat: 'tolandi' | 'rad', summa, oyinchiId }"}</div><div style={{ fontSize: 13, color: T.ink2, marginTop: 4 }}>sarlavha X-Imzo — 5-ekran</div></div>}
    {seg.sum && <div className="mk-rule">«To'landi» — faqat xizmat xabaridan; ilovaning gapi <b>dalil emas</b>.</div>}
  </div>} />;
}

// ============================================================
//  3 · Mashq to'lov: to'rt tugma (wh-out/01; wh-amal-out/02)
// ============================================================
const S3 = mkS(3, [{ on: [], li: [] }, { on: ['tolash', 'rad', 'ikki', 'imzosiz'], li: [] }, { on: ['tolash'], li: [] }, { on: ['tolash'], li: ['tolash'], db: true, sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <PayPage on={seg.on} li={seg.li} />
    {seg.on.length === 1 && !seg.db && <div className="mk-card"><h5>Tugma bosilganda</h5><div style={{ fontSize: 14, lineHeight: 1.55 }}>sahifa → <code>POST /tolov-mashq/yubor</code> → Backend xabarni yasaydi va <b>imzolaydi</b> → o'zining <code>POST /tolov/webhook</code> iga haqiqiy so'rov. Kalit brauzerga chiqmaydi.</div></div>}
    {seg.db && <Term lines={TOLOVLAR3.slice(0, 4)} focus={['t']} title="psql — maydon_jamoa (haqiqiy)" />}
  </div>} />;
}

// ============================================================
//  4 · Tekshiruv 1
// ============================================================
function Screen4(p) {
  const m = MDT[4];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>README · Reja: to'lov oqimi</div>
      <div className="mk-card"><div style={{ fontSize: 14 }}><b>To'lov xizmati</b> → to'lov xabarini yuboradi: POST /tolov/webhook → <b>Backend</b></div></div>
    </div>} />;
}

// ============================================================
//  5 · Imzo: tana + kalit (backend/src/tolov/imzo.ts)
// ============================================================
const S5 = mkS(5, [{ f: [] }, { f: ['h'] }, { f: ['s'] }, { f: ['k'], sum: true }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={REPO_FILES} active={RF.imzo}><CodePanel file={RF.imzo} wrap lines={IMZO_TS} focus={seg.sum ? [] : seg.f} style={{ fontSize: 12.5 }} /></Ide></div>
    {seg.sum && <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.blue }}><h4>tana + kalit → HMAC</h4><p>64 belgili hex — X-Imzo sarlavhasida</p></div>
      <div className="mk-box" style={{ '--c': T.accent }}><h4>kalit bo'sh</h4><p>hech bir xabar qabul qilinmaydi (401)</p></div>
    </div>}
  </div>} />;
}

// ============================================================
//  6 · Soxta xabarlar — 401 (wh-out/07)
// ============================================================
const S6 = mkS(6, [{ f: ['a'] }, { f: ['b'] }, { f: ['c'] }, { f: ['z'], sum: true }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Term er lines={OUT07} focus={seg.f} title="terminal — haqiqiy Backend, soxta xabarlar" />
    {seg.sum && <div className="mk-rule">To'rtala soxta xabar <b>401</b>; jadvalga bitta ham qator yozilmadi.</div>}
  </div>} />;
}

// ============================================================
//  7 · Xom tana va rawBody (wh-out/08, 12; main.ts 8–9)
// ============================================================
const S7 = mkS(7, [{ v: 'xom' }, { v: 'main' }, { v: 'yoq' }, { v: 'yoq', sum: true }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'xom' && <Term lines={OUT08} focus={['x', 'ok']} title="terminal — xom tana (haqiqiy)" />}
    {seg.v !== 'xom' && <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={REPO_FILES} active={RF.main}><CodePanel file={RF.main} wrap lines={MAIN_TS} focus={seg.v === 'main' ? ['r'] : []} /></Ide></div>}
    {seg.v === 'yoq' && <Term er lines={OUT12} focus={seg.sum ? [] : ['x']} title="rawBody olib tashlandi (haqiqiy)" />}
    {seg.sum && <Term lines={OUT12_OK} focus={['ok']} title="rawBody qaytarildi (haqiqiy)" />}
    {seg.sum && <div className="mk-rule">«Hamma xabar 401» — avval <b>kalit</b>, keyin <b>rawBody</b>.</div>}
  </div>} />;
}

// ============================================================
//  8 · Tekshiruv 2 — LineCheck (wh-out/13: imzo tekshiruvi yozuvdan keyin)
// ============================================================
const LC8_SRC = [
  'async webhook(sorov, imzo) {',
  '  const tana = (sorov.body ?? {}) as Record<string, unknown>;',
  '  // … maydonlar tekshiruvi (400)',
  '  if (await this.tolovlar.existsBy({ tolov_raqami: tolovRaqami })) return { takror: true };',
  '  await this.tolovlar.insert({ tolov_raqami: tolovRaqami, oyinchi_id: oyinchiId, summa, holat });',
  '  if (!imzoTogrimi(sorov.rawBody, imzo)) throw new UnauthorizedException("Imzo mos emas");',
  '  return { ok: true };',
  '}',
];
const LC8 = LC8_SRC.map((l) => ({ h: tsLine(l) }));
const LC8_FIXED = [
  { h: tsLine(LC8_SRC[0]), n: 1 },
  { h: tsLine(LC8_SRC[5]), n: 2, neu: true },
  { h: tsLine(LC8_SRC[1]), n: 3 }, { h: tsLine(LC8_SRC[2]), n: 4 }, { h: tsLine(LC8_SRC[3]), n: 5 }, { h: tsLine(LC8_SRC[4]), n: 6 },
  { h: tsLine(LC8_SRC[5]), n: '', gone: true },
  { h: tsLine(LC8_SRC[6]), n: 7 }, { h: tsLine(LC8_SRC[7]), n: 8 },
];
const LC8_OUT = tm(String.raw`
# tartib buzilgan (wh-out/13): «Imzosiz yuborish» → 401, lekin jadvalda yangi qator
  m-1793494254980 | tolandi
# to'g'ri tartib (wh-amal-out/03): «Imzosiz» → 401, jadvalda yozuv yo'q (3 qator qoldi)`, { 2: { id: 'x' } });
function Screen8(p) {
  const m = MDT[8];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={`${RF.ctrl} · qisqartirilgan`} lines={LC8} target={5}
    tree={{ root: 'maydon-jamoa', files: REPO_FILES, active: RF.ctrl }}
    fixed={LC8_FIXED} fixedExtra={[{ file: 'oldin va keyin (haqiqiy)', lines: LC8_OUT }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  9 · Amaliyot 1 — To'lash va Rad etish (wh-amal-out/01–02)
// ============================================================
const P1 = mkS(9, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: 'Repo — maydon-jamoa papkasida', cmds: ['git checkout -f m13-dars-03-done', 'cd backend', 'npm ci'], exp: 'added … packages' },
  { t: 'Kalit va start — natijani .env ga TOLOV_KALITI= qatoriga yozing (hech kimga ko\'rsatmang)', cmds: ['node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"', 'npm run start'], exp: 'Nest application successfully started' },
  { t: "Ro'yxat — bu tegda login bilan", cmds: ['curl -X POST localhost:3000/royxat -H "Content-Type: application/json" -d \'{"ism":"Ali","login":"ali","parol":"parol123"}\''], exp: '{"id":11,"ism":"Ali"}' },
  { t: "Mashq sahifasi — brauzerda; «To'lash (mashq)», keyin «Rad etish (mashq)»", cmds: ['localhost:3000/tolov-mashq?oyinchi=11&summa=10000'], exp: '… — 200 {"ok":true} — ikki satr' },
];
const P1_TROUBLE = [
  ['Ism, login va parolni yozing', "bu tegda ro'yxat login bilan — telefon emas"],
  ['409 «Bu login band»', "ro'yxat bor — id avvalgi javobda; esdan chiqqan bo'lsa boshqa login bilan ro'yxatdan o'ting"],
  ['sahifada 401 … Imzo mos emas', ".env da TOLOV_KALITI bo'sh yoki Backend kalitsiz yoqilgan — kalitni yozib, qayta start (16-ekran)"],
  ['400 … oyinchiId — mavjud hisob', "manzildagi oyinchi= — ro'yxatdagi id emas"],
];
const P1_PROOF = { label: 'Rad etish satri', placeholder: 'sahifadagi satrni nusxalang', check: (v) => /Rad etish.*200/.test(v), wrong: "Sahifada «Rad etish (mashq) · m-…» bilan boshlanadigan satrni butunligicha nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} />; }
