# F-1015-344 · m3-07 ReactCrudPracticeLesson: 22 → 8 ekran (kirish · reja · a1 qo'shish · a2 TOP+o'chirish (Gemini) · a3 AI xatosi (push) · s14 yakuniy · podium · yakun)
import os, shutil
ROOT = '/home/kali/Desktop/internetLesson'
P = ROOT + '/src/3-Modull/ReactCrudPracticeLesson.jsx'
P3 = ROOT + '/src/2-Modull/PracticeLesson3.jsx'
Q = ROOT + '/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
ARX = ROOT + '/arxiv/F-1015-reactcrud-oldin/ReactCrudPracticeLesson.jsx'
if not os.path.exists(ARX):
    os.makedirs(os.path.dirname(ARX), exist_ok=True); shutil.copy(P, ARX)
s = open(ARX, encoding='utf-8').read()
def R(old, new, n=1):
    global s
    c = s.count(old)
    assert c == n, (c, old[:90])
    s = s.replace(old, new)
R("// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI", "// F-1015-344 (17.10, tungi avtopilot): 22 → 8 ekran. Ip — robo-games (GameCard + games). a1 qo'shish — o'zingiz VS Code'da (kod oynasi),\n//        a2 TOP (map + {...g}) va o'chirish (filter + confirm) — Gemini prompti, a3 — AI xatosi (push, eski s13), s14 yakuniy. Antigravity olindi.\n//        Oldingi 22 ekranli: arxiv/F-1015-reactcrud-oldin/.\n// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI")
i = s.index('const SCREEN_META = ['); j = s.index('];', i) + 2
s = s[:i] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-344: qo'shish (AI'siz)
  { id: 'a2',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // TOP + o'chirish (Gemini)
  { id: 's13', type: 'debug',       template: 'custom',   scored: false, scope: null }, // a3 — AI xatosi (push)
  { id: 's14', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 's15b',type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }
];""" + s[j:]
i = s.index('// ===== SCREEN 1 — REJA ====='); j = s.index('// ===== SCREEN 13 — DEBUGGING')
s = s[:i] + open(Q + 'f344-blok.jsx', encoding='utf-8').read() + '\n' + s[j:]
R('<Stage eyebrow="Debugging" screen={screen}', "<Stage eyebrow={tr({ uz: 'Amaliyot 3 · AI xatosi', ru: 'Практика 3 · ошибка AI' })} screen={screen}")
R("style={game.top ? { background: T.accentSoft, color: T.accent } : undefined}>🔥 TOP</button>", "style={game.top ? { background: T.accentSoft, color: '#B3361A' } : undefined}>🔥 TOP</button>") # F-1015-344: faol TOP kontrasti (accent 2.79 → 5+)
# nishonlar, kalitlar, podium
R("const ACH_TRIGGERS = { s11: 'builder', s13: 'debugger', s14: 'finisher' };",
  "const ACH_TRIGGERS = { s13: 'debugger', s14: 'finisher' };\n// F-1015-344: blok nishoni «Davom etish»da (bonus; ustoz ko'rib turadi)\nconst BLOK_ACH = { a2: 'builder' };")
i = s.index('const Q_LABELS = {'); j = s.index('\n', i)
s = s[:i] + "const Q_LABELS = { 5: { uz: '1 — Yakuniy', ru: '1 — Финал' } }; // F-1015-344: yagona ballik — s14" + s[j:]
R("const INLINE_KEYS = { s4: 1, s5b: 3, s8: 2, s12: 0, s14: -1, practice: -1 };", "const INLINE_KEYS = { s14: -1, practice: -1 }; // F-1015-344: MCQ s4, s5b, s8, s12 olindi")
R("  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });",
  "  const next = () => {\n    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-344: blok «Davom etish»da nishon\n    if (blokAch && live.mode !== 'mentor') earn(blokAch);\n    setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });\n  };")
i = s.index('  const screens = [Screen0, Screen1,'); j = s.index('\n', i)
s = s[:i] + "  const screens = [Screen0, Screen1, ScreenQoshish, ScreenTopOchir, Screen13, Screen14, ScreenPodium, Screen15];" + s[j:]
# uyga vazifa
i = s.index('  const HOMEWORK = ['); j = s.index('  ];', i) + 4
s = s[:i] + """  const HOMEWORK = [
    { b: tr({ uz: '❤️ like', ru: '❤️ лайк' }), t: tr({ uz: "— har kartochkaga like tugmasi: bosilsa faqat o'sha o'yinning likes soni +1 (map bilan)", ru: '— на каждую карточку кнопку лайка: по нажатию likes только этой игры +1 (через map)' }) },
    { b: tr({ uz: "Bo'sh nom", ru: 'Пустое название' }), t: tr({ uz: "— input bo'sh bo'lsa, o'yin qo'shilmasin", ru: '— если input пустой, игра не добавляется' }) },
    { b: tr({ uz: 'Tekshiring', ru: 'Проверяйте' }), t: tr({ uz: "— qo'shishda [...games] bormi, o'chirishda filter'mi — o'zingiz nazorat qiling", ru: '— есть ли [...games] при добавлении и filter при удалении — контролируйте сами' }) }
  ];""" + s[j:]
R("""Antigravity bilan o'z loyihangizda sinang:", ru: 'Попробуйте в своём проекте с Antigravity:'""", """VS Code'da, robo-games loyihangizda:", ru: 'В VS Code, в проекте robo-games:'""")
# CSS
# F-1015-352 (foydalanuvchi, 2-savol): yakuniy test — qo'shish o'rniga o'chirish (filter) qatori
i = s.index('const Screen14 = ('); j = s.index('\n};\n', i) + 4
s = s[:i] + open(Q + 'f344-yakun.jsx', encoding='utf-8').read() + s[j:]
R("""  finisher: { icon: '⚡', name: 'Ship It!',     desc: { uz: "Qo'shish kodini VS Code'da o'zingiz yozdingiz", ru: 'Сами написали код добавления в VS Code' } },""", """  finisher: { icon: '⚡', name: 'Ship It!',     desc: { uz: "O'chirish kodini (filter) o'zingiz yozdingiz", ru: 'Сами написали код удаления (filter)' } },""")
t3 = open(P3, encoding='utf-8').read()
a = t3.index("        /* ===== F-1015-303/309 · praktika qolipi")
b = t3.index("\n", t3.index("        @media (prefers-reduced-motion: reduce) { .ql-silk, .ql-xabar")) + 1
R("      `}</style>", t3[a:b] + open(Q + 'f344.css', encoding='utf-8').read() + "      `}</style>")
open(P, 'w', encoding='utf-8').write(s)
print('ok', len(s.splitlines()))
