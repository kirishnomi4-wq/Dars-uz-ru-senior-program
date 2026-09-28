import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import HtmlCompiler, { checks as C } from '../compilator/HtmlCompiler.jsx';

const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PM M2-D3 — MUAMMONI QANDAY TOPAMIZ — 2-TUR (sof PM) dars, 19 ekran
// Senariy: pm-senariylar/M2-D3-MuammoIzlash.md (GATE S 2026-09-28, metodist korrekturasi bilan).
// Misol-olam (95/96-qonun): savdo markazidagi kinoteatr — M2 modul-ipi. Ismli qahramon YO'Q (5.8).
// Imzo-vizual: «MUAMMO-REYTINGI» — qator ikki baho olgach «kuchi» chipi chiqadi va o'z o'rniga suzib o'tadi.
// Ikki baho: «Qanchalik tez-tez?» × «Qanchalik og'ir?» → ko'paytmasi «kuchi» (GATE S A4; «ball»/«jami» emas).
// Keys: K4 Airbnb — faqat havo-matras boshlanishi (Nyu-York bo'lagi M5-D8 ga qoldi).
// Infra (jonli-ball, progress, podium, arena, nishon) — PmLesson5 dan AYNAN; kontent — senariydan.
// Matn hozircha faqat UZ (oddiy satr) — RU o'tishi keyin tr({uz,ru}) ga o'raydi.
// AUDIOSIZ — ovoz yo'q, faqat matn va animatsiya.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

// PM-STUDIA identitet-pasporti (PM_DARS_ETALON 1-bo'lim) — sovuq-indigo studiya.
const T = {
  bg: '#F2F0FA', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4',
  paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', accentVivid: '#6E4BFF',
  success: '#12A968', successSoft: '#E4F5EC', blue: '#0E86C4', blueSoft: '#E1F3FB', link: '#5B3DE6',
  line: '#E7E3F4', err: '#E5484D', errSoft: '#FCE7E8',
  shadowBase: '40, 34, 82'
};
const CODE = { bg: '#1A2436', text: '#E8E5DD', tag: '#FF7755', attr: '#FFD380', str: '#7DD181', comment: '#6B7585', punct: '#9FB4D8' };


// Jonli dars (live) — umumiy modul: src/live/ (hook + darvoza + belgi + mijoz + server-progress). Inline nusxa 2026-09-03 da ko'chirildi.
import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers, setLiveLang , buildResultDetails, sealPayload, useAutoNext } from '../live/index.js';







const LangContext = createContext('uz');
const MentorCtx = createContext(null);
const AchCtx = createContext(null); // 🏅 olingan nishonlar (Set) — Stage hisoblagichi uchun
const AchMissCtx = createContext(null); // 🏅 151-qonun: { missed:Set<ekran id>, miss(idx), practice } — birinchi urinish + «Qaytadan» mashq-o'tishi

// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};
// Analitika/ball payloadi DOIM UZ-etalon (RU_I18N_SPEC 4-bo'lim)
const uzOf = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return '';
  return node.uz ?? node.ru ?? '';
};

// Praktika signal-zonasi (12-qonun): test <100 · arena 100+ · praktika 500+screen
const PRACTICE_BASE = 500;

// ===== 🏅 ACHIEVEMENTS (nishonlar) — dars davomidagi HAQIQIY harakatlar uchun =====
const ACHIEVEMENTS = {
  problemHunter: { icon: '🔎', name: 'Problem Hunter!', desc: "O'z atrofingizdan o'nta muammo yozdingiz." },
  rankBuilder:   { icon: '📊', name: 'Rank Builder!',   desc: "O'nta muammongizga baho qo'yib, reyting tuzdingiz." },
  sharpEye:      { icon: '👁', name: 'Sharp Eye!',      desc: "Uch sharhning bahosini birinchi urinishda to'g'ri qo'ydingiz." },
  topList:       { icon: '📋', name: 'Top List!',       desc: 'Eng kuchli muammolaringizni tartib bilan sahifaga chiqardingiz.' },
};
// Ekran id → nishon — FAQAT real tekshiriladigan harakatga (recordAnswer'da avtomatik beriladi).
const ACH_TRIGGERS = { s8: 'problemHunter', s9: 'rankBuilder', s11: 'sharpEye', s12: 'topList' };

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

// ===== IKONKALAR =====
const sv = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ico = {
  check: (n = 18) => (<svg viewBox="0 0 24 24" width={n} height={n} {...sv} strokeWidth={2.3}><path d="M20 6L9 17l-5-5" /></svg>),
};

const LESSON_META = { lessonId: 'pm-m2d3-v1', lessonTitle: { uz: 'Muammoni qanday topamiz', ru: 'Как искать проблему' } };
const HW_TOKENS = [
  { t: 'kuzatuv', l: 8, tp: 22, s: 13, d: 6 },
  { t: 'sharh', l: 68, tp: 16, s: 12, d: 7.5 },
  { t: 'muammo', l: 24, tp: 70, s: 12, d: 8.5 },
  { t: 'kuchi', l: 78, tp: 68, s: 13, d: 6.8 }
];
// SCREEN_INTENTS (PM_PIPELINE): bola shu ekranda nima QILADI / BILADI — bir qatordan.
const SCREEN_INTENTS = {
  s0: "Ikki sharhdan kinoteatr egasiga foydaliroq bittasini tanlaydi va nega aynan u ekanini ko'radi",
  s1: "10 qatorli muammo-ro'yxat baho olib, o'zi qayta tizilishini kuzatadi — dars natijasini oldindan ko'radi",
  s2: "Foyedagi 4 lahzani vaqt bo'yicha ochib, muammo odamning QILGAN ISHIDA ko'rinishini va uch belgini biladi",
  s3: 'Yangi lahzada qaysi belgi borligini topadi',
  s4: "Yulduz-surgichni 5 dan 1 gacha surib, muammo past yulduzli va sababi yozilgan sharhda ekanini ko'radi",
  s5: "To'rt yangi sharhdan muammoni aniq aytganini tanlaydi",
  s6: "Uch muammoning ikki bahosini ochib, kuchi qanday chiqishini va tez-tez VA og'ir muammo birinchi turishini biladi",
  s7: "Airbnb matras-voqeasini 2 bashorat bilan ochadi: muammo o'z shahrida ko'rilgan",
  s8: "O'z atrofidan 10 muammoni BITTALAB yozadi",
  s9: "O'z 10 muammosiga ikki baho qo'yadi — reyting jonli qayta tiziladi",
  s10: 'Ikki yangi muammodan qaysi biridan boshlashni tanlaydi',
  s11: "Uch sharhning so'zlariga qarab ikki bahoni o'zi qo'yadi — xato bo'lsa qaysi so'zga qarashni biladi",
  s12: "Eng kuchli uchta muammosini <ol> da kuchi kamayib boradigan tartibda yozadi va birinchisini CSS klass bilan ajratadi",
  s13: "Qaysi dalil muammo borligini ko'rsatishini tanlaydi",
  s14: 'Eng kuchli muammosini sherigiga yoddan aytadi, keyin bir qator yozadi',
  s15: "Sinf/shaxsiy natijani ko'radi",
  // s16 (arena) — alohida ekran EMAS: CodeStrike yakun sahifasi ichida (jsx-lint, P0 etaloni)
  s17: '10 kartani aylantiradi',
  s18: "Yakun-ro'yxatini, uy vazifasi kartasini ko'radi va 12 savolli CODE STRIKE arenasini o'ynaydi",
};
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 's2',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's3',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's4',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',  type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'case',        template: 'custom',   scored: false, scope: null },
  { id: 's8',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's9',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's10', type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's11', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's12', type: 'koding',      template: 'custom',   scored: false, scope: null },
  { id: 's13', type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's14', type: 'reflection',  template: 'custom',   scored: false, scope: null },
  { id: 's15', type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 's17', type: 'review',      template: 'custom',   scored: false, scope: null },
  { id: 's18', type: 'summary',     template: 'custom',   scored: false, scope: null }
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// ===== ARTEFAKT ZANJIRI =====
// Kirish: yo'q (jim). Chiqish: pm-m2d3-muammolar = { muammolar: [{ matn, tez: 1|2|3, ogir: 1|2|3 } × 10], savedAt }.
// Kuchi saqlanmaydi — tez * ogir dan olinadi; tartib — yozilgan tartib (reyting ekranda tuziladi).
const MUAMMOLAR_KEY = 'pm-m2d3-muammolar';
const HOOK_KEY = 'pm-m2d3-hook-choice';
const SURGICH_KEY = 'pm-m2d3-surgich';
const DALIL_KEY = 'pm-m2d3-dalil';
const KODING_KEY = 'pm-m2d3-koding';
const HW_KEY = 'pm-m2d3-hw';
const REFLECT_KEY = 'pm-m2d3-reflection';
const MUAMMO_N = 10;

const readMuammolar = () => {
  try {
    const v = JSON.parse(localStorage.getItem(MUAMMOLAR_KEY) || 'null');
    const arr = v && Array.isArray(v.muammolar) ? v.muammolar : [];
    return arr.filter(m => m && typeof m.matn === 'string').map(m => ({ matn: m.matn, tez: [1, 2, 3].includes(m.tez) ? m.tez : 0, ogir: [1, 2, 3].includes(m.ogir) ? m.ogir : 0 }));
  } catch { return []; }
};
const writeMuammolar = (arr) => { try { localStorage.setItem(MUAMMOLAR_KEY, JSON.stringify({ muammolar: arr, savedAt: Date.now() })); } catch {} };
const readJson = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const writeJson = (k, o) => { try { localStorage.setItem(k, JSON.stringify(o)); } catch {} };

// Ikki baho — hamma yuzada bir xil yorliq va darajalar (senariy 0.1)
const TEZ_OPTS = [{ v: 1, t: 'Kamdan-kam' }, { v: 2, t: 'Ba\'zan' }, { v: 3, t: 'Tez-tez' }];
const OGIR_OPTS = [{ v: 1, t: 'Biroz noqulay' }, { v: 2, t: 'Vaqt yoki pul ketadi' }, { v: 3, t: 'Kerakli ishini qilolmaydi' }];
const TEZ_Q = 'Qanchalik tez-tez?';
const OGIR_Q = "Qanchalik og'ir?";
const kuchOf = (m) => (m && m.tez && m.ogir ? m.tez * m.ogir : 0);
// Reyting: kuchi bo'yicha kamayib boradi, teng kuchida yozilgan tartib saqlanadi
const rankOrder = (rows) => rows.map((r, i) => ({ r, i })).sort((a, b) => (kuchOf(b.r) - kuchOf(a.r)) || (a.i - b.i)).map(x => x.i);
const topThree = (rows) => rankOrder(rows).filter(i => kuchOf(rows[i]) > 0).slice(0, 3).map(i => rows[i]);

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
  if (gate && gate.live && gate.live.mode === 'mentor') return null; // 🔴 mentor proyektorida nishon YO'Q (hooklardan KEYIN)
  return (
    <div className="ach-cnt-wrap">
      <button className={`ach-counter ${bump ? 'bump' : ''} ${count > 0 ? 'has' : ''}`} onClick={() => setOpen(o => !o)} aria-label={tr({ uz: 'Badges', ru: 'Значки' })} title={tr({ uz: 'Badges', ru: 'Значки' })}>
        <span className="ach-cnt-ic">🏅</span><b>{count}</b><span className="ach-cnt-tot">/{total}</span>
      </button>
      {open && (
        <div className="ach-pop" onMouseLeave={() => setOpen(false)}>
          <div className="ach-pop-h">🏅 Badges — {count}/{total}</div>
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
  const padH = isMobile ? 12 : 60; // InternetLesson layout standarti: 1100px + 60px
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
const NavNext = ({ disabled, label, onClick, optionalLive }) => {
  const lbl = label || tr({ uz: 'Davom etish', ru: 'Продолжить' });
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  return <button className="btn-white-accent" disabled={(freeRide ? false : disabled) || locked} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : undefined} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : (freeRide && disabled ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : lbl)}</button>;
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


// ===== 📖 QAYTA TUSHUNTIRISH (recap) — jonli darsda mentor past natijada ochadi =====
const RECAP_NEED_PCT = 60;   // shundan past — qayta tushuntirish TAVSIYA etiladi
const RECAP_GOOD_PCT = 75;   // shundan yuqori — sinf o'zlashtirdi, bemalol davom
const RECAP_MIN_ANSWERS = 3; // foizga ishonch uchun kamida shuncha javob kerak
// ============================================================
// 📖 QAYTA TUSHUNTIRISH (recap) — test natijasi past chiqsa mentor proyektorda
// ochib, og'zaki qayta tushuntiradi (server sinxronsiz — o'quvchilar qulflangan,
// proyektorga qaraydi). Xato qilgan o'quvchi o'z qurilmasida ham ochishi mumkin.
// Kalitlar — scored test ekranlarining indekslari (4, 7, 10, 14).
// F-0803-22: uy-vazifa ekrani (14) olib tashlangach yakuniy test 15 → 14 ga surildi;
// Q_LABELS bilan bir xil migratsiya (avval faqat Q_LABELS ko'chirilib, RECAPS 15 da qolib ketgan edi).
// Har karta: ic (katta emoji), h (sarlavha), body (1-2 gap), vis (ko'rgazma),
// ask (mentor sinfga og'zaki beradigan savol — jonli muloqot uchun).
// ============================================================
const RcFlow = ({ items, sep = '→' }) => (
  <div className="rc-flow">{items.map((t, i) => <React.Fragment key={i}><span className="rc-chip">{t}</span>{sep && i < items.length - 1 && <span className="rc-arr">{sep}</span>}</React.Fragment>)}</div>
);
// RECAPS — har karta AYNAN o'z testining mavzusini qayta tushuntiradi (kalit = scored ekran indeksi: 3 · 5 · 10 · 13)
const RECAPS = {
  3: {
    title: 'Uch belgi',
    cards: [
      { ic: '👀', h: 'Odam aytmaydi — qiladi', body: <>Hech kim «menda muammo bor» demaydi. Muammoni odamning <b>qilgan ishi</b> ko'rsatadi.</> },
      { ic: '🔎', h: 'Uch belgi', body: <>Qayta-qayta bo'ladi · odam o'zicha yo'l topgan · odam voz kechgan. <b>Bittasi bo'lsa ham</b> — o'sha joyda muammo bor.</>,
        vis: <RcFlow items={["Qayta-qayta bo'ladi", "Odam o'zicha yo'l topgan", 'Odam voz kechgan']} sep="·" /> },
      { ic: '💪', h: 'Eng ishonchli belgi', body: <>Odam boshqa yo'l qidirgan bo'lsa (qo'ng'iroq qildi, birovdan so'radi) — u <b>rostdan qiynalgan</b>.</> },
    ]
  },
  5: {
    title: 'Kerakli sharh',
    cards: [
      { ic: '⭐', h: 'Maqtov yordam bermaydi', body: <>«Juda yoqdi!» yoqimli, lekin undan <b>nimani tuzatish kerakligi</b> bilinmaydi.</> },
      { ic: '❔', h: 'Sababsiz shikoyat ham', body: <>«Juda yomon» deyilgan, lekin nima yomonligi yozilmagan bo'lsa — egasi qayerni tuzatishni bilmaydi.</> },
      { ic: '🎯', h: 'Kerakli sharh', body: <>Past yulduzli va <b>sababi aniq yozilgan</b> sharh — tayyor muammo.</> },
    ]
  },
  10: {
    title: 'Qaysi biridan boshlash',
    cards: [
      { ic: '❓', h: 'Ikki savol', body: <>Har muammoga ikki savol: <b>qanchalik tez-tez</b> bo'ladi va <b>qanchalik og'ir</b>.</> },
      { ic: '✖️', h: "Ko'paytiramiz", body: <>Ikki bahoni ko'paytiramiz: 3 marta 2 — <b>kuchi 6</b>.</> },
      { ic: '📅', h: "Og'ir, lekin kamdan-kam", body: <>Yilda bir marta bo'ladigan og'ir muammoning kuchi past chiqadi. <b>Tez-tez bo'ladigan va og'ir</b> muammo oldinda turadi.</> },
    ]
  },
  13: {
    title: 'Muammoga dalil',
    cards: [
      { ic: '💬', h: 'Fikr — dalil emas', body: <>«Kinoteatrlar zerikarli» degan bir kishining gapi <b>nima buzilganini</b> aytmaydi.</> },
      { ic: '👣', h: 'Qilingan ish — dalil', body: <>Odamlar bir savolni qayta-qayta bersa, o'zicha yo'l topsa yoki voz kechsa — <b>shu dalil</b>.</> },
      { ic: '🔁', h: 'Chatdagi takror savol', body: <>Bir xil savolni har hafta turli odamlar yozsa, uning javobi <b>hech qayerda yo'q</b>.</> },
    ]
  },
};

// Overlay — ekran ustida (indekslarga tegmaydi)
// Overlay — ekran USTIDA ochiladi (indekslarga tegmaydi), slayd-slayd o'tiladi.
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
        {card.vis && <div className="rc-vis">{tr(card.vis)}</div>}
        {card.ask && <div className="rc-ask">{tr({ uz: '🗣️ Sinfga savol: ', ru: '🗣️ Вопрос классу: ' })}{tr(card.ask)}</div>}
      </div>
      <div className="rc-nav">
        <button className="rc-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущая' })}</button>
        <div className="rc-dots">{rc.cards.map((_, k) => <button key={k} className={`rc-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={`${k + 1}`} />)}</div>
        {last
          ? <button className="rc-btn done" onClick={onClose}>{tr({ uz: '✓ Tushunarli — davom etamiz', ru: '✓ Понятно — продолжаем' })}</button>
          : <button className="rc-btn" onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Дальше →' })}</button>}
      </div>
    </div>
  );
}

// ===== MENTOR STATISTIKASI (jonli test paneli — InternetLesson bilan bir xil) =====
const MSTATS_COLORS = ['#019ACB', '#8B5CF6', '#E8A13A', '#E0559A']; // A B C D — brend-neytral
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
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Ответили все' }) : <>{tr({ uz: 'Javob berdi:', ru: 'Ответили:' })} <b>{answered}</b> / {total}</>}</span>
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>{tr({ uz: 'Natijani ochish', ru: 'Открыть результат' })}</button>}
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((answered / total) * 100) : 0}%` }} /></div>
      {reveal ? (
        <div className="mstats-big">
          <div className="mstats-chip okc"><span className="mstats-chip-n">{ok}</span><span className="mstats-chip-t">{tr({ uz: "to'g'ri ✅", ru: 'верно ✅' })}</span></div>
          <div className="mstats-chip badc"><span className="mstats-chip-n">{bad}</span><span className="mstats-chip-t">{tr({ uz: 'xato ❌', ru: 'ошибка ❌' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ждём ⏳' })}</span></div>
        </div>
      ) : (
        <div className="mstats-big">
          <div className="mstats-chip ansc"><span className="mstats-chip-n">{answered}</span><span className="mstats-chip-t">{tr({ uz: 'javob berdi 📨', ru: 'ответили 📨' })}</span></div>
          <div className="mstats-chip waitc"><span className="mstats-chip-n">{total - answered}</span><span className="mstats-chip-t">{tr({ uz: 'kutilmoqda ⏳', ru: 'ждём ⏳' })}</span></div>
        </div>
      )}
      {!reveal && answered > 0 && (
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yashirin — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и сколько ✅/❌ — скрыто. Нажмёте «Открыть результат» — откроется сразу и у вас, и на экранах учеников.' })}</p>
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
            {level === 'need' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlab oling.</>, ru: <>⚠️ Верно только <b>{pct}%</b> — тему класс не понял. Перед тем как идти дальше, коротко повторите.</> })}</p>
              {onOpenRecap && <button className="rc-open" onClick={onOpenRecap}>{tr({ uz: 'Qayta tushuntirish — ', ru: 'Объяснить заново — ' })}{tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
            {level === 'maybe' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. При желании коротко повторите перед тем, как идти дальше.</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: 'Qisqa takrorlash', ru: 'Короткое повторение' })}</button>}
            </>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс тему усвоил. Спокойно идите дальше!</> })}</p>}
            {level === 'few' && <>
              <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang:</>, ru: <>Ответивших мало ({answered}) — по процентам вывод делать сложно. Оцените сами:</> })}</p>
              {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: 'Qayta tushuntirish — ', ru: 'Объяснить заново — ' })}{tr(RECAPS[screenIdx]?.title)}</button>}
            </>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Qayta tushuntiring.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Объясните заново.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь вживую…' })}</p>}
    </div>
  );
}

// AUDIOSIZ dars — useAudio/getAudioEngine zaglushkasi (QuestionScreen imzosi saqlanadi, TTS yo'q)
const getAudioEngine = () => null;
const useAudio = () => ({ muted: true, isPlaying: false, currentSegment: null, triggerEvent: () => {}, replay: () => {}, toggleMute: () => {} });

// `backtick` atamalarni kod-chip sifatida ko'rsatadi (savol/variant/izoh/arena)
const fmtCode = (s) => (typeof s === 'string' && s.includes('`'))
  ? s.split('`').map((p, i) => i % 2 ? <code className="qcode" key={i}>{p}</code> : p)
  : s;

const QuestionScreen = ({ screen, scope, eyebrow, question, questionText, payloadQuestion, payloadOptions, options, correctIdx, explainCorrect, explainWrong, audioText, audioOk, audioWrong, storedAnswer, onAnswer, onNext, onPrev }) => {
  const _am = useContext(AchMissCtx);
  const fpPractice = !!(_am && _am.practice); // 151-qonun 6-band: «Qaytadan» mashq-o'tishi — hech qayerga yozilmaydi
  const audio = useAudio(audioText ? [{ id: `s${screen}_intro`, text: audioText, trigger: 'on_mount', waits_for: { type: 'option_picked' } }] : null);
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const oneShot = !!(live && live.mode === 'student'); // jonli dars: BITTA urinish — xato bo'lsa ham qotadi
  const isMentorLive = !!(live && live.mode === 'mentor');
  const mountTs = useRef(Date.now()); // tezlik: savol ochilgandan bosishgacha (teng ballda hal qiladi)
  const [picked, setPicked] = useState(storedAnswer?.lastPicked ?? storedAnswer?.picked ?? null);
  const [solved, setSolved] = useState(storedAnswer ? (storedAnswer.solved ?? (storedAnswer.picked === correctIdx)) : false);
  const firstCorrectRef = useRef(storedAnswer ? (storedAnswer.firstAttemptCorrect ?? storedAnswer.correct ?? null) : null);
  // MENTOR (proyektor): o'zi javob BERMAYDI — statistikani kuzatadi, «Natijani ochish»
  // bosganda to'g'ri javob + izoh katta ekranda ochiladi, shundan keyin davom etadi.
  const [mReveal, setMReveal] = useState(() => !!(isMentorLive && storedAnswer));
  // 📖 Qayta tushuntirish (recap) — natija past chiqsa mentor ochadi; o'quvchi xato qilsa o'zi ham ochishi mumkin
  const [recapOpen, setRecapOpen] = useState(false);
  const hasRecap = !!RECAPS[screen];
  // «Natijani ochish» — proyektorda ham, BARCHA o'quvchilar ekranida ham birdan ochiladi (Kahoot reveal)
  const doReveal = () => { setMReveal(true); if (live) live.mentorReveal(screen); if (storedAnswer === undefined) onAnswer(screen, { mentorRevealed: true }); };
  // Mentor sahifani yangilagan bo'lsa — reveal holati serverdan tiklanadi
  const liveRevealScreen = live ? live.revealScreen : -1;
  useEffect(() => { if (isMentorLive && liveRevealScreen === screen) setMReveal(true); }, [isMentorLive, liveRevealScreen, screen]);
  const pick = (i) => {
    if (solved || isMentorLive) return;
    const isCorrect = i === correctIdx;
    setPicked(i);
    if (firstCorrectRef.current === null) firstCorrectRef.current = isCorrect; // ball: 1-urinishni qotirib qo'yamiz
    if (oneShot) {
      // Jonli dars: javob darhol qotadi (to'g'ri ham, xato ham) va serverga yoziladi
      setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: pQ, options: pOpts, correctIndex: correctIdx, correctAnswer: pOpts[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: pOpts[i], correct: isCorrect, firstAttemptCorrect: isCorrect, solved: true, lastPicked: i });
      if (!fpPractice) live.submitAnswer(screen, SCREEN_META[screen]?.id || `s${screen}`, i, isCorrect, Date.now() - mountTs.current);
    } else {
      if (isCorrect) setSolved(true);
      onAnswer(screen, { stage: scope, screenIdx: screen, question: pQ, options: pOpts, correctIndex: correctIdx, correctAnswer: pOpts[correctIdx], picked: i, studentAnswerIndex: i, studentAnswer: pOpts[i], correct: firstCorrectRef.current, firstAttemptCorrect: firstCorrectRef.current, solved: isCorrect, lastPicked: i });
    }
    // Har urinish tarixga (LMS analitika, 0005): ball emas, yozuv; modulsiz eski darsda recordAttempt yo'q
    if (live && live.recordAttempt && !fpPractice) live.recordAttempt(screen, SCREEN_META[screen]?.id || `s${screen}`, i, Date.now() - mountTs.current, { question: pQ, options: pOpts, picked: pOpts[i], correct: pOpts[correctIdx], lang: (typeof __lang !== 'undefined' && __lang === 'ru') ? 'ru' : 'uz' });
    if (audioText) { audio.triggerEvent('option_picked'); if (!audio.muted) setTimeout(() => { const e = getAudioEngine(); if (e && !audio.muted) e.pushOneOff(isCorrect ? (audioOk || "To'g'ri.") : (audioWrong || "Unchalik emas. Qaytadan urinib ko'ring.")); }, 300); }
  };
  const pOpts = payloadOptions || options;
  const pQ = payloadQuestion || questionText;
  const wrongLocked = oneShot && solved && picked !== correctIdx; // jonli darsda xato bosib qotgan
  // KAHOOT REVEAL: jonli darsda javob bosilgach to'g'ri/XATO ham sir saqlanadi —
  // faqat «javob qabul qilindi» ko'rinadi. Mentor «Natijani ochish»ni bosganda
  // (reveal_screen) yoki keyingi sahifaga o'tganda / dars tugaganda hammada birdan ochiladi.
  // Erkin rejimda (ended / mentor uzilgan / self) natija darhol ko'rinadi.
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytganda allaqachon ochilgan javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed; // javob qotdi — natija mentordan kutilmoqda
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow audioState={audioText ? audio : undefined} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (oneShot ? tr({ uz: 'Javob tanlang', ru: 'Выберите ответ' }) : tr({ uz: "To'g'ri javobni toping", ru: 'Найдите верный ответ' }))} onClick={onNext} /></>}>
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'safe center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "⚡ Jonli dars — bitta urinish, o'ylab bosing!", ru: '⚡ Живой урок — одна попытка, жмите обдуманно!' })}</p>}
        <div className="fade-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: picked !== null ? 8 : 11 }}>
          {options.map((opt, i) => {
            let cls = 'option';
            if (isMentorLive) {
              if (mReveal) { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; } // reveal'gacha hammasi neytral — proyektorda sir saqlanadi
            } else if (solved) {
              if (waiting) { if (i === picked) cls += ' option-wait'; } // faqat neytral belgi — to'g'ri/xato hali sir
              else { if (i === correctIdx) cls += ' option-correct'; else cls += ' option-wrong'; if (wrongLocked && i === picked) cls += ' option-picked-wrong'; }
            }
            else if (i === picked) cls += ' option-picked-wrong';
            const showGreenLetter = isMentorLive ? (mReveal && i === correctIdx) : (solved && revealed && i === correctIdx);
            return (
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={{ padding: picked !== null ? 'clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px)' : 'clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)', fontSize: 'clamp(15px,1.85vw,17px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono small" style={{ minWidth: 20, color: showGreenLetter ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{fmtCode(opt)}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? tr({ uz: `✓ To'g'ri javob: ${String.fromCharCode(65 + correctIdx)}`, ru: `✓ Верный ответ: ${String.fromCharCode(65 + correctIdx)}` })
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? fmtCode(tr({ uz: `To'g'ri javob: ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}`, ru: `Верный ответ: ${String.fromCharCode(65 + correctIdx)} — ${options[correctIdx]}` }))
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? fmtCode(explainCorrect)
              : waiting
                ? tr({ uz: "📨 Javobingiz qabul qilindi. Hozir to'g'ri javobni bilib olasiz.", ru: '📨 Ваш ответ принят. Сейчас узнаете верный ответ.' })
                : wrongLocked
                  ? fmtCode(explainWrong[picked] ?? explainWrong.default)
                  : solved ? fmtCode(explainCorrect) : fmtCode(explainWrong[picked] ?? explainWrong.default)}
          </p>
          {/* Xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi (3-qadamda kontent keladi).
              Jonli darsda — javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */}
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
        <span className="mentor-name">Mentor{collapsed && <span className="mentor-cue"> {tr({ uz: "· ko'rsatmani ochish ▾", ru: '· открыть подсказку ▾' })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

const Q = ({ children, max = 760 }) => <h2 className="title h-ask fade-up" style={{ maxWidth: max }}>{children}</h2>;
const Zoomable = ({ children }) => {
  const [big, setBig] = useState(false);
  // bo'sh ustunda ⛶ va yorliq yolg'iz osilmasin (F-0926-01, 111-qonun): mazmun DOM bo'yicha o'lchanadi
  const zref = useRef(null);
  const [hasContent, setHasContent] = useState(true);
  useEffect(() => {
    const el = zref.current; if (!el) return;
    const kids = [...el.childNodes].filter(n => !(n.nodeType === 1 && n.classList.contains('zoom-btn')));
    const c = kids.some(n => (n.textContent || '').trim().length > 0 || (n.nodeType === 1 && n.querySelector('img,svg,canvas,input,textarea,video,iframe,button')));
    if (c !== hasContent) setHasContent(c);
  });
  useEffect(() => {
    if (!big) return;
    const onKey = (e) => { if (e.key === 'Escape') setBig(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [big]);
  return (
    <>
      {big && <div className="zoom-backdrop" onClick={() => setBig(false)} />}
      <div ref={zref} className={`zoomable ${big ? 'zoom-on' : ''}${hasContent ? '' : ' z-empty'}`}>
        {hasContent && <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })} title={big ? tr({ uz: 'Kichraytirish', ru: 'Уменьшить' }) : tr({ uz: 'Kattalashtirish', ru: 'Увеличить' })}>{big ? '✕' : '⛶'}</button>}
        {children}
      </div>
    </>
  );
};

// ============================================================
// MENTORGA ESLATMA — proyektor-sir (5-qonun): default yopiq xira chip.
// Faqat zarur ekranlarda: sir-saqlash · baholash-mezoni · vaqt-qoidasi · tekshirish-qoidasi.
// ============================================================
const MentorNote = ({ children }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const [open, setOpen] = useState(false);
  if (!live || live.mode !== 'mentor') return null;
  if (!open) return (
    <button type="button" className="mnote-chip" onClick={() => setOpen(true)} title={tr({ uz: 'Mentorga eslatma — bosib oching', ru: 'Заметка ментору — нажмите' })}>{tr({ uz: '📋 Eslatma', ru: '📋 Заметка' })}</button>
  );
  return (
    <div className="mnote fade-up" onClick={() => setOpen(false)} title={tr({ uz: 'Yopish uchun bosing', ru: 'Нажмите, чтобы закрыть' })}>
      <span className="mnote-lbl">{tr({ uz: '🧑‍🏫 Mentorga eslatma', ru: '🧑‍🏫 Заметка ментору' })}<span className="mnote-x">{tr({ uz: '✕ yopish', ru: '✕ закрыть' })}</span></span>
      <p className="mnote-body">{children}</p>
    </div>
  );
};

// Mentor paneli: kim bajardi (3s polling, PRACTICE_BASE zonasi)
const MentorPracticeStats = ({ live, screen, label }) => {
  const [data, setData] = useState({ players: null, rows: [] });
  const isMentor = !!(live && live.mode === 'mentor' && live.pin);
  const pin = live ? live.pin : null;
  useEffect(() => {
    if (!isMentor) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, answers] = await Promise.all([livePlayers(pin), liveAnswers(pin, PRACTICE_BASE + screen)]);
        if (on) setData({ players, rows: answers });
      } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [isMentor, pin, screen]);
  if (!isMentor || data.players === null) return null;
  const total = data.players.length;
  const doneIds = new Set(data.rows.map(r => r.player_id));
  const doneN = doneIds.size;
  const allIn = total > 0 && doneN >= total;
  return (
    <div className="mstats fade-up">
      <div className="mstats-head">
        <span className="mstats-lbl">{label || tr({ uz: '👀 Kim bajardi', ru: '👀 Кто выполнил' })}</span>
        <span className="mstats-n">{allIn ? tr({ uz: "✓ Hamma bajardi!", ru: '✓ Все выполнили!' }) : <>{tr({ uz: 'Bajardi: ', ru: 'Выполнили: ' })}<b>{doneN}</b> / {total}</>}</span>
      </div>
      <div className="mstats-prog"><span className={`mstats-prog-fill ${allIn ? 'full' : ''}`} style={{ width: `${total ? Math.round((doneN / total) * 100) : 0}%` }} /></div>
      {total > 0 && (
        <div className="mstats-waitrow">
          {data.players.map(p => <span key={p.id} className="mstats-wait-chip" style={doneIds.has(p.id) ? { background: T.successSoft, color: T.success, fontWeight: 700 } : undefined}>{doneIds.has(p.id) ? '✓ ' : '✏️ '}{p.nickname}</span>)}
        </div>
      )}
      {doneN === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar bajarishi bilan shu yerda ✓ belgisi chiqadi…", ru: 'Как только ученики выполнят, здесь появится ✓…' })}</p>}
    </div>
  );
};

// O'quvchiga sinf-pulsi (45-qonun): ismlarsiz, faqat son; mentor rejimida ko'rinmaydi
const StudentPracticePulse = ({ live, screen }) => {
  const isStudent = !!(live && live.mode === 'student' && live.pin);
  const pin = live ? live.pin : null;
  const [st, setSt] = useState({ total: 0, done: 0, ok: false });
  useEffect(() => {
    if (!isStudent) return;
    let on = true, t = null;
    const tick = async () => {
      try {
        const [players, answers] = await Promise.all([livePlayers(pin), liveAnswers(pin, PRACTICE_BASE + screen)]);
        if (on) setSt({ total: players.length, done: new Set(answers.map(a => a.player_id)).size, ok: true });
      } catch {}
      if (on) t = setTimeout(tick, 4000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [isStudent, pin, screen]);
  if (!isStudent || !st.ok || st.total === 0) return null;
  const busy = Math.max(0, st.total - st.done);
  return (
    <p className="cls-pulse fade-step">{tr({ uz: '👥 Sinfda: ', ru: '👥 В классе: ' })}<b>{st.done}</b>{tr({ uz: ' bajardi · ✏️ ', ru: ' выполнили · ✏️ ' })}<b>{busy}</b>{tr({ uz: ' hali bajarmoqda', ru: ' ещё выполняют' })}</p>
  );
};

// Mentor-baypas yozuvi (31-qonun): jonli darsda mentor amaliyotni bajarmaydi
const MentorBypassLine = ({ live }) => {
  if (!live || live.mode !== 'mentor') return null;
  return <p className="mbypass">{tr({ uz: "👨‍🏫 Jonli darsda bu amaliyotni o'quvchilar bajaradi — siz kuzatasiz; «Davom etish» siz uchun ochiq", ru: '👨‍🏫 В живом уроке это задание выполняют ученики — вы наблюдаете; «Продолжить» для вас открыто' })}</p>;
};

// ============================================================
// UMUMIY: belgi-yorliq, baho-chiplari, MUAMMO-REYTINGI (s1 preview + s9 reyting)
// ============================================================
const BELGI = { takror: "Qayta-qayta bo'ladi", yol: "Odam o'zicha yo'l topgan", voz: 'Odam voz kechgan' };
const Belgi = ({ k, delay = 0 }) => <span className="bg-chip fade-step" style={{ animationDelay: `${delay}s` }}>{BELGI[k]}</span>;
const Stars = ({ n }) => <span className="stars" aria-label={`${n} yulduz`}>{'★'.repeat(n)}<span className="stars-off">{'★'.repeat(5 - n)}</span></span>;
const Dots = ({ v }) => <span className="rk-dots" aria-hidden="true">{[1, 2, 3].map(k => <i key={k} className={k <= v ? 'on' : ''} />)}</span>;
const useReduced = () => useMemo(() => { try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch { return false; } }, []);

// Imzo-vizual: qatorlar absolute; o'rni translateY bilan — reyting o'zgarsa qator SUZIB o'tadi (FLIP o'rniga transition)
const RANK_ROW_H = 46;
const RankList = ({ items, sorted = true, onPick, activeId, showScores = true }) => {
  const order = sorted ? rankOrder(items) : items.map((_, i) => i);
  const pos = {}; order.forEach((ri, p) => { pos[ri] = p; });
  const rated = items.filter(r => kuchOf(r) > 0).length;
  const topN = sorted && showScores ? Math.min(3, rated) : 0;
  return (
    <div className="rk">
      <div className="rk-head"><span>{topN > 0 ? 'Eng kuchli uchtasi' : ''}</span><span>kuchi</span></div>
      <div className="rk-list" style={{ height: Math.max(1, items.length) * RANK_ROW_H }}>
        {topN > 0 && <div className="rk-band" style={{ height: topN * RANK_ROW_H }} />}
        {items.map((r, i) => {
          const k = showScores ? kuchOf(r) : 0;
          const p = pos[i];
          return (
            <div key={r.id ?? i} className={`rk-row ${k ? 'rated' : ''} ${activeId !== undefined && activeId === (r.id ?? i) ? 'act' : ''}`} style={{ transform: `translateY(${p * RANK_ROW_H}px)`, '--rd': `${i * 0.12}s` }}>
              <span className="rk-n">{p + 1}</span>
              <span className="rk-t">{r.matn}</span>
              {k > 0 && <span className="rk-sc"><Dots v={r.tez} /><Dots v={r.ogir} /></span>}
              {k > 0 && <span className="rk-k">{k}</span>}
              {onPick && k > 0 && <button type="button" className="rk-redo" onClick={() => onPick(r.id ?? i)} aria-label="Bahoni o'zgartirish" title="Bahoni o'zgartirish">↻</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// EKRAN 0 — HOOK: ikki sharhdan qaysi biri kinoteatr egasiga ko'proq yordam beradi (ovoz-berish + payoff)
// ============================================================
const HOOK_OPTS = [
  { id: 'a', stars: 5, t: 'Juda yaxshi kinoteatr, hammaga maslahat beraman!' },
  { id: 'b', stars: 2, t: "Saytdagi seans vaqti eski turibdi. Ikki marta keldim — ikkalasida ham film boshlanib ketgan ekan." },
];
const ScrHook = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentorLive = !!(live && live.mode === 'mentor');
  const [picked, setPicked] = useState(storedAnswer?.picked ?? null);
  const [mReveal, setMReveal] = useState(false);
  const revealed = isMentorLive ? mReveal : picked !== null;
  const pick = (id) => {
    if (picked !== null || isMentorLive) return;
    setPicked(id);
    try { localStorage.setItem(HOOK_KEY, id); } catch {}
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: id, correct: true });
  };
  const payoff = picked === 'a' && !isMentorLive
    ? <>Maqtov yoqimli, lekin undan nimani tuzatishni bilib bo'lmaydi. B-sharh esa aytadi: <b>seans vaqti eski, odam ikki marta kechikdi.</b></>
    : <>Topdingiz! B-sharh nima buzilganini aytadi: <b>seans vaqti eski, odam ikki marta kechikdi.</b></>;
  return (
    <Stage eyebrow="Kirish" screen={screen}
      navContent={<NavNext optionalLive disabled={isMentorLive ? !mReveal : picked === null} label={isMentorLive ? (mReveal ? 'Davom etish' : 'Avval natijani oching') : (picked === null ? 'Bitta sharhni tanlang' : 'Davom etish')} onClick={onNext} />}>
      <div className="screen">
        <h1 className="title h-title fade-up">Kinoteatr egasi saytni yangilamoqchi. Qaysi sharh unga <span className="italic" style={{ color: T.accent }}>ko'proq yordam</span> beradi?</h1>
        {revealed
          ? <Mentor>{payoff}</Mentor>
          : <Mentor>Savdo markazidagi kinoteatr saytida ikki sharh turibdi — ikkalasini o'qib, bittasini tanlang.</Mentor>}
        <MentorNote>Ovozni sanamang, muhokamani cho'zmang — «Natijani ochish» o'zi javobni ochadi. Og'zaki bir marta ayting: «sharh — ya'ni otziv».</MentorNote>
        <div className="rv-pair fade-up delay-1">
          {HOOK_OPTS.map(o => {
            const on = picked === o.id;
            const win = revealed && o.id === 'b';
            return (
              <button key={o.id} type="button" className={`rv-card ${on ? 'on' : ''} ${win ? 'win' : ''}`} disabled={picked !== null || isMentorLive} onClick={() => pick(o.id)}>
                <span className="rv-top"><b className="rv-id">{o.id.toUpperCase()}</b><Stars n={o.stars} />{win && <span className="rv-tick">✓</span>}</span>
                <span className="rv-t">«{o.t}»</span>
              </button>
            );
          })}
        </div>
        {isMentorLive && !mReveal && <button className="mstats-reveal ready" style={{ alignSelf: 'flex-start' }} onClick={() => { setMReveal(true); if (live) live.mentorReveal(screen); }}>🔓 Natijani ochish</button>}
      </div>
    </Stage>
  );
};

// ============================================================
// EKRAN 1 — MAQSAD: MUAMMO-REYTINGI jonli preview (qatorlar paydo → baho → kuchi → suzib tiziladi)
// Namuna-qatorlar s6/s11 kalitlarini oshkor qilmaydi (boshqa muammolar); reduced-motion'da darhol to'liq holat.
// ============================================================
const DEMO_ROWS = [
  { matn: 'Bufetda navbat uzun', tez: 3, ogir: 2 },
  { matn: "Bekatda soya yo'q", tez: 2, ogir: 1 },
  { matn: 'Kassada navbat uzun', tez: 2, ogir: 3 },
  { matn: "Jadval o'zgaradi", tez: 2, ogir: 2 },
  { matn: 'Zalda sovuq', tez: 1, ogir: 1 },
  { matn: "Avtobus kechikadi", tez: 3, ogir: 2 },
  { matn: 'Svetofor uzoq yonadi', tez: 3, ogir: 1 },
  { matn: 'Kitob topilmaydi', tez: 1, ogir: 2 },
  { matn: 'Chipta qaytmaydi', tez: 1, ogir: 3 },
  { matn: "Vazifa chatda yo'qoladi", tez: 3, ogir: 3 },
];
const ScrGoal = ({ screen, onNext, onPrev }) => {
  const reduced = useReduced();
  const [phase, setPhase] = useState(reduced ? 2 : 0);
  useEffect(() => {
    if (reduced) return;
    const a = setTimeout(() => setPhase(1), 2300);
    const b = setTimeout(() => setPhase(2), 3900);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [reduced]);
  return (
    <Stage eyebrow="Reja" screen={screen} mentorStatic
      navContent={<><NavBack onPrev={onPrev} /><NavNext label="Boshlaymiz →" onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Bugun atrofingizdan 10 ta muammo topasiz. Qaysi biri <span className="italic" style={{ color: T.accent }}>eng kuchli</span> chiqadi?</h2></div>
        <Mentor>Har muammo ikki baho oladi (nuqtalar): qanchalik tez-tez bo'ladi va qanchalik og'ir. Ikkalasi katta bo'lsa, muammoning <b>kuchi</b> ham katta chiqadi va u tepaga ko'tariladi.</Mentor>
        <div className={`rk-demo fade-up delay-1 ph-${phase}`}>
          <RankList items={DEMO_ROWS} sorted={phase >= 2} showScores={phase >= 1} />
        </div>
      </div>
    </Stage>
  );
};

// ============================================================
// EKRAN 2 — KUZATUV: soat-lentasi, 4 lahza bittalab; to'rttasi ochilgach belgi-yorliqlar tushadi
// (400-chegara: qoida chiqqanda oldingi lahzalar yig'iladi — faqat vaqt + yorliq; bosilsa ochiladi, qayta bosilsa yopiladi)
// ============================================================
const MOMENTS = [
  { time: '18:30', t: 'Chatda uch sinfdosh birin-ketin so\'radi: «Bugun 19:00 da qaysi film bor?»', belgi: 'takror' },
  { time: '18:45', t: "Bir yigit saytda seans vaqtini topolmay, kassaga qo'ng'iroq qildi.", belgi: 'yol' },
  { time: '18:55', t: 'Oila kassadagi uzun navbatni ko\'rib, chipta olmay ketdi.', belgi: 'voz' },
  { time: '19:05', t: 'Ikki do\'st popkorn olib, zalga kirdi.', belgi: null },
];
const ScrObserve = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const [shown, setShown] = useState(storedAnswer ? MOMENTS.length : 0);
  const [openK, setOpenK] = useState(() => new Set());
  const done = shown >= MOMENTS.length;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'kuzatuv', screenIdx: screen, correct: true }); }, [done]); // eslint-disable-line
  const toggle = (i) => setOpenK(s => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  return (
    <Stage eyebrow="Kuzatuv" screen={screen}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? 'Davom etish' : `Yana ${MOMENTS.length - shown} ta lahzani oching`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Kino oldidan odamlar <span className="italic" style={{ color: T.accent }}>nima qilyapti</span>?</h2></div>
        {done
          ? <div className="takeaway fade-step"><p className="ta-h">Uch belgidan biri bor joyda muammo bor. Eng ishonchlisi — odam o'zicha yo'l topgani.</p></div>
          : <Mentor>Odam «menda muammo bor» demaydi, buni qilgan ishi ko'rsatadi — «▶ Keyingi lahza»ni bosing.</Mentor>}
        <div className="tl fade-up delay-1">
          {MOMENTS.slice(0, shown).map((m, i) => {
            const collapsed = done && i < MOMENTS.length - 1 && !openK.has(i);
            const quiet = done && !m.belgi;
            return (
              <button key={i} type="button" className={`tl-card fade-step ${quiet ? 'quiet' : ''} ${collapsed ? 'col' : ''}`} onClick={done ? () => toggle(i) : undefined} aria-expanded={done ? !collapsed : undefined}>
                <span className="tl-time mono">{m.time}</span>
                {!collapsed && <span className="tl-t">{m.t}</span>}
                {done && m.belgi && <Belgi k={m.belgi} delay={0.1 + i * 0.15} />}
              </button>
            );
          })}
        </div>
        {!done && <button type="button" className="btn tl-next fade-up delay-2" onClick={() => setShown(s => Math.min(MOMENTS.length, s + 1))}>▶ Keyingi lahza <span className="tl-cnt mono">{shown}/{MOMENTS.length}</span></button>}
        <MentorNote>4-lahzada sinf odatda «bu yerda muammo yo'q» deydi — shu gapni tasdiqlang: muammo har joyda emas.</MentorNote>
      </div>
    </Stage>
  );
};

// ============================================================
// EKRAN 4 — SHARHLAR: yulduz-surgich 5 → 1; past yulduzda s2 belgilari o'zi yonadi
// ============================================================
const REVIEWS = {
  5: { t: 'Zal chiroyli, kreslolar qulay ekan.', belgi: [] },
  4: { t: 'Yaxshi. Faqat popkorn biroz qimmat.', belgi: [] },
  3: { t: "O'rtacha, yomon emas.", belgi: [] },
  2: { t: "Saytda chipta narxi yozilmagan. Har safar kassaga borib so'rashga to'g'ri keladi.", belgi: ['takror', 'yol'] },
  1: { t: "Sayt telefonda ochilmadi, chiptani kassadan olmoqchi bo'ldik. Navbat uzun ekan — oxiri ketib qoldik.", belgi: ['voz'] },
};
const ScrStars = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const saved = readJson(SURGICH_KEY);
  const [star, setStar] = useState(5);
  const [seen, setSeen] = useState(() => new Set(saved && Array.isArray(saved.seen) ? saved.seen : [5]));
  const done = [1, 2, 3, 4, 5].every(s => seen.has(s));
  const move = (s) => { setStar(s); setSeen(p => { const n = new Set(p); n.add(s); writeJson(SURGICH_KEY, { seen: [...n] }); return n; }); };
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'surgich', screenIdx: screen, correct: true }); }, [done]); // eslint-disable-line
  const rv = REVIEWS[star];
  return (
    <Stage eyebrow="Sharhlar" screen={screen}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? 'Davom etish' : `Surgichni ${Math.min(...[1, 2, 3, 4, 5].filter(s => !seen.has(s)))} yulduzgacha suring`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Qaysi yulduzli sharhda muammo <span className="italic" style={{ color: T.accent }}>yashiringan</span>?</h2></div>
        {done && seen.has(1) && star <= 2
          ? <div className="takeaway fade-step"><p className="ta-h">Past yulduzli, sababi yozilgan sharh — tayyor muammo.</p></div>
          : <Mentor>Maqtovdan nima buzilganini bilib bo'lmaydi — yulduz-surgichni beshdan birgacha surib, har sharhni o'qing.</Mentor>}
        <div className="sg fade-up delay-1">
          <input className="sg-range" style={{ '--fill': `${(5 - star) * 25}%` }} type="range" min={1} max={5} step={1} value={6 - star} onChange={e => move(6 - Number(e.target.value))} aria-label="Yulduz-surgich" />
          <div className="sg-scale">{[5, 4, 3, 2, 1].map(s => <button key={s} type="button" className={`sg-tick ${s === star ? 'cur' : ''} ${seen.has(s) ? 'seen' : ''}`} onClick={() => move(s)}>{s}★</button>)}</div>
          <div className="sg-card fade-step" key={star}>
            <Stars n={star} />
            <p className="sg-t">«{rv.t}»</p>
            {rv.belgi.length > 0 && <div className="bg-row">{rv.belgi.map((b, i) => <Belgi key={b} k={b} delay={0.15 + i * 0.15} />)}</div>}
          </div>
        </div>
        <MentorNote>4 yulduzdagi «popkorn qimmat» ham shikoyat — lekin undan nima qilish kerakligi bilinmaydi; savol bo'lsa shuni ayting.</MentorNote>
      </div>
    </Stage>
  );
};

// ============================================================
// TESTLAR (3 module-mikro + 1 final) — senariy 4-bo'lim; kalitlar ⚡ Jonli tasdiqlaydi
// ============================================================
const TESTS = {
  s3: {
    eyebrow: 'Mashq · 1-savol',
    q: "Kinoteatr saytida film necha soat davom etishi yozilmagan — sinfdoshingiz buni internetdan qidirib bildi. Bu lahzada qaysi belgi bor?",
    opts: ['Odam voz kechgan', "Qayta-qayta bo'ladi", "Odam o'zicha yo'l topgan", "Hech qanday belgi yo'q"],
    correct: 2,
    ok: "To'g'ri! Sayt kerakli narsani aytmadi — u boshqa yo'l bilan bilib oldi. Shu aylanma yo'l muammo borligini ko'rsatadi.",
    wrong: {
      0: 'Bilolmasa, kinodan voz kechishi mumkin edi. Lekin u qaytmadi — javobni qayerdan oldi?',
      1: "Takrorlanishi mumkin, bu rost. Lekin lahzada faqat bir marta bo'lgani ko'rinadi — takrorga hali dalil yo'q.",
      3: "Internetdan qidirish oddiy ishdek ko'rinadi. Lekin nega bu ma'lumot kinoteatr saytida yo'q?",
      default: "Odam nima qilganiga qarang: kerakli narsani qayerdan bildi?",
    },
  },
  s5: {
    eyebrow: 'Mashq · 2-savol',
    q: 'Kinoteatr egasi nimani tuzatishni bilmoqchi. Qaysi sharh unga eng ko\'p yordam beradi?',
    opts: [
      "5⭐ — «Eng yaxshi kinoteatr, doim do'stlarim bilan kelaman!»",
      '3⭐ — «O\'rtacha ekan, boshqa kinoteatrlardan farqi yo\'q.»',
      '1⭐ — «Umuman yoqmadi, hammasi juda yomon ekan!»',
      "2⭐ — «Saytda joy tanlab bo'lmaydi, har safar kassaga boraman.»",
    ],
    correct: 3,
    ok: "To'g'ri! Baho past, sababi aniq yozilgan va u har safar takrorlanadi. Bu tayyor muammo.",
    wrong: {
      0: 'Bunday sharh egasini xursand qiladi. Lekin undan nimani tuzatish kerakligi bilinmaydi.',
      1: "Baho past, bu to'g'ri. Lekin sababi yozilmagan: nima yetishmayotgani noma'lum.",
      2: 'Eng past baho — lekin nimasi yomonligi aytilmagan. Egasi qaysi joyni tuzatishni bilolmaydi.',
      default: 'Sababi aniq yozilgan sharhni qidiring.',
    },
  },
  s10: {
    eyebrow: 'Mashq · 3-savol',
    q: "Sharhlarda ikki muammo bor. 1-muammo: «Har kuni sayt telefonda ochilmaydi, chiptani kassada navbatda olasiz.» 2-muammo: «Yilda bir marta, eng mashhur film chiqqan kuni chipta bir soatda tugaydi.» Qaysi biridan boshlaysiz?",
    opts: [
      "Birinchisidan — har kuni bo'ladi, vaqt oladi",
      "Ikkinchisidan — unda odam filmni ko'rolmaydi",
      'Baravar — ikkalasida ham odam qiynaladi',
      "Ikkinchisidan — o'sha kuni odam ko'p keladi",
    ],
    correct: 0,
    ok: "To'g'ri! Birinchisi har kuni bo'ladi (3) va vaqt oladi (2) — kuchi 6. Ikkinchisi og'ir (3), lekin yilda bir marta (1) — kuchi 3.",
    wrong: {
      1: "Ikkinchisi og'irroq, bu rost. Lekin u yilda bir marta bo'ladi — ikki bahoni ko'paytirsangiz, qaysi biri katta chiqadi?",
      2: "Ikkalasida ham qiynalish bor, to'g'ri. Lekin biri har kuni, biri yilda bir marta — kuchi bir xil chiqmaydi.",
      3: "O'sha kuni odam ko'p, bu rost. Lekin savol — muammo qanchalik tez-tez va og'ir. Qaysi biri har kuni bo'ladi?",
      default: "Ikki bahoni ko'paytiring: qanchalik tez-tez va qanchalik og'ir.",
    },
  },
  s13: {
    eyebrow: 'Yakuniy savol',
    q: 'Kinoteatr sayti uchun muammo qidiryapsiz. Qaysi biri muammo borligiga dalil bo\'ladi?',
    opts: [
      'Bitta tanishingiz «kinoteatrlar zerikarli» dedi',
      'Chatda bir xil savolni har hafta turli odamlar yozyapti',
      'Besh yulduzli sharhda «hammasi yoqdi» deyilgan',
      'Sizga kinoteatr logotipi eskidek ko\'rindi',
    ],
    correct: 1,
    ok: "To'g'ri! Bir savol qayta-qayta so'ralsa, demak uning javobi hech qayerda yo'q. Shu muammo.",
    wrong: {
      0: "Odamning fikri — foydali. Lekin nimadan qiynalgani ham, necha marta bo'lgani ham aytilmagan.",
      2: 'Maqtov yoqimli. Lekin undan nima buzilgani bilinmaydi.',
      3: "O'z ko'zingiz bilan qarash — yaxshi odat. Lekin logotip hech kimni qiynamayapti: kim nimadan qiynaldi?",
      default: 'Odamlar nima QILYAPTI — shunga qarang.',
    },
  },
};
const makeTest = (key) => (props) => {
  const d = TESTS[key];
  const wrong = {};
  Object.keys(d.wrong).forEach(k => { wrong[k] = tr(d.wrong[k]); });
  return (
    <QuestionScreen {...props}
      scope={SCREEN_META[props.screen] ? SCREEN_META[props.screen].scope : null}
      eyebrow={tr(d.eyebrow)}
      question={<Q>{tr(d.q)}</Q>}
      questionText={tr(d.q)}
      payloadQuestion={uzOf(d.q)}
      options={d.opts.map(o => tr(o))}
      payloadOptions={d.opts.map(o => uzOf(o))}
      correctIdx={d.correct}
      explainCorrect={tr(d.ok)}
      explainWrong={wrong}
    />
  );
};
const ScrTest1 = makeTest('s3');
const ScrTest2 = makeTest('s5');
const ScrTest3 = makeTest('s10');
const ScrTestFinal = makeTest('s13');

// ============================================================
// EKRAN 6 — IKKI SAVOL: uch baho-karta (tap-ochilma TOGGLE, bir vaqtda bittasi ochiq; `seen` alohida)
// ============================================================
const TWOQ_CARDS = [
  { id: 'A', t: 'Seans vaqti saytda eski turadi — odam kelganda film boshlanib ketgan bo\'ladi.', tez: 3, ogir: 3 },
  { id: 'B', t: 'Popkorn narxi saytda yozilmagan.', tez: 3, ogir: 1 },
  { id: 'C', t: "Yangi yil kechasi zal to'lib, chipta qolmaydi.", tez: 1, ogir: 3 },
];
const optT = (opts, v) => (opts.find(o => o.v === v) || {}).t;
const ScrTwoQ = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState(() => new Set(storedAnswer ? TWOQ_CARDS.map(c => c.id) : []));
  const done = seen.size >= TWOQ_CARDS.length;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'ikki-savol', screenIdx: screen, correct: true }); }, [done]); // eslint-disable-line
  const tap = (id) => { setOpen(o => (o === id ? null : id)); setSeen(s => { const n = new Set(s); n.add(id); return n; }); };
  return (
    <Stage eyebrow="Ikki savol" screen={screen}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? 'Davom etish' : `Yana ${TWOQ_CARDS.length - seen.size} ta kartani oching`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Uchta muammo bor. Qaysi biridan <span className="italic" style={{ color: T.accent }}>boshlash</span> kerak?</h2></div>
        {done
          ? <div className="takeaway fade-step"><p className="ta-h">Ikki bahoni ko'paytiramiz. Tez-tez bo'ladigan va og'ir muammo birinchi turadi.</p></div>
          : <Mentor>Muammoga ikki savol beramiz: qanchalik tez-tez bo'ladi va qanchalik og'ir — har kartani bosib, bahosini oching.</Mentor>}
        <div className="tq fade-up delay-1">
          {TWOQ_CARDS.map(c => {
            const on = open === c.id;
            return (
              <div key={c.id} className={`tq-card ${on ? 'on' : ''} ${seen.has(c.id) ? 'seen' : ''}`}>
                <button type="button" className="tq-btn" onClick={() => tap(c.id)} aria-expanded={on}>
                  <b className="tq-id">{c.id}</b><span className="tq-t">{c.t}</span><span className="tq-caret">{on ? '▴' : '▾'}</span>
                </button>
                {on && (
                  <div className="tq-body fade-step">
                    <span className="sc-chip"><span className="sc-q">{TEZ_Q}</span> {optT(TEZ_OPTS, c.tez)} ({c.tez})</span>
                    <span className="sc-chip"><span className="sc-q">{OGIR_Q}</span> {optT(OGIR_OPTS, c.ogir)} ({c.ogir})</span>
                    <span className="k-chip">kuchi {c.tez * c.ogir}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <MentorNote>C kartada «lekin u juda og'ir-ku!» degan e'tiroz chiqadi — bu yaxshi savol: yilda bir marta bo'lgani uchun B bilan teng.</MentorNote>
      </div>
    </Stage>
  );
};

// ============================================================
// EKRAN 7 — HAQIQIY VOQEA: K4 Airbnb (havo-matras boshlanishi) + 2 mikro-bashorat, ballsiz
// ============================================================
const K4_SLIDES = [
  { ic: '🏙', h: 'Vaziyat',
    body: <>2007-yil, Amerikaning San-Fransisko shahri. U yerda katta anjuman (ko'p odam yig'iladigan uchrashuv) bo'ldi. Boshqa shaharlardan ko'p odam keldi, mehmonxonalar to'lib ketdi. Ko'pchilik tunashga joy topolmadi.</> },
  { ic: '👀', h: "Muammoni qayerda ko'rdi?",
    body: <>Ular San-Fransiskoda yashardi. Muammoni o'ylab topmadi — <b>o'z shahrida, o'z ko'zi bilan</b> ko'rdi.</>,
    predict: {
      q: "Keyinchalik Airbnb'ni ochgan yigitlar bu muammoni qayerda ko'rdi?",
      opts: ['Boshqa davlatdan kelgan xatda', 'Internetdagi maqolada', "O'zlari yashaydigan shaharda"],
      right: 2,
      miss: "Asl javob — o'zlari yashaydigan shaharda.",
    } },
  { ic: '🛏', h: 'Ular nima qildi?',
    body: <>Ular o'z uyiga havo bilan shishiriladigan <b>uchta matras</b> qo'yib, joy topolmagan mehmonlarga ijaraga berdi. Airbnb shu uchta matrasdan boshlangan. Siz ham muammoni uzoqdan emas, o'z atrofingizdan qidirasiz.</>,
    predict: {
      q: "Mehmonlar tunashga joy topolmayapti. Sizningcha, yigitlar nima qildi?",
      opts: ['Mehmonxonalar haqida sharh yozdi', "Yangi mehmonxona ochish uchun pul yig'di", 'Uyidagi matraslarni mehmonlarga ijaraga berdi'],
      right: 2,
      miss: 'Asl javob — uchinchisi: ular uyidagi matraslarni mehmonlarga ijaraga berdi.',
    } },
];
const ScrCase = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState(storedAnswer ? K4_SLIDES.length - 1 : 0);
  const [guess, setGuess] = useState({});
  const cur = K4_SLIDES[i];
  const pr = cur.predict;
  const answered = !pr || guess[i] !== undefined || (storedAnswer && seen >= i);
  const last = i === K4_SLIDES.length - 1;
  const done = seen >= K4_SLIDES.length - 1 && answered;
  useEffect(() => { if (done && storedAnswer === undefined) onAnswer(screen, { stage: 'case', screenIdx: screen, correct: true }); }, [done]); // eslint-disable-line
  const go = (n) => { setI(n); setSeen(s => Math.max(s, n)); };
  return (
    <Stage eyebrow="Haqiqiy voqea 🏠" screen={screen}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? 'Davom etish' : "Voqeani oxirigacha ko'ring"} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Biznes olamidan mashhur voqea: <span className="italic" style={{ color: T.accent }}>Airbnb</span> qanday boshlangan?</h2></div>
        {pr && !answered ? (
          <div className="k-predict fade-step" key={`p${i}`}>
            <span className="k-predict-lbl">🎲 Avval o'zingiz belgilab ko'ring</span>
            <p className="k-predict-q">{pr.q}</p>
            <div className="k-predict-opts">
              {pr.opts.map((o, k) => <button key={k} className="k-predict-opt" onClick={() => setGuess(g => ({ ...g, [i]: k }))}>{o}</button>)}
            </div>
          </div>
        ) : (
          <div className="k-slide fade-step" key={`s${i}`}>
            <span className="k-slide-eyebrow">{i + 1} / {K4_SLIDES.length}</span>
            <span className="k-slide-ic">{cur.ic}</span>
            <h3 className="k-slide-h">{cur.h}</h3>
            <p className="k-slide-body">{cur.body}</p>
            {i === 0 && <p className="k-miss">Airbnb — hozir butun dunyoga mashhur sayohat xizmati.</p>}
            {pr && guess[i] !== undefined && (guess[i] === pr.right ? <p className="k-miss k-hit">🎯 Topdingiz!</p> : <p className="k-miss">{pr.miss}</p>)}
          </div>
        )}
        <div className="k-nav">
          <button className="btn-soft" disabled={i === 0} onClick={() => go(i - 1)}>← Orqaga</button>
          <span className="k-dots">{K4_SLIDES.map((_, k) => <span key={k} className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} />)}</span>
          <button className="btn" disabled={last || !answered} onClick={() => go(i + 1)}>Keyingisi →</button>
        </div>
        {/* MentorBypassLine YO'Q: keys — proyektorda mentorning O'ZI varaqlaydigan hikoya (F-0803-22). */}
      </div>
    </Stage>
  );
};

// ============================================================
// EKRAN 8 — USTAXONA: o'z atrofidan 10 muammo, BITTALAB (48/80-qolip)
// Tepada 10 nuqtali qadam-indikator · yagona yozish-kartasi · «📋 Namuna» · saqlash-hintlari yumshoq (qulflamaydi)
// ============================================================
const ORDINAL = ['Birinchi', 'Ikkinchi', 'Uchinchi', "To'rtinchi", 'Beshinchi', 'Oltinchi', 'Yettinchi', 'Sakkizinchi', "To'qqizinchi", "O'ninchi"];
const NAMUNA = [
  { joy: 'maktab', t: "Tanaffusda bufet navbati uzun — o'quvchilar ovqat olishga ulgurmaydi." },
  { joy: "yo'l", t: "Avtobus qachon kelishi noma'lum — bekatda kutib turamiz." },
  { joy: 'savdo markazi', t: "Savdo markazida kerakli do'konni topish qiyin — odamlar qo'riqchidan so'rab yuradi." },
  { joy: 'uy', t: "Uy vazifasi sinf chatida boshqa xabarlar orasida yo'qolib ketadi." },
  { joy: "to'garak", t: "Mashg'ulot vaqti o'zgarsa, buni faqat chatdagi xabar aytadi — ko'pchilik ko'rmay qoladi." },
];
const normT = (s) => s.toLowerCase().replace(/[^a-z0-9\u02BB\u02BC\u2018\u2019' ]/gi, ' ').replace(/\s+/g, ' ').trim();
const RE_YECHIM = /(kerak\b|qilish kerak|(sayt|ilova) qilaman)/i;
const RE_MAVHUM = /(^|\s)(yomon|qiyin|hamma)(\s|$|[.,!])/i;
const saveHint = (t, rows, editIdx) => {
  if (rows.some((r, i) => i !== editIdx && normT(r.matn) === normT(t))) return "Bu muammo ro'yxatda bor. Boshqa joyni eslang.";
  if ([...t].length <= 15) return 'Juda qisqa — kim, qayerda va nimadan qiynalganini bir gapda yozing.';
  if (RE_YECHIM.test(t)) return 'Bu yechim. Avval odam nimadan qiynalishini yozing.';
  if (RE_MAVHUM.test(t) && [...t].length < 40) return 'Bu umumiy gap. Kim qiynaldi va qayerda?';
  return null;
};
const ScrWorkshop = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [rows, setRows] = useState(() => readMuammolar());
  const [editIdx, setEditIdx] = useState(null);
  const [text, setText] = useState('');
  const [hint, setHint] = useState(null);
  const [warned, setWarned] = useState(null);
  const [showNamuna, setShowNamuna] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const full = rows.length >= MUAMMO_N;
  const writing = !full || editIdx !== null;
  const step = editIdx !== null ? editIdx : rows.length;
  const signal = () => {
    if (storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'muammolar', screenIdx: screen, count: MUAMMO_N, solved: true, correct: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  useEffect(() => { if (full) signal(); }, []); // eslint-disable-line
  const save = () => {
    const t = text.trim();
    if (!t) return;
    const h = saveHint(t, rows, editIdx);
    if (h && warned !== t) { setHint(h); setWarned(t); return; }
    const next = editIdx !== null ? rows.map((r, i) => (i === editIdx ? { ...r, matn: t } : r)) : [...rows, { matn: t, tez: 0, ogir: 0 }];
    setRows(next); writeMuammolar(next);
    setText(''); setHint(null); setWarned(null); setEditIdx(null); setShowNamuna(false);
    if (next.length >= MUAMMO_N) signal();
  };
  const edit = (i) => { setEditIdx(i); setText(rows[i].matn); setHint(null); setWarned(null); };
  const t = text.trim();
  const okKim = [...t].length > 15 && !RE_MAVHUM.test(t);
  const okMuammo = t.length > 0 && !RE_YECHIM.test(t);
  const nm = NAMUNA[step % NAMUNA.length];
  const left = MUAMMO_N - rows.length;
  return (
    <Stage eyebrow="Ustaxona ✍️" screen={screen}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!full && !isMentor} label={full || isMentor ? 'Davom etish' : `Yana ${left} ta muammo yozing`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{writing ? <>{ORDINAL[Math.min(step, MUAMMO_N - 1)]} <span className="italic" style={{ color: T.accent }}>muammongiz</span> qaysi?</> : <>O'nta muammongiz <span className="italic" style={{ color: T.accent }}>tayyor</span></>}</h2></div>
        <Mentor>O'zingiz ko'rgan muammoni aniq yozish oson — kecha maktabda, yo'lda yoki uyda kim qiynalganini eslang.</Mentor>
        <div className="ws-dots fade-up delay-1" aria-label={`${Math.min(rows.length, MUAMMO_N)}/${MUAMMO_N}`}>
          {Array.from({ length: MUAMMO_N }).map((_, i) => <span key={i} className={`wd ${i < rows.length && i !== editIdx ? 'ok' : ''} ${writing && i === step ? 'cur' : ''}`}>{i < rows.length && i !== editIdx ? '✓' : ''}</span>)}
          <span className="wd-n mono">{Math.min(rows.length + (writing && editIdx === null ? 1 : 0), MUAMMO_N)}/{MUAMMO_N}</span>
        </div>
        {writing ? (
          <div className="ws-card fade-up delay-2">
            <textarea className="ws-input" rows={2} value={text} maxLength={220} onChange={e => { setText(e.target.value); if (hint) setHint(null); }} placeholder="Kim, qayerda, nimadan qiynaldi?" aria-label="Muammo" disabled={isMentor} />
            <div className="ws-guide">
              <span className="ws-g" style={{ color: okKim ? T.success : T.ink }}>{okKim ? '✓' : '①'} Kim, qayerda, nimadan qiynaldi</span>
              <span className="ws-g" style={{ color: okMuammo ? T.success : T.ink }}>{okMuammo ? '✓' : '②'} Yechim emas, muammo</span>
            </div>
            {hint && <p className="ws-hint fade-step">{hint} <span className="ws-hint-sub">Shunday qoldirsangiz — yana «✓ Saqlash»ni bosing.</span></p>}
            <div className="ws-row">
              <button type="button" className="btn" disabled={!t || isMentor} onClick={save}>✓ Saqlash</button>
              <button type="button" className="ws-tog" onClick={() => setShowNamuna(v => !v)} aria-expanded={showNamuna}>📋 Namuna</button>
              <button type="button" className="ws-tog" onClick={() => setShowHelp(v => !v)} aria-expanded={showHelp}>💡 Yordam</button>
            </div>
            {showNamuna && <p className="ws-nm fade-step"><b>{nm.joy}:</b> {nm.t}</p>}
            {showHelp && <p className="ws-nm fade-step">Kecha uydan chiqqaningizdan qaytguningizcha borgan joylaringizni sanang: bekat, maktab eshigi, bufet, savdo markazi. Qayerda kutdingiz yoki kimdandir so'radingiz? O'sha — birinchi muammo.</p>}
          </div>
        ) : (
          <div className="ws-list fade-up delay-2">
            <span className="done-mini">✅ O'nta muammo tayyor</span>
            {rows.map((r, i) => (
              <div key={i} className="ws-item"><span className="ws-n mono">{i + 1}</span><span className="ws-t">{r.matn}</span><button type="button" className="ws-edit" onClick={() => edit(i)}>✎ Tahrirlash</button></div>
            ))}
          </div>
        )}
        <MentorBypassLine live={live} />
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label="✍️ O'nta muammoni yozganlar" />
        <MentorNote>6-muammodan keyin sinf sekinlashadi — «…kerak», «…qilish kerak» deb yechim yozish eng ko'p xato; «bu odam nimadan qiynaldi?» deb so'rang. 10 taga ulgurmagan o'quvchi qolganlari bilan o'tadi — uyda to'ldiradi.</MentorNote>
      </div>
    </Stage>
  );
};

// ============================================================
// EKRAN 9 — MUAMMO-REYTINGI: bittalab baho-karta (chapda) → reytingga suzib tushadi (o'ngda)
// Xato yo'q — o'quvchining o'z bahosi; faqat to'liqligi sanaladi. Chip ichida raqam yo'q.
// ============================================================
const ScoreRows = ({ tez, ogir, onTez, onOgir, disabled }) => (
  <div className="sr">
    <div className="sr-q"><span className="sr-l">{TEZ_Q}</span><div className="sr-opts">{TEZ_OPTS.map(o => <button key={o.v} type="button" className={`sr-opt ${tez === o.v ? 'on' : ''}`} disabled={disabled} onClick={() => onTez(o.v)}>{o.t}</button>)}</div></div>
    <div className="sr-q"><span className="sr-l">{OGIR_Q}</span><div className="sr-opts">{OGIR_OPTS.map(o => <button key={o.v} type="button" className={`sr-opt ${ogir === o.v ? 'on' : ''}`} disabled={disabled} onClick={() => onOgir(o.v)}>{o.t}</button>)}</div></div>
  </div>
);
const ScrRank = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [rows, setRows] = useState(() => readMuammolar());
  const [editIdx, setEditIdx] = useState(null);
  const firstOpen = rows.findIndex(r => !kuchOf(r));
  const curIdx = editIdx !== null ? editIdx : firstOpen;
  const cur = curIdx >= 0 ? rows[curIdx] : null;
  const [pick, setPick] = useState({ tez: 0, ogir: 0 });
  useEffect(() => { setPick(cur ? { tez: cur.tez || 0, ogir: cur.ogir || 0 } : { tez: 0, ogir: 0 }); }, [curIdx]); // eslint-disable-line
  const ratedN = rows.filter(r => kuchOf(r) > 0).length;
  const done = rows.length > 0 && ratedN === rows.length;
  const signal = (n) => {
    if (storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'reyting', screenIdx: screen, count: n, solved: true, correct: n >= MUAMMO_N });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
  useEffect(() => { if (done) signal(rows.length); }, []); // eslint-disable-line
  const setVal = (k, v) => {
    const p = { ...pick, [k]: v };
    setPick(p);
    if (!p.tez || !p.ogir || curIdx < 0) return;
    const next = rows.map((r, i) => (i === curIdx ? { ...r, tez: p.tez, ogir: p.ogir } : r));
    setRows(next); writeMuammolar(next); setEditIdx(null);
    if (next.every(r => kuchOf(r) > 0)) signal(next.length);
  };
  const items = rows.map((r, i) => ({ ...r, id: i })).filter(r => kuchOf(r) > 0);
  return (
    <Stage eyebrow="Baho qo'ying" screen={screen}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? 'Davom etish' : (rows.length ? `Yana ${rows.length - ratedN} ta muammoga baho qo'ying` : 'Avval ustaxonada muammo yozing')} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Qaysi muammongiz <span className="italic" style={{ color: T.accent }}>eng kuchli</span> chiqadi?</h2></div>
        <Mentor>Bahoni o'zingiz ko'rgan narsaga qarab qo'ying — ikkala savolga javob bersangiz, muammo reytingda o'z o'rniga o'tadi.</Mentor>
        {rows.length === 0 ? (
          <p className="ws-nm">Ro'yxat hali bo'sh — avval ustaxonada muammolaringizni yozing.</p>
        ) : (
          <div className="rs-split fade-up delay-1">
            <div className="rs-left">
              {cur ? (
                <div className="rs-card fade-step" key={curIdx}>
                  <span className="rs-lbl mono">{curIdx + 1}/{rows.length}</span>
                  <p className="rs-t">{cur.matn}</p>
                  <ScoreRows tez={pick.tez} ogir={pick.ogir} onTez={v => setVal('tez', v)} onOgir={v => setVal('ogir', v)} disabled={isMentor} />
                  <span className="ws-g" style={{ color: pick.tez && pick.ogir ? T.success : T.ink }}>{pick.tez && pick.ogir ? '✓' : '○'} Ikkala baho qo'yilgan</span>
                </div>
              ) : (
                <div className="rs-card fade-step">
                  <span className="done-mini">✅ Reyting tayyor</span>
                  <p className="rs-star">⭐ Eng kuchli uchtangizdan birida qaysi belgi bor? Sherigingizga bir gapda ayting.</p>
                </div>
              )}
            </div>
            <div className="rs-right">
              {items.length > 0 ? <RankList items={items} onPick={(id) => setEditIdx(id)} activeId={editIdx ?? undefined} /> : <p className="rs-empty">Baho qo'yilgan muammo shu yerda o'z o'rniga tushadi.</p>}
            </div>
          </div>
        )}
        <MentorBypassLine live={live} />
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label="📊 Reytingni tuzganlar" />
      </div>
    </Stage>
  );
};

// ============================================================
// EKRAN 11 — DALILDAN BAHO: sharhdagi so'zni o'qib ikki darajani qo'yish (TEKSHIRUV; variant-tanlash EMAS)
// Sharhlar bittalab (94-qonun + 400-chegara); xato — qaysi o'lchovda ekani alohida aytiladi (175/186).
// Mentor-rejimida kalit FAQAT «Natijani ochish»dan keyin (44-qonun).
// ============================================================
const DALIL_CARDS = [
  { t: "Har kelganimda sayt ochilmaydi — chiptani kassadan olaman, navbatda yigirma daqiqa turaman.", tez: 3, ogir: 2 },
  { t: "Bir marta chiptam ikki kishiga sotilgan ekan. Joyimda boshqa odam o'tirdi — filmni ko'rolmay qaytdim.", tez: 1, ogir: 3 },
  { t: 'Ba\'zan saytda film nomi ruscha chiqadi. Biroz chalg\'itadi, lekin tushunsa bo\'ladi.', tez: 2, ogir: 1 },
];
const HINT_TEZ = "Sharhda necha marta bo'lgani aytilgan so'zni toping.";
const HINT_OGIR = "Odam oxirida nima yo'qotdi — vaqtmi, filmni ko'rishmi yoki shunchaki noqulay bo'ldimi?";
const ScrEvidence = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const am = useContext(AchMissCtx);
  const saved = readJson(DALIL_KEY);
  const [picks, setPicks] = useState(() => (saved && Array.isArray(saved.picks) && saved.picks.length === DALIL_CARDS.length ? saved.picks : DALIL_CARDS.map(() => ({ tez: 0, ogir: 0 }))));
  const [shake, setShake] = useState(0);
  const [mReveal, setMReveal] = useState(false);
  const okCard = (p, c) => p.tez === c.tez && p.ogir === c.ogir;
  const okN = DALIL_CARDS.filter((c, i) => okCard(picks[i], c)).length;
  const done = okN === DALIL_CARDS.length;
  const curI = DALIL_CARDS.findIndex((c, i) => !okCard(picks[i], c));
  const showI = isMentor ? null : curI;
  useEffect(() => { if (done && storedAnswer === undefined) finish(); }, []); // eslint-disable-line
  function finish() {
    if (storedAnswer !== undefined) return;
    onAnswer(screen, { stage: 'dalil', screenIdx: screen, solved: true, correct: true });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  }
  const setVal = (i, k, v) => {
    const next = picks.map((p, j) => (j === i ? { ...p, [k]: v } : p));
    setPicks(next); writeJson(DALIL_KEY, { picks: next });
    const p = next[i], c = DALIL_CARDS[i];
    if (p.tez && p.ogir && !okCard(p, c)) { setShake(s => s + 1); if (am) am.miss(screen); }
    if (DALIL_CARDS.every((cc, j) => okCard(next[j], cc))) finish();
  };
  const card = showI !== null && showI >= 0 ? DALIL_CARDS[showI] : null;
  const p = card ? picks[showI] : null;
  const both = !!(p && p.tez && p.ogir);
  return (
    <Stage eyebrow="Dalildan baho" screen={screen}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? 'Davom etish' : `Yana ${DALIL_CARDS.length - okN} ta sharhga to'g'ri baho qo'ying`} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Har sharhga qanday <span className="italic" style={{ color: T.accent }}>baho</span> qo'yasiz?</h2></div>
        {/* 400-chegara: xato-ipucha chiqqanda yo'riq-pufak yashiriladi (ipucha o'sha qator ostida turadi) */}
        {!(card && both && !okCard(p, card)) && <Mentor>Bahoni sharhdagi so'zdan oling: qanchalik tez-tez bo'lgani va odam nima yo'qotgani.</Mentor>}
        <div className="dv-done fade-up delay-1">
          {DALIL_CARDS.map((c, i) => {
            const ok = (!isMentor && okCard(picks[i], c)) || (isMentor && mReveal);
            return <span key={i} className={`dv-pill ${ok ? 'ok' : ''} ${i === showI ? 'cur' : ''}`}>{ok ? `✓ ${i + 1} · kuchi ${c.tez * c.ogir}` : `${i + 1}`}</span>;
          })}
        </div>
        {isMentor ? (
          <div className="dv-card fade-step">
            {DALIL_CARDS.map((c, i) => (
              <div key={i} className="dv-m"><p className="dv-t">«{c.t}»</p>
                {mReveal ? <span className="k-chip">{optT(TEZ_OPTS, c.tez)} · {optT(OGIR_OPTS, c.ogir)} · kuchi {c.tez * c.ogir}</span> : <span className="dv-hid">🙈 «Natijani ochish»da ko'rinadi</span>}
              </div>
            ))}
            {!mReveal && <button className="mstats-reveal ready" style={{ alignSelf: 'flex-start' }} onClick={() => { setMReveal(true); if (live) live.mentorReveal(screen); }}>🔓 Natijani ochish</button>}
          </div>
        ) : card ? (
          <div className={`dv-card fade-step ${both ? 'miss' : ''}`} key={`${showI}-${both ? shake : 0}`}>
            <p className="dv-t">«{card.t}»</p>
            <ScoreRows tez={p.tez} ogir={p.ogir} onTez={v => setVal(showI, 'tez', v)} onOgir={v => setVal(showI, 'ogir', v)} />
            {both && p.tez !== card.tez && <p className="dv-hint">{HINT_TEZ}</p>}
            {both && p.ogir !== card.ogir && <p className="dv-hint">{HINT_OGIR}</p>}
          </div>
        ) : (
          <div className="takeaway fade-step"><p className="ta-h">Eng yuqori kuchi — birinchi kartada: har safar bo'ladi va vaqt ketadi.</p></div>
        )}
        {!isMentor && <AchRule screen={screen} />}
        <MentorBypassLine live={live} />
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label="🔍 Uch sharhni baholaganlar" />
        <MentorNote>2-sharhda sinf ko'pincha «juda og'ir» deb ikkalasiga ham eng yuqori baho qo'yadi — «necha marta bo'lgan?» deb so'rang. Bu mashq ball bermaydi, nishon birinchi urinishga.</MentorNote>
      </div>
    </Stage>
  );
};

// ============================================================
// EKRAN 12 — KODING: to'liq-ekran kompilyator (umumiy HtmlCompiler — PmLesson4 naqshi)
// Stek: HTML + CSS (87-qonun: <ol> va klass-selektor 1-Modulda o'tilgan). let/if/for YOZILMAYDI.
// ============================================================
const KOD_FALLBACK = { matn: "Seans vaqti saytda eski turadi", tez: 3, ogir: 3 };
const kodStarter = () => {
  const top = topThree(readMuammolar());
  const first = top[0] || KOD_FALLBACK;
  return `<h2>Atrofimdagi eng kuchli muammolar</h2>

<ol>
  <li class="birinchi">${first.matn} — kuchi ${kuchOf(first)}</li>
  <!-- Bu yerga yana ikkita muammo: kuchi kattasi yuqorida -->
</ol>

<style>
  li { margin: 8px 0; }
  /* .birinchi uchun fon rangini shu yerga yozing */
</style>`;
};
const KOD_PREVIEW_CSS = `
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1B1630;padding:18px 22px}
  h2{font-size:20px;margin:0 0 10px}
  li{font-size:15px;line-height:1.5}
  h2,li{overflow-wrap:anywhere;min-width:0}
`;
const readKoding = () => readJson(KODING_KEY);
const writeKodingOpen = (open) => { const p = readKoding() || {}; writeJson(KODING_KEY, { ...p, open }); };
const liTexts = (x) => (x.$$ ? x.$$('ol li') : []).map(el => (el.textContent || '').trim()).filter(Boolean);
const tailNum = (s) => { const m = /(\d+)\s*$/.exec(s); return m ? Number(m[1]) : null; };
const KOD_TASK = {
  eyebrow: 'Koding · muammo-reytingi',
  title: "index.html — eng kuchli uchta muammo",
  brief: <>Ro'yxatga yana ikkita muammo qo'shing: har band oxirida kuchi turadi, kattasi yuqorida. Keyin <span className="mono">.birinchi</span> klassiga fon rangi bering.</>,
  previewUrl: 'muammolar.html',
  previewCss: KOD_PREVIEW_CSS,
  requirements: [
    { id: 'uch', label: "Ro'yxatda 3 ta muammo",
      check: C.custom((x) => (liTexts(x).length >= 3 ? true : 'Yangi band <li> bilan ochiladi va </li> bilan yopiladi.')) },
    { id: 'tartib', label: 'Kattasi yuqorida turadi',
      check: C.custom((x) => {
        const li = liTexts(x);
        const nums = li.map(tailNum);
        const ok = li.length >= 3 && nums.every(n => n !== null) && nums.every((n, i) => i === 0 || n <= nums[i - 1]);
        return ok ? true : 'Har band oxirida kuchini yozing. Kattasi yuqorida turadi.';
      }) },
    { id: 'ajrat', label: 'Birinchisi ajralib turadi',
      check: C.custom((x) => {
        const hint = 'Klass nomi nuqta bilan yoziladi: .birinchi { background: … }';
        const a = C.cssProp('.birinchi', 'background', hint)(x);
        const b = C.cssProp('.birinchi', 'background-color', hint)(x);
        if (a === true || b === true) return true;
        return /\.birinchi\s*\{[^}]*background(-color)?\s*:\s*[^;}\s][^;}]*/i.test(x.html || '') ? true : hint;
      }) },
  ],
};
const ScrCoding = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [open, setOpen] = useState(() => { const s = readKoding(); return !!(s && s.open); });
  const top = useMemo(() => { const t = topThree(readMuammolar()); return t.length ? t : [KOD_FALLBACK]; }, []);
  const [done, setDone] = useState(() => !!(storedAnswer && storedAnswer.solved) || !!(readKoding() || {}).done);
  const finishPractice = ({ code }) => {
    setOpen(false); setDone(true);
    writeJson(KODING_KEY, { code, done: true, open: false });
    if (storedAnswer === undefined) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  };
  return (
    <Stage eyebrow="Koding" screen={screen}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} label={done || isMentor ? 'Davom etish' : "Avval kompilyatorda uchala shartni bajaring"} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Eng kuchli uchta muammongiz sahifada <span className="italic" style={{ color: T.accent }}>tartib bilan</span> turadi</h2></div>
        <Mentor>Kompilyatorda kod yozsangiz, natijasi shu zahoti ko'rinadi — «🛠 Kompilyatorni ochish»ni bosing.</Mentor>
        <div className="kdx fade-up delay-1">
          <div className="kdx-fn">
            <span className="kdx-fn-bar"><span className="bb-dots"><i /><i /><i /></span>index.html</span>
            <code className="kdx-fn-code">&lt;li class="<span className="kx-nima">birinchi</span>"&gt;…&lt;/li&gt;</code>
          </div>
          <span className="kdx-arrow" aria-hidden="true">➜</span>
          <div className="kdx-out">
            {top.map((m, i) => <span key={i} className={`kdx-card ${i === 0 ? 'first' : ''}`} style={{ '--kd': `${0.4 + i * 0.25}s` }}>{i + 1}. {m.matn} — kuchi {kuchOf(m)}</span>)}
          </div>
        </div>
        <div className="kdx-cta fade-up delay-2">
          <button className="kod-launch-btn" onClick={() => { setOpen(true); writeKodingOpen(true); }}>{done ? '↻ Kompilyatorni qayta ochish' : '🛠 Kompilyatorni ochish'}</button>
        </div>
        {done && <div className="takeaway fade-step"><p className="ta-h">Ro'yxatingiz endi o'zi aytadi: qaysi muammodan boshlash kerak.</p></div>}
        <MentorBypassLine live={live} />
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label="🛠 Kodni yozib bo'lganlar" />
        <MentorNote>10 daqiqa yetadi. Ulgurganlarga: to'rtinchi va beshinchi muammoni ham qo'shing — tartib buzilmasin. Ulgurmagan o'quvchi uyda tugatadi (uy vazifasining qisqa varianti).</MentorNote>
      </div>
      {/* To'liq-ekran qobiq (Htmllesson1 naqshi): kod-saqlov kompilyatorning O'ZIDA (`:code`) */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={kodStarter()} storageKey={`${KODING_KEY}:code`}
            onContinue={finishPractice} onBack={() => { setOpen(false); writeKodingOpen(false); }} />
        </div>
      )}
    </Stage>
  );
};

// ============================================================
// EKRAN 14 — YAKUNIY SO'Z: sherikka yoddan aytish (taymer-vidjetsiz — PairTimer band) + bir qator
// ============================================================
const ScrRecap = ({ screen, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [text, setText] = useState(() => { try { return localStorage.getItem(REFLECT_KEY) || ''; } catch { return ''; } });
  const save = (v) => { setText(v); try { localStorage.setItem(REFLECT_KEY, v); } catch {} };
  const written = text.trim().length >= 8;
  return (
    <Stage eyebrow="Yakuniy so'z" screen={screen}
      navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!written && !isMentor} label={written || isMentor ? 'Davom etish' : 'Bir qator yozing'} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">Eng kuchli muammongizni <span className="italic" style={{ color: T.accent }}>yoddan</span> ayta olasizmi?</h2></div>
        <Mentor>Ekranga qaramay sherigingizga ayting: muammoni qayerda ko'rdingiz va nega kuchi yuqori chiqdi?</Mentor>
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">🗣 Sherigingizga ayting</span></div></div>
            <p className="rcp-say">Siz gapirasiz, sherigingiz tinglab bitta savol beradi: «Bu necha marta bo'lgan?» Keyin o'rin almashasiz.</p>
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">✍️ Endi bir qator yozing</span></div></div>
            <input className="reflect-input" aria-label="Eng kuchli muammongiz" placeholder="Masalan: Maktab bufetida har kuni navbat uzun, ovqatga ulgurmaymiz. Kuchi 6." value={text} onChange={e => save(e.target.value)} maxLength={160} />
            {written && <p className="small" style={{ margin: 0, color: T.success, fontWeight: 700 }}>✓ Yozildi!</p>}
          </div>
        </div>
        <MentorBypassLine live={live} />
        <MentorNote>Sinfga uch tezkor savol (qo'l ko'tarish): «Kimning o'nta muammosi tayyor?» · «Kimning eng kuchli muammosi maktabda?» · «Kimda kuchi 9 chiqqan muammo bor?» Uchdan biri «kuchi nega yuqori»ni aytolmasa — 6-ekrandagi C kartani qayta ko'rsating.</MentorNote>
      </div>
    </Stage>
  );
};

// ============================================================
// UYGA VAZIFA — topshiriq kartasi (yakun sahifasida; to'liq + qisqa variant)
// ============================================================
const HW_OPTS = [
  { id: 'full', ic: '📗', title: "To'liq · ~20 daqiqa",
    rows: ['Nechta: eng kuchli 3 muammo', 'Kim bilan: shu joyda bo\'ladigan bitta odam', "Qayerga: «Baho qo'ying» ekranidagi reytingga"],
    items: [
      'Eng kuchli uchta muammongizdan birini oling.',
      "Shu joyda bo'ladigan bitta odamdan so'rang: «Siz ham shundan qiynalasizmi? Necha marta bo'ladi?»",
      'Javobiga qarab ikki bahoni yangilang. Qolgan ikkitasi bilan ham shunday qiling.',
    ] },
  { id: 'short', ic: '📘', title: 'Qisqa · ~10 daqiqa',
    items: ["«Koding» ekranida kodingizni tugating (uchala shart ✓ bo'lsin), keyin bitta muammoni bitta odam bilan tekshiring."] },
];

// ============================================================
// FLASHCARDS — aktiv takrorlash (old tomoni SAVOL)
// ============================================================
const PM_FLASHCARDS = [
  { front: 'Muammo borligini nima ko\'rsatadi?', back: "Odamning qilgan ishi — u o'zi «muammo bor» demaydi." },
  { front: 'Muammoning uch belgisi qaysilar?', back: "Qayta-qayta bo'ladi · Odam o'zicha yo'l topgan · Odam voz kechgan." },
  { front: 'Qaysi belgi eng ishonchli?', back: "Odam o'zicha yo'l topgani — demak, u rostdan qiynalgan." },
  { front: 'Qaysi sharh muammo topishga yordam beradi?', back: 'Past yulduzli, sababi yozilgan sharh.' },
  { front: 'Maqtov-sharhdan nega muammo topilmaydi?', back: 'Undan nima buzilgani bilinmaydi.' },
  { front: 'Chatda bitta savol qayta-qayta so\'ralsa-chi?', back: "Uning javobi hech qayerda yo'q — bu muammo." },
  { front: 'Muammoga qaysi ikki baho qo\'yiladi?', back: "Qanchalik tez-tez bo'ladi va qanchalik og'ir." },
  { front: 'Kuchi qanday chiqadi?', back: "Ikki bahoni ko'paytiramiz: 3 marta 2 — kuchi 6." },
  { front: "Og'ir, lekin yilda bir marta bo'ladigan muammo-chi?", back: "Kuchi past chiqadi — tez-tez bo'ladigan og'ir muammo oldinda turadi." },
  { front: 'Airbnb muammoni qayerdan topgan?', back: "O'z shahrida: mehmonxonalar to'lganini o'z ko'zi bilan ko'rgan." },
];
// F-0803-13/14: KARTA JAVOBI UZUNLIKKA MOSLASHADI.
// Muammo edi: `.fc-tag` hamma javobga bir xil katta monoshrift berardi — u bir so'zlik javob
// (`let`, `=`, `string`) uchun tanlangan o'lcham. Uzun javob 2-3 qatorga bo'linib, qat'iy
// balandlikdagi kartaga sig'masdi va izoh pastki chetga yopishib qolardi.
// Yechim: (1) uzunlik bo'yicha 4 pog'onali o'lcham · (2) bitta kod-tokeni — mono,
// gap — Manrope (o'qishga qulay, ~25% tor) · (3) gap ichidagi kod so'zlari mono qoladi.
const FC_CODE_WORDS = /\b(let|const|var|string|number|boolean|true|false|null|undefined|function|return|for|while|if|else)\b/g;
const FC_VOCAB = new Set(['let', 'const', 'var', 'string', 'number', 'boolean', 'true', 'false', 'null', 'undefined', 'function', 'return', 'for', 'while', 'if', 'else']);
// Kodmi yoki so'zmi? Monoshrift FAQAT kodga: lug'atdagi kalit so'z yoki kod-belgisi bo'lgan
// token. «o'zgaruvchi» kabi o'zbekcha atama — gap, u Manrope bilan chiroyliroq va tor chiqadi.
// F-0803-23: defis-li ODDIY so'z («Promo-landing», «follow-up», «AI-agent») kod EMAS — ilgari u
// dasturchi shriftida, `let`/`const` kabi kod-token bo'lib ko'rinardi. Haqiqiy defis-li kod
// tokeni (`background-color`, `runs-on`) FC_VOCAB oq ro'yxati orqali mono bo'lib qoladi.
const fcIsCode = (s) => {
  if (FC_VOCAB.has(s.toLowerCase())) return true;
  if (/^[\p{L}'\u02BB\u2019]+(-[\p{L}'\u02BB\u2019]+)+$/u.test(s)) return false;
  return /[=(){};.[\]<>+*/%!&|-]/.test(s);
};
const fcTier = (s) => (s.length <= 8 ? 't1' : s.length <= 16 ? 't2' : s.length <= 32 ? 't3' : 't4');
const fcAnswer = (raw) => {
  const s = String(raw ?? '');
  const oneToken = !/\s/.test(s) && fcIsCode(s);        // `let`, `const`, `=`, `string` — kod tokeni
  const cls = `fc-tag ${fcTier(s)} ${oneToken ? 'mono-all' : 'prose'}`;
  if (oneToken) return <span className={cls}>{s}</span>;
  const parts = s.split(FC_CODE_WORDS);                 // gap: kod so'zlari mono bo'lakda qoladi
  return (
    <span className={cls}>
      {parts.map((p, i) => (i % 2 === 1 ? <span key={i} className="fc-kw">{p}</span> : p))}
    </span>
  );
};

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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'atama yodlandi', ru: 'терминов выучено' })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr({ uz: "O'rganilmoqda", ru: 'Учим' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
          <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
            <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span></div>
            <div className="fc-face fc-back">{fcAnswer(tr(card.back))}</div>
          </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={() => advance(false)}>{tr({ uz: '✗ Takrorlash', ru: '✗ Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={() => advance(true)}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })}</button></div>)
        : (<p className="fc-hint" />)}
    </div>
  );
}
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={false} label={tr({ uz: 'Davom etish →', ru: 'Далее →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={PM_FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

// ============================================================
// EKRAN 18 — YAKUN + CODESTRIKE ARENA (blok 9): 4 qator + o'quvchining eng kuchli uchtasi + uy-vazifa kartasi + nishonlar
// ============================================================
const SUM_RECAP = [
  "Muammo odamning qilgan ishida ko'rinadi.",
  'Past yulduzli, sababi yozilgan sharh — tayyor muammo.',
  "Har muammoga ikki baho qo'yiladi: qanchalik tez-tez va qanchalik og'ir.",
  "Airbnb ham muammoni o'z shahrida, o'z ko'zi bilan ko'rgan.",
];
const ScrSummary = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  const [hwOpen, setHwOpen] = useState(false);
  const [hwCharge, setHwCharge] = useState(false);
  const fireHw = () => { if (hwCharge || hwOpen) return; setHwCharge(true); setTimeout(() => { setHwOpen(true); setHwCharge(false); }, 500); };
  const _gate = useContext(LiveGateCtx) || {};
  const _live = _gate.live;
  const [hwPick, setHwPick] = useState(() => { try { return localStorage.getItem(HW_KEY) || ''; } catch { return ''; } });
  const chooseHw = (id) => { setHwPick(id); try { localStorage.setItem(HW_KEY, id); } catch {} };
  const [arena, setArena] = useState(false);
  const [arenaSolo, setArenaSolo] = useState(false);
  const quizSt = (_live && _live.quiz && _live.quiz.state) || 'off';
  const isStudentL = _live && _live.mode === 'student';
  const isMentorL = _live && _live.mode === 'mentor';
  const classOver = !!(_live && (_live.status === 'ended' || !_live.mentorAlive));
  const studentSolo = isStudentL && classOver && quizSt !== 'done';
  const studentLive = isStudentL && !studentSolo && quizSt !== 'off';
  const studentWait = isStudentL && !studentSolo && quizSt === 'off';
  const openArena = async () => {
    if (isMentorL && quizSt === 'off') { try { await _live.quizControl('lobby', -1); } catch { return; } }
    setArenaSolo(studentSolo); setArena(true);
  };
  const isLiveClass = !!(_live && (_live.mode === 'mentor' || _live.mode === 'student'));
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const top = topThree(readMuammolar());
  return (
    <Stage eyebrow="Tayyor" screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>Qaytadan</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>Yakunlash</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l">
          <span className="done-chip fade-up"><span className="tick">{Ico.check(11)}</span> Dars tugadi</span>
          <h2 className="title h-title fade-up d1">{isLiveClass ? 'Bugun atrofimizdan muammo topib, unga baho qo\'yishni o\'rgandik.' : 'Endi siz atrofingizdan muammo topib, unga baho qo\'ya olasiz.'}</h2>
        </div>{!isMentorL && <ScoreRing correct={correct} total={total} />}</div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? '⏳ Mentorni kuting' : undefined} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <Zoomable>
          <div className="split">
            <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span style={{ color: T.success, display: 'inline-flex' }}>{Ico.check(15)}</span> Endi siz bilasiz</div><ul className="recap">{SUM_RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck" style={{ display: 'inline-flex' }}>{Ico.check(15)}</span><span>{r}</span></li>))}</ul></div>
            <div className="card fade-up d4"><div className="card-lbl" style={{ color: T.accent }}>📊 Eng kuchli uchta muammongiz</div>
              {top.length
                ? <ul className="sum-top">{top.map((x, i) => <li key={i}><b className="rk-n">{i + 1}</b> <span className="t">{x.matn}</span> <span className="k-chip">kuchi {kuchOf(x)}</span></li>)}</ul>
                : <p className="body" style={{ margin: 0, color: T.ink2 }}>Reyting hali tuzilmagan.</p>}
            </div>
          </div>
          <div className="hw-big-wrap fade-up d4">
            <button className={`hw-big ${hwCharge ? 'charging' : ''}`} onClick={fireHw}>
              <span className="hw-sky" aria-hidden="true">
                {HW_TOKENS.map((k, i) => <span key={i} className="hw-tok" style={{ left: `${k.l}%`, top: `${k.tp}%`, fontSize: k.s, '--d': `${k.d}s` }}>{tr(k.t)}</span>)}
              </span>
              <span className="hw-big-shine" aria-hidden="true" />
              <span className="hw-big-t">Uyga vazifa</span>
              <span className="hw-big-s">Topshiriq kartasi →</span>
            </button>
          </div>
          {hwOpen && <div className="card hw fade-up d4" style={{ marginTop: 'clamp(12px,2vw,18px)' }}>
            <div className="card-lbl" style={{ color: T.accent }}>📝 Topshiriq kartasi</div>
            <div className="hw-cards" style={{ marginTop: 8 }}>
              {HW_OPTS.map(o => (
                <button key={o.id} className={`hw-card ${hwPick === o.id ? 'on' : ''}`} onClick={() => chooseHw(o.id)}>
                  <span className="hw-card-h">{o.ic} {o.title}</span>
                  {o.rows && <span className="hw-rows">{o.rows.map((r, i) => <span key={i} className="hw-row">{r}</span>)}</span>}
                  <ol className="hw-card-list">{o.items.map((it, i) => <li key={i}>{it}</li>)}</ol>
                  {hwPick === o.id && <span className="hw-card-ok">✓ tanlandi</span>}
                </button>
              ))}
            </div>
            <p className="small" style={{ margin: '10px 0 0', color: T.ink2 }}>So'rash noqulay bo'lsa — uydagilardan boshlang: ular ham shu bekatdan yoki shu do'kondan foydalanadi.</p>
          </div>}
        </Zoomable>
        <MentorNote>Uy vazifasini 1 daqiqada tekshiring: uch muammo bo'yicha uch odamdan so'ralganmi · har javobdan keyin baho yangilangan yoki o'zgarmagani yozilganmi · reytingdagi tepadagi uchtalik bugungisi bilan solishtirilganmi.</MentorNote>
        {!isMentorL && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>🏅 Nishonlaringiz — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return (
              <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`} title={tr(a.desc)}>
                <span className="ach-badge-ic">{got ? a.icon : '🔒'}</span>
                <span className="ach-badge-name">{a.name}</span>
                {got && <span className="ach-badge-desc">{tr(a.desc)}</span>}
              </div>
            ); })}
          </div>
        </div>}
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT
// Podium yorliqlari (scored indeks -> qisqa nom)
const Q_LABELS = {
  3:  '1 — Uch belgi',
  5:  '2 — Kerakli sharh',
  10: '3 — Qaysi biridan boshlash',
  13: '4 — Muammoga dalil',
};

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

// Server-baholash javob kaliti (mentor darsni ochganda avto-yuklanadi) — ⚡ Jonli tasdiqlaydi.
// Scored: s3 · s5 · s10 · s13. Ishtirok-kalitlar (-1, s-qolipsiz — lint-keys QOIDA 2): s8/s9/s11 → 'practice', s12 → 'koding'.
const INLINE_KEYS = { s3: 2, s5: 3, s10: 0, s13: 1, practice: -1, koding: -1 };

const ScreenPodium = ({ screen, answers, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
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
      if (on) t = setTimeout(tick, 3000); // kech qo'shilganlar ham jonli ko'rinadi
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [isLive, livePin]);

  const totalQ = SCORED_IDX.length;
  const board = players.map(p => {
    // FAQAT baholanadigan testlar hisoblanadi — s6 amaliyotning «tugatdi» belgisi (idx 7)
    // reytingga aralashmasin (praktika signali PRACTICE_BASE zonasida)
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
            <div className="frame-soft" style={{ maxWidth: 480 }}><p className="body" style={{ margin: 0 }}>{tr({ uz: "Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.", ru: '\u0412\u044b \u0432 \u0441\u0430\u043c\u043e\u0441\u0442\u043e\u044f\u0442\u0435\u043b\u044c\u043d\u043e\u043c \u0440\u0435\u0436\u0438\u043c\u0435. \u0412 \u0436\u0438\u0432\u043e\u043c \u0443\u0440\u043e\u043a\u0435 \u0437\u0434\u0435\u0441\u044c \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0440\u0435\u0439\u0442\u0438\u043d\u0433 \u0432\u0441\u0435\u0439 \u0433\u0440\u0443\u043f\u043f\u044b — 🥇🥈🥉 \u043f\u043e\u0434\u0438\u0443\u043c.' })}</p></div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: '\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u044e\u0442\u0441\u044f…' })}</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: '\u041a \u044d\u0442\u043e\u0439 \u0441\u0435\u0441\u0441\u0438\u0438 \u043f\u043e\u043a\u0430 \u043d\u0438\u043a\u0442\u043e \u043d\u0435 \u043f\u0440\u0438\u0441\u043e\u0435\u0434\u0438\u043d\u0438\u043b\u0441\u044f.' })}</p></div>
        ) : (
          <>
            <Confetti />
            {/* Podium — 2-1-3 tartibida (o'rtada g'olib, balandroq) */}
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: 'Siz — ', ru: '\u0412\u044b — ' })}<b>{myIdx + 1}</b>{tr({ uz: "-o'rin", ru: '-\u0435 \u043c\u0435\u0441\u0442\u043e' })} ({board[myIdx].okCount}/{totalQ})</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: "🏆 To'liq reyting", ru: '🏆 \u041f\u043e\u043b\u043d\u044b\u0439 \u0440\u0435\u0439\u0442\u0438\u043d\u0433' })}</div>
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
      </div>
    </Stage>
  );
};

// ===== ⚔️ MUSTAHKAMLASH-JANG (Kahoot arena) =====
const QUIZ_MS = 15000;
const QUIZ_BASE_IDX = 100;
const QUIZ_COLORS = ['#FF5A2C', '#0FA6D6', '#F5A623', '#22A05C']; // CodeStrike brend palitrasi: coral · ocean · sun · leaf
const QUIZ_SHAPES = ['▲', '◆', '●', '■'];
// Arena foni: suzuvchi PM tokenlari — dars mavzusidan (kuzatuv → sharh → kuchi)
const QZ_BG_SHAPES = [
  { ch: '🔎',     l: 5,  t: 10, s: 42, c: 'rgba(255,110,70,0.16)',  d: 19, dl: 0 },
  { ch: '★',      l: 86, t: 7,  s: 40, c: 'rgba(203,173,255,0.16)', d: 23, dl: 1.5 },
  { ch: '3×2',    l: 8,  t: 72, s: 40, c: 'rgba(80,200,255,0.16)',  d: 27, dl: 0.8 },
  { ch: 'kuchi',  l: 78, t: 68, s: 30, c: 'rgba(120,235,175,0.14)', d: 21, dl: 2.2 },
  { ch: '<ol>',   l: 44, t: 86, s: 34, c: 'rgba(203,173,255,0.13)', d: 25, dl: 1.1 },
  { ch: '→',      l: 66, t: 26, s: 46, c: 'rgba(255,110,70,0.13)',  d: 17, dl: 0.4 },
  { ch: '🏠',     l: 26, t: 34, s: 34, c: 'rgba(120,235,175,0.13)', d: 20, dl: 1.9 },
  { ch: '1★',     l: 55, t: 5,  s: 26, c: 'rgba(80,200,255,0.14)',  d: 22, dl: 0.6 },
  { ch: '🎬',     l: 93, t: 42, s: 40, c: 'rgba(203,173,255,0.14)', d: 24, dl: 1.3 },
  { ch: '👀',     l: 2,  t: 45, s: 28, c: 'rgba(203,173,255,0.11)', d: 26, dl: 2.6 },
];
// 12 savol (senariy 8-bo'lim) · to'g'ri-indekslar 0,2,1,3,3,0,2,1,2,0,3,1 — sikl yo'q, har indeks 3 marta. ⚡ Jonli tasdiqlaydi.
const QUIZ_BANK = [
  { q: 'Kuzatuvda muammoni nima ko\'rsatadi?',
    opts: ['Odamning qilgan ishi', 'Joyning rangi va bezagi', 'Kassaning ish vaqti', 'Afishadagi film nomi'], correct: 0 },
  { q: "Odam saytda yo'q narsani kassaga qo'ng'iroq qilib bilib oldi. Qaysi belgi?",
    opts: ['Odam voz kechgan', "Qayta-qayta bo'ladi", "Odam o'zicha yo'l topgan", "Hech qanday belgi yo'q"], correct: 2 },
  { q: 'Qiz saytda narxni topolmay, chipta olmasdan sahifani yopdi. Qaysi belgi?',
    opts: ["Odam o'zicha yo'l topgan", 'Odam voz kechgan', "Qayta-qayta bo'ladi", "Hech qanday belgi yo'q"], correct: 1 },
  { q: 'Qaysi sharh muammoni aniq aytadi?',
    opts: ['«Kinoteatr juda yoqdi, yana kelaman»', "«Yomon emas, o'rtacha kinoteatr ekan»", '«Hammasi joyida, xodimlarga rahmat»', '«Saytda seans vaqti har hafta eski turadi»'], correct: 3 },
  { q: 'Qaysi sharhdan muammo ko\'proq topiladi?',
    opts: ["Besh yulduzli, maqtovga to'lasi", 'Eng qisqa yozilgani', 'Ertalab yozilgani', 'Past yulduzli, sababi yozilgani'], correct: 3 },
  { q: "Chatda bir xil savolni ko'p odam alohida yozsa, bu nimani ko'rsatadi?",
    opts: ["Savolning javobi hech qayerda yo'q", "Odamlar gaplashishni yaxshi ko'radi", 'Chat juda qiziqarli', 'Savol juda oson'], correct: 0 },
  { q: "Muammoga qaysi ikki baho qo'yiladi?",
    opts: ['Narxi va rangi', 'Kim yozgani va qachon', "Qanchalik tez-tez va qanchalik og'ir", 'Uzunligi va tili'], correct: 2 },
  { q: "Muammo bahosi: tez-tez — 3, og'ir — 2. Ko'paytirsak, kuchi qancha?",
    opts: ['5', '6', '9', '1'], correct: 1 },
  { q: 'Qaysi muammoning kuchi eng yuqori?',
    opts: ["Yilda bir marta bo'ladi va biroz noqulay", "Ba'zan bo'ladi va biroz noqulay", "Har safar bo'ladi, ishini qilolmaydi", "Kamdan-kam bo'ladi va vaqt ketadi"], correct: 2 },
  { q: 'Airbnb (uy ijarasi xizmati) nimadan boshlangan?',
    opts: ["Uyga qo'yilgan matraslardan", 'Yangi mehmonxonadan', 'Reklama roligidan', 'Telefon ilovasidan'], correct: 0 },
  { q: "Airbnb asoschilari muammoni qayerda ko'rdi?",
    opts: ['Internetdagi maqolada', 'Televizordagi yangilikda', "Do'stlarining xatida", "O'z shahrida, anjuman kunlarida"], correct: 3 },
  { q: "Muammolarni 1, 2, 3 deb raqamlab, tartib bilan qaysi teg ko'rsatadi?",
    opts: ['`<ul>`', '`<ol>`', '`<img>`', '`<a>`'], correct: 1 },
];
const quizPts = (elapsedMs) => elapsedMs <= 500 ? 1000 : Math.max(0, Math.round(1000 * (1 - (Math.min(elapsedMs, QUIZ_MS) / QUIZ_MS) / 2)));
// Bitta o'yinchining barcha javoblaridan yakuniy hisob (hamma klientda bir xil chiqadi)
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

// Aylana taymer — vaqt kamaygani sari yashil → sariq → qizil
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

// 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI — yorqin nurlar, medal portlashi, uchqunlar
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
// Navbatda bittasi ko'rsatiladi (to'liq-ekran bayram) — tugagach keyingisi chiqadi
function AchToasts({ toasts, onDone }) {
  const t = toasts[0];
  const a = t && ACHIEVEMENTS[t.id];
  if (!a) return null;
  return <AchCelebrate key={t.k} ach={a} onDone={() => onDone(t.k)} />;
}


// ⚡ Neon chaqmoq (kapsula yon belgilari) — uchqunlari hover'da sachraydi
const CsNeonBolt = ({ flip }) => (
  <span className={`csn-boltwrap ${flip ? 'flip' : ''}`} aria-hidden="true">
    <svg className="csn-bolt" viewBox="0 0 60 100">
      <defs><linearGradient id="csnb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#B08CFF" /></linearGradient></defs>
      <path d="M38 4 L10 52 L27 52 L20 96 L52 40 L33 40 Z" fill="url(#csnb)" stroke="rgba(255,255,255,.65)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
    <i className="cs-spark s1" /><i className="cs-spark s2" /><i className="cs-spark s3" />
  </span>
);

// ⚡ CODE STRIKE — neon-kapsula (CTA'da bosiladi, lobbyda brend-lavha).
// Ichida DARSNING O'Z QZ_BG_SHAPES tokenlari suzadi — har dars kapsulaga o'z «DNK»sini beradi.
// Holatlar: oddiy (yonib turadi) · cs-off (mentor kutilmoqda, xira) · cs-live (jonli ochiq, LIVE nuqta).
const CsWordmark = ({ onClick, disabled, hint, stats = true, bolt = true, liveOn = false }) => {
  const clickable = !!onClick && !disabled;
  const [charge, setCharge] = useState(false);
  const fire = () => {
    if (!clickable || charge) return;
    setCharge(true); // portal-zaryad: cho'qqisida arena ochiladi, flash arena ustida so'nadi
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
          <span key={i} className={`cs-tok ${i % 2 ? 'back' : 'front'}`} style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: `clamp(9px, ${Math.round(s.s * 0.4)}px, ${Math.round(s.s * 0.6)}px)`, '--d': `${s.d}s`, animationDelay: `-${s.dl * 3}s` }}>{s.ch}</span>
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

// Jonli fon: suzuvchi uchqunlar + «web» chiziqlari + PM tokenlari (canvas)
function QzFX() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const ctx = cv.getContext('2d'); const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 1, H = 1, raf = 0;
    const size = () => { W = cv.width = Math.max(1, cv.offsetWidth * DPR); H = cv.height = Math.max(1, cv.offsetHeight * DPR); };
    size(); window.addEventListener('resize', size);
    const TOK = ['muammo', 'sharh', 'kuchi', '★', '3×2', '<ol>', 'kuzatuv', '→'];
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
  // solo: self rejim YOKI mashq (dars tugagach o'quvchi uyda qayta ishlashi) —
  // taymer/savollar bir xil, lekin serverga yozilmaydi, faqat o'z natijasi ko'rinadi
  const [soloMode, setSoloMode] = useState(!!startSolo);
  const solo = soloMode || (!isMentor && !isStudent);
  const soloRef = useRef(solo);
  soloRef.current = solo;
  const [phase, setPhase] = useState('lobby'); // lobby | q | reveal | done
  const [qi, setQi] = useState(-1);
  const [remaining, setRemaining] = useState(QUIZ_MS);
  const [myAnswers, setMyAnswers] = useState({}); // {qi: {picked, correct, elapsed}}
  const [players, setPlayers] = useState([]);
  const [qRows, setQRows] = useState([]);
  const [answeredN, setAnsweredN] = useState(0);
  const [classEnded, setClassEnded] = useState(false); // jonli dars tugadi — qutqaruv banneri
  const seenQRef = useRef(-1);
  const qStartRef = useRef(0);
  const deadlineRef = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // O'quvchi sahifani yangilagan bo'lsa — o'z javoblarini serverdan tiklaymiz
  useEffect(() => {
    if (!isStudent || solo || !live.playerId) return;
    liveQuizAnswers(live.pin).then(rows => {
      const mine = {};
      rows.filter(r => r.player_id === live.playerId).forEach(r => { mine[r.screen_idx - QUIZ_BASE_IDX] = { picked: r.picked, correct: r.correct, elapsed: r.elapsed_ms }; });
      setMyAnswers(m => ({ ...mine, ...m }));
    }).catch(() => {});
  }, []); // eslint-disable-line

  // Jonli sinxron: 1.2s polling — savol/natija/yakun fazalari serverdan keladi.
  useEffect(() => {
    if (soloRef.current) return;
    let on = true, t = null;
    const tick = async () => {
      if (soloRef.current) return; // mashqqa o'tildi — server bilan ishlamaymiz
      try {
        const row = await liveGet(live.pin);
        if (!on) return;
        if (row) {
          const st = row.quiz_state || 'off', q = row.quiz_q ?? -1;
          if (st === 'q' && q !== seenQRef.current) {
            seenQRef.current = q; qStartRef.current = Date.now();
            deadlineRef.current = Date.now() + QUIZ_MS - (isMentor ? 0 : 700); // polling kechikish kompensatsiyasi
            setQi(q); setRemaining(deadlineRef.current - Date.now()); setPhase('q'); setAnsweredN(0);
          } else if (st === 'r') {
            if (q !== seenQRef.current) { seenQRef.current = q; setQi(q); } // kech kirgan ham natijani ko'radi
            setPhase(p => p === 'done' ? p : 'reveal');
          }
          else if (st === 'done') { setPhase('done'); }
        }
        // Fetch-fazani SERVER holatidan hisoblaymiz — reveal'ga o'tgan ZAHOTI natijalar yuklanadi
        const st1 = row ? (row.quiz_state || 'off') : null;
        const ph = st1 === 'r' ? 'reveal' : st1 === 'done' ? 'done' : st1 === 'lobby' ? 'lobby' : st1 === 'q' ? 'q' : phaseRef.current;
        if (on) setClassEnded(!row || row.status === 'ended');
        // phaseRef sharti — himoya: lokal reveal (taymer tugagan), server hali 'q' bo'lsa ham natijalar yuklanadi
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

  // Taymer — 100ms aniqlikda; vaqt tugasa javob ochiladi.
  // MENTOR: serverni ham 'r' ga o'tkazamiz — aks holda server 'q'ligicha qolib,
  // poll natijalarni yuklamaydi va hisoblagichlar/TOP-5 nolda qotib qolardi.
  useEffect(() => {
    if (phase !== 'q') return;
    const iv = setInterval(() => {
      const rem = deadlineRef.current - Date.now();
      setRemaining(rem > 0 ? rem : 0);
      if (rem <= 0) {
        clearInterval(iv);
        setPhase('reveal');
        if (isMentor && !soloRef.current) ctrl('r', seenQRef.current); // Kahoot: vaqt tugadi — natija hammaga ochiladi
      }
    }, 100);
    return () => clearInterval(iv);
  }, [phase, qi]); // eslint-disable-line

  // Mentor boshqaruvi (optimistik lokal o'tish + server)
  const ctrl = async (state, q) => {
    try {
      await live.quizControl(state, q);
      if (state === 'q') { seenQRef.current = q; qStartRef.current = Date.now(); deadlineRef.current = Date.now() + QUIZ_MS; setQi(q); setRemaining(QUIZ_MS); setPhase('q'); setAnsweredN(0); }
      else if (state === 'r' || state === 'done') {
        setPhase(state === 'r' ? 'reveal' : 'done');
        // Natijalarni DARHOL yuklaymiz — hisoblagichlar bo'sh turmaydi
        Promise.all([livePlayers(live.pin), liveQuizAnswers(live.pin)]).then(([pl, qa]) => { setPlayers(pl); setQRows(qa); }).catch(() => {});
      }
    } catch {}
  };
  // Solo boshqaruvi
  const soloStart = (i) => { seenQRef.current = i; qStartRef.current = Date.now(); deadlineRef.current = Date.now() + QUIZ_MS; setQi(i); setRemaining(QUIZ_MS); setPhase('q'); };
  const soloNext = () => { const n = qi + 1; if (n >= QUIZ_BANK.length) setPhase('done'); else soloStart(n); };
  const soloReplay = () => { setMyAnswers({}); soloStart(0); };
  // Jonli test tugagach «qayta ishlash» — mashq rejimiga o'tish (serverga yozilmaydi)
  const startPractice = () => { setSoloMode(true); setMyAnswers({}); soloStart(0); };

  const answer = (i) => {
    if (phase !== 'q' || isMentor || myAnswers[qi]) return;
    const elapsed = Math.min(QUIZ_MS, Date.now() - qStartRef.current);
    const correct = i === QUIZ_BANK[qi].correct;
    setMyAnswers(m => ({ ...m, [qi]: { picked: i, correct, elapsed } }));
    if (isStudent && !solo) live.submitAnswer(QUIZ_BASE_IDX + qi, `quiz-${qi}`, i, correct, elapsed);
    if (solo) setPhase('reveal'); // yolg'iz o'yinda javob darhol ochiladi
  };

  // Joriy streak (shu savolgacha ketma-ket to'g'ri)
  const streakUpTo = (k) => { let s = 0; for (let i = 0; i <= k; i++) { if (myAnswers[i]?.correct) s++; else s = 0; } return s; };
  const myPtsFor = (k) => { const a = myAnswers[k]; if (!a || !a.correct) return 0; return quizPts(a.elapsed) + (streakUpTo(k) >= 2 ? 100 : 0); };

  // Reyting (jonli) / solo hisob
  const board = players.map(p => { const s = quizScore(qRows.filter(r => r.player_id === p.id)); return { id: p.id, nickname: p.nickname, ...s }; }).sort((a, b) => b.pts - a.pts || b.ok - a.ok);
  const myRank = live.playerId ? board.findIndex(b => b.id === live.playerId) : -1;
  const soloRows = Object.entries(myAnswers).map(([k, v]) => ({ player_id: 'me', screen_idx: QUIZ_BASE_IDX + Number(k), correct: v.correct, elapsed_ms: v.elapsed }));
  const soloScore = quizScore(soloRows);

  const Q = qi >= 0 && qi < QUIZ_BANK.length ? QUIZ_BANK[qi] : null;
  // Hisoblagichlar: server qatorlari + O'Z javobim hali kelmagan bo'lsa lokal qo'shiladi
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

  // Mentor test o'rtasida ✕ bossa — ogohlantiramiz: sinf arenada kutib qoladi.
  const closeArena = () => {
    if (isMentor && !solo && phase !== 'done') {
      if (!window.confirm(tr({ uz: "Test hali yakunlanmadi — yopsangiz o'quvchilar arenada kutib qoladi.\nKeyin «⚔️ Davom ettirish» bilan aynan shu joydan qaytishingiz mumkin.\n\nBaribir yopilsinmi?", ru: 'Тест ещё не завершён — если закроете, ученики останутся ждать на арене.\nПотом кнопкой «⚔️ Продолжить» вы вернётесь ровно на это место.\n\nВсё равно закрыть?' }))) return;
    }
    onClose();
  };

  return (
    <div className="qz-arena">
      <div className="qz-bg" aria-hidden="true">
        {QZ_BG_SHAPES.map((s, i) => (
          <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{s.ch}</span>
        ))}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>

      {/* QUTQARUV: jonli dars tugadi — o'quvchi osilib qolmaydi, mashq rejimida davom etadi */}
      {classEnded && isStudent && !solo && phase !== 'done' && (
        <div className="qz-endnote fade-step">
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжите тест самостоятельно:' })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: 'Mashq rejimida davom etish', ru: 'Продолжить в режиме тренировки' })}</button>
        </div>
      )}

      {/* ===== LOBBY ===== */}
      {phase === 'lobby' && (
        <div className="qz-view fade-step">
          <CsWordmark />
          <p className="qz-sub" style={{ marginTop: -4 }}>{tr({ uz: "Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi!", ru: 'Чем быстрее правильный ответ — тем больше баллов. Серия верных ответов даёт 🔥 бонус!' })}</p>
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

      {/* ===== SAVOL ===== */}
      {phase === 'q' && Q && (
        <div className="qz-view qz-qview fade-step" key={`q${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr({ uz: 'Savol', ru: 'Вопрос' })} <b>{qi + 1}</b>/{QUIZ_BANK.length}</span>
            <QzTimer remaining={remaining} />
            {isMentor
              ? <span className="qz-ansn">📨 {answeredN}/{players.length}</span>
              : <span className="qz-ansn">{streakUpTo(qi - 1) >= 2 ? `🔥 ketma-ket ${streakUpTo(qi - 1)} ta` : ' '}</span>}
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

      {/* ===== NATIJA (reveal) ===== */}
      {phase === 'reveal' && Q && (
        <div className="qz-view qz-qview fade-step" key={`r${qi}`}>
          <div className="qz-top">
            <span className="qz-count">{tr({ uz: 'Savol', ru: 'Вопрос' })} <b>{qi + 1}</b>/{QUIZ_BANK.length} — natija</span>
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
                ? <><span className="qz-res-pts">+{myPtsFor(qi)}</span><span className="qz-res-t">ball{streakUpTo(qi) >= 2 ? ` · 🔥 ketma-ket ${streakUpTo(qi)} ta` : ''}</span></>
                : <span className="qz-res-t">{my ? "Adashdingiz — 0 ball. Keyingisida olasiz." : tr({ uz: 'Vaqt tugadi — 0 ball. Keyingi savolda ulguring.', ru: 'Время вышло — 0 баллов. Успейте на следующем вопросе.' })}</span>}
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
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? '🏁 Natijani ko\'rish' : tr({ uz: 'Keyingi →', ru: 'Дальше →' })}</button>}
        </div>
      )}

      {/* ===== YAKUN — PODIUM ===== */}
      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr({ uz: '🏆 Test yakunlandi!', ru: '🏆 Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">ball · {soloScore.ok}/{QUIZ_BANK.length} to'g'ri{soloScore.maxStreak >= 2 ? ` · eng uzun ketma-ketlik 🔥 ${soloScore.maxStreak} ta` : ''}</p>
              <button className="qz-btn big" onClick={soloReplay}>{tr({ uz: '↻ Qayta ishlash', ru: '↻ Пройти заново' })}</button>
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
                      {b && <span className="qz-pod-pts">{b.pts} ball · {b.ok}/{QUIZ_BANK.length}</span>}
                      <div className="qz-pod-bar" />
                    </div>
                  );
                })}
              </div>
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{myRank + 1}-o'rin</b> · {board[myRank].pts} ball</p>}
              <div className="qz-board wide">
                {board.map((b, i) => (
                  <div key={b.id} className={`qz-brow ${b.id === live.playerId ? 'me' : ''}`}>
                    <span className="qz-brank">{i + 1}</span><span className="qz-bname">{b.nickname}</span>
                    {b.maxStreak >= 2 && <span className="qz-bstreak">🔥 {b.maxStreak}</span>}
                    <span className="qz-bok">{b.ok}/{QUIZ_BANK.length}</span>
                    <span className="qz-bpts">{b.pts}</span>
                  </div>
                ))}
              </div>
              {isStudent && <button className="qz-btn" onClick={startPractice}>{tr({ uz: '↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi)', ru: '↻ Пройти тест заново — тренировка (в таблицу не идёт)' })}</button>}
            </>
          )}
          <button className="qz-btn ghost" onClick={closeArena}>{tr({ uz: 'Arenani yopish', ru: 'Закрыть арену' })}</button>
        </div>
      )}
    </div>
  );
}

export default function PmMuammoIzlash({ lang: langProp, onFinished, liveToken }) {
  const lang = langProp || 'uz';
  __lang = lang; // UZ-RU: tr() uchun joriy til (render'dan oldin o'rnatiladi)
  setLiveLang(lang); // jonli-modul tarjimoni ham shu tilda
  // F-0730-01: saqlangan progress bir marta o'qiladi (jonli-o'quvchi mentor
  // darvozasidan oshib ketmasin — liveRead'dagi lastScreen bilan clamp).
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
  // 🏅 Nishonlar
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

  // ETALON — 1920px (InternetLesson): keng oynada proportsional kattalashadi, <=1920 da z=1
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // 🃏 Flashcard ekrani jonli darsda (mentor boshqaruvida) o'quvchida ko'rsatilmaydi — o'tkazib yuboriladi
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 's17');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });
  const recordAnswer = (idx, data) => {
    setAnswers(a => ({ ...a, [idx]: data }));
    const _m = SCREEN_META[idx];
    // Q1 (19.09): UYDA (solo) maxsus test javobi ham serverga — rasmiy natijada sanalsin (oldin faqat jonli darsda
    // yuborilardi → «javobsiz»). `picked` kalitdan: server `data.correct` (birinchi urinish) ni oladi. MCQ o'zi `recordAttempt`
    // bilan yozadi — takrori serverda e'tiborsiz (on conflict do nothing). «Qaytadan» mashqida yuborilmaydi (151-qonun 6-band).
    if (_m && _m.scored && live.mode === 'solo' && !firstPassRef.current && data && (data.solved === true || data.correct === true) && !soloSentRef.current.has(idx)) {
      const key = INLINE_KEYS[_m.id];
      if (Number.isInteger(key)) { soloSentRef.current.add(idx); live.submitAnswer(idx, _m.id, key < 0 ? 0 : (data.correct ? key : (key === 0 ? 1 : 0)), !!data.correct, data.elapsedMs || 0); }
    }
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]); // 🏅 nishon

  };
  const reset = () => { if (!firstPassRef.current) { firstPassRef.current = { answers, durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000) }; setFpPractice(true); } progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); setAchToasts([]); };
  // F-0730-01: har o'zgarishda progress saqlanadi (screen + javoblar + nishonlar + boshlangan vaqt)
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], missed: [...missedRef.current], firstPass: firstPassRef.current, startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned, missed, fpPractice]);

  // Javob kaliti: inline testlar + jang savollari (QUIZ_BANK'dan) — mentor ochganda serverga yuklanadi
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken }); // liveToken — LMS'dan (avval null, keyin keladi)
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS }); // server-progress: davom / ko'rish / toza boshlash
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line

  const finishLesson = () => {
    progClear(LESSON_META.lessonId); // F-0730-01: yakunlangan dars saqlovi tozalanadi
    live.endSession();
    const fp = firstPassRef.current; // 151-qonun 6-band: «Qaytadan» bosilgan bo'lsa — BIRINCHI o'tish natijasi ketadi
    const ans = fp ? fp.answers : answers;
    const scoredMeta = SCREEN_META.filter(s => s.scored);
    const finalMeta = scoredMeta.filter(s => s.scope === 'final');
    const scoredAnswers = SCREEN_META.map((s, i) => (s.scored ? ans[i] : null)).filter(Boolean);
    const correctAnswers = scoredAnswers.filter(a => a.correct).length;
    const finalCorrect = SCREEN_META.map((s, i) => (s.scored && s.scope === 'final' ? ans[i] : null)).filter(Boolean).filter(a => a.correct).length;
    const payload = {
      lessonId: LESSON_META.lessonId, lessonTitle: LESSON_META.lessonTitle,
      nickname: live.nickname || null, livePin: live.pin || null, liveMode: live.mode,
      durationSec: fp ? fp.durationSec : Math.floor((Date.now() - startTimeRef.current) / 1000),
      totalQuestions: scoredMeta.length, correctAnswers,
      scorePercent: scoredMeta.length ? Math.round((correctAnswers / scoredMeta.length) * 100) : 0,
      finalScore: finalCorrect, finalTotal: finalMeta.length,
      passed: finalMeta.length ? finalCorrect / finalMeta.length >= 0.6 : (scoredMeta.length ? correctAnswers / scoredMeta.length >= 0.6 : false),
      answers: SCREEN_META.map((_s, i) => ans[i]).filter(Boolean),
      ...buildResultDetails({ lessonId: LESSON_META.lessonId, screenMeta: SCREEN_META, answers: ans, earned, achievements: ACHIEVEMENTS, arenaBank: QUIZ_BANK })
    };
    if (typeof onFinished === 'function') onFinished(sealPayload(LESSON_META.lessonId, payload));
  };

  const screens = [ScrHook, ScrGoal, ScrObserve, ScrTest1, ScrStars, ScrTest2, ScrTwoQ, ScrCase, ScrWorkshop, ScrRank, ScrTest3, ScrEvidence, ScrCoding, ScrTestFinal, ScrRecap, ScreenPodium, ScreenFlashcards, ScrSummary];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
      <style>{`
        /* PRODUCTION: shu @import OLIB TASHLANADI — shriftlarni LMS yuklaydi (platform_contract). */
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
        .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }

        /* 11.15 — jonli-holat rozetkasi xira turadi, kerak bo'lganda ustiga borilsa yoritiladi */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease, box-shadow 0.25s ease; }
        .live-badge:hover, .live-badge:focus-within { opacity: 1; box-shadow: 0 8px 24px -6px rgba(40,34,82,0.32) !important; }
        @media (hover: none) { .live-badge { opacity: 0.62; } }

        .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
        .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
        .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }
        .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }

        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-in-up 0.45s cubic-bezier(.2,.7,.2,1) forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; } .delay-4 { animation-delay: 0.48s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }
        .fade-step { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }
        .zoomable { position: relative; }
        .flow-label:has(+ .zoomable.z-empty) { display: none; } /* bo'sh ustun ustida yorliq yolg'iz osilmasin (bridge 40-band) */
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(14,14,16,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }

        /* ===== M2-D3 — muammoni qanday topamiz / MUAMMO-REYTINGI ===== */
        /* Overflow-himoya (19-qonun): o'quvchi kiritmasi ko'rinadigan har konteyner */
        .rk-t, .ws-t, .ws-input, .rs-t, .kdx-card, .reflect-input, .hw-card, .card .t { min-width: 0; overflow-wrap: anywhere; }
        .ta-bulb { font-size: 24px; line-height: 1; }
        .mbypass.mbypass { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.blue}; background: ${T.blueSoft}; border-radius: 10px; padding: 8px 13px; }
        .cls-pulse { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }
        .cls-pulse b { color: ${T.ink}; }

        /* MENTOR-ESLATMA (proyektor-sir) */
        .mnote { background: ${T.blueSoft}; border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 5px; cursor: pointer; }
        .mnote-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.blue}; display: flex; align-items: center; }
        .mnote-x { margin-left: auto; font-weight: 800; font-size: 10.5px; opacity: 0.7; text-transform: none; letter-spacing: 0; }
        .mnote-chip { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; background: ${T.paper}; border: none; box-shadow: inset 0 0 0 1.5px ${T.blue}55; color: ${T.blue}; border-radius: 999px; padding: 4px 12px; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.04em; cursor: pointer; opacity: 0.4; transition: opacity 0.2s ease, transform 0.2s ease; }
        .mnote-chip:hover, .mnote-chip:focus-visible { opacity: 1; transform: translateY(-1px); }
        .mnote-body { margin: 0; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.45; }
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }

        /* Belgi-yorliq (emoji YO'Q — 159/4) · yulduzlar · kuchi-chip */
        .bg-chip { display: inline-flex; align-items: center; align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 12px; white-space: nowrap; }
        .bg-row { display: flex; flex-wrap: wrap; gap: 7px; }
        .stars { color: #E8A13A; letter-spacing: 1px; font-size: 15px; } .stars-off { color: ${T.line}; }
        .k-chip { display: inline-flex; align-items: center; font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 4px 11px; white-space: nowrap; }
        .sc-chip { display: inline-flex; flex-wrap: wrap; gap: 5px; align-items: baseline; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; background: ${T.bg}; border-radius: 10px; padding: 7px 11px; }
        .sc-q { font-weight: 600; color: ${T.ink2}; }

        /* s0 — ikki sharh */
        .rv-pair { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
        .rv-card { display: flex; flex-direction: column; gap: 9px; text-align: left; background: ${T.paper}; border: none; border-radius: 16px; padding: 16px 18px; cursor: pointer; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.22); transition: box-shadow 0.18s, transform 0.18s; min-width: 0; }
        .rv-card:hover:not(:disabled) { transform: translateY(-2px); }
        .rv-card:disabled { cursor: default; }
        .rv-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 22px -10px rgba(91,61,230,0.3); }
        .rv-card.win { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .rv-top { display: flex; align-items: center; gap: 9px; }
        .rv-id { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 13px; color: ${T.ink2}; }
        .rv-tick { margin-left: auto; font-weight: 800; color: ${T.success}; }
        .rv-t { font-family: 'Source Serif 4', serif; font-size: clamp(15px,1.9vw,17px); line-height: 1.45; color: ${T.ink}; }

        /* MUAMMO-REYTINGI — imzo-vizual (s1 preview · s9 reyting). Tepadagi uchtalik FON bilan ajraladi (chiziq emas — 159/1) */
        .rk { display: flex; flex-direction: column; gap: 6px; width: 100%; min-width: 0; }
        .rk-head { display: flex; justify-content: space-between; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink3}; padding: 0 12px; min-height: 14px; }
        .rk-list { position: relative; }
        .rk-band { position: absolute; left: -7px; right: -7px; top: -4px; padding-bottom: 5px; box-sizing: content-box; background: ${T.accentSoft}; border-radius: 14px; transition: height 0.45s ease; }
        .rk-row { position: absolute; left: 0; right: 0; top: 0; height: 40px; margin-top: 3px; display: flex; align-items: center; gap: 10px; padding: 0 12px; background: ${T.paper}; border-radius: 11px; box-shadow: 0 4px 12px -8px rgba(${T.shadowBase},0.25); transition: transform 0.6s cubic-bezier(.3,1.1,.4,1), box-shadow 0.2s; }
        .rk-row.act { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .rk-n { width: 22px; height: 22px; border-radius: 50%; background: ${T.bg}; color: ${T.ink2}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 11.5px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .rk-t { flex: 1; font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; color: ${T.ink}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rk-sc { display: inline-flex; gap: 8px; flex-shrink: 0; animation: fade-step 0.34s ease both; }
        .rk-dots { display: inline-flex; gap: 3px; } .rk-dots i { width: 7px; height: 7px; border-radius: 50%; background: ${T.line}; } .rk-dots i.on { background: ${T.accent}; }
        .rk-k { flex-shrink: 0; min-width: 28px; text-align: center; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 13px; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 3px 8px; animation: feat-pop 0.34s cubic-bezier(.2,.7,.2,1) both; }
        .rk-redo { flex-shrink: 0; background: none; border: none; cursor: pointer; color: ${T.ink3}; font-size: 14px; padding: 2px 5px; border-radius: 7px; }
        .rk-redo:hover { color: ${T.accent}; background: ${T.accentSoft}; }
        .rk-demo { max-width: 640px; width: 100%; align-self: center; }
        /* Kirish faqat opacity + mustaqil translate bilan — inline transform (reyting o'rni) buzilmaydi */
        .rk-demo.ph-0 .rk-row { opacity: 0; animation: rk-in 0.4s cubic-bezier(.2,.7,.2,1) forwards; animation-delay: var(--rd, 0s); }
        @keyframes rk-in { from { opacity: 0; translate: 0 10px; } to { opacity: 1; translate: 0 0; } }
        @media (prefers-reduced-motion: reduce) {
          .rk-row, .rk-band { transition: none; } .rk-demo .rk-row { opacity: 1; animation: none; } .rk-k, .rk-sc { animation: none; }
        }

        /* s2 — soat-lentasi */
        .tl { display: flex; flex-direction: column; gap: 9px; max-width: 720px; }
        .tl-card { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; text-align: left; background: ${T.paper}; border: none; border-radius: 13px; padding: 12px 15px; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.18); font: inherit; cursor: default; min-width: 0; }
        .tl-card.col { cursor: pointer; }
        .tl-card.quiet { opacity: 0.55; }
        .tl-time { font-weight: 800; font-size: 12.5px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 8px; padding: 3px 8px; }
        .tl-t { flex: 1 1 260px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(13.5px,1.6vw,15px); color: ${T.ink}; line-height: 1.45; min-width: 0; }
        .tl-next { align-self: flex-start; display: inline-flex; align-items: center; gap: 10px; }
        .tl-cnt { font-size: 12px; opacity: 0.8; }

        /* s4 — yulduz-surgich */
        .sg { display: flex; flex-direction: column; gap: 12px; max-width: 640px; }
        .sg-range { width: 100%; height: 8px; margin: 8px 0 2px; -webkit-appearance: none; appearance: none; border-radius: 99px; cursor: pointer; background: linear-gradient(90deg, ${T.accent} 0 var(--fill, 0%), ${T.line} var(--fill, 0%) 100%); outline: none; }
        .sg-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: ${T.paper}; border: 3px solid ${T.accent}; box-shadow: 0 4px 12px -3px rgba(${T.shadowBase},0.45); transition: transform 0.15s; }
        .sg-range::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: ${T.paper}; border: 3px solid ${T.accent}; box-shadow: 0 4px 12px -3px rgba(${T.shadowBase},0.45); }
        .sg-range:hover::-webkit-slider-thumb, .sg-range:focus-visible::-webkit-slider-thumb { transform: scale(1.12); }
        @media (prefers-reduced-motion: reduce) { .sg-range::-webkit-slider-thumb { transition: none; } }
        .sg-scale { display: flex; justify-content: space-between; gap: 6px; }
        .sg-tick { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink3}; background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 8px; }
        .sg-tick.seen { color: ${T.ink2}; } .sg-tick.cur { color: ${T.accent}; background: ${T.accentSoft}; }
        .sg-card { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.22); }
        .sg-t.sg-t { margin: 0; font-family: 'Source Serif 4', serif; font-size: clamp(15px,1.9vw,17px); line-height: 1.45; color: ${T.ink}; }

        /* s6 — tap-ochilma baho-kartalar (toggle) */
        .tq { display: flex; flex-direction: column; gap: 9px; max-width: 720px; }
        .tq-card { background: ${T.paper}; border-radius: 13px; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16); overflow: hidden; }
        .tq-card.on { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 6px 16px -8px rgba(91,61,230,0.22); }
        .tq-btn { display: flex; align-items: center; gap: 11px; width: 100%; background: none; border: none; padding: 13px 15px; cursor: pointer; text-align: left; }
        .tq-id { width: 24px; height: 24px; border-radius: 50%; background: ${T.bg}; color: ${T.ink2}; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .tq-card.seen .tq-id { background: ${T.accent}; color: #fff; }
        .tq-t { flex: 1; font-family: 'Manrope'; font-weight: 600; font-size: clamp(13.5px,1.6vw,15px); color: ${T.ink}; }
        .tq-caret { color: ${T.ink3}; font-size: 12px; }
        .tq-body { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 0 15px 14px 50px; }
        .k-miss.k-hit { color: ${T.success}; background: ${T.successSoft}; }

        /* s8 — ustaxona (48/80-qolip) */
        .ws-dots { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
        .wd { width: 22px; height: 22px; border-radius: 50%; background: ${T.line}; color: #fff; font-size: 11px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; transition: background 0.25s; }
        .wd.ok { background: ${T.success}; }
        .wd.cur { background: ${T.accent}; box-shadow: 0 0 0 3px ${T.accentSoft}; animation: wd-pulse 1.6s ease-in-out infinite; }
        @keyframes wd-pulse { 0%,100% { box-shadow: 0 0 0 3px ${T.accentSoft}; } 50% { box-shadow: 0 0 0 6px ${T.accentSoft}; } }
        .wd-n { margin-left: 6px; font-weight: 800; font-size: 13px; color: ${T.ink2}; }
        .ws-card { display: flex; flex-direction: column; gap: 10px; background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.24); max-width: 760px; width: 100%; }
        .ws-input { font-family: 'Manrope'; font-size: 15.5px; line-height: 1.45; color: ${T.ink}; border: none; border-radius: 11px; padding: 12px 14px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; resize: vertical; width: 100%; }
        .ws-input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .ws-guide { display: flex; flex-wrap: wrap; gap: 6px 16px; }
        .ws-g { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; transition: color 0.2s; }
        .ws-hint.ws-hint { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 13px; }
        .ws-hint-sub { display: block; font-weight: 500; font-size: 12px; color: ${T.ink2}; margin-top: 3px; }
        .ws-row { display: flex; flex-wrap: wrap; align-items: center; gap: 9px; }
        .ws-tog { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; background: ${T.bg}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; }
        .ws-tog[aria-expanded="true"] { color: ${T.accent}; background: ${T.accentSoft}; }
        .ws-nm.ws-nm { margin: 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; background: ${T.bg}; border-radius: 10px; padding: 10px 14px; }
        .ws-list { display: flex; flex-direction: column; gap: 7px; max-width: 760px; }
        .ws-item { display: flex; align-items: center; gap: 10px; background: ${T.paper}; border-radius: 11px; padding: 9px 12px; box-shadow: 0 4px 12px -8px rgba(${T.shadowBase},0.22); }
        .ws-n { font-weight: 800; font-size: 12px; color: ${T.ink3}; width: 18px; flex-shrink: 0; }
        .ws-t { flex: 1; font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; color: ${T.ink}; }
        .ws-edit { flex-shrink: 0; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink3}; background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 8px; }
        .ws-edit:hover { color: ${T.accent}; background: ${T.accentSoft}; }
        @media (prefers-reduced-motion: reduce) { .wd.cur { animation: none; } }

        /* s9 — baho-karta + reyting (split, narrow YO'Q — 28-qonun) */
        .rs-split { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: clamp(14px,2.4vw,26px); align-items: start; }
        @media (max-width: 760px) { .rs-split { grid-template-columns: 1fr; } }
        .rs-card { display: flex; flex-direction: column; gap: 11px; background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.24); min-width: 0; }
        .rs-lbl { font-size: 12px; font-weight: 800; color: ${T.ink3}; }
        .rs-t.rs-t { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2vw,19px); line-height: 1.35; color: ${T.ink}; }
        .rs-star.rs-star, .rs-empty.rs-empty { margin: 0; font-size: 13.5px; color: ${T.ink2}; line-height: 1.5; }
        .sr { display: flex; flex-direction: column; gap: 11px; }
        .sr-q { display: flex; flex-direction: column; gap: 7px; }
        .sr-l { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .sr-opts { display: flex; flex-wrap: wrap; gap: 7px; }
        .sr-opt { font-family: 'Manrope'; font-weight: 700; font-size: 13px; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 11px; padding: 10px 14px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: all 0.16s; }
        .sr-opt:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .sr-opt.on { background: ${T.accent}; color: #fff; box-shadow: none; }
        .sr-opt:disabled { cursor: default; opacity: 0.6; }

        /* s11 — dalildan baho */
        .dv-done { display: flex; flex-wrap: wrap; gap: 7px; }
        .dv-pill { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink3}; background: ${T.paper}; border-radius: 99px; padding: 6px 13px; box-shadow: 0 4px 12px -8px rgba(${T.shadowBase},0.2); }
        .dv-pill.cur { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .dv-pill.ok { color: ${T.success}; background: ${T.successSoft}; box-shadow: none; }
        .dv-card { display: flex; flex-direction: column; gap: 11px; background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 10px 26px -12px rgba(${T.shadowBase},0.24); max-width: 760px; }
        .dv-card.miss { animation: shake 0.42s; }
        .dv-t.dv-t { margin: 0; font-family: 'Source Serif 4', serif; font-size: clamp(15px,1.9vw,17px); line-height: 1.45; color: ${T.ink}; }
        .dv-hint.dv-hint { margin: 0; font-size: 13px; color: ${T.ink}; background: ${T.bg}; border-radius: 10px; padding: 9px 13px; }
        .dv-m { display: flex; flex-direction: column; gap: 6px; }
        .dv-hid { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; }
        @media (prefers-reduced-motion: reduce) { .dv-card.miss { animation: none; } }

        /* s14 — sherikka aytish */
        .rcp-say.rcp-say { margin: 0; font-size: 14px; color: ${T.ink2}; line-height: 1.5; }

        /* Uy vazifasi — karta qatorlari */
        .hw-rows { display: flex; flex-direction: column; gap: 4px; }
        .hw-row { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink}; background: ${T.bg}; border-radius: 8px; padding: 5px 10px; }
        .kdx-card.first { background: ${T.accentSoft}; }
        /* KEYS-SLAYD */
        .k-slide { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        .k-slide-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(10px,1.3vw,12px); letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 14px; }
        .k-slide-ic { font-size: clamp(38px,6.5vw,58px); line-height: 1; }
        .k-slide-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(19px,3vw,28px); color: ${T.ink}; margin: 0; }
        .k-slide-body { font-size: clamp(15px,2vw,18px); color: ${T.ink2}; line-height: 1.55; max-width: 620px; margin: 0; } .k-slide-body b { color: ${T.ink}; }
        .k-miss.k-miss { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink2}; background: ${T.bg}; border-radius: 10px; padding: 8px 14px; }
        .k-predict { background: ${T.paper}; border-radius: 18px; padding: clamp(20px,3.4vw,32px); display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; box-shadow: 0 14px 34px -14px rgba(${T.shadowBase},0.24); }
        .k-predict-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3}; }
        .k-predict-q { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(17px,2.4vw,22px); color: ${T.ink}; }
        .k-predict-opts { display: flex; flex-wrap: wrap; justify-content: center; gap: 9px; }
        .k-predict-opt { font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.6vw,14.5px); background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 12px; padding: 12px 18px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: all 0.16s; }
        .k-predict-opt:hover { transform: translateY(-1px); box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .k-nav { display: flex; align-items: center; gap: 12px; }
        .k-dots { display: flex; gap: 6px; margin: 0 auto; }
        .k-dot { width: 8px; height: 8px; border-radius: 50%; background: ${T.ink3}55; }
        .k-dot.fill { background: ${T.accent}88; } .k-dot.cur { background: ${T.accent}; transform: scale(1.3); }

        /* KODING — aylantirish-vizual + to'liq-ekran kompilyator (manba: P0 PmCompiler) */
        .kdx { display: flex; align-items: flex-start; gap: clamp(10px,1.8vw,18px); flex-wrap: wrap; } /* F-0926-05: ustunlar tepasi bir chiziqda */
        .kdx-fn { flex-shrink: 0; border-radius: 14px; overflow: hidden; background: ${CODE.bg}; box-shadow: 0 12px 28px -10px rgba(${T.shadowBase},0.35); }
        .kdx-fn-bar { display: flex; align-items: center; gap: 8px; background: #141C2B; padding: 8px 13px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: #7E92B4; }
        .bb-dots { display: inline-flex; gap: 4px; } .bb-dots i { width: 7px; height: 7px; border-radius: 50%; background: #3A4A63; }
        .kdx-fn-code { display: block; padding: clamp(16px,2.2vw,24px) clamp(16px,2.4vw,26px); font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(12.5px,1.6vw,15.5px); color: ${CODE.text}; white-space: nowrap; }
        .kx-kim { color: #7DB8E8; } .kx-nima { color: ${CODE.attr}; }
        .kdx-arrow { font-size: clamp(22px,3vw,30px); color: ${T.accent}; flex-shrink: 0; align-self: center; animation: kdx-arrow-nudge 1.6s ease-in-out infinite; }
        @keyframes kdx-arrow-nudge { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); } }
        @media (prefers-reduced-motion: reduce) { .kdx-arrow { animation: none; } }
        .kdx-out { flex: 1; min-width: 220px; display: flex; flex-direction: column; gap: 8px; }
        .kdx-card { font-family: Georgia, serif; font-size: clamp(14px,1.8vw,16.5px); line-height: 1.55; color: ${T.ink}; background: ${T.paper}; border-radius: 12px; padding: clamp(12px,1.8vw,16px) clamp(14px,2vw,18px); box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.25); opacity: 0; animation: fade-step 0.45s ease-out forwards; animation-delay: var(--kd, 0.5s); }
        .kdx-cta { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .kod-launch-btn { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px,1.9vw,17px); background: ${T.accent}; color: #fff; border: none; border-radius: 14px; padding: 15px 34px; cursor: pointer; box-shadow: 0 14px 30px -8px rgba(91,61,230,0.6); transition: transform 0.18s, box-shadow 0.18s; }
        .kod-launch-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -8px rgba(91,61,230,0.7); }
        .kdx-skip { margin-top: 2px; background: none; border: none; cursor: pointer; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; text-decoration: underline; text-underline-offset: 3px; padding: 4px 6px; border-radius: 8px; }
        .kdx-skip:hover { color: ${T.accent}; }
        .hc-prev-badge { display: inline-block; font-family: 'Manrope', sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--lvt, ${T.accent}); background: var(--lvs, ${T.accentSoft}); border-radius: 99px; padding: 3px 9px; margin-right: 8px; vertical-align: middle; }
        .code-out-empty { font-family: 'Manrope', sans-serif; font-size: 12.5px; color: ${T.ink3}; font-style: italic; margin: 0; }

        /* RECAP — juftlik-taymer + refleksiya */
        .rcp-flow { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: clamp(12px,2vw,18px); align-items: stretch; }
        .rcp-step { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 12px; }
        .rcp-step-h { display: flex; gap: 11px; align-items: flex-start; }
        .rcp-n { width: 26px; height: 26px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}66; /* F-0926-05 #8: biroz yumshatildi */ font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 0 3px ${T.accentSoft}; }
        .rcp-t { display: block; font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .reflect-input { font-family: 'Manrope'; font-size: 15px; color: ${T.ink}; border: none; border-radius: 10px; padding: 12px 14px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; }
        .reflect-input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }

        /* UYGA VAZIFA — shartnoma-karta */
        .hw-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; }
        .hw-card { text-align: left; background: ${T.paper}; border: none; border-radius: 16px; padding: 16px 18px; cursor: pointer; display: flex; flex-direction: column; gap: 9px; box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.2); transition: all 0.18s; }
        .hw-card:hover:not(.on) { transform: translateY(-2px); box-shadow: 0 14px 28px -12px rgba(${T.shadowBase},0.3); }
        .hw-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 24px -10px rgba(91,61,230,0.3); }
        .hw-card-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.8vw,16px); color: ${T.ink}; }
        .hw-card-list { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; }
        .hw-card-list li { font-family: 'Manrope'; font-size: 13.5px; color: ${T.ink2}; line-height: 1.5; }
        .hw-card-ok { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.success}; }

        /* Umumiy harakat-primitivlar (bo'lak paydo bo'lishi · noto'g'ri bosish silkinishi) */
        @keyframes feat-pop { 0% { transform: scale(.82); opacity: 0; } 60% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes shake { 0%,100% { transform: none; } 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(3px); } }
        /* affordance: bosilmagan karta «meni bos» deb pulsatsiya qiladi — bosilgach ✓ */
        @keyframes tap-hint-card { 0%,100% { box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16); } 50% { box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16), inset 0 0 0 2px ${T.accent}66; } }
        .tap-hint-card { animation: tap-hint-card 1.8s ease-in-out infinite; }
        /* Elementning O'Z chiqish-animatsiyasi bor bo'lsa, puls uni YEB QO'YMASIN (F-0803-22):
           ikkalasi bitta shorthand'da sanaladi, kechikishlar --fd tokeni orqali juftlanadi. */
        .dc-piece.tap-hint-card {
          animation: feat-pop 0.34s cubic-bezier(.2,.7,.2,1) both, tap-hint-card 1.8s ease-in-out infinite;
          animation-delay: var(--fd, 0s), calc(var(--fd, 0s) + 0.8s);
        }
        @media (prefers-reduced-motion: reduce) {
          .tap-hint-card, .dc-piece.tap-hint-card, .dc-piece, .kdx-card { animation: none !important; opacity: 1 !important; }
        }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }

        /* === KNOPKALAR === */
        .btn { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.accent}; color: #fff; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); padding: clamp(11px,1.6vw,13px) clamp(20px,2.5vw,26px); font-size: clamp(13px,1.6vw,15px); }
        .btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 10px 24px -4px rgba(91,61,230,0.45); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.16); }
        .option:hover:not(:disabled) { background: #FBFAFE; transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -8px rgba(18,169,104,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.5 !important; box-shadow: none !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.34) !important; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -7px rgba(${T.shadowBase},0.16); }

        /* === HOOK OPSIYALARI === */
        .hook-option { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.16); }
        .hook-option:hover:not(:disabled):not(.on) { transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .hook-option.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hook-option:disabled { cursor: default; }
        .hook-option .radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hook-option.on .radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        .hook-ack { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink2}; }

        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
        .h-sub { font-size: clamp(17px,2.5vw,22px); }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }

        /* === STAGE === */
        .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(156,151,180,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); }
        .progress-track { height: 3px; background: rgba(156,151,180,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(91,61,230,0.55), 0 0 3px rgba(91,61,230,0.4); }

        /* === FRAME === */
        .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(91,61,230,0.22); }
        .frame-success { background: ${T.successSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(18,169,104,0.22); }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar siqilib, ichidagi matn qirqilardi (F-0802-14 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr; gap: clamp(14px,3vw,20px); } }

        /* === XULOSA-KARTA === */
        .takeaway { background: ${T.successSoft}; border-radius: 14px; padding: 22px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; } .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; }

        /* === YAKUN === */
        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { display: inline-flex; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -7px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; flex-shrink: 0; margin-top: 1px; }
        /* F-0803-08 — UYGA VAZIFA KAPSULASI (PmLesson2 etaloni): yakun sahifasida
           «Endi siz bilasiz» dan KEYIN turadi, bosilganda topshiriq kartasi ochiladi. */
        .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); margin: clamp(18px,2.6vw,28px) auto 0; }
        .sum-top { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .sum-top li { display: flex; align-items: center; gap: 10px; padding: 7px 10px; border-radius: 11px; background: ${T.accentSoft}; font-family: 'Manrope'; font-weight: 600; font-size: 14px; color: ${T.ink}; }
        .sum-top li .t { flex: 1; min-width: 0; } .sum-top .rk-n { background: ${T.paper}; color: ${T.accent}; }
        .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
        @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; padding: clamp(20px,2.8vw,30px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
        .hw-big:hover { transform: translateY(-3px) scale(1.02); }
        .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; color: rgba(255,255,255,0.16); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
        @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
        .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
        @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.03); } 100% { filter: brightness(1); } }
        .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(25px,3.6vw,34px); letter-spacing: 0.02em; }
        .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.9vw,17px); opacity: 0.94; }
        .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.16), transparent); transform: rotate(8deg); animation: hw-shine 4.6s ease-in-out infinite; pointer-events: none; }
        @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); } 50% { box-shadow: 0 0 0 1px rgba(120,60,220,.6), 0 0 40px rgba(124,58,237,.72), 0 0 96px rgba(124,58,237,.4), inset 0 0 60px rgba(124,58,237,.44); } }
        @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
        @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none !important; } }
        .hw ul { display: flex; flex-direction: column; gap: 6px; list-style: none; } .hw li { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; } .hw li b { color: ${T.accent}; } .hw .t { color: ${T.ink2}; }
        .gloss { background: ${T.paper}; border-radius: 12px; box-shadow: 0 6px 16px -7px rgba(${T.shadowBase},0.12); overflow: hidden; }
        .gloss-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 17px; cursor: pointer; } .gloss-head .lbl { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; } .gloss-toggle { font-size: 18px; color: ${T.ink2}; }
        .gloss-body { padding: 0 17px 15px; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink2}; line-height: 1.7; animation: fade-step 0.3s; } .gloss-body b { color: ${T.ink}; }

        /* MOBIL: yig'iladigan Mentor */
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* ===================== JONLI DARS CSS (InternetLesson bilan bir xil) ===================== */
        /* Konfetti */
        /* === Konfetti (yakun bayrami) === */
        .confetti { position: fixed; inset: 0; pointer-events: none; z-index: 1200; overflow: hidden; }
        .confetti-bit { position: absolute; top: -24px; opacity: 0; will-change: transform, opacity; animation-name: confetti-fall; animation-timing-function: cubic-bezier(.25,.6,.45,1); animation-iteration-count: 1; animation-fill-mode: forwards; box-shadow: 0 2px 6px -2px rgba(${T.shadowBase},0.3); }
        @keyframes confetti-fall {
          0% { transform: translateY(-24px) rotate(0deg); opacity: 0; }
          8% { opacity: 1; }
          55% { transform: translateY(48vh) translateX(22px) rotate(320deg); }
          100% { transform: translateY(104vh) translateX(-12px) rotate(680deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .confetti { display: none; } }

        /* === MENTOR STATISTIKASI (jonli test + yozma ish panellari) === */
        .mstats { background: ${T.paper}; border: 1.5px solid rgba(${T.shadowBase},0.12); border-radius: 16px; padding: clamp(14px,2vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 10px 30px -12px rgba(${T.shadowBase},0.18); }
        .mstats-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .mstats-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.blue}; }
        .mstats-n { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink2}; }
        .mstats-reveal { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; background: ${T.paper}; color: ${T.accent}; border: 1px solid ${T.accent}; border-radius: 99px; padding: 7px 14px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.35); transition: all 0.2s; }
        .mstats-reveal:hover { color: #fff; background: ${T.accent}; box-shadow: 0 6px 16px -4px rgba(91,61,230,0.5); }
        .mstats-reveal.ready { color: #fff; background: ${T.accent}; animation: mstats-pulse 1.6s ease-in-out infinite; }
        @keyframes mstats-pulse { 0%,100% { box-shadow: 0 4px 12px -4px rgba(91,61,230,0.5); } 50% { box-shadow: 0 4px 18px 0 rgba(91,61,230,0.55); } }
        @media (prefers-reduced-motion: reduce) { .mstats-reveal.ready { animation: none; } }
        .mstats-prog { height: 7px; background: rgba(${T.shadowBase},0.09); border-radius: 99px; overflow: hidden; }
        .mstats-prog-fill { display: block; height: 100%; border-radius: 99px; background: ${T.blue}; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
        .mstats-prog-fill.full { background: ${T.success}; }
        .mstats-big { display: flex; gap: 10px; flex-wrap: wrap; }
        .mstats-chip { flex: 1; min-width: 96px; display: flex; flex-direction: column; align-items: center; gap: 2px; border-radius: 14px; padding: clamp(10px,1.6vw,14px) 8px; }
        .mstats-chip-n { font-family: 'Manrope'; font-weight: 800; font-size: clamp(24px,3.4vw,34px); line-height: 1; }
        .mstats-chip-t { font-family: 'Manrope'; font-weight: 600; font-size: 12px; }
        .mstats-chip.okc  { background: ${T.successSoft}; } .mstats-chip.okc .mstats-chip-n, .mstats-chip.okc .mstats-chip-t { color: ${T.success}; }
        .mstats-chip.badc { background: ${T.accentSoft}; } .mstats-chip.badc .mstats-chip-n, .mstats-chip.badc .mstats-chip-t { color: ${T.accent}; }
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
        .mstats-warn.mstats-warn { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .mstats-wait { margin: 0; font-size: 12.5px; color: ${T.ink3}; font-style: italic; }
        @media (max-width: 560px) { .mstats-count { min-width: 78px; font-size: 11px; } }
        /* Verdikt + recap tugmalari */
        .mstats-verdict { border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; animation: fade-step 0.3s ease-out; }
        .mstats-verdict.need { background: ${T.accentSoft}; }
        .mstats-verdict.maybe { background: rgba(232,161,58,0.14); }
        .mstats-verdict.good { background: ${T.successSoft}; }
        .mstats-verdict.few { background: rgba(156,151,180,0.12); }
        .mstats-verdict-t { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(13px,1.6vw,15px); line-height: 1.45; color: ${T.ink}; }
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(91,61,230,0.5); transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(91,61,230,0.55); }
        .rc-open.soft { background: ${T.paper}; color: ${T.accent}; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); }
        .rc-open-mini { align-self: flex-start; margin-top: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); transition: all 0.2s; }
        .rc-open-mini:hover { transform: translateY(-1px); }

        /* === 📖 QAYTA TUSHUNTIRISH (recap overlay) — proyektorga katta shrift === */
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
        .rc-vis { margin-top: clamp(4px,1vw,10px); display: flex; justify-content: center; width: 100%; }
        .rc-flow { display: flex; align-items: center; justify-content: center; gap: clamp(6px,1.4vw,12px); flex-wrap: wrap; }
        .rc-chip { font-weight: 700; font-size: clamp(13px,2vw,18px); background: ${T.paper}; color: ${T.ink}; border-radius: 12px; padding: clamp(8px,1.4vw,13px) clamp(12px,2vw,18px); box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.2); white-space: nowrap; }
        .rc-arr { font-size: clamp(15px,2.2vw,22px); color: ${T.accent}; font-weight: 800; }
        .rc-ask { font-weight: 600; font-size: clamp(13px,1.8vw,16px); color: ${T.accent}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 18px; max-width: 660px; }
        .rc-nav { width: 100%; max-width: 880px; display: flex; align-items: center; gap: 14px; flex-shrink: 0; padding-top: 8px; }
        .rc-dots { flex: 1; display: flex; justify-content: center; gap: 8px; }
        .rc-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(156,151,180,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .rc-dot.fill { background: ${T.ink3}; }
        .rc-dot.cur { background: ${T.accent}; width: 26px; }
        .rc-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.7vw,16px); border: none; border-radius: 12px; padding: clamp(11px,1.6vw,14px) clamp(18px,2.6vw,26px); cursor: pointer; background: ${T.accent}; color: #fff; box-shadow: 0 6px 18px -4px rgba(${T.shadowBase},0.32); transition: all 0.2s; white-space: nowrap; }
        .rc-btn:hover:not(:disabled) { background: ${T.accent}; }
        .rc-btn:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
        .rc-btn.ghost { background: transparent; color: ${T.ink2}; box-shadow: none; }
        .rc-btn.ghost:hover:not(:disabled) { background: ${T.paper}; color: ${T.ink}; }
        .rc-btn.done { background: ${T.success}; color: #fff; }
        .rc-btn.done:hover { background: #17603C; }
        @media (max-width: 640px) {
          .rc-nav { flex-wrap: wrap; justify-content: center; row-gap: 10px; }
          .rc-dots { width: 100%; order: -1; }
          .rc-btn { font-size: 13px; padding: 11px 16px; }
        }

        /* === 🃏 FLASHCARDS (reusable, 3D flip) === */
        .fc-center { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding-top: 4px; }
        .fc { display: flex; flex-direction: column; gap: 11px; max-width: 520px; width: 100%; }
        .fc-top { display: flex; justify-content: space-between; align-items: center; }
        .fc-pill { display: inline-flex; align-items: center; gap: 5px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fc-pill-pop 0.35s cubic-bezier(.34,1.5,.4,1); }
        .fc-pill b { font-size: 1.15em; font-variant-numeric: tabular-nums; }
        .fc-pill.learn { background: ${T.accentSoft}; color: ${T.accent}; border: 1.5px solid ${T.accent}44; }
        .fc-pill.knew { background: ${T.successSoft}; color: ${T.success}; border: 1.5px solid ${T.success}44; }
        @keyframes fc-pill-pop { 40% { transform: scale(1.16); } }
        .fc-bar { height: 7px; background: rgba(156,151,180,0.3); border-radius: 99px; overflow: hidden; }
        .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, #FF8A3D, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
        .fc-cardwrap { perspective: 1200px; position: relative; }
        .fc-cardwrap::before, .fc-cardwrap::after { content: ""; position: absolute; left: 0; right: 0; top: 0; bottom: 0; border-radius: 20px; background: ${T.paper}; border: 2px solid rgba(156,151,180,0.3); z-index: -1; }
        .fc-cardwrap::before { transform: translateY(7px) scale(0.965); opacity: 0.7; }
        .fc-cardwrap::after { transform: translateY(15px) scale(0.93); opacity: 0.4; }
        .fc-fly { position: relative; animation: fc-in 0.3s ease; }
        @keyframes fc-in { from { opacity: 0; transform: translateY(10px) scale(0.97); } }
        .fc-fly.out-knew { animation: fc-out-knew 0.42s ease forwards; }
        .fc-fly.out-again { animation: fc-out-again 0.42s ease forwards; }
        @keyframes fc-out-knew { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(70%) rotate(5deg); opacity: 0; } }
        @keyframes fc-out-again { 30% { transform: translateX(0) rotate(0); opacity: 1; } 100% { transform: translateX(-70%) rotate(-5deg); opacity: 0; } }
        .fc-fly.out-knew::after, .fc-fly.out-again::after { position: absolute; top: 50%; left: 50%; z-index: 6; width: 58px; height: 58px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 800; color: #fff; pointer-events: none; animation: fc-stamp 0.3s cubic-bezier(.34,1.6,.4,1); transform: translate(-50%, -50%); }
        .fc-fly.out-knew::after { content: '✓'; background: ${T.success}; box-shadow: 0 10px 26px -8px ${T.success}; }
        .fc-fly.out-again::after { content: '✗'; background: ${T.accent}; box-shadow: 0 10px 26px -8px ${T.accent}; }
        @keyframes fc-stamp { from { transform: translate(-50%, -50%) scale(0); } }
        .fc-card { position: relative; height: clamp(188px,27vh,268px); cursor: pointer; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4,0,.2,1); }
        .fc-card.flip { transform: rotateY(180deg); }
        .fc-card:not(.flip):hover { transform: translateY(-3px); }
        .fc-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 22px; text-align: center; }
        .fc-front { background: ${T.paper}; border: 2px solid rgba(156,151,180,0.3); box-shadow: 0 14px 34px -18px rgba(${T.shadowBase},0.4); }
        .fc-back { background: linear-gradient(160deg, #FF8A3D, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(91,61,230,0.6); }
        .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(18px,2.8vw,23px); color: ${T.ink}; line-height: 1.3; text-wrap: balance; }
        .fc-cue { font-family: 'Manrope'; font-size: 13px; color: ${T.ink3}; }
        .fc-tap { color: ${T.accent}; font-weight: 700; }
        /* F-0803-13/14: javob uzunlikka moslashadi — 4 pog'ona + kod/gap shrift ajrimi */
        .fc-tag { font-weight: 800; letter-spacing: -0.02em; line-height: 1.16; max-width: 100%; text-wrap: balance; overflow-wrap: anywhere; }
        .fc-tag.mono-all { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }
        .fc-tag.prose { font-family: 'Manrope', sans-serif; letter-spacing: -0.005em; }
        .fc-tag .fc-kw { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; }
        .fc-tag.t1 { font-size: clamp(30px,6vw,46px); }
        .fc-tag.t2 { font-size: clamp(24px,4.4vw,34px); }
        .fc-tag.t3 { font-size: clamp(20px,3.4vw,26px); }
        .fc-tag.t4 { font-size: clamp(17px,2.6vw,22px); line-height: 1.3; }
        .fc-actions { display: flex; gap: 10px; min-height: 48px; }
        .fc-btn { flex: 1; padding: 13px; border-radius: 13px; font-family: 'Manrope'; font-weight: 800; font-size: 15px; cursor: pointer; border: none; transition: transform .15s; }
        .fc-btn:hover { transform: translateY(-2px); }
        .fc-btn.knew { background: ${T.success}; color: #fff; box-shadow: 0 10px 22px -10px ${T.success}; }
        .fc-btn.again { background: ${T.paper}; border: 2px solid ${T.accent}66; color: ${T.accent}; }
        .fc-btn.again:hover { border-color: ${T.accent}; background: ${T.accentSoft}; }
        .fc-btn:disabled { opacity: 0.55; cursor: default; transform: none; }
        .fc-btn.ghost { background: ${T.paper}; border: 1.5px solid rgba(156,151,180,0.3); color: ${T.ink}; flex: none; align-self: center; padding: 11px 22px; }
        .fc-hint { margin: 0; min-height: 48px; display: flex; align-items: center; justify-content: center; text-align: center; color: ${T.ink3}; font-style: italic; font-size: 13px; }
        .fc-done { display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center; background: ${T.successSoft}; border-radius: 18px; padding: 22px; max-width: 480px; }
        .fc-done-emoji { font-size: 40px; }
        .fc-done-h { font-family: 'Manrope'; font-weight: 800; font-size: 20px; color: ${T.success}; margin: 0; }
        .fc-done-s { font-family: 'Manrope'; color: ${T.ink2}; margin: 0 0 8px; font-size: 14px; }

        /* === 🏅 ACHIEVEMENTS === */
        /* ===== 🏅 O'YIN USLUBIDAGI TO'LIQ-EKRAN NISHON BAYRAMI ===== */
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
        .acu-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 900; font-size: clamp(12px,1.8vw,14px); letter-spacing: 0.2em; text-transform: uppercase; color: #FFD35A; text-shadow: 0 2px 12px rgba(0,0,0,0.5); animation: acu-rise 0.5s ease-out 0.35s both; }
        .acu-name { font-family: 'Source Serif 4', Georgia, serif; font-weight: 700; font-size: clamp(26px,5.5vw,42px); color: #fff; line-height: 1.1; text-shadow: 0 3px 22px rgba(0,0,0,0.55); animation: acu-rise 0.55s cubic-bezier(.3,1.2,.4,1) 0.45s both; }
        .acu-desc { font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13px,2vw,16px); color: rgba(255,255,255,0.82); max-width: 30ch; line-height: 1.5; animation: acu-rise 0.5s ease-out 0.6s both; }
        @keyframes acu-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .acu-tap { font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; color: rgba(255,255,255,0.5); margin-top: 4px; animation: acu-rise 0.5s ease-out 1.1s both, acu-blink 1.6s ease-in-out 1.6s infinite; }
        @keyframes acu-blink { 0%,100% { opacity: 0.5; } 50% { opacity: 0.85; } }
        @media (prefers-reduced-motion: reduce) { .acu-rays, .acu-medal, .acu-glow, .acu-tap { animation-iteration-count: 1 !important; } .acu-rays { animation: acu-fade 0.4s both !important; } }
        .ach-coll { display: flex; flex-direction: column; gap: 10px; }
        .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
        .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; border-radius: 14px; padding: 14px 10px; transition: transform 0.15s; }
        .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #F5F1FE); border: 1.5px solid ${T.accent}55; }
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed rgba(156,151,180,0.4); opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
        .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; }
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid rgba(156,151,180,0.4); border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(91,61,230,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(91,61,230,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(91,61,230,0); } }
        .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 222px; background: ${T.paper}; border: 1px solid rgba(156,151,180,0.4); border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
        .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
        .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
        .ach-pop-row.got { background: ${T.accentSoft}66; }
        .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
        .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
        .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
        .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink3}; }

        /* === ⚔️ CTA (yakun sahifasida) — vizual CsWordmark'niki, bu faqat o'ram === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }

        /* ===== ⚡ ARENA — tungi-neon turnir muhiti ===== */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, rgba(255,79,40,0.14) 0%, rgba(255,79,40,0) 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
        .qz-arena::before { content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: radial-gradient(rgba(190,150,255,0.08) 1.1px, transparent 1.2px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); }
        .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; }
        @keyframes qz-drift { 0%,100% { transform: translate(0,0) rotate(-6deg) scale(1); } 50% { transform: translate(18px,-24px) rotate(6deg) scale(1.05); } }
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        @media (prefers-reduced-motion: reduce) { .qz-shp { animation: none; } }
        .qz-x { position: fixed; top: 14px; right: 16px; z-index: 10600; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(186,140,255,0.34); background: rgba(255,255,255,0.06); color: #D9C9FF; font-size: 16px; cursor: pointer; box-shadow: 0 0 20px rgba(124,58,237,0.22); backdrop-filter: blur(6px); transition: transform 0.25s, color 0.2s, background 0.2s; }
        .qz-x:hover { color: #F2ECFF; background: rgba(255,255,255,0.12); transform: rotate(90deg); }

        /* ===== ⚡ CODE STRIKE — NEON-KAPSULA (tungi turnir-portali) =====
           Yorug' sahifada qop-qora binafsha kapsula = arenaga PORTAL.
           Ichida darsning o'z QZ_BG_SHAPES tokenlari suzadi (dars-DNK). */
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        /* Yakun-ekran CTA ixcham: so'z kattaligi o'zgarmaydi, faqat kapsula bo'sh joyi qisqaradi
           («Mentorni kuting»dan keyin joy qolib qalin ko'rinmasin — P0 etaloni) */
        .cs-cta .cs-cap { padding: clamp(14px,2vw,24px) clamp(22px,3.2vw,40px); gap: clamp(4px,0.7vw,8px); }
        @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }

        .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
          gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px;
          background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%);
          border: 1.5px solid rgba(186,140,255,0.72);
          box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32);
          animation: cs-ignite 1.5s ease-out both, cs-breathe 3.8s ease-in-out 1.5s infinite; }
        /* Neon yonish-sekvensi: sahifa ochilganda vivyeska lip-lip etib yonadi */
        @keyframes cs-ignite {
          0% { opacity: .22; filter: saturate(.25) brightness(.55); box-shadow: none; }
          32% { opacity: .3; filter: saturate(.3) brightness(.6); box-shadow: none; }
          38% { opacity: 1; filter: none; }
          44% { opacity: .38; filter: saturate(.4) brightness(.65); }
          51% { opacity: 1; filter: none; }
          57% { opacity: .55; filter: saturate(.5) brightness(.75); }
          66%, 100% { opacity: 1; filter: none; } }
        @keyframes cs-breathe {
          0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); }
          50% { box-shadow: 0 0 0 1px rgba(110,55,210,.6), 0 0 40px rgba(140,72,255,.75), 0 0 96px rgba(140,72,255,.42), inset 0 0 60px rgba(140,72,255,.44); } }

        /* Kontur bo'ylab yuguruvchi tok-chizig'i */
        .cs-ring { position: absolute; inset: 0; border-radius: inherit; padding: 2.5px; pointer-events: none; z-index: 4;
          background: conic-gradient(from var(--csa), transparent 0 80%, rgba(201,166,255,0) 80%, rgba(201,166,255,.9) 91%, #FFFFFF 96%, transparent 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude;
          animation: cs-current 3.4s linear infinite; }
        @keyframes cs-current { to { --csa: 360deg; } }

        /* Dars-DNK: suzuvchi tokenlar + tezlik-chiziqlar + yashin-flash */
        .cs-sky { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .cs-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; line-height: 1; user-select: none;
          color: rgba(203,173,255,.32); text-shadow: 0 0 12px rgba(150,95,255,.4);
          animation: cs-float ease-in-out infinite; animation-duration: calc(var(--d,22s) / var(--spd,1)); will-change: transform; }
        .cs-tok.back { color: rgba(150,115,240,.16); filter: blur(.6px); }
        @keyframes cs-float { 0%,100% { transform: translate(0,0) rotate(-5deg); } 50% { transform: translate(16px,-14px) rotate(5deg); } }
        .cs-dash { position: absolute; height: 2px; border-radius: 2px; background: linear-gradient(90deg, transparent, rgba(190,150,255,.55), transparent); animation: cs-dash-run 5.5s linear infinite; }
        @keyframes cs-dash-run { 0% { transform: translateX(-46px); opacity: 0; } 14% { opacity: .85; } 86% { opacity: .85; } 100% { transform: translateX(76px); opacity: 0; } }
        .cs-thunder { position: absolute; inset: 0; opacity: 0; background: radial-gradient(62% 95% at 50% 0%, rgba(222,192,255,.55), transparent 64%); animation: cs-thunder 6.4s linear infinite; }
        @keyframes cs-thunder { 0%, 90.5%, 100% { opacity: 0; } 91.4% { opacity: .5; } 92.3% { opacity: .07; } 93.4% { opacity: .38; } 95% { opacity: 0; } }

        /* Yon chaqmoqlar + hover-uchqunlar */
        .cs-row { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; gap: clamp(14px,2.6vw,30px); }
        .csn-boltwrap { position: relative; display: inline-flex; flex: none; }
        /* Chaqmoqlar TIK turadi (aks/burilish yo'q) va TEZLIK RAMZIday chaqib turadi: yarq-yarq razryad + mikro-silkinish, navbatma-navbat */
        .csn-bolt { width: clamp(30px,4.6vw,54px); height: auto; filter: drop-shadow(0 0 9px rgba(170,120,255,.75)); animation: cs-bolt-strike 2s linear infinite; }
        .csn-boltwrap.flip .csn-bolt { animation-delay: 1s; }
        @keyframes cs-bolt-strike {
          0%, 100% { filter: drop-shadow(0 0 9px rgba(170,120,255,.75)) brightness(1); transform: translateY(0) scale(1); }
          5% { filter: drop-shadow(0 0 26px rgba(230,205,255,1)) brightness(2.4); transform: translateY(2px) scale(1.14); }
          9% { filter: drop-shadow(0 0 7px rgba(170,120,255,.55)) brightness(.9); transform: translateY(0) scale(.97); }
          13% { filter: drop-shadow(0 0 20px rgba(215,185,255,.95)) brightness(1.8); transform: translateY(1px) scale(1.07); }
          20% { filter: drop-shadow(0 0 9px rgba(170,120,255,.75)) brightness(1); transform: translateY(0) scale(1); } }
        .cs-spark { position: absolute; width: 5px; height: 5px; border-radius: 50%; background: #E7D9FF; box-shadow: 0 0 9px rgba(190,150,255,.95); opacity: 0; pointer-events: none; }
        .cs-spark.s1 { top: 6%; left: 72%; --sx: 15px; --sy: -16px; }
        .cs-spark.s2 { top: 50%; left: -10%; --sx: -17px; --sy: -10px; animation-delay: .3s !important; }
        .cs-spark.s3 { top: 80%; left: 74%; --sx: 13px; --sy: 12px; animation-delay: .55s !important; }
        .cs-cap:hover .cs-spark { animation: cs-spark-fly .9s ease-out infinite; }
        @keyframes cs-spark-fly { 0% { opacity: 0; transform: translate(0,0) scale(.4); } 22% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--sx,14px), var(--sy,-16px)) scale(1); } }

        /* Wordmark: oq→siyohrang neon, qiya-sport uslub */
        .cs-word { position: relative; z-index: 2; display: inline-block; font-family: 'Manrope','Manrope Fallback',sans-serif; font-weight: 900; font-style: italic;
          font-size: clamp(30px,6.2vw,72px); letter-spacing: .015em; line-height: 1.06; white-space: nowrap; padding-right: .06em;
          background: linear-gradient(180deg,#FFFFFF 10%,#E4D6FF 46%,#A97CFF 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
          animation: cs-wglow 2.8s ease-in-out infinite; }
        .cs-word::before { content: attr(data-text); position: absolute; left: 0; top: 0; width: 100%; padding-right: inherit; pointer-events: none;
          background: linear-gradient(100deg, transparent 34%, rgba(255,255,255,.95) 48%, rgba(255,255,255,.4) 54%, transparent 66%); background-size: 260% 100%;
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
          animation: cs-glint 3.4s cubic-bezier(.6,0,.4,1) infinite; }
        @keyframes cs-wglow {
          0%,100% { filter: drop-shadow(0 3px 0 rgba(38,10,88,.9)) drop-shadow(0 0 14px rgba(150,90,255,.5)); }
          50% { filter: drop-shadow(0 3px 0 rgba(38,10,88,.9)) drop-shadow(0 0 27px rgba(172,112,255,.95)); } }
        @keyframes cs-glint { 0% { background-position: 135% 0; } 60%,100% { background-position: -55% 0; } }
        .cs-clickable:hover .cs-word { animation-duration: 1.4s; }

        /* HUD-chiziq: turnir-tablo uslubidagi neon-pilyulalar */
        .cs-hud { position: relative; z-index: 2; display: flex; gap: clamp(7px,1.1vw,11px); align-items: center; justify-content: center; flex-wrap: wrap;
          font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: clamp(10px,1.3vw,13px); letter-spacing: .14em; color: #D9C9FF; }
        .cs-hud-i { display: inline-flex; align-items: baseline; gap: 5px; background: rgba(255,255,255,.055); border: 1px solid rgba(190,150,255,.42); border-radius: 999px; padding: 6px 14px; text-shadow: 0 0 10px rgba(160,100,255,.55); }
        .cs-hud-i b { font-size: clamp(13px,1.7vw,17px); color: #fff; }
        .cs-hud-dot { color: rgba(190,150,255,.6); }

        .cs-enter { position: relative; z-index: 2; font-family: 'Manrope'; font-weight: 900; font-size: clamp(13px,1.8vw,17px); color: #C9A6FF; letter-spacing: .01em; text-shadow: 0 0 12px rgba(150,90,255,.6); animation: cs-enter-pulse 1.3s ease-in-out infinite; }
        .cs-enter.wait { color: #8C86A8; text-shadow: none; animation: none; }
        @keyframes cs-enter-pulse { 0%,100% { opacity: .72; transform: translateY(0) scale(1); } 50% { opacity: 1; transform: translateY(2px) scale(1.03); } }

        /* Holatlar: xira kutish · jonli LIVE · bosish-portal */
        .cs-clickable { cursor: pointer; user-select: none; transition: transform .18s cubic-bezier(.2,1,.3,1); outline: none; }
        .cs-clickable:hover { transform: scale(1.015); --spd: 2.2; }
        .cs-clickable:active { transform: scale(.99); }
        .cs-clickable:focus-visible { outline: 2px dashed rgba(186,140,255,.8); outline-offset: 6px; }
        .cs-off { filter: saturate(.45) brightness(.74); animation: cs-ignite 1.5s ease-out both, cs-breathe 6.5s ease-in-out 1.5s infinite; }
        .cs-off .cs-ring, .cs-off .cs-thunder { display: none; }
        .cs-live { animation: cs-ignite 1.2s ease-out both, cs-breathe 1.7s ease-in-out 1.2s infinite; }
        .cs-livedot { position: absolute; top: clamp(12px,1.8vw,20px); right: clamp(18px,3vw,30px); z-index: 4; display: inline-flex; align-items: center; gap: 6px;
          font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
        .cs-livedot i { width: 8px; height: 8px; border-radius: 50%; background: #3CFF8E; box-shadow: 0 0 10px #3CFF8E; animation: cs-liveblink 1.1s ease-in-out infinite; }
        @keyframes cs-liveblink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        .cs-charging { animation: cs-charge .45s ease-in forwards !important; }
        @keyframes cs-charge { to { transform: scale(1.05); filter: brightness(1.75) saturate(1.35); } }
        .cs-portal { position: fixed; inset: 0; z-index: 10400; pointer-events: none;
          background: radial-gradient(52% 52% at 50% 55%, rgba(210,180,255,.95), rgba(124,58,237,.55) 42%, transparent 76%);
          animation: cs-portal-in .9s ease-in-out both; }
        @keyframes cs-portal-in { 0% { opacity: 0; transform: scale(.55); } 48% { opacity: 1; transform: scale(1.35); } 100% { opacity: 0; transform: scale(1.7); } }

        @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-hud-i, .cs-portal { animation: none !important; } }
        @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } .cs-livedot { top: 10px; right: 14px; } }
        .qz-view { position: relative; z-index: 1; width: 100%; max-width: 820px; display: flex; flex-direction: column; align-items: center; gap: clamp(14px,2.4vw,22px); margin: auto; }
        .qz-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(22px,4vw,36px); color: #F2ECFF; margin: 0; text-align: center; letter-spacing: -0.02em; text-shadow: 0 0 24px rgba(150,95,255,0.35); }
        .qz-sub { font-family: 'Manrope'; font-size: clamp(13px,1.9vw,16px); color: #B9A8E6; margin: 0; text-align: center; max-width: 540px; line-height: 1.55; font-weight: 500; }
        .qz-sub b { color: #F2ECFF; }
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
        .qz-btn.ghost:hover:not(:disabled) { box-shadow: 0 0 34px rgba(140,72,255,0.6), inset 0 1px 0 rgba(255,255,255,0.2); }
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
        .qz-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(19px,3.2vw,28px); color: #F2ECFF; margin: 0; text-align: center; line-height: 1.35; background: rgba(255,255,255,0.05); border: 1px solid rgba(186,140,255,0.34); border-radius: 20px; padding: clamp(18px,2.8vw,28px) clamp(18px,3vw,30px); width: 100%; box-shadow: 0 0 34px rgba(124,58,237,0.28), inset 0 1px 0 rgba(255,255,255,0.06); backdrop-filter: blur(8px); text-wrap: balance; }
        .qz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(11px,1.6vw,15px); width: 100%; }
        @media (max-width: 560px) { .qz-grid { grid-template-columns: 1fr; } }
        .qz-tile { --gl: 255,255,255; position: relative; display: flex; align-items: center; gap: 14px; border: none; border-radius: 18px; padding: clamp(15px,2.4vw,22px) clamp(14px,2.2vw,20px); cursor: pointer; text-align: left; min-height: 66px; color: #fff; overflow: hidden; box-shadow: 0 10px 26px -12px rgba(0,0,0,0.55), 0 0 26px -4px rgba(var(--gl),0.42), inset 0 2px 0 rgba(255,255,255,0.32), inset 0 -4px 0 rgba(0,0,0,0.22), inset 0 0 0 1.5px rgba(0,0,0,0.24); transition: transform 0.14s, opacity 0.3s, box-shadow 0.14s, filter 0.2s; }
        .qz-grid .qz-tile:nth-child(1) { --gl: 255,90,44; }
        .qz-grid .qz-tile:nth-child(2) { --gl: 15,166,214; }
        .qz-grid .qz-tile:nth-child(3) { --gl: 245,166,35; }
        .qz-grid .qz-tile:nth-child(4) { --gl: 34,160,92; }
        .qz-tile:hover:not(:disabled):not(.rv) { transform: translateY(-3px); box-shadow: 0 18px 34px -12px rgba(0,0,0,0.6), 0 0 40px -2px rgba(var(--gl),0.6), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -4px 0 rgba(0,0,0,0.24), inset 0 0 0 1.5px rgba(0,0,0,0.26); }
        .qz-tile:active:not(:disabled):not(.rv) { transform: translateY(2px) scale(0.985); }
        .qz-tile:disabled { cursor: default; }
        .qz-shape { width: 38px; height: 38px; border-radius: 12px; background: rgba(255,255,255,0.22); box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.35); display: flex; align-items: center; justify-content: center; font-size: clamp(16px,2.2vw,20px); color: #fff; flex-shrink: 0; }
        .qz-opt { flex: 1; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(14px,2vw,17px); color: #fff; line-height: 1.3; letter-spacing: -0.01em; }
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
        .qz-board { width: 100%; max-width: 480px; background: rgba(255,255,255,0.05); border: 1px solid rgba(186,140,255,0.32); border-radius: 18px; padding: 14px; display: flex; flex-direction: column; gap: 5px; box-shadow: 0 0 32px rgba(124,58,237,0.25); backdrop-filter: blur(8px); }
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
        .qz-pod-col.p1 .qz-pod-bar { height: clamp(96px,14vw,156px); background: linear-gradient(180deg, #FFDE6B, #F5A623); box-shadow: inset 0 2px 0 rgba(255,255,255,0.55), 0 0 54px rgba(245,166,35,0.55); }
        .qz-pod-col.p2 .qz-pod-bar { height: clamp(66px,10vw,110px); background: linear-gradient(180deg, #E4E7EE, #A2A8B4); box-shadow: inset 0 2px 0 rgba(255,255,255,0.55), 0 0 30px rgba(214,217,224,0.35); }
        .qz-pod-col.p3 .qz-pod-bar { height: clamp(48px,7vw,82px); background: linear-gradient(180deg, #F4C08F, #CB8149); box-shadow: inset 0 2px 0 rgba(255,255,255,0.4), 0 0 30px rgba(237,177,131,0.35); }
        .qz-pod-col.me .qz-pod-name { color: #3CE88E; text-shadow: 0 0 14px rgba(60,232,142,0.4); }
        .qz-mypl { margin: 0; font-family: 'Manrope'; font-size: 15px; color: #B9A8E6; }
        .qz-mypl b { color: #3CE88E; }
        .qz-solo-res { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .qz-solo-pts { font-family: 'Manrope'; font-weight: 800; font-size: clamp(52px,9vw,84px); line-height: 1; color: #FF7A4D; text-shadow: 0 0 40px rgba(255,90,44,0.55); font-variant-numeric: tabular-nums; }
        .qz-endnote { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 10600; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; max-width: 94vw; background: rgba(27,15,63,0.86); border: 1px solid rgba(186,140,255,0.4); border-radius: 16px; padding: 10px 16px; color: #F2ECFF; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13.5px; box-shadow: 0 0 34px rgba(124,58,237,0.35); backdrop-filter: blur(10px); }

        /* === 🏆 PODIUM / STATISTIKA SAHIFASI === */
        .pod-stage { display: flex; align-items: flex-end; justify-content: center; gap: clamp(10px,2vw,20px); padding-top: 8px; }
        .pod-col { display: flex; flex-direction: column; align-items: center; gap: 5px; width: clamp(88px,22vw,150px); }
        .pod-medal { font-size: clamp(26px,4vw,38px); line-height: 1; }
        .pod-name { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.8vw,16px); color: ${T.ink}; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-score { font-size: clamp(11px,1.4vw,12.5px); color: ${T.ink2}; }
        .pod-bar { width: 100%; border-radius: 10px 10px 0 0; background: linear-gradient(180deg, ${T.accent}, ${T.accent}BB); box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.35); }
        .pod-1 .pod-bar { height: clamp(74px,11vw,120px); }
        .pod-2 .pod-bar { height: clamp(52px,8vw,86px); background: linear-gradient(180deg, ${T.ink2}, ${T.ink3}); }
        .pod-3 .pod-bar { height: clamp(38px,6vw,62px); background: linear-gradient(180deg, #C98A3D, #DDA55C); }
        .pod-col.me .pod-name { color: ${T.success}; }
        .pod-my { margin: 0; text-align: center; font-family: 'Manrope'; font-size: 14px; color: ${T.ink2}; }
        .pod-my b { color: ${T.success}; }
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
        .fade-step { animation: fade-step 0.34s cubic-bezier(.2,.7,.2,1); }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }

        /* option-wait (jonli test kutish holati) */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }
        /* frame-wait (feedback kutish) */
        .frame-wait { background: ${T.blueSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }
        .ach-rule { margin: 8px 0 0; text-align: center; font-size: 13px; line-height: 1.4; color: ${T.ink2}; }
        .ach-rule.lost { font-style: italic; }
      `}</style>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <AchCtx.Provider value={earned}>
        <AchMissCtx.Provider value={achMissVal}>
        <div className="lesson-root">
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={tr({ uz: 'PM darsi', ru: 'Урок PM' })} />
          ) : (
            <>
              <Current screen={screen} storedAnswer={answers[screen]} answers={answers} achievements={earned} onAnswer={recordAnswer} onNext={next} onPrev={prev} onReset={reset} onFinish={finishLesson} />
              <LiveBadge live={live} total={TOTAL_SCREENS} />
              {live.mode !== 'mentor' && <AchToasts toasts={achToasts} onDone={(k) => setAchToasts(t => t.filter(x => x.k !== k))} />}
            </>
          )}
        </div>
        </AchMissCtx.Provider>
        </AchCtx.Provider>
      </LiveGateCtx.Provider>
    </LangContext.Provider>
  );
}
