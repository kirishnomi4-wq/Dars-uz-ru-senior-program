
// ============================================================
//  28 · Sinfga tayyorgarlik: m4-06 va m4-08 xaritasi (M41: faqat shu ikki ekran o'quvchi darsi haqida)
// ============================================================
const CLS28 = [
  { n: 'm4-06', s: '21 ekran', t: "PostgreSQL so'rovlar — CRUD + AI bilan", d: ["do'kon tugmalar bilan: INSERT · SELECT · WHERE · UPDATE · DELETE", "jadval — bugun siz yaratgan products'ning aynan o'zi", "amaliyot: haqiqiy PostgreSQL terminali yoki VS Code + AI — o'z do'koni"] },
  { n: 'm4-08', s: '9 ekran', t: 'Praktika: Backend CRUD — AvtoIjara', d: ["cars jadvali — terminalda qo'lda", "server.js — Gemini'dan, Postman bilan sinov", "AI xatosini topish: price → daily_price"] },
];
const ADD28 = [['javobdagi son (UPDATE 1 / 0)', 'm4-06 CRUD bloki'], ["WHERE'siz — proyektorda BEGIN … ROLLBACK", 'm4-06 UPDATE/DELETE'], ["ORDER BY — «o'rni o'zgardi» savoli", 'm4-06 SELECT'], ["apostrof '', NOT NULL maslahati", "m4-06 amaliyoti (o'z do'koni)"], ['HINT ham adashadi', 'm4-06 AI xatosi bloki'], ["To'rt farq: xato matni qisqa · Gemini kodi har xil · is_rented: null · port band «ishlayapti»", 'm4-08']];
const PRE28 = ["Har kompyuterda PostgreSQL terminali ochiladi va Postman o'rnatilgan", "Sinf paroli hammaga ma'lum", 'Qoida: bitta loyiha — bitta terminal', "Vaqt: m4-06 da 90 daqiqaning 25 tasi amaliyotga · m4-08 da 40 tasi server va Postman'ga"];
const S28 = mkS(28, [{ v: 'cards', hl: 0 }, { v: 'cards', hl: 1 }, { v: 'add' }, { v: 'pre' }]);
function Screen28(p) {
  return <Lesson p={p} S={S28} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">{CLS28.map((c, i) => <div key={c.n} className="mk-card" style={{ borderColor: seg.hl === i ? T.accent : T.line, opacity: seg.hl === i ? 1 : 0.5, transition: 'opacity .3s' }}>
      <h5 style={{ color: T.accent }}>{c.n} · {c.s}</h5><div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{c.t}</div>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.55 }}>{c.d.map((x) => <li key={x}>{x}</li>)}</ul></div>)}</div>}
    {seg.v === 'add' && <div className="mk-light" style={{ padding: 12 }}><div className="mk-tag">{t("Siz qo'shasiz — qayerda", "Вы добавляете — где")}</div>
      <table className="pg-dict"><tbody>{ADD28.map(([a, b], i) => <tr key={i} className="hl" style={{ animation: `mk-up .4s ${i * 0.08}s ease both` }}><td style={{ borderLeftColor: T.accent }}>{a}</td><td>→</td><td style={{ color: T.ink2 }}>{b}</td></tr>)}</tbody></table></div>}
    {seg.v === 'pre' && <div style={{ display: 'grid', gap: 8 }}>{PRE28.map((x, i) => <div key={i} className="mk-step hl" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}><span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span><div className="t"><b>{x}</b></div></div>)}</div>}
  </>} />;
}

// ============================================================
//  29 · Qoqiladigan olti joy va o'quvchi savollari
// ============================================================
const STUMBLE29 = [
  ['Jadval/ustun nomi', 'relation "product" · column "narx" (+ HINT)', '\\d jadval bilan solishtirish'],
  ['Apostrof', 'syntax error at or near "yinchoq"', "''"],
  ["WHERE'siz", 'UPDATE 3 / DELETE 3', "BEGIN … ROLLBACK; o'chgan bo'lsa — qayta INSERT"],
  ['Parol/baza', 'password authentication failed · client password must be a string · database … does not exist', 'Pool sozlamalari, sinf paroli'],
  ["Bo'sh xato", '{"error":""}', "console.error(err) → ECONNREFUSED → PostgreSQL'ni ishga tushiring"],
  ["O'zgarmadi", 'javob eski', 'ikkinchi terminal; Ctrl+C'],
];
const QA29 = [
  ["«Nega mahsulot o'rni o'zgardi?»", "ORDER BY yo'q — baza yangilangan qatorni yangi joyga yozadi (6-ekran); ORDER BY id."],
  ['«$1 nima?»', "qiymat alohida beriladi, SQL matniga kirmaydi; 1 OR 1=1 misoli (20-ekran)."],
  ['«Postman shartmi?»', "yo'q, so'rov yuboradigan istalgan dastur; darsda Postman, chunki sinf uchun qulay."],
  ["«NestJS'da ham shunday yozamizmi?»", "yo'q: Nest'da Repository bu so'rovlarni o'zi yozadi (find, save…). Xavotir olmang: buni kursdagi keyingi mentor darslarida to'liq, kodi bilan o'rganasiz."],
  ['«SQL katta harfda yozilishi shartmi?»', "yo'q, kalit so'zlar kichik harfda ham ishlaydi (sinab ko'rdik: select name, price from PRODUCTS ishladi); katta harf — o'qish oson bo'lishi uchun odat."],
];
const S29 = mkS(29, [{ hl: [] }, { hl: [0, 1] }, { hl: [2, 3, 4] }, { hl: [5], qa: true }]);
function Screen29(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S29} scene={({ seg }) => <>
    <div className="mk-qa">
      {STUMBLE29.map(([h, m, a], i) => <button key={i} className={seg.hl.includes(i) ? 'hl' : (seg.hl.length ? 'dim' : '')} style={{ cursor: 'default' }}><b>{i + 1}. {h}</b>{!seg.qa && <><p style={{ fontFamily: MONO, fontSize: 12, color: T.accent, margin: '0 0 4px' }}>{m}</p><p>{a}</p></>}</button>)}
    </div>
    {seg.qa && <div className="mk-rule" style={{ animation: 'mk-up .45s ease both' }}>{t("Javobni darhol aytmang — ", "Не говорите ответ сразу — ")}<b>{t("xabarni o'quvchi bilan birga o'qing", "читайте сообщение вместе с учеником")}</b>{t(": jadval/ustun nomi, status, terminal.", ": имя таблицы/колонки, статус, терминал.")}</div>}
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">{t("O'quvchi so'rasa — bosing", "Если ученик спросит — нажмите")}</div>
      <div className="pg-qa">{QA29.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}

// ============================================================
//  30 · O'z-sinov — 8 savol (M12; mexanika PG-1 bilan bir xil)
// ============================================================
const FINAL = MDT[30].final;
function Screen30(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = LANG === 'ru' ? (!st.showResult ? RS('FIN_INTRO')
      : sc >= 6 ? 'Ваш результат сохранён: ' + sc + ' из восьми. Урок усвоен, нажмите «Далее».'
        : 'Хорошо, одну ошибку вы разобрали. Вернитесь и к экранам остальных красных вопросов. Когда будете готовы, нажмите кнопку «Пройти тест заново».')
      : !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: CRUD, tranzaksiya, Pool va server xatolari. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi m4-06 va m4-08 dagi xatolar sinfda sizga tanish bo'ladi.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
  };
  const next = () => { if (i < FINAL.length - 1) { setI(i + 1); save({ i: i + 1 }); } else { setShowResult(true); save({ showResult: true }); } };
  const retake = () => { setRes([]); setI(0); setShowResult(false); setAttempt(attempt + 1); save({ res: [], i: 0, showResult: false, attempt: attempt + 1, score: 0 }); };
  return (
    <Stage kicker={t("O'z-sinov", 'Самопроверка')} idx={p.idx} total={p.total} audio={audio} onBack={p.onBack} onNext={p.onNext} onRestart={p.onRestart} nextReady={finished && showResult} nextDisabled={!(finished && showResult)} lockHint={!finished ? t('Savollarga javob bering', 'Ответьте на вопросы') : t('Natijani oching', 'Откройте результат')}>
      <div className="mk-body" style={{ gridTemplateColumns: '1fr', maxWidth: 980, width: '100%', margin: '0 auto' }}>
        <div className="mk-say mc" style={{ overflow: 'auto', paddingRight: 4 }}>
          {showResult ? (<>
            <p className="mk-eyebrow">{t("O'z-sinov · natija", 'Самопроверка · результат')}{attempt > 1 ? t(` · ${attempt}-urinish`, ` · попытка ${attempt}`) : ''}</p>
            <h2 className="mk-title mc-q" style={{ fontSize: 'clamp(22px,1.9vw,26px)' }}>{score} / {FINAL.length} — {score >= 6 ? t("dars o'zlashtirildi", 'урок усвоен') : t("yana bir ko'rib chiqing", 'посмотрите ещё раз')}</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {FINAL.map((f, k) => <div key={k} className="mk-card" style={{ display: 'flex', gap: 12, alignItems: 'center', borderColor: res[k] && res[k].correct ? T.green : T.accent }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: res[k] && res[k].correct ? T.green : T.accent, minWidth: 22 }}>{res[k] && res[k].correct ? '✓' : '✗'}</span>
                <span style={{ flex: 1, fontSize: 14 }}>{f.q}</span>
                {res[k] && !res[k].correct && p.onGoto && <button className="mk-btn soft sm" onClick={() => p.onGoto(f.s - 1)}>{t(`${f.s}-ekran`, `экран ${f.s}`)}</button>}
              </div>)}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, flexWrap: 'wrap' }}>
              {score < 6 && <button className="mk-btn ghost" onClick={retake}>{t('Sinovni qayta topshirish', 'Пройти тест заново')}</button>}
              <span style={{ color: T.ink2, fontSize: 14 }}>{t('Ekranga qaytib «Davom» bossangiz, shu natijaga qaytasiz.', 'Если вернётесь к экрану и нажмёте «Далее», попадёте обратно к этому результату.')}</span>
            </div>
          </>) : (<>
            <p className="mk-eyebrow">{t("O'z-sinov", 'Самопроверка')} · {i + 1} / {FINAL.length} · {t("bitta urinish · to'g'ri:", 'одна попытка · верно:')} {score}</p>
            <h2 className="mk-title mc-q">{q.q}</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {q.o.map((o, k) => { let cls = 'mk-opt'; if (picked !== null) { if (k === q.c) cls += ' ok'; else if (k === picked) cls += ' bad'; else cls += ' off'; } return <button key={k} className={cls} disabled={picked !== null} onClick={() => pick(k)}><span className="l">{String.fromCharCode(65 + k)}</span><span>{o}</span></button>; })}
            </div>
            {picked !== null && <div className="mk-fb" style={{ '--c': picked === q.c ? T.green : T.accent, '--bg': picked === q.c ? '#E3F5EC' : '#FFF0EB' }}><b>{picked === q.c ? t("To'g'ri", 'Верно') : t("Noto'g'ri — to'g'risi yashil", 'Неверно — правильный ответ зелёный')}</b><span>{q.e}</span></div>}
            {picked !== null && <div style={{ marginTop: 14 }}><button className="mk-btn ready" onClick={next}>{i < FINAL.length - 1 ? t('Keyingi savol →', 'Следующий вопрос →') : t("Natijani ko'rish →", 'Посмотреть результат →')}</button></div>}
          </>)}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  31 · Yakun (M13, M14) — xulosa 6 band, uyga vazifa 5 qadam, eslatma
// ============================================================
const SUM31 = [
  { k: 'crud', t: "CRUD = INSERT · SELECT · UPDATE · DELETE; javobdagi son — nechta qator tegildi; RETURNING — qatorning o'zi; ORDER BY siz tartib kafolatlanmaydi (ctid)", st: ['psql'] },
  { k: 'tx', t: "Tranzaksiya: autocommit · BEGIN → faqat sizning seansingizda → COMMIT / ROLLBACK; !# — aborted, faqat ROLLBACK; ikki jadval bitta ish — atomik", st: ['psql', 'tx'] },
  { k: 'rule', t: "Baza faqat yozilgan qoidani qo'riqlaydi: NOT NULL, DEFAULT, UNIQUE, CHECK; xabar ichida nom bor — \\d bilan solishtiring; apostrof ''", st: ['jad'] },
  { k: 'exp', t: 'Express: Pool birinchi so\'rovda ulanadi va ulanishni qayta ishlatadi → pool.query(sql, [$1…]) → rows / rowCount → res.json; 200 · 201 · 404 · 500', st: ['pm', 'srv', 'pool'] },
  { k: 'brk', t: "$1 — xavfsizlik: yopishtirilgan 1 OR 1=1 jadvalni bo'shatdi; server xatolari: ustun nomi · express.json() · parol/baza birinchi so'rovda · bo'sh xabar → console.error(err) · ikkinchi server «ishlayapti»", st: ['srv', 'pool'] },
  { k: 'class', t: "Sinf: m4-06 amaliyoti haqiqiy psql'da; m4-08 dan oldin parol, Postman, bitta terminal; olti holat va savollarga javoblar tayyor", st: ['pm', 'psql'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (CrudMachine); har band rasmning o'z yo'lini yoritadi
const PS31 = { psql: ['psql', 'shop'], api: ['pm', 'json', 'route', 'pool', 'cars'] };
const MAP31 = {
  crud: { path: 'psql', on: PS31.psql, psqlLine: ['shop=#', 'UPDATE products SET price = 99000 WHERE id = 1;', 'UPDATE 1'] },
  tx: { path: 'psql', on: PS31.psql, psqlLine: ['shop=!#', 'ROLLBACK;', 'ROLLBACK'] },
  rule: { path: 'psql', on: PS31.psql, psqlLine: ['shop=*#', 'UPDATE products SET stock = stock - 7 WHERE id = 3;', 'ERROR: … violates check constraint "stock_nonneg"'] },
  exp: { path: 'api', on: PS31.api, st: 201, back: 'rows[0] → res.status(201).json' },
  brk: { path: 'api', on: PS31.api, st: 500, back: 'catch → res.status(500)' },
  class: { path: 'both', on: ['pm', 'psql'], st: 201, back: 'rows[0] → res.status(201).json' },
};
function SummaryMap31({ hl }) {
  const m = MAP31[hl] || { path: 'both', st: 201, back: 'rows[0] → res.status(201).json' };
  return <div className="mk-light" style={{ padding: 14 }}>
    <CrudMachine {...m} res={m.st === 500 ? '{"error":"column \\"price\\" of relation \\"cars\\" does not exist"}' : '{"id":4,"model":"Chevrolet Spark",…}'}
      req={{ m: 'POST', url: '/api/cars', body: '{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }' }}
      tag={t("Bugungi dars — so'rovning bazagacha yo'li", 'Сегодняшний урок — путь запроса до базы')} max={0.95} />
  </div>;
}
const HOMEWORK31 = [
  { t: "Jadvallar — schema.sql: products (NOT NULL nom va narx, CHECK (stock >= 0), DEFAULT 0), orders (REFERENCES products(id), CHECK (qty > 0), created_at DEFAULT now())", c: ['psql -U postgres -d <baza> -f schema.sql'] },
  { t: 'Server — server.js: GET · POST (201, RETURNING *) · PUT · DELETE (rowCount → 404), hamma qiymat $1 bilan', c: ['node server.js'] },
  { t: "Sinov — Postman: 4 so'rov + yo'q id → 200 · 201 · 200 · 200 · 404", c: [] },
  { t: "Tranzaksiya — psql: BEGIN → UPDATE … stock - 1 … RETURNING → INSERT INTO orders → COMMIT; keyin yetmagan qoldiq → CHECK xatosi → ROLLBACK — ikkala chiqish README'ga", c: [] },
  { t: "Topshirish — GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "shop-api"', 'git push'] },
];
const CHEATSHEET31 = `# PostgreSQL-2 — mentor eslatmasi (CRUD, tranzaksiya, Express)
## CRUD (psql) va javobdagi son
INSERT INTO products (name, price, stock) VALUES (…) → INSERT 0 n · SELECT * / SELECT name, price · WHERE price < 100000 · UPDATE … SET … WHERE id = 1 → UPDATE 1 · DELETE … WHERE id = 3 → DELETE 1
Son: 1 — kutganingiz · 0 — WHERE hech narsaga mos kelmadi (xato emas) · katta son — WHERE noto'g'ri/yo'q · RETURNING — o'zgargan qatorning o'zi
ORDER BY yo'q — tartib fayldagidek (UPDATE yangi nusxa yozadi: ctid (0,5) → (0,6)) → ORDER BY id
## Tranzaksiya
autocommit: har buyruq darhol · BEGIN → faqat sizning seansingizda (B seansi eski qiymatni ko'radi) → COMMIT saqlaydi / ROLLBACK bekor · prompt: =# oddiy · =*# ochiq · =!# xato (aborted) — faqat ROLLBACK, COMMIT ham ROLLBACK qaytaradi
Atomik: ikki jadval bitta ish — UPDATE stock + INSERT orders bitta BEGIN … COMMIT ichida; CHECK rad etsa — hech biri saqlanmaydi
## Baza qo'riqlaydi
Qoida yozilmasa — qo'riqlamaydi (nomsiz qator saqlanadi). NOT NULL (avval bo'sh qatorlarni tozalang) · DEFAULT 0 · UNIQUE (name) → duplicate key value · CHECK (stock >= 0) · \\d products — hammasi bir joyda
## SQL xatolari (xabar ichida nom bor)
relation "product" / column "narx" (HINT ham adashadi) → \\d bilan solishtirish · 'arzon' → invalid input syntax for type integer · ustun/qiymat soni → more target columns than expressions · apostrof → '' (O''yinchoq)
## Express → baza
Pool: yaratilganda ulanmaydi, birinchi so'rovda ulanadi, ulanishni qayta ishlatadi (3 so'rov — bitta pid) · pool.query(sql, [qiymatlar]) → result.rows / result.rowCount · res.json · GET 200 · POST 201 (RETURNING *) · PUT/DELETE 200 · rowCount 0 → 404 · catch → 500
Nega $1: yopishtirilgan '… WHERE id = ' + id va URL "1 OR 1=1" → hamma qator o'chdi (deleted: 3); $1 bilan → 500 invalid input syntax, jadval joyida
## Server xatolari
column "price" of relation "cars" does not exist → kodda ustun nomi (\\d cars) · Cannot destructure property 'model' of 'req.body' → app.use(express.json()) · password authentication failed → parol · client password must be a string → parol bo'sh (process.env) · database "…" does not exist → nom · {"error":""} → console.error(err) → ECONNREFUSED → PostgreSQL'ni ishga tushiring
«Server … ishlayapti» faqat Express haqida — baza xatosi birinchi so'rovda · Port band: Express 5 da ikkinchi server ham «ishlayapti» deb xato bermay chiqadi, eski server javob beradi → bitta terminal, Ctrl+C
## Sinfga tayyorgarlik
m4-06 (21 ekran): amaliyot haqiqiy PostgreSQL terminalida — har kompyuterda PostgreSQL; siz qo'shasiz: javobdagi son, BEGIN … ROLLBACK proyektorda, ORDER BY, apostrof va NOT NULL maslahati, HINT ham adashadi
m4-08 (9 ekran): sinf paroli, Postman, bitta terminal; to'rt farq — xato matni qisqa · Gemini kodi har xil · is_rented null (DEFAULT yo'q) · port band «ishlayapti»
## Sizning uyga vazifangiz (50–70 daqiqa)
shop-api: schema.sql (products NOT NULL + CHECK, orders FK) + server.js (4 endpoint, $1, 404) + README (5 so'rov va javobi, BEGIN…COMMIT sotuv va CHECK xatosi) → GitHub → repo linki platformadagi uyga vazifaga`;
const s31Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "CRUD — to'rt buyruq; <b>javobdagi son</b> va RETURNING; ORDER BY siz tartib kafolatlanmaydi", "Birinchi: CRUD to'rt buyruq, insert, select, update va delete. Javobdagi son nechta qator tegilganini aytadi, returning esa qatorning o'zini qaytaradi. Order by yozilmasa tartib kafolatlanmaydi: baza yangilangan qatorni yangi joyga yozadi.", { hl: 'crud' }),
  sg('b2', "Tranzaksiya: <b>BEGIN — faqat sizning seansingizda</b>, COMMIT yoki ROLLBACK; ikki jadval — bitta ish", "Ikkinchi: oddiy holatda har buyruq darhol saqlanadi. Begin'dan keyin o'zgarish faqat sizning seansingizda, commit saqlaydi, rollback bekor qiladi. Undov belgisi chiqsa, faqat rollback. Bir ishga tegishli buyruqlar bitta tranzaksiyada: yo hammasi, yo hech biri.", { hl: 'tx' }),
  sg('b3', "Baza <b>faqat yozilgan qoidani</b> qo'riqlaydi; xabardagi nomni \\d bilan solishtiring", "Uchinchi: baza faqat yozilgan qoidani qo'riqlaydi: not null, default, unique va check. Har xabar ichida jadval yoki qoida nomi bor, uni backslash d bilan solishtiring. Apostrof ikki marta yoziladi.", { hl: 'rule' }),
  sg('b4', "Express: <b>Pool birinchi so'rovda ulanadi</b> → pool.query → rows / rowCount → res.json", "To'rtinchi: Express'dan bazaga yo'l. Pool bir marta sozlanadi, birinchi so'rovda ulanadi va ulanishni qayta ishlatadi. Pool query so'rov yuboradi, natijadan rows yoki rowcount olinadi, res json javob qaytaradi. Statuslar: ikki yuz, ikki yuz bir, to'rt yuz to'rt, besh yuz.", { hl: 'exp' }),
  sg('b5', "<b>$1 — xavfsizlik</b>; server xatolari: ustun nomi, express.json, parol, bo'sh xabar, ikkinchi server", "Beshinchi: foydalanuvchidan kelgan qiymat doim dollar bir bilan, yopishtirilgan matn butun jadvalni bo'shatdi. Server xatolari: ustun nomi, express json, parol va baza birinchi so'rovda. Xabar bo'sh bo'lsa, console error'ga butun xatoni bering. Ikkinchi server ham ishlayapti deydi.", { hl: 'brk' }),
  sg('b6', "Sinf: m4-06 amaliyoti <b>haqiqiy psql'da</b>; m4-08 dan oldin parol, Postman, bitta terminal", "Oltinchi, sinf uchun: m4-06 amaliyoti haqiqiy PostgreSQL terminalida, har kompyuterda PostgreSQL kerak. m4-08 dan oldin sinf paroli, Postman va bitta terminal qoidasi. Olti holat va o'quvchi savollariga javoblar sizda tayyor.", { hl: 'class' }),
  sg('hw', "<b>Uyga vazifa</b>: o'z do'koningiz uchun shop-api — ikki jadval, to'rt endpoint, README", "Uyga vazifa: o'z do'koningiz uchun shop api. Schema faylida ikki jadval: mahsulotlar not null va check stock katta yoki teng nol bilan, buyurtmalar tashqi kalit bilan. Server js'da to'rt endpoint, hamma qiymat dollar bir bilan, topilmasa to'rt yuz to'rt. README'da har endpoint uchun bitta so'rov va javobi.", { hl: 'hw' }),
  sg('hw2', "Terminalda <b>bitta sotuv va CHECK xatosi</b> — README'ga; repo linki platformaga", "Terminalda bitta sotuvni begin, update, insert va commit bilan qiling, keyin yetmagan qoldiqda check xatosini oling: ikkalasini README'ga yozing. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying. Ellik-yetmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: CRUD, tranzaksiya, qoidalar, xatolar va server — bir sahifada", "Pastda bir sahifalik eslatma: CRUD va javobdagi son, tranzaksiya holatlari, baza qoidalari, SQL va server xatolari, Express yo'li va sinfga tayyorgarlik. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen31(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET31, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('postgresql-2-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s31Segments(passed), [passed]);
  const b = useBeats(segments, p.review);
  const hl = b.seg.hl;
  const phase = hl === 'hw' ? 'hw' : hl === 'note' ? 'note' : 'sum';
  const shown = segments.slice(0, b.beat + 1).filter((s) => /^b\d/.test(s.id)).length;
  return (
    <Stage kicker={t('Yakun', 'Итог')} idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onFinish} onRestart={p.onRestart} nextReady={b.done} nextDisabled={!b.done} nextLabel={t('Darsni yakunlash', 'Завершить урок')} lockHint={t("Ustoz gapirib bo'lgach ochiladi", 'Откроется, когда учитель договорит')}>
      <div className="mk-body">
        <Say title={passed ? t('Barakalla! Endi siz bilasiz', 'Отлично! Теперь вы знаете') : t('Endi siz bilasiz', 'Теперь вы знаете')} segments={segments} beat={b.beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk} review={p.review} />
        <div className="mk-scene top" style={{ overflow: 'auto' }}>
          {phase === 'sum' && (<>
            <SummaryMap31 hl={hl} />
            {/* F-1120-02: bandlar rasm ostida ixcham to'rda (1-ekrandagi reja kabi) — rasm surilib ketmasin (M51-2) */}
            <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, marginTop: 10 }}>{SUM31.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span style={{ fontSize: 12.5 }}>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 50–70 daqiqa', 'Домашнее задание · 50–70 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK31.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>{t("Tekshiruvchi qaraydi:", "Проверяющий смотрит:")}</b>{t(" NOT NULL / CHECK · $1 (yopishtirish yo'q) · 404 · README'da 5 so'rov, COMMIT va CHECK xatosi.", " NOT NULL / CHECK · $1 (без склеивания) · 404 · в README 5 запросов, COMMIT и ошибка CHECK.")}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t("Kursdagi keyingi mentor darsi", "Следующий урок курса для менторов")}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("NestJS arxitekturasi — Module, Controller, Service", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("Express'dagi shu CRUD Nest'da qanday tartib bilan yoziladi", RS('NEXT_D'))}</div></div>
          </div>}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  Muqova va ildiz
// ============================================================
// F-1120-02 (M51): muqova — chapda dars nima berishi, o'ngda darsning rasmi; eslatmalar bitta qisqa satrda
function Cover({ onStart, resume }) {
  return (
    <div className="mk-cover"><div className="card n1-cv">
      <div className="tx">
        <p className="mk-eyebrow">{t("Mentor kursi · PostgreSQL", "Курс для менторов · PostgreSQL")}</p>
        <h1>{t(LESSON_TITLE, RS('TITLE'))}</h1>
        <p className="af">{t('Bu darsdan keyin siz', 'После этого урока вы')}</p>
        <ul className="ok">
          {t(["psql'da CRUD va tranzaksiyani javobdagi son bilan tekshirasiz", "Express'dan bazaga so'rov yuborasiz: Pool, $1, rows va statuslar", "server 500 berganda xabardan sababini topasiz va sinfga tayyor bo'lasiz"], ['проверите CRUD и транзакции в psql по числу в ответе', 'отправите запрос из Express в базу: Pool, $1, rows и статусы', 'найдёте по сообщению причину 500 на сервере и будете готовы к классу']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 20 daqiqa, 13-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: PostgreSQL-1 o'tilgan, PostgreSQL ishlab turgan, Node.js 20+, VS Code, Postman", 'Урок со звуком · 1 час 20 минут, после 13-го экрана можно сделать перерыв · Нужно: пройден PostgreSQL-1, работающий PostgreSQL, Node.js 20+, VS Code, Postman')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><CrudMachine path="both" st={201} back="rows[0] → res.status(201).json" newRow={3} cars={CARS1} prods={PRODS1} res='{"id":4,"model":"Chevrolet Spark",…}' req={{ m: 'POST', url: '/api/cars', body: '{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }' }} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, ScreenP8, Screen9, Screen10, Screen11, Screen12, ScreenP13, Screen14, Screen15, Screen16, Screen17, Screen18, Screen19, Screen20, ScreenP21, Screen22, Screen23, Screen24, Screen25, Screen26, ScreenP27, Screen28, Screen29, Screen30, Screen31];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function PgCrudMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
  setLang(lang);
  useCss();
  useCss3();
  useCssN1(); // F-1120-02: dars rasmi uslubi (parts/02b-rasm.jsx)
  const total = SCREENS.length;
  const [started, setStarted] = useState(startAt != null);
  const [idx, setIdx] = useState(Math.min(Math.max(0, startAt || 0), total - 1));
  const [answers, setAnswers] = useState({});
  const [returnTo, setReturnTo] = useState(null);
  const [seen, setSeen] = useState({});
  const [rev, setRev] = useState(0);
  const [mode, setMode] = useState('live');
  const sv = useMentorSave({ id: LESSON_ID, total, startAt, started, idx, answers, seen, setIdx, setAnswers, setSeen, setStarted });
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
  if (!started) return <Cover onStart={sv.start} resume={sv.resume} />;
  const S = SCREENS[idx];
  const fin = Object.values(answers).find((a) => a && a.type === 'final');
  return <S key={`${idx}:${rev}`} idx={idx} total={total} lang={lang} stored={answers[idx]} testScore={fin ? fin.score : 0} seen={!!seen[idx]} review={mode === 'review' && !!seen[idx]} onAnswer={onAnswer} onNext={next} onBack={idx > 0 ? () => { setMode('review'); setIdx((i) => i - 1); } : null} onFinish={finish} onGoto={goto} onRestart={restart} />;
}
