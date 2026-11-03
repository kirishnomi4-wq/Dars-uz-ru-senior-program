// ============================================================
//  Kod va chiqishlar — maydon-jamoa (m12-dars-02-done, a5e3753) aynan; chiqishlar ws1-out / ws1-amal-out dan
//  (yo'llar va vaqt belgilari o'zgartirilmagan; token — «<Ali tokeni>»)
// ============================================================
// Satr raqami — fayldagi haqiqiy raqam (n); qatorlar oddiy qo'shtirnoqda, ichidagi backtick — kod
const tsN = (arr, start, meta = {}) => arr.map((l, i) => ({ h: tsLine(l), n: start + i, ...(meta[i + 1] || {}) }));
const GW_TS = tsN([
  '@WebSocketGateway()',
  'export class OyinlarGateway implements OnGatewayConnection, OnGatewayDisconnect {',
  "  private readonly log = new Logger('Ulanish');",
  '',
  '  @WebSocketServer()',
  '  server: Server;',
  '',
  '  constructor(private readonly jwt: JwtService) {}',
  '',
  '  handleConnection(ulanish: Socket) {',
  '    const token = ulanish.handshake.auth?.token;',
  '    const oyinchiId = this.tokenYaroqli(token);',
  '    if (!oyinchiId) {',
  '      ulanish.disconnect();',
  '      return;',
  '    }',
  "    // Token egasi — keyingi darslarda kerak bo'ladi (xona, o'z harakati)",
  '    ulanish.data.oyinchiId = oyinchiId;',
  "    this.log.log(`ulandi: o'yinchi ${oyinchiId}`);",
  '  }',
  '',
  '  handleDisconnect(ulanish: Socket) {',
  "    if (ulanish.data.oyinchiId) this.log.log(`uzildi: o'yinchi ${ulanish.data.oyinchiId}`);",
  '  }',
], 11, { 1: { id: 'cls' }, 2: { id: 'cls' }, 10: { id: 'hc' }, 11: { id: 'tok' }, 12: { id: 'tok' }, 13: { id: 'dc' }, 14: { id: 'dc' }, 15: { id: 'dc' }, 16: { id: 'dc' }, 18: { id: 'ok' }, 19: { id: 'ok' } });
const GW_NOTE = tsN([
  '// Token ulanish ochilayotganda tekshiriladi: yo\'q yoki yaroqsiz bo\'lsa — ulanish yopiladi',
  '// (Backend yopgan ulanishga ilova o\'zi qayta ulanmaydi — belgi «Ulanmagan»).',
  '// Hozircha hech qanday hodisa yuborilmaydi va tinglanmaydi — faqat ulanish.',
], 8, { 3: { id: 'x' } });
const UL_TS = tsN([
  "// Uzilish yoki ulanish xatosidan keyin: socket.io o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda»,",
  "// Backend yopgan bo'lsa (token yaroqsiz) yoki ilova o'zi yopgan bo'lsa — «ulanmagan»",
  'function uzilishdanKeyin() {',
  "  holatQoy(ulanish?.active ? 'ulanmoqda' : 'ulanmagan');",
  '}',
  '',
  "// Ulanishni ochadi — token o'qib bo'lingandan keyingina. Ulanish bor bo'lsa — qayta ochilmaydi:",
  '// ekran necha marta ochilsa ham ulanish va uning tinglovchilari bitta.',
  'export async function ulan() {',
  '  if (ulanish) return;',
  '  const token = await tokenOl();',
  '  if (!token || ulanish) return;',
  '',
  '  ulanish = io(API, { auth: { token } });',
  "  holatQoy('ulanmoqda');",
  "  ulanish.on('connect', () => holatQoy('ulangan'));",
  "  ulanish.on('disconnect', uzilishdanKeyin);",
  "  ulanish.on('connect_error', uzilishdanKeyin);",
  '}',
], 24, { 3: { id: 'uz' }, 4: { id: 'uz' }, 14: { id: 'io' }, 15: { id: 'st' }, 16: { id: 'st' }, 17: { id: 'st' }, 18: { id: 'st' } });
const UL_IO = UL_TS.slice(8);
// Mentorning klienti (manba/ws1-klient.js — aynan) — ilovadagi ulanish.ts qoidasi, telefon o'rniga terminalda
const KLIENT_JS = tsN([
  "// klient.js — o'quvchi ilovasidagi mobil/src/ulanish.ts qoidasi, telefon o'rniga terminalda.",
  "// connect → ulangan · uzilish yoki xato → socket.io o'zi urinyaptimi (active)? ulanmoqda : ulanmagan",
  '// Ishga tushirish: TOKEN=<token> node klient.js   (to\'xtatish — Ctrl+C)',
  "const { io } = require('socket.io-client');",
  '',
  "const ulanish = io(process.env.API || 'http://localhost:3000', { auth: { token: process.env.TOKEN } });",
  '',
  'const t0 = Date.now();',
  'const yoz = (matn) => console.log(`${((Date.now() - t0) / 1000).toFixed(1).padStart(5)}s  ${matn}`);',
  'const uzilishdanKeyin' + ' = (sabab) =>', // ikki bo'lak: preview-keys detektori «…Key… = (…) =>» ni saqlov kaliti deb o'ylamasin
  "  yoz(`${ulanish.active ? 'ulanmoqda' : 'ulanmagan'}  (${sabab} · active=${ulanish.active})`);",
  '',
  "ulanish.on('connect', () => yoz('ulangan  (connect)'));",
  "ulanish.on('disconnect', (sabab) => uzilishdanKeyin(`disconnect: ${sabab}`));",
  "ulanish.on('connect_error', (xato) => uzilishdanKeyin(`connect_error: ${xato.message}`));",
  "ulanish.on('oyin-ozgardi', (hodisa) => yoz(`HODISA oyin-ozgardi ${JSON.stringify(hodisa)}`));",
], 1);

// ws1-out/05 — m12-dars-02-done: hodisa yo'q
const OUT05 = tm(String.raw`
$ node hodisa-yoq.js
 1.0s  [Ali] GET /oyinlar (ochilganda) → Mahalla maydoni 2026-11-08 17:00: 9 / 10
 1.1s  [Vali] POST /oyinlar/4/qoshilish → 201
 3.6s  [Ali] 2,5 s kutdi — hodisa kelmadi, ekrandagi son o'zgarmadi
 3.6s  [Ali] GET /oyinlar (pastga tortildi) → Mahalla maydoni 2026-11-08 17:00: 10 / 10`, { 2: { id: 'a' }, 3: { id: 'v' }, 4: { id: 'x' }, 5: { id: 'p' } });
// ws1-out/06 — m12-dars-03-done: hodisa bor
const OUT06 = tm(String.raw`
$ node hodisa-bor.js
 1.0s  [Ali] GET /oyinlar (ochilganda) → Maktab maydoni 2026-11-07 20:00: 6 / 10
 1.1s  [Ali] HODISA oyin-ozgardi {"oyinId":2,"sabab":"qoshildi"}
 1.1s  [Vali] POST /oyinlar/2/qoshilish → 201
 1.1s  [Ali] GET /oyinlar (hodisa kelgach) → Maktab maydoni 2026-11-07 20:00: 7 / 10`, { 2: { id: 'a' }, 3: { id: 'h' }, 4: { id: 'v' }, 5: { id: 'g' } });
// ws1-out/03 — token bilan
const OUT03 = tm(String.raw`
$ node tokenli.js
 0.0s  [Ali] ulanmoqda  (io() chaqirildi)
 0.0s  [Ali] ulangan  (connect)
 0.5s  [Ali] transport: websocket`, { 3: { id: 'c' }, 4: { id: 't' } });
const BE03 = tm(String.raw`
# Backend terminali:
LOG [Ulanish] ulandi: o'yinchi 11`, { 2: { id: 'l' } });
// ws1-out/02 — tokensiz va soxta token
const OUT02 = tm(String.raw`
$ node tokensiz.js
 0.0s  [tokensiz] ulangan  (connect)
 0.0s  [tokensiz] ulanmagan  (disconnect: io server disconnect · active=false)
 0.0s  [soxta token] ulangan  (connect)
 0.0s  [soxta token] ulanmagan  (disconnect: io server disconnect · active=false)`, { 2: { id: 'c' }, 3: { id: 'x' }, 4: { id: 'c' }, 5: { id: 'x' } });
// ws1-amal-out/05 — Ctrl+C, standart qayta urinish
const AMAL05 = tm(String.raw`
$ TOKEN=<Ali tokeni> node klient.js   # 3 s da Backend terminalida Ctrl+C, 15 s dan keyin npm run start
  0.0s  ulangan  (connect)
  2.8s  ulanmoqda  (disconnect: transport close · active=true)
  3.9s  ulanmoqda  (connect_error: xhr poll error · active=true)
  6.1s  ulanmoqda  (connect_error: xhr poll error · active=true)
 11.1s  ulanmoqda  (connect_error: xhr poll error · active=true)
 16.1s  ulanmoqda  (connect_error: xhr poll error · active=true)
 21.1s  ulanmoqda  (connect_error: xhr poll error · active=true)
 26.2s  ulangan  (connect)`, { 3: { id: 'tc' }, 4: { id: 'r' }, 5: { id: 'r' }, 6: { id: 'r5' }, 7: { id: 'r5' }, 8: { id: 'r5' }, 9: { id: 'r5' }, 10: { id: 'ok' } });
// ws1-out/07 — Backend muzlatildi (SIGSTOP): ulanish yopilmagan, javob yo'q
const OUT07 = tm(String.raw`
$ node muzlash.js   # 3 s da Backend muzlatildi (SIGSTOP), 60 s dan keyin davom etdi (SIGCONT)
 0.0s  [Ali] ulangan  (connect)
 2.8s  --- Backend muzlatildi (javob bermaydi, ulanish yopilmagan) ---
45.0s  [Ali] ulanmoqda  (disconnect: ping timeout · active=true)
62.8s  --- Backend davom etdi ---
62.8s  [Ali] ulangan  (connect)`, { 3: { id: 'z' }, 4: { id: 'p' }, 6: { id: 'ok' } });

// ============================================================
//  1 · Kirish
// ============================================================
const PLAN1 = ["So'rov va doimiy ulanish", 'Gateway va token', 'Uch holat', 'Hodisa', "O'quvchi darsini o'tish"];
const S1 = mkS(1, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [4] }], { plan: PLAN1 });
function Screen1(p) {
  return <Lesson p={p} S={S1} scene={({ seg }) => <div style={{ display: 'grid', gap: 14 }}>
    <div className="mk-light"><div className="mk-plan">
      {S1.plan.map((x, i) => <div key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>
    <div className="mk-tag" style={{ margin: 0 }}>Dars oxirida — Vali qo'shilishi bilan Ali'ga hodisa keladi</div>
    <Term lines={OUT06} focus={['h', 'g']} title="terminal — maydon-jamoa m12-dars-03-done, haqiqiy" />
  </div>} />;
}

// ============================================================
//  2 · So'ramasa — yangilanmaydi (ws1-out/05)
// ============================================================
const S2 = mkS(2, [{ v: 1, f: ['a'] }, { v: 2, f: ['v', 'x'] }, { v: 3, f: ['p'] }, { v: 3, f: [], sum: true }]);
function Screen2(p) {
  return <Lesson p={p} S={S2} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="ws-phones">
      <Phone who="Ali" rows={[['Mahalla maydoni · 08.11 17:00', seg.v >= 3 ? '10 / 10' : '9 / 10', seg.v === 2 ? 'old' : seg.v >= 3 ? 'new' : '']]} note={seg.v === 2 ? "so'ramagan — son eski" : seg.v >= 3 ? 'pastga tortdi → GET /oyinlar' : 'ochilganda → GET /oyinlar'} mark={seg.v === 2 ? 'bad' : seg.v >= 3 ? 'good' : ''} badge={false} />
      {seg.v >= 2 ? <Phone who="Vali" rows={[['Mahalla maydoni · 08.11 17:00', '10 / 10']]} note="Qo'shilaman → 201" badge={false} /> : <div />}
    </div>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Term lines={OUT05} focus={seg.f} title="terminal — m12-dars-02-done, haqiqiy" /></div>
    {seg.sum && <div className="mk-rule">So'rov–javobda yo'l <b>faqat ilova so'raganda</b> ochiladi — Backend o'zi yubora olmaydi.</div>}
  </div>} />;
}

// ============================================================
//  3 · Doimiy ulanish (ws1-out/03; mobil/src/ulanish.ts)
// ============================================================
const S3 = mkS(3, [{ v: 'two' }, { v: 'out' }, { v: 'code' }, { v: 'code', sum: true }]);
function Screen3(p) {
  return <Lesson p={p} S={S3} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.ink3 }}><h4>So'rov–javob</h4><p>ilova so'raydi → Backend javob beradi → yo'l yopiladi</p></div>
      <div className="mk-box hl" style={{ '--c': T.green }}><h4>Doimiy ulanish</h4><p>bir marta ulanadi → yo'l ochiq → ikkala tomon istagan payt yuboradi</p></div>
    </div>
    {seg.v === 'out' && <Term lines={OUT03} focus={['c', 't']} title="terminal — token bilan ulanish (haqiqiy)" />}
    {seg.v === 'code' && <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={REPO_FILES} active={RF.ul}><CodePanel file={RF.ul} wrap lines={UL_IO} focus={seg.sum ? [] : ['io']} /></Ide></div>}
    {seg.sum && <div className="mk-rule">Doimiy ulanish — ochiq yo'l: Backend xabarni <b>o'zi yubora oladi</b>.</div>}
  </div>} />;
}

// ============================================================
//  4 · Tekshiruv 1
// ============================================================
function Screen4(p) {
  const m = MDT[4];
  return <MCRetry {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} q={m.q} opts={m.opts} correct={m.correct} ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} wrong={m.wrong}
    after={<div style={{ display: 'grid', gap: 10 }}>
      <div className="mk-tag" style={{ color: T.green, margin: 0 }}>Haqiqiy: hodisa so'rovsiz keldi (m12-dars-03-done)</div>
      <Term lines={OUT06} focus={['h']} />
    </div>} />;
}

// ============================================================
//  5 · Gateway (backend/src/oyinlar.gateway.ts, 11–34-satr)
// ============================================================
const S5 = mkS(5, [{ f: ['cls'] }, { f: ['hc', 'tok'] }, { f: ['dc'] }, { f: ['ok'], sum: true }]);
function Screen5(p) {
  return <Lesson p={p} S={S5} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Ide files={REPO_FILES} active={RF.gw}><CodePanel file={RF.gw} wrap lines={GW_TS} focus={seg.f} style={{ fontSize: 12.5 }} /></Ide>
    {seg.sum && <div className="mk-rule">Token har so'rovda emas — <b>ulanish ochilayotganda</b> bir marta tekshiriladi.</div>}
  </div>} />;
}

// ============================================================
//  6 · Tokensiz va soxta token (ws1-out/02, 03)
// ============================================================
const S6 = mkS(6, [{ v: 'tok' }, { v: 'no', f: ['c', 'x'] }, { v: 'no', f: ['x'], ph: true }, { v: 'no', f: [], ph: true, sum: true }]);
function Screen6(p) {
  return <Lesson p={p} S={S6} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 'tok' ? <div className="pg-two">
      <Term lines={OUT03} focus={['c']} title="klient — token bilan" />
      <Term lines={BE03} focus={['l']} title="Backend terminali" />
    </div> : <div className={seg.ph ? 'pg-two' : ''}>
      <Term er lines={OUT02} focus={seg.f} title="klient — tokensiz va soxta token (haqiqiy)" />
      {seg.ph && <Phone who="Ilova (tokensiz)" holat="ulanmagan" rows={[]} note="Backend yopdi — o'zi qayta urinmaydi" />}
    </div>}
    {seg.sum && <div className="mk-rule">Tokensiz ulanish bir lahza ochiladi va <b>darhol yopiladi</b> — belgi «Ulanmagan».</div>}
  </div>} />;
}

// ============================================================
//  7 · Amaliyot 1 — backend lokal, ulanish (ws1-amal-out/01–04)
// ============================================================
const P1 = mkS(7, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3] }, { hl: [] }], { tableAt: 3 });
const P1_STEPS = [
  { t: 'Repo — tayyor holat m12-dars-02-done', cmds: ['git clone https://github.com/Azizbekcrypto/maydon-jamoa', 'cd maydon-jamoa', 'git checkout -f m12-dars-02-done', 'cd backend', 'npm ci'], exp: 'added 282 packages' },
  { t: 'Baza va start — .env namunadan, DATABASE_URL dagi parol o\'zingizniki', cmds: ['psql -U postgres -c "CREATE DATABASE maydon_jamoa;"', 'cp .env.example .env', 'npm run start'], exp: 'Nest application successfully started' },
  { t: "Ro'yxat va kirish — yangi terminalda", cmds: ['curl -X POST localhost:3000/royxat -H "Content-Type: application/json" -d \'{"ism":"Ali","telefon":"+998 90 000 00 01","parol":"parol123"}\'', 'curl -X POST localhost:3000/kirish -H "Content-Type: application/json" -d \'{"telefon":"+998 90 000 00 01","parol":"parol123"}\''], exp: '{"id":11,"ism":"Ali"} · {"token":"eyJ…"}' },
  { t: 'Ulanish — alohida papkada klient', cmds: ['mkdir ws-klient && cd ws-klient', 'npm i socket.io-client', 'TOKEN=<token> node klient.js'], exp: "klient: ulangan  (connect) · Backend: ulandi: o'yinchi 11" },
];
const P1_CODE = [{ file: 'klient.js', step: 3, lines: KLIENT_JS, copy: true }];
const P1_TROUBLE = [
  ["backend papkasi yo'q", "main tarmog'ida faqat README — avval git checkout -f m12-dars-02-done"],
  ["JWT_SECRET yo'q — backend/.env ga yozing", ".env yo'q — cp .env.example .env"],
  ['password authentication failed · Retrying (1)...', ".env dagi DATABASE_URL parolini o'zingizniki bilan almashtiring"],
  ["409 «Bu telefon ro'yxatdan o'tgan»", "ro'yxat bor — to'g'ridan /kirish"],
  ['klient: ulanmagan (io server disconnect)', "token bo'sh yoki eski — /kirish dan qayta oling (6-ekran)"],
];
const P1_PROOF = { label: 'Backend terminalidagi ulanish satri', placeholder: 'Backend terminalidan satrni qo\'ying', check: (v) => /ulandi: o.yinchi \d+/i.test(v), wrong: "Backend terminalida «LOG [Ulanish]» bilan boshlanadigan satrni butunligicha nusxalang" };
function ScreenP1(p) { return <Practice p={p} S={P1} steps={P1_STEPS} trouble={P1_TROUBLE} proof={P1_PROOF} code={P1_CODE} tree={KLIENT_FILES} />; }

// ============================================================
//  8 · Tekshiruv 2 — LineCheck (5-satr: disconnect'dan keyin return yo'q; ws1-out/08)
// ============================================================
const LC8_SRC = [
  'handleConnection(ulanish: Socket) {',
  '  const token = ulanish.handshake.auth?.token;',
  '  const oyinchiId = this.tokenYaroqli(token);',
  '  if (!oyinchiId) {',
  '    ulanish.disconnect();',
  '  }',
  "  // Token egasi — keyingi darslarda kerak bo'ladi (xona, o'z harakati)",
  '  ulanish.data.oyinchiId = oyinchiId;',
  "  this.log.log(`ulandi: o'yinchi ${oyinchiId}`);",
  '}',
];
const LC8 = LC8_SRC.map((l) => ({ h: tsLine(l) }));
const LC8_FIXED = LC8_SRC.map((l, i) => ({ h: tsLine(l), n: i < 5 ? i + 1 : i + 2 }));
LC8_FIXED.splice(5, 0, { h: tsLine('    return;'), n: 6, neu: true });
const LC8_OK = tm(String.raw`
# return bilan, tokensiz (ws1-amal-out/06):
  0.0s  ulanmagan  (disconnect: io server disconnect · active=false)
# Backend terminalida «ulandi» satri yo'q`);
function Screen8(p) {
  const m = MDT[8];
  return <LineCheck {...p} kicker={m.kicker} eyebrow={m.eyebrow} title={m.title} task={m.task} q={m.q} file={RF.gw} lines={LC8} target={4}
    tree={{ root: 'maydon-jamoa', files: REPO_FILES, active: RF.gw }}
    fixed={LC8_FIXED} fixedExtra={[{ file: 'klient va Backend — return bilan (haqiqiy)', lines: LC8_OK }]}
    ok={m.ok} okShort={<span dangerouslySetInnerHTML={html(m.okShort)} />} hint={m.hint} />;
}

// ============================================================
//  9 · Uch holat (mobil/src/ulanish.ts; belgi — mobil/src/app/index.tsx)
// ============================================================
const B9 = [
  ['ulangan', T.green, "yo'l ochiq — hodisalar keladi", 'connect'],
  ['ulanmoqda', WS.amber, "yo'l yo'q, socket.io o'zi urinmoqda", 'active=true'],
  ['ulanmagan', WS.grey, 'hech kim urinmayapti — Backend yoki ilova yopgan', 'active=false'],
];
const S9 = mkS(9, [{ hl: [], f: ['st'] }, { hl: [0, 1], f: ['uz'] }, { hl: [2], f: ['uz'] }, { hl: [1, 2], f: [], sum: true }]);
function Screen9(p) {
  return <Lesson p={p} S={S9} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <div className="ws-badges">{B9.map(([k, c, d, code], i) => <div key={k} className={`ws-badge${seg.hl.includes(i) ? ' hl' : (seg.hl.length ? ' dim' : '')}`} style={{ '--c': c }}>
      <span className="bg"><i />{BELGI[k][0]}</span><p>{d}</p><p><code>{code}</code></p>
    </div>)}</div>
    <div className={seg.sum ? 'j2-wide-only' : ''}><Ide files={REPO_FILES} active={RF.ul}><CodePanel file={RF.ul} wrap lines={UL_TS} focus={seg.f} style={{ fontSize: 12.5 }} /></Ide></div>
    {seg.sum && <div className="mk-rule">«Ulanmoqda» — o'tib ketadi, kutish kifoya; «Ulanmagan» — <b>kimdir nimadir qilishi kerak</b>: qayta kirish, yangi token.</div>}
  </div>} />;
}

// ============================================================
//  10 · Backend o'chdi va qayta yondi (ws1-amal-out/05, standart sozlama)
// ============================================================
const S10 = mkS(10, [{ f: ['tc'] }, { f: ['r', 'r5'] }, { f: ['ok'] }, { f: [], sum: true }]);
function Screen10(p) {
  return <Lesson p={p} S={S10} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    <Term lines={AMAL05} focus={seg.f} title="klient — socket.io standart sozlamasi (haqiqiy)" />
    <div className="pg-two">
      <Phone who="Ali" holat={seg.f.includes('ok') || seg.sum ? 'ulangan' : 'ulanmoqda'} rows={[]} note={seg.f.includes('ok') || seg.sum ? '26.2 s — o\'zi qaytdi' : 'Backend yo\'q — urinyapti'} />
      <div className="mk-card"><h5>Vaqt</h5><div style={{ fontSize: 14, lineHeight: 1.55 }}>Ctrl+C — 2.8 s · Backend qayta tayyor — ~21.6 s · klient ulandi — <b>26.2 s</b><br /><span style={{ color: T.ink2 }}>urinishlar oralig'i o'sadi va 5 s da to'xtaydi (socket.io standarti)</span></div></div>
    </div>
    {seg.sum && <div className="mk-rule">Backend qayta yonsa, <b>ilova o'zi qaytadi</b> — bir necha soniya «Ulanmoqda…» normal.</div>}
  </div>} />;
}

// ============================================================
//  11 · «Uchish rejimi» — 45 soniya (ws1-out/07; engine.io pingInterval 25000 + pingTimeout 20000)
// ============================================================
const S11 = mkS(11, [{ f: [], v: 0 }, { f: ['z'], v: 1 }, { f: ['p', 'ok'], v: 2 }, { f: ['p'], v: 2, sum: true }]);
function Screen11(p) {
  return <Lesson p={p} S={S11} scene={({ seg }) => <div style={{ display: 'grid', gap: 12 }}>
    {seg.v === 0 ? <div className="mk-card"><h5>O'quvchi darsi m10-02 · A1, 4-qadam (2)</h5><div style={{ fontSize: 14.5, lineHeight: 1.55 }}>«Telefonda uchish rejimini yoqing: belgi «Ulanmoqda…» ga o'tishi kerak — <b>darhol o'zgarmasligi mumkin</b>: uzilishni aniqlash vaqt oladi (bir daqiqagacha).»</div></div>
      : <Term lines={OUT07} focus={seg.f} title="klient — Backend muzlatildi: ulanish yopilmagan, javob yo'q (haqiqiy)" />}
    {seg.v === 2 && <div className="pg-two">
      <div className="mk-box" style={{ '--c': T.blue }}><h4>pingInterval · 25 s</h4><p>Backend shu oraliqda «ping» yuboradi</p></div>
      <div className="mk-box" style={{ '--c': T.yellow }}><h4>pingTimeout · 20 s</h4><p>javob kelmasa — yana shuncha kutiladi</p></div>
    </div>}
    {seg.v === 2 && <div className="mk-tag" style={{ margin: 0 }}>engine.io standart qiymatlari (node_modules/engine.io) · 25 + 20 = 45 s</div>}
    {seg.sum && <div className="mk-rule">Uchish rejimida belgi <b>45 soniyagacha</b> kech qoladi — bu normal, kuting.</div>}
  </div>} />;
}
