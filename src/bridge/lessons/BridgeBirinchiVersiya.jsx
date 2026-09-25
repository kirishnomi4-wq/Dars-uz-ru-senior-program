import React, { useState, useEffect, useRef, useMemo, createContext, useContext, useCallback } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// BRIDGE (O'TISH) · 2-o'tish 3-darsi — «BIRINCHI VERSIYA VA UNI KO'RSATISH» (eMaktab · Instagram keysi · tinglovchi buvi)
// Senariy-manba: pm-senariylar/BRIDGE-B3-BirinchiVersiya.md (GATE S, 2026-09-23 23:02 — foydalanuvchi ko'rigi kiritilgan).
// Mavzu: dekompozitsiya — birinchi versiya (MVP) · tizimni kod bilmaydigan odamga tushuntirish.
// Misol-ip: eMaktab (Kundalik) — «agar biz uni noldan qursak» (brendsiz maket; «ro'yxat mashq uchun tuzildi»).
// Keys: Instagram (Burbn) — faqat bank-faktlari, ekranda sana va 25 000 raqami YO'Q (foydalanuvchi qarori 23:02).
// Imzo-vizual ipi: 3/9-ekran eMaktab sakkiz bo'lagi → 6-ekran tarozi (🔥 · ⚡ · 🌱) → 11-ekran buvi tushunish chizig'i.
// O'z ishi: oldingi dars kartasi (kim · ogir · yechimlar) → bo'laklar → 🔥 birinchi versiya (≤3) → besh gap.
//   bridgeCard.js: 10-ekran cardWrite({ bolaklar: [{ nom, joy }], birinchiVersiya: [≤3 nom] }) · 15/16-ekran cardWrite({ gaplar: [5 gap] }).
// KARKAS-MANBA: src/bridge/lessons/BridgeKimUchun.jsx (1-dars, jonli sinovdan o'tgan) ← src/pm/PmUserStoryLesson.jsx (P0):
//        T tokenlar, Stage/Mentor/MentorNote, QuestionScreen+MentorTestStats, nishonlar, Podium, CodeStrike arena,
//        Flashcards, progRead/progWrite, jonli relslar — AYNAN. Dars-xos ekranlar va CSS qatlami — shu faylda.
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
// Amber — «✗ bo'lak emas» kartasi (4-ekran) va ⚡/🔥 yonidagi iliq ohang
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
const LESSON_META = { lessonId: 'bridge-b3-v1', lessonTitle: { uz: "Birinchi versiya va uni ko'rsatish", ru: 'Первая версия и как её показать' } };
// 20 ekran — senariy 3-bo'lim tartibi. Ballik testlar: 5 · 8 · 12 · 14 (idx 4 · 7 · 11 · 13), har biri o'z nazariyasidan keyin.
// Arena alohida ekran EMAS — senariy 20-ekrani «Arena + yakun» (CodeStrike yakun sahifasi ichida, jsx-lint qonuni).
const SCREEN_META = [
  { id: 'hook',    type: 'hook',        template: 'custom', scored: false, scope: 'hook' },         // 0  · 1  Hook (ovoz)
  { id: 'maqsad',  type: 'rule',        template: 'custom', scored: false, scope: null },           // 1  · 2  Maqsad (jonli preview)
  { id: 'bolak',   type: 'exploration', template: 'custom', scored: false, scope: null },           // 2  · 3  Bo'laklaymiz
  { id: 'tugat',   type: 'exploration', template: 'custom', scored: false, scope: null },           // 3  · 4  Tugatsa bo'ladimi?
  { id: 's5',      type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 4  · 5  TEST-1
  { id: 'tarozi',  type: 'exploration', template: 'custom', scored: false, scope: null },           // 5  · 6  Tarozi — ikki savol
  { id: 'keys',    type: 'case',        template: 'custom', scored: false, scope: null },           // 6  · 7  Keys: Instagram
  { id: 's8',      type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 7  · 8  TEST-2
  { id: 'royxat',  type: 'practice',    template: 'custom', scored: false, scope: null },           // 8  · 9  Birinchi versiya ro'yxati
  { id: 'versiya', type: 'practice',    template: 'custom', scored: false, scope: null },           // 9  · 10 O'z birinchi versiyangiz (ustaxona)
  { id: 'chiziq',  type: 'exploration', template: 'custom', scored: false, scope: null },           // 10 · 11 Tushunish chizig'i
  { id: 's12',     type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 11 · 12 TEST-3
  { id: 'oxshat',  type: 'practice',    template: 'custom', scored: false, scope: null },           // 12 · 13 O'xshatish — juftlash
  { id: 's14',     type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 13 · 14 TEST-4
  { id: 'gaplar',  type: 'practice',    template: 'custom', scored: false, scope: null },           // 14 · 15 Besh gap (ustaxona)
  { id: 'ai',      type: 'practice',    template: 'custom', scored: false, scope: null },           // 15 · 16 AI — tinglovchi rolida
  { id: 'juft',    type: 'recap',       template: 'custom', scored: false, scope: null },           // 16 · 17 Sherigingizga ayting
  { id: 'podium',  type: 'stats',       template: 'custom', scored: false, scope: null },           // 17 · 18 Podium
  { id: 'flash',   type: 'flashcard',   template: 'custom', scored: false, scope: null },           // 18 · 19 Flashcard
  { id: 'yakun',   type: 'summary',     template: 'custom', scored: false, scope: null }            // 19 · 20 Arena + yakun
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// SCREEN_INTENTS — har ekran nima uchun mavjud (1 gap). Render qilinmaydi; 👦 O'quvchi-simulyator tekshiradi.
export const SCREEN_INTENTS = {
  hook: "Bola eMaktabni noldan qursa qaysi bo'lakdan boshlashiga ovoz beradi va har bo'lak yakka o'zi ham foyda berishini biladi",
  maqsad: "Bola dars oxirida katta sayt bo'laklarga bo'linib, uchtasi birinchi versiyaga tushishini va besh gap yozilishini ko'radi",
  bolak: "Bola «eMaktab saytini qurish» kartasini bosib, sakkiz bo'lakka bo'linishini ko'radi va «dekompozitsiya» atamasini oladi",
  tugat: "Bola to'rt kartani tekshirib, yaxshi bo'lakning boshi va oxiri aniq bo'lishini ajratadi",
  s5: "Bola boshqa ishlarsiz tugatsa bo'ladigan chegarasi aniq ishni topadi",
  tarozi: "Bola «Ota-onaga xabar» bo'lagini ikki savolli tarozidan o'tkazib, uch joyning ma'nosini ko'radi",
  keys: "Bola Burbn'dan odamlarga yoqqan narsa qolganini bashorat qilib, «birinchi versiya (MVP)» atamasini oladi",
  s8: "Bola birinchi versiyaga «kerak va tez» bo'laklar kirishini tanlaydi",
  royxat: "Bola eMaktabning sakkiz bo'lagini tarozidan o'tkazib, 🔥 da uchtasini qoldiradi va sayt ishlashini ko'radi",
  versiya: "Bola o'z g'oyasining 4–6 bo'lagini yozib, tarozidan o'tkazadi va birinchi versiyaga ko'pi bilan uchtasini saqlaydi",
  chiziq: "Bola buvining tushunish chizig'i qaysi so'zlarda tushishini bosib topadi va «kasbiy so'z» atamasini oladi",
  s12: "Bola tinglovchi bilmoqchi bo'lgan foydadan boshlanadigan gapni tanlaydi",
  oxshat: "Bola saytning uch qismini buviga tanish uch narsaga juftlaydi va kasbiy so'z o'xshatish emasligini ko'radi",
  s14: "Bola yangi tinglovchi (futbolchi do'st) hayotidan olingan o'xshatishni tanlaydi",
  gaplar: "Bola o'z g'oyasini kod bilmaydigan odamga besh gapda yozadi — kasbiy so'z yozilsa darhol ko'radi",
  ai: "Bola besh gapini AI ga «kod bilmaydigan odam» sifatida tekshirtiradi va qaysi so'zni almashtirishni o'zi hal qiladi",
  juft: "Bola besh gapini sherigiga aytib, sherigi tushunmagan so'z o'rniga nima deyishini yozadi",
  podium: "Bola testlardagi natijasini (jonlida — sinf reytingini) ko'radi",
  flash: "Bola 5 kartada bugungi asosiy fikrlarni o'zi tekshiradi",
  yakun: "Bola arenaga kiradi va darsning 3 xulosasini ko'radi"
};


// F-0925-B12: bo'sh yozish maydonida aniq chorlov (placeholder'siz maydon bo'sh oq quti bo'lib ko'rinardi).
const WRITE_PH = { uz: 'Shu yerga yozing…', ru: 'Напишите здесь…' };
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
// (s5 → B · s8 → D · s12 → A · s14 → C). Ishtirok-kalit (-1): amaliyot-signali PRACTICE_BASE+screen.
const INLINE_KEYS = { s5: 1, s8: 3, s12: 0, s14: 2, practice: -1 };


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
  const [picked, setPicked] = useState(() => { const v = storedAnswer?.lastPicked ?? storedAnswer?.picked; return Number.isInteger(v) && v >= 0 && v < options.length ? v : null; });
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
        {/* Tanlagach variantlar ixchamlashadi — izoh chiqqanda ekran skrollsiz qoladi (PmLesson2 naqshi, F-0924-06) */}
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
  return (
    <div className={`mentor fade-up ${enabled ? 'mentor-mob' : ''} ${collapsed ? 'is-collapsed' : ''}`} onClick={collapsed ? expand : undefined} role={collapsed ? 'button' : undefined}>
      <div className="mentor-ava" aria-hidden="true">
        <img src={MENTOR_IMG} alt="" />
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
const low = (s) => (s ? s.charAt(0).toLocaleLowerCase() + s.slice(1) : s);
// F-0915-02: saqlangan karta/javob noto'g'ri turda bo'lsa (son, obyekt) — satr emas, bo'sh deb olinadi (oq ekran yo'q)
const clean = (s) => (typeof s === 'string' ? s : '').trim().replace(/[.!?…]+$/, '');
const filled = (s) => typeof s === 'string' && s.trim().length >= 2;
// Karta (bridgeCard): faqat satr va massiv maydonlar olinadi — buzuq/boshqa shakldagi karta ekranni yiqitmaydi (pilot cardSafe naqshi)
const cardSafe = () => { const c = cardRead(); if (!c || typeof c !== 'object' || Array.isArray(c)) return {}; const o = {}; Object.keys(c).forEach(k => { const v = c[k]; if (typeof v === 'string' || Array.isArray(v)) o[k] = v; }); return o; };
const strOnly = (o, keys) => { const r = {}; keys.forEach(k => { r[k] = o && typeof o[k] === 'string' ? o[k] : ''; }); return r; };
const useIsMentor = () => { const g = useContext(LiveGateCtx) || {}; return !!(g.live && g.live.mode === 'mentor'); };
const reduceMotion = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Amaliyot-signali (mentor paneli «kim bajardi») — ball-relsga yozmaydi, faqat ishtirok (INLINE_KEYS -1).
const sendPractice = (live, screen) => { if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0); };
// 31-qonun: mentor HECH QAYSI amaliyotda majburan to'ldirmaydi — yozuv MentorNote (Eslatma) ichida.
const MENTOR_FREE = { uz: "👨‍🏫 Jonli darsda bu amaliyotni o'quvchilar bajaradi — siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: '👨‍🏫 На живом уроке это задание выполняют ученики — вы наблюдаете; «Продолжить» для вас открыто.' };
const CONT = { uz: 'Davom etish', ru: 'Продолжить' };
const copyText = async (txt) => {
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(txt); return true; } } catch { /* pastdagi yo'l */ }
  try { const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); document.body.removeChild(ta); return ok; } catch { return false; }
};

// Brauzer-ramka (eMaktab maketi uchun) — manzil-qatori bo'sh, brend yo'q (B1 BrowserFrame porti)
const BrowserFrame = ({ children, className = '' }) => (
  <div className={`bf ${className}`}>
    <div className="bf-bar" aria-hidden="true"><span className="bb-dots"><i /><i /><i /></span><span className="bf-url" /></div>
    <div className="bf-body">{children}</div>
  </div>
);
// ⛶ Kattalashtirish (PmLesson2 Zoomable naqshi) — asosiy maketni proyektorda katta ko'rsatish; holat saqlanadi
const Zoomable = ({ children, className = '' }) => {
  const [big, setBig] = useState(false);
  useEffect(() => {
    if (!big) return undefined;
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

// ===== eMaktab SAKKIZ BO'LAGI (1 · 3 · 9-ekran — nomlar so'zma-so'z bir xil) =====
// Birinchi to'rttasi saytda haqiqatan bor bo'limlar; qolgan to'rttasi — «noldan qursak» ro'yxatidagi taklif (senariy halollik-qaydi).
const EM_PIECES = [
  { id: 'baho',     ic: '📊', t: { uz: "Baholarni ko'rish", ru: 'Смотреть оценки' } },
  { id: 'jadval',   ic: '🗓️', t: { uz: "Dars jadvalini ko'rish", ru: 'Смотреть расписание уроков' } },
  { id: 'vazifa',   ic: '📚', t: { uz: "Uyga vazifani ko'rish", ru: 'Смотреть домашнее задание' } },
  { id: 'davomat',  ic: '✅', t: { uz: "Davomatni ko'rish", ru: 'Смотреть посещаемость' } },
  { id: 'xabar',    ic: '📩', t: { uz: 'Ota-onaga xabar', ru: 'Сообщение родителям' } },
  { id: 'yozishuv', ic: '💬', t: { uz: "O'qituvchi bilan yozishuv", ru: 'Переписка с учителем' } },
  { id: 'grafik',   ic: '📈', t: { uz: "O'rtacha baho grafigi", ru: 'График средней оценки' } },
  { id: 'elon',     ic: '📢', t: { uz: "E'lonlar", ru: 'Объявления' } },
];
// Maketdagi MATERIAL (dizayn, F-0924 vizual boylik): bo'sh kulrang chiziq o'rniga har bo'lakning o'z sahifasidan bitta
// qisqa namuna-qator. Birinchi to'rttasi — eMaktab'da haqiqatan bor bo'limlar (baholar · jadval · vazifa va muddati ·
// davomat va kechikish — senariy halollik-qaydi); qolgan to'rttasi — «noldan qursak» taklifi. Raqam/sana — namuna.
const EM_MAT = {
  baho:     [{ k: { uz: 'Matematika', ru: 'Математика' }, v: '5' }, { k: { uz: 'Ona tili', ru: 'Родной язык' }, v: '4' }, { k: { uz: 'Ingliz tili', ru: 'Английский' }, v: '5' }],
  jadval:   [{ k: '08:30', v: { uz: 'Matematika', ru: 'Математика' } }, { k: '09:20', v: { uz: 'Ona tili', ru: 'Родной язык' } }, { k: '10:10', v: { uz: 'Fizika', ru: 'Физика' } }],
  vazifa:   [{ k: { uz: 'Matematika', ru: 'Математика' }, v: { uz: '45-mashq', ru: 'упр. 45' } }, { k: { uz: 'Adabiyot', ru: 'Литература' }, v: { uz: "she'r yodlash", ru: 'выучить стихотворение' } }, { k: { uz: 'Muddati', ru: 'Срок' }, v: { uz: 'ertagacha', ru: 'до завтра' } }],
  davomat:  [{ k: { uz: 'Dushanba', ru: 'Понедельник' }, v: '✓' }, { k: { uz: 'Seshanba', ru: 'Вторник' }, v: '✓' }, { k: { uz: 'Chorshanba', ru: 'Среда' }, v: { uz: 'kechikdi', ru: 'опоздал' } }],
  xabar:    [{ k: { uz: 'Bugun', ru: 'Сегодня' }, v: { uz: 'matematikadan 5', ru: '5 по математике' } }],
  yozishuv: [{ k: { uz: 'Ustozga', ru: 'Учителю' }, v: { uz: 'vazifa qaysi betda?', ru: 'задание на какой странице?' } }],
  grafik:   [{ k: { uz: "O'rtacha", ru: 'Средняя' }, v: '4,7' }],
  elon:     [{ k: { uz: 'Juma', ru: 'Пятница' }, v: { uz: 'sport kuni', ru: 'день спорта' } }],
};

// ===== TAROZI (6 · 9 · 10-ekran): ikki savol → uch joy =====
const ZONES = [
  { id: 'fire',  ic: '🔥', t: { uz: 'Birinchi versiya', ru: 'Первая версия' },
    why: { uz: "Saytning asosiy ishi shu bo'laksiz bajarilmasa va uni tez tayyorlash mumkin bo'lsa — bo'lak birinchi versiyaga kiradi.", ru: 'Если без этой части сайт не справляется со своим главным делом и её можно быстро подготовить — часть входит в первую версию.' } },
  { id: 'next',  ic: '⚡', t: { uz: 'Keyingi versiya', ru: 'Следующая версия' },
    why: { uz: "Bu bo'lak kerak, lekin tayyorlash ko'proq vaqt oladi. Uni tashlab yubormaymiz — faqat keyingi versiyaga qoldiramiz.", ru: 'Эта часть нужна, но на подготовку уходит больше времени. Мы её не выбрасываем — просто оставляем для следующей версии.' } },
  { id: 'later', ic: '🌱', t: { uz: 'Keyinga qoldirilganlar', ru: 'Отложенные' },
    why: { uz: "Sayt bu bo'laksiz ham ishlaydi. Uni tashlab yubormaymiz — faqat keyinroq qilamiz.", ru: 'Сайт работает и без этой части. Мы её не выбрасываем — просто сделаем позже.' } },
];
const zoneById = (id) => ZONES.find(z => z.id === id);
const WEIGH_QS = [
  { q: { uz: "Bu bo'laksiz sayt o'z asosiy ishini qila oladimi?", ru: 'Справится ли сайт без этой части со своим главным делом?' }, a: [{ uz: 'Ha', ru: 'Да' }, { uz: "Yo'q", ru: 'Нет' }] },
  { q: { uz: "Bu bo'lakni qancha vaqtda tayyorlash mumkin?", ru: 'За сколько времени можно подготовить эту часть?' }, a: [{ uz: 'Bir-ikki kun', ru: 'За день-два' }, { uz: "Bir haftadan ko'p", ru: 'Больше недели' }] },
];
// ② vaqt savoliga tayanch (👦 2-o'qish: «qancha vaqt — qayerdan bilaman?»): bola bo'lak hajmini fe'lidan ajratadi.
const TIME_TIP = { uz: "💡 Bo'lak faqat ko'rsatsa, tez tayyor bo'ladi. Xabar yuborsa yoki hisoblasa, ko'proq vaqt oladi.", ru: '💡 Если часть только показывает, её готовят быстро. Если отправляет сообщения или считает — дольше.' };
// «Ha» (busiz ham ishlaydi) → 🌱 · «Yo'q» + «Bir-ikki kun» → 🔥 · «Yo'q» + «Bir haftadan ko'p» → ⚡
const zoneOf = (main, time) => (main === 0 ? 'later' : time === 0 ? 'fire' : 'next');
// F-0925-B05: «Keyinga qoldirish — tashlab yuborish emas» alohida bloki joy-izohiga (⚡/🌱 why) qo'shildi — 🔥 ga tushganda ham chiqib qolardi
const FOUR_MSG = { uz: "Bir haftaga uchtasi sig'adi. Qaysi birini keyingi versiyaga o'tkazasiz?", ru: 'За неделю успеваем только три. Какую из них перенесёте в следующую версию?' };
const MOVE_HINT = { uz: "Avval bo'lakni tanlang, so'ng boshqa joyni bosing — yoki sudrab o'tkazing.", ru: 'Сначала выберите часть, потом нажмите на другое место — или перетащите её.' };

// Tarozi: bo'lak tarozida turadi, ikki savolga javob beriladi (imzo-vizual).
// Chap palla ① — «kerakmi?» (busiz sayt ishlamasa — og'ir yuk), o'ng palla ② — «vaqt» (bir haftadan ko'p — og'ir yuk).
// Shayin og'ir tomonga og'adi: kerak+tez → chap pastda (🔥) · kerak+uzoq → teng (⚡) · kerak emas → chap yengil (🌱).
// Pallalar tik osilib turadi (faqat siljiydi, aylanmaydi). Reduced-motion: og'ish darhol, o'tishsiz.
const SC_PIVOT = { x: 160, y: 30 };
const SC_ARM = 104;
const ScaleArt = ({ main, time }) => {
  const wl = main === 1 ? 2 : main === 0 ? 1 : 0;
  const wr = time === 1 ? 2 : time === 0 ? 1 : 0;
  const deg = Math.max(-11, Math.min(11, (wr - wl) * 6.5));
  const rad = (deg * Math.PI) / 180;
  const dy = SC_ARM * Math.sin(rad);
  const dx = SC_ARM * (1 - Math.cos(rad));
  const pan = (side, w, n) => {
    const sx = side === 'l' ? SC_PIVOT.x - SC_ARM : SC_PIVOT.x + SC_ARM;
    const ty = side === 'l' ? -dy : dy;
    const tx = side === 'l' ? dx : -dx;
    const bh = w === 2 ? 24 : w === 1 ? 10 : 0;
    return (
      <g className="sc-hang" style={{ transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)` }}>
        <path d={`M${sx} ${SC_PIVOT.y} L${sx - 26} 74 M${sx} ${SC_PIVOT.y} L${sx + 26} 74`} className="sc-str" />
        {bh > 0 && <rect key={`${side}${w}`} x={sx - (w === 2 ? 17 : 12)} y={74 - bh} width={w === 2 ? 34 : 24} height={bh} rx="4" className={`sc-wt ${side} w${w}`} />}
        <path d={`M${sx - 34} 74 L${sx + 34} 74 Q${sx + 30} 90 ${sx} 90 Q${sx - 30} 90 ${sx - 34} 74 Z`} className={`sc-bowl ${w ? 'on' : ''}`} />
        <text x={sx} y="86" className="sc-n" textAnchor="middle">{n}</text>
      </g>
    );
  };
  return (
    <svg className="sc-svg" viewBox="0 0 320 124" aria-hidden="true">
      <path d="M128 122 L192 122 L180 112 L140 112 Z" className="sc-foot" />
      <rect x="157" y={SC_PIVOT.y} width="6" height="84" rx="3" className="sc-mast" />
      <g className="sc-arm" style={{ transform: `rotate(${deg}deg)` }}>
        <rect x={SC_PIVOT.x - SC_ARM - 6} y={SC_PIVOT.y - 3} width={SC_ARM * 2 + 12} height="6" rx="3" className="sc-bar" />
      </g>
      {pan('l', wl, '①')}
      {pan('r', wr, '②')}
      <circle cx={SC_PIVOT.x} cy={SC_PIVOT.y} r="7" className="sc-hub" />
    </svg>
  );
};
// pulse — navbat-pulsi (F-0924-08): avval ① savol javoblari, ① javob olgach ② savol javoblari (useTurnWalk, bir lahzada bitta).
const Scale = ({ label, ic, main, time, onMain, onTime, disabled, pulse = false }) => {
  const vals = [main, time];
  const sets = [onMain, onTime];
  const pend = [main === null && 'q0', main !== null && time === null && 'q1'].filter(Boolean);
  const lit = useTurnWalk(pend, pulse && !disabled);
  return (
    <div className="sc">
      <div className="sc-piece fade-step" key={label}>{ic && <span aria-hidden="true">{ic}</span>}<b>{label}</b></div>
      <ScaleArt main={main} time={time} />
      {WEIGH_QS.map((Q, qi) => {
        const on = qi === 0 || main !== null;
        const v = vals[qi];
        return (
          <div key={qi} className={`sc-q ${on ? '' : 'off'}`}>
            <span className="sc-q-t" style={{ color: v !== null ? T.success : T.ink }}>{v !== null ? '✓' : ['①', '②'][qi]} {tr(Q.q)}</span>
            <div className="sc-a">
              {/* F-0925-QA17: chorlov-halqasi tugmalarning o'zida (navbatma-navbat), ota-blok atrofida emas */}
              {Q.a.map((a, ai) => <button key={ai} type="button" disabled={disabled || !on} className={`sc-btn ${v === ai ? 'on' : ''}${waveCls(lit === `q${qi}`, ai, Q.a.length)}`} onClick={() => sets[qi](ai)}>{tr(a)}</button>)}
            </div>
          </div>
        );
      })}
      {main !== null && time === null && <span className="sc-tip fade-step">{tr(TIME_TIP)}</span>}
    </div>
  );
};

// Uch joy doskasi: bo'laklar joyida turadi; onMove berilsa — bosib tanlash + boshqa joyni bosish yoki sudrash.
const ZoneBoard = ({ items, sel, onSel, onMove, landId, compact }) => (
  <div className={`zb ${compact ? 'compact' : ''}`}>
    {ZONES.map(z => {
      const list = items.filter(i => i.zone === z.id);
      const canDrop = !!(onMove && sel && !list.some(i => i.id === sel));
      return (
        <div key={z.id} className={`zb-zone ${z.id} ${canDrop ? 'can' : ''}`}
          onClick={canDrop ? () => onMove(sel, z.id) : undefined}
          onDragOver={onMove ? (e) => e.preventDefault() : undefined}
          onDrop={onMove ? (e) => { e.preventDefault(); const id = e.dataTransfer.getData('text/plain'); if (id) onMove(id, z.id); } : undefined}>
          <div className="zb-h"><span className="zb-ic" aria-hidden="true">{z.ic}</span><span className="zb-t">{tr(z.t)}</span><span className="zb-n mono">{list.length}</span></div>
          <div className="zb-list">
            {list.map(i => (
              <button key={i.id} type="button" draggable={!!onMove}
                onDragStart={onMove ? (e) => e.dataTransfer.setData('text/plain', i.id) : undefined}
                onClick={onMove ? (e) => { e.stopPropagation(); onSel(sel === i.id ? null : i.id); } : undefined}
                className={`zb-chip ${sel === i.id ? 'sel' : ''} ${landId === i.id ? 'land' : ''} ${onMove ? 'mv' : ''}`}>
                {i.ic && <span aria-hidden="true">{i.ic}</span>}<span className="zb-chip-t">{i.label}</span>
              </button>
            ))}
            {list.length === 0 && <span className="zb-empty" aria-hidden="true">—</span>}
          </div>
        </div>
      );
    })}
  </div>
);

// ===== SCREEN 1 — HOOK: ovoz berish (hamma javob to'g'ri, §119) + jonli sinf-diagrammasi =====
const HOOK_OPTS = EM_PIECES.slice(0, 4).map(p => p.t);
// HOOK imzo-sahnasi — «qurilish maydonchasidagi sayt» (hk-split chap ustuni). eMaktab sahifasi hali CHIZMA: to'rt bo'lak
// kesik chiziqli, ustida «qurilmoqda» tasmasi siljiydi. Bola bo'lakni tanlasa — FAQAT o'sha bo'lak quriladi: rang to'lqini
// o'tadi, haqiqiy qatorlari (fan · baho · soat) birma-bir tushadi, «1-kun» shtampi bosiladi; qolganlari chizmaligicha
// «keyin» bo'lib qoladi. Mavzuni o'qitadi: katta sayt bir kunda emas, bo'lakma-bo'lak quriladi. Tanlovdan oldin o'ngdagi
// variant ustiga borilsa, mos bo'lak yonadi (qaysi tugma qaysi bo'lak — ko'rinib turadi). Reduced-motion: o'tishsiz.
const HookSite = ({ picked = null, hov = null }) => (
  <div className={`hs-site fade-up delay-1${picked !== null ? ' picked' : ''}`} aria-hidden="true">
    <div className="hs-bar"><span className="bb-dots"><i /><i /><i /></span><span className="hs-brand">eMaktab</span><span className="hs-day">{tr({ uz: 'Dushanba', ru: 'Понедельник' })}</span></div>
    <div className="hs-grid">
      {EM_PIECES.slice(0, 4).map((p, i) => {
        const built = picked === i;
        const cls = built ? 'built' : picked !== null ? 'later' : hov === i ? 'hov' : '';
        return (
          <div key={p.id} className={`hs-blk ${cls}`}>
            <div className="hs-blk-h"><span className="hs-blk-ic">{p.ic}</span><span className="hs-blk-t">{tr(p.t)}</span></div>
            <div className="hs-rows">
              {EM_MAT[p.id].map((r, k) => (
                <span key={k} className="hs-row" style={{ '--k': k }}><span className="hs-k">{tr(r.k)}</span><b className={`hs-v ${r.v === '5' ? 'top' : ''}`}>{tr(r.v)}</b></span>
              ))}
            </div>
            {built && <span className="hs-stamp">✓ {tr({ uz: '1-kun', ru: '1-й день' })}</span>}
            {picked !== null && !built && <span className="hs-later">{tr({ uz: 'keyinroq', ru: 'позже' })}</span>}
          </div>
        );
      })}
    </div>
  </div>
);
const ScreenHook = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
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
  // 90-qonun (F-0924-04): nol ovozda bo'sh «0%» jadvali chiqmaydi — o'rnida «Ovozlar kutilmoqda» chipi.
  const voteWait = isLive && (picked !== null || isMentor) && totalVotes === 0;
  const revealViz = isLive && shown && totalVotes > 0 && (picked !== null || isMentor);
  const topIdx = revealViz ? shown.indexOf(Math.max(...shown)) : -1;
  const optWave = useTurnHint(picked === null && !isMentor);
  const [hov, setHov] = useState(null);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish · ovoz berish', ru: 'Введение · голосование' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} label={isMentor || picked !== null ? tr(CONT) : tr({ uz: 'Fikringizni belgilang', ru: 'Отметьте своё мнение' })} onClick={onNext} />}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({
          uz: <><span className="italic" style={{ color: T.accent }}>eMaktab (Kundalik)</span> saytini qaysi bo'lakdan boshlaysiz?</>,
          ru: <>С какой части начнёте сайт <span className="italic" style={{ color: T.accent }}>eMaktab (Kundalik)</span>?</>,
        })}</h2></div>
        {/* 🎓 Metodist: mentor-gap yakuniy (F-0924-03, §210 qolipi — NEGA + bitta chorlov, joy so'zisiz) */}
        <Mentor>{tr({ uz: <>Sayt bir kunda emas, bo'lakma-bo'lak quriladi — <b style={{ color: T.ink }}>to'rt bo'lakdan</b> qaysi biri birinchi tayyor bo'lishini belgilang.</>, ru: <>Сайт строится не за один день, а по частям, — отметьте, какая из <b style={{ color: T.ink }}>четырёх частей</b> будет готова первой.</> })}</Mentor>
        <div className="split hk-split">
          <Col>
            <Zoomable><HookSite picked={picked} hov={hov} /></Zoomable>
          </Col>
          <Col>
            <div className="hk-opts fade-up delay-2">
              {HOOK_OPTS.map((o, i) => {
                const on = picked === i;
                const locked = picked !== null || isMentor;
                return (
                  <button key={i} className={`hk-opt ${on ? 'on' : ''} ${picked !== null && !on ? 'wait' : ''}${!locked && optWave ? ` turn-ring turn-wave wv4 w${i + 1}` : ''}`} disabled={locked} onClick={() => pick(i)}
                    onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(h => (h === i ? null : h))} onFocus={() => setHov(i)} onBlur={() => setHov(h => (h === i ? null : h))}>
                    <span className="hk-radio">{on && <span className="hk-dot" />}</span>
                    <span className="hk-ic" aria-hidden="true">{EM_PIECES[i].ic}</span>
                    <span className="hk-t">{tr(o)}</span>
                    {on && <b className="hk-ok fade-step" aria-hidden="true">✓</b>}
                  </button>
                );
              })}
            </div>
            {(picked !== null || isMentor) && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({
              uz: "Hammasi to'g'ri: bitta bo'lak ishlasa ham, sayt foyda beradi. Qaysi bo'lakdan boshlashni bugun o'rganasiz.",
              ru: 'Все ответы верны: даже одна работающая часть уже приносит пользу. Как выбрать, с какой начать, — узнаете сегодня.',
            })}</p></div>}
            {voteWait && <span className="done-mini fade-step">{tr({ uz: '👥 Ovozlar kutilmoqda…', ru: '👥 Ждём голоса…' })}</span>}
            {/* 90-qonun (F-0924-04): diagramma faqat kamida bitta ovoz kelganda (revealViz → totalVotes > 0) */}
            {revealViz && totalVotes > 0 && (
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

// ===== SCREEN 2 — MAQSAD: jonli natija-preview (imzo-vizual) =====
// Taymlayn (CSS, bir marta): katta «eMaktab» kartasi → 8 bo'lakka sochiladi → uchtasi 🔥 ga tushadi → besh gapli
// tushuntirish o'z-o'zidan yoziladi. Bo'laklar va gaplar MAZMUNSIZ (faqat tuzilma) — 9-ekran tanlovi va 15-ekran ishi
// oldindan ochilmasin. ↻ — sahnani qayta o'ynatadi (mentor proyektori). Reduced-motion: darhol yakuniy holat.
const GOAL_FIRE = [1, 2, 5]; // qaysi 3 katak 🔥 ga uchadi (bo'sh katak — mazmun oshkor bo'lmaydi)
const GoalDemo = () => {
  const [run, setRun] = useState(0);
  return (
    <div className="gv fade-up delay-1" key={run}>
      <button type="button" className="gv-replay" onClick={() => setRun(r => r + 1)} aria-label={tr({ uz: "Qayta ko'rsatish", ru: 'Показать снова' })}>↻</button>
      <div className="gv-top">
        <div className="gv-card"><span className="gv-card-t">eMaktab</span></div>
        <div className="gv-grid" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => {
            const f = GOAL_FIRE.indexOf(i);
            return <span key={i} className={`gv-tile ${f >= 0 ? `go g${f}` : ''}`} style={{ '--i': i }}><i /><i className="s" /></span>;
          })}
        </div>
        <div className="gv-fire" aria-hidden="true"><span className="gv-fire-h">🔥 {tr({ uz: 'Birinchi versiya', ru: 'Первая версия' })}</span>
          <span className="gv-slots">{[0, 1, 2].map(k => <span key={k} className={`gv-slot s${k}`}><i /></span>)}</span>
        </div>
      </div>
      <div className="gv-talk" aria-hidden="true">
        <span className="gv-talk-h">🗣️ {tr({ uz: 'Besh gap', ru: 'Пять фраз' })}</span>
        {[0, 1, 2, 3, 4].map(k => <span key={k} className={`gv-line l${k}`}><b>{k + 1}</b><i style={{ '--w': `${[92, 74, 86, 68, 80][k]}%` }} /></span>)}
      </div>
    </div>
  );
};
const ScreenGoal = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun saytingizning <span className="italic" style={{ color: T.accent }}>birinchi versiyasini</span> tanlaysiz</>, ru: <>Сегодня вы выберете <span className="italic" style={{ color: T.accent }}>первую версию</span> своего сайта</> })}</h2></div>
      <Mentor>{tr({
        uz: "O'zingiz tanlagan g'oyani bo'laklarga bo'lasiz va birinchi versiyasida ishlaydigan uchtasini tanlaysiz — ya'ni sayt ochilgan kuni ishlaydigan qismini. Keyin shu g'oyani kod bilmaydigan odamga besh gapda tushuntirasiz.",
        ru: 'Вы разделите выбранную идею на части и выберете три, которые будут работать в первой версии, — то есть то, что заработает в день открытия сайта. Потом объясните эту идею человеку, который не знает код, в пяти фразах.',
      })}</Mentor>
      <GoalDemo />
    </div>
  </Stage>
);

// ===== SCREEN 3 — BO'LAKLAYMIZ: bitta karta bosilsa sakkiz bo'lakka bo'linadi (imzo-vizual boshlanishi) =====
// 🏅 Piece by Piece! — bonus nishon (152-qonun): kartani bo'laklarga ajratgan har o'quvchi uchun rost; AchRule yo'q.
const ScreenPieces = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const [split, setSplit] = useState(!!(storedAnswer && storedAnswer.solved));
  const doSplit = () => {
    if (split) return;
    setSplit(true);
    if (!(storedAnswer && storedAnswer.solved)) onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'bolak', solved: true, correct: true, picked: true });
  };
  const tapTurn = useTurnHint(!split);
  return (
    <Stage eyebrow={tr({ uz: '1-qism · Birinchi versiya', ru: 'Часть 1 · Первая версия' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!split && !isMentor} turnBusy={!split} label={split || isMentor ? tr(CONT) : tr({ uz: 'Kartani bosing', ru: 'Нажмите на карточку' })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sayt — <span className="italic" style={{ color: T.accent }}>bitta katta ishmi</span> yoki bir nechta kichik ishmi?</>, ru: <>Сайт — это <span className="italic" style={{ color: T.accent }}>одна большая работа</span> или несколько маленьких?</> })}</h2></div>
        {/* 🎓 Metodist: mentor-gap yakuniy (F-0924-03, §210 qolipi — NEGA + bitta chorlov, joy so'zisiz) */}
        <Mentor>{tr({ uz: <>Katta ishni boshlash qiyin — <b style={{ color: T.ink }}>«eMaktab saytini qurish»</b> kartasini bosib, ichini ko'ring.</>, ru: <>Большую работу трудно начать — нажмите на карточку <b style={{ color: T.ink }}>«Построить сайт eMaktab»</b> и посмотрите, что внутри.</> })}</Mentor>
        <Zoomable><BrowserFrame className="em-frame fade-up delay-1">
          {!split ? (
            <button type="button" className={`em-big${tapTurn ? ' turn-ring' : ''}`} onClick={doSplit}>
              <span className="em-big-h">eMaktab</span>
              <span className="em-big-t">{tr({ uz: 'eMaktab saytini qurish', ru: 'Построить сайт eMaktab' })}</span>
            </button>
          ) : (
            <div className="em-grid">
              {EM_PIECES.map((p, i) => (
                <div key={p.id} className="em-tile" style={{ '--i': i }}><span className="em-tile-ic" aria-hidden="true">{p.ic}</span><span className="em-tile-t">{tr(p.t)}</span>
                  <span className="em-mat" aria-hidden="true"><span>{tr(EM_MAT[p.id][0].k)}</span><b>{tr(EM_MAT[p.id][0].v)}</b></span></div>
              ))}
            </div>
          )}
        </BrowserFrame></Zoomable>
        {split && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({
          uz: <>Katta saytni birdaniga qurmaymiz. Avval uni alohida bo'laklarga ajratamiz, keyin birma-bir qurib tugatamiz. Katta ishni shunday bo'laklarga bo'lish <b>dekompozitsiya</b> deyiladi.</>,
          ru: <>Большой сайт не строят сразу целиком. Сначала его делят на отдельные части, потом достраивают их одну за другой. Такое деление большой работы на части называется <b>декомпозицией</b>.</>,
        })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 4 — TUGATSA BO'LADIMI? 4 karta, bosib tekshirish (toggle, 46-qonun: opened ≠ seen) =====
const DONE_CARDS = [
  { id: 'baho', ok: true, t: EM_PIECES[0].t, why: { uz: 'Boshlanishi ham, tugashi ham aniq', ru: 'И начало, и конец понятны' } },
  { id: 'davomat', ok: true, t: EM_PIECES[3].t, why: { uz: 'Boshlanishi ham, tugashi ham aniq', ru: 'И начало, и конец понятны' } },
  { id: 'chiroy', ok: false, t: { uz: 'Saytni chiroyli qilish', ru: 'Сделать сайт красивым' }, why: { uz: "Bu juda umumiy ish: qaysi sahifani, nimani, qachongacha chiroyli qilish aniq emas", ru: 'Это слишком общая работа: непонятно, какую страницу, что и к какому сроку делать красивым' } },
  { id: 'hamma', ok: false, t: { uz: 'Hamma maktab ishlatsin', ru: 'Пусть пользуется каждая школа' }, why: { uz: "Bu bajariladigan bo'lak emas, natija. Avval saytni ishlaydigan qilib qurish kerak", ru: 'Это не часть работы, а результат. Сначала нужно построить сайт, который работает' } },
];
const ScreenFinish = ({ screen, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const [opened, setOpened] = useState(() => new Set());
  const [seen, setSeen] = useState(() => new Set());
  const tap = (id) => {
    setOpened(p => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });
    setSeen(p => { const n = new Set(p); n.add(id); return n; });
  };
  const all = seen.size >= DONE_CARDS.length;
  const pend = DONE_CARDS.map(c => c.id).filter(id => !seen.has(id));
  const lit = useTurnWalk(pend);
  return (
    <Stage eyebrow={tr({ uz: '1-qism · Birinchi versiya', ru: 'Часть 1 · Первая версия' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all} label={all || isMentor ? tr(CONT) : tr({ uz: `Kartalarni bosib tekshiring (${seen.size}/4)`, ru: `Нажмите и проверьте карточки (${seen.size}/4)` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qaysi bo'lakning <span className="italic" style={{ color: T.accent }}>oxiri ko'rinadi</span>?</>, ru: <>У какой части <span className="italic" style={{ color: T.accent }}>виден конец</span>?</> })}</h2></div>
        {/* 🎓 Metodist: mentor-gap yakuniy (F-0924-03, §210 qolipi — NEGA + bitta chorlov, joy so'zisiz) */}
        <Mentor>{tr({ uz: <>Rejaga yozilgan har ish ham tugatib bo'ladigan bo'lak emas — <b style={{ color: T.ink }}>to'rt kartani</b> birma-bir bosib, qaysi birining oxiri ko'rinishini tekshiring.</>, ru: <>Не каждое дело из плана — часть, которую можно закончить, — нажимайте <b style={{ color: T.ink }}>четыре карточки</b> по очереди и проверьте, у какой виден конец.</> })}</Mentor>
        <div className="fc4 fade-up delay-1">
          {DONE_CARDS.map(c => {
            const open = opened.has(c.id);
            return (
              <button key={c.id} type="button" aria-pressed={open} onClick={() => tap(c.id)} className={`fc4-card ${open ? (c.ok ? 'open ok' : 'open no') : ''} ${seen.has(c.id) ? 'seen' : ''}${turnCls(lit, c.id, pend.length > 1)}`}>
                <span className="fc4-t">{tr(c.t)}</span>
                {open
                  ? <span className="fc4-v fade-step"><b className="fc4-mark" aria-hidden="true">{c.ok ? '✓' : '✗'}</b>{tr(c.why)}</span>
                  : seen.has(c.id) && <span className="fc4-cue">{tr({ uz: '↻ yana ochish', ru: '↻ открыть снова' })}</span>}
              </button>
            );
          })}
        </div>
        {all && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink, fontWeight: 600 }}>{tr({ uz: "Yaxshi bo'lakning boshlanishi ham, tugashi ham aniq.", ru: 'У хорошей части понятны и начало, и конец.' })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== TEST-SAVOL kartasi (P0 TestQ + senariy «lead → cue» naqshi) =====
// TEST-SAVOL (F-0924-06) — PmLesson2 savol-qolipi (Screen4): eyebrow + BITTA h-ask sarlavha.
// Lead (senariy matni) — oddiy qator, serif-karta EMAS: ikki sarlavha raqobatlashmaydi (pilot B1 naqshi).
const TestQ = ({ lead, ask }) => (
  <div className="tq">
    {lead && <p className="tq-lead">{lead}</p>}
    <h2 className="title h-ask">{ask}</h2>
  </div>
);
// Senariyda ✓ birinchi yozilgan — ekranda INLINE_KEYS pozitsiyasiga qo'yiladi, qolganlari senariy tartibida.
// Har distraktorning o'z xato-izohi (senariy) shu pozitsiya bilan birga ko'chadi.
const arrange = (list, key) => { const [ok, ...rest] = list; const out = rest.slice(); out.splice(key, 0, ok); return out; };
const TestScreen = ({ id, n, lead, ask, list, explainCorrect, ...props }) => {
  const key = INLINE_KEYS[id];
  const items = arrange(list, key);
  const explainWrong = {};
  items.forEach((x, i) => { if (i !== key) explainWrong[i] = tr(x.why); });
  return (
    <QuestionScreen {...props} eyebrow={tr({ uz: `Tekshiruv · ${n}`, ru: `Проверка · ${n}` })} scope="module-mikro"
      question={<TestQ lead={lead ? tr(lead) : null} ask={tr(ask)} />}
      questionText={tr(ask)}
      options={items.map(x => tr(x.t))}
      correctIdx={key}
      explainCorrect={tr(explainCorrect)}
      explainWrong={explainWrong}
    />
  );
};

// ===== SCREEN 5 — TEST-1 =====
const T1 = {
  lead: { uz: 'eMaktab ustida ishlayapsiz.', ru: 'Вы работаете над eMaktab.' },
  ask: { uz: 'Qaysi ishni boshqa ishlarni bajarmasdan ham tugatish mumkin?', ru: 'Какую работу можно закончить, не делая остальных?' },
  list: [
    { t: { uz: "Bugungi dars jadvalini ko'rsatish", ru: 'Показать расписание уроков на сегодня' } },
    { t: { uz: 'Saytning butun ishini qurish', ru: 'Построить всю работу сайта' }, why: { uz: "Bu butun ishning o'zi. Uni avval bo'laklarga bo'lish kerak.", ru: 'Это и есть вся работа целиком. Её сначала нужно разделить на части.' } },
    { t: { uz: 'Saytni chiroyli qilib bezash', ru: 'Красиво оформить сайт' }, why: { uz: 'Bu juda umumiy ish: qaysi sahifani, nimani, qachongacha — aniq emas.', ru: 'Это слишком общая работа: какую страницу, что и к какому сроку — непонятно.' } },
    { t: { uz: "Saytni ko'proq maktabga tanitish", ru: 'Познакомить с сайтом больше школ' }, why: { uz: "Bu natija, ish emas. Uni sayt ustida o'tirib tugatib bo'lmaydi.", ru: 'Это результат, а не работа. Её не закончишь, сидя над сайтом.' } },
  ],
  ok: { uz: "To'g'ri. «Bugungi dars jadvalini ko'rsatish» — chegarasi aniq kichik ish: uni alohida bajarib, natijasini ko'rish mumkin. Boshi ham, oxiri ham ko'rinadi.", ru: 'Верно. «Показать расписание уроков на сегодня» — небольшая работа с понятными границами: её можно сделать отдельно и увидеть результат. Видно и начало, и конец.' },
};
const ScreenT1 = (props) => <TestScreen {...props} id="s5" n={1} lead={T1.lead} ask={T1.ask} list={T1.list} explainCorrect={T1.ok} />;

// ===== SCREEN 6 — TAROZI: «Ota-onaga xabar» ikki savoldan o'tadi va o'z joyiga tushadi (demo, qayta-qayta sinash mumkin) =====
// D-5 (senariy, foydalanuvchi qarori): qoida birdaniga ro'yxat bo'lib ochilmasin — faqat tushgan joy izohi ko'rinadi.
const ScreenScale = ({ screen, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const piece = EM_PIECES[4];
  const [main, setMain] = useState(null);
  const [time, setTime] = useState(null);
  const [placed, setPlaced] = useState(false);
  const zone = main !== null && time !== null ? zoneOf(main, time) : null;
  useEffect(() => { if (zone) setPlaced(true); }, [zone]);
  const navLabel = placed || isMentor ? tr(CONT)
    : main === null ? tr({ uz: '① 1-savolga javob bering', ru: '① Ответьте на 1-й вопрос' })
    : tr({ uz: '② 2-savolga javob bering', ru: '② Ответьте на 2-й вопрос' });
  const items = zone ? [{ id: piece.id, ic: piece.ic, label: tr(piece.t), zone }] : [];
  const z = zone ? zoneById(zone) : null;
  return (
    <Stage eyebrow={tr({ uz: '1-qism · Birinchi versiya', ru: 'Часть 1 · Первая версия' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!placed && !isMentor} turnBusy={!placed} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qaysi bo'lak birinchi versiyaga kiradi — buni <span className="italic" style={{ color: T.accent }}>qanday bilamiz</span>?</>, ru: <>Какая часть войдёт в первую версию — <span className="italic" style={{ color: T.accent }}>как это узнать</span>?</> })}</h2></div>
        {/* 🎓 Metodist: mentor-gap yakuniy (F-0924-03, §210 qolipi — NEGA + bitta chorlov, joy so'zisiz) */}
        <Mentor>{tr({ uz: <>Bo'lak joyini taxmin emas, ikki savol hal qiladi — <b style={{ color: T.ink }}>① savolga</b> javob bering.</>, ru: <>Место части решает не догадка, а два вопроса, — ответьте на <b style={{ color: T.ink }}>вопрос ①</b>.</> })}</Mentor>
        <div className="split">
          <Col>
            <span className="flow-label col-cap">⚖️ {tr({ uz: 'Tarozi · ikki savol', ru: 'Весы · два вопроса' })}</span>
            <Scale label={tr(piece.t)} ic={piece.ic} main={main} time={time} onMain={setMain} onTime={setTime} pulse={!isMentor} />
          </Col>
          <Col>
            <span className="flow-label col-cap">{tr({ uz: "Bo'lak tushadigan uch joy", ru: 'Три места для части' })}</span>
            <ZoneBoard items={items} landId={zone ? piece.id : null} compact />
            {z && <div className="zb-why fade-step" key={`why-${zone}`}><b>{z.ic} {tr(z.t)}</b><span>{tr(z.why)}</span></div>}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 7 — KEYS: Instagram (bashorat + 3 slayd; faqat bank-faktlari, sana va 25 000 yo'q) =====
const IG_PREDICT = {
  chips: [
    { ic: '📍', t: { uz: 'Joy belgilash', ru: 'Отмечать места' } },
    { ic: '🗓️', t: { uz: 'Reja tuzish', ru: 'Составлять планы' } },
    { ic: '📷', t: { uz: "Surat qo'yish", ru: 'Выкладывать фото' } },
  ],
  ans: 2,
};
const IG_SLIDES = [
  { ic: '📱', body: { uz: "Burbn'da ko'p narsa bor edi, lekin uni ishlatadiganlar juda kam edi.", ru: 'В Burbn было много всего, но пользовались им очень немногие.' } },
  { ic: '📷', body: { uz: 'Jamoa odamlar eng ko\'p yoqtirgan qismlarni qoldirdi: surat, filtr va izoh.', ru: 'Команда оставила то, что людям нравилось больше всего: фото, фильтры и комментарии.' } },
  { ic: '✨', body: { uz: 'Shu kichik ilova Instagram nomi bilan chiqdi — bugun hamma biladigan Instagram.', ru: 'Это небольшое приложение вышло под названием Instagram — тот самый Instagram, который сегодня знают все.' } },
];
// ===== KESISH-MAKETI (F-0924-07, 156-qonun) — manba PmLesson31 CutMock (.cut-*). Ro'yxat so'zlari SHU darsning o'z
// matnidan (bashorat-chiplari + 2-slayd «surat, filtr va izoh») — o'ylab topilgan ficha yo'q. §186: faqat taxmindan KEYIN, 2-slaydda.
const CUT_BURBN = [
  { t: { uz: 'Joy belgilash', ru: 'Отметки мест' }, keep: false },
  { t: { uz: 'Reja tuzish', ru: 'Планы' }, keep: false },
  { t: { uz: 'Surat', ru: 'Фото' }, keep: true },
  { t: { uz: 'Filtr', ru: 'Фильтры' }, keep: true },
  { t: { uz: 'Izoh', ru: 'Комментарии' }, keep: true },
];
const CutMock = () => (
  <div className="cut-wrap" role="img" aria-label={tr({ uz: "Burbn ro'yxati: joy belgilash, reja tuzish, surat, filtr, izoh. Instagram'ga surat, filtr va izoh o'tdi", ru: 'Список Burbn: отметки мест, планы, фото, фильтры, комментарии. В Instagram перешли фото, фильтры и комментарии' })}>
    <div className="cut-col">
      <span className="cut-cap">Burbn</span>
      {CUT_BURBN.map((x, k) => <span key={k} className={`cut-item ${x.keep ? 'keep' : 'gone'}`}>{tr(x.t)}</span>)}
    </div>
    <span className="cut-arrow" aria-hidden="true">→</span>
    <div className="cut-col">
      <span className="cut-cap">Instagram</span>
      {CUT_BURBN.filter(x => x.keep).map((x, k) => <span key={k} className="cut-item keep">{tr(x.t)}</span>)}
    </div>
  </div>
);
// Slayd-rasm emoji-rejimida (pilot naqshi 7-band: .k-fig > .k-photo.emo). 1-slayd — «ko'p narsa»: telefon atrofida
// Burbn'ning ko'p ishi sochilib turadi (xira); 3-slayd — faqat surat qoldi: yakka 📷 va yaltirash. Dekor, matnsiz.
const IG_PHOTO_BG = [`linear-gradient(160deg, ${T.accentSoft}, ${T.paper})`, null, `linear-gradient(160deg, ${T.successSoft}, ${T.paper})`];
const IG_ORBIT = ['📍', '🗓️', '📷', '💬', '⭐', '🎵'];
const IgPhoto = ({ k, ic }) => (
  <span className={`k-photo emo ig-ph ig-ph${k}`} style={{ background: IG_PHOTO_BG[k] || T.bg }} aria-hidden="true">
    {k === 0 && IG_ORBIT.map((e, j) => <i key={j} className="ig-orb" style={{ '--j': j }}>{e}</i>)}
    <span className="k-slide-ic">{k === 2 ? '📷' : ic}</span>
    {k === 2 && <i className="ig-spark">{ic}</i>}
  </span>
);
const ScreenCase = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const [bet, setBet] = useState(() => { const v = storedAnswer?.bet; return Number.isInteger(v) && v >= 0 && v < IG_PREDICT.chips.length ? v : null; });
  const [i, setI] = useState(0);
  const last = i === IG_SLIDES.length - 1;
  const betPending = bet === null;
  useEffect(() => { if (last && !betPending && storedAnswer === undefined) onAnswer(screen, { correct: true, bet }); }, [last, betPending]); // eslint-disable-line
  const betHint = useTurnHint(betPending);
  // Navbat-zanjiri: taxmin → slayd ichidagi «Keyingisi →» → (oxirida) NavNext. Slayd o'z boshqaruvi bilan (PmLesson1 k-nav, pilot B1 / B2).
  const nextTurn = useTurnHint(!betPending && !last && !isMentor);
  const c = IG_SLIDES[i];
  const navLabel = isMentor || (!betPending && last) ? tr(CONT)
    : betPending ? tr({ uz: 'Avval taxminingizni tanlang', ru: 'Сначала выберите свою догадку' })
    : tr({ uz: 'Avval voqeani oxirigacha oching', ru: 'Сначала откройте историю до конца' });
  return (
    <Stage eyebrow={tr({ uz: 'Haqiqiy voqea · Instagram', ru: 'Реальная история · Instagram' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={betPending || !last} disabled={(betPending || !last) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Burbn ilovasida ko'p narsa bor edi. Odamlarga yoqqan <span className="italic" style={{ color: T.accent }}>nimalar qoldi</span>?</>, ru: <>В приложении Burbn было много всего. Что из понравившегося людям <span className="italic" style={{ color: T.accent }}>осталось</span>?</> })}</h2></div>
        {/* 🎓 Metodist: mentor-gap yakuniy (F-0924-03/07, B1/B2 keys-qolipi — javob aytilmaydi) */}
        <Mentor>{tr({ uz: <>Instagram tarixi sizning g'oyangizga ham saboq — avval <b style={{ color: T.ink }}>«Taxmin o'yini»</b>da bitta javobni belgilang.</>, ru: <>История Instagram — урок и для вашей идеи: сначала отметьте один ответ в <b style={{ color: T.ink }}>«Игре в догадки»</b>.</> })}</Mentor>
        <div className={`kp-bet fade-up delay-1 ${bet !== null ? 'done' : ''}`}>
          <span className="k-slide-eyebrow">{tr({ uz: "🎲 Taxmin o'yini · ball yo'q", ru: '🎲 Игра в догадки · без баллов' })}</span>
          <p className="kp-q">{tr({ uz: "Instagram asoschilari avval Burbn degan ilova qilgan. Unda ko'p narsa bor edi: joy belgilash, reja tuzish, surat va yana boshqalar. Odamlarga undagi qaysi narsa yoqqan?", ru: 'Основатели Instagram сначала сделали приложение Burbn. В нём было много всего: отметки мест, планы, фото и многое другое. Что из этого нравилось людям?' })}</p>
          <div className="kp-chips">
            {IG_PREDICT.chips.map((ch, k) => {
              const locked = bet !== null;
              const isAns = k === IG_PREDICT.ans;
              let cls = 'kp-chip';
              if (locked) { cls += ' locked'; if (isAns) cls += ' correct'; else if (bet === k && !isMentor) cls += ' wrong'; }
              else cls += waveCls(betHint, k, IG_PREDICT.chips.length);
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
            : !isMentor && <p className={`kp-res ${bet === IG_PREDICT.ans ? 'hit' : 'miss'}`}>{bet === IG_PREDICT.ans ? tr({ uz: '🎯 Topdingiz!', ru: '🎯 Угадали!' }) : tr({ uz: <>Adashdingiz — asl javob «{tr(IG_PREDICT.chips[IG_PREDICT.ans].t)}».</>, ru: <>Не угадали — верный ответ «{tr(IG_PREDICT.chips[IG_PREDICT.ans].t)}».</> })}</p>}
        </div>
        {bet !== null && (
          <div className="k-slide ph fade-step revealed" key={i}>
            <span className="k-slide-eyebrow">{i + 1} / {IG_SLIDES.length}</span>
            <div className="k-fig">{i === 1 ? <CutMock /> : <IgPhoto k={i} ic={c.ic} />}</div>
            <p className="k-slide-body">{tr(c.body)}</p>
            <div className="k-nav">
              <button type="button" className="btn-soft k-prev" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущий' })}</button>
              <div className="k-dots">{IG_SLIDES.map((_, k) => <button key={k} type="button" className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-bosqich`, ru: `Шаг ${k + 1}` })} />)}</div>
              {!last && <button type="button" className={`k-next${nextTurn ? ' turn-ring' : ''}`} onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Следующий →' })}</button>}
            </div>
          </div>
        )}
        {bet !== null && last && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({
          uz: <>Instagram birinchi kuni uchta narsa bilan chiqdi — bu uning <b>birinchi versiyasi</b> (MVP). Birinchi versiyada hamma narsa emas, eng kerakli bo'laklar bo'ladi.</>,
          ru: <>В первый день Instagram вышел с тремя вещами — это его <b>первая версия</b> (MVP). В первой версии не всё, а самые нужные части.</>,
        })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 8 — TEST-2 =====
const T2 = {
  lead: { uz: "eMaktab bo'laklari tarozidan o'tdi.", ru: 'Части eMaktab прошли через весы.' },
  ask: { uz: "Birinchi versiyaga qaysi bo'laklar kiradi?", ru: 'Какие части войдут в первую версию?' },
  list: [
    { t: { uz: "Saytning asosiy ishi uchun zarur va qisqa vaqtda tayyor bo'ladigan bo'laklar", ru: 'Части, которые нужны для главного дела сайта и готовятся за короткое время' } },
    { t: { uz: "Tez tayyor bo'ladigan, lekin saytning asosiy ishiga kerak bo'lmagan bo'laklar", ru: 'Части, которые готовятся быстро, но не нужны для главного дела сайта' }, why: { uz: "Tez tayyor bo'lishi yetarli emas. U saytning asosiy ishiga kerak bo'lishi ham kerak.", ru: 'Быстро подготовить — мало. Часть должна быть нужна и для главного дела сайта.' } },
    { t: { uz: "Saytning asosiy ishiga kerak, lekin uzoq vaqtda tayyor bo'ladigan bo'laklar", ru: 'Части, которые нужны для главного дела сайта, но готовятся долго' }, why: { uz: "Bu bo'lak foydali, lekin birinchi versiyani kechiktiradi. Uni keyingi versiyaga qoldiramiz.", ru: 'Эта часть полезна, но задержит первую версию. Оставим её для следующей версии.' } },
    { t: { uz: "Boshqa maktab saytlarida allaqachon bor bo'lgan barcha bo'laklar", ru: 'Все части, которые уже есть на других школьных сайтах' }, why: { uz: "Boshqa saytda borligi hech narsani hal qilmaydi. Savol boshqa: busiz sayt o'z ishini qila oladimi?", ru: 'То, что это есть на другом сайте, ничего не решает. Вопрос в другом: справится ли сайт без этого со своим делом?' } },
  ],
  ok: { uz: "To'g'ri. Tarozining ikkala savoliga javob «kerak va tez» bo'lsa — bo'lak birinchi versiyaga kiradi.", ru: 'Верно. Если на оба вопроса весов ответ «нужна и быстро» — часть входит в первую версию.' },
};
const ScreenT2 = (props) => <TestScreen {...props} id="s8" n={2} lead={T2.lead} ask={T2.ask} list={T2.list} explainCorrect={T2.ok} />;

// ===== SCREEN 9 — BIRINCHI VERSIYA RO'YXATI: 8 bo'lak tarozidan o'tadi → 🔥 da 3 ta qoladi → simulyatsiya =====
// 🏅 Launch List! — mehnat nishoni: simulyatsiya o'quvchi TANLAGAN uchta bo'lak bilan ishga tushganda (AchRule yo'q).
const ScreenLaunch = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  // F-0915-02: saqlangan joylar — faqat ma'lum bo'lak va ma'lum joy (boshqa ekranning javobi bu yerga tushsa ham yiqilmaydi)
  const [zones, setZones] = useState(() => { const z = storedAnswer && storedAnswer.zones; const o = {}; if (z && typeof z === 'object' && !Array.isArray(z)) EM_PIECES.forEach(p => { if (ZONES.some(q => q.id === z[p.id])) o[p.id] = z[p.id]; }); return o; });
  const [cur, setCur] = useState({ main: null, time: null });
  const [sel, setSel] = useState(null);
  const [landId, setLandId] = useState(null);
  const [sim, setSim] = useState(() => (storedAnswer && storedAnswer.solved ? 3 : -1)); // -1 — ishga tushmagan · 0..3 — nechta ✓ chiqdi
  const next = EM_PIECES.find(p => !zones[p.id]);
  const allIn = !next;
  const items = EM_PIECES.filter(p => zones[p.id]).map(p => ({ id: p.id, ic: p.ic, label: tr(p.t), zone: zones[p.id] }));
  const fire = EM_PIECES.filter(p => zones[p.id] === 'fire');
  const ready = allIn && fire.length === 3;
  const done = sim >= 3;
  const answer = (qi, v) => {
    const c = qi === 0 ? { ...cur, main: v } : { ...cur, time: v };
    setCur(c);
    if (c.main !== null && c.time !== null && next) {
      const id = next.id;
      setZones(z => ({ ...z, [id]: zoneOf(c.main, c.time) }));
      setLandId(id);
      setCur({ main: null, time: null });
    }
  };
  const move = (id, zone) => { setZones(z => ({ ...z, [id]: zone })); setSel(null); setLandId(id); setSim(-1); };
  const start = () => { if (!ready) return; setSel(null); setSim(0); };
  useEffect(() => {
    if (sim < 0 || sim >= 3) return;
    if (reduceMotion()) { setSim(3); return; }
    const t = setTimeout(() => setSim(s => s + 1), 700);
    return () => clearTimeout(t);
  }, [sim]);
  useEffect(() => {
    if (sim !== 3) return;
    if (!(storedAnswer && storedAnswer.solved)) { onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'royxat', solved: true, correct: true, picked: true, zones, birinchiVersiya: fire.map(p => p.t.uz) }); sendPractice(live, screen); }
  }, [sim]); // eslint-disable-line
  const runTurn = useTurnHint(ready && sim < 0 && !isMentor);
  const navLabel = done || isMentor ? tr(CONT)
    : !allIn ? tr({ uz: `① Bo'laklarni tarozidan o'tkazing (${items.length}/8)`, ru: `① Проведите части через весы (${items.length}/8)` })
    : fire.length < 3 ? tr({ uz: `② 🔥 ga yana ${3 - fire.length} ta bo'lak o'tkazing`, ru: `② Перенесите в 🔥 ещё частей: ${3 - fire.length}` })
    : fire.length > 3 ? tr({ uz: `② 🔥 dan ${fire.length - 3} ta bo'lakni boshqa joyga o'tkazing`, ru: `② Перенесите из 🔥 в другое место частей: ${fire.length - 3}` })
    : tr({ uz: "③ «Saytni ochish»ni bosing", ru: '③ Нажмите «Открыть сайт»' });
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · birinchi versiya', ru: 'Практика · первая версия' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done && !isMentor} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>eMaktab saytining birinchi versiyasida qaysi <span className="italic" style={{ color: T.accent }}>uchta bo'lak</span> ishlaydi?</>, ru: <>Какие <span className="italic" style={{ color: T.accent }}>три части</span> будут работать в первой версии сайта eMaktab?</> })}</h2>
        </div>
        {/* 🎓 Metodist: mentor-gap yakuniy (F-0924-03, §210 qolipi — NEGA + bitta chorlov, joy so'zisiz) */}
        {/* F-0925-B06: mashq sharti (kulrang lead-note edi — bola o'tkazib yuborardi) mentor gapiga ko'chdi: «nega aynan 3 ta?» javobi shu yerda */}
        <Mentor>{tr({ uz: <>Bu mashqda shart shunday: saytni bir kishi bir hafta ichida ishga tushiradi — shuning uchun faqat eng kerakli va tez tayyor bo'ladigan <b style={{ color: T.ink }}>3 ta bo'lak</b> sig'adi. Sakkiz bo'lakni birma-bir torting — <b style={{ color: T.ink }}>① savolga</b> javob bering.</>, ru: <>Условие упражнения такое: сайт запускает один человек за одну неделю, — поэтому поместятся только <b style={{ color: T.ink }}>3 части</b>: самые нужные и те, что готовятся быстро. Взвесьте восемь частей по одной — ответьте на <b style={{ color: T.ink }}>вопрос ①</b>.</> })}</Mentor>
        <div className="split">
          <Col>
            {next ? (
              <>
                <span className="flow-label">{tr({ uz: `Tarozida: ${items.length + 1}-bo'lak / 8`, ru: `На весах: часть ${items.length + 1} из 8` })}</span>
                <Scale label={tr(next.t)} ic={next.ic} main={cur.main} time={cur.time} onMain={(v) => answer(0, v)} onTime={(v) => answer(1, v)} pulse={!isMentor} />
              </>
            ) : sim < 0 ? (
              <div className="ln-ctl fade-step">
                {fire.length > 3 && <p className="zb-warn">{tr(FOUR_MSG)}</p>}
                <p className="small" style={{ color: T.ink2, margin: 0 }}>{tr(MOVE_HINT)}</p>
                <button type="button" className={`swed-save${runTurn ? ' turn-ring' : ''}`} disabled={!ready} onClick={start}>▶ {tr({ uz: 'Saytni ochish', ru: 'Открыть сайт' })}</button>
              </div>
            ) : (
              <Zoomable><BrowserFrame className="sim fade-step">
                <p className="sim-h">{tr({ uz: "Sayt ochildi. O'quvchi kirdi:", ru: 'Сайт открылся. Зашёл ученик:' })}</p>
                {/* 3-ekrandagi plitkalar oilasi: o'quvchi tanlagan uchta bo'lak birma-bir «yonadi» */}
                <div className="sim-grid">
                  {fire.map((p, k) => (
                    <div key={p.id} className={`sim-row ${sim > k ? 'ok' : ''}`}><span className="sim-ic" aria-hidden="true">{p.ic}</span><span className="sim-t">{tr(p.t)}</span><b className="sim-ck" aria-hidden="true">{sim > k ? '✓' : '…'}</b>
                      {/* Sayt ochilgach bo'lak o'z sahifasining haqiqiy qatorini ko'rsatadi (material, bo'sh chiziq emas) */}
                      {sim > k && <span className="em-mat sim-mat fade-step" aria-hidden="true"><span>{tr(EM_MAT[p.id][0].k)}</span><b>{tr(EM_MAT[p.id][0].v)}</b></span>}</div>
                  ))}
                </div>
                {done && <p className="sim-end fade-step">✓ {tr({ uz: 'Sayt ishlaydi.', ru: 'Сайт работает.' })}</p>}
              </BrowserFrame></Zoomable>
            )}
            {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Nega uchta? Bir haftada bitta odam uchta bo'lakni tugata oladi. Vaqt ko'proq bo'lsa, son ham boshqacha bo'lardi.", ru: 'Почему три? За неделю один человек успевает закончить три части. Если бы времени было больше, и число было бы другим.' })}</p></div>}
            <StudentPracticePulse live={live} screen={screen} />
          </Col>
          <Col>
            <span className="flow-label col-cap">{tr({ uz: `Uch joy · 🔥 da ${fire.length}/3`, ru: `Три места · в 🔥 ${fire.length}/3` })}</span>
            <ZoneBoard items={items} sel={sel} onSel={setSel} onMove={allIn && !done ? move : null} landId={landId} compact />
          </Col>
        </div>
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '🚀 Saytni ochganlar', ru: '🚀 Кто открыл сайт' })} />
        <MentorNote>{tr(MENTOR_FREE)}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — O'Z BIRINCHI VERSIYANGIZ (ustaxona): kartadagi 2 yechim → bo'lak; yana 2–4 bo'lak → tarozi → 🔥 ≤ 3 =====
// Karta bo'lmasa (boshqa kompyuter) — 1-darsning 4 tayyor g'oyasi tanlov bo'lib chiqadi, tanlagach 4 bo'lakni o'zi yozadi (D-3).
// 🏅 First Version! — mehnat nishoni: «Saqlash» (uch shart bajarilganda). Saqlanadi: cardWrite({ bolaklar, birinchiVersiya }).
const ideaById = (id) => READY_IDEAS.find(x => x.id === id) || null;
const cardPieces = (card) => {
  if (!card) return [];
  const ys = Array.isArray(card.yechimlar) ? card.yechimlar.map(y => clean(y && y.qiladi)).filter(filled) : [];
  if (ys.length) return ys.slice(0, 2);
  return filled(card.qiladi) ? [clean(card.qiladi)] : [];
};
const hasOwnCard = (card) => !!(card && (filled(card.kim) || filled(card.ogir) || cardPieces(card).length));
let __pid = 0;
const newPiece = (text = '', ready = false) => ({ id: `p${Date.now().toString(36)}${++__pid}`, text, ready, main: null, time: null, zone: null });
const PIECE_PH = [
  { uz: "Sayt nima qiladi? Masalan: ro'yxatni ko'rsatadi", ru: 'Что делает сайт? Например: показывает список' },
  { uz: 'Masalan: eslatma yuboradi', ru: 'Например: присылает напоминание' },
  { uz: "Masalan: tanlanganini saqlab qo'yadi", ru: 'Например: сохраняет выбранное' },
  { uz: 'Masalan: kerakli narsani qidirib topadi', ru: 'Например: находит нужное' },
];
const ScreenMyVersion = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const card = useMemo(() => cardSafe(), []);
  const own = hasOwnCard(card);
  const [ideaId, setIdeaId] = useState(() => card.ideaId || '');
  const idea = !own ? ideaById(ideaId) : null;
  // Faqat shu dars yozgan shakl ({ nom, joy }) olinadi: 3/4-o'tish «Nima quramiz» shu kalitga bolaklar: [matn] yozadi.
  const myBol = Array.isArray(card.bolaklar) ? card.bolaklar.filter(b => b && typeof b === 'object' && typeof b.nom === 'string' && filled(b.nom) && ZONES.some(z => z.id === b.joy)) : [];
  const [pieces, setPieces] = useState(() => {
    if (myBol.length) {
      return myBol.map(b => ({ ...newPiece(b.nom, !!b.tayyor), zone: b.joy, main: 1, time: 0 }));
    }
    const ready = cardPieces(card).map(t => newPiece(t, true));
    const rows = ready.slice();
    while (rows.length < 4) rows.push(newPiece());
    return rows;
  });
  const [saved, setSaved] = useState(() => myBol.length > 0);
  const [sel, setSel] = useState(null);
  const [landId, setLandId] = useState(null);
  const [cur, setCur] = useState({ main: null, time: null });
  const everSaved = saved || !!(storedAnswer && storedAnswer.solved);
  const needIdea = !own && !idea;
  const list = pieces.filter(p => filled(p.text));
  const n = list.length;
  const queue = list.find(p => !p.zone);
  const fire = list.filter(p => p.zone === 'fire');
  const ok1 = n >= 4 && n <= 6;
  const ok2 = n > 0 && !queue;
  const ok3 = fire.length <= 3;
  const canSave = !needIdea && ok1 && ok2 && ok3;
  const upd = (id, patch) => { setPieces(ps => ps.map(p => (p.id === id ? { ...p, ...patch } : p))); setSaved(false); };
  const add = () => { if (pieces.length < 6) { setPieces(ps => [...ps, newPiece()]); setSaved(false); } };
  const del = (id) => { setPieces(ps => ps.filter(p => p.id !== id)); setSaved(false); };
  const answer = (qi, v) => {
    const c = qi === 0 ? { ...cur, main: v } : { ...cur, time: v };
    setCur(c);
    if (c.main !== null && c.time !== null && queue) { upd(queue.id, { main: c.main, time: c.time, zone: zoneOf(c.main, c.time) }); setLandId(queue.id); setCur({ main: null, time: null }); }
  };
  const move = (id, zone) => { upd(id, { zone }); setSel(null); setLandId(id); };
  const save = () => {
    if (!canSave) return;
    const bolaklar = list.map(p => ({ nom: clean(p.text), joy: p.zone, tayyor: p.ready || undefined }));
    const birinchiVersiya = fire.map(p => clean(p.text));
    const patch = { bolaklar, birinchiVersiya };
    if (idea) patch.ideaId = idea.id;
    cardWrite(patch);
    setSaved(true);
    if (!(storedAnswer && storedAnswer.solved)) { onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'versiya', solved: true, correct: true, picked: true, bolaklar, birinchiVersiya }); sendPractice(live, screen); }
  };
  const [focus, setFocus] = useState(false);
  const pendRows = pieces.filter(p => !filled(p.text)).map(p => p.id);
  const litF = useTurnWalk(n < 4 ? pendRows : [], !focus && !needIdea && !isMentor);
  const saveTurn = useTurnHint(canSave && !saved && !isMentor);
  const ideaWave = useTurnHint(needIdea && !isMentor); // kartasiz o'quvchi: navbat avval tayyor g'oyada (mentor-gap shu halqada)
  const navLabel = isMentor || (everSaved && saved) ? tr(CONT)
    : needIdea ? tr({ uz: "Avval tayyor g'oyani tanlang", ru: 'Сначала выберите готовую идею' })
    : !ok1 ? (n < 4 ? tr({ uz: `① Yana ${4 - n} ta bo'lak yozing`, ru: `① Напишите ещё частей: ${4 - n}` }) : tr({ uz: "① Ko'pi bilan 6 ta bo'lak qoldiring", ru: '① Оставьте не больше 6 частей' }))
    : !ok2 ? tr({ uz: "② Bo'laklarni tarozidan o'tkazing", ru: '② Проведите части через весы' })
    : !ok3 ? tr({ uz: `③ 🔥 dan ${fire.length - 3} ta bo'lakni boshqa joyga o'tkazing`, ru: `③ Перенесите из 🔥 в другое место частей: ${fire.length - 3}` })
    : tr({ uz: "✓ «Saqlash»ni bosing", ru: '✓ Нажмите «Сохранить»' });
  const specs = [
    { ok: ok1, t: { uz: "4–6 ta bo'lak", ru: '4–6 частей' } },
    { ok: ok2, t: { uz: "Hammasi tarozidan o'tdi", ru: 'Все прошли через весы' } },
    { ok: ok3 && ok2, t: { uz: "🔥 da ko'pi bilan 3", ru: 'В 🔥 не больше 3' } },
  ];
  const items = list.filter(p => p.zone).map(p => ({ id: p.id, label: clean(p.text), zone: p.zone }));
  const rowsKim = own ? card.kim : idea ? tr(idea.kim) : '';
  const rowsOgir = own ? card.ogir : idea ? tr(idea.ogir) : '';
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot · o'z g'oyangiz ✍️", ru: 'Практика · ваша идея ✍️' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!saved && !isMentor} disabled={!(everSaved && saved) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 12 }}>
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>Tanlagan g'oyangizning birinchi versiyasida <span className="italic" style={{ color: T.accent }}>nimalar ishlaydi</span>?</>, ru: <>Что будет <span className="italic" style={{ color: T.accent }}>работать</span> в первой версии выбранной вами идеи?</> })}</h2>
          {/* Lead + shart-chiplari bitta qatorda (sig'masa o'raladi) — ekran pastga cho'zilmaydi */}
          <div className="lead-row">
            <p className="lead-note fade-up delay-1">{tr({ uz: "Endi o'z g'oyangiz bo'laklarini ham shu tarozidan o'tkazing.", ru: 'Теперь проведите части своей идеи через те же весы.' })}</p>
            <div className="spec-row fade-up delay-1">
              {specs.map((s, i) => <span key={i} className={`spec ${s.ok ? 'ok' : ''}`}>{s.ok ? '✓' : ['①', '②', '③'][i]} {tr(s.t)}</span>)}
            </div>
          </div>
        </div>
        {/* 🎓 Metodist: senariy chorlovi (foydalanuvchi) saqlandi, NEGA qo'shildi; kartasiz o'quvchiga ham gap (B2 needIdea naqshi) */}
        <Mentor>{own
          ? tr({ uz: "Tanlash uchun bo'lak ko'proq bo'lishi kerak — oldingi darsda yozgan 2 yechimingizni bo'lak sifatida oling va ularga yana 2–4 ta bo'lak qo'shing.", ru: 'Чтобы было из чего выбирать, частей нужно больше, — возьмите как части 2 решения с прошлого урока и добавьте к ним ещё 2–4 части.' })
          : needIdea ? tr({ uz: <>Bo'laklarga bo'lish uchun avval g'oya kerak — <b style={{ color: T.ink }}>tayyor g'oyalardan</b> birini tanlang.</>, ru: <>Чтобы делить на части, сначала нужна идея, — выберите одну из <b style={{ color: T.ink }}>готовых идей</b>.</> })
          : tr({ uz: "Tanlash uchun bo'lak ko'proq bo'lishi kerak — tanlagan g'oyangiz uchun kamida 4 ta bo'lak yozing.", ru: 'Чтобы было из чего выбирать, частей нужно больше, — напишите для выбранной идеи хотя бы 4 части.' })}</Mentor>
        <div className="split">
          <Col>
            <span className="flow-label col-cap">✍️ {tr({ uz: "G'oyangiz bo'laklari", ru: 'Части вашей идеи' })}</span>
            {!own && (
              <div className="ip-box">
                {/* 58-qonun: g'oya tanlangach yo'riq-yorliq yig'iladi — tanlangan chip o'zi ko'rinib turadi */}
                {!idea && <span className="flow-label">{tr({ uz: "Tayyor g'oyalardan birini tanlang", ru: 'Выберите одну из готовых идей' })}</span>}
                <div className="ip-row">{READY_IDEAS.map((x, k) => <button key={x.id} type="button" className={`ip-chip ${ideaId === x.id ? 'on' : ''}${waveCls(ideaWave, k, READY_IDEAS.length)}`} onClick={() => { setIdeaId(x.id); setSaved(false); }}>{tr(x.olam)}</button>)}</div>
              </div>
            )}
            {(own || idea) && (
              <div className="ic-card">
                {own && <span className="ic-h">🗂 {tr({ uz: 'Kartangiz', ru: 'Ваша карточка' })}</span>}
                <div className="ic-row"><span className="ic-lbl kim">{tr({ uz: 'KIM', ru: 'КТО' })}</span><span className="ic-val">{rowsKim || '—'}</span></div>
                <div className="ic-row"><span className="ic-lbl ogir">{tr({ uz: 'MUAMMO', ru: 'ПРОБЛЕМА' })}</span><span className="ic-val">{rowsOgir || '—'}</span></div>
              </div>
            )}
            <div className="pc-list">
              {pieces.map((p, i) => (
                <div key={p.id} className={`pc-row ${filled(p.text) ? 'on' : ''}${turnCls(litF, p.id, pendRows.length > 1)}`}>
                  <span className="pc-n mono" style={{ color: filled(p.text) ? T.success : T.ink3 }}>{filled(p.text) ? '✓' : i + 1}</span>
                  <input value={p.text} disabled={needIdea && !isMentor} maxLength={70} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                    onChange={e => upd(p.id, { text: e.target.value })} placeholder={p.ready ? '' : tr(PIECE_PH[i % PIECE_PH.length])} />
                  {p.ready ? <span className="pc-tag">{tr({ uz: 'kartadan', ru: 'из карточки' })}</span>
                    : pieces.length > 4 && <button type="button" className="pc-del" onClick={() => del(p.id)} aria-label={tr({ uz: "O'chirish", ru: 'Удалить' })}>✕</button>}
                </div>
              ))}
              {pieces.length < 6 && <button type="button" className="btn-soft" style={{ alignSelf: 'flex-start' }} disabled={needIdea && !isMentor} onClick={add}>+ {tr({ uz: "Bo'lak qo'shish", ru: 'Добавить часть' })}</button>}
            </div>
          </Col>
          <Col>
            {queue ? (
              <>
                <span className="flow-label col-cap">⚖️ {tr({ uz: 'Tarozida', ru: 'На весах' })}</span>
                <Scale label={clean(queue.text)} main={cur.main} time={cur.time} onMain={(v) => answer(0, v)} onTime={(v) => answer(1, v)} pulse={!isMentor && ok1 && !focus} />
              </>
            ) : <>
              <span className="flow-label col-cap">{tr({ uz: `Uch joy · 🔥 da ${fire.length}/3`, ru: `Три места · в 🔥 ${fire.length}/3` })}</span>
              {n > 0 && <p className="small" style={{ color: T.ink2, margin: 0 }}>{tr(MOVE_HINT)}</p>}
            </>}
            <ZoneBoard items={items} sel={sel} onSel={setSel} onMove={move} landId={landId} compact />
            {/* 58-qonun: ogohlantirish «Saqlash» bilan bir qatorda (ikkalasi bir vaqtda — saqlash o'chiq) — ekran pastga cho'zilmaydi */}
            <div className="swed-btns">
              {fire.length > 3 && <p className="zb-warn fade-step" style={{ flex: 1, minWidth: 0 }}>{tr(FOUR_MSG)}</p>}
              {saved && <div className="done-mini fade-step">✓ {tr({ uz: 'Birinchi versiya tanlandi', ru: 'Первая версия выбрана' })}</div>}
              <button type="button" className={`swed-save${saveTurn ? ' turn-ring' : ''}`} disabled={!canSave || saved} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
            </div>
            <StudentPracticePulse live={live} screen={screen} />
          </Col>
        </div>
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '🔥 Birinchi versiyasini saqlaganlar', ru: '🔥 Кто сохранил первую версию' })} />
        <MentorNote>{tr(MENTOR_FREE)}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 11 — TUSHUNISH CHIZIG'I: gap so'zma-so'z chiqadi, chiziq kasbiy so'zlarda tushadi (imzo-vizual) =====
// Namuna-gap ataylab kasbiy so'zli («bazada», «serverdan») — senariy halol izohi (b). Topilgan so'z YASHIL+✓; qizil — faqat noto'g'ri bosilganda.
const LINE_WORDS = {
  uz: [{ w: 'Baholar', v: 82 }, { w: 'bazada', v: 24, bad: true }, { w: 'saqlanadi,', v: 44 }, { w: 'serverdan', v: 12, bad: true }, { w: 'telefonga', v: 46 }, { w: 'keladi.', v: 56 }],
  ru: [{ w: 'Оценки', v: 82 }, { w: 'хранятся', v: 70 }, { w: 'в базе,', v: 24, bad: true }, { w: 'приходят', v: 40 }, { w: 'с сервера', v: 12, bad: true }, { w: 'на телефон.', v: 50 }],
};
const ScreenLine = ({ screen, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const words = __lang === 'ru' ? LINE_WORDS.ru : LINE_WORDS.uz;
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(() => (reduceMotion() ? words.length : 0));
  const [found, setFound] = useState(() => new Set());
  const [miss, setMiss] = useState(null);
  useEffect(() => {
    if (shown >= words.length) return;
    const t = setTimeout(() => setShown(s => s + 1), shown === 0 ? 500 : 650);
    return () => clearTimeout(t);
  }, [shown, run]); // eslint-disable-line
  useEffect(() => { if (miss === null) return; const t = setTimeout(() => setMiss(null), 700); return () => clearTimeout(t); }, [miss]);
  const replay = () => { setShown(reduceMotion() ? words.length : 0); setRun(r => r + 1); };
  const tap = (i) => { if (i >= shown) return; if (words[i].bad) setFound(p => { const n = new Set(p); n.add(i); return n; }); else setMiss(i); };
  const need = words.filter(w => w.bad).length;
  const all = found.size >= need;
  // Navbat-pulsi (F-0924-08): gap to'liq chiqqach hali bosilmagan so'zlar bo'ylab yuradi (hammasi — javob oldindan ko'rinmasin).
  const pendW = shown >= words.length && !all ? words.map((_, k) => k).filter(k => !found.has(k)) : [];
  const litW = useTurnWalk(pendW, !isMentor);
  // Chiziq har so'zning USTIDA turadi: nuqta x = so'z ustunining o'rtasi (so'zlar pastda shu ustunlar bo'yicha tizilgan).
  const W = 600, H = 150, pad = 18;
  const xs = (i) => pad + ((W - pad * 2) * (i + 0.5)) / words.length;
  const ys = (v) => H - 12 - ((H - 30) * v) / 100;
  const pts = [[pad, ys(72)], ...words.slice(0, shown).map((w, i) => [xs(i), ys(w.v)])];
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  const area = `${path} L${last[0].toFixed(1)} ${H} L${pad} ${H} Z`;
  const tipV = shown > 0 ? words[shown - 1].v : 72;
  return (
    <Stage eyebrow={tr({ uz: '2-qism · Kod bilmaydigan odamga', ru: 'Часть 2 · Человеку без кода' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all} label={all || isMentor ? tr(CONT) : tr({ uz: `Chiziq tushgan so'zlarni bosing (${found.size}/${need})`, ru: `Нажмите слова, где линия падает (${found.size}/${need})` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Buviga eMaktabni tushuntiryapsiz. Qaysi so'zda u sizni <span className="italic" style={{ color: T.accent }}>tushunmay qoladi</span>?</>, ru: <>Вы объясняете eMaktab бабушке. На каком слове она <span className="italic" style={{ color: T.accent }}>перестаёт понимать</span>?</> })}</h2></div>
        {/* 🎓 Metodist: NEGA-qism yakuniy (F-0924-03); chorlov senariydan, element nomi <b> da */}
        <Mentor>{tr({ uz: <>Notanish so'zda tinglovchi adashib qoladi — <b style={{ color: T.ink }}>chiziq tushgan so'zlarni</b> bosing.</>, ru: <>На незнакомом слове слушатель теряется — нажмите <b style={{ color: T.ink }}>слова, где линия падает</b>.</> })}</Mentor>
        <div className="ul fade-up delay-1" key={run}>
          <button type="button" className="gv-replay" onClick={replay} aria-label={tr({ uz: "Qayta ko'rsatish", ru: 'Показать снова' })}>↻</button>
          <span className="ul-lbl">👵 {tr({ uz: 'Buvi qanchalik tushunyapti', ru: 'Насколько бабушка понимает' })}</span>
          <div className="ul-chart" aria-hidden="true">
            <svg className="ul-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
              <defs><linearGradient id="ulFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={T.accent} stopOpacity="0.16" /><stop offset="1" stopColor={T.accent} stopOpacity="0" /></linearGradient></defs>
              <rect x={pad} y={ys(50)} width={W - pad * 2} height={H - ys(50)} className="ul-low" />
              <line x1={pad} x2={W - pad} y1={ys(50)} y2={ys(50)} className="ul-mid" />
              <path d={area} className="ul-area" fill="url(#ulFill)" />
              <path d={path} className="ul-path" />
            </svg>
            <span className="ul-ax hi">🙂</span><span className="ul-ax lo">😕</span>
            {pts.slice(1).map((p, i) => <span key={i} className={`ul-dot ${found.has(i) ? 'got' : ''}`} style={{ left: `${(p[0] / W) * 100}%`, top: `${(p[1] / H) * 100}%` }} />)}
            {shown > 0 && <span className={`ul-face ${tipV < 50 ? 'sad' : ''}`} key={`f${shown}`} style={{ left: `${(last[0] / W) * 100}%`, top: `${(last[1] / H) * 100}%` }}>👵{tipV < 50 ? '❓' : ''}</span>}
          </div>
          <p className="ul-sent" style={{ '--n': words.length, '--pad': `${(pad / W) * 100}%` }}>
            {words.map((w, i) => (
              <button key={i} type="button" disabled={i >= shown || found.has(i)} onClick={() => tap(i)}
                className={`ul-w ${i < shown ? 'in' : ''} ${found.has(i) ? 'got' : ''} ${miss === i ? 'miss' : ''}${turnCls(litW, i, pendW.length > 1)}`}>{w.w}{found.has(i) && <b aria-hidden="true"> ✓</b>}</button>
            ))}
          </p>
          {/* Holat-paneli: nechta so'z topilgani ko'rinib turadi — bo'sh uya topilgan so'z bilan to'ladi (javob oldindan ochilmaydi) */}
          <div className="ul-found" aria-hidden="true">
            <span className="flow-label">🔎 {tr({ uz: "Chiziq tushgan so'zlar", ru: 'Слова, где линия падает' })}</span>
            {words.map((w, i) => (w.bad ? i : null)).filter(i => i !== null).map((i, k) => (
              <span key={k} className={`ul-slot ${found.has(i) ? 'got' : ''}`}>{found.has(i) ? <>✓ {words[i].w.replace(/[.,]$/, '')}</> : '?'}</span>
            ))}
            <span className="ul-count mono">{found.size}/{need}</span>
          </div>
        </div>
        {all && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({
          uz: <>Faqat kod yozadiganlar tushunadigan bunday so'z <b>kasbiy so'z</b> deyiladi. Uni tinglovchi biladigan oddiy so'z bilan almashtiring. Buviga shunday deysiz: «Baholar maktab jurnaliga yoziladi va siz ularni telefonda ko'rasiz.»</>,
          ru: <>Такое слово, понятное только тем, кто пишет код, называется <b>профессиональным словом</b>. Замените его простым словом, которое знает слушатель. Бабушке вы скажете так: «Оценки записываются в школьный журнал, и вы видите их в телефоне».</>,
        })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== SCREEN 12 — TEST-3 =====
const T3 = {
  lead: { uz: 'Buvi faqat bitta narsani bilmoqchi: nabirasining baholari qanday.', ru: 'Бабушка хочет узнать только одно: какие оценки у внука.' },
  ask: { uz: 'Qaysi gapdan boshlasangiz, u oxirigacha tinglaydi?', ru: 'С какой фразы начать, чтобы она дослушала до конца?' },
  list: [
    { t: { uz: "Endi nabirangizning bahosini telefoningizda ko'rasiz", ru: 'Теперь оценки внука вы увидите в своём телефоне' } },
    { t: { uz: "Sayt nabirangizning baholari uchun uchta bo'lakdan qurildi", ru: 'Сайт для оценок вашего внука собран из трёх частей' }, why: { uz: 'Bu sayt qanday qurilgani haqida. Buvi esa bahoni bilmoqchi.', ru: 'Это о том, как построен сайт. А бабушка хочет узнать оценку.' } },
    { t: { uz: 'Nabirangizning baholari bazada turadi, sahifa ularni chiqaradi', ru: 'Оценки вашего внука лежат в базе, страница выводит их' }, why: { uz: "«Baza» — kasbiy so'z. Buvi aynan shu yerda tushunmay qoladi.", ru: '«База» — профессиональное слово. Именно здесь бабушка перестаёт понимать.' } },
    { t: { uz: 'Men nabirangizning baholari uchun bu saytni bir hafta qurdim', ru: 'Я неделю строил этот сайт для оценок вашего внука' }, why: { uz: 'Bu gap siz haqingizda. Mehnatingizni oxirida aytsangiz ham bo\'ladi.', ru: 'Эта фраза о вас. О своём труде можно сказать и в конце.' } },
  ],
  // 🎓 Metodist OQLANDI: oxirgi gap («Avval tinglovchi oladigan foyda aytiladi.») — senariy qaydi «qoida shu yerda ochiq aytiladi»; 19-ekran flashcard shu gapga tayanadi.
  ok: { uz: "To'g'ri. Birinchi gapda buvi bilmoqchi bo'lgan narsa turibdi. Sayt nimadan qurilgani — keyin. Avval tinglovchi oladigan foyda aytiladi.", ru: 'Верно. В первой фразе — то, что бабушка хочет узнать. Из чего сделан сайт — потом. Сначала говорят о пользе, которую получит слушатель.' },
};
const ScreenT3 = (props) => <TestScreen {...props} id="s12" n={3} lead={T3.lead} ask={T3.ask} list={T3.list} explainCorrect={T3.ok} />;

// ===== SCREEN 13 — O'XSHATISH: saytning uch qismi ↔ buviga tanish uch narsa (+2 chalg'ituvchi kasbiy so'z) =====
const OX_PARTS = [
  { id: 'kor', t: { uz: "Ko'rinadigan qism", ru: 'Видимая часть' }, a: 'sahifa', full: { uz: "Ko'rinadigan qism — qog'oz kundalikning sahifasiga o'xshaydi.", ru: 'Видимая часть похожа на страницу бумажного дневника.' } },
  { id: 'ish', t: { uz: 'Saytning ishlashi', ru: 'Работа сайта' }, a: 'rahbar', full: { uz: "Saytning ishlashi — sinf rahbari jurnaldan bahoni topib, kundalikka yozishiga o'xshaydi.", ru: 'Работа сайта похожа на то, как классный руководитель находит оценку в журнале и записывает её в дневник.' } },
  { id: 'joy', t: { uz: "Ma'lumot saqlanadigan joy", ru: 'Место, где хранятся данные' }, a: 'jurnal', full: { uz: "Ma'lumot saqlanadigan joy — maktab jurnaliga o'xshaydi.", ru: 'Место, где хранятся данные, похоже на школьный журнал.' } },
];
const OX_OPTS = [
  { id: 'rahbar', t: { uz: 'sinf rahbari jurnaldan bahoni topib, kundalikka yozishi', ru: 'классный руководитель находит оценку в журнале и записывает её в дневник' } },
  { id: 'server', bad: true, t: { uz: 'server', ru: 'сервер' } },
  { id: 'sahifa', t: { uz: "qog'oz kundalikning sahifasi", ru: 'страница бумажного дневника' } },
  { id: 'baza', bad: true, t: { uz: "ma'lumotlar bazasi", ru: 'база данных' } },
  { id: 'jurnal', t: { uz: 'maktab jurnali', ru: 'школьный журнал' } },
];
const OX_BAD_MSG = { uz: "Bu o'xshatish emas, yana bitta kasbiy so'z.", ru: 'Это не сравнение, а ещё одно профессиональное слово.' };
const ScreenAnalogy = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [got, setGot] = useState(() => new Set(storedAnswer && storedAnswer.solved ? OX_PARTS.map(p => p.id) : []));
  const [selPart, setSelPart] = useState(null);
  const [miss, setMiss] = useState(null);
  const [badMsg, setBadMsg] = useState(false);
  const all = got.size >= OX_PARTS.length;
  const active = selPart && !got.has(selPart) ? selPart : (OX_PARTS.find(p => !got.has(p.id)) || {}).id;
  useEffect(() => { if (miss === null) return; const t = setTimeout(() => setMiss(null), 700); return () => clearTimeout(t); }, [miss]);
  useEffect(() => {
    if (!all || (storedAnswer && storedAnswer.solved)) return;
    onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'oxshat', solved: true, correct: true, picked: true });
    sendPractice(live, screen);
  }, [all]); // eslint-disable-line
  const pickOpt = (o) => {
    if (all) return;
    if (o.bad) { setBadMsg(true); setMiss(o.id); return; }
    const part = OX_PARTS.find(p => p.id === active);
    if (part && part.a === o.id) { setGot(p => { const n = new Set(p); n.add(part.id); return n; }); setSelPart(null); setBadMsg(false); }
    else setMiss(o.id);
  };
  const usedOpt = new Set(OX_PARTS.filter(p => got.has(p.id)).map(p => p.a));
  const optWave = useTurnHint(!all && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: '2-qism · Kod bilmaydigan odamga', ru: 'Часть 2 · Человеку без кода' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all && !isMentor} label={all || isMentor ? tr(CONT) : tr({ uz: `Har qismga o'xshatish toping (${got.size}/3)`, ru: `Найдите сравнение для каждой части (${got.size}/3)` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sayt ichida nima bo'lishini buviga <span className="italic" style={{ color: T.accent }}>nimaga o'xshatib</span> tushuntirasiz?</>, ru: <>С <span className="italic" style={{ color: T.accent }}>чем сравнить</span>, чтобы объяснить бабушке, что происходит внутри сайта?</> })}</h2></div>
        {/* 🎓 Metodist: joy so'zi olib tashlandi (§211-3) — ustunlar telefonda ustma-ust tushsa ham gap rost */}
        <Mentor>{tr({ uz: <>Buvi saytning ichini hech qachon ko'rmagan — belgilangan qismga <b style={{ color: T.ink }}>«Buviga tanish narsalar»</b>dan mosini bosing.</>, ru: <>Бабушка никогда не видела, что внутри сайта, — для отмеченной части нажмите подходящее из <b style={{ color: T.ink }}>«Знакомое бабушке»</b>.</> })}</Mentor>
        <div className="split">
          <Col>
            <span className="flow-label col-cap">🌐 {tr({ uz: 'Saytning uch qismi', ru: 'Три части сайта' })}</span>
            {OX_PARTS.map(p => {
              const ok = got.has(p.id);
              return (
                <button key={p.id} type="button" disabled={ok} onClick={() => setSelPart(p.id)} className={`ox-part ${ok ? 'ok' : ''} ${!ok && active === p.id ? 'cur' : ''}`}>
                  <span className="ox-part-t">{ok ? '✓ ' : ''}{tr(p.t)}</span>
                  {ok && <span className="ox-full fade-step">{tr(p.full)}</span>}
                </button>
              );
            })}
          </Col>
          <Col>
            <span className="flow-label col-cap">👵 {tr({ uz: 'Buviga tanish narsalar', ru: 'Знакомое бабушке' })}</span>
            <div className="ox-opts">
              {OX_OPTS.map((o, k) => {
                const used = usedOpt.has(o.id);
                return (
                  <button key={o.id} type="button" disabled={used || all} onClick={() => pickOpt(o)}
                    className={`ox-opt ${used ? 'used' : ''} ${miss === o.id ? 'miss' : ''}${!used && optWave && !got.size ? ` turn-ring turn-wave wv5 w${k + 1}` : ''}`}>{tr(o.t)}</button>
                );
              })}
            </div>
            {badMsg && !all && <p className="zb-warn fade-step">{tr(OX_BAD_MSG)}</p>}
            <StudentPracticePulse live={live} screen={screen} />
          </Col>
        </div>
        {all && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink, fontWeight: 600 }}>{tr({ uz: "Yaxshi o'xshatish tinglovchining o'z hayotidan olinadi.", ru: 'Хорошее сравнение берут из жизни самого слушателя.' })}</p></div>}
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: "🧩 Uch o'xshatishni topganlar", ru: '🧩 Кто нашёл три сравнения' })} />
        <MentorNote>{tr(MENTOR_FREE)}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 14 — TEST-4 =====
const T4 = {
  lead: { uz: "Do'stingiz futbol to'garagiga qatnaydi, kod bilmaydi.", ru: 'Ваш друг ходит в футбольную секцию и не знает код.' },
  ask: { uz: "Unga «ma'lumot saqlanadigan joy»ni qanday tushuntirasiz?", ru: 'Как вы объясните ему, что такое «место, где хранятся данные»?' },
  list: [
    { t: { uz: 'Murabbiyning daftari kabi — kim nechta gol urgani shu yerga yoziladi', ru: 'Как тетрадь тренера — туда записывают, кто сколько голов забил' } },
    { t: { uz: "Serverning xotirasi kabi — jamoaning barcha gollari shu yerda saqlanadi", ru: 'Как память сервера — там хранятся все голы команды' }, why: { uz: "Bu tushuntirish kerak bo'lgan kasbiy so'z, o'xshatish emas.", ru: 'Это профессиональное слово — его самого нужно объяснять. Это не сравнение.' } },
    { t: { uz: "Ma'lumotlar bazasi kabi — har bir o'yin natijasi shu yerda turadi", ru: 'Как база данных — там лежит результат каждой игры' }, why: { uz: "Bu tushuntirish kerak bo'lgan kasbiy so'z, o'xshatish emas.", ru: 'Это профессиональное слово — его самого нужно объяснять. Это не сравнение.' } },
    { t: { uz: "Saytning ichki qismi kabi — o'yin natijalari qayerdadir turadi", ru: 'Как внутренняя часть сайта — результаты игр где-то там лежат' }, why: { uz: "«Ichki qism» hech qanday aniq narsani ko'rsatmaydi.", ru: '«Внутренняя часть» не указывает ни на что конкретное.' } },
  ],
  ok: { uz: "To'g'ri. Murabbiyning daftarini do'stingiz har mashg'ulotda ko'radi — darrov tushunadi. Yaxshi o'xshatish tinglovchining hayotida bor narsadan olinadi.", ru: 'Верно. Тетрадь тренера ваш друг видит на каждой тренировке — сразу поймёт. Хорошее сравнение берут из того, что есть в жизни слушателя.' },
};
const ScreenT4 = (props) => <TestScreen {...props} id="s14" n={4} lead={T4.lead} ask={T4.ask} list={T4.list} explainCorrect={T4.ok} />;

// ===== KASBIY SO'Z DETEKTORI (15 · 16-ekran) — ro'yxat senariy 16-ekranidan (baza · server · API · kod · dizayn · interfeys · funksiya · sozlama) =====
const JARGON_WORDS = { uz: 'baza|server|api|kod|dizayn|interfeys|funksiya|sozlama', ru: 'баз[аеуыо]|сервер|api|код|дизайн|интерфейс|функци|настройк' };
const OX_WORDS = { uz: 'server|baza|kod', ru: 'сервер|баз[аеуыо]|код' };
const JARGON_RE = new RegExp(`(?<![\\p{L}'\\u02BB\\u02BC])(${JARGON_WORDS.uz}|${JARGON_WORDS.ru})`, 'iu');
const OX_JARGON_RE = new RegExp(`(?<![\\p{L}'\\u02BB\\u02BC])(${OX_WORDS.uz}|${OX_WORDS.ru})`, 'iu');
const hasJargon = (s) => JARGON_RE.test(s || '');
const JARGON_MSG = { uz: "Bu kasbiy so'z. Uni tanish so'z bilan ayting.", ru: 'Это профессиональное слово. Замените его знакомым словом.' };
const MarkJargon = ({ text }) => (
  <>{(text || '').split(/(\s+)/).map((tok, i) => (JARGON_RE.test(tok) ? <mark key={i} className="jg">{tok}</mark> : <React.Fragment key={i}>{tok}</React.Fragment>))}</>
);

// ===== SCREEN 15 — BESH GAP (ustaxona): 5 savol → besh gap; kasbiy so'z yozilsa darhol qizil chiziq =====
// 🏅 Plain Words! — mehnat nishoni: «Saqlash» faqat beshta javob to'liq va kasbiy so'zsiz bo'lganda ochiladi.
const GAP_KEY = 'bridge-b3-gaplar';
const GAP_F = [
  { k: 'kim', k2: 'natija', q: { uz: 'Bu sayt kimga yordam beradi va ular endi nimaga erishadi?', ru: 'Кому помогает этот сайт и чего они теперь добьются?' },
    ph: { uz: 'Kimga? Masalan: sinfdoshlarim', ru: 'Кому? Например: моим одноклассникам' }, ph2: { uz: 'Endi nima qiladi? Masalan: vaqtni tejaydi', ru: 'Что они теперь делают? Например: экономят время' } },
  { k: 'muammo', q: { uz: 'Hozirgacha ular nimada qiynalardi?', ru: 'С чем у них были трудности до сих пор?' }, ph: { uz: 'Masalan: kerakli narsani topolmay qiynalardi', ru: 'Например: не могли найти нужное' } },
  { k: 'bolak', q: { uz: "Birinchi versiyada qaysi 3 ta bo'lak ishlaydi?", ru: 'Какие 3 части работают в первой версии?' }, ph: { uz: "Masalan: ro'yxatni ko'rsatadi, eslatma yuboradi va tanlanganini saqlaydi", ru: 'Например: показывает список, присылает напоминание и сохраняет выбранное' } },
  { k: 'oxshat', q: { uz: "Saytning ishlashini tinglovchiga tanish nimaga o'xshatasiz?", ru: 'С чем знакомым слушателю вы сравните работу сайта?' }, ph: { uz: "Masalan: maktabdagi e'lonlar taxtasi", ru: 'Например: школьная доска объявлений' } },
  { k: 'sorov', q: { uz: "Tinglovchidan keyin nima qilishini so'raysiz?", ru: 'О чём вы потом попросите слушателя?' }, ph: { uz: "Masalan: bir hafta sinab ko'rib, fikringizni ayting", ru: 'Например: попробуйте неделю и расскажите, что думаете' } },
];
const GAP_SAMPLE = { uz: { kim: "avtobus kutadigan o'quvchilar", natija: 'avtobus qachon kelishini bilib, bekatda kutmaydi', muammo: 'avtobus qachon kelishini bilmay, bekatda turardi', bolak: "avtobus qayerdaligini xaritada ko'rsatadi, qachon kelishini aytadi va kechiksa ogohlantiradi", oxshat: 'bekatdagi jonli jadval', sorov: "bir hafta sinab ko'rib, fikringizni ayting" } };
// O'zbekcha jo'nalish qo'shimchasi: -ga (k → -ka, q → -qa)
const ga = (s) => { const w = clean(s); const c = w.slice(-1).toLowerCase(); return c === 'k' ? 'ka' : c === 'q' ? 'qa' : 'ga'; };
const joinList = (arr) => {
  const a = arr.map(x => low(clean(x))).filter(Boolean);
  if (a.length <= 1) return a.join('');
  return `${a.slice(0, -1).join(', ')} ${tr({ uz: 'va', ru: 'и' })} ${a[a.length - 1]}`;
};
const buildGaplar = (f) => {
  const v = (k) => clean(f[k]) || '…';
  const t = [
    { uz: `Bu sayt ${v('kim')}${clean(f.kim) ? ga(f.kim) : ''} yordam beradi: endi ular ${v('natija')}.`, ru: `Этот сайт помогает таким людям: ${v('kim')} — теперь они ${v('natija')}.` },
    { uz: `Hozirgacha ular ${v('muammo')}.`, ru: `До сих пор они ${v('muammo')}.` },
    { uz: `Birinchi versiyada sayt ${v('bolak')}.`, ru: `В первой версии сайт ${v('bolak')}.` },
    { uz: `Saytning ishlashi ${v('oxshat')}${clean(f.oxshat) ? ga(f.oxshat) : ''} o'xshaydi.`, ru: `Работа сайта похожа на ${v('oxshat')}.` },
    { uz: `Sizdan bitta iltimos — ${v('sorov')}.`, ru: `У меня к вам одна просьба — ${v('sorov')}.` },
  ];
  return t.map(x => tr(x));
};
// Kartadan to'ladigan maydonlar qolip bilan mos kelsin («…endi ular {natija}. Hozirgacha ular {muammo}.»):
// (1) tayyor g'oyada KIM birlikda («sinf sardori», «o'smir») — «ular» bilan chiqishi uchun ko'plik shakli;
//     o'quvchi kartadagi tayyor matnni o'zgartirmagan bo'lsa ham shu shakl olinadi (1–2-dars uni kartaga ko'chiradi).
// (2) kartadagi «Nimasi og'ir?» hozirgi zamonda («…turadi») — «Hozirgacha» bilan o'tgan zamonga («…turardi», savol shakli).
const IDEA_MANY = {
  sinf: { kim: { uz: 'sinf sardorlari', ru: 'старосты классов' }, natija: { ru: 'покупают подарок вовремя и без ссор' }, muammo: { ru: 'путают, кто сдал деньги, а кто нет' } },
  kiyim: { kim: { uz: "internetdan kiyim oladigan o'smirlar", ru: 'подростки, покупающие одежду онлайн' }, natija: { ru: 'с первого раза получают подходящую одежду' }, muammo: { uz: "olgan kiyimlari to'g'ri kelmay, qaytarishga ovora bo'ladi", ru: 'получают одежду не того размера и возвращают её' } },
};
const fromCard = (v, idea, field, key) => {
  const base = idea ? idea[field] : null;
  const own = typeof v === 'string' && filled(v) && !(base && (v === base.uz || v === base.ru));
  if (own) return v;
  if (!idea) return '';
  const ov = IDEA_MANY[idea.id] && IDEA_MANY[idea.id][key];
  return (ov && ov[__lang]) || tr(base);
};
const PAST_HAB = [[/maydi$/, 'masdi'], [/aydi$/, 'ardi'], [/iydi$/, 'irdi'], [/adi$/, 'ardi']];
const pastHab = (s) => { const t = clean(s); if (__lang !== 'uz') return t; for (const [re, to] of PAST_HAB) if (re.test(t)) return t.replace(re, to); return t; };
const GAP_KEYS = ['kim', 'natija', 'muammo', 'bolak', 'oxshat', 'sorov'];
const readGapF = () => { try { const o = JSON.parse(localStorage.getItem(GAP_KEY) || 'null'); return o && typeof o === 'object' && !Array.isArray(o) ? strOnly(o, GAP_KEYS) : null; } catch { return null; } };
const ScreenFive = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const card = useMemo(() => cardSafe(), []);
  const [f, setF] = useState(() => {
    const s = readGapF();
    if (s) return s;
    const idea = ideaById(card.ideaId);
    return {
      kim: fromCard(card.kim, idea, 'kim', 'kim'),
      natija: fromCard(card.erishadi, idea, 'erishadi', 'natija'),
      muammo: pastHab(fromCard(card.ogir, idea, 'ogir', 'muammo')),
      bolak: Array.isArray(card.birinchiVersiya) ? joinList(card.birinchiVersiya.filter(x => typeof x === 'string')) : '',
      oxshat: '', sorov: '',
    };
  });
  const [savedSnap, setSavedSnap] = useState(() => (Array.isArray(card.gaplar) && readGapF() ? JSON.stringify(readGapF()) : null));
  const dirty = savedSnap !== JSON.stringify(f);
  const saved = !!savedSnap && !dirty;
  const everSaved = !!savedSnap || !!(storedAnswer && storedAnswer.solved);
  const keys = ['kim', 'natija', 'muammo', 'bolak', 'oxshat', 'sorov'];
  const badOf = (k) => (k === 'oxshat' && OX_JARGON_RE.test(f[k] || '') ? 'ox' : hasJargon(f[k]) ? 'jg' : null);
  const allFilled = keys.every(k => filled(f[k]));
  const anyBad = keys.some(k => badOf(k));
  const canSave = allFilled && !anyBad;
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const gaplar = buildGaplar(f);
  const save = () => {
    if (!canSave) return;
    try { localStorage.setItem(GAP_KEY, JSON.stringify(f)); } catch { /* jim */ }
    cardWrite({ gaplar });
    setSavedSnap(JSON.stringify(f));
    if (!(storedAnswer && storedAnswer.solved)) { onAnswer(screen, { stage: 'practice', screenIdx: screen, practice: 'gaplar', solved: true, correct: true, picked: true, gaplar }); sendPractice(live, screen); }
  };
  const firstEmpty = GAP_F.findIndex(g => !filled(f[g.k]) || (g.k2 && !filled(f[g.k2])));
  const [focus, setFocus] = useState(false);
  const pend = keys.filter(k => !filled(f[k]));
  const lit = useTurnWalk(pend, !focus && !isMentor);
  const saveTurn = useTurnHint(canSave && dirty && !isMentor);
  const navLabel = isMentor || (everSaved && !dirty) ? tr(CONT)
    : firstEmpty >= 0 ? tr({ uz: `${['①', '②', '③', '④', '⑤'][firstEmpty]} ${firstEmpty + 1}-savolga javob yozing`, ru: `${['①', '②', '③', '④', '⑤'][firstEmpty]} Ответьте на ${firstEmpty + 1}-й вопрос` })
    : anyBad ? tr({ uz: "Kasbiy so'zni tanish so'z bilan almashtiring", ru: 'Замените профессиональное слово знакомым' })
    : tr({ uz: "✓ «Saqlash»ni bosing", ru: '✓ Нажмите «Сохранить»' });
  const inp = (k, ph) => {
    const bad = badOf(k);
    return (
      <span className={`gf-in${turnCls(lit, k, pend.length > 1)}`} key={k}>
        {/* 3-maydon (uch bo'lak) — uzun javob: ko'p qatorli maydon, matn yashirinib qolmaydi */}
        {k === 'bolak'
          ? <textarea rows={2} className={`${filled(f[k]) && !bad ? 'on' : ''} ${bad ? 'bad' : ''}`} value={f[k] || ''} onChange={e => set(k, e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={tr(ph)} maxLength={140} />
          : <input className={`${filled(f[k]) && !bad ? 'on' : ''} ${bad ? 'bad' : ''}`} value={f[k] || ''} onChange={e => set(k, e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={tr(ph)} maxLength={140} />}
        {bad && <span className="gf-bad fade-step">{tr(bad === 'ox' ? OX_BAD_MSG : JARGON_MSG)}</span>}
      </span>
    );
  };
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · besh gap ✍️', ru: 'Практика · пять фраз ✍️' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!saved && !isMentor} disabled={!(everSaved && !dirty) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 12 }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>G'oyangizni kod bilmaydigan odamga <span className="italic" style={{ color: T.accent }}>besh gapda</span> ayta olasizmi?</>, ru: <>Сможете рассказать о своей идее человеку без знания кода <span className="italic" style={{ color: T.accent }}>в пяти фразах</span>?</> })}</h2></div>
        {/* 🎓 Metodist: mentor-gap yakuniy (F-0924-03, §210 qolipi — NEGA + bitta chorlov, joy so'zisiz) */}
        <Mentor>{tr({ uz: <>Tanish so'zlar bilan aytilgan tushuntirishni odam oxirigacha tinglaydi — <b style={{ color: T.ink }}>«Beshta savol»</b>dagi bo'sh joylarga javob yozing.</>, ru: <>Объяснение знакомыми словами человек дослушивает до конца, — впишите ответы в пустые поля <b style={{ color: T.ink }}>«Пяти вопросов»</b>.</> })}</Mentor>
        <div className="split">
          <Col>
            {/* Ustun yorlig'i + shart-chiplari bitta qatorda (ekran pastga cho'zilmaydi) */}
            <div className="gf-top fade-up delay-1">
              <span className="flow-label col-cap">❓ {tr({ uz: 'Beshta savol', ru: 'Пять вопросов' })}</span>
              <div className="spec-row">
                <span className={`spec ${allFilled ? 'ok' : ''}`}>{allFilled ? '✓' : '①'} {tr({ uz: 'Beshta javob', ru: 'Пять ответов' })}</span>
                <span className={`spec ${allFilled && !anyBad ? 'ok' : ''}`}>{allFilled && !anyBad ? '✓' : '②'} {tr({ uz: "Kasbiy so'zsiz", ru: 'Без профессиональных слов' })}</span>
              </div>
            </div>
            {GAP_F.map((g, i) => {
              const ok = filled(f[g.k]) && (!g.k2 || filled(f[g.k2])) && !badOf(g.k) && !(g.k2 && badOf(g.k2));
              return (
                <div key={g.k} className="gf">
                  <span className="gf-q" style={{ color: ok ? T.success : T.ink }}>{ok ? '✓' : ['①', '②', '③', '④', '⑤'][i]} {tr(g.q)}</span>
                  {inp(g.k, g.ph)}
                  {g.k2 && inp(g.k2, g.ph2)}
                </div>
              );
            })}
          </Col>
          <Col>
            <div className="gsent">
              <span className="flow-label">{tr({ uz: 'Besh gap', ru: 'Пять фраз' })}</span>
              <ol className="g5">{gaplar.map((g, i) => <li key={i} className={hasJargon(g) ? 'bad' : ''}><MarkJargon text={g} /></li>)}</ol>
            </div>
            <div className="swed-btns">
              {saved && <div className="done-mini fade-step">✓ {tr({ uz: 'Tushuntirish tayyor', ru: 'Объяснение готово' })}</div>}
              <button type="button" className={`swed-save${saveTurn ? ' turn-ring' : ''}`} disabled={!canSave || !dirty} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
            </div>
            <StudentPracticePulse live={live} screen={screen} />
          </Col>
        </div>
        <MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Besh gapini saqlaganlar', ru: '✍️ Кто сохранил пять фраз' })} />
        <MentorNote>{tr(MENTOR_FREE)}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== AI QADAMI (F-0924-01/02) — pilot B1 dan AYNAN: so'rov DOIM ochiq · ① nusxalash → ② Gemini → ③ javobni yozish.
// Manba: DeployLesson Screen4 (.pr-panel/.pr-copy) + DoSteps (.dsx raqamlari) + FallbackPanel (.dsx-fb, 155-qonun 2-band).
// «✓ Nusxalandi» QAYTIB O'CHMAYDI. Navbat-pulsi ① → ② bo'ylab yuradi (88-qonun); ③ ning pulsi — o'ngdagi maydonlarning
// o'zida (onReady ① va ② bajarilganini xabar qiladi). So'rov-qutisi 400 belgi hisobiga kirmaydi (F-0924-01).
const AiRow = ({ n, done, children }) => (
  <li className={`ais-row${done ? ' on' : ''}`}>
    <span className="ais-num" aria-hidden="true">{done ? '✓' : n}</span>
    <div className="ais-body">{children}</div>
  </li>
);
const AiStep = ({ prompt, answerLabel, answered, fallbackTitle, fallback, onReady, pulse = true }) => {
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);
  // Zanjir KETMA-KET (① → ②), teng elementlar emas: birinchi bajarilmagan halqa tinch yonadi —
  // mentor-gap «avval «📋 So'rovni nusxalash»» deydi, puls ham faqat o'sha tugmada (pilot B1 naqshi, 88-qonun a).
  const pend = !copied ? ['copy'] : !opened ? ['open'] : [];
  const lit = useTurnWalk(pend, pulse && !answered);
  const ready = copied && opened;
  useEffect(() => { if (onReady) onReady(ready); }, [ready]); // eslint-disable-line
  const doCopy = async () => { const ok = await copyText(prompt); if (ok) setCopied(true); };
  return (
    <div className="ais fade-up delay-1">
      <div className="pr-panel">
        <div className="pr-head"><span className="pr-lbl">📝 {tr({ uz: "AI uchun so'rov", ru: 'Запрос для AI' })}</span></div>
        <pre className="pr-body">{prompt}</pre>
      </div>
      <ol className="ais-steps">
        <AiRow n={1} done={copied}>
          <button type="button" className={`pr-copy${copied ? ' ok' : ''}${turnCls(lit, 'copy', pend.length > 1)}`} onClick={doCopy}>
            {copied ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: "📋 So'rovni nusxalash", ru: '📋 Скопировать запрос' })}
          </button>
        </AiRow>
        <AiRow n={2} done={opened}>
          <a className={`ais-link${turnCls(lit, 'open', pend.length > 1)}`} href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" onClick={() => setOpened(true)}>
            {tr({ uz: 'gemini.google.com ni ochish ↗', ru: 'Открыть gemini.google.com ↗' })}
          </a>
          <span className="ais-d">{tr({ uz: "So'rovni chatga qo'ying va yuboring", ru: 'Вставьте запрос в чат и отправьте' })}</span>
        </AiRow>
        <AiRow n={3} done={answered}><span className="ais-t">{answerLabel}</span></AiRow>
      </ol>
      <details className="dsx-fb">
        <summary>🛟 {fallbackTitle || tr({ uz: 'Gemini ochilmadimi?', ru: 'Gemini не открылся?' })}</summary>
        <div className="dsx-fb-body">{fallback}</div>
      </details>
    </div>
  );
};
// ===== SCREEN 16 — AI TINGLOVCHI ROLIDA: so'rov DOIM ochiq (AiStep ①②③) · 🛟 zaxira ichida tayyor tahlil (155-qonun) =====
// AI qayta yozmaydi — faqat tushunarsiz so'z + bitta savol. O'quvchi gapini shu yerda o'zi tuzatadi va saqlaydi (cardWrite gaplar).
const GRAN_QS = [
  { uz: 'Buni telefonimda qanday ochaman?', ru: 'Как мне открыть это в телефоне?' },
  { uz: 'Bu pullikmi?', ru: 'Это платно?' },
  { uz: "Nabiramning bahosini qayerdan ko'raman?", ru: 'Где я увижу оценку внука?' },
];
const ScreenAi = ({ screen, onNext, onPrev }) => {
  const isMentor = useIsMentor();
  const card = useMemo(() => cardSafe(), []);
  const [lines, setLines] = useState(() => {
    if (Array.isArray(card.gaplar) && card.gaplar.length === 5 && card.gaplar.every(x => typeof x === 'string')) return card.gaplar.slice();
    const s = readGapF();
    return buildGaplar(s || (__lang === 'ru' ? {} : GAP_SAMPLE.uz));
  });
  const [gq, setGq] = useState(null);
  const [put, setPut] = useState(false);
  const [ready, setReady] = useState(false); // ① va ② bajarildi → navbat ③ ga (o'ngdagi besh gap) o'tadi
  const [focus, setFocus] = useState(false);
  const all = lines.join(' ');
  const prompt = tr({
    uz: `Siz kod umuman bilmaydigan odamsiz. Men sizga loyihamni tushuntiryapman: "${all}". Javob bering: 1) Qaysi so'zlarni tushunmadingiz? 2) Menga qaysi bitta savolni berasiz? Tushuntirishni qayta yozmang, faqat shu ikki javobni bering.`,
    ru: `Вы человек, который совсем не знает код. Я объясняю вам свой проект: "${all}". Ответьте: 1) Какие слова вы не поняли? 2) Какой один вопрос вы мне зададите? Не переписывайте объяснение, дайте только эти два ответа.`,
  });
  const setLine = (i, v) => { setLines(ls => ls.map((x, k) => (k === i ? v : x))); setPut(false); };
  const save = () => { cardWrite({ gaplar: lines.map(x => x.trim()) }); setPut(true); };
  const found = lines.some(hasJargon);
  const jWords = [...new Set(lines.join(' ').split(/\s+/).filter(t => JARGON_RE.test(t)).map(t => t.replace(/^[«"(]+|[.,!?;:»")]+$/g, '')))];
  // Bir lahzada bitta puls: ①/② (AiStep ichida) → ③ kasbiy so'zli gap-qatorlari (navbat bilan) → «Saqlash» → NavNext.
  const pendE = put ? [] : (found ? lines.map((g, k) => (hasJargon(g) ? `r${k}` : null)).filter(Boolean) : ['save']);
  const litE = useTurnWalk(pendE, ready && !focus && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: 'AI bilan', ru: 'С AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!put && !isMentor} label={tr(CONT)} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,16px)' }}>
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>Tushuntirishingizda qaysi so'z <span className="italic" style={{ color: T.accent }}>tushunarsiz qoldi</span>?</>, ru: <>Какое слово в вашем объяснении <span className="italic" style={{ color: T.accent }}>осталось непонятным</span>?</> })}</h2>
          <p className="lead-note fade-up delay-1">{tr({ uz: "AI buvi o'rnida tinglaydi va qaysi so'zni tushunmaganini aytadi — gapingizni qayta yozmaydi. Gapni o'zgartirish yoki o'zgartirmaslikni siz hal qilasiz.", ru: 'AI слушает вместо бабушки и говорит, какое слово не понял, — вашу фразу он не переписывает. Менять её или нет — решаете вы.' })}</p>
        </div>
        {/* 🎓 Metodist: mentor-gap yakuniy (F-0924-03, §210 qolipi; B1/B2 AI-ekrani naqshi) */}
        <Mentor>{tr({ uz: <>Tushunarsiz so'zni o'zingiz sezmaysiz, chetdan tinglagan odam darrov topadi — avval <b style={{ color: T.ink }}>«📋 So'rovni nusxalash»</b>ni bosing.</>, ru: <>Непонятное слово вы сами не замечаете, а человек со стороны сразу его находит, — сначала нажмите <b style={{ color: T.ink }}>«📋 Скопировать запрос»</b>.</> })}</Mentor>
        <div className="split">
          <Col>
            <span className="flow-label col-cap">🤖 {tr({ uz: 'AI — tinglovchi rolida', ru: 'AI — в роли слушателя' })}</span>
            <AiStep prompt={prompt} answered={put} onReady={setReady} pulse={!isMentor}
              answerLabel={tr({ uz: <>AI tushunmagan so'zni <b>«Besh gap»</b>da tanish so'zga almashtiring va <b>«Saqlash»</b>ni bosing</>, ru: <>Замените слово, которое AI не понял, знакомым словом в <b>«Пяти фразах»</b> и нажмите <b>«Сохранить»</b></> })}
              fallback={<div className="ai-bk">
                <span className="flow-label">🔎 {tr({ uz: "Gaplaringizdagi kasbiy so'zlar", ru: 'Профессиональные слова в ваших фразах' })}</span>
                {/* Senariy: «kasbiy so'z RO'YXATI + 3 buvi-savoli» — besh gap o'ngda turibdi, bu yerda qaytarilmaydi (86-qonun) */}
                {found && <div className="ai-jw">{jWords.map(w => <mark key={w} className="jg">{w}</mark>)}</div>}
                {!found && <p className="small" style={{ margin: 0, color: T.success, fontWeight: 700 }}>✓ {tr({ uz: "Kasbiy so'z topilmadi", ru: 'Профессиональных слов не найдено' })}</p>}
                <span className="flow-label">👵 {tr({ uz: 'Buvi beradigan savol', ru: 'Вопрос, который задаст бабушка' })}</span>
                <div className="ai-alts">{GRAN_QS.map((q, i) => <button key={i} type="button" className={`idea wide ${gq === i ? 'on' : ''}`} onClick={() => setGq(g => (g === i ? null : i))}><span>{tr(q)}</span></button>)}</div>
                {gq !== null && <p className="small fade-step" style={{ margin: 0, color: T.accent, fontWeight: 600 }}>{tr({ uz: "Shu savolga javobni besh gapingizga qo'shing.", ru: 'Добавьте ответ на этот вопрос в свои пять фраз.' })}</p>}
              </div>} />
          </Col>
          <Col>
            <span className="flow-label">{tr({ uz: 'Besh gap', ru: 'Пять фраз' })}</span>
            <div className="g5-edit">
              {lines.map((g, i) => (
                <label key={i} className={`g5-row ${hasJargon(g) ? 'bad' : ''}${turnCls(litE, `r${i}`, pendE.length > 1)}`}><span className="mono">{i + 1}</span><textarea placeholder={tr(WRITE_PH)} rows={2} value={g} onChange={e => setLine(i, e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} maxLength={260} /></label>
              ))}
            </div>
            <div className="swed-btns">
              {put && <div className="done-mini fade-step">✓ {tr({ uz: 'Besh gap yangilandi', ru: 'Пять фраз обновлены' })}</div>}
              <button type="button" className={`swed-save${turnCls(litE, 'save', false)}`} disabled={put} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
            </div>
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== SCREEN 17 — SHERIGINGIZGA AYTING (juftlik, ballsiz): sherik buvi o'rnida tinglaydi va belgilaydi =====
const PEER_KEY = 'bridge-b3-sherik';
const PEER_MARKS = [
  { ic: '🙂', t: { uz: 'Tushundim', ru: 'Понял' } },
  { ic: '😐', t: { uz: 'Qisman', ru: 'Частично' } },
  { ic: '😕', t: { uz: 'Tushunmadim', ru: 'Не понял' } },
];
const ScreenPeer = ({ screen, onNext, onPrev }) => {
  const [p, setP] = useState(() => { try { const o = JSON.parse(localStorage.getItem(PEER_KEY) || 'null'); return o && typeof o === 'object' ? { mark: Number.isInteger(o.mark) && o.mark >= 0 && o.mark < PEER_MARKS.length ? o.mark : null, line: typeof o.line === 'string' ? o.line : '' } : { mark: null, line: '' }; } catch { return { mark: null, line: '' }; } });
  const upd = (patch) => setP(prev => { const n = { ...prev, ...patch }; try { localStorage.setItem(PEER_KEY, JSON.stringify(n)); } catch { /* jim */ } return n; });
  const written = (p.line || '').trim().length >= 4;
  const [focus, setFocus] = useState(false);
  const markTurn = useTurnHint(p.mark === null);
  const inputTurn = useTurnHint(p.mark !== null && p.mark !== 0 && !written && !focus); // 🙂 Tushundim — yozadigan so'z yo'q
  return (
    <Stage eyebrow={tr({ uz: 'Yakun · juftlik', ru: 'Итог · в паре' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext turnBusy={!(written || p.mark === 0)} label={tr(CONT)} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>Sherigingiz besh gapingizni <span className="italic" style={{ color: T.accent }}>tushunadimi</span>?</>, ru: <>Поймёт ли напарник ваши <span className="italic" style={{ color: T.accent }}>пять фраз</span>?</> })}</h2>
          <p className="lead-note fade-up delay-1">{tr({ uz: "Ekranga qaramay, besh gapingizni sherigingizga ayting. Sherigingiz buvi o'rnida tinglaydi va belgilaydi: 🙂 Tushundim · 😐 Qisman · 😕 Tushunmadim. Tushunmagan so'zini ham aytadi. Keyin almashasiz.", ru: 'Не глядя на экран, расскажите свои пять фраз напарнику. Напарник слушает вместо бабушки и отмечает: 🙂 Понял · 😐 Частично · 😕 Не понял. Ещё он называет слово, которое не понял. Потом меняетесь.' })}</p>
        </div>
        {/* 🎓 Metodist: mentor-gap yakuniy (F-0924-03, §210 qolipi — NEGA + bitta chorlov, joy so'zisiz) */}
        <Mentor>{tr({ uz: <>Ovoz chiqarib aytilgan gapda tushunarsiz so'z darrov bilinadi — sherigingiz aytgan javobni <b style={{ color: T.ink }}>«Sherigingiz nima dedi?»</b> qatoridan bosing.</>, ru: <>В сказанной вслух фразе непонятное слово сразу заметно, — нажмите ответ напарника в строке <b style={{ color: T.ink }}>«Что сказал напарник?»</b>.</> })}</Mentor>
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">{tr({ uz: '🗣 Sherigingiz nima dedi?', ru: '🗣 Что сказал напарник?' })}</span></div></div>
            <div className={`pm-row${markTurn ? ' turn-ring' : ''}`}>
              {PEER_MARKS.map((m, i) => <button key={i} type="button" aria-pressed={p.mark === i} className={`pm ${p.mark === i ? 'on' : ''}`} onClick={() => upd({ mark: p.mark === i ? null : i })}><span className="pm-ic" aria-hidden="true">{m.ic}</span>{tr(m.t)}</button>)}
            </div>
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">{tr({ uz: "✍️ Tushunarsiz so'z bo'ldimi? Shu so'zni va uning o'rniga aytadigan so'zingizni yozing.", ru: '✍️ Было непонятное слово? Запишите его и слово, которое скажете вместо него.' })}</span></div></div>
            <span className={`turn-wrap${inputTurn ? ' turn-ring' : ''}`}>
              <input className="reflect-input" value={p.line || ''} onChange={e => upd({ line: e.target.value })} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} maxLength={160} placeholder={tr({ uz: 'Masalan: baza — maktab jurnali', ru: 'Например: база — школьный журнал' })} />
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


// ===== 🏅 NISHONLAR — 4 ta (senariy 4-bo'lim): name inglizcha, desc o'zbekcha (siz-forma) =====
// Hammasi mehnat/bonus nishoni (152-qonun): tekshiriladigan real harakatga bog'langan, birinchi-urinish qoidasi (AchRule) yo'q.
const ACHIEVEMENTS = {
  pieceByPiece: { icon: '🧩', name: 'Piece by Piece!', desc: { uz: "eMaktabni sakkiz bo'lakka ajratdingiz", ru: 'Вы разделили eMaktab на восемь частей' } },
  launchList:   { icon: '🚀', name: 'Launch List!',   desc: { uz: "Birinchi versiyaga uchta bo'lak tanladingiz", ru: 'Вы выбрали три части для первой версии' } },
  firstVersion: { icon: '🔥', name: 'First Version!', desc: { uz: "O'z g'oyangizning birinchi versiyasini tanladingiz", ru: 'Вы выбрали первую версию своей идеи' } },
  plainWords:   { icon: '💬', name: 'Plain Words!',   desc: { uz: "Besh gapni kasbiy so'zsiz yozdingiz", ru: 'Вы написали пять фраз без профессиональных слов' } },
};
// Ekran id → nishon (recordAnswer'da, faqat REAL bajarilganda)
const ACH_TRIGGERS = { bolak: 'pieceByPiece', royxat: 'launchList', versiya: 'firstVersion', gaplar: 'plainWords' };
// 151-qonun: birinchi urinish qoidasi — bu darsda yo'q (hamma nishon mehnat/bonus, 152-qonun)
const ACH_FIRST_TRY = new Set([]);
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
  { ch: { uz: "bo'lak", ru: 'часть' },                     l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'birinchi versiya', ru: 'первая версия' },    l: 74, t: 8,  s: 24, d: 23, dl: 1.5 },
  { ch: { uz: "kasbiy so'z", ru: 'проф. слово' },          l: 8,  t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: 'tarozi', ru: 'весы' },                       l: 70, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: "o'xshatish", ru: 'сравнение' },              l: 40, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: 'MVP',       l: 64, t: 28, s: 22, d: 17, dl: 0.4 },
  { ch: '🔥',        l: 26, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: '⚡',        l: 55, t: 5,  s: 24, d: 22, dl: 0.6 },
  { ch: '🌱',        l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '👵',        l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
  { ch: '🧩',        l: 2,  t: 30, s: 30, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike — 12 savol, ikkala mavzudan teng (birinchi versiya 6 · tushuntirish 6), boshqa vaziyatlar (o'yin ilovasi,
// sinf chati, futbol jamoasi sayti — §144), ekran savollarining nusxasi emas.
// 🟡 Senariyda savol-matnlari yo'q — ekran-qoidalaridan QORALAMA (🎓 Metodist sayqallaydi, ⚡ Jonli kalitni tasdiqlaydi).
// To'g'ri javoblar 4 pozitsiyaga TENG: A(0) ×3 · B(1) ×3 · C(2) ×3 · D(3) ×3.
const QUIZ_BANK = [
  { q: { uz: "Sinf chati ilovasini qurmoqchisiz. Qaysi biri alohida tugatsa bo'ladigan bo'lak?", ru: 'Вы хотите сделать приложение для чата класса. Какую часть можно закончить отдельно?' }, opts: [
    { uz: 'Sinfga xabar yozib yuborish', ru: 'Написать и отправить сообщение классу' },
    { uz: 'Hamma sinfdoshga yoqadigan qilish', ru: 'Сделать так, чтобы понравилось всем' },
    { uz: 'Chatni eng mashhur ilova qilish', ru: 'Сделать чат самым популярным' },
    { uz: 'Butun ilovani birdaniga qurish', ru: 'Построить всё приложение сразу' }], correct: 0 },
  { q: { uz: 'Futbol jamoasi saytini noldan qursangiz, birinchi nima qilasiz?', ru: 'Если строить сайт футбольной команды с нуля, что вы сделаете сначала?' }, opts: [
    { uz: "Saytni darrov to'liq qurib boshlayman", ru: 'Сразу начну строить весь сайт целиком' },
    { uz: "Saytni alohida bo'laklarga ajrataman", ru: 'Разделю сайт на отдельные части' },
    { uz: 'Avval saytning rangini tanlayman', ru: 'Сначала выберу цвет сайта' },
    { uz: 'Avval saytga reklama beraman', ru: 'Сначала дам рекламу сайта' }], correct: 1 },
  { q: { uz: "O'yin ilovasida «Do'stlar reytingi» bo'lmasa ham o'ynasa bo'ladi. Bu bo'lak qayerga tushadi?", ru: 'В игровом приложении можно играть и без части «Рейтинг друзей». Куда попадёт эта часть?' }, opts: [
    { uz: '🔥 Birinchi versiyaga', ru: '🔥 В первую версию' },
    { uz: '⚡ Keyingi versiyaga', ru: '⚡ В следующую версию' },
    { uz: '🌱 Keyinga qoldirilganlarga', ru: '🌱 В отложенные' },
    { uz: "Butunlay o'chirib tashlanadi", ru: 'Её удалят совсем' }], correct: 2 },
  { q: { uz: "Futbol jamoasi saytiga «O'yinlar jadvali» kerak, lekin uni tayyorlash ikki hafta oladi. U qayerga tushadi?", ru: 'Сайту футбольной команды нужно «Расписание игр», но на подготовку уйдёт две недели. Куда оно попадёт?' }, opts: [
    { uz: '🌱 Keyinga qoldirilganlarga', ru: '🌱 В отложенные' },
    { uz: '🔥 Birinchi versiyaga', ru: '🔥 В первую версию' },
    { uz: "Butunlay o'chirib tashlanadi", ru: 'Его удалят совсем' },
    { uz: '⚡ Keyingi versiyaga', ru: '⚡ В следующую версию' }], correct: 3 },
  { q: { uz: "Keyinga qoldirilgan bo'lak bilan nima bo'ladi?", ru: 'Что происходит с отложенной частью?' }, opts: [
    { uz: "Butunlay o'chirib tashlanadi", ru: 'Её удаляют совсем' },
    { uz: 'Navbati keyin keladi', ru: 'Её очередь придёт позже' },
    { uz: 'Boshqa saytga berib yuboriladi', ru: 'Её отдают другому сайту' },
    { uz: "Darhol birinchi versiyaga qo'shiladi", ru: 'Её сразу добавляют в первую версию' }], correct: 1 },
  { q: { uz: "Birinchi versiyada qaysi bo'laklar bo'ladi?", ru: 'Какие части бывают в первой версии?' }, opts: [
    { uz: "Saytning bor bo'lgan hamma bo'laklari birga", ru: 'Все части сайта сразу' },
    { uz: "Eng chiroyli ko'rinadigan bo'laklar", ru: 'Самые красивые на вид части' },
    { uz: "Eng kerakli va tez tayyor bo'ladigan bo'laklar", ru: 'Самые нужные части, которые готовятся быстро' },
    { uz: "Boshqa saytlarda allaqachon bor bo'laklar", ru: 'Части, которые уже есть на других сайтах' }], correct: 2 },
  { q: { uz: 'Sinf chatini kod bilmaydigan sinf rahbariga tushuntiryapsiz. Qaysi gapdan boshlaysiz?', ru: 'Вы объясняете чат класса классному руководителю, который не знает код. С какой фразы начнёте?' }, opts: [
    { uz: "Endi e'lonni bir marta yozsangiz, hamma o'qiydi", ru: 'Теперь вы пишете объявление один раз — и его читают все' },
    { uz: 'Ilova serverda ishlaydi va tez javob beradi', ru: 'Приложение работает на сервере и быстро отвечает' },
    { uz: 'Men bu ilovani ikki hafta davomida qurdim', ru: 'Я строил это приложение две недели' },
    { uz: "Ilova uchta bo'lakdan iborat qilib qurilgan", ru: 'Приложение собрано из трёх частей' }], correct: 0 },
  { q: { uz: "Kasbiy so'z nima?", ru: 'Что такое профессиональное слово?' }, opts: [
    { uz: "Juda uzun va qiyin yoziladigan so'z", ru: 'Очень длинное и трудное для написания слово' },
    { uz: "Har qanday inglizcha so'z", ru: 'Любое английское слово' },
    { uz: "Saytda yozilgan har qanday so'z", ru: 'Любое слово, написанное на сайте' },
    { uz: "Faqat kod yozadiganlar tushunadigan so'z", ru: 'Слово, понятное только тем, кто пишет код' }], correct: 3 },
  { q: { uz: "Qaysi gapda kasbiy so'z bor?", ru: 'В какой фразе есть профессиональное слово?' }, opts: [
    { uz: "O'yin natijalari jadvalga yoziladi", ru: 'Результаты игры записываются в таблицу' },
    { uz: "Kim yutganini telefonda ko'rasiz", ru: 'Кто победил, вы видите в телефоне' },
    { uz: "O'yin natijalari bazada saqlanadi", ru: 'Результаты игры хранятся в базе' },
    { uz: "Har o'yindan keyin ball qo'shiladi", ru: 'После каждой игры добавляются очки' }], correct: 2 },
  { q: { uz: "Futbolchiga jamoa saytining ishlashini tushuntiryapsiz. Uni nimaga o'xshatasiz?", ru: 'Вы объясняете футболисту, как работает сайт команды. С чем вы это сравните?' }, opts: [
    { uz: "Hakamga — u golni ko'rib, tabloga yozadi", ru: 'С судьёй — он видит гол и пишет его на табло' },
    { uz: "Serverga — u so'rovni qabul qilib, javob qaytaradi", ru: 'С сервером — он принимает запрос и возвращает ответ' },
    { uz: 'Funksiyaga — u kodni ishga tushirib beradi', ru: 'С функцией — она запускает код' },
    { uz: 'Interfeysga — u ekranni chizib chiqaradi', ru: 'С интерфейсом — он рисует экран' }], correct: 0 },
  { q: { uz: "Yaxshi o'xshatish qayerdan olinadi?", ru: 'Откуда берут хорошее сравнение?' }, opts: [
    { uz: 'Kitobdagi qiyin atamalardan', ru: 'Из трудных терминов в книге' },
    { uz: 'Boshqa saytlarning tavsifidan', ru: 'Из описаний других сайтов' },
    { uz: "Dasturchilar lug'atidan", ru: 'Из словаря программистов' },
    { uz: "Tinglovchining o'z hayotidan", ru: 'Из жизни самого слушателя' }], correct: 3 },
  { q: { uz: "Tushuntirishda kasbiy so'z chiqib qoldi. Nima qilasiz?", ru: 'В объяснении проскочило профессиональное слово. Что вы сделаете?' }, opts: [
    { uz: 'Uni katta harflar bilan yozaman', ru: 'Напишу его большими буквами' },
    { uz: "Uni tinglovchi biladigan so'z bilan almashtiraman", ru: 'Заменю его словом, понятным слушателю' },
    { uz: "Uning inglizchasini ham qo'shib aytaman", ru: 'Добавлю ещё и английский вариант' },
    { uz: "Gapni tezroq aytib o'taman", ru: 'Быстрее проговорю фразу' }], correct: 1 },
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
    const TOK = tr({ uz: ["bo'lak", 'birinchi versiya', "kasbiy so'z", 'tarozi', "o'xshatish", 'MVP', 'eMaktab', '🔥', '⚡', '🌱'],
                     ru: ['часть', 'первая версия', 'проф. слово', 'весы', 'сравнение', 'MVP', 'eMaktab', '🔥', '⚡', '🌱'] });
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
              <button className="qz-btn big" onClick={soloReplay}>{tr({ uz: '↻ Qayta yechish', ru: '↻ Пройти заново' })}</button>
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
            <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span></div>
            <div className="fc-face fc-back"><span className={`fc-tag ${fcTier(tr(card.back))}`}>{tr(card.back)}</span></div>
          </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={() => advance(false)}>{tr({ uz: '✗ Takrorlash', ru: '✗ Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={() => advance(true)}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })}</button></div>)
        : null /* F-0925-QA19: fleshkarta yo'rig'i faqat har o'tishning 1-darsida (KimUchun, KimUchunMuammo), shu darsda yo'q */}
    </div>
  );
}
const FLASHCARDS = [
  { front: { uz: 'Dekompozitsiya nima?', ru: 'Что такое декомпозиция?' }, back: { uz: "Katta ishni alohida tugatsa bo'ladigan bo'laklarga bo'lish", ru: 'Деление большой работы на части, которые можно закончить отдельно' } },
  { front: { uz: "Birinchi versiyaga qaysi bo'laklar kiradi?", ru: 'Какие части входят в первую версию?' }, back: { uz: "Saytning asosiy ishiga kerak va tez tayyor bo'ladiganlar", ru: 'Те, что нужны для главного дела сайта и готовятся быстро' } },
  { front: { uz: "Keyinga qolgan bo'lak nima bo'ladi?", ru: 'Что будет с отложенной частью?' }, back: { uz: "O'chirilmaydi — navbati keyin keladi", ru: 'Её не удаляют — её очередь придёт позже' } },
  { front: { uz: "Kasbiy so'zni nima qilasiz?", ru: 'Что делать с профессиональным словом?' }, back: { uz: "Tinglovchi biladigan oddiy so'z bilan almashtirasiz", ru: 'Заменяете простым словом, которое знает слушатель' } },
  { front: { uz: 'Tushuntirish qaysi gapdan boshlanadi?', ru: 'С какой фразы начинается объяснение?' }, back: { uz: 'Tinglovchi oladigan foydadan', ru: 'С пользы, которую получит слушатель' } },
];
const ScreenFlash = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Проверьте</span> себя.</> })}</h2></div>
      <div className="fc-center"><Flashcards cards={FLASHCARDS} /></div>
    </div>
  </Stage>
);

// ===== SCREEN 20 — ARENA + YAKUN (3 qator; mentorning og'zaki ko'prigi — MentorNote) =====
const RECAP = [
  { uz: "Katta ish bo'lakdan boshlanadi.", ru: 'Большая работа начинается с части.' },
  { uz: "Birinchi versiyada eng kerakli va tez tayyor bo'ladigan bo'laklar bo'ladi.", ru: 'В первой версии — самые нужные части, которые готовятся быстро.' },
  { uz: "Kod bilmaydigan odamga avval uning foydasini aytasiz, kasbiy so'zsiz.", ru: 'Человеку без знания кода сначала говорите о его пользе — без профессиональных слов.' },
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
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Dars tugadi', ru: 'Урок завершён' })}</span><h2 className="title h-title fade-up d1">{tr(LESSON_META.lessonTitle)}</h2></div></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : studentLive ? tr({ uz: "▶ Qo'shilish uchun bosing — 12 savol, har biriga 15 soniya", ru: '▶ Нажмите, чтобы присоединиться — 12 вопросов, по 15 секунд' }) : tr({ uz: '▶ Boshlash uchun bosing — 12 savol, har biriga 15 soniya', ru: '▶ Нажмите, чтобы начать — 12 вопросов, по 15 секунд' })} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className="card fade-up d3"><div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul></div>
        <MentorNote>{tr({ uz: "Og'zaki ayting: «React modulida shu bo'laklarni birma-bir qurishni o'rganasiz.»", ru: 'Скажите устно: «В модуле React вы научитесь строить эти части одну за другой».' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished, liveToken })
export default function BridgeBirinchiVersiya({ lang: langProp, onFinished, liveToken }) {
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
    upd(); window.addEventListener('resize', upd);
    // TopBar balandligi shrift yuklangach o'zgaradi (50 → 53px): birinchi o'lchov eskirib, pastki panel chiqib qolardi
    // (2-dars naqshi) — dars ustidagi qo'shni elementlar kuzatiladi va shriftlar tayyor bo'lganda qayta o'lchanadi.
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

  // SCREEN_META bilan bir xil tartib (20 ekran)
  const screens = [ScreenHook, ScreenGoal, ScreenPieces, ScreenFinish, ScreenT1, ScreenScale, ScreenCase, ScreenT2, ScreenLaunch, ScreenMyVersion, ScreenLine, ScreenT3, ScreenAnalogy, ScreenT4, ScreenFive, ScreenAi, ScreenPeer, ScreenPodium, ScreenFlash, ScreenEnd];
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

        /* === ⛶ KATTALASHTIRISH (Zoomable — PracticeLesson4 porti) === */
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(27,22,48,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        @media (prefers-reduced-motion: reduce) { .zoom-on, .zoom-backdrop { animation: none !important; } .zoom-btn:hover { transform: none; } }

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
        /* wv5 — besh variantli ro'yxat (13-ekran o'xshatishlari): puls to'g'ri javobga ishora qilmasin, hammasi navbat bilan. */
        .turn-wave.wv5::after { animation-duration: 3.5s; }
        .turn-wave.wv5.w4::after { animation-delay: 2.1s; }
        .turn-wave.wv5.w5::after { animation-delay: 2.8s; }
        /* Navbat YURISHI: bitta qadam — paydo bo'ladi, turadi, so'nadi (bir marta). */
        .turn-step::after { animation-name: turn-step; animation-duration: 1.3s; animation-iteration-count: 1; }
        @keyframes turn-step { 0% { opacity: 0; } 20% { opacity: 0.68; } 78% { opacity: 0.68; } 100% { opacity: 0; } }
        /* Kiritish maydoni ::after qabul qilmaydi — halqa o'rovchi qatlamga qo'yiladi (layout o'zgarmaydi). */
        .turn-wrap { display: block; position: relative; }
        .turn-wrap > .reflect-input { width: 100%; }
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
        /* Zaxira (B2 naqshi): mentor surati katta (1,6 MB) va sekin yuklanadi — yuklanguncha yoki umuman kelmasa
           doira bo'sh qolmasin: fonda xuddi shu robotning soddalashgan yuzi (ekran + ikki ko'z + tana). */
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

        /* === HOOK: IKKI SO'ROV KARTASI + OVOZ-DIAGRAMMA (dars-ipi shu yerdan) === */
        .hvote { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,18px); box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }
        .hvote-row { display: flex; align-items: center; gap: 10px; }
        .hvote-lbl { flex: 0 0 clamp(120px,26vw,220px); font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
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
        .stage-content { flex: 1; min-height: 0; padding-top: clamp(10px,1.7vw,16px); padding-bottom: clamp(12px,1.6vw,18px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
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

        /* === TAKEAWAY === */

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
        /* Xato taxmin — PmLesson2 binafshasi (pilot naqshi 1-band): taxmin o'yini, qizil emas */
        .kp-chip.wrong { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; }
        .kp-chip.wrong:hover { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .kp-chip.locked:not(.correct):not(.wrong) { opacity: 0.5; }
        .kp-mark { font-weight: 900; font-size: 15px; }
        /* === TEST-SAVOL (idea_oll tartibi): katta savol + toza kartochka === */
        /* Test-savol (F-0924-06): PmLesson2 qolipi — eyebrow + lead-qator + bitta h-ask */
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
        /* F-0727-43: boshlash-tugmasi pulsli CTA — o'quvchi uni sezmasdan o'tib ketmasin */
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

        /* Uyga-vazifa SHARTNOMA — tanlov-chiplar */
        /* tanlangan = to'ldirilgan indigo (aniq holat) */
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
        /* podium SOLO-ko'rinishi: shaxsiy progress — nishonlar + daftar-holati */

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

        @media (prefers-reduced-motion: reduce) {
        }

        .swed-btns { display: flex; gap: 12px; justify-content: flex-end; align-items: center; }
        .swed-save { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 12px; padding: 13px 26px; background: ${T.accent}; color: #fff; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.55); transition: all 0.18s; }
        .swed-save:hover:not(:disabled) { background: ${T.accentVivid}; transform: translateY(-1px); }
        .swed-save:disabled { background: ${T.accentSoft}; color: ${T.accent}; opacity: 0.55; box-shadow: none; cursor: not-allowed; transform: none; }
        /* 58-qonun (2-aylanish): «bajarildi» chipi Saqlash bilan bir qatorda — ustun pastga cho'zilmaydi. */
        .swed-btns .done-mini { margin-right: auto; }
        /* TEST (F-0924-06): PmLesson2 savol-qolipi — bitta ustun, tanlagach ixcham (izoh ichki aylantirishsiz sig'adi). Pilot B1 naqshi */
        .stage-content.narrow:has(> .screen.qs) { max-width: 800px; }
        .screen.qs.qs-on { gap: clamp(12px,1.6vw,16px) !important; }
        .screen.qs .feedback-block.visible { margin-top: 0; }
        .screen.qs .feedback-block .frame-success, .screen.qs .feedback-block .frame-soft, .screen.qs .feedback-block .frame-wait { padding: clamp(11px,1.6vw,14px) clamp(14px,2vw,18px); }
        /* B2 qo'shimchasi: tanlagach izoh ham skrollsiz sig'sin (RU, 2 qatorli variantlar) — faqat oraliqlar */
        @media (min-width: 761px) {
          .lesson-root .stage-content:has(> .screen.qs.qs-on) { padding-bottom: 14px; }
          .screen.qs.qs-on .h-ask { font-size: clamp(18px,2.3vw,24px); }
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


        .bb-dots { display: flex; gap: 5px; }
        .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        /* Brauzer-ramka — manzil-qatori bo'sh, brend yo'q */
        .bf { background: ${T.paper}; border-radius: 16px; box-shadow: 0 14px 34px -16px rgba(${T.shadowBase},0.3), 0 0 0 1px ${T.line}; overflow: hidden; }
        .bf-bar { display: flex; align-items: center; gap: 12px; padding: 9px 12px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .bf-url { flex: 1; height: 16px; border-radius: 99px; background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .bf-body { padding: clamp(12px,1.8vw,16px); display: flex; flex-direction: column; gap: 10px; }

        .ai-alts { display: flex; flex-direction: column; gap: 8px; }
        .idea { display: flex; flex-direction: column; gap: 3px; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 10px 12px; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},0.2); transition: box-shadow 0.18s, transform 0.18s; }
        .idea:hover { transform: translateY(-1px); }
        .idea b { font-size: 13px; color: ${T.accent}; } .idea span { font-size: 13.5px; color: ${T.ink2}; line-height: 1.35; }
        .idea.wide span { color: ${T.ink}; font-weight: 600; }
        .idea.on { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .gsent { background: ${T.paper}; border-radius: 16px; padding: clamp(16px,2.4vw,22px); box-shadow: 0 12px 30px -14px rgba(${T.shadowBase},0.26); }
        .lead-note.lead-note { margin: 0; font-size: clamp(14px,1.7vw,16px); line-height: 1.5; color: ${T.ink2}; }

        /* =================== BRIDGE B3 — dars-xos qatlam (eMaktab bo'laklari → tarozi → tushunish chizig'i) =================== */
        /* 🔴 OVERFLOW-HIMOYA: o'quvchi kiritmasi ko'rinadigan har konteynerda min-width 0 + overflow-wrap anywhere */
        .bf, .gsent, .g5 li, .pr-body, .idea, .zb-chip, .zb-chip-t, .sc-piece, .sim-t, .pc-row input, .ic-val, .gf-in, .g5-row textarea, .zb-why, .ox-full { min-width: 0; overflow-wrap: anywhere; }
        /* === HOOK (1): hk-split (pilot naqshi 5-band) — chapda «qurilish maydonchasidagi sayt», o'ngda eyebrow + variantlar === */
        .split.hk-split { grid-template-columns: minmax(0,1.1fr) minmax(0,1fr); align-items: start; } /* F-0925-QA17: variantlar sayt-oynasi bilan bir chiziqdan (etalon 1-o'tish 1-darsi) */
        .hk-opts { display: flex; flex-direction: column; gap: 9px; }
        .hk-split .hk-opt { font-size: clamp(14px,1.7vw,16px); padding: clamp(12px,1.7vw,15px) clamp(15px,2.2vw,18px); }
        .hk-ic { font-size: 20px; line-height: 1; }
        .hk-t { flex: 1; min-width: 0; }
        .hk-ok { width: 24px; height: 24px; border-radius: 50%; background: ${T.success}; color: #fff; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .hk-opt.wait .hk-ic { filter: grayscale(1); opacity: 0.5; }
        .hs-site { background: ${T.paper}; border-radius: 16px; overflow: hidden; box-shadow: 0 14px 34px -16px rgba(${T.shadowBase},0.3), 0 0 0 1px ${T.line}; }
        .hs-bar { display: flex; align-items: center; gap: 12px; padding: 9px 44px 9px 14px; background: ${T.bg}; border-bottom: 1px solid ${T.line}; }
        .hs-brand { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: 16px; color: ${T.accent}; }
        .hs-day { margin-left: auto; font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; background: ${T.paper}; border-radius: 99px; padding: 3px 10px; box-shadow: inset 0 0 0 1px ${T.line}; }
        .hs-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; padding: 12px; }
        /* Chizma holati: kesik chiziq + siljiydigan «qurilmoqda» tasmasi; qatorlar xira (hali ishlamaydi) */
        .hs-blk { position: relative; display: flex; flex-direction: column; gap: 7px; min-width: 0; border-radius: 12px; padding: 10px 11px 11px; background: repeating-linear-gradient(135deg, ${T.bg} 0 10px, ${T.paper} 10px 20px); background-size: 28.28px 28.28px; box-shadow: inset 0 0 0 1.5px ${T.ink3}55; outline: 1.5px dashed ${T.ink3}88; outline-offset: -5px; animation: hs-build 1.6s linear infinite; transition: box-shadow 0.2s, transform 0.2s; }
        @keyframes hs-build { to { background-position: 28.28px 0; } }
        .hs-blk-h { display: flex; align-items: center; gap: 7px; min-width: 0; }
        .hs-blk-ic { font-size: 17px; line-height: 1; }
        .hs-blk-t { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink2}; line-height: 1.25; min-width: 0; overflow-wrap: anywhere; }
        .hs-rows { display: flex; flex-direction: column; gap: 4px; }
        .hs-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-family: 'Manrope'; font-size: 12px; color: ${T.ink3}; background: rgba(255,255,255,0.7); border-radius: 7px; padding: 3px 7px; opacity: 0.55; min-width: 0; }
        .hs-k { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .hs-v { font-family: 'Manrope', sans-serif; font-weight: 800; font-variant-numeric: tabular-nums; font-size: 11.5px; white-space: nowrap; }
        .hs-blk.hov { box-shadow: inset 0 0 0 2px ${T.accent}; transform: translateY(-2px); }
        .hs-blk.hov .hs-blk-t { color: ${T.accent}; }
        /* Qurildi: rang to'lqini chapdan o'tadi, qatorlar birma-bir tushadi, «1-kun» shtampi bosiladi */
        .hs-blk.built { animation: none; background: ${T.paper}; outline-color: transparent; box-shadow: inset 0 0 0 2px ${T.success}, 0 12px 26px -14px rgba(18,169,104,0.45); overflow: hidden; }
        .hs-blk.built::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, ${T.successSoft} 40%, transparent); transform: translateX(-100%); animation: hs-wipe 0.7s ease-out forwards; pointer-events: none; }
        @keyframes hs-wipe { to { transform: translateX(100%); } }
        .hs-blk.built .hs-blk-t { color: ${T.ink}; }
        .hs-blk.built .hs-row { opacity: 0; color: ${T.ink}; background: ${T.bg}; animation: hs-row-in 0.35s cubic-bezier(.3,1.4,.5,1) forwards; animation-delay: calc(0.45s + var(--k) * 0.22s); }
        .hs-blk.built .hs-v { color: ${T.accent}; } .hs-blk.built .hs-v.top { color: #fff; background: ${T.success}; border-radius: 6px; padding: 1px 6px; }
        @keyframes hs-row-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        .hs-stamp { position: absolute; top: 7px; right: 8px; font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 3px 9px; box-shadow: inset 0 0 0 1.5px ${T.success}; animation: hs-stamp 0.42s cubic-bezier(.34,1.6,.5,1) 1.1s both; }
        @keyframes hs-stamp { from { opacity: 0; transform: scale(1.8) rotate(-8deg); } to { opacity: 1; transform: none; } }
        .hs-blk.later { animation: none; opacity: 0.7; }
        .hs-later { position: absolute; top: 8px; right: 9px; font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; color: ${T.ink3}; background: ${T.paper}; border-radius: 99px; padding: 2px 8px; box-shadow: inset 0 0 0 1px ${T.line}; }
        .hs-blk.built .hs-blk-h, .hs-blk.later .hs-blk-h { padding-right: 58px; }
        @media (max-width: 760px) { .hs-blk:not(.built) .hs-rows { display: none; } } /* telefonda chizma-qatorlar yashiriladi — variantlar tezroq ko'rinadi */
        @media (max-width: 420px) { .hs-grid { gap: 7px; padding: 9px; } .hs-blk { padding: 8px 9px 9px; } .hs-blk.built .hs-blk-h, .hs-blk.later .hs-blk-h { padding-right: 0; } .hs-stamp, .hs-later { position: static; align-self: flex-start; } }
        @media (prefers-reduced-motion: reduce) {
          .hs-blk { animation: none; transition: none; } .hs-blk.hov { transform: none; }
          .hs-blk.built::before { display: none; } .hs-blk.built .hs-row { animation: none; opacity: 1; } .hs-stamp { animation: none; }
        }
        .gv-replay { position: absolute; top: 10px; right: 10px; z-index: 3; width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer; background: ${T.paper}; color: ${T.accent}; font-size: 15px; font-weight: 800; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.28); }
        .gv-replay:hover { transform: rotate(-30deg); }
        .gv > .gv-replay { top: auto; bottom: 10px; }
        /* Taxmin qilingach bashorat-kartasi ixcham qatorga yig'iladi: savol o'z ishini qildi, slayd birinchi ekranga ko'tariladi */
        .kp-bet.done { padding: 12px 16px; gap: 8px; }
        .kp-bet.done > .k-slide-eyebrow, .kp-bet.done > .kp-q { display: none; }
        .kp-bet.done .kp-chip { padding-top: 7px; padding-bottom: 7px; font-size: 13.5px; }
        /* 58-qonun (2-aylanish): kompyuterda taxmin ochilgach slayd ixcham — belgi matn yonida, bo'sh joy kamroq. */
        @media (min-width: 761px) {
          /* 10 va 15-ekran: kiritish qatorlari ixcham */
          .lesson-root .pc-list { gap: 6px; }
          .lesson-root .pc-row input { padding-top: 7px; padding-bottom: 7px; }
          .lesson-root .col { gap: 12px; }
          .lesson-root .mentor-msg { padding: 11px 16px; }
          .lesson-root .swed-btns .swed-save { padding: 10px 22px; }
          .lesson-root .zb.compact { gap: 8px; }
          .lesson-root .zb.compact .zb-zone { padding: 8px 11px; }
          .lesson-root .ic-card { padding: 8px 16px; gap: 4px; }
          .lesson-root .gf { gap: 5px; }
          .lesson-root .gf-in input, .lesson-root .gf-in textarea { padding-top: 8px; padding-bottom: 8px; }
          .lesson-root .gf-in textarea { min-height: 38px; }
          .lesson-root .gf { gap: 4px; }
          .lesson-root .gf-q { line-height: 1.3; }
          .lesson-root .gf-in input, .lesson-root .gf-in textarea { padding-top: 7px; padding-bottom: 7px; }
          .lesson-root .screen.dense .col:has(> .gf) { gap: 7px; }
        }
        /* Keys-slayd o'z boshqaruvi bilan (F-0924-07, B2 naqshi): chapda belgi yoki maket, o'ngda matn + ← Oldingi · nuqtalar · Keyingisi → */
        .k-nav { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 4px; }
        .k-prev.btn-soft { padding: 9px 16px; font-size: 13.5px; border-radius: 10px; }
        .k-next { border: none; border-radius: 10px; padding: 9px 18px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13.5px; cursor: pointer; }
        .k-fig { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; min-width: 0; }
        .k-slide.ph { padding: clamp(18px,2.6vw,26px) clamp(18px,3vw,30px); min-height: clamp(190px,26vh,230px); display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.15fr); column-gap: clamp(16px,2.5vw,28px); row-gap: 8px; align-items: center; text-align: left; }
        .k-slide.ph > .k-fig { grid-column: 1; grid-row: 1 / span 4; }
        .k-slide.ph > :not(.k-fig) { grid-column: 2; justify-self: start; }
        .k-slide.ph .k-nav { justify-content: flex-start; }
        @media (max-width: 760px) { .k-slide.ph { display: flex; flex-direction: column; text-align: center; } .k-slide.ph > :not(.k-fig) { justify-self: auto; } }
        /* Kesish-maketi — manba PmLesson31 1181-1188 */
        .cut-wrap { display: flex; align-items: flex-start; justify-content: center; gap: clamp(8px,1.6vw,14px); margin: 4px 0 2px; animation: fade-step 0.4s ease both; }
        .cut-col { display: flex; flex-direction: column; gap: 4px; min-width: 96px; }
        .cut-cap { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(9.5px,1.1vw,11px); letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3}; margin-bottom: 2px; }
        .cut-item { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px,1.2vw,11.5px); padding: 4px 8px; border-radius: 6px; background: ${T.paper}; color: ${T.ink}; box-shadow: inset 0 0 0 1px rgba(${T.shadowBase},0.12); }
        .cut-item.gone { color: ${T.ink3}; text-decoration: line-through; background: transparent; box-shadow: none; }
        .cut-item.keep { color: ${T.success}; box-shadow: inset 0 0 0 1px ${T.success}; }
        .cut-arrow { font-size: clamp(15px,2vw,19px); color: ${T.accent}; align-self: center; }
        @media (prefers-reduced-motion: reduce) { .cut-wrap { animation: none; } }
        /* Slayd-rasm (emoji-rejim) — B2 .k-photo naqshi */
        .k-photo { position: relative; display: block; width: min(320px, 100%); height: clamp(120px,17vw,170px); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.4), inset 0 0 0 1px ${T.line}; }
        .k-photo.emo { display: flex; align-items: center; justify-content: center; }
        .ig-orb { position: absolute; left: 50%; top: 50%; font-style: normal; font-size: 20px; opacity: 0.55; transform: rotate(calc(var(--j) * 60deg)) translateY(-54px) rotate(calc(var(--j) * -60deg)); animation: ig-orb-in 0.5s ease-out both; animation-delay: calc(0.1s + var(--j) * 0.07s); margin: -12px 0 0 -11px; }
        @keyframes ig-orb-in { from { opacity: 0; } to { opacity: 0.55; } }
        .ig-spark { position: absolute; left: calc(50% + 26px); top: calc(50% - 44px); font-style: normal; font-size: 24px; animation: ig-spark 1.8s ease-in-out infinite; }
        @keyframes ig-spark { 50% { transform: scale(1.25) rotate(12deg); opacity: 0.7; } }
        @media (prefers-reduced-motion: reduce) { .ig-orb, .ig-spark { animation: none; } }
        @media (min-width: 761px) { .lesson-root .screen.dense .k-slide.ph { min-height: 0; padding: 13px clamp(18px,3vw,28px); row-gap: 6px; } .lesson-root .screen.dense .k-photo { height: clamp(110px,13vw,140px); } .lesson-root .screen.dense .kp-bet.done { padding: 8px 16px; row-gap: 6px; flex-direction: row; flex-wrap: wrap; justify-content: center; column-gap: 12px; } .lesson-root .screen.dense .kp-bet.done .kp-chips { gap: 8px; } }
        .kp-q.kp-q { margin: 0; max-width: 640px; font-size: clamp(14.5px,1.8vw,16.5px); line-height: 1.55; color: ${T.ink}; }
        .flow-label { display: block; }

        /* === MAQSAD (2): eMaktab kartasi → 8 bo'lak → 3 tasi 🔥 ga → besh gap (CSS-taymlayn, bir marta) ===
           Bo'laklar mazmunsiz (faqat tuzilma). Reduced-motion: darhol yakuniy holat. */
        .gv { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(16px,2.6vw,24px); box-shadow: 0 14px 34px -16px rgba(${T.shadowBase},0.3); display: flex; flex-direction: column; gap: 16px; }
        .gv-top { display: grid; grid-template-columns: auto minmax(0,1fr) auto; gap: clamp(12px,2vw,22px); align-items: center; }
        @media (max-width: 760px) { .gv-top { grid-template-columns: 1fr; } }
        .gv-card { width: clamp(120px,15vw,150px); height: 96px; border-radius: 14px; background: linear-gradient(150deg, ${T.accentVivid}, ${T.accent}); color: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 12px 26px -10px rgba(91,61,230,0.55); animation: gv-card 0.6s ease-out 0.9s forwards; }
        .gv-card-t { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: 20px; }
        @keyframes gv-card { to { transform: scale(0.86); opacity: 0.45; } }
        .gv-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 8px; }
        .gv-tile { position: relative; height: 44px; border-radius: 10px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; display: flex; flex-direction: column; justify-content: center; gap: 5px; padding: 0 10px; opacity: 0; animation: gv-pop 0.4s cubic-bezier(.3,1.5,.5,1) forwards, gv-dim 0.5s ease forwards; animation-delay: calc(1.1s + var(--i) * 0.12s), 2.7s; }
        .gv-tile i { height: 6px; border-radius: 99px; background: ${T.ink3}55; } .gv-tile i.s { width: 60%; }
        /* 🔥 ga tanlangan uchtasi JOYIDA qoladi va amber halqa oladi (to'r tekis qoladi); qolgan beshtasi bir tekis xiralashadi */
        .gv-tile.go { animation: gv-pop 0.4s cubic-bezier(.3,1.5,.5,1) forwards, gv-go 0.45s ease-out forwards; animation-delay: calc(1.1s + var(--i) * 0.12s), calc(2.8s + var(--g, 0) * 0.35s); }
        .gv-tile.go::after { content: '🔥'; position: absolute; top: -8px; right: -6px; font-size: 14px; line-height: 1; opacity: 0; animation: gv-in 0.3s ease-out forwards; animation-delay: calc(2.9s + var(--g, 0) * 0.35s); }
        .gv-tile.g1 { --g: 1; } .gv-tile.g2 { --g: 2; }
        @keyframes gv-pop { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: none; } }
        @keyframes gv-dim { from { opacity: 1; } to { opacity: 0.42; } }
        @keyframes gv-go { from { opacity: 1; } to { opacity: 1; background: ${AMBER_SOFT}; box-shadow: inset 0 0 0 2px ${AMBER}; } }
        .gv-tile.go i { transition: background 0.3s; }
        .gv-fire { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; border-radius: 14px; background: ${AMBER_SOFT}; box-shadow: inset 0 0 0 1.5px ${AMBER}55; min-width: 150px; }
        .gv-fire-h { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${AMBER}; }
        .gv-slots { display: flex; flex-direction: column; gap: 6px; }
        .gv-slot { height: 22px; border-radius: 8px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${AMBER}44; display: flex; align-items: center; padding: 0 8px; }
        .gv-slot i { height: 6px; width: 70%; border-radius: 99px; background: ${AMBER}; opacity: 0; animation: gv-in 0.35s ease-out forwards; }
        .gv-slot.s0 i { animation-delay: 3.1s; } .gv-slot.s1 i { animation-delay: 3.45s; } .gv-slot.s2 i { animation-delay: 3.8s; }
        @keyframes gv-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: none; } }
        .gv-talk { display: flex; flex-direction: column; gap: 7px; border-top: 1.5px dashed ${T.line}; padding-top: 12px; }
        .gv-talk-h { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.accent}; opacity: 0; animation: gv-in 0.35s ease-out 4.2s forwards; }
        .gv-line { display: flex; align-items: center; gap: 9px; }
        .gv-line b { width: 20px; height: 20px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .gv-line i { height: 7px; border-radius: 99px; background: linear-gradient(90deg, ${T.accent}cc, ${T.accentVivid}88); width: 0; animation: gv-write 0.6s steps(14, end) forwards; }
        .gv-line.l0 i { animation-delay: 4.4s; } .gv-line.l1 i { animation-delay: 4.9s; } .gv-line.l2 i { animation-delay: 5.4s; } .gv-line.l3 i { animation-delay: 5.9s; } .gv-line.l4 i { animation-delay: 6.4s; }
        @keyframes gv-write { to { width: var(--w); } }
        @media (prefers-reduced-motion: reduce) { .gv-card, .gv-tile, .gv-tile.go, .gv-tile.go::after, .gv-slot i, .gv-talk-h, .gv-line i { animation: none; opacity: 1; } .gv-card { transform: scale(0.86); opacity: 0.45; } .gv-tile { opacity: 0.42; } .gv-tile.go { opacity: 1; background: ${AMBER_SOFT}; box-shadow: inset 0 0 0 2px ${AMBER}; } .gv-line i { width: var(--w); } }

        /* === eMaktab MAKETI (3): bitta karta → 8 bo'lak === */
        .em-frame .bf-body { min-height: 190px; justify-content: center; }
        .em-big { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; min-height: 160px; width: 100%; border: none; border-radius: 14px; cursor: pointer; background: linear-gradient(150deg, ${T.accentVivid}, ${T.accent}); color: #fff; font-family: 'Manrope', sans-serif; box-shadow: 0 14px 30px -12px rgba(91,61,230,0.55); transition: transform 0.18s; }
        .em-big:hover { transform: translateY(-2px); }
        .em-big-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(24px,3.4vw,32px); }
        .em-big-t { font-weight: 700; font-size: 14px; opacity: 0.9; }
        .em-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 10px; }
        @media (max-width: 760px) { .em-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        .em-tile { display: flex; flex-direction: column; gap: 6px; padding: 12px; border-radius: 12px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; opacity: 0; animation: gv-pop 0.4s cubic-bezier(.3,1.5,.5,1) forwards; animation-delay: calc(var(--i) * 0.09s); }
        .em-tile-ic { font-size: 22px; line-height: 1; } .em-tile-t { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.ink}; line-height: 1.3; }
        .em-mat { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-top: auto; font-family: 'Manrope'; font-size: 11.5px; color: ${T.ink2}; background: ${T.paper}; border-radius: 7px; padding: 3px 7px; box-shadow: inset 0 0 0 1px ${T.line}; min-width: 0; }
        .em-mat span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .em-mat b { font-family: 'Manrope', sans-serif; font-weight: 800; font-variant-numeric: tabular-nums; font-size: 11.5px; color: ${T.accent}; white-space: nowrap; }
        @media (min-width: 761px) { .lesson-root .screen.dense .em-tile { padding: 10px 12px; gap: 5px; } }
        @media (prefers-reduced-motion: reduce) { .em-tile { animation: none; opacity: 1; } .em-big:hover { transform: none; } }

        /* === TUGATSA BO'LADIMI (4): 4 karta, toggle === */
        .fc4 { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
        @media (max-width: 640px) { .fc4 { grid-template-columns: 1fr; } }
        .fc4-card { display: flex; flex-direction: column; gap: 8px; min-height: 104px; text-align: left; border: none; border-radius: 14px; padding: 14px 16px; background: ${T.paper}; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.22); transition: box-shadow 0.2s, transform 0.18s; }
        .fc4-card:hover { transform: translateY(-2px); }
        .fc4-t { font-weight: 800; font-size: clamp(15px,1.9vw,17px); color: ${T.ink}; }
        .fc4-cue { font-size: 12.5px; color: ${T.ink3}; font-weight: 600; }
        .fc4-v { display: flex; gap: 8px; align-items: flex-start; font-size: 14px; line-height: 1.4; color: ${T.ink}; }
        .fc4-mark { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; color: #fff; }
        .fc4-card.open.ok { box-shadow: inset 0 0 0 2px ${T.success}, 0 10px 22px -10px rgba(18,169,104,0.35); background: ${T.successSoft}; } .fc4-card.open.ok .fc4-mark { background: ${T.success}; }
        .fc4-card.open.no { box-shadow: inset 0 0 0 2px ${AMBER}, 0 10px 22px -10px rgba(183,122,22,0.3); background: ${AMBER_SOFT}; } .fc4-card.open.no .fc4-mark { background: ${AMBER}; }
        @media (prefers-reduced-motion: reduce) { .fc4-card:hover { transform: none; } }

        /* === TAROZI (6 · 9 · 10) === */
        .sc { background: ${T.paper}; border-radius: 16px; padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 12px 30px -14px rgba(${T.shadowBase},0.28); }
        .sc-svg { display: block; width: 100%; max-width: 340px; height: auto; align-self: center; overflow: visible; }
        .sc-arm { transform-box: view-box; transform-origin: 160px 30px; transition: transform 0.7s cubic-bezier(.34,1.56,.64,1); }
        .sc-hang { transition: transform 0.7s cubic-bezier(.34,1.56,.64,1); }
        .sc-bar { fill: ${T.ink2}; }
        .sc-mast { fill: ${T.ink3}; }
        .sc-foot { fill: ${T.ink3}; }
        .sc-hub { fill: ${T.paper}; stroke: ${T.ink2}; stroke-width: 3; }
        .sc-str { fill: none; stroke: ${T.ink3}; stroke-width: 1.5; }
        .sc-bowl { fill: ${T.bg}; stroke: ${T.line}; stroke-width: 2; transition: fill 0.25s, stroke 0.25s; }
        .sc-bowl.on { fill: ${T.accentSoft}; stroke: ${T.accent}66; }
        .sc-n { font-family: 'Manrope', sans-serif; font-size: 11px; font-weight: 800; fill: ${T.ink3}; }
        .sc-wt { transform-box: fill-box; transform-origin: 50% 100%; animation: sc-drop 0.45s cubic-bezier(.3,1.5,.5,1); }
        .sc-wt.l { fill: ${T.accent}; } .sc-wt.r { fill: ${T.blue}; } .sc-wt.w1 { opacity: 0.55; }
        @keyframes sc-drop { from { transform: translateY(-22px); opacity: 0; } to { transform: none; opacity: 1; } }
        .sc-piece { align-self: center; display: inline-flex; align-items: center; gap: 8px; max-width: 100%; background: ${T.accentSoft}; color: ${T.accent}; border-radius: 12px; padding: 9px 16px; font-family: 'Manrope'; box-shadow: inset 0 0 0 1.5px ${T.accent}55; }
        .sc-piece b { font-weight: 800; font-size: clamp(14.5px,1.8vw,16px); }
        .sc-q { display: flex; flex-direction: column; gap: 7px; transition: opacity 0.2s; }
        .sc-q.off { opacity: 0.4; }
        .sc-q-t { font-family: 'Manrope'; font-weight: 700; font-size: 14px; line-height: 1.4; }
        .sc-a { display: flex; flex-wrap: wrap; gap: 8px; }
        .sc-tip { font-family: 'Manrope'; font-size: 12.5px; line-height: 1.38; color: ${T.ink2}; overflow-wrap: anywhere; min-width: 0; }
        /* 58-qonun: tayanch-gap chiqqanda tarozi rasmi kichrayadi — ekran pastga cho'zilmaydi */
        @media (min-width: 761px) { .lesson-root .screen.dense .sc:has(> .sc-tip) > .sc-svg { max-width: 232px; } }
        .sc-btn.turn-ring::after { inset: -4px; border-radius: 99px; }
        .sc-btn { font-family: 'Manrope'; font-weight: 700; font-size: 14px; cursor: pointer; border: none; border-radius: 99px; padding: 9px 18px; background: ${T.bg}; color: ${T.ink}; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: box-shadow 0.15s, background 0.15s; }
        .sc-btn:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .sc-btn.on { background: ${T.accent}; color: #fff; box-shadow: none; }
        .sc-btn:disabled { cursor: default; }
        @media (prefers-reduced-motion: reduce) { .sc-arm, .sc-hang, .sc-bowl { transition: none; } .sc-wt { animation: none; } }
        @media (min-width: 761px) { .lesson-root .screen.dense .sc { gap: 9px; padding: 12px 14px 14px; } .lesson-root .screen.dense .sc-svg { max-width: 290px; } .lesson-root .screen.dense .sc-q { gap: 6px; } .lesson-root .screen.dense .sc-btn { padding: 8px 17px; } }
        .col-cap.col-cap { margin: 0 0 -2px; }
        .sim-mat { width: 100%; margin-top: 2px; }

        /* === UCH JOY DOSKASI (6 · 9 · 10): 🔥 · ⚡ · 🌱 === */
        .zb { display: flex; flex-direction: column; gap: 10px; }
        .zb-zone { border-radius: 14px; padding: 10px 12px; background: ${T.paper}; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.24); transition: box-shadow 0.2s; } /* F-0925-QA17: chap rang-chizig'i olindi — joyni emoji ko'rsatadi */
        .zb-zone.fire { --zc: ${AMBER}; } .zb-zone.next { --zc: ${T.blue}; } .zb-zone.later { --zc: ${T.success}; }
        .zb-zone.can { cursor: pointer; box-shadow: inset 0 0 0 2px var(--zc), 0 8px 20px -12px rgba(${T.shadowBase},0.24); animation: zb-halo 1.3s ease-in-out infinite; }
        @keyframes zb-halo { 50% { box-shadow: inset 0 0 0 2px var(--zc), 0 0 0 5px rgba(${T.shadowBase},0.06), 0 8px 20px -12px rgba(${T.shadowBase},0.24); } }
        .zb-h { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; color: ${T.ink}; }
        .zb-ic { font-size: 17px; } .zb-t { flex: 1; }
        .zb-n { min-width: 24px; text-align: center; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 99px; padding: 2px 8px; }
        .zb-list { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 8px; min-height: 30px; align-items: center; }
        .zb.compact .zb-zone { padding: 9px 11px; } .zb.compact .zb-list { margin-top: 6px; }
        .zb-chip { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; background: ${T.bg}; border: none; border-radius: 10px; padding: 7px 11px; box-shadow: inset 0 0 0 1.5px ${T.line}; cursor: default; text-align: left; }
        .zb-chip.mv { cursor: grab; } .zb-chip.mv:active { cursor: grabbing; }
        .zb-chip.sel { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; }
        .zb-chip.land { animation: zb-land 0.55s cubic-bezier(.3,1.5,.5,1); }
        @keyframes zb-land { from { opacity: 0; transform: translateY(-18px) scale(0.85); } to { opacity: 1; transform: none; } }
        /* Bo'sh joy — kesik chiziqli «uya»: bo'lak shu yerga tushishi mumkinligini ko'rsatadi (bo'sh qator emas) */
        .zb-empty { display: inline-flex; align-items: center; justify-content: center; min-width: 64px; height: 26px; border-radius: 9px; color: ${T.ink3}; font-size: 13px; box-shadow: inset 0 0 0 1.5px ${T.line}; background: repeating-linear-gradient(135deg, transparent 0 6px, ${T.bg} 6px 12px); }
        /* Ixcham doska: bo'sh joy bitta qatorga yig'iladi (sarlavha + uya yonma-yon) — ekran pastga cho'zilmaydi */
        .zb.compact .zb-zone:not(:has(.zb-chip)) { display: flex; align-items: center; gap: 10px; }
        .zb.compact .zb-zone:not(:has(.zb-chip)) .zb-h { flex: 1; min-width: 0; }
        .zb.compact .zb-zone:not(:has(.zb-chip)) .zb-list { margin-top: 0; min-height: 0; }
        .zb-why { display: flex; flex-direction: column; gap: 3px; background: ${T.paper}; border-radius: 12px; padding: 10px 14px; box-shadow: inset 0 0 0 1.5px ${T.line}; font-size: 14px; line-height: 1.45; color: ${T.ink}; }
        .zb-why b { font-family: 'Manrope'; font-size: 13px; }
        /* Maslahat (xato emas) — accentSoft */
        .zb-warn.zb-warn { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; line-height: 1.45; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 9px 12px; }
        @media (prefers-reduced-motion: reduce) { .zb-chip.land, .zb-zone.can { animation: none; } }

        /* === SIMULYATSIYA (9) === */
        .ln-ctl { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
        .sim-h.sim-h { margin: 0; font-family: 'Manrope'; font-weight: 800; font-size: 14px; color: ${T.ink}; }
        .sim.bf .bf-bar .bf-url { background: ${T.successSoft}; box-shadow: inset 0 0 0 1px ${T.success}44; }
        .sim-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .sim-row { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: 12px 12px 10px; border-radius: 12px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; opacity: 0.55; transition: background 0.3s, box-shadow 0.3s, opacity 0.3s; }
        .sim-row.ok { opacity: 1; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}66; animation: sim-on 0.45s cubic-bezier(.3,1.5,.5,1); }
        @keyframes sim-on { 0% { transform: scale(0.94); } 60% { transform: scale(1.04); } 100% { transform: none; } }
        .sim-ic { font-size: 22px; line-height: 1; }
        .sim-t { font-size: 13.5px; font-weight: 700; color: ${T.ink}; line-height: 1.3; }
        .sim-ck { position: absolute; top: 8px; right: 9px; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; color: ${T.ink3}; }
        .sim-row.ok .sim-ck { background: ${T.success}; color: #fff; }
        @media (max-width: 520px) { .sim-grid { grid-template-columns: 1fr; } .sim-row { flex-direction: row; align-items: center; } }
        @media (prefers-reduced-motion: reduce) { .sim-row, .sim-row.ok { transition: none; animation: none; } }
        .sim-end.sim-end { margin: 0; font-family: 'Manrope'; font-weight: 800; font-size: 14.5px; color: ${T.success}; }

        /* === USTAXONA (10 · 15): shart-chiplari, bo'lak qatorlari === */
        .spec-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .lead-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px 14px; }
        /* 10-ekran: o'ng ustunda tarozi + uch joy + Saqlash birga sig'sin — tarozi ixchamroq (mexanikasi o'zgarmaydi) */
        @media (min-width: 761px) {
          /* Tarozi yotiq: chapda bo'lak + shayin, o'ngda ① ② savollar (mexanika o'zgarmaydi) */
          .split:has(> .col > .pc-list) .sc { display: grid; grid-template-columns: minmax(0,150px) minmax(0,1fr); grid-template-areas: "p a" "s b"; gap: 8px 14px; padding: 12px 14px; align-items: center; }
          .split:has(> .col > .pc-list) .sc > .sc-piece { grid-area: p; justify-self: stretch; justify-content: center; text-align: center; padding: 6px 10px; }
          .split:has(> .col > .pc-list) .sc > .sc-piece b { font-size: 14px; }
          .split:has(> .col > .pc-list) .sc > .sc-svg { grid-area: s; max-width: 150px; align-self: start; }
          .split:has(> .col > .pc-list) .sc > .sc-q:nth-child(3) { grid-area: a; }
          .split:has(> .col > .pc-list) .sc > .sc-q:nth-child(4) { grid-area: b; }
          /* 10-ekran: ② savolida tayanch-gap tarozi rasmi o'rnini egallaydi (① javobi rasmda ko'rindi; 6/9-ekranda rasm to'liq) */
          .split:has(> .col > .pc-list) .sc:has(> .sc-tip) > .sc-svg { display: none; }
          .split:has(> .col > .pc-list) .sc > .sc-tip { grid-area: s; font-size: 12px; align-self: start; }
          .split:has(> .col > .pc-list) .sc-q-t { font-size: 13px; line-height: 1.35; }
          .split:has(> .col > .pc-list) .zb.compact { gap: 6px; }
          .split:has(> .col > .pc-list) > .col { gap: 9px; }
          .split:has(> .col > .pc-list) .zb.compact .zb-zone:not(:has(.zb-chip)) { padding-top: 6px; padding-bottom: 6px; }
          .split:has(> .col > .pc-list) .sc-q { gap: 5px; }
          .split:has(> .col > .pc-list) .sc-btn { padding: 6px 15px; }
        }
        .gf-top { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px 10px; }
        .gf-top .spec { padding: 3px 11px; font-size: 12.5px; }
        /* 15-ekran: chap ustun (kiritish) kengroq — namuna-matnlar bir qatorga sig'adi, o'ngdagi «Besh gap» balandlikka o'sadi */
        @media (min-width: 761px) {
          .split:has(> .col > .gf-top) { grid-template-columns: minmax(0,1.12fr) minmax(0,0.88fr); gap: clamp(18px,2.4vw,28px); }
          .split:has(> .col > .gf-top) .gsent { padding: 12px 16px 12px 18px; }
          .split:has(> .col > .gf-top) .g5 { gap: 3px; font-size: 15.5px; line-height: 1.38; margin-top: 3px; }
          .gf-bad { line-height: 1.25; margin-top: -1px; }
          .gf-in textarea::placeholder { font-size: 13px; }
          /* Kasbiy so'z ogohlantirishi chiqqan lahzada qo'shimcha qator ekranni pastga surmasin — faqat savollar orasi qisqaradi */
          .lesson-root .screen.dense .col:has(> .gf .gf-bad) { gap: 5px; }
          .lesson-root .col:has(> .gf .gf-bad) .gf { gap: 3px; }
        }
        .spec { font-family: 'Manrope'; font-weight: 700; font-size: 13px; border-radius: 99px; padding: 6px 13px; background: ${T.paper}; color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .spec.ok { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}55; }
        .pc-list { display: flex; flex-direction: column; gap: 8px; }
        .pc-row { display: flex; align-items: center; gap: 8px; border-radius: 12px; }
        .pc-row.turn-ring::after { inset: -4px; border-radius: 14px; }
        .pc-n { width: 22px; text-align: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
        .pc-row input { flex: 1; font-family: 'Manrope'; font-weight: 500; font-size: 14.5px; color: ${T.ink}; border: none; border-radius: 10px; padding: 10px 12px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; }
        .pc-row input:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .pc-row.on input { box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .pc-tag { font-family: 'Manrope'; font-weight: 700; font-size: 11px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 3px 9px; white-space: nowrap; }
        .pc-del { border: none; background: transparent; color: ${T.ink3}; font-size: 14px; cursor: pointer; padding: 4px 6px; border-radius: 8px; }
        .pc-del:hover { color: ${T.accent}; background: ${T.accentSoft}; } /* o'chirish — xato emas, qizil emas */
        .ic-card { display: flex; flex-direction: column; gap: 8px; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.34); }
        .ic-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
        .ic-row { display: grid; grid-template-columns: 82px minmax(0,1fr); gap: 10px; align-items: baseline; }
        .ic-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 10.5px; letter-spacing: 0.06em; color: ${T.ink3}; }
        .ic-lbl.kim { color: ${T.blue}; } .ic-lbl.ogir { color: ${T.accent}; }
        .ic-val { font-size: 14px; color: ${T.ink}; line-height: 1.4; }
        .ip-box { display: flex; flex-direction: column; gap: 8px; }
        .ip-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .ip-chip { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; cursor: pointer; border: none; border-radius: 99px; padding: 8px 15px; background: ${T.paper}; color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .ip-chip.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }

        /* === TUSHUNISH CHIZIG'I (11) === */
        .ul { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(16px,2.6vw,24px); display: flex; flex-direction: column; gap: 10px; box-shadow: 0 14px 34px -16px rgba(${T.shadowBase},0.3); }
        .ul-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.ink2}; }
        .ul-chart { position: relative; height: clamp(120px,17vw,160px); }
        .ul-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; overflow: visible; }
        .ul-low { fill: ${T.bg}; }
        .ul-mid { stroke: ${T.ink3}88; stroke-width: 1.5; stroke-dasharray: 5 6; vector-effect: non-scaling-stroke; }
        .ul-area { transition: d 0.45s ease; }
        .ul-path { fill: none; stroke: ${T.accent}; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; transition: d 0.45s ease; }
        .ul-ax { position: absolute; left: 0; font-size: 15px; line-height: 1; transform: translate(-60%, -50%); opacity: 0.8; }
        .ul-ax.hi { top: 14%; } .ul-ax.lo { top: 88%; }
        .ul-dot { position: absolute; width: 13px; height: 13px; margin: -6.5px 0 0 -6.5px; border-radius: 50%; background: ${T.accent}; box-shadow: 0 0 0 3px ${T.paper}; animation: ul-pop 0.3s cubic-bezier(.3,1.6,.5,1); }
        .ul-dot.got { background: ${T.success}; width: 17px; height: 17px; margin: -8.5px 0 0 -8.5px; }
        @keyframes ul-pop { from { transform: scale(0); } to { transform: none; } }
        .ul-face { position: absolute; z-index: 2; font-size: 22px; line-height: 1; transform: translate(-50%, -135%); white-space: nowrap; pointer-events: none; }
        .ul-face.sad { animation: ul-shake 0.45s ease; }
        @keyframes ul-shake { 25% { translate: -3px 0; } 75% { translate: 3px 0; } }
        .ul-sent.ul-sent { margin: 0; display: grid; grid-template-columns: repeat(var(--n), minmax(0,1fr)); padding: 0 var(--pad); gap: 4px; font-family: 'Source Serif 4', serif; font-size: clamp(16px,2.3vw,22px); line-height: 1.3; }
        .ul-sent .ul-w { justify-self: center; text-align: center; }
        @media (max-width: 640px) { .ul-sent.ul-sent { display: flex; flex-wrap: wrap; gap: 6px 8px; padding: 0; } }
        .ul-w { font: inherit; color: ${T.ink}; background: transparent; border: none; border-radius: 8px; padding: 2px 6px; cursor: pointer; opacity: 0; transition: background 0.2s, color 0.2s; }
        .ul-w.in { opacity: 1; animation: fade-step 0.3s ease-out; }
        .ul-found { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 10px; border-top: 1.5px dashed ${T.line}; padding-top: 10px; margin-top: 2px; }
        .ul-slot { display: inline-flex; align-items: center; justify-content: center; min-width: 92px; height: 30px; padding: 0 12px; border-radius: 99px; font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px ${T.line}; background: repeating-linear-gradient(135deg, transparent 0 6px, ${T.bg} 6px 12px); }
        .ul-slot.got { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}; animation: ul-snap 0.4s cubic-bezier(.34,1.6,.5,1); }
        @keyframes ul-snap { from { transform: scale(0.7); opacity: 0.4; } to { transform: none; opacity: 1; } }
        .ul-count { margin-left: auto; font-size: 12px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 99px; padding: 3px 10px; }
        @media (min-width: 761px) { .lesson-root .screen.dense .ul-chart { height: clamp(120px,10.4vw,134px); } .lesson-root .screen.dense .ul { padding: 16px 22px; gap: 8px; } }
        @media (prefers-reduced-motion: reduce) { .ul-slot.got { animation: none; } }
        .ul-w:hover:not(:disabled) { background: ${T.accentSoft}; }
        .ul-w:disabled { cursor: default; }
        .ul-w.got { color: ${T.success}; background: ${T.successSoft}; }
        .ul-w.miss { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; } /* xato bosish — binafsha (pilot 1-band) */
        @media (prefers-reduced-motion: reduce) { .ul-path, .ul-area { transition: none; } .ul-w.in, .ul-dot, .ul-face.sad { animation: none; } }

        /* === O'XSHATISH (13) === */
        .ox-part { display: flex; flex-direction: column; gap: 6px; text-align: left; width: 100%; border: none; border-radius: 14px; padding: 13px 15px; background: ${T.paper}; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 8px 20px -12px rgba(${T.shadowBase},0.24); }
        .ox-part.cur { box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 22px -10px rgba(91,61,230,0.3); }
        .ox-part.ok { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; }
        .ox-part-t { font-weight: 800; font-size: 14.5px; color: ${T.ink}; } .ox-part.ok .ox-part-t { color: ${T.success}; }
        .ox-full { font-family: 'Source Serif 4', serif; font-size: 15px; line-height: 1.45; color: ${T.ink}; }
        .ox-opts { display: flex; flex-direction: column; gap: 8px; }
        .ox-opt { text-align: left; font-family: 'Manrope'; font-weight: 600; font-size: 14px; line-height: 1.4; border: none; border-radius: 12px; padding: 11px 14px; background: ${T.paper}; color: ${T.ink}; cursor: pointer; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.2); transition: background 0.2s, opacity 0.2s; }
        .ox-opt:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.accent}, 0 6px 16px -8px rgba(${T.shadowBase},0.2); }
        .ox-opt.used { opacity: 0.35; cursor: default; }
        .ox-opt.miss { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; } /* xato juft — binafsha (pilot 1-band) */

        /* === BESH GAP (15 · 16) === */
        .gf { display: flex; flex-direction: column; gap: 6px; }
        .gf-q { font-family: 'Manrope'; font-weight: 700; font-size: 14px; line-height: 1.4; }
        .gf-in { display: flex; flex-direction: column; gap: 4px; border-radius: 12px; position: relative; }
        .gf-in.turn-ring::after { inset: -4px; border-radius: 14px; }
        .gf-in textarea { resize: vertical; line-height: 1.45; min-height: 64px; display: block; field-sizing: content; }
        .gf-in input, .gf-in textarea { font-family: 'Manrope'; font-weight: 500; font-size: 14.5px; color: ${T.ink}; border: none; border-radius: 10px; padding: 10px 12px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; width: 100%; }
        .gf-in input:focus, .gf-in textarea:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .gf-in input.on, .gf-in textarea.on { box-shadow: inset 0 0 0 1.5px ${T.success}; }
        .gf-in input.bad, .gf-in textarea.bad { box-shadow: inset 0 0 0 2px ${T.err}; text-decoration: underline wavy ${T.err}; text-decoration-skip-ink: none; }
        .gf-bad { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.err}; }
        .g5 { margin: 6px 0 0; padding-left: 22px; display: flex; flex-direction: column; gap: 6px; font-family: 'Source Serif 4', serif; font-size: clamp(15px,1.9vw,17px); line-height: 1.5; color: ${T.ink}; }
        .lesson-root .g5 { padding-left: 22px; }
        .g5 li.bad { color: ${T.ink}; }
        mark.jg { background: ${T.errSoft}; color: ${T.err}; border-radius: 4px; padding: 0 3px; text-decoration: underline wavy ${T.err}; text-decoration-skip-ink: none; }
        /* AI QADAMI (F-0924-01/02) — B2 dan AYNAN; manba DeployLesson 3314-3340, 3416-3431 */
        .ais { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
        .pr-panel { display: flex; flex-direction: column; background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); }
        .pr-head { display: flex; align-items: center; gap: 10px; padding: 8px 13px; border-bottom: 1px solid ${T.line}; }
        .pr-lbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; }
        .pr-body { margin: 0; padding: 10px 13px; max-height: min(24vh, 170px); overflow-y: auto; white-space: pre-wrap; word-break: break-word; overflow-wrap: anywhere; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12.5px; line-height: 1.55; color: ${T.ink}; }
        .pr-copy { border: none; border-radius: 10px; padding: 9px 16px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13.5px; cursor: pointer; transition: background 0.18s; }
        .pr-copy.ok { background: ${T.success}; }
        .ais-steps { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .ais-row { display: flex; align-items: center; gap: 11px; border-radius: 12px; padding: 7px 11px; background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .ais-row.on { background: ${T.successSoft}; box-shadow: none; }
        .ais-num { width: 24px; height: 24px; flex-shrink: 0; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; background: ${T.accent}; color: #fff; }
        .ais-row.on .ais-num { background: ${T.success}; }
        .ais-body { flex: 1; min-width: 0; display: flex; flex-wrap: wrap; gap: 5px 10px; align-items: center; }
        .ais-link { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.accent}; text-decoration: none; border-radius: 10px; padding: 8px 14px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
        .ais-d, .ais-t { font-family: 'Manrope', sans-serif; font-size: 13px; color: ${T.ink2}; line-height: 1.45; overflow-wrap: anywhere; }
        .ais-t b { color: ${T.ink}; }
        .dsx-fb { background: ${T.paper}; border-radius: 12px; padding: 9px 13px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .dsx-fb > summary { cursor: pointer; list-style: none; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.5vw,14px); color: ${T.accent}; }
        .dsx-fb > summary::-webkit-details-marker { display: none; }
        .dsx-fb[open] > summary { margin-bottom: 9px; }
        .dsx-fb-body { display: flex; flex-direction: column; gap: 8px; }
        @media (prefers-reduced-motion: reduce) { .pr-copy { transition: none; } }
        .ai-bk { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border-radius: 14px; padding: 12px 14px; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.2); }
        .dsx-fb .ai-bk { background: none; box-shadow: none; padding: 0; }
        .ai-jw { display: flex; flex-wrap: wrap; gap: 6px; }
        .ai-jw mark.jg { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; padding: 3px 9px; border-radius: 99px; overflow-wrap: anywhere; min-width: 0; }
        /* 16-ekran (58-qonun): kompyuterda bitta ekranga sig'adi. So'rov-oynasi qisqaroq — ortig'i ICHIDA aylanadi (matn to'liq). */
        @media (min-width: 761px) {
          .lesson-root .screen.dense .pr-body { max-height: 92px; }
          .lesson-root .screen.dense .ais-steps { gap: 5px; }
          .lesson-root .screen.dense .ais-row { padding-top: 4px; padding-bottom: 4px; }
          .lesson-root .screen.dense .ais-link, .lesson-root .screen.dense .pr-copy { padding-top: 7px; padding-bottom: 7px; }
          .lesson-root .screen.dense .g5-edit { gap: 6px; }
          /* 🛟 zaxira ochilganda ham SO'ROV KO'RINIB TURADI (D-6 · foydalanuvchi: «so'rov doim ochiq»). Joy uchun faqat
             ①② qatorlari yig'iladi (Gemini ochilmagan — ular hozir kerak emas), so'rov-oynasi pastroq bo'ladi va ichida
             aylanadi (matn to'liq); ③ qatori qoladi. Zaxirani yopsangiz ①② qaytadi. */
          .ais:has(> .dsx-fb[open]) > .ais-steps > .ais-row:nth-child(-n+2) { display: none; }
          .lesson-root .screen.dense .ais:has(> .dsx-fb[open]) .pr-body { max-height: 46px; }
          .dsx-fb .ai-alts { flex-direction: row; flex-wrap: wrap; gap: 6px; }
          .dsx-fb .idea.wide { border-radius: 99px; padding: 6px 12px; box-shadow: inset 0 0 0 1px ${T.line}; }
          .dsx-fb .idea.wide span { font-size: 13px; }
          .dsx-fb .idea.wide.on { box-shadow: inset 0 0 0 2px ${T.accent}; }
          .lesson-root .screen.dense .dsx-fb[open] > summary { margin-bottom: 6px; }
          .lesson-root .screen.dense .dsx-fb .dsx-fb-body, .lesson-root .screen.dense .dsx-fb .ai-bk { gap: 5px; }
          .lesson-root .screen.dense .dsx-fb { padding: 8px 13px; }
        }
        .g5-row.turn-ring::after { inset: -4px; border-radius: 14px; }
        .g5-edit { display: flex; flex-direction: column; gap: 7px; }
        .g5-row { display: flex; gap: 8px; align-items: flex-start; }
        .g5-row .mono { width: 20px; padding-top: 10px; font-size: 12px; font-weight: 700; color: ${T.accent}; flex-shrink: 0; }
        .g5-row textarea { flex: 1; field-sizing: content; min-height: 38px; resize: vertical; font-family: 'Manrope'; font-size: 14px; line-height: 1.45; color: ${T.ink}; border: none; border-radius: 10px; padding: 8px 10px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; }
        .g5-row textarea:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .g5-row.bad textarea { box-shadow: inset 0 0 0 2px ${T.err}; }

        /* === SHERIK (17) === */
        .pm-row { display: flex; flex-wrap: wrap; gap: 8px; border-radius: 14px; }
        .pm { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 700; font-size: 14px; cursor: pointer; border: none; border-radius: 99px; padding: 10px 16px; background: ${T.bg}; color: ${T.ink}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
        .pm.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; }
        .pm-ic { font-size: 18px; }

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
