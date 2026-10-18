# F-1015-163 (F-1017-200 topshirig'i): «asbob» 7–14-M darslaridan olinadi.
# Agent darslari (m5-10, m6-04): asbob → tool (m6-04 dagi atama; darsda «agent chaqira oladigan funksiya» deb tushuntiriladi).
# Boshqa joylar — narsaning o'z nomi (dastur / funksiya / oyna). RU «инструмент» qoladi.
import re, sys
YOZ = '--yoz' in sys.argv
ZAX = 'arxiv/F-1015-163-oldin'  # har doim zaxiradan quriladi
OLDIN = [  # aniq iboralar — umumiy almashtirishdan OLDIN
 ('src/5-Modull/BotAiAgentLesson.jsx', 'asboblar (tool — agent chaqira oladigan funksiya)', "tool'lar (agent chaqira oladigan funksiya)"),
 ('src/5-Modull/BotAiAgentLesson.jsx', 'Asbob (tool)', 'Tool'),
 ('src/6-Modull/AgentArchitectureLesson.jsx', 'tool (asbob)', 'tool'),
 ('src/6-Modull/AgentArchitectureLesson.jsx', 'Tool — agent ishlata oladigan asbob', 'Tool — agent chaqira oladigan funksiya'),
 ('src/6-Modull/AgentArchitectureLesson.jsx', 'asboblar (tool)', "tool\\'lar"),  # bitta tirnoqli satr ichida
 ('src/12-Modull/PmInvestorPitchLesson.jsx', 'const Asbob = ', 'const DasturIc = '),
 ('src/12-Modull/PmInvestorPitchLesson.jsx', '<Asbob />', '<DasturIc />'),
 ('src/12-Modull/ProductSpeedLesson.jsx', "(asbob yo'q)", "(bunday funksiyasi yo'q)"),
 ('src/6-Modull/ClaudeSkillsLesson.jsx', 'maqsad va asboblar berdik', "maqsad va tool'lar berdik"),
 ('src/6-Modull/AgentArchitectureLesson.jsx', 'uz: "Tool — agentning asbobi"', 'uz: "Tool — agent chaqiradigan funksiya"'),
 ('src/6-Modull/AgentArchitectureLesson.jsx', 'Tool — agent ishlata oladigan <span className="italic" style={{ color: T.accent }}>asbob</span>.', 'Tool — agentning <span className="italic" style={{ color: T.accent }}>ruxsatnomasi</span>.'),
 ('src/6-Modull/AgentArchitectureLesson.jsx', "Tool (o'zbekcha «asbob») — agent chaqira oladigan funksiya.", "Tool — agent chaqira oladigan funksiya."),
 ('src/6-Modull/AgentArchitectureLesson.jsx', "back: { uz: 'Tool (asbob)'", "back: { uz: 'Tool'"),
 ('src/5-Modull/BotFeedbackIterationLesson.jsx', "o'zi tanlab, asbob chaqiradi", "o'zi tanlab, tool chaqiradi"),
 ('src/6-Modull/PmLesson23.jsx', "to'liq-ekran asbob", "to'liq-ekran oyna"),
 ('src/6-Modull/PmLesson25.jsx', "to'liq-ekran asbob", "to'liq-ekran oyna"),
 ('src/5-Modull/PmLesson21.jsx', "to'liq-ekran asbob", "to'liq-ekran oyna"),
 ('src/6-Modull/PmLesson24.jsx', 'asbob-xrom', 'dastur-xrom'),
]
TOOL = {'asbob': 'tool', 'asbobni': "tool'ni", 'asboblar': "tool'lar", 'asbobini': "tool'ini", 'asboblarni': "tool'larni", 'asbobda': "tool'da",
        'asboblari': "tool'lari", 'asboblardan': "tool'lardan", 'asbobi': "tool'i"}
DASTUR = {'asbob': 'dastur', 'asbobi': 'dasturi', 'asbobni': 'dasturni', 'asboblar': 'dasturlar'}
UMUMIY = {'src/5-Modull/BotAiAgentLesson.jsx': TOOL, 'src/6-Modull/AgentArchitectureLesson.jsx': TOOL,
          'src/12-Modull/PmInvestorPitchLesson.jsx': DASTUR, 'src/12-Modull/ProductSpeedLesson.jsx': DASTUR, 'src/7-Modull/PmAnalyticsDayOneLesson.jsx': DASTUR}
def sub(s, m):
    # tirnoqni hisobga oladi: bitta tirnoqli JS satri ichida «tool'lar» → «tool\\'lar»
    out = []
    for line in s.split('\n'):
        res = []; q = None; i = 0
        while i < len(line):
            c = line[i]
            mm = re.match(r'(?i)(?<![A-Za-z])asbob[a-z]*', line[i:]) if (i == 0 or not line[i-1].isalpha()) else None
            if mm and mm.group(0).lower() in m:
                w = mm.group(0); r = m[w.lower()]
                r = r.upper() if w.isupper() else (r[0].upper() + r[1:] if w[0].isupper() else r)
                if q == "'": r = r.replace("'", "\\'")
                res.append(r); i += len(w); continue
            if q:
                if c == '\\': res.append(line[i:i+2]); i += 2; continue
                if c == q: q = None
            elif c in '\'"`': q = c
            res.append(c); i += 1
        out.append(''.join(res))
    return '\n'.join(out)
fayllar = sorted(set([o[0] for o in OLDIN] + list(UMUMIY)))
for p in fayllar:
    s = open(ZAX + '/' + p.split('/')[-1]).read() if ZAX else open(p).read(); o = open(p).read()
    for f, a, b in OLDIN:
        if f == p:
            assert s.count(a) >= 1, (p, a); s = s.replace(a, b)
    if p in UMUMIY: s = sub(s, UMUMIY[p])
    s = s.replace('ip-asbob', 'ip-dastur')
    qoldi = re.findall(r'(?i)asbob\w*', s)
    print(p, 'qoldi:', qoldi[:5])
    if YOZ and s != o: open(p, 'w').write(s)
