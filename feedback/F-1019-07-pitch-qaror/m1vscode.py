# F-1019-07 (sinf-supurish): VsCodeLesson ScreenTour — 4 panelni birma-bir bosish -> 4 qaror (DE 213.22)
p='/home/kali/Desktop/internetLesson/src/1-Modull/VsCodeLesson.jsx'
s=open(p).read()
i0=s.index('const ScreenTour = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {')
i1=s.index('// ============================================================', i0)
B=s[i0:i1]
def rep(a,b,n=1):
    global B
    c=B.count(a); assert c==n,(c,a[:90]); B=B.replace(a,b)
rep("Oynaning 4 panelini birma-bir bosib chiqing: Explorer, Editor, Extensions va Terminal. Har birini bossangiz, nima ekanini tushuntiraman.", "Oynada 4 ta panel bor: Explorer, Editor, Extensions va Terminal. Har savolga javob bering — to'g'ri panel yonadi va uning vazifasini tushuntiraman.")
rep("""  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState(() => new Set(storedAnswer?.seenIds || (storedAnswer?.correct ? Object.keys(HOTS) : [])));
  const sentRef = useRef(!!(storedAnswer && storedAnswer.correct));
  const allSeen = seen.size >= 4;
  const tap = (k) => {
    setActive(k);
    const n = new Set(seen); n.add(k); setSeen(n);
    const all = n.size >= 4;
    onAnswer(screen, { correct: all, seenIds: [...n], picked: n.size, stage: 'exploration', screenIdx: screen });
    if (all && !sentRef.current) sentRef.current = true;
  };""","""  const [active, setActive] = useState(null);
  // F-1019-07 (DE 213.22): panellar bosib ochilmaydi — har biri qaror; to'g'ri tanlov panelni yoqadi va izohni ochadi
  const [qi, setQi] = useState(() => (storedAnswer?.correct ? 4 : TOUR_TARTIB.filter(k => (storedAnswer?.seenIds || []).includes(k)).length));
  const seen = new Set(TOUR_TARTIB.slice(0, qi));
  const allSeen = qi >= 4;
  const togri = () => {
    const k = TOUR_TARTIB[qi]; setActive(k);
    const n = TOUR_TARTIB.slice(0, qi + 1); setQi(qi + 1);
    onAnswer(screen, { correct: n.length >= 4, seenIds: n, picked: n.length, stage: 'exploration', screenIdx: screen });
  };""")
rep("""tr({ uz: '4 panelni bosib chiqing', ru: 'Нажмите на 4 панели' })""","""tr({ uz: 'Savollarga javob bering', ru: 'Ответьте на вопросы' })""")
rep("""Oynaning <b style={{ color: T.ink }}>4 panelini</b> birma-bir bosib chiqing — har birining vazifasini aytib beraman.</>""","""Oynada <b style={{ color: T.ink }}>4 ta panel</b> bor. Har savolga javob bering — to'g'ri panel yonadi va uning vazifasini aytib beraman.</>""")
# ru mentor
import re
m=re.search(r"ru: <>Это ваш новый рабочий стол\. (.*?)</> \}\)\}</Mentor>", B)
assert m, 'ru mentor'
B=B.replace(m.group(0), "ru: <>Это ваш новый рабочий стол. В окне <b style={{ color: T.ink }}>4 панели</b>. Ответьте на каждый вопрос — верная панель загорится, и я расскажу, зачем она.</> })}</Mentor>")
for k in ['explorer','editor','ext','term']:
    B=B.replace(" onClick={() => tap('%s')} role=\"button\"" % k, '')
assert 'tap(' not in B, 'tap qoldi'
rep('<div className="vsc fade-up delay-1">','<div className="vsc qaror fade-up delay-1">')
rep("""          <Col>
            {active ? (""","""          <Col>
            {!allSeen && <Qaror key={qi} savol={TOUR_QAROR[qi].savol} variantlar={TOUR_QAROR[qi].v} onTogri={togri} />}
            {active ? (""")
B=B.replace("/* F-0926-06: bo'sh-holat ramkasi olindi (159/3) — chorlov mentor gapida: «4 panelini birma-bir bosib chiqing» */", "/* F-0926-06: bo'sh-holat ramkasi olindi (159/3); F-1019-07: chorlov — qaror savoli */")
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
      <div className="qr-v">{variantlar.map((v, j) => <button key={j} type="button" className={'qr-chip' + (xato.includes(j) ? ' err' : '')} disabled={xato.includes(j)} onClick={() => tanla(j)}>{tr(v.t)}</button>)}</div>
      {izoh && <p className="qr-xato" role="status" key={tr(izoh)}>{tr(izoh)}</p>}
    </div>
  );
};
const TOUR_TARTIB = ['explorer', 'editor', 'ext', 'term'];
const TOUR_QAROR = [
  { savol: { uz: "Loyihadagi fayllar ro'yxati qaysi panelda?", ru: 'В какой панели список файлов проекта?' }, v: [
    { t: 'Editor', izoh: { uz: "Editor — kod yoziladigan katta panel; ro'yxat unda emas.", ru: 'Editor — большая панель для кода; списка там нет.' } },
    { ok: true, t: 'Explorer' },
    { t: 'Terminal', izoh: { uz: "Terminal — buyruq yoziladigan joy, fayllar ro'yxati emas.", ru: 'Terminal — место для команд, а не список файлов.' } }
  ] },
  { savol: { uz: 'Kod qaysi panelga yoziladi?', ru: 'В какую панель пишется код?' }, v: [
    { ok: true, t: 'Editor' },
    { t: 'Explorer', izoh: { uz: "Explorer faqat fayllarni ko'rsatadi; fayl boshqa panelda ochiladi.", ru: 'Explorer только показывает файлы; файл открывается в другой панели.' } },
    { t: 'Extensions', izoh: { uz: "Extensions — qo'shimcha dasturlar; kod u yerga yozilmaydi.", ru: 'Extensions — дополнения; код туда не пишут.' } }
  ] },
  { savol: { uz: "VS Code'ga yangi imkoniyat qo'shadigan dastur qayerdan o'rnatiladi?", ru: 'Откуда ставят программу, которая добавляет VS Code новые возможности?' }, v: [
    { t: 'Explorer', izoh: { uz: "Explorer — loyiha fayllari; dastur u yerdan o'rnatilmaydi.", ru: 'Explorer — файлы проекта; программы оттуда не ставят.' } },
    { t: 'Editor', izoh: { uz: "Editor'da kod yoziladi; qo'shimcha dastur u yerda yo'q.", ru: 'В Editor пишут код; дополнений там нет.' } },
    { ok: true, t: 'Extensions' }
  ] },
  { savol: { uz: 'Kompyuterga yozma buyruq qaysi panelda beriladi?', ru: 'В какой панели компьютеру дают письменные команды?' }, v: [
    { t: 'Extensions', izoh: { uz: "Extensions — qo'shimcha dasturlar; buyruq u yerda yozilmaydi.", ru: 'Extensions — дополнения; команды там не пишут.' } },
    { ok: true, t: 'Terminal' },
    { t: 'Editor', izoh: { uz: "Editor'ga kod yoziladi, lekin u buyruq sifatida bajarilmaydi.", ru: 'В Editor пишут код, но он не выполняется как команда.' } }
  ] }
];
'''
s=s[:i0]+QAR+B+s[i1:]
a='''        .vsc-hot:not(.seen) { animation: tap-hint 1.8s ease-in-out infinite; }'''
assert s.count(a)==1
s=s.replace(a,a+'''
        /* F-1019-07 (DE 213.22): sayohat ekrani — panellar bosilmaydi (qaror bilan yonadi), chorlov animatsiyasi yo'q */
        .vsc.qaror .vsc-hot { cursor: default; animation: none; }
        .qr { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-bottom: 12px; }
        .qr-s { margin: 0; font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 800; line-height: 1.4; color: ${T.ink}; }
        .qr-v { display: flex; flex-wrap: wrap; gap: 8px; }
        .qr-chip { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 600; font-size: clamp(13px,1.45vw,14px); line-height: 1.35; text-align: left; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 8px 12px; cursor: pointer; transition: border-color 0.15s, background 0.15s; }
        .qr-chip:hover:not(:disabled) { border-color: ${T.accent}; }
        .qr-chip:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .qr-chip.err { border-color: ${T.accent}; background: ${T.accentSoft}; color: ${T.accent}; cursor: default; animation: qr-silk 0.32s ease-in-out; }
        @keyframes qr-silk { 0%, 100% { transform: none; } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .qr-xato { margin: 0; color: ${T.accent}; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; line-height: 1.4; animation: fade-step 0.25s ease-out; }
        @media (prefers-reduced-motion: reduce) { .qr-chip.err, .qr-xato { animation: none; } }''')
open(p,'w').write(s); print('VsCode ok')
