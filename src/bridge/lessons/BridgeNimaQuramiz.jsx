import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, createContext, useContext, useCallback } from 'react';
import { cardRead, cardWrite, READY_IDEAS } from '../bridgeCard.js';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// O'TISH (BRIDGE) DARSLARI · 3- VA 4-O'TISH 2-DARSI — «NIMA QURAMIZ VA QACHON TAYYOR?»
// Senariy-manba: pm-senariylar/BRIDGE-B5-NimaQuramiz.md (GATE S tasdiqlangan, 2026-09-23; ikki fidbek kiritilgan).
// Mavzu: User Story (kim · nimani xohlaydi · nima uchun) · Dekompozitsiya va birinchi versiya (MVP) ·
//        Prioritet (ikki savol, to'rt katak) · Qabul shartlari («ishlaydi» ↔ «tayyor»).
// Misol-ip: o'zimizning taksi ilovamiz (sxemalar brendsiz; Yandex Go faqat 5-ekranda taqqoslash namunasi).
// Keys: Instagram (Burbn) — 2-o'tish 3-darsi bilan bir xil matn, sana va 25 000 raqami YO'Q.
// Artefakt: o'quvchining g'oya-kartasi (bridgeCard.js) — hikoya · 4 bo'lak · birinchi bo'lak + sabab · 3 shart.
// INFRA MANBAI: src/bridge/lessons/BridgeMuammoniTopamiz.jsx (to'liq zanjirdan o'tgan bridge-namuna; u P0 dan) —
//        Stage/NavNext/QuestionScreen/MentorTestStats/RecapOverlay/Mentor/MentorNote/PRACTICE_BASE/nishonlar/
//        Podium/CodeStrike arena/progress/--bo layout — FAQAT infra ko'chirilgan.
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
// NIMA-slot (qolip semantikasi: KIM ko'k · NIMA amber · NATIJA yashil) — bridge-darslardagi AMBER oilasi (B3 bilan bir xil).
const AMBER = '#B77A16';
const AMBER_SOFT = '#FBF1DE';
const AMBER_LINE = '#E8A13A';

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
const LESSON_META = { lessonId: 'bridge-b5-v1', lessonTitle: { uz: 'Nima quramiz va qachon tayyor?', ru: 'Что строим и когда готово?' } };
// Ekran-tartib = senariy 3-bo'lim (20 ekran = 20 sahifa; 20-ekranda Arena + Yakun bitta sahifada — CodeStrike yakun ichida).
// Ballik testlar: s4 · s7 · s9 · s11 (har biri o'z blokidan keyin).
const SCREEN_META = [
  { id: 'hook',     type: 'hook',        template: 'custom', scored: false, scope: 'hook' },         // 0  · 1-ekran
  { id: 'maqsad',   type: 'rule',        template: 'custom', scored: false, scope: null },           // 1  · 2
  { id: 'qism',     type: 'exploration', template: 'custom', scored: false, scope: null },           // 2  · 3 uch qism
  { id: 's4',       type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 3  · 4 TEST-1
  { id: 'bolak',    type: 'exploration', template: 'custom', scored: false, scope: null },           // 4  · 5 bo'laklaymiz
  { id: 'keys',     type: 'case',        template: 'custom', scored: false, scope: null },           // 5  · 6 Instagram
  { id: 's7',       type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 6  · 7 TEST-2
  { id: 'katak',    type: 'exploration', template: 'custom', scored: false, scope: null },           // 7  · 8 to'rt katak
  { id: 's9',       type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 8  · 9 TEST-3
  { id: 'oyna',     type: 'exploration', template: 'custom', scored: false, scope: null },           // 9  · 10 buyurtma oynasi
  { id: 's11',      type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' }, // 10 · 11 TEST-4
  { id: 'tartib',   type: 'exploration', template: 'custom', scored: false, scope: null },           // 11 · 12 besh qadam
  { id: 'hikoya',   type: 'practice',    template: 'custom', scored: false, scope: null },           // 12 · 13 ustaxona
  { id: 'bolaklar', type: 'practice',    template: 'custom', scored: false, scope: null },           // 13 · 14 ustaxona
  { id: 'shart',    type: 'practice',    template: 'custom', scored: false, scope: null },           // 14 · 15 ustaxona
  { id: 'ai',       type: 'practice',    template: 'custom', scored: false, scope: null },           // 15 · 16
  { id: 'sherik',   type: 'practice',    template: 'custom', scored: false, scope: null },           // 16 · 17
  { id: 'podium',   type: 'stats',       template: 'custom', scored: false, scope: null },           // 17 · 18
  { id: 'flash',    type: 'review',      template: 'custom', scored: false, scope: null },           // 18 · 19
  { id: 'yakun',    type: 'summary',     template: 'custom', scored: false, scope: null }            // 19 · 20 Arena + Yakun
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// SCREEN_INTENTS — har ekran nima uchun bor: bola nima QILADI yoki nima BILADI (render qilinmaydi).
export const SCREEN_INTENTS = {
  hook: "Bola ikki topshiriqni solishtirib, dasturchiga kim uchun va nima uchun kerakligi aytilgani ko'proq yordam berishini biladi",
  maqsad: "Bola dars oxirida hikoya → bo'laklar → birinchisi → uch shart ketma-ketligini qurishini oldindan ko'radi",
  qism: "Bola kim · nimani xohlaydi · nima uchun qismlarini qolipga qo'yib, «foydalanuvchi hikoyasi» atamasini oladi",
  s4: "Bola uchala qismi bor hikoyani topadi",
  bolak: "Bola taksi ilovasini olti bo'lakka ajratib, «dekompozitsiya» atamasini oladi",
  keys: "Bola Burbn'dan odamlarga yoqqan narsa qolganini bashorat qilib, «birinchi versiya (MVP)» atamasini oladi",
  s7: "Bola taksi ilovasining birinchi versiyasiga asosiy foydani beradigan bitta bo'lak yetishini topadi",
  katak: "Bola olti bo'lakni ikki savol bo'yicha to'rt katakka joylab, «prioritet belgilash» atamasini oladi",
  s9: "Bola kam odamga kerak va uzoq quriladigan bo'lak «Hozircha keyinroq» katagiga tushishini topadi",
  oyna: "Bola buyurtma oynasini to'rt shart bo'yicha tekshirib, «ishlaydi» va «tayyor» farqini hamda «qabul shartlari» atamasini oladi",
  s11: "Bola aniq tekshiriladigan shartni noaniq so'zli shartlardan ajratadi",
  tartib: "Bola besh qadamni tartiblab, shartlar ishdan oldin yozilishini biladi",
  hikoya: "Bola kartasiga qarab o'z g'oyasiga bitta hikoya yozadi",
  bolaklar: "Bola g'oyasini 4 bo'lakka ajratib, har biriga ikki javob beradi va birinchi bo'lakni sababi bilan tanlaydi",
  shart: "Bola birinchi bo'lagiga uchta tekshiriladigan shart yozadi",
  ai: "Bola AI yordamida shartlarida yetishmagan holatni topib, to'rtinchi shartni o'zi yozadi",
  sherik: "Bola birinchi bo'lagi va shartini sherigiga aytadi, sherigi qanday tekshirishini bir qatorda yozadi",
  podium: "Bola testlardagi natijasini (jonlida — sinf reytingini) ko'radi",
  flash: "Bola beshta karta bilan darsning asosiy fikrlarini takrorlaydi",
  yakun: "Bola CodeStrike arenasida 12 savolga javob beradi, darsning to'rt natijasini ko'rib, darsni yakunlaydi"
};


const Col = ({ children, gap }) => <div className="col" style={gap ? { gap } : undefined}>{children}</div>;
// ⛶ Kattalashtirish (PmLesson2 Zoomable naqshi, pilot B1 / B3) — asosiy maketni proyektorda katta ko'rsatish; holat saqlanadi.
// fade-up transform ichiga qo'yilmaydi (position: fixed transformli ota ichida ishlamaydi).
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
// Ustun-yorlig'i (pilot naqshi 10-band): «NIMA — NIMA QILASIZ», ≤6 so'z; o'ng uchida ixtiyoriy holat/progress.
// F-0925-B12/B14: bo'sh yozish maydonida «…» o'rniga aniq chorlov — bola bu yerga yozish kerakligini ko'radi.
const WRITE_PH = { uz: 'Shu yerga yozing…', ru: 'Напишите здесь…' };
const FlowLabel = ({ children, end }) => <p className="flow-label fl-row"><span>{children}</span>{end != null && <b className="fl-end">{end}</b>}</p>;

// 🔴 MENTOR EKRANIDA KO'RSATILMAYDI (90-qonun · 1-D jadvali): nishon — QURILMAGA xos, shaxsiy
// hisob. Proyektorda u mentorning o'z bosishlarini sanaydi, sinf ishini emas — yolg'on son.
// Tamoyil: mentor ekrani = SAHNA (lahzalar), o'quvchi qurilmasi = DAFTAR (hisob).
// To'liq-ekran bayram (AchCelebrate) ham mentorda chiqmaydi — 1-D jadvali, F-0729-06 («bor» BEKOR); ildizda live.mode !== 'mentor' sharti.
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

// Ballik ekranlar javob kaliti — Jonli TASDIQLAYDI. ✓ pozitsiyalari aralash (s4=1 · s7=3 · s9=0 · s11=2);
// QuestionScreen'dagi correctIdx shu qiymatlardan olinadi (bitta manba). practice = ishtirok-kalit (-1).
const INLINE_KEYS = { s4: 1, s7: 3, s9: 0, s11: 2, practice: -1 };
// Qayta tushuntirish — kalit = ballik ekran indeksi (3/6/8/10). Matn senariy ekranlaridan olingan (Metodist sayqallaydi).
const RECAPS = {
  3: {
    title: { uz: 'Hikoyaning uch qismi', ru: 'Три части истории' },
    cards: [
      { ic: '🙋', h: { uz: 'Kim?', ru: 'Кто?' }, body: { uz: <>Hikoya bitta odam nomidan yoziladi: <b>«kechqurun to'garakdan qaytadigan o'quvchi»</b>.</>, ru: <>История пишется от имени одного человека: <b>«ученик, который вечером возвращается с кружка»</b>.</> } },
      { ic: '🎯', h: { uz: 'Nimani xohlaydi?', ru: 'Чего хочет?' }, body: { uz: <>Odam ilovadan nimani kutadi: <b>«mashina qayerdaligini xaritada ko'rish»</b>.</>, ru: <>Чего человек ждёт от приложения: <b>«видеть машину на карте»</b>.</> } },
      { ic: '💡', h: { uz: 'Nima uchun?', ru: 'Зачем?' }, body: { uz: <>«Nima uchun» qismi dasturchiga bu imkoniyat odamga <b>qanday foyda</b> berishini tushuntiradi: «ko'chada kutib qolmaslik».</>, ru: <>Часть «зачем» объясняет разработчику, <b>какую пользу</b> эта возможность даёт человеку: «не ждать на улице».</> } },
    ]
  },
  6: {
    title: { uz: 'Birinchi versiya', ru: 'Первая версия' },
    cards: [
      { ic: '🧩', h: { uz: "Bo'laklarga bo'lamiz", ru: 'Разбиваем на части' }, body: { uz: <>Katta ilovani bitta ulkan ish sifatida boshqarish qiyin. Har bo'lakni <b>alohida qurish va tekshirish</b> osonroq.</>, ru: <>Большим приложением трудно управлять как одной огромной работой. Каждую часть проще <b>отдельно построить и проверить</b>.</> } },
      { ic: '📷', h: { uz: 'Instagram — uchta narsa', ru: 'Instagram — три вещи' }, body: { uz: <>Instagram birinchi kuni <b>surat, filtr va izoh</b> bilan chiqdi — hamma narsa bilan emas.</>, ru: <>В первый день Instagram вышел с <b>фото, фильтрами и комментариями</b> — а не со всем сразу.</> } },
      { ic: '🚕', h: { uz: 'Asosiy foyda', ru: 'Главная польза' }, body: { uz: <>Birinchi versiya — odamga <b>asosiy foydani</b> beradigan va g'oyani sinab ko'rishga yetadigan eng kichik mahsulot.</>, ru: <>Первая версия — самый маленький продукт, который даёт человеку <b>главную пользу</b> и которого хватает, чтобы проверить идею.</> } },
    ]
  },
  8: {
    title: { uz: "Ikki savol, to'rt katak", ru: 'Два вопроса, четыре клетки' },
    cards: [
      { ic: '👥', h: { uz: 'Nechta odamga kerak?', ru: 'Скольким людям нужно?' }, body: { uz: <>Birinchi savol: bu bo'lak <b>ko'p odamga</b> kerakmi yoki kam odamga?</>, ru: <>Первый вопрос: эта часть нужна <b>многим</b> или немногим?</> } },
      { ic: '⏱', h: { uz: 'Qancha vaqt oladi?', ru: 'Сколько времени займёт?' }, body: { uz: <>Ikkinchi savol: bu mashqda bir haftagacha — <b>«tez»</b>, bir haftadan ko'p — <b>«uzoq»</b>.</>, ru: <>Второй вопрос: в этом упражнении до недели — <b>«быстро»</b>, больше недели — <b>«долго»</b>.</> } },
      { ic: '🎯', h: { uz: "To'rt katak", ru: 'Четыре клетки' }, body: { uz: <>🎯 Avval qilinadi (ko'p · tez) · 🏔 Rejaga tushadi (ko'p · uzoq) · 🌱 Vaqt bo'lsa (kam · tez) · ⏳ <b>Hozircha keyinroq</b> (kam · uzoq).</>, ru: <>🎯 Делаем первым (много · быстро) · 🏔 Идёт в план (много · долго) · 🌱 Если будет время (мало · быстро) · ⏳ <b>Пока позже</b> (мало · долго).</> } },
    ]
  },
  10: {
    title: { uz: '«Ishlaydi» va «tayyor»', ru: '«Работает» и «готово»' },
    cards: [
      { ic: '▶️', h: { uz: 'Ishlaydi', ru: 'Работает' }, body: { uz: <>Biror holatda <b>to'g'ri natija</b> berdi.</>, ru: <>В каком-то случае дало <b>верный результат</b>.</> } },
      { ic: '✅', h: { uz: 'Tayyor', ru: 'Готово' }, body: { uz: <>Oldindan kelishilgan <b>hamma shart</b> bajarildi va muhim holatlar tekshirildi.</>, ru: <>Выполнены <b>все заранее согласованные условия</b> и проверены важные случаи.</> } },
      { ic: '🔎', h: { uz: 'Aniq shart', ru: 'Точное условие' }, body: { uz: <>«Chiroyli», «qisqa», «qulay» — har kim har xil tushunadi. Shartda <b>nima qilinishi va nima bo'lishi</b> yoki aniq son yozilsin: «kutish 5 daqiqadan oshmaydi».</>, ru: <>«Красиво», «недолго», «удобно» каждый понимает по-своему. В условии пишите, <b>что делают и что получается</b>, или точное число: «ожидание не дольше 5 минут».</> } },
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
// JOYI — pastki navigatsiya doki (nav-mdock), mentor «Kim bajardi» paneli bilan bir o'rinda (tekshiruvchi 25.09, D1, 58-qonun):
// mazmun ichida chip 13/14/16-ekranda maslahat chiqqan holatda pastki chiziq ostiga tushib qirqilardi yoki umuman
// ko'rinmasdi (1280x800 da 17–59px aylantirish). Dokda u doim ko'rinadi va ekran balandligini olmaydi.
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
const clean = (s) => (typeof s === 'string' ? s : '').trim(); // F-0915-02: kartadan kelgan satr bo'lmagan qiymat yiqitmasin
const str = (v) => (typeof v === 'string' ? v : ''); // F-0915-02: saqlangan maydon satr bo'lmasa — bo'sh (input value'ga obyekt tushmasin)
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
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
// ===== 1-EKRAN — HOOK: ikki topshiriq, ovoz berish (ikkala tanlovga bir xil javob, §119) + jonli sinf-diagrammasi =====
// Ikkinchi karta — 3-ekranda yig'iladigan gapning AYNAN o'zi (ip). Karta-yorliqlari yo'q: atama 3-ekrandan oldin chiqmaydi.
const HOOK_OPTS = [
  { uz: "Xaritaga mashinani qo'shing.", ru: 'Добавьте машину на карту.' },
  { uz: "Men kechqurun to'garakdan qaytadigan o'quvchi sifatida, mashina qayerdaligini xaritada ko'rishni xohlayman — ko'chada kutib qolmaslik uchun.", ru: 'Я, как ученик, который вечером возвращается с кружка, хочу видеть машину на карте — чтобы не ждать на улице.' },
];
const HOOK_SHORT = [{ uz: '1-topshiriq', ru: 'Задание 1' }, { uz: '2-topshiriq', ru: 'Задание 2' }];
// HOOK imzo-sahnasi — «dasturchining savol-jadvali»: uchta savol (nima qurish · kim uchun · nima uchun) × ikki topshiriq.
// FAQAT OVOZDAN KEYIN chiqadi (tekshiruvchi 25.09, D2): ilgari jadval ovozgacha ham turardi — savol-qatorlari baholash
// mezonini oldindan ochib qo'yardi (bola kartalarni o'qimasdan javobni topardi, 97/98b), ekrandagi eng katta blok bo'lib
// vazifani (ikki karta) fonga surardi va cheksiz «skaner nuri» navbat-pulsi bilan raqobatlashardi. Endi ovozgacha faqat ikki
// karta; ovozdan keyin kartalar ostida jadval + xulosa (xulosa-vizual). Ikki topshiriq ustun-ustun «o'qiladi»: javobi bor
// katakka ✓, yo'g'iga «?» (xato emas — ma'lumot yetmaydi, shuning uchun indigo-yumshoq), pastda 1/3 va 3/3. Harakat bir
// martalik (pop + ikki marta «yelka qisish»), cheksiz animatsiya yo'q. Reduced-motion: pop o'chadi.
const HOOK_Q = [
  { k: 'nima', ic: '🛠', q: { uz: 'Nima qurish kerak?', ru: 'Что построить?' }, has: [true, true] },
  { k: 'kim', ic: '👤', q: { uz: 'Kim uchun?', ru: 'Для кого?' }, has: [false, true] },
  { k: 'why', ic: '🎯', q: { uz: 'Nima uchun kerak?', ru: 'Зачем это нужно?' }, has: [false, true] },
];
const HookDesk = ({ picked = null }) => (
  <div className="hd fade-step" aria-hidden="true">
    <div className="hd-tab">
      <span className="hd-hq">💻 {tr({ uz: 'Dasturchi bilishi kerak', ru: 'Разработчику нужно знать' })}</span>
      {[0, 1].map(c => <span key={c} className={`hd-hn${picked === c ? ' me' : ''}`}>📨 {c + 1}</span>)}
      {HOOK_Q.map((r, j) => (
        <React.Fragment key={r.k}>
          <span className={`hd-q ${r.k}`}><i>{r.ic}</i>{tr(r.q)}</span>
          {[0, 1].map(c => (
            <span key={c} className={`hd-c ${r.has[c] ? 'yes' : 'no'}${picked === c ? ' me' : ''}`} style={{ '--d': `${0.2 + c * 0.6 + j * 0.16}s` }}>{r.has[c] ? '✓' : '?'}</span>
          ))}
        </React.Fragment>
      ))}
      <span className="hd-sum">{tr({ uz: 'Javobi bor', ru: 'Есть ответ' })}</span>
      {[0, 1].map(c => { const n = HOOK_Q.filter(r => r.has[c]).length; return <b key={c} className={`hd-n ${n === HOOK_Q.length ? 'full' : 'part'}`} style={{ '--d': `${0.75 + c * 0.6}s` }}>{n}/{HOOK_Q.length}</b>; })}
    </div>
  </div>
);
const ScreenHook = ({ screen, storedAnswer, onAnswer, onNext }) => {
  const { live, isMentor } = useIsMentor();
  const [picked, setPicked] = useState(() => { const p = storedAnswer?.picked; return Number.isInteger(p) && HOOK_OPTS[p] ? p : null; }); // F-0915-02
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
  const shown = counts || null;
  const totalVotes = shown ? shown.reduce((a, b) => a + b, 0) : 0;
  // 90-qonun (F-0924-04): nol ovozda bo'sh «0%» jadvali chiqmaydi — o'rnida «Ovozlar kutilmoqda» chipi (B3 naqshi).
  const voteWait = isLive && (picked !== null || isMentor) && totalVotes === 0;
  const revealViz = isLive && shown && totalVotes > 0 && (picked !== null || isMentor);
  const topIdx = revealViz ? shown.indexOf(Math.max(...shown)) : -1;
  const optWave = useTurnHint(picked === null && !isMentor);
  const locked = picked !== null || isMentor;
  // Senariy 1: javob OVOZDAN KEYIN — proyektorda jadval (✓/?) va xulosa sinf ovoz bera boshlagach ochiladi (B2 naqshi).
  const showAns = picked !== null || (isMentor && totalVotes > 0);
  // Bir lahzada bitta puls (88-qonun, D2 · PULS_VAQT_BUG 25.09, B4/B6 naqshi): jonli o'quvchida tugma ochiq (freeRide), lekin
  // tanlovgacha navbat kartalarda — «Bitta topshiriqni tanlang» kartalar to'lqini bilan birga yonmaydi.
  return (
    <Stage eyebrow={tr({ uz: 'Kirish', ru: 'Введение' })} screen={screen} navContent={<NavNext optionalLive disabled={picked === null && !isMentor} turnBusy={picked === null && !isMentor} label={picked === null && !isMentor ? tr({ uz: 'Bitta topshiriqni tanlang', ru: 'Выберите одно задание' }) : tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} />}>
      <div className="screen hk-screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Dasturchiga ikki xil topshiriq keldi. Qaysi biri unga <span className="italic" style={{ color: T.accent }}>ko'proq yordam</span> beradi?</>, ru: <>Разработчику пришли два разных задания. Какое из них <span className="italic" style={{ color: T.accent }}>больше поможет</span> ему?</> })}</h2></div>
        {/* Mentor-gap (F-0924-03, §210 qolipi): NEGA + bitta chorlov, element o'z yorlig'i bilan; puls bilan bir halqa */}
        <Mentor>{tr({ uz: <>Dasturchi faqat topshiriqqa qarab ishlaydi — sizga qaysi biri qulayroq? <b style={{ color: T.ink }}>«Dasturchiga»</b> kartalaridan birini bosing.</>, ru: <>Разработчик работает только по заданию, — с каким вам удобнее? Нажмите одну из карточек <b style={{ color: T.ink }}>«Разработчику»</b>.</> })}</Mentor>
        {/* Ovozgacha ekranda FAQAT vazifa — ikki karta yonma-yon (D2, 25.09). Sinf ovozi kartaning o'zida: sarlavhada «👥 N%»,
            pastki chetda ingichka chiziq — balandlik qo'shilmaydi (QA 2026-09-24). */}
        <div className="tk-pair fade-up delay-1" role={revealViz ? 'group' : undefined} aria-label={revealViz ? tr({ uz: 'Sinf natijasi', ru: 'Результат класса' }) : undefined}>
          {HOOK_OPTS.map((o, i) => {
            const pct = revealViz ? Math.round((shown[i] / totalVotes) * 100) : 0;
            const top = revealViz && i === topIdx;
            return (
            <button key={i} type="button" className={`tk-card ${picked === i ? 'on' : ''}${!locked && optWave ? ` turn-ring turn-wave w${i + 1}` : ''}`} disabled={locked} onClick={() => pick(i)}>
              <span className="tk-head"><span className="tk-ic" aria-hidden="true">📨</span>{tr({ uz: 'Dasturchiga', ru: 'Разработчику' })}{revealViz ? <span className={`tk-vote mono fade-step${top ? ' top' : ''}`} aria-label={`${tr(HOOK_SHORT[i])}: ${pct}%`}>👥 {pct}%</span>
                : voteWait && picked === i ? <span className="tk-vote wait fade-step">{tr({ uz: '👥 Ovozlar kutilmoqda…', ru: '👥 Ждём голоса…' })}</span> : null}<span className="tk-n">{i + 1}</span></span>
              <span className="tk-txt">{tr(o)}</span>
              {revealViz && <span className={`tk-vbar${top ? ' top' : ''}`} aria-hidden="true"><i style={{ width: `${Math.max(pct, 4)}%` }} /></span>}
              {picked === i && <span className="tk-mark" aria-hidden="true">✓</span>}
            </button>
            );
          })}
        </div>
        {/* Mentor proyektorida ovozgacha — «kutilmoqda» (o'quvchida bu belgi o'z kartasining sarlavhasida) */}
        {voteWait && picked === null && <span className="done-mini fade-step" style={{ alignSelf: 'flex-start' }}>{tr({ uz: '👥 Ovozlar kutilmoqda…', ru: '👥 Ждём голоса…' })}</span>}
        {/* Ovozdan keyin — xulosa-vizual: chapda dasturchining savol-jadvali (1-karta ostida), o'ngda senariy xulosasi (2-karta ostida) */}
        {showAns && (
          <div className="split hk-res">
            <HookDesk picked={picked} />
            <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Birinchisi qisqa va nimani qilish kerakligini aytadi. Lekin unda kim uchun va nima sababdan kerakligi yo'q. Ikkinchisida esa odam, uning istagi va kutayotgan foydasi ham bor. Ikkinchisi uzunroq bo'lgani uchun emas, shu uchta narsa uchun foydaliroq.", ru: 'Первое короткое и говорит, что нужно сделать. Но в нём нет, для кого и зачем это нужно. Во втором есть и человек, и его желание, и польза, которую он ждёт. Второе полезнее не потому, что длиннее, а благодаря этим трём вещам.' })}</p></div>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== 2-EKRAN — MAQSAD: jonli natija-preview «reja-doska» =====
// Chapdan o'ngga: hikoya-karta (uch qism to'ladi) → 4 bo'lakka sochiladi → bittasi yashil «birinchi» bo'lib ajraladi
// → yonida 3 ta ✓ shart yozilib chiqadi. Kulrang chiziq o'rniga NAMUNA matni (pilot naqshi 9-band): «Futbol» tayyor g'oyasi —
// hikoya 13-ekran namunasidan (STORY_FIELDS.ph), birinchi bo'lak va 1-shart READY_IDEAS dan, qolganlari 14/15-ekran yorliqlari
// («2-bo'lak», «2-shart»). Taksi misolidan hech narsa yo'q — 3/7/8-ekran javoblari ochilmaydi.
// CSS-taymlayn (--fd); reduced-motion'da darhol to'liq holat. ↻ — mentor proyektori uchun qayta o'ynatish.
const GOAL_STORY = [
  { k: 'kim', lbl: { uz: 'kim', ru: 'кто' } },
  { k: 'nima', lbl: { uz: 'nimani xohlaydi', ru: 'чего хочет' } },
  { k: 'why', lbl: { uz: 'nima uchun', ru: 'зачем' } },
];
const PlanDemo = () => {
  const [run, setRun] = useState(0);
  const idea = ideaById('futbol');
  const ph = (k) => { const f = STORY_FIELDS.find(x => x.k === k); return f ? tr(f.ph) : ''; };
  return (
    <div className="pd-demo fade-up delay-1" key={run}>
      <button type="button" className="pd-replay" onClick={() => setRun(r => r + 1)} aria-label={tr({ uz: "Qayta ko'rsatish", ru: 'Показать снова' })}>↻</button>
      {idea && <span className="pd-tag">{tr({ uz: 'Namuna', ru: 'Пример' })} · {tr(idea.olam)}</span>}
      <div className="pd-col">
        <span className="pd-cap">{tr({ uz: 'Hikoya', ru: 'История' })}</span>
        <div className="pd-story">
          {GOAL_STORY.map((p, j) => (
            <span key={p.k} className={`pd-seg ${p.k}`} style={{ '--fd': `${0.5 + j * 0.45}s` }}><em>{tr(p.lbl)}</em><span className="pd-tx">{ph(p.k)}</span></span>
          ))}
        </div>
      </div>
      <span className="pd-arrow" style={{ '--fd': '2s' }} aria-hidden="true" />
      <div className="pd-col">
        <span className="pd-cap">{tr({ uz: "Bo'laklar", ru: 'Части' })}</span>
        <div className="pd-tiles">
          {[0, 1, 2, 3].map(i => (
            <span key={i} className={`pd-tile ${i === 0 ? 'first' : ''}`} style={{ '--fd': `${2.3 + i * 0.22}s` }}>
              <span className="pd-tx">{i === 0 && idea ? capFirst(tr(idea.bolak)) : tr({ uz: `${i + 1}-bo'lak`, ru: `Часть ${i + 1}` })}</span>
              {i === 0 && <span className="pd-first">{tr({ uz: 'birinchi', ru: 'первая' })}</span>}
            </span>
          ))}
        </div>
      </div>
      <span className="pd-arrow" style={{ '--fd': '3.9s' }} aria-hidden="true" />
      <div className="pd-col">
        <span className="pd-cap">{tr({ uz: 'Shartlar', ru: 'Условия' })}</span>
        <div className="pd-conds">
          {[0, 1, 2].map(i => (
            <span key={i} className="pd-cond" style={{ '--fd': `${4.2 + i * 0.4}s` }}><span className="pd-ck" aria-hidden="true" /><span className="pd-tx">{i === 0 && idea ? <>{tr(idea.shart.qiladi)} <b className="pd-arr">→</b> {tr(idea.shart.boladi)}</> : tr({ uz: `${i + 1}-shart`, ru: `Условие ${i + 1}` })}</span></span>
          ))}
          <span className="pd-stamp" style={{ '--fd': '5.6s' }}>✓ {tr({ uz: 'Tayyor', ru: 'Готово' })}</span>
        </div>
      </div>
    </div>
  );
};
const ScreenGoal = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начинаем →' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun nimadan boshlashni va <span className="italic" style={{ color: T.accent }}>qachon tayyor</span> bo'lishini hal qilasiz</>, ru: <>Сегодня вы решите, с чего начать и <span className="italic" style={{ color: T.accent }}>когда будет готово</span></> })}</h2></div>
      <Mentor>{tr({ uz: "O'zingiz tanlagan g'oyaga bitta hikoya yozasiz. Keyin g'oyani bo'laklarga bo'lib, qaysi biridan boshlashni tanlaysiz. Oxirida tanlagan bo'lagingiz tayyor bo'lganini qanday tekshirishni uchta shart bilan yozasiz.", ru: 'Вы напишете одну историю для выбранной идеи. Потом разобьёте идею на части и выберете, с какой начать. В конце запишете три условия — по ним проверите, что выбранная часть готова.' })}</Mentor>
      <PlanDemo />
    </div>
  </Stage>
);

// ===== 3-EKRAN — UCH QISM: qismni tanlab, qolipdagi joyiga qo'yish (yig'ilgan gap = 1-ekrandagi 2-karta) =====
// Qism-qiymatlar egaliksiz (korpus §13): yakka o'qilganda ham, qolipda ham toza.
const PARTS = [
  { k: 'kim', lbl: { uz: 'KIM', ru: 'КТО' }, t: { uz: "kechqurun to'garakdan qaytadigan o'quvchi", ru: 'ученик, который вечером возвращается с кружка' } },
  { k: 'nima', lbl: { uz: 'NIMA', ru: 'ЧТО' }, t: { uz: "mashina qayerdaligini xaritada ko'rish", ru: 'видеть машину на карте' } },
  { k: 'why', lbl: { uz: 'NIMA UCHUN', ru: 'ЗАЧЕМ' }, t: { uz: "ko'chada kutib qolmaslik", ru: 'не ждать на улице' } },
];
const PART_ORDER = [2, 0, 1]; // barqaror aralash tartib (StrictMode-safe)
// Qolip: «Men {KIM} sifatida, {NIMA}ni xohlayman — {NIMA UCHUN} uchun.» (RU qolipi ru: maydonida).
// «-ni» qo'shimchasi faqat NIMA joyiga qo'yilgach chiqadi (👦 QA: bo'sh joy «…?ni xohlayman» bo'lib o'qilardi).
const STORY_TPL = {
  uz: [['Men '], ['kim'], [' sifatida, '], ['nima'], ['ni', 'nima'], [' xohlayman — '], ['why'], [' uchun.']],
  ru: [['Я, как '], ['kim'], [', хочу '], ['nima'], [' — чтобы '], ['why'], ['.']],
};
const storyTpl = () => tr(STORY_TPL);
const ScreenParts = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [placed, setPlaced] = useState(() => (storedAnswer && storedAnswer.correct ? { kim: true, nima: true, why: true } : {}));
  const [sel, setSel] = useState(null);
  const [shake, setShake] = useState(null);
  const done = PARTS.every(p => placed[p.k]);
  const left = PARTS.filter(p => !placed[p.k]).length;
  const drop = (slot, key = sel) => {
    if (!key || placed[slot]) return;
    if (key !== slot) { setShake(slot); setTimeout(() => setShake(s => (s === slot ? null : s)), 480); return; }
    const next = { ...placed, [slot]: true };
    setPlaced(next); setSel(null);
    if (PARTS.every(p => next[p.k]) && !(storedAnswer && storedAnswer.correct)) onAnswer(screen, { correct: true, solved: true });
  };
  // F-0925-B08: qismni SUDRAB ham qo'yish mumkin — chip barmoq/kursor ortidan yuradi, ostidagi bo'sh joy belgilanadi;
  // noto'g'ri joyga yoki bo'sh joydan tashqariga qo'yilsa chip o'z o'rniga silliq qaytadi. <6 px siljish — oddiy bosish.
  const drag = useRef(null);
  const justDragged = useRef(false);
  const [overSlot, setOverSlot] = useState(null);
  const [dragKey, setDragKey] = useState(null);
  const slotAt = (x, y) => { const el = document.elementsFromPoint(x, y).find(n => n.classList && n.classList.contains('qs-slot')); return el ? el.dataset.slot : null; };
  const onChipDown = (e, k) => {
    justDragged.current = false;
    if (done || isMentor || (e.pointerType === 'mouse' && e.button !== 0)) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) { /* eski brauzer */ }
    drag.current = { k, id: e.pointerId, x0: e.clientX, y0: e.clientY, el: e.currentTarget, on: false };
  };
  const onChipMove = (e) => {
    const d = drag.current; if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
    if (!d.on) { if (Math.hypot(dx, dy) < 6) return; d.on = true; setSel(d.k); setDragKey(d.k); }
    d.el.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
    const over = slotAt(e.clientX, e.clientY);
    setOverSlot(o => (o === over ? o : over));
  };
  const onChipUp = (e) => {
    const d = drag.current; if (!d || e.pointerId !== d.id) return;
    drag.current = null;
    if (!d.on) return;
    justDragged.current = true;
    const over = slotAt(e.clientX, e.clientY);
    setOverSlot(null);
    setDragKey(null);
    const back = () => { d.el.style.transition = 'transform 0.28s cubic-bezier(.2,.8,.2,1)'; d.el.style.transform = ''; setTimeout(() => { if (d.el) d.el.style.transition = ''; }, 300); };
    if (over && over === d.k && !placed[over]) { drop(over, d.k); return; }
    back();
    if (over) drop(over, d.k);
  };
  const pend = PART_ORDER.map(i => PARTS[i].k).filter(k => !placed[k]);
  const lit = useTurnWalk(pend, !sel && !done && !isMentor); // mentor rejimida ekran-ichi puls o'chadi — faqat NavNext (pilot B1)
  // Qism tanlangach navbat gapdagi bo'sh joylarda: teng joylar TO'LQIN bilan (88-qonun c/d), cheksiz halo emas (QA 2026-09-24).
  const slotWave = useTurnHint(!!sel && !done && !isMentor);
  const openSlots = PARTS.map(p => p.k).filter(k => !placed[k]);
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : !sel ? tr({ uz: `Qismni tanlang (yana ${left} ta)`, ru: `Выберите часть (осталось ${left})` })
    : tr({ uz: 'Endi gapdagi joyini bosing', ru: 'Теперь нажмите на её место во фразе' });
  return (
    <Stage eyebrow={tr({ uz: '1-qism · Hikoya', ru: 'Часть 1 · История' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} turnBusy={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Hikoyaning uch qismini <span className="italic" style={{ color: T.accent }}>joyiga</span> qo'ya olasizmi?</>, ru: <>Сможете расставить три части истории <span className="italic" style={{ color: T.accent }}>по местам</span>?</> })}</h2></div>
        {/* Mentor-gap (F-0924-03, §210 qolipi): NEGA + bitta chorlov, element o'z yorlig'i bilan; puls bilan bir halqa */}
        {/* Korpus B-18: hammasi joylangach «Qismlar» qatori bo'sh — chorlov olinadi, NEGA qoladi */}
        <Mentor>{done && !isMentor
          ? tr({ uz: "Gapdagi har bo'sh joy dasturchining bitta savoliga javob beradi.", ru: 'Каждое пустое место во фразе отвечает на один вопрос разработчика.' })
          : tr({ uz: <>Gapdagi har bo'sh joy dasturchining bitta savoliga javob beradi — <b style={{ color: T.ink }}>«Qismlar»</b>dan birini bosing.</>, ru: <>Каждое пустое место во фразе отвечает на один вопрос разработчика, — в строке <b style={{ color: T.ink }}>«Части»</b> нажмите одну.</> })}</Mentor>
        <FlowLabel end={`${3 - left}/3`}>{tr({ uz: 'Qismlar — birini bosing', ru: 'Части — нажмите одну' })}</FlowLabel>
        <div className="qs-pool fade-up delay-1">
          {PART_ORDER.filter(i => !placed[PARTS[i].k]).map(i => {
            const p = PARTS[i];
            return <button key={p.k} type="button" className={`qs-chip ${sel === p.k ? 'sel' : ''}${dragKey === p.k ? ' lift' : ''}${turnCls(lit, p.k, pend.length > 1)}`} onPointerDown={(e) => onChipDown(e, p.k)} onPointerMove={onChipMove} onPointerUp={onChipUp} onPointerCancel={onChipUp} onClick={() => { if (justDragged.current) { justDragged.current = false; return; } setSel(s => (s === p.k ? null : p.k)); }}>{tr(p.t)}</button>;
          })}
          {done && <span className="done-mini fade-step">{tr({ uz: '✅ Hammasi joyida', ru: '✅ Всё на месте' })}</span>}
        </div>
        {/* F-0925-B08: qism tanlangach — qayerga qo'yishni ko'rsatuvchi belgi (3 marta sakraydi va to'xtaydi: bir lahzada bitta puls, 88-qonun).
            Joyi DOIM band (faqat ko'rinmas) — paydo bo'lganda gapni pastga surmaydi: sudrash boshlanganda bo'sh joy barmoq ostidan qochardi. */}
        {!done && <p className={`qs-cue${sel && !dragKey ? ' on' : ''}`} aria-hidden={!sel}><span className="qs-arrow" key={sel || 'x'} aria-hidden="true">👇</span> {tr({ uz: "Endi gapdagi bo'sh joyni bosing — yoki qismni sudrab olib boring", ru: 'Теперь нажмите на пустое место во фразе — или перетащите туда часть' })}</p>}
        <div className={`gb-sent qs-sent fade-up delay-2 ${done ? 'ok build' : ''}`}>
          <span className="flow-label">{tr({ uz: 'Hikoya', ru: 'История' })}</span>
          <p className="gb-sent-t">
            {storyTpl().map(([s, after], j) => {
              if (after) return placed[after] ? <span key={j}>{s}</span> : null;
              if (s !== 'kim' && s !== 'nima' && s !== 'why') return <span key={j}>{s}</span>;
              const p = PARTS.find(x => x.k === s);
              if (placed[s]) return <b key={j} className={`qs-fill ${s}`}>{tr(p.t)}</b>;
              return <button key={j} type="button" data-slot={s} className={`qs-slot ${s} ${sel ? 'targetable' : ''} ${overSlot === s ? 'over' : ''} ${shake === s ? 'shake' : ''}${waveCls(slotWave, openSlots.indexOf(s), openSlots.length)}`} disabled={!sel} onClick={() => drop(s)}>{tr(p.lbl)}</button>;
            })}
          </p>
        </div>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: <>Kimligi, nimani xohlashi va nima uchun xohlashi ko'rsatilgan bunday gap <b>foydalanuvchi hikoyasi</b> (User Story) deyiladi. Uchala qism ham kerak: «nima uchun» qismi dasturchiga bu imkoniyat odamga qanday foyda berishini tushuntiradi.</>, ru: <>Такая фраза, где сказано, кто человек, чего он хочет и зачем, называется <b>пользовательской историей</b> (User Story). Нужны все три части: часть «зачем» объясняет разработчику, какую пользу эта возможность даёт человеку.</> })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== TEST-SAVOL (F-0924-06) — PmLesson2 savol-qolipi (Screen4): BITTA h-ask sarlavha. F-0925-QA03: «To'g'ri javobni tanlang»
// ko'zcha-yorlig'i va «⚡ Jonli dars — bitta urinish» qatori olib tashlandi (foydalanuvchi: UI'ni bekorga egallaydi).
// Lead (senariy matni) — oddiy qator, serif-karta EMAS: ikki sarlavha raqobatlashmaydi (pilot B1 / B3 naqshi).
const TestQ = ({ lead, ask }) => (
  <div className="tq">
    {lead && <p className="tq-lead">{lead}</p>}
    <h2 className="title h-ask">{ask}</h2>
  </div>
);

// ===== 4-EKRAN — TEST-1 =====
const ScreenTest1 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 1', ru: 'Проверка · 1' })} scope="module-mikro"
    question={<TestQ ask={tr({ uz: "Qaysi gapda kim, nimani xohlashi va nima uchun — uchalasi ham bor?", ru: 'В какой фразе есть все три части: кто, чего хочет и зачем?' })} />}
    questionText={tr({ uz: "Uch qismi bor hikoya", ru: 'История со всеми тремя частями' })}
    options={[
      tr({ uz: "Men ilovadan har kuni foydalanadigan odam sifatida, narxni buyurtmadan oldin ekranda ko'rishni xohlayman", ru: 'Я, как человек, который каждый день пользуется приложением, хочу видеть цену на экране до заказа' }),
      tr({ uz: "Men shoshayotgan o'quvchi sifatida, narxni oldindan ko'rishni xohlayman — pulim yetishini bilish uchun", ru: 'Я, как спешащий ученик, хочу видеть цену заранее — чтобы знать, хватит ли мне денег' }),
      tr({ uz: 'Narx buyurtmadan oldin ekranda ko\'rinib tursin — safarimni oldindan rejalashtirib olish uchun', ru: 'Пусть цена будет видна на экране до заказа — чтобы заранее спланировать поездку' }),
      tr({ uz: "Xaritani kattaroq qiling, mashinani esa unda yaxshiroq ko'rinadigan va yorqin qilib qo'ying", ru: 'Сделайте карту побольше, а машину на ней — заметнее и ярче' }),
    ]}
    correctIdx={INLINE_KEYS.s4}
    explainCorrect={tr({ uz: "To'g'ri — bu gapda kim ham, nimani xohlashi ham, nima uchun ham bor.", ru: 'Верно — в этой фразе есть и кто, и чего хочет, и зачем.' })}
    explainWrong={{
      0: tr({ uz: "Kim va nima bor, lekin odam buni nima uchun xohlayotgani aytilmagan.", ru: 'Есть кто и что, но не сказано, зачем человеку это нужно.' }),
      2: tr({ uz: "Nimani xohlashi va nima uchun bor, lekin kim ekani aytilmagan.", ru: 'Есть чего хочет и зачем, но не сказано, кто это.' }),
      3: tr({ uz: "Bu — oddiy topshiriq: kim uchun va nima uchun, aytilmagan.", ru: 'Это обычное задание: не сказано, для кого и зачем.' }),
      default: tr({ uz: "Hikoyada uchala qism kerak: kim, nimani xohlaydi, nima uchun.", ru: 'В истории нужны все три части: кто, чего хочет, зачем.' }),
    }}
  />
);

// ===== 5-EKRAN — BO'LAKLAYMIZ: bitta katta kartani bosib, olti bo'lakka ajratish =====
// Yandex Go — faqat shu ekranda, taqqoslash namunasi; ro'yxat — bizniki (ekranda ochiq aytiladi).
const TAXI_PARTS = [
  { k: 'chaqirish', ic: '🚕', t: { uz: 'Mashina chaqirish', ru: 'Вызов машины' } },
  { k: 'narx', ic: '💰', t: { uz: "Narxni oldindan ko'rish", ru: 'Цена заранее' } },
  { k: 'xarita', ic: '🗺️', t: { uz: "Mashinani xaritada ko'rish", ru: 'Машина на карте' } },
  { k: 'baho', ic: '⭐', t: { uz: 'Haydovchini baholash', ru: 'Оценка водителя' } },
  { k: 'karta', ic: '💳', t: { uz: "Karta bilan to'lash", ru: 'Оплата картой' } },
  { k: 'tarix', ic: '🕘', t: { uz: 'Safarlar tarixi', ru: 'История поездок' } },
];
const ScreenSplit = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [split, setSplit] = useState(() => !!(storedAnswer && storedAnswer.correct));
  const doSplit = () => { if (split) return; setSplit(true); if (storedAnswer === undefined) onAnswer(screen, { correct: true }); };
  const cardHint = useTurnHint(!split && !isMentor); // mentor rejimida faqat NavNext yonadi
  return (
    <Stage eyebrow={tr({ uz: "2-qism · Bo'laklar", ru: 'Часть 2 · Части' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!split && !isMentor} turnBusy={!split && !isMentor} label={split || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: "Kartani bosib, bo'laklarga ajrating", ru: 'Нажмите на карточку, чтобы разбить её' })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Taksi ilovasini noldan qurish — <span className="italic" style={{ color: T.accent }}>bitta ishmi</span> yoki bir nechta alohida ishmi?</>, ru: <>Построить приложение такси с нуля — это <span className="italic" style={{ color: T.accent }}>одна работа</span> или несколько отдельных?</> })}</h2>
          {!split && <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "Yandex Go'da manzilni yozasiz, narxni oldindan ko'rasiz, mashinani xaritada ko'rasiz. Shunga qarab o'z ilovamizni bo'laklarga bo'ldik — ro'yxatni biz o'zimiz tuzdik.", ru: 'В Yandex Go вы вводите адрес, заранее видите цену и видите машину на карте. Глядя на это, мы разбили своё приложение на части — список составили сами.' })}</p>}</div>
        {/* Mentor-gap (F-0924-03, §210 qolipi): NEGA + bitta chorlov, element o'z yorlig'i bilan; puls bilan bir halqa */}
        {/* Korpus B-18: karta bo'linganda tugma yo'qoladi — chorlov olinadi, NEGA qoladi */}
        <Mentor>{split && !isMentor
          ? tr({ uz: "Qurishni boshlashdan oldin nima qurilishini aniq ko'rish kerak.", ru: 'Прежде чем строить, нужно ясно увидеть, что именно строим.' })
          : tr({ uz: <>Qurishni boshlashdan oldin nima qurilishini aniq ko'rish kerak — <b style={{ color: T.ink }}>«Taksi ilovasini qurish»</b>ni bosing.</>, ru: <>Прежде чем строить, нужно ясно увидеть, что именно строим, — нажмите <b style={{ color: T.ink }}>«Построить приложение такси»</b>.</> })}</Mentor>
        {!split ? (
          <button type="button" className={`sp-big fade-up delay-2${cardHint ? ' turn-ring' : ''}`} onClick={doSplit}>
            <span className="sp-big-ic" aria-hidden="true">📱</span>
            <span className="sp-big-t">{tr({ uz: 'Taksi ilovasini qurish', ru: 'Построить приложение такси' })}</span>
            <span className="sp-big-cue">{tr({ uz: "Bosing — bo'laklarga ajraladi ▾", ru: 'Нажмите — разобьётся на части ▾' })}</span>
          </button>
        ) : (
          <>
            <div className="sp-tree">
              <span className="sp-root"><span aria-hidden="true">📱</span> {tr({ uz: 'Taksi ilovasini qurish', ru: 'Построить приложение такси' })}</span>
              <div className="sp-grid">
                {TAXI_PARTS.map((p, i) => (
                  <div key={p.k} className="sp-tile" style={{ animationDelay: `${0.1 + i * 0.08}s`, '--sx': `${(1 - (i % 3)) * 60}px`, '--sy': `${i < 3 ? 20 : -30}px` }}>
                    <span className="sp-ic" aria-hidden="true">{p.ic}</span>
                    <span className="sp-t">{tr(p.t)}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="small fade-step" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "Bo'laklar bir xil kattalikda bo'lishi shart emas. Biz ularni alohida qurib, keyin tekshirib bo'ladigan qismlar sifatida ajratdik.", ru: 'Части не обязаны быть одного размера. Мы выделили их так, чтобы каждую можно было построить отдельно, а потом проверить.' })}</p>
            <div className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: <>Katta ilovani bitta ulkan ish sifatida boshqarish qiyin. Har bo'lakni alohida rejalashtirish, qurish va tekshirish osonroq. Katta ishni shunday bo'laklarga bo'lish <b>dekompozitsiya</b> deyiladi.</>, ru: <>Большим приложением трудно управлять как одной огромной работой. Каждую часть проще отдельно спланировать, построить и проверить. Такое разбиение большой работы на части называется <b>декомпозицией</b>.</> })}</p></div>
          </>
        )}
      </div>
    </Stage>
  );
};

// ===== 6-EKRAN — HAQIQIY VOQEA: INSTAGRAM (bashorat + 3 slayd; matn 2-o'tish 3-darsi bilan bir xil, sana va 25 000 yo'q) =====
// Taxmin berilgach bashorat-bloki yig'iladi — faqat natija-chipi qoladi (B2 naqshi).
const K_PREDICT = {
  ask: { uz: "Instagram asoschilari avval Burbn degan ilova qilgan. Unda ko'p narsa bor edi: joy belgilash, reja tuzish, surat va yana boshqalar. Odamlarga undagi qaysi narsa yoqqan?", ru: 'Основатели Instagram сначала сделали приложение Burbn. В нём было много всего: отметки мест, планы, фото и многое другое. Что из этого нравилось людям?' },
  chips: [
    { ic: '📍', t: { uz: 'Joy belgilash', ru: 'Отмечать места' } },
    { ic: '🗓️', t: { uz: 'Reja tuzish', ru: 'Составлять планы' } },
    { ic: '📷', t: { uz: "Surat qo'yish", ru: 'Выкладывать фото' } },
  ],
  ans: 2,
};
const K_SLIDES = [
  { ic: '📱', body: { uz: "Burbn'da ko'p narsa bor edi, lekin uni ishlatadiganlar juda kam edi.", ru: 'В Burbn было много всего, но пользовались им очень немногие.' } },
  { ic: '📷', body: { uz: "Jamoa odamlar eng ko'p yoqtirgan qismlarni qoldirdi: surat, filtr va izoh.", ru: 'Команда оставила то, что людям нравилось больше всего: фото, фильтры и комментарии.' } },
  { ic: '✨', body: { uz: 'Shu kichik ilova Instagram nomi bilan chiqdi — bugun hamma biladigan Instagram.', ru: 'Это небольшое приложение вышло под названием Instagram — тот самый Instagram, который сегодня знают все.' } },
];
// ===== KESISH-MAKETI (F-0924-07, 156-qonun) — manba PmLesson31 CutMock (.cut-*), 2-o'tish 3-darsi bilan bir xil joyda (2-slayd).
// Ro'yxat so'zlari SHU ekranning o'z matnidan (bashorat-chiplari + 2-slayd «surat, filtr va izoh») — o'ylab topilgan ficha yo'q.
// §186: maket faqat taxmindan KEYIN chiqadi (slaydlar bashoratdan keyin ochiladi).
const CUT_BURBN = [
  { t: { uz: 'Joy belgilash', ru: 'Отметки мест' }, keep: false },
  { t: { uz: 'Reja tuzish', ru: 'Планы' }, keep: false },
  { t: { uz: 'Surat', ru: 'Фото' }, keep: true },
  { t: { uz: 'Filtr', ru: 'Фильтры' }, keep: true },
  { t: { uz: 'Izoh', ru: 'Комментарии' }, keep: true },
];
const CutMock = () => (
  <div className="cut-wrap" role="img" aria-label={tr({ uz: "Burbn ro'yxati: joy belgilash, reja tuzish, surat, filtr, izoh — surat, filtr va izoh qoladi; Instagram: surat, filtr, izoh", ru: 'Список Burbn: отметки мест, планы, фото, фильтры, комментарии — остаются фото, фильтры и комментарии; Instagram: фото, фильтры, комментарии' })}>
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
// Slayd-rasm (pilot naqshi 7-band: .k-fig > .k-photo.emo) — bu darsning o'z bezagi: «ilova ekrani, bo'laklar soni».
// 1-slayd — Burbn: ekranda besh bo'lak tiqilib turadi, ishlatadiganlar qatorida bitta yorqin odam, qolgani xira
// («ishlatadiganlar juda kam»). 3-slayd — Instagram: ekranda faqat uch bo'lak, kattaroq, «1-versiya» yorlig'i bilan.
// Bo'lak nomlari — shu ekranning o'z matnidan (CUT_BURBN), yangi fakt yo'q. Reduced-motion: kirish animatsiyasi o'chadi.
const APP_IC = ['📍', '🗓️', '📷', '🎨', '💬'];
const CasePhone = ({ k, ic }) => {
  const items = CUT_BURBN.map((x, j) => ({ ...x, ic: APP_IC[j] })).filter(x => k === 0 || x.keep);
  return (
    <span className={`k-photo emo cph cph${k}`} aria-hidden="true">
      <span className="cph-scr">
        <span className="cph-top"><b>{k === 0 ? 'Burbn' : 'Instagram'}</b>{k === 2 && <em>{tr({ uz: '1-versiya', ru: 'Версия 1' })}</em>}</span>
        <span className="cph-grid">
          {items.map((x, j) => <span key={j} className="cph-it" style={{ '--j': j }}><i>{x.ic}</i>{tr(x.t)}</span>)}
        </span>
        {k === 0 && <span className="cph-ppl">{[0, 1, 2, 3, 4].map(j => <i key={j} className={j === 0 ? 'on' : ''} />)}</span>}
      </span>
      <span className="cph-ic">{ic}</span>
    </span>
  );
};
const ScreenCase = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [i, setI] = useState(0);
  const [bet, setBet] = useState(() => { const b = storedAnswer?.bet; return Number.isInteger(b) && K_PREDICT.chips[b] ? b : undefined; }); // F-0915-02
  const last = i === K_SLIDES.length - 1;
  const betPending = bet === undefined;
  useEffect(() => { if (last && !betPending && storedAnswer === undefined) onAnswer(screen, { correct: true, bet }); }, [last, betPending]); // eslint-disable-line
  const c = K_SLIDES[i];
  // Navbat-zanjiri (bir lahzada bitta puls): taxmin → slayd ichidagi «Keyingisi →» → (oxirida) NavNext.
  // Mentor rejimida ekran-ichi puls o'chadi — faqat NavNext yonadi (pilot B1 naqshi).
  const betHint = useTurnHint(betPending && !isMentor);
  // Oxirgi slayd bir marta ochilgach NavNext qayta qulflanmaydi («← Oldingi» bilan qaytib ko'rish mumkin).
  const [reached, setReached] = useState(() => !!(storedAnswer && storedAnswer.correct));
  useEffect(() => { if (last && !betPending) setReached(true); }, [last, betPending]);
  // Tekshiruvchi (88-qonun d): oxirgi slayd ko'rilgach «← Oldingi» bilan qaytilsa navbat NavNext'da — «Keyingisi →» yonmaydi (ikki puls bo'lardi).
  const nextTurn = useTurnHint(!betPending && !last && !reached && !isMentor);
  const navLabel = isMentor || (!betPending && reached) ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : betPending ? tr({ uz: 'Avval taxminingizni tanlang', ru: 'Сначала выберите свою догадку' })
    : tr({ uz: 'Avval voqeani oxirigacha oching', ru: 'Сначала откройте историю до конца' });
  return (
    <Stage eyebrow={tr({ uz: 'Haqiqiy voqea · Instagram', ru: 'Реальная история · Instagram' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={(betPending || !reached) && !isMentor} disabled={(betPending || !reached) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Burbn ilovasida ko'p narsa bor edi. Odamlarga yoqqan <span className="italic" style={{ color: T.accent }}>nimalar qoldi</span>?</>, ru: <>В приложении Burbn было много всего. Что из того, что нравилось людям, <span className="italic" style={{ color: T.accent }}>осталось</span>?</> })}</h2></div>
        {/* Mentor-gap (F-0924-03/07, §210 qolipi): NEGA + bitta chorlov; javob aytilmaydi */}
        {/* Chorlov puls turgan halqani aytadi: taxmingacha — savol, taxmindan keyin — slayd ichidagi «Keyingisi →» */}
        {/* Korpus B-18: oxirgi slaydda «Keyingisi →» yo'q — chorlov olinadi, NEGA qoladi (qolgan ekranlar bilan bir xil; navbat NavNext'ning o'z pulsida — 99-qonun, tekshiruvchi 25.09) */}
        <Mentor>{betPending
          ? tr({ uz: <>Taxminingizni keyin haqiqiy voqea bilan solishtirasiz — <b style={{ color: T.ink }}>uch javobdan</b> birini bosing.</>, ru: <>Потом вы сравните свою догадку с реальной историей, — нажмите <b style={{ color: T.ink }}>один из трёх ответов</b>.</> })
          : (last || reached)
            ? tr({ uz: "Burbn'dagi saboq o'z g'oyangizga ham kerak bo'ladi.", ru: 'Урок Burbn пригодится и для вашей идеи.' })
            : tr({ uz: <>Burbn'dagi saboq o'z g'oyangizga ham kerak bo'ladi — <b style={{ color: T.ink }}>«Keyingisi →»</b>ni bosing.</>, ru: <>Урок Burbn пригодится и для вашей идеи, — нажмите <b style={{ color: T.ink }}>«Следующий →»</b>.</> })}</Mentor>
        {betPending && (
          <div className="kp-bet fade-step">
            <h3 className="k-slide-h kp-ask">{tr(K_PREDICT.ask)}</h3>
            <div className="kp-chips">
              {K_PREDICT.chips.map((ch, k) => (
                <button key={k} className={`kp-chip${waveCls(betHint, k, K_PREDICT.chips.length)}`} onClick={() => setBet(k)}>
                  <span className="kp-ic">{ch.ic}</span>{tr(ch.t)}
                </button>
              ))}
            </div>
          </div>
        )}
        {!betPending && (() => {
          const ansT = tr(K_PREDICT.chips[K_PREDICT.ans].t);
          return <p className={`kp-res ${(isMentor || bet === K_PREDICT.ans) ? 'hit' : 'miss'}`} style={{ alignSelf: 'center' }}>{isMentor ? tr({ uz: <>✓ Asl javob: «{ansT}».</>, ru: <>✓ На самом деле: «{ansT}».</> }) : bet === K_PREDICT.ans ? tr({ uz: <>🎯 Topdingiz: «{ansT}».</>, ru: <>🎯 Угадали: «{ansT}».</> }) : tr({ uz: <>Adashdingiz — asl javob: «{ansT}».</>, ru: <>Не угадали — на самом деле: «{ansT}».</> })}</p>;
        })()}
        {!betPending && (
          <>
            {/* Slayd o'z boshqaruvi bilan (PmLesson1 k-nav, B3 naqshi); 2-slaydda kesish-maketi (CutMock) */}
            <div className="k-slide ph fade-step revealed" key={i}>
              <span className="k-slide-eyebrow">{i + 1} / {K_SLIDES.length}</span>
              <div className="k-fig">{i === 1 ? <CutMock /> : <CasePhone k={i} ic={c.ic} />}</div>
              <p className="k-slide-body">{tr(c.body)}</p>
              <div className="k-nav">
                <button type="button" className="btn-soft k-prev" disabled={i === 0} onClick={() => setI(i - 1)}>{tr({ uz: '← Oldingi', ru: '← Предыдущий' })}</button>
                <div className="k-dots">{K_SLIDES.map((_, k) => <button key={k} type="button" className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} onClick={() => setI(k)} aria-label={tr({ uz: `${k + 1}-slayd`, ru: `Слайд ${k + 1}` })} />)}</div>
                {!last && <button type="button" className={`k-next${nextTurn ? ' turn-ring' : ''}`} onClick={() => setI(i + 1)}>{tr({ uz: 'Keyingisi →', ru: 'Следующий →' })}</button>}
              </div>
            </div>
          </>
        )}
        {!betPending && last && <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({
          uz: <>Instagram birinchi kuni uchta narsa bilan chiqdi. Odamga asosiy foydani beradigan va g'oyani sinab ko'rishga yetadigan shunday eng kichik mahsulot <b>birinchi versiya</b> (MVP) deyiladi.</>,
          ru: <>В первый день Instagram вышел с тремя вещами. Такой самый маленький продукт, который даёт человеку главную пользу и которого хватает, чтобы проверить идею, называется <b>первой версией</b> (MVP).</>,
        })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== 7-EKRAN — TEST-2 =====
const ScreenTest2 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 2', ru: 'Проверка · 2' })} scope="module-mikro"
    question={<TestQ ask={tr({ uz: "Taksi ilovamizning birinchi versiyasi uchun qaysi to'plam yetarli?", ru: 'Какого набора хватит для первой версии нашего приложения такси?' })} />}
    questionText={tr({ uz: "Taksi ilovasining birinchi versiyasi", ru: 'Первая версия приложения такси' })}
    options={[
      tr({ uz: "Karta bilan to'lashning o'zi — qolgani keyin", ru: 'Только оплата картой — остальное потом' }),
      tr({ uz: "Olti bo'lakning hammasi, birortasi ham qolmasdan", ru: 'Все шесть частей, без единого исключения' }),
      tr({ uz: 'Haydovchini baholash va safarlar tarixi', ru: 'Оценка водителя и история поездок' }),
      tr({ uz: "Mashina chaqirishning o'zi — qolgani keyin", ru: 'Только вызов машины — остальное потом' }),
    ]}
    correctIdx={INLINE_KEYS.s7}
    explainCorrect={tr({ uz: "To'g'ri — bu bo'lak odamga asosiy ishni bajarishga imkon beradi: mashina chaqirib, uyiga yetadi. Qolgan bo'laklar keyingi versiyalarda qo'shilishi mumkin.", ru: 'Верно — эта часть позволяет человеку сделать главное: вызвать машину и доехать до дома. Остальные части можно добавить в следующих версиях.' })}
    explainWrong={{
      0: tr({ uz: "To'lov bor, lekin mashina chaqirib bo'lmaydi — asosiy foyda yo'q.", ru: 'Оплата есть, но машину вызвать нельзя — главной пользы нет.' }),
      1: tr({ uz: "Hammasi bo'lsa, bu to'liq ilova. Birinchi versiya — asosiy foydani beradigan eng kichik mahsulot.", ru: 'Если есть всё — это полное приложение. Первая версия — самый маленький продукт, который даёт главную пользу.' }),
      2: tr({ uz: "Bu bo'laklar bilan mashina chaqirib bo'lmaydi — ilova asosiy foydani bermaydi.", ru: 'С этими частями машину не вызовешь — приложение не даёт главной пользы.' }),
      default: tr({ uz: "Birinchi versiya — asosiy foydani beradigan eng kichik mahsulot.", ru: 'Первая версия — самый маленький продукт, который даёт главную пользу.' }),
    }}
  />
);

// ===== 8-EKRAN — IKKI SAVOL, TO'RT KATAK: olti bo'lakni joylashtirish =====
// Sonlar senariydan (mashq uchun taxmin, Yandex Go ma'lumoti emas — ekranda ochiq yoziladi). ⏳ katagi bo'sh qoladi (qaror 3.2).
const CELLS = [
  { k: 'avval', ic: '🎯', t: { uz: 'Avval qilinadi', ru: 'Делаем первым' }, sub: { uz: "ko'p · tez", ru: 'много · быстро' } },
  { k: 'reja', ic: '🏔', t: { uz: 'Rejaga tushadi', ru: 'Идёт в план' }, sub: { uz: "ko'p · uzoq", ru: 'много · долго' } },
  { k: 'vaqt', ic: '🌱', t: { uz: "Vaqt bo'lsa", ru: 'Если будет время' }, sub: { uz: 'kam · tez', ru: 'мало · быстро' } },
  { k: 'keyin', ic: '⏳', t: { uz: 'Hozircha keyinroq', ru: 'Пока позже' }, sub: { uz: 'kam · uzoq', ru: 'мало · долго' } },
];
const cellOf = (k) => CELLS.find(c => c.k === k);
const ODAM = {
  hamma: { uz: "deyarli hamma yo'lovchiga kerak", ru: 'нужно почти всем пассажирам' },
  kop: { uz: "ko'p yo'lovchiga kerak", ru: 'нужно многим пассажирам' },
  kam: { uz: "kam yo'lovchiga kerak", ru: 'нужно немногим пассажирам' },
};
const GRID_ITEMS = [
  { k: 'chaqirish', odam: 'hamma', vaqt: { uz: '2 kun', ru: '2 дня' }, cell: 'avval' },
  { k: 'narx', odam: 'kop', vaqt: { uz: '2 kun', ru: '2 дня' }, cell: 'avval' },
  { k: 'xarita', odam: 'hamma', vaqt: { uz: '3 hafta', ru: '3 недели' }, cell: 'reja' },
  { k: 'karta', odam: 'kop', vaqt: { uz: '2 hafta', ru: '2 недели' }, cell: 'reja' },
  { k: 'baho', odam: 'kam', vaqt: { uz: '1 kun', ru: '1 день' }, cell: 'vaqt' },
  { k: 'tarix', odam: 'kam', vaqt: { uz: '2 kun', ru: '2 дня' }, cell: 'vaqt' },
];
const GRID_ORDER = [2, 5, 0, 3, 4, 1]; // barqaror aralash tartib
// F-0925-B09: kartada faqat ikki javob matni (👥 · ⏱) — nuqta-o'lchagich va vaqt-chizig'i olib tashlandi (ekran «juda ko'p dizayn»).
const partOf = (k) => TAXI_PARTS.find(p => p.k === k);
const ScreenGrid = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [placed, setPlaced] = useState(() => (storedAnswer && storedAnswer.correct ? Object.fromEntries(GRID_ITEMS.map(g => [g.k, g.cell])) : {}));
  const [sel, setSel] = useState(null);
  const [shake, setShake] = useState(null);
  const done = GRID_ITEMS.every(g => placed[g.k]);
  const left = GRID_ITEMS.filter(g => !placed[g.k]).length;
  const drop = (cell) => {
    if (!sel) return;
    const it = GRID_ITEMS.find(g => g.k === sel);
    if (it.cell !== cell) { setShake(cell); setTimeout(() => setShake(s => (s === cell ? null : s)), 480); return; }
    const next = { ...placed, [sel]: cell };
    setPlaced(next); setSel(null);
    if (GRID_ITEMS.every(g => next[g.k]) && !(storedAnswer && storedAnswer.correct)) onAnswer(screen, { correct: true, solved: true });
  };
  const pend = GRID_ORDER.map(i => GRID_ITEMS[i].k).filter(k => !placed[k]);
  const lit = useTurnWalk(pend, !sel && !done && !isMentor); // mentor rejimida ekran-ichi puls o'chadi — faqat NavNext
  // Bo'lak tanlangach navbat kataklarda: to'rt teng katak TO'LQIN bilan — javob aytilmaydi (88-qonun c/d; QA 2026-09-24: ilgari hech narsa yonmasdi).
  const cellWave = useTurnHint(!!sel && !done && !isMentor);
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : !sel ? tr({ uz: `Bo'lakni tanlang (yana ${left} ta)`, ru: `Выберите часть (осталось ${left})` })
    : tr({ uz: 'Endi mos katakni bosing', ru: 'Теперь нажмите на подходящую клетку' });
  return (
    <Stage eyebrow={tr({ uz: '3-qism · Qaysi biri avval', ru: 'Часть 3 · Что первым' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorNote>{tr({ uz: "Bu darsda ikkita sodda mezon bilan tanlaymiz. Real loyihalarda boshqa mezonlar ham bo'ladi — masalan, xavfsizlik.", ru: 'На этом уроке выбираем по двум простым признакам. В реальных проектах бывают и другие — например, безопасность.' })}</MentorNote></div><NavNext optionalLive disabled={!done && !isMentor} turnBusy={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(10px,1.8vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Olti bo'lakdan qaysi biri <span className="italic" style={{ color: T.accent }}>avval</span> quriladi?</>, ru: <>Какая из шести частей строится <span className="italic" style={{ color: T.accent }}>первой</span>?</> })}</h2></div>
        {/* Mentor-gap (F-0924-03, §210 qolipi): NEGA + bitta chorlov, element o'z yorlig'i bilan; puls bilan bir halqa */}
        {/* Korpus B-18: hammasi joylangach «Bo'laklar» ro'yxati yo'qoladi — chorlov olinadi, NEGA qoladi */}
        <Mentor>{done && !isMentor
          ? tr({ uz: "Katakni har bo'lakdagi ikki javob ko'rsatadi.", ru: 'Клетку подсказывают два ответа у каждой части.' })
          : tr({ uz: <>Katakni har bo'lakdagi ikki javob ko'rsatadi — <b style={{ color: T.ink }}>«Bo'laklar»</b>dan birini bosing.</>, ru: <>Клетку подсказывают два ответа у каждой части, — в столбце <b style={{ color: T.ink }}>«Части»</b> нажмите одну.</> })}</Mentor>
        <div className="split">
          <Col>
            <div className="gr-left">
              <FlowLabel end={`${6 - left}/6`}>{tr({ uz: "Bo'laklar — birini bosing", ru: 'Части — нажмите одну' })}</FlowLabel>
              {!done && <div className="gr-list fade-up delay-1">
                {GRID_ORDER.filter(i => !placed[GRID_ITEMS[i].k]).map(i => {
                  const g = GRID_ITEMS[i]; const p = partOf(g.k);
                  return (
                    <button key={g.k} type="button" className={`gr-item ${sel === g.k ? 'sel' : ''}${turnCls(lit, g.k, pend.length > 1)}`} onClick={() => setSel(s => (s === g.k ? null : g.k))}>
                      <span className="gr-item-h"><span aria-hidden="true">{p.ic}</span> {tr(p.t)}</span>
                      <span className="gr-item-d">
                        <span className="gr-ans"><span aria-hidden="true">👥</span> {tr(ODAM[g.odam])}</span>
                        <span className="gr-ans"><span aria-hidden="true">⏱</span> {tr(g.vaqt)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>}
              {!done && <p className="small" style={{ margin: 0, color: T.ink3 }}>{tr({ uz: "Sonlar — mashq uchun taxmin, Yandex Go ma'lumoti emas.", ru: 'Числа — прикидка для упражнения, а не данные Yandex Go.' })}</p>}
              {done && <span className="done-mini fade-step">{tr({ uz: '✅ Hammasi joylandi', ru: '✅ Всё разложено' })}</span>}
              {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: <>Birinchi bo'lak — 🎯 Avval qilinadi katagidan. U yerda ikki bo'lak bor, ikkalasi ham ikki kunlik. Vaqt teng bo'lsa, bu mashqda ko'proq odamga kerak bo'lganini oldin tanlaymiz: «Mashina chaqirish». Qaysi ishni avval, qaysini keyin qilishni shunday tanlash <b>prioritet belgilash</b> deyiladi.</>, ru: <>Первая часть — из клетки 🎯 «Делаем первым». Там две части, обе на два дня. Если время одинаковое, в этом упражнении сначала берём ту, что нужна большему числу людей: «Вызов машины». Такой выбор — что делать сначала, а что потом, — называется <b>расстановкой приоритетов</b>.</> })}</p></div>}
            </div>
          </Col>
          <Col>
            <FlowLabel>{tr({ uz: "To'rt katak — mosini bosing", ru: 'Четыре клетки — нажмите нужную' })}</FlowLabel>
            <Zoomable className="zboard">
            <div className="gr-board fade-up delay-2">
              <div className="gr-yax">{ODAM_OPTS.map(o => <span key={o.v}>{tr(o.t)}</span>)}</div>
              <div className="gr-cells">
                {CELLS.map((c, ci) => {
                  const inCell = GRID_ITEMS.filter(g => placed[g.k] === c.k);
                  return (
                    <button key={c.k} type="button" className={`gr-cell ${c.k} ${sel ? 'targetable' : ''} ${shake === c.k ? 'shake' : ''}${waveCls(cellWave, ci, CELLS.length)}`} disabled={!sel} onClick={() => drop(c.k)}>
                      <span className="gr-cell-h"><span aria-hidden="true">{c.ic}</span> {tr(c.t)}</span>
                      {inCell.map(g => (
                        <span key={g.k} className={`gr-att${done && g.k === 'chaqirish' ? ' first' : ''}`}>
                          <span className="gr-att-t">{tr(partOf(g.k).t)}</span>
                        </span>
                      ))}
                    </button>
                  );
                })}
              </div>
              <div className="gr-xax">{VAQT_OPTS.map(o => <span key={o.v}><span aria-hidden="true">⏱</span> {tr(o.t)}</span>)}</div>
            </div>
            </Zoomable>
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== 9-EKRAN — TEST-3 =====
const ScreenTest3 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 3', ru: 'Проверка · 3' })} scope="module-mikro"
    question={<TestQ lead={tr({ uz: "Yangi bo'lak — \"Safarda qo'shiq tanlash\": kam yo'lovchiga kerak, qurish uch hafta oladi.", ru: 'Новая часть — «Выбор музыки в поездке»: нужна немногим пассажирам, строить три недели.' })} ask={tr({ uz: "Bu bo'lak qaysi katakka tushadi?", ru: 'В какую клетку попадёт эта часть?' })} />}
    questionText={tr({ uz: "«Safarda qo'shiq tanlash» qaysi katakka tushadi", ru: 'В какую клетку попадёт «Выбор музыки в поездке»' })}
    options={[
      tr({ uz: 'Hozircha keyinroq — kam odamga kerak, qurish ham uzoq', ru: 'Пока позже — нужно немногим, и строить долго' }),
      tr({ uz: "Vaqt bo'lsa — kam odamga kerak, demak keyinroq qilamiz", ru: 'Если будет время — нужно немногим, значит, сделаем позже' }),
      tr({ uz: "Avval qilinadi — bu kichik bo'lak, tez qo'shiladi", ru: 'Делаем первым — это маленькая часть, добавим быстро' }),
      tr({ uz: 'Rejaga tushadi — uch hafta uzoq, demak rejaga qo\'yamiz', ru: 'Идёт в план — три недели долго, значит, ставим в план' }),
    ]}
    correctIdx={INLINE_KEYS.s9}
    explainCorrect={tr({ uz: "To'g'ri — ikkala savol ham shu katakni ko'rsatadi: kam odamga kerak, vaqt uzoq. Bu \"keraksiz\" degani emas — navbati keyin keladi.", ru: 'Верно — оба вопроса указывают на эту клетку: нужно немногим, времени много. Это не значит «не нужно» — просто её очередь придёт позже.' })}
    explainWrong={{
      1: tr({ uz: "\"Vaqt bo'lsa\" katagiga tez quriladigan ish tushadi. Bu esa uch hafta oladi.", ru: 'В клетку «Если будет время» попадает то, что строится быстро. А эта часть займёт три недели.' }),
      2: tr({ uz: "Uch hafta bir haftadan ko'p — bu mashqda \"tez\" emas.", ru: 'Три недели — больше недели, в этом упражнении это не «быстро».' }),
      3: tr({ uz: "Bu mashqda \"Rejaga tushadi\" katagi ko'p odamga kerak, lekin uzoq quriladigan ishlar uchun. Bu bo'lak kam odamga kerak.", ru: 'В этом упражнении клетка «Идёт в план» — для работ, которые нужны многим, но строятся долго. А эта часть нужна немногим.' }),
      default: tr({ uz: "Ikkala savolni bering: nechta odamga kerak va qancha vaqt oladi.", ru: 'Задайте оба вопроса: скольким людям нужно и сколько времени займёт.' }),
    }}
  />
);

// ===== 10-EKRAN — «ISHLAYDI» YOKI «TAYYOR»: bizning ilovamizning buyurtma oynasi + 4 shart (bosib tekshirish) =====
// Natijalar senariydan: 1 ✓ · 2 ✗ (manzilsiz buyurtma ketdi) · 3 ✗ (ikki bosish — ikki buyurtma) · 4 ✓. Brend yo'q.
const AC_CONDS = [
  { t: { uz: 'Manzil yozib bosilsa, "Buyurtma yuborildi" yozuvi chiqadi', ru: 'Если ввести адрес и нажать — появится надпись «Заказ отправлен»' }, ok: true, run: 'one' },
  { t: { uz: "Manzil bo'sh bo'lsa, buyurtma yuborilmaydi", ru: 'Если адрес пустой — заказ не отправляется' }, ok: false, run: 'empty', res: { uz: 'Manzilsiz buyurtma yuborildi', ru: 'Заказ ушёл без адреса' } },
  { t: { uz: 'Tugma ketma-ket ikki marta bosilsa ham, faqat bitta buyurtma yuboriladi', ru: 'Даже если нажать кнопку два раза подряд — отправляется только один заказ' }, ok: false, run: 'double', res: { uz: 'Ikki buyurtma yuborildi', ru: 'Ушло два заказа' } },
  { t: { uz: "Buyurtmalar ro'yxatida yuborilgan buyurtmaning manzili ko'rinadi", ru: 'В списке заказов видно адрес отправленного заказа' }, ok: true, run: 'list' },
];
const DEMO_ADDR = { uz: 'Chilonzor, 9-kvartal', ru: 'Чиланзар, 9-й квартал' };
// Brendsiz xarita-lenta (2-o'tish 2-darsi taksi-sxemasi bilan bir oila): ko'chalar · yo'lovchi nuqtasi · buyurtma ketganda mashina chiqadi.
const OrderMap = ({ cab }) => (
  <svg className="ow-map" viewBox="0 0 300 80" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="300" height="80" className="ow-ground" />
    <rect x="182" y="6" width="70" height="26" rx="8" className="ow-park" />
    <g className="ow-street"><path d="M0 44 H300" /><path d="M110 0 V80" /><path d="M262 0 V80" /><path d="M0 8 L80 80" className="thin" /></g>
    <g transform="translate(186 44)"><circle r="12" className="ow-pin-halo" /><circle r="5.5" className="ow-pin" /></g>
    {cab && <g className="ow-cab" transform="translate(150 44)"><rect x="-11" y="-6.5" width="22" height="13" rx="4" className="ow-cab-body" /><rect x="2" y="-4.5" width="6" height="9" rx="1.5" className="ow-cab-glass" /></g>}
  </svg>
);
const ScreenOrder = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [checked, setChecked] = useState(() => (storedAnswer && storedAnswer.correct ? new Set([0, 1, 2, 3]) : new Set()));
  const [win, setWin] = useState({ addr: '', orders: [], toast: false, press: false, hl: -1 });
  const [busy, setBusy] = useState(-1);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, reducedMotion() ? 0 : ms)); };
  const send = (addr) => setWin(w => ({ ...w, orders: [...w.orders, addr], toast: true, press: true }));
  const unpress = () => setWin(w => ({ ...w, press: false }));
  const run = (i) => {
    if (busy >= 0) return;
    const c = AC_CONDS[i];
    const addr = c.run === 'empty' ? '' : tr(DEMO_ADDR);
    setBusy(i);
    setWin({ addr, orders: [], toast: false, press: false, hl: -1 });
    later(() => send(addr), 500);
    later(unpress, 700);
    if (c.run === 'double') { later(() => send(addr), 850); later(unpress, 1050); }
    if (c.run === 'list') later(() => setWin(w => ({ ...w, hl: 0 })), 900);
    later(() => {
      setBusy(-1);
      setChecked(prev => { const n = new Set(prev); n.add(i); return n; });
    }, 1300);
  };
  const done = checked.size === AC_CONDS.length;
  // QA (2026-09-24): onAnswer setState-updater ichida chaqirilardi («Cannot update a component while rendering» ogohlantirishi) — effektga ko'chirildi.
  useEffect(() => { if (done && !(storedAnswer && storedAnswer.correct)) onAnswer(screen, { correct: true, solved: true }); }, [done]); // eslint-disable-line
  const left = AC_CONDS.length - checked.size;
  const pend = AC_CONDS.map((_, i) => String(i)).filter(k => !checked.has(Number(k)));
  const lit = useTurnWalk(pend, busy < 0 && !done && !isMentor); // mentor rejimida faqat NavNext yonadi
  return (
    <Stage eyebrow={tr({ uz: '4-qism · Qachon tayyor', ru: 'Часть 4 · Когда готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive disabled={!done && !isMentor} turnBusy={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Har shartni tekshiring (yana ${left} ta)`, ru: `Проверьте каждое условие (осталось ${left})` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Dasturchi «Chaqirish tugmasi ishlaydi» dedi. Bu loyiha <span className="italic" style={{ color: T.accent }}>«tayyor»</span> deganimi?</>, ru: <>Разработчик сказал: «Кнопка вызова работает». Значит ли это, что проект <span className="italic" style={{ color: T.accent }}>«готов»</span>?</> })}</h2>
          {!done && <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: 'Bu — bizning ilovamizning "Mashina chaqirish" bo\'lagi, Yandex Go emas.', ru: 'Это часть «Вызов машины» нашего приложения, а не Yandex Go.' })}</p>}</div>
        {/* Mentor-gap (F-0924-03, §210 qolipi): NEGA + bitta chorlov, element o'z yorlig'i bilan; puls bilan bir halqa */}
        {/* Korpus B-18: to'rttasi tekshirilgach «▶ Tekshirish» tugmalari yo'q — chorlov olinadi, NEGA qoladi */}
        <Mentor>{done && !isMentor
          ? tr({ uz: "Shart bajarilganini ilovada sinab ko'rib bilasiz.", ru: 'Выполнено ли условие, вы узнаете, только проверив его в приложении.' })
          : tr({ uz: <>Shart bajarilganini ilovada sinab ko'rib bilasiz — <b style={{ color: T.ink }}>«▶ Tekshirish»</b>ni birma-bir bosing.</>, ru: <>Выполнено ли условие, вы узнаете, только проверив его в приложении, — нажимайте <b style={{ color: T.ink }}>«▶ Проверить»</b> по очереди.</> })}</Mentor>
        <div className="split">
          <Col>
            <FlowLabel>{tr({ uz: 'Buyurtma oynasi — natijani kuzating', ru: 'Окно заказа — следите за итогом' })}</FlowLabel>
            <Zoomable className="zphone">
            <div className={`ow-phone fade-up delay-1${busy >= 0 ? ' live' : ''}`} aria-label={tr({ uz: 'Buyurtma oynasi', ru: 'Окно заказа' })}>
              <span className="ow-notch" aria-hidden="true" />
              <div className="ow-mapw">
                <OrderMap cab={win.orders.some(Boolean)} />
                <span className="ow-app"><b>🚕 {tr({ uz: 'Mashina chaqirish', ru: 'Вызов машины' })}</b><i>{tr({ uz: 'bizning ilova', ru: 'наше приложение' })}</i></span>
              </div>
              <div className={`ow-field${busy >= 0 && !win.addr ? ' empty' : ''}`}><span aria-hidden="true">📍</span>{win.addr ? <span className="ow-addr">{win.addr}</span> : <span className="ow-ph">{tr({ uz: 'Manzil', ru: 'Адрес' })}</span>}</div>
              <span className={`ow-btn ${win.press ? 'press' : ''}`}>{tr({ uz: 'Chaqirish', ru: 'Вызвать' })}{win.press && <i className="ow-tap" key={win.orders.length} aria-hidden="true" />}</span>
              <span className={`ow-toast ${win.toast ? 'on' : ''}`}>✓ {tr({ uz: 'Buyurtma yuborildi', ru: 'Заказ отправлен' })}</span>
              <div className="ow-list">
                <span className="ow-list-h">{tr({ uz: 'Buyurtmalar', ru: 'Заказы' })}{win.orders.length > 0 && <b className={`ow-cnt${win.orders.length > 1 ? ' bad' : ''}`}>{win.orders.length}</b>}</span>
                {win.orders.length === 0 && <span className="ow-empty">—</span>}
                {win.orders.map((a, k) => <span key={k} className={`ow-row fade-step ${!a || (k > 0 && a === win.orders[k - 1]) ? 'bad' : ''} ${win.hl === k ? 'hl' : ''}`}>🚕 {a || tr({ uz: "(manzil yo'q)", ru: '(без адреса)' })}</span>)}
              </div>
            </div>
            </Zoomable>
          </Col>
          <Col>
            <FlowLabel end={`${checked.size}/4`}>{tr({ uz: 'Shartlar — «▶ Tekshirish»ni bosing', ru: 'Условия — нажмите «▶ Проверить»' })}</FlowLabel>
            <div className="ac-list fade-up delay-2">
              {AC_CONDS.map((c, i) => {
                const has = checked.has(i);
                return (
                  <button key={i} type="button" className={`ac-row ${has ? (c.ok ? 'ok' : 'bad') : ''} ${busy === i ? 'run' : ''}${turnCls(lit, String(i), pend.length > 1)}`} disabled={busy >= 0} onClick={() => run(i)}>
                    <span className="ac-n">{has ? (c.ok ? '✓' : '✗') : i + 1}</span>
                    <span className="ac-t">{tr(c.t)}{has && !c.ok && <em className="ac-res">{tr(c.res)}</em>}</span>
                    {!has && <span className="ac-go">{busy === i ? '…' : tr({ uz: '▶ Tekshirish', ru: '▶ Проверить' })}</span>}
                  </button>
                );
              })}
            </div>
          </Col>
        </div>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: <><b>«Ishlaydi»</b> — bir marta to'g'ri natija berdi. <b>«Tayyor»</b> — oldindan kelishilgan hamma shart tekshirildi, odam adashadigan holatlar ham. Shu shartlar ro'yxati <b>qabul shartlari</b> (Acceptance Criteria) deyiladi.</>, ru: <><b>«Работает»</b> — один раз дало верный результат. <b>«Готово»</b> — проверены все заранее согласованные условия, в том числе случаи, где человек может ошибиться. Такой список условий называется <b>критериями приёмки</b> (Acceptance Criteria).</> })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== 11-EKRAN — TEST-4 =====
const ScreenTest4 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · 4', ru: 'Проверка · 4' })} scope="module-mikro"
    question={<TestQ ask={tr({ uz: 'Qaysi shartni aniq tekshirib bo\'ladi?', ru: 'Какое условие можно точно проверить?' })} />}
    questionText={tr({ uz: "Aniq tekshiriladigan shart", ru: 'Условие, которое можно точно проверить' })}
    options={[
      tr({ uz: "Safar tugagach, baho qo'yish oynasi chiroyli ko'rinadi", ru: 'После поездки окно оценки выглядит красиво' }),
      tr({ uz: 'Mashina chaqirilgach, kutish vaqti juda qisqa bo\'ladi', ru: 'После вызова машины ждать приходится совсем недолго' }),
      tr({ uz: 'Safar tugagach, 1 dan 5 gacha yulduz tanlash oynasi chiqadi', ru: 'После поездки появляется окно выбора от 1 до 5 звёзд' }),
      tr({ uz: "Ilova ochilgach, undagi hamma narsa qulay va tushunarli bo'ladi", ru: 'После открытия приложения всё в нём удобно и понятно' }),
    ]}
    correctIdx={INLINE_KEYS.s11}
    explainCorrect={tr({ uz: "To'g'ri — safar tugagach oyna chiqadimi va unda 1 dan 5 gacha yulduz tanlash mumkinmi, buni amalda tekshirish mumkin.", ru: 'Верно — появляется ли окно после поездки и можно ли в нём выбрать от 1 до 5 звёзд, можно проверить на деле.' })}
    // Har noto'g'ri variantga alohida izoh (F-0924-06, pilot qolipi): avval rost tomoni, keyin yo'naltiruvchi savol — javob aytilmaydi.
    explainWrong={{
      0: tr({ uz: "Baho qo'yish oynasi kerak, bu to'g'ri. Lekin «chiroyli»ni qanday tekshirasiz — birovga yoqqan oyna boshqaga yoqmasligi mumkin.", ru: 'Окно оценки нужно, это верно. Но как проверить «красиво»? Окно, которое нравится одному, может не понравиться другому.' }),
      1: tr({ uz: "Uzoq kutish yo'lovchiga yoqmaydi, bu to'g'ri. Lekin «juda qisqa» necha daqiqa? Son yozilmasa, har kim o'zicha tushunadi.", ru: 'Долго ждать пассажиру неприятно, это верно. Но «совсем недолго» — это сколько минут? Без числа каждый поймёт по-своему.' }),
      3: tr({ uz: "Qulay ilovani hamma xohlaydi, bu to'g'ri. Lekin «qulay»ni qanday tekshirasiz: nimani bosganda nima chiqishi kerak?", ru: 'Удобное приложение хотят все, это верно. Но как проверить «удобно»: что нужно нажать и что должно появиться?' }),
      default: tr({ uz: "\"Chiroyli\", \"qisqa\", \"qulay\" o'zicha noaniq — har kim har xil tushunadi. Shartda nima qilinishi, natijada nima bo'lishi yoki aniq son yozilsin: masalan, \"kutish 5 daqiqadan oshmaydi\".", ru: '«Красиво», «недолго», «удобно» сами по себе неточны — каждый понимает их по-своему. В условии пишите, что делают, что получается в результате, или точное число: например, «ожидание не дольше 5 минут».' }) }}
  />
);

// ===== 12-EKRAN — BESH QADAM TARTIBI: qadamlarni navbat bilan bosib tartiblash (ballsiz) =====
const STEPS = [
  { uz: 'Shartlarni yozamiz', ru: 'Пишем условия' },
  { uz: 'Shartlarni dasturchi bilan kelishamiz', ru: 'Согласуем условия с разработчиком' },
  { uz: 'Dasturchi kodni yozadi', ru: 'Разработчик пишет код' },
  { uz: 'Har shartni birma-bir tekshiramiz', ru: 'Проверяем каждое условие по очереди' },
  { uz: 'Hammasi bajarilsa, "tayyor" deymiz', ru: 'Если всё выполнено — говорим «готово»' },
];
const STEP_ORDER = [2, 4, 0, 3, 1]; // barqaror aralash tartib
const ScreenSteps = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { isMentor } = useIsMentor();
  const [n, setN] = useState(() => (storedAnswer && storedAnswer.correct ? STEPS.length : 0));
  const [shake, setShake] = useState(-1);
  const done = n >= STEPS.length;
  // F-0925-B11: tartib yig'ilgach chap ustun bo'shaydi — «Ish tartibi» ro'yxati gorizontal o'rtaga silliq suriladi (FLIP).
  const lineRef = useRef(null);
  const slideFrom = useRef(null);
  useLayoutEffect(() => {
    const x0 = slideFrom.current; slideFrom.current = null;
    const el = lineRef.current;
    if (x0 == null || !el || !el.animate || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    const dx = x0 - el.getBoundingClientRect().left;
    if (Math.abs(dx) > 1) el.animate([{ transform: `translateX(${dx}px)` }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }, [done]);
  const tap = (i) => {
    if (done || i < n) return;
    if (i !== n) { setShake(i); setTimeout(() => setShake(s => (s === i ? -1 : s)), 480); return; }
    const nx = n + 1;
    if (nx >= STEPS.length && lineRef.current) slideFrom.current = lineRef.current.getBoundingClientRect().left;
    setN(nx);
    if (nx >= STEPS.length && !(storedAnswer && storedAnswer.correct)) onAnswer(screen, { correct: true, solved: true });
  };
  const hint = useTurnHint(!done && n === 0 && !isMentor); // mentor rejimida faqat NavNext yonadi
  return (
    <Stage eyebrow={tr({ uz: '4-qism · Qachon tayyor', ru: 'Часть 4 · Когда готово' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorNote>{tr({ uz: "Vaqt yetmasa, bu ekranni og'zaki aytib o'ting.", ru: 'Если не хватает времени, расскажите этот экран устно.' })}</MentorNote></div><NavNext optionalLive disabled={!done && !isMentor} turnBusy={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Qaysi qadam ${n + 1}-o'rinda? Uni bosing`, ru: `Какой шаг ${n + 1}-й? Нажмите на него` })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Shartlar qachon yoziladi — ishdan <span className="italic" style={{ color: T.accent }}>oldinmi, keyinmi</span>?</>, ru: <>Когда пишут условия — <span className="italic" style={{ color: T.accent }}>до работы или после</span>?</> })}</h2></div>
        {/* Mentor-gap (F-0924-03, §210 qolipi): NEGA + bitta chorlov, element o'z yorlig'i bilan; puls bilan bir halqa */}
        {/* Korpus B-18: chorlov navbatdagi o'ringa ergashadi («birinchi» faqat boshida rost); tartib yig'ilgach faqat NEGA */}
        <Mentor>{done && !isMentor
          ? tr({ uz: 'Ishda har qadam oldingisiga tayanadi.', ru: 'В работе каждый шаг опирается на предыдущий.' })
          : n > 0 && !isMentor
            ? tr({ uz: <>Ishda har qadam oldingisiga tayanadi — <b style={{ color: T.ink }}>«Qadamlar»</b>dan keyingisini bosing.</>, ru: <>В работе каждый шаг опирается на предыдущий, — в столбце <b style={{ color: T.ink }}>«Шаги»</b> нажмите следующий.</> })
            : tr({ uz: <>Ishda har qadam oldingisiga tayanadi — <b style={{ color: T.ink }}>«Qadamlar»</b>dan birinchi keladiganini bosing.</>, ru: <>В работе каждый шаг опирается на предыдущий, — в столбце <b style={{ color: T.ink }}>«Шаги»</b> нажмите тот, что идёт первым.</> })}</Mentor>
        <div className={`split${done ? ' st-solo' : ''}`}>
          {!done && <Col>
            <FlowLabel>{tr({ uz: 'Qadamlar — navbat bilan bosing', ru: 'Шаги — нажимайте по порядку' })}</FlowLabel>
            <div className="st-pool fade-up delay-1">
              {STEP_ORDER.filter(i => i >= n).map((i, j) => (
                <button key={i} type="button" className={`st-chip ${shake === i ? 'shake' : ''}${hint ? ` turn-ring turn-wave wv5 w${j + 1}` : ''}`} onClick={() => tap(i)}>{tr(STEPS[i])}</button>
              ))}
            </div>
          </Col>}
          <div ref={lineRef} className="st-lcol">
          <Col>
            <FlowLabel end={`${n}/5`}>{tr({ uz: 'Ish tartibi', ru: 'Порядок работы' })}{done && <span className="done-mini st-ok fade-step">{tr({ uz: "✅ Tartib to'g'ri", ru: '✅ Порядок верный' })}</span>}</FlowLabel>
            <ol className="st-line fade-up delay-2">
              {STEPS.map((s, i) => (
                <li key={i} className={`st-step ${i < n ? 'on' : ''}`}>
                  <span className="st-n">{i < n ? '✓' : i + 1}</span>
                  <span className="st-t">{i < n ? tr(s) : <span className="st-ph">{tr({ uz: `${i + 1}-qadam`, ru: `Шаг ${i + 1}` })}</span>}</span>
                </li>
              ))}
            </ol>
          </Col>
          </div>
        </div>
        {done && <div className="frame-success fade-step"><p className="body" style={{ margin: 0 }}>{tr({ uz: "Shartlar ish boshlanishidan oldin yoziladi. Shunda dasturchi nimani qurishini oldindan biladi, \"tayyor\" deganda esa nimani tekshirish kerakligi aniq bo'ladi. Tekshiruvda xato chiqsa, dasturchi tuzatadi va shart qayta tekshiriladi.", ru: 'Условия пишут до начала работы. Тогда разработчик заранее знает, что строить, а когда говорят «готово», ясно, что проверять. Если при проверке нашлась ошибка — разработчик исправляет, и условие проверяют заново.' })}</p></div>}
      </div>
    </Stage>
  );
};

// ===== G'OYA-KARTA (oldingi dars «Kim uchun va qanday muammo?») — bridgeCard.js'dan O'QIYDI; yo'q bo'lsa READY_IDEAS tanlovi =====
const ideaById = (id) => READY_IDEAS.find(x => x.id === id) || null;
const CARD_Q = {
  kim: { uz: 'Sayt kim uchun?', ru: 'Для кого сайт?' },
  muammo: { uz: 'Odam qanday muammoga duch keladi?', ru: 'С какой проблемой сталкивается человек?' },
  qiladi: { uz: 'Sayt nima qiladi?', ru: 'Что делает сайт?' },
  erishadi: { uz: 'Odam oxirida nimaga erishadi?', ru: 'Чего человек добивается в итоге?' },
};
const hasOwnCard = (card) => !!(card && (clean(card.kim) || clean(card.qiladi) || clean(card.erishadi)));
const cardRows = (card, ideaId) => {
  if (hasOwnCard(card)) return { kim: card.kim, muammo: gapOf(card.qachon, card.kim, card.ogir), qiladi: card.qiladi, erishadi: card.erishadi, own: true };
  const idea = ideaById(ideaId || (card && card.ideaId));
  // QA 2026-09-24: RU da «{QACHON} {KIM} {OG'IR}» qolipi tayyor g'oyalarda buziladi (kiyim: «…подросток, покупающий одежду онлайн одежда не подходит…»,
  // qolganlarida sifatdosh oborotidan keyin vergul yo'q) — RU da faqat og'ir qismi ko'rsatiladi («Kim?» qatori tepada turibdi).
  if (idea) return { kim: tr(idea.kim), muammo: __lang === 'ru' ? capFirst(`${tr(idea.ogir)}.`) : gapOf(tr(idea.qachon), tr(idea.kim), tr(idea.ogir)), qiladi: tr(idea.qiladi), erishadi: tr(idea.erishadi), own: false, idea };
  return null;
};
const IdeaCard = ({ rows }) => (
  <div className="ic-card">
    <span className="ic-h">🗂 {tr({ uz: 'Kartangiz', ru: 'Ваша карточка' })}{rows.idea ? ` · ${tr(rows.idea.olam)}` : ''}</span>
    {['kim', 'muammo', 'qiladi', 'erishadi'].map(k => (
      <div key={k} className="ic-row2"><span className="ic-q">{tr(CARD_Q[k])}</span><span className="ic-val">{clean(rows[k]) || '—'}</span></div>
    ))}
  </div>
);
const IdeaPicker = ({ value, onPick, wave }) => (
  <div className="ip-box">
    <span className="flow-label">{tr({ uz: "Shu to'rt g'oyadan birini tanlang", ru: 'Выберите одну из этих четырёх идей' })}</span>
    <div className="ip-row">
      {READY_IDEAS.map((x, i) => <button key={x.id} className={`ip-chip ${value === x.id ? 'on' : ''}${waveCls(!!wave && !value, i, READY_IDEAS.length)}`} onClick={() => onPick(x.id)}>{tr(x.olam)}</button>)}
    </div>
  </div>
);
// Buzuq karta himoyasi (F-0915-02 oilasi, pilot B1 cardSafe): obyekt bo'lmasa — bo'sh; qiymatlardan faqat satr va ro'yxat
// o'tadi (ro'yxat — shartlar/bo'laklar; ichini cardConds/clean alohida tozalaydi). Yiqilish o'rniga «karta yo'q» yo'li ochiladi.
const cardSafe = () => { const c = cardRead(); if (!c || typeof c !== 'object' || Array.isArray(c)) return {}; const o = {}; Object.keys(c).forEach(k => { const v = c[k]; if (typeof v === 'string' || Array.isArray(v)) o[k] = v; }); return o; };
const copyText = async (txt) => {
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(txt); return true; } } catch { /* zaxira yo'l */ }
  try { const ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); document.body.removeChild(ta); return ok; } catch { return false; }
};
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* jim */ } };

// ===== 13-EKRAN — HIKOYANGIZ: ustaxona (kartangiz yonda namuna bo'lib turadi, maydonga o'zi tushmaydi) =====
const STORY_KEY = 'bridge-b5-hikoya';
const STORY_FIELDS = [
  { k: 'kim', lbl: { uz: 'Kim?', ru: 'Кто?' }, ph: { uz: "hovlida futbol o'ynaydigan o'smir", ru: 'подросток, который играет в футбол во дворе' }, ph0: { uz: 'bitta odam — u kim?', ru: 'один человек — кто он?' } },
  { k: 'nima', lbl: { uz: 'Nimani xohlaydi?', ru: 'Чего хочет?' }, ph: { uz: "maydonning bo'sh vaqtini oldindan band qilish", ru: 'заранее бронировать свободное время на поле' }, ph0: { uz: 'u saytda nima qilmoqchi?', ru: 'что он хочет сделать на сайте?' } },
  { k: 'why', lbl: { uz: 'Nima uchun?', ru: 'Зачем?' }, ph: { uz: "maydon bo'shashini kutmasdan do'stlarim bilan o'ynash", ru: 'играть с друзьями, не дожидаясь, пока поле освободится' }, ph0: { uz: 'shundan keyin nimaga erishadi?', ru: 'чего он этим добьётся?' } },
];
// Namuna faqat o'z g'oyasiga mos bo'lganda (futbol) — boshqa g'oyada futbol gapi chiqmaydi, o'rnida neytral savol (QA 2026-09-24, B2/B3 naqshi).
// Qolipga qo'yishdan oldin takror so'zlar olinadi: «Men …», «… sifatida», «…ni» (D-4), «… uchun» (RU juftlari ru: maydonida).
const TRIM_RU = { ru: { kim: /^я,?\s+как\s+/i, nima: /^хочу\s+/i, why: /^чтобы\s+/i } };
const trimKim = (s) => clean(s).replace(/^men\s+/i, '').replace(/\s+sifatida[.,]?$/i, '').replace(TRIM_RU.ru.kim, '').replace(/,$/, '');
const trimNima = (s) => { const t = clean(s).replace(TRIM_RU.ru.nima, '').replace(/\s+xohlayman[.,]?$/i, '').replace(/[.,]$/, ''); return __lang === 'ru' ? t : t.replace(/ni$/i, ''); };
const trimWhy = (s) => clean(s).replace(/^[—-]\s*/, '').replace(/\s+uchun[.!]?$/i, '').replace(TRIM_RU.ru.why, '').replace(/[.!]$/, '');
const storyOf = (f) => {
  const k = trimKim(f.kim), n = trimNima(f.nima), w = trimWhy(f.why);
  if (!k && !n && !w) return '';
  return tr({ uz: `Men ${k || '…'} sifatida, ${n ? `${n}ni` : '…'} xohlayman — ${w || '…'} uchun.`, ru: `Я, как ${k || '…'}, хочу ${n || '…'} — чтобы ${w || '…'}.` });
};
// KIM ko'plikda: UZ — oxirgi so'z «-lar…» (bosh so'z oxirida) · RU — birinchi so'z ko'plik shaklida (bosh so'z boshida).
const KIM_PL_UZ = /(?:^|[^a-z'\u02BB\u2019])[a-z'\u02BB\u2019]{2,}lar(?:i|imiz|ingiz)?$/i;
const KIM_PL_RU_END = { ru: ['ики', 'ки', 'ы', 'ли', 'ди', 'ни', 'ри', 'ти', 'цы'] };
const KIM_PL_RU = new RegExp('^\\p{Script=Cyrillic}{3,}(?:' + KIM_PL_RU_END.ru.join('|') + ')(?![\\p{Script=Cyrillic}])', 'iu');
const storyHints = (f) => {
  const k = trimKim(f.kim).toLowerCase();
  const n = normTxt(trimNima(f.nima)), w = normTxt(trimWhy(f.why));
  return {
    kim: k && (KIM_PL_UZ.test(k) || KIM_PL_RU.test(k)) ? tr({ uz: "Bu qolipda bitta odam nomidan yozamiz: \"o'smirlar\" o'rniga \"futbol o'ynaydigan o'smir\". Shunda uning ehtiyoji aniqroq ko'rinadi.", ru: 'В этом шаблоне пишем от имени одного человека: вместо «подростки» — «подросток, который играет в футбол». Так его потребность видна точнее.' }) : null,
    why: w && n && (w === n || (n.length >= 6 && w.includes(n)) || (w.length >= 6 && n.includes(w))) ? tr({ uz: 'Bu hali harakat. Shundan keyin odam nimaga erishadi?', ru: 'Это пока действие. Чего человек добьётся после этого?' }) : null,
  };
};
const normTxt = (s) => clean(s).toLowerCase().replace(/[.,!?«»"'—-]/g, '').replace(/\s+/g, ' ');
const ScreenStory = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useIsMentor();
  const [card] = useState(() => cardSafe());
  const [ideaId, setIdeaId] = useState(() => (ideaById(clean(card && card.ideaId)) ? clean(card.ideaId) : ''));
  const [f, setF] = useState(() => { const s = lsGet(STORY_KEY); return isObj(s) ? { kim: str(s.kim), nima: str(s.nima), why: str(s.why) } : { kim: '', nima: '', why: '' }; });
  const [savedSnap, setSavedSnap] = useState(() => { const s = lsGet(STORY_KEY); return isObj(s) && s.saved === true ? JSON.stringify({ kim: str(s.kim), nima: str(s.nima), why: str(s.why) }) : null; });
  const signal = usePracticeSignal(screen, storedAnswer, onAnswer, live);
  const rows = cardRows(card, ideaId);
  const needIdea = !rows;
  const hints = storyHints(f);
  const ok = { kim: filled(f.kim) && !hints.kim, nima: filled(f.nima), why: filled(f.why) && !hints.why };
  const allOk = ok.kim && ok.nima && ok.why;
  const dirty = savedSnap !== JSON.stringify(f);
  const saved = !!savedSnap && !dirty;
  const everSaved = !!savedSnap || !!(storedAnswer && storedAnswer.solved);
  const save = () => {
    if (!allOk) return;
    const hikoya = storyOf(f);
    const patch = { hikoya };
    if (rows && !rows.own && rows.idea) patch.ideaId = rows.idea.id;
    cardWrite(patch);
    lsSet(STORY_KEY, { ...f, saved: true });
    setSavedSnap(JSON.stringify(f));
    signal({ practice: 'story', hikoya });
  };
  const firstBad = STORY_FIELDS.findIndex(p => !ok[p.k]);
  const navLabel = isMentor || (everSaved && !dirty) ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : needIdea ? tr({ uz: "Avval g'oyalardan birini tanlang", ru: 'Сначала выберите одну из идей' })
    : firstBad >= 0 ? (hints[STORY_FIELDS[firstBad].k]
      ? tr({ uz: `${['①', '②', '③'][firstBad]} «${STORY_FIELDS[firstBad].lbl.uz}» javobini aniqlashtiring`, ru: `${['①', '②', '③'][firstBad]} Уточните ответ «${STORY_FIELDS[firstBad].lbl.ru}»` })
      : tr({ uz: `${['①', '②', '③'][firstBad]} «${STORY_FIELDS[firstBad].lbl.uz}» savoliga javob yozing`, ru: `${['①', '②', '③'][firstBad]} Ответьте на вопрос «${STORY_FIELDS[firstBad].lbl.ru}»` }))
    : tr({ uz: '✓ «Saqlash»ni bosing', ru: '✓ Нажмите «Сохранить»' });
  const [focus, setFocus] = useState(false);
  const pend = STORY_FIELDS.map(p => p.k).filter(k => !filled(f[k]));
  const lit = useTurnWalk(pend, !needIdea && !focus && !isMentor);
  const saveTurn = useTurnHint(allOk && dirty && !isMentor);
  // Kartasiz o'quvchi: navbat avval g'oya-chiplarida (to'lqin — to'rttasi teng, birortasi «to'g'ri» emas).
  const ideaWave = useTurnHint(needIdea && !ideaId && !isMentor);
  const story = storyOf(f);
  const futbolSample = (rows && rows.idea ? rows.idea.id : clean(card && card.ideaId)) === 'futbol';
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot · hikoyangiz", ru: 'Практика · ваша история' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Hikoya yozganlar', ru: '✍️ Кто написал историю' })} /><MentorNote>{tr(MENTOR_WATCH)}</MentorNote><StudentPracticePulse live={live} screen={screen} /></div><NavNext optionalLive turnBusy={!saved && !isMentor} disabled={!(everSaved && !dirty) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tanlagan g'oyangizga <span className="italic" style={{ color: T.accent }}>bitta hikoya</span> yoza olasizmi?</>, ru: <>Сможете написать <span className="italic" style={{ color: T.accent }}>одну историю</span> для выбранной идеи?</> })}</h2></div>
        {/* Mentor-gap (F-0924-03, §210 qolipi): NEGA + bitta chorlov, element o'z yorlig'i bilan; puls bilan bir halqa */}
        {/* Korpus B-18: NEGA bir xil, chorlov puls turgan halqaga ergashadi — g'oya → bo'sh savol → «✓ Saqlash»; saqlangach faqat NEGA */}
        <Mentor>{needIdea && !isMentor
          ? tr({ uz: <>Dasturchi kim uchun qurayotganini hikoyadan biladi — avval <b style={{ color: T.ink }}>to'rt g'oyadan</b> birini tanlang.</>, ru: <>Для кого строить, разработчик узнаёт из истории, — сначала выберите <b style={{ color: T.ink }}>одну из четырёх идей</b>.</> })
          : !isMentor && saved ? tr({ uz: 'Dasturchi kim uchun qurayotganini hikoyadan biladi.', ru: 'Для кого строить, разработчик узнаёт из истории.' })
          : !isMentor && allOk ? tr({ uz: <>Dasturchi kim uchun qurayotganini hikoyadan biladi — <b style={{ color: T.ink }}>«✓ Saqlash»</b>ni bosing.</>, ru: <>Для кого строить, разработчик узнаёт из истории, — нажмите <b style={{ color: T.ink }}>«✓ Сохранить»</b>.</> })
          // Tekshiruvchi 25.09: maydon to'lgan, lekin 💡 maslahat chiqqan — chorlov «javob yozing» emas, NavNext yorlig'i bilan bir xil «aniqlashtiring».
          : !isMentor && firstBad >= 0 && hints[STORY_FIELDS[firstBad].k] ? tr({ uz: <>Dasturchi kim uchun qurayotganini hikoyadan biladi — <b style={{ color: T.ink }}>«{STORY_FIELDS[firstBad].lbl.uz}»</b> javobini aniqlashtiring.</>, ru: <>Для кого строить, разработчик узнаёт из истории, — уточните ответ <b style={{ color: T.ink }}>«{STORY_FIELDS[firstBad].lbl.ru}»</b>.</> })
          : !isMentor && firstBad > 0 ? tr({ uz: <>Dasturchi kim uchun qurayotganini hikoyadan biladi — <b style={{ color: T.ink }}>«{STORY_FIELDS[firstBad].lbl.uz}»</b> savoliga javob yozing.</>, ru: <>Для кого строить, разработчик узнаёт из истории, — ответьте на вопрос <b style={{ color: T.ink }}>«{STORY_FIELDS[firstBad].lbl.ru}»</b>.</> })
          : tr({ uz: <>Dasturchi kim uchun qurayotganini hikoyadan biladi — <b style={{ color: T.ink }}>«Kim?»</b> savoliga javob yozing.</>, ru: <>Для кого строить, разработчик узнаёт из истории, — ответьте на вопрос <b style={{ color: T.ink }}>«Кто?»</b>.</> })}</Mentor>
        <div className="split">
          <Col>
            <FlowLabel end={`${['kim', 'nima', 'why'].filter(k => ok[k]).length}/3`}>{tr({ uz: 'Hikoyangiz — uch savol', ru: 'Ваша история — три вопроса' })}</FlowLabel>
            <div className="pw-form fade-up delay-1">
              {STORY_FIELDS.map((p, i) => (
                <React.Fragment key={p.k}>
                  <label className={`pw-f slot-${p.k} ${ok[p.k] ? 'on' : ''}${turnCls(lit, p.k, pend.length > 1)}`}>
                    <span style={{ color: ok[p.k] ? T.success : T.ink }}>{ok[p.k] ? '✓' : ['①', '②', '③'][i]} {tr(p.lbl)}</span>
                    <input value={f[p.k]} disabled={needIdea && !isMentor} onChange={e => setF(prev => ({ ...prev, [p.k]: e.target.value }))} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={tr(futbolSample ? p.ph : p.ph0)} />
                  </label>
                  {hints[p.k] && <p className="sl-hint fade-step">💡 {hints[p.k]}</p>}
                </React.Fragment>
              ))}
            </div>
            {/* 58-qonun (QA 2026-09-24): «Saqlash» hikoya-oynasining sarlavha-qatorida — ikki maslahat chiqqanda ham ekran aylanmaydi */}
            <div className={`gb-sent ${allOk ? 'ok' : ''}`}>
              <div className="gb-sent-h">
                <span className="flow-label">{tr({ uz: 'Hikoya', ru: 'История' })}</span>
                {/* «HIKOYA» yorlig'i yonida — so'z ikki marta o'qilmasin («HIKOYA ✓ Hikoya saqlandi» edi) */}
                {saved && <span className="done-mini fade-step">{tr({ uz: '✓ Saqlandi', ru: '✓ Сохранено' })}</span>}
                <button className={`pw-save${saveTurn ? ' turn-ring' : ''}`} disabled={!allOk || !dirty} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
              </div>
              <p className="gb-sent-t">{story || <span className="gb-ph">{tr({ uz: 'Men … sifatida, …ni xohlayman — … uchun.', ru: 'Я, как …, хочу … — чтобы … .' })}</span>}</p>
            </div>
          </Col>
          <Col>
            <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "Kartada sayt nima qilishi yozilgan edi. Endi shu fikrni odamning o'z tilida yozamiz: «Men … ni xohlayman».", ru: 'В карточке записано, что делает сайт. Теперь запишем ту же мысль словами самого человека: «Я хочу …».' })}</p>
            {rows ? <IdeaCard rows={rows} /> : null}
            {!hasOwnCard(card) && <IdeaPicker value={ideaId} onPick={setIdeaId} wave={ideaWave} />}
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== 14-EKRAN — BO'LAKLAR VA BIRINCHISI: ustaxona (4 bo'lak → ikki javob → katak o'zi chiqadi → 🎯 dan birinchisi + sabab) =====
const PARTS_KEY = 'bridge-b5-bolaklar';
const cellFor = (odam, vaqt) => (!odam || !vaqt ? null : odam === 'kop' ? (vaqt === 'tez' ? 'avval' : 'reja') : (vaqt === 'tez' ? 'vaqt' : 'keyin'));
const ODAM_OPTS = [{ v: 'kop', t: { uz: "Ko'p odamga", ru: 'Многим людям' } }, { v: 'kam', t: { uz: 'Kam odamga', ru: 'Немногим людям' } }];
const VAQT_OPTS = [{ v: 'tez', t: { uz: 'Bir haftagacha', ru: 'До недели' } }, { v: 'uzoq', t: { uz: "Bir haftadan ko'p", ru: 'Больше недели' } }];
// Sababda kamida bitta mezon ko'rinsin: odam soni yoki vaqt (so'z boshidan qidiriladi).
const SABAB_UZ = /(?:^|[^a-z'\u02BB\u2019])(odam|kishi|foydalanuvchi|hamma|ko['\u02BB\u2019]p|kam|kun|hafta|soat|daqiqa|vaqt|tez|uzoq|oson|qisqa)/i;
const SABAB_RU_WORDS = { ru: ['люд', 'человек', 'польз', 'все', 'многи', 'много', 'мало', 'немног', 'день', 'дн', 'недел', 'час', 'минут', 'врем', 'быстр', 'долг', 'прост', 'коротк'] };
const SABAB_RU = new RegExp('(?:^|[^\\p{Script=Cyrillic}])(?:' + SABAB_RU_WORDS.ru.join('|') + ')', 'iu');
const ScreenParts2 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useIsMentor();
  // F-0915-02: saqlangan yozuv buzuq bo'lsa (qator obyekt emas, javob ro'yxatda yo'q, indeks chegaradan tashqari) — tozalanadi.
  const init = (() => {
    const s = lsGet(PARTS_KEY);
    if (!isObj(s) || !Array.isArray(s.rows) || s.rows.length !== 4) return null;
    const rows = s.rows.map(r => (isObj(r) ? r : {})).map(r => ({ nom: str(r.nom), odam: ODAM_OPTS.some(o => o.v === r.odam) ? r.odam : '', vaqt: VAQT_OPTS.some(o => o.v === r.vaqt) ? r.vaqt : '' }));
    const first = Number.isInteger(s.first) && s.first >= 0 && s.first < 4 ? s.first : -1;
    return { rows, first, sabab: str(s.sabab), saved: s.saved === true };
  })();
  const [rows, setRows] = useState(() => (init ? init.rows : [0, 1, 2, 3].map(() => ({ nom: '', odam: '', vaqt: '' }))));
  const [first, setFirst] = useState(() => (init ? init.first : -1));
  const [sabab, setSabab] = useState(() => (init ? init.sabab : ''));
  const [savedSnap, setSavedSnap] = useState(() => (init && init.saved ? JSON.stringify({ rows: init.rows, first: init.first, sabab: init.sabab }) : null));
  const signal = usePracticeSignal(screen, storedAnswer, onAnswer, live);
  const setR = (i, patch) => setRows(prev => prev.map((r, k) => (k === i ? { ...r, ...patch } : r)));
  const named = rows.filter(r => filled(r.nom)).length;
  const s1 = named === 4;
  const s2 = s1 && rows.every(r => r.odam && r.vaqt);
  const cells = rows.map(r => cellFor(r.odam, r.vaqt));
  const avvalIdx = cells.map((c, i) => (c === 'avval' ? i : -1)).filter(i => i >= 0);
  const firstOk = first >= 0 && cells[first] === 'avval';
  const sababTyped = filled(sabab, 3);
  const sababOk = sababTyped && (SABAB_UZ.test(sabab) || SABAB_RU.test(sabab));
  const s3 = s2 && firstOk && sababOk;
  const snap = JSON.stringify({ rows, first, sabab });
  const dirty = savedSnap !== snap;
  const saved = !!savedSnap && !dirty;
  const everSaved = !!savedSnap || !!(storedAnswer && storedAnswer.solved);
  const save = () => {
    if (!s3) return;
    const bolaklar = rows.map(r => clean(r.nom));
    cardWrite({ bolaklar, bolak: bolaklar[first], sabab: clean(sabab) });
    lsSet(PARTS_KEY, { rows, first, sabab, saved: true });
    setSavedSnap(snap);
    signal({ practice: 'first-part', bolaklar, bolak: bolaklar[first], sabab: clean(sabab) });
  };
  const navLabel = isMentor || (everSaved && !dirty) ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : !s1 ? tr({ uz: `① 4 ta bo'lak yozing (${named}/4)`, ru: `① Напишите 4 части (${named}/4)` })
    : !s2 ? tr({ uz: '② Har bo\'lakka ikki javob bering', ru: '② Дайте каждой части два ответа' })
    // Tekshiruvchi: bu holatda ② chipi allaqachon ✓ — yorliq ochiq qolgan ③ chipiga bog'lanadi (ilgari «②» ✓ chip bilan zid edi).
    : avvalIdx.length === 0 ? tr({ uz: '③ 🎯 katagiga bo\'lak kerak', ru: '③ Нужна часть в клетке 🎯' })
    : !firstOk ? tr({ uz: '③ 🎯 dan birinchisini tanlang', ru: '③ Выберите первую из 🎯' })
    : !sababTyped ? tr({ uz: '③ Sababini yozing', ru: '③ Напишите причину' })
    : !sababOk ? tr({ uz: "③ Sababda odam soni yoki vaqt ko'rinsin", ru: '③ Пусть в причине будет число людей или время' })
    : tr({ uz: '✓ «Saqlash»ni bosing', ru: '✓ Нажмите «Сохранить»' });
  const saveTurn = useTurnHint(s3 && dirty && !isMentor);
  // 88-qonun: navbat maydonlar bo'ylab bosqichma-bosqich yuradi — nomlar → ikki javob-guruhi → «Shundan boshlayman» → sabab.
  // Halqa GURUHga (ikkala variantga teng) tushadi, variantning o'ziga emas — javobni aytib qo'ymaydi.
  const [focusIn, setFocusIn] = useState(false);
  const pend = !s1 ? rows.map((r, i) => (filled(r.nom) ? null : `n${i}`)).filter(Boolean)
    : !s2 ? rows.flatMap((r, i) => [r.odam ? null : `o${i}`, r.vaqt ? null : `v${i}`]).filter(Boolean)
    : !firstOk ? avvalIdx.map(i => `f${i}`)
    : !sababTyped ? ['sab'] : [];
  const lit = useTurnWalk(pend, !focusIn && !isMentor);
  const walking = pend.length > 1;
  const onFocusIn = e => { if (e.target.tagName === 'INPUT') setFocusIn(true); };
  const onFocusOut = e => { if (e.target.tagName === 'INPUT') setFocusIn(false); };
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot · bo'laklaringiz", ru: 'Практика · ваши части' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorPracticeStats live={live} screen={screen} label={tr({ uz: "✍️ Birinchi bo'lakni tanlaganlar", ru: '✍️ Кто выбрал первую часть' })} /><MentorNote>{tr(MENTOR_WATCH)}</MentorNote><StudentPracticePulse live={live} screen={screen} /></div><NavNext optionalLive turnBusy={!saved && !isMentor} disabled={!(everSaved && !dirty) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen bp-screen dense" style={{ gap: 'clamp(10px,1.8vw,16px)' }} onFocus={onFocusIn} onBlur={onFocusOut}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>G'oyangiz qaysi <span className="italic" style={{ color: T.accent }}>bo'lakdan</span> boshlanadi?</>, ru: <>С какой <span className="italic" style={{ color: T.accent }}>части</span> начинается ваша идея?</> })}</h2></div>
        {/* Mentor-gap (F-0924-03, §210 qolipi): NEGA + bitta chorlov; NavNext yorlig'i bilan bir halqa, element o'z nomi bilan (👦 QA) */}
        <Mentor>{!isMentor && s3 && saved ? tr({ uz: "Bo'laklaringiz saqlandi — keyingi ekranda birinchisiga shart yozasiz.", ru: 'Ваши части сохранены — на следующем экране вы напишете условия для первой.' })
          : !isMentor && s3 ? tr({ uz: <>Saqlangan bo'laklar keyingi ekranda shart yozishga kerak bo'ladi — <b style={{ color: T.ink }}>«✓ Saqlash»</b>ni bosing.</>, ru: <>Сохранённые части понадобятся на следующем экране для условий, — нажмите <b style={{ color: T.ink }}>«✓ Сохранить»</b>.</> })
          : !s1 || isMentor ? tr({ uz: <>Taksi bo'laklariga bergan ikki savolni o'z bo'laklaringizga ham berasiz — avval <b style={{ color: T.ink }}>4 ta bo'lak</b> nomini yozing.</>, ru: <>Два вопроса, которые вы задавали частям такси, вы зададите и своим частям, — сначала напишите названия <b style={{ color: T.ink }}>4 частей</b>.</> })
          : !s2 ? tr({ uz: <>Ikki javob bo'lakning katagini ko'rsatadi — har bo'lakda <b style={{ color: T.ink }}>👥</b> va <b style={{ color: T.ink }}>⏱</b> qatoridan bittadan tanlang.</>, ru: <>Два ответа показывают клетку части, — у каждой части выберите по одному в строках <b style={{ color: T.ink }}>👥</b> и <b style={{ color: T.ink }}>⏱</b>.</> })
          // Korpus B-18: 🎯 bo'sh bo'lsa «Shundan boshlayman» tugmasi YO'Q — chorlov katak shartini aytadi (tugma nomi bilan emas).
          // Metodist 24.09: «o'zgartiring» + qalin tugma-yorliqlari javobni qayta bosishga chaqirardi (bo'lak o'zgarmay qolardi) —
          // chorlov bo'lakning o'zini qayta yozishni aytadi (ETALON 43, senariy 💡 maslahati bilan bir yo'nalish).
          : avvalIdx.length === 0 ? tr({ uz: "Birinchi bo'lak faqat 🎯 katagidan olinadi — bitta bo'lagingizni ko'p odamga kerak va bir haftada quriladigan qilib qayta yozing.", ru: 'Первая часть берётся только из клетки 🎯, — перепишите одну часть так, чтобы она была нужна многим и строилась не дольше недели.' })
          : !firstOk ? tr({ uz: <>Birinchi bo'lak 🎯 katagidan olinadi — <b style={{ color: T.ink }}>«Shundan boshlayman»</b>ni bosing.</>, ru: <>Первая часть берётся из клетки 🎯, — нажмите <b style={{ color: T.ink }}>«Начну с неё»</b>.</> })
          // Tekshiruvchi 25.09: sabab yozilgan, lekin mezon ko'rinmaydi (💡 maslahat chiqqan) — «javob yozing» emas, «aniqlashtiring».
          : sababTyped ? tr({ uz: <>Sabab tanlovingizni tushuntiradi — <b style={{ color: T.ink }}>«Nima uchun shu bo'lak birinchi?»</b> javobini aniqlashtiring.</>, ru: <>Причина объясняет ваш выбор, — уточните ответ на вопрос <b style={{ color: T.ink }}>«Почему эта часть первая?»</b>.</> })
          : tr({ uz: <>Sabab tanlovingizni tushuntiradi — <b style={{ color: T.ink }}>«Nima uchun shu bo'lak birinchi?»</b> savoliga javob yozing.</>, ru: <>Причина объясняет ваш выбор, — ответьте на вопрос <b style={{ color: T.ink }}>«Почему эта часть первая?»</b>.</> })}</Mentor>
        {!s1 && <p className="small fade-up delay-1" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "G'oyangizni 4 ta asosiy bo'lakka ajrating — juda mayda ham, juda katta ham emas: har birini alohida bajarib, tekshirib bo'ladigan qilib yozing.", ru: 'Разбейте идею на 4 основные части — не слишком мелкие и не слишком крупные, чтобы каждую можно было отдельно сделать и проверить.' })}</p>}
        {/* F-0925-B13: jadval — har tugma-guruh o'z savolining tagida (ilgari 👥/⏱ belgisining ma'nosi o'ng burchakda edi) */}
        <div className="bp-grid fade-up delay-2">
          <div className="bp-head" aria-hidden="true">
            <span />
            <span>{tr({ uz: "Bo'lak nomi", ru: 'Название части' })}</span>
            <span>👥 {tr({ uz: 'Nechta odamga kerak?', ru: 'Скольким людям нужно?' })}</span>
            <span>⏱ {tr({ uz: 'Qancha vaqt oladi?', ru: 'Сколько времени займёт?' })}</span>
            <span>{tr({ uz: 'Katak', ru: 'Клетка' })}</span>
          </div>
          {rows.map((r, i) => {
            const c = cells[i] ? cellOf(cells[i]) : null;
            return (
              <div key={i} className={`bp-row ${c ? c.k : ''} ${first === i && firstOk ? 'first' : ''}`}>
                <span className={`bp-n${filled(r.nom) ? ' on' : ''}`} aria-hidden="true">{filled(r.nom) ? '✓' : i + 1}</span>
                <label className={`pw-f bp-name ${filled(r.nom) ? 'on' : ''}${turnCls(lit, `n${i}`, walking)}`}>
                  <input value={r.nom} onChange={e => setR(i, { nom: e.target.value })} placeholder={tr({ uz: `${i + 1}-bo'lak`, ru: `Часть ${i + 1}` })} aria-label={tr({ uz: `${i + 1}-bo'lak`, ru: `Часть ${i + 1}` })} />
                </label>
                <div className={`bp-tg odam${turnCls(lit, `o${i}`, walking)}`} role="group" aria-label={tr({ uz: 'Nechta odamga kerak?', ru: 'Скольким людям нужно?' })}>
                  <span className="bp-tg-q" aria-hidden="true">👥 {tr({ uz: 'Nechta odamga?', ru: 'Скольким?' })}</span>
                  {ODAM_OPTS.map(o => <button key={o.v} type="button" className={`bp-opt ${r.odam === o.v ? 'on' : ''}`} disabled={!filled(r.nom) && !isMentor} onClick={() => setR(i, { odam: o.v })}>{tr(o.t)}</button>)}
                </div>
                <div className={`bp-tg vaqt${turnCls(lit, `v${i}`, walking)}`} role="group" aria-label={tr({ uz: 'Qancha vaqt oladi?', ru: 'Сколько времени займёт?' })}>
                  <span className="bp-tg-q" aria-hidden="true">⏱ {tr({ uz: 'Qancha vaqt?', ru: 'Сколько времени?' })}</span>
                  {VAQT_OPTS.map(o => <button key={o.v} type="button" className={`bp-opt ${r.vaqt === o.v ? 'on' : ''}`} disabled={!filled(r.nom) && !isMentor} onClick={() => setR(i, { vaqt: o.v })}>{tr(o.t)}</button>)}
                </div>
                <div className="bp-foot">
                  {c && <span className={`bp-cell ${c.k} fade-step`}>{c.ic} {tr(c.t)}</span>}
                  {c && c.k === 'avval' && s2 && <button type="button" className={`bp-first fade-step ${first === i ? 'on' : ''}${turnCls(lit, `f${i}`, walking)}`} onClick={() => setFirst(i)}>{first === i ? '✓ ' : ''}{tr({ uz: 'Shundan boshlayman', ru: 'Начну с неё' })}</button>}
                </div>
              </div>
            );
          })}
        </div>
        {s2 && avvalIdx.length === 0 && <p className="sl-hint fade-step">💡 {tr({ uz: "🎯 katagi bo'sh qoldi. Qaysi bo'lakni soddalashtirib, tezroq foyda beradigan kichik qismga aylantirish mumkinligini o'ylang.", ru: 'Клетка 🎯 осталась пустой. Подумайте, какую часть можно упростить до маленькой, которая быстрее принесёт пользу.' })}</p>}
        <div className="bp-end">
        {s2 && firstOk && (
          <label className={`pw-f bp-sabab fade-step ${sababOk ? 'on' : ''}${turnCls(lit, 'sab', walking)}`}>
            <span style={{ color: sababOk ? T.success : T.ink }}>{sababOk ? '✓' : '③'} {tr({ uz: "Nima uchun shu bo'lak birinchi?", ru: 'Почему эта часть первая?' })}</span>
            <input value={sabab} onChange={e => setSabab(e.target.value)} placeholder={tr(WRITE_PH)} />
          </label>
        )}
        <div className="bp-save">
          <button className={`pw-save${saveTurn ? ' turn-ring' : ''}`} disabled={!s3 || !dirty} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
          {saved && <span className="done-mini fade-step">{tr({ uz: "✓ Bo'laklar saqlandi", ru: '✓ Части сохранены' })}</span>}
        </div>
        </div>
        {s2 && firstOk && sababTyped && !sababOk && <p className="sl-hint fade-step">💡 {tr({ uz: "Sababda kamida bitta mezon ko'rinsin: nechta odamga kerakligi yoki qancha vaqt olishi. Imkon bo'lsa, ikkalasini ham yozing.", ru: 'Пусть в причине будет виден хотя бы один признак: скольким людям это нужно или сколько времени займёт. Если можете — напишите оба.' })}</p>}
      </div>
    </Stage>
  );
};

// ===== 15-EKRAN — UCH SHART: ustaxona (bittalab, ikki maydonda) =====
const CONDS_KEY = 'bridge-b5-shartlar';
// Baho-so'z (senariy: chiroyli · qulay · zamonaviy · tez · yaxshi) shartni tekshirib bo'lmaydigan qiladi:
// «sahifa tez ochiladi», «oyna chiroyli ko'rinadi» ushlanadi. B2/B4 dagi «fe'l bor — o'tadi» qoidasi bu yerga to'g'ri kelmaydi:
// natija-maydonida fe'l DOIM bor («tez ochiladi»), u qoida tekshiruvni butunlay o'chirib qo'yardi.
// Ikki bosqich (24.09, B2 sinovidagi xato-sinf): 1) eski qidiruv ELAK bo'lib qoladi — u o'tkazgan javob hech qachon ushlanmaydi;
// 2) SO'Z darajasida baho EMAS holatlar chiqariladi (shubhada o'tkaziladi):
//   qo'shtirnoq ichi — tugma yoki yozuv matni («Tez buyurtma» tugmasi, «Yaxshi» bahosi); butun maydon qo'shtirnoqda bo'lsa — hisobga olinmaydi;
//   inkor («qulay emas», ruscha «ne udobno»); ibora va nom («yaxshi ko'rgan» = sevgan, «tez yordam»; ruscha xoroshist, sovremennik);
//   tezlik son bilan o'lchangan («3 soniyadan tez») — maslahat aynan shuni so'raydi;
//   «Foydalanuvchi nima qiladi?» maydonida odamning o'z harakati («tugmani tez-tez bossa» — sinov holati);
//   odamning o'z tanlovi («o'ziga qulay vaqt», harakat-maydonida «qulay vaqtni tanlaydi»). «Qulay vaqtda eslatma keladi» — ushlanadi.
// 1-bosqich: so'z BOSHIDAN, butun so'z (qo'shimcha bilan: «chiroyliroq»): «tezlik» emas, «tez» ushlanadi.
const SIFAT_UZ = /(?:^|[^a-z'\u02BB\u2019])((?:chiroyli|qulay|zamonaviy|tez|yaxshi)(?:roq|dir)?)(?![a-z'\u02BB\u2019])/i;
const SIFAT_RU_WORDS = { ru: ['красив', 'удобн', 'современн', 'быстр', 'хорош'] };
const SIFAT_RU = new RegExp('(?:^|[^\\p{Script=Cyrillic}])((?:' + SIFAT_RU_WORDS.ru.join('|') + ')\\p{Script=Cyrillic}*)', 'iu');
// 2-bosqich. So'zlarga bo'lish (B2/B4 tokenizeri + raqamlar): tutuq belgisining har xil yozilishi bittaga keltiriladi.
const condWords = (s) => (s.toLowerCase().replace(/[\u02bb\u02bc\u2018\u2019\u0060\u00b4]/g, "'")
  .match(/[a-z']+|[\u0430-\u044f\u0451\u045e\u049b\u0493\u04b3]+|\d+(?:[.,]\d+)?/g) || []).map(w => w.replace(/^'+|'+$/g, '')).filter(Boolean);
const QUOTED = /«[^»]*»|"[^"]*"|“[^”]*”|„[^“”]*[“”]/g;
const unquote = (s) => { const t = clean(s); const rest = t.replace(QUOTED, ' '); return condWords(rest).length ? rest : t; };
const ruRe = (o, end) => new RegExp('^(?:' + o.ru.join('|') + ')' + (end ? '$' : ''));
const BAHO_UZ = /^(?:chiroyli|qulay|zamonaviy|tez|yaxshi)(?:roq|dir)?$/;
const BAHO_RU = ruRe({ ru: ['красив', 'удобн', 'современн(?!ик)', 'быстр', 'хорош(?!ист)'] });
const TEZ_RU = ruRe({ ru: ['быстр'] }), QULAY_RU = ruRe({ ru: ['удобн'] });
const RU_NE = '\u043d\u0435';
const RU_KUCH = ruRe({ ru: ['очень', 'слишком', 'совсем', 'так', 'особо'] }, true);
// O'lchov: son + birlik. Vaqt birligi har maydonda; «marta» (necha bosish) faqat harakat-maydonida.
const SON_UZ = /^(?:\d+(?:[.,]\d+)?|bir|ikki|uch|to'rt|besh|olti|yetti|sakkiz|to'qqiz|o'n|yigirma|o'ttiz|yarim)$/;
const SON_RU = ruRe({ ru: ['один', 'одн[уаой]', 'дв[ае]', 'двух', 'три', 'тр[её]х', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять', 'пол'] }, true);
const VAQT_BIRLIK_UZ = /^(?:soniya|sekund|daqiqa|minut|soat|kun|hafta)/;
const VAQT_BIRLIK_RU = ruRe({ ru: ['секунд', 'сек$', 'минут', 'мин$', 'час', 'дн[яеи]', 'день', 'недел'] });
const MARTA_RU = ruRe({ ru: ['раз', 'раза'] }, true), MARTA_SOZ_RU = ruRe({ ru: ['дважды', 'трижды'] }, true);
const isSon = (x) => SON_UZ.test(x) || SON_RU.test(x);
const olchov = (w, i, userField) => w.some((x, j) => j !== i && Math.abs(j - i) <= 4 && (
  (isSon(x) && (VAQT_BIRLIK_UZ.test(w[j + 1] || '') || VAQT_BIRLIK_RU.test(w[j + 1] || '')))
  || (userField && ((isSon(x) && (w[j + 1] === 'marta' || MARTA_RU.test(w[j + 1] || ''))) || MARTA_SOZ_RU.test(x)))));
// Odamning harakati (bosish, yozish, tanlash): harakat-maydonida tezlik shu harakatga tegishli bo'lsa — sinov holati.
// Fe'l tezlik-so'zdan KEYIN, 2 so'z ichida («tez bossa», «tez-tez bossa»); ruschada ikki tomonda. «Tugmani bossa, sahifa tez ochiladi» — o'tmaydi.
const HARAKAT_UZ = /^(?:bos|yoz(?!uv)|kirit|tanla|belgila|teg|chert|yubor|jo'nat)/;
const HARAKAT_RU = ruRe({ ru: ['нажа', 'нажм', 'нажим', 'жм[её]т', 'кликн', 'клика', 'тыка', 'тыкн', 'ввод', 'ввел', 'ввёл', 'введ', 'впис', 'пиш', 'напис', 'выбира', 'выбра', 'выбер', 'отправ', 'отмеча', 'отмет'] });
const harakatYonida = (w, i) => w.some((y, j) => (HARAKAT_UZ.test(y) && j > i && j - i <= 2) || (HARAKAT_RU.test(y) && j !== i && Math.abs(j - i) <= 2));
const TANLOV_UZ = /^(?:tanla|bos|belgila|kirit|yoz)/;
const TANLOV_RU = ruRe({ ru: ['выбира', 'выбра', 'выбер', 'нажа', 'нажм', 'нажим', 'отмеча', 'отмет', 'указ', 'ввод', 'ввел', 'ввёл', 'введ', 'став'] });
const VAQT_UZ = /^(?:vaqt|kun|soat|payt|sana)/;
const VAQT_RU = ruRe({ ru: ['врем', 'день', 'дн[яеюи]', 'час(?:а|ы|ов|ам)?$', 'дат[уаые]?$', 'слот', 'момент'] });
const DATIV_UZ = /^(?:o'ziga|o'zlariga|menga|sizga|unga|ularga|bizga)$/;
const DATIV_RU = ruRe({ ru: ['ему', 'ей', 'им', 'мне', 'вам', 'нам', 'тебе', 'себе'] }, true);
const DLYA_RU = ruRe({ ru: ['для'] }, true), DLYA_KIM_RU = ruRe({ ru: ['себя', 'него', 'неё', 'нее', 'них', 'меня', 'вас', 'нас', 'тебя'] }, true);
const dativ = (w, i) => DATIV_UZ.test(w[i - 1] || '') || DATIV_RU.test(w[i - 1] || '') || DATIV_RU.test(w[i + 1] || '')
  || (DLYA_RU.test(w[i + 1] || '') && DLYA_KIM_RU.test(w[i + 2] || ''));
const bahoHit = (s, userField) => {
  const w = condWords(unquote(s));
  return w.some((x, i) => {
    if (!BAHO_UZ.test(x) && !BAHO_RU.test(x)) return false;
    const next = w[i + 1] || '', prev = w[i - 1] || '';
    if (next.startsWith('emas') || prev === RU_NE || (w[i - 2] === RU_NE && RU_KUCH.test(prev))) return false;
    if (x === 'yaxshi' && /^ko'r(?:ad|am|gan)/.test(next)) return false;
    if (x === 'tez' && /^yordam/.test(next)) return false;
    if (x === 'tez' && (/^so'ral/.test(next) || (next === 'tez' && /^so'ral/.test(w[i + 2] || '')))) return false; // bo'lim nomi: «tez-tez so'raladigan savollar» (tekshiruvchi 25.09)
    const tezlik = /^tez/.test(x) || TEZ_RU.test(x);
    if (tezlik && olchov(w, i, userField)) return false;
    if (tezlik && userField && harakatYonida(w, i)) return false;
    const qulay = /^qulay/.test(x) || QULAY_RU.test(x);
    if (qulay && w.slice(i + 1, i + 4).some(y => VAQT_UZ.test(y) || VAQT_RU.test(y))
      && (dativ(w, i) || (userField && w.some(y => TANLOV_UZ.test(y) || TANLOV_RU.test(y))))) return false;
    return true;
  });
};
const condHint = (c, prev) => {
  const txt = `${clean(c.qiladi)} ${clean(c.boladi)}`.toLowerCase();
  if ((SIFAT_UZ.test(txt) || SIFAT_RU.test(txt)) && (bahoHit(c.qiladi, true) || bahoHit(c.boladi, false))) return tr({ uz: 'Buni qanday tekshirasiz? Nima qilinishi va nima bo\'lishini aniq yozing, kerak bo\'lsa son bilan: masalan, "2 soniyada ochiladi".', ru: 'Как вы это проверите? Напишите точно, что делают и что происходит, если нужно — с числом: например, «открывается за 2 секунды».' });
  const me = normTxt(c.qiladi) + '|' + normTxt(c.boladi);
  if (prev.some(p => normTxt(p.qiladi) + '|' + normTxt(p.boladi) === me || (filled(p.qiladi) && normTxt(p.qiladi) === normTxt(c.qiladi)))) return tr({ uz: 'Bu shart oldingisini takrorlayapti. Boshqa holatni oling.', ru: 'Это условие повторяет предыдущее. Возьмите другой случай.' });
  return null;
};
const firstPartName = (card) => clean(card && card.bolak) || (() => { const id = card && card.ideaId; const it = id ? ideaById(id) : null; return it ? tr(it.bolak) : ''; })();
const ScreenConds = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useIsMentor();
  const [card] = useState(() => cardSafe());
  // F-0915-02: buzuq saqlangan ro'yxat (obyekt bo'lmagan qator, satr bo'lmagan maydon) tozalanadi.
  const init = (() => { const s = lsGet(CONDS_KEY); if (!isObj(s) || !Array.isArray(s.list) || s.list.length !== 3) return null; return { list: s.list.map(c => (isObj(c) ? { qiladi: str(c.qiladi), boladi: str(c.boladi) } : { qiladi: '', boladi: '' })), saved: s.saved === true }; })();
  const [list, setList] = useState(() => (init ? init.list : [0, 1, 2].map(() => ({ qiladi: '', boladi: '' }))));
  const [savedSnap, setSavedSnap] = useState(() => (init && init.saved ? JSON.stringify(init.list) : null));
  const signal = usePracticeSignal(screen, storedAnswer, onAnswer, live);
  const setC = (i, patch) => setList(prev => prev.map((c, k) => (k === i ? { ...c, ...patch } : c)));
  const hints = list.map((c, i) => ((filled(c.qiladi) || filled(c.boladi)) ? condHint(c, list.slice(0, i)) : null));
  const oks = list.map((c, i) => filled(c.qiladi) && filled(c.boladi) && !hints[i]);
  const allOk = oks.every(Boolean);
  const dirty = savedSnap !== JSON.stringify(list);
  const saved = !!savedSnap && !dirty;
  const everSaved = !!savedSnap || !!(storedAnswer && storedAnswer.solved);
  const save = () => {
    if (!allOk) return;
    const shartlar = list.map(c => ({ qiladi: clean(c.qiladi), boladi: clean(c.boladi) }));
    cardWrite({ shartlar });
    lsSet(CONDS_KEY, { list, saved: true });
    setSavedSnap(JSON.stringify(list));
    signal({ practice: 'conditions', shartlar });
  };
  // Bittalab: keyingi shart oldingisi to'g'ri to'lganda (yoki unda allaqachon yozuv bo'lsa) ochiladi.
  const visible = list.map((c, i) => i === 0 || oks[i - 1] || filled(c.qiladi) || filled(c.boladi) || isMentor);
  const firstBad = oks.findIndex(x => !x);
  const navLabel = isMentor || (everSaved && !dirty) ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    // Bitta raqam tizimi (korpus B-7): kartalar «1-shart» deb nomlangan — yorliqda ① qo'shilmaydi («① 1-shart» ikki marta o'qilardi).
    : firstBad >= 0 ? (hints[firstBad] ? tr({ uz: `${firstBad + 1}-shartni aniqlashtiring`, ru: `Уточните условие ${firstBad + 1}` }) : tr({ uz: `${firstBad + 1}-shartni yozing`, ru: `Напишите условие ${firstBad + 1}` }))
    : tr({ uz: '✓ «Saqlash»ni bosing', ru: '✓ Нажмите «Сохранить»' });
  const saveTurn = useTurnHint(allOk && dirty && !isMentor);
  // 88-qonun: navbat ochiq kartalardagi bo'sh maydonlar bo'ylab yuradi (yozayotganda to'xtaydi).
  const [focusIn, setFocusIn] = useState(false);
  const onFocusIn = e => { if (e.target.tagName === 'INPUT') setFocusIn(true); };
  const onFocusOut = e => { if (e.target.tagName === 'INPUT') setFocusIn(false); };
  const pend = list.flatMap((c, i) => (visible[i] ? [filled(c.qiladi) ? null : `q${i}`, filled(c.boladi) ? null : `b${i}`] : [])).filter(Boolean);
  const lit = useTurnWalk(pend, !focusIn && !isMentor);
  const walking = pend.length > 1;
  const part = firstPartName(card);
  // 1-shart namunasi tanlangan g'oyaga mos (READY_IDEAS.shart); o'z g'oyasida — neytral (QA 2026-09-24: ilgari doim futbol chiqardi).
  const sampleIdea = ideaById(clean(card && card.ideaId));
  const phQ = sampleIdea ? tr(sampleIdea.shart.qiladi) : tr({ uz: '«Saqlash» bosilsa', ru: 'Нажали «Сохранить»' });
  const phB = sampleIdea ? tr(sampleIdea.shart.boladi) : tr({ uz: '«Saqlandi» yozuvi chiqadi', ru: 'Появляется надпись «Сохранено»' });
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · shartlaringiz', ru: 'Практика · ваши условия' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Uch shart yozganlar', ru: '✍️ Кто написал три условия' })} /><MentorNote>{tr(MENTOR_WATCH)}</MentorNote><StudentPracticePulse live={live} screen={screen} /></div><NavNext optionalLive turnBusy={!saved && !isMentor} disabled={!(everSaved && !dirty) && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,16px)' }} onFocus={onFocusIn} onBlur={onFocusOut}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Birinchi bo'lagingiz qachon <span className="italic" style={{ color: T.accent }}>«tayyor»</span> bo'ladi?</>, ru: <>Когда ваша первая часть будет <span className="italic" style={{ color: T.accent }}>«готова»</span>?</> })}</h2></div>
        {/* Mentor-gap (F-0924-03, §210 qolipi): NEGA + bitta chorlov, element o'z yorlig'i bilan; puls bilan bir halqa */}
        {/* Korpus B-18: NEGA bir xil, chorlov navbatdagi halqaga ergashadi — bo'sh maydon → aniqlashtirish → «✓ Saqlash»; saqlangach faqat NEGA */}
        <Mentor>{!isMentor && saved ? tr({ uz: "Shart aniq yozilsa, siz ham, dasturchi ham «tayyor»ni bir xil tushunasiz.", ru: 'Если условие записано точно, вы и разработчик одинаково понимаете «готово».' })
          : !isMentor && allOk ? tr({ uz: <>Shart aniq yozilsa, siz ham, dasturchi ham «tayyor»ni bir xil tushunasiz — <b style={{ color: T.ink }}>«✓ Saqlash»</b>ni bosing.</>, ru: <>Если условие записано точно, вы и разработчик одинаково понимаете «готово», — нажмите <b style={{ color: T.ink }}>«✓ Сохранить»</b>.</> })
          : !isMentor && firstBad >= 0 && hints[firstBad] ? tr({ uz: <>Shart aniq yozilsa, siz ham, dasturchi ham «tayyor»ni bir xil tushunasiz — <b style={{ color: T.ink }}>{`«${firstBad + 1}-shart»`}</b>ni aniqlashtiring.</>, ru: <>Если условие записано точно, вы и разработчик одинаково понимаете «готово», — уточните <b style={{ color: T.ink }}>{`«Условие ${firstBad + 1}»`}</b>.</> })
          : !isMentor && pend.length > 0 && pend[0].charAt(0) === 'b' ? tr({ uz: <>Shart aniq yozilsa, siz ham, dasturchi ham «tayyor»ni bir xil tushunasiz — <b style={{ color: T.ink }}>«Shundan keyin nima bo'ladi?»</b> savoliga javob yozing.</>, ru: <>Если условие записано точно, вы и разработчик одинаково понимаете «готово», — ответьте на вопрос <b style={{ color: T.ink }}>«Что происходит после этого?»</b>.</> })
          : tr({ uz: <>Shart aniq yozilsa, siz ham, dasturchi ham «tayyor»ni bir xil tushunasiz — <b style={{ color: T.ink }}>«Foydalanuvchi nima qiladi?»</b> savoliga javob yozing.</>, ru: <>Если условие записано точно, вы и разработчик одинаково понимаете «готово», — ответьте на вопрос <b style={{ color: T.ink }}>«Что делает пользователь?»</b>.</> })}</Mentor>
        <div className="split cd-split">
          <Col>
        <FlowLabel end={`${oks.filter(Boolean).length}/3`}>{tr({ uz: 'Uch shart — bittalab yozing', ru: 'Три условия — по одному' })}</FlowLabel>
        <div className="cd-list fade-up delay-1">
          {list.map((c, i) => visible[i] && (
            <div key={i} className={`cd-card fade-step ${oks[i] ? 'ok' : ''}`}>
              <span className="sl-n" style={{ color: oks[i] ? T.success : T.accent }}><i className="sl-n-dot" aria-hidden="true" />{tr({ uz: `${i + 1}-shart`, ru: `Условие ${i + 1}` })}</span>
              <div className="cd-pair">
                <label className={`pw-f ${filled(c.qiladi) && !hints[i] ? 'on' : ''}${turnCls(lit, `q${i}`, walking)}`}><span>{tr({ uz: 'Foydalanuvchi nima qiladi?', ru: 'Что делает пользователь?' })}</span><input value={c.qiladi} onChange={e => setC(i, { qiladi: e.target.value })} placeholder={i === 0 ? phQ : tr(WRITE_PH)} /></label>
                <label className={`pw-f ${filled(c.boladi) && !hints[i] ? 'on' : ''}${turnCls(lit, `b${i}`, walking)}`}><span>{tr({ uz: "Shundan keyin nima bo'ladi?", ru: 'Что происходит после этого?' })}</span><input value={c.boladi} onChange={e => setC(i, { boladi: e.target.value })} placeholder={i === 0 ? phB : tr(WRITE_PH)} /></label>
              </div>
              {hints[i] && <p className="sl-hint fade-step">💡 {hints[i]}</p>}
            </div>
          ))}
        </div>
          </Col>
          <Col>
            {/* Tekshiruvchi 25.09 (D5): yorliq kartaning o'z sarlavhasini («Qabul shartlari») takrorlamaydi — faqat nima bo'lishini aytadi (≤6 so'z) */}
            <FlowLabel>{tr({ uz: "Siz yozganingiz shu yerga yig'iladi", ru: 'Сюда собирается то, что вы пишете' })}</FlowLabel>
            <div className={`cd-doc fade-up delay-2${allOk ? ' full' : ''}`}>
              <div className="cd-doc-top"><span className="ic-lbl first">{tr({ uz: "BIRINCHI BO'LAK", ru: 'ПЕРВАЯ ЧАСТЬ' })}</span><span className="sl-problem-t">{part || '—'}</span></div>
              <span className="cd-doc-h">{tr({ uz: 'Qabul shartlari', ru: 'Критерии приёмки' })} <b className="mono">{oks.filter(Boolean).length}/3</b></span>
              {list.map((c, i) => (
                <div key={i} className={`cd-doc-row${oks[i] ? ' ok' : ''}`}>
                  <span className="cd-box" aria-hidden="true">{oks[i] ? '✓' : i + 1}</span>
                  <span className="cd-doc-t">{(filled(c.qiladi) || filled(c.boladi)) ? <>{clean(c.qiladi) || '…'} <span className="cd-arr" aria-hidden="true">→</span> {clean(c.boladi) || '…'}</> : <span className="cd-ph">{tr({ uz: `${i + 1}-shart`, ru: `Условие ${i + 1}` })} <span className="cd-arr" aria-hidden="true">→</span> …</span>}</span>
                </div>
              ))}
            </div>
            <div className="cd-save">
              <button className={`pw-save${saveTurn ? ' turn-ring' : ''}`} disabled={!allOk || !dirty} onClick={save}>✓ {tr({ uz: 'Saqlash', ru: 'Сохранить' })}</button>
              {saved && <span className="done-mini fade-step">{tr({ uz: '✓ Hikoya, bo\'laklar va shartlar saqlandi', ru: '✓ История, части и условия сохранены' })}</span>}
            </div>
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== AI QADAMI (F-0924-01/02) — B3 / pilot B1 dan AYNAN: so'rov DOIM ochiq · ① nusxalash → ② Gemini → ③ javobni yozish.
// Manba: DeployLesson Screen4 (.pr-panel/.pr-copy) + DoSteps (.dsx raqamlari) + FallbackPanel (.dsx-fb, 155-qonun 2-band).
// «✓ Nusxalandi» QAYTIB O'CHMAYDI. Navbat-pulsi ① → ② bo'ylab yuradi (88-qonun); ③ ning pulsi — 4-shart maydonlarining
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
  // QA (88-qonun a, B2 naqshi): ① → ② ketma-ket — navbat FAQAT birinchi bajarilmagan halqada (ilgari ② ham ① bilan navbat almashardi).
  const pend = [!copied && 'copy', !opened && 'open'].filter(Boolean).slice(0, 1);
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
// ===== 16-EKRAN — AI SINOVCHI ROLIDA (maqsad-gap · so'rov DOIM ochiq, AiStep ①②③ · 🛟 zaxira ichida 3 sinov-savoli) =====
const AI4_KEY = 'bridge-b5-shart4';
const READY_TESTS = [
  { uz: "Maydon bo'sh qoldirilsa-chi?", ru: 'А если оставить поле пустым?' },
  { uz: 'Tugma ketma-ket ikki marta bosilsa-chi?', ru: 'А если нажать кнопку два раза подряд?' },
  { uz: 'Internet uzilib qolsa-chi?', ru: 'А если пропадёт интернет?' },
];
// F-0915-02: kartadagi shartlar ro'yxati boshqa darsdan/eskirgan bo'lsa ham faqat {qiladi, boladi} obyektlari olinadi.
const cardConds = (card) => (card && Array.isArray(card.shartlar) ? card.shartlar : []).filter(x => x && typeof x === 'object').map(x => ({ qiladi: clean(x.qiladi), boladi: clean(x.boladi) })).filter(x => x.qiladi || x.boladi).slice(0, 3);
const aiPrompt = (card) => {
  const part = firstPartName(card) || tr({ uz: "{birinchi bo'lak}", ru: '{первая часть}' });
  const sh = cardConds(card);
  const line = [0, 1, 2].map(i => `${i + 1}) ${sh[i] ? `${clean(sh[i].qiladi)} — ${clean(sh[i].boladi)}` : tr({ uz: '{shart}', ru: '{условие}' })}`).join(' ');
  return tr({
    uz: `Siz ilovadagi xatolarni qidiradigan sinovchisiz. Ilovaning bir bo'lagi: ${part}. Uning shartlari: ${line}. Ikki savolga javob bering: qaysi shart noaniq yozilgan — uni qanday ikki xil tushunish mumkin? Foydalanuvchi qaysi holatda adashishi mumkin, lekin bu holat shartlarda tekshirilmagan? Yangi shartni o'zingiz yozmang — faqat yetishmagan holatni tushuntiring, shartni keyin men o'zim yozaman.`,
    ru: `Вы — тестировщик, который ищет ошибки в приложениях. Одна часть приложения: ${part}. Её условия: ${line}. Ответьте на два вопроса: какое условие записано неточно — как его можно понять двумя разными способами? В каком случае пользователь может ошибиться, но этот случай в условиях не проверяется? Новое условие не пишите сами — только объясните, какого случая не хватает; условие я потом напишу самостоятельно.`,
  });
};
const ScreenAI = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useIsMentor();
  const [card] = useState(() => cardSafe());
  const [c4, setC4] = useState(() => { const s = lsGet(AI4_KEY); return isObj(s) ? { qiladi: str(s.qiladi), boladi: str(s.boladi) } : { qiladi: '', boladi: '' }; });
  const [test, setTest] = useState(-1);
  const [aiReady, setAiReady] = useState(false); // ① va ② bajarildi → navbat ③ ga (4-shart maydonlari) o'tadi
  const signal = usePracticeSignal(screen, storedAnswer, onAnswer, live);
  const prompt = aiPrompt(card);
  const prev = cardConds(card);
  const hint = (filled(c4.qiladi) || filled(c4.boladi)) ? condHint(c4, prev) : null;
  const done = filled(c4.qiladi) && filled(c4.boladi) && !hint;
  useEffect(() => { lsSet(AI4_KEY, c4); if (done) signal({ practice: 'ai-condition', shart4: c4 }); }, [c4]); // eslint-disable-line
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : hint ? tr({ uz: "4-shartni aniqlashtiring", ru: 'Уточните условие 4' })
    : !filled(c4.qiladi) ? tr({ uz: '4-shart: «Foydalanuvchi nima qiladi?» savoliga javob yozing', ru: 'Условие 4: ответьте на вопрос «Что делает пользователь?»' })
    : tr({ uz: "4-shart: «Shundan keyin nima bo'ladi?» savoliga javob yozing", ru: 'Условие 4: ответьте на вопрос «Что происходит после этого?»' });
  // 88-qonun, bir lahzada bitta puls: ①/② (AiStep ichida) → ③ 4-shartning bo'sh maydonlari (yozayotganda to'xtaydi).
  // ③ ga navbat: ①② bajarilgach YOKI 🛟 zaxirada sinov-savoli tanlangach YOKI yozish boshlangach — shunda ①② pulsi o'chadi.
  const [focusIn, setFocusIn] = useState(false);
  const onFocusIn = e => { if (e.target.tagName === 'INPUT') setFocusIn(true); };
  const onFocusOut = e => { if (e.target.tagName === 'INPUT') setFocusIn(false); };
  const pend = [filled(c4.qiladi) ? null : 'q', filled(c4.boladi) ? null : 'b'].filter(Boolean);
  const typing = !!(clean(c4.qiladi) || clean(c4.boladi));
  const onStep3 = aiReady || test >= 0 || typing;
  const lit = useTurnWalk(pend, onStep3 && !focusIn && !isMentor);
  const walking = pend.length > 1;
  return (
    <Stage eyebrow={tr({ uz: 'AI bilan', ru: 'С AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorPracticeStats live={live} screen={screen} label={tr({ uz: "✍️ 4-shart qo'shganlar", ru: '✍️ Кто добавил условие 4' })} /><MentorNote>{tr(MENTOR_WATCH)}</MentorNote><StudentPracticePulse live={live} screen={screen} /></div><NavNext optionalLive turnBusy={!done && !isMentor} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen dense ai-screen" style={{ gap: 'clamp(12px,2vw,16px)' }} onFocus={onFocusIn} onBlur={onFocusOut}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Shartlaringiz qaysi holatni <span className="italic" style={{ color: T.accent }}>o'tkazib yuborgan</span>?</>, ru: <>Какой случай <span className="italic" style={{ color: T.accent }}>пропустили</span> ваши условия?</> })}</h2>
          {/* Korpus B-11: senariy gapi bo'linadi — 1-jumla shu yerda, «siz hal qilasiz» faqat qoida-qatorida (ikki marta o'qilmaydi) */}
          <p className="body fade-up delay-1" style={{ color: T.ink2 }}>{tr({ uz: "AI shartlaringizda yetishmagan holatni topishga yordam beradi.", ru: 'AI поможет найти случай, которого не хватает в ваших условиях.' })}</p></div>
        {/* Mentor-gap (F-0924-03, §210 qolipi): NEGA + bitta chorlov; puls ① dan boshlanadi */}
        {/* Korpus B-18/B-16: chorlov navbatdagi halqaga ergashadi — ① nusxalash → ③ «4-shart» (①② bajarilgach, 🛟 savol tanlangach yoki yozish boshlangach); yozilgach faqat NEGA */}
        <Mentor>{done && !isMentor
          ? tr({ uz: "Sinovchi odam adashishi mumkin bo'lgan holatlarni ataylab sinaydi.", ru: 'Тестировщик нарочно проверяет случаи, где человек может ошибиться.' })
          : onStep3 && !isMentor
            ? tr({ uz: <>Sinovchi odam adashishi mumkin bo'lgan holatlarni ataylab sinaydi — topilgan holat uchun <b style={{ color: T.ink }}>«4-shart»</b>ni yozing.</>, ru: <>Тестировщик нарочно проверяет случаи, где человек может ошибиться, — напишите <b style={{ color: T.ink }}>«Условие 4»</b> для найденного случая.</> })
            : tr({ uz: <>Sinovchi odam adashishi mumkin bo'lgan holatlarni ataylab sinaydi — avval <b style={{ color: T.ink }}>«📋 So'rovni nusxalash»</b>ni bosing.</>, ru: <>Тестировщик нарочно проверяет случаи, где человек может ошибиться, — сначала нажмите <b style={{ color: T.ink }}>«📋 Скопировать запрос»</b>.</> })}</Mentor>
        <div className="split">
          <Col>
            <FlowLabel>🤖 {tr({ uz: 'AI — sinovchi rolida', ru: 'AI — в роли тестировщика' })}</FlowLabel>
            <AiStep prompt={prompt} answered={done} onReady={setAiReady} pulse={!isMentor && test < 0 && !typing}
              fallbackTitle={tr({ uz: 'Gemini ochilmasa', ru: 'Если Gemini не открывается' })}
              answerLabel={tr({ uz: <>AI javobini o'qing va topilgan holat uchun <b>«4-shart»</b>ni yozing</>, ru: <>Прочитайте ответ AI и напишите <b>«Условие 4»</b> для найденного случая</> })}
              fallback={<>
                <div className="ai-ready">
                  {READY_TESTS.map((q, i) => <button key={i} type="button" className={`ai-rq ${test === i ? 'on' : ''}`} onClick={() => setTest(t => (t === i ? -1 : i))}>{test === i ? '✓ ' : ''}{tr(q)}</button>)}
                </div>
                <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "Shartlaringizga mos savolni tanlang. Shu holatda nima bo'lishi kerakligini «4-shart»ga yozing.", ru: 'Выберите вопрос, который подходит к вашим условиям. Что должно произойти в этом случае — запишите в «Условие 4».' })}</p>
              </>} />
          </Col>
          <Col>
            <FlowLabel end={`${prev.length + (done ? 1 : 0)}/4`}>{tr({ uz: 'Shartlaringiz', ru: 'Ваши условия' })}</FlowLabel>
            {prev.length > 0 && <div className="cd-mine fade-up delay-1">
              {prev.map((c, i) => <div key={i} className="pa-q"><span className="pa-q-n">{i + 1}</span><span className="pa-q-t">{clean(c.qiladi)} — {clean(c.boladi)}</span></div>)}
            </div>}
            <div className={`cd-card c4 fade-up delay-2 ${done ? 'ok' : ''}`}>
              <span className="sl-n" style={{ color: done ? T.success : T.accent }}><i className="sl-n-dot" aria-hidden="true" />{tr({ uz: '4-shart', ru: 'Условие 4' })}</span>
              <label className={`pw-f ${filled(c4.qiladi) && !hint ? 'on' : ''}${turnCls(lit, 'q', walking)}`}><span>{tr({ uz: 'Foydalanuvchi nima qiladi?', ru: 'Что делает пользователь?' })}</span><input value={c4.qiladi} onChange={e => setC4(p => ({ ...p, qiladi: e.target.value }))} placeholder={tr(WRITE_PH)} /></label>
              <label className={`pw-f ${filled(c4.boladi) && !hint ? 'on' : ''}${turnCls(lit, 'b', walking)}`}><span>{tr({ uz: "Shundan keyin nima bo'ladi?", ru: 'Что происходит после этого?' })}</span><input value={c4.boladi} onChange={e => setC4(p => ({ ...p, boladi: e.target.value }))} placeholder={tr(WRITE_PH)} /></label>
              {hint && <p className="sl-hint fade-step">💡 {hint}</p>}
            </div>
            {/* Senariy 16-ekran «Qoida ekranda» (tekshiruvchi: yo'qolgan edi) — o'ng ustunda, B4 ai-rule naqshi */}
            <p className="ai-rule">{tr({ uz: "AI shart yozmaydi, faqat yetishmagan holatni ko'rsatadi. Shartni qo'shish yoki qo'shmaslikni siz hal qilasiz.", ru: 'AI не пишет условия, а только показывает, какого случая не хватает. Добавлять условие или нет — решаете вы.' })}</p>
          </Col>
        </div>
      </div>
    </Stage>
  );
};

// ===== 17-EKRAN — JUFTLIK: sherigingiz shartingizni tekshira oladimi (ballsiz) =====
const PEER_KEY = 'bridge-b5-sherik';
const ScreenPeer = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const { live, isMentor } = useIsMentor();
  const [txt, setTxt] = useState(() => { const s = lsGet(PEER_KEY); return typeof s === 'string' ? s : ''; });
  const signal = usePracticeSignal(screen, storedAnswer, onAnswer, live);
  const done = filled(txt, 3);
  useEffect(() => { lsSet(PEER_KEY, txt); if (done) signal({ practice: 'peer-check', sherik: txt }); }, [txt]); // eslint-disable-line
  // 88-qonun: yagona maydon — ikkilanishdan keyin tinch halqa (yozayotganda to'xtaydi).
  const [focusIn, setFocusIn] = useState(false);
  const onFocusIn = e => { if (e.target.tagName === 'INPUT') setFocusIn(true); };
  const onFocusOut = e => { if (e.target.tagName === 'INPUT') setFocusIn(false); };
  const lit = useTurnWalk(done ? [] : ['t'], !focusIn && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: 'Juftlik', ru: 'В паре' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><div className="nav-mdock"><MentorPracticeStats live={live} screen={screen} label={tr({ uz: '✍️ Sherigi bilan tekshirganlar', ru: '✍️ Кто проверил с напарником' })} /><MentorNote>{tr(MENTOR_WATCH)}</MentorNote><StudentPracticePulse live={live} screen={screen} /></div><NavNext optionalLive turnBusy={!done && !isMentor} disabled={!done && !isMentor} label={done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Sherigingiz nima deganini yozing', ru: 'Напишите, что сказал напарник' })} onClick={onNext} /></>}>
      <div className="screen dense" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sherigingiz shartingizni <span className="italic" style={{ color: T.accent }}>tekshira oladimi</span>?</>, ru: <>Сможет ли напарник <span className="italic" style={{ color: T.accent }}>проверить</span> ваше условие?</> })}</h2></div>
        {/* Mentor-gap (F-0924-03, §210 qolipi): NEGA + bitta chorlov, element o'z yorlig'i bilan; puls bilan bir halqa */}
        {/* Tekshiruvchi (ETALON 32 · korpus B-18): «avval …, keyin …» ikki chorlov ostidagi yo'riqni takrorlardi — chorlov faqat puls turgan maydonni aytadi; yozilgach faqat NEGA */}
        <Mentor>{done && !isMentor
          ? tr({ uz: 'Sherigingiz tekshira olsa, shart aniq yozilgan.', ru: 'Если напарник сможет проверить, условие записано точно.' })
          : tr({ uz: <>Sherigingiz tekshira olsa, shart aniq yozilgan — uning javobini <b style={{ color: T.ink }}>«Sherigingiz nima dedi?»</b>ga yozing.</>, ru: <>Если напарник сможет проверить, условие записано точно, — впишите его ответ в строку <b style={{ color: T.ink }}>«Что сказал напарник?»</b>.</> })}</Mentor>
        <div className="pa-script fade-up delay-1"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Sherigingizga 30 soniyada ayting: <b>«Birinchi bo'lagim — …, chunki … . U tayyor ekanini shundan bilaman: …»</b>. Sherigingiz shartni qanday tekshirishini aytadi: nima qiladi va qanday natija kutadi.</>, ru: <>Скажите напарнику за 30 секунд: <b>«Моя первая часть — …, потому что … . Что она готова, я узнаю так: …»</b>. Напарник говорит, как проверит условие: что сделает и какой результат ждёт.</> })}</p></div>
        <label className={`pw-f fade-up delay-2 ${done ? 'on' : ''}${turnCls(lit, 't', false)}`} onFocus={onFocusIn} onBlur={onFocusOut}>
          <span style={{ color: done ? T.success : T.ink }}>{done ? '✓' : '✏️'} {tr({ uz: 'Sherigingiz nima dedi? Bir qatorda yozing.', ru: 'Что сказал напарник? Напишите одной строкой.' })}</span>
          <input value={txt} onChange={e => setTxt(e.target.value)} placeholder={tr({ uz: 'Sherigingiz aytgan gapni shu yerga yozing…', ru: 'Напишите здесь, что сказал напарник…' })} />
        </label>
        {done && <span className="done-mini fade-step" style={{ alignSelf: 'flex-start' }}>{tr({ uz: '✓ Yozildi', ru: '✓ Записано' })}</span>}
      </div>
    </Stage>
  );
};

// ===== 🏅 NISHONLAR (senariy 4-bo'lim) — faqat REAL tekshiriladigan harakatga =====
const ACHIEVEMENTS = {
  storyBuilt:    { icon: '🧩', name: 'Story Built!',      desc: { uz: "Hikoyaning uch qismini joyiga qo'ydingiz", ru: 'Вы расставили по местам три части истории' } },
  gridMaster:    { icon: '🎯', name: 'Grid Master!',      desc: { uz: "Olti bo'lakni to'rt katakka joyladingiz", ru: 'Вы разложили шесть частей по четырём клеткам' } },
  firstPick:     { icon: '🚩', name: 'First Pick!',       desc: { uz: "G'oyangizning birinchi bo'lagini sababi bilan tanladingiz", ru: 'Вы выбрали первую часть своей идеи и объяснили почему' } },
  doneMeansDone: { icon: '✅', name: 'Done Means Done!',  desc: { uz: "Birinchi bo'lagingizga uchta tekshiriladigan shart yozdingiz", ru: 'Вы написали три проверяемых условия для своей первой части' } },
};
// Ekran id → nishon (recordAnswer'da, faqat data.correct bilan): 3 · 8 · 14 · 15-ekranlar.
const ACH_TRIGGERS = { qism: 'storyBuilt', katak: 'gridMaster', bolaklar: 'firstPick', shart: 'doneMeansDone' };

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
  { ch: { uz: 'HIKOYA', ru: 'ИСТОРИЯ' },  l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: "BO'LAK", ru: 'ЧАСТЬ' },    l: 84, t: 8,  s: 26, d: 23, dl: 1.5 },
  { ch: 'MVP',                            l: 6,  t: 72, s: 24, d: 27, dl: 0.8 },
  { ch: { uz: 'SHART', ru: 'УСЛОВИЕ' },   l: 74, t: 68, s: 24, d: 21, dl: 2.2 },
  { ch: { uz: 'TAYYOR', ru: 'ГОТОВО' },   l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: '🚕', l: 66, t: 26, s: 26, d: 17, dl: 0.4 },
  { ch: '🎯', l: 26, t: 34, s: 24, d: 20, dl: 1.9 },
  { ch: '🏔', l: 55, t: 5,  s: 22, d: 22, dl: 0.6 },
  { ch: '🌱', l: 91, t: 42, s: 24, d: 24, dl: 1.3 },
  { ch: '⏳', l: 16, t: 52, s: 26, d: 26, dl: 2.6 },
  { ch: '✅', l: 2,  t: 30, s: 26, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike savollari — 12 ta, to'rt blokdan teng (3/3/3/3), vaziyatlar ekrandagidan boshqa (§144):
// ovqat yetkazish ilovasi · maktab kutubxonasi sayti · o'yin ilovasi. To'g'ri javoblar 4 pozitsiyaga TENG (3/3/3/3). Jonli TASDIQLAYDI.
const QUIZ_BANK = [
  // — 1-blok · hikoya —
  { q: { uz: 'Ovqat yetkazish ilovasi uchun qaysi gap — foydalanuvchi hikoyasi?', ru: 'Какая фраза для приложения доставки еды — пользовательская история?' }, opts: [
    { uz: "Men tanaffusi qisqa o'quvchi sifatida, ovqat qachon kelishini ko'rishni xohlayman — darsga kechikmaslik uchun", ru: 'Я, как ученик с короткой переменой, хочу видеть, когда привезут еду, — чтобы не опоздать на урок' },
    { uz: "Ilovaga ovqat qachon kelishini ko'rsatadigan katta soat qo'shing, u ekranning eng yuqorisida tursin", ru: 'Добавьте в приложение большие часы, которые показывают, когда привезут еду, пусть они будут в самом верху' },
    { uz: "Men ilovadan har kuni foydalanadigan odam sifatida, ovqat qachon kelishini ekranda ko'rishni xohlayman", ru: 'Я, как человек, который каждый день пользуется приложением, хочу видеть на экране, когда привезут еду' },
    { uz: "Ovqat qachon kelishi ko'rinib tursin — darsga kechikmay, tushlikni o'z vaqtida qilish uchun", ru: 'Пусть будет видно, когда привезут еду, — чтобы не опоздать на урок и пообедать вовремя' }], correct: 0 },
  { q: { uz: "Kutubxona sayti uchun hikoya: «Men kitob o'qishni yaxshi ko'radigan o'quvchi sifatida, kitob band yoki bo'sh ekanini oldindan ko'rishni xohlayman». Unda nima yetishmayapti?", ru: 'История для сайта библиотеки: «Я, как ученик, который любит читать, хочу заранее видеть, занята ли книга». Чего в ней не хватает?' }, opts: [
    { uz: 'Kim — hikoya qaysi odam nomidan yozilgani', ru: 'Кто — от имени какого человека написана история' },
    { uz: 'Nimani xohlaydi — odam saytdan nima kutgani', ru: 'Чего хочет — чего человек ждёт от сайта' },
    { uz: 'Nima uchun — odam bundan qanday foyda oladi', ru: 'Зачем — какую пользу человек от этого получит' },
    { uz: "Hech narsa — hikoyaning uch qismi ham bor", ru: 'Ничего — все три части истории на месте' }], correct: 2 },
  { q: { uz: "O'yin ilovasi: «Men kechqurun o'ynaydigan o'smir sifatida, o'yinni saqlab qo'yishni xohlayman — ertaga shu joydan davom etish uchun». «Nima uchun» qismi qaysi?", ru: 'Игровое приложение: «Я, как подросток, который играет по вечерам, хочу сохранять игру — чтобы завтра продолжить с того же места». Какая часть — «зачем»?' }, opts: [
    { uz: "kechqurun o'ynaydigan o'smir", ru: 'подросток, который играет по вечерам' },
    { uz: 'ertaga shu joydan davom etish', ru: 'завтра продолжить с того же места' },
    { uz: "o'yinni saqlab qo'yish", ru: 'сохранять игру' },
    { uz: "o'yin ilovasining o'zi", ru: 'само игровое приложение' }], correct: 1 },
  // — 2-blok · bo'laklar va birinchi versiya —
  { q: { uz: "Ovqat yetkazish ilovasi bo'laklarga bo'linyapti. Qaysi biri alohida qurib, tekshirib bo'ladigan bo'lak?", ru: 'Приложение доставки еды разбивают на части. Какую из них можно отдельно построить и проверить?' }, opts: [
    { uz: 'Ilovani hammaga yoqadigan qilish', ru: 'Сделать приложение, которое понравится всем' },
    { uz: 'Hamma narsani bir kunda qurib bitirish', ru: 'Построить всё за один день' },
    { uz: 'Buyurtmadan yetkazishgacha butun ilova', ru: 'Всё приложение — от заказа до доставки' },
    { uz: "Taomni savatga qo'shish", ru: 'Добавление блюда в корзину' }], correct: 3 },
  { q: { uz: "Maktab kutubxonasi saytini noldan quryapmiz. Birinchi versiyaga qaysi to'plam yetadi?", ru: 'Строим сайт школьной библиотеки с нуля. Какого набора хватит для первой версии?' }, opts: [
    { uz: 'Kitoblarga izoh yozish va o\'quvchilar reytingi', ru: 'Отзывы о книгах и рейтинг читателей' },
    { uz: "Kitobni qidirib, band emasligini ko'rish — qolgani keyin", ru: 'Найти книгу и узнать, свободна ли, — остальное потом' },
    { uz: "Saytning hamma qismi, birortasi ham qolmasdan", ru: 'Все части сайта, без единого исключения' },
    { uz: "Kitobni do'stga sovg'a qilish — qolgani keyin", ru: 'Дарить книгу другу — остальное потом' }], correct: 1 },
  { q: { uz: "O'yin ilovasini jamoa olti bo'lakka bo'ldi. Bundan qanday foyda bor?", ru: 'Команда разбила игровое приложение на шесть частей. Какая от этого польза?' }, opts: [
    { uz: "Har bo'lakni alohida qurib, tekshirish osonroq", ru: 'Каждую часть проще отдельно построить и проверить' },
    { uz: 'Ilova olti barobar tezroq yuklanadigan bo\'ladi', ru: 'Приложение будет загружаться в шесть раз быстрее' },
    { uz: "Endi hech qaysi bo'lakni tekshirish kerak emas", ru: 'Теперь ни одну часть проверять не нужно' },
    { uz: "Hamma bo'lak bir xil kattalikda bo'lib qoladi", ru: 'Все части станут одного размера' }], correct: 0 },
  // — 3-blok · qaysi biri avval —
  { q: { uz: "Ovqat yetkazish ilovasi: «Buyurtma berish» ko'p odamga kerak, qurish 3 kun oladi. Qaysi katakka tushadi?", ru: 'Приложение доставки еды: «Оформление заказа» нужно многим, строить 3 дня. В какую клетку?' }, opts: [
    { uz: 'Rejaga tushadi', ru: 'Идёт в план' },
    { uz: "Vaqt bo'lsa", ru: 'Если будет время' },
    { uz: 'Avval qilinadi', ru: 'Делаем первым' },
    { uz: 'Hozircha keyinroq', ru: 'Пока позже' }], correct: 2 },
  { q: { uz: "Kutubxona sayti: «Kitobga izoh yozish» kam o'quvchiga kerak, qurish 2 kun oladi. Qaysi katakka tushadi?", ru: 'Сайт библиотеки: «Отзыв о книге» нужен немногим ученикам, строить 2 дня. В какую клетку?' }, opts: [
    { uz: 'Hozircha keyinroq', ru: 'Пока позже' },
    { uz: 'Avval qilinadi', ru: 'Делаем первым' },
    { uz: 'Rejaga tushadi', ru: 'Идёт в план' },
    { uz: "Vaqt bo'lsa", ru: 'Если будет время' }], correct: 3 },
  { q: { uz: "O'yin ilovasida ikki bo'lak ham tez quriladi. Bu darsdagi mashqda qaysi biri oldin olinadi?", ru: 'В игровом приложении обе части строятся быстро. Какую в упражнении этого урока берут первой?' }, opts: [
    { uz: "Ko'proq o'yinchiga kerak bo'lgani", ru: 'Ту, что нужна большему числу игроков' },
    { uz: "Ro'yxatda birinchi turgan bo'lagi", ru: 'Ту, что стоит первой в списке' },
    { uz: "Qurish uchun qiziqroq bo'lagi", ru: 'Ту, которую интереснее строить' },
    { uz: "Ekranda kattaroq ko'rinadigani", ru: 'Ту, что крупнее выглядит на экране' }], correct: 0 },
  // — 4-blok · qachon tayyor —
  { q: { uz: "Kutubxona saytining «Kitobni band qilish» bo'lagi uchun qaysi shartni aniq tekshirib bo'ladi?", ru: 'Какое условие для части «Бронирование книги» на сайте библиотеки можно точно проверить?' }, opts: [
    { uz: "Band qilish tugmasi ekranda ko'zga yoqimli ko'rinadi", ru: 'Кнопка бронирования приятно выглядит на экране' },
    { uz: '«Band qilish» bosilsa, kitob yonida «Band» yozuvi chiqadi', ru: 'После нажатия «Забронировать» у книги появится «Занята»' },
    { uz: "Kitobni band qilish juda tez va hammaga qulay bo'ladi", ru: 'Бронировать книгу будет очень быстро и всем удобно' },
    { uz: "Band qilingan kitob sahifasi zamonaviy ko'rinishda bo'ladi", ru: 'Страница забронированной книги будет выглядеть современно' }], correct: 1 },
  { q: { uz: "O'yin ilovasi: dasturchi «Saqlash tugmasi ishlaydi» dedi. «Tayyor» deyish uchun nima kerak?", ru: 'Игровое приложение: разработчик сказал «Кнопка сохранения работает». Что нужно, чтобы сказать «готово»?' }, opts: [
    { uz: "Tugmani bir marta bosib, ishlaganini ko'rish", ru: 'Нажать кнопку один раз и увидеть, что работает' },
    { uz: 'Dasturchining o\'zi «tayyor» deb aytishi', ru: 'Чтобы разработчик сам сказал «готово»' },
    { uz: "Tugma ilovada chiroyli ko'rinishi", ru: 'Чтобы кнопка красиво смотрелась в приложении' },
    { uz: 'Kelishilgan hamma shart tekshirilib, bajarilishi', ru: 'Проверить, что все согласованные условия выполнены' }], correct: 3 },
  { q: { uz: 'Ovqat yetkazish ilovasini tekshirganda bitta shart bajarilmadi. Keyin nima bo\'ladi?', ru: 'При проверке приложения доставки еды одно условие не выполнилось. Что дальше?' }, opts: [
    { uz: "Shart ro'yxatdan o'chiriladi va ish tugaydi", ru: 'Условие вычёркивают из списка, и работа закончена' },
    { uz: 'Ish baribir «tayyor» deb aytiladi', ru: 'Работу всё равно называют «готовой»' },
    { uz: 'Dasturchi tuzatadi va shart qayta tekshiriladi', ru: 'Разработчик исправляет, и условие проверяют заново' },
    { uz: 'Qolgan shartlar endi tekshirilmaydi', ru: 'Остальные условия больше не проверяют' }], correct: 2 },
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
    const TOK = tr({ uz: ['HIKOYA', "BO'LAK", 'MVP', 'SHART', 'TAYYOR', '🚕', '🎯', '🏔', '🌱', '✅'],
                     ru: ['ИСТОРИЯ', 'ЧАСТЬ', 'MVP', 'УСЛОВИЕ', 'ГОТОВО', '🚕', '🎯', '🏔', '🌱', '✅'] });
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

// ===== 19-EKRAN — FLASHCARD (5 ta · PmLesson5 Flashcards porti) =====
const FLASHCARDS = [
  { front: { uz: 'Foydalanuvchi hikoyasida qaysi uch narsa bor?', ru: 'Какие три вещи есть в пользовательской истории?' }, back: { uz: 'Kim · nimani xohlaydi · nima uchun', ru: 'Кто · чего хочет · зачем' } },
  { front: { uz: 'Dekompozitsiya nima?', ru: 'Что такое декомпозиция?' }, back: { uz: "Katta ishni alohida bajarib, tekshirib bo'ladigan bo'laklarga bo'lish", ru: 'Разбить большую работу на части, которые можно отдельно сделать и проверить' } },
  { front: { uz: 'Birinchi versiya nima?', ru: 'Что такое первая версия?' }, back: { uz: "Odamga asosiy foydani beradigan va g'oyani sinab ko'rishga yetadigan eng kichik mahsulot", ru: 'Самый маленький продукт, который даёт человеку главную пользу и которого хватает, чтобы проверить идею' } },
  { front: { uz: "Bu darsda qaysi bo'lak avval quriladi?", ru: 'Какая часть на этом уроке строится первой?' }, back: { uz: "Ko'p odamga kerak va tez quriladigan", ru: 'Та, что нужна многим и строится быстро' } },
  { front: { uz: '«Ishlaydi» va «tayyor» farqi nimada?', ru: 'Чем «работает» отличается от «готово»?' }, back: { uz: "«Ishlaydi» — bir marta to'g'ri natija berdi · «Tayyor» — kelishilgan hamma shart tekshirildi", ru: '«Работает» — один раз дало верный результат · «Готово» — все согласованные условия проверены' } },
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

// ===== 20-EKRAN — ARENA (CodeStrike, 12 savol — P0 Screen16 CTA mantiqi) + YAKUN (to'rt qator) =====
const SUMMARY_LINES = [
  { uz: 'Hikoyangizda kim, nimani xohlashi va nima uchun — uchalasi bor.', ru: 'В вашей истории есть все три части: кто, чего хочет и зачем.' },
  { uz: "Katta g'oyani alohida tekshirib bo'ladigan bo'laklarga ajratdingiz.", ru: 'Вы разбили большую идею на части, которые можно проверить по отдельности.' },
  { uz: "Birinchi bo'lakni odamlar ehtiyoji va vaqtga qarab tanladingiz.", ru: 'Вы выбрали первую часть по тому, что нужно людям, и по времени.' },
  { uz: "Birinchi bo'lakka tekshiriladigan shartlar yozdingiz — ular bajarilib, muhim holatlar tekshirilsa, ish tayyor.", ru: 'Вы написали для первой части проверяемые условия — когда они выполнены и важные случаи проверены, работа готова.' },
];
// Yakun-qadamlari darsning 4 bo'limi rangida: hikoya (indigo) · bo'laklar (ko'k) · birinchisi (amber) · shartlar (yashil).
const RECAP_IC = ['📝', '🧩', '🎯', '✅'];
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
    <Stage eyebrow={tr({ uz: 'Yakun', ru: 'Итог' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><div className="nav-mdock"><MentorNote>{tr({ uz: "Og'zaki ayting: «Backend modulida shu hikoya va bo'laklardan kelib chiqib, qanday ma'lumot kerakligini va uni qayerda saqlashni o'rganasiz.»", ru: 'Скажите устно: «В модуле Backend вы, исходя из этой истории и частей, узнаете, какие данные нужны и где их хранить».' })}</MentorNote></div><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen">
        <div className="hero"><div className="hero-l"><span className="done-chip fade-up"><span className="tick" aria-hidden="true" />{tr({ uz: 'Dars tugadi', ru: 'Урок завершён' })}</span><h2 className="title h-title fade-up d1">{tr({ uz: "Endi sizda shunchaki g'oya emas, uni qurishni boshlash uchun aniq reja bor.", ru: 'Теперь у вас не просто идея, а чёткий план, с которого можно начать её строить.' })}</h2></div></div>
        <div className={`qz-cta cs-cta fade-up d1 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark stats={false} liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Подождите ментора' }) : studentLive ? tr({ uz: "▶ Qo'shilish uchun bosing — 12 savol, har biriga 15 soniya", ru: '▶ Нажмите, чтобы присоединиться — 12 вопросов, по 15 секунд' }) : tr({ uz: '▶ Boshlash uchun bosing — 12 savol, har biriga 15 soniya', ru: '▶ Нажмите, чтобы начать — 12 вопросов, по 15 секунд' })} />
        </div>
        {arena && <QuizArena live={_live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        <div className={`sum-row${isMentor ? ' solo' : ''}`}>
          <div className="card fade-up d2"><ul className="recap">{SUMMARY_LINES.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.12}s` }}><span className={`rc-step s${i + 1}`} aria-hidden="true">{RECAP_IC[i]}</span><span>{tr(r)}</span></li>))}</ul></div>
          {!isMentor && <div className="card ach-coll fade-up d3">
            <div className="card-lbl" style={{ color: T.accent }}>🏅 {tr({ uz: 'Nishonlaringiz —', ru: 'Ваши значки —' })} {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
            <div className="ach-grid">
              {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return (
                <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`}>
                  {got ? <span className="ach-badge-ic">{a.icon}</span> : <span className="ach-badge-ic lock" aria-hidden="true" />}
                  {/* QA (B2 naqshi): inglizcha nom ostida o'zbekcha tavsif EKRANDA (title faqat sichqonchada ko'rinardi, planshet/proyektorda yo'q) */}
                  <span className="ach-badge-txt"><span className="ach-badge-name">{a.name}</span><span className="ach-badge-desc">{tr(a.desc)}</span></span>
                </div>
              ); })}
            </div>
          </div>}
        </div>
      </div>
    </Stage>
  );
};
// ============================================================ LESSON ROOT — ({ lang, onFinished, liveToken })
export default function BridgeNimaQuramiz({ lang: langProp, onFinished, liveToken }) {
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

  // Tartib = SCREEN_META (20 sahifa = senariy 20 ekrani; 20-ekranda Arena + Yakun).
  const screens = [ScreenHook, ScreenGoal, ScreenParts, ScreenTest1, ScreenSplit, ScreenCase, ScreenTest2, ScreenGrid, ScreenTest3, ScreenOrder, ScreenTest4, ScreenSteps, ScreenStory, ScreenParts2, ScreenConds, ScreenAI, ScreenPeer, ScreenPodium, ScreenFlash, ScreenSummary];
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
        .turn-wave.wv4::after { animation-name: turn-wave4; animation-duration: 2.8s; }
        @keyframes turn-wave4 { 0%, 100% { opacity: 0; } 9% { opacity: 0.7; } 25% { opacity: 0; } }
        .turn-wave.wv4.w4::after { animation-delay: 2.1s; }
        /* wv5 — besh variantli qator (12-ekran qadamlari): w5 ga ham kechikish, bir lahzada bittasi yonadi (QA 2026-09-24). */
        .turn-wave.wv5::after { animation-name: turn-wave5; animation-duration: 3.5s; }
        @keyframes turn-wave5 { 0%, 100% { opacity: 0; } 8% { opacity: 0.7; } 20% { opacity: 0; } }
        .turn-wave.wv5.w4::after { animation-delay: 2.1s; }
        .turn-wave.wv5.w5::after { animation-delay: 2.8s; }
        /* Navbat YURISHI: bitta qadam — paydo bo'ladi, turadi, so'nadi (bir marta). */
        .turn-step::after { animation-name: turn-step; animation-duration: 1.3s; animation-iteration-count: 1; }
        @keyframes turn-step { 0% { opacity: 0; } 20% { opacity: 0.68; } 78% { opacity: 0.68; } 100% { opacity: 0; } }
        /* Kiritish maydoni ::after qabul qilmaydi — halqa o'rovchi qatlamga qo'yiladi (layout o'zgarmaydi). */
        @media (prefers-reduced-motion: reduce) { .turn-hint, .turn-ring::after, .turn-wave.wv4::after, .turn-wave.wv5::after { animation: none; } .turn-ring::after { opacity: 0; } }
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
        /* Zaxira (pilot naqshi 13-band, B2/B3 bilan bir xil): mentor surati katta (1,6 MB) va sekin yuklanadi — yuklanguncha
           yoki umuman kelmasa doira bo'sh qolmasin: fonda xuddi shu robotning soddalashgan yuzi (ekran + ikki ko'z + tana). */
        .mentor-ava { background:
          radial-gradient(circle at 39% 34%, ${T.blueSoft} 0 6%, transparent 7%),
          radial-gradient(circle at 61% 34%, ${T.blueSoft} 0 6%, transparent 7%),
          radial-gradient(ellipse 27% 20% at 50% 35%, ${T.ink} 0 94%, transparent 100%),
          radial-gradient(ellipse 34% 27% at 50% 35%, ${T.paper} 0 94%, transparent 100%),
          radial-gradient(ellipse 30% 24% at 50% 100%, ${T.ink2} 0 94%, transparent 100%),
          ${T.accentSoft}; }
        .mentor-ava img { position: relative; }
        /* ⛶ Kattalashtirish (PmLesson2 / pilot B1 / B3 bloki AYNAN) */
        .zoomable { position: relative; }
        .zoom-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; border-radius: 8px; border: none; background: rgba(255,255,255,0.82); color: ${T.ink2}; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
        .zoom-btn:hover { background: ${T.paper}; color: ${T.accent}; transform: scale(1.08); }
        .zoom-backdrop { position: fixed; inset: 0; background: rgba(27,22,48,0.55); z-index: 1000; animation: fade-step 0.25s ease; }
        .zoom-on { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(880px,94vw); max-height: calc(90vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(20px,4vw,42px); box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        @keyframes zoom-pop { from { opacity: 0; transform: translate(-50%,-50%) scale(0.93); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
        .zoom-on.zphone { width: min(460px,94vw); }
        .zoom-on.zphone .ow-phone { max-width: none; }
        @media (prefers-reduced-motion: reduce) { .zoom-on, .zoom-backdrop { animation: none !important; } .zoom-btn:hover { transform: none; } }
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
        /* MENTOR-DOK (tekshiruvchi QA 2026-09-24): mentor rejimining qo'shimchalari — «Kim bajardi» paneli va «Eslatma» chipi —
           pastki navigatsiya qatorining bo'sh o'rtasida turadi. Ekran mazmuni o'quvchi ko'rinishi bilan bir xil balandlikda qoladi
           (1280x800, TopBar bilan: aylantirish yo'q), chip esa har ekranda bir joyda — «Orqaga» yonida, hech qachon pastda yashirinmaydi.
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
        /* O'quvchi sinf-pulsi (45-qonun) shu dokda — mentor paneli bilan bir o'rin; mazmun balandligini olmaydi (D1, 25.09) */
        .nav-mdock > .sp-pulse { align-self: center; flex: 0 1 auto; min-width: 0; flex-wrap: wrap; row-gap: 2px; padding: 7px 14px; line-height: 1.3; }
        @media (max-width: 760px) {
          .stage-nav:has(> .nav-mdock:not(:empty)) { flex-wrap: wrap; row-gap: 8px; }
          .nav-mdock { order: -1; flex-basis: 100%; }
          .nav-mdock > .mnote { width: 100%; }
        }

        /* === HOOK v3: xabar-almashtirgich + radio-variantlar (PmLesson2 andozasi) === */
        /* Sinf ovozi karta ustida: sarlavhada «👥 N%», pastki chetda ingichka chiziq (karta balandligi o'zgarmaydi). Ko'p ovoz olgan karta — yashil. */
        .tk-vote { margin-left: auto; display: inline-flex; align-items: center; gap: 4px; padding: 2px 9px; border-radius: 99px; background: ${T.accentSoft}; color: ${T.accent}; font-size: 11.5px; font-weight: 700; letter-spacing: 0; text-transform: none; }
        .tk-vote.top { background: ${T.successSoft}; color: ${T.success}; }
        .tk-vote.wait { font-family: 'Manrope'; background: ${T.successSoft}; color: ${T.success}; }
        .tk-vote + .tk-n { margin-left: 0; }
        .tk-vbar { position: absolute; left: 16px; right: 16px; bottom: 4px; height: 3px; border-radius: 99px; background: ${T.bg}; overflow: hidden; }
        .tk-vbar > i { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); transition: width 0.6s cubic-bezier(.2,.7,.2,1); }
        .tk-vbar.top > i { background: linear-gradient(90deg, ${T.success}, #0E8A55); }
        @media (prefers-reduced-motion: reduce) { .tk-vbar > i { transition: none; } }

        .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
        .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
        .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
        .small { font-size: clamp(12.5px,1.4vw,13.5px); }
        .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }
        /* FlowLabel (pilot naqshi 10-band): ustun tepasida «NIMA — NIMA QILASIZ»; o'ng uchida holat/progress (n/N) */
        .flow-label.fl-row { margin: 0; display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 0; }
        .fl-row > span { min-width: 0; }
        .fl-end { flex-shrink: 0; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 2px 8px; }
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
        .done-chip .tick::after { content: ''; position: absolute; left: 50%; top: 45%; width: 3.5px; height: 7px; border: solid #fff; border-width: 0 2px 2px 0; transform: translate(-50%,-50%) rotate(45deg); }
        .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 400; line-height: 1; } .ring-den { color: ${T.ink3}; font-size: 20px; } .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
        .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); }
        .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
        .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; } .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
        .recap li { align-items: center; }
        .rc-step { flex-shrink: 0; width: 30px; height: 30px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 15px; background: ${T.accentSoft}; }
        .rc-step.s2 { background: ${T.blueSoft}; } .rc-step.s3 { background: ${AMBER_SOFT}; } .rc-step.s4 { background: ${T.successSoft}; }
        /* === K11 SLAYD (s4) === */
        .k-slide { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(24px,4vw,38px) clamp(20px,3.5vw,34px) clamp(20px,3.5vw,34px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
        /* F-0925-QA09: keys slaydi tepasidagi gradient chiziq olindi (foydalanuvchi tanlovi 1; Netflix slaydidagi qizil brend-chizig'i qoladi) */
        .k-slide-eyebrow { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(10px,1.3vw,12px); letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 5px 14px; }
        .k-slide-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(20px,3.2vw,30px); color: ${T.ink}; margin: 0; }
        .k-slide-body { font-size: clamp(15px,2vw,18px); color: ${T.ink2}; line-height: 1.55; max-width: 620px; margin: 0; } .k-slide-body b { color: ${T.ink}; }
        .k-dots { display: flex; gap: 8px; justify-content: center; }
        .k-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
        .k-dot.fill { background: ${T.ink3}; } .k-dot.cur { background: ${T.accent}; width: 26px; }
        /* Keys-slayd ichki boshqaruvi + kesish-maketi (F-0924-07) — B3 .k-nav / .k-slide.ph / .cut-* bloki AYNAN */
        .k-nav { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 4px; }
        .k-prev.btn-soft { padding: 9px 16px; font-size: 13.5px; border-radius: 10px; }
        .k-next { border: none; border-radius: 10px; padding: 9px 18px; background: ${T.accent}; color: #fff; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13.5px; cursor: pointer; }
        .k-fig { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; min-width: 0; }
        .k-slide.ph { padding: clamp(18px,2.6vw,26px) clamp(18px,3vw,30px); min-height: clamp(190px,26vh,230px); display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.15fr); column-gap: clamp(16px,2.5vw,28px); row-gap: 8px; align-items: center; text-align: left; }
        .k-slide.ph > .k-fig { grid-column: 1; grid-row: 1 / span 4; }
        .k-slide.ph > :not(.k-fig) { grid-column: 2; justify-self: start; }
        .k-slide.ph .k-nav { justify-content: flex-start; }
        @media (max-width: 760px) { .k-slide.ph { display: flex; flex-direction: column; text-align: center; } .k-slide.ph > :not(.k-fig) { justify-self: auto; } }
        .k-photo { position: relative; display: block; width: min(320px, 100%); height: clamp(120px,17vw,170px); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.4), inset 0 0 0 1px ${T.line}; background: ${T.bg}; }
        .k-photo.emo { display: flex; align-items: center; justify-content: center; }
        .cut-wrap { display: flex; align-items: flex-start; justify-content: center; gap: clamp(8px,1.6vw,14px); margin: 4px 0 2px; animation: fade-step 0.4s ease both; }
        .cut-col { display: flex; flex-direction: column; gap: 4px; min-width: 96px; }
        .cut-cap { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(9.5px,1.1vw,11px); letter-spacing: 0.1em; text-transform: uppercase; color: ${T.ink3}; margin-bottom: 2px; }
        .cut-item { font-family: 'JetBrains Mono', monospace; font-size: clamp(10px,1.2vw,11.5px); padding: 4px 8px; border-radius: 6px; background: ${T.paper}; color: ${T.ink}; box-shadow: inset 0 0 0 1px rgba(${T.shadowBase},0.12); }
        .cut-item.gone { color: ${T.ink3}; text-decoration: line-through; background: transparent; box-shadow: none; }
        .cut-item.keep { color: ${T.success}; box-shadow: inset 0 0 0 1px ${T.success}; }
        .cut-arrow { font-size: clamp(15px,2vw,19px); color: ${T.accent}; align-self: center; }
        @media (prefers-reduced-motion: reduce) { .cut-wrap { animation: none; } }

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
        .tq { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .tq-lead { margin: 0; font-family: 'Manrope', sans-serif; font-size: clamp(14.5px,1.8vw,16px); line-height: 1.5; color: ${T.ink2}; }
        .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; margin: 0; color: ${T.ink}; }
        /* TEST (F-0924-06): PmLesson2 savol-qolipi — bitta ustun, tanlagach ixcham (izoh ichki aylantirishsiz sig'adi). Pilot B1 / B3 naqshi */
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
        /* 20-ekran (58-qonun): xulosa va nishonlar yonma-yon (1.5fr : 1) — 1280x800 da sig'adi; telefonda ustma-ust. */
        .sum-row { display: grid; grid-template-columns: minmax(0,1.5fr) minmax(0,1fr); gap: clamp(12px,2vw,18px); align-items: stretch; }
        .sum-row.solo { grid-template-columns: 1fr; }
        .sum-row .ach-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 6px; }
        .sum-row .ach-coll .ach-badge { padding: 6px 8px; gap: 6px; min-width: 0; }
        .sum-row .ach-coll .ach-badge-ic { font-size: 17px; }
        .sum-row > .card { padding: 14px 18px; }
        .sum-row .ach-coll .card-lbl { margin-bottom: 4px; }
        .sum-row .ach-badge-name { font-size: 12.5px; overflow-wrap: anywhere; }
        .sum-row .ach-coll .ach-badge { justify-content: flex-start; align-items: flex-start; text-align: left; }
        .ach-badge-txt { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .ach-badge-desc { font-family: 'Manrope'; font-weight: 500; font-size: 11px; line-height: 1.25; color: ${T.ink2}; overflow-wrap: anywhere; }
        .ach-badge.locked .ach-badge-desc { color: ${T.ink3}; }
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

  .shake { animation: b2-shake 0.42s ease; }
  @keyframes b2-shake { 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
  @media (prefers-reduced-motion: reduce) { .shake { animation: none; } }

  .kp-ask { font-size: clamp(16px,2.2vw,20px) !important; line-height: 1.45; max-width: 640px; }

  @keyframes gb-pop { 0% { transform: scale(0.8); } 60% { transform: scale(1.06); } 100% { transform: none; } }
  .gb-sent { position: relative; display: flex; flex-direction: column; gap: 6px; min-width: 0; background: ${T.paper}; border-radius: 14px; padding: 12px 16px; box-shadow: inset 0 0 0 1px ${T.line}, 0 8px 20px -14px rgba(${T.shadowBase},0.35); transition: box-shadow 0.25s, border-color 0.25s; }
  .gb-sent.ok { box-shadow: inset 0 0 0 2px ${T.success}77, 0 0 0 5px ${T.success}14, 0 12px 26px -14px rgba(18,169,104,0.45); }
  .gb-sent.build.ok::after { content: ''; position: absolute; top: 12px; right: 14px; width: 26px; height: 26px; border-radius: 50%; background: ${T.success}; box-shadow: 0 4px 12px -3px rgba(18,169,104,0.6); animation: gb-pop 0.4s cubic-bezier(.34,1.6,.4,1); }
  .gb-sent.build.ok::before { content: ''; position: absolute; top: 18px; right: 23px; width: 6px; height: 11px; border: solid #fff; border-width: 0 2.5px 2.5px 0; transform: rotate(45deg); z-index: 1; }
  .gb-sent-t { font-family: 'Source Serif 4', serif; font-size: clamp(16px,2.2vw,20px); line-height: 1.7; color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; padding-right: 30px; }
  /* 13-ekran: hikoya-oynasi ixchamroq qator oralig'ida (58-qonun, 1280x800 sig'ishi). */
  .pw-form ~ .gb-sent .gb-sent-t { line-height: 1.5; padding-right: 0; }
  .gb-sent-h { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; min-width: 0; }
  .gb-sent-h .pw-save { margin-left: auto; padding: 8px 16px; }
  .gb-ph { color: ${T.ink3}; font-style: italic; }
  @media (prefers-reduced-motion: reduce) { .gb-sent { transition: none; } .gb-sent.build.ok::after { animation: none; } }

  .ic-card { display: flex; flex-direction: column; gap: 8px; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.34); }
  .ic-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
  .ic-lbl { font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 10.5px; letter-spacing: 0.06em; color: ${T.ink3}; }
  .ic-val { font-size: 14px; color: ${T.ink}; line-height: 1.4; min-width: 0; overflow-wrap: anywhere; }
  .ip-box { display: flex; flex-direction: column; gap: 8px; }
  .ip-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .ip-chip { font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; cursor: pointer; border: none; border-radius: 99px; padding: 8px 15px; background: ${T.paper}; color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .ip-chip.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .pw-form { display: flex; flex-direction: column; gap: 10px; }
  .pw-f { display: flex; flex-direction: column; gap: 5px; min-width: 0; position: relative; }
  .pw-f > span { font-family: 'Manrope'; font-weight: 800; font-size: 13px; }
  .pw-f input { width: 100%; min-width: 0; font-family: 'Manrope'; font-size: 15px; color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 11px; padding: 11px 13px; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; transition: box-shadow 0.15s; }
  .pw-f input:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
  .pw-f.on input { box-shadow: inset 0 0 0 1.5px ${T.success}88; }
  .pw-f input:disabled { opacity: 0.55; }
  .pw-f.slot-kim input { } .pw-f.slot-nima input { } .pw-f.slot-why input { }
  .pw-f.turn-ring::after { inset: -4px; border-radius: 13px; }
  /* F-0925-B12/B14 · YOZISH MAYDONI ko'rinib tursin: bo'sh maydon — kesik chiziqli rangli chegara + o'ngda ✏️ qalamcha;
     navbat kelgan bo'sh maydonda miltillovchi kursor (maydonning o'z fonida chiziladi — yorliq yonda yoki tepada bo'lsa ham joyida). */
  .pw-f input::placeholder { color: ${T.ink2}; opacity: 0.85; }
  .pw-f input:placeholder-shown:not(:focus) { box-shadow: none; outline: 1.5px dashed ${T.accent}88; outline-offset: -1.5px; padding-right: 38px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235B3DE6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'/%3E%3Cpath d='M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; }
  .pw-f.turn-ring input:placeholder-shown:not(:focus):not(:disabled) { text-indent: 8px; background-image: linear-gradient(${T.accent}, ${T.accent}), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235B3DE6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20h9'/%3E%3Cpath d='M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z'/%3E%3C/svg%3E"); background-position: 13px center, right 12px center; background-size: 2px 18px, 16px; animation: pw-caret 1.05s steps(1) infinite; }
  @keyframes pw-caret { 50% { background-size: 0 18px, 16px; } }
  @media (prefers-reduced-motion: reduce) { .pw-f.turn-ring input:placeholder-shown:not(:focus) { animation: none; } }
  .pw-save { font-family: 'Manrope'; font-weight: 800; font-size: 14.5px; cursor: pointer; border: none; border-radius: 12px; padding: 11px 20px; background: ${T.accent}; color: #fff; box-shadow: 0 10px 22px -10px rgba(91,61,230,0.6); }
  .pw-save:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }

  .sl-hint.sl-hint { margin: -4px 0 0; font-size: 13px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 10px; padding: 7px 10px; }

  /* AiStep (F-0924-01/02) — B3 / pilot B1 bloki AYNAN: manba DeployLesson .pr-panel/.pr-copy + DoSteps + FallbackPanel */
  .ais { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .pr-panel { display: flex; flex-direction: column; background: ${T.paper}; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.16); }
  .pr-head { display: flex; align-items: center; gap: 10px; padding: 8px 13px; border-bottom: 1px solid ${T.line}; }
  .pr-lbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; color: ${T.ink2}; }
  .pr-body { margin: 0; padding: 10px 13px; max-height: min(24vh, 170px); overflow-y: auto; white-space: pre-wrap; word-break: break-word; overflow-wrap: anywhere; min-width: 0; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12.5px; line-height: 1.55; color: ${T.ink}; }
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
  /* 16-ekran (58-qonun): 🛟 zaxira ochilsa u AI qadamlari o'rnini egallaydi (Gemini ochilmagan — so'rov va ①② hozir kerak emas);
     zaxirani yopsangiz so'rov va qadamlar qaytadi. Ekran pastga cho'zilmaydi. */
  @media (min-width: 761px) { .ais:has(> .dsx-fb[open]) > .pr-panel, .ais:has(> .dsx-fb[open]) > .ais-steps { display: none; } }
  .ai-ready { display: flex; flex-direction: column; gap: 6px; }
  .ai-rq { text-align: left; font-family: 'Manrope'; font-weight: 600; font-size: 13.5px; cursor: pointer; border: none; border-radius: 10px; padding: 8px 12px; background: ${T.bg}; color: ${T.ink}; }
  .ai-rq.on { background: ${T.successSoft}; color: ${T.success}; font-weight: 800; }

  .pa-q { display: flex; gap: 10px; align-items: flex-start; background: ${T.paper}; border-radius: 12px; padding: 11px 14px; box-shadow: 0 6px 16px -12px rgba(${T.shadowBase},0.3); min-width: 0; }
  /* Korpus B-7 (16-ekran): shart raqami KVADRAT (15-ekran cd-box bilan bir xil) — chapdagi AI qadamlari ①②③ doirasi bilan ikkita «1» doira bo'lmasin */
  .ai-rule.ai-rule { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 12px; padding: 10px 13px; }
  .pa-q-n { flex-shrink: 0; width: 22px; height: 22px; border-radius: 6px; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; display: flex; align-items: center; justify-content: center; }
  .pa-q-t { font-family: 'Source Serif 4', serif; font-size: 15.5px; color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; }

  .pod-me { display: flex; flex-direction: column; align-items: center; gap: 6px; align-self: center; background: ${T.paper}; border-radius: 20px; padding: 22px 38px; box-shadow: 0 16px 36px -18px rgba(${T.shadowBase},0.4); }
  .pod-me-medal { font-size: 46px; line-height: 1; }
  .pod-me-place { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(24px,4vw,32px); color: ${T.accent}; }
  .pod-me-score { font-size: 15px; color: ${T.ink2}; font-weight: 700; }

        /* === BRIDGE-B5: dars mexanikalari (hook-topshiriqlar, reja-doska, uch qism, bo'laklash, to'rt katak, buyurtma oynasi, besh qadam, ustaxonalar) === */

  .tk-pair { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; align-items: stretch; }
  @media (max-width: 760px) { .tk-pair { grid-template-columns: 1fr; } }
  .tk-card { position: relative; display: flex; flex-direction: column; gap: 10px; text-align: left; min-width: 0; cursor: pointer; border: none; border-radius: 16px; padding: 16px 18px; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope'; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.35), inset 0 0 0 1px ${T.line}; transition: box-shadow 0.2s, transform 0.2s; }
  .tk-card:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 28px -14px rgba(${T.shadowBase},0.45), inset 0 0 0 1.5px ${T.accent}55; }
  .tk-card:disabled { cursor: default; }
  .tk-card.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 12px 26px -14px rgba(91,61,230,0.45); }
  .tk-head { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink3}; }
  .tk-n { margin-left: auto; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${T.accentSoft}; color: ${T.accent}; font-size: 12px; }
  .tk-txt { font-family: 'Source Serif 4', serif; font-size: clamp(16px,2vw,19px); line-height: 1.5; overflow-wrap: anywhere; min-width: 0; }
  .tk-mark { position: absolute; top: -9px; right: -9px; width: 26px; height: 26px; border-radius: 50%; background: ${T.accent}; color: #fff; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 14px; animation: gb-pop 0.35s cubic-bezier(.34,1.6,.4,1); }
  @media (prefers-reduced-motion: reduce) { .tk-card, .tk-card:hover:not(:disabled) { transition: none; transform: none; } .tk-mark { animation: none; } }

  .pd-demo { position: relative; display: grid; grid-template-columns: minmax(0,1.2fr) 28px minmax(0,1fr) 28px minmax(0,1fr); align-items: center; gap: 10px; background: ${T.paper}; border-radius: 18px; padding: 22px 20px; box-shadow: inset 0 0 0 1px ${T.line}, 0 14px 30px -18px rgba(${T.shadowBase},0.4); }
  @media (max-width: 760px) { .pd-demo { grid-template-columns: 1fr; } .pd-arrow { transform: rotate(90deg); justify-self: center; } }
  .pd-replay { position: absolute; top: 8px; right: 10px; border: none; background: ${T.bg}; color: ${T.ink2}; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 14px; }
  .pd-col { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .pd-cap { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.ink3}; }
  .pd-story { display: flex; flex-direction: column; gap: 6px; border-radius: 12px; background: ${T.bg}; padding: 10px 12px; }
  .pd-seg { display: flex; flex-direction: column; gap: 3px; opacity: 0; animation: pd-in 0.4s ease-out forwards; animation-delay: var(--fd); }
  .pd-seg em { font-style: normal; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; }
  .pd-seg.kim em { color: ${T.blue}; } .pd-seg.nima em { color: ${AMBER}; } .pd-seg.why em { color: ${T.success}; }
  .pd-arrow { height: 2px; background: ${T.ink3}; position: relative; opacity: 0; animation: pd-in 0.3s ease-out forwards; animation-delay: var(--fd); }
  .pd-arrow::after { content: ''; position: absolute; right: -1px; top: -4px; border: 5px solid transparent; border-left: 7px solid ${T.ink3}; border-right: 0; }
  .pd-tiles { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 7px; }
  .pd-tile { position: relative; display: flex; flex-direction: column; justify-content: center; gap: 4px; min-height: 40px; border-radius: 10px; padding: 8px 9px; background: ${T.bg}; box-shadow: inset 0 0 0 1px ${T.line}; opacity: 0; animation: pd-scatter 0.45s cubic-bezier(.34,1.4,.4,1) forwards; animation-delay: var(--fd); }
  .pd-tile.first { animation: pd-scatter 0.45s cubic-bezier(.34,1.4,.4,1) forwards, pd-first 0.5s ease-out 3.5s forwards; animation-delay: var(--fd), 3.5s; }
  .pd-first { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.success}; opacity: 0; animation: pd-in 0.3s ease-out 3.6s forwards; }
  .pd-conds { display: flex; flex-direction: column; gap: 7px; }
  .pd-cond { display: flex; align-items: center; gap: 8px; opacity: 0; animation: pd-in 0.35s ease-out forwards; animation-delay: var(--fd); }
  .pd-ck { width: 18px; height: 18px; border-radius: 50%; background: ${T.success}; flex-shrink: 0; position: relative; }
  .pd-ck::after { content: ''; position: absolute; left: 6px; top: 3px; width: 4px; height: 8px; border: solid #fff; border-width: 0 2px 2px 0; transform: rotate(45deg); }
  .pd-stamp { align-self: flex-end; margin-top: 4px; font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; letter-spacing: 0.08em; text-transform: uppercase; color: ${T.success}; border: 2px solid ${T.success}; border-radius: 8px; padding: 3px 10px; background: ${T.successSoft}; opacity: 0; animation: pd-stamp 0.45s cubic-bezier(.34,1.6,.4,1) forwards; animation-delay: var(--fd); }
  @keyframes pd-stamp { from { opacity: 0; transform: scale(1.8); } to { opacity: 1; transform: none; } }
  @keyframes pd-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  @keyframes pd-scatter { from { opacity: 0; transform: translateX(-26px) scale(0.85); } to { opacity: 1; transform: none; } }
  @keyframes pd-first { to { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px ${T.success}; } }
  @media (prefers-reduced-motion: reduce) { .pd-seg, .pd-arrow, .pd-tile, .pd-first, .pd-cond, .pd-stamp { animation: none !important; opacity: 1; } .pd-tile.first { background: ${T.successSoft}; box-shadow: inset 0 0 0 2px ${T.success}; } }

  .qs-pool { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; min-height: 48px; }
  .qs-chip { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.7vw,16px); cursor: pointer; border: none; border-radius: 12px; padding: 11px 15px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 6px 16px -8px rgba(${T.shadowBase},0.3), inset 0 0 0 1px ${T.line}; text-align: left; min-width: 0; overflow-wrap: anywhere; transition: transform 0.15s, box-shadow 0.15s; }
  .qs-chip:hover { transform: translateY(-1px); }
  .qs-chip.sel { box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 22px -10px rgba(91,61,230,0.45); color: ${T.accent}; }
  .qs-slot { display: inline-block; font-family: 'Manrope'; font-weight: 700; font-size: 0.82em; border-radius: 8px; padding: 1px 10px; margin: 0 2px; cursor: pointer; background: transparent; border: 1.5px dashed ${T.ink3}; color: ${T.ink3}; vertical-align: baseline; letter-spacing: 0.04em; }
  .qs-slot:disabled { cursor: default; }
  .qs-slot.kim { border-color: ${T.blue}88; color: ${T.blue}; } .qs-slot.nima { border-color: ${AMBER_LINE}; color: ${AMBER}; } .qs-slot.why { border-color: ${T.success}88; color: ${T.success}; }
  .qs-slot.targetable { background: ${T.accentSoft}55; } /* QA: cheksiz qs-glow olib tashlandi — uch joy birga yonardi (88-qonun d); navbat endi to'lqin (waveCls) */
  .qs-fill { border-radius: 6px; padding: 0 4px; animation: gb-pop 0.32s cubic-bezier(.34,1.6,.4,1); }
  /* F-0925-B08: sudrash — chip ko'tariladi va barmoq ortidan yuradi; ostidagi bo'sh joy to'q halqa oladi. Ko'rsatkich 👇 */
  .qs-chip { touch-action: none; }
  .qs-chip.lift { position: relative; z-index: 20; transition: none !important; cursor: grabbing; box-shadow: inset 0 0 0 2px ${T.accent}, 0 16px 32px -10px rgba(91,61,230,0.5); }
  .qs-pool:has(> .qs-chip.lift) { position: relative; z-index: 30; } /* qator o'z qatlamida — ko'tarilmasa chip gap-blokining ostida qolardi */
  .qs-slot.over { background: ${T.accentSoft}; box-shadow: 0 0 0 3px ${T.accent}55; }
  .qs-cue { margin: -4px 0 -6px; font-family: 'Manrope'; font-weight: 700; font-size: 13.5px; color: ${T.accent}; visibility: hidden; opacity: 0; transition: opacity 0.2s; }
  .qs-cue.on { visibility: visible; opacity: 1; }
  .qs-cue:not(.on) .qs-arrow { animation: none; }
  .qs-arrow { display: inline-block; animation: qs-arrow 0.7s ease-in-out 3; }
  @keyframes qs-arrow { 50% { transform: translateY(4px); } }
  @media (prefers-reduced-motion: reduce) { .qs-arrow { animation: none; } }
  .qs-fill.kim { color: ${T.blue}; background: ${T.blueSoft}; } .qs-fill.nima { color: ${AMBER}; background: ${AMBER_SOFT}; } .qs-fill.why { color: ${T.success}; background: ${T.successSoft}; }
  @media (prefers-reduced-motion: reduce) { .qs-chip { transition: none; } .qs-chip:hover { transform: none; } .qs-fill { animation: none; } }

  .sp-big { position: relative; align-self: center; display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: min(360px, 100%); margin-bottom: 14px; cursor: pointer; border: none; border-radius: 20px; padding: 26px 30px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 8px 0 -3px ${T.paper}, 0 8px 0 -2px ${T.line}, 0 15px 0 -6px ${T.paper}, 0 15px 0 -5px ${T.line}, 0 26px 40px -20px rgba(${T.shadowBase},0.45), inset 0 0 0 1.5px ${T.accent}33; transition: transform 0.2s; }
  .sp-tree { position: relative; border: 2px dashed ${T.accent}44; border-radius: 20px; padding: 26px 14px 14px; margin-top: 10px; }
  .sp-root { position: absolute; top: 0; left: 50%; transform: translate(-50%,-50%); display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; max-width: calc(100% - 24px); overflow: hidden; text-overflow: ellipsis; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(14px,1.8vw,16px); color: ${T.accent}; background: ${T.bg}; border-radius: 999px; padding: 4px 14px; box-shadow: inset 0 0 0 1.5px ${T.accent}44; animation: fade-step 0.3s ease-out; }
  .sp-big:hover { transform: translateY(-2px); }
  .sp-big-ic { font-size: 34px; line-height: 1; }
  .sp-big-t { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(19px,2.6vw,24px); }
  .sp-big-cue { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.accent}; }
  .sp-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; }
  @media (max-width: 760px) { .sp-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
  .sp-tile { display: flex; align-items: center; gap: 10px; min-width: 0; border-radius: 14px; padding: 13px 14px; background: ${T.paper}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.35), inset 0 0 0 1px ${T.line}; opacity: 0; animation: sp-out 0.45s cubic-bezier(.34,1.4,.4,1) forwards; }
  @keyframes sp-out { from { opacity: 0; transform: translate(var(--sx,0), var(--sy,0)) scale(0.6); } to { opacity: 1; transform: none; } }
  .sp-ic { font-size: 22px; flex-shrink: 0; }
  .sp-t { font-family: 'Manrope'; font-weight: 700; font-size: clamp(14px,1.7vw,15.5px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; }
  @media (prefers-reduced-motion: reduce) { .sp-big { transition: none; } .sp-big:hover { transform: none; } .sp-tile, .sp-root { animation: none; opacity: 1; } }

  .gr-list { display: flex; flex-direction: column; gap: 8px; }
  .gr-item { display: flex; flex-direction: column; gap: 4px; text-align: left; min-width: 0; cursor: pointer; border: none; border-radius: 12px; padding: 10px 13px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 6px 16px -10px rgba(${T.shadowBase},0.3), inset 0 0 0 1px ${T.line}; }
  .gr-item.sel { box-shadow: inset 0 0 0 2px ${T.accent}, 0 10px 22px -12px rgba(91,61,230,0.45); }
  .gr-item-h { font-family: 'Manrope'; font-weight: 800; font-size: 14.5px; overflow-wrap: anywhere; }
  .gr-item-d { display: flex; flex-wrap: wrap; gap: 6px; font-family: 'Manrope'; font-size: 12.5px; color: ${T.ink2}; overflow-wrap: anywhere; }
  .gr-item:hover { transform: translateY(-1px); } .gr-item { transition: transform 0.15s, box-shadow 0.15s; }
  .gr-ans { display: inline-flex; align-items: center; gap: 6px; min-width: 0; background: ${T.bg}; border-radius: 999px; padding: 3px 9px 3px 7px; }
  .gr-board { display: grid; grid-template-columns: 26px minmax(0,1fr); grid-template-rows: auto minmax(0,1fr) auto auto; column-gap: 8px; row-gap: 6px; }
  .gr-yax { grid-column: 1; grid-row: 2; position: relative; display: grid; grid-template-rows: 1fr 1fr; gap: 8px; border-right: 2px solid ${T.accent}66; }
  .gr-yax::before { content: ''; position: absolute; right: -6px; top: -7px; border: 5px solid transparent; border-top: 0; border-bottom: 8px solid ${T.accent}88; }
  .gr-yax > span { writing-mode: vertical-rl; transform: rotate(180deg); align-self: center; justify-self: center; white-space: nowrap; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; color: ${T.ink2}; }
  .gr-xax { grid-column: 2; grid-row: 3; position: relative; display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; border-top: 2px solid ${T.accent}66; padding-top: 5px; }
  .gr-xax::after { content: ''; position: absolute; right: -7px; top: -6px; border: 5px solid transparent; border-right: 0; border-left: 8px solid ${T.accent}88; }
  .gr-xax > span { text-align: center; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; color: ${T.ink2}; }
  .gr-cells { grid-row: 2; grid-column: 2; display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); grid-auto-rows: 1fr; gap: 8px; }
  .gr-cell { display: flex; flex-direction: column; align-items: stretch; gap: 5px; min-height: 104px; min-width: 0; text-align: left; border: none; border-radius: 14px; padding: 10px 11px; cursor: default; font-family: 'Manrope'; color: ${T.ink}; }
  .gr-cell.avval { background: ${T.successSoft}; } .gr-cell.reja { background: ${T.blueSoft}; } .gr-cell.vaqt { background: ${AMBER_SOFT}; } .gr-cell.keyin { background: ${T.bg}; }
  .gr-cell.targetable { cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .gr-cell-h { font-weight: 800; font-size: 13.5px; overflow-wrap: anywhere; }
  .gr-att { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; font-size: 12.5px; font-weight: 700; background: ${T.paper}; border-radius: 8px; padding: 5px 8px; overflow-wrap: anywhere; min-width: 0; animation: gb-pop 0.32s cubic-bezier(.34,1.6,.4,1); }
  .gr-att-t { min-width: 0; }
  .gr-att.first { box-shadow: inset 0 0 0 2px ${T.success}; }
  .gr-att.first::after { content: '1'; position: absolute; top: -8px; left: -6px; width: 18px; height: 18px; border-radius: 50%; background: ${T.success}; color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 800; display: flex; align-items: center; justify-content: center; animation: gb-pop 0.4s cubic-bezier(.34,1.6,.4,1) 0.3s both; }
  .gr-cell.keyin { box-shadow: none; border: 1.5px dashed ${T.ink3}88; }
  .gr-cell.keyin.targetable { border-color: ${T.accent}88; }
  .gr-left { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
  @media (max-width: 760px) { .split > .col:has(.gr-left) { order: 2; } }
  @media (prefers-reduced-motion: reduce) { .gr-att, .gr-att.first::after { animation: none; } .gr-item, .gr-item:hover { transition: none; transform: none; } }

  .ow-phone { position: relative; display: flex; flex-direction: column; gap: 8px; max-width: 320px; width: 100%; align-self: center; background: ${T.paper}; border-radius: 32px; padding: 20px 12px 10px; box-shadow: inset 0 0 0 2px ${T.line}, inset 0 0 0 7px ${T.bg}, 0 22px 44px -24px rgba(${T.shadowBase},0.5); transition: box-shadow 0.2s; }
  .ow-phone.live { box-shadow: inset 0 0 0 2px ${T.accent}66, inset 0 0 0 7px ${T.bg}, 0 0 0 5px ${T.accent}14, 0 22px 44px -24px rgba(${T.shadowBase},0.5); }
  @media (max-width: 640px) { .ow-phone { max-width: 280px; } }
  .ow-map { display: block; width: 100%; height: auto; aspect-ratio: 300 / 80; border-radius: 16px; box-shadow: inset 0 0 0 1px ${T.line}; }
  .ow-ground { fill: ${T.bg}; }
  .ow-park { fill: ${T.successSoft}; }
  .ow-street path { fill: none; stroke: #FFFFFF; stroke-width: 8; stroke-linecap: round; }
  .ow-street path.thin { stroke-width: 4.5; }
  .ow-pin-halo { fill: ${T.accent}; opacity: 0.18; } /* QA: cheksiz «nafas» olib tashlandi — 1/10-ekranda navbat-pulsi bilan birga yonardi (88-qonun d) */
  .ow-pin { fill: ${T.accent}; stroke: #FFFFFF; stroke-width: 3; }
  .ow-cab { animation: ow-cab-in 0.5s ease-out both; }
  .ow-cab-body { fill: ${AMBER_LINE}; stroke: #FFFFFF; stroke-width: 1.5; } .ow-cab-glass { fill: ${T.ink}; opacity: 0.55; }
  @keyframes ow-cab-in { from { opacity: 0; transform: translate(110px, 44px); } to { opacity: 1; transform: translate(150px, 44px); } }
  .ow-tap { position: absolute; left: 50%; top: 50%; width: 44px; height: 44px; margin: -22px 0 0 -22px; border-radius: 50%; background: rgba(255,255,255,0.55); pointer-events: none; animation: ow-tap 0.5s ease-out forwards; }
  @keyframes ow-tap { from { transform: scale(0.2); opacity: 1; } to { transform: scale(3); opacity: 0; } }
  .ow-field.empty { box-shadow: inset 0 0 0 1.5px ${T.ink3}; }
  .ow-cnt { margin-left: 6px; display: inline-flex; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 99px; align-items: center; justify-content: center; background: ${T.accentSoft}; color: ${T.accent}; font-size: 10.5px; }
  .ow-cnt.bad { background: ${T.err}; color: #fff; }
  .ow-notch { position: absolute; top: 9px; left: 50%; transform: translateX(-50%); width: 56px; height: 6px; border-radius: 4px; background: ${T.line}; }
  .ow-field { display: flex; align-items: center; gap: 8px; min-height: 42px; border-radius: 12px; padding: 9px 12px; background: ${T.bg}; font-family: 'Manrope'; font-size: 14px; min-width: 0; }
  .ow-addr { color: ${T.ink}; font-weight: 700; overflow-wrap: anywhere; min-width: 0; }
  .ow-ph { color: ${T.ink3}; }
  .ow-btn { position: relative; overflow: hidden; display: flex; justify-content: center; border-radius: 12px; padding: 11px; background: ${T.accent}; color: #fff; font-family: 'Manrope'; font-weight: 800; font-size: 15px; transition: transform 0.12s; }
  .ow-btn.press { transform: scale(0.95); }
  .ow-toast { align-self: center; font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.success}; background: ${T.successSoft}; border-radius: 999px; padding: 5px 12px; opacity: 0; transition: opacity 0.25s; }
  .ow-toast.on { opacity: 1; }
  .ow-list { display: flex; flex-direction: column; gap: 6px; border-top: 1px solid ${T.line}; padding-top: 8px; min-height: 62px; }
  .ow-list-h { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: ${T.ink3}; }
  .ow-empty { color: ${T.ink3}; font-size: 13px; }
  .ow-row { font-family: 'Manrope'; font-size: 13.5px; font-weight: 600; color: ${T.ink}; background: ${T.bg}; border-radius: 9px; padding: 6px 10px; overflow-wrap: anywhere; min-width: 0; }
  .ow-row.bad { color: ${T.err}; background: ${T.errSoft}; }
  .ow-row.hl { box-shadow: inset 0 0 0 2px ${T.success}; background: ${T.successSoft}; }
  .ac-list { display: flex; flex-direction: column; gap: 8px; }
  .ac-row { display: grid; grid-template-columns: 28px minmax(0,1fr) minmax(0, max-content); gap: 10px; align-items: center; text-align: left; cursor: pointer; border: none; border-radius: 12px; padding: 11px 13px; background: ${T.paper}; color: ${T.ink}; font-family: 'Manrope'; box-shadow: 0 6px 16px -10px rgba(${T.shadowBase},0.3), inset 0 0 0 1px ${T.line}; }
  .ac-row:disabled { cursor: default; }
  .ac-row.run { box-shadow: inset 0 0 0 2px ${T.accent}; }
  .ac-row.ok { background: ${T.successSoft}; box-shadow: none; }
  .ac-row.bad { background: ${T.errSoft}; box-shadow: none; }
  .ac-n { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 13px; background: ${T.accentSoft}; color: ${T.accent}; }
  .ac-row.ok .ac-n { background: ${T.success}; color: #fff; } .ac-row.bad .ac-n { background: ${T.err}; color: #fff; }
  .ac-t { font-size: 14px; font-weight: 600; line-height: 1.4; overflow-wrap: anywhere; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
  .ac-res { font-style: normal; font-weight: 800; font-size: 12.5px; color: ${T.err}; }
  .ac-go { font-weight: 800; font-size: 12.5px; color: ${T.accent}; white-space: nowrap; }
  @media (prefers-reduced-motion: reduce) { .ow-btn, .ow-toast, .ow-phone { transition: none; } .ow-cab, .ow-tap { animation: none; } .ow-tap { opacity: 0; } }

  .st-pool { display: flex; flex-direction: column; gap: 8px; }
  /* F-0925-B11: tartib yig'ilgach bitta ustun — o'rtada; «✅ Tartib to'g'ri» ro'yxat sarlavhasida */
  .split.st-solo { grid-template-columns: minmax(0, 460px) !important; justify-content: center; }
  .st-lcol { min-width: 0; }
  .flow-label .st-ok { margin-left: 10px; text-transform: none; letter-spacing: 0; font-size: 12px; vertical-align: middle; }
  .st-chip { text-align: left; font-family: 'Manrope'; font-weight: 700; font-size: 14.5px; cursor: pointer; border: none; border-radius: 12px; padding: 11px 14px; background: ${T.paper}; color: ${T.ink}; box-shadow: 0 6px 16px -10px rgba(${T.shadowBase},0.3), inset 0 0 0 1px ${T.line}; overflow-wrap: anywhere; min-width: 0; }
  .st-line { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .st-step { display: grid; grid-template-columns: 28px minmax(0,1fr); gap: 10px; align-items: center; min-height: 40px; }
  .st-n { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 13px; background: ${T.bg}; color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .st-step.on .st-n { background: ${T.success}; color: #fff; box-shadow: none; animation: gb-pop 0.3s cubic-bezier(.34,1.6,.4,1); }
  .st-t { font-family: 'Manrope'; font-weight: 700; font-size: 14.5px; color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; }
  /* Kulrang chiziq o'rniga o'rin-yorlig'i (pilot naqshi 9-band): javob ochilmaydi, faqat «3-qadam» kabi joy nomi */
  .st-ph { display: inline-block; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; color: ${T.ink3}; border: 1.5px dashed ${T.line}; border-radius: 8px; padding: 3px 10px; }
  @media (prefers-reduced-motion: reduce) { .st-step.on .st-n { animation: none; } }

  .ic-row2 { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .ic-q { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; color: ${T.ink3}; }
  .ic-lbl.first { color: ${T.success}; }

  /* 14-ekran ixcham (58-qonun, 1280x800): holat-chiplari va ikki savol bir qatorda; sabab va Saqlash yonma-yon. */
  .bp-end { display: flex; align-items: flex-end; gap: 10px 14px; flex-wrap: wrap; }
  .bp-end > .bp-sabab { flex: 1 1 360px; }
  .bp-save { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .bp-tg.turn-ring::after { inset: -3px; border-radius: 12px; }
  @media (min-width: 1041px) { .bp-screen .bp-row { padding: 7px 0 8px; } .bp-screen .bp-grid { row-gap: 7px; } }
  .ip-chip.turn-ring::after { inset: -4px; }
  .bp-grid { display: grid; grid-template-columns: 42px minmax(140px,1fr) auto auto minmax(120px, max-content); column-gap: 12px; row-gap: 8px; }
  .bp-head { grid-column: 1 / -1; display: grid; grid-template-columns: subgrid; align-items: end; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.02em; color: ${T.ink2}; padding: 0 0 2px; }
  .bp-tg-q { display: none; flex-shrink: 0; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; color: ${T.ink2}; padding: 0 4px 0 6px; white-space: nowrap; }
  @media (max-width: 1040px) { .bp-head { display: none; } .bp-tg-q { display: inline; } }
  .bp-row { grid-column: 1 / -1; display: grid; grid-template-columns: subgrid; grid-template-areas: "n name odam vaqt foot"; align-items: center; column-gap: 12px; row-gap: 8px; min-width: 0; border-radius: 14px; padding: 9px 0 10px; background: ${T.paper}; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.35), inset 0 0 0 1px ${T.line}; }
  .bp-row.avval { } .bp-row.reja { } .bp-row.vaqt { } .bp-row.keyin { }
  .bp-row.first { box-shadow: inset 0 0 0 2px ${T.success}, 0 10px 24px -14px rgba(18,169,104,0.45); }
  .bp-row > .bp-n { grid-area: n; } .bp-row > .pw-f { grid-area: name; } .bp-row > .bp-tg.odam { grid-area: odam; } .bp-row > .bp-tg.vaqt { grid-area: vaqt; } .bp-row > .bp-foot { grid-area: foot; }
  @media (max-width: 1040px) { .bp-grid { grid-template-columns: 1fr; } .bp-row { padding: 9px 12px 10px 0; grid-template-columns: 42px minmax(0,1fr); column-gap: 8px; grid-template-areas: "n name" "odam odam" "vaqt vaqt" "foot foot"; } .bp-foot:empty { display: none; } }
  .bp-row > .bp-n { justify-self: center; } .bp-row > .bp-foot { padding-right: 12px; }
  @media (max-width: 1040px) { .bp-row > .bp-tg, .bp-row > .bp-foot { margin-left: 12px; } }
  .bp-n { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 12px; background: ${T.accentSoft}; color: ${T.accent}; }
  .bp-n.on { background: ${T.success}; color: #fff; }
  .bp-name input { padding: 9px 12px; }
  .bp-tg { flex: 1 1 auto; display: flex; align-items: center; gap: 4px; border-radius: 10px; padding: 3px; background: ${T.bg}; }
  .bp-opt { flex: 1 1 auto; font-family: 'Manrope'; font-weight: 700; font-size: 12px; cursor: pointer; border: none; border-radius: 8px; padding: 6px 8px; background: transparent; color: ${T.ink2}; white-space: nowrap; transition: background 0.15s; }
  .bp-opt:hover:not(:disabled):not(.on) { background: ${T.paper}; }
  .bp-opt.on { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .bp-opt:disabled { opacity: 0.5; cursor: not-allowed; }
  .bp-foot { display: flex; flex-direction: column; align-items: flex-start; gap: 5px; }
  @media (max-width: 1040px) { .bp-foot { flex-direction: row; flex-wrap: wrap; align-items: center; } }
  @media (prefers-reduced-motion: reduce) { .bp-opt { transition: none; } }
  .bp-cell { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; border-radius: 999px; padding: 4px 10px; background: ${T.bg}; color: ${T.ink2}; }
  .bp-cell.avval { background: ${T.successSoft}; color: ${T.success}; } .bp-cell.reja { background: ${T.blueSoft}; color: ${T.blue}; } .bp-cell.vaqt { background: ${AMBER_SOFT}; color: ${AMBER}; }
  .bp-first { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; cursor: pointer; border: none; border-radius: 999px; padding: 5px 12px; background: ${T.paper}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}88; }
  .bp-first.on { background: ${T.success}; color: #fff; box-shadow: none; }

  .cd-list { display: flex; flex-direction: column; gap: 10px; }
  .cd-card { display: flex; flex-direction: column; gap: 9px; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: 12px 15px; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.3); }
  .cd-card.ok { box-shadow: inset 0 0 0 1.5px ${T.success}66, 0 10px 24px -14px rgba(${T.shadowBase},0.3); }
  .cd-card.ok .sl-n-dot { background: ${T.success}; box-shadow: none; }
  .cd-pair { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
  @media (max-width: 760px) { .cd-pair { grid-template-columns: 1fr; } }
  .cd-mine { display: flex; flex-direction: column; gap: 6px; }
  .cd-split { grid-template-columns: minmax(0,1.35fr) minmax(0,1fr); }
  .cd-doc { position: sticky; top: 0; display: flex; flex-direction: column; gap: 9px; min-width: 0; background: ${T.paper}; border-radius: 16px; padding: 14px 16px; box-shadow: inset 0 0 0 1px ${T.line}, 0 12px 28px -16px rgba(${T.shadowBase},0.38); transition: box-shadow 0.25s; }
  .cd-doc.full { box-shadow: inset 0 0 0 1.5px ${T.success}66, 0 0 0 5px ${T.success}14, 0 12px 28px -16px rgba(18,169,104,0.4); }
  .cd-doc-top { display: flex; flex-direction: column; gap: 3px; padding-bottom: 9px; border-bottom: 1px dashed ${T.line}; }
  .cd-doc-h { display: flex; align-items: center; justify-content: space-between; font-family: 'Manrope'; font-weight: 800; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
  .cd-doc-h b { font-size: 12px; color: ${T.success}; }
  .cd-doc-row { display: flex; align-items: flex-start; gap: 9px; min-width: 0; }
  .cd-box { flex-shrink: 0; width: 20px; height: 20px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 800; color: ${T.ink3}; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .cd-doc-row.ok .cd-box { background: ${T.success}; color: #fff; box-shadow: none; animation: gb-pop 0.3s cubic-bezier(.34,1.6,.4,1); }
  .cd-doc-t { flex: 1; display: block; min-width: 0; font-family: 'Source Serif 4', serif; font-size: 14.5px; line-height: 1.45; color: ${T.ink}; overflow-wrap: anywhere; }
  .cd-arr { color: ${T.success}; font-family: 'Manrope'; font-weight: 800; }
  .cd-ph { color: ${T.ink3}; font-style: italic; }
  .cd-ph .cd-arr { color: ${T.ink3}; }
  .cd-save { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  @media (max-width: 760px) { .cd-split > .col:has(.cd-doc) { order: -1; } .cd-doc { position: static; padding: 11px 14px; } .cd-doc-row { display: none; } }
  @media (prefers-reduced-motion: reduce) { .cd-doc { transition: none; } .cd-doc-row.ok .cd-box { animation: none; } }
  .sl-n { display: inline-flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 800; font-size: 13px; }
  .sl-n-dot { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; background: ${T.successSoft}; box-shadow: inset 0 0 0 2px ${T.success}66; }
  .sl-problem-t { font-family: 'Source Serif 4', serif; font-size: clamp(15px,2vw,18px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; }
  .pa-script { background: ${T.paper}; border-radius: 14px; padding: 14px 16px; box-shadow: 0 8px 20px -14px rgba(${T.shadowBase},0.3); overflow-wrap: anywhere; }

  /* ===== DIZAYN 3-aylanish (pilot naqshi 1–14, 2026-09-24) ===== */
  /* HOOK (1), D2 25.09: ovozgacha faqat ikki karta (tk-pair, yonma-yon). Ovozdan keyin kartalar ostida hk-res qatori —
     chapda dasturchining savol-jadvali (1-karta ostida), o'ngda xulosa (2-karta ostida); ustunlar kartalar bilan bir chiziqda.
     Cheksiz animatsiya YO'Q: ilgari tanlovgacha jadval ustida cheksiz skaner nuri yurardi — navbat-pulsi bilan raqobatlashardi. */
  .split.hk-res { gap: 14px; }
  .hd { background: ${T.paper}; border-radius: 16px; box-shadow: 0 14px 34px -16px rgba(${T.shadowBase},0.3), 0 0 0 1px ${T.line}; }
  .hd-tab { display: grid; grid-template-columns: minmax(0,1fr) 62px 62px; gap: 6px 8px; align-items: center; padding: 12px; }
  .hd-hq { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink2}; }
  .hd-hn { justify-self: center; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; background: ${T.bg}; border-radius: 99px; padding: 3px 9px; }
  .hd-hn.me { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .hd-q { display: flex; align-items: center; gap: 8px; min-width: 0; font-family: 'Manrope'; font-weight: 800; font-size: 13px; color: ${T.ink}; background: ${T.bg}; border-radius: 10px; padding: 7px 10px; overflow-wrap: anywhere; }
  .hd-q i { font-style: normal; font-size: 15px; line-height: 1; flex-shrink: 0; }
  .hd-q.kim { } .hd-q.nima { } .hd-q.why { }
  .hd-c { height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 16px; }
  .hd-c.yes { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}55; animation: hd-pop 0.4s cubic-bezier(.34,1.6,.4,1) var(--d) both; }
  /* «?» — xato EMAS, ma'lumot yetmadi: indigo-yumshoq (qizil emas), ikki marta «yelka qisadi» va to'xtaydi */
  .hd-c.no { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}33; animation: hd-pop 0.4s cubic-bezier(.34,1.6,.4,1) var(--d) both, hd-shrug 0.45s ease-in-out calc(var(--d) + 0.45s) 2; }
  .hd-c.me { box-shadow: inset 0 0 0 2px ${T.accent}; }
  .hd-sum { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; color: ${T.ink2}; padding-left: 4px; }
  .hd-n { justify-self: center; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; border-radius: 99px; padding: 2px 9px; }
  .hd-n.part { color: ${T.accent}; background: ${T.accentSoft}; animation: hd-pop 0.4s cubic-bezier(.34,1.6,.4,1) var(--d) both; }
  .hd-n.full { color: #fff; background: ${T.success}; animation: hd-pop 0.4s cubic-bezier(.34,1.6,.4,1) var(--d) both; }
  @keyframes hd-pop { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: none; } }
  @keyframes hd-shrug { 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
  @media (max-width: 420px) { .hd-tab { grid-template-columns: minmax(0,1fr) 48px 48px; gap: 5px 6px; padding: 10px; } .hd-q { font-size: 12px; padding: 6px 8px; } .hd-hn { padding: 3px 6px; } }
  @media (prefers-reduced-motion: reduce) { .hd-c.yes, .hd-c.no, .hd-n.part, .hd-n.full { animation: none; } }

  /* MAQSAD (2): namuna-karta matni (kulrang chiziq o'rniga) */
  .pd-demo { padding-top: 36px; }
  .pd-tag { position: absolute; top: 10px; left: 16px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 2px 9px; }
  .pd-tx { display: block; min-width: 0; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.35; color: ${T.ink}; overflow-wrap: anywhere; }
  .pd-seg .pd-tx { font-family: 'Source Serif 4', serif; font-weight: 400; font-size: 13.5px; }
  .pd-tile .pd-tx { font-weight: 700; }
  .pd-tile:not(.first) .pd-tx { color: ${T.ink3}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
  .pd-cond .pd-tx { flex: 1; }
  .pd-cond + .pd-cond .pd-tx { color: ${T.ink3}; font-family: 'JetBrains Mono', monospace; font-size: 11.5px; }
  .pd-arr { color: ${T.success}; font-weight: 800; }

  /* INSTAGRAM (6): 1/3-slayd — ilova ekranidagi bo'laklar soni (o'z bezagi) */
  .k-photo.cph { width: min(290px, 100%); height: clamp(176px,21vw,214px); }
  .cph0 { background: radial-gradient(circle, ${T.ink3}22 1.2px, transparent 1.6px) 0 0 / 12px 12px, ${T.bg}; }
  .cph2 { background: radial-gradient(ellipse at 50% 60%, ${T.successSoft}, ${T.paper} 72%); }
  .cph-scr { display: flex; flex-direction: column; gap: 6px; width: 164px; height: calc(100% - 18px); background: ${T.paper}; border-radius: 16px; padding: 10px 8px 8px; box-shadow: inset 0 0 0 2px ${T.line}, 0 10px 22px -12px rgba(${T.shadowBase},0.4); }
  .cph-top { display: flex; align-items: center; justify-content: space-between; gap: 4px; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: 13px; color: ${T.ink}; }
  .cph-top em { font-style: normal; font-family: 'Manrope'; font-weight: 800; font-size: 9px; color: ${T.success}; background: ${T.successSoft}; border-radius: 99px; padding: 1px 6px; white-space: nowrap; }
  .cph-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 4px; }
  .cph-it { display: flex; flex-direction: column; align-items: center; gap: 1px; min-width: 0; font-family: 'Manrope'; font-weight: 700; font-size: 9.5px; line-height: 1.15; color: ${T.ink2}; background: ${T.bg}; border-radius: 7px; padding: 5px 3px; text-align: center; overflow-wrap: anywhere; opacity: 0; animation: cph-in 0.35s ease-out forwards; animation-delay: calc(0.12s + var(--j) * 0.09s); }
  .cph-it i { font-style: normal; font-size: 13px; line-height: 1.1; }
  .cph0 .cph-it:last-child { grid-column: 1 / -1; }
  .cph2 .cph-grid { grid-template-columns: 1fr; gap: 5px; }
  .cph2 .cph-it { flex-direction: row; justify-content: flex-start; gap: 7px; font-size: 12px; padding: 9px 10px; color: ${T.ink}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1px ${T.success}44; }
  .cph2 .cph-it i { font-size: 14px; }
  .cph-ppl { display: flex; gap: 3px; justify-content: center; margin-top: auto; }
  .cph-ppl i { width: 9px; height: 9px; border-radius: 50%; background: ${T.line}; }
  .cph-ppl i.on { background: ${T.accent}; }
  .cph-ic { position: absolute; right: 10px; bottom: 8px; font-size: 24px; line-height: 1; }
  /* ✨ bir martalik (tekshiruvchi 25.09, D4 — hook bilan bir qoida): bo'laklar chiqib bo'lgach ikki marta «yonadi» va to'xtaydi.
     Ilgari cheksiz edi — «Davom etish» navbat-pulsi bilan bir vaqtda ko'zni tortib turardi. */
  .cph2 .cph-ic { animation: cph-glow 0.9s ease-in-out 0.7s 2; }
  @keyframes cph-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
  @keyframes cph-glow { 50% { transform: scale(1.18); } }
  @media (prefers-reduced-motion: reduce) { .cph-it { animation: none; opacity: 1; } .cph2 .cph-ic { animation: none; } }

  /* TO'RT KATAK (8): katak mezoni (ko'p · tez) + ixcham ro'yxat */
  .gr-cell-h { display: block; }
  @media (min-width: 761px) {
    .lesson-root .screen.dense .gr-list { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 6px; }
    .lesson-root .screen.dense .gr-item { padding: 6px 11px; gap: 3px; }
    .lesson-root .screen.dense .gr-item-d { gap: 4px; font-size: 12px; }
    .lesson-root .screen.dense .gr-ans { border-radius: 9px; padding: 2px 8px 2px 6px; line-height: 1.3; }
    .lesson-root .screen.dense .gr-left { gap: 10px; }
    .lesson-root .screen.dense .gr-cell { min-height: 96px; }
  }
  .zoom-on.zboard .gr-cell { min-height: 150px; }

  /* BUYURTMA OYNASI (10): ilova sarlavhasi + ixcham telefon; ⛶ tugmasi telefon yonida */
  /* Ilova sarlavhasi xarita ustida (alohida qator emas — telefon bo'yi o'smaydi) */
  .ow-mapw { position: relative; }
  .ow-app { position: absolute; left: 8px; top: 7px; display: inline-flex; align-items: baseline; gap: 6px; max-width: calc(100% - 16px); background: rgba(255,255,255,0.9); border-radius: 99px; padding: 3px 9px; box-shadow: 0 3px 8px -4px rgba(${T.shadowBase},0.3); }
  .ow-app b { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; color: ${T.ink}; white-space: nowrap; }
  .ow-app i { font-style: normal; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; color: ${T.ink3}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
  .zoomable.zphone:not(.zoom-on) { align-self: center; width: min(320px, 100%); }
  .zoomable.zphone:not(.zoom-on) > .zoom-btn { top: 0; right: -40px; }
  @media (max-width: 760px) { .zoomable.zphone:not(.zoom-on) > .zoom-btn { right: 6px; top: 26px; } }
  @media (min-width: 761px) {
    .lesson-root .screen.dense .ow-phone { gap: 6px; padding: 18px 12px 9px; }
    .lesson-root .screen.dense .ow-phone .ow-map { aspect-ratio: 300 / 68; }
    .lesson-root .screen.dense .ow-field { min-height: 38px; padding: 7px 12px; }
    .lesson-root .screen.dense .ow-btn { padding: 9px; }
    .lesson-root .screen.dense .ow-list { min-height: 54px; gap: 5px; padding-top: 6px; }
    .lesson-root .screen.dense .ow-row { padding: 5px 10px; }
    .lesson-root .screen.dense .ac-list { gap: 7px; }
    .lesson-root .screen.dense .ac-row { padding: 9px 12px; }
  }

  /* USTAXONALAR (13/15/16): ixcham qatorlar */
  @media (min-width: 761px) {
    .lesson-root .screen.dense .pw-form { gap: 8px; }
    /* 13-ekran (58-qonun, QA 2026-09-24): savol-yorliq maydon yonida — ikki maslahat chiqqanda ham aylantirish yo'q */
    .lesson-root .screen.dense .pw-form > .pw-f { display: grid; grid-template-columns: 150px minmax(0,1fr); align-items: center; gap: 10px; }
    .lesson-root .screen.dense .pw-form ~ .gb-sent { padding: 10px 14px; }
    .lesson-root .screen.dense .pw-form ~ .gb-sent .gb-sent-t { font-size: 17px; line-height: 1.45; }
    .lesson-root .screen.dense .pw-f input { padding-top: 9px; padding-bottom: 9px; }
    .lesson-root .screen.dense .cd-list { gap: 8px; }
    .lesson-root .screen.dense .cd-card { padding: 10px 14px; gap: 7px; }
    /* 15-ekran (58-qonun, tekshiruvchi 25.09 D1): «N-shart» yorlig'i maydonlar yonida (13-ekrandagi yorliq-yonida naqshi) —
       har kartadan bitta qator tejaladi. Mentor proyektorida uchala karta ochiq va ikkita 💡 maslahat chiqqanda ilgari
       26–44px aylantirish bor edi, endi 0. Raqamlar teng kenglikda — uch kartadagi maydonlar bir chiziqda turadi. */
    .lesson-root .screen.dense .cd-list .cd-card { display: grid; grid-template-columns: max-content minmax(0,1fr); column-gap: 12px; row-gap: 7px; align-items: end; }
    .lesson-root .screen.dense .cd-list .cd-card > .sl-n { grid-column: 1; grid-row: 1; height: 39px; font-variant-numeric: tabular-nums; }
    .lesson-root .screen.dense .cd-list .cd-card > .cd-pair { grid-column: 2; grid-row: 1; }
    .lesson-root .screen.dense .cd-list .cd-card > .sl-hint { grid-column: 1 / -1; }
    /* 16-ekran (58-qonun, D1): o'ng ustun (shartlar · 4-shart · qoida-qatori) kengroq — RU'da 💡 maslahat ikki qatorga
       tushadi va qoida-qatori pastki chiziq ostida qolmaydi (ilgari 14px). Chapdagi AI qadamlari torroq ustunda ham to'liq. */
    .lesson-root .ai-screen > .split { grid-template-columns: minmax(0,0.9fr) minmax(0,1.1fr); }
    .lesson-root .screen.dense .pr-body { max-height: 92px; }
    .lesson-root .screen.dense .ais-steps { gap: 5px; }
    .lesson-root .screen.dense .ais-row { padding-top: 4px; padding-bottom: 4px; }
    .lesson-root .screen.dense .ais-link, .lesson-root .screen.dense .pr-copy { padding-top: 7px; padding-bottom: 7px; }
    .lesson-root .ai-screen .cd-mine { gap: 5px; }
    .lesson-root .ai-screen .pa-q { padding: 5px 11px; align-items: center; }
    .lesson-root .ai-screen .pa-q-t { font-size: 14px; line-height: 1.35; }
    .lesson-root .ai-screen .ai-rule { padding: 7px 12px; line-height: 1.4; }
    /* 15-ekran: «Saqlandi» belgisi «Saqlash» yonida (ostida emas) — jonli o'quvchida sinf-pulsi qo'shilganda ham aylantirish yo'q */
    .lesson-root .screen.dense .cd-save { flex-wrap: nowrap; }
    .lesson-root .screen.dense .cd-save > .pw-save { flex-shrink: 0; }
    .lesson-root .screen.dense .cd-save > .done-mini { min-width: 0; line-height: 1.3; border-radius: 12px; padding: 6px 12px; }
  }
  .cd-card.c4 { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px 10px; }
  .cd-card.c4 > .sl-n, .cd-card.c4 > .sl-hint { grid-column: 1 / -1; }
  @media (max-width: 760px) { .cd-card.c4 { grid-template-columns: 1fr; } }


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
