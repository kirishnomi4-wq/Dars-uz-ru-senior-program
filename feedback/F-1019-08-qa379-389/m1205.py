# F-1019-08 (QA F-1015-386, DE 213.23): m12-05 PmPitchTrainingLesson — bo'sh katak/uya yo'q, oddiy sarlavha, har qadamda bitta element
p='/home/kali/Desktop/internetLesson/src/12-Modull/PmPitchTrainingLesson.jsx'
s=open(p).read()
def rep(a,b,n=1):
    global s
    c=s.count(a); assert c==n,(c,a[:90]); s=s.replace(a,b)
# 1) Varaq: faqat to'lgan yoki joriy (ajrat) qator; bo'sh varaqda bitta kulrang gap; hakam bloki matn bo'lsa
rep("""const Varaq = ({ qatorlar, hakam, vaqt, ixcham = false, refQ, refHk }) => (
  <div className={cxx('gv-varaq', ixcham && 'ixcham')}>
    <div className="gv-v-h">{tr({ uz: "Baholash varag'i", ru: 'Оценочный лист' })} · {qatorlar.filter(q => q.belgi).length}{NB}/{NB}6</div>
    {qatorlar.map(q => (""","""// F-1019-08 (213.23a/b): to'lmagan qator ko'rsatilmaydi (joriy — 'ajrat' — qoladi); bo'sh varaqda bitta kulrang gap; sarlavha oddiy, qora panel yo'q
const Varaq = ({ qatorlar, hakam, vaqt, ixcham = false, refQ, refHk }) => {
  const kor = qatorlar.filter(q => q.belgi || q.holat === 'ajrat');
  return (
  <div className={cxx('gv-varaq', ixcham && 'ixcham')}>
    <div className="gv-v-h">{tr({ uz: "Baholash varag'i", ru: 'Оценочный лист' })}</div>
    {kor.length === 0 && <p className="gv-v-bosh">{tr({ uz: "Guruh har bo'lakka ✓ yoki ✗ qo'yadi.", ru: 'Группа ставит каждой части ✓ или ✗.' })}</p>}
    {kor.map(q => (""")
rep("""    {hakam && <div ref={refHk} className={cxx('gv-v-hk', !hakam.matn && 'bosh', hakam.holat)}>""","""    {hakam && (hakam.matn || hakam.holat === 'ajrat') && <div ref={refHk} className={cxx('gv-v-hk', !hakam.matn && 'bosh', hakam.holat)}>""")
rep("""    {vaqt && <div className="gv-v-vaqt">{vaqt}</div>}
  </div>
);""","""    {vaqt && <div className="gv-v-vaqt">{vaqt}</div>}
    {hakam && !(hakam.matn || hakam.holat === 'ajrat') && <span ref={refHk} className="gv-v-oxir" aria-hidden="true" />}
  </div>
  );
};""")
# 2) Royxat: faqat to'lgan band; bo'sh — kulrang gap; uchish nishoni — oxiridagi ko'rinmas langar
rep("""const Royxat = ({ bandlar, refR, yangi = null, onTahrir }) => (
  <div className="gv-royxat">
    <div className="gv-r-h">{tr({ uz: "Tuzatishlar ro'yxati", ru: 'Список исправлений' })}</div>
    {[0, 1, 2].map(i => {
      const b = bandlar[i];
      return (""","""// F-1019-08 (213.23a): bo'sh «1 2 3» uyasi yo'q — band to'g'ri tanlangach paydo bo'ladi; uchish nishoni — ro'yxat oxiridagi ko'rinmas langar
const Royxat = ({ bandlar, refR, yangi = null, onTahrir }) => {
  const soni = [0, 1, 2].filter(i => bandlar[i]).length;
  return (
  <div className="gv-royxat">
    <div className="gv-r-h">{tr({ uz: "Tuzatishlar ro'yxati", ru: 'Список исправлений' })}</div>
    {soni === 0 && <p className="gv-v-bosh">{tr({ uz: "Har to'g'ri tuzatish ro'yxatga bitta qator qo'shadi.", ru: 'Каждое верное исправление добавляет в список одну строку.' })}</p>}
    {[0, 1, 2].filter(i => bandlar[i]).map(i => {
      const b = bandlar[i];
      return (""")
rep("""        </div>
      );
    })}
  </div>
);
const GuruhVaraqSahna""","""        </div>
      );
    })}
    {soni < 3 && <span ref={refR ? (el => { refR.current[soni] = el; }) : undefined} className="gv-v-oxir" aria-hidden="true" />}
  </div>
  );
};
const GuruhVaraqSahna""")
# 3) Screen2: bo'sh nutq pufagi yo'q; varaq — pitch tinglangach; tinglovchilar — 3-qadamda (hakam o'rnida)
rep("""      {!done && <Gapiruvchi yorliq={tr({ uz: 'gapiradi', ru: 'говорит' })} pufak={pufak || (pi < 0 ? null : undefined)} pufakKey={(qayt || '') + pi}""","""      {!done && q < 2 && <Gapiruvchi yorliq={tr({ uz: 'gapiradi', ru: 'говорит' })} pufak={pufak || undefined} pufakKey={(qayt || '') + pi}""")
rep("""      <Tinglovchilar yorliq={q >= 2 ? tr({ uz: "hakam o'rnida", ru: 'в роли судьи' }) : null} refS={pufRef}
        pufaklar={hk === 1 ? [{ k: 'hk', q: true, ref: true, matn: tr(MENTOR_HAKAM_SAVOL) }] : []} />""","""      {(q >= 2 || done) && <Tinglovchilar yorliq={tr({ uz: "hakam o'rnida", ru: 'в роли судьи' })} refS={pufRef}
        pufaklar={hk === 1 ? [{ k: 'hk', q: true, ref: true, matn: tr(MENTOR_HAKAM_SAVOL) }] : []} />}""")
rep("""    varaq={<Varaq qatorlar={qatorlar} refHk={hkRef}""","""    varaq={q >= 1 && <Varaq qatorlar={qatorlar} refHk={hkRef}""")
# 4) Screen4: xato variant yopiladi (213.22), nav sanog'i olindi (bosqich — ro'yxat qatorlari)
rep("""  const [xato, setXato] = useState(null); // { i, k }
  const [band, setBand] = useState(false);""","""  const [xato, setXato] = useState(null); // { i, k }
  const [xl, setXl] = useState([]); // F-1019-08 (213.22): shu kartada tanlangan xato variantlar — yopiladi
  const [band, setBand] = useState(false);""")
rep("""    if (i !== k.togri) { xatoSoni.current += 1; setXato({ i, k: Date.now() }); return; }
    setXato(null); setBand(true);""","""    if (i !== k.togri) { xatoSoni.current += 1; setXato({ i, k: Date.now() }); setXl(x => (x.includes(i) ? x : [...x, i])); return; }
    setXato(null); setXl([]); setBand(true);""")
rep("""type="button" disabled={band} className={cxx('gv-var', xato && xato.i === i && 'err')} onClick={() => bos(i)}>{tr(v)}</button>""","""type="button" disabled={band || xl.includes(i)} className={cxx('gv-var', xl.includes(i) && 'err')} onClick={() => bos(i)}>{tr(v)}</button>""")
rep("""tr({ uz: `Kartalarni yeching (${n}/3)`, ru: `Решите карточки (${n}/3)` })""","""tr({ uz: 'Savollarga javob bering', ru: 'Ответьте на вопросы' })""")
# 5) CSS
rep("""        .gv-v-h { background: ${T.ink}; color: #fff; font-size: 13.5px; font-weight: 800; padding: 8px 12px; letter-spacing: .01em; }""","""        .gv-v-h { color: ${T.ink}; font-size: 13.5px; font-weight: 800; padding: 9px 12px; border-bottom: 1px solid ${T.line}; background: ${T.paper}; } /* 213.23b: qora panel o'rniga oddiy sarlavha + chiziq */
        p.gv-v-bosh { margin: 0; padding: 10px 12px; font-size: 13px; color: ${T.ink2}; }
        .gv-royxat > p.gv-v-bosh { padding: 0; }
        .gv-v-oxir { display: block; height: 0; }""")
open(p,'w').write(s); print('ok')
