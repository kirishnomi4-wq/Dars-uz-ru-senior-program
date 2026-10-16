#!/usr/bin/env python3
# F-1015-337 · PracticeLesson2 ko'rigi: reja (4 qism + bloklar bitta kartada, «promo» izohi) · YANGI a4 «Wow effekt» (testdan keyin, JS) → 9 ekran.
import sys
R = sys.argv[1]
P = R + '/src/2-Modull/PracticeLesson2.jsx'
s = open(P, encoding='utf-8').read()

def rep(old, new, n=1):
    global s
    c = s.count(old)
    assert c == n, f'{c}× : {old[:90]!r}'
    s = s.replace(old, new)

# ---------- 1. Reja: «promo» izohi + bitta karta ----------
rep("""<Mentor>{tr({ uz: <>O'zingiz tanlagan mavzuga promo sahifa qurasiz: turnir, klub yoki o'yin. Yaxshi prompt <b style={{ color: T.ink }}>4 qismdan</b> iborat — ularni o'ngda ko'rasiz.</>, ru: <>Построите промо-страницу на свою тему: турнир, клуб или игра. Хороший промпт состоит из <b style={{ color: T.ink }}>4 частей</b> — они справа.</> })}</Mentor>""",
    """<Mentor>{tr({ uz: <><b style={{ color: T.ink }}>Promo sahifa</b> — biror tadbir yoki o'yinni tanishtirib, odamlarni chaqiradigan bitta sahifa. Bugun o'zingiz tanlagan mavzuga shunday sahifa qurasiz. Yaxshi prompt <b style={{ color: T.ink }}>4 qismdan</b> iborat — ularni o'ngda ko'rasiz.</>, ru: <><b style={{ color: T.ink }}>Промо-страница</b> — одна страница, которая знакомит с событием или игрой и зовёт людей. Сегодня построите такую страницу на свою тему. Хороший промпт состоит из <b style={{ color: T.ink }}>4 частей</b> — они справа.</> })}</Mentor>""")
rep("""          <p className="flow-label">{tr({ uz: 'Yaxshi prompt — 4 qism', ru: 'Хороший промпт — 4 части' })}</p>
          <div className="am-qism-ro fade-up delay-1">{QISMLAR.map((q, i) => <span key={i} className="am-qism"><b>{i + 1}</b>{tr(q)}</span>)}</div>
          <p className="flow-label" style={{ marginTop: 6 }}>{tr({ uz: 'Bugungi 3 blok', ru: '3 блока сегодня' })}</p>
          <ol className="am-blok-ro">{REJA_BLOK.map((b, i) => <li key={i} className="am-karta fade-up" style={{ animationDelay: `${0.08 + i * 0.06}s` }}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>""",
    """          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: 'Yaxshi prompt — 4 qism', ru: 'Хороший промпт — 4 части' })}</p>
            <div className="am-qism-ro">{QISMLAR.map((q, i) => <span key={i} className="am-qism"><b>{i + 1}</b>{tr(q)}</span>)}</div>
            <hr className="am-chiziq" />
            <p className="flow-label">{tr({ uz: `Bugungi ${REJA_BLOK.length} blok`, ru: `${REJA_BLOK.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{REJA_BLOK.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>""")
rep("""  { t: { uz: "Yangi bo'lim", ru: 'Новый раздел' }, tag: 'Copilot' }
];""", """  { t: { uz: "Yangi bo'lim", ru: 'Новый раздел' }, tag: 'Copilot' },
  { t: { uz: 'Wow effekt', ru: 'Вау-эффект' }, tag: 'Gemini · JavaScript' }
];""")

# ---------- 2. PromoMaket: wow effektlari ----------
rep("const PromoMaket = ({ f = {}, qoidalar = false }) => {", """const PromoMaket = ({ f = {}, qoidalar = false, wow = null }) => {
  // F-1015-337: wow effektlari namunasi — taymer · konfetti · zarrachalar · 3D kartalar
  const maqsad = useRef(Date.now() + ((12 * 24 + 5) * 60 + 42) * 60000);
  const [hozir, setHozir] = useState(() => Date.now());
  const [konf, setKonf] = useState([]);
  useEffect(() => { if (wow !== 'taymer') return undefined; const t = setInterval(() => setHozir(Date.now()), 1000); return () => clearInterval(t); }, [wow]);
  const portla = () => {
    if (wow !== 'konfetti') return;
    const id = Date.now();
    setKonf(k => [...k, ...Array.from({ length: 26 }, (_, i) => ({ id: `${id}-${i}`, x: (i * 37) % 100, d: (i % 7) * 0.04, r: (i * 53) % 360, c: i % 4 }))]);
    setTimeout(() => setKonf(k => k.filter(p => !p.id.startsWith(`${id}-`))), 1900);
  };
  useEffect(() => { if (wow !== 'konfetti') return undefined; const t = setTimeout(portla, 500); return () => clearTimeout(t); }, [wow]); // eslint-disable-line
  const qoldi = Math.max(0, maqsad.current - hozir);
  const egil = (e) => { if (wow !== 'egilish') return; const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; e.currentTarget.style.transform = `perspective(500px) rotateY(${x * 22}deg) rotateX(${-y * 22}deg) translateY(-4px)`; };
  const qaytar = (e) => { e.currentTarget.style.transform = ''; };""")
rep("""        <div className={`pm-hero ${c ? '' : 'pm-rangsiz'}`}>
          {f.mavzu && f.mavzu.trim() ? <p className="pm-h1">{f.mavzu.trim()}</p> : bosh({ uz: 'mavzu', ru: 'тема' }, 'pm-yoq-h')}""",
    """        <div className={`pm-hero ${c ? '' : 'pm-rangsiz'}`}>
          {(wow === 'zarra' || konf.length > 0) && <div className="pm-fonqat" aria-hidden="true">
            {wow === 'zarra' && Array.from({ length: 16 }, (_, i) => <i key={i} className="pm-zarra" style={{ left: `${(i * 23) % 96}%`, top: `${(i * 41) % 90}%`, width: 4 + (i % 4) * 2, height: 4 + (i % 4) * 2, animationDuration: `${5 + (i % 5)}s`, animationDelay: `${-(i % 6)}s` }} />)}
            {konf.map(p => <i key={p.id} className={`pm-konf pm-konf${p.c}`} style={{ left: `${p.x}%`, animationDelay: `${p.d}s`, '--r': `${p.r}deg` }} />)}
          </div>}
          {f.mavzu && f.mavzu.trim() ? <p className="pm-h1">{f.mavzu.trim()}</p> : bosh({ uz: 'mavzu', ru: 'тема' }, 'pm-yoq-h')}""")
rep("""          {f.tugma && f.tugma.trim() ? <span className="pm-tugma">{f.tugma.trim()}</span> : bosh({ uz: 'tugma', ru: 'кнопка' })}""",
    """          {wow === 'taymer' && <div className="pm-taymer" aria-label={tr({ uz: 'Boshlanishigacha', ru: 'До начала' })}>{[[Math.floor(qoldi / 864e5), { uz: 'kun', ru: 'дн' }], [Math.floor(qoldi / 36e5) % 24, { uz: 'soat', ru: 'ч' }], [Math.floor(qoldi / 6e4) % 60, { uz: 'daq', ru: 'мин' }], [Math.floor(qoldi / 1e3) % 60, { uz: 'son', ru: 'сек' }]].map(([v, l], i) => <span key={i}><b>{String(v).padStart(2, '0')}</b><small>{tr(l)}</small></span>)}</div>}
          {f.tugma && f.tugma.trim() ? (wow === 'konfetti' ? <button type="button" className="pm-tugma pm-tugma-btn" onClick={portla}>{f.tugma.trim()}</button> : <span className="pm-tugma">{f.tugma.trim()}</span>) : bosh({ uz: 'tugma', ru: 'кнопка' })}""")
rep("""        <div className="pm-kartalar">{[0, 1, 2].map(i => kartalar[i] ? <div key={i} className="pm-karta"><i />{kartalar[i]}</div> : <div key={i} className="pm-karta pm-karta-yoq">?</div>)}</div>""",
    """        <div className={`pm-kartalar ${wow === 'egilish' ? 'pm-egil' : ''}`}>{[0, 1, 2].map(i => kartalar[i] ? <div key={i} className="pm-karta" onMouseMove={egil} onMouseLeave={qaytar}><i />{kartalar[i]}</div> : <div key={i} className="pm-karta pm-karta-yoq">?</div>)}</div>""")

# ---------- 3. YANGI a4 — Wow effekt ----------
WOW = r"""
// ===== a4 — WOW EFFEKT (F-1015-337, testdan keyin): AI JavaScript bilan yozadi; namunada jonli =====
const WOWS = [
  { id: 'taymer', name: { uz: 'Taymer', ru: 'Таймер' }, sub: { uz: 'boshlanishigacha qolgan vaqt', ru: 'сколько осталось до начала' },
    p: { uz: "Bosh qismga tadbir boshlanishigacha qolgan vaqtni ko'rsatadigan taymer qo'sh: kun, soat, daqiqa, soniya — har soniyada yangilansin. Sana — 2026-yil 1-noyabr, soat 09:00.", ru: 'Добавь в главный блок таймер, который показывает, сколько осталось до начала события: дни, часы, минуты, секунды — обновляется каждую секунду. Дата — 1 ноября 2026, 09:00.' } },
  { id: 'konfetti', name: { uz: 'Konfetti', ru: 'Конфетти' }, sub: { uz: 'tugma bosilsa sochiladi', ru: 'разлетается при нажатии' },
    p: { uz: "Asosiy tugma bosilganda ekranga rangli konfetti (qog'ozchalar) sochilsin va 2 soniyada yo'qolsin; ranglari — saytimdagi ranglar.", ru: 'При нажатии на главную кнопку по экрану разлетается цветное конфетти и исчезает за 2 секунды; цвета — как на моём сайте.' } },
  { id: 'zarra', name: { uz: 'Uchar zarrachalar', ru: 'Летающие частицы' }, sub: { uz: 'bosh qism orqasida suzadi', ru: 'плывут за главным блоком' },
    p: { uz: "Bosh qism (hero) orqasida 20 ta kichik oq, yarim shaffof nuqta sekin suzib yursin; matnni yopmasin.", ru: 'За главным блоком (hero) медленно плывут 20 маленьких белых полупрозрачных точек; текст не закрывают.' } },
  { id: 'egilish', name: { uz: '3D kartalar', ru: '3D-карточки' }, sub: { uz: 'sichqoncha ostida egiladi', ru: 'наклоняются под мышкой' },
    p: { uz: "Kartalar sichqoncha ostida 3D egilsin: sichqoncha qayerda bo'lsa, karta o'sha tomonga biroz og'sin; sichqoncha ketganda joyiga qaytsin.", ru: 'Карточки наклоняются в 3D под мышкой: куда мышка — туда немного наклон; когда мышка уходит — возвращаются на место.' } },
];
const A4 = {
  qadamlar: [
    { uz: "«Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi `{…}` o'rniga `index.html` va `style.css` kodingizni qo'ying.", ru: '«Скопировать промпт» → вставьте в Gemini, вместо `{…}` в конце — код `index.html` и `style.css`.' },
    { uz: "Javobdagi kodlarni fayllarga qo'ying; `script.js` bo'lmasa — yarating. `Ctrl+S`.", ru: 'Вставьте код из ответа в файлы; если нет `script.js` — создайте. `Ctrl+S`.' },
    { uz: "Live Server'da sinab ko'ring. Yoqmasa — Gemini'ga aniq yozing; yana birini qo'shmoqchi bo'lsangiz, boshqasini tanlang.", ru: 'Проверьте в Live Server. Не нравится — точно напишите Gemini; хотите ещё — выберите другой.' }
  ]
};
const ScreenWow = ({ screen, onNext, onPrev }) => {
  const [tanlov, setTanlov] = useState(() => promoRead().wow || null);
  const tanla = (id) => { setTanlov(id); promoWrite({ wow: id }); };
  const f = promoRead();
  const fx = f.mavzu && f.uslub && f.rang ? f : promoNamuna();
  const w = WOWS.find(x => x.id === tanlov);
  const matn = w ? tr({ uz: `Promo sahifamga effekt qo'sh. ${w.p.uz}\nJavaScript'ni alohida script.js fayliga yoz va index.html oxirida ula; kerakli CSS'ni style.css ga qo'sh. Bor matn va dizaynimni buzma.\nHarakatni yoqtirmaydiganlar uchun @media (prefers-reduced-motion: reduce) da animatsiya o'chsin.\nO'zgargan fayllarni to'liq qaytar.\nMana kodim: {index.html va style.css kodini shu yerga qo'ying}`, ru: `Добавь на мою промо-страницу эффект. ${w.p.ru}\nJavaScript напиши в отдельном файле script.js и подключи в конце index.html; нужный CSS добавь в style.css. Мои тексты и дизайн не ломай.\nДля тех, кто не любит движение, в @media (prefers-reduced-motion: reduce) анимация отключается.\nВерни изменённые файлы целиком.\nВот мой код: {вставьте сюда код index.html и style.css}` }) : null;
  return (
    <Stage eyebrow={{ uz: 'Amaliyot 4 · wow effekt', ru: 'Практика 4 · вау-эффект' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: "Sahifangizga AI bilan «wow» effekt qo'shing.", ru: 'Добавьте на страницу «вау»-эффект с AI.' })}</h2></div>
        <Mentor>{tr({ uz: <>Bunday effektni qo'lda yozish uzoq vaqt oladi — AI uni bir necha soniyada yozadi. Sizning ishingiz — uni <b style={{ color: T.ink }}>aniq tasvirlash</b>.</>, ru: <>Писать такой эффект вручную долго — AI напишет его за несколько секунд. Ваша задача — <b style={{ color: T.ink }}>точно его описать</b>.</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Effekt', ru: 'Эффект' })}</p>
              <div className="am-uslub">{WOWS.map(x => <button key={x.id} type="button" className={`am-uslub-btn ${tanlov === x.id ? 'on' : ''}`} onClick={() => tanla(x.id)}><b>{tr(x.name)}</b><span>{tr(x.sub)}</span></button>)}</div>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(tanlov ? { uz: "O'ngdagi namunada sinab ko'ring.", ru: 'Попробуйте в образце справа.' } : { uz: "Bittasini tanlang — o'ngdagi namunada ko'rasiz, keyin prompt ochiladi.", ru: 'Выберите один — увидите в образце справа, затем откроется промпт.' })}</p>
            </div>
            {matn && <div className="am-ochil"><PromptBlok matn={matn} /></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Saytingiz · sinab ko'ring", ru: 'Ваш сайт · попробуйте' })}</p>
            <div key={tanlov || 'yoq'}><PromoMaket f={fx} wow={tanlov} /></div>
            {tanlov && <p className="small am-osti">{tr(tanlov === 'konfetti' ? { uz: 'Tugmani bosing.', ru: 'Нажмите кнопку.' } : tanlov === 'egilish' ? { uz: "Sichqonchani kartalar ustida yurgizing.", ru: 'Поводите мышкой над карточками.' } : { uz: 'Bu effektni AI JavaScript bilan yozadi.', ru: 'Этот эффект AI пишет на JavaScript.' })}</p>}
            {matn && <QadamTugma b={A4} cls="am-ochil" />}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};
"""
rep("// ===== SCREEN 7 — TEST 2 =====", WOW + "\n// ===== SCREEN 7 — TEST 2 =====")

# ---------- 4. SCREEN_META, root, yakun ----------
rep("""  { id: 's7',  type: 'test',     template: 'MCScreen', scored: true,  scope: 'final' }, // F-1015-336: yagona ballik (eski s7, kalit B saqlandi)
""", """  { id: 's7',  type: 'test',     template: 'MCScreen', scored: true,  scope: 'final' }, // F-1015-336: yagona ballik (eski s7, kalit B saqlandi)
  { id: 'a4',  type: 'practice', template: 'custom',   scored: false, scope: null }, // F-1015-337: wow effekt (JS) — testdan keyin
""")
rep("  const screens = [Screen0, Screen1, ScreenPrompt, ScreenIteratsiya, ScreenBolim, Screen7, ScreenPodium, Screen16];",
    "  const screens = [Screen0, Screen1, ScreenPrompt, ScreenIteratsiya, ScreenBolim, Screen7, ScreenWow, ScreenPodium, Screen16];")
rep("""tr({ uz: "Copilot taklifini o'qib, keyin qabul qilasiz", ru: 'Подсказку Copilot сначала читаете, потом принимаете' })];""",
    """tr({ uz: "Copilot taklifini o'qib, keyin qabul qilasiz", ru: 'Подсказку Copilot сначала читаете, потом принимаете' }), tr({ uz: "Murakkab effektni AI yozadi — siz uni aniq tasvirlaysiz", ru: 'Сложный эффект пишет AI — вы точно его описываете' })];""")

# ---------- 5. CSS ----------
rep("        .pm-ft { text-align: center; font-size: 10.5px; color: #475569; padding-top: 2px; }\n", r"""        .pm-ft { text-align: center; font-size: 10.5px; color: #475569; padding-top: 2px; }
        /* ===== F-1015-337 · reja bitta kartada + wow effektlari (sinflar izohda backtiksiz) ===== */
        .am-reja-k { gap: 10px; }
        .am-chiziq { border: none; border-top: 1px solid ${T.line}; margin: 4px 0; }
        .lesson-root .am-blok-qator { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .am-blok-qator li { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 15px; color: ${T.ink}; }
        .pm-hero { position: relative; overflow: hidden; }
        .pm-hero > :not(.pm-fonqat) { position: relative; z-index: 1; }
        .pm-fonqat { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .pm-zarra { position: absolute; border-radius: 50%; background: currentColor; opacity: 0.45; animation: pm-suz 6s ease-in-out infinite alternate; }
        @keyframes pm-suz { from { transform: translate(0, 0); } to { transform: translate(18px, -22px); } }
        .pm-konf { position: absolute; top: -10px; width: 7px; height: 11px; border-radius: 2px; animation: pm-tush 1.6s cubic-bezier(.25,.6,.4,1) both; transform: rotate(var(--r)); }
        .pm-konf0 { background: #facc15; } .pm-konf1 { background: #f472b6; } .pm-konf2 { background: #34d399; } .pm-konf3 { background: #fff; }
        @keyframes pm-tush { from { transform: translateY(0) rotate(var(--r)); opacity: 1; } to { transform: translateY(190px) rotate(calc(var(--r) + 220deg)); opacity: 0; } }
        .pm-taymer { display: flex; gap: 6px; }
        .pm-taymer span { display: flex; flex-direction: column; align-items: center; min-width: 42px; padding: 5px 6px; border-radius: 9px; background: rgba(15,23,42,0.28); }
        .pm-sodda .pm-taymer span { background: rgba(15,23,42,0.08); }
        .pm-taymer b { font: 800 15px 'JetBrains Mono', monospace; } .pm-taymer small { font-size: 9.5px; font-weight: 700; opacity: 0.9; }
        .pm-tugma-btn { border: none; cursor: pointer; font-family: inherit; }
        .pm-tugma-btn:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
        .pm-egil .pm-karta { transition: transform 0.15s ease-out; animation: pm-tebran 3.2s ease-in-out infinite; transform-style: preserve-3d; }
        .pm-egil .pm-karta:nth-child(2) { animation-delay: 0.6s; } .pm-egil .pm-karta:nth-child(3) { animation-delay: 1.2s; }
        .pm-egil .pm-karta:hover { animation: none; }
        @keyframes pm-tebran { 0%, 100% { transform: perspective(500px) rotateY(0) rotateX(0); } 30% { transform: perspective(500px) rotateY(14deg) rotateX(-6deg) translateY(-3px); } 60% { transform: perspective(500px) rotateY(-10deg) rotateX(5deg); } }
        @media (prefers-reduced-motion: reduce) { .pm-zarra, .pm-konf, .pm-egil .pm-karta { animation: none; } .pm-konf { display: none; } }
""")
open(P, 'w', encoding='utf-8').write(s)
print('OK', len(s.splitlines()))
