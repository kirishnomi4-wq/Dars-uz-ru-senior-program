// ============================================================
//  12 · Tekshiruv 3 — tokensiz ulanishda belgi
// ============================================================
function Screen12(p) {
  const m = MDT[12];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija</div>
      <Term er lines={OUT02} focus={['x']} />
    </div>} />;
}

// ============================================================
//  13 · Amaliyot 2 — holatlarni kuzatish (ws1-amal-out/05, 06)
// ============================================================
const P2 = mkS(13, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P2_STEPS = [
  { t: 'Ulanish — Backend yoniq, klient token bilan', cmds: ['TOKEN=<token> node klient.js'], exp: 'ulangan  (connect)' },
  { t: "To'xtatish — Backend terminalida Ctrl+C", cmds: [], exp: 'ulanmoqda  (disconnect: transport close · active=true), keyin connect_error' },
  { t: 'Yoqish — Backend terminalida', cmds: ['npm run start'], exp: '5 s gacha ichida: ulangan  (connect)' },
  { t: 'Tokensiz — klientni Ctrl+C, keyin', cmds: ['TOKEN= node klient.js'], exp: 'ulangan, darhol ulanmagan  (disconnect: io server disconnect · active=false)' },
];
const P2_TROUBLE = [
  ['3-qadamda bir necha soniya yana connect_error', 'Backend yonguncha va navbatdagi urinishgacha (har 5 s) — kuting (10-ekran)'],
  ['4-qadamda ulanmagan bo\'lmadi, ulangan qoldi', "TOKEN= bo'sh emas — eski token qolgan; buyruqni aynan TOKEN= node klient.js deb yozing"],
];
const P2_PROOF = { label: '2-qadamdagi uzilish sababi', placeholder: "disconnect: dan keyingi so'zlarni yozing", check: (v) => /transport close/i.test(v), wrong: "Ctrl+C dan keyingi birinchi «ulanmoqda» satrida qavs ichidagi sababni yozing" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} code={P1_CODE.map((c) => ({ ...c, step: 0 }))} tree={KLIENT_FILES} />; }

// ============================================================
//  14 · Hodisa — konvertda son yo'q (ws1-out/06; m12-dars-03-done gateway va controller)
// ============================================================
const GW03_TS = tsN([
  'oyinOzgardi(oyinId: number, sabab: OyinSababi) {',
  "  this.server.emit('oyin-ozgardi', { oyinId, sabab });",
  '}',
], 37, { 2: { id: 'e' } });
const CTRL03_TS = tsN([
  "      await this.yoz(jadval, id, men, 'qoshildi', !!qator);",
  "      return { holat: 'qoshildi' };",
  '    });',
  "    // Tranzaksiya tugagach (yozuv Database'da) — hodisa",
  "    this.ulanishlar.oyinOzgardi(id, 'qoshildi');",
], 138, { 1: { id: 'y' }, 4: { id: 'h' }, 5: { id: 'h' } });
const S14 = mkS(14, [{ f: ['a', 'h'], code: 'ctrl' }, { f: ['h'], code: 'gw' }, { f: ['h', 'g'], ph: true }, { f: [], ph: true, sum: true }]);
function Screen14(p) {
  return <Lesson p={p} S={S14} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Term lines={OUT06} focus={seg.f} title="terminal — m12-dars-03-done, haqiqiy" /></div>
    {seg.code === 'ctrl' && <CodePanel file="backend/src/oyinlar.controller.ts · m12-dars-03-done" wrap lines={CTRL03_TS} focus={['h']} />}
    {seg.code === 'gw' && <CodePanel file="backend/src/oyinlar.gateway.ts · m12-dars-03-done" wrap lines={GW03_TS} focus={['e']} />}
    {seg.ph && <div className="ws-phones">
      <Phone who="Ali" rows={[['Maktab maydoni · 07.11 20:00', '7 / 10', 'new']]} note="hodisa → GET /oyinlar" mark="good" />
      <div className="mk-card"><h5>Konvert ichida</h5><div style={{ fontFamily: MONO, fontSize: 14 }}>{'{ "oyinId": 2, "sabab": "qoshildi" }'}</div><div style={{ fontSize: 13.5, color: T.ink2, marginTop: 6 }}>son yo'q — ilova o'zi qayta so'raydi</div></div>
    </div>}
    {seg.sum && <div className="mk-rule">Hodisa «nima o'zgardi» deydi — haqiqiy son Backend'dan <b>qayta olinadi</b>.</div>}
  </div>} />;
}

// ============================================================
//  15 · m12-dars-02 — hodisa hali yo'q (ws1-out/05 va 06; o'quvchi darsi s9 — namuna oyna)
// ============================================================
const S15 = mkS(15, [{ v: 'note' }, { v: 'stud' }, { v: 'two' }, { v: 'two', sum: true }]);
function Screen15(p) {
  return <Lesson p={p} S={S15} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'note' && <Ide files={REPO_FILES} active={RF.gw}><CodePanel file={RF.gw} wrap lines={GW_NOTE} focus={['x']} /></Ide>}
    {seg.v === 'stud' && <div className="mk-card"><h5>O'quvchi darsi m10-02 · 9-ekran (kod oynasi)</h5><div style={{ fontFamily: MONO, fontSize: 14 }}>ulanish.on('oyin-ozgardi', korsat)</div><div style={{ fontSize: 13.5, color: T.ink2, marginTop: 6 }}>namuna oynada: hodisani tugma yuboradi, haqiqiy Backend emas</div></div>}
    {seg.v === 'two' && <div className="pg-two">
      <div style={{ display: 'grid', gap: 6 }}><div className="mk-tag" style={{ margin: 0 }}>m12-dars-02-done — bugungi o'quvchi natijasi</div><Term lines={OUT05.slice(2)} focus={['x']} /></div>
      <div style={{ display: 'grid', gap: 6 }}><div className="mk-tag" style={{ margin: 0 }}>m12-dars-03-done — hodisa bor</div><Term lines={OUT06.slice(2)} focus={['h']} /></div>
    </div>}
    {seg.sum && <div className="mk-rule">Bugungi natija — <b>ulanish va belgi</b>; hodisa — m12-dars-03 tegida.</div>}
  </div>} />;
}

// ============================================================
//  16 · Tekshiruv 4 — hodisa kelgach
// ============================================================
function Screen16(p) {
  const m = MDT[16];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: hodisadan keyin qayta so'raldi</div>
      <Term lines={OUT06} focus={['h', 'g']} />
    </div>} />;
}

// ============================================================
//  17 · Amaliyot 3 — hodisani ko'rish (ws1-amal-out/07–08)
// ============================================================
const P3 = mkS(17, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: 'Teg — Backend terminalida Ctrl+C, keyin (.env joyida qoladi)', cmds: ['git checkout -f m12-dars-03-done', 'npm ci', 'npm run start'], exp: 'Nest application successfully started' },
  { t: "Vali — ikkinchi akkaunt (telefon +998 90 000 00 02)", cmds: ['curl -X POST localhost:3000/royxat -H "Content-Type: application/json" -d \'{"ism":"Vali","telefon":"+998 90 000 00 02","parol":"parol123"}\'', 'curl -X POST localhost:3000/kirish -H "Content-Type: application/json" -d \'{"telefon":"+998 90 000 00 02","parol":"parol123"}\''], exp: 'ikkinchi token' },
  { t: 'Ali — klient Ali tokeni bilan', cmds: ['TOKEN=<Ali tokeni> node klient.js'], exp: 'ulangan  (connect)' },
  { t: "Qo'shilish — Vali 2-o'yinga", cmds: ['curl -X POST localhost:3000/oyinlar/2/qoshilish -H "Authorization: Bearer <Vali tokeni>"'], exp: '{"holat":"qoshildi"} · Ali klientida: HODISA oyin-ozgardi {"oyinId":2,"sabab":"qoshildi"}' },
];
const P3_TROUBLE = [
  ['201, lekin hodisa kelmadi', "Backend hali m12-dars-02 kodi bilan — git log --oneline -1 da 64283b2 m12-03 bo'lsin; Ctrl+C va qayta npm run start"],
  ["409 «O'yin to'ldi» yoki «Siz bu o'yinga qo'shilgansiz»", "boshqa o'yin id sini oling: curl localhost:3000/oyinlar -H \"Authorization: Bearer <Vali tokeni>\""],
];
const P3_PROOF = { label: "Ali'ga kelgan hodisa satri", placeholder: 'klient terminalidan HODISA satrini qo\'ying', check: (v) => /oyin-ozgardi.*qoshildi/i.test(v), wrong: "Ali klientida «HODISA oyin-ozgardi» bilan boshlanadigan satrni butunligicha nusxalang" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} />; }

// ============================================================
//  18 · m10-02 xaritasi (WebSocketBasicsLesson.jsx — SCREEN_META 20)
// ============================================================
const MAP18 = [
  { t: 'Kirish', s: 's0–s1', d: 'ekran yangilanmaydi · reja', m: "so'rovsiz eski son (2-ekran)" },
  { t: 'Ulanish', s: 's2–s8', d: "yo'l yopiq / ochiq · konvert · token bilan ulanish", m: 'gateway kodi (5-ekran) · tokensiz (6-ekran)' },
  { t: 'Tinglovchi', s: 's9', d: 'kod oynasi (namuna)', m: "m12-02 da hodisa yo'q (15-ekran)" },
  { t: 'Holat', s: 's10–s11', d: "uch belgi · uzilishda hodisa yo'qoladi", m: '5 s va 45 s (10–11-ekran)' },
  { t: 'Sxema va amaliyot', s: 's12–s14, A1, A2', d: "real vaqt sxemasi · A1 o'z repo + Render + telefon · A2 README", m: "Render va telefon — sinfda (biz sinamadik)" },
];
const S18 = mkS(18, [{ hl: [] }, { hl: [2, 4] }, { hl: [3, 4], warn: true }, { hl: [4], sum: true }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP18.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.warn && <div className="n2-warn">A1: Render'ning bepul xizmati uxlagan bo'lsa, birinchi ulanish cho'ziladi (o'quvchi darsi: «bir daqiqagacha kuting»); uchish rejimida belgi 45 s gacha kech qoladi. Render va telefonni <b>o'zimiz sinamadik</b>.</div>}
    {seg.sum && <div className="mk-rule">Vaqtning ko'pini <b>A1 ga</b> bering: belgi «Ulangan» va uchish rejimida o'zgarsa — maqsad bajarilgan.</div>}
  </div>} />;
}

// ============================================================
//  19 · Real vaqt sxemasi (maydon-jamoa README «Real vaqt», m12-dars-02-done — aynan)
// ============================================================
const RT19 = [
  ["«8 / 10» va qo'shilganlar ro'yxati", "o'yinchi «Qo'shilaman» ni bosadi", 'qoshildi', "«8 / 10» → «9 / 10», ro'yxatda yangi o'yinchi"],
  ["«8 / 10» va qo'shilganlar ro'yxati", "o'yinchi o'yindan chiqadi (navbatdagi kirsa — shu hodisa)", 'chiqdi', "son va ro'yxat yangilanadi"],
  ['«Kelaman» belgilari', "o'yinchi «Kelaman» ni bosadi", 'tasdiqladi', '«Kelishini tasdiqladi: 7 / 9» → «8 / 9»'],
  ['«Navbatda: N»', "o'yinchi navbatga yoziladi", 'navbatga-yozildi', '«Navbatda: 1»'],
  ["o'yinlar ro'yxati", "tashkilotchi o'yin e'lon qiladi", 'elon-berildi', 'ro\'yxatda yangi karta'],
];
const S19 = mkS(19, [{ col: -1 }, { col: 9 }, { col: 2 }, { col: -1, sum: true }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <div style={{ display: 'grid', gap: 10 }}>
    <div className="mk-light" style={{ padding: 12, overflow: 'auto' }}>
      <div className="mk-tag">README.md · ## Real vaqt</div>
      <table className="mk-tbl" style={{ fontSize: 12.5 }}><thead><tr>{['Real vaqt nuqtasi', 'Kim nima qiladi', 'Hodisa', 'Kim oladi', "Ekranda nima o'zgaradi"].map((h, i) => <th key={h} style={{ textAlign: 'left', color: seg.col === 9 || seg.col === i ? T.accent : T.ink2 }}>{h}</th>)}</tr></thead>
        <tbody>{RT19.map((r) => <tr key={r[2]}><td>{r[0]}</td><td>{r[1]}</td><td style={{ background: seg.col === 2 ? '#FFF7F3' : 'transparent' }}><code>oyin-ozgardi</code> · sabab <code>{r[2]}</code></td><td>hamma ulangan ilova</td><td>{r[3]}</td></tr>)}</tbody></table>
      <div style={{ fontSize: 13, color: T.ink2, marginTop: 8 }}><code>oyin-ozgardi</code> — <code>{'{ oyinId, sabab }'}</code>. Hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi. Hozircha faqat ulanish va belgi bor — hodisalar hali yuborilmaydi.</div>
    </div>
    {seg.sum && <div className="mk-rule">Sxema — reja: m12-dars-03 da hodisalar <b>aynan shu besh sabab</b> bilan yuboriladi (14-ekran).</div>}
  </div>} />;
}

// ============================================================
//  20 · O'quvchi darsidagi so'zlar va sinfdagi holatlar
// ============================================================
const DICT20 = [["yopiq yo'l · ochiq yo'l", "so'rov–javob · doimiy ulanish"], ['konvert', 'hodisa (oyin-ozgardi)'], ['belgi', 'ulanish holati (active)'], ['tinglovchi', "ulanish.on(…)"]];
const STUMBLE20 = [
  ['Bir lahza yashil, keyin kulrang', 'io server disconnect', 'token — qayta kirish'],
  ['Sariq, keyin yashil', 'transport close', 'Backend qayta yondi — 5 s gacha, normal'],
  ["Uchish rejimida o'zgarmadi", '45 s gacha', 'kuting'],
  ["Son o'zi o'zgarmadi", "hodisa yo'q (m12-02)", 'xato emas'],
  ["Birinchi ulanish cho'zildi", "Render uxlagan (sinamadik)", 'bir daqiqa'],
  ["Backend terminali «o'yinchi null»", "return yo'q", '8-ekran'],
];
const QA20 = [
  ['«WebSocket va socket.io bir narsami?»', 'socket.io — kutubxona, imkon bo\'lsa WebSocket orqali ulanadi (3-ekran: transport websocket).'],
  ['«Nega hodisada son yo\'q?»', "ikki kishi birdan qo'shilsa adashmasin — son Backend'dan."],
  ['«Uzilgan paytdagi hodisa keyin keladimi?»', "bu loyihada yo'q — o'quvchi darsi s11: uzilgan paytdagi hodisa keyin ham kelmaydi, son eski qoladi; pastga tortib yangilanadi."],
  ['«Token muddati tugasa?»', "keyingi ulanishda Backend yopadi — «Ulanmagan», qayta kirish."],
];
const S20 = mkS(20, [{ v: 'til' }, { hl: [0, 1, 2] }, { hl: [3, 4, 5] }, { hl: [], qa: true }]);
function Screen20(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S20} scene={({ seg }) => <>
    {seg.v === 'til' ? <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">O'quvchi darsidagi so'z → uning atamasi</div>
      <table className="mk-tbl"><tbody>{DICT20.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>
    </div> : <div className="mk-qa">
      {STUMBLE20.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>}
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Avval <b>belgiga</b>, keyin <b>Backend terminaliga</b> o'quvchi bilan birga qarang — sabab deyarli doim shu ikkisida.</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA20.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}
