# F-1015-350 · m4-13 FullstackProjectDayLesson: 25 → 9 ekran (kirish · reja · a1 baza · a2 server · a3 panel · a4 JOIN (s12) · s16 yakuniy · podium · yakun)
import os, shutil
ROOT = '/home/kali/Desktop/internetLesson'
P = ROOT + '/src/4-Modull/FullstackProjectDayLesson.jsx'
P3 = ROOT + '/src/2-Modull/PracticeLesson3.jsx'
Q = ROOT + '/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
ARX = ROOT + '/arxiv/F-1015-fullstackprojectday-oldin/FullstackProjectDayLesson.jsx'
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
R("// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI", "// F-1015-350 (17.10, tungi avtopilot): 25 → 9 ekran. Agent (Antigravity) o'rniga: a1 baza — o'zingiz (joylar + sessiyalar, FK, psql), a2 server — Gemini\n//        (joylar, kirish, chiqish, tushum), a3 qorovul paneli — Gemini (front), a4 — JOIN (eski s12), s16 — JOIN ON yakuniy. Oldingi 25 ekranli: arxiv/F-1015-fullstackprojectday-oldin/.\n// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI")
i = s.index('const SCREEN_META = ['); j = s.index('];', i) + 2
s = s[:i] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-350: baza (psql)
  { id: 'a2',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // server (Gemini)
  { id: 'a3',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // qorovul paneli (Gemini)
  { id: 's12', type: 'exploration', template: 'custom',   scored: false, scope: null }, // a4 — JOIN
  { id: 's16', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'spodium', type: 'stats',   template: 'custom',   scored: false, scope: null },
  { id: 's17', type: 'summary',     template: 'custom',   scored: false, scope: null }
];""" + s[j:]
i = s.index('// ===== SCREEN 1 — REJA'); j = s.index('// ===== SCREEN 12 —')
s = s[:i] + open(Q + 'f350-blok.jsx', encoding='utf-8').read() + '\n' + s[j:]
cut('// ===== SCREEN 13 —', '// ===== SCREEN 16 —')
R("<Stage eyebrow={tr({ uz: 'JOIN · tarix', ru: 'JOIN · история' })}", "<Stage eyebrow={tr({ uz: 'Amaliyot 4 · JOIN', ru: 'Практика 4 · JOIN' })}")
R("""  architect: { icon: '🏗️', name: 'Schema Master!', desc: { uz: "Jadval ustuni va tipini to'g'ri tanladingiz", ru: "Вы верно выбрали столбец и тип таблицы" } },""", """  architect: { icon: '🏗️', name: 'Schema Master!', desc: { uz: "Ikki jadvalli bazani o'zingiz yozdingiz", ru: 'Вы сами написали базу из двух таблиц' } },""")
R("""  wired:     { icon: '🔌', name: 'Wired Up!',    desc: { uz: "Kirish amalini (POST) to'g'ri topdingiz", ru: "Вы верно нашли операцию въезда (POST)" } },""", """  wired:     { icon: '🔌', name: 'Wired Up!',    desc: { uz: "Server va panelni Gemini bilan qurdingiz", ru: 'Вы построили сервер и панель с Gemini' } },""")
R("const ACH_TRIGGERS = { s4: 'architect', s10: 'wired', s13: 'joiner', s16: 'opened' };", "const ACH_TRIGGERS = { s16: 'opened' };\n// F-1015-350: blok nishonlari «Davom etish»da (bonus; ustoz ko'rib turadi)\nconst BLOK_ACH = { a1: 'architect', a3: 'wired', s12: 'joiner' };")
i = s.index('const Q_LABELS = {'); j = s.index('\n', i)
s = s[:i] + "const Q_LABELS = { 6: { uz: '1 — JOIN ON', ru: '1 — JOIN ON' } }; // F-1015-350: yagona ballik — s16" + s[j:]
R("const INLINE_KEYS = { s4: 2, s7: 1, s10: 3, s13: 2, s16: -1, practice: -1 };", "const INLINE_KEYS = { s16: -1, practice: -1 }; // F-1015-350: MCQ s4, s7, s10, s13 olindi")
R("  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });",
  "  const next = () => {\n    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-350: blok «Davom etish»da nishon\n    if (blokAch && live.mode !== 'mentor') earn(blokAch);\n    setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });\n  };")
i = s.index('  const screens = [Screen0, Screen1,'); j = s.index('\n', i)
s = s[:i] + "  const screens = [Screen0, Screen1, ScreenBaza, ScreenStServer, ScreenStPanel, Screen12, Screen16, ScreenPodium, Screen17];" + s[j:]
R("""{tr({ uz: 'Antigravity bilan panelni kengaytiring:', ru: 'Расширьте панель вместе с Antigravity:' })}""", """{tr({ uz: "VS Code'da, avto-stoyanka loyihangizda (Gemini bilan):", ru: 'В VS Code, в проекте avto-stoyanka (с Gemini):' })}""")
# F-1015-352 (foydalanuvchi, 1-A): jadvaldagi ajratilgan ustun (oq fonda) → to'qroq #B3361A
R("{cols.map(c => <span key={c} style={{ color: c === hiCol ? T.accent : undefined, fontWeight: c === hiCol ? 700 : undefined }}>{r[c]}</span>)}", "{cols.map(c => <span key={c} style={{ color: c === hiCol ? '#B3361A' : undefined, fontWeight: c === hiCol ? 700 : undefined }}>{r[c]}</span>)}")
t3 = open(P3, encoding='utf-8').read()
a = t3.index("        /* ===== F-1015-303/309 · praktika qolipi")
b = t3.index("\n", t3.index("        @media (prefers-reduced-motion: reduce) { .ql-silk, .ql-xabar")) + 1
R("      `}</style>", t3[a:b] + open(Q + 'f350.css', encoding='utf-8').read() + "      `}</style>")
exec(open('/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish/recap_kalit.py', encoding='utf-8').read())
s = recap_kalit(s, {16: 6})  # F-1015-355: eslatma yakuniy savolning yangi raqamiga
open(P, 'w', encoding='utf-8').write(s)
print('ok', len(s.splitlines()))
