
// ============================================================
//  25 · Sinfga tayyorgarlik: m5-04 (BotStatefulMemoryLesson.jsx — SCREEN_META 20; TelegramBotNest dars-04-done)
// ============================================================
const ADD25 = [['\\d users — telegram_id bigint', 'amaliyot, AI yozgandan keyin'], ['/start ikki marta — SELECT count(*)', 'amaliyot, Telegram tekshiruvi'], ['restart ism so\'ralganda', 'amaliyot oxiri'], ['sslmode=require o\'chirilmasin', 'Neon qadami'], ['AI fayllari — git diff --stat', 'Antigravity qadami']];
const S25 = mkS(25, [{ v: 'cards' }, { v: 'cards', hlO: true }, { v: 'add' }, { v: 'pre' }]);
function Screen25(p) {
  return <Lesson p={p} S={S25} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m5-04 (20 ekran)", "Ученик · m5-04 (20 экранов)")} hl={seg.hlO}><p><code>TelegramBotNest</code>{t(" · dars-03-done → dars-04-done · bitta ", " · dars-03-done → dars-04-done · одна ")}<code>users</code> (<code>telegram_id bigint unique</code>, <code>ism</code>, <code>holat</code>{t(" — reponing state'i) · Neon (", " — state репозитория) · Neon (")}<code>sslmode=require</code>{t(") · Antigravity'ga 3 qatorli prompt · ", ") · промпт Antigravity из 3 строк · ")}<code>synchronize: true</code></p></Card>
      <Card c={T.accent} h={t("Siz · bugun", "Вы · сегодня")}><p>{t("OrderBotNest · tgpg-start → tgpg-done · 5 jadval · migratsiya · 4 bosqich · besh tekshiruv · ", "OrderBotNest · tgpg-start → tgpg-done · 5 таблиц · миграция · 4 этапа · пять проверок · ")}<code>npm run smoke</code></p></Card>
    </div>}
    {seg.v === 'add' && <table className="pg-dict"><tbody>{ADD25.map(([a, b]) => <tr key={a}><td><code>{a}</code></td><td>{b}</td></tr>)}</tbody></table>}
    {seg.v === 'pre' && <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">{t("Darsdan oldin", "До урока")}</div><div className="mk-plan">
      {[t('Har o\'quvchida Neon akkaunti ochiladi', "У каждого ученика открывается аккаунт Neon"), t("BotFather'da sinov boti bor (token)", "В BotFather есть тестовый бот (токен)"), t('dars-03-done boti ishlab turibdi', "бот dars-03-done работает")].map((x, i) => <div key={x}><b>0{i + 1}</b><span>{x}</span></div>)}
    </div></div>}
  </>} />;
}

// ============================================================
//  26 · Qoqiladigan joylar (tgpg-out/11, 13 — TelegramBotNest; orderbot-out/12-k4) + o'quvchi savollari
// ============================================================
const CARDS26 = [
  ['Bot javob bermaydi', 'Telegram ulanmadi: 401: Unauthorized (server «ishlayapti»)', 'token — BotFather'],
  ['Server yonmaydi', 'DATABASE_URL topilmadi. .env ga Neon bergan URL ni yozing', '.env'],
  ['Restartdan keyin ism unutildi', 'xato yo\'q, «Salom! Ismingiz nima?»', 'state bazaga yozilmayapti — SELECT … FROM users'],
  ['Katta id', 'value "5123456789" is out of range for type integer · yoki duplicate key', 'bigint; avval qidirish yoki ON CONFLICT'],
];
const QA26 = [
  ['«AI yozdi, ishlayapti — yana nega tekshiramiz?»', 'Bitta sinovda ko\'rinmaydigan xato bor: restart va ikki marta bosish (11, 14-ekran).'],
  ['«Nega synchronize: true, ishlab turgan loyihada ham shundaymi?»', 'Yo\'q: u ustunni ogohlantirmasdan o\'chirishi mumkin; ishlab turgan loyihada migratsiya (9-ekran).'],
  ['«Telegram id raqam-ku, nega bazadan matn keldi?»', 'bigint JavaScript sonidan katta bo\'lishi mumkin, kutubxona matn beradi (13-ekran).'],
  ['«Neon o\'rniga o\'z kompyuterimdagi PostgreSQL bo\'ladimi?»', 'Ha, DATABASE_URL ni o\'zgartirasiz; botni hostingga chiqarganda baza internetda bo\'lishi kerak.'],
  ['«Ikki kishi bir vaqtda yozsa, ismlar aralashadimi?»', 'Yo\'q, har qator telegram_id bo\'yicha alohida.'],
];
function QA({ items }) {
  const [open, setOpen] = useState(-1);
  return <div className="pg-qa">{items.map(([q, a], i) => <button key={q} onClick={() => setOpen(open === i ? -1 : i)}><b>{q}</b>{open === i && <p>{a}</p>}</button>)}</div>;
}
const S26 = mkS(26, [{ on: [] }, { on: [0, 1] }, { on: [2, 3] }, { on: [0, 1, 2, 3], qa: true }]);
function Screen26(p) {
  return <Lesson p={p} S={S26} scene={({ seg }) => <>
    <div className="pg-2c">{CARDS26.map(([h, x, y], i) => <Card key={h} c={i < 2 ? T.blue : T.accent} h={`${i + 1} · ${h}`} hl={seg.on.includes(i) && !seg.qa} dim={seg.on.length > 0 && !seg.on.includes(i)}><p><code>{x}</code></p><p style={{ marginTop: 4 }}>→ {y}</p></Card>)}</div>
    {seg.qa && <><div className="mk-tag" style={{ margin: 0 }}>{t("O'quvchi so'rasa — bosib oching", "Если ученик спросит — нажмите, чтобы открыть")}</div><QA items={QA26} /></>}
  </>} />;
}

// ============================================================
//  27 · O'z-sinov — 8 savol (MD 27, FINAL)
// ============================================================
const FINAL = MDT[27].final;
function Screen27(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = LANG === 'ru' ? (!st.showResult ? RS('FIN_INTRO')
      : sc >= 6 ? 'Ваш результат сохранён: ' + sc + ' из восьми. Урок усвоен, нажмите «Далее».'
        : 'Хорошо, одну ошибку вы разобрали. Вернитесь и к экранам остальных красных вопросов. Когда будете готовы, нажмите кнопку «Пройти тест заново».')
      : !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: xotira va restart, bosqichlar, migratsiya, big int, on conflict, qulf va tranzaksiya. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi AI bilan bot yozganda, nimani tekshirishni bilasiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
//  28 · Yakun (M13, M14, M30) — xulosa 6 band, uyga vazifa 5 qadam, eslatma
// ============================================================
const SUM28 = [
  { k: 'mem', t: "Xotiradagi ma'lumot (Map, massiv) restartda yo'qoladi yoki koddagi boshlang'ich qiymatga qaytadi; saqlanishi kerak bo'lgan har narsa — bazada", st: ['bot', 'pg'] },
  { k: 'ai', t: "AI bilan ish: bitta prompt — bitta bosqich; prompt besh qismli (kontekst · maqsad · shartlar · chegara · javob); javob uch qismdan o'qiladi (fayllar · chetga chiqish · tekshiruv)", st: ['ai'] },
  { k: 'orm', t: "TypeORM: entity tasvirlaydi, migratsiya yaratadi, migrations jadvali eslaydi; synchronize: false; o'zgarish — yangi migratsiya", st: ['orm', 'pg'] },
  { k: 'id', t: "Telegram id — BIGINT, kodga matn bo'lib keladi; takror qator — UNIQUE + ON CONFLICT; state bazada — suhbat o'rtasidagi restartdan o'tadi", st: ['bot', 'orm', 'pg'] },
  { k: 'tx', t: "Buyurtma — bitta tranzaksiya; qoldiq qulf bilan o'qiladi yoki bitta UPDATE … WHERE stock >= qty; tranzaksiyada xatodan keyin faqat ROLLBACK", st: ['orm', 'pg'] },
  { k: 'chk', t: "Besh tekshiruv har bosqichda: diff · build · restart · psql · ko'p mijoz (npm run smoke). Sinf: m5-04 — \\d users, ikki marta /start, restart ism so'ralganda", st: ['ai', 'bot', 'pg'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (BotMap); har band rasmning o'z qismini yoritadi
const MAP28 = {
  mem: { restart: true, on: ['mem', 'products', 'users', 'carts', 'orders'], chat: ['/cart', "Savat bo'sh. /catalog dan mahsulot tanlang.", 'bad'] },
  ai: { loc: DB_ALL, badge: STAGE_NO, on: ['db', 'products', 'users', 'carts', 'orders'] },
  orm: { loc: DB_ALL, on: ['db', 'products', 'users', 'carts', 'orders'] },
  id: { loc: DB_ALL, on: ['user', 'users', 'carts'], note: { users: 'BIGINT · state bazada' } },
  tx: { loc: DB_ALL, tx: 'commit', ops: { products: 'UPDATE', orders: 'INSERT', carts: 'DELETE' }, on: ['order', 'products', 'orders', 'carts'] },
  chk: { loc: DB_ALL, clients: 5, on: ['phone', 'order', 'products'], note: { products: 'Planshet · sotildi 1 / 0' } },
};
function SummaryMap28({ hl }) {
  const m = MAP28[hl] || { loc: DB_ALL, chat: CHAT_ORDER };
  return <div className="mk-light" style={{ padding: 14 }}>
    <BotMap {...m} max={0.95} tag={t("Bugungi dars — botdan bazagacha, AI bilan", "Сегодняшний урок — от бота до базы, с AI")} />
  </div>;
}
const HOMEWORK28 = [
  { t: "O'z nusxangiz — GitHub'da yangi repo, OrderBotNest'ni unga chiqaring (tgpg-done yoki o'z 4-bosqichingiz)", c: ['git remote set-url origin <sizning repo>', 'git push -u origin main'] },
  { t: "/report — faqat admin: bugungi buyurtmalar soni va summasi (CANCELLED hisobga olinmaydi), order_items bo'yicha top-3 (JOIN, GROUP BY, SUM). O'sha SQL'ni psql'da o'zingiz yozib, natijani bot javobi bilan solishtiring", c: [] },
  { t: "Ogohlantirish — COMMIT'dan keyin qoldiq 2 dan kam bo'lgan mahsulot haqida adminga xabar; tranzaksiya ichida Telegram'ga so'rov yuborilmasin", c: [] },
  { t: "Besh tekshiruv — diff · build · restart · psql · ko'p mijoz", c: ['npm run smoke'] },
  { t: "README «AI bilan ish»: har bosqich prompti, AI chetga chiqqan joylar, tekshiruv topgan xatolar → git push → repo linki platformadagi uyga vazifaga", c: ['git add -A && git commit -m "report + ogohlantirish"', 'git push'] },
];
const CHEATSHEET28 = `# Telegraf + PostgreSQL — mentor eslatmasi (OrderBotNest, AI bilan)
## Loyiha
git clone https://github.com/Azizbekcrypto/OrderBotNest.git · git checkout tgpg-start (xotirada) → tgpg-done (bazada) · npm run smoke [-- restart | race]
## To'rt bosqich — bitta prompt, bitta bosqich
1 ulanish + katalog (TypeORM, migratsiya, products, seed) · 2 users + state (BIGINT, WAITING_PHONE) · 3 savat (UNIQUE, ON CONFLICT) · 4 buyurtma (tranzaksiya, qulf, bekor → ombor)
## Besh qismli prompt
kontekst (loyiha nima, hozir qanday) · bitta bosqich maqsadi · qat'iy shartlar (har biri tekshiriladi) · nimaga tegmaslik · javobda nima (fayllar + tekshirish)
## AI javobini o'qish
fayllar ro'yxati = git diff --stat · «chetga chiqdim» qismi va sababi · tekshirish buyruqlarini o'zingiz yurgizing — «sinadim» isbot emas
## TypeORM
entity tasvirlaydi · migratsiya yaratadi · migrations jadvali eslaydi · synchronize: false · migrationsRun: true · o'zgarish — yangi migratsiya
## Tuzoqlar (hammasi haqiqiy yurgizishdan)
oraliq vaziyat: buyurtma xotirada, ombor bazada → restartdan keyin buyurtma yo'q, ombor kamaygan
Telegram id > 2 147 483 647 → BIGINT; node-pg va TypeORM BIGINT'ni matn qaytaradi: "5123456789" === 5123456789 → false (Mongoose'da number)
INTEGER ustun → value "5123456789" is out of range for type integer, bot «Tushunmadim»
avval SELECT, keyin INSERT — UNIQUE'siz 19/20 urinishda 2 qator → UNIQUE + INSERT … ON CONFLICT DO UPDATE (Mongoose upsert ham unique index'siz 2 hujjat)
qulfsiz findOneBy → save: 1 ta Planshet 5 kishiga sotildi, CHECK xato bermaydi (0 manfiy emas) → lock: pessimistic_write yoki UPDATE … WHERE stock >= qty
tranzaksiyada CHECK xatosidan keyin so'rov → current transaction is aborted → tekshiruv UPDATE'dan oldin; CHECK — oxirgi qo'riqchi
ikki marta bir vaqtda «Bekor» → ombor 2 marta qaytdi → buyurtma qatori FOR UPDATE
## Besh tekshiruv
diff · build (tsc, nest build) · restart suhbat o'rtasida · psql (\\d, CHECK, bigint, SELECT) · ko'p mijoz (npm run smoke -- race)
## Xatolar
BOT_TOKEN topilmadi → .env · DATABASE_URL topilmadi → .env · Unable to connect … database "shop" does not exist → CREATE DATABASE shop · password authentication failed → parol · Telegram ulanmadi: 401 → token (server ishlayveradi) · 409 Conflict → ikkinchi nusxa (sinalmagan)
## Sinfga tayyorgarlik (m5-04, 20 ekran)
TelegramBotNest dars-03-done → dars-04-done · Neon (sslmode=require) · Antigravity 3 qatorli prompt · synchronize: true · siz qo'shasiz: \\d users (bigint), ikki marta /start, restart ism so'ralganda, git diff --stat
## Sizning uyga vazifangiz (60–90 daqiqa)
/report (JOIN + GROUP BY + SUM, CANCELLED'siz) + kam qoldiq ogohlantirishi (COMMIT'dan keyin) + besh tekshiruv + README «AI bilan ish» → GitHub → repo linki platformaga`;
const s28Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Xotiradagi ma'lumot <b>restartda yo'qoladi</b> — saqlanishi kerak bo'lgan har narsa bazada", "Birinchi: Map va massiv jarayon xotirasida, restartda yo'qoladi yoki koddagi boshlang'ich qiymatga qaytadi. Saqlanishi kerak bo'lgan har narsa bazada turadi.", { hl: 'mem' }),
  sg('b2', "AI bilan: <b>bitta prompt — bitta bosqich</b>; prompt besh qismli, javob uch qismdan o'qiladi", "Ikkinchi: AI bilan ishda bitta prompt, bitta bosqich. Prompt besh qismli: kontekst, maqsad, shartlar, chegara va javob. AI javobini uch qismdan o'qiysiz: fayllar, chetga chiqish va tekshiruv.", { hl: 'ai' }),
  sg('b3', "TypeORM: <b>entity, migratsiya, migrations jadvali</b>; o'zgarish — yangi migratsiya", "Uchinchi: entity jadvalni tasvirlaydi, migratsiya uni yaratadi, migrations jadvali qaysi fayl yurganini eslaydi. Jadvalni o'zgartirish uchun yangi migratsiya yoziladi.", { hl: 'orm' }),
  sg('b4', "Telegram id — <b>BIGINT, kodga matn</b>; takror qator — UNIQUE va ON CONFLICT; state bazada", "To'rtinchi: Telegram id big int, va u kodga matn bo'lib keladi. Takror qatorga qarshi UNIQUE va on conflict. State bazada bo'lsa, suhbat o'rtasidagi restartdan o'tadi.", { hl: 'id' }),
  sg('b5', "Buyurtma — <b>bitta tranzaksiya va qulf</b>; xatodan keyin faqat ROLLBACK", "Beshinchi: buyurtma bitta tranzaksiya. Qoldiq qulf bilan o'qiladi yoki bitta update where stock katta yoki teng qty bilan ayiriladi. Tranzaksiyada xatodan keyin faqat rollback qoladi.", { hl: 'tx' }),
  sg('b6', "<b>Besh tekshiruv</b> har bosqichda; sinfda — <b>\\d users</b>, ikki marta /start, restart", "Oltinchi: har bosqichda besh tekshiruv: diff, build, restart, PostgreSQL terminali va ko'p mijoz. Sinfda o'quvchi bilan backslash d users, ikki marta start va restartni ism so'ralganda qiling.", { hl: 'chk' }),
  sg('hw', "<b>Uyga vazifa</b>: o'z nusxangizda admin uchun /report va kam qoldiq ogohlantirishi", "Uyga vazifa: OrderBotNest'ning o'z nusxangizga admin uchun ikki imkoniyat qo'shing, AI bilan, ikki bosqichda. Birinchisi report buyrug'i: bugungi buyurtmalar soni, summasi va eng ko'p sotilgan uchta mahsulot. Ikkinchisi: qoldiq ikkitadan kam qolsa, adminga ogohlantirish.", { hl: 'hw' }),
  sg('hw2', "Har bosqichdan keyin <b>besh tekshiruv</b>; README'da AI tahlili; repo linki platformaga", "Har bosqichdan keyin besh tekshiruvni qiling. README'ga AI nimani to'g'ri, nimani noto'g'ri qilgani va siz uni qanday ushlaganingizni yozing. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying. Oltmish-to'qson daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: bosqichlar, prompt, tuzoqlar va tekshiruvlar — bir sahifada", "Pastda bir sahifalik eslatma: to'rt bosqich, prompt qolipi, AI javobini o'qish, tuzoqlar, besh tekshiruv, xatolar va sinfga tayyorgarlik. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen28(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET28, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('telegraf-postgresql-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s28Segments(passed), [passed]);
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
            <SummaryMap28 hl={hl} />
            {/* F-1120-02: bandlar rasm ostida ixcham to'rda — rasm surilib ketmasin (M51-2) */}
            <div className="n1-plan" style={{ position: 'static', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, marginTop: 10 }}>{SUM28.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span style={{ fontSize: 12.5 }}>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 60–90 daqiqa', 'Домашнее задание · 60–90 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK28.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>{t("Tekshiruvchi qaraydi:", "Проверяющий смотрит:")}</b>{t(" /report raqamlari psql bilan mos · CANCELLED chiqarilgan · ogohlantirish tranzaksiyadan keyin · README'da AI tahlili (kamida bitta topilma).", " числа /report совпадают с psql · CANCELLED исключён · предупреждение после транзакции · в README разбор AI (хотя бы одна находка).")}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t("Kursdagi keyingi mentor darsi", "Следующий урок курса для менторов")}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("Jest: OrderBotNest'ga birinchi testlar", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("Yozamiz, buzamiz va AI yozgan testni tekshiramiz", RS('NEXT_D'))}</div></div>
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
        <p className="mk-eyebrow">{t("Mentor kursi · Telegraf + PostgreSQL", "Курс для менторов · Telegraf + PostgreSQL")}</p>
        <h1>{t(LESSON_TITLE, RS('TITLE'))}</h1>
        <p className="af">{t('Bu darsdan keyin siz', 'После этого урока вы')}</p>
        <ul className="ok">
          {t(["tayyor botning ma'lumotini AI bilan PostgreSQL'ga to'rt bosqichda ko'chirasiz", "har bosqichni o'zingiz tekshirasiz: diff, build, restart, psql va ko'p mijoz", "buyurtmani tranzaksiyada yozasiz va bitta mahsulot ikki kishiga sotilmasligini isbotlaysiz"], ["перенесёте данные готового бота в PostgreSQL с AI за четыре этапа", 'сами проверите каждый этап: diff, build, restart, psql и много клиентов', 'запишете заказ в транзакции и докажете, что один товар не продаётся двоим']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 40 daqiqa – 2 soat, 12-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: PostgreSQL ishlab turgan, Node.js 20+, VS Code, AI yordamchi, BotFather'da sinov boti · Loyiha: github.com/Azizbekcrypto/OrderBotNest (tgpg-start)", "Урок со звуком · 1 ч 40 мин – 2 ч, после 12-го экрана можно сделать перерыв · Нужно: работающий PostgreSQL, Node.js 20+, VS Code, AI-помощник, тестовый бот в BotFather · Проект: github.com/Azizbekcrypto/OrderBotNest (tgpg-start)")}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><BotMap loc={DB_ALL} chat={CHAT_ORDER} note={{ orders: '#1 · 220000 · CONFIRMED' }} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, ScreenP5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, ScreenP12, Screen13, Screen14, Screen15, Screen16, ScreenP17, Screen18, Screen19, Screen20, Screen21, Screen22, ScreenP23, Screen24, ScreenAI5, Screen25, Screen26, Screen27, Screen28]; // F-1125-01: ScreenAI5 (Tekshiruv 5) — saytda 25-ekran; MD 25–28 saytda 26–29 (M57)
const PRACTICE_COUNT = [ScreenP5, ScreenP12, ScreenP17, ScreenP23].filter((S) => SCREENS.includes(S)).length; // 26.11 (F-1125-01): havola bo'yicha — build (minify) funksiya nomini qisqartiradi, nom bo'yicha son 0 chiqib passed doim false edi
export default function TgPgMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
