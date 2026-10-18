# F-1015-376 (17.10, foydalanuvchi «A»): m3-12 8 → 9 ekran. a1/a2 o'rniga f376-ekranlar.jsx (a1 katalog · a2 mashina+kun · a3 ijaralar+jami).
# Joyida, f375.py dan keyin. Zaxira: arxiv/F-1015-376-oldin/.
import re
Q = '/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
p = '/home/kali/Desktop/internetLesson/src/3-Modull/ReactProjectDayLesson.jsx'
s = open(p, encoding='utf-8').read()
def r(a, b):
    global s
    assert s.count(a) == 1, ('topilmadi/takror', a[:90]); s = s.replace(a, b)
assert 'F-1015-376' not in s
# 1) a1 + a2 bloki → yangi 3 ekran
a = s.index('// ===== a1 — Gemini: katalog (fetch cars.json) va mashina sahifasi (Router, useParams) =====')
b = s.index('\n};\n', s.index('const ScreenIjara = (')) + 4
s = s[:a] + open(Q + 'f376-ekranlar.jsx', encoding='utf-8').read() + s[b:]
# 2) eski KodNusxa — endi ishlatilmaydi
a = s.index('const KodNusxa = ({ yorliq, kod }) => {'); b = s.index('\n};\n', a) + 4
s = s[:a] + s[b:]
# 3) SCREEN_META, screens, Q_LABELS, nishonlar, reja bloklari, AI xatosi yorlig'i
r("  { id: 'a1',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-346: katalog + mashina sahifasi (Gemini)\n  { id: 'a2',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // ijara + jami (Gemini)\n",
  "  { id: 'a1',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-376: katalog (fetch cars.json)\n  { id: 'a2',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // mashina sahifasi + kun (useParams, price * days)\n  { id: 'a3',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // ijaralar + jami (bookings, for)\n")
r("  { id: 's11', type: 'rule',        template: 'custom',   scored: false, scope: null }, // a3 — AI xatosi (kun unutilgan)", "  { id: 's11', type: 'rule',        template: 'custom',   scored: false, scope: null }, // a4 — AI xatosi (kun unutilgan)")
r("  const screens = [Screen0, Screen1, ScreenKatalog, ScreenIjara, Screen11, Screen14, ScreenPodium, Screen15];", "  const screens = [Screen0, Screen1, ScreenKatalog, ScreenMashina, ScreenIjara, Screen11, Screen14, ScreenPodium, Screen15]; // F-1015-376: 9 ekran")
r("const Q_LABELS = { 5: { uz: '1 — Yakuniy', ru: '1 — Финал' } }; // F-1015-346: yagona ballik — s14", "const Q_LABELS = { 6: { uz: '1 — Yakuniy', ru: '1 — Финал' } }; // F-1015-346: yagona ballik — s14 (F-1015-376: 9 ekranda 6-o'rin)")
r("const BLOK_ACH = { a1: 'lead', a2: 'builder' };", "const BLOK_ACH = { a1: 'lead', a3: 'builder' }; // F-1015-376: «Shipped It!» — ijaralar va jami (to'liq mantiq) a3 da")
r("""const BLOK3 = [
  { t: { uz: 'Katalog va mashina sahifasi', ru: 'Каталог и страница машины' }, tag: 'Gemini' },
  { t: { uz: 'Ijara va jami narx', ru: 'Аренда и итог' }, tag: 'Gemini' },""", """const BLOK3 = [ // F-1015-376: har qism — bitta prompt
  { t: { uz: 'Katalog', ru: 'Каталог' }, tag: 'Gemini' },
  { t: { uz: 'Mashina sahifasi va kun', ru: 'Страница машины и дни' }, tag: 'Gemini' },
  { t: { uz: 'Ijaralar va jami narx', ru: 'Аренды и итог' }, tag: 'Gemini' },""")
r("<Stage eyebrow={tr({ uz: 'Amaliyot 3 · AI xatosi', ru: 'Практика 3 · ошибка AI' })}", "<Stage eyebrow={tr({ uz: 'Amaliyot 4 · AI xatosi', ru: 'Практика 4 · ошибка AI' })}")
# 4) CSS
m = re.search(r'(?m)^        \.av-json \{[^\n]*$', s); assert m, 'av-json css'
s = s[:m.end()] + """
        .av-json-tg { display: inline-flex; gap: 8px; flex-wrap: wrap; } /* F-1015-376: cars.json kartasi — Ko'rish + Nusxalash */
        .av-json-kor { font: 700 13px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 8px 14px; cursor: pointer; }
        .av-json-kor:hover { border-color: ${T.accent}; color: ${T.accent}; }
        .av-json-kor:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .am-tt-oyna .av-json { max-height: none; }
        .av-narx { margin: 10px 0 0; font-size: 14px; color: ${T.ink2}; } .av-narx b { color: ${T.ink}; }""" + s[m.end():]
open(p, 'w', encoding='utf-8').write(s); print('ok 376')
