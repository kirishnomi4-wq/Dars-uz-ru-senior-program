# F-1015-346 · m3-12 ReactProjectDayLesson: 23 → 8 ekran (kirish · reja · a1 katalog+mashina (Gemini) · a2 ijara+jami (Gemini) · a3 AI xatosi (kun) · s14 yakuniy · podium · yakun)
import os, shutil
ROOT = '/home/kali/Desktop/internetLesson'
P = ROOT + '/src/3-Modull/ReactProjectDayLesson.jsx'
P3 = ROOT + '/src/2-Modull/PracticeLesson3.jsx'
Q = ROOT + '/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
ARX = ROOT + '/arxiv/F-1015-reactprojectday-oldin/ReactProjectDayLesson.jsx'
if not os.path.exists(ARX):
    os.makedirs(os.path.dirname(ARX), exist_ok=True); shutil.copy(P, ARX)
s = open(ARX, encoding='utf-8').read()
def R(old, new, n=1):
    global s
    c = s.count(old)
    assert c == n, (c, old[:90])
    s = s.replace(old, new)
R("// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI", "// F-1015-346 (17.10, tungi avtopilot): 23 → 8 ekran. Agent (Antigravity) o'rniga Gemini promptlari: a1 katalog (public/cars.json + fetch) va mashina sahifasi\n//        (/car/:id), a2 ijara (kun, bookings state, /bookings, jami — for), a3 — AI xatosi (kun unutilgan, eski s11), s14 yakuniy. Qo'shish (POST) — uyga vazifa.\n//        Oldingi 23 ekranli: arxiv/F-1015-reactprojectday-oldin/.\n// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI")
i = s.index('const SCREEN_META = ['); j = s.index('];', i) + 2
s = s[:i] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-346: katalog + mashina sahifasi (Gemini)
  { id: 'a2',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // ijara + jami (Gemini)
  { id: 's11', type: 'rule',        template: 'custom',   scored: false, scope: null }, // a3 — AI xatosi (kun unutilgan)
  { id: 's14', type: 'test',        template: 'custom',   scored: true,  scope: 'final' },
  { id: 'spodium', type: 'stats',   template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'summary',     template: 'custom',   scored: false, scope: null }
];""" + s[j:]
i = s.index('// ===== SCREEN 1 — REJA ====='); j = s.index('// ===== SCREEN 11 — DEBUGGING')
s = s[:i] + open(Q + 'f346-blok.jsx', encoding='utf-8').read() + '\n' + s[j:]
a = s.index('const Screen11 = '); b = s.index('// ===== SCREEN 12', a)
s = s[:a] + s[a:b].replace("eyebrow={tr({ uz: 'Debugging', ru: 'Дебаггинг' })}", "eyebrow={tr({ uz: 'Amaliyot 3 · AI xatosi', ru: 'Практика 3 · ошибка AI' })}").replace('Agent ', 'AI ').replace('Агент ', 'AI ') + s[b:]
R('''desc: { uz: "Agentni buyurish → reja → tasdiq bilan boshqardingiz"''', '''desc: { uz: "Gemini'ga aniq prompt berib katalogni qurdingiz"''')
i = s.index("  lead:     { icon: '🎯'"); j = s.index('\n', i); line = s[i:j]
k = line.index("ru: '", line.index('desc:')); e = line.index("' }", k)
s = s[:i] + line[:k] + "ru: 'Вы построили каталог точным промптом для Gemini" + line[e:] + s[j:]
R("const ACH_TRIGGERS = { s4: 'lead', s8: 'builder', s12: 'debugger', s14: 'graduate' };", "const ACH_TRIGGERS = { s11: 'debugger', s14: 'graduate' };\n// F-1015-346: blok nishonlari «Davom etish»da (bonus; ustoz ko'rib turadi)\nconst BLOK_ACH = { a1: 'lead', a2: 'builder' };")
i = s.index('const Q_LABELS = {'); j = s.index('\n', i)
s = s[:i] + "const Q_LABELS = { 5: { uz: '1 — Yakuniy', ru: '1 — Финал' } }; // F-1015-346: yagona ballik — s14" + s[j:]
R("const INLINE_KEYS = { s4: 2, s5b: 0, s8: 3, s12: 1, s14: -1 };", "const INLINE_KEYS = { s14: -1 }; // F-1015-346: MCQ s4, s5b, s8, s12 olindi")
R("  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });",
  "  const next = () => {\n    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-346: blok «Davom etish»da nishon\n    if (blokAch && live.mode !== 'mentor') earn(blokAch);\n    setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });\n  };")
i = s.index('  const screens = [Screen0, Screen1,'); j = s.index('\n', i)
s = s[:i] + "  const screens = [Screen0, Screen1, ScreenKatalog, ScreenIjara, Screen11, Screen14, ScreenPodium, Screen15];" + s[j:]
i = s.index('  const HOMEWORK = ['); j = s.index('  ];', i) + 4
s = s[:i] + """  const HOMEWORK = [
    { b: tr({ uz: "Mashina qo'shish", ru: 'Добавление машины' }), t: tr({ uz: "— /add sahifasi: forma, setCars([...cars, yangi]) va navigate('/') — Gemini bilan", ru: "— страница /add: форма, setCars([...cars, yangi]) и navigate('/') — с Gemini" }) },
    { b: tr({ uz: 'Ijarani bekor qilish', ru: 'Отмена аренды' }), t: tr({ uz: "— «Mening ijaralarim»da har ijaraga ✕: filter bilan o'chirsin, jami qayta hisoblansin", ru: '— в «Мои аренды» у каждой аренды ✕: удаляет через filter, итог пересчитывается' }) },
    { b: tr({ uz: 'Tekshiring', ru: 'Проверьте' }), t: tr({ uz: "— har promptdan keyin brauzerda sinang: jami to'g'rimi, sahifa almashsa ma'lumot qoladimi", ru: '— после каждого промпта проверяйте в браузере: итог верный, данные сохраняются при смене страницы' }) }
  ];""" + s[j:]
R("""Antigravity bilan o'z loyihangizni boshlang:", ru: 'Начните с Antigravity свой проект:'""", """VS Code'da, avto-ijara loyihangizda:", ru: 'В VS Code, в проекте avto-ijara:'""")
# arena: agent → AI (to'g'ri o'rinlar o'zgarmaydi)
R('{ uz: "Agentni boshqarish tartibi qanday?", ru: \'Каков порядок управления агентом?\' }', '{ uz: "AI bilan qurish tartibi qanday?", ru: \'Каков порядок работы с AI?\' }')
R('{ uz: "buyurish → reja → tasdiq → tekshirish → sinash", ru: \'поручение → план → одобрение → проверка → испытание\' }', '{ uz: "qism → prompt → tekshirish → tuzatish", ru: \'часть → промпт → проверка → исправление\' }', 2)
R('{ uz: "Agentning 1-urinishi to\'liq bo\'lmasa, nima qilasiz?", ru: \'Первая попытка агента неполная — что Вы сделаете?\' }', '{ uz: "AI\'ning birinchi javobi to\'liq bo\'lmasa, nima qilasiz?", ru: \'Первый ответ AI неполный — что Вы сделаете?\' }')
R('{ uz: "Agent boshliq — men kutaman", ru: \'Агент — а я жду\' }', '{ uz: "AI boshliq — men kutaman", ru: \'AI руководит — а я жду\' }')
R('{ uz: "Men boshliq — agent quradi", ru: \'Я руководитель — агент строит\' }', '{ uz: "Men boshliq — AI quradi", ru: \'Я руководитель — AI строит\' }')
R("""    tr({ uz: "Agentni boshqarish: buyurish → reja → tasdiq → tekshirish → sinash", ru: 'Управление агентом: поручение → план → одобрение → проверка → испытание' }),""",
  """    tr({ uz: "Har qism — alohida prompt, har qadamdan keyin brauzerda tekshirish", ru: 'Каждая часть — отдельный промпт, после каждого шага проверка в браузере' }),""")
R("'<Link>', 'useEffect', 'agent', 'prompt'", "'<Link>', 'useEffect', 'Gemini', 'prompt'")
R("{ ch: 'agent',     l: 2,", "{ ch: 'Gemini',    l: 2,")
# F-1015-358 (17.10, foydalanuvchi qarori 9-A): mashinalar m4-08 bilan bir xil — Chevrolet/Kia, narx so'mda (Cobalt 280 000, Malibu 520 000, Kia K5 610 000, Spark 190 000)
i = s.index('const CARS = ['); j = s.index('const carById', i)
s = s[:i] + """const CARS = [
  { id: 1, name: 'Chevrolet Cobalt', emoji: '🚗', price: 280000, seats: 5, speed: 180, desc: { uz: "Tejamkor va ishonchli — shahar uchun qulay.", ru: 'Экономичная и надёжная — удобна для города.' }, bg: 'linear-gradient(135deg,#BAC4EC,#98A6DC)' },
  { id: 2, name: 'Chevrolet Malibu', emoji: '🚘', price: 520000, seats: 5, speed: 210, desc: { uz: "Keng va yumshoq — uzoq yo'lga yaxshi.", ru: 'Просторная и мягкая — хороша для дальней дороги.' }, bg: 'linear-gradient(135deg,#A6D4CF,#82BDB6)' },
  { id: 3, name: 'Kia K5', emoji: '🏎️', price: 610000, seats: 5, speed: 220, desc: { uz: "Zamonaviy va tez — yo'lda hamma qaraydi.", ru: 'Современная и быстрая — на дороге все смотрят.' }, bg: 'linear-gradient(135deg,#B6DDC4,#92C8A7)' },
  { id: 4, name: 'Chevrolet Tracker', emoji: '🚙', price: 400000, seats: 5, speed: 190, desc: { uz: "Baland krossover — tog'ga ham boradi.", ru: 'Высокий кроссовер — проедет и в горы.' }, bg: 'linear-gradient(135deg,#F3C2D2,#DFA6BA)' }
];
const POOL = [
  { id: 5, name: 'Chevrolet Spark', emoji: '🚗', price: 190000, seats: 4, speed: 150, desc: { uz: "Kichkina, ixcham, arzon.", ru: 'Маленькая, компактная, недорогая.' }, bg: 'linear-gradient(135deg,#C6BFB8,#A79E95)' },
  { id: 6, name: 'Chevrolet Captiva', emoji: '🚐', price: 550000, seats: 7, speed: 200, desc: { uz: "7 o'rindiq — katta oila uchun.", ru: '7 мест — для большой семьи.' }, bg: 'linear-gradient(135deg,#D2C0EE,#B6A0E2)' }
];
// F-1015-358: narx so'mda — 280000 → «280 000 so'm» (bo'shliq uzilmaydi)
const som = (n) => String(n).replace(/\\B(?=(\\d{3})+(?!\\d))/g, '\\u00A0');
const somT = (n) => `${som(n)}\\u00A0${tr({ uz: "so'm", ru: 'сум' })}`;
""" + s[j:]
R("<span style={{ color: T.accent, fontWeight: 800 }}>${car.price}/{tr({ uz: 'kun', ru: 'день' })}</span>", "<span style={{ color: T.accent, fontWeight: 800 }}>{somT(car.price)}/{tr({ uz: 'kun', ru: 'день' })}</span>")
R("<span style={{ color: T.accent, fontWeight: 800 }}>${c.price}/{tr({ uz: 'kun', ru: 'день' })}</span>", "<span style={{ color: T.accent, fontWeight: 800 }}>{somT(c.price)}/{tr({ uz: 'kun', ru: 'день' })}</span>")
R("const bookings = [{ car: CARS[1], days: 3 }, { car: CARS[0], days: 2 }]; // Lambo 3 kun, Tesla 2 kun", "const bookings = [{ car: CARS[1], days: 3 }, { car: CARS[0], days: 2 }]; // Malibu 3 kun, Cobalt 2 kun")
R("// 200+80 = 280 (xato)", "// 520000+280000 = 800000 (xato)")
R("// 600+160 = 760", "// 1560000+560000 = 2120000")
R("Lamborghini 3 kun ($200) + Tesla 2 kun ($80) — jami $760 bo'lishi kerak, lekin $280 chiqyapti.", "Malibu 3 kun (520 000 so'm) + Cobalt 2 kun (280 000 so'm) — jami 2 120 000 so'm bo'lishi kerak, lekin 800 000 so'm chiqyapti.")
R("Lamborghini 3 дня ($200) + Tesla 2 дня ($80) — итог должен быть $760, а выходит $280.", "Malibu 3 дня (520 000 сум) + Cobalt 2 дня (280 000 сум) — итог должен быть 2 120 000 сум, а выходит 800 000 сум.")
R("{b.days} {tr({ uz: 'kun', ru: 'дн.' })} × ${b.car.price}</span>", "{b.days} {tr({ uz: 'kun', ru: 'дн.' })} × {som(b.car.price)}</span>")
R("${fixed ? b.car.price * b.days : b.car.price}</span>", "{somT(fixed ? b.car.price * b.days : b.car.price)}</span>")
R("${fixed ? rightTotal : wrongTotal}{!fixed && ' ✗'}", "{somT(fixed ? rightTotal : wrongTotal)}{!fixed && ' ✗'}")
R("""<span style={{ fontWeight: 700, flex: 1 }}>🏎️ Lamborghini</span><span className="mono" style={{ color: T.ink3 }}>3 {tr({ uz: 'kun', ru: 'дн.' })} × $200</span><span style={{ color: T.accent, fontWeight: 800 }}>${valid ? 600 : '?'}</span>""",
  """<span style={{ fontWeight: 700, flex: 1 }}>🚘 Chevrolet Malibu</span><span className="mono" style={{ color: T.ink3 }}>3 {tr({ uz: 'kun', ru: 'дн.' })} × {som(520000)}</span><span style={{ color: T.accent, fontWeight: 800 }}>{valid ? somT(1560000) : '?'}</span>""")
R("""<span style={{ fontWeight: 700, flex: 1 }}>⚡ Tesla</span><span className="mono" style={{ color: T.ink3 }}>2 {tr({ uz: 'kun', ru: 'дн.' })} × $80</span><span style={{ color: T.accent, fontWeight: 800 }}>${valid ? 160 : '?'}</span>""",
  """<span style={{ fontWeight: 700, flex: 1 }}>🚗 Chevrolet Cobalt</span><span className="mono" style={{ color: T.ink3 }}>2 {tr({ uz: 'kun', ru: 'дн.' })} × {som(280000)}</span><span style={{ color: T.accent, fontWeight: 800 }}>{valid ? somT(560000) : '?'}</span>""")
R("<span style={{ color: valid ? T.success : T.ink3 }}>${valid ? 760 : '?'}</span>", "<span style={{ color: valid ? T.success : T.ink3 }}>{valid ? somT(2120000) : '?'}</span>")
R("""{ q: { uz: "Tesla $80/kun, 3 kun — jami qancha?", ru: 'Tesla $80/день, 3 дня — сколько всего?' }, opts: ["$240", "$80", "$83", "$3"], correct: 0 },""",
  """{ q: { uz: "Cobalt 280 000 so'm/kun, 3 kun — jami qancha?", ru: 'Cobalt 280 000 сум/день, 3 дня — сколько всего?' }, opts: [{ uz: "840 000 so'm", ru: '840 000 сум' }, { uz: "280 000 so'm", ru: '280 000 сум' }, { uz: "280 003 so'm", ru: '280 003 сум' }, { uz: "3 so'm", ru: '3 сум' }], correct: 0 },""")
t3 = open(P3, encoding='utf-8').read()
a = t3.index("        /* ===== F-1015-303/309 · praktika qolipi")
b = t3.index("\n", t3.index("        @media (prefers-reduced-motion: reduce) { .ql-silk, .ql-xabar")) + 1
R("      `}</style>", t3[a:b] + open(Q + 'f346.css', encoding='utf-8').read() + "      `}</style>")
open(P, 'w', encoding='utf-8').write(s)
print('ok', len(s.splitlines()))
