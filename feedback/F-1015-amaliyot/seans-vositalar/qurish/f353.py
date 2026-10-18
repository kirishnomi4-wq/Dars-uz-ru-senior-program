# F-1015-353 · m4a-04 NestArchPracticeLesson: 23 → 9 ekran (kirish · reja · a1 aniq buyruq (s3) · a2 Copilot agent playbook · a3 @Roles (s7) · a4 eshik sinovi (s14) · s15 test · podium · yakun)
import os, shutil
ROOT = '/home/kali/Desktop/internetLesson'
P = ROOT + '/src/4a-Modull/NestArchPracticeLesson.jsx'
P3 = ROOT + '/src/2-Modull/PracticeLesson3.jsx'
Q = ROOT + '/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
ARX = ROOT + '/arxiv/F-1015-nestarch-oldin/NestArchPracticeLesson.jsx'
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
R("// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI", "// F-1015-353 (17.10, avtopilot, foydalanuvchi qarori 6 — Copilot agent): 23 → 9 ekran. a1 — aniq buyruq (eski s3), a2 — Copilot Chat «Agent» rejimi:\n//        3 playbook (Category, Book, Order) + tekshiruv + Swagger, a3 — @Roles (eski s7), a4 — eshik sinovi (eski s14), s15 — yagona ballik test.\n//        Oldingi 23 ekranli: arxiv/F-1015-nestarch-oldin/.\n// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI")
i = s.index('const SCREEN_META = ['); j = s.index('];', i) + 2
s = s[:i] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-353: a1 — aniq buyruq
  { id: 'a2',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // Copilot agent playbook
  { id: 's7',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // a3 — @Roles
  { id: 's14', type: 'case',        template: 'custom',   scored: false, scope: null }, // a4 — eshik sinovi
  { id: 's15', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'spod', type: 'stats',      template: 'custom',   scored: false, scope: null },
  { id: 's20', type: 'summary',     template: 'custom',   scored: false, scope: null }
];""" + s[j:]
i = s.index('// ===== SCREEN 1 — RULE'); j = s.index('// ===== SCREEN 3 —')
s = s[:i] + open(Q + 'f353-blok.jsx', encoding='utf-8').read() + '\n' + s[j:]
cut('// ===== SCREEN 4 —', '// ===== SCREEN 7 —')
cut('// ===== SCREEN 8 —', '// ===== SCREEN 14 —')
cut('// ===== SCREEN 16 —', '// ===== SCREEN 19 —')
R("""eyebrow={tr({ uz: "Yo'naltirish · buyruq", ru: 'Направление · команда' })}""", """eyebrow={tr({ uz: "Amaliyot 1 · aniq buyruq", ru: 'Практика 1 · точная команда' })}""")
R("eyebrow={tr({ uz: 'Auth · biriktirish', ru: 'Auth · назначение' })}", "eyebrow={tr({ uz: 'Amaliyot 3 · @Roles', ru: 'Практика 3 · @Roles' })}")
R("eyebrow={tr({ uz: 'Debugging · mustaqil', ru: 'Дебаггинг · самостоятельно' })}", "eyebrow={tr({ uz: 'Amaliyot 4 · eshik sinovi', ru: 'Практика 4 · проверка дверей' })}")
R("eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Упражнение · вопрос 4' })}", "eyebrow={tr({ uz: 'Test', ru: 'Тест' })}")
i = s.index("  shelf:   {"); j = s.index('\n', i)
s = s[:i] + """  shelf:   { icon: '📚', name: 'Shelf Master!', desc: { uz: "3 resursni Copilot agenti bilan qurib tekshirdingiz", ru: 'Вы построили и проверили 3 ресурса с агентом Copilot' } },""" + s[j:]
i = s.index("  owner:   {"); j = s.index('\n', i)
s = s[:i] + """  owner:   { icon: '🏪', name: 'Shop Owner!',   desc: { uz: "Ochiq qolishi kerak eshikni birinchi urinishda topdingiz — KitobShop ochildi!", ru: 'Вы с первой попытки нашли дверь, которая должна быть открыта, — KitobShop открылся!' } },""" + s[j:]
R("const ACH_TRIGGERS = { s8: 'guard', s10: 'shelf', s14: 'catcher', s19: 'owner' };", "const ACH_TRIGGERS = { s14: 'catcher', s15: 'owner' };\n// F-1015-353: blok nishonlari «Davom etish»da (bonus; ustoz ko'rib turadi)\nconst BLOK_ACH = { a2: 'shelf', s7: 'guard' };")
i = s.index('const Q_LABELS = {'); j = s.index('\n', i)
s = s[:i] + "const Q_LABELS = { 6: { uz: '1 — Debug (public)', ru: '1 — Дебаг (public)' } }; // F-1015-353: yagona ballik — s15" + s[j:]
R("const INLINE_KEYS = { s5: 2, s8: 0, s12: 3, s15: 1, practice: -1 };", "const INLINE_KEYS = { s15: 1, practice: -1 }; // F-1015-353: s5, s8, s12 olindi")
R("  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });",
  "  const next = () => {\n    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-353: blok «Davom etish»da nishon\n    if (blokAch && live.mode !== 'mentor') earn(blokAch);\n    setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });\n  };")
i = s.index('  const screens = [Screen0, Screen1,'); j = s.index('\n', i)
s = s[:i] + "  const screens = [Screen0, Screen1, Screen3, ScreenAgent, Screen7, Screen14, Screen15, ScreenPodium, Screen20];" + s[j:]
R("""    { b: 'Playbook', t: { uz: "— har resurs uchun AI'ga beradigan aniq promptni yozing (5 qadam + AppModule'ga ulash)",""", """    { b: 'Playbook', t: { uz: "— har resurs uchun Copilot agentiga beradigan aniq playbook yozing (5 qadam + AppModule'ga ulash)",""")
R("        .swg-sum { font-size: 11px; color: ${T.ink3}; margin-left: 4px;", "        .swg-sum { font-size: 11px; color: ${T.ink2}; margin-left: 4px;") # F-1015-352 (1-A): kontrast 2.44 → ink2
R("const M_COLOR = { GET: T.blue, POST: T.success, PATCH: T.amber, DELETE: T.danger };", "const M_COLOR = { GET: '#0B6E8F', POST: T.success, PATCH: T.amber, DELETE: T.danger }; // F-1015-352: GET kontrasti")
t3 = open(P3, encoding='utf-8').read()
a = t3.index("        /* ===== F-1015-303/309 · praktika qolipi")
b = t3.index("\n", t3.index("        @media (prefers-reduced-motion: reduce) { .ql-silk, .ql-xabar")) + 1
R("      `}</style>", t3[a:b] + open(Q + 'f353.css', encoding='utf-8').read() + "      `}</style>")
exec(open('/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish/recap_kalit.py', encoding='utf-8').read())
s = recap_kalit(s, {15: 6})  # F-1015-355: eslatma yakuniy savolning yangi raqamiga
open(P, 'w', encoding='utf-8').write(s)
print('ok', len(s.splitlines()))
