# F-1015-390 (17.10, foydalanuvchi «xa qil maqul»): m4-10 ga «Mustaqil ish» — testdan oldin; 9 → 10 ekran. Uyga vazifa keyingi qadamga (DELETE darsga ko'chdi).
import re
Q = '/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
p = '/home/kali/Desktop/internetLesson/src/4-Modull/FullstackConnectPracticeLesson.jsx'
s = open(p, encoding='utf-8').read()
def r(a, b):
    global s
    assert s.count(a) == 1, ('soni', s.count(a), a[:90]); s = s.replace(a, b)
assert 'F-1015-390' not in s
k = s.index('// ===== SCREEN 10 — CASE: CORS')
s = s[:k] + open(Q + 'f390-ekran.jsx', encoding='utf-8').read() + '\n' + s[k:]
r("  { id: 'a4',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // qo'shish formasi — POST (Gemini)\n",
  "  { id: 'a4',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // qo'shish formasi — POST (Gemini)\n  { id: 'mi',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-390: mustaqil ish — DELETE + PUT, prompt o'quvchida\n")
r("  const screens = [Screen0, Screen1, ScreenUlash, Screen10, ScreenHolat, ScreenForma, Screen14, ScreenPodium, Screen17]; // F-1015-387: 9 ekran",
  "  const screens = [Screen0, Screen1, ScreenUlash, Screen10, ScreenHolat, ScreenForma, ScreenMustaqil, Screen14, ScreenPodium, Screen17]; // F-1015-390: 10 ekran (mustaqil ish)")
r("const Q_LABELS = { 6: { uz: '1 — serverdan', ru: '1 — с сервера' } }; // F-1015-387: 9 ekranda 6-o'rin", "const Q_LABELS = { 7: { uz: '1 — serverdan', ru: '1 — с сервера' } }; // F-1015-390: 10 ekranda 7-o'rin")
r("\n  6: { // F-1015-387: test 6-o'ringa siljidi — eslatma o'sha savolga", "\n  7: { // F-1015-390: test 7-o'ringa siljidi — eslatma o'sha savolga")
r("""  { t: { uz: "Qo'shish formasi", ru: 'Форма добавления' }, tag: 'Gemini' }""", """  { t: { uz: "Qo'shish formasi", ru: 'Форма добавления' }, tag: 'Gemini' },
  { t: { uz: "Mustaqil ish: o'chirish va narx", ru: 'Самостоятельно: удаление и цена' }, tag: { uz: 'siz + Gemini', ru: 'Вы + Gemini' } }""")
# uyga vazifa — keyingi qadam (DELETE, holatlar, forma — darsda qilindi)
a = s.index('  const HOMEWORK = ['); b = s.index('  ];', a) + 4
s = s[:a] + """  const HOMEWORK = [ // F-1015-390: o'chirish, holatlar va forma — darsda; uyga — keyingi qadam
    { b: { uz: 'Qidiruv', ru: 'Поиск' }, t: { uz: "— nom bo'yicha qidiruv maydoni: yozilgan so'z bor mashinalargina ko'rinsin (filter)", ru: '— поле поиска по названию: видны только машины с этим словом (filter)' } },
    { b: { uz: 'Mashina sahifasi', ru: 'Страница машины' }, t: { uz: "— /car/:id sahifasi ma'lumotni serverdagi GET /api/cars/:id dan olsin", ru: '— страница /car/:id берёт данные с сервера через GET /api/cars/:id' } },
    { b: { uz: 'Tekshiring', ru: 'Проверьте' }, t: { uz: "— har o'zgarishdan keyin F5: ma'lumot bazadan qayta keladimi?", ru: '— после каждого изменения F5: данные снова приходят из базы?' } }
  ];""" + s[b:]
# CSS
i = s.index('        .us-izoh {'); j = s.index('\n', i)
s = s[:j] + """
        .mi-ilova { padding: 8px; gap: 6px; } /* F-1015-390: mustaqil ish — kutilgan natija */
        .mi-qator { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 10px; background: ${T.bg}; min-width: 0; } .mi-qator b { font: 700 13px 'Manrope', sans-serif; color: ${T.ink}; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mi-narx { font: 600 12.5px 'JetBrains Mono', monospace; color: ${T.ink2}; white-space: nowrap; }
        .mi-tg { flex: none; font: 700 12px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 8px; padding: 4px 9px; cursor: pointer; } .mi-tg:hover { border-color: ${T.accent}; color: ${T.accent}; } .mi-tg:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .mi-x { color: ${T.danger}; }
        .mi-tez { margin: 6px 0 0; font-size: 13.5px; color: ${T.ink2}; } .mi-tez b { color: ${T.ink}; }""" + s[j:]
open(p, 'w', encoding='utf-8').write(s); print('ok 390')
