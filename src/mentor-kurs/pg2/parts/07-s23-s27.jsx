
// ============================================================
//  24 · m4-06 xaritasi
// ============================================================
const MAP06 = [
  { t: 'Kirish', s: 's0–s1', d: "«mahsulotlar qayerda saqlanadi?» → baza · reja (5 qadam)", m: '' },
  { t: 'CRUD', s: 's2–s9', d: "jadval chizmasi · INSERT · SELECT · WHERE · UPDATE (WHERE'siz ogohlantirish) · DELETE · 3 test", m: "javobdagi son (5-ekran) · BEGIN … ROLLBACK (8-ekran) · ORDER BY" },
  { t: 'Menejer navbati', s: 's10', d: "to'rt hodisa → to'g'ri buyruq", m: '' },
  { t: 'AI bilan', s: 's11–s14', d: "vazifa → SQL → tekshir · test · users jadvali · AI xatosi product", m: 'HINT ham adashadi (11-ekran)' },
  { t: 'Yakun', s: 's15–s16', d: "o'z INSERT'i · amaliyot: VS Code yoki PostgreSQL terminalida AI bilan o'z do'koni jadvali + CRUD · kartochkalar", m: "apostrof (11-ekran) · NOT NULL maslahati (12-ekran)" },
];
const S23 = mkS(24, [{ hl: [] }, { hl: [1] }, { hl: [3] }, { hl: [4] }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <div style={{ display: 'grid', gap: 8 }}>
    {MAP06.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
      <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{b.m && (seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>Siz qo'shasiz: {b.m}</div>}</div>
    </div>)}
    <div className="n2-warn">Amaliyotda o'quvchi <b>haqiqiy psql</b>'da ishlaydi — har kompyuterda PostgreSQL ishlab turishi shart (PostgreSQL-1, sinf ro'yxati).</div>
  </div>} />;
}

// ============================================================
//  25 · m4-08 xaritasi va farqlar
// ============================================================
const MAP08 = ['kirish — kod ichidagi ro\'yxat', 'reja va tayyorgarlik (psql -U postgres, Gemini)', 'Amaliyot 1 · cars jadvali — o\'zingiz, psql', 'Amaliyot 2 · server.js GET — Gemini', 'Amaliyot 3 · POST, PUT, DELETE — Gemini, Postman', 'Amaliyot 4 · AI xatosi: price → daily_price', 'test', 'podium', 'yakun'];
const DIFF08 = [
  ["Xato matni qisqartirilgan", 'darsda: column "price" does not exist · haqiqiysi: … of relation "cars" does not exist'],
  ['Gemini kodi har kimda boshqacha', "promptdagi talablarni tekshiring ($1, 201, express.json), satrma-satr bir xillikni emas"],
  ['is_rented — null', "POST'da berilmaydi, DEFAULT yo'q"],
  ['Port band — «ishlayapti»', "Express 5: ikkinchi server xato bermay chiqadi, eski server javob beradi — bitta terminal, Ctrl+C"],
];
const S24 = mkS(25, [{ v: 'map', d: [] }, { v: 'diff', d: [0, 1] }, { v: 'diff', d: [2, 3] }, { v: 'diff', d: [0, 1, 2, 3], sum: true }]);
function Screen24(p) {
  return <Lesson p={p} S={S24} scene={({ seg }) => <>
    {seg.v === 'map' && <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">m4-08 · 9 ekran</div>
      <div className="mk-plan">{MAP08.map((x, i) => <div key={i} className={i >= 2 && i <= 5 ? 'hl' : ''}><b>{String(i + 1).padStart(2, '0')}</b><span>{x}</span></div>)}</div></div>}
    {seg.v === 'diff' && <div style={{ display: 'grid', gap: 8 }}>{DIFF08.map(([h, d], i) => <div key={i} className={`mk-step${seg.d.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.d.includes(i) ? 1 : 0.45 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span><div className="t"><b>{h}</b><div style={{ fontSize: 13 }}>{d}</div></div></div>)}</div>}
    {seg.sum && <div className="mk-rule">m4-08 dan oldin: <b>sinf paroli</b> hammaga ma'lum · <b>Postman</b> o'rnatilgan · qoida — <b>bitta loyiha, bitta terminal</b></div>}
  </>} />;
}

// ============================================================
//  26 · Sinfdagi holatlar va o'quvchi savollari
// ============================================================
const STUMBLE25 = [
  ['Jadval/ustun nomi', 'relation "product" · column "narx" (+ HINT)', '\\d jadval bilan solishtirish'],
  ['Apostrof', 'syntax error at or near "yinchoq"', "''"],
  ["WHERE'siz", 'UPDATE 3 / DELETE 3', "BEGIN … ROLLBACK; o'chgan bo'lsa — qayta INSERT"],
  ['Parol/baza', 'password authentication failed · client password must be a string · database … does not exist', 'Pool sozlamalari, sinf paroli'],
  ["Bo'sh xato", '{"error":""}', "console.error(err) → ECONNREFUSED → PostgreSQL'ni ishga tushiring"],
  ["O'zgarmadi", 'javob eski', 'ikkinchi terminal; Ctrl+C'],
];
const QA25 = [
  ["«Nega mahsulot o'rni o'zgardi?»", 'ORDER BY yo\'q — tartib kafolatlanmaydi; ORDER BY id.'],
  ['«$1 nima?»', "qiymat alohida beriladi, SQL matniga kirmaydi; 1 OR 1=1 misoli (16-ekran)."],
  ['«Postman shartmi?»', "yo'q, so'rov yuboradigan istalgan dastur; darsda Postman, chunki sinf uchun qulay."],
  ["«NestJS'da ham shunday yozamizmi?»", "yo'q: Nest'da Repository bu so'rovlarni o'zi yozadi (find, save…). Xavotir olmang: buni kursdagi keyingi mentor darslarida to'liq, kodi bilan o'rganasiz."],
  ['«SQL katta harfda yozilishi shartmi?»', "yo'q, kalit so'zlar kichik harfda ham ishlaydi (sinab ko'rdik: select … from PRODUCTS); katta harf — o'qish oson bo'lishi uchun odat."],
];
const S25 = mkS(26, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [5], qa: true }]);
function Screen25(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S25} scene={({ seg }) => <>
    <div className="mk-qa">
      {STUMBLE25.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></button>)}
    </div>
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>Javobni aytmang — <b>xabarni o'quvchi bilan birga o'qing</b>: jadval/ustun nomi, status, terminal.</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">O'quvchi so'rasa — bosing</div>
      <div className="pg-qa">{QA25.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}

// ============================================================
//  27 · O'z-sinov — 8 savol (Nest/PG-1 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = MDT[27].final;
function Screen26(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol, ulardan ikkitasi sinfdagi holatlar bo'yicha. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
      : sc >= 6
        ? "Natijangiz saqlangan: sakkizdan " + ['nol', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz'][sc] + ". Dars o'zlashtirilgan, Davom bosing."
        : "Yaxshi, bir xatoyingizni ko'rib chiqdingiz. Qolgan qizil savollarning ekranlariga ham qayting. Tayyor bo'lgach, Sinovni qayta topshirish tugmasini bosing.";
    return p.review ? [] : [{ id: 'intro', text: voice(text), trigger: 'on_mount' }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const audio = useAudio(segs);
  const sfx = useSfx();
  const [i, setI] = useState(st.i || 0);
  const [res, setRes] = useState(st.res || []);
  const [attempt, setAttempt] = useState(st.attempt || 1);
  const [showResult, setShowResult] = useState(!!st.showResult);
  const q = FINAL[i];
  const picked = res[i] ? res[i].picked : null;
  const score = res.filter((x) => x && x.correct).length;
  const finished = res.filter(Boolean).length === FINAL.length;
  const save = (patch) => p.onAnswer({ type: 'final', i, res, attempt, showResult, score, total: FINAL.length, ...patch });
  const pick = (k) => {
    if (picked !== null) return;
    audio.triggerEvent('option_picked');
    const r = [...res]; r[i] = { picked: k, correct: k === q.c }; setRes(r);
    if (k === q.c) sfx.playCorrect(); else sfx.playWrong();
    const sc = r.filter((x) => x && x.correct).length; save({ res: r, score: sc });
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi m4-06 va m4-08 dagi xatolar sinfda sizga tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
  };
  const next = () => { if (i < FINAL.length - 1) { setI(i + 1); save({ i: i + 1 }); } else { setShowResult(true); save({ showResult: true }); } };
  const retake = () => { setRes([]); setI(0); setShowResult(false); setAttempt(attempt + 1); save({ res: [], i: 0, showResult: false, attempt: attempt + 1, score: 0 }); };
  return (
    <Stage kicker="O'z-sinov" idx={p.idx} total={p.total} audio={audio} onBack={p.onBack} onNext={p.onNext} onRestart={p.onRestart} nextReady={finished && showResult} nextDisabled={!(finished && showResult)} lockHint={!finished ? 'Savollarga javob bering' : 'Natijani oching'}>
      <div className="mk-body" style={{ gridTemplateColumns: '1fr', maxWidth: 980, width: '100%', margin: '0 auto' }}>
        <div className="mk-say mc" style={{ overflow: 'auto', paddingRight: 4 }}>
          {showResult ? (<>
            <p className="mk-eyebrow">O'z-sinov · natija{attempt > 1 ? ` · ${attempt}-urinish` : ''}</p>
            <h2 className="mk-title mc-q" style={{ fontSize: 'clamp(22px,1.9vw,26px)' }}>{score} / {FINAL.length} — {score >= 6 ? "dars o'zlashtirildi" : "yana bir ko'rib chiqing"}</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {FINAL.map((f, k) => <div key={k} className="mk-card" style={{ display: 'flex', gap: 12, alignItems: 'center', borderColor: res[k] && res[k].correct ? T.green : T.accent }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: res[k] && res[k].correct ? T.green : T.accent, minWidth: 22 }}>{res[k] && res[k].correct ? '✓' : '✗'}</span>
                <span style={{ flex: 1, fontSize: 14 }}>{f.q}</span>
                {res[k] && !res[k].correct && p.onGoto && <button className="mk-btn soft sm" onClick={() => p.onGoto(f.s - 1)}>{f.s}-ekran</button>}
              </div>)}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, flexWrap: 'wrap' }}>
              {score < 6 && <button className="mk-btn ghost" onClick={retake}>Sinovni qayta topshirish</button>}
              <span style={{ color: T.ink2, fontSize: 14 }}>Ekranga qaytib «Davom» bossangiz, shu natijaga qaytasiz.</span>
            </div>
          </>) : (<>
            <p className="mk-eyebrow">O'z-sinov · {i + 1} / {FINAL.length} · bitta urinish · to'g'ri: {score}</p>
            <h2 className="mk-title mc-q">{q.q}</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {q.o.map((o, k) => { let cls = 'mk-opt'; if (picked !== null) { if (k === q.c) cls += ' ok'; else if (k === picked) cls += ' bad'; else cls += ' off'; } return <button key={k} className={cls} disabled={picked !== null} onClick={() => pick(k)}><span className="l">{String.fromCharCode(65 + k)}</span><span>{o}</span></button>; })}
            </div>
            {picked !== null && <div className="mk-fb" style={{ '--c': picked === q.c ? T.green : T.accent, '--bg': picked === q.c ? '#E3F5EC' : '#FFF0EB' }}><b>{picked === q.c ? "To'g'ri" : "Noto'g'ri — to'g'risi yashil"}</b><span>{q.e}</span></div>}
            {picked !== null && <div style={{ marginTop: 14 }}><button className="mk-btn ready" onClick={next}>{i < FINAL.length - 1 ? 'Keyingi savol →' : "Natijani ko'rish →"}</button></div>}
          </>)}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  28 · Yakun (M13)
// ============================================================
const SUM27 = [
  { k: 'crud', t: 'CRUD = INSERT · SELECT · UPDATE · DELETE; javobdagi son — nechta qator tegildi; ORDER BY siz tartib kafolatlanmaydi', st: ['psql'] },
  { k: 'where', t: "WHERE'siz — hamma qator; xavfli so'rov BEGIN … ROLLBACK ichida sinaladi", st: ['psql', 'jad'] },
  { k: 'err', t: "Xatolar: nom (\\d), apostrof (''), son o'rniga matn; NOT NULL yo'q — baza qo'riqlamaydi", st: ['jad'] },
  { k: 'exp', t: 'Express: Pool → pool.query(sql, [$1…]) → rows → res.json; 200 · 201 · 404 · 500', st: ['pm', 'srv', 'pool'] },
  { k: 'brk', t: "Server xatolari: ustun nomi · express.json() · parol/baza birinchi so'rovda · bo'sh xabar → console.error(err) · ikkinchi server «ishlayapti»", st: ['srv', 'pool'] },
  { k: 'class', t: "Sinf: m4-06 amaliyoti haqiqiy PostgreSQL terminalida; m4-08 dan oldin parol, Postman, bitta terminal", st: ['pm', 'psql'] },
];
const STATIONS27 = [['pm', 'Postman', '#FF6C37'], ['srv', 'Express', T.ink], ['pool', 'Pool · $1', T.purple], ['psql', 'SQL', T.accent], ['jad', 'Jadval', PG.pg]];
function SummaryMap27({ hl }) {
  const cur = SUM27.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — so'rovning bazagacha yo'li</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 6 }}>
      {STATIONS27.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK27 = [
  { t: "Jadval: schema.sql — o'z do'koningiz jadvali, NOT NULL (nom, narx)", c: ['psql -U postgres -d <baza> -f schema.sql'] },
  { t: 'Server: server.js — GET · POST (201, RETURNING *) · PUT · DELETE (rowCount → 404), hamma qiymat $1 bilan', c: ['node server.js'] },
  { t: "Sinov: Postman'da 4 so'rov + yo'q id — 200 · 201 · 200 · 200 · 404", c: [] },
  { t: "Xavfsiz sinash: PostgreSQL terminalida BEGIN → WHERE'siz UPDATE → SELECT → ROLLBACK — README'ga UPDATE n va ROLLBACK", c: [] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "shop-api"', 'git push'] },
];
const CHEATSHEET27 = `# PostgreSQL-2 — mentor eslatmasi (CRUD va Express)
## CRUD (psql)
INSERT INTO products (name, price, stock) VALUES (…) → INSERT 0 n · SELECT * / SELECT name, price · WHERE price < 100000 · UPDATE … SET … WHERE id = 1 → UPDATE 1 · DELETE … WHERE id = 3 → DELETE 1
Javobdagi son: 1 — kutganingiz · 0 — WHERE hech narsaga mos kelmadi (xato emas) · katta son — WHERE noto'g'ri/yo'q
ORDER BY yo'q — tartib kafolatlanmaydi (UPDATE dan keyin qator oxiriga tushishi mumkin) → ORDER BY id
## Xavfsiz sinash
BEGIN; → xavfli UPDATE/DELETE → SELECT bilan ko'rish → ROLLBACK; (yoki COMMIT;) · prompt: =*# ochiq · =!# xato bo'ldi
## Sinfdagi SQL xatolari
relation "product" / column "narx" → \\d jadval bilan solishtirish (HINT ham adashadi) · 'arzon' → invalid input syntax for type integer · apostrof → '' (O''yinchoq) · ustun/qiymat soni → more target columns than expressions · NOT NULL yo'q → nomsiz qator xato bermay saqlanadi
## Express → baza
const { Pool } = require('pg') · new Pool({ user, password, database, host, port }) · pool.query(sql, [qiymatlar]) → result.rows / result.rowCount · res.json · GET 200 · POST 201 (RETURNING *) · PUT/DELETE 200 · rowCount 0 → 404 · catch → 500
Nega $1: yopishtirilgan '… WHERE id = ' + id + "1 OR 1=1" → hamma qator o'chdi; $1 bilan → 500 invalid input syntax, jadval joyida
## Server xatolari
column "price" of relation "cars" does not exist → kodda ustun nomi · Cannot destructure property 'model' of 'req.body' → app.use(express.json()) · password authentication failed → parol · client password must be a string → parol bo'sh (process.env) · database "…" does not exist → nom · {"error":""} → console.error(err) → ECONNREFUSED → PostgreSQL'ni ishga tushiring
Pool birinchi so'rovda ulanadi — «Server … ishlayapti» faqat Express haqida
Port band: Express 5 da ikkinchi server ham «ishlayapti» deb xato bermay chiqadi — eski server javob beradi → bitta terminal, Ctrl+C
## Sinf
m4-06: amaliyot haqiqiy PostgreSQL terminalida (AI bilan o'z do'koni) — har kompyuterda PostgreSQL; apostrof va NOT NULL maslahati
m4-08: sinf paroli, Postman, bitta terminal; darsdagi xato matni qisqa — haqiqiysida "of relation cars"; is_rented null — DEFAULT yo'q; Gemini kodi har xil
## Sizning uyga vazifangiz
shop-api: schema.sql (NOT NULL) + server.js (4 endpoint, $1, 404) + README (5 so'rov va javobi, BEGIN … ROLLBACK) → GitHub → repo linki platformadagi uyga vazifaga`;
const s27Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "CRUD — to'rt buyruq; <b>javobdagi son</b> nechta qator tegilganini aytadi", "Birinchi: CRUD to'rt buyruq, insert, select, update va delete. Javobdagi son nechta qator tegilganini aytadi, nol xato emas. Order by yozilmasa, tartib kafolatlanmaydi.", { hl: 'crud' }),
  sg('b2', "<b>WHERE'siz — hamma qator</b>; xavfli so'rov BEGIN … ROLLBACK ichida", "Ikkinchi: where'siz update yoki delete hamma qatorga tegadi. Xavfli so'rovni avval begin ichida sinang, select bilan ko'ring, keyin rollback yoki commit.", { hl: 'where' }),
  sg('b3', "SQL xatolarida <b>nomni jadval bilan</b> solishtiring; apostrof ikki marta", "Uchinchi: sinfdagi SQL xatolarida xabar ichidagi nomni teskari chiziqcha d bilan solishtiring, hint'ga ishonmang. Apostrof ikki marta yoziladi. Not null yozilmagan bo'lsa, baza qo'riqlamaydi.", { hl: 'err' }),
  sg('b4', "Express: <b>Pool → pool.query → rows → res.json</b>, qiymat doim $1 bilan", "To'rtinchi: Express'dan bazaga yo'l, Pool, pool query, rows va res json. Qiymatlar doim dollar bir bilan, yopishtirilgan so'rov butun jadvalni o'chirishi mumkin.", { hl: 'exp' }),
  sg('b5', "Server xatolarini <b>status, error va terminal</b> aytadi", "Beshinchi: server xatolari. Ustun nomi, express json, parol va baza birinchi so'rovda chiqadi. Xabar bo'sh bo'lsa, console error'ga butun xatoni bering. Ikkinchi server ham ishlayapti deydi, bitta terminal qoidasi.", { hl: 'brk' }),
  sg('b6', "Sinf: m4-06 amaliyoti <b>haqiqiy PostgreSQL terminalida</b>, m4-08 dan oldin parol va Postman", "Oltinchi, sinf uchun: m4-06 amaliyoti haqiqiy PostgreSQL terminalida, har kompyuterda PostgreSQL kerak. m4-08 dan oldin sinf paroli, Postman va bitta terminal qoidasi.", { hl: 'class' }),
  sg('hw', "<b>Uyga vazifa</b>: o'z do'koningiz uchun shop-api — jadval, server va README", "Uyga vazifa: o'z do'koningiz uchun shop api. Schema faylida o'z jadvalingiz, not null bilan. Server js'da to'rt endpoint, hamma qiymat dollar bir bilan, topilmasa to'rt yuz to'rt. README'da har endpoint uchun bitta so'rov va javobi.", { hl: 'hw' }),
  sg('hw2', "Bir marta xavfsiz sinang va <b>repo linkini platformaga</b> qo'ying", "Bir marta where'siz update'ni begin ichida sinab, rollback qiling va natijani README'ga yozing. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: CRUD, xavfsiz sinash, xatolar va server — bir sahifada", "Pastda bir sahifalik eslatma: CRUD, xavfsiz sinash, sinfdagi SQL xatolari, Express yo'li, server xatolari va ikki o'quvchi darsi tayyorgarligi. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen27(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET27;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'postgresql-2-mentor-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s27Segments(passed), [passed]);
  const b = useBeats(segments, p.review);
  const hl = b.seg.hl;
  const phase = hl === 'hw' ? 'hw' : hl === 'note' ? 'note' : 'sum';
  const shown = segments.slice(0, b.beat + 1).filter((s) => /^b\d/.test(s.id)).length;
  return (
    <Stage kicker="Yakun" idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onFinish} onRestart={p.onRestart} nextReady={b.done} nextDisabled={!b.done} nextLabel="Darsni yakunlash" lockHint="Ustoz gapirib bo'lgach ochiladi">
      <div className="mk-body">
        <Say title={passed ? 'Barakalla! Endi siz bilasiz' : 'Endi siz bilasiz'} segments={segments} beat={b.beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk} review={p.review} />
        <div className="mk-scene top" style={{ overflow: 'auto' }}>
          {phase === 'sum' && (<>
            <SummaryMap27 hl={hl} />
            <div className="mk-plan">{SUM27.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>Uyga vazifa · 40–60 daqiqa</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK27.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> NOT NULL · $1 (yopishtirish yo'q) · 404 · README'da 5 so'rov va ROLLBACK.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kursdagi keyingi mentor darsi</h5><div style={{ fontSize: 15, fontWeight: 700 }}>NestJS arxitekturasi — Module, Controller, Service</div><div style={{ fontSize: 13.5, color: T.ink2 }}>Express'dagi shu CRUD Nest'da qanday tartib bilan yoziladi</div></div>
          </div>}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  Muqova va ildiz
// ============================================================
function Cover({ onStart }) {
  return (
    <div className="mk-cover"><div className="card">
      <p className="mk-eyebrow">Mentor kursi · PostgreSQL</p>
      <h1>{LESSON_TITLE}</h1>
      <p>Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.</p>
      <ul>
        {["Jami taxminan 1 soat 10 daqiqa: ovoz ~23 daqiqa · to'rt amaliyot 40–50 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 13-ekrandan keyin tanaffus qilsangiz bo'ladi", 'Kerak: PostgreSQL-1 darsi o\'tilgan · PostgreSQL ishlab turgan · Node.js 20+ · VS Code · Postman', "Loyihalar: shop bazasi (o'quvchi m4-06) va AvtoIjara serveri (o'quvchi m4-08)"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, ScreenCrud, Screen2, Screen3, Screen4, Screen5, ScreenP1, Screen7, Screen8, ScreenP2, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenP3, Screen17, Screen18, Screen19, Screen20, Screen21, ScreenP4, Screen23, Screen24, Screen25, Screen26, Screen27];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function PgCrudMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
  setLang(lang);
  useCss();
  useCss3();
  const total = SCREENS.length;
  const [started, setStarted] = useState(startAt != null);
  const [idx, setIdx] = useState(Math.min(Math.max(0, startAt || 0), total - 1));
  const [answers, setAnswers] = useState({});
  const [returnTo, setReturnTo] = useState(null);
  const [seen, setSeen] = useState({});
  const [rev, setRev] = useState(0);
  const [mode, setMode] = useState('live');
  const startTime = useRef(Date.now());
  const finished = useRef(false);
  const onAnswer = useCallback((payload) => setAnswers((a) => ({ ...a, [idx]: payload })), [idx]);
  const goto = useCallback((to) => { setMode('live'); setReturnTo(idx); setIdx(Math.max(0, Math.min(to, total - 1))); }, [idx, total]);
  const next = () => { setMode('review'); setSeen((s) => ({ ...s, [idx]: true })); if (returnTo != null) { const r = returnTo; setReturnTo(null); setIdx(r); } else setIdx((i) => Math.min(i + 1, total - 1)); };
  const restart = useCallback(() => { setMode('live'); setRev((r) => r + 1); }, []);
  const finish = () => {
    if (finished.current) return; finished.current = true;
    const vals = Object.values(answers);
    const checks = vals.filter((a) => a && a.type === 'mc');
    const fin = vals.find((a) => a && a.type === 'final');
    const practices = vals.filter((a) => a && a.type === 'practice');
    const score = fin ? fin.score : 0, totalQ = FINAL.length;
    const practiceDone = practices.length === PRACTICE_COUNT && practices.every((x) => x.done);
    onFinished && onFinished({
      lessonId: LESSON_ID, lessonTitle: LESSON_TITLE,
      durationSec: Math.floor((Date.now() - startTime.current) / 1000),
      totalQuestions: totalQ, correctAnswers: score, scorePercent: Math.round((score / totalQ) * 100), passed: score >= 6 && practiceDone, testPassed: score >= 6,
      finalAttempts: fin ? fin.attempt : 0,
      checks: checks.map((c) => ({ firstTry: c.firstTry, tries: c.tries })),
      practiceDone,
      answers: Object.entries(answers).map(([i, a]) => ({ screen: Number(i) + 1, ...a })),
    });
  };
  if (!started) return <Cover onStart={() => setStarted(true)} />;
  const S = SCREENS[idx];
  const fin = Object.values(answers).find((a) => a && a.type === 'final');
  return <S key={`${idx}:${rev}`} idx={idx} total={total} lang={lang} stored={answers[idx]} testScore={fin ? fin.score : 0} seen={!!seen[idx]} review={mode === 'review' && !!seen[idx]} onAnswer={onAnswer} onNext={next} onBack={idx > 0 ? () => { setMode('review'); setIdx((i) => i - 1); } : null} onFinish={finish} onGoto={goto} onRestart={restart} />;
}
