# F-1018-05 · m7-12 PmUserStoryPitchLesson 16 → 10 (222-qonun, 7–14-M pilot). Zaxiradan quradi: python3 f1018e.py
import re, sys
R = '/home/kali/Desktop/internetLesson'
SRC = f'{R}/arxiv/F-1018-05-oldin/PmUserStoryPitchLesson.jsx'
DST = f'{R}/src/7-Modull/PmUserStoryPitchLesson.jsx'
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

rep("lessonId: 'm7-12-v1'", "lessonId: 'm7-12-v2'")
rep("«Pitchingizda kimning hikoyasi bor?» — kalit m7-12, 16 ekran.", "«Pitchingizda kimning hikoyasi bor?» — kalit m7-12, 10 ekran (v2 · F-1018-05 · 222-qonun: oraliq testlar, Canva, kod yozish, kartochkalar olindi).")
a = s.index('const SCREEN_META = ['); b = s.index('const TOTAL_SCREENS')
s = s[:a] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // 0 · QKirish
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // 1 · QReja
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 2 · QTushuncha: raqam va hikoya
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 3 · QTushuncha: saralash
  { id: 's8',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 4 · QTushuncha: uch slayd
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 5 · QMustaqil: pitch yozish
  { id: 's11', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // 6 · yakuniy savol
  { id: 's12', type: 'reflection',  template: 'custom',   scored: false, scope: null },            // 7 · QMustaqil: repetitsiya (juftlik 2 daq + yakka 1 daq)
  { id: 'podium', type: 'stats',      template: 'custom', scored: false, scope: null },            // 8 · podium
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }             // 9 · QYakun
];
""" + s[b:]
rep("const INLINE_KEYS = { s3: 1, s5: 2, s7: 0, s11: 3, saralash: -1, slaydlar: -1, practice: -1, koding: -1, repetitsiya: -1 };",
    "const INLINE_KEYS = { s11: 3, saralash: -1, slaydlar: -1, practice: -1, repetitsiya: -1 };")
# RECAPS: faqat 11 → 6
a = s.index('const RECAPS = {'); b = s.index('\n};', a) + 3
m = re.search(r"\n  11: \{.*?\n  \},?", s[a:b], re.S)
if not m: print('❌ RECAPS 11'); sys.exit(1)
s = s[:a] + 'const RECAPS = {' + m.group(0).replace('\n  11: {', '\n  6: {').rstrip(',') + '\n};' + s[b:]
a = s.index('const Q_LABELS = {'); b = s.index('\n};', a) + 3
s = s[:a] + """const Q_LABELS = {
  6: { uz: 'Foydalanuvchi slaydi', ru: 'Слайд «Пользователь»' }
};""" + s[b:]
# kesishlar
cut("// ===== SCREEN 3 — 1-SAVOL", "// ===== SCREEN 4 — BO'LIB", "s3 test")
cut("// ===== SCREEN 5 — 2-SAVOL", "// ===== SCREEN 8 — UCH SLAYD", "s5+s6 Canva+s7")
cut("// ===== SCREEN 10 — KOD YOZISH", "// ===== SCREEN 11 — YAKUNIY SAVOL", "s10 kod")
cut("// 🃏 Kartochka mexanikasi", "// ===== UYGA VAZIFA — PM HwCard", "kartochkalar")
rep("import HtmlCompiler, { checks as C } from '../compilator/HtmlCompiler.jsx';\n", "")
# root
rep("""  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });""",
"""  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));""")
rep("const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, ScreenPodium, ScreenFlashcards, SummaryScreen];",
    "const screens = [Screen0, Screen1, Screen2, Screen4, Screen8, Screen9, Screen11, Screen12, ScreenPodium, SummaryScreen];")
# flashHidden izoh qatori qolgan bo'lsa
s = re.sub(r"\n  // 🃏 Flashcard[^\n]*", "", s)
# QUIZ_BANK: Melanie (Canva) → repetitsiya savoli (correct 0 saqlanadi)
a = s.index("  { q: { uz: 'Melanie Perkins har rad javobidan keyin nima qilgan?'"); n1 = s.find("\n  { q:", a + 1); n2 = s.find("\n];", a + 1); b = min(x for x in (n1, n2) if x >= 0) + 1
s = s[:a] + "  { q: { uz: 'Repetitsiyada sherigingiz bir daqiqa tinglaydi. Keyin u nima yozadi?', ru: 'На репетиции напарник слушает минуту. Что он потом пишет?' }, opts: [{ uz: 'Qaysi slaydda hikoya yetishmaganini', ru: 'На каком слайде не хватило истории' }, { uz: 'Pitch yoqqan yoki yoqmaganini', ru: 'Понравился питч или нет' }, { uz: 'Slaydlar nechta bo\\'lganini', ru: 'Сколько было слайдов' }, { uz: 'Ovoz baland yoki past bo\\'lganini', ru: 'Громким был голос или тихим' }], correct: 0 },\n" + s[b:]

# Reja: Canva qadami o'rniga ikki marta aytish
rep("""  { t: { uz: "Mashhur sayt muammoni qanday ko'rsatganini bilib olasiz", ru: 'Узнаете, как известный сайт показал проблему' }, teg: { uz: 'biznes', ru: 'бизнес' } },
  { t: { uz: 'Loyihangiz pitchini yozib, sinfdoshga aytasiz', ru: 'Напишете питч проекта и расскажете однокласснику' }, teg: { uz: 'repetitsiya', ru: 'репетиция' } }
];""", """  { t: { uz: 'Loyihangiz pitchini uch slaydga yozasiz', ru: 'Напишете питч проекта на трёх слайдах' }, teg: { uz: 'pitch', ru: 'питч' } },
  { t: { uz: 'Ikki marta ovoz chiqarib aytasiz: sinfdoshga, keyin tuzatib yana', ru: 'Дважды произнесёте вслух: однокласснику, потом ещё раз с правкой' }, teg: { uz: 'repetitsiya', ru: 'репетиция' } }
];""", 'REJA')
# Screen12: ikkinchi raund (222.1) — qator yozilgach «tuzatib qayta ayting» 1 daqiqa; Davom shu raunddan keyin
A = s.index("const Screen12 = ("); B = s.index("// ===== 🏅 BADGES", A); blk = s[A:B]
def rb(old, new, label):
    global blk
    if blk.count(old) != 1: print(f'❌ Screen12 {label}: {blk.count(old)}'); sys.exit(1)
    blk = blk.replace(old, new)
rb("  const [vaqt, setVaqt] = useState(!!storedAnswer?.vaqt);\n", "  const [vaqt, setVaqt] = useState(!!storedAnswer?.vaqt);\n  const [vaqt2, setVaqt2] = useState(!!storedAnswer?.vaqt2);   // F-1018-05 (222.1): 2-raund — tuzatib qayta aytish\n", 'vaqt2')
rb("  const tayyor = isMentor || yozildi;", "  const tayyor = isMentor || (yozildi && vaqt2);", 'tayyor')
rb("onAnswer(screen, { stage: 'repetitsiya', screenIdx: screen, qator: qator.trim(), vaqt, picked: true, solved: true, correct: vaqt });", "onAnswer(screen, { stage: 'repetitsiya', screenIdx: screen, qator: qator.trim(), vaqt, vaqt2, picked: true, solved: true, correct: vaqt });", 'onAnswer')
rb("  }, [yozildi, vaqt]); // eslint-disable-line", "  }, [yozildi, vaqt, vaqt2]); // eslint-disable-line", 'deps')
rb("<NavNext optionalLive disabled={!tayyor} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />", "<NavNext optionalLive disabled={!tayyor} label={tayyor || !yozildi ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Qayta ayting (1 daqiqa)', ru: 'Скажите ещё раз (1 минута)' })} onClick={onNext} />", 'NavNext')
rb("1 daqiqada ayting, keyin bir qator yozing.</>", "1 daqiqada ayting, keyin bir qator yozing, so'ng tuzatib yana bir marta ayting.</>", 'mentor uz')
i = blk.index("ru: <>Проговорить питч вслух перед сценой"); j = blk.index("</>", i)
blk = blk[:j] + " Потом поправьте и скажите ещё раз." + blk[j:]
rb("""        {yozildi && <QXulosa>{tr({ uz: 'Bugungi qoida: pitchda raqam yonida bitta real odamning hikoyasi turadi.', ru: 'Правило дня: в питче рядом с числом стоит история одного реального человека.' })}</QXulosa>}""",
"""        {yozildi && !isMentor && <div className="ps-s12-qayta">
          <QIzoh>{tr({ uz: "2-raund: yozgan qatoringizni hisobga olib, pitchni yana 1 daqiqada ayting — hikoya raqam yonida tursin.", ru: 'Раунд 2: с учётом написанной строки произнесите питч ещё раз за 1 минуту — история рядом с числом.' })}</QIzoh>
          <PitchTaymer juft={false} onTugadi={() => setVaqt2(true)} />
        </div>}
        {yozildi && <QXulosa>{tr({ uz: 'Bugungi qoida: pitchda raqam yonida bitta real odamning hikoyasi turadi.', ru: 'Правило дня: в питче рядом с числом стоит история одного реального человека.' })}</QXulosa>}""", '2-raund blok')
s = s[:A] + blk + s[B:]
i = s.index(".ps-s12-bosh"); j = s.index("\n", i) + 1
s = s[:j] + "        .ps-s12-qayta { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }\n" + s[j:]

# o'lik CSS
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
    classes = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", sel)) if sel.startswith('.') else set()
    if classes and classes <= DEAD:
        depth = st.count('{') - st.count('}'); removed += 1; i += 1
        while depth > 0 and i < len(lines): depth += lines[i].count('{') - lines[i].count('}'); removed += 1; i += 1
        continue
    out.append(L); i += 1
css = '\n'.join(out)
for kf in []:  # F-1018-10: keyframes OLIB TASHLANMAYDI — qolipCss (fade-in-up) va jonli-modul darsdan tashqarida nom kutadi
    body = re.sub(r"@keyframes " + re.escape(kf) + r"\b[^{]*\{", "", css)
    if not re.search(r"\b" + re.escape(kf) + r"\b", body):
        m = re.search(r"[ \t]*@keyframes " + re.escape(kf) + r"\s*\{", css); j = m.end(); depth = 1
        while depth > 0: depth += (css[j] == '{') - (css[j] == '}'); j += 1
        if css[j:j+1] == '\n': j += 1
        removed += css[m.start():j].count('\n'); css = css[:m.start()] + css[j:]
s = s[:ca] + css + s[cb:]
print(f"  o'lik CSS: {len(DEAD)} klass, {removed} qator; qolgan: {sorted(dead_classes(s) - d0)}")
open(DST, 'w', encoding='utf8').write(s)
print('✅ yozildi', DST, s.count('\n') + 1, 'qator')
