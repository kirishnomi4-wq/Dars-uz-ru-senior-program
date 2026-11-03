
// ============================================================
//  DEMO (faqat dev, F-1103-02): tekshiruv ekrani dizayn variantlari A va B — PG-2 6-ekran matni ustida.
//  Yig'ish: cat parts/01-asos.jsx parts/02-dvigatel.jsx pg2/parts/03-matn.gen.jsx pg2/parts/04-yordam.jsx demo/parts/03-demo.jsx > dev/DemoMcLesson.jsx
//  Sahifa: /mentor-demo.html?s=0 (A) · ?s=1 (B). Darslarga kirmaydi.
// ============================================================
const DEMO_CMD = psql(String.raw`
shop=# UPDATE products SET price = 1 WHERE id = 99;
UPDATE 0`);
const DEMO_PROOF = psql(String.raw`
shop=# SELECT * FROM products;
 id |    name    | price | stock
  2 | Sichqoncha | 75000 |    15
  4 | Mishka     | 50000 |    10
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
function DemoA(p) { return <MCDemo {...p} variant="A" />; }
function DemoB(p) { return <MCDemo {...p} variant="B" />; }
const DEMO_SCREENS = [DemoA, DemoB];
export default function DemoMcLesson({ lang = 'uz', startAt }) {
  setLang(lang); useCss(); useCss3(); useDemoCss();
  const [idx, setIdx] = useState(Math.min(startAt || 0, DEMO_SCREENS.length - 1));
  const [answers, setAnswers] = useState({});
  const S = DEMO_SCREENS[idx];
  return <S key={idx} idx={idx} total={DEMO_SCREENS.length} stored={answers[idx]} onAnswer={(a) => setAnswers((x) => ({ ...x, [idx]: a }))} onNext={() => setIdx((i) => Math.min(i + 1, DEMO_SCREENS.length - 1))} onBack={idx > 0 ? () => setIdx((i) => i - 1) : undefined} onRestart={() => {}} />;
}
