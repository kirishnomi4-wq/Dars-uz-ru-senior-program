F='/home/kali/Desktop/internetLesson/src/1-Modull/CssPractice.jsx'
S=open(F,encoding='utf8').read()
def one(a):
    n=S.count(a); assert n==1,(n,a[:110]); return S.index(a)
def cut(start,end,new=''):
    global S; i=one(start); j=S.index(end,i); S=S[:i]+new+S[j:]
def rep(a,b):
    global S; one(a); S=S.replace(a,b)

# 1) SCREEN_META: kartochkalar o'rniga testdan keyin «Yaxshilash» (a4)
rep("""  { id: 's16', type: 'test',     template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'spodium', type: 'podium',  template: 'custom', scored: false, scope: null },
  { id: 'sflash', type: 'flashcard', template: 'custom', scored: false, scope: null },""",
"""  { id: 's16', type: 'test',     template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'a4',  type: 'practice', template: 'custom',   scored: false, scope: null }, // F-1015-316: kartochkalar o'rniga — loyihani tekshirish va yaxshilash
  { id: 'spodium', type: 'podium',  template: 'custom', scored: false, scope: null },""")
rep("""  // Tartib SCREEN_META bilan AYNAN bir xil: s0 → s1 → a1 → a2 → a3 → s16 (topshirish) → spodium → sflash → s17 (yakun)
  const screens = [Screen0, Screen1, ScreenAmaliyot, ScreenAmaliyot, ScreenAmaliyot, Screen16, ScreenPodium, ScreenFlashcards, Screen17];""",
"""  // Tartib SCREEN_META bilan AYNAN bir xil: s0 → s1 → a1 → a2 → a3 → s16 (topshirish) → a4 (yaxshilash) → spodium → s17 (yakun)
  const screens = [Screen0, Screen1, ScreenAmaliyot, ScreenAmaliyot, ScreenAmaliyot, Screen16, ScreenYaxshilash, ScreenPodium, Screen17];""")
rep("""  // 🃏 Flashcard jonli darsda FAQAT MENTORGA ko'rinadi; jonli o'quvchidan yashirin — sakrab o'tiladi.
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const advance = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });""",
"""  const advance = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1)); // F-1015-316: kartochkalar ekrani yo'q""")
rep("""  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });""",
    """  const prev = () => setScreen(s => Math.max(s - 1, 0));""")

# 2) kartochkalar kodi va namuna kodlari olinadi (F-1015-316: «flashcard kerakmas», «namuna kodi kerakmas»)
cut("// ===== 🃏 FLASHCARDS (yakuniy takrorlash)","// ===== SCREEN 17 — YAKUN")
cut("// ----- Namuna kodlari (ortda qolgan o'quvchi uchun","// ----- Bitta vizual: Demo Day bosh sahifasi")
for k in ["    namuna: NAMUNA_BOSH\n","    namuna: NAMUNA_HTML\n","    namuna: NAMUNA_CSS\n"]:
    one(k); S=S.replace(k,"")
S=S.replace("""    osti: { uz: "HTML — sahifaning tuzilmasi: hamma qism bor, lekin hali bezaksiz.", ru: 'HTML — структура страницы: все части на месте, но пока без оформления.' },
""","""    osti: { uz: "HTML — sahifaning tuzilmasi: hamma qism bor, lekin hali bezaksiz.", ru: 'HTML — структура страницы: все части на месте, но пока без оформления.' },
""")
# osti oxirlarida vergul qoldi — `namuna` olinganda oldingi qator vergul bilan tugaydi, JS uchun to'g'ri

# 3) a1: qadamlar o'ngda, maket yo'q; 1-qadam — «Saqlash»
rep("""    forma: true,""","""    forma: true, ongdaQadam: true,""")
rep("""      { uz: "«Promptni nusxalash» → gemini.google.com'ga qo'ying va yuboring.", ru: '«Скопировать промпт» → вставьте в gemini.google.com и отправьте.' },
      { uz: "Javobdagi kodni `index.html` ga qo'ying (bor kod o'rniga), `Ctrl+S`.", ru: 'Вставьте код из ответа в `index.html` (вместо старого), `Ctrl+S`.' },
      { uz: "Live Server'da qarang: menyu, sarlavha, tugma, 3 karta, footer — hammasi bormi?", ru: 'Посмотрите в Live Server: меню, заголовок, кнопка, 3 карточки, footer — всё есть?' },
      { uz: "Biror qism yo'q bo'lsa, Gemini'ga aniq yozing: «… qo'shilmagan, qo'sh».", ru: 'Если какой-то части нет, напишите Gemini точно: «… нет, добавь».' }""",
"""      { uz: "Loyihangizni yozing va «Saqlash»ni bosing — prompt tayyor bo'ladi.", ru: 'Опишите проект и нажмите «Сохранить» — промпт будет готов.' },
      { uz: "«Promptni nusxalash» → gemini.google.com'ga qo'ying va yuboring.", ru: '«Скопировать промпт» → вставьте в gemini.google.com и отправьте.' },
      { uz: "Javobdagi kodni `index.html` ga qo'ying (bor kod o'rniga), `Ctrl+S`.", ru: 'Вставьте код из ответа в `index.html` (вместо старого), `Ctrl+S`.' },
      { uz: "Live Server'da qarang: menyu, sarlavha, tugmalar, 3 karta, footer — hammasi bormi? Yo'q bo'lsa, Gemini'ga aniq yozing: «… qo'shilmagan, qo'sh».", ru: 'Посмотрите в Live Server: меню, заголовок, кнопки, 3 карточки, footer — всё есть? Если нет, напишите Gemini точно: «… нет, добавь».' }""")

# 4) ScreenAmaliyot: forma yig'iladi (Saqlash/Tahrirlash), a1 da o'ngda qadamlar, «Ortda qoldingizmi» yo'q
cut("const ScreenAmaliyot = ({ screen, onNext, onPrev }) => {","// ===== s16 — TOPSHIRISH", r"""const Qadamlar = ({ b, uslub, cls = '' }) => (
  <div className={`am-karta ${cls}`}>
    <p className="flow-label">{tr({ uz: 'Qadamlar', ru: 'Шаги' })}</p>
    <ol className="am-qadam">{b.qadamlar.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(typeof x === 'function' ? x(USLUB_ACC[uslub]) : x))}</span></li>)}</ol>
    {b.yordam && <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(b.yordam)}</p>}
  </div>
);
const ScreenAmaliyot = ({ screen, onNext, onPrev }) => {
  const b = AMALIYOT[SCREEN_META[screen].id];
  const demo = useDemo();
  const uslub = demo.d.uslub || USLUB_STD;
  const st = STYLES.find(s => s.id === uslub) || STYLES[0];
  const css = demo.d.css || {};
  const [lp, setLp] = useState({ nom: css.nom || '', muammo: css.muammo || '', talab: css.talab || '' });
  const [yigil, setYigil] = useState(!!css.saqlangan); // F-1015-316: saqlangach forma yig'iladi, «Tahrirlash» bilan ochiladi
  const yoz = (k, v) => { const n = { ...lp, [k]: v }; setLp(n); demo.set({ css: { ...(demo.d.css || {}), ...n }, ...(n.nom.trim() && n.muammo.trim() ? { yechim: n.nom.trim(), muammo: n.muammo.trim() } : {}) }); };
  const toliq = LOYIHA_MAYDON.every(m => lp[m.k].trim().length >= 3);
  const saqla = () => { if (!toliq) return; demo.set({ css: { ...(demo.d.css || {}), ...lp, saqlangan: true } }); setYigil(true); };
  // bosqichma-bosqich: a1 — saqlangach (tahrirlashda ham prompt jonli yangilanadi); a2 — uslub tanlangach
  const ochiq = b.forma ? (toliq && !!(demo.d.css && demo.d.css.saqlangan)) : b.uslubTanlov ? !!demo.d.uslub : true;
  const matn = b.prompt && ochiq ? tr(b.forma ? b.prompt({ nom: lp.nom.trim(), muammo: lp.muammo.trim(), talab: lp.talab.trim() }) : b.prompt(null, st)) : null;
  return (
    <Stage eyebrow={tr(b.eyebrow)} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(b.title)}</h2></div>
        <Split>
          <Col>
            {b.forma && !yigil && <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Loyihangiz', ru: 'Ваш проект' })}</p>
              {LOYIHA_MAYDON.map((m, i) => <label key={m.k} className="am-maydon"><span>{tr(m.l)}</span><input className="am-input" value={lp[m.k]} placeholder={tr(m.ph)} autoFocus={i === 0 && !lp.nom} onChange={e => yoz(m.k, e.target.value)} /></label>)}
              <button type="button" className="am-saqla" disabled={!toliq} onClick={saqla}>{tr(toliq ? { uz: 'Saqlash', ru: 'Сохранить' } : { uz: "Uchala qatorni to'ldiring", ru: 'Заполните три строки' })}</button>
            </div>}
            {b.forma && yigil && <div className="am-karta am-loyiha am-ochil">
              <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Loyihangiz', ru: 'Ваш проект' })}</p><button type="button" className="am-nusxa" onClick={() => setYigil(false)}>{tr({ uz: 'Tahrirlash', ru: 'Изменить' })}</button></div>
              <p className="am-loyiha-nom">{lp.nom}</p>
              <p className="body" style={{ margin: 0, color: T.ink }}><b>{tr({ uz: 'Muammo:', ru: 'Проблема:' })}</b> {lp.muammo}</p>
              <p className="body" style={{ margin: 0, color: T.ink }}><b>{tr({ uz: 'Talablar:', ru: 'Требования:' })}</b> {lp.talab}</p>
            </div>}
            {b.uslubTanlov && <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Uslub', ru: 'Стиль' })}</p>
              <div className="am-uslub">{STYLES.map(s => <button key={s.id} type="button" className={`am-uslub-btn ${demo.d.uslub === s.id ? 'on' : ''}`} onClick={() => demo.set({ uslub: s.id })}><b>{tr(s.name)}</b><span>{tr(s.sub)}</span></button>)}</div>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(demo.d.uslub ? { uz: 'Har kim boshqa uslub tanlasa, sinfda bir xil sayt chiqmaydi.', ru: 'Если каждый выберет свой стиль, в классе не будет одинаковых сайтов.' } : { uz: "Uslubni tanlang — keyin prompt va qadamlar ochiladi.", ru: 'Выберите стиль — затем откроются промпт и шаги.' })}</p>
            </div>}
            {ochiq && matn && <div className="am-ochil"><PromptBlok matn={matn} tayyor={b.forma ? { uz: "Prompt tayyor — endi Gemini orqali quring.", ru: 'Промпт готов — теперь стройте с помощью Gemini.' } : null} /></div>}
            {!b.ongdaQadam && ochiq && <Qadamlar b={b} uslub={uslub} cls="am-ochil" />}
          </Col>
          <Col>
            {b.ongdaQadam ? <Qadamlar b={b} uslub={uslub} cls="fade-up delay-2" /> : <>
              <p className="flow-label">{tr(b.masalanYorliq ? { uz: 'Kutilgan natija · masalan', ru: 'Ожидаемый результат · например' } : { uz: 'Kutilgan natija · namuna', ru: 'Ожидаемый результат · образец' })}</p>
              <DemoSahifa holat={b.holat} uslub={uslub} halqa={b.halqa} />
              {b.osti && <p className="small am-osti">{fmtCode(tr(b.osti))}</p>}
            </>}
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a4 — YAXSHILASH (F-1015-316: kartochkalar o'rniga): saytni ro'yxat bo'yicha tekshirish → bitta kamchilik → prompt; dars oxirigacha takror =====
const TEKSHIR = [
  { uz: 'Menyudagi havolalar bosiladimi?', ru: 'Ссылки в меню нажимаются?' },
  { uz: "Oynani toraytiring: telefonda kartalar sig'adimi?", ru: 'Сузьте окно: карточки помещаются на телефоне?' },
  { uz: 'Hamma matn sizning loyihangiz haqidami?', ru: 'Весь текст — про ваш проект?' },
  { uz: 'Tugma va sarlavhalar bir xil rangdami?', ru: 'Кнопки и заголовки одного цвета?' },
  { uz: 'Eng pastda footer bormi?', ru: 'Внизу есть footer?' },
];
const YAX_QADAM = {
  qadamlar: [
    { uz: "Ro'yxat bo'yicha saytingizga qarang va bitta kamchilikni tanlang.", ru: 'Проверьте сайт по списку и выберите один недочёт.' },
    { uz: 'Uni yozing — prompt yig\'iladi.', ru: 'Опишите его — промпт соберётся.' },
    { uz: "«Promptni nusxalash» → Gemini'ga yuboring, javobdagi kodni faylga qo'ying, `Ctrl+S`.", ru: '«Скопировать промпт» → отправьте в Gemini, вставьте код из ответа в файл, `Ctrl+S`.' },
    { uz: '«Keyingi kamchilik» — va yana. Dars oxirigacha.', ru: '«Следующий недочёт» — и снова. До конца урока.' }
  ]
};
const YAX_MAYDON = [
  { k: 'yoqmadi', l: { uz: 'Nima yoqmadi?', ru: 'Что не нравится?' }, ph: { uz: "masalan: telefonda kartalar sig'mayapti", ru: 'например: на телефоне карточки не помещаются' } },
  { k: 'qanday', l: { uz: "Qanday bo'lsin?", ru: 'Как должно быть?' }, ph: { uz: "masalan: telefonda kartalar ustma-ust tursin", ru: 'например: на телефоне карточки друг под другом' } },
];
const ScreenYaxshilash = ({ screen, onNext, onPrev }) => {
  const demo = useDemo();
  const [f, setF] = useState({ yoqmadi: '', qanday: '' });
  const [soni, setSoni] = useState(() => (demo.d.css && demo.d.css.yaxshi) || 0);
  const tayyor = YAX_MAYDON.every(m => f[m.k].trim().length >= 3);
  const keyingi = () => { const n = soni + 1; setSoni(n); demo.set({ css: { ...(demo.d.css || {}), yaxshi: n } }); setF({ yoqmadi: '', qanday: '' }); };
  const matn = tayyor ? tr({ uz: `Saytimni yaxshila — faqat shu joyni o'zgartir, qolganiga tegma.\nYoqmagani: ${f.yoqmadi.trim()}.\nQanday bo'lsin: ${f.qanday.trim()}.\nO'zgargan faylni to'liq qaytar.\nMana kodim: {index.html va style.css kodini shu yerga qo'ying}`, ru: `Улучши мой сайт — меняй только это место, остальное не трогай.\nНе нравится: ${f.yoqmadi.trim()}.\nКак должно быть: ${f.qanday.trim()}.\nВерни изменённый файл целиком.\nВот мой код: {вставьте сюда код index.html и style.css}` }) : null;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 4 · yaxshilash', ru: 'Практика 4 · улучшение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: 'Saytingizni tekshiring va yaxshilang.', ru: 'Проверьте и улучшите сайт.' })}</h2></div>
        <Split>
          <Col>
            <div className="am-karta fade-up delay-1">
              <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Bitta kamchilik', ru: 'Один недочёт' })}</p>{soni > 0 && <span className="am-soni">{tr({ uz: `Yaxshilandi: ${soni}`, ru: `Улучшено: ${soni}` })}</span>}</div>
              {YAX_MAYDON.map((m, i) => <label key={m.k} className="am-maydon"><span>{tr(m.l)}</span><input className="am-input" value={f[m.k]} placeholder={tr(m.ph)} autoFocus={i === 0} onChange={e => setF({ ...f, [m.k]: e.target.value })} /></label>)}
            </div>
            {matn && <div className="am-ochil"><PromptBlok matn={matn} tayyor={{ uz: "Prompt tayyor — Gemini'ga yuboring.", ru: 'Промпт готов — отправьте в Gemini.' }} /></div>}
            {matn && <button type="button" className="am-saqla am-ochil" onClick={keyingi}>{tr({ uz: 'Keyingi kamchilik', ru: 'Следующий недочёт' })}</button>}
          </Col>
          <Col>
            <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Saytingizni tekshiring', ru: 'Проверьте сайт' })}</p>
              <ul className="am-band">{TEKSHIR.map((x, i) => <li key={i}>{tr(x)}</li>)}</ul>
            </div>
            <Qadamlar b={YAX_QADAM} uslub={demo.d.uslub || USLUB_STD} cls="fade-up delay-2" />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

""")

# 5) yakun takrorlashiga bitta qator
rep("""{ uz: "Rangni butun faylda `Ctrl+H` bilan o'zingiz almashtirasiz", ru: 'Сами меняете цвет во всём файле через `Ctrl+H`' }];""",
    """{ uz: "Rangni butun faylda `Ctrl+H` bilan o'zingiz almashtirasiz", ru: 'Сами меняете цвет во всём файле через `Ctrl+H`' }, { uz: "Saytni ro'yxat bo'yicha tekshirib, aniq so'rov bilan yaxshilaysiz", ru: 'Проверяете сайт по списку и улучшаете его точным запросом' }];""")

# 6) CSS: namuna-havola qoidalari olinadi; minimalist input, «Saqlash», yig'ilgan loyiha
rep("""        .am-past { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; font-size: 13px; color: ${T.ink2}; }
        .am-past-btn { display: inline-flex; flex-wrap: wrap; gap: 6px 12px; }
""","")
i=one("        .am-namuna { background: none;"); j=S.index("\n",S.index("        .am-namuna:hover",i))+1
S=S[:i]+S[j:]
rep("""        .am-maydon .text-input { font-size: 14px; padding: 10px 12px; }""",
"""        .am-input { width: 100%; font: 500 14px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 10px 12px; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .am-input::placeholder { color: ${T.ink2}; opacity: 0.85; }
        .am-input:hover { border-color: #cfcabe; }
        .am-input:focus { border-color: ${T.accent}; box-shadow: 0 0 0 4px ${T.accentSoft}; }
        .am-saqla { align-self: flex-start; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 9px 18px; font: 700 13px 'Manrope', sans-serif; cursor: pointer; }
        .am-saqla:hover:not(:disabled) { background: ${T.accentSoft}; }
        .am-saqla:disabled { border-color: ${T.line}; color: ${T.ink2}; cursor: default; }
        .am-loyiha-nom { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 18px; color: ${T.ink}; }
        .am-soni { font: 700 12px 'Manrope', sans-serif; color: ${T.success}; background: ${T.successSoft}; border-radius: 999px; padding: 3px 10px; }""")
open(F,'w',encoding='utf8').write(S); print('ok', S.count('\n'))
