# F-1015-375 (17.10): m3-12 ReactProjectDay — m2-12/m3-07/m3-11 da tasdiqlangan ko'rinish (363/364/366/368):
# a1, a2 — kod oynasi o'ngga (prompt ostiga), prompt nusxalangach yig'iladi, har bosishda kod qatorlari yonadi, Mentor bosishda yig'iladi; a2 «Tekshiring» chapga (ilova ostiga).
import sys, re
sys.path.insert(0, '/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish')
from praktika_ux import hammasi, kodoyna_nur
p = '/home/kali/Desktop/internetLesson/src/3-Modull/ReactProjectDayLesson.jsx'
s = open(p, encoding='utf-8').read()
def r(a, b):
    global s
    assert s.count(a) == 1, ('topilmadi/takror', a[:90]); s = s.replace(a, b)
if 'F-1015-375' not in s:
    s = hammasi(s, prompt=True, stage=True); s = kodoyna_nur(s)
    def ekran(nom, stage_eski):
        global s
        a = s.find('const ' + nom + ' = ('); b = s.find('\n};\n', a); body = s[a:b]
        mk = re.search(r"(?m)^  const \[oxirgi, setOxirgi\] = useState\([^\n]*\);$", body); assert mk, nom
        k = mk.group(0)
        body = body.replace(k, k + "\n  const [nur, setNur] = useState(0); // F-1015-375: har bosishda kod oynasi yonadi\n  const [yig, setYig] = useState(0);\n  const kodRef = useRef(null);\n  const korsat = () => setTimeout(() => { const el = kodRef.current; if (!el) return; const r = el.getBoundingClientRect(); if (r.top < 0 || r.bottom > window.innerHeight) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 420);\n  const setOx = (v) => { setOxirgi(v); setNur(n => n + 1); korsat(); };", 1)
        body = re.sub(r'(?<![\w.])setOxirgi\(', 'setOx(', body).replace('const setOx = (v) => { setOx(v);', 'const setOx = (v) => { setOxirgi(v);')
        assert stage_eski in body, nom
        body = body.replace(stage_eski, stage_eski.replace('<Stage eyebrow', '<Stage mentorYigil eyebrow'), 1)
        s = s[:a] + body + s[b:]
    ekran('ScreenKatalog', "<Stage eyebrow={tr({ uz: 'Amaliyot 1 · Gemini', ru: 'Практика 1 · Gemini' })}")
    ekran('ScreenIjara', "<Stage eyebrow={tr({ uz: 'Amaliyot 2 · Gemini', ru: 'Практика 2 · Gemini' })}")
    KOD = "            <div ref={kodRef} key={'k' + yig} className={yig ? 'sk-kotar' : ''}><KodOyna oxirgi={oxirgi} nur={nur} qatorlar={qatorlar} /></div>\n"
    # a1
    r("""            <KodOyna oxirgi={oxirgi} qatorlar={qatorlar} />
          </Col>
          <Col>
            <KodNusxa yorliq={{ uz: 'public/cars.json', ru: 'public/cars.json' }} kod={carsJson()} />
            <PromptBlok matn={a1Prompt()} />
""", """          </Col>
          <Col>
            <KodNusxa yorliq={{ uz: 'public/cars.json', ru: 'public/cars.json' }} kod={carsJson()} />
            <PromptBlok matn={a1Prompt()} yigil onYigil={() => setYig(y => y + 1)} /> {/* F-1015-375: kod oynasi prompt ostida */}
""" + KOD)
    # a2
    tek = """            <div className="am-karta">
              <p className="flow-label">{tr({ uz: 'Tekshiring', ru: 'Проверьте' })}</p>
              <ul className="am-band">{A2_TEKSHIR.map((x, i) => <li key={i}>{fmtCode(tr(x))}</li>)}</ul>
            </div>
"""
    r(tek, '')
    r("""            <KodOyna oxirgi={oxirgi} qatorlar={qatorlar} />
          </Col>
          <Col>
            <PromptBlok matn={a2Prompt()} />
""", tek.replace('<div className="am-karta">', '<div className="am-karta"> {/* F-1015-375 (368 kabi): «Tekshiring» ilova ostida */}', 1) + """          </Col>
          <Col>
            <PromptBlok matn={a2Prompt()} yigil onYigil={() => setYig(y => y + 1)} />
""" + KOD)
    open(p, 'w', encoding='utf-8').write(s); print('ok 375')
