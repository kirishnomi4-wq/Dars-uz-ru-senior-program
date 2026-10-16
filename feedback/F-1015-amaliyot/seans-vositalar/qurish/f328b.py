#!/usr/bin/env python3
# F-1015-329 · DeployLesson 12 → 11: a1 maketsiz · «bosh sahifa fayli» testi va kartochkalar olinadi · YANGI a3 «Scroll animatsiyasi» (a2 dan keyin). f328.py dan keyin, bir marta.
import sys
R = sys.argv[1]
P = R + '/src/1-Modull/DeployLesson.jsx'
s = open(P, encoding='utf-8').read()

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

rep("//        papkani sudrab tashlash → havola. 17 → 12 ekran (foydalanuvchi bilan sahifama-sahifa, 16.10).",
    "//        papkani sudrab tashlash → havola. 17 → 11 ekran (foydalanuvchi bilan sahifama-sahifa, 16.10; F-1015-329: scroll-amaliyot, test/kartochka kamaydi).")

# ---------- SCREEN_META: 11 ekran ----------
rep("""  { id: 'aanim',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's1',     type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',     type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',     type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'sdrop',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's12',    type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's14b',   type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcard',   template: 'custom',   scored: false, scope: null },
  { id: 's16',    type: 'summary',     template: 'custom',   scored: false, scope: null }""",
"""  { id: 'aanim',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'ascroll', type: 'practice',   template: 'custom',   scored: false, scope: null }, // F-1015-329: scroll animatsiyasi (CSS Praktikadagi oxirgi darabotka kabi)
  { id: 's1',     type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',     type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'sdrop',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's12',    type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's14b',   type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 's16',    type: 'summary',     template: 'custom',   scored: false, scope: null }""")

# ---------- kalitlar, nishon, recap, podium ----------
rep("const INLINE_KEYS = { s2: 0, s6: 2, s12: 3 };", "const INLINE_KEYS = { s2: 0, s12: 3 }; // F-1015-329: s6 («bosh sahifa fayli») olindi —")
rep("  filefind: { icon: '📄', name: 'File Finder!', desc: { uz: 'Bosh sahifa qaysi fayl ekanini bildingiz', ru: 'Вы узнали, какой файл является главной страницей' } },\n", "")
rep("const ACH_TRIGGERS = { s2: 'hostpick', s6: 'filefind', s12: 'shipit' };", "const ACH_TRIGGERS = { s2: 'hostpick', s12: 'shipit' }; // F-1015-329: s6 testi bilan filefind olindi;")
cut("  // idx 6 — s6: «Brauzer birinchi qaysi faylni qidiradi?»", "};\n\n// Overlay — ekran ustida", "")
rep("  // idx 5 — s2: «Netlify nima qiladi?» (F-1015-328: Netlify tushuntirishidan keyin)\n  5: {", "  // idx 6 — s2: «Netlify nima qiladi?» (F-1015-329: Netlify tushuntirishidan keyin)\n  6: {")
rep("Q_LABELS = { 5: { uz: 'Netlify vazifasi', ru: 'Задача Netlify' }, 6: { uz: 'Bosh sahifa fayli', ru: 'Файл главной страницы' }, 8: { uz: 'Havola (yakuniy)', ru: 'Ссылка (финал)' } };",
    "Q_LABELS = { 6: { uz: 'Netlify vazifasi', ru: 'Задача Netlify' }, 8: { uz: 'Havola (yakuniy)', ru: 'Ссылка (финал)' } };")

# ---------- a1: o'ngdagi sayt rasmi olinadi (foydalanuvchi: «rasmi ortiqcha») ----------
rep("""            <Qadamlar b={A1} cls="fade-up delay-2" />
            <p className="flow-label">{tr({ uz: 'Saytingiz uslubi · namuna', ru: 'Стиль вашего сайта · образец' })}</p>
            <Zoomable><DemoSahifa holat="uslub" uslub={demo.d.uslub || USLUB_STD} /></Zoomable>""",
    """            <Qadamlar b={A1} cls="fade-up delay-2" />""")

# ---------- s6 testi olinadi ----------
cut("// ===== SCREEN 6 — TEST 2 =====", "// ===== SCREEN DROP —", "")

# ---------- kartochkalar olinadi ----------
cut("// 🃏 FLASHCARDS — aktiv takrorlash", "// Uyga vazifa (F-1015-328:", "")
rep("""  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
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
  });""", """  // F-1015-329: kartochkalar ekrani olindi (foydalanuvchi qarori)
  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));""")

# ---------- YANGI a3: scroll animatsiyasi ----------
SCROLL = r"""// ===== a3 — SCROLL ANIMATSIYASI (F-1015-329): CSS Praktikadagi oxirgi darabotka kabi — sayt pastga aylantirilganda jonlanadi =====
// Maketda effekt JS bilan chiziladi (har brauzerda ko'rinsin); o'quvchiga prompt — sof CSS (animation-timeline), JavaScript'siz.
const SCROLLS = [
  { id: 'paydo', name: { uz: "Scroll'da paydo bo'lish", ru: 'Появление при скролле' }, sub: { uz: "bo'limlar yonidan suzib chiqadi", ru: 'блоки выплывают сбоку' },
    p: { uz: "Sahifani pastga aylantirganda har bo'lim va karta ekranga kirayotganda chapdan suzib chiqsin: shaffofdan ko'rinishga, 40px chapdan joyiga. animation-timeline: view() bilan yoz.", ru: 'При прокрутке вниз каждый блок и карточка, входя в экран, выплывают слева: из прозрачного в видимое, с 40px левее на место. Пиши через animation-timeline: view().' } },
  { id: 'fon', name: { uz: 'Rang almashuvchi fon', ru: 'Меняющийся фон' }, sub: { uz: "pastga tushgan sari fon o'zgaradi", ru: 'фон меняется при прокрутке' },
    p: { uz: "Sahifani pastga aylantirgan sari sahifa (body) foni asta boshqa rangga o'tsin: tepada hozirgi fon, eng pastda urg'u rangimning juda och tusi. animation-timeline: scroll() bilan yoz.", ru: 'При прокрутке вниз фон страницы (body) плавно меняет цвет: сверху — текущий фон, в самом низу — очень светлый оттенок моего акцентного цвета. Пиши через animation-timeline: scroll().' } },
  { id: 'chiziq', name: { uz: "O'qish chizig'i", ru: 'Полоса чтения' }, sub: { uz: "tepadagi chiziq to'lib boradi", ru: 'полоса сверху заполняется' },
    p: { uz: "Sahifa tepasida qotib turadigan ingichka (4px) chiziq bo'lsin: pastga aylantirgan sari chapdan o'ngga to'lib borsin, rangi — urg'u rangim. Chiziqni body::before orqali qil, animation-timeline: scroll() bilan.", ru: 'Вверху страницы — закреплённая тонкая (4px) полоса: при прокрутке вниз заполняется слева направо, цвет — мой акцентный. Сделай её через body::before и animation-timeline: scroll().' } },
  { id: 'parallaks', name: { uz: 'Parallaks', ru: 'Параллакс' }, sub: { uz: 'rasm matndan sekinroq siljiydi', ru: 'картинка движется медленнее текста' },
    p: { uz: "Pastga aylantirganda bosh qism (hero) rasmi va foni matndan sekinroq siljisin — chuqurlik hissi bo'lsin. animation-timeline: scroll() bilan yoz.", ru: 'При прокрутке картинка и фон главного блока (hero) движутся медленнее текста — появляется глубина. Пиши через animation-timeline: scroll().' } },
];
const A3 = {
  qadamlar: [
    { uz: "«Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi `{…}` o'rniga `index.html` va `style.css` kodingizni qo'ying.", ru: '«Скопировать промпт» → вставьте в Gemini, вместо `{…}` в конце — код `index.html` и `style.css`.' },
    { uz: "Javobdagi kodni `style.css` ga qo'ying (bor kod o'rniga), `Ctrl+S`.", ru: 'Вставьте код из ответа в `style.css` (вместо старого), `Ctrl+S`.' },
    { uz: "Saytni Chrome'da oching va sekin pastga aylantiring: effekt namunadagidek ishlayaptimi? Ishlamasa, Gemini'ga yozing: «scroll animatsiyasi ishlamayapti, tuzat».", ru: 'Откройте сайт в Chrome и медленно прокрутите вниз: эффект работает, как в образце? Если нет, напишите Gemini: «анимация при скролле не работает, исправь».' }
  ]
};
const ScrollMaket = ({ tur, uslub }) => {
  const ref = useRef(null);
  const [sp, setSp] = useState(0); const [sy, setSy] = useState(0); const [kor, setKor] = useState(() => new Set([0]));
  const olch = () => {
    const el = ref.current; if (!el) return;
    const max = Math.max(1, el.scrollHeight - el.clientHeight);
    setSp(Math.min(1, el.scrollTop / max)); setSy(el.scrollTop);
    const cb = el.getBoundingClientRect().bottom;
    const n = new Set(); el.querySelectorAll('[data-sb]').forEach(b => { if (b.getBoundingClientRect().top < cb - 30) n.add(Number(b.dataset.sb)); });
    setKor(n);
  };
  useEffect(() => { // namuna o'zi sekin pastga-tepaga aylanadi (harakatni yoqtirmaydiganlarda — yo'q, qo'lda aylantiriladi)
    const el = ref.current; if (!el) return;
    el.scrollTop = 0; olch();
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let dir = 1, t = setInterval(() => { const max = el.scrollHeight - el.clientHeight; el.scrollTop += dir * 2; if (el.scrollTop >= max - 1) dir = -1; else if (el.scrollTop <= 0) dir = 1; }, 30);
    return () => clearInterval(t);
  }, [tur]);
  const blok = (i, body) => <div key={i} data-sb={i} className={`sm-blok ${kor.has(i) ? 'kor' : ''}`}>{body}</div>;
  return (
    <div className={`ds ds-${uslub || USLUB_STD} smt-${tur || 'yoq'}`} style={{ '--sp': sp, '--sy': sy }}>
      <div className="ds-bar"><span className="bb-dots"><i /><i /><i /></span><span className="ds-url">mening-saytim · scroll</span></div>
      <div className="ds-body sm-oyna" ref={ref} onScroll={olch}>
        <i className="sm-chiziq" aria-hidden="true" />
        <div className="ds-hd"><span className="ds-logo"><i className="ds-mark" aria-hidden="true" />{tr({ uz: "To'garak jadvali", ru: 'Расписание кружков' })}</span><span className="ds-nav"><span>{tr({ uz: 'Jadval', ru: 'Расписание' })}</span><span>{tr({ uz: 'Aloqa', ru: 'Контакты' })}</span></span></div>
        <div className="ds-hero sm-hero">
          <div className="ds-hero-t"><p className="ds-h1">{tr({ uz: "To'garak jadvali endi telefoningizda", ru: 'Расписание кружков теперь в телефоне' })}</p><p className="ds-p">{tr({ uz: "Jadval faqat devorda edi — endi uni uydan ham ko'rasiz.", ru: 'Расписание висело только на стене — теперь его видно и из дома.' })}</p></div>
          <div className="sm-ill"><DsIll /></div>
        </div>
        {[0, 1].map(r => blok(r + 1, <div className="ds-kartalar">{DS_AFZAL.map((k, i) => <div key={i} className="ds-karta"><span className="ds-bub"><DsIkon t={k.ic} /></span><p className="ds-h2">{tr(k.h)}</p><p className="ds-p">{tr(k.p)}</p></div>)}</div>))}
        {blok(3, <div className="sm-jadval">{DS_JADVAL.map((j, i) => <div key={i} className="sm-qator"><i style={{ background: j.c }} /><b>{tr(j.t)}</b><span>{j.v} · {tr(j.x)}</span></div>)}</div>)}
        <div className="ds-ft">{tr({ uz: "To'garak jadvali · 2026", ru: 'Расписание кружков · 2026' })}</div>
      </div>
    </div>
  );
};
const ScreenScroll = ({ screen, onNext, onPrev }) => {
  const demo = useDemo();
  const tanlov = (demo.d.deploy && demo.d.deploy.scroll) || null;
  const tanla = (id) => demo.set({ deploy: { ...(demo.d.deploy || {}), scroll: id } });
  const a = SCROLLS.find(x => x.id === tanlov);
  const matn = a ? tr({ uz: `Saytimga scroll animatsiyasini qo'sh — faqat style.css'ni o'zgartir, HTML'ni o'zgartirma, JavaScript ishlatma, bor dizaynimni buzma.\n${a.p.uz}\nHarakatni yoqtirmaydiganlar uchun @media (prefers-reduced-motion: reduce) ichida animatsiya o'chsin.\nO'zgargan style.css ni to'liq qaytar.\nMana kodim: {index.html va style.css kodini shu yerga qo'ying}`, ru: `Добавь на мой сайт анимацию при прокрутке — меняй только style.css, HTML не трогай, JavaScript не используй, мой дизайн не ломай.\n${a.p.ru}\nДля тех, кто не любит движение, в @media (prefers-reduced-motion: reduce) анимация отключается.\nВерни изменённый style.css целиком.\nВот мой код: {вставьте сюда код index.html и style.css}` }) : null;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 3 · scroll', ru: 'Практика 3 · скролл' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: 'Sayt pastga aylantirilganda jonlansin.', ru: 'Пусть сайт оживает при прокрутке.' })}</h2></div>
        <Split>
          <Col>
            <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Scroll effekti', ru: 'Эффект прокрутки' })}</p>
              <div className="am-uslub">{SCROLLS.map(x => <button key={x.id} type="button" className={`am-uslub-btn ${tanlov === x.id ? 'on' : ''}`} onClick={() => tanla(x.id)}><b>{tr(x.name)}</b><span>{tr(x.sub)}</span></button>)}</div>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(tanlov ? { uz: "Namuna o'zi aylanadi — sichqoncha bilan o'zingiz ham aylantiring.", ru: 'Образец прокручивается сам — можно прокрутить и мышкой.' } : { uz: "Bittasini tanlang — o'ngdagi namunada ko'rasiz, keyin prompt ochiladi.", ru: 'Выберите один — увидите в образце справа, затем откроется промпт.' })}</p>
            </div>
            {matn && <div className="am-ochil"><PromptBlok matn={matn} /></div>}
            {matn && <Qadamlar b={A3} cls="am-ochil" />}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Saytingiz · namuna', ru: 'Ваш сайт · образец' })}</p>
            <ScrollMaket tur={tanlov} uslub={demo.d.uslub} />
            <p className="small am-osti">{tr({ uz: "Bu effekt — faqat CSS: Chrome va Edge'da ishlaydi.", ru: 'Этот эффект — только CSS: работает в Chrome и Edge.' })}</p>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

"""
rep("// ===== SCREEN DROP —", SCROLL + "// ===== SCREEN DROP —")

# ---------- yakun: takrorlash ----------
rep("    { uz: 'Saytni CSS animatsiya bilan jonlantirish', ru: 'Оживление сайта CSS-анимацией' },",
    "    { uz: 'Saytni CSS animatsiya va scroll effekti bilan jonlantirish', ru: 'Оживление сайта CSS-анимацией и эффектом прокрутки' },")

# ---------- root ----------
rep("  const screens = [Screen0, ScreenReja, ScreenSahifalar, ScreenAnimatsiya, Screen1, Screen2, Screen6, ScreenDrop, Screen12, ScreenPodium, ScreenFlashcards, Screen16];",
    "  const screens = [Screen0, ScreenReja, ScreenSahifalar, ScreenAnimatsiya, ScreenScroll, Screen1, Screen2, ScreenDrop, Screen12, ScreenPodium, Screen16];")

# ---------- CSS: scroll maketi ----------
SCSS = r"""        /* ===== F-1015-329 · a3 scroll maketi: --sp (0..1) va --sy (px) — JS o'lchaydi; tur sinfi o'ramda: smt-paydo, smt-fon, smt-chiziq, smt-parallaks ===== */
        .sm-oyna { position: relative; height: 300px; overflow-y: auto; scrollbar-width: thin; }
        .sm-chiziq { display: none; position: sticky; top: 0; z-index: 3; height: 4px; margin-bottom: -4px; width: calc(var(--sp) * 100%); background: var(--ds-acc); }
        .smt-chiziq .sm-chiziq { display: block; }
        .sm-hero { position: relative; overflow: hidden; }
        .sm-ill { flex: 0 1 40%; min-width: 130px; max-width: 220px; margin: 0 auto; } .sm-ill .ds-svg { max-width: 100%; min-width: 0; }
        .sm-blok .ds-kartalar { padding-top: 8px; }
        .sm-jadval { display: flex; flex-direction: column; gap: 8px; padding: 6px 16px 16px; }
        .sm-qator { display: flex; align-items: center; gap: 10px; background: var(--ds-card); border: 1px solid var(--ds-line); border-radius: 10px; padding: 9px 12px; font-size: 11.5px; color: var(--ds-ink); }
        .sm-qator i { width: 4px; align-self: stretch; border-radius: 2px; } .sm-qator span { margin-left: auto; color: var(--ds-mut); }
        .smt-paydo .sm-blok { opacity: 0; transform: translateX(-40px); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(.2,.7,.3,1); }
        .smt-paydo .sm-blok.kor { opacity: 1; transform: none; }
        .smt-fon .sm-oyna { background: color-mix(in srgb, var(--ds-bg), var(--ds-acc) calc(var(--sp) * 28%)); }
        .smt-parallaks .sm-ill { transform: translateY(calc(var(--sy) * 0.45px)); }
        @media (prefers-reduced-motion: reduce) { .smt-paydo .sm-blok { transition: none; } }
"""
rep("      `}</style>", SCSS + "      `}</style>")

open(P, 'w', encoding='utf-8').write(s)
print('OK', len(s.splitlines()), 'qator')
