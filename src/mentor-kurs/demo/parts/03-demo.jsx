
// ============================================================
//  DEMO (faqat dev, F-1103-02): tekshiruv ekrani dizayn variantlari A va B — PG-2 6-ekran matni ustida.
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx pg2/parts/03-matn.gen.jsx pg2/parts/04-yordam.jsx pg2/parts/05-s01-s12.jsx pg2/parts/06-s13-s22.jsx demo/parts/03-demo.jsx > dev/DemoMcLesson.jsx
//  Sahifa: /mentor-demo.html?s=0 (A) · ?s=1 (B). Darslarga kirmaydi.
// ============================================================
const DEMO_CMD = psql(String.raw`
shop=# UPDATE products SET price = 1 WHERE id = 99;
UPDATE 0`);
const DEMO_PROOF = psql(String.raw`
shop=# SELECT * FROM products;
 id |    name    | price | stock
  2 | Sichqoncha | 75000 |    15
  4 | Kolonka    | 50000 |    10
  1 | Klaviatura | 99000 |     8
(3 rows)`);
const DEMO_CSS = `
.mk-body.mcv{padding:22px 28px}
.mk-body.mcv-a{grid-template-columns:minmax(360px,4fr) minmax(0,8fr);gap:28px}
.mcv .mk-say.mc>:first-child{margin-top:0}
.mcv .mk-title.mc-q{margin:0 0 16px}
.mcv-opts{display:grid;gap:8px}
.mcv .mk-opt{padding:11px 14px;font-size:15px;border-radius:10px;align-items:flex-start}
.mcv .mk-opt .l{margin-top:3px}
.mcv .mk-opt .t{display:grid;gap:4px}
.mcv .mk-opt .why{font-size:13.5px;line-height:1.4;color:#12805A;font-weight:500}
.mcv .mk-opt.ok{color:#0F1115}
.mcv .mk-opt .why code{font:.92em ui-monospace,Menlo,Consolas,monospace;background:#EEF0F4;border:1px solid #DDE1E8;border-radius:5px;padding:0 5px;color:#0F1115}
.mcv-s .mk-panel{flex:1 1 auto;min-height:0}
.mcv-demak{min-height:52px;display:flex;align-items:center;font-size:15px;line-height:1.45;color:#0F1115;padding:0 4px}
.mcv-demak.on{border-left:3px solid #12805A;padding-left:12px;animation:mk-up .45s ease both}
.mcv-demak b{color:#12805A;margin-right:6px}
.mcv-demak code{font:.92em ui-monospace,Menlo,Consolas,monospace;background:#EEF0F4;border:1px solid #DDE1E8;border-radius:5px;padding:0 5px}
.mk-body.mcv-b{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) auto;gap:22px;max-width:1360px;width:100%;margin:0 auto}
.mk-body.mcv-b .mk-panel{flex:1 1 auto;min-height:0}
.mcv-low{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:28px;align-items:start}
.mk-body.mcv-b .mcv-opts{grid-template-columns:1fr 1fr}
.mcv-kod{display:grid;gap:12px;align-content:start;width:100%}
.mcv-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:10px}
.mcv-cards .pg-pm pre{white-space:pre-wrap;margin:0}
.mcv-sum{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.mcv-sum .c{background:#fff;border:1px solid #E3E6EC;border-radius:12px;padding:14px 16px;display:grid;gap:4px}
.mcv-sum .c b{font:700 20px/1 ui-monospace,Menlo,Consolas,monospace}
.mcv-sum .c span{font-size:13px;color:#4B5162}
@media (max-width:1300px){.mk-body.mcv-a{grid-template-columns:1fr;grid-auto-rows:max-content;overflow:auto}.mcv-low{grid-template-columns:1fr}.mk-body.mcv-b .mcv-opts{grid-template-columns:1fr}}
`;
function useDemoCss() { useEffect(() => { const el = document.createElement('style'); el.textContent = DEMO_CSS; document.head.appendChild(el); return () => el.remove(); }, []); }

function MCDemo({ variant, idx, total, onAnswer, onBack, onNext, onRestart }) {
  const m = MDT[6];
  const segs = useMemo(() => [{ id: 'q', text: voice("Javobdagi sonni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Buyruq xatosiz o'tdi, lekin javob: update nol. Bu nimani bildiradi? Variantni tanlang."), trigger: 'on_mount', waits_for: { type: 'option_picked' } }], []);
  const audio = useAudio(segs);
  const sfx = useSfx();
  const [bad, setBad] = useState([]);
  const [solved, setSolved] = useState(false);
  const pick = (i) => {
    if (solved || bad.includes(i)) return;
    if (bad.length === 0) audio.triggerEvent('option_picked');
    if (i === m.correct) { setSolved(true); sfx.playCorrect(); onAnswer({ picked: i, correct: true, tries: bad.length + 1, firstTry: bad.length === 0, bad, type: 'mc' }); setTimeout(() => audio.pushOneOff(voice(m.ok)), 300); }
    else { setBad([...bad, i]); sfx.playWrong(); }
  };
  const opts = (
    <div className="mcv-opts">{m.opts.map((o, i) => {
      let cls = 'mk-opt'; if (solved) cls += i === m.correct ? ' ok' : ' off'; else if (bad.includes(i)) cls += ' bad';
      return <button key={i} className={cls} disabled={solved || bad.includes(i)} onClick={() => pick(i)}><span className="l">{String.fromCharCode(65 + i)}</span><span className="t"><span>{o}</span>{solved && i === m.correct && <small className="why" dangerouslySetInnerHTML={html(m.okShort)} />}</span></button>;
    })}</div>
  );
  const panel = <CodePanel file="psql — shop" numbers={false} wrap style={{ background: PG.term }} lines={solved ? [...DEMO_CMD, ...DEMO_PROOF] : DEMO_CMD} />;
  const demak = <div className={`mcv-demak${solved ? ' on' : ''}`}>{solved && <><b>Demak,</b><span><code>UPDATE 0</code> xato emas: <code>WHERE</code> hech qaysi qatorga mos kelmaganini bildiradi.</span></>}</div>;
  const head = <><p className="mk-eyebrow">{m.eyebrow} · 1-urinish hisoblanadi</p><h2 className="mk-title mc-q">Buyruq xatosiz o'tdi, javob <code>UPDATE 0</code>. Bu nimani bildiradi?</h2></>;
  const scene = <div className="mk-scene top mcv-s"><div className="mk-tag" style={{ margin: 0 }}>psql — haqiqiy natija</div>{panel}{demak}</div>;
  return (
    <Stage kicker={`${m.kicker} · ${variant} varianti`} idx={idx} total={total} audio={audio} onBack={onBack} onNext={onNext} onRestart={onRestart} nextReady={solved} nextDisabled={!solved} lockHint="To'g'ri javobni toping">
      {variant === 'A'
        ? <div className="mk-body mcv mcv-a"><div className="mk-say mc">{head}{opts}</div>{scene}</div>
        : <div className="mk-body mcv mcv-b">{scene}<div className="mcv-low"><div className="mk-say mc">{head}</div>{opts}</div></div>}
    </Stage>
  );
}
// C — F-1103-04 namunasi: kod bo'lak-bo'lak (faqat hozirgi endpoint, o'ralmaydi), natija kartasi kod TAGIDA; oxirgi segmentda kod emas, xulosa kartalari
const PM = {
  post: <PostmanCard m="POST" url="/api/cars" body={'{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }'} st={201} res={'{"id":4,"model":"Chevrolet Spark","daily_price":190000,"year":2021,"is_rented":null}'} />,
  put: <PostmanCard m="PUT" url="/api/cars/2" body={'{ "daily_price": 480000 }'} st={200} res={'{"id":2,"model":"Chevrolet Malibu","daily_price":480000,"year":2023,"is_rented":false}'} />,
  del: <PostmanCard m="DELETE" url="/api/cars/1" st={200} res={'{"message":"O\'chirildi","deleted":1}'} />,
  nf: <PostmanCard m="PUT" url="/api/cars/99" body={'{ "daily_price": 1 }'} st={404} res={'{"error":"Mashina topilmadi"}'} hl />,
};
const SC = mkS(15, [{ from: 26, to: 36, cards: ['post'] }, { from: 26, to: 36, cards: ['post'], nul: true }, { from: 38, to: 49, cards: ['put'] }, { from: 51, to: 60, cards: ['del', 'nf'] }, { sum: true }]);
function DemoC(p) {
  return <Lesson p={p} S={SC} sceneTop scene={({ seg }) => <div className="mcv-kod">
    {seg.from && <SrvIde from={seg.from} to={seg.to} />}
    {seg.cards && <div className="mcv-cards">{seg.cards.map((k) => <React.Fragment key={k}>{PM[k]}</React.Fragment>)}</div>}
    {seg.nul && <div className="n2-warn"><b>is_rented: null</b> — POST'da berilmagan, jadvalda <code>DEFAULT</code> yo'q. Kerak bo'lsa: <code>is_rented BOOLEAN DEFAULT false</code>.</div>}
    {seg.sum && <div className="mcv-sum">
      <div className="c"><b style={{ color: '#12805A' }}>200</b><span>GET · PUT · DELETE — bajarildi</span></div>
      <div className="c"><b style={{ color: '#12805A' }}>201</b><span>POST — yaratildi, qator javobda</span></div>
      <div className="c"><b style={{ color: '#B57A00' }}>404</b><span>topilmadi — <code>rowCount</code> nol</span></div>
      <div className="c"><b style={{ color: '#E2451F' }}>500</b><span>xato — <code>catch</code>, matni javobda</span></div>
    </div>}
  </div>} />;
}
function DemoA(p) { return <MCDemo {...p} variant="A" />; }
function DemoB(p) { return <MCDemo {...p} variant="B" />; }
const DEMO_SCREENS = [DemoA, DemoB, DemoC];
export default function DemoMcLesson({ lang = 'uz', startAt }) {
  setLang(lang); useCss(); useCss3(); useDemoCss();
  const [idx, setIdx] = useState(Math.min(startAt || 0, DEMO_SCREENS.length - 1));
  const [answers, setAnswers] = useState({});
  const S = DEMO_SCREENS[idx];
  return <S key={idx} idx={idx} total={DEMO_SCREENS.length} stored={answers[idx]} onAnswer={(a) => setAnswers((x) => ({ ...x, [idx]: a }))} onNext={() => setIdx((i) => Math.min(i + 1, DEMO_SCREENS.length - 1))} onBack={idx > 0 ? () => setIdx((i) => i - 1) : undefined} onRestart={() => {}} />;
}
