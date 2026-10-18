# F-1018-11 · m12-01 PmInvestorPitchLesson (LMS 14-Modul 1-dars) 16 → 10 (222-qonun). Zaxiradan quradi: python3 f1018j.py
import re, sys
R = '/home/kali/Desktop/internetLesson'
SRC = f'{R}/arxiv/F-1018-11-oldin/PmInvestorPitchLesson.jsx'
DST = f'{R}/src/12-Modull/PmInvestorPitchLesson.jsx'
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
def seg(a_m, b_m, pairs, label):
    """Segment ichida (a_m dan b_m gacha) almashtirishlar — bir xil satr boshqa ekranlarda ham bor."""
    global s
    a = s.find(a_m); b = s.find(b_m, a + 1)
    if a < 0 or b <= a: print(f'❌ seg {label}: {a} {b}'); sys.exit(1)
    body = s[a:b]
    for old, new, rx in pairs:
        if rx:
            body, c = re.subn(old, new, body, count=1)
        else:
            c = body.count(old)
            if c == 1: body = body.replace(old, new)
        if c != 1: print(f'❌ seg {label} / {old[:60]!r}: topildi {c}'); sys.exit(1)
    s = s[:a] + body + s[b:]

rep("lessonId: 'pm-m12d1-v1'", "lessonId: 'pm-m12d1-v2'")
rep("// 16 ekran (MD v3) · ballik testlar 4, 6, 8, 12 (ketma-ket emas — P-012)",
    "// 10 ekran (v2 · F-1018-11 · 222-qonun): kirish · reja · olti bo'lak · UCH YANGI BO'LAK (Bozor → Jamoa → Keyingi qadam bitta ekranda, chip-qator) · tartib-mashqi · qoralama (ustaxona) · SHERIKKA O'QING (2 daq, sherik — investor: olti savolga javob bormi) · yakuniy savol · podium · yakun.\n//   Olindi: Airbnb (s3), 1-, 2-, 3-savol (s4, s6, s8), kartochkalar. Ballik test — bitta (s12). Yakuniy MD: feedback/F-1018-pitch/YAKUNIY-08-m12-01.md", 'header')
a = s.index('const SCREEN_META = ['); b = s.index('const TOTAL_SCREENS')
s = s[:a] + """const SCREEN_META = [
  { id: 's0',        type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },   // 0 · QKirish
  { id: 's1',        type: 'rule',        template: 'custom',   scored: false, scope: null },     // 1 · QReja
  { id: 'oltiBolak', type: 'exploration', template: 'custom',   scored: false, scope: null },     // 2 · olti bo'lak
  { id: 'uchBolak',  type: 'exploration', template: 'custom',   scored: false, scope: null },     // 3 · Bozor → Jamoa → Keyingi qadam (bitta ekran, 3 qism)
  { id: 'tartib',    type: 'practice',    template: 'custom',   scored: false, scope: null },     // 4 · Mentor qoralamasi — tartib
  { id: 'practice',  type: 'practice',    template: 'custom',   scored: false, scope: null },     // 5 · pitch qoralamasi (ustaxona)
  { id: 'sherik',    type: 'practice',    template: 'custom',   scored: false, scope: null },     // 6 · sherikka o'qing (222.1, 1-raund)
  { id: 's12',       type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },  // 7 · yakuniy savol
  { id: 'podium',    type: 'stats',       template: 'custom',   scored: false, scope: null },     // 8 · podium
  { id: 's15',       type: 'summary',     template: 'custom',   scored: false, scope: null }      // 9 · QYakun
];
""" + s[b:]
rep("""// To'g'ri javob o'rinlari (MD): s4 B · s6 D · s8 A · s12 C — har biri har xil.
// MD KOD 14 dagi ballsiz ekran sentinel'lari (oltiBolak, airbnb, bozor, jamoa, keyingi, tartib) — jsx-lint «o'lik kalit» (submitAnswer ga uzatilmaydi), shuning uchun yo'q; practice — 11-ekran signali.
const INLINE_KEYS = { s4: 1, s6: 3, s8: 0, s12: 2, practice: -1 };""",
"""// v2 (222-qonun): ballik test bitta — s12 C. Ballsiz ekran sentinel'lari yo'q (jsx-lint «o'lik kalit»); practice — ustaxona signali.
const INLINE_KEYS = { s12: 2, practice: -1 };""", 'INLINE_KEYS')
a = s.index('const RECAPS = {'); b = s.index('\n};', a) + 3
m = re.search(r"\n  12: \{.*?\n  \},?", s[a:b], re.S)
if not m: print('❌ RECAPS 12'); sys.exit(1)
s = s[:a] + 'const RECAPS = {' + m.group(0).replace('\n  12: {', '\n  7: {').rstrip(',') + '\n};' + s[b:]
a = s.index('// Podium savol yorliqlari (SCORED_IDX'); b = s.index('\n};', a) + 3
s = s[:a] + """// Podium savol yorliqlari (SCORED_IDX: 7 — yakuniy)
const Q_LABELS = {
  7: { uz: 'Yakuniy — Keyingi qadam', ru: 'Итоговый — Следующий шаг' }
};""" + s[b:]

# ---- Bozor / Jamoa / Keyingi qadam → qismlar (Stage'siz), ScreenUch ularni bitta ekranda ketma-ket ko'rsatadi
def qism(a_m, b_m, eski, yangi, sig, label):
    seg(a_m, b_m, [
        (f"const {eski} = ({{ screen, storedAnswer, onAnswer, onNext, onPrev }}) => {{", f"const {yangi} = ({{ storedAnswer, onAnswer, onSig }}) => {{", False),
        ("onAnswer(screen, { correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line", "onAnswer({ correct: true, picked: true, taxmin }); }, [done]); // eslint-disable-line", False),
        (r"  return \(\n    <Stage [^\n]*\n", f"  useEffect(() => {{ if (onSig) onSig(); }}, [{sig}]); // eslint-disable-line — ota-ekran mobilda pastga suradi\n  return (\n    <>\n", True),
        ("    </Stage>\n  );\n};", "    </>\n  );\n};", False),
    ], label)
qism("// ===== SCREEN 5 — BOZOR", "// ===== SCREEN 6 — 2-SAVOL", 'Screen5', 'QismBozor', 'n', 'bozor')
qism("// ===== SCREEN 7 — JAMOA", "// ===== SCREEN 8 — 3-SAVOL", 'Screen7', 'QismJamoa', 'q', 'jamoa')
qism("// ===== SCREEN 9 — KEYINGI QADAM", "// ===== SCREEN 10 — MENTOR QORALAMASI", 'Screen9', 'QismKeyingi', 'q', 'keyingi')
rep("// ===== SCREEN 5 — BOZOR (QTushuncha;", "// ===== SCREEN 3 (v2) — UCH YANGI BO'LAK: QISM 1 BOZOR (QTushuncha;", 'sarl 5')
rep("// ===== SCREEN 7 — JAMOA (QTushuncha keng;", "// ===== QISM 2 JAMOA (QTushuncha keng;", 'sarl 7')
rep("// ===== SCREEN 9 — KEYINGI QADAM (QTushuncha keng;", "// ===== QISM 3 KEYINGI QADAM (QTushuncha keng;", 'sarl 9')

UCH = r"""// ===== SCREEN UCH — UCH YANGI BO'LAK BITTA EKRANDA (F-1018-11, 222-qonun: Bozor → Jamoa → Keyingi qadam; 213.1 — bitta faol qism, bajarilgani tepadagi chip-qatorga, keyingisi «Keyingi bo'lak» bilan keladi) =====
const UCH_ID = ['bozor', 'jamoa', 'keyingi'];
const UCH_QISM = { bozor: QismBozor, jamoa: QismJamoa, keyingi: QismKeyingi };
const ScreenUch = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const st = storedAnswer || {};
  const [qism, setQism] = useState(() => st.qismlar || {});
  const [joriy, setJoriy] = useState(() => UCH_ID.find(id => !(st.qismlar || {})[id]) || 'keyingi');
  const [sig, setSig] = useState(0);
  const n = UCH_ID.filter(id => qism[id]).length;
  const done = n === UCH_ID.length;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true, qismlar: qism }); }, [done]); // eslint-disable-line
  const och = (id) => { setJoriy(id); setSig(x => x + 1); };
  const keyingiQism = UCH_ID[UCH_ID.indexOf(joriy) + 1] || null;
  const Qism = UCH_QISM[joriy];
  const navKeyingi = !!qism[joriy] && keyingiQism && !qism[keyingiQism];
  return (
    <Stage eyebrow={tr({ uz: "Tushuncha · uch yangi bo'lak", ru: 'Понятие · три новые части' })} screen={screen} scrollSignal={sig} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done || navKeyingi} disabled={!done && !navKeyingi} label={done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : navKeyingi ? `${tr({ uz: "Keyingi bo'lak:", ru: 'Следующая часть:' })} ${tr(BOLAK_NOM[keyingiQism])}` : tr({ uz: `Uch bo'lakni ko'ring (${n}/3)`, ru: `Посмотрите три части (${n}/3)` })} onClick={done ? onNext : () => och(keyingiQism)} /></>}>
      <div className="ip-uch">
        <div className="ip-strip ip-uch-strip">
          {UCH_ID.map((id, i) => <QChip key={id} holat={joriy === id ? 'on' : qism[id] ? 'ok' : undefined} className="ip-tab" disabled={!qism[id] && joriy !== id} onClick={() => och(id)}><i>{qism[id] ? '✓' : i + 1}</i>{tr(BOLAK_NOM[id])}</QChip>)}
        </div>
        <Qism key={joriy} storedAnswer={qism[joriy]} onAnswer={(d) => setQism(q => ({ ...q, [joriy]: d }))} onSig={() => setSig(x => x + 1)} />
      </div>
    </Stage>
  );
};

"""
rep("// ===== SCREEN 10 — MENTOR QORALAMASI", UCH + "// ===== SCREEN 10 — MENTOR QORALAMASI", 'ScreenUch joyi')

SHERIK = r"""// ===== SCREEN SHERIK — QORALAMANI SHERIKKA O'QING (222.1 · F-1018-11: 1-raund — 2 daqiqa o'qiladi, sherik investor bo'lib olti savolga javob eshitdimi belgilaydi; ballsiz, nishon readAloud; 213.3 — qatorlar chegarasiz, fon bilan) =====
const SH_VAQT = 120;
const mssS = (sek) => { const v = Math.max(0, Math.floor(sek || 0)); return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`; };
const ScreenSherik = ({ screen, storedAnswer, onAnswer, onNext, onPrev, live }) => {
  const gate = useContext(LiveGateCtx) || {};
  const _live = live || gate.live;
  const isMentor = !!(_live && _live.mode === 'mentor');
  const juft = !!(_live && _live.mode === 'student');
  const st = storedAnswer || {};
  const b = useMemo(() => { if (isMentor) return {}; const p = pitchOl(); return (p && p.bolaklar) || {}; }, []); // eslint-disable-line
  const yozilgan = saqlanganSoni(b);
  const pitchYoq = !isMentor && yozilgan === 0;
  const [vaqt, setVaqt] = useState(st.vaqt ?? 0);
  const [yur, setYur] = useState(false);
  const [toxtadi, setToxtadi] = useState(st.vaqt != null);
  const [belgi, setBelgi] = useState(st.belgi || {});
  const sentRef = useRef(!!st.solved);
  useEffect(() => { if (!yur) return undefined; const t = setInterval(() => setVaqt(v => v + 1), 1000); return () => clearInterval(t); }, [yur]);
  const hammasi = BOLAK_ID.every(id => belgi[id]);
  const done = pitchYoq || (toxtadi && hammasi);
  const yoqlar = BOLAK_ID.filter(id => belgi[id] === 'yoq');
  useEffect(() => {
    if (!done || pitchYoq || isMentor || sentRef.current) return;
    sentRef.current = true;
    lsY(PITCH_KEY, { ...(lsO(PITCH_KEY) || {}), sherik: { vaqt, belgi, savedAt: Date.now() } });
    onAnswer(screen, { stage: 'sherik', screenIdx: screen, solved: true, correct: true, picked: true, vaqt, belgi, yoqSoni: yoqlar.length });
    if (_live && _live.mode === 'student') _live.submitAnswer(PRACTICE_BASE + screen, 'sherik', 0, true, 0);
  }, [done]); // eslint-disable-line
  const boshla = () => { setVaqt(0); setYur(true); setToxtadi(false); };
  const toxtat = () => { setYur(false); setToxtadi(true); };
  const qoy = (id, v) => { if (!toxtadi || isMentor) return; setBelgi(x => ({ ...x, [id]: v })); };
  const bolaklar = isMentor ? mentorOlti('yozildi') : BOLAK_ID.map(id => ({ id, nom: tr(BOLAK_NOM[id]), matn: b[id] || null, holat: b[id] ? 'yozildi' : 'bosh' }));
  const mentorT = pitchYoq ? { uz: "Qoralama hali saqlanmagan — oldingi ekranga qaytib, olti bo'lakni saqlang, keyin sherigingizga o'qing.", ru: 'Черновик ещё не сохранён — вернитесь на предыдущий экран, сохраните шесть частей, потом прочитайте партнёру.' }
    : done ? (yoqlar.length ? { uz: "Javobsiz savol bor — o'sha bo'lak yetishmaydi. Keyingi darsgacha qoralamani to'ldiring; xohlasangiz hozir qaytib tuzating.", ru: 'Есть вопрос без ответа — этой части не хватает. Дополните черновик до следующего урока; если хотите, вернитесь и исправьте сейчас.' } : { uz: 'Olti savolga ham javob bor — qoralama keyingi darsga tayyor.', ru: 'На все шесть вопросов есть ответ — черновик готов к следующему уроку.' })
    : toxtadi ? (juft ? { uz: "Endi qurilmani sherigingizga bering: u har savolga «Javob bor» yoki «Javob yo'q» qo'yadi.", ru: 'Теперь дайте устройство партнёру: он поставит каждому вопросу «Ответ есть» или «Ответа нет».' } : { uz: "Endi har savolni o'zingiz belgilang: investor shu savolni bersa, qoralamada javob bormi?", ru: 'Теперь отметьте каждый вопрос сами: если инвестор его задаст, есть ли ответ в черновике?' })
    : (juft ? { uz: "Qoralamangizni sherigingizga 2 daqiqada o'qib bering. U — investor: olti savolga javob eshitdimi, belgilaydi.", ru: 'Прочитайте черновик партнёру за 2 минуты. Он — инвестор: отметит, услышал ли ответ на шесть вопросов.' } : { uz: "Qoralamangizni ovoz chiqarib 2 daqiqada o'qing, keyin olti savolga javob bormi — o'zingiz belgilang.", ru: 'Прочитайте черновик вслух за 2 минуты, потом сами отметьте, есть ли ответ на шесть вопросов.' });
  const navY = isMentor || done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !toxtadi ? tr({ uz: "2 daqiqada o'qing", ru: 'Прочитайте за 2 минуты' }) : tr({ uz: 'Olti savolni belgilang', ru: 'Отметьте шесть вопросов' });
  return (
    <Stage eyebrow={juft ? tr({ uz: 'Juftlikda ish · qoralama', ru: 'Работа в паре · черновик' }) : tr({ uz: 'Mustaqil ish · qoralama', ru: 'Самостоятельная работа · черновик' })} screen={screen} scrollSignal={(toxtadi ? 10 : 0) + (done ? 100 : 0)} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive halqa={done && !pitchYoq} disabled={!done && !isMentor} label={navY} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={tr({ uz: <>Qoralamangiz investorning <A>olti savoliga javob beradimi?</A></>, ru: <>Отвечает ли ваш черновик <A>на шесть вопросов инвестора?</A></> })}
        mentor={<Mentor>{tr(mentorT)}</Mentor>}
        qadamlar={<div className="ip-sh">
          <div className="ip-sh-ch">
            <Zoomable><OltiBolakSahna yorliq={isMentor ? tr({ uz: 'Mentor misoli', ru: 'Пример Ментора' }) : tr({ uz: 'Pitch qoralamam', ru: 'Мой черновик питча' })} bolaklar={bolaklar} /></Zoomable>
            {pitchYoq && <QTugma ikkinchi onClick={onPrev}>{tr({ uz: 'Qoralamaga qaytish', ru: 'Вернуться к черновику' })}</QTugma>}
          </div>
          <div className="ip-sh-on">
            {!isMentor && !pitchYoq && <div className={cxx('ip-sh-tmr', yur && 'yur')}>
              <b className={cxx(vaqt > SH_VAQT && 'oshdi')}>{mssS(vaqt)}</b>
              {yur && <span className="ip-sh-gapir">{tr({ uz: "Hozir siz o'qiyapsiz", ru: 'Сейчас читаете вы' })}</span>}
              <span className="ip-sh-tug">
                {!yur && !toxtadi && <QTugma className="ip-halqa" onClick={boshla}>{tr({ uz: '2 daqiqani boshlash', ru: 'Запустить 2 минуты' })}</QTugma>}
                {yur && <QTugma className="ip-halqa" onClick={toxtat}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>}
                {!yur && toxtadi && !done && <QTugma ikkinchi onClick={boshla}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</QTugma>}
              </span>
            </div>}
            {!pitchYoq && <>
              <span className="q-yorliq">{juft ? tr({ uz: 'Sherik — investor: javob eshitildimi?', ru: 'Партнёр — инвестор: ответ прозвучал?' }) : tr({ uz: 'Investor savollari: javob bormi?', ru: 'Вопросы инвестора: есть ли ответ?' })}</span>
              {BOLAK_ID.map((id, i) => { const v = belgi[id]; return (
                <div key={id} className={cxx('ip-sh-q', v === 'bor' && 'bor', v === 'yoq' && 'yoq', !toxtadi && 'kutadi')}>
                  <span className="ip-sh-nom"><i>{i + 1}</i>{tr(BOLAK_NOM[id])}</span>
                  <span className="ip-sh-t">{tr(HAKAM_SAVOL[id])}</span>
                  <span className="ip-sh-b">
                    <QChip holat={v === 'bor' ? 'ok' : undefined} disabled={!toxtadi || isMentor} onClick={() => qoy(id, 'bor')}>{tr({ uz: '✓ Javob bor', ru: '✓ Ответ есть' })}</QChip>
                    <QChip holat={v === 'yoq' ? 'err' : undefined} disabled={!toxtadi || isMentor} onClick={() => qoy(id, 'yoq')}>{tr({ uz: "✗ Javob yo'q", ru: '✗ Ответа нет' })}</QChip>
                  </span>
                </div>
              ); })}
              {done && !isMentor && <>
                <QXulosa>{yoqlar.length
                  ? tr({ uz: `${yoqlar.length} ta savolga javob yo'q: ${yoqlar.map(id => tr(BOLAK_NOM[id])).join(', ')} — shu bo'laklarni to'ldiring.`, ru: `Нет ответа на ${yoqlar.length} вопр.: ${yoqlar.map(id => tr(BOLAK_NOM[id])).join(', ')} — дополните эти части.` })
                  : tr({ uz: 'Olti savolga ham javob bor — qoralama tayyor.', ru: 'На все шесть вопросов есть ответ — черновик готов.' })}</QXulosa>
                {yoqlar.length > 0 && <div className="ip-sh-tug"><QTugma ikkinchi onClick={onPrev}>{tr({ uz: 'Qoralamaga qaytib tuzatish', ru: 'Вернуться и исправить черновик' })}</QTugma></div>}
              </>}
            </>}
            {isMentor && <p className="ip-kulrang">{tr({ uz: "Juftlik: A qoralamani 2 daqiqada o'qiydi, B — investor: olti savolga javob eshitdimi, belgilaydi; keyin almashadilar (≈ 6 daqiqa). «Javob yo'q» — hukm emas, savol: shu bo'lak keyingi darsgacha to'ldiriladi.", ru: 'Пара: A читает черновик за 2 минуты, B — инвестор: отмечает, прозвучал ли ответ на шесть вопросов; потом меняются (≈ 6 минут). «Ответа нет» — не приговор, а вопрос: эту часть дополнят до следующего урока.' })}</p>}
            <MentorPracticeStats live={_live} screen={screen} yorliq={{ uz: "Sherikka o'qib, belgilatganlar", ru: 'Прочитали партнёру и получили отметки' }} />
          </div>
        </div>}
        forma={null}
      />
    </Stage>
  );
};

"""
rep("// ===== SCREEN 12 — YAKUNIY SAVOL", SHERIK + "// ===== SCREEN 12 — YAKUNIY SAVOL", 'ScreenSherik joyi')

# ---- olinadi
cut("// ===== SCREEN 3 — AIRBNB", "// ===== SCREEN 3 (v2) — UCH YANGI BO'LAK: QISM 1 BOZOR", "s3 Airbnb + s4 test")
cut("// ===== SCREEN 6 — 2-SAVOL", "// ===== QISM 2 JAMOA", "s6 test")
cut("// ===== SCREEN 8 — 3-SAVOL", "// ===== QISM 3 KEYINGI QADAM", "s8 test")
cut("// 3-ekran — K12 Airbnb pitch deck", "const SLAYD_SONI = 10; // «o'nga yaqin» — ekranda son yozilmaydi\n", "Airbnb ma'lumoti")
rep("const SLAYD_SONI = 10; // «o'nga yaqin» — ekranda son yozilmaydi\n", "", 'SLAYD_SONI')
cut("// 🃏 KARTOCHKALAR", "// ===== UYGA VAZIFA — PM HwCard", "kartochkalar")
rep("const AIRBNB_RANG = '#FF5A5F'; // Airbnb — o'z rangi (10-Modul TAYANCHGA SAVOL 9), logotipsiz\n", "", 'AIRBNB_RANG')
a = s.index("const brendAjrat = (s) =>"); b = s.index("\nconst ", a + 1) + 1
print('  kesildi brendAjrat:', s[a:b].count('\n'), 'qator'); s = s[:a] + s[b:]
rep("const Brend = ({ nom, rang }) => <span className=\"ip-brend\" style={{ color: rang }}>{nom}</span>;\n", "", 'Brend')
rep("// Bitta manba: JAMOA_PITCH · JAMOA_PITCH_12 · HAKAM_SAVOL · BOZOR_SON · AIRBNB_KADR + o'quvchi qoralamasi",
    "// Bitta manba: JAMOA_PITCH · JAMOA_PITCH_12 · HAKAM_SAVOL · BOZOR_SON + o'quvchi qoralamasi", 'manba izohi')

# ---- REJA (222.6: tartib aytiladi)
rep("""  { t: { uz: "O'z mahsulotingiz uchun pitch qoralamasini yozasiz", ru: 'Напишете черновик питча для своего продукта' }, teg: { uz: 'qoralama', ru: 'черновик' } }""",
    """  { t: { uz: "O'z mahsulotingiz uchun pitch qoralamasini yozasiz va uni sherigingizga 2 daqiqada o'qib berasiz", ru: 'Напишете черновик питча для своего продукта и прочитаете его партнёру за 2 минуты' }, teg: { uz: 'qoralama · sherik', ru: 'черновик · партнёр' } }""", 'REJA')

# ---- nishonlar
rep("""  clearAsk: { icon: '🎯', name: 'Clear Ask!', desc: { uz: "Keyingi qadamni pul va va'dasiz yozdingiz", ru: 'Вы написали Следующий шаг без денег и обещаний' } }
};""", """  clearAsk: { icon: '🎯', name: 'Clear Ask!', desc: { uz: "Keyingi qadamni pul va va'dasiz yozdingiz", ru: 'Вы написали Следующий шаг без денег и обещаний' } },
  readAloud: { icon: '🎤', name: 'Read Aloud!', desc: { uz: "Qoralamani sherigingizga o'qib, olti savolga tekshirtirdingiz", ru: 'Прочитали черновик партнёру и проверили его на шесть вопросов' } }
};""", 'readAloud')
rep("const ACH_TRIGGERS = { tartib: 'rightOrder' };", "const ACH_TRIGGERS = { tartib: 'rightOrder', sherik: 'readAloud' };")
rep("// ===== 🏅 BADGES (nishonlar, 4 — PM:", "// ===== 🏅 BADGES (nishonlar, 5 — PM:", 'badges izoh')

# ---- arena: Airbnb savollari (3, 4) → dars savollari (to'g'ri o'rin C, D saqlanadi)
rep("""  { q: { uz: 'Airbnb qanday xizmat?', ru: 'Что за сервис Airbnb?' }, opts: [{ uz: 'Shahar ichida tez taksi chaqirish xizmati', ru: 'Сервис быстрого вызова такси по городу' }, { uz: 'Internetda kitob sotib olish xizmati', ru: 'Сервис покупки книг в интернете' }, { uz: 'Begonaning uyida ijaraga turish xizmati', ru: 'Сервис, где снимают жильё у незнакомых' }, { uz: 'Uyga tayyor ovqat yetkazish xizmati', ru: 'Сервис доставки готовой еды домой' }], correct: 2 },""",
    """  { q: { uz: "Bozor bo'lagi hakamning qaysi savoliga javob beradi?", ru: 'На какой вопрос судьи отвечает часть «Рынок»?' }, opts: [{ uz: '«Buni kim qilyapti?»', ru: '«Кто это делает?»' }, { uz: '«Endi nima qilasiz?»', ru: '«Что будете делать дальше?»' }, { uz: '«Yana qancha odamga kerak?»', ru: '«Скольким ещё людям нужно?»' }, { uz: '«Mahsulot nima qiladi?»', ru: '«Что делает продукт?»' }], correct: 2 },""", 'arena 3')
rep("""  { q: { uz: "Airbnb'ning besh slayd nomi ichida jamoa qayerda?", ru: 'Где команда среди пяти названий слайдов Airbnb?' }, opts: [{ uz: 'Besh nomning boshida', ru: 'В начале пяти названий' }, { uz: 'Muammo slaydidan keyin', ru: 'После слайда о проблеме' }, { uz: 'Yechim slaydi ichida', ru: 'Внутри слайда о решении' }, { uz: 'Besh nomning oxirida', ru: 'В конце пяти названий' }], correct: 3 },""",
    """  { q: { uz: 'Pitchning 5 daqiqasi tugagach nima bo\\'ladi?', ru: 'Что происходит, когда 5 минут питча заканчиваются?' }, opts: [{ uz: 'Hakam darhol ball qo\\'yadi', ru: 'Судья сразу ставит балл' }, { uz: 'Keyingi o\\'quvchi chiqadi', ru: 'Выходит следующий ученик' }, { uz: 'Pitch boshidan takrorlanadi', ru: 'Питч повторяется с начала' }, { uz: 'Savol-javob boshlanadi', ru: 'Начинаются вопросы-ответы' }], correct: 3 },""", 'arena 4')

# ---- root
rep("""  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });""",
"""  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));""", 'root nav')
s = re.sub(r"\n  // 🃏 Flashcard[^\n]*", "", s)
rep("const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, ScreenPodium, ScreenFlashcards, SummaryScreen];",
    "const screens = [Screen0, Screen1, Screen2, ScreenUch, Screen10, Screen11, ScreenSherik, Screen12, ScreenPodium, SummaryScreen];")

# ---- CSS
rep("        .ip-fokus { display: flex; flex-direction: column; gap: 12px; }\n", """        .ip-fokus { display: flex; flex-direction: column; gap: 12px; }
        /* Uch yangi bo'lak bitta ekranda (F-1018-11) */
        .ip-uch { display: flex; flex-direction: column; gap: 12px; flex: 1 0 auto; }
        /* Sherikka o'qing (F-1018-11; 213.3 — qatorlar chegarasiz, holat fon bilan) */
        .ip-sh { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 16px; align-items: start; width: 100%; }
        .ip-sh-ch, .ip-sh-on { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .ip-sh-tmr { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; }
        .ip-sh-tmr > b { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 700; letter-spacing: .02em; }
        .ip-sh-tmr > b.oshdi { color: ${T.err}; }
        .ip-sh-gapir { font-size: 13px; color: ${T.ink2}; }
        .ip-sh-tug { display: flex; gap: 8px; margin-left: auto; }
        .ip-sh-q { display: grid; grid-template-columns: minmax(0,1fr) auto; grid-template-areas: 'nom b' 't b'; column-gap: 12px; row-gap: 2px; align-items: center; padding: 8px 12px; border-radius: 12px; background: ${T.paper}; }
        .ip-sh-nom { grid-area: nom; } .ip-sh-t { grid-area: t; } .ip-sh-b { grid-area: b; }
        .ip-sh-b .q-chip { padding: 6px 10px; font-size: 13px; }
        .ip-sh-q.kutadi { opacity: .72; }
        .ip-sh-q.bor { background: ${T.okFon}; }
        .ip-sh-q.yoq { background: ${fon(T.err, 0.1)}; }
        .ip-sh-nom { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; color: ${T.ink2}; }
        .ip-sh-nom i { font-style: normal; display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: ${fon(T.accent, 0.14)}; color: ${T.accent}; font-size: 11px; }
        .ip-sh-q.bor .ip-sh-nom i { background: ${T.ok}; color: #fff; }
        .ip-sh-q.yoq .ip-sh-nom i { background: ${T.err}; color: #fff; }
        .ip-sh-t { font-size: 14px; line-height: 1.4; color: ${T.ink}; }
        .ip-sh-b { display: flex; flex-wrap: nowrap; gap: 6px; }
        @media (max-width: 760px) { .ip-sh { grid-template-columns: 1fr; } .ip-sh-q { grid-template-columns: 1fr; grid-template-areas: 'nom' 't' 'b'; row-gap: 6px; } }
""", 'css')

# ---- o'lik CSS (2 o'tish; keyframes OLIB TASHLANMAYDI — F-1018-10)
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
for kf in []:  # F-1018-10: keyframes OLIB TASHLANMAYDI — qolipCss (fade-in-up) va jonli-modul darsdan tashqarida nom kutadi
    pass
css = re.sub(r"\n[ \t]*/\* === 🃏 FLASHCARDS[^\n]*", "", css)
# 3-o'tish: faqat o'lik klassli qolgan satrlar (media-query / murakkab selektor)
for pat in [r"\n[ \t]*@media \(max-width: 760px\) \{ \.ip-ab-tasma[^\n]*", r"\n[ \t]*\.ip-flash \.fc-back[^\n]*"]:
    css, c = re.subn(pat, '', css); removed += c
s = s[:ca] + css + s[cb:]
print(f"  o'lik CSS: {len(DEAD)} klass, {removed} qator; qolgan: {sorted(dead_classes(s) - d0)}")
open(DST, 'w', encoding='utf8').write(s)
print('✅ yozildi', DST, s.count('\n') + 1, 'qator')
