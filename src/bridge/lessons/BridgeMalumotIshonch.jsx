import React, { useState, useEffect, useRef, useMemo, createContext, useContext, useCallback } from 'react';
import { cardRead, cardWrite, READY_IDEAS } from '../bridgeCard.js';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// O'TISH (BRIDGE) DARSLARI · 4-O'TISH 3-DARSI — «MA'LUMOT, ISHONCH VA "QANDAY ISHLAYDI?"»
// Senariy-manba: pm-senariylar/BRIDGE-B7-MalumotIshonch.md (GATE S + tashqi fidbek saralangan, 2026-09-23 23:41).
// Mavzular: ma'lumot (maydon → bo'lim) · ochiq va yopiq ma'lumot (zarar mezoni) · sxema (ilova faqat yozilganini biladi) · uch qavat, kasbiy so'zsiz.
// Misol-ip: «YouTube kabi ilovani biz qursak» — YouTube nomi FAQAT 3-ekranda, qolgan sxemalar brendsiz. Keys: K6 Netflix (faqat bank-faktlari).
// Artefakt: bridgeCard.js → maydonlar [{nom, bolim, ochiq, sabab}×3] · qavatlar [3 gap]. Atama: «maydon» yagona nom (§202; «qator/ustun» yo'q).
// INFRA MANBAI: src/bridge/lessons/BridgeKimUchunMuammo.jsx (P0 PmUserStoryLesson'dan ko'chirilgan infra: Stage/NavNext/
//        QuestionScreen/MentorTestStats/Mentor/MentorNote/PRACTICE_BASE/nishonlar/Podium/CodeStrike arena/progress);
//        tushunish chizig'i va kasbiy so'z detektori — BridgeBirinchiVersiya.jsx'dan.
// AUDIOSIZ. SHRIFT: bridge sayti mustaqil (LMS yo'q) — <style> ichidagi @import shu yerda qoladi.
// ============================================================
// ============================================================
// 🎨 PM-STUDIA IDENTITET (PM_DARS_ETALON 1-bo'lim — P0 bilan AYNAN bir xil tokenlar)
// ============================================================
const T = {
  bg: '#F2F0FA', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4',
  paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', accentVivid: '#6E4BFF',
  success: '#12A968', successSoft: '#E4F5EC', blue: '#0E86C4', blueSoft: '#E1F3FB', link: '#5B3DE6',
  line: '#E7E3F4', err: '#E5484D', errSoft: '#FCE7E8',
  shadowBase: '40, 34, 82'
};
// «Tushunmadi / to'xtadi» holati — AMBER (pilot 8-band, B1/B3 bilan bir xil qiymat). Qizil faqat haqiqiy xato va mentor-statistikada.
const AMBER = '#B77A16';
const AMBER_SOFT = '#FBF1DE';

// Jonli dars (live) — umumiy modul: src/live/ (bridge yig'masida transport Supabase'ga o'zi yo'naltiriladi).
import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers, setLiveLang, buildResultDetails, sealPayload, useAutoNext } from '../../live/index.js';

const LangContext = createContext('uz');
// UZ-RU: modul-darajali tarjimon (RU_I18N_SPEC 1-bo'lim). tr() modul-darajali data ta'rifida chaqirilmaydi.
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};
const MentorCtx = createContext(null);
const AchCtx = createContext(null);
const AchMissCtx = createContext(null); // 151-qonun: { missed, miss(idx), practice } — «Qaytadan» mashq-o'tishi

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
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// ============================================================ DARS META
const LESSON_META = { lessonId: 'bridge-b7-v1', lessonTitle: { uz: 'Ma\'lumot, ishonch va «Qanday ishlaydi?»', ru: 'Данные, доверие и «Как это работает?»' } };
// Ekran-tartib = senariy 3-bo'lim (20 ekran). 20-ekranda arena yakun sahifasi ICHIDA (jsx-lint · P0 · pilot B1).
// Ballik testlar: s5 · s7 · s9 · s11 — har biri o'z blokidan keyin.
const SCREEN_META = [
  { id: 'hook',     type: 'hook',        template: 'custom', scored: false, scope: 'hook' },         // 0  · 1-ekran
  { id: 'maqsad',   type: 'rule',        template: 'custom', scored: false, scope: null },           // 1  · 2
  { id: 'xotira',   type: 'exploration', template: 'custom', scored: false, scope: null },           // 2  · 3 xotira tugmalari
  { id: 'keys',     type: 'case',        template: 'custom', scored: false, scope: null },           // 3  · 4 Netflix
  { id: 's5',       type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 4  · 5 TEST-1
  { id: 'kim',      type: 'exploration', template: 'custom', scored: false, scope: null },           // 5  · 6 ikki tomon
  { id: 's7',       type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 6  · 7 TEST-2
  { id: 'elon',     type: 'exploration', template: 'custom', scored: false, scope: null },           // 7  · 8 e'lon konstruktori
  { id: 's9',       type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 8  · 9 TEST-3
  { id: 'qavat',    type: 'exploration', template: 'custom', scored: false, scope: null },           // 9  · 10 uch qavat
  { id: 's11',      type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 10 · 11 TEST-4
  { id: 'chiziq',   type: 'exploration', template: 'custom', scored: false, scope: null },           // 11 · 12 kasbiy so'zsiz
  { id: 'maydon',   type: 'practice',    template: 'custom', scored: false, scope: null },           // 12 · 13 uch maydon
  { id: 'ochiq',    type: 'practice',    template: 'custom', scored: false, scope: null },           // 13 · 14 ochiq yoki yopiq
  { id: 'qavatgap', type: 'practice',    template: 'custom', scored: false, scope: null },           // 14 · 15 uch qavat gapi
  { id: 'ai',       type: 'practice',    template: 'custom', scored: false, scope: null },           // 15 · 16 AI
  { id: 'sherik',   type: 'practice',    template: 'custom', scored: false, scope: null },           // 16 · 17 juftlik
  { id: 'podium',   type: 'stats',       template: 'custom', scored: false, scope: null },           // 17 · 18
  { id: 'flash',    type: 'review',      template: 'custom', scored: false, scope: null },           // 18 · 19
  { id: 'yakun',    type: 'summary',     template: 'custom', scored: false, scope: null }            // 19 · 20 Arena + yakun
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// SCREEN_INTENTS — har ekran nima uchun bor: bola nima QILADI yoki nima BILADI (render qilinmaydi; 👦 simulyator tekshiradi).
export const SCREEN_INTENTS = {
  hook: "Bola ilova kechagi videoni ertalab eslashi kerakmi — ovoz beradi va eslash uchun ilova nimanidir yozib qo'yishi kerakligini biladi",
  maqsad: "Bola dars oxirida o'z g'oyasi uchun nimani yozib qo'yish, kimga ko'rsatish va tugma bosilganda ichida nima bo'lishini aytishini oldindan ko'radi",
  xotira: "Bola besh tugmani bosib, qaysi yozuvdan ertangi ekranda bo'lim ochilishini ko'radi va «maydon» atamasini oladi",
  keys: "Bola Netflix ko'rishlarining qanchasi tavsiyadan kelishini bashorat qilib, bank-faktlaridan biladi: yozilgan tarix bosh sahifani tuzadi",
  s5: "Bola to'rt taklifdan bo'lim ochadigan yagona maydonni — layk bosilgan videoni topadi",
  kim: "Bola olti maydonni «Hammaga ochiq» va «Faqat egasiga» tomonlarga qo'yib, har birining faktidan maydon turiga qarab emas, egasiga zarar yetishiga qarab yopilishini chiqaradi",
  s7: "Bola yangi maydonni yopish mezoni — begona ko'rsa egasiga zarar yetishi ekanini topadi",
  elon: "Bola e'lon gaplarini maydonlarga bog'lab, sana uchun maydon qo'shadi, «juda tez» gapiga maydon kerak emasligini ko'radi va «sxema» atamasini oladi",
  s9: "Bola e'longa yangi gap qo'shilsa sxemaga yangi maydon kerakligini topadi",
  qavat: "Bola layk bosib, uning sahifa · server · baza yo'lini ko'radi, telefonni o'chirib-yoqib layk joyida qolganini ko'radi va ilovaning uch «qismi»ni ko'radi",
  s11: "Bola kirmagan odamning laykini server tekshirganini yangi vaziyatga ko'chiradi",
  chiziq: "Bola tushunish chizig'i tushgan kasbiy so'zlarni bosib, ularning tanish so'z bilan almashishini ko'radi va «kasbiy so'z» atamasini oladi",
  maydon: "Bola o'z g'oyasi uchun uch maydon va har biridan ochiladigan bo'limni yozadi",
  ochiq: "Bola uch maydonini ochiq yoki yopiq deb belgilab, har biriga sababini yozadi",
  qavatgap: "Bola birinchi bo'lagida tugma bosilganda ilovaning uch qismi har biri nima qilishini kasbiy so'zsiz bir gapdan yozadi",
  ai: "Bola AI (yoki ikki tayyor savol) ochiq maydonlari haqida bergan savollarga qarab, maydonni o'zi qoldiradi yoki o'zgartiradi",
  sherik: "Bola uch gapidan birini sherigiga o'qiydi, sherik gap qaysi ish haqida ekanini topadi va nimani tuzatganini bir gapda yozadi",
  podium: "Bola testlardagi natijasini (jonlida — sinf reytingini) ko'radi",
  flash: "Bola beshta karta bilan darsning asosiy fikrlarini takrorlaydi",
  yakun: "Bola CodeStrike arenasida 12 savolga javob beradi, darsning to'rt fikrini ko'rib, darsni yakunlaydi"
};

const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;
// ⛶ ZOOMABLE — pilot B1 (PmLesson2 porti): proyektorda asosiy maketni kattalashtirish (Esc / fon bosilsa yopiladi).
// DIQQAT: ota-elementda transform (fade-up) bo'lsa position:fixed siljiydi — Zoomable fade-up ichiga qo'yilmaydi.
const Zoomable = ({ children, className = '' }) => {
  const [big, setBig] = useState(false);
  useEffect(() => {
    if (!big) return;
    const onKey = (e) => { if (e.key === 'Escape') setBig(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [big]);
  const lbl = tr(big ? { uz: 'Kichraytirish', ru: 'Уменьшить' } : { uz: 'Kattalashtirish', ru: 'Увеличить' });
  return (
    <>
      {big && <div className="zoom-backdrop" onClick={() => setBig(false)} />}
      <div className={`zoomable ${className} ${big ? 'zoom-on' : ''}`}>
        <button type="button" className="zoom-btn" onClick={() => setBig(b => !b)} aria-label={lbl} title={lbl}>{big ? '✕' : '⛶'}</button>
        {children}
      </div>
    </>
  );
};
// Ustun-yorlig'i (pilot B1 / PmLesson2 .flow-label): «NIMA — NIMA QILASIZ», ≤6 so'z.
// F-0925-B12: bo'sh yozish maydonida aniq chorlov (placeholder'siz maydon bo'sh oq quti bo'lib ko'rinardi).
const WRITE_PH = { uz: 'Shu yerga yozing…', ru: 'Напишите здесь…' };
const FlowLabel = ({ children }) => <p className="flow-label">{children}</p>;

// 🔴 MENTOR EKRANIDA KO'RSATILMAYDI (90-qonun · 1-D jadvali): nishon — QURILMAGA xos, shaxsiy
// hisob. Proyektorda u mentorning o'z bosishlarini sanaydi, sinf ishini emas — yolg'on son.
// Tamoyil: mentor ekrani = SAHNA (lahzalar), o'quvchi qurilmasi = DAFTAR (hisob).
// To'liq-ekran bayram (AchCelebrate) esa lahza bo'lgani uchun proyektorda QOLADI.
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
  if (gate && gate.live && gate.live.mode === 'mentor') return null; // hooklardan KEYIN
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
            <div className="chrome-left eyebrow">{eyebrow && <><span className="dot" /><span>{eyebrow}</span></>}</div>
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
// 🔔 NAVBAT-PULSI (88-qonun · 1-C bo'lim) — «hozir navbat shu elementda» signali.
// Ekranda ISTALGAN LAHZADA faqat BITTA element yonadi. Puls DARHOL emas, harakatsizlikdan
// keyin chiqadi: o'zi bilgan o'quvchi darhol bosadi va pulsni UMUMAN ko'rmaydi — yordam
// faqat ikkilanganga boradi. `active` yolg'onga o'tsa (bosildi/qulflandi) — darhol o'chadi.
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

// 🔔 NAVBAT YURISHI (88-qonun) — «hammasini to'ldirish / hammasini ko'rish» ekranlari uchun.
// Puls BAJARILMAGAN elementlar bo'ylab navbat bilan yuradi: istalgan lahzada faqat BITTASI
// yonadi, bajarilgani (to'lgan maydon, ochilgan karta) navbatdan CHIQADI, har harakatdan keyin
// kutish qaytadan boshlanadi. Bitta element qolsa — yurishning ma'nosi qolmaydi, u tinch yonadi.
const TURN_STEP_MS = 1300;   // bitta elementning navbati
const TURN_PAUSE_MS = 3200;  // aylanish tugagach tanaffus (keyin qaytadan)
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
// Yurish-holatida qisqa «paydo bo'l — turib tur — so'n», yolg'iz qolganda tinch nafas.
const turnCls = (lit, k, walking) => (lit === k ? (walking ? ' turn-ring turn-step' : ' turn-ring') : '');
// To'lqin-yorliq: teng variantlar birma-bir yonadi (w1…w4). 4 variantli qatorda aylanish
// uzunroq bo'lishi kerak — `wv4` shu uchun: lahzada baribir BITTASI ko'rinadi.
const waveCls = (on, i, n) => (on ? ` turn-ring turn-wave${n > 3 ? ' wv4' : ''} w${i + 1}` : '');

const NavNext = ({ disabled, label = tr({ uz: 'Davom etish', ru: 'Продолжить' }), onClick, optionalLive, turnBusy }) => {
  const gate = useContext(LiveGateCtx);
  const locked = !!(gate && gate.locked);
  const live = gate && gate.live;
  const freeRide = !!(optionalLive && live && live.mode === 'student' && live.status !== 'ended' && live.mentorAlive);
  // freeRide: jonli darsda tugma OCHIQ qoladi (sekin o'quvchi sinfni bloklamasin), LEKIN yorliq
  // topshiriq-matnini («✍️ 1/3 …») ko'rsatib turadi — o'quvchi nimani o'tkazayotganini biladi (F-0726-01).
  const isOff = (freeRide ? false : disabled) || locked;
  // Navbat tugmada FAQAT u bosiladigan holatda bo'ladi. Shundan ikki shart o'z-o'zidan bajariladi:
  // (a) ballanadigan testda tugma javob berilgunga qadar `disabled` — puls yo'q; (b) mentorni
  // kutayotgan qulflangan tugma ham yonmaydi (83-qonun). `turnBusy` — navbat hali EKRAN ichida
  // (maydon to'ldirilmagan, karta joylanmagan): tugma ochiq bo'lsa ham yonmaydi.
  const hint = useTurnHint(!isOff && !turnBusy);
  return <button className={`btn-white-accent${hint ? ' turn-hint' : ''}`} disabled={isOff} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : (freeRide && disabled ? tr({ uz: "Jonli dars: bajarmasdan ham o'tishingiz mumkin", ru: 'Живой урок: можно идти дальше, даже не выполнив' }) : undefined)} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : label}</button>;
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

// Ballik ekranlar javob kaliti — Jonli TASDIQLAYDI. ✓ pozitsiyalari aralash (s5=2 · s7=0 · s9=3 · s11=1);
// QuestionScreen'dagi correctIdx shu qiymatlardan olinadi (bitta manba). practice = ishtirok-kalit (-1).
const INLINE_KEYS = { s5: 2, s7: 0, s9: 3, s11: 1, practice: -1 };

// MENTOR (proyektor): jonli test statistikasi — «Natijani ochish»gacha ✅/❌ soni yashirin (Kahoot-reveal).
// Sanoq FAQAT bitta manbadan: picked === correctIdx (server-kalit bilan mos).
function MentorTestStats({ live, screenIdx, options, correctIdx, reveal, onReveal }) {
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
        {!reveal && onReveal && <button className={`mstats-reveal ${allIn ? 'ready' : ''}`} onClick={onReveal}>{tr({ uz: '🔓 Natijani ochish', ru: '🔓 Открыть результат' })}</button>}
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
            {level === 'need' && <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlang.</>, ru: <>⚠️ Верно только <b>{pct}%</b> — тему класс не понял. Перед тем как идти дальше, коротко повторите.</> })}</p>}
            {level === 'maybe' && <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. При желании коротко повторите перед тем, как идти дальше.</> })}</p>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс тему усвоил. Спокойно идите дальше!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответивших мало ({answered}) — по процентам вывод делать сложно. Оцените сами.</> })}</p>}
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
      {reveal && struggling && <p className="mstats-warn">{tr({ uz: "⚠️ Ko'pchilik xato qildi — bu mavzu tushunarsiz bo'lgan ko'rinadi. Yana bir bor tushuntiring.", ru: '⚠️ Большинство ошиблось — похоже, тема осталась непонятной. Объясните заново.' })}</p>}
      {answered === 0 && <p className="mstats-wait">{tr({ uz: "O'quvchilar javoblari shu yerda jonli ko'rinadi…", ru: 'Ответы учеников появятся здесь вживую…' })}</p>}
    </div>
  );
}

// QuestionScreen — scored test/hotspot mexanikasi (jonli-ball KAFOLATLI: submitAnswer imzosi + Kahoot-reveal).
// Hotspot varianti: options = buzuq hikoya bo'laklari, correctIdx = buzuq bo'lak; renderMode='hotspot'.
// hsFx='stamp' (ixtiyoriy) — buzuq bo'lak topilganda «TOPILDI» shtamp-effekti (faqat vizual qatlam).
const QuestionScreen = ({ screen, idx, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, renderMode, ctaLabel, revealPrefix = tr({ uz: "To'g'ri javob", ru: 'Верный ответ' }), hsFx, storedAnswer, onAnswer, onNext, onPrev }) => {
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
  // mentorMax (cur EMAS): sinf bu savoldan o'tib ketgan bo'lsa javob ochiq qoladi — mentor
  // orqaga qaytib tushuntirsa ham o'quvchida javob qayta yashirinmaydi (F-0726-02).
  const revealed = !oneShot || !!(live && (live.revealScreen === screen || (live.mentorMax ?? live.mentorScreen) > screen || live.status === 'ended' || !live.mentorAlive));
  const waiting = oneShot && solved && !revealed;
  const isHotspot = renderMode === 'hotspot';
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (ctaLabel || tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' }))} onClick={onNext} /></>}>
      <div className={`screen qs${picked !== null || mReveal ? ' qs-on' : ''}`} style={{ justifyContent: isMentorLive ? 'flex-start' : 'safe center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {/* Tanlagach variantlar ixchamlashadi — izoh chiqqanda ekran skrollsiz qoladi (PmLesson2 naqshi, F-0924-06) */}
        <div className={`fade-up delay-1 ${isHotspot ? 'hs-parts' : ''}`} style={{ display: 'flex', flexDirection: isHotspot ? 'row' : 'column', flexWrap: isHotspot ? 'wrap' : 'nowrap', gap: isHotspot ? 10 : (picked !== null ? 8 : 11) }}>
          {options.map((opt, i) => {
            const brokenCls = ' hs-broken' + (hsFx === 'stamp' ? ' hs-stamp' : ''); // stamp — faqat vizual qatlam
            let cls = isHotspot ? 'hs-chip' : 'option';
            if (isMentorLive) {
              if (mReveal) { cls += i === correctIdx ? (isHotspot ? brokenCls : ' option-correct') : (isHotspot ? ' hs-ok' : ' option-wrong'); }
            } else if (solved) {
              if (waiting) { if (i === picked) cls += isHotspot ? ' hs-wait' : ' option-wait'; }
              else { cls += i === correctIdx ? (isHotspot ? brokenCls : ' option-correct') : (isHotspot ? ' hs-ok' : ' option-wrong'); if (wrongLocked && i === picked) cls += isHotspot ? ' hs-miss' : ' option-picked-wrong'; }
            }
            else if (i === picked) cls += isHotspot ? ' hs-miss' : ' option-picked-wrong';
            const showGreenLetter = isMentorLive ? (mReveal && i === correctIdx) : (solved && revealed && i === correctIdx);
            return (
              <button key={i} className={cls} disabled={solved || isMentorLive} onClick={() => pick(i)} style={isHotspot ? undefined : { padding: picked !== null ? 'clamp(9px,1.3vw,12px) clamp(15px,2.2vw,20px)' : 'clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)', fontSize: 'clamp(15px,1.85vw,17px)', display: 'flex', alignItems: 'center', gap: 12 }}>
                {!isHotspot && <span className="mono small" style={{ minWidth: 20, color: showGreenLetter ? T.success : T.ink3 }}>{String.fromCharCode(65 + i)}</span>}
                <span style={{ flex: 1 }}>{fmtCode(opt)}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? <>✓ {revealPrefix}: {isHotspot ? fmtCode(options[correctIdx]) : String.fromCharCode(65 + correctIdx)}</>
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? <>{revealPrefix}: {isHotspot ? '' : `${String.fromCharCode(65 + correctIdx)} — `}{fmtCode(options[correctIdx])}</>
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
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
        {isMentorLive && <MentorTestStats live={live} screenIdx={screen} options={options} correctIdx={correctIdx} reveal={mReveal} onReveal={doReveal} />}
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
        <img src={MENTOR_IMG} alt="" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
      </div>
      <div className="mentor-col">
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> · {tr({ uz: "ko'rsatmani ochish ▾", ru: 'открыть подсказку ▾' })}</span>}</span>
        <div className="mentor-msg body">{children}</div>
      </div>
    </div>
  );
};

// MentorNote — MENTORGA maydoni: faqat mentor-rejimda. PROYEKTOR-SIR (2026-07-15):
// mentor ekrani katta ekranda ko'rinadi — eslatma DEFAULT YOPIQ xira chip; bir bosishda
// ochiladi, yana bosishda yopiladi; ekran almashganda komponent unmount bo'lib o'zi yopiladi.
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
// ===== 🛠️ JONLI PRAKTIKA signal-zonasi (500+): test <100 · arena 100+ bilan to'qnashmaydi =====
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
  const players = data.players || [];
  const doers = players.filter(p => data.doneIds.has(p.id));
  const waiting = players.filter(p => !data.doneIds.has(p.id));
  return (
    <div className="lp-mstats fade-up">
      <div className="card-lbl" style={{ color: T.blue }}>{label} — {doers.length}/{players.length}</div>
      {data.players === null ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: 'Yuklanmoqda…', ru: 'Загрузка…' })}</p>
      ) : players.length === 0 ? (
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Hali hech kim qo'shilmagan.", ru: 'Пока никто не подключился.' })}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {doers.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.successSoft, color: T.success, fontWeight: 700 }}>✓ {p.nickname}</span>)}
          {waiting.map(p => <span key={p.id} className="mstats-wait-chip" style={{ background: T.accentSoft, color: T.accent, fontWeight: 700 }}>✏️ {p.nickname}</span>)}
        </div>
      )}
    </div>
  );
};

// O'QUVCHI ko'radigan sinf-pulsi (45-qonun): «nechta sinfdosh bajardi / bajarmoqda» jonli hisobi.
// Faqat jonli student-rejimda; MentorPracticeStats bilan BIR XIL signal-zonadan (PRACTICE_BASE+screen)
// sof O'QISH — ball-relsga yozmaydi. Ismlar yo'q (ismlar mentor-panelda).
// JOYI — pastki navigatsiya doki (nav-mdock), mentor «Kim bajardi» paneli bilan bir o'rinda (B5/B6 naqshi AYNAN, tekshiruvchi D1
// 25.09 · Dizayn R2): mazmun ichidagi chip 1280x800 da o'quvchi rejimida 13-ekran RU 9px, 14-ekran 1px aylantirish berardi.
// Dokda u doim ko'rinadi va ekran balandligini olmaydi.
const StudentPracticePulse = ({ live, screen }) => {
  const [data, setData] = useState(null); // { total, done }
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
    <div className="done-mini sp-pulse fade-up">
      👥 {tr({ uz: 'Sinfda:', ru: 'В классе:' })} <b>{data.done}</b> {tr({ uz: 'bajardi', ru: 'выполнили' })}{doing > 0 && <span className="dm-sub">· ✏️ {doing} {tr({ uz: 'hali bajarmoqda', ru: 'ещё выполняют' })}</span>}
    </div>
  );
};


// ===== UMUMIY YORDAMCHILAR =====
const useIsMentor = () => { const g = useContext(LiveGateCtx) || {}; return { live: g.live, isMentor: !!(g.live && g.live.mode === 'mentor') }; };
// F-0915-02 oilasi: kartadagi qiymat string bo'lmasa (raqam, obyekt, null) — bo'sh deb olinadi, oq ekran bo'lmaydi.
const str = (v) => (typeof v === 'string' ? v : '');
const clean = (s) => str(s).trim();
const filled = (s, n = 2) => clean(s).length >= n;
const capFirst = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
// Pilot B1 cardSafe naqshi: karta obyekt bo'lmasa (satr, massiv, raqam) — bo'sh obyekt. Ichidagi maydonlar str() bilan o'qiladi
// (bu darsda karta massiv-maydonlar ham saqlaydi — maydonlar, qavatlar — shuning uchun faqat satrlar emas, butun obyekt qaytadi).
const cardSafe = () => { const c = cardRead(); return c && typeof c === 'object' && !Array.isArray(c) ? c : {}; };
// 31-qonun: mentorga bir qatorlik yozuv — MentorNote (default-yopiq chip) ichida.
const MENTOR_WATCH = { uz: "Jonli darsda bu amaliyotni o'quvchilar bajaradi — siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'На живом уроке это задание выполняют ученики — вы наблюдаете; «Продолжить» для вас открыто.' };
// Amaliyot bajarildi signali (PRACTICE_BASE+screen) — P0 ustaxona naqshi: onAnswer + jonli submitAnswer, bir marta.
const usePracticeSignal = (screen, storedAnswer, onAnswer, live) => {
  const sentRef = useRef(!!(storedAnswer && storedAnswer.solved));
  return (payload) => {
    if (sentRef.current) return;
    sentRef.current = true;
    onAnswer(screen, { stage: 'practice', screenIdx: screen, solved: true, correct: true, picked: true, ...payload });
    if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
  };
};

// Xulosa-ramka paydo bo'lganda ko'rinadigan joyga suriladi (FeedbackBlock naqshi) — pastda qolib ketmasin.
const ScrollIn = ({ className, children }) => {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => { if (ref.current && ref.current.scrollIntoView) ref.current.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' }); }, 150); return () => clearTimeout(t); }, []);
  return <div ref={ref} className={className}>{children}</div>;
};

// ===== 1-EKRAN — HOOK: fikr-so'rovi (ikkala javob to'g'ri, §119) + jonli sinf-diagrammasi =====
const HOOK_OPTS = [
  { uz: 'Ha — qayerda to\'xtaganimni ko\'rsatsin', ru: 'Да — пусть покажет, где я остановился' },
  { uz: 'Yo\'q — men haqimda hech narsa saqlamasin', ru: 'Нет — пусть ничего обо мне не сохраняет' },
];
// HOOK imzo-vizuali (F-0924-04 · Dizayn 3-aylanish): «ilova xotirasi» — telefonda kechqurun ko'rilgan video.
// Taymlayn (CSS, bir marta): 🌙 23:40 da video 12:04 gacha ko'riladi → ⏸ to'xtaydi → ekran o'chadi (💤 tun) →
// 🌅 07:30 da ilova yana ochiladi, 12:04 belgisida «?» — ilova shu joyni eslaydimi? Javob aytilmaydi (ovoz shu savolga).
// Bu 3-ekrandagi «xotira tugmalari»ning (qaysi video · qachon · qaysi daqiqada) boshlanishi: uch yozuv shu sahnada ko'rinadi.
// Material — oddiy yozuv, brend/logotip yo'q. Faqat ko'rinish, bosilmaydi. Reduced-motion'da darhol yakuniy holat.
const HK_VID = {
  t: { uz: 'Eng chiroyli 10 gol', ru: '10 самых красивых голов' },
  ch: { uz: 'Hovli futboli · 1 240 marta ko\'rildi', ru: 'Дворовый футбол · 1 240 просмотров' },
};
const HookPhone = () => (
  <div className="hk-ph" role="img" aria-label={tr({ uz: "Telefon ekrani: kechqurun 23:40 da video 12:04 daqiqasida to'xtatilgan, ertalab 07:30 da ilova yana ochildi — u shu joyni eslaydimi?", ru: 'Экран телефона: вечером в 23:40 видео остановили на 12:04, утром в 07:30 приложение открыли снова — помнит ли оно это место?' })}>
    <i className="uz-notch" aria-hidden="true" />
    <div className="hk-ph-time" aria-hidden="true"><span className="hk-t-n">🌙 23:40</span><span className="hk-t-ar">→</span><span className="hk-t-m">🌅 07:30</span></div>
    <div className="hk-ph-vid" aria-hidden="true">
      <span className="hk-ph-ball">⚽</span>
      <span className="hk-ph-play">⏸</span>
      <span className="hk-ph-tc">12:04 / 24:30</span>
      <span className="hk-night"><span className="hk-zz">💤</span></span>
    </div>
    <div className="hk-ph-prog" aria-hidden="true"><i /><b className="hk-mark"><span className="hk-mark-t">12:04<span className="hk-ph-q">?</span></span></b></div>
    <div className="hk-ph-meta" aria-hidden="true">
      <span className="hk-ph-t">{tr(HK_VID.t)}</span>
      <span className="hk-ph-ch">{tr(HK_VID.ch)}</span>
    </div>
  </div>
);
const ScreenHook = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor } = useIsMentor();
  // F-0915-02: saqlangan javob chegara ichidagi butun son bo'lsagina olinadi (pilot B1)
  const [picked, setPicked] = useState(() => { const v = storedAnswer?.picked; return Number.isInteger(v) && v >= 0 && v < HOOK_OPTS.length ? v : null; });
  const [counts, setCounts] = useState(null);
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  useEffect(() => {
    if (!isLive) return;
    let on = true, t = null;
    const tick = async () => {
      try { const rows = await liveAnswers(live.pin, screen); if (on) setCounts(HOOK_OPTS.map((_, i) => rows.filter(r => r.picked === i).length)); } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [isLive, live && live.pin, screen]);
  const pick = (i) => {
    if (picked !== null || isMentor) return;
    setPicked(i);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: i, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 'hook', i, false, 0);
  };
  const shown = counts;
  const totalVotes = shown ? shown.reduce((a, b) => a + b, 0) : 0;
  // 90-qonun (F-0924-04): nol ovozda bo'sh «0%» jadvali chiqmaydi — o'rnida «Ovozlar kutilmoqda» chipi (pilot B1/B3).
  const voteWait = isLive && (picked !== null || isMentor) && totalVotes === 0;
  const revealViz = isLive && shown && totalVotes > 0 && (picked !== null || isMentor);
  const topIdx = revealViz ? shown.indexOf(Math.max(...shown)) : -1;
  const optWave = useTurnHint(picked === null && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Вступление' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Javobingizni tanlang', ru: 'Выберите свой ответ' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen hk-screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>Kechqurun video ko'rdingiz. Ertalab ilova qayerda to'xtaganingizni <span className="italic" style={{ color: T.accent }}>eslab qolsinmi</span>?</>, ru: <>Вечером вы смотрели видео. Пусть утром приложение <span className="italic" style={{ color: T.accent }}>помнит</span>, где вы остановились?</> })}</h2>
        </div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 qolipi — NEGA + bitta chorlov; javob aytilmaydi, ikkala tanlov teng).
            B-18: tanlovdan keyin (mentor ekranida — ovozlar kelgach) pufak yashirinadi — o'rnida payoff gapiradi. */}
        {picked === null && !(isMentor && totalVotes > 0) && <Mentor>{tr({ uz: <>Ilova kechagi videoni eslab qolishi kimgadir yoqadi, kimgadir yoqmaydi — <b style={{ color: T.ink }}>ikki javobdan</b> o'zingizga yaqinini belgilang.</>, ru: <>Одним нравится, когда приложение помнит вчерашнее видео, другим нет, — отметьте из <b style={{ color: T.ink }}>двух ответов</b> тот, что ближе вам.</> })}</Mentor>}
        <div className="split hk-split">
          <div className="hk-in"><HookPhone /></div>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Fikringizni belgilang', ru: 'Отметьте своё мнение' })}</p>
            <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {HOOK_OPTS.map((o, i) => {
                const on = picked === i;
                const locked = picked !== null || isMentor;
                return (
                  <button key={i} className={`hk-opt ${on ? 'on' : ''}${!locked ? waveCls(optWave, i, HOOK_OPTS.length) : ''}`} disabled={locked} onClick={() => pick(i)}>
                    <span className="hk-radio">{on && <span className="hk-dot" />}</span>
                    <span>{tr(o)}</span>
                  </button>
                );
              })}
            </div>
            {/* Tekshiruvchi 24.09 (B2/B4/B6 naqshi): proyektorda payoff ovoz kelgandan KEYIN — oldin javob sinfga aytilib qo'yilardi */}
            {(picked !== null || (isMentor && totalVotes > 0)) && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Ikkala javob ham bo'lishi mumkin — ikkalasi ham qaror. Ilova eslashi uchun nimanidir yozib qo'yishi kerak. Yozmasa, ertalab u hech narsani bilmaydi. Bugun ilovani siz qurasiz, shuning uchun nimani yozib qo'yishni ham siz hal qilasiz.", ru: 'Возможны оба ответа, и каждый — это решение. Чтобы приложение помнило, оно должно что-то записать. Если не запишет, утром оно ничего не будет знать. Сегодня приложение строите вы, поэтому и что записывать, решаете вы.' })}</p></div>}
            {voteWait && <span className="done-mini fade-step">{tr({ uz: '👥 Ovozlar kutilmoqda…', ru: '👥 Ждём голоса…' })}</span>}
            {revealViz && (
              <div className="hvote fade-step" aria-label={tr({ uz: 'Sinf ovozlari', ru: 'Голоса класса' })}>
                {HOOK_OPTS.map((o, i) => {
                  const n = shown[i];
                  const pct = totalVotes ? Math.round((n / totalVotes) * 100) : 0;
                  return (
                    <div key={i} className={`hvote-row ${picked === i ? 'mine' : ''} ${i === topIdx && totalVotes > 0 ? 'top' : ''}`}>
                      <span className="hvote-lbl">{tr(o)}</span>
                      <span className="hvote-track"><span className="hvote-fill" style={{ width: `${Math.max(pct, totalVotes ? 4 : 0)}%` }} /></span>
                      <span className="hvote-pct mono">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== 2-EKRAN — MAQSAD: jonli natija-preview (yozuvsiz, §126: «maydon/sxema/qavat» so'zlari bu yerda yo'q) =====
// Uch karta chiqadi → har biriga 🔓/🔒 tushadi → bitta bosish uch bosqichdan strelka bilan o'tadi (chapdan o'ngga).
// CSS-taymlayn (--fd); reduced-motion'da darhol to'liq holat. Kartalar bo'sh chiziqli — mashq javobi oshkor bo'lmaydi.
// F-0925-QA36: emoji o'rniga so'z — qulf → «ochiq/yopiq» yorlig'i, bosqichlar → darsdagi uch qism nomi; qismlar ① ② nomli.
const GD_SHUT = [false, true, false];
const GD_STAGES = [{ uz: "Ko'rsatadi", ru: 'Показывает' }, { uz: 'Tekshiradi', ru: 'Проверяет' }, { uz: 'Eslab qoladi', ru: 'Запоминает' }];
// Kartalar ichidagi material (Dizayn 4-aylanish, pilot 9-band): kulrang chiziq o'rniga dars olamining o'z yozuvlari —
// hook videosi va 6-ekran kanali («Hovli futboli»). Telefon raqami qulf tushgan lahzada yulduzchaga yopiladi: «yopiq» ko'z bilan
// ko'rinadi. Namuna o'quvchi g'oyasidan EMAS (mashq javobi ochilmaydi); qiymatlar render paytida o'qiladi (F6_VAL pastda).
const GD_MASK = '+998 •• ••• •• ••';
const GoalDemo = () => {
  const [run, setRun] = useState(0);
  const vals = [tr(F6_VAL.kanal), tr(F6_VAL.telefon), tr(HK_VID.t)];
  return (
    <div className="gd fade-up delay-1" key={run}>
      <button type="button" className="gq-replay" onClick={() => setRun(r => r + 1)} aria-label={tr({ uz: 'Qayta ko\'rsatish', ru: 'Показать снова' })}>↻</button>
      <div className="gd-col" aria-hidden="true">
        <span className="gd-h">{tr({ uz: "① Nimani yozib qo'yadi · ochiqmi, yopiqmi", ru: '① Что записывает · открыто или закрыто' })}</span>
        <div className="gd-cards">
          {GD_SHUT.map((shut, i) => (
            <div key={i} className={`gd-card${shut ? ' shut' : ''}`} style={{ '--fd': `${0.3 + i * 0.4}s`, '--fl': `${1.7 + i * 0.35}s` }}>
              <span className={`gd-v${i === 1 ? ' mono' : ''}`}>
                <span className="gd-real">{vals[i]}</span>
                {shut && <span className="gd-mask mono">{GD_MASK}</span>}
              </span>
              <span className={`gd-lock${shut ? ' shut' : ''}`} style={{ '--fd': `${1.7 + i * 0.35}s` }}>{tr(shut ? { uz: 'yopiq', ru: 'закрыто' } : { uz: 'ochiq', ru: 'открыто' })}</span>
            </div>
          ))}
        </div>
      </div>
      <span className="gd-arrow big" style={{ '--fd': '2.9s' }} aria-hidden="true">→</span>
      <div className="gd-col" aria-hidden="true">
        <span className="gd-h gd-h2">{tr({ uz: '② Tugma bosilganda ichkarida', ru: '② Внутри после нажатия кнопки' })}</span>
        <div className="gd-flow">
          <span className="gd-btn" style={{ '--fd': '3.2s' }}>{tr({ uz: 'Tugma', ru: 'Кнопка' })}</span>
          {GD_STAGES.map((t, i) => (
            <React.Fragment key={i}>
              <span className="gd-arrow" style={{ '--fd': `${3.5 + i * 0.6}s` }}>→</span>
              <span className="gd-stage" style={{ '--fd': `${3.6 + i * 0.6}s` }}>{tr(t)}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
const ScreenGoal = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun ilovangiz <span className="italic" style={{ color: T.accent }}>nimani eslab qolishini</span> hal qilasiz</>, ru: <>Сегодня вы решите, <span className="italic" style={{ color: T.accent }}>что будет запоминать</span> ваше приложение</> })}</h2></div>
      <Mentor>{tr({ uz: 'Tanlagan g\'oyangiz uchun ilova nimani yozib qo\'yishini tanlaysiz. Qaysi ma\'lumot hammaga ochiq, qaysi biri yopiq bo\'lishini hal qilasiz. Oxirida tugma bosilganda ilova ichida nima bo\'lishini kod bilmaydigan odamga uch gapda aytasiz.', ru: 'Для выбранной идеи вы решите, что будет записывать приложение. Решите, какие данные открыты всем, а какие закрыты. В конце тремя фразами расскажете человеку, который не знает кода, что происходит внутри приложения, когда нажимают кнопку.' })}</Mentor>
      <GoalDemo />
    </div>
  </Stage>
);

// ===== 3-EKRAN — XOTIRA TUGMALARI (imzo-vizual): 5 tugma → «ertangi ekran»da qaysi bo'lim ochilishi =====
// YouTube nomi FAQAT shu ekranda (senariy «YouTube halolligi»). Bosib ochish — toggle (46-qonun), darvoza — seen.
const MEMO = [
  { k: 'video', ic: '🎬', t: { uz: 'Qaysi video ko\'rildi', ru: 'Какое видео посмотрели' }, sec: { uz: '«Tarix» bo\'limi', ru: 'Раздел «История»' }, ok: true },
  { k: 'qachon', ic: '🕘', t: { uz: 'Qachon ko\'rildi', ru: 'Когда посмотрели' }, sec: { uz: '«Kecha ko\'rganlaringiz» bo\'limi', ru: 'Раздел «Вы смотрели вчера»' }, ok: true },
  { k: 'daqiqa', ic: '⏸️', t: { uz: 'Qaysi daqiqada to\'xtatildi', ru: 'На какой минуте остановили' }, sec: { uz: '«Davom ettiring» bo\'limi', ru: 'Раздел «Продолжить просмотр»' }, ok: true },
  { k: 'wifi', ic: '📶', t: { uz: 'Qaysi Wi-Fi orqali ko\'rildi', ru: 'Через какой Wi-Fi смотрели' }, sec: { uz: 'Bizning ilovamizda bundan bo\'lim ochilmaydi', ru: 'В нашем приложении из этого раздел не открывается' }, ok: false },
  { k: 'kontakt', ic: '📇', t: { uz: 'Telefondagi kontaktlar', ru: 'Контакты в телефоне' }, sec: { uz: 'Bizning ilovamizda kontaktlardan foydalanadigan bo\'lim yo\'q', ru: 'В нашем приложении нет раздела, который использует контакты' }, ok: false },
];
// «Ertangi ekran» bo'limlari ichidagi material (Dizayn 3-aylanish, pilot 9-band): kulrang chiziq o'rniga shu yozuvdan
// chiqadigan haqiqiy qiymatlar — video nomlari · ko'rilgan vaqt · to'xtagan daqiqa (p — ko'rilgan qism, %). Hook videosi bilan bir ip.
const MM_TILES = {
  video: [{ uz: '10 gol', ru: '10 голов' }, { uz: 'Penalti', ru: 'Пенальти' }, { uz: 'Dribling', ru: 'Дриблинг' }],
  qachon: [{ uz: '🌙 23:40', ru: '🌙 23:40' }, { uz: '22:15', ru: '22:15' }, { uz: '21:05', ru: '21:05' }],
  daqiqa: [{ t: '12:04', p: 49 }, { t: '03:31', p: 22 }, { t: '18:20', p: 80 }],
};
const MmTiles = ({ k }) => (
  <span className="mm-tiles" aria-hidden="true">
    {(MM_TILES[k] || []).map((x, i) => (x.p !== undefined
      ? <i key={i} className="tc" style={{ '--p': `${x.p}%` }}>{x.t}</i>
      : <i key={i}>{tr(x)}</i>))}
  </span>
);
const ScreenMemory = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState(() => new Set());
  const tap = (k) => { setOpen(o => (o === k ? null : k)); setSeen(p => { if (p.has(k)) return p; const n = new Set(p); n.add(k); return n; }); };
  const all = seen.size >= MEMO.length;
  useEffect(() => { if (all && !(storedAnswer && storedAnswer.solved)) onAnswer(screen, { stage: 'explore', screenIdx: screen, solved: true, correct: true }); }, [all]); // eslint-disable-line
  const pend = MEMO.map(m => m.k).filter(k => !seen.has(k));
  const lit = useTurnWalk(pend, !isMentor); // mentor rejimida ekran-ichi puls yo'q (pilot B1)
  const cur = MEMO.find(m => m.k === open);
  const left = MEMO.length - seen.size;
  const secs = MEMO.filter(m => m.ok && seen.has(m.k));
  return (
    <Stage eyebrow={tr({ uz: '1-qism · Nimani yozib qo\'yamiz', ru: 'Часть 1 · Что записываем' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all} label={all || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Yana ${left} ta tugmani bosing`, ru: `Нажмите ещё кнопки: ${left}` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>YouTube kabi ilova qursak, video ko'rilganda <span className="italic" style={{ color: T.accent }}>nimani yozib qo'yamiz</span>?</>, ru: <>Если мы построим приложение как YouTube, <span className="italic" style={{ color: T.accent }}>что мы будем записывать</span>, когда смотрят видео?</> })}</h2>
        </div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 — NEGA bir xil, chorlov holatga qarab; B-18: beshalasi ko'rilgach yashirinadi, xulosa gapiradi) */}
        {!all && <Mentor>{seen.size === 0
          ? tr({ uz: <>YouTube'da video nomi, kanal va ko'rishlar soni ko'rinadi, bizning ilova nimani yozib qo'yishini esa siz hal qilasiz — <b style={{ color: T.ink }}>«Qaysi video ko'rildi»</b>dan boshlab tugmalarni birma-bir bosing.</>, ru: <>В YouTube видны название видео, канал и число просмотров, а что будет записывать наше приложение, решаете вы, — нажимайте кнопки по очереди, начиная с <b style={{ color: T.ink }}>«Какое видео посмотрели»</b>.</> })
          : tr({ uz: <>Ilova ertaga nimani ko'rsatishi bugun nimani yozib qo'yganiga bog'liq — <b style={{ color: T.ink }}>«Yozuvlar»</b>dagi qolgan tugmalarni ham bosing.</>, ru: <>То, что приложение покажет завтра, зависит от того, что оно записало сегодня, — нажмите и остальные кнопки в <b style={{ color: T.ink }}>«Записях»</b>.</> })}</Mentor>}
        <Zoomable className="zsplit">
        <div className="split mm-split">
          <Col gap={8}>
            <FlowLabel>{tr({ uz: 'Yozuvlar', ru: 'Записи' })}</FlowLabel>
            {/* Beshalasi ko'rilgach tugmalar ixcham qatorga yig'iladi — xulosa ekrandan chiqmaydi (matn o'zgarmaydi) */}
            <div className={`mm-list${all ? ' mini' : ''}`}>
            {MEMO.map(m => (
              <button key={m.k} type="button" className={`mm-btn ${open === m.k ? 'on' : ''} ${seen.has(m.k) ? 'seen' : ''}${turnCls(lit, m.k, pend.length > 1)}`} onClick={() => tap(m.k)} aria-pressed={open === m.k}>
                <span className="mm-ic" aria-hidden="true">{m.ic}</span>
                <span className="mm-t">{tr(m.t)}</span>
                {seen.has(m.k) && <span className={`mm-ck ${m.ok ? 'ok' : 'no'}`} aria-hidden="true">{m.ok ? '✓' : '∅'}</span>}
              </button>
            ))}
            </div>
          </Col>
          <Col>
            <div className="mm-phone fade-up delay-1">
              <i className="uz-notch" aria-hidden="true" />
              <span className="mm-ph-h">🌅 {tr({ uz: 'Ertangi ekran', ru: 'Завтрашний экран' })}<b className="mm-ph-n" aria-hidden="true">{secs.length}/3</b></span>
              {cur && !cur.ok && <div className="mm-none fade-step" key={cur.k}><span className="mm-none-t"><span className="mm-none-ic" aria-hidden="true">{cur.ic}</span>{tr(cur.sec)}</span><span className="mm-tiles ghost" aria-hidden="true"><i /><i /><i /></span></div>}
              {secs.length === 0 && !(cur && !cur.ok) && <div className="mm-empty" aria-hidden="true"><i /><i /><i /></div>}
              {secs.map(m => (
                <div key={m.k} className={`mm-sec ${open === m.k ? 'lit' : ''}`}>
                  <span className="mm-sec-t"><span aria-hidden="true">{m.ic}</span> {tr(m.sec)}</span>
                  <MmTiles k={m.k} />
                </div>
              ))}
            </div>
          </Col>
        {all && <ScrollIn className="frame-success fade-step mm-sum"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Ilova har safar yozib qo'yadigan bitta narsa <b>maydon</b> deyiladi. Maydon faqat biror bo'limni ochsa kerak — bo'lim topilmasa, uni yozib qo'ymaymiz.</>, ru: <>Одна вещь, которую приложение записывает каждый раз, называется <b>полем</b>. Поле нужно, только если оно открывает какой-то раздел, — если раздела нет, его не записываем.</> })}</p></ScrollIn>}
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== TEST-SAVOL (F-0924-06) — PmLesson2 savol-qolipi (Screen4): eyebrow + BITTA h-ask sarlavha (pilot B1/B3 dan AYNAN).
// Lead (senariy matni) — oddiy qator, serif-karta EMAS: ikki sarlavha raqobatlashmaydi. ✓ joylashuvi INLINE_KEYS'dan.
const TestQ = ({ lead, ask }) => (
  <div className="tq">
    {lead && <p className="tq-lead">{lead}</p>}
    <h2 className="title h-ask">{ask}</h2>
  </div>
);
const arrange = (list, key) => { const [ok, ...rest] = list; const out = rest.slice(); out.splice(key, 0, ok); return out; };
const TestScreen = ({ id, n, lead, ask, qtext, list, ok, ...props }) => {
  const key = INLINE_KEYS[id];
  const items = arrange(list, key);
  const explainWrong = {};
  items.forEach((it, i) => { if (i !== key) explainWrong[i] = tr(it.why); });
  explainWrong.default = tr(list[1].why);
  return (
    <QuestionScreen {...props} eyebrow={tr({ uz: `Tekshiruv · ${n}`, ru: `Проверка · ${n}` })} scope="module-mikro"
      question={<TestQ lead={tr(lead)} ask={tr(ask)} />} questionText={tr(qtext)}
      options={items.map(it => tr(it.t))} correctIdx={key} explainCorrect={tr(ok)} explainWrong={explainWrong} />
  );
};

// ===== 4-EKRAN — HAQIQIY VOQEA: NETFLIX (K6 — faqat bank-faktlari; bashorat → 3 slayd → ko'prik) =====
const K_PREDICT = {
  ask: { uz: 'Netflix\'da odamlar film va seriallarni ikki yo\'l bilan topadi: qidiruvdan yoki tavsiyadan. Ko\'rishlarning qanchasi tavsiyadan keladi?', ru: 'В Netflix люди находят фильмы и сериалы двумя путями: через поиск или через рекомендации. Какая часть просмотров приходит из рекомендаций?' },
  chips: [{ ic: '🔹', t: '20 %' }, { ic: '🔷', t: '50 %' }, { ic: '💠', t: '80 %' }],
  ans: 2,
};
const K_SLIDES = [
  { ic: '🏠', body: { uz: 'Netflix\'da har kimning bosh sahifasi o\'ziniki. Undagi tavsiyalar odamning ko\'rish tarixidan yig\'iladi.', ru: 'В Netflix у каждого своя главная страница. Рекомендации на ней собираются из истории просмотров человека.' } },
  { ic: '📢', body: { uz: 'Netflix 2016-yilda ochiq aytgan: ko\'rishlarning taxminan 80 foizi tavsiyadan keladi, qidiruvdan emas.', ru: 'В 2016 году Netflix открыто сообщил: примерно 80 процентов просмотров приходят из рекомендаций, а не из поиска.' } },
  { ic: '🖐️', body: { uz: 'Ya\'ni har beshta ko\'rishdan taxminan to\'rttasi qidiruvdan emas, tavsiyadan keladi.', ru: 'То есть примерно четыре из каждых пяти просмотров приходят не из поиска, а из рекомендаций.' } },
];
// Maket (F-0924-07, 156-qonun): PmLesson11 NfMock — bitta xizmat, IKKI XIL bosh sahifa. Foto emas, chizma; logotip yo'q.
// Bashoratdan KEYIN chiqadi (§186): taxmin foizlar haqida, maket esa foizni aytmaydi — javob oldindan ochilmaydi.
const NF_PANES = [
  { who: { uz: 'Siz', ru: 'Вы' }, seen: { uz: 'kulgili kino', ru: 'комедии' }, tiles: ['🤡', '🎭', '🍿'], names: [{ uz: 'Masxaraboz', ru: 'Клоун' }, { uz: 'Sahnada kulgi', ru: 'Смех на сцене' }, { uz: 'Kino kechasi', ru: 'Вечер кино' }] },
  { who: { uz: 'Sinfdoshingiz', ru: 'Одноклассник' }, seen: { uz: "qo'rqinchli kino", ru: 'ужасы' }, tiles: ['👻', '🧟', '🦇'], names: [{ uz: 'Arvohli uy', ru: 'Дом-призрак' }, { uz: 'Tungi shahar', ru: 'Ночной город' }, { uz: "Qorong'i g'or", ru: 'Тёмная пещера' }] },
];
const NfMock = () => (
  <div className="nf-wrap" role="img" aria-label={tr({
    uz: "Ikki bosh sahifa yonma-yon: siz kulgili kino ko'rgansiz — sahifangizda kulgili kinolar turadi; sinfdoshingiz qo'rqinchli ko'rgan — uning sahifasida qo'rqinchli kinolar",
    ru: 'Две главные страницы рядом: вы смотрели комедии — на вашей странице комедии; у одноклассника просмотрены ужасы — на его странице ужасы' })}>
    <div className="nf-panes">
      {NF_PANES.map((pane, k) => (
        <div key={k} className="nf-scr">
          <div className="nf-top">
            <span className="nf-who">{tr(pane.who)}</span>
            <span className="nf-seen">{tr({ uz: "ko'rgani", ru: 'просмотрено' })}: {tr(pane.seen)}</span>
          </div>
          <span className="nf-rec">{tr({ uz: 'Sizga tavsiya', ru: 'Рекомендуем' })}</span>
          <div className="nf-row">{pane.tiles.map((t, j) => <i key={j} className="nf-tile"><span className="nf-em">{t}</span><span className="nf-nm">{tr(pane.names[j])}</span></i>)}</div>
        </div>
      ))}
    </div>
    <p className="nf-note">{tr({ uz: 'bitta xizmat — ikki xil bosh sahifa', ru: 'один сервис — две разные главные страницы' })}</p>
  </div>
);
// 2- va 3-slayd chizmasi (Dizayn 3-aylanish, bo'sh joyga holat-vizuali): faqat bank-fakti — ≈80 % tavsiyadan, ≈20 % qidiruvdan;
// «beshtadan to'rttasi» — besh katak. Foizdan boshqa son yo'q; javob taxmindan KEYIN chiqadi.
const KSplit = () => (
  <div className="kx" role="img" aria-label={tr({ uz: "Ko'rishlar: taxminan 80 foizi tavsiyadan, 20 foizi qidiruvdan", ru: 'Просмотры: примерно 80 процентов из рекомендаций, 20 процентов из поиска' })}>
    <div className="kx-bar" aria-hidden="true"><span className="kx-a">🏠 ≈80 %</span><span className="kx-b">🔍 ≈20 %</span></div>
    <div className="kx-lg" aria-hidden="true"><span className="kx-la">{tr({ uz: 'tavsiyadan', ru: 'из рекомендаций' })}</span><span className="kx-lb">{tr({ uz: 'qidiruvdan', ru: 'из поиска' })}</span></div>
  </div>
);
const KFive = () => (
  <div className="kx" role="img" aria-label={tr({ uz: "Beshta ko'rishdan to'rttasi tavsiyadan, bittasi qidiruvdan", ru: 'Из пяти просмотров четыре из рекомендаций, один из поиска' })}>
    <div className="kx-five" aria-hidden="true">{[0, 1, 2, 3, 4].map(k => <span key={k} className={`kx-c${k < 4 ? ' a' : ''}`} style={{ '--d': `${0.15 + k * 0.12}s` }}>{k < 4 ? '🏠' : '🔍'}</span>)}</div>
    <div className="kx-lg" aria-hidden="true"><span className="kx-la">4 — {tr({ uz: 'tavsiyadan', ru: 'из рекомендаций' })}</span><span className="kx-lb">1 — {tr({ uz: 'qidiruvdan', ru: 'из поиска' })}</span></div>
  </div>
);
const ScreenCase = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [i, setI] = useState(0);
  const [bet, setBet] = useState(undefined);
  const last = i === K_SLIDES.length - 1;
  const betPending = bet === undefined;
  useEffect(() => { if (last && !betPending && storedAnswer === undefined) onAnswer(screen, { correct: true }); }, [last, betPending]); // eslint-disable-line
  const c = K_SLIDES[i];
  const betHint = useTurnHint(betPending);
  // Navbat-zanjiri: taxmin → slayd ichidagi «Keyingisi →» → (oxirida) NavNext. Slayd o'z boshqaruvi bilan (PmLesson1 k-nav, pilot B1 / B3).
  const nextTurn = useTurnHint(!betPending && !last && !isMentor);
  const navLabel = isMentor || (!betPending && last) ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : betPending ? tr({ uz: 'Avval taxminingizni tanlang', ru: 'Сначала выберите свою догадку' })
    : tr({ uz: 'Avval voqeani oxirigacha oching', ru: 'Сначала откройте историю до конца' });
  return (
    <Stage eyebrow={tr({ uz: 'Haqiqiy voqea · Netflix', ru: 'Реальная история · Netflix' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={betPending || !last} disabled={(betPending || !last) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>Netflix</span> bosh sahifasi nimadan yig'iladi?</>, ru: <>Из чего собирается главная страница <span className="italic" style={{ color: T.accent }}>Netflix</span>?</> })}</h2></div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (F-0924-03/07 — qiziqtirish + bitta chorlov; 156-izoh: Netflix birinchi ko'rinishda glossli).
            B-18: holatga qarab — taxmin oldidan · slaydlarda · oxirgi slaydda (u yerda «Keyingisi →» yo'q). */}
        <Mentor>{betPending
          ? tr({ uz: <>Film va seriallar ko'rsatadigan Netflix xizmatining bosh sahifasi haqida bitta qiziq raqam bor — <b style={{ color: T.ink }}>uch javobdan</b> birini belgilang.</>, ru: <>О главной странице Netflix, сервиса фильмов и сериалов, есть одно интересное число, — отметьте один из <b style={{ color: T.ink }}>трёх ответов</b>.</> })
          : !last
          ? tr({ uz: <>Raqam qayerdan kelganini slaydlar birma-bir ko'rsatadi — <b style={{ color: T.ink }}>«Keyingisi →»</b>ni bosing.</>, ru: <>Слайды по очереди покажут, откуда взялось это число, — нажмите <b style={{ color: T.ink }}>«Следующий →»</b>.</> })
          : tr({ uz: <>Endi shu fikrni bizning ilovamizda tekshirasiz — <b style={{ color: T.ink }}>«Davom etish»</b>ni bosing.</>, ru: <>Теперь вы проверите эту мысль на нашем приложении, — нажмите <b style={{ color: T.ink }}>«Продолжить»</b>.</> })}</Mentor>
        <div className={`kp-bet fade-up delay-1 ${bet !== undefined ? 'done' : ''}`}>
          <h3 className="k-slide-h kp-ask">{tr(K_PREDICT.ask)}</h3>
          <div className="kp-chips">
            {K_PREDICT.chips.map((ch, k) => {
              const locked = bet !== undefined;
              const isAns = k === K_PREDICT.ans;
              let cls = 'kp-chip';
              if (locked) { cls += ' locked'; if (isAns) cls += ' correct'; else if (bet === k && !isMentor) cls += ' wrong'; }
              else cls += waveCls(betHint, k, K_PREDICT.chips.length);
              return (
                <button key={k} className={cls} disabled={locked} onClick={() => setBet(k)}>
                  <span className="kp-ic">{ch.ic}</span>{ch.t}
                  {locked && isAns && <span className="kp-mark ok">✓</span>}
                  {locked && !isAns && bet === k && !isMentor && <span className="kp-mark no">✗</span>}
                </button>
              );
            })}
          </div>
          {bet === undefined
              ? null /* F-0925-QA03: «Birini tanlang — javobi ochiladi» olindi — mentor-gap va puls takrori (3/4-o'tish 1-darsi naqshi) */
              : (!isMentor && <p className={`kp-res ${bet === K_PREDICT.ans ? 'hit' : 'miss'}`}>{bet === K_PREDICT.ans ? tr({ uz: '🎯 Topdingiz!', ru: '🎯 Угадали!' }) : tr({ uz: <>Adashdingiz — asl javob: «{K_PREDICT.chips[K_PREDICT.ans].t}».</>, ru: <>Не угадали — на самом деле: «{K_PREDICT.chips[K_PREDICT.ans].t}».</> })}</p>)}
        </div>
        {bet !== undefined && (
          // F-0925-B26: Netflix uslubidagi slayd — xizmatning o'z ranglari (#141414 · #E50914) va «NETFLIX» so'zi qalin shriftda.
          // Rasmiy logotip fayli EMAS (tovar belgisi) — foydalanuvchi qarori 25.09. Quyuq fon ataylab, faqat shu slaydda.
          <div className="k-slide ph fade-step revealed nf-theme" key={i} data-dark-ok="netflix-brand" style={{ background: '#141414' }}>
            <div className="k-fig">{i === 0 ? <NfMock /> : i === 1 ? <KSplit /> : <KFive />}</div>
            <span className="nf-brand" aria-hidden="true">NETFLIX</span>
            <span className="k-slide-eyebrow">{tr({ uz: 'Slayd', ru: 'Слайд' })} {i + 1} / {K_SLIDES.length}</span>
            <p className="k-slide-body">{tr(c.body)}</p>
            <div className="k-nav">
              <button type="button" className="btn-soft k-prev" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущий' })}</button>
              <div className="k-dots">{K_SLIDES.map((_, k) => <button key={k} type="button" className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-slayd`, ru: `Слайд ${k + 1}` })} />)}</div>
              {!last && <button type="button" className={`k-next${nextTurn ? ' turn-ring' : ''}`} onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Следующий →' })}</button>}
            </div>
          </div>
        )}
        {bet !== undefined && last && <ScrollIn className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Ilova ertangi bosh sahifani o'zi yozib qo'ygan ma'lumotdan tuzadi. Shuning uchun nimani yozib qo'yish — ilovani quradigan jamoaning muhim qarori.", ru: 'Завтрашнюю главную страницу приложение собирает из тех данных, которые записало. Поэтому что записывать — важное решение команды, которая строит приложение.' })}</p></ScrollIn>}
      </div>
    </Stage>
  );
};

// ===== 5-EKRAN — TEST-1 (✓ senariyda birinchi) =====
const T1 = {
  lead: { uz: 'Jamoa ilovamizga to\'rtta yangi maydon taklif qildi.', ru: 'Команда предложила добавить в наше приложение четыре новых поля.' },
  ask: { uz: 'Bizning ilovamizda qaysi birini yozib qo\'yishga arziydi?', ru: 'Какое из них в нашем приложении стоит записывать?' },
  qtext: { uz: 'Qaysi yangi maydonni yozib qo\'yishga arziydi', ru: 'Какое новое поле стоит записывать' },
  list: [
    { t: { uz: 'Qaysi videoga layk bosildi', ru: 'Какому видео поставили лайк' } },
    { t: { uz: 'Qaysi telefon modelidan kirildi', ru: 'Какая модель телефона была при входе' }, why: { uz: 'Bizning ilovamizda telefon modelidan ochiladigan bo\'lim yo\'q. Bo\'lim topilmasa — hozircha yozib qo\'ymaymiz.', ru: 'В нашем приложении нет раздела, который открывается из модели телефона. Нет раздела — пока не записываем.' } },
    { t: { uz: 'Batareyada necha foiz qolgan edi', ru: 'Сколько процентов оставалось на батарее' }, why: { uz: 'Batareya foizidan bizning ilovamizda qaysi bo\'lim ochiladi? Bo\'lim topilmasa — hozircha yozib qo\'ymaymiz.', ru: 'Какой раздел в нашем приложении откроется из процента батареи? Нет раздела — пока не записываем.' } },
    { t: { uz: 'Telefonda bo\'sh joy qancha edi', ru: 'Сколько свободного места было в телефоне' }, why: { uz: 'Telefondagi bo\'sh joydan bizning ilovamizda qaysi bo\'lim ochiladi? Bo\'lim topilmasa — hozircha yozib qo\'ymaymiz.', ru: 'Какой раздел в нашем приложении откроется из свободного места в телефоне? Нет раздела — пока не записываем.' } },
  ],
  ok: { uz: 'To\'g\'ri — bu maydondan «Yoqtirganlaringiz» bo\'limi ochiladi.', ru: 'Верно — из этого поля открывается раздел «Понравившиеся».' },
};
const ScreenTest1 = (props) => <TestScreen {...props} id="s5" n={1} {...T1} />;

// ===== 6-EKRAN — SAHIFANGIZNI KIM KO'RADI (imzo-vizual): ikki tomon, har maydon qo'yilganda o'z fakti (§175) =====
// Noto'g'ri tomonga qo'yilsa — o'sha maydonning fakti chiqadi va u joyiga qaytadi (yangi matn to'qilmagan).
const SIDES = [
  { k: 'open', ic: '🔓', t: { uz: 'Hammaga ochiq', ru: 'Открыто всем' } },
  { k: 'closed', ic: '🔒', t: { uz: 'Faqat egasiga', ru: 'Только владельцу' } },
];
const FIELDS6 = [
  { k: 'kanal', side: 'open', t: { uz: 'Kanal nomi', ru: 'Название канала' }, fact: { uz: 'Kanalingizni odamlar topishi kerak.', ru: 'Люди должны находить ваш канал.' } },
  { k: 'videolar', side: 'open', t: { uz: 'Kanalga joylagan videolaringiz', ru: 'Видео, которые вы разместили на канале' }, fact: { uz: 'Bu videolarni odamlar ko\'rishi uchun kanalingizga joylagansiz.', ru: 'Вы разместили эти видео на канале, чтобы люди их смотрели.' } },
  { k: 'layk', side: 'both', t: { uz: 'Qaysi videolarga layk bosgansiz', ru: 'Каким видео вы ставили лайк' }, fact: { uz: 'Bu maydon ikkala tomonda ham bo\'lishi mumkin — ochiq qolish ham qaror, uni egasi beradi.', ru: 'Это поле может быть с любой стороны — оставить открытым тоже решение, и принимает его владелец.' } },
  { k: 'korgan', side: 'closed', t: { uz: 'Qaysi videolarni ko\'rgansiz', ru: 'Какие видео вы смотрели' }, fact: { uz: 'Begona siz nimalarni ko\'rganingizni bilib oladi.', ru: 'Чужой узнает, что вы смотрели.' } },
  { k: 'telefon', side: 'closed', t: { uz: 'Telefon raqamingiz', ru: 'Ваш номер телефона' }, fact: { uz: 'Raqamingizni bilgan begona sizga qo\'ng\'iroq qilib, bezovta qila oladi.', ru: 'Чужой, который знает ваш номер, может звонить вам и беспокоить.' } },
  { k: 'parol', side: 'closed', t: { uz: 'Parolingiz', ru: 'Ваш пароль' }, fact: { uz: 'Parolni bilgan begona sahifangizga kirib oladi.', ru: 'Чужой, который знает пароль, зайдёт на вашу страницу.' } },
];
// Maydon ikonkalari — faqat ko'rinish qatlami (FIELDS6 ma'lumotiga tegilmaydi).
const F6_IC = { kanal: '📺', videolar: '🎞️', layk: '👍', korgan: '🕘', telefon: '📞', parol: '🔑' };
// Maydon qiymati (Dizayn 3-aylanish, pilot 9-band) — begona ko'zi bilan: ochiq tomonda qiymat ko'rinadi, yopiq tomonda
// yulduzcha bilan yopiladi. Faqat ko'rinish qatlami; misol-ip hook va 8-ekran bilan bir («Hovli futboli» kanali).
const F6_VAL = {
  kanal: { uz: '«Hovli futboli»', ru: '«Дворовый футбол»' },
  videolar: { uz: '12 ta video', ru: '12 видео' },
  layk: { uz: '34 ta video', ru: '34 видео' },
  korgan: { uz: '58 ta video', ru: '58 видео' },
  telefon: { uz: '+998 90 123 45 67', ru: '+998 90 123 45 67' },
  parol: { uz: '••••••••', ru: '••••••••' },
};
const F6_MASK = { uz: '•••••••', ru: '•••••••' };
const ScreenWhoSees = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [place, setPlace] = useState({});
  const [sel, setSel] = useState(null);
  const [note, setNote] = useState(null); // { k, ok }
  const placedN = Object.keys(place).length;
  const all = placedN >= FIELDS6.length;
  useEffect(() => { if (all && !(storedAnswer && storedAnswer.solved)) onAnswer(screen, { stage: 'explore', screenIdx: screen, solved: true, correct: true }); }, [all]); // eslint-disable-line
  const drop = (side) => {
    if (!sel) return;
    const f = FIELDS6.find(x => x.k === sel);
    const ok = f.side === 'both' || f.side === side;
    if (ok) setPlace(p => ({ ...p, [f.k]: side }));
    setNote({ k: f.k, ok });
    setSel(null);
  };
  const pile = FIELDS6.filter(f => !place[f.k]);
  const pend = pile.map(f => f.k);
  const lit = useTurnWalk(sel ? [] : pend, !isMentor);
  const noteF = note && FIELDS6.find(x => x.k === note.k);
  return (
    <Stage eyebrow={tr({ uz: '2-qism · Kimga ko\'rinadi', ru: 'Часть 2 · Кому видно' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all} label={all || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Maydonlarni tomonlarga qo'ying (${placedN}/${FIELDS6.length})`, ru: `Разложите поля по сторонам (${placedN}/${FIELDS6.length})` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{/* F-0925-QA38: sarlavha bir qatorga qisqardi */}{tr({ uz: <>Begona odam sahifangizda <span className="italic" style={{ color: T.accent }}>qaysi maydonlarni</span> ko'radi?</>, ru: <>Какие <span className="italic" style={{ color: T.accent }}>поля</span> чужой увидит на вашей странице?</> })}</h2></div>
        {/* 🎓 Metodist 24.09: pufakda GATE S senariy yo'rig'i so'zma-so'z (6-ekran «Yo'riq») — o'zgartirilmadi; «Bu …» boshlanishi (§24)
            va NEGA yo'qligi foydalanuvchi qaroriga yozildi. B-18: oltalasi joylangach yashirinadi — xulosa gapiradi. */}
        {!all && <Mentor>{tr({ uz: 'Bu darsda ikki holat bilan ishlaymiz. Har maydonni ikki tomondan biriga qo\'ying.', ru: 'На этом уроке работаем с двумя вариантами. Положите каждое поле на одну из двух сторон.' })}</Mentor>}
        {pile.length > 0 && (
          <div className="ws-pile fade-up delay-1">
            <span className="hint-line">{tr({ uz: 'Avval maydonni tanlang, so\'ng tomonni bosing.', ru: 'Сначала выберите поле, потом нажмите сторону.' })}</span>
            <div className="ws-chips">
              {pile.map(f => (
                <button key={f.k} type="button" className={`ws-chip ${sel === f.k ? 'on' : ''}${turnCls(lit, f.k, pend.length > 1)}`} onClick={() => { setSel(s => (s === f.k ? null : f.k)); setNote(null); }} aria-pressed={sel === f.k}><span className="ws-chip-ic" aria-hidden="true">{F6_IC[f.k]}</span>{tr(f.t)}</button>
              ))}
            </div>
          </div>
        )}
        {note && noteF && !note.ok && <div className="ws-note no fade-step" key={note.k}><span className="ws-back" aria-hidden="true">↩</span><span><b>{tr(noteF.t)}</b> — {tr(noteF.fact)}</span></div>}
        <Zoomable className="zsplit ws-z">
        {/* F-0925-QA39: «Ikki tomon — begona nimani ko'radi» yorlig'i olindi — vazifani mentor-gap aytadi */}
        <div className="ws-sides fade-up delay-2">
          {SIDES.map(s => (
            <button key={s.k} type="button" className={`ws-side ${s.k} ${sel ? 'ready' : ''}`} onClick={() => drop(s.k)} disabled={!sel}>
              <span className="ws-side-h"><span className="ws-side-ic" aria-hidden="true">{s.ic}</span>{tr(s.t)}<b className="ws-cnt">{FIELDS6.filter(f => place[f.k] === s.k).length}</b></span>
              <span className="ws-items">
                {FIELDS6.filter(f => place[f.k] === s.k).map(f => {
                  const last = note && note.ok && note.k === f.k;
                  return (
                    <span key={f.k} className={`ws-item ${last ? 'last' : ''}`} title={tr(f.fact)}>
                      <span className="ws-item-t"><span aria-hidden="true">{F6_IC[f.k]}</span> {tr(f.t)}</span>
                      <span className={`ws-item-v ${s.k}`}>{s.k === 'open' ? tr(F6_VAL[f.k]) : <>🔒 {tr(F6_MASK)}</>}</span>
                      {last && <span className="ws-item-f">{tr(f.fact)}</span>}
                    </span>
                  );
                })}
              </span>
            </button>
          ))}
        </div>
        </Zoomable>
        {all && <ScrollIn className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Kanal nomi ochiq — odamlar sizni shu bilan topadi. Parol yopiq — begona bilsa, sahifangizga zarar yetadi. Qoida: egasiga zarar yetkazadigan maydon yopiladi.", ru: 'Название канала открыто — по нему вас находят. Пароль закрыт — если его узнает чужой, вашей странице будет вред. Правило: закрывают поле, которое может навредить владельцу.' })}</p></ScrollIn>}
      </div>
    </Stage>
  );
};

// ===== 7-EKRAN — TEST-2 =====
const T2 = {
  lead: { uz: 'Ilovamizga yangi maydon qo\'shildi: «Oxirgi marta qachon kirgan».', ru: 'В наше приложение добавили новое поле: «Когда заходил в последний раз».' },
  ask: { uz: 'Bu maydonni yopish yoki ochiq qoldirishda nimaga qaraymiz?', ru: 'На что мы смотрим, решая, закрыть это поле или оставить открытым?' },
  qtext: { uz: 'Maydonni yopish yoki ochiq qoldirish mezoni', ru: 'Критерий: закрыть поле или оставить открытым' },
  list: [
    { t: { uz: 'Begona ko\'rsa, egasiga zarar yetadimi', ru: 'Навредит ли владельцу, если увидит чужой' } },
    { t: { uz: 'Ilova buni har kuni yangilab turadimi', ru: 'Обновляет ли его приложение каждый день' }, why: { uz: 'Qanchalik tez-tez yangilanishi hech narsani hal qilmaydi. Begona buni ko\'rsa, nima bo\'ladi?', ru: 'Как часто оно обновляется, ничего не решает. Что будет, если это увидит чужой?' } },
    { t: { uz: 'Bunga boshqa odamlar ko\'p qiziqadimi', ru: 'Интересуются ли этим многие другие люди' }, why: { uz: 'Qiziqish kam yoki ko\'pligi mezon emas. Begona buni ko\'rsa, kimga zarar yetadi?', ru: 'Мало или много интереса — не критерий. Кому будет вред, если это увидит чужой?' } },
    { t: { uz: 'Unda so\'z bormi yoki faqat raqam turadimi', ru: 'Там есть слова или стоят только цифры' }, why: { uz: 'Yozuvning turi hech narsani hal qilmaydi. Begona buni ko\'rsa, egasiga nima bo\'ladi?', ru: 'Тип записи ничего не решает. Что будет с владельцем, если это увидит чужой?' } },
  ],
  ok: { uz: 'To\'g\'ri — mezon bitta: begona buni ko\'rsa, egasiga zarar yetadimi. Yetsa — maydon yopiladi, yetmasa — ochiq qolishi mumkin.', ru: 'Верно — критерий один: навредит ли владельцу, если это увидит чужой. Если навредит — поле закрывают, если нет — оно может остаться открытым.' },
};
const ScreenTest2 = (props) => <TestScreen {...props} id="s7" n={2} {...T2} />;

// ===== 8-EKRAN — ILOVA FAQAT YOZILGANINI BILADI (imzo-vizual): e'lon-gap ↔ maydon konstruktori, «Maydon qo'shish» =====
const AD_FIELDS = [
  { k: 'nom', t: { uz: 'Video nomi', ru: 'Название видео' } },
  { k: 'kanal', t: { uz: 'Kanal', ru: 'Канал' } },
  { k: 'soni', t: { uz: 'Ko\'rishlar soni', ru: 'Число просмотров' } },
];
const AD_NEW = { k: 'sana', t: { uz: 'Yuklangan sana', ru: 'Дата загрузки' } };
// Maydonda yozilgan qiymat (Dizayn 3-aylanish, pilot 9-band): sxema qatori «nom → qiymat». Hook videosi bilan bir ip.
const AD_VAL = {
  nom: { uz: 'Eng chiroyli 10 gol', ru: '10 самых красивых голов' },
  kanal: { uz: 'Hovli futboli', ru: 'Дворовый футбол' },
  soni: { uz: '1 240', ru: '1 240' },
  sana: { uz: '12.09.2026', ru: '12.09.2026' },
};
const AD_GAPS = [
  { k: 'g1', f: 'nom', t: { uz: 'Video nomini ko\'rasiz', ru: 'Вы видите название видео' } },
  { k: 'g2', f: 'kanal', t: { uz: 'Kim yuklaganini ko\'rasiz', ru: 'Вы видите, кто загрузил' } },
  { k: 'g3', f: 'soni', t: { uz: 'Nechta odam ko\'rganini ko\'rasiz', ru: 'Вы видите, сколько человек посмотрели' } },
  { k: 'g4', f: 'sana', t: { uz: 'Video qachon yuklanganini ko\'rasiz', ru: 'Вы видите, когда загрузили видео' } },
  { k: 'g5', f: null, t: { uz: 'Ilova juda tez ishlaydi', ru: 'Приложение работает очень быстро' } },
];
const AD_MSG = {
  noSana: { uz: 'Bizning ilovamizda sana hech qayerda yozilmagan — ilova uni ko\'rsata olmaydi, gap yolg\'on chiqadi.', ru: 'В нашем приложении дата нигде не записана — приложение не сможет её показать, фраза окажется неправдой.' },
  wrongSana: { uz: 'Bu maydonda boshqa narsa yozilgan. Sana qaysi maydonda turibdi?', ru: 'В этом поле записано другое. В каком поле лежит дата?' },
  wrong: { uz: 'Bu maydonda boshqa narsa yozilgan.', ru: 'В этом поле записано другое.' },
  tez: { uz: '«Juda tez» — hozircha umumiy baho: unda nima o\'lchanishi aytilmagan. Bu gap odamga hech qanday ma\'lumot ko\'rsatmaydi, shuning uchun unga maydon tanlamaymiz.', ru: '«Очень быстро» — пока общая оценка: в ней не сказано, что измеряется. Эта фраза не показывает человеку никаких данных, поэтому поле для неё не выбираем.' },
};
const ScreenAd = ({ screen, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [links, setLinks] = useState({}); // gap → field | '-'
  const [sel, setSel] = useState(null);
  const [added, setAdded] = useState(false);
  const [msg, setMsg] = useState(null); // { key, bad }
  const fields = added ? [...AD_FIELDS, AD_NEW] : AD_FIELDS;
  const done = AD_GAPS.filter(g => links[g.k]).length;
  const all = done >= AD_GAPS.length;
  const pickGap = (g) => {
    if (links[g.k]) return;
    setSel(s => (s === g.k ? null : g.k));
    if (g.k === 'g5') { setLinks(p => ({ ...p, g5: '-' })); setSel(null); setMsg({ key: 'tez' }); return; }
    if (g.k === 'g4' && !added) setMsg({ key: 'noSana' }); else setMsg(null);
  };
  const pickField = (f) => {
    if (!sel) return;
    const g = AD_GAPS.find(x => x.k === sel);
    if (g.f === f.k) { setLinks(p => ({ ...p, [g.k]: f.k })); setSel(null); setMsg(null); }
    else setMsg({ key: g.k === 'g4' ? 'wrongSana' : 'wrong', bad: true });
  };
  const addField = () => { setAdded(true); setLinks(p => ({ ...p, g4: 'sana' })); setSel(null); setMsg(null); };
  const pend = AD_GAPS.filter(g => !links[g.k]).map(g => g.k);
  const lit = useTurnWalk(sel ? [] : pend, !isMentor);
  return (
    <Stage eyebrow={tr({ uz: '3-qism · Gap ortida maydon', ru: 'Часть 3 · За фразой — поле' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all} label={all || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Har gapni maydon bilan bog'lang (${done}/${AD_GAPS.length})`, ru: `Свяжите каждую фразу с полем (${done}/${AD_GAPS.length})` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>E'londagi har va'dani ilova <span className="italic" style={{ color: T.accent }}>qayerdan biladi</span>?</>, ru: <>Откуда приложение <span className="italic" style={{ color: T.accent }}>берёт то</span>, что обещано в объявлении?</> })}</h2></div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 · §24: predmetdan boshlanadi; NEGA-qismi «e'lon»ni birinchi ko'rinishda ochadi — bir xil qoladi).
            B-18: chorlov holatga qarab — boshida · sana gapi tanlanganda («＋ Maydon qo'shish») · qolganlari; beshalasi bog'langach yashirinadi. */}
        {!all && <Mentor>{sel === 'g4' && !added
          ? tr({ uz: <>Ilova faqat yozib qo'ygan narsasini ko'rsatadi — sana uchun <b style={{ color: T.ink }}>«＋&nbsp;Maydon&nbsp;qo'shish»</b>ni bosing.</>, ru: <>Приложение показывает только то, что записало, — для даты нажмите <b style={{ color: T.ink }}>«＋&nbsp;Добавить&nbsp;поле»</b>.</> })
          : done === 0
          ? tr({ uz: <>Ilova faqat yozib qo'ygan narsasini ko'rsatadi — <b style={{ color: T.ink }}>gapni tanlang</b>, so'ng uning maydonini bosing.</>, ru: <>Приложение показывает только то, что записало, — <b style={{ color: T.ink }}>выберите фразу</b>, потом нажмите её поле.</> })
          : tr({ uz: <>Ilova faqat yozib qo'ygan narsasini ko'rsatadi — <b style={{ color: T.ink }}>qolgan gaplarni</b> ham maydon bilan bog'lang.</>, ru: <>Приложение показывает только то, что записало, — свяжите с полем и <b style={{ color: T.ink }}>остальные фразы</b>.</> })}</Mentor>}
        {/* F-0925-QA40: yo'riq-qator («Avval gapni tanlang…») olindi — mentor-gap qisqardi va shu harakatni o'zi aytadi */}
        <Zoomable className="zsplit ad-z">
        <div className="split">
          <Col>
            <div className="ad-poster">
              {AD_GAPS.map((g, gi) => {
                const l = links[g.k];
                const f = l && l !== '-' ? fields.find(x => x.k === l) : null;
                return (
                  <button key={g.k} type="button" className={`ad-gap ${sel === g.k ? 'on' : ''} ${l ? (l === '-' ? 'none' : 'ok') : ''}${turnCls(lit, g.k, pend.length > 1)}`} onClick={() => pickGap(g)} aria-pressed={sel === g.k}>
                    <span className="ad-n" aria-hidden="true">{l && l !== '-' ? '✓' : gi + 1}</span>
                    <span className="ad-gap-t">«{tr(g.t)}»</span>
                    {f && <span className="ad-link">→ {tr(f.t)}</span>}
                    {l === '-' && <span className="ad-link none" aria-hidden="true">∅</span>}
                  </button>
                );
              })}
            </div>
          </Col>
          <Col>
            {/* Tekshiruvchi 25.09 (111-qonun): ustun-yorlig'i olib tashlandi — quti o'z sarlavhasida xuddi shu gapni aytadi */}
            <div className="ad-schema">
              <span className="ic-h">🗂 {tr({ uz: 'Ilova yozib qo\'yadigan maydonlar', ru: 'Поля, которые записывает приложение' })}</span>
              {fields.map(f => {
                const used = Object.values(links).includes(f.k);
                const gn = AD_GAPS.findIndex(g => links[g.k] === f.k);
                return (
                  <button key={f.k} type="button" className={`ad-field ${sel ? 'ready' : ''} ${used ? 'used' : ''} ${f.k === 'sana' ? 'new' : ''}`} disabled={!sel} onClick={() => pickField(f)}>
                    <span className="ad-field-t">{tr(f.t)}</span>
                    <span className="ad-field-v">{tr(AD_VAL[f.k])}</span>
                    {used && <span className="ad-fn" aria-hidden="true">{gn + 1}</span>}
                  </button>
                );
              })}
              {sel === 'g4' && !added && <button type="button" className="ad-add fade-step" onClick={addField}>＋ {tr({ uz: 'Maydon qo\'shish', ru: 'Добавить поле' })}</button>}
            </div>
            {msg && <div className={`ws-note fade-step ${msg.bad ? 'no' : ''}`}>{tr(AD_MSG[msg.key])}</div>}
          </Col>
        </div>
        </Zoomable>
        {all && <ScrollIn className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Ilova odamga ko'rsatadigan ma'lumot qayerdadir yozilgan bo'lishi kerak. Bizning ilovamizda e'londagi har ma'lumot ortida kerakli maydon turadi. Ilovaning hamma maydonlari ro'yxati <b>sxema</b> deyiladi. Sxema qisqa qoladi: kontaktlar kabi hech qaysi gapga kerak bo'lmagan maydon unga kirmaydi.</>, ru: <>Данные, которые приложение показывает человеку, должны быть где-то записаны. В нашем приложении за каждым сведением из объявления стоит нужное поле. Список всех полей приложения называется <b>схемой</b>. Схема остаётся короткой: поле, которое не нужно ни одной фразе, как контакты, в неё не входит.</> })}</p></ScrollIn>}
      </div>
    </Stage>
  );
};

// ===== 9-EKRAN — TEST-3 =====
const T3 = {
  lead: { uz: 'Jamoa ilovamiz e\'loniga yangi gap qo\'shdi: «Video qaysi tilda ekanini ko\'rasiz».', ru: 'Команда добавила в объявление нашего приложения новую фразу: «Вы видите, на каком языке видео».' },
  ask: { uz: 'Endi sxemaga nima bo\'ladi?', ru: 'Что теперь будет со схемой?' },
  qtext: { uz: 'E\'longa yangi gap qo\'shilganda sxema', ru: 'Схема, когда в объявление добавили фразу' },
  list: [
    { t: { uz: 'Sxemaga yangi «Til» maydoni qo\'shiladi', ru: 'В схему добавят новое поле «Язык»' } },
    { t: { uz: 'Sxemaga «Yaxshi video» maydoni qo\'shiladi', ru: 'В схему добавят поле «Хорошее видео»' }, why: { uz: '«Yaxshi» — baho so\'zi, ma\'lumot emas. Yangi gap odamga nimani ko\'rsatadi?', ru: '«Хорошее» — слово-оценка, а не данные. Что новая фраза показывает человеку?' } },
    { t: { uz: '«Ko\'rishlar soni» o\'rniga «Til» yoziladi', ru: 'Вместо «Числа просмотров» запишут «Язык»' }, why: { uz: '«Ko\'rishlar soni» o\'chsa, «Nechta odam ko\'rganini ko\'rasiz» gapi yolg\'on chiqadi.', ru: 'Если убрать «Число просмотров», фраза «Вы видите, сколько человек посмотрели» окажется неправдой.' } },
    { t: { uz: 'Hech narsa — e\'londagi gapning o\'zi yetadi', ru: 'Ничего — хватит самой фразы в объявлении' }, why: { uz: 'Gap — odamga va\'da. Ilova tilni qayerdan oladi?', ru: 'Фраза — это обещание человеку. Откуда приложение возьмёт язык?' } },
  ],
  ok: { uz: 'To\'g\'ri — bizning sxemamizda til yozilgan maydon yo\'q. Ilova tilni ko\'rsatishi uchun yangi maydon kerak.', ru: 'Верно — в нашей схеме нет поля, где записан язык. Чтобы приложение показывало язык, нужно новое поле.' },
};
const ScreenTest3 = (props) => <TestScreen {...props} id="s9" n={3} {...T3} />;

// ===== 10-EKRAN — UCH QAVAT (imzo-vizual): layk yo'li sahifa → server → baza, keyin «Telefonni o'chirish» =====
const FLOORS = [
  { k: 'sahifa', ic: '📱', n: { uz: 'Sahifa', ru: 'Страница' }, job: { uz: 'ko\'rsatadi', ru: 'показывает' }, why: { uz: '👍 belgisi yonadi', ru: '👍 загорается' } },
  { k: 'server', ic: '🛡️', n: { uz: 'Server', ru: 'Сервер' }, job: { uz: 'tekshiradi', ru: 'проверяет' }, why: { uz: 'kim bosdi va u shu videoga oldin layk bosmaganmi', ru: 'кто нажал и не ставил ли он уже лайк этому видео' } },
  { k: 'baza', ic: '🗄️', n: { uz: 'Baza', ru: 'База' }, job: { uz: 'eslab qoladi', ru: 'запоминает' }, why: { uz: 'ertaga ham turadi', ru: 'лайк будет и завтра' } },
];
// Qavatlardagi holat (Dizayn 3-aylanish, pilot 9/12-band): har qavat o'z ishini bajargach yonida qisqa holat-yozuvi.
// Telefon o'chganda sahifa «o'chiq», baza esa laykni saqlab turadi — «eslab qoladi» ko'z bilan ko'rinadi.
const FL_ST = {
  sahifa: { on: '👍 1', off: { uz: '⏻ o\'chiq', ru: '⏻ выкл.' } },
  server: { on: { uz: '✓ tekshirildi', ru: '✓ проверено' } },
  baza: { on: { uz: '💾 1 ta layk', ru: '💾 1 лайк' } },
};
const ScreenFloors = ({ screen, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [step, setStep] = useState(0); // 0..3
  const [phase, setPhase] = useState('on'); // on | off | back
  useEffect(() => {
    if (step === 0 || step >= 3) return;
    const t = setTimeout(() => setStep(s => s + 1), reducedMotion() ? 0 : 1100);
    return () => clearTimeout(t);
  }, [step]);
  useEffect(() => {
    if (phase !== 'off') return;
    const t = setTimeout(() => setPhase('back'), reducedMotion() ? 0 : 1300);
    return () => clearTimeout(t);
  }, [phase]);
  const like = () => { if (step === 0) setStep(1); };
  const done = phase === 'back';
  // Lift-kabina: layk qaysi qavatda turibdi (0 — sahifa · 2 — baza). Telefon qayta yonganda kabina
  // bazadan sahifaga qaytadi — sahifa laykni so'rab, qayta ko'rsatadi. Faqat ko'rinish qatlami.
  const car = step === 0 ? -1 : done ? 0 : Math.min(step, 3) - 1;
  const likeTurn = useTurnHint(step === 0 && !isMentor);
  const offTurn = useTurnHint(step >= 3 && phase === 'on' && !isMentor);
  const label = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : step === 0 ? tr({ uz: '① 👍 tugmasini bosing', ru: '① Нажмите 👍' })
    : step < 3 ? tr({ uz: 'Layk yo\'lini kuzating…', ru: 'Следите за путём лайка…' })
    : phase === 'on' ? tr({ uz: '② «Telefonni o\'chirish»ni bosing', ru: '② Нажмите «Выключить телефон»' })
    : tr({ uz: 'Telefon qayta yonyapti…', ru: 'Телефон включается…' });
  return (
    <Stage eyebrow={tr({ uz: '4-qism · Qanday ishlaydi', ru: 'Часть 4 · Как это работает' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} turnBusy={!done} label={label} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Layk bosdingiz. Ilovaning ichida <span className="italic" style={{ color: T.accent }}>nima bo'ldi</span>?</>, ru: <>Вы нажали лайк. Что <span className="italic" style={{ color: T.accent }}>произошло</span> внутри приложения?</> })}</h2></div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210). B-18: holatga qarab — 👍 oldidan · yo'l ochilayotganda · «Telefonni o'chirish» oldidan;
            telefon qayta yonib, layk joyida qolgach yashirinadi — xulosa gapiradi. «Qavat» so'zi xulosagacha ishlatilmaydi (§126). */}
        {!done && <Mentor>{step === 0
          ? tr({ uz: <>Layk bosilganda ilova ichida nima bo'layotgani telefon ekranida ko'rinmaydi — uni ko'rish uchun <b style={{ color: T.ink }}>«👍»</b>ni bosing.</>, ru: <>Что происходит внутри приложения при лайке, на экране телефона не видно, — чтобы увидеть это, нажмите <b style={{ color: T.ink }}>«👍»</b>.</> })
          : step >= 3 && phase === 'on'
          ? tr({ uz: <>Telefon o'chib-yonganda ham layk joyida qolsa, ilova uni eslab qolgan bo'ladi — <b style={{ color: T.ink }}>«Telefonni o'chirish»</b>ni bosing.</>, ru: <>Если после выключения телефона лайк останется на месте, значит, приложение его запомнило, — нажмите <b style={{ color: T.ink }}>«Выключить телефон»</b>.</> })
          : tr({ uz: <>Layk bosilganda ilova ichida nima bo'layotgani telefon ekranida ko'rinmaydi — <b style={{ color: T.ink }}>layk yo'lini</b> kuzating.</>, ru: <>Что происходит внутри приложения при лайке, на экране телефона не видно, — следите за <b style={{ color: T.ink }}>путём лайка</b>.</> })}</Mentor>}
        <Zoomable className="zsplit">
        <div className="split">
          <Col>
            <FlowLabel>{tr({ uz: 'Telefon', ru: 'Телефон' })}</FlowLabel>
            <div className={`fl-phone fade-up delay-1 ${phase === 'off' ? 'off' : ''}`}>
              <i className="uz-notch" aria-hidden="true" />
              {phase === 'off' ? <div className="fl-off" aria-hidden="true">⏻</div> : (
                <>
                  <div className="fl-video" aria-hidden="true"><span>▶</span><span className="hk-ph-tc">24:30</span></div>
                  <span className="hk-ph-meta" aria-hidden="true"><span className="hk-ph-t">{tr(HK_VID.t)}</span><span className="hk-ph-ch">{tr(HK_VID.ch)}</span></span>
                  <button type="button" className={`fl-like ${step >= 1 ? 'on' : ''}${done ? ' back' : ''}${likeTurn ? ' turn-ring' : ''}`} onClick={like} disabled={step > 0} aria-pressed={step >= 1}>👍 {step >= 1 ? 1 : 0}</button>
                </>
              )}
            </div>
            {step >= 3 && phase === 'on' && <button type="button" className={`fl-offbtn fade-step${offTurn ? ' turn-ring' : ''}`} onClick={() => setPhase('off')}>⏻ {tr({ uz: 'Telefonni o\'chirish', ru: 'Выключить телефон' })}</button>}
            {done && <div className="ws-note ok fade-step">{tr({ uz: 'Layk joyida — baza uni eslab qoldi, ilova shu ma\'lumotdan foydalanib uni yana ko\'rsatdi.', ru: 'Лайк на месте — база его запомнила, и приложение, взяв эти данные, снова его показало.' })}</div>}
          </Col>
          <Col>
            <FlowLabel>{tr({ uz: "Ilova ichi — layk yo'li", ru: 'Внутри приложения — путь лайка' })}</FlowLabel>
            <div className={`fl-bld${done ? ' up' : ''}`}>
              {FLOORS.map((f, i) => (
                <div key={f.k} className={`fl-step ${step > i ? 'on' : ''} ${car === i ? 'here' : ''}`}>
                  <span className="fl-shaft" aria-hidden="true">
                    <i className="fl-rope" />
                    {car === i && <span className="fl-car" key={`${i}-${phase}`}>👍</span>}
                  </span>
                  <span className="fl-ic" aria-hidden="true">{f.ic}</span>
                  <span className="fl-txt"><span className="fl-n">{N3[i]}</span> <b>{tr(f.n)}</b> — {tr(f.job)}{step > i && <span className="fl-why fade-step">{tr(f.why)}</span>}</span>
                  {step > i && (() => { const off = phase === 'off' && FL_ST[f.k].off; return <span className={`fl-st fade-step${off ? ' off' : ''}${phase === 'off' && f.k === 'baza' ? ' keep' : ''}`} key={off ? 'off' : 'on'}>{tr(off || FL_ST[f.k].on)}</span>; })()}
                </div>
              ))}
              <i className="fl-ground" aria-hidden="true" />
            </div>
          </Col>
        </div>
        </Zoomable>
        {done && <ScrollIn className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bu uch qadam — ilovaning uch <b>qismi</b>: sahifa ko'rsatadi, server tekshiradi, baza eslab qoladi. «Server» va «baza» — dasturchilar so'zi. Layk kabi bosish uchala qismdan o'tadi.</>, ru: <>Эти три шага — три <b>части</b> приложения: страница показывает, сервер проверяет, база запоминает. «Сервер» и «база» — слова программистов. Нажатие, например лайк, проходит через все три части.</> })}</p></ScrollIn>}
      </div>
    </Stage>
  );
};

// ===== 11-EKRAN — TEST-4 =====
const T4 = {
  lead: { uz: 'Akkauntingizga kirmasdan layk bosdingiz. Ekranda «Avval kiring» yozuvi chiqdi.', ru: 'Вы нажали лайк, не войдя в аккаунт. На экране появилась надпись «Сначала войдите».' },
  ask: { uz: 'Siz kirmaganingizni ilovaning qaysi qismi aniqladi?', ru: 'Какая часть приложения определила, что вы не вошли?' },
  qtext: { uz: 'Kirmagan odam layk bosganini qaysi qism aniqladi', ru: 'Какая часть определила, что лайк нажал не вошедший' },
  list: [
    { t: { uz: 'Server — u kim bosganini tekshirdi', ru: 'Сервер — он проверил, кто нажал' } },
    { t: { uz: 'Sahifa — u tugmani qulflab qo\'ydi', ru: 'Страница — она заблокировала кнопку' }, why: { uz: 'Sahifa tugmani qulflamadi — siz uni bosdingiz. Bosishdan keyin kim tekshiradi?', ru: 'Страница не блокировала кнопку — вы же её нажали. Кто проверяет после нажатия?' } },
    { t: { uz: 'Baza — u laykni o\'chirib tashladi', ru: 'База — она стёрла ваш лайк' }, why: { uz: 'Baza laykni o\'chirmadi — u hali hech narsa yozib qo\'ymagan edi. Kim bosishi mumkinligini qaysi qism tekshiradi?', ru: 'База не стирала лайк — она ещё ничего не записала. Какая часть проверяет, кто может нажимать?' } },
    { t: { uz: 'Telefon — u layk bosishni to\'xtatdi', ru: 'Телефон — он остановил нажатие лайка' }, why: { uz: 'Telefon — qurilma, ilovaning qismi emas. Uch qismdan qaysi biri tekshiradi?', ru: 'Телефон — это устройство, а не часть приложения. Какая из трёх частей проверяет?' } },
  ],
  ok: { uz: 'To\'g\'ri — kim bosganini va bunga ruxsat bormi, server tekshiradi. Sahifa esa uning javobini ko\'rsatdi.', ru: 'Верно — кто нажал и есть ли у него на это право, проверяет сервер. А страница показала его ответ.' },
};
const ScreenTest4 = (props) => <TestScreen {...props} id="s11" n={4} {...T4} />;

// ===== 12-EKRAN — KASBIY SO'ZSIZ: tushunish chizig'i (BridgeBirinchiVersiya naqshi), bosilgan so'z tanish so'zga almashadi =====
// g — almashtiriladigan bo'lak; bosilgan kasbiy so'z topilgach shu bo'lakdagi so'zlarda chiziq ko'tariladi.
const LINE_WORDS = {
  uz: [{ w: 'Layk', v: 80 }, { w: 'bazaga', v: 22, bad: true, g: 'a' }, { w: 'yoziladi,', v: 40, g: 'a' }, { w: 'API', v: 10, bad: true, g: 'b' }, { w: 'orqali', v: 28, g: 'b' }, { w: 'sahifaga', v: 42, g: 'b' }, { w: 'qaytadi.', v: 48, g: 'b' }],
  ru: [{ w: 'Лайк', v: 80 }, { w: 'записывается', v: 60, g: 'a' }, { w: 'в базу,', v: 22, bad: true, g: 'a' }, { w: 'через', v: 30, g: 'b' }, { w: 'API', v: 10, bad: true, g: 'b' }, { w: 'возвращается', v: 40, g: 'b' }, { w: 'на страницу.', v: 48, g: 'b' }],
};
const LINE_SWAP = {
  a: { from: { uz: 'bazaga yoziladi', ru: 'записывается в базу' }, to: { uz: 'ilova eslab qoladi', ru: 'приложение запоминает' } },
  b: { from: { uz: 'API orqali sahifaga qaytadi', ru: 'через API возвращается на страницу' }, to: { uz: 'sahifa uni ilovadan so\'rab, qayta ko\'rsatadi', ru: 'страница запрашивает его у приложения и показывает снова' } },
};
const ScreenLine = ({ screen, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const words = __lang === 'ru' ? LINE_WORDS.ru : LINE_WORDS.uz;
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(() => (reducedMotion() ? words.length : 0));
  const [found, setFound] = useState(() => new Set()); // guruhlar: 'a' | 'b'
  const [miss, setMiss] = useState(null);
  const [tried, setTried] = useState(() => new Set()); // bosib ko'rilgan so'zlar — puls ulardan o'tmaydi
  useEffect(() => {
    if (shown >= words.length) return;
    const t = setTimeout(() => setShown(s => s + 1), shown === 0 ? 500 : 650);
    return () => clearTimeout(t);
  }, [shown, run]); // eslint-disable-line
  useEffect(() => { if (miss === null) return; const t = setTimeout(() => setMiss(null), 700); return () => clearTimeout(t); }, [miss]);
  const replay = () => { setShown(reducedMotion() ? words.length : 0); setRun(r => r + 1); };
  const tap = (i) => { if (i >= shown) return; setTried(p => { if (p.has(i)) return p; const n = new Set(p); n.add(i); return n; }); const w = words[i]; if (w.bad) setFound(p => { const n = new Set(p); n.add(w.g); return n; }); else setMiss(i); };
  const need = 2;
  const all = found.size >= need;
  const vOf = (w) => (w.g && found.has(w.g) ? 78 : w.v);
  const W = 600, H = 150, pad = 18;
  const xs = (i) => pad + ((W - pad * 2) * (i + 0.5)) / words.length;
  const ys = (v) => H - 12 - ((H - 30) * v) / 100;
  const pts = [[pad, ys(72)], ...words.slice(0, shown).map((w, i) => [xs(i), ys(vOf(w))])];
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  const area = `${path} L${last[0].toFixed(1)} ${H} L${pad} ${H} Z`;
  const tipV = shown > 0 ? vOf(words[shown - 1]) : 72;
  // Navbat-pulsi (F-0924-08, pilot B3 chiziq-ekrani): gap to'liq chiqqach HALI BOSILMAGAN so'zlar bo'ylab yuradi — bittadan.
  // Faqat kasbiy so'zlarni emas, hammasini aylanadi: javob oldindan aytilmaydi. Mentor rejimida ekran-ichi puls yo'q.
  const pendW = shown >= words.length && !all ? words.map((_, k) => k).filter(k => !tried.has(k) && !(words[k].g && found.has(words[k].g))) : [];
  const litW = useTurnWalk(pendW, !isMentor);
  return (
    <Stage eyebrow={tr({ uz: '4-qism · Kod bilmaydigan odamga', ru: 'Часть 4 · Человеку без кода' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all} label={all || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Chiziq tushgan so'zlarni bosing (${found.size}/${need})`, ru: `Нажмите слова, где линия падает (${found.size}/${need})` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kod bilmaydigan odamga layk haqida gapiryapsiz. Qaysi so'zda u sizni <span className="italic" style={{ color: T.accent }}>tushunmay qoladi</span>?</>, ru: <>Вы рассказываете о лайке человеку, который не знает кода. На каком слове он <span className="italic" style={{ color: T.accent }}>перестаёт понимать</span>?</> })}</h2></div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 — senariy chorlovi «Chiziq tushgan so'zlarni bosing» so'zma-so'z, oldiga NEGA).
            Ega sarlavhadagi «kod bilmaydigan odam» — «U qanchalik tushunyapti» chizig'idagi «U» shunga bog'lanadi (§205-31). B-18: ikkala so'z topilgach yashirinadi. */}
        {!all && <Mentor>{tr({ uz: <>Kod bilmaydigan odam bitta notanish so'zda gapning qolganini ham tushunmay qoladi — <b style={{ color: T.ink }}>chiziq tushgan so'zlarni</b> bosing.</>, ru: <>Человек без кода на одном незнакомом слове перестаёт понимать и всё остальное, — нажмите <b style={{ color: T.ink }}>слова, на которых линия падает</b>.</> })}</Mentor>}
        <Zoomable className="zul">
        <div className={`ul fade-up delay-1${all ? ' fin' : ''}`} key={run}>
          <button type="button" className="gv-replay" onClick={replay} aria-label={tr({ uz: 'Qayta ko\'rsatish', ru: 'Показать снова' })}>↻</button>
          <span className="ul-lbl">{tr({ uz: 'U qanchalik tushunyapti', ru: 'Насколько он понимает' })}</span>
          <div className="ul-chart" aria-hidden="true">
            <svg className="ul-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
              <defs><linearGradient id="ulFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={T.accent} stopOpacity="0.16" /><stop offset="1" stopColor={T.accent} stopOpacity="0" /></linearGradient></defs>
              <rect x={pad} y={ys(50)} width={W - pad * 2} height={H - ys(50)} className="ul-low" />
              <line x1={pad} x2={W - pad} y1={ys(50)} y2={ys(50)} className="ul-mid" />
              <path d={area} className="ul-area" fill="url(#ulFill)" />
              <path d={path} className="ul-path" />
            </svg>
            {pts.slice(1).map((p, i) => <span key={i} className={`ul-dot ${words[i].g && found.has(words[i].g) ? 'got' : ''}`} style={{ left: `${(p[0] / W) * 100}%`, top: `${(p[1] / H) * 100}%` }} />)}
            {shown > 0 && <span className={`ul-face ${tipV < 50 ? 'sad' : ''}`} key={`f${shown}-${found.size}`} style={{ left: `${(last[0] / W) * 100}%`, top: `${(last[1] / H) * 100}%` }}>🧑{tipV < 50 ? '❓' : ''}</span>}
          </div>
          <p className={`ul-sent${__lang === 'ru' ? ' ru' : ''}`} style={{ '--n': words.length, '--pad': `${(pad / W) * 100}%` }}>
            {words.map((w, i) => (
              <button key={i} type="button" disabled={i >= shown || (w.g && found.has(w.g))} onClick={() => tap(i)}
                className={`ul-w ${i < shown ? 'in' : ''} ${w.bad && found.has(w.g) ? 'got' : ''} ${miss === i ? 'miss' : ''}${turnCls(litW, i, pendW.length > 1)}`}>{w.w}{w.bad && found.has(w.g) && <b aria-hidden="true"> ✓</b>}</button>
            ))}
          </p>
          {found.size > 0 && (
            <div className="ln-swaps">
              {['a', 'b'].filter(g => found.has(g)).map(g => (
                <p key={g} className="ln-swap fade-step"><s>{tr(LINE_SWAP[g].from)}</s> <span aria-hidden="true">→</span> <b>{tr(LINE_SWAP[g].to)}</b></p>
              ))}
            </div>
          )}
        </div>
        </Zoomable>
        {all && <ScrollIn className="frame-success fade-step">
          <p className="ln-new">«{tr({ uz: 'Layk bosilganda ilova uni eslab qoladi, sahifa esa uni so\'rab, qayta ko\'rsatadi.', ru: 'Когда нажимают лайк, приложение его запоминает, а страница запрашивает его и показывает снова.' })}»</p>
          <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Faqat kod yozadiganlar tushunadigan bunday so'z <b>kasbiy so'z</b> deyiladi. «Server» va «baza» — siz o'rgangan qism nomlari, lekin kod bilmaydigan odam ularni bilmaydi. Unga qismning nomini emas, ishini tanish so'z bilan ayting: eslab qoladi, tekshiradi, ko'rsatadi.</>, ru: <>Такое слово, понятное только тем, кто пишет код, называется <b>профессиональным словом</b>. «Сервер» и «база» — названия частей, которые вы выучили, но человек без кода их не знает. Говорите ему не название части, а её работу знакомыми словами: запоминает, проверяет, показывает.</> })}</p>
        </ScrollIn>}
      </div>
    </Stage>
  );
};

// ===== O'Z G'OYANGIZ — umumiy: kartadagi g'oya (bridgeCard) yoki tayyor g'oya (READY_IDEAS, jurnal D-5) =====
// §202: bu darsda «maydon» — ilova yozib qo'yadigan narsa. Tayyor futbol g'oyasining «qiladi» matnidagi futbol maydoni
// o'quvchi ko'radigan joyda aniqlashtirilgan matn bilan beriladi (umumiy fayl bridgeCard.js o'zgarmaydi — §201 tartibi).
const FUT_QILADI = { uz: 'bo\'sh vaqtni ko\'rsatib, band qilib beradi', ru: 'показывает свободное время и бронирует его' };
const ideaOf = (card, pickedId) => {
  const c = card || {};
  const rid = pickedId || c.ideaId || null;
  const ready = rid ? READY_IDEAS.find(x => x.id === rid) : null;
  const own = !pickedId && (filled(c.kim) || filled(c.qiladi) || filled(c.bolak));
  if (!own && !ready) return null;
  const kim = own && filled(c.kim) ? clean(c.kim) : (ready ? tr(ready.kim) : '');
  let qiladi = own && filled(c.qiladi) ? clean(c.qiladi) : (ready ? tr(ready.qiladi) : '');
  const fut = READY_IDEAS.find(x => x.id === 'futbol');
  if (fut && (qiladi === fut.qiladi.uz || qiladi === fut.qiladi.ru)) qiladi = tr(FUT_QILADI);
  const bolak = own && filled(c.bolak) ? clean(c.bolak) : (ready ? tr(ready.bolak) : '');
  const s0 = own && Array.isArray(c.shartlar) ? c.shartlar[0] : null;
  const shart = s0 && (filled(s0.qiladi) || filled(s0.boladi)) ? { qiladi: clean(s0.qiladi), boladi: clean(s0.boladi) }
    : (ready ? { qiladi: tr(ready.shart.qiladi), boladi: tr(ready.shart.boladi) } : null);
  return { kim, qiladi, bolak, shart, ready };
};
// tool — sarlavha qatorining o'ng chetidagi tugma (13-ekran: «Tayyor g'oyadan tanlash» — alohida qator egallamaydi).
const IdeaBox = ({ idea, tool = null }) => (
  <div className="cq-card idea-box">
    <span className="ic-h">🗂 {tr({ uz: 'Tanlagan g\'oyangiz', ru: 'Выбранная идея' })}{idea.ready ? ` · ${tr(idea.ready.olam)}` : ''}{tool}</span>
    {filled(idea.kim) && <div className="cq-row on"><span className="cq-lbl">{tr({ uz: 'Kim uchun', ru: 'Для кого' })}</span><span className="cq-val">{capFirst(idea.kim)}</span></div>}
    {filled(idea.qiladi) && <div className="cq-row on"><span className="cq-lbl">{tr({ uz: 'Nima qiladi', ru: 'Что делает' })}</span><span className="cq-val">{capFirst(idea.qiladi)}</span></div>}
    {filled(idea.bolak) && <div className="cq-row on"><span className="cq-lbl">{tr({ uz: "Birinchi quriladigan bo'lak", ru: 'Часть, которую строят первой' })}</span><span className="cq-val">{capFirst(idea.bolak)}</span></div>}
  </div>
);
// wave — kartasiz o'quvchida navbat shu yerda (88-qonun 14a; B2/B5/B6 naqshi): to'rt g'oya birma-bir yonadi, bittasi emas.
const IdeaPicker = ({ pickedId, onPick, wave = false }) => (
  <div className="ideas fade-step">
    {READY_IDEAS.map((it, k) => (
      <button key={it.id} type="button" className={`idea ${pickedId === it.id ? 'on' : ''}${waveCls(wave && !pickedId, k, READY_IDEAS.length)}`} onClick={() => onPick(it.id)}>
        <b>{tr(it.olam)}</b><span>{tr(it.bolak)}</span>
      </button>
    ))}
  </div>
);
// Baho so'zi (13-ekran) va kasbiy so'z (15-ekran) — so'z boshidan (UZ: harf/apostrof chegarasi · RU: kirill chegarasi).
const UZ_B = "(?<![\\p{L}'\\u02BB\\u02BC])";
const RU_B = '(?<!\\p{Script=Cyrillic})';
const BAHO_WORDS = { uz: ['yaxshi', 'tez', 'qulay'], ru: ['хорош', 'быстр', 'удобн'] };
const BAHO_RE = new RegExp(`${UZ_B}(${BAHO_WORDS.uz.join('|')})`, 'iu');
const BAHO_RU_RE = new RegExp(`${RU_B}(${BAHO_WORDS.ru.join('|')})`, 'iu');
const hasBaho = (s) => BAHO_RE.test(s || '') || BAHO_RU_RE.test(s || '');
// Kasbiy so'zlar ro'yxati — senariy 15-ekrani: baza · API · server · JSON · fetch · kod.
const JARGON_WORDS = { uz: ['baza', 'api', 'server', 'json', 'fetch', 'kod'], ru: ['баз[аеуыоя]', 'сервер', 'код'] };
const JARGON_RE = new RegExp(`${UZ_B}(${JARGON_WORDS.uz.join('|')})`, 'iu');
const JARGON_RU_RE = new RegExp(`${RU_B}(${JARGON_WORDS.ru.join('|')})`, 'iu');
const hasJargon = (s) => JARGON_RE.test(s || '') || JARGON_RU_RE.test(s || '');
// Tekshiruvchi 25.09 (111-qonun · metodist 20:27 taklifi): gap o'quvchining o'z maydonida turibdi — ostida u qayta yozilmaydi,
// faqat topilgan kasbiy so'zlar belgilanadi (RU eng baland holatida 15-ekran 69px aylanardi).
const jargonTokens = (text) => (text || '').split(/\s+/).map(tok => tok.replace(/^[«"'(]+|[.,!?;:»"')]+$/g, '')).filter(tok => tok && hasJargon(tok));
const MarkJargon = ({ text }) => (
  <>{jargonTokens(text).map((tok, i) => <React.Fragment key={i}>{i > 0 && ' · '}<mark className="jg">{tok}</mark></React.Fragment>)}</>
);
const readMaydonlar = (card) => {
  const arr = card && Array.isArray(card.maydonlar) ? card.maydonlar : [];
  return [0, 1, 2].map(i => ({ nom: str(arr[i] && arr[i].nom), bolim: str(arr[i] && arr[i].bolim), ochiq: arr[i] && typeof arr[i].ochiq === 'boolean' ? arr[i].ochiq : null, sabab: str(arr[i] && arr[i].sabab) }));
};
// Namuna (futbol · «bo'sh vaqtni band qilish») — senariy 13/14/15-ekran.
const M_PH = [
  { nom: { uz: 'Qaysi kun va soat band qilindi', ru: 'Какой день и час забронировали' }, bolim: { uz: 'Bugungi jadval', ru: 'Расписание на сегодня' } },
  { nom: { uz: 'Kim band qildi', ru: 'Кто забронировал' }, bolim: { uz: 'Band qilganlarim', ru: 'Мои брони' } },
  { nom: { uz: 'Kim o\'ynashga yozildi', ru: 'Кто записался играть' }, bolim: { uz: 'Bugun kim o\'ynaydi', ru: 'Кто сегодня играет' } },
];
const N3 = ['①', '②', '③'];
// Namuna futbol g'oyasidan — boshqa g'oya tanlagan bola uni topshiriq deb o'qimasin («Masalan:», §203-12).
const PH_EX = { uz: 'Masalan: ', ru: 'Например: ' };
// F-0925-QA22: savol maydon ichida — «① Savol? (masalan: …)».
const PH_IN = { uz: 'masalan', ru: 'например' };
const NOM_Q = { uz: 'Ilova nimani yozib qo\'yadi?', ru: 'Что записывает приложение?' };
// Maydon ichidagi qisqa namuna (M_PH[i].nom ning qisqasi): 1280px da savol bilan birga sig'adi (UZ 355–370 / RU 392–399 ≤ 420px).
// F-0925-QA26: 2-savol ham maydon ichida (54-band aniqlashtirishi — qisqa savol har doim ichkarida); RU savoli sig'ish uchun qisqaroq.
const BOLIM_Q_IN = { uz: 'Qaysi bo\'lim ochiladi?', ru: 'Какой раздел откроется?' };
const BOLIM_PH_IN = [{ uz: 'Bugungi jadval', ru: 'Расписание' }, { uz: 'Band qilganlarim', ru: 'Мои брони' }, { uz: 'Bugun kim o\'ynaydi', ru: 'Кто играет' }];
const NOM_PH_IN = [{ uz: 'kun va soat', ru: 'день и час' }, { uz: 'kim band qildi', ru: 'кто занял' }, { uz: 'kim o\'ynaydi', ru: 'кто играет' }];

// 13-ekran holat-paneli (Dizayn 4-aylanish · ETALON 28 · 3-ekran imzosi): o'quvchi yozgan bo'lim o'sha zahoti «Ertangi ekran»da
// paydo bo'ladi. Rang semantikasi: maydon — ilova NIMANI yozadi (amber chip), bo'lim — odam ko'radigan NATIJA (yashil).
// Bo'limsiz maydon — kesik ramka va «?» (bo'lim topilmasa, maydon yozilmaydi — 3-ekran xulosasi). Faqat ko'rinish qatlami.
const FieldsPhone = ({ m, okI, cur = -1, canGo = () => false, onGo }) => {
  // F-0925-QA43: qatorlar maydonlar orasida o'tish tugmasi (joriysi binafsha halqada); ochilmagan maydon bosilmaydi
  const rowP = (i) => ({ type: 'button', disabled: !onGo || !canGo(i), onClick: () => onGo && onGo(i), 'aria-current': i === cur ? 'true' : undefined });
  const n = [0, 1, 2].filter(okI).length;
  return (
    <div className="mm-phone mf-phone fade-up delay-2">
      <i className="uz-notch" aria-hidden="true" />
      <span className="mm-ph-h">🌅 {tr({ uz: 'Ertangi ekran', ru: 'Завтрашний экран' })}<b className="mm-ph-n">{n}/3</b></span>
      {m.map((x, i) => {
        const hasB = filled(x.bolim);
        const hasN = filled(x.nom);
        if (!hasB) return (
          <button key={i} {...rowP(i)} className={`mf-slot fp-go${hasN ? ' q' : ''}${i === cur ? ' fp-cur' : ''}`}>
            <span className="mf-slot-n" aria-hidden="true">{N3[i]}</span>
            {hasN && <span className="mf-chip">{capFirst(clean(x.nom))}</span>}
            {hasN && <span className="mf-q" aria-hidden="true">?</span>}
          </button>
        );
        return (
          <button key={i} {...rowP(i)} className={`mm-sec mf-sec fp-go${okI(i) ? ' lit' : ''}${i === cur ? ' fp-cur' : ''}`}>
            <span className="mm-sec-t">{N3[i]} {capFirst(clean(x.bolim))}</span>
            {hasN && <span className="mf-chip">{capFirst(clean(x.nom))}</span>}
          </button>
        );
      })}
    </div>
  );
};

// ===== 13-EKRAN — UCH MAYDON (ustaxona): 3 karta × (maydon · bo'lim) =====
const ScreenFields = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useIsMentor();
  const [card] = useState(() => cardSafe());
  const [pickedId, setPickedId] = useState(null);
  const [ideasOpen, setIdeasOpen] = useState(false);
  const idea = ideaOf(card, pickedId);
  const needPick = !ideaOf(card, null);
  const [m, setM] = useState(() => readMaydonlar(card));
  const [touched, setTouched] = useState(() => new Set());
  const init = readMaydonlar(card);
  const [snap, setSnap] = useState(() => (init.every(x => filled(x.nom) && filled(x.bolim)) ? JSON.stringify(init.map(x => [x.nom, x.bolim])) : null));
  const signal = usePracticeSignal(screen, storedAnswer, onAnswer, live);
  const set = (i, k, val) => setM(p => p.map((x, j) => (j === i ? { ...x, [k]: val } : x)));
  const touch = (i) => setTouched(p => { if (p.has(i)) return p; const n = new Set(p); n.add(i); return n; });
  const bahoHint = (i) => filled(m[i].nom) && hasBaho(m[i].nom);
  const bolimHint = (i) => filled(m[i].nom) && !filled(m[i].bolim) && (touched.has(i) || m.slice(i + 1).some(x => filled(x.nom) || filled(x.bolim)));
  const okI = (i) => filled(m[i].nom) && filled(m[i].bolim) && !hasBaho(m[i].nom);
  const nOk = [0, 1, 2].filter(okI).length;
  const allOk = nOk === 3 && !!idea;
  const cur = JSON.stringify(m.map(x => [clean(x.nom), clean(x.bolim)]));
  const dirty = snap !== cur;
  const saved = !!snap && !dirty;
  const everSaved = !!snap || !!(storedAnswer && storedAnswer.solved);
  const save = () => {
    if (!allOk) return;
    const prev = readMaydonlar(cardSafe());
    const maydonlar = m.map((x, i) => ({ nom: clean(x.nom), bolim: clean(x.bolim), ochiq: clean(prev[i].nom) === clean(x.nom) ? prev[i].ochiq : null, sabab: clean(prev[i].nom) === clean(x.nom) ? prev[i].sabab : '' }));
    const patch = { maydonlar };
    if (pickedId) patch.ideaId = pickedId;
    cardWrite(patch);
    setSnap(cur);
    signal({ practice: 'fields', maydonlar });
  };
  const [focus, setFocus] = useState(false);
  // F-0925-B28: bir vaqtda BITTA maydon kartasi (uchtasi birdaniga ekranni to'ldirib, qo'rqitardi). Ikki savol yozilgach
  // «Keyingisi →» — karta surilib chiqadi, keyingisi kiradi; tepada ① ② ③ ko'rsatkich (tayyori ✓, bosib qaytish mumkin).
  const [ci, setCi] = useState(() => { const k = [0, 1, 2].findIndex(i => !(filled(init[i].nom) && filled(init[i].bolim))); return k < 0 ? 0 : k; });
  const [dir, setDir] = useState('fwd');
  const reach = (() => { const k = [0, 1, 2].findIndex(i => !okI(i)); return k < 0 ? 2 : k; })();
  const go = (i) => { if (i === ci || i < 0 || i > 2 || i > Math.max(reach, ci)) return; setDir(i > ci ? 'fwd' : 'back'); setCi(i); };
  const pend = [];
  { const x = m[ci]; if (!filled(x.nom)) pend.push(`n${ci}`); if (!filled(x.bolim)) pend.push(`b${ci}`); }
  const litF = useTurnWalk(needPick && !idea ? [] : pend, !focus && !isMentor);
  const nextTurn = useTurnHint(!!idea && okI(ci) && ci < 2 && !focus && !isMentor);
  const saveTurn = useTurnHint(allOk && dirty && ci === 2 && !isMentor);
  const ideaWave = useTurnHint(!idea && !isMentor); // kartasiz: birinchi halqa — tayyor g'oyalar
  const firstBad = [0, 1, 2].find(i => !okI(i));
  const navLabel = isMentor || (everSaved && !dirty) ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : !idea ? tr({ uz: '① Avval tayyor g\'oyani tanlang', ru: '① Сначала выберите готовую идею' })
    : okI(ci) && ci < 2 && !allOk ? tr({ uz: '«Keyingisi →»ni bosing', ru: 'Нажмите «Следующее →»' })
    : firstBad !== undefined ? (!filled(m[firstBad].nom)
      ? tr({ uz: `${N3[firstBad]} Ilova nimani yozib qo'yishini yozing`, ru: `${N3[firstBad]} Напишите, что записывает приложение` })
      : hasBaho(m[firstBad].nom) // ETALON 30: yozgan bolaga «yozing» emas — qolgan shartning o'zi (mentor-gapdagi ifoda)
      ? tr({ uz: `${N3[firstBad]} Baho so'zi o'rniga aniq narsani yozing`, ru: `${N3[firstBad]} Вместо оценки напишите конкретную вещь` })
      : tr({ uz: `${N3[firstBad]} Bu maydondan ochiladigan bo'limni yozing`, ru: `${N3[firstBad]} Напишите раздел, который открывается из этого поля` }))
    : tr({ uz: '✓ «Saqlash»ni bosing', ru: '✓ Нажмите «Сохранить»' });
  return (
    <Stage eyebrow={tr({ uz: 'O\'z g\'oyangiz · 1 ✍️', ru: 'Ваша идея · 1 ✍️' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Uch maydonni saqlaganlar', ru: '✍️ Кто сохранил три поля' })} /><MentorNote>{tr(MENTOR_WATCH)}</MentorNote><StudentPracticePulse live={live} screen={screen} /></div><NavNext optionalLive turnBusy={!saved && !isMentor} disabled={!(everSaved && !dirty) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tanlagan g'oyangizda ilova <span className="italic" style={{ color: T.accent }}>nimani yozib qo'yadi</span>?</>, ru: <>Что <span className="italic" style={{ color: T.accent }}>записывает приложение</span> в выбранной вами идее?</> })}</h2></div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 — NEGA bir xil, chorlov puls turgan halqani aytadi; B-13/B-18 naqshi):
            g'oya yo'q → tayyor g'oyalar · hech narsa yozilmagan → 1-savol · baho so'zi → almashtirish · bo'sh joy → bo'sh savollar · tayyor → «✓ Saqlash» · saqlangan → «Davom etish». */}
        <Mentor>{!idea
          ? tr({ uz: <>Ilova faqat bo'lim ochadigan narsani yozib qo'yadi — avval <b style={{ color: T.ink }}>to'rt tayyor g'oyadan</b> birini tanlang.</>, ru: <>Приложение записывает только то, что открывает раздел, — сначала выберите одну из <b style={{ color: T.ink }}>четырёх готовых идей</b>.</> })
          : everSaved && !dirty
          ? tr({ uz: <>Keyin uch maydoningizdan qaysi biri begonaga ko'rinishini hal qilasiz — <b style={{ color: T.ink }}>«Davom etish»</b>ni bosing.</>, ru: <>Дальше вы решите, какое из трёх полей увидит чужой, — нажмите <b style={{ color: T.ink }}>«Продолжить»</b>.</> })
          : okI(ci) && ci < 2 && !allOk
          ? tr({ uz: <>Ilova faqat bo'lim ochadigan narsani yozib qo'yadi — <b style={{ color: T.ink }}>«Keyingisi →»</b>ni bosing.</>, ru: <>Приложение записывает только то, что открывает раздел, — нажмите <b style={{ color: T.ink }}>«Следующее →»</b>.</> })
          : allOk
          ? tr({ uz: <>Ilova faqat bo'lim ochadigan narsani yozib qo'yadi — uchala maydon tayyor, <b style={{ color: T.ink }}>«✓ Saqlash»</b>ni bosing.</>, ru: <>Приложение записывает только то, что открывает раздел, — все три поля готовы, нажмите <b style={{ color: T.ink }}>«✓ Сохранить»</b>.</> })
          : [0, 1, 2].some(bahoHint)
          ? tr({ uz: <>Ilova faqat bo'lim ochadigan narsani yozib qo'yadi — baho so'zi o'rniga ilova yozib qo'yadigan <b style={{ color: T.ink }}>aniq narsani</b> yozing.</>, ru: <>Приложение записывает только то, что открывает раздел, — вместо слова-оценки напишите, <b style={{ color: T.ink }}>что именно</b> записывает приложение.</> })
          : m.every(x => !filled(x.nom) && !filled(x.bolim))
          ? tr({ uz: <>Ilova faqat bo'lim ochadigan narsani yozib qo'yadi — birinchi <b style={{ color: T.ink }}>«Ilova nimani yozib qo'yadi?»</b> savoliga javob yozing.</>, ru: <>Приложение записывает только то, что открывает раздел, — ответьте на первый вопрос <b style={{ color: T.ink }}>«Что записывает приложение?»</b>.</> })
          : tr({ uz: <>Ilova faqat bo'lim ochadigan narsani yozib qo'yadi — <b style={{ color: T.ink }}>bo'sh qolgan savollarga</b> javob yozing.</>, ru: <>Приложение записывает только то, что открывает раздел, — ответьте на <b style={{ color: T.ink }}>вопросы, которые остались пустыми</b>.</> })}</Mentor>
        <div className="split mf-split">
          <Col>
            {/* F-0925-QA43: «1-maydon / 2-maydon / 3-maydon» tugmalari olindi — o'ngdagi «Ertangi ekran» qatorlari shu ma'noni beradi va bosib o'tiladi */}
            {(() => { const i = ci; const x = m[ci]; return (
              <div key={ci} className={`mf-card mf-slide ${dir} ${okI(i) ? 'ok' : ''}`}>
                {/* F-0925-QA22: «Ilova nimani yozib qo'yadi?» yorlig'i maydon ichiga o'tdi — savol sarlavhada turibdi. «Bundan qaysi bo'lim ochiladi?» —
                    istisno: savol ekranning boshqa joyida yo'q, maydon to'lgach yo'qolib qolardi. */}
                <label className={`pw-f ${filled(x.nom) && !bahoHint(i) ? 'on' : ''}${turnCls(litF, `n${i}`, pend.length > 1)}`}>
                  <input value={x.nom} onChange={e => set(i, 'nom', e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={`${N3[i]} ${tr(NOM_Q)} (${tr(PH_IN)}: ${tr(NOM_PH_IN[i])})`} aria-label={tr(NOM_Q)} maxLength={80} disabled={!idea && !isMentor} />
                </label>
                {bahoHint(i) && <p className="sl-hint fade-step">💡 {tr({ uz: 'Bu baho so\'zi, ma\'lumot emas. Ilova nimani yozib qo\'yadi?', ru: 'Это слово-оценка, а не данные. Что записывает приложение?' })}</p>}
                <label className={`pw-f ${filled(x.bolim) ? 'on' : ''}${turnCls(litF, `b${i}`, pend.length > 1)}`}>
                  <input value={x.bolim} onChange={e => set(i, 'bolim', e.target.value)} onFocus={() => setFocus(true)} onBlur={() => { setFocus(false); touch(i); }} placeholder={`${tr(BOLIM_Q_IN)} (${tr(PH_IN)}: ${tr(BOLIM_PH_IN[i])})`} aria-label={tr({ uz: 'Bundan qaysi bo\'lim ochiladi?', ru: 'Какой раздел из этого открывается?' })} maxLength={80} disabled={!idea && !isMentor} />
                </label>
                {bolimHint(i) && <p className="sl-hint fade-step">💡 {tr({ uz: 'Bo\'lim topilmasa — bu maydonni hozircha yozib qo\'ymaymiz. Boshqa maydon oling yoki bo\'limni yozing.', ru: 'Если раздела нет — это поле пока не записываем. Возьмите другое поле или напишите раздел.' })}</p>}
                {ci < 2 && <button type="button" className={`mf-next${nextTurn ? ' turn-ring' : ''}`} disabled={!okI(i)} onClick={() => go(ci + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Следующее →' })}</button>}
              </div>
            ); })()}
          </Col>
          <Col>
            {/* Dizayn 4-aylanish: tanlash tugmasi g'oya kartasining sarlavhasida (alohida qator emas) — «Ertangi ekran» uchun joy */}
            {(() => {
              const pickBtn = needPick ? <button type="button" className="btn-soft idea-tool" onClick={() => setIdeasOpen(o => !o)} aria-expanded={ideasOpen || !idea}>💡 {tr({ uz: 'Tayyor g\'oyadan tanlash', ru: 'Выбрать готовую идею' })} {(ideasOpen || !idea) ? '▴' : '▾'}</button> : null;
              return (
                <>
                  {idea && <IdeaBox idea={idea} tool={pickBtn} />}
                  {needPick && (
                    <>
                      {!idea && <p className="lead-note">{tr({ uz: "Oldingi darslardagi g'oyangiz bu kompyuterda yo'q. Tayyor g'oyalardan birini tanlang.", ru: 'Идеи с прошлых уроков на этом компьютере нет. Выберите одну из готовых идей.' })}</p>}
                      {/* Tekshiruvchi 25.09: g'oya tanlanmaguncha ro'yxat baribir ochiq — «Tayyor g'oyadan tanlash» tugmasi bu holatda hech narsa qilmasdi. Tanlangach u IdeaBox sarlavhasida turadi. */}
                      {(ideasOpen || !idea) && <IdeaPicker pickedId={pickedId} wave={ideaWave} onPick={(id) => { setPickedId(id); setIdeasOpen(false); }} />}
                    </>
                  )}
                </>
              );
            })()}
            {idea && !ideasOpen && <FieldsPhone m={m} okI={okI} cur={ci} canGo={(k) => k <= Math.max(reach, ci)} onGo={go} />}
            <div className="mf-save">
              <button type="button" className={`pw-save${saveTurn ? ' turn-ring' : ''}`} disabled={!allOk || !dirty} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
              {/* Saqlangach ikkala shart-chipi ✓ — ularning o'rnini «saqlandi» chipi egallaydi (bir qatorda, ETALON 32 done-mini) */}
              {saved ? <span className="done-mini fade-step">✓ {tr({ uz: 'Uch maydon saqlandi', ru: 'Три поля сохранены' })}</span> : (
                null /* F-0925-QA44: «✓ 3 maydon · ✓ Har biriga bo'lim» belgilari olindi — holatni «Ertangi ekran»dagi N/3 va qatorlar ko'rsatadi */
              )}
            </div>
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== 14-EKRAN — OCHIQ YOKI YOPIQ (ustaxona): almashtirgich + bitta savol → sabab =====
const OY_Q = {
  closed: { uz: 'Begona ko\'rsa, egasiga qanday zarar yetishi mumkin?', ru: 'Какой вред может быть владельцу, если это увидит чужой?' },
  open: { uz: 'Bu ma\'lumotni boshqalarga ko\'rsatish nega kerak?', ru: 'Зачем показывать эти данные другим?' },
};
// Mentor-gap uchun tartib so'zi (14-ekran): «birinchi maydoningiz uchun…» · RU — kelishikda («для первого поля»).
const OY_ORD = { uz: ['birinchi', 'ikkinchi', 'uchinchi'], ru: ['первого', 'второго', 'третьего'] };
const ALL_CLOSED = { uz: 'Hamma maydon yopiq — boshqalar ilovada hech narsani ko\'rmaydi.', ru: 'Все поля закрыты — другие ничего не увидят в приложении.' };
// F-0925-QA45: sabab-savoli maydon ichida — qisqa savol + namuna (to'liq savol OY_Q — aria-label)
const OY_PH = {
  closed: { uz: 'Nega yopiq? (masalan: begona topib, bezovta qiladi)', ru: 'Почему закрыто? (например: чужой побеспокоит)' },
  open: { uz: 'Nega ochiq? (masalan: do\'stlar kim o\'ynashini ko\'rsin)', ru: 'Почему открыто? (например: друзья видят игроков)' },
};
// F-0925-B29: 14-ekranda tomon tanlovi — ikki katta tugma, har biri ostida bir qatorlik ma'no (ilgari kichik almashtirgich
// o'z ma'nosini aytmasdi). 16-ekrandagi ixcham ro'yxatda SideToggle qoladi.
const SIDE_SUB = { open: { uz: 'Ilovaga kirgan har kim ko\'radi', ru: 'Видит каждый, кто зашёл в приложение' }, closed: { uz: 'Faqat maydon egasi ko\'radi', ru: 'Видит только владелец поля' } };
const SideChoice = ({ value, onChange, lit }) => (
  <div className={`oy-big${lit ? ' turn-ring' : ''}`} role="group">
    {SIDES.map(sd => {
      const on = value === (sd.k === 'open');
      return <button key={sd.k} type="button" className={`oy-bb ${sd.k} ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => onChange(sd.k === 'open')}><b>{sd.ic} {tr(sd.t)}</b><span>{tr(SIDE_SUB[sd.k])}</span></button>;
    })}
  </div>
);
const SideToggle = ({ value, onChange, lit }) => (
  <div className={`oy-tg${lit ? ' turn-ring' : ''}`} role="group">
    {SIDES.map(s => {
      const on = value === (s.k === 'open');
      return <button key={s.k} type="button" className={`oy-b ${s.k} ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => onChange(s.k === 'open')}>{tr(s.t)}</button>;
    })}
  </div>
);
const fieldsWithFallback = (card) => {
  const m = readMaydonlar(card);
  const has = m.some(x => filled(x.nom));
  return { m: has ? m : M_PH.map(p => ({ nom: tr(p.nom), bolim: tr(p.bolim), ochiq: null, sabab: '' })), sample: !has };
};
const ScreenOpenClosed = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useIsMentor();
  const [start] = useState(() => fieldsWithFallback(cardSafe()));
  const [m, setM] = useState(start.m);
  const init = start.m;
  const [snap, setSnap] = useState(() => (!start.sample && init.every(x => x.ochiq !== null && filled(x.sabab, 3)) ? JSON.stringify(init.map(x => [x.ochiq, clean(x.sabab)])) : null));
  const signal = usePracticeSignal(screen, storedAnswer, onAnswer, live);
  const set = (i, k, val) => setM(p => p.map((x, j) => (j === i ? { ...x, [k]: val } : x)));
  const okI = (i) => m[i].ochiq !== null && filled(m[i].sabab, 3);
  const allOk = [0, 1, 2].every(okI);
  const allClosed = m.every(x => x.ochiq === false);
  const cur = JSON.stringify(m.map(x => [x.ochiq, clean(x.sabab)]));
  const dirty = snap !== cur;
  const saved = !!snap && !dirty;
  const everSaved = !!snap || !!(storedAnswer && storedAnswer.solved);
  const save = () => {
    if (!allOk) return;
    const maydonlar = m.map(x => ({ nom: clean(x.nom), bolim: clean(x.bolim), ochiq: x.ochiq, sabab: clean(x.sabab) }));
    cardWrite({ maydonlar });
    setSnap(cur);
    signal({ practice: 'open-closed', maydonlar });
  };
  const [focus, setFocus] = useState(false);
  // F-0925-B29: bir vaqtda bitta maydon (13-ekrandagi naqsh): tomon → bitta savol → «Keyingisi →».
  const [ci, setCi] = useState(() => { const k = [0, 1, 2].findIndex(i => !(init[i].ochiq !== null && filled(init[i].sabab, 3))); return k < 0 ? 0 : k; });
  const [dir, setDir] = useState('fwd');
  const reach = (() => { const k = [0, 1, 2].findIndex(i => !okI(i)); return k < 0 ? 2 : k; })();
  const go = (i) => { if (i === ci || i < 0 || i > 2 || i > Math.max(reach, ci)) return; setDir(i > ci ? 'fwd' : 'back'); setCi(i); };
  const pend = [];
  { const x = m[ci]; if (x.ochiq === null) pend.push(`t${ci}`); else if (!filled(x.sabab, 3)) pend.push(`s${ci}`); }
  const litF = useTurnWalk(pend, !focus && !isMentor);
  const nextTurn = useTurnHint(okI(ci) && ci < 2 && !focus && !isMentor);
  const saveTurn = useTurnHint(allOk && dirty && ci === 2 && !isMentor);
  const firstBad = [0, 1, 2].find(i => !okI(i));
  const navLabel = isMentor || (everSaved && !dirty) ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : okI(ci) && ci < 2 && firstBad !== undefined ? tr({ uz: '«Keyingisi →»ni bosing', ru: 'Нажмите «Следующее →»' })
    : firstBad !== undefined ? (m[firstBad].ochiq === null
      ? tr({ uz: `${N3[firstBad]} Ochiq yoki yopiq — tanlang`, ru: `${N3[firstBad]} Открыто или закрыто — выберите` })
      : tr({ uz: `${N3[firstBad]} Savolga javob yozing`, ru: `${N3[firstBad]} Ответьте на вопрос` }))
    : tr({ uz: '✓ «Saqlash»ni bosing', ru: '✓ Нажмите «Сохранить»' });
  return (
    <Stage eyebrow={tr({ uz: 'O\'z g\'oyangiz · 2 ✍️', ru: 'Ваша идея · 2 ✍️' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Sxemasini saqlaganlar', ru: '✍️ Кто сохранил схему' })} /><MentorNote>{tr(MENTOR_WATCH)}</MentorNote><StudentPracticePulse live={live} screen={screen} /></div><NavNext optionalLive turnBusy={!saved && !isMentor} disabled={!(everSaved && !dirty) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Uch maydoningizdan qaysi biri <span className="italic" style={{ color: T.accent }}>begonaga ko'rinmasin</span>?</>, ru: <>Какое из трёх ваших полей <span className="italic" style={{ color: T.accent }}>не должен видеть чужой</span>?</> })}</h2></div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 — NEGA bir xil, chorlov NavNext bilan bir halqa: birinchi chala maydon).
            Tomon tanlanmagan → almashtirgich · savol javobsiz → o'sha savol · tayyor → «✓ Saqlash» · saqlangan → «Davom etish» (15-ekranga ko'prik). */}
        <Mentor>{everSaved && !dirty
          ? tr({ uz: <>Keyin tugma bosilganda ilova ichida nima bo'lishini yozasiz — <b style={{ color: T.ink }}>«Davom etish»</b>ni bosing.</>, ru: <>Дальше вы напишете, что происходит внутри приложения, когда нажимают кнопку, — нажмите <b style={{ color: T.ink }}>«Продолжить»</b>.</> })
          : okI(ci) && ci < 2 && firstBad !== undefined
          ? tr({ uz: <>Ochiq qoldirilgan maydonni ilovaga kirgan har kim ko'radi — <b style={{ color: T.ink }}>«Keyingisi →»</b>ni bosing.</>, ru: <>Открытое поле видит каждый, кто зашёл в приложение, — нажмите <b style={{ color: T.ink }}>«Следующее →»</b>.</> })
          : firstBad === undefined
          ? tr({ uz: <>Ochiq qoldirilgan maydonni ilovaga kirgan har kim ko'radi — uchala maydon tayyor, <b style={{ color: T.ink }}>«✓ Saqlash»</b>ni bosing.</>, ru: <>Открытое поле видит каждый, кто зашёл в приложение, — все три поля готовы, нажмите <b style={{ color: T.ink }}>«✓ Сохранить»</b>.</> })
          : m[firstBad].ochiq === null
          ? tr({ uz: <>Ochiq qoldirilgan maydonni ilovaga kirgan har kim ko'radi — {OY_ORD.uz[firstBad]} maydoningiz uchun <b style={{ color: T.ink }}>«Hammaga ochiq»</b> yoki <b style={{ color: T.ink }}>«Faqat egasiga»</b>ni tanlang.</>, ru: <>Открытое поле видит каждый, кто зашёл в приложение, — для {OY_ORD.ru[firstBad]} поля выберите <b style={{ color: T.ink }}>«Открыто всем»</b> или <b style={{ color: T.ink }}>«Только владельцу»</b>.</> })
          : tr({ uz: <>Ochiq qoldirilgan maydonni ilovaga kirgan har kim ko'radi — {OY_ORD.uz[firstBad]} maydoningiz uchun <b style={{ color: T.ink }}>«{m[firstBad].ochiq ? 'Nega ochiq?' : 'Nega yopiq?'}»</b> savoliga javob yozing.</>, ru: <>Открытое поле видит каждый, кто зашёл в приложение, — для {OY_ORD.ru[firstBad]} поля ответьте на вопрос <b style={{ color: T.ink }}>«{m[firstBad].ochiq ? 'Почему открыто?' : 'Почему закрыто?'}»</b>.</> })}</Mentor>
        <div className="split oc-split">
          <Col>
            {/* F-0925-QA45: maydon-tugmalari olindi — o'tish o'ngdagi «Sxemangiz» qatorlari orqali (13-ekran naqshi) */}
            {(() => { const i = ci; const x = m[ci]; return (
              <div key={ci} className={`mf-card mf-slide ${dir} ${okI(i) ? 'ok' : ''}`}>
                <span className="oy-name">{okI(i) ? '✓' : N3[i]} {capFirst(clean(x.nom)) || '…'}</span>
                <SideChoice value={x.ochiq} onChange={(v) => set(i, 'ochiq', v)} lit={litF === `t${i}`} />
                {x.ochiq !== null && (
                  <div className="fade-step" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label className={`pw-f ${filled(x.sabab, 3) ? 'on' : ''}${turnCls(litF, `s${i}`, pend.length > 1)}`}>
                      <input placeholder={tr(x.ochiq ? OY_PH.open : OY_PH.closed)} aria-label={tr(x.ochiq ? OY_Q.open : OY_Q.closed)} value={x.sabab} onChange={e => set(i, 'sabab', e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} maxLength={140} />
                    </label>
                  </div>
                )}
                {ci < 2 && <button type="button" className={`mf-next${nextTurn ? ' turn-ring' : ''}`} disabled={!okI(i)} onClick={() => go(ci + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Следующее →' })}</button>}
              </div>
            ); })()}
            {allClosed && <div className="ws-note fade-step">{tr(ALL_CLOSED)}</div>}
          </Col>
          <Col>
            {/* F-0925-QA45: «Namuna · Futbol» kartasi (javob bermasdi) o'rniga o'quvchining o'z qarorlari — bosib o'tiladi */}
            <div className="cq-card oc-sch">
              <span className="ic-h">🗂 {tr({ uz: 'Sxemangiz', ru: 'Ваша схема' })}<b className="mm-ph-n">{[0, 1, 2].filter(okI).length}/3</b></span>
              {m.map((x, k) => (
                <button key={k} type="button" className={`oc-row fp-go${okI(k) ? ' ok' : ''}${k === ci ? ' fp-cur' : ''}`} disabled={k > Math.max(reach, ci)} onClick={() => go(k)} aria-current={k === ci ? 'true' : undefined}>
                  <span className="oc-n">{N3[k]} {capFirst(clean(x.nom)) || '…'}</span>
                  {x.ochiq !== null && <span className={`oc-tag${x.ochiq ? '' : ' shut'}`}>{tr(x.ochiq ? { uz: 'ochiq', ru: 'открыто' } : { uz: 'yopiq', ru: 'закрыто' })}</span>}
                </button>
              ))}
            </div>
            <div className="mf-save">
              <button type="button" className={`pw-save${saveTurn ? ' turn-ring' : ''}`} disabled={!allOk || !dirty} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
              {saved && <span className="done-mini fade-step">✓ {tr({ uz: 'Saqlandi', ru: 'Сохранено' })}</span>}
            </div>
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== 15-EKRAN — UCH QAVAT GAPI (ustaxona): shart yonda, uch savol-yorliq, kasbiy so'z / bir xil gap tekshiruvi =====
const QV_F = [
  { k: 0, qs: { uz: "Ko'rsatadigan qism: ekranda nima ko'rinadi?", ru: 'Показывающая часть: что видно на экране?' }, ex: { uz: "katak yashil bo'lib, «Band qilindi» chiqadi", ru: 'клетка зеленеет, появляется «Забронировано»' }, lbl: { uz: 'Ko\'rsatadigan qism: odam ekranda nimani ko\'radi?', ru: 'Показывающая часть: что человек видит на экране?' }, ph: { uz: 'Bo\'sh vaqt bosilganda katak yashil bo\'lib, «Band qilindi» yozuvi chiqadi', ru: 'Когда нажимают свободное время, клетка становится зелёной и появляется надпись «Забронировано»' } },
  { k: 1, qs: { uz: 'Tekshiradigan qism: ilova nimani tekshiradi?', ru: 'Проверяющая часть: что проверяет приложение?' }, ex: { uz: "shu vaqt hali bo'shmi", ru: 'свободно ли ещё это время' }, lbl: { uz: 'Tekshiradigan qism: ilova nimani tekshiradi?', ru: 'Проверяющая часть: что проверяет приложение?' }, ph: { uz: 'Shu vaqtni boshqa birov oldin band qilmaganini tekshiradi', ru: 'Проверяет, что это время никто не забронировал раньше' } },
  { k: 2, qs: { uz: 'Eslab qoladigan qism: ilova nimani eslab qoladi?', ru: 'Запоминающая часть: что запоминает приложение?' }, ex: { uz: 'kim, qaysi kun va soatda band qilgani', ru: 'кто, в какой день и час забронировал' }, lbl: { uz: 'Eslab qoladigan qism: ilova nimani eslab qoladi?', ru: 'Запоминающая часть: что запоминает приложение?' }, ph: { uz: 'Kim, qaysi kun va soatda band qilganini eslab qoladi — ertaga ham turadi', ru: 'Запоминает, кто, в какой день и час забронировал, — это останется и завтра' } },
];
const normGap = (s) => clean(s).toLowerCase().replace(/[.,!?;:«»"'()\-—\s]+/g, ' ').trim();
// 15-ekran holat-paneli (Dizayn 4-aylanish · ETALON 28 · 12-ekran imzosi «tushunish chizig'i»): har qavat gapi kod bilmaydigan
// tinglovchiga qanchalik tushunarli. st: 'empty' (hali yozilmagan) · 'ok' (tanish so'z — baland yashil) · 'bad' (kasbiy so'z yoki
// takror gap — past amber, 😕). Yorliq 12-ekrandagi bilan bir xil; qavat nomi emas, faqat belgisi (📱 🛡️ 🗄️) — kasbiy so'z yo'q.
const ListenerMeter = ({ st }) => {
  const n = st.filter(s => s === 'ok').length;
  return (
    <div className="lm fade-up delay-2">
      <span className="lm-h"><span className="ul-lbl">{tr({ uz: 'U qanchalik tushunyapti', ru: 'Насколько он понимает' })}</span><b className="mm-ph-n">{n}/3</b></span>
      <div className="lm-cols" aria-hidden="true">
        {st.map((s, i) => (
          <div key={i} className={`lm-col ${s}`}>
            <span className="lm-track"><i className="lm-fill" /><span className="lm-face">{s === 'ok' ? '🙂' : s === 'bad' ? '😕' : ''}</span></span>
            <span className="lm-ic">{N3[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
const ScreenFloorGaps = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useIsMentor();
  const [card] = useState(() => cardSafe());
  const idea = ideaOf(card, null);
  const shart = idea && idea.shart ? idea.shart : null;
  const init = [0, 1, 2].map(i => str(Array.isArray(card.qavatlar) ? card.qavatlar[i] : ''));
  const [g, setG] = useState(init);
  const [snap, setSnap] = useState(() => (init.every(x => filled(x, 6)) ? JSON.stringify(init.map(clean)) : null));
  const signal = usePracticeSignal(screen, storedAnswer, onAnswer, live);
  const set = (i, val) => setG(p => p.map((x, j) => (j === i ? val : x)));
  const dupOf = (i) => filled(g[i], 6) && g.some((y, j) => j !== i && filled(y, 6) && normGap(y) === normGap(g[i]));
  const okI = (i) => filled(g[i], 6) && !hasJargon(g[i]) && !dupOf(i);
  const allOk = [0, 1, 2].every(okI);
  const anyDup = [0, 1, 2].some(dupOf);
  const cur = JSON.stringify(g.map(clean));
  const dirty = snap !== cur;
  const saved = !!snap && !dirty;
  const everSaved = !!snap || !!(storedAnswer && storedAnswer.solved);
  const save = () => { if (!allOk) return; const qavatlar = g.map(clean); cardWrite({ qavatlar }); setSnap(cur); signal({ practice: 'floors', qavatlar }); };
  const [focus, setFocus] = useState(false);
  const pend = [0, 1, 2].filter(i => !filled(g[i], 6)).map(String);
  const litF = useTurnWalk(pend, !focus && !isMentor);
  const saveTurn = useTurnHint(allOk && dirty && !isMentor);
  const firstBad = [0, 1, 2].find(i => !okI(i));
  const navLabel = isMentor || (everSaved && !dirty) ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : firstBad !== undefined ? (hasJargon(g[firstBad])
      ? tr({ uz: `${N3[firstBad]} Kasbiy so'zni tanish so'z bilan almashtiring`, ru: `${N3[firstBad]} Замените профессиональное слово знакомым` })
      : dupOf(firstBad) ? tr({ uz: `${N3[firstBad]} Bu qismning o'z ishini yozing`, ru: `${N3[firstBad]} Напишите собственную работу этой части` })
        : tr({ uz: `${N3[firstBad]} Bitta gap yozing`, ru: `${N3[firstBad]} Напишите одну фразу` }))
    : tr({ uz: '✓ «Saqlash»ni bosing', ru: '✓ Нажмите «Сохранить»' });
  return (
    <Stage eyebrow={tr({ uz: 'O\'z g\'oyangiz · 3 ✍️', ru: 'Ваша идея · 3 ✍️' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Uch gapni saqlaganlar', ru: '✍️ Кто сохранил три фразы' })} /><MentorNote>{tr(MENTOR_WATCH)}</MentorNote><StudentPracticePulse live={live} screen={screen} /></div><NavNext optionalLive turnBusy={!saved && !isMentor} disabled={!(everSaved && !dirty) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Birinchi bo'lagingizda tugma bosilsa, ilova ichida <span className="italic" style={{ color: T.accent }}>nima bo'ladi</span>?</>, ru: <>Что <span className="italic" style={{ color: T.accent }}>происходит</span> внутри приложения, когда в вашей первой части нажимают кнопку?</> })}</h2></div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 — NEGA bir xil, bitta chorlov NavNext bilan bir halqa; yozish-ekranida 1 gap, ETALON 32).
            NEGA «kod bilmaydigan odam»ni nomlaydi — «U qanchalik tushunyapti» panelidagi «U» shunga bog'lanadi (§205-31).
            Bo'sh savol → o'sha savol (yorliqning «:» gacha qismi) · kasbiy so'z → almashtirish · takror gap → o'z ishi · tayyor → «✓ Saqlash» · saqlangan → «Davom etish». */}
        <Mentor>{everSaved && !dirty
          ? tr({ uz: <>Keyin AI ochiq maydonlaringiz haqida savol beradi — <b style={{ color: T.ink }}>«Davom etish»</b>ni bosing.</>, ru: <>Дальше AI задаст вопросы о ваших открытых полях, — нажмите <b style={{ color: T.ink }}>«Продолжить»</b>.</> })
          : firstBad === undefined
          ? tr({ uz: <>Tanish so'z bilan yozilgan gapni kod bilmaydigan odam ham tushunadi — <b style={{ color: T.ink }}>«✓ Saqlash»</b>ni bosing.</>, ru: <>Фразу из знакомых слов поймёт и человек без кода, — нажмите <b style={{ color: T.ink }}>«✓ Сохранить»</b>.</> })
          : hasJargon(g[firstBad])
          ? tr({ uz: <>Tanish so'z bilan yozilgan gapni kod bilmaydigan odam ham tushunadi — <b style={{ color: T.ink }}>belgilangan kasbiy so'zni</b> almashtiring.</>, ru: <>Фразу из знакомых слов поймёт и человек без кода, — замените <b style={{ color: T.ink }}>отмеченное профессиональное слово</b>.</> })
          : dupOf(firstBad)
          ? tr({ uz: <>Tanish so'z bilan yozilgan gapni kod bilmaydigan odam ham tushunadi — takror gap o'rniga <b style={{ color: T.ink }}>shu qismning o'z ishini</b> yozing.</>, ru: <>Фразу из знакомых слов поймёт и человек без кода, — вместо повтора напишите <b style={{ color: T.ink }}>работу этой части</b>.</> })
          : tr({ uz: <>Tanish so'z bilan yozilgan gapni kod bilmaydigan odam ham tushunadi — <b style={{ color: T.ink }}>«{tr(QV_F[firstBad].lbl).split(':')[0]}»</b> savoliga javob yozing.</>, ru: <>Фразу из знакомых слов поймёт и человек без кода, — ответьте на вопрос <b style={{ color: T.ink }}>«{tr(QV_F[firstBad].lbl).split(':')[0]}»</b>.</> })}</Mentor>
        <div className="split qg-split">
          <Col>
            {/* Dizayn 4-aylanish (10-ekran imzosi): uch savol — binoning uch qavati (tom · qavatlar · yer); qavat gapi tayyor bo'lsa yashil,
                kasbiy so'z yoki takror gap bo'lsa amber «?» — tinglovchi shu qavatda to'xtaydi */}
            <div className="qv-bld">
            {QV_F.map((f, i) => (
              <div key={i} className={`cq-step qv-step ${okI(i) ? 'ok' : ''}${hasJargon(g[i]) || dupOf(i) ? ' jg' : ''}`}>
                {/* F-0925-QA46: qavat-belgisi (📱🛡️🗄️) va savol-yorlig'i olindi — qism nomi va savol maydon ichida (placeholder, 2 qator) */}
                {/* Dizayn 25.09 (tekshiruvchi: namuna kesilardi): bir qatorli maydon 376px, namuna esa 460–820px edi — endi ko'p qatorli
                    maydon (B6/B3 naqshi), namuna to'liq o'raladi; qiymat, cheklov va hodisalar o'zgarmagan.
                    Dizayn R2: imlo-tekshiruv o'chiq (PmMetricsLesson naqshi) — Firefox textarea'da uni o'zi yoqadi va o'zbekcha so'zlar ostida
                    qizil to'lqin chiqardi; qizil bu darsda faqat haqiqiy xato, kasbiy so'z belgisi esa amber. */}
                <label className={`pw-f ${okI(i) ? 'on' : ''} ${hasJargon(g[i]) ? 'jg-on' : ''}${turnCls(litF, String(i), pend.length > 1)}`}>
                  <textarea rows={2} className="qv-ta" spellCheck={false} value={g[i]} onChange={e => set(i, e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={`${N3[i]} ${tr(f.qs)}\n${tr(PH_IN)}: ${tr(f.ex)}`} aria-label={tr(f.lbl)} maxLength={160} />
                </label>
                {hasJargon(g[i]) && <p className="sl-hint bad fade-step"><span className="jg-line"><MarkJargon text={g[i]} /></span> {tr({ uz: 'Bu kasbiy so\'z. Qismning ishini tanish so\'z bilan ayting.', ru: 'Профессиональное слово: скажите, что делает эта часть.' })}</p>}
              </div>
            ))}
            </div>
            {anyDup && <p className="sl-hint fade-step">💡 {tr({ uz: 'Bu ikki gap bitta ishni aytyapti. Har qismning o\'z ishi bor.', ru: 'Эти две фразы говорят об одной работе. У каждой части своя работа.' })}</p>}
            <div className="mf-save">
              <button type="button" className={`pw-save${saveTurn ? ' turn-ring' : ''}`} disabled={!allOk || !dirty} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
              {saved && <span className="done-mini fade-step">✓ {tr({ uz: 'Uch gap tayyor', ru: 'Три фразы готовы' })}</span>}
            </div>
          </Col>
          <Col>
            <div className="cq-card">
              <span className="ic-h">{shart ? tr({ uz: "Bo'lak tayyorligini tekshiradigan 1-shart", ru: 'Первое условие, которым проверяют готовность части' }) : tr({ uz: 'Namuna · Futbol', ru: 'Пример · Футбол' })}</span>
              {filled(idea && idea.bolak) && <div className="cq-row"><span className="cq-lbl">{tr({ uz: "Birinchi quriladigan bo'lak", ru: 'Часть, которую строят первой' })}</span><span className="cq-val">{capFirst(idea.bolak)}</span></div>}
              <div className="cq-row on"><span className="cq-lbl">{tr({ uz: 'Foydalanuvchi nima qiladi?', ru: 'Что делает пользователь?' })}</span><span className="cq-val">{shart ? capFirst(shart.qiladi) : tr(READY_IDEAS[0].shart.qiladi)}</span></div>
              <div className="cq-row on"><span className="cq-lbl">{tr({ uz: 'Shundan keyin nima bo\'ladi?', ru: 'Что происходит после этого?' })}</span><span className="cq-val">{shart ? capFirst(shart.boladi) : capFirst(tr(READY_IDEAS[0].shart.boladi))}</span></div>
            </div>
            <ListenerMeter st={[0, 1, 2].map(i => (!filled(g[i], 6) && !hasJargon(g[i]) ? 'empty' : okI(i) ? 'ok' : 'bad'))} />
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== 16-EKRAN — AI — MAXFIYLIK SAVOLLARINI BERUVCHI (maqsad-gap · so'rov DOIM ochiq, AiStep · 🛟 zaxirada ikki tayyor savol) =====
const copyText = async (txt) => {
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(txt); return true; } } catch { /* pastdagi yo'l */ }
  try { const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); document.body.removeChild(ta); return ok; } catch { return false; }
};
const AI_QS = [
  { uz: 'Begona buni bilsa, undan qanday foydalanishi mumkin?', ru: 'Как чужой может этим воспользоваться, если узнает?' },
  { uz: 'Buni ochiq qoldirish kimga, nima uchun kerak?', ru: 'Кому и зачем нужно оставлять это открытым?' },
];
// ===== AI QADAMI (F-0924-01/02) — so'rov DOIM ochiq · «Gemini'ni ochish» (so'rovni o'zi nusxalaydi) → javobni yozish (F-0925-QA35).
// Manba: DeployLesson Screen4 (.pr-panel) + FallbackPanel (.dsx-fb, 155-qonun 2-band); F-0925-QA35 dan qadam-raqamlari yo'q.
// «✓ Nusxalandi» QAYTIB O'CHMAYDI. Navbat-pulsi ① → ② bo'ylab yuradi (88-qonun); ③ ning pulsi — o'ngdagi «Sxemangiz»
// kartasining o'zida (onReady Gemini ochilganini xabar qiladi). So'rov-qutisi 400 belgi hisobiga kirmaydi (F-0924-01).
// 🛟 zaxira ochilganda ham so'rov, Gemini tugmasi va javob-qatori ko'rinib turadi (F-0924-01 «so'rov doim ochiq»; B3 tekshiruvchi qarori 24.09).
// Zaxira ochiq bo'lsa faqat Gemini pulsi o'chadi, navbat «Sxemangiz» ga o'tadi — bir lahzada bitta halqa. onFallback holatni xabar qiladi.
// F-0925-QA35 (3-o'tish 3-darsi pilotidan): ① «Nusxalash» qadami → so'rov qutisi burchagidagi 📋 belgisi;
// «Gemini'ni ochish» bosilganda so'rov o'zi nusxalanadi (bitta harakat), qadam raqamlari va «qo'ying» yozuvi yo'q. Yo'riq mentor-gapda.
const AiStep = ({ prompt, answerLabel, answered, fallbackTitle, fallback, onReady, onFallback, pulse = true }) => {
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);
  // 🛟 zaxira ochiqmi — details elementining o'z holati (onToggle). ready ga qo'shilmaydi.
  const [fbOpen, setFbOpen] = useState(false);
  // Zaxira ochiq — navbat o'ngdagi «Sxemangiz» da (ScreenAI), shu yerdagi puls o'chadi: ekranda ikki puls bir vaqtda chiqmaydi.
  const lit = useTurnWalk(opened ? [] : ['open'], pulse && !answered && !fbOpen);
  useEffect(() => { if (onReady) onReady(opened); }, [opened]); // eslint-disable-line
  useEffect(() => { if (onFallback) onFallback(fbOpen); }, [fbOpen]); // eslint-disable-line
  const doCopy = async () => { const ok = await copyText(prompt); if (ok) setCopied(true); };
  const cpLbl = tr(copied ? { uz: 'Nusxalandi', ru: 'Скопировано' } : { uz: "So'rovni nusxalash", ru: 'Скопировать запрос' });
  return (
    <div className="ais fade-up delay-1">
      <div className="pr-panel">
        <div className="pr-head">
          <span className="pr-lbl">📝 {tr({ uz: "AI uchun so'rov", ru: 'Запрос для AI' })}</span>
          <button type="button" className={`pr-ic${copied ? ' ok' : ''}`} onClick={doCopy} aria-label={cpLbl} title={cpLbl}>{copied ? '✓' : '📋'}</button>
        </div>
        <pre className="pr-body">{prompt}</pre>
      </div>
      <a className={`ais-link ais-go${opened ? ' on' : ''}${turnCls(lit, 'open', false)}`} href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" onClick={() => { doCopy(); setOpened(true); }}>
        {opened ? '✓ ' : ''}{tr({ uz: "Gemini'ni ochish ↗", ru: 'Открыть Gemini ↗' })}
      </a>
      {answerLabel && <p className="ais-t">{answerLabel}</p>}
      <details className="dsx-fb" onToggle={(e) => setFbOpen(e.currentTarget.open)}>
        <summary>🛟 {fallbackTitle || tr({ uz: 'Gemini ochilmadimi?', ru: 'Gemini не открылся?' })}</summary>
        <div className="dsx-fb-body">{fallback}</div>
      </details>
    </div>
  );
};
const ScreenAI = ({ screen, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [card] = useState(() => cardSafe());
  const idea = ideaOf(card, null);
  const [start] = useState(() => fieldsWithFallback(card));
  const [m, setM] = useState(start.m);
  const [snap, setSnap] = useState(() => JSON.stringify(start.m.map(x => [x.ochiq, clean(x.sabab)])));
  const [put, setPut] = useState(false);
  const [ready, setReady] = useState(false); // Gemini ochildi → navbat «Sxemangiz» kartasiga o'tadi
  const [fb, setFb] = useState(false); // 🛟 zaxira ochiq — tayyor savollar bor, Gemini ochilmagan bo'lsa ham navbat «Sxemangiz» ga o'tadi
  // ready — Gemini ochilgani; «Sxemangiz» ga o'tish sharti — ready YOKI ochiq zaxira. Puls va mentor-chorlov shu bitta shartdan (B-18).
  const atThree = ready || fb;
  const [focus, setFocus] = useState(false);
  const oy = (v) => (v === false ? tr({ uz: 'yopiq', ru: 'закрыто' }) : tr({ uz: 'ochiq', ru: 'открыто' }));
  const ideaGap = idea ? (filled(idea.qiladi) ? `${capFirst(idea.qiladi)}${filled(idea.kim) ? ` (${tr({ uz: 'kim uchun', ru: 'для кого' })}: ${idea.kim})` : ''}` : capFirst(idea.bolak)) : '—';
  const list = m.map((x, i) => `${i + 1}) ${clean(x.nom) || '—'} — ${oy(x.ochiq)}`).join(' ');
  const prompt = tr({
    uz: `Ilovam: ${ideaGap}. Maydonlari: ${list}. Har ochiq maydon uchun menga bitta savol bering: begona bu ma'lumotni bilsa, undan qanday foydalanishi mumkin? Yoki uni ochiq qoldirish nima uchun kerak? Maydonni yopish yoki ochiq qoldirishni aytmang — qarorni o'zim qilaman.`,
    ru: `Моё приложение: ${ideaGap}. Его поля: ${list}. Для каждого открытого поля задайте мне один вопрос: как чужой может воспользоваться этими данными, если узнает их? Или зачем оставлять их открытыми? Не говорите, закрыть поле или оставить открытым, — решение я приму сам.`,
  });
  const set = (i, k, val) => { setM(p => p.map((x, j) => (j === i ? { ...x, [k]: val } : x))); setPut(false); };
  const cur = JSON.stringify(m.map(x => [x.ochiq, clean(x.sabab)]));
  const canSave = snap !== cur && m.every(x => x.ochiq !== null && filled(x.sabab, 3));
  const save = () => { if (!canSave) return; cardWrite({ maydonlar: m.map(x => ({ nom: clean(x.nom), bolim: clean(x.bolim), ochiq: x.ochiq, sabab: clean(x.sabab) })) }); setSnap(cur); setPut(true); };
  const opens = m.map((x, i) => ({ ...x, i })).filter(x => x.ochiq !== false);
  // F-0925-B31: «Sxemangiz» ixcham ro'yxat — bir vaqtda bitta qator ochiq (birinchi chala qator yoki ✏️ bosilgani).
  // Ilgari uch maydon · uch almashtirgich · uch kiritish birdaniga 14-ekranni to'liq takrorlardi.
  // Qator o'z-o'zidan YOPILMAYDI (yozish paytida 3-harfda yo'qolib qolardi — sinovda tutildi): «✓ Tayyor» bosilganda yopiladi
  // va keyingi chala qator ochiladi.
  const rowOk = (x) => x.ochiq !== null && filled(x.sabab, 3);
  const [edit, setEdit] = useState(() => { const k = start.m.findIndex(x => !(x.ochiq !== null && filled(x.sabab, 3))); return k < 0 ? null : k; });
  const openRow = edit === null ? -1 : edit;
  const closeRow = () => { const nx = m.findIndex((x, k) => k !== edit && !rowOk(x)); setEdit(nx < 0 ? null : nx); };
  // Bir lahzada bitta puls: ①/② (AiStep ichida) → ③ ochiq maydonlarning sabab-qatorlari (navbat bilan) → «Saqlash» → NavNext.
  // 🛟 zaxira ochilsa Gemini pulsi AiStep ichida o'chadi va navbat shu kartaga o'tadi (atThree). Zaxira yopilsa — yana Gemini.
  // Tanlanmagan tomon bo'lsa — avval o'sha almashtirgich. Mentor rejimida ekran-ichi puls yo'q (pilot B1).
  const pendE = put ? [] : canSave ? ['save'] : openRow < 0 ? [] : (m[openRow].ochiq === null ? [`t${openRow}`] : !filled(m[openRow].sabab, 3) ? [`s${openRow}`] : ['done']);
  const litE = useTurnWalk(pendE, atThree && !focus && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: 'AI bilan', ru: 'С AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!put && !isMentor} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen dense ai-scr" style={{ gap: 'clamp(12px,2vw,16px)' }}>
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>Ochiq maydonlaringizni begona ko'rsa, <span className="italic" style={{ color: T.accent }}>nima bo'lishi mumkin</span>?</>, ru: <>Что <span className="italic" style={{ color: T.accent }}>может случиться</span>, если ваши открытые поля увидит чужой?</> })}</h2>
          <p className="lead-note fade-up delay-1">{tr({ uz: 'AI ochiq maydonlaringiz haqida savol beradi. Ilovani to\'liq tekshirmaydi — qarorni siz qilasiz.', ru: 'AI задаст вопросы о ваших открытых полях. Приложение целиком он не проверяет — решение принимаете вы.' })}</p>
        </div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210 — NEGA lead-note'ni takrorlamaydi (B-14), darsning «zarar» so'zi bilan; javob aytilmaydi).
            B-18: Gemini ochilmaguncha → «Gemini'ni ochish» (F-0925-QA35) · ochilgach → «Sxemangiz» · saqlangach → «Davom etish» (juftlikka ko'prik).
            🛟 zaxira ochiq bo'lsa ham → «Sxemangiz»: puls o'sha yerda (atThree), chorlov puls turgan elementni aytadi (B-13/B-18). Matn o'zgarmagan. */}
        <Mentor>{put
          ? tr({ uz: <>Keyin uch gapingizni sherigingiz tekshiradi — <b style={{ color: T.ink }}>«Davom etish»</b>ni bosing.</>, ru: <>Дальше напарник проверит ваши три фразы, — нажмите <b style={{ color: T.ink }}>«Продолжить»</b>.</> })
          : atThree
          ? tr({ uz: <>Chetdan berilgan savol siz o'ylamagan zararni ko'rsatib qo'yishi mumkin — AI savollariga qarab <b style={{ color: T.ink }}>«Sxemangiz»</b>ni tekshiring.</>, ru: <>Вопрос со стороны может показать вред, о котором вы не подумали, — проверьте <b style={{ color: T.ink }}>«Вашу схему»</b> по вопросам AI.</> })
          : tr({ uz: <>Chetdan berilgan savol siz o'ylamagan zararni ko'rsatib qo'yishi mumkin — <b style={{ color: T.ink }}>«Gemini'ni ochish»</b>ni bosing: so'rov o'zi nusxalanadi, chatga joylab yuboring.</>, ru: <>Вопрос со стороны может показать вред, о котором вы не подумали, — нажмите <b style={{ color: T.ink }}>«Открыть Gemini»</b>: запрос скопируется сам, вставьте его в чат и отправьте.</> })}</Mentor>
        <div className="split">
          <Col>
            <AiStep prompt={prompt} answered={put} onReady={setReady} onFallback={setFb} pulse={!isMentor}
              answerLabel={tr({ uz: <>AI savollariga qarab, <b>«Sxemangiz»</b>da tanlovni kerak bo'lsa o'zgartiring va <b>«Saqlash»</b>ni bosing</>, ru: <>По вопросам AI при необходимости измените выбор в <b>«Вашей схеме»</b> и нажмите <b>«Сохранить»</b></> })}
              fallback={<div className="ai-fb">
                {opens.length === 0 ? <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(ALL_CLOSED)}</p> : opens.map(x => (
                  <div key={x.i} className="ai-fb-f">
                    <span className="oy-name">{capFirst(clean(x.nom)) || '…'}</span>
                    {/* B-7: AI qadami yonida ichki ro'yxat raqamsiz — belgi bilan */}
                    {AI_QS.map((q, k) => <p key={k} className="ai-fb-q"><span className="pa-q-n" aria-hidden="true">?</span>{tr(q)}</p>)}
                  </div>
                ))}
                {/* §206-54 · §188: zaxira yo'l savollardan keyingi qadamni ham aytadi (③ yorlig'i «AI savollari» deydi — bu yerda savollar tayyor) */}
                {opens.length > 0 && <p className="small ai-fb-next" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "Savollarni o'ylab ko'ring: «Sxemangiz»da tomonni o'zingiz tanlang va sababini yozing.", ru: 'Подумайте над вопросами: сами выберите сторону в «Вашей схеме» и напишите причину.' })}</p>}
              </div>} />
          </Col>
          <Col>
            <div className="cq-card">
              <span className="ic-h">{tr({ uz: 'Sxemangiz', ru: 'Ваша схема' })}</span>
              {m.map((x, i) => (i === openRow ? (
                <div key={i} className="cq-step sx-open fade-step">
                  <span className="oy-name">{N3[i]} {capFirst(clean(x.nom)) || '…'}{rowOk(x) && <button type="button" className={`sx-done${turnCls(litE, 'done', false)}`} onClick={closeRow}>✓ {tr({ uz: 'Tayyor', ru: 'Готово' })}</button>}</span>
                  <SideToggle value={x.ochiq} onChange={(v) => set(i, 'ochiq', v)} lit={litE === `t${i}`} />
                  {x.ochiq !== null && <label className={`pw-f ${filled(x.sabab, 3) ? 'on' : ''}${turnCls(litE, `s${i}`, pendE.length > 1)}`}><input placeholder={tr(x.ochiq ? OY_PH.open : OY_PH.closed)} aria-label={tr(x.ochiq ? OY_Q.open : OY_Q.closed)} value={x.sabab} onChange={e => set(i, 'sabab', e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} maxLength={140} /></label>}
                </div>
              ) : (
                <button key={i} type="button" className={`oc-row fp-go${rowOk(x) ? ' ok' : ''}`} onClick={() => setEdit(i)} aria-label={`${capFirst(clean(x.nom)) || ''} — ${tr({ uz: 'o\'zgartirish', ru: 'изменить' })}`}>
                  {/* F-0925-QA47: ✓ / 🔓🔒 / ✏️ olindi — qator o'zi bosiladi (14-ekran «Sxemangiz» naqshi) */}
                  <span className="oc-n">{N3[i]} {capFirst(clean(x.nom)) || '…'}</span>
                  {x.ochiq !== null && <span className={`oc-tag${x.ochiq ? '' : ' shut'}`}>{tr(x.ochiq ? { uz: 'ochiq', ru: 'открыто' } : { uz: 'yopiq', ru: 'закрыто' })}</span>}
                </button>
              )))}
              <div className="cq-save">
                <button type="button" className={`pw-save${turnCls(litE, 'save', false)}`} disabled={!canSave} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
                {put && <span className="done-mini fade-step">✓ {tr({ uz: 'Saqlandi', ru: 'Сохранено' })}</span>}
              </div>
            </div>
            {/* F-0925-QA47: qoida-qutisi olindi — aynan shu qoida sarlavha ostidagi gapda turibdi («Ilovani to'liq tekshirmaydi — qarorni siz qilasiz») */}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== 17-EKRAN — JUFTLIK (ballsiz): uch qavat gapidan birini o'qish → sherik qavatni topadi → bir gap =====
const PAIR_KEY = 'bridge-b7-sherik';
const ScreenPair = ({ screen, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [text, setText] = useState(() => { try { return localStorage.getItem(PAIR_KEY) || ''; } catch { return ''; } });
  // Dizayn 4-aylanish: gap o'z qavat-raqami bilan olinadi (i) — «?» belgisi bosilganda o'sha qavatning belgisi ochiladi.
  const [gaps] = useState(() => { const c = cardSafe(); return Array.isArray(c.qavatlar) ? c.qavatlar.slice(0, 3).map((x, i) => ({ x: str(x), i })).filter(o => filled(o.x)) : []; });
  const [flip, setFlip] = useState(() => new Set());
  const doFlip = (i) => setFlip(p => { const n = new Set(p); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  const save = (val) => { setText(val); try { localStorage.setItem(PAIR_KEY, val); } catch { /* jim */ } };
  const written = text.trim().length >= 8;
  const [reflFocus, setReflFocus] = useState(false);
  const inputTurn = useTurnHint(!written && !reflFocus && !isMentor); // mentor rejimida ekran-ichi puls yo'q (pilot B1)
  return (
    <Stage eyebrow={tr({ uz: 'Yakun · juftlik', ru: 'Итог · в паре' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext turnBusy={!written} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sherigingiz gaplaringizdan <span className="italic" style={{ color: T.accent }}>to'g'ri javobni</span> topa oldimi?</>, ru: <>Нашёл ли напарник по вашим фразам <span className="italic" style={{ color: T.accent }}>правильный ответ</span>?</> })}</h2></div>
        {/* 🎓 Metodist 24.09: mentor-gap yakuniy (§210). O'qish qadami 1-bandda (senariy yo'rig'i) turibdi — pufak ekranda hech qayerda
            aytilmagan «?» tugmasini ochadi (u faqat title'da edi). Gap yo'q bo'lsa — o'qish chorlovi; yozilgach — «Davom etish». */}
        <Mentor>{written
          ? tr({ uz: <>Keyin testlardagi natijangizni ko'rasiz — <b style={{ color: T.ink }}>«Davom etish»</b>ni bosing.</>, ru: <>Дальше вы увидите свои результаты в тестах, — нажмите <b style={{ color: T.ink }}>«Продолжить»</b>.</> })
          : gaps.length > 0
          ? tr({ uz: <>Sherigingiz gap qaysi ish haqida ekanini topsa, gapingiz aniq yozilgan — u javob bergach, gap yonidagi <b style={{ color: T.ink }}>«?»</b>ni bosib tekshiring.</>, ru: <>Если напарник поймёт, о какой работе фраза, она написана точно, — когда он ответит, нажмите <b style={{ color: T.ink }}>«?»</b> рядом с фразой и проверьте.</> })
          : tr({ uz: <>Sherigingiz gap qaysi ish haqida ekanini topsa, gapingiz aniq yozilgan — <b style={{ color: T.ink }}>uch gapingizdan</b> birini unga ovoz chiqarib o'qing.</>, ru: <>Если напарник поймёт, о какой работе фраза, она написана точно, — прочитайте ему вслух одну из <b style={{ color: T.ink }}>своих трёх фраз</b>.</> })}</Mentor>
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">{tr({ uz: '🗣 Bitta gapingizni sherigingizga o\'qing — u gap qaysi ish haqida ekanini topsin: ko\'rsatishmi, tekshirishmi yoki eslab qolishmi. Topolmasa, gapni birga aniqroq qiling. Keyin almashing.', ru: '🗣 Прочитайте напарнику одну свою фразу — пусть он поймёт, о какой она работе: показывает, проверяет или запоминает. Если не поймёт, сделайте фразу точнее вместе. Потом поменяйтесь.' })}</span></div></div>
            {/* Mini-sahna (ETALON 23): sherik qavatni aytgach «?» bosiladi — qavat belgisi ochiladi va javob tekshiriladi.
                Kartada gap bo'lmasa — o'qish sahnasi: siz → sherik → uch qavatdan biri (belgilar navbat bilan yonadi). Ball yo'q. */}
            {gaps.length > 0 ? (
              <div className="pr-gaps">{gaps.map(o => (
                <div key={o.i} className={`pr-gap-row${flip.has(o.i) ? ' on' : ''}`}>
                  <p className="pr-gap">«{capFirst(clean(o.x))}»</p>
                  <button type="button" className="pr-flip" onClick={() => doFlip(o.i)} aria-pressed={flip.has(o.i)} aria-label={tr({ uz: "Qaysi ish ekanini ko'rsatish", ru: 'Показать, о какой это работе' })} title={tr({ uz: "Qaysi ish ekanini ko'rsatish", ru: 'Показать, о какой это работе' })}>
                    <span className="pr-flip-in" key={flip.has(o.i) ? 'a' : 'q'}>{flip.has(o.i) ? FLOORS[o.i].ic : '?'}</span>
                  </button>
                </div>
              ))}</div>
            ) : (
              <div className="pr-scene" aria-hidden="true">
                <span className="pr-p">🧑<i className="pr-bub">🗣</i></span>
                <span className="pr-wave"><i /><i /><i /></span>
                <span className="pr-p">🧑<i className="pr-bub q">?</i></span>
                <span className="pr-fls">{FLOORS.map((f, k) => <span key={f.k} className="pr-fl" style={{ '--k': k }}>{f.ic}</span>)}</span>
              </div>
            )}
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">{tr({ uz: '✍️ Sherigingiz qaysi gapni topolmadi va nimani o\'zgartirdingiz — bitta gapda yozing.', ru: '✍️ Какую фразу напарник не смог определить и что вы изменили — напишите одной фразой.' })}</span></div></div>
            <span className={`turn-wrap${inputTurn ? ' turn-ring' : ''}`}>
              <input className="reflect-input" value={text} placeholder={tr({ uz: "Hammasini topgan bo'lsa: «Sherigim hammasini topdi»", ru: 'Если нашёл все: «Напарник нашёл все»' })} onChange={e => save(e.target.value)} onFocus={() => setReflFocus(true)} onBlur={() => setReflFocus(false)} maxLength={200} />
            </span>
            {written && <p className="small" style={{ margin: 0, color: T.success, fontWeight: 700 }}>{tr({ uz: '✓ Yozildi!', ru: '✓ Записано!' })}</p>}
          </div>
        </div>
      </div>
    </Stage>
  );
};

// ===== 🏅 NISHONLAR (senariy 4-bo'lim) — faqat REAL bajariladigan harakatga; name inglizcha, desc siz-forma =====
const ACHIEVEMENTS = {
  fieldFinder: { icon: '🔎', name: 'Field Finder!', desc: { uz: 'Bo\'lim ochadigan maydonlarni topdingiz', ru: 'Вы нашли поля, которые открывают разделы' } },
  whoSees:     { icon: '👁️', name: 'Who Sees It!',  desc: { uz: 'Har maydonni kim ko\'rishini hal qildingiz', ru: 'Вы решили, кто видит каждое поле' } },
  schemaReady: { icon: '🗂️', name: 'Schema Ready!', desc: { uz: 'G\'oyangizga uch maydonli sxema yozdingiz', ru: 'Вы написали для своей идеи схему из трёх полей' } },
  threeFloors: { icon: '🧩', name: 'Three Parts!', desc: { uz: 'Uch gapni kasbiy so\'zsiz yozdingiz', ru: 'Вы написали три фразы без профессиональных слов' } },
};
// Ekran id → nishon (recordAnswer'da, faqat data.correct bilan): 3 · 6 · 14 · 15-ekranlar.
const ACH_TRIGGERS = { xotira: 'fieldFinder', kim: 'whoSees', ochiq: 'schemaReady', qavatgap: 'threeFloors' };

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

const QUIZ_MS = 15000;
// Arena fon tokenlari — darsning o'z atamalari (dekor o'qitadi, M7). CodeStrike brendi o'zgarmaydi. YouTube nomi yo'q (faqat 3-ekranda).
const QZ_BG_SHAPES = [
  { ch: { uz: 'MAYDON', ru: 'ПОЛЕ' },         l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'BO\'LIM', ru: 'РАЗДЕЛ' },      l: 84, t: 8,  s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'SXEMA', ru: 'СХЕМА' },         l: 6,  t: 72, s: 22, d: 27, dl: 0.8 },
  { ch: { uz: 'QISM', ru: 'ЧАСТЬ' },          l: 74, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'ZARAR', ru: 'ВРЕД' },          l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: '🔓',     l: 66, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: 'Netflix', l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: '🔒',     l: 55, t: 5,  s: 22, d: 22, dl: 0.6 },
  { ch: '👍',     l: 91, t: 42, s: 24, d: 24, dl: 1.3 },
  { ch: '🗄️',    l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
  { ch: '🛡️',    l: 2,  t: 30, s: 26, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike savollari — 12 ta, to'rt blokdan teng (3/3/3/3); vaziyatlar ekrandagidan boshqa (senariy 20-ekran):
// musiqa ilovasi · maktab kutubxonasi sayti · oshxona buyurtma ilovasi. To'g'ri javoblar 4 pozitsiyaga TENG (3/3/3/3).
// Jonli TASDIQLAYDI · Metodist ko'radi (matnlar Quruvchiniki — senariyda faqat kontekst berilgan).
const QUIZ_BANK = [
  // 1-blok · nimani yozib qo'yamiz (maydon → bo'lim)
  { q: { uz: 'Musiqa ilovasi har safar qo\'shiq tinglanganda nimani yozib qo\'ysa, «Ko\'p tinglaganlaringiz» bo\'limi ochiladi?', ru: 'Что музыкальное приложение должно записывать при каждом прослушивании, чтобы открылся раздел «Вы часто слушаете»?' }, opts: [
    { uz: "Ekran qanchalik yorug' edi", ru: 'Насколько ярким был экран' },
    { uz: "Qo'shiq baland tinglandimi", ru: 'Громко ли слушали песню' },
    { uz: 'Qaysi qo\'shiq tinglandi', ru: 'Какую песню послушали' },
    { uz: 'Qaysi quloqchin ulangan edi', ru: 'Какие наушники были подключены' }], correct: 2 },
  { q: { uz: 'Maktab kutubxonasi saytiga «Qaytarish muddati yaqin» bo\'limini qo\'shmoqchimiz. Buning uchun qaysi maydon kerak?', ru: 'Мы хотим добавить на сайт школьной библиотеки раздел «Скоро вернуть». Какое поле для этого нужно?' }, opts: [
    { uz: "Kitobni qaytarish kerak bo'lgan sana", ru: 'Дата, когда книгу нужно вернуть' },
    { uz: 'Kitobda nechta bet borligi', ru: 'Сколько страниц в книге' },
    { uz: "Kitobni olgan o'quvchi qaysi sinfda", ru: 'В каком классе ученик, взявший книгу' },
    { uz: 'Qaytarilgan kitob muqovasining rangi', ru: 'Цвет обложки возвращённой книги' }], correct: 0 },
  { q: { uz: 'Oshxona buyurtma ilovasi jamoasi yangi maydon taklif qildi, lekin undan hech qanday bo\'lim ochilmaydi. Bu darsdagi qoidaga ko\'ra nima qilamiz?', ru: 'Команда приложения для заказа еды предложила новое поле, но никакой раздел из него не открывается. Что делаем по правилу этого урока?' }, opts: [
    { uz: 'Uni sxemaning boshiga yozamiz', ru: 'Пишем его в начало схемы' },
    { uz: 'Baribir yozamiz — keyin kerak bo\'lar', ru: 'Всё равно записываем — вдруг пригодится' },
    { uz: 'Uni hammaga ochiq qilib qo\'yamiz', ru: 'Делаем его открытым для всех' },
    { uz: 'Uni hozircha yozib qo\'ymaymiz', ru: 'Пока его не записываем' }], correct: 3 },
  // 2-blok · kimga ko'rinadi (zarar mezoni)
  { q: { uz: 'Musiqa ilovasida sahifangizni begona ochdi. Qaysi maydon yopiq tursin?', ru: 'В музыкальном приложении вашу страницу открыл чужой. Какое поле должно быть закрыто?' }, opts: [
    { uz: 'Profilingiz nomi', ru: 'Имя вашего профиля' },
    { uz: 'To\'lov kartangiz raqami', ru: 'Номер вашей платёжной карты' },
    { uz: 'Hammaga ochiq pleylistingiz', ru: 'Ваш плейлист, открытый всем' },
    { uz: 'Siz yuklagan qo\'shiqlar nomi', ru: 'Названия загруженных вами песен' }], correct: 1 },
  { q: { uz: 'Maktab kutubxonasi saytida «Kitob hozir javonda bormi» maydoni hammaga ochiq. Nega?', ru: 'На сайте школьной библиотеки поле «Есть ли книга сейчас на полке» открыто всем. Почему?' }, opts: [
    { uz: 'Unda faqat raqam yozilgan', ru: 'Там записано только число' },
    { uz: 'Undan hech kimga zarar yetmaydi', ru: 'Никому от этого нет вреда' },
    { uz: 'Unga ko\'p o\'quvchi qiziqadi', ru: 'Этим интересуются многие ученики' },
    { uz: 'Undan hech kimga foyda yetmaydi', ru: 'Никому от этого нет пользы' }], correct: 1 },
  { q: { uz: 'Oshxona buyurtma ilovasida «Yetkazib berish manzili» maydoni bor. U qaysi tomonda turadi va nega?', ru: 'В приложении для заказа еды есть поле «Адрес доставки». С какой оно стороны и почему?' }, opts: [
    { uz: 'Hammaga ochiq — bu oddiy yozuv, parol emas', ru: 'Открыто всем — это обычная запись, не пароль' },
    { uz: 'Faqat egasiga — unda raqamlar ko\'p bo\'ladi', ru: 'Только владельцу — там много цифр' },
    { uz: 'Hammaga ochiq — uni tez-tez o\'zgartirmaysiz', ru: 'Открыто всем — вы редко его меняете' },
    { uz: 'Faqat egasiga — begona uyingizni topadi', ru: 'Только владельцу — чужой найдёт ваш дом' }], correct: 3 },
  // 3-blok · gap ortida maydon (sxema)
  { q: { uz: 'Musiqa ilovasi sxemasida uch maydon bor: Qo\'shiq nomi · Ijrochi · Albom. E\'londagi qaysi gap yolg\'on chiqadi?', ru: 'В схеме музыкального приложения три поля: Название песни · Исполнитель · Альбом. Какая фраза объявления окажется неправдой?' }, opts: [
    { uz: 'Kim ijro etganini ko\'rasiz', ru: 'Вы видите, кто исполняет' },
    { uz: 'Qo\'shiq nomini ko\'rasiz', ru: 'Вы видите название песни' },
    { uz: 'Chiqqan yilini ko\'rasiz', ru: 'Вы видите год выхода' },
    { uz: 'Qaysi albomdanligini ko\'rasiz', ru: 'Вы видите, из какого альбома' }], correct: 2 },
  { q: { uz: 'Maktab kutubxonasi sayti sxemasida «Muqova rangi» maydoni bor, lekin e\'londagi hech bir gapga u kerak emas. Nima qilamiz?', ru: 'В схеме сайта школьной библиотеки есть поле «Цвет обложки», но ни одной фразе объявления оно не нужно. Что делаем?' }, opts: [
    { uz: 'Uni sxemadan olib tashlaymiz', ru: 'Убираем его из схемы' },
    { uz: 'E\'londan bitta gapni o\'chiramiz', ru: 'Убираем из объявления одну фразу' },
    { uz: 'Qoldiramiz — ehtiyot uchun', ru: 'Оставляем — на всякий случай' },
    { uz: 'Uni hammaga ochiq qilamiz', ru: 'Делаем его открытым для всех' }], correct: 0 },
  { q: { uz: 'Oshxona buyurtma ilovasi e\'lonida: «Ovqat juda mazali». Bu gap uchun qaysi maydon kerak?', ru: 'В объявлении приложения для заказа еды: «Еда очень вкусная». Какое поле нужно для этой фразы?' }, opts: [
    { uz: 'Hech biri — baho so\'zi', ru: 'Никакое: это оценка' },
    { uz: '«Ovqat nomi» maydoni', ru: 'Поле «Название блюда»' },
    { uz: '«Oshpaz ismi» maydoni', ru: 'Поле «Имя повара»' },
    { uz: '«Mazali ovqatlar» maydoni', ru: 'Поле «Вкусная еда»' }], correct: 0 },
  // 4-blok · qanday ishlaydi (uch qavat, kasbiy so'z)
  { q: { uz: 'Musiqa ilovasida qo\'shiqni «Sevimlilar»ga qo\'shdingiz. Ertasi kuni ham u ro\'yxatda turibdi. Buni ilovaning qaysi qismi eslab qoldi?', ru: 'В музыкальном приложении вы добавили песню в «Избранное». На следующий день она всё ещё в списке. Какая часть приложения это запомнила?' }, opts: [
    { uz: 'Server', ru: 'Сервер' },
    { uz: 'Sahifa', ru: 'Страница' },
    { uz: 'Baza', ru: 'База' },
    { uz: 'Telefon ekrani', ru: 'Экран телефона' }], correct: 2 },
  { q: { uz: 'Kutubxona saytida bitta kitobni ikki o\'quvchi bir vaqtda band qilmoqchi. Kitob hali band qilinmaganini ilovaning qaysi qismi tekshiradi?', ru: 'На сайте библиотеки двое учеников одновременно хотят забронировать одну книгу. Какая часть приложения проверяет, что книга ещё не забронирована?' }, opts: [
    { uz: 'Sahifa', ru: 'Страница' },
    { uz: 'Kutubxonachi', ru: 'Библиотекарь' },
    { uz: 'Baza', ru: 'База' },
    { uz: 'Server', ru: 'Сервер' }], correct: 3 },
  { q: { uz: 'Kod bilmaydigan odamga oshxona ilovasi haqida gapiryapsiz. Qaysi gapda kasbiy so\'z yo\'q?', ru: 'Вы рассказываете о приложении для заказа еды человеку, который не знает кода. В какой фразе нет профессионального слова?' }, opts: [
    { uz: 'Buyurtma serverga jo\'natiladi', ru: 'Заказ отправляется на сервер' },
    { uz: 'Buyurtmani ilova eslab qoladi', ru: 'Заказ запоминается приложением' },
    { uz: 'Buyurtma bazada saqlanadi', ru: 'Заказ хранится в базе' },
    { uz: 'Buyurtma API orqali qaytadi', ru: 'Заказ приходит через API' }], correct: 1 },
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
// ===== ⚔️ CODESTRIKE ARENA — signal zonasi: 100+ (test <100, praktika 500+ bilan to'qnashmaydi) =====
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
    const TOK = tr({ uz: ['MAYDON', "BO'LIM", 'SXEMA', 'QISM', 'ZARAR', 'Netflix', '🔓', '🔒', '👍', '🗄️'],
                     ru: ['ПОЛЕ', 'РАЗДЕЛ', 'СХЕМА', 'ЧАСТЬ', 'ВРЕД', 'Netflix', '🔓', '🔒', '👍', '🗄️'] });
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
          <span key={i} className="qz-shp" style={{ left: `${s.l}%`, top: `${s.t}%`, fontSize: s.s, color: s.c, animationDuration: `${s.d}s`, animationDelay: `${s.dl}s` }}>{tr(s.ch)}</span>
        ))}
      </div>
      <QzFX />
      <button className="qz-x" onClick={closeArena} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>

      {classEnded && isStudent && !solo && phase !== 'done' && (
        <div className="qz-endnote fade-step">
          <span>{tr({ uz: "⚠️ Jonli dars yakunlandi — testni o'zingiz davom ettiring:", ru: '⚠️ Живой урок завершён — продолжите тест самостоятельно:' })}</span>
          <button className="qz-btn" onClick={startPractice}>{tr({ uz: '📖 Mashq rejimida davom etish', ru: '📖 Продолжить в режиме тренировки' })}</button>
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
              <button className="qz-btn big" onClick={soloReplay}>{tr({ uz: '↻ Qayta yechish', ru: '↻ Решить заново' })}</button>
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

// ===== 18-EKRAN — PODIUM: jonli ball natijasi (4 test bo'yicha) =====
// Mentor (proyektor): birinchi uch o'rin (ism · ball) + qolganlar ro'yxati. O'quvchi: o'z bali va o'rni.
// Mustaqil rejim: shaxsiy ball-aylana + nishonlar. Mag'lubiyat-tablosi yo'q (ETALON 1-D).
const ScreenPodium = ({ screen, answers, achievements, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const isMentor = !!(live && live.mode === 'mentor');
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
  const top3 = board.slice(0, 3);
  const myIdx = live && live.playerId ? board.findIndex(b => b.id === live.playerId) : -1;
  const selfCorrect = SCORED_IDX.filter(i => answers[i]?.correct).length;
  return (
    <Stage eyebrow={tr({ uz: 'Yakun · natijalar', ru: 'Итог · результаты' })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{isLive ? tr({ uz: <>Testlarda kim eng ko'p <span className="italic" style={{ color: T.accent }}>ball</span> to'pladi?</>, ru: <>Кто набрал больше всего <span className="italic" style={{ color: T.accent }}>баллов</span> в тестах?</> }) : tr({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>natijangiz</span></>, ru: <>Ваш сегодняшний <span className="italic" style={{ color: T.accent }}>результат</span></> })}</h2></div>
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
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Результаты загружаются…' })}</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: 'К этой сессии пока никто не подключился.' })}</p></div>
        ) : isMentor ? (
          <>
            <Confetti />
            <div className="pod-stage fade-up">
              {[1, 0, 2].map(rank => {
                const b = top3[rank];
                return (
                  <div key={rank} className={`pod-col pod-${rank + 1}`}>
                    <span className="pod-medal">{['🥇', '🥈', '🥉'][rank]}</span>
                    <span className="pod-name">{b ? b.nickname : '—'}</span>
                    {b && <span className="pod-score mono">{b.okCount}/{totalQ}</span>}
                    <div className="pod-bar" />
                  </div>
                );
              })}
            </div>
            {board.length > 3 && (
              <div className="card fade-up d1">
                <div className="pod-list">
                  {board.slice(3).map((b, i) => (
                    <div key={b.id} className="pod-row">
                      <span className="mono pod-rank">{i + 4}</span>
                      <span className="pod-row-name">{b.nickname}</span>
                      <span className="mono pod-row-score">{b.okCount}/{totalQ}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <Confetti />
            <div className="pod-me fade-up">
              <span className="pod-me-medal">{myIdx >= 0 && myIdx < 3 ? ['🥇', '🥈', '🥉'][myIdx] : '🏅'}</span>
              <span className="pod-me-place">{myIdx >= 0 ? tr({ uz: `${myIdx + 1}-o'rin`, ru: `${myIdx + 1}-е место` }) : '—'}</span>
              <span className="pod-me-score mono">{myIdx >= 0 ? board[myIdx].okCount : selfCorrect}/{totalQ}</span>
            </div>
          </>
        )}
      </div>
    </Stage>
  );
};


// ===== 19-EKRAN — FLASHCARD (5 ta — senariy jadvali) =====
const FLASHCARDS = [
  { front: { uz: 'Maydon nima?', ru: 'Что такое поле?' }, back: { uz: 'Ilova har safar yozib qo\'yadigan bitta narsa', ru: 'Одна вещь, которую приложение каждый раз записывает' } },
  { front: { uz: 'Qaysi maydon yopiladi?', ru: 'Какое поле закрывают?' }, back: { uz: "Begona ko'rsa egasiga zarar yetadigan maydon", ru: 'Поле, которое навредит владельцу, если его увидит чужой' } },
  { front: { uz: 'Sxema nima?', ru: 'Что такое схема?' }, back: { uz: 'Ilovaning hamma maydonlari ro\'yxati', ru: 'Список всех полей приложения' } },
  { front: { uz: 'Ilovaning uch qismi qaysi ishlarni qiladi?', ru: 'Какую работу делают три части приложения?' }, back: { uz: 'Sahifa ko\'rsatadi · server tekshiradi · baza eslab qoladi', ru: 'Страница показывает · сервер проверяет · база запоминает' } },
  { front: { uz: 'Kasbiy so\'zni nima qilasiz?', ru: 'Что вы делаете с профессиональным словом?' }, back: { uz: 'Tanish so\'z bilan almashtirasiz: qismning nomi emas, ishi aytiladi', ru: 'Заменяете знакомым словом: говорят не название части, а её работу' } },
];
const fcTier = (s) => (s.length <= 8 ? 't1' : s.length <= 16 ? 't2' : s.length <= 32 ? 't3' : 't4');
const fcAnswer = (raw) => { const s = String(raw ?? ''); return <span className={`fc-tag ${fcTier(s)} prose`}>{s}</span>; };
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
    }, reducedMotion() ? 0 : 420);
  };
  const restart = () => { setQueue(cards.map((_, i) => i)); setKnown(0); setFlipped(false); };
  if (!card) return (
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{total}/{total} {tr({ uz: 'karta yodlandi', ru: 'карточек выучено' })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>↻ {tr({ uz: "O'rganilmoqda", ru: 'Учим' })} · <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>✓ {tr({ uz: 'Bildim', ru: 'Знаю' })} · <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
          <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !exiting && setFlipped(f => !f)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!exiting) setFlipped(f => !f); } }}>
            <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span></div>
            <div className="fc-face fc-back">{fcAnswer(tr(card.back))}</div>
          </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={() => advance(false)}>{tr({ uz: '✗ Takrorlash', ru: '✗ Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={() => advance(true)}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })}</button></div>)
        : null /* F-0925-QA19: fleshkarta yo'rig'i faqat har o'tishning 1-darsida (KimUchun, KimUchunMuammo), shu darsda yo'q */}
    </div>
  );
}
const ScreenFlash = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Yakun · takrorlash', ru: 'Итог · повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <>Проверьте <span className="italic" style={{ color: T.accent }}>себя</span>.</> })}</h2></div>
      <div className="fc-center"><Flashcards cards={FLASHCARDS} /></div>
    </div>
  </Stage>
);


// ===== 20-EKRAN — ARENA (CodeStrike, 12 savol — P0 Screen16 CTA mantiqi) + YAKUN (to'rt qator — to'rt blok) =====
const SUMMARY_LINES = [
  { uz: 'Bu darsda maydonni u ochadigan bo\'limga qarab tanladik.', ru: 'На этом уроке мы выбирали поле по разделу, который оно открывает.' },
  { uz: "Begona ko'rsa egasiga zarar yetadigan maydon yopiladi — yozuvning turi bunda muhim emas.", ru: 'Закрывают поле, которое навредит владельцу, если его увидит чужой, — тип записи здесь не важен.' },
  { uz: 'Odamga aytilgan har ma\'lumot ortida sxemada kerakli maydon turadi.', ru: 'За каждым сведением, которое сказано человеку, в схеме стоит нужное поле.' },
  { uz: 'Layk kabi yozib qo\'yiladigan bosish uch qismdan o\'tadi: sahifa ko\'rsatadi, server tekshiradi, baza eslab qoladi.', ru: 'Записываемое нажатие, например лайк, проходит через три части: страница показывает, сервер проверяет, база запоминает.' },
];
const ScreenSummary = ({ screen, achievements, onReset, onPrev, onFinish }) => {
  const { isMentor } = useIsMentor();
  const _gate = useContext(LiveGateCtx) || {};
  const _live = _gate.live;
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
  return (
    <Stage eyebrow={null} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: '↻ Darsni boshidan', ru: '↻ Урок сначала' })}</button><div className="nav-mdock"><MentorNote>{tr({ uz: 'Og\'zaki ayting: «NestJS modulida shu uch qismning o\'rtadagisini — tekshiradigan serverni qurasiz.»', ru: 'Скажите устно: «В модуле NestJS вы построите среднюю из этих трёх частей — сервер, который проверяет».' })}</MentorNote></div><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Darsni yakunlash ✓', ru: 'Завершить урок ✓' })}</button></>}>
      <div className="screen dense">
        <div className="hero"><div className="hero-l"><h2 className="title h-title fade-up d1">{tr(LESSON_META.lessonTitle)}</h2></div></div>
        <div className={`qz-cta cs-cta fade-up d1 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : tr({ uz: "12 savolli tezkor o'yin — bugungi dars bo'yicha", ru: 'Быстрая игра из 12 вопросов — по сегодняшнему уроку' })} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d2"><div className="card-lbl" style={{ color: T.success }}>{tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{SUMMARY_LINES.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span>{tr(r)}</span></li>))}</ul></div>
        {!isMentor && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr({ uz: 'Nishonlaringiz —', ru: 'Ваши значки —' })} {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return (
              <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`} title={tr(a.desc)}>
                {got ? <span className="ach-badge-ic">{a.icon}</span> : <span className="ach-badge-ic lock" aria-hidden="true" />}
                <span className="ach-badge-name">{a.name}</span>
              </div>
            ); })}
          </div>
        </div>}
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished, liveToken })
export default function BridgeMalumotIshonch({ lang: langProp, onFinished, liveToken }) {
  const lang = langProp || 'uz';
  __lang = lang; // UZ-RU: tr() uchun joriy til (render'dan oldin)
  setLiveLang(lang);
  // F-0730-01: saqlangan progress bir marta o'qiladi (jonli o'quvchi mentor darvozasidan oshib ketmasin).
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
  const firstPassRef = useRef(saved?.firstPass || null); // 151-qonun 6-band
  const soloSentRef = useRef(new Set());
  const [fpPractice, setFpPractice] = useState(!!saved?.firstPass);
  const earnedRef = useRef(new Set(saved?.earned || []));
  const [earned, setEarned] = useState(() => new Set(saved?.earned || []));
  const [achToasts, setAchToasts] = useState([]);
  const achKeyRef = useRef(0);
  const earn = useCallback((id) => {
    if (firstPassRef.current) return; // 151-qonun: mashq-o'tishida nishonlar muzlagan
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
  // Bridge qobig'ida dars ustida TopBar turadi — dars balandligi undan qolgan joyga moslanadi (--bo = yuqori chegara; pilot BridgeKimUchun naqshi).
  const rootRef = useRef(null);
  useEffect(() => {
    const upd = () => { const el = rootRef.current; if (!el) return; const top = Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY)); el.style.setProperty('--bo', `${top}px`); };
    upd(); window.addEventListener('resize', upd);
    // TopBar balandligi shrift yuklangach o'zgaradi (50 → 53px): birinchi o'lchov eskirib, pastki panel 3px chiqib qolardi.
    // Shuning uchun dars ustidagi qo'shni elementlar kuzatiladi va shriftlar tayyor bo'lganda qayta o'lchanadi.
    const el = rootRef.current;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(upd) : null;
    if (ro && el) { let n = el.previousElementSibling; while (n) { ro.observe(n); n = n.previousElementSibling; } }
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) document.fonts.ready.then(upd).catch(() => {});
    return () => { window.removeEventListener('resize', upd); if (ro) ro.disconnect(); };
  }, []);
  const answerKey = { ...INLINE_KEYS, ...Object.fromEntries(QUIZ_BANK.map((q, i) => [`quiz-${i}`, q.correct])) };
  const live = useLiveSession(LESSON_META.lessonId, answerKey, { liveToken });
  useServerProgress(live, { setScreen, setAnswers, setEarned, earnedRef, startTimeRef, total: TOTAL_SCREENS });
  const isStudentLive = live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const locked = isStudentLive && (screen + 1 > live.mentorScreen);
  useEffect(() => { live.reportScreen(screen); }, [screen, live.mode, live.pin]); // eslint-disable-line
  const next = () => setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  const prev = () => setScreen(s => Math.max(s - 1, 0));
  const recordAnswer = (idx, data) => {
    const nextA = { ...answers, [idx]: data };
    setAnswers(nextA);
    const _m = SCREEN_META[idx];
    // Q1 (19.09): mustaqil rejimda ballik test javobi ham serverga — bir marta; «Qaytadan» mashqida yuborilmaydi.
    if (_m && _m.scored && live.mode === 'solo' && !firstPassRef.current && data && (data.solved === true || data.correct === true) && !soloSentRef.current.has(idx)) {
      const key = INLINE_KEYS[_m.id];
      if (Number.isInteger(key)) { soloSentRef.current.add(idx); live.submitAnswer(idx, _m.id, key < 0 ? 0 : (data.correct ? key : (key === 0 ? 1 : 0)), !!data.correct, data.elapsedMs || 0); }
    }
    if (_m && ACH_TRIGGERS[_m.id] && data && data.correct && !missedRef.current.has(_m.id)) earn(ACH_TRIGGERS[_m.id]); // 🏅 faqat REAL bajarilganda
  };
  const reset = () => { if (!firstPassRef.current) { firstPassRef.current = { answers, durationSec: Math.floor((Date.now() - startTimeRef.current) / 1000) }; setFpPractice(true); } progClear(LESSON_META.lessonId); setAnswers({}); setScreen(0); startTimeRef.current = Date.now(); };
  useEffect(() => {
    progWrite(LESSON_META.lessonId, { screen, answers, earned: [...earnedRef.current], missed: [...missedRef.current], firstPass: firstPassRef.current, startedAt: startTimeRef.current, total: TOTAL_SCREENS, savedAt: Date.now() });
  }, [screen, answers, earned, missed, fpPractice]);

  const finishLesson = () => {
    progClear(LESSON_META.lessonId);
    live.endSession();
    const fp = firstPassRef.current;
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

  // Tartib = SCREEN_META (20 sahifa = senariy 20 ekrani; 20-ekranda arena yakun sahifasi ichida).
  const screens = [ScreenHook, ScreenGoal, ScreenMemory, ScreenCase, ScreenTest1, ScreenWhoSees, ScreenTest2, ScreenAd, ScreenTest3, ScreenFloors, ScreenTest4, ScreenLine, ScreenFields, ScreenOpenClosed, ScreenFloorGaps, ScreenAI, ScreenPair, ScreenPodium, ScreenFlash, ScreenSummary];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
      <style>{`
        /* PRODUCTION: shu @import OLIB TASHLANADI — shriftlarni LMS yuklaydi (platform_contract). */
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc((100dvh - var(--bo, 0px)) / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
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
        .feedback-block > div { border-left: none; } /* F-0925-QA16: test izohining chap rang-chizig'i olindi (boshqa xulosa bloklari o'zgarmaydi) */

        /* Jonli-nishon (LiveBadge) — xira, aralashmaydi; hoverda to'liq ko'rinadi */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease; }
        .live-badge:hover { opacity: 1; }

        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }

        /* === KNOPKALAR === */
        .btn-white-accent { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 12px; letter-spacing: 0.01em; box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12); }
        .btn-white-accent:hover:not(:disabled) { background: ${T.accent}; color: #fff; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.55); }
        .btn-white-accent:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.14); }
        /* 🔔 NAVBAT-PULSI (88-qonun · 1-C): navbat shu elementda. O'LCHAM O'ZGARMAYDI — faqat halqa
           nafas oladi, shuning uchun UI sakramaydi va ixchamligicha qoladi. Asosiy soya saqlanadi. */
        @keyframes turn-hint {
          0%, 100% { box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12), 0 0 0 0 rgba(91,61,230,0.40); }
          50%      { box-shadow: 0 8px 22px -4px rgba(91,61,230,0.35), 0 0 0 1px rgba(91,61,230,0.12), 0 0 0 8px rgba(91,61,230,0); }
        }
        .turn-hint { animation: turn-hint 1.9s ease-in-out infinite; }
        /* Tugmadan boshqa elementlar uchun (chip, karta, zona, kiritish maydoni): halqa ALOHIDA
           qatlamda chiziladi — elementning o'z chegarasi/soyasiga tegmaydi va layout'ni surmaydi. */
        .turn-ring { position: relative; }
        .turn-ring::after {
          content: ''; position: absolute; inset: -3px; border-radius: inherit; pointer-events: none;
          border: 2px solid ${T.accent}; opacity: 0; animation: turn-ring 1.9s ease-in-out infinite;
        }
        @keyframes turn-ring { 0%, 100% { opacity: 0; } 50% { opacity: 0.65; } }
        /* Navbat TO'LQINI: bir guruh teng variant birma-bir yonadi. Kechikishlar shunday tanlanganki,
           istalgan lahzada FAQAT BITTASI ko'rinadi. Cheklangan (4 aylanish) — sekin o'qiydigan
           o'quvchi peripheral harakatdan charchamasin. wv4 sinfi — to'rt variantli qator uchun. */
        .turn-wave::after { animation-name: turn-wave; animation-duration: 2.1s; animation-iteration-count: 4; }
        @keyframes turn-wave { 0%, 100% { opacity: 0; } 12% { opacity: 0.7; } 30% { opacity: 0; } }
        .turn-wave.w2::after { animation-delay: 0.7s; }
        .turn-wave.w3::after { animation-delay: 1.4s; }
        .turn-wave.wv4::after { animation-duration: 2.8s; }
        .turn-wave.wv4.w4::after { animation-delay: 2.1s; }
        /* Navbat YURISHI: bitta qadam — paydo bo'ladi, turadi, so'nadi (bir marta). */
        .turn-step::after { animation-name: turn-step; animation-duration: 1.3s; animation-iteration-count: 1; }
        @keyframes turn-step { 0% { opacity: 0; } 20% { opacity: 0.68; } 78% { opacity: 0.68; } 100% { opacity: 0; } }
        /* Kiritish maydoni ::after qabul qilmaydi — halqa o'rovchi qatlamga qo'yiladi (layout o'zgarmaydi). */
        @media (prefers-reduced-motion: reduce) { .turn-hint, .turn-ring::after { animation: none; } .turn-ring::after { opacity: 0; } }
        .btn-ghost { font-family: 'Manrope', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.2s; background: transparent; color: ${T.ink}; border: none; border-radius: 12px; box-shadow: none; }
        .btn-ghost:hover:not(:disabled) { background: ${T.paper}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.18); }
        .btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; box-shadow: inset 0 0 0 1px ${T.line}; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .btn-soft:disabled { opacity: 0.5; cursor: not-allowed; }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FBFAFE; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.34) !important; } /* xato tanlov ayblamaydi — binafsha (PmLesson2, F-0924-06) */

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        /* Zaxira (F-0924, B2 dizayn naqshi): mentor surati katta (1,6 MB) va sekin yuklanadi — yuklanguncha yoki umuman kelmasa
           doira bo'sh qolmasin: fonda xuddi shu robotning soddalashgan yuzi (ekran + ikki ko'z + tana). Surat yuklangach
           shaffof bo'lmagan qismi yuzni aynan yopadi, shuning uchun ikkalasi ustma-ust chiqmaydi. */
        .mentor-ava { background:
          radial-gradient(circle at 39% 34%, ${T.blueSoft} 0 6%, transparent 7%),
          radial-gradient(circle at 61% 34%, ${T.blueSoft} 0 6%, transparent 7%),
          radial-gradient(ellipse 27% 20% at 50% 35%, ${T.ink} 0 94%, transparent 100%),
          radial-gradient(ellipse 34% 27% at 50% 35%, ${T.paper} 0 94%, transparent 100%),
          radial-gradient(ellipse 30% 24% at 50% 100%, ${T.ink2} 0 94%, transparent 100%),
          ${T.accentSoft}; }
        .mentor-ava img { position: relative; }
        .mentor-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
        .mentor-name { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: ${T.accent}; letter-spacing: 0.01em; }
        .mentor-msg { background: ${T.paper}; border-radius: 4px 14px 14px 14px; padding: 13px 16px; color: ${T.ink}; box-shadow: 0 6px 18px -6px rgba(${T.shadowBase},0.16); }
        .mentor-mob .mentor-msg { overflow: hidden; max-height: 360px; transition: max-height 0.38s cubic-bezier(.4,0,.2,1), opacity 0.25s ease, padding 0.38s ease, box-shadow 0.3s ease; }
        .mentor-mob.is-collapsed { align-items: center; cursor: pointer; }
        .mentor-mob.is-collapsed .mentor-col { gap: 0; }
        .mentor-mob.is-collapsed .mentor-msg { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; box-shadow: none; }
        .mentor-cue { font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.accent}; letter-spacing: 0.01em; }

        /* === MENTORGA ESLATMA (faqat mentor-rejim) === */
        .mnote { background: ${T.blueSoft}; border-radius: 12px; padding: 12px 15px; display: flex; flex-direction: column; gap: 5px; cursor: pointer; }
        .mnote-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.blue}; display: flex; align-items: center; }
        .mnote-x { margin-left: auto; font-weight: 800; font-size: 10.5px; opacity: 0.7; text-transform: none; letter-spacing: 0; }
        /* Proyektor-sir: yopiq holatda xira chip (LiveBadge oilasi) — o'quvchi diqqatini tortmaydi */
        .mnote-chip { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; background: ${T.paper}; border: 1.5px dashed ${T.blue}; color: ${T.blue}; border-radius: 999px; padding: 4px 12px; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.04em; cursor: pointer; opacity: 0.4; transition: opacity 0.2s ease, transform 0.2s ease; }
        .mnote-chip:hover, .mnote-chip:focus-visible { opacity: 1; transform: translateY(-1px); }
        @media (hover: none) { .mnote-chip { opacity: 0.6; } }
        .mnote-body { margin: 0; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.45; }
        /* MENTOR-DOK (B4/B5/B6 naqshi AYNAN · B7 tekshiruvchi R2 25.09): mentor rejimining qo'shimchalari — «Kim bajardi» paneli va
           «Eslatma» chipi — pastki navigatsiya qatorining bo'sh o'rtasida turadi. Ekran mazmuni o'quvchi ko'rinishi bilan bir xil
           balandlikda qoladi (1280x800, TopBar bilan: aylantirish yo'q), chip esa har ekranda bir joyda — «Orqaga» yonida.
           O'quvchi va mustaqil rejimda dok bo'sh bo'ladi va joy egallamaydi. Ochilgan eslatma qator ustida suzuvchi karta bo'lib chiqadi. */
        .nav-mdock { position: relative; flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 10px; }
        .nav-mdock:empty { display: none; }
        @media (min-width: 761px) { .stage-nav:has(> .nav-mdock:not(:empty)) > button { flex-shrink: 0; white-space: nowrap; } }
        .nav-mdock > .mnote-chip { order: -1; align-self: center; flex-shrink: 0; opacity: 0.55; }
        .nav-mdock > .mnote-chip:hover, .nav-mdock > .mnote-chip:focus-visible { opacity: 1; }
        .nav-mdock > .lp-mstats { flex: 0 1 auto; min-width: 0; flex-direction: row; align-items: center; gap: 10px; padding: 7px 14px; border-radius: 99px; }
        .nav-mdock > .lp-mstats > .card-lbl { margin: 0; flex-shrink: 0; white-space: nowrap; font-size: 12.5px; }
        .nav-mdock > .lp-mstats > p { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
        .nav-mdock > .lp-mstats > div { flex-wrap: nowrap !important; min-width: 0; overflow-x: auto; scrollbar-width: thin; }
        .nav-mdock > .lp-mstats .mstats-wait-chip { flex-shrink: 0; white-space: nowrap; }
        .nav-mdock > .mnote { position: absolute; left: 0; bottom: calc(100% + 12px); width: min(560px, 100%); z-index: 40; box-shadow: 0 16px 36px -14px rgba(${T.shadowBase},0.42); }
        /* O'quvchi sinf-pulsi (45-qonun) shu dokda — mentor paneli bilan bir o'rin; mazmun balandligini olmaydi (B5/B6 naqshi, D1 25.09) */
        .nav-mdock > .sp-pulse { align-self: center; flex: 0 1 auto; min-width: 0; flex-wrap: wrap; row-gap: 2px; padding: 7px 14px; line-height: 1.3; }
        @media (max-width: 760px) {
          .stage-nav:has(> .nav-mdock:not(:empty)) { flex-wrap: wrap; row-gap: 8px; }
          .nav-mdock { order: -1; flex-basis: 100%; }
          .nav-mdock > .mnote { width: 100%; }
        }

        /* === HOOK v3: xabar-almashtirgich + radio-variantlar (PmLesson2 andozasi) === */
        .hk-opt { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(12px,1.8vw,15px) clamp(14px,2vw,17px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13.5px,1.6vw,15px); color: ${T.ink}; cursor: pointer; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16); transition: all 0.16s; }
        .hk-opt:hover:not(:disabled):not(.on) { transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .hk-opt.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hk-opt:disabled { cursor: default; }
        .hk-radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hk-opt.on .hk-radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .hk-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        @media (prefers-reduced-motion: reduce) { .hk-opt { transition: none; } }
        /* HOOK (1) imzo-vizuali (F-0924-04, pilot B1 hk-split): chapda telefon — kecha to'xtagan video, o'ngda savol-variantlar */
        .split.hk-split { grid-template-columns: minmax(0,1fr) minmax(0,1.15fr); align-items: center; }
        .hk-split .hk-opt { font-size: clamp(14px,1.7vw,16px); padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); }
        .hk-in { animation: hk-fade 0.45s ease-out 0.12s both; min-width: 0; }
        @keyframes hk-fade { from { opacity: 0; } to { opacity: 1; } }
        .hk-ph { position: relative; width: min(290px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 9px; border-radius: 32px; padding: 26px 14px 18px; background: ${T.paper}; box-shadow: inset 0 0 0 2px ${T.line}, 0 0 0 6px ${T.paper}, 0 0 0 7.5px ${T.line}, 0 22px 44px -22px rgba(${T.shadowBase},0.5); min-width: 0; }
        .hk-ph-time { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        .hk-t-n, .hk-t-m { border-radius: 99px; padding: 3px 9px; background: ${T.bg}; }
        .hk-t-n { animation: hk-dim 0.5s ease-out 2.9s both; }
        .hk-t-m { background: ${T.accentSoft}; color: ${T.accent}; animation: hk-fade 0.5s ease-out 3s both; }
        .hk-t-ar { color: ${T.ink3}; animation: hk-fade 0.5s ease-out 2.7s both; }
        .hk-ph-vid { position: relative; overflow: hidden; height: clamp(110px,14vw,140px); border-radius: 14px; background: linear-gradient(135deg, ${T.accentSoft}, ${T.blueSoft}); display: flex; align-items: center; justify-content: center; }
        .hk-ph-ball { position: absolute; left: 14%; bottom: 16%; font-size: 26px; line-height: 1; animation: hk-roll 1.5s cubic-bezier(.3,.6,.3,1) 0.3s both; }
        .hk-ph-play { font-size: 30px; color: ${T.accent}; animation: hk-pop 0.35s cubic-bezier(.2,.7,.2,1.4) 1.8s both; }
        .hk-ph-tc { position: absolute; right: 8px; bottom: 8px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 10.5px; font-weight: 700; color: ${T.ink}; background: rgba(255,255,255,0.82); border-radius: 6px; padding: 2px 6px; }
        /* Tun: ekran bir lahza qorayadi (telefon o'chdi), ertalab yana yonadi — shaffoflik bilan, rang tokenidan */
        .hk-night { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: ${T.ink}; opacity: 0; animation: hk-night 1.3s ease-in-out 2.1s both; }
        .hk-zz { font-size: 24px; }
        .hk-ph-prog { position: relative; height: 5px; border-radius: 99px; background: ${T.line}; margin: 26px 0 2px; }
        .hk-ph-prog i { display: block; width: 49%; height: 100%; background: ${T.accent}; border-radius: 99px; transform-origin: left; animation: hk-fill 1.5s cubic-bezier(.3,.6,.3,1) 0.3s both; }
        .hk-mark { position: absolute; left: 49%; top: 50%; width: 11px; height: 11px; margin: -5.5px 0 0 -5.5px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 0 3px ${T.paper}; animation: hk-fade 0.3s ease-out 1.8s both; }
        .hk-mark-t { position: absolute; left: 50%; bottom: 14px; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 5px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 2px 3px 2px 9px; white-space: nowrap; }
        .hk-ph-q { width: 20px; height: 20px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; animation: hk-pop 0.4s cubic-bezier(.2,.7,.2,1.4) 3.5s both, hk-ask 2.4s ease-in-out 4.2s infinite; }
        .hk-ph-meta { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .hk-ph-t { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13.5px; line-height: 1.3; color: ${T.ink}; overflow-wrap: anywhere; }
        .hk-ph-ch { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 11.5px; color: ${T.ink2}; overflow-wrap: anywhere; }
        @keyframes hk-pop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
        @keyframes hk-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes hk-roll { from { transform: translateX(-20px) rotate(-200deg); opacity: 0.4; } to { transform: none; opacity: 1; } }
        @keyframes hk-night { 0% { opacity: 0; } 30%, 65% { opacity: 0.9; } 100% { opacity: 0; } }
        @keyframes hk-dim { to { opacity: 0.55; } }
        @keyframes hk-ask { 0%, 100% { box-shadow: 0 0 0 0 rgba(91,61,230,0.45); } 50% { box-shadow: 0 0 0 7px rgba(91,61,230,0); } }
        @media (max-width: 760px) { .hk-ph { width: min(250px, 100%); } .hk-ph-vid { height: 96px; } }
        @media (prefers-reduced-motion: reduce) { .hk-in, .hk-t-n, .hk-t-m, .hk-t-ar, .hk-ph-q, .hk-ph-ball, .hk-ph-play, .hk-ph-prog i, .hk-mark, .hk-night { animation: none; } .hk-t-n { opacity: 0.55; } }
        .hvote { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,18px); box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }
        .hvote-row { display: flex; align-items: center; gap: 10px; }
        .hvote-lbl { flex: 0 0 clamp(120px,26vw,220px); font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; line-height: 1.3; color: ${T.ink2}; white-space: normal; overflow-wrap: anywhere; } /* javob matni to'liq ko'rinadi — «…» bilan kesilmaydi, kerak bo'lsa ikki qatorga o'tadi */
        .hvote-row.mine .hvote-lbl { color: ${T.accent}; }
        .hvote-track { flex: 1; height: 12px; border-radius: 99px; background: ${T.bg}; overflow: hidden; }
        .hvote-fill { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); transition: width 0.6s cubic-bezier(.2,.7,.2,1); }
        .hvote-row.top .hvote-fill { background: linear-gradient(90deg, ${T.success}, #0E8A55); }
        .hvote-pct { min-width: 38px; text-align: right; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        @media (prefers-reduced-motion: reduce) { .hvote-fill { transition: none; } }

        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }

        /* === STAGE === */
        .stage { max-width: 1100px; margin: 0 auto; height: calc((100dvh - var(--bo, 0px)) / var(--lz, 1)); display: flex; flex-direction: column; }
        .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(17px,3.4vw,34px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
        .stage-content.narrow { max-width: 680px; width: 100%; margin: 0 auto; }
        .stage-nav { flex-shrink: 0; background: ${T.bg}; border-top: 1px solid rgba(167,166,162,0.25); padding-top: clamp(12px,2vw,15px); padding-bottom: clamp(12px,2vw,15px); display: flex; gap: 12px; align-items: center; }
        .chrome { display: flex; align-items: center; justify-content: space-between; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 8px rgba(91,61,230,0.55); }
        .progress-track { height: 3px; background: rgba(167,166,162,0.25); width: 100%; margin-bottom: 12px; border-radius: 99px; }
        .progress-bar { height: 100%; background: ${T.accent}; transition: width 0.5s cubic-bezier(.4,0,.2,1); border-radius: 99px; box-shadow: 0 0 10px rgba(91,61,230,0.55), 0 0 3px rgba(91,61,230,0.4); }

        /* === FRAME === */
        .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(91,61,230,0.22); }
        .frame-success { background: ${T.successSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
        .frame-wait { background: ${T.blueSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

        /* === LAYOUT === */
        .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
        /* F-0725-04 · 60-qonun: kontent sig'masa ekran-bloklari SIQILMAYDI — stage-content skroll beradi.
           Standart flex-shrink tufayli bloklar bir-birining ustiga chiqib ketardi (klinika 11/17 dalili). */
        .screen > * { flex-shrink: 0; }
        .head { display: flex; flex-direction: column; gap: 6px; }
        .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(18px,3vw,36px); align-items: start; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }


        /* === YAKUN === */
        .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { position: relative; width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; flex-shrink: 0; }
        .done-chip .tick::after, .recap .ck::after, .lbl-ck::after { content: ''; position: absolute; left: 50%; top: 45%; width: 3.5px; height: 7px; border: solid #fff; border-width: 0 2px 2px 0; transform: translate(-50%,-50%) rotate(45deg); }
        .lbl-ck { position: relative; width: 16px; height: 16px; border-radius: 50%; background: ${T.success}; flex-shrink: 0; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { position: relative; flex-shrink: 0; width: 18px; height: 18px; margin-top: 1px; border-radius: 50%; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}66; padding: 0; }
        .recap .ck::after { border-color: ${T.success}; }
        /* === KEYS SLAYD (Netflix) === */
        .k-slide { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        /* F-0925-QA09: keys slaydi tepasidagi gradient chiziq olindi (foydalanuvchi tanlovi 1; Netflix slaydidagi qizil brend-chizig'i qoladi) */
        .k-slide-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(10px,1.3vw,12px); letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 14px; }
        .k-slide-ic { font-size: clamp(40px,7vw,64px); line-height: 1; }
        .k-slide-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(20px,3.2vw,30px); color: ${T.ink}; margin: 0; }
        .k-slide-body { font-size: clamp(15px,2vw,18px); color: ${T.ink2}; line-height: 1.55; max-width: 620px; margin: 0; } .k-slide-body b { color: ${T.ink}; }
        .k-dots { display: flex; gap: 8px; justify-content: center; }
        .k-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .k-dot.fill { background: ${T.ink3}; } .k-dot.cur { background: ${T.accent}; width: 26px; }

        /* === 🎲 KEYS-TAXMIN (s4) — slayd oldidan mikro-tikish; BALL EMAS, sof o'yin === */
        .kp-bet { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        /* F-0925-QA08: taxmin kartasi tepasidagi binafsha kesik chiziq olindi (foydalanuvchi: «siniq chiziq kerak emas», 7 dars) */
        .kp-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .kp-chip { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,16px); padding: 12px 18px; border-radius: 99px; border: none; background: ${T.bg}; color: ${T.ink}; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); transition: transform 0.16s, box-shadow 0.16s; }
        .kp-chip:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 10px 20px -8px rgba(${T.shadowBase},0.24); }
        /* press-holat: bosilganda ichkariga cho'kadi (tap affordance) */
        .kp-chip:active { transform: translateY(0) scale(0.94); box-shadow: inset 0 0 0 1.5px ${T.accent}, inset 0 3px 7px -3px rgba(${T.shadowBase},0.25); color: ${T.accent}; }
        .kp-ic { font-size: 19px; }
        .kp-chip.locked { cursor: default; transform: none; }
        .kp-chip.locked:hover { transform: none; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); }
        .kp-chip.correct { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
        .kp-chip.correct:hover { box-shadow: inset 0 0 0 2px ${T.success}; }
        .kp-chip.wrong { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; } /* taxmin — o'yin, xato emas: binafsha (pilot 1-band) */
        .kp-chip.wrong:hover { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .kp-chip.locked:not(.correct):not(.wrong) { opacity: 0.5; }
        .kp-mark { font-weight: 900; font-size: 15px; }
        /* === TEST-SAVOL (idea_oll tartibi): katta savol + toza kartochka === */
        /* TEST (F-0924-06): PmLesson2 savol-qolipi — bitta ustun, tanlagach ixcham (izoh ichki aylantirishsiz sig'adi). Pilot B1/B3 naqshi.
           Ikki ustunli variant olib tashlandi: 7 bridge darsida test bir xil ko'rinadi. */
        .stage-content.narrow:has(> .screen.qs) { max-width: 800px; }
        .screen.qs.qs-on { gap: clamp(12px,1.6vw,16px) !important; }
        .screen.qs .feedback-block.visible { margin-top: 0; }
        .screen.qs .feedback-block .frame-success, .screen.qs .feedback-block .frame-soft, .screen.qs .feedback-block .frame-wait { padding: clamp(11px,1.6vw,14px) clamp(14px,2vw,18px); }
        @media (min-width: 761px) {
          .lesson-root .stage-content:has(> .screen.qs.qs-on) { padding-bottom: 14px; }
          .screen.qs.qs-on .h-ask { font-size: clamp(18px,2.3vw,24px); }
          .screen.qs.qs-on .option { line-height: 1.38; }
          .screen.qs.qs-on .tq { gap: 6px; }
        }
        .tq { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .tq-lead { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(14.5px,1.8vw,16px); line-height: 1.5; color: ${T.ink2}; }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; margin: 0; color: ${T.ink}; }
        .kp-sub { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; }
        /* taxmin natijasi: topdi = yashil · topmadi = NEYTRAL indigo (qizil EMAS — bu ball emas, o'yin) */
        /* 🔴 F-0803-27 — klass IKKI marta ataylab: bu <p>, «.lesson-root p { padding:0 }» reseti
           esa aniqligi (0,1,1) bilan bitta-klassli qoidadan kuchli va padding'ni jimgina
           o'chiradi (99px burchakli «pill» yassilanib qoladi). Ikkilantirish (0,2,0) beradi. */
        .kp-res.kp-res { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 99px; padding: 5px 13px; animation: fade-step 0.3s ease-out; }
        .kp-res.hit { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .kp-res.miss { color: ${T.accent}; background: ${T.accentSoft}; }
        /* reveal: yumshoq indigo glow-to'lqin */
        .k-slide.revealed { animation: fade-step 0.3s ease-out, kp-glow 0.9s ease-out; }
        @keyframes kp-glow { 0% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24), 0 0 0 0 rgba(91,61,230,0.4); } 70% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24), 0 0 0 16px rgba(91,61,230,0); } 100% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); } }
        @media (prefers-reduced-motion: reduce) { .kp-chip, .kp-chip:hover, .kp-chip:active { transition: none; transform: none; } .k-slide.revealed, .kp-res { animation: none; } }
        /* KEYS (4): taxmindan keyin ixcham (pilot B3) · slayd ichidagi boshqaruv (PmLesson1 k-nav) · chapda maket, o'ngda matn */
        .kp-bet.done { padding: 12px 16px; gap: 8px; }
        .kp-bet.done > .k-slide-eyebrow, .kp-bet.done > .kp-ask { display: none; }
        .kp-bet.done .kp-chip { padding-top: 7px; padding-bottom: 7px; font-size: 13.5px; }
        .k-nav { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 4px; }
        .k-prev.btn-soft { padding: 9px 16px; font-size: 13.5px; border-radius: 10px; }
        .k-next { border: none; border-radius: 10px; padding: 9px 18px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13.5px; cursor: pointer; }
        .k-fig { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; min-width: 0; }
        .k-slide.ph { padding: clamp(18px,2.6vw,26px) clamp(18px,3vw,30px); min-height: clamp(190px,26vh,230px); display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.15fr); column-gap: clamp(16px,2.5vw,28px); row-gap: 8px; align-items: center; text-align: left; }
        .k-slide.ph > .k-fig { grid-column: 1; grid-row: 1 / span 4; }
        .k-slide.ph > :not(.k-fig) { grid-column: 2; justify-self: start; }
        .k-slide.ph .k-nav { justify-content: flex-start; }
        @media (max-width: 760px) { .k-slide.ph { display: flex; flex-direction: column; text-align: center; } .k-slide.ph > :not(.k-fig) { justify-self: auto; } }
        @media (min-width: 761px) { .lesson-root .screen.dense .k-slide.ph { min-height: 0; padding: 13px clamp(18px,3vw,28px); row-gap: 6px; } .lesson-root .screen.dense .kp-bet.done { padding: 8px 16px; row-gap: 6px; flex-direction: row; flex-wrap: wrap; justify-content: center; column-gap: 12px; } .lesson-root .screen.dense .kp-bet.done .kp-chips { gap: 8px; } }
        /* NfMock — PmLesson11 2970-2978 dan AYNAN (Netflix-ekran ataylab qorong'i: ikki rejimda bir xil) */
        .nf-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%; }
        .nf-panes { display: flex; gap: clamp(8px,1.6vw,14px); justify-content: center; width: min(460px, 100%); }
        .nf-scr { flex: 1 1 0; min-width: 0; background: linear-gradient(168deg,#241F33,#141021); border-radius: 10px; padding: 9px 10px 11px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.4), inset 0 0 0 1px rgba(255,255,255,0.07); }
        .nf-top { display: flex; flex-direction: column; gap: 2px; text-align: left; }
        .nf-who { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(11px,1.4vw,12.5px); color: #EFEDF7; letter-spacing: 0.02em; }
        .nf-seen { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(9px,1.1vw,10px); color: #8E88A8; }
        .nf-row { display: flex; gap: 5px; }
        .nf-tile { flex: 1 1 0; min-width: 0; aspect-ratio: 2 / 3; border-radius: 5px; background: linear-gradient(160deg,#4C4468,#312A45); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 3px; font-style: normal; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06); }
        .nf-em { font-size: clamp(15px,2.4vw,21px); line-height: 1; }
        .nf-nm { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(8px,0.85vw,9.5px); line-height: 1.15; color: #EFEDF7; opacity: 0.86; text-align: center; word-break: normal; overflow-wrap: break-word; hyphens: manual; }
        .nf-rec { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(8.5px,0.95vw,10px); letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accentSoft}; opacity: 0.8; text-align: left; margin-bottom: -4px; }
        /* 2–3-slayd chizmasi: tavsiya/qidiruv ulushi (PM-STUDIA tokenlari) */
        .kx { display: flex; flex-direction: column; gap: 7px; width: min(400px, 100%); }
        .kx-bar { display: flex; height: 38px; border-radius: 10px; overflow: hidden; box-shadow: inset 0 0 0 1.5px ${T.line}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 13px; }
        .kx-a { flex: 0 0 80%; display: flex; align-items: center; justify-content: center; background: linear-gradient(90deg, ${T.accent}, ${T.accentVivid}); color: #fff; transform-origin: left; animation: kx-grow 0.8s cubic-bezier(.3,.7,.3,1) 0.15s both; }
        .kx-b { flex: 1; display: flex; align-items: center; justify-content: center; background: ${T.bg}; color: ${T.ink2}; }
        .kx-lg { display: flex; justify-content: space-between; gap: 10px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12px; color: ${T.ink2}; }
        .kx-la { color: ${T.accent}; }
        .kx-five { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 7px; }
        .kx-c { height: 46px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 21px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; animation: mm-in 0.35s ease-out var(--d) both; }
        .kx-c.a { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
        @keyframes kx-grow { from { transform: scaleX(0.1); } to { transform: none; } }
        @media (prefers-reduced-motion: reduce) { .kx-a, .kx-c { animation: none; } }
        /* F-0925-B26 · NETFLIX USLUBI (faqat 4-ekran slaydi): qora fon, qizil urg'u, oq matn. Ichki chizmalar shu palitraga o'tadi. */
        .k-slide.nf-theme { box-shadow: 0 18px 40px -18px rgba(0,0,0,0.55); }
        /* F-0925-QA37: Netflix slaydi tepasidagi qizil brend-chizig'i ham olindi — QA09 istisnosi bekor (brend «NETFLIX» so'zi va qizil tugmada qoladi) */
        .nf-brand { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(22px,3vw,30px); letter-spacing: 0.02em; color: #E50914; line-height: 1; transform: scaleY(1.18); transform-origin: left center; margin-bottom: 2px; }
        .nf-theme .k-slide-eyebrow { color: #fff; background: rgba(229,9,20,0.22); }
        .nf-theme .k-slide-body { color: #E6E6E6; } .nf-theme .k-slide-body b { color: #fff; }
        .nf-theme .k-prev.btn-soft { background: rgba(255,255,255,0.08); color: #fff; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18); }
        .nf-theme .k-prev.btn-soft:disabled { opacity: 0.35; }
        .nf-theme .k-dot { background: rgba(255,255,255,0.25); } .nf-theme .k-dot.fill { background: rgba(255,255,255,0.55); } .nf-theme .k-dot.cur { background: #E50914; }
        .nf-theme .k-next { background: #E50914; }
        .nf-theme .nf-scr { background: #1F1F1F; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08); }
        .nf-theme .nf-tile { background: #2F2F2F; }
        .nf-theme .nf-rec { color: #E50914; opacity: 1; }
        .nf-theme .nf-note { color: #B3B3B3; }
        .nf-theme .kx-bar { box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15); }
        .nf-theme .kx-a { background: #E50914; }
        .nf-theme .kx-b { background: #2F2F2F; color: #E6E6E6; }
        .nf-theme .kx-lg { color: #B3B3B3; } .nf-theme .kx-la { color: #FF4B55; }
        .nf-theme .kx-c { background: #2F2F2F; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12); }
        .nf-theme .kx-c.a { background: rgba(229,9,20,0.25); box-shadow: inset 0 0 0 1.5px #E50914; }
        .nf-note { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(10px,1.2vw,11.5px); color: ${T.ink3}; margin: 0; }

        @keyframes lp-check-pop { 0% { transform: scale(0.7); } 45% { transform: scale(1.3); } 100% { transform: scale(1); } }

        /* === YORDAM (ochiladigan) === */
        /* 31-qonun: «kim bajaradi» yozuvi (faqat mentor ko'radi) */

        /* muvaffaqiyat = ixcham chip (paragraf-ramka EMAS) */
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }

        /* === 🔤 KOD-ATAMA CHIP (fmtCode) === */
        .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }

        /* === 🛠️ JONLI PRAKTIKA (self-report) === */
        .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 6px; }

        /* === 🏅 ACHIEVEMENTS — hisoblagich + bayram === */
        .ach-cnt-wrap { position: relative; }
        .ach-counter { display: inline-flex; align-items: center; gap: 4px; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 99px; padding: 5px 11px 5px 9px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink2}; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; }
        .ach-counter.has { border-color: ${T.accent}66; }
        .ach-counter:hover { border-color: ${T.accent}; box-shadow: 0 6px 16px -8px rgba(91,61,230,0.4); }
        .ach-counter b { color: ${T.accent}; font-size: 14px; font-variant-numeric: tabular-nums; }
        .ach-cnt-tot { color: ${T.ink3}; font-size: 11.5px; }
        .ach-cnt-ic { font-size: 14px; }
        .ach-counter.bump { animation: ach-bump 0.8s cubic-bezier(.34,1.6,.4,1); }
        @keyframes ach-bump { 0% { transform: scale(1); } 30% { transform: scale(1.35) rotate(-6deg); box-shadow: 0 0 0 6px rgba(91,61,230,0.18); } 60% { transform: scale(0.96) rotate(3deg); } 100% { transform: scale(1) rotate(0); box-shadow: 0 0 0 0 rgba(91,61,230,0); } }
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
        .ach-badge.got:hover { transform: translateY(-3px); }
        .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line}; opacity: 0.75; }
        .ach-badge-ic { font-size: 30px; line-height: 1; }
        .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 22px; }
        .ach-badge-ic.lock { position: relative; width: 18px; height: 22px; filter: none; opacity: 1; }
        .ach-badge-ic.lock::before { content: ''; position: absolute; left: 3px; top: 0; width: 12px; height: 12px; border-radius: 7px 7px 0 0; box-shadow: inset 0 0 0 2.5px ${T.ink3}; }
        .ach-badge-ic.lock::after { content: ''; position: absolute; left: 0; bottom: 0; width: 18px; height: 13px; border-radius: 4px; background: ${T.ink3}; }
        .ach-badge-name { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
        .ach-coll .ach-badge { flex-direction: row; justify-content: center; gap: 9px; padding: 11px 10px; }
        .ach-coll .ach-badge-ic { font-size: 22px; flex-shrink: 0; } /* qulf-belgi (bo'sh span) qisilib, matn ustiga chiqmasin — B6 naqshi */
        .ach-badge.locked .ach-badge-name { color: ${T.ink3}; }
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
        @media (prefers-reduced-motion: reduce) { .acu-rays, .acu-medal, .acu-glow, .acu-tap { animation-iteration-count: 1 !important; } .acu-rays { animation: acu-fade 0.4s both !important; } }

        /* === Konfetti === */
        .confetti { position: fixed; inset: 0; pointer-events: none; z-index: 1200; overflow: hidden; }
        .confetti-bit { position: absolute; top: -24px; opacity: 0; will-change: transform, opacity; animation-name: confetti-fall; animation-timing-function: cubic-bezier(.25,.6,.45,1); animation-iteration-count: 1; animation-fill-mode: forwards; box-shadow: 0 2px 6px -2px rgba(${T.shadowBase},0.3); }
        @keyframes confetti-fall { 0% { transform: translateY(-24px) rotate(0deg); opacity: 0; } 8% { opacity: 1; } 55% { transform: translateY(48vh) translateX(22px) rotate(320deg); } 100% { transform: translateY(104vh) translateX(-12px) rotate(680deg); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .confetti { display: none; } }

        /* === 🏆 PODIUM === */
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
        /* podium SOLO-ko'rinishi: shaxsiy progress — nishonlar + daftar-holati */
        .pod-solo { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
        .pod-solo-sec { background: ${T.paper}; border-radius: 14px; padding: 12px 18px; display: flex; flex-direction: column; align-items: center; gap: 8px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.16); }
        .pod-solo-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
        .pod-solo-badges { display: flex; gap: 9px; align-items: center; }
        .pod-solo-b { font-size: 24px; line-height: 1; }
        .pod-solo-b:not(.got) { filter: grayscale(1) opacity(0.45); font-size: 18px; }

        /* === ⚡ CODE STRIKE — CTA neon-kapsula (arena STRUKTURASI ⚡ Jonliniki) === */
        .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }
        .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
        /* Yakun-ekran CTA ixcham: so'z kattaligi o'zgarmaydi, faqat kapsula bo'sh joyi qisqaradi
           («Mentorni kuting»dan keyin joy qolib qalin ko'rinmasin — image copy.png etaloni) */
        .cs-cta .cs-cap { padding: clamp(14px,2vw,24px) clamp(22px,3.2vw,40px); gap: clamp(4px,0.7vw,8px); }
        @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
        .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
          gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px;
          background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%);
          border: 1.5px solid rgba(186,140,255,0.72);
          box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32);
          animation: cs-ignite 1.5s ease-out both, cs-breathe 3.8s ease-in-out 1.5s infinite; }
        @keyframes cs-ignite { 0% { opacity: .22; filter: saturate(.25) brightness(.55); box-shadow: none; } 32% { opacity: .3; filter: saturate(.3) brightness(.6); box-shadow: none; } 38% { opacity: 1; filter: none; } 44% { opacity: .38; filter: saturate(.4) brightness(.65); } 51% { opacity: 1; filter: none; } 57% { opacity: .55; filter: saturate(.5) brightness(.75); } 66%, 100% { opacity: 1; filter: none; } }
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
        .cs-word { position: relative; z-index: 2; display: inline-block; font-family: 'Manrope','Manrope Fallback',sans-serif; font-weight: 900; font-style: italic; font-size: clamp(30px,6.2vw,72px); letter-spacing: .015em; line-height: 1.06; white-space: nowrap; padding-right: .06em; background: linear-gradient(180deg,#FFFFFF 10%,#E4D6FF 46%,#A97CFF 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; animation: cs-wglow 2.8s ease-in-out infinite; }
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
        .cs-clickable:active { transform: scale(.99); }
        .cs-clickable:focus-visible { outline: 2px dashed rgba(186,140,255,.8); outline-offset: 6px; }
        .cs-off { filter: saturate(.45) brightness(.74); animation: cs-ignite 1.5s ease-out both, cs-breathe 6.5s ease-in-out 1.5s infinite; }
        .cs-off .cs-ring, .cs-off .cs-thunder { display: none; }
        .cs-live { animation: cs-ignite 1.2s ease-out both, cs-breathe 1.7s ease-in-out 1.2s infinite; }
        .cs-livedot { position: absolute; top: clamp(12px,1.8vw,20px); right: clamp(18px,3vw,30px); z-index: 4; display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; letter-spacing: .18em; color: #7CFFB1; text-shadow: 0 0 10px rgba(60,255,150,.7); }
        .cs-livedot i { width: 8px; height: 8px; border-radius: 50%; background: #3CFF8E; box-shadow: 0 0 10px #3CFF8E; animation: cs-liveblink 1.1s ease-in-out infinite; }
        @keyframes cs-liveblink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        .cs-charging { animation: cs-charge .45s ease-in forwards !important; }
        @keyframes cs-charge { to { transform: scale(1.05); filter: brightness(1.75) saturate(1.35); } }
        .cs-portal { position: fixed; inset: 0; z-index: 10400; pointer-events: none; background: radial-gradient(52% 52% at 50% 55%, rgba(210,180,255,.95), rgba(124,58,237,.55) 42%, transparent 76%); animation: cs-portal-in .9s ease-in-out both; }
        @keyframes cs-portal-in { 0% { opacity: 0; transform: scale(.55); } 48% { opacity: 1; transform: scale(1.35); } 100% { opacity: 0; transform: scale(1.7); } }
        @media (prefers-reduced-motion: reduce) { .cs-cap, .cs-ring, .cs-tok, .cs-dash, .cs-thunder, .cs-word, .cs-word::before, .csn-bolt, .cs-spark, .cs-enter, .cs-livedot i, .cs-hud-i, .cs-portal { animation: none !important; } }
        @media (max-width: 560px) { .cs-word { font-size: clamp(26px,9vw,50px); } .cs-cap { border-radius: 40px; padding: 22px 18px; } .cs-livedot { top: 10px; right: 14px; } }

        /* === Kahoot-kutish holatlari === */
        .option-wait { background: ${T.blueSoft} !important; color: ${T.blue} !important; box-shadow: inset 0 0 0 2px ${T.blue}, 0 8px 22px -8px rgba(1,154,203,0.3) !important; }

        /* === MENTOR STATISTIKASI === */
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
        /* ===== ⚡ ARENA ===== */
        .qz-arena { position: fixed; inset: 0; z-index: 10500; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: clamp(18px,4vw,44px) clamp(12px,3vw,32px); background: radial-gradient(62% 46% at 10% 6%, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0) 56%), radial-gradient(58% 48% at 92% 12%, rgba(15,166,214,0.14) 0%, rgba(15,166,214,0) 55%), radial-gradient(70% 52% at 78% 104%, rgba(255,79,40,0.14) 0%, rgba(255,79,40,0) 60%), radial-gradient(90% 55% at 50% -8%, #26123F 0%, rgba(38,18,63,0) 54%), #140B30; }
        .qz-arena::before { content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: radial-gradient(rgba(190,150,255,0.08) 1.1px, transparent 1.2px); background-size: 24px 24px; -webkit-mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); mask-image: radial-gradient(120% 90% at 50% 20%, #000 40%, transparent 82%); }
        .qz-bg { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .qz-shp { position: absolute; line-height: 1; user-select: none; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; text-shadow: 0 0 16px rgba(150,95,255,0.35); animation: qz-drift ease-in-out infinite; will-change: transform; color: rgba(203,173,255,0.16); }
        @keyframes qz-drift { 0%,100% { transform: translate(0,0) rotate(-6deg) scale(1); } 50% { transform: translate(18px,-24px) rotate(6deg) scale(1.05); } }
        @media (prefers-reduced-motion: reduce) { .qz-shp { animation: none; } }
        .qz-x { position: fixed; top: 14px; right: 16px; z-index: 10600; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(186,140,255,0.34); background: rgba(255,255,255,0.06); color: #D9C9FF; font-size: 16px; cursor: pointer; box-shadow: 0 0 20px rgba(124,58,237,0.22); backdrop-filter: blur(6px); transition: transform 0.25s, color 0.2s, background 0.2s; }
        .qz-x:hover { color: #F2ECFF; background: rgba(255,255,255,0.12); transform: rotate(90deg); }
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
        .qz-tile:hover:not(:disabled):not(.rv) { transform: translateY(-3px); }
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
        .qz-tile .qcode { background: rgba(255,255,255,0.25); color: #fff; }
        .qz-q .qcode { background: rgba(203,173,255,0.18); color: #F2ECFF; }
        .qz-fx { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }

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
  @keyframes sg-bar { 0% { transform: scaleY(0.3); } 100% { transform: none; } }

  .kp-ask { font-size: clamp(16px,2.2vw,20px) !important; line-height: 1.45; max-width: 640px; }
  @keyframes gb-pop { 0% { transform: scale(0.8); } 60% { transform: scale(1.06); } 100% { transform: none; } }

  .ic-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
  .pw-f { display: flex; flex-direction: column; gap: 5px; min-width: 0; position: relative; }
  .pw-f > span { font-family: 'Manrope'; font-weight: 800; font-size: 13px; }
  .pw-f input, .pw-f textarea { width: 100%; min-width: 0; font-family: 'Manrope'; font-size: 15px; color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 11px; padding: 11px 13px; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; transition: box-shadow 0.15s; }
  .pw-f input:focus, .pw-f textarea:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
  .pw-f.on input, .pw-f.on textarea { box-shadow: inset 0 0 0 1.5px ${T.success}88; }
  .pw-f input:disabled { opacity: 0.55; }
  /* 15-ekran qavat-gapi maydoni: bo'sh turganda namuna to'liq o'raladi (ikki-uch qator); yozish paytida gap ham to'liq ko'rinadi
     (ko'pi bilan uch qator, ortig'i ichida aylanadi). Maydondan chiqilgach yozilgan gap avvalgi bir qatorli maydon kabi bitta
     qatorda turadi — kasbiy so'z maslahatlari chiqqan holatda ekran avvalgidan balandlashmaydi (58-qonun). */
  .pw-f textarea.qv-ta { display: block; resize: none; field-sizing: content; line-height: 1.4; min-height: calc(1.4em + 22px); max-height: calc(4.2em + 22px); overflow-y: auto; }
  .pw-f textarea.qv-ta:not(:focus):not(:placeholder-shown) { white-space: pre; overflow: hidden; }
  /* Bo'sh maydonda namuna uch qatorga sig'masa ham to'liq ko'rinsin (Dizayn R2: 390px va 768px kenglikda RU 1-namunaning oxirgi
     qatori kesilardi). 1280/1440 da namuna ko'pi bilan uch qator — u yerda o'zgarish yo'q. */
  .pw-f textarea.qv-ta:placeholder-shown { max-height: none; }
  /* field-sizing qo'llanmaydigan brauzer (Firefox 140 ESR tekshirildi, Dizayn R2 25.09): maydon o'z-o'zidan cho'zilmaydi va namuna
     bitta qatorda kesilardi. Bo'sh maydon uch qator bo'yida turadi — namuna to'liq ko'rinadi. Yozish boshlangach maydon avvalgi bir
     qatorli maydon kabi ishlaydi (gap o'ralmaydi, yozgan sari suriladi) — ikki qatorli gap bir qatorli qutida yarmi kesilib ko'rinmaydi. */
  @supports not (field-sizing: content) {
    .pw-f textarea.qv-ta:placeholder-shown { min-height: calc(4.2em + 22px); }
    .pw-f textarea.qv-ta:not(:placeholder-shown) { white-space: pre; overflow: hidden; }
  }
  .pw-f.turn-ring::after { inset: -4px; border-radius: 13px; }
  .pw-save { font-family: 'Manrope'; font-weight: 800; font-size: 14.5px; cursor: pointer; border: none; border-radius: 12px; padding: 11px 20px; background: ${T.accent}; color: #fff; box-shadow: 0 10px 22px -10px rgba(91,61,230,0.6); }
  .pw-save:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
  .ai-rule.ai-rule { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 13px; }
  .pod-me { display: flex; flex-direction: column; align-items: center; gap: 6px; align-self: center; background: ${T.paper}; border-radius: 20px; padding: 22px 38px; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.4); }
  .pod-me-medal { font-size: 46px; line-height: 1; }
  .pod-me-place { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(24px,4vw,32px); color: ${T.accent}; }
  .pod-me-score { font-size: 15px; color: ${T.ink2}; font-weight: 700; }
  @keyframes rv-halo { 0%, 100% { box-shadow: 0 0 0 0 rgba(91,61,230,0.0); } 50% { box-shadow: 0 0 0 6px rgba(91,61,230,0.14); } }
  @keyframes rv-snap { 0% { opacity: 0; transform: translateY(-8px) scale(0.92); } 100% { opacity: 1; transform: none; } }
  .pa-q-n { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center; }
  .sl-hint.sl-hint { margin: -4px 0 0; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 7px 10px; }
        .lead-note.lead-note { margin: 0; font-size: clamp(14px,1.7vw,16px); line-height: 1.5; color: ${T.ink2}; }
        .turn-wrap { display: block; position: relative; }
        .turn-wrap > .reflect-input { width: 100%; }
        .rcp-flow { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(12px,2vw,18px); align-items: stretch; }
        @media (max-width: 760px) { .rcp-flow { grid-template-columns: 1fr; } }
        .rcp-step { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 12px; }
        .rcp-step.wide { grid-column: 1 / -1; }
        .rcp-step-h { display: flex; gap: 11px; align-items: flex-start; }
        .rcp-n { width: 26px; height: 26px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 5px 12px -5px rgba(91,61,230,0.5), 0 0 0 3px ${T.accentSoft}; }
        .rcp-t { display: block; font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .reflect-input { font-family: 'Manrope'; font-size: 15px; color: ${T.ink}; border: none; border-radius: 10px; padding: 12px 14px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; }
        .reflect-input:focus { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        /* F-0925-B12 · YOZISH MAYDONI ko'rinib tursin (3/4-o'tish 2-darsi naqshi 22, barcha bridge darslariga): bo'sh maydon — kesik
           chiziqli rangli chegara + ✏️ qalamcha; navbat halqasi ichidagi bo'sh maydonda miltillovchi kursor (maydonning o'z fonida). */
        .lesson-root :is(input:not([type]), input[type="text"], textarea)::placeholder { color: ${T.ink2}; opacity: 0.85; }
        .lesson-root :is(input:not([type]), input[type="text"], textarea):placeholder-shown:not(:focus):not(:disabled):not([readonly]) { box-shadow: none; outline: 1.5px dashed ${T.accent}88; outline-offset: -1.5px; padding-right: 38px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235B3DE6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'/%3E%3Cpath d='M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; }
        .lesson-root textarea:placeholder-shown:not(:focus):not(:disabled):not([readonly]) { background-position: right 12px top 12px; }
        .lesson-root .turn-ring :is(input:not([type]), input[type="text"], textarea):placeholder-shown:not(:focus):not(:disabled):not([readonly]), .lesson-root :is(input:not([type]), input[type="text"], textarea).turn-ring:placeholder-shown:not(:focus):not(:disabled):not([readonly]) { text-indent: 8px; background-image: linear-gradient(${T.accent}, ${T.accent}), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235B3DE6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'/%3E%3Cpath d='M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'/%3E%3C/svg%3E"); background-position: 13px center, right 12px center; background-size: 2px 18px, 16px; animation: pw-caret 1.05s steps(1) infinite; }
        .lesson-root .turn-ring textarea:placeholder-shown:not(:focus):not(:disabled):not([readonly]), .lesson-root textarea.turn-ring:placeholder-shown:not(:focus):not(:disabled):not([readonly]) { background-position: 13px 12px, right 12px top 12px; }
        @keyframes pw-caret { 50% { background-size: 0 18px, 16px; } }
        @media (prefers-reduced-motion: reduce) { .lesson-root .turn-ring :is(input:not([type]), input[type="text"], textarea), .lesson-root :is(input:not([type]), input[type="text"], textarea).turn-ring { animation: none; } }
        .idea { display: flex; flex-direction: column; gap: 3px; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 10px 12px; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},0.2); transition: box-shadow 0.18s, transform 0.18s; }
        .idea:hover { transform: translateY(-1px); }
        .idea b { font-size: 13px; color: ${T.accent}; } .idea span { font-size: 13.5px; color: ${T.ink2}; line-height: 1.35; }
        .idea.on { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .ideas { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }

  /* === BRIDGE-B7: dars mexanikalari (maqsad-preview, xotira tugmalari, ikki tomon, e'lon konstruktori, uch qavat, tushunish chizig'i, ustaxonalar, AI-zaxira) === */
  .hint-line { font-family: 'Manrope'; font-weight: 600; font-size: 13px; color: ${T.ink2}; }
  .gq-replay { position: absolute; top: 8px; right: 10px; width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer; background: ${T.bg}; color: ${T.ink2}; font-size: 15px; z-index: 2; }
  .gq-replay:hover { color: ${T.accent}; }

  .gd { position: relative; display: flex; align-items: stretch; justify-content: center; flex-wrap: wrap; gap: clamp(14px,2.4vw,26px); background: ${T.paper}; border-radius: 18px; padding: clamp(22px,3.4vw,36px) clamp(16px,2.6vw,28px); box-shadow: 0 14px 34px -16px rgba(${T.shadowBase},0.32); min-width: 0; }
  .gd-cards { display: flex; flex-direction: column; gap: 10px; }
  .gd-col { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
  .gd-h { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.accent}; }
  .gd-h2 { opacity: 0; animation: gd-in 0.3s ease-out 2.9s forwards; }
  .gd-col > .gd-flow { margin: auto 0; }
  .gd > .gd-arrow.big { align-self: center; }
  /* Telefon: ① va ② ustma-ust, zanjir o'raladi, kartalar to'liq kenglikda */
  @media (max-width: 760px) { .gd > .gd-arrow.big { display: none; } .gd .gd-col { width: 100%; } .gd .gd-cards .gd-card { width: 100%; } .gd .gd-flow { flex-wrap: wrap; row-gap: 8px; } }
  .gd-card { position: relative; width: clamp(210px,24vw,260px); display: flex; align-items: center; gap: 10px; padding: 10px 78px 10px 14px; border-radius: 12px; background: ${T.bg}; opacity: 0; animation: gd-in 0.35s ease-out var(--fd, 0s) forwards; min-width: 0; }
  .gd-v { display: grid; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink}; }
  .gd-v > span { grid-area: 1 / 1; overflow-wrap: anywhere; }
  .gd-v.mono { font-size: 12.5px; }
  /* Yopiq karta: qulf tushgan lahzada raqam yulduzchaga almashadi — begona endi ko'rmaydi */
  .gd-mask { opacity: 0; color: ${T.accent}; animation: gd-in 0.3s ease-out var(--fl, 0s) forwards; }
  .gd-card.shut .gd-real { animation: gd-out 0.3s ease-out var(--fl, 0s) forwards; }
  @keyframes gd-out { to { opacity: 0; transform: translateY(-4px); } }
  .gd-card.shut { animation: gd-in 0.35s ease-out var(--fd, 0s) forwards, gd-shut 0.4s ease-out var(--fl, 0s) forwards; }
  @keyframes gd-shut { to { opacity: 1; background: ${T.accentSoft}; } }
  .gd-lock { position: absolute; right: 10px; top: 50%; transform: translateY(-50%) scale(0.4); font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; line-height: 1; padding: 5px 9px; border-radius: 99px; background: ${T.successSoft}; color: ${T.success}; opacity: 0; animation: gd-lock 0.35s cubic-bezier(.34,1.6,.4,1) var(--fd, 0s) forwards; }
  .gd-lock.shut { background: ${T.paper}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}55; }
  .gd-arrow { font-family: 'Manrope'; font-weight: 800; font-size: 18px; color: ${T.accent}; opacity: 0; animation: gd-in 0.3s ease-out var(--fd, 0s) forwards; }
  .gd-arrow.big { font-size: 26px; }
  .gd-flow { display: flex; align-items: center; gap: 10px; }
  .gd-btn { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: #fff; background: ${T.accent}; border-radius: 10px; padding: 9px 13px; white-space: nowrap; opacity: 0; animation: gd-in 0.3s ease-out var(--fd, 0s) forwards; }
  .gd-stage { border-radius: 12px; padding: 12px 13px; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; color: ${T.ink}; white-space: nowrap; background: ${T.bg}; opacity: 0; animation: gd-lit 0.9s ease-out var(--fd, 0s) forwards; }
  @keyframes gd-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  @keyframes gd-lock { to { opacity: 1; transform: translateY(-50%) scale(1); } }
  @keyframes gd-lit { 0% { opacity: 0; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1.08); background: ${T.accentSoft}; box-shadow: 0 0 0 5px ${T.accent}22; } 100% { opacity: 1; transform: none; background: ${T.successSoft}; box-shadow: inset 0 0 0 2px ${T.success}88; } }
  @media (prefers-reduced-motion: reduce) { .gd-card, .gd-arrow, .gd-btn, .gd-h2, .gd-stage, .gd-lock, .gd-mask, .gd-card.shut, .gd-card.shut .gd-real { animation: none; opacity: 1; } .gd-card.shut { background: ${T.accentSoft}; } .gd-card.shut .gd-real { opacity: 0; } .gd-lock { transform: translateY(-50%); } .gd-stage { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px ${T.success}88; } }
  /* Kompyuterda maket ekranning asosiy qismi — pastda bo'sh joy qolmasin (pilot 14-band «roomy»): kartalar va bosqichlar kattaroq */
  @media (min-width: 761px) {
    .gd { min-height: 300px; column-gap: 30px; }
    .gd-cards { gap: 13px; }
    .gd-card { width: 272px; padding: 13px 86px 13px 15px; gap: 12px; }
    .gd-v { font-size: 15.5px; } .gd-v.mono { font-size: 13.5px; }
    .gd-lock { font-size: 12.5px; right: 13px; }
    .gd-flow { gap: 12px; }
    .gd-stage { padding: 16px 15px; font-size: 14.5px; border-radius: 14px; }
    .gd-btn { font-size: 14px; padding: 11px 15px; }
    .gd-h { font-size: 13.5px; }
  }

  @keyframes mm-pop { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.12); opacity: 1; } 100% { transform: none; opacity: 1; } }
  @keyframes mm-in { 0% { opacity: 0; transform: translateY(-8px) scale(0.96); } 100% { opacity: 1; transform: none; } }
  @keyframes mm-tile { 0% { background: ${T.bg}; } 100% { background: linear-gradient(135deg, ${T.accentSoft}, ${T.blueSoft}); } }
  .mm-btn { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; border: none; cursor: pointer; background: ${T.paper}; border-radius: 12px; padding: 8px 12px 8px 8px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(14px,1.7vw,15.5px); color: ${T.ink}; box-shadow: inset 0 0 0 1px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.2); transition: transform 0.18s, box-shadow 0.2s, background 0.2s; min-width: 0; }
  .mm-btn:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px ${T.line}, 0 12px 22px -10px rgba(${T.shadowBase},0.3); }
  .mm-btn.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 10px 22px -12px rgba(91,61,230,0.4); }
  .mm-ic { width: 36px; height: 36px; border-radius: 10px; background: ${T.bg}; display: inline-flex; align-items: center; justify-content: center; font-size: 18px; line-height: 1; flex-shrink: 0; }
  .mm-btn.on .mm-ic { background: ${T.paper}; }
  .mm-t { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .mm-ck { flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; animation: mm-pop 0.3s ease-out; }
  .mm-ck.ok { background: ${T.successSoft}; color: ${T.success}; } .mm-ck.no { background: ${T.bg}; color: ${T.ink3}; }
  .mm-btn.turn-ring::after { border-radius: 12px; }
  .mm-phone { position: relative; width: min(320px, 100%); align-self: center; display: flex; flex-direction: column; gap: 8px; border-radius: 32px; padding: 24px 14px 14px; min-height: 250px; background: ${T.paper}; box-shadow: inset 0 0 0 2px ${T.line}, 0 0 0 6px ${T.paper}, 0 0 0 7.5px ${T.line}, 0 22px 44px -22px rgba(${T.shadowBase},0.5); min-width: 0; }
  .uz-notch { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 64px; height: 7px; border-radius: 99px; background: ${T.line}; }
  .mm-ph-h { display: flex; align-items: center; justify-content: space-between; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink3}; }
  .mm-ph-n { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; font-weight: 800; letter-spacing: 0; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 2px 8px; }
  .mm-empty { display: flex; flex-direction: column; gap: 8px; } .mm-empty i { display: block; height: 44px; border-radius: 12px; background: ${T.bg}; }
  .mm-sec { display: flex; flex-direction: column; gap: 6px; padding: 8px 11px; border-radius: 12px; background: ${T.bg}; transition: background 0.25s, box-shadow 0.25s; min-width: 0; animation: mm-in 0.35s ease-out; }
  .mm-sec.lit { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px ${T.success}; }
  .mm-sec-t { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; overflow-wrap: anywhere; }
  .mm-tiles { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 6px; }
  .mm-tiles i { position: relative; display: block; min-height: 18px; border-radius: 7px; background: linear-gradient(135deg, ${T.accentSoft}, ${T.blueSoft}); animation: mm-in 0.3s ease-out backwards; font-family: 'Manrope'; font-style: normal; font-weight: 700; font-size: 10.5px; line-height: 1.2; color: ${T.ink2}; text-align: center; padding: 3px 4px; overflow-wrap: anywhere; overflow: hidden; }
  .mm-tiles i.tc { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; padding-bottom: 6px; }
  .mm-tiles i.tc::after { content: ''; position: absolute; left: 0; bottom: 0; height: 3px; width: var(--p); background: ${T.accent}; border-radius: 0 99px 99px 0; }
  .mm-sec.lit .mm-tiles i { color: ${T.ink}; }
  .mm-list { display: flex; flex-direction: column; gap: 8px; }
  .mm-list.mini { flex-direction: row; flex-wrap: wrap; gap: 6px; }
  .mm-list.mini .mm-btn { width: auto; flex: 0 1 auto; gap: 7px; padding: 3px 9px 3px 3px; font-size: 13px; border-radius: 99px; animation: mm-in 0.3s ease-out; }
  .mm-list.mini .mm-ic { width: 26px; height: 26px; border-radius: 50%; font-size: 14px; }
  .mm-list.mini .mm-ck { width: 18px; height: 18px; font-size: 10px; }
  .mm-list.mini .mm-btn.turn-ring::after { border-radius: 99px; }
  .mm-tiles i:nth-child(2) { animation-delay: 0.1s; } .mm-tiles i:nth-child(3) { animation-delay: 0.2s; }
  .mm-tiles.ghost i { min-height: 14px; background: repeating-linear-gradient(135deg, ${T.bg} 0 5px, ${T.paper} 5px 10px); box-shadow: inset 0 0 0 1.5px ${T.line}; animation: none; }
  .mm-none { display: flex; flex-direction: column; gap: 8px; border: 2px dashed ${T.ink3}88; border-radius: 12px; padding: 10px 11px; background: ${T.paper}; animation: mm-in 0.3s ease-out; min-width: 0; }
  .mm-none-t { display: flex; align-items: flex-start; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; line-height: 1.4; color: ${T.ink2}; overflow-wrap: anywhere; }
  .mm-none-ic { flex-shrink: 0; font-size: 15px; line-height: 1.2; filter: grayscale(1); opacity: 0.7; }
  @media (prefers-reduced-motion: reduce) { .mm-btn, .mm-sec { transition: none; } .mm-btn:hover { transform: none; } .mm-ck, .mm-sec, .mm-tiles i, .mm-none, .mm-list.mini .mm-btn { animation: none; } }

  .ws-pile { display: flex; flex-direction: column; gap: 8px; }
  .ws-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .ws-chip { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.6vw,14.5px); border: none; cursor: pointer; border-radius: 99px; padding: 6px 15px 6px 7px; background: ${T.paper}; color: ${T.ink}; box-shadow: inset 0 0 0 1px ${T.line}, 0 6px 14px -8px rgba(${T.shadowBase},0.3); min-width: 0; overflow-wrap: anywhere; text-align: left; transition: transform 0.18s, box-shadow 0.2s, background 0.2s; }
  .ws-chip:hover { transform: translateY(-2px); }
  .ws-chip-ic { width: 26px; height: 26px; border-radius: 50%; background: ${T.bg}; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .ws-chip.on { background: ${T.accent}; color: #fff; transform: translateY(-2px); box-shadow: 0 10px 20px -8px rgba(91,61,230,0.55); }
  .ws-chip.on .ws-chip-ic { background: rgba(255,255,255,0.22); }
  .ws-chip.turn-ring::after { border-radius: 99px; }
  .ws-sides { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 12px; }
  @media (max-width: 640px) { .ws-sides { grid-template-columns: 1fr; } }
  @keyframes ws-halo { 0%, 100% { box-shadow: inset 0 0 0 2px ${T.accent}88, 0 0 0 0 rgba(91,61,230,0); } 50% { box-shadow: inset 0 0 0 2px ${T.accent}, 0 0 0 6px rgba(91,61,230,0.14); } }
  .ws-side { position: relative; display: flex; flex-direction: column; gap: 10px; align-items: stretch; text-align: left; font: inherit; color: ${T.ink}; border: none; border-radius: 16px; padding: 12px 14px 14px; min-height: 104px; background: ${T.paper}; cursor: default; min-width: 0; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 10px 24px -16px rgba(${T.shadowBase},0.34); transition: transform 0.2s; }
  .ws-side.closed { background: repeating-linear-gradient(135deg, ${T.paper} 0 14px, ${T.bg} 14px 16px); }
  .ws-side.ready { cursor: pointer; animation: ws-halo 1.6s ease-in-out infinite; }
  .ws-side.ready:hover { transform: translateY(-2px); }
  .ws-side:disabled { opacity: 1; }
  .ws-side-h { display: flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-weight: 800; font-size: 14.5px; }
  .ws-side-ic { width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; background: ${T.successSoft}; }
  .ws-side.closed .ws-side-ic { background: ${T.accentSoft}; }
  .ws-side.open .ws-side-h { color: ${T.success}; } .ws-side.closed .ws-side-h { color: ${T.accent}; }
  .ws-cnt { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; color: ${T.ink2}; background: ${T.bg}; border-radius: 99px; padding: 2px 9px; }
  .ws-items { display: flex; flex-wrap: wrap; align-content: flex-start; gap: 6px; }
  .ws-z { display: flex; flex-direction: column; gap: 8px; }
  .ws-z.zoom-on { display: flex; }
  .ws-item { display: inline-flex; flex-direction: row; flex-wrap: wrap; align-items: baseline; column-gap: 8px; row-gap: 2px; gap: 2px 8px; background: ${T.successSoft}; border-radius: 10px; padding: 6px 10px; min-width: 0; max-width: 100%; overflow-wrap: anywhere; animation: rv-snap 0.3s ease-out; }
  .ws-side.closed .ws-item { background: ${T.accentSoft}; }
  .ws-item-t { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; }
  .ws-item.last { flex-basis: 100%; box-shadow: inset 0 0 0 1.5px ${T.success}66; }
  .ws-side.closed .ws-item.last { box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .ws-item-v { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 11.5px; line-height: 1.3; color: ${T.success}; overflow-wrap: anywhere; }
  .ws-item-v.closed { color: ${T.accent}; letter-spacing: 0.04em; }
  .ws-item-f { flex-basis: 100%; font-family: 'Source Serif 4', serif; font-size: 14px; line-height: 1.35; color: ${T.ink2}; }
  .ws-note { display: flex; align-items: flex-start; gap: 8px; font-family: 'Manrope'; font-size: 14px; line-height: 1.45; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 13px; min-width: 0; overflow-wrap: anywhere; }
  .ws-note.ok { background: ${T.successSoft}; }
  .ws-note.no { background: ${T.accentSoft}; box-shadow: none; } /* noto'g'ri tomon — maslahat, ayblov emas: binafsha (pilot 1-band) */
  .ws-note.no b { color: ${T.accent}; }
  .ws-back { flex-shrink: 0; font-weight: 800; color: ${T.accent}; }
  @media (prefers-reduced-motion: reduce) { .ws-side, .ws-chip { transition: none; } .ws-side.ready, .ws-item { animation: none; } .ws-side.ready:hover, .ws-chip:hover, .ws-chip.on { transform: none; } }

  .ad-poster { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border-radius: 16px; padding: 10px; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.34); min-width: 0; }
  .ad-gap { position: relative; display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; width: 100%; text-align: left; border: none; cursor: pointer; background: ${T.bg}; border-radius: 11px; padding: 8px 11px; font: inherit; color: ${T.ink}; min-width: 0; transition: background 0.2s, box-shadow 0.2s, transform 0.18s; }
  .ad-gap:hover:not(.ok):not(.none) { transform: translateX(3px); background: ${T.accentSoft}; }
  .ad-n { width: 24px; height: 24px; flex-shrink: 0; border-radius: 50%; background: ${T.paper}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1.5px ${T.accent}44; }
  .ad-gap.ok .ad-n { background: ${T.success}; color: #fff; box-shadow: none; animation: mm-pop 0.3s ease-out; }
  .ad-gap.none .ad-n { color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .ad-gap-t { flex: 1; min-width: 0; font-family: 'Source Serif 4', serif; font-size: clamp(15px,1.8vw,17px); line-height: 1.35; overflow-wrap: anywhere; }
  .ad-gap.on { background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}; }
  .ad-gap.ok { background: ${T.successSoft}; cursor: default; }
  .ad-gap.none { cursor: default; } .ad-gap.none .ad-gap-t { color: ${T.ink2}; }
  .ad-link { margin-left: auto; font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.success}; background: ${T.paper}; border-radius: 99px; padding: 3px 10px; animation: rv-snap 0.3s ease-out; }
  .ad-link.none { color: ${T.ink3}; }
  .ad-gap.turn-ring::after { border-radius: 11px; }
  .ad-schema { display: flex; flex-direction: column; gap: 7px; background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.34); min-width: 0; }
  .ad-field { display: flex; align-items: center; gap: 9px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 13.5px; text-align: left; border: none; border-radius: 10px; padding: 8px 12px; background: ${T.bg}; color: ${T.ink}; cursor: default; overflow-wrap: anywhere; transition: background 0.2s, box-shadow 0.2s, transform 0.18s; }
  .ad-field::before { content: ''; width: 8px; height: 8px; border-radius: 2px; background: ${T.ink3}; flex-shrink: 0; }
  .ad-field-t { flex: 1; min-width: 0; }
  .ad-field-v { flex-shrink: 1; min-width: 0; font-family: 'Manrope'; font-weight: 600; font-size: 12px; color: ${T.ink2}; background: ${T.bg}; border-radius: 6px; padding: 2px 7px; overflow-wrap: anywhere; text-align: right; }
  .ad-field.used .ad-field-v { color: ${T.success}; background: ${T.paper}; }
  .ad-field.ready { cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .ad-field.ready:hover { background: ${T.accentSoft}; transform: translateX(-3px); }
  .ad-field.used { color: ${T.success}; background: ${T.successSoft}; } .ad-field.used::before { background: ${T.success}; }
  .ad-fn { width: 22px; height: 22px; flex-shrink: 0; border-radius: 50%; background: ${T.success}; color: #fff; font-size: 11.5px; display: inline-flex; align-items: center; justify-content: center; animation: mm-pop 0.3s ease-out; }
  @keyframes ad-new { 0% { opacity: 0; transform: translateY(-6px) scale(0.95); box-shadow: inset 0 0 0 2px ${T.success}, 0 0 0 0 rgba(18,169,104,0.45); } 60% { opacity: 1; transform: none; box-shadow: inset 0 0 0 2px ${T.success}, 0 0 0 9px rgba(18,169,104,0); } 100% { box-shadow: inset 0 0 0 2px ${T.success}, 0 0 0 0 rgba(18,169,104,0); } }
  .ad-field.new { box-shadow: inset 0 0 0 2px ${T.success}; animation: ad-new 0.7s ease-out; }
  .ad-field:disabled { opacity: 1; }
  .ad-add { font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; text-align: left; cursor: pointer; border: 2px dashed ${T.accent}; border-radius: 10px; padding: 7px 12px; background: ${T.accentSoft}; color: ${T.accent}; animation: rv-halo 1.6s ease-in-out infinite; }
  .ad-add:hover { background: ${T.paper}; }
  @media (prefers-reduced-motion: reduce) { .ad-gap, .ad-field { transition: none; } .ad-gap:hover:not(.ok):not(.none), .ad-field.ready:hover { transform: none; } .ad-gap.ok .ad-n, .ad-link, .ad-fn, .ad-field.new, .ad-add { animation: none; } }

  .fl-phone { position: relative; width: min(290px, 100%); align-self: center; display: flex; flex-direction: column; gap: 9px; border-radius: 32px; padding: 26px 14px 16px; min-height: 240px; background: ${T.paper}; box-shadow: inset 0 0 0 2px ${T.line}, 0 0 0 6px ${T.paper}, 0 0 0 7.5px ${T.line}, 0 22px 44px -22px rgba(${T.shadowBase},0.5); transition: background 0.3s; }
  .fl-phone.off { background: ${T.ink}; }
  .fp-go { border: none; font: inherit; text-align: left; width: 100%; cursor: pointer; color: inherit; }
  .fp-go:disabled { cursor: default; }
  .fp-go.mf-slot:not(.q) { background: none; }
  .oc-sch { gap: 7px; }
  .oc-sch .ic-h { display: flex; align-items: center; justify-content: space-between; }
  .oc-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 40px; padding: 7px 11px; border-radius: 12px; background: ${T.bg}; }
  .oc-row.ok { background: ${T.successSoft}; }
  .oc-n { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .oc-tag { flex-shrink: 0; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; line-height: 1; padding: 5px 9px; border-radius: 99px; background: ${T.paper}; color: ${T.success}; }
  .oc-tag.shut { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}55; }
  .fp-go:not(:disabled):hover { box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .fp-go.fp-cur { box-shadow: inset 0 0 0 2px ${T.accent}; }
  /* F-0925-QA41: «Telefon» yorlig'i telefon ustida, u bilan bir chetdan (qoida 49) */
  .col:has(> .fl-phone) > .flow-label { align-self: center; width: min(290px, 100%); }
  .fl-off { flex: 1; display: flex; align-items: center; justify-content: center; font-size: 40px; color: ${T.ink3}; }
  .fl-video { height: 104px; border-radius: 14px; background: linear-gradient(135deg, ${T.accentSoft}, ${T.blueSoft}); display: flex; align-items: center; justify-content: center; font-size: 30px; color: ${T.accent}; }
  .fl-like { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: 16px; border: none; cursor: pointer; border-radius: 99px; padding: 8px 16px; background: ${T.bg}; color: ${T.ink2}; transition: background 0.2s, color 0.2s, transform 0.18s; }
  .fl-like:hover:not(:disabled) { transform: translateY(-2px); }
  .fl-like.on { background: ${T.accent}; color: #fff; cursor: default; }
  .fl-like.back { animation: mm-pop 0.45s ease-out; }
  .fl-like:disabled { opacity: 1; }
  .fl-like.turn-ring::after { border-radius: 99px; }
  .fl-offbtn { align-self: center; font-family: 'Manrope'; font-weight: 800; font-size: 14px; cursor: pointer; border: none; border-radius: 99px; padding: 10px 18px; background: ${T.paper}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 10px 20px -12px rgba(${T.shadowBase},0.45); transition: transform 0.18s; }
  .fl-offbtn:hover { transform: translateY(-2px); }
  .fl-offbtn.turn-ring::after { border-radius: 99px; }
  .fl-bld { position: relative; display: flex; flex-direction: column; background: ${T.paper}; border-radius: 16px; padding: 0; overflow: visible; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 14px 30px -18px rgba(${T.shadowBase},0.4); }
  .fl-ground { display: block; height: 6px; margin: 0; border-radius: 0 0 16px 16px; background: ${T.line}; }
  .fl-step { display: flex; align-items: stretch; gap: 12px; margin: 0 1.5px; padding: 12px 10.5px; border-bottom: 2px solid ${T.line}; opacity: 0.5; transition: opacity 0.35s, background 0.35s; min-width: 0; }
  .fl-step:last-of-type { border-bottom: none; }
  .fl-step.on { opacity: 1; }
  .fl-step.here { background: linear-gradient(90deg, ${T.successSoft}, ${T.paper} 75%); }
  .fl-shaft { position: relative; width: 36px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: ${T.bg}; }
  .fl-rope { position: absolute; top: -14px; bottom: -14px; left: 50%; width: 2px; margin-left: -1px; background: ${T.line}; }
  .fl-step.on .fl-rope { background: ${T.success}; }
  .fl-car { position: relative; z-index: 1; width: 30px; height: 30px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-size: 15px; background: ${T.accent}; box-shadow: 0 6px 14px -6px rgba(91,61,230,0.6); animation: fl-down 0.45s cubic-bezier(.3,1.3,.5,1); }
  .fl-bld.up .fl-car { background: ${T.success}; box-shadow: 0 6px 14px -6px rgba(18,169,104,0.6); animation: fl-up 0.7s cubic-bezier(.3,1.2,.5,1); }
  @keyframes fl-down { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
  @keyframes fl-up { from { opacity: 0; transform: translateY(90px); } to { opacity: 1; transform: none; } }
  .fl-ic { width: 40px; height: 40px; flex-shrink: 0; align-self: center; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 21px; line-height: 1; background: ${T.bg}; transition: background 0.35s; }
  .fl-step.on .fl-ic { background: ${T.successSoft}; }
  .fl-n { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; color: ${T.accent}; }
  .fl-txt { flex: 1; min-width: 0; align-self: center; font-family: 'Manrope'; font-size: 15px; line-height: 1.4; overflow-wrap: anywhere; }
  .fl-st { flex-shrink: 0; align-self: center; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 11.5px; white-space: nowrap; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 3px 9px; }
  .fl-st.off { color: ${T.ink2}; background: ${T.bg}; }
  .fl-st.keep { box-shadow: inset 0 0 0 1.5px ${T.success}; animation: mm-pop 0.4s ease-out; }
  .fl-video { position: relative; }
  .fl-phone .hk-ph-meta { gap: 1px; }
  .fl-why { display: block; margin-top: 3px; font-family: 'Source Serif 4', serif; font-style: italic; font-size: 14.5px; color: ${T.success}; }
  @media (prefers-reduced-motion: reduce) { .fl-step, .fl-phone, .fl-like, .fl-ic, .fl-offbtn { transition: none; } .fl-car, .fl-bld.up .fl-car, .fl-like.back, .fl-st.keep { animation: none; } .fl-like:hover:not(:disabled), .fl-offbtn:hover { transform: none; } }

  .qv-step { position: relative; padding-left: 52px; }
  .qv-step:nth-child(-n+2)::after { content: ''; position: absolute; left: 19px; top: 46px; bottom: -12px; width: 2px; border-radius: 2px; background: ${T.line}; }
  .qv-step.ok:nth-child(-n+2)::after { background: ${T.success}66; }
  /* 15-ekran bino (10-ekran fl-bld oilasi): tom · uch qavat · yer. Birinchi bola — tom, shuning uchun qavat-chiziqlari nth-child 2..3 */
  /* F-0925-B30: bino tomi (to'q «qalpoqcha») va yer chizig'i olib tashlandi — «qavat» metaforasi darsdan chiqdi; oddiy oq karta */
  .qv-bld { position: relative; display: flex; flex-direction: column; gap: 0; background: ${T.paper}; border-radius: 16px; overflow: hidden; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 12px 26px -18px rgba(${T.shadowBase},0.4); }
  .qv-bld > .qv-step { padding: 10px 12px; border-bottom: 2px solid ${T.line}; transition: background 0.3s; }
  .qv-bld > .qv-step:last-of-type { border-bottom: none; }
  .qv-bld > .qv-step::after { display: none; }
  .qv-bld > .qv-step.ok { background: linear-gradient(90deg, ${T.successSoft}, ${T.paper} 70%); }
  .qv-bld > .qv-step.jg { background: linear-gradient(90deg, ${AMBER_SOFT}, ${T.paper} 70%); }
  /* «U qanchalik tushunyapti» — uch ustun: baland yashil 🙂 / past amber 😕 / bo'sh */
  .lm { display: flex; flex-direction: column; gap: 8px; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: 10px 14px 10px; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 10px 24px -16px rgba(${T.shadowBase},0.34); }
  .lm-h { display: flex; align-items: center; gap: 8px; } .lm-h .mm-ph-n { margin-left: auto; }
  .lm-cols { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
  .lm-col { display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 0; }
  .lm-track { position: relative; width: 100%; height: 62px; border-radius: 10px; background: ${T.bg}; overflow: hidden; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .lm-col.empty .lm-track { background: repeating-linear-gradient(135deg, ${T.bg} 0 6px, ${T.paper} 6px 12px); }
  .lm-fill { position: absolute; left: 0; right: 0; bottom: 0; height: 0; background: ${T.line}; transition: height 0.45s cubic-bezier(.3,1.2,.5,1), background 0.3s; }
  .lm-col.ok .lm-fill { height: 88%; background: linear-gradient(180deg, ${T.success}, ${T.success}bb); }
  .lm-col.bad .lm-fill { height: 30%; background: linear-gradient(180deg, ${AMBER}, ${AMBER}bb); }
  .lm-face { position: absolute; left: 50%; transform: translateX(-50%); bottom: 8px; font-size: 20px; line-height: 1; transition: bottom 0.45s cubic-bezier(.3,1.2,.5,1); }
  .lm-col.ok .lm-face { bottom: calc(88% - 26px); }
  .lm-col.bad .lm-face { bottom: calc(30% + 2px); animation: ul-shake 0.45s ease; }
  .lm-ic { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 12px; color: ${T.ink2}; }
  .lm-col.ok .lm-ic { color: ${T.success}; } .lm-col.bad .lm-ic { color: ${AMBER}; }
  @media (prefers-reduced-motion: reduce) { .lm-fill, .lm-face, .qv-bld > .qv-step { transition: none; } .lm-col.bad .lm-face { animation: none; } }

  .ul { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(16px,2.6vw,24px); display: flex; flex-direction: column; gap: 10px; box-shadow: 0 14px 34px -16px rgba(${T.shadowBase},0.3); }
  .ul-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink2}; }
  .ul-chart { position: relative; height: clamp(120px,17vw,160px); }
  .ul-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; overflow: visible; }
  .ul-low { fill: ${T.bg}; }
  .ul-mid { stroke: ${T.ink3}88; stroke-width: 1.5; stroke-dasharray: 5 6; vector-effect: non-scaling-stroke; }
  .ul-area { transition: d 0.45s ease; }
  .ul-path { fill: none; stroke: ${T.accent}; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; transition: d 0.45s ease; }
  .ul-dot { position: absolute; width: 13px; height: 13px; margin: -6.5px 0 0 -6.5px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 0 3px ${T.paper}; animation: ul-pop 0.3s cubic-bezier(.3,1.6,.5,1); }
  .ul-dot.got { background: ${T.success}; width: 17px; height: 17px; margin: -8.5px 0 0 -8.5px; }
  @keyframes ul-pop { from { transform: scale(0); } to { transform: none; } }
  .ul-face { position: absolute; z-index: 2; font-size: 22px; line-height: 1; transform: translate(-50%, -135%); white-space: nowrap; pointer-events: none; }
  .ul-face.sad { animation: ul-shake 0.45s ease; }
  @keyframes ul-shake { 25% { translate: -3px 0; } 75% { translate: 3px 0; } }
  .ul-sent.ul-sent { margin: 0; display: grid; grid-template-columns: repeat(var(--n), minmax(0,1fr)); padding: 0 var(--pad); gap: 4px; font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.7vw,21px); line-height: 1.3; }
  .ul-sent .ul-w { justify-self: center; text-align: center; white-space: nowrap; }
  .ul-w.turn-ring::after { border-radius: 10px; }
  .ul-sent.ul-sent.ru { gap: 10px; font-size: clamp(14px,1.5vw,18px); }
  .ul-sent.ru .ul-w { white-space: normal; line-height: 1.2; }
  @media (max-width: 640px) { .ul-sent.ul-sent { display: flex; flex-wrap: wrap; gap: 6px 8px; padding: 0; } }
  .ul-w { font: inherit; color: ${T.ink}; background: transparent; border: none; border-radius: 8px; padding: 2px 6px; cursor: pointer; opacity: 0; transition: background 0.2s, color 0.2s; }
  .ul-w.in { opacity: 1; animation: fade-step 0.3s ease-out; }
  .ul-w:hover:not(:disabled) { background: ${T.accentSoft}; }
  .ul-w:disabled { cursor: default; }
  .ul-w.got { color: ${T.success}; background: ${T.successSoft}; }
  .ul-w.miss { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; } /* xato bosish — binafsha (pilot 1-band) */
  .gv-replay { position: absolute; top: 10px; right: 10px; z-index: 3; width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer; background: ${T.paper}; color: ${T.accent}; font-size: 15px; font-weight: 800; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
  .ln-swaps { display: flex; flex-direction: column; gap: 6px; }
  .ln-swap.ln-swap { margin: 0; font-family: 'Manrope'; font-size: 14.5px; line-height: 1.4; color: ${T.ink}; background: ${T.bg}; border-radius: 10px; padding: 8px 11px; overflow-wrap: anywhere; }
  .ln-swap s { color: ${T.ink3}; } .ln-swap b { color: ${T.success}; }
  .ln-new.ln-new { margin: 0 0 8px; font-family: 'Source Serif 4', serif; font-style: italic; font-size: clamp(16px,2vw,19px); line-height: 1.4; color: ${T.ink}; overflow-wrap: anywhere; }
  @media (prefers-reduced-motion: reduce) { .ul-path, .ul-area, .ul-chart, .screen.dense .ul-chart { transition: none; } .ul-w.in, .ul-dot, .ul-face.sad { animation: none; } }
  /* ⛶ tugma «↻» dan chaproqda turadi (ikkalasi ham ramkaning o'ng yuqori burchagida) */
  .zoomable.zul > .zoom-btn { top: 12px; right: 48px; }
  .zoomable.zoom-on.zul > .zoom-btn { top: 10px; right: 10px; }

  .cq-step { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
  .cq-q { font-family: 'Manrope'; font-weight: 800; font-size: 14px; overflow-wrap: anywhere; }
  /* F-0925-B28 · bittalab karta: ko'rsatkich + surilib kiradigan karta */
  .mf-slide.fwd { animation: mf-in-r 0.34s cubic-bezier(.2,.8,.2,1); } .mf-slide.back { animation: mf-in-l 0.34s cubic-bezier(.2,.8,.2,1); }
  @keyframes mf-in-r { from { opacity: 0; transform: translateX(36px); } to { opacity: 1; transform: none; } }
  @keyframes mf-in-l { from { opacity: 0; transform: translateX(-36px); } to { opacity: 1; transform: none; } }
  .mf-next { align-self: flex-end; margin-top: 2px; border: none; cursor: pointer; border-radius: 10px; padding: 9px 16px; background: ${T.accent}; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; position: relative; }
  .mf-next:disabled { background: ${T.accentSoft}; color: ${T.accent}; opacity: 0.6; cursor: default; }
  @media (prefers-reduced-motion: reduce) { .mf-slide.fwd, .mf-slide.back { animation: none; } }
  /* F-0925-B31 · «Sxemangiz» ixcham qatorlari (16-ekran) */
  .sx-open { border-radius: 12px; padding: 8px 10px; box-shadow: inset 0 0 0 1.5px ${T.accent}55; }
  .sx-done { margin-left: 8px; border: none; cursor: pointer; border-radius: 99px; padding: 2px 10px; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; background: ${T.successSoft}; color: ${T.success}; }
  .cq-card { display: flex; flex-direction: column; gap: 10px; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.34); }
  .cq-row { display: flex; flex-direction: column; gap: 3px; min-width: 0; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; }
  .cq-row.on { background: ${T.successSoft}; }
  .cq-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.04em; color: ${T.ink2}; overflow-wrap: anywhere; }
  .cq-val { font-family: 'Source Serif 4', serif; font-size: 15px; line-height: 1.4; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .ideas .idea { min-width: 0; overflow-wrap: anywhere; }
  .mf-card { display: flex; flex-direction: column; gap: 7px; min-width: 0; background: ${T.paper}; border-radius: 14px; padding: 10px 14px; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.3); transition: border-color 0.25s; }
  .mf-card.ok { }
  .mf-save { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
  /* 13-ekran: savol oldidagi rang-nuqta — maydon NIMA (amber), bo'lim NATIJA (yashil); «Ertangi ekran» bilan bir kod */
  .mf-phone { width: 100%; max-width: 360px; min-height: 0; gap: 6px; padding: 22px 12px 12px; }
  .mf-slot { position: relative; display: flex; align-items: center; gap: 8px; min-height: 40px; padding: 6px 10px; border-radius: 12px; border: 2px dashed ${T.line}; min-width: 0; }
  .mf-slot.q { border-color: ${AMBER}66; background: ${AMBER_SOFT}66; animation: mm-in 0.3s ease-out; }
  .mf-slot-n { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 12px; color: ${T.ink3}; flex-shrink: 0; }
  .mf-q { margin-left: auto; flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${AMBER}; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${AMBER}88; }
  .mf-chip { align-self: flex-start; max-width: 100%; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 11px; line-height: 1.3; color: ${AMBER}; background: ${AMBER_SOFT}; border-radius: 6px; padding: 2px 7px; overflow-wrap: anywhere; min-width: 0; }
  .mf-slot .mf-chip { align-self: center; }
  .mf-sec.lit { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}88; }
  .mf-sec .mm-sec-t { font-size: 13.5px; }
  @media (prefers-reduced-motion: reduce) { .mf-slot.q { animation: none; } }
  .idea-box .ic-h { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 8px; }
  .idea-box .idea-tool { margin-left: auto; padding: 5px 11px; font-size: 12px; letter-spacing: 0; text-transform: none; }
  .col > .idea-tool { align-self: flex-start; }
  /* 13-ekran (kompyuter): g'oya kartasi ixcham — yorliq chapda, qiymat o'ngda; «Ertangi ekran» bilan birga ekranga sig'adi */
  @media (min-width: 761px) {
    .mf-split .idea-box { gap: 4px; padding: 8px 14px 9px; }
    .mf-split .idea-box .cq-row { display: grid; grid-template-columns: minmax(0,0.72fr) minmax(0,1.7fr); align-items: baseline; column-gap: 10px; padding: 3px 10px; }
    .mf-split .idea-box .cq-val { font-size: 13.5px; line-height: 1.25; }
    .lesson-root .screen.dense .mf-split > .col:last-child { gap: 8px; }
    .mf-split .mf-phone { max-width: none; gap: 5px; padding: 16px 11px 9px; border-radius: 26px; }
    .mf-split .mf-phone .uz-notch { top: 6px; height: 5px; }
    .mf-split .mf-save .pw-save { padding: 9px 18px; }
    .mf-split .mf-save .done-mini { padding: 6px 14px; }
    .lesson-root .stage-content:has(> .screen.dense .mf-split) { padding-bottom: 6px; }
    /* 14-ekran: «hamma maydon yopiq» eslatmasi chiqqanda ham uchinchi karta ekrandan chiqmasin */
    .lesson-root .stage-content:has(> .screen.dense .oc-split) { padding-bottom: 6px; }
    .screen.dense .oc-split .mf-card { padding: 5px 13px 6px; }
    .screen.dense .oc-split .pw-f input { padding-top: 5px; padding-bottom: 5px; }
    .screen.dense .oc-split .oy-b { padding: 5px 11px; }
    .screen.dense .oc-split .ws-note { padding: 7px 12px; font-size: 13.5px; line-height: 1.4; }
    /* 15-ekran: bino va o'lchagich ixcham — RU (ikki qatorli savol-yorliq) va kasbiy so'z maslahati bilan ham ekranga sig'adi */
    .lesson-root .stage-content:has(> .screen.dense .qg-split) { padding-bottom: 6px; }
    .screen.dense .qg-split .qv-bld > .qv-step { padding: 6px 12px; gap: 4px; }
    .screen.dense .qg-split .pw-f input { padding-top: 5px; padding-bottom: 5px; }
    .screen.dense .qg-split .pw-f textarea.qv-ta { padding-top: 5px; padding-bottom: 5px; min-height: calc(1.4em + 10px); max-height: calc(4.2em + 10px); }
    .screen.dense .qg-split .pw-f textarea.qv-ta:placeholder-shown { max-height: none; }
    @supports not (field-sizing: content) { .screen.dense .qg-split .pw-f textarea.qv-ta:placeholder-shown { min-height: calc(4.2em + 10px); } }
    .screen.dense .qg-split .sl-hint.sl-hint { margin: 0; padding: 3px 9px; font-size: 12.5px; line-height: 1.35; }
    .screen.dense .qg-split .cq-q { line-height: 1.3; }
    .screen.dense .qg-split .lm { gap: 6px; padding: 8px 12px; }
    .screen.dense .qg-split .lm-track { height: 50px; }
    .screen.dense .qg-split .lm-face { font-size: 18px; }
    .screen.dense .qg-split .lm-col.ok .lm-face { bottom: calc(88% - 23px); }
    .screen.dense .qg-split .mf-save .pw-save { padding: 9px 18px; }
    .screen.dense .qg-split .mf-save .done-mini { padding: 6px 14px; }
    /* Takror-gap maslahati «Saqlash» yonida (Dizayn 25.09): saqlash aynan shu sabab bilan yopiq — sabab tugma bilan bir qatorda
       turadi va alohida qator olmaydi (RU: kasbiy so'z uchala qavatda + takror gap holatida ham ekran skrollsiz) */
    .screen.dense .qg-split > .col:first-child { flex-flow: row wrap; align-items: center; row-gap: 8px; }
    .screen.dense .qg-split .jg-line { margin-bottom: 1px; }
    .screen.dense .qg-split .qv-step > .cq-q { line-height: 1.25; }
    .screen.dense .qg-split > .col:first-child > .qv-bld { flex: 1 0 100%; min-width: 0; }
    .screen.dense .qg-split > .col:first-child > .mf-save { order: 1; }
    .screen.dense .qg-split > .col:first-child > .sl-hint { order: 2; flex: 1 1 200px; min-width: 0; }
    .mf-split .mf-phone .mm-sec { flex-direction: row; flex-wrap: nowrap; align-items: center; gap: 8px; padding: 6px 10px; }
    .mf-split .mf-phone .mm-sec-t { flex: 1 1 auto; min-width: 0; }
    /* Maydon-chipi bitta qatorda (to'liq matn chapdagi maydonda) — uzun javob telefonni cho'zib yubormaydi */
    .mf-split .mf-phone .mf-chip { flex: 0 1 auto; max-width: 52%; margin-left: auto; align-self: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .mf-split .mf-phone .mf-slot .mf-chip { margin-left: 0; max-width: 78%; }
    .mf-split .mf-slot { min-height: 34px; padding: 4px 10px; }
    /* 13-ekran: maslahat chiqqan holatda ham (RU — ikki qator) uchinchi karta ekrandan chiqmasin */
    .screen.dense .mf-split .mf-card { gap: 2px; padding: 5px 13px 6px; }
    .screen.dense .mf-split .pw-f input { padding-top: 5px; padding-bottom: 5px; }
    .screen.dense .mf-split .sl-hint.sl-hint { margin: 0; padding: 4px 9px; font-size: 12.5px; line-height: 1.35; }
  }
  /* F-0925-B29 · katta tomon tanlovi */
  .oy-big { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; border-radius: 14px; position: relative; }
  .oy-bb { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; text-align: left; border: none; cursor: pointer; border-radius: 12px; padding: 11px 13px; background: ${T.bg}; color: ${T.ink}; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: transform 0.18s, background 0.2s, box-shadow 0.2s; }
  .oy-bb b { font-family: 'Manrope'; font-weight: 800; font-size: 14.5px; }
  .oy-bb span { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; }
  .oy-bb:hover:not(.on) { transform: translateY(-2px); }
  .oy-bb.open.on { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px ${T.success}; } .oy-bb.open.on b { color: ${T.success}; }
  .oy-bb.closed.on { background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}; } .oy-bb.closed.on b { color: ${T.accent}; }
  @media (max-width: 480px) { .oy-big { grid-template-columns: 1fr; } }
  @media (prefers-reduced-motion: reduce) { .oy-bb { transition: none; } .oy-bb:hover:not(.on) { transform: none; } }
  .oy-name { font-family: 'Manrope'; font-weight: 800; font-size: 14.5px; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .oy-tg { display: inline-flex; flex-wrap: wrap; gap: 6px; border-radius: 12px; align-self: flex-start; }
  .oy-b { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; border: none; cursor: pointer; border-radius: 10px; padding: 8px 13px; background: ${T.bg}; color: ${T.ink2}; transition: transform 0.18s, background 0.2s; }
  .oy-b:hover:not(.on) { transform: translateY(-2px); }
  .oy-b.on { animation: mm-pop 0.3s ease-out; }
  @media (prefers-reduced-motion: reduce) { .oy-b, .mf-card { transition: none; } .oy-b:hover:not(.on) { transform: none; } .oy-b.on { animation: none; } }
  .oy-b.open.on { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
  .oy-b.closed.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  /* Kasbiy so'z — xato emas, tinglovchi «tushunmay qoladigan» joy (12-ekran chizig'i bilan bir ma'no): AMBER, qizil emas (pilot 8-band) */
  .pw-f.jg-on input, .pw-f.jg-on textarea { box-shadow: inset 0 0 0 2px ${AMBER}; }
  .sl-hint.bad { color: ${AMBER}; background: ${AMBER_SOFT}; }
  .jg-line { display: block; margin-bottom: 3px; color: ${T.ink}; overflow-wrap: anywhere; }
  mark.jg { background: ${AMBER_SOFT}; color: ${AMBER}; border-radius: 4px; padding: 0 3px; text-decoration: underline wavy ${AMBER}; text-decoration-skip-ink: none; }
  .pr-gaps { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
  /* 17-ekran mini-sahna: gap-kartasi + «?» — bosilsa qavat belgisi ochiladi (aylanib chiqadi) */
  .pr-gap-row { display: flex; align-items: stretch; gap: 8px; min-width: 0; }
  .pr-gap-row > .pr-gap { flex: 1; min-width: 0; transition: background 0.25s; }
  .pr-gap-row.on > .pr-gap { background: ${T.successSoft}; }
  .pr-flip { flex-shrink: 0; width: 44px; border: none; cursor: pointer; border-radius: 10px; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'Manrope'; font-weight: 800; font-size: 17px; display: inline-flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1.5px ${T.accent}55; transition: transform 0.18s, background 0.2s; }
  .pr-flip:hover { transform: translateY(-2px); }
  .pr-flip:active { transform: translateY(1px); }
  .pr-gap-row.on .pr-flip { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}88; font-size: 20px; }
  .pr-flip-in { display: inline-block; animation: pr-turn 0.35s ease-out; }
  @keyframes pr-turn { from { transform: rotateY(90deg); opacity: 0.2; } to { transform: none; opacity: 1; } }
  .pr-scene { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px 14px; margin-top: 4px; padding: 14px 12px; border-radius: 14px; background: ${T.bg}; }
  .pr-p { position: relative; font-size: 30px; line-height: 1; }
  .pr-bub { position: absolute; right: -14px; top: -12px; font-style: normal; font-size: 14px; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: ${T.paper}; box-shadow: 0 4px 10px -4px rgba(${T.shadowBase},0.3); }
  .pr-bub.q { font-family: 'Manrope'; font-weight: 800; color: ${T.accent}; }
  .pr-wave { display: inline-flex; gap: 4px; }
  .pr-wave i { width: 7px; height: 7px; border-radius: 50%; background: ${T.accent}; opacity: 0.25; animation: pr-dot 1.4s ease-in-out infinite; }
  .pr-wave i:nth-child(2) { animation-delay: 0.2s; } .pr-wave i:nth-child(3) { animation-delay: 0.4s; }
  @keyframes pr-dot { 0%, 100% { opacity: 0.25; } 40% { opacity: 1; } }
  .pr-fls { display: inline-flex; gap: 6px; padding-left: 6px; border-left: 2px dashed ${T.line}; }
  .pr-fl { width: 40px; height: 40px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 20px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.line}; animation: pr-pick 3.6s ease-in-out calc(var(--k) * 1.2s) infinite; }
  @keyframes pr-pick { 0%, 30%, 100% { box-shadow: inset 0 0 0 1.5px ${T.line}; transform: none; } 12% { box-shadow: inset 0 0 0 2px ${T.accent}; transform: translateY(-3px); } }
  @media (prefers-reduced-motion: reduce) { .pr-flip, .pr-gap-row > .pr-gap { transition: none; } .pr-flip:hover, .pr-flip:active { transform: none; } .pr-flip-in, .pr-wave i, .pr-fl { animation: none; } .pr-wave i { opacity: 0.6; } }
  .pr-gap.pr-gap { margin: 0; font-family: 'Source Serif 4', serif; font-size: 15.5px; line-height: 1.4; color: ${T.ink}; background: ${T.bg}; border-radius: 10px; padding: 8px 11px; overflow-wrap: anywhere; }

  .ai-fb { display: flex; flex-direction: column; gap: 10px; }
  /* AI QADAMI (16) — AiStep, pilot B1/B3 dan AYNAN; manba DeployLesson 3314-3340, 3416-3431; aksent bridge binafshasi */
  .ais { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .pr-panel { display: flex; flex-direction: column; background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); }
  .pr-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 13px; border-bottom: 1px solid ${T.line}; }
  /* F-0925-QA35: nusxalash — so'rov qutisi burchagidagi belgi; «Gemini'ni ochish» so'rovni o'zi nusxalaydi */
  .pr-ic { flex-shrink: 0; width: 30px; height: 30px; border: none; border-radius: 8px; cursor: pointer; background: ${T.bg}; color: ${T.ink2}; font-size: 15px; line-height: 1; display: inline-flex; align-items: center; justify-content: center; transition: background 0.15s, box-shadow 0.15s; }
  .pr-ic:hover { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .pr-ic.ok { background: ${T.successSoft}; color: ${T.success}; font-weight: 800; }
  .ais-go { align-self: flex-start; }
  .ais-go.on { color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
  .ais > .ais-t { margin: 0; padding: 0 2px; }
  .pr-lbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; }
  .pr-body { margin: 0; padding: 10px 13px; max-height: min(24vh, 170px); overflow-y: auto; white-space: pre-wrap; word-break: break-word; overflow-wrap: anywhere; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12.5px; line-height: 1.55; color: ${T.ink}; }
  .ais-link { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.accent}; text-decoration: none; border-radius: 10px; padding: 8px 14px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .ais-t { font-family: 'Manrope', sans-serif; font-size: 13px; color: ${T.ink2}; line-height: 1.45; overflow-wrap: anywhere; }
  .ais-t b { color: ${T.ink}; }
  .dsx-fb { background: ${T.paper}; border-radius: 12px; padding: 9px 13px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .dsx-fb > summary { cursor: pointer; list-style: none; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.5vw,14px); color: ${T.accent}; }
  .dsx-fb > summary::-webkit-details-marker { display: none; }
  .dsx-fb[open] > summary { margin-bottom: 9px; }
  .dsx-fb-body { display: flex; flex-direction: column; gap: 8px; }
  @media (prefers-reduced-motion: reduce) { .pr-ic { transition: none; } }
  /* 16-ekran (58-qonun): kompyuterda bitta ekranga sig'adi. So'rov-oynasi qisqaroq — ortig'i ICHIDA aylanadi (matn to'liq).
     🛟 zaxira ochilganda ham so'rov va Gemini tugmasi YASHIRILMAYDI (F-0924-01 «so'rov doim ochiq» · B3 tekshiruvchi qarori 24.09 ·
     B7 tekshiruvchi R1 25.09). Zaxira ochiq holatning joylashuvi — pm-dizayn bosqichida (R2). */
  @media (min-width: 761px) {
    .lesson-root .screen.dense .pr-body { max-height: 92px; }
    .lesson-root .screen.dense .ais-link { padding-top: 7px; padding-bottom: 7px; }
    .lesson-root .screen.dense .dsx-fb[open] > summary { margin-bottom: 6px; }
    .lesson-root .screen.dense .dsx-fb { padding: 8px 13px; }
  }
  .ai-fb-f { display: flex; flex-direction: column; gap: 6px; }
  .ai-fb-q.ai-fb-q { margin: 0; display: flex; gap: 10px; align-items: flex-start; font-family: 'Source Serif 4', serif; font-size: clamp(15.5px,2vw,18px); line-height: 1.35; color: ${T.ink}; background: ${T.bg}; border-radius: 12px; padding: 10px 12px; overflow-wrap: anywhere; }
  /* 58-qonun (Dizayn 2-aylanish): zich ekranlar (3 · 8 · 12 · 13 · 14 · 16 · 20) kompyuterda bitta ekranga sig'adi.
     Matn qisqarmaydi — faqat oraliq, joylashuv va yig'ma. Modifikator .dense ekran-o'ramiga qo'yilgan. */
  /* === ⛶ KATTALASHTIRISH (Zoomable — pilot B1/B2 porti) + ustun-yorlig'i === */
  .zoomable { position: relative; min-width: 0; }
  .zoom-btn { position: absolute; top: 4px; right: 4px; z-index: 6; width: 26px; height: 26px; border-radius: 8px; border: none; background: rgba(255,255,255,0.86); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
  .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
  .zoomable.zsplit > .zoom-btn { top: -11px; right: 0; }
  /* F-0925-QA39: 6-ekranda yorliq-qatori yo'q — tugma sanoq-belgisi ustiga tushmasin, o'ng kartaning pastki burchagida */
  .zoomable.zsplit.ws-z:not(.zoom-on) > .zoom-btn { top: auto; bottom: 8px; right: 8px; }
  .zoomable.zsplit.ad-z:not(.zoom-on) > .zoom-btn { top: 8px; right: 8px; } /* F-0925-QA40: o'ng qutining sarlavha-qatorida (u yerda o'ng tomon bo'sh) */
  .zoom-on.zsplit > .zoom-btn, .zoom-on > .zoom-btn { top: 10px; right: 10px; left: auto; }
  .zoom-backdrop { position: fixed; inset: 0; background: rgba(27,22,48,0.55); z-index: 1000; animation: zb-fade 0.25s ease; }
  @keyframes zb-fade { from { opacity: 0; } to { opacity: 1; } }
  .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(1000px,94vw); max-height: calc(92vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.bg}; border-radius: 18px; padding: clamp(20px,3.4vw,38px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
  @media (prefers-reduced-motion: reduce) { .zoom-on, .zoom-backdrop { animation: none !important; } .zoom-btn:hover { transform: none; } }
  .flow-label.flow-label { margin: 0 0 -4px; padding-right: 40px; font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
  .cq-save { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px; }
  .cq-save > .small { flex: 1 1 180px; min-width: 0; }
  @media (min-width: 761px) {
    .lesson-root .screen.dense { gap: 12px !important; }
    .lesson-root .stage-content:has(> .screen.dense) { padding-bottom: 14px; }
    .lesson-root .screen.dense .h-title { font-size: clamp(22px,2.6vw,31px); }
    .lesson-root .screen.dense .head { gap: 4px; }
    .lesson-root .screen.dense .col { gap: 10px; }
    .lesson-root .screen.dense .frame-success { padding: 11px 16px; }
    .lesson-root .screen.dense .mentor-msg { padding: 10px 15px; }
    /* F-0925-B02: mentor pufagi pastdagi blokka yopishib turmasin — 12px oraliq ustiga +8px (jami 20px) */
    .lesson-root .screen.dense > .mentor { margin-bottom: 8px; }
    /* 3-ekran: xulosa tugmalar ostida, telefon o'ng ustunda ikki qatorni egallaydi */
    .mm-split { grid-template-areas: "a b" "c b"; row-gap: 10px; }
    .mm-split > :nth-child(1) { grid-area: a; } .mm-split > :nth-child(2) { grid-area: b; } .mm-split > .mm-sum { grid-area: c; }
    .screen.dense .mm-btn { padding-top: 5px; padding-bottom: 5px; }
    .screen.dense .mm-list.mini .mm-btn { padding-top: 3px; padding-bottom: 3px; }
    .screen.dense .mm-phone { gap: 6px; padding: 22px 13px 12px; min-height: 0; }
    .screen.dense .mm-sec { gap: 5px; padding: 6px 10px; }
    .screen.dense .mm-none { gap: 6px; padding: 7px 10px; }
    /* 8-ekran: e'lon gaplari ixchamroq */
    .screen.dense .ad-gap { padding-top: 6px; padding-bottom: 6px; }
    .screen.dense .ad-poster { gap: 5px; }
    .screen.dense .ad-schema { padding: 12px 14px; }
    .screen.dense .ad-field { padding-top: 5px; padding-bottom: 5px; }
    .screen.dense .ad-schema { gap: 5px; }
    /* 6-ekran: tomonlar ixchamroq — xulosa ekranga sig'adi */
    .screen.dense .ws-side { gap: 7px; padding: 9px 13px 11px; }
    .screen.dense .ws-side-ic { width: 27px; height: 27px; font-size: 14px; }
    .screen.dense .ws-items { gap: 5px; }
    .screen.dense .ws-item { padding: 5px 10px; }
    /* 12-ekran: chiziq pastroq, almashtirishlar yonma-yon */
    .screen.dense .ul { padding: 12px 18px; gap: 6px; }
    .screen.dense .ln-swaps { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; align-items: stretch; }
    .screen.dense .ln-swap.ln-swap { padding: 7px 11px; }
    .screen.dense .ln-new.ln-new { margin-bottom: 4px; }
    /* 13 · 14 · 16-ekran: kartalar va kiritish maydonlari ixchamroq */
    .screen.dense .mf-card { gap: 3px; padding: 6px 13px; }
    .screen.dense .pw-f input { padding-top: 6px; padding-bottom: 6px; }
    .screen.dense .split > .col:has(> .mf-card) { gap: 8px; }
    /* 14-ekran: maydon nomi va almashtirgich bir qatorda (joy yetmasa o'raladi) */
    .screen.dense .mf-card:has(> .oy-tg) { flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: 10px; }
    .screen.dense .mf-card:has(> .oy-tg) > :not(.oy-name):not(.oy-tg) { flex: 1 0 100%; }
    /* 12-ekran: ish paytida chiziq baland (asosiy maket, pilot 14-band) — xulosa chiqqach pasayadi, xulosa ekranga sig'adi */
    .screen.dense .ul-chart { height: 150px; transition: height 0.45s ease; }
    .screen.dense .ul.fin .ul-chart { height: 80px; }
    /* 16-ekran (B3 naqshi): o'ng ustun kengroq, almashtirgich tugmalari o'ralmaydi.
       Dizayn 25.09: qoida-gap o'ng ustunga (sxema ostiga) ko'chdi — sxema-karta shunga ixchamlashdi: izoh «Saqlash» yonida
       ikki qatorda turadi («Saqlandi» belgisi chiqqanda ham shu qatorda qoladi — qator qo'shilmaydi), maydonlar pastroq. */
    .lesson-root .stage-content:has(> .screen.ai-scr) { padding-bottom: 6px; }
    .lesson-root .screen.ai-scr .split { grid-template-columns: minmax(0,0.84fr) minmax(0,1.16fr); }
    .lesson-root .screen.ai-scr .pr-body { max-height: 128px; } /* F-0925-QA35: ①/② qadam qatorlari olingan joy hisobiga ~6 qator (80px edi) */
    .lesson-root .screen.ai-scr .oy-tg { flex-wrap: nowrap; gap: 5px; }
    .lesson-root .screen.ai-scr .oy-b { padding: 4px 8px; font-size: 12px; white-space: nowrap; }
    .lesson-root .screen.ai-scr .oy-name { font-size: 13px; }
    /* Dizayn R2 25.09 — oddiy (klassik) aylantirish-chizig'i bor kompyuterda (Windows) zaxira YOPIQ holat 1280x800 da ikki xil
       turib qolardi: chiziq bir lahza chiqsa (kirish-animatsiyasi), eni 15px torayadi, RU mentor-gapi ikki qatorga o'tadi (+24px) va
       toshish doimiy bo'lib qoladi (o'ng ustunning zaxirasi 23px edi). O'ng ustun 6px ixchamlandi — gap o'ralsa ham ekran sig'adi. */
    .lesson-root .screen.ai-scr .split > .col { gap: 8px; }
    .lesson-root .screen.ai-scr .cq-step { column-gap: 8px; row-gap: 4px; }
    .lesson-root .screen.ai-scr .cq-card { gap: 6px; padding: 9px 12px; }
    .lesson-root .screen.ai-scr .cq-card .pw-f input { padding-top: 4px; padding-bottom: 4px; }
    .lesson-root .screen.ai-scr .cq-save > .small { flex: 1 1 180px; line-height: 1.35; }
    .lesson-root .screen.ai-scr .ai-rule.ai-rule { padding: 6px 12px; font-size: 13px; line-height: 1.4; }
    /* 🛟 ZAXIRA OCHIQ (tekshiruvchi R1 davomi · Dizayn 25.09): so'rov-oynasi, Gemini tugmasi va javob-qatori ko'rinib turadi, faqat ixchamlashadi
       (B4 naqshi: so'rov 2 qatorli oynada, ichida aylanadi — matn to'liq). Tayyor savollar chap ustunning QOLGAN bo'yini oladi
       va ichida aylanadi; «Savollarni o'ylab ko'ring…» gapi savollar ostida DOIM ko'rinadi (yopishqoq pastki qator). */
    .lesson-root .screen.ai-scr .ais:has(> .dsx-fb[open]) { gap: 6px; }
    .lesson-root .screen.ai-scr .ais:has(> .dsx-fb[open]) .pr-head { padding-top: 5px; padding-bottom: 5px; }
    /* So'rov-oynasi aynan IKKI butun qator (3.1em = 2 x qator-bo'yi 1.55). Pastki bo'shliq aylanish-sohasidan tashqarida (margin):
       padding ichida uchinchi qatorning tepa-uchlari ingichka chiziq bo'lib ko'rinib qolardi (Dizayn R2 25.09). Quti bo'yi o'zgarmaydi. */
    .lesson-root .screen.ai-scr .ais:has(> .dsx-fb[open]) .pr-body { max-height: calc(5px + 3.1em); padding-top: 5px; padding-bottom: 0; margin-bottom: 5px; }
    .lesson-root .screen.ai-scr .ais:has(> .dsx-fb[open]) .ais-link { padding-top: 5px; padding-bottom: 5px; }
    .lesson-root .screen.ai-scr .ais:has(> .dsx-fb[open]) .ais-t { line-height: 1.35; }
    .lesson-root .screen.ai-scr .dsx-fb[open] { padding: 7px 12px 8px; }
    .lesson-root .screen.ai-scr .dsx-fb[open] > summary { margin-bottom: 5px; }
    .lesson-root .screen.ai-scr .ai-fb { gap: 6px; padding-right: 4px; scrollbar-width: thin; scrollbar-color: ${T.ink3}88 transparent; }
    .lesson-root .screen.ai-scr .ai-fb-f { gap: 3px; }
    .lesson-root .screen.ai-scr .ai-fb-f > .oy-name { font-size: 13px; }
    .lesson-root .screen.ai-scr .ai-fb-q.ai-fb-q { gap: 8px; font-size: 14.5px; line-height: 1.3; padding: 4px 9px; border-radius: 10px; }
    .lesson-root .screen.ai-scr .ai-fb-q .pa-q-n { width: 18px; height: 18px; font-size: 10px; margin-top: 1px; }
    .lesson-root .screen.ai-scr .ai-fb > .ai-fb-next { position: sticky; bottom: 0; z-index: 1; background: ${T.paper}; padding-top: 5px; border-top: 1px dashed ${T.line}; font-weight: 600; line-height: 1.35; }
    .lesson-root .screen.ai-scr .ai-fb > .ai-fb-next::before { content: ''; position: absolute; left: 0; right: 0; bottom: calc(100% + 1px); height: 8px; background: linear-gradient(to top, ${T.paper}, rgba(255,255,255,0)); pointer-events: none; }
    /* Qolgan bo'yni to'ldirish zanjiri (ekran → split → chap ustun → .ais → 🛟 → savollar): ekran o'lchamiga o'zi moslashadi.
       Zanjirdagi har bir halqa o'z konteynerining OXIRGI bolasi — joy yetmasa ham hech narsa ustma-ust tushmaydi (60-qonun):
       savollar oynasi 104px dan pastga tushmaydi, undan kichik ekranda odatdagi skroll chiqadi.
       ::details-content qo'llamaydigan brauzerda savollar oynasi 150px bo'lib qoladi (pastdagi umumiy qoida) — 1280x800 da ham sig'adi. */
    @supports selector(::details-content) {
      .lesson-root .screen.ai-scr:has(.dsx-fb[open]) { flex-shrink: 1; min-height: 0; }
      .lesson-root .screen.ai-scr:has(.dsx-fb[open]) > .split { flex: 1 1 auto; min-height: 0; }
      .lesson-root .screen.ai-scr .split > .col:has(> .ais > .dsx-fb[open]) { align-self: stretch; min-height: 0; }
      .lesson-root .screen.ai-scr .ais:has(> .dsx-fb[open]) { flex: 0 1 auto; min-height: 0; }
      .lesson-root .screen.ai-scr .ais:has(> .dsx-fb[open]) > .pr-panel, .lesson-root .screen.ai-scr .ais:has(> .dsx-fb[open]) > .ais-go, .lesson-root .screen.ai-scr .ais:has(> .dsx-fb[open]) > .ais-t { flex-shrink: 0; }
      .lesson-root .screen.ai-scr .dsx-fb[open] { display: flex; flex-direction: column; flex: 0 1 auto; min-height: 0; }
      .lesson-root .screen.ai-scr .dsx-fb[open] > summary { flex-shrink: 0; }
      .lesson-root .screen.ai-scr .dsx-fb[open]::details-content { display: flex; flex-direction: column; flex: 0 1 auto; min-height: 0; }
      .lesson-root .screen.ai-scr .dsx-fb[open] .dsx-fb-body { flex: 0 1 auto; min-height: 0; }
      .lesson-root .screen.ai-scr .dsx-fb[open] .ai-fb { flex: 0 1 auto; min-height: 104px; max-height: none; }
    }
    .screen.dense .cq-card { gap: 8px; padding: 12px 16px; }
    .screen.dense .cq-row { padding: 6px 10px; }
    .screen.dense .oy-b { padding: 6px 12px; }
    .screen.dense .cq-step { gap: 5px; }
    .screen.dense .cq-step .pw-f { gap: 3px; }
    /* 16-ekran: mentor-gap qo'shilgach ham bitta ekranga sig'sin — maydon nomi va almashtirgich bir qatorda (joy yetmasa o'raladi) */
    .screen.ai-scr .cq-step { flex-direction: row; flex-wrap: wrap; align-items: center; column-gap: 10px; }
    .screen.ai-scr .cq-step > .pw-f { flex: 1 0 100%; }
    /* Dizayn R2 25.09: o'quvchi yozgan uzun maydon nomi (13-ekran, 80 belgigacha) almashtirgichni keyingi qatorga surib, har qadamni
       23px ga cho'zardi — 1280x800 da RU o'rtacha nomlarda ham 20–26px, uzun nomlarda 43–49px aylantirish chiqardi (zaxira yopiq ham, ochiq ham).
       Endi almashtirgich doim nom yonida qoladi, uzun nom esa o'z katagida o'raladi (matn to'liq). Qisqa nomda ko'rinish avvalgidek. */
    .screen.ai-scr .cq-step > .oy-name { flex: 1 1 0; max-width: max-content; line-height: 1.25; }
    .screen.dense .cq-save .pw-save { padding: 9px 18px; }
    /* 16-ekran: ochilgan so'rov va zaxira savollar o'z ichida aylanadi — «Saqlash» ekrandan chiqmaydi */
    .screen.dense .ai-fb { max-height: 150px; overflow-y: auto; overscroll-behavior: contain; gap: 8px; padding-right: 2px; }
    .screen.dense .ai-fb-q.ai-fb-q { font-size: 15.5px; padding: 7px 10px; }
    .screen.dense .ai-rule.ai-rule { padding: 8px 12px; }
  }
      `}</style>
      <AchCtx.Provider value={earned}>
      <AchMissCtx.Provider value={achMissVal}>
      <LiveGateCtx.Provider value={{ locked, live }}>
        <div className="lesson-root" ref={rootRef}>
          {live.mode === 'choosing' ? (
            <LiveGate live={live} title={tr(LESSON_META.lessonTitle)} />
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
