import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
// Kod kompilyatori — UMUMIY modul (F-0809-05 · GATE S 3-qarori). Tugma bilan ochiladigan
// to'liq-ekran asbob, shuning uchun CodeStrike brendida (PM_DARS_ETALON 1-bo'lim istisnosi).
import HtmlCompiler, { checks as C } from '../compilator/HtmlCompiler.jsx';
const MENTOR_IMG = 'https://go.coddycamp.uz/uploads/media_library/c7b711619071c92bef604c7ad68380dd.png';

// ============================================================
// PM · M5-D11 — KECHA KELGAN ODAM BUGUN HAM KELDIMI? (qaytish)
// Senariy-manba: pm-senariylar/M5-D11-Qaytish.md ([GATE S] yopilgan, 2026-08-18).
// Misol-ip: o'quvchining O'Z Telegram-boti — M5 bo'yi qurgan boti (91/95/96c/108-qonun).
// Imzo-vizual: QAYTISH-KALENDARI — kunlar ustun, odamlar belgi; e'lon yuqori qatorni ko'taradi.
// Bosh keys: K5 Duolingo — burchak «sanoq birligi»; K5 endi faqat shu darsda (oldingi Metrika darsidan chiqarilgan, F-0928-06).
// Kirish-artefakt: pm-m5d8-javoblar (8-darsda eshitilgan javoblar) — JIM zaxira (§69).
// Chiqish-artefakt: pm-m5d11-metrika = { kunlar: [{kun, kelgan, qaytgan} x3], savedAt } — M5 ni yopadi.
// INFRA MANBAI: src/4c-Modull/PmLesson17.jsx (M4c-D2) va src/4a-Modull/PmLesson15.jsx (M4a-D2) —
//   ular o'z navbatida src/pm/PmUserStoryLesson.jsx (P0) va src/3-Modull/PmLesson9.jsx (M3-D10)
//   dan: jonli relslar, Stage, QuestionScreen, MentorTestStats, RecapOverlay, PairTimer,
//   ScreenPodium, CodeStrike-arena, nishonlar, to'liq-ekran kompilyator qobig'i (zoom-bekori).
// KODING: umumiy kompilyator (registr R1 navbati: m5-08 VS Code -> m5-11 kompilyator), sof JS.
// ATAMA-INTIZOMI (MD v2, F-1001): «qaytgan» 11-darsda o'tilgan — bu dars uni ESLATADI (s0/s1 da
//   «Qaytdi» ustuni ham shu nom bilan); foiz bu darsda o'rgatilmaydi; «hisoblanadi» ishlatilmaydi
//   («X — Y»); «kir-» o'zagi odam haqida ishlatilmaydi. Yashil — faqat qaytish (A-12.1).
// BIR TILLI (UZ): tarjima-yordamchisi yo'q; RU alohida sweep'da qo'shiladi.
// PRODUCTION: <style> ichidagi @import OLIB TASHLANADI — shriftlarni LMS yuklaydi.
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
const LESSON_META = { lessonId: 'pm-m5d11-v1', lessonTitle: { uz: 'Kecha kelgan odam bugun ham keldimi?', ru: 'Тот, кто пришёл вчера, пришёл ли сегодня?' } };
// YAKUN-TUZILMASI ETALONDAN (P0 PmUserStory · PmLesson2 · PmLesson4 · M3-D10 · M4c-D2):
// koding → yakuniy test → refleksiya → PODIUM → FLASHCARD → YAKUN (CodeStrike + uy-vazifa BIR sahifada).
// Uy-vazifa va arena alohida ekran BO'LMAYDI — ikkovi ham yakun ichida.
const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom', scored: false, scope: 'hook' },        // 0  · BLOK 1
  { id: 's1',  type: 'rule',        template: 'custom', scored: false, scope: null },          // 1  · BLOK 2
  { id: 's2',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 2  · BLOK 3 teoriya-1
  { id: 's3',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 3  · TEST-1
  { id: 's4',  type: 'exploration', template: 'custom', scored: false, scope: null },          // 4  · YADRO: kunlar kalendari
  { id: 's5',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 5  · TEST-2
  { id: 's6',  type: 'case',        template: 'custom', scored: false, scope: null },          // 6  · K5 keys (Duolingo)
  { id: 's7',  type: 'test',        template: 'custom', scored: true,  scope: 'module-mikro' },// 7  · TEST-3
  { id: 's8',  type: 'practice',    template: 'custom', scored: false, scope: null },          // 8  · BLOK 4 uch kunlik hisob
  { id: 's9',  type: 'practice',    template: 'custom', scored: false, scope: null },          // 9  · BLOK 5 tekshiruv
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
  s0: "Bola botiga kecha kelgan odam bugun ham kelganini ayta oladimi — shuni belgilaydi va har kunning ikki sonini yozib borish kerakligini eshitadi",
  s1: "Bola dars oxirida botining uch kunlik hisobini yozib olishini oldindan ko'radi",
  s2: "Bola ikki kartani solishtirib bugun kelganlar bilan qaytganlar bir son emasligini topadi",
  s3: "Bola ikki kunda ham kelgan odamlar qaytgan odam ekanini tanlaydi",
  s4: "Bola kunlarni birma-bir ochib, e'londan keyin kelganlar ko'tarilganini, qaytganlar esa deyarli o'zgarmaganini ko'radi",
  s5: "Bola namunadagi sonlardan ko'p odam kelgani ko'p odam qaytgani degani emasligini o'qiydi",
  s6: "Bola Duolingo'dagi olov belgili raqam kunlarni sanashini va bir kun tashlansa noldan boshlanishini biladi",
  s7: "Bola ketma-ket kunlar raqami o'sishi uchun odam kunini tashlamasligi kerakligini tanlaydi",
  s8: "Bola o'z botining uch kunini bittalab yozadi: har kuni nechta odam kelgani va ulardan nechtasi qaytgani",
  s9: "Bola to'rt odamning besh kunlik ro'yxatida qaytish kunlarini topib belgilaydi",
  s10: "Bola kod oynasida har kunning kelgan va qaytgan sonini chiqaradigan funksiyani yozadi",
  s11: "Bola berilgan ikki sonni hisob-qatoriga to'g'ri joylashtiradi",
  s12: "Bola 2-kunning ikki sonini yoddan aytadi va bir qatorda yozib qoldiradi",
  s13: "Bola o'z natijasini (jonlida — guruh reytingini) ko'radi",
  s14: "Bola o'nta takrorlash kartasi bilan o'zini o'zi tekshiradi",
  s15: "Bola arenada bilimini tezlikda tekshiradi, uy-vazifasini va nishonlarini bitta yakun-sahifada ko'radi"
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
            <div key={id} className={`ach-pop-row ${got ? 'got' : ''}`}><span className="ach-pop-ic">{got ? a.icon : '🔒'}</span><span className="ach-pop-nm">{tr(a.name)}</span></div>
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
// -1 = ishtirok-sentinel (server: to'ldirgani = to'g'ri). Praktika zonasi: PRACTICE_BASE+screen.
const INLINE_KEYS = { s3: 1, s5: 0, s7: 2, s11: 1, kun: -1, practice: -1, belgi: -1, koding: -1 };
// Har scored ekran uchun qayta-tushuntirish. Kalitlar = scored ekran INDEKSI (3/5/7/11).
const RECAPS = {
  3: {
    title: { uz: 'Qaytgan — kecha ham kelgan odam', ru: 'Вернувшийся — тот, кто приходил и вчера' },
    cards: [
      { ic: '1', h: { uz: 'Qaytgan kim', ru: 'Кто такой вернувшийся' }, body: { uz: <>Kecha kelgan odam bugun ham kelsa — u bugun qaytgan odam.</>, ru: <>Если человек приходил вчера и пришёл сегодня — сегодня он вернувшийся.</> } },
      { ic: '2', h: { uz: 'Kelganlar soni nimani aytmaydi', ru: 'Чего не говорит число пришедших' }, body: { uz: <>Bugun kelganlar soni bugun botni ochgan hamma odamni sanaydi: ulardan kim kecha ham kelganini bu son aytmaydi.</>, ru: <>Число пришедших сегодня считает всех, кто сегодня открыл бота: кто из них приходил и вчера, это число не говорит.</> } },
      { ic: '3', h: { uz: "Ikki kunni yonma-yon qo'ying", ru: 'Поставьте два дня рядом' }, body: { uz: <>Kechagi ro'yxatni bugungisi bilan solishtiring: ikkalasida ham bor odamlar — qaytganlar.</>, ru: <>Сравните вчерашний список с сегодняшним: люди, которые есть в обоих, — вернувшиеся.</> }, ask: { uz: 'Seshanba kuni 5 odam keldi, ulardan 3 tasi dushanba ham kelgan edi. Kim qaytgan?', ru: "Во вторник пришли 5 человек, 3 из них приходили и в понедельник. Кто вернулся?" } }
    ]
  },
  5: {
    title: { uz: "Ikki son bir yo'nalishda yurmaydi", ru: 'Два числа не идут в одну сторону' },
    cards: [
      { ic: '1', h: { uz: 'Har kunda ikki son', ru: 'В каждом дне два числа' }, body: { uz: <><b>nechta odam keldi</b> va <b>ulardan nechtasi qaytdi</b>.</>, ru: <><b>сколько человек пришло</b> и <b>сколько из них вернулось</b>.</> } },
      { ic: '2', h: { uz: 'Misolda', ru: "В примере" }, body: { uz: <>e'lon kuni kelganlar 6 dan 23 ga oshdi, qaytganlar deyarli o'zgarmadi.</>, ru: <>в день объявления число пришедших выросло с 6 до 23, а число вернувшихся почти не изменилось.</> } },
      { ic: '3', h: { uz: "Ikkovini birga o'qing", ru: 'Читайте оба вместе' }, body: { uz: <>Yuqori qatorga qarab xulosa chiqarmang: pastki qator boshqa narsani aytadi.</>, ru: <>Не делайте вывод по верхней строке: нижняя строка говорит другое.</> }, ask: { uz: "E'lon kuni 23 odam keldi, ertasiga ulardan 5 tasi qaytdi. Bu nimani ko'rsatadi?", ru: "В день объявления пришли 23 человека, на следующий день 5 из них вернулись. Что это показывает?" } }
    ]
  },
  7: {
    title: { uz: 'Raqam kunlarni sanaydi', ru: 'Число считает дни' },
    cards: [
      { ic: '1', h: { uz: "Duolingo'dagi olov belgili raqam", ru: "Число с иконкой огня в Duolingo" }, body: { uz: <><b>ketma-ket dars qilingan kunlarni</b> sanaydi, darslarni ham, so'zlarni ham emas.</>, ru: <>считает <b>дни занятий подряд</b> — не уроки и не слова.</> } },
      { ic: '2', h: { uz: 'Bir kun tashlansa', ru: 'Если пропустить день' }, body: { uz: <>raqam noldan boshlanadi (o'sha kunga muzlatish qo'yilmagan bo'lsa).</>, ru: <>число начинается с нуля (если на этот день не стоит заморозка).</> } },
      { ic: '3', h: { uz: 'Nega aynan kun', ru: 'Почему именно день' }, body: { uz: <>Bu raqam soatlarni ham, haftalarni ham sanamaydi — faqat kunlarni.</>, ru: <>Это число не считает ни часы, ни недели — только дни.</> }, ask: { uz: "Duolingo'dagi olov belgili raqam o'sishi uchun odam nima qilishi kerak?", ru: "Что нужно делать человеку, чтобы число с иконкой огня в Duolingo росло?" } }
    ]
  },
  11: {
    title: { uz: "Qaytish ikki kundan ko'rinadi", ru: 'Возвращение видно по двум дням' },
    cards: [
      { ic: '1', h: { uz: 'Qaytish kuni qanday kun', ru: "Какой день — день возвращения" }, body: { uz: <><b>Chap yonidagi kun ham to'lgan</b> kun: odam kecha ham kelgan edi.</>, ru: <>День, у которого <b>день слева тоже заполнен</b>: человек приходил и вчера.</> } },
      { ic: '2', h: { uz: "Qancha bo'lishi mumkin", ru: 'Сколько может быть' }, body: { uz: <>Qaytganlar soni o'sha kuni kelganlardan oshmaydi — ular shu kelganlar ichidan sanaladi.</>, ru: <>Число вернувшихся не превышает пришедших в тот день — их считают среди этих же пришедших.</> } },
      { ic: '3', h: { uz: 'Hisob-qatori', ru: 'Строка учёта' }, body: { uz: <>Har kun uchun bitta qator yoziladi: kun, kelganlar soni, qaytganlar soni.</>, ru: <>На каждый день пишется одна строка: день, число пришедших, число вернувшихся.</> }, ask: { uz: 'Chorshanba kuni 15 odam keldi, ulardan 4 tasi seshanba ham kelgan edi. Hisobga nimani yozasiz?', ru: "В среду пришли 15 человек, 4 из них приходили и во вторник. Что вы запишете в учёт?" } }
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
      <div className="screen" style={{ justifyContent: isMentorLive ? 'flex-start' : 'center', gap: 'clamp(16px,2.5vw,24px)' }}>
        <div className="fade-up">{question}</div>
        {oneShot && !solved && <p className="small mono fade-up" style={{ margin: '-8px 0 0', color: T.accent, fontWeight: 600 }}>{tr({ uz: "Jonli dars — bitta urinish, o'ylab bosing.", ru: "Живой урок — одна попытка, нажимайте обдуманно." })}</p>}
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
          {/* 13a (MD v2): xato qilgan o'quvchi mavzuni qisqa kartalarda qayta ko'radi — mustaqil rejimda ham.
              Jonli darsda javob sirini saqlash uchun faqat reveal'dan keyin chiqadi. */}
          {hasRecap && !isMentorLive && firstCorrectRef.current === false && (!oneShot || revealed) && (
            <button className="rc-open-mini" onClick={() => setRecapOpen(true)}>{tr({ uz: "Qisqa takrorlash — mavzuni yana bir ko'rish", ru: "Короткое повторение — взглянуть на тему ещё раз" })}</button>
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

// ===== 🛠️ JONLI PRAKTIKA zonasi (500+) =====
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
        <p className="small" style={{ color: T.ink3, margin: 0, fontStyle: 'italic' }}>{tr({ uz: "Ma'lumot kelmoqda…", ru: 'Данные загружаются…' })}</p>
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
// 🤖 DARS MA'LUMOTLARI — o'quvchining O'Z Telegram-boti (bitta misol-ip, 108-qonun).
// s4 kunlari · s9 haftasi · s10 kodi — bir olam, bir til: «keldi» va «qaytdi».
// ============================================================
// Ikki son yorlig'i dars bo'ylab AYNAN bir xil (korpus §80): s1 · s4 · s8 · flashcard · s15.
const YORLIQ_KELDI = { uz: 'Keldi', ru: 'Пришли' };
const YORLIQ_QAYTDI = { uz: 'Qaytdi', ru: "Вернулись" };
// s4 sahnasi: besh kun. Har son ustundagi belgilar bilan sanab ko'riladi (§36/§95).
// 1-kunning qaytgani 0 (MD v2: «—» emas) — 8, 10, 14-ekran va viktorina 3-savol bilan bir xil.
const KUNLAR = [
  { kun: 1, kelgan: 9,  qaytgan: 0, fakt: { uz: "9 odam keldi. Hisobda bundan oldingi kun yo'q — shuning uchun 1-kunning qaytgani 0.", ru: "Пришло 9 человек. В учёте нет дня раньше этого — поэтому у 1-го дня вернувшихся 0." } },
  { kun: 2, kelgan: 7,  qaytgan: 4, fakt: { uz: '7 odam keldi — ulardan 4 tasi qaytdi.', ru: "Пришло 7 человек — 4 из них вернулись." } },
  { kun: 3, kelgan: 6,  qaytgan: 4, fakt: { uz: '6 odam keldi — ulardan 4 tasi qaytdi.', ru: "Пришло 6 человек — 4 из них вернулись." } },
  { kun: 4, kelgan: 23, qaytgan: 4, fakt: { uz: '23 odam keldi — ulardan 4 tasi qaytdi.', ru: "Пришло 23 человека — 4 из них вернулись." } },
  { kun: 5, kelgan: 8,  qaytgan: 5, fakt: { uz: '8 odam keldi — ulardan 5 tasi qaytdi.', ru: "Пришло 8 человек — 5 из них вернулись." } },
];

// ===== SCREEN 0 — HOOK: botingizga kecha kelgan odam =====
const HOOK_OPTS = [
  { k: 'ayta', t: { uz: 'Ayta olaman — har kuni sanab boraman', ru: "Могу сказать — считаю каждый день" },
    javob: { uz: "Zo'r — bugun sonlaringizni jadvalga yozib, tekshirib ko'rasiz.", ru: "Отлично — сегодня вы запишете свои числа в таблицу и проверите их." } },
  { k: 'yoq',  t: { uz: 'Ayta olmayman — sonlarni yozib bormaganman', ru: "Не могу сказать — числа я не записываю" },
    javob: { uz: "Bitta kunni o'tgan darsda topgansiz — bugun kun sayin topishni o'rganasiz.", ru: "Для одного дня вы нашли это на прошлом уроке — сегодня научитесь находить по дням." } },
];
// IMZO-SAHNA (MD v2 s0): so'zsiz, ikki ustun — kecha 6 belgi, bugun 5 belgi. Bugungi 3 belgidan
// kechagi ustundagi o'sha odamga ingichka chiziq BIR MARTA chiziladi va belgi yashil bo'ladi
// (~1 s): «ikkala ro'yxatda ham bor» bog'lanishi. Cheksiz takror yo'q (bezak olindi).
const H0_STEP = 20;
const H0_JUFT = [[0, 1], [2, 2], [3, 5]]; // [bugungi belgi, kechagi belgi]
const H0Scene = () => {
  const yK = (k) => 10 + k * H0_STEP;
  const yB = (k) => 20 + k * H0_STEP;
  const hitIdx = (b) => H0_JUFT.findIndex(([bb]) => bb === b);
  return (
    <div className="h0scene" aria-hidden="true">
      <svg className="h0svg" width="150" height="132" viewBox="0 0 150 132">
        {H0_JUFT.map(([b, k], n) => (
          <line key={`l${n}`} className="h0ln" x1="121" y1={yB(b) + 7} x2="29" y2={yK(k) + 7} style={{ '--hd': `${0.1 + n * 0.2}s` }} />
        ))}
        {[0, 1, 2, 3, 4, 5].map(k => <rect key={`k${k}`} className="h0d" x="13" y={yK(k)} width="14" height="14" rx="4" />)}
        {[0, 1, 2, 3, 4].map(b => {
          const n = hitIdx(b);
          return <rect key={`b${b}`} className={`h0d${n >= 0 ? ' hit' : ''}`} x="123" y={yB(b)} width="14" height="14" rx="4" style={n >= 0 ? { '--hd': `${0.1 + n * 0.2}s` } : undefined} />;
        })}
      </svg>
      <div className="h0lbl"><span>{tr({ uz: 'kecha', ru: "вчера" })}</span><span>{tr({ uz: 'bugun', ru: "сегодня" })}</span></div>
    </div>
  );
};
// 100-qonun: tanlov yoziladi, hech qayerda O'QILMAYDI.
const HOOK_KEY = 'pm-m5d11-hook-choice';
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
    <Stage eyebrow={tr({ uz: 'Kirish · botingiz', ru: 'Вступление · ваш бот' })} screen={screen} navContent={<NavNext optionalLive turnBusy={picked === null && !isMentor} disabled={picked === null && !isMentor} label={opened ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: 'Bittasini tanlang', ru: 'Выберите один' })} onClick={onNext} />}>
      <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kecha kelgan odam bugun ham <span className="italic" style={{ color: T.accent }}>keldimi?</span></>, ru: <>Тот, кто пришёл вчера, <span className="italic" style={{ color: T.accent }}>пришёл ли сегодня?</span></> })}</h2></div>
        <Mentor>{tr({ uz: "Botingizga bir necha kundan beri odamlar yozyapti. Shu savolga har kun uchun javob bera olasizmi?", ru: "К вашему боту уже несколько дней пишут люди. Сможете ответить на этот вопрос для каждого дня?" })}</Mentor>
        <div className="hrow two fade-up delay-1">
          {HOOK_OPTS.map((o, i) => (
            <button key={o.k} className={`hopt${picked === i ? ' on' : ''}${opened ? ' open' : ''}${!opened && optWave ? waveCls(true, i, HOOK_OPTS.length) : ''}`} disabled={opened} onClick={() => pick(i)}>
              <span className="hopt-nom">{tr(o.t)}</span>
            </button>
          ))}
        </div>
        {/* MD v2 s0: har tanlovga o'z qisqa javobi + bitta umumiy qator; ostida sahna (104-qonun) */}
        {opened && (
          <div className="frame-soft h0end fade-step">
            {picked !== null && <p className="body" style={{ margin: 0, color: T.ink }}>{tr(HOOK_OPTS[picked].javob)}</p>}
            <p className="body" style={{ margin: 0, color: T.ink }}>{tr({ uz: "Buning uchun har kunning ikki sonini yozib boramiz: nechta odam keldi va ulardan nechtasi qaytdi.", ru: "Для этого будем записывать два числа каждого дня: сколько человек пришло и сколько из них вернулось." })}</p>
            <H0Scene />
          </div>
        )}
        {/* Korpus §97: ovoz-diagrammasi FAQAT jonli darsda — yakka o'quvchida «ko'pchilik» yo'q */}
        {opened && isLive && counts && (
          <div className="hvote fade-step" aria-label={tr({ uz: 'Jonli natija', ru: 'Живой результат' })}>
            {HOOK_OPTS.map((o, i) => {
              const n = counts[i];
              const pct = totalVotes ? Math.round((n / totalVotes) * 100) : 0;
              const top = totalVotes > 0 && n === Math.max(...counts);
              return (
                <div key={o.k} className={`hvote-row ${picked === i ? 'mine' : ''} ${top ? 'top' : ''}`}>
                  <span className="hvote-lbl">{tr(o.t)}</span>
                  <span className="hvote-track"><span className="hvote-fill" style={{ width: `${Math.max(pct, totalVotes ? 4 : 0)}%` }} /></span>
                  {/* 8-A taqiq-jadvali: «%» o'quvchi matnida 0 — bu yerda tirik sanoq turadi */}
                  <span className="hvote-pct mono">{n}</span>
                </div>
              );
            })}
          </div>
        )}
        <MentorNote>{tr({ uz: "Ovozlar bo'linadi — ikkalasi ham halol javob. Javob chiqqach «ulardan nechtasi qaytdi» degan joyda to'xtang: aynan shu son kun sayin — bugungi darsning mavzusi.", ru: "Голоса разделятся — оба ответа честные. Когда откроется ответ, остановитесь на словах «сколько из них вернулось»: именно это число по дням — тема сегодняшнего урока." })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 1 — MAQSAD: uch kunlik hisob jadvali (MD v2: hammasi birdan, animatsiyasiz) =====
// §125: kataklarda son emas, «?» — s4 kashfiyoti ham, s8 mashqi ham oshkor bo'lmaydi.
const DEMO_KUN = [{ uz: '1-kun', ru: '1-й день' }, { uz: '2-kun', ru: '2-й день' }, { uz: '3-kun', ru: '3-й день' }];
const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Maqsad', ru: 'Цель' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz →', ru: 'Начнём →' })} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.2vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun botingiz uchun <span className="italic" style={{ color: T.accent }}>uch kunlik hisob</span> yozasiz.</>, ru: <>Сегодня вы запишете <span className="italic" style={{ color: T.accent }}>учёт за три дня</span> для своего бота.</> })}</h2></div>
      <Mentor>{tr({ uz: "Avval besh kunlik namunani ko'rasiz, keyin jadvaldagi «?» o'rniga o'z botingizning uch kunini yozasiz.", ru: "Сначала посмотрите пример за пять дней, потом вместо «?» в таблице впишете три дня своего бота." })}</Mentor>
      <div className="s1demo">
        <div className="s1tab">
          <span className="s1th">{tr({ uz: 'Kun', ru: 'День' })}</span>
          <span className="s1th">{tr({ uz: 'Keldi', ru: 'Пришли' })}</span>
          <span className="s1th">{tr({ uz: 'Qaytdi', ru: "Вернулись" })}</span>
          {DEMO_KUN.map((k, i) => (
            <React.Fragment key={tr(k)}>
              <span className="s1cell nom">{tr(k)}</span>
              <span className="s1cell q">?</span>
              <span className="s1cell q">?</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <MentorNote>{tr({ uz: "Jadvalni birga o'qing: «?» o'rniga har kim o'z botining sonlarini 8-ekranda yozadi. Sonlarni hozir aytmang.", ru: "Прочитайте таблицу вместе: вместо «?» каждый впишет числа своего бота на 8-м экране. Числа сейчас не называйте." })}</MentorNote>
    </div>
  </Stage>
);

// ===== SCREEN 2 — TEORIYA-1: «Keldi» ↔ «Qaytdi» (46-qonun toggle · akkordeon) =====
const S2_CARDS = [
  { h: { uz: 'Bugun kelganlar', ru: 'Пришедшие сегодня' }, b: { uz: "Bugun botga yozgan yoki tugma bosgan odamlar, har biri bir marta. Ulardan kim kecha ham kelganini bu son aytmaydi.", ru: "Люди, которые сегодня написали боту или нажали кнопку, — каждый один раз. Кто из них приходил и вчера, это число не говорит." } },
  { h: { uz: 'Qaytganlar', ru: "Вернувшиеся" }, b: { uz: "Kecha kelgan odam bugun ham kelsa — u bugun qaytgan odam. Qaytganlar bugun kelganlar ichidan sanaladi, shuning uchun bu son ulardan oshmaydi.", ru: "Если человек приходил вчера и пришёл сегодня — сегодня он вернувшийся. Вернувшихся считают среди пришедших сегодня, поэтому это число не больше их." } },
];
const Screen2 = ({ screen, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const isMentor = !!(gate.live && gate.live.mode === 'mentor');
  const [opened, setOpened] = useState([false, false]);
  const [seen, setSeen] = useState([false, false]);
  const allSeen = seen.every(Boolean);
  // 46-qonun: karta QULFLANMAYDI — qayta bosilsa yopiladi.
  // Akkordeon: bittasi ochilganda ikkinchisi yopiladi (ekran matni o'lchov ichida qoladi).
  const toggle = (i) => {
    setOpened(prev => prev.map((v, k) => (k === i ? !v : false)));
    setSeen(prev => (prev[i] ? prev : prev.map((v, k) => (k === i ? true : v))));
  };
  const pend = S2_CARDS.map((_, i) => String(i)).filter(k => !seen[Number(k)]);
  const lit = useTurnWalk(pend);
  const qoldi = seen.filter(v => !v).length;
  return (
    <Stage eyebrow={tr({ uz: 'Tushuncha · ikki son', ru: "Понятие · два числа" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!allSeen && !isMentor} disabled={!allSeen && !isMentor} label={allSeen || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Yana ${qoldi} kartani oching`, ru: `Откройте ещё карточек: ${qoldi}` })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun kelganlarning nechtasi <span className="italic" style={{ color: T.accent }}>kecha ham</span> kelgan edi?</>, ru: <>Сколько из пришедших сегодня приходили <span className="italic" style={{ color: T.accent }}>и вчера</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: 'Ikki kartani ochib solishtiring: ular ikki xil sonni aytadi.', ru: "Откройте две карточки и сравните: они называют два разных числа." })}</Mentor>
        <div className="dfc-grid fade-up delay-1">
          {S2_CARDS.map((c, i) => (
            <button key={c.h.uz} type="button" className={`dfc${opened[i] ? ' open' : ''}${turnCls(lit, String(i), pend.length > 1)}`} onClick={() => toggle(i)}>
              <span className="dfc-top"><span className="dfc-h">{tr(c.h)}</span><span className={`dfc-mk${seen[i] ? ' ok' : ''}`} aria-hidden="true">{seen[i] ? '✓' : '›'}</span></span>
              <span className="dfc-b">{opened[i] ? tr(c.b) : '· · ·'}</span>
            </button>
          ))}
        </div>
        {allSeen && (
          <div className="xul fade-step">
            <span className="xul-h">{tr({ uz: 'Har kunda ikki son bor: nechta odam keldi va ulardan nechtasi qaytdi.', ru: "В каждом дне два числа: сколько человек пришло и сколько из них вернулось." })}</span>
            <p className="xul-b">{tr({ uz: "O'tgan darsda bitta kun uchun qaytganlarni topgansiz. Bugun bir necha kunni yonma-yon qo'yib, bu ikki son kun sayin qanday o'zgarishini ko'rasiz.", ru: "На прошлом уроке вы нашли вернувшихся для одного дня. Сегодня поставите несколько дней рядом и увидите, как эти два числа меняются по дням." })}</p>
          </div>
        )}
      </div>
    </Stage>
  );
};

// ===== TEST-EKRAN sarlavhasi (105-qonun: .h-ask) =====
const TestQ = ({ ask }) => <h2 className="title h-ask">{ask}</h2>;

const Screen3 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · kim qaytgan', ru: 'Проверка · кто вернулся' })} scope="module-mikro"
    ctaLabel={tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' })} revealPrefix={tr({ uz: "To'g'ri javob", ru: 'Верный ответ' })}
    question={<TestQ ask={tr({ uz: 'Seshanba kuni 5 odam keldi, ulardan 3 tasi dushanba ham kelgan edi. Kim qaytgan?', ru: "Во вторник пришли 5 человек, 3 из них приходили и в понедельник. Кто вернулся?" })} />}
    questionText={'Seshanba kuni 5 odam keldi, ulardan 3 tasi dushanba ham kelgan edi. Kim qaytgan?'}
    options={[tr({ uz: 'Seshanbada kelgan besh odamning barchasi', ru: 'Все пять человек, пришедшие во вторник' }), tr({ uz: 'Dushanba ham, seshanba ham kelgan uch odam', ru: 'Три человека, пришедшие и в понедельник, и во вторник' }), tr({ uz: 'Dushanba kelmay, seshanba kelgan ikki odam', ru: 'Два человека, пришедшие во вторник, но не в понедельник' })]}
    correctIdx={1}
    explainCorrect={tr({ uz: "Qaytgan — kecha ham kelgan odam: uch odam ikkala kunda ham bor.", ru: "Вернувшийся — тот, кто приходил и вчера: три человека есть в обоих днях." })}
    explainWrong={{
      0: tr({ uz: "Besh odam seshanba kelgan, lekin ularning hammasi dushanba ham kelgan emas.", ru: "Во вторник пришли пять человек, но не все они приходили и в понедельник." }),
      2: tr({ uz: "Bu ikki odam dushanba kelmagan — shuning uchun seshanba ular qaytgan emas.", ru: "Эти двое не приходили в понедельник — поэтому во вторник они не вернувшиеся." }),
      default: tr({ uz: "Qaytgan — kecha ham, bugun ham kelgan odam.", ru: 'Вернувшийся — тот, кто пришёл и вчера, и сегодня.' })
    }}
  />
);

// ===== SCREEN 4 — YADRO: BOTINGIZNING KUNLARI (markaziy mexanika) =====
// 🔴 Kashfiyot-himoyasi: 42 soniya harakatsizlikdan keyin bitta ipucha — javobni AYTMAYDI.
const KUN_KEY = 'pm-m5d11-kun';
const TIP_SEC = 42;
const ELON_KUN = 3;   // uch kun ochilgach e'lon tugmasi ochiladi (94-qonun)
const kamHarakat = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
const Screen4 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [n, setN] = useState(() => storedAnswer?.kun || 0);
  const [elon, setElon] = useState(() => !!(storedAnswer && storedAnswer.elon));
  const [sec, setSec] = useState(0);
  const tRef = useRef(null);
  const done = n >= KUNLAR.length;
  useEffect(() => () => clearTimeout(tRef.current), []);
  useEffect(() => {
    if (done || isMentor) return;
    const t = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [done, isMentor]);
  useEffect(() => {
    try { localStorage.setItem(KUN_KEY, JSON.stringify({ kun: n, elon, savedAt: Date.now() })); } catch {}
  }, [n, elon]);
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      onAnswer(screen, { stage: 'kun', screenIdx: screen, kun: KUNLAR.length, elon: true, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'kun', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  const bosish = () => {
    if (isMentor || done) return;
    if (n < ELON_KUN) { setN(v => v + 1); return; }
    if (!elon) {
      setElon(true);
      setN(ELON_KUN + 1);
      if (!kamHarakat()) tRef.current = setTimeout(() => setN(KUNLAR.length), 2600);
      return;
    }
    setN(v => Math.min(KUNLAR.length, v + 1));
  };
  const kutmoqda = elon && n < KUNLAR.length && !kamHarakat();
  const btnTurn = useTurnHint(n === 0 && !isMentor);
  const tipOn = !done && !isMentor && n === ELON_KUN && !elon && sec >= TIP_SEC;
  // 77-qonun: oxirgi kun ochilgach yakun-karta ko'rinishga olib kelinadi (ekran ostida qolmasin)
  const xulRef = useRef(null);
  useEffect(() => {
    if (!done || !xulRef.current) return;
    const kam = kamHarakat();
    const t = setTimeout(() => { if (xulRef.current) xulRef.current.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'nearest' }); }, 320);
    return () => clearTimeout(t);
  }, [done]);
  const navLabel = done || isMentor
    ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : n < ELON_KUN ? tr({ uz: `Yana ${ELON_KUN - n} kunni oching`, ru: `Откройте ещё дней: ${ELON_KUN - n}` })
      : !elon ? tr({ uz: "E'lon tugmasini bosing", ru: "Нажмите кнопку объявления" })
        : tr({ uz: `Yana ${KUNLAR.length - n} kunni oching`, ru: `Откройте ещё дней: ${KUNLAR.length - n}` });
  // 400-belgi qoidasi: boshqaruv-kartasi faqat ochish bosqichida turadi.
  const btnLabel = n < ELON_KUN || elon ? tr({ uz: '▶ Keyingi kun', ru: '▶ Следующий день' }) : tr({ uz: "Kanalga e'lon berish", ru: "Дать объявление в канал" });
  // Harakat kamaytirilganda ustunlar o'zi ochilmaydi — izoh shu holatga mos keladi.
  const btnSub = n < ELON_KUN || (elon && kamHarakat())
    ? null
    : !elon ? tr({ uz: "E'lon 4-kuni kanalga chiqadi.", ru: "Объявление выйдет в канал на 4-й день." })
      : tr({ uz: 'Kunlar ketma-ket ochilmoqda.', ru: "Дни открываются один за другим." });
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot · besh kun', ru: 'Практика · пять дней' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(9px,1.4vw,14px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Kunlarni oching va ikki qatorni birga <span className="italic" style={{ color: T.accent }}>kuzating</span>.</>, ru: <>Откройте дни и <span className="italic" style={{ color: T.accent }}>следите</span> за двумя строками вместе.</> })}</h2></div>
        {n === 0 && <Mentor>{tr({ uz: "Har ustun — botingizning bitta kuni, ostida esa o'sha kunning ikki soni.", ru: 'Каждый столбец — один день вашего бота, а под ним — два числа этого дня.' })}</Mentor>}
        <div className="kln">
          <div className="kln-h">
            <span className="kln-t">{tr({ uz: 'Botingizning kunlari', ru: "Дни вашего бота" })}</span>
            {/* §134: rang-kaliti sahnaning TEPASIDA — belgilarga qarashdan OLDIN o'qiladi.
                Chip-ustiga kelinsa o'sha rangdagi belgilar ajralib chiqadi (CSS :has, holatsiz). */}
            <div className="kln-leg">
              <span className="kln-chip qay"><span className="kln-sw qay" aria-hidden="true" />{tr({ uz: 'qaytgan', ru: "вернувшийся" })}</span>
              <span className="kln-chip yangi"><span className="kln-sw" aria-hidden="true" />{tr({ uz: 'qaytmagan', ru: "не вернувшийся" })}</span>
            </div>
            <span className="kln-n mono">{n} / {KUNLAR.length}</span>
          </div>
          <div className="kln-grid">
            <span className="kln-rl empty" />
            {KUNLAR.map((d, i) => <span key={`d${d.kun}`} className={`kln-day${i < n ? ' on' : ''}`}>{tr({ uz: <>{d.kun}-kun</>, ru: <>{d.kun}-й день</> })}</span>)}
            <span className="kln-rl empty" />
            {KUNLAR.map((d, i) => (
              <span key={`m${d.kun}`} className={`kln-marks${i < n ? ' on' : ''}`}>
                {/* MD v2 s4: kun ochilganda yashil belgilardan chapdagi ustunga chiziq BIR MARTA chiziladi (1-kunda yo'q) */}
                {i < n && i > 0 && d.qaytgan > 0 && <span className="kln-ln" aria-hidden="true" />}
                {i < n
                  ? Array.from({ length: d.kelgan }).map((_, k) => (
                    <i key={k} className={`kln-mark${k < (d.qaytgan || 0) ? ' qay' : ''}`} style={{ '--md': `${0.02 * k}s` }} />
                  ))
                  : <i className="kln-wait">·</i>}
              </span>
            ))}
            <span className="kln-rl">{tr(YORLIQ_KELDI)}</span>
            {KUNLAR.map((d, i) => <span key={`k${d.kun}`} className={`kln-cell${i < n ? ' on' : ''}`}>{i < n ? d.kelgan : '·'}</span>)}
            <span className="kln-rl">{tr(YORLIQ_QAYTDI)}</span>
            {KUNLAR.map((d, i) => <span key={`q${d.kun}`} className={`kln-cell qay${i < n ? ' on' : ''}`}>{i < n ? d.qaytgan : '·'}</span>)}
          </div>
        </div>
        {!done && (
          <div className="split s4">
            <Col gap={9}>
              <div className="ctl">
                <button type="button" className={`ctl-btn${n === 0 && btnTurn && !isMentor ? '' : ' calm'}`} onClick={bosish} disabled={isMentor || kutmoqda}>{btnLabel}</button>
                {btnSub && <span className="ctl-sub">{btnSub}</span>}
                {tipOn && <p className="bhint fade-step">{tr({ uz: "Kanalga e'lon berish tugmasini bosing.", ru: "Нажмите кнопку «Дать объявление в канал»." })}</p>}
              </div>
            </Col>
            <Col gap={9}>
              {/* 400-belgi qoidasi: panelda faqat OXIRGI ochilgan kun turadi — oldingi
                  kunlarning ikki soni jadvalda ko'rinib turibdi, matn takrorlanmaydi.
                  Besh kun ochilgach panel o'z o'rnini xulosa-kartasiga bo'shatadi. */}
              {/* F-0926-05 #15: birinchi kun ochilguncha panel yo'q — ustun bo'sh turadi (bridge qoidasi) */}
              {n > 0 && <div className="fakt">
                <span key={`f${n}`} className="fakt-row fade-step"><b>{tr({ uz: <>{KUNLAR[n - 1].kun}-kun</>, ru: <>{KUNLAR[n - 1].kun}-й день</> })}</b><i>{tr(KUNLAR[n - 1].fakt)}</i></span>
              </div>}
            </Col>
          </div>
        )}
        {done && (
          <div className="xul fade-step" ref={xulRef}>
            <span className="xul-h">{tr({ uz: "Bu misolda e'lon kuni kelganlar 6 dan 23 ga oshdi, qaytganlar esa 4, 4, 4, 5 bo'lib qoldi.", ru: "В этом примере в день объявления число пришедших выросло с 6 до 23, а вернувшихся так и осталось 4, 4, 4, 5." })}</span>
            <p className="xul-b">{tr({ uz: "Ko'p odam kelgani — ko'p odam qaytgani degani emas: ikki qatorni birga o'qing.", ru: "Много пришедших — ещё не значит много вернувшихся: читайте две строки вместе." })}</p>
          </div>
        )}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={{ uz: 'Kunlarni ochganlar', ru: "Открыли дни" }} />
        <MentorNote>{tr({ uz: "Bolalar e'lon tugmasini bosib «23 ta!» deb quvonadi. Shu payt pastki qatorni ko'rsating va so'rang: ertasiga nechtasi qaytdi? Xulosani siz aytmang — ikki qatorni birga o'qing, bolalar o'zi aytsin. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'Дети нажмут кнопку объявления и обрадуются: «23!». В этот момент покажите нижнюю строку и спросите: сколько вернулось на следующий день? Вывод не говорите сами — прочитайте две строки вместе, пусть дети скажут. Эту работу делают ученики, вы наблюдаете; «Продолжить» для вас открыто.' })}</MentorNote>
      </div>
    </Stage>
  );
};

const Screen5 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Tekshiruv · ikki son', ru: "Проверка · два числа" })} scope="module-mikro"
    ctaLabel={tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' })} revealPrefix={tr({ uz: "To'g'ri javob", ru: 'Верный ответ' })}
    question={<TestQ ask={tr({ uz: "E'lon kuni 23 odam keldi, ertasiga ulardan 5 tasi qaytdi. Bu nimani ko'rsatadi?", ru: "В день объявления пришли 23 человека, на следующий день 5 из них вернулись. Что это показывает?" })} />}
    questionText={"E'lon kuni 23 odam keldi, ertasiga ulardan 5 tasi qaytdi. Bu nimani ko'rsatadi?"}
    options={[tr({ uz: "Ko'p odam kelgani ko'p qaytishini bildirmaydi", ru: "Много пришедших не значит много вернувшихся" }), tr({ uz: "E'lon qaytganlar sonini ham shuncha ko'taradi", ru: "Объявление так же поднимает и вернувшихся" }), tr({ uz: 'Kelganlar soni ertasiga ham 23 ta bo\'ladi', ru: "На следующий день тоже придут 23 человека" })]}
    correctIdx={0}
    explainCorrect={tr({ uz: "23 odam keldi, lekin ertasiga faqat 5 tasi qaytdi — ikki son birga o'qiladi.", ru: "Пришли 23 человека, но на следующий день вернулись только 5 — два числа читают вместе." })}
    explainWrong={{
      1: tr({ uz: "Kelganlar 17 taga oshdi, qaytganlar esa bittaga.", ru: "Пришедших стало больше на 17, а вернувшихся — на одного." }),
      2: tr({ uz: "Jadvalga qarang: 5-kuni 8 odam keldi — e'lon har kuni takrorlanmaydi.", ru: "Посмотрите на таблицу: на 5-й день пришли 8 человек — объявление не повторяется каждый день." }),
      default: tr({ uz: "Ko'p odam kelgani — ko'p odam qaytgani degani emas.", ru: "Много пришедших — ещё не значит много вернувшихся." })
    }}
  />
);

// ===== SCREEN 6 — K5 DUOLINGO (MD v2): 2 slayd + 2 bashorat + ko'prik = 5 bosqich (33/56/91b-qonun) =====
// 🔴 33-qonun: kamida IKKI kalit-slayd oldidan bashorat. Ikkalasi IKKI O'LCHOVDA:
// (1) NIMA SANALADI — hisobning o'lchov birligi · (2) ILOVA NIMA QILADI — nima yuboradi.
// 🔴 §101/§123: bankda raqam yo'q — jonli son-hisoblagichi ham YO'Q (o'ylab topilgan son sanalmaydi).
// F-1002-70 (02.10): avvalgi «StreakMock» (2 qator, SVG olov) o'rniga butun keys bo'ylab bitta sahna — KEYS_SCENE.
// Sahnadagi raqamlar (7 va 0) — maket-misol, bank fakti emas: «yetti kun ketma-ket → 7», «bir kun tashlansa → 0».

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
// Duolingo sahnasi — 5 kadr (har bosqichga bittadan), emoji turlari: 📱 🔔 🔥
const KEYS_SCENE = {alt: {uz: "Telefon, olov belgisi va raqam; yetti kun ketma-ket — raqam yetti; bir kun tashlansa — nol; ilova eslatma yuboradi", ru: "Телефон, иконка огня и число; семь дней подряд — число семь; пропустил день — ноль; приложение присылает напоминание"}, items: [{id: "ph", e: "📱", x: 8, y: 50}, {id: "f0", e: "🔥", x: 20, y: 50}, {id: "n0", t: "7", x: 27, y: 50}, {id: "fa", e: "🔥", x: 20, y: 30}, {id: "na", t: "7", x: 26, y: 30}, {id: "a1", d: 1, x: 35, y: 30}, {id: "a2", d: 1, x: 41, y: 30}, {id: "a3", d: 1, x: 47, y: 30}, {id: "a4", d: 1, x: 53, y: 30}, {id: "a5", d: 1, x: 59, y: 30}, {id: "a6", d: 1, x: 65, y: 30}, {id: "a7", d: 1, x: 71, y: 30}, {id: "fb", e: "🔥", x: 20, y: 72}, {id: "nb", t: "0", x: 26, y: 72}, {id: "b1", d: 1, x: 35, y: 72}, {id: "b2", d: 1, x: 41, y: 72}, {id: "b3", d: 1, x: 47, y: 72}, {id: "b4", d: 1, x: 53, y: 72}, {id: "bell", e: "🔔", x: 88, y: 50}], frames: [{on: ["ph", "f0", "n0"]}, {pre: {on: ["ph", "f0", "n0"]}, post: {on: ["ph", "fa", "na", "a1", "a2", "a3", "a4", "a5", "a6", "a7"], cap: {uz: "7 kun ketma-ket", ru: "7 дней подряд"}}}, {on: ["ph", "fa", "na", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "fb:dim", "nb", "b1", "b2", "b3", "b4:dim"], cap: {uz: "Bir kun tashlansa — 0", ru: "Пропустил день — 0"}}, {pre: {on: ["ph", "fa", "na", "a1", "a2", "a3", "a4", "a5", "a6", "a7"], cap: {uz: "7 kun ketma-ket", ru: "7 дней подряд"}}, post: {on: ["ph", "fa", "na", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "bell"], cap: {uz: "Kunlik eslatma", ru: "Ежедневное напоминание"}}}, {on: ["ph", "fa", "na", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "bell"], cap: {uz: "Kecha bor edi — bugun ham?", ru: "Вчера был — а сегодня?"}}]};
const K5_SLIDES = [
  { h: { uz: "Duolingo — til o'rgatadigan ilova.", ru: "Duolingo — приложение для изучения языков." },
    body: { uz: <>Ekran tepasida olov belgisi va uning yonida raqam turadi. Bu raqam darslaringiz sonini emas, boshqa narsani sanaydi.</>, ru: <>Вверху экрана — иконка огня, а рядом с ней число. Оно считает не ваши уроки, а кое-что другое.</> } },
  { h: null, body: null,
    predict: { ask: { uz: 'Olov belgili raqam nimani sanaydi?', ru: "Что считает число с иконкой огня?" }, chips: [
      { t: { uz: "Jami yodlagan so'zlaringiz sonini", ru: 'Сколько всего слов вы выучили' } },
      { t: { uz: 'Ketma-ket dars qilgan kunlaringizni', ru: 'Ваши дни занятий подряд' } },
      { t: { uz: "Ilovada o'tkazgan umumiy vaqtingizni", ru: 'Общее время, проведённое в приложении' } },
    ], ans: 1,
      hit: { uz: 'Aynan! U ketma-ket dars qilgan kunlaringizni sanaydi.', ru: "Именно! Оно считает ваши дни занятий подряд." },
      miss: { uz: 'Qiziq fikr! Aslida u ketma-ket dars qilgan kunlaringizni sanaydi.', ru: "Интересная мысль! На самом деле оно считает ваши дни занятий подряд." } } },
  { h: { uz: 'Raqam kunlarni sanaydi', ru: 'Число считает дни' },
    body: { uz: <>Kecha ham, bugun ham dars qilgan bo'lsangiz, raqam bittaga o'sadi. Bir kunni tashlab ketsangiz, u noldan boshlanadi — o'sha kunga «muzlatish» qo'yilmagan bo'lsa. Ilovada bu raqam «streak» deb ataladi.</>, ru: <>Занимались и вчера, и сегодня — число вырастет на один. Пропустите один день — оно начнётся с нуля, если на этот день не стоит «заморозка». В приложении это число называется «ударный режим» (streak).</> } },
  { h: null, body: null,
    predict: { ask: { uz: 'Raqam uzilib qolmasligi uchun ilova nima qiladi?', ru: "Что делает приложение, чтобы это число не оборвалось?" }, chips: [
      { t: { uz: "Yangi darslar ro'yxatini ochadi", ru: 'Открывает список новых уроков' } },
      { t: { uz: 'Kunlik eslatma xabarini yuboradi', ru: 'Присылает ежедневное напоминание' } },
      { t: { uz: "Reklamani butunlay o'chirib qo'yadi", ru: "Совсем отключает рекламу" } },
    ], ans: 1,
      hit: { uz: 'Aynan! Ilova eslatma xabarini yuboradi.', ru: "Именно! Приложение присылает напоминание." },
      miss: { uz: 'Qiziq fikr! Aslida ilova eslatma xabarini yuboradi.', ru: "Интересная мысль! На самом деле приложение присылает напоминание." } } },
  { h: null, body: null, bridge: true },
];
const Screen6 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gateK = useContext(LiveGateCtx) || {};
  const isMentorK = !!(gateK.live && gateK.live.mode === 'mentor');
  const [i, setI] = useState(0);
  const [bets, setBets] = useState({});
  // Nuqta faqat ALLAQACHON ko'rilgan bosqichga yo'l beradi; oldinga yurish faqat NavNext orqali,
  // u esa bashorat berilmaguncha qulflangan.
  const [maxSeen, setMaxSeen] = useState(0);
  useEffect(() => { setMaxSeen(m => Math.max(m, i)); }, [i]);
  const last = i === K5_SLIDES.length - 1;
  useEffect(() => { if (last && storedAnswer === undefined) onAnswer(screen, { correct: true }); }, [last]); // eslint-disable-line
  const c = K5_SLIDES[i];
  const bet = c.predict ? bets[i] : undefined;
  const betPending = !!(c.predict && bet === undefined);
  const betHint = useTurnHint(betPending && !isMentorK);
  // 44-qonun oilasi: mentor rejimida ham javob OLDINDAN ochilmaydi — u ham bosib ochadi.
  const showSlide = c.h && (!c.predict || bet !== undefined);
  return (
    <Stage eyebrow={tr({ uz: 'Haqiqiy misol · Duolingo', ru: "Реальный пример · Duolingo" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={betPending && !isMentorK} disabled={betPending && !isMentorK} label={betPending && !isMentorK ? tr({ uz: "Avval o'zingiz tanlang", ru: "Сначала выберите сами" }) : last ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Keyingi bosqich (${i + 1}/${K5_SLIDES.length})`, ru: `Следующий шаг (${i + 1}/${K5_SLIDES.length})` })} onClick={last ? onNext : () => setI(i + 1)} /></>}>
      <div className="screen k-fill" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Duolingo'dagi <span className="italic" style={{ color: T.accent }}>bitta raqam</span></>, ru: <><span className="italic" style={{ color: T.accent }}>Одно число</span> в Duolingo</> })}</h2></div>
        <KeysScene scene={KEYS_SCENE} step={i} answered={bet !== undefined} />
        {c.predict && (
          <div className={`kp-bet fade-step${bet !== undefined ? ' answered' : ''}`} key={`b${i}`}>
            {/* 🔴 ETALON 22 (sanoq-mosligi): bashoratli bosqichda ham hisoblagich uzluksiz
                turadi (1·2·…·7) va har bosqichda AYNAN BITTA joyda ko'rinadi. */}
            <span className="k-slide-eyebrow">{bet === undefined ? tr({ uz: "Avval o'zingiz tanlang", ru: "Сначала выберите сами" }) : 'Duolingo'} · {i + 1} / {K5_SLIDES.length}</span>
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
            {!c.predict && <span className="k-slide-eyebrow">Duolingo · {i + 1} / {K5_SLIDES.length}</span>}
            <h3 className="k-slide-h">{tr(c.h)}</h3>
            {c.vis}
            <p className="k-slide-body">{tr(c.body)}</p>
          </div>
        )}
        <div className="k-dots">{K5_SLIDES.map((_, k) => {
          const ochiq = k <= maxSeen && !(betPending && k > i);
          return <button key={k} className={`k-dot ${k === i ? 'cur' : k < i ? 'fill' : ''}`} disabled={!ochiq} onClick={() => ochiq && setI(k)} aria-label={tr({ uz: `${k + 1}-bosqich`, ru: `Шаг ${k + 1}` })} title={ochiq ? undefined : tr({ uz: 'Avval shu bosqichni tugating', ru: 'Сначала завершите этот шаг' })} />;
        })}</div>
        {c.bridge && (
          <div className="frame-soft fade-step" key={`k${i}`}>
            {/* ETALON 22: ko'prik-bosqichi ham sanoqqa kiradi — zanjir uzilmaydi */}
            <span className="k-slide-eyebrow">Duolingo · {i + 1} / {K5_SLIDES.length}</span>
            <p className="body" style={{ margin: '10px 0 0', color: T.ink }}>{tr({ uz: "Bu raqam har kuni bitta narsani tekshiradi: kecha dars qilgan odam bugun ham qildimi. Sizning botingizda ham shu savol: kecha kelgan odam bugun ham keldimi?", ru: "Это число каждый день проверяет одно: занимался ли сегодня тот, кто занимался вчера. В вашем боте тот же вопрос: пришёл ли сегодня тот, кто приходил вчера?" })}</p>
          </div>
        )}
        <MentorNote>{tr({ uz: "Bu keysda rasmiy raqam yo'q — foydalanuvchi soni yoki o'sishini o'zingizdan aytmang. Sinfda Duolingo ishlatadigan bolalar bo'ladi: olov belgili raqamlarini so'rang, lekin taqqoslash tanloviga aylantirmang.", ru: "В этом кейсе нет официальных цифр — не называйте от себя число пользователей или рост. В классе будут дети, которые пользуются Duolingo: спросите их числа с иконкой огня, но не превращайте это в соревнование." })}</MentorNote>
      </div>
    </Stage>
  );
};

const Screen7 = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: "Tekshiruv · raqam qachon o'sadi", ru: 'Проверка · когда растёт число' })} scope="module-mikro"
    ctaLabel={tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' })} revealPrefix={tr({ uz: "To'g'ri javob", ru: 'Верный ответ' })}
    question={<TestQ ask={tr({ uz: "Duolingo'dagi olov belgili raqam o'sishi uchun odam nima qilishi kerak?", ru: "Что нужно делать человеку, чтобы число с иконкой огня в Duolingo росло?" })} />}
    questionText={"Duolingo'dagi olov belgili raqam o'sishi uchun odam nima qilishi kerak?"}
    options={[tr({ uz: 'Bir kunda bir nechta dars qilishi', ru: 'Проходить несколько уроков за день' }), tr({ uz: 'Bir haftada bir marta dars qilishi', ru: 'Заниматься раз в неделю' }), tr({ uz: 'Kun tashlamay dars qilishi', ru: "Заниматься, не пропуская дни" })]}
    correctIdx={2}
    explainCorrect={tr({ uz: "Bu raqam kunlarni sanaydi: kecha dars qilgan odam bugun ham qilsagina u o'sadi.", ru: 'Это число считает дни: оно растёт, только если занимавшийся вчера занимается и сегодня.' })}
    explainWrong={{
      0: tr({ uz: "Raqam darslarni sanamaydi — bir kunda o'nta dars qilsangiz ham, u bitta kun bo'lib sanaladi.", ru: "Число не считает уроки — даже десять уроков за день считаются одним днём." }),
      1: tr({ uz: "Haftada bir marta dars qilsangiz, oradagi kunlar bo'sh qoladi va raqam noldan boshlanadi.", ru: "Если заниматься раз в неделю, дни между занятиями остаются пустыми, и число начинается с нуля." }),
      default: tr({ uz: "Raqam ketma-ket kunlarni sanaydi.", ru: 'Число считает дни подряд.' })
    }}
  />
);

// ===== SCREEN 8 — UCH KUNLIK HISOB (48/80/85/92/106d-qonun) =====
// Chiqish-artefakt: { kunlar: [{kun, kelgan, qaytgan} x3], savedAt } — M5 modulini yopadi.
const OUT_KEY = 'pm-m5d11-metrika';
// Kirish-artefakt (m5-08): JIM zaxira — yo'q yoki buzuq bo'lsa tasma render bo'lmaydi (§69).
const IN_KEY = 'pm-m5d8-javoblar';
const readEshitgan = () => {
  try {
    const v = JSON.parse(localStorage.getItem(IN_KEY) || 'null');
    if (!v || !Array.isArray(v.javoblar)) return null;
    const list = v.javoblar
      .map(x => (x && typeof x.eshitgan === 'string' ? x.eshitgan.trim() : ''))
      .filter(Boolean)
      .map(s => (s.length > 34 ? `${s.slice(0, 34)}…` : s));
    return list.length ? list.slice(0, 3) : null;
  } catch { return null; }
};
const sonMi = (s) => /^\d{1,4}$/.test(String(s).trim());
const sonQiy = (s) => parseInt(String(s).trim(), 10);
const Screen8 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const [eshitgan] = useState(() => readEshitgan());
  const [list, setList] = useState(() => (storedAnswer && Array.isArray(storedAnswer.kunlar)) ? storedAnswer.kunlar : []);
  const [dKel, setDKel] = useState('');
  const [dQay, setDQay] = useState('');
  const [msg, setMsg] = useState('');
  const [edit, setEdit] = useState(null);
  const [focus, setFocus] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  const [starOpen, setStarOpen] = useState(false);
  const done = list.length >= 3;
  const savedRef = useRef(false);
  const kelOk = sonMi(dKel);
  const qayOk = sonMi(dQay);
  const oshib = kelOk && qayOk && sonQiy(dQay) > sonQiy(dKel);
  const canSave = kelOk && qayOk && !oshib;
  const inputTurn = useTurnHint(!done && !kelOk && !focus && !isMentor);
  const nQadam = edit === null ? list.length + 1 : edit + 1;
  useEffect(() => {
    if (!done || savedRef.current) return;
    savedRef.current = true;
    try { localStorage.setItem(OUT_KEY, JSON.stringify({ kunlar: list.slice(0, 3), savedAt: Date.now() })); } catch {}
    if (storedAnswer === undefined || !storedAnswer.solved) {
      onAnswer(screen, { stage: 'practice', screenIdx: screen, kunlar: list.slice(0, 3), solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'practice', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  useEffect(() => {
    if (!done || !savedRef.current) return;
    try { localStorage.setItem(OUT_KEY, JSON.stringify({ kunlar: list.slice(0, 3), savedAt: Date.now() })); } catch {}
  }, [list, done]);
  // 400-belgi qoidasi: saqlash-javobi o'qilgach (4 s) o'z o'rnini bo'shatadi — keyingi kun bo'sh ekranda yoziladi
  useEffect(() => {
    if (!msg) return undefined;
    const t = setTimeout(() => setMsg(''), 4200);
    return () => clearTimeout(t);
  }, [msg]);
  const save = () => {
    if (!canSave) return;
    const v = { kun: nQadam, kelgan: sonQiy(dKel), qaytgan: sonQiy(dQay) };
    setList(p => (edit === null ? [...p, v] : p.map((r, k) => (k === edit ? v : r))));
    setMsg(tr({ uz: `✓ ${v.kun}-kun yozildi: ${v.kelgan} odam keldi, ${v.qaytgan} tasi qaytdi.`, ru: `✓ ${v.kun}-й день записан: пришло ${v.kelgan}, вернулось ${v.qaytgan}.` }));
    setDKel(''); setDQay(''); setEdit(null);
  };
  const startEdit = (k) => { setEdit(k); setDKel(String(list[k].kelgan)); setDQay(String(list[k].qaytgan)); setMsg(''); };
  const navLabel = done || isMentor
    ? tr({ uz: 'Davom etish', ru: 'Продолжить' })
    : list.length === 0 ? tr({ uz: "1-kunning ikki sonini yozing", ru: "Запишите два числа 1-го дня" }) : tr({ uz: `Yana ${3 - list.length} kun yozing`, ru: `Запишите ещё дней: ${3 - list.length}` });
  const yozish = !done || edit !== null;
  return (
    <Stage eyebrow={tr({ uz: 'Mustaqil ish · uch kun', ru: 'Самостоятельная работа · три дня' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Botingizning uch kunini <span className="italic" style={{ color: T.accent }}>yozing</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Запишите</span> три дня своего бота.</> })}</h2></div>
        {eshitgan && (
          <span className="tasma fade-up">{tr({ uz: <>8-darsda eshitgan javoblaringiz: {eshitgan.join(' · ')}</>, ru: <>Ответы, которые вы услышали на 8-м уроке: {eshitgan.join(' · ')}</> })}</span>
        )}
        {/* 106d-f: ko'p qadamli mashqda Mentor BIR MARTA gapiradi — 1-kunning birinchi soni yozilguncha.
            106c: kun-izohi chiqqanda pufak o'z o'rnini unga bo'shatadi (bitta yo'l-yo'riq manbasi) */}
        {nQadam === 1 && !kelOk && !done && <Mentor>{eshitgan
          ? tr({ uz: "8-darsda odam nima deganini eshitgansiz — endi sonlarga qaraymiz. Namunadagidek, o'z botingizning uch kunini yozing; aniq son bo'lmasa, taxminiy son yozing.", ru: "На 8-м уроке вы услышали, что сказал человек, — теперь посмотрим на числа. Как в примере, запишите три дня своего бота; если точного числа нет, напишите примерное." })
          : tr({ uz: "Namunadagidek, o'z botingizning uch kunini yozing; aniq son bo'lmasa, taxminiy son yozing.", ru: "Как в примере, запишите три дня своего бота; если точного числа нет, напишите примерное." })}</Mentor>}
        {/* 80a: uch qadam-doira — yozilgani ✓, joriysi ajralgan; uch kun yozilgach o'rnini hisob-jadvaliga bo'shatadi */}
        {yozish && <div className="stps fade-up">
          {[0, 1, 2].map(k => (
            <span key={k} className={`stp ${list.length > k ? 'done' : (edit === null ? list.length : edit) === k ? 'on' : ''}`}><i>{list.length > k ? '✓' : k + 1}</i>{tr({ uz: <>{k + 1}-kun</>, ru: <>{k + 1}-й день</> })}</span>
          ))}
        </div>}
        <div className="wsp-one">
          {/* A6 (MD v2): navbat bilan — 2-katak 1-katak to'lgach chiqadi */}
          {yozish && (
            <div className="wsp-ed">
              <div className="numrow">
                <input className={`reflect-input num${inputTurn ? ' await' : ''}${kelOk ? ' filled' : ''}`} value={dKel} maxLength={4}
                  inputMode="numeric" placeholder={tr({ uz: 'Nechta odam keldi?', ru: 'Сколько человек пришло?' })} aria-label={tr({ uz: 'Nechta odam keldi?', ru: 'Сколько человек пришло?' })}
                  onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                  onChange={e => setDKel(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') save(); }} />
              </div>
              {kelOk && <>
                {nQadam === 1 && <span className="numlbl fade-step">{tr({ uz: <>Hisobda <span style={{ whiteSpace: 'nowrap' }}>1-kundan</span> oldingi kun yo'q — shuning uchun <span style={{ whiteSpace: 'nowrap' }}>1-kunning</span> qaytgani 0.</>, ru: <>В учёте нет дня раньше <span style={{ whiteSpace: 'nowrap' }}>1-го</span> — поэтому у <span style={{ whiteSpace: 'nowrap' }}>1-го дня</span> вернувшихся 0.</> })}</span>}
                <div className="numrow fade-step">
                  <input className={`reflect-input num${qayOk ? ' filled' : ''}`} value={dQay} maxLength={4}
                    inputMode="numeric" placeholder={tr({ uz: 'Ulardan nechtasi qaytdi?', ru: "Сколько из них вернулось?" })} aria-label={tr({ uz: 'Ulardan nechtasi qaytdi?', ru: "Сколько из них вернулось?" })}
                    onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                    onChange={e => setDQay(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') save(); }} />
                </div>
              </>}
              {/* 106d: javob nima noto'g'ri va qanday to'g'rilanadi */}
              {((dKel.trim().length > 0 && !kelOk) || (kelOk && dQay.trim().length > 0 && !qayOk)) && <p className="sfb ask">{tr({ uz: "Bu katakka faqat son yoziladi, masalan: 7.", ru: "В эту клетку пишется только число, например: 7." })}</p>}
              {oshib && <p className="sfb ask">{tr({ uz: "Qaytganlar o'sha kuni kelganlardan ko'p bo'lolmaydi — ular shu kelganlar ichidan sanaladi.", ru: "Вернувшихся не может быть больше, чем пришедших в тот день, — их считают среди этих же пришедших." })}</p>}
              {/* 30-qonun: qulf-tugma AYNAN qaysi qadam qolganini aytadi */}
              <div className="wsp-go">
                <button type="button" className="wsp-save" disabled={!canSave} onClick={save}>{edit === null ? tr({ uz: 'Saqlash →', ru: 'Сохранить →' }) : tr({ uz: '✓ Yangilash', ru: '✓ Обновить' })}</button>
                {!canSave && <span className="wsp-need">{!kelOk ? tr({ uz: 'Nechta odam kelganini yozing', ru: "Напишите, сколько человек пришло" }) : oshib ? tr({ uz: 'Qaytganlar kelganlardan oshmasin', ru: "Вернувшихся не должно быть больше пришедших" }) : tr({ uz: 'Ulardan nechtasi qaytganini yozing', ru: "Напишите, сколько из них вернулось" })}</span>}
              </div>
            </div>
          )}
          {msg && !done && <p className="sfb ok fade-step">{msg}</p>}
          {/* 80c: yozilganlar YOZISH PAYTIDA ko'rinmaydi; uchtasi yozilgach jadval ochiladi */}
          {done && edit === null && (
            <div className="wsp-list fade-step">
              <span className="wsp-list-h">{tr({ uz: 'Uch kunlik hisobingiz', ru: "Ваш учёт за три дня" })}</span>
              {list.slice(0, 3).map((r, k) => (
                <span key={k} className="wsp-item">
                  <span className="wsp-item-n">{r.kun}</span>
                  <span className="wsp-item-t">{tr({ uz: <>{r.kun}-kun <i className="wsp-arw">·</i> {tr(YORLIQ_KELDI)} {r.kelgan} <i className="wsp-arw">·</i> {tr(YORLIQ_QAYTDI)} {r.qaytgan}</>, ru: <>{r.kun}-й день <i className="wsp-arw">·</i> {tr(YORLIQ_KELDI)} {r.kelgan} <i className="wsp-arw">·</i> {tr(YORLIQ_QAYTDI)} {r.qaytgan}</> })}</span>
                  <button type="button" className="wsp-item-edit" onClick={() => startEdit(k)}>{tr({ uz: 'Tahrirlash', ru: 'Изменить' })}</button>
                </span>
              ))}
            </div>
          )}
          <div className="wsxrow">
            {yozish && (
              <div className={`wsx ${yordamOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })} {yordamOpen ? '▾' : '›'}</button>
                {yordamOpen && <div className="wsx-body"><p>{tr({ uz: <>Kechagi ro'yxatni oching va bugungisi bilan solishtiring: <b>ikkalasida ham bor odamlar</b> — qaytganlar.</>, ru: <>Откройте вчерашний список и сравните с сегодняшним: <b>люди, которые есть в обоих</b>, — вернувшиеся.</> })}</p></div>}
              </div>
            )}
            {/* Qo'shimcha ish uchun uchala kunning soni kerak — shuning uchun u faqat hisob to'lgach ochiladi */}
            {done && (
              <div className={`wsx star ${starOpen ? 'open' : ''}`}>
                <button className="wsx-toggle" onClick={() => setStarOpen(o => !o)}>{tr({ uz: "Qo'shimcha", ru: "Дополнительно" })} {starOpen ? '▾' : '›'}</button>
                {starOpen && <div className="wsx-body"><p>{tr({ uz: "Uch kunning qaytgan sonlarini solishtiring: qaysi kuni eng ko'p odam qaytdi? O'sha kuni botingizda nima boshqacha bo'lgan bo'lishi mumkin — o'ylab ko'ring.", ru: "Сравните числа вернувшихся за три дня: в какой день вернулось больше всего людей? Подумайте, что в тот день могло быть иначе в вашем боте." })}</p></div>}
              </div>
            )}
          </div>
          <StudentPracticePulse live={live} screen={screen} />
          <MentorPracticeStats live={live} screen={screen} label={{ uz: 'Uch kunni yozganlar', ru: "Записали три дня" }} />
        </div>
        <MentorNote>{tr({ uz: "Sonlarni hali sanamagan bolalar bo'ladi — ular bugungi kunni o'sha zahoti sanaydi, qolgan ikki kunni botdagi yozuvlardan topadi. Aniq son topilmasa, taxminiy sonni yozib, yoniga belgi qo'ymaydi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: 'Будут дети, которые ещё не считали числа — сегодняшний день они считают тут же, остальные два дня находят по записям в боте. Если точного числа нет, пишут примерное, без пометки рядом. Эту работу делают ученики, вы наблюдаете; «Продолжить» для вас открыто.' })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 9 — TEKSHIRUV: KUN-BELGILASH (26-qonun: yangi mexanika) =====
// Mezon — o'rinlar munosabati: katakning CHAP YONI to'lganmi. Mazmun tanlanmaydi.
const BELGI_KEY = 'pm-m5d11-belgi';
const HAFTA_KUN = [1, 2, 3, 4, 5];
// 9-ekran qator yorlig'i ruscha rejimda ruscha izohlardagi ism bilan bir xil (Азиз…); `ism` — kalit, o'zgarmaydi.
const ISM_RU = { Aziz: 'Азиз', Dilnoza: 'Дильноза', Shohrux: 'Шохрух', Malika: 'Малика' };
const HAFTA = [
  { ism: 'Aziz',    kelgan: [1, 2, 5], javob: [2],
    sabab: { uz: "2-kun: chap yonida 1-kun ham to'lgan — Aziz kecha ham kelgan edi.", ru: "2-й день: слева 1-й день тоже заполнен — Азиз приходил и вчера." } },
  { ism: 'Dilnoza', kelgan: [2, 3, 4], javob: [3, 4],
    sabab: { uz: '3- va 4-kun: Dilnoza uch kun ketma-ket kelgan, shuning uchun ikki qaytish kuni bor.', ru: "3-й и 4-й дни: Дильноза приходила три дня подряд, поэтому у неё два дня возвращения." } },
  { ism: 'Shohrux', kelgan: [1, 3, 5], javob: [],
    sabab: { uz: "Shohrux bir kun oralab kelgan — kelgan kunlarining birortasida ham chap yon to'lmagan.", ru: "Шохрух приходил через день — ни у одного из его дней клетка слева не заполнена." } },
  { ism: 'Malika',  kelgan: [3, 4, 5], javob: [4, 5],
    sabab: { uz: '4- va 5-kun: Malika 3-kundan boshlab uzilmay kelgan.', ru: "4-й и 5-й дни: Малика приходила без перерыва с 3-го дня." } },
];
const tengMi = (a, b) => a.length === b.length && a.every(x => b.includes(x));
// Xato-javobi holatga qarab tanlanadi. Tartib: (c) «qaytmagan» bosilgan bo'sh tanlov ->
// (a) kalitda yo'q kun belgilangan (aralash holatda ham shu) -> (b) belgilangani kam.
const XATO_BOSH = { uz: "Bu odam qaytgan: ikki to'lgan katak yonma-yon turgan joy bor.", ru: "Этот человек вернулся: есть место, где две заполненные клетки стоят рядом." };
const XATO_ORTIQ = { uz: "Bu kunning chap yoni bo'sh — bu odam kecha kelmagan edi.", ru: "Слева от этого дня пусто — этот человек вчера не приходил." };
const XATO_KAM = { uz: "Yana qaytish kuni bor — chap yoni ham to'lgan katakni qidiring.", ru: "Есть ещё день возвращения — ищите клетку, у которой клетка слева тоже заполнена." };
const xatoMatn = (r, q) => (r.bosh && q.javob.length > 0 ? XATO_BOSH
  : r.tanlov.some(k => !q.javob.includes(k)) ? XATO_ORTIQ
    : XATO_KAM);
const Screen9 = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const achMiss = useContext(AchMissCtx);
  const [i, setI] = useState(() => (Number.isInteger(storedAnswer?.qator) && storedAnswer.qator >= 0 ? storedAnswer.qator : 0)); /* F-0915-02 */
  const [sel, setSel] = useState([]);
  const [res, setRes] = useState(null);
  const [missedOnce, setMissedOnce] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  const done = i >= HAFTA.length;
  const qator = done ? null : HAFTA[i];
  useEffect(() => {
    if (done && (storedAnswer === undefined || !storedAnswer.solved)) {
      try { localStorage.setItem(BELGI_KEY, JSON.stringify({ qator: HAFTA.length, savedAt: Date.now() })); } catch {}
      onAnswer(screen, { stage: 'belgi', screenIdx: screen, qator: HAFTA.length, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'belgi', 0, true, 0);
    }
  }, [done]); // eslint-disable-line
  const bosish = (kun) => {
    if (isMentor || done || res || !qator.kelgan.includes(kun)) return;
    setSel(p => (p.includes(kun) ? p.filter(x => x !== kun) : [...p, kun].sort((a, b) => a - b)));
  };
  const tekshir = (bosh) => {
    if (isMentor || done || res) return;
    const tanlov = bosh ? [] : sel;
    const ok = tengMi(tanlov, qator.javob);
    if (!ok) {
      setMissedOnce(true);
      if (achMiss) achMiss.miss(screen); // 🏅 151-qonun: tekshirilgan xato qator — nishon birinchi urinishga
    }
    setRes({ ok, tanlov, bosh });
  };
  const keyingi = () => {
    setSel([]); setRes(null); setI(v => v + 1);
  };
  const stripRef = useRef(null);
  useEffect(() => {
    if (!done || !stripRef.current) return;
    const kam = kamHarakat();
    const t = setTimeout(() => { if (stripRef.current) stripRef.current.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'nearest' }); }, 320);
    return () => clearTimeout(t);
  }, [done]);
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : tr({ uz: `Yana ${HAFTA.length - i} qatorni belgilang`, ru: `Отметьте ещё строк: ${HAFTA.length - i}` });
  return (
    <Stage eyebrow={tr({ uz: 'Tekshiruv · besh kun', ru: 'Проверка · пять дней' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(9px,1.4vw,14px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Har qatorda qaytish kunlarini <span className="italic" style={{ color: T.accent }}>belgilang</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Отметьте</span> дни возвращения в каждой строке.</> })}</h2></div>
        {i === 0 && !res && <Mentor>{tr({ uz: "To'lgan katak — odam o'sha kuni kelgan. Chap yonidagi katak ham to'lgan bo'lsa, shu katakni bosing: bu — qaytish kuni.", ru: "Заполненная клетка — человек пришёл в тот день. Если клетка слева тоже заполнена, нажмите на эту клетку: это день возвращения." })}</Mentor>}
        <div className="mrk">
          <div className="mrk-h">
            <span className="mrk-t">{tr({ uz: "Besh kunlik ro'yxat", ru: "Список за пять дней" })}</span>
            {/* §134 · A-12.1: kalit jadval TEPASIDA, CSS katakcha katak uslubi bilan AYNAN bir xil.
                Har yozuv O'Z holati ekranda paydo bo'lgan payt qo'shiladi. */}
            <div className="mrk-leg">
              <span className="mrk-key"><span className="mrk-sw tolgan" aria-hidden="true" />{tr({ uz: 'odam kelgan kun', ru: "день, когда человек пришёл" })}</span>
              {(sel.length > 0 || res || i > 0) && <span className="mrk-key"><span className="mrk-sw belgi" aria-hidden="true" />{tr({ uz: 'siz belgilagan kun', ru: "день, который вы отметили" })}</span>}
              {(res || i > 0) && <span className="mrk-key"><span className="mrk-sw kalit" aria-hidden="true" />{tr({ uz: 'qaytish kuni', ru: "день возвращения" })}</span>}
            </div>
            <span className="mrk-n mono">{Math.min(i + 1, HAFTA.length)} / {HAFTA.length}</span>
          </div>
          <div className="mrk-grid">
            <span className="mrk-rl empty" />
            {HAFTA_KUN.map(k => <span key={`h${k}`} className="mrk-day">{tr({ uz: <>{k}-kun</>, ru: <>{k}-й день</> })}</span>)}
            {/* A6 (MD v2): qatorlar navbat bilan — joriy qator va oldin tekshirilganlar */}
            {HAFTA.map((r, ri) => {
              if (!done && ri > i) return null;
              const ochiq = ri === i;
              const otgan = ri < i;
              return (
                <React.Fragment key={r.ism}>
                  <span className={`mrk-rl${ochiq ? ' cur' : ''}`}>{tr({ uz: r.ism, ru: ISM_RU[r.ism] || r.ism })}</span>
                  {HAFTA_KUN.map(k => {
                    const tolgan = r.kelgan.includes(k);
                    const belgi = ochiq && sel.includes(k);
                    const kalit = (otgan || (ochiq && res)) && r.javob.includes(k);
                    return (
                      <button key={`${r.ism}${k}`} type="button"
                        className={`mrk-cell${tolgan ? ' tolgan' : ''}${belgi ? ' belgi' : ''}${kalit ? ' kalit' : ''}${ochiq ? ' cur' : ''}`}
                        disabled={!ochiq || !tolgan || !!res || isMentor}
                        onClick={() => bosish(k)}>
                        {/* MD v2 s9: tekshiruvdan keyin chap katakdan shu katakka qisqa strelka (~0.6 s) */}
                        {kalit && <span className="mrk-ar" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        {!done && !res && (
          <div className="mrk-go">
            <button type="button" className="wsp-save" disabled={sel.length === 0 || !!res || isMentor} onClick={() => tekshir(false)}>{tr({ uz: 'Tekshirish', ru: 'Проверить' })}</button>
            <button type="button" className="btn-soft" disabled={!!res || isMentor} onClick={() => tekshir(true)}>{tr({ uz: 'Bu odam qaytmagan', ru: "Этот человек не вернулся" })}</button>
            {!res && <span className="wsp-need">{sel.length === 0 ? tr({ uz: "Qaytish kunlarini bosing yoki «Bu odam qaytmagan»ni tanlang", ru: "Нажмите дни возвращения или выберите «Этот человек не вернулся»" }) : tr({ uz: 'Endi tekshiring', ru: "Теперь проверьте" })}</span>}
          </div>
        )}
        {!done && <AchRule screen={screen} once />}
        {res && !done && (
          <div className="bdone fade-step">
            <p className={`sfb ${res.ok ? 'ok' : 'ask'}`}>{res.ok ? tr({ uz: '✓ To\'g\'ri.', ru: "✓ Верно." }) : tr(xatoMatn(res, qator))} {tr(qator.sabab)}</p>
            <button type="button" className="wsp-save" onClick={keyingi}>{tr({ uz: 'Keyingisi →', ru: "Дальше →" })}</button>
          </div>
        )}
        {/* YORDAM-savoli ekran boshida TURMAYDI: faqat birinchi xatodan keyin ochiladi */}
        {missedOnce && !done && (
          <div className={`wsx ${yordamOpen ? 'open' : ''}`} style={{ maxWidth: 560 }}>
            <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })} {yordamOpen ? '▾' : '›'}</button>
            {yordamOpen && <div className="wsx-body"><p>{tr({ uz: <>Har katakka bitta savol bering: <b>chap yonidagi kun</b> ham to'lganmi?</>, ru: <>Задайте каждой клетке один вопрос: <b>день слева</b> тоже заполнен?</> })}</p></div>}
          </div>
        )}
        {done && (
          <div className="bdone fade-step" ref={stripRef}>
            <span className="done-mini">{tr({ uz: <>✓ To'rt odamdan uchtasi kamida bir marta qaytdi — jami 5 ta qaytish kuni.</>, ru: <>✓ Из четырёх человек трое вернулись хотя бы раз — всего 5 дней возвращения.</> })}</span>
          </div>
        )}
        <StudentPracticePulse live={live} screen={screen} />
        <MentorPracticeStats live={live} screen={screen} label={{ uz: 'Qatorlarni belgilaganlar', ru: "Отметили строки" }} />
        <MentorNote>{tr({ uz: "Eng ko'p adashiladigan joy — Shohrux qatori: u uch kun kelgan, demak bolalar «qaytgan» deb belgilaydi. Yordamni eslating: chap yonidagi kun to'lganmi? Ish-tartibi: juftlikda har o'quvchi sherigining uch kunlik hisobini o'qib, «qaysi kuni eng ko'p odam qaytdi?» deb so'raydi; javob topilmasa hisob qayta o'qiladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: "Чаще всего ошибаются на строке Шохруха: он приходил три дня, поэтому дети отмечают «вернулся». Напомните подсказку: день слева заполнен? Порядок работы: в паре каждый ученик читает учёт напарника за три дня и спрашивает: «в какой день вернулось больше всего людей?»; если ответа нет, учёт читают заново. Эту работу делают ученики, вы наблюдаете; «Продолжить» для вас открыто." })}</MentorNote>
      </div>
    </Stage>
  );
};

// ===== SCREEN 10 — KODING: qaytganlarni sanaydigan kod (26/82/87-qonun) =====
// Registr R1 navbati: m5-08 VS Code -> m5-11 KOMPILYATOR (src/compilator/HtmlCompiler.jsx).
const KODING_KEY = 'pm-m5d11-code';
const readKoding = () => { try { const v = JSON.parse(localStorage.getItem(KODING_KEY) || 'null'); return v && typeof v === 'object' ? v : null; } catch { return null; } };
const writeKodingOpen = (open) => { try { const p = readKoding() || {}; localStorage.setItem(KODING_KEY, JSON.stringify({ ...p, open })); } catch {} };

// Darvoza-mashq (82e): qaytgan sonining qoidasi kod yozishdan OLDIN muhrlanadi.
const GATE_ITEMS = [
  { id: 'g1', t: { uz: "3 — bugungi ro'yxatdagi hamma odam", ru: '3 — все люди из сегодняшнего списка' }, ok: false },
  { id: 'g2', t: { uz: "2 — kecha ham ro'yxatda bo'lgan odamlar", ru: "2 — люди, которые были в списке и вчера" }, ok: true },
  { id: 'g3', t: { uz: "1 — kecha ro'yxatda bo'lmagan odam", ru: '1 — те, кого вчера в списке не было' }, ok: false },
];

// Kod-nomlari ASCII, apostrofsiz (kunlar · kelganlar · kelgan · qaytgan · hisob) —
// artefakt kaliti bilan AYNAN bir xil: pm-m5d11-metrika.kunlar[].kelgan/qaytgan.
// §135: kod-satrlari qo'shtirnoqda — o'quvchi apostrofli matn qo'ysa kod sinmaydi.
const KOD_STARTER = { uz: `// kunlar — botingizning uch kuni: har kuni kim kelgani
const kunlar = [
  { kun: 1, kelganlar: ["aziz", "dilnoza", "shohrux", "malika"] },
  { kun: 2, kelganlar: ["dilnoza", "shohrux", "nodira"] },
  { kun: 3, kelganlar: ["shohrux", "nodira", "jasur", "aziz"] },
];

function hisob(kunlar) {
  const natija = [];
  for (let i = 0; i < kunlar.length; i++) {
    const bugungilar = kunlar[i].kelganlar;
    // 1-kundan oldin ro'yxat yo'q: kechagilar bo'sh qoladi
    let kechagilar = [];
    if (i > 0) kechagilar = kunlar[i - 1].kelganlar;

    // Bugungilardan nechtasi kechagilar ichida bor?
    let qaytgan = 0;

    natija.push({ kun: kunlar[i].kun, kelgan: bugungilar.length, qaytgan: qaytgan });
  }
  return natija;
}

console.log(hisob(kunlar));
// [{ kun: 1, kelgan: 4, qaytgan: 0 },
//  { kun: 2, kelgan: 3, qaytgan: 2 },
//  { kun: 3, kelgan: 4, qaytgan: 2 }]`, ru: `// kunlar — три дня вашего бота: кто приходил в каждый день
const kunlar = [
  { kun: 1, kelganlar: ["aziz", "dilnoza", "shohrux", "malika"] },
  { kun: 2, kelganlar: ["dilnoza", "shohrux", "nodira"] },
  { kun: 3, kelganlar: ["shohrux", "nodira", "jasur", "aziz"] },
];

function hisob(kunlar) {
  const natija = [];
  for (let i = 0; i < kunlar.length; i++) {
    const bugungilar = kunlar[i].kelganlar;
    // До 1-го дня списка нет: kechagilar остаётся пустым
    let kechagilar = [];
    if (i > 0) kechagilar = kunlar[i - 1].kelganlar;

    // Сколько из bugungilar есть в kechagilar?
    let qaytgan = 0;

    natija.push({ kun: kunlar[i].kun, kelgan: bugungilar.length, qaytgan: qaytgan });
  }
  return natija;
}

console.log(hisob(kunlar));
// [{ kun: 1, kelgan: 4, qaytgan: 0 },
//  { kun: 2, kelgan: 3, qaytgan: 2 },
//  { kun: 3, kelgan: 4, qaytgan: 2 }]` };

// Shartlar XULQ-ATVORGA bog'langan (manba-regex sanog'i emas): for...of bilan ham,
// filter bilan ham yozilgan to'g'ri yechim o'tadi; starter holatida uchalasi ham qizil.
const KOD_DATA = '[{kun:1,kelganlar:["aziz","dilnoza","shohrux","malika"]},{kun:2,kelganlar:["dilnoza","shohrux","nodira"]},{kun:3,kelganlar:["shohrux","nodira","jasur","aziz"]}]';
const KOD_TASK = {
  eyebrow: { uz: 'Koding · qaytganlarni sanash', ru: 'Кодинг · считаем вернувшихся' },
  title: { uz: <>app.js — <span className="mono">hisob</span> funksiyasini yozing</>, ru: <>app.js — напишите функцию <span className="mono">hisob</span></> },
  brief: { uz: <><span className="mono">hisob</span> funksiyasi har kun uchun obyekt qaytaradi, lekin <span className="mono">qaytgan</span> hozir doim 0. Bugungilardan nechtasi kechagilar ichida borligini sanang (<span className="mono">includes</span>). Pastdagi <span className="mono">console.log</span> natijani ko'rsatadi.</>, ru: <>Функция <span className="mono">hisob</span> возвращает объект на каждый день, но <span className="mono">qaytgan</span> пока всегда 0. Посчитайте, сколько сегодняшних есть среди вчерашних (<span className="mono">includes</span>). <span className="mono">console.log</span> внизу покажет результат.</> },
  files: [{ name: 'app.js', lang: 'js', starter: KOD_STARTER, placeholder: { uz: '// bugungilardan nechtasi kechagilar ichida bor?', ru: "// сколько из bugungilar есть в kechagilar?" } }],
  requirements: [
    { id: 'uch', label: { uz: 'Uch kun uchun uchta obyekt qaytadi', ru: "На три дня возвращаются три объекта" },
      check: C.evalEquals(`(function(){var r=hisob(${KOD_DATA});return Array.isArray(r)&&r.length===3;})()`, 'true', { uz: "Uch kunga uchta obyekt kerak — bo'sh ro'yxat o'tmaydi", ru: "На три дня нужны три объекта — пустой список не проходит" }) },
    { id: 'maydon', label: { uz: 'Har obyektda kun, kelgan, qaytgan bor', ru: "В каждом объекте есть kun, kelgan, qaytgan" },
      check: C.evalEquals(`(function(){var r=hisob(${KOD_DATA});if(!Array.isArray(r))return '';return r.map(function(x){return (x&&x.kun)+'/'+(x&&x.kelgan)+'/'+(x&&typeof x.qaytgan);}).join(',');})()`, '1/4/number,2/3/number,3/4/number', { uz: "Har obyektda kun raqami, o'sha kuni kelganlar soni va qaytganlar soni bo'lsin", ru: "В каждом объекте должны быть номер дня, число пришедших в тот день и число вернувшихся" }) },
    { id: 'qaytgan', label: { uz: "Har kunning qaytgani to'g'ri (1-kunda 0)", ru: "Число вернувшихся верно для каждого дня (у 1-го — 0)" },
      check: C.evalEquals(`(function(){var r=hisob(${KOD_DATA});if(!Array.isArray(r))return '';return r.map(function(x){return x&&x.qaytgan;}).join(',');})()`, '0,2,2', { uz: "1-kundan oldin ro'yxat yo'q — uning qaytgani 0; qolgan kunlar kechagi ro'yxat bilan solishtiriladi", ru: "До 1-го дня списка нет — у него вернувшихся 0; остальные дни сравниваются со вчерашним списком" }) },
  ],
};

const ScreenCoding = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  const gate = useContext(LiveGateCtx) || {};
  const live = gate.live;
  const isMentor = !!(live && live.mode === 'mentor');
  const isSelf = !live || live.mode === 'self';
  const [saved] = useState(() => readKoding());
  const [open, setOpen] = useState(() => !!(saved && saved.open));
  const [gpick, setGpick] = useState(() => (saved && saved.gpick) || null);
  const [miss, setMiss] = useState(null);
  const [missedOnce, setMissedOnce] = useState(false);
  const [yordamOpen, setYordamOpen] = useState(false);
  const missT = useRef(null);
  const [st, setSt] = useState(() => ({
    code: (typeof storedAnswer?.code === 'string' ? storedAnswer.code : null) || (saved && saved.code) || tr(KOD_STARTER), // F-0914-10: saqlangan javob matn bo'lmasa — zaxira-zanjir (oq ekran himoyasi)
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
  // Kompilyator `{ codes, code }` uzatadi; bu darsda yagona fayl — `app.js` (JS rejimi).
  const finishPractice = ({ codes, code: htmlCode }) => {
    const newCode = (codes && codes['app.js']) || htmlCode || code;
    setOpen(false);
    setSt({ code: newCode, done: true });
    try { localStorage.setItem(KODING_KEY, JSON.stringify({ ...(readKoding() || {}), code: newCode, done: true, open: false })); } catch {}
    if (!done) {
      onAnswer(screen, { stage: 'koding', screenIdx: screen, code: newCode, solved: true, correct: true });
      if (live && live.mode === 'student') live.submitAnswer(PRACTICE_BASE + screen, 'koding', 0, true, 0);
    }
  };
  const navLabel = done || isMentor ? tr({ uz: 'Davom etish', ru: 'Продолжить' }) : !stage2 ? tr({ uz: 'Qaytganlar sonini tanlang', ru: "Выберите число вернувшихся" }) : tr({ uz: 'Kodni yozing', ru: "Напишите код" });
  return (
    <Stage eyebrow={tr({ uz: 'Koding · kod oynasi', ru: "Кодинг · окно кода" })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive turnBusy={!done} disabled={!done && !isMentor} label={navLabel} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.5vw,15px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Qaytganlarni sanaydigan <span className="italic" style={{ color: T.accent }}>kod</span> yozamiz.</>, ru: <>Напишем <span className="italic" style={{ color: T.accent }}>код</span>, который считает вернувшихся.</> })}</h2></div>
        {!stage2 ? (
          <>
            <Mentor>{tr({ uz: "O'tgan darsda qaytganlarni bitta kun uchun yozuvdan qo'lda sanadingiz. Endi ularni kod har kun uchun alohida sanaydi. Avval bitta kunni o'zingiz tekshiring.", ru: "На прошлом уроке вы вручную считали вернувшихся для одного дня по записям бота. Теперь их посчитает код — для каждого дня отдельно. Сначала сами проверьте один день." })}</Mentor>
            <div className={`cmt hunt${missedOnce ? ' calm' : ''}`}>
              <span className="cmt-lbl">{tr({ uz: "Kecha kelganlar: Aziz · Dilnoza · Shohrux · Malika. Bugun kelganlar: Dilnoza · Shohrux · Nodira. Bugun nechta odam qaytdi?", ru: "Вчера пришли: Азиз · Дильноза · Шохрух · Малика. Сегодня пришли: Дильноза · Шохрух · Нодира. Сколько человек вернулось сегодня?" })}</span>
              <div className="gt-rows">
                {GATE_ITEMS.map(g => (
                  <button key={g.id} type="button" className={`fchoice${miss === g.id ? ' miss' : ''}`} onClick={() => pickGate(g)}>
                    {tr(g.t)}
                  </button>
                ))}
              </div>
              {missedOnce && <p className="cmt-tip">{tr({ uz: "Bu boshqa narsani sanaydi. Kecha ham, bugun ham ro'yxatda bor odamlarni sanang.", ru: "Это считает другое. Посчитайте людей, которые есть в списке и вчера, и сегодня." })}</p>}
            </div>
          </>
        ) : (
          <>
            <Mentor>{tr({ uz: "Qatorlarda qo'lda qilgan ishingiz kodda bitta savolga aylanadi: bu odam kechagi ro'yxatda ham bormi?", ru: 'То, что вы делали вручную в строках, в коде превращается в один вопрос: есть ли этот человек и во вчерашнем списке?' })}</Mentor>
            <div className="cmt-fold fade-step"><span className="cmt-done">{tr({ uz: "✓ Qaytgan — kecha ham, bugun ham ro'yxatda bor odam", ru: '✓ Вернувшийся — тот, кто есть в списке и вчера, и сегодня' })}</span></div>
            <div className="split kod">
              <Col gap={10}>
                <div className={`kdpanel${done ? ' is-done' : ''}`}>
                  <p className="flow-label">{tr({ uz: 'Kod nima qilsin', ru: 'Что должен делать код' })}</p>
                  <ol className="kdreq">
                    <li>{tr({ uz: 'Uch kun uchun uchta obyekt qaytadi', ru: "На три дня возвращаются три объекта" })}</li>
                    <li>{fmtCode(tr({ uz: 'Har obyektda `kun`, `kelgan`, `qaytgan` bor', ru: "В каждом объекте есть `kun`, `kelgan`, `qaytgan`" }))}</li>
                    <li>{tr({ uz: "Har kunning qaytgani to'g'ri (1-kunda 0)", ru: "Число вернувшихся верно для каждого дня (у 1-го — 0)" })}</li>
                  </ol>
                  <div className={`wsx star ${yordamOpen ? 'open' : ''}`}>
                    <button className="wsx-toggle" onClick={() => setYordamOpen(o => !o)}>{tr({ uz: 'Yordam', ru: "Подсказка" })} {yordamOpen ? '▾' : '›'}</button>
                    {yordamOpen && <div className="wsx-body">
                      <p>{fmtCode(tr({ uz: "Bugungilarni birma-bir oling va `kechagilar.includes(...)` bilan tekshiring — `includes` ni o'tgan darsdagi `stat` funksiyasida ishlatgansiz.", ru: "Берите сегодняшних по одному и проверяйте через `kechagilar.includes(...)` — `includes` вы использовали на прошлом уроке в функции `stat`." }))}</p>
                      <p>{tr({ uz: "Qo'shimcha: uch kunning qaytgan sonlarini qo'shib, jami nechta qaytish bo'lganini ham chiqaring.", ru: "Дополнительно: сложите числа вернувшихся за три дня и выведите, сколько всего было возвращений." })}</p>
                    </div>}
                  </div>
                  {done && <div className="done-mini fade-step">{tr({ uz: <>✓ Uchta obyekt chiqdi <span className="dm-sub">— endi qaytganlarni kod sanaydi.</span></>, ru: <>✓ Вышли три объекта <span className="dm-sub">— теперь вернувшихся считает код.</span></> })}</div>}
                  {!done && isSelf && (
                    <button className="kd-skip" onClick={onNext}>{tr({ uz: '✓ Bu kodni sinfda yozganman →', ru: '✓ Я писал этот код в классе →' })}</button>
                  )}
                </div>
                <StudentPracticePulse live={live} screen={screen} />
                <MentorPracticeStats live={live} screen={screen} label={{ uz: "Kodni yozib bo'lganlar", ru: "Дописали код" }} />
              </Col>
              <Col gap={10}>
                <div className="klaunch">
                  <span className="klaunch-lbl">{tr({ uz: 'Uch kun — bitta funksiya', ru: "Три дня — одна функция" })}</span>
                  <p className="klaunch-b">{tr({ uz: "Kod oynasi: chapda kod yozasiz, o'ngda natija chiqadi.", ru: "Окно кода: слева пишете код, справа появляется результат." })}</p>
                  <button className={`kod-launch-btn${openHint ? ' turn-ring' : ''}`} onClick={() => { setOpen(true); writeKodingOpen(true); }}>
                    {done ? tr({ uz: '↻ Kod oynasini qayta ochish', ru: "↻ Открыть окно кода снова" }) : tr({ uz: 'Kod oynasini ochish', ru: "Открыть окно кода" })}
                  </button>
                  {done && <span className="klaunch-sub">{tr({ uz: 'Bajarildi — xohlasangiz kodni yana sayqallang', ru: 'Выполнено — при желании ещё отшлифуйте код' })}</span>}
                </div>
              </Col>
            </div>
          </>
        )}
        <MentorNote>{tr({ uz: "Eng foydali xato — bugungi hamma odamni qaytgan deb sanash (qaytgan = bugungilar soni). Shartlar buni tutadi — 3-shart o'tmaydi. Kod shu oynada yoziladi — 10 daqiqa yetadi; ulgurmagan o'quvchi uyga qisqa variantni oladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.", ru: "Самая полезная ошибка — посчитать вернувшимися всех сегодняшних (qaytgan = число сегодняшних). Условия это ловят — третье условие не проходит. Код пишется в этом окне — 10 минут хватает; кто не успел, берёт домой короткий вариант. Эту работу делают ученики, вы наблюдаете; «Продолжить» для вас открыто." })}</MentorNote>
      </div>
      {/* Kod-saqlov kompilyatorning O'ZIDA (`:code`) — dars kaliti `done`/`open` uchun qoladi */}
      {/* 🔴 ZOOM IKKI MARTA TUSHMASIN (18-ov (a)): `.lesson-root` da `zoom: var(--lz)` bor,
          `.hc-root` ham o'zi `zoom: var(--lz)` qo'yadi — keng ekranda (2560×1440 · --lz 1.33)
          kattalashish lz² ga chiqib, kompilyator shart-chiplari (.hc-top) bilan «Davom etish»
          (.hc-bottom) ekrandan chiqib ketardi. Qobiq tashqi zoomni bekor qiladi. */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: T.bg, zoom: 'calc(1 / var(--lz, 1))' }}>
          <HtmlCompiler lang={__lang} task={KOD_TASK} starterCode={code || tr(KOD_STARTER)} storageKey={`${KODING_KEY}:code`}
            onContinue={finishPractice} onBack={() => { setOpen(false); writeKodingOpen(false); }} />
        </div>
      )}
    </Stage>
  );
};
// ===== SCREEN 12 — RECAP: 2 qadam (ayting + yozing) =====
const REFLECT_KEY = 'pm-m5d11-reflection';
// 🔴 Korpus §97: YAKKA o'quvchida sherik YO'Q — unga «A» va «B» navbati ko'rsatilmaydi.
// Yakka tarmoq: bitta 30 soniyalik navbat, neytral matn.
function PairTimer({ onStage, onEnd, muted, solo, startNow }) {
  const TOTAL = solo ? 30 : 60;
  const [st, setSt] = useState({ running: !!startNow, left: TOTAL, done: false });
  const stage = st.running ? 'running' : (st.done ? 'done' : 'idle');
  useEffect(() => { if (onStage) onStage(stage); }, [stage]); // eslint-disable-line
  const startTurn = useTurnHint(!st.running && !st.done && !muted);
  useEffect(() => {
    if (!st.running) return;
    if (st.left <= 0) { setSt({ running: false, left: TOTAL, done: true }); if (onEnd) onEnd(); return; }
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
              ? null
              : <><span className="pair-now">{tr({ uz: <>Hozir <span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span> gapiradi</>, ru: <>Сейчас говорит <span className={`pair-who ${isA ? '' : 'b'}`}>{isA ? 'A' : 'B'}</span></> })}</span><span className="pair-next">{isA ? tr({ uz: 'keyin — B navbati', ru: 'потом — очередь B' }) : tr({ uz: 'oxirgi navbat', ru: 'последняя очередь' })}</span></>}
          </div>
        </div>
      ) : (solo && !st.done) ? null : (
        <p className="pair-now" style={{ margin: 0 }}>{st.done
          ? (solo ? tr({ uz: '✓ Vaqt tugadi.', ru: "✓ Время вышло." }) : tr({ uz: '✓ Vaqt tugadi — ikkalangiz ham aytdingiz.', ru: "✓ Время вышло — рассказали оба." }))
          : (solo ? tr({ uz: "30 soniya — ovoz chiqarib o'zingizga ayting.", ru: '30 секунд — расскажите вслух самому себе.' }) : tr({ uz: 'Har biringizga 30 soniyadan — avval A, keyin B.', ru: 'По 30 секунд каждому — сначала A, потом B.' }))}</p>
      )}
      <div className="pair-timer-btns">
        {!st.running && <button className={st.done ? 'btn-soft' : `pair-start${startTurn ? '' : ' calm'}`} onClick={() => setSt({ running: true, left: TOTAL, done: false })}>{st.done ? (solo ? tr({ uz: '↻ Yana 30 soniya', ru: '↻ Ещё 30 секунд' }) : tr({ uz: '↻ Yana 1 daqiqa', ru: '↻ Ещё 1 минута' })) : (solo ? tr({ uz: '▶ 30 soniyani boshlash', ru: '▶ Запустить 30 секунд' }) : tr({ uz: '▶ 1 daqiqani boshlash', ru: '▶ Запустить минуту' }))}</button>}
        {st.running && <button className="btn-soft" onClick={() => { setSt({ running: false, left: TOTAL, done: false }); if (onEnd) onEnd(); }}>{tr({ uz: "To'xtatish", ru: "Остановить" })}</button>}
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
  // A6 (MD v2 s12): 1-qadam taymer tugagach yoki to'xtatilgach «✓ Aytdingiz» qatoriga yig'iladi, keyin 2-qadam chiqadi
  const [aytdi, setAytdi] = useState(() => written);
  const [qayta, setQayta] = useState(false);
  const [reflFocus, setReflFocus] = useState(false);
  const inputTurn = useTurnHint(aytdi && !written && !reflFocus);
  return (
    <Stage eyebrow={tr({ uz: 'Mustahkamlash · 2 qadam', ru: 'Закрепление · 2 шага' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext turnBusy={!written} label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Ikki sonni <span className="italic" style={{ color: T.accent }}>yoddan</span> ayta olasizmi?</>, ru: <>Сможете назвать два числа <span className="italic" style={{ color: T.accent }}>по памяти</span>?</> })}</h2></div>
        <Mentor>{tr({ uz: <>Ekranga qaramay javob bering: o'z hisobingizda 2-kuni botingizga nechta odam keldi va ulardan nechtasi qaytdi? Avval {yakka ? "ovoz chiqarib o'zingizga" : 'sherigingizga'} ayting, keyin bir qatorda yozing.</>, ru: <>Ответьте, не глядя на экран: сколько человек пришло к вашему боту во 2-й день по вашему учёту и сколько из них вернулось? Сначала скажите {yakka ? 'вслух себе' : 'напарнику'}, потом напишите одной строкой.</> })}</Mentor>
        <div className="rcp-flow">
          {!aytdi ? (
            <div className="rcp-step fade-up delay-1">
              <div className="rcp-step-h"><span className="rcp-n">1</span><div><span className="rcp-t">{yakka ? tr({ uz: 'Ovoz chiqarib ayting', ru: 'Скажите вслух' }) : tr({ uz: 'Sherigingizga ayting', ru: 'Скажите напарнику' })}</span></div></div>
              <PairTimer onStage={setPairStage} onEnd={() => setAytdi(true)} muted={written} solo={yakka} startNow={qayta} />
            </div>
          ) : (
            <div className="rcp-said fade-step">
              <span className="rcp-said-t">{tr({ uz: '✓ Aytdingiz', ru: "✓ Вы рассказали" })}</span>
              <button type="button" className="btn-soft" onClick={() => { setQayta(true); setAytdi(false); }}>{yakka ? tr({ uz: '↻ Yana 30 soniya', ru: '↻ Ещё 30 секунд' }) : tr({ uz: '↻ Yana 1 daqiqa', ru: '↻ Ещё 1 минута' })}</button>
            </div>
          )}
          {(aytdi || written) && (
            <div className="rcp-step fade-step">
              <div className="rcp-step-h"><span className="rcp-n">2</span><div><span className="rcp-t">{tr({ uz: 'Endi bir qatorda yozing', ru: "Теперь напишите одной строкой" })}</span></div></div>
              <span className={`turn-wrap${inputTurn ? ' turn-ring' : ''}`}>
                <input className="reflect-input" aria-label={tr({ uz: '2-kun: Keldi … · Qaytdi …', ru: "2-й день: Пришли … · Вернулись …" })} value={text} onChange={e => save(e.target.value)} onFocus={() => setReflFocus(true)} onBlur={() => setReflFocus(false)} placeholder={tr({ uz: '2-kun: Keldi … · Qaytdi …', ru: "2-й день: Пришли … · Вернулись …" })} maxLength={160} />
              </span>
              {written && (
                <div className="rcp-win fade-step">
                  <span className="rcp-win-t">{tr({ uz: '✓ Endi botingizga kelgan odamlarni sanabgina qolmaysiz — ulardan nechtasi qaytganini ham bilasiz.', ru: '✓ Теперь вы не просто считаете пришедших к боту — вы знаете и сколько из них вернулось.' })}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <MentorNote>{tr({ uz: "Uchdan biri ikkinchi sonni aytolmasa — 8-ekrandagi uch kunlik hisobni qayta oching va 2-kun qatorini birga o'qing.", ru: "Если каждый третий не может назвать второе число — снова откройте учёт за три дня на 8-м экране и вместе прочитайте строку 2-го дня." })}</MentorNote>
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
    <div className="fc-done fade-up"><span className="fc-done-emoji">✓</span><p className="fc-done-h">{tr({ uz: 'Hammasini bilasiz!', ru: 'Вы знаете всё!' })}</p><p className="fc-done-s">{tr({ uz: <>{total}/{total} karta yodlandi</>, ru: <>Выучено карточек: {total}/{total}</> })}</p><button className="fc-btn ghost" onClick={restart}>{tr({ uz: '↻ Qaytadan takrorlash', ru: '↻ Повторить заново' })}</button></div>
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
        : (<p className="fc-hint" />)}
    </div>
  );
}
const FLASHCARDS = [
  { front: { uz: "Qaytgan odam kim?", ru: "Кто такой вернувшийся?" }, back: { uz: "Kecha ham, bugun ham kelgan odam", ru: "Тот, кто пришёл и вчера, и сегодня" } },
  { front: { uz: "Bir kunda qaysi ikki son yoziladi?", ru: "Какие два числа записывают для одного дня?" }, back: { uz: "Nechta odam keldi va ulardan nechtasi qaytdi", ru: "Сколько человек пришло и сколько из них вернулось" } },
  { front: { uz: "Qaytganlar soni kelganlardan ko'p bo'ladimi?", ru: 'Может ли вернувшихся быть больше пришедших?' }, back: { uz: "Yo'q — ular shu kelganlar ichidan sanaladi", ru: "Нет — их считают среди этих же пришедших" } },
  { front: { uz: "Qaytish nimadan ko'rinadi?", ru: 'По чему видно возвращение?' }, back: { uz: "Ikki kunning yonma-yon turishidan; bitta kundan ko'rinmaydi", ru: 'По двум дням, стоящим рядом; по одному дню не видно' } },
  { front: { uz: "Hisobning 1-kunida qaytganlar nechta?", ru: "Сколько вернувшихся в 1-й день учёта?" }, back: { uz: "0 — hisobda undan oldingi kun yo'q", ru: "0 — в учёте нет дня раньше него" } },
  { front: { uz: "Ko'p odam kelishi ko'p odam qaytishini bildiradimi?", ru: "Если пришло много людей, значит ли это, что много вернулось?" }, back: { uz: "Yo'q — buni «Qaytdi» soni ko'rsatadi", ru: "Нет — это показывает число «Вернулись»" } },
  { front: { uz: "Duolingo'dagi olov belgili raqam nimani sanaydi?", ru: "Что считает число с иконкой огня в Duolingo?" }, back: { uz: "Ketma-ket dars qilingan kunlarni", ru: "Дни занятий подряд" } },
  { front: { uz: "Bir kun dars qilinmasa, bu raqam nima bo'ladi?", ru: "Что будет с этим числом, если один день не позаниматься?" }, back: { uz: "Noldan boshlanadi (o'sha kunga muzlatish qo'yilmagan bo'lsa)", ru: "Начнётся с нуля (если на этот день не стоит заморозка)" } },
  { front: { uz: "Uch kunlik hisobda nima yoziladi?", ru: "Что записывается в учёт за три дня?" }, back: { uz: "Har kun uchun: kun, kelganlar soni, qaytganlar soni", ru: "На каждый день: день, число пришедших, число вернувшихся" } },
  { front: { uz: "2-kunning qaytganlari qanday topiladi?", ru: "Как найти вернувшихся 2-го дня?" }, back: { uz: "2-kuni kelganlardan 1-kungi ro'yxatda ham borlari sanaladi", ru: "Считают тех из пришедших во 2-й день, кто есть и в списке 1-го дня" } },
];
const ScreenFlashcards = ({ screen, storedAnswer, onAnswer, onNext, onPrev }) => {
  useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, []); // eslint-disable-line
  return (
    <Stage eyebrow={tr({ uz: 'Takrorlash', ru: 'Повторение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Davom etish', ru: 'Продолжить' })} onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        {/* 99a: flashcard ekranida mentor YO'Q — sarlavha platforma etaloni */}
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>O'zingizni <span className="italic" style={{ color: T.accent }}>sinab ko'ring</span>.</>, ru: <><span className="italic" style={{ color: T.accent }}>Проверьте</span> себя.</> })}</h2></div>
        <div className="fc-center"><Flashcards cards={FLASHCARDS} /></div>
      </div>
    </Stage>
  );
};

const ScreenFinalTest = (props) => (
  <QuestionScreen {...props} eyebrow={tr({ uz: 'Yakuniy tekshiruv', ru: 'Итоговая проверка' })} scope="final"
    ctaLabel={tr({ uz: 'Javobni tanlang', ru: 'Выберите ответ' })} revealPrefix={tr({ uz: "To'g'ri javob", ru: 'Верный ответ' })}
    question={<TestQ ask={tr({ uz: 'Chorshanba kuni 15 odam keldi, ulardan 4 tasi seshanba ham kelgan edi. Hisobga nimani yozasiz?', ru: "В среду пришли 15 человек, 4 из них приходили и во вторник. Что вы запишете в учёт?" })} />}
    questionText={'Chorshanba kuni 15 odam keldi, ulardan 4 tasi seshanba ham kelgan edi. Hisobga nimani yozasiz?'}
    options={[tr({ uz: 'Chorshanba: keldi 15, qaytdi 11', ru: "Среда: пришли 15, вернулись 11" }), tr({ uz: 'Chorshanba: keldi 15, qaytdi 4', ru: 'Среда: пришли 15, вернулись 4' }), tr({ uz: 'Chorshanba: keldi 19, qaytdi 4', ru: "Среда: пришли 19, вернулись 4" })]}
    correctIdx={1}
    explainCorrect={tr({ uz: "«Qaytdi» katagiga faqat kecha ham kelganlar yoziladi: to'rt odam.", ru: 'В клетку «Вернулись» пишут только тех, кто приходил и вчера: четыре человека.' })}
    explainWrong={{
      0: tr({ uz: "11 — seshanba kelmaganlar; qaytganlar — seshanba ham kelgan 4 odam.", ru: "11 — те, кто не приходил во вторник; вернувшиеся — 4 человека, которые приходили и во вторник." }),
      2: tr({ uz: "4 odam shu 15 ning ichida — ularni qayta qo'shmaysiz.", ru: "4 человека уже входят в эти 15 — второй раз их не прибавляют." }),
      default: tr({ uz: "«Keldi» katagiga o'sha kuni kelganlar, «Qaytdi» katagiga kecha ham kelganlar yoziladi.", ru: "В клетку «Пришли» пишут пришедших в тот день, в клетку «Вернулись» — тех, кто приходил и вчера." })
    }}
  />
);
// ===== UYGA VAZIFA — alohida ekran EMAS, YAKUN sahifasi ichida (etalon: P0 · PmLesson2 · M4-D2) =====
const HW_KEY = 'pm-m5d11-hw-target';
const HW_VARIANT = [
  { k: 'toliq', t: { uz: "To'liq · ~20 daqiqa", ru: 'Полный · ~20 минут' } },
  { k: 'qisqa', t: { uz: 'Qisqa · ~10 daqiqa', ru: 'Короткий · ~10 минут' } },
];
const HW_STEPS = {
  toliq: [{ uz: "Har kuni botga kelgan odamlarning ismini bitta ro'yxatga yozing", ru: 'Каждый день записывайте имена пришедших к боту в один список' }, { uz: 'Ertasi kuni yangi ro\'yxat yozing va ikkalasida ham bor ismlarni belgilang', ru: 'На следующий день напишите новый список и отметьте имена, которые есть в обоих' }, { uz: "O'sha kunning qaytgan sonini yozib qo'ying", ru: 'Запишите число вернувшихся за этот день' }],
  qisqa: [{ uz: "Ikki kunning ro'yxatini yozing", ru: 'Напишите списки за два дня' }, { uz: 'Ikkalasida ham bor odamlarni belgilang', ru: 'Отметьте людей, которые есть в обоих' }, { uz: 'Sanang — o\'sha son ikkinchi kunning qaytgani', ru: 'Посчитайте — это число и есть вернувшиеся второго дня' }],
};
const readHwTarget = () => { try { return localStorage.getItem(HW_KEY) || ''; } catch { return ''; } };
// Uy-vazifa kapsulasi fonidagi xira so'z-tokenlar — darsning O'Z lug'ati (§114)
const HW_TOKENS = [
  { t: { uz: 'keldi', ru: 'пришли' },   l: 5,  tp: 16, s: 12, d: 6.5 },
  { t: { uz: 'qaytdi', ru: 'вернулись' },  l: 80, tp: 12, s: 11, d: 7.5 },
  { t: { uz: 'kun', ru: 'день' },     l: 12, tp: 70, s: 11, d: 8 },
  { t: { uz: 'odam', ru: 'человек' },    l: 64, tp: 76, s: 12, d: 6 },
  { t: { uz: 'hisob', ru: 'учёт' },   l: 86, tp: 52, s: 10, d: 9 },
];
const HwCard = ({ variant, onPick, innerRef }) => {
  const steps = HW_STEPS[variant] || HW_STEPS.toliq;
  const pickTurn = useTurnHint(!variant && !!onPick);
  return (
    <div className="card fade-step" ref={innerRef}>
      <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Uyda nima qilasiz?', ru: 'Что сделаете дома?' })}</div>
      {(
        <>
          <p className="body" style={{ margin: '0 0 10px', color: T.ink }}>{tr({ uz: "Uyda hisobni o'zingiz yuritasiz: har kuni botingizga kim kelganini yozib qo'yasiz, keyin ikki kunni yonma-yon qo'yib qaytganlarni topasiz. Qancha kun kuzatasiz — o'zingiz tanlaysiz.", ru: 'Дома вы ведёте учёт сами: каждый день записываете, кто пришёл к вашему боту, потом ставите два дня рядом и находите вернувшихся. Сколько дней наблюдать — выбираете сами.' })}</p>
          <div className="hw-chips">
            {HW_VARIANT.map((v, vi) => (
              <button key={v.k} className={`hw-chip ${variant === v.k ? 'on' : ''}${waveCls(pickTurn, vi, HW_VARIANT.length)}`} onClick={() => onPick(v.k)}>{tr(v.t)}</button>
            ))}
          </div>
        </>
      )}
      {variant ? (
        <div className="pmtask fade-step">
          <div className="pmtask-head"><span className="pmtask-tag">{tr({ uz: 'Topshiriq kartasi', ru: "Карточка задания" })}</span><span className="pmtask-id">{variant === 'qisqa' ? tr({ uz: 'QISQA', ru: 'КОРОТКИЙ' }) : tr({ uz: "TO'LIQ", ru: 'ПОЛНЫЙ' })}</span></div>
          <div className="pmtask-rows">
            <div className="pmtask-row"><span className="pmtask-k">{tr({ uz: 'Nechta', ru: 'Сколько' })}</span><span className="pmtask-v"><b>{variant === 'qisqa' ? tr({ uz: "ikki kunning ro'yxati + qaytgan soni", ru: 'списки за два дня + число вернувшихся' }) : tr({ uz: "har kunga ro'yxat + har kunning qaytgan soni", ru: 'список на каждый день + число вернувшихся за каждый день' })}</b></span></div>
            <div className="pmtask-row"><span className="pmtask-k">{tr({ uz: 'Muddat', ru: 'Срок' })}</span><span className="pmtask-v"><b>{tr({ uz: 'keyingi darsgacha', ru: 'до следующего урока' })}</b></span></div>
            <div className="pmtask-row"><span className="pmtask-k">{tr({ uz: 'Odam kam', ru: 'Мало людей' })}</span><span className="pmtask-v"><b>{tr({ uz: "botingizda odam kam bo'lsa — sinfdoshingiznikida", ru: 'если у вашего бота мало людей — у бота одноклассника' })}</b></span></div>
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
const ACHIEVEMENTS = {
  dayTwo:      { icon: '🗓', name: 'Day by Day',   desc: { uz: 'Kunlarni ochib, ikki sonni yonma-yon kuzatdingiz', ru: "Вы открыли дни и следили за двумя числами рядом" } },
  countKeeper: { icon: '🧮', name: 'Count Keeper', desc: { uz: 'Uch kunlik hisobingizni yozdingiz', ru: "Вы записали свой учёт за три дня" } },
  twoInARow:   { icon: '🔁', name: 'Two In A Row', desc: { uz: "To'rt qatorda qaytish kunlarini birinchi urinishda to'g'ri topdingiz", ru: "Вы с первой попытки верно нашли дни возвращения в четырёх строках" } },
  codeCounter: { icon: '🛠', name: 'Code Counter', desc: { uz: 'Qaytganlarni kod bilan sanadingiz', ru: 'Вы посчитали вернувшихся кодом' } },
};
const ACH_TRIGGERS = { s4: 'dayTwo', s8: 'countKeeper', s9: 'twoInARow', s10: 'codeCounter' };

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
    ? (once ? tr({ uz: 'Nishon birinchi urinish uchun edi.', ru: 'Значок был за первую попытку.' }) : tr({ uz: "Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.", ru: 'Значок был за первую попытку — теперь спокойно найдите верный ответ.' }))
    : tr({ uz: "Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.", ru: "Справитесь с первой попытки — значок ваш." })}</p>;
};
function AchCelebrate({ ach, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 4000); return () => clearTimeout(t); }, []); // eslint-disable-line
  return (
    <div className="acu-overlay" onClick={onDone} role="status" aria-label={tr({ uz: `Yangi nishon: ${ach.name}`, ru: `Новый значок: ${ach.name}` })}>
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
const Q_LABELS = { 3: { uz: '1 — Kim qaytgan', ru: '1 — Кто вернулся' }, 5: { uz: '2 — Ikki son', ru: "2 — Два числа" }, 7: { uz: "3 — Raqam qachon o'sadi", ru: '3 — Когда растёт число' }, 11: { uz: '4 — Yakuniy savol', ru: '4 — Итоговый вопрос' } };
const QUIZ_MS = 15000;
const QZ_BG_SHAPES = [
  { ch: { uz: 'keldi', ru: 'пришли' },   l: 5,  t: 10, s: 30, d: 19, dl: 0 },
  { ch: { uz: 'qaytdi', ru: 'вернулись' },  l: 85, t: 8,  s: 28, d: 23, dl: 1.5 },
  { ch: { uz: 'kun', ru: 'день' },     l: 8,  t: 72, s: 26, d: 27, dl: 0.8 },
  { ch: { uz: 'odam', ru: 'человек' },    l: 74, t: 68, s: 26, d: 21, dl: 2.2 },
  { ch: { uz: 'hisob', ru: 'учёт' },   l: 45, t: 86, s: 22, d: 25, dl: 1.1 },
  { ch: { uz: 'ustun', ru: 'столбец' },   l: 66, t: 26, s: 24, d: 17, dl: 0.4 },
  { ch: { uz: 'belgi', ru: 'метка' },   l: 26, t: 34, s: 26, d: 20, dl: 1.9 },
  { ch: { uz: 'obyekt', ru: "объект" },   l: 55, t: 5,  s: 20, d: 22, dl: 0.6 },
];
// ⚔️ CodeStrike — 12 savol · 3/3/3/3 · naqshsiz. darslik-jonli TASDIQLAYDI.
const QUIZ_BANK = [
  { q: { uz: "Qaytgan odam kim?", ru: "Кто такой вернувшийся?" }, opts: [{ uz: "Kecha ham, bugun ham kelgan odam", ru: "Тот, кто пришёл и вчера, и сегодня" }, { uz: "Bugun birinchi marta kelgan odam", ru: "Тот, кто сегодня пришёл впервые" }, { uz: "Kecha kelib, bugun kelmagan odam", ru: "Тот, кто пришёл вчера, а сегодня нет" }, { uz: "Bugun ikki marta kelgan odam", ru: "Тот, кто сегодня пришёл дважды" }], correct: 0 },
  { q: { uz: "Bir kunda qaysi ikki son yoziladi?", ru: "Какие два числа записывают для одного дня?" }, opts: [{ uz: "Kelganlar va e'lonlar soni", ru: 'Число пришедших и объявлений' }, { uz: "Qaytganlar va yozilgan so'zlar soni", ru: 'Число вернувшихся и написанных слов' }, { uz: "Kunlar va soatlar soni", ru: "Число дней и часов" }, { uz: "Kelganlar va qaytganlar soni", ru: "Число пришедших и вернувшихся" }], correct: 3 },
  { q: { uz: "Hisobning 1-kunida qaytganlar nechta?", ru: "Сколько вернувшихся в 1-й день учёта?" }, opts: [{ uz: "Shu kuni kelganlar soniga teng", ru: "Столько же, сколько пришло в этот день" }, { uz: "Oldingi kundan ko'chirib olinadi", ru: 'Переписывается с предыдущего дня' }, { uz: "0, chunki hisobda oldingi kun yo'q", ru: "0 — в учёте нет дня раньше" }, { uz: "Ertasi kuni kelganlar soniga teng", ru: "Столько же, сколько пришло на следующий день" }], correct: 2 },
  { q: { uz: "Nega qaytganlar soni o'sha kuni kelganlardan oshmaydi?", ru: "Почему вернувшихся не больше, чем пришедших в тот день?" }, opts: [{ uz: "Chunki bot kuniga bir marta sanaydi", ru: "Потому что бот считает раз в день" }, { uz: "Chunki qaytganlar shu kelganlar ichidan", ru: "Потому что вернувшиеся — из этих же пришедших" }, { uz: "Chunki kechagi ro'yxat o'chib ketadi", ru: "Потому что вчерашний список стирается" }, { uz: "Chunki e'lon faqat kelganlarni ko'taradi", ru: "Потому что объявление поднимает только пришедших" }], correct: 1 },
  { q: { uz: "Misoldagi e'lon qaysi sonni ko'tardi?", ru: "Какое число подняло объявление в примере?" }, opts: [{ uz: "Faqat qaytganlar sonini", ru: "Только число вернувшихся" }, { uz: "O'sha kuni kelganlar sonini", ru: 'Число пришедших в тот день' }, { uz: "Ikkala sonni bir xil ko'tardi", ru: "Оба числа одинаково" }, { uz: "Hech qaysi sonni ko'tarmadi", ru: "Ни одно число" }], correct: 1 },
  { q: { uz: "Bugun 10 odam keldi, 3 tasi kecha ham kelgan edi. Qaytganlar nechta?", ru: "Сегодня пришли 10 человек, 3 из них приходили и вчера. Сколько вернувшихся?" }, opts: [{ uz: "3 — ikkala kunda ham kelganlar", ru: "3 — пришедшие в оба дня" }, { uz: "10 — bugun kelganlarning hammasi", ru: '10 — все пришедшие сегодня' }, { uz: "7 — kecha kelmaganlar", ru: "7 — не приходившие вчера" }, { uz: "13 — ikki sonning yig'indisi", ru: "13 — сумма двух чисел" }], correct: 0 },
  { q: { uz: "Qaytganlarni bilish uchun nega bugun kelganlar soni yetmaydi?", ru: "Почему, чтобы узнать вернувшихся, мало числа пришедших сегодня?" }, opts: [{ uz: "Chunki bir kunda kelgan odam kam bo'ladi", ru: 'Потому что за один день приходит мало людей' }, { uz: "Chunki e'lon ikki kunda bir marta beriladi", ru: 'Потому что объявление дают раз в два дня' }, { uz: "Chunki bu son kechagi kunni ko'rsatmaydi", ru: "Потому что это число не показывает вчерашний день" }, { uz: "Chunki bu son faqat kechqurun sanaladi", ru: "Потому что это число считают только вечером" }], correct: 2 },
  { q: { uz: "Qaytish nimadan ko'rinadi?", ru: 'По чему видно возвращение?' }, opts: [{ uz: "Bitta kunning yakka katagiga qarashdan", ru: "По одной клетке одного дня" }, { uz: "Ikki kunda kelganlar sonining o'sishidan", ru: 'По росту числа пришедших за два дня' }, { uz: "Botga yozilgan xabarlar sonidan", ru: "По числу сообщений, написанных боту" }, { uz: "Kecha va bugungi ro'yxatni solishtirishdan", ru: 'По сравнению вчерашнего и сегодняшнего списков' }], correct: 3 },
  { q: { uz: "Duolingo'dagi olov belgili raqam nimani sanaydi?", ru: "Что считает число с иконкой огня в Duolingo?" }, opts: [{ uz: "Ketma-ket dars qilingan kunlarni", ru: "Дни занятий подряд" }, { uz: "Yodlangan so'zlarning umumiy sonini", ru: 'Общее число выученных слов' }, { uz: "Ilovada o'tkazilgan soatlarni", ru: 'Часы, проведённые в приложении' }, { uz: "Do'stlar bilan bo'lishilgan ballarni", ru: 'Баллы, которыми поделились с друзьями' }], correct: 0 },
  { q: { uz: "«Muzlatish» bo'lmasa, bir kun dars qilinmagach bu raqam nima bo'ladi?", ru: "Что будет с этим числом без «заморозки», если один день не позаниматься?" }, opts: [{ uz: "O'sha joyida turaveradi", ru: 'Останется на месте' }, { uz: "Bir kunga orqaga suriladi", ru: "Сдвинется на день назад" }, { uz: "Yana noldan boshlanadi", ru: "Снова начнётся с нуля" }, { uz: "Sekinroq o'sishda davom etadi", ru: 'Продолжит расти медленнее' }], correct: 2 },
  { q: { uz: "Odam 1, 3 va 5-kunlari kelgan. Nechta qaytish kuni bor?", ru: "Человек приходил в 1-й, 3-й и 5-й дни. Сколько дней возвращения?" }, opts: [{ uz: "Uchta — uch kunda ham kelgani uchun", ru: "Три — потому что пришёл во все три дня" }, { uz: "Birortasi ham yo'q — oldingi kun har safar bo'sh", ru: "Ни одного — предыдущий день каждый раз пуст" }, { uz: "Ikkita — 3-kun va 5-kun qaytish kuni", ru: "Два — 3-й и 5-й дни возвращения" }, { uz: "Bittasi — 5-kunning oldingi kuni to'lgan", ru: 'Один — день перед 5-м заполнен' }], correct: 1 },
  { q: { uz: "Darsda o'z botingizning uch kunlik hisobini kim yozdi?", ru: "Кто на уроке записал учёт вашего бота за три дня?" }, opts: [{ uz: "Bot o'zi sanab yozib bordi", ru: "Бот сам считал и записывал" }, { uz: "Mentor siz uchun yozib berdi", ru: "Ментор записал за вас" }, { uz: "Telegram o'zi hisoblab berdi", ru: "Telegram сам посчитал" }, { uz: "O'zingiz sonlarni kiritib yozdingiz", ru: "Вы сами вписали числа" }], correct: 3 },
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

// ===== ⚔️ CODESTRIKE ARENA — arena zonasi: 100+ =====
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
    const TOK = [tr({ uz: 'keldi', ru: 'пришли' }), tr({ uz: 'qaytdi', ru: 'вернулись' }), tr({ uz: 'kun', ru: 'день' }), tr({ uz: 'odam', ru: 'человек' }), tr({ uz: 'hisob', ru: 'учёт' }), tr({ uz: 'ustun', ru: 'столбец' }), tr({ uz: 'belgi', ru: 'метка' }), tr({ uz: 'obyekt', ru: "объект" })];
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
        <div className="head"><h2 className="title h-title fade-up">{isLive ? tr({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>g'oliblarimiz</span></>, ru: <>Наши сегодняшние <span className="italic" style={{ color: T.accent }}>победители</span></> }) : tr({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>natijangiz</span></>, ru: <>Ваш сегодняшний <span className="italic" style={{ color: T.accent }}>результат</span></> })}</h2></div>
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
              <div className="pod-card-note"><span className="pcn-ic" aria-hidden="true">💡</span><p className="body">{tr({ uz: 'Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruh reytingi va 🥇🥈🥉 eng yaxshi uchtalik (podium) chiqadi.', ru: 'Это ваш личный результат. На живом уроке здесь появится рейтинг всей группы и тройка лучших 🥇🥈🥉 (подиум).' })}</p></div>
            </div>
          </div>
        ) : !loaded ? (
          <p className="mono small fade-up" style={{ color: T.ink2 }}>{tr({ uz: 'Natijalar kelmoqda…', ru: 'Результаты загружаются…' })}</p>
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
// Tuzilma etalondan (P0 PmUserStory · PmLesson2 · PmLesson4 · M3-D10 · M4c-D2):
// hero (h-sub YO'Q) -> CodeStrike -> «Endi siz bilasiz» -> uy-vazifa kapsulasi -> nishonlar.
const ScreenSummary = ({ screen, answers, achievements, onReset, onPrev, onFinish }) => {
  const _gate = useContext(LiveGateCtx) || {};
  const live = _gate.live;
  const isMentorL = !!(live && live.mode === 'mentor');
  const correct = SCORED_IDX.filter(i => answers[i]?.correct).length;
  const total = SCORED_IDX.length;
  const RECAP = [
    { uz: 'Kecha kelgan odam bugun ham kelsa — u bugun qaytgan odam.', ru: "Если человек приходил вчера и пришёл сегодня — сегодня он вернувшийся." },
    { uz: 'Har kunda ikki son bor: nechta odam keldi va ulardan nechtasi qaytdi.', ru: "В каждом дне два числа: сколько человек пришло и сколько из них вернулось." },
    { uz: "Ko'p odam kelgani — ko'p odam qaytgani degani emas: ikki sonni birga o'qing.", ru: "Много пришедших — ещё не значит много вернувшихся: читайте два числа вместе." },
    { uz: "Qaytish ikki kunning yonma-yon turishidan ko'rinadi — bitta kundan emas.", ru: 'Возвращение видно по двум дням, стоящим рядом, — не по одному дню.' },
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
  // 77-qonun: kapsula ochilganda topshiriq-karta ko'rinishga olib kelinadi — aks holda
  // yakun-sahifasi skroll qiladi va karta ekran ostida qolib ketadi.
  const hwRef = useRef(null);
  useEffect(() => {
    if (!hwOpen) return;
    const kam = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const t = setTimeout(() => { if (hwRef.current) hwRef.current.scrollIntoView({ behavior: kam ? 'auto' : 'smooth', block: 'start' }); }, 260);
    return () => clearTimeout(t);
  }, [hwOpen]);
  const [charge, setCharge] = useState(false);
  const fireHw = () => { if (charge || hwOpen) return; setCharge(true); setTimeout(() => { setHwOpen(true); setCharge(false); }, 500); };
  const recapCard = (
    <div className="card fade-up d3">
      <div className="card-lbl" style={{ color: T.success }}><span className="tick" style={{ width: 16, height: 16, borderRadius: '50%', background: T.success, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</span> {tr({ uz: 'Endi siz bilasiz', ru: 'Теперь вы знаете' })}</div>
      <ul className="recap">{RECAP.map((r, i) => (<li key={i} style={{ animationDelay: `${0.3 + i * 0.07}s` }}><span className="ck">✓</span><span>{tr(r)}</span></li>))}</ul>
    </div>
  );
  return (
    <Stage eyebrow={tr({ uz: 'Dars yakuni', ru: 'Итог урока' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><button className="btn-ghost" onClick={onReset} style={{ padding: 'clamp(11px,1.6vw,13px) clamp(16px,2.2vw,22px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Qaytadan', ru: 'Заново' })}</button><button className="btn-white-accent" onClick={onFinish} style={{ marginLeft: 'auto', padding: 'clamp(11px,1.6vw,13px) clamp(22px,2.6vw,30px)', fontSize: 'clamp(13px,1.5vw,15px)' }}>{tr({ uz: 'Yakunlash ✓', ru: 'Завершить ✓' })}</button></>}>
      <div className="screen s-fin" style={{ gap: 'clamp(10px,1.6vw,16px)' }}>
        <div className="hero">
          <div className="hero-l">
            <span className="done-chip fade-up"><span className="tick">✓</span> {tr({ uz: 'Dars tugadi', ru: 'Урок завершён' })}</span>
            <h2 className="title h-title fade-up d1">{tr({ uz: <>Uch kunlik <span className="italic" style={{ color: T.accent }}>hisobingiz</span> yozildi.</>, ru: <>Ваш <span className="italic" style={{ color: T.accent }}>учёт</span> за три дня записан.</> })}</h2>
          </div>
          {!isMentorL && <ScoreRing correct={correct} total={total} />}
        </div>
        <div className={`qz-cta cs-cta fade-up d2 ${studentLive ? 'ready' : ''}`}>
          <CsWordmark liveOn={studentLive} disabled={studentWait} onClick={studentWait ? undefined : openArena} hint={studentWait ? tr({ uz: 'Mentorni kuting', ru: "Дождитесь ментора" }) : undefined} />
        </div>
        {arena && <QuizArena live={live || { mode: 'self' }} startSolo={arenaSolo} onClose={() => setArena(false)} />}
        {/* «Endi siz bilasiz» va nishonlar yonma-yon (58-qonun): yakun-sahifasi bir ko'z bilan ko'rinadi. */}
        {isMentorL ? recapCard : (
          <div className="split sum2">
            {recapCard}
            <div className="card ach-coll fade-up d4">
              <div className="card-lbl" style={{ color: T.accent }}>{tr({ uz: 'Nishonlaringiz', ru: "Ваши значки" })} — {(achievements ? achievements.size : 0)}/{Object.keys(ACHIEVEMENTS).length}</div>
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
        {/* A9: «Keyingi dars» — App.jsx m5-12 (Zaxira dars) va m5-13 (Demo Day) bilan mos */}
        <p className="next-lesson fade-up d4">{tr({ uz: <>Keyingi dars — <b>Zaxira dars</b>: ulgurmagan ishni tugatasiz va botingizni sayqallaysiz. Undan keyin — <b>Demo Day</b>: botingizni jonli ko'rsatasiz va uning raqamlarini aytasiz. Uch kunlik hisobingizni saqlang — o'sha kuni kerak bo'ladi.</>, ru: <>Следующий урок — <b>Резервный урок</b>: доделаете то, что не успели, и отшлифуете бота. После него — <b>Demo Day</b>: покажете бота вживую и назовёте его числа. Сохраните свой учёт за три дня — он понадобится в тот день.</> })}</p>
        {hwOpen && <HwCard variant={hwVariant} onPick={pickHw} innerRef={hwRef} />}
        <MentorNote>{tr({ uz: "Arena tugagach g'oliblarni nomlab tabriklang. Uy-vazifa: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa variant. Muddat — keyingi darsgacha. Tekshirishda bitta savolga qarang: har kunning qaytgan soni ikki ro'yxatni solishtirib topilganmi?", ru: 'Когда арена закончится, назовите победителей и поздравьте. Домашнее задание: тем, кто закончил код в классе, — полный вариант, кто не успел — короткий. Срок — до следующего урока. При проверке смотрите на один вопрос: число вернувшихся за каждый день найдено сравнением двух списков?' })}</MentorNote>
      </div>
    </Stage>
  );
};
// ============================================================ CSS
const CSS_BASE = `
  html, body { margin: 0; padding: 0; }
  .lesson-root, .lesson-root * { box-sizing: border-box; }
  .lesson-root { font-family: 'Manrope', system-ui, sans-serif; color: ${T.ink}; background: ${T.bg}; zoom: var(--lz, 1); height: calc(100dvh / var(--lz, 1)); overflow: hidden; -webkit-font-smoothing: antialiased; font-feature-settings: "ss01","cv11"; }
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
  /* 27-qonun: to'g'ri variant shart-qatori kabi «joyiga o'tiradi» — dars mexanikasining sadosi. */
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
  .split { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: clamp(16px,2.6vw,30px); align-items: start; }
  .split.sum2 { gap: clamp(12px,2vw,22px); }
  .split.sum2 .ach-grid { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 860px) { .split.sum2 { grid-template-columns: 1fr; } }
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
  /* F-1002-73: natija — bitta karta. Ball-halqasi karta chetida, markazda; ichida och fonli nishonlar bo'limi
     (olingan nishon — katakda, nomi bilan, bir marta «pop»; olinmagani — kulrang qulf) va 💡 belgili izoh. */
  .pod-card { position: relative; width: 100%; max-width: 480px; margin-top: 70px; background: ${T.paper}; border-radius: 20px; padding: 0 clamp(14px,2.4vw,20px) clamp(14px,2.4vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 16px 34px -20px rgba(${T.shadowBase},0.35); }
  .pod-card-ring { height: 64px; display: flex; justify-content: center; }
  .screen:has(.pod-card) .head { text-align: center; } /* sarlavha karta bilan bir o'qda */
  .pod-card .ring-wrap { width: 128px; height: 128px; position: relative; top: -64px; background: ${T.paper}; border-radius: 50%; box-shadow: 0 0 0 6px ${T.accentSoft}; }
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
// Dars-vizuallari: kunlar kalendari (imzo-vizual), kun-kataklari, yozish-kartasi, keys-slaydlari.
const CSS_LESSON = `
  /* HOOK — ikki tanlov bitta qatorda (104-qonun: teng og'irlik, teng kenglik) */
  .hrow { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: clamp(8px,1.4vw,14px); }
  .hrow.two { max-width: 720px; align-self: center; width: 100%; }
  .hopt { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 7px; background: ${T.paper}; border: none; border-radius: 15px; padding: clamp(14px,2vw,20px) clamp(10px,1.6vw,16px); cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 8px 20px -9px rgba(${T.shadowBase},0.22); transition: transform 0.16s, box-shadow 0.16s; min-width: 0; }
  .hopt:hover:not(:disabled):not(.on) { transform: translateY(-3px); box-shadow: 0 14px 26px -9px rgba(${T.shadowBase},0.3); }
  .hopt:disabled { cursor: default; }
  .hopt.on { box-shadow: inset 0 0 0 2px ${T.ink}, 0 12px 26px -9px rgba(${T.shadowBase},0.3); background: ${T.paper}; } /* U1: hook tanlovi ballsiz — neytral to'q ramka */
  .hopt-ic { font-size: clamp(24px,3.4vw,32px); line-height: 1; color: ${T.ink}; } /* F-0926-05 #23: disabled-tugma rangi (rgba 0.3) emojini xiralashtirmasin */
  .hopt-nom { font-weight: 700; font-size: clamp(12.5px,1.5vw,14.5px); color: ${T.ink}; line-height: 1.3; overflow-wrap: anywhere; }
  @media (max-width: 560px) { .hrow.two { grid-template-columns: minmax(0,1fr); } }
  .hvote { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,18px); box-shadow: 0 8px 22px -10px rgba(${T.shadowBase},0.18); }
  .hvote-row { display: flex; align-items: center; gap: 10px; }
  .hvote-lbl { flex: 0 0 clamp(120px,26vw,230px); font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hvote-row.mine .hvote-lbl { color: ${T.accent}; }
  .hvote-track { flex: 1; height: 12px; border-radius: 99px; background: ${T.bg}; overflow: hidden; }
  .hvote-fill { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${T.accentVivid}, ${T.accent}); transition: width 0.6s cubic-bezier(.2,.7,.2,1); }
  .hvote-row.top .hvote-fill { background: ${T.ink2}; } /* A-12.1: yashil faqat qaytish — eng ko'p ovoz neytral rangda */
  /* Yalang'och son yorliqsiz turmasin: sanoq odam-belgisi bilan bitta kapsulada —
     «%» ishlatilmaydi (8-A taqiq-jadvali), lekin son nimani sanayotgani ko'rinib turadi. */
  .hvote-pct { display: inline-flex; align-items: center; justify-content: center; gap: 5px; min-width: 46px; font-size: 12.5px; font-weight: 800; color: ${T.ink2}; background: ${T.bg}; border-radius: 99px; padding: 4px 10px; font-variant-numeric: tabular-nums; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .hvote-pct::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .hvote-row.mine .hvote-pct { color: ${T.accent}; background: ${T.accentSoft}; box-shadow: inset 0 0 0 1.5px ${T.accent}44; }
  .hvote-row.top .hvote-pct { color: ${T.ink}; box-shadow: inset 0 0 0 1.5px ${T.ink2}55; }
  @media (prefers-reduced-motion: reduce) { .hopt, .hvote-fill { transition: none; } }
  /* Hook ustuni bitta enda turadi: tanlovlar → javob (720px) */
  .h0end { max-width: 720px; align-self: center; width: 100%; display: flex; flex-direction: column; align-items: stretch; gap: 10px; }
  /* IMZO-SAHNA (MD v2) — «ikki kun yonma-yon»: bugungi 3 belgidan kechagi o'sha odamga chiziq
     BIR MARTA chiziladi (~1 s), keyin bugungi belgi yashil bo'ladi. Cheksiz takror yo'q. */
  .h0scene { align-self: center; display: flex; flex-direction: column; align-items: center; gap: 4px; margin-top: 4px; }
  .h0svg { display: block; overflow: visible; }
  .h0d { fill: ${T.paper}; stroke: ${T.accent}; stroke-width: 1.5; }
  .h0d.hit { animation: h0-fill 0.35s ease-out forwards; animation-delay: calc(var(--hd, 0s) + 0.45s); }
  @keyframes h0-fill { to { fill: ${T.success}; stroke: ${T.success}; } }
  .h0ln { stroke: ${T.success}; stroke-width: 1.5; stroke-linecap: round; opacity: 0.8; stroke-dasharray: 120; stroke-dashoffset: 120; animation: h0-draw 0.55s ease-out forwards; animation-delay: var(--hd, 0s); }
  @keyframes h0-draw { to { stroke-dashoffset: 0; } }
  .h0lbl { display: flex; justify-content: space-between; width: 150px; }
  .h0lbl span { width: 40px; text-align: center; font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink3}; }
  @media (prefers-reduced-motion: reduce) {
    .h0d.hit { animation: none; fill: ${T.success}; stroke: ${T.success}; }
    .h0ln { animation: none; stroke-dashoffset: 0; }
  }
  /* N20: rasm qat'iy 150px — telefonda ham ikki ustun yonma-yon, shuning uchun chiziq ko'rsatiladi */

  /* MAQSAD (s1) — uch kunlik hisob jadvali: hammasi birdan (MD v2, animatsiya olindi) */
  .s1demo { display: flex; flex-direction: column; gap: 9px; background: ${T.paper}; border-radius: 18px; padding: clamp(13px,2vw,18px) clamp(15px,2.4vw,22px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; max-width: 680px; align-self: center; width: 100%; }
  .s1demo-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.5vw,13.5px); color: ${T.accent}; }
  .s1tab { display: grid; grid-template-columns: clamp(66px,11vw,104px) minmax(0,1fr) minmax(0,1fr); gap: 6px; align-items: center; }
  .s1th { font-family: 'Manrope'; font-weight: 800; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.ink3}; min-width: 0; overflow-wrap: anywhere; }
  .s1cell { background: ${T.bg}; border-radius: 10px; padding: 8px 12px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; min-width: 0; overflow-wrap: anywhere; }
  .s1cell.q { text-align: center; font-weight: 800; color: ${T.accent}; background: ${T.accentSoft}; }

  /* TEORIYA-1 (s2): ikki karta — bosilsa ochiladi/yopiladi (46-qonun · akkordeon) */
  .dfc-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: clamp(10px,1.8vw,16px); }
  @media (max-width: 700px) { .dfc-grid { grid-template-columns: 1fr; } }
  .dfc { display: flex; flex-direction: column; gap: 9px; text-align: left; background: ${T.paper}; border: none; border-radius: 16px; padding: clamp(13px,2vw,18px); cursor: pointer; box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; transition: transform 0.16s, box-shadow 0.16s; min-width: 0; }
  .dfc:hover { transform: translateY(-2px); box-shadow: 0 14px 26px -9px rgba(${T.shadowBase},0.3), inset 0 0 0 1.5px ${T.accent}44; }
  .dfc:active { transform: translateY(0); }
  .dfc.open { box-shadow: inset 0 0 0 1.5px ${T.accent}66, 0 12px 26px -14px rgba(91,61,230,0.3); }
  .dfc-top { display: flex; align-items: center; gap: 9px; }
  .dfc-ic { font-size: clamp(20px,2.8vw,26px); line-height: 1; }
  .dfc-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.ink}; overflow-wrap: anywhere; min-width: 0; }
  /* U1: ochiladigan kartada doimiy belgi — yopiq «›», ko'rilgach «✓» (telefonda hover yo'q) */
  .dfc-mk { margin-left: auto; flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 15px; line-height: 1; color: ${T.accent}; background: ${T.accentSoft}; }
  .dfc-mk.ok { color: #fff; background: ${T.ink2}; font-size: 12px; }
  .dfc-b { font-family: 'Manrope'; font-weight: 600; font-size: clamp(13px,1.6vw,14.5px); line-height: 1.5; color: ${T.ink2}; background: ${T.bg}; border-radius: 11px; padding: 9px 12px; min-height: 44px; display: flex; align-items: center; overflow-wrap: anywhere; min-width: 0; transition: background 0.2s, color 0.2s; }
  .dfc:not(.open) .dfc-b { justify-content: center; color: ${T.ink3}; letter-spacing: 0.34em; }
  .dfc.open .dfc-b { color: ${T.ink}; background: ${T.accentSoft}; animation: fade-step 0.28s ease-out; }
  @media (prefers-reduced-motion: reduce) { .dfc, .dfc:hover { transition: none; transform: none; } .dfc.open .dfc-b { animation: none; } }
  @media (min-width: 861px) {
    .screen > .dfc-grid { flex-grow: 1; max-height: 318px; }
    .screen > .dfc-grid .dfc { justify-content: center; gap: 14px; }
    .screen > .dfc-grid .dfc-b { min-height: 78px; }
  }

  /* IMZO-VIZUAL (s4): BOTINGIZNING KUNLARI — kunlar ustun, odamlar belgi.
     Rang-qonuni: qaytgan odam belgisi — success (bu chindan yutuq); qaytmagani —
     accent kontur; past qaytish qizil bo'yalmaydi (bu xato ham, nosozlik ham emas). */
  .kln { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border-radius: 20px; padding: clamp(11px,1.8vw,16px); box-shadow: 0 18px 38px -18px rgba(${T.shadowBase},0.32), inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .kln-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
  .kln-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.7vw,15.5px); color: ${T.ink}; }
  .kln-n { font-weight: 800; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 3px 11px; }
  .kln-grid { display: grid; grid-template-columns: clamp(76px,12vw,116px) repeat(5, minmax(0,1fr)); gap: 6px 12px; align-items: center; }
  .kln-rl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(11px,1.35vw,12.5px); color: ${T.ink2}; text-align: right; padding-right: 4px; min-width: 0; overflow-wrap: anywhere; }
  .kln-rl.empty { min-height: 1px; }
  .kln-day { text-align: center; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 10.5px; color: ${T.ink3}; background: ${T.bg}; border-radius: 8px; padding: 4px 2px; }
  .kln-day.on { color: ${T.accent}; background: ${T.accentSoft}; }
  /* Belgilar-ustuni: align-self stretch — 23 belgili kun ham, 6 belgili kun ham AYNAN bir
     balandlikda turadi (qator balandligini eng to'lasi belgilaydi, ustunlar teng qoladi). */
  .kln-marks { position: relative; display: flex; flex-wrap: wrap; gap: 3px; justify-content: flex-start; align-content: flex-start; align-self: stretch; min-height: 54px; background: ${T.bg}; border-radius: 10px; padding: 6px 5px; box-shadow: inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  /* MD v2 s4: birinchi yashil belgidan kechagi ustunga ingichka chiziq — bir marta, 0.8 s.
     Chiziq faqat ikki ustun orasidagi ko'prik: chap uchi kechagi ustunning o'ng chetida (ichki
     bo'shliqda), o'ng uchi birinchi belgining chap chetida — hech bir belgining ustidan o'tmaydi.
     Uzunligi = ichki bo'shliq 5px + ustunlar oralig'i + 3px. Z-index 0: belgilar (1) doim ustida. */
  .kln-ln { position: absolute; z-index: 0; top: 10px; right: calc(100% - 5px); width: 20px; height: 2px; border-radius: 2px; background: ${T.success}; transform-origin: right center; animation: kln-ln 0.8s ease-out both; pointer-events: none; }
  @keyframes kln-ln { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  .kln-marks.on { box-shadow: inset 0 0 0 1.5px ${T.accent}33; }
  /* §135 rang-ko'rlik: ikki belgi RANGDAN TASHQARI to'lganligi bilan ham farq qiladi —
     birinchi marta kelgan = ichi bo'sh kontur (2px halqa), kecha ham kelgan = to'la bo'yalgan.
     Kul-rang ekranda ham ikkisi ajralib turadi (legendadagi CSS katakcha bilan bir xil). */
  .kln-mark { position: relative; z-index: 1; width: 10px; height: 10px; border-radius: 3px; background: ${T.paper}; box-shadow: inset 0 0 0 2px ${T.accent}; animation: kln-in 0.3s ease-out both; animation-delay: var(--md, 0s); transition: opacity 0.18s ease; }
  /* §134 rang-kaliti TIRIK: chip ustiga kelinsa o'sha rangdagi belgilar ajralib chiqadi */
  .kln:has(.kln-chip.qay:hover) .kln-mark:not(.qay) { opacity: 0.18; }
  .kln:has(.kln-chip.yangi:hover) .kln-mark.qay { opacity: 0.18; }
  .kln-mark.qay { background: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
  @keyframes kln-in { from { opacity: 0; } to { opacity: 1; } }
  .kln-wait { font-style: normal; color: ${T.ink3}; font-weight: 800; }
  .kln-cell { text-align: center; font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.6vw,15px); color: ${T.ink3}; background: ${T.bg}; border-radius: 9px; padding: 5px 3px; font-variant-numeric: tabular-nums; }
  .kln-cell.on { color: ${T.ink}; }
  .kln-cell.qay.on { color: ${T.success}; background: ${T.successSoft}; }
  /* §134 rang-legendasi: sarlavha qatorida, belgilarning O'ZI bilan bir xil rangda —
     yashil chip = yashil belgi, oq chip = indigo konturli belgi (bola kalitni sanashdan
     OLDIN o'qiydi). Chip hech qachon bukilmaydi va yashirilmaydi. */
  .kln-leg { display: flex; gap: 8px; flex-wrap: wrap; margin-left: auto; }
  .kln-chip { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 800; font-size: 12px; line-height: 1; white-space: nowrap; color: ${T.ink2}; background: ${T.paper}; border-radius: 99px; padding: 5px 12px; box-shadow: inset 0 0 0 1.5px ${T.accent}55; min-width: 0; }
  .kln-chip.qay { color: ${T.success}; background: ${T.successSoft}; box-shadow: inset 0 0 0 1.5px ${T.success}66; }
  .kln-sw { flex-shrink: 0; width: 10px; height: 10px; border-radius: 3px; background: ${T.paper}; box-shadow: inset 0 0 0 2px ${T.accent}; }
  .kln-sw.qay { background: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
  @media (prefers-reduced-motion: reduce) { .kln-mark, .kln-ln { animation: none; transition: none; } }
  /* Telefonda ham kunlar yonma-yon (jadval) — N20: ustunlar ustma-ust tushmaydi, chiziq qoladi */
  @media (max-width: 760px) { .kln-grid { grid-template-columns: clamp(58px,16vw,84px) repeat(5, minmax(0,1fr)); gap: 4px 8px; } .kln-rl { font-size: 10px; } .kln-ln { width: 16px; } }

  /* Boshqaruv (72-qonun): yorliqli tugma + diqqat-belgisi; birinchi bosishdan keyin belgi tinadi */
  .ctl { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,1.9vw,16px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .ctl-btn { font-family: 'Manrope'; font-weight: 800; font-size: clamp(14px,1.8vw,16px); cursor: pointer; border: none; border-radius: 12px; padding: 12px 22px; background: linear-gradient(135deg, ${T.accent}, ${T.accentVivid}); color: #fff; box-shadow: 0 10px 24px -8px rgba(91,61,230,0.5); animation: ctl-pulse 1.7s ease-in-out infinite; transition: transform 0.15s; max-width: 100%; min-width: 0; overflow-wrap: anywhere; }
  .ctl-btn:hover:not(:disabled) { transform: translateY(-2px); }
  .ctl-btn.calm { animation: none; }
  .ctl-btn:disabled { opacity: 0.5; cursor: default; animation: none; box-shadow: none; }
  @keyframes ctl-pulse { 0%, 100% { box-shadow: 0 10px 24px -8px rgba(91,61,230,0.5), 0 0 0 0 rgba(110,75,255,0.45); } 50% { box-shadow: 0 12px 28px -8px rgba(91,61,230,0.6), 0 0 0 12px rgba(110,75,255,0); } }
  .ctl-sub { font-family: 'Manrope'; font-weight: 600; font-size: 12px; line-height: 1.4; color: ${T.ink3}; min-width: 0; overflow-wrap: anywhere; }
  @media (prefers-reduced-motion: reduce) { .ctl-btn { animation: none; transition: none; } .ctl-btn:hover:not(:disabled) { transform: none; } }
  /* Kun ochilganda chiqadigan fakt-qatorlari — har son ustundagi belgilar bilan bir xil (§95) */
  .fakt { display: flex; flex-direction: column; gap: 6px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,1.9vw,16px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .fakt-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.accent}; min-width: 0; overflow-wrap: anywhere; }
  .fakt-row { display: flex; align-items: baseline; gap: 8px; background: ${T.bg}; border-radius: 10px; padding: 6px 10px; min-width: 0; }
  .fakt-row b { flex-shrink: 0; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 10.5px; color: ${T.accent}; }
  .fakt-row i { font-style: normal; font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; line-height: 1.4; color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; }
  /* Ochilmagan kunning joyi (bezak): punktir qator — hali yozilmagani ko'rinib turadi */
  /* MOBIL (s4): natija-paneli tepaga chiqadi — bosish va o'zgarish bir ko'rish maydonida qoladi */
  @media (max-width: 860px) {
    .split.s4 > .col:last-child { display: contents; }
    .split.s4 .fakt { order: -1; }
  }

  /* TEKSHIRUV (s9): to'rt odam, besh kun — qaytish kunlarini belgilash */
  .mrk { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border-radius: 20px; padding: clamp(11px,1.8vw,16px); box-shadow: 0 18px 38px -18px rgba(${T.shadowBase},0.32), inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .mrk-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
  .mrk-t { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13px,1.7vw,15.5px); color: ${T.ink}; }
  .mrk-n { font-weight: 800; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 3px 11px; }
  .mrk-grid { --mg: clamp(14px,1.6vw,18px); display: grid; grid-template-columns: clamp(88px,14vw,136px) repeat(5, minmax(0,92px)); justify-content: center; gap: 6px var(--mg); align-items: center; align-content: center; flex-grow: 1; }
  /* §134 · A-12.1 kaliti: to'lgan katak = kelgan kun (oq, binafsha ramka) · qalin ramka = siz belgilagan · yashil = qaytish kuni */
  .mrk-leg { display: flex; gap: 8px; flex-wrap: wrap; margin-left: auto; }
  .mrk-key { display: inline-flex; align-items: center; gap: 6px; font-family: 'Manrope'; font-weight: 800; font-size: 12px; line-height: 1; white-space: nowrap; color: ${T.ink2}; border-radius: 99px; padding: 5px 4px; min-width: 0; }
  .mrk-sw { flex-shrink: 0; width: 12px; height: 12px; border-radius: 4px; background: rgba(91,61,230,0.14); box-shadow: inset 0 0 0 1.5px ${T.accent}aa; }
  .mrk-sw.belgi { background: rgba(91,61,230,0.32); box-shadow: inset 0 0 0 3px ${T.accent}; }
  .mrk-sw.kalit { background: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}; }
  .mrk-rl { font-family: 'Manrope'; font-weight: 700; font-size: clamp(11.5px,1.4vw,13px); color: ${T.ink2}; text-align: right; padding-right: 6px; min-width: 0; overflow-wrap: anywhere; }
  .mrk-rl.cur { color: ${T.accent}; font-weight: 800; }
  .mrk-rl.empty { min-height: 1px; }
  /* Katak o'lchami: kun-sarlavhasi va katak AYNAN bir kenglikda, ustunda markazda —
     to'r cho'zilgan tasma emas, barmoq tegadigan kvadratchaga yaqin katak bo'lib turadi. */
  .mrk-day, .mrk-cell { width: 100%; max-width: 92px; margin: 0 auto; }
  .mrk-day { text-align: center; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; font-size: 10.5px; color: ${T.ink3}; background: ${T.bg}; border-radius: 8px; padding: 4px 2px; }
  /* Bo'sh katak (odam kelmagan kun) — fonsiz, ingichka kulrang ramka */
  .mrk-cell { position: relative; display: flex; align-items: center; justify-content: center; min-height: 42px; border: none; border-radius: 12px; background: transparent; box-shadow: inset 0 0 0 1px ${T.ink3}66; font-size: 17px; line-height: 1; cursor: default; transition: box-shadow 0.16s, background 0.16s, transform 0.14s; min-width: 0; }
  /* A-12.1: kelgan kun — TO'LGAN katak: och binafsha fon + binafsha ramka (bo'sh katakdan
     to'laligi bilan ajraladi); yashil faqat .kalit. 6-ekrandagi to'lgan kun bilan bir xil. */
  .mrk-cell.tolgan { background: rgba(91,61,230,0.14); box-shadow: inset 0 0 0 1.5px ${T.accent}aa; }
  .mrk-cell.tolgan.cur:not(:disabled) { cursor: pointer; }
  .mrk-cell.tolgan.cur:not(:disabled):hover { transform: translateY(-2px); box-shadow: inset 0 0 0 2px ${T.accent}; }
  .mrk-cell.belgi { background: rgba(91,61,230,0.32); box-shadow: inset 0 0 0 3px ${T.accent}; }
  .mrk-cell.kalit { background: ${T.success}; box-shadow: inset 0 0 0 2px ${T.success}; }
  /* MD v2 s9: chap katakdan qaytish kuniga qisqa strelka — «chap yonidagi kun» mezoni (0.6 s, bir marta).
     Strelka asosan kataklar ORASIDAGI bo'shliqda: dumi chap katakka 8px kiradi, uchi shu katak
     chetiga tegadi. Oq kontur — chap katak ham yashil bo'lsa (ketma-ket qaytish) strelka ko'rinadi. */
  .mrk-ar { position: absolute; top: 50%; right: calc(100% + 6px); width: calc(var(--mg) + 2px); height: 2px; margin-top: -1px; background: ${T.success}; border-radius: 2px; transform-origin: left center; animation: mrk-ar 0.6s ease-out both; pointer-events: none; z-index: 1; filter: drop-shadow(1.5px 0 0 ${T.paper}) drop-shadow(-1.5px 0 0 ${T.paper}) drop-shadow(0 1.5px 0 ${T.paper}) drop-shadow(0 -1.5px 0 ${T.paper}); }
  .mrk-ar::after { content: ''; position: absolute; right: -7px; top: -4px; border-left: 7px solid ${T.success}; border-top: 5px solid transparent; border-bottom: 5px solid transparent; }
  @keyframes mrk-ar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  .mrk-go { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  @media (prefers-reduced-motion: reduce) { .mrk-cell, .mrk-cell.tolgan.cur:not(:disabled):hover { transition: none; transform: none; } .mrk-ar { animation: none; } }
  /* Telefonda ham kataklar yonma-yon (jadval) — N20: ustma-ust tushmaydi, strelka qoladi */
  @media (max-width: 760px) { .mrk-grid { --mg: 8px; grid-template-columns: clamp(64px,18vw,96px) repeat(5, minmax(0,1fr)); gap: 4px var(--mg); } .mrk-day, .mrk-cell { max-width: 62px; } .mrk-cell { min-height: 40px; } .mrk-grid { justify-content: stretch; } }

  /* YOZISH-EKRANI (s8): muharrir-kartasi, topshiriq-paneli, yozilganlar jadvali */
  /* Fokus-yuza (L2.5): imzo-sahnadan past turadi, boshqa kartalardan accent-halqa bilan ajraladi */
  .wsp-ed { display: flex; flex-direction: column; gap: 8px; background: ${T.paper}; border-radius: 16px; padding: clamp(12px,2vw,17px); box-shadow: 0 14px 30px -15px rgba(${T.shadowBase},0.25), inset 0 0 0 2px ${T.accent}44; min-width: 0; }
  .wsp-ed-h { font-family: 'Manrope'; font-weight: 800; font-size: clamp(13.5px,1.7vw,15.5px); color: ${T.accent}; }
  .numrow { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .numlbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; color: ${T.ink2}; min-width: 0; overflow-wrap: anywhere; }
  .reflect-input.num { font-variant-numeric: tabular-nums; font-weight: 700; }
  .tasma { align-self: flex-start; font-family: 'Manrope'; font-weight: 600; font-size: 11.5px; line-height: 1.4; color: ${T.ink3}; background: ${T.bg}; border-radius: 9px; padding: 5px 11px; max-width: 100%; min-width: 0; overflow-wrap: anywhere; }
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
  /* A-12.1: kun raqami — neytral doira (yashil faqat qaytish) */
  .wsp-item-n { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: ${T.ink2}; color: #fff; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; }
  .wsp-item-t { flex: 1; font-family: 'Manrope'; font-weight: 700; font-size: clamp(12.5px,1.5vw,14px); color: ${T.ink}; line-height: 1.4; min-width: 0; overflow-wrap: anywhere; }
  .wsp-arw { font-style: normal; font-weight: 800; color: ${T.accent}; }
  .wsp-item-edit { flex-shrink: 0; background: none; border: none; cursor: pointer; font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.accent}; text-decoration: underline; text-underline-offset: 3px; border-radius: 8px; padding: 2px 6px; }
  .wsp-item-edit:hover { color: ${T.accent}; background: ${T.accentSoft}; }
  /* s8 (MD v2): bitta ustun — topshiriq-kartasi olindi, muharrir va Yordam bir-birining ostida */
  .wsp-one { display: flex; flex-direction: column; gap: 9px; width: 100%; max-width: 620px; min-width: 0; }
  .wsp-task { display: flex; flex-direction: column; gap: 5px; background: ${T.paper}; border-radius: 14px; padding: 11px 14px; box-shadow: 0 10px 24px -12px rgba(${T.shadowBase},0.2); min-width: 0; }
  .wsp-task-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: ${T.accent}; }
  .wsp-task-nom { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(15px,2vw,18px); color: ${T.ink}; line-height: 1.25; overflow-wrap: anywhere; min-width: 0; }

  /* BOSQICHLI OCHILISH (94-qonun): uch qadam-doirasi */
  .stps { display: flex; flex-wrap: wrap; gap: 8px; }
  .stp { display: inline-flex; align-items: center; gap: 7px; font-family: 'Manrope'; font-weight: 700; font-size: clamp(11.5px,1.4vw,13px); color: ${T.ink3}; background: ${T.paper}; border-radius: 99px; padding: 5px 12px 5px 5px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .stp i { font-style: normal; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: ${T.bg}; color: ${T.ink3}; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: 11px; }
  .stp.on { color: ${T.accent}; box-shadow: inset 0 0 0 1.5px ${T.accent}; }
  .stp.on i { background: ${T.accent}; color: #fff; }
  .stp.done { color: ${T.success}; box-shadow: inset 0 0 0 1.5px ${T.success}66; }
  .stp.done i { background: ${T.success}; color: #fff; }

  /* 81-qonun: kiritish-belgilari MA'NO rangida (qizil hech qachon). */
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
  .wsxrow { display: flex; gap: 18px; flex-wrap: wrap; align-items: flex-start; }
  /* 16-qonun: bu yopiladigan MATN, bo'sh joy emas — uzuq chiziqli quti EMAS, matn-havola. */
  .wsx { flex: none; min-width: 0; background: transparent; border: none; border-radius: 0; overflow: visible; }
  /* .wsx juftlik-qatorida flex: 1 bilan yashaydi; ekranning TO'G'RIDAN-TO'G'RI bolasi
     bo'lganda (s9 «Yordam») o'sha grow bo'sh balandlikni yutib, punktir quti hosil qilardi. */
  .screen > .wsx { flex: 0 0 auto; }
  .wsx.star { border-color: ${T.blue}66; }
  .wsx-toggle { width: auto; text-align: left; background: none; border: none; border-bottom: 1px solid ${T.line}; padding: 2px 0; font-family: 'Manrope'; font-weight: 700; font-size: 11.5px; color: ${T.ink2}; cursor: pointer; }
  .wsx-toggle:hover, .wsx-toggle:focus-visible { color: ${T.accent}; border-bottom-color: ${T.accent}; }
  .wsx.star .wsx-toggle:hover, .wsx.star .wsx-toggle:focus-visible { color: ${T.blue}; border-bottom-color: ${T.blue}; }
  .wsx-body { padding: 8px 0 0; display: flex; flex-direction: column; gap: 6px; animation: fade-step 0.25s ease-out; }
  .wsx-body p { font-size: 12.5px; color: ${T.ink2}; margin: 0; line-height: 1.45; overflow-wrap: anywhere; }
  .wsx-body b { color: ${T.ink}; }

  /* XULOSA-KARTASI (s2 · s4) va yordamchi qatorlar */
  .xul { background: ${T.paper}; border-radius: 14px; padding: clamp(13px,2vw,18px); display: flex; flex-direction: column; gap: 7px; box-shadow: 0 10px 24px -10px rgba(${T.shadowBase},0.2); }
  .xul-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.2vw,20px); color: ${T.ink}; }
  .xul-b { margin: 0; font-size: clamp(13.5px,1.6vw,15px); line-height: 1.5; color: ${T.ink2}; }
  .bhint { margin: 0; align-self: flex-start; font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.45; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 9px; padding: 7px 12px; min-width: 0; overflow-wrap: anywhere; }
  .bdone { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }

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
  }
  .cmt { background: ${T.bg}; border-radius: 13px; padding: 11px 13px; display: flex; flex-direction: column; gap: 9px; }
  .cmt.hunt { animation: cmt-hunt 1.7s ease-in-out infinite; }
  .cmt.calm { animation: none; }
  @keyframes cmt-hunt { 0%, 100% { box-shadow: 0 0 0 0 rgba(110,75,255,0.4); } 50% { box-shadow: 0 0 0 9px rgba(110,75,255,0); } }
  .cmt-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12px,1.5vw,13.5px); color: ${T.ink}; line-height: 1.45; min-width: 0; overflow-wrap: anywhere; }
  .cmt-fold { display: inline-flex; align-items: center; gap: 10px; align-self: flex-start; background: ${T.successSoft}; border-radius: 99px; padding: 7px 16px; box-shadow: inset 0 0 0 1.5px ${T.success}44; max-width: 100%; min-width: 0; overflow-wrap: anywhere; }
  .cmt-done { font-family: 'Manrope'; font-weight: 700; font-size: clamp(12px,1.5vw,13.5px); color: ${T.success}; animation: fade-step 0.3s ease-out; }
  .cmt-tip { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: clamp(12px,1.4vw,13px); line-height: 1.45; color: ${T.ink2}; background: ${T.accentSoft}; border-radius: 9px; padding: 8px 11px; min-width: 0; overflow-wrap: anywhere; animation: fade-step 0.3s ease-out; }
  @media (prefers-reduced-motion: reduce) { .cmt.hunt, .cmt-tip, .cmt-done, .fchoice.miss { animation: none; } .fchoice, .fchoice:hover { transition: none; transform: none; } }
  .kdpanel { position: relative; background: ${T.paper}; border-radius: 16px; padding: 11px 13px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.18); min-width: 0; transition: border-color 0.3s; }
  /* F-0926-05 #16: yashil ramka olindi — holatni tugma yoki yozuv aytadi */
  .kdreq { margin: 0; padding-left: 19px; display: flex; flex-direction: column; gap: 4px; }
  .kdreq li { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; line-height: 1.45; color: ${T.ink2}; overflow-wrap: anywhere; }
  .kd-skip { align-self: flex-start; background: none; border: none; cursor: pointer; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; text-decoration: underline; text-underline-offset: 3px; padding: 4px 6px; border-radius: 8px; transition: color 0.15s; }
  .kd-skip:hover { color: ${T.accent}; }
  .klaunch { display: flex; flex-direction: column; align-items: center; gap: 9px; text-align: center; background: ${T.paper}; border-radius: 18px; padding: clamp(15px,2.4vw,22px); box-shadow: 0 12px 28px -14px rgba(${T.shadowBase},0.22), inset 0 0 0 1.5px ${T.line}; min-width: 0; }
  .klaunch-lbl { font-family: 'Manrope'; font-weight: 800; font-size: clamp(12.5px,1.5vw,14px); color: ${T.accent}; }
  .klaunch-b { margin: 0; font-family: 'Manrope'; font-weight: 600; font-size: clamp(12.5px,1.5vw,14px); line-height: 1.5; color: ${T.ink2}; overflow-wrap: anywhere; }
  .klaunch-sub { font-family: 'Manrope'; font-weight: 600; font-size: 12.5px; color: ${T.ink3}; }
  .kod-launch-btn { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(15px,1.9vw,17px); background: ${T.accent}; color: #fff; border: none; border-radius: 14px; padding: 15px 34px; cursor: pointer; box-shadow: 0 14px 30px -8px rgba(91,61,230,0.6); transition: transform 0.18s, box-shadow 0.18s; }
  .kod-launch-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -8px rgba(110,75,255,0.72); }
  .kod-launch-btn:active { transform: translateY(0) scale(0.98); }
  @media (prefers-reduced-motion: reduce) { .kod-launch-btn { transition: none; transform: none !important; } }
  .lp-mstats { background: ${T.blueSoft}; border-radius: 12px; padding: 10px 13px; display: flex; flex-direction: column; gap: 5px; }

  /* RECAP (s12) */
  .rcp-flow { display: flex; flex-direction: column; gap: clamp(10px,1.6vw,14px); width: 100%; max-width: 620px; }
  /* A6: bajarilgan 1-qadam bitta qatorga yig'iladi — ↻ bilan qayta ochiladi */
  .rcp-said { display: inline-flex; align-items: center; gap: 10px; align-self: flex-start; background: ${T.paper}; border-radius: 99px; padding: 6px 8px 6px 16px; box-shadow: inset 0 0 0 1.5px ${T.line}; }
  .rcp-said-t { font-family: 'Manrope'; font-weight: 800; font-size: 13.5px; color: ${T.ink}; }

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
  .k-slide-h { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(19px,3vw,28px); color: ${T.ink}; margin: 0; }
  .k-slide-body { font-size: clamp(14.5px,1.9vw,17px); color: ${T.ink2}; line-height: 1.55; max-width: 620px; margin: 0; }
  /* KEYS-SAHNA (F-1002-70 · 165-qonun) */
  .ksc { position: relative; height: clamp(104px,15vh,148px); background: ${T.paper}; border-radius: 16px; overflow: hidden; flex-shrink: 0; box-shadow: 0 10px 24px -16px rgba(${T.shadowBase},0.3); }
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
  /* MAKET: streak qatori. Ilova ekrani kunduzgi — fon OQ, quyuq element yo'q. */
  /* A-12.1: to'lgan kun — 9-ekrandagi «kelgan kun» bilan bir xil (och binafsha fon, binafsha ramka),
     yashil emas. Bo'sh kun — fonsiz, ingichka kulrang ramka: to'lish fon paydo bo'lishi bilan ko'rinadi. */
  /* 🔴 s6 BO'SH MAYDON YIG'ILDI: ekranda turgan YAGONA karta (slayd · bashorat · ko'prik)
     qolgan joyni O'ZI to'ldiradi, matni markazda turadi. Karta siqilmaydi (60-qonun). */
  .screen.k-fill > .k-slide, .screen.k-fill > .kp-bet { flex-grow: 1; justify-content: space-evenly; }
  .screen.k-fill > .frame-soft { padding-block: clamp(16px,3.4vh,34px); } /* F-1002-69: o'rtaga tushirilmaydi */
  .screen.k-fill > .k-dots { flex-shrink: 0; }
  @media (min-width: 861px) {
    .screen.k-fill > .k-slide { padding: clamp(22px,3vw,34px) clamp(22px,3.4vw,40px); gap: 13px; }
    .screen.k-fill > .k-slide .k-slide-ic { font-size: clamp(40px,5.4vw,62px); }
    .screen.k-fill > .k-slide .k-slide-h { font-size: clamp(22px,3.4vw,33px); }
    .screen.k-fill > .k-slide .k-slide-body { font-size: clamp(15px,2.1vw,19.5px); max-width: 680px; }
    .screen.k-fill > .kp-bet:not(.answered) { padding: clamp(20px,2.8vw,32px) clamp(20px,3vw,36px); gap: 15px; }
    .screen.k-fill > .kp-bet:not(.answered) .k-slide-h { font-size: clamp(20px,2.9vw,28px); }
    .screen.k-fill > .frame-soft .body { font-size: clamp(15px,2vw,17px); }
  }
  @media (max-width: 860px) { .screen.k-fill > .k-slide, .screen.k-fill > .kp-bet, .screen.k-fill > .frame-soft { flex-grow: 0; } }
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
  .fc-done-emoji { width: 52px; height: 52px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'Manrope'; font-weight: 800; font-size: 26px; line-height: 1; color: #fff; background: ${T.success}; }
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
  .pmtask-v { font-family: 'Source Serif 4', serif; font-size: clamp(14px,1.8vw,16px); color: ${T.ink}; flex: 1; line-height: 1.4; min-width: 0; overflow-wrap: anywhere; }
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

  /* RECAP (s12) mukofot-blogi (106f-b): yozilgach ikki qator */
  .rcp-win { display: flex; flex-direction: column; gap: 3px; background: ${T.successSoft}; border-radius: 11px; padding: 9px 12px; min-width: 0; animation: fade-step 0.3s ease-out; }
  .rcp-win-t { font-family: 'Manrope'; font-weight: 800; font-size: 12.5px; color: ${T.success}; overflow-wrap: anywhere; }
  .rcp-win-s { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.ink2}; overflow-wrap: anywhere; }
  @media (prefers-reduced-motion: reduce) { .rcp-win { animation: none; } }
  /* Qulf-tugma yonidagi qadam-yorlig'i (30-qonun): qaysi qadam qolgani aytiladi */
  .wsp-go { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .wsp-need { font-family: 'Manrope'; font-weight: 700; font-size: 12px; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 9px; padding: 6px 11px; min-width: 0; overflow-wrap: anywhere; }
  /* Topshiriq-paneli ichidagi shart-ro'yxati: bajarilgani YASHIL (30-qonun naqshi) */
  .wsp-chk { display: flex; flex-direction: column; gap: 4px; margin-top: 2px; }
  .wsp-chk-i { display: flex; align-items: flex-start; gap: 7px; font-family: 'Manrope'; font-weight: 600; font-size: clamp(11.5px,1.35vw,12.5px); line-height: 1.4; color: ${T.ink3}; min-width: 0; overflow-wrap: anywhere; }
  .wsp-chk-i i { font-style: normal; flex-shrink: 0; font-weight: 800; color: ${T.ink3}; }
  .wsp-chk-i.on, .wsp-chk-i.on i { color: ${T.success}; }

  /* 🔴 YAKUN-EKRANI 58-QONUN BO'YICHA YIG'ILDI (1440×900 · 1280×800 da skrollsiz):
     matn, so'z kattaligi va tartib TEGILMAGAN — faqat ichki oraliq/padding qisqardi. */
  .s-fin { gap: clamp(7px,1vw,10px) !important; justify-content: space-between; }
  .next-lesson { margin: 0; text-align: center; font-size: clamp(13px,1.5vw,14.5px); line-height: 1.5; color: ${T.ink2}; }
  .next-lesson b { color: ${T.ink}; }
  .s-fin .ring-wrap { width: 104px; height: 104px; }
  .s-fin .ring-wrap svg { width: 100%; height: 100%; }
  .s-fin .ring-num { font-size: 26px; }
  .s-fin .ring-den { font-size: 17px; }
  .s-fin .cs-cta .cs-cap { padding: clamp(8px,1.05vw,13px) clamp(20px,3vw,36px); }
  .s-fin .card { padding: 12px 17px; }
  .s-fin .card-lbl { margin-bottom: 8px; }
  .s-fin .ach-badge { padding: 7px 8px; gap: 2px; }
  .s-fin .ach-badge-ic { font-size: 26px; }
  .s-fin .ach-badge.locked .ach-badge-ic { font-size: 20px; }
  .s-fin .hw-big { padding: clamp(14px,1.85vw,20px) clamp(26px,3.4vw,44px); gap: 4px; }
  .s-fin .hw-big-t { font-size: clamp(23px,3.2vw,30px); }
  /* 58-qonun: uy-vazifa kartasi ochilganda topshiriq IKKI USTUNGA yig'iladi —
     shartlar chapda, qadamlar o'ngda. Karta balandligi ikki barobar qisqaradi,
     yakun-sahifasi bir ko'z bilan ko'rinadigan holatga yaqinlashadi. */
  .s-fin .hw-chips { margin-bottom: 9px; }
  @media (min-width: 861px) {
    /* Uy-vazifa kartasi IKKI USTUN (M5-D9 pretsedenti): chapda «uyda nima qilasiz» +
       variant-chiplari, o'ngda tanlangan topshiriq-karta. Bola ikkalasini bir qarashda
       ko'radi (ETALON 32) va kartaning balandligi ikki barobar qisqaradi. */
    .s-fin .card:has(.hw-chips) { display: grid; grid-template-columns: minmax(0,300px) minmax(0,1fr); column-gap: clamp(12px,1.8vw,18px); align-items: start; }
    .s-fin .card:has(.hw-chips) > .card-lbl, .s-fin .card:has(.hw-chips) > .body, .s-fin .card:has(.hw-chips) > .hw-chips { grid-column: 1; }
    .s-fin .card:has(.hw-chips) > .body { margin-bottom: 8px !important; }
    .s-fin .card:has(.hw-chips) > .hw-chips { margin-bottom: 0; }
    .s-fin .card:has(.hw-chips) > .pmtask, .s-fin .card:has(.hw-chips) > .frame-soft { grid-column: 2; grid-row: 1 / span 3; }
    /* Topshiriq-kartaning ichi ham yoyiladi: shapka ustda, shartlar chapda, qadamlar o'ngda */
    .s-fin .pmtask { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
    .s-fin .pmtask-head { grid-column: 1 / -1; padding: 7px 15px; }
    .s-fin .pmtask-steps { border-left: 1px solid ${T.line}; padding: 9px 14px 11px; gap: 7px; }
    .s-fin .pmtask-row { padding: 6px 14px; gap: 9px; }
    .s-fin .pmtask-k { flex: 0 0 clamp(58px,7.2vw,78px); }
    .s-fin .pmtask-v { font-size: clamp(13px,1.55vw,14.5px); line-height: 1.35; }
    .s-fin .card .body { font-size: clamp(13px,1.55vw,14.5px); line-height: 1.45; }
    .s-fin .pmtask-step { font-size: clamp(12.5px,1.5vw,13.5px); }
  }

  /* (b) BO'SH MAYDON YIG'ILDI — «flex-grow + max-height» naqshi (B2 pretsedenti):
     ekranda turgan asosiy sahna qolgan balandlikni cheklangan holda o'zlashtiradi. */
  @media (min-width: 861px) {
    .screen > .hrow.two { flex-grow: 1; max-height: 216px; }
    .screen > .hrow.two .hopt { justify-content: center; }
    .screen > .s1demo { flex-grow: 1; max-height: 300px; justify-content: center; }
    /* s8 — yozish-ekrani: topshiriq-paneli cho'ziladi, muharrir-kartasi O'SMAYDI */
    .screen > .split:not(.s4):not(.kod):not(.sum2) { flex-grow: 1; align-items: stretch; max-height: 424px; }
    .split:not(.s4):not(.kod):not(.sum2) > .col { min-height: 0; }
    /* F-0926-05 #17: muharrir-kartasi cho'zilmaydi — ichidagiga mos (1-hafta kichik, har hafta bilan o'sadi); maydon tepada, joyidan qimirlamaydi */
    /* F-0926-05 #17: Yordam topshiriq-paneli ostida turadi — karta cho'zilmagach ustun oyog'ida bo'sh joyda osilib qolardi */
    /* s10 — ikki karta o'rtada turadi, cheklangan balandlikda */
    .screen > .split.kod { flex-grow: 1; align-items: stretch; max-height: 320px; }
    /* F-0926-05 #20: .cmt cho'zilmaydi — ichidagiga mos (159/13) */
    .screen > .cmt .gt-rows { gap: clamp(7px,1.4vh,13px); }
    .screen:has(.pod-card) { justify-content: center; }
    .s-fin { padding-bottom: 10px; }
    .split.kod > .col { min-height: 0; }
    .split.kod .klaunch { flex-grow: 1; justify-content: center; }
    .split.kod .kdpanel { flex-grow: 1; }
    /* s4 — KALENDAR: sahna va fakt-paneli balandligini OLDINDAN egallaydi: kun ochilganda
       kataklar va panel SAKRAMAYDI, bola o'zgargan sonlarga qaraydi. */
    .screen > .kln { flex-grow: 1; max-height: 244px; }
    .screen > .split.s4 { flex-grow: 1; align-items: stretch; max-height: 220px; }
    .split.s4 > .col { min-height: 0; }
    .split.s4 > .col:first-child { justify-content: flex-start; }
    .split.s4 .fakt { flex-grow: 1; overflow: hidden; }
    /* s9 — belgilash-jadvali qolgan joyni to'ldiradi (raundlar orasida siljimaydi) */
    .screen > .mrk { flex-grow: 1; max-height: 300px; }
    /* F-0926-05 #20: .rcp-flow cho'zilmaydi — karta ichidagiga mos balandlikda (bo'm-bo'sh quti yo'q) */
  }
  /* Baland ekran (1080p va undan yuqori): fakt-paneli qatorlari kattaroq bo'ladi —
     s4 pastki qatoriga 40px qo'shiladi, aks holda 5-kun yozuvi kesilib qoladi. */
  @media (min-width: 861px) and (min-height: 941px) {
    .screen > .split.s4 { max-height: 262px; }
  }

  /* 🔴 58-QONUN — PAST-DESKTOP TIER (1440×900 · 1280×800 da s4 kalendari skrollsiz).
     Faqat ichki oraliq/padding/ikkilamchi yorliq qisqaradi: MATN, tartib va ranglar
     TEGILMAGAN, hech bir karta siqilmaydi (60-qonun). */
  @media (max-height: 940px) {
    .screen { gap: clamp(8px,1.1vw,10px) !important; }
    .mentor { gap: 10px; }
    .mentor-ava { width: 36px; height: 36px; }
    .mentor-msg { padding: 9px 14px; }
    .kln, .mrk { gap: 5px; padding: clamp(8px,1.3vw,11px); }
    .kln-marks { min-height: 48px; padding: 5px 4px; }
    .kln-mark { width: 8px; height: 8px; }
    .kln-cell { padding: 4px 3px; }
    .mrk-cell { min-height: 38px; font-size: 16px; }
    .ctl, .fakt { padding: clamp(10px,1.5vw,13px); }
    .ctl { gap: 7px; }
    .fakt { gap: 5px; }
    .ctl-btn { padding: 10px 19px; }
    .fakt-row { padding: 5px 9px; }
    .fakt-row i { font-size: 11px; line-height: 1.35; }
    .xul { padding: clamp(11px,1.6vw,14px) clamp(13px,1.9vw,17px); gap: 4px; }
    .xul-h { font-size: clamp(15px,1.8vw,16.5px); line-height: 1.25; }
    .xul-b { font-size: clamp(12.5px,1.45vw,13.5px); line-height: 1.4; }
  }
  @media (max-height: 850px) {
    .stage-header { padding-top: clamp(9px,1.5vw,13px); padding-bottom: clamp(6px,1.2vw,9px); }
    .stage-nav { padding-top: clamp(9px,1.5vw,11px); padding-bottom: clamp(9px,1.5vw,11px); }
    .progress-track { margin-bottom: 8px; }
    .stage-content { padding-top: clamp(7px,1.2vw,10px); padding-bottom: clamp(10px,1.6vw,14px); }
    .screen { gap: clamp(7px,1vw,9px) !important; }
    .kln-marks { min-height: 42px; }
    .mrk-cell { min-height: 35px; }
    .mentor-msg { padding: 8px 13px; }
    .mentor-ava { width: 32px; height: 32px; }
    .ctl-sub { font-size: 11.5px; }
    .fakt-row i { font-size: 10.5px; }
    .xul { padding: 10px 13px; }
    .xul-h { font-size: clamp(14.5px,1.7vw,15.5px); }
    .h-title { font-size: clamp(20px,3vw,32px); }
    .mentor-msg .body, .mentor-msg { font-size: 14.5px; }
    /* YAKUN-EKRANI shu pog'onada ham skrollsiz: faqat ichki oraliq qisqaradi,
       so'z kattaligi va tartib TEGILMAYDI (kapsula-qonuni). */
    .s-fin .ring-wrap { width: 92px; height: 92px; }
    .s-fin .cs-cta .cs-cap { padding: clamp(7px,0.9vw,10px) clamp(18px,2.6vw,32px); }
    .s-fin .card { padding: 10px 15px; }
    .s-fin .card-lbl { margin-bottom: 6px; }
    .s-fin .hw-big { padding: clamp(11px,1.5vw,15px) clamp(22px,3vw,40px); }
    .s-fin .ach-badge { padding: 6px 8px; }
  }
  /* Uchinchi pog'ona — 1366×768 kabi past noutbuk ekrani (s4 shu yerda ham skrollsiz) */
  @media (max-height: 790px) {
    .stage-content { padding-bottom: clamp(9px,1.4vw,11px); }
    .kln, .mrk { gap: 4px; padding: 8px; }
    .kln-marks { min-height: 38px; }
    .kln-day, .mrk-day { padding: 3px 2px; }
    .mrk-cell { min-height: 32px; }
    .fakt-row { padding: 4px 8px; }
    .xul { padding: 8px 12px; }
    .xul-b { font-size: 12.5px; }
    .mentor-msg { padding: 7px 12px; }
    .ctl { padding: 9px 11px; }
    .ctl-btn { padding: 9px 17px; }
    /* 1366×768: yakun-ekrani (arena kapsulasi + uy-vazifa) shu pog'onada ham to'liq sig'adi */
    .s-fin { gap: 6px !important; }
    .s-fin .card { padding: 9px 14px; }
    .s-fin .cs-cta .cs-cap { padding: clamp(6px,0.8vw,9px) clamp(16px,2.4vw,30px); }
    .s-fin .hw-big { padding: clamp(9px,1.3vw,13px) clamp(20px,2.8vw,38px); }
    .s-fin .hw-big-wrap::before { inset: -12px; }
    .s-fin .ach-badge-ic { font-size: 23px; }
    .s-fin .ach-badge.locked .ach-badge-ic { font-size: 18px; }
  }
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
  @media (prefers-reduced-motion: reduce) { .rc-open-mini, .rc-open-mini:hover { transition: none; transform: none; } }

  .rc-overlay { position: fixed; inset: 0; z-index: 10005; background: ${T.bg}; display: flex; flex-direction: column; align-items: center; padding: clamp(14px,3vw,32px); overflow-y: auto; animation: fade-step 0.3s ease-out; font-family: 'Manrope', sans-serif; }
  .rc-head { width: 100%; max-width: 880px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .rc-tag { font-weight: 800; font-size: clamp(11px,1.4vw,13px); letter-spacing: 0.1em; text-transform: uppercase; color: ${T.accent}; background: ${T.accentSoft}; border-radius: 99px; padding: 6px 14px; white-space: nowrap; }
  .rc-title { font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(16px,2.4vw,22px); color: ${T.ink}; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .rc-x { background: ${T.paper}; border: none; border-radius: 10px; width: 36px; height: 36px; font-size: 15px; color: ${T.ink2}; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 12px -4px rgba(${T.shadowBase},0.22); transition: all 0.2s; }
  .rc-x:hover { color: ${T.accent}; }
  .rc-card { flex: 1; width: 100%; max-width: 880px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: clamp(10px,2.2vw,20px); padding: clamp(16px,3vw,28px) 0; animation: fade-step 0.35s ease-out; }
  .rc-ic { width: clamp(52px,8vw,72px); height: clamp(52px,8vw,72px); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: clamp(24px,3.6vw,34px); line-height: 1; color: ${T.accent}; background: ${T.accentSoft}; }
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

  /* ===== 58/60-QONUN: YAKUN-EKRAN, TOPSHIRIQ-KARTA OCHIQ HOLATI (M5-D9 pretsedenti) =====
     Bu blok hamma media-so'rovdan KEYIN turadi — past-desktop qoidalarini ham bosadi.
     Kapsula bosilgan: u o'z ishini bajardi va ixcham yorliqqa aylanadi, sahna esa
     topshiriqqa beriladi. Sarlavha, CodeStrike so'zi va recap qatorlarining SO'Z
     KATTALIGI TEGILMAYDI — faqat bo'shliq, joylashuv va ikkilamchi bezak zichlashadi. */
  .stage-content:has(.hw-chips) { padding-top: 5px; padding-bottom: 4px; }
  .stage-content > .screen:has(.hw-chips) { gap: 5px !important; }
  .lesson-root:has(.hw-chips) .stage-header { padding-top: 8px; padding-bottom: 6px; }
  .lesson-root:has(.hw-chips) .stage-nav { padding-top: 9px; padding-bottom: 9px; }
  .screen:has(.hw-chips) .hero { gap: 6px; }
  .screen:has(.hw-chips) .done-chip { padding: 3px 11px; }
  .screen:has(.hw-chips) .ring-wrap { width: 68px; height: 68px; }
  .screen:has(.hw-chips) .ring-num { font-size: 21px; }
  .screen:has(.hw-chips) .ring-den { font-size: 15px; }
  .screen:has(.hw-chips) .ring-lbl { font-size: 9px; margin-top: 1px; }
  .screen:has(.hw-chips) .cs-cta .cs-cap { gap: 4px; }
  .screen:has(.hw-chips) .cs-hud-i { padding: 4px 12px; }
  .screen:has(.hw-chips) .card { padding: 9px 13px; }
  .screen:has(.hw-chips) .card-lbl { margin-bottom: 4px; }
  .screen:has(.hw-chips) .recap { gap: 3px; }
  .screen:has(.hw-chips) .recap li { line-height: 1.28; }
  /* «Endi siz bilasiz» kengroq ustunga o'tadi — to'rt xulosa BIR QATORDAN bo'lib qoladi
     (matn o'zgarmaydi, faqat qator uzunligi yetadi); nishonlar esa bitta tasmaga tushadi. */
  .screen:has(.hw-chips) .split.sum2 { grid-template-columns: minmax(0,1.55fr) minmax(0,1fr); }
  .screen:has(.hw-chips) .split.sum2 .ach-grid { grid-template-columns: repeat(4, minmax(0,1fr)); gap: 6px; }
  .screen:has(.hw-chips) .ach-badge { padding: 6px 5px; gap: 2px; min-width: 0; }
  .screen:has(.hw-chips) .ach-badge-name { min-width: 0; overflow-wrap: anywhere; }
  .screen:has(.hw-chips) .ach-badge-ic { font-size: 22px; }
  .screen:has(.hw-chips) .ach-badge.locked .ach-badge-ic { font-size: 18px; }
  .screen:has(.hw-chips) .ach-badge-desc { display: none; }
  /* Bosilgan kapsula ixcham yorliqqa aylanadi: ikki so'z bir qatorda, yonma-yon */
  .screen:has(.hw-chips) .hw-big-wrap { width: min(390px, 100%); }
  .screen:has(.hw-chips) .hw-big { flex-direction: row; align-items: baseline; justify-content: center; gap: 9px; padding: 6px clamp(16px,2vw,22px); border-radius: 15px; }
  .screen:has(.hw-chips) .hw-big-t { font-size: clamp(16px,1.9vw,19px); }
  .screen:has(.hw-chips) .hw-big-s { font-size: clamp(11.5px,1.4vw,13px); }
  .screen:has(.hw-chips) .hw-big-wrap::before { inset: -7px; }
  .screen:has(.hw-chips) .hw-sky { opacity: 0.7; }
  /* Topshiriq-karta: chap ustun kengroq (izoh uch qatorga sig'adi), o'ngda kartaning o'zi —
     shartlar chapda, qadamlar o'ngda (ikkalasi bir qatorda ko'rinadi). */
  .s-fin .card:has(.hw-chips) { grid-template-columns: minmax(0,345px) minmax(0,1fr); }
  .s-fin .card:has(.hw-chips) .pmtask-head { padding: 6px 13px; }
  .s-fin .card:has(.hw-chips) .pmtask-row { padding: 5px 12px; gap: 8px; }
  .s-fin .card:has(.hw-chips) .pmtask-steps { padding: 7px 12px 8px; gap: 5px; }
  .s-fin .card:has(.hw-chips) .pmtask-step { line-height: 1.35; }
  @media (max-width: 860px) {
    .s-fin .card:has(.hw-chips) { grid-template-columns: 1fr; }
    .screen:has(.hw-chips) .hw-big { flex-direction: column; }
  }
`;
// ============================================================ LESSON ROOT
export default function PmLesson21({ lang: langProp, onFinished, liveToken }) {
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
