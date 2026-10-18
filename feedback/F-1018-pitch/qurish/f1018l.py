# F-1018-12 · m12-02 PmStoryPitchLesson (LMS 14-Modul 2-dars) 15 → 10 (222-qonun). Zaxiradan quradi: python3 f1018l.py
import re, sys
R = '/home/kali/Desktop/internetLesson'
SRC = f'{R}/arxiv/F-1018-12-oldin/PmStoryPitchLesson.jsx'
DST = f'{R}/src/12-Modull/PmStoryPitchLesson.jsx'
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

rep("lessonId: 'pm-m12d2-v1'", "lessonId: 'pm-m12d2-v2'")
rep("const Brend = ({ r, children }) => <b className={cxx('sp-brend', r)}>{children}</b>; // iPhone · Nokia · BlackBerry — 11-Modul ranglari (9.97), logotipsiz\n", "", 'Brend')
rep(" · HAKAM_SAVOL · IPHONE_KADR · VIDEO_SAVOL", " · HAKAM_SAVOL · VIDEO_SAVOL", 'manba')
rep("""// Ekranlar: s0 QKirish · s1 QReja · s2 QTushuncha (ro'yxat va lahza) · s3 test · s4 QVoqea (K19 iPhone) · s5 test · s6 QTushuncha (hikoya pitchda) · s7 test ·
//   s8 QMustaqil (uch karta) · s9 QMustaqil (video, rozilik darvozasi) · s10 QMustaqil (o'zini tekshirish) · s11 yakuniy test · podium · QKartochka · QYakun.""",
"""// v2 (F-1018-12 · 222-qonun, 10 ekran): s0 QKirish · s1 QReja · s2 QTushuncha (ro'yxat va lahza) · s6 QTushuncha (hikoya pitchda) ·
//   s8 QMustaqil (uch karta) · s9 QMustaqil (video / taymer — 1-raund) · s10 QMustaqil (2-RAUND: sherikka 1 daqiqa, sherik uch savolni belgilaydi) · s11 yakuniy test · podium · QYakun.
//   Olindi: iPhone keysi (s4), 1-, 2-, 3-savol (s3, s5, s7), kartochkalar. Yakuniy MD: feedback/F-1018-pitch/YAKUNIY-09-m12-02.md""", 'header')
rep("// Bitta vizual — HikoyaSahna (telefon · uch uya · funksiyalar ro'yxati · pitch tasmasi); keys — IphoneSahna.", "// Bitta vizual — HikoyaSahna (telefon · uch uya · funksiyalar ro'yxati · pitch tasmasi).", 'header 2')
a = s.index('const SCREEN_META = ['); b = s.index('const TOTAL_SCREENS')
s = s[:a] + """const SCREEN_META = [
  { id: 's0',            type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },   // 0 · QKirish
  { id: 's1',            type: 'rule',        template: 'custom',   scored: false, scope: null },     // 1 · QReja
  { id: 'royxatLahza',   type: 'exploration', template: 'custom',   scored: false, scope: null },     // 2 · ro'yxat va lahza
  { id: 'pitchdaHikoya', type: 'exploration', template: 'custom',   scored: false, scope: null },     // 3 · hikoya pitchda
  { id: 'hikoya',        type: 'practice',    template: 'custom',   scored: false, scope: null },     // 4 · uch karta (ustaxona)
  { id: 'video',         type: 'practice',    template: 'custom',   scored: false, scope: null },     // 5 · video / taymer — 1-raund
  { id: 'tekshirish',    type: 'practice',    template: 'custom',   scored: false, scope: null },     // 6 · sherikka 1 daqiqa — 2-raund (222.1)
  { id: 's11',           type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },  // 7 · yakuniy savol
  { id: 'podium',        type: 'stats',       template: 'custom',   scored: false, scope: null },     // 8 · podium
  { id: 's14',           type: 'summary',     template: 'custom',   scored: false, scope: null }      // 9 · QYakun
];
""" + s[b:]
rep("const INLINE_KEYS = { s3: 1, s5: 3, s7: 2, s11: 0, practice: -1 };", "const INLINE_KEYS = { s11: 0, practice: -1 };")
a = s.index('const RECAPS = {'); b = s.index('\n};', a) + 3
m = re.search(r"\n  11: \{.*?\n  \},?", s[a:b], re.S)
if not m: print('❌ RECAPS 11'); sys.exit(1)
s = s[:a] + 'const RECAPS = {' + m.group(0).replace('\n  11: {', '\n  7: {').rstrip(',') + '\n};' + s[b:]
a = s.index('const Q_LABELS = {'); b = s.index('\n};', a) + 3
s = s[:a] + """const Q_LABELS = {
  7: { uz: "Yakuniy — Videoda ro'yxat chiqsa", ru: 'Итог — Если в видео получился список' }
};""" + s[b:]
a = s.index('const SCREEN_INTENTS = ['); b = s.index('\n];', a) + 3
s = s[:a] + """const SCREEN_INTENTS = [
  "kirish: ro'yxat bilan boshlangan pitchdan zal nimani bilib oladi", "reja: hikoya yozib, telefonga va sherikka aytish", "ro'yxat o'rniga kim · lahza · o'zgarish; mahsulot hikoyasi tug'iladi",
  "hikoya ikki bo'lakka: Muammo va Yechim; Raqamlar tashqarida", "o'z hikoyasi uch kartaga, pm-m12d2-hikoya", "telefonga 1 daqiqa; rozilik darvozasi (1-raund)",
  "sherikka 1 daqiqa; sherik uch savolni belgilaydi (2-raund)", "yakuniy test: videoda ro'yxat chiqsa", 'podium', 'yakun: 5 holat'
];""" + s[b:]

# ---- 2-raund: VIDEO_BOSH ga qayta (sherikka aytish vaqti); format kengayadi, eski maydonlar o'zgarmaydi
rep("const VIDEO_BOSH = { yozildi: null, lahzaBilan: null, royxatYoq: null, vaqtgaSigdi: null, vaqt: null };",
    "const VIDEO_BOSH = { yozildi: null, lahzaBilan: null, royxatYoq: null, vaqtgaSigdi: null, vaqt: null, qayta: null }; // qayta — 2-raund vaqti (F-1018-12)")

NEW10 = r"""// ===== SCREEN 10 — 2-RAUND: SHERIK TEKSHIRADI (QMustaqil; F-1018-12, 222.1: hikoya sherikka 1 daqiqada aytiladi, sherik VIDEO_SAVOL varag'ini «Ha»/«Yo'q» bilan to'ldiradi; «Yo'q» → maslahat + «Kartani ochish»; yakka rejimda o'zi) · nishon Pair Check! =====
const VIDEO_SAVOL = [
  { id: 'lahzaBilan', t: { uz: 'Hikoya lahza bilan boshlandimi?', ru: 'История началась с момента?' }, maslahat: { uz: "Lahzani birinchi gapga qo'ying: kun, soat va nima bo'ldi.", ru: 'Поставьте момент в первую фразу: день, час и что произошло.' }, karta: ['lahza'] },
  { id: 'royxatYoq', t: { uz: "Funksiyalar ro'yxatisiz gapirdingizmi?", ru: 'Вы говорили без списка функций?' }, maslahat: { uz: "Funksiyalar o'rniga bitta o'zgarishni ayting.", ru: 'Вместо функций назовите одно изменение.' }, karta: ['ozgarish'] },
  { id: 'vaqtgaSigdi', t: { uz: "Hikoya 1 daqiqaga sig'dimi?", ru: 'История уложилась в 1 минуту?' }, maslahat: { uz: 'Har kartadan bitta qisqa gap qoldiring.', ru: 'Оставьте по одной короткой фразе с каждой карточки.' }, karta: ['kim', 'lahza', 'ozgarish'] }
];
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const juft = !!(_live && _live.mode === 'student');
  const achMiss = useContext(AchMissCtx);
  const [h, setH] = useState(() => hikoyaOl());
  const bor = kartaSoni(h) > 0;
  const tm = useTaymer();
  const [vaqt, setVaqt] = useState(() => (typeof h.video.qayta === 'number' ? h.video.qayta : null));
  const toxtadi = vaqt !== null;
  const [javob, setJavob] = useState(() => (typeof h.video.qayta === 'number' ? Object.fromEntries(VIDEO_SAVOL.map(v => [v.id, h.video[v.id]])) : {}));
  const [ozgardi, setOzgardi] = useState({});
  const [ochiq, setOchiq] = useState(null); // { savol, qism }
  const [yon, setYon] = useState({});
  const soni = VIDEO_SAVOL.filter(v => typeof javob[v.id] === 'boolean').length;
  const toliq = soni === 3;
  const done = isMentor || (toxtadi && toliq);
  const yon2 = tm.ish ? QISM_ID[Math.min(2, Math.floor(tm.s / 20))] : null;
  const chaqn = (qismlar, tur) => { setYon(Object.fromEntries(qismlar.map(k => [k, tur]))); setTimeout(() => setYon({}), 1100); };
  const boshla = () => { setVaqt(null); setJavob({}); setOchiq(null); tm.boshla(); };
  const toxtat = () => { tm.toxtat(); const v = Math.round(tm.s); setVaqt(v); if (!isMentor) setH(hikoyaYoz(null, { qayta: v })); };
  const bel = (v, val) => {
    if (!toxtadi || isMentor) return;
    const yangi = { ...javob, [v.id]: val };
    setJavob(yangi);
    setH(hikoyaYoz(null, { [v.id]: val }));
    if (val) chaqn(v.karta, 'ok');
    if (ochiq && ochiq.savol === v.id && val) setOchiq(null);
    if (VIDEO_SAVOL.every(x => typeof yangi[x.id] === 'boolean') && !toliq) {
      if (achMiss && achMiss.earn) achMiss.earn('pairCheck');
      if (storedAnswer === undefined) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'sherik', solved: true, correct: true, picked: true, vaqt });
      if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  };
  const kartaSaqla = (qism, m) => {
    const d = isMentor ? { ...h, [qism]: m } : hikoyaYoz({ [qism]: m });
    setH(d); setOzgardi(o => ({ ...o, [ochiq.savol]: true })); chaqn([qism], 'acc'); setOchiq(null);
  };
  const birinchiBosh = VIDEO_SAVOL.findIndex(x => typeof javob[x.id] !== 'boolean');
  const varaq = <div className="sp-varaq">
    <span className="q-yorliq">{juft ? tr({ uz: "Sherik varag'i", ru: 'Лист партнёра' }) : tr({ uz: 'Uch savol', ru: 'Три вопроса' })}</span>
    {VIDEO_SAVOL.map((v, i) => {
      const j = javob[v.id];
      return (
        <div key={v.id} className={cxx('sp-vq', j === true && 'ha', j === false && 'yoq', toxtadi && j == null && i === birinchiBosh && 'navbat', !toxtadi && 'kutadi')}>
          <div className="sp-vq-r">
            <span className="sp-vq-t"><b>{i + 1}</b>{tr(v.t)}{v.id === 'vaqtgaSigdi' && toxtadi && <em className="sp-vq-vaqt">{tr({ uz: 'Taymerda:', ru: 'На таймере:' })} {mss(vaqt)}</em>}</span>
            {!isMentor && <span className="sp-vq-tug">
              <QChip holat={j === true ? 'ok' : undefined} disabled={!toxtadi} onClick={() => bel(v, true)}>{tr({ uz: 'Ha', ru: 'Да' })}</QChip>
              <QChip holat={j === false ? 'err' : undefined} disabled={!toxtadi} onClick={() => bel(v, false)}>{tr({ uz: "Yo'q", ru: 'Нет' })}</QChip>
              {j === false && ozgardi[v.id] && <em className="sp-vq-oz">{tr({ uz: "karta o'zgartirildi", ru: 'карточка изменена' })}</em>}
            </span>}
          </div>
          {j === false && <div className="sp-vq-m">
            <p className="sp-kulrang">{tr(v.maslahat)}</p>
            {bor && <QTugma ikkinchi onClick={() => setOchiq({ savol: v.id, qism: v.karta[0] })}>{tr({ uz: 'Kartani ochish', ru: 'Открыть карточку' })}</QTugma>}
          </div>}
        </div>
      );
    })}
    {isMentor && <p className="sp-kulrang">{tr({ uz: "Juftlik: A hikoyani 1 daqiqada aytadi, B uch savolga «Ha»/«Yo'q» qo'yadi; keyin almashadilar (≈ 4 daqiqa). «Yo'q» chiqsa — o'sha kartani shu yerda tuzatadi.", ru: 'Пара: A рассказывает историю за 1 минуту, B ставит «Да»/«Нет» на три вопроса; потом меняются (≈ 4 минуты). Если «Нет» — эту карточку исправляют здесь же.' })}</p>}
    {isMentor && <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: 'Sherikka aytib, belgilatganlar', ru: 'Рассказали партнёру и получили отметки' }} />}
  </div>;
  const taymerQ = !isMentor && <div className="sp-r2">
    <Taymer s={tm.ish ? tm.s : (vaqt || 0)} ish={tm.ish} />
    <div className="sp-r2-tug">
      {tm.ish && <span className="sp-r2-h">{tr({ uz: 'Hozir siz gapirasiz', ru: 'Сейчас говорите вы' })}</span>}
      {tm.ish ? <QTugma className="sp-halqa" onClick={toxtat}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>
        : toxtadi ? <QTugma ikkinchi onClick={boshla}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</QTugma>
          : <QTugma className="sp-halqa" onClick={boshla}>{tr({ uz: '1 daqiqani boshlash', ru: 'Запустить 1 минуту' })}</QTugma>}
    </div>
  </div>;
  const ochiqSavol = ochiq && VIDEO_SAVOL.find(v => v.id === ochiq.savol);
  const chap = ochiq
    ? <div className="sp-v-chap">
      {ochiqSavol.karta.length > 1 && <div className="sp-strip">{ochiqSavol.karta.map((k, i) => <QChip key={k} holat={ochiq.qism === k ? 'on' : undefined} className="sp-tab" onClick={() => setOchiq(o => ({ ...o, qism: k }))}><i>{i + 1}</i>{tr(QISM_NOM[k])}</QChip>)}</div>}
      <KartaTahrir key={ochiq.savol + ochiq.qism} qism={ochiq.qism} boshMatn={h[ochiq.qism] || ''} onSaqla={kartaSaqla} />
    </div>
    : <div className="sp-v-chap"><HikoyamKarta h={h} mentor={isMentor || !bor} yonadi={yon2 ? { [yon2]: 'yon' } : yon} /></div>;
  const hammasiHa = toliq && VIDEO_SAVOL.every(v => javob[v.id] === true);
  const mentorT = isMentor ? { uz: "O'quvchilar juftlikda: biri hikoyani 1 daqiqada aytadi, sherigi uch savolni belgilaydi.", ru: 'Ученики в парах: один рассказывает историю за 1 минуту, партнёр отмечает три вопроса.' }
    : tm.ish ? { uz: "Gapiring; hikoya tugagach «To'xtatish»ni bosing.", ru: 'Говорите; когда история закончится, нажмите «Остановить».' }
      : !toxtadi ? (juft ? { uz: "Endi hikoyani sherigingizga ayting: «1 daqiqani boshlash»ni bosing. U tinglab, uch savolga javob beradi.", ru: 'Теперь расскажите историю партнёру: нажмите «Запустить 1 минуту». Он слушает и отвечает на три вопроса.' } : { uz: "Hikoyani yana bir marta ovoz chiqarib ayting: «1 daqiqani boshlash»ni bosing, keyin uch savolga o'zingiz javob bering.", ru: 'Расскажите историю ещё раз вслух: нажмите «Запустить 1 минуту», потом сами ответьте на три вопроса.' })
        : !toliq ? (juft ? { uz: "Qurilmani sherigingizga bering: u har savolga «Ha» yoki «Yo'q»ni bosadi.", ru: 'Дайте устройство партнёру: он нажмёт «Да» или «Нет» на каждый вопрос.' } : { uz: "Har savolga «Ha» yoki «Yo'q»ni bosing.", ru: 'Нажмите «Да» или «Нет» на каждый вопрос.' })
          : hammasiHa ? { uz: "Uchala savolga «Ha» — «Davom etish»ni bosing.", ru: 'На все три вопроса «Да» — нажмите «Продолжить».' } : { uz: "«Yo'q» chiqqan kartani oching va tuzating — uyda shu karta bilan qayta yozasiz.", ru: 'Откройте карточку с «Нет» и исправьте — дома перезапишете по ней.' };
  return (
    <Stage eyebrow={juft ? tr({ uz: 'Juftlikda ish · 2-raund', ru: 'Работа в паре · раунд 2' }) : tr({ uz: 'Mustaqil ish · 2-raund', ru: 'Самостоятельная работа · раунд 2' })} screen={screen} scrollSignal={soni + (toxtadi ? 5 : 0) + (ochiq ? 10 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done} disabled={!done} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !toxtadi ? tr({ uz: '1 daqiqada ayting', ru: 'Расскажите за 1 минуту' }) : tr({ uz: `Savollarga javob bering (${soni}/3)`, ru: `Ответьте на вопросы (${soni}/3)` })} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={juft
          ? tr({ uz: <>Hikoyangizni sherigingizga ayting: <A>u nimani eshitdi?</A></>, ru: <>Расскажите историю партнёру: <A>что он услышал?</A></> })
          : tr({ uz: <>Hikoyani yana bir marta ayting: <A>qanday chiqdi?</A></>, ru: <>Расскажите историю ещё раз: <A>как получилось?</A></> })}
        mentor={<Mentor>{tr(mentorT)}</Mentor>}
        forma={<div className="sp-video">{chap}<div className="sp-v-ong">{taymerQ}{varaq}</div></div>}
      >
        {toxtadi && toliq && !ochiq && !isMentor && <QXulosa>{hammasiHa
          ? tr({ uz: "Uchala savolga «Ha»: hikoya lahzadan boshlandi va 1 daqiqaga sig'di.", ru: 'На все три вопроса «Да»: история началась с момента и уложилась в 1 минуту.' })
          : juft ? tr({ uz: "Sherik tuzatadigan joy topdi — kartani o'zgartiring, uyda shu karta bilan qayta yozasiz.", ru: 'Партнёр нашёл, что исправить, — измените карточку, дома перезапишете по ней.' })
            : tr({ uz: "Tuzatadigan joy topildi — kartani o'zgartiring, uyda shu karta bilan qayta yozasiz.", ru: 'Нашлось, что исправить, — измените карточку, дома перезапишете по ней.' })}</QXulosa>}
      </QMustaqil>
    </Stage>
  );
};

"""
a = s.index("// ===== SCREEN 10 — O'ZINGIZ TEKSHIRING"); b = s.index("// ===== SCREEN 11 — YAKUNIY SAVOL")
s = s[:a] + NEW10 + s[b:]

# ---- olinadi
cut("// ===== SCREEN 3 — 1-SAVOL", "// ===== SCREEN 6 — HIKOYA PITCHDA", "s3 test + s4 iPhone + s5 test")
cut("// ===== SCREEN 7 — 3-SAVOL", "// ===== SCREEN 8 — HIKOYANGIZ", "s7 test")
cut("// 🃏 Kartochka mexanikasi", "// ===== UYGA VAZIFA", "kartochkalar")

# ---- REJA, nishonlar, yakun
rep("""  { t: { uz: "Hikoyani telefonga aytib, o'zingiz tekshirasiz", ru: 'Расскажете историю на телефон и проверите себя' }, teg: { uz: 'video', ru: 'видео' } }""",
    """  { t: { uz: "Hikoyani telefonga aytasiz, keyin sherigingizga — u uch savol bilan tekshiradi", ru: 'Расскажете историю на телефон, потом партнёру — он проверит её тремя вопросами' }, teg: { uz: 'video · sherik', ru: 'видео · партнёр' } }""", 'REJA')
rep("""  oneMoment: { icon: '📍', name: 'One Moment!', desc: { uz: 'Lahzali gapni birinchi urinishda topdingiz', ru: 'Вы с первой попытки нашли фразу с моментом' } },
  fewerButtons: { icon: '📱', name: 'Fewer Buttons!', desc: { uz: "iPhone voqeasidagi o'xshash usulni topdingiz", ru: 'Вы нашли похожий приём в истории iPhone' } },
""", "", 'ach test')
rep("""  selfCheck: { icon: '🎬', name: 'Self Check!', desc: { uz: "Videongizni ko'rib, uch savolga javob berdingiz", ru: 'Вы посмотрели своё видео и ответили на три вопроса' } }""",
    """  pairCheck: { icon: '🤝', name: 'Pair Check!', desc: { uz: 'Hikoyani sherigingizga aytib, uch savolga tekshirtirdingiz', ru: 'Рассказали историю партнёру и проверили её тремя вопросами' } }""", 'pairCheck')
rep("// Ekran id → nishon (birinchi urinish; faqat ballik test). My Story! va Self Check! — 8, 10-ekranlar ichida (ish qilinganda), AchMissCtx.earn orqali.\nconst ACH_TRIGGERS = { s3: 'oneMoment', s5: 'fewerButtons' };",
    "// v2: ballik test nishoni yo'q (bitta yakuniy test). My Story! va Pair Check! — ustaxona va 2-raund ichida, AchMissCtx.earn orqali.\nconst ACH_TRIGGERS = {};", 'ACH_TRIGGERS')
rep("""  tayyor: { uz: 'Hikoyangiz yozildi va videoda tekshirildi.', ru: 'Ваша история записана и проверена на видео.' },
  yoq: { uz: 'Hikoya yozildi — videoda tuzatadigan joy topildi.', ru: 'История записана — в видео нашлось что исправить.' },
  tekshiruvYoq: { uz: 'Hikoya yozildi, video tekshiruvi hali qilinmagan.', ru: 'История записана, проверка видео ещё не сделана.' },""",
    """  tayyor: { uz: 'Hikoyangiz yozildi va ikki marta aytib tekshirildi.', ru: 'Ваша история записана и проверена в двух рассказах.' },
  yoq: { uz: 'Hikoya yozildi — tekshiruvda tuzatadigan joy topildi.', ru: 'История записана — при проверке нашлось, что исправить.' },
  tekshiruvYoq: { uz: 'Hikoya yozildi, 2-raund tekshiruvi hali qilinmagan.', ru: 'История записана, проверка во втором раунде ещё не сделана.' },""", 'SARLAVHA')
rep("""    : n === 3 ? (v.yozildi === true && jv.every(x => x === true) ? 'tayyor' : v.yozildi === true && jv.some(x => x === false) ? 'yoq' : 'tekshiruvYoq')""",
    """    : n === 3 ? (jv.every(x => x === true) ? 'tayyor' : jv.some(x => x === false) ? 'yoq' : 'tekshiruvYoq')""", 'holat')
rep("""  { uz: "iPhone voqeasida Apple ko'p tugmani olib tashlab, keraklisini qoldirgan.", ru: 'В истории iPhone Apple убрала много кнопок и оставила нужное.' },
""", """  { uz: "Hikoyani ikki marta aytasiz: telefonga, keyin sherikka — u uch savol bilan tekshiradi.", ru: 'Историю рассказывают дважды: на телефон, потом партнёру — он проверяет её тремя вопросами.' },
""", 'RECAP')

# ---- arena: iPhone savollari (5 C, 6 B, 7 D) → dars savollari, o'rinlar saqlanadi
rep("""  { q: { uz: 'Telefon kompaniyalari 2007-yilda nima bilan bellashgan?', ru: 'Чем соревновались телефонные компании в 2007 году?' }, opts: [{ uz: 'Kimda tugma kamroq ekani bilan', ru: 'У кого меньше кнопок' }, { uz: 'Kimda Home tugmasi borligi bilan', ru: 'У кого есть кнопка Home' }, { uz: "Kimda tugma ko'proq ekani bilan", ru: 'У кого больше кнопок' }, { uz: 'Kimda iPod pleeri borligi bilan', ru: 'У кого есть плеер iPod' }], correct: 2 },""",
    """  { q: { uz: "Sherik «Ro'yxatsiz gapirdingizmi?» savoliga «Yo'q» desa, nima qilasiz?", ru: 'Партнёр на вопрос «Говорили без списка?» ответил «Нет». Что сделаете?' }, opts: [{ uz: "Ro'yxatni tezroq aytaman", ru: 'Скажу список быстрее' }, { uz: "Ro'yxatga funksiya qo'shaman", ru: 'Добавлю функцию в список' }, { uz: "Bitta o'zgarishni aytaman", ru: 'Назову одно изменение' }, { uz: 'Hikoyani olib tashlayman', ru: 'Уберу историю' }], correct: 2 },""", 'arena 5')
rep("""  { q: { uz: "Apple iPhone'dan nimalarni olib tashlagan?", ru: 'Что Apple убрала из iPhone?' }, opts: [{ uz: 'Ekran va Home tugmasini', ru: 'Экран и кнопку Home' }, { uz: 'Klaviatura va stilusni', ru: 'Клавиатуру и стилус' }, { uz: 'Telefon va internetni', ru: 'Телефон и интернет' }, { uz: 'iPod musiqa pleerini', ru: 'Музыкальный плеер iPod' }], correct: 1 },""",
    """  { q: { uz: 'Mahsulot hikoyasi qaysi gap bilan boshlanadi?', ru: 'С какой фразы начинается история продукта?' }, opts: [{ uz: 'Mahsulot nomi bilan', ru: 'С названия продукта' }, { uz: 'Bitta lahza bilan', ru: 'С одного момента' }, { uz: 'Funksiyalar soni bilan', ru: 'С числа функций' }, { uz: 'Foydalanuvchilar soni bilan', ru: 'С числа пользователей' }], correct: 1 },""", 'arena 6')
rep("""  { q: { uz: "Jobs iPhone'ni qaysi ibora bilan taqdim etgan?", ru: 'Какой фразой Джобс представил iPhone?' }, opts: [{ uz: 'Ikki qurilma bittada', ru: 'Два устройства в одном' }, { uz: "To'rt qurilma bittada", ru: 'Четыре устройства в одном' }, { uz: 'Bitta tugmali telefon', ru: 'Телефон с одной кнопкой' }, { uz: 'Uch qurilma bittada', ru: 'Три устройства в одном' }], correct: 3 },""",
    """  { q: { uz: "Hikoya necha daqiqaga sig'ishi kerak?", ru: 'Во сколько минут должна уложиться история?' }, opts: [{ uz: '3 daqiqaga', ru: 'В 3 минуты' }, { uz: '5 daqiqaga', ru: 'В 5 минут' }, { uz: '2 daqiqaga', ru: 'В 2 минуты' }, { uz: '1 daqiqaga', ru: 'В 1 минуту' }], correct: 3 },""", 'arena 7')

# ---- root
rep("""  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });""",
"""  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));""", 'root nav')
s = re.sub(r"\n  // 🃏 Flashcard[^\n]*", "", s)
rep("const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, ScreenPodium, ScreenFlashcards, SummaryScreen];",
    "const screens = [Screen0, Screen1, Screen2, Screen6, Screen8, Screen9, Screen10, Screen11, ScreenPodium, SummaryScreen];")

# ---- CSS: 2-raund taymer qatori, kutadigan qator; savol qatorida chegara yo'q (213.3)
rep("""        .sp-vq.ha { background: ${T.okFon}; border-color: ${fon(T.ok, 0.55)}; }
        .sp-vq.yoq { border-color: ${T.err}; }""", """        .sp-vq.ha { background: ${T.okFon}; border-color: transparent; }
        .sp-vq.yoq { background: ${fon(T.err, 0.1)}; border-color: transparent; }
        .sp-vq.kutadi { opacity: .6; }
        /* 2-raund (F-1018-12): taymer + tugma bitta qatorda */
        .sp-r2 { display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; border-radius: 14px; background: ${T.paper}; border: 1.5px solid ${T.line}; }
        .sp-r2 .sp-taymer { padding: 0; border: 0; background: transparent; }
        .sp-r2-tug { display: flex; align-items: center; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
        .sp-vq-t { display: grid !important; grid-template-columns: auto minmax(0,1fr); column-gap: 8px; align-items: baseline; }
        .sp-vq-t > em { grid-column: 2; }
        .sp-r2-h { margin-right: auto; font-size: 13px; font-weight: 700; color: ${T.accent}; }""", 'css r2')

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
css = re.sub(r"\n[ \t]*/\* iPhone sahnasi \(K19\) \*/", "", css)
# 3-o'tish: iPhone keysi qoldiqlari (birlashgan satrlar) — Brend / sp-mini-ip / QVoqea endi ishlatilmaydi
for pat in [r"\n[ \t]*\.sp-brend \{[^\n]*", r"\n[ \t]*@media \(max-width: 760px\) \{ \.sp-voqea-g[^\n]*", r"\n[ \t]*\.sp-mini-ip \.sp-ip-home[^\n]*",
            r"\n[ \t]*\.sp-flash \.fc-back[^\n]*", r"\n[ \t]*\.sp-flash \.fc-front[^\n]*", r"\n[ \t]*\.q-voqea > \.zoomable \{ align-self: stretch; \} \.voqea-tola[^\n]*"]:
    css, c = re.subn(pat, '', css)
    if c > 1: print('❌ 3-otish', pat, c); sys.exit(1)
    removed += c  # 2-o'tish allaqachon olgan bo'lsa — 0
s = s[:ca] + css + s[cb:]
print(f"  o'lik CSS: {len(DEAD)} klass, {removed} qator; qolgan: {sorted(dead_classes(s) - d0)}")
open(DST, 'w', encoding='utf8').write(s)
print('✅ yozildi', DST, s.count('\n') + 1, 'qator')
