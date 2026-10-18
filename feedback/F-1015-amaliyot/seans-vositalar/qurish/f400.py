# F-1015-400: m4a-04 06/09 «Eshik sinovi» — kod dalil yig'ilguncha faqat xira edi (opacity 0.45), xatoli qator o'qilib turardi.
# Endi: dalil yig'ilguncha kod qatorlari blur-qulf ostida (o'qilmaydi, bosilmaydi), fayl nomi ko'rinadi; dalil yig'ilgach ochiladi.
# Zaxira: arxiv/F-1015-400-oldin/. Qayta yurgizilmaydi.
import pathlib
P = pathlib.Path('/home/kali/Desktop/internetLesson/src/4a-Modull/NestArchPracticeLesson.jsx')
s = P.read_text()
def rep(old, new):
    global s
    assert s.count(old) == 1, (s.count(old), old[:90]); s = s.replace(old, new)

rep('''              <div className="ai-code" style={{ opacity: evidence ? 1 : 0.45 }}>''',
    '''              <div className={`ai-code ${evidence ? '' : 'locked'}`}>{/* F-1015-400: dalil yig'ilguncha qatorlar blur-qulf ostida — javob oldindan o'qilmasin */}''')
rep('''        .ai-code { background: ${CODE.bg}; border-radius: 10px; padding: 10px 11px; display: flex; flex-direction: column; gap: 2px; transition: opacity 0.3s ease; }''',
    '''        .ai-code { background: ${CODE.bg}; border-radius: 10px; padding: 10px 11px; display: flex; flex-direction: column; gap: 2px; transition: opacity 0.3s ease; }
        .ai-code.locked .ai-line { filter: blur(5px); opacity: 0.55; user-select: none; pointer-events: none; cursor: default; } /* F-1015-400: blur-qulf, fayl nomi ochiq qoladi */
        .ai-line { transition: filter 0.4s ease, opacity 0.4s ease; }''')
P.write_text(s); print('OK f400')
