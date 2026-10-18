# F-1015-348 · m4-08 BackendCrudPracticeLesson: 19 → 8 ekran (kirish · reja · a1 sxema (psql) · a2 server (Gemini) · a3 AI xatosi (price) · s12 test · podium · yakun)
import os, shutil
ROOT = '/home/kali/Desktop/internetLesson'
P = ROOT + '/src/4-Modull/BackendCrudPracticeLesson.jsx'
P3 = ROOT + '/src/2-Modull/PracticeLesson3.jsx'
Q = ROOT + '/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
ARX = ROOT + '/arxiv/F-1015-backendcrud-oldin/BackendCrudPracticeLesson.jsx'
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
R("// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI", "// F-1015-348 (17.10, tungi avtopilot): 19 → 8 ekran. a1 sxema — o'zingiz (ustun tanlash → CREATE TABLE + INSERT, psql'da), a2 server.js — Gemini\n//        (Pool + 4 endpoint, $1 $2; Postman maketida jadval o'zgaradi), a3 — AI xatosi (price, eski s10), s12 — yagona ballik test. Antigravity olindi.\n//        Oldingi 19 ekranli: arxiv/F-1015-backendcrud-oldin/.\n// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI")
i = s.index('const SCREEN_META = ['); j = s.index('];', i) + 2
s = s[:i] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-348: sxema (psql)
  { id: 'a2',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // server (Gemini)
  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null }, // a3 — AI xatosi (price)
  { id: 's12', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's15b',type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }
];""" + s[j:]
i = s.index('// ===== SCREEN 1 — REJA'); j = s.index('// ===== SCREEN 10 —')
s = s[:i] + open(Q + 'f348-blok.jsx', encoding='utf-8').read() + '\n' + s[j:]
cut('// ===== SCREEN 11 —', '// ===== SCREEN 12 —')
cut('// ===== SCREEN 13 —', '// ===== 🛠️ JONLI PRAKTIKA (reusable checkpoint)')
R('<Stage eyebrow="Debugging" screen={screen}', "<Stage eyebrow={tr({ uz: 'Amaliyot 3 · AI xatosi', ru: 'Практика 3 · ошибка AI' })} screen={screen}")
R("""<QuestionScreen {...props} idx={12} scope="module-mikro" eyebrow={{ uz: 'Mashq · 4-savol', ru: 'Практика · вопрос 4' }}""", """<QuestionScreen {...props} idx={12} scope="module-mikro" eyebrow={{ uz: 'Test', ru: 'Тест' }}""")
R("""  blueprint: { icon: '🏗️', name: 'Blueprint!',      desc: { uz: "Sxema savolini to'g'ri yechdingiz", ru: "Вы верно решили вопрос по схеме" } },""", """  blueprint: { icon: '🏗️', name: 'Blueprint!',      desc: { uz: "cars jadvalini o'zingiz yozdingiz", ru: 'Вы сами написали таблицу cars' } },""")
R("""  director:  { icon: '🎬', name: "Director's Cut!", desc: { uz: "AI'ga eng aniq promptni tanladingiz", ru: "Вы выбрали для AI самый точный промпт" } },""", """  director:  { icon: '🎬', name: "Director's Cut!", desc: { uz: "Serverni Gemini bilan yozdingiz", ru: 'Вы написали сервер с Gemini' } },""")
R("""  finisher:  { icon: '🚀', name: 'Ship It!',        desc: { uz: "AvtoIjara backend'ini VS Code'da o'zingiz qurdingiz", ru: 'Вы сами собрали backend AvtoIjara в VS Code' } },""", """  finisher:  { icon: '🚀', name: 'Ship It!',        desc: { uz: "pool.query savolini birinchi urinishda topdingiz", ru: 'Вы с первой попытки ответили про pool.query' } },""")
R("const ACH_TRIGGERS = { s4: 'blueprint', s5: 'director', s10: 'catcher', spf: 'finisher' };", "const ACH_TRIGGERS = { s10: 'catcher', s12: 'finisher' };\n// F-1015-348: blok nishonlari «Davom etish»da (bonus; ustoz ko'rib turadi)\nconst BLOK_ACH = { a1: 'blueprint', a2: 'director' };")
i = s.index('const Q_LABELS = {'); j = s.index('\n', i)
s = s[:i] + "const Q_LABELS = { 5: { uz: \"1 — Ko'prik (pool)\", ru: '1 — Мост (pool)' } }; // F-1015-348: yagona ballik — s12" + s[j:]
R("const INLINE_KEYS = { s4: 1, s5b: 3, s8: 2, s12: 0, practice: -1 };", "const INLINE_KEYS = { s12: 0, practice: -1 }; // F-1015-348: s4, s5b, s8 olindi")
i = s.index('  const next = () => setScreen(s =>'); j = s.index('\n', i)
s = s[:i] + "  const next = () => {\n    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-348: blok «Davom etish»da nishon\n    if (blokAch && live.mode !== 'mentor') earn(blokAch);\n    setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });\n  };" + s[j:]
i = s.index('  const screens = [Screen0, Screen1,'); j = s.index('\n', i)
s = s[:i] + "  const screens = [Screen0, Screen1, ScreenSxema, ScreenServer, Screen10, Screen12, ScreenPodium, Screen15];" + s[j:]
R("""Antigravity bilan o'z backend'ingizda sinang:", ru: 'Проверьте на своём backend вместе с Antigravity:'""", """VS Code'da, avto-ijara-server loyihangizda:", ru: 'В VS Code, в проекте avto-ijara-server:'""")
R("""    { b: { uz: "To'liq CRUD", ru: 'Полный CRUD' }, t: { uz: "— AI bilan 4 endpoint (GET/POST/PUT/DELETE) yozing", ru: '— напишите с AI 4 endpoint-а (GET/POST/PUT/DELETE)' } },""", """    { b: { uz: 'Bitta mashina', ru: 'Одна машина' }, t: { uz: "— GET /api/cars/:id endpointini qo'shing: topilmasa 404 qaytarsin", ru: '— добавьте endpoint GET /api/cars/:id: если не найдена — 404' } },""")
# F-1015-352 (foydalanuvchi, 1-A): ko'k GET belgisi oq matn bilan 3.24 → to'qroq ko'k
R("const M_COLOR = { GET: T.blue, POST: T.success, PUT: T.amber, DELETE: T.danger };", "const M_COLOR = { GET: '#0B6E8F', POST: T.success, PUT: T.amber, DELETE: T.danger }; // F-1015-352: GET kontrasti (T.blue 3.24)")
t3 = open(P3, encoding='utf-8').read()
a = t3.index("        /* ===== F-1015-303/309 · praktika qolipi")
b = t3.index("\n", t3.index("        @media (prefers-reduced-motion: reduce) { .ql-silk, .ql-xabar")) + 1
R("      `}</style>", t3[a:b] + open(Q + 'f348.css', encoding='utf-8').read() + "      `}</style>")
open(P, 'w', encoding='utf-8').write(s)
print('ok', len(s.splitlines()))
