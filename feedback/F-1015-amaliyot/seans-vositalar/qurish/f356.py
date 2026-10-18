# F-1015-356 · m4c-07 FullProPipelineLesson: 20 → 7 ekran (kirish · reja · a1 ishonchli lenta o'yini (s13, maket) · a2 KitobShop ci.yml — matrix, kesh, seyf + push maketi · s15 yakuniy · podium · yakun)
import os, shutil
ROOT = '/home/kali/Desktop/internetLesson'
P = ROOT + '/src/4c-Modull/FullProPipelineLesson.jsx'
P3 = ROOT + '/src/2-Modull/PracticeLesson3.jsx'
Q = ROOT + '/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
ARX = ROOT + '/arxiv/F-1015-fullpro-oldin/FullProPipelineLesson.jsx'
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
R("// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI", "// F-1015-356 (17.10, avtopilot, foydalanuvchi qarori 7-A — KitobShop; staging/rollback maketda): 20 → 7 ekran. a1 — ishonchli lenta o'yini (eski s13),\n//        a2 — KitobShop ci.yml: matrix (Node 22, 24), cache: npm, JWT_SECRET seyfdan + push maketi (kesh, *** kalit). Oldingi 20 ekranli: arxiv/F-1015-fullpro-oldin/.\n// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI")
i = s.index('const SCREEN_META = ['); j = s.index('];', i) + 2
s = s[:i] + """const SCREEN_META = [
  { id: 's0',       type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',       type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's13',      type: 'builder',     template: 'custom',   scored: false, scope: null }, // F-1015-356: a1 — ishonchli lenta o'yini (maket)
  { id: 'a2',       type: 'exploration', template: 'custom',   scored: false, scope: null }, // KitobShop ci.yml — matrix, kesh, seyf
  { id: 's15',      type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'podium',   type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 's16',      type: 'summary',     template: 'custom',   scored: false, scope: null }
];""" + s[j:]
i = s.index('// ===== SCREEN 1 — REJA'); j = s.index('// ===== SCREEN 2 —')
s = s[:i] + open(Q + 'f356-blok.jsx', encoding='utf-8').read() + '\n' + s[j:]
cut('// ===== SCREEN 2 —', '// ===== ★ SCREEN 13')
cut('// ===== SCREEN 14 —', '// ===== SCREEN 15 —')
cut('// 🛠️ PRAKTIKA — 4c backend', '// ===== YAKUN')
R("eyebrow={tr({ uz: 'Markaziy · ishonchli lenta', ru: 'Центральный · надёжная лента' })}", "eyebrow={tr({ uz: 'Amaliyot 1 · ishonchli lenta (maket)', ru: 'Практика 1 · надёжная лента (макет)' })}")
R("oldingi ekrandagi buzuq yukni <b", "production'dagi buzuq yukni <b")
R("сломанный багаж с прошлого экрана.", "сломанный багаж в продакшене.")
i = s.index("  multiRunner:"); j = s.index('\n', i) + 1
s = s[:i] + s[j:]
i = s.index("  vaultKeeper:"); j = s.index('\n', i)
s = s[:i] + """  vaultKeeper: { icon: '🔐', name: 'Vault Keeper', desc: { uz: "KitobShop lentasiga matrix, kesh va seyfni uladingiz", ru: 'Вы подключили к ленте KitobShop matrix, кеш и сейф' } },""" + s[j:]
R("const ACH_TRIGGERS = { s4: 'multiRunner', s10: 'vaultKeeper', s14: 'proPipeline', s15: 'orderMatters' };", "const ACH_TRIGGERS = { s13: 'proPipeline', s15: 'orderMatters' };\n// F-1015-356: blok nishoni «Davom etish»da (bonus; ustoz ko'rib turadi)\nconst BLOK_ACH = { a2: 'vaultKeeper' };")
i = s.index('const Q_LABELS = {'); j = s.index('\n', i)
s = s[:i] + "const Q_LABELS = { 4: { uz: '1 — Tartib', ru: '1 — Порядок' } }; // F-1015-356: yagona ballik — s15" + s[j:]
R("const INLINE_KEYS = { s4: 1, s8: 3, s10: 0, s14: 2, s15: 0, practice: -1 };", "const INLINE_KEYS = { s15: 0, practice: -1 }; // F-1015-356: s4, s8, s10, s14 olindi")
R("  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });",
  "  const next = () => {\n    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-356: blok «Davom etish»da nishon\n    if (blokAch && live.mode !== 'mentor') earn(blokAch);\n    setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });\n  };")
i = s.index('  const screens = [Screen0, Screen1,'); j = s.index('\n', i)
s = s[:i] + "  const screens = [Screen0, Screen1, Screen13, ScreenProCi, Screen15, ScreenPodium, SummaryScreen];" + s[j:]
i = s.index("""    { b: { uz: "Qo'shing", ru: 'Добавьте' }"""); j = s.index('\n', i)
s = s[:i] + """    { b: { uz: "Qo'shing", ru: 'Добавьте' }, t: { uz: "— darsda ulgurmagan bo'lsangiz, KitobShop ci.yml'iga matrix, kesh va seyfni qo'shib push qiling", ru: '— если не успели на уроке, добавьте в ci.yml KitobShop matrix, кеш и сейф и сделайте push' } },""" + s[j:]
i = s.index("    { b: { uz: 'Sozlang', ru: 'Настройте' }"); j = s.index('\n', i)
s = s[:i] + """    { b: { uz: "O'lchang", ru: 'Измерьте' }, t: { uz: "— Actions'da 1- va 2-push'dagi npm ci vaqtini solishtiring (kesh farqi)", ru: '— сравните в Actions время npm ci на 1-м и 2-м push (разница от кеша)' } },""" + s[j:]
# Kirish: Node versiyalari a2 dagi matrix bilan bir xil (22, 24 — 2026 kuzida LTS)
i = s.index('const Screen0 = '); j = s.index('// ===== F-1015-356', i)
s = s[:i] + s[i:j].replace('18/20/22', '22, 24').replace('Node 20', 'Node 24').replace('Node 18', 'Node 22') + s[j:]
# F-1015-358 (17.10, foydalanuvchi qarori 11-A): yakuniy test haqiqiy ketma-ketlikni so'raydi — matrix, kesh va seyf bitta ishning sozlamalari, ular orasida tartib yo'q
i = s.index('const PRO_ITEMS = ['); j = s.index('];', i) + 2
s = s[:i] + """const PRO_ITEMS = [
  { id: 'push', label: { uz: "git push — kod GitHub'ga", ru: 'git push — код на GitHub' } },
  { id: 'lenta', label: { uz: 'Lenta — matrix, kesh, seyf', ru: 'Лента — matrix, кеш, сейф' } },
  { id: 'staging', label: { uz: 'Staging — sinov reysi', ru: 'Staging — тестовый рейс' } },
  { id: 'check', label: { uz: "Staging'da tekshirish", ru: 'Проверка на staging' } },
  { id: 'production', label: { uz: '✈️ Production — haqiqiy reys', ru: '✈️ Production — настоящий рейс' } }
];""" + s[j:]
R("""    const stageIdx = slots.indexOf('staging');
    setConsequence(prodIdx >= 0 && stageIdx >= 0 && prodIdx < stageIdx ? 'skip-staging' : 'wrong');""", """    const stageIdx = slots.indexOf('staging');
    const checkIdx = slots.indexOf('check');
    setConsequence(prodIdx >= 0 && (prodIdx < stageIdx || prodIdx < checkIdx) ? 'skip-staging' : 'wrong');""")
R("<b>Matrix → Cache → Secret → Staging → Production</b>. Muammo", "<b>Push → Lenta → Staging → Tekshirish → Production</b>. Muammo")
R("<b>Matrix → Cache → Secret → Staging → Production</b>. Если", "<b>Push → Лента → Staging → Проверка → Production</b>. Если")
i = s.index('      { ic: "🧬", h: { uz: "Avval — parallel tekshirish"'); j = s.index('\n    ]', i)
s = s[:i] + """      { ic: "🚀", h: { uz: "Avval — push", ru: 'Сначала — push' }, body: { uz: <>Kod GitHub'ga push qilinadi — lenta shundan boshlanadi.</>, ru: <>Код отправляется на GitHub через push — с этого и начинается лента.</> } },
      { ic: "🧬", h: { uz: "Keyin — lenta", ru: 'Потом — лента' }, body: { uz: <>Lenta bitta ishda matrix, kesh va seyf bilan tekshiradi. Bu uchtasining ci.yml'dagi tartibi muhim emas.</>, ru: <>Лента в одной задаче проверяет с matrix, кешем и сейфом. Порядок этих трёх в ci.yml не важен.</> } },
      { ic: "🛫", h: { uz: "Sinov reysi, tekshirish, keyin haqiqiy reys", ru: 'Тестовый рейс, проверка, потом настоящий' }, body: { uz: <>Avval staging'ga chiqadi va u yerda tekshiriladi, keyingina production'ga.</>, ru: <>Сначала выходит на staging и проверяется там, и только потом — в production.</> }, vis: <RcFlow items={['Push', { uz: 'Lenta', ru: 'Лента' }, 'Staging', { uz: 'Tekshirish', ru: 'Проверка' }, 'Production']} />, ask: { uz: "Staging va production orasida nima qilinadi?", ru: 'Что делается между staging и production?' } },""" + s[j:]
R('<span className="rc-chip">{t}</span>', "<span className=\"rc-chip\">{typeof t === 'object' ? tr(t) : t}</span>")  # F-1015-358: chip uz/ru obyektini ham qabul qiladi
R('question: "Ishonchli lenta bosqichlarini to\'g\'ri tartibda joylang"', 'question: "Push\'dan production\'gacha bosqichlarni to\'g\'ri tartibda joylang"')
exec(open(Q + 'recap_kalit.py', encoding='utf-8').read())
s = recap_kalit(s, {15: 4})
t3 = open(P3, encoding='utf-8').read()
a = t3.index("        /* ===== F-1015-303/309 · praktika qolipi")
b = t3.index("\n", t3.index("        @media (prefers-reduced-motion: reduce) { .ql-silk, .ql-xabar")) + 1
R("      `}</style>", t3[a:b] + open(Q + 'f356.css', encoding='utf-8').read() + "      `}</style>")
exec(open('/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish/dd_gradient.py', encoding='utf-8').read())
s = dd_gradient(s)  # F-1015-357: drag-drop brend gradient
open(P, 'w', encoding='utf-8').write(s)
print('ok', len(s.splitlines()))
