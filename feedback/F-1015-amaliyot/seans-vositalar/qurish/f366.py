# F-1015-366 (17.10): m3-07 ReactCrudPractice — m2-12 da tasdiqlangan 362–364 ko'rinishi.
# reja: «Avval tayyorlaning» oyna · a1: Mentor bosishda yig'iladi, kod qatorlari yonadi (kod oynasi chapda qoladi — ilova ostida, sig'adi)
# a2: kod oynasi o'ngga (prompt ostiga), prompt nusxalangach yig'iladi, qatorlar yonadi, Mentor yig'iladi. Joyida, f344.py dan keyin.
import sys
sys.path.insert(0, '/home/kali/Desktop/internetLesson/feedback/F-1015-amaliyot/seans-vositalar/qurish')
from praktika_ux import hammasi
p = sys.argv[1] if len(sys.argv) > 1 else '/home/kali/Desktop/internetLesson/src/3-Modull/ReactCrudPracticeLesson.jsx'
s = open(p, encoding='utf-8').read()
def r(a, b):
    global s
    assert s.count(a) == 1, ('topilmadi/takror', a[:80])
    s = s.replace(a, b)
s = hammasi(s, prompt=True, stage=True)

# KodOyna — nur (har bosishda o'zgargan qatorlar + sarlavha yonadi)
r("""const KodOyna = ({ oxirgi, qatorlar }) => (
  <div className="rj-oyna">
    <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span>""",
"""const KodOyna = ({ oxirgi, qatorlar, nur = 0 }) => (
  <div className="rj-oyna">
    <div key={'b' + nur} className={`rj-bar ${nur ? 'sk-bar-nur' : ''}`}><span className="bb-dots"><i /><i /><i /></span>""")
r("""      <div key={oxirgi} className="rj-li sk-nur">{oxirgi || '—'}</div>
      <div className="sk-izoh">// {tr({ uz: 'hozir', ru: 'сейчас' })}</div>
      {qatorlar.map((q, i) => <div key={i} className="rj-li">{q}</div>)}""",
"""      <div key={'o' + nur} className={`rj-li ${nur ? 'sk-nur' : ''}`}>{oxirgi || '—'}</div>
      <div className="sk-izoh">// {tr({ uz: 'hozir', ru: 'сейчас' })}</div>
      {qatorlar.map((q, i) => <div key={i + '-' + nur} className={`rj-li ${nur ? 'sk-nur' : ''}`}>{q}</div>)}""")

# a1
r("""  const qosh = (p) => { setList(l => [...l, p]); setOxirgi(`setGames([...games, { id: ${p.id}, name: "${p.name}" }]);`); };
  const qaytar = () => { setList(GAMES.slice(0, 2)); setOxirgi(''); };""",
"""  const [nur, setNur] = useState(0); // F-1015-366: har bosishda kod oynasi yonadi
  const qosh = (p) => { setList(l => [...l, p]); setOxirgi(`setGames([...games, { id: ${p.id}, name: "${p.name}" }]);`); setNur(n => n + 1); };
  const qaytar = () => { setList(GAMES.slice(0, 2)); setOxirgi(''); setNur(n => n + 1); };""")
r("""    <Stage eyebrow={tr({ uz: "Amaliyot 1 · AI'siz", ru: 'Практика 1 · без AI' })} screen={screen} navContent""",
"""    <Stage mentorYigil eyebrow={tr({ uz: "Amaliyot 1 · AI'siz", ru: 'Практика 1 · без AI' })} screen={screen} navContent""")
r("""            <KodOyna oxirgi={oxirgi} qatorlar={[<>{nomlar(list)}  <span className="sk-izoh">// games.length = {list.length}</span></>]} />""",
"""            <KodOyna oxirgi={oxirgi} nur={nur} qatorlar={[<>{nomlar(list)}  <span className="sk-izoh">// games.length = {list.length}</span></>]} />""")

# a2
r("""  const top = (g) => { setList(l => l.map(x => (x.id === g.id ? { ...x, top: !x.top } : x))); setOxirgi(`setGames(games.map(g => g.id === ${g.id} ? { ...g, top: !g.top } : g));`); };
  const ochir = (g) => { setList(l => l.filter(x => x.id !== g.id)); setOxirgi(`setGames(games.filter(g => g.id !== ${g.id}));`); };""",
"""  const [nur, setNur] = useState(0); // F-1015-366: har bosishda kod oynasi yonadi
  const [yig, setYig] = useState(0);
  const kodRef = useRef(null);
  const korsat = () => setTimeout(() => { const el = kodRef.current; if (!el) return; const b = el.getBoundingClientRect(); if (b.top < 0 || b.bottom > window.innerHeight) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 420); // Mentor yig'ilib bo'lgach — kerak bo'lsagina suriladi
  const top = (g) => { setList(l => l.map(x => (x.id === g.id ? { ...x, top: !x.top } : x))); setOxirgi(`setGames(games.map(g => g.id === ${g.id} ? { ...g, top: !g.top } : g));`); setNur(n => n + 1); korsat(); };
  const ochir = (g) => { setList(l => l.filter(x => x.id !== g.id)); setOxirgi(`setGames(games.filter(g => g.id !== ${g.id}));`); setNur(n => n + 1); korsat(); };""")
r("""    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · Gemini', ru: 'Практика 2 · Gemini' })} screen={screen} navContent""",
"""    <Stage mentorYigil eyebrow={tr({ uz: 'Amaliyot 2 · Gemini', ru: 'Практика 2 · Gemini' })} screen={screen} navContent""")
r("""            <KodOyna oxirgi={oxirgi} qatorlar={[<>{nomlar(list)}</>, <>top: [{toplar.join(', ')}];  <span className="sk-izoh">// games.length = {list.length}</span></>]} />
          </Col>
          <Col>
            <PromptBlok matn={a2Prompt()} />""",
"""          </Col>
          <Col>
            <PromptBlok matn={a2Prompt()} yigil onYigil={() => setYig(y => y + 1)} />
            <div ref={kodRef} key={'k' + yig} className={yig ? 'sk-kotar' : ''}><KodOyna oxirgi={oxirgi} nur={nur} qatorlar={[<>{nomlar(list)}</>, <>top: [{toplar.join(', ')}];  <span className="sk-izoh">// games.length = {list.length}</span></>]} /></div>""")
open(p, 'w', encoding='utf-8').write(s); print('ok 366')
