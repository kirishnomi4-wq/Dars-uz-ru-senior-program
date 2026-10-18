# F-1015-349 · m4-10 FullstackConnectPracticeLesson: 20 → 8 ekran (kirish · reja · a1 ulash · a2 CORS (s10) · a3 maydonlar+holat+forma (Gemini) · s14 test · podium · yakun)
import os, shutil
ROOT = '/home/kali/Desktop/internetLesson'
P = ROOT + '/src/4-Modull/FullstackConnectPracticeLesson.jsx'
P3 = ROOT + '/src/2-Modull/PracticeLesson3.jsx'
Q = ROOT + '/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
ARX = ROOT + '/arxiv/F-1015-fullstackconnect-oldin/FullstackConnectPracticeLesson.jsx'
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
R("// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI", "// F-1015-349 (17.10, tungi avtopilot): 20 → 8 ekran. Front — m3-12 dagi avto-ijara (cars.json), back — m4-08 dagi server. a1 fetch manzilini almashtirish (AI'siz),\n//        a2 — CORS (eski s10), a3 Gemini: server maydonlari (nom, narx, yil), 3 holat, POST forma. s14 — yagona ballik test. Antigravity olindi.\n//        Oldingi 20 ekranli: arxiv/F-1015-fullstackconnect-oldin/.\n// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI")
i = s.index('const SCREEN_META = ['); j = s.index('];', i) + 2
s = s[:i] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-349: fetch manzili (AI'siz)
  { id: 's10', type: 'case',        template: 'custom',   scored: false, scope: null }, // a2 — CORS
  { id: 'a3',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // maydonlar + holatlar + forma (Gemini)
  { id: 's14', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'spodium', type: 'stats',   template: 'custom',   scored: false, scope: null },
  { id: 's17', type: 'summary',     template: 'custom',   scored: false, scope: null }
];""" + s[j:]
i = s.index('// ===== SCREEN 1 — REJA'); j = s.index('// ===== SCREEN 10 —')
s = s[:i] + open(Q + 'f349-blok.jsx', encoding='utf-8').read() + '\n' + s[j:]
cut('// ===== SCREEN 11 —', '// ===== SCREEN 14 —')
cut('// ===== SCREEN 15 —', '// ============================================================\n// ⚡ v18 GAMIFIKATSIYA')
R("<Stage eyebrow={tr({ uz: '3-qadam · NAZORATCHI', ru: 'Шаг 3 · КОНТРОЛЁР' })}", "<Stage eyebrow={tr({ uz: \"Amaliyot 2 · CORS\", ru: 'Практика 2 · CORS' })}")
R("""<QuestionScreen {...props} idx={14} scope="module-mikro" eyebrow={tr({ uz: 'Mashq · 4-savol', ru: 'Тренировка · вопрос 4' })}""", """<QuestionScreen {...props} idx={14} scope="module-mikro" eyebrow={tr({ uz: 'Test', ru: 'Тест' })}""")
R("""  bothOnline:  { icon: '🟢', name: 'Both Online!',  desc: { uz: "Ikkalasi ishlab turishi shartligini bildingiz", ru: "Вы поняли: работать должны и фронт, и бэк" } },""", """  bothOnline:  { icon: '🟢', name: 'Both Online!',  desc: { uz: "CORS'ni tuzatib, ikki dasturni gaplashtirdingiz", ru: 'Вы исправили CORS и соединили две программы' } },""")
R("""  fullCircle:  { icon: '🔁', name: 'Full Circle!',  desc: { uz: "To'liq yo'lni o'zlashtirdingiz: forma→baza→ekran", ru: "Вы освоили путь: форма→база→экран" } },""", """  fullCircle:  { icon: '🔁', name: 'Full Circle!',  desc: { uz: "Ma'lumot qayerdan kelishini birinchi urinishda topdingiz", ru: 'Вы с первой попытки определили, откуда приходят данные' } },""")
R("const ACH_TRIGGERS = { s4: 'connected', s9: 'bothOnline', s14: 'fullCircle', s16: 'fullStack' };", "const ACH_TRIGGERS = { s14: 'fullCircle' };\n// F-1015-349: blok nishonlari «Davom etish»da (bonus; ustoz ko'rib turadi)\nconst BLOK_ACH = { a1: 'connected', s10: 'bothOnline', a3: 'fullStack' };")
i = s.index('const Q_LABELS = {'); j = s.index('\n', i)
s = s[:i] + "const Q_LABELS = { 5: { uz: '1 — serverdan', ru: '1 — с сервера' } }; // F-1015-349: yagona ballik — s14" + s[j:]
i = s.index('const INLINE_KEYS = {'); j = s.index('\n', i)
s = s[:i] + "const INLINE_KEYS = { s14: 0, practice: -1 }; // F-1015-349: s4, s7, s9 olindi" + s[j:]
R("  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });",
  "  const next = () => {\n    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-349: blok «Davom etish»da nishon\n    if (blokAch && live.mode !== 'mentor') earn(blokAch);\n    setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });\n  };")
i = s.index('  const screens = [Screen0, Screen1,'); j = s.index('\n', i)
s = s[:i] + "  const screens = [Screen0, Screen1, ScreenUlash, Screen10, ScreenForma, Screen14, ScreenPodium, Screen17];" + s[j:]
R("""Antigravity bilan o'z loyihangizda sinang:", ru: 'Попробуйте в своём проекте с Antigravity:'""", """VS Code'da, avto-ijara loyihangizda:", ru: 'В VS Code, в проекте avto-ijara:'""")
i = s.index("    { b: { uz: 'Frontni ulang'"); j = s.index('\n', i)
s = s[:i] + """    { b: { uz: "O'chirish", ru: 'Удаление' }, t: { uz: "— har kartochkaga ✕: DELETE so'rov yuborib, ro'yxatni qayta fetch qilsin", ru: '— на каждую карточку ✕: отправляет DELETE-запрос и заново делает fetch списка' } },""" + s[j:]
t3 = open(P3, encoding='utf-8').read()
a = t3.index("        /* ===== F-1015-303/309 · praktika qolipi")
b = t3.index("\n", t3.index("        @media (prefers-reduced-motion: reduce) { .ql-silk, .ql-xabar")) + 1
R("      `}</style>", t3[a:b] + open(Q + 'f349.css', encoding='utf-8').read() + "      `}</style>")
exec(open('/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish/recap_kalit.py', encoding='utf-8').read())
s = recap_kalit(s, {14: 5})  # F-1015-355: eslatma yakuniy savolning yangi raqamiga
open(P, 'w', encoding='utf-8').write(s)
print('ok', len(s.splitlines()))
