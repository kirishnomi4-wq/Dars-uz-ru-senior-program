
// ============================================================
//  24 · Sinf kompyuterlari: m4-06 dan oldin
// ============================================================
const CHECK23 = ['PostgreSQL 18 o\'rnatilgan (Windows: EDB · Mac: Postgres.app)', 'psql PATH\'da — yangi terminalda psql --version', 'Sinf paroli — hamma kompyuterda bir xil', 'psql -U postgres -c "SELECT version();" — qayta yoqilgandan keyin ham'];
const VER23 = psql(String.raw`
$ psql -U postgres -c "SELECT version();"
                                version
-------------------------------------------------------------------------
 PostgreSQL 18.4 … 64-bit
(1 row)`);
const S23 = mkS(24, [{ v: 'line', on: 0 }, { v: 'line', on: 1 }, { v: 'list', on: 3 }, { v: 'list', on: 4, ver: true }, { v: 'list', on: 4 }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {seg.v === 'line' && <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag">{t("O'quvchi darslari — PostgreSQL qayerdan kerak", 'Уроки ученика — с какого места нужен PostgreSQL')}</div>
      <div className="mk-plan">
        <div className={seg.on === 1 ? '' : ''}><b>m4-03</b><span>{t('SQL vs NoSQL — kodsiz, baza kerak emas', 'SQL vs NoSQL — без кода, база не нужна')}</span></div>
        <div className={seg.on === 1 ? 'hl' : ''}><b>→</b><span>{t(<><b>Shu oraliqda:</b> sinf kompyuterlariga PostgreSQL'ni siz o'rnatasiz</>, <><b>В этом промежутке:</b> вы устанавливаете PostgreSQL на компьютеры класса</>)}</span></div>
        <div><b>m4-06</b><span>{t("CRUD — o'quvchi so'rov yozishni boshlaydi", 'CRUD — ученик начинает писать запросы')}</span></div>
        <div className={seg.on === 0 ? 'hl' : ''}><b>m4-08</b><span>{t(<>AvtoIjara: <code>psql -U postgres</code> va «o'rnatishda berilgan parol» — tayyor deb kutiladi</>, <>AvtoIjara: <code>psql -U postgres</code> и «пароль, заданный при установке» — ожидается, что всё готово</>)}</span></div>
      </div>
    </div>}
    {seg.v === 'list' && <div className="mk-light" style={{ padding: 14 }}>
      <div className="mk-tag" style={{ color: T.accent }}>{t('Darsdan oldin — har sinf kompyuterida', 'Перед уроком — на каждом компьютере класса')}</div>
      <div style={{ display: 'grid', gap: 8 }}>{CHECK23.map((x, i) => <div key={i} className={`mk-step${i < seg.on ? '' : ' '}${(seg.on === 3 && i === 2) || (seg.on === 4 && i === 3) ? ' hl' : ''}`} style={{ opacity: i < seg.on ? 1 : 0.45 }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, color: i < seg.on ? T.green : T.ink3, minWidth: 20 }}>{i < seg.on ? '☑' : '☐'}</span><div className="t"><b>{x}</b></div></div>)}</div>
    </div>}
    {seg.on === 3 && <div className="n2-warn">{t(<>Fakt: kursdagi Nest loyihasining <code>.env.example</code> faylida — <code>postgres://postgres:<b>password</b>@localhost:5432/…</code>. Sinf paroli shu bo'lsa, o'quvchi faylni o'zgartirmaydi.</>, <>Факт: в файле <code>.env.example</code> Nest-проекта курса — <code>postgres://postgres:<b>password</b>@localhost:5432/…</code>. Если пароль класса такой же, ученику не придётся менять файл.</>)}</div>}
    {seg.ver && <Psql title={t('terminal — sinf kompyuteri', 'терминал — компьютер класса')} lines={VER23} />}
  </>} />;
}

// ============================================================
//  25 · m4-03 xaritasi
// ============================================================
const MAP03 = [
  { t: 'Kirish', s: 's0–s1', d: "«SQL ko'rinishimi, NoSQL ko'rinishimi?» → «Ikkalasi ham to'g'ri — vazifaga bog'liq» · reja (5 qadam)", m: "Mongo bilan ishlagan bo'lsangiz — bir gap bilan ayting (3-ekran)" },
  { t: 'Ikki tur va shakl', s: 's2–s4', d: 'jadval / hujjat · kartalarni jadvalga joylash · test', m: 'jadvalda ustun turi oldindan, hujjatda erkin (5-ekran)' },
  { t: 'Kuchlar', s: 's5–s7', d: 'JOIN — id orqali bog\'lash · test · oxirgi telefon · chat oqimi (NoSQL — hajm)', m: "ON satri (16-ekran) · telefonni nima saqlashi (19-ekran)" },
  { t: 'Qaror', s: 's8–s12', d: "4 mezon: bog'lanish · shakl · ishonchlilik · hajm · test (bank) · nega PostgreSQL (5 sabab) · AI tavsiyasi · test", m: "«JSON ham saqlaydi» — jsonb misoli (21-ekran)" },
  { t: 'Mustahkamlash', s: 's13–s16', d: "moslashtirish (bank, chat, do'kon, loglar) · mif-buster · yakuniy · amaliyot · kartochkalar · yakun", m: 'amaliyotdagi 2 jadval — siz bugun yaratgan users / posts' },
];
const TIME03 = [['0–20', 'kirish, ikki tur va shakl'], ['20–45', 'kuchlar: JOIN, oxirgi telefon, chat'], ['45–65', 'qaror ko\'rsatkichi, nega PostgreSQL, AI'], ['65–85', 'moslashtirish, mif, yakuniy, amaliyot', 1], ['85–90', 'yakun']];
const S24 = mkS(25, [{ hl: [] }, { hl: [0, 1] }, { hl: [2] }, { hl: [3, 4] }, { hl: [], time: true }]);
function Screen24(p) {
  return <Lesson p={p} S={S24} scene={({ seg }) => seg.time
    ? <div className="mk-light" style={{ padding: 14 }}><div className="mk-tag">{t('m4-03 · 90 daqiqa (taklif)', 'm4-03 · 90 минут (предложение)')}</div>
        <div style={{ display: 'grid', gap: 8 }}>{TIME03.map(([a, b, x]) => <div key={a} className={`mk-step${x ? ' hl' : ''}`}><span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 64 }}>{a}</span><div className="t">{b}</div></div>)}</div></div>
    : <div style={{ display: 'grid', gap: 8 }}>
        {MAP03.map((b, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
          <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 22 }}>{i + 1}</span>
          <div className="t"><b>{b.t} <span style={{ fontFamily: MONO, fontWeight: 500, color: T.ink3, fontSize: 12 }}>{b.s}</span></b><div style={{ fontSize: 13 }}>{b.d}</div>{(seg.hl.includes(i) || !seg.hl.length) && <div className="exp" style={{ color: T.accent, marginTop: 4 }}>{t("Siz qo'shasiz:", 'Вы добавляете:')} {b.m}</div>}</div>
        </div>)}
      </div>} />;
}

// ============================================================
//  26 · O'quvchi darsidagi so'zlar
// ============================================================
const DICT25 = [
  ["jadval — «Excel jadvaliga o'xshaydi», har qatorda bir xil ustunlar", 'table · row · column', 's2'],
  ["hujjat — «papkadagi turli qog'ozlar kabi», { }", 'document (MongoDB, Firebase)', 's2, kartochkalar'],
  ["ikki jadvalni id orqali bog'lash", 'JOIN … ON …, tashqi kalit', 's5'],
  ["oxirgi telefon — «SQL bir lahzada faqat bittasiga sotadi», «SQL nazorati»", 'shartli UPDATE + qator qulfi; tranzaksiya', 's6, kartochkalar'],
  ["qaror ko'rsatkichi — 4 savoldan iborat: ma'lumot bog'langanmi, shakli qat'iymi, xato qimmatga tushadimi, ulkan-oddiy-tez kerakmi", 'baza tanlash mezonlari', 's8, s15'],
  ["«NoSQL zamonaviyroq» — mif", "tanlov vazifaga bog'liq", 's14'],
  ['«JSON ham saqlaydi»', 'jsonb', 's10'],
];
const S25 = mkS(26, [{ rows: [] }, { rows: [0, 1] }, { rows: [2, 3, 4] }, { rows: [5, 6] }]);
function Screen25(p) {
  return <Lesson p={p} S={S25} scene={({ seg, beat }) => <div className="mk-light" style={{ padding: 14 }}>
    <div className="mk-tag">{t("O'quvchi darsidagi so'z → uning atamasi", 'Слово из урока ученика → термин')}</div>
    <table className="mk-tbl"><thead><tr><th>{t("o'quvchi darsida", 'в уроке ученика')}</th><th>{t('atama', 'термин')}</th><th>{t('qayerdan', 'откуда')}</th></tr></thead><tbody>
      {DICT25.map(([a, b, c], i) => <tr key={a} className={seg.rows.includes(i) ? 'hl' : ''} style={{ opacity: seg.rows.length && !seg.rows.includes(i) ? 0.55 : 1 }}><td>{a}</td><td><code>{b}</code></td><td style={{ color: T.ink3, fontSize: 12 }}>{c}</td></tr>)}
    </tbody></table>
    <Block at={3} beat={beat}><div className="mk-rule" style={{ marginTop: 12 }}>{t(<>Birga ayting: <b>«Excel jadvaliga o'xshaydi, ya'ni table»</b>. Farqini siz ko'rsatasiz: Excel qoidani tekshirmaydi, PostgreSQL bo'sh nomni ham, yo'q muallifni ham rad etadi.</>, <>Скажите вместе: <b>«похоже на таблицу Excel, то есть table»</b>. Разницу покажете вы: Excel правила не проверяет, а PostgreSQL отклоняет и пустое имя, и несуществующего автора.</>)}</div></Block>
  </div>} />;
}

// ============================================================
//  27 · Darsdagi soddalashtirishlar va o'quvchi savollari
// ============================================================
const SIMP26 = [
  { d: "Oxirgi telefonni «SQL nazorati — tranzaksiya» saqlaydi", a: "so'rovdagi shart (stock > 0) + qator qulfi; tranzaksiya — bir nechta ishni birga bajarish; Mongo ham bitta hujjatda bittaga sotdi", s: "darsdagi gap yetarli; kuchli o'quvchi so'rasa — «baza shartni qayta tekshiradi, ikkinchi xaridor kutadi»" },
  { d: "NoSQL'da «alohida hujjatlarni bog'lash qiyin»", a: "bog'lash bor (populate), lekin baza bog'lanishni qo'riqlamaydi: author: null xato bermay saqlandi", s: "«bog'lash mumkin, lekin to'g'riligini kod saqlaydi, baza emas»" },
];
const QA26 = [
  ['«Mongo yomonmi?»', "Yo'q. Chat, loglar kabi juda ko'p oddiy ma'lumotda qulay. Tanlov vazifaga bog'liq: buni qaror ko'rsatkichining 4 savoli bilan tekshiring."],
  ["«MySQL'dan farqi nima?»", "Ikkalasi ham SQL: jadval, JOIN, qoidalar bir xil g'oya. Kursda PostgreSQL, chunki keyingi darslardagi loyihalar shu bilan ishlaydi."],
  ["«Excel'ning o'zi-ku?»", "Ko'rinishi o'xshaydi. Lekin baza qoidani o'zi tekshiradi (bo'sh nom, yo'q muallif — rad) va bir vaqtda ko'p odam yozsa ham adashmaydi (oxirgi telefon)."],
  ['«Firebase nima?»', "Google'ning hujjatli bazasi, NoSQL; darsda MongoDB bilan birga misol."],
  ["«Nega id 1, 2, 3, Mongo'dagidek uzun emas?»", "SERIAL — o'zi o'sadigan raqam; Mongo'da _id ObjectId. Ikkalasi ham noyob."],
];
const S26 = mkS(27, [{ hl: [] }, { hl: [0] }, { hl: [1] }, { hl: [], qa: true }, { hl: [], qa: true }]);
function Screen26(p) {
  const [open, setOpen] = useState([]);
  return <Lesson p={p} S={S26} scene={({ seg }) => <>
    <div style={{ display: 'grid', gap: 8 }}>{SIMP26.map((x, i) => <div key={i} className={`mk-step${seg.hl.includes(i) ? ' hl' : ''}`} style={{ opacity: seg.hl.length && !seg.hl.includes(i) ? 0.5 : 1 }}>
      <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
      <div className="t"><b>{t('Darsda:', 'В уроке:')} {x.d}</b><div style={{ fontSize: 13 }}><b style={{ display: 'inline', color: T.green }}>{t('Aslida:', 'На самом деле:')}</b> {x.a}</div><div className="exp" style={{ color: T.accent, marginTop: 4 }}>{t('Sinfda:', 'В классе:')} {x.s}</div></div></div>)}</div>
    {seg.qa && <div className="mk-light" style={{ padding: 12, animation: 'mk-up .45s ease both' }}>
      <div className="mk-tag">{t("O'quvchi so'rasa — bosing", 'Если ученик спросит — нажмите')}</div>
      <div className="pg-qa">{QA26.map(([q, a], i) => <button key={i} onClick={() => setOpen((o) => o.includes(i) ? o.filter((x) => x !== i) : [...o, i])}><b>{q}</b>{open.includes(i) && <p>{a}</p>}</button>)}</div>
    </div>}
  </>} />;
}

// ============================================================
//  28 · O'z-sinov — 8 savol (Nest-1/Nest-2 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = MDT[28].final;
function Screen27(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = LANG === 'ru' ? (!st.showResult ? RS('FIN_INTRO')
      : sc >= 6 ? 'Ваш результат сохранён: ' + sc + ' из восьми. Урок усвоен, нажмите «Далее».'
        : 'Хорошо, одну ошибку вы разобрали. Вернитесь и к экранам остальных красных вопросов. Когда будете готовы, нажмите кнопку «Пройти тест заново».')
      : !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol, ulardan ikkitasi sinf va o'quvchi darsi bo'yicha. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi sinf kompyuterlarini tayyorlab, m4-03 ni bemalol o'ta olasiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
//  29 · Yakun (M13): Barakalla → xulosa → uyga vazifa → eslatma → «Darsni yakunlash»
// ============================================================
const SUM28 = [
  { k: 'mongo', t: "Mongo ↔ PostgreSQL: collection — jadval, document — qator, ref — REFERENCES, populate — JOIN; qoida Mongo'da kodda, PostgreSQL'da jadvalda", st: ['jad'] },
  { k: 'inst', t: "O'rnatish: Windows — EDB o'rnatuvchisi, parol, port 5432, bin PATH'ga; Mac — Postgres.app; Homebrew bo'lsa createuser -s postgres", st: ['psql'] },
  { k: 'rule', t: "Baza o'zi tekshiradi: NOT NULL · UNIQUE · tashqi kalit · CHECK; xabar — qaysi jadval · qaysi qoida · qaysi qiymat (DETAIL)", st: ['rule'] },
  { k: 'join', t: "JOIN: ON'da tashqi kalit id'ga tenglanadi; xato ON — xatosiz, lekin noto'g'ri natija; LEFT JOIN — juftsizlar ham", st: ['join'] },
  { k: 'tx', t: "Oxirgi telefon: shart + qator qulfi → UPDATE 0; tranzaksiya — hammasi yoki hech narsa; jsonb — erkin qo'shimcha", st: ['jad', 'rule'] },
  { k: 'class', t: "Sinf: m4-06 dan oldin har kompyuterda psql -U postgres -c \"SELECT version();\"; m4-03 kodsiz — har blokda bitta qo'shimcha gapingiz bor", st: ['req', 'res'] },
  { k: 'ai', t: "AI tavsiyasi: sabab — 4 mezon bilan (chat uchun AI PostgreSQL dedi, darsda MongoDB — sabab hal qiladi); sxema — bazada: bo'sh matn '', ON DELETE CASCADE", st: ['rule'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (blog bazasi); har band rasmning o'z qismini ko'rsatadi
function SummaryMap28({ hl }) {
  const read = hl === 'inst' || hl === 'class' ? ['$', 'psql -U postgres -c "SELECT version();"'] : hl === 'join' || hl === 'all' ? ['blog=#', 'SELECT users.username, posts.izoh FROM posts <span class="n1-k">JOIN</span> users ON users.id = posts.user_id;'] : null;
  return <div className="mk-light" style={{ padding: 16 }}>
    <BlogDb rules={hl === 'mongo' || hl === 'rule' || hl === 'tx' || hl === 'ai' || hl === 'all'} fk={hl === 'mongo' || hl === 'rule'} join={hl === 'join' || hl === 'all' ? 'inner' : null}
      bad={hl === 'rule' ? { t: 'posts', row: ['4', '99', "Muallifi yo'q post"], why: t("users'da id 99 yo'q", 'в users нет id 99') } : null}
      read={read} tag={t("Bugungi dars — blog bazasi bir qarashda", 'Сегодняшний урок — база blog одним взглядом')} />
  </div>;
}
const HOMEWORK28 = [
  { t: "Repo va g'oya: blog-db (yoki o'z nomingiz) · README.md — g'oya bir gapda + qaror ko'rsatkichining 4 savoliga javob (bog'langanmi, shakli qat'iymi, xato qimmatmi, ulkan-oddiy-tez kerakmi) + tanlov va sabab", c: [] },
  { t: "schema.sql: 2 bog'langan jadval — PRIMARY KEY, kamida bitta NOT NULL, bitta UNIQUE, REFERENCES → \\d jadvalda Foreign-key qatori", c: ['psql -U postgres -c "CREATE DATABASE <baza>;"', 'psql -U postgres -d <baza> -f schema.sql'] },
  { t: "data.sql: har jadvalga 3+ qator, bitta qator juftsiz (sardor kabi)", c: ['psql -U postgres -d <baza> -f data.sql'] },
  { t: "queries.sql: JOIN va LEFT JOIN — LEFT JOIN'da qatorlar JOIN'dan bittaga ko'p", c: ['psql -U postgres -d <baza> -f queries.sql'] },
  { t: "Ataylab buzing: yo'q id bilan INSERT → «violates foreign key constraint» → DETAIL satrini README'ga yozing", c: [] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "blog-db"', 'git push'] },
];
const CHEATSHEET28 = `# PostgreSQL-1 — mentor eslatmasi (Mongo'dan PostgreSQL'ga)
## Mongo ↔ PostgreSQL
collection = jadval (table) · document = qator (row) · maydon = ustun (column, turi bilan) · _id = id SERIAL PRIMARY KEY · ref = REFERENCES (tashqi kalit) · populate = JOIN · Schema (kodda) = CREATE TABLE (bazada) · required/unique = NOT NULL/UNIQUE · mongosh = psql
## O'rnatish
Windows: postgresql.org/download/windows → EDB installer 18 · Server + pgAdmin 4 + Command Line Tools (Stack Builder kerak emas) · parolni yozib qo'ying · port 5432 · Path'ga C:\\Program Files\\PostgreSQL\\18\\bin (yoki Start → SQL Shell (psql))
Mac: postgresapp.com → Applications → Initialize · PATH: sudo mkdir -p /etc/paths.d && echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp · parolsiz
Homebrew: role "postgres" does not exist → createuser -s postgres
## psql
psql -U postgres · -d <baza> · -c "<so'rov>" · -f fayl.sql · \\l bazalar · \\c blog o'tish · \\dt jadvallar · \\d posts tuzilish · \\q chiqish
SQL — nuqta-vergul bilan; postgres-# — davomini kutyapti; =*# — tranzaksiya ochiq; =!# — tranzaksiyada xato
## Jadval va qoidalar
CREATE DATABASE blog; · CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE); · CREATE TABLE posts (id SERIAL PRIMARY KEY, user_id INT NOT NULL REFERENCES users(id), izoh TEXT NOT NULL);
Xabarni o'qish: qaysi jadval · qaysi qoida (posts_user_id_fkey) · qaysi qiymat (DETAIL: Key (user_id)=(99))
## JOIN
SELECT users.username, posts.izoh FROM posts JOIN users ON users.id = posts.user_id; · LEFT JOIN — chapdagining hammasi · ON users.id = posts.id — xato yo'q, natija noto'g'ri
## Ishonchlilik
Oxirgi telefon: UPDATE … WHERE id = 1 AND stock > 0 — 2-xaridor kutadi, keyin UPDATE 0 · CHECK (stock >= 0) — ikkinchi himoya
BEGIN … COMMIT — hammasi yoki hech narsa; ichida xato bo'lsa COMMIT → ROLLBACK · jsonb: extra->>'rang'
## Ulanish xatolari
password authentication failed → parol · Connection refused / No such file (socket) → PostgreSQL'ni ishga tushiring (Windows: Services → postgresql-x64-18 → Start · Mac: Postgres.app → Start) · relation … does not exist → prompt'dagi baza, \\c blog · 'psql' is not recognized → PATH, yangi terminal
## Sinf kompyuterlari (m4-03 dan keyin, m4-06 dan oldin)
PostgreSQL 18 · psql buyrug'i PATH'da · bitta sinf paroli (Nest loyihasi .env.example'da — password) · psql -U postgres -c "SELECT version();" — qayta yoqilgandan keyin ham
## m4-03 va ikki soddalashtirish
kodsiz, 21 ekran: kirish · ikki tur va shakl · kuchlar (JOIN, oxirgi telefon, chat) · qaror (4 mezon, nega PostgreSQL, AI) · mustahkamlash
«tranzaksiya saqlaydi» — aslida shart + qator qulfi · «NoSQL'da bog'lash qiyin» — bog'lash bor, baza qo'riqlamaydi
## O'quvchi darsidagi so'zlar
Excel jadvali = table · papkadagi turli qog'ozlar = document · id orqali bog'lash = JOIN · SQL nazorati = tranzaksiya · qaror ko'rsatkichi = 4 mezon
## AI tavsiyasi va AI yozgan sxema
sabab — 4 mezon bilan (bog'langanmi · shakli qat'iymi · xato qimmatmi · ulkan hajm va tezlik); haqiqiy AI chat uchun PostgreSQL dedi, m4-03 dagi tayyor javob — MongoDB: sabab hal qiladi · sxemani bazada yurgizing: yo'q id → tashqi kalit xatosi · NULL → NOT NULL · takror → UNIQUE · bo'sh matn '' — NOT NULL to'xtatmaydi → CHECK (trim(body) <> '') · ON DELETE CASCADE — xabari bor foydalanuvchini o'chirish uning hamma xabarini xato bermay o'chiradi; olib tashlansa — DELETE rad etiladi
## Sizning uyga vazifangiz
blog-db: README (4 mezon) + schema.sql + data.sql + queries.sql (JOIN, LEFT JOIN) + FK xatosining DETAIL satri → GitHub → repo linki platformadagi uyga vazifaga`;
const s28Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Mongo ↔ PostgreSQL: <b>qoida Mongo'da kodda, PostgreSQL'da jadvalda</b>", "Birinchi: siz bilgan Mongo tushunchalarining hammasi PostgreSQL'da bor. Collection jadval, document qator, ref tashqi kalit, populate JOIN. Asosiy farq: qoida Mongo'da kodda, PostgreSQL'da jadvalning o'zida.", { hl: 'mongo' }),
  sg('b2', "O'rnatish: Windows'da <b>parol va PATH</b>, Mac'da Postgres.app", "Ikkinchi: o'rnatish. Windows'da rasmiy o'rnatuvchi, parolni yozib qo'yish va bin papkasini Path'ga qo'shish. Mac'da Postgres.app. Homebrew bo'lsa, createuser minus s postgres.", { hl: 'inst' }),
  sg('b3', "Baza o'zi tekshiradi — xabar <b>jadval, qoida va qiymatni</b> aytadi", "Uchinchi: qoida buzilsa baza yozuvni saqlamaydi va sababni o'zi aytadi. Xabarni uch savol bilan o'qing: qaysi jadval, qaysi qoida, qaysi qiymat. Javob detail qatorida.", { hl: 'rule' }),
  sg('b4', "JOIN'da hammasi <b>ON satrida</b>; LEFT JOIN — juftsizlar ham", "To'rtinchi: JOIN'da hammasi on satrida, tashqi kalit boshqa jadvalning id'siga tenglanadi. Xato on xato bermaydi, lekin natijani buzadi. Left join juftsiz qatorlarni ham chiqaradi.", { hl: 'join' }),
  sg('b5', "Oxirgi telefon: <b>shart va qator qulfi</b>; tranzaksiya — hammasi yoki hech narsa", "Beshinchi: oxirgi telefonni so'rovdagi shart va qator qulfi saqlaydi, ikkinchi xaridor update nol oladi. Bir nechta jadval birga o'zgarsa, tranzaksiya: xato bo'lsa hammasi bekor.", { hl: 'tx' }),
  sg('b6', "Sinf: m4-06 dan oldin <b>har kompyuterda psql</b> ochilsin", "Oltinchi, sinf uchun eng muhimi: m4-06 dan oldin har sinf kompyuterida PostgreSQL ishlab tursin, bitta parol bilan. m4-03 kodsiz, lekin har blokda sizning bitta qo'shimcha gapingiz bor.", { hl: 'class' }),
  sg('b7', "AI tavsiyasi: <b>sabab 4 mezon bilan</b>, sxema <b>bazada</b>", "Yettinchi: AI tavsiyasini sabab bilan qabul qiling va to'rt mezon bilan solishtiring. AI yozgan sxemani bazada yurgizing: bo'sh matn, takror qiymat va xabari bor foydalanuvchini o'chirib ko'ring. On delete cascade bilan o'chirish xato bermay boshqa jadvalga ham o'tadi.", { hl: 'ai' }),
  sg('hw', "<b>Uyga vazifa</b>: o'quvchi amaliyotini o'zingiz — haqiqiy bazada", "Uyga vazifa: o'quvchining amaliyotini o'zingiz to'liq qiling, lekin haqiqiy bazada. Bitta loyiha g'oyasini oling, masalan onlayn do'kon. README'da to'rt savolga javob yozing va bazani tanlang. Keyin uchta fayl: schema'da ikki bog'langan jadval, data'da ma'lumot, queries'da JOIN va left join. Bir marta tashqi kalit xatosini ataylab chiqaring.", { hl: 'hw' }),
  sg('hw2', "Topshirish: GitHub'dagi repo linkini <b>platformadagi uyga vazifaga</b> qo'ying — boshqa hech narsa kerak emas", "Xatoning detail qatorini README'ga yozing. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: lug'at, o'rnatish, psql, qoidalar, JOIN — bir sahifada", "Pastda bir sahifalik eslatma: Mongo lug'ati, o'rnatish yo'llari, psql buyruqlari, qoidalar, JOIN, oxirgi telefon, ulanish xatolari va sinf kompyuterlari ro'yxati. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen28(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET28, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('postgresql-1-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
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
            {/* F-1125-01: 7 band 1280×720 ga sig'sin (yangi band pastda qirqilmasin) — faqat shu ro'yxatda zichroq */}
            <div className="mk-plan" style={{ gap: 6 }}>{SUM28.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both', padding: '8px 14px' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>{t('Uyga vazifa · 40–60 daqiqa', 'Домашнее задание · 40–60 минут')}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK28.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}>{t(<><b>Tekshiruvchi qaraydi:</b> README'da 4 javob va asoslangan tanlov · schema.sql'da REFERENCES · queries.sql'da JOIN va LEFT JOIN · README'da haqiqiy DETAIL satri. <code>-f</code> bilan yurgizilganda xato oldiga <code>psql:schema.sql:N:</code> qo'shiladi — bu qaysi satr ekanini aytadi.</>, <><b>Проверяющий смотрит:</b> в README 4 ответа и обоснованный выбор · в schema.sql REFERENCES · в queries.sql JOIN и LEFT JOIN · в README настоящая строка DETAIL. При запуске с <code>-f</code> перед ошибкой добавляется <code>psql:schema.sql:N:</code> — это номер строки.</>)}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("PostgreSQL: CRUD so'rovlar", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("INSERT, SELECT, UPDATE, DELETE — o'quvchi m4-06 darsi va m4-08 AvtoIjara loyihasi uchun", RS('NEXT_D'))}</div></div>
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
          {t(["PostgreSQL'ni o'rnatib, psql bilan blog bazasini qurasiz", "bazaning xatosini o'qiysiz: qaysi jadval, qaysi qoida, qaysi qiymat", "JOIN bilan ikki jadvalni bog'laysiz va sinfdagi o'rnatish muammolariga tayyor bo'lasiz"], ['установите PostgreSQL и соберёте базу blog в psql', 'будете читать ошибку базы: какая таблица, какое правило, какое значение', 'свяжете две таблицы через JOIN и будете готовы к проблемам установки в классе']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 10 daqiqa, 15-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: internet, Windows yoki macOS, terminal", 'Урок со звуком · 1 час 10 минут, после 15-го экрана можно сделать перерыв · Нужно: интернет, Windows или macOS, терминал')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><BlogDb join="inner" rules hl={{ users: [0], posts: [1] }} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, ScreenSqlNosql, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenP1, Screen10, Screen11, Screen12, Screen13, ScreenP2, Screen15, Screen16, ScreenP3, Screen18, Screen19, Screen20, Screen21, ScreenP4, ScreenAI, ScreenLCAI, Screen23, Screen24, Screen25, Screen26, Screen27, Screen28];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function PgIntroMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
