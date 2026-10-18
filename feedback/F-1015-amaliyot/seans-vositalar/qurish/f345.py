# F-1015-345 · m3-11 ReactRouterPracticeLesson: 22 → 8 ekran (kirish · reja · a1 sahifalar ro'yxati · a2 GamePage+AddPage (Gemini) · a3 AI xatosi (<a>) · s14 yakuniy · podium · yakun)
import os, shutil
ROOT = '/home/kali/Desktop/internetLesson'
P = ROOT + '/src/3-Modull/ReactRouterPracticeLesson.jsx'
P3 = ROOT + '/src/2-Modull/PracticeLesson3.jsx'
Q = ROOT + '/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
ARX = ROOT + '/arxiv/F-1015-reactrouter-oldin/ReactRouterPracticeLesson.jsx'
if not os.path.exists(ARX):
    os.makedirs(os.path.dirname(ARX), exist_ok=True); shutil.copy(P, ARX)
s = open(ARX, encoding='utf-8').read()
def R(old, new, n=1):
    global s
    c = s.count(old)
    assert c == n, (c, old[:90])
    s = s.replace(old, new)
R("// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI", "// F-1015-345 (17.10, tungi avtopilot): 22 → 8 ekran. Ip — robo-games (m3-07 dan). a1 sahifalar ro'yxati — o'zingiz (BrowserRouter, Routes, Link; kod oynasi\n//        mos kelgan Route'ni ko'rsatadi), a2 GamePage (useParams + find) va AddPage (forma + useNavigate) — Gemini, a3 — AI xatosi (<a>, eski s13), s14 yakuniy.\n//        Antigravity olindi. Oldingi 22 ekranli: arxiv/F-1015-reactrouter-oldin/.\n// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI")
i = s.index('const SCREEN_META = ['); j = s.index('];', i) + 2
s = s[:i] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-345: sahifalar ro'yxati (AI'siz)
  { id: 'a2',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // GamePage + AddPage (Gemini)
  { id: 's13', type: 'rule',        template: 'custom',   scored: false, scope: null }, // a3 — AI xatosi (<a>)
  { id: 's14', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's15b',type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }
];""" + s[j:]
i = s.index('// ===== SCREEN 1 — REJA (va'); j = s.index('// ===== SCREEN 13 — DEBUGGING')
s = s[:i] + "// ===== F-1015-345: 22 → 8 ekran. Ip — robo-games: sahifalar ro'yxati — o'zingiz, GamePage + AddPage — Gemini =====\n" + open(Q + 'f345-blok.jsx', encoding='utf-8').read() + '\n' + s[j:]
R("<Stage eyebrow={tr({ uz: 'Debugging', ru: 'Дебаггинг' })} screen={screen}", "<Stage eyebrow={tr({ uz: 'Amaliyot 3 · AI xatosi', ru: 'Практика 3 · ошибка AI' })} screen={screen}")
# nishonlar, kalitlar, podium
R("const ACH_TRIGGERS = { s9: 'builder', s13: 'debugger', s14: 'router' };",
  "const ACH_TRIGGERS = { s13: 'debugger', s14: 'router' };\n// F-1015-345: blok nishoni «Davom etish»da (bonus; ustoz ko'rib turadi)\nconst BLOK_ACH = { a2: 'builder' };")
i = s.index('const Q_LABELS = {'); j = s.index('\n', i)
s = s[:i] + "const Q_LABELS = { 5: { uz: '1 — Yakuniy', ru: '1 — Финал' } }; // F-1015-345: yagona ballik — s14" + s[j:]
R("const INLINE_KEYS = { s4: 0, s5b: 1, s8: 0, s12: 1, s14: -1, practice: -1 };", "const INLINE_KEYS = { s14: -1, practice: -1 };")
R("  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });",
  "  const next = () => {\n    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-345: blok «Davom etish»da nishon\n    if (blokAch && live.mode !== 'mentor') earn(blokAch);\n    setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });\n  };")
i = s.index('  const screens = [Screen0, Screen1,'); j = s.index('\n', i)
s = s[:i] + "  const screens = [Screen0, Screen1, ScreenRoutes, ScreenSahifalar, Screen13, Screen14, ScreenPodium, Screen15];" + s[j:]
# uyga vazifa
i = s.index('  const HOMEWORK = ['); j = s.index('  ];', i) + 4
s = s[:i] + """  const HOMEWORK = [
    { b: tr({ uz: '404 sahifa', ru: 'Страница 404' }), t: tr({ uz: "— <Route path=\\"*\\"> bilan «Bunday sahifa yo'q» sahifasini qo'shing", ru: '— добавьте страницу «Такой страницы нет» через <Route path="*">' }) },
    { b: tr({ uz: '«Orqaga» tugmasi', ru: 'Кнопка «Назад»' }), t: tr({ uz: "— o'yin sahifasiga useNavigate bilan Bosh sahifaga qaytaradigan tugma qo'ying", ru: '— на страницу игры добавьте кнопку, которая через useNavigate возвращает на Главную' }) },
    { b: tr({ uz: 'Tekshiring', ru: 'Проверьте' }), t: tr({ uz: "— hamma havola <Link>mi, /game/:id parametri bormi — o'zingiz nazorat qiling", ru: '— все ли ссылки <Link>, есть ли параметр /game/:id — проконтролируйте сами' }) }
  ];""" + s[j:]
R("""Antigravity bilan o'z loyihangizda sinang:", ru: 'Попробуйте в своём проекте с Antigravity:'""", """VS Code'da, robo-games loyihangizda:", ru: 'В VS Code, в проекте robo-games:'""")
# CSS
# F-1015-352 (foydalanuvchi, 1-A): to'q sariq MATN → to'qroq #B3361A (kontrast 3.28 → 5.3)
R("        .navlink.on { background: ${T.accent}; color: #fff; }", "        .navlink.on { background: ${T.accentSoft}; color: #B3361A; box-shadow: inset 0 0 0 1.5px #B3361A; } /* F-1015-352: kontrast (to'q fonli tugma — dark darvozasi) */")
R("        .url-bar .u-path { color: ${T.accent}; font-weight: 700; }", "        .url-bar .u-path { color: #B3361A; font-weight: 700; } /* F-1015-352: kontrast */")
t3 = open(P3, encoding='utf-8').read()
a = t3.index("        /* ===== F-1015-303/309 · praktika qolipi")
b = t3.index("\n", t3.index("        @media (prefers-reduced-motion: reduce) { .ql-silk, .ql-xabar")) + 1
R("      `}</style>", t3[a:b] + open(Q + 'f345.css', encoding='utf-8').read() + "      `}</style>")
exec(open('/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish/dd_gradient.py', encoding='utf-8').read())
s = dd_gradient(s)  # F-1015-357: drag-drop brend gradient
open(P, 'w', encoding='utf-8').write(s)
print('ok', len(s.splitlines()))
