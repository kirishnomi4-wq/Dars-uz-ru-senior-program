# F-1018-06 · m8-11 PmPitchRehearsalLesson (LMS 10-Modul 11-dars) 17 → 11 (222-qonun). Zaxiradan quradi: python3 f1018f.py
import re, sys
R = '/home/kali/Desktop/internetLesson'
SRC = f'{R}/arxiv/F-1018-06-oldin/PmPitchRehearsalLesson.jsx'
DST = f'{R}/src/8-Modull/PmPitchRehearsalLesson.jsx'
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

# --- meta / izohlar
rep("lessonId: 'pm-m8d11-pitch-v1'", "lessonId: 'pm-m8d11-pitch-v2'")
rep("""// Ekranlar: s0 QKirish · s1 QReja · s2/s6/s8 QTushuncha · s3/s5/s7/s9 test (QuestionScreen → QTest) · s4 QVoqea (K12 Airbnb) · s10 QKod (Neon) ·
//   s11/s12/s13 QMustaqil · podium · QKartochka · QYakun. Bitta vizual — PitchSahna (slaydlar · taymer · zal · baholash varag'i).
// Artefakt: pm-m8d11-pitch (s10–s13 yozadi); o'qiydi pm-m7d12-pitch, pm-m8d1-okr, pm-m8d4-gipoteza, pm-m8d10-yol (yo'q bo'lsa — bo'sh maydon).""",
"""// Ekranlar (v2 · F-1018-06 · 222-qonun): s0 QKirish · s1 QReja · s2/s6/s8 QTushuncha · s9 yakuniy test (QuestionScreen → QTest) ·
//   s11/s12/s13 QMustaqil (s13 da 2-raund: tuzatilgan slayd 1 daqiqada qayta aytiladi) · podium · QYakun. Olindi: s3/s5/s7 oraliq testlar, s4 Airbnb keysi, s10 Neon SQL, kartochkalar.
//   Bitta vizual — PitchSahna (slaydlar · taymer · zal · baholash varag'i).
// Artefakt: pm-m8d11-pitch (s11–s13 yozadi); o'qiydi pm-m7d12-pitch, pm-m8d1-okr, pm-m8d4-gipoteza, pm-m8d10-yol (yo'q bo'lsa — bo'sh maydon).""", 'header')
rep("""// 17 ekran · PM 2-tur (artefakt yozma — besh slaydli pitch) · oqim: kirish → reja → besh slayd → 1-savol → Airbnb → 2-savol → raqamlar slaydi → 3-savol →
//   baholash varag'i → yakuniy savol → Neon SQL → mustaqil ish → repetitsiya → tuzatish → podium → kartochkalar → yakun. Manba-haqiqat: feedback/F-1005-10modul/11-PmPitchRehearsal-v3.md (GATE M).""",
"""// 11 ekran (v2) · PM 2-tur (artefakt yozma — besh slaydli pitch) · oqim: kirish → reja → besh slayd → raqamlar slaydi → baholash varag'i → yakuniy savol →
//   mustaqil ish → repetitsiya (5 daq) → tuzatish + qayta aytish (1 daq) → podium → yakun. Manba-haqiqat: feedback/F-1005-10modul/11-PmPitchRehearsal-v3.md (GATE M) + feedback/F-1018-pitch/YAKUNIY-04-m8-11.md.""", 'oqim')

a = s.index('const SCREEN_META = ['); b = s.index('const TOTAL_SCREENS')
s = s[:a] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // 0 · QKirish
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // 1 · QReja
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 2 · QTushuncha: besh slayd
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 3 · QTushuncha: raqamlar slaydi
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 4 · QTushuncha: baholash varag'i (saralash)
  { id: 's9',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // 5 · yakuniy savol
  { id: 's11', type: 'practice',    template: 'custom',   scored: false, scope: null },            // 6 · QMustaqil: besh slaydli pitch
  { id: 's12', type: 'practice',    template: 'custom',   scored: false, scope: null },            // 7 · QMustaqil: repetitsiya 5 daq + varaq (1-raund)
  { id: 's13', type: 'practice',    template: 'custom',   scored: false, scope: null },            // 8 · QMustaqil: tuzatish + qayta aytish 1 daq (2-raund)
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },            // 9 · podium
  { id: 's16', type: 'summary',     template: 'custom',   scored: false, scope: null }             // 10 · QYakun
];
// Har ekranning vazifasi (Quruvchi + Jonli uchun xarita)
const SCREEN_INTENTS = [
  "hook: 1 daqiqalik pitch va bo'sh 4 daqiqa", 'reja: besh slayd skeleti + 4 qadam', "besh slayd: Raqamlar va Keyingi qadam qo'shiladi, vaqt beshga bo'linadi",
  'raqamlar slaydi: 17 + nimani sanadi, solishtirish, halol gap', "baholash varag'i: besh gap saralanadi (atama)", 'yakuniy savol: qaysi fidbek yordam beradi',
  'mustaqil: besh slaydli pitch', "repetitsiya: 5 daqiqa taymer + baholash varag'i (1-raund)", 'tuzatish: eng zaif slayd + 1 daqiqada qayta aytish (2-raund)', 'podium', 'yakun'
];
""" + s[b:]
rep("const INLINE_KEYS = { s3: 1, s5: 3, s7: 0, s9: 2, beshSlayd: -1, raqamlar: -1, fidbek: -1, neon: -1, practice: -1, repetitsiya: -1, tuzatish: -1 };",
    "const INLINE_KEYS = { s9: 2, beshSlayd: -1, raqamlar: -1, fidbek: -1, practice: -1, repetitsiya: -1, tuzatish: -1 };")
# RECAPS: faqat 9 → 5
a = s.index('const RECAPS = {'); b = s.index('\n};', a) + 3
m = re.search(r"\n  9: \{.*?\n  \},?", s[a:b], re.S)
if not m: print('❌ RECAPS 9'); sys.exit(1)
s = s[:a] + 'const RECAPS = {' + m.group(0).replace('\n  9: {', '\n  5: {').rstrip(',') + '\n};' + s[b:]
a = s.index('const Q_LABELS = {'); b = s.index('\n};', a) + 3
s = s[:a] + """const Q_LABELS = {
  5: { uz: 'Qaysi fidbek yordam beradi', ru: "Какой фидбек помогает" }
};""" + s[b:]
rep("// Podium savol yorliqlari (kalitlar = SCORED_IDX: 3, 5, 7, 9 — q22)", "// Podium savol yorliqlari (kalitlar = SCORED_IDX: 5 — q22)")

# --- kesishlar
cut("// ===== SCREEN 3 — 1-SAVOL", "// ===== SCREEN 4 — AIRBNB", "s3 test")
cut("// ===== SCREEN 4 — AIRBNB", "// ===== SCREEN 6 — RAQAMLAR SLAYDI", "s4 Airbnb + s5 test")
cut("// ===== SCREEN 7 — 3-SAVOL", "// ===== SCREEN 8 — BAHOLASH VARAG'I", "s7 test")
cut("// ===== SCREEN 10 — KOD YOZISH", "// ===== O'QUVCHI PITCHI", "s10 Neon")
cut("// 🃏 KARTOCHKALAR", "// ===== UYGA VAZIFA — PM HwCard", "kartochkalar")
# useSanoq faqat Neon maketida ishlatilgan edi
if s.count('useSanoq(') == 0:
    a = s.index('const useSanoq = '); b = s.index('\n};', a) + 4; s = s[:a] + s[b:]; print('  useSanoq olindi')

# --- s11: Neon javobi endi faqat artefaktdan (answers[10] indeksi ko'chdi)
rep("  const n = (answers && answers[10]) || null;\n  if (n && n.son != null) p.raqamlar.bosh =",
    "  const n = (lsGet(KEY_PITCH) || {}).neon || null; // v1 da Neon ekrani yozgan bo'lsa — saqlanadi\n  if (n && n.hozir != null) p.raqamlar.bosh =", 's11Bosh neon')
rep("${n.oldin != null ? n.oldin : '…'} ${tr({ uz: 'dan', ru: \"с\" })} ${n.son} ${tr({ uz: 'ga', ru: \"до\" })}`;",
    "${n.oldin != null ? n.oldin : '…'} ${tr({ uz: 'dan', ru: \"с\" })} ${n.hozir} ${tr({ uz: 'ga', ru: \"до\" })}`;", 's11Bosh hozir')
rep("  const neon = useMemo(() => { const a = answers && answers[10]; return a && a.son != null ? { oldin: a.oldin ?? null, hozir: a.son } : ((lsGet(KEY_PITCH) || {}).neon || null); }, []); // eslint-disable-line",
    "  const neon = useMemo(() => (lsGet(KEY_PITCH) || {}).neon || null, []); // v2: Neon ekrani yo'q — faqat artefaktdagi (bo'lsa)", 's11 neon memo')

# --- root
rep("""  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });""",
"""  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));""", 'root nav')
s = re.sub(r"\n  // 🃏 Flashcard[^\n]*", "", s)
rep("const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, ScreenPodium, ScreenFlashcards, SummaryScreen];",
    "const screens = [Screen0, Screen1, Screen2, Screen6, Screen8, Screen9, Screen11, Screen12, Screen13, ScreenPodium, SummaryScreen];")
rep("  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice }), [missed, missTry, fpPractice]);",
    "  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice, earn }), [missed, missTry, fpPractice, earn]); // earn — s13 2-raund nishoni (ekranda ikkinchi trigger)", 'achMissVal')

# --- nishonlar: realNumber (Neon) → secondTake (2-raund)
rep("// ===== 🏅 NISHONLAR (4) — 151-qonun: 8-ekran birinchi urinish; 10, 12, 13-ekran ish bajarilgani (tekin bonus yo'q, S-034; 2, 6, 11-ekran nishonsiz) =====",
    "// ===== 🏅 NISHONLAR (4) — 151-qonun: s8 birinchi urinish; s12, s13 ish bajarilgani; secondTake — s13 2-raund (taymer to'xtadi), achMiss.earn orqali (tekin bonus yo'q, S-034) =====")
rep("""  realNumber: { icon: '🔢', name: 'Real Number!', desc: { uz: "Bosh raqamingizni Database'dan oldingiz", ru: "Вы взяли главное число из Database" } },\n""", "")
rep("""  pitchFixed: { icon: '🛠️', name: 'Pitch Fixed!', desc: { uz: 'Fidbekdan keyin slaydni qayta yozdingiz', ru: "После фидбека вы переписали слайд" } }
};""", """  pitchFixed: { icon: '🛠️', name: 'Pitch Fixed!', desc: { uz: 'Fidbekdan keyin slaydni qayta yozdingiz', ru: "После фидбека вы переписали слайд" } },
  secondTake: { icon: '🔁', name: 'Second Take!', desc: { uz: 'Tuzatilgan slaydni 1 daqiqada qayta aytdingiz', ru: "Вы ещё раз рассказали исправленный слайд за 1 минуту" } }
};""", 'secondTake')
rep("// Ekran id → nishon. s8: `correct` = xatosiz birinchi urinish · s10: «Bajardim» · s12: taymer to'xtatildi va varaq to'ldi · s13: birinchi tuzatilgan slayd\nconst ACH_TRIGGERS = { s8: 'feedbackSorter', s10: 'realNumber', s12: 'fiveMinutes', s13: 'pitchFixed' };",
    "// Ekran id → nishon. s8: `correct` = xatosiz birinchi urinish · s12: taymer to'xtatildi va varaq to'ldi · s13: birinchi tuzatilgan slayd (secondTake — s13 ichidan, 2-raund taymeri to'xtaganda)\nconst ACH_TRIGGERS = { s8: 'feedbackSorter', s12: 'fiveMinutes', s13: 'pitchFixed' };", 'ACH_TRIGGERS')

# --- REJA 4 qadam
rep("""  { t: { uz: "Mashhur taqdimot qanday boshlanganini ko'rasiz", ru: "Увидите, с чего начиналась знаменитая презентация" }, teg: { uz: 'biznes', ru: "бизнес" } },
  { t: { uz: 'Raqamni zal ishonadigan qilib yozasiz', ru: "Запишете число так, чтобы зал поверил" }, teg: { uz: 'raqamlar', ru: "цифры" } },
  { t: { uz: 'Pitchni sinfdoshga aytib, tuzatasiz', ru: "Расскажете питч однокласснику и исправите" }, teg: { uz: "baholash varag'i", ru: "лист оценки" } }
];""", """  { t: { uz: 'Raqamni zal ishonadigan qilib yozasiz', ru: "Запишете число так, чтобы зал поверил" }, teg: { uz: 'raqamlar', ru: "цифры" } },
  { t: { uz: 'Besh slaydli pitchni sinfdoshga 5 daqiqada aytib, baholatasiz', ru: "Расскажете питч из пяти слайдов однокласснику за 5 минут и получите оценку" }, teg: { uz: "baholash varag'i", ru: "лист оценки" } },
  { t: { uz: 'Eng zaif slaydni tuzatib, 1 daqiqada qayta aytasiz', ru: "Исправите самый слабый слайд и расскажете его ещё раз за 1 минуту" }, teg: { uz: '2-raund', ru: "раунд 2" } }
];""", 'REJA')

# --- Screen13: 2-raund (222.1) — tuzatilgan slayd 1 daqiqada qayta aytiladi; Davom shundan keyin
A = s.index("const Screen13 = ("); B = s.index("// ===== 🏅 NISHONLAR", A); blk = s[A:B]
def rb(old, new, label):
    global blk
    if blk.count(old) != 1: print(f'❌ Screen13 {label}: {blk.count(old)}'); sys.exit(1)
    blk = blk.replace(old, new)
rb("  const { live, isMentor } = useJonli();\n", """  const { live, isMentor } = useJonli();
  const yakka = yakkaMi(live);
  const achMiss = useContext(AchMissCtx);
  // F-1018-06 (222.1): 2-raund — tuzatilgan slayd sherikka 1 daqiqada qayta aytiladi; saqlangan bo'lsa to'xtagan holda tiklanadi
  const tm2 = usePitchTaymer(storedAnswer && storedAnswer.qayta != null ? storedAnswer.qayta : null);
  const qayta = tm2.toxtadi;
  const qaytaRef = useRef(!!(storedAnswer && storedAnswer.qayta != null));
""", 'state')
rb("  const done = tuz.length > 0;\n", """  const done = tuz.length > 0;
  const tayyor = isMentor || (done && qayta);
  useEffect(() => {
    if (!qayta || !done || isMentor || qaytaRef.current) return;
    qaytaRef.current = true;
    pitchYoz({ qayta: tm2.sek });
    onAnswer(screen, { stage: 'tuzatish', screenIdx: screen, p, tuzatildi: tuz, qayta: tm2.sek, picked: true, solved: true, correct: true });
    if (achMiss && achMiss.earn) achMiss.earn('secondTake');
  }, [qayta, done]); // eslint-disable-line
""", 'effect')
rb("<NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Bitta slaydni tuzating', ru: \"Исправьте один слайд\" })} onClick={onNext} />",
   "<NavNext optionalLive disabled={!tayyor} label={tayyor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : done ? tr({ uz: 'Qayta ayting (1 daqiqa)', ru: 'Скажите ещё раз (1 минута)' }) : tr({ uz: 'Bitta slaydni tuzating', ru: \"Исправьте один слайд\" })} onClick={onNext} />", 'NavNext')
rb("""        mentor={<Mentor>{tr({ uz: "✗ qo'yilgan slaydni tanlang va varaqdagi izohga qarab qayta yozing.", ru: "Выберите слайд с ✗ и перепишите его, глядя на пояснение в листе." })}</Mentor>}""",
   """        mentor={<Mentor>{tr({ uz: "✗ qo'yilgan slaydni tanlang va varaqdagi izohga qarab qayta yozing. Keyin shu slaydni 1 daqiqada qayta ayting.", ru: "Выберите слайд с ✗ и перепишите его, глядя на пояснение в листе. Потом расскажите этот слайд ещё раз за 1 минуту." })}</Mentor>}""", 'mentor')
rb("""              {done && faol == null && <QXulosa>{tr({ uz: "Pitchingizning eng zaif slaydi tuzatildi. Qolgan ✗ slaydlarni uyda tuzatasiz.", ru: "Самый слабый слайд вашего питча исправлен. Остальные слайды с ✗ исправите дома." })}</QXulosa>}""",
"""              {done && faol == null && !qayta && <QXulosa>{tr({ uz: "Pitchingizning eng zaif slaydi tuzatildi. Qolgan ✗ slaydlarni uyda tuzatasiz.", ru: "Самый слабый слайд вашего питча исправлен. Остальные слайды с ✗ исправите дома." })}</QXulosa>}
              {done && faol == null && !isMentor && <div className="pr-s13-qayta">
                <QIzoh>{yakka
                  ? tr({ uz: "2-raund: tuzatilgan slaydni ovoz chiqarib 1 daqiqada qayta ayting — endi zal savoliga javob bo'ldimi?", ru: "Раунд 2: расскажите исправленный слайд вслух ещё раз за 1 минуту — теперь это ответ на вопрос зала?" })
                  : tr({ uz: "2-raund: tuzatilgan slaydni sherigingizga 1 daqiqada qayta ayting — endi zal savoliga javob bo'ldimi?", ru: "Раунд 2: расскажите исправленный слайд напарнику ещё раз за 1 минуту — теперь это ответ на вопрос зала?" })}</QIzoh>
                <div className={cxx('pr-soat', tm2.yur && 'yur', tm2.sek > 60 && 'oshdi', qayta && 'bitdi')}>
                  <span className="pr-soat-q"><i className={cxx('pr-q12-n', qayta && 'ok')}>{qayta ? '✓' : 2}</i>{tr({ uz: 'Qayta ayting', ru: "Скажите ещё раз" })}</span>
                  <span className="pr-soat-v"><b>{mss(Math.min(tm2.sek, 60))}</b>{tm2.sek > 60 && <em>+{mss(tm2.sek - 60)}</em>}</span>
                  <span className="pr-soat-b">
                    {tm2.yur && <span className="pr-soat-s">{tr({ uz: 'Hozir siz gapirasiz', ru: "Сейчас говорите вы" })}</span>}
                    {tm2.yur
                      ? <QTugma ikkinchi onClick={tm2.toxtat}>{tr({ uz: "To'xtatish", ru: "Остановить" })}</QTugma>
                      : qayta
                        ? <QTugma ikkinchi onClick={tm2.boshla}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</QTugma>
                        : <QTugma className="pr-bos" onClick={tm2.boshla}>{tr({ uz: '1 daqiqani boshlash', ru: "Запустить 1 минуту" })}</QTugma>}
                  </span>
                </div>
                {qayta && <QXulosa>{tr({ uz: "Tuzatilgan slayd ikkinchi marta aytildi — pitch sahnaga tayyor. Qolgan ✗ slaydlarni uyda tuzatasiz.", ru: "Исправленный слайд рассказан второй раз — питч готов к сцене. Остальные слайды с ✗ исправите дома." })}</QXulosa>}
              </div>}""", '2-raund blok')
rb("""        <MentorNote>{tr({ uz: "Vaqt bo'lsa — tuzatilgan slaydni sinfdoshga yana bir marta (1 daqiqa) ayttiring: endi zal savoliga javob bo'ldimi?", ru: "Если есть время — пусть ученик ещё раз (1 минута) расскажет исправленный слайд однокласснику: теперь это ответ на вопрос зала?" })}</MentorNote>""",
   """        <MentorNote>{tr({ uz: "Slayd tuzatilgach o'quvchi uni sinfdoshga 1 daqiqada qayta aytadi (2-raund). Sinfga bitta savol bering: endi zal savoliga javob bo'ldimi? «Davom etish» shu raunddan keyin ochiladi.", ru: "Когда слайд исправлен, ученик рассказывает его однокласснику ещё раз за 1 минуту (раунд 2). Задайте классу один вопрос: теперь это ответ на вопрос зала? «Продолжить» открывается после этого раунда." })}</MentorNote>""", 'MentorNote')
s = s[:A] + blk + s[B:]
rep("        .pr-s13-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }\n",
    "        .pr-s13-ong { display: flex; flex-direction: column; gap: 10px; min-width: 0; }\n        .pr-s13-qayta { display: flex; flex-direction: column; gap: 10px; }\n", 'css qayta')

# --- yakun RECAP: Neon qatori → 2-raund
rep("""    { uz: "Bosh raqamni o'ylab topmaysiz — o'z Database'ingizdan olasiz.", ru: "Главное число вы не придумываете — вы берёте его из своей Database." },""",
    """    { uz: "Tuzatilgan slaydni darhol qayta aytasiz — zal savoliga javob bo'ldimi, shunda bilinadi.", ru: "Исправленный слайд сразу рассказываете ещё раз — так видно, стал ли он ответом на вопрос зала." },""", 'RECAP')

# --- QUIZ_BANK: Neon (q4, D) + Airbnb (q6, B · q7, C) → dars ichida qolgan ekranlardan savollar (to'g'ri o'rin saqlanadi)
def qrep(start, new, label):
    global s
    a = s.find(start)
    if a < 0: print(f'❌ QUIZ {label}'); sys.exit(1)
    n1 = s.find("\n  { q:", a + 1); n2 = s.find("\n];", a + 1); b = min(x for x in (n1, n2) if x >= 0) + 1
    s = s[:a] + new + s[b:]
qrep("  { q: { uz: 'Pitchdagi bosh raqam qayerdan olinadi?'",
     """  { q: { uz: 'Slaydni tuzatgandan keyin nima uchun darhol qayta aytasiz?', ru: "Зачем сразу рассказывать слайд ещё раз после исправления?" }, opts: [{ uz: 'Dars vaqti ortib qolgani uchun', ru: "Потому что осталось время урока" }, { uz: 'Sherik zerikib ketmasligi uchun', ru: "Чтобы напарник не заскучал" }, { uz: "Slaydlar soni o'zgargani uchun", ru: "Потому что изменилось число слайдов" }, { uz: "Zal savoliga javob bo'ldimi, ko'rasiz", ru: "Видно, стал ли он ответом залу" }], correct: 3 },\n""", 'q4')
qrep("  { q: { uz: \"Airbnb'ning birinchi taqdimotidagi slaydlar qanday bo'lgan?\"",
     """  { q: { uz: 'Repetitsiyada juftlik qanday ishlaydi?', ru: "Как работает пара на репетиции?" }, opts: [{ uz: 'Ikkalasi bir vaqtda gapiradi', ru: "Оба говорят одновременно" }, { uz: 'Avval A gapiradi, B tinglaydi; keyin almashasiz', ru: "Сначала говорит A, B слушает; потом меняетесь" }, { uz: "Faqat bittasi gapiradi, ikkinchisi baho qo'ymaydi", ru: "Говорит только один, второй не оценивает" }, { uz: "Har biri o'ziga o'zi aytadi", ru: "Каждый рассказывает сам себе" }], correct: 1 },\n""", 'q6')
qrep("  { q: { uz: 'Airbnb taqdimotida slaydlar qaysi tartibda kelgan?'",
     """  { q: { uz: "Varaqda hamma slaydga ✓ turibdi. Tuzatish ekranida nimani tuzatasiz?", ru: "В листе у всех слайдов ✓. Что исправите на экране исправления?" }, opts: [{ uz: 'Hech narsani — pitch tayyor', ru: "Ничего — питч готов" }, { uz: 'Birinchi slaydni', ru: "Первый слайд" }, { uz: 'Izoh yozilgan eng zaif slaydni', ru: "Самый слабый слайд, у которого есть пояснение" }, { uz: 'Hamma slaydni qaytadan', ru: "Все слайды заново" }], correct: 2 },\n""", 'q7')

# --- o'lik CSS (m7-12 andozasi)
def dead_classes(src):
    css = src[src.index('<style>{`'):src.index('`}</style>')]
    jsx = src[:src.index('<style>{`')] + src[src.index('`}</style>'):]
    cls = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", css))
    return {c for c in cls if not re.search(r"['\"` ]" + re.escape(c) + r"['\"` -]|className=\{`[^`]*\b" + re.escape(c) + r"\b|cxx\([^)]*['\"]" + re.escape(c) + r"['\"]", jsx)}
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
# 2-o'tish: bir satrli rulelar — har selektor-guruhida (vergulsiz) kamida bitta o'lik klass bo'lsa, satr butunlay o'lik (.pr-ab-katta.on kabi)
out2 = []; audit = []
for L in css.split('\n'):
    st = L.strip(); groups = [g.split('{')[0].strip() for g in re.split(r"\}", st) if '{' in g]
    if groups and st.count('{') == st.count('}') and all(',' not in g and (set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", g)) & DEAD) for g in groups):
        removed += 1; audit.append(st[:90]); continue
    out2.append(L)
css = '\n'.join(out2)
if audit: print("  2-o'tish satrlari:"); [print('    ', a) for a in audit]
for kf in []:  # F-1018-10: keyframes OLIB TASHLANMAYDI — qolipCss (fade-in-up) va jonli-modul darsdan tashqarida nom kutadi
    body = re.sub(r"@keyframes " + re.escape(kf) + r"\b[^{]*\{", "", css)
    if not re.search(r"\b" + re.escape(kf) + r"\b", body):
        m = re.search(r"[ \t]*@keyframes " + re.escape(kf) + r"\s*\{", css); j = m.end(); depth = 1
        while depth > 0: depth += (css[j] == '{') - (css[j] == '}'); j += 1
        if css[j:j+1] == '\n': j += 1
        removed += css[m.start():j].count('\n'); css = css[:m.start()] + css[j:]
css = re.sub(r"\n[ \t]*/\* === 🃏 FLASHCARDS[^\n]*", "", css)
s = s[:ca] + css + s[cb:]
print(f"  o'lik CSS: {len(DEAD)} klass, {removed} qator; qolgan: {sorted(dead_classes(s) - d0)}")
open(DST, 'w', encoding='utf8').write(s)
print('✅ yozildi', DST, s.count('\n') + 1, 'qator')
