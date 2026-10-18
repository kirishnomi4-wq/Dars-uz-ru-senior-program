# F-1015-386 (17.10, foydalanuvchi g'oyasi — 213-qonun «bittadan»): m4-10 kirish ikki bosqichda.
# 1) «Sayt — vitrina ✂ Baza — ombor» — katta animatsiyali vizual; «Saytni ochamiz →» → u butunlay ketadi (qaytmaydi).
# 2) sayt va baza ikki keng ustunda + «Yangilash»; yangilangach savol pastdan keladi. ⛶ faqat sayt+baza (214).
p = '/home/kali/Desktop/internetLesson/src/4-Modull/FullstackConnectPracticeLesson.jsx'
s = open(p, encoding='utf-8').read()
def r(a, b):
    global s
    assert s.count(a) == 1, ('soni', s.count(a), a[:90]); s = s.replace(a, b)
assert 'F-1015-386' not in s
r("""  const [tries, setTries] = useState(0); // har bosishda so'rov-impulsi qayta o'ynaydi (key)""",
  """  const [tries, setTries] = useState(0); // har bosishda so'rov-impulsi qayta o'ynaydi (key)
  const [bosqich, setBosqich] = useState(storedAnswer ? 1 : 0); // F-1015-386 (213): 0 — sim vizuali · 1 — sayt + baza + savol
  const [ket, setKet] = useState(false);
  const ochamiz = () => { setKet(true); setTimeout(() => { setBosqich(1); setSc(n => n + 1); }, 320); };""")
# 1-bosqich: vizual katta, o'zi turadi
r("""        <div className="wire cut fade-up delay-1">""", """        {bosqich === 0 && <div className={`k0-bir ${ket ? 'k0-ket' : ''}`}>
        <div className="wire cut wire-katta fade-up delay-1">""")
a = s.index('<span className="wire-end"><span className="wire-t">{tr({ uz: \'Baza — ombor\'')
b = s.index('</div>', a) + len('</div>')
s = s[:b] + """
        <button type="button" className="btn fade-up delay-2 k0-och" onClick={ochamiz}>{tr({ uz: 'Saytni ochamiz →', ru: 'Откроем сайт →' })}</button>
        </div>}""" + s[b:]
# 2-bosqich: Split three → sayt + baza (ikki ustun), savol pastda
a = s.index('        <Zoomable>\n        <Split three>'); b = s.index('        </Split>\n        </Zoomable>', a) + len('        </Split>\n        </Zoomable>')
eski = s[a:b]
i = eski.index('          <Col>\n            <p className="eyebrow fade-up delay-3"')
j = eski.index('          </Col>\n        </Split>')
savol = eski[i + len('          <Col>\n'):j]
ikki = eski[:i].replace('<Split three>', '<Split>') + '        </Split>\n        </Zoomable>'
ikki = ikki.replace('<Win title="avtoijara.uz" minH={150} maxH={180}>', '<Win title="avtoijara.uz" minH={150} maxH={300}>')
savol = savol.replace('style={{ color: T.ink2, margin: 0, paddingRight: 40, minHeight: 36, display: \'flex\', alignItems: \'center\' }}', 'style={{ color: T.ink2, margin: 0 }}').replace("<div className=\"fade-up delay-3\" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>", '<div className="k0-opts">')
yangi = ("        {bosqich === 1 && <div className=\"k0-iki fade-up\">\n" + ikki + "\n        {tried && <div className=\"k0-savol fade-up\">{/* F-1015-386: savol yangilangandan keyin keladi */}\n" + savol + "        </div>}\n        </div>}")
s = s[:a] + yangi + s[b:]
# CSS
i = s.index('        .wire-lbl {'); j = s.index('\n', i)
s = s[:j] + """
        .wire.wire-katta { padding: clamp(22px,4vw,40px) clamp(18px,3vw,32px); gap: clamp(14px,3vw,30px); } /* F-1015-386: 1-bosqich — vizual o'zi turadi */
        .wire-katta .wire-t { font-size: clamp(15px,1.8vw,19px); } .wire-katta .wire-t small { font-size: 12px; margin-top: 4px; }
        .wire-katta .wire-seg { height: 4px; } .wire-katta .wire-cut-mark { font-size: 22px; } .wire-katta .wire-lbl { font-size: 12px; margin-top: 6px; }
        .k0-bir { display: flex; flex-direction: column; align-items: center; gap: 16px; transition: opacity 0.3s ease, transform 0.3s ease; } .k0-bir > .wire { align-self: stretch; }
        .k0-bir.k0-ket { opacity: 0; transform: translateY(-10px); }
        .k0-iki { display: flex; flex-direction: column; gap: clamp(12px,2vw,18px); }
        .k0-savol { display: flex; flex-direction: column; gap: 10px; }
        .k0-opts { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 9px; } @media (max-width: 760px) { .k0-opts { grid-template-columns: 1fr; } }
        @media (prefers-reduced-motion: reduce) { .k0-bir { transition: none; } }""" + s[j:]
open(p, 'w', encoding='utf-8').write(s); print('ok 386')
# (2-qadam, o'sha kun) sarlavhalar bir xil tuzilishda (371 tekislash ko'rinmas joy qo'shmasin) · sayt to'liq, 2 ustunli kartochka · 1-bosqich Mentor'ida «yangilang» yo'q
# — joyida qo'llangan, kod: src/4-Modull/FullstackConnectPracticeLesson.jsx Screen0 (F-1015-386 izohlari).
