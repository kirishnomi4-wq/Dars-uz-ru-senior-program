// ============================================================
//  25 · O'z-sinov — 8 savol (Nest/PG-1 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = MDT[25].final;
function Screen25(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol, ulardan uchtasi sinfdagi tuzoqlar bo'yicha. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
      : sc >= 6
        ? "Natijangiz saqlangan: sakkizdan " + ['nol', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz'][sc] + ". Dars o'zlashtirilgan, Davom bosing."
        : "Yaxshi, bir xatoyingizni ko'rib chiqdingiz. Qolgan qizil savollarning ekranlariga ham qayting. Tayyor bo'lgach, Sinovni qayta topshirish tugmasini bosing.";
    return p.review ? [] : [{ id: 'intro', text: voice(text), trigger: 'on_mount' }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const audio = useAudio(segs);
  const sfx = useSfx();
  const [i, setI] = useState(st.i || 0);
  const [res, setRes] = useState(st.res || []);
  const [attempt, setAttempt] = useState(st.attempt || 1);
  const [showResult, setShowResult] = useState(!!st.showResult);
  const q = FINAL[i];
  const picked = res[i] ? res[i].picked : null;
  const score = res.filter((x) => x && x.correct).length;
  const finished = res.filter(Boolean).length === FINAL.length;
  const save = (patch) => p.onAnswer({ type: 'final', i, res, attempt, showResult, score, total: FINAL.length, ...patch });
  const pick = (k) => {
    if (picked !== null) return;
    audio.triggerEvent('option_picked');
    const r = [...res]; r[i] = { picked: k, correct: k === q.c }; setRes(r);
    if (k === q.c) sfx.playCorrect(); else sfx.playWrong();
    const sc = r.filter((x) => x && x.correct).length; save({ res: r, score: sc });
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi m4b-01 dagi testlar va sinfdagi tuzoqlar sizga tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
  };
  const next = () => { if (i < FINAL.length - 1) { setI(i + 1); save({ i: i + 1 }); } else { setShowResult(true); save({ showResult: true }); } };
  const retake = () => { setRes([]); setI(0); setShowResult(false); setAttempt(attempt + 1); save({ res: [], i: 0, showResult: false, attempt: attempt + 1, score: 0 }); };
  return (
    <Stage kicker="O'z-sinov" idx={p.idx} total={p.total} audio={audio} onBack={p.onBack} onNext={p.onNext} onRestart={p.onRestart} nextReady={finished && showResult} nextDisabled={!(finished && showResult)} lockHint={!finished ? 'Savollarga javob bering' : 'Natijani oching'}>
      <div className="mk-body" style={{ gridTemplateColumns: '1fr', maxWidth: 980, width: '100%', margin: '0 auto' }}>
        <div className="mk-say mc" style={{ overflow: 'auto', paddingRight: 4 }}>
          {showResult ? (<>
            <p className="mk-eyebrow">O'z-sinov · natija{attempt > 1 ? ` · ${attempt}-urinish` : ''}</p>
            <h2 className="mk-title mc-q" style={{ fontSize: 'clamp(22px,1.9vw,26px)' }}>{score} / {FINAL.length} — {score >= 6 ? "dars o'zlashtirildi" : "yana bir ko'rib chiqing"}</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {FINAL.map((f, k) => <div key={k} className="mk-card" style={{ display: 'flex', gap: 12, alignItems: 'center', borderColor: res[k] && res[k].correct ? T.green : T.accent }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: res[k] && res[k].correct ? T.green : T.accent, minWidth: 22 }}>{res[k] && res[k].correct ? '✓' : '✗'}</span>
                <span style={{ flex: 1, fontSize: 14 }}>{f.q}</span>
                {res[k] && !res[k].correct && p.onGoto && <button className="mk-btn soft sm" onClick={() => p.onGoto(f.s - 1)}>{f.s}-ekran</button>}
              </div>)}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14, flexWrap: 'wrap' }}>
              {score < 6 && <button className="mk-btn ghost" onClick={retake}>Sinovni qayta topshirish</button>}
              <span style={{ color: T.ink2, fontSize: 14 }}>Ekranga qaytib «Davom» bossangiz, shu natijaga qaytasiz.</span>
            </div>
          </>) : (<>
            <p className="mk-eyebrow">O'z-sinov · {i + 1} / {FINAL.length} · bitta urinish · to'g'ri: {score}</p>
            <h2 className="mk-title mc-q">{q.q}</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {q.o.map((o, k) => { let cls = 'mk-opt'; if (picked !== null) { if (k === q.c) cls += ' ok'; else if (k === picked) cls += ' bad'; else cls += ' off'; } return <button key={k} className={cls} disabled={picked !== null} onClick={() => pick(k)}><span className="l">{String.fromCharCode(65 + k)}</span><span>{o}</span></button>; })}
            </div>
            {picked !== null && <div className="mk-fb" style={{ '--c': picked === q.c ? T.green : T.accent, '--bg': picked === q.c ? '#E3F5EC' : '#FFF0EB' }}><b>{picked === q.c ? "To'g'ri" : "Noto'g'ri — to'g'risi yashil"}</b><span>{q.e}</span></div>}
            {picked !== null && <div style={{ marginTop: 14 }}><button className="mk-btn ready" onClick={next}>{i < FINAL.length - 1 ? 'Keyingi savol →' : "Natijani ko'rish →"}</button></div>}
          </>)}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  26 · Yakun (M13)
// ============================================================
const SUM26 = [
  { k: 'ut', t: "Unit-test — bitta funksiya, kirish va etalon; Jest o'quvchi reposida tayyor: src/ ichida, .spec.ts", st: ['fn', 'spec'] },
  { k: 'die', t: "describe — kim, it — qaysi holat, expect(…).toBe(…) — nima kutiladi; yagona tekshiruvchi — expect", st: ['spec'] },
  { k: 'pass', t: "PASS: fayl · guruh · ✓ holat · Tests: jami", st: ['run', 'res'] },
  { k: 'fail', t: "FAIL: ● satr → Expected / Received → funksiya; kim xato — kodmi, etalonmi", st: ['res', 'fn'] },
  { k: 'fake', t: "Yolg'on testlar va chegara: expect'siz yashil · noto'g'ri etalon qizil · shartga uch test; AI testiga ikki savol", st: ['spec', 'res'] },
  { k: 'trap', t: "Sinf: No tests found — joy va nom · npm ci → npm install · bo'sh loyihada config:init, @types/jest, typescript@5", st: ['run'] },
];
const STATIONS26 = [['fn', 'order.ts', T.blue], ['spec', 'order.spec.ts', T.purple], ['run', 'npm test', T.ink], ['res', 'PASS / FAIL', T.green]];
function SummaryMap26({ hl }) {
  const cur = SUM26.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — test yo'li</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6 }}>
      {STATIONS26.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK26 = [
  { t: "Funksiya: src/discount.ts — o'z shartingiz (masalan 200 000 dan oshsa −10 %)", c: [] },
  { t: 'Testlar: src/discount.spec.ts — 3 ta it: yuqori · aynan chegara · past', c: ['npm test'] },
  { t: 'Buzish: shartni buzing → aynan chegara qizil → tuzating', c: ['npm test'] },
  { t: "Uyga vazifa namunasi: src/delivery.ts + src/delivery.spec.ts (o'quvchi vazifasi)", c: [] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "unit-testlar"', 'git push'] },
];
const CHEATSHEET26 = `# Jest-1 — mentor eslatmasi (o'quvchi reposida birinchi unit-test)
## Jest o'quvchi reposida tayyor (package.json)
"test": "jest" · "rootDir": "src" · "testRegex": ".*\\.spec\\.ts$" · "transform": ts-jest → test fayli src/ ichida, nomi .spec.ts
O'rnatish: npm install (npm ci bu repoda yiqiladi — lock sinxron emas)
## Test fayli
import { orderTotal } from './order'; · describe('orderTotal', () => { it('2 kitob narxini hisoblaydi', () => { expect(orderTotal(10000, 2)).toBe(20000); }); });
AAA: Tayyorlash → Chaqirish → Tekshirish
## Natijani o'qish
PASS src/order.spec.ts → guruh → ✓ holat → Tests: 1 passed, 1 total
FAIL: ● guruh › holat → Expected (etalon) / Received (funksiya qaytargan) → > satr → order.spec.ts:6:20 (test yiqilgan joy; xato funksiyada bo'lishi mumkin)
## Yolg'on testlar
expect yo'q (console.log) → doim PASS · noto'g'ri etalon (10002) → to'g'ri kod bilan FAIL → «kim xato?» — etalonni qo'lda hisoblang
AI testiga ikki savol: expect bormi? etalon to'g'rimi?
## Chegara
deliveryFee: total >= 100000 ? 0 : 15000 → uch test: 150 000 · aynan 100 000 · 99 000; >= o'rniga > — faqat aynan 100 000 qizil
## Sinfdagi tuzoqlar
No tests found — fayl src/ dan tashqarida yoki nomi .test.ts · Cannot find module './orders' — import nomi · TS1005 — qavs
Bo'sh loyiha (Nest emas): Must use import to load ES Module → npx ts-jest config:init → Cannot find name 'describe' → npm i -D @types/jest → TypeScript 6/7 ts-jest bilan ishlamaydi → npm i -D typescript@5
O'quvchi darsidagi npm i -D jest ts-jest — Nest reposida zararsiz (versiya ko'tariladi)
## O'quvchi darsidagi so'zlar
mashina = funksiya · Jestbot = Jest · robot papkasi = describe · sinov varaqasi = it · etalon kartochkasi = expect · yolg'on test
## Sizning uyga vazifangiz
discount.ts + 3 test (chegara bilan) + bir marta qizil → yashil + deliveryFee testlari → GitHub → repo linki platformadagi uyga vazifaga`;
const s26Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Unit-test — bitta funksiya; Jest o'quvchi reposida <b>tayyor</b>", "Birinchi: unit-test bitta funksiyani kirish va etalon bilan sinaydi. Jest o'quvchi reposida tayyor, test fayli src ichida va nomi spec ts bilan.", { hl: 'ut' }),
  sg('b2', "describe, it va <b>expect</b> — yagona tekshiruvchi expect", "Ikkinchi: describe qaysi funksiya, it qaysi holat, expect nima kutilayotganini aytadi. Haqiqatan tekshiradigan yagona qator expect.", { hl: 'die' }),
  sg('b3', "PASS: fayl, guruh, <b>holat va jami</b>", "Uchinchi: PASS natijasida fayl, guruh, belgi bilan holat va pastda jami. Tests satri nechta it tekshirilganini aytadi.", { hl: 'pass' }),
  sg('b4', "FAIL: <b>Expected va Received</b>, keyin «kim xato» savoli", "To'rtinchi: FAIL'ni tartib bilan o'qing. Nuqtali satr, expected va received, keyin funksiya. Har FAIL'da savol: kod xatomi yoki etalon.", { hl: 'fail' }),
  sg('b5', "Yolg'on testlar va <b>chegara</b> — uch test va ikki savol", "Beshinchi: expect'siz test doim yashil, noto'g'ri etalon to'g'ri kodni qizil qiladi. Shart bor joyda uchta test, aynan chegara bilan. AI testiga ikki savol.", { hl: 'fake' }),
  sg('b6', "Sinf: <b>joy va nom</b>, npm install, bo'sh loyiha zanjiri", "Oltinchi, sinf uchun: no tests found bo'lsa joy va nom. Npm ci yiqilsa npm install. Bo'sh loyihada uch qo'shimcha buyruq, TypeScript besh bilan.", { hl: 'trap' }),
  sg('hw', "<b>Uyga vazifa</b>: o'z funksiyangiz va uchta test, chegara bilan", "Uyga vazifa: o'quvchi reposida o'z funksiyangizni yozing, masalan chegirma: summa ikki yuz mingdan oshsa o'n foiz. Shart bor, shuning uchun uchta test: yuqori, aynan chegara va past. Bir marta chegarani ataylab buzib qizilni ko'ring, keyin tuzating.", { hl: 'hw' }),
  sg('hw2', "Delivery fee testlarini qo'shing va <b>repo linkini platformaga</b> qo'ying", "Delivery fee testlarini ham qo'shing. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: sozlama, test fayli, PASS/FAIL va tuzoqlar — bir sahifada", "Pastda bir sahifalik eslatma: Jest sozlamasi, test fayli namunasi, natijani o'qish, yolg'on testlar, chegara va sinfdagi tuzoqlar. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen26(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET26;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'jest-1-mentor-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s26Segments(passed), [passed]);
  const b = useBeats(segments, p.review);
  const hl = b.seg.hl;
  const phase = hl === 'hw' ? 'hw' : hl === 'note' ? 'note' : 'sum';
  const shown = segments.slice(0, b.beat + 1).filter((s) => /^b\d/.test(s.id)).length;
  return (
    <Stage kicker="Yakun" idx={p.idx} total={p.total} audio={b.audio} onBack={p.onBack} onNext={p.onFinish} onRestart={p.onRestart} nextReady={b.done} nextDisabled={!b.done} nextLabel="Darsni yakunlash" lockHint="Ustoz gapirib bo'lgach ochiladi">
      <div className="mk-body">
        <Say title={passed ? 'Barakalla! Endi siz bilasiz' : 'Endi siz bilasiz'} segments={segments} beat={b.beat} audio={b.audio} stepManual={b.stepManual} guess={b.guess} answerAsk={b.answerAsk} review={p.review} />
        <div className="mk-scene top" style={{ overflow: 'auto' }}>
          {phase === 'sum' && (<>
            <SummaryMap26 hl={hl} />
            <div className="mk-plan">{SUM26.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>Uyga vazifa · 40–60 daqiqa</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK26.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> har it da expect · chegara qiymati sinalgan · etalonlar qo'lda hisoblanganga mos.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kursdagi keyingi mentor darsi</h5><div style={{ fontSize: 15, fontWeight: 700 }}>Jest: edge cases va error path</div><div style={{ fontSize: 13.5, color: T.ink2 }}>toThrow — xato holatlarni sinash, o'quvchi m4b-03 uchun</div></div>
          </div>}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  Muqova va ildiz
// ============================================================
function Cover({ onStart }) {
  return (
    <div className="mk-cover"><div className="card">
      <p className="mk-eyebrow">Mentor kursi · Jest</p>
      <h1>{LESSON_TITLE}</h1>
      <p>Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.</p>
      <ul>
        {["Jami taxminan 1 soat: ovoz ~21 daqiqa · to'rt amaliyot 35 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 12-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: Nest darslari o'tilgan · o'quvchi reposi (IntroNestArxitechture) · Node.js 20+ · VS Code", "Loyiha: o'quvchi reposi — testlar src/ ichida, misol o'quvchi m4b-01 dagi orderTotal"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, ScreenP1, Screen8, Screen9, Screen10, Screen11, ScreenP2, Screen13, Screen14, Screen15, ScreenP3, Screen17, Screen18, Screen19, ScreenP4, Screen21, Screen22, Screen23, Screen24, Screen25, Screen26];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function JestUnitMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
  setLang(lang);
  useCss();
  useCss3();
  const total = SCREENS.length;
  const [started, setStarted] = useState(startAt != null);
  const [idx, setIdx] = useState(Math.min(Math.max(0, startAt || 0), total - 1));
  const [answers, setAnswers] = useState({});
  const [returnTo, setReturnTo] = useState(null);
  const [seen, setSeen] = useState({});
  const [rev, setRev] = useState(0);
  const [mode, setMode] = useState('live');
  const startTime = useRef(Date.now());
  const finished = useRef(false);
  const onAnswer = useCallback((payload) => setAnswers((a) => ({ ...a, [idx]: payload })), [idx]);
  const goto = useCallback((to) => { setMode('live'); setReturnTo(idx); setIdx(Math.max(0, Math.min(to, total - 1))); }, [idx, total]);
  const next = () => { setMode('review'); setSeen((s) => ({ ...s, [idx]: true })); if (returnTo != null) { const r = returnTo; setReturnTo(null); setIdx(r); } else setIdx((i) => Math.min(i + 1, total - 1)); };
  const restart = useCallback(() => { setMode('live'); setRev((r) => r + 1); }, []);
  const finish = () => {
    if (finished.current) return; finished.current = true;
    const vals = Object.values(answers);
    const checks = vals.filter((a) => a && a.type === 'mc');
    const fin = vals.find((a) => a && a.type === 'final');
    const practices = vals.filter((a) => a && a.type === 'practice');
    const score = fin ? fin.score : 0, totalQ = FINAL.length;
    const practiceDone = practices.length === PRACTICE_COUNT && practices.every((x) => x.done);
    onFinished && onFinished({
      lessonId: LESSON_ID, lessonTitle: LESSON_TITLE,
      durationSec: Math.floor((Date.now() - startTime.current) / 1000),
      totalQuestions: totalQ, correctAnswers: score, scorePercent: Math.round((score / totalQ) * 100), passed: score >= 6 && practiceDone, testPassed: score >= 6,
      finalAttempts: fin ? fin.attempt : 0,
      checks: checks.map((c) => ({ firstTry: c.firstTry, tries: c.tries })),
      practiceDone,
      answers: Object.entries(answers).map(([i, a]) => ({ screen: Number(i) + 1, ...a })),
    });
  };
  if (!started) return <Cover onStart={() => setStarted(true)} />;
  const S = SCREENS[idx];
  const fin = Object.values(answers).find((a) => a && a.type === 'final');
  return <S key={`${idx}:${rev}`} idx={idx} total={total} lang={lang} stored={answers[idx]} testScore={fin ? fin.score : 0} seen={!!seen[idx]} review={mode === 'review' && !!seen[idx]} onAnswer={onAnswer} onNext={next} onBack={idx > 0 ? () => { setMode('review'); setIdx((i) => i - 1); } : null} onFinish={finish} onGoto={goto} onRestart={restart} />;
}
