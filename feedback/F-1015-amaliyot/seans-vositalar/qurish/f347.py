# F-1015-347 · m3-13 ReactBuildSiteLesson: 20 → 9 ekran (kirish · reja · a1 bo'limlar (s3) · a2 Yetkaz prompti (Gemini) · a3 AI xatosi (s10) · a4 o'z saytingiz · s14 yakuniy · podium · yakun)
import os, shutil
ROOT = '/home/kali/Desktop/internetLesson'
P = ROOT + '/src/3-Modull/ReactBuildSiteLesson.jsx'
P3 = ROOT + '/src/2-Modull/PracticeLesson3.jsx'
Q = ROOT + '/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
ARX = ROOT + '/arxiv/F-1015-reactbuildsite-oldin/ReactBuildSiteLesson.jsx'
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
R("// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI", "// F-1015-347 (17.10, tungi avtopilot): 20 → 9 ekran. Agent (Qurar-bot / Antigravity) o'rniga Gemini: a1 bo'limlarni topish (eski s3), a2 Yetkaz uchun aniq prompt\n//        (aniqlik o'lchagichi + jonli natija), a3 — AI xatosi (narx unutilgan, eski s10), a4 o'z saytingiz (g'oya → bo'laklar → prompt), s14 yakuniy.\n//        Oldingi 20 ekranli: arxiv/F-1015-reactbuildsite-oldin/.\n// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI")
i = s.index('const SCREEN_META = ['); j = s.index('];', i) + 2
s = s[:i] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-347: a1 — bo'limlar (AI'siz)
  { id: 'a2',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // Yetkaz prompti (Gemini)
  { id: 's10', type: 'case',        template: 'custom',   scored: false, scope: null }, // a3 — AI xatosi (narx)
  { id: 'a4',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // o'z saytingiz
  { id: 's14', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'spodium', type: 'stats',   template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }
];""" + s[j:]
i = s.index('// ===== SCREEN 1 — REJA ====='); j = s.index('// ===== SCREEN 3 —')
s = s[:i] + open(Q + 'f347-blok.jsx', encoding='utf-8').read() + '\n' + s[j:]
cut('// ===== SCREEN 4 —', '// ===== SCREEN 10 —')
cut('// ===== SCREEN 11 —', '// ===== SCREEN 14 —')
R("""<Stage eyebrow={tr({ uz: "2-qadam · bo'limlar", ru: 'Шаг 2 · секции' })}""", """<Stage eyebrow={tr({ uz: "Amaliyot 1 · AI'siz", ru: 'Практика 1 · без AI' })}""")
R("<Stage eyebrow={tr({ uz: 'Debugging · tuzatish', ru: 'Дебаггинг · исправление' })}", "<Stage eyebrow={tr({ uz: 'Amaliyot 3 · AI xatosi', ru: 'Практика 3 · ошибка AI' })}")
a = s.index('const Screen10 = '); b = s.index('// ===== SCREEN 14', a)
seg = s[a:b].replace("Agent bosh sahifani qurdi", "Gemini bosh sahifani qurdi").replace("Агент построил главную", "Gemini построил главную").replace("{tr({ uz: 'Qurar-bot', ru: 'Строй-бот' })}", "Gemini")
s = s[:a] + seg + s[b:]
R("""desc: { uz: "Eng aniq promptni 1-urinishda topdingiz", ru: 'Вы нашли самый точный промпт с 1-й попытки' }""", """desc: { uz: "Yetkaz uchun aniq prompt yozdingiz", ru: 'Вы написали точный промпт для Yetkaz' }""")
R("const ACH_TRIGGERS = { s9: 'sniper', s10: 'debugger', s14: 'builder' };", "const ACH_TRIGGERS = { s10: 'debugger', s14: 'builder' };\n// F-1015-347: blok nishoni «Davom etish»da (bonus; ustoz ko'rib turadi)\nconst BLOK_ACH = { a2: 'sniper' };")
i = s.index('const Q_LABELS = {'); j = s.index('};', i) + 2
s = s[:i] + "const Q_LABELS = { 6: { uz: \"1 — Komponent e'lon\", ru: '1 — Объявление компонента' } }; // F-1015-347: yagona ballik — s14" + s[j:]
R("const INLINE_KEYS = { s4: 1, s5b: 3, s9: 0, s12: 2, s14: -1, practice: -1 };", "const INLINE_KEYS = { s14: -1, practice: -1 }; // F-1015-347: MCQ s4, s5b, s9, s12 olindi")
R("  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });",
  "  const next = () => {\n    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-347: blok «Davom etish»da nishon\n    if (blokAch && live.mode !== 'mentor') earn(blokAch);\n    setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });\n  };")
i = s.index('  const screens = [Screen0, Screen1,'); j = s.index('\n', i)
s = s[:i] + "  const screens = [Screen0, Screen1, Screen3, ScreenYetkaz, Screen10, ScreenOzSayt, Screen14, ScreenPodium, Screen15];" + s[j:]
R("""    { b: tr({ uz: 'Qurib boshlang', ru: 'Начните сборку' }), t: tr({ uz: "— Antigravity bilan bosh sahifadan boshlab, bo'lim-bo'lim quring", ru: '— начните с главной в Antigravity и собирайте секцию за секцией' }) },""",
  """    { b: tr({ uz: 'Qurib boshlang', ru: 'Начните сборку' }), t: tr({ uz: "— Gemini bilan bosh sahifadan boshlab, bo'lim-bo'lim quring: har bo'limga alohida aniq prompt", ru: '— начните с главной вместе с Gemini и собирайте секцию за секцией: на каждую — отдельный точный промпт' }) },""")
t3 = open(P3, encoding='utf-8').read()
a = t3.index("        /* ===== F-1015-303/309 · praktika qolipi")
b = t3.index("\n", t3.index("        @media (prefers-reduced-motion: reduce) { .ql-silk, .ql-xabar")) + 1
R("      `}</style>", t3[a:b] + open(Q + 'f347.css', encoding='utf-8').read() + "      `}</style>")
exec(open('/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish/recap_kalit.py', encoding='utf-8').read())
s = recap_kalit(s, {})  # F-1015-355: eslatma yakuniy savolning yangi raqamiga
open(P, 'w', encoding='utf-8').write(s)
print('ok', len(s.splitlines()))
