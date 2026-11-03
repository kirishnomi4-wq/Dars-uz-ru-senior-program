// ============================================================
//  21 · O'z-sinov — 8 savol (Nest/PG-1 bilan bir xil mexanika; M12)
// ============================================================
const FINAL = MDT[21].final;
function Screen21(p) {
  const st = p.stored || {};
  const segs = useMemo(() => {
    const sc = (st.res || []).filter((x) => x && x.correct).length;
    const text = !st.showResult
      ? "Hammasini ko'rib chiqdingiz, endi o'zingizni tekshiring. Yakuniy sinov, sakkiz savol: so'rov va ulanish, token, uch holat va hodisa. Har savolda bitta urinish, javobdan keyin to'g'risi va izohi ochiladi. Olti va undan ko'p, dars o'zlashtirilgan. Kam bo'lsa, ko'rsatilgan ekranlarga qaytib, sinovni qayta topshirasiz."
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
    if (r.filter(Boolean).length === FINAL.length) setTimeout(() => audio.pushOneOff(voice(sc >= 6 ? "Dars o'zlashtirildi. Endi m10-02 dagi ulanish, belgi va sinfdagi holatlar sizga tanish bo'ladi." : "Hali bir necha joy mustahkam emas. Ko'rsatilgan ekranlarga qayting, keyin sinovni qayta topshiring.")), 400);
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
//  22 · Yakun (M13)
// ============================================================
const SUM22 = [
  { k: 'yol', t: "So'rov–javobda yo'l faqat so'rovda ochiladi; doimiy ulanishda ikkala tomon istagan payt yuboradi", st: ['app', 'yol', 'be'] },
  { k: 'gw', t: "Gateway: token ulanish ochilayotganda tekshiriladi; yaroqsiz — disconnect() va return", st: ['yol', 'be'] },
  { k: 'tok', t: "Tokensiz: bir lahza «ulangan», keyin «ulanmagan» (io server disconnect, active=false)", st: ['app', 'be'] },
  { k: 'hol', t: "Backend o'chsa «ulanmoqda» va o'zi qaytadi (5 s gacha); uchish rejimi — 45 s gacha", st: ['app', 'yol'] },
  { k: 'hod', t: "Hodisa oyin-ozgardi { oyinId, sabab } — son qayta so'raladi; m12-dars-02 da hodisa yo'q", st: ['be', 'yol', 'app'] },
  { k: 'dars', t: "m10-02: vaqt A1 ga; Render uyg'onishi va uchish rejimi kechikishini oldindan ayting", st: ['app'] },
];
const STATIONS22 = [['app', 'ilova · belgi', T.blue], ['yol', 'doimiy ulanish', T.purple], ['be', 'Backend · gateway', T.green]];
function SummaryMap22({ hl }) {
  const cur = SUM22.find((x) => x.k === hl);
  const on = (k) => hl === 'all' || !cur || cur.st.includes(k);
  return <div className="mk-light" style={{ padding: 16 }}>
    <div className="mk-tag">Bugungi dars — ulanish yo'li</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 6 }}>
      {STATIONS22.map(([k, n, c], i) => <div key={k} className={`mk-box${cur && cur.st.includes(k) ? ' hl' : ''}`} style={{ '--c': c, padding: '10px 6px', textAlign: 'center', opacity: on(k) ? 1 : 0.35, animation: `mk-up .4s ${i * 0.06}s ease both` }}><h4 style={{ fontSize: 12.5, margin: 0 }}>{n}</h4></div>)}
    </div>
  </div>;
}
const HOMEWORK22 = [
  { t: "Gateway: o'zgarish bazaga yozilgach hodisa — m12-dars-03 dagi oyinOzgardi kabi (o'z loyihangizda yoki maydon-jamoa nusxasida)", c: ["this.server.emit('…', { id, sabab });"] },
  { t: 'Ikki klient: ikki token bilan klient.js — ikkalasi ulangan', c: ['TOKEN=<1-token> node klient.js', 'TOKEN=<2-token> node klient.js'] },
  { t: "Hodisa: o'zgarish → ikkinchi klientda hodisa → GET bilan yangi son", c: [] },
  { t: "Uzilish: Backend'da Ctrl+C → ulanmoqda → npm run start → ulangan", c: [] },
  { t: "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying", c: ['git add . && git commit -m "real vaqt hodisa"', 'git push'] },
];
const CHEATSHEET22 = `# WebSocket — mentor eslatmasi (doimiy ulanish)
## Ulanish
so'rov–javob: yo'l faqat ilova so'raganda; Backend o'zi yubora olmaydi (Vali 201 — Ali'da 9 / 10 qoladi)
doimiy ulanish: ilova bir marta ulanadi, yo'l ochiq; socket.io imkon bo'lsa WebSocket orqali (transport: websocket)
ilova: io(API, { auth: { token } }) — token ulanish ochilayotganda yuboriladi (mobil/src/ulanish.ts)
## Gateway (backend/src/oyinlar.gateway.ts)
handleConnection: token = ulanish.handshake.auth?.token → tokenYaroqli (JWT_SECRET) → yo'q bo'lsa disconnect(); return;
return unutilsa: Backend «ulandi: o'yinchi null» deb yozadi (klient baribir uzilgan)
## Uch holat (active)
ulangan — connect · ulanmoqda — active=true (transport close, ping timeout, connect_error) · ulanmagan — active=false (io server disconnect, io client disconnect)
Backend Ctrl+C → ulanmoqda, urinish 1 s, 2 s, keyin har 5 s → Backend yongach 5 s gacha ichida ulangan
uchish rejimi / muzlash: ping timeout 45 s da (pingInterval 25 s + pingTimeout 20 s)
## Hodisa
oyin-ozgardi { oyinId, sabab } — sabab: qoshildi · chiqdi · tasdiqladi · navbatga-yozildi · elon-berildi; son yo'q — GET /oyinlar
m12-dars-02-done: hodisa hali yuborilmaydi · m12-dars-03-done: o'zgarish bazaga yozilgach server.emit
## Mentor amaliyoti (lokal)
git checkout -f m12-dars-02-done (main'da backend/ yo'q) · cd backend · npm ci · cp .env.example .env · npm run start
.env yo'q: JWT_SECRET yo'q — backend/.env ga yozing · parol xato: password authentication failed · takror: 409
## O'quvchi darsidagi so'zlar (m10-02)
yopiq / ochiq yo'l · konvert (hodisa) · belgi (holat) · tinglovchi (ulanish.on)
## Sizning uyga vazifangiz
bitta hodisa (o'zgarish yozilgach) + ikki klient + uzilishni ko'rish → GitHub → repo linki platformadagi uyga vazifaga`;
const s22Segments = (passed) => [
  passed
    ? sg('a', "<b>Barakalla!</b> Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz", "Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.", { hl: 'all' })
    : sg('a', "Dars oxiriga yetdingiz — sinovni <b>qayta topshirishni</b> maslahat beraman", "Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.", { hl: 'all' }),
  sg('b1', "So'rov–javob — yo'l so'rovda; <b>doimiy ulanish</b> — ochiq yo'l", "Birinchi: so'rov va javobda yo'l faqat ilova so'raganda ochiladi. Doimiy ulanishda ikkala tomon istagan payt yuboradi.", { hl: 'yol' }),
  sg('b2', "Gateway: token <b>ulanishda</b> tekshiriladi, keyin return", "Ikkinchi: gateway tokenni ulanish ochilayotganda tekshiradi. Yaroqsiz bo'lsa disconnect va return.", { hl: 'gw' }),
  sg('b3', "Tokensiz — bir lahza ulangan, keyin <b>ulanmagan</b>", "Uchinchi: tokensiz ulanish bir lahza ochiladi va Backend yopadi. Belgi ulanmagan, ilova o'zi qayta urinmaydi.", { hl: 'tok' }),
  sg('b4', "Backend o'chsa <b>ulanmoqda</b>; uchish rejimi — 45 soniya", "To'rtinchi: Backend o'chsa belgi ulanmoqda va ilova o'zi qaytadi. Uchish rejimida belgi qirq besh soniyagacha kech qoladi.", { hl: 'hol' }),
  sg('b5', "Hodisada <b>son yo'q</b> — qayta so'raladi", "Beshinchi: oyin ozgardi hodisasida faqat o'yin va sabab. Yangi son Backend'dan qayta so'raladi. m12 dars ikki done da hodisa hali yo'q.", { hl: 'hod' }),
  sg('b6', "m10-02: vaqtni <b>A1 ga</b> bering", "Oltinchi: o'quvchi darsida vaqtning ko'pi birinchi amaliyotga. Render va uchish rejimidagi kechikishni oldindan ayting.", { hl: 'dars' }),
  sg('hw', "<b>Uyga vazifa</b>: bitta hodisa, ikki klient va uzilish", "Uyga vazifa: o'z loyihangizda yoki maydon jamoa nusxasida bitta hodisa qo'shing: o'zgarish bazaga yozilgach yuborilsin. Ikkinchi klient uni olib, sonni qayta so'rasin. Bir marta Backend'ni o'chirib, holatlarni ko'ring.", { hl: 'hw' }),
  sg('hw2', "<b>Repo linkini platformaga</b> qo'ying — boshqa hech narsa kerak emas", "GitHub'ga chiqaring va repo linkini platformadagi uyga vazifaga qo'ying, boshqa hech narsa kerak emas. Qirq-oltmish daqiqa.", { hl: 'hw' }),
  sg('c', "<b>Eslatmani oling</b>: ulanish, gateway, holatlar va hodisa — bir sahifada", "Pastda bir sahifalik eslatma: ulanish, gateway, uch holat va vaqtlar, hodisa, mentor amaliyoti va o'quvchi tili. Nusxalab yoki yuklab oling, sinfda yoningizda tursin.", { hl: 'note' }),
  sg('z', "Rahmat! <b>Darsni yakunlash</b> tugmasini bosing", "Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.", { hl: 'note' }),
];
function Screen22(p) {
  const completeLesson = useNextLessonAccess();
  const once = useRef(false);
  useEffect(() => { if (once.current) return; once.current = true; completeLesson().catch(() => {}); }, [completeLesson]);
  const sheet = CHEATSHEET22;
  const download = () => { try { const b = new Blob([sheet], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'websocket-mentor-eslatma.md'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); } catch (e) {} };
  const passed = (p.testScore || 0) >= 6;
  const segments = useMemo(() => s22Segments(passed), [passed]);
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
            <SummaryMap22 hl={hl} />
            <div className="mk-plan">{SUM22.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? 'hl' : ''} style={{ animation: 'mk-up .45s ease both' }}><b>0{i + 1}</b><span>{it.t}</span></div>)}</div>
          </>)}
          {phase === 'hw' && <div className="mk-light" style={{ padding: 16, animation: 'mk-up .45s ease both' }}>
            <div className="mk-tag" style={{ color: T.accent }}>Uyga vazifa · 40–60 daqiqa</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {HOMEWORK22.map((h, i) => <div key={i} className="mk-step" style={{ animation: `mk-up .4s ${i * 0.12}s ease both` }}>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: T.accent, minWidth: 20 }}>{i + 1}</span>
                <div className="t"><b style={{ marginBottom: 2 }}>{h.t}</b>{h.c.map((c) => <div key={c} className="cmd"><code>{c}</code><CopyBtn text={c} /></div>)}</div>
              </div>)}
            </div>
            <div className="mk-rule" style={{ marginTop: 12 }}><b>Tekshiruvchi qaraydi:</b> token ulanishda · disconnect'dan keyin return · hodisada son yo'q · ikkinchi klient qayta so'raydi.</div>
          </div>}
          {phase === 'note' && <div className="mk-light" style={{ padding: 14, animation: 'mk-up .45s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="mk-tag" style={{ margin: 0 }}>Mentor eslatmasi · 1 sahifa</div>
              <div style={{ display: 'flex', gap: 8 }}><CopyBtn text={sheet} /><button className="mk-copy" onClick={download}>yuklab olish (.md)</button></div>
            </div>
            <pre style={{ margin: '10px 0 0', font: `12px/1.5 ${MONO}`, whiteSpace: 'pre-wrap', color: T.ink2, maxHeight: 300, overflow: 'auto' }}>{sheet}</pre>
            <div className="mk-card" style={{ marginTop: 10, borderColor: T.accent }}><h5 style={{ color: T.accent }}>Kursdagi keyingi mentor darsi</h5><div style={{ fontSize: 15, fontWeight: 700 }}>WebSocket: ulanish uzilsa</div><div style={{ fontSize: 13.5, color: T.ink2 }}>uzilish, takror hodisa, qayta ulanish</div></div>
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
      <p className="mk-eyebrow">Mentor kursi · WebSocket</p>
      <h1>{LESSON_TITLE}</h1>
      <p>Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.</p>
      <ul>
        {["Jami taxminan 1 soat: ovoz ~20 daqiqa · uch amaliyot ~35 daqiqa · 4 tekshiruv · o'z-sinov 8 savol. 8-ekrandan keyin tanaffus qilsangiz bo'ladi", "Kerak: NestJS va PostgreSQL darslari o'tilgan (lokal PostgreSQL) · Node.js 20+ · VS Code · ikkita terminal", "Loyiha: o'quvchi reposi maydon-jamoa (m12-dars-02-done va m12-dars-03-done) va kichik klient (klient.js)"].map((x) => <li key={x}>{x}</li>)}
      </ul>
      <button className="mk-btn ready" onClick={onStart}>Boshlash →</button>
    </div></div>
  );
}
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, ScreenP1, Screen8, Screen9, Screen10, Screen11, Screen12, ScreenP2, Screen14, Screen15, Screen16, ScreenP3, Screen18, Screen19, Screen20, Screen21, Screen22];
const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\d/.test(S.name)).length;
export default function WsBasicsMentorLesson({ studentName, lang = 'uz', onFinished, startAt }) {
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
