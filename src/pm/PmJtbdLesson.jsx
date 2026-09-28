import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';


// ============================================================
// PM · M3-D3 — BITTA NATIJA, UCH XIL SABAB (funksional · ijtimoiy · emotsional vazifa)
// Senariy-manba: pm-senariylar/M3-D3-JTBD.md (GATE S tasdiqlangan 2026-09-28, F-0928-06;
//   METODIST KORREKTURASI + GATE S javoblari qo'llangan: koding = Debug Challenge,
//   olam = ingliz tili markazi sayti, TUR = aralash, 1-savol «Menga amalda nima beradi?»).
// Misol-ip: maktab yonidagi ingliz tili markazining sayti (91/95/96c-qonun).
// Kirish-artefakt: pm-m3d2-stories (M3-D2 · 3 hikoya) — FAQAT O'QILADI.
// Chiqish-artefakt: pm-m3d3-jobs.
// INFRA MANBAI: src/3-Modull/PmLesson8.jsx (P0 relslari) — jonli relslar, Stage, QuestionScreen,
//   MentorTestStats, RecapOverlay, PairTimer, ScreenPodium, CodeStrike-arena, nishonlar.
// Imzo-vizual: «UCH NUR» (mahsulot-karta → uch rangli tur-uyasi).
// BIR TILLI (UZ): matnlar {uz} obyektlarda — RU alohida sweep'da qo'shiladi.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

// ============================================================
// PM-STUDIA IDENTITET (P0 dan AYNAN)
// ============================================================
const T = {
  bg: '#F2F0FA', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4',
  paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', accentVivid: '#6E4BFF',
  success: '#12A968', successSoft: '#E4F5EC', blue: '#0E86C4', blueSoft: '#E1F3FB', link: '#5B3DE6',
  line: '#E7E3F4', err: '#E5484D', errSoft: '#FCE7E8',
  shadowBase: '40, 34, 82'
};

// Jonli dars (live) — umumiy modul: src/live/ (hook + darvoza + belgi + mijoz + server-progress). Inline nusxa 2026-09-03 da ko'chirildi.
import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers, setLiveLang , buildResultDetails, sealPayload, useAutoNext } from '../live/index.js';






const LangContext = createContext('uz');
// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
// QAT'IY: tr() ni modul-darajali data ta'rifida chaqirmang — import paytida doim 'uz' qaytaradi.
// Data {uz,ru} obyekt saqlaydi, tarjima FAQAT render joyida bo'ladi (RU_I18N_SPEC 2-bo'lim).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};
const MentorCtx = createContext(null);
const AchCtx = createContext(null);
const AchMissCtx = createContext(null); // 🏅 151-qonun: { missed:Set<ekran id>, miss(idx), practice } — birinchi urinish + «Qaytadan» mashq-o'tishi

const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < breakpoint : false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

// ============================================================ PM DARS META
const LESSON_META = { lessonId: 'pm-m3d3-v1', lessonTitle: { uz: 'Bitta natija, uch xil sabab' } };
// YAKUN-TUZILMASI ETALONDAN (P0 · PmLesson8): koding → yakuniy test → refleksiya → PODIUM →
// FLASHCARD → YAKUN (CodeStrike + uy-vazifa BIR sahifada). Arena alohida ekran EMAS.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom', scored: false, scope: 'hook' },        // 0
  { id: 's1',  type: 'rule',        template: 'custom', scored: false, scope: null },          // 1 · maqsad
  { id: 's2',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 2 · uch savol
  { id: 's3',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 3 · TEST-1
  { id: 's4',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 4 · saralash
  { id: 's5',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 5 · TEST-2
  { id: 's6',  type: 'case',        template: 'custom', scored: false, scope: null },          // 6 · Starbucks
  { id: 's7',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 7 · TEST-3
  { id: 's8',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 8 · har vazifa — o'z komponenti
  { id: 's9',  type: 'practice',    template: 'custom', scored: false, scope: null },          // 9 · mustaqil ish
  { id: 's10', type: 'practice',    template: 'custom', scored: false, scope: null },          // 10 · tekshiruv (mehmonlar)
  { id: 's11', type: 'koding',      template: 'custom', scored: false, scope: null },          // 11 · Debug Challenge
  { id: 's12', type: 'test',        template: 'custom', scored: true,  scope: 'final' },       // 12 · TEST-4
  { id: 's13', type: 'reflection',  template: 'custom', scored: false, scope: null },          // 13
  { id: 's14', type: 'stats',       template: 'custom', scored: false, scope: null },          // 14 · podium
  { id: 's15', type: 'flashcard',   template: 'custom', scored: false, scope: null },          // 15
  { id: 's16', type: 'summary',     template: 'custom', scored: false, scope: null }           // 16 · CodeStrike + uy-vazifa
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// SCREEN_INTENTS — har ekran nima uchun mavjud (senariy 2-A dan so'zma-so'z).
export const SCREEN_INTENTS = {
  s0: "Bola «telefonda bepul dars bor, unda nega markazga boradi?» savoliga ovoz berib, sinfda ovozlar uchga bo'linganini ko'radi",
  s1: "Bola dars oxirida har natijaning turini ajrata olishini — uch nur o'zi yozilib chiqqanidan — oldindan ko'radi",
  s2: "Bola uch savolni ochib, har sabab boshqa savolga javob berishini va ularning nomi funksional, ijtimoiy, emotsional ekanini biladi",
  s3: "Bola «boshqalar oldida qanday bo'laman?» savoliga javob beradigan sababni topadi",
  s4: "Bola markaz o'quvchilarining 6 gapini uch turga o'zi joylaydi",
  s5: "Bola yangi xona misolida emotsional vazifani taniydi",
  s6: "Bola Starbucks bitta joyda uch tur vazifani birga bajarishini biladi",
  s7: "Bola Starbucks'dagi qaysi narsa emotsional vazifa ekanini topadi",
  s8: "Bola markaz saytidagi har komponent bitta vazifaga xizmat qilishini, vazifasiz komponent yo'qligini ko'radi",
  s9: "Bola o'z 3 hikoyasining natijasini turga ajratadi, har biriga komponent nomini beradi va kam uchragan tur uchun yangi komponent qo'shadi",
  s10: "Bola eski saytga 4 mehmonni yo'naltirib, ikki tur vazifaga komponent yo'qligini o'zi topadi",
  s11: "Bola markaz kodidagi ikki noto'g'ri turni topib, to'g'risini qo'lda yozadi",
  s12: "Bola hikoya natijasining turini aniqlab, bugungi darsni P0 hikoyasi bilan bog'laydi",
  s13: "Bola bugun o'z hikoyalarida qaysi tur kam ekanini sherigiga aytib, bir qatorda yozadi",
  s14: "Bola o'z natijasini (jonlida — sinf reytingini) ko'radi",
  s15: "Bola 10 kartada uch savol, uch tur va komponent-vazifa bog'lanishini o'zi takrorlaydi",
  s16: "Bola darsni yakunlab, CodeStrike arenasini ochadi va uy-vazifa qadamlarini ko'radi"
};

const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

// Nishon-hisoblagichi mentor (proyektor) rejimida KO'RINMAYDI — 90-qonun · 1-D jadvali.
function AchCounter() {
  const earned = useContext(AchCtx);
  const gate = useContext(LiveGateCtx);
  const count = earned ? earned.size : 0;
  const total = Object.keys(ACHIEVEMENTS).length;
  const prevRef = useRef(count);
  const [bump, setBump] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (count > prevRef.current) { setBump(true); const t = setTimeout(() => setBump(false), 800); prevRef.current = count; return () => clearTimeout(t); }
    prevRef.current = count;
  }, [count]);
  if (gate && gate.live && gate.live.mode === 'mentor') return null;
  return (
    <div className="ach-cnt-wrap">
      <button className={`ach-counter ${bump ? 'bump' : ''} ${count > 0 ? 'has' : ''}`} onClick={() => setOpen(o => !o)} aria-label={tr({ uz: 'Nishonlar', ru: 'Значки' })} title={tr({ uz: 'Nishonlar', ru: 'Значки' })}>
        <span className="ach-cnt-ic">🏅</span><b>{count}</b><span className="ach-cnt-tot">/{total}</span>
      </button>
      {open && (
        <div className="ach-pop" onMouseLeave={() => setOpen(false)}>
          <div className="ach-pop-h">🏅 {tr({ uz: 'Nishonlar', ru: 'Значки' })} — {count}/{total}</div>
          {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(earned && earned.has(id)); return (
            <div key={id} className={`ach-pop-row ${got ? 'got' : ''}`}><span className="ach-pop-ic">{got ? a.icon : '🔒'}</span><span className="ach-pop-nm">{a.name}</span></div>
          ); })}
        </div>
      )}
    </div>
  );
}

const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic }) => {
  const isMobile = useIsMobile();
  const isNarrow = useIsMobile(768);
  const collapseOn = isNarrow && !mentorStatic; // F-0914-08 (foydalanuvchi): kompyuterda Mentor doim ochiq, faqat tor ekranda yig'iladi
  const padH = isMobile ? 12 : 60;
  const [mCollapsed, setMCollapsed] = useState(false);
  const contentRef = useRef(null);
  useEffect(() => { setMCollapsed(false); }, [screen]);
  const setCollapsed = useCallback((v) => {
    setMCollapsed(v);
    if (v === false && contentRef.current) { const el = contentRef.current; requestAnimationFrame(() => { if (el) el.scrollTo({ top: 0, behavior: 'auto' }); }); }
  }, []);
  const onContentClick = (e) => {
    if (!collapseOn || mCollapsed) return;
    if (e.target && e.target.closest && e.target.closest('.mentor')) return;
    setMCollapsed(true);
  };
  const onContentScroll = () => {
    if (!collapseOn || mCollapsed) return;
    const el = contentRef.current;
    if (el && el.scrollTop > 6) setMCollapsed(true);
  };
  return (
    <MentorCtx.Provider value={{ enabled: collapseOn, collapsed: mCollapsed, setCollapsed }}>
      <div className="stage">
        <div className="stage-header" style={{ paddingLeft: padH, paddingRight: padH }}>
          <div className="progress-track"><div className="progress-bar" style={{ width: `${((screen + 1) / totalScreens) * 100}%` }} /></div>
          <div className="chrome">
            <div className="chrome-left eyebrow"><span className="dot" /><span>{eyebrow}</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AchCounter />
              <div className="mono small" style={{ color: T.ink3 }}>{String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}</div>
            </div>
          </div>
        </div>
        <div ref={contentRef} onClick={onContentClick} onScroll={onContentScroll} className={`stage-content ${narrow ? 'narrow' : ''}`} style={{ paddingLeft: padH, paddingRight: padH }}>{children}</div>
        {navContent && <div className="stage-nav" style={{ paddingLeft: padH, paddingRight: padH }}>{navContent}</div>}
      </div>
    </MentorCtx.Provider>
  );
};
const NavBack = ({ onPrev }) => <button className="btn-ghost" onClick={onPrev} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Orqaga', ru: 'Назад' })}</button>;

// NAVBAT-SIGNALI (88-qonun · 1-C.8 kod-shartnomasi — PmLesson2 manbasidan AYNAN).
const TURN_HINT_MS = 2600;
function useTurnHint(active) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!active) { setOn(false); return; }
    setOn(false);
    const t = setTimeout(() => setOn(true), TURN_HINT_MS);
    return () => clearTimeout(t);
  }, [active]);
  return on;
}
const TURN_STEP_MS = 1300;
const TURN_PAUSE_MS = 3200;
function useTurnWalk(pending, enabled = true) {
  const key = pending.join('');
  const [lit, setLit] = useState(null);
  useEffect(() => {
    setLit(null);
    if (!enabled || pending.length === 0) return;
    let on = true, t = null, i = 0;
    if (pending.length === 1) {
      t = setTimeout(() => { if (on) setLit(pending[0]); }, TURN_HINT_MS);
      return () => { on = false; clearTimeout(t); };
    }
    const stepIn = () => {
      if (!on) return;
      setLit(pending[i]);
      t = setTimeout(() => {
        if (!on) return;
        setLit(null);
        i = (i + 1) % pending.length;
        t = setTimeout(stepIn, i === 0 ? TURN_PAUSE_MS : 140);
      }, TURN_STEP_MS);
    };
    t = setTimeout(stepIn, TURN_HINT_MS);
    return () => { on = false; clearTimeout(t); };
  }, [key, enabled]); // eslint-disable-line
  return lit;
}
const turnCls = (lit, k, walking) => (lit === k ? (walking ? ' turn-ring turn-step' : ' turn-ring') : '');
const waveCls = (on, i, n) => (on ? ` turn-ring turn-wave${n > 3 ? ' wv4' : ''} w${i + 1}` : '');

const NavNext = ({ disabled, label = tr({ uz: 'Davom etish', ru: 'Продолжить' }), onClick, optionalLive, turnBusy }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  const isOff = (freeRide ? false : disabled) || locked;
  const hint = useTurnHint(!isOff && !turnBusy);
  return <button className={`btn-white-accent${hint ? ' turn-hint' : ''}`} disabled={isOff} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : (freeRide && disabled ? tr({ uz: "Jonli dars: bajarmasdan ham o'tishingiz mumkin", ru: 'Живой урок: можно идти дальше, даже не выполнив' }) : undefined)} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? '⏳ Mentorni kuting' : label}</button>;
};

const FeedbackBlock = ({ show, isCorrect, neutral, children }) => {
  const [mounted, setMounted] = useState(show);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (show) { setMounted(true); requestAnimationFrame(() => requestAnimationFrame(() => { setVisible(true); setTimeout(() => { if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 350); })); }
    else { setVisible(false); const t = setTimeout(() => setMounted(false), 400); return () => clearTimeout(t); }
  }, [show]);
  if (!mounted) return null;
  return <div ref={ref} className={`feedback-block ${visible ? 'visible' : ''}`}><div className={neutral ? 'frame-wait' : isCorrect ? 'frame-success' : 'frame-soft'}>{children}</div></div>;
};

const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A'];
const RECAP_NEED_PCT = 60;
const RECAP_GOOD_PCT = 75;
const RECAP_MIN_ANSWERS = 3;

// Scored ekranlar javob kaliti — darslik-jonli TASDIQLAYDI (senariy 4-bo'limi bilan qatorma-qator).
// Kalit nomi = submitAnswer'ga uzatilgan question_id: testlarda SCREEN_META.id, praktikada zona-nomi.
// -1 = ishtirok-sentinel (server: to'ldirgani = to'g'ri). Praktika signal-zonasi: PRACTICE_BASE+screen.
// sort = s4 saralash · practice = s9 mustaqil ish · route = s10 mehmonlar · koding = s11 Debug Challenge.
const INLINE_KEYS = { s3: 2, s5: 1, s7: 0, s12: 1, practice: -1, sort: -1, route: -1, koding: -1 };
// Har scored ekran uchun qayta-tushuntirish (senariy 12-bo'lim). Kalitlar = scored ekran INDEKSI (3/5/7/12).
const RECAPS = {
  3: {
    title: { uz: 'Uch savol — uch tur' },
    cards: [
      { ic: '❓', h: { uz: 'Uch savol — uch tur' }, body: { uz: <>Har sababga uch savol beriladi: menga amalda nima beradi — <b>funksional</b>; boshqalar oldida qanday bo'laman — <b>ijtimoiy</b>; o'zimni qanday his qilaman — <b>emotsional</b>.</> } },
      { ic: '👥', h: { uz: 'Ikkinchi savol — boshqalar haqida' }, body: { uz: <>Sinfdoshlardan orqada qolmaslik — gap boshqalar sizni <b>qanday ko'rishi</b> haqida. Shuning uchun u ijtimoiy vazifa.</> }, ask: { uz: 'Yana qaysi sabab boshqalar oldida qanday bo\'lish haqida?' } }
    ]
  },
  5: {
    title: { uz: 'Savol turni aytadi' },
    cards: [
      { ic: '🔎', h: { uz: 'Savol turni aytadi' }, body: { uz: <>Gapni o'qing va so'rang: u amalda nima berishi, boshqalar oldida qanday bo'lish yoki <b>qanday his qilish</b> haqidami? Mos kelgan savol turini aytadi.</> } },
      { ic: '💗', h: { uz: 'His — emotsional' }, body: { uz: <>«Imtihon yaqinlashsa ham qo'rqmayman» — bu odamning <b>o'z hissi</b>. Boshqalar ham, dars ham tilga olinmagan.</> }, ask: { uz: "Markazdagi qaysi narsa odamni xotirjam qiladi?" } }
    ]
  },
  7: {
    title: { uz: 'Bitta joy — uch vazifa' },
    cards: [
      { ic: '☕', h: { uz: 'Bitta joy — uch vazifa' }, body: { uz: <>Starbucks'da stol va Wi-Fi bor, do'stlar bilan uchrashsa bo'ladi, odam o'zini <b>uydagidek erkin</b> his qiladi — uch tur vazifa bitta joyda.</> } },
      { ic: '🛋', h: { uz: '«Uchinchi joy»' }, body: { uz: <>Uy va maktabdan tashqari yana bitta joy: kelib o'tirish, dars qilish, uchrashish uchun. Odam u yerga <b>qaytib keladi</b>.</> }, ask: { uz: "Bemalol o'tirish hissi qaysi savolga javob beradi?" } }
    ]
  },
  12: {
    title: { uz: "Har vazifa — o'z komponenti" },
    cards: [
      { ic: '🧩', h: { uz: "Har vazifa — o'z komponenti" }, body: { uz: <>Saytda har vazifani bitta komponent bajaradi. Komponenti yo'q vazifa <b>bajarilmay qoladi</b> — uni hikoyalardan topib qo'shasiz.</> } },
      { ic: '📜', h: { uz: "Natija bo'lagini o'qing" }, body: { uz: <>Hikoyaning turi uning <b>natija</b> bo'lagida: «… uchun» deb tugagan qismni o'qing va uch savolni bering.</> }, ask: { uz: "«Xavotir olmaslik» qaysi savolga javob beradi?" } }
    ]
  }
};

function RecapOverlay({ screenIdx, onClose }) {
  const rc = RECAPS[screenIdx];
  const [i, setI] = useState(0);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') setI(p => Math.min(p + 1, rc.cards.length - 1));
      else if (e.key === 'ArrowLeft') setI(p => Math.max(p - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, rc]);
  if (!rc) return null;
  const card = rc.cards[i];
  const last = i === rc.cards.length - 1;
  return (
    <div className="rc-overlay">
      <div className="rc-head">
        <span className="rc-tag">{tr({ uz: '📖 Qayta tushuntirish', ru: '📖 Объясняем заново' })}</span>
        <span className="rc-title">{tr(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr(card.h)}</h2>
        <p className="rc-body">{tr(card.body)}</p>
        {card.ask && <div className="rc-ask">{tr({ uz: '🗣️ Sinfga savol:', ru: '🗣️ Вопрос классу:' })} {tr(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущая' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-karta`, ru: `Карточка ${k + 1}` })} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>{tr({ uz: '✓ Tushunarli — davom etamiz', ru: '✓ Понятно — продолжаем' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Следующая →' })}</button>}
      </div>
    </div>
  );
}

// MENTOR (proyektor): jonli test statistikasi — «Natijani ochish»gacha ✅/❌ soni yashirin.
function MentorTestStats({ live, screenIdx, options, correctIdx, reveal, onReveal, onOpenRecap }) {
  const [data, setData] = useState({ players: null, rows: [] });
  useEffect(() => {
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, answers] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, screenIdx)]);
        if (on) setData({ players, rows: answers });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live.pin, screenIdx]);
  if (data.players === null) return null;
  const total = data.players.length;
  const answered = data.rows.length;
  const ok = data.rows.filter(a => a.picked === correctIdx).length;
  const bad = answered - ok;
  const allIn = total > 0 && answered >= total;
  const struggling = answered >= 2 && bad > ok;
  const answeredIds = new Set(data.rows.map(r => r.player_id));
  const waiting = data.players.filter(p => !answeredIds.has(p.id));
  const maxN = Math.max(1, ...options.map((_, i) => data.rows.filter(a => a.picked === i).length));
  return (
    <div className="mstats fade-up">
      <div className="mstats-head">
        <span className="mstats-lbl">{tr({ uz: '📊 Jonli natija', ru: '📊 Живой результат' })}</span>
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Все ответили' }) : <>{tr({ uz: 'Javob berdi:', ru: 'Ответили:' })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>{tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((answered / total) * 100) : 0}%` }} /></div>
      {reveal ? (
        <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr({ uz: "to'g'ri ✅", ru: 'верно ✅' })}</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr({ uz: 'adashdi ❌', ru: 'ошиблись ❌' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ждём ⏳' })}</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi 📨', ru: 'ответили 📨' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ждём ⏳' })}</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">{tr({ uz: <>🙈 Kim nimani tanlagani va ✅/❌ soni yopiq — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.</>, ru: <>🙈 Кто что выбрал и сколько ✅/❌ — скрыто. Нажмёте «Открыть результат» — откроется сразу и у вас, и на экранах учеников.</> })}</p>
      )}
      {reveal && <div className="mstats-bars">
        {options.map((opt, i) => {
          const n = data.rows.filter(a => a.picked === i).length;
          const pct = answered ? Math.round((n / answered) * 100) : 0;
          const isC = reveal && i === correctIdx;
          const col = isC ? T.success : MSTATS_COLORS[i % 4];
          return (
            <div key={i} className={`mstats-row ${reveal && !isC ? 'dimmed' : ''}`}>
              <span className="mstats-abc" style={{ background: col }}>{isC ? '✓' : String.fromCharCode(65 + i)}</span>
              <span className="mstats-track"><span className="mstats-fill" style={{ width: `${answered ? Math.round((n / maxN) * 100) : 0}%`, background: col }} /></span>
              <span className="mono mstats-count" style={isC ? { color: T.success, fontWeight: 800 } : undefined}>{n > 0 ? tr({ uz: `${n} o'quvchi · ${pct}%`, ru: `учеников: ${n} · ${pct}%` }) : '—'}</span>
            </div>
          );
        })}
      </div>}
      {reveal && answered > 0 && (() => {
        const pct = Math.round((ok / answered) * 100);
        const level = answered < RECAP_MIN_ANSWERS ? 'few' : pct < RECAP_NEED_PCT ? 'need' : pct < RECAP_GOOD_PCT ? 'maybe' : 'good';
        return (
          <div className={`mstats-verdict ${level}`}>
            {level === 'need' && <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlab oling.</>, ru: <>⚠️ Верно только <b>{pct}%</b> — тему класс не понял. Перед тем как идти дальше, коротко повторите.</> })}</p>}
            {level === 'maybe' && <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. При желании коротко повторите перед тем, как идти дальше.</> })}</p>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс тему усвоил. Спокойно идите дальше!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответивших мало ({answered}) — по процентам вывод делать сложно. Оцените сами.</> })}</p>}
            {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>📖 Qayta tushuntirishni ochish</button>}
          </div>
        );
      })()}
      {waiting.length > 0 && answered > 0 && (
        <div className="mstats-waitrow">
          <span className="mstats-wait-lbl">{tr({ uz: '⏳ Kutilmoqda:', ru: '⏳ Ждём:' })}</span>
          {waiting.slice(0, 8).map(p => <span key={p.id} className="mstats-wait-chip">{p.nickname}</span>)}
          {waiting.length > 8 && <span className="mstats-wait-chip more">+{waiting.length - 8}</span>}
        </div>
      )}
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik adashdi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Yana bir bor tushuntiring.", ru: '⚠️ Ошиблось большинство — похоже, тема осталась непонятной. Объясните ещё раз.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь вживую…' })}</p>}
    </div>
  );
}

// QuestionScreen — scored test mexanikasi (jonli-ball KAFOLATLI: submitAnswer + Kahoot-reveal).
const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, ctaLabel, revealPrefix = tr({ uz: "To'g'ri javob", ru: 'Верный ответ' }), storedAnswer, onAnswer, onNext, onPrev }) => {
  const _am = useContext(AchMissCtx);
  const fpPractice = !!(_am && _am.practice); // 151-qonun 6-band: «Qaytadan» mashq-o'tishi — hech qayerga yozilmaydi
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student');
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now());
  const [picked, setPicked] = useState(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState(storedAnswer ? (storedAnswer.solved ?? (storedAnswer.picked === correctIdx)) : false);
  const firstCorrectRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null) : null);
  const [mReveal, setMReveal] = useState(() => !!(isMentorLive && storedAnswer));
  const [recapOpen, setRecapOpen] = useState(false);
  const hasRecap = !!RECAPS[screen];
  const doReveal = () => { setMReveal(true); if (live) live.mentorReveal(screen); if (storedAnswer === undefined) onAnswer(screen, { mentorRevealed: true }); };
  const liveRevealScreen = live ? live.revealScreen : -1;
  useEffect(() => { if (isMentorLive && liveRevealScreen === screen) setMReveal(true); }, [isMentorLive, liveRevealScreen, screen]);
  const pick = (i) => {
    if (solved || isMentorLive) return;
    const isCorrect = i === correctIdx;
    setPicked(i);
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect;
    if (oneShot) {
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      if (!fpPractice) live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: questionText, options, correctIndex: correctIdx, correctAnswer: options[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: options[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    // Har urinish tarixga (LMS analitika, 0005): ball emas, yozuv; modulsiz eski darsda recordAttempt yo'q
    if (live && live.recordAttempt && !fpPractice) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: questionText, options: options, picked: options[i], correct: options[correctIdx], lang: (typeof __lang !== 'undefined' && __lang === 'ru') ? 'ru' : 'uz' });
  };
  const wrongLocked = oneShot && solved && picked !== correctIdx;
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (ctaLabel || tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, жмите обдуманно!' })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: picked !== null ? 8 : 11 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            if (isMentorLive) {
              if (mReveal) { cls += i === correctIdx ? ' option-correct' : ' option-wrong'; }
            } else if (solved) {
              if (waiting) { if (i === picked) cls += ' option-wait'; }
              else { cls += i === correctIdx ? ' option-correct' : ' option-wrong'; if (wrongLocked && i === picked) cls += ' option-picked-wrong'; }
            }
            else if (i === picked) cls += ' option-picked-wrong';
            const showGreenLetter = isMentorLive ? (mReveal && i === correctIdx) : (solved && revealed && i === correctIdx);
            const showRedLetter = cls.includes('option-picked-wrong');
            const showDimLetter = cls.includes('option-wrong') && !showGreenLetter && !showRedLetter;
            return (
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: picked !== null ? 'clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px)' : 'clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)', fontSize: 'clamp(15px,1.85vw,17px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className={`opt-abc ${showGreenLetter ? 'ok' : showRedLetter ? 'bad' : showDimLetter ? 'dim' : ''}`}>{showGreenLetter ? '✓' : showRedLetter ? '✗' : String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{fmtCode(opt)}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? <>✓ {revealPrefix}: {String.fromCharCode(65 + correctIdx)}</>
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? <>{revealPrefix}: {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</>
                  : solved ? "To'g'ri" : "Qaytadan urinib ko'ring"}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? fmtCode(explainCorrect)
              : waiting
                ? tr({ uz: "Hozir to'g'ri javobni bilib olasiz.", ru: 'Сейчас узнаете верный ответ.' })
                : wrongLocked
                  ? fmtCode(explainWrong[picked] ?? explainWrong.default)
                  : solved ? fmtCode(explainCorrect) : fmtCode(explainWrong[picked] ?? explainWrong.default)}
          </p>
        </FeedbackBlock>
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={options} correctIdx={correctIdx} reveal={mReveal} onReveal={doReveal} onOpenRecap={hasRecap ? () => setRecapOpen(true) : null} />}
        {recapOpen && hasRecap && <RecapOverlay screenIdx={screen} onClose={() => setRecapOpen(false)} />}
      </div>
    </Stage>
  );
};

function ScoreRing({ correct, total }) {
  const PCT = total ? correct / total : 0;
  const col = PCT >= 0.6 ? T.success : T.accent;
  const R = 50, ST = 9, C = 2 * Math.PI * R;
  const [off, setOff] = useState(C);
  useEffect(() => { const t = setTimeout(() => setOff(C * (1 - PCT)), 200); return () => clearTimeout(t); }, [C, PCT]);
  return (
    <div className="ring-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={R} fill="none" stroke={T.ink3 + '40'} strokeWidth={ST} />
        <circle cx="64" cy="64" r={R} fill="none" stroke={col} strokeWidth={ST} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 64 64)" style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div className="ring-center"><div className="ring-num"><span style={{ color: col }}>{correct}</span><span className="ring-den">/{total}</span></div><div className="ring-lbl">{tr({ uz: "to'g'ri javob", ru: 'верных ответов' })}</div></div>
    </div>
  );
}

// ===== MENTOR =====
const Mentor = ({ children }) => {
  const ctx = useContext(MentorCtx) || {};
  const enabled = !!ctx.enabled;
  const collapsed = enabled && ctx.collapsed;
  const expand = (e) => { e.stopPropagation(); if (ctx.setCollapsed) ctx.setCollapsed(false); };
  return (
    <div className={`mentor fade-up ${enabled ? 'mentor-mob' : ''} ${collapsed ? 'is-collapsed' : ''}`} onClick={collapsed ? expand : undefined} role={collapsed ? 'button' : undefined}>
      <div className="mentor-ava" aria-hidden="true">
        <img src={MENTOR_IMG} alt="" />
      </div>
      <div className="mentor-col">
        <span className="mentor-name">Mentor{collapsed && <span className="mentor-cue"> · ko'rsatmani ochish ▾</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

// MentorNote — PROYEKTOR-SIR: default yopiq xira chip; bosishda ochiladi/yopiladi.
const MentorNote = ({ children }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [open, setOpen] = useState(false);
  if (!live || live.mode !== 'mentor') return null;
  if (!open) return (
    <button type="button" className="mnote-chip" onClick={() => setOpen(true)} title={tr({ uz: 'Mentorga eslatma — bosib oching', ru: 'Заметка ментору — нажмите, чтобы открыть' })}>📋 {tr({ uz: 'Eslatma', ru: 'Заметка' })}</button>
  );
  return (
    <div className="mnote fade-up" onClick={() => setOpen(false)} title={tr({ uz: 'Yopish uchun bosing', ru: 'Нажмите, чтобы закрыть' })}>
      <span className="mnote-lbl">{tr({ uz: '🧑‍🏫 Mentorga eslatma', ru: '🧑‍🏫 Заметка ментору' })}<span className="mnote-x">{tr({ uz: '✕ yopish', ru: '✕ закрыть' })}</span></span>
      <p className="mnote-body">{children}</p>
    </div>
  );
};

// ===== 🛠️ JONLI PRAKTIKA signal-zonasi (500+) =====
const PRACTICE_BASE = 500;
const MentorPracticeStats = ({ live, screen, label = "👀 Kim bajardi" }) => {
  const [data, setData] = useState({ players: null, doneIds: new Set() });
  useEffect(() => {
    if (!live || live.mode !== 'mentor' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen)]);
        if (on) setData({ players, doneIds: new Set(rows.map(r => r.player_id)) });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live && live.pin, screen]);
  if (!live || live.mode !== 'mentor') return null;
  // Bo'sh apparat ko'rsatilmaydi: yuklanish va «0/0 — hech kim qo'shilmagan» holatlari
  // joy egallaydi, lekin hech narsa o'rgatmaydi. Birinchi o'quvchi qo'shilgach panel
  // o'zi paydo bo'ladi (har 3 s da yangilanadi) — F-0819-57.
  if (data.players === null || data.players.length === 0) return null;
  const players = data.players;
  const doers = players.filter(p => data.doneIds.has(p.id));
  const waiting = players.filter(p => !data.doneIds.has(p.id));
  return (
    <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.blue }}>{label} — {doers.length}/{players.length}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {doers.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.successSoft, color: T.success, fontWeight: 700 }}>✓ {p.nickname}</span>)}
        {waiting.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.accentSoft, color: T.accent, fontWeight: 700 }}>✏️ {p.nickname}</span>)}
      </div>
    </div>
  );
};

// O'QUVCHI ko'radigan sinf-holati (45-qonun) — sof O'QISH, ball-relsga yozmaydi.
const StudentPracticePulse = ({ live, screen }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (!live || live.mode !== 'student' || !live.pin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, rows] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, PRACTICE_BASE + screen)]);
        if (on) setData({ total: players.length, done: new Set(rows.map(r => r.player_id)).size });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [live && live.pin, screen]);
  if (!live || live.mode !== 'student' || !data || data.total === 0) return null;
  const doing = Math.max(0, data.total - data.done);
  return (
    <div className="done-mini fade-up" style={{ alignSelf: 'flex-start' }}>
      👥 {tr({ uz: 'Sinfda:', ru: 'В классе:' })} <b>{data.done}</b> {tr({ uz: 'bajardi', ru: 'выполнили' })}{doing > 0 && <span className="dm-sub">· ✏️ {doing} {tr({ uz: 'hali bajarmoqda', ru: 'ещё выполняют' })}</span>}
    </div>
  );
};


// ============================================================
// 🇬🇧 DARS MA'LUMOTLARI — ingliz tili markazining sayti (bitta misol-ip)
// ============================================================
// Uch tur — butun dars bo'ylab BIR XIL savol va rang (senariy 1-bo'lim, korpus §80).
// q — o'quvchi ko'radigan savol (so'zma-so'z bir xil); nom — tur nomi (s2 dan keyin chiqadi).
const TURLAR = [
  { k: 'funksional', ic: '🔧', q: { uz: 'Menga amalda nima beradi?' }, nom: { uz: 'funksional' }, echo: { uz: 'bu natija sizga amalda nima berishi haqida' } },
  { k: 'ijtimoiy',   ic: '👥', q: { uz: "Boshqalar oldida qanday bo'laman?" }, nom: { uz: 'ijtimoiy' }, echo: { uz: "bu natija boshqalar oldida qanday bo'lishingiz haqida" } },
  { k: 'emotsional', ic: '💗', q: { uz: "O'zimni qanday his qilaman?" }, nom: { uz: 'emotsional' }, echo: { uz: "bu natija o'zingizni qanday his qilishingiz haqida" } },
];
const TUR_KEYS = TURLAR.map(t => t.k);
const TUR_BY = Object.fromEntries(TURLAR.map(t => [t.k, t]));
const APO = "['\\u02BB\\u2019`]";
// Koding qiymat-tekshiruvi: kichik harf, bo'sh joy va qo'shtirnoq kechiriladi.
const normTur = (s) => String(s || '').toLowerCase().replace(new RegExp(APO, 'g'), '').replace(/["\s]/g, '');

// ===== UCH NUR — imzo-vizual (s1 · s2 · s4 · s6 · s8 · s9 · s10 · s11) =====
// Chapda mahsulot-karta, o'ngda uch rangli uya. Uyaga vazifa tushsa — o'sha qator yonadi;
// bo'sh qator xira qoladi (bo'sh — xato emas). Kesik chiziq YO'Q (159/2).
// slots[i] — uya ichidagi tugun (null → bo'sh); lit[i] — yonganmi; onSlot — bosiladigan uya.
const Nurlar = ({ head, slots = [], lit = [], onSlot, targetable, miss, demo, qShow = true, names, compact }) => (
  <div className={`nur${demo ? ' demo' : ''}${compact ? ' compact' : ''}`}>
    <div className="nur-head"><span className="nur-head-t">{head}</span></div>
    <div className="nur-rows">
      {TURLAR.map((t, i) => {
        const Tag = onSlot ? 'button' : 'div';
        return (
          <div key={t.k} className={`nur-row ${t.k}${lit[i] ? ' on' : ''}`} style={demo ? { '--dd': `${0.6 + i * 0.9}s` } : undefined}>
            <span className="nur-beam" aria-hidden="true" />
            <Tag type={onSlot ? 'button' : undefined} className={`nur-slot${targetable ? ' targetable' : ''}${miss === i ? ' miss' : ''}`} onClick={onSlot ? () => onSlot(i) : undefined}>
              <span className="nur-q"><span className="nur-ic">{t.ic}</span>{qShow && <span className="nur-qt">{tr(t.q)}</span>}{names && <span className="nur-nom">{tr(t.nom)}</span>}</span>
              <span className="nur-in">{slots[i]}</span>
            </Tag>
          </div>
        );
      })}
    </div>
  </div>
);

// ===== SCREEN 0 — HOOK: telefonda bepul dars bor — nega markazga boradi? =====
// Ichki tur ekranda YOZILMAYDI (javobsiz fikr-so'rovi).
const HOOK_KARTA = [
  { ic: '📜', t: { uz: 'Sertifikat olib, universitetga kirish' }, tur: 'funksional' },
  { ic: '👥', t: { uz: 'Sinfdoshlardan orqada qolmaslik' }, tur: 'ijtimoiy' },
  { ic: '😌', t: { uz: "Imtihondan qo'rqmay tayyorlanish" }, tur: 'emotsional' },
];
const HOOK_KEY = 'pm-m3d3-hook-choice'; // 100c: faqat YOZILADI, hech qayerda o'qilmaydi
const Screen0 = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [counts, setCounts] = useState(null);
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const isMentor = !!(live && live.mode === 'mentor');
  useEffect(() => {
    if (!isLive) return;
    let on = true, t = null;
    const tick = async () => {
      try { const rows = await liveAnswers(live.pin, screen); if (on) setCounts(HOOK_KARTA.map((_, i) => rows.filter(r => r.picked === i).length)); } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [isLive, live && live.pin, screen]);
  const pick = (i) => {
    if (picked !== null || isMentor) return;
    setPicked(i);
    try { localStorage.setItem(HOOK_KEY, HOOK_KARTA[i].tur); } catch {}
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: i, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  const opened = picked !== null || isMentor;
  const totalVotes = counts ? counts.reduce((a, b) => a + b, 0) : 0;
  const optWave = useTurnHint(picked === null && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish · ingliz tili markazi' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={opened ? tr({ uz: 'Davom etish' }) : tr({ uz: 'Bittasini tanlang' })} onClick={onNext} />}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sizningcha, <span className="italic" style={{ color: T.accent }}>asosiy sabab</span> qaysi?</> })}</h2></div>
        <Mentor>{tr({ uz: "Telefonda bepul ingliz tili darslari ko'p. Unda nega sinfdoshlaringiz pul to'lab, maktab yonidagi markazga borishadi?" })}</Mentor>
        <div className="hrow h3 fade-up delay-1">
          {HOOK_KARTA.map((c, i) => (
            <button key={c.tur} className={`hopt${picked === i ? ' on' : ''}${opened ? ' open' : ''}${!opened && optWave ? waveCls(true, i, HOOK_KARTA.length) : ''}`} disabled={opened} onClick={() => pick(i)}>
              <span className="hopt-ic">{c.ic}</span>
              <span className="hopt-nom">{tr(c.t)}</span>
            </button>
          ))}
        </div>
        {opened && isLive && counts && (
          <div className="hvote fade-step" aria-label={tr({ uz: 'Sinf natijasi' })}>
            {HOOK_KARTA.map((c, i) => {
              const n = counts[i];
              const pct = totalVotes ? Math.round((n / totalVotes) * 100) : 0;
              const top = totalVotes > 0 && n === Math.max(...counts);
              return (
                <div key={c.tur} className={`hvote-row ${picked === i ? 'mine' : ''} ${top ? 'top' : ''}`}>
                  <span className="hvote-lbl">{c.ic} {tr(c.t)}</span>
                  <span className="hvote-track"><span className="hvote-fill" style={{ width: `${Math.max(pct, totalVotes ? 4 : 0)}%` }} /></span>
                  <span className="hvote-pct mono">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}
        {opened && (
          <div className="frame-soft fade-step">
            <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Uchala sabab ham rost — va har biri <b>boshqa-boshqa</b>.</> })}</p>
          </div>
        )}
        <MentorNote>{tr({ uz: "Ovozlar uchga bo'linadi — shu darsning o'zagi. «Qaysi biri to'g'ri?» deb bahslashtirmang: keyingi ekranlarda uchalasi o'z savolini oladi." })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — MAQSAD: markaz kartasidan uch uya o'zi yozilib chiqadi (18/23-qonun) =====
// Tur NOMI hali yo'q (39-qonun) — faqat ikonka; matn s4 oltiligidan TASHQARIDA.
const DEMO_NUR = [{ uz: 'sertifikat olish' }, { uz: 'sinfdoshlardan orqada qolmaslik' }, { uz: "imtihondan qo'rqmaslik" }];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Maqsad' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun odamlar nima uchun kelishini <span className="italic" style={{ color: T.accent }}>uch turga</span> ajratamiz — va saytda qaysi tur yetishmayotganini topamiz.</> })}</h2></div>
      <Nurlar demo qShow={false} head={<>🇬🇧 {tr({ uz: 'Ingliz tili markazi' })}</>} lit={[true, true, true]} slots={DEMO_NUR.map((d, i) => <span key={i} className="nur-txt demo-t" style={{ '--dd': `${0.9 + i * 0.9}s` }}>{tr(d)}</span>)} />
    </div>
  </Stage>
);

// ===== SCREEN 2 — TEORIYA-1: uch savol (46-qonun toggle: opened / seen) =====
const Screen2 = ({ screen, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const [opened, setOpened] = useState([false, false, false]);
  const [seen, setSeen] = useState([false, false, false]);
  const allSeen = seen.every(Boolean);
  const toggle = (i) => {
    setOpened(prev => prev.map((v, k) => (k === i ? !v : v)));
    setSeen(prev => (prev[i] ? prev : prev.map((v, k) => (k === i ? true : v))));
  };
  const doneRef = useRef(null);
  useEffect(() => {
    if (allSeen && doneRef.current) {
      const t = setTimeout(() => doneRef.current && doneRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
      return () => clearTimeout(t);
    }
  }, [allSeen]);
  const qoldi = seen.filter(v => !v).length;
  return (
    <Stage eyebrow={tr({ uz: 'Qoida · uch savol' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!allSeen && !isMentor} label={allSeen || isMentor ? tr({ uz: 'Davom etish' }) : tr({ uz: `Yana ${qoldi} javobni oching` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Uch sabab — <span className="italic" style={{ color: T.accent }}>uch savol</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: <>Milkshake kabi: odam mahsulotni emas, natijani oladi. Shu natija — <b style={{ color: T.ink }}>vazifa</b> (Jobs-to-be-Done).</> })}</Mentor>
        <Nurlar head={<>🇬🇧 {tr({ uz: 'Markaz' })}</>} names={allSeen} lit={opened} onSlot={toggle}
          slots={HOOK_KARTA.map((c, i) => opened[i] ? <span key={i} className="nur-txt">{c.ic} {tr(c.t)}</span> : <span key={i} className="nur-q-closed">?</span>)} />
        {allSeen && (
          <div className="xul fade-step" ref={doneRef}>
            <p className="xul-b" style={{ margin: 0 }}>{tr({ uz: <>Telefon bittasiga, markaz <b>uchalasiga</b> javob beradi.</> })}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== TEST-EKRAN sarlavhasi (105-qonun: .h-ask) =====
const TestQ = ({ ask, card }) => (
  <>
    {card && <div className="tq-card">{card}</div>}
    <h2 className="title h-ask">{ask}</h2>
  </>
);

const Screen3 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · uch savol' })} scope="module-mikro"
    ctaLabel={tr({ uz: 'Javobni tanlang' })} revealPrefix={tr({ uz: "To'g'ri javob" })}
    question={<TestQ ask={tr({ uz: "Qaysi sabab «Boshqalar oldida qanday bo'laman?» savoliga javob beradi?" })} />}
    questionText={tr({ uz: "Boshqalar oldida qanday bo'lish savoliga javob beradigan sabab" })}
    options={[tr({ uz: 'Dars jadvalini bir qarashda bilish' }), tr({ uz: "Imtihon oldidan xotirjam bo'lish" }), tr({ uz: "Sertifikatni sinfdoshlarga ko'rsatish" })]}
    correctIdx={2}
    explainCorrect={tr({ uz: "Bu yerda gap boshqalar sizni qanday ko'rishi haqida." })}
    explainWrong={{
      0: tr({ uz: "Jadvalni bilish amalda nima berishi haqida — bu funksional. Boshqalar haqidagi sabab — sertifikatni ko'rsatish." }),
      1: tr({ uz: "Xotirjamlik — o'zingizni qanday his qilishingiz, bu emotsional. Boshqalar haqidagi sabab — sertifikatni ko'rsatish." }),
      default: tr({ uz: "Boshqalar oldida qanday bo'lish — sertifikatni sinfdoshlarga ko'rsatish." })
    }}
  />
);

// ===== SCREEN 4 — SARALASH: markaz o'quvchilarining 6 gapi uch turga (tanla → uyani bos, 75-qonun) =====
// Prioritet-doskadan farq: ustun = SAVOL; tartib yo'q, sig'im cheklovi yo'q.
const GAPLAR = [
  { id: 'g1', t: { uz: '«Uyga yaqin — avtobussiz boraman»' }, tur: 'funksional' },
  { id: 'g2', t: { uz: '«Dars vaqti maktabimga to\'g\'ri keladi»' }, tur: 'funksional' },
  { id: 'g3', t: { uz: "«Guruhda eng kuchli bo'lib ko'rinaman»" }, tur: 'ijtimoiy' },
  { id: 'g4', t: { uz: "«Do'stlarim bilan bir guruhdaman»" }, tur: 'ijtimoiy' },
  { id: 'g5', t: { uz: '«Darsdan keyin o\'zimga ishonchim ortadi»' }, tur: 'emotsional' },
  { id: 'g6', t: { uz: "«Imtihon yaqinlashsa ham qo'rqmayman»" }, tur: 'emotsional' },
];
const GAP_BY = Object.fromEntries(GAPLAR.map(g => [g.id, g]));
const S4_ORDER = ['g3', 'g1', 'g6', 'g4', 'g2', 'g5']; // aralash: to'g'ri tur ketma-ketligi naqsh bermaydi
// F-0915-02 oilasi: saqlangan xaritadan faqat mavjud gap + mavjud tur qoladi (oq ekran himoyasi)
const cleanPlaced = (m) => { const out = {}; if (m && typeof m === 'object' && !Array.isArray(m)) for (const [id, v] of Object.entries(m)) if (GAP_BY[id] && TUR_KEYS.includes(v)) out[id] = v; return out; };
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx); // 🏅 151-qonun: noto'g'ri joylash — nishon birinchi urinishga
  const [st, setSt] = useState(() => ({ placed: cleanPlaced(storedAnswer?.placed), sel: null, hint: false, miss: null }));
  const { placed, sel, hint, miss } = st;
  const missTimer = useRef(null);
  useEffect(() => () => clearTimeout(missTimer.current), []);
  const qolgan = S4_ORDER.filter(id => !placed[id]);
  const done = qolgan.length === 0;
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'sort', screenIdx: screen, placed, solved: true, correct: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'sort', 0, true, 0);
  }, [done]); // eslint-disable-line
  const pickGap = (id) => setSt(p => ({ ...p, sel: p.sel === id ? null : id, hint: false }));
  const trySlot = (i) => {
    if (!sel) return;
    const k = TUR_KEYS[i];
    if (GAP_BY[sel].tur === k) {
      setSt(p => ({ placed: { ...p.placed, [sel]: k }, sel: null, hint: false, miss: null }));
    } else {
      if (achMiss) achMiss.miss(screen);
      setSt(p => ({ ...p, sel: null, hint: true, miss: i })); // gap idishga qaytadi, xato uya qisqa qizaradi
      clearTimeout(missTimer.current);
      missTimer.current = setTimeout(() => setSt(p => (p.miss === i ? { ...p, miss: null } : p)), 650);
    }
  };
  const slots = TURLAR.map(t => {
    const ids = S4_ORDER.filter(id => placed[id] === t.k);
    return ids.length ? <span className="nur-chips">{ids.map(id => <span key={id} className="nur-chip">✓ {tr(GAP_BY[id].t)}</span>)}</span> : null;
  });
  const lit = TURLAR.map(t => S4_ORDER.some(id => placed[id] === t.k));
  const walk = useTurnWalk(qolgan, !sel && !done && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: 'Saralash · olti gap' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish' }) : sel ? tr({ uz: 'Endi mos savolni tanlang' }) : tr({ uz: `Yana ${qolgan.length} gapni joylang` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.3vw,13px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Olti gapni <span className="italic" style={{ color: T.accent }}>o'z turiga</span> joylang.</> })}</h2></div>
        <Mentor>{tr({ uz: "Avval gapni tanlang, so'ng u javob beradigan savolni bosing." })}</Mentor>
        {!done && (
          <div className="gpool fade-up delay-1">
            <span className="gpool-lbl">{tr({ uz: '✋ Olti gap ↓' })}</span>
            <div className="gpool-row">
              {S4_ORDER.map(id => placed[id] ? null : (
                <button key={id} type="button" className={`gchip${sel === id ? ' sel' : ''}${turnCls(walk, id, qolgan.length > 1)}`} onClick={() => pickGap(id)}>{tr(GAP_BY[id].t)}</button>
              ))}
            </div>
          </div>
        )}
        <Nurlar compact head={<>🇬🇧 {tr({ uz: 'Markaz' })}</>} names lit={lit} slots={slots} onSlot={trySlot} targetable={!!sel} miss={miss} />
        {!done && <AchRule screen={screen} />}
        {hint && !done && <p className="bhint fade-step">{tr({ uz: 'Bu gap boshqa savolga javob beradi. Uni qayta o\'qib, uch savolni birma-bir bering.' })}</p>}
        {done && <span className="done-mini fade-step">{tr({ uz: "✅ Olti gap o'z joyida — har tur o'z savoliga javob beradi." })}</span>}
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '🗂 Saralab bo\'lganlar' })} />
        <MentorNote>{tr({ uz: "«Guruhda eng kuchli bo'lib ko'rinaman» ustida bahs bo'ladi: unda his ham bor. Savolni qayta o'qing: gap boshqalar KO'ZI haqidami yoki o'zingizning HISSINGIZ haqidami? Bu mashqni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq." })}</MentorNote>
      </div>
    </Stage>
  );
};

const Screen5 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · yangi xona' })} scope="module-mikro"
    ctaLabel={tr({ uz: 'Javobni tanlang' })} revealPrefix={tr({ uz: "To'g'ri javob" })}
    question={<TestQ card={<>🛋 {tr({ uz: "Markaz yangi xona ochdi: yumshoq kreslo, sokin musiqa. Imtihon oldidan shu yerga kelib, tinchlanib olish mumkin." })}</>} ask={tr({ uz: 'Bu xona asosan qaysi tur vazifani bajaradi?' })} />}
    questionText={tr({ uz: 'Sokin xona qaysi tur vazifani bajaradi' })}
    options={[tr({ uz: 'Funksional' }), tr({ uz: 'Emotsional' }), tr({ uz: 'Ijtimoiy' })]}
    correctIdx={1}
    explainCorrect={tr({ uz: "Xona odamga tinchlanish hissini beradi: «O'zimni qanday his qilaman?»" })}
    explainWrong={{
      0: tr({ uz: "Bu xonada dars o'tilmaydi — u amalda yangi narsa bermaydi. U tinchlanish hissini beradi: emotsional." }),
      2: tr({ uz: "Xonada boshqalar tilga olinmagan. U tinchlanish hissini beradi: emotsional." }),
      default: tr({ uz: "Xona tinchlanish hissini beradi — bu emotsional vazifa." })
    }}
  />
);

// ===== SCREEN 6 — Starbucks «uchinchi joy»: 4 slayd + 2 bashorat (33/56/91b) =====
// K-kodi va «keys» so'zi ekranga CHIQMAYDI.
const SB_UCH = [{ uz: "Stol va Wi-Fi — o'tirib dars qilish" }, { uz: "Do'stlar bilan uchrashadigan joy" }, { uz: "O'zini uydagidek erkin his qilish" }];
const SB_SLIDES = [
  { ic: '☕', h: { uz: 'Kofe hamma joyda bor.' },
    body: { uz: <>Starbucks'da ham, qo'shni kafeda ham. Lekin odamlar aynan Starbucks'da <b>soatlab o'tirishadi</b>.</> } },
  { ic: '🛋', h: { uz: '«Uchinchi joy».' },
    body: { uz: <>Starbucks rahbari Govard Shuls <b>«uchinchi joy»</b> qurdi. Birinchisi — uy, ikkinchisi — maktab yoki ish. Uchinchisida o'qiysiz, do'stlar bilan ko'rishasiz.</> },
    predict: { ask: { uz: "Sizningcha, Starbucks o'zini qanday joy deb qurgan?" }, chips: [{ ic: '⚡', t: { uz: 'tez kofe olinadigan joy' } }, { ic: '💵', t: { uz: "arzon kofe do'koni" } }, { ic: '🛋', t: { uz: "kelib o'tiriladigan joy" } }], ans: 2 } },
  { ic: '✨', h: { uz: 'Bitta joy — uch vazifa.' }, nur: true,
    predict: { ask: { uz: 'Starbucks nechta tur vazifani bajaradi?' }, chips: [{ ic: '1️⃣', t: { uz: 'bittasini' } }, { ic: '2️⃣', t: { uz: 'ikkitasini' } }, { ic: '3️⃣', t: { uz: 'uchalasini' } }], ans: 2 } },
  { ic: '🇬🇧', h: { uz: 'Markaz ham shunday.' },
    body: { uz: <>Sertifikat, sinfdoshlar bilan birga bo'lish va xotirjamlik — uch vazifa bitta joyda. Odamlar qaytib keladigan joy <b>uchala savolga birdan</b> javob beradi.</> } },
];
const capFirst = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gateK = useContext(LiveGateCtx) || {};
  const isMentorK = !!(gateK.live && gateK.live.mode === 'mentor');
  const [i, setI] = useState(0);
  const [bets, setBets] = useState({});
  const last = i === SB_SLIDES.length - 1;
  useEffect(() => { if (last && storedAnswer === undefined) onAnswer(screen, { correct: true }); }, [last]); // eslint-disable-line
  const c = SB_SLIDES[i];
  const bet = c.predict ? bets[i] : undefined;
  const betPending = !!(c.predict && bet === undefined);
  const betHint = useTurnHint(betPending && !isMentorK);
  // F-0812-04: mentor rejimida ham javob oldindan OCHILMAYDI — mentor bosib ochadi (44-qonun oilasi).
  const showSlide = !c.predict || bet !== undefined;
  return (
    <Stage eyebrow={tr({ uz: '☕ Haqiqiy voqea' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={betPending && !isMentorK} label={betPending && !isMentorK ? tr({ uz: "Avval o'zingiz belgilang" }) : last ? tr({ uz: 'Davom etish' }) : tr({ uz: `Keyingi bosqich (${i + 1}/${SB_SLIDES.length})` })} onClick={last ? onNext : () => setI(i + 1)} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head">
          <span className="k-intro fade-up">{tr({ uz: 'Biznes olamidan mashhur voqea:' })}</span>
          <h2 className="title h-title fade-up">{tr({ uz: <>Nega odamlar Starbucks'da <span className="italic" style={{ color: T.accent }}>soatlab o'tirishadi</span>?</> })}</h2>
        </div>
        {c.predict && (
          <div className={`kp-bet fade-step${bet !== undefined ? ' answered' : ''}`} key={`b${i}`}>
            {bet === undefined && <span className="k-slide-eyebrow">{tr({ uz: "🎲 Avval o'zingiz belgilab ko'ring" })}</span>}
            <h3 className="k-slide-h">{tr(c.predict.ask)}</h3>
            <div className="kp-chips">
              {c.predict.chips.map((ch, k) => {
                const locked = bet !== undefined;
                const isAns = k === c.predict.ans;
                let cls = 'kp-chip';
                if (locked) { cls += ' locked'; if (isAns) cls += ' correct'; else if (bet === k && !isMentorK) cls += ' wrong'; }
                else cls += waveCls(betHint, k, c.predict.chips.length);
                return (
                  <button key={k} className={cls} disabled={locked} onClick={() => setBets(p => ({ ...p, [i]: k }))}>
                    <span className="kp-ic">{ch.ic}</span>{tr(ch.t)}
                    {locked && isAns && <span className="kp-mark ok">✓</span>}
                    {locked && !isAns && bet === k && !isMentorK && <span className="kp-mark no">✗</span>}
                  </button>
                );
              })}
            </div>
            {bet !== undefined && !isMentorK && (
              <p className={`kp-res ${bet === c.predict.ans ? 'hit' : 'miss'}`}>
                {bet === c.predict.ans ? <>{tr({ uz: '🎯 Topdingiz!' })} {capFirst(tr(c.predict.chips[c.predict.ans].t))}</> : <>{tr({ uz: 'Aslida —' })} {tr(c.predict.chips[c.predict.ans].t)}</>}
              </p>
            )}
          </div>
        )}
        {showSlide && (
          <div className="k-slide fade-step" key={`s${i}`}>
            {!c.predict && <span className="k-slide-eyebrow">☕ Starbucks · {i + 1} / {SB_SLIDES.length}</span>}
            <div className="k-slide-ic">{c.ic}</div>
            <h3 className="k-slide-h">{tr(c.h)}</h3>
            {c.nur && <Nurlar compact head={<>☕ Starbucks</>} lit={[true, true, true]} slots={SB_UCH.map((t, k) => <span key={k} className="nur-txt">{tr(t)}</span>)} />}
            {c.body && <p className="k-slide-body">{tr(c.body)}</p>}
          </div>
        )}
        <div className="k-dots">{SB_SLIDES.map((_, k) => <button key={k} className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-bosqich` })} />)}</div>
      </div>
    </Stage>
  );
};

const Screen7 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · Starbucks' })} scope="module-mikro"
    ctaLabel={tr({ uz: 'Javobni tanlang' })} revealPrefix={tr({ uz: "To'g'ri javob" })}
    question={<TestQ ask={tr({ uz: "Starbucks'dagi qaysi narsa emotsional vazifani bajaradi?" })} />}
    questionText={tr({ uz: "Starbucks'dagi emotsional vazifa" })}
    options={[tr({ uz: "Uyda o'tirgandek bemalol bo'lish" }), tr({ uz: 'Noutbuk ochib, dars tayyorlash' }), tr({ uz: "Do'stlar bilan ko'rishib turish" })]}
    correctIdx={0}
    explainCorrect={tr({ uz: "Bu odamning o'z hissi; dars tayyorlash funksional, ko'rishish ijtimoiy vazifa." })}
    explainWrong={{
      1: tr({ uz: "Dars tayyorlash amalda nima berishi haqida — bu funksional. His haqidagisi — uydagidek bemalol bo'lish." }),
      2: tr({ uz: "Do'stlar bilan ko'rishish boshqalar haqida — bu ijtimoiy. His haqidagisi — uydagidek bemalol bo'lish." }),
      default: tr({ uz: "Emotsional — odamning o'z hissi: uydagidek bemalol bo'lish." })
    }}
  />
);

// ===== SCREEN 8 — TEORIYA-2: har vazifa — o'z komponenti (markaz sayti, m3-01 ko'prigi) =====
// vazifa-matnlari s11 kodidagi bilan BIR XIL (88-korpus), s10 mehmon-savollari bilan EMAS.
const YANGI_SAYT = [
  { komp: 'Jadval', ic: '📅', ui: { uz: 'Dars jadvali' }, sub: { uz: 'Du · Chor · Juma — 15:00' }, vazifa: { uz: 'dars vaqtini tez topish' }, tur: 'funksional' },
  { komp: 'Natijalar', ic: '🏆', ui: { uz: 'Bitiruvchilarimiz' }, sub: { uz: 'Sertifikatlar' }, vazifa: { uz: "sertifikatni do'stlarga ko'rsatish" }, tur: 'ijtimoiy' },
  { komp: 'SinovDarsi', ic: '🎈', ui: { uz: 'Birinchi dars — sinov' }, sub: { uz: 'Yozilish' }, vazifa: { uz: "birinchi darsdan qo'rqmaslik" }, tur: 'emotsional' },
];
const Screen8 = ({ screen, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const [opened, setOpened] = useState([false, false, false]);
  const [seen, setSeen] = useState([false, false, false]);
  const allSeen = seen.every(Boolean);
  const toggle = (i) => {
    setOpened(prev => prev.map((v, k) => (k === i ? !v : v)));
    setSeen(prev => (prev[i] ? prev : prev.map((v, k) => (k === i ? true : v))));
  };
  const pend = YANGI_SAYT.map((_, i) => String(i)).filter(k => !seen[Number(k)]);
  const walk = useTurnWalk(pend, !isMentor);
  const qoldi = pend.length;
  const slots = TURLAR.map(t => {
    const i = YANGI_SAYT.findIndex(c => c.tur === t.k);
    return opened[i] ? <span className="nur-txt"><code className="qcode">{`<${YANGI_SAYT[i].komp} />`}</code> {tr(YANGI_SAYT[i].vazifa)}</span> : null;
  });
  const lit = TURLAR.map(t => opened[YANGI_SAYT.findIndex(c => c.tur === t.k)]);
  return (
    <Stage eyebrow={tr({ uz: "Qoida · har vazifa — o'z komponenti" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!allSeen && !isMentor} label={allSeen || isMentor ? tr({ uz: 'Davom etish' }) : tr({ uz: `Yana ${qoldi} komponentni oching` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Markaz saytidagi <span className="italic" style={{ color: T.accent }}>har komponentni</span> oching.</> })}</h2></div>
        <Mentor>{tr({ uz: "Sahifa komponentlardan yig'ilishini bilasiz. Endi har komponent qaysi vazifani bajarishini ko'ramiz." })}</Mentor>
        <div className="split">
          <div className="smock fade-up delay-1">
            <div className="smock-bar"><span /><span /><span /><em>markaz.uz</em></div>
            <div className="smock-body">
              {YANGI_SAYT.map((c, i) => (
                <button key={c.komp} type="button" className={`scomp ${c.tur}${opened[i] ? ' open' : ''}${turnCls(walk, String(i), pend.length > 1)}`} onClick={() => toggle(i)}>
                  {opened[i] && <code className="scomp-tag">{`<${c.komp} />`}</code>}
                  <span className="scomp-ic">{c.ic}</span>
                  <span className="scomp-col"><span className="scomp-ui">{tr(c.ui)}</span><span className="scomp-sub">{tr(c.sub)}</span></span>
                </button>
              ))}
            </div>
          </div>
          <Nurlar compact names head={<>🇬🇧 {tr({ uz: 'Markaz sayti' })}</>} lit={lit} slots={slots} />
        </div>
        {allSeen && (
          <div className="xul fade-step">
            <span className="xul-h">{tr({ uz: "Har vazifa — o'z komponenti." })}</span>
            <p className="xul-b">{tr({ uz: "Uch tur vazifa bo'lsa, saytda uch xil komponent kerak. Komponenti yo'q vazifa bajarilmay qoladi." })}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== KIRISH-ARTEFAKT: M3-D2 hikoyalari — FAQAT O'QILADI (M3-D5 ham shu kalitni o'qiydi) =====
const IN_STORIES_KEY = 'pm-m3d2-stories';
const readInStories = () => {
  try {
    const a = JSON.parse(localStorage.getItem(IN_STORIES_KEY) || 'null');
    if (!Array.isArray(a)) return null;
    const ok = (s) => s && typeof s === 'object'
      && typeof s.kim === 'string' && s.kim.trim().length >= 2
      && typeof s.nima === 'string' && s.nima.trim().length >= 2
      && typeof s.natija === 'string' && s.natija.trim().length >= 2;
    const full = a.filter(ok);
    return full.length >= 3 ? full.slice(0, 3).map(s => ({ kim: s.kim.trim(), nima: s.nima.trim(), natija: s.natija.trim() })) : null;
  } catch { return null; }
};
// Zaxira-hikoyalar shu darsning O'Z olamidan (96c-d), P0 formula-qolipida.
const ZAXIRA_HIKOYA = [
  { kim: "yangi o'quvchi", nima: "dars jadvalini ko'rish", natija: 'maktabimga mos guruhni tanlash', komp: 'Jadval' },
  { kim: "guruh a'zosi", nima: "oylik reytingni ko'rish", natija: "do'stlarimdan orqada qolmaslik", komp: 'Reyting' },
  { kim: "imtihonga tayyorlanayotgan o'quvchi", nima: 'sinov imtihonini topshirish', natija: "asl imtihon kuni qo'rqmaslik", komp: 'SinovImtihon' },
];
const JOBS_KEY = 'pm-m3d3-jobs';
const JOBS_EVT = 'pm-m3d3-jobs-upd';
const readJobs = () => {
  try {
    const v = JSON.parse(localStorage.getItem(JOBS_KEY) || 'null');
    if (!v || typeof v !== 'object' || !Array.isArray(v.stories)) return null;
    const stories = v.stories.filter(s => s && typeof s === 'object' && TUR_KEYS.includes(s.tur) && typeof s.komponent === 'string');
    const yangi = v.yangi && typeof v.yangi === 'object' && typeof v.yangi.komponent === 'string' ? v.yangi : null;
    return { stories, yangi };
  } catch { return null; }
};
const writeJobs = (o) => {
  try { localStorage.setItem(JOBS_KEY, JSON.stringify(o)); } catch {}
  try { window.dispatchEvent(new Event(JOBS_EVT)); } catch {}
};
// Komponent nomi: probel va belgilar olib tashlanadi, bosh harf katta (<SinovDarsi /> kabi).
const kompNom = (s) => String(s || '').replace(/[<>/\s]/g, '').replace(/^./, ch => ch.toUpperCase());
const storyGap = (s) => <>«Men {s.kim} sifatida, {s.nima}ni xohlayman, <b className="st-nat">{s.natija}</b> uchun.»</>;
// Eng kam uchragan tur (teng bo'lsa: emotsional → ijtimoiy → funksional).
const kamTur = (turlar) => {
  const order = ['emotsional', 'ijtimoiy', 'funksional'];
  let best = order[0], bestN = Infinity;
  order.forEach(k => { const n = turlar.filter(t => t === k).length; if (n < bestN) { best = k; bestN = n; } });
  return best;
};

// ===== 📋 «VAZIFALARIM» — artefakt-strip (s9 dan keyin; faqat ko'rinish qatlami, ball-mantiqqa aloqasi yo'q) =====
function JobsStrip() {
  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState(() => readJobs());
  useEffect(() => {
    const upd = () => setJobs(readJobs());
    window.addEventListener(JOBS_EVT, upd);
    return () => window.removeEventListener(JOBS_EVT, upd);
  }, []);
  if (!jobs || jobs.stories.length === 0) return null;
  const rows = [...jobs.stories.map(s => ({ komp: s.komponent, tur: s.tur })), ...(jobs.yangi ? [{ komp: jobs.yangi.komponent, tur: jobs.yangi.tur, yangi: true }] : [])];
  return (
    <div className={`jstrip${open ? ' open' : ''}`}>
      <button type="button" className="jstrip-pill" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span aria-hidden="true">📋</span> {tr({ uz: 'Vazifalarim' })} <b>{rows.length}</b> <span aria-hidden="true">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="jstrip-list fade-step">
          {rows.map((r, i) => <span key={i} className={`jstrip-row ${r.tur}`}><span>{TUR_BY[r.tur] ? TUR_BY[r.tur].ic : '•'}</span><code className="qcode">{`<${r.komp} />`}</code>{r.yangi && <em>{tr({ uz: 'yangi' })}</em>}</span>)}
        </div>
      )}
    </div>
  );
}

// ===== SCREEN 9 — MUSTAQIL ISH: o'z 3 hikoyasi → tur + komponent + yetishmagan tur (94-qonun bosqichli) =====
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [inStories] = useState(() => readInStories());
  const stories = inStories || ZAXIRA_HIKOYA;
  const [st, setSt] = useState(() => {
    const sv = storedAnswer && Array.isArray(storedAnswer.rows) ? storedAnswer : null;
    return {
      k: sv ? 3 : 0,
      rows: sv ? sv.rows.slice(0, 3).map(r => ({ tur: TUR_KEYS.includes(r.tur) ? r.tur : null, komp: typeof r.komp === 'string' ? r.komp : '' })) : [0, 1, 2].map(() => ({ tur: null, komp: '' })),
      yKomp: sv?.yKomp || '', yVaz: sv?.yVaz || '', editTur: false,
    };
  });
  const { k, rows, yKomp, yVaz, editTur } = st;
  const [yordamOpen, setYordamOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);
  const rowOk = (r) => !!r.tur && kompNom(r.komp).length >= 2;
  const allRows = rows.every(rowOk);
  const kam = kamTur(rows.map(r => r.tur).filter(Boolean));
  const yOk = kompNom(yKomp).length >= 2 && yVaz.trim().length >= 4;
  const done = allRows && k >= 3 && yOk;
  const cur = k < 3 ? rows[k] : null;
  const setRow = (patch) => setSt(p => ({ ...p, rows: p.rows.map((r, i) => (i === p.k ? { ...r, ...patch } : r)), editTur: false }));
  const savedRef = useRef(false);
  useEffect(() => {
    if (!done || savedRef.current) return;
    savedRef.current = true;
    writeJobs({
      stories: stories.map((s, i) => ({ kim: s.kim, nima: s.nima, natija: s.natija, tur: rows[i].tur, komponent: kompNom(rows[i].komp) })),
      yangi: { komponent: kompNom(yKomp), vazifa: yVaz.trim(), tur: kam },
      savedAt: Date.now()
    });
    if (storedAnswer === undefined || !storedAnswer.solved) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, rows, yKomp, yVaz: yVaz.trim(), solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  // O'ng panel: hikoyalar komponentlari o'z turi uyasida; bo'sh tur xira qoladi (topilma o'zi ko'rinadi).
  const slots = TURLAR.map(t => {
    const list = rows.map((r, i) => ({ r, i })).filter(({ r }) => r.tur === t.k);
    return list.length ? <span className="nur-chips">{list.map(({ r, i }) => <span key={i} className="nur-chip">{i + 1}. {kompNom(r.komp) ? <code className="qcode">{`<${kompNom(r.komp)} />`}</code> : tr({ uz: 'hikoya' })}</span>)}</span> : null;
  });
  const lit = TURLAR.map(t => rows.some(r => r.tur === t.k));
  const turTurn = useTurnHint(!!cur && !cur.tur && !isMentor);
  const step1 = !!cur ? !!cur.tur : allRows;
  const step2 = !!cur ? rowOk(cur) : allRows;
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish' })
    : k < 3 && !cur.tur ? tr({ uz: `① ${k + 1}-hikoya turini tanlang` })
    : k < 3 && !rowOk(cur) ? tr({ uz: '② Komponent nomini yozing' })
    : k < 3 ? tr({ uz: 'Keyingi hikoyaga o\'ting' })
    : kompNom(yKomp).length < 2 ? tr({ uz: '③ Yangi komponent nomini yozing' })
    : tr({ uz: '③ U qanday vazifani bajarishini yozing' });
  return (
    <Stage eyebrow={inStories ? tr({ uz: "Mustaqil mashq · o'z hikoyalaringiz" }) : tr({ uz: 'Mustaqil mashq · markaz hikoyalari' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{inStories ? tr({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>o'z loyihangiz</span> navbati.</> }) : tr({ uz: <>Endi <span className="italic" style={{ color: T.accent }}>o'zingiz</span> saralaysiz.</> })}</h2></div>
        <Mentor>{inStories ? tr({ uz: "O'tgan darsda yozgan uchta hikoyangiz pastda turibdi — har birining natijasi qaysi turga kiradi?" }) : tr({ uz: "O'tgan darsdagi hikoyalaringiz topilmadi — shuning uchun markaz saytining uchta hikoyasida mashq qilamiz." })}</Mentor>
        <div className="stps fade-up">
          <span className={`stp ${step1 ? 'done' : 'on'}`}><i>{step1 ? '✓' : '1'}</i>{tr({ uz: 'Turini tanlang' })}</span>
          <span className={`stp ${step2 ? 'done' : step1 ? 'on' : ''}`}><i>{step2 ? '✓' : '2'}</i>{tr({ uz: 'Komponentini nomlang' })}</span>
          <span className={`stp ${done ? 'done' : k >= 3 ? 'on' : ''}`}><i>{done ? '✓' : '3'}</i>{tr({ uz: 'Yangi komponent' })}</span>
        </div>
        <div className="split">
          <Col gap={10}>
            <div className="sdots" aria-label={tr({ uz: 'Hikoyalar' })}>{[0, 1, 2].map(i => <button key={i} type="button" className={`sdot${i === k ? ' cur' : rowOk(rows[i]) ? ' ok' : ''}`} onClick={() => setSt(p => ({ ...p, k: i, editTur: false }))} aria-label={tr({ uz: `${i + 1}-hikoya` })}>{rowOk(rows[i]) ? '✓' : i + 1}</button>)}
              {allRows && <button type="button" className={`sdot new${k >= 3 ? ' cur' : ''}`} onClick={() => setSt(p => ({ ...p, k: 3 }))}>＋</button>}
            </div>
            {cur && (
              <div className="sblock fade-step" key={`h${k}`}>
                <p className="st-card">{storyGap(stories[k])}</p>
                {(!cur.tur || editTur) ? (
                  <div className="tq-row">
                    {TURLAR.map((t, i) => (
                      <button key={t.k} type="button" className={`tqb ${t.k}${cur.tur === t.k ? ' on' : ''}${waveCls(turTurn, i, 3)}`} onClick={() => setRow({ tur: t.k })}><span>{t.ic}</span>{tr(t.q)}</button>
                    ))}
                  </div>
                ) : (
                  <div className="sblock rowdone">
                    <span className="rd-line"><b>✓</b> {tr({ uz: `Siz «${tr(TUR_BY[cur.tur].nom)}» dedingiz: ${tr(TUR_BY[cur.tur].echo)}.` })}</span>
                    <button type="button" className="rd-redo" title={tr({ uz: 'Boshqasini tanlash' })} onClick={() => setSt(p => ({ ...p, editTur: true }))}>↻</button>
                  </div>
                )}
                {cur.tur && (
                  <label className="kin fade-step"><span className="kin-b">&lt;</span><input aria-label={tr({ uz: 'Komponent nomi' })} className={`kin-i${kompNom(cur.komp).length >= 2 ? ' filled' : ''}`} value={cur.komp} maxLength={28} placeholder={tr({ uz: 'Komponent nomi' })} onChange={e => setRow({ komp: e.target.value })} /><span className="kin-b">/&gt;</span></label>
                )}
                {rowOk(cur) && (
                  <button type="button" className="btn-soft sb-next fade-step" onClick={() => setSt(p => ({ ...p, k: p.rows.findIndex((r, i) => i > p.k && !rowOk(r)) >= 0 ? p.rows.findIndex((r, i) => i > p.k && !rowOk(r)) : (p.rows.every(rowOk) ? 3 : p.rows.findIndex(r => !rowOk(r))) }))}>{tr({ uz: 'Keyingisi →' })}</button>
                )}
              </div>
            )}
            {k >= 3 && (
              <div className="sblock fade-step">
                <span className="sblock-h">{tr({ uz: `Hikoyalaringizda «${tr(TUR_BY[kam].nom)}» vazifa kam. Shu tur uchun bitta komponent qo'shing.` })}</span>
                <label className="kin"><span className="kin-b">&lt;</span><input aria-label={tr({ uz: 'Yangi komponent nomi' })} className={`kin-i${kompNom(yKomp).length >= 2 ? ' filled' : ''}`} value={yKomp} maxLength={28} placeholder={tr({ uz: 'Komponent nomi' })} onChange={e => setSt(p => ({ ...p, yKomp: e.target.value }))} /><span className="kin-b">/&gt;</span></label>
                <input aria-label={tr({ uz: 'U qanday vazifani bajaradi?' })} className={`reflect-input${yVaz.trim().length >= 4 ? ' filled' : ''}`} value={yVaz} maxLength={90} placeholder={tr({ uz: 'U qanday vazifani bajaradi?' })} onChange={e => setSt(p => ({ ...p, yVaz: e.target.value }))} />
              </div>
            )}
            <div className="wsxrow">
              <div className={`wsx ${yordamOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>💡 {tr({ uz: 'Yordam' })} {yordamOpen ? '▾' : '▸'}</button>
                {yordamOpen && <div className="wsx-body"><p>{tr({ uz: "Natijani o'qing: u sizga amalda nima berishi, boshqalar oldida qanday bo'lish yoki qanday his qilish haqidami? Mos kelgani — uning turi." })}</p></div>}
              </div>
              <div className={`wsx star ${starOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setStarOpen(o => !o)}>⭐ {tr({ uz: "Qo'shimcha" })} {starOpen ? '▾' : '▸'}</button>
                {starOpen && <div className="wsx-body"><p>{tr({ uz: 'Bir hikoya ikki savolga ham javob beradimi? Eng asosiysini tanlang, ikkinchisini sinfda aytib bering.' })}</p></div>}
              </div>
            </div>
          </Col>
          <Col gap={10}>
            <Nurlar compact names head={<>📋 {inStories ? tr({ uz: 'Hikoyalaringiz' }) : tr({ uz: 'Markaz hikoyalari' })}</>} lit={lit} slots={slots} />
            <StudentPracticePulse live={live} screen={screen} />
            <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Hikoyalarini ajratganlar' })} />
          </Col>
        </div>
        {done && <div className="done-mini fade-step">{tr({ uz: '✅ Uchta hikoya va bitta yangi komponent — «Vazifalarim»ga saqlandi.' })}</div>}
        {done && <JobsStrip />}
        <MentorNote>{tr({ uz: "Ko'pchilikda hamma hikoya funksional chiqadi — bu xato emas, darsning eng muhim topilmasi. Uni yangi komponent qadamida o'zlari ko'rsin. Bu mashqni o'quvchilar bajaradi, siz panelda kuzatasiz; «Davom etish» siz uchun ochiq." })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — TEKSHIRUV: «Markazning eski sayti» — mehmonni yo'naltirish-simulyatsiyasi =====
// MatchPairs EMAS: 4 mehmondan ikkitasining to'g'ri javobi — «mos komponent yo'q» (bo'shliqni topish).
const ESKI_SAYT = [
  { komp: 'Jadval', ic: '📅', ui: { uz: 'Dars jadvali' } },
  { komp: 'Narxlar', ic: '💵', ui: { uz: 'Oylik narxlar' } },
  { komp: 'Manzil', ic: '📍', ui: { uz: 'Manzil va xarita' } },
];
const YOQ = 'yoq';
const MEHMONLAR = [
  { id: 'm1', t: { uz: '«Shanba kuni dars bormi?»' }, to: 'Jadval', tur: 'funksional' },
  { id: 'm2', t: { uz: '«Bir oyi qancha turadi?»' }, to: 'Narxlar', tur: 'funksional' },
  { id: 'm3', t: { uz: "«O'qib bo'lgach, do'stlarimga ko'rsatadigan sertifikat berasizlarmi?»" }, to: YOQ, tur: 'ijtimoiy' },
  { id: 'm4', t: { uz: "«Men xato qilishdan qo'rqaman. Birinchi darsda qiynalib qolsam-chi?»" }, to: YOQ, tur: 'emotsional' },
];
const MEH_BY = Object.fromEntries(MEHMONLAR.map(m => [m.id, m]));
const cleanRouted = (m) => { const out = {}; if (m && typeof m === 'object' && !Array.isArray(m)) for (const [id, v] of Object.entries(m)) if (MEH_BY[id] && MEH_BY[id].to === v) out[id] = v; return out; };
const Screen10 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx);
  const [st, setSt] = useState(() => ({ routed: cleanRouted(storedAnswer?.routed), sel: null, miss: null, hint: false }));
  const { routed, sel, miss, hint } = st;
  const [juftOpen, setJuftOpen] = useState(false);
  const missTimer = useRef(null);
  useEffect(() => () => clearTimeout(missTimer.current), []);
  const qolgan = MEHMONLAR.filter(m => !routed[m.id]).map(m => m.id);
  const done = qolgan.length === 0;
  useEffect(() => {
    if (!done || storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'route', screenIdx: screen, routed, solved: true, correct: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'route', 0, true, 0);
  }, [done]); // eslint-disable-line
  const send = (to) => {
    if (!sel) return;
    if (MEH_BY[sel].to === to) setSt(p => ({ ...p, routed: { ...p.routed, [sel]: to }, sel: null, hint: false, miss: null }));
    else {
      if (achMiss) achMiss.miss(screen);
      setSt(p => ({ ...p, miss: to, hint: true }));
      clearTimeout(missTimer.current);
      missTimer.current = setTimeout(() => setSt(p => (p.miss === to ? { ...p, miss: null } : p)), 650);
    }
  };
  const walk = useTurnWalk(qolgan, !sel && !done && !isMentor);
  const bosh = MEHMONLAR.filter(m => routed[m.id] === YOQ);
  return (
    <Stage eyebrow={tr({ uz: 'Tekshiruv · eski sayt' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish' }) : sel ? tr({ uz: 'Endi komponentni tanlang' }) : tr({ uz: `Yana ${qolgan.length} mehmonni yuboring` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.3vw,13px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har mehmonni <span className="italic" style={{ color: T.accent }}>o'z komponentiga</span> yuboring.</> })}</h2></div>
        <Mentor>{tr({ uz: "Bu — markazning eski sayti: unda uchta komponent bor. To'rt mehmon nimanidir so'rayapti — har birini javobi turgan komponentga yuboring." })}</Mentor>
        <div className="split">
          <Col gap={10}>
            <div className="guests">
              {MEHMONLAR.map(m => {
                const r = routed[m.id];
                return (
                  <button key={m.id} type="button" disabled={!!r} className={`guest${sel === m.id ? ' sel' : ''}${r ? ' ok' : ''}${!r ? turnCls(walk, m.id, qolgan.length > 1) : ''}`} onClick={() => setSt(p => ({ ...p, sel: p.sel === m.id ? null : m.id, hint: false }))}>
                    <span className="guest-ic">{r ? '✓' : '🙋'}</span>
                    <span className="guest-col"><span className="guest-t">{tr(m.t)}</span>{r && <span className="guest-to">→ {r === YOQ ? tr({ uz: "mos komponent yo'q" }) : <code className="qcode">{`<${r} />`}</code>}</span>}</span>
                  </button>
                );
              })}
            </div>
            {hint && !done && <p className="bhint fade-step">{tr({ uz: "Mehmonga amaliy ma'lumot kerakmi, boshqalar oldida obro'mi yoki xotirjamlikmi? Saytda shunga javob yo'q bo'lsa — «Mos komponent yo'q»." })}</p>}
            {!done && <AchRule screen={screen} />}
          </Col>
          <Col gap={10}>
            <div className="smock">
              <div className="smock-bar"><span /><span /><span /><em>{tr({ uz: 'eski sayt' })}</em></div>
              <div className="smock-body">
                {ESKI_SAYT.map(c => (
                  <button key={c.komp} type="button" className={`scomp funksional open${sel ? ' targetable' : ''}${miss === c.komp ? ' miss' : ''}`} onClick={() => send(c.komp)}>
                    <code className="scomp-tag">{`<${c.komp} />`}</code>
                    <span className="scomp-ic">{c.ic}</span>
                    <span className="scomp-col"><span className="scomp-ui">{tr(c.ui)}</span></span>
                  </button>
                ))}
                <button type="button" className={`scomp-none${sel ? ' targetable' : ''}${miss === YOQ ? ' miss' : ''}`} onClick={() => send(YOQ)}>➕ {tr({ uz: "Mos komponent yo'q" })}</button>
              </div>
            </div>
            {done && <Nurlar compact names head={<>🕸 {tr({ uz: 'Eski sayt' })}</>} lit={[true, false, false]}
              slots={TURLAR.map(t => t.k === 'funksional' ? <span className="nur-txt"><code className="qcode">{'<Jadval />'}</code> <code className="qcode">{'<Narxlar />'}</code></span> : (bosh.some(m => m.tur === t.k) ? <span className="nur-txt nur-empty">{tr({ uz: "komponent yo'q" })}</span> : null))} />}
            <MentorPracticeStats live={live} screen={screen} label={tr({ uz: "🧭 Mehmonlarni yuborganlar" })} />
          </Col>
        </div>
        {done && <span className="done-mini fade-step">{tr({ uz: '✅ Eski sayt faqat funksional vazifani bajargan — ikki tur komponentsiz qoldi.' })}</span>}
        <div className="wsxrow">
          <div className={`wsx star ${juftOpen ? 'open' : ''}`}>
            <button className="wsx-toggle" onClick={() => setJuftOpen(o => !o)}>🤝 {tr({ uz: 'Juftlikda' })} {juftOpen ? '▾' : '▸'}</button>
            {juftOpen && <div className="wsx-body"><p>{tr({ uz: "Biringiz mehmon bo'lib savolni ovoz chiqarib o'qing, sherigingiz saytdan komponentni ko'rsatsin. Keyingi mehmonda almashing." })}</p></div>}
          </div>
        </div>
        <MentorNote>{tr({ uz: "Bitta fikr: eski sayt faqat «Menga amalda nima beradi?» savoliga javob bergan. Ikki tur vazifa komponentsiz qoldi — mehmonlar shuning uchun ketadi. Bu mashqni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq." })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — KODING: Debug Challenge (26/82/87-qonun) =====
// O'quvchi kodni o'qiydi, xato qatorni bosadi va `tur` qiymatini QO'LDA yozadi. Textarea YO'Q;
// nusxalash bloklangan; honor-checklist YO'Q — ikkala xato tuzalganda ekran o'zi bajariladi.
// Faqat o'tilgan material: m3-01 teglari (<App>, <Jadval />) + m2-06 massiv-obyekt. props/map/useState — 0.
const KODING_KEY = 'pm-m3d3-code';
const readKoding = () => { try { const v = JSON.parse(localStorage.getItem(KODING_KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const DBG_ROWS = [
  { komp: 'Jadval',     pad: '    ', vazifa: 'dars vaqtini tez topish',            vpad: '           ', bor: 'funksional', ok: 'funksional' },
  { komp: 'Natijalar',  pad: ' ',    vazifa: "sertifikatni do'stlarga ko'rsatish", vpad: '',            bor: 'emotsional', ok: 'ijtimoiy' },
  { komp: 'SinovDarsi', pad: '',     vazifa: "birinchi darsdan qo'rqmaslik",       vpad: '       ',     bor: 'funksional', ok: 'emotsional' },
];
const DBG_BAD = DBG_ROWS.map((r, i) => (r.bor !== r.ok ? i : -1)).filter(i => i >= 0);
const Screen11 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx);
  const saved = useMemo(() => readKoding(), []);
  const [fixed, setFixed] = useState(() => {
    const f = saved && Array.isArray(saved.fixed) ? saved.fixed : [];
    return DBG_ROWS.map((r, i) => (f[i] === r.ok && r.bor !== r.ok ? r.ok : null));
  });
  const [open, setOpen] = useState(null); // tahrirlanayotgan qator
  const [val, setVal] = useState('');
  const [msg, setMsg] = useState(null); // { cls, t }
  const [yordamOpen, setYordamOpen] = useState(false);
  const [glossOpen, setGlossOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);
  const [star, setStar] = useState(() => (saved && saved.star && typeof saved.star === 'object' ? { komp: saved.star.komp || '', vazifa: saved.star.vazifa || '', tur: saved.star.tur || '' } : { komp: '', vazifa: '', tur: '' }));
  const done = DBG_BAD.every(i => fixed[i]);
  const curTur = (i) => fixed[i] || DBG_ROWS[i].bor;
  useEffect(() => { try { localStorage.setItem(KODING_KEY, JSON.stringify({ fixed, star, savedAt: Date.now() })); } catch {} }, [fixed, star]);
  const doneRef = useRef(false);
  useEffect(() => {
    if (!done || doneRef.current) return;
    doneRef.current = true;
    if (storedAnswer === undefined || !storedAnswer.solved) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, fixed, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  const clickRow = (i) => {
    if (fixed[i] || done) return;
    const r = DBG_ROWS[i];
    if (r.bor === r.ok) {
      if (achMiss) achMiss.miss(screen); // xato qatorni bosish ham urinish (151)
      setOpen(null);
      setMsg({ cls: 'ask', t: { uz: `Bu qator to'g'ri: ${r.vazifa.replace(/ tez /, ' ')} — ${r.ok} vazifa.` } });
      return;
    }
    setOpen(i); setVal(''); setMsg(null);
  };
  const check = (i, v) => {
    const n = normTur(v);
    if (!n) return;
    if (!TUR_KEYS.includes(n)) { setMsg({ cls: 'ask', t: { uz: 'Faqat uch turdan birini yozing: funksional, ijtimoiy yoki emotsional.' } }); return; }
    if (n === DBG_ROWS[i].ok) {
      setFixed(p => p.map((x, k) => (k === i ? n : x)));
      setOpen(null); setVal('');
      setMsg({ cls: 'ok', t: { uz: `✓ To'g'ri — «${DBG_ROWS[i].vazifa}» ${n} vazifa.` } });
    } else {
      if (achMiss) achMiss.miss(screen);
      setMsg({ cls: 'ask', t: { uz: 'Bu tur vazifaga mos emas. Vazifani qayta o\'qing va uch savolni bering.' } });
    }
  };
  const onType = (i, v) => { setVal(v); const n = normTur(v); if (TUR_KEYS.includes(n)) check(i, v); };
  const nFixed = DBG_BAD.filter(i => fixed[i]).length;
  const starOk = kompNom(star.komp).length >= 2 && star.vazifa.trim().length >= 3 && TUR_KEYS.includes(normTur(star.tur));
  const rowTurn = useTurnHint(open === null && nFixed === 0 && !isMentor);
  // Loyiha-ko'prigi (96b): o'quvchining o'z komponentlari xuddi shu shaklda, faqat o'qish.
  const [jobs] = useState(() => readJobs());
  const kopRows = (jobs && jobs.stories.length ? jobs.stories.map(s => ({ komp: s.komponent, vazifa: s.natija, tur: s.tur })) : ZAXIRA_HIKOYA.map((s, i) => ({ komp: s.komp, vazifa: s.natija, tur: TUR_KEYS[i] })));
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish' })
    : open !== null ? tr({ uz: "② Turini qo'lda yozing" })
    : nFixed === 0 ? tr({ uz: '① Xato qatorni toping' })
    : tr({ uz: 'Yana 1 ta xato qator qoldi' });
  const S = (t) => <span className="tk-s">{t}</span>;
  return (
    <Stage eyebrow={tr({ uz: 'Koding · kodni tuzatish' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har komponent vazifasini aytadigan <span className="italic" style={{ color: T.accent }}>kodni</span> tuzating.</> })}</h2></div>
        <Mentor>{tr({ uz: "Markaz sayti uchta komponentdan yig'ilgan. Pastdagi kodda har komponentning vazifasi va turi yozilgan — ikki qatorda tur noto'g'ri. Topib, to'g'risini yozing." })}</Mentor>
        <div className="split">
          <Col gap={10}>
            <div className="kdpanel">
              <div className="stps">
                <span className={`stp ${nFixed > 0 || open !== null ? 'done' : 'on'}`}><i>{nFixed > 0 || open !== null ? '✓' : '1'}</i>{tr({ uz: 'Xato qatorni toping' })}</span>
                <span className={`stp ${done ? 'done' : (nFixed > 0 || open !== null) ? 'on' : ''}`}><i>{done ? '✓' : '2'}</i>{tr({ uz: "Turini qo'lda yozing" })}</span>
                <span className={`stp ${done ? 'done' : ''}`}><i>{done ? '✓' : '3'}</i>{tr({ uz: "Uch tur yonganini ko'ring" })}</span>
              </div>
              {msg && <p className={`sfb ${msg.cls} fade-step`}>{tr(msg.t)}</p>}
              <div className="wsxrow">
                <div className={`wsx ${yordamOpen ? 'open' : ''}`}>
                  <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>💡 {tr({ uz: 'Yordam' })} {yordamOpen ? '▾' : '▸'}</button>
                  {yordamOpen && <div className="wsx-body"><p>{tr({ uz: "Har qatorning vazifasini o'qing va uch savolni bering. Qaysi qatorda tur savolga mos emas?" })}</p></div>}
                </div>
                <div className={`wsx ${glossOpen ? 'open' : ''}`}>
                  <button className="wsx-toggle" onClick={() => setGlossOpen(o => !o)}>💡 {tr({ uz: "Yordam — bu so'zlar nima?" })} {glossOpen ? '▾' : '▸'}</button>
                  {glossOpen && <div className="wsx-body"><p>{tr({ uz: <><b>massiv</b> — kvadrat qavs ichidagi ro'yxat. Har qator — bitta komponent: <b>komponent</b>, <b>vazifa</b> va <b>tur</b>.</> })}</p></div>}
                </div>
                <div className={`wsx star ${starOpen ? 'open' : ''}`}>
                  <button className="wsx-toggle" onClick={() => setStarOpen(o => !o)}>⭐ {tr({ uz: "Qo'shimcha" })} {starOpen ? '▾' : '▸'}</button>
                  {starOpen && <div className="wsx-body"><p>{tr({ uz: "Massivga o'z saytingizdan bitta qator qo'shing: komponent, vazifa va tur." })}</p></div>}
                </div>
              </div>
            </div>
            <div className={`nur-site fade-up${done ? ' all' : ''}`}>
              <Nurlar compact names head={<>🇬🇧 {tr({ uz: 'Markaz sayti' })}</>} lit={TURLAR.map(t => DBG_ROWS.some((_, i) => curTur(i) === t.k))}
                slots={TURLAR.map(t => { const list = DBG_ROWS.filter((_, i) => curTur(i) === t.k); return list.length ? <span className="nur-chips">{list.map(r => <span key={r.komp} className="nur-chip"><code className="qcode">{`<${r.komp} />`}</code></span>)}</span> : null; })} />
              {done && <span className="done-mini fade-step">{tr({ uz: '✅ Uch komponent — uch tur vazifa.' })}</span>}
            </div>
            <StudentPracticePulse live={live} screen={screen} />
            <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '🐞 Kodni tuzatganlar' })} />
          </Col>
          <Col gap={10}>
            <div className="vsc no-copy" onCopy={e => e.preventDefault()} onCut={e => e.preventDefault()}>
              <div className="vsc-bar"><span className="vsc-tab on">App.jsx</span><span className="vsc-lock">🔒 {tr({ uz: 'nusxalash yopiq' })}</span></div>
              <div className="vsc-body">
                <div className="vsc-line"><span className="vsc-ln">1</span><span className="vsc-code tk-c">{"// App — markaz sayti shu uch komponentdan yig'ilgan"}</span></div>
                <div className="vsc-line"><span className="vsc-ln">2</span><span className="vsc-code"><span className="tk-t">{'<App>'}</span></span></div>
                {DBG_ROWS.map((r, i) => <div key={r.komp} className="vsc-line"><span className="vsc-ln">{3 + i}</span><span className="vsc-code">{'  '}<span className="tk-t">{`<${r.komp} />`}</span></span></div>)}
                <div className="vsc-line"><span className="vsc-ln">6</span><span className="vsc-code"><span className="tk-t">{'</App>'}</span></span></div>
                <div className="vsc-line"><span className="vsc-ln">7</span><span className="vsc-code">{' '}</span></div>
                <div className="vsc-line"><span className="vsc-ln">8</span><span className="vsc-code tk-c">{'// vazifalar — har komponent qaysi vazifani bajaradi'}</span></div>
                <div className="vsc-line"><span className="vsc-ln">9</span><span className="vsc-code"><span className="tk-k">const</span> vazifalar = [</span></div>
                {DBG_ROWS.map((r, i) => {
                  const isOpen = open === i;
                  const fx = fixed[i];
                  return (
                    <div key={r.komp} role="button" tabIndex={0} className={`vsc-line dbg${isOpen ? ' open' : ''}${fx ? ' fixed' : ''}${!fx && open === null && !done ? waveCls(rowTurn, i, 3) : ''}`} onClick={() => clickRow(i)} onKeyDown={e => { if (e.key === 'Enter' && !isOpen) clickRow(i); }}>
                      <span className="vsc-ln">{10 + i}</span>
                      <span className="vsc-code">{'  { komponent: '}{S(`'${r.komp}'`)}{`,${r.pad} vazifa: `}{S(`"${r.vazifa}"`)}{`,${r.vpad} tur: `}
                        {isOpen
                          ? <input autoFocus aria-label={tr({ uz: 'To\'g\'ri tur' })} className="dbg-in" value={val} maxLength={16} placeholder="…" onClick={e => e.stopPropagation()} onChange={e => onType(i, e.target.value)} onKeyDown={e => { if (e.key === 'Enter') check(i, val); }} onBlur={() => { if (val.trim()) check(i, val); }} />
                          : S(`'${fx || r.bor}'`)}
                        {' },'}{fx && <span className="dbg-ok"> ✓</span>}
                      </span>
                    </div>
                  );
                })}
                {starOpen && (
                  <div className="vsc-line dbg star">
                    <span className="vsc-ln">13</span>
                    <span className="vsc-code">{'  { komponent: '}<input className="dbg-in w" aria-label={tr({ uz: 'Komponent' })} value={star.komp} maxLength={20} placeholder="…" onChange={e => setStar(p => ({ ...p, komp: e.target.value }))} />{', vazifa: '}<input className="dbg-in w2" aria-label={tr({ uz: 'Vazifa' })} value={star.vazifa} maxLength={60} placeholder="…" onChange={e => setStar(p => ({ ...p, vazifa: e.target.value }))} />{', tur: '}<input className="dbg-in" aria-label={tr({ uz: 'Tur' })} value={star.tur} maxLength={16} placeholder="…" onChange={e => setStar(p => ({ ...p, tur: e.target.value }))} />{' },'}{starOk && <span className="dbg-ok"> ⭐</span>}</span>
                  </div>
                )}
                <div className="vsc-line"><span className="vsc-ln">{starOpen ? 14 : 13}</span><span className="vsc-code">];</span></div>
              </div>
            </div>
            {done && (
              <div className="card kbridge fade-step">
                <div className="card-lbl" style={{ color: T.accent }}>🔗 {tr({ uz: "Loyihaga ko'prik" })}</div>
                <p className="small" style={{ margin: '0 0 8px', color: T.ink2 }}>{tr({ uz: jobs && jobs.stories.length ? 'Sizning komponentlaringiz xuddi shu shaklda:' : 'Markaz hikoyalarining komponentlari xuddi shu shaklda:' })}</p>
                <div className="vsc"><div className="vsc-body">
                  {kopRows.map((r, i) => <div key={i} className="vsc-line"><span className="vsc-ln">{i + 1}</span><span className="vsc-code">{'{ komponent: '}{S(`'${r.komp}'`)}{', vazifa: '}{S(`"${r.vazifa}"`)}{', tur: '}{S(`'${r.tur}'`)}{' }'}</span></div>)}
                </div></div>
              </div>
            )}
          </Col>
        </div>
        <MentorNote>{tr({ uz: "Kod ko'chirilmaydi — qiymat qo'lda yoziladi. Tuzatish bitta so'z, lekin uni topish uchun vazifani o'qish kerak — shu darsning o'zi. Bu mashqni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq." })}</MentorNote>
        {!done && <AchRule screen={screen} />}
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — REFLEKSIYA: 2 qadam (ayting + yozing, 54e) =====
function PairTimer({ onStage, muted }) {
  const [st, setSt] = useState({ running: false, left: 60, done: false });
  const stage = st.running ? 'running' : (st.done ? 'done' : 'idle');
  useEffect(() => { if (onStage) onStage(stage); }, [stage]); // eslint-disable-line
  const startTurn = useTurnHint(!st.running && !st.done && !muted);
  useEffect(() => {
    if (!st.running) return;
    if (st.left <= 0) { setSt({ running: false, left: 60, done: true }); return; }
    const t = setTimeout(() => setSt(p => ({ ...p, left: p.left - 1 })), 1000);
    return () => clearTimeout(t);
  }, [st.running, st.left]);
  const isA = st.left > 30;
  const phaseLeft = isA ? st.left - 30 : st.left;
  const R = 34, C = 2 * Math.PI * R, frac = phaseLeft / 30;
  return (
    <div className="pair-timer">
      {st.running ? (
        <div className="pair-live">
          <div className={`pair-ring ${isA ? 'a' : 'b'}`}>
            <svg width="82" height="82" viewBox="0 0 88 88" aria-hidden="true">
              <circle cx="44" cy="44" r={R} fill="none" stroke={T.line} strokeWidth="7" />
              <circle cx="44" cy="44" r={R} fill="none" stroke={isA ? T.accent : T.blue} strokeWidth="7" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 44 44)" style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div className="pair-ring-mid"><span className={`pair-ring-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span><span className="pair-ring-sec">{phaseLeft}s</span></div>
          </div>
          <div className="pair-live-txt">
            <span className="pair-now">{tr({ uz: 'Hozir ', ru: 'Сейчас говорит ' })}<span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span>{tr({ uz: ' gapiradi', ru: '' })}</span>
            <span className="pair-next">{isA ? tr({ uz: 'keyin — B navbati', ru: 'потом — очередь B' }) : tr({ uz: 'oxirgi navbat', ru: 'последняя очередь' })}</span>
          </div>
        </div>
      ) : (
        <p className="pair-now" style={{ margin: 0 }}>{st.done ? tr({ uz: "✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla!", ru: '✓ Время вышло — рассказали оба. Молодцы!' }) : tr({ uz: 'Har biringizga 30 soniyadan — avval A, keyin B.', ru: 'По 30 секунд каждому — сначала A, потом B.' })}</p>
      )}
      <div className="pair-timer-btns">
        {!st.running && <button className={st.done ? 'btn-soft' : `pair-start${startTurn ? '' : ' calm'}`} onClick={() => setSt({ running: true, left: 60, done: false })}>{st.done ? tr({ uz: '↻ Yana 1 daqiqa', ru: '↻ Ещё 1 минута' }) : tr({ uz: '▶ 1 daqiqani boshlash', ru: '▶ Запустить минуту' })}</button>}
        {st.running && <button className="btn-soft" onClick={() => setSt({ running: false, left: 60, done: false })}>{tr({ uz: "⏹ To'xtatish", ru: '⏹ Остановить' })}</button>}
      </div>
    </div>
  );
}
const REFLECT_KEY = 'pm-m3d3-reflection';
const ScreenReflection = ({ screen, onNext, onPrev }) => {
  const [text, setText] = useState(() => { try { return localStorage.getItem(REFLECT_KEY) || ''; } catch { return ''; } });
  const save = (v) => { setText(v); try { localStorage.setItem(REFLECT_KEY, v); } catch {} };
  const written = text.trim().length >= 8;
  const [pairStage, setPairStage] = useState('idle');
  const [reflFocus, setReflFocus] = useState(false);
  const inputTurn = useTurnHint(pairStage === 'done' && !written && !reflFocus);
  return (
    <Stage eyebrow={tr({ uz: 'Mustahkamlash · 2 qadam' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext turnBusy={!written} label={tr({ uz: 'Davom etish' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Hikoyalaringizda qaysi tur kam edi — <span className="italic" style={{ color: T.accent }}>yoddan</span> ayta olasizmi?</> })}</h2></div>
        <Mentor>{tr({ uz: "Ekranga qaramasdan, yoddan aytib bering: hikoyalaringizda qaysi tur vazifa kam edi va unga qaysi komponent qo'shdingiz? Avval sherigingizga ayting, keyin bir qatorda yozing." })}</Mentor>
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">{tr({ uz: '🗣 Sherigingizga ayting' })}</span></div></div>
            <PairTimer onStage={setPairStage} muted={written} />
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">{tr({ uz: '✍️ Endi bir qator yozing' })}</span></div></div>
            <span className={`turn-wrap${inputTurn ? ' turn-ring' : ''}`}>
              <input className="reflect-input" value={text} onChange={e => save(e.target.value)} onFocus={() => setReflFocus(true)} onBlur={() => setReflFocus(false)} placeholder={tr({ uz: 'Kam tur — ..., qo\'shgan komponentim — ...' })} maxLength={160} />
            </span>
            {written && <p className="small" style={{ margin: 0, color: T.success, fontWeight: 700 }}>{tr({ uz: '✓ Yozildi!' })}</p>}
          </div>
        </div>
        <MentorNote>{tr({ uz: "Uchdan biridan ko'pi turini ayta olmasa — uch savol ekranini qayta oching va bitta hikoyani birga uch savoldan o'tkazing." })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 15 — FLASHCARD (10 karta · mentorsiz, 99a-qonun) =====
const fcTier = (s) => (s.length <= 8 ? 't1' : s.length <= 16 ? 't2' : s.length <= 32 ? 't3' : 't4');
function Flashcards({ cards }) {
  const [queue, setQueue] = useState(() => cards.map((_, i) => i));
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [exiting, setExiting] = useState(null);
  const swapRef = useRef(0);
  const total = cards.length;
  const cur = queue[0];
  const card = cur != null ? cards[cur] : null;
  const advance = (removed) => {
    if (exiting) return;
    setExiting(removed ? 'knew' : 'again');
    setTimeout(() => {
      setExiting(null); setFlipped(false); swapRef.current++;
      if (removed) setKnown(k => k + 1);
      setQueue(q => { const [first, ...rest] = q; return removed ? rest : [...rest, first]; });
    }, 420);
  };
  const restart = () => { setQueue(cards.map((_, i) => i)); setKnown(0); setFlipped(false); };
  if (!card) return (
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{tr({ uz: `${total}/${total} karta yodlandi`, ru: `${total}/${total} карточек выучено` })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda ·", ru: '↻ Учим ·' })} <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim ·', ru: '✓ Знаю ·' })} <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
          <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
            <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span></div>
            <div className="fc-face fc-back"><span className={`fc-tag ${fcTier(tr(card.back))}`}>{tr(card.back)}</span></div>
          </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={() => advance(false)}>{tr({ uz: '✗ Takrorlash', ru: '✗ Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={() => advance(true)}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })}</button></div>)
        : (<p className="fc-hint">{tr({ uz: "Javobni ko'rish uchun kartani aylantiring", ru: 'Переверните карточку, чтобы увидеть ответ' })}</p>)}
    </div>
  );
}
const FLASHCARDS = [
  { front: { uz: 'Mahsulot odam uchun bajaradigan narsa nima deyiladi?' }, back: { uz: "Vazifa (Jobs-to-be-Done — «bajarilishi kerak bo'lgan vazifa»)" } },
  { front: { uz: 'Funksional vazifa qaysi savolga javob beradi?' }, back: { uz: 'Menga amalda nima beradi?' } },
  { front: { uz: 'Ijtimoiy vazifa qaysi savolga javob beradi?' }, back: { uz: "Boshqalar oldida qanday bo'laman?" } },
  { front: { uz: 'Emotsional vazifa qaysi savolga javob beradi?' }, back: { uz: "O'zimni qanday his qilaman?" } },
  { front: { uz: '«Sertifikat olib, universitetga kirish» — qaysi tur?' }, back: { uz: 'Funksional' } },
  { front: { uz: "«Imtihondan qo'rqmay tayyorlanish» — qaysi tur?" }, back: { uz: 'Emotsional' } },
  { front: { uz: "Starbucks o'zini qanday joy deb qurgan?" }, back: { uz: "Uchinchi joy — uy va maktabdan tashqari, kelib o'tiradigan joy" } },
  { front: { uz: 'Starbucks nechta tur vazifani birga bajaradi?' }, back: { uz: 'Uchalasini' } },
  { front: { uz: "Komponenti yo'q vazifa bilan nima bo'ladi?" }, back: { uz: 'U bajarilmay qoladi' } },
  { front: { uz: 'Hikoyalaringizda qaysi tur kam bo\'lsa, nima qilasiz?' }, back: { uz: "Shu tur uchun yangi komponent qo'shaman" } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

const ScreenFinalTest = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Yakuniy tekshiruv' })} scope="final"
    ctaLabel={tr({ uz: 'Javobni tanlang' })} revealPrefix={tr({ uz: "To'g'ri javob" })}
    question={<TestQ card={<>📜 {tr({ uz: "«Men yangi o'quvchi sifatida o'tgan darsni videoda ko'rishni xohlayman, dars qoldirsam ham xavotir olmaslik uchun.»" })}</>} ask={tr({ uz: 'Bu hikoyaning natijasi qaysi tur vazifa?' })} />}
    questionText={tr({ uz: 'Hikoya natijasining turi' })}
    options={[tr({ uz: 'Funksional' }), tr({ uz: 'Emotsional' }), tr({ uz: 'Ijtimoiy' })]}
    correctIdx={1}
    explainCorrect={tr({ uz: "Natija «xavotir olmaslik»: bu o'zingizni qanday his qilishingiz haqida." })}
    explainWrong={{
      0: tr({ uz: "Videoni ko'rish — hikoyaning «nima» bo'lagi. Natija «xavotir olmaslik» — bu his: emotsional." }),
      2: tr({ uz: "Natijada boshqalar tilga olinmagan. «Xavotir olmaslik» — bu his: emotsional." }),
      default: tr({ uz: "Natija «xavotir olmaslik» — bu his, ya'ni emotsional vazifa." })
    }}
  />
);

// ===== UYGA VAZIFA — alohida ekran EMAS, YAKUN sahifasi ichida (etalon: P0 · PmLesson8) =====
// B6 (GATE S): uch savol topshiriq-kartasining o'zida yoziladi — oila a'zosi ularni bilmaydi.
const HW_KEY = 'pm-m3d3-hw-target';
const HW_VARIANT = [
  { k: 'toliq', t: { uz: "To'liq · ~20 daqiqa" } },
  { k: 'qisqa', t: { uz: 'Qisqa · ~10 daqiqa' } },
];
const HW_STEPS = {
  toliq: [
    { uz: "Yangi komponentingiz vazifasini bir oila a'zosiga o'qib bering" },
    { uz: "Pastdagi uch savolni ko'rsating va so'rang: qaysi biri mos keladi?" },
    { uz: 'Javobini yozing va tur mos keldimi — belgilang' },
  ],
  qisqa: [
    { uz: 'Mustaqil mashqda yozgan yangi komponentingizni oling' },
    { uz: 'Pastdagi uch savoldan mosini tanlang' },
    { uz: 'Nega shu tur ekanini bir gapda yozing' },
  ],
};
const readHwTarget = () => { try { return localStorage.getItem(HW_KEY) || ''; } catch { return ''; } };
const HW_TOKENS = [
  { t: { uz: 'vazifa' }, l: 5, tp: 16, s: 12, d: 6.5 },
  { t: { uz: 'funksional' }, l: 76, tp: 12, s: 11, d: 7.5 },
  { t: { uz: 'ijtimoiy' }, l: 12, tp: 70, s: 11, d: 8 },
  { t: { uz: 'emotsional' }, l: 64, tp: 76, s: 12, d: 6 },
  { t: { uz: 'komponent' }, l: 84, tp: 52, s: 10, d: 9 },
  { t: { uz: 'tur' }, l: 36, tp: 8, s: 10, d: 7 },
  { t: { uz: 'savol' }, l: 3, tp: 44, s: 13, d: 8.5 },
];
const HwCard = ({ variant, onPick }) => {
  const steps = HW_STEPS[variant] || HW_STEPS.toliq;
  const pickTurn = useTurnHint(!variant && !!onPick);
  return (
    <div className="card hw fade-step">
      <div className="card-lbl" style={{ color: T.accent }}>📝 {tr({ uz: 'Uyda yangi komponentingizni sinaysiz' })}</div>
      <p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "Uyda saytingizdagi yangi komponentning vazifasini bir oila a'zosiga o'qib bering va uch savoldan qaysi biri mos kelishini so'rang. Qancha vaqtingiz bor — o'zingiz tanlang." })}</p>
      <div className="hw-chips">
        {HW_VARIANT.map((v, vi) => (
          <button key={v.k} className={`hw-chip ${variant === v.k ? 'on' : ''}${waveCls(pickTurn, vi, HW_VARIANT.length)}`} onClick={() => onPick(v.k)}>{tr(v.t)}</button>
        ))}
      </div>
      {variant ? (
        <div className="pmtask fade-step">
          <div className="pmtask-head"><span className="pmtask-tag">{tr({ uz: '🗂 Topshiriq kartasi' })}</span><span className="pmtask-id">{variant === 'qisqa' ? tr({ uz: 'QISQA' }) : tr({ uz: "TO'LIQ" })}</span></div>
          <div className="pmtask-rows">
            <div className="pmtask-row"><span className="pmtask-k">{tr({ uz: 'Nima' })}</span><span className="pmtask-v"><b>{tr({ uz: 'yangi komponentingiz' })}</b></span></div>
            <div className="pmtask-row"><span className="pmtask-k">{tr({ uz: 'Muddat' })}</span><span className="pmtask-v"><b>{tr({ uz: 'keyingi darsgacha' })}</b></span></div>
          </div>
          <div className="pmtask-steps">
            {steps.map((s, i) => <span key={i} className="pmtask-step"><i>{i + 1}</i>{tr(s)}</span>)}
          </div>
          <div className="hw-q3">
            {TURLAR.map(t => <span key={t.k} className={`hw-q ${t.k}`}><span>{t.ic}</span>{tr(t.q)}</span>)}
          </div>
        </div>
      ) : (
        <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Variantni tanlang — topshiriq-karta shunga moslashadi.' })}</p></div>
      )}
    </div>
  );
};
// ===== 🏅 NISHONLAR — 4 ta, faqat REAL tekshiriladigan harakatga (senariy 10-bo'lim) =====
const ACHIEVEMENTS = {
  typeSorter: { icon: '🗂', name: 'Type Sorter!', desc: { uz: 'Olti gapni uch turga ajratdingiz' } },
  jobFinder:  { icon: '🔎', name: 'Job Finder!',  desc: { uz: 'Hikoyalaringiz turini aniqladingiz' } },
  gapSpotter: { icon: '🧭', name: 'Gap Spotter!', desc: { uz: 'Komponentsiz vazifani topdingiz' } },
  bugFixer:   { icon: '🐞', name: 'Bug Fixer!',   desc: { uz: 'Koddagi ikki xatoni tuzatdingiz' } },
};
const ACH_TRIGGERS = { s4: 'typeSorter', s9: 'jobFinder', s10: 'gapSpotter', s11: 'bugFixer' };

// 🏅 151-qonun: amaliy topshiriq nishoni faqat BIRINCHI urinishga beriladi. Shart OLDINDAN aytiladi; birinchi urinish
// xato bo'lsa — jazosiz qisqa xabar (`once` — qayta urinishi yo'q ekran). Mentor ekranida, «Qaytadan» mashq-o'tishida va
// nishon olingach ko'rinmaydi. Matn — MATN_KORPUS §183 (hamma darsda aynan bir xil).
const AchRule = ({ screen, once }) => {
  const earned = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const gate = useContext(LiveGateCtx) || {};
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !am || am.practice || (gate.live && gate.live.mode === 'mentor') || (earned && earned.has(ach))) return null;
  const lost = am.missed.has(sid);
  return <p className={`ach-rule ${lost ? 'lost' : ''}`}>{lost
    ? (once ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок давался за первую попытку.' }) : tr({ uz: "Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.", ru: 'Значок давался за первую попытку — теперь спокойно найдите верный ответ.' }))
    : tr({ uz: "🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: '🏅 Справитесь с первой попытки — значок ваш.' })}</p>;
};

function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={tr({ uz: `Yangi nishon: ${ach.name}`, ru: `Новая награда: ${ach.name}` })}>
      <div className="acu-rays" aria-hidden="true" />
      <div className="acu-glow" aria-hidden="true" />
      <div className="acu-ring" aria-hidden="true" />
      <div className="acu-ring d2" aria-hidden="true" />
      <div className="acu-stage">
        <div className="acu-medal-wrap">
          <div className="acu-medal">{ach.icon}<span className="acu-shine" /></div>
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="acu-spark" style={{ '--a': `${i * (360 / 14)}deg`, animationDelay: `${0.18 + (i % 5) * 0.05}s` }}>✦</span>
          ))}
        </div>
        <div className="acu-txt">
          <span className="acu-name">{ach.name}</span>
          {ach.desc && <span className="acu-desc">{tr(ach.desc)}</span>}
        </div>
        <span className="acu-tap">{tr({ uz: 'bosib davom eting', ru: 'нажмите, чтобы продолжить' })}</span>
      </div>
    </div>
  );
}
function AchToasts({ toasts, onDone }) {
  const t = toasts[0];
  const a = t && ACHIEVEMENTS[t.id];
  if (!a) return null;
  return <AchCelebrate key={t.k} ach={a} onDone={() => onDone(t.k)} />;
}

const Confetti = () => {
  const COLORS = [T.accent, T.success, T.blue, '#FFD380', '#FF7755', '#7DD181'];
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 44 }).map((_, i) => {
        const left = (i * 2.31 + (i % 7) * 4) % 100;
        const size = 6 + (i % 4) * 2;
        return (
          <span key={i} className="confetti-bit" style={{
            left: `${left}%`, background: COLORS[i % COLORS.length],
            width: size, height: size * 1.5,
            animationDelay: `${(i % 11) * 0.16}s`,
            animationDuration: `${2.4 + (i % 6) * 0.45}s`,
            borderRadius: i % 2 ? '2px' : '50%'
          }} />
        );
      })}
    </div>
  );
};


// Podium savol yorliqlari (scored indekslar 3/5/7/12)
const Q_LABELS = { 3: { uz: '1 — Uch savol' }, 5: { uz: '2 — Yangi xona' }, 7: '3 — Starbucks', 12: { uz: '4 — Yakuniy savol' } };
const QUIZ_MS = 15000;
const QZ_BG_SHAPES = [
  { ch: { uz: 'vazifa' },     l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'funksional' }, l: 80, t: 8,  s: 24, d: 23, dl: 1.5 },
  { ch: { uz: 'ijtimoiy' },   l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'emotsional' }, l: 72, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'komponent' },  l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: 'tur' },        l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'savol' },      l: 26, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: { uz: 'markaz' },     l: 55, t: 5,  s: 20, d: 22, dl: 0.6 },
  { ch: '🔧', l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '👥', l: 16, t: 52, s: 28, d: 26, dl: 2.6 },
  { ch: '💗', l: 2,  t: 30, s: 30, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike — 12 savol · 3/3/3/3 · naqshsiz (2,0,3,1,1,3,0,2,3,0,2,1). darslik-jonli TASDIQLAYDI.
const QUIZ_BANK = [
  { q: { uz: 'Mahsulot odam uchun bajaradigan narsa nima deyiladi?' }, opts: [{ uz: 'narxi' }, { uz: 'rangi' }, { uz: 'vazifasi' }, { uz: 'nomi' }], correct: 2 },
  { q: { uz: '«Menga amalda nima beradi?» — qaysi tur savoli?' }, opts: [{ uz: 'funksional' }, { uz: 'ijtimoiy' }, { uz: 'emotsional' }, { uz: 'hech qaysi' }], correct: 0 },
  { q: { uz: "«Boshqalar oldida qanday bo'laman?» — qaysi tur savoli?" }, opts: [{ uz: 'funksional' }, { uz: 'emotsional' }, { uz: 'hech qaysi' }, { uz: 'ijtimoiy' }], correct: 3 },
  { q: { uz: "«O'zimni qanday his qilaman?» — qaysi tur savoli?" }, opts: [{ uz: 'ijtimoiy' }, { uz: 'emotsional' }, { uz: 'funksional' }, { uz: 'hech qaysi' }], correct: 1 },
  { q: { uz: '«Uyga yaqin — avtobussiz boraman» qaysi tur?' }, opts: [{ uz: 'ijtimoiy' }, { uz: 'funksional' }, { uz: 'emotsional' }, { uz: 'hech qaysi' }], correct: 1 },
  { q: { uz: "«Imtihon yaqinlashsa ham qo'rqmayman» qaysi tur?" }, opts: [{ uz: 'funksional' }, { uz: 'ijtimoiy' }, { uz: 'hech qaysi' }, { uz: 'emotsional' }], correct: 3 },
  { q: { uz: "«Guruhda eng kuchli bo'lib ko'rinaman» qaysi tur?" }, opts: [{ uz: 'ijtimoiy' }, { uz: 'funksional' }, { uz: 'emotsional' }, { uz: 'hech qaysi' }], correct: 0 },
  { q: { uz: "Starbucks o'zini qanday joy deb qurgan?" }, opts: [{ uz: "eng arzon kofe do'koni" }, { uz: 'tez olib ketiladigan joy' }, { uz: 'uchinchi joy' }, { uz: "faqat ichimlik do'koni" }], correct: 2 },
  { q: { uz: 'Starbucks nechta tur vazifani birga bajaradi?' }, opts: [{ uz: 'bittasini' }, { uz: 'ikkitasini' }, { uz: 'hech birini' }, { uz: 'uchalasini' }], correct: 3 },
  { q: { uz: 'Saytda har vazifani nima bajaradi?' }, opts: [{ uz: "o'z komponenti" }, { uz: 'alohida sayt' }, { uz: 'yangi rang' }, { uz: 'yangi nom' }], correct: 0 },
  { q: { uz: 'Saytda faqat jadval va narxlar bor. Qaysi tur vazifa bajarilmaydi?' }, opts: [{ uz: 'funksional' }, { uz: 'hech qaysi' }, { uz: 'emotsional' }, { uz: 'hammasi bajariladi' }], correct: 2 },
  { q: { uz: "Kodda «qo'rqmaslik» vazifasiga `tur: 'funksional'` yozilgan. Nima qilinadi?" }, opts: [{ uz: "qator o'chiriladi" }, { uz: "tur 'emotsional' qilinadi" }, { uz: "vazifa o'chiriladi" }, { uz: 'hech narsa qilinmaydi' }], correct: 1 },
];

const CsNeonBolt = ({ flip }) => (
  <span className={`csn-boltwrap ${flip ? 'flip' : ''}`} aria-hidden="true">
    <svg className="csn-bolt" viewBox="0 0 60 100">
      <defs><linearGradient id="csnb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#B08CFF" /></linearGradient></defs>
      <path d="M38 4 L10 52 L27 52 L20 96 L52 40 L33 40 Z" fill="url(#csnb)" stroke="rgba(255,255,255,.65)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
    <i className="cs-spark s1" /><i className="cs-spark s2" /><i className="cs-spark s3" />
  </span>
);
const CsWordmark = ({ onClick, disabled, hint, stats = true, bolt = true, liveOn = false }) => {
  const clickable = !!onClick && !disabled;
  const [charge, setCharge] = useState(false);
  const fire = () => {
    if (!clickable || charge) return;
    setCharge(true);
    setTimeout(onClick, 430);
    setTimeout(() => setCharge(false), 900);
  };
  return (
    <div
      className={`cs-cap ${clickable ? 'cs-clickable' : ''} ${disabled ? 'cs-off' : ''} ${liveOn ? 'cs-live' : ''} ${charge ? 'cs-charging' : ''}`}
      {...(clickable ? { role: 'button', tabIndex: 0, onClick: fire, onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } } } : {})}
    >
      <span className="cs-ring" aria-hidden="true" />
      <div className="cs-sky" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => (
          <span key={i} className={`cs-tok ${i % 2 ? 'back' : 'front'}`} style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: `clamp(9px, ${Math.round(s.s * 0.4)}px, ${Math.round(s.s * 0.6)}px)`, '--d': `${s.d}s`, animationDelay: `-${s.dl * 3}s` }}>{tr(s.ch)}</span>
        ))}
        {[[14, 30, 24], [38, 66, 15], [57, 20, 27], [76, 60, 18], [88, 36, 13]].map(([l, t, w], i) => (
          <i key={i} className="cs-dash" style={{ left: `${l}%`, top: `${t}%`, width: w, animationDelay: `-${i * 1.7}s` }} />
        ))}
        <span className="cs-thunder" />
      </div>
      <div className="cs-row">
        {bolt && <CsNeonBolt />}
        <div className="cs-word" data-text="CODE STRIKE" aria-label="CodeStrike">CODE STRIKE</div>
        {bolt && <CsNeonBolt flip />}
      </div>
      {stats && (
        <div className="cs-hud">
          <span className="cs-hud-i"><b>{QUIZ_BANK.length}</b> {tr({ uz: 'SAVOL', ru: 'ВОПРОСОВ' })}</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i"><b>{QUIZ_MS / 1000}</b> {tr({ uz: 'SONIYA', ru: 'СЕКУНД' })}</span>
          <span className="cs-hud-dot">·</span>
          <span className="cs-hud-i">{tr({ uz: '🏆 PODIUM', ru: '🏆 ПОДИУМ' })}</span>
        </div>
      )}
      {hint && <span className={`cs-enter ${disabled ? 'wait' : ''}`}>{hint}</span>}
      {liveOn && <span className="cs-livedot"><i />LIVE</span>}
      {charge && <span className="cs-portal" aria-hidden="true" />}
    </div>
  );
};

// ===== ⚔️ CODESTRIKE ARENA — signal zonasi: 100+ =====
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C'];
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
const quizPts = (elapsedMs) => elapsedMs <= 500 ? 1000 : Math.max(0, Math.round(1000 * (1 - (Math.min(elapsedMs, QUIZ_MS) / QUIZ_MS) / 2)));
const quizScore = (rows) => {
  const byQ = {};
  rows.forEach(r => { byQ[r.screen_idx - QUIZ_BASE_IDX] = r; });
  let pts = 0, streak = 0, maxStreak = 0, ok = 0;
  for (let i = 0; i < QUIZ_BANK.length; i++) {
    const a = byQ[i];
    if (a && a.correct) { streak++; maxStreak = Math.max(maxStreak, streak); ok++; pts += quizPts(a.elapsed_ms) + (streak >= 2 ? 100 : 0); }
    else streak = 0;
  }
  return { pts, ok, maxStreak };
};

function QzTimer({ remaining }) {
  const R = 26, C = 2 * Math.PI * R;
  const frac = Math.max(0, Math.min(1, remaining / QUIZ_MS));
  const sec = Math.ceil(remaining / 1000);
  const col = remaining > 10000 ? '#2BD97C' : remaining > 5000 ? '#FFC94D' : '#FF5A5A';
  return (
    <div className={`qz-timer ${remaining <= 5000 && remaining > 0 ? 'urgent' : ''}`}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="6" />
        <circle cx="32" cy="32" r={R} fill="none" stroke={col} strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 32 32)" style={{ transition: 'stroke-dashoffset 0.12s linear, stroke 0.4s' }} />
      </svg>
      <span className="qz-timer-n" style={{ color: col }}>{sec}</span>
    </div>
  );
}

function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = ['vazifa', 'funksional', 'ijtimoiy', 'emotsional', 'komponent', 'tur', 'savol', 'markaz', '🔧', '💗'];
    const em = [], toks = [];
    for (let i = 0; i < 26; i++) em.push({ x: Math.random() * W, y: Math.random() * H, z: .3 + Math.random() * .7, ph: Math.random() * 6.28, sw: .3 + Math.random() * .6 });
    for (let i = 0; i < 9; i++) toks.push({ x: Math.random() * W, y: Math.random() * H, z: .4 + Math.random() * .9, vx: (Math.random() - .5) * .16, t: TOK[i % TOK.length], r: (Math.random() - .5) * .5 });
    const draw = (tm) => {
      ctx.clearRect(0, 0, W, H);
      for (const p of em) { p.y -= (.15 + p.z * .35) * DPR; p.x += Math.sin(tm / 1400 + p.ph) * p.sw * DPR * .35; if (p.y < -12) { p.y = H + 12; p.x = Math.random() * W; } }
      ctx.lineWidth = 1 * DPR;
      for (let a = 0; a < em.length; a++) for (let b = a + 1; b < em.length; b++) { const dx = em[a].x - em[b].x, dy = em[a].y - em[b].y, d = Math.sqrt(dx * dx + dy * dy), mx = 95 * DPR; if (d < mx) { ctx.strokeStyle = 'rgba(150,95,255,' + (.11 * (1 - d / mx)) + ')'; ctx.beginPath(); ctx.moveTo(em[a].x, em[a].y); ctx.lineTo(em[b].x, em[b].y); ctx.stroke(); } }
      for (const p of em) { const s = (1.3 + p.z * 2.2) * DPR, tw = .22 + p.z * .3 + Math.sin(tm / 600 + p.ph) * .1; ctx.fillStyle = 'rgba(205,175,255,' + tw + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, s, 0, 6.29); ctx.fill(); }
      for (const t of toks) { t.x += t.vx * DPR; t.y -= (.08 + t.z * .12) * DPR; if (t.y < -34) t.y = H + 34; if (t.x < -50) t.x = W + 50; if (t.x > W + 50) t.x = -50; ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(t.r * .12); ctx.font = '700 ' + ((13 + t.z * 22) * DPR) + 'px "JetBrains Mono",monospace'; ctx.fillStyle = 'rgba(190,150,255,' + (.05 + t.z * .07) + ')'; ctx.textAlign = 'center'; ctx.fillText(t.t, 0, 0); ctx.restore(); }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size); };
  }, []);
  return <canvas ref={ref} className="qz-fx" aria-hidden="true" />;
}

function QuizArena({ live, onClose, startSolo }) {
  const isMentor = live.mode === 'mentor';
  const isStudent = live.mode === 'student';
  const [soloMode, setSoloMode] = useState(!!startSolo);
  const solo = soloMode || (!isMentor && !isStudent);
  const soloRef = useRef(solo);
  soloRef.current = solo;
  const [phase, setPhase] = useState('lobby');
  const [qi, setQi] = useState(-1);
  const [remaining, setRemaining] = useState(QUIZ_MS);
  const [myAnswers, setMyAnswers] = useState({});
  const [players, setPlayers] = useState([]);
  const [qRows, setQRows] = useState([]);
  const [answeredN, setAnsweredN] = useState(0);
  const [classEnded, setClassEnded] = useState(false);
  const seenQRef = useRef(-1);
  const qStartRef = useRef(0);
  const deadlineRef = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (!isStudent || solo || !live.playerId) return;
    liveQuizAnswers(live.pin).then(rows => {
      const mine = {};
      rows.filter(r => r.player_id === live.playerId).forEach(r => { mine[r.screen_idx - QUIZ_BASE_IDX] = { picked: r.picked, correct: r.correct, elapsed: r.elapsed_ms }; });
      setMyAnswers(m => ({ ...mine, ...m }));
    }).catch(() => {});
  }, []); // eslint-disable-line

  useEffect(() => {
    if (soloRef.current) return;
    let on = true, t = null;
    const tick = async () => {
      if (soloRef.current) return;
      try {
        const row = await liveGet(live.pin);
        if (!on) return;
        if (row) {
          const st = row.quiz_state || 'off', q = row.quiz_q ?? -1;
          if (st === 'q' && q !== seenQRef.current) {
            seenQRef.current = q; qStartRef.current = Date.now();
            deadlineRef.current = Date.now() + QUIZ_MS - (isMentor ? 0 : 700);
            setQi(q); setRemaining(deadlineRef.current - Date.now()); setPhase('q'); setAnsweredN(0);
          } else if (st === 'r') {
            if (q !== seenQRef.current) { seenQRef.current = q; setQi(q); }
            setPhase(p => p === 'done' ? p : 'reveal');
          }
          else if (st === 'done') { setPhase('done'); }
        }
        const st1 = row ? (row.quiz_state || 'off') : null;
        const ph = st1 === 'r' ? 'reveal' : st1 === 'done' ? 'done' : st1 === 'lobby' ? 'lobby' : st1 === 'q' ? 'q' : phaseRef.current;
        if (on) setClassEnded(!row || row.status === 'ended');
        if (ph === 'lobby' || ph === 'reveal' || ph === 'done' || phaseRef.current === 'reveal') {
          const [pl, qa] = await Promise.all([livePlayers(live.pin), liveQuizAnswers(live.pin)]);
          if (on) { setPlayers(pl); setQRows(qa); }
        } else if (ph === 'q' && isMentor) {
          const [pl, qa] = await Promise.all([livePlayers(live.pin), liveAnswers(live.pin, QUIZ_BASE_IDX + seenQRef.current)]);
          if (on) { setPlayers(pl); setAnsweredN(qa.length); }
        }
      } catch {}
      if (on) t = setTimeout(tick, 1200);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, []); // eslint-disable-line

  useEffect(() => {
    if (phase !== 'q') return;
    const iv = setInterval(() => {
      const rem = deadlineRef.current - Date.now();
      setRemaining(rem > 0 ? rem : 0);
      if (rem <= 0) {
        clearInterval(iv);
        setPhase('reveal');
        if (isMentor && !soloRef.current) ctrl('r', seenQRef.current);
      }
    }, 100);
    return () => clearInterval(iv);
  }, [phase, qi]); // eslint-disable-line

  const ctrl = async (state, q) => {
    try {
      await live.quizControl(state, q);
      if (state === 'q') { seenQRef.current = q; qStartRef.current = Date.now(); deadlineRef.current = Date.now() + QUIZ_MS; setQi(q); setRemaining(QUIZ_MS); setPhase('q'); setAnsweredN(0); }
      else if (state === 'r' || state === 'done') {
        setPhase(state === 'r' ? 'reveal' : 'done');
        Promise.all([livePlayers(live.pin), liveQuizAnswers(live.pin)]).then(([pl, qa]) => { setPlayers(pl); setQRows(qa); }).catch(() => {});
      }
    } catch {}
  };
  const soloStart = (i) => { seenQRef.current = i; qStartRef.current = Date.now(); deadlineRef.current = Date.now() + QUIZ_MS; setQi(i); setRemaining(QUIZ_MS); setPhase('q'); };
  const soloNext = () => { const n = qi + 1; if (n >= QUIZ_BANK.length) setPhase('done'); else soloStart(n); };
  const soloReplay = () => { setMyAnswers({}); soloStart(0); };
  const startPractice = () => { setSoloMode(true); setMyAnswers({}); soloStart(0); };

  const answer = (i) => {
    if (phase !== 'q' || isMentor || myAnswers[qi]) return;
    const elapsed = Math.min(QUIZ_MS, Date.now() - qStartRef.current);
    const correct = i === QUIZ_BANK[qi].correct;
    setMyAnswers(m => ({ ...m, [qi]: { picked: i, correct, elapsed } }));
    if (isStudent && !solo) live.submitAnswer(QUIZ_BASE_IDX + qi, `quiz-${qi}`, i, correct, elapsed);
    if (solo) setPhase('reveal');
  };

  const streakUpTo = (k) => { let s = 0; for (let i = 0; i <= k; i++) { if (myAnswers[i]?.correct) s++; else s = 0; } return s; };
  const myPtsFor = (k) => { const a = myAnswers[k]; if (!a || !a.correct) return 0; return quizPts(a.elapsed) + (streakUpTo(k) >= 2 ? 100 : 0); };

  const board = players.map(p => { const s = quizScore(qRows.filter(r => r.player_id === p.id)); return { id: p.id, nickname: p.nickname, ...s }; }).sort((a, b) => b.pts - a.pts || b.ok - a.ok);
  const myRank = live.playerId ? board.findIndex(b => b.id === live.playerId) : -1;
  const soloRows = Object.entries(myAnswers).map(([k, v]) => ({ player_id: 'me', screen_idx: QUIZ_BASE_IDX + Number(k), correct: v.correct, elapsed_ms: v.elapsed }));
  const soloScore = quizScore(soloRows);

  const Q = qi >= 0 && qi < QUIZ_BANK.length ? QUIZ_BANK[qi] : null;
  const counts = Q ? Q.opts.map((_, i) => {
    if (solo) return myAnswers[qi]?.picked === i ? 1 : 0;
    let n = qRows.filter(r => r.screen_idx === QUIZ_BASE_IDX + qi && r.picked === i).length;
    const mine = myAnswers[qi];
    if (mine && mine.picked === i && live.playerId && !qRows.some(r => r.player_id === live.playerId && r.screen_idx === QUIZ_BASE_IDX + qi)) n++;
    return n;
  }) : [];
  const lastQ = qi >= QUIZ_BANK.length - 1;
  // Javob ochilgach keyingi savolga avto o'tish (F-0922-03). Soat faqat MENTOR
  // brauzerida; o'quvchilar server orqali ergashadi. Oxirgi savolda avto YO'Q —
  // «G'oliblarni e'lon qilish» mentorning daqiqasi.
  const autoNext = useAutoNext({
    on: phase === 'reveal' && isMentor && !solo && !lastQ,
    onFire: () => ctrl('q', qi + 1),
    qKey: qi,
  });
  const my = qi >= 0 ? myAnswers[qi] : null;

  const closeArena = () => {
    if (isMentor && !solo && phase !== 'done') {
      if (typeof window !== 'undefined' && !window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закрыть, ученики останутся ждать на арене.\nВсё равно закрыть?' }))) return;
    }
    onClose();
  };

  return (
    <div className="qz-arena">
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => (
          <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{tr(s.ch)}</span>
        ))}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>

      {classEnded && isStudent && !solo && phase !== 'done' && (
        <div className="qz-endnote fade-step">
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжите тест самостоятельно:' })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: 'Mashq rejimida davom etish', ru: 'Продолжить в режиме тренировки' })}</button>
        </div>
      )}

      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее верный ответ — тем больше баллов. Верные ответы подряд дают бонус 🔥!' })}</p>
          {!solo && (
            <div className="qz-lobby-players">
              {players.map(p => <span key={p.id} className={`qz-pchip ${p.id === live.playerId ? 'me' : ''}`}>{p.nickname}</span>)}
              {players.length === 0 && <span className="qz-dimtxt">{tr({ uz: "O'quvchilar kutilmoqda…", ru: 'Ждём учеников…' })}</span>}
            </div>
          )}
          {isMentor && <button className="qz-btn big" disabled={players.length === 0} onClick={() => ctrl('q', 0)}>{tr({ uz: '▶ Testni boshlash', ru: '▶ Начать тест' })}</button>}
          {isStudent && !solo && <p className="qz-waitmsg">{tr({ uz: '⏳ Mentor testni boshlashini kuting…', ru: '⏳ Подождите, пока ментор начнёт тест…' })}</p>}
          {solo && <button className="qz-btn big" onClick={() => soloStart(0)}>{tr({ uz: '▶ Boshlash', ru: '▶ Начать' })}</button>}
        </div>
      )}

      {phase === 'q' && Q && (
        <div className="qz-view qz-qview fade-step" key={`q${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr({ uz: 'Savol', ru: 'Вопрос' })} <b>{qi + 1}</b>/{QUIZ_BANK.length}</span>
            <QzTimer remaining={remaining} />
            {isMentor
              ? <span className="qz-ansn">📨 {answeredN}/{players.length}</span>
              : <span className="qz-ansn">{streakUpTo(qi - 1) >= 2 ? `🔥 x${streakUpTo(qi - 1)}` : ' '}</span>}
          </div>
          <h2 className="qz-q">{fmtCode(tr(Q.q))}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
              const pickedThis = my && my.picked === i;
              return (
                <button key={i} className={`qz-tile ${my ? (pickedThis ? 'picked' : 'faded') : ''}`} style={{ background: QUIZ_COLORS[i] }} disabled={isMentor || !!my} onClick={() => answer(i)}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(tr(o))}</span>
                  {pickedThis && <span className="qz-pbadge">✔</span>}
                </button>
              );
            })}
          </div>
          {my && !isMentor && !solo && <p className="qz-waitmsg">{tr({ uz: '✔ Javob qabul qilindi — natijani kuting…', ru: '✔ Ответ принят — ждите результат…' })}</p>}
          {isMentor && (
            <div className="qz-mrow">
              {answeredN >= players.length && players.length > 0 && <span className="qz-allin">{tr({ uz: '✓ Hamma javob berdi!', ru: '✓ Ответили все!' })}</span>}
              <button className="qz-btn" onClick={() => ctrl('r', qi)}>{tr({ uz: '⏹ Natijani ochish', ru: '⏹ Открыть результат' })}</button>
            </div>
          )}
        </div>
      )}

      {phase === 'reveal' && Q && (
        <div className="qz-view qz-qview fade-step" key={`r${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr({ uz: 'Savol', ru: 'Вопрос' })} <b>{qi + 1}</b>/{QUIZ_BANK.length} {tr({ uz: '— natija', ru: '— результат' })}</span>
          </div>
          <h2 className="qz-q">{fmtCode(tr(Q.q))}</h2>
          <div className="qz-grid">
            {Q.opts.map((o, i) => {
              const win = i === Q.correct;
              const pickedThis = my && my.picked === i;
              return (
                <div key={i} className={`qz-tile rv ${win ? 'win' : 'lose'} ${pickedThis ? 'picked' : ''}`} style={{ background: QUIZ_COLORS[i] }}>
                  <span className="qz-shape">{QUIZ_SHAPES[i]}</span>
                  <span className="qz-opt">{fmtCode(tr(o))}</span>
                  <span className="qz-cnt">{win ? '✓ ' : ''}{counts[i]}</span>
                </div>
              );
            })}
          </div>
          {!isMentor && (
            <div className={`qz-res ${my?.correct ? 'good' : 'bad'}`}>
              {my?.correct
                ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">{tr({ uz: 'ball', ru: 'баллов' })}{streakUpTo(qi) >= 2 ? tr({ uz: ` · 🔥 x${streakUpTo(qi)} ketma-ket`, ru: ` · 🔥 x${streakUpTo(qi)} подряд` }) : ''}</span></>
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz.', ru: 'Ошиблись — 0 баллов. Возьмёте на следующем.' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling.", ru: 'Время вышло — 0 баллов. Будьте быстрее.' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: `Siz hozir: ${myRank + 1}-o'rin`, ru: `Вы сейчас: ${myRank + 1}-е место` })}</span>}
            </div>
          )}
          {!solo && (
            <div className="qz-board">
              <div className="qz-board-h">{tr({ uz: '🏆 TOP-5', ru: '🏆 ТОП-5' })}</div>
              {board.slice(0, 5).map((b, i) => (
                <div key={b.id} className={`qz-brow ${b.id === live.playerId ? 'me' : ''}`}>
                  <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                  {b.maxStreak >= 2 && <span className="qz-bstreak">🔥</span>}
                  <span className="qz-bpts">{b.pts}</span>
                </div>
              ))}
            </div>
          )}
          {isMentor && <button className="qz-btn big" onClick={() => lastQ ? ctrl('done', qi) : autoNext.fireNow()}>{lastQ ? tr({ uz: "🏁 G'oliblarni e'lon qilish", ru: '🏁 Объявить победителей' }) : tr({ uz: 'Keyingi savol →', ru: 'Следующий вопрос →' })}</button>}
          {isMentor && !lastQ && <button className="qz-btn ghost qz-auto" onClick={autoNext.auto ? autoNext.pause : autoNext.resume} title={tr({ uz: "Avto o'tishni to'xtatish — javobni tushuntirish uchun (arena oxirigacha)", ru: 'Остановить авто-переход — чтобы объяснить ответ (до конца арены)' })}>{autoNext.auto ? `${tr({ uz: "To'xtatish", ru: 'Пауза' })}${autoNext.sec ? ` · ${autoNext.sec}` : ''}` : tr({ uz: '▶ Avto', ru: '▶ Авто' })}</button>}
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr({ uz: "🏁 Natijani ko'rish", ru: '🏁 Посмотреть результат' }) : tr({ uz: 'Keyingi →', ru: 'Дальше →' })}</button>}
        </div>
      )}

      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr({ uz: '🏆 Test yakunlandi!', ru: '🏆 Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: 'ball ·', ru: 'баллов ·' })} {soloScore.ok}/{QUIZ_BANK.length} {tr({ uz: "to'g'ri", ru: 'верно' })}{soloScore.maxStreak >= 2 ? tr({ uz: ` · ketma-ket to'g'ri 🔥x${soloScore.maxStreak}`, ru: ` · подряд верно 🔥x${soloScore.maxStreak}` }) : ''}</p>
              <button className="qz-btn big" onClick={soloReplay}>↻ Qayta yechish</button>
            </div>
          ) : (
            <>
              <div className="qz-pod">
                {[1, 0, 2].map(rank => {
                  const b = board[rank];
                  return (
                    <div key={rank} className={`qz-pod-col p${rank + 1} ${b && b.id === live.playerId ? 'me' : ''}`}>
                      {rank === 0 && <span className="qz-crown">👑</span>}
                      <span className="qz-pod-medal">{['🥇', '🥈', '🥉'][rank]}</span>
                      <span className="qz-pod-name">{b ? b.nickname : '—'}</span>
                      {b && <span className="qz-pod-pts">{b.pts} {tr({ uz: 'ball', ru: 'б.' })} · {b.ok}/{QUIZ_BANK.length}</span>}
                      <div className="qz-pod-bar" />
                    </div>
                  );
                })}
              </div>
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{tr({ uz: `${myRank + 1}-o'rin`, ru: `${myRank + 1}-е место` })}</b> · {board[myRank].pts} {tr({ uz: 'ball', ru: 'баллов' })}</p>}
              <div className="qz-board wide">
                {board.map((b, i) => (
                  <div key={b.id} className={`qz-brow ${b.id === live.playerId ? 'me' : ''}`}>
                    <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                    {b.maxStreak >= 2 && <span className="qz-bstreak">🔥x{b.maxStreak}</span>}
                    <span className="qz-bok">{b.ok}/{QUIZ_BANK.length}</span>
                    <span className="qz-bpts">{b.pts}</span>
                  </div>
                ))}
              </div>
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta yechish — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест ещё раз — тренировка (в таблицу не идёт)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}

// ===== 🏆 PODIUM (93-qonun: matn etalondan) =====
const ScreenPodium = ({ screen, answers, achievements, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const isMentorL = !!(live && live.mode === 'mentor');
  const livePin = live ? live.pin : null;
  const [players, setPlayers] = useState([]);
  const [rows, setRows] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!isLive || !livePin) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [p, a] = await Promise.all([livePlayers(livePin), liveAnswers(livePin)]);
        if (on) { setPlayers(p); setRows(a); setLoaded(true); }
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [isLive, livePin]);

  const totalQ = SCORED_IDX.length;
  const board = players.map(p => {
    const mine = rows.filter(a => a.player_id === p.id && SCORED_IDX.includes(a.screen_idx));
    const okCount = mine.filter(a => a.correct).length;
    const time = mine.reduce((s, a) => s + (a.elapsed_ms || 0), 0);
    return { id: p.id, nickname: p.nickname, okCount, time };
  }).sort((x, y) => y.okCount - x.okCount || x.time - y.time);
  const fmtT = (ms) => `${(ms / 1000).toFixed(1)}s`;
  const top3 = board.slice(0, 3);
  const myIdx = live && live.playerId ? board.findIndex(b => b.id === live.playerId) : -1;
  const selfCorrect = SCORED_IDX.filter(i => answers[i]?.correct).length;

  return (
    <Stage eyebrow={tr({ uz: 'Natijalar', ru: 'Результаты' })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{isLive ? tr({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>g'oliblarimiz</span></>, ru: <>Наши сегодняшние <span className="italic" style={{ color: T.accent }}>победители</span></> }) : tr({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>natijangiz</span></>, ru: <>Ваш сегодняшний <span className="italic" style={{ color: T.accent }}>результат</span></> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <ScoreRing correct={selfCorrect} total={totalQ} />
            <div className="pod-solo">
              <div className="pod-solo-sec">
                <span className="pod-solo-lbl">🏅 {tr({ uz: 'Nishonlar', ru: 'Значки' })}</span>
                <div className="pod-solo-badges">
                  {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return <span key={id} className={`pod-solo-b ${got ? 'got' : ''}`} title={a.name}>{got ? a.icon : '🔒'}</span>; })}
                </div>
              </div>
            </div>
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.', ru: 'Это ваш личный результат. На живом уроке здесь появится рейтинг всей группы — подиум 🥇🥈🥉.' })}</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Результаты загружаются…' })}</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: 'К этой сессии пока никто не подключился.' })}</p></div>
        ) : (
          <>
            <Confetti />
            <div className="pod-stage fade-up">
              {[1, 0, 2].map(rank => {
                const b = top3[rank];
                return (
                  <div key={rank} className={`pod-col pod-${rank + 1} ${b && live.playerId === b.id ? 'me' : ''}`}>
                    <span className="pod-medal">{['🥇', '🥈', '🥉'][rank]}</span>
                    <span className="pod-name">{b ? b.nickname : '—'}</span>
                    {b && <span className="pod-score mono">{b.okCount}/{totalQ} · {fmtT(b.time)}</span>}
                    <div className="pod-bar" />
                  </div>
                );
              })}
            </div>
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{tr({ uz: `${myIdx + 1}-o'rin`, ru: `${myIdx + 1}-е место` })}</b> ({board[myIdx].okCount}/{totalQ} {tr({ uz: "to'g'ri", ru: 'верно' })})</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>🏆 {tr({ uz: "To'liq reyting", ru: 'Полный рейтинг' })}</div>
              <div className="pod-list">
                {board.map((b, i) => (
                  <div key={b.id} className={`pod-row ${live.playerId === b.id ? 'me' : ''}`}>
                    <span className="mono pod-rank">{i + 1}</span>
                    <span className="pod-row-name">{b.nickname}</span>
                    <span className="pod-row-dots">{SCORED_IDX.map(q => { const a = rows.find(r => r.player_id === b.id && r.screen_idx === q); return <span key={q} className={`pod-dot ${a ? (a.correct ? 'ok' : 'bad') : ''}`} title={tr(Q_LABELS[q])} />; })}</span>
                    <span className="mono pod-row-score">{b.okCount}/{totalQ}</span>
                    <span className="mono pod-row-time">{fmtT(b.time)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {isMentorL && <MentorNote>{tr({ uz: "G'oliblarni nomlab tabriklang — arena yakun sahifasida ochiladi.", ru: 'Назовите победителей и поздравьте — арена открывается на странице итога.' })}</MentorNote>}
      </div>
    </Stage>
  );
};


// ===== SCREEN 16 — YAKUN: CodeStrike arenasi + uy-vazifa BIR sahifada =====
// Tuzilma etalondan: hero (h-sub YO'Q) -> CodeStrike -> «Endi siz bilasiz» -> uy-vazifa kapsulasi -> nishonlar.
const ScreenSummary = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const live = _gate.live;
  const isMentorL = !!(live && live.mode === 'mentor');
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const RECAP = [
    { uz: 'Mahsulot odam uchun bajaradigan narsa vazifa deyiladi.' },
    { uz: 'Uch savol uch tur vazifani ajratadi: funksional, ijtimoiy va emotsional.' },
    { uz: 'Odamlar qaytib keladigan joy uchala savolga birdan javob beradi.' },
    { uz: "Saytda har vazifani o'z komponenti bajaradi — komponenti yo'q vazifa bajarilmay qoladi." },
  ];
  const [arena, setArena] = useState(false);
  const [arenaSolo, setArenaSolo] = useState(false);
  const quizSt = (live && live.quiz && live.quiz.state) || 'off';
  const isStudentL = !!(live && live.mode === 'student');
  const classOver = !!(live && (live.status === 'ended' || !live.mentorAlive));
  const studentSolo = isStudentL && classOver && quizSt !== 'done';
  const studentLive = isStudentL && !studentSolo && quizSt !== 'off';
  const studentWait = isStudentL && !studentSolo && quizSt === 'off';
  const openArena = async () => {
    if (isMentorL && quizSt === 'off') { try { await live.quizControl('lobby', -1); } catch { return; } }
    setArenaSolo(studentSolo); setArena(true);
  };
  const [hwVariant, setHwVariant] = useState(() => readHwTarget());
  const pickHw = (k) => { setHwVariant(k); try { localStorage.setItem(HW_KEY, k); } catch {} };
  const [hwOpen, setHwOpen] = useState(false);
  const [charge, setCharge] = useState(false);
  const fireHw = () => { if (charge || hwOpen) return; setCharge(true); setTimeout(() => { setHwOpen(true); setCharge(false); }, 500); };
  const recapCard = (
    <div className="card fade-up d3">
      <div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz' })}</div>
      <ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul>
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Tayyor' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓' })}</button></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="hero">
          <div className="hero-l">
            <span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Dars tugadi' })}</span>
            <h2 className="title h-title fade-up d1">{tr({ uz: <>Har vazifangiz o'z <span className="italic" style={{ color: T.accent }}>komponentini</span> oldi.</> })}</h2>
          </div>
          {!isMentorL && <ScoreRing correct={correct} total={total} />}
        </div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting' }) : undefined} />
        </div>
        {arena && <QuizArena live={live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        {isMentorL ? recapCard : (
          <div className="split sum2">
            {recapCard}
            <div className="card ach-coll fade-up d4">
              <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr({ uz: 'Nishonlaringiz —' })} {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
              <div className="ach-grid">
                {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return (
                  <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`} title={tr(a.desc)}>
                    <span className="ach-badge-ic">{got ? a.icon : '🔒'}</span>
                    <span className="ach-badge-name">{a.name}</span>
                    {got && <span className="ach-badge-desc">{tr(a.desc)}</span>}
                  </div>
                ); })}
              </div>
            </div>
          </div>
        )}
        <div className="hw-big-wrap fade-up d4">
          <button className={`hw-big ${charge ? 'charging' : ''}`} onClick={fireHw}>
            <span className="hw-sky" aria-hidden="true">
              {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, '--d': `${k.d}s` }}>{tr(k.t)}</span>)}
            </span>
            <span className="hw-big-shine" aria-hidden="true" />
            <span className="hw-big-t">{tr({ uz: 'Uyga vazifa' })}</span>
            <span className="hw-big-s">{tr({ uz: 'Amaliy topshiriqni bajarish →' })}</span>
          </button>
        </div>
        {hwOpen && <HwCard variant={hwVariant} onPick={pickHw} />}
        <MentorNote>{tr({ uz: "Arena tugagach podium — g'oliblarni nomlab tabriklang. Uy-vazifa faqat eslatma: to'liq paket alohida. Muddat — keyingi darsgacha." })}</MentorNote>
      </div>
    </Stage>
  );
};

// ============================================================ CSS
const CSS_BASE = `
  html, body { margin: 0; padding: 0; }
  .lesson-root, .lesson-root * { box-sizing: border-box; }
  .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
  .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }

  .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
  .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
  .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }

  @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
  .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; }
  @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .fade-step { animation: fade-step 0.3s ease-out; }
  .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }

  .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
  .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }
  .live-badge { opacity: 0.62; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
  .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(${T.shadowBase},0.32) !important; }

  .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12); }
  .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.55); }
  .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
  @keyframes turn-hint {
    0%, 100% { box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12), 0 0 0 0 rgba(91,61,230,0.40); }
    50%      { box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12), 0 0 0 8px rgba(91,61,230,0); }
  }
  .turn-hint { animation: turn-hint 1.9s ease-in-out infinite; }
  .turn-ring { position: relative; }
  .turn-ring::after {
    content: ''; position: absolute; inset: -3px; border-radius: inherit; pointer-events: none;
    border: 2px solid ${T.accent}; opacity: 0; animation: turn-ring 1.9s ease-in-out infinite;
  }
  @keyframes turn-ring { 0%, 100% { opacity: 0; } 50% { opacity: 0.65; } }
  .turn-wave::after { animation-name: turn-wave; animation-duration: 2.1s; animation-iteration-count: 4; }
  @keyframes turn-wave { 0%, 100% { opacity: 0; } 12% { opacity: 0.7; } 30% { opacity: 0; } }
  .turn-wave.w2::after { animation-delay: 0.7s; }
  .turn-wave.w3::after { animation-delay: 1.4s; }
  .turn-wave.wv4::after { animation-duration: 2.8s; }
  .turn-wave.wv4.w4::after { animation-delay: 2.1s; }
  .turn-step::after { animation-name: turn-step; animation-duration: 1.3s; animation-iteration-count: 1; }
  @keyframes turn-step { 0% { opacity: 0; } 20% { opacity: 0.68; } 78% { opacity: 0.68; } 100% { opacity: 0; } }
  .turn-wrap { display: block; position: relative; }
  .turn-wrap > .reflect-input { width: 100%; }
  @media (prefers-reduced-motion: reduce) { .turn-hint, .turn-ring::after { animation: none; } .turn-ring::after { opacity: 0; } }
  .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
  .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
  .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
  .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }

  .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); min-width: 0; overflow-wrap: anywhere; }
  .option:hover:not(:disabled) { background: #FBFAFE; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
  .option:disabled { cursor: default; }
  /* 27-qonun: to'g'ri variant katakdagi karta kabi «joyiga o'tiradi» — dars mexanikasining sadosi. */
  .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; animation: opt-land 0.44s cubic-bezier(.34,1.5,.4,1); }
  @keyframes opt-land { 0% { transform: scale(0.975); } 45% { transform: scale(1.022); } 100% { transform: scale(1); } }
  .opt-abc.ok { animation: opt-land 0.44s cubic-bezier(.34,1.5,.4,1) 0.06s; }
  @media (prefers-reduced-motion: reduce) { .option-correct, .opt-abc.ok { animation: none; } }
  .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
  .option-picked-wrong { background: ${T.errSoft} !important; color: ${T.err} !important; box-shadow: 0 8px 22px -6px rgba(229,72,77,0.32) !important; }
  .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
  .opt-abc { width: 27px; height: 27px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; background: ${T.accentSoft}; color: ${T.accent}; transition: background 0.2s, color 0.2s; }
  .opt-abc.ok { background: ${T.success}; color: #fff; }
  .opt-abc.bad { background: ${T.err}; color: #fff; }
  .opt-abc.dim { background: ${T.bg}; color: ${T.ink3}; }

  .mentor { display: flex; gap: 12px; align-items: flex-start; }
  .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
  .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
  .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
  .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 11px 15px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }
  .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
  .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
  .mentor-mob.is-collapsed .mentor-col { gap: 0; }
  .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
  .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

  .mnote { background: ${T.blueSoft}; border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 5px; cursor: pointer; }
  .mnote-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.blue}; display: flex; align-items: center; }
  .mnote-x { margin-left: auto; font-weight: 800; font-size: 10.5px; opacity: 0.7; text-transform: none; letter-spacing: 0; }
  .mnote-chip { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; background: transparent; border: none; border-bottom: 1px solid ${T.line}; color: ${T.blue}; border-radius: 999px; padding: 4px 12px; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.04em; cursor: pointer; opacity: 0.4; transition: opacity 0.2s ease, transform 0.2s ease; }
  .mnote-chip:hover, .mnote-chip:focus-visible { opacity: 1; transform: translateY(-1px); }
  @media (hover: none) { .mnote-chip { opacity: 1; } }
  .mnote-body { margin: 0; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.45; }

  .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
  .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
  .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
  .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
  .small { font-size: clamp(12.5px,1.4vw,13.5px); }
  .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

  .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
  .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
  .stage-content { flex: 1; min-height: 0; justify-content: safe center; padding-top: clamp(9px,1.5vw,14px); padding-bottom: clamp(14px,2.6vw,26px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
  .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
  .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
  .chrome { display: flex; align-items: center; justify-content: space-between; }
  .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); }
  .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
  .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(91,61,230,0.55), 0 0 3px rgba(91,61,230,0.4); }

  .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(91,61,230,0.22); }
  .frame-success { background: ${T.successSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
  .frame-wait { background: ${T.blueSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

  .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
  .screen > * { flex-shrink: 0; }
  .head { display: flex; flex-direction: column; gap: 6px; }
  .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(16px,2.6vw,30px); align-items: start; }
  .split.foot2 { gap: clamp(10px,1.6vw,18px); }
  .split.sum2 { gap: clamp(12px,2vw,22px); }
  .split.sum2 .ach-grid { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 860px) { .split.sum2 { grid-template-columns: 1fr; } }
  .split.foot2 .col:empty { display: none; }
  /* O'quvchi qurilmasida o'ng ustun bo'sh (sinf-signali faqat jonli darsda) — natija-qatori butun enni oladi. */
  .split.foot2:has(> .col:last-child:empty) { grid-template-columns: minmax(0,1fr); }
  .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
  @media (max-width: 860px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }

  .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: clamp(13px,1.8vw,18px) 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; }
  .ta-bulb { font-size: 30px; }
  .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; }

  .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
  .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
  .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; }
  .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
  .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
  .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .ring-num { font-family: 'Source Serif 4', serif; font-size: 30px; font-weight: 500; line-height: 1; }
  .ring-den { color: ${T.ink3}; font-size: 20px; }
  .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
  .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); min-width: 0; overflow-wrap: anywhere; }
  .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
  .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
  .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
  .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; }
  .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; min-width: 0; overflow-wrap: anywhere; }
  .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }
  .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
`;

// Dars-vizuallari: uch nur, sayt-maket, mehmonlar, Debug Challenge, keys-slayd, flashcard, uy-vazifa.
const CSS_LESSON = `
  /* HOOK — to'rt ish bitta qatorda */
  .hrow { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: clamp(8px,1.4vw,14px); }
  @media (max-width: 860px) { .hrow { grid-template-columns: repeat(2, minmax(0,1fr)); } }
  .hopt { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 7px; background: ${T.paper}; border: none; border-radius: 15px; padding: clamp(13px,2vw,18px) clamp(9px,1.4vw,13px); cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 8px 20px -9px rgba(${T.shadowBase},0.22); transition: transform 0.16s, box-shadow 0.16s; min-width: 0; }
  .hopt:hover:not(:disabled):not(.on) { transform: translateY(-3px); box-shadow: 0 14px 26px -9px rgba(${T.shadowBase},0.3); }
  .hopt:disabled { cursor: default; }
  .hopt.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 12px 26px -9px rgba(91,61,230,0.35); background: ${T.accentSoft}; }
  .hopt-ic { font-size: clamp(24px,3.4vw,32px); line-height: 1; color: ${T.ink}; } /* F-0926-05 #23: disabled-tugma rangi (rgba 0.3) emojini xiralashtirmasin */
  .hopt-nom { font-weight: 700; font-size: clamp(12.5px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.3; overflow-wrap: anywhere; }
  .hopt-vaqt { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 11.5px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 3px 10px; animation: fade-step 0.35s ease-out; }
  .hopt.on .hopt-vaqt { background: ${T.paper}; }
  .hvote { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,18px); box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }
  .hvote-row { display: flex; align-items: center; gap: 10px; }
  .hvote-lbl { flex: 0 0 clamp(120px,26vw,230px); font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hvote-row.mine .hvote-lbl { color: ${T.accent}; }
  .hvote-track { flex: 1; height: 12px; border-radius: 99px; background: ${T.bg}; overflow: hidden; }
  .hvote-fill { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); transition: width 0.6s cubic-bezier(.2,.7,.2,1); }
  .hvote-row.top .hvote-fill { background: linear-gradient(90deg, ${T.success}, #0E8A55); }
  .hvote-pct { min-width: 38px; text-align: right; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
  @media (prefers-reduced-motion: reduce) { .hopt, .hvote-fill { transition: none; } .hopt-vaqt { animation: none; } }

  /* IKKI SAVOL kartalari (s2) — bosilsa ochiladi/yopiladi */
  .qgrid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: clamp(9px,1.5vw,14px); }
  @media (max-width: 860px) { .qgrid { grid-template-columns: 1fr; } }
  .qcard { display: flex; flex-direction: column; gap: 7px; text-align: left; background: ${T.paper}; border: none; border-radius: 15px; padding: clamp(12px,1.8vw,16px); cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 8px 20px -9px rgba(${T.shadowBase},0.2); transition: transform 0.16s, box-shadow 0.16s; min-width: 0; }
  .qcard:hover { transform: translateY(-2px); }
  .qcard.open { box-shadow: inset 0 0 0 1.5px ${T.success}66, 0 10px 22px -9px rgba(18,169,104,0.25); }
  .qcard-top { display: flex; align-items: center; gap: 8px; }
  .qcard-ic { font-size: 22px; line-height: 1; }
  .qcard-nom { font-weight: 800; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; overflow-wrap: anywhere; }
  .qcard-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; background: ${T.bg}; border-radius: 9px; padding: 7px 10px; }
  .qcard-q { font-weight: 600; font-size: 11.5px; color: ${T.ink2}; }
  .qcard-a { font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 3px 10px; white-space: nowrap; }
  .qcard-a.f { color: ${T.blue}; background: ${T.blueSoft}; }
  .qcard-a.v { color: ${T.accent}; background: ${T.accentSoft}; }
  .xul { background: ${T.paper}; border-radius: 14px; padding: clamp(13px,2vw,18px); display: flex; flex-direction: column; gap: 7px; box-shadow: 0 10px 24px -10px rgba(${T.shadowBase},0.2); }
  .xul-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; }
  .xul-b { margin: 0; font-size: clamp(13.5px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
  .xul-gloss { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 9px; padding: 7px 11px; }

  /* KARTA-IDISHI (72-qonun): joylashtiriladigan ishlar yalang'och turmaydi */
  .ipool { display: flex; flex-wrap: wrap; gap: 8px; padding: 8px 10px; }
  /* O'ng ustunda hovuz — kartalar ustma-ust, ustun balandligi keskin sakramasin */
  .ipool-col { flex-direction: column; align-items: stretch; min-height: 0; transition: opacity 0.3s ease; }
  .ipool-col { animation: fade-step 0.32s ease-out; }
  .ipool > span { display: inline-flex; border-radius: 12px; min-width: 0; max-width: 100%; }
  .bhint { margin: 0; align-self: flex-start; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 9px; padding: 7px 12px; }
  .bdone { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
  .bdone-sub { font-family: 'Manrope'; font-weight: 500; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; }
  .bdone-sub b { color: ${T.ink}; font-weight: 700; }
  /* BOSQICHLI OCHILISH (94-qonun) + hafta-chizig'i */
  .stps { display: flex; flex-wrap: wrap; gap: 8px; }
  .stp { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(11.5px,1.4vw,13px); color: ${T.ink3}; background: ${T.paper}; border-radius: 99px; padding: 5px 12px 5px 5px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .stp i { font-style: normal; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: ${T.bg}; color: ${T.ink3}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 11px; }
  .stp.on { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .stp.on i { background: ${T.accent}; color: #fff; }
  .stp.done { color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; }
  .stp.done i { background: ${T.success}; color: #fff; }
  .sblock { display: flex; flex-direction: column; gap: 7px; background: ${T.paper}; border-radius: 14px; padding: 10px 13px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.18); min-width: 0; }
  .sblock-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; }
  .sblock.rowdone { flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 12px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.18), inset 0 0 0 1.5px ${T.success}44; }
  .rd-line { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .rd-line b { color: ${T.success}; }
  .rd-redo { background: none; border: none; cursor: pointer; font-size: 15px; color: ${T.ink3}; padding: 2px 6px; border-radius: 8px; flex-shrink: 0; transition: color 0.15s, background 0.15s; }
  .rd-redo:hover { color: ${T.accent}; background: ${T.accentSoft}; }
  /* 81-qonun: maydon-signallari MA'NO rangida (qizil hech qachon).
     bo'sh = xira halqa · kutmoqda = yumshoq indigo nafas · fokus = to'liq indigo 2px · to'lgan = indigo halqa. */
  .reflect-input { font-family: 'Manrope'; font-size: 15px; color: ${T.ink}; border: none; border-radius: 10px; padding: 11px 14px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; width: 100%; min-width: 0; transition: box-shadow 0.18s; }
  .reflect-input:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
  .reflect-input.filled { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .reflect-input.await { animation: rin-wait 2.2s ease-in-out infinite; }
  @keyframes rin-wait { 0%, 100% { box-shadow: inset 0 0 0 1.5px ${T.line}; } 50% { box-shadow: inset 0 0 0 1.5px ${T.accent}77, 0 0 0 4px rgba(91,61,230,0.10); } }
  .reflect-input.await:focus { animation: none; }
  @media (prefers-reduced-motion: reduce) { .reflect-input.await { animation: none; box-shadow: inset 0 0 0 1.5px ${T.accent}55; } }
  .sfb { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.45; border-radius: 9px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; }
  .sfb.ok { color: ${T.success}; background: ${T.successSoft}; }
  .sfb.ask { color: ${T.accent}; background: ${T.accentSoft}; }
  /* Yordamchi havolalar: quti EMAS — mashq ostidagi ixcham qator.
     Ular yordamchi, asosiy harakat emas (F-0819-57). */
  .wsxrow { display: flex; gap: 18px; flex-wrap: wrap; align-items: flex-start; }
  .wsx { flex: none; min-width: 0; background: transparent; border: none; border-radius: 0; overflow: visible; }
  .wsx.open { flex: 1 1 100%; }
  .wsx.star { border-color: ${T.blue}66; }
  .wsx-toggle { width: auto; text-align: left; background: none; border: none; border-bottom: 1px solid ${T.line}; padding: 2px 0; font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; cursor: pointer; }
  .wsx-toggle:hover, .wsx-toggle:focus-visible { color: ${T.accent}; border-bottom-color: ${T.accent}; }
  .wsx.star .wsx-toggle:hover, .wsx.star .wsx-toggle:focus-visible { color: ${T.blue}; border-bottom-color: ${T.blue}; }
  .wsx-body { padding: 8px 0 0; display: flex; flex-direction: column; gap: 6px; animation: fade-step 0.25s ease-out; }
  .wsx-body p { font-size: 12.5px; color: ${T.ink2}; margin: 0; line-height: 1.45; overflow-wrap: anywhere; }
  .wsx-body b { color: ${T.ink}; }

  /* KODING — VS Code-topshirig'i (82-qonun): panel CHAPDA, kod O'NGDA, nusxalash yopiq */
  .kdpanel { position: relative; background: ${T.paper}; border-radius: 16px; padding: 14px 18px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.18); min-width: 0; transition: border-color 0.3s; }
  /* F-0926-05 #16: yashil ramka olindi — holatni tugma yoki yozuv aytadi */
  .kdreq { margin: 0; padding-left: 22px; display: flex; flex-direction: column; gap: 7px; }
  .kdreq li { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; overflow-wrap: anywhere; }
  .lp-done-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13.5px,1.7vw,15px); cursor: pointer; border: none; border-radius: 13px; padding: 12px 18px; background: ${T.accent}; color: #fff; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.34); transition: all 0.18s; }
  .lp-done-btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.5); }
  .lp-done-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .lp-done-btn.is-done { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; }
  .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 10px 13px; display: flex; flex-direction: column; gap: 5px; }
  .vsc { position: relative; background: #1E1E1E; border-radius: 14px; overflow: hidden; box-shadow: 0 14px 30px -10px rgba(${T.shadowBase},0.35); }
  .vsc-bar { background: #252526; display: flex; align-items: center; gap: 2px; padding-right: 8px; }
  .vsc-tab { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; color: #8B949E; background: #2D2D2D; border: none; padding: 9px 14px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
  .vsc-tab.on { background: #1E1E1E; color: #E6EDF3; box-shadow: inset 0 2px 0 #007ACC; }
  .vsc-lock { margin-left: auto; font-family: 'Manrope'; font-weight: 700; font-size: 11px; letter-spacing: 0.04em; color: #B9A8E6; background: rgba(255,255,255,0.07); border-radius: 8px; padding: 5px 11px; }
  .vsc.no-copy .vsc-body { user-select: none; -webkit-user-select: none; }
  .vsc-body { padding: 10px 14px 12px 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(11px,1.35vw,12.5px); color: #D4D4D4; line-height: 1.58; overflow: auto; max-height: clamp(170px, 28vh, 320px); scrollbar-width: thin; scrollbar-color: #4A4A4A #1E1E1E; }
  .vsc-body::-webkit-scrollbar { width: 9px; height: 9px; }
  .vsc-body::-webkit-scrollbar-thumb { background: #4A4A4A; border-radius: 99px; }
  .vsc-body::-webkit-scrollbar-track { background: #1E1E1E; }
  @media (max-width: 620px) { .vsc-body { max-height: none; overflow-y: visible; } }
  .vsc-line { display: flex; align-items: baseline; min-width: max-content; }
  .vsc-ln { color: #6E7681; min-width: 26px; text-align: right; margin-right: 14px; font-size: 10.5px; flex-shrink: 0; user-select: none; }
  .vsc-code { white-space: pre; }
  /* 50-qonun: kod XIRA PARDA ostida yashirilmaydi — o'quvchi topshiriqni ko'rib turadi.
     Darvoza faqat 83-qonun qulf-tugmasida: nima kutilayotgani bitta qatorda aytiladi. */

  /* RECAP (s11) */
  .rcp-flow { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(12px,2vw,18px); align-items: stretch; }
  @media (max-width: 760px) { .rcp-flow { grid-template-columns: 1fr; } }
  .rcp-step { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 12px; min-width: 0; }
  .rcp-step-h { display: flex; gap: 11px; align-items: flex-start; }
  .rcp-n { width: 26px; height: 26px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}66; /* F-0926-05 #8: biroz yumshatildi */ font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 5px 12px -5px rgba(91,61,230,0.5), 0 0 0 3px ${T.accentSoft}; }
  .rcp-t { display: block; font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
  .pair-timer { background: ${T.bg}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 10px; box-shadow: inset 0 0 0 1.5px ${T.line}; margin-top: auto; }
  .pair-now { font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink2}; line-height: 1.45; }
  .pair-who { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 8px; background: ${T.accent}; color: #fff; font-weight: 800; font-size: 13px; vertical-align: middle; }
  .pair-who.b { background: ${T.blue}; }
  .pair-live { display: flex; align-items: center; gap: 15px; }
  .pair-ring { position: relative; width: 82px; height: 82px; flex-shrink: 0; }
  .pair-ring-mid { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; }
  .pair-ring-who { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; background: ${T.accent}; color: #fff; font-weight: 800; font-size: 14px; }
  .pair-ring-who.b { background: ${T.blue}; }
  .pair-ring-sec { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 15px; color: ${T.ink}; font-variant-numeric: tabular-nums; margin-top: 2px; }
  .pair-live-txt { display: flex; flex-direction: column; gap: 3px; }
  .pair-next { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; }
  .pair-timer-btns { display: flex; gap: 8px; }
  .pair-start { font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 12px; padding: 12px 22px; background: linear-gradient(135deg, ${T.accent}, ${T.accentVivid}); color: #fff; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.5); animation: pair-start-pulse 1.6s ease-in-out infinite; transition: transform 0.15s; }
  .pair-start:hover { transform: translateY(-2px); }
  @keyframes pair-start-pulse { 0%, 100% { box-shadow: 0 10px 24px -8px rgba(91,61,230,0.5), 0 0 0 0 rgba(110,75,255,0.45); } 50% { box-shadow: 0 12px 28px -8px rgba(91,61,230,0.6), 0 0 0 12px rgba(110,75,255,0); } }
  .pair-start.calm { animation: none; }
  @media (prefers-reduced-motion: reduce) { .pair-start { animation: none; } }

  /* KEYS-SLAYD + BASHORAT */
  .k-slide { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(15px,2.4vw,24px) clamp(18px,3vw,30px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 9px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
  .k-slide-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(10px,1.3vw,12px); letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 14px; }
  .k-slide-ic { font-size: clamp(30px,4.8vw,46px); line-height: 1; }
  .k-slide-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(19px,3vw,28px); color: ${T.ink}; margin: 0; }
  .k-slide-body { font-size: clamp(14.5px,1.9vw,17px); color: ${T.ink2}; line-height: 1.55; max-width: 620px; margin: 0; }
  .k-slide-body b { color: ${T.ink}; }
  .k-dots { display: flex; gap: 8px; justify-content: center; }
  .k-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
  .k-dot.fill { background: ${T.ink3}; } .k-dot.cur { background: ${T.accent}; width: 26px; }
  .kp-bet { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(15px,2.4vw,24px) clamp(18px,3vw,30px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 11px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
  /* Javob berilgach bashorat-kartasi ixchamlashadi: uning ishi tugadi, sahna slaydga o'tadi. */
  .kp-bet.answered { padding: clamp(11px,1.6vw,15px) clamp(14px,2.2vw,22px); gap: 8px; transition: padding 0.3s ease; }
  .kp-bet.answered .k-slide-h { font-size: clamp(15px,2vw,19px); }
  .kp-chips { display: flex; flex-wrap: wrap; gap: 10px; padding: 8px 10px; justify-content: center; }
  .kp-bet.answered .kp-chips { gap: 7px; }
  .kp-bet.answered .kp-chip { padding: 7px 13px; font-size: clamp(12px,1.5vw,13.5px); }
  .kp-chip { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,15px); padding: 10px 16px; border-radius: 99px; border: none; background: ${T.bg}; color: ${T.ink}; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); transition: transform 0.16s, box-shadow 0.16s; }
  .kp-chip:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 10px 20px -8px rgba(${T.shadowBase},0.24); }
  .kp-ic { font-size: 18px; }
  .kp-chip.locked { cursor: default; transform: none; }
  .kp-chip.locked:hover { transform: none; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); }
  .kp-chip.correct { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
  .kp-chip.correct:hover { box-shadow: inset 0 0 0 2px ${T.success}; }
  .kp-chip.wrong { background: ${T.errSoft}; color: ${T.err}; box-shadow: inset 0 0 0 2px ${T.err}; }
  .kp-chip.wrong:hover { box-shadow: inset 0 0 0 2px ${T.err}; }
  .kp-chip.locked:not(.correct):not(.wrong) { opacity: 0.5; }
  .kp-mark { font-weight: 900; font-size: 15px; }
  .kp-res.kp-res { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fade-step 0.3s ease-out; }
  .kp-res.hit { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
  .kp-res.miss { color: ${T.accent}; background: ${T.accentSoft}; }
  @media (prefers-reduced-motion: reduce) { .kp-chip, .kp-chip:hover { transition: none; transform: none; } .kp-res { animation: none; } }

  /* FLASHCARD */
  .fc-center { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding-top: 4px; }
  .fc { display: flex; flex-direction: column; gap: 11px; max-width: 520px; width: 100%; }
  .fc-top { display: flex; justify-content: space-between; align-items: center; }
  .fc-pill { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fc-pill-pop 0.35s cubic-bezier(.34,1.5,.4,1); }
  .fc-pill b { font-size: 1.15em; font-variant-numeric: tabular-nums; }
  .fc-pill.learn { background: ${T.accentSoft}; color: ${T.accent}; border: 1.5px solid ${T.accent}44; }
  .fc-pill.knew { background: ${T.successSoft}; color: ${T.success}; border: 1.5px solid ${T.success}44; }
  @keyframes fc-pill-pop { 40% { transform: scale(1.16); } }
  .fc-bar { height: 7px; background: ${T.line}; border-radius: 99px; overflow: hidden; }
  .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
  .fc-cardwrap { perspective: 1200px; position: relative; }
  .fc-cardwrap::before, .fc-cardwrap::after { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 20px; background: ${T.paper}; border: 2px solid ${T.line}; z-index: -1; }
  .fc-cardwrap::before { transform: translateY(7px) scale(0.965); opacity: 0.7; }
  .fc-cardwrap::after { transform: translateY(15px) scale(0.93); opacity: 0.4; }
  .fc-fly { position: relative; animation: fc-in 0.3s ease; }
  @keyframes fc-in { from { opacity: 0; transform: translateY(10px) scale(0.97); } }
  .fc-fly.out-knew { animation: fc-out-knew 0.42s ease forwards; }
  .fc-fly.out-again { animation: fc-out-again 0.42s ease forwards; }
  @keyframes fc-out-knew { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(70%) rotate(5deg); opacity: 0; } }
  @keyframes fc-out-again { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(-70%) rotate(-5deg); opacity: 0; } }
  .fc-card { position: relative; height: clamp(188px,27vh,268px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
  .fc-card.flip { transform: rotateY(180deg); }
  .fc-card:not(.flip):hover { transform: translateY(-3px); }
  .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
  .fc-front { background: ${T.paper}; border: 2px solid ${T.line}; box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
  .fc-back { background: linear-gradient(160deg, ${T.accentVivid}, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(91,61,230,0.6); }
  .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(17px,2.6vw,22px); color: ${T.ink}; line-height: 1.3; text-wrap: balance; }
  .fc-cue { font-family: 'Manrope'; font-size: 13px; color: ${T.ink3}; }
  .fc-tap { color: ${T.accent}; font-weight: 700; }
  .fc-tag { font-family: 'Manrope', sans-serif; font-weight: 800; letter-spacing: -0.01em; line-height: 1.2; max-width: 100%; text-wrap: balance; overflow-wrap: anywhere; }
  .fc-tag.t1 { font-size: clamp(28px,5.4vw,42px); }
  .fc-tag.t2 { font-size: clamp(23px,4.2vw,32px); }
  .fc-tag.t3 { font-size: clamp(19px,3.2vw,25px); }
  .fc-tag.t4 { font-size: clamp(16px,2.5vw,21px); line-height: 1.3; }
  .fc-actions { display: flex; gap: 10px; min-height: 48px; }
  .fc-btn { flex: 1; padding: 13px; border-radius: 13px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; border: none; transition: transform .15s; }
  .fc-btn:hover { transform: translateY(-2px); }
  .fc-btn.knew { background: ${T.success}; color: #fff; box-shadow: 0 10px 22px -10px ${T.success}; }
  .fc-btn.again { background: ${T.paper}; border: 2px solid ${T.accent}66; color: ${T.accent}; }
  .fc-btn:disabled { opacity: 0.55; cursor: default; transform: none; }
  .fc-btn.ghost { background: ${T.paper}; border: 1.5px solid ${T.line}; color: ${T.ink}; flex: none; align-self: center; padding: 11px 22px; }
  .fc-hint { margin: 0; min-height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; color: ${T.ink3}; font-style: italic; font-size: 13px; }
  .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${T.successSoft}; border-radius: 18px; padding: 22px; max-width: 480px; }
  .fc-done-emoji { font-size: 40px; }
  .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${T.success}; margin: 0; }
  .fc-done-s { font-family: 'Manrope'; color: ${T.ink2}; margin: 0 0 8px; font-size: 14px; }
  @media (prefers-reduced-motion: reduce) { .fc-card, .fc-fly, .fc-pill, .fc-btn { animation: none !important; transition: none; } }

  /* UYGA VAZIFA */
  .hw-chips { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
  .hw-chip { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); padding: 11px 18px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.18), inset 0 0 0 1.5px ${T.line}; transition: all 0.18s; }
  .hw-chip:hover:not(.on) { transform: translateY(-2px); box-shadow: 0 10px 22px -8px rgba(${T.shadowBase},0.28), inset 0 0 0 1.5px ${T.accent}55; }
  .hw-chip.on { background: ${T.accent}; color: #fff; box-shadow: 0 8px 18px -6px rgba(91,61,230,0.4), inset 0 0 0 2px ${T.accent}; }
  .pmtask { background: ${T.paper}; border-radius: 16px; padding: 0; overflow: hidden; box-shadow: 0 12px 30px -12px rgba(91,61,230,0.28); border: 1.5px solid ${T.line}; }
  .pmtask-head { display: flex; align-items: center; justify-content: space-between; padding: 11px 16px; background: ${T.accentSoft}; }
  .pmtask-tag { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.04em; color: ${T.accent}; }
  .pmtask-id { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 11px; color: ${T.accent}; background: ${T.paper}; border-radius: 99px; padding: 3px 10px; }
  .pmtask-rows { display: flex; flex-direction: column; }
  .pmtask-row { display: flex; gap: 12px; padding: 10px 16px; align-items: baseline; }
  .pmtask-row + .pmtask-row { border-top: 1px solid ${T.line}; }
  .pmtask-k { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; color: ${T.ink3}; flex: 0 0 clamp(84px,14vw,110px); }
  .pmtask-v { font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.8vw,16px); color: ${T.ink}; flex: 1; line-height: 1.4; }
  .pmtask-steps { position: relative; display: flex; flex-direction: column; gap: 10px; padding: 14px 16px 16px; background: ${T.bg}; }
  .pmtask-step { position: relative; display: flex; align-items: center; gap: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,14.5px); line-height: 1.45; color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; }
  .pmtask-step i { font-style: normal; width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 11.5px; }
  /* Uy-vazifa kapsulasi (P0 hw-big oilasi) — yakun sahifasining oxirgi harakati */
  .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); }
  .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
  @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
  .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
  .hw-big:hover { transform: translateY(-3px) scale(1.02); }
  .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; text-shadow: 0 2px 12px rgba(0,0,0,0.25); }
  .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
  .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent); transform: skewX(-18deg); animation: hw-shine 3.2s ease-in-out infinite; pointer-events: none; }
  .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; color: rgba(255,255,255,0.15); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
  @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
  .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
  @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.05); } 100% { filter: brightness(1); transform: scale(1); } }
  @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32), 0 0 0 0 rgba(124,58,237,.35); } 50% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 34px rgba(124,58,237,.68), 0 0 84px rgba(124,58,237,.4), inset 0 0 48px rgba(124,58,237,.32), 0 0 0 11px rgba(124,58,237,0); } }
  @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
  @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none; } .hw-big-wrap::before { opacity: 0.55; } }

  /* UCH NUR — imzo-vizual. Tur-ranglari butun dars bo'ylab bir xil (71-qonun):
     funksional = blue · ijtimoiy = amber (P0 NIMA-slot tokeni) · emotsional = accent · bo'sh = line. */
  .funksional { --c: ${T.blue}; --cs: ${T.blueSoft}; --ct: #0A6A9C; }
  .ijtimoiy { --c: #E8A13A; --cs: #FDF1DC; --ct: #9A5F0B; }
  .emotsional { --c: ${T.accent}; --cs: ${T.accentSoft}; --ct: ${T.accent}; }
  .hrow.h3 { grid-template-columns: repeat(3, minmax(0,1fr)); }
  @media (max-width: 620px) { .hrow.h3 { grid-template-columns: 1fr; } }
  .nur { display: grid; grid-template-columns: minmax(110px,0.7fr) minmax(0,3fr); gap: clamp(8px,1.4vw,14px); align-items: center; background: ${T.paper}; border-radius: 18px; padding: clamp(12px,1.8vw,18px); box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.28); min-width: 0; }
  .nur.compact { padding: clamp(10px,1.4vw,14px); gap: 8px; }
  @media (max-width: 620px) { .nur { grid-template-columns: 1fr; } }
  .nur-head { display: flex; align-items: center; justify-content: center; text-align: center; background: ${T.bg}; border-radius: 14px; padding: clamp(12px,2vw,20px) 10px; min-height: 100%; }
  .nur-head-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.6vw,15.5px); color: ${T.ink}; line-height: 1.3; overflow-wrap: anywhere; }
  .nur-rows { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .nur-row { display: grid; grid-template-columns: clamp(30px,3.6vw,50px) minmax(0,1fr); align-items: center; min-width: 0; }
  /* Nur = mahsulot-kartadan uyaga boradigan chiziq: xira asos, yonganda rangli nur o'sib boradi va uchida chiroq yonadi. */
  .nur-beam { position: relative; display: block; height: 4px; margin-right: 7px; border-radius: 99px; background: ${T.line}; }
  .nur-beam::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(90deg, var(--cs), var(--c)); box-shadow: 0 0 10px 0 var(--c); transform: scaleX(0); transform-origin: left center; opacity: 0; transition: transform 0.45s cubic-bezier(.2,.8,.2,1), opacity 0.2s ease; }
  .nur-beam::after { content: ''; position: absolute; right: -6px; top: 50%; width: 10px; height: 10px; margin-top: -5px; border-radius: 50%; background: ${T.line}; transition: background 0.3s ease 0.3s, box-shadow 0.3s ease 0.3s; }
  .nur-row.on .nur-beam::before { transform: scaleX(1); opacity: 1; }
  .nur-row.on .nur-beam::after { background: var(--c); box-shadow: 0 0 0 3px var(--cs), 0 0 12px 1px var(--c); }
  .nur-slot { display: flex; flex-direction: column; gap: 5px; text-align: left; background: ${T.bg}; border: none; border-radius: 12px; padding: 9px 12px; min-width: 0; overflow-wrap: anywhere; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: background 0.35s ease, box-shadow 0.35s ease; font-family: 'Manrope', sans-serif; }
  button.nur-slot { cursor: pointer; }
  button.nur-slot:hover { box-shadow: inset 0 0 0 1.5px var(--c); }
  .nur-row.on .nur-slot { background: var(--cs); box-shadow: inset 0 0 0 1.5px var(--c); animation: nur-glow 0.9s ease-out 1; }
  @keyframes nur-glow { 0% { box-shadow: inset 0 0 0 1.5px var(--c), 0 0 0 0 var(--c); } 40% { box-shadow: inset 0 0 0 1.5px var(--c), 0 0 0 5px var(--cs); } 100% { box-shadow: inset 0 0 0 1.5px var(--c), 0 0 0 0 transparent; } }
  .nur-slot.targetable { box-shadow: inset 0 0 0 2px ${T.accent}66; }
  .nur-slot.miss { box-shadow: inset 0 0 0 2px ${T.err}; background: ${T.errSoft}; animation: nur-shake 0.4s ease; }
  @keyframes nur-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 55% { transform: translateX(5px); } 80% { transform: translateX(-2px); } }
  .nur-q { display: flex; align-items: center; flex-wrap: wrap; gap: 7px; font-weight: 700; font-size: clamp(12px,1.45vw,13.5px); color: var(--ct); }
  .nur-ic { font-size: 16px; line-height: 1; }
  .nur-nom { font-weight: 800; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: #fff; background: var(--ct); border-radius: 99px; padding: 2px 8px; animation: fade-step 0.3s ease-out; }
  .nur-in { display: block; min-width: 0; }
  .nur-in:empty { display: none; }
  .nur-txt { display: block; font-weight: 600; font-size: clamp(13px,1.55vw,14.5px); color: ${T.ink}; line-height: 1.4; overflow-wrap: anywhere; }
  .nur-empty { font-style: italic; color: ${T.ink3}; }
  .nur-q-closed { font-weight: 800; color: ${T.ink3}; }
  .nur-chips { display: flex; flex-wrap: wrap; gap: 5px; }
  .nur-chip { font-weight: 700; font-size: 12px; color: ${T.ink}; background: ${T.paper}; border-radius: 99px; padding: 3px 9px; min-width: 0; overflow-wrap: anywhere; animation: fade-step 0.3s ease-out; }
  /* Maqsad-ekran: uyalar birin-ketin yonadi, matn o'zi yozilib chiqadi (18-qonun). */
  .nur.demo .nur-beam::before { transition: none; animation: nur-ray 0.6s cubic-bezier(.2,.8,.2,1) var(--dd, 0.5s) both; }
  .nur.demo .nur-beam::after { transition: none; animation: nur-lamp 0.4s ease calc(var(--dd, 0.5s) + 0.35s) both; }
  .nur.demo .nur-slot { animation: nur-slot-on 0.6s var(--dd, 0.5s) both; }
  .nur.demo .demo-t { animation: nur-type 1.1s var(--dd, 0.9s) both; }
  @keyframes nur-ray { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); opacity: 1; } }
  @keyframes nur-lamp { from { background: ${T.line}; box-shadow: none; } to { background: var(--c); box-shadow: 0 0 0 3px var(--cs), 0 0 12px 1px var(--c); } }
  @keyframes nur-slot-on { from { background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; } to { background: var(--cs); box-shadow: inset 0 0 0 1.5px var(--c); } }
  @keyframes nur-type { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
  @media (prefers-reduced-motion: reduce) { .nur-beam::before, .nur-beam::after { transition: none; } .nur.demo .nur-beam::before, .nur.demo .nur-beam::after, .nur.demo .nur-slot, .nur.demo .demo-t, .nur-row.on .nur-slot, .nur-slot.miss, .nur-nom, .nur-chip { animation: none; } }

  /* Test-kartochka va keys-kirish */
  .tq-card { margin: 0 0 12px; background: ${T.paper}; border-radius: 14px; padding: 12px 16px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(14px,1.7vw,16px); line-height: 1.5; color: ${T.ink}; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.25); min-width: 0; overflow-wrap: anywhere; }
  .k-intro { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; }

  /* SARALASH (s4): gap-idishi */
  .gpool { display: flex; flex-direction: column; gap: 7px; background: ${T.paper}; border-radius: 14px; padding: 10px 12px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.22); }
  .gpool-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.05em; color: ${T.ink2}; }
  .gpool-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .gchip { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; background: ${T.bg}; border: none; border-radius: 12px; padding: 8px 12px; cursor: pointer; text-align: left; min-width: 0; overflow-wrap: anywhere; transition: transform 0.15s ease, box-shadow 0.15s ease; }
  .gchip:hover { transform: translateY(-1px); box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .gchip.sel { background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}; }

  /* SAYT-MAKET (s8 · s10) */
  .smock { background: ${T.paper}; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.3); min-width: 0; }
  .smock-bar { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: ${T.bg}; }
  .smock-bar > span { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
  .smock-bar em { margin-left: 8px; font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink3}; }
  .smock-body { padding: 14px 12px 12px; display: flex; flex-direction: column; gap: 12px; }
  .scomp { position: relative; display: flex; align-items: center; gap: 10px; text-align: left; background: ${T.bg}; border: none; border-radius: 12px; padding: 12px 14px; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: background 0.3s ease, box-shadow 0.3s ease; min-width: 0; }
  .scomp:hover { box-shadow: inset 0 0 0 1.5px var(--c); }
  .scomp.open { background: var(--cs); box-shadow: inset 0 0 0 1.5px var(--c); }
  .scomp.targetable { box-shadow: inset 0 0 0 2px ${T.accent}66; }
  .scomp.miss, .scomp-none.miss { box-shadow: inset 0 0 0 2px ${T.err}; background: ${T.errSoft}; animation: nur-shake 0.4s ease; }
  .scomp-tag { position: absolute; top: -9px; right: 10px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; font-weight: 700; color: #fff; background: ${T.ink}; border-radius: 6px; padding: 1px 7px; animation: fade-step 0.25s ease-out; }
  .scomp-ic { font-size: 22px; line-height: 1; flex-shrink: 0; }
  .scomp-col { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .scomp-ui { font-weight: 800; font-size: clamp(13px,1.55vw,14.5px); color: ${T.ink}; overflow-wrap: anywhere; }
  .scomp-sub { font-weight: 500; font-size: 12px; color: ${T.ink2}; }
  .scomp-none { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; background: transparent; border: none; border-radius: 12px; padding: 10px 12px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .scomp-none:hover, .scomp-none.targetable { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}88; }
  @media (prefers-reduced-motion: reduce) { .scomp.miss, .scomp-none.miss { animation: none; } }

  /* TEKSHIRUV (s10): mehmon-kartalar */
  .guests { display: flex; flex-direction: column; gap: 8px; }
  .guest { display: flex; align-items: flex-start; gap: 10px; text-align: left; background: ${T.paper}; border: none; border-radius: 14px; padding: 10px 12px; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.25); min-width: 0; }
  .guest.sel { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 20px -10px rgba(91,61,230,0.35); background: ${T.accentSoft}; }
  .guest.ok { background: ${T.successSoft}; cursor: default; box-shadow: none; }
  .guest-ic { font-size: 18px; line-height: 1.2; flex-shrink: 0; color: ${T.success}; font-weight: 800; }
  .guest-col { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .guest-t { font-weight: 600; font-size: clamp(13px,1.55vw,14.5px); color: ${T.ink}; line-height: 1.4; overflow-wrap: anywhere; }
  .guest-to { font-weight: 700; font-size: 12px; color: ${T.success}; }

  /* MUSTAQIL ISH (s9) */
  .sdots { display: flex; align-items: center; gap: 6px; }
  .sdot { width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer; background: ${T.paper}; color: ${T.ink2}; font-family: 'Manrope'; font-weight: 800; font-size: 13px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .sdot.ok { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; }
  .sdot.cur { background: ${T.accent}; color: #fff; box-shadow: none; }
  .st-card { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: clamp(13.5px,1.6vw,15px); line-height: 1.55; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .st-nat { background: ${T.accentSoft}; color: ${T.ink}; border-radius: 6px; padding: 1px 5px; }
  .tq-row { display: flex; flex-direction: column; gap: 6px; }
  .tqb { display: flex; align-items: center; gap: 8px; text-align: left; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; background: ${T.bg}; border: none; border-radius: 11px; padding: 9px 12px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .tqb:hover { box-shadow: inset 0 0 0 1.5px var(--c); }
  .tqb.on { background: var(--cs); box-shadow: inset 0 0 0 1.5px var(--c); }
  .kin { display: flex; align-items: center; gap: 4px; min-width: 0; }
  .kin-b { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 16px; color: ${T.ink2}; }
  .kin-i { flex: 1; min-width: 0; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 14px; color: ${T.ink}; border: none; border-radius: 9px; padding: 8px 10px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; }
  .kin-i:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
  .kin-i.filled { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .sb-next { align-self: flex-end; }
  .jstrip { align-self: flex-start; display: flex; flex-direction: column; gap: 6px; }
  .jstrip-pill { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 99px; padding: 6px 13px; cursor: pointer; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.3); }
  .jstrip-pill b { color: ${T.accent}; }
  .jstrip-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .jstrip-row { display: inline-flex; align-items: center; gap: 5px; background: var(--cs); border-radius: 99px; padding: 3px 9px; font-family: 'Manrope'; font-size: 12px; min-width: 0; }
  .jstrip-row em { font-style: normal; font-weight: 700; font-size: 10.5px; color: ${T.ink2}; }

  /* KODING (s11): Debug Challenge — qator bosiladi, tur qiymati yozuv-joyiga aylanadi */
  .vsc .vsc-body { max-height: none; }
  .tk-c { color: #6A9955; }
  .tk-t { color: #4EC9B0; }
  .tk-k { color: #569CD6; }
  .tk-s { color: #CE9178; }
  .vsc-line.dbg { cursor: pointer; border-radius: 6px; transition: background 0.2s ease; }
  .vsc-line.dbg:hover { background: rgba(255,255,255,0.06); }
  .vsc-line.dbg.open { background: rgba(110,75,255,0.22); cursor: default; }
  .vsc-line.dbg.fixed { background: rgba(18,169,104,0.16); cursor: default; }
  .vsc-line.dbg.star { cursor: default; }
  .dbg-in { font: inherit; color: #FFD580; background: #2D2D2D; border: none; border-radius: 4px; padding: 0 4px; width: 11ch; outline: 1.5px solid ${T.accentVivid}; }
  .dbg-in.w { width: 10ch; }
  .dbg-in.w2 { width: 18ch; }
  .dbg-ok { color: #4ADE80; font-weight: 700; }
  .nur-site { display: flex; flex-direction: column; gap: 8px; }
  /* Debug Challenge: kod ustuni kengroq, uzun qator o'raladi — «tur» qiymati doim ko'rinadi. */
  .nur-site .nur.compact { grid-template-columns: minmax(84px,0.55fr) minmax(0,3fr); }
  .vsc-line.dbg { min-width: 0; }
  .vsc-line.dbg .vsc-code { white-space: pre-wrap; overflow-wrap: anywhere; padding-left: 2ch; text-indent: -2ch; }
  .kbridge .vsc-body { font-size: clamp(10.5px,1.25vw,12px); }

  /* Uy-vazifa: uch savol kartaning o'zida (B6) */
  .hw-q3 { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
  .hw-q { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: var(--ct); background: var(--cs); border-radius: 99px; padding: 5px 11px; }
`;

// Mentor-panel, qayta tushuntirish, nishonlar, podium va CodeStrike arenasi (platforma mahsuloti).
const CSS_ARENA = `
  .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
  .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
  .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.blue}; }
  .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
  .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
  .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(91,61,230,0.5); }
  .mstats-reveal.ready { color: #fff; background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
  @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px rgba(91,61,230,0.5); } 50% { box-shadow: 0 4px 18px 0 rgba(91,61,230,0.55); } }
  .mstats-prog { height: 7px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; overflow: hidden; }
  .mstats-prog-fill { display: block; height: 100%; border-radius: 99px; background: ${T.blue}; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
  .mstats-prog-fill.full { background: ${T.success}; }
  .mstats-big { display: flex; gap: 10px; flex-wrap: wrap; }
  .mstats-chip { flex: 1; min-width: 96px; display: flex; flex-direction: column; align-items: center; gap: 2px; border-radius: 14px; padding: clamp(10px,1.6vw,14px) 8px; }
  .mstats-chip-n { font-family: 'Manrope'; font-weight: 800; font-size: clamp(24px,3.4vw,34px); line-height: 1; }
  .mstats-chip-t { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
  .mstats-chip.okc  { background: ${T.successSoft}; } .mstats-chip.okc .mstats-chip-n, .mstats-chip.okc .mstats-chip-t { color: ${T.success}; }
  .mstats-chip.badc { background: ${T.errSoft}; } .mstats-chip.badc .mstats-chip-n, .mstats-chip.badc .mstats-chip-t { color: ${T.err}; }
  .mstats-chip.waitc { background: rgba(${T.shadowBase},0.06); } .mstats-chip.waitc .mstats-chip-n, .mstats-chip.waitc .mstats-chip-t { color: ${T.ink2}; }
  .mstats-chip.ansc { background: rgba(1,154,203,0.10); } .mstats-chip.ansc .mstats-chip-n, .mstats-chip.ansc .mstats-chip-t { color: ${T.blue}; }
  .mstats-hidden { margin: 0; font-family: 'Manrope'; font-size: 12.5px; font-style: italic; color: ${T.ink3}; }
  .mstats-bars { display: flex; flex-direction: column; gap: 8px; }
  .mstats-row { display: flex; align-items: center; gap: 10px; transition: opacity 0.4s; }
  .mstats-row.dimmed { opacity: 0.4; }
  .mstats-abc { width: 28px; height: 28px; border-radius: 9px; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 3px 8px -3px rgba(${T.shadowBase},0.3); }
  .mstats-track { flex: 1; height: 16px; background: rgba(${T.shadowBase},0.07); border-radius: 99px; overflow: hidden; }
  .mstats-fill { display: block; height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(.4,0,.2,1); opacity: 0.85; }
  .mstats-count { min-width: 108px; text-align: right; font-size: 12px; font-weight: 600; color: ${T.ink2}; white-space: nowrap; }
  .mstats-waitrow { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .mstats-wait-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink3}; }
  .mstats-wait-chip { font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; background: rgba(${T.shadowBase},0.07); border-radius: 99px; padding: 3px 10px; }
  .mstats-wait-chip.more { color: ${T.ink3}; }
  .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.err}; background: ${T.errSoft}; border-radius: 10px; padding: 9px 12px; }
  .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
  @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
  .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
  .mstats-verdict.need { background: ${T.errSoft}; }
  .mstats-verdict.maybe { background: rgba(232,161,58,0.14); }
  .mstats-verdict.good { background: ${T.successSoft}; }
  .mstats-verdict.few { background: rgba(167,166,162,0.12); }
  .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
  .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(91,61,230,0.5); transition: all 0.2s; }
  .rc-open.soft { background: ${T.paper}; color: ${T.accent}; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); }
  .rc-open-mini { align-self: flex-start; margin-top: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); transition: all 0.2s; }
  .rc-open-mini:hover { transform: translateY(-1px); }

  .rc-overlay { position: fixed; inset: 0; z-index: 10005; background: ${T.bg}; display: flex; flex-direction: column; align-items: center; padding: clamp(14px,3vw,32px); overflow-y: auto; animation: fade-step 0.3s ease-out; font-family: 'Manrope', sans-serif; }
  .rc-head { width: 100%; max-width: 880px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .rc-tag { font-weight: 800; font-size: clamp(11px,1.4vw,13px); letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 6px 14px; white-space: nowrap; }
  .rc-title { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.4vw,22px); color: ${T.ink}; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .rc-x { background: ${T.paper}; border: none; border-radius: 10px; width: 36px; height: 36px; font-size: 15px; color: ${T.ink2}; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
  .rc-x:hover { color: ${T.accent}; }
  .rc-card { flex: 1; width: 100%; max-width: 880px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: clamp(10px,2.2vw,20px); padding: clamp(16px,3vw,28px) 0; animation: fade-step 0.35s ease-out; }
  .rc-ic { font-size: clamp(44px,8vw,76px); line-height: 1; }
  .rc-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(24px,4.6vw,44px); color: ${T.ink}; line-height: 1.12; max-width: 800px; margin: 0; }
  .rc-body { font-size: clamp(15px,2.4vw,21px); line-height: 1.55; color: ${T.ink2}; max-width: 720px; margin: 0; }
  .rc-body b { color: ${T.ink}; }
  .rc-ask { font-weight: 600; font-size: clamp(13px,1.8vw,16px); color: ${T.accent}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 18px; max-width: 660px; }
  .rc-nav { width: 100%; max-width: 880px; display: flex; align-items: center; gap: 14px; flex-shrink: 0; padding-top: 8px; }
  .rc-dots { flex: 1; display: flex; justify-content: center; gap: 8px; }
  .rc-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
  .rc-dot.fill { background: ${T.ink3}; }
  .rc-dot.cur { background: ${T.accent}; width: 26px; }
  .rc-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,16px); border: none; border-radius: 12px; padding: clamp(11px,1.6vw,14px) clamp(18px,2.6vw,26px); cursor: pointer; background: ${T.accent}; color: #fff; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); transition: all 0.2s; white-space: nowrap; }
  .rc-btn:hover:not(:disabled) { background: ${T.accent}; }
  .rc-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
  .rc-btn.ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
  .rc-btn.done { background: ${T.success}; color: #fff; }
  @media (max-width: 640px) { .rc-nav { flex-wrap: wrap; justify-content: center; row-gap: 10px; } .rc-dots { width: 100%; order: -1; } }

  .ach-cnt-wrap { position: relative; }
  .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
  .ach-counter.has { border-color: ${T.accent}66; }
  .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(91,61,230,0.4); }
  .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
  .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
  .ach-cnt-ic { font-size: 14px; }
  .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
  @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); } }
  .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 232px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
  .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
  .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
  .ach-pop-row.got { background: ${T.accentSoft}66; }
  .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
  .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
  .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
  .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink3}; }
  .ach-coll { display: flex; flex-direction: column; gap: 10px; }
  .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
  .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border-radius: 14px; padding: 14px 10px; transition: transform 0.15s; }
  .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #F5F1FE); border: 1.5px solid ${T.accent}55; }
  .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line}; opacity: 0.75; }
  .ach-badge-ic { font-size: 30px; line-height: 1; }
  .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
  .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
  .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
  .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
  .acu-overlay { position: fixed; inset: 0; z-index: 11000; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;
    background: radial-gradient(circle at 50% 42%, rgba(20,14,6,0.34) 0%, rgba(10,8,14,0.72) 62%, rgba(8,6,12,0.86) 100%);
    animation: acu-bg-in 0.35s ease-out, acu-bg-out 0.55s ease-in 3.45s forwards; }
  @keyframes acu-bg-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes acu-bg-out { to { opacity: 0; } }
  .acu-rays { position: absolute; top: 50%; left: 50%; width: 170vmax; height: 170vmax; transform: translate(-50%,-50%); pointer-events: none;
    background: repeating-conic-gradient(from 0deg, rgba(255,201,77,0.16) 0deg 7deg, transparent 7deg 20deg);
    -webkit-mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%); mask-image: radial-gradient(circle, #000 8%, rgba(0,0,0,0.55) 30%, transparent 62%);
    animation: acu-spin 16s linear infinite, acu-fade 0.6s ease-out; }
  @keyframes acu-spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
  @keyframes acu-fade { from { opacity: 0; } to { opacity: 1; } }
  .acu-glow { position: absolute; top: 42%; left: 50%; width: 78vmin; height: 78vmin; transform: translate(-50%,-50%); pointer-events: none; filter: blur(4px);
    background: radial-gradient(circle, rgba(255,224,150,0.62) 0%, rgba(255,150,60,0.30) 38%, rgba(255,120,40,0) 68%);
    animation: acu-glow-pulse 2.2s ease-in-out infinite, acu-fade 0.5s ease-out; }
  @keyframes acu-glow-pulse { 0%,100% { opacity: 0.85; transform: translate(-50%,-50%) scale(1); } 50% { opacity: 1; transform: translate(-50%,-50%) scale(1.08); } }
  .acu-ring { position: absolute; top: 42%; left: 50%; width: 130px; height: 130px; border-radius: 50%; border: 3px solid rgba(255,240,200,0.85); transform: translate(-50%,-50%) scale(0.3); pointer-events: none; animation: acu-shock 1s cubic-bezier(.2,.7,.3,1) forwards; }
  .acu-ring.d2 { border-color: rgba(255,180,90,0.6); animation-delay: 0.22s; }
  @keyframes acu-shock { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0.9; } 100% { transform: translate(-50%,-50%) scale(6.5); opacity: 0; } }
  .acu-stage { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: clamp(14px,3vw,22px); animation: acu-bg-in 0.3s ease-out; }
  .acu-medal-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
  .acu-medal { position: relative; width: clamp(112px,26vw,152px); height: clamp(112px,26vw,152px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: clamp(54px,13vw,74px); overflow: hidden;
    background: radial-gradient(circle at 38% 30%, #FFF0BE 0%, #FFD35A 42%, #F5A623 72%, #E4870C 100%);
    box-shadow: 0 0 70px 12px rgba(255,201,77,0.55), 0 22px 54px -12px rgba(0,0,0,0.55), inset 0 -9px 18px rgba(140,70,0,0.28), inset 0 7px 14px rgba(255,255,255,0.6);
    animation: acu-medal-pop 0.7s cubic-bezier(.28,1.5,.4,1) both, acu-float 2.6s ease-in-out 0.7s infinite; }
  @keyframes acu-medal-pop { 0% { transform: scale(0) rotate(-40deg); } 55% { transform: scale(1.18) rotate(10deg); } 75% { transform: scale(0.94) rotate(-3deg); } 100% { transform: scale(1) rotate(0); } }
  @keyframes acu-float { 0%,100% { translate: 0 0; } 50% { translate: 0 -8px; } }
  .acu-shine { position: absolute; top: 0; bottom: 0; left: -70%; width: 45%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.75), transparent); transform: skewX(-18deg); animation: acu-shine-sweep 1.1s ease 0.5s 2; }
  @keyframes acu-shine-sweep { to { left: 130%; } }
  .acu-spark { position: absolute; top: 50%; left: 50%; font-size: clamp(14px,2.6vw,20px); color: #FFE9A8; text-shadow: 0 0 8px rgba(255,201,77,0.9); pointer-events: none; transform: translate(-50%,-50%) rotate(var(--a)) translateY(0) scale(0); opacity: 0; animation: acu-spark-burst 1s ease-out both; }
  @keyframes acu-spark-burst { 0% { transform: translate(-50%,-50%) rotate(var(--a)) translateY(0) scale(0); opacity: 0; } 35% { opacity: 1; } 100% { transform: translate(-50%,-50%) rotate(var(--a)) translateY(clamp(-130px,-24vw,-96px)) scale(1); opacity: 0; } }
  .acu-txt { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; }
  .acu-name { font-family: 'Source Serif 4', Georgia, serif; font-weight: 700; font-size: clamp(26px,5.5vw,42px); color: #fff; line-height: 1.1; text-shadow: 0 3px 22px rgba(0,0,0,0.55); animation: acu-rise 0.55s cubic-bezier(.3,1.2,.4,1) 0.45s both; }
  .acu-desc { font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,2vw,16px); color: rgba(255,255,255,0.82); max-width: 30ch; line-height: 1.5; animation: acu-rise 0.5s ease-out 0.6s both; }
  @keyframes acu-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  .acu-tap { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); margin-top: 4px; animation: acu-rise 0.5s ease-out 1.1s both, acu-blink 1.6s ease-in-out 1.6s infinite; }
  @keyframes acu-blink { 0%,100% { opacity: 0.5; } 50% { opacity: 0.85; } }
  @media (prefers-reduced-motion: reduce) { .acu-rays, .acu-medal, .acu-glow, .acu-tap { animation-iteration-count: 1 !important; } }

  .confetti { position: fixed; inset: 0; pointer-events: none; z-index: 1200; overflow: hidden; }
  .confetti-bit { position: absolute; top: -24px; opacity: 0; will-change: transform, opacity; animation-name: confetti-fall; animation-timing-function: cubic-bezier(.25,.6,.45,1); animation-iteration-count: 1; animation-fill-mode: forwards; }
  @keyframes confetti-fall { 0% { transform: translateY(-24px) rotate(0deg); opacity: 0; } 8% { opacity: 1; } 55% { transform: translateY(48vh) translateX(22px) rotate(320deg); } 100% { transform: translateY(104vh) translateX(-12px) rotate(680deg); opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .confetti { display: none; } }

  .pod-stage { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px,2vw,20px); padding-top: 8px; }
  .pod-col { display: flex; flex-direction: column; align-items: center; gap: 5px; width: clamp(88px,22vw,150px); }
  .pod-medal { font-size: clamp(26px,4vw,38px); line-height: 1; }
  .pod-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.8vw,16px); color: ${T.ink}; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pod-score { font-size: clamp(11px,1.4vw,12.5px); color: ${T.ink2}; }
  .pod-bar { width: 100%; border-radius: 10px 10px 0 0; background: linear-gradient(180deg, ${T.accent}, ${T.accent}BB); box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); transform-origin: bottom; animation: pod-rise 0.85s cubic-bezier(.3,1.2,.4,1); }
  @keyframes pod-rise { from { transform: scaleY(0.06); opacity: 0.4; } to { transform: scaleY(1); opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .pod-bar { animation: none; } }
  .pod-1 .pod-bar { height: clamp(74px,11vw,120px); }
  .pod-2 .pod-bar { height: clamp(52px,8vw,86px); background: linear-gradient(180deg, ${T.ink2}, ${T.ink3}); }
  .pod-3 .pod-bar { height: clamp(38px,6vw,62px); background: linear-gradient(180deg, #C98A3D, #DDA55C); }
  .pod-col.me .pod-name { color: ${T.success}; }
  .pod-my { margin: 0; text-align: center; font-family: 'Manrope'; font-size: 14px; color: ${T.ink2}; }
  .pod-my b { color: ${T.accent}; }
  .pod-list { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow: auto; }
  .pod-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: rgba(${T.shadowBase},0.04); }
  .pod-row.me { background: ${T.successSoft}; outline: 1.5px solid ${T.success}66; }
  .pod-rank { min-width: 22px; font-size: 12px; font-weight: 700; color: ${T.ink3}; }
  .pod-row-name { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pod-row-dots { display: flex; gap: 4px; }
  .pod-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(${T.shadowBase},0.15); }
  .pod-dot.ok { background: ${T.success}; }
  .pod-dot.bad { background: ${T.err}; }
  .pod-row-score { min-width: 34px; text-align: right; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
  .pod-row-time { min-width: 46px; text-align: right; font-size: 11.5px; color: ${T.ink3}; }
  .pod-solo { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
  .pod-solo-sec { background: ${T.paper}; border-radius: 14px; padding: 12px 18px; display: flex; flex-direction: column; align-items: center; gap: 8px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.16); }
  .pod-solo-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
  .pod-solo-badges { display: flex; gap: 9px; align-items: center; }
  .pod-solo-b { font-size: 24px; line-height: 1; }
  .pod-solo-b:not(.got) { filter: grayscale(1) opacity(0.45); font-size: 18px; }

  .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }
  .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
  .cs-cta .cs-cap { padding: clamp(14px,2vw,24px) clamp(22px,3.2vw,40px); gap: clamp(4px,0.7vw,8px); }
  @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
  .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
    gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px;
    background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%);
    border: 1.5px solid rgba(186,140,255,0.72);
    box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32);
    animation: cs-ignite 1.5s ease-out both, cs-breathe 3.8s ease-in-out 1.5s infinite; }
  @keyframes cs-ignite { 0% { opacity: .22; filter: saturate(.25) brightness(.55); box-shadow: none; } 32% { opacity: .3; } 38% { opacity: 1; filter: none; } 44% { opacity: .38; } 51% { opacity: 1; filter: none; } 57% { opacity: .55; } 66%, 100% { opacity: 1; filter: none; } }
  @keyframes cs-breathe { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); } 50% { box-shadow: 0 0 0 1px rgba(110,55,210,.6), 0 0 40px rgba(140,72,255,.75), 0 0 96px rgba(140,72,255,.42), inset 0 0 60px rgba(140,72,255,.44); } }
  .cs-ring { position: absolute; inset: 0; border-radius: inherit; padding: 2.5px; pointer-events: none; z-index: 4;
    background: conic-gradient(from var(--csa), transparent 0 80%, rgba(201,166,255,0) 80%, rgba(201,166,255,.9) 91%, #FFFFFF 96%, transparent 100%);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude;
    animation: cs-current 3.4s linear infinite; }
  @keyframes cs-current { to { --csa: 360deg; } }
  .cs-sky { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
  .cs-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; line-height: 1; user-select: none; color: rgba(203,173,255,.32); text-shadow: 0 0 12px rgba(150,95,255,.4); animation: cs-float ease-in-out infinite; animation-duration: calc(var(--d,22s) / var(--spd,1)); will-change: transform; }
  .cs-tok.back { color: rgba(150,115,240,.16); filter: blur(.6px); }
  @keyframes cs-float { 0%,100% { transform: translate(0,0) rotate(-5deg); } 50% { transform: translate(16px,-14px) rotate(5deg); } }
  .cs-dash { position: absolute; height: 2px; border-radius: 2px; background: linear-gradient(90deg, transparent, rgba(190,150,255,.55), transparent); animation: cs-dash-run 5.5s linear infinite; }
  @keyframes cs-dash-run { 0% { transform: translateX(-46px); opacity: 0; } 14% { opacity: .85; } 86% { opacity: .85; } 100% { transform: translateX(76px); opacity: 0; } }
  .cs-thunder { position: absolute; inset: 0; opacity: 0; background: radial-gradient(62% 95% at 50% 0%, rgba(222,192,255,.55), transparent 64%); animation: cs-thunder 6.4s linear infinite; }
  @keyframes cs-thunder { 0%, 90.5%, 100% { opacity: 0; } 91.4% { opacity: .5; } 92.3% { opacity: .07; } 93.4% { opacity: .38; } 95% { opacity: 0; } }
  .cs-row { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; gap: clamp(14px,2.6vw,30px); }
  .csn-boltwrap { position: relative; display: inline-flex; flex: none; }
  .csn-bolt { width: clamp(30px,4.6vw,54px); height: auto; filter: drop-shadow(0 0 9px rgba(170,120,255,.75)); animation: cs-bolt-strike 2s linear infinite; }
  .csn-boltwrap.flip .csn-bolt { animation-delay: 1s; }
  @keyframes cs-bolt-strike { 0%, 100% { filter: drop-shadow(0 0 9px rgba(170,120,255,.75)) brightness(1); transform: translateY(0) scale(1); } 5% { filter: drop-shadow(0 0 26px rgba(230,205,255,1)) brightness(2.4); transform: translateY(2px) scale(1.14); } 9% { filter: drop-shadow(0 0 7px rgba(170,120,255,.55)) brightness(.9); transform: translateY(0) scale(.97); } 13% { filter: drop-shadow(0 0 20px rgba(215,185,255,.95)) brightness(1.8); transform: translateY(1px) scale(1.07); } 20% { filter: drop-shadow(0 0 9px rgba(170,120,255,.75)) brightness(1); transform: translateY(0) scale(1); } }
  .cs-spark { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: #E7D9FF; box-shadow: 0 0 9px rgba(190,150,255,.95); opacity: 0; pointer-events: none; }
  .cs-spark.s1 { top: 6%; left: 72%; --sx: 15px; --sy: -16px; }
  .cs-spark.s2 { top: 50%; left: -10%; --sx: -17px; --sy: -10px; animation-delay: .3s !important; }
  .cs-spark.s3 { top: 80%; left: 74%; --sx: 13px; --sy: 12px; animation-delay: .55s !important; }
  .cs-cap:hover .cs-spark { animation: cs-spark-fly .9s ease-out infinite; }
  @keyframes cs-spark-fly { 0% { opacity: 0; transform: translate(0,0) scale(.4); } 22% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--sx,14px), var(--sy,-16px)) scale(1); } }
  .cs-word { position: relative; z-index: 2; display: inline-block; font-family: 'Manrope', sans-serif; font-weight: 900; font-style: italic; font-size: clamp(30px,6.2vw,72px); letter-spacing: .015em; line-height: 1.06; white-space: nowrap; padding-right: .06em; background: linear-gradient(180deg,#FFFFFF 10%,#E4D6FF 46%,#A97CFF 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; animation: cs-wglow 2.8s ease-in-out infinite; }
  .cs-word::before { content: attr(data-text); position: absolute; left: 0; top: 0; width: 100%; padding-right: inherit; pointer-events: none; background: linear-gradient(100deg, transparent 34%, rgba(255,255,255,.95) 48%, rgba(255,255,255,.4) 54%, transparent 66%); background-size: 260% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; animation: cs-glint 3.4s cubic-bezier(.6,0,.4,1) infinite; }
  @keyframes cs-wglow { 0%,100% { filter: drop-shadow(0 3px 0 rgba(38,10,88,.9)) drop-shadow(0 0 14px rgba(150,90,255,.5)); } 50% { filter: drop-shadow(0 3px 0 rgba(38,10,88,.9)) drop-shadow(0 0 27px rgba(172,112,255,.95)); } }
  @keyframes cs-glint { 0% { background-position: 135% 0; } 60%,100% { background-position: -55% 0; } }
  .cs-clickable:hover .cs-word { animation-duration: 1.4s; }
  .cs-hud { position: relative; z-index: 2; display: flex; gap: clamp(7px,1.1vw,11px); align-items: center; justify-content: center; flex-wrap: wrap; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: clamp(10px,1.3vw,13px); letter-spacing: .14em; color: #D9C9FF; }
  .cs-hud-i { display: inline-flex; align-items: baseline; gap: 5px; background: rgba(255,255,255,.055); border: 1px solid rgba(190,150,255,.42); border-radius: 999px; padding: 6px 14px; text-shadow: 0 0 10px rgba(160,100,255,.55); }
  .cs-hud-i b { font-size: clamp(13px,1.7vw,17px); color: #fff; }
  .cs-hud-dot { color: rgba(190,150,255,.6); }
  .cs-enter { position: relative; z-index: 2; font-family: 'Manrope'; font-weight: 900; font-size: clamp(13px,1.8vw,17px); color: #C9A6FF; letter-spacing: .01em; text-shadow: 0 0 12px rgba(150,90,255,.6); animation: cs-enter-pulse 1.3s ease-in-out infinite; }
  .cs-enter.wait { color: #8C86A8; text-shadow: none; animation: none; }
  @keyframes cs-enter-pulse { 0%,100% { opacity: .72; transform: translateY(0) scale(1); } 50% { opacity: 1; transform: translateY(2px) scale(1.03); } }
  .cs-clickable { cursor: pointer; user-select: none; transition: transform .18s cubic-bezier(.2,1,.3,1); outline: none; }
  .cs-clickable:hover { transform: scale(1.015); --spd: 2.2; }
  .cs-off { filter: saturate(.45) brightness(.74); }
  .cs-off .cs-ring, .cs-off .cs-thunder { display: none; }
  .cs-live { animation: cs-ignite 1.2s ease-out both, cs-breathe 1.7s ease-in-out 1.2s infinite; }
  .cs-livedot { position: absolute; top: clamp(12px,1.8vw,20px); right: clamp(18px,3vw,30px); z-index: 4; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
  .cs-livedot i { width: 8px; height: 8px; border-radius: 50%; background: #3CFF8E; box-shadow: 0 0 10px #3CFF8E; animation: cs-liveblink 1.1s ease-in-out infinite; }
  @keyframes cs-liveblink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
  .cs-charging { animation: cs-charge .45s ease-in forwards !important; }
  @keyframes cs-charge { to { transform: scale(1.05); filter: brightness(1.75) saturate(1.35); } }
  .cs-portal { position: fixed; inset: 0; z-index: 10400; pointer-events: none; background: radial-gradient(52% 52% at 50% 55%, rgba(210,180,255,.95), rgba(124,58,237,.55) 42%, transparent 76%); animation: cs-portal-in .9s ease-in-out both; }
  @keyframes cs-portal-in { 0% { opacity: 0; transform: scale(.55); } 48% { opacity: 1; transform: scale(1.35); } 100% { opacity: 0; transform: scale(1.7); } }
  @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-portal { animation: none !important; } }
  @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } }

  .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, rgba(255,79,40,0.14) 0%, rgba(255,79,40,0) 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
  .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
  .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; color: rgba(203,173,255,0.16); }
  @keyframes qz-drift { 0%,100% { transform: translate(0,0) rotate(-6deg) scale(1); } 50% { transform: translate(18px,-24px) rotate(6deg) scale(1.05); } }
  @media (prefers-reduced-motion: reduce) { .qz-shp { animation: none; } }
  .qz-x { position: fixed; top: 14px; right: 16px; z-index: 10600; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(186,140,255,0.34); background: rgba(255,255,255,0.06); color: #D9C9FF; font-size: 16px; cursor: pointer; box-shadow: 0 0 20px rgba(124,58,237,0.22); transition: transform 0.25s, color 0.2s, background 0.2s; }
  .qz-x:hover { color: #F2ECFF; background: rgba(255,255,255,0.12); transform: rotate(90deg); }
  .qz-view { position: relative; z-index: 1; width: 100%; max-width: 820px; display: flex; flex-direction: column; align-items: center; gap: clamp(14px,2.4vw,22px); margin: auto; }
  .qz-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(22px,4vw,36px); color: #F2ECFF; margin: 0; text-align: center; letter-spacing: -0.02em; text-shadow: 0 0 24px rgba(150,95,255,0.35); }
  .qz-sub { font-family: 'Manrope'; font-size: clamp(13px,1.9vw,16px); color: #B9A8E6; margin: 0; text-align: center; max-width: 540px; line-height: 1.55; font-weight: 500; }
  .qz-dimtxt { color: #8C86A8; font-family: 'Manrope'; font-size: 14px; font-style: italic; }
  .qz-lobby-players { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; max-width: 640px; }
  .qz-pchip { background: rgba(255,255,255,0.06); border: 1.5px solid rgba(186,140,255,0.34); color: #F2ECFF; font-family: 'Manrope'; font-weight: 700; font-size: 14px; border-radius: 99px; padding: 7px 16px; box-shadow: 0 0 18px rgba(124,58,237,0.2); animation: qz-pop 0.4s cubic-bezier(.34,1.5,.4,1); }
  .qz-pchip.me { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border-color: transparent; box-shadow: 0 0 22px rgba(255,79,40,0.45); }
  @keyframes qz-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .qz-btn { background: linear-gradient(170deg,#FF8A3D,#FF4F28); color: #fff; border: none; border-radius: 14px; padding: 13px 26px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 14px 26px -10px rgba(255,79,40,0.6), inset 0 2px 0 rgba(255,255,255,0.3); transition: transform 0.18s; }
  .qz-btn:hover:not(:disabled) { transform: translateY(-2px); }
  .qz-btn:disabled { opacity: 0.5; cursor: default; }
  .qz-btn.big { font-size: clamp(16px,2.2vw,19px); padding: clamp(15px,2vw,18px) clamp(32px,4vw,46px); }
  .qz-btn.ghost { background: linear-gradient(170deg,#7C3AED,#5B21B6); color: #F2ECFF; border: 1px solid rgba(186,140,255,0.5); box-shadow: 0 0 24px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.2); }
  .qz-waitmsg { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14.5px; color: #3CE88E; text-align: center; text-shadow: 0 0 14px rgba(60,232,142,0.4); }
  .qz-qview { max-width: 880px; }
  .qz-top { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .qz-count { font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.8vw,16px); color: #B9A8E6; }
  .qz-count b { color: #F2ECFF; font-size: 1.25em; }
  .qz-ansn { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.8vw,16px); color: #FF7A4D; min-width: 64px; text-align: right; text-shadow: 0 0 12px rgba(255,90,44,0.4); }
  .qz-timer { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
  .qz-timer-n { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 20px; }
  .qz-timer.urgent { animation: qz-shake 0.5s ease-in-out infinite; }
  @keyframes qz-shake { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
  .qz-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(19px,3.2vw,28px); color: #F2ECFF; margin: 0; text-align: center; line-height: 1.35; background: rgba(255,255,255,0.05); border: 1px solid rgba(186,140,255,0.34); border-radius: 20px; padding: clamp(18px,2.8vw,28px) clamp(18px,3vw,30px); width: 100%; box-shadow: 0 0 34px rgba(124,58,237,0.28), inset 0 1px 0 rgba(255,255,255,0.06); text-wrap: balance; }
  .qz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(11px,1.6vw,15px); width: 100%; }
  @media (max-width: 560px) { .qz-grid { grid-template-columns: 1fr; } }
  .qz-tile { --gl: 255,255,255; position: relative; display: flex; align-items: center; gap: 14px; border: none; border-radius: 18px; padding: clamp(15px,2.4vw,22px) clamp(14px,2.2vw,20px); cursor: pointer; text-align: left; min-height: 66px; color: #fff; overflow: hidden; box-shadow: 0 10px 26px -12px rgba(0,0,0,0.55), 0 0 26px -4px rgba(var(--gl),0.42), inset 0 2px 0 rgba(255,255,255,0.32), inset 0 -4px 0 rgba(0,0,0,0.22), inset 0 0 0 1.5px rgba(0,0,0,0.24); transition: transform 0.14s, opacity 0.3s, box-shadow 0.14s, filter 0.2s; }
  .qz-grid .qz-tile:nth-child(1) { --gl: 255,90,44; }
  .qz-grid .qz-tile:nth-child(2) { --gl: 15,166,214; }
  .qz-grid .qz-tile:nth-child(3) { --gl: 245,166,35; }
  .qz-grid .qz-tile:nth-child(4) { --gl: 34,160,92; }
  .qz-tile:hover:not(:disabled):not(.rv) { transform: translateY(-3px); }
  .qz-tile:disabled { cursor: default; }
  .qz-shape { width: 38px; height: 38px; border-radius: 12px; background: rgba(255,255,255,0.22); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.35); display: flex; align-items: center; justify-content: center; font-size: clamp(16px,2.2vw,20px); color: #fff; flex-shrink: 0; }
  .qz-opt { flex: 1; min-width: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(14px,2vw,17px); color: #fff; line-height: 1.35; letter-spacing: -0.01em; overflow-wrap: anywhere; }
  .qz-tile.faded { filter: saturate(0.5); opacity: 0.4; }
  .qz-tile.picked { outline: 3px solid #fff; box-shadow: 0 0 0 4px rgba(255,255,255,0.4), 0 14px 26px -12px rgba(0,0,0,0.4); animation: qz-pop 0.3s; }
  .qz-pbadge { position: absolute; top: -9px; right: -7px; width: 27px; height: 27px; border-radius: 50%; background: #fff; color: #12A968; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 12px rgba(0,0,0,0.28); }
  .qz-tile.rv.win { outline: 4px solid #fff; box-shadow: 0 0 0 5px rgba(43,217,124,0.45), 0 0 60px rgba(43,217,124,0.7), 0 14px 30px -12px rgba(0,0,0,0.5); animation: qz-pop 0.4s; }
  .qz-tile.rv.lose { filter: saturate(0.45); opacity: 0.4; }
  .qz-cnt { font-family: 'Manrope'; font-weight: 800; font-size: clamp(15px,2.2vw,19px); color: #fff; background: rgba(0,0,0,0.22); border-radius: 99px; padding: 4px 13px; flex-shrink: 0; margin-left: auto; font-variant-numeric: tabular-nums; }
  .qz-mrow { display: flex; align-items: center; gap: 14px; }
  .qz-allin { font-family: 'Manrope'; font-weight: 700; font-size: 15px; color: #3CE88E; text-shadow: 0 0 14px rgba(60,232,142,0.4); animation: qz-pop 0.4s; }
  .qz-res { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; justify-content: center; border-radius: 16px; padding: 14px 26px; animation: qz-pop 0.45s cubic-bezier(.34,1.5,.4,1); }
  .qz-res.good { background: rgba(43,217,124,0.15); outline: 1.5px solid rgba(43,217,124,0.5); box-shadow: 0 0 30px rgba(43,217,124,0.28); }
  .qz-res.bad { background: rgba(255,90,90,0.14); outline: 1.5px solid rgba(255,90,90,0.42); box-shadow: 0 0 30px rgba(255,90,90,0.22); }
  .qz-res-pts { font-family: 'Manrope'; font-weight: 800; font-size: clamp(28px,4.4vw,40px); color: #3CE88E; line-height: 1; text-shadow: 0 0 20px rgba(60,232,142,0.45); font-variant-numeric: tabular-nums; }
  .qz-res-t { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,2vw,17px); color: #F2ECFF; }
  .qz-res-rank { font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; color: #B9A8E6; width: 100%; text-align: center; }
  .qz-board { width: 100%; max-width: 480px; background: rgba(255,255,255,0.05); border: 1px solid rgba(186,140,255,0.32); border-radius: 18px; padding: 14px; display: flex; flex-direction: column; gap: 5px; box-shadow: 0 0 32px rgba(124,58,237,0.25); }
  .qz-board.wide { max-width: 640px; max-height: 260px; overflow: auto; }
  .qz-board-h { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.1em; color: #FF7A4D; margin-bottom: 3px; text-transform: uppercase; text-shadow: 0 0 12px rgba(255,90,44,0.4); }
  .qz-brow { display: flex; align-items: center; gap: 10px; padding: 8px 11px; border-radius: 11px; background: rgba(255,255,255,0.05); }
  .qz-brow.me { background: linear-gradient(90deg,rgba(43,217,124,0.26),rgba(43,217,124,0.06)); outline: 1.5px solid rgba(43,217,124,0.55); }
  .qz-brank { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: #F2ECFF; background: rgba(255,255,255,0.18); border-radius: 8px; min-width: 23px; height: 23px; display: flex; align-items: center; justify-content: center; }
  .qz-brow:first-of-type .qz-brank { background: #FFCE3D; color: #1B0F3F; box-shadow: 0 0 14px rgba(255,206,61,0.5); }
  .qz-brow.me .qz-brank { background: #2BD97C; color: #0B2417; }
  .qz-bname { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14.5px; color: #F2ECFF; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .qz-bstreak { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: #FF9A5D; }
  .qz-bok { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: #B9A8E6; }
  .qz-bpts { font-family: 'Manrope'; font-weight: 800; font-size: 15px; color: #FF7A4D; min-width: 52px; text-align: right; font-variant-numeric: tabular-nums; text-shadow: 0 0 10px rgba(255,90,44,0.35); }
  .qz-pod { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px,2.4vw,24px); padding-top: 18px; }
  .qz-pod-col { position: relative; display: flex; flex-direction: column; align-items: center; gap: 6px; width: clamp(92px,24vw,170px); }
  .qz-crown { position: absolute; top: -30px; font-size: 28px; animation: qz-float-sm 2s ease-in-out infinite; }
  @keyframes qz-float-sm { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-6px) rotate(4deg); } }
  .qz-pod-medal { font-size: clamp(30px,5vw,46px); line-height: 1; filter: drop-shadow(0 6px 14px rgba(0,0,0,0.4)); }
  .qz-pod-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,2vw,18px); color: #F2ECFF; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .qz-pod-pts { font-family: 'Manrope'; font-weight: 600; font-size: clamp(11px,1.5vw,13px); color: #B9A8E6; font-variant-numeric: tabular-nums; }
  .qz-pod-bar { width: 100%; border-radius: 14px 14px 0 0; box-shadow: inset 0 2px 0 rgba(255,255,255,0.45); animation: qz-rise 0.9s cubic-bezier(.3,1.2,.4,1); transform-origin: bottom; }
  @keyframes qz-rise { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  .qz-pod-col.p1 .qz-pod-bar { height: clamp(96px,14vw,156px); background: linear-gradient(180deg, #FFDE6B, #F5A623); }
  .qz-pod-col.p2 .qz-pod-bar { height: clamp(66px,10vw,110px); background: linear-gradient(180deg, #E4E7EE, #A2A8B4); }
  .qz-pod-col.p3 .qz-pod-bar { height: clamp(48px,7vw,82px); background: linear-gradient(180deg, #F4C08F, #CB8149); }
  .qz-pod-col.me .qz-pod-name { color: #3CE88E; }
  .qz-mypl { margin: 0; font-family: 'Manrope'; font-size: 15px; color: #B9A8E6; }
  .qz-mypl b { color: #3CE88E; }
  .qz-solo-res { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .qz-solo-pts { font-family: 'Manrope'; font-weight: 800; font-size: clamp(52px,9vw,84px); line-height: 1; color: #FF7A4D; text-shadow: 0 0 40px rgba(255,90,44,0.55); font-variant-numeric: tabular-nums; }
  .qz-endnote { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 10600; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; max-width: 94vw; background: rgba(27,15,63,0.86); border: 1px solid rgba(186,140,255,0.4); border-radius: 16px; padding: 10px 16px; color: #F2ECFF; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13.5px; box-shadow: 0 0 34px rgba(124,58,237,0.35); }
  .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
`;

// ============================================================ LESSON ROOT
export default function PmJtbdLesson({ lang: langProp, onFinished, liveToken }) {
  const lang = langProp || 'uz';
  __lang = lang; // UZ-RU: tr() uchun joriy til (render'dan oldin o'rnatiladi)
  setLiveLang(lang); // jonli-modul tarjimoni ham shu tilda
  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) {
    const p = progRead(LESSON_META.lessonId, TOTAL_SCREENS);
    if (p) {
      const li = LIVE_ENABLED ? liveRead(LESSON_META.lessonId) : null;
      if (li && li.mode === 'student' && typeof li.lastScreen === 'number')
        p.screen = Math.min(p.screen || 0, Math.max(0, li.lastScreen - 1));
    }
    savedRef.current = p;
  }
  const saved = savedRef.current;
  const [screen, setScreen] = useState(() => saved ? Math.min(Math.max(saved.screen || 0, 0), TOTAL_SCREENS - 1) : 0);
  const [answers, setAnswers] = useState(() => (saved && saved.answers) || {});
  const startTimeRef = useRef(saved?.startedAt || Date.now());
  const firstPassRef = useRef(saved?.firstPass || null); // 151-qonun 6-band: { answers, durationSec } | null — «Qaytadan»da muhrlanadi
  const soloSentRef = useRef(new Set()); // Q1 (19.09): solo'da maxsus test javobi serverga BIR marta
  const [fpPractice, setFpPractice] = useState(!!saved?.firstPass);
  const earnedRef = useRef(new Set(saved?.earned || []));
  const [earned, setEarned] = useState(() => new Set(saved?.earned || []));
  const [achToasts, setAchToasts] = useState([]);
  const achKeyRef = useRef(0);
  const earn = useCallback((id) => {
    if (firstPassRef.current) return; // 151-qonun: mashq-o'tishida nishonlar MUZLAGAN
    if (!ACHIEVEMENTS[id] || earnedRef.current.has(id)) return;
    earnedRef.current.add(id);
    setEarned(new Set(earnedRef.current));
    setAchToasts(t => [...t, { id, k: ++achKeyRef.current }]);
  }, []);
  const missedRef = useRef(new Set(saved?.missed || []));
  const [missed, setMissed] = useState(() => new Set(saved?.missed || []));
  const missTry = useCallback((idx) => {
    const sid = SCREEN_META[idx] && SCREEN_META[idx].id;
    const ach = ACH_TRIGGERS[sid];
    if (!ach || missedRef.current.has(sid) || earnedRef.current.has(ach)) return;
    missedRef.current.add(sid);
    setMissed(new Set(missedRef.current));
  }, []);
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice }), [missed, missTry, fpPractice]);
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken }); // liveToken — LMS'dan (avval null, keyin keladi)
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS }); // server-progress: davom / ko'rish / toza boshlash
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));
  const recordAnswer = (idx, data) => {
    const nextA = { ...answers, [idx]: data };
    setAnswers(nextA);
    const _m = SCREEN_META[idx];
    // Q1 (19.09): UYDA (solo) maxsus test javobi ham serverga — rasmiy natijada sanalsin (oldin faqat jonli darsda
    // yuborilardi → «javobsiz»). `picked` kalitdan: server `data.correct` (birinchi urinish) ni oladi. MCQ o'zi `recordAttempt`
    // bilan yozadi — takrori serverda e'tiborsiz (on conflict do nothing). «Qaytadan» mashqida yuborilmaydi (151-qonun 6-band).
    if (_m && _m.scored && live.mode === 'solo' && !firstPassRef.current && data && (data.solved === true || data.correct === true) && !soloSentRef.current.has(idx)) {
      const key = INLINE_KEYS[_m.id];
      if (Number.isInteger(key)) { soloSentRef.current.add(idx); live.submitAnswer(idx, _m.id, key < 0 ? 0 : (data.correct ? key : (key === 0 ? 1 : 0)), !!data.correct, data.elapsedMs || 0); }
    }
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]);
  };
  const reset = () => { if (!firstPassRef.current) { firstPassRef.current = { answers, durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000) }; setFpPractice(true); } progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], missed: [...missedRef.current], firstPass: firstPassRef.current, startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned, missed, fpPractice]);

  const finishLesson = () => {
    progClear(LESSON_META.lessonId);
    live.endSession();
    const fp = firstPassRef.current; // 151-qonun 6-band: «Qaytadan» bosilgan bo'lsa — BIRINCHI o'tish natijasi ketadi
    const ans = fp ? fp.answers : answers;
    const scoredMeta = SCREEN_META.filter(s => s.scored);
    const finalMeta = scoredMeta.filter(s => s.scope === 'final');
    const scoredAnswers = SCREEN_META.map((s, i) => (s.scored ? ans[i] : null)).filter(Boolean);
    const correctAnswers = scoredAnswers.filter(a => a.correct).length;
    const finalAnswers = SCREEN_META.map((s, i) => (s.scored && s.scope === 'final' ? ans[i] : null)).filter(Boolean);
    const finalCorrect = finalAnswers.filter(a => a.correct).length;
    const payload = {
      lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle,
      durationSec: fp ? fp.durationSec : Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: scoredMeta.length, correctAnswers,
      scorePercent: scoredMeta.length ? Math.round((correctAnswers / scoredMeta.length) * 100) : 0,
      finalScore: finalCorrect, finalTotal: finalMeta.length,
      passed: finalMeta.length ? finalCorrect / finalMeta.length >= 0.6 : (scoredMeta.length ? correctAnswers / scoredMeta.length >= 0.6 : false),
      answers: SCREEN_META.map((s, i) => ans[i]).filter(Boolean),
      ...buildResultDetails({ lessonId: LESSON_META.lessonId, screenMeta: SCREEN_META, answers: ans, earned, achievements: ACHIEVEMENTS, arenaBank: QUIZ_BANK })
    };
    if (typeof onFinished === 'function') onFinished(sealPayload(LESSON_META.lessonId, payload));
  };

  // Ekran-tartibi SCREEN_META bilan bir xil (17 ta)
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, ScreenFinalTest, ScreenReflection, ScreenPodium, ScreenFlashcards, ScreenSummary];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
      <style>{`
        /* PRODUCTION: shu @import OLIB TASHLANADI — shriftlarni LMS yuklaydi (platform_contract). */
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        ${CSS_BASE}
        ${CSS_LESSON}
        ${CSS_ARENA}
        .ach-rule { margin: 8px 0 0; text-align: center; font-size: 13px; line-height: 1.4; color: ${T.ink2}; }
        .ach-rule.lost { font-style: italic; }
      `}</style>
      <AchCtx.Provider value={earned}>
      <AchMissCtx.Provider value={achMissVal}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={tr({ uz: 'Bugungi dars', ru: 'Сегодняшний урок' })} />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
            </>
          )}
        </div>
      </LiveGateCtx.Provider>
      </AchMissCtx.Provider>
      </AchCtx.Provider>
    </LangContext.Provider>
  );
}
