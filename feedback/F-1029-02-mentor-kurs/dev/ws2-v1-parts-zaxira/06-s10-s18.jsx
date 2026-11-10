// ============================================================
//  Chiqishlar: ws2-out/05–06 (xona), ws2-amal-out/02–04 (amaliyotlar mentor yo'lida)
// ============================================================
const OUT05 = tm(String.raw`
$ node ws2-sinov.js xona eski        # ilova: ulanish.ts — m12-dars-04-done
  1.3s  [Ali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: 1 }
  1.3s  [Ali] Hozir ko'ryapti: 1  (korayotganlar-ozgardi {"oyinId":1,"soni":1})
  2.3s  --- Backend yangi versiyasi: qayta ishga tushirildi ---
  6.1s  [Ali] ulangan
  7.5s  [Vali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: 1 }
  7.5s  [Vali] Hozir ko'ryapti: 1  (korayotganlar-ozgardi {"oyinId":1,"soni":1})`, { 2: { id: 'o' }, 3: { id: 'o' }, 4: { id: 'v' }, 5: { id: 'v' }, 7: { id: 'x' } });
const OUT06 = tm(String.raw`
$ node ws2-sinov.js xona yangi       # ilova: ulanish.ts — m12-dars-05-done
  2.3s  --- Backend yangi versiyasi: qayta ishga tushirildi ---
  3.7s  [Ali] ulangan
  3.7s  [Ali] Hozir ko'ryapti: 1  (korayotganlar-ozgardi {"oyinId":1,"soni":1})
  5.1s  [Vali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: 1 }
  5.1s  [Ali] Hozir ko'ryapti: 2  (korayotganlar-ozgardi {"oyinId":1,"soni":2})
  5.1s  [Vali] Hozir ko'ryapti: 2  (korayotganlar-ozgardi {"oyinId":1,"soni":2})`, { 4: { id: 'r' }, 6: { id: 'ok' }, 7: { id: 'ok' } });
const AMAL03 = tm(String.raw`
$ TOKEN=<Vali tokeni> OYIN=3 node klient.js   # Ali klienti ham ishlab turibdi, 3-o'yin ochiq
  0.0s  ulangan
  0.0s  Hozir ko'ryapti: 1`, { 3: { id: 'x' } });
const AMAL04 = tm(String.raw`
$ TOKEN=<Ali tokeni> OYIN=3 node klient.js   # tuzatilgan klient
  1.8s  ulanmoqda  (disconnect: transport close)
 12.8s  ulangan
 12.8s  Hozir ko'ryapti: 1
 12.8s  GET /oyinlar (ulanganda) → Park maydoni: 5 / 8
 14.6s  Hozir ko'ryapti: 2
 16.4s  HODISA oyin-ozgardi {"oyinId":3,"sabab":"chiqdi"} — tinglovchi ishladi (1)`, { 3: { id: 'r' }, 4: { id: 'r' }, 5: { id: 'r' }, 6: { id: 'ok' }, 7: { id: 'ok' } });
// Namuna (manba/ws2-klient-tuzatilgan.js — aynan, 21–33-satr): o'zingiz yozing, nusxalash yo'q
const KLIENT_FIX = tsN([
  "// connect har ulanishda ishlaydi: ichida faqat qayta so'rash va ochiq o'yin xonasiga qayta kirish",
  "ulanish.on('connect', () => {",
  "  yoz('ulangan');",
  "  qaytaSora('ulanganda');",
  "  if (OYIN) ulanish.emit('oyin-ochildi', { oyinId: OYIN });",
  '});',
  '// Tinglovchi bir marta — connect dan tashqarida',
  "ulanish.on('oyin-ozgardi', async (hodisa) => {",
  '  marta++;',
  '  yoz(`HODISA oyin-ozgardi ${JSON.stringify(hodisa)} — tinglovchi ishladi (${marta})`);',
  "  await qaytaSora('hodisa kelgach');",
  '});',
  "ulanish.on('disconnect', (sabab) => yoz(`${ulanish.active ? 'ulanmoqda' : 'ulanmagan'}  (disconnect: ${sabab})`));",
  "ulanish.on('korayotganlar-ozgardi', (m) => yoz(`Hozir ko'ryapti: ${m.soni}`));",
], 21);

// ============================================================
//  10 · Xona — «Hozir ko'ryapti: 1» (ws2-out/05–06; gateway 58–65, 76–81)
// ============================================================
const S10 = mkS(10, [{ v: 'gw', c: ['j'] }, { v: 'gw', c: ['u'] }, { v: 'out' }, { v: 'out', sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'gw' ? <Ide files={REPO_FILES} active={RF.gw}><CodePanel file={`${RF.gw} · m12-dars-04-done`} wrap lines={GW04} focus={seg.c} style={{ fontSize: 12.5 }} /></Ide>
      : <div className="pg-two">
        <Term er lines={OUT05} focus={['v', 'x']} title="eski ilova (haqiqiy)" />
        <Term lines={OUT06} focus={['r', 'ok']} title="tuzatilgan ilova (haqiqiy)" />
      </div>}
    {seg.v === 'out' && <div className="ws-phones">
      <Phone who="Vali · eski ilova" ekran="O'yin · Mahalla maydoni" rows={[["Hozir ko'ryapti", '1', 'old']]} mark="bad" />
      <Phone who="Vali · tuzatilgan" ekran="O'yin · Mahalla maydoni" rows={[["Hozir ko'ryapti", '2', 'new']]} mark="good" />
    </div>}
    {seg.sum && <div className="mk-rule">Qayta ulanganda ilova ochiq o'yin <b>xonasiga qayta kiradi</b> — Backend o'zgarmaydi.</div>}
  </div>} />;
}

// ============================================================
//  11 · Tekshiruv 3
// ============================================================
function Screen11(p) {
  const m = MDT[11];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy natija — eski ilova</div>
      <Term er lines={OUT05} focus={['x']} />
    </div>} />;
}

// ============================================================
//  12 · Amaliyot 2 — ikkinchi telefon (ws2-amal-out/03)
// ============================================================
const P2 = mkS(12, [{ hl: [] }, { hl: [0, 1] }, { hl: [] }], { tableAt: 2 });
const P2_STEPS = [
  { t: 'Ali — 1-amaliyotdagi klient yopilmagan', cmds: [], exp: 'oxirgi satrlar: ulangan va tinglovchi ishladi (2)' },
  { t: 'Vali — yangi terminalda, ws-klient papkasida', cmds: ['TOKEN=<Vali tokeni> OYIN=3 node klient.js'], exp: "ulangan · Hozir ko'ryapti: 1" },
];
const P2_TROUBLE = [
  ["Hozir ko'ryapti: 2", "Ali klienti qayta ulanishdan oldin yopilib qayta yoqilgan (yangi jarayon xonaga kiradi) — 1-amaliyotning 3-qadamini qaytaring"],
];
const P2_PROOF = { label: "Vali'dagi «Hozir ko'ryapti» soni", placeholder: 'faqat sonni yozing', check: (v) => /^1$/.test(v), wrong: "Vali klienti terminalidagi «Hozir ko'ryapti:» dan keyingi sonni yozing" };
function ScreenP2(p) { return <Practice p={p} S={P2} steps={P2_STEPS} trouble={P2_TROUBLE} proof={P2_PROOF} />; }

// ============================================================
//  13 · Tuzatish: bitta fayl, uch joy (m12-dars-05-done ulanish.ts 50–64)
// ============================================================
const DIFF13 = tm(String.raw`
$ git diff --stat m12-dars-04-done m12-dars-05-done
 BUZISH.md                   | 25 +++++++++++++++++++++++++
 README.md                   |  5 +++++
 mobil/src/app/index.tsx     |  4 ++--
 mobil/src/app/oyin/[id].tsx |  7 ++++---
 mobil/src/ulanish.ts        | 32 ++++++++++++++++++++++++--------
# backend/ — yo'q`, { 6: { id: 'u' }, 7: { id: 'b' } });
const S13 = mkS(13, [{ v: 'diff' }, { v: 'code', c: ['c', 'q', 'x'] }, { v: 'code', c: ['t'] }, { v: 'code', c: [], sum: true }]);
function Screen13(p) {
  return <Lesson p={p} S={S13} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'diff' ? <Term lines={DIFF13} focus={['u', 'b']} title="terminal — maydon-jamoa" />
      : <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={REPO_FILES} active={RF.ul}><CodePanel file={`${RF.ul} · m12-dars-05-done`} wrap lines={UL05} focus={seg.c} style={{ fontSize: 12.5 }} /></Ide></div>}
    {seg.sum && <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.blue }}><h4>connect ichida — har ulanishda</h4><p>belgi · qayta so'rash · xonaga qayta kirish</p></div>
      <div className="mk-box" style={{ '--c': T.green }}><h4>tashqarida — bir marta</h4><p>oyin-ozgardi tinglovchisi</p></div>
    </div>}
  </div>} />;
}

// ============================================================
//  14 · Amaliyot 3 — tuzatib qayta tekshirish (ws2-amal-out/04)
// ============================================================
const P3 = mkS(14, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P3_STEPS = [
  { t: "Tuzatish — ikkala klientni Ctrl+C bilan yoping; klient.js: connect ichida faqat qayta so'rash va xona, tinglovchi tashqarida", cmds: [], exp: 'fayl saqlandi' },
  { t: 'Ali', cmds: ['TOKEN=<Ali tokeni> OYIN=3 node klient.js'], exp: "ulangan · Hozir ko'ryapti: 1 · GET /oyinlar (ulanganda)" },
  { t: 'Yangi versiya — Backend terminalida Ctrl+C, keyin', cmds: ['npm run start'], exp: "Ali: ulangan · Hozir ko'ryapti: 1 · GET /oyinlar (ulanganda)" },
  { t: "Vali — klient, keyin o'yindan chiqish", cmds: ['TOKEN=<Vali tokeni> OYIN=3 node klient.js', 'curl -X POST localhost:3000/oyinlar/3/chiqish -H "Authorization: Bearer <Vali tokeni>"'], exp: "ikkalasida Hozir ko'ryapti: 2 · Ali: tinglovchi ishladi (1)" },
];
const P3_CODE = [{ file: 'klient.js', step: 0, lines: KLIENT_FIX, copy: false }];
const P3_TROUBLE = [
  ["Vali'da yana 1", "connect ichida oyin-ochildi yo'q yoki OYIN tekshirilmagan — namunaga qarang"],
  ["Ali'da (1) va (2)", 'tinglovchi hali connect ichida'],
  ["Ali'da (1) yo'q", "Vali chiqmagan (409) — avval qo'shiling, keyin chiqing"],
];
const P3_PROOF = { label: "Vali'dagi «Hozir ko'ryapti» soni", placeholder: 'faqat sonni yozing', check: (v) => /^2$/.test(v), wrong: "Vali klienti terminalidagi «Hozir ko'ryapti:» dan keyingi sonni yozing" };
function ScreenP3(p) { return <Practice p={p} S={P3} steps={P3_STEPS} trouble={P3_TROUBLE} proof={P3_PROOF} code={P3_CODE} tree={KLIENT_FILES} />; }

// ============================================================
//  15 · Tekshiruv 4 — fonga olish nega buzilmadi (m12-dars-04-done ulanish.ts 63–68)
// ============================================================
function Screen15(p) {
  const m = MDT[15];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Kodda: m12-dars-03 dan beri (telefonda sinamadik)</div>
      <CodePanel file={`${RF.ul} · m12-dars-04-done`} wrap lines={APPSTATE04} focus={['a']} />
    </div>} />;
}

// ============================================================
//  16 · m10-05 xaritasi (BreakAndFixLesson.jsx — SCREEN_META 19)
// ============================================================
const MAP16 = [
  { t: 'Kirish', s: 's0–s1', d: "«bajardim» — da'vo · reja", m: 'README «Chekka holatlar» (2-ekran)' },
  { t: 'Uch muammo', s: 's2–s7', d: 'uzilish · takror · xona — har biri test bilan', m: 'haqiqiy chiqishlar (4, 7, 10-ekran)' },
  { t: 'Tinglovchi', s: 's8', d: 'kod oynasi (namuna, uzilish — tugma)', m: '50-satr (8-ekran)' },
  { t: 'Yozuv va qayta tekshiruv', s: 's9–s12', d: 'buzish yozuvi · test · qayta tekshiruv · mustaqil', m: '«shu telefonda, shu urinishda» (3-ekran)' },
  { t: 'Amaliyot', s: 'A1, A2', d: "o'z ilovasini buzish · agentga tuzattirish", m: 'Render, Expo Go (17-ekran)' },
];
const S16 = mkS(16, [{ hl: [] }, { hl: [2, 4] }, { hl: [1] }, { hl: [3, 4], sum: true }]);
function Screen16(p) {
  return <Lesson p={p} S={S16} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP16.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    {seg.sum && <div className="mk-rule">Vaqtning ko'pi <b>ikki blokka</b>; «Nima bo'ldi» qatorida taxmin emas — ko'rgani.</div>}
  </div>} />;
}

// ============================================================
//  17 · A1 va A2 (o'quvchi darsi ScreenA1, ScreenA2 — aynan, qisqartirib)
// ============================================================
const A1_17 = [
  ["(1) Internetni uzish", "uchish rejimini yoqing va belgi «Ulanmoqda…» bo'lishini kuting (bir daqiqagacha). Keyin o'zgarish qilinsin; bo'lgach uchish rejimini o'chiring."],
  ['(2) Fonga olib qaytarish', "boshqa ilovaga o'ting va o'zgarish qilinsin. Bir daqiqadan keyin ilovaga qayting."],
  ["(3) Backend'ning yangi versiyasi", "Render sahifasida: «Manual Deploy» → «Deploy latest commit». Belgi «Ulanmoqda…» ga o'tib, yana «Ulangan» bo'lishi kerak."],
];
const S17 = mkS(17, [{ hl: [] }, { hl: [2], warn: 'r' }, { hl: [0], warn: 'e' }, { hl: [], a2: true, sum: true }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <div style={{ display: 'grid', gap: 10 }}>
    <div className="mk-tag" style={{ margin: 0 }}>A1 · o'z mahsulotingiz — o'zgarishni boshqa akkaunt qiladi (sherik yoki agent) · qadamlar qisqartirilgan</div>
    {A1_17.map(([h, t], i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}><div className="t"><b>{h}</b><div style={{ fontSize: 13.5 }}>{t}</div></div></div>)}
    {seg.warn === 'r' && <div className="n2-warn">Render'da qayta chiqarish <b>bir necha daqiqa</b> cho'zilishi mumkin; tugma nomi rasmiy hujjatdan. Render'ni o'zimiz sinamadik.</div>}
    {seg.warn === 'e' && <div className="n2-warn">Expo Go uchish rejimidan keyin ilovani qayta yuklasa (ekran boshidan ochilsa), 1-urinishda muammo <b>ko'rinmay qolishi mumkin</b> — o'quvchi darsida «pilotda tekshiriladi».</div>}
    {seg.a2 && <div className="mk-card"><h5>A2 · agentga prompt bandlari (qisqartirilgan)</h5><div style={{ fontSize: 13.5, lineHeight: 1.55 }}><b>Qayerda:</b> <code>mobil/</code> — ulanish fayli va real vaqt ekranlari. Backend'ga tegma.<br /><b>Nima qilsin:</b> buzish yozuvida «buzildi» belgili har urinishni tuzat; har muammoning sababini bir gap bilan ayt.<br /><b>Nima buzilmasin:</b> kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin.</div></div>}
    {seg.sum && <div className="mk-rule">Agentning «tuzatdim» degani ham da'vo — <b>xuddi shu usul bilan</b> qayta buzib ko'riladi.</div>}
  </div>} />;
}

// ============================================================
//  18 · O'quvchi darsidagi so'zlar va sinfdagi holatlar
// ============================================================
const DICT18 = [["da'vo · tekshirilmagan", "agent «bajardim» dedi"], ['buzildi · buzilmadi', "ko'rilgan kutilgandan farq qildi yoki qilmadi"], ['qayta ulanish', 'connect (har ulanishda)'], ['xona', "oyin-{id} · «Hozir ko'ryapti»"]];
const STUMBLE18 = [
  ['Belgi «Ulangan», son eski', 'uzilishdan keyin', "connect da qayta so'rash yo'q"],
  ['Jonli xabar ikki marta', 'qayta ulangandan keyin', 'tinglovchi connect ichida'],
  ["«Hozir ko'ryapti» kam", 'yangi versiyadan keyin', 'xonaga qayta kirish yo\'q'],
  ['Hamma urinish «buzilmadi»', 'Expo Go qayta yuklagan bo\'lishi mumkin (sinamadik)', 'bu ham natija'],
  ['«Ulanmoqda…» uzoq', "Render qayta chiqyapti (sinamadik)", "bir necha daqiqa"],
  ['Agent «tuzatdim» dedi', 'qayta tekshiruv qilinmagan', 'xuddi shu usul bilan qaytarish'],
];
const QA18 = [
  ["«Socket.io o'zi qayta ulanadi-ku, nega tuzatamiz?»", "ulanishni tiklaydi, lekin o'tkazib yuborilgan hodisani va xonani tiklamaydi."],
  ['«Qayta ulanish necha marta urinadi?»', "sukutda cheklanmagan; kutish ≈1 s dan ikki barobar o'sadi, 5 s dan oshmaydi (o'quvchi darsi s1 eslatmasi; WebSocket-1 da o'lchangan)."],
  ['«Tinglovchi ikki marta bo\'lsa, nima yomon?»', "har o'zgarish ikki marta so'raladi, jonli xabar ikki marta chiqadi; har qayta ulanishda yana ko'payadi."],
  ["«Backend'ni tuzatish kerakmi?»", "yo'q: uchala tuzatish ilovada (13-ekran)."],
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
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Har «bajardim» va «tuzatdim» dan keyin — o'quvchi bilan <b>xuddi shu usulni</b> qaytaring.</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA18.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}
