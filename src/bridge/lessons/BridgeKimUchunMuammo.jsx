import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, createContext, useContext, useCallback } from 'react';
import { cardRead, cardWrite, READY_IDEAS } from '../bridgeCard.js';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// O'TISH (BRIDGE) DARSLARI · 3- va 4-O'TISH 1-DARSI — «KIM UCHUN VA QANDAY MUAMMO?»
// Senariy-manba: pm-senariylar/BRIDGE-B4-KimUchunQandayMuammo.md (GATE S + foydalanuvchi fidbegi, 2026-09-23 23:17).
// Mavzular: auditoriya + struktura · muammoni izlash (to'rt belgi, aniq gap) · muammodan yechimga · vazifa (Jobs-to-be-Done).
// Misol-ip va keys: Uzum (ekranda brendsiz sxema — faqat ilovada ko'rinadigan to'rt joy; keys-slaydlarda faqat bank-faktlari).
// Artefakt: o'quvchining to'rt savolli kartasi — SHU darsda tug'iladi (bridgeCard.js: kim · qachon · ogir · qiladi · erishadi · ideaId?).
// INFRA MANBAI: src/bridge/lessons/BridgeMuammoniTopamiz.jsx (P0 PmUserStoryLesson'dan ko'chirilgan infra: Stage/NavNext/
//        QuestionScreen/MentorTestStats/Mentor/MentorNote/PRACTICE_BASE/nishonlar/Podium/CodeStrike arena/progress);
//        juftlik-taymer (PairTimer) va «odam» kartalari — BridgeKimUchun.jsx'dan.
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
const LESSON_META = { lessonId: 'bridge-b4-v1', lessonTitle: { uz: 'Kim uchun va qanday muammo?', ru: 'Для кого и какая проблема?' } };
// Ekran-tartib = senariy 3-bo'lim (20 ekran). 20-ekranda arena yakun sahifasi ICHIDA (jsx-lint · P0 · pilot B1).
// Ballik testlar: s4 · s7 · s10 · s12 — har biri o'z blokidan keyin.
const SCREEN_META = [
  { id: 'hook',    type: 'hook',        template: 'custom', scored: false, scope: 'hook' },         // 0  · 1-ekran
  { id: 'maqsad',  type: 'rule',        template: 'custom', scored: false, scope: null },           // 1  · 2
  { id: 'ikki',    type: 'exploration', template: 'custom', scored: false, scope: null },           // 2  · 3 ikki vaziyat
  { id: 's4',      type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 3  · 4 TEST-1
  { id: 'belgi',   type: 'exploration', template: 'custom', scored: false, scope: null },           // 4  · 5 to'rt belgi
  { id: 'keys',    type: 'case',        template: 'custom', scored: false, scope: null },           // 5  · 6 Uzum
  { id: 's7',      type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 6  · 7 TEST-2
  { id: 'gap',     type: 'exploration', template: 'custom', scored: false, scope: null },           // 7  · 8 konstruktor
  { id: 'ilova',   type: 'exploration', template: 'custom', scored: false, scope: null },           // 8  · 9 to'rt joy
  { id: 's10',     type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 9  · 10 TEST-3
  { id: 'natija',  type: 'exploration', template: 'custom', scored: false, scope: null },           // 10 · 11 telefon emas — natija
  { id: 's12',     type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 11 · 12 TEST-4
  { id: 'juft',    type: 'exploration', template: 'custom', scored: false, scope: null },           // 12 · 13 juftlash
  { id: 'karta',   type: 'practice',    template: 'custom', scored: false, scope: null },           // 13 · 14 ustaxona
  { id: 'tekshir', type: 'exploration', template: 'custom', scored: false, scope: null },           // 14 · 15 sherik-tekshiruv
  { id: 'ai',      type: 'practice',    template: 'custom', scored: false, scope: null },           // 15 · 16 AI
  { id: 'sherik',  type: 'practice',    template: 'custom', scored: false, scope: null },           // 16 · 17 juftlik
  { id: 'podium',  type: 'stats',       template: 'custom', scored: false, scope: null },           // 17 · 18
  { id: 'flash',   type: 'review',      template: 'custom', scored: false, scope: null },           // 18 · 19
  { id: 'yakun',   type: 'summary',     template: 'custom', scored: false, scope: null }            // 19 · 20 Arena + yakun
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// SCREEN_INTENTS — har ekran nima uchun bor: bola nima QILADI yoki nima BILADI (render qilinmaydi; 👦 simulyator tekshiradi).
export const SCREEN_INTENTS = {
  hook: "Bola Uzumga oxirgi marta nima uchun kirganiga ovoz beradi va bitta odam ilovaga turli maqsadda kirishini biladi",
  maqsad: "Bola dars oxirida o'z g'oyasi haqida to'rt savolga javob yozishini oldindan ko'radi",
  ikki: "Bola ikki xaridorni bosib, har biri ilovada boshqa joyga qarashini ko'radi va «auditoriya» atamasini oladi",
  s4: "Bola «Bizda hamma narsa bor!» gapining kamchiligi — hech kim o'zini tanimasligini topadi",
  belgi: "Bola to'rt kartani ochib, muammoning to'rt belgisini tumandagi xaridor misolida biladi",
  keys: "Bola Uzum avval narsani xaridorga yetkazib berishga e'tibor qaratganini bashorat qilib, bank-faktlaridan biladi",
  s7: "Bola «kim olib kelib beradi?» deb yozish muammoni o'zicha hal qilish ekanini topadi",
  gap: "Bola voqeadan kim · qachon · nimasi og'ir bo'laklarini tanlab aniq muammo gapini yig'adi",
  ilova: "Bola Uzum ilovasidagi to'rt joyni ochib, har biri bitta muammoga javob — yechim ekanini biladi",
  s10: "Bola yangi taklifga birinchi «bu kimning qaysi muammosini hal qiladi?» deb so'rashni tanlaydi",
  natija: "Bola uch kartani aylantirib, odam mahsulotning o'zini emas, natijani olishini va «vazifa» atamasini biladi",
  s12: "Bola uch mahsulot orqasidagi vazifa — sog'lom va baquvvat bo'lish ekanini topadi",
  juft: "Bola to'rt mahsulotni o'z vazifasiga ulaydi",
  karta: "Bola o'z g'oyasi uchun to'rt savolli kartani yozadi va u keyingi darslarga saqlanadi",
  tekshir: "Bola uch tayyor kartadagi chala qatorni va nimasi yetishmasligini topadi",
  ai: "Bola AI (yoki sherigi) kartasidagi odam o'rnida javob berganini kartasi bilan solishtirib, o'zi tuzatadi yoki qoldiradi",
  sherik: "Bola g'oyasini sherigiga 30 soniyada aytib, sherik nima deganini bir qatorga yozadi",
  podium: "Bola testlardagi natijasini (jonlida — sinf reytingini) ko'radi",
  flash: "Bola beshta karta bilan darsning asosiy fikrlarini takrorlaydi",
  yakun: "Bola CodeStrike arenasida 12 savolga javob beradi, darsning to'rt fikrini ko'rib, darsni yakunlaydi"
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

// Ballik ekranlar javob kaliti — Jonli TASDIQLAYDI. ✓ pozitsiyalari aralash (s4=1 · s7=3 · s10=0 · s12=2);
// QuestionScreen'dagi correctIdx shu qiymatlardan olinadi (bitta manba). practice = ishtirok-kalit (-1).
const INLINE_KEYS = { s4: 1, s7: 3, s10: 0, s12: 2, practice: -1 };

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
  const [picked, setPicked] = useState(() => { const v = storedAnswer?.lastPicked ?? storedAnswer?.picked; return Number.isInteger(v) && v >= 0 && v < options.length ? v : null; }); // F-0915-02
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
  // Avatar-zaxira (pilot naqshi, F-0924): surat 1,6 MB va sekin yuklanadi — yuklanguncha yoki umuman kelmasa doira
  // bo'sh qolmasin: 🧑‍🏫 belgisi accentSoft fonda. Surat faqat haqiqatan yuklangach (onLoad / complete) ko'rinadi.
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
// Aniq gap qolipi (senariy 8/14-ekran): «{QACHON} {KIM} {NIMASI OG'IR}.»
// RU: «Когда …» / «вечером, после школы» — ergash qism yoki aniqlovchi; keyingi bo'lakdan oldin vergul kerak (QA: «…учителю староста…»).
// Xuddi shu qoida KIM'dagi sifatdosh oborotini ham yopadi («подростки, играющие в футбол во дворе, приходят…» — PM-tekshiruvchi 24.09).
const ruComma = (s) => (__lang === 'ru' && s && (/^(когда|если)\s/i.test(s) || s.includes(',')) && !/[,.;:!?]$/.test(s) ? `${s},` : s);
const gapOf = (qachon, kim, ogir) => {
  const q = clean(qachon), k = clean(kim), o = clean(ogir);
  const qq = k ? ruComma(q) : q;
  const kk = o ? ruComma(k) : k;
  const s = [qq, kk, o].filter(Boolean).join(' ');
  if (!s) return '';
  return capFirst(/[.!?…]$/.test(s) ? s : `${s}.`);
};
// F-0915-02 (pilot cardSafe naqshi): kartadagi buzuq qiymat oq ekran bermasin — faqat satr maydonlar olinadi.
const cardSafe = () => { const c = cardRead(); if (!c || typeof c !== 'object' || Array.isArray(c)) return {}; const o = {}; Object.keys(c).forEach(k => { if (typeof c[k] === 'string') o[k] = c[k]; }); return o; };
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
// Bosib ochish ekranlari (46-qonun): qayta bosilsa yopiladi; darvoza — `seen` (kamida bir marta ochildi).
const useOpenSeen = () => {
  const [opened, setOpened] = useState(() => new Set());
  const [seen, setSeen] = useState(() => new Set());
  const toggle = (k) => {
    setOpened(p => { const n = new Set(p); if (n.has(k)) n.delete(k); else n.add(k); return n; });
    setSeen(p => { if (p.has(k)) return p; const n = new Set(p); n.add(k); return n; });
  };
  return { opened, seen, toggle };
};

// Xulosa-ramka paydo bo'lganda ko'rinadigan joyga suriladi (FeedbackBlock naqshi) — pastda qolib ketmasin.
const ScrollIn = ({ className, children }) => {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => { if (ref.current && ref.current.scrollIntoView) ref.current.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' }); }, 150); return () => clearTimeout(t); }, []);
  return <div ref={ref} className={className}>{children}</div>;
};

// ===== 1-EKRAN — HOOK: ovoz berish (hamma javob to'g'ri, §119) + jonli sinf-diagrammasi =====
const HOOK_OPTS = [
  { uz: 'Aniq bir narsani izlab topish uchun', ru: 'Чтобы найти конкретную вещь' },
  { uz: 'Narxlarni solishtirib ko\'rish uchun', ru: 'Чтобы сравнить цены' },
  { uz: 'Buyurtmam qayerdaligini bilish uchun', ru: 'Чтобы узнать, где мой заказ' },
  { uz: 'Shunchaki ko\'rib chiqish uchun', ru: 'Просто чтобы посмотреть' },
];
// Har sabab ilovaning qaysi joyiga olib boradi (faqat ko'rinish, ball yo'q): izlash → qidiruv · narx → narx · buyurtma → yetkazish · ko'rish → rasm
const HOOK_LIT = ['qidiruv', 'narx', 'muddat', 'rasm'];
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
  const shown = counts;
  const totalVotes = shown ? shown.reduce((a, b) => a + b, 0) : 0;
  // 90-qonun (F-0924-04): nol ovozda bo'sh «0%» jadvali chiqmaydi — o'rnida «Ovozlar kutilmoqda» chipi (B3 naqshi).
  const voteWait = isLive && (picked !== null || isMentor) && totalVotes === 0;
  const revealViz = isLive && shown && totalVotes > 0 && (picked !== null || isMentor);
  const topIdx = revealViz ? shown.indexOf(Math.max(...shown)) : -1;
  const optWave = useTurnHint(picked === null && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish · ovoz berish', ru: 'Введение · голосование' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} turnBusy={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Javobingizni belgilang', ru: 'Отметьте свой ответ' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen hk-screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)', justifyContent: 'safe center' }}>
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>Uzumga</span> oxirgi marta nima sababdan kirgansiz?</>, ru: <>Зачем вы в последний раз заходили в <span className="italic" style={{ color: T.accent }}>Uzum</span>?</> })}</h2>
          <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "Uzumga kirmagan bo'lsangiz — boshqa internet-do'konni o'ylang.", ru: 'Если вы не заходили в Uzum — вспомните другой интернет-магазин.' })}</p>
        </div>
        {/* MG (F-0924-03): NEGA + bitta chorlov; hook javobini («to'rttasi ham odatiy») oldindan aytmaydi. Yakuniy matn — metodist 24.09. */}
        <Mentor>{tr({ uz: <>Sizning tajribangiz ham bugungi darsga misol bo'ladi — oxirgi kirishingizni eslab, <b style={{ color: T.ink }}>to'rt javobdan</b> birini belgilang.</>, ru: <>Ваш опыт тоже станет примером для сегодняшнего урока — вспомните свой последний заход и отметьте <b style={{ color: T.ink }}>один из четырёх ответов</b>.</> })}</Mentor>
        <div className="split hk-split">
          {/* Chap: brendsiz internet-do'kon sxemasi — bosilmaydi (F-0924-04, B1 hk-split naqshi). Imzo-harakat: tovar savatga
              tushadi → «ertaga» yonadi. Ovoz berilgach tanlangan sabab ilovaning qaysi joyiga olib borishi yonadi (HOOK_LIT) —
              «bitta ilova, turli sabab» fikrini ko'rsatadi. Zoomable fade-up ichida emas — sahna faqat opacity bilan kiradi (.hk-in). */}
          <div className="hk-scene hk-in"><Zoomable><UzumScheme fx fxDone={picked !== null} lit={picked !== null ? new Set([HOOK_LIT[picked]]) : null} /></Zoomable></div>
          <Col>
        {/* 111-qonun (QA 24.09): variantlar ustidagi «Javobingizni belgilang» yozuvi olindi — mentor-gap va tugma yorlig'idan keyin
            uchinchi takror edi (PmLesson2 da bu joyda SAVOL turadi, B4 da savol sarlavhaning o'zida). */}
        {/* Sinf ovozi VARIANTNING O'ZIDA (58-qonun, 3/4-o'tish 2-darsi naqshi, QA 2026-09-24): alohida ovoz-jadvali to'rt yorliqni
            takrorlab ~137px egallardi va jonli rejimda 1280x800 da 71–108px aylantirish berardi. Endi har variant o'ng chetida
            «👥 N%», pastki chetida ingichka chiziq — tugma balandligi o'zgarmaydi. Ko'p ovoz olgan variant — yashil. */}
        <div className={`hk-opts fade-up delay-2${revealViz ? ' voted' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 9 }} role={revealViz ? 'group' : undefined} aria-label={revealViz ? tr({ uz: 'Sinf ovozlari', ru: 'Голоса класса' }) : undefined}>
          {HOOK_OPTS.map((o, i) => {
            const on = picked === i;
            const locked = picked !== null || isMentor;
            const pct = revealViz ? Math.round((shown[i] / totalVotes) * 100) : 0;
            const top = revealViz && i === topIdx;
            return (
              <button key={i} className={`hk-opt ${on ? 'on' : ''}${revealViz ? ' has-vote' : ''}${!locked && optWave ? ` turn-ring turn-wave wv4 w${i + 1}` : ''}`} disabled={locked} onClick={() => pick(i)}>
                <span className="hk-radio">{on && <span className="hk-dot" />}</span>
                <span>{tr(o)}</span>
                {revealViz && <span className={`hk-vote mono fade-step${top ? ' top' : ''}`}>👥 {pct}%</span>}
                {revealViz && <span className={`hk-vbar${top ? ' top' : ''}`} aria-hidden="true"><i style={{ width: `${Math.max(pct, 4)}%` }} /></span>}
              </button>
            );
          })}
        </div>
        {(picked !== null || (isMentor && totalVotes > 0)) && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "To'rttasi ham odatiy sabab. Bitta odam ilovaga turli kuni turli maqsadda kiradi. Bugun odamlar ilovaga nima uchun kirishini va ularga nima kerakligini ko'rib chiqamiz.", ru: 'Все четыре — обычные причины. Один и тот же человек в разные дни заходит в приложение с разной целью. Сегодня разберём, зачем люди заходят в приложение и что им нужно.' })}</p></div>}
        {voteWait && <span className="done-mini fade-step">{tr({ uz: '👥 Ovozlar kutilmoqda…', ru: '👥 Ждём голоса…' })}</span>}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== 2-EKRAN — MAQSAD: jonli natija-preview =====
// Imzo: to'rt savol birma-bir chiqadi, har birining javobi «yozilib» boradi; to'rtinchisi yonida «✓ TAYYOR» shtampi.
// Namuna — tayyor g'oya «Sinf» (READY_IDEAS; 14-ekran namunalari «Futbol»dan — javob oldindan ochilmaydi).
// «yollandi» so'zi 11-ekrandan oldin chiqmaydi (senariy). CSS-taymlayn (--fd); reduced-motion'da darhol to'liq holat.
const GOAL_Q = [
  { k: 'kim', q: { uz: 'Sayt kim uchun?', ru: 'Для кого сайт?' } },
  { k: 'muammo', q: { uz: 'Odam qanday muammoga duch keladi?', ru: 'С какой проблемой сталкивается человек?' } },
  { k: 'qiladi', q: { uz: 'Sayt nima qiladi?', ru: 'Что делает сайт?' } },
  { k: 'erishadi', q: { uz: 'Odam oxirida nimaga erishadi?', ru: 'Чего человек добивается в итоге?' } },
];
const GoalDemo = () => {
  const [run, setRun] = useState(0);
  const idea = READY_IDEAS.find(x => x.id === 'sinf') || READY_IDEAS[0];
  const vals = { kim: capFirst(tr(idea.kim)), muammo: gapOf(tr(idea.qachon), tr(idea.kim), tr(idea.ogir)), qiladi: capFirst(tr(idea.qiladi)), erishadi: capFirst(tr(idea.erishadi)) };
  return (
    <div className="gq-demo fade-up delay-1" key={run}>
      <button type="button" className="gq-replay" onClick={() => setRun(r => r + 1)}><span className="gq-replay-ic" aria-hidden="true">↻</span> {tr({ uz: 'Qayta', ru: 'Ещё раз' })}</button>
      <span className="gq-tag">🗂 {tr({ uz: 'Namuna', ru: 'Пример' })} · {tr(idea.olam)}</span>
      {GOAL_Q.map((g, i) => (
        <div key={g.k} className={`gq-row ${g.k}`} style={{ '--fd': `${0.4 + i * 1.1}s` }}>
          <span className="gq-q"><i className="gq-n">{i + 1}</i>{tr(g.q)}</span>
          <span className="gq-a"><span className="gq-type">{vals[g.k]}</span></span>
          {i === GOAL_Q.length - 1 && <span className="gq-stamp" aria-hidden="true">✓ {tr({ uz: 'TAYYOR', ru: 'ГОТОВО' })}</span>}
        </div>
      ))}
    </div>
  );
};
const ScreenGoal = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun g'oyangizni <span className="italic" style={{ color: T.accent }}>to'rt savolda</span> yozib chiqasiz</>, ru: <>Сегодня вы опишете свою идею <span className="italic" style={{ color: T.accent }}>в четырёх вопросах</span></> })}</h2></div>
      <Mentor>{tr({ uz: "Dars oxirida bitta g'oya haqida to'rt savolga javob yozasiz: sayt kim uchun, odam qanday muammoga duch keladi, sayt nima qiladi va odam oxirida nimaga erishadi. G'oyani o'zingiz o'ylab topasiz yoki tayyor g'oyalardan birini tanlaysiz.", ru: 'К концу урока вы ответите на четыре вопроса об одной идее: для кого сайт, с какой проблемой сталкивается человек, что делает сайт и чего человек добивается в итоге. Идею вы придумаете сами или выберете одну из готовых.' })}</Mentor>
      <GoalDemo />
    </div>
  </Stage>
);

// ⛶ ZOOMABLE — pilot (PmLesson2 `Zoomable` porti): proyektorda asosiy maketni kattalashtirish (Esc / fon bosilsa yopiladi).
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
// Ustun-yorlig'i (pilot · PmLesson2 .flow-label): «NIMA — NIMA QILASIZ», ≤6 so'z.
// F-0925-B12: bo'sh yozish maydonida aniq chorlov (placeholder'siz maydon bo'sh oq quti bo'lib ko'rinardi).
const WRITE_PH = { uz: 'Shu yerga yozing…', ru: 'Напишите здесь…' };
const FlowLabel = ({ children }) => <p className="flow-label fl-col">{children}</p>;

// ===== UZUM ILOVASI SXEMASI — brendsiz (logotip va brend-rangi yo'q), faqat ilovada ko'rinadigan joylar =====
// Ixcham tovar sahifasi (split ichida ~320px): status-qator · qidiruv · [rasm | nom · narx · sharhdan bir gap] ·
// baho va sharhlar · yetkazish kuni · topshirish punkti · «Savatga». Kulrang chiziq yo'q — qisqa material-matn (UZ_MAT),
// hammasi aria-hidden. `lit` — yonib turgan joylar (Set: qidiruv · narx · rasm · sharh · muddat · punkt),
// `spot(k)` — 9-ekranda raqamli tugma. `fx` — hook imzo-harakati: tovar rasmdan «Savatga»ga tushadi, savatda «1»
// paydo bo'ladi, keyin «Yetkazish: ertaga» yonadi (qidiruv → tanlash → savat → yetkazish; OLX qidiruv-yozuvi emas).
// `fxDone` — ovoz berilgach harakat to'xtaydi (tovar savatda qoladi). Reduced-motion'da darhol yakuniy holat.
const UZ_MAT = {
  name: { uz: 'Smartfon, 128 GB', ru: 'Смартфон, 128 ГБ' },
  rev: { uz: '«Kamerasi juda yaxshi»', ru: '«Отличная камера»' },
};
const UzumScheme = ({ lit, spot, fx = false, fxDone = false }) => {
  const has = (k) => !!(lit && lit.has(k));
  const on = (k) => (has(k) ? ' lit' : '') + (spot ? ' sp' : '');
  return (
    <div className={`uz-phone fade-up delay-1${fx ? ' fx' : ''}${fxDone ? ' fx-done' : ''}`} aria-label={tr({ uz: 'Internet-do\'kon ilovasi sxemasi', ru: 'Схема приложения интернет-магазина' })}>
      <div className="uz-status" aria-hidden="true"><b>9:41</b><i className="uz-notch" /><span className="uz-batt"><i /></span></div>
      <div className={`uz-row uz-search${on('qidiruv')}`}><span className="uz-back" aria-hidden="true">‹</span><span className="uz-field" aria-hidden="true"><span className="uz-ic">🔍</span><span className="uz-ph">{tr({ uz: 'Qidirish', ru: 'Поиск' })}…</span></span>{spot && spot('qidiruv')}</div>
      <div className="uz-prod" aria-hidden="true">
        <div className={`uz-img${has('rasm') ? ' lit' : ''}`}><span className="uz-dev"><i /></span><span className="uz-heart">♡</span><span className="uz-dots"><i className="on" /><i /><i /><i /></span></div>
        <div className={`uz-info${has('narx') ? ' lit' : ''}`}>
          <span className="uz-name">{tr(UZ_MAT.name)}</span>
          <b className="uz-sum">3 299 000 <small>{tr({ uz: 'so\'m', ru: 'сум' })}</small></b>
          <span className="uz-rev">💬 {tr(UZ_MAT.rev)}</span>
        </div>
      </div>
      <div className={`uz-row uz-rate${on('sharh')}`}><span className="uz-line" aria-hidden="true"><span className="uz-stars">★★★★★</span><b>4,8</b><span className="uz-meta">· 312 {tr({ uz: 'sharh', ru: 'отзывов' })}</span></span>{spot && spot('sharh')}</div>
      <div className={`uz-row uz-deliv${on('muddat')}`}><span className="uz-line" aria-hidden="true"><span className="uz-ic">🚚</span><span className="uz-meta">{tr({ uz: 'Yetkazish:', ru: 'Доставка:' })}</span><b>{tr({ uz: 'ertaga', ru: 'завтра' })}</b></span>{spot && spot('muddat')}</div>
      <div className={`uz-row uz-pick${on('punkt')}`}><span className="uz-line" aria-hidden="true"><span className="uz-ic">📍</span><b>{tr({ uz: 'Topshirish punkti', ru: 'Пункт выдачи' })}</b><span className="uz-meta">· {tr({ uz: 'uyga yaqin', ru: 'рядом с домом' })}</span></span>{spot && spot('punkt')}</div>
      <div className="uz-cart" aria-hidden="true"><span>🛒 {tr({ uz: 'Savatga', ru: 'В корзину' })}</span>{fx && <i className="uz-badge">1</i>}</div>
      {fx && <span className="uz-fly" aria-hidden="true"><i /></span>}
    </div>
  );
};

// ===== 3-EKRAN — IKKI VAZIYAT, BITTA ILOVA: bosib ochish (toggle, 46-qonun) — sxemada har biri qaraydigan joy yonadi =====
const PEOPLE = [
  { id: 'telefon', ic: '📱', t: { uz: 'Yangi telefon izlayotgan o\'quvchi', ru: 'Ученик, который ищет новый телефон' }, think: { uz: '«Yaxshi telefonmi?»', ru: '«Хороший ли телефон?»' }, spot: 'sharh' },
  { id: 'sovga', ic: '🎁', t: { uz: 'Ertaga sovg\'a bermoqchi bo\'lgan o\'quvchi', ru: 'Ученик, который хочет завтра сделать подарок' }, think: { uz: '«Ertaga yetib keladimi?»', ru: '«Доставят ли к завтра?»' }, spot: 'muddat' },
];
const ScreenTwo = ({ screen, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState(() => new Set());
  const tap = (id) => { setOpen(o => (o === id ? null : id)); setSeen(p => { if (p.has(id)) return p; const n = new Set(p); n.add(id); return n; }); };
  const all = seen.size >= PEOPLE.length;
  const pend = PEOPLE.map(p => p.id).filter(id => !seen.has(id));
  const lit = useTurnWalk(pend, !isMentor); // pilot B1 naqshi: proyektorda navbat-yurishi yo'q
  const cur = PEOPLE.find(p => p.id === open);
  const litSet = new Set([cur ? cur.spot : null, all && !cur ? 'qidiruv' : null].filter(Boolean));
  return (
    <Stage eyebrow={tr({ uz: '1-qism · Kim uchun', ru: 'Часть 1 · Для кого' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!all && !isMentor} turnBusy={!all} label={all || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Ikkala o'quvchini bosib ko'ring", ru: 'Нажмите на обоих учеников' })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Uzumga kirgan ikki odam <span className="italic" style={{ color: T.accent }}>nimaga</span> ko'proq qaraydi?</>, ru: <>На что <span className="italic" style={{ color: T.accent }}>больше смотрят</span> два человека, зашедшие в Uzum?</> })}</h2></div>
        {/* MG (F-0924-03): NEGA + bitta chorlov, puls bilan bir halqa. Yakuniy matn — metodist 24.09. */}
        <Mentor>{tr({ uz: <>Sayt kim uchun ekanini odam nimaga qarashi ko'rsatadi — <b style={{ color: T.ink }}>ikki o'quvchini</b> birma-bir bosing.</>, ru: <>Для кого сайт, показывает то, на что смотрит человек, — нажмите по очереди на <b style={{ color: T.ink }}>двух учеников</b>.</> })}</Mentor>
        <Zoomable className="zsplit">
        <div className="split uz-split">
          <Col>
            <FlowLabel>{tr({ uz: 'Ikki o\'quvchi', ru: 'Два ученика' })}</FlowLabel>
            {PEOPLE.map(p => (
              <button key={p.id} type="button" className={`person ${open === p.id ? 'on' : ''} ${seen.has(p.id) ? 'seen' : ''}${turnCls(lit, p.id, pend.length > 1)}`} onClick={() => tap(p.id)} aria-pressed={open === p.id}>
                <span className="person-ic" aria-hidden="true">{p.ic}</span>
                <span className="person-t">{tr(p.t)}{open === p.id && <span className="person-think fade-step">{tr(p.think)}</span>}</span>
                {seen.has(p.id) && open !== p.id && <span className="person-ck">✓</span>}
              </button>
            ))}
            {/* 111-qonun (tozalik, 2026-09-24 QA): «📱 → ?» holat-paneli olib tashlandi — u sxemadagi yonadigan qatorni va
                kartadagi fikr-pufagini uchinchi marta takrorlardi, «?» chiplari esa tugmaga o'xshab bosilmasdi. */}
            {all && <ScrollIn className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Bitta saytga kirgan odamlarning maqsadi har xil bo'ladi. Hammaga yozilgan gapda hech kim o'zini tanimaydi. Saytdan foydalanadigan, ehtiyoji o'xshash odamlar guruhi <b>auditoriya</b> deyiladi. Ular kirganda birinchi qiladigan ish ko'zga tashlanib tursin: Uzumda xaridor odatda avval kerakli narsani qidiradi — qidiruv qatori tepada.</>, ru: <>У людей, зашедших на один сайт, разные цели. Во фразе, написанной для всех, никто себя не узнаёт. Группа людей со схожими потребностями, которые пользуются сайтом, называется <b>аудиторией</b>. То, что они делают первым, должно сразу бросаться в глаза: в Uzum покупатель обычно сначала ищет нужную вещь — строка поиска вверху.</> })}</p></ScrollIn>}
          </Col>
          <Col><FlowLabel>{tr({ uz: 'Ilova — kim qayerga qaraydi', ru: 'Приложение — кто куда смотрит' })}</FlowLabel><UzumScheme lit={litSet} /></Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== TEST-KARTA (P0 TestQ naqshi): vaziyat-karta + savol =====
const TestQ = ({ lead, ask }) => (
  <div className="tq">
    {lead && <p className="tq-lead">{lead}</p>}
    <h2 className="title h-ask">{ask}</h2>
  </div>
);

// ===== 4-EKRAN — TEST-1 =====
const ScreenTest1 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 1', ru: 'Проверка · 1' })} scope="module-mikro"
    question={<TestQ lead={tr({ uz: 'Sahifa tepasida faqat «Bizda hamma narsa bor!» deb yozilgan.', ru: 'Вверху страницы написано только: «У нас есть всё!»' })} ask={tr({ uz: 'Bunday sahifaning asosiy kamchiligi nimada?', ru: 'В чём главный недостаток такой страницы?' })} />}
    questionText={tr({ uz: '«Bizda hamma narsa bor!» sahifasining kamchiligi', ru: 'Недостаток страницы «У нас есть всё!»' })}
    options={[
      tr({ uz: "Uni o'qigan odam bu yerda narxlar qimmat deb o'ylab qoladi", ru: 'Прочитавший её подумает, что здесь высокие цены' }),
      tr({ uz: 'Uni o\'qigan odam sayt aynan unga kerakligini tushunmaydi', ru: 'Прочитавший её не понимает, что сайт нужен именно ему' }),
      tr({ uz: 'Unda sahifalar oddiy saytdagidan ancha sekinroq ochiladi', ru: 'Страницы на ней открываются намного медленнее, чем на обычном сайте' }),
      tr({ uz: "Uni reklama bo'lmasa, internetda hech kim topa olmaydi", ru: 'Если не будет рекламы, её в интернете никто не найдёт' }),
    ]}
    correctIdx={INLINE_KEYS.s4}
    explainCorrect={tr({ uz: '«Hamma narsa» — juda umumiy gap. Telefon izlayotgan o\'quvchi ham, sovg\'a bermoqchi bo\'lgan o\'quvchi ham unda o\'ziga kerakli narsani ko\'rmaydi.', ru: '«Всё» — слишком общая фраза. Ни ученик, который ищет телефон, ни ученик, который хочет сделать подарок, не видят в ней того, что нужно именно им.' })}
    explainWrong={{
      0: tr({ uz: "Gap narxda emas: sahifada narx haqida hech narsa yo'q. Bu gap kimga aytilgan?", ru: 'Дело не в цене: о ценах на странице ничего нет. Кому адресована эта фраза?' }),
      2: tr({ uz: 'Gap tezlikda emas. Bu gap kimga aytilgan?', ru: 'Дело не в скорости. Кому адресована эта фраза?' }),
      3: tr({ uz: 'Gap topishda emas. Sahifani ochgan odam unda o\'zini ko\'radimi?', ru: 'Дело не в том, как её найти. Узнает ли себя в ней человек, открывший страницу?' }),
      default: tr({ uz: 'Bu gap kimga aytilgan?', ru: 'Кому адресована эта фраза?' }),
    }}
  />
);

// ===== 5-EKRAN — MUAMMONING TO'RT BELGISI: bosib ochish (induktiv: old tomonda voqea, ochilganda belgi nomi — senariy D-4) =====
const SIGNS = [
  { ic: '🔁', ex: { uz: 'Har safar katta shaharga borishi kerak', ru: 'Каждый раз приходится ехать в большой город' }, name: { uz: 'Muammo qayta-qayta takrorlanadi', ru: 'Проблема повторяется снова и снова' } },
  { ic: '🛠️', ex: { uz: 'Shaharga ketayotgan tanishidan «olib keling» deb so\'raydi', ru: 'Просит знакомого, который едет в город: «Привезите, пожалуйста»' }, name: { uz: "Odam muammoni o'zicha hal qilishga urinadi", ru: 'Человек сам пытается решить проблему' } },
  { ic: '⏳', ex: { uz: 'Borib-kelishga bir kun va yo\'l haqi ketadi', ru: 'На дорогу туда и обратно уходит день и деньги за проезд' }, name: { uz: 'Vaqt yoki pul yo\'qotadi', ru: 'Теряет время или деньги' } },
  { ic: '🚪', ex: { uz: '«Mayli, olmay qo\'ya qolay» deydi', ru: 'Говорит: «Ладно, не буду покупать»' }, name: { uz: 'Ba\'zan kerakli narsasidan voz kechadi', ru: 'Иногда отказывается от нужной вещи' } },
];
const ScreenSigns = ({ screen, onNext, onPrev }) => {
  const { isMentor } = useIsMentor(); // mentor jonli darsda kartalarni ochmasdan ham o'ta oladi
  const { opened, seen, toggle } = useOpenSeen();
  const allSeen = seen.size >= SIGNS.length;
  const pend = SIGNS.map((_, i) => String(i)).filter(k => !seen.has(Number(k)));
  const lit = useTurnWalk(pend, !isMentor); // pilot B1 naqshi: proyektorda navbat-yurishi yo'q
  const left = SIGNS.length - seen.size;
  return (
    <Stage eyebrow={tr({ uz: '2-qism · Muammoni qanday topamiz', ru: 'Часть 2 · Как найти проблему' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!allSeen && !isMentor} turnBusy={!allSeen} label={allSeen || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Yana ${left} ta kartani oching`, ru: `Откройте ещё карточки: ${left}` })} onClick={onNext} /></>}>
      <div className="screen dense sg-screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tumanda yashaydigan odam telefon sotib olmoqchi bo'lsa, <span className="italic" style={{ color: T.accent }}>nima qilardi</span>?</>, ru: <>Что бы сделал человек из района, <span className="italic" style={{ color: T.accent }}>если бы захотел купить телефон</span>?</> })}</h2></div>
        {/* MG (F-0924-03): NEGA + bitta chorlov, puls bilan bir halqa. Yakuniy matn — metodist 24.09. */}
        <Mentor>{tr({ uz: <>Tumanda yashaydigan xaridor qiynalayotganini aytmasa ham, qiladigan ishlari ko'rsatib turadi — har kartadagi <b style={{ color: T.ink }}>«Bu qaysi belgi?»</b>ni bosing.</>, ru: <>Покупатель из района не говорит, что ему трудно, но его поступки это показывают, — нажмите <b style={{ color: T.ink }}>«Какой это признак?»</b> на каждой карточке.</> })}</Mentor>
        {/* 111-qonun (tozalik, QA 24.09): persona-chip (sarlavha va mentor-gapdagi odamning uchinchi takrori) va «0/4» o'lchagich
            (tugmadagi «Yana N ta kartani oching» sanog'ining takrori) olib tashlandi; senariy yozuvi (kartalar ustida) qoladi. */}
        <div className="sg-top fade-up delay-1">
          <span className="flow-label">{tr({ uz: 'Muammo borligini qanday bilamiz?', ru: 'Как понять, что проблема есть?' })}</span>
        </div>
        <div className="sg-grid fade-up delay-2">
          {SIGNS.map((s, i) => {
            const open = opened.has(i);
            return (
              <button key={i} type="button" className={`sg-card ${open ? 'open' : ''} ${seen.has(i) ? 'seen' : ''}${turnCls(lit, String(i), pend.length > 1)}`} onClick={() => toggle(i)} aria-expanded={open}>
                <span className="sg-ic" aria-hidden="true">{s.ic}</span>
                <span className="sg-ex">{tr(s.ex)}</span>
                {open ? <span className="sg-name fade-step">{tr(s.name)}</span> : <span className="sg-cue">{tr({ uz: 'Bu qaysi belgi? ▾', ru: 'Какой это признак? ▾' })}</span>}
              </button>
            );
          })}
        </div>
        {allSeen && <ScrollIn className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Odam muammoni o\'zicha hal qilishga urinayotgan bo\'lsa, bu muammo unga befarq emasligini ko\'rsatadi. Belgilar qancha ko\'p bo\'lsa, muammo shuncha rost.', ru: 'Если человек сам пытается решить проблему, значит, она ему не безразлична. Чем больше признаков, тем реальнее проблема.' })}</p></ScrollIn>}
      </div>
    </Stage>
  );
};

// ===== 6-EKRAN — HAQIQIY VOQEA: UZUM (bashorat + 3 slayd, faqat bank-faktlari, ehtiyotkor ifoda) =====
const K_PREDICT = {
  ask: { uz: '2022-yil oktabr, Uzum Market ishga tushyapti. Sizningcha, Uzum avval nimaga e\'tibor qaratdi?', ru: 'Октябрь 2022 года, запускается Uzum Market. Как вы думаете, на что Uzum обратил внимание в первую очередь?' },
  chips: [
    { ic: '📱', t: { uz: 'Chiroyli sayt va qulay ilovaga', ru: 'На красивый сайт и удобное приложение' } },
    { ic: '🚚', t: { uz: 'Narsani xaridorga yetkazib berishga', ru: 'На доставку вещей покупателю' } },
    { ic: '📺', t: { uz: 'Televizor va ko\'chadagi reklamaga', ru: 'На рекламу по телевизору и на улицах' } },
  ],
  ans: 1,
};
const K_SLIDES = [
  { ic: '💬', body: { uz: 'Undan oldin ko\'pchilik narsani Instagram va Telegram guruhlaridan xarid qilardi. Lekin narsani xaridorga yetkazib berish har doim ham yo\'q edi.', ru: 'До этого многие покупали вещи в Instagram и Telegram-группах. Но доставки до покупателя было не всегда.' } },
  { ic: '🚚', body: { uz: 'Uzumning dastlabki asosiy e\'tibori narsani xaridorga yetkazib berishga qaratildi: o\'z mashinalari, topshirish punktlari (buyurtmani borib oladigan joy) va ertasi kuni yetkazish.', ru: 'Поначалу главное внимание Uzum уделил доставке вещей покупателю: свои машины, пункты выдачи (место, где забирают заказ) и доставка на следующий день.' } },
  { ic: '🦄', body: { uz: '2024-yil martda Uzum O\'zbekistonda 1 milliard dollardan qimmat baholangan birinchi kompaniya bo\'ldi. Bunday kompaniyalarni «yagona shoxli» deb atashadi. 2025-yilda Uzumga oyiga 17 millionga yaqin odam kirgan.', ru: 'В марте 2024 года Uzum стал первой компанией в Узбекистане, которую оценили дороже 1 миллиарда долларов. Такие компании называют «единорогами». В 2025 году в Uzum заходили около 17 миллионов человек в месяц.' } },
];
const ScreenCase = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [i, setI] = useState(0);
  const [bet, setBet] = useState(undefined);
  const last = i === K_SLIDES.length - 1;
  const betPending = i === 0 && bet === undefined;
  useEffect(() => { if (last && storedAnswer === undefined) onAnswer(screen, { correct: true }); }, [last]); // eslint-disable-line
  const c = K_SLIDES[i];
  const betHint = useTurnHint(betPending);
  // Navbat-zanjiri: taxmin → slayd ichidagi «Keyingisi →» → (oxirida) NavNext. Slayd o'z boshqaruvi bilan (F-0924-07, B3 k-nav naqshi).
  const nextTurn = useTurnHint(!betPending && !last && !isMentor);
  const navLabel = isMentor || (!betPending && last) ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : betPending ? tr({ uz: 'Avval taxminingizni tanlang', ru: 'Сначала выберите свою догадку' })
    : tr({ uz: 'Avval voqeani oxirigacha oching', ru: 'Сначала откройте историю до конца' });
  return (
    <Stage eyebrow={tr({ uz: 'Haqiqiy voqea · Uzum', ru: 'Реальная история · Uzum' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={betPending || !last} disabled={(betPending || !last) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense kp-screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <><span className="italic" style={{ color: T.accent }}>Uzum</span> dastlab qaysi muammoga javob berdi?</>, ru: <>На какую проблему <span className="italic" style={{ color: T.accent }}>Uzum</span> ответил поначалу?</> })}</h2></div>
        {/* MG (F-0924-03/07): qiziqtirish + chorlov, PmLesson1 qolipi; javob aytilmaydi. Rasm yo'q — 22.09 filtri. Yakuniy matn — metodist 24.09.
            B-18 (korpus B-18 naqshi, Airbnb/Netflix darslari bilan bir xil): gap holatga qarab almashadi, chorlov puls turgan elementni aytadi —
            taxmin oldidan → chiplar · taxmin tanlangach (1- va 2-slayd) → «Keyingisi →» · oxirgi slaydda (u yerda «Keyingisi →» yo'q) → «Davom etish» (7-ekran TEST-2 ga ko'prik).
            2-holat qiziqtiradi, lekin 3-slayd raqamlarini oldindan aytmaydi va «yetkazib bergani uchun o'sdi» degan sabab-da'vo qilmaydi (B-8, keys-halollik).
            O'lchov (grapheme, eng og'ir holat — adashgan taxmin + 1-slayd): eski statik gap bilan 407 → 396. */}
        <Mentor>{betPending
          ? tr({ uz: <>Uzum tarixi sizning g'oyangizga ham saboq — avval <b style={{ color: T.ink }}>uch taxmindan</b> birini belgilang.</>, ru: <>История Uzum — урок и для вашей идеи, — сначала отметьте <b style={{ color: T.ink }}>одну из трёх догадок</b>.</> })
          : !last
          ? tr({ uz: <>Uzum qanchalik o'sganini oxirgi slayd aytadi — <b style={{ color: T.ink }}>«Keyingisi →»</b>ni bosing.</>, ru: <>Насколько вырос Uzum, покажет последний слайд, — нажмите <b style={{ color: T.ink }}>«Следующий →»</b>.</> })
          : tr({ uz: <>Endi muammoning belgisini o'zingiz topasiz — <b style={{ color: T.ink }}>«Davom etish»</b>ni bosing.</>, ru: <>Теперь вы сами найдёте признак проблемы, — нажмите <b style={{ color: T.ink }}>«Продолжить»</b>.</> })}</Mentor>
        {i === 0 && (
          /* Taxmin berilgach bashorat-bloki ixchamlashadi (kp-bet.done, B2 naqshi): savol va eyebrow yashirinadi — o'z taxmini
             binafsha ✗ chip, asl javob yashil ✓ chip bo'lib yonma-yon qoladi («asl javob «…»» yozuvi faqat ekran-o'quvchiga). */
          <div className={`kp-bet fade-step${bet !== undefined ? ' done' : ''}`}>
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
                    <span className="kp-ic">{ch.ic}</span>{tr(ch.t)}
                    {locked && isAns && <span className="kp-mark ok">✓</span>}
                    {locked && !isAns && bet === k && !isMentor && <span className="kp-mark no">✗</span>}
                  </button>
                );
              })}
            </div>
            {/* 111-qonun (QA 24.09): «Birini tanlang — javobi ochiladi.» qatori olindi — mentor-gap, 🎲 yorlig'i va tugma yorlig'idan keyin to'rtinchi takror edi */}
            {bet !== undefined && !isMentor && (<p className={`kp-res ${bet === K_PREDICT.ans ? 'hit' : 'miss'}`}>{bet === K_PREDICT.ans ? tr({ uz: '🎯 Topdingiz!', ru: '🎯 Угадали!' }) : tr({ uz: <>Adashdingiz — asl javob: «{tr(K_PREDICT.chips[K_PREDICT.ans].t)}».</>, ru: <>Не угадали — на самом деле: «{tr(K_PREDICT.chips[K_PREDICT.ans].t)}».</> })}</p>)}
          </div>
        )}
        {/* Taxmindan keyin slayd ko'rish maydoniga suriladi — «Keyingisi →» 1280×800 da pastda qolmasin (F-0924-07) */}
        {(i > 0 || bet !== undefined) && (
          <ScrollIn className="k-slide ph fade-step revealed" key={i}>
            <span className="k-slide-eyebrow">{tr({ uz: 'Slayd', ru: 'Слайд' })} {i + 1} / {K_SLIDES.length}</span>
            <div className="k-fig"><div className="k-slide-ic">{c.ic}</div></div>
            <p className="k-slide-body">{tr(c.body)}</p>
            <div className="k-nav">
              <button type="button" className="btn-soft k-prev" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущий' })}</button>
              <div className="k-dots">{K_SLIDES.map((_, k) => <button key={k} type="button" className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-slayd`, ru: `Слайд ${k + 1}` })} />)}</div>
              {!last && <button type="button" className={`k-next${nextTurn ? ' turn-ring' : ''}`} onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Следующий →' })}</button>}
            </div>
          </ScrollIn>
        )}
        {last && <ScrollIn className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Odamlar kerakli narsani Instagram va Telegram orqali topishi mumkin edi, lekin uni xaridorga yetkazib berish masalasi hal qilinmagan edi. Uzum shu muammoga javob beradigan xizmatni yo\'lga qo\'ydi.', ru: 'Нужную вещь люди могли найти через Instagram и Telegram, но вопрос доставки до покупателя не был решён. Uzum наладил сервис, который отвечает на эту проблему.' })}</p></ScrollIn>}
      </div>
    </Stage>
  );
};

// ===== 7-EKRAN — TEST-2 =====
const ScreenTest2 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 2', ru: 'Проверка · 2' })} scope="module-mikro"
    question={<TestQ lead={tr({ uz: "Tumanda yashaydigan qarindoshingiz har safar biror narsa kerak bo'lsa, Telegram guruhga «Toshkentdan kim olib kelib beradi?» deb yozadi.", ru: 'Ваш родственник живёт в районе. Каждый раз, когда ему что-то нужно, он пишет в Telegram-группу: «Кто привезёт из Ташкента?»' })} ask={tr({ uz: 'Bu nimani ko\'rsatadi?', ru: 'О чём это говорит?' })} />}
    questionText={tr({ uz: 'Telegram guruhga «kim olib kelib beradi?» deb yozish', ru: 'Писать в Telegram-группу «кто привезёт?»' })}
    options={[
      tr({ uz: 'U guruhda ko\'proq gaplashishni yaxshi ko\'radi', ru: 'Он любит побольше общаться в группе' }),
      tr({ uz: 'Bu shunchaki odat — orqasida muammo yo\'q', ru: 'Это просто привычка — никакой проблемы за ней нет' }),
      tr({ uz: 'Unga o\'sha narsalar unchalik shart emas', ru: 'Эти вещи ему не так уж нужны' }),
      tr({ uz: 'U narsa olish muammosini o\'zicha hal qilyapti', ru: 'Он сам решает проблему, как достать вещь' }),
    ]}
    correctIdx={INLINE_KEYS.s7}
    explainCorrect={tr({ uz: 'U kerakli narsani olish uchun har safar boshqa odamdan yordam so\'rayapti. Bu — muammoni o\'zicha hal qilishga urinayotganining belgisi.', ru: 'Чтобы достать нужную вещь, он каждый раз просит помощи у других. Это признак того, что он сам пытается решить проблему.' })}
    explainWrong={{
      0: tr({ uz: 'U guruhga suhbat uchun emas, narsa olish uchun yozadi.', ru: 'Он пишет в группу не ради общения, а чтобы достать вещь.' }),
      1: tr({ uz: 'Har safar birovdan so\'rash — oddiy odat emas. U qulay yo\'l topa olmaganini ko\'rsatishi mumkin.', ru: 'Каждый раз просить кого-то — не просто привычка. Это может говорить о том, что он не нашёл удобного способа.' }),
      2: tr({ uz: 'Har safar boshqa odamdan so\'rashi — unga o\'zi uchun qulay yechim topilmaganini ko\'rsatishi mumkin.', ru: 'То, что он каждый раз просит других, может говорить о том, что удобного решения для него пока нет.' }),
      default: tr({ uz: 'U har safar boshqa odamdan yordam so\'rayapti. Bu nimani ko\'rsatadi?', ru: 'Он каждый раз просит помощи у других. О чём это говорит?' }),
    }}
  />
);

// ===== 8-EKRAN — ANIQ GAP YIG'ING: konstruktor (imzo-vizual) =====
// Har bo'lakda 3 variant (✓ = indeks 0), ko'rinish tartibi aralash. Noto'g'ri variant ham tugal gap beradi (senariy qoidasi).
// RU: ko'plikdagi KIM tanlansa fe'l ham ko'plikka o'tadi (sg/pl).
const GAP_ROWS = [
  { k: 'kim', lbl: { uz: 'Kim?', ru: 'Кто?' }, order: [2, 0, 1], opts: [
    { uz: 'tumanda yashaydigan xaridor', ru: 'покупатель из района', pl: false },
    { uz: 'hamma odamlar', ru: 'все люди', pl: true },
    { uz: 'shahardagi xaridorlar', ru: 'покупатели в городе', pl: true },
  ], bad: { uz: 'Kim ekani aniq emas: qaysi odam, qayerda yashaydi?', ru: 'Непонятно, кто это: какой человек, где он живёт?' } },
  { k: 'qachon', lbl: { uz: 'Qachon?', ru: 'Когда?' }, order: [1, 2, 0], opts: [
    { uz: 'telefon olmoqchi bo\'lganda', ru: 'при покупке телефона' },
    { uz: 'bayram oldidan', ru: 'перед праздником' },
    { uz: 'dam olish kunlari', ru: 'по выходным' },
  ], bad: { uz: 'Voqeada bu vaqt yo\'q: u telefon olmoqchi bo\'lgan edi', ru: 'В истории нет такого времени: он хотел купить телефон' } },
  { k: 'ogir', lbl: { uz: 'Nimasi og\'ir?', ru: 'Что тяжело?' }, order: [0, 2, 1], opts: [
    { uz: 'bir kunini yo\'lga sarflaydi', ru: { sg: 'тратит целый день на дорогу', pl: 'тратят целый день на дорогу' } },
    { uz: 'do\'konlardan norozi', ru: { sg: 'недоволен магазинами', pl: 'недовольны магазинами' } },
    { uz: 'narsa tanlashda qiynaladi', ru: { sg: 'с трудом выбирает вещь', pl: 'с трудом выбирают вещи' } },
  ], bad: { uz: 'Norozi yoki qiynaladi — lekin aynan nima bo\'ldi, nima ketdi?', ru: 'Недоволен или с трудом — но что именно случилось, что было потрачено?' } },
];
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
  const litRow = useTurnWalk(pendRows, !isMentor);
  return (
    <Stage eyebrow={tr({ uz: '2-qism · Aniq gap', ru: 'Часть 2 · Точная фраза' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} turnBusy={!done} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Voqeaga mos bo'lakni tanlang (${okCount}/3)`, ru: `Выберите части по истории (${okCount}/3)` })} onClick={onNext} /></>}>
      <div className="screen dense gb-screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>«Xarid qilish qiyin» gapini qanday <span className="italic" style={{ color: T.accent }}>aniq</span> qilasiz?</>, ru: <>Как сделать фразу «покупать трудно» <span className="italic" style={{ color: T.accent }}>точной</span>?</> })}</h2></div>
        {/* MG (F-0924-03): NEGA + bitta chorlov, puls bilan bir halqa. Yakuniy matn — metodist 24.09. */}
        <Mentor>{tr({ uz: <>Uchala bo'lak voqeaning o'zida bor — <b style={{ color: T.ink }}>«Kim?»</b> qatoridan boshlab, har qatorda mos bo'lakni tanlang.</>, ru: <>Все три части уже есть в самой истории, — начните со строки <b style={{ color: T.ink }}>«Кто?»</b> и в каждой строке выберите подходящую часть.</> })}</Mentor>
        <div className="tq-card gb-lead fade-up delay-1"><p className="tq-story">{tr({ uz: 'Voqea: tumanda yashaydigan xaridor telefon olmoqchi bo\'ldi va bir kunini shaharga borib-kelishga sarfladi.', ru: 'История: покупатель из района захотел купить телефон и потратил целый день на поездку в город и обратно.' })}</p></div>
        {/* Uchala bo'lak topilgach qatorlar bir qatorga (3 ustun) yig'iladi — xulosa-ramka ekranga sig'adi (faqat joylashuv) */}
        <div className={`gb-rows fade-up delay-2${done ? ' all-ok' : ''}`}>
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
        {done && <ScrollIn className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: <>Uchala bo'lagi bor gap <b>aniq muammo</b> deyiladi. «Xarid qilish qiyin» esa shunchaki shikoyat: undan nimani tuzatish kerakligi bilinmaydi.</>, ru: <>Фраза, в которой есть все три части, называется <b>конкретной проблемой</b>. А «покупать трудно» — это просто жалоба: из неё непонятно, что исправлять.</> })}</p></ScrollIn>}
      </div>
    </Stage>
  );
};

// ===== 9-EKRAN — HAR NARSA — BITTA JAVOB: Uzum sxemasida 4 joy bosiladi, har biri o'z muammosini ochadi =====
// Tartib sxemadagi joylashuv bo'yicha (tepadan pastga) — raqamlar sxema bilan bir yo'nalishda o'qiladi; matnlar senariydan so'zma-so'z.
const APP_SPOTS = [
  { k: 'qidiruv', ic: '🔍', lbl: { uz: 'Qidiruv qatori', ru: 'Строка поиска' }, t: { uz: 'Qidiruv qatori — kerakli narsani varaqlab o\'tirmay topasiz', ru: 'Строка поиска — находите нужную вещь, не листая всё подряд' } },
  { k: 'sharh', ic: '⭐', lbl: { uz: 'Sharhlar va baho', ru: 'Отзывы и оценка' }, t: { uz: 'Sharhlar va baho — ushlab ko\'rmay turib ham, boshqalar fikriga qarab tanlaysiz', ru: 'Отзывы и оценка — даже не подержав вещь в руках, выбираете по мнению других' } },
  { k: 'muddat', ic: '🚚', lbl: { uz: 'Yetkazib berish muddati', ru: 'Срок доставки' }, t: { uz: 'Yetkazib berish muddati — narsa qachon kelishi oldindan bilinadi', ru: 'Срок доставки — заранее известно, когда придёт вещь' } },
  { k: 'punkt', ic: '📍', lbl: { uz: 'Topshirish punkti', ru: 'Пункт выдачи' }, t: { uz: 'Topshirish punkti — uyda kutmaysiz, qulay vaqtda borib olasiz', ru: 'Пункт выдачи — не нужно ждать дома, забираете в удобное время' } },
];
const ScreenApp = ({ screen, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const { opened, seen, toggle } = useOpenSeen();
  const allSeen = seen.size >= APP_SPOTS.length;
  const pend = APP_SPOTS.map(s => s.k).filter(k => !seen.has(k));
  const lit = useTurnWalk(pend, !isMentor); // pilot B1 naqshi: proyektorda navbat-yurishi yo'q
  const left = APP_SPOTS.length - seen.size;
  const numOf = (k) => APP_SPOTS.findIndex(s => s.k === k) + 1;
  const spot = (k) => {
    const s = APP_SPOTS.find(x => x.k === k);
    return <button type="button" className={`uz-spot ${opened.has(k) ? 'on' : ''} ${seen.has(k) ? 'seen' : ''}${turnCls(lit, k, pend.length > 1)}`} onClick={() => toggle(k)} aria-expanded={opened.has(k)} aria-label={tr(s.lbl)}>{seen.has(k) ? '✓' : numOf(k)}</button>;
  };
  return (
    <Stage eyebrow={tr({ uz: '3-qism · Muammodan yechimga', ru: 'Часть 3 · От проблемы к решению' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!allSeen && !isMentor} turnBusy={!allSeen} label={allSeen || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Yana ${left} ta raqamni bosing`, ru: `Нажмите ещё номера: ${left}` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Uzum ilovasidagi bu to'rt narsa <span className="italic" style={{ color: T.accent }}>qaysi muammoga</span> javob beradi?</>, ru: <>На <span className="italic" style={{ color: T.accent }}>какую проблему</span> отвечают эти четыре вещи в приложении Uzum?</> })}</h2></div>
        {/* MG (F-0924-03): NEGA + bitta chorlov, puls bilan bir halqa. Yakuniy matn — metodist 24.09. */}
        <Mentor>{tr({ uz: <>Xaridor ilovadagi har narsani nima uchun ishlatishini bilsangiz, o'z saytingizga nima kerakligini ham ko'rasiz — ilova sxemasidagi <b style={{ color: T.ink }}>raqamlarni</b> birma-bir bosing.</>, ru: <>Если знать, зачем покупатель пользуется каждой вещью в приложении, станет видно, что нужно и вашему сайту, — нажимайте по очереди на <b style={{ color: T.ink }}>цифры</b> на схеме приложения.</> })}</Mentor>
        <Zoomable className="zsplit">
        <div className="split">
          <Col><FlowLabel>{tr({ uz: 'Ilova', ru: 'Приложение' })}</FlowLabel><UzumScheme lit={opened} spot={spot} /></Col>
          <Col>
            <FlowLabel>{tr({ uz: "To'rt narsa — qaysi muammo?", ru: 'Четыре вещи — какая проблема?' })}</FlowLabel>
            <div className="ta-list fade-up delay-2">
              {APP_SPOTS.map((s, i) => (
                <button key={s.k} type="button" className={`ta-item ${opened.has(s.k) ? 'on' : ''}`} onClick={() => toggle(s.k)} aria-expanded={opened.has(s.k)}>
                  <span className="ta-item-n">{seen.has(s.k) ? '✓' : i + 1}</span>
                  <span className="ta-item-t">{opened.has(s.k) ? <span className="fade-step">{s.ic} {tr(s.t)}</span> : <span className="ta-item-q">{s.ic} {tr(s.lbl)} · ?</span>}</span>
                </button>
              ))}
            </div>
            {/* 111-qonun (QA 24.09): «🔍⭐🚚📍 n/4» holat-shkalasi olindi — ro'yxatdagi ✓ belgilarini va tugmadagi «Yana N ta» sanog'ini
                takrorlardi, ikonka-kataklari esa tugmaga o'xshab bosilmasdi. */}
            {allSeen && <ScrollIn className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: <>Har biri bitta aniq muammoga javob beradi. Muammoga javob beradigan shunday narsa <b>yechim</b> deyiladi.</>, ru: <>Каждая из них отвечает на одну конкретную проблему. Такая вещь, которая отвечает на проблему, называется <b>решением</b>.</> })}</p></ScrollIn>}
          </Col>
        </div>
        </Zoomable>
      </div>
    </Stage>
  );
};

// ===== 10-EKRAN — TEST-3 =====
const ScreenTest3 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 3', ru: 'Проверка · 3' })} scope="module-mikro"
    question={<TestQ lead={tr({ uz: 'Internet-do\'kon ilovasi jamoasida kimdir taklif qildi: «Ilova ochilganda chiroyli animatsiya qo\'shaylik».', ru: 'В команде приложения интернет-магазина кто-то предложил: «Давайте добавим красивую анимацию при открытии приложения».' })} ask={tr({ uz: 'Birinchi qaysi savolni berasiz?', ru: 'Какой вопрос вы зададите первым?' })} />}
    questionText={tr({ uz: 'Animatsiya taklifiga birinchi savol', ru: 'Первый вопрос к предложению с анимацией' })}
    options={[
      tr({ uz: 'Bu kimning qaysi muammosini hal qiladi?', ru: 'Чью и какую проблему это решает?' }),
      tr({ uz: 'Animatsiyani yasashda qanday muammo chiqadi?', ru: 'Какие проблемы возникнут при создании анимации?' }),
      tr({ uz: 'Bu qaysi rangda odamlarga ko\'proq yoqadi?', ru: 'В каком цвете это больше понравится людям?' }),
      tr({ uz: 'Boshqa ilovalarda ham shunday narsa bormi?', ru: 'А в других приложениях такое есть?' }),
    ]}
    correctIdx={INLINE_KEYS.s10}
    explainCorrect={tr({ uz: 'Uzumdagi to\'rt narsaning har biri bitta muammoga javob edi. Animatsiya ham avval shu savoldan o\'tadi.', ru: 'Каждая из четырёх вещей в Uzum отвечала на одну проблему. Анимация тоже сначала проходит через этот вопрос.' })}
    explainWrong={{
      1: tr({ uz: "Qanday yasash keyin o'ylanadi. Avval: bu kimga kerak?", ru: 'Как её сделать, решают потом. Сначала: кому это нужно?' }),
      2: tr({ uz: 'Rang — keyingi savol. Avval: bu qaysi muammoga javob?', ru: 'Цвет — это следующий вопрос. Сначала: на какую проблему это ответ?' }),
      3: tr({ uz: 'Boshqalarda borligi — sabab emas. Bu kimning muammosini hal qiladi?', ru: 'То, что это есть у других, — не причина. Чью проблему это решает?' }),
      default: tr({ uz: 'Avval: bu kimning qaysi muammosini hal qiladi?', ru: 'Сначала: чью и какую проблему это решает?' }),
    }}
  />
);

// ===== 11-EKRAN — TELEFON EMAS — NATIJA: uch karta aylanadi (old — odam nima qildi, orqa — aslida nimaga erishdi) =====
const RESULTS = [
  { ic: '📦', did: { uz: 'Telefon buyurtma qildi', ru: 'Заказал телефон' }, got: { uz: 'Do\'konga bormay, ertaga telefonli bo\'ldi', ru: 'Не идя в магазин, уже завтра получил телефон' } },
  { ic: '✨', did: { uz: 'Eng yangi modelni tanladi', ru: 'Выбрал самую новую модель' }, got: { uz: 'Do\'stlari orasida zamonaviy ko\'rinadi', ru: 'Выглядит современно среди друзей' } },
  { ic: '🎁', did: { uz: 'Onasiga sovg\'a buyurtma qildi', ru: 'Заказал подарок маме' }, got: { uz: 'Onasini xursand qildi', ru: 'Порадовал маму' } },
];
const ScreenResult = ({ screen, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const { opened, seen, toggle } = useOpenSeen();
  const allSeen = seen.size >= RESULTS.length;
  const pend = RESULTS.map((_, i) => String(i)).filter(k => !seen.has(Number(k)));
  const lit = useTurnWalk(pend, !isMentor); // pilot B1 naqshi: proyektorda navbat-yurishi yo'q
  const left = RESULTS.length - seen.size;
  return (
    <Stage eyebrow={tr({ uz: '4-qism · Odam aslida nimani oladi', ru: 'Часть 4 · Что человек получает на самом деле' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!allSeen && !isMentor} turnBusy={!allSeen} label={allSeen || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Yana ${left} ta kartani aylantiring`, ru: `Переверните ещё карточки: ${left}` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Uzumdan telefon olgan odam <span className="italic" style={{ color: T.accent }}>aslida nimani</span> oldi?</>, ru: <>Что <span className="italic" style={{ color: T.accent }}>на самом деле</span> получил человек, купивший телефон в Uzum?</> })}</h2></div>
        {/* MG (F-0924-03): NEGA + bitta chorlov, puls bilan bir halqa. Yakuniy matn — metodist 24.09. */}
        <Mentor>{tr({ uz: <>Odam nima sotib olgani ko'rinib turadi, nima uchun olgani esa ko'rinmaydi — har kartadagi <b style={{ color: T.ink }}>«Aslida-chi?»</b>ni bosing.</>, ru: <>Что человек купил, видно сразу, а зачем купил — не видно, — нажмите <b style={{ color: T.ink }}>«А на самом деле?»</b> на каждой карточке.</> })}</Mentor>
        <div className="rs-grid fade-up delay-1">
          {RESULTS.map((r, i) => {
            const open = opened.has(i);
            return (
              <button key={i} type="button" className={`rs-card ${open ? 'flip' : ''}${turnCls(lit, String(i), pend.length > 1)}`} onClick={() => toggle(i)} aria-pressed={open}>
                <span className="rs-in">
                  <span className="rs-face rs-front"><span className="rs-flip" aria-hidden="true">↻</span><span className="rs-ic" aria-hidden="true">{r.ic}</span><span className="rs-t">{tr(r.did)}</span><span className="rs-cue">{tr({ uz: 'Aslida-chi? ▾', ru: 'А на самом деле? ▾' })}</span></span>
                  <span className="rs-face rs-back"><span className="rs-goal" aria-hidden="true">🎯</span><span className="rs-was">{tr(r.did)}</span><span className="rs-lbl ok">{tr({ uz: 'Aslida nimaga erishdi', ru: 'Чего добился на самом деле' })}</span><span className="rs-t">{tr(r.got)}</span></span>
                </span>
              </button>
            );
          })}
        </div>
        {allSeen && <ScrollIn className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: <>Odam mahsulotning o'zini emas, u beradigan natijani oladi. Odam erishmoqchi bo'lgan natija <b>vazifa</b> deyiladi (Jobs-to-be-Done) — uy vazifasi emas. Mahsulotni odam go'yo shu vazifani bajarish uchun ishga yollaydi.</>, ru: <>Человек получает не сам продукт, а результат, который тот даёт. Результат, которого человек хочет добиться, называется <b>задачей</b> (Jobs-to-be-Done) — это не домашнее задание. Продукт человек как бы нанимает на работу, чтобы выполнить эту задачу.</> })}</p></ScrollIn>}
      </div>
    </Stage>
  );
};

// ===== 12-EKRAN — TEST-4 =====
const ScreenTest4 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 4', ru: 'Проверка · 4' })} scope="module-mikro"
    question={<TestQ lead={tr({ uz: 'Sinfdoshingiz bir oy ichida yugurish poyabzali oldi, telefoniga mashq ilovasini yukladi va sport soati taqdi.', ru: 'За месяц одноклассник купил кроссовки для бега, установил на телефон приложение для тренировок и стал носить спортивные часы.' })} ask={tr({ uz: 'U bularning hammasi bilan aslida nimaga erishmoqchi?', ru: 'Чего он на самом деле хочет добиться всем этим?' })} />}
    questionText={tr({ uz: 'Poyabzal, ilova va soat ortidagi vazifa', ru: 'Задача за кроссовками, приложением и часами' })}
    options={[
      tr({ uz: 'Yangi, yengil va qulay poyabzalga ega bo\'lishga', ru: 'Иметь новые, лёгкие и удобные кроссовки' }),
      tr({ uz: 'Har kuni ertalab stadionda yugurishga', ru: 'Каждое утро бегать на стадионе' }),
      tr({ uz: 'Sog\'lom, baquvvat va chaqqon bo\'lishga', ru: 'Быть здоровым, сильным и ловким' }),
      tr({ uz: 'Qo\'lida sport soati bilan yurishga', ru: 'Ходить со спортивными часами на руке' }),
    ]}
    correctIdx={INLINE_KEYS.s12}
    explainCorrect={tr({ uz: 'Poyabzal, ilova va soat — shu natija uchun olingan mahsulotlar. Vazifa — sog\'lom va baquvvat bo\'lish.', ru: 'Кроссовки, приложение и часы — продукты, купленные ради этого результата. Задача — быть здоровым и сильным.' })}
    explainWrong={{
      0: tr({ uz: 'Poyabzal — mahsulot. U nima uchun olindi?', ru: 'Кроссовки — это продукт. Зачем их купили?' }),
      1: tr({ uz: 'Yugurish — harakat. U yugurib oxirida nimaga erishmoqchi?', ru: 'Бег — это действие. Чего он хочет добиться в итоге, когда бегает?' }),
      3: tr({ uz: 'Soat — mahsulot. Uni taqib nimaga erishmoqchi?', ru: 'Часы — это продукт. Чего он хочет добиться, нося их?' }),
      default: tr({ uz: 'Bu — mahsulot yoki harakat. Oxirida u nimaga erishadi?', ru: 'Это продукт или действие. Чего он добьётся в итоге?' }),
    }}
  />
);

// ===== 13-EKRAN — JUFTINI TOPING: 4 mahsulot → 4 vazifa (ballsiz) =====
const MATCH_PRODS = [
  { t: { uz: 'Velosiped', ru: 'Велосипед' } },
  { t: { uz: 'Budilnik', ru: 'Будильник' } },
  { t: { uz: 'Til o\'rgatuvchi ilova', ru: 'Приложение для изучения языка' } },
  { t: { uz: 'Rangli telefon g\'ilofi', ru: 'Яркий чехол для телефона' } },
];
const MATCH_JOBS = [
  { uz: 'Maktabga tez yetib borish', ru: 'Быстро добраться до школы' },
  { uz: 'Ertalab vaqtida uyg\'onish', ru: 'Вовремя просыпаться утром' },
  { uz: 'Chet tilida erkin gapirish', ru: 'Свободно говорить на иностранном языке' },
  { uz: 'Do\'stlar orasida ajralib turish', ru: 'Выделяться среди друзей' },
];
const MATCH_PROD_ORDER = [2, 0, 3, 1];   // barqaror tartib (StrictMode-safe, Math.random yo'q)
const MATCH_JOB_ORDER = [1, 3, 0, 2];
const ScreenMatch = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [placed, setPlaced] = useState(() => (storedAnswer && storedAnswer.correct ? { 0: 0, 1: 1, 2: 2, 3: 3 } : {}));
  const [sel, setSel] = useState(-1);
  const [shake, setShake] = useState(null);
  const done = MATCH_PRODS.every((_, i) => placed[i] !== undefined);
  const tryTarget = (tg) => {
    if (sel < 0) return;
    if (sel === tg) {
      const next = { ...placed, [sel]: tg };
      setPlaced(next); setSel(-1);
      if (MATCH_PRODS.every((_, i) => next[i] !== undefined) && !(storedAnswer && storedAnswer.correct)) onAnswer(screen, { correct: true, solved: true });
    } else {
      setShake(tg); setTimeout(() => setShake(s => (s === tg ? null : s)), 480);
    }
  };
  const pendProds = MATCH_PROD_ORDER.filter(i => placed[i] === undefined).map(String);
  const lit = useTurnWalk(pendProds, sel < 0 && !done && !isMentor);
  const tgtWave = useTurnHint(sel >= 0 && !isMentor); // mahsulot tanlangach — bo'sh vazifa-qutilar to'lqin bilan (lahzada bittasi)
  const emptyTg = MATCH_JOB_ORDER.filter(tg => !MATCH_PRODS.some((_, i) => placed[i] === tg));
  const left = MATCH_PRODS.length - Object.keys(placed).length;
  return (
    <Stage eyebrow={tr({ uz: '4-qism · Odam aslida nimani oladi', ru: 'Часть 4 · Что человек получает на самом деле' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} turnBusy={!done} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : sel < 0 ? tr({ uz: `Avval mahsulotni tanlang (yana ${left} ta)`, ru: `Сначала выберите продукт (осталось ${left})` }) : tr({ uz: 'Endi uning vazifasini bosing', ru: 'Теперь нажмите его задачу' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har mahsulot <span className="italic" style={{ color: T.accent }}>qaysi vazifaga</span> yollangan?</>, ru: <>На <span className="italic" style={{ color: T.accent }}>какую задачу</span> «нанят» каждый продукт?</> })}</h2></div>
        {/* MG (F-0924-03): NEGA + bitta chorlov, puls bilan bir halqa. Yakuniy matn — metodist 24.09. */}
        <Mentor>{tr({ uz: <>Har mahsulotni odam bitta aniq natija uchun oladi — avval <b style={{ color: T.ink }}>mahsulotni</b> bosing, so'ng uning vazifasini tanlang.</>, ru: <>Каждый продукт человек берёт ради одного конкретного результата, — сначала нажмите на <b style={{ color: T.ink }}>продукт</b>, потом выберите его задачу.</> })}</Mentor>
        {!done && <div className="mt-pool fade-up delay-1">
          {MATCH_PROD_ORDER.filter(i => placed[i] === undefined).map(i => (
            <button key={i} className={`mt-sol ${sel === i ? 'sel' : ''}${turnCls(lit, String(i), pendProds.length > 1)}`} onClick={() => setSel(s => (s === i ? -1 : i))}>{tr(MATCH_PRODS[i].t)}</button>
          ))}
        </div>}
        <div className="mt-targets fade-up delay-2">
          {MATCH_JOB_ORDER.map(tg => {
            const at = MATCH_PRODS.map((_, i) => (placed[i] === tg ? i : null)).filter(x => x !== null);
            return (
              <button key={tg} type="button" className={`mt-tgt ${at.length ? 'filled' : ''} ${shake === tg ? 'shake' : ''} ${sel >= 0 && !at.length ? 'targetable' : ''}${!at.length ? waveCls(tgtWave, emptyTg.indexOf(tg), emptyTg.length) : ''}`} disabled={at.length > 0 || sel < 0} onClick={() => tryTarget(tg)}>
                <span className="mt-tgt-h"><i className="mt-ic" aria-hidden="true" />{tr(MATCH_JOBS[tg])}</span>
                {at.map(i => <span key={i} className="mt-att">{tr(MATCH_PRODS[i].t)}</span>)}
              </button>
            );
          })}
        </div>
        {done && <ScrollIn className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Vazifa — mahsulotning nomi ham, u bilan qilinadigan harakat ham emas. Bu — odam erishadigan natija.', ru: 'Задача — это не название продукта и не действие с ним. Это результат, которого добивается человек.' })}</p></ScrollIn>}
      </div>
    </Stage>
  );
};

// ===== 14-EKRAN — TO'RT SAVOLLI KARTA (ustaxona, bittalab): karta SHU YERDA tug'iladi → bridgeCard =====
// Muammo savolida ikki yozuv joyi (qachon · nimasi og'ir); KIM birinchi savoldan qolipga o'zi qo'shiladi (8-ekran qolipi).
// Tekshiruvlar (senariy): KIM'da «hamma» · YECHIM'da sifat-so'z · VAZIFA'da mahsulot nomi yoki harakat.
// Tekshiruvlar SO'Z darajasida (pm-tekshiruvchi 24.09): kalit-so'z gapning istalgan joyida uchragani uchun emas,
// javob BUTUNLAY shu turga tushganda ushlanadi — mazmunan to'g'ri javob («universitetga kiradi», «ilovasiz ham …»,
// «darajasi yaxshi jamoadosh topib beradi») saqlashni to'smaydi. Shubhali holatda o'tkaziladi.
// So'zlarga bo'lish: tutuq belgisining har xil yozilishi bittaga keltiriladi; kirill — o'zbek kirill harflari bilan.
const cardWords = (s) => (clean(s).toLowerCase().replace(/[\u02bb\u02bc\u2018\u2019\u0060\u00b4]/g, "'")
  .match(/[a-z']+|[\u0430-\u044f\u0451\u045e\u049b\u0493\u04b3]+/g) || []).map(w => w.replace(/^'+|'+$/g, '')).filter(Boolean);
// Kirill o'zaklar ru: maydonida (til-lint); har o'zak so'z BOSHIDAN tekshiriladi.
const ruStem = (o) => new RegExp('^(?:' + o.ru.join('|') + ')');
const RU_NE = '\u043d\u0435', RU_BEZ = '\u0431\u0435\u0437';
// KIM: «hamma/barcha» BUTUN so'z (kelishik qo'shimchasi bilan). «hammom», «hammadan kech keladigan», ruscha «vsegda» — ushlanmaydi.
// O'tkaziladi (pm-tekshiruvchi topilmasi, 25.09): inkor («hamma emas», «hamma ham emas», «hamma uchun emas», ruscha «ne vse», «ne dlya vseh») ·
// «hamma narsa/vaqt/payt», «hamma joyda/yerda» — odam emas · odamlar gap bilan tasvirlangan bo'lsa («futbol o'ynaydigan hamma o'smirlar»,
// «barcha darslarga kechikadigan o'quvchilar», ruscha «dlya vseh, kto …», «vse podrostki, igrayushchie …») — «hamma» faqat urg'u.
// «Xohlagan/istagan hamma», ruscha «vse zhelayushchie» — tasvir emas, «hamma»ning o'zi: ushlanadi.
const HAMMA_UZ = /^(?:hamma|barcha)(?:ga|ni|si|sini|siga|ning|miz|mizga|ngiz|lari)?$/;
const HAMMA_RU = ruStem({ ru: ['все$', 'всех$', 'всем$', 'всеми$'] });
const HAMMA_NARSA_UZ = /^(?:narsa|vaqt|payt)|^(?:joy|yer|yoq|tomon)(?:lar)?(?:da|ga|qa|dan)?$/;
const TASVIR_UZ = /^(?!xohla|ista)[a-z']+(?:gan|kan|qan)(?:lar)?(?:ning|ni|ga|da|dan|dagi)?$/;
const TASVIR_RU = ruStem({ ru: ['кто$', 'кого$', 'кому$', 'кем$', 'котор', '(?!желающ|хотящ).*(?:ющ|ящ|ущ|ащ|вш)(?:ий|ая|ее|ие|их|им|ими|его|ему|ую|ей)$'] });
const RU_PREDLOG = ruStem({ ru: ['(?:для|у|к|от|из|с|со|по|про|о|об|на|в|во)$'] });
const kimHamma = (s) => {
  const w = cardWords(s);
  if (w.some(x => TASVIR_UZ.test(x) || TASVIR_RU.test(x))) return false;
  return w.some((x, i) => {
    if (HAMMA_UZ.test(x)) {
      let j = i + 1;
      while (w[j] === 'ham' || w[j] === 'uchun') j++;
      return w[j] !== 'emas' && !HAMMA_NARSA_UZ.test(w[i + 1] || '');
    }
    return HAMMA_RU.test(x) && w[i - 1] !== RU_NE && !(w[i - 2] === RU_NE && RU_PREDLOG.test(w[i - 1] || ''));
  });
};
// YECHIM: javob FAQAT bahodan iborat bo'lsa ushlanadi — baho-so'z bor va qolgan hamma so'z ham baho, mahsulot nomi yoki
// bog'lovchi. «darajasi yaxshi jamoadosh topib beradi», «qulay vaqtni ko'rsatadi» — sayt nima qilishi aytilgan, o'tadi.
const BAHO_UZ = /^(?:chiroyli|zamonaviy|qulay|yaxshi|zo'?r|ajoyib)(?:roq|dir|gina|lik|ligi)?$/;
const BAHO_RU = ruStem({ ru: ['красив', 'современн', 'удобн', 'хорош', 'классн', 'отличн'] });
const BAHO_QOLGAN_UZ = /^(?:tez|oson|sodda|foydali|tushunarli|qiziqarli|sayt|ilova|sahifa|dizayn|interfeys|ko'rinish|hamma|barcha|odam|foydalanuvchi|narsa)[a-z']*$|^(?:juda|eng|ancha|o'ta|rosa|va|hamda|ham|yana|u|bu|uning|bo'ladi|bo'lgan|bor|ega|ishlaydi|hisoblanadi|uchun|bilan|dir)$/;
const BAHO_QOLGAN_RU = ruStem({ ru: ['быстр', 'прост', 'понятн', 'полезн', 'интересн', 'очень$', 'сам(?:ый|ое|ая|ые|ым|ой)$', 'и$', 'а$', 'с$', 'со$', 'для$', 'тоже$', 'ещ[её]$', 'это$', 'он[оа]?$', 'будет$', 'есть$', 'работает$', 'выглядит$', 'является$', 'сайт', 'приложени', 'страниц', 'дизайн', 'интерфейс', 'вид$', 'вс[её]х?$', 'всем$', 'люд', 'пользовател', 'вещ'] });
const isBaho = (x) => BAHO_UZ.test(x) || BAHO_RU.test(x);
const qiladiBaho = (s) => {
  const w = cardWords(s);
  return w.some(isBaho) && w.every(x => isBaho(x) || BAHO_QOLGAN_UZ.test(x) || BAHO_QOLGAN_RU.test(x));
};
// VAZIFA: mahsulot (sayt, ilova, tugma…) yoki u bilan qilinadigan harakat yozilgan-u, NATIJA qolmagan bo'lsa ushlanadi.
// Natija (pm-tekshiruvchi topilmasi, 25.09) — ikki xil: (1) mahsulotdan boshqa fe'l: «do'stlari bilan o'ynaydi», «uyg'onishga», ruscha «prosypat'sya»,
// «nayti», «nauchilsya»; (2) mahsulot faqat VOSITA («sayt orqali», «ilova yordamida», ruscha «cherez», «s pomoshch'yu», «blagodarya»),
// yonida boshqa so'z bor: «ilova yordamida yaxshi baholarga», ruscha «khoroshie otsenki blagodarya prilozheniyu».
// «kiradi/ochadi/foydalanadi» faqat mahsulotning O'ZI bilan harakat: «sayt orqali universitetga kiradi», «ilova yordamida biznes ochadi»,
// ruscha «cherez sayt otkryvaet svoy biznes» — natija. «-siz» shakli («ilovasiz ham …») va ruscha «bez …» — mahsulot emas.
// Bu qoidalar faqat YUMSHATADI: avvalgi tekshiruv o'tkazgan birorta javob endi ushlanmaydi (25.09: 120 000 tasodifiy kiritish va
// 19 331 ta «mahsulot + harakat» qolipi bilan sinalgan — avval ushlangan kanonik xatolarning birortasi ham bo'shab qolmagan).
const MAHSULOT_UZ = /^(?:sayt|ilova|sahifa|tugma|knopka)(?![a-z']*siz)[a-z']*$|^(?:uni|unga|undan)$/;
const MAHSULOT_RU = ruStem({ ru: ['сайт', 'приложени', 'страниц', 'кнопк', 'него$', 'нему$', 'н[её]м$', 'ним$'] });
const QATTIQ_UZ = /^(?:yukla|bos)(?:ydi|di|b|sh|adi|ib|ish|moqda|yapti)$/;
// Harakat nomi + kelishik va -moq («bosishga», «yuklamoq») — mahsulot yonida baribir harakat (yolg'iz o'zi avvalgidek o'tadi).
const QATTIQ_UZ_NOM = /^(?:yukla|bos)(?:moq|ishga|ishni|shga|shni)$/;
const QATTIQ_RU = ruStem({ ru: ['нажима', 'нажм', 'нажал', 'скачива', 'скача', 'скачал', 'заказыва', 'закаж', 'заказал', 'загружа', 'загруз'] });
const YUMSHOQ_UZ = /^(?:kir|och|foydalan)(?:adi|maydi|ib|ish|ishga|ishni|ishda|ishdan|di|sa|ganda|moq|moqda|yapti)$/;
const YUMSHOQ_RU = ruStem({ ru: ['открыва', 'откро', 'открыл', 'заход', 'зайд', 'зайт', 'заш[её]л', 'зашл', 'пользу[ею]', 'пользова', 'воспольз', 'вход', 'войд', 'войт', 'вош'] });
// Ro'yxatdan o'tish mahsulot vosita bo'lsa ham harakat: «cherez sayt zaregistrirovalsya».
const ROYXAT_RU = ruStem({ ru: ['регистрир', 'зарегистр', '(?:под|за)писал(?:ся|ась|ись)$', '(?:под|за)писаться$', 'залогинил(?:ся|ась|ись)$', 'залогиниться$'] });
// Mahsulotning qismlari — boshqa to'ldiruvchi sanalmaydi: «saytda profilini ochadi», ruscha «zakhodit v lichnyy kabinet».
const MAHSULOT_JOY_UZ = /^(?:profil|akkaunt|hisob|menyu|bo'lim|chat|havola|parol|login|kabinet)/;
const MAHSULOT_JOY_RU = ruStem({ ru: ['аккаунт', 'профил', 'кабинет', 'личн', 'меню', 'раздел', 'вкладк', 'ссылк', 'чат'] });
// Natija-fe'l belgisi: o'zbekcha kesim, sifatdosh, harakat nomi (+ kelishik: «o'ynashga», «uyg'onishni»), -moq, -maslik;
// ruscha fe'l oxiri, «-t'sya», «-ti», «-ch'», o'tgan zamon («nashyol», «nashla», «smog», «nauchilsya») — keng: shubhada o'tkazadi.
const FEL_UZ = /(?:di|moqda|moqchi|yapti|gan|ish|ash|moq)$|sh(?:ga|ni|da|dan)$|maslik(?:ka|ni|ga|dan)?$/;
const FEL_RU = ruStem({ ru: ['.*(?:ет|ёт|ит|ют|ут|ат|ят|ть|тся|ться|тись|[йсзд]ти|чь|ёл|мог|[аяие]л|[аяие]л[аои]|[шгзск]л[аио]|л(?:ся|ась|ось|ись))$'] });
// Mahsulot vosita: undan keyin «orqali/yordamida/tufayli/bilan…»; ruscha oldida «cherez/pomoshch'yu/blagodarya…» yoki «s» + qurol
// kelishigi («s prilozheniem»). Oraliqda bitta ko'rsatish yoki baho so'zi bo'lishi mumkin («cherez nashe prilozhenie»).
const VOSITA_UZ = /^(?:orqali|yordamida|yordami|yordamidan|tufayli|vositasida|sababli|bilan)$/;
const VOSITA_RU = ruStem({ ru: ['(?:через|помощью|помощи|благодаря|посредством|используя)$'] });
const RU_S = ruStem({ ru: ['(?:с|со)$'] });
const RU_QUROL = ruStem({ ru: ['.*(?:ом|ем|ём|ей|ой|им|ым|ами|ями)$'] });
const RU_ANIQ = ruStem({ ru: ['(?:наш|наше|нашего|нашему|нашим|наша|нашей|нашу|этот|это|этого|этому|этим|эту|этой|мой|моё|мое|моего|моему|моим|свой|своё|свое|своего|своему|своим|новый|новое|нового|новому|новым)$'] });
const vositami = (w, i) => {
  if (VOSITA_UZ.test(w[i + 1] || '') || (/dagi$/.test(w[i]) && VOSITA_UZ.test(w[i + 2] || ''))) return true;
  const k = RU_ANIQ.test(w[i - 1] || '') || BAHO_RU.test(w[i - 1] || '') ? i - 2 : i - 1;
  return VOSITA_RU.test(w[k] || '') || (RU_S.test(w[k] || '') && RU_QUROL.test(w[i]));
};
// Ruscha yumshoq fe'ldan keyingi birinchi mazmunli so'z mahsulot bo'lmasa («otkryvaet svoy biznes», «vkhodit v sbornuyu») — natija.
const RU_OTKIN = ruStem({ ru: ['(?:в|во|на|по|к|ко|с|со|из|от|у|для|за|о|об|при|мой|моя|моё|мои|мою|свой|своя|своё|свои|свою|своего|этот|эта|это|эти|эту|его|её|их|наш|ваш|каждый|каждое|каждую|каждая|день|утром|вечером|днём|ночью|часто|всегда|иногда|снова|опять|ещё|тоже|только|уже|сразу|регулярно|ежедневно|постоянно|быстро)$'] });
// Sifat va qurilma o'tkazib yuboriladi («pol'zuetsya khoroshim prilozheniem», «otkryvaet s telefona»); «-nie/-tie» — ot, sifat emas.
const RU_SIFAT = ruStem({ ru: ['(?!.*[нт]ие$).*(?:ый|ий|ой|ая|яя|ое|ее|ые|ие|ым|им|ую|юю|ого|его|ому|ему|ыми|ими|ых|их)$', 'телефон', 'смартфон', 'компьютер', 'ноутбук', 'планшет', 'интернет', 'дома$'] });
const ruBoshqa = (w, i, mah) => {
  for (let j = i + 1; j < w.length; j++) {
    if (mah[j] || MAHSULOT_JOY_RU.test(w[j])) return false;
    if (!RU_OTKIN.test(w[j]) && !RU_SIFAT.test(w[j])) return true;
  }
  return false;
};
// Faqat mahsulot tilga olingan javobda natija-so'z SANALMAYDI: vosita, ko'rsatish, bog'lovchi, vaqt, qurilma, baho, mahsulot qismlari.
const TOLD_UZ = /^(?:orqali|yordamida|yordami|yordamidan|tufayli|vositasida|sababli|bilan|uchun|kabi|bu|shu|u|o'sha|o'z|o'zi|o'zining|uning|va|ham|yoki|hamda|faqat|yana|har|kuni|doim|doimo|juda|eng|ancha|bitta|bir|yangi|onlayn)$|^(?:telefon|kompyuter|noutbuk|planshet|internet|buyurtma|ro'yxat|profil|akkaunt|parol|login|menyu|havola)/;
const TOLD_RU = ruStem({ ru: ['(?:через|помощью|помощи|благодаря|посредством|используя|с|со|в|во|на|по|для|и|а|или|тоже|только|очень|это|этот|эта|эти|мой|моё|моя|свой|своё|своя|наш|наше|каждый|каждое|день|новый|новое|новая|новые|онлайн)$', 'телефон', 'смартфон', 'компьютер', 'ноутбук', 'планшет', 'интернет', 'заказ', 'аккаунт', 'профил', 'меню', 'ссылк', 'регистрац', 'парол', 'логин'] });
const told = (x) => isBaho(x) || BAHO_QOLGAN_UZ.test(x) || BAHO_QOLGAN_RU.test(x) || TOLD_UZ.test(x) || TOLD_RU.test(x);
const erishadiHarakat = (s) => {
  const w = cardWords(s);
  const mah = w.map((x, i) => (MAHSULOT_UZ.test(x) || MAHSULOT_RU.test(x)) && w[i - 1] !== RU_BEZ);
  // Ikki so'zli harakatlar: «buyurtma qiladi/beradi», «yuklab oladi», «ro'yxatdan o'tadi».
  const qat = w.map((x, i) => QATTIQ_UZ.test(x) || QATTIQ_RU.test(x)
    || (x === 'buyurtma' && /^(?:qil|ber)/.test(w[i + 1] || '')) || (/^(?:qil|ber)/.test(x) && w[i - 1] === 'buyurtma')
    || (/^ol/.test(x) && w[i - 1] === 'yuklab'));
  if (!mah.some(Boolean) && !qat.some(Boolean)) return false;
  // Mahsulotning o'zi (vosita emas) tilga olinganmi: «saytga kiradi» — ha; «sayt orqali universitetga kiradi» — yo'q (faqat vosita).
  // Mahsulot so'zi umuman yo'q javobda («yuklab oladi va ochadi») yumshoq fe'l avvalgidek harakat.
  const ozi = mah.some((m, i) => m && !vositami(w, i));
  const faqatVosita = mah.some(Boolean) && !ozi;
  // O'zbekcha boshqa to'ldiruvchi bor bo'lsa («universitetga», «biznesini») «kiradi/ochadi» — natija.
  const boshqaUz = w.some((x, i) => !mah[i] && !YUMSHOQ_UZ.test(x) && !QATTIQ_UZ.test(x) && !/sh(?:ga|ni)$/.test(x)
    && /^[a-z']{3,}(?:ga|ka|qa|ni|ini|sini)$/.test(x) && !/^(?:kuni|har|vaqtida|ertalab|kechqurun)$/.test(x) && !MAHSULOT_JOY_UZ.test(x));
  const yum = w.map((x, i) => (!faqatVosita && YUMSHOQ_UZ.test(x) && !boshqaUz)
    || (!faqatVosita && YUMSHOQ_RU.test(x) && !ruBoshqa(w, i, mah))
    || (ROYXAT_RU.test(x) && !ruBoshqa(w, i, mah))
    || (x === "ro'yxatdan" && /^o't/.test(w[i + 1] || '')) || (/^o't/.test(x) && w[i - 1] === "ro'yxatdan"));
  const har = w.map((x, i) => qat[i] || yum[i] || QATTIQ_UZ_NOM.test(x));
  const rest = w.filter((x, i) => !mah[i] && !har[i]);
  if (rest.some(x => FEL_UZ.test(x) || FEL_RU.test(x))) return false;
  if (har.some(Boolean)) return true;
  // Faqat mahsulot: o'zi tilga olingan («mashq ilovasi», «qulay sayt») — ushlanadi; vosita bo'lib, yonida natija-so'z bo'lsa — o'tadi.
  return ozi || rest.every(told);
};
const CARD_PH = {
  kim: { uz: 'hovlida futbol o\'ynaydigan o\'smirlar', ru: 'подростки, играющие в футбол во дворе' },
  qachon: { uz: 'kechqurun, maktabdan keyin', ru: 'вечером, после школы' },
  ogir: { uz: "maydonga borsa, u yerda boshqalar o'ynayotgan bo'ladi", ru: 'приходят на поле, а там уже играют другие' },
  qiladi: { uz: 'bo\'sh vaqtni ko\'rsatib, band qilib beradi', ru: 'показывает свободное время и бронирует его' },
  erishadi: { uz: 'do\'stlari bilan kutmasdan o\'ynaydi', ru: 'играют с друзьями без ожидания' },
};
// F-0925-QA18: 14-ekranda savol maydon ichida (xira yozuv), tepasidagi yorliq olindi. Savol + qisqa namuna; o'lchov: UZ/RU sig'adi.
const CARD_PH_Q = {
  kim: { uz: "① Sayt kim uchun? (masalan: futbol o'ynaydigan o'smirlar)", ru: '① Для кого сайт? (например: подростки во дворе)' },
  qachon: { uz: '② Qachon?', ru: '② Когда?' },
  ogir: { uz: "Nimasi og'ir?", ru: 'Что тяжело?' },
  qiladi: { uz: "③ Sayt nima qiladi? (masalan: bo'sh vaqtni band qiladi)", ru: '③ Что делает сайт? (например: бронирует время)' },
  erishadi: { uz: "④ Odam nimaga erishadi? (masalan: kutmay o'ynaydi)", ru: '④ Чего добивается человек? (например: не ждёт)' },
};
const CARD_Q = [
  { k: 'kim', q: { uz: 'Sayt kim uchun?', ru: 'Для кого сайт?' } },
  { k: 'muammo', q: { uz: 'Odam qanday muammoga duch keladi?', ru: 'С какой проблемой сталкивается человек?' } },
  { k: 'qiladi', q: { uz: 'Sayt nima qiladi?', ru: 'Что делает сайт?' } },
  { k: 'erishadi', q: { uz: 'Odam oxirida nimaga erishadi?', ru: 'Чего человек добивается в итоге?' } },
];
// 58-qonun (QA 25.09): o'quvchi har maydonga 120 belgigacha yozadi — matn qisqarmaydi va cheklanmaydi, karta VIZUAL zichlashadi.
// Kompyuterda o'ng ustun ekrandagi bo'sh joyni oladi (CSS: contain: size); karta shu joyga sig'maguncha zichlik bittadan
// oshadi: data-fit 0 → 1 (o'ng ustun kengayadi, 900px dan) → 2 (14px) → 3 (13px, ixcham oraliq). Har render va joy o'zgarganda
// (oyna o'lchami, shrift yuklanishi, «👥 Sinfda» chipi paydo bo'lishi) 0 dan qayta o'lchanadi — javob qisqarsa karta yana
// kattalashadi. Telefonda karta siqilmaydi (contain yo'q) — daraja 0 qoladi. Faqat ko'rinish: holat, ball, saqlashga tegmaydi.
const CQ_FIT_MAX = 3;
function useCardFit() {
  const ref = useRef(null);
  const fit = useCallback(() => {
    const s = ref.current;
    if (!s) return;
    const card = s.querySelector('.cq-card');
    // Tayyor g'oyalar ro'yxati ochiq (karta yo'q) — daraja o'zgarmaydi: chap ustun kengligi ro'yxat ochilib-yopilganda sakramaydi.
    if (!card) return;
    let d = 0;
    s.setAttribute('data-fit', '0');
    // Qat'iy taqqoslash: sig'gan karta o'z mazmuniga qisqaradi (scrollHeight = clientHeight); 1px ortiqcha ham kartada aylantirish chizig'ini chiqaradi.
    while (d < CQ_FIT_MAX && card.scrollHeight > card.clientHeight) { d += 1; s.setAttribute('data-fit', String(d)); }
  }, []);
  useLayoutEffect(fit);
  useEffect(() => {
    const s = ref.current;
    const col = s && s.lastElementChild;
    if (!col) return undefined;
    // Kuzatuvchi faqat keyingi kadrda o'lchaydi: o'lchov o'sha kuzatuv ichida ustun hajmini o'zgartirmaydi (brauzer ogohlantirishisiz).
    let raf = 0;
    const later = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(later) : null;
    const mo = typeof MutationObserver !== 'undefined' ? new MutationObserver(later) : null;
    if (ro) ro.observe(col);
    if (mo) mo.observe(col, { childList: true, subtree: true, characterData: true });
    // Shrift kech kelsa (14-ekranda sahifa yangilanib, karta uzun javob bilan darhol chizilganda) matn qayta joylashadi, lekin
    // ustun o'lchami ham, DOM ham o'zgarmaydi — shuning uchun har shrift yuklanib bo'lganda qayta o'lchanadi.
    const fonts = typeof document !== 'undefined' ? document.fonts : null;
    if (fonts && fonts.ready) fonts.ready.then(later).catch(() => {});
    if (fonts && fonts.addEventListener) fonts.addEventListener('loadingdone', later);
    return () => { cancelAnimationFrame(raf); if (ro) ro.disconnect(); if (mo) mo.disconnect(); if (fonts && fonts.removeEventListener) fonts.removeEventListener('loadingdone', later); };
  }, [fit]);
  return ref;
}
const cardHints = (v) => ({
  kim: kimHamma(v.kim) ? tr({ uz: '«Hamma» — bu hali auditoriya emas. Kim, qaysi vaziyatda?', ru: '«Все» — это ещё не аудитория. Кто, в какой ситуации?' }) : null,
  qiladi: qiladiBaho(v.qiladi) ? tr({ uz: "Bu — maqtov so'zi. Sayt aynan nima qiladi?", ru: 'Это слова похвалы. Что именно делает сайт?' }) : null,
  erishadi: erishadiHarakat(v.erishadi) ? tr({ uz: 'Bu — mahsulot yoki harakat. Odam oxirida nimaga erishadi?', ru: 'Это продукт или действие. Чего человек добивается в итоге?' }) : null,
});
const ScreenCard = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useIsMentor();
  const [init] = useState(() => cardSafe());
  const pick0 = (k) => init[k] || '';
  const [v, setV] = useState(() => ({ kim: pick0('kim'), qachon: pick0('qachon'), ogir: pick0('ogir'), qiladi: pick0('qiladi'), erishadi: pick0('erishadi') }));
  const [ideaId, setIdeaId] = useState(() => init.ideaId || null);
  const [ideas, setIdeas] = useState(false);
  const full0 = ['kim', 'qachon', 'ogir', 'qiladi', 'erishadi'].every(k => filled(init[k]));
  const [savedSnap, setSavedSnap] = useState(() => (full0 ? JSON.stringify({ kim: pick0('kim'), qachon: pick0('qachon'), ogir: pick0('ogir'), qiladi: pick0('qiladi'), erishadi: pick0('erishadi') }) : null));
  const signal = usePracticeSignal(screen, storedAnswer, onAnswer, live);
  const hints = cardHints(v);
  const ok = { kim: filled(v.kim) && !hints.kim, muammo: filled(v.qachon) && filled(v.ogir), qiladi: filled(v.qiladi) && !hints.qiladi, erishadi: filled(v.erishadi) && !hints.erishadi };
  const allOk = ok.kim && ok.muammo && ok.qiladi && ok.erishadi;
  const dirty = savedSnap !== JSON.stringify(v);
  const saved = !!savedSnap && !dirty;
  const everSaved = !!savedSnap || !!(storedAnswer && storedAnswer.solved);
  // Bittalab: keyingi savol oldingisi to'g'ri to'lganda (yoki unda allaqachon yozuv bo'lsa) ochiladi.
  const show = { kim: true, muammo: ok.kim || filled(v.qachon) || filled(v.ogir) };
  show.qiladi = (show.muammo && ok.muammo) || filled(v.qiladi);
  show.erishadi = (show.qiladi && ok.qiladi) || filled(v.erishadi);
  const set = (k, val) => setV(p => ({ ...p, [k]: val }));
  const pickIdea = (it) => { setV({ kim: tr(it.kim), qachon: tr(it.qachon), ogir: tr(it.ogir), qiladi: tr(it.qiladi), erishadi: tr(it.erishadi) }); setIdeaId(it.id); setIdeas(false); };
  const save = () => {
    if (!allOk) return;
    const patch = { kim: clean(v.kim), qachon: clean(v.qachon), ogir: clean(v.ogir), qiladi: clean(v.qiladi), erishadi: clean(v.erishadi) };
    // Tayyor g'oya belgisi faqat KIM o'sha g'oyaniki bo'lib qolsa saqlanadi (keyingi darslar shu g'oyaning qo'shimcha ustunlarini oladi).
    const idea = ideaId ? READY_IDEAS.find(x => x.id === ideaId) : null;
    patch.ideaId = idea && (clean(v.kim) === clean(idea.kim.uz) || clean(v.kim) === clean(idea.kim.ru)) ? idea.id : undefined;
    cardWrite(patch);
    setSavedSnap(JSON.stringify(v));
    signal({ practice: 'idea-card', card: patch });
  };
  const [focus, setFocus] = useState(false);
  const pend = ['kim', 'qachon', 'ogir', 'qiladi', 'erishadi'].filter(k => !filled(v[k]) && (k === 'kim' || ((k === 'qachon' || k === 'ogir') && show.muammo) || (k === 'qiladi' && show.qiladi) || (k === 'erishadi' && show.erishadi)));
  const litF = useTurnWalk(pend, !focus && !isMentor);
  const saveTurn = useTurnHint(allOk && dirty && !isMentor);
  const navLabel = isMentor || (everSaved && !dirty) ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : !ok.kim ? (hints.kim ? tr({ uz: '① «Sayt kim uchun?» javobini aniqlashtiring', ru: '① Уточните ответ «Для кого сайт?»' }) : tr({ uz: '① «Sayt kim uchun?» savoliga javob yozing', ru: '① Ответьте на вопрос «Для кого сайт?»' }))
    : !filled(v.qachon) ? tr({ uz: '② «Qachon?» savoliga javob yozing', ru: '② Ответьте на вопрос «Когда?»' })
    : !filled(v.ogir) ? tr({ uz: "② «Nimasi og'ir?» savoliga javob yozing", ru: '② Ответьте на вопрос «Что тяжело?»' })
    : !ok.qiladi ? (hints.qiladi ? tr({ uz: '③ Sayt aynan nima qilishini yozing', ru: '③ Напишите, что именно делает сайт' }) : tr({ uz: '③ «Sayt nima qiladi?» savoliga javob yozing', ru: '③ Ответьте на вопрос «Что делает сайт?»' }))
    : !ok.erishadi ? (hints.erishadi ? tr({ uz: '④ Odam erishadigan natijani yozing', ru: '④ Напишите результат, которого добивается человек' }) : tr({ uz: '④ Oxirgi savolga javob yozing', ru: '④ Ответьте на последний вопрос' }))
    : tr({ uz: '✓ «Saqlash»ni bosing', ru: '✓ Нажмите «Сохранить»' });
  const inp = (k, ph) => (
    <label key={k} className={`pw-f ${filled(v[k]) && !hints[k] ? 'on' : ''}${turnCls(litF, k, pend.length > 1)}`}>
      <input value={v[k]} onChange={e => set(k, e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={tr(CARD_PH_Q[k])} aria-label={ph.aria} maxLength={120} />
    </label>
  );
  const problem = gapOf(v.qachon, v.kim, v.ogir);
  const rows = [
    { k: 'kim', val: capFirst(clean(v.kim)) },
    { k: 'muammo', val: filled(v.qachon) || filled(v.ogir) ? problem : '' },
    { k: 'qiladi', val: capFirst(clean(v.qiladi)) },
    { k: 'erishadi', val: capFirst(clean(v.erishadi)) },
  ];
  const splitRef = useCardFit();
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · o\'z g\'oyangiz ✍️', ru: 'Практика · ваша идея ✍️' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Kartasini saqlaganlar', ru: '✍️ Кто сохранил карточку' })} /><MentorNote>{tr(MENTOR_WATCH)}</MentorNote></div><NavNext optionalLive turnBusy={!saved && !isMentor} disabled={!(everSaved && !dirty) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      {/* 58-qonun (QA 2026-09-24): .dense — jonli o'quvchida «👥 Sinfda» chipi bilan to'liq karta 1280x800 ga sig'adi;
          mentor qo'shimchalari pastki qatordagi dokda (3/4-o'tish 2-darsi naqshi) — ekran balandligi o'quvchinikidek qoladi. */}
      <div className="screen dense cq-screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>G'oyangiz haqida <span className="italic" style={{ color: T.accent }}>to'rt savolga</span> javob bera olasizmi?</>, ru: <>Сможете ответить на <span className="italic" style={{ color: T.accent }}>четыре вопроса</span> о своей идее?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Aniq odam topilsa, uning muammosi ham ko'rinadi — <b style={{ color: T.ink }}>«Sayt kim uchun?»</b> savoliga javob yozing yoki <b style={{ color: T.ink }}>«Tayyor g'oyadan tanlash»</b>ni bosing.</>, ru: <>Когда понятен конкретный человек, видна и его проблема, — ответьте на вопрос <b style={{ color: T.ink }}>«Для кого сайт?»</b> или нажмите <b style={{ color: T.ink }}>«Выбрать готовую идею»</b>.</> })}</Mentor>
        <div className="split cq-split" ref={splitRef}>
          <Col>
            <div className="cq-step">{inp('kim', { aria: tr(CARD_Q[0].q) })}{hints.kim && <p className="sl-hint fade-step">💡 {hints.kim}</p>}</div>
            {show.muammo && <div className="cq-step fade-step"><div className="cq-two">{inp('qachon', { aria: tr({ uz: 'Qachon?', ru: 'Когда?' }) })}{inp('ogir', { aria: tr({ uz: 'Nimasi og\'ir?', ru: 'Что тяжело?' }) })}</div></div>}
            {show.qiladi && <div className="cq-step fade-step">{inp('qiladi', { aria: tr(CARD_Q[2].q) })}{hints.qiladi && <p className="sl-hint fade-step">💡 {hints.qiladi}</p>}</div>}
            {show.erishadi && <div className="cq-step fade-step">{inp('erishadi', { aria: tr(CARD_Q[3].q) })}{hints.erishadi && <p className="sl-hint fade-step">💡 {hints.erishadi}</p>}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button type="button" className="btn-soft" onClick={() => setIdeas(o => !o)} aria-expanded={ideas}>💡 {tr({ uz: 'Tayyor g\'oyadan tanlash', ru: 'Выбрать готовую идею' })} {ideas ? '▴' : '▾'}</button>
              <button type="button" className={`pw-save${saveTurn ? ' turn-ring' : ''}`} disabled={!allOk || !dirty} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
            </div>
          </Col>
          <Col>
            {/* Tayyor g'oyalar ro'yxati o'ng ustunda, karta o'rnida ochiladi (tanlangach karta qaytadi): chap ustun to'rt savol bilan
                to'lganda ro'yxat pastga tushib, 1280×800 da ekrandan chiqib ketardi (QA, 58-qonun). */}
            {ideas ? (
              <div className="ideas fade-step">
                {READY_IDEAS.map(it => (
                  <button key={it.id} type="button" className={`idea ${ideaId === it.id ? 'on' : ''}`} onClick={() => pickIdea(it)}>
                    <b>{tr(it.olam)}</b><span>{tr(it.kim)}</span>
                  </button>
                ))}
              </div>
            ) : (
            <div className={`cq-card${saved ? ' saved' : ''}`}>
              {/* «✓ Karta saqlandi» karta sarlavhasi qatorida — alohida qator RU 1280×800 da ekranni 8px skrollga chiqarardi (QA) */}
              <div className="cq-h"><span className="ic-h">🗂 {tr({ uz: 'Kartangiz', ru: 'Ваша карточка' })}</span>{saved && <span className="done-mini fade-step">✓ {tr({ uz: 'Karta saqlandi', ru: 'Карточка сохранена' })}</span>}</div>
              {rows.map((r, i) => (
                <div key={r.k} className={`cq-row ${r.k} ${r.val ? 'on' : ''}`}>
                  <span className="cq-lbl">{tr(CARD_Q[i].q)}</span>
                  <span className="cq-val">{r.val || <span className="gb-ph">…</span>}</span>
                </div>
              ))}
            </div>
            )}
            {saved && ideas && <span className="done-mini fade-step">✓ {tr({ uz: 'Karta saqlandi', ru: 'Карточка сохранена' })}</span>}
            <StudentPracticePulse live={live} screen={screen} />
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== 15-EKRAN — SHERIK-TEKSHIRUV: uch tayyor kartada bitta qator chala — sababni umumiy uch variantdan tanlash =====
const CHECK_CARDS = [
  { row: { uz: 'Odam qanday muammoga duch keladi?', ru: 'С какой проблемой сталкивается человек?' }, cls: 'ogir', t: { uz: 'Odamlar ko\'p ovqat buyurtma qiladi', ru: 'Люди часто заказывают еду' }, ans: 0 },
  { row: { uz: 'Sayt nima qiladi?', ru: 'Что делает сайт?' }, cls: 'qiladi', t: { uz: 'Zamonaviy va qulay ilova', ru: 'Современное и удобное приложение' }, ans: 1 },
  { row: { uz: 'Odam oxirida nimaga erishadi?', ru: 'Чего человек добивается в итоге?' }, cls: 'erishadi', t: { uz: 'Ilovani ochadi', ru: 'Открывает приложение' }, ans: 2 },
];
const CHECK_REASONS = [
  { uz: 'Nimasi og\'irligi aytilmagan', ru: 'Не сказано, что тяжело' },
  { uz: 'Sayt nima qilishi aytilmagan', ru: 'Не сказано, что делает сайт' },
  { uz: 'Natija emas, harakat yozilgan', ru: 'Записан не результат, а действие' },
];
const CHECK_ORDER = [1, 2, 0]; // sabablar ko'rinish tartibi — barqaror aralash
const ScreenCheck = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [pk, setPk] = useState(() => (storedAnswer && storedAnswer.correct ? CHECK_CARDS.map(c => c.ans) : CHECK_CARDS.map(() => null)));
  const [bad, setBad] = useState(() => CHECK_CARDS.map(() => null));
  const done = CHECK_CARDS.every((c, i) => pk[i] === c.ans);
  const pick = (ci, ri) => {
    if (pk[ci] === CHECK_CARDS[ci].ans) return;
    if (ri === CHECK_CARDS[ci].ans) {
      const next = pk.map((x, k) => (k === ci ? ri : x));
      setPk(next); setBad(b => b.map((x, k) => (k === ci ? null : x)));
      if (CHECK_CARDS.every((c, i) => next[i] === c.ans) && !(storedAnswer && storedAnswer.correct)) onAnswer(screen, { correct: true, solved: true });
    } else setBad(b => b.map((x, k) => (k === ci ? ri : x)));
  };
  const pendCards = CHECK_CARDS.map((c, i) => String(i)).filter(k => pk[Number(k)] !== CHECK_CARDS[Number(k)].ans);
  const lit = useTurnWalk(pendCards, !isMentor);
  const okN = CHECK_CARDS.filter((c, i) => pk[i] === c.ans).length;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · tekshiruv', ru: 'Практика · проверка' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} turnBusy={!done} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Har kartaga sababini tanlang (${okN}/3)`, ru: `Выберите причину для каждой карточки (${okN}/3)` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har kartada bitta qator chala. <span className="italic" style={{ color: T.accent }}>Nimasi</span> yetishmaydi?</>, ru: <>В каждой карточке одна строка неполная. <span className="italic" style={{ color: T.accent }}>Чего</span> не хватает?</> })}</h2></div>
        {/* MG (F-0924-03): NEGA + bitta chorlov, puls bilan bir halqa. Yakuniy matn — metodist 24.09. */}
        <Mentor>{tr({ uz: <>Bitta chala qator butun kartani tushunarsiz qiladi — har kartaga <b style={{ color: T.ink }}>uch sababdan</b> mosini tanlang.</>, ru: <>Одна неполная строка делает непонятной всю карточку, — для каждой карточки выберите подходящую из <b style={{ color: T.ink }}>трёх причин</b>.</> })}</Mentor>
        <div className="ck-grid fade-up delay-1">
          {CHECK_CARDS.map((c, ci) => {
            const ok = pk[ci] === c.ans;
            return (
              <div key={ci} className={`ck-card ${ok ? 'ok' : ''}${turnCls(lit, String(ci), pendCards.length > 1)}`}>
                <span className={`ic-lbl ${c.cls}`}>{tr(c.row)}</span>
                <p className="ck-t">«{tr(c.t)}»</p>
                <div className="ck-opts">
                  {CHECK_ORDER.filter(ri => !ok || ri === c.ans).map(ri => (
                    <button key={ri} type="button" className={`gb-opt ${ok && ri === c.ans ? 'ok' : bad[ci] === ri ? 'bad' : ''}`} disabled={ok} onClick={() => pick(ci, ri)}>{tr(CHECK_REASONS[ri])}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {done && <ScrollIn className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: 'Har qatorning o\'z savoli bor: muammoda — nimasi og\'ir, yechimda — sayt nima qiladi, vazifada — odam nimaga erishadi.', ru: 'У каждой строки свой вопрос: в проблеме — что тяжело, в решении — что делает сайт, в задаче — чего добивается человек.' })}</p></ScrollIn>}
      </div>
    </Stage>
  );
};

// ===== 16-EKRAN — AI — FOYDALANUVCHI ROLIDA (maqsad-gap · so'rov yig'mada · «Gemini ochilmasa» — sherik javob beradi) =====
const copyText = async (txt) => {
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(txt); return true; } } catch { /* pastdagi yo'l */ }
  try { const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); document.body.removeChild(ta); return ok; } catch { return false; }
};
// ===== AI QADAMI (F-0924-01/02) — B3 dan AYNAN (pilot B1 naqshi): so'rov DOIM ochiq · ① nusxalash → ② Gemini → ③ javobni yozish.
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
  // Zanjir KETMA-KET (① → ②): yurish emas, birinchi bajarilmagan halqa tinch yonadi (pilot B1 naqshi, 88-qonun).
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
          <span className="ais-d">{tr({ uz: "So'rovni qo'ying va yuboring", ru: 'Вставьте запрос и отправьте' })}</span>
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
// Tayyor g'oyalardagi birlik KIM'ning ko'plik shakli (AI so'rovi qolipi uchun; B3 IDEA_MANY bilan bir xil matn).
const KIM_MANY = {
  sinf: { uz: 'sinf sardorlari', ru: 'старосты классов' },
  kiyim: { uz: "internetdan kiyim oladigan o'smirlar", ru: 'подростки, покупающие одежду онлайн' },
};
const AI_QS = [
  { uz: 'Bu sizda oxirgi marta qachon bo\'lgan?', ru: 'Когда это было с вами в последний раз?' },
  { uz: 'O\'shanda aslida nimaga erishmoqchi edingiz?', ru: 'Чего вы тогда на самом деле хотели добиться?' },
];
const ScreenAI = ({ screen, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [card] = useState(() => cardSafe());
  // Karta bo'lmasa — 14-ekran namunasi (40-qonun: namuna-fallback). KIM — guruh (auditoriya), AI esa shu guruhdagi
  // BITTA odam: qolip «Siz shu guruhdagi bitta odamsiz: {KIM}». Tayyor g'oyada KIM birlikda bo'lsa, ko'plik shakli
  // olinadi (B3 IDEA_MANY naqshi) — «Siz shu guruhdagi bitta odamsiz: sinf sardori» chiqmasin.
  const idea = card.ideaId ? READY_IDEAS.find(x => x.id === card.ideaId) : null;
  const kim0 = filled(card.kim) ? clean(card.kim) : tr(CARD_PH.kim);
  const many = idea && KIM_MANY[idea.id] && (kim0 === idea.kim.uz || kim0 === idea.kim.ru) ? tr(KIM_MANY[idea.id]) : null;
  const K = many || kim0;
  const Q = filled(card.qachon) ? clean(card.qachon) : tr(CARD_PH.qachon);
  const O = filled(card.ogir) ? clean(card.ogir) : tr(CARD_PH.ogir);
  const prompt = tr({
    uz: `Siz shu guruhdagi bitta odamsiz: ${K}. Menimcha, sizda shunday muammo bor: ${Q} ${O}. Javob bering: 1) ${AI_QS[0].uz} 2) ${AI_QS[1].uz} Mahsulot taklif qilmang, faqat o'z vaziyatingizni aytib bering.`,
    ru: `Вы — один человек из этой группы: ${K}. Мне кажется, у вас есть такая проблема: ${ruComma(Q)} ${O}. Ответьте: 1) ${AI_QS[0].ru} 2) ${AI_QS[1].ru} Не предлагайте продукт, просто расскажите о своей ситуации.`,
  });
  const [ready, setReady] = useState(false); // ① va ② bajarildi → navbat ③ ga (o'ngdagi karta) o'tadi
  const [focus, setFocus] = useState(false);
  const [f, setF] = useState(() => ({ qachon: card.qachon || '', ogir: card.ogir || '', erishadi: card.erishadi || '' }));
  const [snap, setSnap] = useState(() => JSON.stringify({ qachon: card.qachon || '', ogir: card.ogir || '', erishadi: card.erishadi || '' }));
  const [put, setPut] = useState(false);
  const dirty = snap !== JSON.stringify(f);
  const canSave = dirty && filled(f.qachon) && filled(f.ogir) && filled(f.erishadi);
  // ③ pulsi — o'ngdagi kartada: bo'sh maydon → (o'zgargach) «Saqlash». Bir lahzada bitta (88-qonun).
  const emptyF = ['qachon', 'ogir', 'erishadi'].filter(k => !filled(f[k]));
  const pendE = put ? [] : canSave ? ['save'] : (emptyF.length ? emptyF : ['qachon']);
  const litE = useTurnWalk(pendE, ready && !focus && !isMentor);
  const save = () => { if (!canSave) return; cardWrite({ qachon: clean(f.qachon), ogir: clean(f.ogir), erishadi: clean(f.erishadi) }); setSnap(JSON.stringify(f)); setPut(true); };
  const fld = (k, lbl) => (
    <label className={`pw-f ${filled(f[k]) ? 'on' : ''}${turnCls(litE, k, pendE.length > 1)}`}><span style={{ color: T.ink2 }}>{lbl}</span><input value={f[k]} onChange={e => { const val = e.target.value; setF(p => ({ ...p, [k]: val })); setPut(false); }} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={tr(CARD_PH[k])} maxLength={120} /></label>
  );
  return (
    <Stage eyebrow={tr({ uz: 'AI bilan', ru: 'С AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!put && !isMentor} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen dense ai-screen" style={{ gap: 'clamp(12px,2vw,16px)' }}>
        <div className="head">
          <h2 className="title h-title fade-up">{tr({ uz: <>Kartangizdagi odam bu muammo haqida <span className="italic" style={{ color: T.accent }}>nima der edi</span>?</>, ru: <>Что бы <span className="italic" style={{ color: T.accent }}>сказал</span> об этой проблеме человек из вашей карточки?</> })}</h2>
          <p className="lead-note fade-up delay-1">{tr({ uz: "AI kartangizdagi odam o'rnida javob beradi.", ru: 'AI ответит вместо человека из вашей карточки.' })}</p>
        </div>
        {/* MG (F-0924-03): NEGA + bitta chorlov; puls ham ① dan boshlanadi. Yakuniy matn — metodist 24.09. */}
        <Mentor>{tr({ uz: <>Uning javobi kartangizni tekshirishga yordam beradi — avval <b style={{ color: T.ink }}>«📋 So'rovni nusxalash»</b>ni bosing.</>, ru: <>Его ответ поможет проверить вашу карточку, — сначала нажмите <b style={{ color: T.ink }}>«📋 Скопировать запрос»</b>.</> })}</Mentor>
        <div className="split">
          <Col>
            <AiStep prompt={prompt} answered={put} onReady={setReady} pulse={!isMentor}
              answerLabel={tr({ uz: <>AI javobini <b>«Kartangiz»</b> bilan solishtiring — farq bo'lsa, tuzatib <b>«Saqlash»</b>ni bosing</>, ru: <>Сравните ответ AI с <b>«Вашей карточкой»</b> — если есть разница, исправьте и нажмите <b>«Сохранить»</b></> })}
              fallback={<div className="ai-fb">
                {AI_QS.map((q, i) => <p key={i} className="ai-fb-q"><span className="pa-q-n" aria-hidden="true">{['🕒', '🎯'][i]}</span>{tr(q)}</p>)}
                <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: 'Sherigingiz kartangizdagi odam o\'rnida javob beradi, siz javobni kartangiz bilan solishtirasiz.', ru: 'Напарник отвечает вместо человека из вашей карточки, а вы сравниваете ответ со своей карточкой.' })}</p>
              </div>} />
          </Col>
          <Col>
            <div className="cq-card">
              <span className="ic-h">🗂 {tr({ uz: 'Kartangiz', ru: 'Ваша карточка' })}</span>
              <span className="cq-q" style={{ color: T.ink }}>{tr(CARD_Q[1].q)}</span>
              <div className="cq-two">{fld('qachon', tr({ uz: 'Qachon?', ru: 'Когда?' }))}{fld('ogir', tr({ uz: 'Nimasi og\'ir?', ru: 'Что тяжело?' }))}</div>
              <span className="cq-q" style={{ color: T.ink }}>{tr(CARD_Q[3].q)}</span>
              {fld('erishadi', null)}
              <button type="button" className={`pw-save${turnCls(litE, 'save', false)}`} style={{ alignSelf: 'flex-start' }} disabled={!canSave} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
              {put && <span className="done-mini fade-step">✓ {tr({ uz: 'Karta saqlandi', ru: 'Карточка сохранена' })}</span>}
            </div>
            {/* Qoida-eslatma o'ng ustunda — chap ustun (so'rov + 3 qadam + 🛟) bilan balandlik tenglashadi, ekran skrollsiz */}
            <p className="ai-rule">{tr({ uz: "AI — o'ylab topilgan bitta odam, haqiqiy foydalanuvchi emas. Kartada nima qolishini siz hal qilasiz.", ru: 'AI — это один придуманный человек, а не настоящий пользователь. Что останется в карточке, решаете вы.' })}</p>
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== 17-EKRAN — JUFTLIK (ballsiz): PairTimer (A 30s + B 30s) → sherik nima dedi — bir qator =====
const PAIR_KEY = 'bridge-b4-sherik';
const ScreenPair = ({ screen, onNext, onPrev }) => {
  const [text, setText] = useState(() => { try { return localStorage.getItem(PAIR_KEY) || ''; } catch { return ''; } });
  const save = (val) => { setText(val); try { localStorage.setItem(PAIR_KEY, val); } catch { /* jim */ } };
  const written = text.trim().length >= 8;
  const [pairStage, setPairStage] = useState('idle');
  const [reflFocus, setReflFocus] = useState(false);
  const inputTurn = useTurnHint(pairStage === 'done' && !written && !reflFocus);
  return (
    <Stage eyebrow={tr({ uz: 'Yakun · juftlik', ru: 'Итог · в паре' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext turnBusy={!written} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sherigingiz g'oyangizni <span className="italic" style={{ color: T.accent }}>30 soniyada</span> tushuna oladimi?</>, ru: <>Поймёт ли напарник вашу идею <span className="italic" style={{ color: T.accent }}>за 30 секунд</span>?</> })}</h2></div>
        {/* MG (F-0924-03): NEGA + bitta chorlov, puls bilan bir halqa. Yakuniy matn — metodist 24.09. */}
        <Mentor>{tr({ uz: <>Sherigingiz qaytarib ayta olsa, g'oyangiz tushunarli — <b style={{ color: T.ink }}>«▶ Taymerni boshlash»</b>ni bosing.</>, ru: <>Если напарник сможет пересказать идею, значит, она понятна, — нажмите <b style={{ color: T.ink }}>«▶ Запустить таймер»</b>.</> })}</Mentor>
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">{tr({ uz: '🗣 Sherigingizga 30 soniyada aytib bering: g\'oyangiz kim uchun va o\'sha odam oxirida nimaga erishadi.', ru: '🗣 Расскажите напарнику за 30 секунд: для кого ваша идея и чего этот человек добьётся в итоге.' })}</span></div></div>
            <PairTimer onStage={setPairStage} muted={written} />
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">{tr({ uz: "✍️ Sherigingiz g'oyangizni qanday qaytarib aytdi? Bir qatorga yozing.", ru: '✍️ Как напарник пересказал вашу идею? Запишите в одну строку.' })}</span></div></div>
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
        <p className="pair-now" style={{ margin: 0 }}>{st.done ? tr({ uz: "✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla!", ru: '✓ Время вышло — рассказали оба. Молодцы!' }) : tr({ uz: "Har biringizga 30 soniyadan: avval A gapiradi, keyin B. Kim A bo'lishini kelishib oling.", ru: 'По 30 секунд каждому: сначала говорит A, потом B. Договоритесь, кто будет A.' })}</p>
      )}
      <div className="pair-timer-btns">
        {!st.running && <button className={st.done ? 'btn-soft' : `pair-start${startTurn ? '' : ' calm'}`} onClick={() => setSt({ running: true, left: 60, done: false })}>{st.done ? tr({ uz: '↻ Yana bir marta', ru: '↻ Ещё раз' }) : tr({ uz: '▶ Taymerni boshlash', ru: '▶ Запустить таймер' })}</button>}
        {st.running && <button className="btn-soft" onClick={() => setSt({ running: false, left: 60, done: false })}>{tr({ uz: "⏹ To'xtatish", ru: '⏹ Остановить' })}</button>}
      </div>
    </div>
  );
}


// ===== 🏅 NISHONLAR (senariy 4-bo'lim) — faqat REAL tekshiriladigan harakatga; name inglizcha, desc siz-forma =====
const ACHIEVEMENTS = {
  clearProblem: { icon: '🎯', name: 'Clear Problem!', desc: { uz: '«Xarid qilish qiyin» gapini aniq muammoga aylantirdingiz', ru: 'Вы превратили фразу «покупать трудно» в конкретную проблему' } },
  perfectMatch: { icon: '🧩', name: 'Perfect Match!', desc: { uz: 'To\'rt mahsulotni o\'z vazifasiga ulab chiqdingiz', ru: 'Вы связали четыре продукта с их задачами' } },
  ideaCard:     { icon: '🗂️', name: 'Idea Card!',     desc: { uz: 'O\'z g\'oyangiz uchun to\'rt savolli karta yozdingiz', ru: 'Вы написали карточку из четырёх вопросов для своей идеи' } },
  niceCatch:    { icon: '🔎', name: 'Nice Catch!',    desc: { uz: 'Uch kartadagi chala qatorni topdingiz', ru: 'Вы нашли неполную строку в трёх карточках' } },
};
// Ekran id → nishon (recordAnswer'da, faqat data.correct bilan): 8 · 13 · 14 · 15-ekranlar.
const ACH_TRIGGERS = { gap: 'clearProblem', juft: 'perfectMatch', karta: 'ideaCard', tekshir: 'niceCatch' };

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
  { ch: { uz: 'KIM', ru: 'КТО' },             l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'QACHON', ru: 'КОГДА' },        l: 84, t: 8,  s: 26, d: 23, dl: 1.5 },
  { ch: { uz: 'MUAMMO', ru: 'ПРОБЛЕМА' },     l: 6,  t: 72, s: 22, d: 27, dl: 0.8 },
  { ch: { uz: 'YECHIM', ru: 'РЕШЕНИЕ' },      l: 74, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'VAZIFA', ru: 'ЗАДАЧА' },       l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: '🔍',     l: 66, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: 'Uzum',   l: 26, t: 34, s: 22, d: 20, dl: 1.9 },
  { ch: '⭐',     l: 55, t: 5,  s: 22, d: 22, dl: 0.6 },
  { ch: '🚚',     l: 91, t: 42, s: 24, d: 24, dl: 1.3 },
  { ch: '📍',     l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
  { ch: '🎯',     l: 2,  t: 30, s: 26, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike savollari — 12 ta, to'rt blokdan teng (3/3/3/3), vaziyatlar ekrandagidan boshqa (§144):
// maktab oshxonasi · o'yin ilovasi · kitob do'koni. To'g'ri javoblar 4 pozitsiyaga TENG (3/3/3/3). Jonli TASDIQLAYDI · Metodist ko'radi.
const QUIZ_BANK = [
  // 1-blok · kim uchun
  { q: { uz: 'Auditoriya nima?', ru: 'Что такое аудитория?' }, opts: [
    { uz: 'Saytdan foydalanadigan, ehtiyoji o\'xshash odamlar guruhi', ru: 'Группа людей со схожими потребностями, которые пользуются сайтом' },
    { uz: 'Saytni qurgan va uni yangilab turadigan dasturchilar', ru: 'Программисты, которые сделали сайт и обновляют его' },
    { uz: 'Saytga bir marta kirib, qaytib kelmagan har qanday odam', ru: 'Любой человек, который однажды зашёл на сайт и больше не вернулся' },
    { uz: "Sayt reklamasini ko'chada yoki televizorda ko'rgan odamlar", ru: 'Люди, которые видели рекламу сайта на улице или по телевизору' }], correct: 0 },
  { q: { uz: 'Kitob do\'koni saytiga kirgan o\'quvchi imtihonga kerakli kitobni izlayapti. Sahifaning eng ko\'zga tashlanadigan joyida nima tursin?', ru: 'Ученик зашёл на сайт книжного магазина и ищет книгу к экзамену. Что должно быть на самом заметном месте страницы?' }, opts: [
    { uz: 'Do\'konning ochilish tarixi', ru: 'История открытия магазина' },
    { uz: 'Do\'kon egasining katta rasmi', ru: 'Большое фото владельца магазина' },
    { uz: 'Kitob qidiradigan qator', ru: 'Строка поиска книг' },
    { uz: 'Chegirmalar haqidagi uzun matn', ru: 'Длинный текст о скидках' }], correct: 2 },
  { q: { uz: 'O\'yin ilovasi tepasida «Hamma uchun o\'yin!» deb yozilgan. Nima o\'zgarsa, o\'yinchi o\'zini taniydi?', ru: 'Вверху игрового приложения написано: «Игра для всех!». Что нужно изменить, чтобы игрок узнал себя?' }, opts: [
    { uz: 'Yozuv kattaroq harflarda bo\'lsa', ru: 'Если надпись будет крупнее' },
    { uz: 'Yozuv aniq kim uchun ekanini aytsa', ru: 'Если надпись скажет, для кого именно игра' },
    { uz: 'Yozuv oxiriga undov qo\'shilsa', ru: 'Если в конце добавить восклицательный знак' },
    { uz: 'Yozuv boshqa rangda bo\'lsa', ru: 'Если надпись будет другого цвета' }], correct: 1 },
  // 2-blok · muammo qayerda
  { q: { uz: 'Do\'stingiz kerakli kitobni topolmay, har safar uchta do\'konga qo\'ng\'iroq qiladi. Bu nimani ko\'rsatadi?', ru: 'Ваш друг не может найти нужную книгу и каждый раз звонит в три магазина. О чём это говорит?' }, opts: [
    { uz: 'U shunchaki gaplashishni yoqtiradi', ru: 'Он просто любит поговорить' },
    { uz: 'Unga kitob unchalik shart emas', ru: 'Книга ему не так уж нужна' },
    { uz: 'Bu yerda hech qanday muammo yo\'q', ru: 'Здесь нет никакой проблемы' },
    { uz: "U muammoni o'zicha hal qilyapti", ru: 'Он сам решает проблему' }], correct: 3 },
  { q: { uz: 'Qaysi gap — aniq muammo?', ru: 'Какая фраза — конкретная проблема?' }, opts: [
    { uz: 'Maktab oshxonasi juda yomon ishlaydi', ru: 'Школьная столовая работает очень плохо' },
    { uz: 'Tanaffusda hamma o\'quvchilar oshxonadan norozi', ru: 'На перемене все ученики недовольны столовой' },
    { uz: 'Oshxonada ovqat tanlash juda qiyin', ru: 'В столовой очень трудно выбрать еду' },
    { uz: 'Tanaffusda o\'quvchi navbatda 10 daqiqa turadi', ru: 'На перемене ученик 10 минут стоит в очереди' }], correct: 3 },
  { q: { uz: '«O\'yin qiyin» gapiga nima qo\'shilsa, u aniq muammoga aylanadi?', ru: 'Что добавить к фразе «игра трудная», чтобы она стала конкретной проблемой?' }, opts: [
    { uz: 'Kim, qachon va nimasi og\'ir', ru: 'Кто, когда и что тяжело' },
    { uz: 'O\'yinning nomi va narxi', ru: 'Название и цена игры' },
    { uz: 'Gap oxiriga uchta undov', ru: 'Три восклицательных знака в конце' },
    { uz: 'O\'yinni chiqargan kompaniya', ru: 'Компания, выпустившая игру' }], correct: 0 },
  // 3-blok · muammodan yechimga
  { q: { uz: 'Kitob do\'koni ilovasi buyurtma qilingan kitob qachon kelishini ko\'rsatadi. Bu qaysi muammoga javob beradi?', ru: 'Приложение книжного магазина показывает, когда придёт заказанная книга. На какую проблему это отвечает?' }, opts: [
    { uz: 'Odam kitobning narxini bilmasligiga', ru: 'Человек не знает цену книги' },
    { uz: 'Odam kitob qachon kelishini bilmasligiga', ru: 'Человек не знает, когда придёт книга' },
    { uz: 'Odam kitob muqovasini yoqtirmasligiga', ru: 'Человеку не нравится обложка книги' },
    { uz: 'Odam do\'kon nomini eslay olmasligiga', ru: 'Человек не может вспомнить название магазина' }], correct: 1 },
  { q: { uz: 'Maktab oshxonasi ilovasi uchun to\'rt taklif bor. Qaysi biri aniq muammoga javob beradi?', ru: 'Для приложения школьной столовой есть четыре предложения. Какое из них отвечает на конкретную проблему?' }, opts: [
    { uz: "Ilovaga chiroyli fon qo'yish — ko'zga yoqimli bo'ladi", ru: 'Поставить красивый фон — приятно глазу' },
    { uz: 'Ilova nomini qisqartirish — oson eslab qolinadi', ru: 'Сократить название — легче запомнить' },
    { uz: 'Ovqatni oldindan buyurtma qilish — navbat kutilmaydi', ru: 'Заказывать еду заранее — не нужно стоять в очереди' },
    { uz: "Har kuni hikmatli gap chiqarish — kayfiyat ko'tariladi", ru: 'Каждый день показывать мудрую фразу — поднимает настроение' }], correct: 2 },
  { q: { uz: 'Yechim nima?', ru: 'Что такое решение?' }, opts: [
    { uz: 'Ilovadagi eng chiroyli tugma', ru: 'Самая красивая кнопка в приложении' },
    { uz: 'Boshqa ilovalarda ham bor narsa', ru: 'То, что есть и в других приложениях' },
    { uz: 'Hamma muammoni hal qiladigan narsa', ru: 'То, что решает все проблемы' },
    { uz: 'Aniq muammoga javob beradigan narsa', ru: 'То, что отвечает на конкретную проблему' }], correct: 3 },
  // 4-blok · odam aslida nimani oladi
  { q: { uz: 'Sinfdoshingiz tushlikni oshxona ilovasidan oldindan buyurtma qildi. U aslida nimaga erishmoqchi?', ru: 'Одноклассник заранее заказал обед через приложение столовой. Чего он на самом деле хочет добиться?' }, opts: [
    { uz: 'Tanaffusda navbatsiz ovqatlanib ulgurishga', ru: 'Успеть поесть на перемене без очереди' },
    { uz: 'Oshxona ilovasidan har kuni foydalanishga', ru: 'Каждый день пользоваться приложением столовой' },
    { uz: 'Ilovadagi buyurtma tugmasini bosishga', ru: 'Нажать в приложении кнопку заказа' },
    { uz: "Oshxona menyusini boshidan o'qib chiqishga", ru: 'Прочитать меню столовой от начала до конца' }], correct: 0 },
  { q: { uz: 'Qaysi biri vazifa — odam erishadigan natija?', ru: 'Что из этого задача — результат, которого добивается человек?' }, opts: [
    { uz: 'Imtihon uchun darslik kitobi', ru: 'Учебник для экзамена' },
    { uz: "Kitob do'konining ilovasi", ru: 'Приложение книжного магазина' },
    { uz: 'Imtihonga vaqtida tayyorlanish', ru: 'Вовремя подготовиться к экзамену' },
    { uz: "Kitobni ilovada savatga qo'shish", ru: 'Добавить книгу в корзину в приложении' }], correct: 2 },
  { q: { uz: 'Do\'stingiz o\'yin uchun yangi quloqchin oldi. U aslida nimaga erishmoqchi?', ru: 'Друг купил новые наушники для игры. Чего он на самом деле хочет добиться?' }, opts: [
    { uz: "Yangi, qimmat quloqchinga ega bo'lishga", ru: 'Иметь новые дорогие наушники' },
    { uz: "Jamoadoshini aniq eshitib, o'yinda yutishga", ru: 'Хорошо слышать напарников и выигрывать' },
    { uz: 'Quloqchinni har kuni telefonga ulashga', ru: 'Каждый день подключать наушники к телефону' },
    { uz: "Quloqchin qutisini ochib, ichini ko'rishga", ru: 'Открыть коробку от наушников и заглянуть внутрь' }], correct: 1 },
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
    const TOK = tr({ uz: ['KIM', 'QACHON', 'MUAMMO', 'YECHIM', 'VAZIFA', 'Uzum', '🚚', '⭐', '🔍', '📍'],
                     ru: ['КТО', 'КОГДА', 'ПРОБЛЕМА', 'РЕШЕНИЕ', 'ЗАДАЧА', 'Uzum', '🚚', '⭐', '🔍', '📍'] });
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
  { front: { uz: 'Auditoriya nima?', ru: 'Что такое аудитория?' }, back: { uz: 'Saytdan foydalanadigan, ehtiyoji o\'xshash odamlar guruhi', ru: 'Группа людей со схожими потребностями, которые пользуются сайтом' } },
  { front: { uz: "Odam muammoni o'zicha hal qilishga urinsa, bu nimani ko'rsatadi?", ru: 'О чём говорит то, что человек сам пытается решить проблему?' }, back: { uz: 'Muammo unga befarq emas', ru: 'Проблема ему не безразлична' } },
  { front: { uz: 'Aniq muammo qaysi uch bo\'lakdan iborat?', ru: 'Из каких трёх частей состоит конкретная проблема?' }, back: { uz: 'Kim · qachon · nimasi og\'ir', ru: 'Кто · когда · что тяжело' } },
  { front: { uz: 'Yangi taklif kelsa, birinchi qaysi savol beriladi?', ru: 'Какой вопрос задают первым, когда приходит новое предложение?' }, back: { uz: 'Bu kimning qaysi muammosini hal qiladi?', ru: 'Чью и какую проблему это решает?' } },
  { front: { uz: 'Odam aslida nimani oladi?', ru: 'Что человек получает на самом деле?' }, back: { uz: 'Mahsulotning o\'zini emas, u beradigan natijani', ru: 'Не сам продукт, а результат, который тот даёт' } },
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
            <div className="fc-face fc-front"><span className="fc-q">{tr(card.front)}</span>{swapRef.current === 0 && <span className="fc-cue">{tr({ uz: "Javobni o'ylang 🤔", ru: 'Подумайте над ответом 🤔' })} <span className="fc-tap">{tr({ uz: 'bosing', ru: 'нажмите' })}</span></span>}</div>
            <div className="fc-face fc-back">{fcAnswer(tr(card.back))}</div>
          </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={() => advance(false)}>{tr({ uz: '✗ Takrorlash', ru: '✗ Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={() => advance(true)}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })}</button></div>)
        : (swapRef.current === 0 ? <p className="fc-hint">{tr({ uz: "👆 Kartani bosing — javobni ko'rasiz", ru: '👆 Нажмите карточку — увидите ответ' })}</p> : null /* F-0925-QA14: yo'riq faqat 1-kartada */)}
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
  { uz: 'Sayt ehtiyoji o\'xshash aniq odamlar uchun qilinadi.', ru: 'Сайт делают для конкретных людей со схожими потребностями.' },
  { uz: 'Muammo belgilar bilan topiladi va aniq gap bilan yoziladi: kim, qachon, nimasi og\'ir.', ru: 'Проблему находят по признакам и записывают точной фразой: кто, когда, что тяжело.' },
  { uz: 'Har yechim bitta muammoga javob beradi.', ru: 'Каждое решение отвечает на одну проблему.' },
  { uz: 'Odam mahsulotning o\'zini emas, u beradigan natijani oladi.', ru: 'Человек получает не сам продукт, а результат, который тот даёт.' },
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
    <Stage eyebrow={tr({ uz: 'Tayyor', ru: 'Готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: '↻ Darsni boshidan', ru: '↻ Урок сначала' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Darsni yakunlash ✓', ru: 'Завершить урок ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick" aria-hidden="true" />{tr({ uz: 'Dars tugadi', ru: 'Урок завершён' })}</span><h2 className="title h-title fade-up d1">{tr(LESSON_META.lessonTitle)}</h2></div></div>
        <div className={`qz-cta cs-cta fade-up d1 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : tr({ uz: "12 savolli tezkor o'yin — bugungi dars bo'yicha", ru: 'Быстрая игра из 12 вопросов — по сегодняшнему уроку' })} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className={`sum-row${isMentor ? ' solo' : ''}`}>
          <div className="card fade-up d2"><div className="card-lbl" style={{ color: T.success }}><i className="lbl-ck" aria-hidden="true" />{tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div><ul className="recap">{SUMMARY_LINES.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck" aria-hidden="true" /><span>{tr(r)}</span></li>))}</ul></div>
          {!isMentor && <div className="card ach-coll fade-up d3">
            <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr({ uz: 'Nishonlaringiz —', ru: 'Ваши значки —' })} {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
            <div className="ach-grid">
              {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return (
                <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`} title={tr(a.desc)}>
                  {got ? <span className="ach-badge-ic">{a.icon}</span> : <span className="ach-badge-ic lock" aria-hidden="true" />}
                  <span className="ach-badge-txt"><span className="ach-badge-name">{a.name}</span><span className="ach-badge-desc">{tr(a.desc)}</span></span>
                </div>
              ); })}
            </div>
          </div>}
        </div>
        <MentorNote>{tr({ uz: 'Og\'zaki ayting: «Backend modulida shu kartadagi ma\'lumot qayerda va qanday saqlanishini hal qilasiz.»', ru: 'Скажите устно: «В модуле Backend вы решите, где и как хранить данные из этой карточки».' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ============================================================ LESSON ROOT — ({ lang, onFinished, liveToken })
export default function BridgeKimUchunMuammo({ lang: langProp, onFinished, liveToken }) {
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
  const screens = [ScreenHook, ScreenGoal, ScreenTwo, ScreenTest1, ScreenSigns, ScreenCase, ScreenTest2, ScreenGapBuilder, ScreenApp, ScreenTest3, ScreenResult, ScreenTest4, ScreenMatch, ScreenCard, ScreenCheck, ScreenAI, ScreenPair, ScreenPodium, ScreenFlash, ScreenSummary];
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
        .mentor-ava { position: relative; display: flex; align-items: center; justify-content: center; }
        .mentor-ava img { position: absolute; inset: 0; opacity: 0; transition: opacity 0.2s; } .mentor-ava.ok img { opacity: 1; }
        .mentor-ava-fb { font-size: 21px; line-height: 1; }
        @media (prefers-reduced-motion: reduce) { .mentor-ava img { transition: none; } }
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
        /* MENTOR-DOK (3/4-o'tish 2-darsi naqshi, tekshiruvchi QA 2026-09-24): mentor rejimining qo'shimchalari — «Kim bajardi» paneli
           va «Eslatma» chipi — pastki navigatsiya qatorining bo'sh o'rtasida turadi. Ekran mazmuni o'quvchi ko'rinishi bilan bir xil
           balandlikda qoladi (1280x800, TopBar bilan: aylantirish yo'q). O'quvchi va mustaqil rejimda dok bo'sh bo'ladi va joy
           egallamaydi. Ochilgan eslatma qator ustida suzuvchi karta bo'lib chiqadi. */
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
        /* Sinf ovozi variant ustida (58-qonun): o'ngda «👥 N%» belgisi, pastki chetda 4px chiziq (absolute — balandlik qo'shmaydi).
           Chiziq ochilishda chapdan o'sadi; eng ko'p ovoz — yashil (P0 ovoz-jadvali ranglari). */
        .hk-opt.has-vote { position: relative; }
        .hk-vote { margin-left: auto; flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px; padding: 2px 9px; border-radius: 99px; background: ${T.accentSoft}; color: ${T.accent}; font-size: 12px; font-weight: 700; line-height: 1.5; }
        .hk-opt.on .hk-vote { background: ${T.paper}; }
        .hk-vote.top { background: ${T.successSoft}; color: ${T.success}; }
        .hk-vbar { position: absolute; left: 16px; right: 16px; bottom: 5px; height: 4px; border-radius: 99px; background: ${T.bg}; overflow: hidden; pointer-events: none; }
        .hk-opt.on .hk-vbar { background: rgba(255,255,255,0.75); }
        .hk-vbar > i { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); transform-origin: left center; transition: width 0.6s cubic-bezier(.2,.7,.2,1); animation: hk-vgrow 0.7s cubic-bezier(.2,.7,.2,1) 0.1s both; }
        .hk-vbar.top > i { background: linear-gradient(90deg, ${T.success}, #0E8A55); }
        @keyframes hk-vgrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) { .hk-vbar > i { transition: none; animation: none; } }

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
        .chrome { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .chrome > div:last-child { flex-shrink: 0; }
        .chrome-left { display: flex; align-items: center; gap: 10px; color: ${T.ink2}; min-width: 0; }
        .chrome-left > span:last-child { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        @media (max-width: 480px) { .chrome-left.eyebrow { letter-spacing: 0.1em; } }
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
        /* Hook (F-0924-04): chapda sxema, o'ngda variantlar — B1 hk-split tuzilmasi */
        .split.hk-split { grid-template-columns: minmax(0,0.9fr) minmax(0,1.1fr); align-items: start; }
        /* F-0925-QA18: kompyuterda variantlar chapda, telefon-sxema o'ngda; ikkala ustun bir chiziqdan (telefonda tartib o'zgarmaydi) */
        @media (min-width: 761px) { .split.hk-split { grid-template-columns: minmax(0,1.1fr) minmax(0,0.9fr); } .split.hk-split > .hk-scene { order: 2; } }
        .hk-scene { display: flex; justify-content: center; min-width: 0; }
        .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
        @media (max-width: 760px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }
        /* 3-ekran: xulosa kompyuterda chap ustunda (sxema yonida, ekranga sig'adi); telefonda tartib — odamlar, sxema, xulosa */
        @media (max-width: 760px) { .uz-split > .col:first-child { display: contents; } .uz-split > .col:last-child { order: 2; } .uz-split > .col:first-child > .frame-success { order: 3; } }


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
        /* Keys-slayd o'z boshqaruvi bilan (F-0924-07, B3 naqshi): chapda belgi, o'ngda matn + ← Oldingi · nuqtalar · Keyingisi → */
        .k-nav { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 4px; }
        .k-prev.btn-soft { padding: 9px 16px; font-size: 13.5px; border-radius: 10px; }
        .k-next { border: none; border-radius: 10px; padding: 9px 18px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13.5px; cursor: pointer; }
        .k-fig { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; min-width: 0; }
        .k-slide.ph { padding: clamp(18px,2.6vw,26px) clamp(18px,3vw,30px); min-height: clamp(190px,26vh,230px); display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.15fr); column-gap: clamp(16px,2.5vw,28px); row-gap: 8px; align-items: center; text-align: left; }
        .k-slide.ph > .k-fig { grid-column: 1; grid-row: 1 / span 4; }
        .k-slide.ph > :not(.k-fig) { grid-column: 2; justify-self: start; }
        .k-slide.ph .k-nav { justify-content: flex-start; }
        @media (max-width: 760px) { .k-slide.ph { display: flex; flex-direction: column; text-align: center; } .k-slide.ph > :not(.k-fig) { justify-self: auto; } }
        .k-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .k-dot.fill { background: ${T.ink3}; } .k-dot.cur { background: ${T.accent}; width: 26px; }

        /* === 🎲 KEYS-TAXMIN (s4) — slayd oldidan mikro-tikish; BALL EMAS, sof o'yin === */
        .kp-bet { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        /* F-0925-QA08: taxmin kartasi tepasidagi binafsha kesik chiziq olindi (foydalanuvchi: «siniq chiziq kerak emas», 7 dars) */
        .kp-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        /* 6-ekran: taxmin tanlangach bashorat-kartasi ixchamlashadi (tanlangan va asl javob qoladi) — 1-slayd birinchi ekranga sig'adi */
        .kp-bet:has(.kp-chip.locked) { padding: 16px clamp(18px,3vw,28px) 14px; gap: 10px; }
        .kp-bet:has(.kp-chip.locked) .kp-chip.locked:not(.correct):not(.wrong) { display: none; }
        .kp-bet:has(.kp-chip.locked) + .k-slide { padding-top: 18px; gap: 8px; }
        .kp-bet:has(.kp-chip.locked) + .k-slide .k-slide-ic { font-size: clamp(32px,4.5vw,40px); }
        .kp-chip { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(14px,1.8vw,16px); padding: 12px 18px; border-radius: 99px; border: none; background: ${T.bg}; color: ${T.ink}; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); transition: transform 0.16s, box-shadow 0.16s; }
        .kp-chip:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 10px 20px -8px rgba(${T.shadowBase},0.24); }
        /* press-holat: bosilganda ichkariga cho'kadi (tap affordance) */
        .kp-chip:active { transform: translateY(0) scale(0.94); box-shadow: inset 0 0 0 1.5px ${T.accent}, inset 0 3px 7px -3px rgba(${T.shadowBase},0.25); color: ${T.accent}; }
        .kp-ic { font-size: 19px; }
        .kp-chip.locked { cursor: default; transform: none; }
        .kp-chip.locked:hover { transform: none; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); }
        .kp-chip.correct { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
        .kp-chip.correct:hover { box-shadow: inset 0 0 0 2px ${T.success}; }
        .kp-chip.wrong { background: ${T.errSoft}; color: ${T.err}; box-shadow: inset 0 0 0 2px ${T.err}; }
        .kp-chip.wrong:hover { box-shadow: inset 0 0 0 2px ${T.err}; }
        .kp-chip.locked:not(.correct):not(.wrong) { opacity: 0.5; }
        .kp-mark { font-weight: 900; font-size: 15px; }
        /* Test-savol (F-0924-06): PmLesson2 qolipi — eyebrow + lead-qator + bitta h-ask (B3 naqshi). Karta faqat 8-ekran voqeasida qoladi */
        .tq { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .tq-lead { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(14.5px,1.8vw,16px); line-height: 1.5; color: ${T.ink2}; }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; margin: 0; color: ${T.ink}; }
        .stage-content.narrow:has(> .screen.qs) { max-width: 800px; }
        .screen.qs.qs-on { gap: clamp(12px,1.6vw,16px) !important; }
        .screen.qs .feedback-block.visible { margin-top: 0; }
        .screen.qs .feedback-block .frame-success, .screen.qs .feedback-block .frame-soft, .screen.qs .feedback-block .frame-wait { padding: clamp(11px,1.6vw,14px) clamp(14px,2vw,18px); }
        .tq-card { background: ${T.paper}; border-radius: 16px; padding: clamp(20px,3vw,28px) clamp(20px,3vw,30px); box-shadow: 0 14px 34px -14px rgba(${T.shadowBase},0.22); }
        .tq-story { font-family: Georgia, 'Times New Roman', serif; font-size: clamp(17px,2.4vw,23px); line-height: 1.55; color: ${T.ink}; margin: 0; }
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
        /* 20-ekran: «Endi siz bilasiz» va nishonlar yonma-yon — 1280×800 da ekranga sig'adi; telefonda ustma-ust */
        .sum-row { display: grid; grid-template-columns: minmax(0,1.2fr) minmax(0,1fr); gap: clamp(12px,2vw,18px); align-items: stretch; } /* QA: nishon tavsifi qo'shilgach o'ng ustun kengaydi — 1280×800 skrollsiz */
        .lesson-root .card.ach-coll { padding-top: 12px; padding-bottom: 12px; }
        .sum-row.solo { grid-template-columns: 1fr; }
        .sum-row .ach-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
        .sum-row .ach-coll .ach-badge { padding: 8px 9px; min-width: 0; }
        .sum-row .ach-badge-name { font-size: 12.5px; overflow-wrap: anywhere; }
        @media (max-width: 760px) { .sum-row { grid-template-columns: 1fr; } }
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
        .ach-coll .ach-badge-ic { font-size: 22px; flex-shrink: 0; }
        .ach-badge-txt { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .ach-badge-desc { font-family: 'Manrope'; font-weight: 500; font-size: 11.5px; line-height: 1.3; color: ${T.ink2}; overflow-wrap: anywhere; }
        .ach-badge.locked .ach-badge-desc { color: ${T.ink3}; }
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
        .fc-bar-fill { display: block; height: 100%; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); border-radius: 99px; transition: width .4s cubic-bezier(.34,1.2,.4,1); }
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
        .fc-back { background: linear-gradient(160deg, ${T.accentVivid}, ${T.accent}); color: #fff; transform: rotateY(180deg); box-shadow: 0 16px 36px -16px rgba(91,61,230,0.6); }
        .fc-q { font-family: 'Manrope'; font-weight: 800; font-size: clamp(18px,2.8vw,23px); color: ${T.ink}; line-height: 1.3; text-wrap: balance; }
        .fc-cue { font-family: 'Manrope'; font-size: 13px; color: ${T.ink3}; }
        .fc-tap { color: ${T.accent}; font-weight: 700; }
        /* F-0803-13/14: javob uzunlikka moslashadi — 4 pog'ona + kod/gap shrift ajrimi */
        .fc-tag { font-weight: 800; letter-spacing: -0.02em; line-height: 1.16; max-width: 100%; text-wrap: balance; overflow-wrap: anywhere; }
        .fc-tag.prose { font-family: 'Manrope', sans-serif; letter-spacing: -0.005em; }
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
  .sg-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .sg-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
  @media (max-width: 640px) { .sg-grid { grid-template-columns: 1fr; } }
  .sg-card { position: relative; display: grid; grid-template-columns: 44px minmax(0,1fr); grid-template-rows: auto auto; column-gap: 14px; row-gap: 8px; align-items: start; min-width: 0; text-align: left; border: none; cursor: pointer; font: inherit; color: ${T.ink}; background: ${T.paper}; border-radius: 16px; padding: 15px 18px 15px 14px; box-shadow: inset 0 0 0 1px ${T.line}, 0 8px 20px -14px rgba(${T.shadowBase},0.35); transition: transform 0.18s, box-shadow 0.18s, border-color 0.2s; }
  .sg-card:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px ${T.line}, 0 14px 26px -14px rgba(${T.shadowBase},0.4); }
  .sg-card.open { }
  .sg-ic { grid-row: 1 / span 2; width: 44px; height: 44px; border-radius: 12px; background: ${T.bg}; display: flex; align-items: center; justify-content: center; font-size: 22px; line-height: 1; transition: background 0.2s, transform 0.35s; }
  .sg-card.open .sg-ic { background: ${T.successSoft}; transform: rotateY(360deg); }
  .sg-ex { font-family: 'Source Serif 4', serif; font-size: clamp(15px,1.9vw,17px); line-height: 1.4; overflow-wrap: anywhere; min-width: 0; }
  .sg-cue { justify-self: start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 4px 11px; }
  .sg-name { justify-self: start; font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 4px 12px; box-shadow: inset 0 0 0 1px ${T.success}44; animation: sg-pop 0.35s cubic-bezier(.34,1.6,.4,1); }
  @keyframes sg-pop { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: none; opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .sg-card, .sg-ic { transition: none; } .sg-card:hover { transform: none; } .sg-card.open .sg-ic { transform: none; } .sg-name { animation: none; } }
  .shake { animation: b2-shake 0.42s ease; }
  @keyframes b2-shake { 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
  @media (prefers-reduced-motion: reduce) { .shake { animation: none; } }

  .kp-ask { font-size: clamp(16px,2.2vw,20px) !important; line-height: 1.45; max-width: 640px; }
  .gb-lead { padding: 14px 18px !important; }
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
  .gb-opt.bad { background: ${T.errSoft}; color: ${T.err}; box-shadow: inset 0 0 0 1.5px ${T.err}55; animation: b2-shake 0.42s ease; }
  .gb-bad { grid-column: 1 / -1; margin: 0; font-size: 13px; color: ${T.err}; }
  @keyframes gb-pop { 0% { transform: scale(0.8); } 60% { transform: scale(1.06); } 100% { transform: none; } }
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
  .gb-fill.bad { color: ${T.ink3}; text-decoration: underline wavy ${T.err}88; }
  @media (prefers-reduced-motion: reduce) { .gb-opt, .gb-row, .gb-sent { transition: none; } .gb-opt:hover:not(:disabled) { transform: none; } .gb-opt.ok, .gb-opt.bad, .gb-fill, .gb-row.ok .gb-dot, .gb-sent.build.ok::after { animation: none; } }

  .ic-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
  .ic-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 10.5px; letter-spacing: 0.06em; color: ${T.ink3}; }
  .ic-lbl.kim { color: ${T.blue}; } .ic-lbl.ogir { color: ${T.accent}; } .ic-lbl.qiladi { color: #B77A16; }
  .pw-f { display: flex; flex-direction: column; gap: 5px; min-width: 0; position: relative; }
  .pw-f > span { font-family: 'Manrope'; font-weight: 800; font-size: 13px; }
  .pw-f input { width: 100%; min-width: 0; font-family: 'Manrope'; font-size: 15px; color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 11px; padding: 11px 13px; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; transition: box-shadow 0.15s; }
  .pw-f input:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
  .pw-f.on input { box-shadow: inset 0 0 0 1.5px ${T.success}88; }
  .pw-f input:disabled { opacity: 0.55; }
  .pw-f.turn-ring::after { inset: -4px; border-radius: 13px; }
  .pw-save { font-family: 'Manrope'; font-weight: 800; font-size: 14.5px; cursor: pointer; border: none; border-radius: 12px; padding: 11px 20px; background: ${T.accent}; color: #fff; box-shadow: 0 10px 22px -10px rgba(91,61,230,0.6); }
  .pw-save:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
  .mt-pool { display: flex; flex-wrap: wrap; gap: 8px; }
  .mt-sol { position: relative; font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.6vw,14.5px); cursor: pointer; border: none; border-radius: 12px; padding: 10px 14px 10px 12px; text-align: left; background: ${T.paper}; color: ${T.ink}; box-shadow: inset 0 0 0 1px ${T.line}, 0 6px 16px -10px rgba(${T.shadowBase},0.3); max-width: 100%; overflow-wrap: anywhere; transition: transform 0.15s, box-shadow 0.15s; }
  .mt-sol:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1px ${T.line}, 0 10px 20px -10px rgba(${T.shadowBase},0.38); }
  .mt-sol.sel { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 22px -10px rgba(91,61,230,0.45); transform: translateY(-2px); }
  .mt-targets { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
  @media (max-width: 640px) { .mt-targets { grid-template-columns: 1fr; } }
  .mt-tgt { display: flex; flex-direction: column; align-items: stretch; gap: 8px; min-width: 0; min-height: 56px; text-align: left; font: inherit; color: ${T.ink}; border: none; border-radius: 14px; padding: 12px 15px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.line}; cursor: default; transition: box-shadow 0.2s, background 0.2s; }
  .mt-tgt.targetable { cursor: pointer; box-shadow: inset 0 0 0 2px ${T.accent}66; }
  .mt-tgt.targetable:hover { box-shadow: inset 0 0 0 2px ${T.accent}; }
  .mt-tgt.filled { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}66; animation: none; }
  .mt-tgt-h { display: flex; align-items: center; gap: 9px; font-family: 'Manrope'; font-weight: 800; font-size: 14px; overflow-wrap: anywhere; min-width: 0; }
  .mt-ic { width: 20px; height: 20px; border-radius: 6px; flex-shrink: 0; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}55; position: relative; }
  .mt-ic::after { content: ''; position: absolute; inset: 0; background: linear-gradient(${T.accent}, ${T.accent}) 50% 4px / 2.5px 7px no-repeat, radial-gradient(circle, ${T.accent} 1.5px, transparent 1.8px) 50% 12.5px / 4px 4px no-repeat; }
  .mt-tgt.filled .mt-ic { background: ${T.success}; box-shadow: none; } .mt-tgt.filled .mt-ic::after { background: none; left: 7px; top: 3px; right: auto; bottom: auto; width: 4px; height: 9px; border: solid #fff; border-width: 0 2px 2px 0; transform: rotate(45deg); }
  .mt-att { display: block; font-size: 13.5px; color: ${T.success}; font-weight: 700; overflow-wrap: anywhere; background: ${T.paper}; border-radius: 9px; padding: 6px 10px; box-shadow: inset 0 0 0 1px ${T.success}44; animation: rv-snap 0.34s cubic-bezier(.34,1.6,.4,1); }
  @media (prefers-reduced-motion: reduce) { .mt-sol, .mt-tgt { transition: none; } .mt-sol:hover, .mt-sol.sel { transform: none; } .mt-tgt.targetable, .mt-att { animation: none; } }
  .ai-rule.ai-rule { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 13px; }
  /* AI QADAMI (F-0924-01/02) — B3 dan AYNAN; manba DeployLesson 3314-3340, 3416-3431 */
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
  .pod-me { display: flex; flex-direction: column; align-items: center; gap: 6px; align-self: center; background: ${T.paper}; border-radius: 20px; padding: 22px 38px; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.4); }
  .pod-me-medal { font-size: 46px; line-height: 1; }
  .pod-me-place { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(24px,4vw,32px); color: ${T.accent}; }
  .pod-me-score { font-size: 15px; color: ${T.ink2}; font-weight: 700; }
  @media (max-width: 640px) { .ai-rule.ai-rule { padding: 8px 12px; font-size: 13px; } }
  .ta-list { display: flex; flex-direction: column; gap: 8px; }
  .ta-item { display: flex; align-items: flex-start; gap: 10px; background: ${T.paper}; border-radius: 12px; padding: 11px 14px; box-shadow: inset 0 0 0 1px ${T.line}, 0 6px 16px -12px rgba(${T.shadowBase},0.3); min-width: 0; transition: border-color 0.2s, box-shadow 0.2s; }
  .ta-item.on { box-shadow: inset 0 0 0 1px ${T.success}44, 0 8px 18px -12px rgba(18,169,104,0.35); animation: rv-snap 0.3s ease; }
  .ta-item-n { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center; }
  .ta-item.on .ta-item-n { background: ${T.success}; color: #fff; }
  .ta-item-t { font-size: 14.5px; line-height: 1.4; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .ta-item-q { color: ${T.ink3}; }
  @keyframes rv-snap { 0% { opacity: 0; transform: translateY(-8px) scale(0.92); } 100% { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: reduce) { .ta-item.on { animation: none; } .ta-item { transition: none; } }
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
        .person { position: relative; display: flex; align-items: center; gap: 14px; width: 100%; text-align: left; background: ${T.paper}; border: none; border-radius: 16px; padding: clamp(14px,2vw,18px); font-family: 'Manrope', sans-serif; cursor: pointer; box-shadow: 0 8px 20px -10px rgba(${T.shadowBase},0.22); transition: box-shadow 0.2s, transform 0.2s, opacity 0.2s; }
        .person:hover { transform: translateY(-2px); }
        .person.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 24px -10px rgba(91,61,230,0.35); }
        .person-ic { font-size: clamp(28px,4vw,38px); line-height: 1; }
        .person-t { flex: 1; font-weight: 700; font-size: clamp(14.5px,1.8vw,17px); color: ${T.ink}; line-height: 1.35; }
        .person-ck { color: ${T.success}; font-weight: 800; }
        .idea { display: flex; flex-direction: column; gap: 3px; text-align: left; background: ${T.paper}; border: none; border-radius: 12px; padding: 10px 12px; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},0.2); transition: box-shadow 0.18s, transform 0.18s; }
        .idea:hover { transform: translateY(-1px); }
        .idea b { font-size: 13px; color: ${T.accent}; } .idea span { font-size: 13.5px; color: ${T.ink2}; line-height: 1.35; }
        .idea.on { box-shadow: inset 0 0 0 2px ${T.accent}; }
        .ideas { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }

  /* === BRIDGE-B4: dars mexanikalari (maqsad-preview, Uzum sxemasi, natija-kartalar, to'rt savolli karta, tekshiruv, AI-zaxira) === */
  .gq-demo { position: relative; display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 18px; padding: clamp(16px,2.6vw,24px); padding-top: 40px; box-shadow: inset 0 0 0 1px ${T.line}, 0 14px 34px -16px rgba(${T.shadowBase},0.32); min-width: 0; animation: fade-in-up 0.4s ease-out 0.12s forwards, gq-done 0.5s ease 5.05s forwards; }
  .gq-tag { position: absolute; top: 12px; left: clamp(16px,2.6vw,24px); font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.accent}; }
  .gq-replay { position: absolute; top: 8px; right: 10px; display: inline-flex; align-items: center; gap: 5px; height: 28px; padding: 0 11px; border-radius: 99px; border: none; cursor: pointer; font-family: 'Manrope'; font-size: 12px; font-weight: 700; background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; transition: color 0.15s, box-shadow 0.15s; }
  .gq-replay-ic { display: inline-block; font-size: 14px; transition: transform 0.3s; }
  .gq-replay:hover { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .gq-replay:hover .gq-replay-ic { transform: rotate(-180deg); }
  .gq-row { --slot: ${T.accent}; --slotSoft: ${T.accentSoft}; position: relative; display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: 6px 14px; align-items: baseline; padding: 10px 12px 10px 14px; border-radius: 12px; background: ${T.bg}; box-shadow: none; opacity: 0; animation: gq-in 0.35s ease-out var(--fd, 0s) forwards, gq-fill 0.4s ease calc(var(--fd, 0s) + 1.05s) forwards; min-width: 0; }
  .gq-row.kim { --slot: ${T.blue}; --slotSoft: ${T.blueSoft}; } .gq-row.qiladi { --slot: #B77A16; --slotSoft: #FBEED6; } .gq-row.erishadi { --slot: ${T.success}; --slotSoft: ${T.successSoft}; }
  @media (max-width: 760px) { .gq-row { grid-template-columns: 1fr; } }
  .gq-q { display: inline-flex; align-items: baseline; gap: 8px; font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; color: ${T.ink}; }
  .gq-n { font-style: normal; flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: ${T.paper}; color: var(--slot); box-shadow: inset 0 0 0 1.5px var(--slot); font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; }
  .gq-a { min-width: 0; font-family: 'Source Serif 4', serif; font-size: clamp(14.5px,1.8vw,16.5px); line-height: 1.4; color: ${T.ink}; overflow-wrap: anywhere; }
  .gq-type { display: block; clip-path: inset(0 100% 0 0); animation: gq-type 0.8s steps(24, end) calc(var(--fd, 0s) + 0.25s) forwards; }
  .gq-stamp { position: absolute; right: 10px; top: 50%; margin-top: -15px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 12px; letter-spacing: 0.1em; color: ${T.success}; border: 3px double ${T.success}; border-radius: 8px; padding: 3px 9px; background: ${T.paper}; opacity: 0; transform: rotate(-8deg) scale(2.4); animation: gq-stamp 0.55s cubic-bezier(.2,1.2,.3,1) calc(var(--fd, 0s) + 1.3s) forwards; }
  .gq-stamp::after { content: ''; position: absolute; inset: -6px; border-radius: 12px; box-shadow: 0 0 0 2px ${T.success}55; opacity: 0; animation: gq-ink 0.6s ease-out calc(var(--fd, 0s) + 1.55s) forwards; }
  .gq-row.erishadi { padding-right: 104px; }
  @media (max-width: 640px) { .gq-row.erishadi { padding-right: 12px; padding-top: 38px; } .gq-stamp { top: 6px; margin-top: 0; } }
  @keyframes gq-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  @keyframes gq-fill { to { background: var(--slotSoft); } }
  @keyframes gq-type { to { clip-path: inset(0 0 0 0); } }
  @keyframes gq-stamp { 0% { opacity: 0; transform: rotate(-8deg) scale(2.4); } 55% { opacity: 1; transform: rotate(-8deg) scale(0.94); } 75% { transform: rotate(-6deg) scale(1.05); } 100% { opacity: 1; transform: rotate(-8deg) scale(1); } }
  @keyframes gq-ink { 0% { opacity: 1; transform: scale(0.9); } 100% { opacity: 0; transform: scale(1.35); } }
  @keyframes gq-done { to { box-shadow: inset 0 0 0 1.5px ${T.success}44, 0 0 0 5px ${T.success}12, 0 14px 34px -16px rgba(18,169,104,0.35); } }
  @media (prefers-reduced-motion: reduce) { .gq-demo, .gq-row, .gq-type, .gq-stamp, .gq-stamp::after { animation: none; opacity: 1; clip-path: none; } .gq-row { background: var(--slotSoft); } .gq-stamp::after { opacity: 0; } .gq-stamp { transform: rotate(-8deg); } .gq-demo { } .gq-replay, .gq-replay-ic, .gq-replay:hover .gq-replay-ic { transition: none; transform: none; } }

  /* Uzum-sxemasi (3 va 9-ekran): telefon ramkasi — qalin qog'oz chegara + ichki ekran; brendsiz, PM-STUDIA ranglari */
  .uz-phone { position: relative; width: min(304px, 100%); align-self: center; display: flex; flex-direction: column; gap: 7px; border-radius: 36px; padding: 10px 13px 14px; background: ${T.paper}; box-shadow: inset 0 0 0 2px ${T.line}, inset 0 0 0 8px ${T.bg}, 0 24px 46px -24px rgba(${T.shadowBase},0.5); min-width: 0; }
  @media (max-width: 640px) { .uz-phone { width: min(286px, 100%); } .uz-img { height: 66px; } .uz-dev { width: 30px; height: 50px; } }
  .uz-status { position: relative; display: flex; align-items: center; justify-content: space-between; height: 22px; padding: 0 12px; font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; }
  .uz-status b { font-weight: 800; font-variant-numeric: tabular-nums; }
  .uz-notch { position: absolute; top: 7px; left: 50%; width: 64px; height: 9px; margin-left: -32px; border-radius: 99px; background: ${T.ink}; opacity: 0.88; }
  .uz-batt { position: relative; width: 20px; height: 9px; border-radius: 3px; box-shadow: inset 0 0 0 1.3px ${T.ink3}; }
  .uz-batt i { position: absolute; left: 2px; top: 2px; bottom: 2px; width: 11px; border-radius: 1.5px; background: ${T.success}; }
  .uz-row { position: relative; display: flex; align-items: center; gap: 8px; min-height: 38px; border-radius: 12px; padding: 7px 42px 7px 11px; background: ${T.bg}; transition: background 0.25s, box-shadow 0.25s; min-width: 0; }
  .uz-row:not(.sp) { padding-right: 11px; }
  .uz-row.lit { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px ${T.success}, 0 0 0 5px ${T.success}1F; animation: uz-lit 0.45s cubic-bezier(.34,1.6,.4,1); }
  .uz-row.lit:not(.sp)::after { content: '👀'; position: absolute; right: -10px; top: 50%; margin-top: -15px; width: 30px; height: 30px; border-radius: 50%; background: ${T.paper}; box-shadow: 0 6px 14px -6px rgba(${T.shadowBase},0.5), inset 0 0 0 2px ${T.success}; display: flex; align-items: center; justify-content: center; font-size: 15px; animation: sg-pop 0.35s cubic-bezier(.34,1.6,.4,1); }
  .uz-search { gap: 6px; padding-left: 6px; background: none; }
  .uz-back { flex-shrink: 0; width: 22px; text-align: center; font-size: 20px; line-height: 1; color: ${T.ink2}; }
  .uz-field { flex: 1; min-width: 0; display: flex; align-items: center; gap: 7px; height: 32px; border-radius: 99px; padding: 0 12px; background: ${T.bg}; box-shadow: inset 0 0 0 1px ${T.line}; }
  .uz-search.lit .uz-field { background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.success}88; }
  .uz-ph { font-family: 'Manrope'; font-size: 12.5px; color: ${T.ink3}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .uz-ic { font-size: 14px; line-height: 1; flex-shrink: 0; }
  .uz-img { position: relative; height: 92px; border-radius: 16px; background: radial-gradient(120px 80px at 50% 58%, ${T.paper} 0%, transparent 70%), linear-gradient(135deg, ${T.accentSoft}, ${T.blueSoft}); display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .uz-dev { position: relative; width: 38px; height: 64px; border-radius: 9px; background: linear-gradient(160deg, ${T.ink2}, ${T.ink}); box-shadow: 0 10px 18px -8px rgba(${T.shadowBase},0.6), inset 0 0 0 2px rgba(255,255,255,0.12); transform: translateY(-4px); }
  .uz-dev i { position: absolute; left: 4px; right: 4px; top: 6px; bottom: 6px; border-radius: 5px; background: linear-gradient(160deg, ${T.accentVivid}, ${T.blue}); opacity: 0.9; }
  .uz-heart { position: absolute; top: 7px; right: 9px; width: 24px; height: 24px; border-radius: 50%; background: ${T.paper}; color: ${T.ink2}; font-size: 13px; line-height: 24px; text-align: center; }
  .uz-dots { position: absolute; bottom: 7px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; }
  .uz-dots i { width: 5px; height: 5px; border-radius: 50%; background: ${T.ink3}; opacity: 0.45; }
  .uz-dots i.on { width: 13px; border-radius: 99px; background: ${T.accent}; opacity: 1; }
  .uz-sum { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 15px; color: ${T.ink}; letter-spacing: -0.02em; }
  .uz-sum small { font-family: 'Manrope'; font-size: 11px; font-weight: 700; color: ${T.ink2}; letter-spacing: 0; }
  .uz-line { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-size: 12px; color: ${T.ink}; white-space: nowrap; overflow: hidden; }
  .uz-line b { font-weight: 800; overflow: hidden; text-overflow: ellipsis; }
  .uz-meta { color: ${T.ink2}; flex-shrink: 0; }
  .uz-stars { color: #E8A13A; font-size: 11.5px; letter-spacing: 0.5px; flex-shrink: 0; }
  .uz-deliv.lit .uz-line b { color: ${T.success}; }
  .uz-cart { height: 38px; margin-top: 2px; border-radius: 12px; background: ${T.accent}; display: flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: #fff; box-shadow: 0 8px 16px -10px rgba(91,61,230,0.7); }
  .uz-spot { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); width: 28px; height: 28px; border-radius: 50%; border: none; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 13px; background: ${T.accent}; color: #fff; box-shadow: 0 6px 14px -6px rgba(91,61,230,0.6); transition: transform 0.15s; }
  .uz-spot::before { content: ''; position: absolute; inset: -5px; border-radius: 50%; box-shadow: 0 0 0 3px rgba(91,61,230,0.28); pointer-events: none; }
  .uz-spot:hover { transform: translateY(-50%) scale(1.1); }
  .uz-spot.seen { background: ${T.success}; box-shadow: 0 6px 14px -6px rgba(18,169,104,0.6); }
  .uz-spot.seen::before { opacity: 0; }
  .uz-spot.on { box-shadow: 0 0 0 3px ${T.paper}, 0 0 0 5px ${T.success}66; }
  .uz-spot.turn-ring::after { border-radius: 50%; }
  @keyframes uz-lit { 0% { transform: scale(0.97); } 60% { transform: scale(1.025); } 100% { transform: none; } }
  @media (prefers-reduced-motion: reduce) { .uz-row, .uz-spot { transition: none; } .uz-row.lit, .uz-row.lit::after, .uz-spot::before { animation: none; } .uz-spot:hover { transform: translateY(-50%); } }
  .person-think { display: block; margin-top: 4px; font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; font-size: clamp(14px,1.7vw,16px); color: ${T.success}; }
  .person-t { min-width: 0; overflow-wrap: anywhere; }
  .ta-item { width: 100%; text-align: left; font: inherit; color: ${T.ink}; border: none; cursor: pointer; }

  .rs-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
  @media (max-width: 760px) { .rs-grid { grid-template-columns: 1fr; } }
  .rs-card { position: relative; min-height: 156px; border: none; padding: 0; background: none; cursor: pointer; font: inherit; text-align: left; perspective: 900px; border-radius: 16px; min-width: 0; }
  .rs-in { position: relative; display: block; width: 100%; height: 100%; min-height: 156px; transition: transform 0.55s cubic-bezier(.4,0,.2,1); transform-style: preserve-3d; }
  .rs-card:hover .rs-in { transform: translateY(-3px); }
  .rs-card.flip .rs-in, .rs-card.flip:hover .rs-in { transform: rotateY(180deg); }
  .rs-face { position: absolute; inset: 0; display: flex; flex-direction: column; gap: 7px; padding: 16px 16px 14px 18px; border-radius: 16px; backface-visibility: hidden; -webkit-backface-visibility: hidden; min-width: 0; overflow-wrap: anywhere; }
  .rs-front { background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}, 0 10px 24px -14px rgba(${T.shadowBase},0.35); }
  .rs-card:hover .rs-front { box-shadow: inset 0 0 0 1px ${T.line}, 0 16px 30px -14px rgba(${T.shadowBase},0.45); }
  .rs-back { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}55, 0 10px 24px -14px rgba(18,169,104,0.4); transform: rotateY(180deg); }
  .rs-flip { position: absolute; top: 12px; right: 12px; width: 26px; height: 26px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-size: 14px; font-weight: 800; line-height: 26px; text-align: center; transition: transform 0.35s; }
  .rs-card:hover .rs-flip { transform: rotate(180deg); }
  .rs-goal { position: absolute; top: 10px; right: 12px; width: 30px; height: 30px; border-radius: 50%; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.success}66; font-size: 16px; line-height: 30px; text-align: center; }
  .rs-card.flip .rs-goal { animation: sg-pop 0.4s cubic-bezier(.34,1.6,.4,1) 0.35s both; }
  .rs-ic { font-size: 26px; line-height: 1; }
  .rs-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3}; }
  .rs-lbl.ok { color: ${T.success}; }
  .rs-was { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink2}; padding-right: 34px; }
  .rs-t { font-family: 'Source Serif 4', serif; font-size: clamp(15.5px,1.9vw,18px); line-height: 1.35; color: ${T.ink}; }
  .rs-back .rs-t { font-weight: 600; font-size: clamp(16.5px,2vw,19px); }
  .rs-cue { margin-top: auto; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 4px 11px; }
  .rs-card.turn-ring::after { border-radius: 16px; }
  @media (prefers-reduced-motion: reduce) { .rs-in, .rs-flip { transition: none; } .rs-card:hover .rs-in { transform: none; } .rs-card.flip .rs-in, .rs-card.flip:hover .rs-in { transform: rotateY(180deg); } .rs-card:hover .rs-flip { transform: none; } .rs-card.flip .rs-goal { animation: none; } }

  .cq-step { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
  .col:has(> .cq-step), .lesson-root .screen.dense .col:has(> .cq-step) { gap: 8px; } /* QA: to'rt savol to'lganda 1280×800 skrollsiz (.dense ham 10px ga kattalashtirmasin) */
  .cq-step .pw-f input { padding-top: 10px; padding-bottom: 10px; }
  .cq-q { font-family: 'Manrope'; font-weight: 800; font-size: 14px; }
  .cq-two { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 10px; }
  /* Qachon · Nimasi og'ir telefonda ham yonma-yon (gap-qolipi bir qarashda ko'rinsin, ekran qisqaradi); juda tor ekrandagina ustma-ust */
  @media (max-width: 340px) { .cq-two { grid-template-columns: 1fr; } }
  @media (max-width: 640px) { .cq-two .pw-f input { padding-left: 10px; padding-right: 8px; font-size: 14px; } .ai-fb-q.ai-fb-q { font-size: 15.5px; padding: 9px 12px; } }
  /* To'rt savolli karta (2 · 14 · 16-ekran): indeks-karta, har qator o'z slot-rangida — KIM ko'k · MUAMMO indigo · NIMA QILADI amber · NATIJA yashil */
  .cq-card { position: relative; display: flex; flex-direction: column; gap: 8px; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: inset 0 0 0 1px ${T.line}, 0 10px 24px -14px rgba(${T.shadowBase},0.34); transition: box-shadow 0.3s, border-color 0.3s; }
  .cq-h { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; min-height: 28px; }
  .cq-card.saved { box-shadow: inset 0 0 0 1.5px ${T.success}55, 0 0 0 5px ${T.success}14, 0 12px 26px -14px rgba(18,169,104,0.4); animation: gb-pop 0.4s cubic-bezier(.34,1.6,.4,1); }
  .cq-row { --slot: ${T.ink3}; --slotSoft: ${T.bg}; display: flex; flex-direction: column; gap: 2px; min-width: 0; padding: 7px 10px; border-radius: 10px; background: ${T.bg}; box-shadow: none; transition: background 0.25s, box-shadow 0.25s; }
  .cq-row.kim { --slot: ${T.blue}; --slotSoft: ${T.blueSoft}; } .cq-row.muammo { --slot: ${T.accent}; --slotSoft: ${T.accentSoft}; } .cq-row.qiladi { --slot: #B77A16; --slotSoft: #FBEED6; } .cq-row.erishadi { --slot: ${T.success}; --slotSoft: ${T.successSoft}; }
  .cq-row.on { background: var(--slotSoft); box-shadow: none; }
  .cq-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.04em; color: var(--slot); }
  .cq-val { font-family: 'Source Serif 4', serif; font-size: 15px; line-height: 1.4; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .ideas .idea { min-width: 0; overflow-wrap: anywhere; }
  @media (prefers-reduced-motion: reduce) { .cq-row, .cq-card { transition: none; } .cq-card.saved { animation: none; } }
  /* 14-ekran UZUN JAVOB (58-qonun, QA 25.09): har maydonga 120 belgigacha yoziladi — matn qisqarmaydi, karta VIZUAL zichlashadi.
     Zichlik darajasini useCardFit o'lchab, split'ga data-fit qilib qo'yadi: karta o'ng ustunga sig'maguncha 0 → 1 → 2 → 3.
     1 — o'ng ustun kengayadi (900px dan; chap maydonlar bir qatorli, uzun javob maydon ichida suriladi), shrift 15px qoladi;
     2 — 14px, qator va karta oraliqlari ixchamroq; 3 — 13px, eng ixcham oraliq (probelsiz 118 belgi ham sig'adi).
     Kafolat-qatlam: o'ng ustun qatorga bo'y bermaydi (contain: size) va ekrandagi bo'sh joyni oladi — sahifa aylanmaydi;
     g'ayrioddiy keng harfli matnda (beshala maydonda 120 tadan «W») faqat kartaning o'zi ichida aylanadi.
     Telefonda (760px gacha) oddiy oqim, sahifa aylanishi normal. */
  @media (min-width: 761px) {
    .lesson-root .screen.cq-screen > .cq-split { flex: 1 0 auto; align-items: stretch; }
    .cq-split > .col:last-child { contain: size; }
    .cq-split > .col:last-child > .cq-card, .cq-split > .col:last-child > .ideas { flex: 0 1 auto; min-height: 0; overflow-y: auto; scrollbar-width: thin; }
    .cq-split[data-fit="2"] .cq-card { gap: 6px; padding: 12px 15px; }
    .cq-split[data-fit="2"] .cq-row { padding: 6px 10px; gap: 1px; }
    .cq-split[data-fit="2"] .cq-val { font-size: 14px; line-height: 1.36; }
    .cq-split[data-fit="3"] .cq-card { gap: 4px; padding: 9px 13px; }
    .cq-split[data-fit="3"] .cq-row { padding: 4px 9px; gap: 0; }
    .cq-split[data-fit="3"] .cq-val { font-size: 13px; line-height: 1.26; }
    .cq-split[data-fit="3"] .cq-lbl { font-size: 10.5px; line-height: 1.25; }
    .cq-split[data-fit="2"] .cq-h, .cq-split[data-fit="3"] .cq-h { min-height: 24px; }
    .cq-split[data-fit="2"] .cq-h .done-mini, .cq-split[data-fit="3"] .cq-h .done-mini { padding: 4px 12px; font-size: 12.5px; }
  }
  /* 1-daraja: o'ng ustun kengayadi. Chap ustun 356px dan toraymaydi — «Tayyor g'oyadan tanlash» + «Saqlash» bir qatorda (RU 351px).
     Faqat 900px dan: torroq oynada shu chegara o'ng ustunni kengaytirish o'rniga toraytirardi (761px: 309 → 261px). */
  @media (min-width: 900px) {
    .cq-split[data-fit="1"], .cq-split[data-fit="2"], .cq-split[data-fit="3"] { grid-template-columns: minmax(356px,3fr) minmax(0,5fr); gap: 24px; }
  }

  .ck-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
  @media (max-width: 860px) { .ck-grid { grid-template-columns: 1fr; } }
  .ck-card { display: flex; flex-direction: column; gap: 10px; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.3); }
  .ck-card.ok { box-shadow: inset 0 0 0 1.5px ${T.success}66, 0 10px 24px -14px rgba(18,169,104,0.35); }
  .ck-t.ck-t { margin: 0; font-family: 'Source Serif 4', serif; font-size: clamp(15.5px,1.9vw,18px); line-height: 1.4; color: ${T.ink}; overflow-wrap: anywhere; }
  .ck-opts { display: flex; flex-direction: column; gap: 7px; }
  .ck-opts .gb-opt { width: 100%; }
  .ck-card.turn-ring::after { border-radius: 16px; }
  .ic-lbl.erishadi { color: ${T.success}; }

  .ai-fb { display: flex; flex-direction: column; gap: 10px; }
  .ai-fb-q.ai-fb-q { margin: 0; display: flex; gap: 10px; align-items: flex-start; font-family: 'Source Serif 4', serif; font-size: clamp(17px,2.2vw,21px); line-height: 1.35; color: ${T.ink}; background: ${T.bg}; border-radius: 12px; padding: 12px 14px; overflow-wrap: anywhere; }

  /* ===== F-0924 DIZAYN (B4, pilot naqshi) — Zoomable · ustun-yorlig'i · zich ekran · binafsha xato · ixcham telefon ===== */
  .zoomable { position: relative; min-width: 0; }
  .zoom-btn { position: absolute; top: 4px; right: 4px; z-index: 6; width: 26px; height: 26px; border-radius: 8px; border: none; background: rgba(255,255,255,0.86); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
  .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
  .zoomable.zsplit > .zoom-btn { top: -11px; right: 0; }
  .zoom-on.zsplit > .zoom-btn, .zoom-on > .zoom-btn { top: 10px; right: 10px; }
  .zoom-backdrop { position: fixed; inset: 0; background: rgba(27,22,48,0.55); z-index: 1000; animation: fade-op 0.25s ease; }
  .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(960px,94vw); max-height: calc(92vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.bg}; border-radius: 18px; padding: clamp(20px,3.4vw,38px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
  .zoom-on .uz-phone { zoom: 1.3; }
  .zoom-on:not(.zsplit) { width: min(560px,94vw); display: flex; justify-content: center; }
  @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
  @keyframes fade-op { from { opacity: 0; } to { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .zoom-on, .zoom-backdrop { animation: none !important; } .zoom-btn:hover { transform: none; } }
  .flow-label.fl-col { margin: 0 0 -4px; font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; padding-right: 40px; }
  /* ZICH EKRAN (58-qonun; pilot 3-band): 1280x800 + TopBar bitta ekranga sig'adi. Matn qisqarmaydi — faqat oraliq,
     sarlavha o'lchami va ramka ichki bo'shlig'i. Modifikator .dense ekran-o'ramiga qo'yiladi. */
  @media (min-width: 761px) {
    .lesson-root .screen.dense { gap: 12px !important; }
    .lesson-root .stage-content:has(> .screen.dense) { padding-bottom: 14px; }
    .lesson-root .screen.dense .h-title { font-size: clamp(22px,2.6vw,31px); }
    .lesson-root .screen.dense .head { gap: 4px; }
    .lesson-root .screen.dense .col { gap: 10px; }
    .lesson-root .screen.dense .frame-success, .lesson-root .screen.dense .frame-soft { padding: 11px 16px; }
    .lesson-root .screen.dense .mentor-msg { padding: 10px 15px; }
    /* F-0925-B02: mentor pufagi pastdagi blokka yopishib turmasin — 12px oraliq ustiga +8px (jami 20px) */
    .lesson-root .screen.dense > .mentor { margin-bottom: 8px; }
    /* 3-ekran: odam-kartalari ixcham */
    .lesson-root .screen.dense .person { padding: 11px 16px; }
    .split.uz-split { grid-template-columns: minmax(0,1.18fr) minmax(0,0.82fr); }
    /* 9-ekran: ro'yxat qatorlari ixcham */
    .lesson-root .screen.dense .ta-item { padding: 8px 12px; }
    /* 5-ekran: belgilar kartasi ixcham, ustun-yorlig'i yuqori qatorda */
    .lesson-root .sg-screen .sg-card { padding-top: 12px; padding-bottom: 12px; row-gap: 6px; }
    .lesson-root .sg-screen .sg-ic { width: 40px; height: 40px; }
    /* 6-ekran: bashorat-bloki va voqea-slaydi ixcham */
    .kp-screen .kp-bet:not(.done) { padding: 22px 28px 18px; gap: 11px; }
    .kp-screen .kp-bet.done { padding: 14px 18px 12px; }
    .kp-screen .k-slide.ph { padding: 18px 26px; min-height: 180px; }
    /* 8-ekran: hikoya-kartasi ixcham */
    .gb-screen .gb-lead { padding: 11px 16px !important; }
    .gb-screen .gb-lead .tq-story { font-size: clamp(16px,1.7vw,19px); line-height: 1.45; }
    .gb-screen .gb-rows { gap: 7px; }
    .gb-screen .gb-row { padding-top: 7px; padding-bottom: 7px; }
    /* 16-ekran: so'rov qutisi ichida aylanadi (F-0924-01), 🛟 ochilsa ixcham oynaga yig'iladi (B5 naqshi, 58-qonun) */
    .ai-screen .pr-body { max-height: min(15vh, 104px); }
    .ai-screen .ais:has(.dsx-fb[open]) .pr-body { max-height: 40px; padding-top: 6px; padding-bottom: 6px; }
    .ai-screen .ais:has(.dsx-fb[open]) .ais-link { padding: 5px 12px; }
    .ai-screen .ais:has(.dsx-fb[open]) .pr-copy { padding: 6px 14px; }
    .ai-screen .dsx-fb[open] > summary { margin-bottom: 6px; }
    .ai-screen .ais:has(.dsx-fb[open]) .ais-steps { gap: 4px; }
    .ai-screen .ais:has(.dsx-fb[open]) .ais-row { padding-top: 4px; padding-bottom: 4px; }
    .ai-screen .ai-fb { gap: 6px; }
    .ai-screen .ai-fb-q.ai-fb-q { font-size: clamp(15px,1.4vw,16px); padding: 6px 12px; }
    .ai-screen .cq-card { gap: 6px; padding: 12px 15px; }
  }
  /* 8-ekran: uchala bo'lak topilgach qatorlar 3 ustunga yig'iladi (yorliq tepada, chip ostida) */
  @media (min-width: 761px) {
    .gb-rows.all-ok { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; }
    .gb-rows.all-ok .gb-row { grid-template-columns: 1fr; gap: 6px; }
  }
  /* XATO VARIANT — PmLesson2 binafshasi (pilot 1-band). Qizil faqat haqiqiy xato va mentor-statistikada. */
  .kp-chip.wrong.wrong { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 2px ${T.accent}; }
  .kp-chip.wrong.wrong:hover { box-shadow: inset 0 0 0 2px ${T.accent}; }
  .kp-bet.done { flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: center; gap: 10px; padding: 16px 20px 14px; }
  .kp-bet.done > .k-slide-eyebrow, .kp-bet.done > .kp-ask, .kp-bet.done .kp-chip.locked:not(.correct):not(.wrong) { display: none; }
  .kp-bet.done .kp-chips { display: contents; }
  .kp-bet.done .kp-chip.locked.wrong { display: inline-flex; opacity: 1; }
  .kp-bet.done .kp-chip { font-size: clamp(13px,1.5vw,14px); padding: 8px 14px; }
  .kp-res.kp-res.miss { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; box-shadow: none; }
  /* 6-ekran: emoji-ustun tor (B2 qiymati) — matn ustuni kengayadi */
  .k-slide.ph.ph { grid-template-columns: minmax(130px,0.5fr) minmax(0,1.7fr); }
  .gb-opt.bad.bad { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .gb-bad.gb-bad { color: ${T.accent}; }
  .gb-fill.bad.bad { text-decoration-color: ${T.accent}88; }

  /* ===== UZUM-TELEFON — ixcham tovar sahifasi (split ichida, ~330px) ===== */
  .uz-phone.uz-phone { gap: 6px; border-radius: 30px; padding: 8px 11px 11px; }
  .uz-phone .uz-status { height: 16px; }
  .uz-phone .uz-notch { top: 4px; }
  .uz-phone .uz-row { min-height: 34px; padding-top: 5px; padding-bottom: 5px; }
  .uz-prod { display: grid; grid-template-columns: 88px minmax(0,1fr); gap: 10px; align-items: stretch; min-width: 0; }
  .uz-prod .uz-img { height: 78px; border-radius: 14px; transition: box-shadow 0.25s; }
  .uz-prod .uz-dev { width: 28px; height: 48px; border-radius: 7px; transform: translateY(-3px); }
  .uz-prod .uz-dev i { left: 3px; right: 3px; top: 5px; bottom: 5px; border-radius: 4px; }
  .uz-prod .uz-heart { top: 5px; right: 5px; width: 20px; height: 20px; line-height: 20px; font-size: 11px; }
  .uz-prod .uz-dots { bottom: 5px; }
  .uz-info { display: flex; flex-direction: column; justify-content: center; gap: 3px; min-width: 0; border-radius: 12px; padding: 4px 8px; margin-left: -6px; transition: background 0.25s, box-shadow 0.25s; }
  .uz-name { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; color: ${T.ink}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .uz-info .uz-sum { font-size: 14.5px; }
  .uz-rev { font-family: 'Source Serif 4', serif; font-style: italic; font-size: 12px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .uz-img.lit, .uz-info.lit { background-color: ${T.successSoft}; box-shadow: inset 0 0 0 2px ${T.success}, 0 0 0 4px ${T.success}1F; animation: uz-lit 0.45s cubic-bezier(.34,1.6,.4,1); }
  .uz-img.lit { background-image: none; }
  .uz-phone .uz-cart { position: relative; height: 34px; background: ${T.ink}; box-shadow: 0 8px 16px -10px rgba(${T.shadowBase},0.7); }
  .uz-badge { position: absolute; top: -7px; right: calc(50% - 62px); min-width: 20px; height: 20px; border-radius: 99px; padding: 0 5px; background: ${T.success}; color: #fff; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-style: normal; font-weight: 800; font-size: 11px; line-height: 20px; text-align: center; box-shadow: 0 0 0 2px ${T.paper}; }
  /* HOOK IMZO-HARAKATI: tovar rasmdan savatga tushadi → savatda «1» → «Yetkazish: ertaga» yonadi (5,2 s halqa) */
  .uz-fly { position: absolute; z-index: 3; top: 34%; left: 17%; width: 22px; height: 36px; margin: -18px 0 0 -11px; border-radius: 6px; background: linear-gradient(160deg, ${T.ink2}, ${T.ink}); box-shadow: 0 8px 16px -6px rgba(${T.shadowBase},0.6); opacity: 0; pointer-events: none; animation: uz-fly 5.2s cubic-bezier(.5,0,.6,1) 0.9s infinite; }
  .uz-fly i { position: absolute; left: 3px; right: 3px; top: 4px; bottom: 4px; border-radius: 3px; background: linear-gradient(160deg, ${T.accentVivid}, ${T.blue}); }
  .uz-phone.fx .uz-badge { opacity: 0; animation: uz-badge 5.2s ease-out 0.9s infinite; }
  .uz-phone.fx .uz-cart { animation: uz-cart 5.2s ease-out 0.9s infinite; }
  .uz-phone.fx .uz-deliv { animation: uz-deliv 5.2s ease-out 0.9s infinite; }
  .uz-phone.fx-done .uz-fly { animation: none; opacity: 0; }
  .uz-phone.fx-done .uz-badge { animation: none; opacity: 1; }
  .uz-phone.fx-done .uz-cart, .uz-phone.fx-done .uz-deliv { animation: none; }
  @keyframes uz-fly { 0%, 8% { opacity: 0; top: 34%; left: 17%; transform: scale(0.6); } 14% { opacity: 1; transform: scale(1.05); } 46% { opacity: 1; top: 89%; left: 50%; transform: scale(0.55); } 52%, 100% { opacity: 0; top: 90%; left: 50%; transform: scale(0.4); } }
  @keyframes uz-badge { 0%, 48% { opacity: 0; transform: scale(0); } 54% { opacity: 1; transform: scale(1.3); } 60%, 90% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1); } }
  @keyframes uz-cart { 0%, 47% { transform: none; } 51% { transform: scale(1.05); } 56%, 100% { transform: none; } }
  @keyframes uz-deliv { 0%, 56% { background: ${T.bg}; box-shadow: none; } 62%, 84% { background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}88; } 92%, 100% { background: ${T.bg}; box-shadow: none; } }
  @media (prefers-reduced-motion: reduce) { .uz-fly { display: none; } .uz-phone.fx .uz-badge { animation: none; opacity: 1; } .uz-phone.fx .uz-cart, .uz-phone.fx .uz-deliv, .uz-img.lit, .uz-info.lit { animation: none; } }
  /* backwards (both emas): kirish tugagach sahna stacking-kontekst yaratmaydi — ⛶ oynasi o'ng ustun ustida turadi */
  .hk-in { animation: fade-op 0.45s ease-out 0.12s backwards; }
  @media (max-width: 760px) { .hk-scene .uz-rate, .hk-scene .uz-pick { display: none; } } /* telefonda variantlar tezroq ko'rinsin — hookda ishlatilmaydigan ikki qator yashiriladi */
  @media (prefers-reduced-motion: reduce) { .hk-in { animation: none; } }
  .hk-scene .zoomable { display: inline-flex; }
  .hk-scene .zoomable:not(.zoom-on) > .zoom-btn { top: 0; right: -34px; }
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
