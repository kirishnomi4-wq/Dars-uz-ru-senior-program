// ============================================================
//  19 · O'z-sinov — 8 savol (Nest/PG-1 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = MDT[19].final;
function Screen19(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: to'lov xabari, imzo, xom tana, tartib, takror, rad va kalit. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi m11-03 dagi to'lov xabari, imzo va takror sizga tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
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
//  20 · Yakun (M13)
// ============================================================
const SUM20 = [
  { k: 'xabar', t: "To'lov xabarini xizmat o'zi yuboradi; ilovaning «to'landi» degani dalil emas", st: ['xiz', 'be'] },
  { k: 'imzo', t: "Imzo — xom tana + kalit (HMAC SHA-256); soxta xabar 401 va yozuvsiz", st: ['xiz', 'be'] },
  { k: 'raw', t: "rawBody: true — xom tana; yo'q bo'lsa haqiqiy to'lov ham 401", st: ['be'] },
  { k: 'tartib', t: "Tartib: imzo → maydonlar → takror → yozuv", st: ['be', 'db'] },
  { k: 'takror', t: "Takror — 200 { takror: true }, noyob raqam; rad ham yoziladi", st: ['be', 'db'] },
  { k: 'kalit', t: "Kalit faqat .env va Render'da; m11-03 — pul chegarasi, A1 kalit, A2 uch tekshiruv", st: ['be'] },
];
const STATIONS20 = [['xiz', "to'lov xizmati · mashq sahifa", T.blue], ['be', 'Backend · imzo', T.purple], ['db', 'tolovlar', T.green]];
function SummaryMap20({ hl }) {
  const cur = SUM20.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — to'lov xabari yo'li</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6 }}>
      {STATIONS20.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK20 = [
  { t: "Buzish: imzo tekshiruvini insert dan keyinga ko'chiring → «Imzosiz yuborish» — 401, lekin tolovlar da qator", c: [] },
  { t: 'Qaytarish: imzo — birinchi → «Imzosiz» — 401 va qator yo\'q', c: [] },
  { t: "Uch tekshiruv: Imzosiz · Ikki marta · Rad — 401 · ok va takror · rad qatori", c: [] },
  { t: "Kalit: .env Git'da yo'qligini tekshiring", c: ['git ls-files backend/.env'] },
  { t: "GitHub'ga chiqaring (kalitsiz) va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "tolov xabari: tartib tekshiruvi"', 'git push'] },
];
const CHEATSHEET20 = `# Webhook — mentor eslatmasi (to'lov xabari)
## Yo'l
ilova → to'lov sahifasi · tashkilotchi to'laydi yoki rad etadi · xizmat → POST /tolov/webhook · Backend → 200
ilovaning «to'landi» degani dalil emas; dalil — xizmatning imzoli xabari
## Imzo (backend/src/tolov/imzo.ts)
X-Imzo = HMAC SHA-256 (xom tana, TOLOV_KALITI), hex 64; avval shakl, keyin timingSafeEqual; kalit bo'sh → hech bir xabar o'tmaydi
soxta: imzosiz · abc · boshqa kalit · summasi o'zgargan → 401, jadvalda 0
xom tana: bo'sh joyli JSON → 401; main.ts: NestFactory.create(AppModule, { rawBody: true }) — yo'q bo'lsa haqiqiy to'lov ham 401
## Tartib (tolov.controller.ts)
imzo → maydonlar (400) → takror (200 { takror: true }) → yozuv (200 { ok: true }); imzo yozuvdan keyin bo'lsa: 401, lekin qator yozilgan
bir vaqtda ikki xabar: noyob tolov_raqami + 23505 → takror
rad ham yoziladi; Pro hali o'zgarmaydi (README «Hozir ishlaydi»)
## Mentor amaliyoti (lokal)
git checkout -f m13-dars-03-done · npm ci · .env: TOLOV_KALITI (node -e …randomBytes(32)…) · npm run start · /royxat {ism, login, parol}
localhost:3000/tolov-mashq?oyinchi=11&summa=10000 — To'lash · Rad etish · Ikki marta yuborish · Imzosiz yuborish
## O'quvchi darsidagi so'zlar (m11-03)
to'lov xabari · imzo · kalit · takror xabar · rad etilgan to'lov · test rejim · mashq to'lov; pul chegarasi — haqiqiy xizmat yo'q
## Sizning uyga vazifangiz
tartibni buzib ko'rish va qaytarish + uch tekshiruv + .env Git'da yo'q → GitHub → repo linki platformadagi uyga vazifaga`;
const s20Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "To'lov xabarini <b>xizmat o'zi</b> yuboradi", "Birinchi: to'lov xabarini xizmat o'zi yuboradi. Ilovaning to'landi degani dalil emas.", { hl: 'xabar' }),
  sg('b2', "Imzo — <b>xom tana + kalit</b>; soxtasi 401", "Ikkinchi: imzo xabar matni va maxfiy kalitdan hisoblanadi. Soxta xabar to'rt yuz bir oladi va hech narsa yozilmaydi.", { hl: 'imzo' }),
  sg('b3', "<b>rawBody</b> yo'q — hamma 401", "Uchinchi: Backend imzoni xom tanadan hisoblaydi. Raw body yo'q bo'lsa, haqiqiy to'lov ham to'rt yuz bir.", { hl: 'raw' }),
  sg('b4', "Tartib: <b>avval imzo</b>, keyin yozuv", "To'rtinchi: tartib, avval imzo, keyin maydonlar, takror va yozuv. Imzo keyin tursa, soxta xabar yozilib qoladi.", { hl: 'tartib' }),
  sg('b5', "Takror — <b>200, yozuvsiz</b>; rad ham yoziladi", "Beshinchi: takror xabarga ikki yuz va takror true, ikkinchi qator yo'q. Rad etilgan to'lov ham yoziladi.", { hl: 'takror' }),
  sg('b6', "Kalit — faqat <b>.env va Render'da</b>", "Oltinchi: kalit faqat env faylida va Render'da. O'quvchi darsida pul chegarasi qat'iy: haqiqiy xizmat yo'q.", { hl: 'kalit' }),
  sg('hw', "<b>Uyga vazifa</b>: tartibni buzish, qaytarish va uch tekshiruv", "Uyga vazifa: o'z Backend'ingizda yoki maydon jamoa nusxasida imzo tekshiruvini yozuvdan keyinga ko'chiring va imzosiz yuborishda qator yozilib qolishini ko'ring. Keyin qaytaring va uch tekshiruvni qiling.", { hl: 'hw' }),
  sg('hw2', "<b>Repo linkini platformaga</b> qo'ying — kalitsiz", "GitHub'ga kalitsiz chiqaring va repo linkini platformadagi uyga vazifaga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: yo'l, imzo, tartib va takror — bir sahifada", "Pastda bir sahifalik eslatma: to'lov yo'li, imzo va xom tana, tekshiruv tartibi, takror, mentor amaliyoti va o'quvchi tili. Nusxalab yoki yuklab oling.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen20(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET20;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'webhook-tolov-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s20Segments(passed), [passed]);
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
            <SummaryMap20 hl={hl} />
            <div className="mk-plan">{SUM20.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>Uyga vazifa · 40–60 daqiqa</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK20.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> imzo birinchi · takror 200 · rad yoziladi · kalit repo'da yo'q.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kurs mavzulari</h5><div style={{ fontSize: 15, fontWeight: 700 }}>Bu — ro'yxatdagi oxirgi mavzu</div><div style={{ fontSize: 13.5, color: T.ink2 }}>o'quvchi darslarini boshidan o'tishga tayyorsiz</div></div>
          </div>}
        </div>
      </div>
    </Stage>
  );
}

// ============================================================
//  Muqova va ildiz
// ============================================================
function Cover({ onStart, resume }) {
  return (
    <div className="mk-cover"><div className="card">
      <p className="mk-eyebrow">Mentor kursi · Webhook</p>
      <h1>{LESSON_TITLE}</h1>
      <p>Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.</p>
      <ul>
        {["Jami taxminan 1 soat: ovoz ~20 daqiqa · uch amaliyot ~30 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 9-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: NestJS va PostgreSQL darslari o'tilgan (lokal PostgreSQL) · Node.js 20+ · VS Code · brauzer · ikkita terminal", "Loyiha: o'quvchi reposi maydon-jamoa (m13-dars-03-done) — to'lov xabari va «Mashq to'lov» sahifasi. Pul yechilmaydi"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <CoverStart onStart={onStart} resume={resume} />
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenP1, Screen10, Screen11, Screen12, ScreenP2, Screen14, ScreenP3, Screen16, Screen17, Screen18, Screen19, Screen20];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function WebhookMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
  const sv = useMentorSave({ id: LESSON_ID, total, startAt, started, idx, answers, seen, setIdx, setAnswers, setSeen, setStarted });
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
  if (!started) return <Cover onStart={sv.start} resume={sv.resume} />;
  const S = SCREENS[idx];
  const fin = Object.values(answers).find((a) => a && a.type === 'final');
  return <S key={`${idx}:${rev}`} idx={idx} total={total} lang={lang} stored={answers[idx]} testScore={fin ? fin.score : 0} seen={!!seen[idx]} review={mode === 'review' && !!seen[idx]} onAnswer={onAnswer} onNext={next} onBack={idx > 0 ? () => { setMode('review'); setIdx((i) => i - 1); } : null} onFinish={finish} onGoto={goto} onRestart={restart} />;
}
