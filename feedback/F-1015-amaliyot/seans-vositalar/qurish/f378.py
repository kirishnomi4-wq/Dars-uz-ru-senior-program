# F-1015-378…380 (17.10, foydalanuvchi suratlari): m3-13 ReactBuildSite.
# 378 kirish — sayt to'liq (maxH yo'q), ⛶ faqat saytni o'raydi (variantlar emas). 379 a1 — sayt oynasi 250 → 400; ⛶ da sayt aylantirishsiz (daraxt yonida qoladi).
# Umumiy: .zoom-on ichida .bp-body max-height/overflow yo'q. 380 yakuniy — 211: harf farqi izohi; boshqa narsa yozilsa — «function» bilan boshlanadi izohi.
p = '/home/kali/Desktop/internetLesson/src/3-Modull/ReactBuildSiteLesson.jsx'
s = open(p, encoding='utf-8').read()
def r(a, b):
    global s
    assert s.count(a) == 1, ('soni', s.count(a), a[:90]); s = s.replace(a, b)
assert 'F-1015-378' not in s
# 378 — kirish
a = s.index('const Screen0 = ('); b = s.index('\n};\n', a); body = s[a:b]
assert body.count('        <Zoomable>\n        <Split>') == 1 and body.count('        </Split>\n        </Zoomable>') == 1
body = body.replace('        <Zoomable>\n        <Split>', '        <Split>', 1).replace('        </Split>\n        </Zoomable>', '        </Split>', 1)
x = """            <Win title="Yetkaz — localhost:5173" minH={150} maxH={230}>
              <HomePreview outline={split} />
            </Win>"""
assert body.count(x) == 1
body = body.replace(x, """            <Zoomable>{/* F-1015-378: ⛶ faqat saytni o'raydi; sayt to'liq — bo'laklarga ajratilganda hammasi ko'rinsin */}
            <Win title="Yetkaz — localhost:5173" minH={150}>
              <HomePreview outline={split} />
            </Win>
            </Zoomable>""", 1)
s = s[:a] + body + s[b:]
# 379 — a1
r('            <Win title="Yetkaz · Bosh — localhost:5173" minH={150} maxH={250}>', '            <Win title="Yetkaz · Bosh — localhost:5173" minH={150} maxH={400}>{/* F-1015-379: 250 → 400; ⛶ da aylantirishsiz */}')
# umumiy CSS — ⛶ ichida sayt oynasi aylanmaydi
i = s.index('        .zoom-on {'); j = s.index('\n', i)
s = s[:j] + "\n        .zoom-on .bp-body { max-height: none !important; overflow: visible !important; } /* F-1015-378/379: kattalashtirilganda sayt aylantirishsiz to'liq */" + s[j:]
# 380 — yakuniy
r("""  const lowerName = /\\bfunction\\s+[a-z]/.test(value);""", """  const lowerName = /\\bfunction\\s+[a-z]/.test(value);
  const caseOnly = !valid && !lowerName && /^function\\s+[A-Za-z][A-Za-z0-9]*\\s*\\(\\s*props\\s*\\)\\s*\\{?$/i.test(norm); // F-1015-380 (211): faqat harf farqi — JS farqlaydi, aniq izoh
  const boshqa = !valid && norm.length >= 6 && !/^function\\b/i.test(norm); // F-1015-380: umuman boshqa narsa yozilsa — jim qolmaydi""")
r("""            {lowerName && <div className="frame-warn fade-step">""", """            {caseOnly && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Deyarli to'g'ri! JavaScript <b>katta-kichik harfni farqlaydi</b>: <span className="mono">function</span> va <span className="mono">props</span> — kichik harf bilan, nom — Katta harf bilan.</>, ru: <>Почти верно! JavaScript <b>различает заглавные и строчные буквы</b>: <span className="mono">function</span> и <span className="mono">props</span> — строчными, имя — с Заглавной.</> })}</p></div>}
            {boshqa && <div className="frame-warn fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Komponent <span className="mono">function</span> kalit so'zi bilan boshlanadi — «Birinchi komponent» darsidagi <span className="mono">GameCard</span> kabi: kalit so'z, nom, qavsda <span className="mono">props</span>, ochuvchi <span className="mono">{'{'}</span>.</>, ru: <>Компонент начинается с ключевого слова <span className="mono">function</span> — как <span className="mono">GameCard</span> в уроке «Первый компонент»: ключевое слово, имя, <span className="mono">props</span> в скобках, открывающая <span className="mono">{'{'}</span>.</> })}</p></div>}
            {lowerName && <div className="frame-warn fade-step">""")
open(p, 'w', encoding='utf-8').write(s); print('ok 378-380')
