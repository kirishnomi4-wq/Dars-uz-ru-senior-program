# F-1015-377 (17.10, foydalanuvchi «taklifing maqul»): m3-13 ReactBuildSite.
# 1) Reja: «Yo'l — 4 qadam» olindi (Bugungi 4 blok bilan takror). 2) a4: g'oya tanlanmaguncha bitta ustun (bo'sh o'ng ustun yo'q); «VS Code'da» qadamlari → «Qadamlar» oynasi;
#    prompt to'liq qoladi (Gemini darsdagi kartani ko'rmaydi). 3) a3: ⛶ olindi (matnli variantlar yonida osilib turardi; 206-qonun).
p = '/home/kali/Desktop/internetLesson/src/3-Modull/ReactBuildSiteLesson.jsx'
s = open(p, encoding='utf-8').read()
def r(a, b, n=1):
    global s
    assert s.count(a) == n, ('soni', s.count(a), a[:90]); s = s.replace(a, b)
assert 'F-1015-377' not in s
# 1
r("""            <p className="flow-label">{tr({ uz: "Yo'l — 4 qadam", ru: 'Путь — 4 шага' })}</p>
            <ol className="am-blok-qator">{YO_L.map((x, i) => <li key={i}><span className="am-blok-n">{i + 1}</span><b>{tr(x)}</b></li>)}</ol>
            <hr className="am-chiziq" />
""", "            {/* F-1015-377: «Yo'l — 4 qadam» olindi — «Bugungi 4 blok» bilan takror edi */}\n")
if s.count('YO_L') == 1:  # faqat e'lon qolgan bo'lsa — o'lik
    import re
    m = re.search(r'\nconst YO_L = \[[\s\S]*?\n\];\n', s); assert m; s = s[:m.start()] + '\n' + s[m.end():]
# 2 — a4
a = s.index('const ScreenOzSayt = ('); b = s.index('\n};\n', a)
body = s[a:b]
def rb(x, y):
    global body
    assert body.count(x) == 1, ('a4', x[:80]); body = body.replace(x, y)
rb("""        <Split>
          <Col>
            <p className="flow-label">{tr({ uz: "G'oyani tanlang", ru: 'Выберите идею' })}</p>
""", """        {/* F-1015-377: g'oya tanlanmaguncha bitta ustun — bo'sh o'ng ustun yo'q */}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p className="flow-label">{tr({ uz: "G'oyani tanlang", ru: 'Выберите идею' })}</p>
""")
i = body.index("            {tanlov === 'oz' && <div className=\"am-karta am-ochil\">")
j = body.index("            {g && <div className=\"am-karta am-ochil\">")
oz_form = body[i:j]
body = body[:i] + body[j:]
rb("""            {g && <div className="am-karta am-ochil">
              <p className="flow-label">""", oz_form + """        </div>
        {g && <Split>
          <Col>
            <div className="am-karta am-ochil">
              <p className="flow-label">""")
rb("""              </ul>
            </div>}
            {g && <div className="am-karta">
              <p className="flow-label">{tr({ uz: "VS Code'da", ru: 'В VS Code' })}</p>
              <ol className="am-qadam">{[""", """              </ul>
            </div>
            <QadamTugma b={[""")
rb("""              ].map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
            </div>}
          </Col>
          <Col>
            {g ? <PromptBlok matn={ozPrompt(g)} /> : <p className="small" style={{ margin: 0, opacity: 0.6, textAlign: 'center', padding: '24px 0' }}>{tr({ uz: "(g'oya hali tanlanmadi)", ru: '(идея пока не выбрана)' })}</p>}
          </Col>
        </Split>""", """            ]} /> {/* F-1015-377: «VS Code'da» qadamlari — «Qadamlar» oynasi (boshqa darslardagidek) */}
          </Col>
          <Col>
            <PromptBlok matn={ozPrompt(g)} />
          </Col>
        </Split>}""")
s = s[:a] + body + s[b:]
# 3 — a3 ⛶
a = s.index('const Screen10 = ('); b = s.index('\n};\n', a)
body = s[a:b]
assert body.count('        <Zoomable>\n        <div className="split">') == 1 and body.count('        </div>\n        </Zoomable>') == 1
body = body.replace('        <Zoomable>\n        <div className="split">', '        {/* F-1015-377: ⛶ olindi — matnli variantlar yonida osilib turardi (206-qonun) */}\n        <div className="split">', 1).replace('        </div>\n        </Zoomable>', '        </div>', 1)
s = s[:a] + body + s[b:]
open(p, 'w', encoding='utf-8').write(s); print('ok 377')
