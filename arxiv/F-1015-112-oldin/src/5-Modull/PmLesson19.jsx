import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import HtmlCompiler, { checks as C } from '../compilator/HtmlCompiler.jsx';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PM · M5-D2 — BOTINGIZNI BIRINCHI KIM OCHADI?
// Senariy-manba: pm-senariylar/M5-D2-BirinchiYigirma.md (GATE S yopilgan, 2026-08-18).
// Misol-ip: o'quvchining O'Z Telegram-boti — shu modulda QURILADI (91/95/96c/108-qonun).
//   §40/§81: bot hali yo'q — hozirgi zamondagi bot-buyruqlari va bot-havolasi 0.
// Imzo-vizual: «BIRINCHI 20» — uch halqali odamlar xaritasi + bir haftani berish.
// Tekshiruv-mexanikasi: «JOY-QUVURI» — to'rt joy, uch qadam (eshitdi -> ochdi -> ishlatdi),
//   o'quvchi yigirmagacha yig'adi (26/59-qonun: oldingi PM darslarning birortasini takrorlamaydi).
// Bosh keys: K8 META (Facebook) — burchak «QAYERDAN va nega bitta joydan» (M1-D2 dan farqli).
// Kirish-artefakt: YO'Q (modul boshi) — «topilmadi/saqlanmagan» tarmog'i YOZILMAYDI (§69).
// Chiqish-artefakt: pm-m5d2-yigirmata = { kanallar: [{ kanal, kim, nechta } x 3], savedAt }.
//   Kod-kaliti `kanal` (ASCII), o'quvchi ko'radigan har joyda — «guruh» (v2, F-0930-57).
// INFRA MANBAI: src/4c-Modull/PmLesson18.jsx (jonli relslar, Stage, QuestionScreen,
//   MentorTestStats, RecapOverlay, PairTimer, ScreenPodium, CodeStrike-arena, ccProgress)
//   + src/4a-Modull/PmLesson15.jsx (kompilyator fixed-qobiq + zoom: calc(1 / var(--lz))).
// KODING: KOMPILYATOR (26-qonun R1 navbati: m4c-06 VS Code -> m5-02 kompilyator);
//   sof JS, brauzer-ko'rinishi YO'Q, shartlar XULQ-ATVORDA, boshlang'ich kod yashil emas (18-ov).
// BIR TILLI (UZ): tarjima-yordamchisi yo'q; RU alohida sweep'da qo'shiladi.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================
// PM-STUDIA IDENTITET (P0 dan AYNAN)
// ============================================================
const T = {
  bg: '#F2F0FA', ink: '#1B1630', ink2: '#565073', ink3: '#9C97B4',
  paper: '#FFFFFF', accent: '#5B3DE6', accentSoft: '#EBE5FD', accentVivid: '#6E4BFF',
  success: '#12A968', successSoft: '#E3F0E8', blue: '#0E86C4', blueSoft: '#E1F3FB', link: '#5B3DE6',
  line: '#E7E3F4', err: '#E5484D', errSoft: '#FCE7E8',
  shadowBase: '40, 34, 82'
};

// Jonli dars (live) — umumiy modul: src/live/ (hook + darvoza + belgi + mijoz + server-progress). Inline nusxa 2026-09-03 da ko'chirildi.
import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, setLiveLang, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers , buildResultDetails, sealPayload, useAutoNext } from '../live/index.js';

// UZ-RU: modul-darajali tarjimon. Dars mount bo'lganda default export __lang'ni o'rnatadi;
// barcha render-joylar tr({uz:'…', ru:'…'}) orqali joriy tildagi matnni oladi (string/JSX o'tkazib yuboriladi).
let __lang = 'uz';
const tr = (node) => {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string') return node;
  if (React.isValidElement(node)) return node;
  return node[__lang] ?? node.uz ?? node.ru ?? '';
};






const LangContext = createContext('uz');
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
const LESSON_META = { lessonId: 'pm-m5d2-v1', lessonTitle: { uz: 'Botingizni birinchi kim ochadi?', ru: 'Кто первым откроет вашего бота?' } };
// YAKUN-TUZILMASI ETALONDAN (P0 PmUserStory · PmLesson2 · PmLesson18):
// koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa BIR sahifada).
// Uy-vazifa va arena alohida ekran BO'LMAYDI — ikkovi ham yakun ichida.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom', scored: false, scope: 'hook' },        // 0  · BLOK 1
  { id: 's1',  type: 'rule',        template: 'custom', scored: false, scope: null },          // 1  · BLOK 2
  { id: 's2',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 2  · BLOK 3 teoriya-1
  { id: 's3',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 3  · TEST-1
  { id: 's4',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 4  · YADRO: odamlar xaritasi
  { id: 's5',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 5  · TEST-2
  { id: 's6',  type: 'case',        template: 'custom', scored: false, scope: null },          // 6  · keys (K8 · Facebook)
  { id: 's7',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 7  · TEST-3
  { id: 's8',  type: 'practice',    template: 'custom', scored: false, scope: null },          // 8  · BLOK 4 yozish-ekrani
  { id: 's9',  type: 'practice',    template: 'custom', scored: false, scope: null },          // 9  · BLOK 5 tekshiruv (joy-quvuri)
  { id: 's10', type: 'koding',      template: 'custom', scored: false, scope: null },          // 10 · BLOK 6 kompilyator
  { id: 's11', type: 'test',        template: 'custom', scored: true,  scope: 'final' },       // 11 · TEST-4
  { id: 's12', type: 'reflection',  template: 'custom', scored: false, scope: null },          // 12 · BLOK 7
  { id: 's13', type: 'stats',       template: 'custom', scored: false, scope: null },          // 13 · podium
  { id: 's14', type: 'flashcard',   template: 'custom', scored: false, scope: null },          // 14 · takrorlash
  { id: 's15', type: 'summary',     template: 'custom', scored: false, scope: null }           // 15 · BLOK 8 + 9
];
const TOTAL_SCREENS = SCREEN_META.length;
const SCORED_IDX = SCREEN_META.map((m, i) => (m.scored ? i : null)).filter(i => i !== null);

// SCREEN_INTENTS — har ekran nima uchun mavjud: 1 gaplik niyat (bola nima QILADI yoki nima BILADI).
export const SCREEN_INTENTS = {
  s0: "Bola hozir nechta botni ishlatishini tanlaydi va botni ko'pincha kimdir aytgani uchun ochishini ko'radi",
  s1: "Bola dars oxirida uchta guruh yozib olishini oldindan ko'radi",
  s2: "Bola tayyor bot bilan odam ishlatgan botni solishtirib, birinchi foydalanuvchilar kimlar ekanini biladi",
  s3: "Bola hech kimga aytilmagan bot bir haftada nechta odam olishini tanlaydi",
  s4: "Bola uch halqani ochadi va bir haftani navbat bilan berib, qaysi halqa ko'p odam berishini o'zi ko'radi",
  s5: "Bola tanish va notanish odamlardan qaysi biri ko'proq javob berishini aniqlaydi",
  s6: "Bola Facebook sayti bitta universitetdan boshlanganini bashorat bilan ochadi",
  s7: "Bola sayt bitta universitetda nega tez tarqalganini tanlaydi",
  s8: "Bola o'zining uchta guruhini bittalab yozadi: guruh nomi, unda kimlar borligi va odam soni",
  s9: "Bola to'rt guruhni uch qadamdan o'tkazib, yigirmata odamni iloji boricha kam guruhdan yig'adi",
  s10: "Bola kod oynasida uchta guruhni sanaydigan va yigirmaga yetganini aytadigan kod yozadi",
  s11: "Bola katta notanish guruhga yuborilgan havola ertasiga nima berishini tanlaydi",
  s12: "Bola tanish guruhlaridan birini yoddan aytadi va bir qatorda yozib qoldiradi",
  s13: "Bola o'z natijasini (jonlida — sinf reytingini) ko'radi",
  s14: "Bola o'nta takrorlash kartasi bilan o'zini o'zi tekshiradi",
  s15: "Bola arenada bilimini tezlikda sinaydi, uy-vazifasini va nishonlarini bitta yakun-sahifada ko'radi"
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
          <div className="ach-pop-h">{tr({ uz: 'Nishonlar', ru: 'Значки' })} — {count}/{total}</div>
          {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(earned && earned.has(id)); return (
            <div key={id} className={`ach-pop-row ${got ? 'got' : ''}`}><span className="ach-pop-ic">{got ? a.icon : '🔒'}</span><span className="ach-pop-tx"><span className="ach-pop-nm">{a.name}</span><span className="ach-pop-ds">{achDesc(a.desc)}</span></span></div>
          ); })}
        </div>
      )}
    </div>
  );
}

// F-1003-03: yozish maydoni matn bilan o'sadi (1 → 4 qator), uzun javob yon tomonga ketmaydi.
// Enter yangi qator ochmaydi — maydonning o'z onKeyDown'i (masalan, saqlash) ishlayveradi.
const GrowInput = ({ onKeyDown, type, ...rest }) => {
  const ref = useRef(null);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.45 || 22;
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const max = Math.round(lh * 4 + pad);
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, max) + 'px';
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  });
  return <textarea ref={ref} rows={1} {...rest} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) e.preventDefault(); if (onKeyDown) onKeyDown(e); }} />;
};

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
              <div className="mono small" style={{ color: T.ink3, whiteSpace: 'nowrap' }}>{String(screen + 1).padStart(2, '0')} / {String(totalScreens).padStart(2, '0')}</div>
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

// NAVBAT-BELGISI (88-qonun · 1-C.8 kod-shartnomasi — PmLesson2 manbasidan AYNAN).
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
  return <button className={`btn-white-accent${hint ? ' turn-hint' : ''}`} disabled={isOff} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : (freeRide && disabled ? tr({ uz: "Jonli dars: bajarmasdan ham o'tishingiz mumkin", ru: 'Живой урок: можно идти дальше, даже не выполнив' }) : undefined)} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: 'Mentorni kuting', ru: "Дождитесь ментора" }) : tr(label)}</button>;
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
// -1 = ishtirok-sentinel (server: to'ldirgani = to'g'ri). Praktika yozuv-zonasi: PRACTICE_BASE+screen.
const INLINE_KEYS = { s3: 1, s5: 0, s7: 2, s11: 1, halqa: -1, joy: -1, quvur: -1, koding: -1 };
// Har scored ekran uchun qayta-tushuntirish. Kalitlar = scored ekran INDEKSI (3/5/7/11).
const RECAPS = {
  3: {
    title: { uz: 'Birinchi foydalanuvchilarni siz olib kelasiz', ru: "Первых пользователей приводите вы" },
    cards: [
      { ic: '1', h: { uz: 'Birinchi foydalanuvchilar', ru: "Первые пользователи" }, body: { uz: <>Botingizni birinchi bo'lib ishlatadigan odamlar.</>, ru: <>Люди, которые первыми начнут пользоваться вашим ботом.</> } },
      { ic: '2', h: { uz: 'Bot o\'zi olib kelmaydi', ru: 'Бот сам никого не приведёт' }, body: { uz: <>Bot bo'sh turganda uni hech kim ko'rmaydi. Birinchi odamlarning <b>har biriga siz aytasiz</b>.</>, ru: <>Пока бот стоит пустой, его никто не видит. Первым людям <b>каждому говорите вы</b>.</> } },
      { ic: '3', h: { uz: 'Tayyor bo\'lgani yetmaydi', ru: 'Готового бота мало' }, body: { uz: <>Buyruqlar ishlashi — ishning yarmi. Ikkinchi yarmi: botni odam ochib ishlatishi.</>, ru: <>Команды работают — это половина дела. Вторая половина: человек открывает бота и пользуется им.</> }, ask: { uz: 'Oxirgi botni siz kimning gapidan keyin ochgansiz?', ru: 'После чьих слов вы открыли свой последний бот?' } }
    ]
  },
  5: {
    title: { uz: 'Tanish guruhdan ko\'p foydalanuvchi keladi', ru: "Из группы знакомых приходит много пользователей" },
    cards: [
      { ic: '1', h: { uz: 'Tanish guruh', ru: "Группа знакомых" }, body: { uz: <>Sizni taniydigan, bir-birini tez-tez ko'radigan odamlar.</>, ru: <>Люди, которые вас знают и часто видят друг друга.</> } },
      { ic: '2', h: { uz: 'Xabar o\'zi yuradi', ru: 'Весть идёт сама' }, body: { uz: <>Tanish guruhda bitta odam aytsa, <b>qolganlar ham eshitadi</b> va ko'pincha o'zlari ham ochadi.</>, ru: <>Если в группе знакомых скажет один, <b>услышат и остальные</b> — и часто сами тоже откроют.</> } },
      { ic: '3', h: { uz: 'Katta guruh', ru: 'Большая группа' }, body: { uz: <>Katta guruhda odam ko'p, lekin ular sizni tanimaydi: xabar odatda bitta odamda qolib ketadi.</>, ru: <>В большой группе людей много, но они вас не знают: сообщение обычно застревает у одного человека.</> }, ask: { uz: 'Sizni ismingiz bilan taniydigan odamlar qaysi guruhingizda ko\'p?', ru: "В какой вашей группе больше всего людей, которые знают вас по имени?" } }
    ]
  },
  7: {
    title: { uz: 'Facebook bitta universitetdan boshlagan', ru: "Facebook начался с одного университета" },
    cards: [
      { ic: '1', h: { uz: '2004-yil', ru: '2004 год' }, body: { uz: <>Sayt <b>bitta universitetda</b> ochildi: boshqalar ro'yxatdan o'ta olmasdi.</>, ru: <>Сайт открылся <b>в одном университете</b>: остальные не могли зарегистрироваться.</> } },
      { ic: '2', h: { uz: 'Dunyoga chiqish', ru: 'Выход в мир' }, body: { uz: <>Butun dunyo uchun sayt <b>2006-yilda, ikki yarim yil o'tib</b> ochildi; ungacha boshqa universitetlar va maktablarga birin-ketin ochildi.</>, ru: <>Для всего мира сайт открылся <b>в 2006 году, через два с половиной года</b>; до этого он по очереди открывался для других университетов и школ.</> } },
      { ic: '3', h: { uz: 'Nima ish bergan', ru: 'Что сработало' }, body: { uz: <>Odam soni emas, odamlarning bir-birini tanishi ish bergan.</>, ru: <>Сработало не число людей, а то, что люди знали друг друга.</> }, ask: { uz: 'Sizda universitet yo\'q. Uning o\'rniga qaysi guruhingiz bor?', ru: "Университета у вас нет. Какая ваша группа есть вместо него?" } }
    ]
  },
  11: {
    title: { uz: 'Katta guruhdan foydalanuvchi kam chiqadi', ru: "Из большой группы пользователей выходит мало" },
    cards: [
      { ic: '1', h: { uz: 'Xabar yetadi', ru: 'Сообщение доходит' }, body: { uz: <>Katta guruhda xabar ko'p odamga yetadi, lekin <b>ochib ishlatadigani kam qoladi</b>.</>, ru: <>В большой группе сообщение доходит до многих, но <b>тех, кто откроет и станет пользоваться, остаётся мало</b>.</> } },
      { ic: '2', h: { uz: 'Yigirma qayerdan', ru: 'Откуда двадцать' }, body: { uz: <>Yigirmata foydalanuvchi ikki-uchta tanish guruhdan keladi, bitta katta guruhdan emas.</>, ru: <>Двадцать пользователей приходят из двух-трёх групп знакомых, а не из одной большой.</> } },
      { ic: '3', h: { uz: 'Uch qadam', ru: 'Три шага' }, body: { uz: <>Odam botga uch qadamda keladi: eshitdi, ochdi, ishlatdi. Har qadamda odam kamayadi.</>, ru: <>Человек приходит к боту за три шага: услышал, открыл, воспользовался. На каждом шаге людей становится меньше.</> }, ask: { uz: 'Qaysi qadamda eng ko\'p odam yo\'qoladi?', ru: 'На каком шаге теряется больше всего людей?' } }
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
        <span className="rc-tag">{tr({ uz: 'Qayta tushuntirish', ru: "Объясняем заново" })}</span>
        <span className="rc-title">{tr(rc.title)}</span>
        <button className="rc-x" onClick={onClose} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>
      </div>
      <div className="rc-card" key={i}>
        <div className="rc-ic">{card.ic}</div>
        <h2 className="rc-h">{tr(card.h)}</h2>
        <p className="rc-body">{tr(card.body)}</p>
        {card.ask && <div className="rc-ask">{tr({ uz: 'Sinfga savol:', ru: "Вопрос классу:" })} {tr(card.ask)}</div>}
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
        <span className="mstats-n">{allIn ? tr({ uz: '✓ Hamma javob berdi', ru: '✓ Все ответили' }) : tr({ uz: <>Javob berdi: <b>{answered}</b> / {total}</>, ru: <>Ответили: <b>{answered}</b> / {total}</> })}</span>
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
        <p className="mstats-hidden">{tr({ uz: "🙈 Kim nimani tanlagani va ✅/❌ soni yopiq — «Natijani ochish» bosilganda sizda ham, o'quvchilar ekranida ham birdan ochiladi.", ru: '🙈 Кто что выбрал и сколько ✅/❌ — скрыто. Нажмёте «Открыть результат» — откроется сразу и у вас, и на экранах учеников.' })}</p>
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
            {level === 'need' && <p className="mstats-verdict-t">{tr({ uz: <>⚠️ Faqat <b>{pct}%</b> to'g'ri — bu mavzu sinfga tushunarsiz qolgan. Davom etishdan oldin qisqa takrorlab oling.</>, ru: <>⚠️ Верно всего <b>{pct}%</b> — тема осталась для класса непонятной. Прежде чем идти дальше, коротко повторите.</> })}</p>}
            {level === 'maybe' && <p className="mstats-verdict-t">{tr({ uz: <>🟡 <b>{pct}%</b> to'g'ri — yomon emas. Xohlasangiz, davom etishdan oldin qisqa takrorlab oling.</>, ru: <>🟡 <b>{pct}%</b> верно — неплохо. При желании коротко повторите, прежде чем идти дальше.</> })}</p>}
            {level === 'good' && <p className="mstats-verdict-t">{tr({ uz: <>✅ <b>{pct}%</b> to'g'ri — sinf mavzuni o'zlashtirdi. Bemalol davom eting!</>, ru: <>✅ <b>{pct}%</b> верно — класс тему усвоил. Спокойно идите дальше!</> })}</p>}
            {level === 'few' && <p className="mstats-verdict-t">{tr({ uz: <>Javob berganlar kam ({answered} ta) — foiz bo'yicha xulosa chiqarish qiyin. O'zingiz baholang.</>, ru: <>Ответивших мало ({answered}) — по проценту судить трудно. Оцените сами.</> })}</p>}
            {onOpenRecap && <button className="rc-open soft" onClick={onOpenRecap}>{tr({ uz: 'Qayta tushuntirishni ochish', ru: 'Открыть объяснение заново' })}</button>}
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
      <div className="screen" style={{ justifyContent: 'flex-start', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "Jonli dars — bitta urinish, o'ylab bosing.", ru: "Живой урок — одна попытка, жмите обдуманно." })}</p>}
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
                <span style={{ flex: 1 }}>{fmtCode(tr(opt))}</span>
              </button>
            );
          })}
        </div>
        <FeedbackBlock show={isMentorLive ? mReveal : picked !== null} isCorrect={isMentorLive ? true : (solved && !wrongLocked)} neutral={waiting}>
          <p className="small mono" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting ? T.blue : (isMentorLive || (solved && !wrongLocked)) ? T.success : T.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {isMentorLive
              ? <>✓ {revealPrefix}: {String.fromCharCode(65 + correctIdx)}</>
              : waiting
                ? tr({ uz: 'Javobingiz qabul qilindi', ru: "Ваш ответ принят" })
                : wrongLocked
                  ? <>{revealPrefix}: {String.fromCharCode(65 + correctIdx)} — {fmtCode(options[correctIdx])}</>
                  : solved ? tr({ uz: "To'g'ri", ru: 'Верно' }) : tr({ uz: "Qaytadan urinib ko'ring", ru: 'Попробуйте ещё раз' })}
          </p>
          <p className="body" style={{ margin: 0 }}>
            {isMentorLive
              ? fmtCode(tr(explainCorrect))
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
        <span className="mentor-name">{tr({ uz: 'Mentor', ru: 'Ментор' })}{collapsed && <span className="mentor-cue"> · {tr({ uz: "ko'rsatmani ochish ▾", ru: 'открыть подсказку ▾' })}</span>}</span>
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
    <button type="button" className="mnote-chip" onClick={() => setOpen(true)} title={tr({ uz: 'Mentorga eslatma — bosib oching', ru: 'Заметка ментору — нажмите, чтобы открыть' })}>{tr({ uz: '📋 Eslatma', ru: '📋 Заметка' })}</button>
  );
  return (
    <div className="mnote fade-up" onClick={() => setOpen(false)} title={tr({ uz: 'Yopish uchun bosing', ru: 'Нажмите, чтобы закрыть' })}>
      <span className="mnote-lbl">{tr({ uz: '🧑‍🏫 Mentorga eslatma', ru: '🧑‍🏫 Заметка ментору' })}<span className="mnote-x">{tr({ uz: '✕ yopish', ru: '✕ закрыть' })}</span></span>
      <p className="mnote-body">{children}</p>
    </div>
  );
};

// ===== 🛠️ JONLI PRAKTIKA yozuv-zonasi (500+) =====
const PRACTICE_BASE = 500;
const MentorPracticeStats = ({ live, screen, label = { uz: "👀 Kim bajardi", ru: "👀 Кто выполнил" } }) => {
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
      <div className="card-lbl" style={{ color: T.blue }}>{tr(label)} — {doers.length}/{players.length}</div>
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
      {tr({ uz: <>Sinfda: <b>{data.done}</b> bajardi{doing > 0 && <span className="dm-sub">· {doing} hali bajarmoqda</span>}</>, ru: <>В классе: <b>{data.done}</b> выполнили{doing > 0 && <span className="dm-sub">· {doing} ещё делают</span>}</> })}
    </div>
  );
};
// ============================================================
// 🤖 DARS MA'LUMOTLARI — o'quvchining O'Z boti (bitta misol-ip, 108-qonun)
// ============================================================
// 🔴 §40/§81: bot shu modulda QURILADI — hozirgi zamon buyruqlari va bot-havolasi YO'Q.
// Chiqish-artefakt kaliti (bosh-agent muhri): kod-kaliti `kanal`, o'quvchi so'zi «joy».
const OUT_KEY = 'pm-m5d2-yigirmata';
const readJoylar = () => {
  try {
    const d = JSON.parse(localStorage.getItem(OUT_KEY) || 'null');
    if (!d || typeof d !== 'object' || !Array.isArray(d.kanallar)) return null;
    const rows = d.kanallar
      .map(k => ({ joy: String((k && k.kanal) || '').trim(), kim: String((k && k.kim) || '').trim(), nechta: Number(k && k.nechta) }))
      .filter(r => r.joy.length >= 2 && Number.isFinite(r.nechta));
    return rows.length >= 3 ? rows.slice(0, 3) : null;
  } catch { return null; }
};

// ===== SCREEN 0 — HOOK: Telegramda hozir nechta botni ishlatasiz? =====
// 104-qonun: ikki tanlov teng og'irlikda; maqtov yo'q. v2: har tanlovga o'z izohi, oxiri (HOOK_END) bir xil.
const HOOK_OPTS = [
  { k: 'bor', t: { uz: 'Bir nechtasi bor — kimdir aytgani uchun ochganman', ru: "Есть несколько — открыл, потому что кто-то сказал" }, izoh: { uz: "Demak, botni siz ham kimdir aytgani uchun ochgansiz — ko'pchilik shunday ochadi.", ru: "Значит, и вы открыли бота, потому что кто-то о нём сказал, — так открывает большинство." } },
  { k: 'yoq', t: { uz: "Yo'q shekilli — o'zim hech qachon qidirmaganman", ru: 'Кажется, нет — сам никогда не искал' }, izoh: { uz: "Demak, bot o'zi sizga kelmagan: kimdir aytmasa, odam botni qidirmaydi.", ru: "Значит, бот сам к вам не пришёл: если никто не скажет, человек бота не ищет." } },
];
const HOOK_END = { uz: "1-darsda ochgan botingizni ham kimdir aytmaguncha hech kim topmaydi. Bugun kimga aytishni rejalashtiramiz.", ru: "Бота, которого вы открыли на 1-м уроке, тоже никто не найдёт, пока о нём кто-то не скажет. Сегодня спланируем, кому сказать." };
// 100-qonun: tanlov yoziladi, hech qayerda O'QILMAYDI.
const HOOK_KEY = 'pm-m5d2-hook-choice';
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
      try { const rows = await liveAnswers(live.pin, screen); if (on) setCounts(HOOK_OPTS.map((_, i) => rows.filter(r => r.picked === i).length)); } catch {}
      if (on) t = setTimeout(tick, 3000);
    };
    tick();
    return () => { on = false; clearTimeout(t); };
  }, [isLive, live && live.pin, screen]);
  const pick = (i) => {
    if (picked !== null || isMentor) return;
    setPicked(i);
    try { localStorage.setItem(HOOK_KEY, HOOK_OPTS[i].k); } catch {}
    onAnswer(screen, { stage: 'hook', screenIdx: screen, picked: i, correct: false });
    if (live && live.mode === 'student') live.submitAnswer(screen, 's0', i, false, 0);
  };
  const opened = picked !== null || isMentor;
  const totalVotes = counts ? counts.reduce((a, b) => a + b, 0) : 0;
  const optWave = useTurnHint(picked === null && !isMentor);
  return (
    <Stage eyebrow={tr({ uz: 'Kirish · botlar', ru: 'Вступление · боты' })} screen={screen} navContent={<NavNext optionalLive turnBusy={picked === null && !isMentor} disabled={picked === null && !isMentor} label={opened ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' })} onClick={onNext} />}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Telegram'da hozir <span className="italic" style={{ color: T.accent }}>nechta</span> botni ishlatasiz?</>, ru: <><span className="italic" style={{ color: T.accent }}>Сколькими</span> ботами в Telegram вы пользуетесь сейчас?</> })}</h2></div>
        <Mentor>{tr({ uz: "Bu savolda xato javob yo'q: o'zingizda qanday bo'lsa, shuni tanlang.", ru: "В этом вопросе нет неправильного ответа: выберите то, как есть у вас." })}</Mentor>
        <div className="hrow two fade-up delay-1">
          {HOOK_OPTS.map((o, i) => (
            <button key={o.k} className={`hopt${picked === i ? ' on' : ''}${opened ? ' open' : ''}${!opened && optWave ? waveCls(true, i, HOOK_OPTS.length) : ''}`} disabled={opened} onClick={() => pick(i)}>
              <span className="hopt-nom">{tr(o.t)}</span>
            </button>
          ))}
        </div>
        {opened && (
          <div className="frame-soft fade-step">
            <p className="body" style={{ margin: 0, color: T.ink }}>{picked !== null && HOOK_OPTS[picked] ? <>{tr(HOOK_OPTS[picked].izoh)} </> : null}{tr(HOOK_END)}</p>
          </div>
        )}
        {/* Korpus §97: ovoz-diagrammasi FAQAT jonli darsda — yakka o'quvchida jamoa-murojaati yo'q */}
        {opened && isLive && counts && (
          <div className="hvote fade-step" aria-label={tr({ uz: 'Javoblar', ru: 'Ответы' })}>
            {HOOK_OPTS.map((o, i) => {
              const n = counts[i];
              const pct = totalVotes ? Math.round((n / totalVotes) * 100) : 0;
              const top = totalVotes > 0 && n === Math.max(...counts);
              return (
                <div key={o.k} className={`hvote-row ${picked === i ? 'mine' : ''} ${top ? 'top' : ''}`}>
                  <span className="hvote-lbl">{tr(o.t)}</span>
                  <span className="hvote-track"><span className="hvote-fill" style={{ width: `${Math.max(pct, totalVotes ? 4 : 0)}%` }} /></span>
                  <span className="hvote-pct mono">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}
        <MentorNote>{tr({ uz: "Ovozlar bo'linadi — ikkalasi ham halol javob. «Kimdir aytmaguncha hech kim topmaydi» degan joyda bir lahza to'xtang: bugungi darsning ishi aynan shu. Odamlarni qayerdan topishni oldindan aytmang.", ru: "Голоса разделятся — оба ответа честные. На словах «никто не найдёт, пока о нём кто-то не скажет» задержитесь на мгновение: работа сегодняшнего урока именно в этом. Где искать людей — заранее не говорите." })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — MAQSAD: uchta guruh-qatori o'z-o'zidan yozilib chiqadi (18-qonun) =====
// 🔴 Demo NOMLARI s9 dagi to'rt guruhdan ham boshqa (§135-A: bir nom — bir son), «birinchi
//    foydalanuvchilar» va «tanish guruh» atamalari bu ekranda YO'Q (§126) — ko'chirib olinadigan javob yo'q.
// v2 (A7): «Jami» har qator soni chiqqanda o'sadi (12 → 18 → 22) — maqsad sanoq ekanini ko'rsatadi.
const DEMO_JOY = [
  { nom: { uz: "O'yin guruhi", ru: 'Игровая группа' }, kim: { uz: "birga o'ynaydiganlar", ru: 'те, с кем играем вместе' }, n: 12 },
  { nom: { uz: 'Kursdoshlar', ru: "Ребята с курсов" }, kim: { uz: "kursda haftada uch marta ko'rishadiganlar", ru: "те, с кем три раза в неделю видимся на курсах" }, n: 6 },
  { nom: { uz: "Qo'shnilar", ru: 'Соседи' }, kim: { uz: 'bir hovlidagilar', ru: "те, кто живёт в одном дворе" }, n: 4 },
];
// Qator soni chiqadigan vaqt (CSS --dd3 bilan bir xil: 1.32 + i*0.85 s) — shu paytda «Jami» o'sadi
const S1_COUNT_MS = DEMO_JOY.map((_, i) => Math.round((1.32 + i * 0.85) * 1000) + 250);
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [reduce] = useState(() => { try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch { return false; } });
  const [shown, setShown] = useState(reduce ? DEMO_JOY.length : 0);
  useEffect(() => {
    if (reduce) return;
    const ts = S1_COUNT_MS.map((ms, i) => setTimeout(() => setShown(v => Math.max(v, i + 1)), ms));
    return () => ts.forEach(clearTimeout);
  }, [reduce]);
  const jami = DEMO_JOY.slice(0, shown).reduce((sum, r) => sum + r.n, 0);
  return (
  <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начнём →' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Botingizni birinchi <span className="italic" style={{ color: T.accent }}>kim ishlatadi?</span></>, ru: <>Кто <span className="italic" style={{ color: T.accent }}>первым</span> воспользуется вашим ботом?</> })}</h2></div>
      <Mentor>{tr({ uz: "O'tgan darsda botingizni @BotFather'da ro'yxatdan o'tkazdingiz, kodini esa keyingi darsda yozasiz. Bugun birinchi yigirmata foydalanuvchingiz keladigan uchta guruhni yozasiz.", ru: "На прошлом уроке вы зарегистрировали бота в @BotFather, а код напишете на следующем. Сегодня вы запишете три группы, из которых придут ваши первые двадцать пользователей." })}</Mentor>
      <div className="s1demo">
        <span className="s1demo-lbl">{tr({ uz: 'Namuna: uchta guruh', ru: "Пример: три группы" })}</span>
        <div className="s1demo-list">
          {DEMO_JOY.map((r, i) => (
            <span key={tr(r.nom)} className="s1row" style={{ '--dd': `${0.5 + i * 0.85}s` }}>
              <span className="s1row-t" style={{ '--dd': `${0.5 + i * 0.85}s` }}>{tr(r.nom)}</span>
              <span className="s1row-mark" style={{ '--dd2': `${0.95 + i * 0.85}s` }}>→</span>
              <span className="s1row-why" style={{ '--dd3': `${1.15 + i * 0.85}s` }}>{tr(r.kim)}</span>
              <span className="s1row-n mono" style={{ '--dd3': `${1.32 + i * 0.85}s` }}>{r.n}</span>
            </span>
          ))}
        </div>
        {shown > 0 && <span className="s1sum mono">{tr({ uz: <>Jami: <b className="s1sum-n" key={jami}>{jami}</b> odam</>, ru: <>Всего: <b className="s1sum-n" key={jami}>{jami}</b> человек</> })}</span>}
      </div>
      <MentorNote>{tr({ uz: "Ro'yxat yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.", ru: 'Пока список дописывается, не говорите — картинка представит себя сама.' })}</MentorNote>
    </div>
  </Stage>
  );
};

// ===== SCREEN 2 — TEORIYA-1: bot tayyor ↔ botni odam ishlatdi (46-qonun toggle) =====
const S2_CARDS = [
  { h: { uz: 'Bot tayyor', ru: 'Бот готов' }, b: { uz: "Buyruqlar ishlaydi, javob keladi. Lekin uni hali hech kim ochmagan: bot bo'sh turibdi.", ru: "Команды работают, ответ приходит. Но его ещё никто не открыл: бот стоит пустой." } },
  { h: { uz: 'Botni odam ishlatdi', ru: 'Ботом воспользовался человек' }, b: { uz: "Kimdir botni ochdi, /start bosdi va javob oldi.", ru: "Кто-то открыл бота, нажал /start и получил ответ." } },
];
const Screen2 = ({ screen, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const [opened, setOpened] = useState([false, false]);
  const [seen, setSeen] = useState([false, false]);
  const allSeen = seen.every(Boolean);
  // 46-qonun: birinchi bosishdan keyin karta QULFLANMAYDI — qayta bosilsa yopilib-ochiladi.
  const toggle = (i) => {
    setOpened(prev => prev.map((v, k) => (k === i ? !v : v)));
    setSeen(prev => (prev[i] ? prev : prev.map((v, k) => (k === i ? true : v))));
  };
  const pend = S2_CARDS.map((_, i) => String(i)).filter(k => !seen[Number(k)]);
  const lit = useTurnWalk(pend);
  const qoldi = seen.filter(v => !v).length;
  // 77-qonun: xulosa-karta chiqqach u ko'rinishga olib kelinadi (ekran ostida qolmasin)
  const xulRef = useRef(null);
  useEffect(() => {
    if (!allSeen || !xulRef.current) return;
    const kam = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const t = setTimeout(() => { if (xulRef.current) xulRef.current.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'nearest' }); }, 320);
    return () => clearTimeout(t);
  }, [allSeen]);
  return (
    <Stage eyebrow={tr({ uz: 'Muhokama · ikki holat', ru: 'Обсуждение · два случая' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!allSeen && !isMentor} disabled={!allSeen && !isMentor} label={allSeen || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Yana ${qoldi} kartani oching`, ru: `Откройте ещё карточек: ${qoldi}` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bot tayyor bo'ldi — endi u <span className="italic" style={{ color: T.accent }}>kimga</span> kerak?</>, ru: <>Бот готов — а <span className="italic" style={{ color: T.accent }}>кому</span> он теперь нужен?</> })}</h2></div>
        <Mentor>{tr({ uz: "Tasavvur qiling: botingizning kodi yozilgan, tugmalar ishlayapti. Ikki kartani bosib solishtiring.", ru: "Представьте: код вашего бота написан, кнопки работают. Нажмите на обе карточки и сравните." })}</Mentor>
        <div className="dfc-grid fade-up delay-1">
          {S2_CARDS.map((c, i) => (
            <button key={tr(c.h)} type="button" className={`dfc${opened[i] ? ' open' : ''}${turnCls(lit, String(i), pend.length > 1)}`} onClick={() => toggle(i)}>
              <span className="dfc-top"><span className="dfc-h">{tr(c.h)}</span><span className={`dfc-mark${seen[i] ? ' ok' : ''}`} aria-hidden="true">{seen[i] ? '✓' : '›'}</span></span>
              <span className="dfc-b">{opened[i] ? tr(c.b) : '· · ·'}</span>
            </button>
          ))}
        </div>
        {allSeen && (
          <div className="xul fade-step" ref={xulRef}>
            <span className="xul-h">{tr({ uz: "Botingizni birinchi bo'lib ishlatadigan odamlar — birinchi foydalanuvchilar.", ru: "Люди, которые первыми начнут пользоваться вашим ботом, — первые пользователи." })}</span>
            <p className="xul-b">{tr({ uz: "Ularni bot o'zi olib kelmaydi: har biriga siz aytasiz. Bugungi maqsad — yigirmata: bir-ikki odam fikr aytishga kam, yuztasiga esa bittalab aytib chiqa olmaysiz.", ru: "Бот сам их не приведёт: каждому скажете вы. Цель на сегодня — двадцать: одного-двух человек мало, чтобы услышать мнение, а сотне вы не сможете рассказать по одному." })}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== TEST-EKRAN sarlavhasi (105-qonun: .h-ask) =====
const TestQ = ({ ask }) => <h2 className="title h-ask">{ask}</h2>;

const Screen3 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · bot va odam', ru: 'Проверка · бот и человек' })} scope="module-mikro"
    ctaLabel={tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' })} revealPrefix={tr({ uz: "To'g'ri javob", ru: 'Верный ответ' })}
    question={<TestQ ask={tr({ uz: "Bot bir hafta ishlab turdi, siz hech kimga aytmadingiz. Nechta odam yozdi?", ru: 'Бот работал неделю, вы никому не сказали. Сколько человек написало?' })} />}
    questionText={tr({ uz: "Hech kimga aytilmagan bot bir haftada nechta odam oldi", ru: 'Сколько человек за неделю получил бот, о котором никому не сказали' })}
    options={[tr({ uz: "Bir nechta — Telegram botni o'zi ko'rsatadi", ru: 'Несколько — Telegram сам показывает бота' }), tr({ uz: "Hech kim — uni topadigan odam bo'lmadi", ru: 'Никто — не нашлось человека, который бы его нашёл' }), tr({ uz: 'Ko\'p — bot qidiruvda birinchi chiqadi', ru: 'Много — бот выходит первым в поиске' })]}
    correctIdx={1}
    explainCorrect={tr({ uz: "Bot o'zi odam olib kelmaydi — birinchi odamlarga siz aytasiz.", ru: "Бот сам людей не приводит — первым людям говорите вы." })}
    explainWrong={{
      0: tr({ uz: "Telegram yangi botni hech kimga tavsiya qilmaydi: uni nomini bilgan odamgina qidirib topadi.", ru: "Telegram никому не советует новых ботов: найти его может только тот, кто знает его название." }),
      2: tr({ uz: "Qidiruvda chiqish uchun ham kimdir botni izlashi kerak. Siz aytmagan botni kim izlaydi?", ru: "Чтобы бот появился в поиске, его тоже должен кто-то искать. Кто станет искать бота, о котором вы не сказали?" }),
      default: tr({ uz: "Botni topadigan odam bo'lmasa, unga hech kim yozmaydi.", ru: "Если бота некому найти, ему никто не напишет." })
    }}
  />
);
// ===== SCREEN 4 — YADRO: «BIRINCHI 20» odamlar xaritasi (imzo-vizual, senariy 1-bo'limi) =====
// 1-bosqich: uch halqani bittalab ochish (ichida kimlar borligi bitta qatorda chiqadi).
// 2-bosqich: bir haftani navbat bilan uch halqaga berish — nuqtalar yonadi, natija-qatori chiqadi.
// 🔴 Atama-tartibi (§104/§126): «zich joy» savol-kartada ham, natija-qatorlarida ham YO'Q —
//    atama ko'rilgan hodisadan keyin YAKUN-KARTASIDA tug'iladi.
// 🔴 Rang-qonuni (§134): halqalar rang bilan baholanmaydi — tanlangani accent, qolgani neytral.
const HALQA_KEY = 'pm-m5d2-halqa';
// v2: halqa raqami — matn emas, CSS doira (.hnum / .wring-badge) ichidagi oddiy raqam (① ② ③ olindi).
// §134 rang-legendasi: indigo QUYUQLIGI = «qanchalik tez-tez ko'rishasiz». Ma'no o'quvchi
// matnida ikki joyda aytilgan — mentor gapi («ichkarida tanishlar, tashqarida notanishlar») va
// har halqaning O'Z nomi (1 har kuni · 2 ba'zan · 3 tanimaydiganlar). Bu baho EMAS:
// uzoq halqaga qizil berilmaydi — u neytral kulrangda qoladi.
const ZICH = ['z3', 'z2', 'z1'];
const HALQA = [
  {
    id: 1, nom: { uz: "Har kuni ko'rishadiganlar", ru: 'Те, кого вижу каждый день' }, n: 12, r: 62,
    qator: { uz: "Sinfdoshlar, qo'shnilar, to'garakdagilar. Ismingizni biladi.", ru: "Одноклассники, соседи, ребята из кружка. Знают вас по имени." },
    ishlatdi: 9, qoshildi: 8,
    resH: { uz: '9 → 17 odam.', ru: "9 → 17 человек." },
    resB: { uz: "9 odam ishlatdi, yana 8 odam qo'shildi.", ru: "Пользовались 9 человек, добавились ещё 8." }
  },
  {
    id: 2, nom: { uz: "Ba'zan ko'rishadiganlar", ru: 'Те, кого вижу иногда' }, n: 40, r: 104,
    qator: { uz: 'Maktabdagi tanishlar. Yuzingizdan taniydi.', ru: "Знакомые по школе. Знают вас в лицо." },
    ishlatdi: 6, qoshildi: 2,
    resH: { uz: '6 → 8 odam.', ru: "6 → 8 человек." },
    resB: { uz: "6 odam ishlatdi, yana 2 odam qo'shildi.", ru: "Пользовались 6 человек, добавились ещё 2." }
  },
  {
    id: 3, nom: { uz: 'Sizni tanimaydiganlar', ru: 'Те, кто вас не знает' }, n: 300, r: 146,
    qator: { uz: 'Katta Telegram guruhlaridagi odamlar. Sizni bilmaydi.', ru: "Люди из больших групп в Telegram. Вас не знают." },
    ishlatdi: 4, qoshildi: 0,
    resH: { uz: '4 → 4 odam.', ru: "4 → 4 человека." },
    resB: { uz: "4 odam ishlatdi, yangi qo'shilgan yo'q.", ru: "Пользовались 4 человека, новых не добавилось." }
  },
];
// Yonadigan nuqtalar halqa bo'ylab teng tarqaladi: 12 dan 9 tasi, 40 dan 6 tasi, 300 dan 4 tasi (§95).
const litIndexes = (h) => Array.from({ length: h.ishlatdi }, (_, j) => Math.round((j * h.n) / h.ishlatdi) % h.n);
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [reduce] = useState(() => { try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch { return false; } });
  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) { try { savedRef.current = JSON.parse(localStorage.getItem(HALQA_KEY) || 'null') || {}; } catch { savedRef.current = {}; } }
  const s0 = savedRef.current;
  const [opened, setOpened] = useState(() => (Array.isArray(s0.opened) ? s0.opened : []));
  const [picked, setPicked] = useState(() => (Array.isArray(s0.picked) ? s0.picked : []));
  const [run, setRun] = useState(null);
  const [sec, setSec] = useState(0);
  const mapDone = opened.length === HALQA.length;
  const done = picked.length === HALQA.length;
  useEffect(() => { try { localStorage.setItem(HALQA_KEY, JSON.stringify({ opened, picked })); } catch {} }, [opened, picked]);
  // Bir hafta ~6 soniyada o'tadi: nuqtalar navbat bilan yonadi, keyin qo'shilganlari chiqadi.
  useEffect(() => {
    if (!run) return;
    const h = HALQA.find(x => x.id === run.id);
    if (!h) return;
    if (run.phase === 'lit') {
      if (run.lit >= h.ishlatdi) { const t = setTimeout(() => setRun(r => (r ? { ...r, phase: 'extra' } : r)), 260); return () => clearTimeout(t); }
      const t = setTimeout(() => setRun(r => (r ? { ...r, lit: r.lit + 1 } : r)), Math.round(6000 / h.ishlatdi));
      return () => clearTimeout(t);
    }
    if (run.extra >= h.qoshildi) {
      const t = setTimeout(() => { setPicked(p => (p.includes(h.id) ? p : [...p, h.id])); setRun(null); }, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setRun(r => (r ? { ...r, extra: r.extra + 1 } : r)), 260);
    return () => clearTimeout(t);
  }, [run]);
  useEffect(() => { if (!mapDone || done || isMentor) return; const t = setInterval(() => setSec(s => s + 1), 1000); return () => clearInterval(t); }, [mapDone, done, isMentor]);
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      onAnswer(screen, { stage: 'halqa', screenIdx: screen, picked, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'halqa', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  const bosish = (id) => {
    if (isMentor || run) return;
    if (!mapDone) { setOpened(p => (p.includes(id) ? p : [...p, id])); return; }
    if (picked.includes(id)) return;
    if (reduce) { setPicked(p => [...p, id]); return; }
    setRun({ id, lit: 0, extra: 0, phase: 'lit' });
  };
  const litSet = run ? new Set(litIndexes(HALQA.find(x => x.id === run.id)).slice(0, run.lit)) : null;
  const ringTurn = useTurnHint(!mapDone && !isMentor);
  const weekTurn = useTurnHint(mapDone && !done && !run && !isMentor);
  const tip = mapDone && !done && !run && picked.length > 0 && sec >= 40;
  const natijalar = picked.map(id => HALQA.find(h => h.id === id)).filter(Boolean);
  // 77-qonun: yakun-karta va natija-qatorlari ekran ostida qolmasin
  const xulRef = useRef(null);
  useEffect(() => {
    if (!done || !xulRef.current) return;
    const kam = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const t = setTimeout(() => { if (xulRef.current) xulRef.current.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'nearest' }); }, 320);
    return () => clearTimeout(t);
  }, [done]);
  const resRef = useRef(null);
  useEffect(() => {
    if (done || !picked.length || !resRef.current) return;
    const kam = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const t = setTimeout(() => { if (resRef.current) resRef.current.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'nearest' }); }, 320);
    return () => clearTimeout(t);
  }, [picked.length]); // eslint-disable-line
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : !mapDone ? tr({ uz: `Uch halqani oching (${opened.length}/3)`, ru: `Откройте три круга (${opened.length}/3)` })
      : tr({ uz: `Har halqaga bir hafta bering (${picked.length}/3)`, ru: `Дайте каждому кругу по неделе (${picked.length}/3)` });
  const weekPct = run ? (run.phase === 'lit' ? Math.round((run.lit / Math.max(1, HALQA.find(x => x.id === run.id).ishlatdi)) * 100) : 100) : 0;
  return (
    <Stage eyebrow={tr({ uz: 'Sinov · odamlar xaritasi', ru: 'Опыт · карта людей' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.3vw,13px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Sizni <span className="italic" style={{ color: T.accent }}>o'rab</span> turgan odamlar kimlar?</>, ru: <>Кто те люди, что вас <span className="italic" style={{ color: T.accent }}>окружают</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: "Markazda siz turasiz, halqalarda — atrofingizdagi odamlar: ichkarida tanishlar, tashqarida notanishlar. Avval uchala halqani oching.", ru: "В центре стоите вы, в кругах — люди вокруг вас: внутри знакомые, снаружи незнакомые. Сначала откройте все три круга." })}</Mentor>
        <div className="split">
          <Col gap={9}>
            <div className="wmap fade-up delay-1">
              {HALQA.map((h, i) => (
                <button key={h.id} type="button" aria-label={tr(h.nom)} onClick={() => bosish(h.id)}
                  disabled={isMentor || !!run || (mapDone && picked.includes(h.id))}
                  className={`wring ${ZICH[i]}${opened.includes(h.id) ? ' on' : ''}${run && run.id === h.id ? ' live' : ''}${!mapDone && !opened.includes(h.id) ? waveCls(ringTurn, i, HALQA.length) : ''}`}
                  style={{ '--r': `${h.r}px`, zIndex: 10 - h.id }}>
                  <span className="wring-badge">{h.id}</span>
                </button>
              ))}
              <span className="wdots" aria-hidden="true">
                {HALQA.map(h => Array.from({ length: h.n }).map((_, i) => (
                  <i key={`${h.id}-${i}`} className={`wdot r${h.id}${run && run.id === h.id && litSet.has(i) ? ' lit' : ''}`}
                    style={{ '--a': `${(i * 360) / h.n}deg`, '--r': `${h.r}px` }} />
                )))}
                {run && run.extra > 0 && Array.from({ length: run.extra }).map((_, j) => (
                  <i key={`x${j}`} className="wdot plus"
                    style={{ '--a': `${j * (360 / Math.max(1, HALQA.find(x => x.id === run.id).qoshildi)) + 14}deg`, '--r': `${HALQA.find(x => x.id === run.id).r + 21}px` }} />
                ))}
              </span>
              <span className="wme" aria-hidden="true"><b>{tr({ uz: 'siz', ru: 'вы' })}</b></span>
            </div>
          </Col>
          <Col gap={9}>
            {/* v2 (A6): uchala halqa ochilgach qatorlar bitta «✓ Uch halqa ochildi» qatoriga yig'iladi */}
            {!mapDone ? (
            <div className="hrings">
              {HALQA.map((h, i) => (
                <button key={h.id} type="button" onClick={() => bosish(h.id)}
                  disabled={isMentor || !!run}
                  className={`hrr ${ZICH[i]}${opened.includes(h.id) ? ' on' : ''}${run && run.id === h.id ? ' live' : ''}`}>
                  <span className="hrr-h"><span className="hnum">{h.id}</span>{tr(h.nom)} <b className="mono">{tr({ uz: <>{h.n} odam</>, ru: <>{h.n} человек</> })}</b><span className={`hrr-mark${opened.includes(h.id) ? ' ok' : ''}`} aria-hidden="true">{opened.includes(h.id) ? '✓' : '›'}</span></span>
                  <span className="hrr-b">{opened.includes(h.id) ? tr(h.qator) : '· · ·'}</span>
                </button>
              ))}
            </div>
            ) : (
              <div className="hrr-fold fade-step">{tr({ uz: '✓ Uch halqa ochildi', ru: "✓ Три круга открыты" })} <span className="mono">· {HALQA.map(h => h.n).join(' · ')}</span></div>
            )}
            {mapDone && !done && (
              <div className="thr fade-step">
                <p className="flow-label">{tr({ uz: 'Bir hafta', ru: "Одна неделя" })}</p>
                <span className="thr-q">{tr({ uz: "Har halqaga bir hafta bering: bot haqida faqat o'sha halqadagilarga aytasiz. Qaysi biridan boshlaysiz?", ru: "Дайте каждому кругу по неделе: о боте вы рассказываете только людям из этого круга. С какого начнёте?" })}</span>
                <div className="thr-btns">
                  {HALQA.map((h, i) => (
                    <button key={h.id} type="button" disabled={isMentor || !!run || picked.includes(h.id)}
                      className={`thr-b ${ZICH[i]}${picked.includes(h.id) ? ' used' : ''}${run && run.id === h.id ? ' live' : ''}${!picked.includes(h.id) && !run ? waveCls(weekTurn, i, HALQA.length) : ''}`}
                      onClick={() => bosish(h.id)}><span className="hnum">{h.id}</span>{tr(h.nom)}{tr({ uz: 'ga', ru: '' })}</button>
                  ))}
                </div>
                {run && <span className="wweek" aria-hidden="true"><i style={{ width: `${weekPct}%` }} /></span>}
                {run && <p className="bhint">{tr({ uz: "Bir hafta o'tmoqda…", ru: "Неделя идёт…" })}</p>}
                {tip && <p className="bhint fade-step">{tr({ uz: 'Qolgan halqalarga ham bir hafta bering.', ru: "Дайте неделю и остальным кругам." })}</p>}
              </div>
            )}
            {natijalar.length > 0 && (
              <div className="thr-res" ref={resRef}>
                {/* §134: natija rang bilan baholanmaydi — uchala qator ham bir xil neytral */}
                {natijalar.map(h => (
                  <span key={h.id} className="res-line two"><span className="hnum">{h.id}</span><span className="res-tx"><b>{tr(h.resH)}</b><span className="res-sub">{tr(h.resB)}</span></span></span>
                ))}
              </div>
            )}
            {done && (
              <div className="xul fade-step" ref={xulRef}>
                <span className="xul-h">{tr({ uz: "Sizni taniydigan, bir-birini tez-tez ko'radigan odamlar — tanish guruh.", ru: "Люди, которые вас знают и часто видят друг друга, — группа знакомых." })}</span>
                <p className="xul-b">{tr({ uz: "Bitta odam botni ochadi → yonidagilar ko'radi → ular ham ochadi. Birinchi foydalanuvchilar shunday guruhlardan keladi.", ru: "Один человек открывает бота → те, кто рядом, видят → они тоже открывают. Первые пользователи приходят из таких групп." })}</p>
              </div>
            )}
          </Col>
        </div>
        {done && <StudentPracticePulse live={live} screen={screen} />}
        <MentorPracticeStats live={live} screen={screen} label={{ uz: 'Uchala halqaga hafta berganlar', ru: "Дали неделю всем трём кругам" }} />
        <MentorNote>{tr({ uz: "Bolalar odatda uchinchi halqani bosadi — «u yerda odam ko'p». Uchalasi bosilgach so'rang: birinchi halqada 12 odam bor edi, natija esa 17 — bu qo'shimcha odamlar qayerdan keldi? Javobni siz aytmang, bolalar natija-qatoridan o'zi o'qiydi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'Дети обычно нажимают третий круг — «там людей много». Когда нажаты все три, спросите: в первом круге было 12 человек, а результат — 17. Откуда взялись лишние люди? Ответ не говорите — дети сами прочитают его в строке результата. Эту работу выполняют ученики, вы наблюдаете; «Продолжить» для вас открыто.' })}</MentorNote>
      </div>
    </Stage>
  );
};

const Screen5 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · tanish va notanish', ru: 'Проверка · знакомые и незнакомые' })} scope="module-mikro"
    ctaLabel={tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' })} revealPrefix={tr({ uz: "To'g'ri javob", ru: 'Верный ответ' })}
    question={<TestQ ask={tr({ uz: "Bot havolasini 15 tanishingizga va 500 notanishga yubordingiz. Ertasiga botga ko'proq odam qaysi tomondan keladi?", ru: "Вы отправили ссылку на бота 15 знакомым и 500 незнакомым. С какой стороны назавтра к боту придёт больше людей?" })} />}
    questionText={tr({ uz: "Bot havolasi 15 tanish va 500 notanishga yuborilsa, botga ko'proq odam qaysi tomondan keladi", ru: "Ссылку на бота отправили 15 знакомым и 500 незнакомым — с какой стороны к боту придёт больше людей" })}
    options={[tr({ uz: "O'n beshtasidan — ular havolani yonidagilarga ko'rsatadi", ru: "От пятнадцати — они покажут ссылку тем, кто рядом" }), tr({ uz: "Besh yuztasidan — havolani ko'rgan odam ko'proq bo'ladi", ru: "От пятисот — ссылку увидит больше людей" }), tr({ uz: 'Ikkalasidan teng — havola ikkalasiga ham yetib bordi', ru: "Поровну — ссылка дошла до обеих сторон" })]}
    correctIdx={0}
    explainCorrect={tr({ uz: "Tanishlar havolani ochib, yonidagilarga ko'rsatadi; notanishlarda u odatda qolib ketadi.", ru: "Знакомые откроют ссылку и покажут тем, кто рядом; у незнакомых она обычно застревает." })}
    explainWrong={{
      1: tr({ uz: "Havolani ko'rgan odam ko'p, lekin ular sizni tanimaydi — ko'pchiligi uni ochmaydi ham.", ru: "Ссылку увидят многие, но они вас не знают — большинство её даже не откроет." }),
      2: tr({ uz: "Havola ikkalasiga ham yetdi. Farqi shunda: tanishlar uni yonidagilarga ko'rsatadi, notanishlar esa odatda ko'rsatmaydi.", ru: "Ссылка дошла до обеих сторон. Разница в том, что знакомые покажут её тем, кто рядом, а незнакомые обычно не покажут." }),
      default: tr({ uz: "Odatda tanishlardan ko'proq odam keladi: ular bir-birini ko'rib turadi.", ru: "Обычно от знакомых приходит больше людей: они видят друг друга." })
    }}
  />
);
// ===== SCREEN 6 — KEYS (K8 · Facebook): 3 slayd + 2 bashorat (33/56/91b-qonun) =====
// 🔴 Bosqich-hisoblagichi UZLUKSIZ: kartada har bosqichda «n / 5» (Stage eyebrow takrorlanmaydi),
//    bashorat javobidan keyin ham yo'qolmaydi (naqsh: PmLesson9 s6).
// 🔴 Ikki bashorat IKKI o'lchovda: (1) tarqalish tezligi, (2) dunyoga ochilish vaqti —
//    birinchisi ikkinchisining javobini oshkor qilmaydi (17-ov c).
// v2 (30.09): 7 → 5 bosqich — eski 3-bosqich (1-bashorat natijasi takrori) va eski 6-bosqichdagi
//    sana gapi (2-bashorat takrori) olindi; «Butun dunyoga» va ko'prik 5-bosqichga birlashdi.
//    Bashorat indekslari (ans 1 · 1) o'zgarmagan. Bosqich emojilari olindi — kartada raqam qoladi.
// ===== KEYS-SAHNA (F-1002-70 · 165-qonun) =====
// Voqea bosqichma-bosqich rasm kabi o'zgaradi: ≤4 turdagi emoji (illustratsiya, matnda emas) + nuqta va chiziq.
// Bashorat bosqichida javob berilmaguncha `pre` kadr turadi — sahna javobni oldindan ochmaydi (test halolligi);
// javobdan keyin `post`. Element: { id, e: emoji | t: matn | d: 1 (nuqta), x, y — foiz }.
// Kadr: { on: ['id', 'id:dim', 'id:alt', 'id:ok'], lines: n, cap }. Reduced-motion: kadr darhol, animatsiyasiz.
function KeysScene({ scene, step, answered }) {
  const f0 = scene.frames[Math.min(step, scene.frames.length - 1)];
  const fr = f0.pre ? (answered ? f0.post : f0.pre) : f0;
  const st = {};
  fr.on.forEach((k, n) => { const [id, mod] = k.split(':'); st[id] = { mod, n }; });
  const byId = Object.fromEntries(scene.items.map(it => [it.id, it]));
  return (
    <div className="ksc fade-up" role="img" aria-label={tr(scene.alt)}>
      {fr.cap && <span className="ksc-cap mono" key={tr(fr.cap)}>{tr(fr.cap)}</span>}
      {scene.brand && step >= (scene.brand.from || 0) && <span className={`ksc-brand ksc-b-${scene.brand.id}`} aria-hidden="true">{scene.brand.name}</span>}
      <svg className="ksc-lines" aria-hidden="true">
        {(scene.lines || []).map(([a, b], k) => <line key={k} x1={`${byId[a].x}%`} y1={`${byId[a].y}%`} x2={`${byId[b].x}%`} y2={`${byId[b].y}%`} pathLength="1" className={k < (fr.lines || 0) ? 'on' : ''} style={{ transitionDelay: `${0.3 + k * 0.05}s` }} />)}
      </svg>
      {scene.items.map(it => {
        const s = st[it.id];
        const cls = `ksc-i${it.d ? ' dot' : it.t ? ' txt' : ''}${s ? ' on' : ''}${s && s.mod ? ' ' + s.mod : ''}`;
        return <span key={it.id} className={cls} aria-hidden="true" style={{ left: `${it.x}%`, top: `${it.y}%`, transitionDelay: s ? `${Math.min(s.n, 14) * 0.05}s` : '0s' }}>{it.e || (it.t ? tr(it.t) : null)}</span>;
      })}
    </div>
  );
}
// Facebook sahnasi — 5 kadr (har bosqichga bittadan), emoji turlari: 🌍 🏛️ 🏫
const KEYS_SCENE = {brand: { id: 'fb', name: 'thefacebook', from: 4 }, alt: {uz: "Bitta universitet: talabalar bir-biriga ulanadi; keyin boshqa universitetlar va maktablar; oxirida butun dunyo", ru: "Один университет: студенты связываются друг с другом; потом другие университеты и школы; в конце — весь мир"}, items: [{id: "u0", e: "🏛️", x: 8, y: 50}, {id: "d1", d: 1, x: 22, y: 20}, {id: "d2", d: 1, x: 27, y: 41}, {id: "d3", d: 1, x: 31, y: 64}, {id: "d4", d: 1, x: 36, y: 29}, {id: "d5", d: 1, x: 40, y: 53}, {id: "d6", d: 1, x: 25, y: 73}, {id: "d7", d: 1, x: 34, y: 13}, {id: "d8", d: 1, x: 44, y: 39}, {id: "d9", d: 1, x: 30, y: 51}, {id: "d10", d: 1, x: 42, y: 69}, {id: "d11", d: 1, x: 38, y: 20}, {id: "d12", d: 1, x: 46, y: 60}, {id: "u1", e: "🏛️", x: 57, y: 28}, {id: "u2", e: "🏛️", x: 67, y: 28}, {id: "u3", e: "🏛️", x: 77, y: 28}, {id: "s1", e: "🏫", x: 62, y: 74}, {id: "s2", e: "🏫", x: 72, y: 74}, {id: "w", e: "🌍", x: 91, y: 52}], lines: [["d1", "d4"], ["d4", "d2"], ["d2", "d5"], ["d5", "d3"], ["d1", "d7"], ["d7", "d11"], ["d11", "d8"], ["d8", "d12"], ["d12", "d10"], ["d10", "d6"], ["d6", "d9"], ["d9", "d3"]], frames: [{on: ["u0", "d1", "d2", "d3"], cap: "2004"}, {pre: {on: ["u0", "d1", "d2", "d3"], cap: "2004"}, post: {on: ["u0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12"], lines: 12, cap: "2004"}}, {on: ["u0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "u1", "u2", "u3", "s1", "s2"], lines: 12, cap: "2005"}, {pre: {on: ["u0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "u1", "u2", "u3", "s1", "s2"], lines: 12, cap: "2005"}, post: {on: ["u0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "u1", "u2", "u3", "s1", "s2", "w"], lines: 12, cap: "2006"}}, {on: ["u0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "u1", "u2", "u3", "s1", "s2", "w"], lines: 12, cap: "2006"}]};
const KEYS_STEPS = [
  {
    h: { uz: '2004-yil', ru: '2004 год' },
    body: { uz: <>AQShdagi bitta universitetda oddiy sayt ochildi. Unga <b>faqat o'sha universitet talabalari</b> yozila olardi.</>, ru: <>В одном университете в США открылся простой сайт. Записаться на него могли <b>только студенты этого университета</b>.</> }
  },
  {
    predict: {
      ask: { uz: 'Sayt faqat bitta universitetda ochiq edi. Sizningcha, u yerda qanday tarqaldi?', ru: 'Сайт был открыт только в одном университете. Как, по-вашему, он там расходился?' },
      chips: [
        { t: { uz: "Sekin — har kim o'zi qidirib topdi", ru: 'Медленно — каждый искал и находил сам' } },
        { t: { uz: 'Tez — u yerda hamma bir-birini tanirdi', ru: "Быстро — там все знали друг друга" } },
        { t: { uz: 'Tarqalmadi — odam soni kam edi', ru: 'Не разошёлся — людей было мало' } },
      ],
      ans: 1,
      hit: { uz: 'Topdingiz: tez — u yerda hamma bir-birini tanirdi.', ru: "Угадали: быстро — там все знали друг друга." },
      miss: { uz: 'Adashdingiz — asl javob: tez, u yerda hamma bir-birini tanirdi.', ru: "Не угадали — верный ответ: быстро, там все знали друг друга." }
    }
  },
  {
    h: { uz: 'Keyin boshqa universitetlar', ru: 'Потом другие университеты' },
    body: { uz: <>Sayt boshqa universitetlarga birin-ketin ochildi, 2005-yilda — maktablarga ham.</>, ru: <>Сайт по очереди открылся для других университетов, а в 2005 году — и для школ.</> }
  },
  {
    predict: {
      ask: { uz: 'Sayt butun dunyoga qachon ochilgan?', ru: 'Когда сайт открылся для всего мира?' },
      chips: [
        { t: { uz: "O'sha yilning o'zida", ru: "В том же году" } },
        { t: { uz: 'Ikki yarim yildan keyin', ru: "Через два с половиной года" } },
        { t: { uz: 'Bir necha oydan keyin', ru: "Через несколько месяцев" } },
      ],
      ans: 1,
      hit: { uz: 'Topdingiz: ikki yarim yildan keyin, 2006-yilda.', ru: "Угадали: через два с половиной года, в 2006 году." },
      miss: { uz: 'Adashdingiz — asl javob: ikki yarim yildan keyin, 2006-yilda.', ru: "Не угадали — верный ответ: через два с половиной года, в 2006 году." }
    }
  },
  {
    h: { uz: 'Bu sayt — Facebook', ru: "Этот сайт — Facebook" },
    body: { uz: <>Bu voqeada odam soni emas, odamlarning bir-birini tanishi ish bergan. Sizda ham shunday guruhlar bor — bitta savoldan keyin ularni yozasiz.</>, ru: <>В этой истории сработало не число людей, а то, что люди знали друг друга. У вас тоже есть такие группы — после одного вопроса вы их запишете.</> }
  },
];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gateK = useContext(LiveGateCtx) || {};
  const isMentorK = !!(gateK.live && gateK.live.mode === 'mentor');
  const [i, setI] = useState(0);
  const [bets, setBets] = useState({});
  const [maxSeen, setMaxSeen] = useState(0);
  useEffect(() => { setMaxSeen(m => Math.max(m, i)); }, [i]);
  const last = i === KEYS_STEPS.length - 1;
  useEffect(() => { if (last && storedAnswer === undefined) onAnswer(screen, { correct: true }); }, [last]); // eslint-disable-line
  const c = KEYS_STEPS[i];
  const bet = c.predict ? bets[i] : undefined;
  const betPending = !!(c.predict && bet === undefined);
  const betHint = useTurnHint(betPending && !isMentorK);
  const showSlide = !c.predict;
  return (
    <Stage eyebrow={tr({ uz: 'Biznes olamidan', ru: "Из мира бизнеса" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={betPending && !isMentorK} disabled={betPending && !isMentorK} label={betPending && !isMentorK ? tr({ uz: "Avval o'zingiz belgilang", ru: 'Сначала отметьте сами' }) : last ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Keyingi bosqich (${i + 1}/${KEYS_STEPS.length})`, ru: `Следующий шаг (${i + 1}/${KEYS_STEPS.length})` })} onClick={last ? onNext : () => setI(i + 1)} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bu sayt birinchi foydalanuvchilarini <span className="italic" style={{ color: T.accent }}>qayerdan</span> olgan?</>, ru: <><span className="italic" style={{ color: T.accent }}>Откуда</span> этот сайт взял первых пользователей?</> })}</h2></div>
        <KeysScene scene={KEYS_SCENE} step={i} answered={bet !== undefined} />
        {c.predict && (
          <div className={`kp-bet fade-step${bet !== undefined ? ' answered' : ''}`} key={`b${i}`}>
            <span className="k-slide-eyebrow">{bet === undefined ? <>{tr({ uz: "Avval o'zingiz belgilab ko'ring", ru: "Сначала попробуйте отметить сами" })} · </> : null}{i + 1} / {KEYS_STEPS.length}</span>
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
                    {tr(ch.t)}
                    {locked && isAns && <span className="kp-mark ok">✓</span>}
                    {locked && !isAns && bet === k && !isMentorK && <span className="kp-mark no">✗</span>}
                  </button>
                );
              })}
            </div>
            {bet !== undefined && !isMentorK && (
              <p className={`kp-res ${bet === c.predict.ans ? 'hit' : 'miss'}`}>
                {bet === c.predict.ans ? tr(c.predict.hit) : tr(c.predict.miss)}
              </p>
            )}
          </div>
        )}
        {showSlide && (
          <div className="k-slide fade-step" key={`s${i}`}>
            <span className="k-slide-eyebrow">{i + 1} / {KEYS_STEPS.length}</span>
            {c.h && <h3 className="k-slide-h">{tr(c.h)}</h3>}
            <p className="k-slide-body">{tr(c.body)}</p>
          </div>
        )}
        <div className="k-dots">{KEYS_STEPS.map((_, k) => {
          const ochiq = k <= maxSeen && !(betPending && k > i);
          return <button key={k} className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} disabled={!ochiq} onClick={() => ochiq && setI(k)} aria-label={tr({ uz: `${k + 1}-bosqich`, ru: `Шаг ${k + 1}` })} title={ochiq ? undefined : tr({ uz: 'Avval shu bosqichni tugating', ru: 'Сначала завершите этот шаг' })} />;
        })}</div>
        <MentorNote>{tr({ uz: "«Facebook»ni bolalar o'zi aytadi — kutib turing, keyin oxirgi kartani oching. «Bizda ham shunaqa bo'ladimi?» degan savol chiqsa: dars aynan shu haqda — sizning universitetingiz yo'q, lekin sinfingiz bor.", ru: '«Facebook» дети назовут сами — подождите, потом откройте последнюю карточку. Если прозвучит вопрос «А у нас так будет?»: урок именно об этом — университета у вас нет, зато есть класс.' })}</MentorNote>
      </div>
    </Stage>
  );
};

const Screen7 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · bitta universitet', ru: "Проверка · один университет" })} scope="module-mikro"
    ctaLabel={tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' })} revealPrefix={tr({ uz: "To'g'ri javob", ru: 'Верный ответ' })}
    question={<TestQ ask={tr({ uz: "Sayt bitta universitetda tez tarqaldi. Buni nima tezlashtirdi?", ru: 'Сайт быстро разошёлся в одном университете. Что это ускорило?' })} />}
    questionText={tr({ uz: "Sayt bitta universitetda nega tez tarqaldi", ru: 'Почему сайт быстро разошёлся в одном университете' })}
    options={[tr({ uz: "Saytda odam soni ko'p edi: butun shahar yozila olardi", ru: 'На сайте было много людей: записаться мог весь город' }), tr({ uz: "Sayt birinchi kundan butun dunyo uchun ochiq turardi", ru: 'Сайт с первого дня был открыт для всего мира' }), tr({ uz: "Yangilik ertasiga darsda yonma-yon o'tirganlarga yetardi", ru: 'Новость назавтра доходила до тех, кто сидел рядом на занятиях' })]}
    correctIdx={2}
    explainCorrect={tr({ uz: "Saytga faqat o'sha universitetdagilar kira olardi, ular esa bir-birini har kuni ko'rardi.", ru: 'На сайт могли зайти только студенты этого университета, а они видели друг друга каждый день.' })}
    explainWrong={{
      0: tr({ uz: "Odam soni emas: saytga faqat o'sha universitetdagilar yozila olardi, butun shahar emas.", ru: 'Дело не в числе людей: записаться могли только из этого университета, а не весь город.' }),
      1: tr({ uz: 'Butun dunyo uchun sayt ikki yarim yildan keyin ochilgan — birinchi kuni emas.', ru: "Для всего мира сайт открылся через два с половиной года — не в первый день." }),
      default: tr({ uz: "Sabab bitta: u yerdagilar bir-birini har kuni ko'rardi va yangilikni yonidagiga aytardi.", ru: "Причина одна: люди там видели друг друга каждый день и рассказывали новость тем, кто рядом." })
    }}
  />
);

// ===== SCREEN 8 — YOZISH-EKRANI: uchta guruh, bittalab (48/80/85/92/106d-qonun) =====
// v2: o'quvchi ko'radigan so'z «guruh»; ichki o'zgaruvchi nomlari (joy) va chiqish-artefakt kaliti
//    (kanallar[].kanal · kim · nechta) O'ZGARMAGAN — 8-dars shu kalitni o'qiydi.
// 🔴 Kirish-artefakt YO'Q (modul boshi): tasma ham, zaxira-gap ham chizilmaydi (§69).
const DRAFT_KEY = 'pm-m5d2-draft';
const JOY_QADAM = [
  { n: 1, nom: { uz: '1-guruh', ru: "1-я группа" } },
  { n: 2, nom: { uz: '2-guruh', ru: "2-я группа" } },
  { n: 3, nom: { uz: '3-guruh', ru: "3-я группа" } },
];
const M_APO = "['\u02BB\u2019]";
const normJoy = (s) => s.toLowerCase().replace(new RegExp(M_APO, 'g'), "'").replace(/\s+/g, ' ').trim();
// Umumiy-so'zlar lug'ati (106d-c, dars o'z so'zlaridan): bular «kim» qatoriga javob emas.
const UMUMIY = { uz: ['hamma', 'odamlar', "do'stlar", 'yoshlar', 'bolalar', 'hech kim'], ru: ['все', 'люди', 'друзья', 'молодёжь', 'дети', 'никто', 'ребята', 'подростки', 'знакомые'] };
const umumiyMi = (s) => {
  const t = normJoy(s);
  if (!t) return false;
  return tr(UMUMIY).some(u => t === u || t === `${u}lar` || t === `${u} bor`);
};
const sonOqi = (s) => {
  const t = String(s || '').trim();
  if (!/^[0-9]{1,4}$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : null;
};
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const draftRef = useRef(undefined);
  if (draftRef.current === undefined) { try { draftRef.current = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null') || {}; } catch { draftRef.current = {}; } }
  const d0 = draftRef.current;
  const [list, setList] = useState(() => (storedAnswer && Array.isArray(storedAnswer.joylar)) ? storedAnswer.joylar : (Array.isArray(d0.list) ? d0.list : []));
  const [joy, setJoy] = useState(() => (typeof d0.joy === 'string' ? d0.joy : ''));
  const [kim, setKim] = useState(() => (typeof d0.kim === 'string' ? d0.kim : ''));
  const [son, setSon] = useState(() => (typeof d0.son === 'string' ? d0.son : ''));
  const [edit, setEdit] = useState(null);
  const [kimFocus, setKimFocus] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);
  const done = list.length >= 3;
  const savedRef = useRef(false);
  const idx = edit === null ? Math.min(list.length, JOY_QADAM.length - 1) : edit;
  const cur = JOY_QADAM[idx];
  const joyTxt = joy.trim();
  const kimTxt = kim.trim();
  const sonVal = sonOqi(son);
  const joyOk = joyTxt.length >= 2;
  const kimOk = kimTxt.length >= 3;
  const kimUmumiy = kimOk && umumiyMi(kimTxt);
  const kattaSon = sonVal !== null && sonVal > 100;
  const canSave = joyOk && kimOk && sonVal !== null;
  const kimTurn = useTurnHint(!done && joyOk && !kimOk && !kimFocus && !isMentor);
  const jami = list.reduce((s, r) => s + (Number(r.nechta) || 0), 0);
  useEffect(() => {
    if (!done || savedRef.current) return;
    savedRef.current = true;
    if (storedAnswer === undefined || !storedAnswer.solved) {
      onAnswer(screen, { stage: 'joy', screenIdx: screen, joylar: list.slice(0, 3), solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'joy', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  useEffect(() => {
    if (!done) return;
    // Chiqish-artefakt shakli bosh-agent muhridan: kod-kaliti `kanal`, o'quvchi so'zi «joy».
    const payload = { kanallar: list.slice(0, 3).map(r => ({ kanal: r.joy, kim: r.kim, nechta: r.nechta })), savedAt: Date.now() };
    try { localStorage.setItem(OUT_KEY, JSON.stringify(payload)); } catch {}
  }, [list, done]);
  useEffect(() => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ list, joy, kim, son })); } catch {} }, [list, joy, kim, son]);
  const save = () => {
    if (!canSave) return;
    const yozuv = { joy: joyTxt, kim: kimTxt, nechta: sonVal };
    setList(p => (edit === null ? [...p, yozuv] : p.map((r, k) => (k === edit ? yozuv : r))));
    setJoy(''); setKim(''); setSon(''); setEdit(null);
  };
  const startEdit = (k) => { setEdit(k); setJoy(list[k].joy); setKim(list[k].kim); setSon(String(list[k].nechta)); };
  const xulRef = useRef(null);
  useEffect(() => {
    if (!done || !xulRef.current) return;
    const kam = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const t = setTimeout(() => { if (xulRef.current) xulRef.current.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'nearest' }); }, 320);
    return () => clearTimeout(t);
  }, [done]);
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : list.length === 0 ? tr({ uz: 'Birinchi guruhingizni yozing', ru: "Запишите первую группу" }) : tr({ uz: `Yana ${3 - list.length} guruh qoldi`, ru: `Осталось групп: ${3 - list.length}` });
  const needTxt = !joyOk ? tr({ uz: 'guruh nomi yozilmagan', ru: "не записано название группы" }) : !kimOk ? tr({ uz: 'kimlar borligi yozilmagan', ru: 'не записано, кто там есть' }) : sonVal === null ? tr({ uz: 'odam soni yozilmagan', ru: 'не записано число людей' }) : '';
  const specOk = [list.length > 0 && list.every(r => Number(r.nechta) > 0), list.length > 0 && list.every(r => !umumiyMi(r.kim))];
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Uchta <span className="italic" style={{ color: T.accent }}>guruhingizni</span> yozing.</>, ru: <>Запишите три <span className="italic" style={{ color: T.accent }}>свои группы</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Tanish guruhni eslang: sizni taniydigan, bir-birini tez-tez ko'radigan odamlar.", ru: "Вспомните группу знакомых: люди, которые вас знают и часто видят друг друга." })}</Mentor>
        {/* 80a: havoda uch doira — nechanchi joyni yozayotgani ko'rinib turadi */}
        <div className="stps fade-up">
          {JOY_QADAM.map((m, k) => (
            <span key={m.n} className={`stp ${list.length > k ? 'done' : idx === k ? 'on' : ''}`}><i>{list.length > k ? '✓' : m.n}</i>{tr(m.nom)}</span>
          ))}
        </div>
        <div className="split">
          <Col gap={9}>
            {(!done || edit !== null) && (
              <div className="wsp-ed">
                <GrowInput className={`reflect-input${joyOk ? ' filled' : ''}`} value={joy} maxLength={48} aria-label={tr({ uz: 'Qaysi guruh?', ru: "Какая группа?" })} placeholder={tr({ uz: 'Qaysi guruh?', ru: "Какая группа?" })} onChange={e => setJoy(e.target.value)} />
                <GrowInput className={`reflect-input${kimTurn ? ' await' : ''}${kimOk ? ' filled' : ''}`} value={kim} maxLength={90} aria-label={tr({ uz: 'Unda kimlar bor?', ru: "Кто в ней есть?" })} placeholder={tr({ uz: 'Unda kimlar bor?', ru: "Кто в ней есть?" })}
                  onFocus={() => setKimFocus(true)} onBlur={() => setKimFocus(false)} onChange={e => setKim(e.target.value)} />
                <div className="numrow">
                  <input className={`reflect-input num-in${sonVal !== null ? ' filled' : ''}`} value={son} maxLength={4} inputMode="numeric" aria-label={tr({ uz: 'Nechta odam?', ru: 'Сколько человек?' })} placeholder={tr({ uz: 'Nechta?', ru: 'Сколько?' })}
                    onChange={e => setSon(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') save(); }} />
                  <span className="numrow-u">{tr({ uz: 'odam', ru: 'чел.' })}</span>
                </div>
                {/* 106d: ikki tomonlama javob — bloklamaydi, yo'naltiradi */}
                {sonVal === null && son.trim().length > 0 && <p className="sfb ask">{tr({ uz: 'Nechta odam? Sonini yozing.', ru: "Сколько человек? Напишите число." })}</p>}
                {kimUmumiy && <p className="sfb ask">{tr({ uz: "Aniqroq yozing: guruhda kimlar bor — sinfdoshlarmi, qo'shnilarmi, to'garakdagilarmi?", ru: "Напишите точнее: кто в группе — одноклассники, соседи, ребята из кружка?" })}</p>}
                {kattaSon && <p className="sfb ask">{tr({ uz: "Bu guruhda odam ko'p. Ularning nechtasi sizni taniydi? O'sha sonni yozing.", ru: "В этой группе людей много. Сколько из них знают вас? Напишите это число." })}</p>}
                {canSave && !kimUmumiy && !kattaSon && <p className="sfb ok">{tr({ uz: "Guruh, kimlar va odam soni yozildi — saqlashingiz mumkin.", ru: "Группа, кто в ней есть и число людей записаны — можно сохранять." })}</p>}
                <div className="wsp-saverow">
                  <button type="button" className="wsp-save" disabled={!canSave} onClick={save}>{edit === null ? tr({ uz: '✓ Saqlash', ru: '✓ Сохранить' }) : tr({ uz: '✓ Yangilash', ru: '✓ Обновить' })}</button>
                  {!canSave && needTxt && <span className="wsp-need">{needTxt}</span>}
                </div>
              </div>
            )}
            {/* 80c: yozilganlar yozish paytida ko'rinmaydi; uchtasi tayyor bo'lgach ro'yxat ochiladi */}
            {done && edit === null && (
              <div className="wsp-list fade-step" ref={xulRef}>
                <span className="wsp-list-h">{tr({ uz: 'Uchta guruhingiz', ru: "Ваши три группы" })}</span>
                {list.slice(0, 3).map((r, k) => (
                  <span key={k} className="wsp-item">
                    <span className="wsp-item-t"><b>{r.joy}</b> → {r.kim} → {r.nechta} {tr({ uz: 'odam', ru: 'чел.' })}</span>
                    <button type="button" className="wsp-item-edit" title={tr({ uz: 'Tahrirlash', ru: 'Изменить' })} onClick={() => startEdit(k)}>✎</button>
                  </span>
                ))}
              </div>
            )}
          </Col>
          <Col gap={9}>
            <div className="wsp-task">
              <span className="wsp-task-lbl">{tr({ uz: 'Topshiriq', ru: "Задание" })}</span>
              <div className="spec">
                {[tr({ uz: 'Har guruhda odam soni', ru: "В каждой группе — число людей" }), tr({ uz: 'Har guruhda kimlar borligi', ru: "В каждой группе — кто в ней есть" })].map((t, k) => (
                  <span key={t} className={`spec-c${specOk[k] ? ' ok' : ''}`}>{specOk[k] ? '✓' : '○'} {t}</span>
                ))}
              </div>
              {/* 106c-b: holat ko'rsatkichi va §131: yig'iladigan natija har qadamda sanaladi */}
              <span className="wsp-sum mono">{done ? tr({ uz: `Jami: ${jami} odam`, ru: `Всего: ${jami} чел.` }) : tr({ uz: `Hozircha: ${jami} odam`, ru: `Пока: ${jami} чел.` })}</span>
              {done && jami < 20 && <span className="wsp-need">{tr({ uz: 'Yigirmaga yetmadi — bu ham natija. Kod yozganingizda u yana nechta odam kerakligini sanab beradi.', ru: "До двадцати не дотянули — это тоже результат. Когда напишете код, он посчитает, сколько ещё человек нужно." })}</span>}
            </div>
            <div className="wsxrow">
              <div className={`wsx ${yordamOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })} {yordamOpen ? '▾' : '›'}</button>
                {yordamOpen && <div className="wsx-body"><p>{tr({ uz: "Bu odamlarni haftada necha marta ko'rasiz?", ru: 'Сколько раз в неделю вы видите этих людей?' })}</p><p>{tr({ uz: 'Ular sizni ismingiz bilan biladimi?', ru: 'Они знают вас по имени?' })}</p></div>}
              </div>
              <div className={`wsx star ${starOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setStarOpen(o => !o)}>{tr({ uz: "Qo'shimcha", ru: "Дополнительно" })} {starOpen ? '▾' : '›'}</button>
                {starOpen && <div className="wsx-body"><p>{tr({ uz: "Odam soni eng ko'p guruhingizni oling. Agar ularning yarmi botni ochmasa, uchala guruhdan jami nechta odam qoladi? Javobni ovoz chiqarib ayting.", ru: "Возьмите группу, где больше всего людей. Если половина из них не откроет бота, сколько человек останется во всех трёх группах? Скажите ответ вслух." })}</p></div>}
              </div>
            </div>
            <StudentPracticePulse live={live} screen={screen} />
            <MentorPracticeStats live={live} screen={screen} label={{ uz: 'Uchta guruhni yozganlar', ru: "Записали три группы" }} />
          </Col>
        </div>
        <MentorNote>{tr({ uz: "«Butun maktab», «Telegram'dagi hamma» kabi katta guruhlar chiqadi — eng foydali xato. Javob-qatori uni tutadi; siz uchinchi halqa natijasini eslating: 300 odamdan 4 tasi. Baholash-mezoni: uchala guruhda son bor · har guruhda kimlar borligi aniq aytilgan. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: "Появятся большие группы вроде «вся школа», «все в Telegram» — самая полезная ошибка. Строка-ответ её поймает; вы напомните результат третьего круга: из 300 человек — 4. Критерий оценки: во всех трёх группах есть число · в каждой группе ясно сказано, кто в ней есть. Эту работу выполняют ученики, вы наблюдаете; «Продолжить» для вас открыто." })}</MentorNote>
      </div>
    </Stage>
  );
};
// ===== SCREEN 9 — TEKSHIRUV: GURUH-QUVURI (26/59-qonun: yangi mexanika) =====
// Bu yerda hech narsa baholanmaydi, tartiblanmaydi va hech qayerga tushmaydi: o'quvchi
// MAQSADGA (yigirmaga, iloji boricha kam guruhdan) yetguncha guruh tanlaydi va har guruhning
// uch qadamdagi yo'qotishini o'qiydi.
// §120: har kartada bosishdan OLDIN uchala ma'lumot turadi — guruh nomi · odam soni · ko'rishish
// tezligi. v2: legenda olindi — kartada belgi o'rniga so'z turadi («26 odam · har kuni ko'rishadi»).
// §107: to'rt guruhning ikkitasi tanish, ikkitasi tarqoq; tartib naqshsiz.
const QUVUR_KEY = 'pm-m5d2-quvur';
const MAQSAD = 20;
const QUVUR = [
  { id: 'j1', nom: { uz: 'Sinfdoshlar', ru: "Одноклассники" }, bor: 26, tez: { uz: "har kuni ko'rishadi", ru: 'видятся каждый день' }, eshitdi: 26, ochdi: 18, ishlatdi: 13, sabab: { uz: "biri ochdi, yonidagilarga ko'rsatdi.", ru: "один открыл, показал тем, кто рядом." } },
  { id: 'j2', nom: { uz: 'Notanish odamlar guruhi', ru: 'Группа незнакомых людей' }, bor: 1200, tez: { uz: "umuman ko'rishmaydi", ru: 'совсем не видятся' }, eshitdi: 1200, ochdi: 46, ishlatdi: 2, sabab: { uz: "sizni tanimaydi, ochib yopib qo'ydi.", ru: "вас не знают, открыли и закрыли." } },
  { id: 'j3', nom: { uz: 'To\'garakdagilar', ru: 'Ребята из кружка' }, bor: 11, tez: { uz: "haftada uch marta ko'rishadi", ru: 'видятся три раза в неделю' }, eshitdi: 11, ochdi: 9, ishlatdi: 7, sabab: { uz: 'haftada uch marta uchrashadi, bir-biriga eslatadi.', ru: "встречаются три раза в неделю, напоминают друг другу." } },
  { id: 'j4', nom: { uz: "E'lon taxtasini o'qiydiganlar", ru: "Те, кто читает доску объявлений" }, bor: 300, tez: { uz: "faqat o'tib ketayotganda ko'rishadi", ru: 'видятся только мимоходом' }, eshitdi: 300, ochdi: 12, ishlatdi: 1, sabab: { uz: "o'qidi va o'tib ketdi, eslatadigan odam yo'q.", ru: "прочитали и прошли мимо, напомнить некому." } },
];
// §134: s4 dagi indigo-narvon shu yerda ham ishlaydi — lekin RANG faqat «qanchalik tez-tez
// ko'rishadi» yorlig'ining O'Z so'zlariga yopishtirilgan (chip ichidagi matn = legendasi).
// Karta-tanasi bo'yalmaydi: tanlov o'quvchining O'QIB tanlashi bilan qolsin.
const TEZLIK = { j1: 'z3', j3: 'z2', j2: 'z1', j4: 'z1' };
// 1-o'qish tuzatishi: yakun-xulosa uchun so'z-sanoq (bosilgan joy soniga qarab).
const JOY_SONI = { uz: ['bitta', 'ikkita', 'uchta', "to'rtta"], ru: ['одной группы', 'двух групп', 'трёх групп', 'четырёх групп'] };
const pastBosh = (t) => `${String(t).charAt(0).toLowerCase()}${String(t).slice(1)}`;
const QADAM = [
  { k: 'eshitdi', nom: { uz: 'eshitdi', ru: 'услышали' } },
  { k: 'ochdi', nom: { uz: 'ochdi', ru: 'открыли' } },
  { k: 'ishlatdi', nom: { uz: 'ishlatdi', ru: 'пользуются' } },
];
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [reduce] = useState(() => { try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch { return false; } });
  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) { try { savedRef.current = JSON.parse(localStorage.getItem(QUVUR_KEY) || 'null') || {}; } catch { savedRef.current = {}; } }
  const [bosilgan, setBosilgan] = useState(() => (Array.isArray(savedRef.current.bosilgan) ? savedRef.current.bosilgan : []));
  const [run, setRun] = useState(null);
  // 400-belgi qoidasi (9-qonun): ekran ikki bosqichda — topshiriq (mentor + qoida) va ish
  // (to'rt joy). Bir vaqtda faqat bittasi turadi; qaytib kirgan o'quvchi ish-bosqichiga tushadi.
  const [faza, setFaza] = useState(() => (Array.isArray(savedRef.current.bosilgan) && savedRef.current.bosilgan.length ? 'ish' : 'brief'));
  const [yordamOpen, setYordamOpen] = useState(false);
  const [kamKordi, setKamKordi] = useState(false);
  const achMiss = useContext(AchMissCtx);
  const yigildi = bosilgan.reduce((s, id) => s + (QUVUR.find(q => q.id === id) || { ishlatdi: 0 }).ishlatdi, 0);
  const done = yigildi >= MAQSAD;
  useEffect(() => { try { localStorage.setItem(QUVUR_KEY, JSON.stringify({ bosilgan, yigildi })); } catch {} }, [bosilgan, yigildi]);
  // Uch qadam ketma-ket: eshitdi → ochdi → ishlatdi (har qadam ~0,6 s)
  useEffect(() => {
    if (!run) return;
    if (run.step >= QADAM.length) {
      const t = setTimeout(() => { setBosilgan(p => (p.includes(run.id) ? p : [...p, run.id])); setRun(null); }, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setRun(r => (r ? { ...r, step: r.step + 1 } : r)), 600);
    return () => clearTimeout(t);
  }, [run]);
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      onAnswer(screen, { stage: 'quvur', screenIdx: screen, bosilgan, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'quvur', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  const bosish = (q) => {
    if (isMentor || run || bosilgan.includes(q.id) || done) return;
    if (q.ishlatdi <= 2) { setKamKordi(true); if (achMiss) achMiss.miss(screen); } // M3 (19.09): odam kam beradigan joy — xato urinish (151-qonun)
    if (reduce) { setBosilgan(p => [...p, q.id]); return; }
    setRun({ id: q.id, step: 0 });
  };
  const qTurn = useTurnHint(faza === 'ish' && !done && !run && !isMentor);
  const briefTurn = useTurnHint(faza === 'brief' && !isMentor);
  const oxirgi = bosilgan.length ? QUVUR.find(q => q.id === bosilgan[bosilgan.length - 1]) : null;
  const xulRef = useRef(null);
  useEffect(() => {
    if (!done || !xulRef.current) return;
    const kam = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const t = setTimeout(() => { if (xulRef.current) xulRef.current.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'nearest' }); }, 320);
    return () => clearTimeout(t);
  }, [done]);
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : faza === 'brief' ? tr({ uz: "Topshiriqni o'qing", ru: "Прочитайте задание" }) : yigildi === 0 ? tr({ uz: 'Bitta guruhni bosing', ru: "Нажмите на одну группу" }) : tr({ uz: `Yigirmagacha ${MAQSAD - yigildi} odam qoldi`, ru: `До двадцати осталось: ${MAQSAD - yigildi}` });
  const bigBosilgan = bosilgan.includes('j2');
  // 🔴 Yakun o'quvchi HAQIQATDA bosgan joylardan yig'iladi: nechta joy bosgan bo'lsa —
  // o'shancha, sonlar ham o'sha joylarniki. Oldindan yozilgan natija-matni YO'Q.
  const olinganlar = bosilgan.map(id => QUVUR.find(x => x.id === id)).filter(Boolean);
  const nechtaJoy = tr(JOY_SONI)[olinganlar.length - 1] || tr({ uz: `${olinganlar.length} ta`, ru: `${olinganlar.length} групп` });
  const joySoz = olinganlar.map(q => `${pastBosh(tr(q.nom))} ${q.ishlatdi}`).join(', ');
  return (
    <Stage eyebrow={tr({ uz: "Sinov · to'rt guruh", ru: "Испытание · четыре группы" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(9px,1.4vw,14px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Yigirmata odamni iloji boricha <span className="italic" style={{ color: T.accent }}>kam guruhdan</span> yig'ing.</>, ru: <>Соберите двадцать человек, взяв <span className="italic" style={{ color: T.accent }}>как можно меньше групп</span>.</> })}</h2></div>
        {faza === 'brief' && <Mentor>{tr({ uz: "To'rt guruh bor. Bittasini bosing — o'sha guruhdan nechta odam botni ishlatgani ko'rinadi.", ru: "Есть четыре группы. Нажмите на одну — увидите, сколько человек из этой группы пользуются ботом." })}</Mentor>}
        <div className={`qsum fade-up${done ? ' done' : ''}`}>
          <span className="qsum-lbl">{tr({ uz: "Yig'ildi", ru: 'Собрано' })}</span>
          <span className="qsum-track"><i style={{ width: `${Math.min(100, Math.round((yigildi / MAQSAD) * 100))}%` }} /></span>
          <b className="mono">{yigildi} / {MAQSAD}</b>
        </div>
        {faza === 'brief' && (
          <div className="klaunch qbrief fade-up delay-1">
            <p className="cmt-b">{tr({ uz: "Har odam botga uch qadamda keladi: eshitdi → ochdi → ishlatdi. Yigirmaga yetguncha guruh tanlang.", ru: "Каждый человек приходит к боту за три шага: услышал → открыл → пользуется. Выбирайте группы, пока не наберётся двадцать." })}</p>
            <button type="button" className={`kod-launch-btn${briefTurn ? ' turn-ring' : ''}`} onClick={() => setFaza('ish')}>{tr({ uz: "To'rt guruhni ko'rish ▸", ru: "Посмотреть четыре группы ▸" })}</button>
          </div>
        )}
        {!done && <AchRule screen={screen} />}
        {/* F-1002-72: to'rt karta bir qatorda, butun kenglikda. Bosilgan kartada uch qadam qisqarib boradigan
            chiziq bo'lib chiziladi (eshitdi → ochdi → ishlatdi, oxirgisi yashil), sababi shu kartaning o'zida.
            O'ng ustun (sabab-qatorlar, «+13» chip-qatori) olindi — bir raqam bir joyda turadi. */}
        {faza === 'ish' && (<>
          <div className="qgrid q4">
            {QUVUR.map((q, i) => {
              const ochilgan = bosilgan.includes(q.id);
              const yuryapti = run && run.id === q.id;
              return (
                <button key={q.id} type="button" disabled={isMentor || !!run || ochilgan || done}
                  className={`qc${ochilgan ? ' on' : ''}${yuryapti ? ' live' : ''}${!ochilgan && !run && !done ? waveCls(qTurn, i, QUVUR.length) : ''}`}
                  onClick={() => bosish(q)}>
                  <span className="qc-h">{tr(q.nom)}</span>
                  <span className="qc-row"><b className="mono">{q.bor}</b> {tr({ uz: 'odam', ru: 'чел.' })}</span>
                  <span className={`qc-row tez ${TEZLIK[q.id]}`}><b>{tr(q.tez)}</b></span>
                  {(ochilgan || yuryapti) && (
                    <span className="qfun">
                      {QADAM.map((st, k) => {
                        const ko = ochilgan || (yuryapti && run.step > k);
                        const w = Math.max(6, Math.round(Math.sqrt(q[st.k] / q.bor) * 100));
                        return <span key={st.k} className={`qf-r${k === 2 ? ' last' : ''}${ko ? ' on' : ''}`}><span className="qf-l">{tr(st.nom)}</span><span className="qf-t"><i style={{ width: ko ? `${w}%` : 0 }} /></span><b className="mono">{ko ? q[st.k] : '·'}</b></span>;
                      })}
                      {ochilgan && <span className="qf-why">{tr(q.sabab)}</span>}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {/* YORDAM ekran boshida turmaydi — faqat birinchi kam natijadan keyin ochiladi */}
          {kamKordi && !done && (
            <div className={`wsx ${yordamOpen ? 'open' : ''}`}>
              <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })} {yordamOpen ? '▾' : '›'}</button>
              {yordamOpen && <div className="wsx-body"><p>{tr({ uz: 'Ikki savol bering: bu odamlar bir-birini taniydimi?', ru: 'Задайте два вопроса: эти люди знают друг друга?' })}</p><p>{tr({ uz: "Ular bir-birini haftada necha marta ko'radi?", ru: 'Сколько раз в неделю они видят друг друга?' })}</p></div>}
            </div>
          )}
          {done && (
            <span className="done-mini fade-step" ref={xulRef}>{tr({ uz: <>{yigildi} odam {nechtaJoy} guruhdan yig'ildi</>, ru: <>Собрано {yigildi} человек из {nechtaJoy}</> })} <span className="dm-sub">— {joySoz}{bigBosilgan ? tr({ uz: ' · 1200 odamdan atigi 2 tasi', ru: ' · из 1200 человек всего 2' }) : ''}</span></span>
          )}
          <StudentPracticePulse live={live} screen={screen} />
          <MentorPracticeStats live={live} screen={screen} label={{ uz: "Yigirmani yig'ganlar", ru: "Собрали двадцать" }} />
        </>)}
        <MentorNote>{tr({ uz: "Eng ko'p bosiladigan guruh — 1200 odamli guruh. Uch qadam ochilgach so'rang: 1200 odam eshitdi, ishlatgani 2 ta — qolgan 1198 tasi qayerda qoldi? Sinf ish-tartibi: juftlikda har o'quvchi sherigining uchta guruhini o'qib, har biriga «bu odamlar bir-birini haftada necha marta ko'radi?» deb so'raydi; javob topilmasa — guruh qayta yoziladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: "Чаще всего нажимают группу на 1200 человек. Когда откроются три шага, спросите: 1200 человек услышали, пользуются 2 — где остались остальные 1198? Порядок работы в классе: в паре каждый ученик читает три группы напарника и про каждую спрашивает: «сколько раз в неделю эти люди видят друг друга?»; если ответа нет — группа переписывается. Эту работу выполняют ученики, вы наблюдаете; «Продолжить» для вас открыто." })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — KODING: KOMPILYATOR (26/82/87-qonun · R1 navbati) =====
// Sof JS: brauzer-ko'rinishi YO'Q, natija faqat chiqqan qatorlarda.
// 🔴 18-ov: boshlang'ich kod ishga tushganda BIRORTA shart bajarilmaydi (for ichi bo'sh,
//    oxirgi shart yozilmagan). Uchala shart ham XULQ-ATVORDA tekshiriladi — muqobil
//    yozilgan to'g'ri yechim ham o'tadi, yodlangan javob esa to'xtaydi.
// 🔴 §69 (jim zaxira): ro'yxat o'quvchining uch joyidan to'ldiriladi; kalit bo'lmasa
//    uchta namuna-joy turadi — «saqlanmagan» kabi matn YO'Q.
const KODING_KEY = 'pm-m5d2-code';
const readKoding = () => { try { const v = JSON.parse(localStorage.getItem(KODING_KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const writeKodingOpen = (open) => { try { const p = readKoding() || {}; localStorage.setItem(KODING_KEY, JSON.stringify({ ...p, open })); } catch {} };
// §135: kod-satrlari QO'SHTIRNOQDA — o'quvchi yozgan guruh nomidagi apostrof kodni sindirmaydi.
// v2 (🔴 FAKT): zaxirada nom `tr(d.nom)` bilan satr bo'lib tushadi (avval obyekt → JSON chiqardi);
//    zaxira bo'lsa 2-izoh qatori boshqacha (`demo` belgisi). Kodda `joylar/joy` → `guruhlar/nom`.
const kodStarter = (rows, demo) => `// yigirma.js — birinchi yigirmata foydalanuvchini sanaydigan kod
${demo ? "// Ro'yxatda namunadagi uchta guruh turibdi." : "// Ro'yxat siz yozgan uchta guruhdan to'ldirildi."}
const guruhlar = [
  { nom: ${JSON.stringify(rows[0].nom)}, nechta: ${rows[0].nechta} },
  { nom: ${JSON.stringify(rows[1].nom)}, nechta: ${rows[1].nechta} },
  { nom: ${JSON.stringify(rows[2].nom)}, nechta: ${rows[2].nechta} }
];

let jami = 0;

for (let i = 0; i < guruhlar.length; i++) {
  // 1) shu guruh uchun bitta qator chiqaring: console.log ichida guruh nomi va nechta odam
  // 2) jami ga shu guruhning odam sonini qo'shing
}

// 3) jami 20 dan kam bo'lsa: "Yana ... odam kerak"
//    aks holda:              "Yigirmata odam bor"`;
const kodStarterFor = () => {
  const mine = readJoylar();
  return mine
    ? kodStarter(mine.map(r => ({ nom: r.joy, nechta: r.nechta })), false)
    : kodStarter(DEMO_JOY.map(d => ({ nom: tr(d.nom), nechta: d.n })), true);
};
// Xulq-atvor shartlari: chiqqan qatorlar bo'yicha tekshiriladi (manba-regex sanog'i EMAS).
const JAMI_EXPR = 'var s=0;for(var i=0;i<guruhlar.length;i++){s+=guruhlar[i].nechta;}';
const KOD_REQS = [
  {
    id: 'qatorlar', label: { uz: 'Har guruh uchun bitta qator chiqadi', ru: "Для каждой группы выводится одна строка" },
    check: C.evalEquals(`(function(){${JAMI_EXPR}return logs.length>=3 && guruhlar.every(function(j){return joined.indexOf(j.nom)!==-1;});})()`, 'true',
      { uz: "Uchala guruh nomi uchta alohida qatorda chiqsin — har guruh uchun console.log yozing", ru: "Названия всех трёх групп должны выйти в трёх отдельных строках — напишите console.log для каждой группы" })
  },
  {
    id: 'jami', label: { uz: 'Jami son chiqadi', ru: 'Выводится общее число' },
    check: C.evalEquals(`(function(){${JAMI_EXPR}return jami===s && joined.indexOf(""+s)!==-1;})()`, 'true',
      { uz: "jami ga har guruhning sonini qo'shing va oxirida uni chiqaring", ru: "Прибавьте к jami число людей каждой группы и в конце выведите его" })
  },
  {
    id: 'yetdimi', label: { uz: "Oxirgi qator: yigirmaga yetdi yoki yana nechta odam kerak", ru: 'Последняя строка: набралось ли двадцать или сколько ещё человек нужно' },
    check: C.evalEquals(`(function(){${JAMI_EXPR}var t=joined.toLowerCase();if(s<20){return t.indexOf(""+(20-s))!==-1 && (t.indexOf("kerak")!==-1||t.indexOf("\u043d\u0443\u0436\u043d\u043e")!==-1);}return t.indexOf("yigirmata odam bor")!==-1||t.indexOf("\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044c \u0447\u0435\u043b\u043e\u0432\u0435\u043a \u0435\u0441\u0442\u044c")!==-1;})()`, 'true',
      { uz: 'Oxirgi shart: kam bo\'lsa "Yana ... odam kerak", aks holda "Yigirmata odam bor"', ru: 'Последнее условие: если мало — выведите "Нужно ещё ... человек", иначе — "Двадцать человек есть"' })
  },
];
// Darvoza-mashq (82e): uchala variant ham bir turdagi chiqish-qatori, farq faqat ma'noda.
const GATE_ITEMS = [
  { id: 'g1', t: { uz: 'Jami: 24 odam · Yana 4 odam kerak', ru: 'Всего: 24 человека · Нужно ещё 4 человека' }, ok: false },
  { id: 'g2', t: { uz: 'Jami: 24 odam · Yigirmata odam bor', ru: 'Всего: 24 человека · Двадцать человек есть' }, ok: true },
  { id: 'g3', t: { uz: 'Jami: 20 odam · Yigirmata odam bor', ru: 'Всего: 20 человек · Двадцать человек есть' }, ok: false },
];
const ScreenCoding = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [saved] = useState(() => readKoding());
  const [starter] = useState(() => kodStarterFor());
  const [task] = useState(() => ({
    eyebrow: { uz: 'Koding · odamlarni sanaymiz', ru: 'Кодинг · считаем людей' },
    title: { uz: 'Odamlarni sanaydigan kod', ru: 'Код, который считает людей' },
    brief: { uz: <>Ro'yxat bo'ylab yuring: console.log ichida guruh nomi va odam soni, sonni <b>jami</b> ga qo'shing, oxirida — «Yigirmata odam bor» yoki «Yana ... odam kerak».</>, ru: <>Пройдитесь по списку: в console.log название группы и число людей, прибавьте число к <b>jami</b>, в конце — «Двадцать человек есть» или «Нужно ещё ... человек».</> },
    files: [{ name: 'yigirma.js', lang: 'js', starter, placeholder: { uz: '// shu guruh uchun bitta qator chiqaring', ru: "// выведите одну строку для этой группы" } }],
    requirements: KOD_REQS,
  }));
  const [open, setOpen] = useState(() => !!(saved && saved.open));
  const [gpick, setGpick] = useState(() => (saved && saved.gpick) || null);
  const [miss, setMiss] = useState(null);
  const [missedOnce, setMissedOnce] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  const missT = useRef(null);
  const [st, setSt] = useState(() => ({
    code: (typeof storedAnswer?.code === 'string' ? storedAnswer.code : null) || (saved && saved.code) || starter, // F-0914-10: saqlangan javob matn bo'lmasa — zaxira-zanjir (oq ekran himoyasi)
    done: !!(storedAnswer && storedAnswer.solved) || !!(saved && saved.done),
  }));
  const { code, done } = st;
  useEffect(() => () => clearTimeout(missT.current), []);
  const stage2 = !!gpick || isMentor || done;
  const openHint = useTurnHint(stage2 && !done && !open && !isMentor);
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  const pickGate = (g) => {
    if (stage2) return;
    if (g.ok) {
      setGpick(g.id);
      try { localStorage.setItem(KODING_KEY, JSON.stringify({ ...(readKoding() || {}), gpick: g.id })); } catch {}
    } else {
      setMiss(g.id);
      setMissedOnce(true);
      clearTimeout(missT.current);
      missT.current = setTimeout(() => setMiss(null), 600);
    }
  };
  const finishPractice = ({ codes, code: oneCode }) => {
    const newCode = (codes && codes['yigirma.js']) || oneCode || code;
    setOpen(false);
    setSt({ code: newCode, done: true });
    try { localStorage.setItem(KODING_KEY, JSON.stringify({ ...(readKoding() || {}), code: newCode, done: true, open: false })); } catch {}
    if (!done) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code: newCode, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  };
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: 'Avval kod-savolini yeching', ru: "Сначала решите вопрос по коду" }) : tr({ uz: 'Kodni yozing', ru: "Напишите код" });
  return (
    <Stage eyebrow={tr({ uz: 'Koding · kod oynasi', ru: "Кодинг · окно кода" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.5vw,15px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Odamlarni sanaydigan <span className="italic" style={{ color: T.accent }}>kod</span> yozamiz.</>, ru: <>Пишем <span className="italic" style={{ color: T.accent }}>код</span>, который считает людей.</> })}</h2></div>
        {!stage2 ? (
          <>
            <Mentor>{tr({ uz: 'Avval bitta savol, keyin kodni yozasiz.', ru: "Сначала один вопрос, потом вы напишете код." })}</Mentor>
            <p className="cmt-rule fade-up">{tr({ uz: "Kod uchta guruhning odam sonini qo'shadi. Jami 20 dan kam bo'lsa — «Yana ... odam kerak», aks holda — «Yigirmata odam bor» deb yozadi.", ru: "Код складывает число людей в трёх группах. Если всего меньше 20 — пишет «Нужно ещё ... человек», иначе — «Двадцать человек есть»." })}</p>
            <div className={`cmt hunt${missedOnce ? ' calm' : ''}`}>
              <span className="cmt-lbl">{tr({ uz: 'Uchta guruhda 13, 7 va 4 odam bor. Kod nima chiqaradi?', ru: "В трёх группах 13, 7 и 4 человека. Что выведет код?" })}</span>
              <div className="gt-rows">
                {GATE_ITEMS.map(g => (
                  <button key={g.id} type="button" className={`fchoice${miss === g.id ? ' miss' : ''}`} onClick={() => pickGate(g)}>{tr(g.t)}</button>
                ))}
              </div>
              {missedOnce && <p className="cmt-tip">{tr({ uz: "Ikki narsani alohida sanang: uchta son qo'shilsa nechta bo'ladi va u yigirmadan kammi?", ru: "Посчитайте две вещи отдельно: сколько будет, если сложить три числа, и меньше ли это двадцати?" })}</p>}
            </div>
          </>
        ) : (
          <>
            <Mentor>{tr({ uz: "Uchta guruhingiz kodda ro'yxat bo'lib turibdi. Sizga sanash va bitta shart qoladi.", ru: "Ваши три группы уже стоят в коде списком. Вам остаётся посчитать и написать одно условие." })}</Mentor>
            <div className="cmt-fold fade-step"><span className="cmt-done">{tr({ uz: '✓ 13 + 7 + 4 = 24 — yigirmadan kam emas', ru: '✓ 13 + 7 + 4 = 24 — не меньше двадцати' })}</span></div>
            <div className="split kod">
              <Col gap={10}>
                <div className={`kdpanel${done ? ' is-done' : ''}`}>
                  <p className="flow-label">{tr({ uz: 'Kod nima chiqarsin', ru: 'Что должен вывести код' })}</p>
                  <ol className="kdreq">
                    {KOD_REQS.map(r => <li key={r.id}>{tr(r.label)}</li>)}
                  </ol>
                  <div className={`wsx star ${yordamOpen ? 'open' : ''}`}>
                    <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })} {yordamOpen ? '▾' : '›'}</button>
                    {yordamOpen && <div className="wsx-body">
                      <p>{tr({ uz: <>Qatorni <code className="qcode">console.log(...)</code> ekranga chiqaradi. Bittasidan boshlang: <code className="qcode">console.log(guruhlar[0].nom)</code>.</>, ru: <>Строку на экран выводит <code className="qcode">console.log(...)</code>. Начните с одной: <code className="qcode">console.log(guruhlar[0].nom)</code>.</> })}</p>
                      <p>{tr({ uz: <>Ishlagach, shu guruhning sonini <code className="qcode">jami</code> ga qo'shing.</>, ru: <>Когда заработает, прибавьте число людей этой группы к <code className="qcode">jami</code>.</> })}</p>
                      <p>{tr({ uz: "Qo'shimcha: eng ko'p odam beradigan guruhning nomini alohida qatorda chiqaring.", ru: "Дополнительно: выведите отдельной строкой название группы, которая даёт больше всего людей." })}</p>
                    </div>}
                  </div>
                  {done && <div className="done-mini fade-step">{tr({ uz: <>Kod uchta guruhni sanab berdi: <span className="dm-sub">jami son va yigirma sharti chiqdi.</span></>, ru: <>Код посчитал три группы: <span className="dm-sub">вышли общее число и условие про двадцать.</span></> })}</div>}
                </div>
                <StudentPracticePulse live={live} screen={screen} />
                <MentorPracticeStats live={live} screen={screen} label={{ uz: "Kodni yozib bo'lganlar", ru: "Дописали код" }} />
              </Col>
              <Col gap={10}>
                <div className="klaunch">
                  <span className="klaunch-lbl">{tr({ uz: 'Uchta guruh — bitta hisob', ru: "Три группы — один подсчёт" })}</span>
                  <button className={`kod-launch-btn${openHint ? ' turn-ring' : ''}`} onClick={() => { setOpen(true); writeKodingOpen(true); }}>
                    {done ? tr({ uz: '↻ Kod oynasini qayta ochish', ru: "↻ Открыть окно кода снова" }) : tr({ uz: 'Kod oynasini ochish', ru: "Открыть окно кода" })}
                  </button>
                  {done && <span className="klaunch-sub">{tr({ uz: "Bajarildi — xohlasangiz kodni yana o'zgartirib ko'ring", ru: "Выполнено — если хотите, попробуйте ещё изменить код" })}</span>}
                </div>
              </Col>
            </div>
          </>
        )}
        <MentorNote>{tr({ uz: "Ro'yxat o'quvchining o'z uchta guruhi bilan to'ldirilgan bo'ladi. Sonlar har kimda har xil — natija ham har xil chiqadi, bu to'g'ri. Kod shu oynada yoziladi, 10 daqiqa yetadi; ulgurmagan o'quvchi uyga qisqa variantni oladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: "Список будет заполнен тремя группами самого ученика. Числа у всех разные — и результат выйдет разный, это правильно. Код пишется в этом окне, 10 минут хватит; кто не успел, получает домой короткий вариант. Эту работу выполняют ученики, вы наблюдаете; «Продолжить» для вас открыто." })}</MentorNote>
      </div>
      {/* To'liq-ekran qobiq (18-ov (a)): `.lesson-root` da `zoom: var(--lz)` bor, `.hc-root` ham
          o'zi `zoom: var(--lz)` qo'yadi — keng ekranda kattalashuv lz² ga chiqib, shart-chiplari va
          «Davom etish» ekrandan chiqib ketardi. Qobiq tashqi zoomni bekor qiladi. */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={task} starterCode={code || starter} storageKey={`${KODING_KEY}:code`}
            onContinue={finishPractice} onBack={() => { setOpen(false); writeKodingOpen(false); }} />
        </div>
      )}
    </Stage>
  );
};
function PairTimer({ onStage, muted, solo, autoStart }) {
  const TOTAL = solo ? 30 : 60;
  const [st, setSt] = useState({ running: !!autoStart, left: TOTAL, done: false });
  const stage = st.running ? 'running' : (st.done ? 'done' : 'idle');
  useEffect(() => { if (onStage) onStage(stage); }, [stage]); // eslint-disable-line
  const startTurn = useTurnHint(!st.running && !st.done && !muted);
  useEffect(() => {
    if (!st.running) return;
    if (st.left <= 0) { setSt({ running: false, left: TOTAL, done: true }); return; }
    const t = setTimeout(() => setSt(p => ({ ...p, left: p.left - 1 })), 1000);
    return () => clearTimeout(t);
  }, [st.running, st.left, TOTAL]);
  const isA = solo ? true : st.left > 30;
  const phaseLeft = solo ? st.left : (isA ? st.left - 30 : st.left);
  const R = 34, C = 2 * Math.PI * R, frac = phaseLeft / 30;
  return (
    <div className={`pair-timer${solo && !st.running && !st.done ? ' bare' : ''}`}>
      {st.running ? (
        <div className="pair-live">
          <div className={`pair-ring ${isA ? 'a' : 'b'}`}>
            <svg width="82" height="82" viewBox="0 0 88 88" aria-hidden="true">
              <circle cx="44" cy="44" r={R} fill="none" stroke={T.line} strokeWidth="7" />
              <circle cx="44" cy="44" r={R} fill="none" stroke={isA ? T.accent : T.success} strokeWidth="7" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 44 44)" style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div className="pair-ring-mid">{!solo && <span className={`pair-ring-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span>}<span className="pair-ring-sec">{phaseLeft}s</span></div>
          </div>
          <div className="pair-live-txt">
            {solo
              ? <><span className="pair-now">{tr({ uz: 'Hozir ovoz chiqarib ayting', ru: 'Сейчас скажите вслух' })}</span><span className="pair-next">{tr({ uz: 'ekranga qaramasdan', ru: 'не глядя на экран' })}</span></>
              : <><span className="pair-now">{tr({ uz: <>Hozir <span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span> gapiradi</>, ru: <>Сейчас говорит <span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span></> })}</span><span className="pair-next">{isA ? tr({ uz: 'keyin — B navbati', ru: 'потом — очередь B' }) : tr({ uz: 'oxirgi navbat', ru: 'последняя очередь' })}</span></>}
          </div>
        </div>
      ) : (st.done || !solo) ? (
        <p className="pair-now" style={{ margin: 0 }}>{st.done
          ? (solo ? tr({ uz: "✓ Vaqt tugadi — aytib bo'ldingiz.", ru: "✓ Время вышло — вы рассказали." }) : tr({ uz: "✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz.", ru: "✓ Время вышло — вы оба рассказали." }))
          : tr({ uz: 'Har biringizga 30 soniyadan — avval A, keyin B.', ru: 'По 30 секунд каждому — сначала A, потом B.' })}</p>
      ) : null}
      <div className="pair-timer-btns">
        {!st.running && <button className={st.done ? 'btn-soft' : `pair-start${startTurn ? '' : ' calm'}`} onClick={() => setSt({ running: true, left: TOTAL, done: false })}>{st.done ? (solo ? tr({ uz: '↻ Yana 30 soniya', ru: '↻ Ещё 30 секунд' }) : tr({ uz: '↻ Yana 1 daqiqa', ru: '↻ Ещё 1 минута' })) : (solo ? tr({ uz: '▶ 30 soniyani boshlash', ru: '▶ Запустить 30 секунд' }) : tr({ uz: '▶ 1 daqiqani boshlash', ru: '▶ Запустить минуту' }))}</button>}
        {st.running && <button className="btn-soft" onClick={() => setSt({ running: false, left: TOTAL, done: false })}>{tr({ uz: "To'xtatish", ru: "Остановить" })}</button>}
      </div>
    </div>
  );
}
const REFLECT_KEY = 'pm-m5d2-reflection';
// v2 (A6): 1-qadam vaqti tugagach «✓ Aytdingiz» qatoriga yig'iladi (↻ bilan qayta aytiladi), shundan keyin 2-qadam ochiladi.
const S12_FOLD_MS = 1400;
const ScreenReflection = ({ screen, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  // Korpus §97: yolg'iz o'qiyotgan o'quvchida sherik YO'Q — ikki yo'l bir shakl, bir uzunlikda.
  const yakka = !live || live.mode === 'self';
  const [text, setText] = useState(() => { try { return localStorage.getItem(REFLECT_KEY) || ''; } catch { return ''; } });
  const save = (v) => { setText(v); try { localStorage.setItem(REFLECT_KEY, v); } catch {} };
  const written = text.trim().length >= 8;
  const [pairStage, setPairStage] = useState('idle');
  const [said, setSaid] = useState(written);
  const [unlocked, setUnlocked] = useState(written);
  const [again, setAgain] = useState(0);
  useEffect(() => {
    if (pairStage !== 'done' || said) return;
    const t = setTimeout(() => { setSaid(true); setUnlocked(true); }, S12_FOLD_MS);
    return () => clearTimeout(t);
  }, [pairStage, said]);
  const sayAgain = () => { setPairStage('running'); setAgain(n => n + 1); setSaid(false); };
  const [reflFocus, setReflFocus] = useState(false);
  const inputTurn = useTurnHint(unlocked && !written && !reflFocus);
  return (
    <Stage eyebrow={tr({ uz: 'Mustahkamlash · 2 qadam', ru: 'Закрепление · 2 шага' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext turnBusy={!written} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Tanish guruhingizni <span className="italic" style={{ color: T.accent }}>yoddan</span> ayta olasizmi?</>, ru: <>Сможете назвать свою группу знакомых <span className="italic" style={{ color: T.accent }}>по памяти</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: "Ekranga qaramasdan ikki narsani ayting: guruh nomi va undagi odamlar bir-birini haftada necha marta ko'radi.", ru: "Не глядя на экран, скажите две вещи: название группы и сколько раз в неделю люди в ней видят друг друга." })}</Mentor>
        <div className="rcp-flow one">
          {!said ? (
            <div className="rcp-step fade-up delay-1">
              <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">{yakka ? tr({ uz: 'Ovoz chiqarib ayting', ru: "Скажите вслух" }) : tr({ uz: 'Sherigingizga ayting', ru: "Скажите напарнику" })}</span></div></div>
              <PairTimer key={again} onStage={setPairStage} muted={written} solo={yakka} autoStart={again > 0} />
            </div>
          ) : (
            <div className="rcp-fold fade-step">
              <span className="rcp-fold-t">{tr({ uz: '✓ Aytdingiz', ru: "✓ Вы рассказали" })}</span>
              <button type="button" className="btn-soft rcp-again" onClick={sayAgain}>{yakka ? tr({ uz: '↻ Yana 30 soniya', ru: '↻ Ещё 30 секунд' }) : tr({ uz: '↻ Yana 1 daqiqa', ru: '↻ Ещё 1 минута' })}</button>
            </div>
          )}
          {unlocked && (
          <div className="rcp-step fade-step">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">{tr({ uz: 'Endi bir qator yozing', ru: "Теперь напишите одну строку" })}</span></div></div>
            <span className={`turn-wrap${inputTurn ? ' turn-ring' : ''}`}>
              <GrowInput className="reflect-input" value={text} onChange={e => save(e.target.value)} onFocus={() => setReflFocus(true)} onBlur={() => setReflFocus(false)} placeholder={tr({ uz: "Tanish guruhim — ..., ularni haftada ... marta ko'raman", ru: "Моя группа знакомых — ..., я вижу их ... раз в неделю" })} maxLength={160} />
            </span>
            {/* 106f(b): yozib bo'lgach bitta xulosa-gap («Bugungi qoida» qatori v2 da olindi — Yakundagi asosiy fikr bilan bir ma'no) */}
            {written && (
              <div className="rwd fade-step">
                <p className="rwd-t">{tr({ uz: "✓ Endi bilasiz: botni qurish — ishning yarmi, birinchi foydalanuvchilarni o'zingiz olib kelasiz.", ru: "✓ Теперь вы знаете: построить бота — половина дела, первых пользователей вы приведёте сами." })}</p>
              </div>
            )}
          </div>
          )}
        </div>
        <MentorNote>{tr({ uz: "Uchdan biri «haftada necha marta ko'radi» savoliga javob berolmasa — odamlar xaritasi ekranini qayta oching va birinchi halqa natijasini birga o'qing.", ru: 'Если треть класса не может ответить на вопрос «сколько раз в неделю видит» — снова откройте экран с картой людей и вместе прочитайте результат первого круга.' })}</MentorNote>
      </div>
    </Stage>
  );
};
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
    <div className="fc-done fade-up"><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{tr({ uz: <>{total}/{total} karta yodlandi</>, ru: <>Выучено карточек: {total}/{total}</> })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
  );
  return (
    <div className="fc fade-up">
      <div className="fc-top"><span className="fc-pill learn" key={`l-${queue.length}-${swapRef.current}`}>{tr({ uz: "↻ O'rganilmoqda ·", ru: '↻ Учим ·' })} <b>{queue.length}</b></span><span className="fc-pill knew" key={`k-${known}`}>{tr({ uz: '✓ Bildim ·', ru: '✓ Знаю ·' })} <b>{known}</b></span></div>
      <div className="fc-bar"><span className="fc-bar-fill" style={{ width: `${(known / total) * 100}%` }} /></div>
      <div className="fc-cardwrap">
        <div className={`fc-fly ${exiting === 'knew' ? 'out-knew' : ''} ${exiting === 'again' ? 'out-again' : ''}`} key={swapRef.current}>
          <div className={`fc-card ${flipped ? 'flip' : ''}`} onClick={() => !flipped && !exiting && setFlipped(true)} role="button" tabIndex={0}>
            <div className="fc-face fc-front"><span className="fc-q">{fmtCode(tr(card.front))}</span></div>
            <div className="fc-face fc-back"><span className={`fc-tag ${fcTier(tr(card.back))}`}>{tr(card.back)}</span></div>
          </div>
        </div>
      </div>
      {flipped
        ? (<div className="fc-actions"><button className="fc-btn again" disabled={!!exiting} onClick={() => advance(false)}>{tr({ uz: '✗ Takrorlash', ru: '✗ Повторить' })}</button><button className="fc-btn knew" disabled={!!exiting} onClick={() => advance(true)}>{tr({ uz: '✓ Bildim', ru: '✓ Знаю' })}</button></div>)
        : (<p className="fc-hint" />)}
    </div>
  );
}
const FLASHCARDS = [
  { front: { uz: 'Birinchi foydalanuvchilar kimlar?', ru: "Кто такие первые пользователи?" }, back: { uz: "Botingizni birinchi bo'lib ishlatadigan odamlar", ru: "Люди, которые первыми начнут пользоваться вашим ботом" } },
  { front: { uz: 'Tanish guruh nima?', ru: "Что такое группа знакомых?" }, back: { uz: "Sizni taniydigan, bir-birini tez-tez ko'radigan odamlar", ru: "Люди, которые вас знают и часто видят друг друга" } },
  { front: { uz: 'Tanish guruhda xabar nega tez tarqaladi?', ru: "Почему в группе знакомых новость расходится быстро?" }, back: { uz: 'Bittasi aytsa, qolganlar ham eshitadi', ru: "Скажет один — услышат и остальные" } },
  { front: { uz: "Katta guruhda odam ko'p — nega ishlatgani kam?", ru: 'В большой группе людей много — почему пользуются мало?' }, back: { uz: 'Ular sizni tanimaydi', ru: 'Они вас не знают' } },
  { front: { uz: 'Botga birinchi odamlarni kim olib keladi?', ru: 'Кто приводит к боту первых людей?' }, back: { uz: "Siz aytasiz — bot o'zi olib kelmaydi", ru: 'Вы рассказываете — бот сам не приводит' } },
  { front: { uz: "Bitta guruh haqida nimalarni yozib qo'yasiz?", ru: "Что вы записываете про одну группу?" }, back: { uz: 'Guruh nomi, unda kimlar borligi va odam soni', ru: "Название группы, кто в ней есть и сколько людей" } },
  { front: { uz: "Odam botga kelguncha qaysi uch qadamdan o'tadi?", ru: 'Какие три шага проходит человек, пока дойдёт до бота?' }, back: { uz: 'Eshitdi, ochdi, ishlatdi', ru: 'Услышал, открыл, пользуется' } },
  { front: { uz: 'Facebook sayti qayerdan boshlangan?', ru: 'С чего начался сайт Facebook?' }, back: { uz: 'Bitta universitetdan — boshqalar yozila olmasdi', ru: 'С одного университета — другие не могли зарегистрироваться' } },
  { front: { uz: 'Facebook butun dunyo uchun qachon ochilgan?', ru: "Когда Facebook открылся для всего мира?" }, back: { uz: 'Ikki yarim yildan keyin — 2006-yilda', ru: "Через два с половиной года — в 2006 году" } },
  { front: { uz: 'Facebook voqeasida nima ish bergan?', ru: 'Что сработало в истории Facebook?' }, back: { uz: 'Odam soni emas, odamlarning bir-birini tanishi', ru: 'Не число людей, а то, что люди знали друг друга' } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Проверьте</span> себя.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};
const ScreenFinalTest = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })} scope="final"
    ctaLabel={tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' })} revealPrefix={tr({ uz: "To'g'ri javob", ru: 'Верный ответ' })}
    question={<TestQ ask={tr({ uz: "Bot havolasi 900 notanish odamga yuborildi. Ertasiga nechta odam botni ishlatadi?", ru: 'Ссылку на бота отправили 900 незнакомым людям. Сколько человек будут пользоваться ботом на следующий день?' })} />}
    questionText={tr({ uz: "900 notanish odamga yuborilgan havoladan ertasiga nechta odam botni ishlatadi", ru: 'Сколько человек на следующий день будут пользоваться ботом по ссылке, отправленной 900 незнакомым' })}
    options={[tr({ uz: "Yigirmatadan ko'p — havolani ochadigan odam ko'p chiqadi", ru: 'Больше двадцати — открывших ссылку будет много' }), tr({ uz: "Bir-ikki odam — ochganlar ham ishlatmay qo'yadi", ru: "Один-два человека — даже открывшие перестанут пользоваться" }), tr({ uz: "Hech kim — bunday havolani odamlar ochmaydi", ru: 'Никто — такие ссылки люди не открывают' })]}
    correctIdx={1}
    explainCorrect={tr({ uz: "Notanish odam botni odatda ochib ko'radi va yopib qo'yadi.", ru: "Незнакомый человек обычно откроет бота, посмотрит и закроет." })}
    explainWrong={{
      0: tr({ uz: "Ochganlar bo'ladi, lekin ishlatmay qo'yadi: notanish odam botni odatda ochib ko'radi va yopadi.", ru: "Открывшие будут, но перестанут пользоваться: незнакомый человек обычно откроет бота, посмотрит и закроет." }),
      2: tr({ uz: "Havola yetib bordi, ochganlar ham bo'ldi — gap ochgandan keyin nima bo'lishida.", ru: 'Ссылка дошла, открывшие тоже нашлись — вопрос в том, что будет после открытия.' }),
      default: tr({ uz: "Katta notanish guruhdan bir-ikki odam qoladi — qolganlari ochsa ham ishlatmaydi.", ru: "Из большой незнакомой группы останутся один-два человека — остальные, даже если откроют, пользоваться не будут." })
    }}
  />
);

// ===== UYGA VAZIFA — alohida ekran EMAS, YAKUN sahifasi ichida (etalon: P0 · PmLesson2) =====
const HW_KEY = 'pm-m5d2-hw-target';
const HW_VARIANT = [
  { k: 'toliq', t: { uz: "To'liq · ~20 daqiqa", ru: 'Полный · ~20 минут' } },
  { k: 'qisqa', t: { uz: 'Qisqa · ~10 daqiqa', ru: 'Короткий · ~10 минут' } },
];
const HW_STEPS = {
  toliq: [{ uz: 'Har joy uchun alohida ro\'yxat oching', ru: 'Заведите отдельный список для каждого места' }, { uz: "O'sha joydan taniydigan odamlaringizning ismini yozing va har ism yoniga joyini belgilang", ru: 'Запишите имена знакомых вам людей из этого места и рядом с каждым именем отметьте место' }, { uz: 'Oxirida jami nechta ism chiqqanini sanang', ru: 'В конце посчитайте, сколько всего вышло имён' }],
  qisqa: [{ uz: 'Eng zich joyingizni tanlang', ru: 'Выберите своё самое тесное место' }, { uz: "O'sha joydan yettita ism yozing", ru: 'Запишите семь имён из этого места' }, { uz: "Har ism yoniga uni haftada necha marta ko'rishingizni qo'shing", ru: 'Рядом с каждым именем допишите, сколько раз в неделю вы видите этого человека' }],
};
const readHwTarget = () => { try { return localStorage.getItem(HW_KEY) || ''; } catch { return ''; } };
// Uy-vazifa kapsulasi fonidagi xira so'z-tokenlar — SHU darsning atamalari (§114)
const HW_TOKENS = [
  { t: { uz: 'guruh', ru: "группа" }, l: 5, tp: 16, s: 12, d: 6.5 },
  { t: { uz: 'tanish', ru: "знакомые" }, l: 80, tp: 12, s: 11, d: 7.5 },
  { t: { uz: 'odam', ru: 'человек' }, l: 12, tp: 70, s: 11, d: 8 },
  { t: { uz: 'halqa', ru: 'круг' }, l: 64, tp: 76, s: 12, d: 6 },
  { t: { uz: 'yigirma', ru: 'двадцать' }, l: 86, tp: 52, s: 10, d: 9 },
  { t: { uz: 'ochdi', ru: 'открыл' }, l: 36, tp: 8, s: 12, d: 7 },
  { t: { uz: 'ishlatdi', ru: 'пользуется' }, l: 3, tp: 44, s: 12, d: 8.5 },
];
const HwCard = ({ variant, onPick }) => {
  const steps = HW_STEPS[variant] || HW_STEPS.toliq;
  const pickTurn = useTurnHint(!variant && !!onPick);
  return (
    <div className="card fade-step">
      <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
      <p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "Uyda uchta joyingizdagi odamlarni ismma-ism yozib chiqasiz: maqsad — yigirmata ism. Qancha vaqtingiz bor — o'zingiz tanlaysiz.", ru: 'Дома вы выпишете поимённо людей из своих трёх мест: цель — двадцать имён. Сколько у вас времени — выбираете сами.' })}</p>
      <div className="hw-chips">
        {HW_VARIANT.map((v, vi) => (
          <button key={v.k} className={`hw-chip ${variant === v.k ? 'on' : ''}${waveCls(pickTurn, vi, HW_VARIANT.length)}`} onClick={() => onPick(v.k)}>{tr(v.t)}</button>
        ))}
      </div>
      {variant ? (
        <div className="pmtask fade-step">
          <div className="pmtask-head"><span className="pmtask-tag">{tr({ uz: 'Topshiriq kartasi', ru: "Карточка задания" })}</span><span className="pmtask-id">{variant === 'qisqa' ? tr({ uz: 'QISQA', ru: 'КОРОТКИЙ' }) : tr({ uz: "TO'LIQ", ru: 'ПОЛНЫЙ' })}</span></div>
          <div className="pmtask-rows">
            <div className="pmtask-row"><span className="pmtask-k">{tr({ uz: 'Nechta ism', ru: 'Сколько имён' })}</span><span className="pmtask-v"><b>{variant === 'qisqa' ? tr({ uz: 'yettita ism', ru: 'семь имён' }) : tr({ uz: 'yigirmata ism', ru: 'двадцать имён' })}</b></span></div>
            <div className="pmtask-row"><span className="pmtask-k">{tr({ uz: 'Qayerdan', ru: 'Откуда' })}</span><span className="pmtask-v"><b>{variant === 'qisqa' ? tr({ uz: 'eng zich joyingizdan', ru: 'из самого тесного места' }) : tr({ uz: 'uchala joyingizdan', ru: 'из всех трёх мест' })}</b></span></div>
            <div className="pmtask-row"><span className="pmtask-k">{tr({ uz: 'Muddat', ru: 'Срок' })}</span><span className="pmtask-v"><b>{tr({ uz: 'keyingi darsgacha', ru: 'до следующего урока' })}</b></span></div>
          </div>
          <div className="pmtask-steps">
            {steps.map((s, i) => <span key={i} className="pmtask-step"><i>{i + 1}</i>{tr(s)}</span>)}
          </div>
        </div>
      ) : (
        <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Avval variantni tanlang — topshiriq-karta shunga moslashadi.', ru: "Сначала выберите вариант — карточка задания подстроится под него." })}</p></div>
      )}
    </div>
  );
};
// ===== 🏅 NISHONLAR — 4 ta, faqat REAL tekshiriladigan harakatga =====
// Nishon tavsifi `{ uz, ru }` yoki oddiy satr bo'lishi mumkin (M3, 19.09: fullHouse ikki tilda) — tilga qarab chiqariladi
const achDesc = (d) => (d && typeof d === 'object' ? ((typeof __lang !== 'undefined' && __lang === 'ru' && d.ru) ? d.ru : d.uz) : d);
const ACHIEVEMENTS = {
  innerCircle: { icon: '🎯', name: 'Circle Explorer', desc: { uz: "Uch halqani ochib solishtirdingiz", ru: 'Вы открыли и сравнили три круга' } },
  twentyPlan: { icon: '🗂', name: 'Three Groups', desc: { uz: 'Uchta guruhni kimlar borligi va odam soni bilan yozdingiz', ru: "Вы записали три группы: кто в них и сколько людей" } },
  fullHouse: { icon: '👥', name: 'First Twenty', desc: { uz: "Yigirmata odamni ikki guruhdan yig'dingiz", ru: "Вы собрали двадцать человек из двух групп" } },
  headCount: { icon: '🧮', name: 'Head Counter', desc: { uz: 'Kodingiz uchta guruhdagi odamlarni sanab berdi', ru: "Ваш код посчитал людей в трёх группах" } },
};
const ACH_TRIGGERS = { s4: 'innerCircle', s8: 'twentyPlan', s9: 'fullHouse', s10: 'headCount' };

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
    : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: "Справитесь с первой попытки — значок ваш." })}</p>;
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
          <span className="acu-name">{tr(ach.name)}</span>
          {ach.desc && <span className="acu-desc">{achDesc(ach.desc)}</span>}
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
// Podium savol yorliqlari (scored indekslar 3/5/7/11)
const Q_LABELS = { 3: { uz: '1 — Bot va odam', ru: '1 — Бот и человек' }, 5: { uz: '2 — Tanish va notanish', ru: '2 — Знакомые и незнакомые' }, 7: { uz: '3 — Bitta universitet', ru: "3 — Один университет" }, 11: { uz: '4 — Yakuniy savol', ru: '4 — Итоговый вопрос' } };
const QUIZ_MS = 15000;
// §114: arena-fon so'zlari SHU darsning lug'atidan.
const QZ_BG_SHAPES = [
  { ch: { uz: 'guruh', ru: "группа" }, l: 5, t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'tanish', ru: "знакомые" }, l: 85, t: 8, s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'odam', ru: 'человек' }, l: 8, t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'halqa', ru: 'круг' }, l: 74, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: { uz: 'yigirma', ru: 'двадцать' }, l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: 'eshitdi', ru: 'услышал' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'ochdi', ru: 'открыл' }, l: 26, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: { uz: 'ishlatdi', ru: 'пользуется' }, l: 55, t: 5, s: 20, d: 22, dl: 0.6 },
];
// ⚔️ CodeStrike — 12 savol · 3/3/3/3 · to'g'ri indekslar 0,3,2,1 · 1,0,2,3 · 0,2,1,3.
// darslik-jonli TASDIQLAYDI. Har savol darsda AYTILGAN ekranga bog'langan (65-qonun).
const QUIZ_BANK = [
  { q: { uz: 'Birinchi foydalanuvchilar kimlar?', ru: "Кто такие первые пользователи?" }, opts: [{ uz: "Botni birinchi bo'lib ishlatadigan odamlar", ru: "Люди, которые первыми пользуются ботом" }, { uz: "Botni yaratishga yordam bergan odamlar", ru: "Люди, которые помогли создать бота" }, { uz: "Botga faqat bir marta yozgan odamlar", ru: "Люди, которые написали боту только раз" }, { uz: "Bot haqida faqat eshitgan odamlar", ru: "Люди, которые только слышали о боте" }], correct: 0 },
  { q: { uz: 'Botga birinchi odamlarni kim olib keladi?', ru: 'Кто приводит к боту первых людей?' }, opts: [{ uz: "Telegram — u yangi botlarni hammaga aytib turadi", ru: 'Telegram — он всем рассказывает о новых ботах' }, { uz: "Qidiruv — bot qidiruvda o'zi yuqoriga chiqadi", ru: 'Поиск — бот сам поднимается наверх в поиске' }, { uz: "Bot — u yozilgan kuni odamlarni chaqiradi", ru: 'Бот — в день создания он сам зовёт людей' }, { uz: "Siz — birinchi odamlarga o'zingiz aytasiz", ru: 'Вы — первым людям вы рассказываете сами' }], correct: 3 },
  { q: { uz: 'Tanish guruhda xabar nega tez tarqaladi?', ru: "Почему в группе знакомых новость расходится быстро?" }, opts: [{ uz: "Chunki u yerda odam soni eng ko'p", ru: 'Потому что там больше всего людей' }, { uz: "Chunki xabarni u yerda bot o'zi aytadi", ru: 'Потому что там новость рассказывает сам бот' }, { uz: "Chunki u yerdagilar bir-birini tez-tez ko'radi", ru: "Потому что люди там часто видят друг друга" }, { uz: "Chunki u yerdagilar bir-birini izlab yuradi", ru: "Потому что люди там ищут друг друга" }], correct: 2 },
  { q: { uz: "Uch halqadan qaysi biri ko'proq odam berdi?", ru: 'Какой из трёх кругов дал больше людей?' }, opts: [{ uz: 'Sizni tanimaydiganlar halqasi', ru: 'Круг тех, кто вас не знает' }, { uz: "Har kuni ko'rishadiganlar halqasi", ru: 'Круг тех, кто видится каждый день' }, { uz: "Ba'zan ko'rishadiganlar halqasi", ru: 'Круг тех, кто видится иногда' }, { uz: 'Uchala halqa ham bir xil odam berdi', ru: 'Все три круга дали одинаково людей' }], correct: 1 },
  { q: { uz: "Katta guruhda odam ko'p — nega ishlatgani kam?", ru: 'В большой группе людей много — почему пользуются мало?' }, opts: [{ uz: 'Chunki katta guruhda bot ochilmaydi', ru: 'Потому что в большой группе бот не открывается' }, { uz: 'Chunki u yerdagilar sizni tanimaydi', ru: 'Потому что люди там вас не знают' }, { uz: 'Chunki xabar u yerga umuman yetmaydi', ru: 'Потому что новость туда вообще не доходит' }, { uz: 'Chunki bot u yerda sekin ochiladi', ru: 'Потому что бот там медленно открывается' }], correct: 1 },
  { q: { uz: 'Xabar qaysi guruhdan tez tarqaladi?', ru: "Из какой группы новость расходится быстрее?" }, opts: [{ uz: "Har kuni ko'rishadigan guruhdan — ular bir-biriga aytadi", ru: "Из группы, где видятся каждый день, — там рассказывают друг другу" }, { uz: "Har kuni ko'rishadigan guruhdan — odam soni ko'p", ru: "Из группы, где видятся каждый день, — там много людей" }, { uz: "Bir-birini tanimaydigan guruhdan — odam soni ko'p", ru: "Из группы, где друг друга не знают, — там много людей" }, { uz: 'Bir-birini tanimaydigan guruhdan — ular bir-biriga aytadi', ru: "Из группы, где друг друга не знают, — там рассказывают друг другу" }], correct: 0 },
  { q: { uz: "Odam botga kelguncha qaysi uch qadamdan o'tadi?", ru: 'Какие три шага проходит человек, пока дойдёт до бота?' }, opts: [{ uz: 'Qidirdi, topdi, yozdi', ru: 'Искал, нашёл, написал' }, { uz: 'Ochdi, ishlatdi, eshitdi', ru: 'Открыл, пользуется, услышал' }, { uz: 'Eshitdi, ochdi, ishlatdi', ru: 'Услышал, открыл, пользуется' }, { uz: "Ko'rdi, yozdi, o'chirdi", ru: 'Увидел, написал, удалил' }], correct: 2 },
  { q: { uz: 'Facebook sayti 2004-yilda qayerda ochilgan?', ru: 'Где открылся сайт Facebook в 2004 году?' }, opts: [{ uz: "Butun dunyoda — istagan odam yozila olardi", ru: 'По всему миру — мог зарегистрироваться кто угодно' }, { uz: "Ikki shaharda — ikkita katta maktabda", ru: 'В двух городах — в двух больших школах' }, { uz: "Uchta shaharda — har birida bitta joyda", ru: 'В трёх городах — в каждом в одном месте' }, { uz: "Bitta universitetda — faqat o'z talabalariga", ru: "В одном университете — только для своих студентов" }], correct: 3 },
  { q: { uz: 'Facebook butun dunyo uchun qachon ochilgan?', ru: "Когда Facebook открылся для всего мира?" }, opts: [{ uz: "Oradan ikki yarim yil o'tgach", ru: "Спустя два с половиной года" }, { uz: "Birinchi kunidan boshlab", ru: 'С первого же дня' }, { uz: "Bir necha oydan keyin", ru: 'Через несколько месяцев' }, { uz: "O'sha yilning oxirida", ru: 'В конце того же года' }], correct: 0 },
  { q: { uz: 'Facebook voqeasida nima ish bergan?', ru: 'Что сработало в истории Facebook?' }, opts: [{ uz: "Saytning tez ochilishi", ru: 'Быстрая загрузка сайта' }, { uz: "Saytga yozilgan odamlar soni", ru: 'Число зарегистрированных на сайте' }, { uz: "Odamlarning bir-birini tanishi", ru: 'То, что люди знали друг друга' }, { uz: "Saytdagi tugmalarning ko'pligi", ru: 'Много кнопок на сайте' }], correct: 2 },
  { q: { uz: 'Qaysi biri tanish guruh?', ru: "Что из этого — группа знакомых?" }, opts: [{ uz: "Bir mahallada yashaydigan, lekin bir-birini tanimaydigan odamlar", ru: "Люди из одного района, которые не знают друг друга" }, { uz: "Har kuni ko'rishadigan sinfdoshlaringiz", ru: "Одноклассники, с которыми вы видитесь каждый день" }, { uz: "Siz kuzatadigan kanalning 5000 obunachisi", ru: "5000 подписчиков канала, который вы читаете" }, { uz: "Bekatda avtobus kutayotgan odamlar", ru: "Люди, которые ждут автобус на остановке" }], correct: 1 },
  { q: { uz: 'Uchta guruh yozganda har guruh haqida nimalarni yozasiz?', ru: "Когда записываете три группы, что пишете про каждую?" }, opts: [{ uz: "Guruh nomi va undagi odamlarning yoshi", ru: "Название группы и возраст людей в ней" }, { uz: "Faqat odam soni — qolgani kerak emas", ru: 'Только число людей — остальное не нужно' }, { uz: "Guruh nomi, admini va ochilgan kuni", ru: "Название группы, её админа и день создания" }, { uz: "Guruh nomi, kimlar borligi va odam soni", ru: "Название группы, кто в ней есть и сколько людей" }], correct: 3 },
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

// ===== ⚔️ CODESTRIKE ARENA — yozuv-zonasi: 100+ =====
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
    const TOK = [{ uz: 'guruh', ru: 'группа' }, { uz: 'odam', ru: 'человек' }, { uz: 'tanish', ru: 'знакомые' }, { uz: 'halqa', ru: 'круг' }, { uz: 'yigirma', ru: 'двадцать' }, { uz: 'eshitdi', ru: 'услышал' }, { uz: 'ochdi', ru: 'открыл' }, { uz: 'ishlatdi', ru: 'пользуется' }];
    const em = [], toks = [];
    for (let i = 0; i < 26; i++) em.push({ x: Math.random() * W, y: Math.random() * H, z: .3 + Math.random() * .7, ph: Math.random() * 6.28, sw: .3 + Math.random() * .6 });
    for (let i = 0; i < 9; i++) toks.push({ x: Math.random() * W, y: Math.random() * H, z: .4 + Math.random() * .9, vx: (Math.random() - .5) * .16, t: tr(TOK[i % TOK.length]), r: (Math.random() - .5) * .5 });
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
            <span className="qz-count">{tr({ uz: <>Savol <b>{qi + 1}</b>/{QUIZ_BANK.length} — natija</>, ru: <>Вопрос <b>{qi + 1}</b>/{QUIZ_BANK.length} — результат</> })}</span>
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
                : <span className="qz-res-t">{my ? tr({ uz: 'Adashdingiz — 0 ball. Keyingisida olasiz.', ru: 'Не угадали — 0 баллов. Возьмёте на следующем.' }) : tr({ uz: "Vaqt tugadi — 0 ball. Tezroq bo'ling.", ru: 'Время вышло — 0 баллов. Отвечайте быстрее.' })}</span>}
              {!solo && myRank >= 0 && <span className="qz-res-rank">{tr({ uz: <>Siz hozir: {myRank + 1}-o'rin</>, ru: <>Вы сейчас: {myRank + 1}-е место</> })}</span>}
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
          {isMentor && !lastQ && <button className="qz-btn ghost qz-auto" onClick={autoNext.auto ? autoNext.pause : autoNext.resume} title={tr({ uz: "Avto o'tishni to'xtatish — javobni tushuntirish uchun (arena oxirigacha)", ru: 'Остановить автопереход — чтобы объяснить ответ (до конца арены)' })}>{autoNext.auto ? tr({ uz: `To'xtatish${autoNext.sec ? ` · ${autoNext.sec}` : ''}`, ru: `Остановить${autoNext.sec ? ` · ${autoNext.sec}` : ''}` }) : tr({ uz: '▶ Avto', ru: '▶ Авто' })}</button>}
          {solo && <button className="qz-btn big" onClick={soloNext}>{lastQ ? tr({ uz: '🏁 Natijani ko\'rish', ru: '🏁 Посмотреть результат' }) : tr({ uz: 'Keyingi →', ru: 'Дальше →' })}</button>}
        </div>
      )}

      {phase === 'done' && (
        <div className="qz-view fade-step">
          <Confetti />
          <h2 className="qz-h">{tr({ uz: '🏆 Test yakunlandi!', ru: '🏆 Тест завершён!' })}</h2>
          {solo ? (
            <div className="qz-solo-res">
              <div className="qz-solo-pts">{soloScore.pts}</div>
              <p className="qz-sub">{tr({ uz: <>ball · {soloScore.ok}/{QUIZ_BANK.length} to'g'ri{soloScore.maxStreak >= 2 ? ` · ketma-ket to'g'ri 🔥x${soloScore.maxStreak}` : ''}</>, ru: <>баллов · {soloScore.ok}/{QUIZ_BANK.length} верно{soloScore.maxStreak >= 2 ? ` · подряд верно 🔥x${soloScore.maxStreak}` : ''}</> })}</p>
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
                      {b && <span className="qz-pod-pts">{b.pts} {tr({ uz: 'ball', ru: 'баллов' })} · {b.ok}/{QUIZ_BANK.length}</span>}
                      <div className="qz-pod-bar" />
                    </div>
                  );
                })}
              </div>
              {myRank >= 0 && <p className="qz-mypl">{tr({ uz: <>Siz — <b>{myRank + 1}-o'rin</b> · {board[myRank].pts} ball</>, ru: <>Вы — <b>{myRank + 1}-е место</b> · {board[myRank].pts} баллов</> })}</p>}
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
        <div className="head head-c"><h2 className="title h-title fade-up">{isLive ? tr({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>g'oliblarimiz</span></>, ru: <>Наши сегодняшние <span className="italic" style={{ color: T.accent }}>победители</span></> }) : tr({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>natijangiz</span></>, ru: <>Ваш сегодняшний <span className="italic" style={{ color: T.accent }}>результат</span></> })}</h2></div>
        {!isLive ? (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="pod-card">
              <div className="pod-card-ring"><ScoreRing correct={selfCorrect} total={totalQ} /></div>
              <div className="pod-card-sec">
                <span className="pod-card-lbl">{tr({ uz: 'Nishonlar', ru: 'Значки' })} · {Object.keys(ACHIEVEMENTS).filter(id => achievements && achievements.has(id)).length}/{Object.keys(ACHIEVEMENTS).length}</span>
                <div className="pod-card-badges">
                  {Object.entries(ACHIEVEMENTS).map(([id, a], k) => { const got = !!(achievements && achievements.has(id)); return <span key={id} className={`pcb ${got ? 'got' : ''}`} style={{ '--k': k }} title={tr(a.desc)}><span className="pcb-ic" aria-hidden="true">{got ? a.icon : '🔒'}</span><span className="pcb-nm">{got ? a.name : '?'}</span></span>; })}
                </div>
              </div>
              <div className="pod-card-note"><span className="pcn-ic" aria-hidden="true">💡</span><p className="body">{tr({ uz: 'Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruhning natijalari va 🥇🥈🥉 eng yaxshi uchtalik chiqadi.', ru: 'Это ваш личный результат. На живом уроке здесь появятся результаты всей группы и 🥇🥈🥉 лучшая тройка.' })}</p></div>
            </div>
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
            {myIdx >= 0 && <p className="pod-my fade-up">{tr({ uz: <>Siz — <b>{myIdx + 1}-o'rin</b> ({board[myIdx].okCount}/{totalQ} to'g'ri)</>, ru: <>Вы — <b>{myIdx + 1}-е место</b> ({board[myIdx].okCount}/{totalQ} верно)</> })}</p>}
            <div className="card fade-up d1">
              <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '🏆 Barcha natijalar', ru: '🏆 Все результаты' })}</div>
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
// ===== SCREEN 15 — YAKUN: CodeStrike arenasi + uy-vazifa BIR sahifada =====
// Tuzilma etalondan: hero (h-sub YO'Q) -> CodeStrike -> «Endi siz bilasiz» -> uy-vazifa -> nishonlar.
const ScreenSummary = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const live = _gate.live;
  const isMentorL = !!(live && live.mode === 'mentor');
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const RECAP = [
    { uz: "Botingizni birinchi bo'lib ishlatadigan odamlar — birinchi foydalanuvchilar.", ru: "Люди, которые первыми начнут пользоваться вашим ботом, — первые пользователи." },
    { uz: "Sizni taniydigan, bir-birini tez-tez ko'radigan odamlar — tanish guruh.", ru: "Люди, которые вас знают и часто видят друг друга, — группа знакомых." },
    { uz: 'Tanish guruhda bitta odam botni ochsa, xabar qolganlarga ham yetadi.', ru: "Если в группе знакомых бота откроет один человек, новость дойдёт и до остальных." },
    { uz: 'Birinchi foydalanuvchilarni bot emas, siz olib kelasiz.', ru: "Первых пользователей приводит не бот, а вы." },
  ];
  // CodeStrike — alohida ekran emas, yakun ichida
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
  // Uy-vazifa — alohida ekran emas, kapsula bosilganda shu yerda ochiladi
  const [hwVariant, setHwVariant] = useState(() => readHwTarget());
  const pickHw = (k) => { setHwVariant(k); try { localStorage.setItem(HW_KEY, k); } catch {} };
  const [hwOpen, setHwOpen] = useState(false);
  const [charge, setCharge] = useState(false);
  const fireHw = () => { if (charge || hwOpen) return; setCharge(true); setTimeout(() => { setHwOpen(true); setCharge(false); }, 500); };
  // 77-qonun: uy-vazifa kartasi chiqqach u ko'rinishga olib kelinadi (ekran ostida qolmasin)
  const xulRef = useRef(null);
  useEffect(() => {
    if (!hwOpen || !xulRef.current) return;
    const kam = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const t = setTimeout(() => { if (xulRef.current) xulRef.current.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'nearest' }); }, 320);
    return () => clearTimeout(t);
  }, [hwOpen]);

  const recapCard = (
    <div className="card fade-up d3">
      <div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div>
      <ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul>
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="hero">
          <div className="hero-l">
            <div className="hero-chips"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Dars tugadi', ru: 'Урок завершён' })}</span>{!isMentorL && <span className="score-chip fade-up">{correct}/{total} {tr({ uz: "to'g'ri", ru: 'верно' })}</span>}</div>
            <h2 className="title h-title fade-up d1">{tr({ uz: <>Uchta <span className="italic" style={{ color: T.accent }}>guruhingizni</span> yozdingiz.</>, ru: <>Вы записали три <span className="italic" style={{ color: T.accent }}>свои группы</span>.</> })}</h2>
          </div>
          
        </div>
        {/* 103-qonun: darsni bitta gap yopadi */}
        <div className="bigidea fade-up d2"><span className="bigidea-lbl">{tr({ uz: 'Bugungi asosiy fikr —', ru: 'Главная мысль дня —' })}</span><p className="bigidea-t">{tr({ uz: 'Birinchi foydalanuvchilar tanish guruhlardan keladi.', ru: "Первые пользователи приходят из групп знакомых." })}</p></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: "Дождитесь ментора" }) : undefined} />
        </div>
        {arena && <QuizArena live={live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        {/* «Endi siz bilasiz» va nishonlar yonma-yon (58-qonun) */}
        {isMentorL ? recapCard : (
          <div className="split sum2">
            {recapCard}
            <div className="card ach-coll fade-up d4">
              <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Nishonlaringiz', ru: "Ваши значки" })} — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
              <div className="ach-grid">
                {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return (
                  <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`} title={achDesc(a.desc)}>
                    <span className="ach-badge-ic">{got ? a.icon : '🔒'}</span>
                    {got ? (<>
                      <span className="ach-badge-name">{a.name}</span>
                      <span className="ach-badge-desc">{achDesc(a.desc)}</span>
                    </>) : (
                      <span className="ach-badge-tx">
                        <span className="ach-badge-name">{a.name}</span>
                        <span className="ach-badge-desc">{achDesc(a.desc)}</span>
                      </span>
                    )}
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
            <span className="hw-big-t">{tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}</span>
            <span className="hw-big-s">{tr({ uz: 'Amaliy topshiriqni bajarish →', ru: 'Выполнить практическое задание →' })}</span>
          </button>
        </div>
        {hwOpen && <div ref={xulRef}><HwCard variant={hwVariant} onPick={pickHw} /></div>}
        {/* A9: «Keyingi dars» App.jsx m5-03 bilan mos — uyga vazifa tugmasi ostida */}
        <p className="next-l fade-up d4">{tr({ uz: <>Keyingi dars — <b>«Telegram Bot API + tugmalar»</b>. 1-darsda ochgan botingizga birinchi kodni yozasiz: /start buyrug'i va menyu tugmalari.</>, ru: <>Следующий урок — <b>«Telegram Bot API + кнопки»</b>. Для бота, которого вы открыли на 1-м уроке, вы напишете первый код: команду /start и кнопки меню.</> })}</p>
        <MentorNote>{tr({ uz: "Arena tugagach g'oliblarni nomlab tabriklang. Uy-vazifa: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa. Tekshirishda bitta savolga qarang: har ism yonida qaysi guruhdan ekani belgilanganmi? Yigirmata ism chiqmasa — bu ham natija: guruhlardan birida odamlar aslida bir-birini tanimas ekan, uni qayta ko'radi.", ru: "После арены назовите победителей и поздравьте их. Домашнее задание: тем, кто закончил кодовое задание в классе, — полный вариант, не успевшим — короткий. При проверке смотрите на один вопрос: отмечено ли рядом с каждым именем, из какой он группы? Если двадцати имён не набралось — это тоже результат: значит, в одной из групп люди на самом деле не знакомы, ученик пересмотрит её." })}</MentorNote>
      </div>
    </Stage>
  );
};
const CSS_BASE = `
  html, body { margin: 0; padding: 0; }
  .lesson-root, .lesson-root * { box-sizing: border-box; }
  .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
  /* Reset: <p> uchun FAQAT margin nollanadi. Ilgari padding ham nollanardi va u element-selektor
     bo'lgani uchun klass-paddinglarni (.jtask/.jres/.sfb/.bhint/.cmt-tip) yeb qo'yardi —
     javob-qatorlari fon ichida siqilib turardi. Ro'yxatlarda padding nollanishi kerak (40px odat). */
  .lesson-root h1,.lesson-root h2,.lesson-root h3,.lesson-root h4,.lesson-root h5,.lesson-root h6,.lesson-root p { margin: 0; }
  .lesson-root ul,.lesson-root ol { margin: 0; padding: 0; }

  .title { font-family: 'Source Serif 4', serif; font-weight: 600; line-height: 1.1; letter-spacing: -0.005em; }
  .italic { font-family: 'Source Serif 4', serif; font-style: italic; font-weight: 500; }
  .mono { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }

  @keyframes fade-in-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
  .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; }
  @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .fade-step { animation: fade-step 0.3s ease-out; }
  .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }

  .feedback-block { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.4s ease-out, opacity 0.3s ease-out 0.1s, margin-top 0.4s ease-out; margin-top: 0; }
  .feedback-block.visible { max-height: 800px; opacity: 1; margin-top: clamp(14px,2vw,20px); }
  .live-badge { opacity: 0.4; transition: opacity 0.25s ease; }
  .live-badge:hover { opacity: 1; }

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
  .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.ink}; border: 1px solid ${T.line}; border-radius: 10px; padding: 8px 14px; font-size: 13px; }
  .btn-soft:hover:not(:disabled) { box-shadow: 0 6px 14px -5px rgba(${T.shadowBase},0.2); }

  .option { background: ${T.paper}; cursor: pointer; transition: all 0.2s; font-family: 'Manrope', sans-serif; font-weight: 500; line-height: 1.45; text-align: left; border-radius: 12px; width: 100%; border: none; color: ${T.ink}; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); min-width: 0; overflow-wrap: anywhere; }
  .option:hover:not(:disabled) { background: #FBFAFE; box-shadow: 0 10px 22px -6px rgba(${T.shadowBase},0.22); }
  .option:disabled { cursor: default; }
  /* 27-qonun: to'g'ri variant sahifa-qatori kabi «joyiga o'tiradi» — dars mexanikasining sadosi. */
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
  .mnote-chip { align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; background: ${T.paper}; border: 1.5px dashed ${T.blue}; color: ${T.blue}; border-radius: 999px; padding: 4px 12px; font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.04em; cursor: pointer; opacity: 0.4; transition: opacity 0.2s ease, transform 0.2s ease; }
  .mnote-chip:hover, .mnote-chip:focus-visible { opacity: 1; transform: translateY(-1px); }
  @media (hover: none) { .mnote-chip { opacity: 0.6; } }
  .mnote-body { margin: 0; font-size: clamp(13px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.45; }

  .h-title { font-size: clamp(22px,4vw,36px); letter-spacing: -0.015em; text-wrap: balance; }
  .h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }
  .body { font-size: clamp(14px,1.6vw,16px); line-height: 1.5; }
  .eyebrow { font-size: clamp(11px,1.3vw,12px); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; }
  .small { font-size: clamp(12.5px,1.4vw,13.5px); }
  .flow-label { font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.ink2}; }

  .stage { max-width: 1100px; margin: 0 auto; height: calc(100dvh / var(--lz, 1)); display: flex; flex-direction: column; }
  .stage-header { flex-shrink: 0; background: ${T.bg}; padding-top: clamp(12px,2vw,18px); padding-bottom: clamp(8px,1.5vw,12px); }
  .stage-content { flex: 1; min-height: 0; padding-top: clamp(9px,1.5vw,14px); padding-bottom: clamp(14px,2.6vw,26px); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
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
  .head-c { text-align: center; align-items: center; } /* F-1003-04: natija ekrani — bitta o'q */
  .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(16px,2.6vw,30px); align-items: start; }
  .split.sum2 { gap: clamp(12px,2vw,22px); }
  .split.sum2 .ach-grid { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 860px) { .split.sum2 { grid-template-columns: 1fr; } }
  .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
  /* O'ng ustun hali BO'SH bo'lsa (topshiriq/yordam ochilmagan) — chap karta sahnaning
     o'rtasida turadi: sahna bo'sh yarim ekran bilan qolmaydi. Ustun to'lganda yumshoq o'tadi. */
  .split { transition: grid-template-columns 0.4s cubic-bezier(.4,0,.2,1); }
  .split:has(> .col:last-child:empty) { grid-template-columns: minmax(0,1fr); }
  @media (max-width: 860px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }
  @media (prefers-reduced-motion: reduce) { .split { transition: none; } }


  .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
  .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
  .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; }
  .hero-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; } .score-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; font-variant-numeric: tabular-nums; color: ${T.accent}; background: ${T.accentSoft}; padding: 5px 12px; border-radius: 999px; } /* F-1003-04/05: yakunda halqa o'rniga yorliq */
  .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
  .ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; } .ring-wrap svg { width: 100%; height: 100%; }
  .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .ring-num { font-family: 'Source Serif 4', serif; font-size: 30px; font-weight: 500; line-height: 1; }
  .ring-den { color: ${T.ink3}; font-size: 20px; }
  .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
  /* F-1002-73: natija — bitta karta. Ball-halqasi karta chetida, markazda; ichida och fonli nishonlar bo'limi
     (olingan nishon — katakda, nomi bilan, bir marta «pop»; olinmagani — kulrang qulf) va 💡 belgili izoh. */
  .pod-card { position: relative; width: 100%; max-width: 480px; margin-top: 6px; background: ${T.paper}; border-radius: 20px; padding: 0 clamp(14px,2.4vw,20px) clamp(14px,2.4vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 16px 34px -20px rgba(${T.shadowBase},0.35); }
  .pod-card-ring { display: flex; justify-content: center; padding-top: clamp(14px,2.4vw,20px); } .pod-card-ring > * { margin-top: 0 !important; } /* F-1003-04: halqa karta ichida, chetga minmaydi */
  .screen:has(.pod-card) .head { text-align: center; } /* sarlavha karta bilan bir o'qda */
  .pod-card .ring-wrap { width: 128px; height: 128px; position: relative; background: ${T.paper}; border-radius: 50%; box-shadow: 0 0 0 6px ${T.accentSoft}; }
  .pod-card-sec { background: ${T.bg}; border-radius: 14px; padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .pod-card-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
  .pod-card-badges { display: flex; justify-content: center; gap: clamp(8px,1.6vw,12px); flex-wrap: wrap; }
  .pcb { width: 84px; display: flex; flex-direction: column; align-items: center; gap: 5px; }
  .pcb-ic { width: 50px; height: 50px; border-radius: 14px; display: grid; place-items: center; font-size: 26px; line-height: 1; background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; }
  .pcb.got .pcb-ic { background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}; animation: pcb-pop 0.5s cubic-bezier(.3,1.6,.5,1) both; animation-delay: calc(0.35s + var(--k) * 0.12s); }
  .pcb:not(.got) .pcb-ic { font-size: 18px; filter: grayscale(1); opacity: 0.55; }
  .pcb-nm { font-family: 'Manrope'; font-size: 10.5px; line-height: 1.25; text-align: center; color: ${T.ink3}; }
  .pcb.got .pcb-nm { color: ${T.ink}; font-weight: 700; }
  @keyframes pcb-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .pod-card-note { display: flex; gap: 10px; align-items: flex-start; background: ${T.accentSoft}; border-radius: 14px; padding: 11px 13px; }
  .pcn-ic { width: 32px; height: 32px; flex: none; border-radius: 50%; display: grid; place-items: center; background: ${T.paper}; font-size: 16px; }
  .pod-card-note .body { margin: 0; font-size: clamp(13px,1.5vw,14.5px); }
  @media (prefers-reduced-motion: reduce) { .pcb.got .pcb-ic { animation: none; } }
  .card { background: ${T.paper}; border-radius: 16px; padding: 18px 20px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); min-width: 0; overflow-wrap: anywhere; }
  .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 11px; }
  .recap { display: flex; flex-direction: column; gap: 8px; list-style: none; }
  .recap li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
  .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; }
  .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; min-width: 0; overflow-wrap: anywhere; }
  .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }
  .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
`;
// Dars-vizuallari: odamlar xaritasi (imzo-vizual), joy-quvuri, yozish-ekrani, kompilyator-launch.
const CSS_LESSON = `
  /* HOOK — tanlovlar bitta qatorda */
  .hrow { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: clamp(8px,1.4vw,14px); }
  @media (max-width: 860px) { .hrow { grid-template-columns: repeat(2, minmax(0,1fr)); } }
  .hopt { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 7px; background: ${T.paper}; border: none; border-radius: 15px; padding: clamp(13px,2vw,18px) clamp(9px,1.4vw,13px); cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 8px 20px -9px rgba(${T.shadowBase},0.22); transition: transform 0.16s, box-shadow 0.16s; min-width: 0; }
  .hopt:hover:not(:disabled):not(.on) { transform: translateY(-3px); box-shadow: 0 14px 26px -9px rgba(${T.shadowBase},0.3); }
  .hopt:disabled { cursor: default; }
  .hopt.on { box-shadow: inset 0 0 0 2px ${T.accent}, 0 12px 26px -9px rgba(91,61,230,0.35); background: ${T.accentSoft}; }
  .hopt-ic { font-size: clamp(24px,3.4vw,32px); line-height: 1; color: ${T.ink}; } /* F-0926-05 #23: disabled-tugma rangi (rgba 0.3) emojini xiralashtirmasin */
  .hopt-nom { font-weight: 700; font-size: clamp(12.5px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.3; overflow-wrap: anywhere; }
  .hvote { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,18px); box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }
  .hvote-row { display: flex; align-items: center; gap: 10px; }
  .hvote-lbl { flex: 0 0 clamp(120px,26vw,230px); font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hvote-row.mine .hvote-lbl { color: ${T.accent}; }
  .hvote-track { flex: 1; height: 12px; border-radius: 99px; background: ${T.bg}; overflow: hidden; }
  .hvote-fill { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); transition: width 0.6s cubic-bezier(.2,.7,.2,1); }
  .hvote-row.top .hvote-fill { background: linear-gradient(90deg, ${T.success}, #0E8A55); }
  .hvote-pct { min-width: 38px; text-align: right; font-size: 12px; font-weight: 700; color: ${T.ink2}; }
  @media (prefers-reduced-motion: reduce) { .hopt, .hvote-fill { transition: none; } }
  /* HOOK ikki tanlov (104-qonun: teng og'irlik — teng kenglik) */
  /* HOOK ikki tanlovi — ekranning bosh harakati: kartalar kattaroq, belgisi yirik.
     Bola bir qarashda «bu yerda tanlayman» ekanini ko'radi (ETALON 32 ierarxiya-testi). */
  .hrow.two { grid-template-columns: repeat(2, minmax(0,1fr)); max-width: 780px; align-self: center; width: 100%; }
  .hrow.two .hopt { padding: clamp(19px,2.9vw,29px) clamp(14px,2vw,20px); gap: 11px; border-radius: 18px; }
  .hrow.two .hopt-ic { font-size: clamp(33px,4.4vw,45px); }
  .hrow.two .hopt-nom { font-size: clamp(13.5px,1.7vw,15.5px); }
  .hrow.two .hopt { padding: clamp(14px,2vw,20px) clamp(10px,1.6vw,16px); }

  /* MAQSAD (s1) — ro'yxat o'z-o'zidan yozilib chiqadi (18-qonun) */
  .s1demo { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 18px; padding: clamp(15px,2.2vw,20px) clamp(15px,2.4vw,22px) clamp(13px,2vw,18px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; max-width: 660px; align-self: center; width: 100%; }
  .s1demo-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.5vw,13.5px); color: ${T.accent}; }
  .s1demo-list { display: flex; flex-direction: column; gap: 7px; }
  .s1row { position: relative; display: flex; align-items: center; gap: 9px; flex-wrap: wrap; background: ${T.bg}; border-radius: 11px; padding: 9px 12px; opacity: 0; animation: s1-in 0.5s cubic-bezier(.3,1.4,.45,1) var(--dd) forwards, s1-flash 0.95s ease-out calc(var(--dd) + 0.55s); min-width: 0; }
  /* Qator bir lahza yonadi va tinchiydi: joy ro'yxatga tushdi. */
  @keyframes s1-flash { 0% { background: ${T.bg}; box-shadow: inset 0 0 0 0 rgba(91,61,230,0); } 28% { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px rgba(91,61,230,0.35); } 100% { background: ${T.bg}; box-shadow: inset 0 0 0 0 rgba(91,61,230,0); } }
  .s1row-ic { flex-shrink: 0; width: 27px; height: 27px; border-radius: 9px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.line}; opacity: 0; animation: s1-ok 0.4s cubic-bezier(.34,1.5,.4,1) var(--dd) forwards; }
  /* 42-qonun: fe'l ↔ ekran jarayoni — matn chapdan o'ngga «yozilib chiqadi» */
  .s1row-t { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; clip-path: inset(0 100% 0 0); animation: s1-write 0.62s ease-out forwards; animation-delay: var(--dd); }
  .s1row::before { content: ""; position: absolute; left: -10px; top: 50%; transform: translateY(-50%); height: 2px; width: 0; border-radius: 99px; background: ${T.accent}; animation: s1-link 0.9s ease-out forwards; animation-delay: var(--dd); }
  .s1row-mark { margin-left: auto; font-size: 15px; color: ${T.accent}; opacity: 0; animation: s1-ok 0.4s ease-out forwards; animation-delay: var(--dd2); }
  .s1row-why { font-family: 'Manrope'; font-weight: 700; font-size: clamp(11.5px,1.4vw,13px); color: ${T.ink2}; text-align: right; min-width: 0; overflow-wrap: anywhere; opacity: 0; animation: s1-arrive 0.5s cubic-bezier(.3,1.35,.45,1) var(--dd3) forwards; }
  .s1row-n { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(11.5px,1.4vw,13px); color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 4px 11px; box-shadow: inset 0 0 0 1.5px rgba(91,61,230,0.26); opacity: 0; animation: s1-arrive 0.5s cubic-bezier(.3,1.35,.45,1) var(--dd3) forwards; }
  .s1sum { align-self: flex-end; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; animation: s1-arrive 0.5s ease-out both; }
  .s1sum-n { display: inline-block; min-width: 2ch; text-align: center; color: ${T.accent}; animation: s1-count 0.7s cubic-bezier(.3,1.4,.45,1); }
  @keyframes s1-count { 0% { transform: translateY(-6px) scale(1.35); opacity: 0.4; } 60% { transform: translateY(0) scale(1.12); opacity: 1; } 100% { transform: none; } }
  @keyframes s1-arrive { 0% { opacity: 0; transform: translateX(16px) scale(0.9); } 100% { opacity: 1; transform: translateX(0) scale(1); } }
  @keyframes s1-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes s1-write { to { clip-path: inset(0 0 0 0); } }
  @keyframes s1-link { 0% { width: 0; opacity: 0.95; } 40% { width: 10px; opacity: 0.95; } 100% { width: 10px; opacity: 0; } }
  @keyframes s1-ok { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
  @media (prefers-reduced-motion: reduce) { .s1row, .s1row-mark, .s1row-ic, .s1row-why, .s1row-n, .s1sum, .s1sum-n { animation: none; opacity: 1; transform: none; } .s1row-t { animation: none; clip-path: none; } .s1row::before { animation: none; width: 0; } }

  /* TEORIYA-1 (s2): ikki karta — bosilsa ochiladi/yopiladi (46-qonun) */
  .dfc-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: clamp(10px,1.8vw,16px); }
  @media (max-width: 700px) { .dfc-grid { grid-template-columns: 1fr; } }
  .dfc { display: flex; flex-direction: column; gap: 9px; text-align: left; background: ${T.paper}; border: none; border-radius: 16px; padding: clamp(13px,2vw,18px); cursor: pointer; box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; transition: transform 0.16s, box-shadow 0.16s; min-width: 0; }
  .dfc:hover { transform: translateY(-2px); box-shadow: 0 14px 26px -9px rgba(${T.shadowBase},0.3), inset 0 0 0 1.5px ${T.accent}44; }
  .dfc:active { transform: translateY(0); }
  .dfc.open { box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 12px 26px -14px rgba(91,61,230,0.3); }
  .dfc-top { display: flex; align-items: center; gap: 9px; }
  .dfc-mark { margin-left: auto; flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15px; line-height: 1; color: ${T.accent}; background: ${T.accentSoft}; } /* U1: ochiladigan kartada doimiy › belgi, bosilgach ✓ */
  .dfc-mark.ok { color: ${T.success}; background: ${T.successSoft}; font-size: 12px; }
  .dfc-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; }
  .dfc-b { font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.6vw,14.5px); line-height: 1.5; color: ${T.ink2}; background: ${T.bg}; border-radius: 11px; padding: 9px 12px; min-height: 44px; display: flex; align-items: center; overflow-wrap: anywhere; min-width: 0; transition: background 0.2s, color 0.2s; }
  .dfc:not(.open) .dfc-b { justify-content: center; color: ${T.ink3}; letter-spacing: 0.34em; }
  .dfc.open .dfc-b { color: ${T.ink}; background: ${T.accentSoft}; animation: fade-step 0.28s ease-out; }
  @media (prefers-reduced-motion: reduce) { .dfc, .dfc:hover { transition: none; transform: none; } .dfc.open .dfc-b { animation: none; } }

  /* 🔴 IMZO-VIZUAL (s4): «BIRINCHI 20» — markazda siz, atrofda uch halqa */
  /* --rk = xarita-o'lchovi. Ilgari past ekranda butun blokka zoom berilardi — u ①②③
     nishonlari bilan markazdagi «siz» yozuvini ham kichraytirardi (1280x800 da 8px).
     Endi faqat RADIUS kichrayadi, yozuv har ekranda bir xil kattalikda qoladi. */
  .wmap { --rk: 1.34; position: relative; width: min(calc(320px * var(--rk)), 90vw); aspect-ratio: 1 / 1; margin: 0 auto; }
  .wring { position: absolute; left: 50%; top: 50%; width: calc(var(--r) * 2 * var(--rk, 1)); height: calc(var(--r) * 2 * var(--rk, 1)); transform: translate(-50%, -50%); border-radius: 50%; border: 1.5px dashed ${T.line}; background: transparent; cursor: pointer; padding: 0; transition: border-color 0.2s, background 0.2s; }
  .wring:disabled { cursor: default; }
  .wring.on { border-style: solid; }
  /* §134 daraja-rangi: markazga yaqinlashgan sari indigo quyuqlashadi. Ochilgan halqa ichi ham
     engil bo'yaladi — ichkari doiralar ustma-ust tushib markazni ZICH qilib ko'rsatadi. */
  .wring.z3 { border-color: rgba(91,61,230,0.5); }
  .wring.z2 { border-color: rgba(91,61,230,0.32); }
  .wring.z1 { border-color: rgba(156,151,180,0.5); }
  .wring.z3.on { border-color: ${T.accent}; background: rgba(91,61,230,0.085); }
  .wring.z2.on { border-color: rgba(91,61,230,0.5); background: rgba(91,61,230,0.05); }
  .wring.z1.on { border-color: rgba(156,151,180,0.75); background: rgba(156,151,180,0.05); }
  .wring.z3.live, .wring.z2.live, .wring.z1.live { border-color: ${T.accent}; background: rgba(91,61,230,0.14); }
  .wring-badge { position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%); width: 22px; height: 22px; border-radius: 50%; background: ${T.paper}; color: ${T.ink2}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .wring.z3 .wring-badge { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px rgba(91,61,230,0.5); }
  .wring.z2 .wring-badge { color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px rgba(91,61,230,0.32); }
  .wring.z1 .wring-badge { color: ${T.ink2}; box-shadow: inset 0 0 0 1.5px rgba(156,151,180,0.5); }
  .wring.on .wring-badge { font-size: 13px; }
  .wring.live .wring-badge { background: ${T.accent}; color: #fff; box-shadow: none; }
  .wdots { position: absolute; inset: 0; pointer-events: none; z-index: 15; }
  .wdot { position: absolute; left: 50%; top: 50%; width: 6px; height: 6px; margin: -3px 0 0 -3px; border-radius: 50%; background: ${T.ink3}; opacity: 0.5; transform: rotate(var(--a)) translateY(calc(-1 * var(--r) * var(--rk, 1))); transition: background 0.3s, opacity 0.3s, box-shadow 0.3s; }
  .wdot.r1 { background: ${T.accent}; opacity: 0.46; }
  .wdot.r2 { width: 5px; height: 5px; margin: -2.5px 0 0 -2.5px; background: ${T.accent}; opacity: 0.28; }
  .wdot.r3 { width: 3px; height: 3px; margin: -1.5px 0 0 -1.5px; opacity: 0.22; }
  .wdot.lit { background: ${T.accent}; opacity: 1; box-shadow: 0 0 0 3px rgba(91,61,230,0.18); }
  .wdot.plus { width: 7px; height: 7px; margin: -3.5px 0 0 -3.5px; background: ${T.success}; opacity: 1; box-shadow: 0 0 0 3px rgba(18,169,104,0.18); animation: s1-ok 0.34s cubic-bezier(.34,1.5,.4,1); }
  .wme { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); z-index: 20; pointer-events: none; display: flex; flex-direction: column; align-items: center; font-size: 21px; line-height: 1; }
  .wme b { font-family: 'Manrope'; font-weight: 800; font-size: 11px; color: ${T.ink2}; margin-top: 2px; }
  .wme::before { content: ''; position: absolute; left: 50%; top: 50%; width: 64px; height: 64px; margin: -32px 0 0 -32px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.88) 26%, rgba(255,255,255,0) 72%); z-index: -1; }
  .hrings { display: flex; flex-direction: column; gap: 7px; }
  .hrr.z3 { box-shadow: 0 0 0 2px ${T.accent}; }
  .hrr.z2 { box-shadow: 0 0 0 2px rgba(91,61,230,0.42); }
  .hrr.z1 { box-shadow: 0 0 0 2px rgba(156,151,180,0.6); }
  .hrr { display: flex; flex-direction: column; gap: 4px; text-align: left; background: ${T.paper}; border: none; border-radius: 13px; padding: 9px 12px 9px 10px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: box-shadow 0.16s, transform 0.14s, background 0.16s; min-width: 0; }
  .hrr:hover:not(:disabled) { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .hrr:disabled { cursor: default; }
  .hrr.on { box-shadow: inset 0 0 0 1.5px rgba(156,151,180,0.65); }
  .hrr.live { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; }
  .hrr-h { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .hrr-h b { margin-left: auto; font-weight: 700; font-size: 12px; color: ${T.ink2}; white-space: nowrap; }
  .hrr-b { font-family: 'Manrope'; font-weight: 600; font-size: clamp(11.5px,1.4vw,13px); line-height: 1.4; color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; }
  .hrr:not(.on) .hrr-b { color: ${T.ink3}; letter-spacing: 0.3em; }
  .wweek { display: block; height: 8px; border-radius: 99px; background: ${T.bg}; box-shadow: inset 0 0 0 1px ${T.line}; overflow: hidden; }
  .wweek i { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); transition: width 0.4s linear; }
  /* Hafta-kartasi (s4 2-bosqichi) va uning tugmalari */
  .thr { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(11px,1.8vw,15px); box-shadow: 0 16px 34px -16px rgba(${T.shadowBase},0.28), inset 0 0 0 2px ${T.accent}44; min-width: 0; }
  .thr-q { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(14px,1.9vw,17px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; }
  .thr-btns { display: flex; gap: 7px; flex-direction: column; }
  .thr-b.z3 { box-shadow: 0 0 0 2px ${T.accent}; }
  .thr-b.z2 { box-shadow: 0 0 0 2px rgba(91,61,230,0.42); }
  .thr-b.z1 { box-shadow: 0 0 0 2px rgba(156,151,180,0.6); }
  .thr-b { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; background: ${T.bg}; border: none; border-radius: 11px; padding: 9px 14px 9px 12px; cursor: pointer; text-align: left; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: box-shadow 0.16s, transform 0.14s, background 0.16s, color 0.16s; min-width: 0; overflow-wrap: anywhere; }
  .thr-b:hover:not(:disabled) { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .thr-b.used { color: ${T.ink2}; background: ${T.paper}; box-shadow: inset 0 0 0 1.5px ${T.line}; cursor: default; }
  .thr-b.live { color: #fff; background: ${T.accent}; }
  .thr-res { display: flex; flex-direction: column; gap: 6px; }
  .res-line { font-family: 'Manrope'; font-weight: 600; font-size: clamp(12px,1.45vw,13.5px); line-height: 1.45; color: ${T.ink}; background: ${T.accentSoft}; border-radius: 10px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; animation: fade-step 0.3s ease-out; }
  .res-line b { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; }
  .res-line.two { display: flex; align-items: flex-start; gap: 9px; }
  .res-tx { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .res-line b.res-nm { font-family: 'Manrope', sans-serif; font-weight: 800; }
  .res-sub { font-weight: 600; font-size: clamp(11.5px,1.4vw,13px); color: ${T.ink2}; }
  /* v2: halqa raqami CSS doira ichida (① ② ③ belgilari o'rniga) */
  .hnum { flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; margin-right: 7px; vertical-align: -4px; border-radius: 50%; background: ${T.paper}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 11px; line-height: 1; box-shadow: inset 0 0 0 1.5px rgba(91,61,230,0.4); }
  .hrr-h .hnum, .res-line.two .hnum { margin-right: 0; }
  .hrr-mark { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; align-self: center; font-weight: 800; font-size: 14px; line-height: 1; color: ${T.accent}; background: ${T.accentSoft}; }
  .hrr-mark.ok { color: ${T.success}; background: ${T.successSoft}; font-size: 11px; }
  .hrr-fold { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.success}; background: ${T.successSoft}; border-radius: 12px; padding: 9px 13px; box-shadow: inset 0 0 0 1.5px ${T.success}44; min-width: 0; overflow-wrap: anywhere; }
  .hrr-fold .mono { font-weight: 700; color: ${T.ink2}; }
  @media (prefers-reduced-motion: reduce) { .wdot, .wdot.plus, .res-line, .wring { animation: none; transition: none; } .wweek i { transition: none; } .thr-b:hover:not(:disabled), .hrr:hover:not(:disabled) { transform: none; } }

  /* 🔴 TEKSHIRUV (s9): JOY-QUVURI — to'rt joy, uch qadam, yigirmagacha */
  .qsum { display: flex; align-items: center; gap: 10px; background: ${T.paper}; border-radius: 12px; padding: 8px 14px; box-shadow: inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .qsum-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.ink2}; white-space: nowrap; }
  .qsum-track { flex: 1; height: 10px; border-radius: 99px; background: ${T.bg}; overflow: hidden; box-shadow: inset 0 0 0 1px ${T.line}; }
  .qsum-track i { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); transition: width 0.5s cubic-bezier(.4,0,.2,1); }
  .qsum b { font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; white-space: nowrap; }
  .qsum.done .qsum-track i { background: linear-gradient(90deg, ${T.success}, #0E8A55); }
  .qsum.done b { color: ${T.success}; }
  .qgrid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 9px; }
  /* F-1002-72: to'rt karta bir qatorda + qisqaruvchi voronka-chiziq */
  .qgrid.q4 { grid-template-columns: repeat(4, minmax(0,1fr)); align-items: start; }
  @media (max-width: 860px) { .qgrid.q4 { grid-template-columns: repeat(2, minmax(0,1fr)); } }
  .qfun { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; }
  .qf-r { display: grid; grid-template-columns: 66px minmax(0,1fr) auto; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 600; font-size: 11px; color: ${T.ink3}; }
  .qf-r.on { color: ${T.ink2}; }
  .qf-t { height: 7px; border-radius: 99px; background: ${T.bg}; overflow: hidden; box-shadow: inset 0 0 0 1px ${T.line}; }
  .qf-t i { display: block; height: 100%; border-radius: 99px; background: rgba(91,61,230,0.38); transition: width 0.55s cubic-bezier(.4,0,.2,1); }
  .qf-r.last .qf-t i { background: ${T.success}; }
  .qf-r b { font-size: 12px; color: ${T.ink}; min-width: 2.5ch; text-align: right; }
  .qf-r.last.on b { color: ${T.success}; }
  .qf-why { display: block; margin-top: 3px; font-family: 'Manrope'; font-weight: 500; font-size: 11.5px; line-height: 1.35; color: ${T.ink2}; animation: fade-step 0.3s ease-out; }
  .qf-why::first-letter { text-transform: uppercase; }
  @media (prefers-reduced-motion: reduce) { .qf-t i { transition: none; } .qf-why { animation: none; } }
  @media (max-width: 560px) { .qgrid { grid-template-columns: 1fr; } }
  .qc { display: flex; flex-direction: column; gap: 5px; text-align: left; background: ${T.paper}; border: none; border-radius: 14px; padding: 10px 12px; cursor: pointer; box-shadow: 0 10px 24px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; transition: transform 0.14s, box-shadow 0.16s; min-width: 0; }
  .qc:hover:not(:disabled) { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .qc:disabled { cursor: default; }
  .qc.on { box-shadow: inset 0 0 0 1.5px rgba(156,151,180,0.6); }
  .qc.live { box-shadow: inset 0 0 0 2px ${T.accent}; }
  .qc-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; }
  .qc-row { display: flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-size: 11.5px; color: ${T.ink2}; min-width: 0; }
  /* Yorliq-legendasi (9-qonun): ikkala yorliq grid ustida BIR marta yoziladi, kartada
     esa faqat legenda-belgisi + qiymat qoladi — takror o'qish yuki yo'qoladi. */
  .qbrief { max-width: 620px; width: 100%; align-self: center; gap: 14px; }
  .qleg { display: flex; flex-wrap: wrap; gap: 5px 16px; padding: 0 3px; }
  .qleg-i { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 700; font-size: 10.5px; letter-spacing: 0.04em; text-transform: uppercase; color: ${T.ink3}; min-width: 0; overflow-wrap: anywhere; }
  .qleg-i i, .qc-m { font-style: normal; font-size: 12px; line-height: 1; flex-shrink: 0; }
  .qc-row b { font-weight: 800; font-size: 12.5px; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .qc-row:not(.tez) b { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 13px; }
  /* §134: chip-rangi — quyuq indigo «har kuni ko'rishadi», neytral «umuman ko'rishmaydi».
     Tarqoq joyga qizil BERILMAYDI: bu nosozlik emas, shunchaki boshqa natija. */
  .qc-row.tez b { display: inline-block; border-radius: 99px; padding: 2px 9px; background: ${T.bg}; color: ${T.ink2}; box-shadow: inset 0 0 0 1px ${T.line}; }
  .qc-row.tez.z3 b { background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px rgba(91,61,230,0.34); }
  .qc-row.tez.z2 b { background: rgba(235,229,253,0.55); color: ${T.accent}; box-shadow: inset 0 0 0 1px rgba(91,61,230,0.22); }
  .qc-row.tez.z1 b { background: ${T.bg}; color: ${T.ink2}; }
  /* Yakun-tasmasi bir zarbda emas — bosilgan joylar birin-ketin joyiga tushadi. */
  .task-line { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; color: ${T.ink}; background: ${T.paper}; border-radius: 12px; padding: 10px 13px; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.2); min-width: 0; overflow-wrap: anywhere; }
  @media (prefers-reduced-motion: reduce) { .qc:hover:not(:disabled) { transform: none; } .qsum-track i { transition: none; } }

  /* YOZISH-EKRANI (s8): muharrir-kartasi, topshiriq-paneli, yozilganlar ro'yxati */
  .wsp-ed { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,17px); box-shadow: 0 16px 34px -16px rgba(${T.shadowBase},0.28), inset 0 0 0 2px ${T.accent}44; min-width: 0; }
  .wsp-save { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.6vw,14.5px); color: #fff; background: ${T.accent}; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer; box-shadow: 0 10px 22px -10px rgba(91,61,230,0.6); transition: transform 0.14s, opacity 0.14s, box-shadow 0.14s; }
  .wsp-save:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 13px 26px -10px rgba(91,61,230,0.7); }
  .wsp-save:active:not(:disabled) { transform: translateY(0) scale(0.97); }
  .wsp-save:disabled { opacity: 0.42; cursor: not-allowed; box-shadow: none; }
  @media (prefers-reduced-motion: reduce) { .wsp-save { transition: none; } .wsp-save:hover:not(:disabled), .wsp-save:active:not(:disabled) { transform: none; } }
  .wsp-list { display: flex; flex-direction: column; gap: 7px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,17px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.success}55; min-width: 0; }
  .wsp-list-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.success}; overflow-wrap: anywhere; }
  .wsp-item { display: flex; align-items: flex-start; gap: 9px; background: ${T.bg}; border-radius: 11px; padding: 9px 11px; min-width: 0; animation: fade-in-up 0.34s ease-out both; }
  .wsp-item:nth-child(3) { animation-delay: 0.09s; }
  .wsp-item:nth-child(4) { animation-delay: 0.18s; }
  @media (prefers-reduced-motion: reduce) { .wsp-item { animation: none; } }
  .wsp-item-t { flex: 1; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; line-height: 1.4; min-width: 0; overflow-wrap: anywhere; }
  .wsp-item-edit { flex-shrink: 0; background: none; border: none; cursor: pointer; font-size: 14px; color: ${T.ink3}; border-radius: 8px; padding: 2px 6px; }
  .wsp-item-edit:hover { color: ${T.accent}; background: ${T.accentSoft}; }
  .wsp-item-m { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; background: ${T.blueSoft}; }
  .wsp-task { display: flex; flex-direction: column; gap: 5px; background: ${T.paper}; border-radius: 14px; padding: 11px 14px; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.2); min-width: 0; }
  .wsp-task-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
  .wsp-task-row { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.45vw,13.5px); color: ${T.ink2}; background: ${T.bg}; border-radius: 9px; padding: 6px 10px; min-width: 0; overflow-wrap: anywhere; transition: background 0.2s, color 0.2s; }
  .wsp-task-row.done { color: ${T.success}; background: ${T.successSoft}; }
  .wsp-task-m { margin-left: auto; flex-shrink: 0; font-size: 13px; animation: s1-ok 0.34s cubic-bezier(.34,1.5,.4,1); }
  @media (prefers-reduced-motion: reduce) { .wsp-task-row { transition: none; } .wsp-task-m { animation: none; } }
  .wsp-task-n { font-size: 11.5px; font-weight: 700; color: ${T.ink3}; }
  .wsp-sum { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12.5px; font-weight: 700; color: ${T.accent}; }
  .wsp-saverow { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  /* 83/30-qonun: tugma faol bo'lmasa, nima yetishmayotgani SO'Z bilan yoziladi */
  .wsp-need { font-family: 'Manrope'; font-weight: 700; font-size: 12px; line-height: 1.4; color: ${T.ink3}; min-width: 0; overflow-wrap: anywhere; }
  .numrow { display: flex; align-items: center; flex-wrap: wrap; gap: 9px; }
  .num-in { max-width: 140px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; }
  .numrow-u { font-family: 'Manrope'; font-weight: 700; font-size: 12.5px; line-height: 1.4; color: ${T.ink3}; min-width: 0; overflow-wrap: anywhere; }
  /* TOPSHIRIQ-SHARTLARI (ETALON 32): qisqa chip, bajarilgani yashil */
  .spec { display: flex; flex-direction: column; gap: 4px; margin-top: 3px; }
  .spec-c { font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink3}; background: ${T.bg}; border-radius: 8px; padding: 5px 9px; min-width: 0; overflow-wrap: anywhere; transition: color 0.2s, background 0.2s; }
  .spec-c.ok { color: ${T.success}; background: ${T.successSoft}; }

  /* BOSQICHLI OCHILISH (94-qonun): uch qadam-doirasi */
  .stps { display: flex; flex-wrap: wrap; gap: 8px; }
  .stp { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(11.5px,1.4vw,13px); color: ${T.ink3}; background: ${T.paper}; border-radius: 99px; padding: 5px 12px 5px 5px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .stp i { font-style: normal; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: ${T.bg}; color: ${T.ink3}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 11px; }
  .stp.on { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .stp.on i { background: ${T.accent}; color: #fff; }
  .stp.done { color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; }
  .stp.done i { background: ${T.success}; color: #fff; }
  /* 81-qonun: maydon-belgilari MA'NO rangida (qizil hech qachon) */
  .reflect-input { font-family: 'Manrope'; font-size: 15px; color: ${T.ink}; border: none; border-radius: 10px; padding: 11px 14px; background: ${T.bg}; box-shadow: inset 0 0 0 1.5px ${T.line}; outline: none; width: 100%; min-width: 0; transition: box-shadow 0.18s; }
  textarea.reflect-input { display: block; line-height: 1.45; resize: none; overflow-y: hidden; box-sizing: border-box; } /* F-1003-03 */
  .reflect-input:focus { box-shadow: inset 0 0 0 2px ${T.accent}; }
  .reflect-input.filled { box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .reflect-input.await { animation: rin-wait 2.2s ease-in-out infinite; }
  @keyframes rin-wait { 0%, 100% { box-shadow: inset 0 0 0 1.5px ${T.line}; } 50% { box-shadow: inset 0 0 0 1.5px ${T.accent}77, 0 0 0 4px rgba(91,61,230,0.10); } }
  .reflect-input.await:focus { animation: none; }
  @media (prefers-reduced-motion: reduce) { .reflect-input.await { animation: none; box-shadow: inset 0 0 0 1.5px ${T.accent}55; } }
  .sfb { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.45; border-radius: 9px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; }
  .sfb.ok { color: ${T.success}; background: ${T.successSoft}; }
  .sfb.ask { color: ${T.accent}; background: ${T.accentSoft}; }
  .wsxrow { display: flex; gap: 18px; flex-wrap: wrap; align-items: flex-start; }
  /* 16-qonun: bu yopiladigan MATN, bo'sh joy emas — uzuq chiziqli quti EMAS, matn-havola. */
  .wsx { flex: none; min-width: 0; background: transparent; border: none; border-radius: 0; overflow: visible; }
  .wsx.star { border-color: ${T.blue}66; }
  .wsx-toggle { width: auto; text-align: left; background: none; border: none; border-bottom: 1px solid ${T.line}; padding: 2px 0; font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; cursor: pointer; }
  .wsx-toggle:hover, .wsx-toggle:focus-visible { color: ${T.accent}; border-bottom-color: ${T.accent}; }
  .wsx.star .wsx-toggle:hover, .wsx.star .wsx-toggle:focus-visible { color: ${T.blue}; border-bottom-color: ${T.blue}; }
  .wsx-body { padding: 8px 0 0; display: flex; flex-direction: column; gap: 6px; animation: fade-step 0.25s ease-out; }
  .wsx-body p { font-size: 12.5px; color: ${T.ink2}; margin: 0; line-height: 1.45; overflow-wrap: anywhere; }
  .wsx-body b { color: ${T.ink}; }

  /* XULOSA-KARTASI va yordamchi qatorlar */
  .xul { background: ${T.paper}; border-radius: 14px; padding: clamp(12px,1.8vw,16px); display: flex; flex-direction: column; gap: 6px; box-shadow: 0 10px 24px -10px rgba(${T.shadowBase},0.2); }
  .xul-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(15px,2vw,19px); color: ${T.ink}; }
  .xul-b { margin: 0; font-size: clamp(13px,1.55vw,14.5px); line-height: 1.5; color: ${T.ink2}; }
  .bhint { margin: 0; align-self: flex-start; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.45; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 9px; padding: 7px 12px; min-width: 0; overflow-wrap: anywhere; }
  /* ETALON 32: muvaffaqiyat-xabari CHIP bo'lib qoladi — to'liq-en yashil lenta emas */
  /* RECAP mukofoti (106f-b): bitta tabrik-gap va bitta qoida-qatori */
  .rwd { display: flex; flex-direction: column; gap: 7px; align-items: flex-start; }
  .rwd-t { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; color: ${T.success}; background: ${T.successSoft}; border-radius: 10px; padding: 8px 12px; min-width: 0; overflow-wrap: anywhere; }
  .rwd-rule { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 7px 14px; min-width: 0; overflow-wrap: anywhere; box-shadow: inset 0 0 0 1.5px ${T.accent}44; animation: rwd-stamp 0.46s cubic-bezier(.34,1.5,.4,1) 0.16s both; }
  @keyframes rwd-stamp { 0% { opacity: 0; transform: scale(1.16); } 60% { opacity: 1; transform: scale(0.97); } 100% { opacity: 1; transform: scale(1); } }
  @media (prefers-reduced-motion: reduce) { .rwd-rule { animation: none; } }
  /* YAKUN (103-qonun): darsni yopadigan bitta gap */
  .bigidea { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 4px; align-items: center; text-align: center; background: ${T.paper}; border-radius: 16px; padding: clamp(14px,2vw,20px) clamp(14px,2.2vw,22px) clamp(12px,1.8vw,18px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.accent}33; }
  .bigidea-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
  .bigidea-t { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,21px); line-height: 1.3; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }

  /* KODING darvoza-mashqi (82e) va kompilyator launch-kartasi */
  .gt-rows { display: flex; flex-direction: column; gap: 7px; }
  .fchoice { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); border: none; border-radius: 12px; padding: 10px 14px; background: ${T.paper}; color: ${T.ink}; cursor: pointer; text-align: left; box-shadow: inset 0 0 0 1.5px ${T.line}; transition: all 0.16s; max-width: 100%; min-width: 0; overflow-wrap: anywhere; }
  .fchoice:hover { box-shadow: inset 0 0 0 1.5px ${T.accent}66; transform: translateY(-1px); }
  .fchoice.miss { background: ${T.errSoft}; color: ${T.err}; box-shadow: inset 0 0 0 2px ${T.err}; animation: cmt-shake 0.4s ease; }
  @keyframes cmt-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 55% { transform: translateX(5px); } 80% { transform: translateX(-2px); } }
  /* Darvoza-kartasi (s10 · 1-bosqich) va recap ikki qadami (s12) — ekranda YAGONA harakat
     joyi bo'lgani uchun qolgan joyning o'rtasiga o'tiradi. */
  @media (min-width: 861px) {
    /* F-0926-05 #20: darvoza/koding/refleksiya bloklari o'rtaga tushirilmaydi — mentor gapi ostida turadi (foydalanuvchi 26.09) */
    /* Xuddi shu tamoyil (sahna bo'sh yarim ekran bilan qolmaydi) MAQSAD va MUHOKAMA
       ekranlariga ham: ularning yagona bloki qolgan bo'shliqning o'rtasiga o'tiradi.
       Muhokamada xulosa-karta chiqqach markazlash bekor bo'ladi — matn tepadan oqadi. */
    .screen > .s1demo { margin-top: 12px; } /* F-1002-69: o'rtaga tushirilmaydi — Mentor ostida, oddiy oraliq + 12px (foydalanuvchi 02.10: «juda ochiq qolmasin, yopishib ham qolmasin») */
    /* Muhokama-kartalari: bo'sh joyni yeyish uchun markazlash EMAS (mentor bilan karta
       orasida uzilish paydo bo'lardi) — kartalar o'zi to'la panelga aylanadi va ochilganda
       ham sakramaydi: javob-maydoni oldindan o'z balandligini egallab turadi. */
    .dfc-b { min-height: clamp(56px,9vh,96px); }
  }
  .cmt { background: ${T.bg}; border-radius: 13px; padding: 11px 13px; display: flex; flex-direction: column; gap: 9px; max-width: 680px; width: 100%; align-self: center; }
  .cmt.hunt { animation: cmt-hunt 1.7s ease-in-out infinite; }
  .cmt.calm { animation: none; }
  @keyframes cmt-hunt { 0%, 100% { box-shadow: 0 0 0 0 rgba(110,75,255,0.4); } 50% { box-shadow: 0 0 0 9px rgba(110,75,255,0); } }
  .cmt-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.5vw,13.5px); color: ${T.ink}; }
  .cmt-rule { margin: 0; max-width: 680px; width: 100%; align-self: center; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.5; color: ${T.ink2}; background: ${T.paper}; border-radius: 12px; padding: 10px 13px; box-shadow: inset 0 0 0 1.5px ${T.line}; min-width: 0; overflow-wrap: anywhere; } /* v2: kod-savol ustidagi qoida-qatori */
  .cmt-b { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.5; color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; }
  .cmt-fold { display: inline-flex; align-items: center; gap: 10px; align-self: flex-start; background: ${T.successSoft}; border-radius: 99px; padding: 7px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; max-width: 100%; min-width: 0; overflow-wrap: anywhere; }
  .cmt-done { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.5vw,13.5px); color: ${T.success}; animation: fade-step 0.3s ease-out; }
  .cmt-tip { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px,1.4vw,13px); line-height: 1.45; color: ${T.ink2}; background: ${T.accentSoft}; border-radius: 9px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; animation: fade-step 0.3s ease-out; }
  @media (prefers-reduced-motion: reduce) { .cmt.hunt, .cmt-tip, .cmt-done, .fchoice.miss { animation: none; } .fchoice, .fchoice:hover { transition: none; transform: none; } }
  .kdpanel { position: relative; background: ${T.paper}; border-radius: 16px; padding: 11px 13px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.18); min-width: 0; transition: border-color 0.3s; }
  /* F-0926-05 #16: yashil ramka olindi — holatni tugma yoki yozuv aytadi */
  /* ETALON 32: shartlar chip-panel ritmida — .spec-c/.wsp-task-row bilan bitta oila */
  ol.kdreq { margin: 0; padding-left: 0; list-style: none; counter-reset: kd; display: flex; flex-direction: column; gap: 5px; }
  .kdreq li { counter-increment: kd; position: relative; display: block; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; background: ${T.bg}; border-radius: 9px; padding: 6px 10px 6px 35px; min-width: 0; overflow-wrap: anywhere; }
  .kdreq li::before { content: counter(kd); position: absolute; left: 10px; top: 7px; width: 17px; height: 17px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 10.5px; display: flex; align-items: center; justify-content: center; }
  .klaunch { display: flex; flex-direction: column; align-items: center; gap: 9px; text-align: center; background: ${T.paper}; border-radius: 18px; padding: clamp(15px,2.4vw,22px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .klaunch-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.accent}; }
  .klaunch-sub { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; }
  .kod-launch-btn { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px,1.9vw,17px); background: ${T.accent}; color: #fff; border: none; border-radius: 14px; padding: 15px 34px; cursor: pointer; box-shadow: 0 14px 30px -8px rgba(91,61,230,0.6); transition: transform 0.18s, box-shadow 0.18s; }
  .kod-launch-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -8px rgba(110,75,255,0.72); }
  .kod-launch-btn:active { transform: translateY(0) scale(0.98); }
  @media (prefers-reduced-motion: reduce) { .kod-launch-btn { transition: none; transform: none !important; } }
  .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 10px 13px; display: flex; flex-direction: column; gap: 5px; }

  /* RECAP (s12) */
  .rcp-flow { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(12px,2vw,18px); align-items: stretch; }
  @media (max-width: 760px) { .rcp-flow { grid-template-columns: 1fr; } }
  .rcp-step { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 12px; min-width: 0; }
  .rcp-step-h { display: flex; gap: 11px; align-items: flex-start; }
  .rcp-n { width: 26px; height: 26px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}66; /* F-0926-05 #8: biroz yumshatildi */ font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 5px 12px -5px rgba(91,61,230,0.5), 0 0 0 3px ${T.accentSoft}; }
  .next-l { margin: 0; max-width: 760px; width: 100%; align-self: center; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.5; color: ${T.ink2}; text-align: center; min-width: 0; overflow-wrap: anywhere; }
  .next-l b { color: ${T.ink}; font-weight: 800; }
  .rcp-flow.one { grid-template-columns: minmax(0,1fr); max-width: 680px; width: 100%; align-self: center; }
  .rcp-fold { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; background: ${T.successSoft}; border-radius: 14px; padding: 9px 12px 9px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; min-width: 0; }
  .rcp-fold-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.6vw,15px); color: ${T.success}; }
  .rcp-fold .rcp-again { margin-left: auto; }
  .rcp-t { display: block; font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
  .pair-timer { background: ${T.bg}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 10px; box-shadow: inset 0 0 0 1.5px ${T.line}; margin-top: auto; }
  .pair-timer.bare { background: none; box-shadow: none; padding: 0; } /* F-0926-05 #20: yakka rejim, taymer boshlanmagan — faqat tugma, ramkasiz */
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
  /* KEYS-SAHNA (F-1002-70 · 165-qonun) */
  .ksc { position: relative; height: clamp(104px,15vh,148px); background: ${T.paper}; border-radius: 16px; overflow: hidden; flex-shrink: 0; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.3); }
  /* F-1003-19: keys-sahnada brend o'z rangida — o'quvchi kompaniyani taniydi va eslaydi (logotip emas, nom-yorliq) */
  .ksc-brand { position: absolute; top: 9px; left: 11px; z-index: 2; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 13px; letter-spacing: -0.01em; line-height: 1; padding: 6px 10px; border-radius: 8px; animation: ksc-brand-in 0.45s ease-out both; }
  .ksc-b-fb { background: #3B5998; color: #fff; }
  .ksc-b-ab { background: #fff; color: #FF5A5F; box-shadow: inset 0 0 0 1.5px #FF5A5F55; }
  .ksc-b-bk { background: #003580; color: #fff; }
  .ksc-b-dl { background: #58CC02; color: #fff; text-transform: lowercase; border-radius: 10px; }
  @keyframes ksc-brand-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: reduce) { .ksc-brand { animation: none; } }
  .ksc-lines { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
  .ksc-lines line { stroke: ${T.accent}; stroke-width: 1.3; opacity: 0.35; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 0.6s ease-out; }
  .ksc-lines line.on { stroke-dashoffset: 0; }
  .ksc-i { position: absolute; transform: translate(-50%,-50%) scale(0.4); opacity: 0; font-size: clamp(24px,3.2vw,32px); line-height: 1; transition: opacity 0.35s ease-out, transform 0.45s cubic-bezier(.3,1.5,.5,1), filter 0.4s; }
  .ksc-i.on { opacity: 1; transform: translate(-50%,-50%) scale(1); }
  .ksc-i.dot { width: 10px; height: 10px; border-radius: 50%; background: ${T.accent}; }
  .ksc-i.dot.on { opacity: 0.85; }
  .ksc-i.dot.alt { background: #FF8A3D; }
  .ksc-i.txt { font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(15px,2vw,19px); color: ${T.ink}; }
  .ksc-i.txt.ok { color: ${T.success}; }
  .ksc-i.dim { filter: grayscale(1); opacity: 0.4; }
  .ksc-cap { position: absolute; right: 12px; top: 9px; font-size: 12px; font-weight: 700; color: ${T.ink2}; animation: fade-step 0.3s ease-out; }
  @media (prefers-reduced-motion: reduce) { .ksc-i, .ksc-lines line { transition: none; } .ksc-cap { animation: none; } }
  .k-slide-body b { color: ${T.ink}; }
  .k-dots { display: flex; gap: 8px; justify-content: center; }
  .k-dot { width: 10px; height: 10px; border-radius: 99px; background: rgba(167,166,162,0.4); cursor: pointer; transition: all 0.25s; border: none; padding: 0; }
  .k-dot.fill { background: ${T.ink3}; } .k-dot.cur { background: ${T.accent}; width: 26px; }
  .kp-bet { position: relative; background: ${T.paper}; border-radius: 18px; padding: clamp(15px,2.4vw,24px) clamp(18px,3vw,30px); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 11px; box-shadow: 0 14px 34px -12px rgba(${T.shadowBase},0.24); overflow: hidden; }
  .kp-bet.answered { padding: clamp(11px,1.6vw,15px) clamp(14px,2.2vw,22px); gap: 8px; transition: padding 0.3s ease; }
  .kp-bet.answered .k-slide-h { font-size: clamp(15px,2vw,19px); }
  .kp-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
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
  @media (prefers-reduced-motion: reduce) { .kp-chip, .kp-chip:hover { transition: none; transform: none; } .kp-res.kp-res { animation: none; } }

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
  /* 58-qonun: topshiriq-karta ochilgach kapsula o'z ishini bajarib bo'ldi — ixchamlashadi,
     shunda yakun-ekran past desktopda ham skrollsiz qoladi (so'z kattaligi saqlanadi). */
  .screen:has(.hw-chips) .hw-big { padding: 9px clamp(20px,2.4vw,28px); gap: 2px; }
  .screen:has(.hw-chips) .hw-big-t { font-size: clamp(19px,2.4vw,24px); }
  .screen:has(.hw-chips) .hw-big-s { font-size: clamp(12.5px,1.5vw,14px); }
  .screen:has(.hw-chips) .hw-big-wrap::before { inset: -9px; }
  .screen:has(.hw-chips) .hw-sky { opacity: 0.7; }
  .screen:has(.hw-chips) .hero { gap: 10px; }
  .screen:has(.hw-chips) .bigidea { padding: 8px 15px 7px; }
  .screen:has(.hw-chips) .card { padding: 10px 13px; }
  .screen:has(.hw-chips) .card-lbl { margin-bottom: 6px; }
  .screen:has(.hw-chips) .recap { gap: 4px; }
  .screen:has(.hw-chips) .ach-badge { padding: 6px 5px; gap: 2px; }
  .screen:has(.hw-chips) .ach-grid { gap: 6px; }
  /* 58/60-qonun (dizayn-o'lchov 2026-08-19): topshiriq-karta OCHILGACH yakun-ekranda hamma
     narsa bir vaqtda turishi kerak — 1280x800 da skroll 0. So'z kattaligi TEGILMAYDI
     (CodeStrike so'zi ham): faqat joylashuv yoyiladi va bo'shliqlar zichlashadi. */
  .screen:has(.hw-chips) { gap: 7px !important; }
  .screen:has(.hw-chips) .ring-wrap { width: 68px; height: 68px; }
  .screen:has(.hw-chips) .ring-num { font-size: 21px; }
  .screen:has(.hw-chips) .ring-den { font-size: 15px; }
  .screen:has(.hw-chips) .ring-lbl { font-size: 9px; margin-top: 1px; }
  .screen:has(.hw-chips) .split.sum2 .ach-grid { grid-template-columns: repeat(4, minmax(0,1fr)); }
  .screen:has(.hw-chips) .ach-badge-desc { display: none; }
  /* Uy-vazifa kartasi ikki ustun: chapda «uyda nima qilasiz» + variant-chiplari,
     o'ngda tanlangan topshiriq-karta. Bola ikkalasini bir qarashda ko'radi (ETALON 32). */
  .card:has(.hw-chips) { display: grid; grid-template-columns: minmax(0,290px) minmax(0,1fr); column-gap: clamp(12px,1.8vw,18px); align-items: start; }
  .card:has(.hw-chips) > .card-lbl, .card:has(.hw-chips) > .body, .card:has(.hw-chips) > .hw-chips { grid-column: 1; }
  .card:has(.hw-chips) > .body { margin-bottom: 8px !important; }
  .card:has(.hw-chips) > .hw-chips { margin-bottom: 0; }
  .card:has(.hw-chips) > .pmtask, .card:has(.hw-chips) > .frame-soft { grid-column: 2; grid-row: 1 / span 3; }
  /* Topshiriq-kartaning ichi ham yoyiladi: shapka ustda, ma'lumot-qatorlari va qadamlar yonma-yon */
  .card:has(.hw-chips) .pmtask { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
  .card:has(.hw-chips) .pmtask-head { grid-column: 1 / -1; padding: 6px 13px; }
  .card:has(.hw-chips) .pmtask-row { padding: 6px 13px; }
  .card:has(.hw-chips) .pmtask-steps { padding: 9px 13px 11px; gap: 7px; border-left: 1px solid ${T.line}; }
  @media (max-width: 860px) {
    .card:has(.hw-chips), .card:has(.hw-chips) .pmtask { grid-template-columns: 1fr; }
    .card:has(.hw-chips) > .pmtask, .card:has(.hw-chips) > .frame-soft { grid-column: 1; grid-row: auto; }
    .card:has(.hw-chips) .pmtask-head { grid-column: 1; }
    .card:has(.hw-chips) .pmtask-steps { border-left: none; }
  }
`;
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
  .rc-ic { font-size: clamp(44px,8vw,76px); line-height: 1; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: ${T.accent}; } /* U3: PM darsida karta belgisi raqam */
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
  @media (prefers-reduced-motion: reduce) { .ach-counter.bump { animation: none; } }
  .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 232px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
  .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
  .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
  .ach-pop-row.got { background: ${T.accentSoft}66; }
  .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
  .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
  .ach-pop-tx { display: flex; flex-direction: column; gap: 1px; min-width: 0; overflow-wrap: anywhere; }
  .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
  .ach-pop-ds { font-family: 'Manrope'; font-size: 10.5px; line-height: 1.25; color: ${T.ink2}; }
  .ach-pop-row:not(.got) .ach-pop-nm, .ach-pop-row:not(.got) .ach-pop-ds { color: ${T.ink3}; }
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
  .ach-badge-desc { font-family: 'Manrope'; font-size: 10.5px; color: ${T.ink2}; line-height: 1.3; overflow-wrap: anywhere; }
  .ach-badge.locked .ach-badge-desc { color: ${T.ink3}; }
  .ach-badge-tx { display: flex; flex-direction: column; gap: 2px; min-width: 0; overflow-wrap: anywhere; }
  /* Qulflangan nishonda ham ma'no ko'rinadi: yonma-yon joylashuv qo'shimcha qatorni balandlikka aylantirmaydi (58-qonun) */
  .ach-badge.locked { flex-direction: row; align-items: center; text-align: left; gap: 9px; padding: 7px 11px; }
  .ach-badge.locked .ach-badge-ic { flex: 0 0 auto; }
  .ach-badge.locked .ach-badge-tx { flex: 1 1 auto; }
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
  /* P0 bilan bir xil: iteratsiya cheklashning o'zi yetmaydi — 16s aylanish bir marta bo'lsa ham
     to'liq-ekran nur aylanadi. Nurlar butunlay to'xtaydi, faqat yumshoq paydo bo'lish qoladi. */
  @media (prefers-reduced-motion: reduce) { .acu-rays, .acu-medal, .acu-glow, .acu-tap { animation-iteration-count: 1 !important; } .acu-rays { animation: acu-fade 0.4s both !important; } }

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
  /* ===== 58-QONUN: PAST-DESKTOP (past ekran) — sahifa skrollsiz sigsin =====
     Matn kattaligi TEGILMAYDI: faqat kapsula-ichi boshligi, nishon-katak va halqa kichrayadi.
     Blok ENG OXIRIDA turadi: media-sorov aniqlik qoshmaydi, tartib hal qiladi. */
  @media (max-height: 900px) {
    .stage-content > .screen { gap: clamp(8px,1.2vw,12px) !important; }
    .ring-wrap { width: 94px; height: 94px; }
    .ring-num { font-size: 24px; }
    .bigidea { padding: clamp(10px,1.4vw,14px) clamp(14px,2.2vw,22px) clamp(9px,1.2vw,12px); }
    .cs-cta .cs-cap { padding: clamp(9px,1.1vw,12px) clamp(20px,3vw,36px); }
    .hw-big { padding: clamp(11px,1.4vw,14px) clamp(22px,2.6vw,30px); }
    .card { padding: 12px 15px; }
    .card-lbl { margin-bottom: 8px; }
    .recap { gap: 6px; }
    .ach-badge { padding: 8px 7px; }
    .ach-badge-desc { font-size: 10px; line-height: 1.25; }
    .ach-grid { gap: 8px; }
    .wmap { --rk: 1.22; }
    .qc { padding: 8px 11px; }
    .k-slide { padding: clamp(11px,1.8vw,18px) clamp(16px,2.6vw,26px); gap: 7px; }
    .k-slide-ic { font-size: clamp(26px,4vw,38px); }
  }
  @media (max-height: 830px) {
    .ring-wrap { width: 80px; height: 80px; }
    .ring-num { font-size: 23px; }
    .ring-den { font-size: 17px; }
    .cs-cta .cs-cap { padding: 9px clamp(18px,2.6vw,32px); }
    .hw-big { padding: 11px clamp(20px,2.4vw,28px); gap: 4px; }
    .ach-badge { padding: 7px 6px; }
    .ach-badge-ic { font-size: 20px; }
    .bigidea { padding: 9px 16px 8px; }
    .stage-content > .screen { gap: 9px !important; }
    .card { padding: 11px 14px; }
    .recap { gap: 5px; }
    .recap li { font-size: 13.5px; }
    .card-lbl { margin-bottom: 7px; }
    .hw-big { padding: 9px clamp(20px,2.4vw,28px); }
    .cs-cta .cs-cap { padding: 7px clamp(18px,2.6vw,32px); }
    .ach-grid { gap: 6px; }
    .ach-badge-desc { font-size: 9.5px; line-height: 1.2; }
    .ach-badge { padding: 6px 5px; gap: 2px; }
    .hero { gap: 14px; }
    .recap li { font-size: 13px; }
    .wmap { --rk: 1.04; }
    .hrings { gap: 5px; }
    .xul { padding: 10px 13px; gap: 5px; }
    .wsp-ed, .thr { padding: 10px 12px; gap: 7px; }
    .hrr { padding: 7px 11px 7px 9px; gap: 3px; }
    .thr-btns { gap: 5px; }
    .thr-b { padding: 7px 12px 7px 10px; }
    .thr-res { gap: 4px; }
    .res-line { padding: 6px 10px; font-size: 12px; line-height: 1.38; }
    .pmtask-head { padding: 8px 14px; }
    .pmtask-row { padding: 7px 14px; }
    .pmtask-steps { gap: 7px; padding: 10px 14px 12px; }
    .hrow.two .hopt { padding: 14px 14px; gap: 8px; }
    .hrow.two .hopt-ic { font-size: 32px; }
    .k-slide-body { font-size: clamp(13.5px,1.7vw,15.5px); }
  }

  /* ===== 58/60-QONUN: YAKUN-EKRAN, TOPSHIRIQ-KARTA OCHIQ HOLATI =====
     Bu blok media-so'rovlardan KEYIN turadi — past-desktop qoidalarini ham bosadi.
     Kapsula bosilgan: u endi kichik yorliq, sahna esa topshiriqqa beriladi.
     So'z kattaligi (sarlavha, CodeStrike wordmark, recap qatorlari) TEGILMAYDI. */
  .stage-content:has(.hw-chips) { padding-top: 5px; padding-bottom: 4px; }
  .stage-content > .screen:has(.hw-chips) { gap: 5px !important; }
  .screen:has(.hw-chips) .hero { gap: 6px; }
  .screen:has(.hw-chips) .recap { gap: 3px; }
  .screen:has(.hw-chips) .card-lbl { margin-bottom: 4px; }
  .screen:has(.hw-chips) .card { padding: 9px 13px; }
  .screen:has(.hw-chips) .cs-cta .cs-cap { gap: 4px; }
  /* Bosilgan kapsula ixcham yorliqqa aylanadi: matn bir qatorda, yonma-yon */
  .screen:has(.hw-chips) .hw-big-wrap { width: min(390px, 100%); }
  .screen:has(.hw-chips) .hw-big { flex-direction: row; align-items: baseline; justify-content: center; gap: 9px; padding: 6px clamp(16px,2vw,22px); border-radius: 15px; }
  .screen:has(.hw-chips) .hw-big-t { font-size: clamp(16px,1.9vw,19px); }
  .screen:has(.hw-chips) .hw-big-s { font-size: clamp(11.5px,1.4vw,13px); }
  .screen:has(.hw-chips) .hw-big-wrap::before { inset: -7px; }
  /* Topshiriq-karta: chap ustun ingichkaroq, ma'lumot-qatorlari uch chiplik tasmaga tushadi */
  .card:has(.hw-chips) { grid-template-columns: minmax(0,390px) minmax(0,1fr); }
  /* Yakun-ekranning shapkasi va nav-qatori ham zichlashadi (matn kattaligi o'zgarmaydi) */
  .lesson-root:has(.hw-chips) .stage-header { padding-top: 8px; padding-bottom: 6px; }
  .lesson-root:has(.hw-chips) .stage-nav { padding-top: 9px; padding-bottom: 9px; }
  .screen:has(.hw-chips) .recap li { line-height: 1.28; }
  .screen:has(.hw-chips) .bigidea { padding: 5px 14px 4px; }
  .screen:has(.hw-chips) .done-chip { padding: 3px 11px; }
  .screen:has(.hw-chips) .cs-hud-i { padding: 4px 12px; }
  .screen:has(.hw-chips) .ach-badge-ic { font-size: 22px; }
  .screen:has(.hw-chips) .ach-badge.locked .ach-badge-ic { font-size: 18px; }
  .card:has(.hw-chips) .pmtask { grid-template-columns: minmax(0,1fr); }
  .card:has(.hw-chips) .pmtask-rows { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); }
  .card:has(.hw-chips) .pmtask-row { flex-direction: column; align-items: flex-start; gap: 1px; padding: 5px 12px; }
  .card:has(.hw-chips) .pmtask-row + .pmtask-row { border-top: none; border-left: 1px solid ${T.line}; }
  .card:has(.hw-chips) .pmtask-k { flex: none; }
  .card:has(.hw-chips) .pmtask-steps { border-left: none; padding: 7px 12px 8px; gap: 5px; }
  .card:has(.hw-chips) .pmtask-step { line-height: 1.35; }
  @media (max-width: 860px) {
    .card:has(.hw-chips) { grid-template-columns: 1fr; }
    .card:has(.hw-chips) .pmtask-rows { grid-template-columns: 1fr; }
    .card:has(.hw-chips) .pmtask-row + .pmtask-row { border-top: 1px solid ${T.line}; border-left: none; }
    .screen:has(.hw-chips) .hw-big { flex-direction: column; }
  }
`;
export default function PmLesson19({ lang: langProp, onFinished, liveToken }) {
  const lang = langProp || 'uz';
  setLiveLang(lang); // F-0928-07: jonli-modul tili + payload v2 lang (smoke I6)
  __lang = lang; // UZ-RU: tr() uchun joriy til (render'dan oldin o'rnatiladi)
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

  // Ekran-tartibi SCREEN_META bilan bir xil (16 ta)
  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, ScreenCoding, ScreenFinalTest, ScreenReflection, ScreenPodium, ScreenFlashcards, ScreenSummary];
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
