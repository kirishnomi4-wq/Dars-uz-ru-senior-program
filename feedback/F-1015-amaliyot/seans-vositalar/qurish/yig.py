import sys
F='src/1-Modull/CssPractice.jsx'
S=open(F,encoding='utf8').read()
EKR=open(sys.argv[1],encoding='utf8').read()
def one(a):
    n=S.count(a); assert n==1,(n,a[:80]); return S.index(a)
def rep(a,b):
    global S; one(a); S=S.replace(a,b)
def cut(start,end,new=''):
    """start (ichida) .. end (tashqarida) oralig'ini almashtiradi"""
    global S; i=one(start); j=S.index(end,i); S=S[:i]+new+S[j:]

# 1. kompilyator importi
rep("""// Kod kompilyatori — UMUMIY modul (F-0809-04). Ilgari har dars o'z nusxasini saqlardi;
// endi bitta manba: har yaxshilanish hamma darsga birdan tegadi.
import HtmlCompiler, { checks as C } from '../compilator/HtmlCompiler.jsx';
""","// F-1015-303: kompilyator olindi — amaliyot o'quvchining kompyuterida (VS Code + Gemini + Live Server).\n")
# 2. praktika saqlovi va signal
cut("// F-0801-01 (102-qonun): ochiq praktika-oynasi ham saqlanadi","const AchCtx = createContext(null);")
# 3. SCREEN_META
cut("const SCREEN_META = [","const TOTAL_SCREENS","""const SCREEN_META = [
  { id: 's0',  type: 'hook',     template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',     template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 'a3',  type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 's16', type: 'test',     template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'spodium', type: 'podium',  template: 'custom', scored: false, scope: null },
  { id: 'sflash', type: 'flashcard', template: 'custom', scored: false, scope: null },
  { id: 's17', type: 'summary',  template: 'custom',   scored: false, scope: null }
];
""")
# 4. Pr/Se/Pp/Vl (endi ishlatilmaydi)
cut("const Pr = ({ children })","const Preview = (")
# 5. RECAPS — faqat s16 (idx 5)
cut("const RECAPS = {","function RecapOverlay(","""const RECAPS = {
  // idx 5 — s16: «Kartochkalarni bir qatorga qaysi qoida tizadi?» (display: flex)
  5: {
    title: { uz: 'Yonma-yon: display: flex va gap', ru: 'В ряд: display: flex и gap' }, cards: [
      { ic: '📐', h: { uz: 'display: flex — bir qatorga', ru: 'display: flex — в один ряд' },
        body: { uz: <><b className="mono">display: flex</b> ichidagi elementlarni <b>bir qatorga</b> tizadi.</>, ru: <><b className="mono">display: flex</b> выстраивает вложенные элементы <b>в один ряд</b>.</> },
        vis: <RcFlow items={['ul', 'display: flex', 'li · li · li']} /> },
      { ic: '↔️', h: { uz: "gap va padding", ru: 'gap и padding' },
        body: { uz: <><b className="mono">gap</b> — kartochkalar <b>orasidagi</b> bo'shliq, <b className="mono">padding</b> — kartochka <b>ichidagi</b>.</>, ru: <><b className="mono">gap</b> — промежуток <b>между</b> карточками, <b className="mono">padding</b> — отступ <b>внутри</b> карточки.</> },
        vis: <RcFlow items={[{ uz: "gap — orasida", ru: 'gap — между' }, { uz: 'padding — ichida', ru: 'padding — внутри' }]} sep="·" /> },
      { ic: '❓', h: { uz: "O'zingizni tekshiring", ru: 'Проверьте себя' },
        body: { uz: <>Qoida <b>ro'yxatning o'ziga</b> (<b className="mono">ul</b>) beriladi — kartochkalarga emas.</>, ru: <>Правило задаётся <b>самому списку</b> (<b className="mono">ul</b>) — не карточкам.</> },
        vis: <RcFlow items={['ul', '{ display: flex; }']} sep="·" />,
        ask: { uz: "Kartochkalar ustma-ust tursa, qaysi qoidani qo'shasiz?", ru: 'Если карточки стоят друг под другом, какое правило добавите?' } },
    ]
  },
};

""")
# 6. eski portfolio-vizual va tanlov yordamchilari
cut("// ===== Portfolio jonli ko'rinishi — modifier klasslar bilan bezatiladi =====","// Animatsiyani katta ekranda")
# 7. eski 0–16-ekranlar → yangi ekranlar
cut("// ===== SCREEN 0 — HOOK =====","// ===== 🃏 FLASHCARDS", EKR+"\n")
# 8. kartochkalar
cut("const CSS_FLASHCARDS = [","// F-0803-13/14:","""const CSS_FLASHCARDS = [
  { front: { uz: 'Harflar rangini qaysi xususiyat beradi?', ru: 'Какое свойство задаёт цвет букв?' }, back: 'color', note: { uz: 'masalan: color: #ff4f28', ru: 'например: color: #ff4f28' } },
  { front: { uz: 'Element fonini qaysi xususiyat beradi?', ru: 'Какое свойство задаёт фон элемента?' }, back: 'background-color', note: { uz: 'masalan: background-color: #1b2238', ru: 'например: background-color: #1b2238' } },
  { front: { uz: 'Burchakni yumaloq qiladigan xususiyat?', ru: 'Свойство, скругляющее углы?' }, back: 'border-radius', note: { uz: 'masalan: border-radius: 12px', ru: 'например: border-radius: 12px' } },
  { front: { uz: 'Sichqoncha ustida turgan holat qanday yoziladi?', ru: 'Как пишется состояние «мышь над элементом»?' }, back: ':hover', note: { uz: 'masalan: nav a:hover', ru: 'например: nav a:hover' } },
  { front: { uz: 'Elementlarni yonma-yon qatorga nima tizadi?', ru: 'Что выстраивает элементы в ряд?' }, back: 'display: flex', note: { uz: "ro'yxatning o'ziga (ul) beriladi", ru: 'задаётся самому списку (ul)' } },
  { front: { uz: "Flex elementlar orasidagi bo'shliq?", ru: 'Промежуток между flex-элементами?' }, back: 'gap', note: { uz: 'masalan: gap: 16px', ru: 'например: gap: 16px' } },
  { front: { uz: "Element ichidagi bo'shliq?", ru: 'Отступ внутри элемента?' }, back: 'padding', note: { uz: 'masalan: padding: 16px', ru: 'например: padding: 16px' } },
  { front: { uz: "Elementlar orasidagi tashqi bo'shliq?", ru: 'Внешний отступ между элементами?' }, back: 'margin', note: { uz: 'element chetidan tashqariga', ru: 'наружу от края элемента' } },
  { front: { uz: "VS Code'da bir so'zni butun faylda almashtirish?", ru: 'Заменить слово во всём файле в VS Code?' }, back: 'Ctrl+H', note: { uz: 'Ctrl+Alt+Enter — hammasini birdan', ru: 'Ctrl+Alt+Enter — всё сразу' } },
  { front: { uz: "Gemini'ga dizayn so'rovida nima qo'shiladi?", ru: 'Что добавить в запрос к Gemini о дизайне?' }, back: { uz: "Hozirgi style.css va «HTML'ga tegma»", ru: 'Текущий style.css и «HTML не трогай»' }, note: { uz: "Gemini bor dizaynga qo'shadi", ru: 'Gemini добавит к текущему дизайну' } },
];

""")
# 9. yakun: takrorlash, uyga vazifa
rep("""  const audio = useAudio([{ id: 's17', text: "Tabriklayman! Siz dizayner bo'ldingiz. Bir xil HTML'dan, faqat CSS yordamida chiroyli va markazlashgan portfolio yasadingiz: fon, ranglar, shriftlar, flex menyu, kartalar va tugma. Endi siz veb-sahifa yasashning ikkala kuchini ham bilasiz — HTML struktura beradi, CSS go'zallik. Ajoyib ish!", trigger: 'on_mount', waits_for: null }]);
""","""  const audio = useAudio([{ id: 's17', text: "Tabriklayman! Siz dizayner bo'ldingiz: Gemini bergan dizaynni o'qib, o'zgartirdingiz va o'z rangingizni berdingiz.", trigger: 'on_mount', waits_for: null }]);
""")
i=one("  const RECAP = [{ uz: 'background-color, color"); j=S.index("\n",S.index("  const HOMEWORK = [{ b:",i))
S=S[:i]+"""  const RECAP = [{ uz: "Gemini bergan `style.css` ni o'qib, kerakli qoidani topasiz", ru: 'Читаете `style.css` от Gemini и находите нужное правило' }, { uz: "Gemini'ga «nima o'zgarsin · faqat `style.css` · hozirgi kod» bilan yozasiz", ru: 'Пишете Gemini: «что изменить · только `style.css` · текущий код»' }, { uz: "`:hover` — sichqoncha ustidagi holat, `display: flex` + `gap` — yonma-yon kartochkalar", ru: '`:hover` — состояние под мышью, `display: flex` + `gap` — карточки в ряд' }, { uz: "Rangni butun faylda `Ctrl+H` bilan o'zingiz almashtirasiz", ru: 'Сами меняете цвет во всём файле через `Ctrl+H`' }];
  const HW_ITEMS = HOMEWORK.items;"""+S[j:]
rep("""<ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.06}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul>""","""<ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.06}s` }}><span className="ck">✓</span><span>{fmtCode(tr(r))}</span></li>))}</ul>""")
rep("""<span className="hw-big-s">{tr({ uz: 'Amaliy topshiriqni bajarish →', ru: 'Выполнить практическое задание →' })}</span>""","""<span className="hw-big-s">{tr({ uz: "Topshiriqni ko'rish →", ru: 'Посмотреть задание →' })}</span>""")
i=one("{hwOpen && <div className=\"card hw fade-up d4\">"); j=one("        {!isMentorL && <div className=\"card ach-coll fade-up d3\">")
S=S[:i]+"""{hwOpen && <div className="card hw fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>🎨 {tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</div><p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr(HOMEWORK.title)} — {tr({ uz: "VS Code'da:", ru: 'в VS Code:' })}</p><ol className="am-hw">{HW_ITEMS.map((h, i) => (<li key={i}>{tr(h)}</li>))}</ol><p className="hw-note">{tr({ uz: 'Tayyor sahifaning skrinshotini platformaga yuklang.', ru: 'Загрузите скриншот готовой страницы на платформу.' })}</p></div>}
"""+S[j:]
rep("const Screen17 = ({ screen, answers, achievements, onReset, onPrev, onFinish, onHomework }) => {","const Screen17 = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {")
# 10. nishonlar — bloklarga (F-1015-303)
cut("const ACHIEVEMENTS = {","function AchCelebrate(","""const ACHIEVEMENTS = {
  spacer:   { icon: '📦', name: 'Spacer',       desc: { uz: 'Menyu havolalarini tugmaga aylantirdingiz', ru: 'Вы превратили ссылки меню в кнопки' } },
  layout:   { icon: '📐', name: 'Lined Up!',    desc: { uz: 'Loyihalarni yonma-yon kartochkalarga tizdingiz', ru: 'Вы выстроили проекты карточками в ряд' } },
  color:    { icon: '🎨', name: 'Color Master', desc: { uz: "Saytga o'zingiz tanlagan rangni berdingiz", ru: 'Вы дали сайту свой цвет' } },
  graduate: { icon: '🏆', name: 'Designer',     desc: { uz: 'CSS praktikani oxirigacha bajardingiz', ru: 'Вы прошли CSS практику до конца' } },
};
// F-1015-303 (foydalanuvchi qarori): nishon BLOKKA bog'lanadi — blok «Davom etish»da beriladi (bonus, §184; isbot yo'q — ustoz ko'rib turadi).
const BLOK_ACH = { a1: 'spacer', a2: 'layout', a3: 'color' };
// Testga bog'langan nishon yo'q (yagona ballik — s16).
const ACH_TRIGGERS = {};

""")
# 11. mentor praktika paneli, kompilyator topshiriqlari → uyga vazifa
cut("// Jonli darsda mentor praktika paneli","// ===== 🏆 «BUGUNGI G'OLIBLARIMIZ»","""// 🏠 LMS uchun statik uy-vazifa deklaratsiyasi — VS Code'da, o'quvchining o'z kompyuterida (HtmlPractice naqshi: skrinshot yuklanadi)
export const HOMEWORK = {
  type: 'file',
  title: { uz: "Portfolioni yana bir qadam o'zingizniki qiling", ru: 'Сделайте портфолио ещё на шаг своим' },
  brief: {
    uz: "Darsdagi portfolio sahifangizni uy kompyuteringizda VS Code'da davom ettirasiz — har o'zgarishdan keyin Ctrl+S, natija Live Server'da. Tayyor sahifaning skrinshotini platformaga yuklaysiz.",
    ru: 'Страницу-портфолио с урока продолжите дома в VS Code — после каждого изменения Ctrl+S, результат в Live Server. Скриншот готовой страницы загрузите на платформу.'
  },
  items: [
    { uz: "Gemini'ga o'zingiz prompt yozib, footer'ni bezang", ru: 'Сами напишите промпт Gemini и оформите footer' },
    { uz: "«Aloqa»dagi «Pochta» havolasini menyudagi tugmalardek qiling — Gemini'siz, menyu tugmasi qoidasidan foydalanib", ru: 'Сделайте ссылку «Почта» в «Контактах» как кнопки меню — без Gemini, по правилу кнопки меню' },
  ],
};

""")
rep("""const PODIUM_LABELS = {
  4:  { uz: 'color — matn rangi',        ru: 'color — цвет текста' },
  6:  { uz: 'text-align — joylashuv',    ru: 'text-align — выравнивание' },
  8:  { uz: 'display: flex — qator',     ru: 'display: flex — ряд' },
  11: { uz: "padding — ichki bo'shliq",  ru: 'padding — внутренний отступ' },
  14: { uz: 'justify-content — markaz',  ru: 'justify-content — центр' },
  16: { uz: 'Yakuniy amaliy (CSS yozish)', ru: 'Финальная практика (написать CSS)' }
};""","""const PODIUM_LABELS = {
  5: { uz: 'display: flex — kartochkalar qatorda', ru: 'display: flex — карточки в ряд' }
};""")
rep("""// Javob kaliti (INLINE_KEYS) — mavjud test correctIdx'lari (⚡ Jonli tekshiradi/tasdiqlaydi).
// s16 = -1 sentinel (yakuniy amaliy — CSS qo'lda yoziladi, server picked bilan solishtirmaydi).
const INLINE_KEYS = { s4: 0, s6: 3, s8: 2, s11: 1, s14: 3, s16: -1 };""","""// Javob kaliti (INLINE_KEYS) — yagona ballik test (⚡ Jonli tekshiradi/tasdiqlaydi). F-1015-303: s16 — MC, ✔ C.
const INLINE_KEYS = { s16: 2 };""")
# 12. root: praktika holati, ochish/tiklash, next, reset, render
rep("""export default function CssPractice({ lang: langProp, onFinished, onPractice, liveToken }) {""","""export default function CssPractice({ lang: langProp, onFinished, liveToken }) {""")
rep("""  const [practice, setPractice] = useState(null);            // lokal overlay compilatori: { task, starter, done } yoki null
  const [mentorPractice, setMentorPractice] = useState(null); // jonli darsda mentor praktika paneli
""","")
cut("  // Praktikani ishga tushiradi: productionda onPractice (LMS), lokalda overlay compilatori.","  const prev = () =>","""  // F-1015-303: amaliyot bloki «Davom etish»da nishon beradi; kompilyator va praktika-signali yo'q.
  const next = () => {
    const ach = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id];
    if (ach && live.mode !== 'mentor') earn(ach);
    advance();
  };
""")
rep("""    if (_m && _m.scored && _m.scope === 'final' && data && data.correct && live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0);""","""    // eski «custom» final uchun edi; MC test o'zi yuboradi (QuestionScreen) — ikkinchi yozuv `picked: 0` bilan ketmasin
    if (_m && _m.scored && _m.scope === 'final' && _m.template !== 'MCScreen' && data && data.correct && live.mode === 'student') live.submitAnswer(idx, _m.id, 0, true, 0);""")
rep("""progClear(LESSON_META.lessonId); pracClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); setPractice(null); setMentorPractice(null); startTimeRef.current = Date.now(); };""","""progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };""")
rep("""  // Tartib SCREEN_META bilan AYNAN bir xil: …s16 (yakuniy amaliy) → spodium (g'oliblar) → sflash → s17 (yakun)
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, Screen16, ScreenPodium, ScreenFlashcards, Screen17];""","""  // Tartib SCREEN_META bilan AYNAN bir xil: s0 → s1 → a1 → a2 → a3 → s16 (topshirish) → spodium → sflash → s17 (yakun)
  const screens = [Screen0, Screen1, ScreenAmaliyot, ScreenAmaliyot, ScreenAmaliyot, Screen16, ScreenPodium, ScreenFlashcards, Screen17];""")
rep("""onReset={reset} onFinish={finishLesson} onHomework={openHomeworkPractice} />""","""onReset={reset} onFinish={finishLesson} />""")
cut("      {/* Lokal praktika overlay (LMS compilatorining o'rnini bosadi). */}","    </LangContext.Provider>","")
open(F,'w',encoding='utf8').write(S); print('ok', S.count('\n'))
