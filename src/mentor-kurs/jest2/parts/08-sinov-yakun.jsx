// ============================================================
//  23 · O'z-sinov — 8 savol (Nest/PG-1 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = MDT[23].final;
function Screen23(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: yashirin buzilish, guard, o'rash va chegaralar. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi m4b-03 dagi guard, o'rash va sinfdagi tuzoqlar sizga tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
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
//  24 · Yakun (M13)
// ============================================================
const SUM24 = [
  { k: 'edge', t: "Happy path va edge case: 0, manfiy, 1, so'z, null; himoyasiz funksiya — yashirin buzilish (0, −10000, NaN, null → 0)", st: ['fn'] },
  { k: 'guard', t: "Guard: if → throw new Error → return; 1 dona testi himoya to'g'ri buyurtmani to'smaganini ko'rsatadi", st: ['fn', 'res'] },
  { k: 'wrap', t: "expect(() => …).toThrow(); () =>siz test funksiya xatosi bilan qulaydi; toThrow('xabar') — qaysi xato", st: ['spec', 'res'] },
  { k: 'dnt', t: "did not throw — himoya yo'q yoki shart teshik (< 0); shartsiz throw — happy qizil", st: ['fn', 'res'] },
  { k: 'ts', t: "TypeScript: npm test yuradi, VS Code qizil — 'ikki' as any; ikki fayl — nomlar --verbose bilan", st: ['spec', 'run'] },
  { k: 'edge2', t: "Chegaraning ikki tomoni: 0 va 100 — ishlaydi, −1 va 101 — xato", st: ['spec', 'res'] },
];
const STATIONS24 = [['fn', 'order.ts · guard', T.blue], ['spec', 'order.spec.ts · toThrow', T.purple], ['run', 'npm test', T.ink], ['res', 'PASS / FAIL', T.green]];
function SummaryMap24({ hl }) {
  const cur = SUM24.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — noto'g'ri kirish yo'li</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6 }}>
      {STATIONS24.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK24 = [
  { t: "Guard: Jest-1 dagi discount.ts (yoki o'z funksiyangiz) — tur va chegara, aniq xabar", c: [] },
  { t: "Testlar: ichki va tashqi chegara + toThrow('xabar') + '…' as any", c: ['npm test'] },
  { t: "Buzish: () => ni olib tashlang → qulash → tiklang", c: ['npm test'] },
  { t: 'Kupon: src/coupon.ts + src/coupon.spec.ts (6 test)', c: ['npm test'] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "edge testlar"', 'git push'] },
];
const CHEATSHEET24 = `# Jest-2 — mentor eslatmasi (edge cases va error path)
## Happy path va edge case
happy: orderTotal(10000, 2) → 20000 · edge: 0, -1, 1 (eng kichik haqiqiy), 'ikki', null
Himoyasiz price * quantity: 0 → 0 · -1 → -10000 · 'ikki' → NaN · null → 0 — hammasi XATOSIZ (yashirin buzilish)
## Guard
if (typeof quantity !== 'number' || Number.isNaN(quantity) || quantity <= 0) { throw new Error("quantity musbat raqam bo'lsin"); }
return price * quantity;  — tartib: shart → xato → hisob; 1 dona testi ham shart
## Xatoni sinash
expect(() => orderTotal(10000, 0)).toThrow();  · xabar bilan: toThrow("quantity musbat raqam bo'lsin")
() =>siz: expect(orderTotal(10000, 0)).toThrow() → test funksiya xatosi bilan qulaydi (at orderTotal (order.ts:3:11))
## Xabarlar
Received function did not throw — guard yo'q yoki shart teshik (< 0 o'rniga <= 0)
Expected substring / Received message — xato bor, boshqa xabar
Happy testlar qizil — guard shartsiz (if yo'q) yoki juda qattiq (<= 1)
## TypeScript tuzog'i (o'quvchi reposi)
tsconfig: isolatedModules: true → npm test turlarni tekshirmaydi: orderTotal(10000, 'ikki') yuradi → Received: NaN
VS Code / tsc: TS2345 — qizil chiziq → testda 'ikki' as any
Ikki test fayli — nomlar chiqmaydi: jami son yoki npx jest --verbose; faqat order: npm test -- order
## Chegaraning ikki tomoni (applyCoupon)
if (percent < 0 || percent > 100) throw … · ichkari: 0 %, 100 % ishlaydi · tashqari: -1 %, 101 % xato
> o'rniga >= → faqat «chegara 100 %» qizil
## O'quvchi darsidagi so'zlar
shumtaka mijoz / g'alati buyurtma = edge case · «hech kim sezmaydi» = xatosiz noto'g'ri natija · guard (🚧 shart · 🧯 xato · ✅ hisob) · o'rab berish = () =>
## Sizning uyga vazifangiz
o'z funksiyangizga guard + ikki tomonli chegara testlari + toThrow('xabar') + as any + applyCoupon (6 test) → GitHub → repo linki platformadagi uyga vazifaga`;
const s24Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Happy path va edge case; himoyasiz funksiya — <b>yashirin buzilish</b>", "Birinchi: bitta oddiy holat va bir nechta chegara holati. Himoyasiz funksiya noto'g'ri kirishda xato bermaydi: nol, minus o'n ming, NaN.", { hl: 'edge' }),
  sg('b2', "Guard: <b>shart, xato, hisob</b> — va 1 dona testi", "Ikkinchi: guard funksiya boshida. Shart, xato tashlash, keyin hisob. Bir dona testi himoya to'g'ri buyurtmani to'smaganini ko'rsatadi.", { hl: 'guard' }),
  sg('b3', "Xato kutilsa — funksiya <b>() =&gt; ichida</b>; xabarni ham tekshiring", "Uchinchi: xato kutilsa, funksiya strelka ichiga o'raladi. O'ralmasa, test funksiyaning o'z xatosi bilan qulaydi. Xabar bilan to throw qaysi xato ekanini tekshiradi.", { hl: 'wrap' }),
  sg('b4', "<b>did not throw</b> — himoya yo'q yoki shart teshik", "To'rtinchi: did not throw, himoya yo'q yoki shart qiymatni o'tkazib yubordi. Oddiy holat qizil bo'lsa, himoya juda qattiq.", { hl: 'dnt' }),
  sg('b5', "TypeScript: test yuradi, VS Code qizil — <b>as any</b>", "Beshinchi: o'quvchi reposida npm test turlarni tekshirmaydi, VS Code esa qizil chizadi. Ataylab noto'g'ri turda as any. Ikki faylda nomlar uchun verbose.", { hl: 'ts' }),
  sg('b6', "Chegaraning <b>ikki tomoni</b>: 0 va 100 ishlaydi, −1 va 101 xato", "Oltinchi: chegaraning ikki tomonini sinang. Ichkarisi ishlaydi, nol va yuz. Tashqarisi xato beradi, minus bir va yuz bir.", { hl: 'edge2' }),
  sg('hw', "<b>Uyga vazifa</b>: o'z funksiyangizga guard va ikki tomonli testlar", "Uyga vazifa: Jest birinchi darsidagi o'z funksiyangizga himoya qo'ying. Noto'g'ri tur va chegaradan tashqari qiymatlar xato bersin, xabar aniq bo'lsin. Har chegara uchun ikki tomonli test. Bir marta strelkani olib tashlab qulashni ko'ring.", { hl: 'hw' }),
  sg('hw2', "Apply coupon testlarini qo'shing va <b>repo linkini platformaga</b> qo'ying", "Apply coupon testlarini ham qo'shing. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifaga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: guard, toThrow, xabarlar va tuzoqlar — bir sahifada", "Pastda bir sahifalik eslatma: guard namunasi, xatoni sinash, uch xabar va ularning sababi, TypeScript tuzog'i va chegaralar. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen24(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET24;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'jest-2-mentor-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s24Segments(passed), [passed]);
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
            <SummaryMap24 hl={hl} />
            <div className="mk-plan">{SUM24.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>Uyga vazifa · 40–60 daqiqa</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK24.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> guard funksiya boshida · chegaraning ikki tomoni · () =&gt; bilan toThrow · matn holati as any bilan.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kursdagi keyingi mentor darsi</h5><div style={{ fontSize: 15, fontWeight: 700 }}>CI/CD nima va nega</div><div style={{ fontSize: 13.5, color: T.ink2 }}>testlar har push'da o'zi yursin</div></div>
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
        {["Jami taxminan 1 soat: ovoz ~19 daqiqa · to'rt amaliyot ~40 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 12-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: Jest-1 mentor darsi o'tilgan · o'quvchi reposi (IntroNestArxitechture) va Jest-1 dagi order fayllari · Node.js 20+ · VS Code", "Loyiha: o'quvchi reposi — misol o'quvchi m4b-03 dagi orderTotal (0, manfiy, so'z) va uyga vazifa applyCoupon"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, ScreenP1, Screen8, Screen9, Screen10, Screen11, ScreenP2, Screen13, Screen14, Screen15, ScreenP3, Screen17, Screen18, ScreenP4, Screen20, Screen21, Screen22, Screen23, Screen24];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function JestEdgeMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
