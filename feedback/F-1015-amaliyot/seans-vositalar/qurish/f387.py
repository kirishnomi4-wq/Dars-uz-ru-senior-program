# F-1015-387 (17.10, foydalanuvchi «maqul qil»): m4-10 FullstackConnect 8 → 9 ekran.
# a1 «VS Code'da» qadamlari → Qadamlar oynasi · a2 CORS Mentor 2 gap (shlagbaum/kalit o'xshatishi olindi) · a3 → a3 maydonlar+3 holat · a4 qo'shish formasi.
# Kalitlar: SCREEN_META +a4 · screens · Q_LABELS 5 → 6 · RECAPS 5 → 6 (test «qayerdan oladi» — o'sha eslatma) · BLOK_ACH fullStack a3 → a4 · BLOK3 4 blok.
import sys, re
sys.path.insert(0, '/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish')
from praktika_ux import stage_yigil, kodoyna_nur
Q = '/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
p = '/home/kali/Desktop/internetLesson/src/4-Modull/FullstackConnectPracticeLesson.jsx'
s = open(p, encoding='utf-8').read()
def r(a, b):
    global s
    assert s.count(a) == 1, ('soni', s.count(a), a[:90]); s = s.replace(a, b)
assert 'F-1015-387' not in s
# a1
r("""            <div className="am-karta">
              <p className="flow-label">{tr({ uz: "VS Code'da", ru: 'В VS Code' })}</p>
              <ol className="am-qadam">{A1_QADAM.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
            </div>""", """            <QadamTugma b={A1_QADAM} /> {/* F-1015-387: «VS Code'da» qadamlari — oynada */}""")
# a2 CORS Mentor
a = s.index('const Screen10 = ('); j = s.index('<Mentor>', a); k = s.index('</Mentor>', j) + len('</Mentor>')
s = s[:j] + """<Mentor>{tr({ uz: <>Brauzer xavfsizlik uchun <span className="mono">:5173</span> dan <span className="mono">:3000</span> ga ketayotgan so'rovni to'sadi — bu <b style={{ color: T.ink }}>CORS</b>, har dasturchi ko'radigan birinchi xato. Uni serverdagi bitta qator ochadi: <span className="mono">app.use(cors())</span>.</>, ru: <>Ради безопасности браузер блокирует запрос с <span className="mono">:5173</span> на <span className="mono">:3000</span> — это <b style={{ color: T.ink }}>CORS</b>, первая ошибка, которую видит каждый разработчик. Её снимает одна строка на сервере: <span className="mono">app.use(cors())</span>.</> })}</Mentor>{/* F-1015-387: 2 gap, bitta tushuntirish */}""" + s[k:]
# a3 → a3 + a4
a = s.index('// ===== a3 — Gemini: server maydonlari (nom, narx, yil), 3 holat va POST forma =====')
b = s.index('\n};\n', s.index('const ScreenForma = (')) + 4
s = s[:a] + open(Q + 'f387-ekranlar.jsx', encoding='utf-8').read() + s[b:]
# kalitlar
r("  { id: 'a3',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // maydonlar + holatlar + forma (Gemini)\n",
  "  { id: 'a3',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-387: maydonlar + 3 holat (Gemini)\n  { id: 'a4',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // qo'shish formasi — POST (Gemini)\n")
r("  const screens = [Screen0, Screen1, ScreenUlash, Screen10, ScreenForma, Screen14, ScreenPodium, Screen17];", "  const screens = [Screen0, Screen1, ScreenUlash, Screen10, ScreenHolat, ScreenForma, Screen14, ScreenPodium, Screen17]; // F-1015-387: 9 ekran")
r("const Q_LABELS = { 5: { uz: '1 — serverdan', ru: '1 — с сервера' } };", "const Q_LABELS = { 6: { uz: '1 — serverdan', ru: '1 — с сервера' } }; // F-1015-387: 9 ekranda 6-o'rin")
r("const BLOK_ACH = { a1: 'connected', s10: 'bothOnline', a3: 'fullStack' };", "const BLOK_ACH = { a1: 'connected', s10: 'bothOnline', a4: 'fullStack' }; // F-1015-387: to'liq fullstack — forma (a4)")
a = s.index('const RECAPS = {'); m = re.search(r'\n  5: \{', s[a:a + 400]); assert m, 'RECAPS 5'
s = s[:a + m.start()] + '\n  6: { // F-1015-387: test 6-o\'ringa siljidi — eslatma o\'sha savolga' + s[a + m.end():]
r("""  { t: { uz: "Maydonlar, 3 holat va forma", ru: 'Поля, 3 состояния и форма' }, tag: 'Gemini' }""", """  { t: { uz: 'Maydonlar va 3 holat', ru: 'Поля и 3 состояния' }, tag: 'Gemini' }, // F-1015-387: 4 blok
  { t: { uz: "Qo'shish formasi", ru: 'Форма добавления' }, tag: 'Gemini' }""")
# umumiy
s = stage_yigil(s); s = kodoyna_nur(s)
open(p, 'w', encoding='utf-8').write(s); print('ok 387')
    # (o'sha kun) eski PromptBlok — ishlatilmaydi, olindi
