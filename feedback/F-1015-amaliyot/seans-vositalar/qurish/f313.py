F='/home/kali/Desktop/internetLesson/src/1-Modull/CssPractice.jsx'
S=open(F,encoding='utf8').read()
def one(a):
    n=S.count(a); assert n==1,(n,a[:110]); return S.index(a)
def cut(start,end,new):
    global S; i=one(start); j=S.index(end,i); S=S[:i]+new+S[j:]
def rep(a,b):
    global S; one(a); S=S.replace(a,b)

# ---------- useDemo: eski g'oya olinmaydi (F-1015-313) ----------
cut("// O'quvchi g'oyasi (muammo, yechim) — yo'q bo'lsa namuna (bankdagi birinchi)","// ----- Namuna kodlari", r"""// ccDemoDay — uslub va shu darsda yozilgan loyiha (css: { nom, muammo, talab }); eski muammo/yechim o'qilmaydi (F-1015-313)
const useDemo = () => {
  const [d, setD] = useState(() => demoRead() || {});
  const set = (patch) => { demoWrite(patch); setD(demoRead() || {}); };
  return { d, set };
};
const USLUB_STD = 'yorqin'; // tanlanmaguncha maket va prompt — rangli «Yorqin» (F-1015-313: «haqiqiy, rangli sayt»)

""")
# IDEA_BANK endi ishlatilmaydi
cut("// G'oya-bank — VsCodeLesson dagi bilan AYNAN","// Uslublar — DeployLesson dagi bilan AYNAN","")

# ---------- DemoSahifa: haqiqiy rangli landing ----------
cut("// ----- Bitta vizual: Demo Day bosh sahifasi — DOIM namuna","// ===== SCREEN 0 — KIRISH", r"""// ----- Bitta vizual: Demo Day bosh sahifasi — DOIM namuna, haqiqiy rangli landing (F-1015-313), 3 holat × 4 uslub -----
const DS_AFZAL = [
  { ic: 'kal', h: { uz: 'Jadval', ru: 'Расписание' }, p: { uz: "Hamma to'garak vaqti bitta sahifada.", ru: 'Время всех кружков на одной странице.' } },
  { ic: 'pin', h: { uz: 'Manzil', ru: 'Адрес' }, p: { uz: "Qaysi xonada bo'lishini bilasiz.", ru: 'Знаете, в каком кабинете занятие.' } },
  { ic: 'tel', h: { uz: 'Telefonda', ru: 'В телефоне' }, p: { uz: "Uydan ham, yo'lda ham ochiladi.", ru: 'Открывается и дома, и в дороге.' } },
];
const DS_JADVAL = [
  { t: { uz: 'Robototexnika', ru: 'Робототехника' }, v: '15:00', x: { uz: '204-xona', ru: 'каб. 204' }, c: '#2563eb' },
  { t: { uz: 'Shaxmat', ru: 'Шахматы' }, v: '16:30', x: { uz: '112-xona', ru: 'каб. 112' }, c: '#d97706' },
  { t: { uz: 'Futbol', ru: 'Футбол' }, v: '17:00', x: { uz: 'Stadion', ru: 'Стадион' }, c: '#16a34a' },
];
const DsIkon = ({ t }) => (
  <svg className="ds-ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {t === 'kal' && <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>}
    {t === 'pin' && <><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>}
    {t === 'tel' && <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>}
  </svg>
);
const DemoSahifa = ({ holat = 'uslub', uslub = USLUB_STD, halqa = null }) => {
  const cls = ['ds', holat === 'xom' ? 'ds-xom' : `ds-${uslub}`, holat === 'rang' ? 'ds-rang' : ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <div className="ds-bar"><span className="bb-dots"><i /><i /><i /></span><span className="ds-url">mening-saytim · Live Server</span></div>
      <div className="ds-body">
        <div className="ds-hd">
          <span className="ds-logo"><i className="ds-mark" aria-hidden="true" />{tr({ uz: "To'garak jadvali", ru: 'Расписание кружков' })}</span>
          <span className="ds-nav"><span>{tr({ uz: 'Jadval', ru: 'Расписание' })}</span><span>{tr({ uz: 'Aloqa', ru: 'Контакты' })}</span></span>
          <span className="ds-cta">{tr({ uz: 'Kirish', ru: 'Войти' })}</span>
        </div>
        <div className={`ds-hero ${halqa === 'hero' ? 'ds-halqa' : ''}`}>
          <div className="ds-hero-t">
            <p className="ds-tag">{tr({ uz: "Maktab to'garaklari · 2026", ru: 'Школьные кружки · 2026' })}</p>
            <p className="ds-h1">{tr({ uz: "To'garak jadvali endi telefoningizda", ru: 'Расписание кружков теперь в телефоне' })}</p>
            <p className="ds-p">{tr({ uz: "Jadval faqat devorda edi — endi uni uydan ham ko'rasiz.", ru: 'Расписание висело только на стене — теперь его видно и из дома.' })}</p>
            <div className="ds-btns"><span className="ds-tugma">{tr({ uz: "Jadvalni ko'rish", ru: 'Открыть расписание' })}</span><span className="ds-tugma2">{tr({ uz: 'Batafsil', ru: 'Подробнее' })}</span></div>
          </div>
          <div className="ds-ill" aria-hidden="true">
            <p className="ds-ill-h">{tr({ uz: 'Bugun · Dushanba', ru: 'Сегодня · Понедельник' })}</p>
            {DS_JADVAL.map((r, i) => <div key={i} className="ds-row"><i style={{ background: r.c }} /><span className="ds-row-t">{tr(r.t)}</span><span className="ds-row-v">{r.v} · {tr(r.x)}</span></div>)}
          </div>
        </div>
        <div className={`ds-kartalar ${halqa === 'karta' ? 'ds-halqa' : ''}`}>
          {DS_AFZAL.map((k, i) => <div key={i} className="ds-karta"><span className="ds-bub"><DsIkon t={k.ic} /></span><p className="ds-h2">{tr(k.h)}</p><p className="ds-p">{tr(k.p)}</p></div>)}
        </div>
        <div className="ds-ft">{tr({ uz: "To'garak jadvali · 2026", ru: 'Расписание кружков · 2026' })}</div>
      </div>
    </div>
  );
};

""")
rep("""<DemoSahifa holat="uslub" uslub={demo.d.uslub || 'minimal'} /></Col>""","""<DemoSahifa holat="uslub" uslub={demo.d.uslub || USLUB_STD} /></Col>""")

# ---------- Reja: «Avval tayyorlaning» — alohida, ko'zga tashlanadigan karta; g'oya-banki olinadi ----------
cut("// ===== SCREEN 1 — REJA","// ===== a1 · a2 · a3", r"""// ===== SCREEN 1 — REJA (QReja): chapda natija namunasi · o'ngda «Avval tayyorlaning» (alohida karta) + 3 blok =====
const REJA_BLOK = [
  { t: { uz: 'Loyiha va bosh sahifa', ru: 'Проект и главная страница' }, tag: 'HTML' },
  { t: { uz: 'Dizayn', ru: 'Дизайн' }, tag: { uz: 'uslub', ru: 'стиль' } },
  { t: { uz: "O'z rangingiz", ru: 'Ваш цвет' }, tag: 'Ctrl+H' }
];
const TAYYOR = [
  { uz: <>Ish stolida <span className="qcode">mening-saytim</span> papkasini yarating va VS Code'da oching.</>, ru: <>Создайте на рабочем столе папку <span className="qcode">mening-saytim</span> и откройте её в VS Code.</> },
  { uz: <>Ichida <span className="qcode">index.html</span> va <span className="qcode">style.css</span> yarating; <span className="qcode">index.html</span> da <span className="qcode">!</span> + Tab, Go Live.</>, ru: <>Создайте внутри <span className="qcode">index.html</span> и <span className="qcode">style.css</span>; в <span className="qcode">index.html</span> — <span className="qcode">!</span> + Tab, Go Live.</> },
  { uz: "Boshqa oynada gemini.google.com'ni oching.", ru: 'В другом окне откройте gemini.google.com.' }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const demo = useDemo();
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun Demo Day saytingizni <span className="italic" style={{ color: T.accent }}>boshlaysiz</span></>, ru: <>Сегодня вы <span className="italic" style={{ color: T.accent }}>начинаете</span> сайт для Demo Day</> })}</h2></div>
        <Mentor>{tr({ uz: <>Bugun bosh sahifa: HTML'ni Gemini tez yozadi, asosiy vaqt — dizaynga. Qolgan sahifalar — Netlify darsida.</>, ru: <>Сегодня — главная страница: HTML быстро пишет Gemini, основное время — на дизайн. Остальные страницы — на уроке Netlify.</> })}</Mentor>
        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: 'Dars oxirida · namuna', ru: 'К концу урока · образец' })}</p>
            <DemoSahifa holat="uslub" uslub={demo.d.uslub || USLUB_STD} />
          </Col>
          <Col>
            <div className="am-tayyor fade-up delay-1">
              <p className="am-tayyor-h">{tr({ uz: 'Avval tayyorlaning', ru: 'Сначала подготовьтесь' })}</p>
              <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>{tr(x)}</span></li>)}</ol>
              <p className="am-tayyor-s">{tr({ uz: "Tayyor bo'lsa — «Davom etish».", ru: 'Готово — «Продолжить».' })}</p>
            </div>
            <p className="flow-label" style={{ marginTop: 6 }}>{tr({ uz: 'Bugungi 3 blok', ru: '3 блока сегодня' })}</p>
            <ol className="roadmap">{REJA_BLOK.map((s, i) => (<li key={i} className="step-card fade-up" style={{ animationDelay: `${0.08 + i * 0.05}s` }}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><span className="step-body"><span className="step-text">{tr(s.t)}</span><span className="step-tag">{tr(s.tag)}</span></span></li>))}</ol>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

""")

# ---------- a1: forma → prompt yig'iladi; a1/a2 bosqichma-bosqich ochiladi ----------
rep("""    eyebrow: { uz: 'Amaliyot 1 · HTML', ru: 'Практика 1 · HTML' },
    title: { uz: "Bosh sahifaning HTML'ini Gemini'ga yozdiring.", ru: 'Пусть Gemini напишет HTML главной страницы.' },""",
"""    eyebrow: { uz: 'Amaliyot 1 · HTML', ru: 'Практика 1 · HTML' },
    title: { uz: "Loyihangizni yozing — Gemini HTML'ni quradi.", ru: 'Опишите проект — Gemini соберёт HTML.' },
    forma: true,""")
i=one("    prompt: (m, y) => ({ uz: `Demo Day loyiham uchun bosh sahifa"); j=S.index("\n",i)
S=S[:i]+r"""    prompt: (p) => ({ uz: `Demo Day loyiham — «${p.nom}» — uchun bosh sahifa: index.html'ni yoz.\nMuammo: ${p.muammo}.\nSaytda bo'lsin: ${p.talab}.\nTuzilishi:\n– tepada: chapda sayt nomi, o'ngda menyu (Bosh sahifa, Aloqa) va bitta tugma;\n– bosh qism: kichik yozuv, katta sarlavha (saytim nima qilishini aytsin), muammo haqida bitta gap, ikki tugma;\n– 3 ta karta: talablarimdan 3 tasi, har birida qisqa sarlavha va bitta gap;\n– eng pastda footer: sayt nomi va yil.\nHar qismga tushunarli class nomi ber: header, hero, kartalar, karta, footer.\nstyle.css <link> bilan ulangan bo'lsin. CSS yozma, faqat HTML. To'liq faylni qaytar.`, ru: `Напиши index.html — главную страницу моего проекта для Demo Day «${p.nom}».\nПроблема: ${p.muammo}.\nНа сайте должно быть: ${p.talab}.\nСтруктура:\n– вверху: слева название сайта, справа меню (Главная, Контакты) и одна кнопка;\n– главный блок: маленькая надпись, крупный заголовок (что делает мой сайт), одна фраза о проблеме, две кнопки;\n– 3 карточки: 3 моих требования, в каждой короткий заголовок и одна фраза;\n– внизу footer: название сайта и год.\nДай частям понятные class: header, hero, kartalar, karta, footer.\nПодключи style.css через <link>. CSS не пиши, только HTML. Верни файл целиком.` }),"""+S[j:]
rep("""    prompt: (m, y, st) => {""","""    prompt: (p, st) => {""")
rep("""const PromptBlok = ({ matn }) => {""","""const LOYIHA_MAYDON = [
  { k: 'nom', l: { uz: 'Loyihangiz nomi', ru: 'Название проекта' }, ph: { uz: "masalan: To'garak jadvali", ru: 'например: Расписание кружков' } },
  { k: 'muammo', l: { uz: 'Qanday muammoni hal qiladi?', ru: 'Какую проблему решает?' }, ph: { uz: "masalan: jadval faqat devorda — uydan ko'rib bo'lmaydi", ru: 'например: расписание только на стене — из дома не посмотришь' } },
  { k: 'talab', l: { uz: "Saytda nima bo'lsin? (talablaringiz)", ru: 'Что должно быть на сайте? (ваши требования)' }, ph: { uz: "masalan: to'garaklar jadvali, xona raqami, ustoz ismi", ru: 'например: расписание кружков, номер кабинета, имя учителя' } },
];
const PromptBlok = ({ matn, tayyor }) => {""")
rep("""      <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Prompt', ru: 'Промпт' })}</p><button""","""      {tayyor && <p className="am-tayyor-ok">{tr(tayyor)}</p>}
      <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Prompt', ru: 'Промпт' })}</p><button""")
cut("const ScreenAmaliyot = ({ screen, onNext, onPrev }) => {","// ===== s16 — TOPSHIRISH", r"""const ScreenAmaliyot = ({ screen, onNext, onPrev }) => {
  const b = AMALIYOT[SCREEN_META[screen].id];
  const demo = useDemo();
  const uslub = demo.d.uslub || USLUB_STD;
  const st = STYLES.find(s => s.id === uslub) || STYLES[0];
  const css = demo.d.css || {};
  const [lp, setLp] = useState({ nom: css.nom || '', muammo: css.muammo || '', talab: css.talab || '' });
  const yoz = (k, v) => { const n = { ...lp, [k]: v }; setLp(n); demo.set({ css: n, ...(n.nom.trim() && n.muammo.trim() ? { yechim: n.nom.trim(), muammo: n.muammo.trim() } : {}) }); };
  const toliq = LOYIHA_MAYDON.every(m => lp[m.k].trim().length >= 3);
  // F-1015-313: bosqichma-bosqich — a1: forma to'lgach prompt va qadamlar; a2: uslub tanlangach
  const ochiq = b.forma ? toliq : b.uslubTanlov ? !!demo.d.uslub : true;
  const matn = b.prompt && ochiq ? tr(b.forma ? b.prompt({ nom: lp.nom.trim(), muammo: lp.muammo.trim(), talab: lp.talab.trim() }) : b.prompt(null, st)) : null;
  return (
    <Stage eyebrow={tr(b.eyebrow)} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(b.title)}</h2></div>
        <Split>
          <Col>
            {b.forma && <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Loyihangiz', ru: 'Ваш проект' })}</p>
              {LOYIHA_MAYDON.map(m => <label key={m.k} className="am-maydon"><span>{tr(m.l)}</span><input className="text-input" value={lp[m.k]} placeholder={tr(m.ph)} onChange={e => yoz(m.k, e.target.value)} /></label>)}
              {!toliq && <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "Uchala qatorni to'ldiring — prompt shu zahoti tayyor bo'ladi.", ru: 'Заполните три строки — промпт сразу будет готов.' })}</p>}
            </div>}
            {b.uslubTanlov && <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Uslub', ru: 'Стиль' })}</p>
              <div className="am-uslub">{STYLES.map(s => <button key={s.id} type="button" className={`am-uslub-btn ${demo.d.uslub === s.id ? 'on' : ''}`} onClick={() => demo.set({ uslub: s.id })}><b>{tr(s.name)}</b><span>{tr(s.sub)}</span></button>)}</div>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(demo.d.uslub ? { uz: 'Har kim boshqa uslub tanlasa, sinfda bir xil sayt chiqmaydi.', ru: 'Если каждый выберет свой стиль, в классе не будет одинаковых сайтов.' } : { uz: "Uslubni tanlang — keyin prompt va qadamlar ochiladi.", ru: 'Выберите стиль — затем откроются промпт и шаги.' })}</p>
            </div>}
            {ochiq && matn && <div className="am-ochil"><PromptBlok matn={matn} tayyor={b.forma ? { uz: "Prompt tayyor — endi Gemini orqali quring.", ru: 'Промпт готов — теперь стройте с помощью Gemini.' } : null} /></div>}
            {ochiq && <div className="am-karta am-ochil" style={{ animationDelay: '0.12s' }}>
              <p className="flow-label">{tr({ uz: 'Qadamlar', ru: 'Шаги' })}</p>
              <ol className="am-qadam">{b.qadamlar.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(typeof x === 'function' ? x(USLUB_ACC[uslub]) : x))}</span></li>)}</ol>
              {b.yordam && <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(b.yordam)}</p>}
            </div>}
          </Col>
          <Col>
            <p className="flow-label">{tr(b.masalanYorliq ? { uz: 'Kutilgan natija · masalan', ru: 'Ожидаемый результат · например' } : { uz: 'Kutilgan natija · namuna', ru: 'Ожидаемый результат · образец' })}</p>
            <DemoSahifa holat={b.holat} uslub={uslub} halqa={b.halqa} />
            {b.osti && <p className="small am-osti">{fmtCode(tr(b.osti))}</p>}
            <div className="am-past fade-up delay-3"><span>{tr({ uz: 'Ortda qoldingizmi?', ru: 'Отстали?' })}</span><NamunaBtn kod={b.namuna} /></div>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

""")
# a1 qadamlari: 1-qadam forma haqida emas, prompt haqida (forma — tepada)
# a2 1-qadam («Uslubni tanlang») — uslub tanlangach ko'rinadi, shuning uchun olinadi
rep("""      { uz: 'Uslubni tanlang — prompt o\\'zgaradi.', ru: 'Выберите стиль — промпт изменится.' },\n""","")

# ---------- CSS ----------
cut("        .ds { border-radius: 12px;","        .ds-halqa {", r"""        .am-tayyor { background: ${T.paper}; border: 2px solid ${T.accent}; border-radius: 16px; padding: clamp(14px,2vw,18px); display: flex; flex-direction: column; gap: 10px; box-shadow: 0 10px 24px -10px rgba(255,79,40,0.35); }
        .am-tayyor-h { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(16px,2vw,19px); color: ${T.ink}; }
        .lesson-root .am-tayyor-l { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .am-tayyor-l li { display: flex; gap: 12px; align-items: flex-start; font-size: clamp(14px,1.6vw,15.5px); color: ${T.ink}; line-height: 1.5; }
        .am-tayyor-n { flex: none; width: 28px; height: 28px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; }
        .am-tayyor-s { margin: 0; font-size: 13px; color: ${T.ink2}; }
        .am-maydon { display: flex; flex-direction: column; gap: 5px; font-size: 13px; font-weight: 600; color: ${T.ink}; }
        .am-maydon .text-input { font-size: 14px; padding: 10px 12px; }
        .am-tayyor-ok { margin: 0; font-weight: 700; color: ${T.success}; font-size: 14px; }
        .am-ochil { animation: am-ochil 0.45s cubic-bezier(.2,.7,.3,1) both; }
        @keyframes am-ochil { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .am-ochil { animation: none; } }
        .ds { border-radius: 12px; overflow: hidden; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.3); font-family: 'Manrope', Arial, sans-serif; background: #fff; }
        .ds-bar { display: flex; align-items: center; gap: 10px; background: #ECE9E1; padding: 7px 12px; }
        .ds-url { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .ds-body { --ds-bg: #fff; --ds-ink: #16181d; --ds-mut: #4b5563; --ds-acc: #d4380d; --ds-acc-ink: #fff; --ds-card: #fff; --ds-line: #e8e8e8; --ds-hd: #fff; --ds-hd-ink: #16181d; --ds-hero: linear-gradient(135deg, #f8fafc, #fff1ec); --ds-bub: #fdeee9; --ds-h1: #16181d; --ds-ill: #fff; background: var(--ds-bg); color: var(--ds-ink); }
        .ds-hd { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--ds-hd); color: var(--ds-hd-ink); font-size: 11.5px; border-bottom: 1px solid var(--ds-line); }
        .ds-logo { display: inline-flex; align-items: center; gap: 6px; font-weight: 800; margin-right: auto; }
        .ds-mark { width: 14px; height: 14px; border-radius: 4px; background: var(--ds-acc); display: inline-block; }
        .ds-nav { display: flex; gap: 12px; opacity: 0.9; }
        .ds-cta { background: var(--ds-acc); color: var(--ds-acc-ink); font-weight: 700; padding: 4px 11px; border-radius: 999px; }
        .ds-hero { display: flex; gap: 14px; align-items: center; padding: 20px 16px; background: var(--ds-hero); flex-wrap: wrap; }
        .ds-hero-t { flex: 1 1 180px; min-width: 0; }
        .ds-tag { margin: 0 0 6px; font-size: 10px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ds-acc); }
        .lesson-root .ds-h1 { margin: 0 0 8px; font-size: 20px; font-weight: 800; line-height: 1.15; color: var(--ds-h1); }
        .ds-p { margin: 0; font-size: 11.5px; line-height: 1.45; color: var(--ds-mut); }
        .ds-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
        .ds-tugma { background: var(--ds-acc); color: var(--ds-acc-ink); font-size: 11.5px; font-weight: 700; padding: 7px 14px; border-radius: 999px; }
        .ds-tugma2 { border: 1.5px solid var(--ds-acc); color: var(--ds-acc); background: var(--ds-ill); font-size: 11.5px; font-weight: 700; padding: 6px 13px; border-radius: 999px; }
        .ds-ill { flex: 1 1 150px; min-width: 0; background: var(--ds-ill); border-radius: 14px; padding: 10px; box-shadow: 0 10px 24px -10px rgba(0,0,0,0.25); display: flex; flex-direction: column; gap: 7px; }
        .ds-ill-h { margin: 0 0 2px; font-size: 10.5px; font-weight: 800; color: var(--ds-ink); }
        .ds-row { display: grid; grid-template-columns: 8px minmax(0,1fr); column-gap: 7px; align-items: center; font-size: 10.5px; }
        .ds-row i { width: 8px; height: 8px; border-radius: 50%; grid-row: span 2; }
        .ds-row-t { font-weight: 700; color: var(--ds-ink); } .ds-row-v { color: var(--ds-mut); grid-column: 2; }
        .ds-kartalar { display: flex; gap: 10px; padding: 14px 16px 16px; }
        .ds-karta { flex: 1; min-width: 0; background: var(--ds-card); border: 1px solid var(--ds-line); border-radius: 12px; padding: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .ds-bub { width: 28px; height: 28px; border-radius: 9px; background: var(--ds-bub); color: var(--ds-acc); display: inline-flex; align-items: center; justify-content: center; }
        .ds-ic { width: 16px; height: 16px; }
        .ds-h2 { margin: 6px 0 2px; font-size: 12px; font-weight: 800; }
        .ds-ft { text-align: center; font-size: 10.5px; padding: 9px; border-top: 1px solid var(--ds-line); color: var(--ds-mut); }
        .ds-yorqin .ds-body { --ds-bg: #fffaf3; --ds-acc: #c2410c; --ds-hd: #1d4ed8; --ds-hd-ink: #fff; --ds-line: #f3d9bf; --ds-hero: linear-gradient(135deg, #ffedd5 0%, #fde68a 55%, #fdba74 100%); --ds-bub: #ffedd5; --ds-h1: #1e3a8a; }
        .ds-yorqin .ds-cta { background: #fff; color: #1d4ed8; }
        .ds-qorongi .ds-body { --ds-bg: #0f172a; --ds-ink: #f1f5f9; --ds-mut: #cbd5e1; --ds-acc: #34d399; --ds-acc-ink: #0f172a; --ds-card: #1e293b; --ds-line: #334155; --ds-hd: #0f172a; --ds-hd-ink: #f1f5f9; --ds-hero: radial-gradient(circle at 80% 20%, #134e4a 0%, #0f172a 60%); --ds-bub: #134e4a; --ds-h1: #f1f5f9; --ds-ill: #1e293b; }
        .ds-gradient .ds-body { --ds-bg: #fdf4ff; --ds-acc: #7e22ce; --ds-line: #f0d5f5; --ds-hd: #fdf4ff; --ds-hero: linear-gradient(135deg, #ede9fe, #fce7f3); --ds-bub: #f3e8ff; --ds-h1: #4c1d95; }
        .ds-gradient .ds-karta { border-radius: 16px; box-shadow: 0 6px 16px rgba(126,34,206,0.14); }
        .ds-rang .ds-body { --ds-acc: #15803d; --ds-bub: #dcfce7; }
        .ds-rang.ds-qorongi .ds-body { --ds-acc: #fbbf24; --ds-bub: #422006; }
        .ds-rang.ds-gradient .ds-body { --ds-acc: #be185d; --ds-bub: #fce7f3; }
        .ds-xom .ds-body { --ds-bg: #fff; --ds-ink: #000; --ds-mut: #000; --ds-acc: #000; --ds-acc-ink: #1a0dab; --ds-card: transparent; --ds-line: transparent; --ds-hd: #fff; --ds-hd-ink: #000; --ds-hero: #fff; --ds-h1: #000; --ds-ill: #fff; font-family: 'Times New Roman', serif; }
        .ds-xom .ds-hd, .ds-xom .ds-hero, .ds-xom .ds-kartalar { display: block; } .ds-xom .ds-nav { display: flex; gap: 6px; color: #1a0dab; text-decoration: underline; opacity: 1; }
        .ds-xom .ds-mark, .ds-xom .ds-bub, .ds-xom .ds-row i { display: none; } .ds-xom .ds-cta, .ds-xom .ds-tugma, .ds-xom .ds-tugma2 { background: none; border: none; padding: 0; color: #1a0dab; text-decoration: underline; font-weight: 400; }
        .ds-xom .ds-karta, .ds-xom .ds-ill { border: none; padding: 2px 0; box-shadow: none; } .ds-xom .ds-tag { color: #000; text-transform: none; letter-spacing: 0; font-weight: 400; }
        .lesson-root .ds-xom .ds-h1 { font-size: 24px; } .ds-xom .ds-row { display: block; }
""")
open(F,'w',encoding='utf8').write(S); print('ok', S.count('\n'))
