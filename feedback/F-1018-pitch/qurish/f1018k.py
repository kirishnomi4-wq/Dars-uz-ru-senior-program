# F-1018-13 · m9-16 QA fidbek F-1015-344…347 + «aytildi aytadi» buzuq iborasi. Joriy fayl ustiga (zaxira arxiv/F-1018-13-oldin/): python3 f1018k.py
import sys
F = '/home/kali/Desktop/internetLesson/src/9-Modull/PmPrototypePitchLesson.jsx'
s = open('/home/kali/Desktop/internetLesson/arxiv/F-1018-13-oldin/PmPrototypePitchLesson.jsx', encoding='utf8').read()
def rep(old, new, label=''):
    global s
    c = s.count(old)
    if c != 1: print(f'❌ {label or old[:70]!r}: topildi {c}'); sys.exit(1)
    s = s.replace(old, new)

# --- buzuq ibora (F-1018-07 qayta nomlashdan qolgan)
rep("1 daqiqada aytildi aytiladi (2-raund)", "1 daqiqada qayta aytiladi (2-raund)", 'izoh')
rep("sherigiga 1 daqiqada aytildi aytadi", "sherigiga 1 daqiqada qayta aytadi", 'MentorNote')

# --- 344: navbati kelmagan qadamlar ko'rsatilmaydi (213.1); joriy qadam Mentor matnida; ixcham bo'lak kartasi chegarasiz, holat fon bilan (213.3)
rep("""        : <span key={i} className="pt-qq-kut"><i>{i + 1}</i>{q}</span>)}""", """        : null)}""", 'QadamQatori')
rep("""// Ketma-ket qadamlar qatori (SABOQ 34): bajarilgani ✓ ixcham, joriysi — katta halqali tugma, keyingilari kulrang""",
    """// Ketma-ket qadamlar qatori (SABOQ 34): bajarilgani ✓ ixcham, joriysi — katta halqali tugma; navbati kelmagani ko'rsatilmaydi (213.1, F-1015-344)""", 'QQ izoh')
rep("""        .pt-qq-ok, .pt-qq-kut { display: inline-flex;""", """        .pt-qq-ok { display: inline-flex;""", 'css qq')
rep("""        .pt-qq-kut { color: ${T.ink2}; background: ${T.bg}; border: 1px solid transparent; opacity: 0.8; }
        .pt-qq-kut i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
""", "", 'css qq-kut')
rep("""        .pt-bl.ixcham .pt-bl-q { -webkit-line-clamp: 2; }""", """        .pt-bl.ixcham .pt-bl-q { -webkit-line-clamp: 2; }
        /* F-1015-344 (213.3): ixcham bo'lak — holat-chip, tugmaga o'xshamaydi: chegarasiz, holat fon bilan */
        .pt-bl.ixcham { border-color: transparent; box-shadow: none; background: ${T.bg}; }
        .pt-bl.ixcham.h-ok, .pt-bl.ixcham.h-tuz, .pt-bl.ixcham.h-yoz { background: ${T.okFon}; }
        .pt-bl.ixcham.h-joriy { background: ${fon(T.accent, 0.12)}; }
        .pt-bl.ixcham.h-err { background: ${fon(T.err, 0.1)}; }""", 'css ixcham')
rep("""        mentor={<Mentor>{tr(done
          ? { uz: "Jonli demo bo'lagi tayyor: «Davom etish»ni bosing.", ru: 'Часть «Живое демо» готова: нажмите «Продолжить».' }
          : { uz: "Pitch boshlanganda ilova kutib qolsa, zal ham kutadi: qadamlarni birma-bir bosing.", ru: 'Если в начале питча приложение зависнет на ожидании, зал тоже будет ждать: нажимайте шаги по одному.' })}</Mentor>}""",
"""        mentor={<Mentor>{done
          ? tr({ uz: "Jonli demo bo'lagi tayyor: «Davom etish»ni bosing.", ru: 'Часть «Живое демо» готова: нажмите «Продолжить».' })
          : taxmin && band ? tr({ uz: "Telefonga qarang — nima o'zgaryapti?", ru: 'Смотрите на телефон — что меняется?' })
            : taxmin ? <>{tr({ uz: `${Math.min(q, 2) + 1}-qadam: tugmani bosing —`, ru: `Шаг ${Math.min(q, 2) + 1}: нажмите кнопку —` })} «{tr(S8_QADAM[Math.min(q, 2)])}».</>
              : tr({ uz: "Pitch boshlanganda ilova kutib qolsa, zal ham kutadi: avval taxminingizni belgilang.", ru: 'Если в начале питча приложение зависнет на ожидании, зал тоже будет ждать: сначала отметьте своё предположение.' })}</Mentor>}""", 'S8 mentor')
rep("""label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Qadamlarni bajaring', ru: 'Выполните шаги' })} (${tayyor}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Telefonda zalga""", """label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : `${tr({ uz: 'Qadamlarni bajaring', ru: 'Выполните шаги' })} (${tayyor}/3)`} onClick={onNext} /></>}>
      <QTushuncha zoom={Zoomable} tugadi={tugadi} keng harakatAvval
        sarlavha={tr({ uz: <>Telefonda zalga""", 'S8 nav (tekshiruv)')

# --- 345: 30 soniyadan oldin «To'xtatish» — bir marta ogohlantiradi, ikkinchi bosishda to'xtaydi (isbot emas, eslatma)
rep("""  const [done, setDone] = useState(!!st.solved);
  // F-1018-07 (222.1)""", """  const [done, setDone] = useState(!!st.solved);
  const [erta, setErta] = useState(false); // F-1015-345: 30 s dan oldin to'xtatish — bir marta eslatma
  // F-1018-07 (222.1)""", 'erta state')
rep("""  const boshla = () => { setVaqt(0); setYur(true); setToxtadi(false); };
  const toxtat = () => { setYur(false); setToxtadi(true); if (qadam === 0) setQadam(1); };
  const qayta = () => { setYur(false); setVaqt(0); setToxtadi(false); setQadam(0); };""",
"""  const ERTA_S = 30;
  const boshla = () => { setVaqt(0); setYur(true); setToxtadi(false); setErta(false); };
  const toxtat = () => { if (!isMentor && vaqt < ERTA_S && !erta) { setErta(true); return; } setErta(false); setYur(false); setToxtadi(true); if (qadam === 0) setQadam(1); };
  const qayta = () => { setYur(false); setVaqt(0); setToxtadi(false); setQadam(0); setErta(false); };""", 'toxtat')
rep("""      {yur && <span className="pt-tmr-h fade-step">{tr({ uz: 'Hozir siz gapirasiz', ru: 'Сейчас говорите вы' })}</span>}
      <span className="pt-tmr-t">
        {!yur && toxtadi && <QTugma ikkinchi onClick={qayta}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</QTugma>}
        {!yur && !toxtadi && <QTugma className="pt-halqa" onClick={boshla}>{tr({ uz: '3 daqiqani boshlash', ru: 'Запустить 3 минуты' })}</QTugma>}
        {yur && <QTugma className="pt-halqa" onClick={toxtat}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>}""",
"""      {yur && !erta && <span className="pt-tmr-h fade-step">{tr({ uz: 'Hozir siz gapirasiz', ru: 'Сейчас говорите вы' })}</span>}
      {yur && erta && <span className="pt-tmr-h erta fade-step">{tr({ uz: "Hali erta: pitch 3 daqiqa — oxirigacha ayting.", ru: 'Ещё рано: питч — 3 минуты, расскажите до конца.' })}</span>}
      <span className="pt-tmr-t">
        {!yur && toxtadi && <QTugma ikkinchi onClick={qayta}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</QTugma>}
        {!yur && !toxtadi && <QTugma className="pt-halqa" onClick={boshla}>{tr({ uz: '3 daqiqani boshlash', ru: 'Запустить 3 минуты' })}</QTugma>}
        {yur && <QTugma className={erta ? undefined : 'pt-halqa'} ikkinchi={erta} onClick={toxtat}>{erta ? tr({ uz: "Baribir to'xtatish", ru: 'Всё равно остановить' }) : tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>}""", 'tmr erta')
rep("""        .pt-tmr-h { font-size: 13px; font-weight: 700; color: ${T.accent}; }""", """        .pt-tmr-h { font-size: 13px; font-weight: 700; color: ${T.accent}; }
        .pt-tmr-h.erta { color: ${T.ink}; }""", 'css erta')

# --- 346: tuzatiladigan qatorda «Tuzatish» belgisi, qolganlari xira, Mentor bo'lak nomini aytadi
rep("""const Varaq = ({ varaq, setQ, faol, onBos, tanlov, vaqt, halqaI }) => (""", """const Varaq = ({ varaq, setQ, faol, onBos, tanlov, vaqt, halqaI, tanlovBor }) => (""", 'Varaq props')
rep("""          {r.tuzatildi && <em className="pt-tuz">{tr(TUZATILDI)}</em>}
        </span>
      </>;""", """          {r.tuzatildi && <em className="pt-tuz">{tr(TUZATILDI)}</em>}
        </span>
        {onBos && onBos(i) && <span className="q-btn q-2 pt-vq-tuz" aria-hidden="true">{tr({ uz: 'Tuzatish', ru: 'Исправить' })}</span>}
      </>;""", 'Varaq tuz')
rep("""        : <div key={i} className={cxx('pt-vq-q', r.belgi === '✗' && !r.tuzatildi && 'x')}>{ichi}</div>;""",
    """        : <div key={i} className={cxx('pt-vq-q', r.belgi === '✗' && !r.tuzatildi && 'x', tanlovBor && 'xira')}>{ichi}</div>;""", 'Varaq xira')
rep("""              <Varaq varaq={varaq} setQ={setQ} faol={qadam === 1} vaqt={vaqt} tanlov={ochiq} halqaI={birinchiX}""",
    """              <Varaq varaq={varaq} setQ={setQ} faol={qadam === 1} vaqt={vaqt} tanlov={ochiq} halqaI={birinchiX} tanlovBor={qadam === 2 && !done}""", 'Varaq chaqiriq')
rep("""        .pt-vq-q.x { border-color: ${fon(T.err, 0.5)}; }""", """        .pt-vq-q.x { border-color: ${fon(T.err, 0.5)}; }
        /* F-1015-346: Tuzating qadami — tuzatiladigan qatorda «Tuzatish», qolganlari xira */
        .pt-vq-q.xira { opacity: .5; }
        .pt-vq-tuz { grid-column: 1 / -1; justify-self: end; padding: 5px 12px; font-size: 13px; pointer-events: none; }""", 'css 346')
rep("""    : qadam === 2 ? (hammaOk ? { uz: "Varaqdagi izohga qarab bitta bo'lakni aniqroq qilib yozing.", ru: 'По замечанию в листе перепишите одну часть точнее.' } : { uz: "✗ olgan bo'lakni varaqdagi izohga qarab qayta yozing.", ru: 'Перепишите часть с ✗ по замечанию в листе.' })""",
    """    : qadam === 2 && ochiq !== null ? { uz: `«${tr(BOLAK[ochiq].nom)}» bo'lagini izohga qarab qayta yozing va «Saqlash»ni bosing.`, ru: `Перепишите часть «${tr(BOLAK[ochiq].nom)}» по замечанию и нажмите «Сохранить».` }
    : qadam === 2 && tuzI >= 0 ? (hammaOk ? { uz: `Hammasi ✓ — «${tr(BOLAK[tuzI].nom)}» bo'lagini aniqroq qiling: varaqda «Tuzatish»ni bosing.`, ru: `Везде ✓ — сделайте часть «${tr(BOLAK[tuzI].nom)}» точнее: нажмите «Исправить» в листе.` } : { uz: `«${tr(BOLAK[tuzI].nom)}» bo'lagi ✗ oldi — varaqda «Tuzatish»ni bosing.`, ru: `Часть «${tr(BOLAK[tuzI].nom)}» получила ✗ — нажмите «Исправить» в листе.` })""", 'mentor 346')
rep("""  const mentorT = done && aytildi ?""", """  const tuzI = qadam === 2 && !done ? varaq.findIndex((r, i) => ochiladi(i)) : -1;
  const mentorT = done && aytildi ?""", 'tuzI')
rep("""  hammaOk: { uz: "Hammasi ✓ — qaysi bo'lak yanada aniqroq bo'lishi mumkin?", ru: 'Везде ✓ — какая часть может быть ещё точнее?' },""",
    """  hammaOk: { uz: "Hammasi ✓ — qaysi bo'lak aniqroq bo'lishi mumkin? Izohga yozing: keyingi qadamda shu bo'lakni tuzatasiz.", ru: 'Везде ✓ — какая часть может быть точнее? Напишите в замечании: на следующем шаге исправите эту часть.' },""", 'hammaOk')

# --- 347: «tekshiruv yozuvi» o'rniga «sinab ko'rish uchun o'zingiz qo'shgansiz»; test ostidagi vizual olinadi (213.16)
rep("""    { ic: '2', h: { uz: 'Unda namuna va tekshiruv yozuvlari ham bor.', ru: 'В нём есть и образцы, и проверочные записи.' } },""",
    """    { ic: '2', h: { uz: "Unda sinab ko'rish uchun o'zingiz qo'shgan yozuvlar ham bor.", ru: 'В нём есть и записи, которые вы сами добавили для проверки.' } },""", 'recap')
rep("""    questionText="Kitob ilovangiz Database'ida 12 ta kitob; 5 tasi — tekshiruv yozuvingiz. Nima deysiz?"
    question={tr({ uz: <h2 className="title h-ask">Kitob ilovangiz Database'ida 12 ta kitob; 5 tasi — tekshiruv yozuvingiz. <A>Nima deysiz?</A></h2>, ru: <h2 className="title h-ask">В Database вашего книжного приложения 12 книг; 5 из них — ваши проверочные записи. <A>Что скажете?</A></h2> })}""",
    """    questionText="Kitob ilovangiz Database'ida 12 ta kitob bor; 5 tasini sinab ko'rish uchun o'zingiz qo'shgansiz. Nima deysiz?"
    question={tr({ uz: <h2 className="title h-ask">Kitob ilovangiz Database'ida 12 ta kitob bor; 5 tasini sinab ko'rish uchun o'zingiz qo'shgansiz. <A>Nima deysiz?</A></h2>, ru: <h2 className="title h-ask">В Database вашего книжного приложения 12 книг; 5 из них вы сами добавили, чтобы проверить. <A>Что скажете?</A></h2> })}""", 'question')
rep("""      1: { uz: 'Son rost, lekin ichida tekshiruvlaringiz ham bor.', ru: 'Число верное, но внутри есть и ваши проверки.' },""",
    """      1: { uz: "Son rost, lekin 5 tasini o'zingiz qo'shgansiz.", ru: 'Число верное, но 5 из них добавили вы сами.' },""", 'explain 1')
rep("""    }}
    vizual={<SonViz />} />""", """    }} />""", 'vizual')
a = s.index("const SonViz = () => ("); b = s.index("const Screen12 = (props) =>")
s = s[:a] + s[b:]
rep("""        .pt-yv { display: flex; flex-direction: column; }
        .pt-yv mark { background: ${T.okFon}; color: ${T.ok}; font-weight: 700; border-radius: 4px; padding: 0 2px; }
""", "", 'css yv')
open(F, 'w', encoding='utf8').write(s); print('✅', F)
