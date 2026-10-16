#!/usr/bin/env python3
# F-1015-332 · PracticeLesson1 (m2-08) 19 → 9 ekran: Demo Day saytiga HAQIQIY JavaScript (VS Code + Gemini + Copilot).
# Screen15 («Oxirgi sinov», F-1016-01 mentor tuzatishi) O'ZGARISHSIZ qoladi. Kompilyator mexanizmi ildizda qoladi, lekin ishlatilmaydi.
import sys
R = sys.argv[1]
P = R + '/src/2-Modull/PracticeLesson1.jsx'
s = open(P, encoding='utf-8').read()
css = open(R + '/src/1-Modull/CssPractice.jsx', encoding='utf-8').read()
dep = open(R + '/src/1-Modull/DeployLesson.jsx', encoding='utf-8').read()

def rep(old, new):
    global s
    n = s.count(old)
    assert n == 1, f'{n}× : {old[:90]!r}'
    s = s.replace(old, new)

def cut(start, end, new):
    global s
    assert s.count(start) == 1, f'start {s.count(start)}× : {start[:80]!r}'
    assert s.count(end) == 1, f'end {s.count(end)}× : {end[:80]!r}'
    a = s.index(start); b = s.index(end); assert a < b
    s = s[:a] + new + s[b:]

def blok(src, start, end):
    assert src.count(start) == 1 and src.count(end) == 1, (start[:50], end[:50])
    a = src.index(start); b = src.index(end); assert a < b
    return src[a:b]

# ---------- 1. Sarlavha izohi ----------
rep("""// Maqsad (1-modul): bola interaktivlik NIMALIGINI his qilsin va tushunsin. AI minimal.
// Hook: chiroyli, lekin "o'lik" sayt — tugma bosiladi, hech nima bo'lmaydi.
// Ko'prik: keyingi darsda Antigravity agenti buni tez qiladi — bola TEKSHIRUVCHI.""",
"""// F-1015-332 (16.10, foydalanuvchi bilan sahifama-sahifa): 19 → 9 ekran. Endi o'quvchi O'Z Demo Day saytiga (mening-saytim, Netlify'da)
// haqiqiy JavaScript qo'shadi: tungi rejim (Gemini) · like (Copilot: izoh → Tab) · 10 like tabrik (o'zi, if) · «Oxirgi sinov» (F-1016-01, o'zgarmagan) · yana bitta vosita.
// Kompilyator mexanizmi ildizda qoladi (PRACTICE_AFTER bo'sh) — dars ichida mashq ochilmaydi. Oldingi 19 ekranli: arxiv/F-1015-practice1-oldin/.""")

# ---------- 2. SCREEN_META ----------
cut("const SCREEN_META = [", "const TOTAL_SCREENS = SCREEN_META.length;",
"""const SCREEN_META = [
  { id: 's0',  type: 'hook',     template: 'custom', scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',     template: 'custom', scored: false, scope: null },
  { id: 'a1',  type: 'practice', template: 'custom', scored: false, scope: null },
  { id: 'a2',  type: 'practice', template: 'custom', scored: false, scope: null },
  { id: 'a3',  type: 'practice', template: 'custom', scored: false, scope: null },
  { id: 's15', type: 'test',     template: 'custom', scored: true,  scope: 'final' }, // F-1016-01 «Oxirgi sinov» — yagona ballik
  { id: 'a4',  type: 'practice', template: 'custom', scored: false, scope: null },
  { id: 's15b', type: 'stats',   template: 'custom', scored: false, scope: null },
  { id: 's16', type: 'summary',  template: 'custom', scored: false, scope: null }
];
""")

# ---------- 3. Kalitlar, recap, podium, nishonlar ----------
rep("const INLINE_KEYS = { s4: 1, s7: 2, s11: 3, s15: 0 };", "const INLINE_KEYS = { s15: 0 }; // F-1015-332: MC testlar (s4, s7, s11) olindi")
cut("const RECAPS = {", "// Overlay — ekran ustida (indekslarga tegmaydi)", "const RECAPS = {}; // F-1015-332: MC testlar olindi — recap yo'q (Screen15 o'z izohini beradi)\n\n")
rep("""const Q_LABELS = { 4: { uz: "1 — Hodisa (event)", ru: '1 — Событие (event)' }, 7: "2 — son + 1", 11: { uz: "3 — Qaysi hodisa", ru: '3 — Какое событие' }, 15: { uz: "4 — Tugmani jonlantirish", ru: '4 — Оживить кнопку' } };""",
    """const Q_LABELS = { 5: { uz: 'Tugmani jonlantirish', ru: 'Оживить кнопку' } };""")
rep("""  spark:    { icon: '⚡', name: "It's Alive!", desc: { uz: "Hodisa → reaksiya mantig'ini to'g'ri angladingiz", ru: 'Вы верно поняли логику событие → реакция' } },
  coder:    { icon: '💻', name: 'Code It!',    desc: { uz: "JavaScript yozib, vositani ishga tushirdingiz", ru: "Вы написали JavaScript и запустили инструмент" } },
  logician: { icon: '🧩', name: 'Nice Logic!', desc: { uz: "Shart (if/else) savolini to'g'ri yechdingiz", ru: 'Вы верно решили вопрос про условие (if/else)' } },""",
"""  coder:    { icon: '💻', name: 'Code It!',    desc: { uz: 'Saytingizga tungi rejim qo\\'shdingiz', ru: 'Вы добавили на сайт ночной режим' } },
  logician: { icon: '🧩', name: 'Nice Logic!', desc: { uz: 'Like tugmasini Copilot bilan jonlantirdingiz', ru: 'Вы оживили кнопку лайка с Copilot' } },
  spark:    { icon: '⚡', name: "It's Alive!", desc: { uz: 'Like tugmasiga shartni o\\'zingiz yozdingiz', ru: 'Вы сами написали условие для лайка' } },""")
rep("const ACH_TRIGGERS = { s4: 'spark', s11: 'logician' };", """// F-1015-332 (pilot naqshi): nishon BLOKKA bog'lanadi — blok «Davom etish»da beriladi (bonus; isbot yo'q — ustoz ko'rib turadi)
const BLOK_ACH = { a1: 'coder', a2: 'logician', a3: 'spark' };
const ACH_TRIGGERS = {};""")
rep("""const PRACTICE_AFTER = {
  5:  { task: TASK_LIKE,   starter: '' }, // 1) Like sanagich (click → son+1)
  6:  { task: TASK_TOGGLE, starter: '' }, // 2) Tungi/kunduzgi rejim (toggle if/else)
  10: { task: TASK_FORM,   starter: '' }, // 3) Forma tekshiruvi (if/else)
};""", """const PRACTICE_AFTER = {}; // F-1015-332: dars ichidagi kompilyator mashqlari olindi — ish o'quvchining VS Code'ida""")

# ---------- 4. Reja + tushuncha/simulyatsiya/test ekranlari → amaliyot bloklari ----------
maket = blok(css, "const STYLES = [\n  { id: 'minimal', name:", "// ===== SCREEN 0 — KIRISH (QKirish)")
maket = maket.replace("// ccDemoDay — uslub va shu darsda yozilgan loyiha (css: { nom, muammo, talab }); eski muammo/yechim o'qilmaydi (F-1015-313)\n", "// ccDemoDay — CSS Praktikada saqlangan uslub; bu dars shu saytni davom ettiradi (F-1015-332)\n")
qp = blok(css, "const PromptBlok = ({ matn, tayyor }) => {", "const ScreenAmaliyot = ({ screen, onNext, onPrev }) => {")
qp = qp.replace("const Qadamlar = ({ b, uslub, cls = '' }) => (", "const Qadamlar = ({ b, cls = '' }) => (")
qp = qp.replace("{fmtCode(tr(typeof x === 'function' ? x(USLUB_ACC[uslub]) : x))}", "{fmtCode(tr(x))}")
qt = blok(dep, "// F-1015-330: a2/a3 da qadamlar bitta tugmada", "const ScreenSahifalar = ({ screen, onNext, onPrev }) => {")

NEW = r"""// ===== SCREEN 1 — REJA (F-1015-332): «Avval tayyorlaning» + 3 blok =====
const TAYYOR = [
  { uz: <>VS Code'da <span className="qcode">mening-saytim</span> papkangizni oching, <span className="qcode">index.html</span> da Go Live.</>, ru: <>Откройте в VS Code папку <span className="qcode">mening-saytim</span>, в <span className="qcode">index.html</span> — Go Live.</> },
  { uz: <>Copilot'ni o'rnating: chap paneldagi Extensions belgisi → qidiruvga «GitHub Copilot» → Install → GitHub hisobingiz bilan kiring.</>, ru: <>Установите Copilot: значок Extensions на левой панели → в поиске «GitHub Copilot» → Install → войдите через свой GitHub.</> },
  { uz: "Boshqa oynada gemini.google.com'ni oching.", ru: 'В другом окне откройте gemini.google.com.' }
];
const REJA_BLOK = [
  { t: { uz: 'Tungi rejim', ru: 'Ночной режим' }, tag: 'Gemini · if/else' },
  { t: { uz: 'Like sanagich', ru: 'Счётчик лайков' }, tag: 'Copilot · click' },
  { t: { uz: '10 like — tabrik', ru: '10 лайков — поздравление' }, tag: { uz: "o'zingiz · if", ru: 'сами · if' } }
];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz', ru: 'Начинаем' }} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun saytingizga <span className="italic" style={{ color: T.accent }}>JavaScript</span> qo'shasiz.</>, ru: <>Сегодня добавите на сайт <span className="italic" style={{ color: T.accent }}>JavaScript</span>.</> })}</h2></div>
      <Mentor>{tr({ uz: <>Bu — Netlify'ga chiqargan saytingiz. Bugun u bosishga javob beradigan bo'ladi: kodni Gemini va <b style={{ color: T.ink }}>Copilot</b> yozadi, bittasini o'zingiz yozasiz.</>, ru: <>Это сайт, который вы выложили на Netlify. Сегодня он начнёт отвечать на нажатия: код пишут Gemini и <b style={{ color: T.ink }}>Copilot</b>, одно вы напишете сами.</> })}</Mentor>
      <div className="am-tayyor fade-up delay-1">
        <p className="am-tayyor-h">{tr({ uz: 'Avval tayyorlaning', ru: 'Сначала подготовьтесь' })}</p>
        <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>{tr(x)}</span></li>)}</ol>
        <p className="am-tayyor-s">{tr({ uz: "Tayyor bo'lsa — «Boshlaymiz».", ru: 'Готово — «Начинаем».' })}</p>
      </div>
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Dars oxirida · namuna', ru: 'К концу урока · образец' })}</p>
          <JonliSayt rejim like tabrik />
        </Col>
        <Col>
          <p className="flow-label">{tr({ uz: 'Bugungi 3 blok', ru: '3 блока сегодня' })}</p>
          <ol className="am-blok-ro">{REJA_BLOK.map((b, i) => <li key={i} className="am-karta fade-up" style={{ animationDelay: `${0.08 + i * 0.06}s` }}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== Bitta vizual — o'quvchining Demo Day sayti, JS bilan jonlanadi (namuna; CSS Praktikadagi uslubida) =====
const DEMO_KEY = 'ccDemoDay';
const demoRead = () => { try { const v = JSON.parse(localStorage.getItem(DEMO_KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const demoWrite = (patch) => { try { localStorage.setItem(DEMO_KEY, JSON.stringify({ ...(demoRead() || {}), ...patch, savedAt: Date.now() })); } catch { /* saqlab bo'lmadi */ } };
""" + maket + qp + qt + r"""
// rejim: tungi rejim tugmasi · like: sanagich · tabrik: 10 da yozuv · vosita: 'menyu' | 'salom' | 'forma'
const JonliSayt = ({ rejim = false, like = false, tabrik = false, vosita = null, boshSon = 0 }) => {
  const demo = useDemo();
  const asl = demo.d.uslub || USLUB_STD;
  const [tungi, setTungi] = useState(false);
  const [son, setSon] = useState(boshSon);
  const [menyu, setMenyu] = useState(false);
  const [ism, setIsm] = useState('');
  const [pochta, setPochta] = useState('');
  const [javob, setJavob] = useState(null); // null | 'xato' | 'ok'
  const uslub = tungi ? (asl === 'qorongi' ? 'minimal' : 'qorongi') : asl;
  return (
    <div className={`ds ds-${uslub} js-sayt`}>
      <div className="ds-bar"><span className="bb-dots"><i /><i /><i /></span><span className="ds-url">mening-saytim · Live Server</span></div>
      <div className="ds-body">
        <div className="ds-hd">
          <span className="ds-logo"><i className="ds-mark" aria-hidden="true" />{tr({ uz: "To'garak jadvali", ru: 'Расписание кружков' })}</span>
          {vosita === 'menyu'
            ? <button type="button" className="js-btn js-menyu-btn" aria-expanded={menyu} onClick={() => setMenyu(m => !m)}>{tr(menyu ? { uz: 'Yopish', ru: 'Закрыть' } : { uz: 'Menyu', ru: 'Меню' })}</button>
            : <span className="ds-nav"><span>{tr({ uz: 'Jadval', ru: 'Расписание' })}</span><span>{tr({ uz: 'Aloqa', ru: 'Контакты' })}</span></span>}
          {rejim && <button type="button" className="js-btn" onClick={() => setTungi(t => !t)}>{tr(tungi ? { uz: 'Kunduzgi rejim', ru: 'Дневной режим' } : { uz: 'Tungi rejim', ru: 'Ночной режим' })}</button>}
        </div>
        {vosita === 'menyu' && menyu && <div className="js-menyu am-ochil">{[{ uz: 'Bosh sahifa', ru: 'Главная' }, { uz: 'Jadval', ru: 'Расписание' }, { uz: 'Ustozlar', ru: 'Учителя' }, { uz: 'Aloqa', ru: 'Контакты' }].map((x, i) => <span key={i}>{tr(x)}</span>)}</div>}
        <div className="ds-hero">
          <div className="ds-hero-t">
            <p className="ds-tag">{tr({ uz: "Maktab to'garaklari · 2026", ru: 'Школьные кружки · 2026' })}</p>
            <p className="ds-h1">{tr({ uz: "To'garak jadvali endi telefoningizda", ru: 'Расписание кружков теперь в телефоне' })}</p>
            <p className="ds-p">{tr({ uz: "Jadval faqat devorda edi — endi uni uydan ham ko'rasiz.", ru: 'Расписание висело только на стене — теперь его видно и из дома.' })}</p>
            {like && <div className="ds-btns"><button type="button" className="ds-tugma js-like" onClick={() => setSon(n => n + 1)}>Like</button><span className="js-son" aria-live="polite">{son}</span></div>}
            {tabrik && son >= 10 && <p className="js-tabrik am-ochil">{tr({ uz: 'Rahmat! 10 like', ru: 'Спасибо! 10 лайков' })}</p>}
          </div>
          <DsIll />
        </div>
        {vosita === 'salom' && <div className="js-blok am-ochil">
          <input className="js-input" value={ism} placeholder={tr({ uz: 'Ismingizni yozing', ru: 'Напишите своё имя' })} onChange={e => setIsm(e.target.value)} aria-label={tr({ uz: 'Ism', ru: 'Имя' })} />
          <p className="js-salom">{ism.trim() ? tr({ uz: `Salom, ${ism.trim()}!`, ru: `Привет, ${ism.trim()}!` }) : tr({ uz: 'Salom!', ru: 'Привет!' })}</p>
        </div>}
        {vosita === 'forma' && <form className="js-blok am-ochil" onSubmit={e => { e.preventDefault(); setJavob(pochta.trim() ? 'ok' : 'xato'); }}>
          <div className="js-qator"><input className="js-input" value={pochta} placeholder={tr({ uz: 'Pochtangiz', ru: 'Ваша почта' })} onChange={e => { setPochta(e.target.value); setJavob(null); }} aria-label={tr({ uz: 'Pochta', ru: 'Почта' })} /><button type="submit" className="ds-tugma js-btn2">{tr({ uz: 'Yuborish', ru: 'Отправить' })}</button></div>
          {javob === 'xato' && <p className="js-xato">{tr({ uz: 'Pochtani yozing', ru: 'Напишите почту' })}</p>}
          {javob === 'ok' && <p className="js-ok">{tr({ uz: 'Rahmat, xabaringiz qabul qilindi', ru: 'Спасибо, сообщение принято' })}</p>}
        </form>}
        <div className="ds-ft">{tr({ uz: "To'garak jadvali · 2026", ru: 'Расписание кружков · 2026' })}</div>
      </div>
    </div>
  );
};
const NUSXA_HTML = '<button id="like">Like</button> <span id="son">0</span>';
const NUSXA_IZOH = '// like tugmasi bosilsa son 1 ga oshsin';
const KodNusxa = ({ yorliq, kod }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(kod); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return (
    <div className="am-kod">
      <div className="am-prompt-h"><p className="flow-label">{tr(yorliq)}</p><button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Nusxalash', ru: 'Скопировать' })}</button></div>
      <pre className="am-masalan">{kod}</pre>
    </div>
  );
};

// ===== a1 · a2 · a3 · a4 — AMALIYOT (F-1015-332, praktika qolipi) =====
const A1 = {
  qadamlar: [
    { uz: "«Promptni nusxalash» → gemini.google.com'ga qo'ying, oxiridagi `{…}` o'rniga `index.html` va `style.css` kodingizni qo'ying.", ru: '«Скопировать промпт» → вставьте в gemini.google.com, вместо `{…}` в конце — код `index.html` и `style.css`.' },
    { uz: "Javobdagi kodlarni fayllarga qo'ying: `index.html` va `style.css` ni almashtiring, yangi `script.js` yarating, `Ctrl+S`.", ru: 'Вставьте код из ответа в файлы: замените `index.html` и `style.css`, создайте новый `script.js`, `Ctrl+S`.' },
    { uz: "Live Server'da tugmani bosing: sayt qorong'i bo'ldimi, yana bosilsa qaytdimi? Ishlamasa, Gemini'ga yozing: «tugma bosilsa hech narsa bo'lmayapti, tuzat».", ru: 'Нажмите кнопку в Live Server: сайт потемнел, а при повторном нажатии вернулся? Если нет, напишите Gemini: «при нажатии ничего не происходит, исправь».' }
  ]
};
const A1_PROMPT = { uz: "Saytimga tungi rejim tugmasini qo'sh: menyu yonida «Tungi rejim» tugmasi bo'lsin.\nBosilsa sahifa qorong'i bo'lsin (to'q fon, och matn), yana bosilsa yorug'ga qaytsin; tugma yozuvi ham almashsin.\nJavaScript'ni alohida script.js fayliga yoz va index.html oxirida ula. Qorong'i ranglarni style.css ga .tungi klassi bilan qo'sh.\nBor matnlarimni o'zgartirma. O'zgargan fayllarni to'liq qaytar.\nMana kodim: {index.html va style.css kodini shu yerga qo'ying}", ru: 'Добавь на мой сайт кнопку ночного режима: рядом с меню кнопка «Ночной режим».\nПри нажатии страница темнеет (тёмный фон, светлый текст), при повторном — возвращается светлой; надпись на кнопке тоже меняется.\nJavaScript напиши в отдельном файле script.js и подключи в конце index.html. Тёмные цвета добавь в style.css классом .tungi.\nМои тексты не меняй. Верни изменённые файлы целиком.\nВот мой код: {вставьте сюда код index.html и style.css}' };
const ScreenTungi = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Amaliyot 1 · Gemini', ru: 'Практика 1 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: "Saytingizga tungi rejim tugmasini qo'shing.", ru: 'Добавьте на сайт кнопку ночного режима.' })}</h2></div>
      <Split>
        <Col><div className="fade-up delay-1"><PromptBlok matn={tr(A1_PROMPT)} /></div></Col>
        <Col>
          <p className="flow-label">{tr({ uz: 'Kutilgan natija · bosib ko\'ring', ru: 'Ожидаемый результат · нажмите' })}</p>
          <JonliSayt rejim />
          <p className="small am-osti">{fmtCode(tr({ uz: "Gemini javobida `if` / `else` ni toping — u hozirgi rejimga qarab qaysi biriga o'tishni tanlaydi.", ru: 'Найдите в ответе Gemini `if` / `else` — по текущему режиму он выбирает, куда переключиться.' }))}</p>
          <QadamTugma b={A1} />
        </Col>
      </Split>
    </div>
  </Stage>
);
const A2 = {
  qadamlar: [
    { uz: "`index.html` da tugma va son uchun joy yozing (pastdagi qatorni nusxalang) — masalan, bosh qismdagi tugmalar yoniga.", ru: 'В `index.html` добавьте кнопку и место для числа (скопируйте строку ниже) — например, рядом с кнопками главного блока.' },
    { uz: "`script.js` oxiriga izohni qo'ying va `Enter` bosing.", ru: 'В конец `script.js` вставьте комментарий и нажмите `Enter`.' },
    { uz: "Kulrang taklif chiqadi — o'qing, to'g'ri bo'lsa `Tab` bilan qabul qiling. `Ctrl+S`, brauzerda 3 marta bosing: son 3 bo'ldimi?", ru: 'Появится серая подсказка — прочитайте, если верно, примите клавишей `Tab`. `Ctrl+S`, нажмите в браузере 3 раза: стало 3?' }
  ]
};
const ScreenLike = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Amaliyot 2 · Copilot', ru: 'Практика 2 · Copilot' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: "Like tugmasi bosilgan sari son oshsin.", ru: 'Пусть число растёт с каждым нажатием лайка.' })}</h2></div>
      <Mentor>{tr({ uz: <>Bu safar promptni Gemini'ga emas — <b style={{ color: T.ink }}>Copilot</b>'ga yozasiz: u VS Code ichida, siz yozgan izohdan kodni o'zi taklif qiladi.</>, ru: <>На этот раз пишете не Gemini, а <b style={{ color: T.ink }}>Copilot</b>: он внутри VS Code и сам предлагает код по вашему комментарию.</> })}</Mentor>
      <Split>
        <Col>
          <div className="am-karta fade-up delay-1">
            <KodNusxa yorliq={{ uz: '1 · index.html ga', ru: '1 · в index.html' }} kod={NUSXA_HTML} />
            <KodNusxa yorliq={{ uz: '2 · script.js oxiriga', ru: '2 · в конец script.js' }} kod={NUSXA_IZOH} />
          </div>
          <Qadamlar b={A2} cls="fade-up delay-2" />
          <details className="am-yordam"><summary>{tr({ uz: 'Taklif chiqmadimi?', ru: 'Подсказка не появилась?' })}</summary><p>{tr({ uz: "Izohdan keyin Enter'ni yana bir bosing. Baribir chiqmasa — Copilot'ga kirganingizni tekshiring (pastki chiziqdagi Copilot belgisi) yoki shu izohni Gemini'ga yuboring.", ru: 'Нажмите Enter после комментария ещё раз. Если всё равно нет — проверьте, что вошли в Copilot (значок Copilot в нижней строке), или отправьте этот комментарий в Gemini.' })}</p></details>
        </Col>
        <Col>
          <p className="flow-label">{tr({ uz: "Kutilgan natija · bosib ko'ring", ru: 'Ожидаемый результат · нажмите' })}</p>
          <JonliSayt rejim like />
          <p className="small am-osti">{fmtCode(tr({ uz: "Copilot `let son = 0` va `click` hodisasini yozadi — o'zgaruvchi va hodisa JS darslaridagi bilan bir xil.", ru: 'Copilot напишет `let son = 0` и событие `click` — переменная и событие те же, что на уроках JS.' }))}</p>
        </Col>
      </Split>
    </div>
  </Stage>
);
const A3 = {
  qadamlar: [
    { uz: "`script.js` da son oshadigan qatorni toping (`son = son + 1` yoki `son++`).", ru: 'Найдите в `script.js` строку, где растёт число (`son = son + 1` или `son++`).' },
    { uz: "Undan keyin o'zingiz shart yozing: son 10 ga teng bo'lsa — sahifada «Rahmat! 10 like» yozuvi chiqsin.", ru: 'После неё сами напишите условие: если число равно 10 — на странице появляется «Спасибо! 10 лайков».' },
    { uz: "`Ctrl+S` — brauzerda 10 marta bosib tekshiring.", ru: '`Ctrl+S` — проверьте в браузере, нажав 10 раз.' }
  ]
};
const ScreenTabrik = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: "Amaliyot 3 · AI'siz", ru: 'Практика 3 · без AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: "10 like bo'lsa, tabrik yozuvi chiqsin.", ru: 'При 10 лайках пусть появится поздравление.' })}</h2></div>
      <Mentor>{tr({ uz: <>Bu safar kodni AI yozmaydi — <b style={{ color: T.ink }}>o'zingiz</b>. Shart (<code className="qcode">if</code>) JS darsidagi o'sha.</>, ru: <>На этот раз код пишет не AI, а <b style={{ color: T.ink }}>вы сами</b>. Условие (<code className="qcode">if</code>) — то же, что на уроке JS.</> })}</Mentor>
      <Split>
        <Col>
          <Qadamlar b={A3} cls="fade-up delay-1" />
          <div className="am-karta fade-up delay-2">
            <p className="flow-label">{tr({ uz: 'Qolip', ru: 'Шаблон' })}</p>
            <pre className="am-masalan">{"if (son === …) {\n  …\n}"}</pre>
          </div>
          <details className="am-yordam"><summary>{tr({ uz: 'Qiynalyapsizmi?', ru: 'Трудно?' })}</summary><pre className="am-masalan">{'if (son === 10) {\n  alert("Rahmat! 10 like");\n}'}</pre></details>
        </Col>
        <Col>
          <p className="flow-label">{tr({ uz: "Kutilgan natija · 10 marta bosing", ru: 'Ожидаемый результат · нажмите 10 раз' })}</p>
          <JonliSayt rejim like tabrik />
          <p className="small am-osti">{fmtCode(tr({ uz: "Shart (`if`) son 10 ga teng bo'lsagina ishlaydi.", ru: 'Условие (`if`) срабатывает, только когда число равно 10.' }))}</p>
        </Col>
      </Split>
    </div>
  </Stage>
);
const VOSITALAR = [
  { id: 'menyu', name: { uz: 'Ochiladigan menyu', ru: 'Раскрывающееся меню' }, sub: { uz: 'bosilsa ochiladi, yana bosilsa yopiladi', ru: 'нажали — открылось, ещё раз — закрылось' },
    p: { uz: "Saytimga ochiladigan menyu qo'sh: tepada «Menyu» tugmasi bo'lsin; bosilsa sahifalar ro'yxati ochilsin, yana bosilsa yopilsin, tugma yozuvi «Yopish» ga almashsin.", ru: 'Добавь на сайт раскрывающееся меню: вверху кнопка «Меню»; при нажатии открывается список страниц, при повторном — закрывается, надпись кнопки меняется на «Закрыть».' } },
  { id: 'salom', name: { uz: 'Jonli salom', ru: 'Живое приветствие' }, sub: { uz: 'ism yozilsa salom o\'zgaradi', ru: 'пишете имя — приветствие меняется' },
    p: { uz: "Bosh sahifaga ism yoziladigan maydon qo'sh: ism yozilgan sari ostidagi «Salom, {ism}!» yozuvi jonli o'zgarsin (input hodisasi); maydon bo'sh bo'lsa — «Salom!».", ru: 'Добавь на главную поле для имени: по мере ввода надпись под ним «Привет, {имя}!» меняется вживую (событие input); если поле пустое — «Привет!».' } },
  { id: 'forma', name: { uz: 'Forma tekshiruvi', ru: 'Проверка формы' }, sub: { uz: "bo'sh yuborilsa ogohlantiradi", ru: 'предупреждает, если пусто' },
    p: { uz: "Aloqa sahifasiga forma qo'sh: pochta maydoni va «Yuborish» tugmasi. Maydon bo'sh bo'lsa, qizil «Pochtani yozing» xabari chiqsin; to'ldirilgan bo'lsa — «Rahmat, xabaringiz qabul qilindi» (if / else).", ru: 'Добавь на страницу контактов форму: поле почты и кнопка «Отправить». Если поле пустое — красное «Напишите почту»; если заполнено — «Спасибо, сообщение принято» (if / else).' } },
];
const A4 = {
  qadamlar: [
    { uz: "«Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi `{…}` o'rniga `index.html`, `style.css` va `script.js` kodingizni qo'ying.", ru: '«Скопировать промпт» → вставьте в Gemini, вместо `{…}` в конце — код `index.html`, `style.css` и `script.js`.' },
    { uz: "Javobdagi kodlarni fayllaringizga almashtiring, `Ctrl+S`.", ru: 'Замените код в своих файлах на код из ответа, `Ctrl+S`.' },
    { uz: "Live Server'da sinab ko'ring: namunadagidek ishlayaptimi? Yana birini qo'shmoqchi bo'lsangiz — boshqasini tanlab, promptni yana yuboring.", ru: 'Проверьте в Live Server: работает, как в образце? Хотите ещё — выберите другой и отправьте промпт снова.' }
  ]
};
const ScreenVosita = ({ screen, onNext, onPrev }) => {
  const demo = useDemo();
  const tanlov = (demo.d.js && demo.d.js.vosita) || null;
  const tanla = (id) => demo.set({ js: { ...(demo.d.js || {}), vosita: id } });
  const v = VOSITALAR.find(x => x.id === tanlov);
  const matn = v ? tr({ uz: `${v.p.uz}\nJavaScript'ni script.js ga qo'sh (bor kodimni o'chirma), kerakli HTML va CSS'ni ham qo'sh. Bor matnlarimni o'zgartirma.\nO'zgargan fayllarni to'liq qaytar.\nMana kodim: {index.html, style.css va script.js kodini shu yerga qo'ying}`, ru: `${v.p.ru}\nJavaScript добавь в script.js (мой код не удаляй), нужные HTML и CSS тоже добавь. Мои тексты не меняй.\nВерни изменённые файлы целиком.\nВот мой код: {вставьте сюда код index.html, style.css и script.js}` }) : null;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 4 · yana bitta vosita', ru: 'Практика 4 · ещё один инструмент' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: "Saytingizga yana bitta jonli vosita qo'shing.", ru: 'Добавьте на сайт ещё один живой инструмент.' })}</h2></div>
        <Split>
          <Col>
            <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Vosita', ru: 'Инструмент' })}</p>
              <div className="am-uslub am-uslub-1">{VOSITALAR.map(x => <button key={x.id} type="button" className={`am-uslub-btn ${tanlov === x.id ? 'on' : ''}`} onClick={() => tanla(x.id)}><b>{tr(x.name)}</b><span>{tr(x.sub)}</span></button>)}</div>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(tanlov ? { uz: "O'ngdagi namunada sinab ko'ring.", ru: 'Попробуйте в образце справа.' } : { uz: "Bittasini tanlang — o'ngdagi namunada sinab ko'rasiz, keyin prompt ochiladi.", ru: 'Выберите один — попробуете в образце справа, затем откроется промпт.' })}</p>
            </div>
            {matn && <div className="am-ochil"><PromptBlok matn={matn} /></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Saytingiz · sinab ko'ring", ru: 'Ваш сайт · попробуйте' })}</p>
            <div key={tanlov || 'yoq'}><JonliSayt rejim like vosita={tanlov} /></div>
            {matn && <QadamTugma b={A4} cls="am-ochil" />}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

"""
cut("// ===== SCREEN 1 — REJA =====", "// ===== SCREEN 15 — YAKUNIY (o'lik tugmani jonlantirish) =====", NEW)

# ---------- 5. Yakun ----------
rep("""  const RECAP = [tr({ uz: "Statik sayt — jonsiz rasm; interaktiv sayt — javob beradi", ru: 'Статичный сайт — неживая картинка; интерактивный — отвечает' }), tr({ uz: "Asosiy qoida: HODISA → REAKSIYA → O'ZGARISH", ru: 'Главное правило: СОБЫТИЕ → РЕАКЦИЯ → ИЗМЕНЕНИЕ' }), tr({ uz: "Hodisalar: bosish (click), hover, yozish (input)", ru: 'События: клик (click), hover, ввод (input)' }), tr({ uz: "5 vosita: like, rejim, ko'rsat/yashir, jonli salom, forma", ru: '5 инструментов: лайк, режим, показать/скрыть, живое приветствие, форма' }), tr({ uz: "AI agent quradi — lekin siz tushunasiz va tekshirasiz", ru: 'AI-агент строит — но вы понимаете и проверяете' })];""",
    """  const RECAP = [tr({ uz: "Asosiy qoida: HODISA → REAKSIYA → O'ZGARISH", ru: 'Главное правило: СОБЫТИЕ → РЕАКЦИЯ → ИЗМЕНЕНИЕ' }), fmtCode(tr({ uz: "Tungi rejim — `if` / `else` hozirgi holatga qarab tanlaydi", ru: 'Ночной режим — `if` / `else` выбирает по текущему состоянию' })), fmtCode(tr({ uz: "Copilot: izoh yozasiz → taklifni `Tab` bilan qabul qilasiz", ru: 'Copilot: пишете комментарий → принимаете подсказку клавишей `Tab`' })), fmtCode(tr({ uz: "Shartni o'zingiz yozdingiz: `if (son === 10)`", ru: 'Условие вы написали сами: `if (son === 10)`' })), tr({ uz: "JavaScript alohida script.js faylida yashaydi", ru: 'JavaScript живёт в отдельном файле script.js' })];""")
rep("""  const HOMEWORK = [{ b: tr({ uz: "O'z sahifangiz", ru: 'Ваша страница' }), t: tr({ uz: "— HTML/CSS saytingizga 1 ta vosita qo'shing (masalan, like yoki tungi rejim)", ru: '— добавьте на свой HTML/CSS-сайт 1 инструмент (например, лайк или ночной режим)' }) }, { b: tr({ uz: 'Antigravity bilan', ru: 'С Antigravity' }), t: tr({ uz: "— agentga \\"saytimga tungi rejim qo'sh\\" deb topshiring, rejasini o'qing, keyin tasdiqlang", ru: '— поручите агенту «добавь на мой сайт ночной режим», прочитайте его план, затем подтвердите' }) }, { b: tr({ uz: "Tekshiruvchi bo'ling", ru: 'Будьте проверяющим' }), t: tr({ uz: "— agent qo'shgan vositani sinab ko'ring: ishlayaptimi? Xato bormi?", ru: '— испытайте инструмент, добавленный агентом: работает? Есть ошибки?' }) }];""",
    """  const HOMEWORK = [{ b: tr({ uz: 'Yana bitta vosita', ru: 'Ещё один инструмент' }), t: tr({ uz: "— 4-amaliyotda tanlamagan vositalardan birini Copilot yoki Gemini bilan qo'shing", ru: '— добавьте с Copilot или Gemini один из инструментов, которые не выбрали в практике 4' }) }, { b: tr({ uz: 'Saytni yangilang', ru: 'Обновите сайт' }), t: tr({ uz: "— Netlify'da saytingiz nomini bosing, Deploys bo'limini oching va papkani qayta sudrab tashlang", ru: '— в Netlify нажмите на имя сайта, откройте Deploys и снова перетащите папку' }) }, { b: tr({ uz: 'Havolani yuboring', ru: 'Отправьте ссылку' }), t: tr({ uz: '— platformadagi vazifa-savoliga', ru: '— в задание на платформе' }) }];""")
rep("""<p className="hw-note">{tr({ uz: 'Esda tuting: AI quradi, lekin boshliq — sizsiz. Tushunib, tekshirib boring.', ru: 'Помните: AI строит, но главный — вы. Понимайте и проверяйте.' })}</p>""",
    """<p className="hw-note">{tr({ uz: <>Keyingi dars — <b>Praktika 2</b>: AI bilan tez sayt.</>, ru: <>Следующий урок — <b>Практика 2</b>: быстрый сайт с AI.</> })}</p>""")

# ---------- 6. Root ----------
rep("  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenPodium, ScreenFlashcards, Screen16];",
    "  const screens = [Screen0, Screen1, ScreenTungi, ScreenLike, ScreenTabrik, Screen15, ScreenVosita, ScreenPodium, Screen16];")
rep("                <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} onHomework={openHomeworkPractice} />",
    "                <Current key={screen} screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />")
rep("""  const next = () => {
    const entry = PRACTICE_AFTER[screen];""", """  const next = () => {
    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-332: blok «Davom etish»da nishon
    if (blokAch && live.mode !== 'mentor') earn(blokAch);
    const entry = PRACTICE_AFTER[screen];""")

# ---------- 7. CSS ----------
cssblok = blok(css, "        /* ===== F-1015-303/309 · praktika qolipi: amaliyot bloklari va DemoSahifa (izohda backtick yo'q) ===== */", "      `}</style>")
cssblok = cssblok.replace("        @media (max-width: 760px) { .am-reja .split > .col:last-child { order: -1; } }\n", "")
qtcss = blok(dep, "        /* ===== F-1015-330 · qadamlar tugmasi (a2, a3) ===== */", "        /* ===== F-1015-329 · a3 scroll maketi")
JS_CSS = r"""        .bb-dots { display: flex; gap: 5px; } .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        /* ===== F-1015-332 · jonli sayt namunasi va amaliyot qo'shimchalari ===== */
        .js-sayt .ds-body { transition: background 0.35s, color 0.35s; }
        .js-btn { font: 700 11px 'Manrope', sans-serif; background: var(--ds-acc); color: var(--ds-acc-ink); border: none; border-radius: 999px; padding: 5px 12px; cursor: pointer; }
        .js-btn:focus-visible, .js-like:focus-visible { outline: 2px solid var(--ds-ink); outline-offset: 2px; }
        .js-menyu-btn { margin-left: auto; }
        .js-menyu { display: flex; flex-direction: column; gap: 2px; padding: 8px 14px 10px; background: var(--ds-card); border-bottom: 1px solid var(--ds-line); font-size: 12px; color: var(--ds-ink); }
        .js-menyu span { padding: 5px 8px; border-radius: 6px; } .js-menyu span:hover { background: var(--ds-bub); }
        .js-like { border: none; cursor: pointer; font-family: inherit; }
        .js-son { align-self: center; font: 800 16px 'Manrope', sans-serif; color: var(--ds-h1); min-width: 22px; }
        .lesson-root .js-tabrik { margin: 10px 0 0; display: inline-block; padding: 6px 12px; border-radius: 10px; background: var(--ds-acc); color: var(--ds-acc-ink); font-size: 12.5px; font-weight: 800; }
        .js-blok { display: flex; flex-direction: column; gap: 6px; padding: 12px 16px; border-top: 1px solid var(--ds-line); }
        .js-qator { display: flex; gap: 8px; }
        .js-input { flex: 1; min-width: 0; font: 500 12.5px 'Manrope', sans-serif; padding: 7px 10px; border-radius: 8px; border: 1.5px solid var(--ds-line); background: var(--ds-card); color: var(--ds-ink); }
        .js-btn2 { border: none; cursor: pointer; font-family: inherit; }
        .lesson-root .js-salom { margin: 0; font-size: 15px; font-weight: 800; color: var(--ds-h1); }
        .lesson-root .js-xato { margin: 0; font-size: 12px; font-weight: 700; color: #b91c1c; }
        .ds-qorongi .lesson-root .js-xato, .ds-qorongi .js-xato { color: #fca5a5; }
        .lesson-root .js-ok { margin: 0; font-size: 12px; font-weight: 700; color: var(--ds-acc); }
        .am-kod { display: flex; flex-direction: column; gap: 6px; }
        .am-kod + .am-kod { margin-top: 6px; }
        .am-uslub-1 { grid-template-columns: minmax(0,1fr); }
        .am-yordam { background: ${T.paper}; border-radius: 12px; padding: 10px 14px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .am-yordam summary { cursor: pointer; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }
        .am-yordam p, .am-yordam pre { margin: 8px 0 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; }
        .lesson-root .am-blok-ro { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .am-blok-ro li { flex-direction: row; align-items: center; gap: 12px; flex-wrap: wrap; }
        .am-blok-n { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; color: ${T.accent}; }
        .am-blok-teg { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; background: ${T.bg}; padding: 3px 8px; border-radius: 6px; }
"""
rep("      `}</style>", cssblok + qtcss + JS_CSS + "      `}</style>")

open(P, 'w', encoding='utf-8').write(s)
print('OK', len(s.splitlines()), 'qator')
