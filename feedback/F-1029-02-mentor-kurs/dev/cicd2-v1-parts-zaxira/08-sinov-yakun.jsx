// ============================================================
//  24 · O'z-sinov — 8 savol (Nest/PG-1 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = MDT[24].final;
function Screen24(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: Actions oynasi, qizil run, fayl xatolari va o'quvchi darsidagi namunalar. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi m4c-03 dagi yo'l xaritasi va sinfdagi qizil run'lar sizga tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
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
//  25 · Yakun (M13)
// ============================================================
const SUM25 = [
  { k: 'run', t: "Actions: har push — run; run ichida job, job ichida qadam; Set up job, Post, Complete job — GitHub'niki", st: ['push', 'run'] },
  { k: 'uses', t: "uses logi: checkout — faqat oxirgi commit; setup-node — mashinadagi Node; token — Contents: read", st: ['run'] },
  { k: 'qizil', t: "Qizil run: qizil qadam → kod (1, 127, 254) → logdagi birinchi error satri", st: ['run', 'log'] },
  { k: 'fayl', t: "Fayl xatosi — qadamsiz qizil; papka xato — run yo'q; runs-on xato — cheksiz kutadi", st: ['yml', 'run'] },
  { k: 'nam', t: "O'quvchi namunalari: matrix'ni node-version'ga ulang; cache — setup-node cache: npm; secret'ni logga chiqarmang", st: ['yml', 'log'] },
  { k: 'yashil', t: "Testsiz lenta yashil — yashil belgi faqat yozilgan qadamlarni kafolatlaydi", st: ['log'] },
];
const STATIONS25 = [['push', 'git push', T.ink], ['yml', 'ci.yml', T.green], ['run', 'run · job · qadam', T.blue], ['log', 'log va kod', T.accent]];
function SummaryMap25({ hl }) {
  const cur = SUM25.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — push'dan logga</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6 }}>
      {STATIONS25.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK25 = [
  { t: 'matrix: node [20, 22] + node-version: ${{ matrix.node }} (19-ekran)', c: [] },
  { t: "cache: setup-node → cache: npm (17-ekran); 2-run'da «Cache restored»", c: [] },
  { t: 'Qizil: tartib yoki test ataylab buziladi → push → qizil, kod', c: ['git commit -am "sinov: buzildi"', 'git push'] },
  { t: 'Tuzatish: push → yana yashil', c: ['git commit -am "tuzatildi"', 'git push'] },
  { t: "Repo linkini platformadagi uyga vazifangizga qo'ying", c: [] },
];
const CHEATSHEET25 = `# CI/CD-2 — mentor eslatmasi (GitHub Actions: run, log, namunalar)
## Actions oynasi
har push = run (nomi — commit xabari; CI #N · push · tarmoq) · run → job (jobs: test:) → qadam (Run …)
GitHub qo'shadi: Set up job (mashina, uses yuklab olish) · Post Run … (tozalash) · Complete job
Set up job: Ubuntu 24.04.5 LTS · GITHUB_TOKEN Contents: read (lenta git push qilolmaydi — 403) · ubuntu-latest Ubuntu 26 ga o'tkazilmoqda
checkout: papkani tozalaydi, fetch-depth: 1 (faqat oxirgi commit) · setup-node: Found in cache, node v22.23.4, npm 10.9.9
## Qizil run (sabab — qizil qadam logida, izohda faqat kod)
1 — test FAIL (Expected/Received) yoki npm ci (in sync / lock yo'q) · 127 — jest: not found (test install'dan oldin)
254 — Could not read package.json (checkout yo'q) · 2 — bash syntax error (print('test')) · 128 — git (403)
tartib: checkout → setup-node → npm install → npm test → npm run build
## Fayl xatolari
on: once · runs-on yo'q · surilish · run: echo "Natija: ok" → run darhol qizil, job/qadam/log yo'q (tahlilchida tekshiring; ikki nuqtali buyruq — run: | blokida)
.github/workflow (s yo'q) → run umuman yo'q · runs-on: my-laptop → queued, cheksiz kutadi (bekor qiling)
## O'quvchi darsidagi namunalar (m4c-03) — haqiqiy run'da
matrix node [18, 20, 22] node-version'siz → uch job, uchalasi Node 22 · ulangan: node-version: \${{ matrix.node }} → 18.20.8 / 20.20.2 / 22.23.4
actions/cache@v4 key'siz → qizil: Input required and not supplied: key · setup-node cache: npm → npm install 44 → 45 → 16 s (2-run'dan)
secrets: *** — faqat aynan qiymat; bo'laklab chiqarilsa ochiq; yo'q secret — bo'sh qator, run yashil
s17 print('test') / git push → qizil · s18 testsiz lenta → yashil · @v4 — ishlaydi, «Node.js 20 is deprecated»
## Sizning uyga vazifangiz
matrix [20, 22] ulangan · setup-node cache: npm · bitta qizil (tartib yoki test) va tuzatish → repo linki platformadagi uyga vazifaga`.replace(/\\\$/g, '$');
const s25Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "Har push — <b>run</b>; ichida job va qadamlar, uchtasi GitHub'niki", "Birinchi: har push bitta run. Run ichida job, job ichida qadam. Set up job, Post va Complete job qadamlarini GitHub o'zi qo'shadi.", { hl: 'run' }),
  sg('b2', "uses logi: checkout, setup-node va <b>token ruxsati</b>", "Ikkinchi: uses qadamining logi nima qilganini aytadi. Checkout faqat oxirgi commit'ni oladi, setup node mashinadagi Node'ni beradi, token faqat o'qishga ruxsat oladi.", { hl: 'uses' }),
  sg('b3', "Qizil run: qizil qadam, <b>kod</b>, logdagi birinchi error", "Uchinchi: qizil run'da avval qizil qadam, keyin kod: bir, yuz yigirma yetti yoki ikki yuz ellik to'rt. Sababni logdagi birinchi error satri aytadi.", { hl: 'qizil' }),
  sg('b4', "Fayl xatosi — <b>qadamsiz qizil</b>; papka va runs-on — boshqa belgi", "To'rtinchi: fayl xatosida run qadamsiz qizil. Papka nomi xato bo'lsa run umuman yo'q, runs on xato bo'lsa cheksiz kutadi.", { hl: 'fayl' }),
  sg('b5', "O'quvchi namunalari: <b>matrix, cache, secrets</b> — to'g'risi bilan", "Beshinchi: o'quvchi darsidagi matrix'ni node version'ga ulang, cache uchun setup node'dagi cache npm yozing, secret'ni logga chiqarmang.", { hl: 'nam' }),
  sg('b6', "Testsiz lenta yashil — <b>yashil belgi</b> faqat yozilganini kafolatlaydi", "Oltinchi: test qadami yo'q lenta yashil. Yashil belgi faqat yozilgan qadamlar o'tdi degani, shuning uchun npm test albatta bo'lsin.", { hl: 'yashil' }),
  sg('hw', "<b>Uyga vazifa</b>: matrix, cache va bitta qizil run — tuzatish bilan", "Uyga vazifa: lentali reposingizda matrix bilan Node yigirma va yigirma ikki, setup node'da cache npm. Bir marta tartibni yoki testni ataylab buzib qizil qiling va tuzating.", { hl: 'hw' }),
  sg('hw2', "<b>Repo linkini platformaga</b> qo'ying — boshqa hech narsa kerak emas", "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifaga qo'ying, boshqa hech narsa kerak emas. O'ttiz-qirq besh daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: Actions oynasi, kodlar, fayl xatolari va namunalar — bir sahifada", "Pastda bir sahifalik eslatma: Actions oynasi, chiqish kodlari, fayl xatolari va o'quvchi darsidagi namunalarning haqiqiy natijasi. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen25(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET25;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'cicd-2-mentor-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s25Segments(passed), [passed]);
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
            <SummaryMap25 hl={hl} />
            <div className="mk-plan">{SUM25.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>Uyga vazifa · 30–45 daqiqa</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK25.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> Actions tarixida ikki job'li yashil run · test (20) logida v20 · bitta qizil va undan keyingi yashil.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kursdagi keyingi mentor darsi</h5><div style={{ fontSize: 15, fontWeight: 700 }}>Telegraf + PostgreSQL</div><div style={{ fontSize: 13.5, color: T.ink2 }}>bot eslab qoladi: holat bazada</div></div>
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
      <p className="mk-eyebrow">Mentor kursi · CI/CD</p>
      <h1>{LESSON_TITLE}</h1>
      <p>Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.</p>
      <ul>
        {["Jami taxminan 1 soat: ovoz ~25 daqiqa · uch amaliyot ~35 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 12-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: «CI/CD nima va nega» mentor darsi o'tilgan · lentali GitHub reposingiz (.github/workflows/ci.yml) · VS Code", "Haqiqiy: har Actions oynasi — o'quvchi reposi nusxasidagi 28 ta GitHub Actions tajribasidan (01.11.2026)"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <CoverStart onStart={onStart} resume={resume} />
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, ScreenP1, Screen7, Screen8, Screen9, Screen10, Screen11, ScreenP2, Screen13, Screen14, Screen15, Screen16, Screen17, Screen18, ScreenP3, Screen20, Screen21, Screen22, Screen23, Screen24, Screen25];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function GithubActionsMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
