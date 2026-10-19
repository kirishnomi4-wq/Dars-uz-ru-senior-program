import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, createContext, useContext, useCallback } from 'react';
import { cardRead, cardWrite, READY_IDEAS } from '../bridgeCard.js';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// O'TISH (BRIDGE) DARSLARI · 2-O'TISH 2-DARSI — «MUAMMONI TOPAMIZ»
// Senariy-manba: pm-senariylar/BRIDGE-B2-MuammoniTopamiz.md (GATE S tasdiqlangan, 2026-09-23).
// Mavzu: muammoni qanday izlash (to'rt belgi, qayerdan qidirish, aniq gap: kim · qachon · nimasi og'ir)
//        va muammodan yechimga (har yechim bitta muammoga javob beradi).
// Misol-ip: taksi ilovasi (ekranda brendsiz). Keys: Airbnb (faqat bank-faktlari).
// Artefakt: o'quvchining g'oya-kartasi (bridgeCard.js) — aniq muammo (kim/qachon/ogir) + 2 yechim.
// INFRA MANBAI: src/pm/PmUserStoryLesson.jsx (P0) — Stage/NavNext/QuestionScreen/MentorTestStats/
//        RecapOverlay/Mentor/MentorNote/PRACTICE_BASE/nishonlar/Podium/CodeStrike arena/progress —
//        FAQAT infra ko'chirilgan; kompilyator, uy vazifasi va P0 mashqlari olib tashlangan.
// Flashcard komponenti: src/2-Modull/PmLesson5.jsx (Flashcards) porti.
// AUDIOSIZ: ovoz yo'q. PRODUCTION: <style> ichidagi @import olib tashlanadi — shriftlarni LMS yuklaydi.
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
const LESSON_META = { lessonId: 'bridge-b2-v1', lessonTitle: { uz: 'Muammoni topamiz', ru: 'Находим проблему' } };
// Ekran-tartib = senariy 3-bo'lim. 19 (Arena) va 20 (Yakun) BITTA sahifada — CodeStrike yakun ichida (jsx-lint · P0 · pilot B1).
// Ballik testlar: s4 · s8 · s11 · s13 (har biri o'z nazariyasidan keyin).
const SCREEN_META = [
  { id: 'hook',   type: 'hook',        template: 'custom', scored: false, scope: 'hook' },         // 0  · 1-ekran
  { id: 'maqsad', type: 'rule',        template: 'custom', scored: false, scope: null },           // 1  · 2
  { id: 'belgi',  type: 'exploration', template: 'custom', scored: false, scope: null },           // 2  · 3
  { id: 's4',     type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 3  · 4 TEST-1
  { id: 'sharh',  type: 'exploration', template: 'custom', scored: false, scope: null },           // 4  · 5
  { id: 'keys',   type: 'case',        template: 'custom', scored: false, scope: null },           // 5  · 6 Airbnb
  { id: 'gap',    type: 'exploration', template: 'custom', scored: false, scope: null },           // 6  · 7
  { id: 's8',     type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 7  · 8 TEST-2
  { id: 'karta',  type: 'practice',    template: 'custom', scored: false, scope: null },           // 8  · 9 ustaxona
  { id: 'ilova',  type: 'exploration', template: 'custom', scored: false, scope: null },           // 9  · 10
  { id: 's11',    type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 10 · 11 TEST-3
  { id: 'juft',   type: 'exploration', template: 'custom', scored: false, scope: null },           // 11 · 12
  { id: 's13',    type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 12 · 13 TEST-4
  { id: 'yechim', type: 'practice',    template: 'custom', scored: false, scope: null },           // 13 · 14 ustaxona
  { id: 'ai',     type: 'practice',    template: 'custom', scored: false, scope: null },           // 14 · 15
  { id: 'sherik', type: 'practice',    template: 'custom', scored: false, scope: null },           // 15 · 16
  { id: 'podium', type: 'stats',       template: 'custom', scored: false, scope: null },           // 16 · 17
  { id: 'flash',  type: 'review',      template: 'custom', scored: false, scope: null },           // 17 · 18
  { id: 'yakun',  type: 'summary',     template: 'custom', scored: false, scope: null }            // 18 · 19 Arena + 20 Yakun (bitta sahifa — P0/pilot etaloni)
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// SCREEN_INTENTS — har ekran nima uchun bor: bola nima QILADI yoki nima BILADI (render qilinmaydi).
export const SCREEN_INTENTS = {
  hook: "Bola ilovasiz yomg'irli kechada uyga qanday yetishini tanlaydi va har usul vaqt olishini yoki birovni bezovta qilishini biladi",
  maqsad: "Bola nolish-gap aniq muammoga, undan ikki yechimga aylanishini oldindan ko'radi",
  belgi: "Bola to'rt kartani ochib, muammoning to'rt belgisini va eng kuchlisi o'zicha chora ekanini biladi",
  s4: "Bola Telegram guruhga yozib yurish o'zicha chora — muammo belgisi ekanini topadi",
  sharh: "Bola olti namuna sharhni «muammo bor» va «shunchaki fikr»ga ajratadi",
  keys: "Bola Airbnb misolidan muammo o'z hayotidan va borib ko'rish orqali topilishini biladi",
  gap: "Bola voqeadan kim · qachon · nimasi og'ir bo'laklarini tanlab aniq muammo gapini yig'adi",
  s8: "Bola uchala bo'lagi bor gapni topadi",
  karta: "Bola o'z g'oyasining muammosini uch bo'lakda yozib, kartasini yangilaydi",
  ilova: "Bola taksi ilovasidagi to'rt joyni ochib, har biri bitta muammoga javob — yechim ekanini biladi",
  s11: "Bola yangi taklifga birinchi «bu kimning qaysi muammosini hal qiladi?» deb so'rashni tanlaydi",
  juft: "Bola to'rt yechimni muammolariga ulaydi va muammosi yo'q yechimni ajratadi",
  s13: "Bola ilova nima qilishi va qaysi muammo yo'qolishi aytilgan yechimni topadi",
  yechim: "Bola o'z muammosiga ikki yechim yozib, har biri shu muammoga javob berishini tekshiradi",
  ai: "Bola AI yordamida savollar oladi va o'tgan voqea haqidagi ikkitasini o'zi tanlaydi",
  sherik: "Bola tanlagan savollarini sherigiga berib, javobidan muammosi haqida bir qator yozadi",
  podium: "Bola testlardagi natijasini (jonlida — sinf reytingini) ko'radi",
  flash: "Bola beshta karta bilan darsning asosiy fikrlarini takrorlaydi",
  yakun: "Bola CodeStrike arenasida 12 savolga javob beradi, darsning uch fikrini ko'rib, darsni yakunlaydi"
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
  return <button className={`btn-white-accent${hint ? ' turn-hint' : ''}`} disabled={isOff} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu qadamga o'tmadi", ru: 'Ментор ещё не перешёл к этому шагу' }) : (freeRide && disabled ? tr({ uz: "Jonli dars: bajarmasdan ham o'tishingiz mumkin", ru: 'Живой урок: можно идти дальше, даже не выполнив' }) : undefined)} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : label}</button>;
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

// Ballik ekranlar javob kaliti — Jonli TASDIQLAYDI. ✓ pozitsiyalari aralash (s4=2 · s8=1 · s11=3 · s13=0);
// QuestionScreen'dagi correctIdx shu qiymatlardan olinadi (bitta manba). practice = ishtirok-kalit (-1).
const INLINE_KEYS = { s4: 2, s8: 1, s11: 3, s13: 0, practice: -1 };
// Qayta tushuntirish — kalit = ballik ekran indeksi (3/7/10/12). Matn senariy ekranlaridan olingan (Metodist sayqallaydi).
const RECAPS = {
  3: {
    title: { uz: "Muammoning to'rt belgisi", ru: 'Четыре признака проблемы' },
    cards: [
      { ic: '🔁', h: { uz: 'Qayta-qayta bo\'ladi', ru: 'Повторяется снова и снова' }, body: { uz: <>Har safar to'garakdan qaytishda taksi topolmaydi. Bitta tasodif emas — <b>takrorlanadigan holat</b>.</>, ru: <>Каждый раз, возвращаясь с кружка, не может найти такси. Это не случайность — <b>ситуация повторяется</b>.</> } },
      { ic: '🛠️', h: { uz: "O'zicha chora", ru: 'Своё решение на ходу' }, body: { uz: <>Tanish haydovchining raqamini saqlab qo'ygan. <b>Eng kuchli belgi — o'zicha chora</b>: demak, muammo odamni rostdan qiynayapti.</>, ru: <>Сохранил номер знакомого водителя. <b>Самый сильный признак — своё решение на ходу</b>: значит, проблема правда мешает человеку.</> } },
      { ic: '⏳', h: { uz: "Vaqt ketadi, oxiri voz kechadi", ru: 'Уходит время, в конце отказывается' }, body: { uz: <>Ko'chada 20 daqiqa turadi, narx talashadi. Oxiri <b>«Bugun bormay qo'ya qolay»</b> deydi.</>, ru: <>Стоит на улице 20 минут, торгуется о цене. В конце говорит: <b>«Сегодня, пожалуй, не пойду»</b>.</> }, ask: { uz: 'Telegram guruhga «kim ketyapti?» deb yozish — qaysi belgi?', ru: 'Писать в Telegram-группу «кто едет?» — какой это признак?' } },
    ]
  },
  7: {
    title: { uz: "Aniq muammo — uch bo'lak", ru: 'Конкретная проблема — три части' },
    cards: [
      { ic: '🙋', h: { uz: 'Kim?', ru: 'Кто?' }, body: { uz: <>Qaysi odam, qaysi vaziyatda: <b>«to'garakdan qaytadigan o'quvchi»</b>. «Hamma odamlar» — aniq emas.</>, ru: <>Какой человек и в какой ситуации: <b>«ученик, который возвращается с кружка»</b>. «Все люди» — не конкретно.</> } },
      { ic: '🕐', h: { uz: 'Qachon?', ru: 'Когда?' }, body: { uz: <>Voqea qachon bo'ladi: <b>«kechqurun, yomg'irda»</b>.</>, ru: <>Когда это происходит: <b>«вечером, в дождь»</b>.</> } },
      { ic: '😣', h: { uz: "Nimasi og'ir?", ru: 'Что тяжело?' }, body: { uz: <>Aynan nima bo'ldi, qancha vaqt ketdi: <b>«ko'chada 20 daqiqa taksi kutadi»</b>. «Taksi yomon» esa nolish.</>, ru: <>Что именно случилось и сколько времени ушло: <b>«20 минут ждёт такси на улице»</b>. А «такси плохое» — это жалоба.</> }, ask: { uz: "«Avtobus yomon» gapiga qaysi uch bo'lak yetishmayapti?", ru: 'Каких трёх частей не хватает фразе «автобус плохой»?' } },
    ]
  },
  10: {
    title: { uz: 'Taklif muammodan boshlanadi', ru: 'Предложение начинается с проблемы' },
    cards: [
      { ic: '🎯', h: { uz: 'Har sahifa — bitta javob', ru: 'Каждая часть — один ответ' }, body: { uz: <>Narx oldindan ko'rinadi — <b>haydovchi bilan narx talashilmaydi</b>. Har sahifa bitta aniq muammoga javob beradi.</>, ru: <>Цена видна заранее — <b>не нужно торговаться с водителем</b>. Каждая часть отвечает на одну конкретную проблему.</> } },
      { ic: '❓', h: { uz: 'Birinchi savol', ru: 'Первый вопрос' }, body: { uz: <>Yangi taklif kelsa, avval so'raladi: <b>bu kimning qaysi muammosini hal qiladi?</b></>, ru: <>Когда приходит новое предложение, сначала спрашивают: <b>чью и какую проблему это решает?</b></> } },
      { ic: '⏭️', h: { uz: 'Rang va muddat — keyin', ru: 'Цвет и сроки — потом' }, body: { uz: <>«Qaysi rangda?», «Necha kunda tayyor?» — bu savollar <b>keyin</b> kerak bo'ladi. Avval muammo topiladi.</>, ru: <>«Какого цвета?», «За сколько дней?» — эти вопросы нужны <b>потом</b>. Сначала находят проблему.</> }, ask: { uz: "«Ilovaga tungi rejim qo'shaylik» — birinchi qaysi savolni berasiz?", ru: '«Давайте добавим в приложение ночной режим» — какой вопрос вы зададите первым?' } },
    ]
  },
  12: {
    title: { uz: 'Yechim qanday yoziladi', ru: 'Как записывают решение' },
    cards: [
      { ic: '⚙️', h: { uz: 'Nima qiladi', ru: 'Что делает' }, body: { uz: <>Ilova <b>aynan nima qilishi</b> aytiladi: «mashina xaritada keladi».</>, ru: <>Говорится, <b>что именно делает</b> приложение: «машина едет по карте».</> } },
      { ic: '✅', h: { uz: "Qaysi muammo yo'qoladi", ru: 'Какая проблема исчезает' }, body: { uz: <>Keyin — shu bilan <b>qaysi muammo yo'qolishi</b>: «qancha kutish kerakligi bilinadi».</>, ru: <>Потом — <b>какая проблема этим исчезает</b>: «понятно, сколько ждать».</> } },
      { ic: '🚫', h: { uz: 'Maqtov — yechim emas', ru: 'Похвала — не решение' }, body: { uz: <>«Chiroyli, zamonaviy, qulay» — bu <b>maqtov so'zlari</b>. Ilova aynan nima qiladi?</>, ru: <>«Красивое, современное, удобное» — это <b>хвалебные слова</b>. Что именно делает приложение?</> } },
    ]
  }
};

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
        {card.vis && <div className="rc-vis">{card.vis}</div>}
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
// MENTOR (proyektor): jonli test statistikasi — «Natijani ochish»gacha ✅/❌ soni yashirin (Kahoot-reveal).
// Sanoq FAQAT bitta manbadan: picked === correctIdx (server-kalit bilan mos).
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
            {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: '📖 Qayta tushuntirishni ochish', ru: '📖 Открыть повторное объяснение' })}</button>}
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
  const [picked, setPicked] = useState(() => { const v = storedAnswer?.lastPicked ?? storedAnswer?.picked; return Number.isInteger(v) && v >= 0 && v < options.length ? v : null; }); // F-0915-02
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
              ? <>✓ {revealPrefix}: {String.fromCharCode(65 + correctIdx)}</>
              : waiting
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
                : wrongLocked
                  ? <>{revealPrefix}: {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</>
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
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && (
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "📖 Qisqa takrorlash — mavzuni yana bir ko'rish", ru: '📖 Короткое повторение — взглянуть на тему ещё раз' })}</button>
          )}
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
    <div className="done-mini fade-up" style={{ alignSelf: 'flex-start' }}>
      👥 {tr({ uz: 'Sinfda:', ru: 'В классе:' })} <b>{data.done}</b> {tr({ uz: 'bajardi', ru: 'выполнили' })}{doing > 0 && <span className="dm-sub">· ✏️ {doing} {tr({ uz: 'hali bajarmoqda', ru: 'ещё выполняют' })}</span>}
    </div>
  );
};

// ===== UMUMIY YORDAMCHILAR =====
const useIsMentor = () => { const g = useContext(LiveGateCtx) || {}; return { live: g.live, isMentor: !!(g.live && g.live.mode === 'mentor') }; };
const clean = (s) => (s || '').trim();
const filled = (s, n = 2) => clean(s).length >= n;
const capFirst = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
// Aniq gap qolipi (senariy 7/9-ekran): «{QACHON} {KIM} {NIMASI OG'IR}.»
const gapOf = (qachon, kim, ogir) => {
  const s = [qachon, kim, ogir].map(clean).filter(Boolean).join(' ');
  if (!s) return '';
  return capFirst(/[.!?…]$/.test(s) ? s : `${s}.`);
};
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

// ===== 1-EKRAN — HOOK: ovoz berish (hamma javob to'g'ri, §119) + jonli sinf-diagrammasi =====
const HOOK_OPTS = [
  { uz: "Ko'chada qo'l ko'tarib, bo'sh taksi kutaman", ru: 'Подниму руку на улице и буду ждать свободное такси' },
  { uz: "Tanish haydovchiga qo'ng'iroq qilaman", ru: 'Позвоню знакомому водителю' },
  { uz: "Ota-onamdan olib ketishni so'rayman", ru: 'Попрошу родителей меня забрать' },
];
// Imzo-vizual (1-ekran): yomg'irli kechki bekat. Fonar ostida bola qo'l ko'tarib turibdi, band taksilar
// to'xtamasdan o'tib ketadi, burchakdagi soat kutish vaqtini sanaydi (20 daqiqagacha) — «vaqt yo'qotadi» belgisi
// shu sahnadan boshlanadi. Brend yo'q; ranglar pasportdan (indigo + amber taksi).
const WAIT_TO = 20 * 60; // soniya: 20 daqiqa (voqeadagi kutish)
const HookClock = () => {
  const [sec, setSec] = useState(() => (reducedMotion() ? WAIT_TO : 0));
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const t = setInterval(() => setSec(v => { if (v >= WAIT_TO) { clearInterval(t); return WAIT_TO; } return v + 10; }), 90);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  return <span className={`hk-clock${sec >= WAIT_TO ? ' full' : ''}`}><span className="hk-clock-ic" />{mm}:{ss}</span>;
};
// Imzo-harakat (javobdan keyin): bola ustida tanlangan «o'zicha chora» pufagi paydo bo'ladi va uch nuqta
// kutib turadi — taksilar esa to'xtamay o'tishda davom etadi, soat sanashda davom etadi. Har chora vaqt oladi (ekran xulosasi).
const HOOK_BUB = ['👋🚕', '📞🚕', '📱👪'];
const HookScene = ({ picked = null }) => (
  <div className={`hk-scene fade-up delay-1${picked !== null ? ' picked' : ''}`} aria-hidden="true">
    <svg className="hk-svg" viewBox="0 0 480 250" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="hkSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#DCD6F3" /><stop offset="1" stopColor="#F2F0FA" /></linearGradient>
        <radialGradient id="hkGlow" cx="0.5" cy="0" r="1"><stop offset="0" stopColor="#FFD380" stopOpacity="0.75" /><stop offset="1" stopColor="#FFD380" stopOpacity="0" /></radialGradient>
        <linearGradient id="hkRoad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D9D4EC" /><stop offset="1" stopColor="#CBC4E6" /></linearGradient>
      </defs>
      <rect width="480" height="250" fill="url(#hkSky)" />
      <g className="hk-city far">
        <rect x="0" y="92" width="58" height="120" /><rect x="64" y="70" width="44" height="142" /><rect x="226" y="84" width="62" height="128" /><rect x="296" y="60" width="40" height="152" /><rect x="410" y="78" width="70" height="134" />
      </g>
      <g className="hk-city near">
        <rect x="172" y="112" width="48" height="100" /><rect x="344" y="104" width="58" height="108" />
      </g>
      <g className="hk-win">
        <rect x="72" y="84" width="8" height="10" /><rect x="90" y="104" width="8" height="10" /><rect x="236" y="98" width="8" height="10" /><rect x="268" y="120" width="8" height="10" /><rect x="304" y="76" width="8" height="10" /><rect x="354" y="118" width="8" height="10" /><rect x="382" y="140" width="8" height="10" /><rect x="422" y="94" width="8" height="10" /><rect x="452" y="122" width="8" height="10" /><rect x="182" y="126" width="8" height="10" />
      </g>
      <rect x="0" y="206" width="480" height="44" fill="url(#hkRoad)" />
      <rect x="0" y="200" width="480" height="8" className="hk-curb" />
      <g className="hk-lane">{[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={i * 90 + 10} y="241" width="44" height="3" rx="1.5" />)}</g>
      <path d="M96 70 L40 206 L170 206 Z" fill="url(#hkGlow)" className="hk-cone" />
      <ellipse cx="112" cy="207" rx="66" ry="5" className="hk-pool" />
      <g className="hk-lamp"><rect x="92" y="64" width="5" height="142" rx="2" /><path d="M94 66 q0 -10 14 -10 h8" fill="none" strokeWidth="4" strokeLinecap="round" /><rect x="108" y="52" width="20" height="9" rx="4" className="hk-bulb" /></g>
      <g className="hk-kid">
        <path d="M150 128 a30 22 0 0 1 60 0 z" className="hk-umb" /><rect x="179" y="128" width="2.5" height="36" className="hk-stick" />
        <circle cx="170" cy="146" r="8.5" className="hk-body" />
        <rect x="160" y="156" width="20" height="30" rx="8" className="hk-coat" />
        <rect x="155" y="160" width="8" height="18" rx="3" className="hk-bag" />
        <path d="M178 162 l14 -8" strokeWidth="5" strokeLinecap="round" className="hk-arm" />
        <rect x="163" y="184" width="6" height="18" rx="3" className="hk-body" /><rect x="172" y="184" width="6" height="18" rx="3" className="hk-body" />
      </g>
      {[0, 1].map(k => (
        <g key={k} className={`hk-taxi t${k + 1}`}>
          <path d="M8 26 q2 -12 16 -14 l14 -10 h30 l14 10 q14 2 16 14 v8 h-90 z" className="hk-taxi-body" />
          <path d="M42 5 h22 l10 8 h-42 z" className="hk-taxi-glass" />
          <rect x="35" y="-7" width="36" height="10" rx="2.5" className="hk-taxi-sign" /><text x="53" y="0.6" className="hk-taxi-sign-t">{tr({ uz: 'BAND', ru: 'ЗАНЯТО' })}</text>
          <circle cx="28" cy="34" r="7" className="hk-wheel" /><circle cx="80" cy="34" r="7" className="hk-wheel" />
        </g>
      ))}
      <g className="hk-rip"><ellipse cx="300" cy="216" rx="10" ry="2.5" /><ellipse cx="420" cy="238" rx="10" ry="2.5" /><ellipse cx="60" cy="236" rx="10" ry="2.5" /></g>
      {picked !== null && HOOK_BUB[picked] && (
        <g className="hk-bub" key={picked}>
          <path d="M214 76 h72 a15 15 0 0 1 0 30 h-62 l-18 10 l6 -12 a15 15 0 0 1 2 -28 z" className="hk-bub-bg" />
          <text x="222" y="97" className="hk-bub-ic">{HOOK_BUB[picked]}</text>
          <g className="hk-bub-dots"><circle cx="266" cy="91" r="2.6" /><circle cx="275" cy="91" r="2.6" /><circle cx="284" cy="91" r="2.6" /></g>
        </g>
      )}
    </svg>
    {Array.from({ length: 18 }).map((_, i) => <i key={i} className="hk-drop" style={{ left: `${(i * 5.7 + (i % 3) * 2.1) % 100}%`, animationDelay: `${(i % 7) * 0.19}s`, animationDuration: `${0.7 + (i % 4) * 0.12}s` }} />)}
    <HookClock />
  </div>
);
const ScreenHook = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor } = useIsMentor();
  const [picked, setPicked] = useState(() => { const v = storedAnswer?.picked; return Number.isInteger(v) && v >= 0 && v < HOOK_OPTS.length ? v : null; }); // F-0915-02
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
  const shown = counts || (picked !== null ? HOOK_OPTS.map((_, i) => (i === picked ? 1 : 0)) : null);
  const totalVotes = shown ? shown.reduce((a, b) => a + b, 0) : 0;
  const revealViz = shown && (picked !== null || isMentor);
  const topIdx = revealViz ? shown.indexOf(Math.max(...shown)) : -1;
  const optWave = useTurnHint(picked === null && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Javobingizni belgilang', ru: 'Отметьте свой ответ' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen hk-screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Taksi ilovasi bo'lmasa, <span className="italic" style={{ color: T.accent }}>yomg'irli kechada</span> uyga qanday yetasiz?</>, ru: <>Если бы не было приложения такси, как бы вы добрались домой <span className="italic" style={{ color: T.accent }}>дождливым вечером</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Ilova bo'lmagan kechani tasavvur qilsangiz, u nimaga kerakligini yaxshiroq sezasiz — <b style={{ color: T.ink }}>uch javobdan</b> birini belgilang.</>, ru: <>Если представить вечер без приложения, лучше чувствуешь, зачем оно нужно, — отметьте один из <b style={{ color: T.ink }}>трёх ответов</b>.</> })}</Mentor>
        <div className="split hk-split">
          <Col>
            {/* Zoomable fade-up ichida emas: sahnaning o'zi fade-up, o'ram esa transformsiz (pilot B1 naqshi) */}
            <Zoomable className="zleft"><HookScene picked={picked} /></Zoomable>
          </Col>
          <Col>
            <p className="eyebrow fade-up delay-2" style={{ color: T.ink2, margin: 0 }}>{tr({ uz: 'Siz nima qilardingiz?', ru: 'А что сделали бы вы?' })}</p>
            <div className="fade-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {HOOK_OPTS.map((o, i) => {
                const on = picked === i;
                const locked = picked !== null || isMentor;
                return (
                  <button key={i} className={`hk-opt ${on ? 'on' : ''}${!locked && optWave ? ` turn-ring turn-wave w${i + 1}` : ''}`} disabled={locked} onClick={() => pick(i)}>
                    <span className="hk-radio">{on && <span className="hk-dot" />}</span>
                    <span>{tr(o)}</span>
                  </button>
                );
              })}
            </div>
            {/* Senariy 1: javob OVOZDAN KEYIN — proyektorda xulosa sinf ovoz bera boshlagach chiqadi (reveal'dan oldin oshkor qilinmaydi) */}
            {(picked !== null || (isMentor && totalVotes > 0)) && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Uchala usul ham uyga yetkazadi. Lekin har biri vaqt oladi yoki birovni bezovta qiladi. Odam shunday <b>o'zicha chora</b> izlagan joyda muammo bor.</>, ru: <>Все три способа доведут до дома. Но каждый отнимает время или кого-то беспокоит. Там, где человек ищет <b>своё решение на ходу</b>, есть проблема.</> })}</p></div>}
            {/* 90-qonun (F-0924-04): proyektorda bo'sh 0% jadvali chiqmaydi — diagramma faqat kamida bitta ovoz kelganda */}
            {revealViz && isLive && totalVotes === 0 && <span className="done-mini fade-step">{tr({ uz: '👥 Ovozlar kutilmoqda…', ru: '👥 Ждём голоса…' })}</span>}
            {revealViz && isLive && totalVotes > 0 && (
              <div className="hvote fade-step" aria-label={tr({ uz: 'Sinf natijasi', ru: 'Результат класса' })}>
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

// ===== 2-EKRAN — MAQSAD: jonli natija-preview =====
// Imzo: xira nolish-gap bo'laklarga bo'linadi → uch bo'lak o'z-o'zidan to'ladi → ikki yechim-karta o'sib chiqadi.
// Yechim-kartalarda qisqa material matn (2-aylanish, naqsh 9-band): 1 — 10-ekran faktidan (mashina xaritada),
// 2 — har taksi ilovasining asosi (taksi bir bosishda chaqiriladi; hook 1-variantiga javob; «telefondan» hook 2-variantidagi qo'ng'iroq bilan adashardi). 13-ekran variantlari takrorlanmaydi.
const GOAL_SOLS = [
  { q: { uz: "mashina qayerdaligini xaritada ko'rsatadi", ru: 'показывает на карте, где машина' }, m: { uz: 'qancha kutishni bilmaslik', ru: 'незнание, сколько ждать' } },
  { q: { uz: 'taksini bir bosishda chaqiradi', ru: 'вызывает такси одним нажатием' }, m: { uz: "ko'chada qo'l ko'tarib kutish", ru: 'ожидание на улице с поднятой рукой' } },
];
const GOAL_PARTS = [
  { k: 'qachon', lbl: { uz: 'qachon', ru: 'когда' }, t: { uz: "Kechqurun, yomg'irda", ru: 'Вечером, в дождь' } },
  { k: 'kim', lbl: { uz: 'kim', ru: 'кто' }, t: { uz: "to'garakdan qaytadigan o'quvchi", ru: 'возвращающийся с кружка ученик' } },
  { k: 'ogir', lbl: { uz: "nimasi og'ir", ru: 'что тяжело' }, t: { uz: "ko'chada 20 daqiqa taksi kutadi", ru: '20 минут ждёт такси на улице' } },
];
// Taymlayn (CSS, bir marta): nolish-pufak chiziladi va xiralashadi → gap-kartadagi uch uya birma-bir to'ladi
// → kartadan ikki shox chiqib, ikki yechim-karta o'sadi va ✓ bosiladi. ↻ — sahnani qayta o'ynatadi (mentor proyektori uchun).
const GoalDemo = () => {
  const [run, setRun] = useState(0);
  return (
    <div className="gp-demo fade-up delay-1" key={run}>
      <button type="button" className="gp-replay" onClick={() => setRun(r => r + 1)}><span aria-hidden="true">↻</span> {tr({ uz: 'Qayta', ru: 'Ещё раз' })}</button>
      <div className="gp-bubble"><span className="gp-bubble-t">«{tr({ uz: 'Taksi yomon', ru: 'Такси плохое' })}»</span><i className="gp-strike" aria-hidden="true" /></div>
      <span className="gp-flow" aria-hidden="true" />
      <div className="gp-line">
        {GOAL_PARTS.map((p, j) => (
          <span key={p.k} className={`gp-part ${p.k}`} style={{ '--fd': `${1.7 + j * 0.5}s` }}>
            <span className="gp-lbl">{tr(p.lbl)}</span>
            <span className="gp-txt">{tr(p.t)}</span>
          </span>
        ))}
      </div>
      <svg className="gp-branch" viewBox="0 0 400 44" preserveAspectRatio="none" aria-hidden="true"><path d="M200 0 C 200 24, 100 18, 100 44" /><path d="M200 0 C 200 24, 300 18, 300 44" /></svg>
      <div className="gp-sols">
        {[0, 1].map(i => (
          <div key={i} className="gp-sol" style={{ '--fd': `${3.7 + i * 0.3}s` }}>
            <span className="gp-sol-n">{i + 1}</span>
            <span className="gp-sol-row"><em>{tr({ uz: 'nima qiladi', ru: 'что делает' })}</em><b className="gp-val">{tr(GOAL_SOLS[i].q)}</b></span>
            <span className="gp-sol-row"><em>{tr({ uz: "qaysi muammoni yo'qotadi", ru: 'какую проблему убирает' })}</em><b className="gp-val m">{tr(GOAL_SOLS[i].m)}</b></span>
            <span className="gp-sol-ok" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
};
const ScreenGoal = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun g'oyangiz <span className="italic" style={{ color: T.accent }}>qaysi muammoni</span> hal qilishini topasiz</>, ru: <>Сегодня вы найдёте, <span className="italic" style={{ color: T.accent }}>какую проблему</span> решает ваша идея</> })}</h2></div>
      <Mentor>{tr({ uz: "Tanlagan g'oyangiz kimning qanday muammosini hal qilishini aniq yozasiz. Keyin har bir yechim shu muammoga javob beradimi — tekshirasiz.", ru: 'Вы точно запишете, чью и какую проблему решает выбранная идея. Потом проверите, отвечает ли каждое решение на эту проблему.' })}</Mentor>
      <GoalDemo />
      <MentorNote>{tr({ uz: "Og'zaki ayting: «G'oya — o'tgan darsda kartangizga yozganingiz. Kartasi yo'qlar tayyor g'oyalardan birini tanlaydi.»", ru: 'Скажите устно: «Идея — то, что вы записали в карточку на прошлом уроке. У кого карточки нет — выберут одну из готовых идей».' })}</MentorNote>
    </div>
  </Stage>
);

// ===== 3-EKRAN — MUAMMONING TO'RT BELGISI: bosib ochish (induktiv: old tomonda voqea, ochilganda belgi nomi) =====
const SIGNS = [
  { ic: '🔁', ex: { uz: "Har safar to'garakdan qaytishda taksi topolmaydi", ru: 'Каждый раз, возвращаясь с кружка, не может найти такси' }, name: { uz: "Bu holat qayta-qayta bo'ladi", ru: 'Это повторяется снова и снова' } },
  { ic: '🛠️', ex: { uz: "Tanish haydovchining raqamini saqlab qo'ygan", ru: 'Сохранил номер знакомого водителя' }, name: { uz: "Odam o'zicha yo'l topishga urinadi", ru: 'Человек сам ищет выход' } },
  { ic: '⏳', ex: { uz: "Ko'chada 20 daqiqa turadi, narx talashadi", ru: 'Стоит на улице 20 минут, торгуется о цене' }, name: { uz: "Vaqt yoki pul yo'qotadi", ru: 'Теряет время или деньги' } },
  { ic: '🚪', ex: { uz: "«Bugun bormay qo'ya qolay» deydi", ru: 'Говорит: «Сегодня, пожалуй, не пойду»' }, name: { uz: 'Oxiri voz kechadi', ru: 'В конце отказывается' } },
];
const ScreenSigns = ({ screen, onNext, onPrev }) => {
  const _g = useContext(LiveGateCtx); const isMentor = !!(_g && _g.live && _g.live.mode === 'mentor'); // mentor jonli darsda kartalarni ochmasdan ham o'ta oladi (hook-ekran naqshi)
  const [opened, setOpened] = useState(() => new Set());
  const [seen, setSeen] = useState(() => new Set());
  const toggle = (i) => {
    setOpened(p => { const n = new Set(p); if (n.has(i)) n.delete(i); else n.add(i); return n; });
    setSeen(p => { if (p.has(i)) return p; const n = new Set(p); n.add(i); return n; });
  };
  const allSeen = seen.size >= SIGNS.length;
  const pend = SIGNS.map((_, i) => String(i)).filter(k => !seen.has(Number(k)));
  const lit = useTurnWalk(pend, !isMentor); // pilot B1 naqshi: proyektorda navbat-yurishi yo'q (mentor o'zi boshqaradi)
  const left = SIGNS.length - seen.size;
  return (
    <Stage eyebrow={tr({ uz: "1-qism · Muammoni qanday topamiz", ru: 'Часть 1 · Как найти проблему' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!allSeen && !isMentor} turnBusy={!allSeen} label={allSeen ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Yana ${left} ta kartani oching`, ru: `Откройте ещё карточки: ${left}` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qayerda muammo borligini <span className="italic" style={{ color: T.accent }}>qanday bilasiz</span>?</>, ru: <>Как понять, <span className="italic" style={{ color: T.accent }}>где есть проблема</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>To'garakdan qaytadigan o'quvchi qiynalayotganini aytmasa ham, qilgan ishlari ko'rsatib turadi — har kartadagi <b style={{ color: T.ink }}>«Bu qaysi belgi?»</b>ni bosing.</>, ru: <>Ученик, который возвращается с кружка, не говорит, что ему трудно, но это видно по его поступкам, — нажмите <b style={{ color: T.ink }}>«Какой это признак?»</b> на каждой карточке.</> })}</Mentor>
        <div className="sg-top fade-up delay-1">
          <div className="sg-who"><span className="sg-who-ava" aria-hidden="true" />{tr({ uz: "To'garakdan qaytadigan o'quvchi", ru: 'Ученик, который возвращается с кружка' })}</div>
          <span className={`sg-meter${allSeen ? ' full' : ''}`} role="img" aria-label={`${seen.size}/${SIGNS.length}`}>{SIGNS.map((_, i) => <i key={i} className={i < seen.size ? 'on' : ''} />)}<b>{seen.size}/{SIGNS.length}</b></span>
        </div>
        {!allSeen && <span className="flow-label fade-up delay-1">{tr({ uz: 'Har kartani bosib, belgini oching', ru: 'Нажмите на каждую карточку и откройте признак' })}</span>}
        <div className="sg-grid fade-up delay-2">
          {SIGNS.map((s, i) => {
            const open = opened.has(i);
            return (
              <button key={i} type="button" className={`sg-card ${open ? 'open' : ''} ${seen.has(i) ? 'seen' : ''}${allSeen && i === 1 ? ' strong' : ''}${turnCls(lit, String(i), pend.length > 1)}`} onClick={() => toggle(i)} aria-expanded={open}>
                <span className="sg-ic" aria-hidden="true">{s.ic}</span>
                <span className="sg-ex">{tr(s.ex)}</span>
                {open ? <span className="sg-name fade-step">{tr(s.name)}</span> : <span className="sg-cue">{tr({ uz: 'Bu qaysi belgi? ▾', ru: 'Какой это признак? ▾' })}</span>}
              </button>
            );
          })}
        </div>
        {allSeen && <div className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: <>Eng kuchli belgi — <b>o'zicha chora</b>.</>, ru: <>Самый сильный признак — <b>своё решение на ходу</b>.</> })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== TEST-SAVOL (F-0924-06) — PmLesson2 savol-qolipi (Screen4): BITTA h-ask sarlavha. F-0925-QA03: «To'g'ri javobni tanlang»
// ko'zcha-yorlig'i va «⚡ Jonli dars — bitta urinish» qatori olib tashlandi (foydalanuvchi: UI'ni bekorga egallaydi).
// Lead (senariy matni) — oddiy qator, serif-karta EMAS (pilot B1 bilan bir xil).
const TestQ = ({ lead, ask }) => (
  <div className="tq">
    {lead && <p className="tq-lead">{lead}</p>}
    <h2 className="title h-ask">{ask}</h2>
  </div>
);

// ===== 4-EKRAN — TEST-1 =====
const ScreenTest1 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 1', ru: 'Проверка · 1' })} scope="module-mikro"
    question={<TestQ lead={tr({ uz: "Qo'shningiz har kuni Telegram guruhga «Yunusobodga kim ketyapti?» deb yozadi.", ru: 'Ваш сосед каждый день пишет в Telegram-группу: «Кто едет в Юнусабад?»' })} ask={tr({ uz: "Bu nimani ko'rsatadi?", ru: 'О чём это говорит?' })} />}
    questionText={tr({ uz: 'Telegram guruhga «kim ketyapti?» deb yozish', ru: 'Писать в Telegram-группу «кто едет?»' })}
    options={[
      tr({ uz: "U guruhda ko'proq gaplashishni yaxshi ko'radi", ru: 'Он любит побольше общаться в группе' }),
      tr({ uz: 'Unga har kuni borish unchalik shart emas', ru: 'Ему не так уж обязательно ездить каждый день' }),
      tr({ uz: "U taksi topish muammosini o'zicha hal qilib yuribdi", ru: 'Он сам на ходу решает проблему с поиском такси' }),
      tr({ uz: "Bu shunchaki odat — orqasida muammo yo'q", ru: 'Это просто привычка — никакой проблемы за ней нет' }),
    ]}
    correctIdx={INLINE_KEYS.s4}
    explainCorrect={tr({ uz: "Har kuni bir xil savolni yozish — o'zicha chora. Bu eng kuchli belgi: taksi topish uni rostdan qiynayapti.", ru: 'Каждый день писать один и тот же вопрос — это своё решение на ходу. Самый сильный признак: поиск такси правда ему мешает.' })}
    explainWrong={{
      // Har noto'g'ri variantga alohida izoh (F-0924-06, spec 9.4): avval rost tomoni, keyin yo'naltiruvchi savol.
      0: tr({ uz: "Guruhda gaplashishni yaxshi ko'radiganlar ko'p — bu rost. Lekin u har kuni aynan bitta savolni yozadi: unga nima yetishmayapti?", ru: 'Любителей поболтать в группе много — это правда. Но он каждый день пишет один и тот же вопрос: чего ему не хватает?' }),
      1: tr({ uz: "Balki shundaydir. Lekin borish shart bo'lmasa, u har kuni «kim ketyapti?» deb yozib o'tirarmidi?", ru: 'Может быть. Но если бы ехать было не обязательно, стал бы он каждый день писать «кто едет?»?' }),
      3: tr({ uz: "Har kuni takrorlanadigan ish odatga o'xshaydi — bu to'g'ri. Lekin taksini oson topa olsa, u bu odatni boshlarmidi?", ru: 'То, что повторяется каждый день, похоже на привычку, — это правда. Но если бы он легко находил такси, появилась бы у него эта привычка?' }),
      default: tr({ uz: "Har kuni bir xil savolni yozish — o'zicha chora. Odam o'zicha chora topgan joyda muammo bor.", ru: 'Каждый день писать один и тот же вопрос — это своё решение на ходу. Там, где человек сам ищет выход, есть проблема.' }) }}
  />
);

// ===== 5-EKRAN — MUAMMONI QAYERDAN QIDIRAMIZ: namuna sharhlarni saralash =====
const SOURCES = [
  { ic: '🙋', t: { uz: "O'z kuningiz", ru: 'Ваш собственный день' } },
  { ic: '👨‍👩‍👧', t: { uz: "Oila va do'stlar", ru: 'Семья и друзья' } },
  { ic: '⭐', t: { uz: 'Past baholi sharhlar', ru: 'Отзывы с низкой оценкой' } },
];
const REVIEWS = [
  { t: { uz: "Xaritada «3 daqiqa» deb turdi, mashina 15 daqiqada keldi.", ru: 'На карте было «3 минуты», а машина приехала через 15 минут.' }, cat: 'muammo' },
  { t: { uz: 'Yarim soat birorta haydovchi buyurtmani olmadi.', ru: 'Полчаса ни один водитель не взял заказ.' }, cat: 'muammo' },
  { t: { uz: "Haydovchi manzilni topolmay, uch marta qo'ng'iroq qildi.", ru: 'Водитель не мог найти адрес и звонил три раза.' }, cat: 'muammo' },
  { t: { uz: 'Rangi menga yoqmadi.', ru: 'Мне не понравился цвет.' }, cat: 'fikr' },
  { t: { uz: "Eski ko'rinishi chiroyliroq edi.", ru: 'Старый вид был красивее.' }, cat: 'fikr' },
  { t: { uz: "Boshqa ilova menga ko'proq yoqadi.", ru: 'Мне больше нравится другое приложение.' }, cat: 'fikr' },
];
const REVIEW_ORDER = [0, 3, 1, 4, 5, 2]; // barqaror aralash tartib (StrictMode-safe, Math.random yo'q)
const REVIEW_BINS = [
  { k: 'muammo', t: { uz: 'Muammo bor', ru: 'Есть проблема' } },
  { k: 'fikr', t: { uz: 'Shunchaki fikr', ru: 'Просто мнение' } },
];
const ScreenReviews = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  // F-0915-02: saqlangan javobdan faqat to'g'ri qutiga tushgan sharhlar olinadi (boshqa ekranning javobi / buzuq kalit tashlanadi).
  const [picks, setPicks] = useState(() => { const sp = storedAnswer && storedAnswer.picks; const o = {}; if (sp && typeof sp === 'object' && !Array.isArray(sp)) REVIEWS.forEach((r, i) => { if (sp[i] === r.cat) o[i] = r.cat; }); return o; });
  const [sel, setSel] = useState(-1);
  const [shake, setShake] = useState(null);
  const drop = (cat) => {
    if (sel < 0 || picks[sel]) return;
    if (REVIEWS[sel].cat !== cat) { setShake(cat); setTimeout(() => setShake(s => (s === cat ? null : s)), 480); return; }
    const next = { ...picks, [sel]: cat };
    if (Object.keys(next).length === REVIEWS.length && binsRef.current) slideFrom.current = binsRef.current.getBoundingClientRect().left;
    setPicks(next); setSel(-1);
    if (Object.keys(next).length === REVIEWS.length && !(storedAnswer && storedAnswer.correct)) onAnswer(screen, { picks: next, correct: true, solved: true });
  };
  const done = Object.keys(picks).length === REVIEWS.length;
  // F-0925-QA15: hammasi joylangach chap ustun (yorliq + «Hammasi ajratildi») yo'qoladi, qutilar gorizontal o'rtaga silliq suriladi (FLIP).
  const binsRef = useRef(null);
  const slideFrom = useRef(null);
  useLayoutEffect(() => {
    const x0 = slideFrom.current; slideFrom.current = null;
    const el = binsRef.current;
    if (x0 == null || !el || !el.animate || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    const dx = x0 - el.getBoundingClientRect().left;
    if (Math.abs(dx) > 1) el.animate([{ transform: `translateX(${dx}px)` }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }, [done]);
  const left = REVIEWS.length - Object.keys(picks).length;
  const pend = REVIEW_ORDER.map(String).filter(k => !picks[k]);
  const lit = useTurnWalk(pend, sel < 0 && !done && !isMentor);
  // Sharh tanlangach navbat qutilarda: ikki teng quti TO'LQIN bilan (88-qonun c/d — lahzada bittasi), cheksiz halo emas.
  const binWave = useTurnHint(sel >= 0);
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : sel < 0 ? tr({ uz: `Sharhni tanlang (yana ${left} ta)`, ru: `Выберите отзыв (осталось ${left})` })
    : tr({ uz: 'Endi qutini bosing', ru: 'Теперь нажмите на корзину' });
  return (
    <Stage eyebrow={tr({ uz: "1-qism · Muammoni qanday topamiz", ru: 'Часть 1 · Как найти проблему' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} turnBusy={!done} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Muammoni <span className="italic" style={{ color: T.accent }}>qayerdan</span> qidirasiz?</>, ru: <><span className="italic" style={{ color: T.accent }}>Где</span> искать проблему?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har sharhda ham muammo yozilavermaydi — avval sharhni bosing, so'ng uni <b style={{ color: T.ink }}>«Muammo bor»</b> yoki <b style={{ color: T.ink }}>«Shunchaki fikr»</b> qutisiga joylang.</>, ru: <>Не в каждом отзыве описана проблема, — сначала нажмите на отзыв, потом положите его в корзину <b style={{ color: T.ink }}>«Есть проблема»</b> или <b style={{ color: T.ink }}>«Просто мнение»</b>.</> })}</Mentor>
        <div className="src-row fade-up delay-1">
          <span className="flow-label">{tr({ uz: 'Qidirish joylari:', ru: 'Где искать:' })}</span>
          {SOURCES.map((s, i) => <span key={i} className={`src-chip ${i === 2 ? 'on' : ''}`}><span aria-hidden="true">{s.ic}</span> {tr(s.t)}</span>)}
        </div>
        <div className={`split${done ? ' rv-solo' : ''}`}>
          {!done && <Col>
            <span className="flow-label fade-up delay-1">{tr({ uz: "Taksi sharhlari (o'ylab topilgan)", ru: 'Отзывы о такси (придуманные)' })}</span>
            <div className="rv-list fade-up delay-2">
              {REVIEW_ORDER.filter(i => !picks[i]).map(i => (
                <button key={i} type="button" className={`rv-row ${sel === i ? 'sel' : ''}${turnCls(lit, String(i), pend.length > 1)}`} onClick={() => setSel(s => (s === i ? -1 : i))}>
                  <span className="rv-stars" aria-hidden="true" />
                  <span className="rv-txt">{tr(REVIEWS[i].t)}</span>
                </button>
              ))}
            </div>
          </Col>}
          <div ref={binsRef} className="rv-bcol">
          <Col>
            <FlowLabel>{tr({ uz: 'Ikki quti — sharhni joylang', ru: 'Две корзины — положите отзыв' })}</FlowLabel>
            {REVIEW_BINS.map((bin, bi) => {
              const inBin = REVIEW_ORDER.filter(i => picks[i] === bin.k);
              const binMax = REVIEWS.filter(r => r.cat === bin.k).length;
              return (
                <button key={bin.k} type="button" className={`rv-bin ${bin.k} ${sel >= 0 ? 'targetable' : ''} ${shake === bin.k ? 'shake' : ''}${sel >= 0 ? waveCls(binWave, bi, REVIEW_BINS.length) : ''}`} disabled={sel < 0} onClick={() => drop(bin.k)}>
                  <span className="rv-bin-h"><i className="rv-bin-ic" aria-hidden="true" />{tr(bin.t)}<span className={`rv-bin-n${inBin.length === binMax ? ' full' : ''}`}>{inBin.length}/{binMax}</span></span>
                  {inBin.map(i => <span key={i} className="rv-att">{tr(REVIEWS[i].t)}</span>)}
                </button>
              );
            })}
          </Col>
          </div>
        </div>
        <MentorNote>{tr({ uz: "Og'zaki ayting: «Past baholi sharhlarda ba'zan odam boshidan o'tgan aniq muammo yoziladi.»", ru: 'Скажите устно: «В отзывах с низкой оценкой иногда описана конкретная проблема, которую человек пережил сам».' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== 6-EKRAN — KEYS: AIRBNB (bashorat + 3 slayd, har slaydda bitta usul) =====
const K_PREDICT = {
  ask: { uz: "2007-yil, San-Fransisko: shaharda konferensiya, mehmonxonalar to'lgan. Airbnb (turar joy topib beradigan xizmat) asoschilari nima qilishdi?", ru: '2007 год, Сан-Франциско: в городе конференция, гостиницы заполнены. Что сделали основатели Airbnb (сегодня — сервис, где находят жильё)?' },
  chips: [
    { ic: '🏨', t: { uz: 'Shoshilib shahar chetida kichik mehmonxona qurishdi', ru: 'Срочно построили маленькую гостиницу на окраине' } },
    { ic: '🛏️', t: { uz: "O'z uyidagi uchta havo matrasni ijaraga berishdi", ru: 'Сдали в аренду три надувных матраса у себя дома' } },
    { ic: '🚌', t: { uz: "Mehmonlarni qo'shni shaharlarga avtobusda yuborishdi", ru: 'Отправили гостей автобусом в соседние города' } },
  ],
  ans: 1,
};
// ===== KEYS-RASM (F-0924-07) — PmLesson1:1078-1098 / pilot B1 naqshi. Rasm faqat loyiha media-kutubxonasidan.
// «Havo matrasi qo'yilgan xona» rasmi hali yuklanmagan (RASMLAR.md A3 — foydalanuvchi qarori) → hozircha EMOJI-rejim
// (🛏️ + gradient). Rasm kelgach faqat `img` ga URL yoziladi. Rasm bashoratdan KEYIN chiqadi — javobni oldindan aytmaydi (§186).
const PHOTO_SET = {
  matras: {
    img: '',
    emoji: '🛏️',
    bg: `linear-gradient(160deg,${T.accentSoft},${T.paper})`,
    alt: { uz: "Havo matrasi qo'yilgan xona", ru: 'Комната с надувным матрасом' },
  },
};
// Emoji-rejim ham .k-fig ichida turadi — .k-slide.ph gridida rasm ustuniga tushsin (pilotda yolg'iz k-slide-ic matn ustuniga tushardi).
const Photo = ({ kind }) => {
  const sc = PHOTO_SET[kind];
  const [failed, setFailed] = useState(false);
  if (!sc) return null;
  const cap = sc.cap && <figcaption className="k-cap">{tr(sc.cap)}</figcaption>;
  if (sc.img && !failed) {
    return (
      <figure className="k-fig">
        <span className="k-photo" style={{ background: sc.bg }}><img src={sc.img} alt={tr(sc.alt)} onError={() => setFailed(true)} /></span>
        {cap}
      </figure>
    );
  }
  return (
    <figure className="k-fig">
      <span className="k-photo emo" style={{ background: sc.bg }} role="img" aria-label={tr(sc.alt)}><span className="k-slide-ic">{sc.emoji}</span></span>
      {cap}
    </figure>
  );
};
const K_SLIDES = [
  { ic: '🛏️', photo: 'matras', h: { uz: "Muammo o'z hayotidan", ru: 'Проблема из своей жизни' }, body: { uz: "Muammo asoschilarning ko'z oldida edi: shaharga kelganlarga joy yo'q edi. Uni ular o'z uyida hal qilishdi.", ru: 'Проблема была прямо перед глазами основателей: приезжим было негде жить. И решили они её у себя дома.' } },
  { ic: '🚶', h: { uz: "Boshqalarning muammosini borib izlash", ru: 'Пойти и поискать чужую проблему' }, body: { uz: "Keyinroq Airbnb'dan foydalanuvchilar ko'paymay qo'ydi. Shunda asoschilar Nyu-Yorkka borib, uylarni birma-bir aylanishdi.", ru: 'Позже пользователей у Airbnb перестало прибавляться. Тогда основатели поехали в Нью-Йорк и обошли дома один за другим.' } },
  { ic: '📷', h: { uz: "Ko'rib, muammoni aniq tushunish", ru: 'Увидеть и точно понять проблему' }, body: { uz: "Uylarni o'zlari suratga olishdi — va o'z ko'zlari bilan ko'rishdi: rasmi yomon uyni odamlar band qilmaydi.", ru: 'Они сами сфотографировали дома — и увидели своими глазами: дом с плохим фото люди не бронируют.' } },
];
const ScreenCase = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [bet, setBet] = useState(() => { const v = storedAnswer?.bet; return Number.isInteger(v) && v >= 0 && v < K_PREDICT.chips.length ? v : null; }); // F-0915-02
  const [i, setI] = useState(0);
  const last = i === K_SLIDES.length - 1;
  const betPending = bet === null;
  useEffect(() => { if (last && !betPending && storedAnswer === undefined) onAnswer(screen, { correct: true, bet }); }, [last, betPending]); // eslint-disable-line
  const betHint = useTurnHint(betPending);
  // Navbat-zanjiri: taxmin → slayd ichidagi «Keyingisi →» → (oxirida) NavNext. Slayd o'z boshqaruvi bilan (PmLesson1 k-nav, pilot B1).
  const nextTurn = useTurnHint(!betPending && !last && !isMentor);
  const c = K_SLIDES[i];
  const navLabel = isMentor || (!betPending && last) ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : betPending ? tr({ uz: 'Avval taxminingizni tanlang', ru: 'Сначала выберите свою догадку' })
    : tr({ uz: 'Avval voqeani oxirigacha oching', ru: 'Сначала откройте историю до конца' });
  return (
    <Stage eyebrow={tr({ uz: 'Haqiqiy voqea · Airbnb', ru: 'Реальная история · Airbnb' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={betPending || !last} disabled={(betPending || !last) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense kp-screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>Airbnb</span> muammoni qayerdan topdi?</>, ru: <>Где <span className="italic" style={{ color: T.accent }}>Airbnb</span> нашёл проблему?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Airbnb asoschilari muammoni qayerdan topgani sizning g'oyangiz uchun ham saboq — avval <b style={{ color: T.ink }}>uch taxmindan</b> birini belgilang.</>, ru: <>То, где основатели Airbnb нашли проблему, — урок и для вашей идеи: сначала отметьте одну из <b style={{ color: T.ink }}>трёх догадок</b>.</> })}</Mentor>
        {/* Taxmin berilgach bashorat-bloki ixchamlashadi (kp-bet.done): savol yashirinadi, faqat asl javob-chipi + natija qoladi */}
        <div className={`kp-bet fade-up delay-1${bet !== null ? ' done' : ''}`}>
          {bet === null && <h3 className="k-slide-h kp-ask">{tr(K_PREDICT.ask)}</h3>}
          <div className="kp-chips">
            {K_PREDICT.chips.map((ch, k) => {
              const locked = bet !== null;
              const isAns = k === K_PREDICT.ans;
              let cls = 'kp-chip';
              if (locked) { cls += ' locked'; if (isAns) cls += ' correct'; else if (bet === k && !isMentor) cls += ' wrong'; }
              else cls += waveCls(betHint, k, K_PREDICT.chips.length);
              return (
                <button key={k} className={cls} disabled={locked} onClick={() => setBet(k)}>
                  <span className="kp-ic">{ch.ic}</span>{tr(ch.t)}
                  {locked && isAns && <span className="kp-mark ok">✓</span>}
                  {locked && !isAns && bet === k && !isMentor && <span className="kp-mark no">✗</span>}
                </button>
              );
            })}
          </div>
          {bet === null
            ? null /* F-0925-QA03: «Birini tanlang — javobi ochiladi» olindi — mentor-gap va puls takrori (3/4-o'tish 1-darsi naqshi) */
            : !isMentor && <p className={`kp-res ${bet === K_PREDICT.ans ? 'hit' : 'miss'}`}>{bet === K_PREDICT.ans ? tr({ uz: '🎯 Topdingiz!', ru: '🎯 Угадали!' }) : tr({ uz: <>Adashdingiz — asl javob «{tr(K_PREDICT.chips[K_PREDICT.ans].t)}».</>, ru: <>Не угадали — верный ответ «{tr(K_PREDICT.chips[K_PREDICT.ans].t)}».</> })}</p>}
        </div>
        {bet !== null && (
          <div className="k-slide ph fade-step revealed" key={i}>
            <span className="k-slide-eyebrow">{tr({ uz: 'Usul', ru: 'Способ' })} {i + 1} / {K_SLIDES.length}</span>
            {c.photo ? <Photo kind={c.photo} /> : <div className="k-fig"><div className="k-slide-ic">{c.ic}</div></div>}
            <h3 className="k-slide-h">{tr(c.h)}</h3>
            <p className="k-slide-body">{tr(c.body)}</p>
            <div className="k-nav">
              <button type="button" className="btn-soft k-prev" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущий' })}</button>
              <div className="k-dots">{K_SLIDES.map((_, k) => <button key={k} type="button" className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-usul`, ru: `Способ ${k + 1}` })} />)}</div>
              {!last && <button type="button" className={`k-next${nextTurn ? ' turn-ring' : ''}`} onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Следующий →' })}</button>}
            </div>
          </div>
        )}
        {bet !== null && last && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Birinchi muammoni asoschilar o'z hayotida uchratishdi. Ikkinchisini esa uyma-uy yurib, o'z ko'zlari bilan ko'rishdi. Siz ham shunday qidirasiz: avval o'z kuningizdan, keyin odamlardan.", ru: 'Первую проблему основатели встретили в своей жизни. А вторую увидели своими глазами, обходя дома один за другим. Вы будете искать так же: сначала в своём дне, потом у людей.' })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== 7-EKRAN — ANIQ GAP YIG'ING: konstruktor (imzo-vizual) =====
// Har bo'lakda 3 variant (✓ = indeks 0), ko'rinish tartibi aralash. Noto'g'ri variant ham tugal gap beradi.
// RU: ko'plikdagi KIM tanlansa fe'l ham ko'plikka o'tadi (sg/pl).
const GAP_ROWS = [
  { k: 'kim', lbl: { uz: 'Kim?', ru: 'Кто?' }, order: [1, 0, 2], opts: [
    { uz: "to'garakdan qaytadigan o'quvchi", ru: 'возвращающийся с кружка ученик', pl: false },
    { uz: 'hamma odamlar', ru: 'все люди', pl: true },
    { uz: "shahardagi yo'lovchilar", ru: 'пассажиры в городе', pl: true },
  ], bad: { uz: "Kim ekani aniq emas: qaysi odam, qaysi vaziyatda?", ru: 'Непонятно, кто это: какой человек, в какой ситуации?' } },
  { k: 'qachon', lbl: { uz: 'Qachon?', ru: 'Когда?' }, order: [2, 1, 0], opts: [
    { uz: "kechqurun, yomg'irda", ru: 'вечером, в дождь' },
    { uz: 'ertalab, darsdan oldin', ru: 'утром, перед уроками' },
    { uz: 'dam olish kunlari', ru: 'по выходным' },
  ], bad: { uz: "Voqeada bu vaqt yo'q: o'quvchi kechqurun, yomg'irda kutgan edi", ru: 'В истории нет такого времени: ученик ждал вечером, в дождь' } },
  { k: 'ogir', lbl: { uz: "Nimasi og'ir?", ru: 'Что тяжело?' }, order: [1, 2, 0], opts: [
    { uz: "ko'chada 20 daqiqa taksi kutadi", ru: { sg: '20 минут ждёт такси на улице', pl: '20 минут ждут такси на улице' } },
    { uz: 'taksi xizmatidan norozi', ru: { sg: 'недоволен службой такси', pl: 'недовольны службой такси' } },
    { uz: 'taksi topishda qiynaladi', ru: { sg: 'с трудом находит такси', pl: 'с трудом находят такси' } },
  ], bad: { uz: "Norozi yoki qiynaladi — lekin aynan nima bo'ldi, qancha vaqt ketdi?", ru: 'Недоволен или с трудом — но что именно случилось и сколько времени ушло?' } },
];
// Voqea bo'laklarga bo'lingan (F-0925-B03): qator to'g'ri yechilganda voqeadagi o'sha bo'lak qator rangida belgilanadi —
// bola javobni «qayerdan olgani»ni ko'radi. Marker faqat to'g'ri javobdan KEYIN chiqadi (javobni oldindan aytmaydi).
const GAP_STORY = {
  uz: [{ k: 'kim', t: "To'garakdan qaytayotgan o'quvchi" }, ' ', { k: 'qachon', t: "kechqurun, yomg'irda" }, ' ', { k: 'ogir', t: "ko'chada 20 daqiqa taksi kutdi" }, '.'],
  ru: [{ k: 'kim', t: 'Ученик, возвращаясь с кружка' }, ', ', { k: 'qachon', t: 'вечером в дождь' }, ' ', { k: 'ogir', t: '20 минут ждал такси на улице' }, '.'],
};
const gapOptText = (row, idx, plural) => {
  const o = row.opts[idx];
  if (!o) return '';
  if (__lang === 'ru' && o.ru && typeof o.ru === 'object') return plural ? o.ru.pl : o.ru.sg;
  return tr(o);
};
const ScreenGapBuilder = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [sel, setSel] = useState(() => (storedAnswer && storedAnswer.correct ? { kim: 0, qachon: 0, ogir: 0 } : {}));
  const done = GAP_ROWS.every(r => sel[r.k] === 0);
  const plural = sel.kim !== undefined ? !!GAP_ROWS[0].opts[sel.kim].pl : false;
  const pick = (k, i) => {
    if (sel[k] === 0) return;
    const next = { ...sel, [k]: i };
    setSel(next);
    if (GAP_ROWS.every(r => next[r.k] === 0) && !(storedAnswer && storedAnswer.correct)) onAnswer(screen, { correct: true, solved: true });
  };
  const partTxt = (k, ph) => {
    const row = GAP_ROWS.find(r => r.k === k);
    if (sel[k] === undefined) return <span className={`gb-ph ${k}`}>{ph}</span>;
    const t = gapOptText(row, sel[k], plural);
    return <b className={`gb-fill ${k} ${sel[k] === 0 ? 'ok' : 'bad'}`}>{k === 'qachon' ? capFirst(t) : t}</b>;
  };
  const okCount = GAP_ROWS.filter(r => sel[r.k] === 0).length;
  const pendRows = GAP_ROWS.map(r => r.k).filter(k => sel[k] !== 0);
  const litRow = useTurnWalk(pendRows, !isMentor); // pilot B1 naqshi: proyektorda navbat-yurishi yo'q
  return (
    <Stage eyebrow={tr({ uz: "1-qism · Aniq gap", ru: 'Часть 1 · Точная фраза' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} turnBusy={!done} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Voqeaga mos bo'lakni tanlang (${okCount}/3)`, ru: `Выберите части по истории (${okCount}/3)` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>«Taksi yomon» gapini qanday <span className="italic" style={{ color: T.accent }}>aniq</span> qilasiz?</>, ru: <>Как сделать фразу «такси плохое» <span className="italic" style={{ color: T.accent }}>точной</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>«Taksi yomon» degan gapdan nimani tuzatish kerakligini bilib bo'lmaydi — <b style={{ color: T.ink }}>«Kim?»</b> qatoridan boshlab, har qatorda voqeaga mos bo'lakni tanlang.</>, ru: <>Из фразы «такси плохое» непонятно, что исправлять, — начиная со строки <b style={{ color: T.ink }}>«Кто?»</b>, в каждой строке выберите часть, подходящую к истории.</> })}</Mentor>
        <div className="gb-story fade-up delay-1">
          <span className="gb-story-lbl"><span aria-hidden="true">🌧️</span> {tr({ uz: 'Voqea — javobni shu yerdan topasiz', ru: 'История — ответ ищите здесь' })}</span>
          <p className="gb-story-t">{(__lang === 'ru' ? GAP_STORY.ru : GAP_STORY.uz).map((part, i) => (typeof part === 'string' ? part : <span key={i} className={`gb-mk ${part.k}${sel[part.k] === 0 ? ' on' : ''}`}>{part.t}</span>))}</p>
        </div>
        <FlowLabel>{tr({ uz: 'Siz tanlaysiz — har qatorda bittasini', ru: 'Вы выбираете — по одному в строке' })}</FlowLabel>
        <div className="gb-rows fade-up delay-2">
          {GAP_ROWS.map(row => {
            const cur = sel[row.k];
            const ok = cur === 0;
            return (
              <div key={row.k} className={`gb-row ${row.k} ${ok ? 'ok' : ''}${turnCls(litRow, row.k, pendRows.length > 1)}`}>
                <span className="gb-lbl"><i className="gb-dot" aria-hidden="true" />{tr(row.lbl)}</span>
                <div className="gb-opts">
                  {row.order.filter(i => !ok || i === 0).map(i => (
                    <button key={i} className={`gb-opt ${cur === i ? (i === 0 ? 'ok' : 'bad') : ''}`} disabled={ok} onClick={() => pick(row.k, i)}>{gapOptText(row, i, plural)}</button>
                  ))}
                </div>
                {cur !== undefined && cur !== 0 && <p className="gb-bad fade-step">✕ {tr(row.bad)}</p>}
              </div>
            );
          })}
        </div>
        <div className={`gb-sent build ${done ? 'ok' : ''}`}>
          <span className="flow-label">{tr({ uz: 'Gap', ru: 'Фраза' })}</span>
          <p className="gb-sent-t">{partTxt('qachon', '…')} {partTxt('kim', '…')} {partTxt('ogir', '…')}.</p>
        </div>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: <>Bunday gap <b>aniq muammo</b> deyiladi. «Taksi yomon» esa — nolish.</>, ru: <>Такая фраза называется <b>конкретной проблемой</b>. А «такси плохое» — это жалоба.</> })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== 8-EKRAN — TEST-2 =====
const ScreenTest2 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 2', ru: 'Проверка · 2' })} scope="module-mikro"
    question={<TestQ ask={tr({ uz: "Qaysi gapda kim, qachon va nimasi og'ir — uchalasi ham bor?", ru: 'В какой фразе есть все три части: кто, когда и что тяжело?' })} />}
    questionText={tr({ uz: "Uch bo'lagi bor gap", ru: 'Фраза со всеми тремя частями' })}
    options={[
      tr({ uz: 'Ertalab bekatda hamma odamlar avtobusni juda uzoq kutib qoladi', ru: 'Утром на остановке все люди очень долго ждут автобус' }),
      tr({ uz: "Ertalab maktabga boradigan o'quvchi bekatda avtobusni 15 daqiqa kutadi", ru: 'Утром ученик, который едет в школу, 15 минут ждёт автобус на остановке' }),
      tr({ uz: "Maktabga qatnaydigan o'quvchi bekatda avtobusni ancha uzoq kutadi", ru: 'Ученик, который ездит в школу, довольно долго ждёт автобус на остановке' }),
      tr({ uz: "Ertalab maktabga boradigan o'quvchi bekatdagi avtobusni yomon deydi", ru: 'Утром ученик, который едет в школу, называет автобус на остановке плохим' }),
    ]}
    correctIdx={INLINE_KEYS.s8}
    explainCorrect={tr({ uz: "Kim — maktabga boradigan o'quvchi. Qachon — ertalab. Nimasi og'ir — bekatda 15 daqiqa kutadi. Uchala bo'lak ham bor.", ru: 'Кто — ученик, который едет в школу. Когда — утром. Что тяжело — 15 минут ждёт на остановке. Все три части на месте.' })}
    explainWrong={{
      0: tr({ uz: "«Hamma odamlar» — kim ekani aniq emas.", ru: '«Все люди» — непонятно, кто это.' }),
      2: tr({ uz: "Bu gapda vaqt yo'q — qachon bo'lishi aytilmagan.", ru: 'В этой фразе нет времени — не сказано, когда это бывает.' }),
      3: tr({ uz: "«Yomon deydi» — aynan nima bo'lgani, qancha vaqt ketgani aytilmagan.", ru: '«Называет плохим» — не сказано, что именно случилось и сколько времени ушло.' }),
      default: tr({ uz: "Uchala bo'lak kerak: kim, qachon, nimasi og'ir.", ru: 'Нужны все три части: кто, когда, что тяжело.' }),
    }}
  />
);

// ===== G'OYA-KARTA (oldingi darsdan) — bridgeCard.js'dan O'QIYDI; yo'q bo'lsa READY_IDEAS tanlovi =====
// F-0915-02 (pilot cardSafe naqshi): kartadagi buzuq qiymat oq ekran bermasin — faqat satr maydonlar olinadi,
// yechimlar esa [{qiladi, muammo}] satr-juftlarigacha tozalanadi. Karta yo'q/buzuq bo'lsa null.
const cardSafe = () => {
  const c = cardRead();
  if (!c || typeof c !== 'object' || Array.isArray(c)) return null;
  const o = {};
  Object.keys(c).forEach(k => { if (typeof c[k] === 'string') o[k] = c[k]; });
  if (Array.isArray(c.yechimlar)) o.yechimlar = c.yechimlar.filter(s => s && typeof s === 'object').map(s => ({ qiladi: typeof s.qiladi === 'string' ? s.qiladi : '', muammo: typeof s.muammo === 'string' ? s.muammo : '' }));
  return o;
};
const ideaById = (id) => READY_IDEAS.find(x => x.id === id) || null;
// Kartaning ko'rinadigan qatorlari: o'z kartasi (kim/ogir) yoki tanlangan tayyor g'oya.
// QA: 9-ekran faqat MUAMMO ustida — YECHIM qatori ko'rsatilmaydi (u 14-ekran ishi; RU 1280x800 da ekranni skrollga chiqarardi).
const cardRows = (card, ideaId) => {
  if (card && (clean(card.kim) || clean(card.ogir))) return { kim: card.kim, ogir: card.ogir, own: true };
  const idea = ideaById(ideaId || (card && card.ideaId));
  if (idea) return { kim: tr(idea.kim), ogir: tr(idea.ogir), own: false, idea };
  return null;
};
const IdeaCard = ({ rows }) => (
  <div className="ic-card">
    <span className="ic-h">🗂 {tr({ uz: 'Kartangiz', ru: 'Ваша карточка' })}{rows.idea ? ` · ${tr(rows.idea.olam)}` : ''}</span>
    <div className="ic-row"><span className="ic-lbl kim">{tr({ uz: 'KIM', ru: 'КТО' })}</span><span className="ic-val">{rows.kim || '—'}</span></div>
    <div className="ic-row"><span className="ic-lbl ogir">{tr({ uz: 'MUAMMO', ru: 'ПРОБЛЕМА' })}</span><span className="ic-val">{rows.ogir || '—'}</span></div>
  </div>
);
const IdeaPicker = ({ value, onPick, hint = false }) => (
  <div className={`ip-box${value ? ' compact' : ''}`}>
    <span className="flow-label">{value ? tr({ uz: "Boshqa g'oya:", ru: 'Другая идея:' }) : tr({ uz: "Tayyor g'oyalardan birini tanlang", ru: 'Выберите одну из готовых идей' })}</span>
    <div className="ip-row">
      {READY_IDEAS.map((x, i) => <button key={x.id} className={`ip-chip ${value === x.id ? 'on' : ''}${waveCls(hint, i, READY_IDEAS.length)}`} onClick={() => onPick(x.id)}>{tr(x.olam)}</button>)}
    </div>
  </div>
);

// ===== 9-EKRAN — O'Z MUAMMONGIZ: ustaxona (bitta majburiy ish — uch bo'lak) =====
// F-0925-QA22: savol maydon ichida (placeholder) — o'ngdagi holat-panelida (pw-meter) shu uch savol takrorlanadi.
const PROBLEM_FIELDS = [
  { k: 'kim', lbl: { uz: 'Kim?', ru: 'Кто?' }, ph: { uz: "① Kim? (masalan: avtobus kutadigan o'quvchilar)", ru: '① Кто? (например: ученики, которые ждут автобус)' } },
  { k: 'qachon', lbl: { uz: 'Qachon?', ru: 'Когда?' }, ph: { uz: '② Qachon? (masalan: ertalab, darsdan oldin)', ru: '② Когда? (например: утром, перед уроками)' } },
  { k: 'ogir', lbl: { uz: "Nimasi og'ir?", ru: 'Что тяжело?' }, ph: { uz: "③ Nimasi og'ir? (masalan: avtobus qachon kelishini bilmaydi)", ru: '③ Что тяжело? (например: не знают, когда автобус)' } },
];
const ScreenProblemCard = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useIsMentor();
  const [card] = useState(() => cardSafe());
  const [ideaId, setIdeaId] = useState(() => (card && card.ideaId) || '');
  const [f, setF] = useState(() => (card && clean(card.qachon) ? { kim: card.kim || '', qachon: card.qachon || '', ogir: card.ogir || '' } : { kim: '', qachon: '', ogir: '' }));
  const [savedSnap, setSavedSnap] = useState(() => (card && clean(card.qachon) ? JSON.stringify({ kim: card.kim || '', qachon: card.qachon || '', ogir: card.ogir || '' }) : null));
  const [signsOpen, setSignsOpen] = useState(false);
  const [ticks, setTicks] = useState(() => new Set());
  const [ticked, setTicked] = useState(false); // eslatma faqat o'quvchi ro'yxatga tekkandan keyin chiqadi (ochilishi bilan tanbeh bermaydi)
  const signal = usePracticeSignal(screen, storedAnswer, onAnswer, live);
  const rows = cardRows(card, ideaId);
  const needIdea = !rows;
  const allFilled = PROBLEM_FIELDS.every(p => filled(f[p.k]));
  const dirty = savedSnap !== JSON.stringify(f);
  const saved = !!savedSnap && !dirty;
  const everSaved = !!savedSnap || !!(storedAnswer && storedAnswer.solved);
  const save = () => {
    if (!allFilled) return;
    const patch = { kim: clean(f.kim), qachon: clean(f.qachon), ogir: clean(f.ogir) };
    if (rows && !rows.own && rows.idea) patch.ideaId = rows.idea.id;
    cardWrite(patch);
    setSavedSnap(JSON.stringify(f));
    signal({ practice: 'problem-card', card: patch });
  };
  const firstEmpty = PROBLEM_FIELDS.findIndex(p => !filled(f[p.k]));
  const navLabel = isMentor || everSaved && !dirty ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : needIdea ? tr({ uz: "Avval tayyor g'oyani tanlang", ru: 'Сначала выберите готовую идею' })
    : firstEmpty >= 0 ? tr({ uz: `${['①', '②', '③'][firstEmpty]} «${PROBLEM_FIELDS[firstEmpty].lbl.uz}» savoliga javob yozing`, ru: `${['①', '②', '③'][firstEmpty]} Ответьте на вопрос «${PROBLEM_FIELDS[firstEmpty].lbl.ru}»` })
    : tr({ uz: '✓ «Saqlash»ni bosing', ru: '✓ Нажмите «Сохранить»' });
  const [focus, setFocus] = useState(false);
  const pend = PROBLEM_FIELDS.map(p => p.k).filter(k => !filled(f[k]));
  const lit = useTurnWalk(pend, !needIdea && !focus && !isMentor);
  const saveTurn = useTurnHint(allFilled && dirty && !isMentor);
  const ideaWave = useTurnHint(needIdea && !isMentor); // tayyor g'oya hali tanlanmagan — navbat o'ngdagi tanlovda (mentor-gap bilan bir halqa)
  const gap = gapOf(f.qachon, f.kim, f.ogir);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · kartangiz', ru: 'Практика · ваша карточка' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!saved && !isMentor} disabled={!(everSaved && !dirty) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>G'oyangizdagi muammo <span className="italic" style={{ color: T.accent }}>aniq</span> yozilganmi?</>, ru: <>Проблема вашей идеи записана <span className="italic" style={{ color: T.accent }}>точно</span>?</> })}</h2>
          <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink2 }}>{needIdea
            ? tr({ uz: "Tayyor g'oyaning muammosini uch savolga javob berib, aniq gapga aylantiring.", ru: 'Ответьте на три вопроса — и проблема готовой идеи станет точной фразой.' })
            : rows.own
              ? tr({ uz: "Kartangizdagi muammoni uch savolga javob berib, aniq gapga aylantiring.", ru: 'Ответьте на три вопроса — и проблема из вашей карточки станет точной фразой.' })
              : tr({ uz: "Tanlagan g'oyangizdagi muammoni uch savolga javob berib, aniq gapga aylantiring.", ru: 'Ответьте на три вопроса — и проблема выбранной идеи станет точной фразой.' })}</p></div>
        <Mentor>{needIdea
          ? tr({ uz: <>Muammo aniq yozilsa, uni o'qigan har kim nimani tuzatish kerakligini tushunadi — avval <b style={{ color: T.ink }}>tayyor g'oyalardan</b> birini tanlang.</>, ru: <>Когда проблема записана точно, любой, кто её прочтёт, понимает, что нужно исправить, — сначала выберите одну из <b style={{ color: T.ink }}>готовых идей</b>.</> })
          : tr({ uz: <>Muammo aniq yozilsa, uni o'qigan har kim nimani tuzatish kerakligini tushunadi — <b style={{ color: T.ink }}>«Kim?»</b> savolidan boshlang.</>, ru: <>Когда проблема записана точно, любой, кто её прочтёт, понимает, что нужно исправить, — начните с вопроса <b style={{ color: T.ink }}>«Кто?»</b>.</> })}</Mentor>
        <div className="split">
          <Col>
            <div className="pw-form fade-up delay-1">
              {PROBLEM_FIELDS.map((p) => (
                <label key={p.k} className={`pw-f ${p.k} ${filled(f[p.k]) ? 'on' : ''}${turnCls(lit, p.k, pend.length > 1)}`}>
                  <input value={f[p.k]} disabled={needIdea && !isMentor} onChange={e => setF(prev => ({ ...prev, [p.k]: e.target.value }))} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={tr(p.ph)} aria-label={tr(p.lbl)} />
                </label>
              ))}
            </div>
            <div className={`gb-sent ${allFilled ? 'ok' : ''}`}>
              <span className="flow-label">{tr({ uz: 'Aniq muammo', ru: 'Конкретная проблема' })}</span>
              <p className="gb-sent-t">{gap || <span className="gb-ph">… … …</span>}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button className={`pw-save${saveTurn ? ' turn-ring' : ''}`} disabled={!allFilled || !dirty} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
              {saved && <span className="done-mini fade-step">{tr({ uz: '✓ Karta yangilandi', ru: '✓ Карточка обновлена' })}</span>}
            </div>
            <StudentPracticePulse live={live} screen={screen} />
          </Col>
          <Col>
            {rows ? <IdeaCard rows={rows} /> : null}
            {(!card || !(clean(card.kim) || clean(card.ogir))) && <IdeaPicker value={ideaId} onPick={setIdeaId} hint={ideaWave} />}
            {/* Holat-paneli (ETALON 28): 7-ekran rang-tili bilan uch bo'lak chirog'i + saqlash — mavjud holatdan chiziladi */}
            <div className={`pw-meter fade-up delay-2${saved ? ' done' : ''}`} role="img" aria-label={`${PROBLEM_FIELDS.filter(p => filled(f[p.k])).length}/3`}>
              {['kim', 'qachon', 'ogir'].map(k => { const p = PROBLEM_FIELDS.find(x => x.k === k); return <span key={k} className={`pw-seg ${k}${filled(f[k]) ? ' on' : ''}`}><i aria-hidden="true">{filled(f[k]) ? '✓' : ''}</i>{tr(p.lbl)}</span>; })}
              <span className={`pw-seg save${saved ? ' on' : ''}`}><i aria-hidden="true">{saved ? '✓' : ''}</i>{tr({ uz: 'Saqlash', ru: 'Сохранить' })}</span>
            </div>
            <div className={`sc-box ${signsOpen ? 'open' : ''}`}>
              <button type="button" className="sc-toggle" onClick={() => setSignsOpen(o => !o)} aria-expanded={signsOpen}>{tr({ uz: 'Belgilarini tekshiring', ru: 'Проверьте признаки' })} <span aria-hidden="true">{signsOpen ? '▴' : '▾'}</span></button>
              {signsOpen && (
                <div className="sc-body fade-step">
                  {SIGNS.map((s, i) => (
                    <label key={i} className={`sc-item ${ticks.has(i) ? 'on' : ''}`}>
                      <input type="checkbox" checked={ticks.has(i)} onChange={() => { setTicked(true); setTicks(p => { const n = new Set(p); if (n.has(i)) n.delete(i); else n.add(i); return n; }); }} />
                      <span>{tr(s.name)}</span>
                    </label>
                  ))}
                  {ticks.size === 0 && <p className="sc-note">{ticked ? tr({ uz: "Belgisi yo'q muammo — hali taxmin. Sherigingizdan so'rab ko'ring.", ru: 'Проблема без признаков — пока лишь догадка. Спросите у напарника.' }) : tr({ uz: 'Muammongizda bor belgilarni belgilang.', ru: 'Отметьте признаки вашей проблемы.' })}</p>}
                </div>
              )}
            </div>
          </Col>
        </div>
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Kartasini yangilaganlar', ru: '✍️ Кто обновил карточку' })} />
        <MentorNote>{tr({ uz: <>{tr(MENTOR_WATCH)} «Belgilarini tekshiring» ro'yxatini sinf bilan og'zaki ko'ring.</>, ru: <>{tr(MENTOR_WATCH)} Список «Проверьте признаки» разберите с классом устно.</> })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== 10-EKRAN — HAR JOY BITTA JAVOB: brendsiz taksi ilovasi sxemasi (imzo-vizual) =====
const APP_SPOTS = [
  { k: 'narx', ic: '💰', lbl: { uz: 'Narx', ru: 'Цена' }, t: { uz: "Narx oldindan ko'rinadi — haydovchi bilan narx talashilmaydi", ru: 'Цена видна заранее — не нужно торговаться с водителем' } },
  { k: 'xarita', ic: '🗺️', lbl: { uz: 'Xarita', ru: 'Карта' }, t: { uz: 'Mashina xaritada keladi — qancha kutish kerakligi bilinadi', ru: 'Машина едет по карте — понятно, сколько ждать' } },
  { k: 'haydovchi', ic: '🚗', lbl: { uz: 'Haydovchi', ru: 'Водитель' }, t: { uz: "Haydovchi ismi va mashina raqami — begona mashinaga o'tirilmaydi", ru: 'Имя водителя и номер машины — в чужую машину никто не сядет' } },
  { k: 'baho', ic: '⭐', lbl: { uz: 'Baho', ru: 'Оценка' }, t: { uz: "Safardan keyin baho — keyingi yo'lovchi haydovchini oldindan biladi", ru: 'Оценка после поездки — следующий пассажир заранее знает, какой водитель' } },
];
// Ilova xaritasi (brendsiz): ko'chalar, yo'nalish chizig'i, mashina yo'l bo'ylab yuradi, yo'lovchi nuqtasi «nafas oladi».
// Harakat SVG animateMotion bilan; prefers-reduced-motion'da mashina yo'lning o'rtasida turadi.
const TAXI_ROUTE = 'M26 160 C 70 158, 78 108, 128 104 S 196 70, 212 52 S 250 30, 266 30';
const TaxiMap = () => {
  const still = reducedMotion();
  return (
    <svg className="ta-svg" viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="300" height="190" className="ta-ground" />
      <rect x="170" y="112" width="90" height="56" rx="10" className="ta-park" />
      <g className="ta-street"><path d="M0 132 H300" /><path d="M0 64 H300" /><path d="M96 0 V190" /><path d="M232 0 V190" /><path d="M0 18 L150 190" className="thin" /></g>
      <path d={TAXI_ROUTE} className="ta-route" />
      <g className="ta-pick" transform="translate(266 30)"><circle r="14" className="ta-pick-halo" /><circle r="6" className="ta-pick-dot" /></g>
      <g className="ta-cab" transform={still ? 'translate(128 104)' : undefined}>
        {!still && <animateMotion dur="6s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;1" keyTimes="0;0.8;1" calcMode="linear" path={TAXI_ROUTE} />}
        <rect x="-11" y="-6.5" width="22" height="13" rx="4" className="ta-cab-body" /><rect x="1" y="-4.5" width="6" height="9" rx="1.5" className="ta-cab-glass" />
      </g>
    </svg>
  );
};
const ScreenApp = ({ screen, onNext, onPrev }) => {
  const _g = useContext(LiveGateCtx); const isMentor = !!(_g && _g.live && _g.live.mode === 'mentor'); // mentor jonli darsda kartalarni ochmasdan ham o'ta oladi (hook-ekran naqshi)
  const [opened, setOpened] = useState(() => new Set());
  const [seen, setSeen] = useState(() => new Set());
  const toggle = (i) => {
    setOpened(p => { const n = new Set(p); if (n.has(i)) n.delete(i); else n.add(i); return n; });
    setSeen(p => { if (p.has(i)) return p; const n = new Set(p); n.add(i); return n; });
  };
  const allSeen = seen.size >= APP_SPOTS.length;
  const pend = APP_SPOTS.map((_, i) => String(i)).filter(k => !seen.has(Number(k)));
  const lit = useTurnWalk(pend, !isMentor); // pilot B1 naqshi: proyektorda navbat-yurishi yo'q
  const left = APP_SPOTS.length - seen.size;
  const spot = (i) => (
    <button type="button" className={`ta-spot ${opened.has(i) ? 'on' : ''} ${seen.has(i) ? 'seen' : ''}${turnCls(lit, String(i), pend.length > 1)}`} onClick={() => toggle(i)} aria-expanded={opened.has(i)} aria-label={tr(APP_SPOTS[i].lbl)}>{seen.has(i) ? '✓' : i + 1}</button>
  );
  return (
    <Stage eyebrow={tr({ uz: '2-qism · Muammodan yechimga', ru: 'Часть 2 · От проблемы к решению' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!allSeen && !isMentor} turnBusy={!allSeen} label={allSeen ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Yana ${left} ta raqamni bosing`, ru: `Нажмите ещё номера: ${left}` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Taksi ilovasidagi har bir sahifa <span className="italic" style={{ color: T.accent }}>qaysi muammoni</span> yo'qotadi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Какую проблему</span> убирает каждая часть приложения такси?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Yomg'irli kechada uyga yetish ilova bilan nega osonlashganini shu to'rt joy ko'rsatadi — ilova sxemasidagi <b style={{ color: T.ink }}>raqamlarni</b> birma-bir bosing.</>, ru: <>Почему с приложением добраться домой дождливым вечером стало проще, показывают эти четыре места, — нажмите по очереди на <b style={{ color: T.ink }}>номера</b> на схеме приложения.</> })}</Mentor>
        <Zoomable className="zsplit">
        <div className="split">
          {/* F-0925-QA10: foydalanuvchi — ustunlar joyi almashdi: chapda «To'rt joy» ro'yxati, o'ngda ilova sxemasi */}
          <Col>
            <FlowLabel>{tr({ uz: "To'rt joy — qaysi muammo?", ru: 'Четыре места — какая проблема?' })}</FlowLabel>
            <div className="ta-list fade-up delay-2">
              {APP_SPOTS.map((s, i) => (
                <div key={s.k} className={`ta-item ${opened.has(i) ? 'on' : ''}`}>
                  <span className="ta-item-n">{i + 1}</span>
                  <span className="ta-item-t">{opened.has(i) ? (() => { const [sol, prob] = tr(s.t).split(' — '); return <span className="fade-step ta-pair"><b className="ta-sol">{s.ic} {sol}</b>{prob && <span className="ta-prob">✓ {prob}</span>}</span>; })() : <span className="ta-item-q">{s.ic} {tr(s.lbl)} · ?</span>}</span>
                </div>
              ))}
            </div>
            {allSeen && <div className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: <>Bitta muammoga javob beradigan narsa <b>yechim</b> deyiladi.</>, ru: <>То, что отвечает на одну проблему, называется <b>решением</b>.</> })}</p></div>}
          </Col>
          <Col>
            <FlowLabel>{tr({ uz: 'Ilova sxemasi — raqamni bosing', ru: 'Схема приложения — нажмите номер' })}</FlowLabel>
            <div className="ta-phone fade-up delay-1" aria-label={tr({ uz: 'Taksi ilovasi sxemasi', ru: 'Схема приложения такси' })}>
              <i className="ta-notch" aria-hidden="true" />
              <div className={`ta-map${opened.has(1) ? ' lit' : ''}`}>
                <TaxiMap />
                <span className="ta-eta">🚕 {tr({ uz: '3 daqiqa', ru: '3 мин' })}</span>
                <span className="ta-spot-at xarita">{spot(1)}</span>
              </div>
              <div className="ta-sheet">
                <i className="ta-handle" aria-hidden="true" />
                <div className={`ta-block narx${opened.has(0) ? ' lit' : ''}`}><span className="ta-coin" aria-hidden="true" /><span className="ta-lines"><span className="ta-sub">{tr({ uz: "To'garak → Uy", ru: 'Кружок → Дом' })}</span><b className="ta-price">{tr({ uz: "18 000 so'm", ru: '18 000 сум' })}</b></span><span className="ta-spot-at">{spot(0)}</span></div>
                <div className={`ta-block haydovchi${opened.has(2) ? ' lit' : ''}`}><span className="ta-ava" aria-hidden="true" /><span className="ta-lines"><span className="ta-sub">{tr({ uz: 'Sardor · oq Cobalt', ru: 'Сардор · белый Cobalt' })}</span><span className="ta-plate"><i>01</i>A 123 BC</span></span><span className="ta-spot-at">{spot(2)}</span></div>
                <div className={`ta-block baho${opened.has(3) ? ' lit' : ''}`}><span className="ta-lines"><span className="ta-stars" aria-hidden="true" /><span className="ta-sub">{tr({ uz: 'Safarni baholang', ru: 'Оцените поездку' })}</span></span><span className="ta-spot-at">{spot(3)}</span></div>
              </div>
            </div>
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== 11-EKRAN — TEST-3 =====
const ScreenTest3 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 3', ru: 'Проверка · 3' })} scope="module-mikro"
    question={<TestQ lead={tr({ uz: "Taksi ilovasi jamoasida kimdir taklif qildi: «Ilova ochilganda chiroyli animatsiya qo'shaylik».", ru: 'В команде приложения такси кто-то предложил: «Давайте добавим красивую анимацию при открытии приложения».' })} ask={tr({ uz: 'Birinchi qaysi savolni berasiz?', ru: 'Какой вопрос вы зададите первым?' })} />}
    questionText={tr({ uz: 'Animatsiya taklifiga birinchi savol', ru: 'Первый вопрос к предложению с анимацией' })}
    options={[
      tr({ uz: "Bu animatsiya necha kunda tayyor bo'ladi?", ru: 'За сколько дней будет готова эта анимация?' }),
      tr({ uz: 'Bu animatsiya qaysi rangda chiroyliroq?', ru: 'В каком цвете эта анимация красивее?' }),
      tr({ uz: 'Boshqa ilovalarda ham animatsiya bormi?', ru: 'А в других приложениях анимация есть?' }),
      tr({ uz: 'Bu kimning qaysi muammosini hal qiladi?', ru: 'Чью и какую проблему это решает?' }),
    ]}
    correctIdx={INLINE_KEYS.s11}
    explainCorrect={tr({ uz: "Har yechim bitta muammoga javob beradi. Avval muammo topiladi — rang va muddat keyin so'raladi.", ru: 'Каждое решение отвечает на одну проблему. Сначала находят проблему — про цвет и сроки спрашивают потом.' })}
    explainWrong={{
      // Har noto'g'ri variantga alohida izoh (F-0924-06, spec 9.4): avval rost tomoni, keyin yo'naltiruvchi savol.
      0: tr({ uz: "Muddatni ham bilish kerak — lekin keyinroq. Animatsiya hech kimga kerak bo'lmasa, uni necha kunda qurishning nima ahamiyati bor?", ru: 'Срок тоже нужно знать — но позже. Если анимация никому не нужна, какая разница, за сколько дней её сделают?' }),
      1: tr({ uz: "Rangni tanlash ham kerak bo'ladi — lekin keyinroq. Avval o'ylang: animatsiya yo'lovchining qaysi qiyinchiligini yo'qotadi?", ru: 'Цвет тоже придётся выбрать — но позже. Сначала подумайте: какую трудность пассажира убирает анимация?' }),
      2: tr({ uz: "Boshqa ilovalarni ko'rish foydali — bu to'g'ri. Lekin boshqa ilovada borligi sizning yo'lovchingizga u kerakligini bildirmaydi.", ru: 'Смотреть на другие приложения полезно — это правда. Но то, что она есть в другом приложении, не значит, что она нужна вашему пассажиру.' }),
      default: tr({ uz: "Bu savol keyin kerak bo'ladi. Birinchisi — bu kimning qaysi muammosini hal qiladi?", ru: 'Этот вопрос понадобится позже. Первый — чью и какую проблему это решает?' }) }}
  />
);

// ===== 12-EKRAN — JUFTINI TOPING: 4 yechim → 3 muammo + «Muammosi topilmadi» qutisi =====
const MATCH_SOLS = [
  { t: { uz: 'Turgan joyni xaritada belgilash', ru: 'Отметить на карте, где стоишь' }, to: 0 },
  { t: { uz: "Yo'l haqini do'stlar orasida bo'lish", ru: 'Разделить оплату поездки между друзьями' }, to: 1 },
  { t: { uz: 'Safarni ota-onaga havola bilan yuborish', ru: 'Отправить поездку родителям ссылкой' }, to: 2 },
  { t: { uz: "Ilova ochilganda foydalanuvchiga kunning motivatsion xabarini ko'rsatish", ru: 'Показывать пользователю мотивирующую фразу дня при открытии приложения' }, to: 'none' },
];
const MATCH_PROBS = [
  { uz: "Haydovchi yo'lovchini topolmay qoladi", ru: 'Водитель не может найти пассажира' },
  { uz: "Do'stlar pulni bo'lishda adashib ketadi", ru: 'Друзья путаются, когда делят деньги' },
  { uz: 'Ota-ona farzandi uchun xavotir oladi', ru: 'Родители волнуются за ребёнка' },
];
const MATCH_SOL_ORDER = [2, 0, 3, 1];   // barqaror tartib (StrictMode-safe)
const MATCH_TGT_ORDER = [1, 2, 0, 'none'];
const ScreenMatch = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [placed, setPlaced] = useState(() => (storedAnswer && storedAnswer.correct ? { 0: 0, 1: 1, 2: 2, 3: 'none' } : {}));
  const [sel, setSel] = useState(-1);
  const [shake, setShake] = useState(null);
  const done = MATCH_SOLS.every((_, i) => placed[i] !== undefined);
  // F-0925-B04: to'g'ri juftlangan taklif chap ustundan muammo kartasining ichiga UCHIB kiradi, qolgan takliflar esa
  // bo'shagan joyga suriladi (FLIP, Web Animations). O'lchov — bosishdan oldin; animatsiya — yangi joy chizilishidan oldin.
  const solEls = useRef({});
  const attEls = useRef({});
  const fly = useRef(null);
  useLayoutEffect(() => {
    const f = fly.current; fly.current = null;
    if (!f || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    const go = (el, r0, lift) => {
      if (!el || !r0 || !el.animate) return;
      const r1 = el.getBoundingClientRect();
      const dx = r0.left - r1.left, dy = r0.top - r1.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      if (lift) { el.style.animation = 'none'; el.style.position = 'relative'; el.style.zIndex = '5'; }
      el.animate([{ transform: `translate(${dx}px, ${dy}px)`, opacity: lift ? 0.9 : 1 }, { transform: 'none', opacity: 1 }], { duration: lift ? 460 : 300, easing: 'cubic-bezier(.2,.8,.2,1)' });
    };
    go(attEls.current[f.i], f.from[f.i], true);
    Object.keys(solEls.current).forEach(k => go(solEls.current[k], f.from[k], false));
  }, [placed]);
  const tryTarget = (tg) => {
    if (sel < 0) return;
    if (MATCH_SOLS[sel].to === tg) {
      const from = {}; Object.keys(solEls.current).forEach(k => { from[k] = solEls.current[k].getBoundingClientRect(); });
      fly.current = { i: sel, from };
      const next = { ...placed, [sel]: tg };
      setPlaced(next); setSel(-1);
      if (MATCH_SOLS.every((_, i) => next[i] !== undefined) && !(storedAnswer && storedAnswer.correct)) onAnswer(screen, { correct: true, solved: true });
    } else {
      setShake(String(tg)); setTimeout(() => setShake(s => (s === String(tg) ? null : s)), 480);
    }
  };
  const pendSols = MATCH_SOL_ORDER.filter(i => placed[i] === undefined).map(String);
  const lit = useTurnWalk(pendSols, sel < 0 && !done && !isMentor);
  const tgtWave = useTurnHint(sel >= 0); // taklif tanlangach — bo'sh muammo-qutilar to'lqin bilan (lahzada bittasi)
  const left = MATCH_SOLS.length - Object.keys(placed).length;
  const solsAt = (tg) => MATCH_SOLS.map((s, i) => (placed[i] === tg ? i : null)).filter(x => x !== null);
  return (
    <Stage eyebrow={tr({ uz: '2-qism · Muammodan yechimga', ru: 'Часть 2 · От проблемы к решению' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} turnBusy={!done} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : sel < 0 ? tr({ uz: `Avval taklifni tanlang (yana ${left} ta)`, ru: `Сначала выберите предложение (осталось ${left})` }) : tr({ uz: 'Endi uning muammosini bosing', ru: 'Теперь нажмите его проблему' })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har yechimning <span className="italic" style={{ color: T.accent }}>o'z muammosi</span> bormi?</>, ru: <>Есть ли у каждого решения <span className="italic" style={{ color: T.accent }}>своя проблема</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Har taklif bitta muammoga javob berishi kerak — avval <b style={{ color: T.ink }}>taklifni</b> bosing, so'ng uning muammosini tanlang.</>, ru: <>Каждое предложение должно отвечать на одну проблему, — сначала нажмите на <b style={{ color: T.ink }}>предложение</b>, потом выберите его проблему.</> })}</Mentor>
        {/* F-0925-B04: ikki ustun — chapda 💡 takliflar (sariq, «g'oya»), o'ngda 😣 muammolar (shaftoli, «og'riq»): qaysi biri nima ekani rangdan ko'rinadi */}
        <div className="mt-board fade-up delay-1">
          <div className="mt-col sols">
            <FlowLabel><span aria-hidden="true">💡</span> {done ? tr({ uz: 'Takliflar', ru: 'Предложения' }) : tr({ uz: 'Takliflar — birini tanlang', ru: 'Предложения — выберите одно' })}</FlowLabel>
            <div className="mt-pool">
              {MATCH_SOL_ORDER.filter(i => placed[i] === undefined).map(i => (
                <button key={i} ref={(el) => { if (el) solEls.current[i] = el; else delete solEls.current[i]; }} className={`mt-sol ${sel === i ? 'sel' : ''}${turnCls(lit, String(i), pendSols.length > 1)}`} onClick={() => setSel(s => (s === i ? -1 : i))}>{tr(MATCH_SOLS[i].t)}</button>
              ))}
              {done && <p className="mt-pool-done fade-step">✓ {tr({ uz: 'Hammasi juftlandi', ru: 'Все пары найдены' })}</p>}
            </div>
          </div>
          <div className="mt-col tgts">
            <FlowLabel><span aria-hidden="true">😣</span> {tr({ uz: 'Muammolar — juftini bosing', ru: 'Проблемы — нажмите пару' })}</FlowLabel>
            <div className="mt-targets">
              {(() => { const open = MATCH_TGT_ORDER.filter(t => !solsAt(t).length); return MATCH_TGT_ORDER.map(tg => {
                const at = solsAt(tg);
                const wi = open.indexOf(tg);
                const isNone = tg === 'none';
                return (
                  <button key={String(tg)} type="button" className={`mt-tgt ${isNone ? 'none' : ''} ${at.length ? 'filled' : ''} ${shake === String(tg) ? 'shake' : ''} ${sel >= 0 && !at.length ? 'targetable' : ''}${sel >= 0 && wi >= 0 ? waveCls(tgtWave, wi, open.length) : ''}`} disabled={at.length > 0 || sel < 0} onClick={() => tryTarget(tg)}>
                    <span className="mt-tgt-h"><i className="mt-ic" aria-hidden="true" />{isNone ? tr({ uz: 'Muammosi topilmadi', ru: 'Проблема не найдена' }) : tr(MATCH_PROBS[tg])}</span>
                    {at.map(i => <span key={i} ref={(el) => { if (el) attEls.current[i] = el; else delete attEls.current[i]; }} className="mt-att">{tr(MATCH_SOLS[i].t)}</span>)}
                  </button>
                );
              }); })()}
            </div>
          </div>
        </div>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Muammosi topilmagan yechim ro'yxatdan chiqadi.", ru: 'Решение без проблемы уходит из списка.' })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== 13-EKRAN — TEST-4 =====
const ScreenTest4 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 4', ru: 'Проверка · 4' })} scope="module-mikro"
    question={<TestQ ask={tr({ uz: "Qaysi yechimda ilova nima qilishi va qaysi muammo yo'qolishi aniq aytilgan?", ru: 'В каком решении точно сказано, что делает приложение и какая проблема исчезает?' })} />}
    questionText={tr({ uz: "Nima qiladi va qaysi muammo yo'qoladi", ru: 'Что делает и какая проблема исчезает' })}
    options={[
      tr({ uz: "Ilova mashina kelganda xabar yuboradi — yo'lovchi ko'chada ortiqcha kutmaydi", ru: 'Приложение присылает уведомление, когда машина приехала, — пассажир не ждёт на улице лишнего' }),
      tr({ uz: "Ilova yangi, qulay va zamonaviy ko'rinishda bo'ladi — odamlarga ko'proq yoqadi", ru: 'Приложение будет новым, удобным и современным на вид — людям понравится больше' }),
      tr({ uz: "Ilova chiroyli dizayn bilan ishlaydi — yo'lovchilar undan xursand bo'ladi", ru: 'Приложение работает с красивым дизайном — пассажиры будут им довольны' }),
      tr({ uz: "Ilova eng yaxshi taksi xizmatini beradi — mijozlari tez ko'payib boradi", ru: 'Приложение даёт лучший сервис такси — клиентов быстро становится больше' }),
    ]}
    correctIdx={INLINE_KEYS.s13}
    explainCorrect={tr({ uz: "Nima qiladi — mashina kelganda xabar yuboradi. Qaysi muammo yo'qoladi — ko'chada ortiqcha kutish.", ru: 'Что делает — присылает уведомление, когда машина приехала. Какая проблема исчезает — лишнее ожидание на улице.' })}
    explainWrong={{
      // Har noto'g'ri variantga alohida izoh (F-0924-06, spec 9.4): avval rost tomoni, keyin yo'naltiruvchi savol.
      1: tr({ uz: "Qulay ko'rinish odamlarga yoqadi — bu rost. Lekin «yangi, qulay, zamonaviy» — maqtov so'zlari: ilova aynan nima qiladi?", ru: 'Удобный вид людям нравится — это правда. Но «новый, удобный, современный» — хвалебные слова: что именно делает приложение?' }),
      2: tr({ uz: "Chiroyli dizayn yo'lovchini xursand qilishi mumkin. Lekin gapda ilova nima qilishi ham, qaysi muammo yo'qolishi ham aytilmagan.", ru: 'Красивый дизайн может порадовать пассажира. Но в этой фразе не сказано ни что делает приложение, ни какая проблема исчезает.' }),
      3: tr({ uz: "Mijozlar ko'payishi jamoa uchun yaxshi — bu rost. Lekin «eng yaxshi xizmat» aniq ish emas: yo'lovchining qaysi muammosi yo'qoladi?", ru: 'Рост числа клиентов хорош для команды — это правда. Но «лучший сервис» — не конкретное действие: какая проблема пассажира исчезает?' }),
      default: tr({ uz: "Bu gapda ilova aynan nima qilishi aytilmagan — faqat maqtov so'zlari bor.", ru: 'В этой фразе не сказано, что именно делает приложение, — есть только хвалебные слова.' }) }}
  />
);

// ===== 14-EKRAN — O'Z YECHIMLARINGIZ: ustaxona (2 yechim-karta) =====
// Maqtov-tekshiruvi SO'Z darajasida (B4 naqshi, pm-tekshiruvchi 24.09): maqtov-so'z gapda uchragani uchun emas,
// javobda HARAKAT yo'q bo'lsa ushlanadi. «darajasi yaxshi jamoadosh topib beradi», «qulay vaqtni ko'rsatadi»,
// «отправляет классному руководителю» — yechim nima qilishi aytilgan, o'tadi. Shubhali holatda o'tkaziladi.
// Maqtov-so'z BUTUN so'z: «noqulay», «неудобно» (muammo so'zi), «yaxshilaydi», «qulaylashtiradi» (harakat) ushlanmaydi;
// inkor («qulay emas», «не удобно») ham. «отличник», «классный руководитель/журнал/час» — maktab so'zi, maqtov emas.
const solWords = (s) => (clean(s).toLowerCase().replace(/[\u02bb\u02bc\u2018\u2019\u0060\u00b4]/g, "'")
  .match(/[a-z']+|[\u0430-\u044f\u0451\u045e\u049b\u0493\u04b3]+/g) || []).map(w => w.replace(/^'+|'+$/g, '')).filter(Boolean);
const SIFAT_UZ = /^(?:chiroyli|zamonaviy|qulay|yaxshi|zo'?r|ajoyib)(?:roq|dir)?$/;
const SIFAT_RU_WORDS = { ru: ['красив', 'современн', 'удобн', 'хорош', 'классн', 'отличн(?!ик|иц)'] };
const SIFAT_RU = new RegExp('^(?:' + SIFAT_RU_WORDS.ru.join('|') + ')');
const MAKTAB_RU = { ru: ['^классн', '^(?:руковод|журнал|час(?:а|у|ом|е)?$|комнат)'] };
const MAKTAB_A = new RegExp(MAKTAB_RU.ru[0]), MAKTAB_B = new RegExp(MAKTAB_RU.ru[1]);
const RU_NE = '\u043d\u0435';
// Harakat EMAS fe'llar — bog'lama va baho: «bo'ladi», «ishlaydi», «yoqadi», «будет», «выглядит», «понравится».
const BOGLAMA_UZ = /^(?:bo'l(?:adi|gan)|ishlaydi|hisoblanadi|ko'rin(?:adi|ish[a-z']*)|yoqadi)$/;
const BOGLAMA_RU_WORDS = { ru: ['будет', 'будут', 'станет', 'есть', 'работает', 'выглядит', 'является', 'нравится', 'понравится'] };
const BOGLAMA_RU = new RegExp('^(?:' + BOGLAMA_RU_WORDS.ru.join('|') + ')$');
// Fe'l belgisi (B4 ro'yxati): o'zbekcha kesim/harakat nomi qo'shimchasi, ruscha fe'l oxiri — keng, shubhada o'tkazadi.
const FEL_UZ = /(?:di|moqda|moqchi|yapti|gan|ish|ash)$/;
const FEL_RU_WORDS = { ru: ['ет', 'ёт', 'ит', 'ют', 'ут', 'ат', 'ят', 'ть', 'тся', '[аяие]л', '[аяие]л[аои]'] };
const FEL_RU = new RegExp('(?:' + FEL_RU_WORDS.ru.join('|') + ')$');
const sifatWord = (s) => {
  const w = solWords(s);
  const sif = w.map((x, i) => (SIFAT_UZ.test(x) && w[i + 1] !== 'emas')
    || (SIFAT_RU.test(x) && w[i - 1] !== RU_NE && !(MAKTAB_A.test(x) && MAKTAB_B.test(w[i + 1] || ''))));
  const hit = w.find((_, i) => sif[i]);
  if (!hit) return null;
  const harakat = w.some((x, i) => !sif[i] && !BOGLAMA_UZ.test(x) && !BOGLAMA_RU.test(x) && (FEL_UZ.test(x) || FEL_RU.test(x)));
  return harakat ? null : hit;
};
const normTxt = (s) => clean(s).toLowerCase().replace(/[.,!?«»"']/g, '').replace(/\s+/g, ' ');
const solHint = (qiladi, ogir) => {
  const q = normTxt(qiladi);
  if (!q) return null;
  const o = normTxt(ogir);
  if (o && (q === o || (o.length >= 6 && q.includes(o)) || (q.length >= 6 && o.includes(q)))) return tr({ uz: "Bu muammoning o'zi. Yechimingiz unga qarshi nima qiladi?", ru: 'Это сама проблема. Что ваше решение делает против неё?' });
  const sm = sifatWord(qiladi);
  if (sm) return tr({ uz: `«${sm}» — maqtov so'zi. Yechimingiz aynan nima qiladi?`, ru: `«${sm}» — хвалебное слово. Что именно делает ваше решение?` });
  if (q.split(' ').length < 3) return tr({ uz: "Yana bir-ikki so'z qo'shing: yechimingiz nima qiladi?", ru: 'Добавьте ещё пару слов: что делает ваше решение?' });
  return null;
};
const solOk = (s, ogir) => filled(s.qiladi) && !solHint(s.qiladi, ogir) && filled(s.muammo);
const ScreenSolutions = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useIsMentor();
  const [card] = useState(() => cardSafe());
  const ogir = (card && card.ogir) || '';
  const problem = card && clean(card.qachon) ? gapOf(card.qachon, card.kim, card.ogir) : (card && clean(card.ogir) ? capFirst(clean(card.ogir)) : '');
  const init = card && Array.isArray(card.yechimlar) ? card.yechimlar : [];
  const [sols, setSols] = useState(() => [0, 1].map(i => ({ qiladi: (init[i] && init[i].qiladi) || '', muammo: (init[i] && init[i].muammo) || '' })));
  const [savedSnap, setSavedSnap] = useState(() => (init.length >= 2 ? JSON.stringify(init.slice(0, 2).map(s => ({ qiladi: s.qiladi || '', muammo: s.muammo || '' }))) : null));
  const signal = usePracticeSignal(screen, storedAnswer, onAnswer, live);
  const setS = (i, patch) => setSols(prev => prev.map((s, k) => (k === i ? { ...s, ...patch } : s)));
  const oks = sols.map(s => solOk(s, ogir));
  const allOk = oks.every(Boolean);
  const dirty = savedSnap !== JSON.stringify(sols);
  const saved = !!savedSnap && !dirty;
  const save = () => {
    if (!allOk) return;
    const yechimlar = sols.map(s => ({ qiladi: clean(s.qiladi), muammo: clean(s.muammo) }));
    cardWrite({ yechimlar });
    setSavedSnap(JSON.stringify(sols));
    signal({ practice: 'solutions', yechimlar });
  };
  const everSaved = !!savedSnap || !!(storedAnswer && storedAnswer.solved);
  const firstBad = oks.findIndex(x => !x);
  const navLabel = isMentor || everSaved && !dirty ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : firstBad >= 0 ? tr({ uz: `${['①', '②'][firstBad]} ${firstBad + 1}-yechimni yozing`, ru: `${['①', '②'][firstBad]} Напишите решение ${firstBad + 1}` })
    : tr({ uz: '✓ «Saqlash»ni bosing', ru: '✓ Нажмите «Сохранить»' });
  const saveTurn = useTurnHint(allOk && dirty && !isMentor);
  // Navbat-pulsi (88-qonun): bajarilmagan maydonlar bo'ylab — kalitlar satr («0q»…), raqam emas; yozayotganda o'chadi.
  const [focus, setFocus] = useState(false);
  const pendF = sols.flatMap((s, i) => [!(filled(s.qiladi) && !solHint(s.qiladi, ogir)) && `${i}q`, !filled(s.muammo) && `${i}m`]).filter(Boolean);
  const litF = useTurnWalk(pendF, !focus && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · yechimlaringiz', ru: 'Практика · ваши решения' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!saved && !isMentor} disabled={!(everSaved && !dirty) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sizning muammongizga qaysi <span className="italic" style={{ color: T.accent }}>ikki yechim</span> javob beradi?</>, ru: <>Какие <span className="italic" style={{ color: T.accent }}>два решения</span> отвечают на вашу проблему?</> })}</h2>
          <p className="small fade-up delay-1" style={{ color: T.ink2 }}>{tr({ uz: 'Avval yozgan muammongizni o\'qing. Yechim shu muammoga javob berishi kerak.', ru: 'Сначала прочитайте проблему, которую вы записали. Решение должно отвечать именно на неё.' })}</p></div>
        <Mentor>{tr({ uz: <>Yechim nima qilishi aniq yozilsa, u muammoni yo'qotadimi-yo'qmi bir qarashda ko'rinadi — har kartada <b style={{ color: T.ink }}>«Nima qiladi?»</b> qatoridan boshlang.</>, ru: <>Когда точно написано, что делает решение, сразу видно, убирает ли оно проблему, — в каждой карточке начните со строки <b style={{ color: T.ink }}>«Что делает?»</b>.</> })}</Mentor>
        <div className="sl-problem fade-up delay-1"><span className="ic-lbl ogir">{tr({ uz: 'MUAMMO', ru: 'ПРОБЛЕМА' })}</span><span className="sl-problem-t">{problem || '—'}</span></div>
        <div className="sl-grid fade-up delay-2">
          {sols.map((s, i) => {
            const hint = solHint(s.qiladi, ogir);
            const qOk = filled(s.qiladi) && !hint;
            return (
              <div key={i} className={`sl-card ${oks[i] ? 'ok' : ''}`}>
                <span className="sl-n" style={{ color: oks[i] ? T.success : T.accent }}><i className="sl-n-dot" aria-hidden="true" />{tr({ uz: `${i + 1}-yechim`, ru: `Решение ${i + 1}` })}</span>
                <label className={`pw-f ${qOk ? 'on' : ''}${turnCls(litF, `${i}q`, pendF.length > 1)}`}><input value={s.qiladi} onChange={e => setS(i, { qiladi: e.target.value })} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={tr({ uz: 'Nima qiladi? (masalan: vaqtida eslatadi)', ru: 'Что делает? (например: вовремя напоминает)' })} aria-label={tr({ uz: 'Nima qiladi?', ru: 'Что делает?' })} /></label>
                {hint && <p className="sl-hint fade-step">💡 {hint}</p>}
                <label className={`pw-f ${filled(s.muammo) ? 'on' : ''}${turnCls(litF, `${i}m`, pendF.length > 1)}`}><input value={s.muammo} onChange={e => setS(i, { muammo: e.target.value })} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={tr({ uz: "Qaysi muammoni yo'qotadi? (masalan: vaqtni unutish)", ru: 'Какую проблему убирает? (например: забывчивость)' })} aria-label={tr({ uz: "Qaysi muammoni yo'qotadi?", ru: 'Какую проблему убирает?' })} /></label>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button className={`pw-save${saveTurn ? ' turn-ring' : ''}`} disabled={!allOk || !dirty} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
          {saved && <span className="done-mini fade-step">{tr({ uz: '✓ Karta yangilandi', ru: '✓ Карточка обновлена' })}</span>}
        </div>
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Ikki yechim yozganlar', ru: '✍️ Кто написал два решения' })} />
        <MentorNote>{tr(MENTOR_WATCH)}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== 15-EKRAN — AI BILAN SAVOLLAR (maqsad bir gapda · so'rov DOIM ochiq AiStep ichida · 🛟 zaxira — 5 tayyor savol) =====
const QS_KEY = 'bridge-b2-savollar';
const readQs = () => { try { const a = JSON.parse(localStorage.getItem(QS_KEY) || 'null'); return Array.isArray(a) && a.every(x => typeof x === 'string') ? a : null; } catch { return null; } };
const writeQs = (a) => { try { localStorage.setItem(QS_KEY, JSON.stringify(a)); } catch { /* jim */ } };
const READY_QS = [
  { uz: "Oxirgi marta bu qachon bo'ldi?", ru: 'Когда это было в последний раз?' },
  { uz: "O'sha payt nima qildingiz?", ru: 'Что вы тогда сделали?' },
  { uz: "Eng ko'p nimasi og'ir bo'ldi?", ru: 'Что было тяжелее всего?' },
  { uz: "Buni hal qilish uchun nima sinab ko'rgansiz?", ru: 'Что вы уже пробовали, чтобы это решить?' },
  { uz: 'Bu qanchalik tez-tez takrorlanadi?', ru: 'Как часто это повторяется?' },
];
const aiPrompt = (card) => {
  const q = clean(card && card.qachon) || tr({ uz: '[QACHON]', ru: '[КОГДА]' });
  const k = clean(card && card.kim) || tr({ uz: '[KIM]', ru: '[КТО]' });
  const o = clean(card && card.ogir) || tr({ uz: "[NIMASI OG'IR]", ru: '[ЧТО ТЯЖЕЛО]' });
  return tr({
    uz: `Men shu muammo ustida ishlayapman: ${q} ${k} ${o}. Bu muammo haqiqatan bor-yo'qligini bilish uchun ${k}ga beriladigan 5 ta savol yozib bering. Savollar uning boshidan o'tgan aniq voqea haqida bo'lsin, javobni o'zi aytib qo'ymasin va "shunday ilova kerakmi?" deb so'ramasin.`,
    ru: `Я работаю над такой проблемой: ${q} ${k} ${o}. Напиши 5 вопросов для человека «${k}», чтобы понять, есть ли эта проблема на самом деле. Вопросы должны быть о конкретном случае, который с ним произошёл, не подсказывать ответ и не спрашивать «нужно ли такое приложение?».`,
  });
};
const copyText = async (txt) => {
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(txt); return true; } } catch { /* pastdagi yo'l */ }
  try { const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); document.body.removeChild(ta); return ok; } catch { return false; }
};
// ===== AI QADAMI (F-0924-01/02) — pilot B1 dan AYNAN: so'rov DOIM ochiq · Gemini'ni ochish (so'rov o'zi nusxalanadi) → javobni yozish (F-0925-QA35).
// Manba: DeployLesson Screen4 (.pr-panel) + FallbackPanel (.dsx-fb, 155-qonun 2-band); F-0925-QA35 dan qadam-raqamlari yo'q.
// 📋 → ✓ QAYTIB O'CHMAYDI. Navbat-pulsi faqat «Gemini'ni ochish»da (88-qonun); keyingi puls — o'ngdagi maydonlarning
// o'zida (onReady Gemini ochilganini xabar qiladi). So'rov-qutisi 400 belgi hisobiga kirmaydi (F-0924-01).
// F-0925-QA35 (3-o'tish 3-darsi pilotidan): ① «Nusxalash» qadami → so'rov qutisi burchagidagi 📋 belgisi;
// «Gemini'ni ochish» bosilganda so'rov o'zi nusxalanadi (bitta harakat), qadam raqamlari va «qo'ying» yozuvi yo'q. Yo'riq mentor-gapda.
const AiStep = ({ prompt, answerLabel, answered, fallbackTitle, fallback, onReady, pulse = true }) => {
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);
  const lit = useTurnWalk(opened ? [] : ['open'], pulse && !answered);
  useEffect(() => { if (onReady) onReady(opened); }, [opened]); // eslint-disable-line
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
      <div className="ais-foot">
        <a className={`ais-link ais-go${opened ? ' on' : ''}${turnCls(lit, 'open', false)}`} href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" onClick={() => { doCopy(); setOpened(true); }}>
          {opened ? '✓ ' : ''}{tr({ uz: "Gemini'ni ochish ↗", ru: 'Открыть Gemini ↗' })}
        </a>
        <p className="ais-t">{answerLabel}</p>
      </div>
      <details className="dsx-fb">
        <summary>🛟 {fallbackTitle || tr({ uz: 'Gemini ochilmadimi?', ru: 'Gemini не открылся?' })}</summary>
        <div className="dsx-fb-body">{fallback}</div>
      </details>
    </div>
  );
};
const ScreenAI = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useIsMentor();
  const [card] = useState(() => cardSafe());
  const [qs, setQs] = useState(() => { const a = readQs(); return a && a.length === 2 ? a : ['', '']; });
  const [ready, setReady] = useState(false); // Gemini ochildi → navbat maydonlarga o'tadi
  const [focus, setFocus] = useState(false);
  const signal = usePracticeSignal(screen, storedAnswer, onAnswer, live);
  const prompt = aiPrompt(card);
  const done = qs.every(q => filled(q, 5));
  useEffect(() => { writeQs(qs); if (done) signal({ practice: 'ai-questions', savollar: qs }); }, [qs]); // eslint-disable-line
  const setQ = (i, v) => setQs(prev => prev.map((x, k) => (k === i ? v : x)));
  const toggleReady = (txt) => setQs(prev => {
    const at = prev.indexOf(txt);
    if (at >= 0) return prev.map((x, k) => (k === at ? '' : x));
    const empty = prev.findIndex(x => !clean(x));
    if (empty < 0) return prev;
    return prev.map((x, k) => (k === empty ? txt : x));
  });
  const firstEmpty = qs.findIndex(q => !filled(q, 5));
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `${['①', '②'][firstEmpty]} ${firstEmpty + 1}-savolni yozing`, ru: `${['①', '②'][firstEmpty]} Напишите вопрос ${firstEmpty + 1}` });
  // Bir lahzada bitta puls: ①/② (AiStep ichida) → bo'sh savol-maydonlari (navbat bilan) → NavNext.
  const pendQ = ['q0', 'q1'].filter((_, i) => !filled(qs[i], 5));
  const litQ = useTurnWalk(pendQ, ready && !focus && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: 'AI bilan', ru: 'С AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done && !isMentor} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Muammongiz haqiqatan bormi — <span className="italic" style={{ color: T.accent }}>kimdan va nima deb</span> so'raysiz?</>, ru: <>Ваша проблема правда существует? <span className="italic" style={{ color: T.accent }}>Кого и о чём</span> вы спросите?</> })}</h2></div>
        {/* Senariy 15: ekran boshidagi ikki gap (so'rovdan OLDIN) «esa» bilan bitta gapga ulandi + chorlov (korpus §210-6). */}
        <Mentor>{tr({ uz: <>AI sizga savol tuzishda yordam beradi, qaysi savolni berishni esa o'zingiz tanlaysiz — <b style={{ color: T.ink }}>«Gemini'ni ochish»</b>ni bosing: so'rov o'zi nusxalanadi, chatga joylab yuboring.</>, ru: <>AI поможет составить вопросы, а какой вопрос задать, выбираете вы сами, — нажмите <b style={{ color: T.ink }}>«Открыть Gemini»</b>: запрос скопируется сам, вставьте его в чат и отправьте.</> })}</Mentor>
        <div className="split">
          <Col>
            <AiStep prompt={prompt} answered={done} onReady={setReady} pulse={!isMentor}
              answerLabel={tr({ uz: <>O'tgan voqea haqidagi ikki savolni <b>«1-savol»</b> va <b>«2-savol»</b> maydonlariga yozing</>, ru: <>Впишите два вопроса о прошлом случае в поля <b>«Вопрос 1»</b> и <b>«Вопрос 2»</b></> })}
              fallback={<div className="ai-ready">
                <p className="small" style={{ margin: 0, color: T.ink2, fontWeight: 600 }}>{tr({ uz: "👇 Ikkitasini bosing — ular «1-savol» va «2-savol» maydonlariga yoziladi.", ru: '👇 Нажмите на два — они впишутся в поля «Вопрос 1» и «Вопрос 2».' })}</p>
                {READY_QS.map((q, i) => { const txt = tr(q); const on = qs.includes(txt); return <button key={i} type="button" className={`ai-rq ${on ? 'on' : ''}`} onClick={() => toggleReady(txt)}>{on ? '✓ ' : ''}{txt}</button>; })}
              </div>} />
          </Col>
          <Col>
            <FlowLabel>{tr({ uz: 'Siz tanlaysiz — ikki savol', ru: 'Вы выбираете — два вопроса' })}</FlowLabel>
            <p className="ai-rule fade-up delay-1">{tr({ uz: "AI savol taklif qiladi — o'tgan voqea haqidagi 2 tasini siz tanlaysiz.", ru: 'AI предлагает вопросы — два о прошлом случае выбираете вы.' })}</p>
            {[0, 1].map(i => (
              <label key={i} className={`pw-f ${filled(qs[i], 5) ? 'on' : ''}${turnCls(litQ, `q${i}`, pendQ.length > 1)}`}>
                {/* F-0925-QA11: «① 1-savol» yorlig'i maydon ichiga, xira yozuv bo'lib o'tdi (alohida yorliq qatori yo'q) */}
                <input value={qs[i]} onChange={e => setQ(i, e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={`${['①', '②'][i]} ${tr({ uz: `${i + 1}-savol`, ru: `Вопрос ${i + 1}` })}`} aria-label={tr({ uz: `${i + 1}-savol`, ru: `Вопрос ${i + 1}` })} />
              </label>
            ))}
            {done && <span className="done-mini fade-step">{tr({ uz: '✓ Ikki savol tanlandi', ru: '✓ Два вопроса выбраны' })}</span>}
            <StudentPracticePulse live={live} screen={screen} />
          </Col>
        </div>
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Ikki savol tanlaganlar', ru: '✍️ Кто выбрал два вопроса' })} />
        <MentorNote>{tr(MENTOR_WATCH)}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== 16-EKRAN — SHERIKDAN SO'RANG (juftlik, ballsiz) =====
const PEER_KEY = 'bridge-b2-sherik';
const readPeer = () => { try { const o = JSON.parse(localStorage.getItem(PEER_KEY) || 'null'); return o && typeof o === 'object' && typeof o.aytdi === 'string' && typeof o.demak === 'string' ? o : null; } catch { return null; } };
const ScreenPeerAsk = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useIsMentor();
  const [qs] = useState(() => (readQs() || []).filter(q => clean(q)));
  const [p, setP] = useState(() => readPeer() || { aytdi: '', demak: '' });
  const signal = usePracticeSignal(screen, storedAnswer, onAnswer, live);
  const done = filled(p.aytdi) && filled(p.demak);
  useEffect(() => { try { localStorage.setItem(PEER_KEY, JSON.stringify(p)); } catch { /* jim */ } if (done) signal({ practice: 'peer-ask', sherik: p }); }, [p]); // eslint-disable-line
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : !filled(p.aytdi) ? tr({ uz: '① Sherigingiz nima deganini yozing', ru: '① Напишите, что сказал напарник' })
    : tr({ uz: '② «Demak, muammom …»ni davom ettiring', ru: '② Продолжите «Значит, моя проблема …»' });
  // Navbat-pulsi (88-qonun): ① → ② maydonlar bo'ylab; kalit — satr (raqam 0 emas), yozayotganda o'chadi.
  const [focus, setFocus] = useState(false);
  const pendP = ['aytdi', 'demak'].filter(k => !filled(p[k]));
  const litP = useTurnWalk(pendP, !focus && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: 'Juftlik', ru: 'В паре' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done && !isMentor} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sherigingiz savollaringizga <span className="italic" style={{ color: T.accent }}>nima deb</span> javob beradi?</>, ru: <>Что напарник <span className="italic" style={{ color: T.accent }}>ответит</span> на ваши вопросы?</> })}</h2>
          <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{tr({ uz: 'Tanlagan 2 savolingizni sherigingizga bering va javobini tinglang. Keyin almashing.', ru: 'Задайте напарнику два выбранных вопроса и выслушайте ответ. Потом поменяйтесь.' })}</p></div>
        <Mentor>{tr({ uz: "«Shu ilova kerakmi?» deb so'ramang. «Oxirgi marta qachon shunday bo'lgan?» deb so'rang.", ru: 'Не спрашивайте «Нужно ли такое приложение?». Спросите: «Когда такое было в последний раз?»' })}</Mentor>
        <div className="split">
          <Col>
            <FlowLabel>{tr({ uz: 'Suhbat — siz so\'raysiz', ru: 'Разговор — спрашиваете вы' })}</FlowLabel>
            <div className="pa-qs fade-up delay-1">
              {(qs.length ? qs : [tr(READY_QS[0]), tr(READY_QS[1])]).slice(0, 2).map((q, i) => <div key={i} className="pa-q"><span className="pa-q-n">{i + 1}</span><span className="pa-q-t">{q}</span></div>)}
              {/* Sherik javobi — o'ngda yozilgani shu yerda pufak bo'lib chiqadi; bo'sh bo'lsa «tinglayapti» nuqtalari */}
              <div className={`pa-reply${filled(p.aytdi) ? ' on' : ''}`}>
                <span className="pa-ava" aria-hidden="true">👤</span>
                <span className="pa-bub"><span className="pa-who">{tr({ uz: 'Sherigingiz', ru: 'Напарник' })}</span>{filled(p.aytdi) ? <span className="pa-said">{clean(p.aytdi)}</span> : <i className="pa-typing" aria-hidden="true"><b /><b /><b /></i>}</span>
              </div>
            </div>
          </Col>
          <Col>
            <FlowLabel>{tr({ uz: 'Siz yozasiz — uning javobi', ru: 'Вы пишете — его ответ' })}</FlowLabel>
            {/* F-0925-QA14: «① Sherigim aytdi / ② Demak, muammom…» yorliqlari maydon ichiga (placeholder) o'tdi */}
            <div className="pa-line fade-up delay-2">
              <label className={`pw-f ${filled(p.aytdi) ? 'on' : ''}${turnCls(litP, 'aytdi', pendP.length > 1)}`}><input value={p.aytdi} onChange={e => setP(prev => ({ ...prev, aytdi: e.target.value }))} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={tr({ uz: '① Sherigim aytdi: …', ru: '① Напарник сказал: …' })} aria-label={tr({ uz: 'Sherigim aytdi', ru: 'Напарник сказал' })} /></label>
              <label className={`pw-f ${filled(p.demak) ? 'on' : ''}${turnCls(litP, 'demak', pendP.length > 1)}`}><input value={p.demak} onChange={e => setP(prev => ({ ...prev, demak: e.target.value }))} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={tr({ uz: '② Demak, muammom… (masalan: rostdan bor)', ru: '② Значит, моя проблема… (например: правда есть)' })} aria-label={tr({ uz: 'Demak, muammom', ru: 'Значит, моя проблема' })} /></label>
            </div>
            {done && <span className="done-mini fade-step">{tr({ uz: '✓ Yozildi', ru: '✓ Записано' })}</span>}
            <StudentPracticePulse live={live} screen={screen} />
          </Col>
        </div>
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Sherigidan so\'raganlar', ru: '✍️ Кто спросил напарника' })} />
        <MentorNote>{tr(MENTOR_WATCH)}</MentorNote>
      </div>
    </Stage>
  );
};


// ===== 🏅 NISHONLAR (senariy 4-bo'lim) — faqat REAL tekshiriladigan harakatga =====
const ACHIEVEMENTS = {
  reviewSorter:  { icon: '🗂️', name: 'Review Sorter!',  desc: { uz: 'Namuna sharhlarni muammo va fikrga ajratdingiz', ru: 'Вы разделили примеры отзывов на проблемы и мнения' } },
  clearProblem:  { icon: '🎯', name: 'Clear Problem!',  desc: { uz: '«Taksi yomon» gapini aniq muammoga aylantirdingiz', ru: 'Вы превратили фразу «такси плохое» в конкретную проблему' } },
  perfectMatch:  { icon: '🧩', name: 'Perfect Match!',  desc: { uz: "Har yechimni o'z muammosiga ulab chiqdingiz", ru: 'Вы связали каждое решение с его проблемой' } },
  solutionMaker: { icon: '💡', name: 'Solution Maker!', desc: { uz: "O'z muammongizga ikki yechim yozdingiz", ru: 'Вы написали два решения для своей проблемы' } },
};
// Ekran id → nishon (recordAnswer'da, faqat data.correct bilan): 5 · 7 · 12 · 14-ekranlar.
const ACH_TRIGGERS = { sharh: 'reviewSorter', gap: 'clearProblem', juft: 'perfectMatch', yechim: 'solutionMaker' };

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
// Arena fon tokenlari — darsning o'z atamalari (dekor o'qitadi, M7). CodeStrike brendi o'zgarmaydi.
const QZ_BG_SHAPES = [
  { ch: { uz: 'KIM', ru: 'КТО' },               l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'QACHON', ru: 'КОГДА' },          l: 84, t: 8,  s: 26, d: 23, dl: 1.5 },
  { ch: { uz: "NIMASI OG'IR", ru: 'ЧТО ТЯЖЕЛО' }, l: 6,  t: 72, s: 22, d: 27, dl: 0.8 },
  { ch: { uz: 'MUAMMO', ru: 'ПРОБЛЕМА' },       l: 74, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'YECHIM', ru: 'РЕШЕНИЕ' },        l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: '🚕',     l: 66, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: 'Airbnb', l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: '⭐',     l: 55, t: 5,  s: 22, d: 22, dl: 0.6 },
  { ch: '🗺️',    l: 91, t: 42, s: 24, d: 24, dl: 1.3 },
  { ch: '💡',     l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
  { ch: '🔁',     l: 2,  t: 30, s: 26, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike savollari — 12 ta, ikki mavzudan teng (6 + 6), vaziyatlar ekrandagidan boshqa (§144):
// maktab oshxonasi · o'yin · do'stlar guruhi · avtobus. To'g'ri javoblar 4 pozitsiyaga TENG (3/3/3/3). Jonli TASDIQLAYDI.
const QUIZ_BANK = [
  { q: { uz: "Sinfdoshingiz har tanaffusda oshxonaga yugurib, navbat boshiga turib oladi. Bu nimani ko'rsatadi?", ru: 'Одноклассник на каждой перемене бежит в столовую, чтобы встать в начало очереди. О чём это говорит?' }, opts: [
    { uz: "Uzun navbat muammosini o'zicha hal qilyapti", ru: 'Он сам на ходу решает проблему длинной очереди' },
    { uz: "U tanaffusda yugurishni yaxshi ko'radi", ru: 'Он любит бегать на перемене' },
    { uz: "Bu shunchaki odat, orqasida hech qanday muammo yo'q", ru: 'Это просто привычка, никакой проблемы за ней нет' },
    { uz: 'Unga oshxona umuman kerak emas', ru: 'Столовая ему вообще не нужна' }], correct: 0 },
  { q: { uz: 'Qaysi gap — aniq muammo?', ru: 'Какая фраза — конкретная проблема?' }, opts: [
    { uz: 'Maktab oshxonasi juda yomon ishlaydi', ru: 'Школьная столовая работает очень плохо' },
    { uz: "Hamma o'quvchilar oshxonadan norozi", ru: 'Все ученики недовольны столовой' },
    { uz: "Tanaffusda o'quvchi navbatda 10 daqiqa turadi", ru: 'На перемене ученик 10 минут стоит в очереди' },
    { uz: "Oshxonada ovqat har doim mazasiz va sovuq bo'ladi", ru: 'В столовой еда всегда невкусная и холодная' }], correct: 2 },
  { q: { uz: "«Wi-Fi yomon» gapini aniq muammoga aylantirish uchun nima qo'shiladi?", ru: 'Что добавить к фразе «Wi-Fi плохой», чтобы она стала конкретной проблемой?' }, opts: [
    { uz: "Wi-Fi qurilmasining rangi va narxi", ru: 'Цвет и цена Wi-Fi-роутера' },
    { uz: "Kim, qachon va nimasi og'ir", ru: 'Кто, когда и что тяжело' },
    { uz: "Gap oxiriga uchta undov belgisi", ru: 'Три восклицательных знака в конце' },
    { uz: "Qo'shnilarning Wi-Fi nomlari", ru: 'Названия Wi-Fi у соседей' }], correct: 1 },
  { q: { uz: "O'yinchilar uchun ilova qilmoqchisiz. Muammoni qayerdan qidirasiz?", ru: 'Вы хотите сделать приложение для игроков. Где вы будете искать проблему?' }, opts: [
    { uz: "O'yinning logotipi qanday rangda chizilganidan", ru: 'В том, каким цветом нарисован логотип игры' },
    { uz: "O'yinning reklama rasmlaridan", ru: 'В рекламных картинках игры' },
    { uz: "O'yin nomi qanchalik qisqaligidan", ru: 'В том, насколько короткое название игры' },
    { uz: "O'yinda do'stlaringiz nimadan qiynalishidan", ru: 'В том, что мешает вашим друзьям в игре' }], correct: 3 },
  { q: { uz: "O'yin haqidagi qaysi sharhda aniq muammo bor?", ru: 'В каком отзыве об игре есть конкретная проблема?' }, opts: [
    { uz: 'Eski logotipi menga ko\'proq yoqardi', ru: 'Старый логотип мне нравился больше' },
    { uz: "O'yin o'rtasida meni uch marta chiqarib yubordi", ru: 'Посреди игры меня три раза выкинуло' },
    { uz: "Boshqa o'yin menga bundan ancha qiziqroq tuyuladi", ru: 'Другая игра кажется мне гораздо интереснее этой' },
    { uz: 'Menyusining rangi juda zerikarli', ru: 'Цвет меню очень скучный' }], correct: 1 },
  { q: { uz: "Maktab oshxonasiga ilova qilmoqchisiz. Airbnb asoschilari kabi nima qilasiz?", ru: 'Хотите сделать приложение для школьной столовой. Что сделаете, как основатели Airbnb?' }, opts: [
    { uz: "Uyda o'tirib, ilovaga chiroyli nom o'ylaysiz", ru: 'Сидя дома, придумаете красивое название' },
    { uz: 'Internetdan tayyor dizayn qidirasiz', ru: 'Поищете в интернете готовый дизайн' },
    { uz: "Oshxonaga borib, navbatni o'zingiz ko'rasiz", ru: 'Пойдёте в столовую и сами посмотрите на очередь' },
    { uz: 'Darhol ilova reklamasini tayyorlaysiz', ru: 'Сразу подготовите рекламу приложения' }], correct: 2 },
  { q: { uz: "Sinf chatiga vazifani eslatadigan bot qo'shmoqchisiz. Qaysi gap bot kerakligini ko'rsatadi?", ru: 'Хотите добавить в чат класса бота-напоминалку о заданиях. Какая фраза показывает, что бот нужен?' }, opts: [
    { uz: 'Boshqa sinflar chatida ham bot bor', ru: 'В чатах других классов тоже есть бот' },
    { uz: "Bot chiroyli va zamonaviy ko'rinadi", ru: 'Бот выглядит красиво и современно' },
    { uz: "Botni ulash bor-yo'g'i bir kun oladi", ru: 'Подключить бота — всего один день' },
    { uz: "Ko'pchilik uy vazifasini unutadi", ru: 'Многие забывают о домашнем задании' }], correct: 3 },
  { q: { uz: "Kutubxona ilovasi kitob bo'shaganda xabar yuboradi — o'quvchi bekorga bormaydi. Bu xabar nima deyiladi?", ru: 'Приложение библиотеки присылает уведомление, когда книга освободилась, — ученик не ходит зря. Как называется это уведомление?' }, opts: [
    { uz: 'Yechim', ru: 'Решение' },
    { uz: 'Nolish', ru: 'Жалоба' },
    { uz: 'Sharh', ru: 'Отзыв' },
    { uz: 'Maqtov', ru: 'Похвала' }], correct: 0 },
  { q: { uz: "Sinf sayti uchun yechim: «har kuni bitta tasodifiy rasm ko'rsatish». Hech kimning muammosi topilmadi. Nima qilasiz?", ru: 'Решение для сайта класса: «каждый день показывать случайную картинку». Ни у кого не нашлось проблемы. Что вы сделаете?' }, opts: [
    { uz: "Birinchi navbatda qilamiz", ru: 'Сделаем в первую очередь' },
    { uz: "Chiroyli bo'lsa, qoldiramiz", ru: 'Оставим, если красиво' },
    { uz: "Ro'yxatdan chiqaramiz", ru: 'Уберём из списка' },
    { uz: "Boshqa saytga ko'chiramiz", ru: 'Перенесём на другой сайт' }], correct: 2 },
  { q: { uz: "Oshxona ilovasi uchun qaysi yechimda ilova nima qilishi va qaysi muammo yo'qolishi aytilgan?", ru: 'В каком решении для приложения столовой сказано, что делает приложение и какая проблема исчезает?' }, opts: [
    { uz: "Ilova zamonaviy ko'rinadi — o'quvchilarga yoqadi", ru: 'Приложение выглядит современно — ученикам нравится' },
    { uz: 'Ovqatni oldindan buyurtma qiladi — navbat yo\'q', ru: 'Заказывает еду заранее — нет очереди' },
    { uz: 'Eng yaxshi oshxona ilovasi bo\'ladi', ru: 'Будет лучшим приложением столовой' },
    { uz: 'Chiroyli ranglarda ishlaydi — qulay bo\'ladi', ru: 'Работает в красивых цветах — будет удобно' }], correct: 1 },
  { q: { uz: "«Guruhda kim pul berganini adashtiramiz» muammosiga qaysi yechim javob beradi?", ru: 'Какое решение отвечает на проблему «в группе путаем, кто сдал деньги»?' }, opts: [
    { uz: 'Guruhga har kuni motivatsion xabar yuborish', ru: 'Каждый день отправлять в группу мотивирующее сообщение' },
    { uz: "Guruhga yangi chiroyli fon rasmi qo'yish", ru: 'Поставить группе новую красивую картинку на фон' },
    { uz: 'Guruh nomini qiziqroq qilib qayta yozish', ru: 'Переписать название группы поинтереснее' },
    { uz: "Guruhda kim to'laganini belgilab borish", ru: 'Отмечать в группе, кто уже сдал деньги' }], correct: 3 },
  { q: { uz: "Avtobus ilovasi avtobus qayerdaligini xaritada ko'rsatadi. Bu qaysi muammoni yo'qotadi?", ru: 'Приложение показывает на карте, где сейчас автобус. Какую проблему это убирает?' }, opts: [
    { uz: 'Avtobus qachon kelishini bilmay kutish', ru: 'Ждать, не зная, когда придёт автобус' },
    { uz: "Avtobusning rangi yo'lovchilarga yoqmasligi", ru: 'Пассажирам не нравится цвет автобуса' },
    { uz: 'Chipta narxi qimmat ekani', ru: 'Билет стоит дорого' },
    { uz: "Bekatda o'rindiq yo'qligi", ru: 'На остановке нет скамейки' }], correct: 0 },
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
    const TOK = tr({ uz: ['KIM', 'QACHON', 'MUAMMO', 'YECHIM', 'Airbnb', '🚕', '⭐', '💡', '🗺️', '🔁'],
                     ru: ['КТО', 'КОГДА', 'ПРОБЛЕМА', 'РЕШЕНИЕ', 'Airbnb', '🚕', '⭐', '💡', '🗺️', '🔁'] });
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

// ===== 17-EKRAN — PODIUM: jonli ball natijasi (4 test bo'yicha) =====
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

// ===== 18-EKRAN — FLASHCARD (5 ta · PmLesson5 Flashcards porti) =====
const FLASHCARDS = [
  { front: { uz: "Muammoning eng kuchli belgisi qaysi?", ru: 'Какой признак проблемы самый сильный?' }, back: { uz: 'Odam o\'zicha chora topgan', ru: 'Человек сам нашёл выход на ходу' } },
  { front: { uz: "Aniq muammo qaysi uch bo'lakdan iborat?", ru: 'Из каких трёх частей состоит конкретная проблема?' }, back: { uz: "Kim · qachon · nimasi og'ir", ru: 'Кто · когда · что тяжело' } },
  { front: { uz: 'Muammoni qayerdan qidirasiz?', ru: 'Где искать проблему?' }, back: { uz: "O'z kuningiz · oila va do'stlar · past baholi sharhlar", ru: 'Ваш собственный день · семья и друзья · отзывы с низкой оценкой' } },
  { front: { uz: 'Yangi taklif kelsa, birinchi qaysi savol beriladi?', ru: 'Какой вопрос задают первым, когда приходит новое предложение?' }, back: { uz: 'Bu kimning qaysi muammosini hal qiladi?', ru: 'Чью и какую проблему это решает?' } },
  { front: { uz: "Muammosi topilmagan yechim nima bo'ladi?", ru: 'Что происходит с решением, у которого не нашлось проблемы?' }, back: { uz: "Ro'yxatdan chiqadi", ru: 'Уходит из списка' } },
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

// ===== 19+20-EKRAN — ARENA (CodeStrike, 12 savol — P0 Screen16 CTA mantiqi) + YAKUN (uch qator) =====
const SUMMARY_LINES = [
  { uz: 'Odam o\'zicha chora topgan joyda muammo bor.', ru: 'Там, где человек сам ищет выход на ходу, есть проблема.' },
  { uz: "Aniq muammoda kim, qachon va nimasi og'ir — uchalasi aytiladi.", ru: 'В конкретной проблеме названы все три части: кто, когда и что тяжело.' },
  { uz: 'Har yechim bitta muammoga javob beradi.', ru: 'Каждое решение отвечает на одну проблему.' },
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
    <Stage eyebrow={null} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: '↻ Darsni boshidan', ru: '↻ Урок сначала' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen dense">
        <div className="hero"><div className="hero-l"><h2 className="title h-title fade-up d1">{tr(LESSON_META.lessonTitle)}</h2></div></div>
        <div className={`qz-cta cs-cta fade-up d1 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : studentLive ? tr({ uz: "▶ Qo'shilish uchun bosing — 12 savol, har biriga 15 soniya", ru: '▶ Нажмите, чтобы присоединиться — 12 вопросов, по 15 секунд' }) : tr({ uz: '▶ Boshlash uchun bosing — 12 savol, har biriga 15 soniya', ru: '▶ Нажмите, чтобы начать — 12 вопросов, по 15 секунд' })} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d2"><div className="card-lbl" style={{ color: T.success }}>{tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{SUMMARY_LINES.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span>{tr(r)}</span></li>))}</ul></div>
        <MentorNote>{tr({ uz: "Og'zaki ayting: «AI Startup'da mahsulot g'oyadan emas, muammodan boshlanadi.»", ru: 'Скажите устно: «В AI Startup продукт начинается не с идеи, а с проблемы».' })}</MentorNote>
        {!isMentor && <div className="card ach-coll fade-up d3">
          <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr({ uz: 'Nishonlaringiz —', ru: 'Ваши значки —' })} {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
          <div className="ach-grid">
            {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return (
              <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`}>
                {got ? <span className="ach-badge-ic">{a.icon}</span> : <span className="ach-badge-ic lock" aria-hidden="true" />}
                {/* QA: inglizcha nom ostida o'zbekcha tavsif EKRANDA (title faqat sichqonchada ko'rinardi, planshet/proyektorda yo'q) */}
                <span className="ach-badge-txt"><span className="ach-badge-name">{a.name}</span><span className="ach-badge-desc">{tr(a.desc)}</span></span>
              </div>
            ); })}
          </div>
        </div>}
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished, liveToken })
export default function BridgeMuammoniTopamiz({ lang: langProp, onFinished, liveToken }) {
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

  // Tartib = SCREEN_META (19 sahifa: senariy 20 ekrani, 19+20 bitta sahifada).
  const screens = [ScreenHook, ScreenGoal, ScreenSigns, ScreenTest1, ScreenReviews, ScreenCase, ScreenGapBuilder, ScreenTest2, ScreenProblemCard, ScreenApp, ScreenTest3, ScreenMatch, ScreenTest4, ScreenSolutions, ScreenAI, ScreenPeerAsk, ScreenPodium, ScreenFlash, ScreenSummary];
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
        .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
        .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }
        .btn-soft:disabled { opacity: 0.5; cursor: not-allowed; }

        /* === OPSIYALAR === */
        .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .option:hover:not(:disabled) { background: #FBFAFE; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
        .option:disabled { cursor: default; }
        .option-correct { background: ${T.successSoft} !important; color: ${T.success} !important; box-shadow: 0 8px 22px -6px rgba(31,122,77,0.32) !important; }
        .option-wrong { background: ${T.paper} !important; color: ${T.ink3} !important; opacity: 0.55 !important; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.08) !important; }
        .option-picked-wrong { background: ${T.accentSoft} !important; color: ${T.accent} !important; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.34) !important; }

        /* === MENTOR === */
        .mentor { display: flex; gap: 12px; align-items: flex-start; }
        .mentor-ava { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .mentor-ava img { display: block; width: 100%; height: 100%; object-fit: cover; }
        /* Zaxira (F-0924, B2 dizayn): mentor surati katta (1,6 MB) va sekin yuklanadi — yuklanguncha yoki umuman kelmasa
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

        /* === HOOK v3: xabar-almashtirgich + radio-variantlar (PmLesson2 andozasi) === */
        .hk-opt { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(12px,1.8vw,15px) clamp(14px,2vw,17px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13.5px,1.6vw,15px); color: ${T.ink}; cursor: pointer; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16); transition: all 0.16s; }
        .hk-opt:hover:not(:disabled):not(.on) { transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .hk-opt.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hk-opt:disabled { cursor: default; }
        .hk-radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hk-opt.on .hk-radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .hk-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        @media (prefers-reduced-motion: reduce) { .hk-opt { transition: none; } }
        .hvote { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,18px); box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }
        .hvote-row { display: flex; align-items: center; gap: 10px; }
        .hvote-lbl { flex: 0 0 clamp(120px,26vw,220px); font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; line-height: 1.3; min-width: 0; overflow-wrap: anywhere; } /* F-0727-12 (pilot): variant kesilmasin — qator o'raladi */
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
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

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
        /* TEST (F-0924-06, pilot B1 naqshi 2-band): PmLesson2 savol-qolipi — bitta ustun 800px, tanlagach ixcham (izoh ichki aylantirishsiz sig'adi) */
        .stage-content.narrow:has(> .screen.qs) { max-width: 800px; }
        .screen.qs.qs-on { gap: clamp(12px,1.6vw,16px) !important; }
        .screen.qs .feedback-block.visible { margin-top: 0; }
        .screen.qs .feedback-block .frame-success, .screen.qs .feedback-block .frame-soft, .screen.qs .feedback-block .frame-wait { padding: clamp(11px,1.6vw,14px) clamp(14px,2vw,18px); }
        /* B2 qo'shimchasi: izoh + «Qisqa takrorlash» tugmasi (RU, 2 qatorli variantlar) ham skrollsiz sig'sin — faqat oraliqlar */
        @media (min-width: 761px) {
          .lesson-root .stage-content:has(> .screen.qs.qs-on) { padding-bottom: 14px; }
          .screen.qs.qs-on .h-ask { font-size: clamp(18px,2.3vw,24px); }
          .screen.qs.qs-on .rc-open-mini { margin-top: 6px; padding: 6px 13px; }
          .screen.qs.qs-on .option { line-height: 1.38; }
          .screen.qs.qs-on .tq { gap: 6px; }
        }
        /* ZICH EKRAN (58-qonun; pilot naqshi 3-band): kompyuterda 1280x800 + TopBar bitta ekranga sig'adi. Matn qisqarmaydi —
           faqat oraliq, sarlavha o'lchami va ramka ichki bo'shlig'i. Modifikator .dense ekran-o'ramiga qo'yiladi. */
        @media (min-width: 761px) {
          .lesson-root .screen.dense { gap: 12px !important; }
          .lesson-root .stage-content:has(> .screen.dense) { padding-bottom: 14px; }
          .lesson-root .screen.dense .h-title { font-size: clamp(22px,2.6vw,31px); }
          .lesson-root .screen.dense .head { gap: 4px; }
          .lesson-root .screen.dense .col { gap: 10px; }
          .lesson-root .screen.dense .frame-success, .lesson-root .screen.dense .frame-soft, .lesson-root .screen.dense .frame-warn { padding: 11px 16px; }
          .lesson-root .screen.dense .mentor-msg { padding: 10px 15px; }
          /* F-0925-B02: mentor pufagi pastdagi blokka yopishib turmasin — 12px oraliq ustiga +8px (jami 20px) */
          .lesson-root .screen.dense > .mentor { margin-bottom: 8px; }
        }

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
        /* === K11 SLAYD (s4) === */
        .k-slide { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        /* F-0925-QA09: keys slaydi tepasidagi gradient chiziq olindi (foydalanuvchi tanlovi 1; Netflix slaydidagi qizil brend-chizig'i qoladi) */
        .k-slide-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(10px,1.3vw,12px); letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 14px; }
        .k-slide-ic { font-size: clamp(40px,7vw,64px); line-height: 1; }
        .k-slide-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(20px,3.2vw,30px); color: ${T.ink}; margin: 0; }
        .k-slide-body { font-size: clamp(15px,2vw,18px); color: ${T.ink2}; line-height: 1.55; max-width: 620px; margin: 0; } .k-slide-body b { color: ${T.ink}; }
        .k-dots { display: flex; gap: 8px; justify-content: center; }
        .k-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .k-dot.fill { background: ${T.ink3}; } .k-dot.cur { background: ${T.accent}; width: 26px; }
        /* Slayd ichidagi boshqaruv (PmLesson1 k-nav) + keys-rasm (PmLesson1 3892-3893) — pilot B1 naqshi, F-0924-07 */
        .k-nav { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 4px; }
        .k-prev.btn-soft { padding: 9px 16px; font-size: 13.5px; border-radius: 10px; }
        .k-next { border: none; border-radius: 10px; padding: 9px 18px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13.5px; cursor: pointer; }
        .k-fig { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; }
        .k-photo { display: block; width: min(360px, 100%); height: clamp(120px,18vw,180px); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.4); }
        .k-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .k-photo.emo { display: flex; align-items: center; justify-content: center; }
        .k-cap { font-family: 'Manrope', sans-serif; font-size: 12.5px; color: ${T.ink3}; }
        /* Taxmin tanlangach karta ixchamlashadi (javob + natija bir qatorda) — voqea slaydi va uning boshqaruvi ekranga sig'adi */
        .kp-bet.done { flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 16px 20px 14px; }
        .kp-bet.done > .k-slide-eyebrow, .kp-bet.done .kp-chip.locked:not(.correct) { display: none; }
        .kp-bet.done .kp-chips { display: contents; }
        /* Voqea-slayd: rasm (yoki emoji) chapda, matn va boshqaruv o'ngda */
        .k-slide.ph { padding: clamp(18px,2.6vw,26px) clamp(18px,3vw,30px); min-height: clamp(190px,26vh,230px); display: grid; grid-template-columns: minmax(150px,0.62fr) minmax(0,1.6fr); column-gap: clamp(16px,2.5vw,28px); row-gap: 8px; align-items: center; text-align: left; }
        .k-slide.ph > .k-fig { grid-column: 1; grid-row: 1 / span 4; }
        .k-slide.ph > :not(.k-fig) { grid-column: 2; justify-self: start; }
        .k-slide.ph .k-nav { justify-content: flex-start; }
        @media (max-width: 760px) { .k-slide.ph { display: flex; flex-direction: column; text-align: center; } .k-slide.ph > :not(.k-fig) { justify-self: auto; } }
        .kp-chip.locked { cursor: default; transform: none; }
        .kp-chip.locked:hover { transform: none; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); }
        .kp-chip.correct { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
        .kp-chip.correct:hover { box-shadow: inset 0 0 0 2px ${T.success}; }
        .kp-mark { font-weight: 900; font-size: 15px; }

        /* === 🎲 KEYS-TAXMIN (s4) — slayd oldidan mikro-tikish; BALL EMAS, sof o'yin === */
        .kp-bet { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        /* F-0925-QA08: taxmin kartasi tepasidagi binafsha kesik chiziq olindi (foydalanuvchi: «siniq chiziq kerak emas», 7 dars) */
        .kp-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .kp-chip { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,16px); padding: 12px 18px; border-radius: 99px; border: none; background: ${T.bg}; color: ${T.ink}; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); transition: transform 0.16s, box-shadow 0.16s; }
        .kp-chip:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 10px 20px -8px rgba(${T.shadowBase},0.24); }
        /* press-holat: bosilganda ichkariga cho'kadi (tap affordance) */
        .kp-chip:active { transform: translateY(0) scale(0.94); box-shadow: inset 0 0 0 1.5px ${T.accent}, inset 0 3px 7px -3px rgba(${T.shadowBase},0.25); color: ${T.accent}; }
        .kp-ic { font-size: 19px; }
        /* === TEST-SAVOL (idea_oll tartibi): katta savol + toza kartochka === */
        /* Test-savol (F-0924-06): PmLesson2 qolipi — eyebrow + lead-qator + bitta h-ask. (7-ekran voqeasi endi o'z .gb-story blokida, F-0925-B03) */
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
        /* 6-ekran (B2): adashganda o'z taxmini binafsha ✗ chip bo'lib yashil ✓ javob yonida qoladi — «asl javob «…»» yozuvi
           shu chipni takrorlardi, shuning uchun u faqat ekran-o'quvchiga qoladi (ko'rinmas, lekin DOM'da). */
        .kp-chip.wrong { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; }
        .kp-chip.wrong:hover { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .kp-bet.done .kp-chip.locked.wrong { display: inline-flex; }
        .kp-bet.done .kp-chip { font-size: clamp(13px,1.5vw,14px); padding: 8px 14px; }
        @media (min-width: 761px) {
          .kp-screen .kp-bet:not(.done) { padding: 22px 28px 18px; gap: 11px; }
          .kp-screen .kp-bet.done { padding: 14px 18px 12px; }
          .kp-screen .k-slide.ph { padding: 18px 26px; min-height: 180px; }
        }
        .kp-res.kp-res.miss { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; box-shadow: none; }
        /* reveal: yumshoq indigo glow-to'lqin */
        .k-slide.revealed { animation: fade-step 0.3s ease-out, kp-glow 0.9s ease-out; }
        @keyframes kp-glow { 0% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24), 0 0 0 0 rgba(91,61,230,0.4); } 70% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24), 0 0 0 16px rgba(91,61,230,0); } 100% { box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); } }
        @media (prefers-reduced-motion: reduce) { .kp-chip, .kp-chip:hover, .kp-chip:active { transition: none; transform: none; } .k-slide.revealed, .kp-res { animation: none; } }

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
        .ach-coll .ach-badge { flex-direction: row; justify-content: flex-start; align-items: flex-start; text-align: left; gap: 9px; padding: 8px 10px; min-width: 0; }
        .ach-coll .ach-badge-ic { flex-shrink: 0; }
        .ach-coll { gap: 8px; }
        .lesson-root .card.ach-coll { padding-top: 11px; padding-bottom: 11px; } /* QA: tavsif qo'shilgach yakun RU 1280x800 ga sig'sin */
        .ach-badge-txt { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .ach-badge-desc { font-family: 'Manrope'; font-weight: 500; font-size: 11.5px; line-height: 1.3; color: ${T.ink2}; overflow-wrap: anywhere; }
        .ach-badge.locked .ach-badge-desc { color: ${T.ink3}; }
        .ach-coll .ach-badge-ic { font-size: 22px; }
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
        .pod-list { display: flex; flex-direction: column; gap: 4px; max-height: 300px; overflow: auto; }
        .pod-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: rgba(${T.shadowBase},0.04); }
        .pod-row.me { background: ${T.successSoft}; outline: 1.5px solid ${T.success}66; }
        .pod-rank { min-width: 22px; font-size: 12px; font-weight: 700; color: ${T.ink3}; }
        .pod-row-name { flex: 1; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pod-row-score { min-width: 34px; text-align: right; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }
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
        .rc-open { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); background: ${T.accent}; color: #fff; border: none; border-radius: 10px; padding: 10px 18px; cursor: pointer; box-shadow: 0 8px 20px -6px rgba(91,61,230,0.5); transition: all 0.2s; }
        .rc-open:hover { transform: translateY(-1px); box-shadow: 0 12px 26px -6px rgba(91,61,230,0.55); }
        .rc-open.soft { background: ${T.paper}; color: ${T.accent}; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); }
        .rc-open-mini { align-self: flex-start; margin-top: 10px; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; background: ${T.paper}; color: ${T.accent}; border: none; border-radius: 99px; padding: 8px 14px; cursor: pointer; box-shadow: 0 4px 12px -5px rgba(${T.shadowBase},0.2); transition: all 0.2s; }
        .rc-open-mini:hover { transform: translateY(-1px); }

        /* === 📖 QAYTA TUSHUNTIRISH (recap overlay) === */
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
        .rc-btn.ghost:hover:not(:disabled) { background: ${T.paper}; color: ${T.ink}; }
        .rc-btn.done { background: ${T.success}; color: #fff; }
        .rc-btn.done:hover { background: #17603C; }
        @media (max-width: 640px) { .rc-nav { flex-wrap: wrap; justify-content: center; row-gap: 10px; } .rc-dots { width: 100%; order: -1; } .rc-btn { font-size: 13px; padding: 11px 16px; } }

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
        /* === BRIDGE-B2: dars mexanikalari (hook-sahna, maqsad-demo, belgilar, sharhlar, konstruktor, karta, ilova-sxema, juftlash, yechimlar, AI, sherik) === */

  .hk-scene { position: relative; aspect-ratio: 480 / 250; width: 100%; border-radius: 18px; overflow: hidden; background: ${T.bg}; box-shadow: inset 0 0 0 1px ${T.line}, 0 14px 30px -18px rgba(${T.shadowBase},0.4); }
  .hk-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  .hk-city.far rect { fill: rgba(91,61,230,0.10); } .hk-city.near rect { fill: rgba(91,61,230,0.17); }
  .hk-win rect { fill: #FFD380; opacity: 0.85; rx: 1.5px; }
  .hk-curb { fill: #E7E3F4; }
  .hk-lane rect { fill: #FFFFFF; opacity: 0.75; }
  .hk-cone { mix-blend-mode: multiply; opacity: 0.55; }
  .hk-pool { fill: #FFD380; opacity: 0.35; }
  .hk-lamp rect, .hk-lamp path { fill: ${T.ink2}; stroke: ${T.ink2}; }
  .hk-lamp path { fill: none; }
  .hk-lamp .hk-bulb { fill: #FFD380; stroke: none; filter: drop-shadow(0 0 6px rgba(255,211,128,0.95)); }
  .hk-umb { fill: ${T.accent}; } .hk-stick { fill: ${T.ink2}; }
  .hk-body { fill: ${T.ink2}; } .hk-coat { fill: ${T.accentVivid}; } .hk-bag { fill: ${T.ink}; opacity: 0.55; }
  .hk-arm { stroke: ${T.accentVivid}; fill: none; transform-box: fill-box; transform-origin: 0% 100%; animation: hk-wave 1.6s ease-in-out infinite; }
  @keyframes hk-wave { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-16deg); } }
  .hk-taxi { transform: translate(520px, 190px); animation: hk-pass 5.4s linear infinite; }
  .hk-taxi.t2 { animation-delay: 2.7s; }
  @keyframes hk-pass { from { transform: translate(520px, 190px); } to { transform: translate(-140px, 190px); } }
  .hk-taxi-sign-t { font-family: 'Manrope'; font-weight: 800; font-size: 6.6px; letter-spacing: 0.06em; fill: #FFFFFF; text-anchor: middle; }
  .hk-taxi-body { fill: #E8A13A; } .hk-taxi-glass { fill: #FFFFFF; opacity: 0.8; } .hk-taxi-sign { fill: ${T.ink3}; } .hk-wheel { fill: ${T.ink}; }
  .hk-rip ellipse { fill: none; stroke: #FFFFFF; stroke-width: 1.2; opacity: 0; transform-box: fill-box; transform-origin: center; animation: hk-rip 1.8s ease-out infinite; }
  .hk-rip ellipse:nth-child(2) { animation-delay: 0.6s; } .hk-rip ellipse:nth-child(3) { animation-delay: 1.2s; }
  @keyframes hk-rip { 0% { opacity: 0.9; transform: scale(0.3); } 100% { opacity: 0; transform: scale(1.6); } }
  .hk-drop { position: absolute; top: -24px; width: 1.6px; height: 18px; border-radius: 2px; background: linear-gradient(180deg, rgba(14,134,196,0), rgba(14,134,196,0.55)); animation: hk-rain 0.8s linear infinite; pointer-events: none; }
  @keyframes hk-rain { to { transform: translateY(300px); } }
  .hk-clock { position: absolute; top: 10px; right: 10px; display: inline-flex; align-items: center; gap: 7px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; background: rgba(255,255,255,0.9); border-radius: 99px; padding: 5px 12px 5px 9px; box-shadow: 0 6px 16px -10px rgba(${T.shadowBase},0.5), inset 0 0 0 1px ${T.line}; font-variant-numeric: tabular-nums; }
  .hk-clock-ic { width: 12px; height: 12px; border-radius: 50%; box-shadow: inset 0 0 0 2px ${T.accent}; position: relative; }
  .hk-clock-ic::after { content: ''; position: absolute; left: 5px; top: 2px; width: 2px; height: 4.5px; background: ${T.accent}; border-radius: 1px; transform-origin: 50% 100%; animation: hk-hand 1s linear infinite; }
  @keyframes hk-hand { to { transform: rotate(360deg); } }
  .hk-clock.full { color: ${T.accent}; box-shadow: 0 6px 16px -10px rgba(91,61,230,0.6), inset 0 0 0 1.5px ${T.accent}; animation: hk-clock-pop 0.4s ease; }
  .hk-clock.full .hk-clock-ic::after { animation: none; }
  @keyframes hk-clock-pop { 50% { transform: scale(1.08); } }
  /* HOOK qolipi (pilot naqshi 5-band): chapda jonli sahna 1.1fr, o'ngda eyebrow + variantlar */
  .split.hk-split { grid-template-columns: minmax(0,1.1fr) minmax(0,1fr); align-items: center; }
  .hk-split .hk-opt { font-size: clamp(14px,1.7vw,16px); padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); }
  /* Imzo-harakat: tanlangan chora pufagi (bola ustida) — pop, keyin uch nuqta navbat bilan «kutadi» */
  .hk-bub { transform-box: fill-box; transform-origin: 0% 100%; animation: hk-bub-in 0.42s cubic-bezier(.34,1.56,.64,1) both; }
  .hk-bub-bg { fill: #FFFFFF; stroke: ${T.accent}; stroke-width: 1.6; filter: drop-shadow(0 4px 6px rgba(${T.shadowBase},0.25)); }
  .hk-bub-ic { font-size: 15px; dominant-baseline: auto; }
  .hk-bub-dots circle { fill: ${T.accent}; opacity: 0.25; animation: hk-dot 1.2s ease-in-out infinite; }
  .hk-bub-dots circle:nth-child(2) { animation-delay: 0.2s; } .hk-bub-dots circle:nth-child(3) { animation-delay: 0.4s; }
  @keyframes hk-bub-in { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: none; } }
  @keyframes hk-dot { 0%, 100% { opacity: 0.25; } 40% { opacity: 1; } }
  @media (max-width: 760px) { .hk-scene { aspect-ratio: 480 / 200; } } /* telefonda osmon qatori qisqaradi (svg xMidYMax slice) — variantlar tezroq ko'rinadi */
  @media (prefers-reduced-motion: reduce) {
    .hk-drop { animation: none; top: 30%; opacity: 0.35; }
    .hk-arm, .hk-rip ellipse, .hk-clock-ic::after, .hk-clock.full, .hk-bub { animation: none; }
    .hk-bub-dots circle { animation: none; opacity: 0.7; }
    .hk-taxi { animation: none; transform: translate(300px, 190px); } .hk-taxi.t2 { display: none; }
  }

  .gp-demo { position: relative; display: flex; flex-direction: column; align-items: center; gap: 0; background: ${T.paper}; border-radius: 18px; padding: clamp(18px,2.8vw,28px) clamp(14px,2.6vw,28px); box-shadow: inset 0 0 0 1px ${T.line}, 0 14px 32px -18px rgba(${T.shadowBase},0.35); }
  /* QA (metodist qoldig'i): yolg'iz ↻ belgisi nima qilishini aytmasdi — endi kichik yozuvli pill «↻ Qayta» */
  .gp-replay { position: absolute; top: 10px; right: 10px; display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 11px; border-radius: 99px; border: none; cursor: pointer; font-family: 'Manrope'; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; box-shadow: inset 0 0 0 1px ${T.line}; transition: color 0.15s, box-shadow 0.15s; }
  .gp-replay:hover { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .gp-bubble { position: relative; font-family: 'Source Serif 4', serif; font-size: clamp(19px,2.6vw,24px); color: ${T.ink2}; background: ${T.bg}; border-radius: 16px 16px 16px 4px; padding: 8px 18px; box-shadow: inset 0 0 0 1px ${T.line}; animation: gp-bubble 0.5s ease 1.2s forwards; }
  @keyframes gp-bubble { to { opacity: 0.5; transform: scale(0.94); } }
  .gp-strike { position: absolute; left: 12px; right: 12px; top: 52%; height: 2px; border-radius: 2px; background: ${T.ink3}; transform: scaleX(0); transform-origin: left; animation: gp-strike 0.4s ease 0.8s forwards; }
  @keyframes gp-strike { to { transform: scaleX(1); } }
  .gp-flow { display: block; width: 2px; height: 26px; margin: 4px 0; background: linear-gradient(180deg, ${T.line}, ${T.accent}); transform: scaleY(0); transform-origin: top; animation: gp-grow 0.3s ease 1.35s forwards; }
  @keyframes gp-grow { to { transform: none; } }
  .gp-line { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; width: 100%; max-width: 940px; background: ${T.paper}; border-radius: 14px; padding: 10px 14px 10px 18px; box-shadow: inset 0 0 0 1px ${T.line}, 0 8px 20px -14px rgba(${T.shadowBase},0.35); animation: gp-line-ok 0.5s ease 3.25s forwards; }
  @keyframes gp-line-ok { to { box-shadow: inset 0 0 0 1.5px ${T.success}55, 0 10px 24px -14px rgba(18,169,104,0.4); } }
  .gp-part { display: inline-flex; flex-direction: column; gap: 3px; min-width: 0; border-radius: 10px; padding: 7px 12px; background: ${T.bg}; }
  .gp-part.kim { box-shadow: inset 0 0 0 1.5px ${T.blue}55; } .gp-part.qachon { box-shadow: inset 0 0 0 1.5px #E8A13A77; } .gp-part.ogir { box-shadow: inset 0 0 0 1.5px ${T.accent}55; }
  .gp-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; }
  .gp-part.kim .gp-lbl { color: ${T.blue}; } .gp-part.qachon .gp-lbl { color: #B77A16; } .gp-part.ogir .gp-lbl { color: ${T.accent}; }
  .gp-txt { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.8vw,16px); color: ${T.ink}; overflow-wrap: anywhere; opacity: 0; transform: translateY(6px); animation: gp-in 0.4s cubic-bezier(.34,1.4,.4,1) var(--fd, 1.7s) forwards; }
  .gp-part { animation: gp-socket 0.4s ease var(--fd, 1.7s) forwards; }
  .gp-part.kim { --sc: ${T.blueSoft}; } .gp-part.qachon { --sc: #FBEED6; } .gp-part.ogir { --sc: ${T.accentSoft}; }
  @keyframes gp-socket { 50% { transform: scale(1.05); } to { background: var(--sc); } }
  @keyframes gp-in { to { opacity: 1; transform: none; } }
  .gp-branch { width: min(760px, 100%); height: 28px; overflow: visible; display: block; } /* shoxlar uchi yechim-kartalar markaziga tushsin (25% / 75%) — .gp-sols bilan bir kenglik */
  .gp-branch path { fill: none; stroke: ${T.success}; stroke-width: 2; stroke-dasharray: 600; stroke-dashoffset: 600; opacity: 0.7; animation: gp-draw 0.45s ease 3.35s forwards; vector-effect: non-scaling-stroke; }
  @keyframes gp-draw { to { stroke-dashoffset: 0; } }
  /* F-0925-QA10: Maqsad ekranidagi kartalarning chap rang-chizig'i (yashil/binafsha) olindi — 1-dars etaloni qoidasi 42 */
  .gp-sols { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; width: 100%; max-width: 760px; } /* QA: 620 da RU yechim-matni 2 qatorga o'ralib, 1280x800 da +17px skroll berardi */
  .gp-sol { position: relative; display: flex; flex-direction: column; gap: 5px; border-radius: 14px; padding: 10px 40px 10px 44px; background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}, 0 8px 18px -12px rgba(${T.shadowBase},0.3); opacity: 0; transform: translateY(10px) scale(0.94); animation: gp-in 0.5s cubic-bezier(.34,1.4,.4,1) var(--fd, 3.7s) forwards; }
  .gp-sol-n { position: absolute; left: 12px; top: 12px; width: 22px; height: 22px; border-radius: 50%; background: ${T.successSoft}; color: ${T.success}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center; }
  .gp-sol-row { display: flex; flex-direction: column; gap: 5px; }
  .gp-sol-row em { font-style: normal; font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.ink2}; }
  .gp-val { display: block; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.6vw,14.5px); line-height: 1.35; color: ${T.ink}; overflow-wrap: anywhere; opacity: 0; transform: translateY(6px); animation: gp-in 0.4s cubic-bezier(.34,1.4,.4,1) calc(var(--fd, 3.7s) + 0.35s) forwards; }
  .gp-val.m { color: ${T.success}; animation-delay: calc(var(--fd, 3.7s) + 0.6s); }
  @media (prefers-reduced-motion: reduce) { .gp-val { animation: none; opacity: 1; transform: none; } }
  .gp-sol-ok { position: absolute; right: 10px; top: 10px; width: 22px; height: 22px; border-radius: 50%; background: ${T.success}; opacity: 0; transform: scale(0.3); animation: gp-stamp 0.35s cubic-bezier(.34,1.6,.4,1) calc(var(--fd, 3.7s) + 0.95s) forwards; }
  .gp-sol-ok::after { content: ''; position: absolute; left: 8px; top: 4px; width: 5px; height: 10px; border: solid #fff; border-width: 0 2.5px 2.5px 0; transform: rotate(45deg); }
  @keyframes gp-stamp { to { opacity: 1; transform: none; } }
  @media (max-width: 560px) { .gp-sols { grid-template-columns: 1fr; } .gp-branch { display: none; } }
  @media (prefers-reduced-motion: reduce) {
    .gp-bubble, .gp-strike, .gp-flow, .gp-line, .gp-part, .gp-txt, .gp-branch path, .gp-sol, .gp-sol-ok { animation: none; opacity: 1; transform: none; }
    .gp-bubble { opacity: 0.5; } .gp-branch path { stroke-dashoffset: 0; } .gp-part { background: var(--sc); }
    .gp-line { box-shadow: inset 0 0 0 1.5px ${T.success}55, 0 10px 24px -14px rgba(18,169,104,0.4); }
  }

  .sg-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .sg-who { display: inline-flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink}; background: ${T.paper}; border-radius: 99px; padding: 6px 15px 6px 7px; box-shadow: inset 0 0 0 1px ${T.line}, 0 6px 16px -10px rgba(${T.shadowBase},0.3); }
  .sg-who-ava { width: 24px; height: 24px; border-radius: 50%; background: ${T.blueSoft}; position: relative; overflow: hidden; flex-shrink: 0; }
  .sg-who-ava::before { content: ''; position: absolute; left: 8px; top: 4px; width: 8px; height: 8px; border-radius: 50%; background: ${T.blue}; }
  .sg-who-ava::after { content: ''; position: absolute; left: 4px; top: 14px; width: 16px; height: 14px; border-radius: 8px 8px 0 0; background: ${T.blue}; }
  .sg-meter { display: inline-flex; align-items: flex-end; gap: 4px; height: 26px; padding: 4px 10px 4px 8px; background: ${T.paper}; border-radius: 99px; box-shadow: inset 0 0 0 1px ${T.line}; }
  .sg-meter i { display: block; width: 6px; border-radius: 2px; background: ${T.line}; transition: background 0.25s, transform 0.25s; }
  .sg-meter i:nth-child(1) { height: 6px; } .sg-meter i:nth-child(2) { height: 10px; } .sg-meter i:nth-child(3) { height: 14px; } .sg-meter i:nth-child(4) { height: 18px; }
  .sg-meter i.on { background: ${T.accent}; animation: sg-bar 0.35s cubic-bezier(.34,1.6,.4,1); }
  .sg-meter.full i.on { background: ${T.success}; }
  .sg-meter b { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; color: ${T.ink2}; margin-left: 5px; align-self: center; }
  @keyframes sg-bar { 0% { transform: scaleY(0.3); } 100% { transform: none; } }
  .sg-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
  @media (max-width: 640px) { .sg-grid { grid-template-columns: 1fr; } }
  .sg-card { position: relative; display: grid; grid-template-columns: 44px minmax(0,1fr); grid-template-rows: auto auto; column-gap: 14px; row-gap: 8px; align-items: start; min-width: 0; text-align: left; border: none; cursor: pointer; font: inherit; color: ${T.ink}; background: ${T.paper}; border-radius: 16px; padding: 15px 18px 15px 14px; box-shadow: inset 0 0 0 1px ${T.line}, 0 8px 20px -14px rgba(${T.shadowBase},0.35); transition: transform 0.18s, box-shadow 0.18s, border-color 0.2s; }
  .sg-card:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px ${T.line}, 0 14px 26px -14px rgba(${T.shadowBase},0.4); }
  .sg-card.open { }
  .sg-card.strong { box-shadow: inset 0 0 0 2px ${T.success}88, 0 0 0 5px ${T.success}1F, 0 14px 28px -14px rgba(18,169,104,0.45); }
  .sg-card.strong::after { content: '★'; position: absolute; top: -9px; right: 14px; width: 24px; height: 24px; border-radius: 50%; background: ${T.success}; color: #fff; font-size: 13px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px -3px rgba(18,169,104,0.6); animation: sg-pop 0.4s cubic-bezier(.34,1.6,.4,1); }
  .sg-ic { grid-row: 1 / span 2; width: 44px; height: 44px; border-radius: 12px; background: ${T.bg}; display: flex; align-items: center; justify-content: center; font-size: 22px; line-height: 1; transition: background 0.2s, transform 0.35s; }
  .sg-card.open .sg-ic { background: ${T.successSoft}; transform: rotateY(360deg); }
  .sg-ex { font-family: 'Source Serif 4', serif; font-size: clamp(15px,1.9vw,17px); line-height: 1.4; overflow-wrap: anywhere; min-width: 0; }
  .sg-cue { justify-self: start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 4px 11px; }
  .sg-name { justify-self: start; font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 4px 12px; box-shadow: inset 0 0 0 1px ${T.success}44; animation: sg-pop 0.35s cubic-bezier(.34,1.6,.4,1); }
  @keyframes sg-pop { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: none; opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .sg-card, .sg-ic, .sg-meter i { transition: none; } .sg-card:hover { transform: none; } .sg-card.open .sg-ic { transform: none; } .sg-name, .sg-card.strong::after, .sg-meter i.on { animation: none; } }

  /* QA (metodist qoldig'i): qidirish joylari — BOSILMAYDIGAN tekis teg. Tugma-pill (oq fon + hoshiya) emas: nuqta bilan ajratilgan
     yozuv qatori, kursor oddiy. Mashq qiladigan joy (past baholi sharhlar) faqat rang + pastki chiziq bilan ajratiladi. */
  .src-row { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; }
  .src-chip { font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; color: ${T.ink2}; cursor: default; user-select: none; }
  .src-chip + .src-chip::before { content: '·'; display: inline-block; margin-right: 12px; color: ${T.ink3}; font-weight: 700; } /* inline-block: ajratkich nuqta pastki chiziqni olmaydi */
  .src-chip.on { color: ${T.accent}; font-weight: 700; text-decoration: underline; text-decoration-color: ${T.accent}55; text-decoration-thickness: 2px; text-underline-offset: 4px; }
  .rv-list { display: flex; flex-direction: column; gap: 7px; }
  .rv-row { display: flex; align-items: center; gap: 12px; width: 100%; min-width: 0; text-align: left; font: inherit; color: ${T.ink}; border: none; cursor: pointer; background: ${T.paper}; border-radius: 12px; padding: 9px 14px 9px 12px; box-shadow: inset 0 0 0 1px ${T.line}, 0 6px 16px -12px rgba(${T.shadowBase},0.3); transition: transform 0.15s, box-shadow 0.15s; }
  .rv-row:hover { transform: translateY(-1px); box-shadow: inset 0 0 0 1px ${T.line}, 0 10px 20px -12px rgba(${T.shadowBase},0.38); }
  .rv-row.sel { background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 22px -12px rgba(91,61,230,0.45); transform: translateX(4px); }
  .rv-stars { flex-shrink: 0; color: #E8A13A; font-size: 11px; letter-spacing: 1px; }
  .rv-stars::before { content: '★☆☆☆☆'; }
  .rv-txt { font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.7vw,16px); line-height: 1.35; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .rv-bin { position: relative; display: flex; flex-direction: column; align-items: stretch; gap: 6px; min-width: 0; min-height: 104px; text-align: left; font: inherit; color: ${T.ink}; border: 1.5px dashed ${T.ink3}88; border-radius: 16px; padding: 12px 14px; background: ${T.bg}; cursor: default; transition: background 0.2s, border-color 0.2s, box-shadow 0.2s; }
  .rv-bin.targetable { cursor: pointer; border-style: solid; border-color: ${T.accent}88; background: ${T.paper}; } /* QA: cheksiz halo olib tashlandi — ikki quti birga yonardi (88-qonun d); navbat endi to'lqin (waveCls) */
  .rv-bin.targetable:hover { border-color: ${T.accent}; }
  .rv-bin-h { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 800; font-size: 14px; }
  .rv-bin-n { margin-left: auto; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12px; font-weight: 700; color: ${T.ink3}; background: ${T.paper}; border-radius: 99px; padding: 2px 8px; box-shadow: inset 0 0 0 1px ${T.line}; }
  .rv-bin-n.full { color: ${T.success}; box-shadow: inset 0 0 0 1px ${T.success}66; background: ${T.successSoft}; }
  .rv-bin.muammo .rv-bin-h { color: ${T.success}; } .rv-bin.fikr .rv-bin-h { color: ${T.ink2}; }
  .rv-bin-ic { width: 20px; height: 20px; border-radius: 6px; flex-shrink: 0; position: relative; }
  .rv-bin.muammo .rv-bin-ic { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}66; }
  .rv-bin.muammo .rv-bin-ic::after { content: ''; position: absolute; inset: 0; background: linear-gradient(${T.success}, ${T.success}) 50% 4px / 2.5px 7px no-repeat, radial-gradient(circle, ${T.success} 1.5px, transparent 1.8px) 50% 12.5px / 4px 4px no-repeat; }
  .rv-bin.fikr .rv-bin-ic { background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.ink3}88; border-radius: 10px 10px 10px 3px; }
  .rv-bin.fikr .rv-bin-ic::after { content: ''; position: absolute; left: 5px; right: 5px; top: 9px; height: 2px; border-radius: 2px; background: ${T.ink3}; box-shadow: 0 -4px 0 ${T.ink3}88; }
  .rv-att { display: block; font-family: 'Source Serif 4', serif; font-size: 13.5px; line-height: 1.35; color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; background: ${T.paper}; border-radius: 9px; padding: 6px 10px; box-shadow: inset 0 0 0 1px ${T.line}; animation: rv-snap 0.34s cubic-bezier(.34,1.6,.4,1); }
  .rv-bin.muammo .rv-att { background: ${T.successSoft}; box-shadow: inset 0 0 0 1px ${T.success}44; }
  @keyframes rv-snap { 0% { opacity: 0; transform: translateY(-8px) scale(0.92); } 100% { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: reduce) { .rv-row, .rv-bin { transition: none; } .rv-row:hover, .rv-row.sel { transform: none; } .rv-att { animation: none; } }
  /* F-0925-QA15: sharhlar joylangach bitta ustun — o'rtada */
  .split.rv-solo { grid-template-columns: minmax(0, 520px) !important; justify-content: center; }
  .rv-bcol { min-width: 0; }
  .shake { animation: b2-shake 0.42s ease; }
  @keyframes b2-shake { 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
  @media (prefers-reduced-motion: reduce) { .shake { animation: none; } }

  .kp-ask { font-size: clamp(16px,2.2vw,20px) !important; line-height: 1.45; max-width: 640px; }

  /* F-0925-B03: voqea — O'QILADIGAN manba, javob qatorlaridan ko'rinishi bilan ajraladi: krem qog'oz, soyasiz, chap chiziqsiz,
     o'z yorlig'i bilan. Qator to'g'ri yechilganda voqeadagi bo'lak qator rangidagi marker bilan chiziladi. */
  .gb-story { display: flex; flex-direction: column; gap: 6px; min-width: 0; background: #FBF6EA; border-radius: 14px; padding: 12px 18px 14px; box-shadow: inset 0 0 0 1px #EADFC4; }
  .gb-story-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #8A6A2E; }
  .gb-story-t { font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(17px,2.3vw,21px); line-height: 1.55; color: ${T.ink}; margin: 0; overflow-wrap: anywhere; }
  .gb-mk { --mk: rgba(91,61,230,0.22); border-radius: 3px; padding: 0 2px; margin: 0 -2px; background-image: linear-gradient(var(--mk), var(--mk)); background-repeat: no-repeat; background-position: 0 90%; background-size: 0% 42%; box-decoration-break: clone; -webkit-box-decoration-break: clone; transition: background-size 0.55s cubic-bezier(.4,0,.2,1); }
  .gb-mk.kim { --mk: rgba(14,134,196,0.26); } .gb-mk.qachon { --mk: rgba(232,161,58,0.42); } .gb-mk.ogir { --mk: rgba(91,61,230,0.24); }
  .gb-mk.on { background-size: 100% 42%; }
  @media (prefers-reduced-motion: reduce) { .gb-mk { transition: none; } }
  /* F-0925-QA16: «Kim? · Qachon? · Nimasi og'ir?» qatorlarining chap rang-chizig'i olindi (rang yorliq matni va nuqtada qoladi) */
  .gb-rows { display: flex; flex-direction: column; gap: 9px; }
  .gb-row { --slot: ${T.accent}; --slotSoft: ${T.accentSoft}; display: grid; grid-template-columns: clamp(110px,15vw,150px) minmax(0,1fr); align-items: center; gap: 6px 12px; background: ${T.paper}; border-radius: 14px; padding: 9px 14px 9px 12px; box-shadow: inset 0 0 0 1px ${T.line}, 0 6px 16px -12px rgba(${T.shadowBase},0.3); transition: box-shadow 0.2s; }
  .gb-row.kim { --slot: ${T.blue}; --slotSoft: ${T.blueSoft}; } .gb-row.qachon { --slot: #E8A13A; --slotSoft: #FBEED6; } .gb-row.ogir { --slot: ${T.accent}; --slotSoft: ${T.accentSoft}; }
  @media (max-width: 640px) { .gb-row { grid-template-columns: 1fr; } }
  .gb-row.ok { box-shadow: inset 0 0 0 1.5px ${T.success}55, 0 6px 16px -12px rgba(18,169,104,0.35); }
  .gb-lbl { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; color: ${T.ink}; }
  .gb-row.qachon .gb-lbl { color: #B77A16; } .gb-row.kim .gb-lbl { color: ${T.blue}; } .gb-row.ogir .gb-lbl { color: ${T.accent}; }
  .gb-dot { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; background: var(--slotSoft); box-shadow: inset 0 0 0 2px var(--slot); position: relative; transition: background 0.2s; }
  .gb-row.ok .gb-dot { background: ${T.success}; box-shadow: none; animation: gb-pop 0.35s cubic-bezier(.34,1.6,.4,1); }
  .gb-row.ok .gb-dot::after { content: ''; position: absolute; left: 6px; top: 3px; width: 4px; height: 8px; border: solid #fff; border-width: 0 2px 2px 0; transform: rotate(45deg); }
  .gb-opts { display: flex; flex-wrap: wrap; gap: 7px; min-width: 0; }
  .gb-opt { font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.6vw,14.5px); cursor: pointer; border: none; border-radius: 10px; padding: 8px 12px; background: ${T.bg}; color: ${T.ink}; text-align: left; overflow-wrap: anywhere; box-shadow: inset 0 0 0 1px ${T.line}; transition: transform 0.15s, background 0.15s, box-shadow 0.15s; }
  .gb-opt:hover:not(:disabled) { transform: translateY(-2px); background: var(--slotSoft); box-shadow: inset 0 0 0 1.5px var(--slot), 0 6px 14px -8px rgba(${T.shadowBase},0.35); }
  .gb-opt.ok { background: ${T.successSoft}; color: ${T.success}; font-weight: 800; cursor: default; box-shadow: inset 0 0 0 1.5px ${T.success}66; animation: gb-pop 0.35s cubic-bezier(.34,1.6,.4,1); }
  /* Voqeaga mos kelmagan bo'lak — xato variant binafsha (PmLesson2/pilot 1-band), izoh-maslahat accentSoft oilasida; qizil emas */
  .gb-opt.bad { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; animation: b2-shake 0.42s ease; }
  .gb-bad { grid-column: 1 / -1; margin: 0; font-size: 13px; color: ${T.accent}; }
  @keyframes gb-pop { 0% { transform: scale(0.8); } 60% { transform: scale(1.06); } 100% { transform: none; } }
  /* F-0925-QA12: «Aniq muammo» / «Gap» qutisining baland to'q chap chizig'i olindi (qoida 42) */
  .gb-sent { position: relative; display: flex; flex-direction: column; gap: 6px; min-width: 0; background: ${T.paper}; border-radius: 14px; padding: 12px 16px; box-shadow: inset 0 0 0 1px ${T.line}, 0 8px 20px -14px rgba(${T.shadowBase},0.35); transition: box-shadow 0.25s, border-color 0.25s; }
  .gb-sent.ok { box-shadow: inset 0 0 0 2px ${T.success}77, 0 0 0 5px ${T.success}14, 0 12px 26px -14px rgba(18,169,104,0.45); }
  .gb-sent.build.ok::after { content: ''; position: absolute; top: 12px; right: 14px; width: 26px; height: 26px; border-radius: 50%; background: ${T.success}; box-shadow: 0 4px 12px -3px rgba(18,169,104,0.6); animation: gb-pop 0.4s cubic-bezier(.34,1.6,.4,1); }
  .gb-sent.build.ok::before { content: ''; position: absolute; top: 18px; right: 23px; width: 6px; height: 11px; border: solid #fff; border-width: 0 2.5px 2.5px 0; transform: rotate(45deg); z-index: 1; }
  .gb-sent-t { font-family: 'Source Serif 4', serif; font-size: clamp(16px,2.2vw,20px); line-height: 1.7; color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; padding-right: 30px; }
  .gb-ph { color: ${T.ink3}; font-style: italic; }
  .gb-sent.build .gb-ph { display: inline-block; min-width: 70px; text-align: center; font-style: normal; border-radius: 8px; padding: 0 8px; line-height: 1.5; border: 1.5px dashed ${T.ink3}; }
  .gb-ph.kim { border-color: ${T.blue}88 !important; color: ${T.blue}; } .gb-ph.qachon { border-color: #E8A13A99 !important; color: #B77A16; } .gb-ph.ogir { border-color: ${T.accent}77 !important; color: ${T.accent}; }
  .gb-fill { border-radius: 6px; padding: 0 4px; animation: gb-pop 0.32s cubic-bezier(.34,1.6,.4,1); }
  .gb-fill.ok { color: ${T.ink}; }
  .gb-fill.kim.ok { color: ${T.blue}; background: ${T.blueSoft}; } .gb-fill.qachon.ok { color: #B77A16; background: #FBEED6; } .gb-fill.ogir.ok { color: ${T.accent}; background: ${T.accentSoft}; }
  .gb-fill.bad { color: ${T.ink3}; text-decoration: underline wavy ${T.accent}88; }
  @media (prefers-reduced-motion: reduce) { .gb-opt, .gb-row, .gb-sent { transition: none; } .gb-opt:hover:not(:disabled) { transform: none; } .gb-opt.ok, .gb-opt.bad, .gb-fill, .gb-row.ok .gb-dot, .gb-sent.build.ok::after { animation: none; } }

  .ic-card { display: flex; flex-direction: column; gap: 8px; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.34); }
  .ic-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
  .ic-row { display: grid; grid-template-columns: 82px minmax(0,1fr); gap: 10px; align-items: baseline; }
  .ic-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 10.5px; letter-spacing: 0.06em; color: ${T.ink3}; }
  .ic-lbl.kim { color: ${T.blue}; } .ic-lbl.ogir { color: ${T.accent}; }
  .ic-val { font-size: 14px; color: ${T.ink}; line-height: 1.4; min-width: 0; overflow-wrap: anywhere; }
  .ip-box { display: flex; flex-direction: column; gap: 8px; }
  .ip-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .ip-chip { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; cursor: pointer; border: none; border-radius: 99px; padding: 8px 15px; background: ${T.paper}; color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .ip-chip.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  /* QA (58-qonun, 1280x800): g'oya tanlangach tanlov bir qatorga yig'iladi — «Belgilarini tekshiring» ochilganda ekran skrollsiz qoladi */
  .ip-box.compact { flex-direction: row; flex-wrap: wrap; align-items: center; gap: 6px 8px; }
  .ip-box.compact .ip-row { gap: 6px; }
  .ip-box.compact .ip-chip { font-size: 12.5px; padding: 5px 11px; }
  .pw-form { display: flex; flex-direction: column; gap: 10px; }
  @media (min-width: 761px) { .col:has(> .pw-form) > .pw-form { gap: 6px; } .col:has(> .pw-form) .pw-f input { padding-top: 9px; padding-bottom: 9px; } } /* 9-ekran: ustun-yorlig'i qo'shildi — 1280x800 da sig'ish saqlanadi */
  .col:has(> .pw-form) > .gb-sent .gb-sent-t { line-height: 1.5; } /* 9-ekran: uch qatorli aniq gap ham 1280x800 ga sig'sin */
  /* QA (58-qonun): 90+ belgili o'z muammosi 4 qatorga cho'zilib, «Saqlash» ekrandan chiqardi — 9-ekranda gap bir o'lcham kichik, ramka ixcham */
  .col:has(> .pw-form) > .gb-sent { padding: 9px 14px; gap: 3px; }
  .col:has(> .pw-form) > .gb-sent .gb-sent-t { font-size: clamp(15px,1.8vw,17px); padding-right: 0; }
  .pw-f { display: flex; flex-direction: column; gap: 5px; min-width: 0; position: relative; }
  .pw-f input { width: 100%; min-width: 0; font-family: 'Manrope'; font-size: 15px; color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 11px; padding: 11px 13px; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; transition: box-shadow 0.15s; }
  .pw-f input:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
  /* F-0925-B12 · YOZISH MAYDONI ko'rinib tursin (3/4-o'tish 2-darsi naqshi 22, barcha bridge darslariga): bo'sh maydon — kesik
     chiziqli rangli chegara + ✏️ qalamcha; navbat halqasi ichidagi bo'sh maydonda miltillovchi kursor (maydonning o'z fonida). */
  .lesson-root :is(input:not([type]), input[type="text"], textarea)::placeholder { color: ${T.ink2}; opacity: 0.85; }
  .lesson-root :is(input:not([type]), input[type="text"], textarea):placeholder-shown:not(:focus):not(:disabled):not([readonly]) { box-shadow: none; outline: 1.5px dashed ${T.accent}88; outline-offset: -1.5px; padding-right: 38px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235B3DE6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'/%3E%3Cpath d='M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; }
  .lesson-root textarea:placeholder-shown:not(:focus):not(:disabled):not([readonly]) { background-position: right 12px top 12px; }
  .lesson-root .turn-ring :is(input:not([type]), input[type="text"], textarea):placeholder-shown:not(:focus):not(:disabled):not([readonly]), .lesson-root :is(input:not([type]), input[type="text"], textarea).turn-ring:placeholder-shown:not(:focus):not(:disabled):not([readonly]) { text-indent: 8px; background-image: linear-gradient(${T.accent}, ${T.accent}), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235B3DE6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'/%3E%3Cpath d='M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'/%3E%3C/svg%3E"); background-position: 13px center, right 12px center; background-size: 2px 18px, 16px; animation: pw-caret 1.05s steps(1) infinite; }
  .lesson-root .turn-ring textarea:placeholder-shown:not(:focus):not(:disabled):not([readonly]), .lesson-root textarea.turn-ring:placeholder-shown:not(:focus):not(:disabled):not([readonly]) { background-position: 13px 12px, right 12px top 12px; }
  @keyframes pw-caret { 50% { background-size: 0 18px, 16px; } }
  @media (prefers-reduced-motion: reduce) { .lesson-root .turn-ring :is(input:not([type]), input[type="text"], textarea), .lesson-root :is(input:not([type]), input[type="text"], textarea).turn-ring { animation: none; } }
  .pw-f.on input { box-shadow: inset 0 0 0 1.5px ${T.success}88; }
  .pw-f input:disabled { opacity: 0.55; }
  .pw-f.turn-ring::after { inset: -4px; border-radius: 13px; }
  .pw-save { font-family: 'Manrope'; font-weight: 800; font-size: 14.5px; cursor: pointer; border: none; border-radius: 12px; padding: 11px 20px; background: ${T.accent}; color: #fff; box-shadow: 0 10px 22px -10px rgba(91,61,230,0.6); }
  .pw-save:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
  .sc-box { background: ${T.paper}; border-radius: 14px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .sc-toggle { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink2}; background: none; border: none; cursor: pointer; padding: 10px 14px; }
  /* QA (58-qonun): to'rt belgi ikki ustunda — ochilganda o'ng ustun 1280x800 ga sig'adi */
  .sc-body { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 6px 12px; padding: 0 14px 10px; }
  .sc-body > .sc-note { grid-column: 1 / -1; }
  .sc-item { min-width: 0; line-height: 1.3; }
  .sc-item { display: flex; align-items: center; gap: 9px; font-size: 14px; color: ${T.ink}; cursor: pointer; }
  .sc-item.on { color: ${T.success}; font-weight: 700; }
  .sc-item input { width: 17px; height: 17px; flex-shrink: 0; accent-color: ${T.success}; }
  .sc-note.sc-note { margin: 4px 0 0; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 8px 11px; }

  /* F-0925-QA13: yorliq telefonning ustida, uning chap chetidan (ilgari ustun chetidan boshlanib, blokdan tashqarida qolardi) */
  .col:has(> .ta-phone) { --ta-w: min(320px, 100%); }
  .col:has(> .ta-phone) > .flow-label { box-sizing: border-box; width: var(--ta-w); align-self: center; }
  .ta-phone { position: relative; width: var(--ta-w, min(320px, 100%)); align-self: center; border-radius: 34px; padding: 26px 12px 14px; background: ${T.paper}; box-shadow: inset 0 0 0 2px ${T.line}, inset 0 0 0 7px ${T.bg}, 0 22px 44px -24px rgba(${T.shadowBase},0.5); display: flex; flex-direction: column; gap: 10px; }
  @media (max-width: 640px) { .col:has(> .ta-phone) { --ta-w: min(250px, 100%); } }
  @media (min-width: 761px) { .col:has(> .ta-phone) { --ta-w: min(292px, 100%); } .ta-phone { padding-top: 22px; } } /* 1280x800: telefon ekranga to'liq sig'sin (58-qonun) */
  .ta-notch { position: absolute; top: 11px; left: 50%; width: 70px; height: 7px; margin-left: -35px; border-radius: 99px; background: ${T.line}; }
  .ta-map { position: relative; aspect-ratio: 300 / 190; border-radius: 20px; overflow: hidden; box-shadow: inset 0 0 0 1px ${T.line}; transition: box-shadow 0.2s; }
  .ta-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  .ta-ground { fill: #EEF3F8; }
  .ta-park { fill: ${T.successSoft}; }
  .ta-street path { fill: none; stroke: #FFFFFF; stroke-width: 9; stroke-linecap: round; }
  .ta-street path.thin { stroke-width: 5; }
  .ta-route { fill: none; stroke: ${T.accent}; stroke-width: 3.5; stroke-linecap: round; stroke-dasharray: 7 6; animation: ta-dash 1.2s linear infinite; }
  @keyframes ta-dash { to { stroke-dashoffset: -26; } }
  .ta-pick-halo { fill: ${T.accent}; opacity: 0.18; transform-box: fill-box; transform-origin: center; animation: ta-breathe 1.8s ease-in-out infinite; }
  .ta-pick-dot { fill: ${T.accent}; stroke: #FFFFFF; stroke-width: 3; }
  @keyframes ta-breathe { 50% { transform: scale(1.5); opacity: 0.06; } }
  .ta-cab-body { fill: #E8A13A; stroke: #FFFFFF; stroke-width: 1.5; } .ta-cab-glass { fill: ${T.ink}; opacity: 0.55; }
  .ta-sheet { position: relative; display: flex; flex-direction: column; gap: 6px; }
  .ta-handle { display: block; width: 36px; height: 4px; border-radius: 99px; background: ${T.line}; margin: 0 auto 2px; }
  .ta-block { position: relative; display: flex; align-items: center; gap: 11px; border-radius: 14px; padding: 7px 46px 7px 12px; background: ${T.bg}; min-height: 44px; transition: background 0.2s, box-shadow 0.2s; }
  .ta-block.lit, .ta-map.lit { box-shadow: inset 0 0 0 2px ${T.success}88, 0 0 0 4px ${T.success}1A; }
  .ta-block.lit { background: ${T.paper}; }
  .ta-coin { width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0; background: #FBEED6; box-shadow: inset 0 0 0 2px #E8A13A; position: relative; }
  .ta-coin::after { content: ''; position: absolute; left: 11px; top: 6px; width: 4px; height: 14px; border-radius: 2px; background: #E8A13A; }
  .ta-ava { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; background: ${T.blueSoft}; position: relative; overflow: hidden; }
  .ta-ava::before { content: ''; position: absolute; left: 9px; top: 5px; width: 10px; height: 10px; border-radius: 50%; background: ${T.blue}; }
  .ta-ava::after { content: ''; position: absolute; left: 5px; top: 17px; width: 18px; height: 14px; border-radius: 9px 9px 0 0; background: ${T.blue}; }
  .ta-lines { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
  .ta-sub { font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; line-height: 1.2; overflow-wrap: anywhere; }
  .ta-eta { position: absolute; left: 10px; top: 10px; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; color: ${T.ink}; background: rgba(255,255,255,0.94); border-radius: 99px; padding: 4px 10px; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.4); }
  .ta-map.lit .ta-eta { color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}88; }
  .ta-pair { display: flex; flex-direction: column; gap: 3px; }
  .ta-sol { font-weight: 700; color: ${T.ink}; }
  .ta-prob { font-size: 13.5px; font-weight: 700; color: ${T.success}; }
  .ta-price { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 14.5px; color: ${T.ink}; line-height: 1.1; }
  .ta-block.narx.lit .ta-price { color: #B77A16; }
  .ta-plate { display: inline-flex; align-self: flex-start; align-items: center; gap: 5px; height: 19px; border-radius: 4px; padding: 0 6px 0 3px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.ink2}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 10.5px; color: ${T.ink}; white-space: nowrap; }
  .ta-plate i { font-style: normal; padding-right: 4px; border-right: 1.5px solid ${T.ink3}; }
  .ta-stars { font-size: 16px; line-height: 1; letter-spacing: 3px; color: ${T.ink3}; }
  .ta-stars::before { content: '☆☆☆☆☆'; }
  .ta-block.baho.lit .ta-stars { color: #E8A13A; }
  .ta-block.baho.lit .ta-stars::before { content: '★★★★★'; }
  .ta-spot-at { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); }
  .ta-spot-at.xarita { top: auto; bottom: 10px; right: 10px; transform: none; }
  .ta-spot { position: relative; width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 13px; color: #fff; background: ${T.accent}; box-shadow: 0 6px 14px -6px rgba(91,61,230,0.6); transition: transform 0.15s; }
  .ta-spot::before { content: ''; position: absolute; inset: -5px; border-radius: 50%; box-shadow: 0 0 0 3px rgba(91,61,230,0.22); pointer-events: none; } /* QA: to'rt raqamning cheksiz «ping»i olib tashlandi — to'rttasi birga yonardi (88-qonun d); navbatni turn-walk ko'rsatadi */
  .ta-spot:hover { transform: scale(1.1); }
  .ta-spot.seen { background: ${T.success}; box-shadow: 0 6px 14px -6px rgba(18,169,104,0.6); }
  .ta-spot.seen::before { opacity: 0; }
  .ta-spot.on { box-shadow: 0 0 0 3px #FFFFFF, 0 0 0 5px ${T.success}66; }
  .ta-list { display: flex; flex-direction: column; gap: 8px; }
  .ta-item { display: flex; align-items: flex-start; gap: 10px; background: ${T.paper}; border-radius: 12px; padding: 11px 14px; box-shadow: inset 0 0 0 1px ${T.line}, 0 6px 16px -12px rgba(${T.shadowBase},0.3); min-width: 0; transition: border-color 0.2s, box-shadow 0.2s; }
  .ta-item.on { box-shadow: inset 0 0 0 1px ${T.success}44, 0 8px 18px -12px rgba(18,169,104,0.35); animation: rv-snap 0.3s ease; }
  .ta-item-n { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center; }
  .ta-item.on .ta-item-n { background: ${T.success}; color: #fff; }
  .ta-item-t { font-size: 14.5px; line-height: 1.4; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .ta-item-q { color: ${T.ink3}; }
  @media (prefers-reduced-motion: reduce) { .ta-route, .ta-pick-halo, .ta-spot::before, .ta-item.on { animation: none; } .ta-spot, .ta-block, .ta-item { transition: none; } }

  /* F-0925-B04 · juftlash-taxta: chapda takliflar (sariq — g'oya), o'ngda muammolar (shaftoli — og'riq); juftlangach yashil.
     Tanlangan taklif to'q sariq halqa bilan ko'tariladi; bosish mumkin bo'lgan muammo qutilari to'lqin (waveCls) bilan yonadi. */
  .mt-board { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 12px clamp(16px,2.4vw,28px); align-items: start; }
  @media (max-width: 640px) { .mt-board { grid-template-columns: 1fr; } }
  .mt-col { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .mt-pool, .mt-targets { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .mt-sol { position: relative; display: flex; align-items: center; width: 100%; min-height: 52px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.6vw,14.5px); line-height: 1.35; cursor: pointer; border: none; border-radius: 14px; padding: 10px 14px 10px 12px; text-align: left; background: #FFF8E1; color: ${T.ink}; box-shadow: inset 0 0 0 1px #F0DFA6, 0 6px 16px -10px rgba(${T.shadowBase},0.28); overflow-wrap: anywhere; transition: transform 0.15s, box-shadow 0.15s, background 0.15s; }
  .mt-sol:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px #E9CF78, 0 10px 20px -10px rgba(${T.shadowBase},0.36); }
  .mt-sol.sel { background: #FFEFB8; box-shadow: inset 0 0 0 2px #D9A21F, 0 12px 24px -10px rgba(217,162,31,0.5); transform: translateY(-2px); }
  .mt-pool-done { margin: 0; min-height: 52px; display: flex; align-items: center; justify-content: center; border-radius: 14px; border: 1.5px dashed ${T.success}66; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; }
  .mt-tgt { display: flex; flex-direction: column; align-items: stretch; gap: 8px; min-width: 0; min-height: 52px; text-align: left; font: inherit; color: ${T.ink}; border: none; border-radius: 14px; padding: 12px 14px; background: #FFF1EC; box-shadow: inset 0 0 0 1.5px #F4CFC3; cursor: default; transition: box-shadow 0.2s, background 0.2s; }
  .mt-tgt.targetable { cursor: pointer; box-shadow: inset 0 0 0 2px #E39A85; } /* QA: halo o'rniga to'lqin (waveCls) — lahzada bitta quti */
  .mt-tgt.targetable:hover { box-shadow: inset 0 0 0 2px #CF6F55; }
  .mt-tgt.none { background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.ink3}66; border: none; outline: 1.5px dashed ${T.ink3}88; outline-offset: -5px; }
  .mt-tgt.none.targetable { outline-color: #CF6F55; }
  .mt-tgt.filled { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}66; animation: none; }
  .mt-tgt.none.filled { background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.ink3}66; }
  .mt-tgt-h { display: flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-weight: 800; font-size: 14px; line-height: 1.35; overflow-wrap: anywhere; min-width: 0; }
  .mt-ic { width: 20px; height: 20px; border-radius: 6px; flex-shrink: 0; background: #FFE0D6; box-shadow: inset 0 0 0 1.5px #CF6F5588; position: relative; }
  .mt-ic::after { content: ''; position: absolute; inset: 0; background: linear-gradient(#C4583D, #C4583D) 50% 4px / 2.5px 7px no-repeat, radial-gradient(circle, #C4583D 1.5px, transparent 1.8px) 50% 12.5px / 4px 4px no-repeat; }
  .mt-tgt.filled .mt-ic { background: ${T.success}; box-shadow: none; } .mt-tgt.filled .mt-ic::after { background: none; left: 7px; top: 3px; right: auto; bottom: auto; width: 4px; height: 9px; border: solid #fff; border-width: 0 2px 2px 0; transform: rotate(45deg); }
  .mt-tgt.none .mt-ic, .mt-tgt.none.filled .mt-ic { background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.ink3}; border-radius: 4px 4px 6px 6px; }
  .mt-tgt.none .mt-ic::after, .mt-tgt.none.filled .mt-ic::after { inset: 0; width: auto; height: auto; border: none; transform: none; background: linear-gradient(${T.ink2}, ${T.ink2}) 50% 50% / 10px 2px no-repeat; }
  /* Juftlangan taklif muammo kartasi ichida ham «g'oya» rangida qoladi — ikkisi birga turgani ko'rinadi */
  .mt-att { display: block; font-size: 13.5px; line-height: 1.35; color: ${T.ink}; font-weight: 700; overflow-wrap: anywhere; background: #FFF8E1; border-radius: 10px; padding: 6px 10px; box-shadow: inset 0 0 0 1px #F0DFA6; animation: rv-snap 0.34s cubic-bezier(.34,1.6,.4,1); }
  .mt-tgt.none .mt-att { color: ${T.ink2}; background: ${T.paper}; text-decoration: line-through ${T.ink3}; box-shadow: inset 0 0 0 1px ${T.line}; }
  @media (prefers-reduced-motion: reduce) { .mt-sol, .mt-tgt { transition: none; } .mt-sol:hover, .mt-sol.sel { transform: none; } .mt-att { animation: none; } }

  .sl-problem { display: grid; grid-template-columns: auto minmax(0,1fr); gap: 10px; align-items: baseline; background: ${T.paper}; border-radius: 14px; padding: 12px 16px; box-shadow: inset 0 0 0 1px ${T.line}, 0 8px 20px -14px rgba(${T.shadowBase},0.3); }
  .sl-problem-t { font-family: 'Source Serif 4', serif; font-size: clamp(15px,2vw,18px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; }
  .sl-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
  @media (max-width: 760px) { .sl-grid { grid-template-columns: 1fr; } }
  .sl-card { display: flex; flex-direction: column; gap: 10px; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.3); }
  .sl-card.ok { box-shadow: inset 0 0 0 1.5px ${T.success}66, 0 10px 24px -14px rgba(${T.shadowBase},0.3); }
  .sl-n { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 800; font-size: 13px; }
  .sl-n-dot { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; background: ${T.successSoft}; box-shadow: inset 0 0 0 2px ${T.success}66; position: relative; }
  .sl-card.ok .sl-n-dot { background: ${T.success}; box-shadow: none; animation: gb-pop 0.35s cubic-bezier(.34,1.6,.4,1); }
  .sl-card.ok .sl-n-dot::after { content: ''; position: absolute; left: 6px; top: 3px; width: 4px; height: 8px; border: solid #fff; border-width: 0 2px 2px 0; transform: rotate(45deg); }
  .sl-card { border-radius: 16px; }
  .sl-card.ok { }
  @media (prefers-reduced-motion: reduce) { .sl-card.ok .sl-n-dot { animation: none; } }
  .sl-hint.sl-hint { margin: -5px 0 0; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 5px 10px; } /* QA: ikki maslahat birga chiqqanda +5px skroll — ixchamroq */

  /* === AI QADAMI (15) — AiStep. Manba DeployLesson 3314-3340, 3416-3431 (pilot B1 bilan bir xil); aksent bridge binafshasi === */
  .ais { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .pr-panel { display: flex; flex-direction: column; background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); }
  .pr-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 13px; border-bottom: 1px solid ${T.line}; }
  .pr-ic { flex-shrink: 0; width: 30px; height: 30px; border: none; border-radius: 8px; cursor: pointer; background: ${T.bg}; color: ${T.ink2}; font-size: 15px; line-height: 1; display: inline-flex; align-items: center; justify-content: center; transition: background 0.15s, box-shadow 0.15s; }
  .pr-ic:hover { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .pr-ic.ok { background: ${T.successSoft}; color: ${T.success}; font-weight: 800; }
  .ais-foot { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; min-width: 0; }
  .ais-go.on { color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
  .ais-foot > .ais-t { margin: 0; padding: 0 2px; }
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
  .ai-ready { display: flex; flex-direction: column; gap: 6px; }
  .ai-rq { text-align: left; font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; cursor: pointer; border: none; border-radius: 10px; padding: 8px 12px; background: ${T.bg}; color: ${T.ink}; }
  .ai-rq.on { background: ${T.successSoft}; color: ${T.success}; font-weight: 800; }
  .ai-rule.ai-rule { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 13px; }
  /* 15-ekran (B2): 🛟 zaxira ochilganda ekran pastga chiqib ketmasin (58-qonun) — tayyor savollar qisqa, chip-qatorga teriladi. */
  /* Kompyuterda 🛟 zaxira o'ng ustunga — savol-maydonlari tagiga tushadi (tayyor savollar aynan o'sha maydonlarga yoziladi).
     JSX o'zgarmaydi: chap ustun va .ais «display: contents» bo'lib, ularning bolalari .split gridiga joylashadi. */
  @media (min-width: 761px) {
    .split:has(> .col > .ais) { grid-template-rows: auto 1fr; row-gap: 8px; align-items: start; }
    .split:has(> .col > .ais) > .col:has(> .ais), .split:has(> .col > .ais) .ais { display: contents; }
    .split:has(> .col > .ais) .pr-panel { grid-column: 1; grid-row: 1; align-self: stretch; } /* o'ng ustun balandroq bo'lsa oq karta to'ldiradi — bo'sh tirqish qolmaydi */
    .split:has(> .col > .ais) .ais-foot { grid-column: 1; grid-row: 2; }
    .split:has(> .col > .ais) > .col:not(:has(> .ais)) { grid-column: 2; grid-row: 1; }
    .lesson-root .screen.dense .split:has(> .col > .ais) > .col:not(:has(> .ais)) { gap: 5px; } /* o'ng ustun-yorlig'i qo'shildi — RU 1280x800 da sig'ish saqlanadi */
    .split:has(> .col > .ais) .dsx-fb { grid-column: 2; grid-row: 2; }
    /* QA (58-qonun): zaxira ochilganda UZ 1280x800 da +15px chiqardi — tayyor savol-pill'lar ixchamroq */
    .split:has(> .col > .ais) .dsx-fb[open] > summary { margin-bottom: 6px; }
    .split:has(> .col > .ais) .ai-ready { gap: 5px 6px; }
    .split:has(> .col > .ais) .ai-rq { padding-top: 4px; padding-bottom: 4px; }
    /* So'rov-oynasi 1-qator balandligini (o'ngdagi maydonlar) to'ldiradi, ortig'i ichida aylanadi — matn to'liq qoladi (58-qonun) */
    .split:has(> .col > .ais) .pr-body { max-height: none; flex: 1 1 0; min-height: var(--pr-min, 128px); } /* F-0925-QA35: qadam-qatorlari olingan joy hisobiga ~7 qator */
    .split:has(> .col > .ais) .pr-head { padding-top: 5px; padding-bottom: 5px; }
    .split:has(> .col > .ais) .ais-link { padding-top: 7px; padding-bottom: 7px; }
  }
  .ai-ready { flex-direction: row; flex-wrap: wrap; }
  .ai-ready > p { flex: 1 0 100%; }
  .ai-rq { font-size: 13px; padding: 6px 11px; border-radius: 99px; box-shadow: inset 0 0 0 1px ${T.line}; transition: transform 0.15s, box-shadow 0.15s; }
  .ai-rq:not(.on):hover { transform: translateY(-1px); box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 6px 14px -8px rgba(${T.shadowBase},0.3); }
  .ai-rq.on { box-shadow: inset 0 0 0 1.5px ${T.success}; }
  @media (prefers-reduced-motion: reduce) { .ai-rq, .ai-rq:hover { transition: none; transform: none; } }

  .pa-qs { display: flex; flex-direction: column; gap: 8px; }
  .pa-q { display: flex; gap: 10px; align-items: flex-start; background: ${T.paper}; border-radius: 12px; padding: 11px 14px; box-shadow: 0 6px 16px -12px rgba(${T.shadowBase},0.3); min-width: 0; }
  .pa-q-n { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center; }
  .pa-q-t { font-family: 'Source Serif 4', serif; font-size: 15.5px; color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; }
  .pa-line { display: flex; flex-direction: column; gap: 10px; }
  .pa-reply { display: flex; align-items: flex-end; gap: 9px; margin-top: 4px; flex-direction: row-reverse; }
  .pa-ava { flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background: ${T.blueSoft}; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .pa-bub { display: flex; flex-direction: column; gap: 3px; min-width: 0; max-width: 86%; background: ${T.blueSoft}; border-radius: 14px 14px 4px 14px; padding: 9px 13px; box-shadow: inset 0 0 0 1px ${T.blue}33; }
  .pa-who { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.blue}; }
  .pa-said { font-family: 'Source Serif 4', serif; font-size: 15px; color: ${T.ink}; overflow-wrap: anywhere; }
  .pa-reply.on .pa-bub { animation: rv-snap 0.34s cubic-bezier(.34,1.6,.4,1); }
  .pa-typing { display: inline-flex; gap: 4px; padding: 4px 0 2px; }
  .pa-typing b { width: 6px; height: 6px; border-radius: 50%; background: ${T.blue}; opacity: 0.3; animation: hk-dot 1.2s ease-in-out infinite; }
  .pa-typing b:nth-child(2) { animation-delay: 0.2s; } .pa-typing b:nth-child(3) { animation-delay: 0.4s; }
  @media (prefers-reduced-motion: reduce) { .pa-typing b, .pa-reply.on .pa-bub { animation: none; opacity: 0.7; } }
  /* 9-ekran holat-paneli: 7-ekran rang-tili (qachon amber · kim ko'k · og'ir indigo) + saqlash yashil */
  .pw-meter { display: flex; flex-wrap: wrap; gap: 6px; background: ${T.paper}; border-radius: 14px; padding: 10px 12px; box-shadow: inset 0 0 0 1px ${T.line}; }
  .pw-seg { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink3}; border-radius: 99px; padding: 4px 10px 4px 5px; background: ${T.bg}; transition: background 0.2s, color 0.2s; }
  .pw-seg i { width: 16px; height: 16px; border-radius: 50%; font-style: normal; font-size: 10px; color: #fff; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1.5px ${T.ink3}88; }
  .pw-seg.on { color: ${T.ink}; } .pw-seg.on i { box-shadow: none; animation: sg-bar 0.35s cubic-bezier(.34,1.6,.4,1); }
  .pw-seg.qachon.on { background: #FBEED6; } .pw-seg.qachon.on i { background: #E8A13A; }
  .pw-seg.kim.on { background: ${T.blueSoft}; } .pw-seg.kim.on i { background: ${T.blue}; }
  .pw-seg.ogir.on { background: ${T.accentSoft}; } .pw-seg.ogir.on i { background: ${T.accent}; }
  .pw-seg.save.on { background: ${T.successSoft}; color: ${T.success}; } .pw-seg.save.on i { background: ${T.success}; }
  @media (prefers-reduced-motion: reduce) { .pw-seg { transition: none; } .pw-seg.on i { animation: none; } }
  /* ⛶ Zoomable (pilot B1 naqshi 11-band) + ustun-yorlig'i (10-band) */
  .zoomable { position: relative; min-width: 0; }
  .zoom-btn { position: absolute; top: 4px; right: 4px; z-index: 6; width: 26px; height: 26px; border-radius: 8px; border: none; background: rgba(255,255,255,0.86); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
  .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
  .zoomable.zsplit > .zoom-btn { top: -11px; right: 0; }
  .zoomable.zleft > .zoom-btn { top: 10px; left: 10px; right: auto; }
  .zoom-on.zsplit > .zoom-btn, .zoom-on > .zoom-btn { top: 10px; right: 10px; left: auto; }
  .zoom-backdrop { position: fixed; inset: 0; background: rgba(27,22,48,0.55); z-index: 1000; animation: fade-op 0.25s ease; }
  .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(960px,94vw); max-height: calc(92vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.bg}; border-radius: 18px; padding: clamp(20px,3.4vw,38px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
  .zoom-on .col:has(> .ta-phone) { --ta-w: min(340px, 100%); }
  @keyframes fade-op { from { opacity: 0; } to { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .zoom-on, .zoom-backdrop { animation: none !important; } .zoom-btn:hover { transform: none; } }
  .flow-label.flow-label { margin: 0 0 -4px; padding-right: 40px; }

  .pod-me { display: flex; flex-direction: column; align-items: center; gap: 6px; align-self: center; background: ${T.paper}; border-radius: 20px; padding: 22px 38px; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.4); }
  .pod-me-medal { font-size: 46px; line-height: 1; }
  .pod-me-place { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(24px,4vw,32px); color: ${T.accent}; }
  .pod-me-score { font-size: 15px; color: ${T.ink2}; font-weight: 700; }

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
