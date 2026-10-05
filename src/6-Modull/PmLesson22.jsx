import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PM · M6-D2 — BITTA GAPNI UCH KISHI BIR XIL TUSHUNADIMI?
// Senariy-manba: pm-senariylar/M6-D2-PRD.md (GATE S yopilgan, 2026-08-19).
// Misol-ip: basseyn guruhiga yozilish (91/95/96c/108-qonun).
// Imzo-vizual: BIR VARAQ — to'rt katak (senariy-ichi nom, ekranga chiqmaydi).
// Bosh keys: K7 · Microsoft (Altair) — raqamsiz keys, yagona sana 1975.
// Kirish-artefakt: YO'Q (modul-chegara, korpus §69 — zaxira-tarmoq ham yozilmaydi).
// Chiqish-artefakt: pm-m6d2-prd = { prd: { muammo, kim, yechim, metrika }, savedAt }.
// INFRA MANBAI: src/pm/PmUserStoryLesson.jsx (P0) + src/4-Modull/PmLesson12.jsx (m4-07) —
//   jonli relslar, Stage, QuestionScreen, MentorTestStats, RecapOverlay, PairTimer,
//   ScreenPodium, CodeStrike-arena, nishonlar; PmLesson14 s8 DRAFT_KEY naqshi.
// KODING: VS Code-topshirig'i (R1 navbati: m5-11 kompilyator → m6-02 VS Code) —
//   kod nusxalanmaydi, qo'lda yoziladi, natija `node` buyrug'i bilan ko'riladi.
// BIR TILLI (UZ): tarjima-yordamchisi yo'q; RU alohida sweep'da qo'shiladi.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
// ============================================================

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
import { useLiveSession, useServerProgress, LiveGateCtx, LiveGate, LiveBadge, LIVE_ENABLED, liveGet, liveRead, progRead, progWrite, progClear, livePlayers, liveAnswers, liveQuizAnswers , buildResultDetails, sealPayload, useAutoNext } from '../live/index.js';

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
const LESSON_META = { lessonId: 'pm-m6d2-v1', lessonTitle: { uz: 'Bitta gapni uch kishi bir xil tushunadimi?', ru: 'Поймут ли одну фразу трое одинаково?' } };
// YAKUN-TUZILMASI ETALONDAN (P0 PmUserStory · PmLesson2 · PmLesson4 · M3-D5):
// koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa BIR sahifada).
// Uy-vazifa va arena alohida ekran BO'LMAYDI — ikkovi ham yakun ichida.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom', scored: false, scope: 'hook' },        // 0  · BLOK 1
  { id: 's1',  type: 'rule',        template: 'custom', scored: false, scope: null },          // 1  · BLOK 2
  { id: 's2',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 2  · BLOK 3 teoriya-1
  { id: 's3',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 3  · TEST-1
  { id: 's4',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 4  · YADRO: bir varaq
  { id: 's5',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 5  · TEST-2
  { id: 's6',  type: 'case',        template: 'custom', scored: false, scope: null },          // 6  · haqiqiy voqea (K7)
  { id: 's7',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 7  · TEST-3
  { id: 's8',  type: 'practice',    template: 'custom', scored: false, scope: null },          // 8  · BLOK 4 yozish-ekrani
  { id: 's9',  type: 'practice',    template: 'custom', scored: false, scope: null },          // 9  · BLOK 5 tekshiruv (varaq)
  { id: 's10', type: 'koding',      template: 'custom', scored: false, scope: null },          // 10 · BLOK 6 VS Code
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
  s0: "Bola bitta og'zaki gapdan nega uch xil ilova chiqqanini tanlaydi va sabab gap faqat og'zaki aytilgani ekanini ko'radi",
  s1: "Bola dars oxirida to'rt katakli bitta varaq to'ldirishini oldindan ko'radi",
  s2: "Bola ikki kartani ochib og'zaki gap bilan yozilgan qator farqini o'zi topadi",
  s3: "Bola og'zaki aytilgan gapni eshitgach birinchi nima qilishini tanlaydi",
  s4: "Bola murabbiyga to'rt savolni o'zi beradi va varaq to'lgach uch dasturchi bir xil ekran qurishini ko'radi",
  s5: "Bola «Natijani qaysi sondan bilamiz?» katagiga qaysi qator tushishini aniqlaydi",
  s6: "Bola Geyts va Allen ishni aniq gapdan boshlaganini va tilni qanday sinashganini biladi",
  s7: "Bola til haqiqiy Altairda oldin sinalmasa ham nega ishlaganini tanlaydi",
  s8: "Bola o'z mini-do'koni uchun to'rt katakni bittalab to'ldiradi",
  s9: "Bola uch varaqni o'qib, javobsiz katakni topadi va to'liq to'g'ri varaqni ham tanib oladi",
  s10: "Bola VS Code'da yozilmagan katak nomini qaytaradigan funksiyani to'ldiradi",
  s11: "Bola bo'sh katak dasturchini taxmin qilishga olib kelishini tanlaydi",
  s12: "Bola qaysi katak qiyin bo'lganini aytadi va bir qatorda yozib qoldiradi",
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
          <div className="ach-pop-h">{tr({ uz: '🏅 Nishonlar', ru: '🏅 Значки' })} — {count}/{total}</div>
          {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(earned && earned.has(id)); return (
            <div key={id} className={`ach-pop-row ${got ? 'got' : ''}`}><span className="ach-pop-ic">{got ? a.icon : '🔒'}</span><span className="ach-pop-nm">{tr(a.name)}</span></div>
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
  return <button className={`btn-white-accent${hint ? ' turn-hint' : ''}`} disabled={isOff} onClick={onClick} title={locked ? tr({ uz: "Mentor hali bu sahifaga o'tmadi", ru: 'Ментор ещё не перешёл на эту страницу' }) : (freeRide && disabled ? tr({ uz: "Jonli dars: bajarmasdan ham o'tishingiz mumkin", ru: 'Живой урок: можно идти дальше, даже не выполнив' }) : undefined)} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)', marginLeft: 'auto' }}>{locked ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Дождитесь ментора' }) : tr(label)}</button>;
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

// Scored ekranlar javob kaliti — darslik-jonli TASDIQLADI (senariy 4-bo'limi bilan qatorma-qator).
// Kalit nomi = submitAnswer'ga uzatilgan question_id: testlarda SCREEN_META.id, praktikada zona-nomi.
// -1 = ishtirok-sentinel (server: to'ldirgani = to'g'ri). Praktika signal-zonasi: PRACTICE_BASE+screen.
const INLINE_KEYS = { s3: 1, s5: 0, s7: 2, s11: 1, varaq: -1, practice: -1, tekshiruv: -1, koding: -1 };
// Har scored ekran uchun qayta-tushuntirish. Kalitlar = scored ekran INDEKSI (3/5/7/11).
const RECAPS = {
  3: {
    title: { uz: 'Yozilgan qator hammada bir xil', ru: 'Написанная строка у всех одна и та же' },
    cards: [
      { ic: '🗣', h: { uz: "Og'zaki gap va yozilgan qator", ru: 'Устная фраза и написанная строка' }, body: { uz: <>Og'zaki aytilgan gapni <b>har kim o'zicha tushunadi</b> — yozilgan qator hammaga bir xil ko'rinadi.</>, ru: <>Сказанную вслух фразу <b>каждый понимает по-своему</b> — написанную строку все видят одинаково.</> } },
      { ic: '📄', h: { uz: 'Ish qayerdan boshlanadi', ru: 'С чего начинается работа' }, body: { uz: <>Shuning uchun ish kod bilan emas, <b>yozilgan qator</b> bilan boshlanadi.</>, ru: <>Поэтому работа начинается не с кода, а с <b>написанной строки</b>.</> } },
      { ic: '🙋', h: { uz: "Buni bugun ham sinab ko'ring", ru: 'Попробуйте это уже сегодня' }, body: { uz: <>Og'zaki topshiriqni eshitgan odam uni bir qatorda yozib olsa, keyin qaytib o'qiydi.</>, ru: <>Кто услышал задание вслух и записал его одной строкой, потом сможет его перечитать.</> }, ask: { uz: "Bugun kimdir sizga og'zaki topshiriq berdimi — uni qanday yozib olardingiz?", ru: 'Давал ли вам сегодня кто-нибудь задание устно — как бы вы его записали?' } }
    ]
  },
  5: {
    title: { uz: "O'lchov katagida son turadi", ru: 'В ячейке «Измерение» стоит число' },
    cards: [
      { ic: '📊', h: { uz: 'Katakning savoli', ru: 'Вопрос ячейки' }, body: { uz: <>Bu katak bitta savolga javob beradi: <b>«Natijani qaysi sondan bilamiz?»</b></>, ru: <>Эта ячейка отвечает на один вопрос: <b>«По какому числу узнаем результат?»</b></> } },
      { ic: '🚫', h: { uz: "Sanab bo'lmaydigan qator", ru: 'Строка, которую нельзя посчитать' }, body: { uz: <>Qulaylikni ham, mamnunlikni ham <b>sanab bo'lmaydi</b> — shuning uchun ular bu katakka tushmaydi.</>, ru: <>Ни удобство, ни довольство <b>посчитать нельзя</b> — поэтому они в эту ячейку не попадают.</> } },
      { ic: '🔢', h: { uz: 'Sonni qayerdan olasiz', ru: 'Откуда вы возьмёте число' }, body: { uz: <>Son bugun qanchaligini bilsangiz, ertaga qancha bo'lganini ham ko'rasiz.</>, ru: <>Если знаете, какое число сегодня, завтра увидите, каким оно стало.</> }, ask: { uz: "Bugun sanab ko'rsangiz bo'ladigan qaysi son bor?", ru: 'Какое число вы могли бы посчитать уже сегодня?' } }
    ]
  },
  7: {
    title: { uz: 'Avval aytilgan, keyin yozilgan', ru: 'Сначала сказано, потом написано' },
    cards: [
      { ic: '📞', h: { uz: 'Ish aniq gapdan boshlandi', ru: 'Работа началась с чёткой фразы' }, body: { uz: <>Geyts va Allen nima qurishini (BASIC) va <b>qaysi kompyuter uchun</b> ekanini (Altair) boshidan bilishardi (1975).</>, ru: <>Гейтс и Аллен с самого начала знали, что будут строить (BASIC) и <b>для какого компьютера</b> (Altair) (1975).</> } },
      { ic: '💾', h: { uz: "Ko'rsatuv kuni", ru: 'День показа' }, body: { uz: <>Ular tilni Altairga o'xshab ishlaydigan dasturda sinashdi, haqiqiy Altairda esa til <b>birinchi urinishdayoq</b> ishladi.</>, ru: <>Они проверяли язык в программе, которая работала как Altair, а на настоящем Altair язык заработал <b>с первой же попытки</b>.</> } },
      { ic: '🧭', h: { uz: 'Gap oldin turadi', ru: 'Фраза стоит первой' }, body: { uz: <>Nima qurilishi oldindan aniq bo'lsa, ish bir yo'nalishda ketadi.</>, ru: <>Если заранее ясно, что будет построено, работа идёт в одном направлении.</> }, ask: { uz: "Sizning varag'ingizda nima qurilishi qaysi katakda turibdi?", ru: 'В какой ячейке вашего листа написано, что будет построено?' } }
    ]
  },
  11: {
    title: { uz: "Bo'sh katak — taxmin", ru: 'Пустая ячейка — догадка' },
    cards: [
      { ic: '📝', h: { uz: "Bo'sh katak ishni to'xtatmaydi", ru: 'Пустая ячейка не останавливает работу' }, body: { uz: <>Dasturchi uni <b>o'z taxmini</b> bilan to'ldiradi.</>, ru: <>Программист заполняет её <b>своей догадкой</b>.</> } },
      { ic: '✅', h: { uz: "Shuning uchun to'rttasi ham yoziladi", ru: 'Поэтому заполняются все четыре' }, body: { uz: <>To'rt katak to'lsa, qurilgan narsa <b>siz o'ylagan narsa</b> bo'lib chiqadi.</>, ru: <>Если все четыре ячейки заполнены, построенное окажется <b>тем, что задумали вы</b>.</> } },
      { ic: '🙋', h: { uz: "Bilmasangiz — so'rang", ru: 'Не знаете — спросите' }, body: { uz: <>Varaqni yozayotganda javobini bilmagan katak bo'lsa, taxmin qilmay, <b>so'rab aniqlashtirasiz</b>.</>, ru: <>Если, пока вы пишете лист, попалась ячейка, ответа на которую вы не знаете, — не додумывайте, а <b>спросите и уточните</b>.</> }, ask: { uz: "Qaysi katagingiz eng bo'sh turibdi — nega?", ru: 'Какая ваша ячейка самая пустая — почему?' } }
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
        {card.ask && <div className="rc-ask">{tr({ uz: 'Sinfga savol:', ru: 'Вопрос классу:' })} {tr(card.ask)}</div>}
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
                ? tr({ uz: '📨 Javobingiz qabul qilindi', ru: '📨 Ваш ответ принят' })
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
    <button type="button" className="mnote-chip" onClick={() => setOpen(true)} title={tr({ uz: 'Mentorga eslatma — bosib oching', ru: 'Заметка ментору — нажмите, чтобы открыть' })}>{tr({ uz: 'Eslatma', ru: 'Заметка' })}</button>
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
      {tr({ uz: <>👥 Sinfda: <b>{data.done}</b> bajardi{doing > 0 && <span className="dm-sub">· ✏️ {doing} hali bajarmoqda</span>}</>, ru: <>👥 В классе: <b>{data.done}</b> выполнили{doing > 0 && <span className="dm-sub">· ✏️ {doing} ещё делают</span>}</> })}
    </div>
  );
};

// ============================================================
// 🏊 DARS MA'LUMOTLARI — basseyn guruhiga yozilish (bitta misol-ip, 108-qonun)
// ============================================================
// To'rt katak butun dars bo'ylab AYNAN shu nom va shu savol bilan yuradi (§80 kaskadi):
// s1 · s4 · s8 · s9 · s10 · flashcard · RECAPS · arena.
const KATAKLAR = [
  { k: 'muammo', ic: '🔴', nom: { uz: 'Muammo', ru: 'Проблема' },  savol: { uz: 'Nima qiynayapti?', ru: 'Что мешает?' } },
  { k: 'kim',    ic: '👤', nom: { uz: 'Kim', ru: 'Кто' },     savol: { uz: 'Aynan kim qiynalyapti?', ru: 'Кому именно мешает?' } },
  { k: 'yechim', ic: '🛠', nom: { uz: 'Yechim', ru: 'Решение' },  savol: { uz: 'Nima quriladi?', ru: 'Что будет построено?' } },
  { k: 'olchov', ic: '📊', nom: { uz: "O'lchov", ru: 'Измерение' }, savol: { uz: 'Natijani qaysi sondan bilamiz?', ru: 'По какому числу узнаем результат?' } },
];

// IMZO-VIZUAL «BIR VARAQ»: oq varaq, ustida to'rt katak. Bitta komponent — beshta yuzada
// bir xil ko'rinadi (s1 bo'sh chiziladi · s4 to'ladi · s8 saqlanadi · s9 o'qiladi).
const Varaq = ({ qatorlar = {}, draw = false, clickable = false, onCell, pick = null, wave = false, bar = { uz: 'Varaq', ru: 'Лист' }, written = false }) => (
  <div className={`varaq${draw ? ' draw' : ''}`}>
    <span className="varaq-bar"><span className="bb-dots"><i /><i /><i /></span>{tr(bar)}</span>
    <div className="varaq-cells">
      {KATAKLAR.map((c, i) => {
        const val = tr(qatorlar[c.k]) || '';
        const cls = `vcell${val ? (written ? ' written' : ' filled') : ''}${pick && pick.k === c.k ? (pick.ok ? ' hit' : ' soft') : ''}${!clickable || !wave ? '' : waveCls(true, i, KATAKLAR.length)}`;
        const inner = (
          <>
            <span className="vcell-h">{tr(c.nom)}</span>
            <span className="vcell-q">{tr(c.savol)}</span>
            <span className={`vcell-t${val ? '' : ' empty'}`}>{val || '· · ·'}</span>
          </>
        );
        if (!clickable) return <div key={c.k} className={cls} style={{ '--dd': `${0.55 + i * 0.5}s` }}>{inner}</div>;
        return <button key={c.k} type="button" className={cls} onClick={() => onCell(c.k)}>{inner}</button>;
      })}
    </div>
  </div>
);

// ===== SCREEN 0 — HOOK: bitta gapni uch kishi eshitdi =====
// 104-qonun: ikki tanlov teng og'irlikda; payoff IKKALASIDA BIR XIL, maqtov yo'q.
const HOOK_OPTS = [
  { k: 'qisqa',   ic: '🗣', t: { uz: 'Gap juda qisqa aytilgan', ru: 'Фразу сказали слишком коротко' } },
  { k: 'ozicha',  ic: '🧠', t: { uz: 'Har kim boshqacha tushungan', ru: 'Каждый понял по-своему' } },
];
// 100-qonun: tanlov yoziladi, hech qayerda O'QILMAYDI.
const HOOK_KEY = 'pm-m6d2-hook-choice';
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
    <Stage eyebrow={tr({ uz: 'Kirish · basseyn', ru: 'Вступление · бассейн' })} screen={screen} navContent={<NavNext optionalLive turnBusy={picked === null && !isMentor} disabled={picked === null && !isMentor} label={opened ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' })} onClick={onNext} />}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bitta gap — <span className="italic" style={{ color: T.accent }}>nega</span> uch xil ilova chiqdi?</>, ru: <>Одна фраза — <span className="italic" style={{ color: T.accent }}>почему</span> три разных приложения?</> })}</h2></div>
        <Mentor>{tr({ uz: "Basseynga bordingiz — guruh to'lib qolgan, bekorga qaytdingiz. Siz kabi qaytganlar ko'p. Murabbiy dasturchilarga bitta gap aytdi.", ru: 'Вы пришли в бассейн — группа уже заполнена, и вы вернулись ни с чем. Таких, как вы, много. Тренер сказал программистам одну фразу.' })}</Mentor>
        <div className="gapcard fade-up">{tr({ uz: '🗣 Murabbiy: «Joy band qiladigan ilova kerak».', ru: '🗣 Тренер: «Нужно приложение, чтобы бронировать место».' })}</div>
        <div className="hrow two fade-up delay-1">
          {HOOK_OPTS.map((o, i) => (
            <button key={o.k} className={`hopt${picked === i ? ' on' : ''}${opened ? ' open' : ''}${!opened && optWave ? waveCls(true, i, HOOK_OPTS.length) : ''}`} disabled={opened} onClick={() => pick(i)}>
              <span className="hopt-ic">{o.ic}</span>
              <span className="hopt-nom">{tr(o.t)}</span>
            </button>
          ))}
        </div>
        {opened && (
          <div className="frame-soft fade-step">
            <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: <>Ikkalasi ham to'g'ri. Sabab esa bitta: gap <b>faqat og'zaki</b> aytildi. Og'zaki gapni har kim o'zicha tushunadi. Bugun shu gapni bitta varaqqa yozasiz.</>, ru: <>Оба ответа верны. А причина одна: фразу сказали <b>только устно</b>. Устную фразу каждый понимает по-своему. Сегодня вы запишете эту фразу на один лист.</> })}</p>
          </div>
        )}
        {/* Korpus §97: ovoz-diagrammasi FAQAT jonli darsda — yakka o'quvchida jamoa-murojaati yo'q */}
        {opened && isLive && counts && (
          <div className="hvote fade-step" aria-label={tr({ uz: 'Sinf natijasi', ru: 'Результат класса' })}>
            {HOOK_OPTS.map((o, i) => {
              const n = counts[i];
              const pct = totalVotes ? Math.round((n / totalVotes) * 100) : 0;
              const top = totalVotes > 0 && n === Math.max(...counts);
              return (
                <div key={o.k} className={`hvote-row ${picked === i ? 'mine' : ''} ${top ? 'top' : ''}`}>
                  <span className="hvote-lbl">{o.ic} {tr(o.t)}</span>
                  <span className="hvote-track"><span className="hvote-fill" style={{ width: `${Math.max(pct, totalVotes ? 4 : 0)}%` }} /></span>
                  <span className="hvote-pct mono">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}
        <MentorNote>{tr({ uz: "Ovozlar bo'linadi — ikkala javob ham hayotdan olingan. Bo'linishning o'zi darsga eshik: sinf «gapni yozib qo'ysa bo'lardi» degan fikrga o'zi keladi. Javobni oldindan aytmang.", ru: 'Голоса разделятся — оба ответа взяты из жизни. Само это разделение — дверь в урок: класс сам придёт к мысли «надо было записать». Не говорите ответ заранее.' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — MAQSAD: bo'sh varaq o'z-o'zidan chizilib chiqadi (18-qonun) =====
// 🔴 §125: kataklar BO'SH chiziladi — javob yozilmaydi, aks holda s4 kashfiyoti ochilardi.
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начнём →' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun mini-do'koningiz uchun <span className="italic" style={{ color: T.accent }}>bitta varaq</span> to'ldirasiz.</>, ru: <>Сегодня вы заполните <span className="italic" style={{ color: T.accent }}>один лист</span> для своего мини-магазина.</> })}</h2></div>
      <Mentor>{tr({ uz: "To'rt katak, har birida bitta qator.", ru: 'Четыре ячейки, в каждой одна строка.' })}</Mentor>
      <div className="varaq-wrap"><Varaq draw bar={{ uz: "Bo'sh varaq", ru: 'Пустой лист' }} /></div>
      <MentorNote>{tr({ uz: "Varaq chizilib bo'lgunicha gapirmang — vizualning o'zi tanishtiradi. Kataklar ichi bo'sh: nima yozilishini sinf keyingi ekranlarda topadi.", ru: 'Пока лист рисуется, не говорите — картинка сама всё представит. Ячейки пустые: что в них пишется, класс найдёт на следующих экранах.' })}</MentorNote>
    </div>
  </Stage>
);

// ===== SCREEN 2 — TEORIYA-1: og'zaki gap ↔ yozilgan qator (46-qonun toggle) =====
const S2_CARDS = [
  { ic: '🗣', h: { uz: 'Og\'zaki aytilgan', ru: 'Сказано вслух' }, b: { uz: "Gap yozib olinmasa, keyin har kim uni o'zicha eslaydi. Aytilmay qolgan joyini esa har kim o'zi to'ldiradi.", ru: 'Если фразу не записать, потом каждый вспомнит её по-своему. А то, что не было сказано, каждый додумает сам.' } },
  { ic: '📄', h: { uz: 'Varaqqa yozilgan', ru: 'Записано на листе' }, b: { uz: "Gap o'zgarmay turadi. Uch kishi ham bitta qatorni o'qiydi.", ru: 'Фраза не меняется. Все трое читают одну и ту же строку.' } },
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
  return (
    <Stage eyebrow={tr({ uz: 'Muhokama · bitta gap', ru: 'Обсуждение · одна фраза' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!allSeen && !isMentor} disabled={!allSeen && !isMentor} label={allSeen || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `👆 Yana ${qoldi} kartani oching`, ru: `👆 Откройте ещё карточек: ${qoldi}` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Og'zaki aytilgan gap va yozilgan qator — <span className="italic" style={{ color: T.accent }}>farqi nimada?</span></>, ru: <>Устная фраза и написанная строка — <span className="italic" style={{ color: T.accent }}>в чём разница?</span></> })}</h2></div>
        <Mentor>{tr({ uz: "Bitta gap ikki ko'rinishda turibdi. Ikkala kartani bosib solishtiring.", ru: 'Одна фраза в двух видах. Нажмите на обе карточки и сравните.' })}</Mentor>
        <div className="dfc-grid fade-up delay-1">
          {S2_CARDS.map((c, i) => (
            <button key={tr(c.h)} type="button" className={`dfc${opened[i] ? ' open' : ''}${turnCls(lit, String(i), pend.length > 1)}`} onClick={() => toggle(i)}>
              <span className="dfc-top"><span className="dfc-ic">{c.ic}</span><span className="dfc-h">{tr(c.h)}</span></span>
              <span className="dfc-b">{opened[i] ? tr(c.b) : '· · ·'}</span>
            </button>
          ))}
        </div>
        {allSeen && (
          <div className="xul fade-step">
            <span className="xul-h">{tr({ uz: "Og'zaki gapni har kim o'zicha tushunadi. Yozilgan qator esa hammaga bir xil ko'rinadi.", ru: 'Устную фразу каждый понимает по-своему. А написанную строку все видят одинаково.' })}</span>
            <p className="xul-b">{tr({ uz: 'Shuning uchun ish kod bilan emas, yozilgan qator bilan boshlanadi.', ru: 'Поэтому работа начинается не с кода, а с написанной строки.' })}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== TEST-EKRAN sarlavhasi (105-qonun: .h-ask) =====
const TestQ = ({ ask }) => <h2 className="title h-ask">{ask}</h2>;

const Screen3 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · yozilgan qator', ru: 'Проверка · написанная строка' })} scope="module-mikro"
    ctaLabel={tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' })} revealPrefix={tr({ uz: "To'g'ri javob", ru: 'Верный ответ' })}
    question={<TestQ ask={tr({ uz: "Nima kerakligini sizga og'zaki aytishdi. Ish boshlashdan oldin birinchi nima qilasiz?", ru: 'Вам устно сказали, что нужно. Что вы сделаете первым делом, прежде чем начать работу?' })} />}
    questionText={tr({ uz: "Og'zaki aytilgan gapdan keyin birinchi nima qilasiz", ru: 'Что вы делаете первым после устной фразы' })}
    options={[tr({ uz: 'Eshitganimni yodda saqlab, kod yozaman', ru: 'Запомню услышанное и начну писать код' }), tr({ uz: 'Eshitganimni qatorga yozib olaman', ru: 'Запишу услышанное строкой' }), tr({ uz: 'Qatorni ish tugagach yozib qo\'yaman', ru: 'Запишу строку, когда работа закончится' }), tr({ uz: "Dasturchilarga og'zaki aytaman", ru: 'Устно скажу программистам' })]}
    correctIdx={1}
    explainCorrect={tr({ uz: "Yozilgan qator hammaga bir xil ko'rinadi. Og'zaki gap esa har kimning xotirasida boshqacha qoladi.", ru: 'Написанную строку все видят одинаково. А устная фраза у каждого остаётся в памяти по-разному.' })}
    explainWrong={{
      0: tr({ uz: "Yodda saqlangan gap ham og'zaki gapdek — boshqa odam uni boshqacha tushunadi.", ru: 'Фраза, которую просто запомнили, — та же устная фраза: другой человек поймёт её иначе.' }),
      2: tr({ uz: "Ish tugagach yozilgan qator kech qoladi: kim nima qurishini oldindan bilmaydi.", ru: 'Строка, написанная после работы, опаздывает: никто заранее не знает, кто что строит.' }),
      3: tr({ uz: "Og'zaki aytilsa, uch dasturchi uch xil tushunadi.", ru: 'Если сказать устно, три программиста поймут по-разному.' }),
      default: tr({ uz: "Avval eshitganingizni qatorga yozasiz — yozilgan qator hammaga bir xil ko'rinadi.", ru: 'Сначала вы записываете услышанное строкой — написанную строку все видят одинаково.' })
    }}
  />
);
// ===== SCREEN 4 — YADRO: BIR VARAQ (markaziy mexanika) =====
// 1-bosqich: bitta og'zaki gapdan uch xil ilova chiqadi. 2-bosqich: o'quvchi murabbiydan
// to'rt savolni O'ZI so'raydi, javob varaqning o'z katagiga yoziladi, keyin qayta quriladi.
// 🔴 98b: mentor javoblarni AYTMAYDI — ular faqat bosilgandan keyin ochiladi.
const VARAQ_KEY = 'pm-m6d2-varaq';
const readVaraqState = () => { try { const v = JSON.parse(localStorage.getItem(VARAQ_KEY) || 'null'); return v && typeof v === 'object' ? v : {}; } catch { return {}; } };
const S4_JAVOB = {
  muammo: { uz: "Odamlar kelib, guruh to'lib qolganini ko'radi va bekorga qaytadi", ru: 'Люди приходят, видят, что группа заполнена, и уходят ни с чем' },
  kim: { uz: 'Haftada ikki marta suzishga keladiganlar', ru: 'Те, кто приходит плавать два раза в неделю' },
  yechim: { uz: "Bo'sh joyni ko'rsatib, joyni band qiladigan ilova", ru: 'Приложение, которое показывает свободные места и бронирует место' },
  olchov: { uz: <>Bekorga qaytganlar 10 tadan 2 taga tushsin <i>(oldin 10 tadan 10 ta → keyin 2 ta)</i></>, ru: <>Пусть из каждых 10 ни с чем уходят только 2 <i>(было 10 из 10 → станет 2)</i></> },
};
const S4_QAYTA = [{ uz: "Bo'sh joy ko'rinadi", ru: 'Видны свободные места' }, { uz: 'Joy band qilinadi', ru: 'Место бронируется' }];
const TIP_SEC = 42; // Kashfiyot-himoyasi: ipucha bir marta chiqadi va javobni AYTMAYDI
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [hol] = useState(() => readVaraqState());
  const bosq1 = true; // F-1004-04: uch dasturchi natijasi hook'da (s0) — bu ekran faqat varaq
  const [sorash, setSorash] = useState(() => Array.isArray(storedAnswer?.sorash) ? storedAnswer.sorash : (hol.sorash || [])); // F-0914-10: saqlangan javob massiv bo'lmasa — bo'sh (oq ekran himoyasi)
  const [bosq2, setBosq2] = useState(() => !!((storedAnswer && storedAnswer.bosq2) || hol.bosq2));
  const [pick, setPick] = useState(null);
  const [sec, setSec] = useState(0);
  const pickT = useRef(null);
  const savedRef = useRef({ live: false, ach: !!(storedAnswer && storedAnswer.correct) });
  const hammasi = sorash.length === KATAKLAR.length;
  useEffect(() => () => clearTimeout(pickT.current), []);
  useEffect(() => {
    if (!bosq1 || hammasi || isMentor) return;
    const t = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [bosq1, hammasi, isMentor]);
  // 🔴 Nishon-triggeri KASHFIYOT lahzasida otmaydi (PmLesson25 pretsedenti): correct: true
  // faqat 2-bosqich ochilgandan KEYIN yuboriladi. Aks holda 4 soniyalik bayram-qoplamasi
  // varaq qayta qurilayotgan aynan o'sha lahzada ekranni yopib qo'yadi. Jonli-signal esa
  // eskicha — to'rt savol berilishi bilan bir marta ketadi (ball vaqti o'zgarmaydi).
  useEffect(() => {
    if (!hammasi) return;
    const done2 = !!bosq2;
    if (!savedRef.current.live && (storedAnswer === undefined || !storedAnswer.solved)) {
      savedRef.current.live = true;
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'varaq', 0, true, 0);
    }
    if (savedRef.current.ach) return;
    if (done2) savedRef.current.ach = true;
    onAnswer(screen, { stage: 'varaq', screenIdx: screen, bosq1: true, sorash, bosq2: done2, solved: true, correct: done2 });
  }, [hammasi, bosq2]); // eslint-disable-line
  useEffect(() => { try { localStorage.setItem(VARAQ_KEY, JSON.stringify({ bosq1, sorash, bosq2 })); } catch {} }, [sorash, bosq2]);
  const sora = (k) => {
    if (isMentor) return;
    setSorash(p => (p.includes(k) ? p : [...p, k]));
    setPick({ k, ok: true });
    clearTimeout(pickT.current);
    pickT.current = setTimeout(() => setPick(null), 2200);
  };
  const qatorlar = Object.fromEntries(sorash.map(k => [k, S4_JAVOB[k]]));
  const pend = KATAKLAR.map(c => c.k).filter(k => !sorash.includes(k));
  const lit = useTurnWalk(pend, bosq1 && !isMentor);
  const tip = bosq1 && !hammasi && !isMentor && sec >= TIP_SEC;
  const tugadi = bosq2 || isMentor;
  const navLabel = tugadi ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : !hammasi ? tr({ uz: `① Varaq katagini bosing (${sorash.length}/4)`, ru: `① Нажмите ячейку листа (${sorash.length}/4)` })
      : tr({ uz: '② Endi nima qurishini oching', ru: '② Теперь откройте, что построят' });
  return (
    <Stage eyebrow={tr({ uz: 'Sinov · bitta varaq', ru: 'Опыт · один лист' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!tugadi} disabled={!tugadi} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(7px,1vw,10px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>To'rt savolni bering va <span className="italic" style={{ color: T.accent }}>varaqni</span> to'ldiring.</>, ru: <>Задайте четыре вопроса и заполните <span className="italic" style={{ color: T.accent }}>лист</span>.</> })}</h2></div>
        {/* F-1004-04 · 163-qonun: bitta vizual — to'rt katakli varaq. Katak = murabbiyga savol, javob o'sha katakka yoziladi.
            Murabbiy gapi va PRD izohi Mentor gapida; uch dasturchi natijasi hook'da (s0). */}
        {!bosq2
          ? <Mentor>{tr({ uz: <>Murabbiy: «Basseynga joy band qiladigan ilova kerak.» Varaq katagini bosing — bu unga savol, javob o'sha katakka yoziladi.</>, ru: <>Тренер: «Нужно приложение, чтобы бронировать место в бассейне.» Нажмите ячейку листа — это вопрос тренеру, ответ впишется в ту же ячейку.</> })}</Mentor>
          : <Mentor>{tr({ uz: <>Bunday varaqni <b>PRD</b> deyishadi — mahsulot talablari hujjati (Product Requirements Document). Katta jamoada u bir necha sahifa, bizda — to'rt katak.</>, ru: <>Такой лист называют <b>PRD</b> — документ требований к продукту (Product Requirements Document). В большой команде это несколько страниц, у нас — четыре ячейки.</> })}</Mentor>}
        <div className="s4-one">
          <Varaq qatorlar={qatorlar} pick={pick} clickable={!isMentor && !hammasi} onCell={sora} wave={!!lit && !hammasi} bar={{ uz: 'Basseyn ilovasi', ru: 'Приложение бассейна' }} />
          {tip && <p className="bhint fade-step">{tr({ uz: "Yana bitta katakni bosing.", ru: 'Нажмите ещё одну ячейку.' })}</p>}
          {hammasi && !bosq2 && (
            <button type="button" className="s4-run turn-ring fade-step" style={{ alignSelf: 'flex-end' }} onClick={() => setBosq2(true)}>{tr({ uz: '▶ Endi nima qurishadi?', ru: '▶ Что построят теперь?' })}</button>
          )}
          {bosq2 && (
            <div className="qayta fade-step">
              {[0, 1, 2].map(i => (
                <span key={i} className="qayta-card">
                  {S4_QAYTA.map(t => <i key={tr(t)}>{tr(t)}</i>)}
                </span>
              ))}
            </div>
          )}
          {bosq2 && <div className="frame-success fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: 'Bitta varaq — uch dasturchida bir xil natija.', ru: 'Один лист — у трёх программистов одинаковый результат.' })}</p></div>}
          <StudentPracticePulse live={live} screen={screen} />
          <MentorPracticeStats live={live} screen={screen} label={tr({ uz: "To'rt savolni bergani", ru: 'Задали четыре вопроса' })} />
        </div>
        <MentorNote>{tr({ uz: "Bolalar odatda birinchi bosqichda to'xtaydi. Uchala ilova ochilgach so'rang: «murabbiydan nimani so'rash kerak edi?» — savol-tugmalari shu lahzada ochiq. Javoblarni oldindan aytmang. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'Дети обычно останавливаются на первом этапе. Когда все три приложения откроются, спросите: «что нужно было спросить у тренера?» — кнопки-вопросы в этот момент открыты. Не говорите ответы заранее. Эту работу выполняют ученики, вы наблюдаете; «Продолжить» для вас открыта.' })}</MentorNote>
      </div>
    </Stage>
  );
};

const Screen5 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: "Tekshiruv · o'lchov katagi", ru: 'Проверка · ячейка «Измерение»' })} scope="module-mikro"
    ctaLabel={tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' })} revealPrefix={tr({ uz: "To'g'ri javob", ru: 'Верный ответ' })}
    question={<TestQ ask={tr({ uz: "«Natijani qaysi sondan bilamiz?» katagiga qaysi qator yozilishi mumkin?", ru: 'Какую строку можно вписать в ячейку «По какому числу узнаем результат?»' })} />}
    questionText={tr({ uz: "«Natijani qaysi sondan bilamiz?» katagiga qaysi qator yoziladi", ru: 'Какая строка вписывается в ячейку «По какому числу узнаем результат?»' })}
    options={[tr({ uz: 'Kunda 30 odam joy band qiladi', ru: 'В день 30 человек бронируют место' }), tr({ uz: 'Uch murabbiy ham ilovadan mamnun', ru: 'Все три тренера довольны приложением' }), tr({ uz: 'Ilova ikki barobar qulay bo\'ladi', ru: 'Приложение станет вдвое удобнее' }), tr({ uz: 'Ilova hammaga yoqib qoladi', ru: 'Приложение всем понравится' })]}
    correctIdx={0}
    explainCorrect={tr({ uz: "Bu katakda sanab bo'ladigan son turadi. Qulaylikni ham, mamnunlikni ham sanab bo'lmaydi.", ru: 'В этой ячейке стоит число, которое можно посчитать. Ни удобство, ни довольство посчитать нельзя.' })}
    explainWrong={{
      1: tr({ uz: "«Uch murabbiy» — o'zgaradigan son emas, mamnunlikni esa sanab bo'lmaydi.", ru: '«Три тренера» — число, которое не меняется, а довольство посчитать нельзя.' }),
      2: tr({ uz: "«Ikki barobar qulay»ni sanab bo'lmaydi — qulaylikni o'lchaydigan son yo'q.", ru: '«Вдвое удобнее» посчитать нельзя — нет числа, которое измеряет удобство.' }),
      3: tr({ uz: "«Yoqib qoladi»ni sanab bo'lmaydi — bu katakda son turadi.", ru: '«Понравится» посчитать нельзя — в этой ячейке стоит число.' }),
      default: tr({ uz: "Bu katakda sanab bo'ladigan son turadi: nechta odam, necha daqiqa yoki necha kun.", ru: 'В этой ячейке стоит число, которое можно посчитать: сколько человек, сколько минут или сколько дней.' })
    }}
  />
);
// ===== SCREEN 6 — HAQIQIY VOQEA: 4 slayd + 2 bashorat + ko'prik (33/56/91b-qonun) =====
// 🔴 Bosqich-hisoblagichi UZLUKSIZ: 1/7 … 7/7 — bashorat-bosqichi ham, ko'prik ham sanaladi.
// 🔴 Ikki bashorat IKKI O'LCHOVDA: (1) tilning HOLATI, (2) sinov JOYI — biri ikkinchisini
// oshkor qilmaydi. Bank raqamsiz: yagona sana — 1975.
// 🖥 ALTAIR 8800 MOCKUPI (F-0921-23) — 1975-yilgi kompyuterning old paneli: lampochkalar qatori
// va tumblerlar. O'quvchi "kompyuter" deganda ekran va klaviaturani tasavvur qiladi; bu mashinada
// ikkalasi ham yo'q edi — shuni ko'rsatish keysning o'zagi (Geyts va Allen tilni qo'llanma va Altairga o'xshatilgan dasturda yozib sinagan).
// F-1004-02 · 186-qonun: Altair paneli butun voqea bo'yi turadi va bosqichga qarab o'zgaradi (emoji o'rniga).
// stage: 'kirish' — panel · 'vada' — chiroqlar o'chiq, BASIC hali yo'q · 'yozish' — 2 oy, kod lentasi o'sadi ·
// 'korsatuv' — chiroqlar yonadi, teletayp «MEMORY SIZE?» · 'aniq' — aniq gap varaqqa yozilgan.
const ALT_LEDS = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1];
const AltairMock = ({ stage = 'kirish' }) => (
  <div className={`alt-wrap st-${stage}`}>
    <div className="alt-box" role="img" aria-label={tr({ uz: "Altair 8800 — 1975-yilgi kompyuter: ekran ham, klaviatura ham yo'q; old panelida lampochkalar va kichik kalitlar", ru: 'Altair 8800 — компьютер 1975 года: нет ни экрана, ни клавиатуры; на передней панели лампочки и маленькие переключатели' })}>
      <div className="alt-head">
        <span className="alt-brand">ALTAIR 8800</span>
        <span className="alt-year">1975</span>
      </div>
      <div className="alt-leds">
        {ALT_LEDS.map((on, i) => <i key={i} className={`alt-led ${on && stage !== 'vada' && stage !== 'yozish' ? 'on' : ''}`} style={{ '--i': i }} />)}
      </div>
      <div className="alt-switches">
        {[0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0].map((up, i) => <i key={i} className={`alt-sw ${up ? 'up' : ''}`} />)}
      </div>
      {stage === 'kirish' && <p className="alt-note">{tr({ uz: "ekran ham, klaviatura ham yo'q — faqat kichik kalitlar va lampochkalar", ru: 'нет ни экрана, ни клавиатуры — только маленькие переключатели и лампочки' })}</p>}
    </div>
    {stage === 'vada' && <div className="alt-tag">{tr({ uz: 'BASIC — hali yozilmagan', ru: 'BASIC — ещё не написан' })}</div>}
    {stage === 'yozish' && (
      <div className="alt-tape" aria-hidden="true">
        <span className="alt-tape-h">{tr({ uz: 'BASIC · yozilmoqda', ru: 'BASIC · пишется' })}</span>
        <span className="alt-tape-bar"><i /></span>
        <span className="alt-tape-t">{tr({ uz: '≈ 2 oy', ru: '≈ 2 месяца' })}</span>
      </div>
    )}
    {(stage === 'korsatuv' || stage === 'aniq') && (
      <div className="alt-tty" aria-hidden="true">
        <span className="alt-tty-l">MEMORY SIZE?</span>
        {stage === 'aniq' && <span className="alt-tty-l">OK</span>}
      </div>
    )}
    {stage === 'aniq' && (
      <div className="alt-sheet">
        <span><b>{tr({ uz: 'Nima', ru: 'Что' })}</b>{tr({ uz: 'BASIC tili', ru: 'язык BASIC' })}</span>
        <span><b>{tr({ uz: 'Kim uchun', ru: 'Для кого' })}</b>{tr({ uz: 'Altair egalari', ru: 'владельцы Altair' })}</span>
      </div>
    )}
  </div>
);

const K_SLIDES = [
  { ic: '', h: { uz: '1975-yil', ru: '1975 год' },
    body: { uz: <>Ikki yigit — Bill Geyts va Pol Allen — jurnalda yangi kompyuter haqida o'qib qoldi. Uning nomi Altair edi.</>, ru: <>Два парня — Билл Гейтс и Пол Аллен — прочитали в журнале о новом компьютере. Он назывался Altair.</> },
    vis: <AltairMock stage="kirish" /> },
  { ic: '', h: null, body: null,
    predict: { ask: { uz: "Ular kompyuterni chiqargan kompaniyaga murojaat qilib: «Bizda shu kompyuter uchun til bor», deyishdi. O'sha paytda til qay holatda edi?", ru: 'Они обратились в компанию, которая выпустила этот компьютер, и сказали: «У нас есть язык для этого компьютера». В каком состоянии был язык в тот момент?' }, chips: [
      { ic: '', t: { uz: 'Tayyor turgan edi', ru: 'Был уже готов' } },
      { ic: '', t: { uz: 'Yarmi yozilgan edi', ru: 'Был написан наполовину' } },
      { ic: '', t: { uz: 'Hali yozilmagan edi', ru: 'Ещё не был написан' } },
    ], ans: 2,
      hit: { uz: 'Topdingiz! Hali yozilmagan edi', ru: 'Угадали! Он ещё не был написан' },
      miss: { uz: 'Adashdingiz — asl javob: hali yozilmagan edi', ru: 'Не угадали — на самом деле: он ещё не был написан' } } },
  { ic: '', h: { uz: "Va'da", ru: 'Обещание' },
    body: { uz: <>Ular kompaniyaga: «Bizda Altair uchun BASIC tili bor», deyishdi. BASIC — kompyuterga buyruq yoziladigan tilning nomi. Aslida bu til hali yozilmagan edi — lekin nima qurilishi va qaysi kompyuter uchun ekani aniq edi.</>, ru: <>Они сказали компании: «У нас есть язык BASIC для Altair». BASIC — название языка, на котором пишут команды компьютеру. На самом деле этот язык ещё не был написан — но было ясно, что будет построено и для какого компьютера.</> },
    vis: <AltairMock stage="vada" /> },
  { ic: '', h: { uz: 'Taxminan ikki oy', ru: 'Примерно два месяца' },
    body: { uz: <>Ular tilni Altair ichidagi protsessorning qo'llanmasiga qarab yozishdi. Pol Allen universitetdagi katta kompyuterda Altairga o'xshab ishlaydigan dastur yasadi — tilni o'sha yerda sinashdi.</>, ru: <>Они писали язык по руководству к процессору, который стоял внутри Altair. Пол Аллен сделал на большом университетском компьютере программу, которая работала как Altair, — там они и проверяли язык.</> },
    vis: <AltairMock stage="yozish" /> },
  { ic: '', h: null, body: null,
    predict: { ask: { uz: 'Sizningcha, tilni haqiqiy Altairda birinchi marta qachon ishga tushirishdi?', ru: 'Как вы думаете, когда язык впервые запустили на настоящем Altair?' }, chips: [
      { ic: '', t: { uz: 'Ish boshida, uyda', ru: 'В начале работы, дома' } },
      { ic: '', t: { uz: "Yarim yo'lda, zavodda", ru: 'На полпути, на заводе' } },
      { ic: '', t: { uz: "Faqat ko'rsatuv kuni", ru: 'Только в день показа' } },
    ], ans: 2,
      hit: { uz: "Topdingiz! Faqat ko'rsatuv kuni", ru: 'Угадали! Только в день показа' },
      miss: { uz: "Adashdingiz — asl javob: faqat ko'rsatuv kuni", ru: 'Не угадали — на самом деле: только в день показа' } } },
  { ic: '', h: { uz: 'Ko\'rsatuv kuni', ru: 'День показа' },
    body: { uz: <>Pol Allen kompaniyaga uchib bordi va tilni haqiqiy Altairga birinchi marta yukladi. Til <b>birinchi urinishdayoq</b> ishladi. Microsoft shundan boshlandi.</>, ru: <>Пол Аллен прилетел в компанию и впервые загрузил язык в настоящий Altair. Язык заработал <b>с первой же попытки</b>. С этого и начался Microsoft.</> },
    vis: <AltairMock stage="korsatuv" /> },
  { ic: '', h: { uz: 'Ish aniq gapdan boshlandi', ru: 'Работа началась с чёткой фразы' },
    body: { uz: <>Nima qurilishi (BASIC tili) va kim uchun (Altair egalari) boshidan aniq edi. Shuning uchun ular ikki oy davomida bitta maqsad sari ishladi. Sizning varag'ingiz — xuddi shunday aniq gapning to'rt katakka yozilgan shakli.</>, ru: <>Что будет построено (язык BASIC) и для кого (владельцы Altair), было ясно с самого начала. Поэтому два месяца они работали на одну цель. Ваш лист — это такая же чёткая фраза, записанная в четыре ячейки.</> },
    vis: <AltairMock stage="aniq" /> },
];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gateK = useContext(LiveGateCtx) || {};
  const isMentorK = !!(gateK.live && gateK.live.mode === 'mentor');
  const [i, setI] = useState(0);
  const [bets, setBets] = useState({});
  // Nuqta faqat ALLAQACHON ko'rilgan bosqichga yo'l beradi: bashoratdan oldin javob-slaydiga
  // sakrab o'tib bo'lmaydi (oldinga yurish faqat NavNext orqali).
  const [maxSeen, setMaxSeen] = useState(0);
  useEffect(() => { setMaxSeen(m => Math.max(m, i)); }, [i]);
  const last = i === K_SLIDES.length - 1;
  useEffect(() => { if (last && storedAnswer === undefined) onAnswer(screen, { correct: true }); }, [last]); // eslint-disable-line
  const c = K_SLIDES[i];
  const bet = c.predict ? bets[i] : undefined;
  const betPending = !!(c.predict && bet === undefined);
  const betHint = useTurnHint(betPending && !isMentorK);
  // 44-qonun oilasi: mentor rejimida ham javob OLDINDAN ochilmaydi — u ham bosib ochadi.
  const showSlide = c.h && (!c.predict || bet !== undefined);
  return (
    <Stage eyebrow={tr({ uz: '💾 Haqiqiy voqea', ru: '💾 Реальная история' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={betPending && !isMentorK} disabled={betPending && !isMentorK} label={betPending && !isMentorK ? tr({ uz: "Avval o'zingiz belgilang", ru: 'Сначала отметьте сами' }) : last ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Keyingi bosqich (${i + 1}/${K_SLIDES.length})`, ru: `Следующий шаг (${i + 1}/${K_SLIDES.length})` })} onClick={last ? onNext : () => setI(i + 1)} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Microsoft <span className="italic" style={{ color: T.accent }}>qanday</span> boshlandi?</>, ru: <><span className="italic" style={{ color: T.accent }}>Как</span> начался Microsoft?</> })}</h2></div>
        {c.predict && (
          <div className={`kp-bet fade-step${bet !== undefined ? ' answered' : ''}`} key={`b${i}`}>
            {/* 🔴 ETALON 22 (sanoq-mosligi): bashoratli bosqichda ham hisoblagich uzluksiz
                turadi (1·2·…·7) va javobdan keyin ham qoladi — u SHU kartada yashaydi. */}
            <span className="k-slide-eyebrow">{bet === undefined ? tr({ uz: "🎲 Avval o'zingiz belgilab ko'ring", ru: '🎲 Сначала попробуйте отметить сами' }) : tr({ uz: 'Haqiqiy voqea', ru: 'Реальная история' })} · {i + 1} / {K_SLIDES.length}</span>
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
                    {ch.ic && <span className="kp-ic">{ch.ic}</span>}{tr(ch.t)}
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
            {!c.predict && <span className="k-slide-eyebrow">{tr({ uz: 'Haqiqiy voqea', ru: 'Реальная история' })} · {i + 1} / {K_SLIDES.length}</span>}
            {c.ic && <div className="k-slide-ic">{c.ic}</div>}
            <h3 className="k-slide-h">{tr(c.h)}</h3>
            {c.vis}
            <p className="k-slide-body">{tr(c.body)}</p>
          </div>
        )}
        <div className="k-dots">{K_SLIDES.map((_, k) => {
          const ochiq = k <= maxSeen && !(betPending && k > i);
          return <button key={k} className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} disabled={!ochiq} onClick={() => ochiq && setI(k)} aria-label={tr({ uz: `${k + 1}-bosqich`, ru: `Шаг ${k + 1}` })} title={ochiq ? undefined : tr({ uz: 'Avval shu bosqichni tugating', ru: 'Сначала завершите этот шаг' })} />;
        })}</div>
      </div>
    </Stage>
  );
};

const Screen7 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: "Tekshiruv · ko'rsatuv kuni", ru: 'Проверка · день показа' })} scope="module-mikro"
    ctaLabel={tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' })} revealPrefix={tr({ uz: "To'g'ri javob", ru: 'Верный ответ' })}
    question={<TestQ ask={tr({ uz: 'Geyts va Allen tilni haqiqiy Altairda oldin sinamagan edi. Til nega baribir ishladi?', ru: 'Гейтс и Аллен до этого ни разу не проверяли язык на настоящем Altair. Почему он всё равно заработал?' })} />}
    questionText={tr({ uz: 'Til nega birinchi urinishdayoq ishladi', ru: 'Почему язык заработал с первой попытки' })}
    options={[tr({ uz: "Ular Altairni oldindan sinab ko'rgan edi", ru: 'Они заранее опробовали Altair' }), tr({ uz: 'Kompaniya tayyor tilni ularga bergan edi', ru: 'Компания дала им готовый язык' }), tr({ uz: 'Nima va qaysi kompyuter uchun qurishni aniq bilishgan', ru: 'Точно знали, что строить и для какого компьютера' }), tr({ uz: 'Ular tilni bir necha yil davomida puxta yozib chiqishgan', ru: 'Они несколько лет подряд тщательно писали этот язык' })]}
    correctIdx={2}
    explainCorrect={tr({ uz: "Ular nima qurishni (BASIC) va qaysi kompyuter uchun ekanini (Altair) aniq bilishgan. Shuning uchun Altair protsessorining qo'llanmasiga qarab yozishdi va unga o'xshatilgan dasturda sinashdi. Aniq maqsad bo'lgani uchun ish bir yo'nalishda ketdi.", ru: 'Они точно знали, что будут строить (BASIC) и для какого компьютера (Altair). Поэтому писали язык по руководству к процессору Altair и проверяли в программе, которая работала как Altair. Цель была ясной — поэтому работа шла в одном направлении.' })}
    explainWrong={{
      0: tr({ uz: "Tilni haqiqiy Altairda faqat ko'rsatuv kuni ishga tushirishdi — oldindan sinab ko'rishning iloji yo'q edi.", ru: 'Язык запустили на настоящем Altair только в день показа — проверить заранее было невозможно.' }),
      1: tr({ uz: "Tilni kompaniya emas, Geyts va Allenning o'zlari yozdi.", ru: 'Язык написала не компания, а сами Гейтс и Аллен.' }),
      3: tr({ uz: 'Tilni yillar emas, taxminan ikki oy davomida yozishdi.', ru: 'Язык писали не годами, а примерно два месяца.' }),
      default: tr({ uz: "Nima qurilishi va qaysi kompyuter uchun ekani boshidan aniq edi.", ru: 'Что будет построено и для какого компьютера, было ясно с самого начала.' })
    }}
  />
);
// ===== SCREEN 8 — YOZISH-EKRANI: to'rt katak BITTALAB (48/80/85/92/106d-qonun) =====
// Chiqish-artefakt (registr muhri): { prd: { muammo, kim, yechim, metrika }, savedAt }.
// 🔴 Ekranda katak nomi «O'lchov», JSON kalitida `metrika` — kalit m6-06 va m6-12 uchun.
const PRD_KEY = 'pm-m6d2-prd';
const DRAFT_KEY = 'pm-m6d2-prd-draft';
const readDraft = () => { try { const v = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); return v && typeof v === 'object' ? v : {}; } catch { return {}; } };
// Bo'sh-so'zlar (106d(c), dars o'z lug'atidan): faqat shular yozilsa — savol qaytariladi.
const BOSH_SOZ = { uz: /(yaxshi|qulay|chiroyli|zamonaviy|qiziqarli)/gi, ru: /(\u0445\u043e\u0440\u043e\u0448\u0435\u0435|\u0445\u043e\u0440\u043e\u0448\u0438\u0439|\u0445\u043e\u0440\u043e\u0448\u043e|\u0443\u0434\u043e\u0431\u043d\u043e\u0435|\u0443\u0434\u043e\u0431\u043d\u044b\u0439|\u0443\u0434\u043e\u0431\u043d\u043e|\u043a\u0440\u0430\u0441\u0438\u0432\u043e\u0435|\u043a\u0440\u0430\u0441\u0438\u0432\u044b\u0439|\u043a\u0440\u0430\u0441\u0438\u0432\u043e|\u0441\u043e\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u043e\u0435|\u0441\u043e\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0439|\u0438\u043d\u0442\u0435\u0440\u0435\u0441\u043d\u043e\u0435|\u0438\u043d\u0442\u0435\u0440\u0435\u0441\u043d\u044b\u0439|\u0438\u043d\u0442\u0435\u0440\u0435\u0441\u043d\u043e)/gi };
const HAMMA_SOZ = { uz: /(hamma odam|hamma|foydalanuvchilar|foydalanuvchi|odamlar)/gi, ru: /(\u0432\u0441\u0435 \u043b\u044e\u0434\u0438|\u0432\u0441\u0435|\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0438|\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c|\u043b\u044e\u0434\u0438)/gi };
const APO = "['\\u02BB\\u2019]";
const normQator = (s) => s.toLowerCase().replace(new RegExp(APO, 'g'), '').replace(tr({ uz: /[^a-z0-9 ]+/gi, ru: /[^a-z0-9\u0400-\u04FF ]+/gi }), ' ').replace(/\s+/g, ' ').trim();
const qolganMatn = (s, re) => normQator(s).replace(re, ' ').replace(/\s+/g, ' ').trim();
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [saqlangan] = useState(() => readDraft());
  const [prd, setPrd] = useState(() => (storedAnswer && storedAnswer.prd) || saqlangan.prd || {});
  // PmLesson14 s8 naqshi: yarim yozilgan qator «Orqaga»da yo'qolmaydi
  const [draft, setDraft] = useState(() => saqlangan.draft || '');
  const [edit, setEdit] = useState(null);
  const [focus, setFocus] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);
  const yozilgan = KATAKLAR.filter(c => (prd[c.k] || '').trim().length > 0).length;
  const done = yozilgan === KATAKLAR.length;
  const savedRef = useRef(false);
  const idx = edit === null ? Math.min(yozilgan, KATAKLAR.length - 1) : edit;
  const cur = KATAKLAR[idx];
  const uzun = draft.trim().length >= 10;
  // 106d ikki tomonlama javob-qatorlari (§130: ✅ faqat CHINDAN tekshirilgan narsani aytadi)
  const sonBor = /\d/.test(draft);
  const bosh = cur.k === 'muammo' && uzun && qolganMatn(draft, tr(BOSH_SOZ)).length < 5;
  const hammaYolgiz = cur.k === 'kim' && uzun && qolganMatn(draft, tr(HAMMA_SOZ)).length < 5;
  const takror = cur.k === 'yechim' && uzun && !!prd.muammo && normQator(draft) === normQator(prd.muammo);
  const sonYoq = cur.k === 'olchov' && uzun && !sonBor;
  const canSave = uzun && !takror;
  const inputTurn = useTurnHint(!done && !uzun && !focus && !isMentor);
  useEffect(() => {
    if (!done || savedRef.current) return;
    savedRef.current = true;
    if (storedAnswer === undefined || !storedAnswer.solved) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, prd, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  useEffect(() => {
    if (!done) return;
    const payload = { prd: { muammo: prd.muammo, kim: prd.kim, yechim: prd.yechim, metrika: prd.olchov }, savedAt: Date.now() };
    try { localStorage.setItem(PRD_KEY, JSON.stringify(payload)); } catch {}
  }, [prd, done]);
  // PmLesson14 s8 naqshi: yozilgan kataklar ham, yarim qator ham «Orqaga»da yo'qolmaydi
  useEffect(() => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ prd, draft })); } catch {} }, [prd, draft]);
  const setDraftSaved = (v) => setDraft(v);
  const save = () => {
    if (!canSave) return;
    const val = draft.trim();
    setPrd(p => ({ ...p, [cur.k]: val }));
    setDraftSaved('');
    setEdit(null);
  };
  const startEdit = (k) => {
    const pos = KATAKLAR.findIndex(c => c.k === k);
    if (pos < 0) return;
    setEdit(pos); setDraftSaved(prd[k] || '');
  };
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : yozilgan === 0 ? tr({ uz: '① Birinchi katakni yozing', ru: '① Заполните первую ячейку' })
      : tr({ uz: `② Yana ${KATAKLAR.length - yozilgan} katak qoldi`, ru: `② Осталось ячеек: ${KATAKLAR.length - yozilgan}` });
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish', ru: 'Самостоятельная работа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Mini-do'koningiz uchun <span className="italic" style={{ color: T.accent }}>bitta varaq</span> to'ldiring.</>, ru: <>Заполните <span className="italic" style={{ color: T.accent }}>один лист</span> для своего мини-магазина.</> })}</h2></div>
        <Mentor>{tr({ uz: 'Har bir katakning bitta savoli bor — javobini bitta qatorda yozing.', ru: 'У каждой ячейки есть один вопрос — ответ напишите одной строкой.' })}</Mentor>
        {/* 80a: havoda to'rt doira — yozilgani yashil ✓, joriysi halqada, kelgusi punktir */}
        <div className="stps fade-up">
          {KATAKLAR.map((c, k) => (
            <span key={c.k} className={`stp ${prd[c.k] ? 'done' : idx === k ? 'on' : ''}`}><i>{prd[c.k] ? '✓' : k + 1}</i>{tr(c.nom)}</span>
          ))}
        </div>
        <div className="split">
          <Col gap={9}>
            {/* 80b: ekranning yagona kartasi — katak nomi, katakning savoli, bitta maydon */}
            {(!done || edit !== null) && (
              <div className="wsp-ed">
                <GrowInput className={`reflect-input${inputTurn ? ' await' : ''}${uzun ? ' filled' : ''}`} value={draft} maxLength={140}
                  placeholder={tr({ uz: `${cur.ic} ${tr(cur.savol)}`, ru: `${cur.ic} ${tr(cur.savol)}` })} aria-label={`${tr(cur.nom)} · ${tr(cur.savol)}`}
                  onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                  onChange={e => setDraftSaved(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') save(); }} />
                {takror && <p className="sfb ask">{tr({ uz: <>Bu qator yuqorida turibdi. Bu yerda nima <b>qurilishi</b> yoziladi.</>, ru: <>Эта строка уже стоит выше. Здесь пишется, что будет <b>построено</b>.</> })}</p>}
                {bosh && <p className="sfb ask">{tr({ uz: 'Bu hali muammo emas. Odam nimadan qiynalyapti — shuni yozing.', ru: 'Это ещё не проблема. Напишите, что мешает человеку.' })}</p>}
                {hammaYolgiz && <p className="sfb ask">{tr({ uz: '«Hamma», «odamlar» — bu kim? Aniq guruhni yozing: yoshi, joyi yoki nima qilishi bilan.', ru: '«Все», «люди» — это кто? Напишите конкретную группу: по возрасту, месту или занятию.' })}</p>}
                {sonYoq && <p className="sfb ask">{tr({ uz: "Bu katakda son bo'lishi kerak: oldin qancha edi, keyin qancha bo'lsin.", ru: 'В этой ячейке должно быть число: сколько было раньше и сколько должно стать.' })}</p>}
                {uzun && cur.k === 'olchov' && sonBor && <p className="sfb ok">{tr({ uz: "✓ Qatoringizda son bor — natijani shu sondan bilib olasiz.", ru: '✓ В вашей строке есть число — по нему вы и узнаете результат.' })}</p>}
                {uzun && cur.k !== 'olchov' && !takror && !bosh && !hammaYolgiz && <p className="sfb ok">{tr({ uz: "✓ Qator to'liq — endi saqlashingiz mumkin.", ru: '✓ Строка полная — теперь можно сохранить.' })}</p>}
                {!uzun && draft.trim().length > 0 && <p className="sfb ask">{tr({ uz: "Qisqa qoldi: to'liq gap bilan yozing.", ru: 'Слишком коротко: напишите полной фразой.' })}</p>}
                <div className="wsp-saverow">
                  <button type="button" className="wsp-save" disabled={!canSave} onClick={save}>{edit === null ? tr({ uz: '✓ Saqlash', ru: '✓ Сохранить' }) : tr({ uz: '✓ Yangilash', ru: '✓ Обновить' })}</button>
                  {!canSave && <span className="wsp-need">{takror ? tr({ uz: 'qator takrorlandi', ru: 'строка повторилась' }) : tr({ uz: 'qator yozilmagan', ru: 'строка не написана' })}</span>}
                </div>
              </div>
            )}
            {/* 80c: yozish paytida varaq KO'RINMAYDI; to'rttasi yozilgach to'liq ochiladi */}
            {done && edit === null && (
              <div className="fade-step">
                <Varaq qatorlar={prd} clickable onCell={startEdit} bar={{ uz: "Sizning varag'ingiz", ru: 'Ваш лист' }} />
                <p className="small" style={{ margin: '8px 0 0', color: T.ink3, fontWeight: 600 }}>{tr({ uz: '✎ Katakni bosib qatorini qayta yozishingiz mumkin.', ru: '✎ Нажмите на ячейку, чтобы переписать её строку.' })}</p>
              </div>
            )}
          </Col>
          <Col gap={9}>
            <div className="wsp-task">
              <span className="wsp-task-lbl">{tr({ uz: "🎯 Sizning varag'ingiz", ru: '🎯 Ваш лист' })}</span>
              {KATAKLAR.map(c => (
                <span key={c.k} className={`wsp-task-row${prd[c.k] ? ' done' : ''}`}>
                  <span>{c.ic} {tr(c.nom)}</span>
                  {prd[c.k] && <span className="wsp-task-m" aria-hidden="true">✓</span>}
                </span>
              ))}
              {/* 106c-b: holat ko'rsatkichi */}
            </div>
            <div className="wsxrow">
              <div className={`wsx ${yordamOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })} {yordamOpen ? '▾' : '▸'}</button>
                {yordamOpen && <div className="wsx-body"><p>{tr({ uz: "Ikki savol bering: kimdir shu ishdan qiynalyaptimi? Qiynalgani sonda ko'rinadimi?", ru: 'Задайте два вопроса: мешает ли это кому-то? Видно ли это в числе?' })}</p></div>}
              </div>
              <div className={`wsx star ${starOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setStarOpen(o => !o)}>{tr({ uz: "Qo'shimcha", ru: 'Дополнительно' })} {starOpen ? '▾' : '▸'}</button>
                {starOpen && <div className="wsx-body"><p>{tr({ uz: "Varag'ingizni ovoz chiqarib o'qing — to'rt qator bitta ish haqida gapiryaptimi?", ru: 'Прочитайте свой лист вслух — говорят ли четыре строки об одном и том же деле?' })}</p></div>}
              </div>
            </div>
            <StudentPracticePulse live={live} screen={screen} />
            <MentorPracticeStats live={live} screen={screen} label={tr({ uz: "To'rt katakni yozganlar", ru: 'Заполнили четыре ячейки' })} />
          </Col>
        </div>
        {done && edit === null && <div className="done-mini fade-step">{tr({ uz: <>✅ To'rt katak ham yozildi <span className="dm-sub">— varaq saqlandi</span></>, ru: <>✅ Все четыре ячейки заполнены <span className="dm-sub">— лист сохранён</span></> })}</div>}
        <MentorNote>{tr({ uz: "Mini-do'konida nima sotishini hali o'ylamagan o'quvchi bo'ladi: unga ayting — sinfdoshlariga sotsa bo'ladigan bitta narsani tanlasin, varaq o'sha do'kon uchun to'ldiriladi. Baholash-mezoni: to'rt katak ham yozilgan · O'lchov katagida son bor · har katakda bitta qator. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'Будет ученик, который ещё не придумал, что продавать в мини-магазине: скажите ему — пусть выберет одну вещь, которую можно продать одноклассникам, и заполнит лист для этого магазина. Критерий оценки: заполнены все четыре ячейки · в ячейке «Измерение» есть число · в каждой ячейке одна строка. Эту работу выполняют ученики, вы наблюдаете; «Продолжить» для вас открыта.' })}</MentorNote>
      </div>
    </Stage>
  );
};
// ===== SCREEN 9 — TEKSHIRUV: KATAK-TEKSHIRUV (26-qonun: yangi mexanika) =====
// Uch varaq birin-ketin keladi. 🔴 [GATE S] foydalanuvchi qarori: uch varaqdan BITTASI
// butunlay to'g'ri — «doim bittasi javobsiz» naqshi o'rganilib qolmasin. Javobsiz katak =
// qatori bor, lekin o'z savoliga javob bermaydigan katak (bo'sh katak esa — umuman yozilmagani).
const CHECK_KEY = 'pm-m6d2-check';
const readCheck = () => { try { const v = JSON.parse(localStorage.getItem(CHECK_KEY) || 'null'); return v && Array.isArray(v.natija) ? v.natija : null; } catch { return null; } };
const S9_VARAQLAR = [
  { id: 'v1', ic: '📅', nom: { uz: 'Murabbiy uchun kunlik ro\'yxat', ru: 'Дневной список для тренера' },
    qatorlar: {
      muammo: { uz: 'Murabbiy kim kelishini kun boshida bilmaydi', ru: 'Тренер в начале дня не знает, кто придёт' },
      kim: { uz: 'Basseynda ishlaydigan uch murabbiy', ru: 'Три тренера, работающие в бассейне' },
      yechim: { uz: 'Murabbiyning ishini oson qiladigan ilova', ru: 'Приложение, которое облегчает работу тренера' },
      olchov: { uz: 'Bilmay qolgan kun 5 tadan 1 taga tushadi', ru: 'Дней, когда тренер не знает, станет 1 из 5' },
    },
    javobsiz: 'yechim',
    sabab: { uz: '«Ishini oson qiladigan ilova» — nima qurilishi hali aytilmagan. To\'g\'ri qator: «Har murabbiyga kunlik ro\'yxatni ko\'rsatadigan sahifa».', ru: '«Приложение, которое облегчает работу» — что будет построено, ещё не сказано. Правильная строка: «Страница, которая показывает каждому тренеру дневной список».' } },
  { id: 'v2', ic: '🔔', nom: { uz: 'Mashg\'ulotdan oldin eslatma', ru: 'Напоминание перед занятием' },
    qatorlar: {
      muammo: { uz: 'Odam o\'zi band qilgan vaqtni o\'tkazib yuboradi', ru: 'Человек пропускает время, которое сам забронировал' },
      kim: { uz: 'Hamma foydalanuvchilar', ru: 'Все пользователи' },
      yechim: { uz: 'Vaqtdan 15 daqiqa oldin xabar yuboradigan bot', ru: 'Бот, который присылает сообщение за 15 минут до времени' },
      olchov: { uz: 'O\'tkazib yuborilgan vaqt 12 tadan 3 taga tushadi', ru: 'Пропущенных записей станет 3 из 12' },
    },
    javobsiz: 'kim',
    sabab: { uz: <>«Hamma foydalanuvchilar» — bu kim? Yoshi, joyi yoki ishi bilan aytilsa katak yoziladi.<br />✗ Hamma · ✗ Odamlar · ✓ Aniq guruh: «Joyni band qilib, boshqa ishga ketadiganlar»</>, ru: <>«Все пользователи» — это кто? Ячейка заполнена, если назвать по возрасту, месту или занятию.<br />✗ Все · ✗ Люди · ✓ Конкретная группа: «Те, кто бронирует место и уходит по другим делам»</> } },
  { id: 'v3', ic: '🏊', nom: { uz: 'Guruh tanlash', ru: 'Выбор группы' },
    qatorlar: {
      muammo: { uz: 'Odam o\'zi xohlagan guruhga tusholmaydi', ru: 'Человек не может попасть в группу, которую хочет' },
      kim: { uz: 'Bitta murabbiyga o\'rganib qolganlar', ru: 'Те, кто привык к одному тренеру' },
      yechim: { uz: 'Joy band qilayotganda guruhni tanlaydigan ro\'yxat', ru: 'Список, в котором при бронировании выбирают группу' },
      olchov: { uz: 'O\'z guruhini tanlaganlar 10 tadan 7 taga chiqadi', ru: 'Выбравших свою группу станет 7 из 10' },
    },
    javobsiz: null,
    sabab: { uz: 'To\'rt katak ham o\'z savoliga javob berdi: nima qiynayotgani, kim qiynalayotgani, nima qurilishi va qaysi son o\'zgarishi yozilgan.', ru: 'Все четыре ячейки ответили на свой вопрос: написано, что мешает, кому мешает, что будет построено и какое число изменится.' } },
];
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const achMiss = useContext(AchMissCtx);
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [natija, setNatija] = useState(() => Array.isArray(storedAnswer?.natija) ? storedAnswer.natija : (readCheck() || [])); // F-0914-10: saqlangan javob massiv bo'lmasa — bo'sh (oq ekran himoyasi)
  const [ochiq, setOchiq] = useState(false);
  const [xato, setXato] = useState(0);
  const [xatoTur, setXatoTur] = useState(null);
  const [miss, setMiss] = useState(null);
  const [missedOnce, setMissedOnce] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  const missT = useRef(null);
  useEffect(() => () => clearTimeout(missT.current), []);
  const step = natija.length;
  const done = step === S9_VARAQLAR.length;
  const v = S9_VARAQLAR[Math.min(step, S9_VARAQLAR.length - 1)];
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      onAnswer(screen, { stage: 'tekshiruv', screenIdx: screen, natija, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'tekshiruv', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  useEffect(() => { try { localStorage.setItem(CHECK_KEY, JSON.stringify({ natija })); } catch {} }, [natija]);
  const notogri = (k) => {
    setXato(x => x + 1);
    setXatoTur(k === 'clean' ? 'clean' : 'cell');
    setMissedOnce(true);
    if (achMiss) achMiss.miss(screen);
    setMiss(k);
    clearTimeout(missT.current);
    missT.current = setTimeout(() => setMiss(null), 900);
  };
  const tapCell = (k) => {
    if (done || ochiq || isMentor) return;
    if (v.javobsiz === k) setOchiq(true);
    else notogri(k);
  };
  const tapClean = () => {
    if (done || ochiq || isMentor) return;
    if (v.javobsiz === null) setOchiq(true);
    else notogri('clean');
  };
  const keyingi = () => {
    setNatija(p => [...p, { id: v.id, javobsiz: v.javobsiz }]);
    setOchiq(false); setXato(0); setXatoTur(null); setMiss(null);
  };
  const cellWave = useTurnHint(!ochiq && !done && !isMentor);
  const topilgan = natija.filter(r => r.javobsiz).length;
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : ochiq ? (step === S9_VARAQLAR.length - 1 ? tr({ uz: '② Tekshiruvni yakunlang', ru: '② Завершите проверку' }) : tr({ uz: '② Keyingi varaqqa o\'ting', ru: '② Перейдите к следующему листу' }))
      : tr({ uz: `① ${step + 1}-varaqni o'qing (${step}/3 tekshirildi)`, ru: `① Прочитайте лист ${step + 1} (проверено ${step}/3)` });
  return (
    <Stage eyebrow={tr({ uz: 'Tekshiruv · uch varaq', ru: 'Проверка · три листа' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(9px,1.4vw,14px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Basseyn ilovasi: <span className="italic" style={{ color: T.accent }}>yana uch varaq</span></>, ru: <>Приложение бассейна: <span className="italic" style={{ color: T.accent }}>ещё три листа</span></> })}</h2></div>
        <Mentor>{tr({ uz: "Endi o'sha to'rt savol bilan tekshiring: qatori o'z savoliga javob bermaydigan katakni bosing. To'rttasi ham javob bersa — «Bu varaqda javobsiz katak yo'q» tugmasini bosing.", ru: 'Теперь проверьте теми же четырьмя вопросами: нажмите на ячейку, строка которой не отвечает на свой вопрос. Если отвечают все четыре — нажмите кнопку «На этом листе нет ячейки без ответа».' })}</Mentor>
        <div className="split s9v">
          <Col gap={9}>
            {!done && (
              <>
                {/* written: s9 kataklari o'quvchi yozgani EMAS — tayyor varaq o'qiladi. Yashil halqa
                    faqat topilgan katakda yonsin (hotspot), aks holda «✓ to'g'ri yozilgan» deb o'qiladi. */}
                <Varaq key={v.id} written qatorlar={v.qatorlar} clickable={!ochiq && !isMentor} wave={cellWave} onCell={tapCell}
                  pick={ochiq && v.javobsiz ? { k: v.javobsiz, ok: true } : (miss && miss !== 'clean' ? { k: miss, ok: false } : null)}
                  bar={`${v.ic} ${tr(v.nom)}`} />
                <button type="button" className={`clean-btn${miss === 'clean' ? ' miss' : ''}${ochiq && v.javobsiz === null ? ' hit' : ''}`} disabled={ochiq || isMentor} onClick={tapClean}>{tr({ uz: "Bu varaqda javobsiz katak yo'q", ru: 'На этом листе нет ячейки без ответа' })}</button>
                <AchRule screen={screen} />
              </>
            )}
            {done && (
              <div className="varaq-sum fade-step">
                {natija.map((r, k) => {
                  const src = S9_VARAQLAR.find(x => x.id === r.id) || S9_VARAQLAR[k];
                  const nomi = r.javobsiz ? tr((KATAKLAR.find(c => c.k === r.javobsiz) || {}).nom) : null;
                  return <span key={r.id} className="vsum-row"><b>{src.ic} {tr(src.nom)}</b>{nomi ? tr({ uz: ` — ${nomi} katagi javobsiz`, ru: ` — ячейка «${nomi}» без ответа` }) : tr({ uz: ' — to\'rt katak ham javob berdi', ru: ' — все четыре ячейки ответили' })}</span>;
                })}
              </div>
            )}
          </Col>
          <Col gap={9}>
            {ochiq && !done && (
              <div className="col" style={{ gap: 9 }}>
                <p className="jres ok fade-step">✓ {tr(v.sabab)}</p>
                <button type="button" className="wsp-save" onClick={keyingi}>{step === S9_VARAQLAR.length - 1 ? tr({ uz: '✓ Tekshiruvni yakunlash', ru: '✓ Завершить проверку' }) : tr({ uz: 'Keyingi varaq →', ru: 'Следующий лист →' })}</button>
              </div>
            )}
            {!ochiq && xato > 0 && !done && (
              <p className="jres ask fade-step">{xatoTur === 'clean'
                ? tr({ uz: "Bitta katakning qatori o'z savoliga javob bermayapti — yana bir marta o'qib chiqing.", ru: 'Строка одной ячейки не отвечает на свой вопрос — прочитайте ещё раз.' })
                : tr({ uz: "Bu katak o'z savoliga javob berib turibdi. Qolgan kataklarni savoli bilan qo'shib o'qing.", ru: 'Эта ячейка на свой вопрос отвечает. Прочитайте остальные ячейки вместе с их вопросами.' })}</p>
            )}
            {missedOnce && !done && (
              <div className={`wsx ${yordamOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })} {yordamOpen ? '▾' : '▸'}</button>
                {yordamOpen && <div className="wsx-body"><p>{tr({ uz: "Har katakni o'z savoli bilan qo'shib o'qing: qatori shu savolga javob beryaptimi?", ru: 'Читайте каждую ячейку вместе с её вопросом: отвечает ли строка на этот вопрос?' })}</p></div>}
              </div>
            )}
            {xato >= 2 && !ochiq && !done && (
              <p className="bhint fade-step">{tr({ uz: <>Yechim katagida nima <b>qurilishi</b>, Kim katagida <b>aniq guruh</b>, O'lchov katagida esa <b>son</b> turishi kerak.</>, ru: <>В ячейке «Решение» должно стоять, что будет <b>построено</b>, в ячейке «Кто» — <b>конкретная группа</b>, а в ячейке «Измерение» — <b>число</b>.</> })}</p>
            )}
            {done && (
              <div className="bdone fade-step">
                <span className="done-mini">{tr({ uz: <>✅ {topilgan} varaqda javobsiz katak topdingiz <span className="dm-sub">— {S9_VARAQLAR.length - topilgan} varaqda to'rt katak ham o'z savoliga javob berdi</span></>, ru: <>✅ Листов с ячейкой без ответа найдено: {topilgan} <span className="dm-sub">— на листах ({S9_VARAQLAR.length - topilgan}) все четыре ячейки ответили на свой вопрос</span></> })}</span>
              </div>
            )}
            <StudentPracticePulse live={live} screen={screen} />
            <MentorPracticeStats live={live} screen={screen} label={tr({ uz: 'Uch varaqni tekshirganlar', ru: 'Проверили три листа' })} />
          </Col>
        </div>
        <MentorNote>{tr({ uz: "Eng ko'p adashiladigan joy — ikkinchi varaq: «Hamma foydalanuvchilar» qatori to'ldirilganday ko'rinadi. Bola adashsa, savolni qaytaring: bu odamlarni ko'chada tanib olasizmi? Sinf ish-tartibi: har o'quvchi sherigining varag'idagi O'lchov katagini o'qib, «bu sonni qayerdan bilib olasiz?» deb so'raydi — javob topilmasa, qator qayta yoziladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'Чаще всего ошибаются на втором листе: строка «Все пользователи» выглядит заполненной. Если ученик ошибся, верните вопрос: узнаете ли вы этих людей на улице? Порядок работы в классе: каждый ученик читает ячейку «Измерение» на листе соседа и спрашивает: «откуда вы узнаете это число?» — если ответа нет, строка переписывается. Эту работу выполняют ученики, вы наблюдаете; «Продолжить» для вас открыта.' })}</MentorNote>
      </div>
    </Stage>
  );
};
// ===== SCREEN 10 — KODING: VS Code-topshirig'i (26/82/87-qonun) =====
// R1 navbati: m5-11 kompilyator → m6-02 VS Code. Kod NUSXALANMAYDI (82d): qo'lda yozganda
// o'rganiladi. Preview-panel YO'Q (82b): natijani o'quvchi `node` buyrug'i bilan ko'radi.
const KODING_KEY = 'pm-m6d2-code';
const readKoding = () => { try { const v = JSON.parse(localStorage.getItem(KODING_KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
// Darvoza-mashq (82e): bitta savol darsning O'Z qoidasidan.
const GATE_OPTS = [
  { t: { uz: 'Muammo katagida', ru: 'В ячейке «Проблема»' } },
  { t: { uz: "O'lchov katagida", ru: 'В ячейке «Измерение»' }, ok: true },
  { t: { uz: 'Kim katagida', ru: 'В ячейке «Кто»' } },
];
const KD_CODE = { uz: `// Bir varaq — to'rt katak
const NOMLAR = ["muammo", "kim", "yechim", "olchov"];

const varaq1 = {
  muammo: "Odamlar kelib, guruh to'lib qolganini ko'radi",
  kim: "Haftada ikki marta suzishga keladiganlar",
  yechim: "Bo'sh joyni ko'rsatib, joy band qiladigan ilova",
  olchov: ""
};

const varaq2 = {
  muammo: "",
  kim: "",
  yechim: "Kunlik ro'yxatni ko'rsatadigan sahifa",
  olchov: "Bilmay qolgan kun 5 tadan 1 taga tushadi"
};

const varaq3 = {
  muammo: "Odam band qilgan vaqtini o'tkazib yuboradi",
  kim: "Joyni band qilib, boshqa ishga ketadiganlar",
  yechim: "",
  olchov: "O'tkazib yuborish 12 tadan 3 taga tushadi"
};

function yozilmaganKataklar(varaq) {
  const natija = [];
  // NOMLAR bo'ylab yuring: qiymati bo'sh bo'lsa, nomni natija ro'yxatiga qo'shing
  return natija;
}

console.log(yozilmaganKataklar(varaq1));
console.log(yozilmaganKataklar(varaq2));
console.log(yozilmaganKataklar(varaq3));`, ru: `// Один лист — четыре ячейки
const NOMLAR = ["muammo", "kim", "yechim", "olchov"];

const varaq1 = {
  muammo: "Люди приходят и видят, что группа заполнена",
  kim: "Те, кто приходит плавать два раза в неделю",
  yechim: "Приложение, которое показывает свободные места и бронирует",
  olchov: ""
};

const varaq2 = {
  muammo: "",
  kim: "",
  yechim: "Страница, которая показывает дневной список",
  olchov: "Дней, когда тренер не знает, станет 1 из 5"
};

const varaq3 = {
  muammo: "Человек пропускает забронированное время",
  kim: "Те, кто бронирует место и уходит по другим делам",
  yechim: "",
  olchov: "Пропусков станет 3 из 12"
};

function yozilmaganKataklar(varaq) {
  const natija = [];
  // Пройдите по NOMLAR: если значение пустое, добавьте имя в список natija
  return natija;
}

console.log(yozilmaganKataklar(varaq1));
console.log(yozilmaganKataklar(varaq2));
console.log(yozilmaganKataklar(varaq3));` };
const JS_TOKEN = /(\/\/[^\n]*|"[^"]*"|\b(?:const|function|return|console|log)\b|[[\]{}();,])/g;
const jsHl = (ln) => ln.split(JS_TOKEN).filter(p => p !== undefined && p !== '').map((p, i) => {
  if (p.startsWith('//')) return <span key={i} style={{ color: '#6A9955' }}>{p}</span>;
  if (p.startsWith('"')) return <span key={i} style={{ color: '#CE9178' }}>{p}</span>;
  if (/^(const|function|return)$/.test(p)) return <span key={i} style={{ color: '#C586C0' }}>{p}</span>;
  if (/^(console|log)$/.test(p)) return <span key={i} style={{ color: '#4FC1FF' }}>{p}</span>;
  if (/^[[\]{}();,]$/.test(p)) return <span key={i} style={{ color: '#FFD70A' }}>{p}</span>;
  return <span key={i}>{p}</span>;
});
const KD_SHART = [
  { uz: <>Funksiya ro'yxat (massiv) qaytaradi</>, ru: <>Функция возвращает список (массив)</> },
  { uz: <>Bo'sh katakning nomi ro'yxatga tushadi</>, ru: <>Имя пустой ячейки попадает в список</> },
];
const KD_NATIJA = ['["olchov"]', '["muammo", "kim"]', '["yechim"]'];
// 👦 1-o'qish topilmasi: 33 satr birdaniga uzun ko'rindi — kod ikki bosqichda ochiladi.
// KD_CODE O'ZGARMAYDI (§140-B: starter bilan 0/3): faqat ko'rinadigan bo'lak bo'linadi.
const KD_STEPS = [
  { lbl: { uz: '① Uch varaq', ru: '① Три листа' }, from: 0, to: 24 },
  { lbl: { uz: '② Funksiya', ru: '② Функция' }, from: 24, to: 33 },
];
const ScreenCoding = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [saved] = useState(() => readKoding());
  const [done, setDone] = useState(!!(storedAnswer && storedAnswer.solved) || !!(saved && saved.done));
  const [gateOk, setGateOk] = useState(!!(saved && saved.gateOk));
  const [miss, setMiss] = useState(null);
  const [missedOnce, setMissedOnce] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  const [kdStep, setKdStep] = useState(0);
  const missT = useRef(null);
  useEffect(() => () => clearTimeout(missT.current), []);
  const stage2 = gateOk || isMentor || done;
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  const pickGate = (i) => {
    if (stage2) return;
    if (GATE_OPTS[i].ok) {
      setGateOk(true);
      try { localStorage.setItem(KODING_KEY, JSON.stringify({ ...(readKoding() || {}), gateOk: true })); } catch {}
    } else {
      setMiss(i);
      setMissedOnce(true);
      clearTimeout(missT.current);
      missT.current = setTimeout(() => setMiss(null), 600);
    }
  };
  const complete = () => {
    if (done) return;
    setDone(true);
    try { localStorage.setItem(KODING_KEY, JSON.stringify({ ...(readKoding() || {}), gateOk: true, done: true })); } catch {}
  };
  const lines = tr(KD_CODE).split('\n');
  const doneTurn = useTurnHint(stage2 && !done && !isMentor);
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: 'Avval kod-savolini yeching', ru: 'Сначала решите вопрос о коде' }) : tr({ uz: 'Kodni yozing va tugmani bosing', ru: 'Напишите код и нажмите кнопку' });
  return (
    <Stage eyebrow={tr({ uz: 'Kod yozish · VS Code', ru: 'Пишем код · VS Code' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.5vw,15px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bo'sh katakni topadigan <span className="italic" style={{ color: T.accent }}>kod</span> yozamiz.</>, ru: <>Пишем <span className="italic" style={{ color: T.accent }}>код</span>, который находит пустую ячейку.</> })}</h2></div>
        {!stage2 ? (
          <>
            <Mentor>{tr({ uz: 'Avval bitta savol — keyin kod yoziladi.', ru: 'Сначала один вопрос — потом пишем код.' })}</Mentor>
            <div className="cmt hunt">
              <span className="cmt-lbl">{tr({ uz: "Qaysi katakda son bo'lishi shart?", ru: 'В какой ячейке обязательно должно быть число?' })}</span>
              <div className="gt-btns col3">
                {GATE_OPTS.map((g, i) => (
                  <button key={tr(g.t)} type="button" className={`gt-b${miss === i ? ' miss' : ''}`} onClick={() => pickGate(i)}>{tr(g.t)}</button>
                ))}
              </div>
              {missedOnce && <p className="cmt-tip">{tr({ uz: "Katakning savolini o'qing: qaysi biri «Natijani qaysi sondan bilamiz?» deb so'raydi?", ru: 'Прочитайте вопрос ячейки: какая из них спрашивает «По какому числу узнаем результат?»' })}</p>}
            </div>
          </>
        ) : (
          <>
            <Mentor>{tr({ uz: "Qatorning ma'nosini odam o'qiydi, kod esa umuman yozilmagan katakni topadi. Kodda har varaq shunday turadi: katak nomi, yonida uning qatori.", ru: 'Смысл строки читает человек, а код находит ячейку, в которой вообще ничего не написано. В коде каждый лист выглядит так: имя ячейки, рядом её строка.' })}</Mentor>
            {/* F-1004-35: ikki ustun bir balandlikda, «Bajardim» o'ngda, pastki izoh olindi */}
            <div className="split kod">
              <Col gap={10}>
                <div className={`kdpanel${done ? ' is-done' : ''}`}>
                  <div className="kdout">
                    <span className="kdout-lbl">{tr({ uz: 'Kutilgan uch natija', ru: 'Ожидаемые три результата' })}</span>
                    {KD_NATIJA.map((n, i) => <span key={n} className="kdout-row mono">varaq{i + 1} → {n}</span>)}
                  </div>
                  <ol className="kdreq">{KD_SHART.map((sh, i) => <li key={i}>{tr(sh)}</li>)}</ol>
                  <div className={`wsx star ${yordamOpen ? 'open' : ''}`}>
                    <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>{tr({ uz: 'Yordam', ru: 'Подсказка' })} {yordamOpen ? '▾' : '▸'}</button>
                    {yordamOpen && <div className="wsx-body">
                      <p>{tr({ uz: <>Bitta katakdan boshlang: <code className="qcode">varaq1.olchov</code> bo'shmi? Ishlagach qolgan uchtasiga o'ting.</>, ru: <>Начните с одной ячейки: пуста ли <code className="qcode">varaq1.olchov</code>? Когда заработает, переходите к остальным трём.</> })}</p>
                      <p>{tr({ uz: <>⭐ Qo'shimcha: <code className="qcode">tayyormi(varaq)</code> funksiyasini qo'shing — bo'sh katak bo'lmasa <code className="qcode">true</code>, aks holda <code className="qcode">false</code> qaytarsin.</>, ru: <>⭐ Дополнительно: добавьте функцию <code className="qcode">tayyormi(varaq)</code> — пусть возвращает <code className="qcode">true</code>, если пустых ячеек нет, иначе <code className="qcode">false</code>.</> })}</p>
                    </div>}
                  </div>
                  <button className={`lp-done-btn ${done ? 'is-done' : ''}${!done && doneTurn ? ' turn-ring' : ''}`} disabled={done} onClick={done ? undefined : complete}>
                    {done ? tr({ uz: '✓ Bajarildi', ru: '✓ Выполнено' }) : tr({ uz: "✓ VS Code'da yozdim — uch natija to'g'ri chiqdi", ru: '✓ Написал(а) в VS Code — все три результата верные' })}
                  </button>
                  {/* F-0926-05 #16: «✓ Bajarildi» tugmasi o'zi aytadi — takror yashil yozuv olindi */}
                </div>
                <MentorPracticeStats live={live} screen={screen} label={tr({ uz: "Kodni yozib bo'lganlar", ru: 'Дописали код' })} />
              </Col>
              <Col gap={10}>
                <div className="vsc no-copy" onCopy={e => e.preventDefault()} onCut={e => e.preventDefault()} onPaste={e => e.preventDefault()} onContextMenu={e => e.preventDefault()}>
                  <div className="vsc-bar">
                    <span className="vsc-tab on"><span style={{ color: '#F1E05A', fontWeight: 800, fontSize: '0.85em' }}>JS</span> varaq.js</span>
                    <span className="vsc-lock" title={tr({ uz: "Kod nusxalanmaydi — o'zingiz terib yozasiz", ru: 'Код не копируется — набираете сами' })}>{tr({ uz: "qo'lda yoziladi", ru: 'пишется руками' })}</span>
                  </div>
                  <div className="vsc-steps">
                    {KD_STEPS.map((st, i) => (
                      <button key={tr(st.lbl)} type="button" className={`vsc-step${kdStep === i ? ' on' : ''}`} aria-pressed={kdStep === i} onClick={() => setKdStep(i)}>{tr(st.lbl)}</button>
                    ))}
                  </div>
                  <div className="vsc-body">
                    {lines.slice(KD_STEPS[kdStep].from, KD_STEPS[kdStep].to).map((ln, i) => {
                      const nr = KD_STEPS[kdStep].from + i + 1;
                      return <div key={nr} className="vsc-line"><span className="vsc-ln">{nr}</span><span className="vsc-code">{ln ? jsHl(ln) : ' '}</span></div>;
                    })}
                  </div>
                  <div className="vsc-term">
                    <span className="vsc-term-lbl">TERMINAL</span>
                    <span className="vsc-term-cmd"><i>$</i> node varaq.js <b>⏎</b></span>
                  </div>
                </div>
              </Col>
            </div>
          </>
        )}
        <MentorNote>{tr({ uz: "Kod ma'noni o'qiy olmaydi — u faqat yozilmagan katakni topadi. Shuni ochiq ayting: uch varaqni o'qish ishi odamniki, bu ish esa mashinaniki. Nusxalash yopiq — sababini ayting: qo'lda yozganda o'rganiladi. Kod 10 daqiqada yoziladi; ulgurmagan o'quvchi uyga qisqa variantni oladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'Код не умеет читать смысл — он только находит незаполненную ячейку. Скажите это прямо: читать три листа — работа человека, а эта работа — машины. Копирование закрыто — объясните почему: когда пишешь руками, учишься. Код пишется за 10 минут; кто не успел, получает домой короткий вариант. Эту работу выполняют ученики, вы наблюдаете; «Продолжить» для вас открыта.' })}</MentorNote>
      </div>
    </Stage>
  );
};
// ===== SCREEN 12 — RECAP: 2 qadam (ayting + yozing) =====
const REFLECT_KEY = 'pm-m6d2-reflection';
// 🔴 Korpus §97 (👦 1-o'qish topilmasi): YAKKA o'quvchida sherik YO'Q — unga «A» va «B»
// navbati ko'rsatilmaydi. Yakka tarmoq: bitta 30 soniyalik navbat, neytral matn.
function PairTimer({ onStage, muted, solo }) {
  const TOTAL = solo ? 30 : 60;
  const [st, setSt] = useState({ running: false, left: TOTAL, done: false });
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
              ? <span className="pair-now">{tr({ uz: 'Hozir ayting', ru: 'Сейчас расскажите' })}</span>
              : <><span className="pair-now">{tr({ uz: <>Hozir <span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span> gapiradi</>, ru: <>Сейчас говорит <span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span></> })}</span><span className="pair-next">{isA ? tr({ uz: 'keyin — B navbati', ru: 'потом — очередь B' }) : tr({ uz: 'oxirgi navbat', ru: 'последняя очередь' })}</span></>}
          </div>
        </div>
      ) : (st.done || !solo) ? (
        <p className="pair-now" style={{ margin: 0 }}>{st.done
          ? (solo ? tr({ uz: "✓ Vaqt tugadi — aytib bo'ldingiz. Barakalla!", ru: '✓ Время вышло — вы рассказали. Молодец!' }) : tr({ uz: "✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla!", ru: '✓ Время вышло — рассказали оба. Молодцы!' }))
          : tr({ uz: 'Har biringizga 30 soniyadan — avval A, keyin B.', ru: 'По 30 секунд каждому — сначала A, потом B.' })}</p>
      ) : null}
      <div className="pair-timer-btns">
        {!st.running && <button className={st.done ? 'btn-soft' : `pair-start${startTurn ? '' : ' calm'}`} onClick={() => setSt({ running: true, left: TOTAL, done: false })}>{st.done ? (solo ? tr({ uz: '↻ Yana 30 soniya', ru: '↻ Ещё 30 секунд' }) : tr({ uz: '↻ Yana 1 daqiqa', ru: '↻ Ещё 1 минута' })) : (solo ? tr({ uz: '▶ 30 soniyani boshlash', ru: '▶ Запустить 30 секунд' }) : tr({ uz: '▶ 1 daqiqani boshlash', ru: '▶ Запустить минуту' }))}</button>}
        {st.running && <button className="btn-soft" onClick={() => setSt({ running: false, left: TOTAL, done: false })}>{tr({ uz: "⏹ To'xtatish", ru: '⏹ Остановить' })}</button>}
      </div>
    </div>
  );
}
const ScreenReflection = ({ screen, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  // Korpus §97: yolg'iz o'qiyotgan o'quvchida sherik YO'Q — ikki tarmoq bir shakl, bir uzunlikda.
  const yakka = !live || live.mode === 'self';
  const [text, setText] = useState(() => { try { return localStorage.getItem(REFLECT_KEY) || ''; } catch { return ''; } });
  const save = (v) => { setText(v); try { localStorage.setItem(REFLECT_KEY, v); } catch {} };
  const written = text.trim().length >= 8;
  const [pairStage, setPairStage] = useState('idle');
  const [reflFocus, setReflFocus] = useState(false);
  const inputTurn = useTurnHint(pairStage === 'done' && !written && !reflFocus);
  return (
    <Stage eyebrow={tr({ uz: "O'zingiz o'ylab ko'ring · 2 qadam", ru: 'Подумайте сами · 2 шага' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext turnBusy={!written} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qaysi katak <span className="italic" style={{ color: T.accent }}>eng qiyin</span> bo'ldi?</>, ru: <>Какая ячейка оказалась <span className="italic" style={{ color: T.accent }}>самой трудной</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Nega aynan shu katak? Avval {yakka ? "ovoz chiqarib o'zingizga" : 'sherigingizga'} ayting, so'ng bir qatorda yozing.</>, ru: <>Почему именно эта ячейка? Сначала расскажите {yakka ? 'вслух самому себе' : 'соседу'}, а потом напишите одной строкой.</> })}</Mentor>
        <div className="rcp-flow">
          <div className="rcp-step fade-up delay-1">
            <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">{yakka ? tr({ uz: 'Ayting', ru: 'Расскажите' }) : tr({ uz: 'Sherigingizga ayting', ru: 'Расскажите соседу' })}</span></div></div>
            <PairTimer onStage={setPairStage} muted={written} solo={yakka} />
          </div>
          <div className="rcp-step fade-up delay-2">
            <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">{tr({ uz: 'Yozing', ru: 'Напишите' })}</span></div></div>
            <span className={`turn-wrap${inputTurn ? ' turn-ring' : ''}`}>
              <GrowInput className="reflect-input" value={text} onChange={e => save(e.target.value)} onFocus={() => setReflFocus(true)} onBlur={() => setReflFocus(false)} placeholder={tr({ uz: "... katagi qiyin bo'ldi, chunki ...", ru: 'Трудной была ячейка ..., потому что ...' })} maxLength={160} />
            </span>
            {/* F-1004-46: yozib bo'lgach bitta xulosa (≤110 belgi, emojisiz) — 106f(b) ga tuzatish */}
            {written && (
              <div className="rwd fade-step">
                <p className="rwd-t">{tr({ uz: 'Bugungi qoida: aniq yozilmasa — dasturchi taxmin qiladi.', ru: 'Правило дня: не написано чётко — программист додумывает сам.' })}</p>
              </div>
            )}
          </div>
        </div>
        <MentorNote>{tr({ uz: "Uchdan biri katak nomlarini eslay olmasa — varaq ekranini qayta oching va to'rt savolni birga o'qing.", ru: 'Если треть класса не может вспомнить названия ячеек — откройте экран с листом снова и прочитайте четыре вопроса вместе.' })}</MentorNote>
      </div>
    </Stage>
  );
};
// ===== SCREEN 14 — FLASHCARD (10 karta · mentorsiz, 99a-qonun) =====
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
  { front: { uz: "Og'zaki aytilgan gap bilan yozilgan qatorning farqi nima?", ru: 'Чем сказанная вслух фраза отличается от написанной строки?' }, back: { uz: "Og'zaki gapni har kim o'zicha tushunadi — yozilgan qator hammaga bir xil ko'rinadi", ru: 'Устную фразу каждый понимает по-своему — написанную строку все видят одинаково' } },
  { front: { uz: 'PRD nima?', ru: 'Что такое PRD?' }, back: { uz: 'Mahsulot talablari yozilgan hujjat', ru: 'Документ, в котором записаны требования к продукту' } },
  { front: { uz: "Bugun PRD'ning qaysi sodda ko'rinishini to'ldirdik?", ru: 'Какую простую форму PRD мы сегодня заполнили?' }, back: { uz: "Bitta varaq, to'rt katak: Muammo · Kim · Yechim · O'lchov", ru: 'Один лист, четыре ячейки: Проблема · Кто · Решение · Измерение' } },
  { front: { uz: '«Muammo» katagida nima turadi?', ru: 'Что стоит в ячейке «Проблема»?' }, back: { uz: 'Odamni nima qiynayotgani', ru: 'Что мешает человеку' } },
  { front: { uz: '«Kim» katagida nima turadi?', ru: 'Что стоит в ячейке «Кто»?' }, back: { uz: 'Qiynalayotgan odamlarning aniq guruhi', ru: 'Конкретная группа людей, которым мешает' } },
  { front: { uz: '«Yechim» katagida nima turadi?', ru: 'Что стоит в ячейке «Решение»?' }, back: { uz: 'Nima qurilishi', ru: 'Что будет построено' } },
  { front: { uz: "«O'lchov» katagida nima turadi?", ru: 'Что стоит в ячейке «Измерение»?' }, back: { uz: "Natijani ko'rsatadigan son: oldin qancha, keyin qancha", ru: 'Число, которое показывает результат: сколько было раньше, сколько стало потом' } },
  { front: { uz: "Bitta katak bo'sh qolsa nima bo'ladi?", ru: 'Что будет, если одна ячейка останется пустой?' }, back: { uz: "Dasturchi uni taxmin bilan to'ldiradi", ru: 'Программист заполнит её своей догадкой' } },
  { front: { uz: 'Geyts va Allen tilni qanday sinashdi?', ru: 'Как Гейтс и Аллен проверяли язык?' }, back: { uz: "Altairga o'xshab ishlaydigan dasturda, katta kompyuterda", ru: 'В программе, которая работала как Altair, на большом компьютере' } },
  { front: { uz: "PRD ning inglizcha to'liq nomi qanday?", ru: 'Как полностью называется PRD по-английски?' }, back: { uz: 'Product Requirements Document — mahsulot talablari hujjati', ru: 'Product Requirements Document — документ с требованиями к продукту' } },
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
    question={<TestQ ask={tr({ uz: "Varaqning «Kim» katagi bo'sh qoldi. Dasturchi hech kimdan so'ramay, ishni boshladi. Natijada nima bo'ladi?", ru: 'На листе осталась пустой ячейка «Кто». Программист никого не спросил и начал работу. Что получится в итоге?' })} />}
    questionText={tr({ uz: "Kim katagi bo'sh qolsa natijada nima bo'ladi", ru: 'Что получится, если ячейка «Кто» останется пустой' })}
    options={[tr({ uz: "Ish to'xtaydi, kod umuman yozilmaydi", ru: 'Работа остановится, код вообще не напишут' }), tr({ uz: "Kim uchun qurishni o'zi taxmin qiladi", ru: 'Сам додумает, для кого строить' }), tr({ uz: "Qolgan uch katak ham bekor bo'ladi", ru: 'Остальные три ячейки тоже станут бесполезными' }), tr({ uz: 'Ilova baribir hamma odamlarga mos keladi', ru: 'Приложение всё равно подойдёт всем людям' })]}
    correctIdx={1}
    explainCorrect={tr({ uz: "Katak bo'sh qolsa, dasturchi uni o'z taxmini bilan to'ldiradi. Taxmin noto'g'ri bo'lsa, ilova boshqa odamlar uchun qurilib qoladi. Shuning uchun katak bo'sh qolmaydi: bilmasangiz — so'rab aniqlashtirasiz.", ru: 'Если ячейка пустая, программист заполняет её своей догадкой. Если догадка неверна, приложение построят для других людей. Поэтому ячейка не остаётся пустой: не знаете — спросите и уточните.' })}
    explainWrong={{
      0: tr({ uz: "Ish to'xtamaydi — dasturchi baribir quradi, faqat kim uchun ekanini o'zi taxmin qiladi.", ru: 'Работа не останавливается — программист всё равно строит, только для кого — додумывает сам.' }),
      2: tr({ uz: "Qolgan kataklar joyida turibdi — faqat bo'sh qolgan katakni dasturchi o'z taxmini bilan to'ldiradi.", ru: 'Остальные ячейки на месте — программист заполняет своей догадкой только пустую ячейку.' }),
      3: tr({ uz: 'Hammaga emas — dasturchi taxmin qilgan odamlarga quriladi.', ru: 'Не всем — а тем, кого программист додумал сам.' }),
      default: tr({ uz: "Katak bo'sh qolsa, dasturchi taxmin qiladi. Bilmasangiz — so'rab aniqlashtiring.", ru: 'Если ячейка пустая, программист додумывает сам. Не знаете — спросите и уточните.' })
    }}
  />
);

// ===== UYGA VAZIFA — alohida ekran EMAS, YAKUN sahifasi ichida (etalon: P0 · PmLesson2 · PmLesson4) =====
const HW_KEY = 'pm-m6d2-hw-target';
const HW_VARIANT = [
  { k: 'toliq', t: { uz: "To'liq · ~20 daqiqa", ru: 'Полный · ~20 минут' } },
  { k: 'qisqa', t: { uz: 'Qisqa · ~10 daqiqa', ru: 'Короткий · ~10 минут' } },
];
const HW_STEPS = {
  toliq: [{ uz: "Varag'ingizni uydagi yoki sinfdagi bir odamga o'qib bering", ru: 'Прочитайте свой лист одному человеку дома или в классе' }, { uz: 'U qayta so\'ragan katakni belgilang', ru: 'Отметьте ячейку, о которой он переспросил' }, { uz: "O'sha katakning qatorini yangidan yozing", ru: 'Перепишите строку этой ячейки заново' }],
  qisqa: [{ uz: "O'lchov katagingizdagi sonni topib oling", ru: 'Найдите число в своей ячейке «Измерение»' }, { uz: 'Uni qayerdan bilib olishingizni o\'ylang', ru: 'Подумайте, откуда вы его узнаете' }, { uz: 'Javobni bitta qatorda yozing', ru: 'Напишите ответ одной строкой' }],
};
const readHwTarget = () => { try { return localStorage.getItem(HW_KEY) || ''; } catch { return ''; } };
// Uy-vazifa kapsulasi fonidagi xira so'z-tokenlar — darsning O'Z atamalari (§114)
const HW_TOKENS = [
  { t: { uz: 'varaq', ru: 'лист' },   l: 5,  tp: 16, s: 12, d: 6.5 },
  { t: { uz: 'katak', ru: 'ячейка' },   l: 80, tp: 12, s: 11, d: 7.5 },
  { t: { uz: 'qator', ru: 'строка' },   l: 12, tp: 70, s: 11, d: 8 },
  { t: { uz: 'savol', ru: 'вопрос' },   l: 64, tp: 76, s: 12, d: 6 },
  { t: { uz: "o'lchov", ru: 'измерение' }, l: 86, tp: 52, s: 10, d: 9 },
  { t: '📄',       l: 36, tp: 8,  s: 12, d: 7 },
  { t: '✍️',       l: 3,  tp: 44, s: 12, d: 8.5 },
];
const HwCard = ({ variant, onPick }) => {
  const steps = HW_STEPS[variant] || HW_STEPS.toliq;
  const pickTurn = useTurnHint(!variant && !!onPick);
  return (
    <div className="card fade-step">
      <div className="card-lbl" style={{ color: T.accent }}>📝 {tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
      {(
        <>
          <p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "Uyda varag'ingizni bir odamga o'qib berasiz — u qayta so'ragan katakni yangidan yozasiz. Qancha vaqtingiz bor — o'zingiz tanlaysiz.", ru: 'Дома вы прочитаете свой лист одному человеку — и перепишете ячейку, о которой он переспросит. Сколько у вас времени — выбираете сами.' })}</p>
          <div className="hw-chips">
            {HW_VARIANT.map((v, vi) => (
              <button key={v.k} className={`hw-chip ${variant === v.k ? 'on' : ''}${waveCls(pickTurn, vi, HW_VARIANT.length)}`} onClick={() => onPick(v.k)}>{tr(v.t)}</button>
            ))}
          </div>
        </>
      )}
      {variant ? (
        <div className="pmtask fade-step">
          <div className="pmtask-head"><span className="pmtask-tag">{tr({ uz: '🗂 Topshiriq kartasi', ru: '🗂 Карточка задания' })}</span><span className="pmtask-id">{variant === 'qisqa' ? tr({ uz: 'QISQA', ru: 'КОРОТКИЙ' }) : tr({ uz: "TO'LIQ", ru: 'ПОЛНЫЙ' })}</span></div>
          <div className="pmtask-rows">
            <div className="pmtask-row"><span className="pmtask-k">{tr({ uz: 'Nechta', ru: 'Сколько' })}</span><span className="pmtask-v"><b>{variant === 'qisqa' ? tr({ uz: '1 ta katak', ru: '1 ячейка' }) : tr({ uz: '4 ta katak', ru: '4 ячейки' })}</b></span></div>
            <div className="pmtask-row"><span className="pmtask-k">{tr({ uz: 'Muddat', ru: 'Срок' })}</span><span className="pmtask-v"><b>{tr({ uz: 'keyingi darsgacha', ru: 'до следующего урока' })}</b></span></div>
          </div>
          <div className="pmtask-steps">
            {steps.map((s, i) => <span key={i} className="pmtask-step"><i>{i + 1}</i>{tr(s)}</span>)}
          </div>
        </div>
      ) : (
        <div className="frame-soft fade-step"><p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: '👆 Avval variantni tanlang — topshiriq-karta shunga moslashadi.', ru: '👆 Сначала выберите вариант — карточка задания подстроится под него.' })}</p></div>
      )}
    </div>
  );
};
// ===== 🏅 NISHONLAR — 4 ta, faqat REAL tekshiriladigan harakatga =====
const ACHIEVEMENTS = {
  rightQuestion: { icon: '🙋', name: 'Right Question!', desc: { uz: "To'rt savolni murabbiydan o'zingiz so'radingiz", ru: 'Вы сами задали тренеру четыре вопроса' } },
  onePager:      { icon: '📄', name: 'One Pager!',      desc: { uz: "To'rt katakni ham to'ldirdingiz", ru: 'Вы заполнили все четыре ячейки' } },
  sharpEye:      { icon: '🔎', name: 'Sharp Eye!',      desc: { uz: "Uch varaqni ham to'g'ri o'qib chiqdingiz", ru: 'Вы правильно прочитали все три листа' } },
  codeCheck:     { icon: '⌨️', name: 'Code Check!',     desc: { uz: "Kod endi bo'sh katakni o'zi topadi", ru: 'Теперь код сам находит пустую ячейку' } },
};
const ACH_TRIGGERS = { s4: 'rightQuestion', s8: 'onePager', s9: 'sharpEye', s10: 'codeCheck' };

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
    ? (once ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Награда была за первую попытку.' }) : tr({ uz: "Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.", ru: 'Награда была за первую попытку — теперь спокойно найдите верный ответ.' }))
    : tr({ uz: "🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: '🏅 Выполните верно с первой попытки — и награда ваша.' })}</p>;
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

// Podium savol yorliqlari (scored indekslar 3/5/7/11)
const Q_LABELS = { 3: { uz: '1 — Yozilgan qator', ru: '1 — Написанная строка' }, 5: { uz: "2 — O'lchov katagi", ru: '2 — Ячейка «Измерение»' }, 7: { uz: "3 — Ko'rsatuv kuni", ru: '3 — День показа' }, 11: { uz: '4 — Yakuniy savol', ru: '4 — Итоговый вопрос' } };
const QUIZ_MS = 15000;
const QZ_BG_SHAPES = [
  { ch: { uz: 'varaq', ru: 'лист' }, l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'katak', ru: 'ячейка' }, l: 85, t: 8,  s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'qator', ru: 'строка' }, l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'savol', ru: 'вопрос' }, l: 74, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: { uz: "o'lchov", ru: 'измерение' }, l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: 'muammo', ru: 'проблема' }, l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'yechim', ru: 'решение' }, l: 26, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: { uz: 'kim', ru: 'кто' }, l: 55, t: 5,  s: 20, d: 22, dl: 0.6 },
  { ch: '📄',       l: 91, t: 42, s: 26, d: 24, dl: 1.3 },
  { ch: '📊',       l: 16, t: 52, s: 28, d: 26, dl: 2.6 },
  { ch: '🙋',       l: 2,  t: 30, s: 30, d: 28, dl: 3.1 },
];
// ⚔️ CodeStrike — 12 savol · to'g'ri indekslar 3/3/3/3 · naqshsiz. darslik-jonli TASDIQLAYDI.
// Ketma-ketlik: 0,3,2,1 · 1,0,2,3 · 0,2,1,3 — o'sib boradigan tsikl YO'Q.
// §138-C: to'g'ri javoblar bitta qolip bilan ajralib turmaydi, uzunlik-narvoni yo'q.
const QUIZ_BANK = [
  { q: { uz: "Sinfdoshingizga loyiha g'oyangizni og'zaki aytdingiz. Nima xavfi bor?", ru: 'Вы устно рассказали однокласснику идею своего проекта. Чем это рискованно?' }, opts: [{ uz: "U g'oyani o'zicha tushunib, boshqa narsa qiladi", ru: 'Он поймёт идею по-своему и сделает другое' }, { uz: "U g'oyani eshitib, darrov yoqtirib qoladi", ru: 'Он услышит идею и сразу её полюбит' }, { uz: "U g'oyani eslab qolishga ko'p vaqt sarflaydi", ru: 'Он потратит много времени, чтобы запомнить идею' }, { uz: "U g'oyani qog'ozga yozib berishni so'raydi", ru: 'Он попросит записать идею на бумаге' }], correct: 0 },
  { q: { uz: "Dasturchi «menga PRD bering» dedi. U nimani so'rayapti?", ru: 'Программист сказал: «дайте мне PRD». Что он просит?' }, opts: [{ uz: 'Ilovaning tayyor kodini', ru: 'Готовый код приложения' }, { uz: "Ishning narxi yozilgan qog'ozni", ru: 'Бумагу, где написана цена работы' }, { uz: 'Ilova ekranlarining rasmini', ru: 'Картинки экранов приложения' }, { uz: 'Nima qurilishi yozilgan hujjatni', ru: 'Документ, где написано, что будет построено' }], correct: 3 },
  { q: { uz: '«Odam qaysi kuni yozilganini eslay olmaydi» — qaysi katakka tushadi?', ru: '«Человек не может вспомнить, на какой день записался» — в какую ячейку это попадает?' }, opts: [{ uz: 'Kim katagiga', ru: 'В ячейку «Кто»' }, { uz: 'Yechim katagiga', ru: 'В ячейку «Решение»' }, { uz: 'Muammo katagiga', ru: 'В ячейку «Проблема»' }, { uz: "O'lchov katagiga", ru: 'В ячейку «Измерение»' }], correct: 2 },
  { q: { uz: "«Aynan kim qiynalyapti?» katagida qaysi qator to'g'ri yozilgan?", ru: 'Какая строка правильно заполняет ячейку «Кому именно мешает?»' }, opts: [{ uz: 'Ilovadan foydalanadigan hamma odam', ru: 'Все люди, которые пользуются приложением' }, { uz: "Ertalabki mashg'ulotga qatnaydiganlar", ru: 'Те, кто ходит на утренние занятия' }, { uz: "Ilovani to'lab beradigan tashkilot", ru: 'Организация, которая оплатит приложение' }, { uz: 'Kodni yozadigan dasturchilar guruhi', ru: 'Группа программистов, которые пишут код' }], correct: 1 },
  { q: { uz: 'Yechim katagiga qaysi qator tushadi?', ru: 'Какая строка попадает в ячейку «Решение»?' }, opts: [{ uz: 'Zamonaviy va tez ishlaydigan ilova', ru: 'Современное и быстрое приложение' }, { uz: 'Qatnash kunlarini belgilaydigan sahifa', ru: 'Страница, где отмечают дни посещения' }, { uz: 'Ikki hafta ichida tugatiladigan ish', ru: 'Работа, которую закончат за две недели' }, { uz: 'JavaScript tilida yoziladigan kod', ru: 'Код, написанный на JavaScript' }], correct: 1 },
  { q: { uz: "O'lchov katagi nima uchun kerak?", ru: 'Зачем нужна ячейка «Измерение»?' }, opts: [{ uz: "Ish natija berganini sanab ko'rsatadi", ru: 'Показывает в числах, что работа дала результат' }, { uz: 'Ilova narxini oldindan hisoblab beradi', ru: 'Заранее считает цену приложения' }, { uz: 'Dasturchilar sonini aniqlab beradi', ru: 'Определяет, сколько нужно программистов' }, { uz: 'Ish necha kun davom etishini aytadi', ru: 'Говорит, сколько дней продлится работа' }], correct: 0 },
  { q: { uz: "O'lchov katagi to'ldirilmasa, nima yo'qoladi?", ru: 'Что теряется, если ячейку «Измерение» не заполнить?' }, opts: [{ uz: "Ishni boshlash imkoni yo'qoladi", ru: 'Пропадает возможность начать работу' }, { uz: 'Varaqning boshqa uch katagi', ru: 'Остальные три ячейки листа' }, { uz: 'Ish natija berdimi degan javob', ru: 'Ответ на вопрос, дала ли работа результат' }, { uz: "Dasturchiga to'lanadigan haq", ru: 'Оплата программисту' }], correct: 2 },
  { q: { uz: 'Varaq to\'ldirilgandan keyin uch dasturchi nima qurdi?', ru: 'Что построили три программиста после того, как лист был заполнен?' }, opts: [{ uz: "Har biri o'zicha boshqa narsa qurdi", ru: 'Каждый построил по-своему что-то другое' }, { uz: 'Uchalasi ham ishni boshlay olmadi', ru: 'Никто из троих не смог начать работу' }, { uz: 'Ikkitasi qurdi, uchinchisi qura olmadi', ru: 'Двое построили, третий не смог' }, { uz: 'Uchalasi ham bir xil ekran qurdi', ru: 'Все трое построили одинаковый экран' }], correct: 3 },
  { q: { uz: 'Geyts va Allen ishni qanday tartibda qildi?', ru: 'В каком порядке Гейтс и Аллен делали работу?' }, opts: [{ uz: 'Avval nima qurishini aytdi, keyin yozdi', ru: 'Сначала сказали, что построят, потом написали' }, { uz: 'Avval tilni yozdi, keyin murojaat qildi', ru: 'Сначала написали язык, потом обратились в компанию' }, { uz: 'Avval Altairni sotib oldi, keyin yozdi', ru: 'Сначала купили Altair, потом написали' }, { uz: "Avval sinovdan o'tkazdi, keyin va'da berdi", ru: 'Сначала проверили, потом пообещали' }], correct: 0 },
  { q: { uz: 'Til hali yozilmagan payt ular nima qildi?', ru: 'Что они сделали, когда язык ещё не был написан?' }, opts: [{ uz: 'Altairni sotib olib, uyga olib keldi', ru: 'Купили Altair и принесли домой' }, { uz: 'Kompaniyaga tayyor tilni pochtada yubordi', ru: 'Отправили готовый язык в компанию по почте' }, { uz: "Kompaniyaga «bizda til bor» deb va'da berdi", ru: 'Пообещали компании: «у нас есть язык»' }, { uz: 'Jurnalga maqola yozib chiqardi', ru: 'Написали статью в журнал' }], correct: 2 },
  { q: { uz: "Varaq qachon tayyor bo'ladi?", ru: 'Когда лист готов?' }, opts: [{ uz: 'Kamida ikkita katagi yozilganda', ru: 'Когда заполнены хотя бы две ячейки' }, { uz: 'Har katakda savolga aniq javob bo\'lganda', ru: 'Когда в каждой ячейке есть точный ответ на вопрос' }, { uz: 'Kod bilan birga topshirilganda', ru: 'Когда его сдают вместе с кодом' }, { uz: "Uzun gaplar bilan to'ldirilganda", ru: 'Когда он заполнен длинными фразами' }], correct: 1 },
  { q: { uz: "Varaq to'ldirilmasa, qaror kimning qo'liga o'tadi?", ru: 'Если лист не заполнить, в чьи руки перейдёт решение?' }, opts: [{ uz: 'Ilovani ochgan odamning', ru: 'Того, кто откроет приложение' }, { uz: 'Basseyn murabbiysining', ru: 'Тренера бассейна' }, { uz: "Sinov o'tkazadigan odamning", ru: 'Того, кто проводит проверку' }, { uz: 'Kod yozadigan dasturchining', ru: 'Программиста, который пишет код' }], correct: 3 },
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
    const TOK = [{ uz: 'varaq', ru: 'лист' }, { uz: 'katak', ru: 'ячейка' }, { uz: 'qator', ru: 'строка' }, { uz: 'savol', ru: 'вопрос' }, { uz: "o'lchov", ru: 'измерение' }, { uz: 'muammo', ru: 'проблема' }, { uz: 'yechim', ru: 'решение' }, { uz: 'kim', ru: 'кто' }];
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
              <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: "🏆 To'liq reyting", ru: '🏆 Полный рейтинг' })}</div>
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
// Tuzilma etalondan (P0 PmUserStory · PmLesson2 · PmLesson4 F-0803-04):
// hero (h-sub YO'Q) -> CodeStrike -> «Endi siz bilasiz» -> uy-vazifa kapsulasi -> nishonlar.
const ScreenSummary = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const live = _gate.live;
  const isMentorL = !!(live && live.mode === 'mentor');
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const RECAP = [
    { uz: "Og'zaki gapni har kim o'zicha tushunadi — yozilgan qator hammaga bir xil ko'rinadi.", ru: 'Устную фразу каждый понимает по-своему — написанную строку все видят одинаково.' },
    { uz: "PRD — mahsulot talablari hujjati. Uning eng sodda ko'rinishi — bitta varaq, to'rt katak.", ru: 'PRD — документ с требованиями к продукту. Его самая простая форма — один лист, четыре ячейки.' },
    { uz: "To'rt katak: muammo, kim, yechim, o'lchov.", ru: 'Четыре ячейки: проблема, кто, решение, измерение.' },
    { uz: "Katak bo'sh qolsa, dasturchi taxmin qiladi — bilmasangiz, so'rab aniqlashtiring.", ru: 'Если ячейка пустая, программист додумывает сам — не знаете, спросите и уточните.' },
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
  // 77-qonun (tekshiruvchi topilmasi): kapsula bosilganda topshiriq-karta yakun sahifasini
  // uzaytirib yuborardi (+316px 1440x900, +416px 1280x800) va karta ekran ostida qolardi —
  // bola «Uyga vazifa» ni bosardi, ekranda esa hech nima o'zgarmasdi. Yechim tuzilmaviy:
  // karta sahifaga qo'shilmaydi, to'liq-ekran qatlamida ochiladi. Sahifa uzunligi
  // o'zgarmaydi => skroll deltasi 0. Escape va ✕ yopadi, kapsula o'z joyida qoladi.
  useEffect(() => {
    if (!hwOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setHwOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hwOpen]);
  const [charge, setCharge] = useState(false);
  const fireHw = () => { if (charge || hwOpen) return; setCharge(true); setTimeout(() => { setHwOpen(true); setCharge(false); }, 500); };
  const recapCard = (
    <div className="card fade-up d3">
      <div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div>
      <ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul>
    </div>
  );
  // MD 15-ekran: keyingi dars qatori — yakun matnida (uyga vazifa kartasidan tashqarida)
  const nextLine = <p className="small fade-up d4" style={{ margin: 0, color: T.ink2, lineHeight: 1.45 }}>{tr({ uz: <>🚀 Keyingi dars — <b>Arxitektura patternlari:</b> tizimni tuzishning sinab ko'rilgan usullari (MVC, monolit, mikroservis).</>, ru: <>🚀 Следующий урок — <b>Паттерны архитектуры:</b> проверенные способы устройства системы (MVC, монолит, микросервисы).</> })}</p>;
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen" style={{ gap: 'clamp(7px,0.85vw,10px)' }}>
        <div className="hero">
          <div className="hero-l">
            <div className="hero-chips"><span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Dars tugadi', ru: 'Урок завершён' })}</span>{!isMentorL && <span className="score-chip fade-up">{correct}/{total} {tr({ uz: "to'g'ri", ru: 'верно' })}</span>}</div>
            <h2 className="title h-title fade-up d1">{tr({ uz: <>Mini-do'koningiz uchun <span className="italic" style={{ color: T.accent }}>bitta varaq</span> to'ldirdingiz.</>, ru: <>Вы заполнили <span className="italic" style={{ color: T.accent }}>один лист</span> для своего мини-магазина.</> })}</h2>
          </div>
          
        </div>
        {/* 103-qonun: darsni bitta gap yopadi */}
        <div className="bigidea fade-up d2"><span className="bigidea-lbl">{tr({ uz: 'Bugungi asosiy fikr —', ru: 'Главная мысль дня —' })}</span><p className="bigidea-t">{tr({ uz: "Bitta gapni har kim boshqacha tushunishi mumkin. Shuning uchun fikrni yozib, aniqlashtiramiz.", ru: 'Одну и ту же фразу каждый может понять по-своему. Поэтому мы записываем мысль и уточняем её.' })}</p></div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: '⏳ Mentorni kuting', ru: '⏳ Дождитесь ментора' }) : undefined} />
        </div>
        {arena && <QuizArena live={live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        {/* «Endi siz bilasiz» va nishonlar yonma-yon (58-qonun): yakun-sahifasi bir ko'z bilan ko'rinadi. */}
        {isMentorL ? <>{recapCard}{nextLine}</> : (
          <div className="split sum2">
            {recapCard}
            <div className="col" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
            <div className="card ach-coll fade-up d4">
              <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: '🏅 Nishonlaringiz', ru: '🏅 Ваши награды' })} — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
              <div className="ach-grid">
                {Object.entries(ACHIEVEMENTS).map(([id, a]) => { const got = !!(achievements && achievements.has(id)); return (
                  <div key={id} className={`ach-badge ${got ? 'got' : 'locked'}`} title={tr(a.desc)}>
                    <span className="ach-badge-ic">{got ? a.icon : '🔒'}</span>
                    <span className="ach-badge-name">{tr(a.name)}</span>
                    {got && <span className="ach-badge-desc">{tr(a.desc)}</span>}
                  </div>
                ); })}
              </div>
            </div>
            {nextLine}
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
        {hwOpen && (
          <div className="hw-ov" role="dialog" aria-modal="true" aria-label={tr({ uz: 'Uyga vazifa', ru: 'Домашнее задание' })}>
            <div className="hw-ov-in">
              <button className="rc-x hw-ov-x" onClick={() => setHwOpen(false)} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button>
              <HwCard variant={hwVariant} onPick={pickHw} />
            </div>
          </div>
        )}
        <MentorNote>{tr({ uz: "Arena tugagach g'oliblarni nomlab tabriklang. Uy-vazifa: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa. Muddat — keyingi darsgacha. Tekshirishda bitta savolga qarang: qayta so'ralgan katakning qatori yangidan yozilganmi?", ru: 'Когда арена закончится, назовите победителей и поздравьте их. Домашнее задание: тем, кто закончил код в классе, — полный вариант, кто не успел — короткий. Срок — до следующего урока. При проверке смотрите на один вопрос: переписана ли заново строка ячейки, о которой переспросили?' })}</MentorNote>
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
  .delay-1 { animation-delay: 0.12s; } .delay-2 { animation-delay: 0.24s; } .delay-3 { animation-delay: 0.36s; }
  @keyframes fade-step { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .fade-step { animation: fade-step 0.3s ease-out; }
  .d1 { animation-delay: 0.12s; } .d2 { animation-delay: 0.24s; } .d3 { animation-delay: 0.36s; } .d4 { animation-delay: 0.48s; }
  /* Harakatga sezgir o'quvchi uchun: ekran-kirishida SILJISH qolmaydi, faqat yumshoq ochilish. */
  @keyframes rm-fade { from { opacity: 0; } to { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) {
    .fade-up { animation: rm-fade 0.3s ease-out forwards; }
    .fade-step { animation: rm-fade 0.25s ease-out; }
  }

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
  .btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }
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

  .frame-soft { background: ${T.accentSoft}; border-radius: 12px; padding: clamp(13px,2vw,17px); box-shadow: 0 6px 16px -6px rgba(91,61,230,0.22); }
  .frame-success { background: ${T.successSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -6px rgba(31,122,77,0.22); }
  .frame-wait { background: ${T.blueSoft}; border-radius: 12px; padding: clamp(14px,2.5vw,20px); box-shadow: 0 6px 16px -8px rgba(1,154,203,0.22); }

  .screen { flex: 1 0 auto; min-height: 0; display: flex; flex-direction: column; gap: clamp(14px,2vw,20px); }
  .screen > * { flex-shrink: 0; }
  .head { display: flex; flex-direction: column; gap: 6px; }
  .head-c { text-align: center; align-items: center; } /* F-1003-04: natija ekrani — bitta o'q */
  .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(16px,2.6vw,30px); align-items: start; }
  .split.sum2 { gap: clamp(12px,2vw,22px); }
  /* Yakun-sahifasi bir ko'z bilan ko'rinsin (58-qonun): nishonlar bitta qatorga tizilib,
     kartaning bo'yi ikki barobar qisqaradi; joy yetmasa panjara o'zi ikki ustunga tushadi. */
  .split.sum2 .ach-grid { grid-template-columns: repeat(auto-fit, minmax(104px, 1fr)); }
  @media (max-width: 860px) { .split.sum2 { grid-template-columns: 1fr; } }
  .col { display: flex; flex-direction: column; gap: clamp(12px,2vw,16px); min-width: 0; }
  /* O'ng ustun hali BO'SH bo'lsa (topshiriq/yordam ochilmagan) — chap karta sahnaning
     o'rtasida turadi: sahna bo'sh yarim ekran bilan qolmaydi. Ustun to'lganda yumshoq o'tadi. */
  .split { transition: grid-template-columns 0.4s cubic-bezier(.4,0,.2,1); }
  .split:has(> .col:last-child:empty) { grid-template-columns: minmax(0,1fr); }
  @media (max-width: 860px) { .split { grid-template-columns: 1fr !important; gap: clamp(14px,3vw,20px); } }
  @media (prefers-reduced-motion: reduce) { .split { transition: none; } }

  .takeaway { background: ${T.accentSoft}; border-radius: 14px; padding: clamp(13px,1.8vw,18px) 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; }
  .ta-bulb { font-size: 30px; }
  .ta-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; margin: 0; }

  .hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
  .hero-l { flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 8px; }
  .done-chip { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.success}; background: ${T.successSoft}; padding: 5px 12px; border-radius: 99px; }
  .hero-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; } .score-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 12px; font-variant-numeric: tabular-nums; color: ${T.accent}; background: ${T.accentSoft}; padding: 5px 12px; border-radius: 999px; } /* F-1003-04/05: yakunda halqa o'rniga yorliq */
  .done-chip .tick { width: 15px; height: 15px; border-radius: 50%; background: ${T.success}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 9px; }
  /* Yakun-sahifasi bir ko'z bilan ko'rinsin (58-qonun): aylana biroz ixchamlashdi —
     svg va idish BIR o'lchamda qoladi, aks holda o'rtadagi son markazdan siljiydi. */
  .ring-wrap svg { width: 106px; height: 106px; display: block; }
  .ring-wrap { position: relative; width: 106px; height: 106px; flex-shrink: 0; }
  .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .ring-num { font-family: 'Source Serif 4', serif; font-size: 26px; font-weight: 500; line-height: 1; }
  .ring-den { color: ${T.ink3}; font-size: 17px; }
  .ring-lbl { font-size: 10px; color: ${T.ink2}; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 3px; }
  .card { background: ${T.paper}; border-radius: 16px; padding: 12px 16px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); min-width: 0; overflow-wrap: anywhere; }
  .card-lbl { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: 13px; margin-bottom: 6px; }
  .recap { display: flex; flex-direction: column; gap: 5px; list-style: none; }
  .recap li { display: flex; align-items: flex-start; gap: 9px; font-size: clamp(12.5px,1.45vw,14px); line-height: 1.4; color: ${T.ink}; animation: fade-in-up 0.4s ease-out forwards; opacity: 0; }
  .recap .ck { color: ${T.success}; font-weight: 700; flex-shrink: 0; }
  .done-mini { display: inline-flex; align-items: center; gap: 7px; align-self: flex-start; background: ${T.successSoft}; color: ${T.success}; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); border-radius: 99px; padding: 8px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; min-width: 0; overflow-wrap: anywhere; }
  .done-mini .dm-sub { font-weight: 600; color: ${T.ink2}; }
  .qcode { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 0.92em; background: rgba(20,17,14,0.08); border-radius: 6px; padding: 1px 6px; white-space: nowrap; }
`;

// Dars-vizuallari: bir varaq (imzo-vizual), murabbiy savollari, katak-tekshiruv, yozish-ekrani.
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
  .hrow.two { grid-template-columns: repeat(2, minmax(0,1fr)); max-width: 720px; align-self: center; width: 100%; }
  .hrow.two .hopt { padding: clamp(14px,2vw,20px) clamp(10px,1.6vw,16px); }
  .bb-dots { display: inline-flex; gap: 4px; margin-right: 8px; }
  .bb-dots i { width: 7px; height: 7px; border-radius: 50%; background: ${T.ink3}66; }

  .jtask { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; color: ${T.ink}; background: ${T.paper}; border-radius: 12px; padding: 10px 13px; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.2); min-width: 0; overflow-wrap: anywhere; }
  .jres { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12.5px,1.5vw,13.5px); line-height: 1.45; border-radius: 10px; padding: 9px 12px; min-width: 0; overflow-wrap: anywhere; }
  .jres.ok { color: ${T.success}; background: ${T.successSoft}; }
  .jres.ask { color: ${T.accent}; background: ${T.accentSoft}; }

  @keyframes s1-ok { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }

  /* TEORIYA-1 (s2): ikki ta'rif kartasi — bosilsa ochiladi/yopiladi (46-qonun) */
  .dfc-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: clamp(10px,1.8vw,16px); }
  @media (max-width: 700px) { .dfc-grid { grid-template-columns: 1fr; } }
  .dfc { display: flex; flex-direction: column; gap: 9px; text-align: left; background: ${T.paper}; border: none; border-radius: 16px; padding: clamp(13px,2vw,18px); cursor: pointer; box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; transition: transform 0.16s, box-shadow 0.16s; min-width: 0; }
  .dfc:hover { transform: translateY(-2px); box-shadow: 0 14px 26px -9px rgba(${T.shadowBase},0.3), inset 0 0 0 1.5px ${T.accent}44; }
  .dfc:active { transform: translateY(0); }
  .dfc.open { box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 12px 26px -14px rgba(91,61,230,0.3); }
  .dfc-top { display: flex; align-items: center; gap: 9px; }
  .dfc-ic { font-size: clamp(20px,2.8vw,26px); line-height: 1; }
  .dfc-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; }
  .dfc-b { font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.6vw,14.5px); line-height: 1.5; color: ${T.ink2}; background: ${T.bg}; border-radius: 11px; padding: 9px 12px; min-height: 44px; display: flex; align-items: center; overflow-wrap: anywhere; min-width: 0; transition: background 0.2s, color 0.2s; }
  /* Yopiq karta «bosing» deb turadi: nuqtalar markazda, xira */
  .dfc:not(.open) .dfc-b { justify-content: center; color: ${T.ink3}; letter-spacing: 0.34em; }
  .dfc.open .dfc-b { color: ${T.ink}; background: ${T.accentSoft}; animation: fade-step 0.28s ease-out; }
  /* §134 rang-legendasi: shu darsda YASHIL bitta narsani anglatadi — «yozilgan».
     Xuddi shu yashil varaqning to'lgan katagida ham turadi (s4 · s8 · s9), shuning uchun
     2-karta («Varaqqa yozilgan») yashil; 1-karta («Og'zaki aytilgan») esa umumiy ochilish
     rangida qoladi — og'zaki gap hech narsa qoldirmaydi, unga o'z rangi berilmaydi.
     Ko'k bu darsda ma'no tashimaydi, shuning uchun ishlatilmaydi. */
  .dfc-grid .dfc:last-child.open { box-shadow: inset 0 0 0 1.5px ${T.success}66, 0 12px 26px -14px rgba(31,122,77,0.3); }
  .dfc-grid .dfc:last-child.open .dfc-b { background: ${T.successSoft}; }
  @media (prefers-reduced-motion: reduce) { .dfc, .dfc:hover { transition: none; transform: none; } .dfc.open .dfc-b { animation: none; } }



  /* YOZISH-EKRANI (s8): qaror-kartasi, qator-paneli, yozilganlar ro'yxati */
  /* Muharrir — ekranning yagona «baland» kartasi (80b): navbat shu yerda ekani soyadan ham ko'rinadi */
  .wsp-ed { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,17px); box-shadow: 0 16px 34px -16px rgba(${T.shadowBase},0.28), inset 0 0 0 2px ${T.accent}44; min-width: 0; }
  .wsp-ed-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.accent}; }
  .wsp-save { align-self: flex-end; font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.6vw,14.5px); color: #fff; background: ${T.accent}; border: none; border-radius: 12px; padding: 10px 20px; cursor: pointer; box-shadow: 0 10px 22px -10px rgba(91,61,230,0.6); transition: transform 0.14s, opacity 0.14s, box-shadow 0.14s; }
  .wsp-save:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 13px 26px -10px rgba(91,61,230,0.7); }
  .wsp-save:active:not(:disabled) { transform: translateY(0) scale(0.97); }
  .wsp-save:disabled { opacity: 0.42; cursor: not-allowed; box-shadow: none; }
  @media (prefers-reduced-motion: reduce) { .wsp-save { transition: none; } .wsp-save:hover:not(:disabled), .wsp-save:active:not(:disabled) { transform: none; } }
  .wsp-task { display: flex; flex-direction: column; gap: 5px; background: ${T.paper}; border-radius: 14px; padding: 11px 14px; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.2); min-width: 0; }
  .wsp-task-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
  .wsp-task-row { display: flex; align-items: center; gap: 8px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.45vw,13.5px); color: ${T.ink2}; background: ${T.bg}; border-radius: 9px; padding: 6px 10px; min-width: 0; overflow-wrap: anywhere; transition: background 0.2s, color 0.2s; }
  .wsp-task-row.done { color: ${T.success}; background: ${T.successSoft}; }
  .wsp-task-m { margin-left: auto; flex-shrink: 0; font-size: 14px; animation: s1-ok 0.34s cubic-bezier(.34,1.5,.4,1); }
  @media (prefers-reduced-motion: reduce) { .wsp-task-row { transition: none; } .wsp-task-m { animation: none; } }
  .wsp-task-n { font-size: 11.5px; font-weight: 700; color: ${T.ink3}; }
  .wsp-saverow { display: flex; align-items: center; justify-content: flex-end; gap: 10px; flex-wrap: wrap; } /* 187: qator ichida tugma o'ngga — align-self bu yerda ishlamaydi */
  /* 83/30-qonun: tugma faol bo'lmasa, nima yetishmayotgani SO'Z bilan yoziladi */
  .wsp-need { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink3}; }

  /* KODING darvoza-mashqi (82e): darsning O'Z texnik bilimidan bitta savol */
  .gt-btns { display: flex; gap: 6px; flex-wrap: wrap; }
  /* Darvoza-savoli — test-kartochkasi ritmida: uch variant teng enda, ustma-ust */
  .gt-btns.col3 { flex-direction: column; align-items: stretch; }
  .gt-b { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.45vw,13.5px); color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 10px; padding: 9px 14px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}; text-align: left; transition: box-shadow 0.14s, color 0.14s, transform 0.12s; min-width: 0; overflow-wrap: anywhere; }
  .gt-b:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.accent}66; color: ${T.accent}; }
  .gt-b:active:not(:disabled) { transform: scale(0.98); }
  .gt-b.miss { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; animation: cmt-shake 0.4s ease; }
  @media (prefers-reduced-motion: reduce) { .gt-b { transition: none; } .gt-b.miss { animation: none; } .gt-b:active:not(:disabled) { transform: none; } }

  /* KODING — VS Code-topshirig'i (82-qonun): panel CHAPDA, kod O'NGDA, nusxalash yopiq */
  .vsc { position: relative; background: #1E1E1E; border-radius: 14px; overflow: hidden; box-shadow: 0 14px 30px -10px rgba(${T.shadowBase},0.35); }
  .vsc-bar { background: #252526; display: flex; align-items: center; gap: 2px; padding-right: 8px; }
  .vsc-tab { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; color: #8B949E; background: #2D2D2D; border: none; padding: 9px 14px; display: inline-flex; align-items: center; gap: 6px; }
  .vsc-tab.on { background: #1E1E1E; color: #E6EDF3; box-shadow: inset 0 2px 0 #007ACC; }
  .vsc-lock { margin-left: auto; font-family: 'Manrope'; font-weight: 700; font-size: 11px; letter-spacing: 0.04em; color: #B9A8E6; background: rgba(255,255,255,0.07); border-radius: 8px; padding: 5px 11px; }
  .vsc.no-copy .vsc-body { user-select: none; -webkit-user-select: none; }
  .vsc-steps { display: flex; gap: 6px; padding: 7px 10px 0; background: #1E1E1E; }
  .vsc-step { flex: 1; min-width: 0; cursor: pointer; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11.5px; color: #8B949E; background: rgba(255,255,255,0.05); border: none; border-radius: 8px; padding: 6px 8px; transition: background 0.15s, color 0.15s; }
  .vsc-step:hover { color: #E6EDF3; background: rgba(255,255,255,0.1); }
  .vsc-step.on { color: #E6EDF3; background: rgba(0,122,204,0.28); box-shadow: inset 0 0 0 1.5px #007ACC; }
  .vsc-step:focus-visible { outline: 2px solid #4FC1FF; outline-offset: 1px; }
  .vsc-body { padding: 10px 14px 12px 6px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: clamp(11px,1.35vw,12.5px); color: #D4D4D4; line-height: 1.58; overflow: auto; max-height: clamp(150px, 23vh, 262px); scrollbar-width: thin; scrollbar-color: #4A4A4A #1E1E1E; }
  .vsc-term { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; padding: 7px 12px 8px; background: #181818; border-top: 1.5px solid #333; min-width: 0; }
  .vsc-term-lbl { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 10.5px; letter-spacing: 0.06em; color: #8B949E; }
  .vsc-term-cmd { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; color: #D4D4D4; min-width: 0; overflow-wrap: anywhere; }
  .vsc-term-cmd i { font-style: normal; color: #6A9955; margin-right: 5px; }
  .vsc-term-cmd b { font-weight: 600; color: #6E7681; margin-left: 5px; }
  .vsc-body::-webkit-scrollbar { width: 9px; height: 9px; }
  .vsc-body::-webkit-scrollbar-thumb { background: #4A4A4A; border-radius: 99px; }
  .vsc-body::-webkit-scrollbar-track { background: #1E1E1E; }
  @media (max-width: 620px) { .vsc-body { max-height: none; overflow-y: visible; } }
  .vsc-line { display: flex; align-items: baseline; min-width: max-content; }
  .vsc-ln { color: #6E7681; min-width: 26px; text-align: right; margin-right: 14px; font-size: 10.5px; flex-shrink: 0; user-select: none; }
  .vsc-code { white-space: pre; }
  .xul { background: ${T.paper}; border-radius: 14px; padding: clamp(13px,2vw,18px); display: flex; flex-direction: column; gap: 7px; box-shadow: 0 10px 24px -10px rgba(${T.shadowBase},0.2); }
  .xul-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; }
  .xul-b { margin: 0; font-size: clamp(13.5px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
  @keyframes itray-pulse { 0%, 100% { box-shadow: 0 0 0 1.5px ${T.accent}44, 0 0 0 0 rgba(91,61,230,0); } 50% { box-shadow: 0 0 0 2px ${T.accent}, 0 0 16px 2px rgba(91,61,230,0.22); } }
  /* RECAP mukofoti (106f-b): bitta tabrik-gap va bitta qoida-qatori.
     Qoida-qatori «muhr» kabi tushadi — mukofot real yutuqdan keyin, bir marta. */
  .rwd { display: flex; flex-direction: column; gap: 7px; align-items: flex-start; }
  .rwd-t { margin: 0; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.45; color: ${T.success}; background: ${T.successSoft}; border-radius: 10px; padding: 8px 12px; min-width: 0; overflow-wrap: anywhere; }
  .rwd-rule { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 7px 14px; min-width: 0; overflow-wrap: anywhere; box-shadow: inset 0 0 0 1.5px ${T.accent}44; animation: rwd-stamp 0.46s cubic-bezier(.34,1.5,.4,1) 0.16s both; }
  @keyframes rwd-stamp { 0% { opacity: 0; transform: scale(1.16); } 60% { opacity: 1; transform: scale(0.97); } 100% { opacity: 1; transform: scale(1); } }
  @media (prefers-reduced-motion: reduce) { .rwd-rule { animation: none; } }
  /* YAKUN (103-qonun): darsni yopadigan bitta gap — sahifaning oxirgi «hujjat»i */
  .bigidea { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 3px; align-items: center; text-align: center; background: ${T.paper}; border-radius: 16px; padding: clamp(9px,1.1vw,12px) clamp(14px,2.2vw,22px) clamp(12px,1.8vw,18px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.accent}33; }
  .bigidea-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; line-height: 1.2; letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; }
  .bigidea-t { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(15px,1.9vw,19px); line-height: 1.3; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .bhint { margin: 0; align-self: flex-start; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 9px; padding: 7px 12px; }
  /* ETALON 32: muvaffaqiyat-xabari CHIP bo'lib qoladi — to'liq-en yashil lenta emas */
  .bdone { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
  .bdone .done-mini { max-width: 780px; }

  /* BOSQICHLI OCHILISH (94-qonun): uch qadam-doirasi */
  .stps { display: flex; flex-wrap: wrap; gap: 8px; }
  .stp { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(11.5px,1.4vw,13px); color: ${T.ink3}; background: ${T.paper}; border-radius: 99px; padding: 5px 12px 5px 5px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .stp i { font-style: normal; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: ${T.bg}; color: ${T.ink3}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 11px; }
  .stp.on { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .stp.on i { background: ${T.accent}; color: #fff; }
  .stp.done { color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; }
  .stp.done i { background: ${T.success}; color: #fff; }
  /* 81-qonun: maydon-signallari MA'NO rangida (qizil hech qachon).
     bo'sh = xira halqa · kutmoqda = yumshoq indigo nafas · fokus = to'liq indigo 2px · to'lgan = indigo halqa. */
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
  .wsx-body p { font-size: 12.5px; color: ${T.ink2}; margin: 0; line-height: 1.4; overflow-wrap: anywhere; }
  .wsx-body b { color: ${T.ink}; }
  /* KODING (82-qonun): topshiriq-paneli CHAPDA, kompilyator-tugmasi O'NGDA */
  .kdpanel { position: relative; background: ${T.paper}; border-radius: 16px; padding: 11px 13px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.18); min-width: 0; transition: border-color 0.3s; }
  /* F-0926-05 #16: yashil ramka olindi — holatni tugma yoki yozuv aytadi */
  ol.kdreq { margin: 0; padding-left: 19px; display: flex; flex-direction: column; gap: 3px; }
  .kdreq li { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.38; color: ${T.ink2}; overflow-wrap: anywhere; }
  .cmt { background: ${T.bg}; border-radius: 13px; padding: 11px 13px; display: flex; flex-direction: column; gap: 9px; max-width: 680px; width: 100%; align-self: center; }
  .cmt.hunt { animation: cmt-hunt 1.7s ease-in-out infinite; }
  /* 72c: birinchi juftlik ulangach puls tinadi — signal ishini bajardi (.itray bilan bir naqsh) */
  .cmt.calm { animation: none; }
  @keyframes cmt-hunt { 0%, 100% { box-shadow: 0 0 0 0 rgba(110,75,255,0.4); } 50% { box-shadow: 0 0 0 9px rgba(110,75,255,0); } }
  .cmt-fold { display: inline-flex; align-items: center; gap: 10px; align-self: flex-start; background: ${T.successSoft}; border-radius: 99px; padding: 7px 9px 7px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; }
  @media (prefers-reduced-motion: reduce) { .cmt.hunt, .cmt.calm { animation: none; } }
  .cmt-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.5vw,13.5px); color: ${T.ink}; }
  .cmt-done { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.5vw,13.5px); color: ${T.success}; animation: fade-step 0.3s ease-out; }
  @keyframes cmt-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 55% { transform: translateX(5px); } 80% { transform: translateX(-2px); } }
  /* Javob-manbai (106d): NEYTRAL maslahat — accentSoft, xato-rangi EMAS. Bitta qator, cmt blokining ICHIDA. */
  .cmt-tip { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px,1.4vw,13px); line-height: 1.45; color: ${T.ink2}; background: ${T.accentSoft}; border-radius: 9px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; animation: fade-step 0.3s ease-out; }
  @media (prefers-reduced-motion: reduce) { .cmt-tip { animation: none; } }
  .lp-done-btn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13.5px,1.7vw,15px); cursor: pointer; border: none; border-radius: 13px; padding: 12px 18px; background: ${T.accent}; color: #fff; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.34); transition: all 0.18s; }
  /* F-1004-35: kod ekrani — ikki ustun bir balandlikda, «Bajardim» o'ngda (187) */
  .split.kod { align-items: stretch; }
  .split.kod > .col > .kdpanel, .split.kod > .col > .vsc { flex-grow: 1; }
  .split.kod .vsc { display: flex; flex-direction: column; }
  .split.kod .vsc-term { margin-top: auto; }
  .kdpanel .lp-done-btn { align-self: flex-end; margin-top: auto; }
  .lp-done-btn:hover:not(:disabled) { background: ${T.accent}; box-shadow: 0 12px 28px -6px rgba(91,61,230,0.5); }
  .lp-done-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .lp-done-btn.is-done { background: ${T.successSoft}; color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; cursor: default; }
  .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 10px 13px; display: flex; flex-direction: column; gap: 5px; }
  /* RECAP (s11) */
  .rcp-flow { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(12px,2vw,18px); align-items: stretch; }
  @media (max-width: 760px) { .rcp-flow { grid-template-columns: 1fr; } }
  .rcp-step { background: ${T.paper}; border-radius: 16px; padding: 16px 18px; box-shadow: 0 8px 22px -6px rgba(${T.shadowBase},0.14); display: flex; flex-direction: column; gap: 12px; min-width: 0; }
  .rcp-step-h { display: flex; gap: 11px; align-items: flex-start; }
  .rcp-n { width: 26px; height: 26px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}66; /* F-0926-05 #8: biroz yumshatildi */ font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 5px 12px -5px rgba(91,61,230,0.5), 0 0 0 3px ${T.accentSoft}; }
  .rcp-t { display: block; font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.7vw,16px); color: ${T.ink}; }
  .pair-timer { background: ${T.bg}; border-radius: 12px; padding: 13px 15px; display: flex; flex-direction: column; gap: 10px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
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
  /* 🖥 Altair 8800 old paneli (F-0921-23) — foto emas, kod bilan chizilgan maket */
  .alt-box { width: min(420px, 100%); background: linear-gradient(170deg,#2E2A3B,#1A1726); border-radius: 12px; padding: 13px 16px 11px; display: flex; flex-direction: column; gap: 9px; box-shadow: 0 10px 26px -8px rgba(${T.shadowBase},0.45), inset 0 0 0 1px rgba(255,255,255,0.07); }
  .alt-head { display: flex; align-items: baseline; justify-content: space-between; }
  .alt-brand { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: clamp(11px,1.5vw,13px); letter-spacing: 0.16em; color: #C9C4E4; }
  .alt-year { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 10.5px; color: #7B7597; }
  .alt-leds { display: flex; gap: 7px; justify-content: center; }
  .alt-led { width: 9px; height: 9px; border-radius: 99px; background: #46405C; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5); }
  .alt-led.on { background: #FF5A3D; box-shadow: 0 0 7px rgba(255,90,61,0.75); }
  .alt-switches { display: flex; gap: 11px; justify-content: center; padding-top: 4px; }
  .alt-sw { width: 11px; height: 26px; border-radius: 4px; background: #14121D; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.09); position: relative; }
  .alt-sw::after { content: ""; position: absolute; left: 2px; right: 2px; height: 11px; border-radius: 3px; background: linear-gradient(180deg,#EFEDF7,#A7A3BE); box-shadow: 0 1px 2px rgba(0,0,0,0.45); transition: top 0.2s; }
  .alt-sw.up::after { top: 2px; }
  .alt-sw:not(.up)::after { bottom: 2px; }
  .alt-note { margin: 2px 0 0; font-family: 'Manrope', sans-serif; font-size: clamp(10.5px,1.3vw,12px); color: #9691B0; text-align: center; }
  /* F-1004-02: Altair bosqichlari — panel o'zi voqeani aytadi */
  .alt-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%; }
  .alt-wrap.st-korsatuv .alt-led.on, .alt-wrap.st-aniq .alt-led.on { animation: alt-blink 1.4s ease-in-out infinite; animation-delay: calc(var(--i) * 0.11s); }
  @keyframes alt-blink { 50% { opacity: 0.35; } }
  .alt-tag { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; font-weight: 700; color: ${T.ink2}; border: 1px dashed ${T.ink3}; border-radius: 8px; padding: 5px 10px; }
  .alt-tape { width: min(420px, 100%); display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; color: ${T.ink2}; }
  .alt-tape-bar { height: 6px; border-radius: 99px; background: ${T.line}; overflow: hidden; }
  .alt-tape-bar i { display: block; height: 100%; width: 70%; background: ${T.accent}; border-radius: 99px; animation: alt-grow 2.4s ease-out both; }
  @keyframes alt-grow { from { width: 4%; } }
  .alt-tty { width: min(420px, 100%); background: #F4F0E2; border: 1px solid #DCD5BE; border-radius: 6px; padding: 8px 12px; display: flex; flex-direction: column; gap: 2px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 12.5px; color: #2B2620; }
  .alt-tty-l { overflow: hidden; white-space: nowrap; animation: alt-type 1.2s steps(12) both; }
  @keyframes alt-type { from { width: 0; } to { width: 100%; } }
  .alt-sheet { width: min(420px, 100%); display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .alt-sheet span { background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 9px; padding: 7px 10px; font-size: 13px; color: ${T.ink}; display: flex; flex-direction: column; gap: 2px; }
  .alt-sheet b { font-family: 'Manrope'; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
  @media (prefers-reduced-motion: reduce) { .alt-wrap .alt-led.on, .alt-tape-bar i, .alt-tty-l { animation: none; } }
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
  .hw-big-wrap { position: relative; align-self: center; width: min(560px, 100%); } /* 192 (F-1004-57): platforma standarti — o'rtada, 560px gacha */
  .hw-big-wrap::before { content: ''; position: absolute; inset: -16px; border-radius: 34px; background: radial-gradient(ellipse at center, rgba(124,58,237,0.45), rgba(124,58,237,0) 70%); filter: blur(18px); z-index: 0; pointer-events: none; animation: hw-aura 2.6s ease-in-out infinite; }
  @keyframes hw-aura { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
  .hw-big { position: relative; z-index: 1; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 3px; width: 100%; padding: clamp(10px,1.3vw,14px) clamp(26px,3.4vw,44px); border: 1.5px solid rgba(186,140,255,0.72); border-radius: 22px; cursor: pointer; background: radial-gradient(130% 170% at 50% 120%, #3D1F86 0%, #2A1560 44%, #1B0F3F 100%); color: #fff; box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32); animation: hw-fire 1.7s ease-in-out 0.9s infinite; transition: transform 0.2s; }
  .hw-big:hover { transform: translateY(-3px) scale(1.02); }
  .hw-big-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(19px,2.4vw,24px); letter-spacing: 0.02em; text-shadow: 0 2px 12px rgba(0,0,0,0.25); }
  .hw-big-s { font-family: 'Manrope'; font-weight: 700; font-size: clamp(13px,1.6vw,15px); opacity: 0.94; }
  .hw-big-shine { position: absolute; top: -40%; left: -60%; width: 45%; height: 180%; background: linear-gradient(100deg, transparent, rgba(255,255,255,0.28), transparent); transform: skewX(-18deg); animation: hw-shine 3.2s ease-in-out infinite; pointer-events: none; }
  .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; color: rgba(255,255,255,0.15); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
  @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
  .hw-big.charging { animation: hw-fire 1.7s ease-in-out 0.9s infinite, hw-charge 0.5s ease; }
  @keyframes hw-charge { 0% { filter: brightness(1); } 45% { filter: brightness(1.7) saturate(1.25); transform: scale(1.05); } 100% { filter: brightness(1); transform: scale(1); } }
  @keyframes hw-fire { 0%,100% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 26px rgba(124,58,237,.5), 0 0 68px rgba(124,58,237,.28), inset 0 0 48px rgba(124,58,237,.32), 0 0 0 0 rgba(124,58,237,.35); } 50% { box-shadow: 0 0 0 1px rgba(90,40,180,.45), 0 0 34px rgba(124,58,237,.68), 0 0 84px rgba(124,58,237,.4), inset 0 0 48px rgba(124,58,237,.32), 0 0 0 11px rgba(124,58,237,0); } }
  @keyframes hw-shine { 0% { left: -60%; } 55%, 100% { left: 130%; } }
  @media (prefers-reduced-motion: reduce) { .hw-big, .hw-big-shine, .hw-big-wrap::before, .hw-tok, .hw-big.charging { animation: none; } .hw-big-wrap::before { opacity: 0.55; } }
  /* Topshiriq-karta to'liq-ekran qatlamida: yakun-sahifasi uzaymaydi, skroll 0 (77-qonun). */
  .hw-ov { position: fixed; inset: 0; z-index: 10005; background: ${T.bg}; display: flex; align-items: center; justify-content: center; padding: clamp(14px,3vw,32px); overflow-y: auto; animation: fade-step 0.3s ease-out; font-family: 'Manrope', sans-serif; }
  .hw-ov-in { position: relative; width: 100%; max-width: 680px; min-width: 0; }
  .hw-ov-x { position: absolute; top: -6px; right: 0; transform: translateY(-100%); }
  @media (max-height: 720px) { .hw-ov { align-items: flex-start; } .hw-ov-x { top: 0; right: 0; transform: none; z-index: 2; } }

  /* HOOK (s0): OG'ZAKI aytilgan gap — atayin GAP-PUFAGI shaklida (dumchasi bilan).
     Butun dars shu qarama-qarshilikka tayanadi: pufak = og'izda aytilgan (yo'qoladi),
     varaq = qog'ozga yozilgan (joyida qoladi). Shuning uchun ikkalasining SHAKLI ham
     boshqacha — o'quvchi farqni o'qimasdan, ko'rib ham sezadi. */
  .gapcard { position: relative; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(13px,1.6vw,15px); color: ${T.ink}; background: ${T.paper}; border-radius: 18px 18px 18px 6px; padding: 11px 16px; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; max-width: 620px; width: 100%; align-self: center; min-width: 0; overflow-wrap: anywhere; }
  .gapcard::after { content: ''; position: absolute; left: 1px; bottom: -8px; width: 15px; height: 10px; background: ${T.paper}; clip-path: polygon(0 0, 100% 0, 8% 100%); }

  /* IMZO-VIZUAL «BIR VARAQ» — oq varaq, ustida to'rt katak (s1 · s4 · s8 · s9).
     Bo'sh katak — kulrang punktir (XATO EMAS: err/errSoft bu vizualda umuman yo'q);
     yozilgan katak — success hoshiyasi. */
  .varaq-wrap { display: flex; justify-content: center; }
  .s4-one { display: flex; flex-direction: column; gap: 10px; max-width: 720px; width: 100%; margin: 0 auto; }
  .varaq { display: flex; flex-direction: column; background: ${T.paper}; border-radius: 16px; overflow: hidden; box-shadow: 0 16px 34px -16px rgba(${T.shadowBase},0.28), inset 0 0 0 1.5px ${T.line}; max-width: 620px; width: 100%; align-self: center; min-width: 0; }
  .varaq-bar { display: flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11.5px; color: ${T.ink3}; background: ${T.bg}; padding: 6px 12px; box-shadow: inset 0 -1px 0 ${T.line}; min-width: 0; overflow-wrap: anywhere; }
  /* Panjara konteyner kengligiga qarab o'zi sinadi: tor ustunda (s4 o'ng ustun, s9 chap
     ustun, 520-860px oralig'i) ikki katak siqilib qolmaydi — bitta ustunga tushadi. */
  .varaq-cells { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 7px; padding: clamp(8px,1.2vw,11px); }
  .vcell { position: relative; display: flex; flex-direction: column; gap: 3px; width: 100%; text-align: left; background: ${T.bg}; border: 1.5px dashed ${T.ink3}66; border-radius: 12px; padding: 7px 26px 8px 11px; font-family: 'Manrope', sans-serif; min-width: 0; }
  /* §134 rang-legendasi: bo'sh ↔ yozilgan farqi RANGDAN TASHQARI shaklda ham ko'rinadi —
     bo'sh katak = punktir bo'sh halqa, yozilgan katak = to'lgan doira, topilgan katak = doira + gardish. */
  .vcell::before { content: ''; position: absolute; top: 11px; right: 10px; width: 9px; height: 9px; border-radius: 50%; border: 1.5px dashed ${T.ink3}; box-sizing: border-box; }
  .vcell.filled::before { border: 1.5px solid ${T.success}; background: ${T.success}; }
  .vcell.written::before { border: 1.5px solid ${T.ink3}; background: ${T.paper}; }
  .vcell.hit::before { border: 1.5px solid ${T.success}; background: ${T.success}; box-shadow: 0 0 0 3.5px ${T.success}33; }
  .vcell.soft::before { border: 1.5px solid ${T.accent}; background: ${T.accent}; }
  button.vcell { cursor: pointer; transition: box-shadow 0.16s, transform 0.14s; }
  button.vcell:hover { box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  button.vcell:focus-visible { outline: none; box-shadow: inset 0 0 0 2px ${T.accent}; }
  button.vcell:active { transform: scale(0.995); }
  .vcell-h { font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .vcell-q { font-weight: 700; font-size: 11.5px; color: ${T.ink3}; min-width: 0; overflow-wrap: anywhere; }
  .vcell-t { font-weight: 600; font-size: clamp(12px,1.45vw,13.5px); line-height: 1.4; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .vcell-t.empty { color: ${T.ink3}; letter-spacing: 0.18em; }
  .vcell.filled { background: ${T.paper}; border: 1.5px solid transparent; box-shadow: inset 0 0 0 1.5px ${T.success}55; animation: vcell-write 0.42s ease-out; }
  .vcell.written { background: ${T.paper}; border: 1.5px solid transparent; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .vcell.hit { background: ${T.successSoft}; animation: vcell-land 0.42s cubic-bezier(.34,1.5,.4,1); box-shadow: inset 0 0 0 2px ${T.success}; }
  .vcell.soft { background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}66; }
  .varaq.draw .vcell { opacity: 0; animation: vcell-in 0.5s cubic-bezier(.3,1.4,.45,1) forwards; animation-delay: var(--dd); }
  @keyframes vcell-in { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes vcell-write { from { opacity: 0.45; } to { opacity: 1; } }
  @keyframes vcell-land { 0% { transform: scale(0.97); } 55% { transform: scale(1.02); } 100% { transform: scale(1); } }
  /* MAQSAD-ekrani (s1) imzo-harakati: katak chizilgach ichida yozuv-kursori pirpiraydi —
     javob yozilmaydi (§125), lekin «bu yerga SIZ yozasiz» degani ko'rinib turadi. */
  .varaq.draw .vcell-t.empty::after { content: ''; display: inline-block; width: 2px; height: 0.95em; vertical-align: -1px; margin-left: 5px; background: ${T.accent}; animation: vcaret 1.06s step-end infinite; animation-delay: var(--dd); }
  @keyframes vcaret { 0%, 49% { opacity: 0.9; } 50%, 100% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .varaq.draw .vcell { animation: none; opacity: 1; } .vcell.filled, .vcell.hit { animation: none; } button.vcell:active { transform: none; } .varaq.draw .vcell-t.empty::after { animation: none; opacity: 0.45; } }

  /* YADRO (s4): chapda murabbiy va uning gapi, o'ngda varaq */
  .murab { display: flex; flex-direction: column; gap: 3px; background: ${T.paper}; border-radius: 14px; padding: 9px 12px; box-shadow: 0 12px 26px -14px rgba(${T.shadowBase},0.2), inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .murab-h { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
  .murab-gap { font-family: 'Source Serif 4', serif; font-style: italic; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .s4-run { align-self: flex-start; font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.6vw,14.5px); color: #fff; background: ${T.accent}; border: none; border-radius: 12px; padding: 11px 18px; cursor: pointer; box-shadow: 0 10px 22px -10px rgba(91,61,230,0.6); transition: transform 0.14s, box-shadow 0.16s; min-width: 0; overflow-wrap: anywhere; }
  .s4-run:hover { transform: translateY(-2px); box-shadow: 0 13px 26px -10px rgba(91,61,230,0.7); }
  .s4-run:active { transform: translateY(0) scale(0.97); }
  /* 🔴 S4 KASHFIYOTINING VIZUAL O'ZAGI — «bitta gap → uch xil ekran → bitta varaq → uch bir xil ekran».
     Ikkala natija ham AYNAN bir shaklda (mayda ilova-oynasi: tepasida sarlavha-yo'lagi va uch nuqta)
     va AYNAN uchtadan yonma-yon turadi. Farq faqat ichida: yuqorida uchta boshqa-boshqa ekran,
     pastda uchta bir xil ekran. Harakat ham shu ma'noni aytadi:
       · uch xil natija — birin-ketin keladi (har kim o'zicha qurdi),
       · uch bir xil natija — birdaniga, bitta sakrash bilan keladi (hammasi bir xil chiqdi). */
  .qurilgan { display: grid; grid-template-columns: repeat(auto-fit, minmax(136px,1fr)); gap: 6px; background: ${T.paper}; border-radius: 14px; padding: 8px 9px; box-shadow: inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .qur-row { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 3px; background: ${T.bg}; border-radius: 11px; padding: 17px 8px 7px; min-width: 0; animation: fade-in-up 0.32s ease-out both; }
  .qur-row::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 13px; border-radius: 11px 11px 0 0; background: ${T.paper}; box-shadow: inset 0 -1px 0 ${T.line}; }
  .qur-row::after { content: ''; position: absolute; top: 5px; left: 8px; width: 17px; height: 3px; background: radial-gradient(circle at 1.5px 1.5px, ${T.ink3}88 1.5px, transparent 1.8px) 0 0 / 7px 3px repeat-x; }
  .qur-row:nth-child(2) { animation-delay: 0.11s; }
  .qur-row:nth-child(3) { animation-delay: 0.22s; }
  .qur-ic { font-size: 15px; flex-shrink: 0; line-height: 1; }
  .qur-t { font-family: 'Manrope'; font-weight: 700; font-size: clamp(11px,1.3vw,12px); line-height: 1.28; color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .qur-t i { display: block; font-style: normal; font-weight: 600; font-size: 10px; line-height: 1.26; color: ${T.ink2}; margin-top: 2px; }
  .qur-sum { grid-column: 1 / -1; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.45vw,13.5px); color: ${T.accent}; min-width: 0; overflow-wrap: anywhere; }
  @media (prefers-reduced-motion: reduce) { .qur-row { animation: none; } .s4-run { transition: none; } .s4-run:hover, .s4-run:active { transform: none; } }
  /* 72-qonun: savol-tugmalari yorliqli idishda, diqqat-signali bilan; to'rttasi berilgach tinadi */
  .sdock { display: flex; flex-direction: column; gap: 6px; border-radius: 14px; padding: 7px 9px 8px; background: ${T.accentSoft}66; box-shadow: 0 0 0 1.5px ${T.accent}44; animation: itray-pulse 1.6s ease-in-out infinite; }
  .sdock.calm { animation: none; }
  .sdock-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
  .sdock-btns { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 6px; }
  @media (max-width: 620px) { .sdock-btns { grid-template-columns: 1fr; } }
  .sbtn { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: clamp(12px,1.45vw,13.5px); color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 12px; padding: 7px 11px; cursor: pointer; text-align: left; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 6px 16px -8px rgba(${T.shadowBase},0.16); transition: transform 0.14s, box-shadow 0.16s; min-width: 0; overflow-wrap: anywhere; }
  .sbtn:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 10px 20px -8px rgba(${T.shadowBase},0.26); }
  .sbtn:focus-visible { outline: none; box-shadow: inset 0 0 0 2px ${T.accent}; }
  .sbtn:active { transform: translateY(0) scale(0.98); }
  .sbtn.seen { box-shadow: inset 0 0 0 1.5px ${T.success}66; color: ${T.ink2}; }
  @media (prefers-reduced-motion: reduce) { .sdock, .sbtn { animation: none; transition: none; } .sbtn:hover, .sbtn:active { transform: none; } }
  /* Ikkinchi bosqich natijasi: uch dasturchi — uchta bir xil ekran */
  .qayta { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 7px; }
  .qayta-card { position: relative; display: flex; flex-direction: column; gap: 3px; background: ${T.successSoft}; border-radius: 11px; padding: 17px 8px 7px; box-shadow: inset 0 0 0 1.5px ${T.success}55; min-width: 0; animation: qayta-snap 0.44s cubic-bezier(.34,1.5,.4,1) both; }
  .qayta-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 13px; border-radius: 11px 11px 0 0; background: ${T.paper}; box-shadow: inset 0 -1px 0 ${T.success}44; }
  .qayta-card::after { content: ''; position: absolute; top: 5px; left: 8px; width: 17px; height: 3px; background: radial-gradient(circle at 1.5px 1.5px, ${T.success}77 1.5px, transparent 1.8px) 0 0 / 7px 3px repeat-x; }
  .qayta-card i { font-style: normal; font-family: 'Manrope'; font-weight: 700; font-size: 11px; line-height: 1.3; color: ${T.success}; min-width: 0; overflow-wrap: anywhere; }
  /* Uchalasi BIRDANIGA keladi — kechikish yo'q: «bitta varaqdan uchta bir xil natija». */
  @keyframes qayta-snap { 0% { opacity: 0; transform: translateY(8px) scale(0.95); } 62% { opacity: 1; transform: translateY(0) scale(1.035); } 100% { transform: translateY(0) scale(1); } }
  @media (prefers-reduced-motion: reduce) { .qayta-card { animation: none; } }
  /* Tor ekranda (split hali ikki ustun, lekin joy kam) savol-tugmalari va uch karta siqiladi */
  @media (max-width: 1000px) { .sdock { padding: 8px 9px 9px; } .sbtn { padding: 8px 10px; font-size: 12px; } .qayta { gap: 5px; } .qayta-card { padding: 18px 7px 8px; } .qur-row { padding: 18px 7px 8px; } }

  /* TEKSHIRUV (s9): «javobsiz katak yo'q» tugmasi va yakuniy ro'yxat */
  .clean-btn { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; background: ${T.paper}; border: none; border-radius: 12px; padding: 11px 15px; cursor: pointer; box-shadow: inset 0 0 0 1.5px ${T.line}, 0 8px 20px -10px rgba(${T.shadowBase},0.2); transition: transform 0.14s, box-shadow 0.16s; align-self: center; max-width: 620px; width: 100%; min-width: 0; overflow-wrap: anywhere; }
  .clean-btn:hover:not(:disabled) { box-shadow: inset 0 0 0 1.5px ${T.accent}66; color: ${T.accent}; }
  .clean-btn:active:not(:disabled) { transform: scale(0.98); }
  .clean-btn.miss { box-shadow: inset 0 0 0 2px ${T.accent}; background: ${T.accentSoft}; animation: cmt-shake 0.4s ease; }
  .clean-btn.hit { box-shadow: inset 0 0 0 2px ${T.success}; background: ${T.successSoft}; color: ${T.success}; }
  .clean-btn:disabled { cursor: default; }
  .varaq-sum { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border-radius: 14px; padding: 11px 13px; box-shadow: inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .vsum-row { font-family: 'Manrope'; font-weight: 600; font-size: clamp(12px,1.45vw,13.5px); color: ${T.ink2}; background: ${T.bg}; border-radius: 10px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; }
  .vsum-row b { color: ${T.ink}; }
  @media (prefers-reduced-motion: reduce) { .clean-btn { transition: none; } .clean-btn.miss { animation: none; } .clean-btn:active:not(:disabled) { transform: none; } }

  /* KODING (s10): kutilgan uch natija — kod-panelining o'z bloki */
  .kdout { display: flex; flex-direction: column; gap: 4px; background: ${T.bg}; border-radius: 10px; padding: 7px 10px; box-shadow: inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .kdout-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; color: ${T.accent}; }
  .kdout-row { font-size: 11.5px; font-weight: 600; color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; }

  /* TEKSHIRUV-ekrani tarhi (s9): varaq — ekranning bosh obyekti, shuning uchun chap ustun
     kengroq (kataklar siqilib qolmasin); o'ngda qisqa izoh va tugma turadi. */
  .split.s9v { grid-template-columns: minmax(0,1.3fr) minmax(0,0.95fr); }
  @media (max-width: 1000px) { .split.s9v { grid-template-columns: minmax(0,1.15fr) minmax(0,1fr); } }
  /* YADRO-ekrani tarhi (s4): chapda murabbiy va savol-tugmalari, o'ngda varaq */
  .split.s4 { grid-template-columns: minmax(0,1fr) minmax(0,1.05fr); }
  @media (max-width: 1000px) { .split.s4 { grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(12px,2vw,20px); } }
  @media (max-width: 860px) { .split.s4 { gap: 10px; } }
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
  @media (prefers-reduced-motion: reduce) { .ach-counter.bump { animation: none; } }
  .ach-pop { position: absolute; top: calc(100% + 8px); right: 0; z-index: 200; width: 232px; background: ${T.paper}; border: 1px solid ${T.line}; border-radius: 14px; padding: 10px; box-shadow: 0 18px 44px -14px rgba(${T.shadowBase},0.4); display: flex; flex-direction: column; gap: 3px; animation: fade-step 0.22s ease; }
  .ach-pop-h { font-family: 'Manrope'; font-weight: 800; font-size: 12px; color: ${T.accent}; padding: 2px 6px 6px; }
  .ach-pop-row { display: flex; align-items: center; gap: 9px; padding: 6px 8px; border-radius: 9px; }
  .ach-pop-row.got { background: ${T.accentSoft}66; }
  .ach-pop-ic { font-size: 17px; width: 20px; text-align: center; }
  .ach-pop-row:not(.got) .ach-pop-ic { filter: grayscale(1) opacity(0.5); font-size: 13px; }
  .ach-pop-nm { font-family: 'Manrope'; font-weight: 700; font-size: 13px; color: ${T.ink}; }
  .ach-pop-row:not(.got) .ach-pop-nm { color: ${T.ink3}; }
  .ach-coll { display: flex; flex-direction: column; gap: 10px; }
  .ach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  @media (max-width: 560px) { .ach-grid { grid-template-columns: repeat(2, 1fr); } }
  .ach-badge { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 2px; border-radius: 14px; padding: 7px 6px; transition: transform 0.15s; }
  .ach-badge.got { background: linear-gradient(160deg, ${T.accentSoft}, #F5F1FE); border: 1.5px solid ${T.accent}55; }
  .ach-badge.locked { background: ${T.bg}; border: 1.5px dashed ${T.line}; opacity: 0.75; }
  .ach-badge-ic { font-size: 24px; line-height: 1; }
  .ach-badge.locked .ach-badge-ic { filter: grayscale(1) opacity(0.55); font-size: 19px; }
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
  /* F-1004-21: natija ekrani — 5-Modul qolipi (166/177-qonun): halqa, nishonlar va izoh BITTA oq kartada */
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
  @media (max-width: 440px) { .pod-card-badges { gap: 6px; flex-wrap: nowrap; } .pcb { width: 62px; } .pcb-ic { width: 44px; height: 44px; font-size: 22px; } } /* telefonda 4 nishon bitta qatorda */
  @media (prefers-reduced-motion: reduce) { .pcb.got .pcb-ic { animation: none; } }
  .pod-solo { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
  .pod-solo-sec { background: ${T.paper}; border-radius: 14px; padding: 12px 18px; display: flex; flex-direction: column; align-items: center; gap: 8px; box-shadow: 0 8px 20px -8px rgba(${T.shadowBase},0.16); }
  .pod-solo-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
  .pod-solo-badges { display: flex; gap: 9px; align-items: center; }
  .pod-solo-b { font-size: 24px; line-height: 1; }
  .pod-solo-b:not(.got) { filter: grayscale(1) opacity(0.45); font-size: 18px; }

  .qz-cta { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; border-radius: 18px; }
  .cs-cta { flex-direction: column; align-items: stretch; justify-content: center; text-align: center; gap: 0; position: relative; padding: 0; background: none; border: none; box-shadow: none; }
  .cs-cta .cs-cap { padding: clamp(7px,0.9vw,11px) clamp(22px,3.2vw,40px); gap: clamp(2px,0.4vw,5px); }
  @property --csa { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
  .cs-cap { position: relative; overflow: hidden; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%;
    gap: clamp(10px,1.5vw,15px); padding: clamp(26px,3.6vw,44px) clamp(22px,3.2vw,40px); border-radius: 999px; /* 192 (F-1004-57): CODE STRIKE — kapsula, platforma standarti */
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
  .csn-bolt { width: clamp(26px,3.6vw,42px); height: auto; filter: drop-shadow(0 0 9px rgba(170,120,255,.75)); animation: cs-bolt-strike 2s linear infinite; }
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
// ============================================================ LESSON ROOT
export default function PmLesson22({ lang: langProp, onFinished, liveToken }) {
  const lang = langProp || 'uz';
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
