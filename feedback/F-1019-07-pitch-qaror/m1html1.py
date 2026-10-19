# F-1019-07 (sinf-supurish): Htmllesson1 Screen5 «Struktura» — 4 qismni birma-bir bosish -> 4 qaror (DE 213.22); keyin DragDrop (o'zgarmaydi)
p='/home/kali/Desktop/internetLesson/src/1-Modull/Htmllesson1.jsx'
s=open(p).read()
i0=s.index('const Screen5 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {'); i1=s.index('// ===== YANGI: SKELET MUSTAHKAMLASH TESTI')
B=s[i0:i1]
def rep(a,b,n=1):
    global B
    c=B.count(a); assert c==n,(c,a[:90]); B=B.replace(a,b)
rep("Har bir qismni bosib, nima ekanini ko'ring.`", "Har savolga javob bering — to'g'ri qism chizmada yonadi.`")
rep("""  const [active, setActive] = useState(null);
  const [clicked, setClicked] = useState(new Set());""","""  const [active, setActive] = useState(null);
  // F-1019-07 (DE 213.22): qismlar bosib ochilmaydi — har biri qaror; to'g'ri tanlov qismni yoqadi va izoh kartasini ochadi
  const [qi, setQi] = useState(storedAnswer ? 4 : 0);
  const clicked = new Set(S5_TARTIB.slice(0, qi));""")
rep("""  const tap = (k) => { setActive(k); setClicked(prev => { const n = new Set(prev); n.add(k); return n; }); };""","""  const togri = () => { setActive(S5_TARTIB[qi]); setQi(n => Math.min(4, n + 1)); };""")
rep("Chizmadagi 4 ta qismni birma-bir bosib biling.</>", "Har savolga javob bering — to'g'ri qism chizmada yonadi.</>")
rep("Нажмите по очереди на 4 части схемы.</>", "Ответьте на каждый вопрос — верная часть загорится на схеме.</>")
# bosish olib tashlanadi
for k in ['doctype','html','head','body']:
    B=B.replace(" onClick={() => tap('%s')}" % k, '')
assert 'tap(' not in B, 'tap qoldi'
rep('<div className="bskel fade-up delay-2">','<div className="bskel qaror fade-up delay-2">')
rep('<pre className="code-box fade-up delay-2"','<pre className="code-box qaror fade-up delay-2"')
rep("""            </div>
            </>
            )}
            {!done && <AchRule screen={screen} />}""","""            </div>
            {qi < 4 && <Qaror key={qi} savol={S5_QAROR[qi].savol} variantlar={S5_QAROR[qi].v} onTogri={togri} />}
            </>
            )}
            {!done && <AchRule screen={screen} />}""")
QAR='''// --- F-1019-07 (DE 213.22): qaror qadami — savol, 3 variant (biri to'g'ri, qolgani tipik xato), xatosiga bir qatorli sabab, xato tugma yopiladi.
// Har qadam key bilan yangilanadi. Namuna: Htmllesson2 Qaror (F-1019-04).
const Qaror = ({ savol, variantlar, onTogri }) => {
  const [xato, setXato] = useState([]);
  const [izoh, setIzoh] = useState(null);
  const tanla = (j) => {
    const v = variantlar[j];
    if (v.ok) { setIzoh(null); onTogri(); return; }
    setXato(x => (x.includes(j) ? x : [...x, j])); setIzoh(v.izoh);
  };
  return (
    <div className="qr fade-step">
      <p className="qr-s">{tr(savol)}</p>
      <div className="qr-v">{variantlar.map((v, j) => <button key={j} type="button" className={'qr-chip mono' + (xato.includes(j) ? ' err' : '')} disabled={xato.includes(j)} onClick={() => tanla(j)}>{tr(v.t)}</button>)}</div>
      {izoh && <p className="qr-xato" role="status" key={tr(izoh)}>{tr(izoh)}</p>}
    </div>
  );
};
const S5_TARTIB = ['head', 'body', 'html', 'doctype'];
const S5_QAROR = [
  { savol: { uz: "Mehmon ko'rmaydigan «oshxona» qaysi qism?", ru: 'Какая часть — «кухня», которую гость не видит?' }, v: [
    { t: '<body>', izoh: { uz: "body — zal: mehmon ko'radigan hamma narsa shu yerda.", ru: 'body — зал: всё, что видит гость, здесь.' } },
    { ok: true, t: '<head>' },
    { t: '<html>', izoh: { uz: "html — butun bino: oshxona ham, zal ham uning ichida.", ru: 'html — всё здание: и кухня, и зал внутри него.' } }
  ] },
  { savol: { uz: "Mehmon ko'radigan «zal» qaysi qism?", ru: 'Какая часть — «зал», который видит гость?' }, v: [
    { t: '<head>', izoh: { uz: "head — oshxona: u ekranda ko'rinmaydi.", ru: 'head — кухня: на экране её не видно.' } },
    { t: '<!DOCTYPE html>', izoh: { uz: "DOCTYPE faqat sahifa turini e'lon qiladi, ekranda yo'q.", ru: 'DOCTYPE только объявляет тип страницы, на экране его нет.' } },
    { ok: true, t: '<body>' }
  ] },
  { savol: { uz: "Oshxona va zalni birga o'rab turgan qism qaysi?", ru: 'Какая часть оборачивает и кухню, и зал?' }, v: [
    { ok: true, t: '<html>' },
    { t: '<body>', izoh: { uz: "body — faqat zal; oshxona uning ichida emas.", ru: 'body — только зал; кухня не внутри него.' } },
    { t: '<head>', izoh: { uz: "head — faqat oshxona; zal uning ichida emas.", ru: 'head — только кухня; зал не внутри неё.' } }
  ] },
  { savol: { uz: "Hammasidan oldin «bu HTML sahifa» deb aytadigan qator qaysi?", ru: 'Какая строка раньше всего говорит: «это HTML-страница»?' }, v: [
    { t: '<html>', izoh: { uz: "html — butun hujjat qobig'i; undan oldin yana bitta qator bor.", ru: 'html — оболочка документа; перед ней есть ещё одна строка.' } },
    { ok: true, t: '<!DOCTYPE html>' },
    { t: '<!-- kontent shu yerga -->', izoh: { uz: "Bu izoh — brauzer uni o'qimaydi, hech narsa e'lon qilmaydi.", ru: 'Это комментарий — браузер его пропускает и ничего не объявляет.' } }
  ] }
];
'''
s=s[:i0]+QAR+B+s[i1:]
# CSS
a='''        .ck { cursor: pointer; border-radius: 4px; transition: all 0.15s; padding: 0 2px; }'''
assert s.count(a)==1
s=s.replace(a,a+'''
        /* F-1019-07 (DE 213.22): Struktura ekrani — qismlar bosilmaydi (qaror bilan yonadi), chorlov animatsiyasi yo'q */
        .bskel.qaror .bskel-doctype, .bskel.qaror .bskel-html, .bskel.qaror .bskel-tab, .bskel.qaror .bskel-page, .code-box.qaror .ck { cursor: default; animation: none; }
        .qr { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-top: 12px; }
        .qr-s { margin: 0; font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 800; line-height: 1.4; color: ${T.ink}; }
        .qr-v { display: flex; flex-wrap: wrap; gap: 8px; }
        .qr-chip { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 600; font-size: clamp(13px,1.45vw,14px); line-height: 1.35; text-align: left; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 8px 12px; cursor: pointer; transition: border-color 0.15s, background 0.15s; }
        .qr-chip:hover:not(:disabled) { border-color: ${T.accent}; }
        .qr-chip:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .qr-chip.err { border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.accent}; cursor: default; animation: qr-silk 0.32s ease-in-out; }
        @keyframes qr-silk { 0%, 100% { transform: none; } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .qr-xato { margin: 0; color: ${T.accent}; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; line-height: 1.4; animation: fade-step 0.25s ease-out; }
        @media (prefers-reduced-motion: reduce) { .qr-chip.err, .qr-xato { animation: none; } }''')
open(p,'w').write(s); print('Htmllesson1 ok')
