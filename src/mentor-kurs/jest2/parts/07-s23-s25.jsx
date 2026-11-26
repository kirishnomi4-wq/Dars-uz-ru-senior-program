
// ============================================================
//  23 · Sinfga tayyorgarlik: m4b-03 (EdgeCasesTestLesson.jsx — SCREEN_META 21; shumtaka, guard, toThrow, applyCoupon)
// ============================================================
const DICT23 = [["shumtaka mijoz · g'alati buyurtma", "edge case, noto'g'ri kirish"], ['«hech kim sezmaydi» · «jim buzilish» (kartochka)', "yashirin buzilish — xatosiz noto'g'ri natija (0, −10000, NaN)"], ['guard · 🚧 shart · 🧯 xato tashlash', 'if → throw new Error → return'], ["o'rab berish", 'expect(() => f()).toThrow() — sinxron xato'], ['happy path', 'kutilgan kirish']];
const ADD23 = [['«xato chiqdi» + «keyin nima bo\'lmadi» — ikki qismli test', 's6–s8 guard'], ["() => siz nima bo'ladi — haqiqiy chiqish (natija yo'q)", "s7 o'rash"], ['chegaraning ikki tomoni: aynan 0 va aynan 100', 'uyga vazifa applyCoupon'], ['AI yozgan testni bir marta buzdirish', 'amaliyot oxiri']];
const CARDS23 = [
  ["Himoya yo'q", 'Received function did not throw', "guard yozilmagan yoki shart qiymatni o'tkazdi"],
  ["() => yo'q", "natija yo'q yoki test funksiya xatosi bilan yiqildi", 'expect(() => …)'],
  ['Boshqa xabar', 'Expected substring / Received message', 'xabarni koddagi bilan moslang'],
];
const QA23 = [
  ["«Nega xato tashlaymiz, 0 qaytarsak bo'lmaydimi?»", "0 — yashirin buzilish: bepul buyurtma; xato esa darhol ko'rinadi."],
  ['«toThrow() ichida xabar shartmi?»', "Shart emas, lekin xabar bilan test aniqroq: qaysi xato ekanini ham tekshiradi."],
  ["«'ikki' yozsam VS Code qizil chizadi»", "TypeScript turini tekshiradi; test uchun as any — ataylab noto'g'ri tur beryapmiz."],
  ["«Guard'ni funksiya oxiriga yozsam bo'ladimi?»", "Yo'q: xato hisobdan oldin chiqishi kerak, aks holda hisob baribir bajariladi."],
];
function QA({ items }) {
  const [open, setOpen] = useState(-1);
  return <div className="pg-qa">{items.map(([q, a], i) => <button key={q} onClick={() => setOpen(open === i ? -1 : i)}><b>{q}</b>{open === i && <p>{a}</p>}</button>)}</div>;
}
const S23 = mkS(23, [{ v: 'cards' }, { v: 'dict' }, { v: 'add' }, { v: 'err' }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m4b-03 (21 ekran)", 'Ученик · m4b-03 (21 экран)')} hl><p>{t(<><b>KitobShop sayti</b> · <code>orderTotal(price, quantity)</code>: 0, manfiy, <code>'ikki'</code>, <code>null</code> → guard (<code>if</code> → <code>throw</code> → <code>return</code>) · <code>expect(() =&gt; …).toThrow()</code> · uyga vazifa <code>applyCoupon</code> · baza yo'q, promise yo'q</>, <><b>Сайт KitobShop</b> · <code>orderTotal(price, quantity)</code>: 0, минус, <code>'ikki'</code>, <code>null</code> → guard (<code>if</code> → <code>throw</code> → <code>return</code>) · <code>expect(() =&gt; …).toThrow()</code> · домашнее задание <code>applyCoupon</code> · базы нет, promise нет</>)}</p></Card>
      <Card c={T.accent} h={t('Siz · bugun', 'Вы · сегодня')}><p>OrderBotNest · <code>isPhone</code> · <code>place</code>: mock, <code>rejects</code>, <code>not.toHaveBeenCalled</code> · {t('chegara · HTTP · AI testi', 'граница · HTTP · тест от AI')}</p></Card>
    </div>}
    {seg.v === 'dict' && <table className="pg-dict"><tbody>{DICT23.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>}
    {seg.v === 'add' && <><div className="mk-tag" style={{ margin: 0 }}>{t("Siz qo'shasiz", "Вы добавляете")}</div><table className="pg-dict"><tbody>{ADD23.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table></>}
    {seg.v === 'err' && <><div className="pg-three">{CARDS23.map(([h, x, y], i) => <Card key={h} c={T.accent} h={`${i + 1} · ${h}`}><p><code>{x}</code></p><p style={{ marginTop: 4 }}>→ {y}</p></Card>)}</div>
      <div className="mk-tag" style={{ margin: 0 }}>{t("O'quvchi so'rasa — bosib oching", "Если ученик спросит — нажмите, чтобы открыть")}</div><QA items={QA23} /></>}
  </>} />;
}

// ============================================================
//  24 · O'z-sinov — 8 savol (MD 24, FINAL)
// ============================================================
const FINAL = MDT[24].final;
function Screen24(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = LANG === 'ru' ? (!st.showResult ? RS('FIN_INTRO')
      : sc >= 6 ? 'Ваш результат сохранён: ' + sc + ' из восьми. Урок усвоен, нажмите «Далее».'
        : 'Хорошо, одну ошибку вы разобрали. Вернитесь и к экранам остальных красных вопросов. Когда будете готовы, нажмите кнопку «Пройти тест заново».')
      : !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: uch yo'l, qoidani ajratish, to throw va rejects, natija yo'q holatlari, bo'lmasligi kerak testi, chegara va HTTP. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi test natija bermayapti desa, qayerga qarashni bilasiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
//  25 · Yakun (M13, M14, M30) — xulosa 6 band, uyga vazifa 5 qadam, eslatma
// ============================================================
const SUM25 = [
  { k: 'paths', t: "Uch yo'l: happy path (kutilgan kirish), edge case (chegara — kod xato bermaydi, javob to'g'rimi), error path (kod ataylab xato beradi — qaysi xabar, keyin nima bo'lmadi)", st: ['edge', 'err'] },
  { k: 'rule', t: "Sinamoqchi bo'lgan qoidani alohida funksiyaga ajrating (isPhone); it.each — bir test, ko'p kirish; chegara testi qoidaning tor (probel) va keng (9 ta nol) joyini ko'rsatadi", st: ['edge'] },
  { k: 'mock', t: 'Baza o\'rniga mock: jest.fn, mockResolvedValue, Test.createTestingModule — unit-test bazasiz, kod haqiqiy', st: ['err'] },
  { k: 'shape', t: "Sinxron xato — expect(() => …).toThrow(); promise xatosi — await expect(…).rejects.toThrow(). Shakl noto'g'ri bo'lsa Jest natija bermaydi: jarayon qulaydi (toThrow promise'da · await'siz rejects)", st: ['err'] },
  { k: 'two', t: "Error path testi ikki qismli: xato chiqdi va keyingi qadam bajarilmadi (not.toHaveBeenCalled); har < / <= shartiga aynan teng qiymat bilan chegara testi", st: ['err', 'edge'] },
  { k: 'http', t: "Sayt API'si supertest bilan: so'rov → status va tana; 404 — mijoz xatosi, 500 — server xatosi. AI testini qabul qilish: diff · await + rejects · «bo'lmasligi kerak» testi · «qoidami yoki kod hozir shunday?» · buzib tekshirish", st: ['http', 'ai'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (BotMap + Jest qatori); har band rasmning o'z qismini yoritadi
const MAP25 = {
  paths: { on: ['telegram', 'order'], jest: { files: J2_FILES, res: 'pass', txt: '25 passed' } },
  rule: { on: ['telegram'], tgSub: 'phone.ts', jest: { cmd: 'npm test -- phone', files: ['phone.spec.ts · it.each'], res: 'pass', txt: '8 passed' } },
  mock: { on: ['order'], note: { products: 'mock: findOne → Kolonka, stock 1' }, jest: { cmd: 'npm test -- order.service', files: ['order.service.spec.ts'], res: 'pass' } },
  shape: { on: ['order'], jest: { cmd: 'toThrow · rejects', files: ['order.service.spec.ts'], res: 'fail', get txt() { return t("natija yo'q", 'нет результата'); } } },
  two: { on: ['order'], jest: { cmd: 'npm test -- order.service', files: ['order.service.spec.ts'], res: 'pass', txt: '5 passed' } },
  http: { on: ['telegram', 'order'], jest: { cmd: 'supertest', files: ['app.controller.spec.ts · GET / · /nope'], res: 'pass', txt: '2 passed' } },
};
function SummaryMap25({ hl }) {
  const m = MAP25[hl] || MAP25.paths;
  return <div className="mk-light" style={{ padding: 14 }}>
    <BotMap loc={DB_ALL} tgSub="phone.ts" {...m} max={1.05} tag={t("Bugungi dars — bot noto'g'ri kirishda to'g'ri buziladimi", 'Сегодняшний урок — правильно ли ломается бот на неверном вводе')} />
  </div>;
}
const HOMEWORK25 = [
  { t: "O'z nusxangiz — o'z reposingizda yangi tarmoq (yoki jest2-done dan)", c: ['git checkout -b edge-tests'] },
  { t: "cart.service.spec.ts — mock repo (query, delete): add — query 1 marta, RETURNING qty → natija; query rad etsa — await … rejects.toThrow, boshqa chaqiruv yo'q", c: ['npm test -- cart.service'] },
  { t: "user.service.spec.ts — mock repo (findOne, create, save): bor — save 0 · yo'q — save 1 · rol o'zgargan — save 1", c: ['npm test -- user.service'] },
  { t: "Uch buzish — getOrCreate: if (!user) tekshiruvini olib tashlang · add: rows[0].qty → rows.length · rol tekshiruvi !== → === ; har biridan keyin npm test va git checkout", c: ['git checkout -- src/api/user/user.service.ts src/api/cart/cart.service.ts'] },
  { t: "README «Testlar» bo'limi: buzish → qizargan test nomi (3 qator) → git push → repo linki platformadagi uyga vazifaga", c: ['git add . && git commit -m "edge va error path testlari"', 'git push'] },
];
const CHEATSHEET25 = `# Jest — mentor eslatmasi (OrderBotNest, xato yo'li va chegara)
## Loyiha
git fetch --tags · git checkout jest2-start → jest2-done (phone.ts, phone.spec.ts, order.service.spec.ts, app.controller.spec.ts, supertest) · npm test — 25 test, baza va token kerak emas
## Uch yo'l
happy path — kutilgan kirish · edge case — qoidaning chegarasi (kod xato bermaydi, javob to'g'rimi?) · error path — kod ataylab xato beradi (qaysi xabar? keyin nima bo'lmaydi?)
## Qoidani ajrating
const PHONE service ichida yashirin → src/api/telegram/phone.ts: export const isPhone = (text) => PHONE.test(text.replace(/[\\s-]/g, '')) · bot ham, test ham shuni chaqiradi
## it.each
it.each(['+998901234567', '998901234567'])("%s — to'g'ri raqam", (s) => { expect(isPhone(s)).toBe(true); }) · [['12345678', '8 ta raqam'], …] juftliklar — nom terminalda ko'rinadi
## Mock qolipi (baza yo'q)
const manager = { findOne: jest.fn(), query: jest.fn(), create: jest.fn((_c, d) => d), save: jest.fn(async (o) => ({ id: 1, ...o })), delete: jest.fn() }
const dataSource = { transaction: jest.fn((cb) => cb(manager)) } · Test.createTestingModule({ providers: [OrderService, { provide: getRepositoryToken(Order), useValue: {} }, { provide: DataSource, useValue: dataSource }] })
manager.findOne.mockResolvedValue({ id: 4, name: 'Kolonka', stock: 1, price: 50000 })
## Xato shakli
sinxron throw → expect(() => service.place(u, c)).toThrow("Telefon raqami yo'q")
promise xatosi → await expect(service.place(u, c)).rejects.toThrow('Kolonka: omborda faqat 1 ta qoldi')
NATIJA YO'Q (PASS/FAIL yo'q, Node.js v24…): toThrow promise xatosida · await'siz rejects — shaklni tekshiring
## Error path — ikki qism
1) xato chiqdi (xabar bilan) · 2) keyingi qadam bo'lmadi: expect(manager.query).not.toHaveBeenCalled() · happy path: toHaveBeenCalledTimes(1)
## Chegara
< / <= / > shartiga aynan teng qiymat bilan test (omborda 2 ta, 2 ta olinadi) — 4 test ko'rmadi, 5-si ko'rdi
## HTTP test
npm i -D supertest @types/supertest · Test.createTestingModule({ controllers: [AppController] }) → app = mod.createNestApplication(); await app.init() · request(app.getHttpServer()).get('/') → status 200, body · /nope → 404 «Cannot GET /nope»
## AI testini qabul qilish
git diff --stat — faqat .spec.ts · rejects oldida await · «bo'lmasligi kerak» testi bormi · har test: qoidami yoki «kod hozir shunday»mi (AI probelli raqam rad etilishini muhrlagan edi) · buzib tekshirish
## Xato qiladigan joylar
Received function did not throw → guard yo'q · natija yo'q → () => yoki await yo'q · Expected substring / Received message → xabarni moslang · Nest can't resolve dependencies … (?, DataSource) → providers'da repository token yo'q · Received message: "Mahsulot topilmadi" → mockResolvedValue yozilmagan
## Sinfga tayyorgarlik (m4b-03, 21 ekran)
KitobShop orderTotal · shumtaka = edge case · guard = if → throw → return · o'rab berish = expect(() => …) · siz qo'shasiz: ikki qismli test, () => siz natija yo'q, chegaraning ikki tomoni, bir marta buzdirish
## Sizning uyga vazifangiz (50–70 daqiqa)
cart.service.spec.ts + user.service.spec.ts (mock, rejects, not.toHaveBeenCalled) · 3 buzish · README jadvali → GitHub → repo linki platformaga`;
const s25Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Uch yo'l: <b>happy path, edge case, error path</b> — test uchalasini sinaydi", "Birinchi: har funksiyada uch yo'l bor. Happy path, kutilgan kirish. Edge case, qoidaning chegarasi, kod xato bermaydi, lekin javob to'g'rimi. Error path, kod ataylab xato beradi: qaysi xabar bilan va keyin nima bo'lmaydi.", { hl: 'paths' }),
  sg('b2', "Qoidani <b>alohida funksiyaga</b> ajrating; <b>it.each</b> va chegara testi", "Ikkinchi: sinamoqchi bo'lgan qoidani alohida funksiyaga ajrating, is phone kabi. It each bilan bir testga ko'p kirish berasiz. Chegara testi qoidaning tor joyini ham, keng joyini ham ko'rsatadi.", { hl: 'rule' }),
  sg('b3', "Baza o'rniga <b>mock</b>: jest.fn, mockResolvedValue, Test.createTestingModule", "Uchinchi: baza o'rniga mock. Jest fn chaqiruvni yozib qoladi, mock resolved value nima qaytarishini aytadi, test moduli Nest'ga soxta data source'ni beradi. Unit-test bazasiz, kod esa haqiqiy.", { hl: 'mock' }),
  sg('b4', "Sinxron — <b>toThrow</b>, promise — <b>await rejects.toThrow</b>; shakl noto'g'ri bo'lsa natija yo'q", "To'rtinchi: sinxron xatoga o'ram va to throw, promise xatosiga await, rejects, to throw. Shakl noto'g'ri bo'lsa Jest qizil bermaydi, jarayon qulaydi. Natija umuman chiqmasa, avval shaklni tekshiring.", { hl: 'shape' }),
  sg('b5', "Error path testi <b>ikki qismli</b>; har shartga <b>aynan teng</b> qiymat bilan chegara testi", "Beshinchi: xato yo'lining testi ikki qismli: xato chiqdi va keyingi qadam bajarilmadi, not to have been called bilan. Har kichik yoki katta shartiga aynan teng qiymat bilan chegara testi yozing.", { hl: 'two' }),
  sg('b6', "Sayt API'si — <b>supertest</b>; AI testi: <b>qoidami yoki «kod hozir shunday»mi</b>", "Oltinchi: saytning API'si supertest bilan sinaladi: so'rov, status va tana. AI yozgan testni qabul qilishda diff, await va rejects, bo'lmasligi kerak testi, va har testdan so'rang: bu qoidami yoki kod hozir shunday ishlaydimi. Keyin buzib tekshiring.", { hl: 'http' }),
  sg('hw', "<b>Uyga vazifa</b>: savat va foydalanuvchi servislariga xato yo'li testlari", "Uyga vazifa: OrderBotNest'ning o'z nusxangizda cart service'ning add va user service'ning get or create funksiyalariga xato yo'li va chegara testlarini yozing, mock bilan. Add'da so'rov bir marta ketadi, rad etilsa boshqa so'rov ketmaydi. Get or create'da save nechta marta chaqirilishini sanang.", { hl: 'hw' }),
  sg('hw2', "<b>Uch buzish</b> va README jadvali; repo linki platformaga", "Keyin uchta buzish qiling va har birida qaysi test qizarganini README'ga jadval qilib yozing. AI bilan yozsangiz ham bo'ladi, lekin har testda await va bo'lmasligi kerak qismini o'zingiz tekshiring. GitHub'ga chiqaring va linkni platformadagi uyga vazifangizga qo'ying. Ellik-yetmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: uch yo'l, mock qolipi, xato shakli va AI tekshiruvi — bir sahifada", "Pastda bir sahifalik eslatma: uch yo'l, qoidani ajratish, mock qolipi, xato shakli, natija yo'q holatlari, chegara, supertest, AI testini qabul qilish va xato qiladigan joylar. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET25, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('jest-xato-yoli-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s25Segments(passed), [passed]);
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
            <SummaryMap25 hl={hl} />
            {/* F-1120-02: bandlar rasm ostida ixcham to'rda — rasm surilib ketmasin (M51-2) */}
            <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, marginTop: 10 }}>{SUM25.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span style={{ fontSize: 12.5 }}>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 50–70 daqiqa', 'Домашнее задание · 50–70 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK25.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}>{t(<><b>Tekshiruvchi qaraydi:</b> har promise xatosida <code>await</code> + <code>rejects</code> · <code>not.toHaveBeenCalled</code> kamida ikki testda · README jadvalida 3 buzish, har biri qizargan.</>, <><b>Проверяющий смотрит:</b> на каждой ошибке promise <code>await</code> + <code>rejects</code> · <code>not.toHaveBeenCalled</code> хотя бы в двух тестах · в таблице README 3 поломки, и каждая покраснела.</>)}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("CI/CD: testlar lentada", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("Har push'da npm test o'zi yuradi, qizil bo'lsa — to'xtaydi", RS('NEXT_D'))}</div></div>
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
        <p className="mk-eyebrow">{t("Mentor kursi · Jest", "Курс для менторов · Jest")}</p>
        <h1>{t(LESSON_TITLE, RS('TITLE'))}</h1>
        <p className="af">{t('Bu darsdan keyin siz', 'После этого урока вы')}</p>
        <ul className="ok">
          {t(["botning xato yo'lini sinaysiz: telefon qoidasi, buyurtmaning uch xatosi va chegarasi", "baza o'rniga mock qo'yasiz va promise xatosini rejects bilan to'g'ri ushlaysiz", "sayt API'sini supertest bilan sinaysiz va AI yozgan testni kodni buzib tekshirasiz"], ['проверите путь ошибки бота: правило телефона, три ошибки заказа и границу', 'подставите mock вместо базы и правильно поймаете ошибку promise через rejects', 'проверите API сайта через supertest и тест от AI — ломая код']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 15–30 daqiqa, 14-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: Jest-1 darsi (texts.spec.ts, keyboards.spec.ts), Node.js 20+, VS Code, AI yordamchi; baza va bot tokeni kerak emas · Loyiha: jest2-start tegi", 'Урок со звуком · 1 ч 15–30 мин, после 14-го экрана можно сделать перерыв · Нужно: урок Jest-1 (texts.spec.ts, keyboards.spec.ts), Node.js 20+, VS Code, AI-помощник; база и токен бота не нужны · Проект: тег jest2-start')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><BotMap loc={DB_ALL} tgSub="phone.ts" on={['telegram', 'order']} jest={{ files: J2_FILES, res: 'pass', txt: '25 passed' }} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, ScreenP7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, Screen16, ScreenP17, Screen18, Screen19, Screen20, Screen21, ScreenP22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = [ScreenP7, ScreenP17, ScreenP22].filter((S) => SCREENS.includes(S)).length; // 26.11 (F-1125-01): havola bo'yicha — build (minify) funksiya nomini qisqartiradi, nom bo'yicha son 0 chiqib passed doim false edi
export default function JestEdgeMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
