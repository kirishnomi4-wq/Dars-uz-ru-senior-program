import re
F='/home/kali/Desktop/internetLesson/src/1-Modull/CssPractice.jsx'
S=open(F,encoding='utf8').read()
def one(a):
    n=S.count(a); assert n==1,(n,a[:100]); return S.index(a)
def cut(start,end,new):
    global S; i=one(start); j=S.index(end,i); S=S[:i]+new+S[j:]
def rep(a,b):
    global S; one(a); S=S.replace(a,b)

# ---------- 1) DemoSahifa: doim namuna matn (Q1 A) + yangi landing ko'rinishi (Q2 A) ----------
cut("// ----- Bitta vizual: Demo Day bosh sahifasi","// ===== SCREEN 0 — KIRISH", r"""// ----- Bitta vizual: Demo Day bosh sahifasi — DOIM namuna (F-1015-310 Q1 A: o'quvchi matni faqat promptga), 3 holat × 4 uslub -----
const DS_AFZAL = [
  { ic: 'kal', h: { uz: 'Jadval', ru: 'Расписание' }, p: { uz: "Hamma to'garak vaqti bitta sahifada.", ru: 'Время всех кружков на одной странице.' } },
  { ic: 'pin', h: { uz: 'Manzil', ru: 'Адрес' }, p: { uz: "Qaysi xonada bo'lishini bilasiz.", ru: 'Знаете, в каком кабинете занятие.' } },
  { ic: 'tel', h: { uz: 'Telefonda', ru: 'В телефоне' }, p: { uz: "Uydan ham, yo'lda ham ochiladi.", ru: 'Открывается и дома, и в дороге.' } },
];
const DsIkon = ({ t }) => (
  <svg className="ds-ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {t === 'kal' && <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>}
    {t === 'pin' && <><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>}
    {t === 'tel' && <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>}
  </svg>
);
const DemoSahifa = ({ holat = 'uslub', uslub = 'minimal', halqa = null }) => {
  const cls = ['ds', holat === 'xom' ? 'ds-xom' : `ds-${uslub}`, holat === 'rang' ? 'ds-rang' : ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <div className="ds-bar"><span className="bb-dots"><i /><i /><i /></span><span className="ds-url">mening-saytim · Live Server</span></div>
      <div className="ds-body">
        <div className="ds-hd"><span className="ds-logo">{tr({ uz: "To'garak jadvali", ru: 'Расписание кружков' })}</span><span className="ds-nav"><span>{tr({ uz: 'Bosh sahifa', ru: 'Главная' })}</span><span>{tr({ uz: 'Aloqa', ru: 'Контакты' })}</span></span></div>
        <div className={`ds-hero ${halqa === 'hero' ? 'ds-halqa' : ''}`}>
          <p className="ds-tag">{tr({ uz: "Maktab to'garaklari · 2026", ru: 'Школьные кружки · 2026' })}</p>
          <p className="ds-h1">{tr({ uz: "To'garak jadvali endi telefoningizda", ru: 'Расписание кружков теперь в телефоне' })}</p>
          <p className="ds-p">{tr({ uz: "Jadval faqat devorda edi — endi uni uydan ham ko'rasiz.", ru: 'Расписание висело только на стене — теперь его видно и из дома.' })}</p>
          <span className="ds-tugma">{tr({ uz: 'Batafsil', ru: 'Подробнее' })}</span>
        </div>
        <div className={`ds-kartalar ${halqa === 'karta' ? 'ds-halqa' : ''}`}>
          {DS_AFZAL.map((k, i) => <div key={i} className="ds-karta"><DsIkon t={k.ic} /><p className="ds-h2">{tr(k.h)}</p><p className="ds-p">{tr(k.p)}</p></div>)}
        </div>
        <div className="ds-ft">{tr({ uz: "To'garak jadvali · 2026", ru: 'Расписание кружков · 2026' })}</div>
      </div>
    </div>
  );
};

""")

# ---------- 2) Kirish: javob izohi uchun joy oldindan (siljish yo'q) ----------
rep("""            {picked !== null && (
              <div ref={resultRef} className={`${picked === 'a' ? 'frame-success' : 'frame-soft'} fade-step`}>
                <p className="body" style={{ margin: 0, color: T.ink }}>{picked === 'a'
                  ? tr({ uz: <><b>Aynan!</b> Bosh sahifa bir qarashda aytadi""","""            <div ref={resultRef} className="am-javob-joy">{picked !== null && (
              <div className={`${picked === 'a' ? 'frame-success' : 'frame-soft'} fade-step`}>
                <p className="body" style={{ margin: 0, color: T.ink }}>{picked === 'a'
                  ? tr({ uz: <><b>Aynan!</b> Bosh sahifa bir qarashda aytadi""")
rep("""ru: <><b>Интересная мысль!</b> Посмотрите на заголовок: он называет решение проблемы — его человек видит первым.</> })}</p>
              </div>
            )}""","""ru: <><b>Интересная мысль!</b> Посмотрите на заголовок: он называет решение проблемы — его человек видит первым.</> })}</p>
              </div>
            )}</div>""")
rep("""<Col><p className="flow-label">{tr({ uz: 'Bugun oxirida', ru: 'Сегодня к концу' })}</p><DemoSahifa holat="uslub" uslub={demo.d.uslub || 'minimal'} muammo={demo.muammo} yechim={demo.yechim} /></Col>""",
    """<Col><p className="flow-label">{tr({ uz: 'Bugun oxirida · namuna', ru: 'Сегодня к концу · образец' })}</p><DemoSahifa holat="uslub" uslub={demo.d.uslub || 'minimal'} /></Col>""")

# ---------- 3) Reja: bank yopilmaydi; o'z g'oyasi bo'lsa — karta, «boshqa g'oya» bosilsagina bank ----------
rep("""  const tanla = (b) => { demo.set({ muammo: tr(b.muammo), yechim: tr(b.yechim), manba: b.id, holat: demo.d.holat || 'tanlangan' }); setOzgar(false); };
  const bankOchiq = !demo.bor || ozgar;""","""  const tanla = (b) => { demo.set({ muammo: tr(b.muammo), yechim: tr(b.yechim), manba: b.id, holat: demo.d.holat || 'tanlangan' }); };
  // F-1015-310: bankdan tanlanganda ro'yxat yopilmaydi (ekran siljimaydi) — tanlangani belgilanadi
  const bankdan = !!(demo.d.manba && IDEA_BANK.some(b => b.id === demo.d.manba));
  const bankOchiq = !demo.bor || bankdan || ozgar;""")
rep("""            <DemoSahifa holat="rang" uslub={demo.d.uslub || 'minimal'} muammo={demo.muammo} yechim={demo.yechim} />""","""            <DemoSahifa holat="rang" uslub={demo.d.uslub || 'minimal'} />""")

# ---------- 4) Amaliyot: to'liq prompt + «Promptni nusxalash» (Q3 A) + qadamlar (Q4 A) ----------
cut("// ===== a1 · a2 · a3 — AMALIYOT BLOKLARI =====","// ===== s16 — TOPSHIRISH", r"""// ===== a1 · a2 · a3 — AMALIYOT BLOKLARI (F-1015-310: to'liq prompt + nusxalash, tugmasiz qadamlar) =====
// Uslub bo'yicha aniq dizayn talablari — promptga qo'yiladi (rang kodlari maket bilan bir xil, kontrast ≥ 4.5)
const USLUB_SPEC = {
  minimal: { font: 'Inter', rang: { uz: 'fon #ffffff, matn #16181d, urg\'u rang #d4380d', ru: 'фон #ffffff, текст #16181d, акцентный цвет #d4380d' }, menyu: { uz: "pastida ingichka kulrang chiziq", ru: 'под ним тонкая серая линия' }, karta: { uz: "oq fon, ingichka ramka, yumshoq soya, burchak 12px", ru: 'белый фон, тонкая рамка, мягкая тень, углы 12px' } },
  yorqin: { font: 'Nunito', rang: { uz: "fon #fff8ef, matn #16181d, menyu foni ko'k #1d4ed8 (oq yozuv), urg'u rang #c2410c", ru: 'фон #fff8ef, текст #16181d, фон меню синий #1d4ed8 (белый текст), акцентный цвет #c2410c' }, menyu: { uz: "ko'k fonda oq yozuv", ru: 'белый текст на синем фоне' }, karta: { uz: "oq fon, rangli ramka, katta soya, burchak 16px", ru: 'белый фон, цветная рамка, большая тень, углы 16px' } },
  qorongi: { font: 'Poppins', rang: { uz: "fon #0f172a, matn #f1f5f9, kartalar #1e293b, urg'u rang #34d399 (tugma yozuvi to'q)", ru: 'фон #0f172a, текст #f1f5f9, карточки #1e293b, акцентный цвет #34d399 (текст кнопки тёмный)' }, menyu: { uz: "pastida to'q kulrang chiziq", ru: 'под ним тёмно-серая линия' }, karta: { uz: "to'q fon #1e293b, ingichka ramka, burchak 12px", ru: 'тёмный фон #1e293b, тонкая рамка, углы 12px' } },
  gradient: { font: 'Poppins', rang: { uz: "fon #fdf4ff, matn #16181d, bosh qism foni binafsha-pushti gradient (#ede9fe → #fce7f3), urg'u rang #7e22ce", ru: 'фон #fdf4ff, текст #16181d, фон главного блока — фиолетово-розовый градиент (#ede9fe → #fce7f3), акцентный цвет #7e22ce' }, menyu: { uz: "pastida ingichka chiziq", ru: 'под ним тонкая линия' }, karta: { uz: "oq fon, yumshoq binafsha soya, burchak 16px", ru: 'белый фон, мягкая фиолетовая тень, углы 16px' } },
};
const AMALIYOT = {
  a1: {
    eyebrow: { uz: 'Amaliyot 1 · HTML', ru: 'Практика 1 · HTML' },
    title: { uz: "Bosh sahifaning HTML'ini Gemini'ga yozdiring.", ru: 'Пусть Gemini напишет HTML главной страницы.' },
    vazifa: { uz: "Bosh sahifaning hamma qismi bo'lsin — dizaynsiz, faqat HTML.", ru: 'На главной странице должны быть все части — без дизайна, только HTML.' },
    qadamlar: [
      { uz: "«Promptni nusxalash» → gemini.google.com'ga qo'ying va yuboring.", ru: '«Скопировать промпт» → вставьте в gemini.google.com и отправьте.' },
      { uz: "Javobdagi kodni `index.html` ga qo'ying (bor kod o'rniga), `Ctrl+S`.", ru: 'Вставьте код из ответа в `index.html` (вместо старого), `Ctrl+S`.' },
      { uz: "Live Server'da qarang: menyu, sarlavha, tugma, 3 karta, footer — hammasi bormi?", ru: 'Посмотрите в Live Server: меню, заголовок, кнопка, 3 карточки, footer — всё есть?' },
      { uz: "Biror qism yo'q bo'lsa, Gemini'ga aniq yozing: «… qo'shilmagan, qo'sh».", ru: 'Если какой-то части нет, напишите Gemini точно: «… нет, добавь».' }
    ],
    prompt: (m, y) => ({ uz: `Demo Day loyiham uchun bosh sahifa — index.html'ni yoz.\nMuammo: ${m}. Saytim: ${y}.\nTuzilishi:\n– tepada: chapda sayt nomi, o'ngda menyu (Bosh sahifa, Aloqa);\n– bosh qism: kichik yozuv, katta sarlavha (saytim nima qilishini aytsin), muammo haqida bitta gap, «Batafsil» tugmasi;\n– 3 ta karta: saytimning 3 afzalligi, har birida qisqa sarlavha va bitta gap — matnini o'zing yoz;\n– eng pastda footer: sayt nomi va yil.\nHar qismga tushunarli class nomi ber: header, hero, kartalar, karta, footer.\nstyle.css <link> bilan ulangan bo'lsin. CSS yozma, faqat HTML. To'liq faylni qaytar.`, ru: `Напиши index.html — главную страницу моего проекта для Demo Day.\nПроблема: ${m}. Мой сайт: ${y}.\nСтруктура:\n– вверху: слева название сайта, справа меню (Главная, Контакты);\n– главный блок: маленькая надпись, крупный заголовок (что делает мой сайт), одна фраза о проблеме, кнопка «Подробнее»;\n– 3 карточки: 3 преимущества сайта, в каждой короткий заголовок и одна фраза — текст напиши сам;\n– внизу footer: название сайта и год.\nДай частям понятные class: header, hero, kartalar, karta, footer.\nПодключи style.css через <link>. CSS не пиши, только HTML. Верни файл целиком.` }),
    holat: 'xom', halqa: null,
    osti: { uz: "HTML — sahifaning tuzilmasi: hamma qism bor, lekin hali bezaksiz.", ru: 'HTML — структура страницы: все части на месте, но пока без оформления.' },
    namuna: NAMUNA_BOSH
  },
  a2: {
    eyebrow: { uz: 'Amaliyot 2 · dizayn', ru: 'Практика 2 · дизайн' },
    title: { uz: 'Saytingiz uchun uslub tanlang.', ru: 'Выберите стиль для сайта.' },
    uslubTanlov: true,
    qadamlar: [
      { uz: 'Uslubni tanlang — prompt o\'zgaradi.', ru: 'Выберите стиль — промпт изменится.' },
      { uz: "«Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi `{…}` o'rniga `index.html` kodingizni qo'ying.", ru: '«Скопировать промпт» → вставьте в Gemini, вместо `{…}` в конце — код вашего `index.html`.' },
      { uz: "Javobdagi kodni `style.css` ga qo'ying, `Ctrl+S`.", ru: 'Вставьте код из ответа в `style.css`, `Ctrl+S`.' },
      { uz: "Live Server'da natijani o'ngdagi surat bilan solishtiring.", ru: 'Сравните результат в Live Server с картинкой справа.' }
    ],
    prompt: (m, y, st) => {
      const sp = USLUB_SPEC[st.id];
      return { uz: `Bosh sahifamga zamonaviy dizayn ber — faqat style.css'ni yoz, HTML'ni o'zgartirma.\nUslub: ${st.name.uz} — ${st.desc.uz}\nRanglar: ${sp.rang.uz}.\nShrift: Google Fonts'dagi «${sp.font}» (style.css boshida @import bilan); sarlavhalar qalin.\nMenyu: chapda sayt nomi, o'ngda havolalar; ${sp.menyu.uz}.\nBosh qism: sahifa markazida, sarlavha 48px, ostida kulrang matn; tugma urg'u rangda, yumaloq burchak, sichqoncha ustida biroz to'qroq.\n3 ta karta: bir qatorda, orasida 24px; ${sp.karta.uz}.\nSahifa eni 1000px dan oshmasin, markazda. Telefonda kartalar ustma-ust tursin.\nMana kodim: {index.html kodini shu yerga qo'ying}`,
        ru: `Сделай моей главной странице современный дизайн — пиши только style.css, HTML не меняй.\nСтиль: ${st.name.ru} — ${st.desc.ru}\nЦвета: ${sp.rang.ru}.\nШрифт: «${sp.font}» из Google Fonts (через @import в начале style.css); заголовки жирные.\nМеню: слева название сайта, справа ссылки; ${sp.menyu.ru}.\nГлавный блок: по центру страницы, заголовок 48px, под ним серый текст; кнопка акцентного цвета, скруглённая, при наведении чуть темнее.\n3 карточки: в один ряд, промежуток 24px; ${sp.karta.ru}.\nШирина страницы не больше 1000px, по центру. В телефоне карточки друг под другом.\nВот мой код: {вставьте сюда код index.html}` };
    },
    holat: 'uslub', halqa: 'karta',
    osti: { uz: "Gemini javobida kartalarni yonma-yon qo'ygan `display: flex` va `gap` ni toping.", ru: 'Найдите в ответе Gemini `display: flex` и `gap` — они ставят карточки в ряд.' },
    namuna: NAMUNA_HTML
  },
  a3: {
    eyebrow: { uz: "Amaliyot 3 · Gemini'siz", ru: 'Практика 3 · без Gemini' },
    title: { uz: "Saytga o'zingiz tanlagan rangni bering.", ru: 'Дайте сайту цвет, который выбрали сами.' },
    qadamlar: [
      { uz: "`style.css` da asosiy rangni toping — tugma va sarlavhalarda takrorlanadigan kod (namunada `#d4380d`).", ru: 'Найдите в `style.css` основной цвет — код, который повторяется в кнопке и заголовках (в образце `#d4380d`).' },
      { uz: "`Ctrl+H` bosing: yuqori qatorga eski rangni, pastkisiga yangisini yozing va `Ctrl+Alt+Enter` bosing — hammasi birdan almashadi.", ru: 'Нажмите `Ctrl+H`: в верхнюю строку — старый цвет, в нижнюю — новый, и нажмите `Ctrl+Alt+Enter` — заменится всё сразу.' },
      { uz: "`Ctrl+S` — Live Server'da sahifaga qarang.", ru: '`Ctrl+S` — посмотрите на страницу в Live Server.' }
    ],
    yordam: { uz: "Rang kodini bilmasangiz — VS Code'da rang kodi yonidagi kichik kvadratni bosing, rang tanlagich ochiladi.", ru: 'Не знаете код цвета — нажмите в VS Code на маленький квадрат рядом с кодом цвета, откроется палитра.' },
    holat: 'rang', halqa: null, masalanYorliq: true,
    namuna: NAMUNA_CSS
  }
};
const PromptBlok = ({ matn }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return (
    <div className="am-karta fade-up delay-2">
      <p className="flow-label">{tr({ uz: 'Prompt', ru: 'Промпт' })}</p>
      <pre className="am-masalan">{matn}</pre>
      <button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Promptni nusxalash', ru: 'Скопировать промпт' })}</button>
    </div>
  );
};
const ScreenAmaliyot = ({ screen, onNext, onPrev }) => {
  const b = AMALIYOT[SCREEN_META[screen].id];
  const demo = useDemo();
  const uslub = demo.d.uslub || 'minimal';
  const st = STYLES.find(s => s.id === uslub) || STYLES[0];
  const matn = b.prompt ? tr(b.prompt(demo.muammo, demo.yechim, st)) : null;
  return (
    <Stage eyebrow={tr(b.eyebrow)} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(b.title)}</h2></div>
        <Split>
          <Col>
            {b.vazifa && <div className="am-karta fade-up delay-1"><p className="flow-label">{tr({ uz: 'Vazifa', ru: 'Задание' })}</p><p className="body" style={{ margin: 0, color: T.ink }}>{fmtCode(tr(b.vazifa))}</p></div>}
            {b.uslubTanlov && <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Uslub', ru: 'Стиль' })}</p>
              <div className="am-uslub">{STYLES.map(s => <button key={s.id} type="button" className={`am-uslub-btn ${uslub === s.id ? 'on' : ''}`} onClick={() => demo.set({ uslub: s.id })}><b>{tr(s.name)}</b><span>{tr(s.sub)}</span></button>)}</div>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: 'Har kim boshqa uslub tanlasa, sinfda bir xil sayt chiqmaydi.', ru: 'Если каждый выберет свой стиль, в классе не будет одинаковых сайтов.' })}</p>
            </div>}
            <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Qadamlar', ru: 'Шаги' })}</p>
              <ol className="am-qadam">{b.qadamlar.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
              {b.yordam && <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(b.yordam)}</p>}
            </div>
            {matn && <PromptBlok matn={matn} />}
            <div className="am-past fade-up delay-3"><span>{tr({ uz: 'Ortda qoldingizmi?', ru: 'Отстали?' })}</span><NamunaBtn kod={b.namuna} /></div>
          </Col>
          <Col>
            <p className="flow-label">{tr(b.masalanYorliq ? { uz: 'Kutilgan natija · masalan', ru: 'Ожидаемый результат · например' } : { uz: 'Kutilgan natija · namuna', ru: 'Ожидаемый результат · образец' })}</p>
            <DemoSahifa holat={b.holat} uslub={uslub} halqa={b.halqa} />
            {b.osti && <p className="small am-osti">{fmtCode(tr(b.osti))}</p>}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

""")

# ---------- 5) CSS: yangi landing maketi ----------
i=one("        .ds { border-radius: 12px;"); j=one("        .ds-halqa {"); j=S.index("\n",j)+1
S=S[:i]+r"""        .am-javob-joy { min-height: 104px; }
        .am-nusxa { align-self: flex-start; background: ${T.ink}; color: #fff; border: none; border-radius: 10px; padding: 9px 16px; font: 700 13px 'Manrope', sans-serif; cursor: pointer; }
        .am-nusxa:hover { background: #2a2a30; }
        .ds { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 22px -8px rgba(${T.shadowBase},0.22); font-family: 'Manrope', Arial, sans-serif; background: #fff; }
        .ds-bar { display: flex; align-items: center; gap: 10px; background: #ECE9E1; padding: 7px 12px; }
        .ds-url { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .ds-body { --ds-bg: #fff; --ds-ink: #16181d; --ds-mut: #4b5563; --ds-acc: #d4380d; --ds-acc-ink: #fff; --ds-card: #fff; --ds-line: #e8e8e8; --ds-hd: transparent; --ds-hd-ink: #16181d; background: var(--ds-bg); color: var(--ds-ink); max-height: 360px; overflow-y: auto; }
        .ds-hd { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 11px 16px; border-bottom: 1px solid var(--ds-line); background: var(--ds-hd); color: var(--ds-hd-ink); font-size: 11.5px; }
        .ds-logo { font-weight: 800; }
        .ds-nav { display: flex; gap: 12px; opacity: 0.85; }
        .ds-hero { text-align: center; padding: 24px 18px 18px; }
        .ds-tag { margin: 0 0 6px; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ds-acc); }
        .ds-h1 { margin: 0 auto 8px; max-width: 22ch; font-size: 21px; font-weight: 800; line-height: 1.15; }
        .ds-p { margin: 0; font-size: 11.5px; line-height: 1.45; color: var(--ds-mut); }
        .ds-hero .ds-p { max-width: 40ch; margin: 0 auto; }
        .ds-tugma { display: inline-block; margin-top: 12px; background: var(--ds-acc); color: var(--ds-acc-ink); font-size: 11.5px; font-weight: 700; padding: 7px 16px; border-radius: 999px; }
        .ds-kartalar { display: flex; gap: 10px; padding: 6px 16px 18px; }
        .ds-karta { flex: 1; min-width: 0; background: var(--ds-card); border: 1px solid var(--ds-line); border-radius: 12px; padding: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .ds-ic { width: 18px; height: 18px; color: var(--ds-acc); }
        .ds-h2 { margin: 4px 0 2px; font-size: 12px; font-weight: 800; }
        .ds-ft { text-align: center; font-size: 10.5px; padding: 9px; border-top: 1px solid var(--ds-line); color: var(--ds-mut); }
        .ds-yorqin .ds-body { --ds-bg: #fff8ef; --ds-acc: #c2410c; --ds-line: #f3d9bf; --ds-hd: #1d4ed8; --ds-hd-ink: #fff; }
        .ds-yorqin .ds-h1 { color: #1d4ed8; font-size: 23px; } .ds-yorqin .ds-karta { border-color: #c2410c; border-radius: 16px; }
        .ds-qorongi .ds-body { --ds-bg: #0f172a; --ds-ink: #f1f5f9; --ds-mut: #cbd5e1; --ds-acc: #34d399; --ds-acc-ink: #0f172a; --ds-card: #1e293b; --ds-line: #334155; --ds-hd-ink: #f1f5f9; }
        .ds-gradient .ds-body { --ds-bg: #fdf4ff; --ds-acc: #7e22ce; --ds-line: #f0d5f5; }
        .ds-gradient .ds-hero { background: linear-gradient(135deg, #ede9fe, #fce7f3); } .ds-gradient .ds-karta { border-radius: 16px; box-shadow: 0 6px 16px rgba(126,34,206,0.14); }
        .ds-rang .ds-body { --ds-acc: #15803d; }
        .ds-rang.ds-qorongi .ds-body { --ds-acc: #fbbf24; }
        .ds-rang.ds-yorqin .ds-body { --ds-acc: #15803d; } .ds-rang.ds-gradient .ds-body { --ds-acc: #be185d; }
        .ds-xom .ds-body { --ds-bg: #fff; --ds-ink: #000; --ds-mut: #000; --ds-acc: #000; --ds-acc-ink: #1a0dab; --ds-card: transparent; --ds-line: transparent; font-family: 'Times New Roman', serif; }
        .ds-xom .ds-hd, .ds-xom .ds-hero { display: block; text-align: left; } .ds-xom .ds-nav { display: block; color: #1a0dab; text-decoration: underline; opacity: 1; }
        .ds-xom .ds-kartalar { display: block; } .ds-xom .ds-karta { border: none; padding: 2px 0; box-shadow: none; } .ds-xom .ds-ic { display: none; }
        .ds-xom .ds-tag { color: #000; text-transform: none; letter-spacing: 0; font-weight: 400; } .ds-xom .ds-h1 { margin-left: 0; font-size: 24px; } .ds-xom .ds-tugma { padding: 0; text-decoration: underline; font-weight: 400; background: none; }
        .ds-halqa { outline: 2.5px dashed ${T.accent}; outline-offset: -3px; border-radius: 10px; }
"""+S[j:]
open(F,'w',encoding='utf8').write(S); print('ok', S.count('\n'))
