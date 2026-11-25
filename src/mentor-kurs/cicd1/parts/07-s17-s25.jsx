
// ============================================================
//  17 · Lokalda yashil, lentada qizil: Node versiyasi (run 10a · cicd1v2-out/03d, 00 · run 10)
// ============================================================
const L17 = runLog('10a', 'Run npm ci', (l) => /^\$|EUSAGE|in sync|Missing:/.test(l));
const T17 = outPick('03d', (l) => /^\$ (node|npx)|^v24|^11\.|^10\.|Missing:|chiqish kodi: 1/.test(l));
const MACH17 = {
  l: { h: 'Sizning mashinangiz', st: 'ok', rows: [['node --version', 'v24.18.0'], ['npm --version', '11.16.0'], ['npm ci', '✓ (4-ekran)']] },
  r: { h: 'Runner · node-version: 22', st: 'bad', rows: [['Node', '22.23.4 (Found in cache)'], ['npm', '10.9.9'], ['npm ci', '✗ Missing: webpack@5.112.2 from lock file']], note: "npm 10 lock fayldagi bitta yozuvni (peer paket) boshqacha o'qiydi va «yo'q» deb hisoblaydi." },
};
const FIX17 = KOD.CI_DONE.lines.filter((l) => l.n >= 8 && l.n <= 11).flatMap((l) => l.n === 10 ? [{ h: yamlLine('          node-version: 22'), n: 10, gone: true }, { h: yamlLine(l.t), n: 10, neu: true, id: 'v' }] : [{ h: yamlLine(l.t), n: l.n }]);
const S17 = mkS(17, [{ v: 'run' }, { v: 'mach' }, { v: 'local' }, { v: 'fix' }]);
function Screen17(p) {
  return <Lesson p={p} S={S17} scene={({ seg }) => <>
    {seg.v === 'run' && <RunView k="10a" open="Run npm ci" lines={L17} hlStep="Run npm ci" ann={null} note={[t('Birinchi run — 04.11 17:40', "Первый run — 04.11 17:40"), t("o'sha ci.yml, faqat node-version: 22 — lokalda yashil, lentada qizil", "тот же ci.yml, только node-version: 22 — локально зелёный, в конвейере красный")]} />}
    {seg.v === 'mach' && <Machines left={MACH17.l} right={MACH17.r} hl="r" />}
    {seg.v === 'local' && <Term title={t("VS Code terminali · OrderBotNest · npm 10 bilan", "терминал VS Code · OrderBotNest · с npm 10")} lines={T17} er />}
    {seg.v === 'fix' && <div style={{ display: 'grid', gap: 10 }} className="c1-small"><CodePanel file="ci.yml · 8–11" lines={FIX17} focus={['v']} /><RunView k="10" hlStep="Run npm ci" /></div>}
  </>} />;
}

// ============================================================
//  18 · AI workflow yozdi — ikki to'plam (cicd1v2-ai: ai1 test.yml 22 satr · ai2 ci.yml 26 satr)
// ============================================================
const NV = (k) => KOD[k].lines.find((l) => /node-version/.test(l.t)).n;
const S18 = mkS(18, [{ v: 'stage' }, { v: 'prompt' }, { v: 'cards' }, { v: 'yml' }]);
function Screen18(p) {
  return <Lesson p={p} S={S18} scene={({ seg }) => <>
    {(seg.v === 'stage' || seg.v === 'prompt') && <div className="c1-stage">
      <div style={{ '--c': T.ink3, opacity: 0.45 }}><h4>{t("1–4-bosqich · lentani siz yozdingiz", "Этапы 1–4 · конвейер писали вы")}</h4><p>{t("ci.yml · push · yashil / qizil run · to'rt tuzoq", "ci.yml · push · зелёный / красный run · четыре ловушки")}</p></div>
      <div style={{ '--c': C1.ai }}><h4>{t("5-bosqich · AI yozadi, siz qabul qilasiz", "Этап 5 · пишет AI, вы принимаете")}</h4><p>{t("Bitta oddiy prompt → ikki workflow → haqiqiy lentada sinov", "Один простой промпт → два workflow → проверка в настоящем конвейере")}</p></div>
    </div>}
    {seg.v === 'prompt' && <AiReply who={t("Prompt — ikkala AI'ga bir xil", "Промпт — одинаковый для обоих AI")} prompt={KOD.PROMPT1} tag={t("ishorasiz: checkout, versiya, tsc, build yo'q", "без подсказок: checkout, версии, tsc, build нет")} />}
    {seg.v === 'cards' && <div className="pg-two">
      <AiReply who={t("1-AI (kuchli model)", "1-й AI (сильная модель)")} said={<><code>.github/workflows/test.yml</code>{t(" — 22 satr: checkout@v4 → setup-node@v4 (", " — 22 строки: checkout@v4 → setup-node@v4 (")}<b>node-version: 22</b>, cache npm) → <code>npm ci</code> → <code>npm test</code>{t(". Har qadamga o'zbekcha nom. YAML ✓.", ". У каждого шага узбекское имя. YAML ✓.")}</>} />
      <AiReply who={t("2-AI (kuchsizroq model)", "2-й AI (модель слабее)")} said={<><code>.github/workflows/ci.yml</code>{t(" — 26 satr: xuddi shu qadamlar + ", " — 26 строк: те же шаги + ")}<code>permissions: contents: read</code>{t(", job nomi «Jest testlar». ", ", имя job «Jest testlar». ")}<b>node-version: 22</b>. YAML ✓.</>} />
    </div>}
    {seg.v === 'yml' && <div style={{ display: 'grid', gap: 8 }}>
      <div className="pg-two"><Yml k="YML_AI1" title="test.yml · 1-AI" from={NV('YML_AI1') - 3} to={NV('YML_AI1') + 1} ids={{ [NV('YML_AI1')]: 'n' }} focus={['n']} /><Yml k="YML_AI2" title="ci.yml · 2-AI" from={NV('YML_AI2') - 3} to={NV('YML_AI2') + 1} ids={{ [NV('YML_AI2')]: 'n' }} focus={['n']} /></div>
      {/* F-1120-02 (M51): xulosada matnli qoida o'rniga darsning rasmi — AI yozgan lenta: tsc va build yo'q, hali sinalmagan */}
      <div className="mk-light" style={{ padding: 12 }}><BotMap loc={DB_ALL} on={CI_ON} jest={{ name: 'AI ×2', steps: [['npm ci', ''], ['tsc', 'skip'], ['npm test', ''], ['build', 'skip']], res: '?', badge: t('lentada sinaymiz', 'проверим на конвейере') }} max={1} tag={t("Ikkalasida tsc va build yo'q — to'g'ri ko'ringan fayl hali tekshiruv emas", 'В обоих нет tsc и build — правильный на вид файл ещё не проверка')} /></div>
    </div>}
  </>} />;
}

// ============================================================
//  19 · AI workflow'lari lentada: qizil → versiya → yashil, lekin… (run 19, 20, 21 — haqiqiy)
// ============================================================
const L19 = runLog('19', "Kutubxonalarni o'rnatish", (l) => /^\$|Missing:/.test(l));
const L20 = runLog('20', "Bog'liqliklarni o'rnatish", (l) => /^\$|Missing:/.test(l));
const L21 = runLog('21', 'Testlar', (l) => /^\$|^PASS|^Tests:/.test(l));
const FIX19 = KOD.YML_AI1.lines.filter((l) => l.n >= NV('YML_AI1') - 2 && l.n <= NV('YML_AI1') + 1).flatMap((l) => l.n === NV('YML_AI1') ? [{ h: yamlLine(l.t), n: l.n, gone: true }, { h: yamlLine(l.t.replace('22', '24')), n: l.n, neu: true, id: 'v' }] : [{ h: yamlLine(l.t), n: l.n }]);
const FOUR19 = ['checkout bormi?', 'node-version — mening `node --version` raqamimmi?', 'npm ci mi (install emas)?', 'tsc va build qadamlari bormi?'];
const S19 = mkS(19, [{ v: 'red' }, { v: 'green' }, { v: 'tsc' }, { v: 'four' }]);
function Screen19(p) {
  return <Lesson p={p} S={S19} scene={({ seg }) => <>
    {seg.v === 'red' && <div className="pg-two c1-small"><RunView k="19" open="Kutubxonalarni o'rnatish" lines={L19} ann={null} /><RunView k="20" open="Bog'liqliklarni o'rnatish" lines={L20} ann={null} /></div>}
    {seg.v === 'green' && <div style={{ display: 'grid', gap: 8 }} className="c1-small"><CodePanel file={t("test.yml · 1-AI, bitta raqam", "test.yml · 1-й AI, одно число")} lines={FIX19} focus={['v']} /><RunView k="21" open="Testlar" lines={L21} hlStep={["Node.js 22 o'rnatish", 'Testlar']} /></div>}
    {seg.v === 'tsc' && <div className="pg-two c1-small"><RunView k="14" note={[t("Yolg'on yashil (15-ekran)", "Ложный зелёный (экран 15)"), t("tsc qadami yo'q — tur xatosi o'tdi", "нет шага tsc — ошибка типа прошла")]} /><Card c={T.accent} h={t("AI workflow'i bilan ham shunday", "с workflow от AI так же")}><p>{t("Bu faylda ", "В этом файле ")}<b>{t("tsc yo'q", "нет tsc")}</b>{t(": 15-ekrandagi tur xatosini push qilsangiz — run ", ": если запушить ошибку типа с 15-го экрана — run ")}<b>{t("yashil", "зелёный")}</b>{t(" qoladi.", " останется.")}</p><p><b>{t("build yo'q", "нет build")}</b>{t(": yig'ilmaydigan kod yashil o'tadi.", ": несобираемый код проходит зелёным.")}</p><p style={{ marginTop: 6, color: T.ink3 }}>{t("Prompt «testlar yursin» dedi — AI faqat shuni qildi.", "Промпт сказал «пусть запускаются тесты» — AI сделал только это.")}</p></Card></div>}
    {seg.v === 'four' && <div className="mk-light" style={{ padding: 16 }}><div className="mk-tag">{t("AI workflow'ini qabul qilish — to'rt savol", "Приём workflow от AI — четыре вопроса")}</div><div className="mk-plan">{FOUR19.map((x, i) => <div key={i} className="hl" style={{ animation: `mk-up .4s ${i * 0.1}s ease both` }}><b>0{i + 1}</b><span dangerouslySetInnerHTML={html(x.replace(/`([^`]+)`/g, '<code>$1</code>'))} /></div>)}</div></div>}
  </>} />;
}

// ============================================================
//  20 · Tekshiruv 4 — AI workflow'ni qabul qilish (1-AI test.yml aynan · run 21, 14, 10a)
// ============================================================
const AI20 = new Set([12, 15, 16, 17, 21, 24]); // 1-AI test.yml — faqat qadam satrlari, raqami aynan (nom va bo'sh satrlarsiz: panel eski 6 satr balandligida qoladi)
const NODE20 = jt('$ node --version\n' + KOD.VERSIONS.local.split('\n')[0]);
function Screen20(p) {
  return MC(p, 20, {
    above: <div style={{ display: 'grid', gap: 8 }}>
      <CodePanel file={t("test.yml · 1-AI yozgan · qadam satrlari", "test.yml · написал 1-й AI · строки шагов")} lines={kod('YML_AI1', { [NV('YML_AI1')]: 'n' }).filter((l) => AI20.has(l.n))} focus={['n']} />
      <Term title={t("VS Code terminali · sizning mashinangiz", "терминал VS Code · ваша машина")} lines={NODE20} />
    </div>,
    after: <div className="c1-small"><RunView k="21" only={/olish|rnatish|Testlar/} note={[t('node-version: 24 bilan — yashil', "с node-version: 24 — зелёный"), t("lekin tsc va build yo'q: tur xatosi yashil o'tadi (run 14)", "но нет tsc и build: ошибка типа проходит зелёной (run 14)")]} /></div>,
  });
}

// ============================================================
//  21 · Amaliyot 3 — AI workflow, to'rt tekshiruv, buzib ko'rish (prompt — MD 21-ekrandan aynan)
// ============================================================
const PROMPT21 = KOD.PROMPT2.split('. ').map((s, i, a) => ({ h: escH(s + (i < a.length - 1 ? '.' : '')) }));
const P21 = mkPractice(21, [[], [0, 1], [2, 3], []], {
  code: [{ step: 0, file: 'prompt.txt', lines: PROMPT21 }, { step: 1, file: F.ci, lines: kod('CI_DONE'), copy: false }, { step: 3, file: F.usr, lines: kod('USER_20', { 16: 'x' }, 15, 22, EDIT16), copy: false }],
});
function ScreenP21(p) { return <Practice p={p} S={P21.S} steps={P21.steps} trouble={P21.trouble} proof={P21.proof} code={P21.code} tree={['prompt.txt', F.ci, F.usr]} />; }

// ============================================================
//  22 · CD: Delivery, Deployment va .env chegarasi (cicd1v2-out/05)
// ============================================================
const T22 = outPick('05', (l) => /^\$|^> nest|chiqish kodi|^Error: DATABASE_URL|throw new Error/.test(l));
function CdFlow({ hl, today }) {
  const box = (k, c, h, tx) => <div key={k} className={today && k === 'srv' ? 'dim' : ''} style={{ '--c': c, boxShadow: hl === k ? `0 0 0 4px color-mix(in srgb, ${c} 18%, transparent)` : 'none' }}><h4>{h}</h4><p>{tx}</p></div>;
  return <div className="c1-cd">
    {box('ci', C1.ci, 'CI ✓', t('npm ci · tsc · test · build — yashil', "npm ci · tsc · test · build — зелёный"))}
    {box('pkg', T.green, t('Paket tayyor', "Пакет готов"), t('dist/ — lekin .env yo\'q, baza yo\'q', "dist/ — но нет .env и базы"))}
    {box('cd', C1.cd, 'CD', t('Delivery — odam «chiqar» tugmasini bosadi · Deployment — lenta o\'zi', "Delivery — человек нажимает «выпустить» · Deployment — конвейер сам"))}
    {box('srv', C1.cd, 'Server', t('bot yuradigan joy: DATABASE_URL, BOT_TOKEN — Secrets', "где работает бот: DATABASE_URL, BOT_TOKEN — Secrets"))}
  </div>;
}
const S22 = mkS(22, [{ v: 'term' }, { v: 'cd' }, { v: 'need' }, { v: 'sum' }]);
function Screen22(p) {
  return <Lesson p={p} S={S22} scene={({ seg }) => <>
    {seg.v === 'term' && <Term title={t("VS Code terminali · toza clone, .env yo'q", "терминал VS Code · чистый clone, нет .env")} lines={T22} er />}
    {seg.v === 'cd' && <CdFlow hl="cd" />}
    {seg.v === 'need' && <div className="pg-three">
      <Card c={C1.cd} h={t("Maxfiy qiymatlar", "Секретные значения")}><p><code>DATABASE_URL</code>, <code>BOT_TOKEN</code> — GitHub <b>Secrets</b>{t(": ci.yml nom bilan oladi, qiymatni hech kim ko'rmaydi", ": ci.yml берёт по имени, значение никто не видит")}</p></Card>
      <Card c={C1.cd} h="Server"><p>{t("Bot qayerda yuradi — alohida mashina yoki xizmat", "Где работает бот — отдельная машина или сервис")}</p></Card>
      <Card c={C1.cd} h={t("Chiqarish buyrug'i", "Команда выпуска")}><p>{t("Paketni serverga yetkazib, ishga tushirish — lentaning oxirgi qadami", "Доставить пакет на сервер и запустить — последний шаг конвейера")}</p></Card>
    </div>}
    {/* F-1120-02 (M51): xulosada matnli qoida o'rniga darsning rasmi — CI yashil, lekin toza mashinada node dist/main yiqildi (haqiqiy xato, outPick 05) */}
    {seg.v === 'sum' && <div style={{ display: 'grid', gap: 10 }}><CdFlow today /><div className="mk-light" style={{ padding: 12 }}><BotMap loc={DB_ALL} on={CI_ON} jest={CI_OK} ro={['node dist/main', '<span class="n1-er">Error: DATABASE_URL topilmadi.</span> .env …']} max={1} tag={t("Bugun CI to'liq, CD chegarasi aniq; secrets va run'ni o'qish — keyingi mentor darsida", 'Сегодня CI полностью, граница CD ясна; secrets и чтение run — на следующем уроке')} /></div></div>}
  </>} />;
}

// ============================================================
//  23 · Sinfga tayyorgarlik: m4c-01 (CiCdIntroLesson.jsx — SCREEN_META 20; aeroport lentasi, ci.yml builder, amaliyot)
// ============================================================
const DICT23 = [['lenta · chamadon', 'pipeline · kod (commit)'], ["Yig'ish · Skaner · O'rash · Uchirish", 'npm install · npm test · npm run build · deploy (CD)'], ["O'lcham ramkasi", "eslint . — OrderBotNest'da yo'q, o'quvchi reposida bor"], ["start signali · yo'l xaritasi · lenta mashinasi", 'on: push · ci.yml · runner (runs-on: ubuntu-latest)'], ["qizil chiroq — lenta to'xtaydi", "chiqish kodi 0 emas — keyingi qadamlar «skipped»"], ['seyf', 'GitHub Secrets (keyingi dars)']];
const ADD23 = [["actions/checkout satri — o'quvchi ci.yml'ida yo'q (13-ekran): amaliyotda «bitta qator qo'shing»", 'amaliyot, ci.yml'], ["npm ci vs npm install — o'quvchi install yozadi; sinfda sabab bir gapda (14-ekran)", 's13 builder'], ["haqiqiy Actions run'ini bir marta ekranda ko'rsatish: qizil qadam, skipped", 'amaliyot oxiri'], ["«lokalda yashil, lentada qizil» — Node versiyasi (17-ekran)", "o'quvchi shikoyat qilganda"]];
const CARDS23 = [
  ["Actions'da run yo'q", '—', "fayl .github/workflows/ da emas yoki push bormagan"],
  ['npm install / npm test qizil', 'Could not read package.json … ENOENT', "checkout satri yo'q — papka bo'sh"],
  ["Run qizil, job yo'q", 'workflow file issue', "YAML surilish / runs-on yo'q"],
];
const QA23 = [
  ['«Lenta mening kompyuterimda yuradimi?»', "Yo'q — GitHub'dagi toza mashinada; shuning uchun checkout va npm install kerak."],
  ['«Nega npm install yana? Menda bor-ku»', "Toza mashinada node_modules yo'q — har run'da yangidan."],
  ["«Qizil bo'lsa sayt buziladimi?»", "Yo'q — qizil kod chiqmaydi, lenta to'xtaydi; bu himoya."],
  ['«Deploy qayerga?»', 'Bu CD — keyingi darslarda; hozir lenta tekshiradi, chiqarmaydi.'],
];
function QA({ items }) {
  const [open, setOpen] = useState(-1);
  return <div className="pg-qa">{items.map(([q, a], i) => <button key={q} onClick={() => setOpen(open === i ? -1 : i)}><b>{q}</b>{open === i && <p>{a}</p>}</button>)}</div>;
}
const S23 = mkS(23, [{ v: 'cards' }, { v: 'dict' }, { v: 'add' }, { v: 'err' }]);
function Screen23(p) {
  return <Lesson p={p} S={S23} scene={({ seg }) => <>
    {seg.v === 'cards' && <div className="pg-two">
      <Card c={T.blue} h={t("O'quvchi · m4c-01 (20 ekran)", "Ученик · m4c-01 (20 экранов)")} hl><p><b>{t("Aeroport lentasi", "Лента в аэропорту")}</b>{t(" — chamadon (kod) → Yig'ish ", " — чемодан (код) → Сборка ")}<code>npm install</code> → Skaner <code>npm test</code>{t(" → O'lcham ramkasi ", " → Рамка размера ")}<code>eslint .</code>{t(" → O'rash ", " → Упаковка ")}<code>npm run build</code>{t(" → Uchirish (deploy) · ", " → Вылет (deploy) · ")}<code>on: push</code> = start signali · s13: <code>ci.yml</code>{t(" bo'shliqlari · amaliyot: o'z reposiga ", " пропуски · практика: в свой репозиторий ")}<code>ci.yml</code></p></Card>
      <Card c={T.accent} h={t("Siz · bugun", "Вы · сегодня")}><p>OrderBotNest · <code>npm ci</code> · <code>tsc</code> · <code>test</code> · <code>build</code>{t(" · haqiqiy run'lar · to'rt tuzoq · Node versiyasi · AI workflow'i", " · настоящие run · четыре ловушки · версия Node · workflow от AI")}</p></Card>
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
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: CI nima qiladi, chiqish kodi, lenta qayerda to'xtaydi, to'rt tuzoq, Node versiyasi va AI workflow'i. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? t("Dars o'zlashtirildi. Endi o'quvchi lentam qizil desa, qaysi qadamga qarashni bilasiz.", RS('FIN_PASS')) : t("Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.", 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))), 400);
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
  { k: 'ci', t: "CI — har push'da toza mashinada sizning buyruqlaringiz: «menda ishlaydi» o'rniga hammaga bir xil javob. CD — tekshirilgan yukni chiqarish (Delivery: odam tasdiqlaydi · Deployment: lenta o'zi)", st: ['ci'] },
  { k: 'lenta', t: "Lenta — npm ci → npx tsc --noEmit → npm test → npm run build; har qadam chiqish kodi: 0 — yashil, boshqasi — qizil; birinchi qizildan keyin qolgani «skipped»", st: ['lenta'] },
  { k: 'yml', t: "ci.yml uch qism: on (push, pull_request) · runs-on: ubuntu-latest · steps (uses: actions/checkout@v4, actions/setup-node@v4 + run: buyruqlar). Push → Actions → run → job → qadamlar → log", st: ['yml'] },
  { k: 'tuzoq', t: "To'rt tuzoq: checkout yo'q («lock yo'q» — papka bo'sh) · lock mos emas («in sync» — lentada npm ci, lokalda npm install + lock commit'ga) · tsc qadamisiz yolg'on yashil · YAML surilish / runs-on yo'q (job yo'q)", st: ['tuzoq'] },
  { k: 'node', t: "Lokalda yashil, lentada qizil — avval node-version ↔ node --version: runner'dagi npm lock'ni boshqacha o'qiydi (Missing: webpack… from lock file)", st: ['tuzoq', 'lenta'] },
  { k: 'ai', t: "AI workflow'i — boshlanish nuqtasi: to'rt savol (checkout · versiya meniki · npm ci · tsc va build), keyin push va run. CD chegarasi: node dist/main .env'siz yiqiladi — secrets keyingi darsda", st: ['ai', 'ci'] },
];
// F-1120-02 (M51): xulosa — darsning o'sha rasmi (BotMap + lenta); har band rasmning o'z qismini yoritadi
// tuzoq: checkout qadami yo'q — papka bo'sh, npm ci yiqiladi (run 13) · node: runner'da npm ci «Missing: webpack…» (run 17)
const CI_TUZOQ = { name: 'Actions', steps: [['setup-node', 'ok'], ['npm ci', 'bad'], ['tsc', 'skip'], ['npm test', 'skip']], res: 'fail', get badge() { return t("checkout yo'q", 'нет checkout'); } };
const CI_NODE = { name: 'Actions', steps: [['npm ci', 'bad'], ['tsc', 'skip'], ['npm test', 'skip'], ['build', 'skip']], res: 'fail', badge: 'Missing: webpack…' };
const MAP25 = { ci: { jest: CI_OK }, lenta: { jest: CI_OK }, yml: { jest: CI_OK }, tuzoq: { jest: CI_TUZOQ }, node: { jest: CI_NODE }, ai: { jest: CI_OK } };
function SummaryMap25({ hl }) {
  const m = MAP25[hl] || MAP25.ci;
  return <div className="mk-light" style={{ padding: 14 }}>
    <BotMap loc={DB_ALL} on={CI_ON} {...m} max={1.05} tag={t("Bugungi dars — har push'da toza mashinada lenta", 'Сегодняшний урок — конвейер на чистой машине при каждом push')} />
  </div>;
}
const HOMEWORK25 = [
  { t: "pull_request — ci.yml: on: [push, pull_request]", c: ['on: [push, pull_request]'] },
  { t: "lint job — jobs.lint: checkout · setup-node · npm ci · npx prettier --check \"src/**/*.ts\" (ikki job: test ✓ · lint ✓)", c: ['npx prettier --check "src/**/*.ts"'] },
  { t: "Badge — README birinchi qatoriga lenta nishoni", c: ['![CI](https://github.com/<siz>/OrderBotNest/actions/workflows/ci.yml/badge.svg)'] },
  { t: "Buzish — src/api/app.controller.ts da satrni bir qatorga yig'ib (formatni buzib) push: lint ✗, test ✓ · keyin prettier --write va push: ikkalasi ✓", c: ['npx prettier --write src/api/app.controller.ts'] },
  { t: "Topshirish — repo linki platformadagi uyga vazifaga", c: ['git add . && git commit -m "ci: lint job va badge"', 'git push mine HEAD:main'] },
];
const CHEATSHEET25 = `# CI/CD — mentor eslatmasi (OrderBotNest, lenta)
## Loyiha
git fetch --tags · git checkout cicd1-start (= jest2-done) → cicd1-done (.github/workflows/ci.yml) · npm test — 25 test, baza va token kerak emas
## CI / CD
CI — har push'da toza mashinada sizning buyruqlaringiz (o'rnatish → turlar → test → build): «menda ishlaydi» o'rniga hammaga bir xil javob · CD — tekshirilgan yukni chiqarish: Delivery (odam tasdiqlaydi) · Deployment (lenta o'zi)
## Lenta — to'rt qadam
npm ci → npx tsc --noEmit → npm test → npm run build · chiqish kodi: 0 yashil, 1 (jest), 2 (tsc), 127 (buyruq yo'q) qizil · birinchi qizildan keyin qolgani «skipped» · lokalda: npm ci && npx tsc --noEmit && npm test && npm run build
## ci.yml (15 satr)
name: CI · on: [push, pull_request] · jobs: test: runs-on: ubuntu-latest · steps: - uses: actions/checkout@v4 · - uses: actions/setup-node@v4 (with: node-version: 24, cache: npm) · - run: npm ci · - run: npx tsc --noEmit · - run: npm test · - run: npm run build
push → Actions → run → job → qadamlar (Set up job, checkout, setup-node, run: …) → log (qadamni bosing)
## To'rt tuzoq
checkout yo'q → npm ci: «can only install with an existing package-lock.json» (papka bo'sh) · package.json qo'lda o'zgargan, lock eski → «in sync» emas (lokalda npm install, lock commit'ga; lentada npm ci) · tsc qadami yo'q → tur xatosi yashil o'tadi (yolg'on yashil) · YAML surilish / runs-on yo'q → run qizil, job yo'q («workflow file issue»)
## Lokalda yashil, lentada qizil
Missing: webpack@5.112.2 from lock file → runner'dagi Node (npm) mashinangizdan boshqa: node-version = node --version raqamingiz (22 → 24 — yashil)
## AI workflow'ini qabul qilish — to'rt savol
checkout bormi · node-version meniki · npm ci (install emas) · tsc va build qadamlari bormi → push → run yashilmi · ikkala AI node-version: 22 yozdi, tsc/build yo'q
## CD chegarasi
node dist/main → DATABASE_URL topilmadi (.env yo'q) · kerak: Secrets (DATABASE_URL, BOT_TOKEN) · server · chiqarish buyrug'i — keyingi darslar
## Sinfga tayyorgarlik (m4c-01, 20 ekran)
aeroport lentasi: Yig'ish = npm install · Skaner = npm test · O'lcham ramkasi = eslint · O'rash = build · Uchirish = deploy · start signali = on: push · yo'l xaritasi = ci.yml · siz qo'shasiz: checkout satri (o'quvchi yml'ida yo'q), npm ci sababi, bitta haqiqiy run
## Xato qiladigan joylar
run yo'q → fayl yo'li / push · Could not read package.json (ENOENT) → checkout yo'q · run qizil, job yo'q → YAML / runs-on · Missing … from lock file → Node versiyasi
## Sizning uyga vazifangiz (40–60 daqiqa)
pull_request · lint job (prettier --check) · README badge · bir marta lint qizil → yashil → repo linki platformaga`;
const s25Segments = (passed) => yakRu(passed, [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "CI — <b>toza mashinada sizning buyruqlaringiz</b>; CD — tekshirilgan yukni chiqarish", "Birinchi: CI, har push'da toza mashinada sizning buyruqlaringiz yuradi. Menda ishlaydi o'rniga hammaga bir xil javob. CD, tekshirilgan yukni chiqarish: Delivery'da odam tasdiqlaydi, Deployment'da lenta o'zi chiqaradi.", { hl: 'ci' }),
  sg('b2', "Lenta: <b>to'rt qadam, chiqish kodi</b>; birinchi qizildan keyin qolgani «skipped»", "Ikkinchi: lenta to'rt qadam: npm si ay, tsc, test, build. Har biri chiqish kodi qaytaradi: nol yashil, boshqasi qizil. Birinchi qizil qadamda lenta to'xtaydi, qolgani skipped, buzuq kod yig'ilmaydi.", { hl: 'lenta' }),
  sg('b3', "<b>ci.yml</b> uch qism: on · runs-on · steps; push → run → job → qadam → log", "Uchinchi: ci yml uch qism. On, qachon. Runs on, qaysi mashina. Steps, qadamlar: checkout, setup node va sizning run buyruqlaringiz. Push qilasiz, Actions'da run paydo bo'ladi, ichida job, qadamlar va har qadamning logi.", { hl: 'yml' }),
  sg('b4', "<b>To'rt tuzoq</b>: checkout yo'q · lock mos emas · tsc yo'q · YAML xatosi", "To'rtinchi: to'rt tuzoq. Checkout yo'q, papka bo'sh. Package json va lock mos emas, in sync xatosi. Tsc qadami yo'q, yolg'on yashil. YAML surilish yoki runs on yo'q, run qizil, lekin job yo'q.", { hl: 'tuzoq' }),
  sg('b5', "Lokalda yashil, lentada qizil — <b>node-version = node --version</b>", "Beshinchi: lokalda yashil, lentada qizil bo'lsa, avval Node versiyasini solishtiring. Runner'dagi npm lock faylni boshqacha o'qiydi: missing webpack from lock file. Ci yml'dagi node version mashinangizdagi raqam bo'lsin.", { hl: 'node' }),
  sg('b6', "AI workflow'i — <b>to'rt savol</b>; CD chegarasi — secrets keyingi darsda", "Oltinchi: AI yozgan workflow boshlanish nuqtasi. To'rt savol: checkout bormi, versiya meniki, npm si ay'mi, tsc va build bormi. Keyin push va run. CD chegarasi: dist main env'siz yiqiladi, secrets va server keyingi darsda.", { hl: 'ai' }),
  sg('hw', "<b>Uyga vazifa</b>: pull_request, lint job va README'da lenta nishoni", "Uyga vazifa: o'z reponingizdagi lentani kengaytiring. Pull request'da ham yursin. Ikkinchi job lint: prettier check. README'ga lenta nishonini qo'ying: har kim ochganda yashilmi, qizilmi, ko'radi.", { hl: 'hw' }),
  sg('hw2', "Bir marta <b>lint qizil</b>, keyin yashil; repo linki platformaga", "Keyin bitta faylning formatini ataylab buzib push qiling: lint qizil, test yashil bo'lsin. Tuzatib push, ikkalasi yashil. Repo linkini platformadagi uyga vazifaga qo'ying. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: lenta, ci.yml, to'rt tuzoq, Node qoidasi va AI savollari — bir sahifada", "Pastda bir sahifalik eslatma: CI va CD, lentaning to'rt qadami, ci yml, to'rt tuzoq, Node versiyasi qoidasi, AI workflow'iga to'rt savol, CD chegarasi va xato qiladigan joylar. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
]);
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = t(CHEATSHEET25, RS('CHEAT'));
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = t('cicd-lenta-mentor-eslatma.md', RS('FILE')); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
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
            <div className="mk-rule" style={{ marginTop: 12 }}><b>{t("Tekshiruvchi qaraydi:", "Проверяющий смотрит:")}</b> <code>ci.yml</code>{t("da ikki job · README'da badge · Actions'da kamida bitta qizil ", "две job · badge в README · в Actions хотя бы один красный ")}<code>lint</code>{t(" run va undan keyin yashil.", " run и после него зелёный.")}</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>{t('yuklab olish (.md)', 'скачать (.md)')}</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>{t('Kursdagi keyingi mentor darsi', 'Следующий урок курса для менторов')}</h5><div style={{ fontSize: 15, fontWeight: 700 }}>{t("GitHub Actions: run, log va namunalar", RS('NEXT_T'))}</div><div style={{ fontSize: 13.5, color: T.ink2 }}>{t("Qizil run'ni o'qish, secrets, cache, matrix", RS('NEXT_D'))}</div></div>
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
          {t(["lentani qo'lda yurgizasiz: npm ci → tsc → npm test → build va chiqish kodini o'qiysiz", "ci.yml yozasiz va GitHub Actions'da qizil run'ning sababini logdan topasiz", "«lokalda yashil, lentada qizil»ni va AI yozgan workflow'ni to'rt savol bilan tekshirasiz"], ['запустите конвейер вручную: npm ci → tsc → npm test → build и прочитаете код выхода', 'напишете ci.yml и найдёте в логе причину красного run в GitHub Actions', 'проверите «локально зелёный, на конвейере красный» и workflow от AI четырьмя вопросами']).map((x) => <li key={x}>{x}</li>)}
        </ul>
        <p className="meta">{t("Ovozli dars · 1 soat 15–30 daqiqa, 12-ekrandan keyin tanaffus qilsa bo'ladi · Kerak: Jest-2 darsi (25 test), Node.js 20+, VS Code, GitHub hisobi va o'z reposi, AI yordamchi; baza va bot tokeni kerak emas · Loyiha: cicd1-start tegi", 'Урок со звуком · 1 ч 15–30 мин, после 12-го экрана можно сделать перерыв · Нужно: урок Jest-2 (25 тестов), Node.js 20+, VS Code, аккаунт GitHub и свой репозиторий, AI-помощник; база и токен бота не нужны · Проект: тег cicd1-start')}</p>
        <CoverStart onStart={onStart} resume={resume} />
      </div>
      <div className="pic"><BotMap loc={DB_ALL} on={CI_ON} jest={CI_OK} max={1} /></div>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, ScreenP7, Screen8, Screen9, Screen10, Screen11, ScreenP12, Screen13, Screen14, Screen15, Screen16, Screen17, Screen18, Screen19, Screen20, ScreenP21, Screen22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function CiCdIntroMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
