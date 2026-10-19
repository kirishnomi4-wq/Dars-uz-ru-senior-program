import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, createContext, useContext, useCallback } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// BRIDGE (O'TISH) · 1- va 2-o'tish 1-darsi — «KIM UCHUN QILYAPMIZ?» (OLX · Facebook keysi)
// Senariy-manba: pm-senariylar/BRIDGE-B1-KimUchun.md (GATE S tasdiqlangan, 2026-09-23).
// Mavzu: auditoriya («aniq odam, aniq vaziyatda») · struktura (sahifada birinchi nima turadi).
// Misol-ip: OLX (brendsiz sxema — faqat ko'rinadigan joylar). Keys: Facebook (faqat bank-faktlari).
// O'z ishi: g'oya-kartasi (KIM · MUAMMO · YECHIM) → bridgeCard.js (ccBridgeCard) — keyingi bridge darsga o'tadi.
// KARKAS-MANBA: src/pm/PmUserStoryLesson.jsx (P0) — T tokenlar, Stage/Mentor/MentorNote, QuestionScreen+
//        MentorTestStats, nishonlar (151/152-qonun), Podium, CodeStrike arena, progRead/progWrite, jonli relslar.
//        Flashcard — PmLesson16 `Flashcards` porti. P0 dagi kompilyator, uyga vazifa, ustaxona/peer/klinika/
//        prioritet, hikoya-daftar va recap-overlay OLIB TASHLANGAN (bridge qolipida yo'q).
// Uyga vazifa, koding, LMS YO'Q (senariy pasporti). Jonli ball — src/live (bridge yig'masida Supabase).
// SHRIFT: bridge sayti mustaqil (LMS yo'q) — <style> ichidagi @import shu yerda QOLADI.
// ============================================================

import { cardRead, cardWrite, READY_IDEAS } from '../bridgeCard.js';
// Jonli dars (live) — umumiy modul: src/live/ (hook + darvoza + belgi + mijoz + server-progress).
import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers, setLiveLang, buildResultDetails, sealPayload, useAutoNext } from '../../live/index.js';

// ============================================================
// 🎨 PM-STUDIA IDENTITET (PM_DARS_ETALON 1-bo'lim — P0 dan AYNAN)
// ============================================================
const T = {
  bg: '#F2F0FA', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4',
  paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', accentVivid: '#6E4BFF',
  success: '#12A968', successSoft: '#E4F5EC', blue: '#0E86C4', blueSoft: '#E1F3FB', link: '#5B3DE6',
  line: '#E7E3F4', err: '#E5484D', errSoft: '#FCE7E8',
  shadowBase: '40, 34, 82'
};
// Karta-qator semantikasi (formula-slot oilasi): KIM=ko'k · MUAMMO=amber · YECHIM=yashil
const AMBER = '#B77A16';
const AMBER_SOFT = '#FBF1DE'; // NIMA/MUAMMO slot foni (P0 formula-slot oilasi)


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


// ============================================================ DARS META
const LESSON_META = { lessonId: 'bridge-b1-v1', lessonTitle: { uz: 'Kim uchun qilyapmiz?', ru: 'Для кого мы делаем?' } };
// 21 ekran — senariy 3-bo'lim tartibi. Ballik testlar: 5 · 8 · 11 · 14 (idx 4 · 7 · 10 · 13), har biri o'z nazariyasidan keyin.
const SCREEN_META = [
  { id: 'hook',   type: 'hook',        template: 'custom', scored: false, scope: 'hook' },         // 0  · 1  Hook (ovoz)
  { id: 'maqsad', type: 'rule',        template: 'custom', scored: false, scope: null },           // 1  · 2  Maqsad (karta → sahifa)
  { id: 'ikki',   type: 'exploration', template: 'custom', scored: false, scope: null },           // 2  · 3  Ikki odam
  { id: 'hamma',  type: 'exploration', template: 'custom', scored: false, scope: null },           // 3  · 4  «Hamma uchun» almashtirgichi
  { id: 's5',     type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 4  · 5  TEST-1
  { id: 'keys',   type: 'case',        template: 'custom', scored: false, scope: null },           // 5  · 6  Keys: Facebook
  { id: 'karta',  type: 'practice',    template: 'custom', scored: false, scope: null },           // 6  · 7  Kartani yig'ing
  { id: 's8',     type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 7  · 8  TEST-2
  { id: 'goya',   type: 'practice',    template: 'custom', scored: false, scope: null },           // 8  · 9  O'z g'oyangiz (ustaxona)
  { id: 'olx',    type: 'exploration', template: 'custom', scored: false, scope: null },           // 9  · 10 OLX bosh sahifasi
  { id: 's11',    type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 10 · 11 TEST-3
  { id: 'yangi',  type: 'exploration', template: 'custom', scored: false, scope: null },           // 11 · 12 «Yangi saytni-chi?»
  { id: 'bolim',  type: 'exploration', template: 'custom', scored: false, scope: null },           // 12 · 13 Kartadan sahifaga
  { id: 's14',    type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 13 · 14 TEST-4
  { id: 'tartib', type: 'practice',    template: 'custom', scored: false, scope: null },           // 14 · 15 Tartibga qo'ying
  { id: 'sahifa', type: 'practice',    template: 'custom', scored: false, scope: null },           // 15 · 16 O'z sahifangiz (ustaxona)
  { id: 'ai',     type: 'practice',    template: 'custom', scored: false, scope: null },           // 16 · 17 AI bilan birinchi blok
  { id: 'juft',   type: 'recap',       template: 'custom', scored: false, scope: null },           // 17 · 18 Juftlik
  { id: 'podium', type: 'stats',       template: 'custom', scored: false, scope: null },           // 18 · 19 Podium
  { id: 'flash',  type: 'flashcard',   template: 'custom', scored: false, scope: null },           // 19 · 20 Flashcard
  { id: 'yakun',  type: 'summary',     template: 'custom', scored: false, scope: null }            // 20 · 21 Arena + yakun
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// SCREEN_INTENTS — har ekran nima uchun mavjud (1 gap). Render qilinmaydi; 👦 O'quvchi-simulyator tekshiradi.
export const SCREEN_INTENTS = {
  hook: "Bola o'z tajribasidan OLX kim uchun ekaniga ovoz beradi; javob hozir ochilmaydi (3-ekranda ochiladi)",
  maqsad: "Bola dars oxirida o'z g'oyasi kartasi sahifaga aylanishini ko'z oldida ko'radi",
  ikki: "Bola OLX'ga ikki xil odam (sotuvchi va xaridor) kelishini bosib ko'radi va «auditoriya» atamasini oladi",
  hamma: "Bola «hamma uchun» gapda sotuvchi o'zini tanimasligini almashtirgichda o'zi ko'radi",
  s5: "Bola «hamma uchun» sahifa nega kam odamni qiziqtirishini topadi",
  keys: "Bola Facebook ham avval bitta aniq guruh uchun ochilganini bashorat qilib, slaydlarda biladi",
  karta: "Bola OLX sotuvchisi haqida KIM · MUAMMO · YECHIM ni bittalab tanlab, «auditoriya-karta» nomini oladi",
  s8: "Bola uchala bo'lagi (KIM, MUAMMO, YECHIM) bor g'oyani ajratadi",
  goya: "Bola o'z (yoki tayyor) g'oyasining kartasini yozib saqlaydi — karta keyingi bridge darsga o'tadi",
  olx: "Bola OLX bosh sahifasidagi uch joy kim uchun ekanini bosib ochadi",
  s11: "Bola qidiruv qatori eng katta joyda turishini xaridorning birinchi harakati bilan bog'laydi",
  yangi: "Bola yangi sayt tepasida avval «bu nima va kim uchun» yozilishi kerakligini almashtirgichda ko'radi",
  bolim: "Bola yangi sahifaning 5 bo'limini bittalab ochib, kartaning qatorlari qaysi bo'limga tushishini ko'radi",
  s14: "Bola tugma muammo va yechimdan keyin turishini topadi",
  tartib: "Bola 5 bo'limni tartiblaydi va sotuvchi sahifani tugmagacha o'qiydimi — simulyatsiyada ko'radi",
  sahifa: "Bola o'z kartasidan yig'ilgan sahifaga birinchi blok gapi va tugma matnini yozadi",
  ai: "Bola kartasidan yig'ilgan so'rov bilan AI dan sarlavha variantlarini oladi va bittasini o'zi tanlaydi",
  juft: "Bola sherigiga g'oyasi kim uchun ekanini aytib, eng muhim fikrni bir qatorga yozadi",
  podium: "Bola testlardagi natijasini (jonlida — sinf reytingini) ko'radi",
  flash: "Bola 5 kartada bugungi asosiy fikrlarni o'zi tekshiradi",
  yakun: "Bola arenaga kiradi va darsning 3 xulosasini ko'radi"
};


const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;

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


// Scored ekranlar javob kaliti — ⚡ Jonli TASDIQLAYDI. Senariyda ✓ birinchi yozilgan — pozitsiya shu yerda aralashtirildi
// (s5 → C · s8 → B · s11 → D · s14 → A). Ishtirok-kalitlar (-1): amaliyot-signali PRACTICE_BASE+screen.
const INLINE_KEYS = { s5: 2, s8: 1, s11: 3, s14: 0, practice: -1 };


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

// QuestionScreen — scored test mexanikasi (P0 porti; jonli-ball KAFOLATLI: submitAnswer imzosi + Kahoot-reveal).
// Bridge: hotspot varianti va recap-overlay olib tashlangan (senariyda yo'q).
const QuestionScreen = ({ screen, scope, eyebrow, question, questionText, options, correctIdx, explainCorrect, explainWrong, ctaLabel, revealPrefix = tr({ uz: "To'g'ri javob", ru: 'Верный ответ' }), storedAnswer, onAnswer, onNext, onPrev }) => {
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
  return (
    <Stage eyebrow={eyebrow} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext disabled={isMentorLive ? !mReveal : !solved} label={isMentorLive ? (mReveal ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Avval natijani oching', ru: 'Сначала откройте результат' })) : solved ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : (ctaLabel || tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' }))} onClick={onNext} /></>}>
      <div className={`screen qs${picked !== null || mReveal ? ' qs-on' : ''}`} style={{ justifyContent: isMentorLive ? 'flex-start' : 'safe center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {/* Tanlagach variantlar ixchamlashadi — izoh chiqqanda ekran skrollsiz qoladi (PmLesson2 naqshi) */}
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
  // Rasm yuklanguncha yoki yuklanmasa (tarmoq yo'q / manzil o'zgargan) — bo'sh doira emas, 🧑‍🏫 zaxira-belgisi (accentSoft fonda).
  // Rasm faqat haqiqatan yuklangach (onLoad / complete) ko'rinadi va belgini yopadi.
  const [imgOk, setImgOk] = useState(false);
  const [imgFail, setImgFail] = useState(false);
  const imgRef = useRef(null);
  useEffect(() => { const im = imgRef.current; if (im && im.complete && im.naturalWidth > 0) setImgOk(true); }, []);
  return (
    <div className={`mentor fade-up ${enabled ? 'mentor-mob' : ''} ${collapsed ? 'is-collapsed' : ''}`} onClick={collapsed ? expand : undefined} role={collapsed ? 'button' : undefined}>
      <div className={`mentor-ava${imgOk ? ' ok' : ''}`} aria-hidden="true">
        {!imgOk && <span className="mentor-ava-fb">🧑‍🏫</span>}
        {!imgFail && <img ref={imgRef} src={MENTOR_IMG} alt="" onLoad={() => setImgOk(true)} onError={() => setImgFail(true)} />}
      </div>
      <div className="mentor-col">
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> · {tr({ uz: "ko'rsatmani ochish", ru: 'открыть подсказку' })} ▾</span>}</span>
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


// ============================================================ BRIDGE UMUMIY YORDAMCHILAR
// F-0915-02: karta localStorage'dan keladi — buzuq/eski yozuvda maydon son/obyekt bo'lishi mumkin (.trim → oq ekran).
// Faqat STRING maydonlar olinadi; obyekt bo'lmagan yozuv — bo'sh karta.
const cardSafe = () => { const c = cardRead(); if (!c || typeof c !== 'object' || Array.isArray(c)) return {}; const o = {}; Object.keys(c).forEach(k => { if (typeof c[k] === 'string') o[k] = c[k]; }); return o; };
const cap = (s) => (s ? s.charAt(0).toLocaleUpperCase() + s.slice(1) : s);
const clean = (s) => (s || '').trim().replace(/[.!?…]+$/, '');
const filled = (s) => (s || '').trim().length >= 2;
const useIsMentor = () => { const g = useContext(LiveGateCtx) || {}; return !!(g.live && g.live.mode === 'mentor'); };
// Amaliyot-signali (mentor paneli «kim bajardi») — ball-relsga yozmaydi, faqat ishtirok (INLINE_KEYS -1).
const sendPractice = (live, screen) => { if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); };
// 31-qonun: mentor HECH QAYSI amaliyotda majburan to'ldirmaydi — yozuv MentorNote (Eslatma) ichida.
const MENTOR_FREE = { uz: "👨‍🏫 Jonli darsda bu amaliyotni o'quvchilar bajaradi — siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: '👨‍🏫 На живом уроке это задание выполняют ученики — вы наблюдаете; «Продолжить» для вас открыто.' };

// Karta-qator yorliqlari (KIM=ko'k · MUAMMO=amber · YECHIM=yashil)
const ROW_META = [
  { key: 'kim', lbl: { uz: 'KIM', ru: 'КТО' }, col: T.blue },
  { key: 'muammo', lbl: { uz: 'MUAMMO', ru: 'ПРОБЛЕМА' }, col: AMBER },
  { key: 'yechim', lbl: { uz: 'YECHIM', ru: 'РЕШЕНИЕ' }, col: T.success },
];
// 7-ekrandagi OLX-sotuvchi kartasi (to'g'ri javoblar) — 13/15-ekranda sahifaga aylanadi
const SELLER = {
  kim: { uz: "Eski narsasini sotmoqchi bo'lgan odam", ru: 'Человек, который хочет продать свою старую вещь' },
  muammo: { uz: "Sotish uchun bozorda kun bo'yi turishi kerak", ru: 'Чтобы продать, нужно весь день стоять на рынке' },
  yechim: { uz: "Uydan chiqmay, e'lon orqali xaridor topishga yordam beradi", ru: 'Помогает найти покупателя через объявление, не выходя из дома' },
};
const SELLER_HEAD = { uz: 'Keraksiz narsangizni uydan chiqmay soting', ru: 'Продайте ненужную вещь, не выходя из дома' };
const ELON = { uz: "E'lon berish", ru: 'Подать объявление' };
// Sahifaning 5 bo'limi (13 · 15 · 16-ekran)
const PAGE_SECS = [
  { key: 'blok', lbl: { uz: 'Birinchi blok', ru: 'Первый блок' }, row: 'kim' },
  { key: 'muammo', lbl: { uz: 'Muammo', ru: 'Проблема' }, row: 'muammo' },
  { key: 'qanday', lbl: { uz: 'Qanday ishlaydi', ru: 'Как это работает' }, row: 'yechim' },
  { key: 'isbot', lbl: { uz: 'Isbot', ru: 'Доказательство' }, row: null },
  { key: 'tugma', lbl: { uz: 'Tugma', ru: 'Кнопка' }, row: null },
];
const SELLER_PAGE = { blok: SELLER_HEAD, muammo: SELLER.muammo, qanday: SELLER.yechim, isbot: { uz: 'Boshqa sotuvchilar fikri', ru: 'Отзывы других продавцов' }, tugma: ELON };
// Tayyor g'oyalar matni — to'g'ridan bridgeCard.js READY_IDEAS dan (qolip-aniqlashtirishlari o'sha yerga ko'chirilgan, 2026-09-24).
const secLbl = (key) => tr(PAGE_SECS.find(s => s.key === key).lbl);
// Bo'lim chap hoshiyasi — kartaning o'sha qatori rangi (blok=KIM ko'k · muammo=amber · qanday=YECHIM yashil); isbot/tugma — neytral
const secCol = (key) => { const row = (PAGE_SECS.find(s => s.key === key) || {}).row; const m = ROW_META.find(r => r.key === row); return m ? m.col : T.line; };
// Bo'lim-ikonkasi (15-ekran): yorliq yonida bo'lim turini ko'rsatadi — nomni takrorlamaydi
const SEC_IC = { blok: '👋', muammo: '😣', qanday: '⚙️', isbot: '💬', tugma: '👆' };

// Brauzer-ramka (sahifa sxemalari uchun) — manzil-qatori bo'sh, brend yo'q
const BrowserFrame = ({ children, className = '', url = '' }) => (
  <div className={`bf ${className}`}>
    <div className="bf-bar" aria-hidden="true"><span className="bb-dots"><i /><i /><i /></span><span className="bf-url">{url && <span className="bf-url-t mono">{url}</span>}</span></div>
    <div className="bf-body">{children}</div>
  </div>
);

// ⛶ ZOOMABLE — PmLesson2 `Zoomable` porti: proyektorda asosiy maketni kattalashtirish (Esc / fon bosilsa yopiladi).
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
// Ustun-yorlig'i (PmLesson2 .flow-label): «NIMA — NIMA QILASIZ», ≤6 so'z — ustun nimani ko'rsatishini bir qarashda aytadi.
// F-0925-B12: bo'sh yozish maydonida aniq chorlov (placeholder'siz maydon bo'sh oq quti bo'lib ko'rinardi).
const WRITE_PH = { uz: 'Shu yerga yozing…', ru: 'Напишите здесь…' };
const FlowLabel = ({ children }) => <p className="flow-label">{children}</p>;

// ===== OLX BOSH SAHIFASI SXEMASI — brendsiz (logotip o'rnida kulrang blok), faqat ko'rinadigan joylar =====
// Tanish tuzilish (o'smir OLX'ni taniydi): sarlavha-chizig'i (logotip-blok · ikonka-joylar · «E'lon berish» — to'ldirilgan,
// ko'zga tashlanadi) → eng katta qidiruv qatori (🔍 + joylashuv) → dumaloq kategoriyalar → e'lon-kartochkalar.
// OlxHead — 15-ekrandagi «OLX sotuvchilar sahifasi» ramkasida ham shu chiziq (bir sayt ekani ko'rinsin); u yerda tugmasiz.
// Material-matn (sxema ichidagi yozuvlar — proza emas): kategoriya nomlari · e'lonlar (nom + narx). Narxlar — misol-olam.
const OLX_CATS = [
  { ic: '🚲', t: { uz: 'Sport', ru: 'Спорт' } }, { ic: '📱', t: { uz: 'Telefon', ru: 'Телефоны' } }, { ic: '👕', t: { uz: 'Kiyim', ru: 'Одежда' } },
  { ic: '🏠', t: { uz: 'Uy', ru: 'Дом' } }, { ic: '🚗', t: { uz: 'Avto', ru: 'Авто' } }, { ic: '🎮', t: { uz: "O'yin", ru: 'Игры' } },
];
const OLX_ADS = [
  { ic: '🚲', t: { uz: 'Velosiped', ru: 'Велосипед' }, p: '450 000' },
  { ic: '📱', t: { uz: 'Telefon', ru: 'Телефон' }, p: '1 200 000' },
  { ic: '👟', t: { uz: 'Krossovka', ru: 'Кроссовки' }, p: '180 000' },
  { ic: '🎧', t: { uz: 'Quloqchin', ru: 'Наушники' }, p: '90 000' },
];
const SUM = { uz: "so'm", ru: 'сум' };
const OlxAd = ({ ad }) => (
  <span className="olx-ad"><i><span className="olx-ad-ic">{ad.ic}</span></i><span className="olx-ad-t">{tr(ad.t)}</span><span className="olx-ad-p mono">{ad.p} {tr(SUM)}</span></span>
);
const OlxHead = ({ children }) => (
  <div className="olx-bar">
    <span className="olx-logo" aria-hidden="true">OLX</span>
    <span className="olx-ics" aria-hidden="true"><i /><i /></span>
    {children}
  </div>
);
// marks — ixtiyoriy { k: '①' }: bosiladigan joyga raqam-belgi (10-ekran, F-0924-08) — o'ngdagi ro'yxat bilan bir raqam.
// query — ixtiyoriy: qidiruv qatoriga «yozilayotgan» so'z (hook sahnasi); yo'q bo'lsa — kulrang yo'riq-yozuv.
// ads — e'lon-kartochkalari qatori (bezak: hech bir ekranda bosilmaydi). 3-ekranda o'chiriladi — u yerda sxema faqat
// ikki odamning birinchi bosadigan joyini ko'rsatadi, qator esa xulosani ko'rinish chizig'idan pastga surardi (111-qonun).
const OlxScheme = ({ lit, seen, onPick, turn = null, walking = false, marks = null, query = null, roomy = false, ads = true }) => {
  const cls = (k) => `${lit === k ? ' lit' : ''}${seen && seen.has(k) ? ' seen' : ''}${onPick ? ' pick' : ''}${turnCls(turn, k, walking)}`;
  const btn = (k) => (onPick ? { type: 'button', onClick: () => onPick(k), 'aria-pressed': lit === k } : { type: 'button', disabled: true, tabIndex: -1 });
  const mk = (k) => (marks && marks[k] ? <span className={`olx-mk${seen && seen.has(k) ? ' on' : ''}`} aria-hidden="true">{marks[k]}</span> : null);
  return (
    <BrowserFrame className={`olx${roomy ? ' roomy' : ''}`} url="olx.uz">
      <OlxHead><button {...btn('elon')} className={`olx-elon${cls('elon')}`}>{mk('elon')}{tr(ELON)}</button></OlxHead>
      <button {...btn('qidiruv')} className={`olx-search${cls('qidiruv')}`}>
        {mk('qidiruv')}<span className="olx-s-ic" aria-hidden="true">🔍</span>
        <span className="olx-s-q" aria-hidden="true">{query ? <span className="olx-s-typed">{tr(query)}</span> : <span className="olx-s-ph">{tr({ uz: 'Nima qidiryapsiz?', ru: 'Что вы ищете?' })}</span>}</span>
        <span className="olx-s-geo" aria-hidden="true">📍 {tr({ uz: 'Toshkent', ru: 'Ташкент' })}</span>
      </button>
      <button {...btn('kategoriya')} className={`olx-cats${cls('kategoriya')}`}>
        {mk('kategoriya')}{OLX_CATS.map((c, i) => <span key={i} className="olx-cat" aria-hidden="true"><span className="olx-cat-ic">{c.ic}</span><span className="olx-cat-t">{tr(c.t)}</span></span>)}
      </button>
      {ads && <div className="olx-list" aria-hidden="true">{OLX_ADS.map((a, i) => <OlxAd key={i} ad={a} />)}</div>}
    </BrowserFrame>
  );
};

// ===== SCREEN 1 — HOOK: ovoz berish, javob hozir ochilmaydi =====
const HOOK_OPTS = [
  { uz: 'Telefoni bor har qanday odam uchun', ru: 'Для любого человека с телефоном' },
  { uz: 'Biror narsa sotadigan yoki oladiganlar uchun', ru: 'Для тех, кто что-то продаёт или покупает' },
  { uz: "Faqat o'z do'koni bor katta sotuvchilar uchun", ru: 'Только для крупных продавцов со своим магазином' },
];
const ScreenHook = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  // F-0915-02: saqlangan javob chegara ichidagi butun son bo'lsagina olinadi
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
  const isMentor = !!(live && live.mode === 'mentor');
  const pick = (i) => {
    if (picked !== null || isMentor) return;
    setPicked(i);
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: i, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 'hook', i, false, 0);
  };
  const shown = counts || null;
  const totalVotes = shown ? shown.reduce((a, b) => a + b, 0) : 0;
  // F-0924-04: bo'sh 0% jadval chiqmaydi — diagramma faqat kamida bitta ovoz kelganda
  const revealViz = isLive && shown && totalVotes > 0 && (picked !== null || isMentor);
  const topIdx = revealViz ? shown.indexOf(Math.max(...shown)) : -1;
  const optWave = useTurnHint(picked === null && !isMentor);
  // 88-qonun d (F-0925 puls-bug, B4/B6 naqshi): jonli o'quvchi mentordan orqada qolsa NavNext ochiq (freeRide) —
  // ovoz berilmaguncha u yonmaydi (turnBusy), navbat variantlar to'lqinida qoladi. Aks holda ikkalasi birga yonardi.
  return (
    <Stage eyebrow={tr({ uz: 'Kirish · ovoz berish', ru: 'Введение · голосование' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} turnBusy={picked === null && !isMentor} label={isMentor || picked !== null ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Fikringizni belgilang', ru: 'Отметьте своё мнение' })} onClick={onNext} />}>
      <div className="screen hk-screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>OLX</span> sayti kim uchun qilingan?</>, ru: <>Для кого сделан сайт <span className="italic" style={{ color: T.accent }}>OLX</span>?</> })}</h2></div>
        {/* Senariy gapi (oxirgi jumla) saqlanadi; oldida NEGA + chorlov (F-0924-03). Yo'nalish-so'zsiz: telefonda ustunlar ustma-ust tushadi. */}
        <Mentor>{tr({ uz: <>Ko'pchilik OLX'ga hech bo'lmasa bir marta kirgan — o'z tajribangizni eslab, <b style={{ color: T.ink }}>javoblardan</b> birini belgilang. Javobni birozdan keyin birga bilib olamiz.</>, ru: <>Многие хотя бы раз заходили на OLX — вспомните свой опыт и отметьте один из <b style={{ color: T.ink }}>ответов</b>. Ответ узнаем вместе чуть позже.</> })}</Mentor>
        <div className="split hk-split">
          {/* IMZO-VIZUAL (hook): OLX bosh sahifasi jonli sxemasi — qidiruvga so'z yoziladi, e'lonlar yuklanib turadi.
              Kim ekani ATAYLAB ko'rsatilmaydi (javob 3-ekranda ochiladi). Faqat ko'rinish, bosilmaydi. */}
          {/* Zoomable fade-up ichida emas (transform position:fixed ni siljitadi) — sahna faqat opacity bilan kiradi (.hk-in). */}
          {/* Tozalik (111-qonun, 2026-09-25): «odamlar oqimi» bezak-qatori va variantlar ustidagi «Fikringizni belgilang»
              yorlig'i olindi — birinchisi ma'no bermasdi (manbasiz «minglab» fikrining rasmi), ikkinchisi mentor-chorlov va
              tugma yorlig'ining uchinchi nusxasi edi (P0/PmLesson2 da bu joyda SAVOL turadi, bu yerda savol — sarlavhaning o'zi). */}
          <div className="hk-scene hk-in">
            <Zoomable><OlxScheme query={{ uz: 'velosiped', ru: 'велосипед' }} /></Zoomable>
          </div>
          <Col>
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

// ===== SCREEN 2 — MAQSAD: karta o'zi yoziladi → qatorlari sahifa bo'limlariga uchib o'tadi (imzo-vizual) =====
// Namuna — tayyor g'oya «Futbol» (READY_IDEAS[0], foydalanuvchi tasdiqlagan). 7/9-ekran javoblarini oshkor qilmaydi.
// CSS-taymlayn (--fd), reduced-motion'da darhol to'liq holat. «Karta» so'zi matnda aytilmaydi (7-ekranda nom beriladi).
const ScreenGoal = ({ screen, onNext, onPrev }) => {
  const idea = READY_IDEAS[0];
  const vals = { kim: tr(idea.kim), muammo: tr(idea.ogir), yechim: tr(idea.qiladi) };
  // Qator i: --fd da yoziladi, --fly da kartadan chiqib o'z bo'limiga «uchib» tushadi (matn ekranda bir marta qoladi).
  const page = [
    { key: 'blok', row: 'kim', txt: tr({ uz: `${cap(clean(vals.kim))} uchun`, ru: `Для вас: ${clean(vals.kim)}` }), big: true },
    // Sahifada bo'lim yolg'iz turadi — MUAMMO egasi bilan (9-ekran qolipi «{KIM} {MUAMMO}»), aks holda «Maydonga borib…» egasiz qoladi.
    { key: 'muammo', row: 'muammo', txt: tr({ uz: `${cap(clean(vals.kim))} ${clean(vals.muammo)}`, ru: `${cap(clean(vals.kim))}: ${clean(vals.muammo)}` }) },
    { key: 'qanday', row: 'yechim', txt: cap(vals.yechim) },
  ];
  const t = (i) => ({ '--fd': `${0.5 + i * 0.7}s`, '--fly': `${3.0 + i * 0.8}s`, '--rc': ROW_META[i].col });
  return (
    <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun g'oyangiz <span className="italic" style={{ color: T.accent }}>kim uchun</span> ekanini aniqlaysiz</>, ru: <>Сегодня вы определите, <span className="italic" style={{ color: T.accent }}>для кого</span> ваша идея</> })}</h2></div>
        <Mentor>{tr({ uz: <>Dars oxirida o'zingiz tanlagan g'oya kim uchun ekanini yozasiz. Keyin uning sahifasida birinchi nima turishini hal qilasiz — <b style={{ color: T.ink }}>pastdagi namunada</b> har qator sahifaga qanday o'tishiga qarang.</>, ru: <>К концу урока вы напишете, для кого идея, которую вы сами выбрали. Потом решите, что будет первым на её странице, — посмотрите <b style={{ color: T.ink }}>на примере ниже</b>, как каждая строка переходит на страницу.</> })}</Mentor>
        <div className="gl-stage fade-up delay-1">
          <div className="gl-card" aria-label={tr({ uz: 'Namuna', ru: 'Пример' })}>
            {ROW_META.map((r, i) => (
              <div key={r.key} className={`gl-row ${r.key}`} style={t(i)}>
                <span className="gl-lbl" style={{ color: r.col }}>{tr(r.lbl)}<span className="gl-ck" aria-hidden="true">✓</span></span>
                <span className="gl-txt">{vals[r.key]}</span>
              </div>
            ))}
          </div>
          <span className="gl-arrow" aria-hidden="true">➜</span>
          <BrowserFrame className="gl-page">
            {page.map((p, i) => (
              <div key={p.key} className={`gl-sec ${p.big ? 'big' : ''}`} style={t(i)}>
                <span className="gl-sec-fill">{p.txt}</span>
              </div>
            ))}
            <div className="gl-sec ghost" aria-hidden="true"><span className="gl-ghost-t">{tr({ uz: "Isbot — keyin qo'shiladi", ru: 'Доказательство — добавим позже' })}</span></div>
            <div className="gl-sec btn" aria-hidden="true"><span className="gl-btn-shape" style={{ '--fd': '5.6s' }}>{tr({ uz: 'Vaqtni band qilish', ru: 'Забронировать время' })}</span></div>
          </BrowserFrame>
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 3 — IKKI ODAM: bosib ochish (toggle, 46-qonun) — OLX sxemasida har biri birinchi bosadigan joy yonadi =====
const PEOPLE = [
  { id: 'sotuvchi', ic: '🚲', t: { uz: "Velosipedini sotmoqchi bo'lgan o'quvchi", ru: 'Ученик, который хочет продать свой велосипед' }, spot: 'elon' },
  { id: 'xaridor', ic: '📱', t: { uz: 'Arzon telefon izlayotgan o\'quvchi', ru: 'Ученик, который ищет недорогой телефон' }, spot: 'qidiruv' },
];
const ScreenTwo = ({ screen, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState(() => new Set());
  const tap = (id) => { setOpen(o => (o === id ? null : id)); setSeen(p => { const n = new Set(p); n.add(id); return n; }); };
  const all = seen.size >= PEOPLE.length;
  const pend = PEOPLE.map(p => p.id).filter(id => !seen.has(id));
  const lit = useTurnWalk(pend, !isMentor);
  const cur = PEOPLE.find(p => p.id === open);
  return (
    <Stage eyebrow={tr({ uz: '1-qism · Kim uchun', ru: 'Часть 1 · Для кого' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all && !isMentor} label={all || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Ikkala odamni bosib ko\'ring', ru: 'Нажмите на обоих людей' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>OLX'ga kirgan ikki odamning maqsadi <span className="italic" style={{ color: T.accent }}>bir xilmi</span>?</>, ru: <>У двух людей, зашедших на OLX, <span className="italic" style={{ color: T.accent }}>одна цель</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Sayt kim uchun ekanini odamning birinchi harakati ko'rsatadi — <b style={{ color: T.ink }}>ikki o'quvchi</b> kartasini birma-bir bosing.</>, ru: <>Для кого сделан сайт, видно по первому действию человека — нажмите по очереди на карточки <b style={{ color: T.ink }}>двух учеников</b>.</> })}</Mentor>
        <div className="split">
          <Col>
            <FlowLabel>{tr({ uz: "Ikki o'quvchi — bosib ko'ring", ru: 'Два ученика — нажмите' })}</FlowLabel>
            {PEOPLE.map(p => (
              <button key={p.id} type="button" className={`person ${open === p.id ? 'on' : ''} ${seen.has(p.id) ? 'seen' : ''}${turnCls(lit, p.id, pend.length > 1)}`} onClick={() => tap(p.id)} aria-pressed={open === p.id}>
                <span className="person-ic" aria-hidden="true">{p.ic}</span>
                <span className="person-t">{tr(p.t)}</span>
                {seen.has(p.id) && open !== p.id && <span className="person-ck">✓</span>}
              </button>
            ))}
          </Col>
          <Col><FlowLabel>{tr({ uz: 'OLX — birinchi bosadigan joy', ru: 'OLX — куда нажимают первым' })}</FlowLabel><OlxScheme lit={cur ? cur.spot : null} ads={false} /></Col>
        </div>
        {all && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Boshidagi savolga javob: OLX biror narsa sotadigan yoki oladiganlar uchun — biri sotadi, biri qidiradi. Saytdan foyda oladigan shunday aniq odamlar guruhi saytning <b>auditoriyasi</b> deyiladi.</>, ru: <>Ответ на первый вопрос: OLX — для тех, кто что-то продаёт или покупает. Один продаёт, другой ищет. Такая конкретная группа людей, которая получает пользу от сайта, называется <b>аудиторией</b> сайта.</> })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== CHIP-SOLISHTIRUV (F-0924-05/09) — ikki holatli ekran uchun umumiy naqsh. Manba: PmLesson2 Screen2.
// Bitta nomsiz «⇄ almashtirish» tugmasi TAQIQ: o'quvchi qaysi holatda turganini bilmaydi. O'rniga — NOMLI ikki chip.
// Sukutda 1-holat ochiq → navbat-pulsi KO'RILMAGAN chipda yuradi (88-qonun, 1-C.5 sukut-tuzog'i).
// Har holatning O'Z hukm-kartasi (Verdict); senariy xulosasi holatdan ajratilib, ikkalasi ko'rilgach alohida chiqadi —
// ekrandagi holat va o'qiladigan xulosa bir-biriga zid bo'lmaydi.
function useChipCompare(enabled = true) {
  const [v, setV] = useState(0);
  const [seen, setSeen] = useState(() => new Set([0]));
  const pend = [0, 1].filter(k => !seen.has(k));
  const lit = useTurnWalk(pend, enabled);
  const pick = (k) => { setV(k); setSeen(p => { const n = new Set(p); n.add(k); return n; }); };
  return { v, pick, seen, pend, lit, both: seen.size >= 2 };
}
const CompareChips = ({ chips, cmp }) => (
  <div className="cc-chips fade-up delay-1" role="group">
    {chips.map((c, k) => (
      <button key={k} type="button" aria-pressed={cmp.v === k} onClick={() => cmp.pick(k)}
        className={`chip ${cmp.v === k ? 'chip-on' : ''}${turnCls(cmp.lit, k, cmp.pend.length > 1)}`}>
        {cmp.seen.has(k) && cmp.v !== k ? '✓ ' : ''}{tr(c)}
      </button>
    ))}
  </div>
);
// Holat-hukmi: ok=false → frame-warn (amber), ok=true → frame-success. Yorliq + bitta sabab-gap.
// note — ixtiyoriy senariy-xulosasi: FAQAT shu holatga tegishli bo'lsa hukm-kartaning ichida turadi (F-0924-05:
// xulosa ko'rinib turgan holatga zid chiqmasin).
const Verdict = ({ ok, label, children, note }) => (
  <div className={`${ok ? 'frame-success' : 'frame-warn'} fade-step`} key={ok ? 'ok' : 'warn'}>
    <p className="small mono verdict-lbl" style={{ color: ok ? T.success : AMBER }}>{label}</p>
    <p className="body" style={{ margin: 0, color: T.ink }}>{children}</p>
    {note && <p className="body verdict-note">{note}</p>}
  </div>
);

// ===== SCREEN 4 — «HAMMA UCHUN»: chip-solishtiruv =====
const HAMMA_CHIPS = [{ uz: '1 · Hamma uchun', ru: '1 · Для всех' }, { uz: '2 · Sotuvchi uchun', ru: '2 · Для продавца' }];
const HEADS = [
  { uz: 'Bizda hamma narsa bor!', ru: 'У нас есть всё!' },
  SELLER_HEAD,
];
// Tozalik (111-qonun, 2026-09-25): sarlavha ostidagi material-qator olindi — ekran SARLAVHANI solishtiradi (mentor, tugma
// yorlig'i va hukm «gap» deb aynan sarlavhani aytadi); ikkinchi gap solishtiriladigan narsani ikkiga bo'lardi.
const HAMMA_XULOSA = { uz: "Hammaga yozilgan gapda hech kim o'zini tanimaydi.", ru: 'В словах «для всех» никто не узнаёт себя.' };
const ScreenHamma = ({ screen, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const cmp = useChipCompare(!isMentor);
  const { v, both } = cmp;
  return (
    <Stage eyebrow={tr({ uz: '1-qism · Kim uchun', ru: 'Часть 1 · Для кого' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!both} disabled={!both && !isMentor} label={both || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Ikkala sarlavhani ko'ring", ru: 'Посмотрите оба заголовка' })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>«Hamma uchun» yozilgan sahifa sotuvchiga <span className="italic" style={{ color: T.accent }}>tushunarlimi</span>?</>, ru: <>Понятна ли продавцу страница, написанная <span className="italic" style={{ color: T.accent }}>«для всех»</span>?</> })}</h2></div>
        {/* 1-holat sukutda ochiq — puls ko'rilmagan 2-chipda, gap ham o'sha chipni aytadi (3-D.2) */}
        <Mentor>{tr({ uz: <>Sotuvchi sarlavhani o'qib, sahifa unga kerakmi-yo'qmi hal qiladi — <b style={{ color: T.ink }}>«2 · Sotuvchi uchun»</b>ni ham bosing.</>, ru: <>Прочитав заголовок, продавец решает, нужна ли ему эта страница, — нажмите и на <b style={{ color: T.ink }}>«2 · Для продавца»</b>.</> })}</Mentor>
        <div className="split">
          <Col>
            <FlowLabel>{tr({ uz: "Sarlavha — ikkalasini bosing", ru: 'Заголовок — нажмите оба' })}</FlowLabel>
            <CompareChips chips={HAMMA_CHIPS} cmp={cmp} />
            <BrowserFrame className="hm-page">
              <div className="hm-head fade-step" key={v}>{tr(HEADS[v])}</div>
              <div className="hm-cta" aria-hidden="true"><span className={`orow-btn${v === 0 ? ' dim' : ''}`}>{tr(v === 0 ? { uz: 'Batafsil', ru: 'Подробнее' } : ELON)}</span></div>
            </BrowserFrame>
          </Col>
          <Col>
            {/* F-0925-QA05/06: chapdagi tugmalar qatorining ko'rinmas nusxasi TEPADA, yorliq esa kartaning o'zi ustida (foydalanuvchi chizmasi) —
                karta sahifa-oyna bilan bir chiziqda qoladi: chapda «yorliq + tugmalar», o'ngda «tugmalar + yorliq» — balandlik bir xil */}
            <div className="cc-ghost" aria-hidden="true"><CompareChips chips={HAMMA_CHIPS} cmp={{ ...cmp, lit: null, pend: [] }} /></div>
            <FlowLabel>{tr({ uz: "Sahifani o'qiyotgan odam", ru: 'Страницу читает' })}</FlowLabel>
            <div className={`person big ${v === 1 ? 'me' : 'dim'}`} aria-live="polite">
              <span className="person-ic" aria-hidden="true">🚲</span>
              <span className="person-t">{tr(PEOPLE[0].t)}</span>
              {v === 1 ? <span className="me-bub fade-step" key="me">{tr({ uz: 'bu men!', ru: 'это я!' })}</span> : <span className="me-bub shrug fade-step" key="sh" aria-hidden="true">🤷</span>}
            </div>
            {/* Hukm: yorliq + bitta sabab (metodist, F-0924-05). note — senariy xulosasi so'zma-so'z. */}
            {v === 0
              ? <Verdict ok={false} label={tr({ uz: "Sotuvchi o'zini tanimadi", ru: 'Продавец не узнал себя' })}
                  note={!both ? tr(HAMMA_XULOSA) : null}>{tr({ uz: "So'zlari tushunarli, lekin gap sotuvchi haqida emas.", ru: 'Слова понятны, но фраза не о продавце.' })}</Verdict>
              : <Verdict ok label={tr({ uz: 'Sotuvchi: «bu men!»', ru: 'Продавец: «это я!»' })}>{tr({ uz: "Gapda uning o'z ishi yozilgan: narsasini uydan chiqmay sotish.", ru: 'Во фразе — его собственное дело: продать вещь, не выходя из дома.' })}</Verdict>}
          </Col>
        </div>
        {/* Senariy xulosasi (so'zma-so'z): ikkala holat ko'rilguncha — 1-holat hukm-kartasining izohi; ikkalasi ko'rilgach —
            holatdan TASHQARIDA, alohida «Xulosa» qatori (qaysi chip tanlangan bo'lsa ham ko'rinadi). Xulosa — «hamma uchun»
            gap haqida umumiy qoida, 2-holat esa uning aksi: «bu men!» yonida turib unga zid emas, uni tasdiqlaydi (12-ekran naqshi). */}
        {both && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink, fontWeight: 600 }}>{tr(HAMMA_XULOSA)}</p></div>}
      </div>
    </Stage>
  );
};

// ===== TEST-SAVOL (F-0924-06) — PmLesson2 savol-qolipi (Screen4): BITTA h-ask sarlavha. F-0925-QA03: «To'g'ri javobni tanlang»
// ko'zcha-yorlig'i va «⚡ Jonli dars — bitta urinish» qatori olib tashlandi (foydalanuvchi: UI'ni bekorga egallaydi).
// Lead (senariy matni) — oddiy qator, serif-karta EMAS: ikki sarlavha raqobatlashmaydi.
const TestQ = ({ lead, ask }) => (
  <div className="tq">
    {lead && <p className="tq-lead">{lead}</p>}
    <h2 className="title h-ask">{ask}</h2>
  </div>
);
// Test-izohlari senariyda yo'q — ekranlardagi xulosa-gaplardan yig'ildi; har noto'g'ri variantga alohida izoh (metodist, 2026-09-24).
const ScreenT1 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 1', ru: 'Проверка · 1' })} scope="module-mikro"
    question={<TestQ lead={tr({ uz: 'Sahifa tepasida faqat «Bizda hamma narsa bor!» deb yozilgan.', ru: 'Вверху страницы написано только «У нас есть всё!».' })} ask={tr({ uz: 'Nega bunday sahifa kam odamni qiziqtiradi?', ru: 'Почему такая страница мало кого заинтересует?' })} />}
    questionText={tr({ uz: '«Hamma uchun» sahifa', ru: 'Страница «для всех»' })}
    options={[
      tr({ uz: 'Uni qurish oddiy sahifadan ancha qimmatga tushadi', ru: 'Её создание обходится намного дороже обычной страницы' }),
      tr({ uz: 'Unda sahifalar oddiy saytdan sekinroq ochiladi', ru: 'Страницы на ней открываются медленнее, чем на обычном сайте' }),
      tr({ uz: 'Uni o\'qigan odam «bu aynan men uchun» demaydi', ru: 'Прочитавший её не скажет: «это именно для меня»' }),
      tr({ uz: 'Uni reklamasiz internetda hech kim topolmaydi', ru: 'Без рекламы её в интернете никто не найдёт' }),
    ]}
    correctIdx={INLINE_KEYS.s5}
    explainCorrect={tr({ uz: "To'g'ri — hammaga yozilgan gapda hech kim o'zini tanimaydi. Shuning uchun odam «bu aynan men uchun» demaydi.", ru: 'Верно — в словах «для всех» никто не узнаёт себя. Поэтому человек не скажет: «это именно для меня».' })}
    explainWrong={{
      // Har noto'g'ri variantga alohida izoh (F-0924-06, spec 9.4): avval variantning to'g'ri jihati, keyin yo'naltirish.
      0: tr({ uz: "Narx ham muhim, lekin sarlavhadagi bitta gap sahifani qimmat qilmaydi. Uni o'qigan odam sahifa o'zi uchun ekanini sezadimi?", ru: 'Цена тоже важна, но одна фраза в заголовке не делает страницу дороже. Почувствует ли читатель, что страница для него?' }),
      1: tr({ uz: "Tezlik haqiqatan muhim, lekin u sarlavhadagi so'zlarga bog'liq emas. Shu sarlavhani o'qigan odam unda o'zini ko'radimi?", ru: 'Скорость действительно важна, но она не зависит от слов в заголовке. Видит ли себя в этом заголовке тот, кто его читает?' }),
      3: tr({ uz: "Reklama odamlarni sahifaga olib keladi — bu to'g'ri. Lekin kelgan odam «Bizda hamma narsa bor!»ni o'qib, o'zini taniydimi?", ru: 'Реклама приводит людей на страницу — это верно. Но узнаёт ли себя пришедший, прочитав «У нас есть всё!»?' }),
      default: tr({ uz: "Gap narxda, tezlikda yoki reklamada emas. Sahifani o'qigan odam unda o'zini taniydimi — shuni o'ylang.", ru: 'Дело не в цене, скорости или рекламе. Подумайте: узнаёт ли себя человек, прочитавший страницу?' }) }}
  />
);

// ===== SCREEN 6 — KEYS: Facebook — bashorat + 3 slayd (faqat bank-faktlari: 2004 · bitta universitet · ikki yildan keyin hamma uchun) =====
const FB_PREDICT = {
  chips: [
    { ic: '🌍', t: { uz: 'Butun dunyodagi odamlar uchun', ru: 'Для людей всего мира' } },
    { ic: '🗺️', t: { uz: 'Bitta mamlakat aholisi uchun', ru: 'Для жителей одной страны' } },
    { ic: '🎓', t: { uz: 'Bitta universitet talabalari uchun', ru: 'Для студентов одного университета' } },
  ],
  ans: 2,
};
// ===== KEYS-RASM (F-0924-07) — PmLesson1:1078-1098 dan. Rasm faqat loyiha media-kutubxonasidan; yuklanmasa emoji
// qoladi, dars to'xtamaydi (155/156-qonun). Garvard — chizib bo'lmaydigan real joy, shuning uchun maket emas, FOTO.
// Rasm bashoratdan KEYIN chiqadi (slaydlar bet tanlangach ochiladi) — javobni oldindan aytmaydi (§186).
const PHOTO_SET = {
  garvard: {
    img: 'https://go.coddycamp.uz/uploads/media_library/801be58d0e9f80878c76c1265e1adcf2.jpg',
    emoji: '🎓',
    bg: 'linear-gradient(160deg,#f0e3d0,#fbf6ee)',
    alt: { uz: 'Garvard universiteti binosi', ru: 'Здание Гарвардского университета' },
    cap: { uz: "Garvard universiteti: Facebook'ning birinchi foydalanuvchilari shu yerda o'qigan", ru: 'Гарвардский университет: здесь учились первые пользователи Facebook' },
  },
};
const Photo = ({ kind }) => {
  const sc = PHOTO_SET[kind];
  const [failed, setFailed] = useState(false);
  if (!sc) return null;
  if (sc.img && !failed) {
    return (
      <figure className="k-fig">
        <span className="k-photo" style={{ background: sc.bg }}><img src={sc.img} alt={tr(sc.alt)} onError={() => setFailed(true)} /></span>
        {sc.cap && <figcaption className="k-cap">{tr(sc.cap)}</figcaption>}
      </figure>
    );
  }
  // Emoji-rejim ham .k-fig ichida turadi — .k-slide.ph gridida rasm ustuniga tushadi (B2 naqshi; yolg'iz belgi matn ustuniga tushardi).
  return (
    <figure className="k-fig">
      <span className="k-photo emo" style={{ background: sc.bg }} role="img" aria-label={tr(sc.alt)}><span className="k-slide-ic">{sc.emoji}</span></span>
      {sc.cap && <figcaption className="k-cap">{tr(sc.cap)}</figcaption>}
    </figure>
  );
};
const FB_SLIDES = [
  { ic: '🎓', photo: 'garvard', h: { uz: '2004 — bitta universitet', ru: '2004 — один университет' }, body: { uz: 'Facebook ochilganda faqat bitta universitet talabalari uchun edi.', ru: 'Когда Facebook открылся, он был только для студентов одного университета.' } },
  { ic: '🏫', h: { uz: 'Keyin — boshqa universitetlar', ru: 'Потом — другие университеты' }, body: { uz: "So'ng boshqa universitetlar talabalari ham qo'shildi.", ru: 'Потом присоединились студенты других университетов.' } },
  { ic: '🌍', h: { uz: 'Ikki yildan keyin — hamma uchun', ru: 'Через два года — для всех' }, body: { uz: 'Ikki yildan keyin Facebook hamma uchun ochildi.', ru: 'Через два года Facebook открылся для всех.' } },
];
const ScreenCase = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const [bet, setBet] = useState(() => { const v = storedAnswer?.bet; return Number.isInteger(v) && v >= 0 && v < FB_PREDICT.chips.length ? v : null; }); // F-0915-02
  const [i, setI] = useState(0);
  const last = i === FB_SLIDES.length - 1;
  const betPending = bet === null;
  useEffect(() => { if (last && !betPending && storedAnswer === undefined) onAnswer(screen, { correct: true, bet }); }, [last, betPending]); // eslint-disable-line
  const betHint = useTurnHint(betPending);
  // Navbat-zanjiri: taxmin → slayd ichidagi «Keyingisi →» → (oxirida) NavNext. Slayd o'z boshqaruvi bilan (PmLesson1 k-nav).
  const nextTurn = useTurnHint(!betPending && !last && !isMentor);
  const c = FB_SLIDES[i];
  const navLabel = isMentor || (!betPending && last) ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : betPending ? tr({ uz: 'Avval taxminingizni tanlang', ru: 'Сначала выберите свою догадку' })
    : tr({ uz: 'Avval voqeani oxirigacha oching', ru: 'Сначала откройте историю до конца' });
  return (
    <Stage eyebrow={tr({ uz: 'Haqiqiy voqea · Facebook', ru: 'Реальная история · Facebook' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={betPending || !last} disabled={(betPending || !last) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>Facebook</span> 2004-yilda ochilganda kimlar uchun edi?</>, ru: <>Для кого был <span className="italic" style={{ color: T.accent }}>Facebook</span>, когда открылся в 2004 году?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Mashhur sayt qanday boshlangani yangi g'oya uchun ham saboq — avval <b style={{ color: T.ink }}>«Taxmin o'yini»</b>da bitta javobni belgilang.</>, ru: <>История известного сайта — урок и для новой идеи: сначала отметьте один ответ в <b style={{ color: T.ink }}>«Игре в догадки»</b>.</> })}</Mentor>
        <div className={`kp-bet fade-up delay-1${bet !== null ? ' done' : ''}`}>
          <span className="k-slide-eyebrow">{tr({ uz: "🎲 Taxmin o'yini · ball yo'q", ru: '🎲 Игра в догадки · без баллов' })}</span>
          <div className="kp-chips">
            {FB_PREDICT.chips.map((ch, k) => {
              const locked = bet !== null;
              const isAns = k === FB_PREDICT.ans;
              let cls = 'kp-chip';
              if (locked) { cls += ' locked'; if (isAns) cls += ' correct'; else if (bet === k && !isMentor) cls += ' wrong'; }
              else cls += waveCls(betHint, k, FB_PREDICT.chips.length);
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
            : !isMentor && <p className={`kp-res ${bet === FB_PREDICT.ans ? 'hit' : 'miss'}`}>{bet === FB_PREDICT.ans ? tr({ uz: '🎯 Topdingiz!', ru: '🎯 Угадали!' }) : tr({ uz: <>Adashdingiz — asl javob «{tr(FB_PREDICT.chips[FB_PREDICT.ans].t)}».</>, ru: <>Не угадали — верный ответ «{tr(FB_PREDICT.chips[FB_PREDICT.ans].t)}».</> })}</p>}
        </div>
        {bet !== null && (
          <>
            <div className="k-slide ph fade-step revealed" key={i}>
              <span className="k-slide-eyebrow">{i + 1} / {FB_SLIDES.length}</span>
              {c.photo ? <Photo kind={c.photo} /> : <div className="k-fig"><div className="k-slide-ic">{c.ic}</div></div>}
              <h3 className="k-slide-h">{tr(c.h)}</h3>
              <p className="k-slide-body">{tr(c.body)}</p>
              <div className="k-nav">
                <button type="button" className="btn-soft k-prev" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущий' })}</button>
                <div className="k-dots">{FB_SLIDES.map((_, k) => <button key={k} type="button" className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-bosqich`, ru: `Шаг ${k + 1}` })} />)}</div>
                {!last && <button type="button" className={`k-next${nextTurn ? ' turn-ring' : ''}`} onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Следующий →' })}</button>}
              </div>
            </div>
          </>
        )}
        {bet !== null && last && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.accent, fontWeight: 600 }}>{tr({ uz: 'Eng katta ijtimoiy tarmoq ham avval bitta aniq guruh uchun ochilgan. Yangi g\'oya ham shunday boshlanadi.', ru: 'Даже самая большая соцсеть сначала открылась для одной конкретной группы. Новая идея начинается так же.' })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — KARTANI YIG'ING: uch qadam, har birida 3 variant; noto'g'risi sababini aytib qaytadi =====
// 🟡 Senariyda har qadamga ✓ va bitta ✕ berilgan; 3-variant va ✕-sabablari 3/10-ekran xulosalaridan yig'ildi (🎓 Metodist tasdiqlaydi).
// 🏅 Card Builder! — 151-naqsh: birinchi urinishda uchala qadam to'g'ri bo'lsa (xato tanlov → miss).
const KARTA_STEPS = [
  { key: 'kim', opts: [
    { t: { uz: 'Internetga kiradigan hamma odamlar', ru: 'Все люди, которые заходят в интернет' }, why: { uz: '«Hamma» — bu hali auditoriya emas. Kim, qaysi vaziyatda?', ru: '«Все» — это ещё не аудитория. Кто, в какой ситуации?' } },
    { t: SELLER.kim, ok: true },
    { t: { uz: 'Arzon telefon izlayotgan o\'quvchi', ru: 'Ученик, который ищет недорогой телефон' }, why: { uz: 'Bu xaridor — u sotmaydi, qidiradi.', ru: 'Это покупатель — он не продаёт, а ищет.' } },
  ] },
  { key: 'muammo', opts: [
    { t: { uz: "Saytning ko'rinishi unga zerikarli tuyuladi", ru: 'Вид сайта кажется ему скучным' }, why: { uz: "Bu saytning ko'rinishi haqida — sotuvchining muammosi emas.", ru: 'Это про вид сайта, а не проблема продавца.' } },
    { t: { uz: 'Kerakli narsani arzon narxda topa olmaydi', ru: 'Не может найти нужную вещь по низкой цене' }, why: { uz: 'Bu xaridorning muammosi, sotuvchiniki emas.', ru: 'Это проблема покупателя, а не продавца.' } },
    { t: SELLER.muammo, ok: true },
  ] },
  { key: 'yechim', opts: [
    { t: SELLER.yechim, ok: true },
    { t: { uz: "Sahifani chiroyli va rangli qilib ko'rsatadi", ru: 'Делает страницу красивой и яркой' }, why: { uz: 'Chiroyli ko\'rinish sotuvchini bozordan qutqarmaydi.', ru: 'Красивый вид не избавит продавца от рынка.' } },
    { t: { uz: 'Xaridorga sahifa tepasida katta qidiruv qatorini beradi', ru: 'Даёт покупателю большую строку поиска вверху страницы' }, why: { uz: "Qidiruv — xaridor uchun. Sotuvchi e'lon beradi.", ru: 'Поиск — для покупателя. Продавец даёт объявление.' } },
  ] },
];
const ScreenKarta = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const am = useContext(AchMissCtx);
  const [step, setStep] = useState(storedAnswer?.solved ? 3 : 0);
  const [wrong, setWrong] = useState(null); // { step, idx }
  const done = step >= 3;
  const choose = (k) => {
    if (done) return;
    const o = KARTA_STEPS[step].opts[k];
    if (o.ok) {
      setWrong(null);
      const n = step + 1;
      setStep(n);
      if (n >= 3 && !(storedAnswer && storedAnswer.solved)) { onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'karta', solved: true, correct: true, picked: true }); sendPractice(live, screen); }
    } else {
      setWrong({ step, idx: k });
      if (am && am.miss) am.miss(screen);
    }
  };
  const optHint = useTurnHint(!done && !isMentor);
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : [tr({ uz: '① KIM ni tanlang', ru: '① Выберите КТО' }), tr({ uz: '② MUAMMO ni tanlang', ru: '② Выберите ПРОБЛЕМУ' }), tr({ uz: '③ YECHIM ni tanlang', ru: '③ Выберите РЕШЕНИЕ' })][step];
  const cur = !done ? KARTA_STEPS[step] : null;
  return (
    <Stage eyebrow={tr({ uz: '1-qism · Kim uchun', ru: 'Часть 1 · Для кого' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} turnBusy={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>OLX sotuvchisi haqida <span className="italic" style={{ color: T.accent }}>uch savolga</span> javob bera olasizmi?</>, ru: <>Сможете ответить на <span className="italic" style={{ color: T.accent }}>три вопроса</span> о продавце на OLX?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Sotuvchi haqida uch savolga aniq javob bo'lsa, uning sahifasiga nima yozishni bilasiz — <b style={{ color: T.ink }}>«1 · KIM»</b>dan boshlab har savolga bitta javob tanlang.</>, ru: <>Когда есть точные ответы на три вопроса о продавце, вы знаете, что писать на его странице, — начиная с <b style={{ color: T.ink }}>«1 · КТО»</b>, выберите по одному ответу на каждый вопрос.</> })}</Mentor>
        <div className="split">
          <Col>
            {cur ? (
              <div className="kq fade-step" key={step}>
                <span className="kq-step" style={{ color: ROW_META[step].col }}>{step + 1} · {tr(ROW_META[step].lbl)}</span>
                {cur.opts.map((o, k) => {
                  const isW = wrong && wrong.step === step && wrong.idx === k;
                  return (
                    <button key={k} type="button" className={`option kq-opt${isW ? ' option-picked-wrong' : ''}${optHint && !isW ? ` turn-ring turn-wave w${k + 1}` : ''}`} onClick={() => choose(k)}>
                      <span className="opt-abc">{String.fromCharCode(65 + k)}</span><span style={{ flex: 1 }}>{tr(o.t)}</span>
                    </button>
                  );
                })}
                {wrong && wrong.step === step && <p className="kq-why fade-step">{tr(cur.opts[wrong.idx].why)}</p>}
                <AchRule screen={screen} />
              </div>
            ) : (
              <>
              {/* F-0925-QA05: o'ngdagi ustun-yorlig'ining ko'rinmas nusxasi — xulosa karta bilan bir chiziqdan boshlanadi */}
              <p className="flow-label cc-ghost" aria-hidden="true">·</p>
              <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Uch javob bitta yozuvga yig'ildi — shu yozuv <b>auditoriya-karta</b> deyiladi.</>, ru: <>Три ответа собрались в одну запись — такая запись называется <b>карточкой аудитории</b>.</> })}</p></div>
              </>
            )}
          </Col>
          <Col>
            <FlowLabel>{tr({ uz: "Sotuvchi kartasi — o'zi to'ladi", ru: 'Карточка продавца — заполняется сама' })}</FlowLabel>
            <div className="acard">
              {ROW_META.map((r, i) => (
                <div key={r.key} className={`acard-row ${i < step ? 'on' : ''} ${i === step && !done ? 'cur' : ''}`}>
                  <span className="acard-lbl" style={{ color: r.col }}>{tr(r.lbl)}</span>
                  <span className="acard-txt">{i < step ? tr(SELLER[r.key]) : '…'}</span>
                </div>
              ))}
            </div>
          </Col>
        </div>
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: "🃏 Kartani yig'ganlar", ru: '🃏 Кто собрал карточку' })} />
        <MentorNote>{tr(MENTOR_FREE)}</MentorNote>
      </div>
    </Stage>
  );
};

const ScreenT2 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 2', ru: 'Проверка · 2' })} scope="module-mikro"
    question={<TestQ ask={tr({ uz: 'Qaysi g\'oyada KIM, MUAMMO va YECHIM — uchalasi ham bor?', ru: 'В какой идее есть все три части — КТО, ПРОБЛЕМА и РЕШЕНИЕ?' })} />}
    questionText={tr({ uz: 'Uch bo\'lakli g\'oya', ru: 'Идея из трёх частей' })}
    options={[
      tr({ uz: 'Sportni yaxshi ko\'radigan o\'quvchilar uchun chiroyli va zamonaviy sayt', ru: 'Красивый и современный сайт для школьников, которые любят спорт' }),
      tr({ uz: "Avtobus qachon kelishini bilmagan o'quvchiga avtobusni xaritada ko'rsatadigan sayt", ru: 'Сайт, который показывает на карте автобус школьнику, не знающему, когда автобус придёт' }),
      tr({ uz: 'Maktab o\'quvchilari uchun kerakli hamma narsa bir joyda turgan sayt', ru: 'Сайт, где в одном месте собрано всё нужное для школьников' }),
      tr({ uz: 'Oshxonaga onlayn buyurtma berish mumkin bo\'lgan qulay va juda tez ishlaydigan sayt', ru: 'Удобный и очень быстрый сайт, где можно онлайн заказать в столовой' }),
    ]}
    correctIdx={INLINE_KEYS.s8}
    explainCorrect={tr({ uz: "To'g'ri — uchalasi bor: KIM — o'quvchi, MUAMMO — avtobus qachon kelishini bilmaydi, YECHIM — avtobusni xaritada ko'rsatadi.", ru: 'Верно — есть все три: КТО — школьник, ПРОБЛЕМА — не знает, когда придёт автобус, РЕШЕНИЕ — показывает его на карте.' })}
    explainWrong={{
      // Har noto'g'ri variantga alohida izoh (F-0924-06, spec 9.4): qaysi bo'lak bor — tan olinadi, qaysi biri yo'q — ko'rsatiladi.
      0: tr({ uz: "KIM bor — sportni yaxshi ko'radigan o'quvchilar. Lekin ularga nima qiyinligi va sayt aynan nima qilishi aytilmagan.", ru: 'КТО есть — школьники, которые любят спорт. Но не сказано, что им трудно и что именно делает сайт.' }),
      2: tr({ uz: "KIM bor, lekin «maktab o'quvchilari» — juda keng guruh. «Kerakli hamma narsa» ham aniq YECHIM emas, MUAMMO esa umuman yo'q.", ru: 'КТО есть, но «школьники» — слишком широкая группа. «Всё нужное» — тоже не точное РЕШЕНИЕ, а ПРОБЛЕМЫ нет совсем.' }),
      3: tr({ uz: 'YECHIM bor — onlayn buyurtma. Lekin kim uchun va unga nima qiyin ekani aytilmagan.', ru: 'РЕШЕНИЕ есть — онлайн-заказ. Но не сказано, для кого он и что этому человеку трудно.' }),
      default: tr({ uz: "Bu g'oyada MUAMMO yo'q: odamga nima qiyin ekani aytilmagan.", ru: 'В этой идее нет ПРОБЛЕМЫ: не сказано, что человеку трудно.' }),
    }}
  />
);

// ===== SCREEN 9 — O'Z G'OYANGIZ (ustaxona): KIM → MUAMMO → YECHIM navbat bilan; karta bridgeCard'ga saqlanadi =====
// 🏅 My Audience! — mehnat nishoni (152-qonun 5-band): erkin yozma ish, AchRule yo'q.
// KIM «hamma/barcha» tekshiruvi SO'Z darajasida (24.09): B4 (BridgeKimUchunMuammo, kimHamma) bilan AYNAN bir mantiq —
// shu karta B4'da qayta tekshiriladi. Butun so'z (kelishik qo'shimchasi bilan); «hammadan kech keladigan», «hammom»,
// ruscha «vsegda»/«vselennaya» — ushlanmaydi; inkor («hamma emas», ruscha «ne vse») — ushlanmaydi.
const HAMMA_RE = {
  uz: /^(?:hamma|barcha)(?:ga|ni|si|sini|siga|ning|miz|mizga|ngiz|lari)?$/,
  ru: /^(?:все|всех|всем|всеми)$/,
};
const kimWords = (s) => ((s || '').trim().toLowerCase().replace(/[\u02bb\u02bc\u2018\u2019\u0060\u00b4]/g, "'")
  .match(/[a-z']+|[\u0430-\u044f\u0451\u045e\u049b\u0493\u04b3]+/g) || []).map(w => w.replace(/^'+|'+$/g, '')).filter(Boolean);
const kimHamma = (s) => {
  const w = kimWords(s);
  return w.some((x, i) => (HAMMA_RE.uz.test(x) && w[i + 1] !== 'emas') || (HAMMA_RE.ru.test(x) && w[i - 1] !== '\u043d\u0435'));
};
const GOYA_PH = {
  kim: { uz: 'avtobus kutadigan o\'quvchilar', ru: 'школьники, которые ждут автобус' },
  muammo: { uz: 'avtobus qachon kelishini bilmaydi', ru: 'не знают, когда придёт автобус' },
  yechim: { uz: 'avtobus qayerdaligini xaritada ko\'rsatadi', ru: 'показывает на карте, где сейчас автобус' },
};
const ScreenGoya = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [st, setSt] = useState(() => {
    const c = cardSafe();
    const has = filled(c.kim) && filled(c.ogir) && filled(c.qiladi);
    return { kim: c.kim || '', muammo: c.ogir || '', yechim: c.qiladi || '', ideaId: c.ideaId || null, saved: has, done: has || !!(storedAnswer && storedAnswer.solved), ideas: false };
  });
  const { kim, muammo, yechim, ideaId, saved, done, ideas } = st;
  const hamma = kimHamma(kim);
  const ok = { kim: filled(kim) && !hamma, muammo: filled(muammo), yechim: filled(yechim) };
  const canSave = ok.kim && ok.muammo && ok.yechim;
  const set = (patch) => setSt(p => ({ ...p, ...patch, saved: false }));
  const pickIdea = (it) => setSt(p => ({ ...p, kim: tr(it.kim), muammo: tr(it.ogir), yechim: tr(it.qiladi), ideaId: it.id, saved: false, ideas: false }));
  const save = () => {
    if (!canSave) return;
    cardWrite({ kim: kim.trim(), ogir: muammo.trim(), qiladi: yechim.trim(), ideaId: ideaId || undefined });
    if (!done) { onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'goya', solved: true, correct: true, picked: true }); sendPractice(live, screen); }
    setSt(p => ({ ...p, saved: true, done: true }));
  };
  // Qayta yuklanganda (karta bor, lekin javob yuborilmagan) — bir marta yuboriladi (P0 F-0726-01 naqshi)
  useEffect(() => { if (done && storedAnswer === undefined && saved) { onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'goya', solved: true, correct: true, picked: true }); sendPractice(live, screen); } }, []); // eslint-disable-line
  const showM = ok.kim || filled(muammo);
  const showY = (showM && ok.muammo) || filled(yechim);
  const [focus, setFocus] = useState(false);
  const pend = ['kim', 'muammo', 'yechim'].filter(k => !ok[k] && (k === 'kim' || (k === 'muammo' && showM) || (k === 'yechim' && showY)));
  const litF = useTurnWalk(pend, !focus && !saved && !isMentor);
  const saveTurn = useTurnHint(canSave && !saved && !isMentor);
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : !ok.kim ? (hamma ? tr({ uz: '① KIM ni aniqlashtiring', ru: '① Уточните КТО' }) : tr({ uz: '① KIM ni yozing', ru: '① Напишите КТО' }))
    : !ok.muammo ? tr({ uz: '② MUAMMO ni yozing', ru: '② Напишите ПРОБЛЕМУ' })
    : !ok.yechim ? tr({ uz: '③ YECHIM ni yozing', ru: '③ Напишите РЕШЕНИЕ' })
    : tr({ uz: 'Kartani saqlang', ru: 'Сохраните карточку' });
  const field = (k, i) => (
    <label key={k} className={`bfield ${ok[k] ? 'on' : ''}${turnCls(litF, k, pend.length > 1)}`}>
      <span className="bfield-lbl" style={{ color: ROW_META[i].col }}>{ok[k] ? '✓ ' : ''}{tr(ROW_META[i].lbl)}</span>
      <input value={st[k]} onChange={e => set({ [k]: e.target.value })} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={tr(GOYA_PH[k])} maxLength={120} />
    </label>
  );
  const slot = (v, k, up) => <b className={`gs-slot ${k} ${filled(v) ? 'on' : ''}`}>{filled(v) ? (up ? cap(clean(v)) : clean(v)) : '…'}</b>;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · o\'z g\'oyangiz ✍️', ru: 'Практика · ваша идея ✍️' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!saved && !isMentor} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qaysi g'oya ustida ishlaysiz — u <span className="italic" style={{ color: T.accent }}>kim uchun</span>?</>, ru: <>Над какой идеей вы работаете — <span className="italic" style={{ color: T.accent }}>для кого</span> она?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Aniq odam topilsa, uning muammosi ham ko'rinadi — <b style={{ color: T.ink }}>«KIM»</b> savoliga javob yozing yoki <b style={{ color: T.ink }}>«Tayyor g'oyadan tanlash»</b>ni bosing.</>, ru: <>Когда найден конкретный человек, видна и его проблема, — напишите ответ на вопрос <b style={{ color: T.ink }}>«КТО»</b> или нажмите <b style={{ color: T.ink }}>«Выбрать готовую идею»</b>.</> })}</Mentor>
        <div className="split">
          <Col>
            {field('kim', 0)}
            {hamma && <p className="swed-hint fade-step">💡 {tr({ uz: '«Hamma» — bu hali auditoriya emas. Kim, qaysi vaziyatda?', ru: '«Все» — это ещё не аудитория. Кто, в какой ситуации?' })}</p>}
            {showM && field('muammo', 1)}
            {showY && field('yechim', 2)}
            <div className="swed-btns">
              <button type="button" className="btn-soft" onClick={() => setSt(p => ({ ...p, ideas: !p.ideas }))} aria-expanded={ideas}>💡 {tr({ uz: 'Tayyor g\'oyadan tanlash', ru: 'Выбрать готовую идею' })} {ideas ? '▴' : '▾'}</button>
              <button type="button" className={`swed-save${saveTurn ? ' turn-ring' : ''}`} disabled={!canSave || saved} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
            </div>
            {ideas && (
              <div className="ideas fade-step">
                {READY_IDEAS.map(it => (
                  <button key={it.id} type="button" className={`idea ${ideaId === it.id ? 'on' : ''}`} onClick={() => pickIdea(it)}>
                    <b>{tr(it.olam)}</b><span>{tr(it.kim)}</span>
                  </button>
                ))}
              </div>
            )}
          </Col>
          <Col>
            <FlowLabel>{tr({ uz: "Gapingiz — o'zi yig'iladi", ru: 'Ваша фраза — собирается сама' })}</FlowLabel>
            <div className="gsent">
              <p className="gsent-p">{tr({
                uz: <>{slot(kim, 'kim', true)} {slot(muammo, 'muammo')}. Mening saytim {slot(yechim, 'yechim')}.</>,
                ru: <>{slot(kim, 'kim', true)}: {slot(muammo, 'muammo')}. Мой сайт {slot(yechim, 'yechim')}.</>,
              })}</p>
            </div>
            {saved && <div className="done-mini fade-step">✓ {tr({ uz: 'Karta saqlandi', ru: 'Карточка сохранена' })}</div>}
            <StudentPracticePulse live={live} screen={screen} />
          </Col>
        </div>
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Kartasini saqlaganlar', ru: '✍️ Кто сохранил карточку' })} />
        <MentorNote>{tr(MENTOR_FREE)}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — OLX BOSH SAHIFASI: uch joy bosiladi, har biri kim uchun ekanini ochadi =====
const OLX_SPOTS = [
  { k: 'qidiruv', lbl: { uz: 'Qidiruv qatori', ru: 'Строка поиска' }, t: { uz: 'Aniq narsa izlab kelgan xaridor uchun', ru: 'Для покупателя, который пришёл за конкретной вещью' } },
  { k: 'kategoriya', lbl: { uz: 'Kategoriyalar', ru: 'Категории' }, t: { uz: "Nima olishini hali bilmagan xaridor uchun: bo'limlarni ko'rib chiqadi", ru: 'Для покупателя, который ещё не знает, что купить: он просматривает разделы' } },
  { k: 'elon', lbl: ELON, t: { uz: "Narsasini sotmoqchi bo'lgan odam uchun", ru: 'Для человека, который хочет продать свою вещь' } },
];
const SPOT_MARKS = ['①', '②', '③'];
const OLX_MARKS = Object.fromEntries(OLX_SPOTS.map((s, i) => [s.k, SPOT_MARKS[i]]));
const ScreenOlx = ({ screen, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState(() => new Set());
  const pick = (k) => { setOpen(o => (o === k ? null : k)); setSeen(p => { const n = new Set(p); n.add(k); return n; }); };
  const all = seen.size >= OLX_SPOTS.length;
  // 🔔 88-qonun: navbat sxemadagi KO'RILMAGAN joylar bo'ylab yuradi (bir lahzada bitta). O'ng ustundagi yorliqlar ham
  // haqiqiy tugma (F-0924-08) — xuddi shu pick(); ikkala tomonda bir xil ①②③ raqam — qaysi joy qaysi yorliq ekani ko'rinadi.
  const pend = OLX_SPOTS.map(s => s.k).filter(k => !seen.has(k));
  const litW = useTurnWalk(pend, !isMentor);
  return (
    <Stage eyebrow={tr({ uz: '2-qism · Birinchi nima ko\'rinadi', ru: 'Часть 2 · Что видно первым' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all && !isMentor} label={all || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `OLX sahifasidagi uch joyni bosing (${seen.size}/3)`, ru: `Нажмите на три места на странице OLX (${seen.size}/3)` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Nega OLX bosh sahifasida «E'lon berish» <span className="italic" style={{ color: T.accent }}>ko'zga tashlanadi</span>?</>, ru: <>Почему на главной странице OLX <span className="italic" style={{ color: T.accent }}>бросается в глаза</span> «Подать объявление»?</> })}</h2></div>
        <Mentor>{tr({ uz: <>OLX sahifasidagi har bir katta joy aniq bir odamga kerak — <b style={{ color: T.ink }}>①, ② va ③</b> joylarni birma-bir bosing.</>, ru: <>Каждое крупное место на странице OLX нужно конкретному человеку — нажмите по очереди на места <b style={{ color: T.ink }}>①, ② и ③</b>.</> })}</Mentor>
        <Zoomable className="zsplit">
        <div className="split">
          <Col><FlowLabel>{tr({ uz: 'OLX bosh sahifasi — joyni bosing', ru: 'Главная OLX — нажмите на место' })}</FlowLabel><OlxScheme roomy lit={open} seen={seen} onPick={pick} turn={litW} walking={pend.length > 1} marks={OLX_MARKS} /></Col>
          <Col>
            <FlowLabel>{tr({ uz: 'Uch joy — kim uchun?', ru: 'Три места — для кого?' })}</FlowLabel>
            {OLX_SPOTS.map((s, i) => (
              <button key={s.k} type="button" onClick={() => pick(s.k)} aria-pressed={open === s.k} className={`spot ${seen.has(s.k) ? 'seen' : ''} ${open === s.k ? 'on' : ''}`}>
                <span className="spot-lbl"><span className={`spot-num${seen.has(s.k) ? ' on' : ''}`} aria-hidden="true">{SPOT_MARKS[i]}</span>{tr(s.lbl)}{seen.has(s.k) ? ' ✓' : ''}</span>
                {seen.has(s.k) && <span className="spot-t fade-step">{tr(s.t)}</span>}
              </button>
            ))}
            {all && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink, fontWeight: 600 }}>{tr({ uz: "«E'lon berish» — sotuvchining birinchi ishi. Eng ko'zga tashlanadigan joyga auditoriya birinchi qiladigan ish qo'yiladi.", ru: '«Подать объявление» — первое действие продавца. На самое заметное место ставят то, что аудитория делает первым.' })}</p></div>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

const ScreenT3 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 3', ru: 'Проверка · 3' })} scope="module-mikro"
    question={<TestQ ask={tr({ uz: "OLX'da qidiruv qatori nega sahifadagi eng katta joyni egallaydi?", ru: 'Почему на OLX строка поиска занимает самое большое место на странице?' })} />}
    questionText={tr({ uz: 'OLX qidiruv qatori', ru: 'Строка поиска OLX' })}
    options={[
      tr({ uz: "Sotuvchi e'lonini shu qidiruv qatori orqali joylaydi", ru: 'Продавец размещает объявление через эту строку поиска' }),
      tr({ uz: "Qidiruv qatori sahifani chiroyliroq ko'rsatadi", ru: 'Строка поиска делает страницу красивее' }),
      tr({ uz: 'Kategoriyalar qidiruv qatorisiz ishlay olmaydi', ru: 'Категории не могут работать без строки поиска' }),
      tr({ uz: 'Xaridor saytga kirishi bilan kerakli narsani qidiradi', ru: 'Покупатель, зайдя на сайт, сразу ищет нужную вещь' }),
    ]}
    correctIdx={INLINE_KEYS.s11}
    explainCorrect={tr({ uz: "To'g'ri — xaridor saytga narsa izlab keladi. Uning birinchi ishi — qidiruv, shuning uchun qidiruv qatori eng katta. Sotuvchining birinchi ishi uchun esa tepada «E'lon berish» tugmasi turibdi.", ru: 'Верно — покупатель приходит на сайт за вещью. Его первое действие — поиск, поэтому строка поиска самая большая. А для первого действия продавца вверху стоит кнопка «Подать объявление».' })}
    explainWrong={{
      0: tr({ uz: "Sotuvchi e'lonni alohida «E'lon berish» tugmasi orqali beradi. Qidiruv qatori kim uchun edi?", ru: 'Продавец даёт объявление через отдельную кнопку «Подать объявление». Для кого была строка поиска?' }),
      1: tr({ uz: 'Gap chiroyda emas. Saytga kirgan xaridor birinchi nima qiladi?', ru: 'Дело не в красоте. Что покупатель делает первым, зайдя на сайт?' }),
      2: tr({ uz: 'Kategoriyalar alohida joyda turadi va o\'zi ishlaydi. Saytga kirgan xaridor birinchi nima qiladi?', ru: 'Категории стоят отдельно и работают сами. Что покупатель делает первым, зайдя на сайт?' }),
      default: tr({ uz: 'Saytga kirgan xaridor birinchi nima qiladi — shuni o\'ylang.', ru: 'Подумайте: что покупатель делает первым, зайдя на сайт?' }),
    }}
  />
);

// ===== SCREEN 12 — «YANGI SAYTNI-CHI?» chip-solishtiruv (burilish nuqtasi). Namuna — «Futbol» tayyor g'oyasi =====
const NW_SLOTS = [{ t: '17:00', free: false }, { t: '18:00', free: true }, { t: '19:00', free: true }];
const NEW_CHIPS = [{ uz: '1 · Faqat qidiruv', ru: '1 · Только поиск' }, { uz: '2 · Bu nima va kim uchun', ru: '2 · Что это и для кого' }];
const ScreenNew = ({ screen, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const cmp = useChipCompare(!isMentor);
  const { v, both } = cmp;
  return (
    <Stage eyebrow={tr({ uz: '2-qism · Birinchi nima ko\'rinadi', ru: 'Часть 2 · Что видно первым' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!both} disabled={!both && !isMentor} label={both || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Ikkala variantni ko'ring", ru: 'Посмотрите оба варианта' })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>OLX'ni ko'pchilik taniydi. <span className="italic" style={{ color: T.accent }}>Yangi saytni-chi?</span></>, ru: <>OLX знают многие. <span className="italic" style={{ color: T.accent }}>А новый сайт?</span></> })}</h2></div>
        {/* 1-holat sukutda ochiq — puls ko'rilmagan 2-chipda, gap ham o'sha chipni aytadi. «Bir necha soniya» — manbasiz raqam, olindi. */}
        <Mentor>{tr({ uz: <>Birinchi kirgan odam saytda qolish-qolmasligini sahifaning yuqori qismini o'qib hal qiladi — <b style={{ color: T.ink }}>«2 · Bu nima va kim uchun»</b>ni ham bosing.</>, ru: <>Впервые зашедший решает, остаться ли на сайте, прочитав верхнюю часть страницы, — нажмите и на <b style={{ color: T.ink }}>«2 · Что это и для кого»</b>.</> })}</Mentor>
        <div className="split">
          <Col>
            <FlowLabel>{tr({ uz: "Sahifa tepasi — ikkalasini bosing", ru: 'Верх страницы — нажмите оба' })}</FlowLabel>
            <CompareChips chips={NEW_CHIPS} cmp={cmp} />
            <BrowserFrame className="nw-page">
              {v === 0
                ? <div className="nw-top fade-step" key="a"><span className="olx-search nw-s"><span className="olx-s-ic">🔍</span><span className="olx-s-q"><span className="olx-s-ph">{tr({ uz: 'Qidirish…', ru: 'Поиск…' })}</span></span></span></div>
                : <div className="nw-top fade-step" key="b"><span className="hm-head">{tr({ uz: "Futbol maydonini oldindan band qiling — hovlida o'ynaydigan o'smirlar uchun", ru: 'Бронируйте футбольное поле заранее — для подростков, играющих во дворе' })}</span></div>}
              {/* 1-holatda pastdagi kartochkalar nomsiz (kirgan odam ular nima ekanini bilmaydi); 2-holatda — maydonning bo'sh/band vaqtlari. */}
              {v === 0
                ? <div className="olx-list nw-list" aria-hidden="true">{[0, 1].map(i => <span key={i} className="olx-ad sk"><i /><b /><b className="s" /></span>)}</div>
                : <div className="nw-slots fade-step" aria-hidden="true">{NW_SLOTS.map((sl, i) => <span key={i} className={`nw-slot${sl.free ? ' free' : ''}`}><span className="mono">⚽ {sl.t}</span><b>{tr(sl.free ? { uz: "bo'sh", ru: 'свободно' } : { uz: 'band', ru: 'занято' })}</b></span>)}</div>}
            </BrowserFrame>
          </Col>
          <Col>
            {/* F-0925-QA05/06: ko'rinmas nusxa tepada, yorliq karta ustida (4-ekran naqshi) */}
            <div className="cc-ghost" aria-hidden="true"><CompareChips chips={NEW_CHIPS} cmp={{ ...cmp, lit: null, pend: [] }} /></div>
            <FlowLabel>{tr({ uz: "Saytga birinchi kirgan odam", ru: 'Впервые зашёл на сайт' })}</FlowLabel>
            <div className={`visitor ${v === 0 ? 'leave' : 'stay'}`} key={v} aria-live="polite">
              <span className="visitor-ic" aria-hidden="true">{v === 0 ? '🤔' : '🙂'}</span>
              {v === 0 && <span className="me-bub q">{tr({ uz: 'bu nima?', ru: 'что это?' })}</span>}
              {v === 0 && <span className="visitor-door" aria-hidden="true">🚪</span>}
              {v === 1 && <span className="visitor-ok" aria-hidden="true">✓</span>}
            </div>
            {/* Hukm: yorliq + bitta sabab (PmLesson2 Screen2: TUSHUNARLI / TUSHUNARSIZ). Senariy xulosasi pastda, frame-soft. */}
            {v === 0
              ? <Verdict ok={false} label={tr({ uz: 'Tushunarsiz', ru: 'Непонятно' })}>{tr({ uz: 'Faqat qidiruv qatori bor — yangi odam sayt nima va kim uchun ekanini bilmaydi.', ru: 'Есть только строка поиска — новый человек не знает, что это за сайт и для кого он.' })}</Verdict>
              : <Verdict ok label={tr({ uz: 'Tushunarli', ru: 'Понятно' })}>{tr({ uz: "Birinchi gapdanoq sayt nima qilishi va kim uchun ekani ko'rinadi.", ru: 'С первой же фразы видно, что делает сайт и для кого он.' })}</Verdict>}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 13 — KARTADAN SAHIFAGA: 5 bo'lim bittalab; kartaning qatori o'z bo'limiga uchib kiradi =====
const ScreenSections = ({ screen, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const [opened, setOpened] = useState(0); // nechta bo'lim ochildi (tartib bilan)
  const [cur, setCur] = useState(null);
  // flying — hozir kartadan «uchayotgan» qator (0.7s). Uchib bo'lgan qatorning matni kartadan OLIB TASHLANADI
  // (faqat yorliq + ✓ qoladi): bir matn ekranda ikki marta turmasin va qayta bosishda qayta «uchib» miltillamasin.
  const [flying, setFlying] = useState(null);
  useEffect(() => { if (flying === null) return; const t = setTimeout(() => setFlying(null), 700); return () => clearTimeout(t); }, [flying]);
  const tap = (i) => { if (i > opened) return; if (i === opened) { setOpened(i + 1); if (PAGE_SECS[i].row) setFlying(PAGE_SECS[i].row); } setCur(i); };
  const all = opened >= PAGE_SECS.length;
  const nextTurn = useTurnHint(!all && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: '2-qism · Birinchi nima ko\'rinadi', ru: 'Часть 2 · Что видно первым' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all && !isMentor} label={all || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Bo'limlarni bittalab oching (${opened}/5)`, ru: `Откройте разделы по одному (${opened}/5)` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sotuvchilar uchun yangi sahifa: <span className="italic" style={{ color: T.accent }}>beshta bo'lim</span> nima qiladi?</>, ru: <>Новая страница для продавцов: что делают <span className="italic" style={{ color: T.accent }}>пять разделов</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Sahifadagi har bo'limning o'z vazifasi bor — <b style={{ color: T.ink }}>«Birinchi blok»</b>dan boshlab bo'limlarni birma-bir bosing.</>, ru: <>У каждого раздела страницы своя задача — нажимайте разделы по очереди, начиная с <b style={{ color: T.ink }}>«Первый блок»</b>.</> })}</Mentor>
        <div className="split sec-split">
          <Col>
            <FlowLabel>{tr({ uz: 'Karta — OLX sotuvchisi', ru: 'Карточка — продавец OLX' })}</FlowLabel>
            <div className="acard">
              {ROW_META.map(r => {
                const sent = PAGE_SECS.some((s, i) => s.row === r.key && i < opened);
                return (
                  <div key={r.key} className={`acard-row on ${flying === r.key ? 'fly' : ''} ${sent ? 'sent' : ''}`} style={{ '--rc': r.col }}>
                    <span className="acard-lbl" style={{ color: r.col }}>{tr(r.lbl)}{sent && <span className="gl-ck on" aria-hidden="true">✓</span>}</span>
                    {(!sent || flying === r.key) && <span className="acard-txt">{tr(SELLER[r.key])}</span>}
                  </div>
                );
              })}
            </div>
          </Col>
          <Col>
            <FlowLabel>{tr({ uz: "Sahifa — bo'limlarni bittalab bosing", ru: 'Страница — нажимайте разделы' })}</FlowLabel>
            {/* Tozalik (111-qonun, 2026-09-25): OLX-logotip qatori olindi — bezak edi, besh bo'lim ochilgach sarlavhani
                ekrandan surib chiqarardi; yana o'ylab topilgan sahifani OLX'niki qilib ko'rsatardi (faraz 15-ekranda aytiladi). */}
            <BrowserFrame className="sec-page">
              {PAGE_SECS.map((s, i) => {
                const isOpen = i < opened;
                const locked = i > opened;
                return (
                  <button key={s.key} type="button" disabled={locked} onClick={() => tap(i)} style={{ '--rc': secCol(s.key) }}
                    className={`psec ${s.key} ${isOpen ? 'open' : ''} ${cur === i ? 'cur' : ''} ${locked ? 'locked' : ''}${i === opened && nextTurn ? ' turn-ring' : ''}`}>
                    <span className="psec-lbl">{tr(s.lbl)}</span>
                    {isOpen && <span className={`psec-txt ${cur === i ? 'fly-in' : ''}`} key={cur === i ? `c${cur}` : 'x'}>{tr(SELLER_PAGE[s.key])}</span>}
                    {isOpen && s.key === 'blok' && <span className="psec-note">{tr({ uz: 'Kirgan odam birinchi ko\'radigan joy: bu nima va kim uchun', ru: 'Место, которое вошедший видит первым: что это и для кого' })}</span>}
                  </button>
                );
              })}
            </BrowserFrame>
          </Col>
        </div>
      </div>
    </Stage>
  );
};

const ScreenT4 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 4', ru: 'Проверка · 4' })} scope="module-mikro"
    question={<TestQ ask={tr({ uz: 'Yangi sahifada tugma qayerda turishi kerak?', ru: 'Где на новой странице должна стоять кнопка?' })} />}
    questionText={tr({ uz: 'Tugma joyi', ru: 'Место кнопки' })}
    options={[
      tr({ uz: "Muammo va yechim ko'rsatilgandan keyin, oxirroqda", ru: 'После того как показаны проблема и решение, ближе к концу' }),
      tr({ uz: 'Eng tepada, hatto birinchi blokdan ham oldinda', ru: 'В самом верху, даже раньше первого блока' }),
      tr({ uz: "Muammo bo'limidan oldin, sahifa o'rtasida", ru: 'Перед разделом «Проблема», в середине страницы' }),
      tr({ uz: 'Faqat menyuning ichida, alohida sahifada', ru: 'Только внутри меню, на отдельной странице' }),
    ]}
    correctIdx={INLINE_KEYS.s14}
    explainCorrect={tr({ uz: "To'g'ri — OLX'ni hamma taniydi, shuning uchun uning tugmasi darhol ko'rinadi. Yangi saytda esa odam avval muammosini ko'radi, keyin yechimni tushunadi — shundan keyingina tugmani nega bosishini biladi.", ru: 'Верно — OLX знают все, поэтому его кнопку видно сразу. А на новом сайте человек сначала видит свою проблему, потом понимает решение — и только после этого знает, зачем нажимать кнопку.' })}
    explainWrong={{
      // Har noto'g'ri variantga alohida izoh (F-0924-06, spec 9.4): avval variantning to'g'ri jihati, keyin yo'naltirish.
      1: tr({ uz: "Tugma ko'zga tashlansin degan fikr to'g'ri. Lekin sahifa endi ochilganda odam sayt nima ekanini ham bilmaydi — tugmani nega bosadi?", ru: 'Мысль, что кнопка должна быть заметной, верная. Но когда страница только открылась, человек ещё не знает даже, что это за сайт, — зачем ему нажимать?' }),
      2: tr({ uz: "Tugma birinchi blokdan keyin turgani yaxshi. Lekin odam hali muammosini ham, yechimni ham ko'rmagan — uni nega bosadi?", ru: 'Хорошо, что кнопка стоит после первого блока. Но человек ещё не видел ни своей проблемы, ни решения — зачем ему её нажимать?' }),
      3: tr({ uz: "Menyuning ichiga yashirilgan tugmani odam topmaydi va izlamaydi ham. Yechimni tushungan zahoti tugma qayerda tursin?", ru: 'Кнопку, спрятанную внутри меню, человек не найдёт и искать не станет. Где она должна стоять, когда он понял решение?' }),
      default: tr({ uz: "Muammo va yechimni ko'rmagan odam tugmani nega bosishini hali bilmaydi.", ru: 'Человек, не увидевший проблему и решение, ещё не знает, зачем нажимать кнопку.' }),
    }}
  />
);

// ===== SCREEN 15 — TARTIBGA QO'YING: sudrash (yoki ikkitasini bosib almashtirish) + sotuvchi o'qish-simulyatsiyasi =====
// Qatorlarda yorliq + QISQA material-matn (ORDER_TXT, 2026-09-24 vizual-boylik: kulrang chiziq o'rniga maket «haqiqiy» ko'rinadi).
// O'ngda ReaderPanel — sotuvchi o'qish-simulyatsiyasining vizuali. Tozalik (111-qonun, 2026-09-25): tugma ostidagi
// «Sudrang yoki…» yo'rig'i va «Isbot» qatoridagi ikkinchi 💬 olindi — mentor-chorlov va ustun-yorlig'i shuni aytadi, 💬 yorliqda bor.
// 🏅 Right Order! — bonus nishon (152-qonun): «tugmagacha olib bordingiz» — har yo'lda rost; AchRule yo'q.
// 🟡 Buzuq tartib xabari senariyda bitta — o'quvchi birinchi noto'g'ri turgan bo'limda to'xtaydi.
const ORDER_OK = PAGE_SECS.map(s => s.key);
// Qator ichidagi material-matn (maket «haqiqiy» ko'rinsin — kulrang chiziq emas). 13-ekran gaplarining QISQA varianti:
// sarlavha va tugma — o'sha-o'zi; isbot — senariy 127-qatori: raqamsiz, faqat umumiy «sotuvchilar fikri».
const ORDER_TXT = {
  muammo: { uz: "Sotish uchun kun bo'yi bozorda turasizmi?", ru: 'Чтобы продать, весь день стоите на рынке?' },
  qanday: { uz: "Rasm yuklang, narx yozing — e'lon tayyor", ru: 'Фото, цена — и объявление готово' },
  isbot: SELLER_PAGE.isbot,
};
const ORDER_START = ['tugma', 'isbot', 'blok', 'qanday', 'muammo'];
// Buzuq tartib xabari — sotuvchi TO'XTAGAN joyga va undan OLDIN o'qiganiga qarab (har holatda rost; 120 tartib sanab tekshirilgan).
// target — birinchi noto'g'ri turgan o'rin (undan oldingilari to'g'ri tartibda o'qilgan: blok → muammo → qanday → isbot).
const orderBadMsg = (order, target) => {
  const k = order[target];
  if (target === 0) return { uz: `Sahifa «${secLbl(k)}» bilan boshlandi — sotuvchi bu nima va kim uchun ekanini bilmay, chiqib ketdi.`, ru: `Страница началась с раздела «${secLbl(k)}» — продавец не понял, что это и для кого, и ушёл.` };
  if (k === 'tugma' && target === 3) return { uz: "Sotuvchi tugmani ko'rdi, lekin boshqa sotuvchilar fikrini ko'rmay turib, bosishga ishonmadi.", ru: 'Продавец увидел кнопку, но не поверил и не нажал: отзывов других продавцов он ещё не видел.' };
  if (k === 'tugma' && target === 2) return { uz: "Sotuvchi muammosini ko'rdi, lekin sayt qanday yordam berishini bilmay turib, tugmani bosmadi.", ru: 'Продавец увидел свою проблему, но не нажал кнопку: он ещё не знает, как сайт ему поможет.' };
  if (k === 'tugma') return { uz: "Tugma juda erta keldi — sotuvchi muammo va yechimni ko'rmay turib, uni nega bosishini bilmaydi.", ru: 'Кнопка появилась слишком рано — не увидев проблему и решение, продавец не знает, зачем её нажимать.' };
  return { uz: `«${secLbl(k)}» juda erta keldi — sotuvchi chiqib ketdi. Undan oldin nima turishi kerak?`, ru: `Раздел «${secLbl(k)}» появился слишком рано — продавец ушёл. Что должно стоять перед ним?` };
};
// 👤 O'QISH-PANELI (PmLesson2 CustomerRun vizuali; mantiq ScreenOrder'da — bu faqat uning `run` holatini chizadi):
// sotuvchi yuzi + hozir o'qiyotgan bo'lim · 5 katakli yo'l (sahifadagi tartibda) · «Tushunish» shkalasi n/5.
// Buzuq tartibda shkala TO'XTAGAN katakda qoladi (amber 🚪) — qizil emas, bu maslahat-hukm.
const ReaderPanel = ({ order, run, target }) => {
  const ok = run.res === 'ok';
  const bad = run.res === 'bad';
  const n = ok ? order.length : bad ? target : run.on ? Math.max(0, run.at) : 0;
  const cur = run.on && run.at >= 0 && run.at < order.length ? order[run.at] : null;
  const face = ok ? '😊' : bad ? '🤔' : '🧑';
  const bub = ok ? <>👆 {tr(ELON)}</> : bad ? <>🚪 {secLbl(order[target])}</> : cur ? <>📖 {secLbl(cur)}</> : null;
  return (
    <div className={`rd-panel${ok ? ' ok' : ''}${bad ? ' bad' : ''}`} aria-live="polite">
      <div className="rd-who">
        <span className={`rd-face${run.on ? ' walk' : ''}`} key={`f${run.at}${run.res || ''}`} aria-hidden="true">{face}</span>
        {bub ? <span className="rd-bub fade-step" key={`b${run.at}${run.res || ''}`}>{bub}</span> : <span className="rd-bub idle" aria-hidden="true">· · ·</span>}
      </div>
      <div className="rd-track" aria-hidden="true">
        {order.map((k, i) => {
          const st = i < n ? 'done' : (bad && i === target) ? 'stop' : (run.on && i === run.at) ? 'here' : '';
          return <span key={k} className={`rd-seg ${st}`}><span className="rd-ic">{st === 'stop' ? '🚪' : SEC_IC[k]}</span>{st === 'done' && <span className="rd-ck">✓</span>}</span>;
        })}
      </div>
      <div className="cr-conf">
        <span className="cr-conf-lbl">{tr({ uz: 'Tushunish', ru: 'Понимание' })}</span>
        <span className="cr-conf-track"><span className={`cr-conf-fill${ok ? ' ok' : ''}`} style={{ width: `${(n / order.length) * 100}%` }} /></span>
        <span className="cr-conf-n mono">{n}/{order.length}</span>
      </div>
    </div>
  );
};
const ScreenOrder = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [order, setOrder] = useState(() => (storedAnswer?.solved ? ORDER_OK.slice() : ORDER_START.slice()));
  const [sel, setSel] = useState(-1);
  const [run, setRun] = useState({ on: false, at: -1, res: storedAnswer?.solved ? 'ok' : null });
  const done = !!(storedAnswer && storedAnswer.solved) || run.res === 'ok';
  // touched — o'quvchi o'rnini almashtirgan bo'limlar; hasRun — «Sotuvchi o'qisin» kamida bir marta bosilgan.
  const [touched, setTouched] = useState(() => new Set());
  const [hasRun, setHasRun] = useState(false);
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 🖐 Silliq sudrash (F-0925-B01): brauzerning o'z drag-and-drop'i o'rniga pointer — olingan bo'lim kursor/barmoq ortidan
  // yuradi, qolganlari joy bo'shatib suriladi, qo'yilganda o'z o'rniga sirg'alib kiradi. Tartib o'zgarganda (sudrash ham,
  // bosib almashtirish ham) FLIP: eski joydan yangi joyga harakat. Sudrash paytida transformlar DOM'ga to'g'ridan yoziladi
  // (har pikselda qayta render yo'q). Telefonda sudrash faqat ⠿ tutqichdan — qatorning qolgan joyi sahifani aylantiradi.
  const rowEls = useRef({});
  const drag = useRef(null);
  const flipPrev = useRef(null);
  const justDragged = useRef(false);
  const [dragKey, setDragKey] = useState(null);
  const snapRects = () => { const m = {}; order.forEach(k => { const el = rowEls.current[k]; if (el) m[k] = el.getBoundingClientRect().top; }); return m; };
  const flipFrom = (prev) => {
    Object.keys(prev).forEach(k => {
      const el = rowEls.current[k]; if (!el) return;
      const d = prev[k] - el.getBoundingClientRect().top;
      clearTimeout(el._flipT);
      if (reduce || Math.abs(d) < 1) { el.style.transition = ''; el.style.transform = ''; return; }
      el.style.transition = 'none'; el.style.transform = `translateY(${d}px)`;
      el.getBoundingClientRect();
      el.style.transition = 'transform 0.26s cubic-bezier(.2,.8,.2,1)'; el.style.transform = '';
      el._flipT = setTimeout(() => { el.style.transition = ''; }, 300);
    });
  };
  useLayoutEffect(() => { const p = flipPrev.current; flipPrev.current = null; if (p) flipFrom(p); }, [order]); // eslint-disable-line
  const resetRun = () => setRun({ on: false, at: -1, res: null });
  const swap = (a, b) => { if (a === b || a < 0 || b < 0) return; flipPrev.current = snapRects(); setTouched(p => { const n = new Set(p); n.add(order[a]); n.add(order[b]); return n; }); setOrder(o => { const n = o.slice(); [n[a], n[b]] = [n[b], n[a]]; return n; }); resetRun(); };
  const move = (a, b) => { if (a === b || a < 0 || b < 0) return; setTouched(p => { const n = new Set(p); n.add(order[a]); n.add(order[b]); return n; }); setOrder(o => { const n = o.slice(); const [x] = n.splice(a, 1); n.splice(b, 0, x); return n; }); resetRun(); };
  const tapRow = (i) => { if (justDragged.current) { justDragged.current = false; return; } if (run.on || done) return; if (sel < 0) setSel(i); else { swap(sel, i); setSel(-1); } };
  const onRowDown = (e, i) => {
    justDragged.current = false;
    if (run.on || done || drag.current || (e.pointerType === 'mouse' && e.button !== 0)) return;
    if (e.pointerType !== 'mouse' && !e.target.closest('.orow-grip')) return;
    const els = order.map(k => rowEls.current[k]);
    if (els.some(el => !el)) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) { /* eski brauzer */ }
    drag.current = { i, id: e.pointerId, y0: e.clientY, els, rs: els.map(el => el.getBoundingClientRect()), over: i, on: false };
  };
  const onRowMove = (e) => {
    const d = drag.current; if (!d || e.pointerId !== d.id) return;
    const { i, rs, els } = d;
    const last = rs.length - 1;
    const dy = Math.max(rs[0].top - rs[i].top, Math.min(rs[last].bottom - rs[i].bottom, e.clientY - d.y0));
    if (!d.on) { if (Math.abs(e.clientY - d.y0) < 6) return; d.on = true; setDragKey(order[i]); setSel(-1); }
    e.preventDefault();
    // Joy almashish chegarasi — qo'shni bo'limning o'rtasi: yuqoriga sudralganda bo'limning USTKI cheti, pastga — PASTKI cheti
    // o'lchanadi (markaz emas: aks holda baland bo'lim pastroq bo'limdan o'ta olmaydi).
    const top = rs[i].top + dy, bot = rs[i].bottom + dy;
    let over = 0; rs.forEach((r, j) => { const m = r.top + r.height / 2; if (j < i ? top >= m : j > i && bot > m) over++; });
    d.over = over;
    const step = rs[i].height + (rs.length > 1 ? Math.max(0, rs[1].top - rs[0].bottom) : 0);
    els.forEach((el, j) => {
      if (j === i) { el.style.transform = `translateY(${dy}px) scale(1.02)`; return; }
      const s = (i < over && j > i && j <= over) ? -step : (over < i && j >= over && j < i) ? step : 0;
      el.style.transform = s ? `translateY(${s}px)` : '';
    });
  };
  const onRowUp = (e, cancel) => {
    const d = drag.current; if (!d || e.pointerId !== d.id) return;
    drag.current = null;
    if (!d.on) return;
    justDragged.current = true; // sudrashdan keyingi «click» bosish-tanlash bo'lib ketmasin (keyingi pointerdown tozalaydi)
    const to = cancel ? d.i : d.over;
    const prev = snapRects();
    d.els.forEach(el => { el.style.transition = 'none'; el.style.transform = ''; });
    setDragKey(null);
    if (to !== d.i) { flipPrev.current = prev; move(d.i, to); } else flipFrom(prev);
  };
  const stopAt = order.findIndex((k, i) => k !== ORDER_OK[i]);
  const target = stopAt < 0 ? order.length : stopAt;
  useEffect(() => {
    if (!run.on) return;
    if (run.at >= target || reduce) {
      const ok = stopAt < 0;
      setRun({ on: false, at: target, res: ok ? 'ok' : 'bad' });
      if (ok && !(storedAnswer && storedAnswer.solved)) { onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'tartib', solved: true, correct: true, picked: true }); sendPractice(live, screen); }
      return;
    }
    const t = setTimeout(() => setRun(r => ({ ...r, at: r.at + 1 })), 650);
    return () => clearTimeout(t);
  }, [run.on, run.at]); // eslint-disable-line
  const start = () => { setSel(-1); setHasRun(true); setRun({ on: true, at: 0, res: null }); };
  // 🔔 Navbat-zanjiri (88-qonun · 3-D.2 — mentor-gap bilan bir halqa): (1) bo'limlarni almashtirish — puls hali TEGILMAGAN
  // bo'limlar bo'ylab yuradi (to'g'ri/noto'g'ri joyni oshkor qilmaydi); (2) hammasi tegilgach yoki bir marta o'qitilgach —
  // «▶ Sotuvchi o'qisin»; (3) buzuq natijadan keyin — sotuvchi to'xtagan bo'lim (tinch), almashtirilgach yana tugma.
  const idle = !run.on && !done && !isMentor;
  const rowPend = idle && run.res === null && !hasRun ? order.filter((k, i) => !touched.has(k) && i !== sel) : [];
  const rowLit = useTurnWalk(rowPend, rowPend.length > 0);
  const runTurn = useTurnHint(idle && run.res === null && rowPend.length === 0 && sel < 0);
  const stopTurn = useTurnHint(idle && run.res === 'bad' && sel < 0);
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Sotuvchi tugmagacha yetsin', ru: 'Пусть продавец дойдёт до кнопки' });
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · tartib', ru: 'Практика · порядок' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} turnBusy={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>Sotuvchi bu sahifani <span className="italic" style={{ color: T.accent }}>oxirigacha</span> o'qiydimi?</>, ru: <>Дочитает ли продавец эту страницу <span className="italic" style={{ color: T.accent }}>до конца</span>?</> })}</h2>
          <p className="lead-note fade-up delay-1">{tr({ uz: "Bu sahifa o'ylab topilgan, OLX'niki emas. Tasavvur qilaylik: OLX sotuvchilar uchun alohida sahifa ochdi.", ru: 'Эта страница придумана, она не от OLX. Представим: OLX открыл отдельную страницу для продавцов.' })}</p>
        </div>
        <Mentor>{tr({ uz: <>Sotuvchi sahifani yuqoridan pastga, tartib bilan o'qiydi — avval bo'limni sudrab kerakli joyga qo'ying (yoki ikkitasini ketma-ket bosing), so'ng <b style={{ color: T.ink }}>«▶ Sotuvchi o'qisin»</b>ni bosing.</>, ru: <>Продавец читает страницу сверху вниз, по порядку, — сначала перетащите раздел на нужное место (или нажмите подряд на два раздела), потом нажмите <b style={{ color: T.ink }}>«▶ Пусть продавец читает»</b>.</> })}</Mentor>
        <Zoomable className="zsplit">
        <div className="split ord-split">
          <Col>
            <FlowLabel>{tr({ uz: "Sahifa — bo'limlarni almashtiring", ru: 'Страница — меняйте разделы местами' })}</FlowLabel>
            <BrowserFrame className={`ord-page${dragKey ? ' dragging' : ''}`}>
              <OlxHead />
              {order.map((k, i) => {
                const passed = run.at > i || (run.res === 'ok');
                const here = run.at === i && (run.on || run.res === 'bad');
                return (
                  <div key={k} style={{ '--rc': secCol(k) }} className={`orow ${k} ${sel === i ? 'sel' : ''} ${passed ? 'passed' : ''} ${here ? 'here' : ''} ${run.res === 'bad' && i === target ? 'stop' : ''}${turnCls(rowLit, k, rowPend.length > 1)}${stopTurn && run.res === 'bad' && i === target ? ' turn-ring' : ''}${dragKey === k ? ' lift' : ''}`}
                    ref={(el) => { if (el) rowEls.current[k] = el; else delete rowEls.current[k]; }}
                    onPointerDown={(e) => onRowDown(e, i)} onPointerMove={onRowMove}
                    onPointerUp={(e) => onRowUp(e, false)} onPointerCancel={(e) => onRowUp(e, true)}
                    onClick={() => tapRow(i)} role="button" tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tapRow(i); } }}>
                    <span className="orow-grip" aria-hidden="true">⠿</span>
                    <span className="orow-lbl"><span className="orow-ic" aria-hidden="true">{SEC_IC[k]}</span>{secLbl(k)}</span>
                    <span className="orow-txt">{k === 'tugma' ? <span className="orow-btn">{tr(SELLER_PAGE[k])}</span> : k === 'blok' ? tr(SELLER_PAGE[k]) : <span className={`orow-mat ${k}`}>{tr(ORDER_TXT[k])}</span>}</span>
                    {here && <span className="orow-reader" aria-hidden="true">{run.res === 'bad' ? '🚪' : '🧑'}</span>}
                  </div>
                );
              })}
            </BrowserFrame>
          </Col>
          <Col>
            <FlowLabel>{tr({ uz: "Sotuvchi — sahifani o'qiydi", ru: 'Продавец — читает страницу' })}</FlowLabel>
            <ReaderPanel order={order} run={run} target={target} />
            {!done && <button type="button" className={`swed-save${runTurn ? ' turn-ring' : ''}`} disabled={run.on} onClick={start} style={{ alignSelf: 'flex-start' }}>▶ {tr({ uz: 'Sotuvchi o\'qisin', ru: 'Пусть продавец читает' })}</button>}
            {run.res === 'ok' && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Sotuvchi muammosini ko\'rdi, yechimini tushundi va tugmani bosdi.', ru: 'Продавец увидел свою проблему, понял решение и нажал кнопку.' })}</p></div>}
            {run.res === 'bad' && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr(orderBadMsg(order, target))}</p></div>}
            <StudentPracticePulse live={live} screen={screen} />
          </Col>
        </div>
        </Zoomable>
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '🧩 Sotuvchini tugmagacha olib borganlar', ru: '🧩 Кто довёл продавца до кнопки' })} />
        <MentorNote>{tr(MENTOR_FREE)}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 16 — O'Z SAHIFANGIZ (ustaxona): kartadan sahifa o'zi yig'iladi; o'quvchi 2 qator yozadi =====
// 🏅 Page Maker! — mehnat nishoni. «Isbot» — «keyin qo'shiladi» holatida (yangi g'oyada isbot to'qilmaydi).
const ScreenPage = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const card = useMemo(() => cardSafe(), []);
  const [st, setSt] = useState(() => ({ blokGap: card.blokGap || '', tugma: card.tugma || '', saved: filled(card.blokGap) && filled(card.tugma) }));
  const done = st.saved || !!(storedAnswer && storedAnswer.solved);
  const ok = { blokGap: filled(st.blokGap), tugma: filled(st.tugma) };
  const canSave = ok.blokGap && ok.tugma;
  const set = (patch) => setSt(p => ({ ...p, ...patch, saved: false }));
  const save = () => {
    if (!canSave) return;
    cardWrite({ blokGap: st.blokGap.trim(), tugma: st.tugma.trim() });
    if (!(storedAnswer && storedAnswer.solved)) { onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'sahifa', solved: true, correct: true, picked: true }); sendPractice(live, screen); }
    setSt(p => ({ ...p, saved: true }));
  };
  const [focus, setFocus] = useState(false);
  const showT = ok.blokGap || filled(st.tugma);
  const pend = ['blokGap', 'tugma'].filter(k => !ok[k] && (k === 'blokGap' || showT));
  const litF = useTurnWalk(pend, !focus && !st.saved && !isMentor);
  const saveTurn = useTurnHint(canSave && !st.saved && !isMentor);
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : !ok.blokGap ? tr({ uz: '① Birinchi blok gapini yozing', ru: '① Напишите фразу первого блока' })
    : !ok.tugma ? tr({ uz: '② Tugma matnini yozing', ru: '② Напишите текст кнопки' })
    : tr({ uz: 'Sahifani saqlang', ru: 'Сохраните страницу' });
  const val = (v) => (filled(v) ? cap(clean(v)) : '…');
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · o\'z sahifangiz ✍️', ru: 'Практика · ваша страница ✍️' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!st.saved && !isMentor} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sahifangizning <span className="italic" style={{ color: T.accent }}>tepasida</span> nima turadi?</>, ru: <>Что будет <span className="italic" style={{ color: T.accent }}>вверху</span> вашей страницы?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Yangi saytga kirgan odam avval «bu nima va kim uchun?» savoliga javob izlaydi — uni <b style={{ color: T.ink }}>«Birinchi blok»</b>ga yozing.</>, ru: <>Зашедший на новый сайт сначала ищет ответ на вопрос «что это и для кого?» — впишите его в <b style={{ color: T.ink }}>«Первый блок»</b>.</> })}</Mentor>
        <div className="split">
          <Col>
            {/* F-0925-QA22: «Birinchi blok» / «Tugma» yorliqlari maydon ichiga (placeholder + aria-label) — o'ngdagi sahifada
                shu bo'lim yorlig'i va tugmaning o'zi ko'rinib turadi, maydon to'lgach ham qaysi joy ekani bilinadi */}
            <label className={`bfield ${ok.blokGap ? 'on' : ''}${turnCls(litF, 'blokGap', pend.length > 1)}`}>
              <input value={st.blokGap} onChange={e => set({ blokGap: e.target.value })} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={tr({ uz: 'Birinchi blok: bu nima va kim uchun?', ru: 'Первый блок: что это и для кого?' })} aria-label={secLbl('blok')} maxLength={90} />
            </label>
            {showT && (
              <label className={`bfield ${ok.tugma ? 'on' : ''}${turnCls(litF, 'tugma', pend.length > 1)}`}>
                <input value={st.tugma} onChange={e => set({ tugma: e.target.value })} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={tr({ uz: "Tugma (masalan: E'lon berish)", ru: 'Кнопка (например: Подать объявление)' })} aria-label={secLbl('tugma')} maxLength={30} />
              </label>
            )}
            <div className="swed-btns">
              <button type="button" className={`swed-save${saveTurn ? ' turn-ring' : ''}`} disabled={!canSave || st.saved} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
            </div>
            {st.saved && <div className="done-mini fade-step">✓ {tr({ uz: 'Sahifa saqlandi', ru: 'Страница сохранена' })}</div>}
            <StudentPracticePulse live={live} screen={screen} />
          </Col>
          <Col>
            <FlowLabel>{tr({ uz: "Sahifangiz — o'zi yig'iladi", ru: 'Ваша страница — собирается сама' })}</FlowLabel>
            <BrowserFrame className="my-page">
              <div className="mp-sec blok" style={{ '--rc': secCol('blok') }}><span className="psec-lbl">{secLbl('blok')}</span><span className="mp-head">{val(st.blokGap)}</span></div>
              <div className="mp-sec" style={{ '--rc': secCol('muammo') }}><span className="psec-lbl">{secLbl('muammo')}</span><span className="mp-txt">{val(card.ogir)}</span></div>
              <div className="mp-sec" style={{ '--rc': secCol('qanday') }}><span className="psec-lbl">{secLbl('qanday')}</span><span className="mp-txt">{val(card.qiladi)}</span></div>
              <div className="mp-sec ghost"><span className="psec-lbl">{secLbl('isbot')}</span><span className="mp-txt">{tr({ uz: 'Birinchi foydalanuvchilar fikri — keyin qo\'shiladi', ru: 'Отзывы первых пользователей — добавим позже' })}</span></div>
              <div className="mp-sec btn"><span className="mp-btn">{filled(st.tugma) ? clean(st.tugma) : '…'}</span></div>
            </BrowserFrame>
          </Col>
        </div>
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Sahifasini saqlaganlar', ru: '✍️ Кто сохранил страницу' })} />
        <MentorNote>{tr(MENTOR_FREE)}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 17 — AI BILAN BIRINCHI BLOK: so'rov kartadan yig'iladi (yig'mada) → Gemini → tanlov; zaxira — 3 tayyor qolip =====
const copyText = async (txt) => {
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(txt); return true; } } catch { /* pastdagi yo'l */ }
  try { const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); document.body.removeChild(ta); return ok; } catch { return false; }
};
// ===== AI QADAMI (F-0924-01/02 · F-0925-QA35) — so'rov DOIM ochiq; nusxalash — so'rov qutisi burchagidagi 📋 belgisi,
// «Gemini'ni ochish» bosilganda so'rov o'zi nusxalanadi (bitta harakat). Qadam raqamlari va «qo'ying» yozuvi yo'q — yo'riq mentor-gapda.
// Umumiy naqsh (7 bridge darsi). Manba: DeployLesson Screen4 (.pr-panel) + FallbackPanel (.dsx-fb, 155-qonun 2-band).
// onReady — Gemini ochilganini xabar qiladi (keyingi puls ekrandagi maydonda).
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
      <a className={`ais-link ais-go${opened ? ' on' : ''}${turnCls(lit, 'open', false)}`} href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" onClick={() => { doCopy(); setOpened(true); }}>
        {opened ? '✓ ' : ''}{tr({ uz: "Gemini'ni ochish ↗", ru: 'Открыть Gemini ↗' })}
      </a>
      <p className="ais-t">{answerLabel}</p>
      <details className="dsx-fb">
        <summary>🛟 {fallbackTitle || tr({ uz: 'Gemini ochilmadimi?', ru: 'Gemini не открылся?' })}</summary>
        <div className="dsx-fb-body">{fallback}</div>
      </details>
    </div>
  );
};
// Zaxira-sarlavhalar (senariy 17: «{YECHIM} — {KIM} uchun» · «{KIM}, endi {YECHIM}» · «{MUAMMO}? {YECHIM}»).
// Sarlavha — ≤8 so'z, ≤90 belgi. Kartadagi to'liq gaplar qolipga sig'maydi, shuning uchun tayyor g'oya va namuna uchun
// qisqa shakl dars ichida yozilgan (bridgeCard.js o'zgarmaydi; §37/§201 — har biri UZ/RU ovoz chiqarib o'qilgan).
const AI_HEADS = {
  futbol: {
    uz: ["Maydonni oldindan band qilish — hovlida futbol o'ynaydiganlar uchun", "Hovlida futbol o'ynaydiganlar, endi maydonni oldindan band qiling", "Maydon doim bandmi? Bo'sh vaqtini oldindan band qiling"],
    ru: ['Бронь футбольного поля — для дворовых команд', 'Дворовые команды, теперь бронируйте поле заранее', 'Поле всегда занято? Бронируйте свободное время здесь'],
  },
  oyin: {
    uz: ["Mos jamoadosh topish — onlayn o'yinchilar uchun", "Onlayn o'yinchilar, endi mos jamoadoshni tez toping", 'Jamoadoshsiz qolyapsizmi? Darajangizga mos jamoadosh toping'],
    ru: ['Поиск подходящего напарника — для онлайн-игроков', 'Онлайн-игроки, теперь быстро находите подходящего напарника', 'Остались без напарника? Найдите напарника своего уровня'],
  },
  sinf: {
    uz: ['Pul berganlarni belgilash — sinf sardori uchun', 'Sinf sardori, endi kim pul berganini belgilab boring', 'Kim pul berganini adashtiryapsizmi? Har birini belgilab boring'],
    ru: ['Отметка сдавших деньги — для старосты класса', 'Староста класса, теперь отмечайте, кто сдал деньги', 'Путаете, кто сдал деньги? Отмечайте каждого здесь'],
  },
  kiyim: {
    uz: ["Mos o'lchamni topish — internetdan kiyim oladiganlar uchun", "Internetdan kiyim oladiganlar, endi mos o'lchamni tanlang", "Kiyim to'g'ri kelmayaptimi? Bo'y va vazningizni yozing"],
    ru: ['Подбор размера — для покупающих одежду онлайн', 'Покупатели одежды онлайн, теперь выбирайте точный размер', 'Одежда не подходит? Введите рост и вес'],
  },
  namuna: {
    uz: ["Avtobus qayerdaligini xaritada ko'rsatadi — avtobus kutadigan o'quvchilar uchun", "Avtobus kutadigan o'quvchilar, endi avtobusni xaritada kuzating", "Avtobus qachon kelishini bilmaysizmi? Xaritada ko'ring"],
    ru: ['Автобус на карте — для школьников на остановке', 'Школьники на остановке, теперь автобус виден на карте', 'Не знаете, когда придёт автобус? Смотрите на карте'],
  },
};
// Karta tayyor g'oyadan olinib, o'zgartirilmagan bo'lsa — o'sha g'oyaning qisqa sarlavhalari (qaysi tilda saqlangani farqsiz)
const readyIdOf = (card) => {
  const same = (v, o) => filled(v) && (clean(v) === clean(o.uz) || clean(v) === clean(o.ru));
  const it = READY_IDEAS.find(x => same(card.kim, x.kim) && same(card.ogir, x.ogir) && same(card.qiladi, x.qiladi));
  return it ? it.id : null;
};
const aiHeads = (card, K, M, Y) => {
  if (!(filled(card.kim) && filled(card.ogir) && filled(card.qiladi))) return tr(AI_HEADS.namuna);
  const id = readyIdOf(card);
  if (id && AI_HEADS[id]) return tr(AI_HEADS[id]);
  // O'quvchining o'z matni: KIM har qolipda gap egasi yoki murojaat (§201 — birlik/ko'plik farqsiz); maydonga sig'maganlari (>90) chiqmaydi
  const all = tr({
    uz: [`${cap(Y)} — ${K} uchun`, `${cap(K)}, endi sayt ${Y}`, `${cap(K)} ${M}mi? Sayt ${Y}`],
    ru: [`${cap(K)}: сайт ${Y}`, `${cap(K)}, теперь сайт ${Y}`, `${cap(M)}? Сайт ${Y}`],
  });
  const fit = all.filter(t => t.length <= 90);
  return fit.length ? fit : [all.reduce((a, b) => (b.length < a.length ? b : a))];
};
const ScreenAi = ({ screen, onNext, onPrev }) => {
  const card = useMemo(() => cardSafe(), []);
  // Karta bo'lmasa — 9-ekran namunasi (40-qonun: namuna-fallback)
  const K = filled(card.kim) ? clean(card.kim) : tr(GOYA_PH.kim);
  const M = filled(card.ogir) ? clean(card.ogir) : tr(GOYA_PH.muammo);
  const Y = filled(card.qiladi) ? clean(card.qiladi) : tr(GOYA_PH.yechim);
  const prompt = tr({
    uz: `Men sayt qilyapman. ${cap(K)} ${M}. Mening saytim ${Y}. Sahifaning birinchi bloki uchun 3 xil qisqa sarlavha yozib bering: har biri sayt nima ekanini va kim uchun ekanini aytsin, 8 so'zdan oshmasin, ${K} tushunadigan oddiy tilda.`,
    ru: `Я делаю сайт. ${cap(K)}: ${M}. Мой сайт ${Y}. Напишите 3 разных коротких заголовка для первого блока страницы: каждый должен говорить, что это за сайт и для кого он, не длиннее 8 слов, простым языком, понятным для таких людей: ${K}.`,
  });
  const templates = aiHeads(card, K, M, Y);
  const isMentor = useIsMentor();
  const [line, setLine] = useState(card.blokGap || '');
  const [put, setPut] = useState(false);
  const [ready, setReady] = useState(false); // Gemini ochildi → navbat maydonga o'tadi (F-0925-QA35)
  const [focus, setFocus] = useState(false);
  const place = () => { if (!filled(line)) return; cardWrite({ blokGap: line.trim() }); setPut(true); };
  // Bir lahzada bitta puls: Gemini tugmasi (AiStep ichida) → maydon → «Sahifaga qo'yish» → NavNext.
  const fieldTurn = useTurnHint(ready && !filled(line) && !focus && !isMentor);
  const placeTurn = useTurnHint(filled(line) && !put && !focus && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: 'AI bilan', ru: 'С AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!put && !isMentor} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>AI birinchi blokingizga qanday <span className="italic" style={{ color: T.accent }}>gaplar</span> taklif qiladi?</>, ru: <>Какие <span className="italic" style={{ color: T.accent }}>фразы</span> AI предложит для вашего первого блока?</> })}</h2>
        </div>
        {/* Senariy 17: ekran boshidagi ikki gap bitta gapga qo'shildi (mazmuni so'zma-so'z) + chorlov — interaktiv ekranda 1 gap. */}
        <Mentor>{tr({ uz: <>AI sizga sarlavha variantlarini taklif qiladi, qaysi biri qolishini esa o'zingiz tanlaysiz — <b style={{ color: T.ink }}>«Gemini'ni ochish»</b>ni bosing: so'rov o'zi nusxalanadi, chatga joylab yuboring.</>, ru: <>AI предложит вам варианты заголовка, а какой из них оставить, выберете вы сами, — нажмите <b style={{ color: T.ink }}>«Открыть Gemini»</b>: запрос скопируется сам, вставьте его в чат и отправьте.</> })}</Mentor>
        <div className="split">
          <Col>
            <FlowLabel>{tr({ uz: "AI — sarlavha taklif qiladi", ru: 'AI — предлагает заголовок' })}</FlowLabel>
            <AiStep prompt={prompt} answered={put} onReady={setReady} pulse={!isMentor}
              answerLabel={tr({ uz: <>Yoqqan sarlavhani <b>«{secLbl('blok')}»</b>ga yozing</>, ru: <>Впишите понравившийся заголовок в <b>«{secLbl('blok')}»</b></> })}
              fallback={<div className="ai-alts">
                <p className="small" style={{ margin: 0, color: T.ink2, fontWeight: 600 }}>{tr({ uz: <>👇 Birini bosing — u «{secLbl('blok')}»ga yoziladi.</>, ru: <>👇 Нажмите на один — он впишется в «{secLbl('blok')}».</> })}</p>
                {templates.map((t, i) => (
                  <button key={i} type="button" className={`idea wide ${clean(line) === t ? 'on' : ''}`} onClick={() => { setLine(t); setPut(false); }}><span>{t}</span></button>
                ))}
              </div>} />
          </Col>
          <Col>
            {/* F-0925-QA22: «Birinchi blok» yorlig'i maydon ichiga — chapdagi izohda «Birinchi blok» nomi turibdi (QA35: ③ qadam-raqami olindi) */}
            <label className={`bfield ${filled(line) ? 'on' : ''}${fieldTurn ? ' turn-ring' : ''}`}>
              <input placeholder={tr({ uz: 'Birinchi blok — shu yerga yozing…', ru: 'Первый блок — напишите здесь…' })} aria-label={secLbl('blok')} value={line} onChange={e => { setLine(e.target.value); setPut(false); }} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} maxLength={90} />
            </label>
            <div className="swed-btns"><button type="button" className={`swed-save${placeTurn ? ' turn-ring' : ''}`} disabled={!filled(line) || put} onClick={place}>✓ {tr({ uz: 'Sahifaga qo\'yish', ru: 'Поставить на страницу' })}</button></div>
            {put && <div className="done-mini fade-step">✓ {tr({ uz: 'Sahifaga qo\'yildi', ru: 'Поставлено на страницу' })}</div>}
          </Col>
        </div>
        <MentorNote>{tr({ uz: 'Og\'zaki ayting: «Karta qancha aniq bo\'lsa, taklif ham shuncha aniq chiqadi.»', ru: 'Скажите устно: «Чем точнее карточка, тем точнее получится предложение.»' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 18 — JUFTLIK (ballsiz): PairTimer (A 30s + B 30s) → bir qator =====
const REFLECT_KEY = 'bridge-b1-reflection';
const ScreenPair = ({ screen, onNext, onPrev }) => {
  const [text, setText] = useState(() => { try { return localStorage.getItem(REFLECT_KEY) || ''; } catch { return ''; } });
  const save = (v) => { setText(v); try { localStorage.setItem(REFLECT_KEY, v); } catch {} };
  const written = text.trim().length >= 8;
  const [pairStage, setPairStage] = useState('idle');
  const [reflFocus, setReflFocus] = useState(false);
  const inputTurn = useTurnHint(pairStage === 'done' && !written && !reflFocus);
  return (
    <Stage eyebrow={tr({ uz: 'Yakun · juftlik', ru: 'Итог · в паре' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext turnBusy={!written} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sherigingizga <span className="italic" style={{ color: T.accent }}>30 soniyada</span> aytib bering: g'oyangiz kim uchun va sahifangiz tepasida nima turadi — nega?</>, ru: <>Расскажите напарнику <span className="italic" style={{ color: T.accent }}>за 30 секунд</span>: для кого ваша идея и что стоит вверху вашей страницы — почему?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Fikrni ovoz chiqarib aytgan odam uni yaxshiroq eslab qoladi — <b style={{ color: T.ink }}>«▶ Taymerni boshlash»</b>ni bosib, sherigingizga ayting.</>, ru: <>Мысль, сказанную вслух, запоминаешь лучше — нажмите <b style={{ color: T.ink }}>«▶ Запустить таймер»</b> и расскажите напарнику.</> })}</Mentor>
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">{tr({ uz: '🗣 Sherigingizga ayting', ru: '🗣 Расскажите напарнику' })}</span></div></div>
            <PairTimer onStage={setPairStage} muted={written} />
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">{tr({ uz: '✍️ Bugungi darsdan eng muhim fikrni bir qatorga yozing.', ru: '✍️ Запишите самую важную мысль сегодняшнего урока в одну строку.' })}</span></div></div>
            <span className={`turn-wrap${inputTurn ? ' turn-ring' : ''}`}>
              <input placeholder={tr(WRITE_PH)} className="reflect-input" value={text} onChange={e => save(e.target.value)} onFocus={() => setReflFocus(true)} onBlur={() => setReflFocus(false)} maxLength={160} />
            </span>
            {written && <p className="small" style={{ margin: 0, color: T.success, fontWeight: 700 }}>{tr({ uz: '✓ Yozildi!', ru: '✓ Записано!' })}</p>}
          </div>
        </div>
      </div>
    </Stage>
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


// Juftlik-taymeri: 60s = avval A gapiradi (30s), keyin B (30s) — kim gapirayotgani doim ko'rinib turadi.
function PairTimer({ onStage, muted }) {
  const [st, setSt] = useState({ running: false, left: 60, done: false });
  // Navbat (1-C): shu qadamning halqasi — «boshlash» tugmasi (yolg'iz element). Tugmaning O'Z
  // pulsi bor, shuning uchun u navbat-shartiga bo'ysundiriladi: ~2.6s dan keyin yonadi, taymer
  // ketayotganda va tugagach o'chadi. `muted` — navbat allaqachon boshqa qadamda.
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
              <circle cx="44" cy="44" r={R} fill="none" stroke={isA ? T.accent : T.success} strokeWidth="7" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 44 44)" style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div className="pair-ring-mid"><span className={`pair-ring-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span><span className="pair-ring-sec">{phaseLeft}s</span></div>
          </div>
          <div className="pair-live-txt">
            <span className="pair-now">{tr({ uz: 'Hozir ', ru: 'Сейчас говорит ' })}<span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span>{tr({ uz: ' gapiradi', ru: '' })}</span>
            <span className="pair-next">{isA ? tr({ uz: 'keyin — B navbati', ru: 'потом — очередь B' }) : tr({ uz: 'oxirgi navbat', ru: 'последняя очередь' })}</span>
          </div>
        </div>
      ) : (
        <p className="pair-now" style={{ margin: 0 }}>{st.done ? tr({ uz: "✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla!", ru: '✓ Время вышло — рассказали оба. Молодцы!' }) : tr({ uz: "Kim A, kim B bo'lishini kelishib oling: avval A gapiradi, keyin B — har biringizga 30 soniya.", ru: 'Договоритесь, кто A, а кто B: сначала говорит A, потом B — у каждого 30 секунд.' })}</p>
      )}
      <div className="pair-timer-btns">
        {!st.running && <button className={st.done ? 'btn-soft' : `pair-start${startTurn ? '' : ' calm'}`} onClick={() => setSt({ running: true, left: 60, done: false })}>{st.done ? tr({ uz: '↻ Yana bir marta', ru: '↻ Ещё раз' }) : tr({ uz: '▶ Taymerni boshlash', ru: '▶ Запустить таймер' })}</button>}
        {st.running && <button className="btn-soft" onClick={() => setSt({ running: false, left: 60, done: false })}>{tr({ uz: "⏹ To'xtatish", ru: '⏹ Остановить' })}</button>}
      </div>
    </div>
  );
}


// ===== 🏅 NISHONLAR — 4 ta (senariy 4-bo'lim): name inglizcha, desc o'zbekcha (siz-forma) =====
// cardBuilder — 151-naqsh (birinchi urinish, AchRule) · myAudience/pageMaker — mehnat nishoni · rightOrder — bonus (152).
const ACHIEVEMENTS = {
  cardBuilder: { icon: '🃏', name: 'Card Builder!', desc: { uz: 'Sotuvchi kartasini uch savol bilan yig\'dingiz', ru: 'Вы собрали карточку продавца из трёх вопросов' } },
  myAudience:  { icon: '🎯', name: 'My Audience!',  desc: { uz: 'O\'z g\'oyangiz kim uchun ekanini yozdingiz', ru: 'Вы написали, для кого ваша идея' } },
  rightOrder:  { icon: '🧩', name: 'Right Order!',  desc: { uz: 'Sotuvchini tugmagacha olib bordingiz', ru: 'Вы довели продавца до кнопки' } },
  pageMaker:   { icon: '📄', name: 'Page Maker!',   desc: { uz: 'O\'z sahifangizning tepasini yozdingiz', ru: 'Вы написали верх своей страницы' } },
};
// Ekran id → nishon (recordAnswer'da, faqat REAL bajarilganda)
const ACH_TRIGGERS = { karta: 'cardBuilder', goya: 'myAudience', tartib: 'rightOrder', sahifa: 'pageMaker' };
// 151-qonun: birinchi urinish qoidasi faqat shu ekranlarda (mehnat/bonus nishonida AchRule yo'q — 152-qonun)
const ACH_FIRST_TRY = new Set(['karta']);
// AchRule — InternetLesson etalon-porti (DARS_ETALON 11-bo'lim kod naqshi)
const AchRule = ({ screen, once }) => {
  const earned = useContext(AchCtx);
  const am = useContext(AchMissCtx);
  const gate = useContext(LiveGateCtx) || {};
  const sid = SCREEN_META[screen] && SCREEN_META[screen].id;
  const ach = ACH_TRIGGERS[sid];
  if (!ach || !ACH_FIRST_TRY.has(sid) || !am || am.practice || (gate.live && gate.live.mode === 'mentor') || (earned && earned.has(ach))) return null;
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


const QUIZ_MS = 15000;
// Arena fon tokenlari — shu darsning atamalari (dekor o'qitadi). Arena CodeStrike brendi o'zgarmaydi.
const QZ_BG_SHAPES = [
  { ch: { uz: 'KIM', ru: 'КТО' },               l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'MUAMMO', ru: 'ПРОБЛЕМА' },       l: 82, t: 8,  s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'YECHIM', ru: 'РЕШЕНИЕ' },        l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'auditoriya', ru: 'аудитория' },  l: 70, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'kim uchun?', ru: 'для кого?' },  l: 42, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: 'tugma', ru: 'кнопка' },          l: 66, t: 26, s: 22, d: 17, dl: 0.4 },
  { ch: { uz: 'blok', ru: 'блок' },             l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: '🔍',        l: 55, t: 5,  s: 24, d: 22, dl: 0.6 },
  { ch: '🚲',        l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '📱',        l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
  { ch: '🎯',        l: 2,  t: 30, s: 30, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike — 12 savol, ikkala mavzudan teng (auditoriya 6 · struktura 6), ekran savollarining nusxasi emas.
// 🟡 Senariyda savol-matnlari yo'q — ekran-xulosalaridan QORALAMA (🎓 Metodist sayqallaydi, ⚡ Jonli kalitni tasdiqlaydi).
// To'g'ri javoblar 4 pozitsiyaga TENG: A(0) ×3 · B(1) ×3 · C(2) ×3 · D(3) ×3.
const QUIZ_BANK = [
  { q: { uz: 'Saytning auditoriyasi kim?', ru: 'Кто аудитория сайта?' }, opts: [
    { uz: 'Saytni qurgan dasturchilar jamoasi', ru: 'Команда программистов, создавшая сайт' },
    { uz: 'Saytdan foyda oladigan aniq odamlar guruhi', ru: 'Конкретная группа людей, получающих пользу от сайта' },
    { uz: 'Internetdan foydalanadigan hamma odamlar', ru: 'Все люди, которые пользуются интернетом' },
    { uz: 'Saytga reklama beradigan kompaniyalar', ru: 'Компании, которые дают рекламу на сайте' }], correct: 1 },
  { q: { uz: 'Qaysi javob aniq auditoriyani aytadi?', ru: 'Какой ответ называет конкретную аудиторию?' }, opts: [
    { uz: 'Internetdan foydalanadigan barcha odamlar', ru: 'Все люди, которые пользуются интернетом' },
    { uz: 'Zamonaviy dizaynni yaxshi ko\'radiganlar', ru: 'Те, кто любит современный дизайн' },
    { uz: 'Maktabga avtobusda boradigan o\'quvchilar', ru: 'Школьники, которые ездят в школу на автобусе' },
    { uz: 'Telefoni bor istalgan yoshdagi odamlar', ru: 'Люди любого возраста, у кого есть телефон' }], correct: 2 },
  { q: { uz: 'OLX\'ga kiradigan ikki xil odam kim?', ru: 'Какие два разных человека заходят на OLX?' }, opts: [
    { uz: 'Sotmoqchi bo\'lgan va narsa izlayotgan odam', ru: 'Тот, кто хочет продать, и тот, кто ищет вещь' },
    { uz: 'Saytni qurgan dasturchi va dizayner', ru: 'Программист и дизайнер, создавшие сайт' },
    { uz: "Dars beradigan o'qituvchi va o'quvchi", ru: 'Учитель, который ведёт урок, и ученик' },
    { uz: 'Reklama beradigan kompaniya va bloger', ru: 'Компания, дающая рекламу, и блогер' }], correct: 0 },
  { q: { uz: 'Auditoriya-karta qaysi savollarga javob beradi?', ru: 'На какие вопросы отвечает карточка аудитории?' }, opts: [
    { uz: 'Qachon, qayerda va necha pulga', ru: 'Когда, где и за сколько' },
    { uz: 'Qaysi rang, qaysi shrift, qaysi rasm', ru: 'Какой цвет, какой шрифт, какая картинка' },
    { uz: 'Nechta sahifa, nechta tugma, nechta rasm', ru: 'Сколько страниц, сколько кнопок, сколько картинок' },
    { uz: 'Kim, qaysi muammo va qanday yechim', ru: 'Кто, какая проблема и какое решение' }], correct: 3 },
  { q: { uz: 'Facebook qanday boshlangan?', ru: 'Как начинался Facebook?' }, opts: [
    { uz: 'Birdaniga butun dunyo uchun ochilgan', ru: 'Сразу открылся для всего мира' },
    { uz: 'Avval bitta universitet talabalari uchun', ru: 'Сначала для студентов одного университета' },
    { uz: 'Faqat katta kompaniyalar uchun ochilgan', ru: 'Открылся только для крупных компаний' },
    { uz: 'Faqat bitta shahar maktablari uchun', ru: 'Только для школ одного города' }], correct: 1 },
  { q: { uz: 'Sarlavhada kim o\'zini tez taniydi?', ru: 'Кто быстро узнаёт себя в заголовке?' }, opts: [
    { uz: 'Sarlavha aynan u uchun yozilgan odam', ru: 'Тот, для кого именно написан заголовок' },
    { uz: 'Saytga birinchi kirgan har qanday odam', ru: 'Любой, кто впервые зашёл на сайт' },
    { uz: 'Sarlavhani yozgan dasturchining o\'zi', ru: 'Сам программист, написавший заголовок' },
    { uz: 'Faqat reklamani ko\'rib kelgan odam', ru: 'Только тот, кто пришёл по рекламе' }], correct: 0 },
  { q: { uz: 'OLX\'da nima olishini hali bilmagan xaridor nimadan foydalanadi?', ru: 'Чем на OLX пользуется покупатель, который ещё не знает, что купить?' }, opts: [
    { uz: '«E\'lon berish» tugmasidan', ru: 'Кнопкой «Подать объявление»' },
    { uz: 'Sotuvchining telefon raqamidan', ru: 'Номером телефона продавца' },
    { uz: 'Sahifadagi kategoriyalardan', ru: 'Категориями на странице' },
    { uz: 'Sahifa pastidagi kichik yozuvdan', ru: 'Маленькой надписью внизу страницы' }], correct: 2 },
  { q: { uz: 'Yangi sayt tepasida faqat qidiruv tursa, birinchi kirgan odam nima qiladi?', ru: 'Если вверху нового сайта только поиск, что сделает впервые зашедший?' }, opts: [
    { uz: 'Darhol ro\'yxatdan o\'tadi', ru: 'Сразу зарегистрируется' },
    { uz: 'Hamma bo\'limni ko\'rib chiqadi', ru: 'Просмотрит все разделы' },
    { uz: 'Do\'stlariga havolani yuboradi', ru: 'Отправит ссылку друзьям' },
    { uz: '«Bu nima?» deb chiqib ketadi', ru: 'Спросит «что это?» и уйдёт' }], correct: 3 },
  { q: { uz: 'Yangi sahifa bo\'limlarining to\'g\'ri tartibi qaysi?', ru: 'Какой порядок разделов новой страницы правильный?' }, opts: [
    { uz: 'Tugma · Muammo · Birinchi blok · Isbot · Qanday ishlaydi', ru: 'Кнопка · Проблема · Первый блок · Доказательство · Как это работает' },
    { uz: 'Birinchi blok · Muammo · Qanday ishlaydi · Isbot · Tugma', ru: 'Первый блок · Проблема · Как это работает · Доказательство · Кнопка' },
    { uz: 'Isbot · Tugma · Birinchi blok · Muammo · Qanday ishlaydi', ru: 'Доказательство · Кнопка · Первый блок · Проблема · Как это работает' },
    { uz: 'Muammo · Tugma · Isbot · Qanday ishlaydi · Birinchi blok', ru: 'Проблема · Кнопка · Доказательство · Как это работает · Первый блок' }], correct: 1 },
  { q: { uz: 'Kartadagi YECHIM sahifaning qaysi bo\'limiga tushadi?', ru: 'В какой раздел страницы попадает РЕШЕНИЕ из карточки?' }, opts: [
    { uz: 'Isbot', ru: 'Доказательство' },
    { uz: 'Tugma', ru: 'Кнопка' },
    { uz: 'Birinchi blok', ru: 'Первый блок' },
    { uz: 'Qanday ishlaydi', ru: 'Как это работает' }], correct: 3 },
  { q: { uz: 'Yangi g\'oyada «Isbot» bo\'limiga nima yoziladi?', ru: 'Что пишут в разделе «Доказательство» у новой идеи?' }, opts: [
    { uz: 'O\'ylab topilgan foydalanuvchilar soni', ru: 'Придуманное число пользователей' },
    { uz: 'Boshqa saytdan olingan fikrlar', ru: 'Отзывы, взятые с другого сайта' },
    { uz: 'Keyin birinchi foydalanuvchilar fikri', ru: 'Позже — отзывы первых пользователей' },
    { uz: 'Hech narsa — bo\'lim o\'chiriladi', ru: 'Ничего — раздел удаляют' }], correct: 2 },
  { q: { uz: 'Birinchi blok nimani aytishi kerak?', ru: 'Что должен говорить первый блок?' }, opts: [
    { uz: 'Sayt nima va kim uchun ekanini', ru: 'Что это за сайт и для кого он' },
    { uz: 'Saytni kim va qachon qurganini', ru: 'Кто и когда сделал сайт' },
    { uz: 'Sayt qurish necha pulga tushganini', ru: 'Сколько стоило сделать сайт' },
    { uz: 'Saytda nechta sahifa borligini', ru: 'Сколько на сайте страниц' }], correct: 0 },
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
    const TOK = tr({ uz: ['KIM', 'MUAMMO', 'YECHIM', 'auditoriya', 'kim uchun?', 'tugma', 'blok', '🔍', '🚲', '📱'],
                     ru: ['КТО', 'ПРОБЛЕМА', 'РЕШЕНИЕ', 'аудитория', 'для кого?', 'кнопка', 'блок', '🔍', '🚲', '📱'] });
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



// ===== SCREEN 19 — PODIUM (ballsiz, harakatsiz): mentor — top-3 + ro'yxat (ism · ball); o'quvchi — o'z bali va o'rni =====
// Matn yo'q, bayram animatsiyasi 3 soniya (Confetti keyin olib tashlanadi).
const ScreenPodium = ({ screen, answers, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isLive = !!(live && (live.mode === 'student' || live.mode === 'mentor') && live.pin);
  const isMentorL = !!(live && live.mode === 'mentor');
  const livePin = live ? live.pin : null;
  const [players, setPlayers] = useState([]);
  const [rows, setRows] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [party, setParty] = useState(true);
  useEffect(() => { const t = setTimeout(() => setParty(false), 3000); return () => clearTimeout(t); }, []);
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
  const myCorrect = myIdx >= 0 ? board[myIdx].okCount : selfCorrect;
  return (
    <Stage eyebrow={tr({ uz: 'Natijalar', ru: 'Результаты' })} screen={screen} narrow navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{isLive
          ? tr({ uz: <>Testlarda kim eng ko'p <span className="italic" style={{ color: T.accent }}>ball</span> to'pladi?</>, ru: <>Кто набрал больше всех <span className="italic" style={{ color: T.accent }}>баллов</span> в тестах?</> })
          : tr({ uz: <>Testlarda nechta <span className="italic" style={{ color: T.accent }}>ball</span> to'pladingiz?</>, ru: <>Сколько <span className="italic" style={{ color: T.accent }}>баллов</span> вы набрали в тестах?</> })}</h2></div>
        {party && (isMentorL ? (loaded && board.length > 0) : myCorrect > 0) && <Confetti />}
        {!isMentorL ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
            <ScoreRing correct={myCorrect} total={totalQ} />
            {isLive && myIdx >= 0 && <p className="pod-my">{tr({ uz: 'Siz —', ru: 'Вы —' })} <b>{tr({ uz: `${myIdx + 1}-o'rin`, ru: `${myIdx + 1}-е место` })}</b></p>}
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar yuklanmoqda…', ru: 'Результаты загружаются…' })}</p>
        ) : board.length === 0 ? (
          <div className="frame-soft fade-up"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Bu sessiyaga hali hech kim qo'shilmagan.", ru: 'К этой сессии пока никто не подключился.' })}</p></div>
        ) : (
          <>
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
        )}
      </div>
    </Stage>
  );
};

// ===== SCREEN 20 — FLASHCARD (5 ta · mentorsiz, 99-qonun) — PmLesson16 `Flashcards` porti =====
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
    <div className="fc-done fade-up"><span className="fc-done-emoji">🎉</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{tr({ uz: <>{total}/{total} karta yodlandi</>, ru: <>Выучено карточек: {total}/{total}</> })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda ·", ru: '↻ Учим ·' })} <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim ·', ru: '✓ Знаю ·' })} <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
          <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
            <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span>{swapRef.current === 0 && <span className="fc-cue">{tr({ uz: "Javobni o'ylang 🤔", ru: 'Подумайте над ответом 🤔' })} <span className="fc-tap">{tr({ uz: 'bosing', ru: 'нажмите' })}</span></span>}</div>
            <div className="fc-face fc-back"><span className={`fc-tag ${fcTier(tr(card.back))}`}>{tr(card.back)}</span></div>
          </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={() => advance(false)}>{tr({ uz: '✗ Takrorlash', ru: '✗ Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={() => advance(true)}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })}</button></div>)
        : (swapRef.current === 0 ? <p className="fc-hint">{tr({ uz: "👆 Kartani bosing — javobni ko'rasiz", ru: '👆 Нажмите на карточку — увидите ответ' })}</p> : null /* F-0925-QA14: yo'riq faqat 1-kartada */)}
    </div>
  );
}
const FLASHCARDS = [
  { front: { uz: 'Auditoriya nima?', ru: 'Что такое аудитория?' }, back: { uz: 'Saytdan foyda oladigan aniq odamlar guruhi', ru: 'Конкретная группа людей, получающих пользу от сайта' } },
  { front: { uz: '«Hamma uchun» yozilgan sahifada nima bo\'ladi?', ru: 'Что происходит на странице, написанной «для всех»?' }, back: { uz: 'Unda hech kim o\'zini tanimaydi', ru: 'В ней никто не узнаёт себя' } },
  { front: { uz: 'Auditoriya-karta qaysi uch savolga javob beradi?', ru: 'На какие три вопроса отвечает карточка аудитории?' }, back: { uz: 'Kim · qaysi muammo · qanday yechim', ru: 'Кто · какая проблема · какое решение' } },
  { front: { uz: 'Sahifaning eng ko\'zga tashlanadigan joyiga nima qo\'yiladi?', ru: 'Что ставят на самое заметное место страницы?' }, back: { uz: 'Auditoriya birinchi qiladigan ish', ru: 'То, что аудитория делает первым' } },
  { front: { uz: 'Yangi sayt tepasida nima yoziladi?', ru: 'Что пишут вверху нового сайта?' }, back: { uz: 'Bu nima va kim uchun ekani', ru: 'Что это и для кого' } },
];
const ScreenFlash = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Проверьте</span> себя.</> })}</h2></div>
      <div className="fc-center"><Flashcards cards={FLASHCARDS} /></div>
    </div>
  </Stage>
);

// ===== SCREEN 21 — ARENA + YAKUN (3 qator + ko'prik) =====
const RECAP = [
  { uz: 'Sayt aniq odamlar uchun qilinadi.', ru: 'Сайт делают для конкретных людей.' },
  { uz: 'Sahifa tepasida ular birinchi qiladigan ish turadi.', ru: 'Вверху страницы стоит то, что они делают первым.' },
  { uz: 'Yangi sayt tepasida avval «bu nima va kim uchun» yoziladi.', ru: 'Вверху нового сайта сначала пишут, «что это и для кого».' },
];
const ScreenEnd = ({ screen, onReset, onPrev, onFinish }) => {
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
    <Stage eyebrow={null} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: '↻ Darsni boshidan', ru: '↻ Урок сначала' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Darsni yakunlash ✓', ru: 'Завершить урок ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><h2 className="title h-title fade-up d1">{tr({ uz: <>Siz qo'shilayotgan AI Startup kursida har bir loyiha shu savoldan boshlanadi: <span className="italic" style={{ color: T.accent }}>kim uchun?</span></>, ru: <>На курсе AI Startup, к которому вы присоединяетесь, каждый проект начинается с этого вопроса: <span className="italic" style={{ color: T.accent }}>для кого?</span></> })}</h2></div></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : tr({ uz: "12 savolli tezkor o'yin — bugungi dars bo'yicha", ru: 'Быстрая игра из 12 вопросов — по сегодняшнему уроку' })} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}>{tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span>{tr(r)}</span></li>))}</ul></div>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished, liveToken })
export default function BridgeKimUchun({ lang: langProp, onFinished, liveToken }) {
  const lang = langProp || 'uz';
  __lang = lang; // UZ-RU: tr() uchun joriy til (render'dan oldin o'rnatiladi)
  setLiveLang(lang);
  // F-0730-01: saqlangan progress bir marta o'qiladi (jonli-o'quvchi mentor darvozasidan oshib ketmasin)
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
    if (!ach || !ACH_FIRST_TRY.has(sid) || missedRef.current.has(sid) || earnedRef.current.has(ach)) return;
    missedRef.current.add(sid);
    setMissed(new Set(missedRef.current));
  }, []);
  const achMissVal = useMemo(() => ({ missed, miss: missTry, practice: fpPractice }), [missed, missTry, fpPractice]);
  useEffect(() => {
    const upd = () => { const z = Math.min(1.5, Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1000))); document.documentElement.style.setProperty('--lz', String(Math.round(z * 1000) / 1000)); }; // F-0725-04: balandlik ham hisobda — past ekranda zum kattalashtirib vertikal joyni yemasin
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
  }, []);
  // Bridge qobig'ida dars ustida TopBar turadi — dars balandligi undan qolgan joyga moslanadi (--bo = yuqori chegara).
  const rootRef = useRef(null);
  useEffect(() => {
    const upd = () => { const el = rootRef.current; if (!el) return; const top = Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY)); el.style.setProperty('--bo', `${top}px`); };
    upd(); window.addEventListener('resize', upd); return () => window.removeEventListener('resize', upd);
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
    // Q1 (19.09): solo'da ballik test javobi ham serverga — bir marta; «Qaytadan» mashqida yuborilmaydi.
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

  // SCREEN_META bilan bir xil tartib (21 ekran)
  const screens = [ScreenHook, ScreenGoal, ScreenTwo, ScreenHamma, ScreenT1, ScreenCase, ScreenKarta, ScreenT2, ScreenGoya, ScreenOlx, ScreenT3, ScreenNew, ScreenSections, ScreenT4, ScreenOrder, ScreenPage, ScreenAi, ScreenPair, ScreenPodium, ScreenFlash, ScreenEnd];
  const Current = screens[screen];
  return (
    <LangContext.Provider value={lang}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,500&family=Manrope:wght@300;400;500;600;700;800&family=Fraunces:opsz,wght@9..144,400&family=JetBrains+Mono:wght@400;500;700&display=swap');

        /* Bridge sayti mustaqil (LMS yo'q) — shriftlar shu @import bilan yuklanadi. */
        html, body { margin: 0; padding: 0; }
        .lesson-root, .lesson-root * { box-sizing: border-box; }
        .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc((100dvh - var(--bo, 0px)) / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
        .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p,.lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }

        .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
        .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
        .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }

        @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; }
        @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .fade-step { animation: fade-step 0.3s ease-out; }
        .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; }

        .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
        .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }
        .feedback-block > div { border-left: none; } /* F-0925-QA16: test izohining chap rang-chizig'i olindi (boshqa xulosa bloklari o'zgarmaydi) */

        /* Jonli-nishon (LiveBadge) — xira, aralashmaydi; hoverda to'liq ko'rinadi */
        .live-badge { opacity: 0.4; transition: opacity 0.25s ease; }
        .live-badge:hover { opacity: 1; }

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
        /* Qadam 0.7s — ko'rinish oynasi ham 0.7s dan oshmasin. Umumiy 30%-li kadr 2.8s da 0.84s bo'lib, qo'shni ikki
           halqa bir lahzada yonardi (F-0925 puls-bug, B6 naqshi). Shuning uchun wv4 o'z kadri bilan. */
        .turn-wave.wv4::after { animation-name: turn-wave4; animation-duration: 2.8s; }
        @keyframes turn-wave4 { 0%, 100% { opacity: 0; } 9% { opacity: 0.7; } 25% { opacity: 0; } }
        .turn-wave.wv4.w4::after { animation-delay: 2.1s; }
        /* Navbat YURISHI: bitta qadam — paydo bo'ladi, turadi, so'nadi (bir marta). */
        .turn-step::after { animation-name: turn-step; animation-duration: 1.3s; animation-iteration-count: 1; }
        @keyframes turn-step { 0% { opacity: 0; } 20% { opacity: 0.68; } 78% { opacity: 0.68; } 100% { opacity: 0; } }
        /* Kiritish maydoni ::after qabul qilmaydi — halqa o'rovchi qatlamga qo'yiladi (layout o'zgarmaydi). */
        .turn-wrap { display: block; position: relative; }
        .turn-wrap > .reflect-input { width: 100%; }
        @media (prefers-reduced-motion: reduce) { .turn-hint, .turn-ring::after, .turn-wave.wv4::after { animation: none; } .turn-ring::after { opacity: 0; } }
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
        .mentor-ava { position: relative; display: flex; align-items: center; justify-content: center; }
        .mentor-ava img { position: absolute; inset: 0; opacity: 0; transition: opacity 0.2s; } .mentor-ava.ok img { opacity: 1; }
        .mentor-ava-fb { font-size: 21px; line-height: 1; }
        /* ⛶ Zoomable (PmLesson2 naqshi) + ustun-yorlig'i */
        .zoomable { position: relative; min-width: 0; }
        .zoom-btn { position: absolute; top: 4px; right: 4px; z-index: 6; width: 26px; height: 26px; border-radius: 8px; border: none; background: rgba(255,255,255,0.86); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoomable.zsplit > .zoom-btn { top: -11px; right: 0; } /* split o'ramida — ustun-yorlig'i qatorida, kontent ustiga tushmaydi */
        .zoom-on.zsplit > .zoom-btn, .zoom-on > .zoom-btn { top: 10px; right: 10px; }
        .split.ord-split { grid-template-columns: minmax(0,1.3fr) minmax(0,1fr); }
        /* 13-ekran: chap karta qisqa, o'ng sahifa 5 bo'lim bilan baland — sahifa ustuni kengroq, bo'lim gaplari bir qatorga sig'adi. */
        .split.sec-split { grid-template-columns: minmax(0,0.8fr) minmax(0,1.2fr); }
        @media (max-width: 760px) { .split.ord-split, .split.sec-split { grid-template-columns: 1fr; } }
        /* F-0925-QA01: kattalashgan oyna qo'shni ustun ustida emas, TAGIDA qolardi — ota element (opacity/transform animatsiyasi)
           alohida qatlam guruhi bo'lib, z-index 1001 faqat uning ichida ishlardi. Oynani o'z ichiga olgan ota-elementlar
           kattalashtirish paytida yuqori qatlamga ko'tariladi (flex/grid bolalarida z-index position'siz ham ishlaydi). */
        .lesson-root :has(.zoom-on) { z-index: 1000; }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(27,22,48,0.55); z-index: 1000; animation: fade-op 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(960px,94vw); max-height: calc(92vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.bg}; border-radius: 18px; padding: clamp(20px,3.4vw,38px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        @keyframes fade-op { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .zoom-on, .zoom-backdrop { animation: none !important; } .zoom-btn:hover { transform: none; } }
        .flow-label.flow-label { margin: 0 0 -4px; font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; padding-right: 40px; }
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

        /* === HOOK: menyu-kartochka ovoz-plitkalari === */
        /* === HOOK v3: xabar-almashtirgich + radio-variantlar (PmLesson2 andozasi) === */
        .hk-opt { display: flex; align-items: center; gap: 13px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: clamp(12px,1.8vw,15px) clamp(14px,2vw,17px); font-family: 'Manrope', sans-serif; font-weight: 500; font-size: clamp(13.5px,1.6vw,15px); color: ${T.ink}; cursor: pointer; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.16); transition: all 0.16s; }
        .hk-opt:hover:not(:disabled):not(.on) { transform: translateY(-1px); box-shadow: 0 12px 24px -8px rgba(${T.shadowBase},0.22); }
        .hk-opt.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: 0 8px 22px -8px rgba(91,61,230,0.3), inset 0 0 0 1.5px ${T.accent}; }
        .hk-opt:disabled { cursor: default; }
        .hk-opt.wait { color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .hk-radio { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; box-shadow: inset 0 0 0 2px ${T.ink3}; display: inline-flex; align-items: center; justify-content: center; transition: all 0.18s; }
        .hk-opt.on .hk-radio { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .hk-dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
        @media (prefers-reduced-motion: reduce) { .hk-opt { transition: none; } }

        .hvote { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,18px); box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }
        .hvote-row { display: flex; align-items: center; gap: 10px; }
        .hvote-lbl { flex: 0 0 clamp(120px,26vw,220px); font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; line-height: 1.3; min-width: 0; overflow-wrap: anywhere; } /* F-0727-12: eng uzun variant (45 belgi) kesilmasin — qator o'raladi */
        .hvote-row.mine .hvote-lbl { color: ${T.accent}; }
        .hvote-track { flex: 1; height: 12px; border-radius: 99px; background: ${T.bg}; overflow: hidden; }
        .hvote-fill { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); transition: width 0.6s cubic-bezier(.2,.7,.2,1); }
        .hvote-row.top .hvote-fill { background: linear-gradient(90deg, ${T.success}, #0E8A55); }
        .hvote-pct { min-width: 38px; text-align: right; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
        @media (prefers-reduced-motion: reduce) { .hvote-fill { transition: none; } }
        /* HOOK imzo-vizuali (F-0924-04): PmLesson2 Screen0 naqshi — chapda jonli sahifa, o'ngda savol-variantlar.
           Qidiruvga so'z yoziladi, e'lonlar yuklanadi; kimligi ko'rsatilmaydi (javob keyin ochiladi). */
        .split.hk-split { grid-template-columns: minmax(0,1.1fr) minmax(0,1fr); align-items: start; } /* F-0925-QA04: variantlar ham tepadan (7 dars bir qoida) */
        .hk-scene { position: relative; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .hk-scene .olx-ad { animation: hk-ad 0.45s ease-out both; }
        .hk-scene .olx-ad:nth-child(1) { animation-delay: 0.5s; } .hk-scene .olx-ad:nth-child(2) { animation-delay: 0.65s; } .hk-scene .olx-ad:nth-child(3) { animation-delay: 0.8s; } .hk-scene .olx-ad:nth-child(4) { animation-delay: 0.95s; }
        @keyframes hk-ad { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .hk-scene .olx-ad i { background: linear-gradient(100deg, ${T.bg} 35%, ${T.paper} 50%, ${T.bg} 65%); background-size: 240% 100%; animation: hk-shim 2.6s ease-in-out infinite; }
        .hk-scene .olx-ad:nth-child(2) i { animation-delay: 0.3s; } .hk-scene .olx-ad:nth-child(3) i { animation-delay: 0.6s; } .hk-scene .olx-ad:nth-child(4) i { animation-delay: 0.9s; }
        @keyframes hk-shim { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
        .hk-in { animation: fade-op 0.45s ease-out 0.12s both; }
        .hk-scene .olx-s-typed { clip-path: inset(0 100% 0 0); animation: hk-type 4.2s steps(9) infinite; }
        @keyframes hk-type { 0%, 8% { clip-path: inset(0 100% 0 0); } 60%, 88% { clip-path: inset(0 0 0 0); } 100% { clip-path: inset(0 100% 0 0); } }
        .hk-split .hk-opt { font-size: clamp(14px,1.7vw,16px); padding: clamp(13px,1.9vw,16px) clamp(15px,2.2vw,18px); }
        @media (max-width: 760px) { .hk-scene .olx-list { display: none; } } /* telefonda variantlar tezroq ko'rinsin — sxema qisqaradi */
        @media (prefers-reduced-motion: reduce) { .hk-scene .olx-ad, .hk-scene .olx-ad i, .hk-scene .olx-s-typed, .hk-in { animation: none; clip-path: none; } }

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
        .frame-warn { background: ${AMBER_SOFT}; border-radius: 12px; padding: clamp(12px,2vw,16px); }
        .verdict-lbl.verdict-lbl { margin: 0 0 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
        .verdict-note.verdict-note { margin: 8px 0 0; padding-top: 8px; border-top: 1.5px dashed ${AMBER}55; font-weight: 600; color: ${T.ink}; }
        .cc-reader.cc-reader { color: ${T.ink2}; margin: 0 0 -4px; }
        .me-bub.shrug { background: ${T.bg}; font-size: 20px; line-height: 1; padding: 3px 12px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        /* TEST (F-0924-06): PmLesson2 savol-qolipi — bitta ustun, tanlagach ixcham (izoh ichki aylantirishsiz sig'adi) */
        .stage-content.narrow:has(> .screen.qs) { max-width: 800px; }
        .screen.qs.qs-on { gap: clamp(12px,1.6vw,16px) !important; }
        .screen.qs .feedback-block.visible { margin-top: 0; }
        /* ZICH EKRAN (58-qonun; B6 naqshi): kompyuterda 1280x800 + TopBar bitta ekranga sig'adi. Matn qisqarmaydi —
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
          .lesson-root .screen.dense .orow { padding: 8px 12px; }
          .lesson-root .screen.dense .psec { padding: 8px 12px 8px 14px; }
        }
        .screen.qs .feedback-block .frame-success, .screen.qs .feedback-block .frame-soft, .screen.qs .feedback-block .frame-wait { padding: clamp(11px,1.6vw,14px) clamp(14px,2vw,18px); }
        /* Chip-solishtiruv — manba PmLesson2 2665-2667 */
        .cc-chips { display: flex; gap: 8px; flex-wrap: wrap; }
        /* F-0925-QA05 (9-ekran chizmasi): o'ng ustun yorlig'i bilan gap-karta orasidagi masofa chapdagi maydon-yorlig'i oralig'iga teng —
           karta chapdagi birinchi maydon bilan bir balandlikdan boshlanadi */
        @media (min-width: 761px) { .split > .col > .flow-label:has(+ .gsent) { margin-bottom: -9px; } }
        .cc-ghost { visibility: hidden; pointer-events: none; } /* F-0925-QA05: joy egallaydi, ko'rinmaydi, bosilmaydi */
        @media (max-width: 760px) { .cc-ghost { display: none; } } /* telefonda ustunlar ustma-ust — nusxa kerak emas */
        .chip { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(13px,1.6vw,15px); display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: 99px; border: none; background: ${T.paper}; color: ${T.ink}; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.2); }
        .chip:hover:not(:disabled) { transform: translateY(-1px); }
        .chip-on { background: ${T.accent}; color: #fff; box-shadow: 0 6px 16px -5px rgba(91,61,230,0.4); }
        @media (prefers-reduced-motion: reduce) { .chip:hover:not(:disabled) { transform: none; } }

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
        .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; } .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; } .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; background: none; padding: 0; }
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
        /* Slayd ichidagi boshqaruv (PmLesson1 k-nav) + Garvard fotosi (PmLesson1 3892-3893) */
        .k-nav { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 4px; }
        .k-prev.btn-soft { padding: 9px 16px; font-size: 13.5px; border-radius: 10px; }
        .k-next { border: none; border-radius: 10px; padding: 9px 18px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13.5px; cursor: pointer; }
        .k-fig { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; }
        .k-photo { display: block; width: min(360px, 100%); height: clamp(120px,18vw,180px); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.4); }
        .k-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .k-photo.emo { display: flex; align-items: center; justify-content: center; }
        .k-cap { font-family: 'Manrope', sans-serif; font-size: 12.5px; color: ${T.ink3}; }

        /* === 🎲 KEYS-TAXMIN (s4) — slayd oldidan mikro-tikish; BALL EMAS, sof o'yin === */
        .kp-bet { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        /* F-0925-QA08: taxmin kartasi tepasidagi binafsha kesik chiziq olindi (foydalanuvchi: «siniq chiziq kerak emas», 7 dars) */
        /* Taxmin tanlangach karta ixchamlashadi (javob + natija bir qatorda) — voqea slaydi va uning boshqaruvi ekranga sig'adi */
        .kp-bet.done { flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 16px 20px 14px; }
        .kp-bet.done > .k-slide-eyebrow, .kp-bet.done .kp-chip.locked:not(.correct) { display: none; }
        .kp-bet.done .kp-chips { display: contents; }
        /* Voqea-slayd: rasm (yoki emoji) chapda, matn va boshqaruv o'ngda — slayd balandligi past, xulosa ekranga sig'adi */
        .k-slide.ph { padding: clamp(18px,2.6vw,26px) clamp(18px,3vw,30px); min-height: clamp(190px,26vh,230px); display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.15fr); column-gap: clamp(16px,2.5vw,28px); row-gap: 8px; align-items: center; text-align: left; }
        .k-slide.ph > .k-fig { grid-column: 1; grid-row: 1 / span 4; }
        .k-slide.ph > :not(.k-fig) { grid-column: 2; justify-self: start; }
        .k-slide.ph .k-nav { justify-content: flex-start; }
        @media (max-width: 760px) { .k-slide.ph { display: flex; flex-direction: column; text-align: center; } .k-slide.ph > :not(.k-fig) { justify-self: auto; } }
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
        .kp-chip.wrong { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; }
        .kp-chip.wrong:hover { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .kp-chip.locked:not(.correct):not(.wrong) { opacity: 0.5; }
        .kp-mark { font-weight: 900; font-size: 15px; }
        /* === TEST-SAVOL (idea_oll tartibi): katta savol + toza kartochka === */
        .tq { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .tq-lead { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(14.5px,1.8vw,16px); line-height: 1.5; color: ${T.ink2}; }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; margin: 0; color: ${T.ink}; }
        .opt-abc { width: 27px; height: 27px; border-radius: 50%; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; background: ${T.accentSoft}; color: ${T.accent}; transition: background 0.2s, color 0.2s; }
        .opt-abc.ok { background: ${T.success}; color: #fff; }
        .opt-abc.bad { background: ${T.err}; color: #fff; }
        .opt-abc.dim { background: ${T.bg}; color: ${T.ink3}; }
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

        /* muvaffaqiyat = ixcham chip (paragraf-ramka EMAS) */
        .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
        .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }

        /* === YAKUNIY SO'Z — 3 qadam oqimi === */
        .rcp-flow { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(12px,2vw,18px); align-items: stretch; }
        @media (max-width: 760px) { .rcp-flow { grid-template-columns: 1fr; } }
        .rcp-step { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 12px; }
        .rcp-step.wide { grid-column: 1 / -1; }
        .rcp-step-h { display: flex; gap: 11px; align-items: flex-start; }
        .rcp-n { width: 26px; height: 26px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 5px 12px -5px rgba(91,61,230,0.5), 0 0 0 3px ${T.accentSoft}; }
        .rcp-t { display: block; font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
        .pair-timer { background: ${T.bg}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 10px; box-shadow: inset 0 0 0 1.5px ${T.line}; margin-top: auto; }
        .pair-now { font-family: 'Manrope'; font-weight: 700; font-size: 14px; color: ${T.ink2}; line-height: 1.45; }
        .pair-who { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 8px; background: ${T.accent}; color: #fff; font-weight: 800; font-size: 13px; vertical-align: middle; }
        .pair-who.b { background: ${T.success}; }
        .pair-live { display: flex; align-items: center; gap: 15px; }
        .pair-ring { position: relative; width: 82px; height: 82px; flex-shrink: 0; }
        .pair-ring-mid { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; }
        .pair-ring-who { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; background: ${T.accent}; color: #fff; font-weight: 800; font-size: 14px; }
        .pair-ring-who.b { background: ${T.success}; }
        .pair-ring-sec { font-family: 'JetBrains Mono'; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 15px; color: ${T.ink}; font-variant-numeric: tabular-nums; margin-top: 2px; }
        .pair-live-txt { display: flex; flex-direction: column; gap: 3px; }
        .pair-next { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; }
        .pair-timer-btns { display: flex; gap: 8px; }
        /* F-0727-43: boshlash-tugmasi pulsli CTA — o'quvchi uni sezmasdan o'tib ketmasin */
        .pair-start { font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 12px; padding: 12px 22px; background: linear-gradient(135deg, ${T.accent}, ${T.accentVivid}); color: #fff; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.5); animation: pair-start-pulse 1.6s ease-in-out infinite; transition: transform 0.15s; }
        .pair-start:hover { transform: translateY(-2px); }
        @keyframes pair-start-pulse { 0%, 100% { box-shadow: 0 10px 24px -8px rgba(91,61,230,0.5), 0 0 0 0 rgba(110,75,255,0.45); } 50% { box-shadow: 0 12px 28px -8px rgba(91,61,230,0.6), 0 0 0 12px rgba(110,75,255,0); } }
        .pair-start.calm { animation: none; }
        @media (prefers-reduced-motion: reduce) { .pair-start { animation: none; } }
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
        .pod-row-score { min-width: 34px; text-align: right; font-size: 12.5px; font-weight: 700; color: ${T.ink}; }

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

        .swed-hint.swed-hint { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13px; line-height: 1.45; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .swed-btns { display: flex; gap: 12px; justify-content: flex-end; align-items: center; }
        .swed-save { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 12px; padding: 13px 26px; background: ${T.accent}; color: #fff; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.55); transition: all 0.18s; }
        .swed-save:hover:not(:disabled) { background: ${T.accentVivid}; transform: translateY(-1px); }
        .swed-save:disabled { background: ${T.accentSoft}; color: ${T.accent}; opacity: 0.55; box-shadow: none; cursor: not-allowed; transform: none; }

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


        /* =================== BRIDGE B1 — dars-xos qatlam (OLX sxemasi, karta → sahifa) =================== */
        /* 🔴 OVERFLOW-HIMOYA: o'quvchi kiritmasi ko'rinadigan har konteynerda min-width 0 + overflow-wrap anywhere */
        .bf, .gsent, .gs-slot, .mp-sec, .mp-head, .mp-txt, .mp-btn, .acard-txt, .psec-txt, .orow-txt, .pr-body, .idea, .gl-txt, .gl-sec-fill, .hm-head { min-width: 0; overflow-wrap: anywhere; }
        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        /* Brauzer-ramka — manzil-qatori bo'sh, brend yo'q */
        .bf { background: ${T.paper}; border-radius: 16px; box-shadow: 0 14px 34px -16px rgba(${T.shadowBase},0.3), 0 0 0 1px ${T.line}; overflow: hidden; }
        .bf-bar { display: flex; align-items: center; gap: 12px; padding: 9px 12px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .bf-url { flex: 1; height: 16px; border-radius: 99px; background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; display: flex; align-items: center; padding: 0 10px; overflow: hidden; }
        .bf-url-t { font-size: 10.5px; color: ${T.ink2}; line-height: 1; white-space: nowrap; }
        .bf-body { padding: clamp(12px,1.8vw,16px); display: flex; flex-direction: column; gap: 10px; }

        /* === OLX SXEMASI (brendsiz) — sarlavha-chizig'i · katta qidiruv · dumaloq kategoriyalar · e'lonlar === */
        .olx-bar { display: flex; align-items: center; gap: 10px; margin: -2px 0 2px; }
        .olx-logo { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 17px; letter-spacing: 0.02em; color: ${T.ink}; line-height: 1; }
        .olx-ics { display: flex; gap: 7px; margin-left: auto; } .olx-ics i { width: 20px; height: 20px; border-radius: 50%; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .olx-elon, .olx-search, .olx-cats { font-family: 'Manrope', sans-serif; border: none; cursor: default; transition: box-shadow 0.18s, transform 0.18s, background 0.18s; position: relative; }
        .olx-elon { font-weight: 800; font-size: 12.5px; padding: 8px 13px; border-radius: 9px; background: ${T.accent}; color: #fff; box-shadow: 0 6px 14px -6px rgba(91,61,230,0.6); white-space: nowrap; }
        .olx button.olx-elon:disabled { color: #fff; }
        .olx-search { display: flex; align-items: center; gap: 10px; width: 100%; min-height: 50px; padding: 0 14px; border-radius: 12px; background: ${T.paper}; box-shadow: inset 0 0 0 2px ${T.ink3}77; }
        .olx-s-ic { font-size: 17px; }
        .olx-s-q { flex: 1; min-width: 0; text-align: left; font-family: 'Manrope', sans-serif; font-size: 13.5px; white-space: nowrap; overflow: hidden; }
        .olx-s-ph { color: ${T.ink3}; font-weight: 500; } .olx-s-typed { display: inline-block; color: ${T.ink}; font-weight: 600; }
        .olx-s-geo { display: flex; align-items: center; gap: 5px; padding-left: 10px; border-left: 1.5px solid ${T.line}; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600; color: ${T.ink2}; white-space: nowrap; }
        .olx-cats { display: grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap: 4px; padding: 8px 6px 7px; border-radius: 12px; background: ${T.bg}; width: 100%; }
        .olx-cat { display: flex; flex-direction: column; align-items: center; gap: 5px; }
        .olx-cat-ic { display: flex; align-items: center; justify-content: center; width: clamp(30px,3.6vw,40px); height: clamp(30px,3.6vw,40px); border-radius: 50%; background: ${T.paper}; font-size: clamp(14px,1.7vw,18px); box-shadow: 0 3px 8px -4px rgba(${T.shadowBase},0.25); }
        .olx-cat-t { font-family: 'Manrope', sans-serif; font-size: 10px; font-weight: 700; color: ${T.ink2}; line-height: 1.1; white-space: nowrap; }
        .olx-list { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 8px; }
        .olx-ad { display: flex; flex-direction: column; gap: 4px; padding: 5px; border-radius: 10px; box-shadow: inset 0 0 0 1px ${T.line}; } .olx-ad i { display: flex; align-items: center; justify-content: center; aspect-ratio: 4 / 3; border-radius: 7px; background: ${T.bg}; font-style: normal; } .olx-ad-ic { font-size: clamp(18px,2.2vw,24px); line-height: 1; } .olx-ad-t { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 700; color: ${T.ink}; line-height: 1.15; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .olx-ad-p { font-size: 10px; font-weight: 700; color: ${T.accent}; white-space: nowrap; }
        .olx-ad.sk i { aspect-ratio: 16 / 9; } .olx-ad b { display: block; height: 6px; border-radius: 99px; background: ${T.ink3}66; width: 55%; } .olx-ad b.s { width: 85%; background: ${T.line}; }
        .olx button:disabled { color: inherit; opacity: 1; }
        .olx.roomy .bf-body { gap: 12px; } .olx.roomy .olx-search { min-height: 54px; } .olx.roomy .olx-cats { padding: 9px 6px 8px; } /* 10-ekran: sxema — ekranning asosiy maketi, pastda bo'sh joy qolmasin */
        .olx .pick { cursor: pointer; } .olx .pick:hover { transform: translateY(-2px); } .olx .pick:active { transform: translateY(0) scale(0.98); }
        .olx .lit { box-shadow: inset 0 0 0 2.5px ${T.accent}, 0 0 0 5px ${T.accentSoft}; background: ${T.accentSoft}; animation: olx-lit 1.6s ease-out 1; z-index: 3; }
        .olx .olx-elon.lit { background: ${T.accent}; box-shadow: 0 0 0 3px ${T.paper}, 0 0 0 6px ${T.accent}, 0 8px 18px -6px rgba(91,61,230,0.6); }
        .olx .lit::before { content: '👆'; position: absolute; right: 10%; bottom: -16px; font-size: 20px; line-height: 1; z-index: 2; animation: olx-tap 1.1s ease-in-out infinite; pointer-events: none; }
        .olx .olx-elon.lit::before { right: 50%; bottom: -24px; transform: translateX(50%); }
        @keyframes olx-lit { 0% { box-shadow: inset 0 0 0 2.5px ${T.accent}, 0 0 0 0 rgba(91,61,230,0.45); } 100% { box-shadow: inset 0 0 0 2.5px ${T.accent}, 0 0 0 5px ${T.accentSoft}; } }
        @keyframes olx-tap { 0%, 100% { translate: 0 0; } 50% { translate: 0 -5px; } }
        /* Tozalik (111-qonun): ko'rilgan joy burchagidagi ✓ nishoni olindi — ko'rilganini yashil ①②③ raqami va o'ng ustundagi ✓ allaqachon aytadi. */
        @media (prefers-reduced-motion: reduce) { .olx .lit, .olx .lit::before { animation: none; } .olx .pick:hover { transform: none; } }
        /* 10-ekran o'ng ustuni — IZOH, tugma emas: ko'rilmaguncha soyasiz, uzuq hoshiyali bo'sh joy (bosiladigandek ko'rinmasin) */
        .spot { background: transparent; border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; box-shadow: inset 0 0 0 1.5px ${T.line}; cursor: pointer; opacity: 0.7; transition: opacity 0.2s, box-shadow 0.2s, background 0.2s; }
        button.spot { width: 100%; text-align: left; font: inherit; color: inherit; border: none; }
        button.spot:not(.seen) { border: 1.5px dashed ${T.ink3}; opacity: 1; background: ${T.paper}; }
        button.spot { transition: opacity 0.2s, box-shadow 0.2s, background 0.2s, transform 0.16s; }
        button.spot:hover { box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
        /* F-0924-08: yorliq-karta TUGMA ekani ko'rinsin — hover'da ko'tariladi, bosilganda cho'kadi (sxemadagi .pick bilan bir xil) */
        button.spot:not(.on):hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}88, 0 10px 20px -10px rgba(${T.shadowBase},0.32); }
        button.spot:active { transform: translateY(0) scale(0.985); }
        @media (prefers-reduced-motion: reduce) { button.spot, button.spot:hover, button.spot:active { transition: none; transform: none; } }
        button.spot:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .spot-lbl { display: inline-flex; align-items: center; gap: 8px; }
        .spot-num, .olx-mk { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 800; line-height: 1; flex-shrink: 0; }
        .spot-num.on, .olx-mk.on { background: ${T.success}; }
        .olx-mk { position: absolute; top: -9px; left: -9px; z-index: 4; box-shadow: 0 0 0 2px ${T.paper}; pointer-events: none; }
        .spot:not(.seen) { box-shadow: none; border: 1.5px dashed ${T.line}; }
        .spot.seen { opacity: 1; background: ${T.paper}; } .spot.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 8px 20px -8px rgba(91,61,230,0.3); }
        .spot-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; } .spot.seen .spot-lbl { color: ${T.success}; }
        .spot-t { font-size: clamp(13.5px,1.6vw,15px); color: ${T.ink2}; line-height: 1.45; }

        /* === MAQSAD: karta → sahifa (CSS-taymlayn, imzo-vizual) ===
           1) qatorlar kartada bittalab «yoziladi» (--fd, clip-path) · 2) har qator kartadan chiqib o'ng tomondagi
           o'z bo'limiga uchib tushadi (--fly), kartada faqat yorliq + ✓ qoladi · 3) oxirida tugma paydo bo'ladi.
           Bo'lim chap hoshiyasi — qator rangi (KIM=ko'k · MUAMMO=amber · YECHIM=yashil): qaysi qator qayerga tushgani ko'rinadi.
           Reduced-motion: harakatsiz yakuniy holat (kartada yorliq + ✓, matn sahifada). */
        .gl-stage { --fx: -150px; --fy: 0px; --lx: 48px; --ly: 0px; display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1.25fr); gap: clamp(10px,2vw,20px); align-items: start; } /* F-0925-QA05: karta tepadan (sahifa bilan bir chiziq) */
        @media (max-width: 760px) { .gl-stage { --fx: 0px; --fy: -70px; --lx: 0px; --ly: 26px; grid-template-columns: 1fr; } .gl-arrow { transform: rotate(90deg); justify-self: center; } }
        .gl-card, .acard { background: ${T.paper}; border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 12px 30px -14px rgba(${T.shadowBase},0.28); } /* F-0925-QA05: binafsha chap chiziq olindi (foydalanuvchi chizmasi — «bekorga rang», «juda baland») */
        .gl-card { gap: 6px; }
        .gl-row { display: flex; flex-direction: column; gap: 2px; opacity: 0; animation: gl-in 0.45s ease-out forwards, gl-ping 0.8s ease-out; animation-delay: var(--fd), var(--fly); border-radius: 8px; padding: 5px 8px; }
        .gl-lbl, .acard-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; letter-spacing: 0.08em; display: inline-flex; align-items: center; gap: 6px; }
        .gl-ck { display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; font-size: 9px; letter-spacing: 0; opacity: 0; animation: gl-pop 0.35s cubic-bezier(.3,1.6,.5,1) calc(var(--fly) + 0.45s) forwards; }
        .gl-txt { font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; line-height: 1.35; max-height: 4.2em; overflow: hidden; clip-path: inset(0 100% 0 0); animation: gl-write 0.65s steps(22, end) var(--fd) forwards, gl-leave 0.55s cubic-bezier(.5,0,.8,.4) var(--fly) forwards; }
        .gl-arrow { font-size: 26px; color: ${T.accent}; opacity: 0; animation: gl-in 0.4s ease-out 2.6s forwards, gl-nudge 0.8s ease-in-out 3s 3; }
        .gl-page.bf { overflow: visible; } .gl-page .bf-bar { border-radius: 16px 16px 0 0; }
        .gl-sec { position: relative; min-height: 30px; border-radius: 10px; background: ${T.bg}; padding: 8px 10px 8px 12px; display: flex; align-items: center; box-shadow: none; animation: gl-land 0.7s ease-out calc(var(--fly, 0s) + 0.5s) both; }
        .gl-sec.big { min-height: 50px; }
        .gl-sec.ghost { background: transparent; box-shadow: inset 0 0 0 1.5px ${T.line}; animation: none; } .gl-ghost-t { font-family: 'Manrope'; font-size: 12.5px; font-style: italic; color: ${T.ink3}; }
        .gl-sec.btn { background: transparent; justify-content: flex-end; padding: 0; box-shadow: none; animation: none; }
        .gl-sec-fill { opacity: 0; font-family: 'Manrope'; font-size: 13.5px; color: ${T.ink}; line-height: 1.35; animation: gl-fly 0.75s cubic-bezier(.2,.8,.2,1) calc(var(--fly) + 0.2s) forwards; }
        .gl-sec.big .gl-sec-fill { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(15px,1.9vw,18px); }
        .gl-btn-shape { display: inline-flex; align-items: center; padding: 8px 15px; font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: #fff; border-radius: 9px; background: ${T.accent}; opacity: 0; animation: gl-pop 0.45s cubic-bezier(.3,1.6,.5,1) forwards; animation-delay: var(--fd); box-shadow: 0 8px 18px -8px rgba(91,61,230,0.6); }
        @keyframes gl-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes gl-write { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
        @keyframes gl-leave { 0% { opacity: 1; transform: none; } 60% { opacity: 0; transform: translate(var(--lx), var(--ly)); max-height: 4.2em; } 100% { opacity: 0; transform: translate(var(--lx), var(--ly)); max-height: 0; } }
        @keyframes gl-fly { from { opacity: 0; transform: translate(var(--fx), var(--fy)) scale(0.9); } 45% { opacity: 1; } to { opacity: 1; transform: none; } }
        @keyframes gl-land { 0%, 60% { background: ${T.bg}; } 75% { background: ${T.accentSoft}; } 100% { background: ${T.bg}; } }
        @keyframes gl-pop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: none; } }
        @keyframes gl-nudge { 0%, 100% { translate: 0 0; } 50% { translate: 6px 0; } }
        @keyframes gl-ping { 0% { background: ${T.accentSoft}; } 100% { background: transparent; } }
        @media (max-width: 760px) { @keyframes gl-nudge { 0%, 100% { translate: 0 0; } 50% { translate: 0 6px; } } }
        @media (prefers-reduced-motion: reduce) { .gl-row, .gl-txt, .gl-ck, .gl-sec, .gl-sec-fill, .gl-arrow, .gl-btn-shape { animation: none; opacity: 1; clip-path: none; } .gl-txt { display: none; } }

        /* === ODAM-KARTALARI (3 · 4-ekran) === */
        .person { position: relative; display: flex; align-items: center; gap: 14px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 16px; padding: clamp(14px,2vw,18px); font-family: 'Manrope', sans-serif; cursor: pointer; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.22); transition: box-shadow 0.2s, transform 0.2s, opacity 0.2s; }
        .person:hover { transform: translateY(-2px); }
        .person.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 24px -10px rgba(91,61,230,0.35); }
        .person-ic { font-size: clamp(28px,4vw,38px); line-height: 1; }
        .person-t { flex: 1; font-weight: 700; font-size: clamp(14.5px,1.8vw,17px); color: ${T.ink}; line-height: 1.35; }
        .person-ck { color: ${T.success}; font-weight: 800; }
        .person.big { cursor: default; flex-direction: column; text-align: center; padding: clamp(20px,3vw,30px); }
        .person.big:hover { transform: none; }
        .person.dim { opacity: 0.5; }
        .person.me { box-shadow: inset 0 0 0 2.5px ${T.success}, 0 12px 28px -10px rgba(18,169,104,0.4); }
        .me-bub { font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: #fff; background: ${T.success}; border-radius: 99px; padding: 5px 14px; }
        .me-bub.q { background: ${T.accentSoft}; color: ${T.accent}; }
        .hm-head { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(18px,2.6vw,24px); color: ${T.ink}; line-height: 1.25; }
        .hm-cta .orow-btn.dim { background: ${T.ink3}; }

        /* === KARTANI YIG'ING (7) === */
        .kq { display: flex; flex-direction: column; gap: 9px; }
        .kq-step { font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.1em; }
        .kq-opt { padding: clamp(12px,1.8vw,15px) clamp(14px,2vw,18px); font-size: clamp(14.5px,1.8vw,16px); display: flex; align-items: center; gap: 12px; }
        .kq-why.kq-why { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; line-height: 1.45; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        .acard-row { display: flex; flex-direction: column; gap: 3px; padding: 8px 10px; border-radius: 10px; background: ${T.bg}; transition: background 0.25s; }
        .acard-row.cur { box-shadow: inset 0 0 0 1.5px ${T.accent}55; }
        .acard-row.on { background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .acard-row.fly { animation: gl-ping 0.9s ease-out; box-shadow: inset 0 0 0 2px ${T.accent}; }
        /* 13-ekran: qator o'z bo'limiga «uchib» ketgach kartada faqat yorliq + ✓ qoladi (2-ekran imzosining davomi) */
        .acard-row.sent { box-shadow: inset 0 0 0 1px ${T.line}; }
        .acard-row.sent .acard-txt { --lx: 40px; --ly: 0px; max-height: 4.2em; overflow: hidden; animation: gl-leave 0.55s cubic-bezier(.5,0,.8,.4) 0.1s forwards; }
        @media (max-width: 760px) { .acard-row.sent .acard-txt { --lx: 0px; --ly: 24px; } }
        .gl-ck.on { opacity: 1; animation: gl-pop 0.35s cubic-bezier(.3,1.6,.5,1); }
        .acard-txt { font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; line-height: 1.35; }

        /* === YOZISH-MAYDONLARI (9 · 16 · 17) === */
        .bfield { display: flex; flex-direction: column; gap: 5px; border-radius: 12px; }
        .bfield.turn-ring::after { inset: -4px; border-radius: 14px; }
        .bfield-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.08em; }
        .bfield input { font-family: 'Manrope'; font-weight: 500; font-size: 15px; color: ${T.ink}; border: none; border-radius: 10px; padding: 12px 14px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; width: 100%; transition: box-shadow 0.18s; }
        .bfield input:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .bfield.on input { box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .ideas { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
        .ai-alts { display: flex; flex-direction: column; gap: 8px; }
        .idea { display: flex; flex-direction: column; gap: 3px; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 10px 12px; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},0.2); transition: box-shadow 0.18s, transform 0.18s; }
        .idea:hover { transform: translateY(-1px); }
        .idea b { font-size: 13px; color: ${T.accent}; } .idea span { font-size: 13.5px; color: ${T.ink2}; line-height: 1.35; }
        .idea.wide span { color: ${T.ink}; font-weight: 600; }
        .idea.on { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .gsent { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,2.4vw,22px); box-shadow: 0 12px 30px -14px rgba(${T.shadowBase},0.26); }
        .gsent-p.gsent-p { margin: 0; font-family: 'Source Serif 4', serif; font-size: clamp(16px,2.1vw,19px); line-height: 1.7; color: ${T.ink}; }
        .gs-slot { font-weight: 600; padding: 1px 6px; border-radius: 6px; background: ${T.bg}; color: ${T.ink3}; }
        .gs-slot.on.kim { color: ${T.blue}; background: ${T.blueSoft}; } .gs-slot.on.muammo { color: ${AMBER}; background: ${AMBER_SOFT}; } .gs-slot.on.yechim { color: ${T.success}; background: ${T.successSoft}; }
        .lead-note.lead-note { margin: 0; font-size: clamp(14px,1.7vw,16px); line-height: 1.5; color: ${T.ink2}; }

        /* === YANGI SAYT (12) === */
        .nw-top { min-height: 58px; display: flex; align-items: center; }
        .nw-s { cursor: default; }
        .nw-list { grid-template-columns: repeat(2, minmax(0,1fr)); }
        .nw-slots { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .nw-slot { display: flex; flex-direction: column; gap: 3px; padding: 9px 10px; border-radius: 10px; background: ${T.bg}; font-family: 'Manrope'; font-size: 12.5px; color: ${T.ink2}; }
        .nw-slot b { font-size: 11.5px; font-weight: 800; color: ${T.ink3}; }
        .nw-slot.free { background: ${T.successSoft}; color: ${T.ink}; } .nw-slot.free b { color: ${T.success}; }
        .visitor { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; min-height: 180px; background: ${T.paper}; border-radius: 16px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.22); animation: fade-step 0.3s ease-out; }
        .visitor-ic { font-size: 54px; line-height: 1; }
        .visitor.leave .visitor-ic { animation: nw-leave 1.6s ease-in 0.9s forwards; }
        .visitor-door { position: absolute; right: 18px; bottom: 16px; font-size: 30px; }
        .visitor-ok { position: absolute; top: 14px; right: 14px; width: 26px; height: 26px; border-radius: 50%; background: ${T.success}; color: #fff; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; animation: gl-pop 0.35s cubic-bezier(.3,1.6,.5,1); }
        .visitor.stay { box-shadow: inset 0 0 0 2.5px ${T.success}, 0 12px 28px -10px rgba(18,169,104,0.35); }
        @keyframes nw-leave { to { transform: translateX(90px); opacity: 0.15; } }
        @media (prefers-reduced-motion: reduce) { .visitor.leave .visitor-ic { animation: none; opacity: 0.4; } .visitor, .visitor-ok { animation: none; } }

        /* === SAHIFA BO'LIMLARI (13 · 15 · 16) === */
        .psec { display: flex; flex-direction: column; gap: 4px; text-align: left; width: 100%; border: none; border-radius: 12px; padding: 10px 12px 10px 14px; background: ${T.bg}; font-family: 'Manrope', sans-serif; cursor: pointer; transition: box-shadow 0.2s, background 0.2s, transform 0.18s; position: relative; }
        .psec:not(:disabled):hover { transform: translateY(-2px); }
        .sec-page.bf, .ord-page.bf { overflow: visible; } .sec-page .bf-bar, .ord-page .bf-bar { border-radius: 16px 16px 0 0; }
        .psec.locked { cursor: default; opacity: 0.45; }
        .psec.open { background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .psec.cur { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .psec-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink3}; }
        .psec-txt { font-size: clamp(14px,1.7vw,15.5px); color: ${T.ink}; line-height: 1.35; font-weight: 600; }
        .psec.blok .psec-txt { font-family: 'Source Serif 4', serif; font-size: clamp(16px,2vw,19px); }
        .sec-page { --fx: -140px; --fy: 0px; }
        @media (max-width: 760px) { .sec-page { --fx: 0px; --fy: -60px; } }
        .psec-txt.fly-in { animation: gl-fly 0.6s cubic-bezier(.2,.8,.2,1); }
        @media (prefers-reduced-motion: reduce) { .psec-txt.fly-in, .acard-row.fly, .gl-ck.on { animation: none; } .acard-row.sent .acard-txt { animation: none; display: none; } .psec:not(:disabled):hover { transform: none; } }
        .psec-note { font-size: 12.5px; color: ${T.accent}; font-weight: 600; }
        .orow { display: grid; grid-template-columns: auto minmax(128px, max-content) minmax(0,1fr) auto; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; background: ${T.bg}; cursor: grab; transition: box-shadow 0.2s, background 0.2s, opacity 0.2s, transform 0.18s; user-select: none; box-shadow: none; }
        .orow:hover { transform: translateY(-1px); } .orow:active { cursor: grabbing; }
        .orow.blok .orow-txt { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: 15px; }
        .orow-ic { font-size: 13px; margin-right: 6px; letter-spacing: 0; }
        .orow-btn { display: inline-block; font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: #fff; background: ${T.accent}; border-radius: 8px; padding: 6px 12px; }
        .orow:focus-visible { outline: 2px solid ${T.accent}; }
        .orow.sel { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; transform: translateY(-2px); }
        .orow.passed { background: ${T.successSoft}; }
        .orow.here { box-shadow: inset 0 0 0 2px ${T.blue}; }
        .orow-reader { animation: fade-step 0.25s ease-out; }
        @media (prefers-reduced-motion: reduce) { .orow, .orow.sel, .orow:hover { transition: none; transform: none; } .orow-reader { animation: none; } }
        .orow.stop { box-shadow: inset 0 0 0 2px ${AMBER}; background: ${AMBER_SOFT}; } /* sotuvchi TUSHUNMAGAN joy — hukm amber (ChipCompare frame-warn bilan bir oila), qizil emas */
        .orow-grip { color: ${T.ink3}; font-size: 16px; }
        /* F-0925-B01 silliq sudrash: telefonda tutqich sahifa-aylantirishni olmaydi; sudralayotgan bo'lim ko'tariladi (soya), qolganlari yumshoq suriladi */
        .ord-page .orow-grip { touch-action: none; cursor: grab; padding: 8px 6px; margin: -8px -6px; }
        .ord-page.dragging, .ord-page.dragging .orow { cursor: grabbing; }
        .ord-page.dragging .orow { transition: transform 0.2s cubic-bezier(.2,.8,.2,1), box-shadow 0.2s, background 0.2s; }
        .ord-page.dragging .orow.lift { position: relative; z-index: 3; transition: box-shadow 0.2s, background 0.2s; box-shadow: 0 14px 30px -8px rgba(${T.shadowBase},0.35); }
        @media (prefers-reduced-motion: reduce) { .ord-page.dragging .orow { transition: none; } }
        .orow-lbl { display: flex; align-items: center; font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
        .orow-txt { font-size: 14px; color: ${T.ink}; line-height: 1.35; }
        .orow-mat { font-size: 13.5px; color: ${T.ink2}; line-height: 1.35; }
        .orow.passed .orow-mat { color: ${T.ink}; }
        .rd-panel { display: flex; flex-direction: column; gap: 12px; background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 12px 30px -14px rgba(${T.shadowBase},0.28), 0 0 0 1px ${T.line}; transition: border-color 0.3s; }
        .rd-panel.ok { } .rd-panel.bad { }
        .rd-who { display: flex; align-items: center; gap: 12px; min-height: 44px; }
        .rd-face { font-size: 34px; line-height: 1; }
        .rd-face.walk { animation: rd-hop 0.5s cubic-bezier(.34,1.4,.4,1); }
        @keyframes rd-hop { 0% { transform: translateY(0); } 40% { transform: translateY(-7px); } 100% { transform: translateY(0); } }
        .rd-bub { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.blue}; background: ${T.blueSoft}; border-radius: 99px; padding: 6px 14px; white-space: nowrap; }
        .rd-bub.idle { color: ${T.ink3}; background: ${T.bg}; letter-spacing: 0.1em; }
        .rd-panel.ok .rd-bub { color: ${T.success}; background: ${T.successSoft}; } .rd-panel.bad .rd-bub { color: ${AMBER}; background: ${AMBER_SOFT}; }
        .rd-track { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 6px; }
        .rd-seg { position: relative; display: flex; align-items: center; justify-content: center; height: 38px; border-radius: 10px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: background 0.25s, box-shadow 0.25s; }
        .rd-ic { font-size: 17px; line-height: 1; opacity: 0.55; }
        .rd-seg.done { background: ${T.successSoft}; box-shadow: none; } .rd-seg.done .rd-ic { opacity: 1; }
        .rd-seg.here { background: ${T.blueSoft}; box-shadow: inset 0 0 0 2px ${T.blue}; animation: rd-read 0.65s ease-in-out infinite alternate; } .rd-seg.here .rd-ic { opacity: 1; }
        @keyframes rd-read { from { transform: translateY(0); } to { transform: translateY(-2px); } }
        .rd-seg.stop { background: ${AMBER_SOFT}; box-shadow: inset 0 0 0 2px ${AMBER}; } .rd-seg.stop .rd-ic { opacity: 1; }
        .rd-ck { position: absolute; top: -6px; right: -6px; width: 16px; height: 16px; border-radius: 50%; background: ${T.success}; color: #fff; font-size: 9px; font-weight: 800; display: flex; align-items: center; justify-content: center; animation: gl-pop 0.35s cubic-bezier(.3,1.6,.5,1); }
        .cr-conf { display: flex; align-items: center; gap: 9px; }
        .cr-conf-lbl { font-family: 'Manrope'; font-weight: 700; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink2}; }
        .cr-conf-track { flex: 1; height: 8px; background: ${T.line}; border-radius: 99px; overflow: hidden; }
        .cr-conf-fill { display: block; height: 100%; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); border-radius: 99px; transition: width 0.5s cubic-bezier(.34,1.2,.4,1); }
        .cr-conf-fill.ok { background: ${T.success}; }
        .cr-conf-n { font-size: 12px; color: ${T.ink2}; font-variant-numeric: tabular-nums; }
        @media (prefers-reduced-motion: reduce) { .rd-face.walk, .rd-seg.here, .rd-ck { animation: none; } .rd-seg, .cr-conf-fill, .rd-panel { transition: none; } }
        .orow-reader { font-size: 20px; }
        @media (max-width: 640px) { .orow { grid-template-columns: auto minmax(0,1fr) auto; } .orow-txt { grid-column: 2 / 3; } }
        .mp-sec { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px 10px 14px; border-radius: 12px; background: ${T.bg}; box-shadow: none; }
        .mp-sec.blok { background: ${T.accentSoft}; }
        .mp-sec.ghost { background: transparent; border: 1.5px dashed ${T.line}; } .mp-sec.ghost .mp-txt { color: ${T.ink3}; font-style: italic; }
        .mp-sec.btn { background: transparent; align-items: flex-start; padding: 4px 0 0; }
        .mp-head { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(17px,2.2vw,21px); color: ${T.ink}; line-height: 1.3; }
        .mp-txt { font-size: 14px; color: ${T.ink}; line-height: 1.4; }
        .mp-btn { display: inline-block; max-width: 100%; font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: #fff; background: ${T.accent}; border-radius: 10px; padding: 10px 18px; }

        /* === AI QADAMI (17) — AiStep. Manba DeployLesson 3314-3340, 3416-3431; aksent bridge binafshasi === */
        .ais { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .pr-panel { display: flex; flex-direction: column; background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); }
        .pr-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 13px; border-bottom: 1px solid ${T.line}; }
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

        /* === 🏅 AchRule (151-qonun) === */
        .ach-rule { margin: 8px 0 0; text-align: center; font-size: 13px; line-height: 1.4; color: ${T.ink2}; }
        .ach-rule.lost { font-style: italic; }
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
