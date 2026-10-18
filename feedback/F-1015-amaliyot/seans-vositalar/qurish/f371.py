# F-1015-371/372 (17.10, foydalanuvchi «ha ha»): hamma praktikada — «Qadamlar» oyna, ikki ustun bir chiziqdan.
# m3-11 ga 363/364/366/368 ham: a1 — kod qatorlari yonadi, Mentor bosishda yig'iladi; a2 — kod oynasi o'ngga (prompt ostiga), prompt yig'iladi, «Tekshiring» chapga.
import sys, re
sys.path.insert(0, '/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish')
from praktika_ux import qadam_oyna, ustun_tekis, hammasi, kodoyna_nur
ROOT = '/home/kali/Desktop/internetLesson/'
FAYLLAR = open(sys.argv[1]).read().split() if len(sys.argv) > 1 else []
for f in FAYLLAR:
    s = open(ROOT + f, encoding='utf-8').read(); t = ustun_tekis(s)
    if 'const QadamTugma' in t: t = qadam_oyna(t)
    open(ROOT + f, 'w', encoding='utf-8').write(t); print('ok' if t != s else '=', f)

# ---------- m3-11 ----------
p = ROOT + 'src/3-Modull/ReactRouterPracticeLesson.jsx'
s = open(p, encoding='utf-8').read()
def r(a, b):
    global s
    assert s.count(a) == 1, ('topilmadi/takror', a[:90]); s = s.replace(a, b)
if 'F-1015-371 m3-11' not in s:
    s = hammasi(s, prompt=True, stage=True); s = kodoyna_nur(s)
    def ekran(nom, stage_eski):
        global s
        a = s.find('const ' + nom + ' = ('); b = s.find('\n};\n', a); body = s[a:b]
        body = body.replace("  const [oxirgi, setOxirgi] = useState('');", "  const [oxirgi, setOxirgi] = useState('');\n  const [nur, setNur] = useState(0); // F-1015-371 m3-11: har bosishda kod oynasi yonadi\n  const kodRef = useRef(null);\n  const korsat = () => setTimeout(() => { const el = kodRef.current; if (!el) return; const r = el.getBoundingClientRect(); if (r.top < 0 || r.bottom > window.innerHeight) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 420);\n  const setOx = (v) => { setOxirgi(v); setNur(n => n + 1); korsat(); };", 1)
        n_eski = body.count('setOxirgi(') - 1  # e'londagi setOxirgi( yo'q — tekshiruv
        body = re.sub(r'(?<![\w.])setOxirgi\(', 'setOx(', body).replace('const setOx = (v) => { setOx(v);', 'const setOx = (v) => { setOxirgi(v);')
        assert stage_eski in body, nom
        body = body.replace(stage_eski, stage_eski.replace('<Stage eyebrow', '<Stage mentorYigil eyebrow'), 1)
        s = s[:a] + body + s[b:]
    ekran('ScreenRoutes', """<Stage eyebrow={tr({ uz: "Amaliyot 1 · AI'siz", ru: 'Практика 1 · без AI' })}""")
    ekran('ScreenSahifalar', """<Stage eyebrow={tr({ uz: 'Amaliyot 2 · Gemini', ru: 'Практика 2 · Gemini' })}""")
    # a1: KodOyna nur + ref (chapda qoladi)
    r("""            <KodOyna oxirgi={oxirgi} qatorlar={[<span key="u">URL = "{urlOf(path, id)}";</span>""", """            <div ref={kodRef}><KodOyna oxirgi={oxirgi} nur={nur} qatorlar={[<span key="u">URL = "{urlOf(path, id)}";</span>""")
    i = s.find('<div ref={kodRef}><KodOyna oxirgi={oxirgi} nur={nur} qatorlar={[<span key="u">'); j = s.find('/>\n', i)
    s = s[:j] + '/></div>\n' + s[j + 3:]
    # a2: kod o'ngga, prompt yig'iladi, Tekshiring chapga
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
""", tek.replace('<div className="am-karta">', '<div className="am-karta"> {/* F-1015-371 m3-11 (368 kabi): «Tekshiring» ilova ostida */}', 1) + """          </Col>
          <Col>
            <PromptBlok matn={a2Prompt()} yigil onYigil={() => setYig(y => y + 1)} />
            <div ref={kodRef} key={'k' + yig} className={yig ? 'sk-kotar' : ''}><KodOyna oxirgi={oxirgi} nur={nur} qatorlar={qatorlar} /></div>
""")
    a = s.find('const ScreenSahifalar = ('); k = s.find("  const kodRef = useRef(null);", a)
    s = s[:k] + "  const [yig, setYig] = useState(0);\n" + s[k:]
    open(p, 'w', encoding='utf-8').write(s); print('ok m3-11')
