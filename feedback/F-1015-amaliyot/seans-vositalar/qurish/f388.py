# F-1015-388 (17.10, foydalanuvchi: «ko'rsatgan vizual … umuman his qilmadim, prosta qilib qo'ymasdan mehr bilan qilaylik»): m4-10 kirish 1-bosqich — jonli sahna.
# Vitrina (sayt, 3 mashina) · uzilgan sim · Ombor (baza, 4 mashina, Spark «yangi»). Spark ombordan yo'lga chiqadi → uzilgan joyda uchqun → yiqiladi; vitrinada 3 ta qoladi. Takrorlanadi; reduced-motion — qotgan rasm.
p = '/home/kali/Desktop/internetLesson/src/4-Modull/FullstackConnectPracticeLesson.jsx'
s = open(p, encoding='utf-8').read()
def r(a, b):
    global s
    assert s.count(a) == 1, ('soni', s.count(a), a[:90]); s = s.replace(a, b)
assert 'F-1015-388' not in s
KOMP = """// F-1015-388: kirish 1-bosqich — «sim uzilgan» jonli sahnasi (vitrina ↔ ombor; Spark yo'lda yiqiladi)
const UzilganSim = () => (
  <div className="us-sahna fade-up delay-1" role="img" aria-label={tr({ uz: "Saytda 3 ta mashina, bazada 4 ta: Spark bazadan saytga yetib bormaydi — sim uzilgan", ru: 'На сайте 3 машины, в базе 4: Spark не доходит из базы до сайта — провод оборван' })}>
    <div className="us-panel">
      <div className="us-h"><b>{tr({ uz: 'Sayt — vitrina', ru: 'Сайт — витрина' })}</b><small>localhost:5173</small></div>
      <div className="us-oyna"><div className="us-bar"><i /><i /><i /><span>avtoijara.uz</span></div>
        <ul className="us-ro">{CARS.map(c => <li key={c.id}><span className="us-em" style={{ background: c.bg }}>{c.emoji}</span><span className="us-nom">{c.nom}</span></li>)}
          <li className="us-bosh"><span className="us-em us-em-bosh">?</span><span className="us-nom">{tr({ uz: 'Spark — yo\\'q', ru: 'Spark — нет' })}</span></li></ul>
      </div>
      <div className="us-son"><b>3</b> {tr({ uz: 'ta mashina', ru: 'машины' })}</div>
    </div>
    <div className="us-sim" aria-hidden="true">
      <span className="us-seg us-seg-a" /><span className="us-qaychi">✂</span><span className="us-seg us-seg-b" />
      <span className="us-paket"><span className="us-em" style={{ background: SPARK.bg }}>{SPARK.emoji}</span>Spark</span>
      {[0, 1, 2, 3, 4, 5].map(i => <i key={i} className="us-uchqun" style={{ '--a': `${i * 60}deg` }} />)}
      <span className="us-yozuv">{tr({ uz: 'sim uzilgan', ru: 'провод оборван' })}</span>
    </div>
    <div className="us-panel">
      <div className="us-h"><b>{tr({ uz: 'Baza — ombor', ru: 'База — склад' })}</b><small>localhost:3000</small></div>
      <div className="us-oyna us-omb"><div className="us-bar"><span>🗄️ cars</span></div>
        <ul className="us-ro">{CARS_DB.map(c => <li key={c.id} className={c.id === SPARK.id ? 'us-yangi' : ''}><span className="us-em" style={{ background: c.bg }}>{c.emoji}</span><span className="us-nom">{c.nom}</span>{c.id === SPARK.id && <span className="us-pill">{tr({ uz: 'yangi', ru: 'новая' })}</span>}</li>)}</ul>
      </div>
      <div className="us-son"><b>4</b> {tr({ uz: 'ta mashina', ru: 'машины' })}</div>
    </div>
  </div>
);
"""
r("const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {", KOMP + "const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {")
a = s.index('        <div className="wire cut wire-katta fade-up delay-1">')
b = s.index('        <button type="button" className="btn fade-up delay-2 k0-och"', a)
s = s[:a] + "        <UzilganSim />\n        <p className=\"us-izoh fade-up delay-2\">{tr({ uz: \"Sim uzilgan — vitrina omborni ko'rmayapti: bazadagi Spark saytga yetib bormaydi.\", ru: 'Провод оборван — витрина не видит склад: Spark из базы не доходит до сайта.' })}</p>\n" + s[b:]
i = s.index('        .k0-bir {'); j = s.index('\n', i)
s = s[:j] + """
        .us-sahna { align-self: stretch; display: grid; grid-template-columns: minmax(0,1fr) minmax(110px,0.7fr) minmax(0,1fr); align-items: center; gap: clamp(8px,2vw,18px); } /* F-1015-388 */
        .us-panel { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,16px); box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.3); min-width: 0; }
        .us-h { display: flex; flex-direction: column; } .us-h b { font: 800 clamp(14px,1.7vw,17px) 'Manrope', sans-serif; color: ${T.ink}; } .us-h small { font: 600 11px 'JetBrains Mono', monospace; color: ${T.ink2}; }
        .us-oyna { border: 1px solid ${T.line}; border-radius: 10px; overflow: hidden; background: ${T.bg}; }
        .us-bar { display: flex; align-items: center; gap: 4px; padding: 5px 8px; background: ${T.line}; font: 600 10.5px 'JetBrains Mono', monospace; color: ${T.ink2}; } .us-bar i { width: 6px; height: 6px; border-radius: 50%; background: ${T.ink3}; } .us-bar span { margin-left: 4px; }
        .us-ro { list-style: none; margin: 0; padding: 6px; display: flex; flex-direction: column; gap: 5px; }
        .us-ro li { display: flex; align-items: center; gap: 7px; background: ${T.paper}; border-radius: 8px; padding: 5px 7px; min-width: 0; }
        .us-em { flex: none; width: 24px; height: 24px; border-radius: 7px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; }
        .us-nom { font: 600 12.5px 'Manrope', sans-serif; color: ${T.ink}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .us-bosh { background: transparent !important; border: 1.5px dashed ${T.line}; } .us-em-bosh { color: ${T.ink3}; border: 1.5px dashed ${T.ink3}; } .us-bosh .us-nom { color: ${T.ink2}; font-style: italic; }
        .us-yangi { box-shadow: inset 0 0 0 1.5px ${T.success}; animation: us-nafas 2.4s ease-in-out infinite; }
        .us-pill { margin-left: auto; flex: none; font: 800 10px 'Manrope', sans-serif; color: #fff; background: ${T.success}; border-radius: 99px; padding: 2px 7px; }
        @keyframes us-nafas { 0%, 100% { background: ${T.paper}; } 50% { background: ${T.successSoft}; } }
        .us-son { font: 600 13px 'Manrope', sans-serif; color: ${T.ink2}; } .us-son b { font: 800 22px 'Manrope', sans-serif; color: ${T.ink}; margin-right: 2px; }
        .us-sim { position: relative; height: 120px; display: flex; align-items: center; }
        .us-seg { height: 4px; border-radius: 99px; background: repeating-linear-gradient(90deg, ${T.danger} 0 8px, transparent 8px 13px); opacity: 0.75; } .us-seg-a { flex: 0 0 40%; } .us-seg-b { flex: 0 0 40%; margin-left: auto; }
        .us-qaychi { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-150%); font-size: 20px; color: ${T.danger}; animation: wire-sputter 3.6s ease-in-out infinite; }
        .us-yozuv { position: absolute; left: 50%; top: calc(50% + 16px); transform: translateX(-50%); font: 800 10.5px 'Manrope', sans-serif; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.danger}; white-space: nowrap; animation: wire-blink 2.8s ease-in-out infinite; }
        .us-paket { position: absolute; top: 50%; left: 100%; display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px 3px 3px; border-radius: 99px; background: ${T.paper}; box-shadow: 0 6px 14px -6px rgba(${T.shadowBase},0.45); font: 700 11.5px 'Manrope', sans-serif; color: ${T.ink}; transform: translate(-50%,-50%); opacity: 0; animation: us-yur 3.6s ease-in-out infinite; } .us-paket .us-em { width: 20px; height: 20px; font-size: 11px; border-radius: 50%; }
        @keyframes us-yur { 0% { left: 100%; opacity: 0; transform: translate(-50%,-50%); } 8% { opacity: 1; } 40% { left: 58%; transform: translate(-50%,-50%); } 46% { left: 56%; transform: translate(-50%,-50%) rotate(-10deg); } 52% { left: 57%; transform: translate(-50%,-50%) rotate(10deg); } 70% { left: 56%; transform: translate(-50%,60%) rotate(30deg); opacity: 0; } 100% { left: 56%; opacity: 0; } }
        .us-uchqun { position: absolute; left: 50%; top: 50%; width: 5px; height: 5px; border-radius: 50%; background: ${T.amber}; box-shadow: 0 0 8px 2px ${T.amber}; opacity: 0; animation: us-uch 3.6s ease-out infinite; }
        @keyframes us-uch { 0%, 40% { opacity: 0; transform: translate(-50%,-50%) rotate(var(--a)) translateX(0); } 46% { opacity: 1; } 62% { opacity: 0; transform: translate(-50%,-50%) rotate(var(--a)) translateX(26px); } 100% { opacity: 0; } }
        .us-izoh { margin: 0; text-align: center; font: 600 clamp(13px,1.5vw,15px) 'Manrope', sans-serif; color: ${T.ink2}; }
        @media (max-width: 620px) { .us-sahna { grid-template-columns: minmax(0,1fr) 64px minmax(0,1fr); gap: 6px; } .us-nom { font-size: 10.5px; } .us-em { width: 18px; height: 18px; font-size: 10px; } .us-paket { font-size: 0; gap: 0; padding: 3px; } .us-yozuv { font-size: 8.5px; white-space: normal; text-align: center; width: 64px; } }
        @media (prefers-reduced-motion: reduce) { .us-paket { animation: none; opacity: 1; left: 64%; } .us-uchqun, .us-yangi, .us-qaychi, .us-yozuv { animation: none; } .us-uchqun { opacity: 0.8; transform: translate(-50%,-50%) rotate(var(--a)) translateX(14px); } }""" + s[j:]
open(p, 'w', encoding='utf-8').write(s); print('ok 388')
