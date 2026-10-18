# F-1015-399: m4a-04 03/09 «Aniq buyruq» — o'ng ustun buyruq yuborilguncha bo'sh turardi (kartasiz tekislik).
# Endi boshidanoq: «Agent yaratayotgan fayllar» (kutilmoqda-qatori) + kirish taxtasi (CategoryModule yo'q · GET /category 404 — haqiqiy boshlang'ich holat).
# Zaxira: arxiv/F-1015-399-oldin/. Qayta yurgizilmaydi.
import pathlib
P = pathlib.Path('/home/kali/Desktop/internetLesson/src/4a-Modull/NestArchPracticeLesson.jsx')
s = P.read_text()
def rep(old, new):
    global s
    assert s.count(old) == 1, (s.count(old), old[:90]); s = s.replace(old, new)

rep("""            {cmd && <p className="flow-label">{tr({ uz: 'Agent yaratayotgan fayllar', ru: 'Файлы, которые создаёт агент' })}</p>}{/* F-0926-06: yorliq bo'sh ustunda yolg'iz osilmasin (159/3) */}
            {cmd
              ? <FileGen files={cmd.files} running={gen.running} n={gen.n} />
              : null}
            {shown && <>
              <p className="flow-label" style={{ marginTop: 4 }}>""",
"""            {/* F-1015-399: o'ng ustun boshidanoq to'la — kutilmoqda-qatori + taxtaning haqiqiy boshlang'ich holati (CategoryModule yo'q, 404) */}
            <p className="flow-label">{tr({ uz: 'Agent yaratayotgan fayllar', ru: 'Файлы, которые создаёт агент' })}</p>
            {cmd
              ? <FileGen files={cmd.files} running={gen.running} n={gen.n} />
              : <div className="gen-file" style={{ opacity: 0.5 }}><span className="gen-ico">·</span><span className="mono" style={{ flex: 1 }}>{tr({ uz: 'buyruq kutilmoqda — chapdan bittasini yuboring', ru: 'жду команду — отправьте одну слева' })}</span></div>}
            <>
              <p className="flow-label" style={{ marginTop: 4 }}>""")
rep("""              {!wired && <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Bo'lim taxtada yo'q""",
"""              {shown && !wired && <div className="hint"><p className="body" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: <>Bo'lim taxtada yo'q""")
P.write_text(s); print('OK f399')
# (tuzatish, shu seansda): `{shown && <>…</>}` → `<>…</>` — yopuvchi `}` ham olindi (suratda matn bo'lib chiqqan edi)
