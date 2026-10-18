# F-1015-354 · m4c-04 FullPipelineProjectLesson: 18 → 8 ekran (kirish · reja · a1 lenta quruvchisi (s6) · a2 KitobShop ci.yml + push maketi · a3 qizil jurnal (s3) · s12 yakuniy · podium · yakun)
import os, shutil
ROOT = '/home/kali/Desktop/internetLesson'
P = ROOT + '/src/4c-Modull/FullPipelineProjectLesson.jsx'
P3 = ROOT + '/src/2-Modull/PracticeLesson3.jsx'
Q = ROOT + '/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
ARX = ROOT + '/arxiv/F-1015-fullpipeline-oldin/FullPipelineProjectLesson.jsx'
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
R("// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI", "// F-1015-354 (17.10, avtopilot, foydalanuvchi qarori 7-A — KitobShop, deploysiz): 18 → 8 ekran. a1 — lenta quruvchisi (eski s6), a2 — KitobShop'ga\n//        haqiqiy ci.yml (checkout, setup-node, npm ci, test, lint, build) + push maketi (xato kiritish), a3 — qizil jurnal (eski s3), s12 yakuniy. ✈️ Uchirish — maketda.\n//        Oldingi 18 ekranli: arxiv/F-1015-fullpipeline-oldin/.\n// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI")
i = s.index('const SCREEN_META = ['); j = s.index('];', i) + 2
s = s[:i] + """const SCREEN_META = [
  { id: 's0',       type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',       type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's6',       type: 'case',        template: 'custom',   scored: false, scope: null }, // F-1015-354: a1 — lenta quruvchisi
  { id: 'a2',       type: 'exploration', template: 'custom',   scored: false, scope: null }, // KitobShop ci.yml + push
  { id: 's3',       type: 'case',        template: 'custom',   scored: false, scope: null }, // a3 — qizil jurnal
  { id: 's12',      type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'podium',   type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 's14',      type: 'summary',     template: 'custom',   scored: false, scope: null }
];""" + s[j:]
i = s.index('// ===== SCREEN 1 — REJA'); j = s.index('// ===== SCREEN 2 —')
s = s[:i] + open(Q + 'f354-blok.jsx', encoding='utf-8').read() + '\n' + s[j:]
cut('// ===== SCREEN 2 —', '// ===== SCREEN 3 —')
cut('// ===== SCREEN 4 —', '// ===== SCREEN 6 —')
cut('// ===== SCREEN 7 —', '// ===== SCREEN 12 —')
R("eyebrow={tr({ uz: 'Amaliyot · LENTA JURNALI', ru: 'Практика · ЖУРНАЛ КОНВЕЙЕРА' })}", "eyebrow={tr({ uz: 'Amaliyot 3 · LENTA JURNALI', ru: 'Практика 3 · ЖУРНАЛ КОНВЕЙЕРА' })}")
R("eyebrow={tr({ uz: 'LENTA QURUVCHISI · markaziy', ru: 'КОНСТРУКТОР КОНВЕЙЕРА · центральный' })}", "eyebrow={tr({ uz: 'Amaliyot 1 · LENTA QURUVCHISI', ru: 'Практика 1 · КОНСТРУКТОР КОНВЕЙЕРА' })}")
i = s.index("  safeReturn:"); j = s.index('\n', i)
s = s[:i] + """  safeReturn:         { icon: '🛫', name: 'First Flight',       desc: { uz: "KitobShop'ga haqiqiy lentani uladingiz", ru: 'Вы подключили настоящую ленту к KitobShop' } },""" + s[j:]
R("const ACH_TRIGGERS = { s3: 'blackBox', s6: 'pipelineArchitect', s10: 'safeReturn', s12: 'boardingComplete' };", "const ACH_TRIGGERS = { s3: 'blackBox', s6: 'pipelineArchitect', s12: 'boardingComplete' };\n// F-1015-354: blok nishoni «Davom etish»da (bonus; ustoz ko'rib turadi)\nconst BLOK_ACH = { a2: 'safeReturn' };")
i = s.index('const Q_LABELS = {'); j = s.index('\n', i)
s = s[:i] + "const Q_LABELS = { 5: { uz: '1 — Yakuniy', ru: '1 — Финал' } }; // F-1015-354: yagona ballik — s12" + s[j:]
R("const INLINE_KEYS = { s2: 1, s5: 3, s7: 0, s9: 2, s12: 1, practice: -1 };", "const INLINE_KEYS = { s12: 1, practice: -1 }; // F-1015-354: s2, s5, s7, s9 olindi")
R("  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });",
  "  const next = () => {\n    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-354: blok «Davom etish»da nishon\n    if (blokAch && live.mode !== 'mentor') earn(blokAch);\n    setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });\n  };")
i = s.index('  const screens = [Screen0, Screen1,'); j = s.index('\n', i)
s = s[:i] + "  const screens = [Screen0, Screen1, Screen6, ScreenCiYml, Screen3, Screen12, ScreenPodium, Screen14];" + s[j:]
i = s.index("    { b: { uz: 'Ulang', ru: 'Подключите' }"); j = s.index('\n', i)
s = s[:i] + """    { b: { uz: 'Ulang', ru: 'Подключите' }, t: { uz: "— darsda ulgurmagan bo'lsangiz, KitobShop'ga ci.yml qo'shib push qiling", ru: '— если не успели на уроке, добавьте ci.yml в KitobShop и сделайте push' } },""" + s[j:]
t3 = open(P3, encoding='utf-8').read()
a = t3.index("        /* ===== F-1015-303/309 · praktika qolipi")
b = t3.index("\n", t3.index("        @media (prefers-reduced-motion: reduce) { .ql-silk, .ql-xabar")) + 1
R("      `}</style>", t3[a:b] + open(Q + 'f354.css', encoding='utf-8').read() + "      `}</style>")
# F-1015-354: a1 jurnalida «Uchirish» qatori ikki marta chiqardi (deploy nuqtasi o'zi yozadi) — yakundagi ortiqcha qator olindi
R("""        pushLog(tr({ uz: "▸ ✈️ Uchirish — samolyot ko'tarildi ✓", ru: '▸ ✈️ Взлёт — самолёт поднялся ✓' }), 'ok');\n        setRunning(false); setPushed(true);""", "        setRunning(false); setPushed(true);")
exec(open('/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish/recap_kalit.py', encoding='utf-8').read())
s = recap_kalit(s, {12: 5})  # F-1015-355: eslatma yakuniy savolning yangi raqamiga
exec(open('/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish/dd_gradient.py', encoding='utf-8').read())
s = dd_gradient(s)  # F-1015-357: drag-drop brend gradient
open(P, 'w', encoding='utf-8').write(s)
print('ok', len(s.splitlines()))
