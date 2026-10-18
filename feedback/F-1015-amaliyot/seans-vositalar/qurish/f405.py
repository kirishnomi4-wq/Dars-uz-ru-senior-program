# F-1015-405: m4c-05 03/07 «Copilot bilan tuzatish» — boshlang'ich holat bo'sh edi (chapda faqat tugma, o'ng ustun bo'sh; F-399/403 sinfi).
# Endi: jurnal oynasi boshidanoq blur-qulf ostida (F-400 kabi), «Jurnalni ochish» ochadi; o'ngda «Copilot'ga so'rov» + 2 so'rov kartasi xira,
# jurnal ochilgach faollashadi. Mexanika/bosqichlar o'zgarmadi. Zaxira: arxiv/F-1015-405-oldin/. Qayta yurgizilmaydi.
import pathlib
P = pathlib.Path('/home/kali/Desktop/internetLesson/src/4c-Modull/AiPipelineProjectLesson.jsx')
s = P.read_text()
def rep(old, new):
    global s
    assert s.count(old) == 1, (s.count(old), old[:90]); s = s.replace(old, new)

# chap: jurnal boshidanoq, lekin qulf ostida
rep("""            {phase !== 'log' && <div className="belt-log">
              {USTA_LOG.map((l, i) => <div key={i} className={`belt-log-line ${l.tone}`} style={{ animationDelay: `${i * 120}ms` }}>{tr(l.t)}</div>)}
            </div>}
""",
"""            {/* F-1015-405: jurnal boshidanoq ko'rinadi — ochilguncha blur-qulf (o'qilmaydi), ustun bo'sh turmaydi */}
            <div className={`belt-log ${phase === 'log' ? 'locked' : ''}`} aria-hidden={phase === 'log'}>
              {USTA_LOG.map((l, i) => <div key={i} className={`belt-log-line ${l.tone}`} style={{ animationDelay: `${i * 120}ms` }}>{tr(l.t)}</div>)}
            </div>
""")
# o'ng: so'rov bosqichi qulf-holatda ham ko'rinadi (tugmalar disabled allaqachon phase !== 'ask')
rep("""            {phase === 'ask' && (
              <>
                <p className="flow-label">{tr({ uz: "Copilot'ga so'rov", ru: 'Запрос Copilot' })}</p>""",
"""            {(phase === 'log' || phase === 'ask') && (
              <div className={`ask-wrap ${phase === 'log' ? 'locked' : ''}`}>{/* F-1015-405: jurnal ochilguncha xira */}
                <p className="flow-label">{tr({ uz: "Copilot'ga so'rov", ru: 'Запрос Copilot' })}</p>""")
rep("""              </>
            )}
            {phase === 'suggest' && (""",
"""                {phase === 'log' && <p className="ask-locked-note">{tr({ uz: 'avval jurnalni oching ←', ru: 'сначала откройте журнал ←' })}</p>}
              </div>
            )}
            {phase === 'suggest' && (""")
# CSS
rep("        .belt-log { background: ${CODE.bg};",
    "        .belt-log.locked .belt-log-line { filter: blur(5px); opacity: 0.6; user-select: none; } /* F-1015-405: qulf-holat */\n"
    "        .ask-wrap { display: flex; flex-direction: column; gap: 10px; }\n"
    "        .ask-wrap.locked { opacity: 0.55; } /* F-1015-405: jurnal ochilguncha xira */\n"
    "        .ask-wrap.locked .btn-soft { pointer-events: none; }\n"
    "        .ask-locked-note { margin: 0; font-size: 13px; font-style: italic; color: ${T.ink2}; }\n"
    "        .belt-log { background: ${CODE.bg};")
P.write_text(s); print('OK f405')
