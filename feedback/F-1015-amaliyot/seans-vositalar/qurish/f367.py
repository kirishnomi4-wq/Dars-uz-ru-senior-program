# F-1015-367…369 (17.10, foydalanuvchi «ha · A · ha»):
# 367 m3-07 a1 — o'yin tanlash qatori ilova oynasi ichiga (ro'yxat tepasi); chap va o'ng ustun bir xil boshlanadi.
# 368 m3-07 a2 — «Tekshiring» chapga, ilova ostiga (o'ng ustun uzun, chap bo'sh edi).
# 369 harf qoidasi: haqiqiy kodda harf ahamiyatsiz joy — har qanday harf/qo'shtirnoq; JS farqlaydigan joy — qabul yo'q, lekin aniq izoh.
#     m3-07 s14, m3-12 s14 — «faqat harf farqi» izohi; m3-11 s14 — path "/Add" va '/add' ham qabul.
import re
R = '/home/kali/Desktop/internetLesson/src/3-Modull/'
def ochiq(n): return open(R + n, encoding='utf-8').read()
def yoz(n, s): open(R + n, 'w', encoding='utf-8').write(s)
def r(s, a, b):
    assert s.count(a) == 1, ('topilmadi/takror', a[:90]); return s.replace(a, b)
HARF = """{caseOnly && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Deyarli to'g'ri! JavaScript <b>katta-kichik harfni farqlaydi</b>: SOZ — aynan shunday yozing.</>, ru: <>Почти верно! JavaScript <b>различает заглавные и строчные буквы</b>: пишите именно SOZ.</> })}</p></div>}
            """

# ---------- m3-07 ----------
n = 'ReactCrudPracticeLesson.jsx'; s = ochiq(n)
m = re.search(r'\n            <p className="flow-label">\{tr\(\{ uz: "Qo\'shish uchun tanlang", ru: \'Выберите, что добавить\' \}\)\}</p>\n            (<div className="am-chips">[^\n]*</div>)\n            <Win title="robo-games — localhost:5173" minH=\{110\}>\n', s)
assert m, '367 a1'
chips = m.group(1).replace('<div className="am-chips">', '<div className="am-chips cr-qosh">', 1)
s = s[:m.start()] + '\n            <p className="flow-label">{tr({ uz: "Ilova · bosib qo\'shing", ru: \'Приложение · нажмите, чтобы добавить\' })}</p>\n            <Win title="robo-games — localhost:5173" minH={110}>\n              ' + chips + ' {/* F-1015-367: tanlash qatori ilova ichida — ro\'yxat tepasidagi «+ qo\'shish» (2-qadam) kabi; ustunlar bir xil boshlanadi */}\n' + s[m.end():]
# 368
tek = """            <div className="am-karta">
              <p className="flow-label">{tr({ uz: 'Tekshiring', ru: 'Проверьте' })}</p>
              <ul className="am-band">{A2_TEKSHIR.map((x, i) => <li key={i}>{fmtCode(tr(x))}</li>)}</ul>
            </div>
"""
s = r(s, tek, '')
s = r(s, """              {!list.length && <button type="button" className="am-chip" onClick={() => { setList(GAMES.slice()); setOxirgi(''); }}>{tr({ uz: '↺ Boshidan', ru: '↺ Сначала' })}</button>}
            </Win>
""", """              {!list.length && <button type="button" className="am-chip" onClick={() => { setList(GAMES.slice()); setOxirgi(''); }}>{tr({ uz: '↺ Boshidan', ru: '↺ Сначала' })}</button>}
            </Win>
""" + tek.replace('<div className="am-karta">', '<div className="am-karta"> {/* F-1015-368: «Tekshiring» ilova ostida — u ilovani tekshirish haqida; ustunlar tenglashadi */}', 1))
# 369
s = r(s, "  const valid = /^setGames\\(\\s*games\\s*\\.\\s*filter\\(\\s*\\(?\\s*([A-Za-z_]\\w*)\\s*\\)?\\s*=>\\s*\\1\\s*\\.\\s*id\\s*!==?\\s*id\\s*\\)\\s*\\)\\s*;?$/.test(norm);",
      "  const RE = /^setGames\\(\\s*games\\s*\\.\\s*filter\\(\\s*\\(?\\s*([A-Za-z_]\\w*)\\s*\\)?\\s*=>\\s*\\1\\s*\\.\\s*id\\s*!==?\\s*id\\s*\\)\\s*\\)\\s*;?$/;\n  const valid = RE.test(norm);\n  const caseOnly = !valid && new RegExp(RE.source, 'i').test(norm); // F-1015-369: faqat harf farqi — JS farqlaydi, qabul yo'q, aniq izoh")
s = r(s, "            {passed && <div className=\"frame-success fade-step\"><p className=\"body\" style={{ margin: 0, color: T.ink }}>{tr({ uz: \"✓ Mukammal! O'chirish ishladi",
      HARF.replace('SOZ', '<span className="mono">setGames</span>, <span className="mono">filter</span>, <span className="mono">id</span>') + "{passed && <div className=\"frame-success fade-step\"><p className=\"body\" style={{ margin: 0, color: T.ink }}>{tr({ uz: \"✓ Mukammal! O'chirish ishladi")
s = r(s, "        .frame-warn {", "        .cr-qosh { margin-bottom: 10px; } /* F-1015-367 */\n        .frame-warn {")
yoz(n, s)

# ---------- m3-12 ----------
n = 'ReactProjectDayLesson.jsx'; s = ochiq(n)
s = r(s, "  const valid = /^b\\.(car\\.)?price\\s*\\*\\s*b\\.days$|^b\\.days\\s*\\*\\s*b\\.(car\\.)?price$/.test(norm);",
      "  const RE = /^b\\.(car\\.)?price\\s*\\*\\s*b\\.days$|^b\\.days\\s*\\*\\s*b\\.(car\\.)?price$/;\n  const valid = RE.test(norm);\n  const caseOnly = !valid && new RegExp(RE.source, 'i').test(norm); // F-1015-369: faqat harf farqi — JS farqlaydi, qabul yo'q, aniq izoh")
i = s.find('{passed && <div className="frame-success fade-step"><p className', s.find('const caseOnly')); assert i > 0
s = s[:i] + HARF.replace('SOZ', '<span className="mono">b.price</span>, <span className="mono">b.days</span>') + s[i:]
yoz(n, s)

# ---------- m3-11 ----------
n = 'ReactRouterPracticeLesson.jsx'; s = ochiq(n)
s = r(s, "  const norm = value.replace(/\\s+/g, ' ').trim();\n  const valid = /^<\\s*Route\\s+path",
      "  // F-1015-369: React Router manzilni katta-kichik harfga qaramay topadi va JSX'da ' ham \" ham to'g'ri — \"/Add\", '/add' ham qabul\n  const norm = value.replace(/[\\u2018\\u2019\\u201C\\u201D']/g, '\"').replace(/\"\\/add\"/i, '\"/add\"').replace(/\\s+/g, ' ').trim();\n  const valid = /^<\\s*Route\\s+path")
s = r(s, "  const hasPath = /path\\s*=\\s*\"\\/add\"/.test(value);", "  const hasPath = /path\\s*=\\s*\"\\/add\"/.test(norm);")
s = r(s, "  const hasElement = /element\\s*=\\s*\\{\\s*<\\s*AddPage\\s*\\/?\\s*>\\s*\\}/.test(value);",
      "  const hasElement = /element\\s*=\\s*\\{\\s*<\\s*AddPage\\s*\\/?\\s*>\\s*\\}/.test(value);\n  const caseOnly = !valid && hasRoute && /element\\s*=\\s*\\{\\s*<\\s*addpage\\s*\\/?\\s*>/i.test(value) && !hasElement; // F-1015-369: komponent nomi katta harf bilan")
i = s.find('{passed && <div className="frame-success fade-step"><p class', s.find('const caseOnly')); assert i > 0
s = s[:i] + HARF.replace('SOZ', '<span className="mono">{\'<AddPage />\'}</span>') + s[i:]
yoz(n, s)
print('ok 367-369')
