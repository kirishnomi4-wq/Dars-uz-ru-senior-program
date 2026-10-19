# F-1019-08 (QA F-1015-389, DE 213.23): m12-08 PmFinalPitchLesson — bo'laklar bitta kartada, bo'sh «1:00» katagi yo'q, 3-ekranda telefon yo'q
p='/home/kali/Desktop/internetLesson/src/12-Modull/PmFinalPitchLesson.jsx'
s=open(p).read()
def rep(a,b,n=1):
    global s
    c=s.count(a); assert c==n,(c,a[:90]); s=s.replace(a,b)
rep("""      {kataklar.map((c, i) => (
        <span key={i} ref={refs ? (el => { refs.current[i] = el; }) : undefined} className={cxx('fp-kat', i < yonadi ? (c.holat || 'bosh') : 'bosh', c.yangi && 'yangi')}>""","""      {kataklar.map((c, i) => ((i >= yonadi || !c.holat || c.holat === 'bosh') ? null : ( // F-1019-08 (213.23a): bo'sh katak ko'rsatilmaydi — navbati kelganda paydo bo'ladi
        <span key={i} ref={refs ? (el => { refs.current[i] = el; }) : undefined} className={cxx('fp-kat', c.holat, c.yangi && 'yangi')}>""")
rep("""          {c.matn && <span className="fp-kat-m">{c.matn}</span>}
        </span>
      ))}""","""          {c.matn && <span className="fp-kat-m">{c.matn}</span>}
        </span>
      )))}""")
rep("""  const sahna = <FinalSahna telefon telSon={q >= 3 && sek >= 115 ? 9 : 8} className="katta\"""","""  const sahna = <FinalSahna className="katta\"""")
rep("""// ===== SCREEN 3 — TUZATISH VA TAYMER (QTushuncha; bashorat → 3 qaror: varaq · tuzatishlar · taymer; telefon faqat shu ekranda) =====""","""// ===== SCREEN 3 — TUZATISH VA TAYMER (QTushuncha; bashorat → 3 qaror: varaq · tuzatishlar · taymer; F-1019-08: telefon olindi — 213.23d) =====""")
# CSS: bitta karta, qatorlar chiziq bilan; holat — chap chiziq va fon
rep("""        .fp-bolaklar { display: flex; flex-direction: row; flex-wrap: wrap; gap: 4px 6px; }""","""        /* F-1019-08 (213.23b): olti bo'lak — bitta karta, qatorlar chiziq bilan; joriy/xato — chap chiziq (alohida ramka yo'q) */
        .fp-bolaklar { display: flex; flex-direction: row; flex-wrap: wrap; gap: 0; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 12px; overflow: hidden; }
        .fp-bolaklar > .fp-bo + .fp-bo:not(.nomi) { border-top: 1px solid ${T.line}; }""")
s=s.replace("""        .fp-bo { display: flex; align-items: flex-start; gap: 12px; padding: 5px 12px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 11px; min-width: 0;""","""        .fp-bo { display: flex; align-items: flex-start; gap: 12px; padding: 7px 12px; background: transparent; border: 0; border-radius: 0; min-width: 0;""",1)
assert "background: transparent; border: 0; border-radius: 0; min-width: 0;" in s
rep("""        .fp-bo.joriy { border-color: ${T.accent}; box-shadow: 0 0 0 3px ${fon(T.accent, 0.12)}; }
        .fp-bo.xato { border-color: ${T.err}; }""","""        .fp-bo.joriy { background: ${fon(T.accent, 0.07)}; box-shadow: inset 3px 0 0 ${T.accent}; }
        .fp-bo.xato { box-shadow: inset 3px 0 0 ${T.err}; }""")
rep("""        .fp-bo.nomi { padding: 4px 10px; }""","""        .fp-bo.nomi { padding: 6px 10px; }""")
open(p,'w').write(s); print('ok')
