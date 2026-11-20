
// ============================================================
//  22 · Sinfga tayyorgarlik: m4b-01 (JestUnitTestLesson.jsx — SCREEN_META 21; s13 FAIL · s15 AI testlari · s16 etalon · HW_V2 deliveryFee)
// ============================================================
const DICT22 = [['mashina — kirish → chiqish', 'funksiya'], ['Jestbot — sinovchi robot', 'Jest (npm test)'], ['robot papkasi', 'describe'], ['sinov varaqasi', 'it'], ['etalon kartochkasi', 'expect(…).toBe(…)'], ["yolg'on test", 'expect yo\'q yoki noto\'g\'ri etalon']];
const ADD22 = [['haqiqiy FAIL o\'qish: ● → Expected / Received → > satr', 's13 «FAIL»'], ['«kim xato: kodmi, etalonmi?»', 's13, s16 noto\'g\'ri etalon'], ['etalon qo\'lda — orderTotal etalonda chaqirilmasin', 's15 AI testlari'], ['chegara: aynan 100 000', 'uyga vazifa deliveryFee'], ['yashil bo\'lsa — bir marta buzdirish', 'amaliyot oxiri']];
const S22 = mkS(22, [{ v: 'cards' }, { v: 'dict' }, { v: 'add' }, { v: 'pre' }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <>
    {(seg.v === 'cards' || seg.v === 'dict') && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m4b-01 (21 ekran)", "Ученик · m4b-01 (21 экран)")} hl={seg.v === 'cards'}><p><b>{t("KitobShop sayti", "сайт KitobShop")}</b> · <code>orderTotal(price, quantity)</code> → <code>src/order.ts</code> + <code>src/order.spec.ts</code>{t(" · Jestbot (robot) · uyga vazifa ", " · Jestbot (робот) · домашнее задание ")}<code>deliveryFee</code></p></Card>
      <Card c={T.accent} h={t("Siz · bugun", "Вы · сегодня")}><p>OrderBotNest · <code>som</code>, <code>orderKeyboard</code>, <code>catalogKeyboard</code>{t(" · ko'rinmas belgi · yolg'on testlar · AI testi va buzib tekshirish", " · невидимый символ · ложные тесты · тест от AI и проверка поломкой")}</p></Card>
    </div>}
    {seg.v === 'dict' && <table className="pg-dict"><tbody>{DICT22.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>}
    {seg.v === 'add' && <><div className="mk-tag" style={{ margin: 0 }}>{t("Siz qo'shasiz", "Вы добавляете")}</div><table className="pg-dict"><tbody>{ADD22.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table></>}
    {seg.v === 'pre' && <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">{t("Amaliyot oldidan", "Перед практикой")}</div><div className="mk-plan">
      {[t("Repo npm install bilan o'rnatilgan", "Репозиторий установлен через npm install"), t('Test fayli src/ ichida', "Тестовый файл внутри src/"), t('Nomi .spec.ts bilan tugaydi', "Имя заканчивается на .spec.ts")].map((x, i) => <div key={x}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>}
  </>} />;
}

// ============================================================
//  23 · Qoqiladigan joylar (jest1-out/01, 11–15 — o'quvchi reposi; jest1v2-out) + o'quvchi savollari
// ============================================================
const CARDS23 = [
  ['Test topilmadi', 'No tests found, exiting with code 1', 'src/ ichida, nomi .spec.ts'],
  ["O'quvchi reposida npm ci yiqildi", 'npm ci can only install packages when … in sync', 'npm install — lock fayl sinxron emas'],
  ["Yolg'on yashil", "PASS, lekin expect yo'q yoki etalon koddan", "har it'da expect; etalon qo'lda"],
  ["Bir xil ko'rinadi, lekin FAIL", 'Expected = Received ko\'rinishda · serializes to the same string', 'ko\'rinmas belgi (' + ESC + ') · massivga toEqual'],
  ["Nest bo'lmagan bo'sh loyiha", 'Must use import to load ES Module → describe → TypeScript 7', "o'quvchi reposida yozdirish; bo'sh loyihada config:init, @types/jest, typescript@5"],
];
const QA23 = [
  ['«Test kodni tuzatadimi?»', "Yo'q, faqat xabar beradi; tuzatish — sizniki."],
  ['«Darsda npm i -D jest ts-jest bor — o\'rnatsam buziladimi?»', "Nest reposida jest allaqachon bor; buyruq faqat kichik versiyaga ko'taradi, testlar yashil (sinalgan)."],
  ['«Jest faqat Nest uchunmi?»', "Yo'q, istalgan JavaScript/TypeScript loyihasi; Nest'da tayyor sozlangan."],
  ["«AI testni yozsa bo'ladimi?»", "Ha; keyin to'rt tekshiruv va kamida bitta buzish (19-ekran)."],
  ['«toBe va === farqi?»', "toBe ham Object.is bilan solishtiradi, lekin natijani PASS yoki FAIL qilib xabar beradi."],
];
function QA({ items }) {
  const [open, setOpen] = useState(-1);
  return <div className="pg-qa">{items.map(([q, a], i) => <button key={q} onClick={() => setOpen(open === i ? -1 : i)}><b>{q}</b>{open === i && <p>{a}</p>}</button>)}</div>;
}
const S23 = mkS(23, [{ on: [] }, { on: [0, 1] }, { on: [2, 3, 4] }, { on: [0, 1, 2, 3, 4], qa: true }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    <div className="pg-2c">{CARDS23.map(([h, x, y], i) => <Card key={h} c={i < 2 ? T.blue : T.accent} h={`${i + 1} · ${h}`} hl={seg.on.includes(i) && !seg.qa} dim={seg.on.length > 0 && !seg.on.includes(i)}><p><code>{x}</code></p><p style={{ marginTop: 4 }}>→ {y}</p></Card>)}</div>
    {seg.qa && <><div className="mk-tag" style={{ margin: 0 }}>{t("O'quvchi so'rasa — bosib oching", "Если ученик спросит — нажмите, чтобы открыть")}</div><QA items={QA23} /></>}
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
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: Jest sozlamasi, ko'rinmas belgi, yolg'on testlar, toBe va toEqual, chegara va AI testi. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi «AI test yozdi, hammasi yashil» desa, nimani tekshirishni bilasiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
  { k: 'unit', t: "Unit-test — bitta funksiya va bitta qoida; Telegram, baza va .env kerak emas — bot ham, sayt ham bir xil sinaladi. Smoke — «ishlayaptimi», unit-test — «shu qoida buzilmadimi»", st: ['jest'] },
  { k: 'cfg', t: "Jest: rootDir: src, testRegex: .spec.ts — fayl sinaladigan faylning yonida; No tests found — joy va nom", st: ['jest'] },
  { k: 'fail', t: "FAIL: ● → Expected / Received → > satr va raqam; bir xil ko'rinsa — ko'rinmas belgi (" + ESC + ") yoki massivni toBe bilan solishtirish (toEqual)", st: ['jest', 'code'] },
  { k: 'lie', t: "Yolg'on test ikki xil: expect yo'q · etalon koddan olingan; toBeTruthy — bormi, to'g'rimi emas", st: ['code'] },
  { k: 'edge', t: "Har status — bitta test; har shartga chegara testi: birinchi, oxirgi, yagona", st: ['code'] },
  { k: 'ai', t: "AI testini qabul qilish: diff faqat .spec.ts · har it'da expect · etalon qo'lda · kodni buzib, test qizarishini ko'rish. Sinf: m4b-01 — haqiqiy FAIL, «kim xato», chegara, bir marta buzdirish", st: ['ai', 'code'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (BotMap + Jest qatori); har band rasmning o'z qismini yoritadi
const MAP25 = {
  unit: { on: UNIT_ON, tgSub: 'texts · keyboards', jest: { cmd: 'npm test', files: ['texts.spec.ts', 'keyboards.spec.ts'], res: 'pass', txt: '10 passed' } },
  cfg: { on: UNIT_ON, tgSub: 'texts.ts', jest: { cmd: 'rootDir: src · .spec.ts', files: ['src/api/telegram/texts.spec.ts'], res: 'pass' } },
  fail: { on: UNIT_ON, tgSub: 'texts.ts · som()', jest: { cmd: 'npx jest texts', files: ['texts.spec.ts'], res: 'fail', txt: '1 failed' } },
  lie: { on: UNIT_ON, tgSub: 'texts.ts · som()', jest: { cmd: 'npx jest yolgon', files: ['yolgon.spec.ts'], res: 'pass', get txt() { return t('expectsiz', 'без expect'); } } },
  edge: { on: UNIT_ON, tgSub: 'keyboards.ts', jest: { cmd: 'npx jest keyboards', files: ['orderKeyboard', 'catalogKeyboard'], res: 'pass', txt: '8 passed' } },
  ai: { on: UNIT_ON, tgSub: 'texts · keyboards', jest: { cmd: 'AI', files: ['texts.spec.ts', 'keyboards.spec.ts'], res: 'pass', txt: '36 passed' } },
};
function SummaryMap25({ hl }) {
  const m = MAP25[hl] || MAP25.unit;
  return <div className="mk-light" style={{ padding: 14 }}>
    <BotMap loc={DB_ALL} {...m} max={1.05} tag={t("Bugungi dars — buyurtma botining qoidalari test bilan", 'Сегодняшний урок — правила бота заказов под тестами')} />
  </div>;
}
const HOMEWORK25 = [
  { t: "O'z nusxangiz — Telegraf+PG darsidagi o'z reposingizda yangi tarmoq (yoki jest1-start dan)", c: ['git checkout -b tests'] },
  { t: "Testlar — texts.spec.ts ga: texts.orderPlaced, texts.orderLine, texts.statusChanged, texts.customerStatus; narx qoidasi: price va product.price har xil bo'lgan buyurtma", c: ['npm test'] },
  { t: "To'rt buzish — som formati · i.price ?? i.product.price → i.product.price · STATUS_UZ matni · o'zingiz tanlagan bitta joy; har biridan keyin npm test va git checkout", c: ['git checkout -- src/api/telegram/texts.ts'] },
  { t: "README «Testlar» bo'limi: buzish → qizargan test nomi (4 qator); AI bilan yozgan bo'lsangiz — AI qaysi shartni bajarmadi va siz qanday ushladingiz", c: [] },
  { t: 'Topshirish — git push → repo linki platformadagi uyga vazifaga', c: ['git add . && git commit -m "texts testlari"', 'git push'] },
];
const CHEATSHEET25 = `# Jest — mentor eslatmasi (OrderBotNest, birinchi testlar)
## Loyiha
git fetch --tags · git checkout jest1-start (test yo'q) → jest1-done (texts.spec.ts, keyboards.spec.ts) · npm test [-- texts | -- keyboards] · .env va baza kerak emas
## Jest qayerdan topadi (package.json → jest)
rootDir: "src" · testRegex: ".*\\\\.spec\\\\.ts$" · transform: ts-jest → fayl src/ ichida, sinaladigan faylning yonida, nomi .spec.ts · aks holda: No tests found, exiting with code 1
## Test qolipi
describe('som', () => { it("120000 ni so'mda yozadi", () => { expect(som(120000)).toBe("120${ESC}000 so'm"); }); });
## FAIL o'qish
● describe › it → Expected (etalon) / Received (funksiya qaytargani) → > satr va ^ → at … (texts.spec.ts:5:25)
## Bir xil ko'rinadi, lekin FAIL
toLocaleString('ru-RU') minglarni U+00A0 (bo'linmas probel) bilan ajratadi → etalonda ${ESC} ochiq yoziladi, belgining o'zi emas
massiv va obyekt: toBe → «serializes to the same string» → toEqual · Telegraf tugmaga hide: false qo'shadi → kerakli qismini ajrating
## Yolg'on testlar
expect yo'q (console.log) → doim PASS · etalon koddan: \`Jami: \${som(100000)}\` → som buzilsa ham PASS · toBeTruthy → matn o'zgarsa ham PASS
## Statuslar va chegara
har status — bitta it · har shartga chegara: birinchi, oxirgi, yagona sahifa · < va <= farqi faqat chegarada
## AI testini qabul qilish
git diff --stat — faqat .spec.ts · har it'da expect · etalonda \${som( / \${STATUS_UZ yo'q · grep -c 'u00a0' (escape matni bormi) · kodni 3–4 joyda buzing — har biri qizarsin
## Sinfga tayyorgarlik (m4b-01, 21 ekran)
KitobShop sayti · orderTotal · Jestbot = Jest, papka = describe, varaqa = it, etalon kartochkasi = expect · siz qo'shasiz: haqiqiy FAIL, «kim xato», chegara 100 000, bir marta buzdirish
## Xatolar
No tests found → joy va nom · npm ci … in sync → npm install · Cannot find module './texts' → fayl joyi · bo'sh loyiha: Must use import → npx ts-jest config:init · Cannot find name 'describe' → @types/jest · TypeScript 7 → typescript@5
## Sizning uyga vazifangiz (40–60 daqiqa)
texts.orderPlaced, orderLine, statusChanged, customerStatus testlari + buyurtma paytidagi narx qoidasi + 4 buzish README jadvalida → GitHub → repo linki platformaga`;
const s25Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Unit-test — <b>bitta funksiya va bitta qoida</b>; bot ham, sayt ham bir xil sinaladi", "Birinchi: unit-test bitta funksiyani va bitta qoidani tekshiradi. Telegram, baza va env fayli kerak emas, shuning uchun bot ham, sayt ham bir xil sinaladi. Smoke ishlayaptimi deydi, unit-test esa shu qoida buzilmadimi deydi.", { hl: 'unit' }),
  sg('b2', "Jest faylni <b>src ichidan, .spec.ts nomidan</b> topadi", "Ikkinchi: Jest test faylini src papkasi ichidan va spec ts nomidan topadi. No tests found chiqsa, kodni emas, fayl joyi va nomini tekshiring.", { hl: 'cfg' }),
  sg('b3', "FAIL: <b>Expected, Received, satr raqami</b>; bir xil ko'rinsa — ko'rinmas belgi yoki toEqual", "Uchinchi: FAIL'ni yuqoridan pastga o'qiysiz: nuqtali satr, expected va received, keyin satr raqami. Ikki qator bir xil ko'rinsa, ko'rinmas belgini qidiring. Massiv va obyektni to equal bilan solishtiring.", { hl: 'fail' }),
  sg('b4', "Yolg'on test ikki xil: <b>expect yo'q yoki etalon koddan</b>", "To'rtinchi: yolg'on test ikki xil bo'ladi. Birida expect yo'q, ikkinchisida etalon kodning o'zidan yasalgan. To be truthy esa qiymat borligini tekshiradi, to'g'riligini emas.", { hl: 'lie' }),
  sg('b5', "Har status — <b>bitta test</b>; har shartga <b>chegara testi</b>", "Beshinchi: har statusga bitta test yozasiz. Har shartning chegarasiga alohida test: birinchi, oxirgi va yagona sahifa. Kichik va kichik yoki teng farqi faqat chegarada ko'rinadi.", { hl: 'edge' }),
  sg('b6', "AI testini <b>buzib tekshirib</b> qabul qilasiz; sinfda — bir marta buzdirish", "Oltinchi: AI yozgan testni sonidan emas, buzib tekshirib qabul qilasiz. Diff, expect, qo'lda etalon va kamida uchta buzish. Sinfda o'quvchi testi yashil bo'lsa, kodni bir marta o'zi buzsin.", { hl: 'ai' }),
  sg('hw', "<b>Uyga vazifa</b>: buyurtma matnlari testlari va buyurtma paytidagi narx qoidasi", "Uyga vazifa: OrderBotNest'ning o'z nusxangizda buyurtma matnlari uchun testlar yozing. Muhim qoida: xabarda buyurtma paytidagi narx chiqadi, mahsulotning hozirgi narxi emas. Bunga alohida test yozing. AI bilan yozsangiz ham bo'ladi.", { hl: 'hw' }),
  sg('hw2', "<b>To'rt buzish</b> va README jadvali; repo linki platformaga", "Keyin to'rtta buzish qiling va har birida qaysi test qizarganini README'ga jadval qilib yozing. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: sozlama, FAIL o'qish, yolg'on testlar va AI tekshiruvi — bir sahifada", "Pastda bir sahifalik eslatma: Jest sozlamasi, test qolipi, FAIL o'qish, ko'rinmas belgi, yolg'on testlar, AI testini qabul qilish, xatolar va sinfga tayyorgarlik. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET25, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('jest-birinchi-testlar-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
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
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 40–60 daqiqa', 'Домашнее задание · 40–60 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK25.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}>{t(<><b>Tekshiruvchi qaraydi:</b> etalonlar qo'lda (<code>{'${som('}</code> yo'q) · narx qoidasi testi bor · README jadvalida 4 buzish va har biri qizargan.</>, <><b>Проверяющий смотрит:</b> эталоны вручную (нет <code>{'${som('}</code>) · есть тест правила цены · в таблице README 4 поломки, и каждая покраснела.</>)}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("Jest: edge cases va xato yo'li", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("toThrow, Service'ni mock bilan sinash va saytning API'siga birinchi HTTP test", RS('NEXT_D'))}</div></div>
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
          {t(["OrderBotNest'ning qoidalariga unit-test yozasiz va FAIL'ni o'qiysiz: Expected, Received, satr", "yolg'on testni taniysiz: expect yo'q, etalon koddan olingan, toBeTruthy", "AI yozgan testni kodni buzib tekshirasiz: qizarmagan joy — himoyasiz"], ["напишете unit-тесты на правила OrderBotNest и прочитаете FAIL: Expected, Received, строка", 'узнаете ложный тест: нет expect, эталон взят из кода, toBeTruthy', 'проверите тест от AI, ломая код: не покраснело — не защищено']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 10–25 daqiqa, 11-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: OrderBotNest kompyuteringizda, Node.js 20+, VS Code, AI yordamchi; baza va bot tokeni kerak emas · Loyiha: jest1-start tegi", 'Урок со звуком · 1 ч 10–25 мин, после 11-го экрана можно сделать перерыв · Нужно: OrderBotNest на компьютере, Node.js 20+, VS Code, AI-помощник; база и токен бота не нужны · Проект: тег jest1-start')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><BotMap loc={DB_ALL} on={UNIT_ON} tgSub="texts · keyboards" jest={{ cmd: 'npm test', files: ['texts.spec.ts', 'keyboards.spec.ts'], res: 'pass', txt: '10 passed' }} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, ScreenP8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, Screen16, ScreenP17, Screen18, Screen19, Screen20, ScreenP21, Screen22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function JestUnitMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
