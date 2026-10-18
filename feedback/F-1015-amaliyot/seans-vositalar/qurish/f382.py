# F-1015-382…384 (17.10, foydalanuvchi «xa qil halol shoshilmasdan»): m4-08 BackendCrudPractice 8 → 9 ekran.
# 382 kirish javobi qisqa, qizil yozuv qisqa; ⛶ faqat vizual (214). 383 reja sarlavhasi — «bazada yashaydi» o'rniga oddiy gap. 384 a2 → a2 server+GET · a3 POST/PUT/DELETE;
# prompt yig'iq karta (Ko'rish → oyna), Qadamlar tepada, kod oynasi o'ngda, jadval cheksiz o'smaydi. a1 psql qadamlari → Qadamlar oynasi. RECAPS: yakuniy (6) ga «Ko'prik».
import sys, re
sys.path.insert(0, '/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish')
from praktika_ux import stage_yigil, kodoyna_nur
Q = '/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
p = '/home/kali/Desktop/internetLesson/src/4-Modull/BackendCrudPracticeLesson.jsx'
s = open(p, encoding='utf-8').read()
def r(a, b):
    global s
    assert s.count(a) == 1, ('soni', s.count(a), a[:90]); s = s.replace(a, b)
assert 'F-1015-384' not in s
# --- 382 kirish
r("""tr({ uz: <>Aniq! Mashinalar qo'lda yozilgan — yangisini qo'shish uchun har safar kodni ochish kerak, sahifani yangilasangiz o'zgarish yo'qoladi. Bugun ma'lumotni <b>doimiy bazada</b> saqlaydigan va <b>boshqariladigan</b> backend quramiz.</>, ru: <>Точно! Машины вписаны вручную — чтобы добавить новую, каждый раз надо открывать код, а обновите страницу — изменения пропадут. Сегодня построим backend, который хранит данные в <b>постоянной базе</b> и умеет <b>управлять</b> ими.</> })""",
  """tr({ uz: <>Aniq! Ro'yxat kodning ichida — sahifani yangilasangiz, o'zgarish yo'qoladi. Bugun ma'lumotni <b>bazada</b> saqlaydigan backend quramiz.</>, ru: <>Точно! Список внутри кода — обновите страницу, и изменения пропадут. Сегодня построим backend, который хранит данные <b>в базе</b>.</> }) /* F-1015-382: qisqa */""")
r("""tr({ uz: "Tugma bor — lekin hech narsa o'zgarmadi. Ro'yxat kod ichida qotib qolgan, orqada server yo'q!", ru: 'Кнопка есть — но ничего не изменилось. Список застыл в коде, за ним нет сервера!' })""",
  """tr({ uz: "Tugma bor — lekin hech narsa o'zgarmadi.", ru: 'Кнопка есть — но ничего не изменилось.' })""")
a = s.index('const Screen0 = ('); b = s.index('\n};\n', a); body = s[a:b]
assert body.count('        <Zoomable>\n        <Split>') == 1 and body.count('        </Split>\n        </Zoomable>') == 1
body = body.replace('        <Zoomable>\n        <Split>', '        <Split>', 1).replace('        </Split>\n        </Zoomable>', '        </Split>', 1)
x = '            <div className="vis-card fade-up delay-1">'
assert body.count(x) == 1
body = body.replace(x, '            <Zoomable>{/* F-1015-382 (214): ⛶ faqat vizual — variantlar emas */}\n' + x, 1)
k = body.index('            </div>\n          </Col>\n          <Col>')
body = body[:k] + '            </div>\n            </Zoomable>\n          </Col>\n          <Col>' + body[k + len('            </div>\n          </Col>\n          <Col>'):]
s = s[:a] + body + s[b:]
r("""<p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0, paddingRight: 40 }}>{/* F-0926-06: ikki qatorli savol ⛶ tugmasi ostida qolmasin */}""", """<p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>""")
# --- 383 reja
r("""tr({ uz: <>Mashinalar endi <span className="italic" style={{ color: T.accent }}>bazada</span> yashaydi.</>, ru: <>Теперь машины живут <span className="italic" style={{ color: T.accent }}>в базе</span>.</> })""",
  """tr({ uz: <>Bugun AvtoIjara <span className="italic" style={{ color: T.accent }}>backendini</span> qurasiz.</>, ru: <>Сегодня строите <span className="italic" style={{ color: T.accent }}>backend</span> AvtoIjara.</> }) /* F-1015-383: «bazada yashaydi» — bolalarcha, olindi */""")
r("""  { t: { uz: 'Server: pool + 4 endpoint', ru: 'Сервер: pool + 4 endpoint' }, tag: 'Gemini' },""",
  """  { t: { uz: "Server va o'qish — GET", ru: 'Сервер и чтение — GET' }, tag: 'Gemini' }, // F-1015-384: 4 blok
  { t: { uz: 'Yozish — POST, PUT, DELETE', ru: 'Запись — POST, PUT, DELETE' }, tag: 'Gemini' },""")
# --- a1: psql qadamlari → Qadamlar oynasi
r("""            <div className="am-karta">
              <p className="flow-label">{tr({ uz: 'Terminalda · psql', ru: 'В терминале · psql' })}</p>
              <ol className="am-qadam">{A1_QADAM.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
            </div>""", """            <QadamTugma b={A1_QADAM} /> {/* F-1015-384: psql qadamlari — oynada (sahifa uzaymaydi) */}""")
# --- a2 → yangi a2 + a3
a = s.index('// ===== a2 — Gemini: server.js (Pool + 4 endpoint, $1 $2)')
b = s.index('\n};\n', s.index('const ScreenServer = (')) + 4
s = s[:a] + open(Q + 'f382-ekranlar.jsx', encoding='utf-8').read() + s[b:]
# eski PromptBlok — endi ishlatilmaydi
if s.count('<PromptBlok') == 0:
    a = s.index('const PromptBlok = ({ matn }) => {'); b = s.index('\n};\n', a) + 4; s = s[:a] + s[b:]
# --- DbTable: qisqa — 5 qatordan ko'p bo'lsa: birinchi 3 · «… N qator» · oxirgisi
r("""const DbTable = ({ rows, flashId, dimId }) => (
  <div className="db">
    <div className="db-cap">🗄️ <b>cars</b> <span>· {rows.length} {tr({ uz: 'qator', ru: 'строк' })}</span></div>
    <div className="db-row db-head"><span>id</span><span>nom</span><span>narx</span><span>yil</span></div>
    {rows.length ? rows.map(r => (""", """const DbTable = ({ rows, flashId, dimId, qisqa }) => {
  const kesik = qisqa && rows.length > 5; // F-1015-384: jadval cheksiz o'smaydi
  const korin = kesik ? [...rows.slice(0, 3), { _k: true }, rows[rows.length - 1]] : rows;
  return (
  <div className="db">
    <div className="db-cap">🗄️ <b>cars</b> <span>· {rows.length} {tr({ uz: 'qator', ru: 'строк' })}</span></div>
    <div className="db-row db-head"><span>id</span><span>nom</span><span>narx</span><span>yil</span></div>
    {rows.length ? korin.map(r => r._k ? <div key="kesik" className="db-row db-kesik"><span>…</span><span>{tr({ uz: `yana ${rows.length - 4} qator`, ru: `ещё ${rows.length - 4} строк` })}</span></div> : (""")
r("""    )) : <div className="db-empty">{tr({ uz: "— bo'sh (0 qator) —", ru: '— пусто (0 строк) —' })}</div>}
  </div>
);""", """    )) : <div className="db-empty">{tr({ uz: "— bo'sh (0 qator) —", ru: '— пусто (0 строк) —' })}</div>}
  </div>
  );
};""")
# --- kalitlar
r("  { id: 'a2',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // server (Gemini)\n",
  "  { id: 'a2',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-384: server + GET (Gemini)\n  { id: 'a3',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // POST, PUT, DELETE (Gemini)\n")
r("  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null }, // a3 — AI xatosi (price)", "  { id: 's10', type: 'exploration', template: 'custom',   scored: false, scope: null }, // a4 — AI xatosi (price)")
r("  const screens = [Screen0, Screen1, ScreenSxema, ScreenServer, Screen10, Screen12, ScreenPodium, Screen15];", "  const screens = [Screen0, Screen1, ScreenSxema, ScreenServer, ScreenYozish, Screen10, Screen12, ScreenPodium, Screen15]; // F-1015-384: 9 ekran")
r("""const Q_LABELS = { 5: { uz: "1 — Ko'prik (pool)", ru: '1 — Мост (pool)' } };""", """const Q_LABELS = { 6: { uz: "1 — Ko'prik (pool)", ru: '1 — Мост (pool)' } }; // F-1015-384: 9 ekranda 6-o'rin""")
r("const BLOK_ACH = { a1: 'blueprint', a2: 'director' };", "const BLOK_ACH = { a1: 'blueprint', a3: 'director' }; // F-1015-384: to'liq CRUD server — a3 da")
r("<Stage eyebrow={tr({ uz: 'Amaliyot 3 · AI xatosi', ru: 'Практика 3 · ошибка AI' })}", "<Stage eyebrow={tr({ uz: 'Amaliyot 4 · AI xatosi', ru: 'Практика 4 · ошибка AI' })}")
# RECAPS: faqat yakuniy (6) — «Ko'prik va xavfsizlik» (pool.query); qolganlari eskirgan kalitlar edi
a = s.index('const RECAPS = {'); b = s.index('\n};\n', a) + 4
blok = s[a:b]
m = re.search(r"\n  13: \{\n[\s\S]*?\n  \},?\n", blok); assert m, 'recap 13'
s = s[:a] + "// F-1015-384: ekran raqami bilan kalitlangan — faqat yakuniy (6-o'rin, pool.query) eslatmasi qoldi; eski 4/6/9/13 kalitlari 9 ekranda boshqa ekranlarga tushardi\nconst RECAPS = {\n" + m.group(0).replace('\n  13: {', '  6: {', 1).lstrip('\n').rstrip(',\n').rstrip(',') + "\n};\n" + s[b:]
# --- umumiy qismlar
s = stage_yigil(s); s = kodoyna_nur(s)
# --- CSS
i = s.index('        .am-tt-oyna {'); j = s.index('\n', i)
s = s[:j] + """
        .pk-tg { display: inline-flex; gap: 8px; flex-wrap: wrap; } /* F-1015-384: yig'iq prompt — Ko'rish + Nusxalash */
        .pk-kor { font: 700 13px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 8px 14px; cursor: pointer; }
        .pk-kor:hover { border-color: ${T.accent}; color: ${T.accent}; }
        .pk-kor:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .pk-bosh { margin: 0; font: 500 13px 'JetBrains Mono', monospace; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .am-tt-oyna.pk-oyna { width: min(680px,94vw); }
        .pk-oyna .am-masalan { margin: 0; }
        .pk-ich { align-self: flex-end; }
        .db-kesik { color: ${T.ink2}; font-style: italic; }""" + s[j:]
open(p, 'w', encoding='utf-8').write(s); print('ok 382-384')

# --- F-1015-384 qo'shimcha: GET javobi ixcham (har qator bitta satrda)
s = open(p, encoding='utf-8').read()
if 'const jsonQator' not in s:
    r("const BK_BOSH = [", "// F-1015-384: GET javobi ixcham — har qator bitta satrda (20 satrlik JSON sahifani cho'zardi)\nconst jsonQator = (rows) => '[\\n' + rows.map(r => '  ' + JSON.stringify(r).replace(/,\"/g, ', \"').replace(/\":/g, '\": ')).join(',\\n') + '\\n]';\nconst BK_BOSH = [")
    r("    if (s.m === 'GET') json = JSON.stringify(rows, null, 2);", "    if (s.m === 'GET') json = jsonQator(rows);")
    r('<Resp status={200} text="OK" json={JSON.stringify(BK_BOSH, null, 2)} />', '<Resp status={200} text="OK" json={jsonQator(BK_BOSH)} />')
    open(p, 'w', encoding='utf-8').write(s); print('ok jsonQator')
