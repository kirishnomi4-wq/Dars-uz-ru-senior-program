# F-1018-01 · m1-12 PmLesson3 18 → 9 ekran. Zaxiradan quradi: python3 f1018.py
# Manba: arxiv/F-1018-01-oldin/PmLesson3.jsx → src/1-Modull/PmLesson3.jsx
import re, sys
R = '/home/kali/Desktop/internetLesson'
SRC = f'{R}/arxiv/F-1018-01-oldin/PmLesson3.jsx'
DST = f'{R}/src/1-Modull/PmLesson3.jsx'
s = open(SRC, encoding='utf8').read()

def rep(old, new, n=1, flags=0, label=''):
    global s
    c = len(re.findall(re.escape(old), s)) if not flags else len(re.findall(old, s, flags))
    if c != n:
        print(f'❌ {label or old[:60]!r}: topildi {c}, kutildi {n}'); sys.exit(1)
    s = s.replace(old, new) if not flags else re.sub(old, new, s, flags=flags)

def cut(start_marker, end_marker, label):
    """start_marker dan end_marker gacha (end kirmaydi) kesib oladi, kesilgan matnni qaytaradi."""
    global s
    a = s.find(start_marker); b = s.find(end_marker, a + 1)
    if a < 0 or b < 0 or b <= a:
        print(f'❌ cut {label}: a={a} b={b}'); sys.exit(1)
    out = s[a:b]; s = s[:a] + s[b:]
    print(f'  kesildi {label}: {out.count(chr(10))} qator')
    return out

# ---------- 1. meta ----------
rep("lessonId: 'pm-pitch-03-v19'", "lessonId: 'pm-pitch-03-v20'")
rep("PLATFORM STANDARD v19", "PLATFORM STANDARD v20 (F-1018-01: 18 → 9 ekran — nutq 2 ekranda yoziladi, 2 marta gapiriladi)")

old_meta = s[s.index('const SCREEN_META = ['):s.index('const TOTAL_SCREENS')]
new_meta = """const SCREEN_META = [
  { id: 's0', type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1', type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2', type: 'exploration', template: 'custom',   scored: false, scope: null },   // nutq varag'i 1: muammo + birinchi savol
  { id: 's3', type: 'exploration', template: 'custom',   scored: false, scope: null },   // nutq varag'i 2: yechim + jonli demo
  { id: 's4', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's5', type: 'test',        template: 'custom',   scored: true,  scope: 'final' }, // repetitsiya 1 — o'zi
  { id: 's6', type: 'case',        template: 'custom',   scored: false, scope: null },   // repetitsiya 2 — juftlikda
  { id: 's7', type: 'practice',    template: 'custom',   scored: false, scope: null },   // amaliyot: Demo Day saytida kamchilik bormi? (F-1018-02)
  { id: 's8', type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 's9', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
"""
s = s.replace(old_meta, new_meta)

rep("  nextlvl:  { icon: '🚀', name: 'Next Level!',     desc: { uz: 'JavaScript nima qo\\'shishini to\\'g\\'ri topdingiz', ru: 'Вы верно нашли, что добавляет JavaScript' } },",
    "  answers:  { icon: '🙋', name: 'Answer Ready!',   desc: { uz: 'Ota-onangiz savollariga javob berdingiz', ru: 'Вы ответили на вопросы родителей' } },")
rep("// FAQAT ma'noli ekranlar: s3/s7/s10 (scored testlar), s13 (yakuniy repetitsiya).\nconst ACH_TRIGGERS = { s3: 'finder', s7: 'demoman', s10: 'nextlvl', s13: 'stage' };",
    "// FAQAT ma'noli ekranlar: s2 (muammo gapi yig'ildi), s4 (test), s5 (repetitsiya), s6 (juftlikda javob berdi).\nconst ACH_TRIGGERS = { s2: 'finder', s4: 'demoman', s5: 'stage', s6: 'answers' };")

# ---------- 2. RECAPS: faqat 7 → 4 ----------
a = s.index('const RECAPS = {'); b = s.index('\n};', a) + 3
rec = s[a:b]
m = re.search(r"\n  7: \{.*?\n  \},", rec, re.S)
if not m: print('❌ RECAPS 7'); sys.exit(1)
s = s[:a] + 'const RECAPS = {' + m.group(0).replace('\n  7: {', '\n  4: {') + '\n};' + s[b:]
print('  RECAPS → {4}')

rep("""const Q_LABELS = {
  3: { uz: 'Sayt nima uchun kerak', ru: 'Зачем нужен сайт' },
  7: { uz: "Demoda nima ko'rsatiladi", ru: 'Что показывают в демо' },
  10: { uz: 'JavaScript nima qiladi', ru: 'Что делает JavaScript' },
  13: { uz: '3 daqiqalik nutq (yakuniy)', ru: 'Трёхминутная речь (итог)' }
};""", """const Q_LABELS = {
  4: { uz: "Demoda nima ko'rsatiladi", ru: 'Что показывают в демо' },
  5: { uz: '3 daqiqalik nutq (yakuniy)', ru: 'Трёхминутная речь (итог)' }
};""")
rep("const INLINE_KEYS = { s3: 1, s7: 2, s10: 2, s13: -1 };", "const INLINE_KEYS = { s4: 2, s5: -1 };")

# ---------- 3. Screen1: reja matni ----------
rep("Bu uch daqiqa oltita bo'lakka bo'linadi va eng kattasi — jonli demo. Bugun shu oltita bo'lakni birma-bir to'ldiramiz.`",
    "Bu uch daqiqa oltita bo'lakka bo'linadi va eng kattasi — jonli demo. Bugun nutqni ikki ekranda yozasiz, keyin ikki marta ovoz chiqarib aytasiz.`")
rep("""    { text: { uz: 'Saytingiz qanday qiyinchilikni yengillashtirishini aniqlaysiz', ru: 'Определите, какую трудность облегчает ваш сайт' }, tag: '' },
    { text: { uz: 'Har bo\\'lakni o\\'z so\\'zingiz bilan yozasiz', ru: 'Каждую часть напишете своими словами' }, tag: '' },
    { text: { uz: 'Ota-onangiz beradigan savollarga javob tayyorlaysiz', ru: 'Подготовите ответы на вопросы родителей' }, tag: '' },
    { text: { uz: 'Ovoz chiqarib repetitsiya qilasiz — sahna-taymeri bilan', ru: 'Отрепетируете вслух — со сценическим таймером' }, tag: '' }""",
"""    { text: { uz: 'Saytingiz kimning ishini yengillashtirishini aniqlaysiz', ru: 'Определите, чью работу облегчает ваш сайт' }, tag: '' },
    { text: { uz: 'Nutqni ikki ekranda o\\'z so\\'zingiz bilan yozasiz', ru: 'Напишете речь своими словами на двух экранах' }, tag: '' },
    { text: { uz: 'Ovoz chiqarib aytasiz — sahna-taymeri bilan', ru: 'Произнесёте вслух — со сценическим таймером' }, tag: '' },
    { text: { uz: 'Sherigingiz bilan savol-javob qilasiz', ru: 'Потренируете вопросы и ответы с напарником' }, tag: '' }""")
rep("Bu vaqt oltita bo'lakka bo'linadi, eng kattasi — <b style={{ color: T.ink }}>jonli demo</b>.</>, ru: <>",
    "Bu vaqt oltita bo'lakka bo'linadi, eng kattasi — <b style={{ color: T.ink }}>jonli demo</b>. Bugun nutqni ikki ekranda yozasiz, keyin ikki marta ovoz chiqarib aytasiz: avval o'zingiz, keyin sherigingiz bilan.</>, ru: <>")
# ru Mentor s1: «живое демо</b>.</>» dan keyin qo'shimcha
i = s.index("Bugun nutqni ikki ekranda yozasiz, keyin ikki marta ovoz chiqarib aytasiz: avval o'zingiz")
j = s.index("</b>.</>", i)  # ru qismidagi birinchi «демо</b>.</>»
s = s[:j] + "</b>. Сегодня вы напишете речь на двух экранах, потом дважды произнесёте её вслух: сначала сами, затем с напарником.</>" + s[j + len("</b>.</>"):]

# ---------- 4. Screen2: + birinchi savol (ilgak), mikrofon yo'q ----------
rep("Ko'pchilik buni birinchi marta shu yerda o'ylaydi. Avval sayt turingizni tanlang, so'ng savollarga birma-bir javob bering.`",
    "Avval sayt turingizni tanlang, uch savolga javob bering — bitta gap yig'iladi. Keyin zalga beradigan birinchi savolingizni yozasiz.`")
rep("""  const done = !!(kind && answered === QS.length);
  const workRef = useRef(null);
  useEffect(() => {
    if (!done) return;
    patch({ kind, who, pain, help, muammo: tr({ uz: `${cap(who)} ${pain}. Mening saytim ${help}.`, ru: `${cap(who)} ${pain}. Мой сайт ${help}.` }) });
    if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true });
  }, [done, who, pain, help, kind]); // eslint-disable-line""",
"""  const base = !!(kind && answered === QS.length);            // gap yig'ildi
  const [ilgak, setIlgak] = useState(d.ilgak || '');          // F-1018-01: birinchi savol shu ekranda (eski s4)
  const ilgakOk = ilgak.trim().length >= 3;
  const done = base && ilgakOk;
  const workRef = useRef(null);
  useEffect(() => {
    if (!base) return;
    patch({ kind, who, pain, help, muammo: tr({ uz: `${cap(who)} ${pain}. Mening saytim ${help}.`, ru: `${cap(who)} ${pain}. Мой сайт ${help}.` }), ...(ilgakOk ? { ilgak } : {}) });
    if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true });
  }, [base, done, who, pain, help, kind, ilgak]); // eslint-disable-line""")
rep("(kind ? { uz: `Javob bering (${answered}/3)`, ru: `Ответьте (${answered}/3)` }",
    "(kind ? { uz: `Javob bering (${answered + (ilgakOk ? 1 : 0)}/4)`, ru: `Ответьте (${answered + (ilgakOk ? 1 : 0)}/4)` }")
rep("""Sayt tayyor — lekin u kimga kerakligini aytish qiyin. Uchta savolga javob bersangiz, javoblaringizdan bitta gap yig'iladi. Avval qanday sayt qilganingizni tanlang.", ru: 'Сайт готов — но сказать, кому он нужен, трудно. Ответите на три вопроса — из ваших ответов соберётся одна фраза. Сначала выберите, какой сайт вы сделали.'""",
    """Sayt tayyor — lekin u kimga kerakligini aytish qiyin. Sayt turini tanlang, uch savolga javob bering — bitta gap yig'iladi. Keyin zalga beradigan birinchi savolingizni yozasiz.", ru: 'Сайт готов — но сказать, кому он нужен, трудно. Выберите тип сайта, ответьте на три вопроса — соберётся одна фраза. Потом напишете первый вопрос залу.'""")
rep("""          {done && (
            <div className="frame-success fade-step">""", """          {base && (
            <div className="frame-success fade-step">""")
rep("""Mana shu gap — nutqingizning muammo bo'lagi. U keyingi ekranda joyiga tushadi.", ru: 'Вот эта фраза — часть «Проблема» вашей речи. На следующем экране она встанет на своё место.' })}</p>
            </div>
          )}""", """Mana shu gap — nutqingizning muammo bo'lagi. Endi zalga beradigan birinchi savolingizni yozing: masalan, «Kerakli kitobni qidirib, do'konma-do'kon yurganmisiz?»", ru: 'Вот эта фраза — часть «Проблема» вашей речи. Теперь напишите первый вопрос залу: например, «Вы ходили из магазина в магазин в поисках нужной книги?»' })}</p>
            </div>
          )}
          {base && (
            <div className="fld fade-step">
              <div className="fld-row"><span className="fld-ic" style={{ color: BMAP.ilgak.color }}>{BMAP.ilgak.ic}</span><textarea value={ilgak} onChange={e => setIlgak(e.target.value)} aria-label={tr({ uz: "1-bo'lak. Birinchi savol: zalga qanday savol berasiz?", ru: 'Часть 1. Первый вопрос: что вы спросите у зала?' })} placeholder={tr({ uz: 'Birinchi savol: zalga qanday savol berasiz?', ru: 'Первый вопрос: что вы спросите у зала?' })} rows={2} className="fld-ta" /><span className="fld-sec mono">0:20</span></div>
            </div>
          )}""")

# ---------- 5. s3 (test1) + s4 kesiladi ----------
cut("// ===== SCREEN 3 — TEST 1 =====", "// ===== SCREEN 5 — 3-BO'LAK", "s3+s4")

# ---------- 6. s5 + s6 → ScreenYechimDemo ----------
s56 = cut("// ===== SCREEN 5 — 3-BO'LAK", "// ===== SCREEN 7 — TEST 2", "s5+s6")
demo_steps = re.search(r"const DEMO_STEPS = \[.*?\n\];\n", s56, re.S).group(0)
one_strip = re.search(r"        <div className=\"one-strip fade-up delay-1\">.*?\n        </div>\n", s56, re.S).group(0)
fld_yechim = re.search(r"        <div className=\"fld fade-up delay-2\">.*?\n        </div>\n", s56, re.S).group(0)
dstep = re.search(r"        <div className=\"dstep-list\">.*?\n        </div>\n", s56, re.S).group(0)
s6link = re.search(r"          <div className=\"s6-link fade-step\">.*?\n          </div>\n", s56, re.S).group(0)
ind = lambda t, n: '\n'.join((' ' * n + l if l.strip() else l) for l in t.rstrip('\n').split('\n')) + '\n'
new_s3 = "// ===== SCREEN 3 — NUTQ VARAG'I 2: YECHIM + JONLI DEMO (F-1018-01: eski s5 + s6 bitta ekranda) =====\n" + demo_steps + """// «Qanday qildim» va «Keyingi qadam» so'ralmaydi — tayyor gap bilan nutqqa tushadi (repetitsiyada tahrirlanadi).
const QILDIM_DEFAULT = () => TECH_ROWS.map(r => tr(r.human)).join('. ') + '.';
const KEYIN_DEFAULT = () => tr({ uz: "Keyingi modulda JavaScript o'rganaman va saytimga harakat qo'shaman.", ru: 'В следующем модуле выучу JavaScript и добавлю на сайт действия.' });
const ScreenYechimDemo = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's3', text: `Chapda yechim: saytingiz nima qilishini bitta jumlada yozing. O'ngda jonli demo, nutqning eng uzun qismi: uch qadamni bosib oching.`, trigger: 'on_mount', waits_for: null }]);
  const [d, patch] = usePitch3();
  const K = d.kind ? KIND_MAP[d.kind] : null;
  const [yechim, setYechim] = useState(d.yechim || '');
  const [ex, setEx] = useState(null);
  const [open, setOpen] = useState(new Set());
  const [link, setLink] = useState(d.link || '');
  const yOk = yechim.trim().length >= 3;
  const dOk = open.size >= DEMO_STEPS.length;
  const done = yOk && dOk;
  const exHint = useTurnHint(!ex && !yOk);                   // 🔔 avval namunani ko'ring
  const stepLit = useTurnWalk(yOk ? DEMO_STEPS.filter(x => !open.has(x.key)).map(x => x.key) : []); // 🔔 keyin qadamlar
  const tap = (k) => setOpen(p => { const n = new Set(p); n.add(k); return n; });
  const workRef = useRef(null);
  useEffect(() => { if (yOk) patch({ yechim }); }, [yechim, yOk]); // eslint-disable-line
  useEffect(() => {
    if (!done) return;
    patch({ demo: tr({ uz: 'Saytimni ochaman, asosiy qismini ko\\'rsataman va nima qilish mumkinligini aytaman.', ru: 'Открываю свой сайт, показываю главную часть и рассказываю, что тут можно сделать.' }), qildim: d.qildim || QILDIM_DEFAULT(), keyin: d.keyin || KEYIN_DEFAULT() });
    if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true });
  }, [done]); // eslint-disable-line
  const saveLink = (v) => { setLink(v); patch({ link: v.trim() }); };
  return (
    <Stage eyebrow={tr({ uz: 'Yechim va jonli demo', ru: 'Решение и живое демо' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : (!yOk ? { uz: 'Bitta jumla yozing', ru: 'Напишите одну фразу' } : { uz: `Qadamlarni oching (${open.size}/3)`, ru: `Откройте шаги (${open.size}/3)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Saytingiz <span className="italic" style={{ color: T.accent }}>nima qiladi</span> va uni qanday ko'rsatasiz?</>, ru: <><span className="italic" style={{ color: T.accent }}>Что делает</span> ваш сайт и как вы его покажете?</> })}</h2></div>
        <Mentor>{tr({ uz: "Chapda — yechim: saytingiz nima qilishini bitta jumlada yozing, tanish ilovalar namunasini bosib ko'ring. O'ngda — jonli demo, nutqning eng uzun qismi: uch qadamni bosib oching, sahnada adashmaysiz.", ru: 'Слева — решение: напишите одной фразой, что делает ваш сайт, посмотрите примеры знакомых приложений. Справа — живое демо, самая длинная часть речи: откройте три шага, на сцене не растеряетесь.' })}</Mentor>
        <MentorCollapseScroll targetRef={workRef} />
        <div className="split" ref={workRef}>
          <Col>
            <p className="flow-label">{tr({ uz: 'Yechim — bitta jumla', ru: 'Решение — одна фраза' })}</p>
""" + ind(one_strip, 4) + "            {ex && <p className=\"one-line fade-step\" key={ex}>«{tr(ONE_LINERS[ex].line)}»</p>}\n" + ind(fld_yechim, 4) + """          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Jonli demo — 3 qadam', ru: 'Живое демо — 3 шага' })}</p>
""" + ind(dstep, 4) + "            {dOk && (\n" + ind(s6link, 4) + """            )}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

"""
# TECH_ROWS s8 dan oldin turadi — uni ScreenYechimDemo dan OLDIN joylash kerak; s8 blokini kesganda TECH_ROWS ni olib qolamiz
s89 = cut("// ===== SCREEN 8 — 5-BO'LAK: QANDAY QILDIM =====", "// ===== SCREEN 11 — OTA-ONA SAVOLLARI =====", "s8+s9+s10")
tech_rows = re.search(r"const TECH_ROWS = \[.*?\n\];\n", s89, re.S).group(0)
k = s.index("// ===== SCREEN 7 — TEST 2")
s = s[:k] + tech_rows + new_s3 + s[k:]

# ---------- 7. s11 + koding → ScreenJuftlik ----------
cut("// ===== SCREEN 11 — OTA-ONA SAVOLLARI =====", "// ===== SCREEN 13 — 🎤 REPETITSIYA", "s11+koding")
new_s6 = """// ===== SCREEN 6 — REPETITSIYA 2: JUFTLIKDA (F-1018-01: eski s11 testi → og'zaki mashq; sherik — zaldagi ota-ona) =====
const QA_CARDS = [
  { q: { uz: "Buni rostdan o'zing qildingmi?", ru: 'Ты правда сделал это сам?' },
    good: { uz: "Mentor o'rgatdi, saytni o'zim qildim.", ru: 'Ментор научил, а сайт я сделал сам.' },
    trap: { uz: "«Hech kim yordam bermadi» — halol emas. O'rganganingizni aytish kuchsizlik emas.", ru: '«Мне никто не помогал» — нечестно. Сказать, что вы учились, — не слабость.' } },
  { q: { uz: 'Bunga qancha vaqt ketdi?', ru: 'Сколько времени на это ушло?' },
    good: { uz: "Bir necha kun — har darsda o'rganganimni saytimga qo'shdim.", ru: 'Несколько дней — на каждом уроке добавлял выученное в свой сайт.' },
    trap: { uz: '«Besh daqiqada» — mehnatingizni arzonlashtiradi.', ru: '«За пять минут» — обесценивает ваш труд.' } },
  { q: { uz: 'Bu kimga kerak?', ru: 'А кому это нужно?' },
    good: null, // o'quvchining 3-ekranda yig'ilgan o'z gapi
    trap: { uz: '«Hammaga kerak» — mavhum. Aynan kim ishlatishini ayting.', ru: '«Всем нужно» — расплывчато. Скажите, кто именно будет пользоваться.' } }
];
const ScreenJuftlik = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's6', text: `Nutq tugagach savollar boshlanadi, ular har yili bir xil. Sherigingiz uchta savolni ovoz chiqarib o'qiydi, siz javob berasiz. Keyin o'rin almashasiz.`, trigger: 'on_mount', waits_for: null }]);
  const [d] = usePitch3();
  const [said, setSaid] = useState(() => new Set(storedAnswer ? QA_CARDS.map((_, i) => String(i)) : []));
  const [tip, setTip] = useState(null);
  const done = said.size === QA_CARDS.length;
  const cardLit = useTurnWalk(QA_CARDS.map((_, i) => String(i)).filter(i => !said.has(i))); // 🔔 navbatdagi karta
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [done]); // eslint-disable-line
  const mark = (k) => setSaid(p => { const n = new Set(p); n.add(k); return n; });
  return (
    <Stage eyebrow={tr({ uz: 'Repetitsiya · juftlikda', ru: 'Репетиция · в паре' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Javob bering (${said.size}/3)`, ru: `Ответьте (${said.size}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sherigingiz — zaldagi <span className="italic" style={{ color: T.accent }}>ota-ona</span>. U so'raydi, siz javob berasiz.</>, ru: <>Ваш напарник — <span className="italic" style={{ color: T.accent }}>родитель</span> в зале. Он спрашивает, вы отвечаете.</> })}</h2></div>
        <Mentor>{tr({ uz: "Nutq tugagach savollar boshlanadi — ular har yili bir xil. Sherigingiz uchta savolni ovoz chiqarib o'qiydi, siz javob berasiz. Qiynalsangiz — «Maslahat»ni oching. Keyin o'rin almashasiz.", ru: 'После речи начинаются вопросы — каждый год одни и те же. Напарник читает три вопроса вслух, вы отвечаете. Трудно — откройте «Подсказку». Потом поменяйтесь.' })}</Mentor>
        <div className="qa-grid">
          {QA_CARDS.map((c, i) => {
            const k = String(i); const ok = said.has(k);
            const good = c.good ? tr(c.good) : (d.muammo || tr({ uz: "3-ekranda yig'ilgan o'z gapingiz", ru: 'Ваша фраза, собранная на 3-м экране' }));
            return (
              <div key={i} className={`qa-card ${ok ? 'ok' : ''}${turnCls(cardLit, k, true)}`}>
                <p className="qa-q"><span className="qa-n">{i + 1}</span>{tr(c.q)}</p>
                <button className="qa-tip-btn" onClick={() => setTip(tip === k ? null : k)}>{tip === k ? tr({ uz: 'Maslahat ▴', ru: 'Подсказка ▴' }) : tr({ uz: 'Maslahat ▾', ru: 'Подсказка ▾' })}</button>
                {tip === k && (
                  <div className="qa-tip fade-step">
                    <p><b style={{ color: T.success }}>{tr({ uz: 'Kuchli javob:', ru: 'Сильный ответ:' })}</b> {good}</p>
                    <p><b style={{ color: T.accent }}>{tr({ uz: 'Tuzoq:', ru: 'Ловушка:' })}</b> {tr(c.trap)}</p>
                  </div>
                )}
                {ok ? <p className="qa-ok">{tr({ uz: '✓ Javob berdingiz', ru: '✓ Ответ дан' })}</p> : <button className="btn-soft qa-said" onClick={() => mark(k)}>{tr({ uz: '✓ Javob berdim', ru: '✓ Я ответил(а)' })}</button>}
              </div>
            );
          })}
        </div>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Endi o'rin almashing: siz so'raysiz, sherigingiz javob beradi.", ru: 'Теперь поменяйтесь: вы спрашиваете, напарник отвечает.' })}</p></div>}
      </div>
    </Stage>
  );
};

"""
# Juftlik ekrani Screen13 dan KEYIN turadi (tartib: ... Screen13 → ScreenJuftlik → Podium)
k = s.index("// 💻 Uyga-vazifa kapsulasi fonida suzuvchi xira so'z-tokenlar")
s = s[:k] + new_s6 + s[k:]

# ---------- 8. Screen13: tugma + mentor ----------
a = s.index("// ===== SCREEN 13 — 🎤 REPETITSIYA"); b = s.index("// ===== SCREEN 6 — REPETITSIYA 2", a)
blk = s[a:b]
m = re.search(r"<NavNext disabled=\{isMentorLive \? false : !passed\} label=\{.*?\} onClick=\{onNext\} />", blk, re.S)
if not m: print('❌ Screen13 NavNext'); sys.exit(1)
print('  Screen13 eski NavNext:', m.group(0)[:220])
blk = blk.replace(m.group(0), "<NavNext disabled={isMentorLive ? false : !passed} label={passed ? { uz: 'Sherik bilan mashqqa →', ru: 'К парной тренировке →' } : { uz: `To'ldiring (${filled}/6)`, ru: `Заполните (${filled}/6)` }} onClick={onNext} />")
blk = blk.replace("""Nutqingiz yig'ildi. Uni bir marta o'qib chiqing, so'ng taymerni bosing — mikrofon yozib oladi.", ru: 'Ваша речь собрана. Прочитайте её один раз, потом нажми""",
                  """Nutqingiz yig'ildi — 6 bo'lak. «Qanday qildim» qatori ota-ona tilida: sahnada «HTML», «CSS» demang. Bir marta o'qing, taymerni bosing — mikrofon yozib oladi.", ru: 'Ваша речь собрана — 6 частей. Строка «Как я это сделал» написана на языке родителей: на сцене не говорите «HTML», «CSS». Прочитайте один раз, нажми""")
if "ota-ona tilida" not in blk: print('❌ Screen13 mentor'); sys.exit(1)
s = s[:a] + blk + s[b:]

# ---------- 9. Flashcards kesiladi (FC_* dan root'gacha), import, root ----------
a = s.index("// 🃏 FLASHCARDS — aktiv takrorlash"); b = s.index("function AchCelebrate(")
print(f'  flashcard bloki: {s[:a].count(chr(10))+1}–{s[:b].count(chr(10))} qator kesildi')
s = s[:a] + s[b:]
# StudentPracticePulse — faqat koding ekrani ishlatardi
a = s.index("const StudentPracticePulse = "); b = s.index("\nconst ", a + 1); b = s.rfind("\n\n", 0, b) + 1
print(f'  StudentPracticePulse: {s[:a].count(chr(10))+1}–{s[:b].count(chr(10))} kesildi')
s = s[:a] + s[b:]
rep("""// Kod kompilyatori — UMUMIY modul (F-0809-05). Tugma bilan ochiladigan to'liq-ekran
// oyna, shuning uchun CodeStrike brendida (PM_DARS_ETALON 1-bo'lim, palitra-istisnosi).
import HtmlCompiler, { checks as C } from '../compilator/HtmlCompiler.jsx';
""", "")
rep("""  // 🃏 Flashcard jonli darsda FAQAT MENTORGA ko'rinadi (proyektorda jamoaviy takrorlash);
  // jonli o'quvchidan yashirin — sakrab o'tiladi. Erkin qilinsa / uzilsa / self — ochiladi.
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => {
    let n = Math.min(s + 1, TOTAL_SCREENS - 1);
    if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1);
    return n;
  });
  const prev = () => setScreen(s => {
    let n = Math.max(s - 1, 0);
    if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0);
    return n;
  });""", """  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));""")
rep("const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, ScreenCoding, Screen13, ScreenPodium, ScreenFlashcards, Screen14];",
    "const screens = [Screen0, Screen1, Screen2, ScreenYechimDemo, Screen7, Screen13, ScreenJuftlik, ScreenSayt, ScreenPodium, Screen14];")

# ---------- 10. QUIZ_BANK: 3 savol ----------
a = s.index("  { q: { uz: 'HTML sahifada nimani hal qiladi?'"); b = s.index("\n", s.index("  { q: { uz: \"Tugma bosilganda savatga qo'shilishi")) + 1
s = s[:a] + """  { q: { uz: 'Ota-onangiz «Bu kimga kerak?» desa, qaysi javob kuchli?', ru: 'Родители спрашивают «А кому это нужно?» — какой ответ сильный?' }, opts: [{ uz: '«Hammaga kerak, hamma ishlatadi»', ru: '«Всем нужно, все пользуются»' }, { uz: '«Bilmadim, shunchaki qildim»', ru: '«Не знаю, просто так сделал»' }, { uz: '«Mentor shunday deb aytgan edi»', ru: '«Так мне сказал ментор»' }, { uz: '«Sinfdoshlarimga: kitobni bir joydan topadi»', ru: '«Одноклассникам: книгу находят в одном месте»' }], correct: 3 },
  { q: { uz: 'Juftlik mashqida sherigingiz kim rolida?', ru: 'Кто ваш напарник в парной тренировке?' }, opts: [{ uz: "Hakam — ball qo'yadi", ru: 'Судья — ставит баллы' }, { uz: 'Mentor — xatoni tuzatadi', ru: 'Ментор — исправляет ошибки' }, { uz: 'Zaldagi ota-ona — savol beradi', ru: 'Родитель в зале — задаёт вопросы' }, { uz: "Tomoshabin — jim o'tiradi", ru: 'Зритель — молча сидит' }], correct: 2 },
  { q: { uz: 'Sahnada «HTML va CSS ishlatdim» deyish nega yetarli emas?', ru: 'Почему на сцене мало сказать «я использовал HTML и CSS»?' }, opts: [{ uz: 'Ota-onangiz bu so\\'zlardan nima qilganingizni bilmaydi', ru: 'Родители по этим словам не поймут, что вы сделали' }, { uz: "Bu yolg'on gap, bunday deyish mumkin emas", ru: 'Это неправда, так говорить нельзя' }, { uz: 'Juda uzun, vaqt yetmay qoladi', ru: 'Слишком длинно, не хватит времени' }, { uz: 'Netlify va GitHub aytilmagan', ru: 'Не названы Netlify и GitHub' }], correct: 0 },
""" + s[b:]

# ---------- 11. CSS: juftlik kartasi uchun 3 qoida (.qa-card dan keyin) ----------
i = s.index(".qa-card {")
j = s.index("\n", i) + 1
s = s[:j] + """        .qa-n { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; margin-right: 8px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 12px; vertical-align: middle; }
        .qa-tip-btn { align-self: flex-start; border: none; background: none; padding: 0; color: ${T.accent}; font-family: 'Manrope'; font-weight: 700; font-size: 13px; cursor: pointer; }
        .qa-tip { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.bg}; font-size: clamp(13px,1.6vw,14.5px); line-height: 1.45; color: ${T.ink}; }
        .qa-said { align-self: flex-start; }
""" + s[j:]

# ---------- 11b. ScreenSayt — Demo Day saytida kamchilik bormi? (F-1018-02, foydalanuvchi g'oyasi, 222-qonun 7-band) ----------
new_s7 = """// ===== SCREEN 7 — AMALIYOT: DEMO DAY SAYTIDA KAMCHILIK BORMI? (F-1018-02: juftlikdan keyin, arenadan oldin; ballsiz) =====
const SAYT_CHECKS = [
  { k: 'tepa',    t: { uz: "Tepada sayt nomi va yechim jumlangiz o'qiladi", ru: 'Сверху читаются название сайта и ваша фраза-решение' } },
  { k: 'asosiy',  t: { uz: "Demoda ko'rsatadigan asosiy qism to'liq ko'rinadi", ru: 'Главная часть, которую покажете в демо, видна полностью' } },
  { k: 'telefon', t: { uz: 'Telefonda ochganda matn chetga chiqmaydi', ru: 'На телефоне текст не выходит за край' } }
];
const SAYT_PROMPT = { uz: "Mana index.html va style.css kodim: {kod}. Muammo: {kamchilik}. Faqat o'zgartiriladigan qatorlarni ko'rsat, sababini bir gapda ayt.", ru: 'Вот мой код index.html и style.css: {код}. Проблема: {недочёт}. Покажи только строки, которые нужно изменить, и объясни причину одной фразой.' };
const ScreenSayt = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const audio = useAudio([{ id: 's7', text: `Sahnada ochiladigan sayt shu. Hozir oching, uch narsani tekshiring. Kamchilik bo'lsa VS Code da to'g'rilang va push qiling.`, trigger: 'on_mount', waits_for: null }]);
  const [d, patch] = usePitch3();
  const [link, setLink] = useState(d.link || '');
  const [st, setSt] = useState(() => (storedAnswer && storedAnswer.sayt) || {});   // k → 'ok' | 'bad' | 'fixed'
  const [pOpen, setPOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const doneN = SAYT_CHECKS.filter(c => st[c.k] === 'ok' || st[c.k] === 'fixed').length;
  const done = doneN === SAYT_CHECKS.length;
  const lit = useTurnWalk(SAYT_CHECKS.filter(c => !st[c.k]).map(c => c.k)); // 🔔 navbatdagi tekshiruv
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, sayt: st }); }, [done]); // eslint-disable-line
  const set = (k, v) => setSt(p => ({ ...p, [k]: v }));
  const saveLink = (v) => { setLink(v); patch({ link: v.trim() }); };
  const href = link.trim() ? (/^https?:\\/\\//.test(link.trim()) ? link.trim() : 'https://' + link.trim()) : '';
  const copy = async () => { try { await navigator.clipboard.writeText(tr(SAYT_PROMPT)); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch (_e) { /* clipboard ruxsati yo'q */ } };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · sayt', ru: 'Практика · сайт' })} screen={screen} audioState={audio} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done} label={done ? { uz: 'Davom etish', ru: 'Продолжить' } : { uz: `Tekshiring (${doneN}/3)`, ru: `Проверьте (${doneN}/3)` }} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Demo Day <span className="italic" style={{ color: T.accent }}>saytingizda</span> kamchilik bormi?</>, ru: <>Есть ли недочёты на вашем <span className="italic" style={{ color: T.accent }}>сайте</span> для Демо-дня?</> })}</h2></div>
        <Mentor>{tr({ uz: "Sahnada ochiladigan sayt shu. Hozir oching, uch narsani tekshiring. Kamchilik bo'lsa VS Code da to'g'rilang va push qiling — Netlify o'zi yangilaydi. Qiynalsangiz — Gemini'ga so'rov namunasi chapda.", ru: 'Это сайт, который откроется на сцене. Откройте его сейчас и проверьте три вещи. Нашли недочёт — исправьте в VS Code и сделайте push, Netlify обновит сам. Трудно — слева образец запроса к Gemini.' })}</Mentor>
        <div className="split">
          <Col>
            <p className="flow-label">{tr({ uz: 'Saytingiz', ru: 'Ваш сайт' })}</p>
            {href && <a className="btn sayt-och fade-up" href={href} target="_blank" rel="noreferrer">{tr({ uz: 'Saytni ochish ↗', ru: 'Открыть сайт ↗' })}</a>}
            <input className="fld-inp mono" value={link} onChange={e => saveLink(e.target.value)} aria-label={tr({ uz: 'Saytingiz manzili', ru: 'Адрес вашего сайта' })} placeholder={tr({ uz: 'Saytingiz manzili, masalan: mening-saytim.netlify.app', ru: 'Адрес сайта, например: moy-sayt.netlify.app' })} />
            <button className="qa-tip-btn" onClick={() => setPOpen(o => !o)}>{pOpen ? tr({ uz: "Gemini'ga so'rov namunasi ▴", ru: 'Образец запроса к Gemini ▴' }) : tr({ uz: "Gemini'ga so'rov namunasi ▾", ru: 'Образец запроса к Gemini ▾' })}</button>
            {pOpen && (
              <div className="qa-tip fade-step">
                <p className="mono" style={{ fontSize: 'clamp(12px,1.5vw,13.5px)' }}>{tr(SAYT_PROMPT)}</p>
                <button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={copy}>{copied ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button>
              </div>
            )}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Uch tekshiruv', ru: 'Три проверки' })}</p>
            {SAYT_CHECKS.map((c, i) => { const v = st[c.k]; const okk = v === 'ok' || v === 'fixed'; return (
              <div key={c.k} className={`qa-card sayt-card ${okk ? 'ok' : ''}${turnCls(lit, c.k, true)}`}>
                <p className="qa-q"><span className="qa-n">{i + 1}</span>{tr(c.t)}</p>
                {!v && <div className="sayt-btns"><button className="btn-soft" onClick={() => set(c.k, 'ok')}>{tr({ uz: '✓ Joyida', ru: '✓ В порядке' })}</button><button className="btn-soft sayt-bad" onClick={() => set(c.k, 'bad')}>{tr({ uz: '✗ Kamchilik bor', ru: '✗ Есть недочёт' })}</button></div>}
                {v === 'bad' && <div className="qa-tip fade-step"><p>{tr({ uz: "VS Code da to'g'rilang, push qiling — Netlify yangilaydi. Keyin belgilang:", ru: 'Исправьте в VS Code, сделайте push — Netlify обновит. Потом отметьте:' })}</p><button className="btn-soft" style={{ alignSelf: 'flex-start' }} onClick={() => set(c.k, 'fixed')}>{tr({ uz: "✓ To'g'riladim", ru: '✓ Исправлено' })}</button></div>}
                {v === 'ok' && <p className="qa-ok">{tr({ uz: '✓ Joyida', ru: '✓ В порядке' })}</p>}
                {v === 'fixed' && <p className="qa-ok">{tr({ uz: "✓ To'g'rilandi", ru: '✓ Исправлено' })}</p>}
              </div>
            ); })}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

"""
k = s.index("// 💻 Uyga-vazifa kapsulasi fonida suzuvchi xira so'z-tokenlar")
s = s[:k] + new_s7 + s[k:]
i = s.index(".qa-said { align-self: flex-start; }\n"); j = s.index("\n", i) + 1
s = s[:j] + """        .sayt-och { align-self: flex-start; text-decoration: none; display: inline-flex; }
        .sayt-btns { display: flex; flex-wrap: wrap; gap: 8px; }
        .sayt-bad { color: ${T.accent}; }
        .sayt-card { gap: 10px; }
""" + s[j:]

# ---------- 12. O'lik CSS: zaxirada ishlatilgan, endi JSX'da yo'q klasslar — qoidalari olinadi ----------
def dead_classes(src):
    css = src[src.index('<style>{`'):src.index('`}</style>')]
    jsx = src[:src.index('<style>{`')] + src[src.index('`}</style>'):]
    cls = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", css))
    return {c for c in cls if not re.search(r"['\"` ]" + re.escape(c) + r"['\"` -]|className=\{`[^`]*\b" + re.escape(c) + r"\b", jsx)}
d0 = dead_classes(open(SRC, encoding='utf8').read()); d1 = dead_classes(s); DEAD = d1 - d0
ca = s.index('<style>{`'); cb = s.index('`}</style>')
lines = s[ca:cb].split('\n'); out = []; i = 0; removed = 0
while i < len(lines):
    L = lines[i]; st = L.strip()
    sel = st.split('{')[0] if '{' in st else ''
    classes = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", sel)) if (st.startswith('.') or st.startswith('@media') is False and sel.startswith('.')) else set()
    if classes and classes <= DEAD and not st.startswith('@'):
        # bir qatorli yoki ko'p qatorli qoida — qavs balansi bilan oxirigacha
        depth = st.count('{') - st.count('}'); removed += 1; i += 1
        while depth > 0 and i < len(lines):
            depth += lines[i].count('{') - lines[i].count('}'); removed += 1; i += 1
        continue
    out.append(L); i += 1
css = '\n'.join(out)
# ishlatilmay qolgan @keyframes
for kf in []:  # F-1018-10: keyframes OLIB TASHLANMAYDI — qolipCss (fade-in-up) va jonli-modul darsdan tashqarida nom kutadi
    body = re.sub(r"@keyframes " + re.escape(kf) + r"\b[^{]*\{", "", css)
    if not re.search(r"\b" + re.escape(kf) + r"\b", body):
        m = re.search(r"[ \t]*@keyframes " + re.escape(kf) + r"\s*\{", css)
        j = m.end(); depth = 1
        while depth > 0: depth += (css[j] == '{') - (css[j] == '}'); j += 1
        k = j
        if css[k:k+1] == '\n': k += 1
        removed += css[m.start():k].count('\n'); css = css[:m.start()] + css[k:]
s = s[:ca] + css + s[cb:]
print(f"  o'lik CSS: {len(DEAD)} klass, {removed} qator olindi; qolgan yangi-o'lik: {sorted(dead_classes(s) - d0)}")

open(DST, 'w', encoding='utf8').write(s)
print('✅ yozildi', DST, s.count('\n') + 1, 'qator')
