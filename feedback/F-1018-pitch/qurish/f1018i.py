# F-1018-09 · m10-12 PmGrowthPitchLesson (LMS 12-Modul 12-dars) 16 → 11 (222-qonun; s9 grafik kodi QOLADI — QAROR 2). Zaxiradan quradi: python3 f1018i.py
import re, sys
R = '/home/kali/Desktop/internetLesson'
SRC = f'{R}/arxiv/F-1018-09-oldin/PmGrowthPitchLesson.jsx'
DST = f'{R}/src/10-Modull/PmGrowthPitchLesson.jsx'
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

rep("lessonId: 'pm-m10d12-v1'", "lessonId: 'pm-m10d12-v2'")
rep("// 12-Modul · 12-dars (PM, 2-tur) «Raqamlaringiz zalni ishontiradimi?» — kalit m10-12, 16 ekran (modul yakuni, metrikali pitch).",
    "// 12-Modul · 12-dars (PM, 2-tur) «Raqamlaringiz zalni ishontiradimi?» — kalit m10-12, 11 ekran (v2 · F-1018-09 · 222-qonun; modul yakuni, metrikali pitch).")
rep("// 16 ekran (MD v3): kirish → reja → besh bo'lak → 1-savol → o'sish grafigi → 2-savol → Uzum → 3-savol → jonli demo → kod yozish → pitch yozish → juftlikda pitch → yakuniy savol → podium → kartochkalar → yakun",
    "// 11 ekran (v2): kirish → reja → besh bo'lak → o'sish grafigi → jonli demo → kod yozish (grafik, qoladi) → pitch yozish → juftlikda pitch (+ 4-qadam «Qayta ayting (1 daqiqa)», 2-raund) → yakuniy savol → podium → yakun.\n//   Olindi: 1/2/3-savol, Uzum keysi, kartochkalar. Yakuniy MD: feedback/F-1018-pitch/YAKUNIY-07-m10-12.md")
a = s.index('const SCREEN_META = ['); b = s.index('const TOTAL_SCREENS')
s = s[:a] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // 0 · QKirish
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // 1 · QReja
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 2 · besh bo'lak
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 3 · o'sish grafigi
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 4 · jonli demo
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 5 · kod yozish: grafik (qoladi — QAROR 2)
  { id: 's10', type: 'practice',    template: 'custom',   scored: false, scope: null },            // 6 · pitch yozish
  { id: 's11', type: 'practice',    template: 'custom',   scored: false, scope: null },            // 7 · juftlikda pitch (Ayting · Baholang · Tuzating · Qayta ayting)
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // 8 · yakuniy savol
  { id: 'podium', type: 'stats',    template: 'custom',   scored: false, scope: null },            // 9 · podium
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }             // 10 · QYakun
];
""" + s[b:]
rep("const INLINE_KEYS = { s3: 2, s5: 0, s7: 3, s12: 1, beshBolak: -1, grafik: -1, demo: -1, kod: -1, practice: -1, juftlik: -1 };",
    "const INLINE_KEYS = { s12: 1, beshBolak: -1, grafik: -1, demo: -1, kod: -1, practice: -1, juftlik: -1 };")
a = s.index('const RECAPS = {'); b = s.index('\n};', a) + 3
m = re.search(r"\n  12: \{.*?\n  \},?", s[a:b], re.S)
if not m: print('❌ RECAPS 12'); sys.exit(1)
s = s[:a] + 'const RECAPS = {' + m.group(0).replace('\n  12: {', '\n  8: {').rstrip(',') + '\n};' + s[b:]
a = s.index('const Q_LABELS = {'); b = s.index('\n};', a) + 3
s = s[:a] + """const Q_LABELS = {
  8: { uz: 'Sekinlashuv va halol gap', ru: 'Замедление и честная фраза' }
};""" + s[b:]

cut("// ===== SCREEN 3 — 1-SAVOL", "// ===== SCREEN 4 — O'SISH GRAFIGI", "s3 test")
cut("// ===== SCREEN 5 — 2-SAVOL", "// ===== SCREEN 6 — UZUM", "s5 test")
cut("// ===== SCREEN 6 — UZUM", "// ===== SCREEN 8 — JONLI DEMO", "s6 Uzum + s7 test")
cut("// ===== KARTOCHKALAR — alohida ekran", "// ===== UYGA VAZIFA — PM HwCard", "kartochkalar")

# yakun indekslari: s10 10→6 · s9 9→5
rep("  const s10 = answers[10];", "  const s10 = answers[6]; // v2: pitch yozish — 6-indeks")
rep("  const s9 = answers[9];", "  const s9 = answers[5]; // v2: kod yozish — 5-indeks")

# root
rep("""  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });""",
"""  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));""", 'root nav')
s = re.sub(r"\n  // 🃏 Flashcard[^\n]*", "", s)
rep("const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, ScreenPodium, ScreenFlashcards, SummaryScreen];",
    "const screens = [Screen0, Screen1, Screen2, Screen4, Screen8, Screen9, Screen10, Screen11, Screen12, ScreenPodium, SummaryScreen];")

# nishon: secondTake (5-nishon, s11 2-raund — EarnCtx)
rep("""  partFixed: { icon: '🔧', name: 'Part Fixed!', desc: { uz: "Varaqdagi izohdan keyin bo'lakni qayta yozdingiz", ru: "Вы переписали часть по комментарию на листе" } }
};""", """  partFixed: { icon: '🔧', name: 'Part Fixed!', desc: { uz: "Varaqdagi izohdan keyin bo'lakni qayta yozdingiz", ru: "Вы переписали часть по комментарию на листе" } },
  secondTake: { icon: '🔁', name: 'Second Take!', desc: { uz: "Tuzatilgan bo'lakni 1 daqiqada qayta aytdingiz", ru: 'Вы ещё раз рассказали исправленную часть за 1 минуту' } }
};""", 'secondTake')

# REJA: Uzum qadami → tayyorgarlik, 4-qadam — ikki raund
rep("""  { t: { uz: <><Uz /> qanday o'sganini ko'rasiz</>, ru: <>Увидите, как рос <Uz /></> }, teg: { uz: 'voqea', ru: 'история' } },
  { t: { uz: 'Pitchni sherigingizga jonli demo bilan aytasiz', ru: 'Расскажете питч партнёру с живым демо' }, teg: { uz: 'jonli demo', ru: 'живое демо' } }
];""", """  { t: { uz: "Grafikni o'z sonlaringizdan chizib, pitchni besh bo'lakka yozasiz", ru: 'Начертите график по своим числам и напишете питч из пяти частей' }, teg: { uz: 'jonli demo', ru: 'живое демо' } },
  { t: { uz: 'Pitchni sherigingizga 5 daqiqada aytib, tuzatib 1 daqiqada qayta aytasiz', ru: 'Расскажете питч партнёру за 5 минут, исправите и расскажете ещё раз за 1 минуту' }, teg: { uz: 'ikki raund', ru: 'два раунда' } }
];""", 'REJA')

# Screen11: 4-qadam «Qayta ayting (1 daqiqa)» — 2-raund
A = s.index("const Screen11 = ("); B = s.index("// ===== SCREEN 12 — YAKUNIY SAVOL", A); blk = s[A:B]
def rb(old, new, label):
    global blk
    if blk.count(old) != 1: print(f'❌ Screen11 {label}: {blk.count(old)}'); sys.exit(1)
    blk = blk.replace(old, new)
rb("  const done = tuzSoni > 0;\n", """  const done = tuzSoni > 0;
  // F-1018-09 (222.1): 4-qadam — tuzatilgan bo'lak sherikka 1 daqiqada qayta aytiladi (2-raund); saqlangan bo'lsa to'xtagan holda tiklanadi
  const [tm2, setTm2] = useState(st.qayta ?? 0);
  const [yur2, setYur2] = useState(false);
  const [aytildi, setAytildi] = useState(st.qayta != null);
  useEffect(() => { if (!yur2) return undefined; const t = setInterval(() => setTm2(v => v + 1), 1000); return () => clearInterval(t); }, [yur2]);
  const tayyor = isMentor || (done && aytildi);
  const boshla2 = () => { setTm2(0); setYur2(true); setAytildi(false); };
  const toxtat2 = () => {
    setYur2(false); setAytildi(true);
    if (isMentor) return;
    saqlaKalit({ qayta: tm2 });
    onAnswer(screen, { stage: 'juftlik', screenIdx: screen, qadam: 2, vaqt, varaq, qayta: tm2, solved: true, picked: true, correct: true });
    earn('secondTake');
  };
""", 'state')
rb("""<NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Bitta bo'lakni o'zgartiring", ru: 'Измените одну часть' })} onClick={onNext} />""",
   """<NavNext optionalLive disabled={!tayyor} label={tayyor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : done ? tr({ uz: 'Qayta ayting (1 daqiqa)', ru: 'Скажите ещё раз (1 минута)' }) : tr({ uz: "Bitta bo'lakni o'zgartiring", ru: 'Измените одну часть' })} onClick={onNext} />""", 'NavNext')
rb("        mentor={<Mentor key={'m' + korQ}>{tr(mGap)}</Mentor>}",
   "        mentor={<Mentor key={'m' + korQ + (done ? 'd' : '') + (aytildi ? 'a' : '')}>{tr(mGapQ)}</Mentor>}", 'mentor')
rb("  return (\n    <Stage eyebrow={juft ?", """  const mGapQ = done && !isMentor
    ? (aytildi ? { uz: 'Ikkinchi marta aytildi: «Davom etish»ni bosing.', ru: 'Рассказано второй раз: нажмите «Продолжить».' }
      : juft ? { uz: "Bo'lak o'zgartirildi: endi uni sherigingizga 1 daqiqada qayta ayting.", ru: 'Часть изменена: теперь расскажите её партнёру ещё раз за 1 минуту.' } : { uz: "Bo'lak o'zgartirildi: endi uni ovoz chiqarib 1 daqiqada qayta ayting.", ru: 'Часть изменена: теперь расскажите её вслух ещё раз за 1 минуту.' })
    : mGap;
  return (
    <Stage eyebrow={juft ?""", 'mGapQ')
rb("""          {done && !isMentor && <QXulosa>{tr({ uz: "Varaq to'ldi va bitta bo'lak o'zgartirildi. Qolgan ✗ bo'laklar — uyga vazifada.", ru: 'Лист заполнен, и одна часть изменена. Остальные части с ✗ — в домашнем задании.' })}</QXulosa>}""",
"""          {done && !isMentor && !aytildi && <QXulosa>{tr({ uz: "Varaq to'ldi va bitta bo'lak o'zgartirildi. Qolgan ✗ bo'laklar — uyga vazifada.", ru: 'Лист заполнен, и одна часть изменена. Остальные части с ✗ — в домашнем задании.' })}</QXulosa>}
          {done && !isMentor && <div className="gp-s11-qayta">
            <QIzoh>{juft
              ? tr({ uz: "2-raund: o'zgartirilgan bo'lakni sherigingizga 1 daqiqada qayta ayting — endi zal savoliga javob bo'ldimi?", ru: 'Раунд 2: расскажите изменённую часть партнёру ещё раз за 1 минуту — теперь это ответ на вопрос зала?' })
              : tr({ uz: "2-raund: o'zgartirilgan bo'lakni ovoz chiqarib 1 daqiqada qayta ayting — endi zal savoliga javob bo'ldimi?", ru: 'Раунд 2: расскажите изменённую часть вслух ещё раз за 1 минуту — теперь это ответ на вопрос зала?' })}</QIzoh>
            <div className="gp-s11-qt">
              <b className={cxx('gp-s11-qs', tm2 > 60 && 'oshdi')}>{mss(tm2)}</b>
              {yur2 && <span className="gp-gapir"><i />{tr({ uz: 'Hozir siz gapirasiz', ru: 'Сейчас говорите вы' })}</span>}
              <span className="gp-s11-qb">
                {!yur2 && !aytildi && <QTugma className="gp-halqa" onClick={boshla2}>{tr({ uz: '1 daqiqani boshlash', ru: 'Запустить 1 минуту' })}</QTugma>}
                {yur2 && <QTugma className="gp-halqa" onClick={toxtat2}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>}
                {!yur2 && aytildi && <QTugma ikkinchi onClick={boshla2}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</QTugma>}
              </span>
            </div>
            {aytildi && <QXulosa>{tr({ uz: "O'zgartirilgan bo'lak ikkinchi marta aytildi — pitch Demo Day'ga tayyor. Qolgan ✗ bo'laklar — uyga vazifada.", ru: 'Изменённая часть рассказана второй раз — питч готов к Демо-дню. Остальные части с ✗ — в домашнем задании.' })}</QXulosa>}
          </div>}""", '2-raund blok')
s = s[:A] + blk + s[B:]
rep("        .gp-varaq { display: flex;", """        .gp-s11-qayta { display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .gp-s11-qt { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; }
        .gp-s11-qs { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 700; letter-spacing: .02em; }
        .gp-s11-qs.oshdi { color: ${T.err}; }
        .gp-s11-qb { display: flex; gap: 8px; margin-left: auto; }
        .gp-varaq { display: flex;""", 'css qayta')

# QUIZ: «Uzum qachon ishga tushgan?» (correct 0) → 2-raund savoli, to'g'ri javob A da qoladi
def qrep(start, new, label):
    global s
    a = s.find(start)
    if a < 0: print(f'❌ QUIZ {label}'); sys.exit(1)
    n1 = s.find("\n  { q:", a + 1); n2 = s.find("\n];", a + 1); b = min(x for x in (n1, n2) if x >= 0) + 1
    s = s[:a] + new + s[b:]
qrep("  { q: { uz: 'Uzum qachon ishga tushgan?'",
     """  { q: { uz: "Bo'lakni o'zgartirgandan keyin nima uchun darhol 1 daqiqada qayta aytasiz?", ru: 'Зачем сразу рассказывать изменённую часть ещё раз за 1 минуту?' }, opts: [{ uz: "Zal savoliga javob bo'ldimi, ko'rinadi", ru: 'Видно, стала ли она ответом залу' }, { uz: 'Dars vaqti ortib qolgani uchun', ru: 'Потому что осталось время урока' }, { uz: 'Sherik yana tinglashni xohlagani uchun', ru: 'Потому что партнёр хочет послушать ещё' }, { uz: 'Taymer shunday sozlangani uchun', ru: 'Потому что так настроен таймер' }], correct: 0 },\n""", 'q Uzum')

# o'lik CSS (2 o'tish)
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
