# F-1018-08 · m10-11 PmPitchReviewLesson (LMS 12-Modul 11-dars) 12 → 11 (222-qonun). Zaxiradan quradi: python3 f1018h.py
import re, sys
R = '/home/kali/Desktop/internetLesson'
SRC = f'{R}/arxiv/F-1018-08-oldin/PmPitchReviewLesson.jsx'
DST = f'{R}/src/10-Modull/PmPitchReviewLesson.jsx'
s = open(SRC, encoding='utf8').read()
def rep(old, new, label=''):
    global s
    c = s.count(old)
    if c != 1: print(f'❌ {label or old[:70]!r}: topildi {c}'); sys.exit(1)
    s = s.replace(old, new)
def cut(a_m, b_m, label):
    global s
    a = s.find(a_m); b = s.find(b_m, a + 1)
    if a < 0 or b <= a: print(f'❌ cut {label}: {a} {b}'); sys.exit(1)
    out = s[a:b]; s = s[:a] + s[b:]; print(f'  kesildi {label}: {out.count(chr(10))} qator'); return out

rep("lessonId: 'pm-m10d11-v1'", "lessonId: 'pm-m10d11-v2'")
rep("// 12 ekran (MD v3): kirish · reja · 2 tushuncha · 1-savol · 3 mustaqil ish (da'volar → dalillar → tuzatilgan pitch) · yakuniy savol · podium · kartochkalar · yakun",
    "// 11 ekran (v2 · F-1018-08 · 222-qonun): kirish · reja · 2 tushuncha · 3 mustaqil ish (da'volar → dalillar → tuzatilgan pitch) · yakuniy savol · JUFTLIK (tuzatilgan pitch sherikka 2 daq, «qaysi gapga dalil yo'q?») · podium · yakun.\n//   Olindi: 1-savol (s4), kartochkalar. Yakuniy MD: feedback/F-1018-pitch/YAKUNIY-06-m10-11.md", 'header')
a = s.index('const SCREEN_META = ['); b = s.index('const TOTAL_SCREENS')
s = s[:a] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },          // 0 · QKirish
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },            // 1 · QReja
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 2 · da'vo va dalil
  { id: 's3',  type: 'exploration', template: 'custom',   scored: false, scope: null },            // 3 · son, manba, qachon
  { id: 's5',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 4 · ustaxona 1/3: da'volar
  { id: 's6',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 5 · ustaxona 2/3: dalillar
  { id: 's7',  type: 'practice',    template: 'custom',   scored: false, scope: null },            // 6 · ustaxona 3/3: tuzatilgan pitch
  { id: 's8',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },         // 7 · yakuniy savol
  { id: 'sjuft', type: 'practice',  template: 'custom',   scored: false, scope: null },            // 8 · juftlik: tuzatilgan pitch 2 daq, «qaysi gapga dalil yo'q?» (222.1, 2-raund 1:1 bilan)
  { id: 'podium',   type: 'stats',  template: 'custom',   scored: false, scope: null },            // 9 · podium
  { id: 's11', type: 'summary',     template: 'custom',   scored: false, scope: null }             // 10 · QYakun
];
""" + s[b:]
rep("const INLINE_KEYS = { s4: 2, s8: 1 };", "const INLINE_KEYS = { s8: 1 };")
a = s.index('const RECAPS = {'); b = s.index('\n};', a) + 3
m = re.search(r"\n  8: \{.*?\n  \},?", s[a:b], re.S)
if not m: print('❌ RECAPS 8'); sys.exit(1)
s = s[:a] + 'const RECAPS = {' + m.group(0).replace('\n  8: {', '\n  7: {').rstrip(',') + '\n};' + s[b:]
a = s.index('const Q_LABELS = {'); b = s.index('\n};', a) + 3
s = s[:a] + """const Q_LABELS = {
  7: { uz: "Yakuniy — Va'da o'rniga", ru: 'Итоговый — Вместо обещания' }
};""" + s[b:]

cut("// ===== SCREEN 4 — 1-SAVOL", "// ===== MUSTAQIL ISH (5–7)", "s4 test")
cut("// ===== 🃏 KARTOCHKALAR", "// ===== UYGA VAZIFA — PM HwCard", "kartochkalar")

# indekslar: s5 5→4 · s6 6→5 · s7 7→6
rep("  const davolar = (answers && answers[5] && answers[5].davolar) || [];", "  const davolar = (answers && answers[4] && answers[4].davolar) || [];", 'idx 1')
c = s.count("    const s5 = (answers && answers[5]) || {};");
if c != 1: print('❌ idx 2', c); sys.exit(1)
s = s.replace("    const s5 = (answers && answers[5]) || {};", "    const s5 = (answers && answers[4]) || {};")
rep("  const s5 = (answers && answers[5]) || {};\n", "  const s5 = (answers && answers[4]) || {};\n", 'idx 3')
rep("  const dal = (answers && answers[6] && answers[6].dalillar) || {};", "  const dal = (answers && answers[5] && answers[5].dalillar) || {};", 'idx 4')
rep("  const s5 = answers[5], s6 = answers[6], s7 = answers[7];", "  const s5 = answers[4], s6 = answers[5], s7 = answers[6]; // v2 indekslari (s4 test olindi)", 'idx 5')

# root
rep("""  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });""",
"""  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));""", 'root nav')
s = re.sub(r"\n  // 🃏 Flashcard[^\n]*", "", s)
rep("const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, ScreenPodium, ScreenFlashcards, SummaryScreen];",
    "const screens = [Screen0, Screen1, Screen2, Screen3, Screen5, Screen6, Screen7, Screen8, ScreenJuftlik, ScreenPodium, SummaryScreen];")

# nishon: dateCheck (s4 test) → pairCheck (juftlik)
rep("""  dateCheck: { icon: '📅', name: 'Date Check!', desc: { uz: 'Dalilda nima yetishmasligini birinchi urinishda topdingiz', ru: 'С первой попытки нашли, чего не хватает доводу' } },""",
    """  pairCheck: { icon: '🤝', name: 'Pair Check!', desc: { uz: 'Tuzatilgan pitchni sherigingizga aytib, har gapni dalilga tekshirtirdingiz', ru: 'Рассказали исправленный питч партнёру и проверили каждую фразу на довод' } },""", 'pairCheck')
rep("const ACH_TRIGGERS = { s2: 'claimFinder', s3: 'threeParts', s4: 'dateCheck', s7: 'pitchFixed' };",
    "const ACH_TRIGGERS = { s2: 'claimFinder', s3: 'threeParts', s7: 'pitchFixed', sjuft: 'pairCheck' };")

# REJA 4-qadam
rep("""  { t: { uz: "Pitchingizni Mentor bilan yakkama-yakka ko'rasiz", ru: "Разберёте питч с Ментором на встрече один на один" }, teg: { uz: 'yakkama-yakka', ru: "встреча один на один" } }""",
    """  { t: { uz: "Tuzatilgan pitchni sherigingizga 2 daqiqada aytasiz — u qaysi gapga dalil yo'qligini belgilaydi; Mentor bilan yakkama-yakka ko'rasiz", ru: 'Расскажете исправленный питч партнёру за 2 минуты — он отметит, у какой фразы нет довода; разберёте питч с Ментором один на один' }, teg: { uz: 'juftlik · yakkama-yakka', ru: 'пара · один на один' } }""", 'REJA')

JUFT = r"""// ===== SCREEN JUFTLIK — TUZATILGAN PITCH SHERIKKA (222.1 · F-1018-08: 2 daqiqa aytiladi, sherik har gapga «Dalil bor» / «Dalil yo'q» qo'yadi; Mentor yakkama-yakka o'tkazayotganda qolganlar shu ishda — 1:1 + juftlik = 2 raund; ballsiz, nishon pairCheck) =====
const JF_VAQT = 120;
const mssJ = (sek) => { const v = Math.max(0, Math.floor(sek || 0)); return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`; };
const ScreenJuftlik = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor, isStudent } = useJonli();
  const juft = isStudent;
  const st = storedAnswer || {};
  const natija = useMemo(() => (isMentor ? null : lsO(NATIJA_KEY)), []); // eslint-disable-line
  const gaplar = useMemo(() => {
    if (isMentor || !natija) return mentorBolaklar().flatMap(b => b.gaplar.filter(g => g.holat !== 'demo').map(g => ({ k: g.k, bolak: b.id, t: g.t })));
    return (natija.davolar || []).filter(d => d.qaror !== 'olib-tashlandi').map(d => ({ k: d.id, bolak: d.bolak, t: d.yangiGap || d.gap }));
  }, []); // eslint-disable-line
  const [vaqt, setVaqt] = useState(st.vaqt ?? 0);
  const [yur, setYur] = useState(false);
  const [toxtadi, setToxtadi] = useState(st.vaqt != null);
  const [belgi, setBelgi] = useState(st.belgi || {});
  const sentRef = useRef(!!st.solved);
  useEffect(() => { if (!yur) return undefined; const t = setInterval(() => setVaqt(v => v + 1), 1000); return () => clearInterval(t); }, [yur]);
  const pitchYoq = !isMentor && !natija;
  const hammasi = gaplar.length > 0 && gaplar.every(g => belgi[g.k]);
  const done = pitchYoq || (toxtadi && hammasi);
  const yoqSoni = gaplar.filter(g => belgi[g.k] === 'yoq').length;
  useEffect(() => {
    if (!done || pitchYoq || isMentor || sentRef.current) return;
    sentRef.current = true;
    lsY(NATIJA_KEY, { ...natija, juftlik: { vaqt, belgi, savedAt: Date.now() } });
    onAnswer(screen, { stage: 'juftlik', screenIdx: screen, solved: true, correct: true, picked: true, vaqt, belgi, yoqSoni });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'juftlik', 0, true, 0);
  }, [done]); // eslint-disable-line
  const boshla = () => { setVaqt(0); setYur(true); setToxtadi(false); };
  const toxtat = () => { setYur(false); setToxtadi(true); };
  const qoy = (k, v) => { if (!toxtadi || isMentor) return; setBelgi(b => ({ ...b, [k]: v })); };
  const bolaklar = isMentor || !natija
    ? mentorBolaklar()
    : BOLAK.map(b => ({ id: b.id, gaplar: [{ k: b.id, t: (natija.bolaklar && natija.bolaklar[b.id]) || '—', holat: 'oddiy' }] }));
  const mentorT = pitchYoq ? { uz: "Tuzatilgan pitch hali saqlanmagan — oldingi ekranga qaytib saqlang, keyin sherigingizga ayting.", ru: 'Исправленный питч ещё не сохранён — вернитесь на предыдущий экран и сохраните, потом расскажите партнёру.' }
    : done ? (yoqSoni ? { uz: "Dalilsiz gaplar belgilandi: uyga vazifada ularga dalil qo'shasiz yoki olib tashlaysiz.", ru: 'Фразы без довода отмечены: в домашнем задании добавите к ним довод или уберёте.' } : { uz: 'Har gapda dalil topildi — pitch yakkama-yakka ko\'rikka tayyor.', ru: 'У каждой фразы нашёлся довод — питч готов к разбору один на один.' })
    : toxtadi ? (juft ? { uz: "Endi qurilmani sherigingizga bering — u har gapga «Dalil bor» yoki «Dalil yo'q» qo'yadi.", ru: 'Теперь дайте устройство партнёру — он поставит каждой фразе «Довод есть» или «Довода нет».' } : { uz: "Endi har gapni o'zingiz belgilang: zal «Qayerdan bilasiz?» desa, javob bormi?", ru: 'Теперь отметьте каждую фразу сами: если зал спросит «Откуда знаете?», есть ли ответ?' })
    : (juft ? { uz: "Tuzatilgan pitchingizni sherigingizga 2 daqiqada ayting; u tinglab, qaysi gapga dalil yo'qligini belgilaydi.", ru: 'Расскажите исправленный питч партнёру за 2 минуты; он слушает и отмечает, у какой фразы нет довода.' } : { uz: 'Tuzatilgan pitchingizni ovoz chiqarib 2 daqiqada ayting, keyin har gapni dalilga tekshiring.', ru: 'Расскажите исправленный питч вслух за 2 минуты, потом проверьте каждую фразу на довод.' });
  const navY = isMentor || done ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !toxtadi ? tr({ uz: '2 daqiqada ayting', ru: 'Расскажите за 2 минуты' }) : tr({ uz: 'Har gapni belgilang', ru: 'Отметьте каждую фразу' });
  return (
    <Stage eyebrow={juft ? tr({ uz: 'Juftlikda ish · tuzatilgan pitch', ru: 'Работа в паре · исправленный питч' }) : tr({ uz: 'Mustaqil ish · tuzatilgan pitch', ru: 'Самостоятельная работа · исправленный питч' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={navY} onClick={onNext} /></>}>
      <QMustaqil
        sarlavha={juft ? tr({ uz: <>Tuzatilgan pitchingizda sherigingiz <A>dalilsiz gap</A> topadimi?</>, ru: <>Найдёт ли партнёр в исправленном питче <A>фразу без довода</A>?</> }) : tr({ uz: <>Tuzatilgan pitchingizda <A>dalilsiz gap</A> qoldimi?</>, ru: <>Осталась ли в исправленном питче <A>фраза без довода</A>?</> })}
        mentor={<Mentor>{tr(mentorT)}</Mentor>}
        qadamlar={<div className="pd-jf">
          <div className="pd-jf-ch">
            <PitchVaraq sarlavha={isMentor || !natija ? <MentorSar /> : tr({ uz: 'Tuzatilgan pitch', ru: 'Исправленный питч' })} bolaklar={bolaklar} />
            {pitchYoq && <QTugma ikkinchi onClick={onPrev}>{tr({ uz: 'Pitchni saqlashga qaytish', ru: 'Вернуться и сохранить питч' })}</QTugma>}
          </div>
          <div className="pd-jf-on">
            {!isMentor && !pitchYoq && <div className={cx('pd-jf-tmr', yur && 'yur')}>
              <b className={cx(vaqt > JF_VAQT && 'oshdi')}>{mssJ(vaqt)}</b>
              {yur && <span className="pd-jf-gapir">{tr({ uz: 'Hozir siz gapirasiz', ru: 'Сейчас говорите вы' })}</span>}
              <span className="pd-jf-tug">
                {!yur && !toxtadi && <QTugma className="pd-halqa" onClick={boshla}>{tr({ uz: '2 daqiqani boshlash', ru: 'Запустить 2 минуты' })}</QTugma>}
                {yur && <QTugma className="pd-halqa" onClick={toxtat}>{tr({ uz: "To'xtatish", ru: 'Остановить' })}</QTugma>}
                {!yur && toxtadi && !done && <QTugma ikkinchi onClick={boshla}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</QTugma>}
              </span>
            </div>}
            {!pitchYoq && <>
              <span className="q-yorliq">{juft ? tr({ uz: "Sherik varag'i: har gapga dalil bormi?", ru: 'Лист партнёра: есть ли довод у каждой фразы?' }) : tr({ uz: 'Har gapga dalil bormi?', ru: 'Есть ли довод у каждой фразы?' })}</span>
              {gaplar.map(g => { const v = belgi[g.k]; return (
                <div key={g.k} className={cx('pd-jf-q', v === 'bor' && 'bor', v === 'yoq' && 'yoq', !toxtadi && 'kutadi')}>
                  <span className="pd-jf-nom">{bolakNom(g.bolak)}</span>
                  <span className="pd-jf-t">{g.t}</span>
                  <span className="pd-jf-b">
                    <QChip holat={v === 'bor' ? 'ok' : undefined} disabled={!toxtadi || isMentor} onClick={() => qoy(g.k, 'bor')}>{tr({ uz: '✓ Dalil bor', ru: '✓ Довод есть' })}</QChip>
                    <QChip holat={v === 'yoq' ? 'err' : undefined} disabled={!toxtadi || isMentor} onClick={() => qoy(g.k, 'yoq')}>{tr({ uz: "✗ Dalil yo'q", ru: '✗ Довода нет' })}</QChip>
                  </span>
                </div>
              ); })}
              {!gaplar.length && <p className="pd-kul">{tr({ uz: "Tuzatilgan pitchda tekshiriladigan da'vo qolmagan — pitchni 2 daqiqada ayting.", ru: 'В исправленном питче не осталось утверждений для проверки — расскажите питч за 2 минуты.' })}</p>}
              {done && !isMentor && <QXulosa>{yoqSoni
                ? tr({ uz: `${yoqSoni} ta gapga «Dalil yo'q» qo'yildi — uyga vazifada dalil qo'shasiz yoki olib tashlaysiz.`, ru: `${yoqSoni} фраз. отмечено «Довода нет» — в домашнем задании добавите довод или уберёте.` })
                : tr({ uz: "Har gapda dalil bor — tuzatilgan pitch Mentor ko'rigiga tayyor.", ru: 'У каждой фразы есть довод — исправленный питч готов к разбору с Ментором.' })}</QXulosa>}
            </>}
          </div>
        </div>}
        forma={null}
      >
        <Ustoz matn={[{ uz: "Yakkama-yakka ko'rik davomida qolganlar shu ishda: A 2 daqiqada aytadi, B har gapga dalil bor-yo'qligini belgilaydi; keyin almashadilar (≈ 6 daqiqa). «Dalil yo'q» belgisi — javob emas, savol: «Bu son qayerdan?». Chaqirilgan o'quvchi pitchini sizga ko'rsatadi, qaytib kelib juftlikni davom ettiradi.", ru: 'Пока идёт разбор один на один, остальные работают в парах: A рассказывает за 2 минуты, B отмечает у каждой фразы, есть ли довод; потом меняются (≈ 6 минут). Отметка «Довода нет» — не приговор, а вопрос: «Откуда это число?». Вызванный ученик показывает питч вам и, вернувшись, продолжает работу в паре.' }]} />
        <MentorPracticeStats live={live} screen={screen} sanoq={[{ y: { uz: 'Sherikka aytib, belgilatganlar', ru: 'Рассказали партнёру и получили отметки' }, zona: PRACTICE_BASE + screen }]} />
      </QMustaqil>
    </Stage>
  );
};

"""
rep("// ===== 🏅 BADGES (nishonlar)", JUFT + "// ===== 🏅 BADGES (nishonlar)", 'ScreenJuftlik joyi')

rep("        .lesson-root .q-mustaqil { max-width: none; }\n", """        .lesson-root .q-mustaqil { max-width: none; }
        /* Juftlik: tuzatilgan pitch sherikka (F-1018-08) */
        .pd-jf { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 16px; align-items: start; width: 100%; }
        .pd-jf-ch, .pd-jf-on { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
        .pd-jf-tmr { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; padding: 10px 14px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .pd-jf-tmr > b { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 700; letter-spacing: .02em; }
        .pd-jf-tmr > b.oshdi { color: ${T.err}; }
        .pd-jf-gapir { font-size: 13px; color: ${T.ink2}; }
        .pd-jf-tug { display: flex; gap: 8px; margin-left: auto; }
        .pd-jf-q { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 12px; background: ${T.paper}; border: 1px solid ${T.line}; }
        .pd-jf-q.kutadi { opacity: .72; }
        .pd-jf-q.bor { border-color: ${T.ok}; background: ${T.okFon}; }
        .pd-jf-q.yoq { border-color: ${T.err}; }
        .pd-jf-nom { font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: ${T.ink2}; }
        .pd-jf-t { font-size: 14px; line-height: 1.45; }
        .pd-jf-b { display: flex; flex-wrap: wrap; gap: 8px; }
        @media (max-width: 760px) { .pd-jf { grid-template-columns: 1fr; } }
""", 'css juft')

# o'lik CSS (2 o'tish)
def dead_classes(src):
    css = src[src.index('<style>{`'):src.index('`}</style>')]
    jsx = src[:src.index('<style>{`')] + src[src.index('`}</style>'):]
    cls = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", css))
    return {c for c in cls if not re.search(r"['\"` ]" + re.escape(c) + r"['\"` -]|className=\{`[^`]*\b" + re.escape(c) + r"\b|cxx?\([^)]*['\"]" + re.escape(c) + r"['\"]", jsx)}
d0 = dead_classes(open(SRC, encoding='utf8').read()); DEAD = dead_classes(s) - d0
ca = s.index('<style>{`'); cb = s.index('`}</style>')
lines = s[ca:cb].split('\n'); out = []; i = 0; removed = 0
while i < len(lines):
    L = lines[i]; st = L.strip(); sel = st.split('{')[0] if '{' in st else ''
    classes = set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", sel)) if re.match(r"^(?:[a-z]+)?\.", sel) else set()
    if classes and classes <= DEAD:
        depth = st.count('{') - st.count('}'); removed += 1; i += 1
        while depth > 0 and i < len(lines): depth += lines[i].count('{') - lines[i].count('}'); removed += 1; i += 1
        continue
    out.append(L); i += 1
css = '\n'.join(out)
out2 = []; audit = []
for L in css.split('\n'):
    st = L.strip(); groups = [g.split('{')[0].strip() for g in re.split(r"\}", st) if '{' in g]
    if groups and st.count('{') == st.count('}') and all(',' not in g and (set(re.findall(r"\.([a-zA-Z][a-zA-Z0-9_-]*)", g)) & DEAD) for g in groups):
        removed += 1; audit.append(st[:90]); continue
    out2.append(L)
css = '\n'.join(out2)
if audit: print("  2-o'tish satrlari:"); [print('    ', a) for a in audit]
for kf in []:  # F-1018-10: keyframes OLIB TASHLANMAYDI — qolipCss (fade-in-up) va jonli-modul darsdan tashqarida nom kutadi
    body = re.sub(r"@keyframes " + re.escape(kf) + r"\b[^{]*\{", "", css)
    if not re.search(r"\b" + re.escape(kf) + r"\b", body):
        m = re.search(r"[ \t]*@keyframes " + re.escape(kf) + r"\s*\{", css); j = m.end(); depth = 1
        while depth > 0: depth += (css[j] == '{') - (css[j] == '}'); j += 1
        if css[j:j+1] == '\n': j += 1
        removed += css[m.start():j].count('\n'); css = css[:m.start()] + css[j:]
css = re.sub(r"\n[ \t]*/\* === 🃏 FLASHCARDS[^\n]*", "", css)
s = s[:ca] + css + s[cb:]
print(f"  o'lik CSS: {len(DEAD)} klass, {removed} qator; qolgan: {sorted(dead_classes(s) - d0)}")
open(DST, 'w', encoding='utf8').write(s)
print('✅ yozildi', DST, s.count('\n') + 1, 'qator')
