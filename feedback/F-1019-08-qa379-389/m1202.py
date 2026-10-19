# F-1019-08 (QA F-1015-379/380, DE 213.23): m12-02 PmStoryPitchLesson — bo'sh uya yo'q, har qadamda bitta element, bo'laklar bitta kartada
p='/home/kali/Desktop/internetLesson/src/12-Modull/PmStoryPitchLesson.jsx'
s=open(p).read()
def rep(a,b,n=1):
    global s
    c=s.count(a); assert c==n,(c,a[:90]); s=s.replace(a,b)
# 1) HikoyaChiziq: faqat to'lgan uyalar (213.23a) — bo'sh/joriy uya chizilmaydi
rep("""    {QISM_ID.map((id, i) => {
      const holat = i < q ? cxx('toldi', i === yangi && 'yangi', uchdi.includes(id) && 'uchdi') : i === joriy ? 'bosh joriy' : 'bosh';""","""    {QISM_ID.slice(0, q).map((id, i) => { // F-1019-08 (213.23a): to'lmagan uya ko'rsatilmaydi — javobdan keyin paydo bo'ladi
      const holat = cxx('toldi', i === yangi && 'yangi', uchdi.includes(id) && 'uchdi');""")
rep("""const HikoyaChiziq = ({ q = 3, joriy = -1, yangi = -1, ixcham = false, uchdi = [], refs = {} }) => (""","""const HikoyaChiziq = ({ q = 3, yangi = -1, ixcham = false, uchdi = [], refs = {} }) => (""")
# 2) Screen2: telefonsiz (o'zgarish uyada «Juma 9/10»), ro'yxat faqat 1-qadamda
rep("""  const sahna = <HikoyaSahna rejim="hikoya" telSon={q >= 3 ? 9 : 8} juma={q >= 3} className={cxx(tugadi && 'tugadi')}
    royxat={tugadi ? null : { holat: q === 0 ? 'yozildi' : 'xira' }}
    chiziq={{ q, joriy: taxmin && !done ? q : -1, yangi: tugadi ? -1 : q - 1 }}""","""  // F-1019-08 (213.23d): har qadamda bitta element — 1-qadamda ro'yxat, keyin faqat to'lgan uyalar; telefon olindi (o'zgarish uyada: «Juma 9 / 10»)
  const sahna = <HikoyaSahna rejim="hikoya" telefon={false} className={cxx(tugadi && 'tugadi')}
    royxat={q === 0 && !tugadi ? { holat: 'yozildi' } : null}
    chiziq={q > 0 ? { q, yangi: tugadi ? -1 : q - 1 } : null}""")
# 3) PitchTasma: bitta karta (213.23b) — sarlavha hakam savoli, ichida olti qator; taymer chizig'i olindi
rep("""const PitchTasma = ({ q = 0, refs = {}, darhol = false, katta = false }) => (
  <div className={cxx('sp-tasma', katta && 'katta')}>
    <div className="sp-tasma-b">""","""const PitchTasma = ({ q = 0, refs = {}, darhol = false, katta = false, hakam }) => (
  <div className={cxx('sp-tasma', katta && 'katta')}>
    {hakam && <div className="sp-tasma-hk">{hakam}</div>}
    <div className="sp-tasma-b">""")
rep("""    </div>
    <TaymerChiziq lahza={q >= 1} />
  </div>
);""","""    </div>
  </div>
);""")
# 4) Screen6: uch hikoya kartasi olindi (qism to'g'ri javobdan keyin o'z qatoriga tushadi), hakam — karta sarlavhasi
rep("""  const sahna = <HikoyaSahna rejim="pitch" telefon={false} className={cxx(tugadi && 'tugadi')}
    chiziq={tugadi ? null : { q: 3, ixcham: true, uchdi, refs: chiziqRefs }}
    hakam={<Hakam ok={q >= 1} />}
    tasma={{ q, refs: tasmaRefs, darhol: !!storedAnswer, katta: tugadi }}""","""  // F-1019-08 (QA F-1015-380, 213.23b/d): uch hikoya kartasi va vaqt chizig'i olindi — bitta karta: sarlavha hakam savoli, ichida olti bo'lak qatori
  const sahna = <HikoyaSahna rejim="pitch" telefon={false} className={cxx(tugadi && 'tugadi')}
    tasma={{ q, refs: tasmaRefs, darhol: !!storedAnswer, katta: tugadi, hakam: <Hakam ok={q >= 1} /> }}""")
rep("""  const uchdi = q >= 2 ? ['kim', 'lahza', 'ozgarish'] : q >= 1 ? ['kim', 'lahza'] : [];
""","")
# 5) CSS: lenta — bitta karta, qatorlar chiziq bilan; telefonda nom tepada
rep("""        .sp-tasma { display: flex; flex-direction: column; gap: 6px; }
        .sp-tasma-b { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; }
        .sp-bo { display: flex; flex-direction: column; gap: 4px; min-width: 0; padding: 7px 11px; border-radius: 11px; background: ${T.paper}; border: 1.5px solid ${T.line}; transition: border-color .3s, box-shadow .3s; }""","""        /* F-1019-08 (213.23b): bitta karta — sarlavha (hakam savoli) + olti qator, qatorlar chiziq bilan; joriy qator — fon bilan */
        .sp-tasma { display: flex; flex-direction: column; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 14px; overflow: hidden; }
        .sp-tasma-hk { padding: 10px 14px; border-bottom: 1px solid ${T.line}; }
        .sp-tasma-hk .sp-rolk { border: 0; box-shadow: none; padding: 0; background: transparent; }
        .sp-tasma-b { display: flex; flex-direction: column; }
        .sp-bo { display: grid; grid-template-columns: 150px minmax(0,1fr); column-gap: 14px; row-gap: 4px; align-items: start; min-width: 0; padding: 9px 14px; transition: background .3s; }
        .sp-bo + .sp-bo { border-top: 1px solid ${T.line}; }
        .sp-bo > .sp-bo-h { grid-column: 1; grid-row: 1 / span 3; }
        .sp-bo > :not(.sp-bo-h) { grid-column: 2; }""")
rep("""        .sp-bo.hikoya { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.1)}; }
        .sp-bo.tashqi { border-color: ${T.accent}; background: ${T.accentSoft}; animation: sp-kir .4s ease-out both; }""","""        .sp-bo.hikoya { background: ${fon(T.accent, 0.07)}; }
        .sp-bo.tashqi { background: ${T.accentSoft}; animation: sp-kir .4s ease-out both; }""")
rep("""        .sp-tasma.katta .sp-bo.hikoya { box-shadow: 0 0 0 4px ${fon(T.accent, 0.12)}; }""","""        .sp-tasma.katta .sp-bo.hikoya { background: ${fon(T.accent, 0.1)}; }""")
rep(""".sp-tasma-b { grid-template-columns: repeat(2, minmax(0,1fr)); } }""",""".sp-bo { grid-template-columns: minmax(0,1fr); } .sp-bo > .sp-bo-h, .sp-bo > :not(.sp-bo-h) { grid-column: 1; grid-row: auto; } }""")
open(p,'w').write(s); print('ok')
