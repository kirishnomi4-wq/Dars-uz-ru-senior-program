# F-1015-351 · m4-14 FullstackFeedbackLesson: 21 → 8 ekran (kirish · reja · a1 fikr yig'ish · a2 doska (s5) · a3 upgrade (Gemini) · s16 yakuniy · podium · yakun); o'ylab topilgan ismlar olindi
import os, shutil
ROOT = '/home/kali/Desktop/internetLesson'
P = ROOT + '/src/4-Modull/FullstackFeedbackLesson.jsx'
P3 = ROOT + '/src/2-Modull/PracticeLesson3.jsx'
Q = ROOT + '/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
ARX = ROOT + '/arxiv/F-1015-fullstackfeedback-oldin/FullstackFeedbackLesson.jsx'
if not os.path.exists(ARX):
    os.makedirs(os.path.dirname(ARX), exist_ok=True); shutil.copy(P, ARX)
s = open(ARX, encoding='utf-8').read()
def R(old, new, n=1):
    global s
    c = s.count(old)
    assert c == n, (c, old[:90])
    s = s.replace(old, new)
def cut(a, b):
    global s
    i = s.index(a); j = s.index(b, i); s = s[:i] + s[j:]
R("// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI", "// F-1015-351 (17.10, tungi avtopilot): 21 → 8 ekran. a1 — haqiqiy sinfdoshdan 3 fikr (aniq/umumiy, ccStoyankaFikr), a2 — foyda/mehnat doskasi (eski s5),\n//        a3 — upgrade Gemini bilan (tasdiq, dashboard, narx sozlamasi; aniq fikrlar promptga), s16 — confirm yakuniy. O'ylab topilgan ismlar (Aziz, Laylo, Bek, Diana) olindi\n//        (personaj qoidasi): kirishda «sinfdosh», doskada «1-fikr…4-fikr». Oldingi 21 ekranli: arxiv/F-1015-fullstackfeedback-oldin/.\n// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI")
i = s.index('const SCREEN_META = ['); j = s.index('];', i) + 2
s = s[:i] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-351: sinfdosh fikri
  { id: 's5',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // a2 — foyda/mehnat doskasi
  { id: 'a3',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // upgrade (Gemini)
  { id: 's16', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'spodium', type: 'stats',   template: 'custom',   scored: false, scope: null },
  { id: 's17', type: 'summary',     template: 'custom',   scored: false, scope: null }
];""" + s[j:]
i = s.index('// ===== SCREEN 1 — REJA'); j = s.index('// ===== SCREEN 5 —')
s = s[:i] + open(Q + 'f351-blok.jsx', encoding='utf-8').read() + '\n' + s[j:]
cut('// ===== SCREEN 6 —', '// ===== SCREEN 16 —')
R("<Stage eyebrow={tr({ uz: 'Ustuvorlik doskasi', ru: 'Доска приоритетов' })}", "<Stage eyebrow={tr({ uz: 'Amaliyot 2 · saralash', ru: 'Практика 2 · отбор' })}")
# o'ylab topilgan ismlar
for a, b in [
  ('"Hech narsa — Aziz shoshib bosgan, panel aybdor emas"', '"Hech narsa — sinfdosh shoshib bosgan, panel aybdor emas"'),
  ("'Ничего — Aziz нажал впопыхах", "'Ничего — одноклассник нажал впопыхах"),
  ("<b style={{ color: T.ink }}>Aziz</b> ", ""),
  ("joyni bosib ko'ring — Azizning o'rnida.", "joyni bosib ko'ring — uning o'rnida."),
  ("побудьте на месте Aziza.", "побудьте на его месте."),
  ("'Aziz panelni sinayapti', ru: 'Aziz тестирует панель'", "'Sinfdosh panelni sinayapti', ru: 'Одноклассник тестирует панель'"),
  ("😳 Aziz: ", "😳 "),
  ("Aziz esa uni bir bosishda topdi.", "Sinfdosh esa uni bir bosishda topdi."),
  ("А Aziz нашёл его с одного клика.", "А одноклассник нашёл его с одного клика."),
  ("Aziz aybdor emas", "Sinfdosh aybdor emas"),
  ("Aziz topgan muammo hal!", "Sinfdosh topgan muammo hal!"),
  ("Проблема, которую нашёл Aziz, решена!", "Проблема, которую нашёл одноклассник, решена!"),
  ("Aziz не виноват", "Одноклассник не виноват"),
  ("Aziz topgan xato xavfli", "1-fikrdagi xato xavfli"),
  ("Ошибка, которую нашёл Aziz, опасна", "Ошибка из отзыва 1 опасна"),
  ("Laylo topgan muammo muhim", "2-fikrdagi muammo muhim"),
  ("проблема, которую нашла Laylo, важна", "проблема из отзыва 2 важна"),
  ("Aziz topgan xavfli xato hal bo'lmay qoladi", "1-fikrdagi xavfli xato hal bo'lmay qoladi"),
  ("опасная ошибка, которую нашёл Aziz, останется нерешённой", "опасная ошибка из отзыва 1 останется нерешённой"),
  ("<span className=\"fb-who\">{fb.who}</span>", "<span className=\"fb-who\">{tr({ uz: `${fb.who}-fikr`, ru: `Отзыв ${fb.who}` })}</span>"),
  ("{ uz: `${f.who}ning fikri ${QUAD[q].lbl.uz}ga to'g'ri kelmaydi", "{ uz: `${f.who}-fikr ${QUAD[q].lbl.uz}ga to'g'ri kelmaydi"),
]:
    R(a, b, max(1, s.count(a)))
for a, b in [("who: 'Aziz'", "who: '1'"), ("who: 'Laylo'", "who: '2'"), ("who: 'Bek'", "who: '3'"), ("who: 'Diana'", "who: '4'")]:
    R(a, b, 2)
R("""  configurator: { icon: '⚙️', name: 'Configurator!', desc: { uz: "Mavjud narxni o'zgartirish UPDATE ekanini topdingiz",""", """  configurator: { icon: '⚙️', name: 'Configurator!', desc: { uz: "Panelni fikrlar bo'yicha yaxshiladingiz", ru_old_: '',""")
i = s.index("  configurator: {"); j = s.index('\n', i)
s = s[:i] + """  configurator: { icon: '⚙️', name: 'Configurator!', desc: { uz: "Panelni fikrlar bo'yicha yaxshiladingiz", ru: 'Вы улучшили панель по отзывам' } },""" + s[j:]
i = s.index("  shipper:      {"); j = s.index('\n', i)
s = s[:i] + """  shipper:      { icon: '🚀', name: 'Shipper!',      desc: { uz: "Sinfdoshingizdan aniq fikr yig'dingiz", ru: 'Вы собрали точный отзыв одноклассника' } },""" + s[j:]
R("const ACH_TRIGGERS = { s5: 'prioritizer', s10: 'configurator', s13: 'shipper', s16: 'guardian' };", "const ACH_TRIGGERS = { s5: 'prioritizer', s16: 'guardian' };\n// F-1015-351: blok nishonlari «Davom etish»da (bonus; ustoz ko'rib turadi)\nconst BLOK_ACH = { a1: 'shipper', a3: 'configurator' };")
i = s.index('const Q_LABELS = {'); j = s.index('\n', i)
s = s[:i] + "const Q_LABELS = { 5: { uz: '1 — confirm', ru: '1 — confirm' } }; // F-1015-351: yagona ballik — s16" + s[j:]
R("const INLINE_KEYS = { s4: 2, s6: 1, s10: 3, s13: 0, s16: -1, practice: -1 };", "const INLINE_KEYS = { s16: -1, practice: -1 }; // F-1015-351: MCQ s4, s6, s10, s13 olindi")
R("  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });",
  "  const next = () => {\n    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-351: blok «Davom etish»da nishon\n    if (blokAch && live.mode !== 'mentor') earn(blokAch);\n    setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });\n  };")
i = s.index('  const screens = [Screen0, Screen1,'); j = s.index('\n', i)
s = s[:i] + "  const screens = [Screen0, Screen1, ScreenFikr, Screen5, ScreenUpgrade, Screen16, ScreenPodium, Screen17];" + s[j:]
# F-1015-352 (foydalanuvchi, 1-A): band joy raqami 4.44 → to'qroq qizil
R(".spot.busy .spot-num { color: ${T.danger}; }", ".spot.busy .spot-num { color: #A3271D; } /* F-1015-352: kontrast */")
t3 = open(P3, encoding='utf-8').read()
a = t3.index("        /* ===== F-1015-303/309 · praktika qolipi")
b = t3.index("\n", t3.index("        @media (prefers-reduced-motion: reduce) { .ql-silk, .ql-xabar")) + 1
R("      `}</style>", t3[a:b] + open(Q + 'f351.css', encoding='utf-8').read() + "      `}</style>")
open(P, 'w', encoding='utf-8').write(s)
print('ok', len(s.splitlines()))
