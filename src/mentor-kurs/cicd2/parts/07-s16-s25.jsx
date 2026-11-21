
// ============================================================
//  16 · Pull request: lenta merge'dan oldin tekshiradi; badge (run 35, 36, 37; TXT_36B; README cicd2-done)
// ============================================================
const T16 = jt('$ git checkout -b lenta-smoke\n$ git add .github README.md\n$ git commit -m "ci: smoke job (PostgreSQL xizmati) va README badge"\n$ git push -u origin lenta-smoke');
const S16 = mkS(16, [{ v: 'push' }, { v: 'pr' }, { v: 'merge' }, { v: 'badge' }]);
function Screen16(p) {
  return <Lesson p={p} S={S16} scene={({ seg }) => <>
    {seg.v === 'push' && <div style={{ display: 'grid', gap: 10 }}><Term lines={T16} /><RunRows keys={['35']} hl={['35']} /></div>}
    {seg.v === 'pr' && <PrCard checks />}
    {seg.v === 'merge' && <div style={{ display: 'grid', gap: 10 }} className="c1-small"><PrCard checks merged /><RunView k="37" job="smoke" ann={null} only={/Initialize|npm run smoke/} /></div>}
    {seg.v === 'badge' && <div style={{ display: 'grid', gap: 10 }}>
      {/* F-1120-02: 1280 da rasm sig'sin — butun VS Code oynasi o'rniga README'ning o'sha 1-satri */}
      <CodePanel file="README.md · cicd2-done" lines={kod('README_BADGE', { 1: 'b' }, 1, 1)} focus={['b']} />
      <div className="mk-light" style={{ padding: 14, display: 'flex', gap: 14, alignItems: 'center' }}><div className="mk-tag" style={{ margin: 0 }}>{t("Reponi ochgan odam ko'radi", "Кто открыл репозиторий, видит")}</div><Badge ok /><span style={{ fontSize: 13, color: T.ink2 }}>{t("— main'dagi oxirgi run holati (", "— состояние последнего run в main (")}<code>actions/workflows/ci.yml/badge.svg</code>)</span></div>
      {/* F-1120-02 (M51): xulosada darsning rasmi — README badge main'dagi oxirgi run'ni ko'rsatadi: ikki job yashil */}
      <div className="mk-light" style={{ padding: 12 }}><BotMap loc={DB_ALL} on={[...CI_ON, 'db', 'products', 'users', 'carts', 'orders']} dbLabel={DB_SVC} jest={CI2_OK} max={0.85} tag={t("README'ga badge — ochgan odam lentani ko'radi", 'Бейдж в README — кто открыл, видит конвейер')} /></div>
    </div>}
  </>} />;
}

// ============================================================
//  17 · AI smoke workflow yozdi — ikki to'plam, ikkalasi yashil (run 40, 41)
// ============================================================
const S17 = mkS(17, [{ v: 'stage' }, { v: 'prompt' }, { v: 'cards' }, { v: 'runs' }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <>
    {(seg.v === 'stage' || seg.v === 'prompt') && <div className="c1-stage">
      <div style={{ '--c': T.ink3, opacity: 0.45 }}><h4>{t("1–4-bosqich · siz", "Этапы 1–4 · вы")}</h4><p>{t("run'ni o'qish · cache · matrix · services + smoke · secret", "чтение run · cache · matrix · services + smoke · secret")}</p></div>
      <div style={{ '--c': C1.ai }}><h4>{t("5-bosqich · AI yozadi, siz qabul qilasiz", "Этап 5 · пишет AI, вы принимаете")}</h4><p>{t("bitta prompt → ikki workflow → haqiqiy lentada sinov", "один промпт → два workflow → проверка в настоящем конвейере")}</p></div>
    </div>}
    {seg.v === 'prompt' && <AiReply who={t("Prompt — ikkala AI'ga bir xil", "Промпт — одинаковый для обоих AI")} prompt={KOD.PROMPT1} tag={t("ishorasiz: services, konteyner, healthcheck, secret yo'q", "без подсказок: нет services, контейнера, healthcheck, secret")} />}
    {seg.v === 'cards' && <div className="pg-two">
      <AiReply who={t("1-AI (kuchli model)", "1-й AI (сильная модель)")} said={<><code>ci.yml</code>{t(" +20 satr: ", " +20 строк: ")}<code>services: postgres:18</code> + <code>pg_isready</code> healthcheck · <code>POSTGRES_DB: shop</code> · <code>npm run smoke</code>{t(" build'dan keyin · ", " после build · ")}<b>{t("env faqat smoke qadamida", "env только в шаге smoke")}</b>{t(" · 3 izoh («build ikki marta»)", " · 3 пояснения («build дважды»)")}</>} />
      <AiReply who={t("2-AI (kuchsizroq model)", "2-й AI (модель слабее)")} said={<><code>ci.yml</code>{t(" +17 satr: xuddi shu services va healthcheck · ", " +17 строк: те же services и healthcheck · ")}<b>{t("env job darajasida", "env на уровне job")}</b>{t(" (hamma qadamga) · smoke oxirida · izohsiz", " (во все шаги) · smoke в конце · без пояснений")}</>} />
    </div>}
    {seg.v === 'runs' && <div className="pg-two c1-small"><RunView k="40" ann={null} only={/Initialize|npm ci|npm run smoke|Stop/} hlStep="Run npm run smoke" /><RunView k="41" ann={null} only={/Initialize|npm ci|npm run smoke|Stop/} hlStep="Run npm run smoke" /></div>}
    {/* F-1120-02 (M51): xulosada darsning rasmi — ikkala AI lentasi: services konteyneri, smoke yashil; secret ishlatilmadi (run 40, 41) */}
    {seg.v === 'runs' && <div className="mk-light" style={{ padding: 12 }}><BotMap loc={DB_ALL} on={[...CI_ON, 'db', 'products', 'users', 'carts', 'orders']} dbLabel={DB_SVC} jest={{ name: 'AI ×2', steps: [['1-AI · smoke', 'ok'], ['2-AI · smoke', 'ok']], res: 'pass', get badge() { return t('tekshiruv oldinda', 'проверка впереди'); } }} max={0.85} tag={t("AI secret ishlatmadi — to'g'ri: konteyner — sir emas; yashil, lekin tekshiruv hali oldinda", 'AI не взял secret — верно: контейнер не секрет; зелёный, но проверка впереди')} /></div>}
  </>} />;
}

// ============================================================
//  18 · AI'ni qabul qilish: to'rt savol; tayanch to'g'ri — AI ham to'g'ri
// ============================================================
const AI1_ENV = lineN('YML_AI1', /DATABASE_URL:/); const AI2_ENV = lineN('YML_AI2', /DATABASE_URL:/);
const AI1_CM = KOD.YML_AI1.lines.filter((l) => /^\s*#/.test(l.t));
const FOUR18 = ['`services: postgres` + healthcheck bormi?', '`DATABASE_URL` smoke qadamiga yetib boradimi (`env` qayerda)?', 'Tartib: smoke `build`dan keyinmi (yoki `needs: test`)?', 'Secret kerakmi: konteyner — yo\'q; tashqi baza — ha'];
const S18 = mkS(18, [{ v: 'two' }, { v: 'env' }, { v: 'cm' }, { v: 'four' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {seg.v === 'two' && <div className="pg-two">
      <div className="c1-mach bad"><h4>{t("CI/CD-1: AI noldan yozdi", "CI/CD-1: AI написал с нуля")}</h4><div className="r"><span>{t("tayanch", "основа")}</span><code>{t("yo'q", "нет")}</code></div><div className="r"><span>node-version</span><code>{t("22 (odatiy)", "22 (по умолчанию)")}</code></div><div className="r"><span>run</span><code>✗ npm ci</code></div></div>
      <div className="c1-mach ok hl"><h4>{t("CI/CD-2: AI sizning faylingizni o'zgartirdi", "CI/CD-2: AI изменил ваш файл")}</h4><div className="r"><span>{t("tayanch", "основа")}</span><code>ci.yml (node 24)</code></div><div className="r"><span>{t("qo'shdi", "добавил")}</span><code>services + smoke</code></div><div className="r"><span>run</span><code>✓ NATIJA: 5/5</code></div></div>
    </div>}
    {seg.v === 'env' && <div style={{ display: 'grid', gap: 8 }}><Yml k="YML_AI1" title={t("ci.yml · 1-AI — env faqat smoke qadamida", "ci.yml · 1-й AI — env только в шаге smoke")} from={AI1_ENV - 2} to={AI1_ENV} ids={{ [AI1_ENV]: 'e' }} focus={['e']} /><Yml k="YML_AI2" title={t("ci.yml · 2-AI — env job darajasida", "ci.yml · 2-й AI — env на уровне job")} from={AI2_ENV - 1} to={AI2_ENV + 1} ids={{ [AI2_ENV]: 'e' }} focus={['e']} /></div>}
    {seg.v === 'cm' && <div style={{ display: 'grid', gap: 8 }}><CodePanel file={t("ci.yml · 1-AI izohlari", "ci.yml · пояснения 1-го AI")} lines={AI1_CM.map((l) => ({ h: yamlLine(l.t.trim()), n: l.n }))} focus={[]} /><div className="n2-warn">{t("1-AI o'zi sezdi: smoke ichida yana ", "1-й AI сам заметил: внутри smoke снова ")}<code>nest build</code> — build <b>{t("ikki marta", "дважды")}</b>{t(". Siz hal qilasiz: ", ". Решаете вы: ")}<code>npm run build</code>{t(" qadami qoladimi.", " шаг остаётся?")}</div></div>}
    {seg.v === 'four' && <div className="mk-light" style={{ padding: 16 }}><div className="mk-tag">{t("AI smoke workflow'ini qabul qilish — to'rt savol", "Приём workflow smoke от AI — четыре вопроса")}</div><div className="mk-plan">{FOUR18.map((x, i) => <div key={i} className="hl" style={{ animation: `mk-up .4s ${i * 0.1}s ease both` }}><b>0{i + 1}</b><span dangerouslySetInnerHTML={html(x.replace(/`([^`]+)`/g, '<code>$1</code>'))} /></div>)}</div></div>}
  </>} />;
}

// ============================================================
//  19 · Tekshiruv 4 — konteyner uchun secret kerakmi (YML_AI1, run 40)
// ============================================================
function Screen19(p) {
  return MC(p, 19, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <Yml k="YML_AI1" title={t("ci.yml · AI yozgan — smoke qadami", "ci.yml · написал AI — шаг smoke")} from={AI1_ENV - 2} to={AI1_ENV} ids={{ [AI1_ENV]: 'e' }} focus={['e']} />
      <div className="mk-pair"><code>services: postgres</code>{t(" — konteyner job ichida, job bilan o'chadi", " — контейнер внутри job, выключается вместе с job")}</div>
    </div>,
    after: <div className="c1-small"><RunView k="40" ann={null} only={/Initialize|npm run smoke|Stop/} /></div>,
  });
}

// ============================================================
//  20 · Amaliyot 3 — smoke job, PR, merge, badge (prompt — MD 20-ekrandan aynan)
// ============================================================
const PROMPT20 = KOD.PROMPT2.split('. ').map((s, i, a) => ({ h: escH(s + (i < a.length - 1 ? '.' : '')) }));
const P20 = mkPractice(20, [[], [0, 1], [2, 3], []], {
  code: [{ step: 1, file: 'prompt.txt', lines: PROMPT20 }, { step: 2, file: F.ci, lines: kod('YML_3_SMOKE_SERVICES'), copy: false }, { step: 3, file: F.readme, lines: kod('README_BADGE') }],
});
function ScreenP20(p) { return <Practice p={p} S={P20.S} steps={P20.steps} trouble={P20.trouble} proof={P20.proof} code={P20.code} tree={['prompt.txt', F.ci, F.readme]} />; }

// ============================================================
//  21 · m4c-03 xaritasi: o'quvchi so'zlari (GithubActionsLesson.jsx — SCREEN_META 23)
// ============================================================
const DICT21 = [["yo'l xaritasi · lenta mashinasi · start signali", 'ci.yml · runner (runs-on) · on: push'], ['nuqta · amal', 'job · step (uses — tayyor amal, run — buyruq)'], ['jurnal · jurnaldan sababni topish', 'qadam logi · annotatsiya → qizil qadam → log (4-ekran)'], ['parallel lentalar', 'strategy.matrix — har qiymat alohida job; fail-fast'], ['yaqin javon', "cache: npm — «Cache saved» → «Cache hit»"], ['seyf', 'GitHub Secrets — ${{ secrets.NOM }}, logda ***; konteyner — env'], ['tablo', 'README badge — actions/workflows/ci.yml/badge.svg']];
const SIM21 = [["matrix: 3 lenta, hammasi ✓", '22 ✗ (lock), 24 ✓; fail-fast 24 ni bekor qildi (30, 31)'], ['seyf: ${{ secrets.API_KEY }} → yashirin', "logda ***; nomi xato — bo'sh, xato yo'q (33)"], ['jurnal: sabab bitta satrda', 'annotatsiya qisqa; sabab qadam logida (15, 11)'], ['tablo: passing', "badge.svg — main'dagi oxirgi run (37)"]];
const S21 = mkS(21, [{ v: 'cards' }, { v: 'dict' }, { v: 'sim' }, { v: 'sim', sum: true }]);
function Screen21(p) {
  return <Lesson p={p} S={S21} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m4c-03 (23 ekran)", "Ученик · m4c-03 (23 экрана)")} hl><p>{t("yo'l xaritasi qayerda yashaydi (", "где живёт дорожная карта (")}<code>.github/workflows/</code>{t(") · nuqta = job, amal = step · signal va mashina · ", ") · точка = job, действие = step · сигнал и машина · ")}<code>uses</code>/<code>run</code>{t(" · «Jurnaldan sababni topish» · tartib (DragDrop) · parallel lentalar (matrix, 3 Node — simulyatsiya) · seyf (", " · «Найти причину в журнале» · порядок (DragDrop) · параллельные ленты (matrix, 3 Node — симуляция) · сейф (")}<code>secrets.API_KEY</code>{t(") · tablo (badge) · amaliyot: o'z reposiga ci.yml", ") · табло (badge) · практика: ci.yml в свой репозиторий")}</p></Card>
      <Card c={T.accent} h={t("Siz · bugun (haqiqiy run'lar)", "Вы · сегодня (настоящие run)")}><p>{t("log, annotatsiya · cache saved/hit · matrix + fail-fast · services + smoke · env/secrets, nom xatosi · PR → checks → merge · badge · AI", "лог, аннотация · cache saved/hit · matrix + fail-fast · services + smoke · env/secrets, ошибка в имени · PR → checks → merge · badge · AI")}</p></Card>
    </div>}
    {seg.v === 'dict' && <table className="pg-dict"><tbody>{DICT21.map(([a, b]) => <tr key={a}><td>{a}</td><td><code>{b}</code></td></tr>)}</tbody></table>}
    {seg.v === 'sim' && <><div className="mk-tag" style={{ margin: 0 }}>{t("Simulyatsiya (o'quvchi darsi) ↔ haqiqiy Actions (bugun)", "Симуляция (урок ученика) ↔ настоящий Actions (сегодня)")}</div><table className="pg-dict"><tbody>{SIM21.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table>
      {seg.sum && <div className="mk-rule">{t("Simulyatsiya — tushuncha, haqiqiy run — tajriba. Sinfda o'z reponingizdagi ", "Симуляция — понятие, настоящий run — опыт. В классе откройте ")}<b>{t("bitta run'ni proyektorda", "один run из своего репозитория на проекторе")}</b>{t(" oching: job → qadam → log → cache hit.", " : job → шаг → лог → cache hit.")}</div>}</>}
  </>} />;
}

// ============================================================
//  22 · «Repongiz yo'qmi?» namunasi — sinfdagi tuzoqlar (cicd2-out/01–04 lokal, 01.11)
// ============================================================
const T22A = outPick('v1-01', (l) => /^\$|"name"|"scripts"|"test"|^\}|^\{/.test(l));
const T22B = outPick('v1-02', (l) => /^\$|can only install|package-lock|chiqish kodi|^\[/.test(l));
const T22C = outPick('v1-03', (l) => /^\$|^ok$|^> |chiqish kodi|^\[/.test(l));
const T22D = outPick('v1-04', (l) => /^\$|xato|exit|chiqish kodi|^\[|"test"/.test(l));
const S22 = mkS(22, [{ v: 'a' }, { v: 'b' }, { v: 'c' }, { v: 'd' }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <>
    {seg.v === 'a' && <div style={{ display: 'grid', gap: 8 }}><Term title={t("VS Code terminali · ci-mashq (o'quvchi namunasi)", "терминал VS Code · ci-mashq (образец ученика)")} lines={T22A} /><Term title={t("VS Code terminali · npm install && npm test", "терминал VS Code · npm install && npm test")} lines={T22C} /></div>}
    {seg.v === 'b' && <Term title={t("VS Code terminali · npm ci (GitHub andozasi shunday yozadi)", "терминал VS Code · npm ci (так пишет шаблон GitHub)")} lines={T22B} er />}
    {seg.v === 'c' && <Term title={t("VS Code terminali · «testni buzing»", "терминал VS Code · «сломайте тест»")} lines={T22D} er />}
    {seg.v === 'd' && <div className="pg-three">
      <Card c={T.accent} h={t("1 · lock yo'q", "1 · нет lock")}><p>{t("GitHub andozasi ", "Шаблон GitHub ")}<code>npm ci</code>{t(" yozadi → ", " пишет → ")}<b>{t("qizil", "красный")}</b>{t(". Yechim: ", ". Решение: ")}<code>npm install</code>{t(" yoki lock commit'ga.", " или lock в commit.")}</p></Card>
      <Card c={T.accent} h="2 · echo ok"><p><code>"test": "echo ok && exit 0"</code>{t(" hech qachon qizil bo'lmaydi → uyga vazifadagi «buzing» — ", " никогда не бывает красным → «сломайте» из домашнего задания — ")}<code>exit 1</code>{t(" yoki Jest loyihasi.", " или Jest-проект.")}</p></Card>
      <Card c={T.green} h={t("3 · @v4 ishlaydi", "3 · @v4 работает")}><p>{t("Bugungi run'larda ham ", "И в сегодняшних run ")}<code>@v4</code>{t(" ✓; ogohlantirish «Node.js 20 is deprecated … forced to run on Node.js 24» — xato emas.", " ✓; предупреждение «Node.js 20 is deprecated … forced to run on Node.js 24» — не ошибка.")}</p></Card>
    </div>}
  </>} />;
}

// ============================================================
//  23 · Siz qo'shasiz, xato qiladigan joylar, o'quvchi so'rasa
// ============================================================
const ADD23 = [["haqiqiy run'ni proyektorda: job → qadam → log; annotatsiya vs log (4-ekran)", '«Jurnaldan sababni topish»'], ["matrix'da haqiqiy natija: bitta versiya qizil bo'lishi mumkin, fail-fast qolganini to'xtatadi (8–9)", 'parallel lentalar'], ["secret nomi xato — xato chiqmaydi, bo'sh keladi (14); konteyner uchun secret kerak emas", 'seyf'], ["namunadagi npm ci va echo ok tuzoqlari (22)", '«Repongiz yo\'qmi?» + uyga vazifa']];
const CARDS23 = [
  ["npm ci qizil, lock yo'q", 'can only install with an existing package-lock.json', "npm install (namuna) yoki lock commit'ga"],
  ["matrix'da bitta job «cancelled»", 'The strategy configuration was canceled because … failed', "xato boshqa job'da; fail-fast: false"],
  ['«testni buzdim, baribir yashil»', 'ok', 'echo ok && exit 0 — buzilmaydi; exit 1 yoki Jest loyihasi'],
];
const QA23 = [
  ['«Jurnal qayerda?»', 'run → job → qadam; qadam nomini bosing — log ochiladi.'],
  ["«Matrix'da hammasi yashil bo'lishi shartmi?»", "Yo'q — maqsad qaysi versiyada ishlashini bilish; qizil versiya — javob."],
  ["«Seyfdagi kalitni ko'rsam bo'ladimi?»", "Yo'q — logda ***; qiymat faqat yozilganda ko'rinadi, keyin hech kim o'qiy olmaydi."],
  ["«Badge qizil bo'lsa nima?»", "main'dagi oxirgi run qizil — Actions'ni ochib qaysi qadam qizilligini toping."],
];
function QA({ items }) {
  const [open, setOpen] = useState(-1);
  return <div className="pg-qa">{items.map(([q, a], i) => <button key={q} onClick={() => setOpen(open === i ? -1 : i)}><b>{q}</b>{open === i && <p>{a}</p>}</button>)}</div>;
}
const S23 = mkS(23, [{ v: 'add' }, { v: 'err' }, { v: 'qa' }, { v: 'qa' }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {seg.v === 'add' && <><div className="mk-tag" style={{ margin: 0 }}>{t("Siz qo'shasiz", "Вы добавляете")}</div><table className="pg-dict"><tbody>{ADD23.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table></>}
    {seg.v === 'err' && <div className="pg-three">{CARDS23.map(([h, x, y], i) => <Card key={h} c={T.accent} h={`${i + 1} · ${h}`}><p><code>{x}</code></p><p style={{ marginTop: 4 }}>→ {y}</p></Card>)}</div>}
    {seg.v === 'qa' && <><div className="mk-tag" style={{ margin: 0 }}>{t("O'quvchi so'rasa — bosib oching", "Если ученик спросит — нажмите, чтобы открыть")}</div><QA items={QA23} /></>}
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
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: job va mashina, checkout, qizilni o'qish, cache, fail fast, services, secret nomi va pull request. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi lentam qizil desa, job, qadam va logga birga tushasiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
//  25 · Yakun (M13, M14, M30)
// ============================================================
const SUM25 = [
  { k: 'run', t: "run → job → step; GitHub qo'shadi: Set up job (runner, token ruxsati, action'lar), Post Run (cache), Complete job. uses ichi ochiq: checkout — git init + fetch --depth=1; setup-node — «Found in cache», Node/npm versiyasi", st: ['run'] },
  { k: 'red', t: "Qizil run: belgi → job → qadam → log. Annotatsiya — manzil (##[error] satrlari), sabab — qadam logida. Cache: «saved» → «hit» (npm ci 11 s → 5 s); tarmoqqa bog'liq («not found» — xato emas)", st: ['run'] },
  { k: 'matrix', t: "matrix — bitta job, bir nechta qiymat, parallel; fail-fast (odatiy) bittasi yiqilsa qolganini «cancelled» qiladi; to'liq javob — fail-fast: false. Bot/sayt uchun bitta Node yetadi", st: ['matrix'] },
  { k: 'smoke', t: "Bazali tekshiruv lentada: smoke job needs: test, services: postgres:18 (parol, POSTGRES_DB, port, pg_isready healthcheck), npm run smoke env: DATABASE_URL → Initialize containers → NATIJA: 5/5 ✓ → Stop containers", st: ['smoke'] },
  { k: 'secret', t: "env — konteyner (sir emas); Secrets — tashqi resurs (Settings → Secrets, ${{ secrets.NOM }}, logda ***). Nomi xato — xato yo'q, qiymat bo'sh, dastur yiqiladi («topilmadi»)", st: ['smoke'] },
  { k: 'pr', t: "Pull request: tarmoq → PR → pull_request run → checks → merge → main run; README badge. AI smoke workflow'i: tayanch (ci.yml) to'g'ri bo'lsa AI ham to'g'ri; to'rt savol: services + healthcheck · env yetadimi · tartib · secret kerakmi", st: ['pr', 'ai'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (BotMap + Actions); har band rasmning o'z qismini yoritadi
const MAP25 = {
  run: { on: CI_ON, jest: S1M[1].jest },
  red: { on: CI_ON, jest: { name: 'Actions', steps: [['npm ci', 'ok'], ['tsc', 'ok'], ['npm test', 'bad'], ['build', 'skip']], res: 'fail', badge: '##[error]' } },
  matrix: { on: CI_ON, jest: { name: 'Actions', steps: [['test (22)', 'bad'], ['test (24)', 'skip']], res: 'fail', badge: 'fail-fast → cancelled' } },
  smoke: { on: [...CI_ON, 'db', 'products', 'users', 'carts', 'orders'], dbLabel: DB_SVC, jest: { name: 'Actions', steps: [['test', 'ok'], ['smoke', 'ok']], res: 'pass', badge: 'NATIJA: 5/5 ✓' } },
  secret: { on: [...CI_ON, 'db'], dbLabel: DB_SVC, jest: { name: 'Actions', steps: [['test', 'ok'], ['smoke', 'bad']], res: 'fail', get badge() { return t('DATABASE_URL topilmadi', 'DATABASE_URL не найден'); } } },
  pr: { on: [...CI_ON, 'db', 'products', 'users', 'carts', 'orders'], dbLabel: DB_SVC, jest: CI2_OK },
};
function SummaryMap25({ hl }) {
  const m = MAP25[hl] || MAP25.pr;
  return <div className="mk-light" style={{ padding: 14 }}>
    <BotMap loc={DB_ALL} {...m} max={1.05} tag={t("Bugungi dars — lenta ichida: job'lar, matrix, Postgres va secret", 'Сегодняшний урок — внутри конвейера: job, matrix, Postgres и secret')} />
  </div>;
}
const HOMEWORK25 = [
  { t: "lint job — ci.yml: jobs.lint — checkout · setup-node · npm ci · npx prettier --check \"src/**/*.ts\" (uch job: test · smoke · lint)", c: ['npx prettier --check "src/**/*.ts"'] },
  { t: "Himoya — Settings → Branches → rule main → Require status checks: test, smoke, lint", c: ['Settings → Branches → Add branch ruleset → main'] },
  { t: "Qizil PR — tarmoq lint-sinov, src/api/app.controller.ts formatini buzing (bir qatorga), push, PR: lint ✗, Merge yopiq", c: ['git checkout -b lint-sinov', 'git push -u mine lint-sinov'] },
  { t: "Yashil PR — prettier --write, push: uchalasi ✓, merge", c: ['npx prettier --write src/api/app.controller.ts'] },
  { t: "Topshirish — repo linki + PR manzili → platformadagi uyga vazifa", c: [] },
];
const CHEATSHEET25 = `# GitHub Actions — mentor eslatmasi (OrderBotNest, run ichi → PR)
## Loyiha
git fetch --tags · git checkout cicd2-start (= cicd1-done) → cicd2-done (PR #1 merge: smoke job + README badge) · npm test — 25 test · npm run smoke — Postgres kerak (DATABASE_URL)
## run → job → step
run = bitta push · job = jobs: ostidagi har nom (alohida mashina; needs — tartib) · step = har uses/run · GitHub qo'shadi: Set up job · Post Run … · Complete job
## uses ichida (log)
Set up job: Image: ubuntu-26.04 · GITHUB_TOKEN Permissions: Contents: read · Download action repository · checkout: Deleting the contents → git init → fetch --depth=1 · setup-node: Found in cache @ …/node/24.22.1 · node: v24.22.1 · npm: 11.19.1
## Qizil run'ni o'qish
belgi → qizil job → qizil qadam (✗) → log · annotatsiya = ##[error] satrlari (qisqa, manzil) · Jest xatosi annotatsiyaga chiqmaydi — faqat «exit code 1»
## cache: npm
1-run: npm cache is not found → Post: Cache saved with the key: node-cache-Linux-x64-npm-<lock hash> · 2-run: Cache hit for: … (npm ci 11 s → 5 s) · boshqa tarmoq: not found (xato emas)
## matrix
strategy: matrix: node-version: [22, 24] · node-version: \${{ matrix.node-version }} → test (22), test (24) parallel · fail-fast (odatiy true): bittasi yiqilsa qolgani cancelled («The strategy configuration was canceled because "test._22" failed») · fail-fast: false — to'liq javob · bot/sayt — bitta Node yetadi
## smoke job (services)
smoke: needs: test · services: postgres: image: postgres:18 · env: POSTGRES_PASSWORD: postgres, POSTGRES_DB: shop · ports: - 5432:5432 · options: --health-cmd "pg_isready -U postgres" … · steps: checkout · setup-node · npm ci · npm run smoke (env: DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop) → Initialize containers → NATIJA: 5/5 ✓ → Stop containers
## env ↔ secrets
konteyner — env: (ochiq, job bilan o'ladi) · tashqi resurs (prod baza, bot token) — Settings → Secrets and variables → Actions; yml: \${{ secrets.NOM }}; logda *** · nomi xato (DATABSE_URL) — xato yo'q, qiymat bo'sh → «DATABASE_URL topilmadi» (kod 2)
## Pull request · badge
git checkout -b lenta-smoke → push → PR (lenta-smoke → main) → on: pull_request run → checks: test ✓ smoke ✓ → Merge → main run · README: [![CI](https://github.com/<siz>/OrderBotNest/actions/workflows/ci.yml/badge.svg)](…)
## AI smoke workflow'iga to'rt savol
services + healthcheck bormi · DATABASE_URL smoke qadamiga yetadimi (env qayerda) · tartib (build'dan keyin / needs: test) · secret kerakmi (konteyner — yo'q) · tayanch ci.yml to'g'ri bo'lsa AI ham to'g'ri
## Sinfga tayyorgarlik (m4c-03, 23 ekran)
yo'l xaritasi = ci.yml · nuqta = job · amal = step · jurnal = log · parallel lentalar = matrix · yaqin javon = cache · seyf = secrets · tablo = badge · namuna: npm ci lock yo'q → qizil; echo ok buzilmaydi
## Xato qiladigan joylar
can only install with an existing package-lock.json → npm install / lock commit'ga · cancelled → boshqa job yiqildi, fail-fast · «buzdim, yashil» → echo ok · DATABASE_URL topilmadi → env/secret nomi · ECONNREFUSED 5432 → services/ports/healthcheck
## Sizning uyga vazifangiz (40–60 daqiqa)
lint job · branch rule (required checks) · qizil PR → yashil PR · repo linki + PR manzili platformaga`;
const s25Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "<b>run → job → step</b>; GitHub qadamlari; uses ichi ochiq", "Birinchi: run, job, step. GitHub o'zi set up job, post run va complete job'ni qo'shadi. Uses yashirin emas: checkout git init va fetch depth bir qiladi, setup node tayyor Node'ni topadi, logda Node va npm versiyasi.", { hl: 'run' }),
  sg('b2', "Qizilni o'qish: <b>belgi → job → qadam → log</b>; cache saved → hit", "Ikkinchi: qizil run'ni belgi, job, qadam, log tartibida o'qing. Annotatsiya manzil, sabab logda. Cache npm birinchi run'da saqlanadi, ikkinchisida hit, npm si ay ikki barobar tez. Boshqa tarmoqda not found, bu xato emas.", { hl: 'red' }),
  sg('b3', "<b>matrix</b> — bir nechta versiya parallel; fail-fast qolganini bekor qiladi", "Uchinchi: matrix bitta faylni bir nechta Node'da parallel sinaydi. Fail fast odatiy: bittasi yiqilsa qolgani cancelled. To'liq javob uchun fail fast false. Bot yoki sayt uchun mashinangizdagi bitta Node yetadi.", { hl: 'matrix' }),
  sg('b4', "Smoke lentada: <b>services: postgres</b>, healthcheck, needs: test", "To'rtinchi: bazali tekshiruv lentada. Smoke job needs test bilan, services postgres o'n sakkiz, parol, baza nomi, port, pg is ready healthcheck. Initialize containers, npm run smoke, natija besh besh, stop containers.", { hl: 'smoke' }),
  sg('b5', "<b>env</b> — konteyner, <b>secrets</b> — tashqi; nomi xato — bo'sh, xato yo'q", "Beshinchi: konteyner paroli env'da ochiq, bu to'g'ri. Haqiqiy baza va token secrets'da, logda yulduzcha. Secret nomi xato bo'lsa GitHub indamaydi, qiymat bo'sh keladi, dastur topilmadi deb yiqiladi.", { hl: 'secret' }),
  sg('b6', "<b>Pull request</b> → checks → merge; badge; AI'ga to'rt savol", "Oltinchi: yangi ish alohida tarmoqda, pull request, checks yashil, merge, main'da run. README'da badge. AI smoke workflow'i: tayanch to'g'ri bo'lsa AI ham to'g'ri; to'rt savol: services, env, tartib, secret kerakmi.", { hl: 'pr' }),
  sg('hw', "<b>Uyga vazifa</b>: lint job, main himoyasi, qizil PR → yashil PR", "Uyga vazifa: lentaga uchinchi job lint, prettier check bilan. Keyin main tarmog'ini himoyalang: required status checks, test, smoke, lint. Ataylab noto'g'ri formatlangan fayl bilan pull request oching: lint qizil, merge yopiq.", { hl: 'hw' }),
  sg('hw2', "Tuzatib push — <b>yashil, merge</b>; repo va PR manzili platformaga", "Tuzatib push qiling: uchalasi yashil, merge. README'dagi badge yashil. Repo linkini va PR manzilini platformadagi uyga vazifaga qo'ying. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: run ichi, cache, matrix, services, secrets, PR — bir sahifada", "Pastda bir sahifalik eslatma: run, job, step, uses loglari, qizilni o'qish, cache, matrix, smoke job qolipi, env va secrets, pull request, badge, AI'ga to'rt savol, sinf lug'ati va xato qiladigan joylar. Nusxalab yoki yuklab oling.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET25, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('github-actions-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
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
            <div className="mk-rule" style={{ marginTop: 12 }}><b>{t("Tekshiruvchi qaraydi:", "Проверяющий смотрит:")}</b> <code>ci.yml</code>{t("da uch job · branch rule bor · PR tarixida qizil ", "три job · есть branch rule · в истории PR красный ")}<code>lint</code>{t(" run va keyin yashil merge.", " run, потом зелёный merge.")}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("WebSocket: jonli panel", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("Bot buyurtma olsa — brauzerdagi panel sahifani yangilamasdan o'zi ko'rsatadi", RS('NEXT_D'))}</div></div>
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
        <p className="mk-eyebrow">{t("Mentor kursi · CI/CD", "Курс для менторов · CI/CD")}</p>
        <h1>{t(LESSON_TITLE, RS('TITLE'))}</h1>
        <p className="af">{t('Bu darsdan keyin siz', 'После этого урока вы')}</p>
        <ul className="ok">
          {t(["qizil run'ni o'qiysiz: run → job → step → log, cache va matrix nima qilishini bilasiz", "smoke'ni lentaga qo'yasiz: services: postgres:18 va DATABASE_URL, secret nomi xatosini topasiz", "pull request bilan ishlaysiz va AI yozgan workflow'ni to'rt savol bilan tekshirasiz"], ['прочитаете красный run: run → job → step → лог, поймёте cache и matrix', 'поставите smoke в конвейер: services: postgres:18 и DATABASE_URL, найдёте ошибку в имени secret', 'поработаете с pull request и проверите workflow от AI четырьмя вопросами']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 15–30 daqiqa, 11-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: CI/CD-1 darsi (o'z reponingizda ci.yml), Node.js 20+, VS Code, AI yordamchi; Postgres lentada konteyner bo'lib ko'tariladi · Loyiha: cicd2-start tegi", 'Урок со звуком · 1 ч 15–30 мин, после 11-го экрана можно сделать перерыв · Нужно: урок CI/CD-1 (ci.yml в своём репозитории), Node.js 20+, VS Code, AI-помощник; Postgres поднимается в конвейере контейнером · Проект: тег cicd2-start')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><BotMap loc={DB_ALL} on={[...CI_ON, 'db', 'products', 'users', 'carts', 'orders']} dbLabel={DB_SVC} jest={CI2_OK} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, ScreenP7, Screen8, Screen9, Screen10, ScreenP11, Screen12, Screen13, Screen14, Screen15, Screen16, Screen17, Screen18, Screen19, ScreenP20, Screen21, Screen22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function GithubActionsMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
