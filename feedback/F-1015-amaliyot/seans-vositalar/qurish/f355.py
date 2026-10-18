# F-1015-355 · m4c-05 AiPipelineProjectLesson: 20 → 7 ekran (kirish · reja · a1 Copilot bilan tuzatish o'yini (s9) · a2 KitobShop qizil testi — Copilot Chat «Agent» · s15 yakuniy · podium · yakun)
import os, shutil
ROOT = '/home/kali/Desktop/internetLesson'
P = ROOT + '/src/4c-Modull/AiPipelineProjectLesson.jsx'
P3 = ROOT + '/src/2-Modull/PracticeLesson3.jsx'
Q = ROOT + '/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
ARX = ROOT + '/arxiv/F-1015-aipipeline-oldin/AiPipelineProjectLesson.jsx'
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
R("// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI", "// F-1015-355 (17.10, avtopilot, foydalanuvchi qarori 8-A — Copilot Chat): 20 → 7 ekran. a1 — Copilot bilan tuzatish o'yini (eski s9), a2 — KitobShop\n//        qizil testi (order.spec.ts) Copilot Chat «Agent» rejimida: testni o'zgartirish tuzog'i → «Undo» → aniqlashtiruvchi so'rov → order.ts tuzatildi → yashil.\n//        «Lenta yordamchisi» (Antigravity) → Copilot. Oldingi 20 ekranli: arxiv/F-1015-aipipeline-oldin/.\n// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI")
i = s.index('const SCREEN_META = ['); j = s.index('];', i) + 2
s = s[:i] + """const SCREEN_META = [
  { id: 's0',       type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',       type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's9',       type: 'case',        template: 'custom',   scored: false, scope: null }, // F-1015-355: a1 — Copilot bilan tuzatish o'yini
  { id: 'a2',       type: 'exploration', template: 'custom',   scored: false, scope: null }, // KitobShop qizil testi — Copilot Chat
  { id: 's15',      type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'podium',   type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 's16',      type: 'summary',     template: 'custom',   scored: false, scope: null }
];""" + s[j:]
i = s.index('// ===== SCREEN 1 — REJA'); j = s.index('// ===== SCREEN 2 —')
s = s[:i] + open(Q + 'f355-blok.jsx', encoding='utf-8').read() + '\n' + s[j:]
cut('// ===== SCREEN 2 —', '// ===== ★ SCREEN 9')
cut('// ===== SCREEN 10 —', '// ===== SCREEN 15 —')
cut('// 🛠️ PRAKTIKA — 4c backend', '// ===== YAKUN')
R("eyebrow={tr({ uz: 'Markaziy · Yordamchi bilan tuzatish', ru: 'Главная игра · Чиним с Помощником' })}", "eyebrow={tr({ uz: 'Amaliyot 1 · Copilot bilan tuzatish', ru: 'Практика 1 · Чиним с Copilot' })}")
i = s.index("  logReader:"); j = s.index('\n', i)
s = s[:i] + """  logReader:       { icon: '📖', name: 'Log Reader',       desc: { uz: "KitobShop jurnalidan Copilot'ga aniq so'rov berdingiz", ru: 'Вы дали Copilot точный запрос по журналу KitobShop' } },""" + s[j:]
i = s.index("  roadmapReviewer:"); j = s.index('\n', i) + 1
s = s[:i] + s[j:]
R("const ACH_TRIGGERS = { s10: 'logReader', s9: 'mentorVerified', s13: 'roadmapReviewer', s15: 'finalCall' };", "const ACH_TRIGGERS = { s9: 'mentorVerified', s15: 'finalCall' };\n// F-1015-355: blok nishoni «Davom etish»da (bonus; ustoz ko'rib turadi)\nconst BLOK_ACH = { a2: 'logReader' };")
i = s.index('const Q_LABELS = {'); j = s.index('\n', i)
s = s[:i] + "const Q_LABELS = { 4: { uz: '1 — Tartib', ru: '1 — Порядок' } }; // F-1015-355: yagona ballik — s15" + s[j:]
R("const INLINE_KEYS = { s4: 0, s8: 3, s10: 1, s14: 2, s15: 0, practice: -1 };", "const INLINE_KEYS = { s15: 0, practice: -1 }; // F-1015-355: s4, s8, s10, s14 olindi")
R("  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });",
  "  const next = () => {\n    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-355: blok «Davom etish»da nishon\n    if (blokAch && live.mode !== 'mentor') earn(blokAch);\n    setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });\n  };")
i = s.index('  const screens = [Screen0, Screen1,'); j = s.index('\n', i)
s = s[:i] + "  const screens = [Screen0, Screen1, Screen9, ScreenCopilot, Screen15, ScreenPodium, SummaryScreen];" + s[j:]
i = s.index("    { b: { uz: 'Sinang', ru: 'Попробуйте' }"); j = s.index('\n', i)
s = s[:i] + """    { b: { uz: 'Sinang', ru: 'Попробуйте' }, t: { uz: "— darsda ulgurmagan bo'lsangiz, KitobShop'da qizil testni Copilot Chat bilan tuzating", ru: '— если не успели на уроке, почините красный тест KitobShop с Copilot Chat' } },""" + s[j:]
exec(open(Q + 'recap_kalit.py', encoding='utf-8').read())
s = recap_kalit(s, {15: 4})
# «Lenta yordamchisi» → Copilot (bir ma'noga bitta so'z)
for a, b in [("LENTA YORDAMCHISI", "Copilot"), ("Lenta Yordamchisi", "Copilot"), ("Lenta yordamchisi", "Copilot"), ("lenta yordamchisi", "Copilot"), ("'yordamchi'", "'Copilot'"), ("ПОМОЩНИК ЛЕНТЫ", "Copilot"), ("ПОМОЩНИКОМ ЛЕНТЫ", "Copilot"), ("AI yordamchi", "Copilot"),
             ("Yordamchining", "Copilot'ning"), ("Yordamchidan", "Copilot'dan"), ("Yordamchiga", "Copilot'ga"), ("Yordamchini", "Copilot'ni"), ("Yordamchi", "Copilot"),
             ("yordamchining", "Copilot'ning"), ("yordamchidan", "Copilot'dan"), ("yordamchiga", "Copilot'ga"), ("yordamchini", "Copilot'ni"),
             ("Помощником", "Copilot"), ("Помощнику", "Copilot"), ("Помощника", "Copilot"), ("Помощнике", "Copilot"), ("Помощник", "Copilot"),
             ("помощником", "Copilot"), ("помощнику", "Copilot"), ("помощника", "Copilot"), ("помощнике", "Copilot"), ("помощник", "Copilot")]:
    s = s.replace(a, b)
import re
s = '\n'.join(l if l.lstrip().startswith('//') else re.sub(r"(?<![-\w'])yordamchi(?![-\w])", 'Copilot', l) for l in s.split('\n'))
t3 = open(P3, encoding='utf-8').read()
a = t3.index("        /* ===== F-1015-303/309 · praktika qolipi")
b = t3.index("\n", t3.index("        @media (prefers-reduced-motion: reduce) { .ql-silk, .ql-xabar")) + 1
R("      `}</style>", t3[a:b] + open(Q + 'f355.css', encoding='utf-8').read() + "      `}</style>")
exec(open('/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish/dd_gradient.py', encoding='utf-8').read())
s = dd_gradient(s)  # F-1015-357: drag-drop brend gradient
open(P, 'w', encoding='utf-8').write(s)
print('ok', len(s.splitlines()))
