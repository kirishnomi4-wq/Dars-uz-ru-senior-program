# F-1018-15 · m12-08 PmFinalPitchLesson (LMS 14-Modul 8-dars) 12 → 11 (222-qonun + 222.7 tekshiruv sahifasi). Zaxiradan quradi: python3 f1018n.py
import re, sys
R = '/home/kali/Desktop/internetLesson'
SRC = f'{R}/arxiv/F-1018-15-oldin/PmFinalPitchLesson.jsx'
DST = f'{R}/src/12-Modull/PmFinalPitchLesson.jsx'
s = open(SRC, encoding='utf8').read()
def rep(old, new, label=''):
    global s
    c = s.count(old)
    if c != 1: print(f'❌ {label or old[:70]!r}: topildi {c}'); sys.exit(1)
    s = s.replace(old, new)
def cut(a_m, b_m, label):
    global s
    a = s.find(a_m); b = s.find(b_m, a + 1)
    if a < 0 or b <= a: print(f'❌ cut {label}: {a} {b}'); sys.exit(1)
    out = s[a:b]; s = s[:a] + s[b:]; print(f'  kesildi {label}: {out.count(chr(10))} qator'); return out

rep("lessonId: 'pm-m12d8-v1'", "lessonId: 'pm-m12d8-v2'")
rep("// Ekranlar: s0 QKirish · s1 QReja · s2/s3 QTushuncha · s4/s8 test (QuestionScreen → QTest) · s5/s6/s7 QMustaqil · podium · QKartochka · QYakun.",
    "// v2 (F-1018-15 · 222-qonun): s0 QKirish · s1 QReja · s2/s3 QTushuncha · s5/s6/s7 QMustaqil (6 — 1-raund 5 daq, 7 — 2-raund savol-javob) · s8 yakuniy test ·\n//   stekshir QMustaqil «Mahsulotingizda kamchilik bormi?» (222.7, Demo Day oldidan) · podium · QYakun. Olindi: s4 test, kartochkalar. Yakuniy MD: feedback/F-1018-pitch/YAKUNIY-11-m12-08.md", 'header')
rep("// 12 ekran (keyssiz PM — tayanch 4): kirish → reja → 2 tushuncha → test → 3 mustaqil ish → yakuniy test → podium → kartochkalar → yakun.",
    "// 11 ekran (v2): kirish → reja → 2 tushuncha → 3 mustaqil ish → yakuniy test → mahsulot tekshiruvi → podium → yakun.", 'header 2')
a = s.index('const SCREEN_META = ['); b = s.index('const TOTAL_SCREENS')
s = s[:a] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // 0 · QKirish
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // 1 · QReja
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 2 · savol-javob
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 3 · tuzatish va taymer
  { id: 's5',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 4 · tuzatishlaringiz
  { id: 's6',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 5 · 5 daqiqa (1-raund)
  { id: 's7',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 6 · savol-javob mashqi (2-raund)
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // 7 · yakuniy savol
  { id: 'stekshir', type: 'practice', template: 'custom', scored: false, scope: null },            // 8 · mahsulotingizda kamchilik bormi? (222.7)
  { id: 'podium',   type: 'stats',      template: 'custom', scored: false, scope: null },          // 9 · podium
  { id: 's11', type: 'summary',     template: 'custom',   scored: false, scope: null }             // 10 · QYakun
];
""" + s[b:]
rep("const INLINE_KEYS = { s4: 2, s8: 0, practice: -1 };", "const INLINE_KEYS = { s8: 0, practice: -1 };")
a = s.index('const RECAPS = {'); b = s.index('\n};', a) + 3
m = re.search(r"\n  8: \{.*?\n  \},?", s[a:b], re.S)
if not m: print('❌ RECAPS 8'); sys.exit(1)
s = s[:a] + 'const RECAPS = {' + m.group(0).replace('\n  8: {', '\n  7: {').rstrip(',') + '\n};' + s[b:]
a = s.index('const Q_LABELS = {'); b = s.index('\n};', a) + 3
s = s[:a] + """const Q_LABELS = {
  7: { uz: 'Yakuniy — Bilgan faktni aytish', ru: 'Итог — Назвать известный факт' }
};""" + s[b:]
a = s.index('const SCREEN_INTENTS = ['); b = s.index('\n];', a) + 3
s = s[:a] + """const SCREEN_INTENTS = [
  'kirish: hakam sonning manbasini so\\'radi — bilmasangiz nima deysiz', 'reja: taymer 5:00, savol-javob va ilova tekshiruvi', 'savol-javob: son va manba · fakt · «tekshirib aytaman»',
  'tuzatish va taymer: uch tuzatish eski gap o\\'rniga, reja 5:00, haqiqiy vaqt — taymer bilan', 'o\\'z tuzatishlarini qo\\'llash (pm-m12d8-final)',
  'pitch 5 daqiqada, sherik yoki yakka (1-raund)', 'uch savolga bir daqiqadan javob (2-raund)', 'yakuniy test: bilgan faktni aytish',
  'mahsulot tekshiruvi: telefon · asosiy harakat · savol-javob ekrani (pm-m12d6-demo)', 'podium', 'yakun: 6 holat'
];""" + s[b:]
cut("// ===== SCREEN 4 — TEKSHIRUV", "// ===== SCREEN 5 — TUZATISHLARINGIZ", "s4 test")
cut("// 🃏 KARTOCHKALAR", "// ===== UYGA VAZIFA", "kartochkalar")

# final kaliti: tekshiruv maydoni normallashtiruvdan o'tadi (aks holda keyingi finalYoz uni o'chiradi)
rep("""    vaqt: Number.isFinite(f.vaqt) ? f.vaqt : null,
    savollar:""", """    vaqt: Number.isFinite(f.vaqt) ? f.vaqt : null,
    tekshiruv: f.tekshiruv && typeof f.tekshiruv === 'object' ? f.tekshiruv : null, // F-1018-15: { holat: { ochildi, harakat, savol }, link }
    savollar:""", 'finalOl')

TK = r"""// ===== SCREEN TEKSHIR — MAHSULOTINGIZDA KAMCHILIK BORMI? (222.7 · F-1018-15: Demo Day oldidan, arenadan oldin; ballsiz; ssenariy va B-yo'l pm-m12d6-demo dan;
//   213.1 — tekshiruvlar bittadan: bajarilgani ✓ qatorga yig'iladi, keyingisi keyin chiqadi; 213.3 — qatorlar chegarasiz, holat fon bilan) =====
const TK_CHECKS = [
  { k: 'ochildi', t: { uz: "Ilova telefonda ochildi — birinchi ekran chiqdi", ru: 'Приложение открылось на телефоне — появился первый экран' }, iz: { uz: "Render'dagi server uxlab qoladi: sahnadan 2–3 daqiqa oldin oching.", ru: 'Сервер на Render засыпает: откройте за 2–3 минуты до сцены.' } },
  { k: 'harakat', t: { uz: "Ssenariydagi asosiy harakat oxirigacha ishlaydi", ru: 'Главное действие из сценария работает до конца' }, iz: { uz: 'Ssenariyni boshidan oxirigacha telefonda bir marta bosib chiqing.', ru: 'Пройдите сценарий на телефоне один раз от начала до конца.' } },
  { k: 'savol', t: { uz: "Savol-javobda ko'rsatadigan ekraningiz ochiladi", ru: 'Открывается экран, который покажете на вопросах-ответах' }, iz: { uz: "Masalan, sonlar turgan sahifa: hakam «qayerdan bilasiz?» desa, shuni ko'rsatasiz.", ru: 'Например, страница с числами: если судья спросит «откуда знаете?», покажете её.' } }
];
const TK_PROMPT = { uz: "Mana ilovamning kodi: {kod}. Telefonda ochganda muammo: {kamchilik}. Faqat o'zgartiriladigan qatorlarni ko'rsat, sababini bir gapda ayt.", ru: 'Вот код моего приложения: {код}. Проблема при открытии на телефоне: {недочёт}. Покажи только строки, которые нужно изменить, и объясни причину одной фразой.' };
const ScreenTekshir = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const boshF = useMemo(() => finalOl(), []);
  const ssenariy = useMemo(() => ssenariyOl(), []);
  const bYol = useMemo(() => { const d = lsO(DEMO_KEY); const r = d && Array.isArray(d.risklar) ? d.risklar.map(x => x && matnOl(x.bYol)).filter(Boolean) : []; return r[0] || null; }, []);
  const [trek] = useState(() => { const p = lsO('pm-m9d8-platforma'); return p && (p.trek === 'web' || p.trek === 'mobil') ? p.trek : null; });
  const [link, setLink] = useState(() => (boshF.tekshiruv && typeof boshF.tekshiruv.link === 'string' ? boshF.tekshiruv.link : ((lsO('pm-m9d16-pitch') || {}).ilova || '')));
  const [holat, setHolat] = useState(() => (storedAnswer && storedAnswer.tekshiruv) || (boshF.tekshiruv && boshF.tekshiruv.holat) || {}); // k → 'ok' | 'bad' | 'fixed'
  const [pOpen, setPOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const yechildi = (k) => holat[k] === 'ok' || holat[k] === 'fixed';
  const doneN = TK_CHECKS.filter(c => yechildi(c.k)).length;
  const done = doneN === TK_CHECKS.length;
  const joriyI = TK_CHECKS.findIndex(c => !yechildi(c.k));
  const sentRef = useRef(!!(storedAnswer && storedAnswer.solved));
  useEffect(() => {
    if (!done || isMentor || sentRef.current) return;
    sentRef.current = true;
    onAnswer(screen, { stage: 'tekshiruv', screenIdx: screen, solved: true, correct: true, picked: true, tekshiruv: holat });
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'tekshiruv', 0, true, 0);
  }, [done]); // eslint-disable-line
  const set = (k, v) => { if (isMentor) return; const h = { ...holat, [k]: v }; setHolat(h); finalYoz({ tekshiruv: { holat: h, link: link.trim() } }); };
  const saveLink = (v) => { setLink(v); if (!isMentor) finalYoz({ tekshiruv: { holat, link: v.trim() } }); };
  const href = link.trim() ? (/^https?:\/\//.test(link.trim()) ? link.trim() : 'https://' + link.trim()) : '';
  const copy = async () => { try { await navigator.clipboard.writeText(tr(TK_PROMPT)); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch (_e) { /* clipboard ruxsati yo'q */ } };
  const badBor = TK_CHECKS.some(c => holat[c.k] === 'bad');
  const mentorT = isMentor ? { uz: "Har o'quvchi o'z telefonida ilovani ochib, uch narsani birma-bir tekshiradi.", ru: 'Каждый ученик открывает приложение на своём телефоне и по очереди проверяет три вещи.' }
    : done ? { uz: "Ilova sahnaga tayyor — «Davom etish»ni bosing.", ru: 'Приложение готово к сцене — нажмите «Продолжить».' }
      : badBor ? { uz: "Kamchilikni VS Code'da to'g'rilang va push qiling. Darsda ulgurmasangiz — B-yo'lni sahnaga tayyorlab qo'ying.", ru: 'Исправьте недочёт в VS Code и сделайте push. Если на уроке не успеваете — подготовьте к сцене путь Б.' }
        : { uz: `Demo Day'da sahnada shu ilova ochiladi. Telefonda oching: ${joriyI + 1}-tekshiruv.`, ru: `На Демо-дне на сцене откроется это приложение. Откройте его на телефоне: проверка ${joriyI + 1}.` };
  const chapA = <div className="fp-tk-a">
    <span className="fp-oldin-y">{tr({ uz: 'Ilovangiz', ru: 'Ваше приложение' })}</span>
    {trek !== 'mobil' && <>
      {href && <a className="fp-tk-och" href={href} target="_blank" rel="noreferrer">{tr({ uz: 'Ilovani ochish', ru: 'Открыть приложение' })}</a>}
      <input className="fp-tk-inp" value={link} disabled={isMentor} onChange={e => saveLink(e.target.value)} aria-label={tr({ uz: 'Ilovangiz manzili', ru: 'Адрес вашего приложения' })} placeholder={tr({ uz: 'Ilovangiz manzili, masalan: mening-ilovam.onrender.com', ru: 'Адрес приложения, например: moyo-prilozhenie.onrender.com' })} />
    </>}
    {trek !== 'web' && <p className="fp-kulrang">{tr({ uz: <>Mobil trekda: laptopda <code className="qcode">npx expo start</code> ishlab turibdi, ilova telefonda Expo Go'da ochiq.</>, ru: <>В мобильном треке: на ноутбуке работает <code className="qcode">npx expo start</code>, приложение открыто в Expo Go на телефоне.</> })}</p>}
  </div>;
  const chapB = <div className="fp-tk-b2">
    <div className="fp-oldin">
      <span className="fp-oldin-y">{tr({ uz: 'Demo ssenariyingiz', ru: 'Ваш сценарий демо' })}</span>
      {ssenariy.length && !isMentor ? <ol className="fp-tk-ss">{ssenariy.map((t, i) => <li key={i}>{t}</li>)}</ol>
        : <p>{tr({ uz: "6-darsdagi ssenariy topilmadi — Jonli demo bo'lagingizdagi harakatni tekshiring.", ru: 'Сценарий из 6-го урока не найден — проверьте действие из части «Живое демо».' })}</p>}
    </div>
    <div className="fp-tk-g"><QTugma ikkinchi onClick={() => setPOpen(o => !o)}>{pOpen ? tr({ uz: "Gemini'ga so'rov namunasi ▴", ru: 'Образец запроса к Gemini ▴' }) : tr({ uz: "Gemini'ga so'rov namunasi ▾", ru: 'Образец запроса к Gemini ▾' })}</QTugma></div>
    {pOpen && <div className="fp-tk-pr fade-step">
      <p>{tr(TK_PROMPT)}</p>
      <QTugma ikkinchi onClick={copy}>{copied ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</QTugma>
    </div>}
  </div>;
  const ong = <div className="fp-tk-on">
    <span className="fp-oldin-y">{tr({ uz: 'Uch tekshiruv', ru: 'Три проверки' })} · {doneN}/3</span>
    {TK_CHECKS.map((c, i) => {
      const v = holat[c.k]; const ok = yechildi(c.k);
      if (!isMentor && i > joriyI && joriyI >= 0) return null; // 213.1: navbati kelmagani ko'rsatilmaydi
      if (ok) return <div key={c.k} className="fp-tk-q ok yig"><span className="fp-tk-n">✓</span><span className="fp-tk-t">{tr(c.t)}</span><em>{v === 'fixed' ? tr({ uz: "to'g'rilandi", ru: 'исправлено' }) : tr({ uz: 'joyida', ru: 'в порядке' })}</em></div>;
      return (
        <div key={c.k} className={cxx('fp-tk-q', v === 'bad' && 'bad', 'fade-step')}>
          <p className="fp-tk-sv"><span className="fp-tk-n">{i + 1}</span><span className="fp-tk-t">{tr(c.t)}</span></p>
          <p className="fp-kulrang">{tr(c.iz)}</p>
          {!v && <div className="fp-tk-b"><QChip disabled={isMentor} onClick={() => set(c.k, 'ok')}>{tr({ uz: '✓ Joyida', ru: '✓ В порядке' })}</QChip><QChip disabled={isMentor} onClick={() => set(c.k, 'bad')}>{tr({ uz: '✗ Kamchilik bor', ru: '✗ Есть недочёт' })}</QChip></div>}
          {v === 'bad' && <>
            <p className="fp-kulrang">{tr({ uz: "VS Code'da to'g'rilang, push qiling — Render yangilaydi. Keyin telefonda qayta tekshiring.", ru: 'Исправьте в VS Code, сделайте push — Render обновит. Потом проверьте на телефоне ещё раз.' })}</p>
            {bYol && <p className="fp-kulrang">{tr({ uz: "Darsda ulgurmasangiz — B-yo'lingiz:", ru: 'Если на уроке не успеете — ваш путь Б:' })} <b>{bYol}</b></p>}
            <div className="fp-tk-b"><QChip holat="ok" onClick={() => set(c.k, 'fixed')}>{tr({ uz: "✓ To'g'rilandi", ru: '✓ Исправлено' })}</QChip></div>
          </>}
        </div>
      );
    })}
    {done && !isMentor && <QXulosa>{tr({ uz: "Ilova sahnaga tayyor: ochiladi, ssenariy oxirigacha ishlaydi, savol-javob ekrani bor.", ru: 'Приложение готово к сцене: открывается, сценарий работает до конца, экран для вопросов есть.' })}</QXulosa>}
    {isMentor && <p className="fp-kulrang">{tr({ uz: "≈ 8 daqiqa. Render uyg'onishi 1–2 daqiqa — o'quvchi kutsin. Kamchilik darsda tuzatilmasa — uyga vazifa: Demo Day'gacha push; sahnada B-yo'l (ekran videosi) tayyor turadi.", ru: '≈ 8 минут. Пробуждение Render — 1–2 минуты, пусть ученик подождёт. Если недочёт не исправлен на уроке — домашнее задание: push до Демо-дня; на сцене наготове путь Б (видео экрана).' })}</p>}
    <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: 'Ilovasini tekshirganlar', ru: 'Проверили своё приложение' }} />
  </div>;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · ilova tekshiruvi', ru: 'Практика · проверка приложения' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Tekshiring (${doneN}/3)`, ru: `Проверьте (${doneN}/3)` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Demo Day'da ochiladigan <A>mahsulotingizda</A> kamchilik bormi?</>, ru: <>Есть ли недочёты в <A>продукте</A>, который откроется на Демо-дне?</> })}
        mentor={<Mentor>{tr(mentorT)}</Mentor>}
        qadamlar={<div className="fp-tk">{chapA}{ong}{chapB}</div>}
        forma={null}
      />
    </Stage>
  );
};

"""
rep("// ===== 🏅 BADGES (nishonlar, 4", TK + "// ===== 🏅 BADGES (nishonlar, 4", 'ScreenTekshir joyi')

rep("""  { t: { uz: 'Uch savolga bir daqiqadan javob berasiz', ru: 'Ответите на три вопроса по минуте' }, teg: { uz: 'hakam savoli', ru: 'вопрос судьи' } }""",
    """  { t: { uz: "Uch savolga bir daqiqadan javob berasiz, keyin ilovangizni sahnaga tekshirasiz", ru: 'Ответите на три вопроса по минуте, потом проверите приложение перед сценой' }, teg: { uz: 'hakam savoli · ilova', ru: 'вопрос судьи · приложение' } }""", 'REJA')
rep("""  { uz: "Javobni bilmasangiz, «tekshirib aytaman» deysiz — son o'ylab topilmaydi.",""", """  { uz: "Demo Day oldidan ilova telefonda tekshiriladi: ochiladi, ssenariy ishlaydi, savol-javob ekrani bor.", ru: 'Перед Демо-днём приложение проверяют на телефоне: открывается, сценарий работает, экран для вопросов есть.' },
  { uz: "Javobni bilmasangiz, «tekshirib aytaman» deysiz — son o'ylab topilmaydi.",""", 'RECAP')

rep("""  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });""",
"""  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));""", 'root nav')
s = re.sub(r"\n  // 🃏 Flashcard[^\n]*", "", s)
rep("const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenPodium, ScreenFlashcards, SummaryScreen];",
    "const screens = [Screen0, Screen1, Screen2, Screen3, Screen5, Screen6, Screen7, Screen8, ScreenTekshir, ScreenPodium, SummaryScreen];")

rep("        p.fp-kulrang { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }\n", """        p.fp-kulrang { margin: 0; font-size: 13px; line-height: 1.45; color: ${T.ink2}; }
        /* Mahsulot tekshiruvi (F-1018-15; 213.1 bittadan, 213.3 qatorlar fon bilan) */
        .fp-tk { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.2fr); grid-template-areas: 'a o' 'b o'; grid-template-rows: auto 1fr; gap: 12px 16px; align-items: start; width: 100%; }
        .fp-tk-a, .fp-tk-b2, .fp-tk-on { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .fp-tk-a { grid-area: a; } .fp-tk-on { grid-area: o; } .fp-tk-b2 { grid-area: b; }
        .fp-tk-och { display: inline-flex; align-items: center; justify-content: center; align-self: flex-start; padding: 10px 18px; border-radius: 12px; background: ${T.accent}; color: #fff; font-weight: 700; text-decoration: none; font-size: 14px; }
        input.fp-tk-inp { width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink}; font-family: inherit; font-size: 14px; }
        input.fp-tk-inp:focus { outline: none; border-color: ${T.accent}; }
        .fp-tk-ss { margin: 0; padding-left: 0; list-style-position: inside; display: flex; flex-direction: column; gap: 3px; font-size: 13px; line-height: 1.45; color: ${T.ink}; }
        .fp-tk-g, .fp-tk-b { display: flex; flex-wrap: wrap; gap: 8px; }
        .fp-tk-pr { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 12px; background: ${T.bg}; font-size: 13px; line-height: 1.45; }
        .fp-tk-pr p { margin: 0; }
        .fp-tk-q { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; }
        .fp-tk-q.bad { background: ${fon(T.err, 0.08)}; }
        .fp-tk-q.yig { flex-direction: row; align-items: center; gap: 10px; padding: 8px 12px; background: ${T.okFon}; }
        .fp-tk-q.yig em { margin-left: auto; font-style: normal; font-size: 12px; font-weight: 700; color: ${T.ok}; white-space: nowrap; }
        .fp-tk-sv { display: flex; gap: 10px; align-items: flex-start; margin: 0; }
        .fp-tk-n { flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: ${fon(T.accent, 0.14)}; color: ${T.accent}; font-size: 12px; font-weight: 800; }
        .fp-tk-q.yig .fp-tk-n { background: ${T.ok}; color: #fff; }
        .fp-tk-t { font-size: 14px; font-weight: 600; line-height: 1.4; color: ${T.ink}; }
        .fp-tk-q.yig .fp-tk-t { font-weight: 500; font-size: 13px; }
        @media (max-width: 760px) { .fp-tk { grid-template-columns: 1fr; grid-template-areas: 'a' 'o' 'b'; grid-template-rows: none; } }
""", 'css tk')

# ---- o'lik CSS (keyframes olib tashlanmaydi — F-1018-10)
def dead_classes(src):
    css = src[src.index('<style>{`'):src.index('`}</style>')]
    jsx = src[:src.index('<style>{`')] + src[src.index('`}</style>'):]
    cls = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", css))
    return {c for c in cls if not re.search(r"['\"` ]" + re.escape(c) + r"['\"` -]|className=\{`[^`]*\b" + re.escape(c) + r"\b|cxx?\([^)]*['\"]" + re.escape(c) + r"['\"]", jsx)}
d0 = dead_classes(open(SRC, encoding='utf8').read()); DEAD = dead_classes(s) - d0
ca = s.index('<style>{`'); cb = s.index('`}</style>')
lines = s[ca:cb].split('\n'); out = []; i = 0; removed = 0
while i < len(lines):
    L = lines[i]; st = L.strip(); sel = st.split('{')[0] if '{' in st else ''
    classes = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", sel)) if re.match(r"^(?:[a-z]+)?\.", sel) else set()
    if classes and classes <= DEAD:
        depth = st.count('{') - st.count('}'); removed += 1; i += 1
        while depth > 0 and i < len(lines): depth += lines[i].count('{') - lines[i].count('}'); removed += 1; i += 1
        continue
    out.append(L); i += 1
css = '\n'.join(out)
out2 = []; audit = []
for L in css.split('\n'):
    st = L.strip(); groups = [g.split('{')[0].strip() for g in re.split(r"\}", st) if '{' in g]
    if groups and st.count('{') == st.count('}') and all(',' not in g and (set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", g)) & DEAD) for g in groups):
        removed += 1; audit.append(st[:90]); continue
    out2.append(L)
css = '\n'.join(out2)
if audit: print("  2-o'tish satrlari:"); [print('    ', a) for a in audit]
css = re.sub(r"\n[ \t]*/\* === 🃏 FLASHCARDS[^\n]*", "", css)
for pat in [r"\n[ \t]*\.fp-flash \.fc-front \{[^\n]*", r"\n[ \t]*\.fp-flash \.fc-back \{[^\n]*"]:
    css, c = re.subn(pat, "", css); removed += c
css = css.replace(", .fp-flash .fc-front", "")
s = s[:ca] + css + s[cb:]
print(f"  o'lik CSS: {len(DEAD)} klass, {removed} qator; qolgan: {sorted(dead_classes(s) - d0)}")
open(DST, 'w', encoding='utf8').write(s)
print('✅ yozildi', DST, s.count('\n') + 1, 'qator')
