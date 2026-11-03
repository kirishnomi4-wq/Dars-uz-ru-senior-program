// ============================================================
//  Kod va chiqishlar — maydon-jamoa m12-dars-04-done (= 05-start kodi) va m12-dars-05-done aynan;
//  chiqishlar ws2-out / ws2-amal-out dan (vaqt belgilari o'zgartirilmagan; token — «<Ali tokeni>»)
// ============================================================
// Satr raqami — fayldagi haqiqiy raqam (n); qatorlar oddiy qo'shtirnoqda, ichidagi backtick — kod
const tsN = (arr, start, meta = {}) => arr.map((l, i) => ({ h: tsLine(l), n: start + i, ...(meta[i + 1] || {}) }));
// m12-dars-04-done · mobil/src/ulanish.ts 48–55 (agent «bajardim» degan holat)
const UL04_SRC = [
  "  ulanish.on('connect', () => {",
  "    holatQoy('ulangan');",
  "    ulanish?.on('oyin-ozgardi', async () => {",
  '      const oldingi = oxirgiRoyxat();',
  '      const yangi = await qaytaSora();',
  '      if (oldingi && yangi) jonliXabarlar(oldingi, yangi).forEach(jonliXabarQosh);',
  '    });',
  '  });',
];
const UL04 = tsN(UL04_SRC, 48, { 1: { id: 'c' }, 3: { id: 't' }, 4: { id: 't' }, 5: { id: 't' }, 6: { id: 't' }, 7: { id: 't' }, 8: { id: 'c' } });
// m12-dars-05-done · mobil/src/ulanish.ts 50–64 (tuzatilgan)
const UL05_SRC = [
  "  // connect birinchi ulanishda VA har qayta ulanishda ishlaydi — shuning uchun ichida tinglovchi qo'shilmaydi",
  "  // (aks holda har qayta ulanishda yana bittasi qo'shilib, bitta hodisa ikki marta ishlaydi — takror hodisa).",
  "  // Ichida faqat: qayta so'rash (uzilish paytida yuborilgan hodisa keyin kelmaydi) va ochiq o'yin xonasiga qayta kirish",
  '  // (uzilganda ulanish hamma xonadan chiqqan).',
  "  ulanish.on('connect', () => {",
  "    holatQoy('ulangan');",
  '    qaytaSora();',
  "    if (ochiqOyin !== null) ulanish?.emit('oyin-ochildi', { oyinId: ochiqOyin });",
  '  });',
  '  // Tinglovchi bir marta — connect dan tashqarida',
  "  ulanish.on('oyin-ozgardi', async () => {",
  '    const oldingi = oxirgiRoyxat();',
  '    const yangi = await qaytaSora();',
  '    if (oldingi && yangi) jonliXabarlar(oldingi, yangi).forEach(jonliXabarQosh);',
  '  });',
];
const UL05 = tsN(UL05_SRC, 50, { 5: { id: 'c' }, 6: { id: 'c' }, 7: { id: 'q' }, 8: { id: 'x' }, 9: { id: 'c' }, 11: { id: 't' }, 12: { id: 't' }, 13: { id: 't' }, 14: { id: 't' }, 15: { id: 't' } });
// m12-dars-04-done · backend/src/oyinlar.gateway.ts 58–65 va 76–81
const GW04 = tsN([
  "  @SubscribeMessage('oyin-ochildi')",
  '  async ochildi(@ConnectedSocket() ulanish: Socket, @MessageBody() malumot: { oyinId?: unknown }) {',
  '    const oyinId = Number(malumot?.oyinId);',
  '    if (!ulanish.data.oyinchiId || !Number.isInteger(oyinId)) return;',
  '    await ulanish.join(xona(oyinId));',
  '    ulanish.data.ochiq.add(oyinId);',
  '    await this.korayotganlarniYubor(oyinId);',
  '  }',
], 58, { 5: { id: 'j' } }).concat([{ h: '<span class="cm">  …</span>', n: '' }], tsN([
  "  // Ulanish uzilganda u hamma xonadan o'zi chiqadi — u ochib turgan har o'yin xonasiga yangi son",
  '  async handleDisconnect(ulanish: Socket) {',
  '    if (!ulanish.data.oyinchiId) return;',
  "    this.log.log(`uzildi: o'yinchi ${ulanish.data.oyinchiId}`);",
  '    for (const oyinId of ulanish.data.ochiq as Set<number>) await this.korayotganlarniYubor(oyinId);',
  '  }',
], 76, { 1: { id: 'u' } }));
// m12-dars-04-done · mobil/src/ulanish.ts 63–68 (fondan qaytganda — qayta so'rash; 3-darsdan beri)
const APPSTATE04 = tsN([
  "  // Ilova fonda turganda o'zgarish bo'lsa: fondan qaytganda ro'yxat qayta so'raladi",
  '  let oldingi: string | null | undefined = AppState.currentState;',
  "  ilovaHolati = AppState.addEventListener('change', (yangi: AppStateStatus) => {",
  "    if (oldingi === 'background' && yangi === 'active') qaytaSora();",
  '    oldingi = yangi;',
  '  });',
], 63, { 4: { id: 'a' } });
// Mentorning klienti (manba/ws2-klient.js — aynan): m12-04 qoidasi
const KLIENT_JS = tsN([
  "// klient.js — o'quvchi ilovasidagi mobil/src/ulanish.ts (m12-dars-04-done) qoidasi, telefon o'rniga terminalda.",
  "// OYIN=<id> berilsa — «O'yin» ekrani ochiq: Backend'ga oyin-ochildi yuboriladi, «Hozir ko'ryapti» chiqadi.",
  "// Ishga tushirish: TOKEN=<token> OYIN=3 node klient.js   (to'xtatish — Ctrl+C)",
  "const { io } = require('socket.io-client');",
  '',
  "const API = process.env.API || 'http://localhost:3000';",
  'const TOKEN = process.env.TOKEN;',
  'const OYIN = process.env.OYIN ? Number(process.env.OYIN) : null;',
  'const ulanish = io(API, { auth: { token: TOKEN } });',
  '',
  'const t0 = Date.now();',
  'const yoz = (matn) => console.log(`${((Date.now() - t0) / 1000).toFixed(1).padStart(5)}s  ${matn}`);',
  'let marta = 0;',
  '',
  'async function qaytaSora(sabab) {',
  "  const javob = await fetch(API + '/oyinlar', { headers: { Authorization: 'Bearer ' + TOKEN } });",
  '  const o = (await javob.json()).find((x) => x.id === (OYIN || 1));',
  '  yoz(`GET /oyinlar (${sabab}) → ${o.maydon}: ${o.qoshilgan} / ${o.kerak}`);',
  '}',
  '',
  "ulanish.on('connect', () => {",
  "  yoz('ulangan');",
  "  ulanish.on('oyin-ozgardi', async (hodisa) => {",
  '    marta++;',
  '    yoz(`HODISA oyin-ozgardi ${JSON.stringify(hodisa)} — tinglovchi ishladi (${marta})`);',
  "    await qaytaSora('hodisa kelgach');",
  '  });',
  '});',
  "ulanish.on('disconnect', (sabab) => yoz(`${ulanish.active ? 'ulanmoqda' : 'ulanmagan'}  (disconnect: ${sabab})`));",
  "ulanish.on('korayotganlar-ozgardi', (m) => yoz(`Hozir ko'ryapti: ${m.soni}`));",
  '',
  "// «O'yin» ekrani ochildi — ilova ochilgandagi birinchi ulanishda bir marta",
  "if (OYIN) ulanish.once('connect', () => ulanish.emit('oyin-ochildi', { oyinId: OYIN }));",
], 1);

// BUZISH.md (m12-dars-05-done) — aynan
const BUZ = [
  ['1', 'Internetni uzish', "Uchish rejimini yoqdim; belgi «Ulanmoqda…» bo'lgach agent tekshiruv akkauntidan «Shanba, 18:00» ga qo'shildi; keyin uchish rejimini o'chirdim.", "Belgi «Ulangan» bo'lgach, «9 / 10» ko'rinadi.", "Belgi «Ulangan», lekin «8 / 10» qoldi.", 'buzildi'],
  ['2', 'Fonga olib qaytarish', "Boshqa ilovaga o'tdim; shu payt agent tekshiruv akkauntidan qo'shildi; bir daqiqadan keyin qaytdim.", "Qaytganimda «9 / 10» ko'rinadi.", "Qaytganimda «9 / 10», belgi «Ulangan».", 'buzilmadi'],
  ['3', "Backend'ning yangi versiyasi", "Render'da Backend'ni qayta chiqardim; belgi yana «Ulangan» bo'lgach, ikkinchi telefonda o'yinni ochdim va agent tekshiruv akkauntidan qo'shildi.", "Bitta jonli xabar; ikkinchi telefonda «Hozir ko'ryapti: 2».", "Jonli xabar ikki marta chiqdi; ikkinchi telefonda «Hozir ko'ryapti: 1».", 'buzildi'],
];
function BuzTable({ cols = [0, 1, 2, 3, 4, 5], hl = [], rows = [0, 1, 2], small }) {
  const H = ['№', 'Usul', 'Nima qildim', 'Nima kutdim', "Nima bo'ldi", 'Belgi'];
  return <div className="mk-light" style={{ padding: 12, overflow: 'auto' }}>
    <div className="mk-tag">BUZISH.md · m12-dars-05-done</div>
    <table className="mk-tbl" style={{ fontSize: small ? 12 : 13 }}><thead><tr>{cols.map((c) => <th key={c} style={{ textAlign: 'left', color: hl.includes(c) ? T.accent : T.ink2 }}>{H[c]}</th>)}</tr></thead>
      <tbody>{BUZ.filter((_, i) => rows.includes(i)).map((r) => <tr key={r[0]}>{cols.map((c) => <td key={c} style={c === 5 ? { fontWeight: 800, color: r[5] === 'buzildi' ? T.accent : T.green } : (hl.includes(c) ? { background: '#FFF7F3' } : {})}>{r[c]}</td>)}</tr>)}</tbody></table>
  </div>;
}

// ws2-out — haqiqiy chiqishlar
const OUT01 = tm(String.raw`
$ node ws2-sinov.js uzilish eski     # ilova: ulanish.ts — m12-dars-04-done
  0.9s  [Ali] ulangan
  1.0s  [Ali] GET /oyinlar (ekran ochildi) → Maktab maydoni: 6 / 10
  1.8s  --- internet uzildi ---
  1.8s  [Ali] ulanmoqda  (disconnect: transport close)
  2.4s  [Ali] ulanmoqda  (connect_error: xhr poll error) …
  3.3s  [Sardor] POST /oyinlar/2/qoshilish → 201
  4.8s  --- internet qaytdi ---
  5.3s  [Ali] ulangan
  6.8s  NATIJA: Ali ekranida 6 / 10 · Backend'da 7 / 10`, { 3: { id: 'g' }, 4: { id: 'u' }, 5: { id: 'u' }, 7: { id: 's' }, 9: { id: 'k' }, 10: { id: 'n' } });
const OUT02 = tm(String.raw`
$ node ws2-sinov.js uzilish yangi    # ilova: ulanish.ts — m12-dars-05-done
  2.1s  --- internet uzildi ---
  3.6s  [Jasur] POST /oyinlar/2/qoshilish → 201
  5.1s  --- internet qaytdi ---
  6.0s  [Ali] ulangan
  6.0s  [Ali] GET /oyinlar (qayta ulanganda) → Maktab maydoni: 8 / 10
  7.5s  NATIJA: Ali ekranida 8 / 10 · Backend'da 8 / 10`, { 6: { id: 'g' }, 7: { id: 'n' } });
const OUT03 = tm(String.raw`
$ node ws2-sinov.js versiya eski     # ilova: ulanish.ts — m12-dars-04-done
  1.8s  --- Backend yangi versiyasi: qayta ishga tushirildi ---
  1.8s  [Ali] ulanmoqda  (disconnect: transport close)
  2.9s  [Ali] ulangan
  4.0s  [Ali] oyin-ozgardi {"oyinId":3,"sabab":"qoshildi"} — tinglovchi ishladi (1)
  4.0s  [Ali] oyin-ozgardi {"oyinId":3,"sabab":"qoshildi"} — tinglovchi ishladi (2)
  4.0s  [Bekzod] POST /oyinlar/3/qoshilish → 201
  4.0s  [Ali] GET /oyinlar (hodisa kelgach) → Park maydoni: 5 / 8
  4.0s  [Ali] GET /oyinlar (hodisa kelgach) → Park maydoni: 5 / 8
  5.5s  NATIJA: bitta o'zgarish — Ali'da tinglovchi 2 marta ishladi`, { 2: { id: 'v' }, 3: { id: 'v' }, 4: { id: 'v' }, 5: { id: 't' }, 6: { id: 't' }, 7: { id: 'b' }, 8: { id: 'g' }, 9: { id: 'g' }, 10: { id: 'n' } });
const OUT04 = tm(String.raw`
$ node ws2-sinov.js versiya yangi    # ilova: ulanish.ts — m12-dars-05-done
  5.8s  [Ali] ulangan
  6.8s  [Ali] oyin-ozgardi {"oyinId":3,"sabab":"qoshildi"} — tinglovchi ishladi (1)
  6.9s  [Aziz] POST /oyinlar/3/qoshilish → 201
  8.4s  NATIJA: bitta o'zgarish — Ali'da tinglovchi 1 marta ishladi`, { 3: { id: 't' }, 5: { id: 'n' } });

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ['Talab va buzish yozuvi', 'Internet uzildi', 'Yangi versiya: takror tinglovchi', 'Yangi versiya: xona va tuzatish', "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [4] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Mentor misolining natijasi — uch urinish</div>
    <BuzTable cols={[0, 1, 5]} />
  </div>} />;
}

// ============================================================
//  2 · «Bajardim» — da'vo (README «Chekka holatlar», m12-dars-04-done)
// ============================================================
const EDGE2 = ["Internet uzilib qaytsa — ro'yxat yangi holatni ko'rsatsin.", 'Bitta o\'zgarish ekranni bir marta yangilasin — ulanish qayta tiklangandan keyin ham.', "Ilova boshqa ekranda yoki fonda turganda o'zgarish bo'lsa — «O'yinlar»ga qaytganda yangi holat ko'rinsin."];
const S2 = mkS(2, [{ hl: [0] }, { hl: [1, 2] }, { hl: [], claim: true }, { hl: [], claim: true, sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">README.md · ### Chekka holatlar</div>
      <div style={{ display: 'grid', gap: 8 }}>{EDGE2.map((t, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}><span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1})</span><div className="t">{t}</div></div>)}</div>
    </div>
    {seg.claim && <div className="pg-two">
      <div className="mk-card" style={{ borderColor: T.accent }}><h5 style={{ color: T.accent }}>da'vo · tekshirilmagan</h5><div style={{ fontSize: 14.5 }}>Agent: «uchala chekka holatni bajardim»</div></div>
      <div className="mk-card"><h5>README · m12-dars-04-done qatori</h5><div style={{ fontSize: 14 }}>«… Qayta ulanish maxsus boshqarilmaydi»</div></div>
    </div>}
    {seg.sum && <div className="mk-rule">«Bajardim» — tekshiruv emas; tekshiruv — <b>buzib ko'rish</b> va ekranga qarash.</div>}
  </div>} />;
}

// ============================================================
//  3 · Buzish yozuvi (BUZISH.md)
// ============================================================
const S3 = mkS(3, [{ hl: [1, 2, 3, 4, 5] }, { hl: [3, 4] }, { hl: [5] }, { hl: [5], sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <BuzTable hl={seg.hl} small />
    {seg.sum && <div className="mk-rule">«Buzilmadi» — <b>shu telefonda, shu urinishda</b>; hamma telefon uchun isbot emas.</div>}
  </div>} />;
}

// ============================================================
//  4 · Internet uzildi — son eski (ws2-out/01)
// ============================================================
const S4 = mkS(4, [{ f: ['g', 'u'] }, { f: ['s'] }, { f: ['k', 'n'], ph: true }, { f: [], ph: true, sum: true }]);
function Screen4(p) {
  return <Lesson p={p} S={S4} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Term lines={OUT01} focus={seg.f} title="terminal — haqiqiy Backend, eski ilova (m12-dars-04-done)" /></div>
    {seg.ph && <div className="ws-phones">
      <Phone who="Ali" rows={[['Maktab maydoni', '6 / 10', 'old']]} note="belgi «Ulangan», son eski" mark="bad" />
      <div className="mk-card" style={{ borderColor: T.green }}><h5>Backend (GET /oyinlar)</h5><div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 800, color: T.green }}>7 / 10</div><div style={{ fontSize: 13, color: T.ink2 }}>Sardor uzilish paytida qo'shilgan</div></div>
    </div>}
    {seg.sum && <div className="mk-rule">Belgi «Ulangan» — bu ekrandagi son <b>to'g'ri degani emas</b>.</div>}
  </div>} />;
}

// ============================================================
//  5 · Sabab va tuzatish: qayta so'rash (ws2-out/02; m12-dars-05-done ulanish.ts 54–58)
// ============================================================
const S5 = mkS(5, [{ v: 'why' }, { v: 'code' }, { v: 'out' }, { v: 'out', sum: true }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'why' && <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.green }}><h4>Ulangan ilovalar</h4><p>oyin-ozgardi keladi</p></div>
      <div className="mk-box" style={{ '--c': T.accent }}><h4>Uzilgan Ali</h4><p>hodisa yo'q — keyin ham kelmaydi (navbat yo'q)</p></div>
    </div>}
    {seg.v !== 'why' && <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={REPO_FILES} active={RF.ul}><CodePanel file={`${RF.ul} · m12-dars-05-done`} wrap lines={UL05.slice(4, 9)} focus={seg.sum ? [] : ['q']} /></Ide></div>}
    {seg.v === 'out' && <Term lines={OUT02} focus={['g', 'n']} title="terminal — tuzatilgan ilova (haqiqiy)" />}
    {seg.sum && <div className="mk-rule">Qayta ulanish — <b>«nima o'tkazib yubordim?»</b> deb qayta so'rash payti.</div>}
  </div>} />;
}

// ============================================================
//  6 · Tekshiruv 1
// ============================================================
function Screen6(p) {
  const m = MDT[6];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: eski va tuzatilgan ilova</div>
      <Term er lines={OUT01.slice(-1)} />
      <Term lines={OUT02.slice(-2)} />
    </div>} />;
}

// ============================================================
//  7 · connect har ulanishda ishlaydi (ws2-out/03; m12-dars-04-done ulanish.ts 48–55)
// ============================================================
const S7 = mkS(7, [{ f: ['v'], c: [] }, { f: ['t', 'b'], c: [] }, { f: ['t'], c: ['t'] }, { f: [], c: [], sum: true }]);
function Screen7(p) {
  return <Lesson p={p} S={S7} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={REPO_FILES} active={RF.ul}><CodePanel file={`${RF.ul} · m12-dars-04-done`} wrap lines={UL04} focus={seg.c} /></Ide></div>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Term er={seg.f.includes('t')} lines={OUT03} focus={seg.f} title="terminal — haqiqiy Backend, eski ilova" /></div>
    {seg.sum && <div className="mk-rule"><code>connect</code> ichiga faqat <b>har ulanishda</b> qayta qilinadigan ishni yozing.</div>}
  </div>} />;
}

// ============================================================
//  8 · Tekshiruv 2 — LineCheck (50-satr: tinglovchi connect ichida)
// ============================================================
const LC8 = UL04_SRC.map((l, i) => ({ h: tsLine(l), n: 48 + i }));
// Tuzatilgan ko'rinish — m12-dars-05-done 54–64-satr (raqamlar haqiqiy faylniki); o'chgan ichki tinglovchi — chizilgan, raqamsiz
const LC8_FIXED = [
  { h: tsLine(UL05_SRC[4]), n: 54 }, { h: tsLine(UL05_SRC[5]), n: 55 },
  ...UL04_SRC.slice(2, 7).map((l) => ({ h: tsLine(l), n: '', gone: true })),
  { h: tsLine(UL05_SRC[6]), n: 56, neu: true }, { h: tsLine(UL05_SRC[7]), n: 57, neu: true }, { h: tsLine(UL05_SRC[8]), n: 58 },
  ...UL05_SRC.slice(9, 15).map((l, i) => ({ h: tsLine(l), n: 59 + i, neu: true })),
];
function Screen8(p) {
  const m = MDT[8];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={RF.ul} lines={LC8} target={2}
    tree={{ root: 'maydon-jamoa', files: REPO_FILES, active: RF.ul }}
    fixed={LC8_FIXED} fixedExtra={[{ file: 'tuzatilgan ilova — bitta o\'zgarish (haqiqiy)', lines: OUT04 }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  9 · Amaliyot 1 — takror tinglovchi (ws2-amal-out/01–02)
// ============================================================
const P1 = mkS(9, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: "Backend — maydon-jamoa papkasida (.env WebSocket-1 dan qoladi)", cmds: ['git checkout -f m12-dars-05-start', 'cd backend', 'npm ci', 'npm run start'], exp: 'Nest application successfully started' },
  { t: "Ali klienti — ws-klient papkasida, klient.js ni almashtiring", cmds: ['TOKEN=<Ali tokeni> OYIN=3 node klient.js'], exp: "ulangan · Hozir ko'ryapti: 1" },
  { t: 'Yangi versiya — Backend terminalida Ctrl+C, keyin', cmds: ['npm run start'], exp: 'klient: ulanmoqda (disconnect: transport close), keyin ulangan' },
  { t: "O'zgarish — uchinchi terminalda", cmds: ['curl -X POST localhost:3000/oyinlar/3/qoshilish -H "Authorization: Bearer <Vali tokeni>"'], exp: '{"holat":"qoshildi"} · klient: tinglovchi ishladi (1) va (2)' },
];
const P1_CODE = [{ file: 'klient.js', step: 1, lines: KLIENT_JS, copy: true }];
const P1_TROUBLE = [
  ['Faqat (1)', "klient qayta ulanmasdan oldin qo'shildingiz — «ulangan» ikkinchi marta chiqqanini kuting (5 s gacha)"],
  ["409 «Siz bu o'yinga qo'shilgansiz»", "Vali allaqachon qo'shilgan — .../oyinlar/3/chiqish qiling, keyin 3-qadamdan qayta"],
  ["JWT_SECRET yo'q — backend/.env ga yozing", ".env yo'q — cp .env.example .env (WebSocket-1, 7-ekran)"],
];
const P1_PROOF = { label: 'Ikkinchi marta ishlagan satr', placeholder: 'klient terminalidan HODISA satrini qo\'ying', check: (v) => /ishladi \(2\)/.test(v), wrong: "«tinglovchi ishladi (2)» bilan tugaydigan satrni butunligicha nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} code={P1_CODE} tree={KLIENT_FILES} />; }
